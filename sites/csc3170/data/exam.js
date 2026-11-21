/* =====================================================================
 * exam.js · CSC3170 模拟卷 A
 * 范围：ch00–ch07（课程地图 / ER 建模 / 关系代数 / SQL 查询 /
 *       高级 SQL / 范式 / 存储与索引 / 事务与恢复）
 * 规格：12 题、满分 100、限时 100 分钟
 * 题型：choice / tf / fill / output / keywords
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerExam({
    id: 'CSC3170-A',
    title: '数据库系统 模拟卷 A',
    style: '期末风格',
    subtitle: 'CSC3170 · 覆盖 ch00–ch07 的综合模拟',
    date: '2026-11-21',
    minutes: 100,
    totalScore: 100,
    summary: '本卷覆盖八章全部内容：数据模型与三级模式、ER 建模与转换、关系代数、SQL 查询与聚合、' +
      '视图与约束、函数依赖与范式、B+ 树索引与连接算法、事务与恢复。卷面 12 题：选择 3 组共 20 分、' +
      '判断 2 组共 12 分、填空 3 组共 20 分、写结果 2 组共 16 分、简答 2 组共 32 分。' +
      '建议闭卷限时完成；写 SQL 的题按语义给分，不要求与参考答案逐字一致，但表名、列名与连接条件必须正确。',
    instructions: [
      '时间 100 分钟，满分 100 分。计时开始后不会暂停，刷新页面也按真实时间计算。',
      '题型：单项选择 5 小问、判断 4 小问、填空 6 小问、写查询结果 4 小问、简答 4 小问。',
      'SQL 方言以 MySQL 8 为准；日期、字符串常量用单引号，标识符不加引号。',
      '写结果题只需写出列名与行，行序不作要求（除明确要求排序的题）。',
      '简答题按关键词命中比例给分，能写出机制名称 + 一句因果即可得分。',
      '涉及代价估算的题，只要求比较数量级，不要求精确到页数。'
    ],
    questions: [

      /* ---------------------------------------------------------- Q1 */
      { no: 1, points: 8, type: 'single choice',
        intro: '本题考察数据模型、键与完整性约束。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '一张学生表上声明了 <code>PRIMARY KEY (sid)</code>，下面哪条语句一定<b>不会</b>被拒绝？',
            options: [
              { text: '插入一行 sid 为 NULL 的记录' },
              { text: '插入两行 sid 相同但姓名不同的记录' },
              { text: '插入一行 sid 与已有记录不同、姓名为 NULL 的记录', correct: true },
              { text: '插入一行 sid 为空字符串的记录' }
            ],
            explain: '主键隐含 UNIQUE + NOT NULL，所以 NULL 与重复值都会被拒绝。姓名列若未声明 NOT NULL，' +
              '则可以取 NULL——这是「未知」而不是空字符串，两者都不违反主键约束。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '外键 <code>enroll(sid) REFERENCES student(sid)</code> 的作用是：',
            options: [
              { text: '保证 enroll 中出现的 sid 一定在 student 中存在', correct: true },
              { text: '保证 student 中每个 sid 都至少被选过一次课' },
              { text: '保证 enroll 的 sid 唯一' },
              { text: '自动为 enroll 建立主键' }
            ],
            explain: '外键是「子表向父表的引用完整性」：子表的值必须能在父表找到，或为 NULL（若允许）。' +
              '反方向（每个学生都要选课）属于参与约束，靠 NOT NULL 与业务逻辑，SQL 外键表达不了。' }
        ] },

      /* ---------------------------------------------------------- Q2 */
      { no: 2, points: 8, type: 'true / false',
        intro: '本题考察 ER 建模与关系模式转换。',
        parts: [
          { label: '(a)', points: 4, kind: 'tf',
            prompt: '两个实体之间的一对多联系，转换成关系模式时必须新建一张表。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '一对多只需把「一」端的主键作为外键放进「多」端的表。独立建表不但多余，还要多一次连接，' +
              '并且无法阻止同一条联系被重复插入。' },
          { label: '(b)', points: 4, kind: 'tf',
            prompt: '三元联系拆成三个二元联系后，与原三元联系在语义上完全等价。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '三元联系约束的是「三方同时出现」，拆开后会允许只出现两方的组合，连接回来可能造出原表里不存在的三元组。' +
              '只有当业务本来就允许两两成立时才能拆。' }
        ] },

      /* ---------------------------------------------------------- Q3 */
      { no: 3, points: 8, type: 'fill in',
        intro: '本题考察关系代数。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '要查询「没有选修任何课程的学生」，用关系代数写作 π<sub>sid</sub>(student) − ______。',
            accept: ['π_sid(enroll)', 'π sid (enroll)', '投影 sid 的 enroll', 'πsid(enroll)'],
            explain: '全体学生减去「选过课的学生」即为空集那部分。这就是差运算表达否定；' +
              'SQL 里对应的写法是 NOT EXISTS 或 LEFT JOIN ... IS NULL。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '若 R(A,B) 有 100 行、S(B,C) 有 200 行，B 在两张表里都是候选键，则自然连接 R ⋈ S 的行数最多为 ______ 行。',
            answer: '100',
            accept: ['100', '100 行'],
            explain: 'S 的 B 是候选键，每个 B 值最多匹配一行，因此 R 的 100 行每行最多贡献 1 行结果，上限 100。' +
              '若 B 在 S 中不唯一，结果才可能膨胀。' }
        ] },

      /* ---------------------------------------------------------- Q4 */
      { no: 4, points: 8, type: 'write result',
        intro: '本题考察聚合、分组与空值。表结构如下：' +
          'student(sid, name, dept)；enroll(sid, cid, grade)，grade 可为 NULL。',
        parts: [
          { label: '(a)', points: 4, kind: 'output',
            prompt: '执行下面这条语句，返回几行？<br><code>SELECT dept, COUNT(*) FROM student GROUP BY dept;</code>' +
              '若 student 有 10 行、其中 2 行的 dept 为 NULL、其余分属 2 个系。',
            answer: '3 行',
            accept: ['3', '3 行', '三行'],
            explain: 'GROUP BY 把 NULL 当成一个独立的组（与 SQL 中 NULL = NULL 为 UNKNOWN 不同），' +
              '所以结果有 2 个系 + 1 个 NULL 组 = 3 行。要排除 NULL 组必须写 WHERE dept IS NOT NULL。' },
          { label: '(b)', points: 4, kind: 'output',
            prompt: '对 10 名学生（其中 3 人未选任何课）执行：<br>' +
              '<code>SELECT COUNT(*) AS a, COUNT(e.sid) AS b</code><br>' +
              '<code>FROM student s LEFT JOIN enroll e ON s.sid = e.sid;</code><br>' +
              '若 enroll 共 17 行，且没有学生重复选同一门课，a 与 b 的差是多少？',
            answer: '3',
            accept: ['3', '差 3', '相差 3'],
            explain: '左连接后总行数 = 17 + 3（未选课学生各补一行 NULL）= 20，所以 a = 20；' +
              'COUNT(e.sid) 不数 NULL，只数 17 行，b = 17，差为 3，正好等于没选课的人数。' }
        ] },

      /* ---------------------------------------------------------- Q5 */
      { no: 5, points: 8, type: 'single choice',
        intro: '本题考察 SQL 查询的执行顺序与子查询。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '查询「平均分高于 80 的课程」，下面哪个写法正确？',
            options: [
              { text: '<code>SELECT cid FROM enroll WHERE AVG(grade) &gt; 80 GROUP BY cid;</code>' },
              { text: '<code>SELECT cid FROM enroll GROUP BY cid HAVING AVG(grade) &gt; 80;</code>', correct: true },
              { text: '<code>SELECT cid, AVG(grade) FROM enroll WHERE AVG(grade) &gt; 80;</code>' },
              { text: '<code>SELECT cid FROM enroll GROUP BY AVG(grade) &gt; 80;</code>' }
            ],
            explain: 'WHERE 在分组之前执行，那时还没有 AVG 可算，直接报错。聚合条件必须写在 HAVING，它在 GROUP BY 之后、' +
              'SELECT 之前执行。第三、四项则连语法都不成立。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '关于相关子查询（correlated subquery），正确的说法是：',
            options: [
              { text: '它对外层每一行各求值一次，因此内层通常应能走索引', correct: true },
              { text: '它一定只执行一次，与外层行数无关' },
              { text: '它不能引用外层的列' },
              { text: '它只能出现在 SELECT 列表中，不能出现在 WHERE 中' }
            ],
            explain: '相关子查询引用了外层的列，所以逻辑上是每行一次（优化器可能改成半连接）。' +
              '内层若没有合适索引，就会退化成「外层行数 × 内层全表扫描」，这是慢查询最常见的成因之一。' }
        ] },

      /* ---------------------------------------------------------- Q6 */
      { no: 6, points: 8, type: 'short answer',
        intro: '本题考察视图与约束。',
        parts: [
          { label: '(a)', points: 4, kind: 'keywords',
            prompt: '说明为什么「连接了两张表的视图」通常不可更新，并给出一个可更新的替代做法。',
            keywords: ['无法映射回单张基表', '一对多', '不确定改哪一行', '插入歧义', '改用基表', 'INSTEAD OF 触发器'],
            explain: '多表视图的一行可能来自多张基表的组合，UPDATE 时数据库无法确定该写回哪张表；' +
              'INSERT 更糟，缺的列不知道该填什么。替代做法是直接写基表，或用 INSTEAD OF 触发器显式定义写入语义。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '外键的 <code>ON DELETE CASCADE</code> 与 <code>ON DELETE SET NULL</code> 有什么区别？各适合什么场景？',
            keywords: ['级联删除', '置空', '子行失去归属', '弱实体', '从属明细', '误删风险'],
            explain: 'CASCADE 删除父行时连带删除所有子行，适合「子行离开父行就没有意义」的弱实体，如订单明细；' +
              'SET NULL 保留子行但断开引用，适合「可选归属」，如员工离职后其经手的客户记录仍要保留。' +
              'CASCADE 的风险是一条 DELETE 连锁删掉大量数据，执行前务必先 SELECT 确认范围。' }
        ] },

      /* ---------------------------------------------------------- Q7 */
      { no: 7, points: 8, type: 'short answer',
        intro: '本题考察函数依赖与范式。已知关系 R(A, B, C, D) 与函数依赖集：' +
          'A → B，B → C，{A, D} → C。',
        parts: [
          { label: '(a)', points: 4, kind: 'keywords',
            prompt: '求 A 的属性闭包 A⁺，并说明 A 是不是候选键。',
            keywords: ['A+ = ABC', '不含 D', '不是超键', '不是候选键', 'AD 才是'],
            explain: '由 A → B 得 B，再由 B → C 得 C，所以 A⁺ = {A, B, C}，不含 D。' +
              'A 不能决定全表，所以不是超键、更不是候选键；{A, D} 的闭包才是 ABCD，{A, D} 是唯一的候选键。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: 'R 满足第几范式？说明理由，并给出一个无损且保持依赖的分解。',
            keywords: ['1NF', '2NF', 'A → B 部分依赖', '非主属性 B 依赖候选键的一部分', '分解为 AB 与 BC', 'AD 留原表'],
            explain: '候选键是 {A, D}，B、C 是非主属性，而 A → B 只依赖候选键的一部分，属于部分函数依赖，' +
              '所以 R 只满足 1NF。分解为 R1(A, B)、R2(B, C)、R3(A, D, C) 可消除部分依赖并保持依赖；' +
              '再检查 R3 中 A → C 是传递依赖，可进一步拆成 R3(A, D) 与 R4(A, C) 达到 3NF。' }
        ] },

      /* ---------------------------------------------------------- Q8 */
      { no: 8, points: 8, type: 'mixed',
        intro: '本题考察 B+ 树索引。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '一张 200 万行的表，在 <code>age</code> 列上建了 B+ 树索引，执行 ' +
              '<code>SELECT * FROM t WHERE age &gt; 20</code>（命中 95% 的行），优化器多半会：',
            options: [
              { text: '放弃索引，走全表扫描', correct: true },
              { text: '走索引并逐行回表' },
              { text: '走索引并且不回表' },
              { text: '直接报错，范围查询不能用索引' }
            ],
            explain: '命中率很高时，走二级索引要对几乎每一行做一次随机回表，代价远高于顺序扫全表。' +
              '优化器会按选择率估算并选全表扫描；要让索引有用，应选选择性高（命中率低）的条件。' },
          { label: '(b)', points: 4, kind: 'tf',
            prompt: '在联合索引 (dept, age, name) 上，<code>WHERE dept = &#39;CS&#39; AND name = &#39;Li&#39;</code> 能用上该索引的全部列。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '联合索引只对从左起连续的前缀有效。本条只用到 dept 这一列定位，name 无法在索引里继续收窄，' +
              '只能回表后再过滤（MySQL 可能用索引条件下推缓解，但仍不是全列定位）。' }
        ] },

      /* ---------------------------------------------------------- Q9 */
      { no: 9, points: 8, type: 'fill in',
        intro: '本题考察存储、执行计划与连接算法。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: 'MySQL 中查看一条查询的执行计划，使用 ______ 关键字（写命令名即可）。',
            answer: 'EXPLAIN',
            accept: ['EXPLAIN', 'explain', 'EXPLAIN ANALYZE', 'EXPLAIN FORMAT=JSON'],
            explain: 'EXPLAIN 给出访问类型、可用与最终选择的索引、估算行数；EXPLAIN ANALYZE 额外给出实际耗时与真实行数，' +
              '两者对照就能发现「估算 100 行、实际 100 万行」这类统计信息过期问题。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '2 万行的 student 与 200 万行的 enroll 做等值连接、且要输出 enroll 的大部分行，' +
              '通常最优的连接算法是 ______ 连接。',
            answer: '哈希',
            accept: ['哈希', 'hash', 'hash join', '哈希连接'],
            explain: '小表建哈希表（2 万条，可放内存），大表顺序扫一遍探测，总代价 O(N + M) 且以顺序 IO 为主。' +
              '嵌套循环在这里要对 200 万行逐行回表，随机 IO 会慢一个数量级以上。' }
        ] },

      /* ---------------------------------------------------------- Q10 */
      { no: 10, points: 8, type: 'write result',
        intro: '本题考察事务调度与可串行化。三个事务的调度如下（R 读、W 写，下标为数据项）：' +
          'T1: R(A) … W(A)；T2: R(A) … W(A)；T3: R(B) … W(B)，且 T1 与 T2 的写都发生在对方的读之后。',
        parts: [
          { label: '(a)', points: 4, kind: 'output',
            prompt: 'T1 与 T2 都先读 A 再写 A，这种调度会产生哪一类并发异常？写出名称。',
            answer: '丢失更新',
            accept: ['丢失更新', 'lost update', '更新丢失'],
            explain: '两个事务基于同一个旧值计算新值，后提交者覆盖先提交者，先者的修改凭空消失。' +
              'REPEATABLE READ 并不阻止它，必须用 SELECT ... FOR UPDATE 或版本号做乐观并发控制。' },
          { label: '(b)', points: 4, kind: 'output',
            prompt: '若在优先图上画出该调度，T1 与 T2 之间会出现什么结构？这说明该调度是否冲突可串行化？',
            answer: '双向边（环）',
            accept: ['环', '双向边', '循环', '有环', '不可串行化'],
            explain: 'T1 读 A 后 T2 写 A，产生 T1 → T2；T2 读 A 后 T1 写 A，产生 T2 → T1，两边成环。' +
              '优先图有环 ⇔ 调度不是冲突可串行化的，必须回滚其中一个事务。' }
        ] },

      /* ---------------------------------------------------------- Q11 */
      { no: 11, points: 10, type: 'design',
        intro: '综合设计题：为一个「课程论坛」设计 schema。需求：一个学生可发多个帖子；' +
          '一个帖子属于一个板块；帖子可被多个学生点赞，点赞要记录时间；学生有学号、姓名、所属书院。',
        parts: [
          { label: '(a)', points: 5, kind: 'keywords',
            prompt: '写出四张表的名字与主键，并说明「点赞」为什么必须独立成表。',
            keywords: ['student(sid)', 'board(bid)', 'post(pid)', 'like(sid, pid)', '多对多', '组合主键', '点赞时间'],
            explain: 'student(sid)、board(bid)、post(pid)、post_like(sid, pid, ts)。点赞是学生与帖子的多对多联系，' +
              '且带自己的属性（时间），必须独立成表，主键取两端主键的组合；若塞进 post 的一个字段就无法记录是谁点的。' },
          { label: '(b)', points: 5, kind: 'keywords',
            prompt: '写出 post 表的外键与两条必要的 CHECK / NOT NULL 约束，并说明它们各自防住什么错误。',
            keywords: ['FOREIGN KEY', 'REFERENCES board', 'ON DELETE CASCADE', 'NOT NULL', 'title 非空', '外键指向不存在的板块'],
            explain: 'post.bid 外键引用 board(bid) 并加 ON DELETE CASCADE（板块删了帖子也没有意义）；' +
              'title 与 sid 声明 NOT NULL，防止出现无主帖；再加 CHECK (length(title) > 0) 拦住空标题。' +
              '这些约束把「应用忘了校验」变成「数据库直接拒绝」。' }
        ] },

      /* ---------------------------------------------------------- Q12 */
      { no: 12, points: 10, type: 'design',
        intro: '综合题：把上面的论坛系统放到一台单机 MySQL 上，讨论可靠性与性能。',
        parts: [
          { label: '(a)', points: 5, kind: 'keywords',
            prompt: '说明「发帖」这个事务应该包含哪些语句，以及为什么它必须是一个事务。',
            keywords: ['INSERT post', 'UPDATE board 计数', '同生共死', '原子性', '半成品', '回滚'],
            explain: '事务包含 INSERT INTO post 与 UPDATE board SET post_cnt = post_cnt + 1。两者必须同生共死：' +
              '若只成功一半，计数与实际帖子数就永久不一致，之后所有统计都错。原子性保证要么都生效要么都回滚。' },
          { label: '(b)', points: 5, kind: 'keywords',
            prompt: '论坛首页要按「最新回复时间」倒序分页，说明该建什么索引，以及深分页为什么会慢、怎么缓解。',
            keywords: ['(board_id, last_reply_at)', '联合索引', '覆盖索引', 'LIMIT OFFSET 扫描', '游标分页', 'WHERE last_reply_at < ?'],
            explain: '建 (board_id, last_reply_at DESC) 的联合索引，让过滤与排序都走索引。' +
              'LIMIT 100000, 20 仍要扫过前 10 万条索引项再丢弃；缓解办法是游标分页（记住上一页最后的时间戳，' +
              '用 WHERE last_reply_at < ? 直接定位），把 O(offset) 变成 O(1)。' }
        ] }
    ]
  });
})();
