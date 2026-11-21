/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'csc3170',
  short: 'CSC3170',
  name: '数据库系统',
  en: 'Database Systems',
  dept: '计算机科学',
  lang: 'sql',
  langLabel: 'SQL',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'CSC3170 // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... CSC3170',
    '> loading 8 modules ...',
    '> calibrating glossary & quiz bank ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '把课程读成一张可以走通的地图。',
  missionEn: 'CSC3170 · 8 MODULES',
  missionTitle: '从零开始<br><em>数据库系统</em>',
  lede: '从 ER 图到 SQL、从范式到 B+ 树、从事务到崩溃恢复：每一章都有例子、对比表、常见错误与自检清单，配题库与模拟卷检验掌握程度。',
  searchPlaceholder: 'QUERY // 搜索本站章节、术语与题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/CSC3170/',
  resources: {
    note: '收录 CSC3170 的讲义（Part 01–18）、作业与习题课材料；文件名保持原始命名，点击后用系统默认程序打开。讲义 Part 编号与本站章节的对应关系见每组 note。',
    groups: [
      { name: '讲义与大纲', note: 'Part 01–02 对应 ch00–ch01 的建模基础，Part 03–18 依次覆盖关系模型、SQL、范式、存储与事务。', items: [
        { title: '课程大纲（Outline）', path: '学习资料/CSC3170_2026_Outline.pdf', kind: 'pdf', note: '评分构成、周次安排与参考书' },
        { title: '讲义 Part 01 · 课程介绍与数据库概览', path: '学习资料/CSC3170_2026_Lecture_Notes_Part_1.pdf', kind: 'pdf', note: '对应 ch00：数据库与文件系统的差别、三级模式' },
        { title: '讲义 Part 02 · 数据库体系结构', path: '学习资料/CSC3170_2026_Lecture_Notes_Part_2.pdf', kind: 'pdf', note: '对应 ch00–ch01：数据独立性、角色与工具链' },
        { title: '讲义 Part 03 · ER 模型（一）', path: '学习资料/CSC3170_Lecture_Notes_CSC3170_2026_Part_03.pdf', kind: 'pdf', note: '对应 ch01：实体、属性、联系的画法' },
        { title: '讲义 Part 04 · ER 模型（二）', path: '学习资料/CSC3170_Lecture_Notes_CSC3170_2026_Part_04.pdf', kind: 'pdf', note: '对应 ch01：弱实体、三元联系与转换规则' },
        { title: '讲义 Part 05 · 关系模型', path: '学习资料/CSC3170_Lecture_Notes_CSC3170_2026_Part_05.pdf', kind: 'pdf', note: '对应 ch02：模式、实例、键与完整性约束' },
        { title: '讲义 Part 06 · 关系代数', path: '学习资料/CSC3170_Lecture_Notes_CSC3170_2026_Part_06.pdf', kind: 'pdf', note: '对应 ch02：六个基本运算与除法' },
        { title: '讲义 Part 07 · SQL 基础', path: '学习资料/CSC3170_Lecture_Notes_CSC3170_2026_Part_07.pdf', kind: 'pdf', note: '对应 ch03：SELECT、连接与聚合的第一遍' },
        { title: '讲义 Part 08 · SQL 进阶', path: '学习资料/CSC3170_Lecture_Notes_CSC3170_2026_Part_08.pdf', kind: 'pdf', note: '对应 ch03：子查询、NULL 与集合运算' },
        { title: '讲义 Part 09 · 视图与约束', path: '学习资料/CSC3170_Lecture_Notes_CSC3170_2026_Part_09.pdf', kind: 'pdf', note: '对应 ch04：可更新视图、外键动作与 CHECK' },
        { title: '讲义 Part 10 · 触发器与存储过程', path: '学习资料/CSC3170_Lecture_Notes_CSC3170_2026_Part_10.pdf', kind: 'pdf', note: '对应 ch04：触发器风险、游标与权限' },
        { title: '讲义 Part 11 · 函数依赖', path: '学习资料/CSC3170_Lecture_Notes_CSC3170_2026_Part_11.pdf', kind: 'pdf', note: '对应 ch05：Armstrong 公理与属性闭包' },
        { title: '讲义 Part 12 · 范式', path: '学习资料/CSC3170_Lecture_Notes_CSC3170_2026_Part_12.pdf', kind: 'pdf', note: '对应 ch05：2NF/3NF/BCNF 与分解' },
        { title: '讲义 Part 13 · 存储与文件组织', path: '学习资料/CSC3170_Lecture_Notes_CSC3170_2026_Part_13.pdf', kind: 'pdf', note: '对应 ch06：页、缓冲池、堆文件与聚簇' },
        { title: '讲义 Part 14 · 索引结构', path: '学习资料/CSC3170_Lecture_Notes_CSC3170_2026_Part_14.pdf', kind: 'pdf', note: '对应 ch06：B+ 树、扇出与哈希索引' },
        { title: '讲义 Part 15 · 查询处理', path: '学习资料/CSC3170_Lecture_Notes_CSC3170_2026_Part_15.pdf', kind: 'pdf', note: '对应 ch06：三种连接算法与代价估算' },
        { title: '讲义 Part 16 · 查询优化', path: '学习资料/CSC3170_Lecture_Notes_CSC3170_2026_Part_16.pdf', kind: 'pdf', note: '对应 ch06：等价变换、统计信息与执行计划' },
        { title: '讲义 Part 17 · 事务与并发控制', path: '学习资料/CSC3170_Lecture_Notes_CSC3170_2026_Part_17.pdf', kind: 'pdf', note: '对应 ch07：ACID、隔离级别、2PL 与死锁' },
        { title: '讲义 Part 18 · 恢复与日志', path: '学习资料/CSC3170_Lecture_Notes_CSC3170_2026_Part_18.pdf', kind: 'pdf', note: '对应 ch07：WAL、检查点与 undo/redo' }
      ] },
      { name: '作业与项目', note: '作业的重点是「写得出、跑得对」；项目要求完整的 schema 设计与查询实现，评分看正确性与可读性。', items: [
        { title: 'Assignment 01 · 题目', path: '作业习题/CSC3170_Assignment_01.pdf', kind: 'pdf', note: 'ER 建模与关系代数的第一组练习' },
        { title: 'Assignment 01 · 题目与参考答案', path: '作业习题/CSC3170_2026_Assgt1_Questions_and_Solution.docx', kind: 'docx', note: '含每题给分点，适合自查' },
        { title: 'Assignment 02 · 题目', path: '作业习题/CSC3170_Assignment_02.pdf', kind: 'pdf', note: 'SQL 查询与范式的第二组练习' },
        { title: 'Assignment 02 · 题目与解答', path: '作业习题/CSC3170_DB_Assgt_2_Questions_with_Solns.docx', kind: 'docx', note: '查询写法的对照与常见错误' },
        { title: '课程项目说明', path: '作业习题/CSC3170_Project_CSC3170_2026.pdf', kind: 'pdf', note: '项目要求、交付物与评分标准，可与本站 P1–P3 对照' }
      ] },
      { name: '习题课与上机', note: 'Tutorial 01–06 是 PDF，07 与 10 是 pptx；先按 Tutorial 01 的安装指南把 MySQL 装好，后面每讲都有对应的查询练习。', items: [
        { title: 'Windows 安装 MySQL 指南', path: '作业习题/CSC3170_tutorial_for_installing_mysql_on_windows.pdf', kind: 'pdf', note: '从第一步开始照做，装完能用命令行登录即算通过' },
        { title: 'Tutorial 01 · 环境与第一组查询', path: '作业习题/CSC3170_Tutorial_01.pdf', kind: 'pdf', note: '建库建表、导入样例数据、SELECT 入门' },
        { title: 'Tutorial 02 · 连接与聚合', path: '作业习题/CSC3170_Tutorial_02.pdf', kind: 'pdf', note: '内外连接、GROUP BY 与 HAVING 的课堂练习' },
        { title: 'Tutorial 03 · 子查询与集合运算', path: '作业习题/CSC3170_Tutorial_03.pdf', kind: 'pdf', note: 'EXISTS、IN、除法类查询的写法' },
        { title: 'Tutorial 04 · 视图与约束', path: '作业习题/CSC3170_Tutorial_04.pdf', kind: 'pdf', note: '建视图、加外键与 CHECK 的动手题' },
        { title: 'Tutorial 05 · 索引与执行计划', path: '作业习题/CSC3170_Tutorial_05.pdf', kind: 'pdf', note: 'EXPLAIN 逐列解读与索引调优' },
        { title: 'Tutorial 06 · 事务与锁', path: '作业习题/CSC3170_Tutorial_06.pdf', kind: 'pdf', note: '两个会话复现并发异常、观察锁等待' },
        { title: 'Tutorial 07 · 触发器与存储过程', path: '作业习题/CSC3170_Tutorial_07.pptx', kind: 'pptx', note: '触发器语法、游标与异常处理' },
        { title: 'Tutorial 10 · 综合复习', path: '作业习题/CSC3170_Tutorial_10.pptx', kind: 'pptx', note: '期末题型串讲与易错点汇总' }
      ] }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '数据库系统（Database Systems）'],
    ['来源', 'CUHKSZ CSC3170 课程资料'],
    ['结构', '8 章正文 · 56 题题库 · 模拟卷 · 3 个实战项目 · 资料库'],
    ['建议', '先读第 0 章建立地图，再按顺序推进；每章结尾的自检清单不要跳过。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    { label: '关系代数 ↔ SQL', blocks: [
      { t: 'table', head: ['代数', '含义', 'SQL 对应', '注意'], rows: [
        ['<code>σ<sub>P</sub>(R)</code>', '选择满足谓词的行', '<code>WHERE P</code>', 'NULL 参与比较得 UNKNOWN，行被丢弃'],
        ['<code>π<sub>A</sub>(R)</code>', '投影出指定列', '<code>SELECT DISTINCT A</code>', '代数按集合去重，SQL 默认不去重'],
        ['<code>R ∪ S</code>', '并', '<code>UNION</code>（保留重复用 UNION ALL）', '两表列数与类型必须兼容'],
        ['<code>R − S</code>', '差', '<code>EXCEPT</code> 或 <code>NOT EXISTS</code>', 'MySQL 8.0 才支持 EXCEPT'],
        ['<code>R × S</code>', '笛卡尔积', '<code>FROM R, S</code>', '行数是乘积，忘了连接条件就是灾难'],
        ['<code>R ⋈ S</code>', '自然连接（同名等值）', '<code>NATURAL JOIN</code> 或 <code>JOIN ... USING</code>', '同名但语义不同的列会被错误配对'],
        ['<code>R ⟕ S</code>', '左外连接', '<code>LEFT JOIN</code>', 'WHERE 里过滤右表会退化成内连接'],
        ['<code>R ÷ S</code>', '除法（对所有）', '双重 <code>NOT EXISTS</code>', 'SQL 没有除法关键字']
      ], caption: '写查询的顺序：先用代数想清楚「集合怎么来」，再翻译成 SQL，最后才考虑索引' },
      { t: 'code', lang: 'sql', caption: '除法的双重否定写法：选了全部数据库课的学生', code: 'SELECT s.sid FROM student s\nWHERE NOT EXISTS (\n  SELECT 1 FROM course c\n  WHERE c.cname = &#39;DB&#39;\n    AND NOT EXISTS (\n      SELECT 1 FROM enroll e\n      WHERE e.sid = s.sid AND e.cid = c.cid\n    )\n);' },
      { t: 'callout', kind: 'tip', title: '一句话记住等价变换', html: '选择下推、投影下推、连接交换与结合——所有优化都在做同一件事：<b>尽早把数据变小</b>。' }
    ] },

    { label: 'SQL 执行顺序与 NULL', blocks: [
      { t: 'table', head: ['阶段', '子句', '此时能看到什么'], rows: [
        ['1', '<code>FROM / JOIN / ON</code>', '基表与连接后的行'],
        ['2', '<code>WHERE</code>', '单行，不能用聚合'],
        ['3', '<code>GROUP BY</code>', '把行压成组，NULL 自成一组'],
        ['4', '<code>HAVING</code>', '组，可以用聚合'],
        ['5', '<code>SELECT</code>', '计算表达式与窗口函数，定义别名'],
        ['6', '<code>DISTINCT</code>', '去重'],
        ['7', '<code>ORDER BY</code>', '可用 SELECT 的别名'],
        ['8', '<code>LIMIT / OFFSET</code>', '最后截断']
      ], caption: '别名只能在 ORDER BY 之后使用，就是因为 SELECT 在第 5 步才执行' },
      { t: 'table', head: ['表达式', '结果', '为什么会踩坑'], rows: [
        ['<code>NULL = NULL</code>', 'UNKNOWN', '判空必须用 <code>IS NULL</code>'],
        ['<code>NOT (NULL = 1)</code>', 'UNKNOWN', 'NOT UNKNOWN 仍是 UNKNOWN，行被过滤'],
        ['<code>COUNT(*)</code> 与 <code>COUNT(col)</code>', '数行 / 数非空', '外连接后差 1，决定了 0 还是 1'],
        ['<code>SUM(NULL)</code>', 'NULL', '空集求和是 NULL 不是 0，要 COALESCE'],
        ['<code>col NOT IN (子查询含 NULL)</code>', '整条为空', '改成 NOT EXISTS'],
        ['<code>AVG</code> 忽略 NULL', '分母变小', '结果偏高，算「参与者的平均」才对'],
        ['<code>ORDER BY col</code> 的 NULL 位置', '各家不同', 'MySQL 视为最小，PostgreSQL 视为最大，要显式指定']
      ], caption: '三值逻辑只有 TRUE 才保留行，UNKNOWN 与 FALSE 一样被扔掉' },
      { t: 'code', lang: 'sql', caption: '外连接 + 计数：没选课的学生显示 0', code: 'SELECT s.sid, s.name, COUNT(e.cid) AS cnt\nFROM student s\nLEFT JOIN enroll e ON e.sid = s.sid\nGROUP BY s.sid, s.name\nORDER BY cnt DESC;' }
    ] },

    { label: '范式判定', blocks: [
      { t: 'table', head: ['范式', '要求', '排除的异常', '怎么判'], rows: [
        ['1NF', '每列都是原子值', '一列存多个值', '看有没有逗号分隔的列表'],
        ['2NF', '1NF + 无部分依赖', '非主属性只依赖候选键的一部分', '候选键是组合键时才需要查'],
        ['3NF', '2NF + 无传递依赖', '非主属性依赖另一个非主属性', '每个 FD 左部是超键，或右部是主属性'],
        ['BCNF', '每个非平凡 FD 的左部都是超键', '主属性之间的依赖', '最严，但可能丢失依赖保持'],
        ['4NF', 'BCNF + 无多值依赖', '独立多值属性被塞进一张表', '出现「两个互不相关的多值属性」时查']
      ], caption: '判断顺序永远是：先求候选键 → 再看每个 FD 的左部 → 最后看分解是否无损' },
      { t: 'table', head: ['分解性质', '判定方法', '不满足的症状'], rows: [
        ['无损连接', '<code>R1 ∩ R2 → R1</code> 或 <code>→ R2</code> 成立', '连接后行数变多（有损）'],
        ['依赖保持', '所有原 FD 都能在某个 Ri 内推导', '跨表约束无法用单表 CHECK 表达'],
        ['BCNF 分解', '递归按违反的 FD 拆分', '一定无损，但可能不保依赖'],
        ['3NF 合成', '最小覆盖 + 每个 FD 成表 + 补候选键表', '既无损又保依赖，可能多一张表']
      ], caption: '「无损」指连接后不产生多余行，不是「数据不丢失」——这是最常见的名词误解' },
      { t: 'code', lang: 'sql', caption: '用 SQL 反查违反 FD 的数据', code: '-- 若 A → B 成立，下面必须返回 0 行\nSELECT A FROM R GROUP BY A HAVING COUNT(DISTINCT B) > 1;' }
    ] },

    { label: '索引、事务与恢复', blocks: [
      { t: 'table', head: ['现象', '机制', '看哪里'], rows: [
        ['全表扫描', '<code>type=ALL</code>，没有可用索引', 'EXPLAIN 的 type 与 key'],
        ['回表太多', '二级索引拿到主键再逐行取整行', '<code>rows</code> 大且 Extra 无 Using index'],
        ['索引失效', '列被函数包裹 / 隐式转换 / 左模糊', '改写 SQL 或用生成列'],
        ['排序开销', '<code>Using filesort</code>', '让 ORDER BY 走索引顺序'],
        ['临时表', '<code>Using temporary</code>', 'GROUP BY 与 ORDER BY 的列不一致']
      ], caption: '读 EXPLAIN 的顺序：type → key → rows → Extra，四列就能定位八成问题' },
      { t: 'table', head: ['隔离级别', '脏读', '不可重复读', '幻读'], rows: [
        ['READ UNCOMMITTED', '可能', '可能', '可能'],
        ['READ COMMITTED', '不可能', '可能', '可能'],
        ['REPEATABLE READ', '不可能', '不可能', 'InnoDB 用间隙锁基本避免'],
        ['SERIALIZABLE', '不可能', '不可能', '不可能']
      ], caption: '任何隔离级别都挡不住丢失更新，必须 FOR UPDATE 或版本号' },
      { t: 'compare', left: { title: 'WAL（预写日志）', html: '先写日志再写数据页，提交只等日志 fsync。崩溃后用 redo 重放已提交、undo 回滚未提交，把随机写变成顺序写。' }, right: { title: '影子分页', html: '写时复制到新页，提交时原子切换指针。无需 undo，但页分配分散、提交开销大，现代数据库基本不用。' } },
      { t: 'callout', kind: 'warn', title: '两个致命习惯', html: '一是 <code>WHERE</code> 里对索引列套函数，二是 <code>LEFT JOIN</code> 后在 <code>WHERE</code> 过滤右表——前者让索引白建，后者让外连接静默退化成内连接。' }
    ] }
  ]
};
