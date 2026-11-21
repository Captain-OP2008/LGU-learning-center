/* =====================================================================
 * ch02.js · 第 2 章「关系模型与关系代数：查询的形式基础」
 * 职责：把「表」讲成集合，定义键与三类完整性约束；用六个基本运算
 *       拼出连接族与除法，并把代数式与 SQL 语义对应起来。
 * 依据：CSC3170 讲义 Relational Model 与 Relational Algebra 部分（Part 2、7–8）。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch02',
  num: '02',
  title: '关系模型与关系代数：查询的形式基础',
  en: 'RELATIONAL MODEL & ALGEBRA',
  goals: [
    '用「元组集合」的措辞定义关系、模式与实例，并说清集合语义与 SQL 多重集语义的差别',
    '区分超键、候选键、主键与外键，判断给定函数依赖下哪些属性组合能当候选键',
    '用选择、投影、并、差、笛卡尔积、改名六个基本运算写出任意查询的代数式',
    '把 theta 连接、自然连接、外连接与除法分别还原成基本运算的组合',
    '对同一查询给出代数式与 SQL 两种写法，并指出优化器能做哪几步等价变换'
  ],
  kp: [
    { id: 'ch02-1', title: '关系的数学定义：模式、实例与度' },
    { id: 'ch02-2', title: '键与三类完整性约束' },
    { id: 'ch02-3', title: '六个基本运算' },
    { id: 'ch02-4', title: '连接族：theta、自然、外连接' },
    { id: 'ch02-5', title: '除法与「所有」类查询' },
    { id: 'ch02-6', title: '用代数写查询：从自然语言到表达式树' },
    { id: 'ch02-7', title: '等价变换：优化器的起点' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么先读这一章', html: '你可能已经会写 <code>SELECT ... JOIN ...</code> 了，但遇到这三类问题仍会卡住：<b>为什么 <code>JOIN</code> 之后行数会变多？</b>「查询所有选修了全部数据库课程的学生」用 SQL 该怎么写？<b>优化器把我的子查询改成了连接，凭什么说两者等价？</b>三个问题的答案都在同一处：SQL 只是关系代数的一层皮，真正定义「结果是什么」的是代数。看懂代数，SQL 的怪行为就有了统一的解释框架。' },

    { t: 'p', lead: true, html: '上一章把现实世界翻译成了五张表，这一章要回答「这些表在数学上是什么，能用什么运算组合出答案」。关系代数（relational algebra）是一门<b> procedural </b>语言：每个表达式都规定了「先做什么、再做什么」，因此它既能精确描述 SQL 的语义，又天然适合被改写与优化——这正是 ch06 讲查询优化的全部前提。' },

    { t: 'h', lvl: 2, text: '一、关系的数学定义：模式、实例与度', id: 'ch02-1' },

    { t: 'p', html: '一个<b>关系（relation）</b>就是一张二维表，但用集合的语言说更准确：它是若干<b>元组（tuple）</b>的集合，每个元组按固定顺序取若干个值，每个位置对应一个<b>属性（attribute）</b>。属性的名字与取值范围的集合叫<b>模式（schema）</b>，写成 <code>student(sid, name, major)</code>；某一时刻表里实际有哪些行，叫<b>实例（instance）</b>。属性个数叫<b>度（degree）</b>，元组个数叫<b>基数（cardinality）</b>——这两个词考试常混，度是三，基数是行数。' },

    { t: 'p', html: '「集合」这两个字带来三条硬性后果，每一条都会在 SQL 里留下痕迹。<b>第一，行不重复</b>：同一个元组出现两次没有意义，所以关系代数里的并、投影都会自动去重；而 SQL 的表是<b>多重集（multiset，bag）</b>，允许重复行，要 <code>DISTINCT</code> 才去重。<b>第二，行无序</b>：代数表达式没有「第几行」的概念，SQL 里不写 <code>ORDER BY</code> 就不能假定顺序。<b>第三，列有序但名字唯一</b>：所以连接两个同名属性的表时，必须用表名前缀区分。' },

    { t: 'table', caption: '关系模型 vs SQL 实现：三处最常见的语义差', head: ['维度', '关系代数', 'SQL 的实际行为', '后果'], rows: [
      ['重复元组', '集合，自动去重', '默认保留重复（bag）', '聚合前忘记 <code>DISTINCT</code> 会算错人数'],
      ['行的顺序', '无序', '无 <code>ORDER BY</code> 时顺序不保证', '分页查询可能重复或漏行'],
      ['缺失值', '通常不设 NULL', '<code>NULL</code> 参与三值逻辑', '<code>NULL = NULL</code> 为 unknown，<code>NOT IN</code> 可能返回空'],
      ['属性命名', '模式内唯一', '允许同名列，靠前缀消歧', '<code>SELECT *</code> 连接后出现重名列']
    ], },

    { t: 'p', html: '关于 <code>NULL</code> 要多说一句。Codd 当年引入 <code>NULL</code> 是为了表达「未知」，结果它把二值逻辑变成了三值逻辑：<code>NULL = NULL</code> 的结果是 <code>UNKNOWN</code> 而不是 <code>TRUE</code>，<code>WHERE</code> 只保留结果为 <code>TRUE</code> 的行。这就是为什么 <code>WHERE grade = NULL</code> 一行都查不到，必须写 <code>IS NULL</code>。ch03 会专门用一节处理它的各种陷阱。' },

    { t: 'h', lvl: 2, text: '二、键与三类完整性约束', id: 'ch02-2' },

    { t: 'p', html: '键（key）是关系模型里「唯一性」的形式化。<b>超键（superkey）</b>是能唯一确定一个元组的属性集合；<b>候选键（candidate key）</b>是极小超键——去掉任何一个属性就不再唯一；<b>主键（primary key）</b>是从候选键里挑出来当官方标识的那一个；<b>外键（foreign key）</b>是本表某组属性引用另一张表的主键。以 <code>enroll(sid, cid, semester, grade)</code> 为例：<code>(sid, cid)</code> 若允许重修就不唯一，<code>(sid, cid, semester)</code> 才是候选键；若还有 <code>enroll_id</code> 自增列，它也是候选键，于是有两个候选键、一个主键。' },

    { t: 'p', html: '判定候选键不要靠猜，靠<b>属性闭包</b>：从一组属性出发，反复用函数依赖往右推，能推出全部属性就是超键，再去掉冗余属性检验极小性。这个方法 ch05 会正式讲，这里先建立一个直觉：<b>候选键就是「知道了它，整行就确定了」的最小属性组</b>。' },

    { t: 'p', html: '与键配套的是三类完整性约束，它们由 DBMS 强制执行，违反就拒绝写入。<b>实体完整性（entity integrity）</b>：主键不能为 <code>NULL</code>，否则「唯一标识」失效。<b>参照完整性（referential integrity）</b>：外键的值要么在被引用表里存在，要么整体为 <code>NULL</code>（表示「暂无关联」）；不允许指向一个不存在的行。<b>域完整性（domain integrity）</b>：每列的值必须落在声明类型与 <code>CHECK</code> 允许的范围内。' },

    { t: 'code', lang: 'sql', caption: '三类约束在 DDL 里长什么样', code: `CREATE TABLE enroll (
  sid      CHAR(8)  NOT NULL,
  cid      CHAR(6)  NOT NULL,
  semester VARCHAR(10) NOT NULL,
  grade    CHAR(2),
  PRIMARY KEY (sid, cid, semester),          -- 实体完整性：非空且唯一
  FOREIGN KEY (sid) REFERENCES student(sid)  -- 参照完整性
    ON DELETE CASCADE,
  FOREIGN KEY (cid) REFERENCES course(cid),
  CHECK (grade IN ('A','A-','B+','B','B-','C+','C','D','F')
         OR grade IS NULL)                   -- 域完整性
);` },

    { t: 'p', html: '注意 <code>CHECK</code> 里显式写了 <code>OR grade IS NULL</code>。因为 <code>NULL IN (...)</code> 的结果是 <code>UNKNOWN</code>，而 <code>CHECK</code> 把 <code>UNKNOWN</code> 当作通过——不同产品的行为略有差别，写清楚最稳。这类「约束与 NULL 的交互」是作业里最常被判错的地方。' },

    { t: 'h', lvl: 2, text: '三、六个基本运算', id: 'ch02-3' },

    { t: 'p', html: '关系代数只有六个基本运算，其余全部是它们的组合。记牢这六个，任何查询都能被机械地翻译出来——这也是考试里「用代数写出下列查询」这类题的解法：先想清楚每一步要保留哪些行、哪些列。' },

    { t: 'steps', items: [
      { title: '选择 σ（sigma）', html: '按条件筛<b>行</b>：<code>σ<sub>gpa &gt; 3.5</sub>(student)</code>。条件里可以用 ∧ ∨ ¬ 组合。对应 SQL 的 <code>WHERE</code>。' },
      { title: '投影 π（pi）', html: '按属性筛<b>列</b>并去重：<code>π<sub>name, major</sub>(student)</code>。注意投影后可能产生重复元组，集合语义下自动合并。' },
      { title: '并 ∪（union）', html: '两个模式相同的关系取并集，结果仍是集合。要求两边的属性个数与类型兼容。' },
      { title: '差 −（difference）', html: '在 R 中但不在 S 中的元组。它和并一起构成「集合差」，是表达「不存在」的基础。' },
      { title: '笛卡尔积 ×（product）', html: 'R 的每个元组与 S 的每个元组拼接，结果度数为两者之和、基数为两者之积。<b>行数爆炸的源头</b>。' },
      { title: '改名 ρ（rename）', html: '给关系或属性换名：<code>ρ<sub>S</sub>(R)</code>。自连接时必须用它区分两次出现的同一张表。' }
    ] },

    { t: 'p', html: '看一个组合的例子：查询「计算机系 GPA 高于 3.5 的学生姓名」。<code>π<sub>name</sub>(σ<sub>major=&#39;CS&#39; ∧ gpa&gt;3.5</sub>(student))</code>。执行顺序由内向外：先筛行，再切列。这个顺序不是唯一正确的——先投影掉 <code>sid</code>、<code>gpa</code> 再筛也行，只要保留筛选用到的列。两条路径结果相同、代价不同，这正是「等价变换」的原始动机。' },

    { t: 'code', lang: 'text', caption: '代数式与 SQL 一一对应，注意投影要去重', code: `π_name ( σ_major='CS' ∧ gpa>3.5 ( student ) )

-- 等价的 SQL
SELECT DISTINCT name
FROM   student
WHERE  major = 'CS' AND gpa > 3.5;` },

    { t: 'p', html: '为什么 SQL 这里要写 <code>DISTINCT</code>？因为代数里的 π 是集合投影，同名同系的两个人会合并成一行；而 SQL 的 <code>SELECT</code> 默认按 bag 处理，两个人就输出两行。**代数式与 SQL 的差异必须一处一处对齐**，这也是本章最容易失分的地方：写对了代数，却忘了 SQL 的去重语义。' },

    { t: 'h', lvl: 2, text: '四、连接族：theta、自然、外连接', id: 'ch02-4' },

    { t: 'p', html: '连接（join）不是基本运算，它是「笛卡尔积 + 选择」的缩写：<code>R ⋈<sub>θ</sub> S = σ<sub>θ</sub>(R × S)</code>。所有连接变体都只是 θ 取不同形式而已。理解这一点，你就不会再把「连接」当成一个神秘的运算符。' },

    { t: 'table', caption: '四种连接的区别只在于「怎么配对」和「配不上的怎么办」', head: ['连接', '定义', '配不上的行', '典型用途'], rows: [
      ['theta 连接', 'σ<sub>θ</sub>(R × S)，θ 是任意条件', '丢弃', '不等值比较，如 <code>salary &gt; budget</code>'],
      ['等值连接', 'θ 取 <code>R.a = S.b</code>', '丢弃', '按主外键配对'],
      ['自然连接', '在<b>所有同名列</b>上做等值连接，并去掉重复列', '丢弃', '模式设计规范、同名列有意义时的默认选择'],
      ['外连接', '先做内连接，再把配不上的行用 <code>NULL</code> 补全', '保留（左/右/全）', '「每个学生及其成绩，没选课也要列出」']
    ] },

    { t: 'p', html: '自然连接看起来最省事，却最容易埋雷：它按<b>列名</b>自动配对，一旦两张表恰好都有一个叫 <code>name</code> 的列（学生姓名、课程名），自然连接就会在名字上做等值匹配，结果莫名其妙地少一大半行。工程上的惯例是<b>永远显式写 <code>ON</code> 条件</b>，把自然连接留给教学示例。' },

    { t: 'p', html: '外连接是「不丢行」的工具，也是作业里最常写错的地方。要求「列出所有学生及他们的选课数，没选课的显示 0」，正确写法是先从学生出发左外连接选课，再用 <code>COUNT(e.cid)</code> 而不是 <code>COUNT(*)</code> 计数——因为补出来的那一行 <code>e.cid</code> 是 <code>NULL</code>，<code>COUNT(列)</code> 不数 <code>NULL</code>，正好得 0；而 <code>COUNT(*)</code> 会把补出来的那一行算成 1。' },

    { t: 'code', lang: 'sql', caption: '左外连接 + COUNT(列) 才能得到 0 而不是 1', code: `SELECT s.sid, s.name, COUNT(e.cid) AS courses
FROM   student s
LEFT JOIN enroll e ON e.sid = s.sid
GROUP  BY s.sid, s.name;

-- 若写成 COUNT(*)，没选课的学生会显示 1
-- 若写成内连接 JOIN，没选课的学生根本不会出现` },

    { t: 'h', lvl: 2, text: '五、除法与「所有」类查询', id: 'ch02-5' },

    { t: 'p', html: '除法（division）是六个基本运算之外唯一需要单独记的派生运算，因为它解决的问题没有别的简单写法：<b>「对所有……都……」</b>。定义是：若 <code>R(A, B)</code> 与 <code>S(B)</code>，则 <code>R ÷ S</code> 给出所有这样的 A 值——它与 S 中的<b>每一个</b> B 值都在 R 中配对过。' },

    { t: 'p', html: '具体例子：<code>enroll(sid, cid)</code> 与 <code>db_course(cid)</code>（所有数据库课），<code>enroll ÷ db_course</code> 就是「选修了全部数据库课的学生学号」。注意它和「选修了某门数据库课的学生」完全不同——后者只是 <code>π<sub>sid</sub>(enroll ⋈ db_course)</code>。这两个查询在考试里几乎成对出现，专门用来区分「存在」与「全称」。' },

    { t: 'p', html: '除法可以用基本运算写出来，思路是「反证」：先造出「所有学生 × 所有数据库课」的完整组合，减去实际选过的组合，剩下的就是「有漏选的学生」；再从全体学生里减掉这批人，剩下的就是全选的人。三步，一步都不能少。' },

    { t: 'code', lang: 'text', caption: '除法的基本运算展开：三步反证', code: `-- 目标：选修了全部数据库课的学生
R ÷ S  =  π_sid(enroll)  −  π_sid( ( π_sid(enroll) × db_course ) − enroll )

第一步  全体选过课的学生           π_sid(enroll)
第二步  理论上该选的完整组合        π_sid(enroll) × db_course
第三步  实际漏掉的组合             第二步 − enroll
第四步  有漏选的学生               π_sid(第三步)
结果    全体 − 有漏选的            第一步 − 第四步` },

    { t: 'p', html: 'SQL 里没有 <code>DIVIDE</code> 关键字，只能用 <code>NOT EXISTS ... NOT EXISTS</code> 双重否定，或者 <code>GROUP BY ... HAVING COUNT(DISTINCT cid) = (SELECT COUNT(*) FROM db_course)</code> 这种计数写法。前者更贴近除法的语义，后者更好读但要求「课程集合」是静态的。两种写法在 ch03 讲子查询时会各出现一次。' },

    { t: 'h', lvl: 2, text: '六、用代数写查询：从自然语言到表达式树', id: 'ch02-6' },

    { t: 'p', html: '写代数式的正确姿势不是「想到哪写到哪」，而是<b>先定结果模式，再定筛选条件，最后拼连接</b>。以「查询 2026 春季学期平均分高于 85 的课程名与平均分」为例，三步走。' },

    { t: 'p', html: '<b>第一步，看结果要哪些列</b>：<code>title</code> 与平均分。平均分是聚合，代数里没有聚合运算——这是关系代数的一个边界，严格的代数需要用扩展运算或直接承认「聚合不属于基本代数」。考试里通常允许写 <code>γ<sub>cid, AVG(grade)</sub></code> 这种扩展记法，答题时注明即可。<b>第二步，定筛选条件</b>：学期是 2026 春，且平均分 &gt; 85。<b>第三步，拼连接</b>：<code>enroll</code> 与 <code>course</code> 按 <code>cid</code> 连接，才能拿到课程名。' },

    { t: 'code', lang: 'text', caption: '带聚合的表达式：先连接、再分组、再筛选、最后投影', code: `π_title, avg_grade (
  σ_avg_grade > 85 (
    γ_cid, AVG(grade) AS avg_grade (
      σ_semester = '2026SP' ( enroll )  ⋈  course
    )
  )
)

-- 等价的 SQL
SELECT c.title, AVG(e.grade) AS avg_grade
FROM   enroll e JOIN course c ON c.cid = e.cid
WHERE  e.semester = '2026SP'
GROUP  BY c.cid, c.title
HAVING AVG(e.grade) > 85;` },

    { t: 'p', html: '对照两边能看出一个关键点：<b>SQL 的书写顺序（SELECT ... FROM ... WHERE ... GROUP BY ... HAVING）与执行顺序完全不同</b>。真正执行时先 <code>FROM</code> 与 <code>JOIN</code> 造出笛卡尔积再筛选，然后分组、聚合，最后才投影出 <code>SELECT</code> 里的列。这也是为什么 <code>WHERE</code> 里不能直接用聚合函数——那时还没分组。' },

    { t: 'p', html: '还有一个高频错误：把 <code>σ<sub>avg&gt;85</sub></code> 写在分组之前。分组前的每一行是单个成绩，不是平均分，条件里的 <code>avg_grade</code> 根本不存在。写代数时如果发现某个条件引用了聚合结果，它就必须放在 <code>γ</code> 的外面（对应 SQL 的 <code>HAVING</code>）。<b>位置错了，语义就错了，不是效率问题</b>。' },

    { t: 'h', lvl: 2, text: '七、等价变换：优化器的起点', id: 'ch02-7' },

    { t: 'p', html: '两个代数表达式如果对任何实例都产生相同的结果，就叫<b>等价（equivalent）</b>。关系代数有一整套等价律，优化器的全部工作就是「在等价的前提下把表达式改便宜」。下面四条是最常用的，也是考试里「把下列表达式优化」的标准答案。' },

    { t: 'table', caption: '四条最常用的等价律：左式贵，右式便宜', head: ['规律', '形式', '为什么更便宜'], rows: [
      ['选择下推', 'σ<sub>θ</sub>(R ⋈ S) ≡ (σ<sub>θ1</sub>R) ⋈ (σ<sub>θ2</sub>S)', '先筛再连，参与连接的行数大幅减少'],
      ['投影下推', 'π<sub>L</sub>(R ⋈ S) ≡ π<sub>L1</sub>R ⋈ π<sub>L2</sub>S', '每行变窄，中间结果占的内存与 IO 变少'],
      ['连接交换', 'R ⋈ S ≡ S ⋈ R', '让小表做外表、大表走索引，代价能差几个数量级'],
      ['连接结合', '(R ⋈ S) ⋈ T ≡ R ⋈ (S ⋈ T)', '调整连接顺序，先做选择性高的连接'],
      ['σ 与 ∪ 交换', 'σ<sub>θ</sub>(R ∪ S) ≡ σ<sub>θ</sub>R ∪ σ<sub>θ</sub>S', '把过滤推到并的两个分支，各自变小']
    ] },

    { t: 'p', html: '看一个具体收益。设 <code>student</code> 有 2 万行、<code>enroll</code> 有 200 万行，查询「CS 系学生的选课记录」。朴素写法是先做 <code>student × enroll</code>（400 亿行）再筛，任何机器都跑不完。选择下推后，先把 <code>student</code> 筛成 800 行再连接，中间结果只有 8 万行——<b>同一语义，代价从不可能变成一秒</b>。这不是「优化技巧」，这是「能不能跑」的分界线。' },

    { t: 'p', html: '最后要提一句表达力的边界。关系代数（不含聚合与递归）与<b>关系演算（relational calculus）</b>表达力相同，这就是 Codd 定理；对应的 SQL 子集叫「SPJ 查询」（select-project-join）。一旦加上聚合、递归（<code>WITH RECURSIVE</code>）、窗口函数，SQL 就超出了经典代数的范围，ch04 会讲这些扩展。<b>知道边界在哪，才不会问出「用纯代数写出行号」这种无解的问题</b>。' },

    { t: 'terms', items: [
      { en: 'relation', zh: '关系', html: '元组的集合，对应一张表；模式是列定义，实例是当前的行集合。' },
      { en: 'degree / cardinality', zh: '度 / 基数', html: '度是属性个数（列数），基数是元组个数（行数），两个词不要混用。' },
      { en: 'superkey', zh: '超键', html: '能唯一确定元组的属性集合；极小的超键才是候选键。' },
      { en: 'referential integrity', zh: '参照完整性', html: '外键值必须存在于被引用表中，或整体为 NULL，不能指向不存在的行。' },
      { en: 'natural join', zh: '自然连接', html: '在所有同名列上做等值连接并去掉重复列；列名巧合时会静默丢行。' },
      { en: 'division', zh: '除法', html: '表达「对所有……都……」的派生运算，R ÷ S 给出与 S 中每个值都配对过的 A 值。' },
      { en: 'equivalence', zh: '等价', html: '两个表达式对任何实例结果都相同；优化器只做保持等价的改写。' }
    ] },

    { t: 'quiz', qid: 'ch02-q1' },
    { t: 'quiz', qid: 'ch02-q2' },
    { t: 'quiz', qid: 'ch02-q3' },

    { t: 'keypoint', items: [
      { title: '关系是集合，SQL 是多重集', html: '代数的投影自动去重、行无序；SQL 要 DISTINCT 才去重，不写 ORDER BY 就没有顺序。' },
      { title: '候选键是极小超键', html: '用属性闭包推一遍能覆盖全部属性才是超键，再去掉每个可去属性检验极小性。' },
      { title: '连接就是笛卡尔积加选择', html: 'theta、等值、自然连接都是 σ(R × S)，只有外连接额外用 NULL 补齐配不上的行。' },
      { title: '除法专治「所有」', html: 'R ÷ S 用「全体 × S 减去实际，再取补」四步展开，SQL 里用双重 NOT EXISTS 或计数实现。' },
      { title: '聚合不在基本代数内', html: 'γ 是扩展运算；带聚合的条件必须写在分组外层，对应 SQL 的 HAVING。' },
      { title: '选择与投影下推是优化的第一步', html: '先把行筛小、列切窄，再连接；这一步能把 400 亿行的笛卡尔积变成 8 万行的连接。' }
    ] },

    { t: 'checklist', id: 'ch02', items: [
      '我能用「元组集合」定义关系，并说清度与基数分别指什么',
      '我能举出三处关系代数与 SQL 语义的差异，并各给一个会算错的例子',
      '我能判断给定属性集是不是超键、是不是候选键，并说明理由',
      '我能说出实体完整性、参照完整性、域完整性各约束什么，违反时会发生什么',
      '我能只用一个 σ 与一个 π 写出「某系高 GPA 学生姓名」的代数式',
      '我能把 theta 连接与外连接都还原成基本运算的组合',
      '我能用四步反证写出 R ÷ S，并举一个「选修了全部课程」的例子',
      '我能对着一条多表聚合 SQL，写出它的代数式并标出 HAVING 的位置',
      '我能说出至少四条等价律，并用选择下推解释一次代价的数量级变化'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 CSC3170 讲义 Relational Model 与 Relational Algebra 部分（Part 2、Part 7–8）组织，覆盖关系的集合定义、键与三类完整性约束、六个基本运算、连接族、除法与等价变换。讲义中的元组关系演算与域关系演算只保留「与代数表达力等价」这一结论，未展开量词推导；扩展代数（聚合 γ、外连接、递归）按课程作业的实际用法给出记法并注明非基本运算。示例表沿用第 1 章的选课模式，SQL 按 MySQL 8 书写；若你的讲义用 <code>⋈</code> 与 <code>÷</code> 的不同符号，含义一致。' }
  ]
});
