/* =====================================================================
 * ch03.js · 第 3 章「SQL 查询：连接、聚合与子查询」
 * 职责：从逻辑执行顺序出发，讲透连接写法、分组聚合、子查询三件事，
 *       并集中处理 NULL 三值逻辑与窗口函数这两个现代 SQL 必备点。
 * 依据：CSC3170 讲义 SQL 部分（Part 3–6、Tutorial 2–4）。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch03',
  num: '03',
  title: 'SQL 查询：连接、聚合与子查询',
  en: 'SQL QUERIES: JOINS, AGGREGATION & SUBQUERIES',
  goals: [
    '按逻辑执行顺序解释一条 SQL 在做什么，并说明为什么 WHERE 里不能写聚合',
    '在内连接、左外连接与旧式逗号连接之间做选择，并解释外连接条件写错位置会丢行',
    '用 GROUP BY 与 HAVING 完成分组统计，判断哪些列可以出现在 SELECT 列表里',
    '用 IN、EXISTS 与相关子查询三种方式表达「存在」与「全称」，并知道 NOT IN 的 NULL 陷阱',
    '用窗口函数解决每组前 N 名这类问题，用 CTE 把长查询拆成可读的步骤'
  ],
  kp: [
    { id: 'ch03-1', title: 'SELECT 的逻辑执行顺序' },
    { id: 'ch03-2', title: '连接：内、外与旧式逗号写法' },
    { id: 'ch03-3', title: '分组聚合：GROUP BY、HAVING 与 COUNT 的脾气' },
    { id: 'ch03-4', title: '子查询：标量、IN、EXISTS 与相关子查询' },
    { id: 'ch03-5', title: 'NULL 与三值逻辑的五个陷阱' },
    { id: 'ch03-6', title: '窗口函数与 CTE：现代 SQL 的两件利器' },
    { id: 'ch03-7', title: '高频错误与调试方法' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么单独用一章讲 SQL', html: 'SQL 是少数「语法十分钟学会、写对要三年」的语言。它的麻烦不来自关键字多，而来自三件事：<b>书写顺序不等于执行顺序</b>、<b>三值逻辑让条件静默失效</b>、<b>同一语义有多种写法且代价相差几个数量级</b>。这一章按逻辑执行顺序把查询拆开，每一节只解决一类困惑，读完你应该能对着任何一条报错或空结果说出「问题出在哪个阶段」。' },

    { t: 'p', lead: true, html: '上一章的关系代数给了「结果是什么」的数学定义，这一章讲「怎么用 SQL 把它写出来」。写法有讲究：同一语义用不同写法，正确性相同但代价可能差上千倍；而更常见的情况是<b>写法看起来对、结果却静默错</b>——不报错，只是少了行或多算了数。全章的例子沿用 <code>student / course / enroll</code> 三张表。' },

    { t: 'h', lvl: 2, text: '一、SELECT 的逻辑执行顺序', id: 'ch03-1' },

    { t: 'p', html: '教科书上的 SQL 按「SELECT ... FROM ... WHERE ...」的书写顺序呈现，但 DBMS 从不用这个顺序执行。真正发生的是下面九步，<b>记住这个顺序，本章后面所有「为什么这里不能写那个」的疑问都会自动消解</b>。' },

    { t: 'steps', items: [
      { title: '1. FROM', html: '取出基表，或先算好派生表（子查询、CTE、视图），得到初始行集合。' },
      { title: '2. ON', html: '对每个连接对计算连接条件，决定哪些行能配上；外连接在这一步标记「配不上」的行。' },
      { title: '3. JOIN', html: '把配上的行拼接，配不上的行按外连接类型用 NULL 补齐或丢弃。' },
      { title: '4. WHERE', html: '逐行过滤，只保留条件为 TRUE 的行（FALSE 与 UNKNOWN 都丢弃）。' },
      { title: '5. GROUP BY', html: '按分组列把剩下的行切成组，每组后面只剩一行「代表」。' },
      { title: '6. HAVING', html: '按组过滤，条件里可以出现聚合函数。' },
      { title: '7. SELECT', html: '计算输出列，包括聚合结果与表达式；此时才能用列别名。' },
      { title: '8. DISTINCT', html: '对 SELECT 的结果去重（注意这是第二次也是最后一次去重机会）。' },
      { title: '9. ORDER BY / LIMIT', html: '排序并截断。ORDER BY 是唯一能看到别名的阶段，也是唯一保证顺序的阶段。' }
    ] },

    { t: 'p', html: '这个顺序立刻解释了三件常被当成「SQL 怪癖」的事。<b>为什么 WHERE 里不能用聚合？</b>因为 WHERE 在第 4 步，分组在第 5 步，那时还没有组。<b>为什么 WHERE 里不能用 SELECT 的别名？</b>因为第 7 步才计算别名，第 4 步时它还不存在；而 ORDER BY 在第 9 步，所以能用。<b>为什么 LEFT JOIN 的过滤条件放错位置会变成内连接？</b>因为 WHERE 在第 4 步执行，此时外连接补出来的 NULL 行已经存在，<code>WHERE e.grade &gt; 80</code> 会把 <code>NULL &gt; 80</code> 判为 UNKNOWN 而删掉——想保留没成绩的学生，条件必须写在 <code>ON</code> 里（第 2 步）。' },

    { t: 'h', lvl: 2, text: '二、连接：内、外与旧式逗号写法', id: 'ch03-2' },

    { t: 'p', html: '连接是 SQL 里最容易被「差不多就行」糊弄过去的语法。三种写法在简单场景下结果一样，一遇到「要保留配不上的行」就分道扬镳。' },

    { t: 'table', caption: '三种连接写法的对照与选用建议', head: ['写法', '语义', '配不上的行', '什么时候用'], rows: [
      ['<code>A JOIN B ON ...</code>', '内连接，只保留配对成功的组合', '两边都丢弃', '默认选择，只要有匹配关系'],
      ['<code>A LEFT JOIN B ON ...</code>', '左外连接，A 的每一行至少出现一次', 'B 侧补 NULL', '「每个学生及其选课数，没选课显示 0」'],
      ['<code>A, B WHERE A.x = B.y</code>', '旧式隐式连接，先笛卡尔积再筛', '等价于内连接', '只在学校教材里出现，不要在新代码里用'],
      ['<code>A JOIN B</code>（无 ON）', '笛卡尔积，行数是两者相乘', '不丢弃任何行', '几乎总是笔误']
    ] },

    { t: 'p', html: '旧式逗号写法有两个实际危害。第一，<b>忘记写 WHERE 条件就变成笛卡尔积</b>，一张 2 万行的表配一张 200 万行的表直接产生 400 亿行；<code>JOIN ... ON</code> 少了条件同样危险，但至少语法上会提醒你缺了 ON。第二，<b>把连接条件和过滤条件混在同一个 WHERE 里</b>，读代码的人无法区分「这是配对规则」还是「这是筛选条件」，改需求时极易误删。' },

    { t: 'code', lang: 'sql', caption: '同一需求的三种写法：只有左外连接能得到 0', code: `-- 需求：列出所有学生及选课数，没选课的显示 0
SELECT s.sid, s.name, COUNT(e.cid) AS n
FROM   student s
LEFT JOIN enroll e ON e.sid = s.sid
GROUP  BY s.sid, s.name;

-- 错法一：内连接 —— 没选课的学生整个消失
-- 错法二：左外连接 + WHERE e.sid IS NOT NULL —— 自己把外连接降级成内连接
-- 错法三：COUNT(*) —— 没选课的学生显示 1 而不是 0` },

    { t: 'p', html: '还有一类连接值得单独提：<b>自连接（self join）</b>。查「和某同学同系的学生」需要把 <code>student</code> 用两次，必须起两个别名，否则 SQL 无法区分两个实例——这正是关系代数里「改名 ρ」的必要性在 SQL 中的体现。' },

    { t: 'h', lvl: 2, text: '三、分组聚合：GROUP BY、HAVING 与 COUNT 的脾气', id: 'ch03-3' },

    { t: 'p', html: '聚合把多行压成一行。五个标准聚合函数里，<code>COUNT</code> 最特殊：<b><code>COUNT(*)</code> 数行，<code>COUNT(列)</code> 只数该列非 NULL 的值</b>，<code>COUNT(DISTINCT 列)</code> 再去重。这个差别在外连接场景下直接决定结果是 0 还是 1，前面已经踩过一次。' },

    { t: 'p', html: '分组有一条铁律，几乎所有数据库都会报错：<b><code>SELECT</code> 列表里出现的每一列，要么在 <code>GROUP BY</code> 里，要么被聚合函数包着</b>。原因是分组后每组只剩一行，若直接输出一个没分组的列，DBMS 不知道该取组里哪一行的值。常见报错原文是 <code>Expression #2 of SELECT list is not in GROUP BY clause and contains nonaggregated column ... which is not functionally dependent on columns in GROUP BY clause</code>——看到它就回去补 GROUP BY 列，或把该列包进聚合。' },

    { t: 'code', lang: 'sql', caption: '分组统计：WHERE 筛行，HAVING 筛组', code: `-- 每门课在 2026 春季的选课人数与平均分，只要人数 >= 5 的
SELECT   c.cid, c.title,
         COUNT(*)        AS enrolled,
         AVG(e.grade)    AS avg_grade
FROM     enroll e JOIN course c ON c.cid = e.cid
WHERE    e.semester = '2026SP'      -- 分组前筛行：不能写聚合
GROUP BY c.cid, c.title
HAVING   COUNT(*) >= 5              -- 分组后筛组：可以写聚合
ORDER BY enrolled DESC;` },

    { t: 'p', html: '把条件放 WHERE 还是 HAVING，有一条实用判据：<b>条件里出现聚合函数就必须放 HAVING，否则优先放 WHERE</b>。这不是风格问题——<code>WHERE</code> 在第 4 步执行，能减少进入分组的行数；若写成 <code>HAVING e.semester = &#39;2026SP&#39;</code>，所有学期的行都会先被分组，白白多做几倍工作。' },

    { t: 'p', html: '最后一个细节：<code>AVG</code> 会自动忽略 <code>NULL</code>，分母是「非 NULL 的行数」而不是总行数。如果 <code>grade</code> 允许为空，<code>AVG(grade)</code> 与 <code>SUM(grade)/COUNT(*)</code> 会得到不同的数——想要「缺考算 0 分」的语义，得写 <code>AVG(COALESCE(grade, 0))</code>。这类语义选择必须先问清需求，不能靠默认行为碰运气。' },

    { t: 'h', lvl: 2, text: '四、子查询：标量、IN、EXISTS 与相关子查询', id: 'ch03-4' },

    { t: 'p', html: '子查询按返回形状分三类：<b>标量子查询</b>返回一个值，可以用在 <code>=</code> 右边或 SELECT 列表里；<b>行/表子查询</b>返回多行，配合 <code>IN</code>、<code>ANY</code>、<code>ALL</code>、<code>EXISTS</code> 使用；<b>派生表</b>出现在 <code>FROM</code> 里，必须起别名。按是否引用外层列，又分<b>非相关</b>（可独立执行一次）与<b>相关</b>（对外层每行执行一次）两种。' },

    { t: 'p', html: '「存在」用 <code>EXISTS</code> 表达最自然，而且它<b>相关子查询</b>的形式正好对应关系代数里的半连接。<code>EXISTS</code> 只要找到第一行就返回真，因此 <code>EXISTS (SELECT 1 FROM ...)</code> 里写 <code>SELECT 1</code> 还是 <code>SELECT *</code> 完全等价——不要被「写 SELECT * 会慢」的说法骗了，标准 SQL 保证它不做投影计算。' },

    { t: 'p', html: '「全称」在 SQL 里没有直接关键字，标准解法是<b>双重否定</b>：把「选修了所有数据库课」翻译成「不存在一门数据库课我没选」。外层 <code>NOT EXISTS</code> 遍历候选学生，内层 <code>NOT EXISTS</code> 检查漏选，正好还原 ch02 的四步除法。这个转换是本课程最重要的思维练习之一，考试与作业都反复出现。' },

    { t: 'code', lang: 'sql', caption: '双重否定表达「选修了全部数据库课的学生」', code: `SELECT s.sid, s.name
FROM   student s
WHERE  NOT EXISTS (
  SELECT 1
  FROM   db_course d                      -- 所有数据库课
  WHERE  NOT EXISTS (
    SELECT 1
    FROM   enroll e                       -- 该生是否选了 d
    WHERE  e.sid = s.sid AND e.cid = d.cid
  )
);

-- 对照：只要求「选修了至少一门数据库课」时，内层去掉 NOT 即可` },

    { t: 'p', html: '相关子查询的执行模型要建立正确直觉：<b>逻辑上对外层每一行执行一次内层</b>。这听起来很贵（外层 2 万行就是 2 万次），但优化器几乎总会把它改写成半连接或反连接，实际代价与显式 JOIN 相当。所以「相关子查询一定慢」是伪命题——<b>真正决定性能的是有没有索引、能不能改写，而不是语法形式</b>。ch06 会给出改写规则。' },

    { t: 'h', lvl: 2, text: '五、NULL 与三值逻辑的五个陷阱', id: 'ch03-5' },

    { t: 'p', html: '<code>NULL</code> 表示「未知」而不是「空字符串」或「0」。任何与 <code>NULL</code> 的比较都得到 <code>UNKNOWN</code>，而 <code>WHERE</code> 只保留 <code>TRUE</code>，于是整行被静默丢掉。下面五个陷阱在作业与生产事故中出现频率最高，值得逐条背下来。' },

    { t: 'table', caption: '五个 NULL 陷阱与正确写法', head: ['陷阱', '错误写法', '现象', '正确写法'], rows: [
      ['等值判断', '<code>WHERE grade = NULL</code>', '永远零行，不报错', '<code>WHERE grade IS NULL</code>'],
      ['取反', '<code>WHERE NOT (grade &gt; 80)</code>', 'NULL 行不出现', '<code>WHERE grade &lt;= 80 OR grade IS NULL</code>'],
      ['NOT IN', '<code>WHERE cid NOT IN (SELECT ...)</code>', '子查询含 NULL 时整条返回空', '改用 <code>NOT EXISTS</code>'],
      ['聚合分母', '<code>AVG(grade)</code>', '忽略 NULL 行，分母偏小', '明确用 <code>COALESCE</code> 或先过滤'],
      ['唯一约束', '<code>UNIQUE(grade)</code>', '多行 NULL 不冲突', '业务上加 <code>NOT NULL</code> 或部分索引']
    ] },

    { t: 'p', html: '<code>NOT IN</code> 那条值得单独展开，因为它的静默失败最伤。逻辑上 <code>x NOT IN (1, 2, NULL)</code> 展开为 <code>x &lt;&gt; 1 AND x &lt;&gt; 2 AND x &lt;&gt; NULL</code>，最后一项恒为 <code>UNKNOWN</code>，整个 <code>AND</code> 就永远不是 <code>TRUE</code>。所以只要子查询的结果里混进一个 <code>NULL</code>，<b>整条查询返回空集，且不报任何错</b>。工程守则：<b>子查询可能含 NULL 时，一律用 <code>NOT EXISTS</code></b>，它的语义是「找不到匹配行」，与 NULL 无关。' },

    { t: 'code', lang: 'sql', caption: 'NOT IN 的静默失败，以及用 NOT EXISTS 修好它', code: `-- 危险：若有学生 grade 为 NULL 且该值进入子查询，结果会莫名其妙为空
SELECT sid FROM student
WHERE  sid NOT IN (SELECT sid FROM enroll WHERE grade = 'F');

-- 安全：语义同样是「没有不及格记录」，但对 NULL 免疫
SELECT s.sid FROM student s
WHERE  NOT EXISTS (
  SELECT 1 FROM enroll e
  WHERE e.sid = s.sid AND e.grade = 'F'
);` },

    { t: 'p', html: '顺带记住两个实用函数：<code>COALESCE(a, b, c)</code> 返回第一个非 NULL 值，<code>NULLIF(a, b)</code> 在 <code>a = b</code> 时返回 NULL（用来避免除以零）。它们能让三值逻辑的边界情况在代码里显式化，而不是靠运气。' },

    { t: 'h', lvl: 2, text: '六、窗口函数与 CTE：现代 SQL 的两件利器', id: 'ch03-6' },

    { t: 'p', html: '窗口函数（window function）解决的问题是：<b>既要聚合信息，又要保留明细行</b>。<code>GROUP BY</code> 会把每组压成一行，而窗口函数在原行旁边挂一个「组内计算值」，行数不变。语法是 <code>函数(...) OVER (PARTITION BY 分组列 ORDER BY 排序列)</code>。' },

    { t: 'p', html: '三个排名函数要分清：<code>ROW_NUMBER()</code> 强行编号 1、2、3 不重复；<code>RANK()</code> 并列同名、后续跳号（1,1,3）；<code>DENSE_RANK()</code> 并列同名、后续不跳号（1,1,2）。选错会在「取每组前 N 名」时多取或少取。' },

    { t: 'code', lang: 'sql', caption: '每组前两名：窗口函数一行搞定，子查询要嵌套两层', code: `WITH ranked AS (
  SELECT cid, sid, grade,
         ROW_NUMBER() OVER (PARTITION BY cid ORDER BY grade DESC) AS rn
  FROM   enroll
  WHERE  grade IS NOT NULL
)
SELECT cid, sid, grade
FROM   ranked
WHERE  rn <= 2;` },

    { t: 'p', html: '上面这段同时用到了 <b>CTE（common table expression，公共表表达式）</b>，即 <code>WITH 名字 AS (...)</code>。它的价值不是性能（多数优化器会内联），而是<b>可读性</b>：把一条嵌套四层的查询拆成「先算排名、再筛前二」两个有名字的步骤，出错时能逐段 <code>SELECT * FROM ranked</code> 检查。写复杂报表时，CTE 几乎是唯一能让代码被别人看懂的方式。' },

    { t: 'p', html: '窗口函数还有一类常见用法是累计值：<code>SUM(grade) OVER (PARTITION BY sid ORDER BY semester)</code> 给出每个学生按学期的累计成绩。注意它与 <code>GROUP BY</code> 的 <code>SUM</code> 完全不同——前者每个明细行一个值，后者每组一个值。<b>判断标准很简单：结果行数该不该变</b>。' },

    { t: 'h', lvl: 2, text: '七、高频错误与调试方法', id: 'ch03-7' },

    { t: 'p', html: '写完一条查询，先别急着交付。下面七个问题是本课程作业里出现频率最高的，逐条自检能省掉大部分返工。' },

    { t: 'pitfalls', items: [
      { title: '结果比预期少', html: '优先查 <code>NULL</code> 与 <code>NOT IN</code>；再查内连接是否把配不上的行丢了；最后查 <code>WHERE</code> 里有没有把外连接降级。' },
      { title: '结果行数爆炸', html: '几乎一定是漏写连接条件或连接条件不唯一，产生了笛卡尔积；先 <code>SELECT COUNT(*)</code> 看数量级。' },
      { title: '分组后列报错', html: 'SELECT 列表里的列没进 <code>GROUP BY</code> 也没被聚合；补列或改聚合，不要靠 <code>ANY_VALUE</code> 糊弄。' },
      { title: '重复行', html: '一对多连接后再聚合，父表行被重复计数；先把子表聚合成一行再连接，或用 <code>COUNT(DISTINCT)</code>。' },
      { title: '分页漏行', html: '没写 <code>ORDER BY</code> 就 <code>LIMIT/OFFSET</code>，两次查询顺序可能不同；排序键必须唯一。' },
      { title: '字符串比较失败', html: '尾部空格、大小写与排序规则（collation）不一致；用 <code>TRIM</code> 与显式 <code>COLLATE</code>，别指望默认行为。' },
      { title: '用了别名却报错', html: '<code>WHERE</code> 阶段还没有别名；把条件挪到 <code>HAVING</code> 或重复写表达式，或用 CTE 先算出来。' }
    ] },

    { t: 'p', html: '调试方法上有个通用套路：<b>把查询按阶段拆开，每一段单独跑一次</b>。先跑 <code>FROM ... JOIN ...</code> 看行数是否符合预期，再加 <code>WHERE</code> 看筛掉了多少，再加 <code>GROUP BY</code> 看组数，最后加 <code>HAVING</code> 与 <code>SELECT</code>。哪一步行数不对，问题就在那一步。这比盯着整条查询猜要快一个数量级。' },

    { t: 'terms', items: [
      { en: 'logical evaluation order', zh: '逻辑执行顺序', html: 'FROM→ON→JOIN→WHERE→GROUP BY→HAVING→SELECT→DISTINCT→ORDER BY，决定哪一阶段能用什么。' },
      { en: 'outer join', zh: '外连接', html: '保留一侧的全部行，配不上的用 NULL 补齐；过滤条件写在 ON 与 WHERE 里结果不同。' },
      { en: 'GROUP BY', zh: '分组', html: '把行切成组，每组输出一行；SELECT 中的非聚合列必须出现在分组列里。' },
      { en: 'correlated subquery', zh: '相关子查询', html: '内层引用外层列，逻辑上对外层每行执行一次，优化器通常改写为半连接或反连接。' },
      { en: 'three-valued logic', zh: '三值逻辑', html: 'TRUE/FALSE/UNKNOWN 三值，WHERE 只保留 TRUE，因此 NULL 比较会静默丢行。' },
      { en: 'window function', zh: '窗口函数', html: 'OVER (PARTITION BY ... ORDER BY ...)，在保留明细行的同时给出组内计算值。' },
      { en: 'CTE', zh: '公共表表达式', html: 'WITH 名字 AS (...)，把长查询拆成命名步骤，主要收益是可读性与可调试性。' }
    ] },

    { t: 'quiz', qid: 'ch03-q1' },
    { t: 'quiz', qid: 'ch03-q2' },
    { t: 'quiz', qid: 'ch03-q3' },

    { t: 'keypoint', items: [
      { title: '按九步顺序读 SQL', html: 'FROM→ON→JOIN→WHERE→GROUP BY→HAVING→SELECT→DISTINCT→ORDER BY；WHERE 在分组前、别名在 SELECT 才产生。' },
      { title: '外连接的过滤条件写在 ON 里', html: '写进 WHERE 会把补出来的 NULL 行判为 UNKNOWN 并删除，等于降级成内连接。' },
      { title: 'COUNT(*) 数行，COUNT(列) 数非空', html: '外连接后想得到 0，必须 COUNT 那个可能为 NULL 的子表列。' },
      { title: 'NOT IN 遇 NULL 返回空集', html: '子查询结果可能含 NULL 时一律改用 NOT EXISTS，后者对 NULL 免疫。' },
      { title: '全称查询用双重否定', html: '「选修了全部」= 不存在一门课我没选，两层 NOT EXISTS 逐字对应这个句子。' },
      { title: '窗口函数保留明细行', html: 'ROW_NUMBER 去重取第一、RANK 并列跳号、DENSE_RANK 并列不跳号，选错会多取或少取。' }
    ] },

    { t: 'checklist', id: 'ch03', items: [
      '我能默写 SELECT 的九步逻辑执行顺序，并据此解释 WHERE 为何不能用聚合与别名',
      '我能写出「每个学生及选课数、没选课显示 0」的正确查询，并指出三种典型错法',
      '我能说出内连接、左外连接与旧式逗号连接在「配不上的行」上的差别',
      '我能判断一条含 GROUP BY 的查询是否会报「非聚合列」错误，并知道怎么修',
      '我能说明 WHERE 与 HAVING 的分工，并解释把行过滤写进 HAVING 的代价',
      '我能用 IN、EXISTS、相关子查询三种方式写同一个「存在」查询',
      '我能用双重否定写出「选修了全部课程」的查询',
      '我能解释 NOT IN 遇到 NULL 为什么整条返回空，并给出 NOT EXISTS 的修法',
      '我能用 ROW_NUMBER 与 CTE 写出「每组前两名」，并说明 RANK 与 DENSE_RANK 的区别'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 CSC3170 讲义 SQL 部分（Part 3–6）与 Tutorial 2–4 组织，覆盖逻辑执行顺序、连接写法、分组聚合、子查询、NULL 三值逻辑、窗口函数与 CTE。<code>ANY</code>/<code>ALL</code> 只给出「与 EXISTS 可互换」的结论，未展开逐行语义；递归 CTE、<code>MERGE</code>、<code>PIVOT</code> 属各产品方言，未纳入正文，只在 ch04 讲触发器时提及。<b>SQL 方言提示</b>：示例按 MySQL 8 书写，<code>LIMIT</code>、<code>ROW_NUMBER</code> 在 PostgreSQL 与 SQL Server 中写法略有差异；<code>COALESCE</code> 是标准函数，<code>IFNULL</code> 是 MySQL 专有，考试写标准写法更稳。' }
  ]
});
