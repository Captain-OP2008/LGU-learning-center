/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 每项字段：{ id, ch, kp, tier, type, difficulty, tags, stem, options, explain }
 * fill 类型用 answer / accept；predict 类型额外含 code / codeTitle / answer。
 * 规模：8 章 × 7 题 = 56 题；每章内嵌的 chXX-q1..q3 必须在此存在。
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '相比直接用文件存数据，数据库系统最核心的额外能力是哪一组？',
        options: [
          { text: '事务与并发控制、约束与一致性、按内容查询与索引', correct: true },
          { text: '更大的存储容量与更快的磁盘读写速度' },
          { text: '自动生成用户界面与报表' },
          { text: '把数据压缩成更小的文件以节省空间' }
        ],
        explain: '数据库的不可替代性在于「管得住」：多用户并发下保证事务正确、用约束守住一致性、用索引支持按内容而非按位置查询。容量与速度是硬件的事，界面与压缩都不是数据库的定义性能力。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '关系模型要求表中的行有固定的物理顺序，第 1 行永远排在第 2 行之前。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '关系是元组的集合，集合无序，SQL 不写 ORDER BY 就不保证任何顺序。物理存储顺序是实现的细节，与模型的语义无关。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '数据库的三级模式架构包含下面哪几层？（多选）',
        options: [
          { text: '外模式（视图层，面向具体用户）', correct: true },
          { text: '概念模式（全局逻辑结构）', correct: true },
          { text: '内模式（物理存储结构）', correct: true },
          { text: '应用模式（前端页面的布局）' },
          { text: '网络模式（客户端与服务器的连接方式）' }
        ],
        explain: '三级模式是外模式、概念模式、内模式。前端的页面布局与网络连接都不属于数据模式，它们是应用与部署层面的事。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '三级模式中，描述整个数据库全部数据的逻辑结构、不涉及物理存储的那一层叫 ______。',
        answer: '概念模式',
        accept: ['概念模式（conceptual schema）', 'conceptual schema', '模式'],
        explain: '概念模式是全局逻辑视图，外模式是它的子集投影，内模式描述它如何落到磁盘。修改内模式不影响概念模式，这就是物理数据独立性。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '关系模型在 1970 年代击败层次与网状模型，最关键的工程原因是什么？',
        options: [
          { text: '用声明式查询把「怎么取」交给优化器，用户只描述「要什么」', correct: true },
          { text: '它占用的磁盘空间最小' },
          { text: '它不支持 NULL，因此语义更简单' },
          { text: '它要求应用自己维护指针，速度快' }
        ],
        explain: '关系模型把访问路径的选择交给优化器，应用只写声明式查询，因此表结构变化不会大面积破坏代码。层次与网状模型要求应用沿指针导航，一旦结构调整就要重写程序。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '贯穿全课的选课系统例子里，学生与课程之间的选课关系最适合放在哪里？',
        options: [
          { text: '一张独立的选课表，主键是学生号与课程号的组合', correct: true },
          { text: '学生表里的一个课程列表字段' },
          { text: '课程表里的一个学生列表字段' },
          { text: '不需要建表，查询时临时拼出来' }
        ],
        explain: '多对多联系必须独立成表，否则一个字段要存多个值，违反第一范式，也无法给每次选课附带学期、成绩等属性，更无法建外键约束。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'fill', difficulty: 1,
        tags: ['tool'],
        stem: 'SQL 语句按功能分为 DDL、DML、DCL 三类，其中负责授予与收回权限的是 ______。',
        answer: 'DCL',
        accept: ['DCL（数据控制语言）', '数据控制语言', 'Data Control Language'],
        explain: 'DDL 定义结构（CREATE/ALTER/DROP），DML 操作数据（SELECT/INSERT/UPDATE/DELETE），DCL 管理权限（GRANT/REVOKE），事务控制通常单列为 TCL。'
      },

      /* ---------------- ch01 ER 建模 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '一个学生可以选多门课，一门课可以被多个学生选，这个联系的基数比是？',
        options: [
          { text: '多对多（M:N）', correct: true },
          { text: '一对多（1:N）' },
          { text: '多对一（N:1）' },
          { text: '一对一（1:1）' }
        ],
        explain: '两个方向都是「多」，即 M:N。它在转换时要独立成表，主键由两端主键组合而成；若是一对多，则把外键放在「多」的那一端，不必新建表。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '弱实体不能独立存在，它的主键必须包含其所依赖的强实体的主键。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '弱实体的标识依赖（identifying relationship）意味着它自己没有全局唯一的键，必须借用强实体的主键构成复合主键，例如「选课」依附于「学生」。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '把 ER 图转换成关系模式时，下面哪些做法是正确的？（多选）',
        options: [
          { text: '每个强实体转成一张表，主键沿用实体的键', correct: true },
          { text: '一对多联系把外键放在「多」的一端', correct: true },
          { text: '多对多联系独立成表，主键取两端主键的组合', correct: true },
          { text: '每个属性都必须单独建一张表' },
          { text: '所有联系都转成独立表，不管基数比' }
        ],
        explain: '实体成表、一对多靠外键、多对多独立成表是三条基本规则。属性是表中的列，不该单独建表；一对多若也独立成表会产生冗余与额外连接。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '多对多联系转换为关系模式时，新表的主键由两端实体的主键 ______ 构成。',
        answer: '组合',
        accept: ['组合（联合）', '联合', '组合而成', '联合主键'],
        explain: '两端主键的组合才能唯一确定一次联系实例。若组合不唯一（同一学生可重复选同一门课），要把学期等区分属性一并加入主键。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '「供应商—零件—项目」三者同时参与的三元联系，与拆成三个二元联系相比，关键差别是？',
        options: [
          { text: '三元联系能表达「三者同时出现才成立」，拆开后可能造出并不存在的组合', correct: true },
          { text: '三元联系占用更少的存储空间' },
          { text: '三元联系不需要主键' },
          { text: '两者完全等价，只是画法不同' }
        ],
        explain: '拆成三个二元联系会丢失「同一次供货同时涉及这三方」的约束，连接回来可能产生原表中不存在的三元组。是否拆分要看业务语义，不能只按图方便。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '把「系主任姓名」作为学生表的一个属性，最直接的后果是什么？',
        options: [
          { text: '同一系主任被重复存储，改一次要改多行，容易不一致', correct: true },
          { text: '查询会变慢，但数据仍然正确' },
          { text: '无法再建立外键约束' },
          { text: '学生表的主键会失效' }
        ],
        explain: '这是典型的传递依赖：学号决定系，系决定系主任。同一事实重复存储会带来更新异常，正确做法是把系单独成表并以 dept 作为学生表的外键。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '需求要求「每个学生必须属于且仅属于一个系」，转换后学生表的外键列应当声明为 ______。',
        answer: 'NOT NULL',
        accept: ['NOT NULL（非空）', '非空', 'not null'],
        explain: '外键默认允许 NULL，表示「暂无归属」。要把「必须有」的参与约束落到 schema 上，就要同时加 NOT NULL，否则约束只保证「若有值则必须存在」。'
      },

      /* ---------------- ch02 关系代数 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '关系代数中的投影 π 与 SQL 的 SELECT 列表，最主要的语义差别是？',
        options: [
          { text: 'π 按集合语义自动去重，SQL 默认保留重复行', correct: true },
          { text: 'π 只能选一列，SQL 可以选多列' },
          { text: 'π 会改变行的顺序，SQL 不会' },
          { text: '两者完全一致，没有差别' }
        ],
        explain: '关系是集合，投影后重复元组合并；SQL 的表是多重集，要 DISTINCT 才去重。写代数式再翻译成 SQL 时忘记这一点，会在计数类查询上算错。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '自然连接会在两张表所有同名的列上做等值比较，并去掉重复的列。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '这正是自然连接「省事也危险」的原因：若两张表都有 name 列而语义不同（学生姓名与课程名），连接会在名字上配对，结果静默少一大半行。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些属于关系代数的六个基本运算？（多选）',
        options: [
          { text: '选择 σ', correct: true },
          { text: '投影 π', correct: true },
          { text: '笛卡尔积 ×', correct: true },
          { text: '除法 ÷' },
          { text: '外连接 ⟕' }
        ],
        explain: '六个基本运算是 σ、π、∪、−、×、ρ。除法与外连接都是派生运算，可以用基本运算组合表达——除法的四步展开就是典型例子。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: 'R(A,B) ÷ S(B) 的结果，是所有与 S 中每一个 B 值都配对过的 ______ 的集合。',
        answer: 'A 值',
        accept: ['A 值', 'A', 'A属性值', 'A 的属性值'],
        explain: '除法的语义是「对所有……都……」，典型查询是「选修了全部数据库课的学生学号」。用基本运算展开要三步反证：全体 × S 减去实际，取补再取差。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '查询「平均分高于 85 的课程」，聚合条件 σ 应放在分组 γ 的哪一侧？',
        options: [
          { text: 'γ 的外侧，因为条件引用的是聚合结果', correct: true },
          { text: 'γ 的内侧，先筛掉低分再平均' },
          { text: '两侧都行，结果相同' },
          { text: '聚合查询不能用 σ，只能手算' }
        ],
        explain: '分组前每行是单个成绩，平均分还不存在；引用聚合结果的条件必须作用在 γ 的输出上，对应 SQL 的 HAVING。放在内侧会变成「先剔除低分再算平均」，语义完全不同。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '「列出所有学生及其选课数，没选课的显示 0」，需要哪种连接配合哪种计数？',
        options: [
          { text: '左外连接，且用 COUNT(子表列) 而不是 COUNT(*)', correct: true },
          { text: '内连接，用 COUNT(*)' },
          { text: '笛卡尔积，用 COUNT(*)' },
          { text: '右外连接，用 SUM(1)' }
        ],
        explain: '左外连接保留没选课的学生，并用 NULL 补齐子表列；COUNT(列) 不数 NULL 所以得 0，COUNT(*) 会把补出来的那一行算成 1。内连接则让没选课的学生整个消失。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '把 σ 从连接的外层推进到连接的分支里，这条最常用的等价律叫 ______。',
        answer: '选择下推',
        accept: ['选择下推', '选择下推律', 'selection pushdown', 'pushing selections down'],
        explain: 'σ(R ⋈ S) ≡ (σR) ⋈ (σS)。先筛再连能把参与连接的行数从全表降到少量，是优化器最先做的一步，也是「400 亿行变成 8 万行」的来源。'
      },

      /* ---------------- ch03 SQL 查询 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: 'WHERE 子句里不能直接使用聚合函数，根本原因是？',
        options: [
          { text: 'WHERE 在 GROUP BY 之前执行，那时还没有分组', correct: true },
          { text: '聚合函数只能出现在 SELECT 里，语法规定' },
          { text: 'WHERE 只支持比较运算，不支持函数调用' },
          { text: '聚合函数会破坏索引，所以被禁止' }
        ],
        explain: '逻辑执行顺序是 FROM→ON→JOIN→WHERE→GROUP BY→HAVING→SELECT→DISTINCT→ORDER BY。WHERE 阶段每行还是独立的原始行，没有「组」可供聚合；聚合条件必须放 HAVING。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['code'],
        stem: '写了 LEFT JOIN 之后，在 WHERE 里加 <code>e.grade &gt; 80</code> 仍然能保留那些没选课的学生。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '外连接补出来的行 grade 是 NULL，NULL > 80 的结果是 UNKNOWN，WHERE 只保留 TRUE，于是这些行被删掉，外连接等价于被降级成内连接。要保留就得把条件下推到 ON 里。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'multi', difficulty: 3,
        tags: ['concept'],
        stem: '关于 SQL 中的 NULL，下面哪些说法正确？（多选）',
        options: [
          { text: '任何值与 NULL 用 = 比较都得不到 TRUE', correct: true },
          { text: 'NOT IN 的子查询结果含 NULL 时，整条查询可能返回空集', correct: true },
          { text: 'COUNT(列) 不统计该列为 NULL 的行', correct: true },
          { text: 'NULL 与空字符串是同一个东西' },
          { text: 'ORDER BY 默认把 NULL 排在最前面，各产品一致' }
        ],
        explain: '前三项都是三值逻辑的直接后果。NULL 表示未知，与空字符串不同；各产品对 NULL 的排序位置默认值不一致（MySQL 视为最小、PostgreSQL 视为最大），必须显式指定。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: 'COUNT(*) 与 COUNT(列) 的关键差别是：后者不统计该列为 ______ 的行。',
        answer: 'NULL',
        accept: ['NULL', 'null', '空值'],
        explain: '这个差别在外连接后决定结果是 0 还是 1：补出来的行子表列全为 NULL，COUNT(列) 得 0，COUNT(*) 得 1。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['code'],
        stem: '「选修了全部数据库课的学生」在 SQL 中的标准解法是？',
        options: [
          { text: '双重 NOT EXISTS：不存在一门数据库课该生没选', correct: true },
          { text: '用 IN 列出所有数据库课号即可' },
          { text: '用 COUNT(*) = 课程总数 判断，但必须是外层查询' },
          { text: 'SQL 有专门的 DIVIDE BY 关键字' }
        ],
        explain: 'SQL 没有除法关键字，标准解法是双重否定，逐字对应关系代数的 R ÷ S 四步展开。用 IN 只能表达「选了至少一门」，计数法要求课程集合静态且容易在选课重复时算错。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '取「每门课成绩前两名」时，对并列第三名的处理，用哪个函数会跳过名次号？',
        options: [
          { text: 'RANK()，并列后直接跳到 3', correct: true },
          { text: 'DENSE_RANK()，并列后仍是 2' },
          { text: 'ROW_NUMBER()，并列也会给出不同号' },
          { text: 'COUNT() OVER ()，按累计计数' }
        ],
        explain: 'RANK 给出 1,1,3（并列同名、后续跳号）；DENSE_RANK 给出 1,1,2；ROW_NUMBER 强行编号 1,2,3 不重复。选错会让「前两名」多取或少取。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-6', tier: 1, type: 'fill', difficulty: 2,
        tags: ['code'],
        stem: '把一条长查询拆成若干有名字的步骤，使用的关键字是 ______。',
        answer: 'WITH',
        accept: ['WITH', 'with', 'CTE', '公共表表达式'],
        explain: 'WITH 名字 AS (...) 定义公共表表达式，主要收益是可读性与可调试性——可以逐段 SELECT * FROM 名字 检查中间结果，而不是对着四层嵌套猜。'
      },

      /* ---------------- ch04 高级 SQL ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '普通视图（非物化）的本质是什么？',
        options: [
          { text: '一条被命名的查询，每次引用时重新执行', correct: true },
          { text: '一份数据的物理副本，随基表同步更新' },
          { text: '一张独立的表，与基表没有关系' },
          { text: '一个只存在于内存中的临时结果，会话结束即消失' }
        ],
        explain: '普通视图不存数据，只存定义；查询时把定义展开到外层语句里执行。物化视图才存结果，代价是需要刷新策略、可能读到过期数据。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '一个连接了两张表的视图，一定可以直接执行 INSERT 与 UPDATE。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '多表视图的写入无法无歧义地映射回某一张基表，因此不可更新。可更新视图要求只涉及单张基表、不含聚合/DISTINCT/GROUP BY/UNION，且包含基表主键。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '使用触发器需要警惕哪些问题？（多选）',
        options: [
          { text: '级联触发：A 的触发器改 B，B 的触发器又改 A', correct: true },
          { text: '逻辑不可见：应用开发者不知道有触发器，批量写入时性能骤降', correct: true },
          { text: '不可移植：各家语法差异大，迁移时几乎要重写', correct: true },
          { text: '触发器无法访问 NEW 与 OLD 两个伪记录' },
          { text: '触发器只能定义在视图上，不能定义在表上' }
        ],
        explain: '前三条是触发器的三个经典危险。NEW/OLD 是触发器的标准能力（INSERT 只有 NEW，DELETE 只有 OLD），触发器也确实定义在表上，后两项说反了。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'fill', difficulty: 2,
        tags: ['code'],
        stem: '要让通过视图插入的行必须仍满足视图定义中的条件，建视图时要加 ______。',
        answer: 'WITH CHECK OPTION',
        accept: ['WITH CHECK OPTION', 'with check option', 'CHECK OPTION'],
        explain: '没有它时，通过 WHERE grade >= 60 的视图插入一行 grade = 50 会成功，但这行之后从视图里查不到——数据没丢、「写进去看不见」，比报错更难排查。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '外键声明 ON DELETE CASCADE 后，删除父行时会发生什么？',
        options: [
          { text: '所有引用该父行的子行被一并删除', correct: true },
          { text: '删除被拒绝，直到子行先被手工删除' },
          { text: '子行的外键被置为 NULL，子行保留' },
          { text: '删除父行，子行保留但外键变成无效值' }
        ],
        explain: 'CASCADE 连带删除，SET NULL 才是置空，RESTRICT/NO ACTION 才是拒绝。CASCADE 最省事也最危险——一条 DELETE 可能连锁删掉几万条从属记录。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-7', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['security'],
        stem: '防止 SQL 注入唯一可靠的手段是？',
        options: [
          { text: '参数化查询，让数据与 SQL 语法分开传输', correct: true },
          { text: '对用户输入做转义，把单引号替换成两个' },
          { text: '过滤掉 SELECT、DROP 等危险关键词' },
          { text: '把数据库账号的权限设成只读' }
        ],
        explain: '转义在多字节编码与不同方言下都有绕过案例；黑名单永远列不全。只读权限能减轻后果，但读数据本身就是泄露。参数化让输入永远只当值，才是根治。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: 'SQL 中授予权限使用 ______ 语句，收回权限使用 REVOKE。',
        answer: 'GRANT',
        accept: ['GRANT', 'grant'],
        explain: 'GRANT 动作 ON 客体 TO 主体。加上 WITH GRANT OPTION 可转授，形成授权链；收回时 REVOKE ... CASCADE 会沿链收回所有下游授权。'
      },

      /* ---------------- ch05 范式 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '学生退掉全部课程后，删掉其选课记录的同时丢失了「他属于哪个系」这一事实，属于？',
        options: [
          { text: '删除异常', correct: true },
          { text: '更新异常' },
          { text: '插入异常' },
          { text: '幻读' }
        ],
        explain: '删除一行却连带丢失了与删除目的无关的事实，就是删除异常，根源是一行同时描述多件事。解法是把院系归属拆到独立的表里。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '如果一张表的现有数据里找不到违反某条函数依赖的反例，就可以断定该依赖成立。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '数据只能否证依赖，不能证明它。FD 是语义约束——「学号决定姓名」成立是因为业务规则，而不是因为样本里恰好没有重名。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: 'Armstrong 公理包含下面哪三条？（多选）',
        options: [
          { text: '自反律：若 Y ⊆ X，则 X → Y', correct: true },
          { text: '增广律：若 X → Y，则 XZ → YZ', correct: true },
          { text: '传递律：若 X → Y 且 Y → Z，则 X → Z', correct: true },
          { text: '分解律：若 X → YZ，则 X → Y' },
          { text: '合并律：若 X → Y 且 X → Z，则 X → YZ' }
        ],
        explain: '三条公理是自反、增广、传递，它们完备且可靠。分解律与合并律都能由公理推出，属于常用导出规则，不算公理本身。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '若属性集 X 的闭包 X⁺ 覆盖了关系的全部属性，则 X 是一个 ______。',
        answer: '超键',
        accept: ['超键', 'superkey', 'super key', '候选键的超集'],
        explain: '闭包覆盖全表意味着「知道 X 就能确定整行」，即超键。再逐个去掉属性检验极小性，剩下不可再删的才是候选键。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '判断一个关系是否满足 BCNF，标准是？',
        options: [
          { text: '每条非平凡函数依赖的左部都是超键', correct: true },
          { text: '每张表只有一个主键' },
          { text: '所有属性都是主属性' },
          { text: '不存在部分函数依赖，但允许传递依赖' }
        ],
        explain: 'BCNF 的条件是「决定因素必须是超键」，它同时排除了部分依赖与传递依赖。第三项描述的是 3NF 的必要条件之一，第四项只排除了部分依赖（2NF）。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '关系 R(student, course, teacher) 满足 {student, course} → teacher 与 teacher → course，它说明 BCNF 的什么局限？',
        options: [
          { text: 'BCNF 分解可能丢失依赖保持，只能退到 3NF', correct: true },
          { text: 'BCNF 分解可能不是无损连接' },
          { text: 'BCNF 无法处理三元关系' },
          { text: 'BCNF 要求所有属性都必须是主属性' }
        ],
        explain: '该关系满足 3NF（course 是主属性）但违反 BCNF。强行按 BCNF 分解后，{student, course} → teacher 变成跨表约束无法在单表表达，即依赖丢失。BCNF 分解本身是无损的。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 3, type: 'fill', difficulty: 3,
        tags: ['concept'],
        stem: '把 R 分解为 R1 与 R2，若 R1 ∩ R2 → R1 或 R1 ∩ R2 → R2 成立，则该分解是 ______ 的。',
        answer: '无损连接',
        accept: ['无损连接', '无损', 'lossless', 'lossless join'],
        explain: '这就是无损连接判定定理。注意「无损」指连接后不产生多余的行，而不是「数据不丢失」；有损分解的典型症状是连接后行数变多。'
      },

      /* ---------------- ch06 存储与索引 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '数据库的所有性能优化，最终都可以归结为哪件事？',
        options: [
          { text: '减少页读次数，或把随机 IO 变成顺序 IO', correct: true },
          { text: '减少 SQL 语句的字符数' },
          { text: '把表拆成尽可能多的列' },
          { text: '尽量使用子查询代替连接' }
        ],
        explain: '一次随机 IO 与一次顺序 IO 差三到四个数量级，而所有代价最终都折算成页读。索引、聚簇、连接算法、缓冲池，做的都是同一件事的两个方向。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '联合索引 (a, b, c) 可以直接支持只按 b 列过滤的查询。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '联合索引只对从左起连续的前缀有效：(a)、(a,b)、(a,b,c)。跳过 a 直接按 b 查，相当于在按姓氏排序的电话簿里找所有叫张三的人，只能全表扫描。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['code'],
        stem: '下面哪些写法会让 B+ 树索引失效？（多选）',
        options: [
          { text: '在索引列上套函数，如 <code>WHERE YEAR(created_at) = 2026</code>', correct: true },
          { text: '左模糊匹配，如 <code>LIKE &#39;%abc&#39;</code>', correct: true },
          { text: '<code>VARCHAR</code> 列与数字比较，触发隐式类型转换', correct: true },
          { text: '等值查询 <code>WHERE sid = &#39;S001&#39;</code>' },
          { text: '范围查询 <code>WHERE age BETWEEN 20 AND 30</code>' }
        ],
        explain: '前三项都让「索引里存的值」与「比较的值」不在同一形态，B+ 树无法定位。等值与范围查询恰恰是 B+ 树最擅长的两类，都能正常走索引。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['tool'],
        stem: 'MySQL 的 EXPLAIN 输出里，Extra 列出现 ______ 表示用到了覆盖索引、无需回表。',
        answer: 'Using index',
        accept: ['Using index', 'using index', 'Using index condition 之外的 Using index'],
        explain: '覆盖索引指查询需要的列全在索引里，可以直接从索引返回，省掉每行一次随机回表。「回表」才是二级索引查询慢的主因。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '哈希索引不适合下面哪类查询？',
        options: [
          { text: '范围查询 <code>WHERE age &gt; 30</code> 与排序', correct: true },
          { text: '等值查询 <code>WHERE session_id = &#39;abc&#39;</code>' },
          { text: '主键点查' },
          { text: '内存表中的键值查找' }
        ],
        explain: '哈希打乱了顺序，只能等值定位，无法支持范围与排序。这也是 B+ 树成为默认索引结构的原因——它同时支持等值、范围、排序与前缀匹配。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '2 万行的 student 连接 200 万行的 enroll，且要输出 enroll 的大部分行，哪种算法通常最快？',
        options: [
          { text: '哈希连接：小表建哈希表，大表顺序扫一遍', correct: true },
          { text: '嵌套循环：以 student 为外表逐行查 enroll 索引' },
          { text: '块嵌套循环：不做索引，按页反复扫描' },
          { text: '三种算法代价完全相同' }
        ],
        explain: '要输出大表的大部分行时，嵌套循环的每行一次索引回表会退化成海量随机 IO；哈希连接是 O(N+M) 且以顺序 IO 为主，通常快一个数量级。若只取几个学生则相反。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'fill', difficulty: 2,
        tags: ['tool'],
        stem: '大批量导入数据后，应执行 ______ 命令刷新统计信息，否则优化器会按过期行数估算代价。',
        answer: 'ANALYZE TABLE',
        accept: ['ANALYZE', 'ANALYZE TABLE', 'analyze table', 'ANALYZE TABLE enroll'],
        explain: '优化器靠行数、不同值个数与直方图估算选择率。统计信息过期时它可能以为表还很小，从而选错访问路径；EXPLAIN 里估算行数与实际差一个数量级就是典型信号。'
      },

      /* ---------------- ch07 事务 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: 'ACID 四个性质中，主要由应用（而非数据库）负责保证的是？',
        options: [
          { text: '一致性（Consistency）', correct: true },
          { text: '原子性（Atomicity）' },
          { text: '隔离性（Isolation）' },
          { text: '持久性（Durability）' }
        ],
        explain: '原子性靠 undo 日志、隔离性靠锁或 MVCC、持久性靠 WAL 与刷盘，都是数据库机制。一致性指业务不变式（如转账前后总金额不变），必须由事务逻辑与约束共同维护。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '把隔离级别调到 REPEATABLE READ 就能自动防止丢失更新。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '丢失更新发生在「读—改—写」之间，两个事务都基于同一旧值计算。隔离级别保证单行的读一致性，但不阻止后写覆盖先写。修法是 SELECT ... FOR UPDATE 或加版本号做乐观并发控制。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些属于并发事务可能引发的异常？（多选）',
        options: [
          { text: '脏读：读到别的事务未提交的修改', correct: true },
          { text: '不可重复读：同一事务两次读同一行结果不同', correct: true },
          { text: '幻读：两次范围查询中间多出新插入的行', correct: true },
          { text: '页分裂：插入导致 B+ 树节点拆分' },
          { text: '检查点：把脏页刷回磁盘' }
        ],
        explain: '前三项是四类并发异常中的三个（第四个是丢失更新）。页分裂与检查点都是存储与恢复机制的正常行为，不是并发异常。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '要求事务只能在增长阶段加锁、在收缩阶段解锁的封锁协议叫 ______。',
        answer: '两阶段封锁',
        accept: ['两阶段封锁', '2PL', 'two-phase locking', '两段锁协议'],
        explain: '2PL 保证任何遵守它的调度都冲突可串行化。变体「严格 2PL」把所有锁持有到事务结束，额外保证可恢复性，商业数据库大多采用它或其 MVCC 变体。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-5', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '一个调度的优先图（precedence graph）无环，说明什么？',
        options: [
          { text: '该调度冲突可串行化，拓扑序给出一个等价串行顺序', correct: true },
          { text: '该调度不会死锁，但可能读到脏数据' },
          { text: '该调度一定没有并发，是串行执行的' },
          { text: '该调度不满足 ACID 的一致性' }
        ],
        explain: '优先图无环 ⇔ 冲突可串行化，拓扑排序的结果就是一个等价的串行顺序。判定的是「等价于某个串行顺序」，不要求真的串行执行。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '数据库周期性构造锁等待图并寻找环，这属于死锁处理的哪条路线？',
        options: [
          { text: '检测，找到环后选一个牺牲者回滚', correct: true },
          { text: '预防，用时间戳决定等待还是中止' },
          { text: '超时，等够阈值就回滚' },
          { text: '忽略，死锁会自行消失' }
        ],
        explain: '等待图找环是检测路线，代价是检测开销与可能误杀。预防路线用的是等待—死亡/伤害—等待协议；超时路线最简单但可能回滚本不必回滚的事务。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-7', tier: 1, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '要求先把日志记录写到磁盘、再把数据页写回磁盘的协议简称 ______。',
        answer: 'WAL',
        accept: ['WAL', 'wal', '预写日志', 'Write-Ahead Logging'],
        explain: 'WAL 保证日志永远比数据页新，于是崩溃后总能从日志重建正确状态。事务提交时刷的是日志而不是数据页，一次顺序写换掉一堆随机写，这正是持久性高效实现的原因。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
