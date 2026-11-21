/* =====================================================================
 * ch04.js · 第 4 章「高级 SQL：视图、约束、触发器与编程」
 * 职责：把 SQL 从「查数据」扩展到「建 schema、管权限、写逻辑」：
 *       视图与物化视图、约束与外键动作、授权、触发器、存储过程与接口。
 * 依据：CSC3170 讲义 Advanced SQL / Triggers & Views 部分（Part 9–11、Tutorial 5–6）。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch04',
  num: '04',
  title: '高级 SQL：视图、约束、触发器与编程',
  en: 'ADVANCED SQL: VIEWS, CONSTRAINTS, TRIGGERS & PROGRAMMING',
  goals: [
    '判断一个视图是否可更新，并用 WITH CHECK OPTION 阻止越界写入',
    '用外键动作、CHECK 与唯一约束把业务规则下沉到数据库，并说明为什么断言通常要用触发器实现',
    '用 GRANT/REVOKE 与角色设计最小权限，理解视图作为列级与行级安全手段的用法',
    '写出 BEFORE/AFTER 触发器并判断该用行级还是语句级，同时说清触发器的三个危险',
    '用存储过程封装事务性逻辑，并说明 SQL 与宿主语言之间的阻抗不匹配与注入防护'
  ],
  kp: [
    { id: 'ch04-1', title: '视图：把查询存起来' },
    { id: 'ch04-2', title: '可更新视图与 WITH CHECK OPTION' },
    { id: 'ch04-3', title: '约束：外键动作、CHECK 与断言的缺席' },
    { id: 'ch04-4', title: '授权：GRANT、REVOKE 与最小权限' },
    { id: 'ch04-5', title: '触发器：行级与语句级，能做什么不能做什么' },
    { id: 'ch04-6', title: '存储过程、函数与游标' },
    { id: 'ch04-7', title: 'SQL 与宿主语言：阻抗不匹配与注入' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么「会写查询」还不够', html: '真实系统里，规则不能只活在应用代码里。三个应用同时写同一张表，其中一个忘了校验「成绩必须在 0–100」，脏数据就进来了——而数据库是<b>唯一所有写入都必须经过的关卡</b>。这一章讲的就是怎么把规则下沉到这一层：视图控制「谁能看到什么」，约束控制「什么值能进来」，触发器补充约束表达不了的动作，授权控制「谁能做什么」。四件工具配合，才构成一个不会被绕过的一致性边界。' },

    { t: 'p', lead: true, html: '前两章都在「读」数据。这一章转向「建」与「管」：DDL 定义结构，DCL 管理权限，触发器与存储过程把逻辑放进数据库。学完你应该能回答一个设计问题——<b>某条业务规则，究竟该写在应用里、约束里，还是触发器里？</b>判断标准不是「哪个方便」，而是「谁能绕过它」。' },

    { t: 'h', lvl: 2, text: '一、视图：把查询存起来', id: 'ch04-1' },

    { t: 'p', html: '<b>视图（view）</b>是一条被命名的查询，本身不存数据（普通视图），每次引用时重新执行定义。它带来三个实际好处：<b>简化</b>（把五表连接藏在一个名字后面）、<b>逻辑独立</b>（底层表加列、拆表时改视图定义即可，应用代码不动）、<b>安全</b>（只暴露需要的列与行）。' },

    { t: 'p', html: '安全和简化这两个好处经常同时出现。比如「学生只能看到自己的成绩」，可以把过滤条件写进视图，再只把视图的 <code>SELECT</code> 权限授给应用账号，基表权限一概不给。此时<b>视图就是行级安全的载体</b>——应用即使写错查询，也看不到别人的数据。' },

    { t: 'code', lang: 'sql', caption: '把「我的成绩单」做成视图，并只授予视图权限', code: `CREATE VIEW my_transcript AS
SELECT e.sid, c.cid, c.title, e.semester, e.grade
FROM   enroll e JOIN course c ON c.cid = e.cid
WHERE  e.sid = CURRENT_USER();      -- 只暴露当前登录者自己的行

GRANT SELECT ON my_transcript TO app_student;
-- 注意：不授予 enroll / course 的任何权限

-- 物化视图（MySQL 无原生支持，用表 + 定时刷新模拟）
CREATE TABLE mv_course_stat AS
SELECT cid, COUNT(*) AS n, AVG(grade) AS avg_grade
FROM   enroll GROUP BY cid;` },

    { t: 'p', html: '与普通视图相对的是<b>物化视图（materialized view）</b>：把查询结果真的存下来，读的时候不再计算，代价是<b>数据会过期</b>，需要刷新策略（定时全量、增量、或在基表变更时触发）。选择标准很清楚：<b>查询贵且能容忍延迟 → 物化；要实时且查询不贵 → 普通视图</b>。报表类场景几乎总是前者，因为一条跨五表的分组聚合可能跑几十秒，而报表允许「截至昨晚」的数据。' },

    { t: 'h', lvl: 2, text: '二、可更新视图与 WITH CHECK OPTION', id: 'ch04-2' },

    { t: 'p', html: '视图能不能被 <code>INSERT/UPDATE/DELETE</code>，取决于 DBMS 能否把这次修改<b>无歧义地映射回基表</b>。SQL 标准给出的可更新条件是：视图只涉及一张基表、不含聚合与 <code>DISTINCT</code>、不含 <code>GROUP BY</code> 与 <code>HAVING</code>、不含 <code>UNION</code>、<code>SELECT</code> 列表里不含表达式（或虽含但可逆），且必须包含基表的主键。' },

    { t: 'p', html: '只涉及一张表这个条件最容易被忽视。上面那个 <code>my_transcript</code> 连接了 <code>enroll</code> 与 <code>course</code>，<b>它不可更新</b>——一条 <code>UPDATE</code> 到底该改哪张表？DBMS 无法回答。想让成绩单可改，得拆成两个视图：一个只读的展示视图，一个单表的可写视图。' },

    { t: 'p', html: '还有一个隐蔽的坑：可更新视图上的写入<b>可以「消失」</b>。设视图定义为 <code>WHERE grade &gt;= 60</code>，你通过它 <code>INSERT</code> 一行 <code>grade = 50</code>，插入成功——但这行不满足视图条件，之后从视图里查不到它。数据没丢，只是「写进去就看不见」，比报错更难排查。<code>WITH CHECK OPTION</code> 就是为此而设：它让 DBMS 在写入后检查该行是否仍满足视图条件，不满足则拒绝。' },

    { t: 'code', lang: 'sql', caption: 'WITH CHECK OPTION：阻止「写进去却看不见」的行', code: `CREATE VIEW passing_enroll AS
SELECT * FROM enroll WHERE grade >= 60
WITH CHECK OPTION;        -- 关键：写入后必须仍满足 grade >= 60

INSERT INTO passing_enroll (sid, cid, semester, grade)
VALUES ('S001', 'C3170', '2026SP', 50);
-- 报错：CHECK OPTION failed，而不是静默插入一行查不到的数据` },

    { t: 'h', lvl: 2, text: '三、约束：外键动作、CHECK 与断言的缺席', id: 'ch04-3' },

    { t: 'p', html: '约束是数据库里<b>唯一无法被应用绕过</b>的规则形式。上一章用过的 <code>PRIMARY KEY</code>、<code>FOREIGN KEY</code>、<code>CHECK</code>、<code>UNIQUE</code>、<code>NOT NULL</code> 各有分工，其中外键的<b>引用动作</b>最需要设计决策：父行被删时子行怎么办？' },

    { t: 'table', caption: '五种外键动作的语义与适用场景', head: ['动作', '父行删除/更新时', '子行结果', '适用'], rows: [
      ['<code>RESTRICT</code> / <code>NO ACTION</code>', '若有子行引用则拒绝', '不变，操作失败', '默认选择，最安全，逼调用方显式处理'],
      ['<code>CASCADE</code>', '连带删除或更新子行', '被删除/更新', '从属数据，如选课记录随学生删除'],
      ['<code>SET NULL</code>', '把子行外键置 NULL', '保留，关联断开', '可选关联，如课程删除后成绩记录保留但无课程'],
      ['<code>SET DEFAULT</code>', '把子行外键改成默认值', '保留，指向默认行', '很少用，需要存在默认行，多数产品支持不全']
    ] },

    { t: 'p', html: '<code>CASCADE</code> 看起来最省事，实则最危险：一条 <code>DELETE FROM student</code> 可能连锁删掉几万条成绩。工程惯例是<b>默认用 RESTRICT，只在关系确实是「整体—部分」时才用 CASCADE</b>，并且删父行前先在应用层做二次确认。这与「删库跑路」的笑话是一回事，只是规模小一点。' },

    { t: 'p', html: '标准 SQL 还有一种更强的约束叫<b>断言（assertion）</b>：<code>CREATE ASSERTION 名字 CHECK (条件)</code>，条件里可以带子查询，能表达「任何时刻，每个学生的选课数不超过 8 门」这种跨表、跨行的规则。<b>问题是几乎没有产品实现它</b>——因为检查代价可能极高（每次写入都要扫全表），难以增量维护。' },

    { t: 'p', html: '于是实际工程里，跨表规则有三条替代路径：<b>触发器</b>（见下一节，最灵活也最容易被滥用）、<b>存储过程封装写入</b>（把写操作收口到一个入口）、<b>应用层事务</b>（在同一个事务里先查后写，靠隔离级别保证不冲突）。三者都弱于真正的断言：前两者能被绕过（直接 <code>INSERT</code> 就跳过存储过程），后者依赖并发控制正确。<b>这就是「为什么课本讲断言、工程却不用」的答案</b>。' },

    { t: 'h', lvl: 2, text: '四、授权：GRANT、REVOKE 与最小权限', id: 'ch04-4' },

    { t: 'p', html: '权限模型只有三个概念：<b>主体</b>（用户或角色）、<b>客体</b>（表、视图、列）、<b>动作</b>（<code>SELECT</code>、<code>INSERT</code>、<code>UPDATE</code>、<code>DELETE</code>、<code>REFERENCES</code>、<code>EXECUTE</code> 等）。<code>GRANT 动作 ON 客体 TO 主体</code> 授予，<code>REVOKE</code> 收回。' },

    { t: 'p', html: '两个常考细节。<b>一是 <code>WITH GRANT OPTION</code></b>：被授权者可以把权限继续转授，形成授权链；<code>REVOKE ... CASCADE</code> 会沿链收回所有下游授权，而 <code>RESTRICT</code> 在有下游授权时直接拒绝。<b>二是角色（role）</b>：先建角色、给角色授权、再把角色授予用户；用户离职时只收回角色，比逐个对象 <code>REVOKE</code> 可靠得多。' },

    { t: 'code', lang: 'sql', caption: '用角色组织权限，避免逐个对象授予', code: `CREATE ROLE app_read;
GRANT  SELECT ON student, course, enroll TO app_read;

CREATE ROLE app_write;
GRANT  INSERT, UPDATE, DELETE ON enroll TO app_write;

GRANT  app_read  TO alice, bob;
GRANT  app_write TO alice;            -- alice 可读可写，bob 只读

REVOKE app_write FROM alice;          -- 收回角色即可，不必逐表 REVOKE` },

    { t: 'p', html: '遵循<b>最小权限原则（principle of least privilege）</b>：应用账号只给业务真正需要的动作。一个典型反例是「所有服务共用一个 root 账号」——一旦某个服务的注入漏洞被利用，攻击者就能 <code>DROP TABLE</code>。正确的做法是每个服务一个账号，只授它那张视图的 <code>SELECT</code> 与它那张表的 <code>INSERT</code>，删表权限只给迁移脚本。' },

    { t: 'h', lvl: 2, text: '五、触发器：行级与语句级，能做什么不能做什么', id: 'ch04-5' },

    { t: 'p', html: '<b>触发器（trigger）</b>是绑定在表上的「事件—动作」规则：<code>BEFORE</code> 或 <code>AFTER</code> 某个 <code>INSERT/UPDATE/DELETE</code> 时自动执行一段代码。两个维度决定行为：<b>时机</b>（<code>BEFORE</code> 可以改即将写入的值，<code>AFTER</code> 只能读已写入的值、常用于写审计表）与<b>粒度</b>（<code>FOR EACH ROW</code> 行级，每行触发一次；语句级每条语句触发一次，适合做整体校验）。' },

    { t: 'code', lang: 'sql', caption: 'AFTER INSERT 触发器：自动维护审计表', code: `CREATE TRIGGER trg_enroll_audit
AFTER INSERT ON enroll
FOR EACH ROW
BEGIN
  INSERT INTO enroll_audit (sid, cid, semester, grade, changed_at, action)
  VALUES (NEW.sid, NEW.cid, NEW.semester, NEW.grade, NOW(), 'INSERT');
END;` },

    { t: 'p', html: '触发器里用 <code>NEW</code> 引用新行、<code>OLD</code> 引用旧行：<code>INSERT</code> 只有 <code>NEW</code>，<code>DELETE</code> 只有 <code>OLD</code>，<code>UPDATE</code> 两者都有。<code>BEFORE</code> 触发器可以直接给 <code>NEW.列</code> 赋值（MySQL 语法），这是「自动填充 <code>updated_at</code>」这类需求的常见实现方式。' },

    { t: 'p', html: '触发器能做什么，教科书列得很清楚：维护汇总表、写审计日志、实现断言表达不了的跨表规则、模拟 <code>CHECK</code> 不支持的子查询校验。<b>但它有三个危险</b>，每一个都在真实事故里出现过：<b>级联触发</b>（A 的触发器改 B，B 的触发器又改 A，无限递归直到栈溢出，多数产品用递归深度上限兜住）；<b>看不见的逻辑</b>（应用开发者不知道有触发器，一次批量 <code>UPDATE</code> 引爆几十万次触发器，性能断崖）；<b>不可移植</b>（各家语法差异极大，迁移时几乎要重写）。' },

    { t: 'p', html: '因此有一条实用守则：<b>触发器只做「不改业务语义」的旁路工作</b>——审计、时间戳、缓存失效。凡是会拒绝写入、改变写入结果的规则，优先用约束；约束表达不了时，宁可把逻辑收口到存储过程，也不要在触发器里写业务分支。' },

    { t: 'h', lvl: 2, text: '六、存储过程、函数与游标', id: 'ch04-6' },

    { t: 'p', html: '<b>存储过程（stored procedure）</b>把一段 SQL 存在数据库里，应用调用名字即可。好处是<b>减少网络往返</b>（一次调用完成十次查询）、<b>逻辑集中</b>（三个应用共用同一段逻辑）、<b>权限收口</b>（只授 <code>EXECUTE</code>，不给表权限）。参数有三种模式：<code>IN</code> 只进、<code>OUT</code> 只出、<code>INOUT</code> 进出兼用。' },

    { t: 'code', lang: 'sql', caption: '存储过程 + 显式事务：把「选课」封装成一个原子操作', code: `CREATE PROCEDURE enroll_student(
  IN  p_sid CHAR(8),
  IN  p_cid CHAR(6),
  IN  p_sem VARCHAR(10),
  OUT p_msg VARCHAR(64)
)
BEGIN
  DECLARE v_cnt INT DEFAULT 0;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN ROLLBACK; SET p_msg = 'failed'; END;

  START TRANSACTION;
  SELECT COUNT(*) INTO v_cnt FROM enroll
   WHERE sid = p_sid AND semester = p_sem;
  IF v_cnt >= 8 THEN
    SET p_msg = 'exceed limit';
    ROLLBACK;
  ELSE
    INSERT INTO enroll (sid, cid, semester) VALUES (p_sid, p_cid, p_sem);
    COMMIT;
    SET p_msg = 'ok';
  END IF;
END;` },

    { t: 'p', html: '注意过程里的 <code>START TRANSACTION</code> 与 <code>ROLLBACK</code>：这段逻辑包含「先查后写」，必须在一个事务里完成，否则两个并发请求可能同时通过「未满 8 门」的检查，最终写出 9 门。<b>把事务边界放进过程内部</b>是这个模式的关键；若交给应用层，调用方漏了事务就前功尽弃。' },

    { t: 'p', html: '<b>游标（cursor）</b>用于逐行处理结果集：<code>DECLARE</code> 定义、<code>OPEN</code>、<code>FETCH</code> 循环、<code>CLOSE</code>。它是 SQL 从「集合处理」退回「逐行处理」的逃生口，代价是慢——每 <code>FETCH</code> 一次都是一次上下文切换。教学上必须知道它，实践中应优先用集合操作（一条 <code>UPDATE ... FROM</code> 代替循环）。' },

    { t: 'h', lvl: 2, text: '七、SQL 与宿主语言：阻抗不匹配与注入', id: 'ch04-7' },

    { t: 'p', html: '应用代码用对象（或结构体）表示数据，SQL 用集合与关系表示数据，两者的形状对不上，这个矛盾叫<b>阻抗不匹配（impedance mismatch）</b>。三个具体表现：<b>类型系统不同</b>（对象引用 vs 外键、继承 vs 单表/多表映射）；<b>粒度不同</b>（一个对象可能对应三张表的行）；<b>导航方式不同</b>（代码里 <code>student.enrollments</code> 是遍历，SQL 里是连接）。ORM 框架的存在就是为了填这道缝，代价是它生成的 SQL 常常不如手写——尤其是 <b>N+1 查询</b>：取 100 个学生再逐个取选课，实际发出 101 条 SQL。' },

    { t: 'p', html: '比阻抗不匹配更严重的是<b>SQL 注入（SQL injection）</b>。把用户输入拼进 SQL 字符串，输入 <code>&#39; OR &#39;1&#39;=&#39;1</code> 就能让 <code>WHERE</code> 恒真。防护只有一条可靠路径：<b>参数化查询（prepared statement）</b>——SQL 结构与数据分开传输，数据永远只当值，不当语法。转义函数与黑名单关键词都不可靠，因为编码与方言的组合空间太大。' },

    { t: 'code', lang: 'sql', caption: '注入的原理与参数化的写法', code: `-- 危险：字符串拼接，输入 ' OR '1'='1 后 WHERE 恒真
SELECT * FROM student WHERE name = '<用户输入>';

-- 危险：即使用转义，也可能被多字节编码绕过
-- 正确：参数化，占位符由驱动绑定，数据不参与语法解析
--   Java:  ps = conn.prepareStatement("SELECT * FROM student WHERE name = ?");
--          ps.setString(1, name);
--   Python: cur.execute("SELECT * FROM student WHERE name = %s", (name,))` },

    { t: 'p', html: '还有一个容易被忽视的层面：<b>视图 + 授权本身就是安全设计的一部分</b>。应用账号只拥有视图的 <code>SELECT</code>，即使注入成功，能读到的也只是当前用户的行，能做的也只是 <code>SELECT</code>。这叫<b>纵深防御（defense in depth）</b>——不指望某一层不出错，而是让任何一层的失守都不足以造成灾难。' },

    { t: 'terms', items: [
      { en: 'view', zh: '视图', html: '被命名的查询，不存数据；用于简化、逻辑独立与行列级安全。' },
      { en: 'materialized view', zh: '物化视图', html: '把查询结果存下来，读得快但会过期，需要刷新策略。' },
      { en: 'WITH CHECK OPTION', zh: '检查选项', html: '视图上的写入必须仍满足视图条件，阻止「写进去却查不到」的行。' },
      { en: 'assertion', zh: '断言', html: '可带子查询的全局约束，标准有而产品几乎不实现，实践中用触发器或过程替代。' },
      { en: 'least privilege', zh: '最小权限', html: '只授予业务真正需要的动作，用角色而非逐对象授权来组织。' },
      { en: 'trigger', zh: '触发器', html: '绑定在表上的事件—动作规则，分 BEFORE/AFTER 与行级/语句级，注意级联与不可见逻辑。' },
      { en: 'impedance mismatch', zh: '阻抗不匹配', html: '对象模型与关系模型的形状差异，表现为类型、粒度、导航方式三重错位。' },
      { en: 'SQL injection', zh: 'SQL 注入', html: '用户输入被当作语法解析；唯一可靠防护是参数化查询。' }
    ] },

    { t: 'quiz', qid: 'ch04-q1' },
    { t: 'quiz', qid: 'ch04-q2' },
    { t: 'quiz', qid: 'ch04-q3' },

    { t: 'keypoint', items: [
      { title: '视图是查询的别名，不是数据副本', html: '普通视图每次重算，物化视图存结果但会过期；选择看「查询贵不贵」与「能不能容忍延迟」。' },
      { title: '只有单表、无聚合的视图才可更新', html: '多表视图的写入无法映射回基表；WITH CHECK OPTION 阻止写入后不可见的行。' },
      { title: '外键动作默认用 RESTRICT', html: 'CASCADE 会连锁删除大量数据，只在「整体—部分」关系且确有把握时使用。' },
      { title: '断言几乎没有产品实现', html: '跨表规则用触发器、存储过程收口或应用层事务替代，三者都弱于理论上的断言。' },
      { title: '触发器只做旁路工作', html: '审计、时间戳可以；业务分支不要写，否则会有级联触发与性能断崖。' },
      { title: '注入只能靠参数化防住', html: '拼接与转义都不可靠；再叠加视图授权做纵深防御。' }
    ] },

    { t: 'checklist', id: 'ch04', items: [
      '我能说出视图的三个好处，并各举一个具体场景',
      '我能判断给定视图是否可更新，并说明不可更新的原因',
      '我能解释 WITH CHECK OPTION 阻止的是哪一类「静默」错误',
      '我能列出四种外键动作，并为「学生删除后成绩怎么办」给出有理由的选择',
      '我能说明断言为什么在真实产品里几乎不可用，以及三种替代方案各自的弱点',
      '我能用角色组织一次授权，并说清 WITH GRANT OPTION 与 REVOKE CASCADE 的连锁效果',
      '我能写出一个 AFTER INSERT 审计触发器，并说清 NEW 与 OLD 在三种事件里的可用性',
      '我能说出触发器的三个危险，并判断某条业务规则该不该放进触发器',
      '我能解释参数化查询为什么能防注入，以及为什么转义不可靠'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 CSC3170 讲义 Advanced SQL 与 Triggers/Views 部分（Part 9–11）及 Tutorial 5–6 组织，覆盖视图与物化视图、可更新性、约束与外键动作、断言、授权与角色、触发器、存储过程与游标、阻抗不匹配与注入。<b>方言提示</b>：示例按 MySQL 8 书写，<code>BEGIN ... END</code> 需配合 <code>DELIMITER</code> 在客户端执行；PostgreSQL 用 <code>CREATE FUNCTION ... LANGUAGE plpgsql</code> 实现同类逻辑，<code>CURRENT_USER()</code> 在标准 SQL 中写作 <code>CURRENT_USER</code>。行级安全策略（<code>CREATE POLICY</code>）与列级加密只提及概念，未展开语法。' }
  ]
});
