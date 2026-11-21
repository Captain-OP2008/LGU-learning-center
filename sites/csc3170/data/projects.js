/* =====================================================================
 * projects.js · CSC3170 实战项目
 * 结构：{ id, title, en, tagline, level, minutes, chapters, goals, intro,
 *         milestones:[{ n, title, tasks, starter, hints, solution }] }
 * 三个项目由易到难，全部可在 MySQL 8 上跑通，不依赖任何外部数据。
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerProjects([

    /* ================================================================ P1 */
    {
      id: 'P1',
      title: '选课系统：从 ER 图到十条查询',
      en: 'COURSE ENROLLMENT SCHEMA',
      tagline: '把一份需求写成 ER 图、建表语句与十条真实查询——把第 1–3 章串成一条完整流水线。',
      level: '入门',
      minutes: 180,
      chapters: ['ch01', 'ch02', 'ch03'],
      goals: [
        '能把一段自然语言需求拆成实体、联系与基数比，并画出规范的 ER 图',
        '能按转换规则写出带主键、外键与 NOT NULL 的建表语句，并用 INSERT 灌入测试数据',
        '能写出覆盖连接、聚合、子查询与 NULL 处理的十条查询，且结果正确'
      ],
      intro: '这个项目的价值不在 SQL 写得多花哨，而在「每一步都能追溯」：为什么这个联系是 M:N、' +
        '为什么这张表要有组合主键、为什么这条查询必须用左外连接。做完之后你会拿到一张可以反复用的' +
        '小 schema，后面两个项目都会在它上面加索引、加事务。请务必手工敲一遍建表语句，不要复制粘贴——' +
        '外键报错的位置恰恰是最值得理解的地方。',
      milestones: [
        {
          n: 1,
          title: '需求 → ER 图 → 建表语句',
          tasks: [
            '读需求：学生（学号、姓名、入学年份）属于一个系；一个系有多名教师，一名教师只属于一个系；' +
              '教师开设课程（课程号、课名、学分），一门课程可由多名教师在不同学期开设；学生选课要记录学期与成绩。',
            '在纸上画出 ER 图，标出每个联系的基数比与参与约束，至少找出一个弱实体或标识依赖。',
            '按五条转换规则写出 6 张表：dept、student、teacher、course、section、enroll。' +
              'section 表示「某教师在某学期开某门课」，主键自定并说明理由。',
            '为每个外键选择 ON DELETE 动作，并写一行注释说明为什么这样选。',
            '执行建表语句，确认没有任何外键报错；把 DDL 存成 schema.sql。'
          ],
          starter: `CREATE TABLE dept (
  dept_id   CHAR(4)     PRIMARY KEY,
  dept_name VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE student (
  sid      CHAR(9)  PRIMARY KEY,
  name     VARCHAR(40) NOT NULL,
  enr_year SMALLINT NOT NULL,
  dept_id  CHAR(4)  NOT NULL,
  FOREIGN KEY (dept_id) REFERENCES dept(dept_id)
    ON DELETE RESTRICT
);

CREATE TABLE section (
  sec_id    INT AUTO_INCREMENT PRIMARY KEY,
  course_id CHAR(8) NOT NULL,
  teacher_id CHAR(9) NOT NULL,
  term      CHAR(6) NOT NULL,          -- 例：2026FA
  UNIQUE KEY uk_sec (course_id, teacher_id, term)
);`,
          hints: [
            'section 的候选键是 (course_id, teacher_id, term) 的组合而不是「课程号」单列；用自增代理键更省事，但要保留唯一约束。',
            'enroll 的主键是 (sid, sec_id) 还是 (sid, sec_id, term)？想清楚「同一学期能否重复选同一门课」再定。',
            '外键默认允许 NULL，若需求说「必须有」，别忘了 NOT NULL。'
          ],
          solution: '完整答案见本章 ch01 的走查与 ch03 的建表示例：dept → student/teacher 一对多靠外键，' +
            'student 与 section 的多对多由 enroll 承载，enroll 主键取 (sid, sec_id) 并在 grade 上允许 NULL 表示未出分。'
        },
        {
          n: 2,
          title: '灌数据与十条查询',
          tasks: [
            '用 INSERT 造数据：4 个系、20 名学生、6 名教师、10 门课、15 个 section、约 60 条选课记录，' +
              '其中至少 5 名学生没有任何选课记录，至少 3 条 grade 为 NULL。',
            '写查询 1–3：列出每个系的學生人数；列出每门课的平均分（无成绩的课显示 NULL）；列出平均分高于 80 的课程。',
            '写查询 4–6：列出没有选任何课的学生；列出选了「数据库系统」但没选「操作系统」的学生；列出每名学生最差的一门课。',
            '写查询 7–10：用窗口函数给每个 section 的学生按成绩排名；用 CTE 算出各系平均分再与全校平均比较；' +
              '统计每个教师开设的 section 数（含 0）；找出选课人数超过 10 人的课程。',
            '把十条查询存成 queries.sql，每条上面写一行注释说明它考的是哪个知识点。'
          ],
          starter: `-- 查询 4：没选任何课的学生
SELECT s.sid, s.name
FROM student s
WHERE NOT EXISTS (
  SELECT 1 FROM enroll e WHERE e.sid = s.sid
);

-- 查询 7：每个 section 内按成绩排名
SELECT sec_id, sid, grade,
       RANK() OVER (PARTITION BY sec_id ORDER BY grade DESC) AS rk
FROM enroll
WHERE grade IS NOT NULL;`,
          hints: [
            '「没有选课」优先用 NOT EXISTS，而不是 NOT IN——后者在子查询含 NULL 时会返回空集。',
            '「平均分」对没有成绩的 section 会返回 NULL，这是正确的；要显示 0 得用 COALESCE(AVG(grade), 0)。',
            '「每名学生最差的一门课」用 ROW_NUMBER() OVER (PARTITION BY sid ORDER BY grade ASC) 再筛 rn = 1。'
          ],
          solution: '十条查询覆盖：COUNT/GROUP BY、AVG 与 NULL、HAVING、NOT EXISTS、双重 NOT EXISTS、' +
            '窗口函数、CTE、左外连接计数、COUNT(DISTINCT)、以及 HAVING COUNT(*) > 10。逐条对照 ch03 的五个 NULL 陷阱自查。'
        },
        {
          n: 3,
          title: '自检与交付',
          tasks: [
            '对每条查询，手工算出它在测试数据上的期望结果，再与数据库输出比对；不一致时先怀疑自己的期望。',
            '故意做三次破坏：删掉一个被引用的系、插入重复主键、把 grade 插成 200 分，记录每种的报错信息。',
            '把 schema.sql + seed.sql + queries.sql 整理进一个目录，写一份 200 字的 README 说明表之间的关系。',
            '回答三个问题：哪张表的行数增长最快？哪个外键最可能引起误删？如果要支持「一稿多投」需要改哪张表？'
          ],
          starter: `-- 破坏性实验：观察外键与 CHECK 的报错
DELETE FROM dept WHERE dept_id = 'CS';      -- 有学生引用，应被拒绝
INSERT INTO student(sid, name, enr_year, dept_id) VALUES ('S001', 'Li', 2024, 'CS');
UPDATE enroll SET grade = 200 WHERE grade IS NOT NULL LIMIT 1;  -- CHECK 应拦住`,
          hints: [
            '报错信息里会直接给出约束名与外键名，读它比猜快得多。',
            '如果 DELETE 没有被拒绝，说明外键写成了 CASCADE，回头检查你的设计意图。',
            'READEME 里那句「哪个外键最可能误删」的答案通常是 enroll → section 的级联。'
          ],
          solution: '交付物是一个可重复执行的 SQL 工程：任何人 clone 后按 README 的三条命令即可重建库并复现全部结果。' +
            '这一步训练的是「数据库也是代码」的工程习惯。'
        }
      ]
    },

    /* ================================================================ P2 */
    {
      id: 'P2',
      title: '索引调优实验：把 400 亿行变成 8 万行',
      en: 'INDEX TUNING LAB',
      tagline: '造一百万行数据，用 EXPLAIN 找出慢查询，靠索引与改写把它压到毫秒级。',
      level: '中级',
      minutes: 240,
      chapters: ['ch06', 'ch03'],
      goals: [
        '能读懂 EXPLAIN 的 type、key、rows、Extra 四列，并据此判断瓶颈在扫描还是回表',
        '能为给定查询设计联合索引，并解释最左前缀与覆盖索引为什么生效',
        '能用数据量化的方式证明优化有效，而不是凭感觉「加了索引就快了」'
      ],
      intro: '很多人学完索引只会一句「给 WHERE 的列加索引」，一遇到联合索引、范围查询、' +
        '函数包裹的列就失效。这个项目用可控的数据量与可重复的计时，把每一条规则变成一次实验：' +
        '先测基线，再看执行计划，再改索引，再测。做完你会对「索引不是越多越好」有肌肉记忆。',
      milestones: [
        {
          n: 1,
          title: '造数据与测基线',
          tasks: [
            '建一张 orders 表：id、user_id、status、amount、created_at、remark，共约 100 万行。' +
              '用递归 CTE 或存储过程批量插入，插入时关闭自动提交以提速。',
            '写 5 条典型查询：按 user_id 查、按 status 查、按 created_at 范围查、按 (user_id, status) 查、按备注模糊查。',
            '对每条查询执行 EXPLAIN，记录 type（ALL / index / range / ref / eq_ref）与 rows 估算值。',
            '用一张表记录基线耗时：查询编号、EXPLAIN 关键列、三次运行的中位数耗时（毫秒）。',
            '回答：哪条查询是全表扫描？哪条查询的 rows 估算与实际差得最远？'
          ],
          starter: `-- 批量造数：100 万行
INSERT INTO orders (user_id, status, amount, created_at, remark)
WITH RECURSIVE seq AS (
  SELECT 1 AS n
  UNION ALL SELECT n + 1 FROM seq WHERE n < 1000000
)
SELECT 1 + (n % 50000),
       ELT(1 + (n % 4), 'paid', 'shipped', 'cancelled', 'refunded'),
       ROUND(1 + (n % 10000) / 100, 2),
       TIMESTAMPADD(MINUTE, n, '2025-01-01 00:00:00'),
       CONCAT('remark-', n % 1000)
FROM seq;

EXPLAIN SELECT * FROM orders WHERE user_id = 12345;`,
          hints: [
            'MySQL 的 cte_max_recursion_depth 默认 1000，先 SET SESSION cte_max_recursion_depth = 1000001。',
            '造完数据记得 ANALYZE TABLE orders，否则优化器还在按 0 行估算。',
            '计时用 SELECT BENCHMARK 不可靠，直接跑三次取中位数，并先执行 SELECT SQL_NO_CACHE 排除缓存干扰。'
          ],
          solution: '基线通常是：user_id 与 created_at 查询走 range（若已建索引）或 ALL；status 只有 4 个不同值，' +
            '选择性极差，走索引几乎必然比全表扫慢；LIKE 前导通配符无法用索引。'
        },
        {
          n: 2,
          title: '设计索引并验证',
          tasks: [
            '为按 user_id 的查询建单列索引，重测；为 (user_id, status) 建联合索引，验证它也能服务只查 user_id 的查询。',
            '把 <code>WHERE YEAR(created_at) = 2025</code> 改写成范围条件，对比改写前后的 type 与耗时。',
            '为「只查 user_id 与 amount」的查询设计覆盖索引，确认 Extra 出现 Using index。',
            '故意建一个 (status, user_id) 的联合索引，验证 status 选择性低时它是否被选中，并解释原因。',
            '把每条查询优化后的耗时与基线并排列成表，算出加速倍数。'
          ],
          starter: `-- 覆盖索引：查询只碰索引，不回表
CREATE INDEX idx_user_amount ON orders (user_id, amount);
EXPLAIN SELECT user_id, SUM(amount)
FROM orders WHERE user_id BETWEEN 1000 AND 2000
GROUP BY user_id;

-- 函数包裹导致失效 → 改写为范围
EXPLAIN SELECT * FROM orders WHERE YEAR(created_at) = 2025;     -- type=ALL
EXPLAIN SELECT * FROM orders
WHERE created_at &gt;= '2025-01-01' AND created_at &lt; '2026-01-01';  -- type=range`,
          hints: [
            '联合索引 (user_id, status) 对只带 user_id 的查询仍有效，因为 user_id 是最左前缀；反过来不行。',
            'Extra 里的 Using index 才是覆盖索引；Using index condition 只是索引条件下推，仍要回表。',
            '选择性 = 不同值个数 / 总行数。status 只有 4 个值，选择性 4/1000000，几乎为 0。'
          ],
          solution: '典型结果是 50–200 倍加速：全表扫 100 万行约 200–400ms，走覆盖索引降到 1–5ms。' +
            '关键不是数字，而是能指着 EXPLAIN 说出「从 ALL 变成 range、从 100 万行估算变成 1200 行」。'
        },
        {
          n: 3,
          title: '结论与反例',
          tasks: [
            '构造一个「加了索引反而变慢」的查询（提示：命中率 95% 的范围查询 + 回表）。',
            '统计 orders 表上所有索引占用的磁盘空间，回答：索引维护成本体现在哪里？',
            '用一条批量 INSERT 分别在有 5 个索引和无索引的表上跑，比较耗时。',
            '写 300 字结论：什么情况下不该建索引？给出三条可操作的判断标准。'
          ],
          starter: `-- 索引反而更慢：命中 95% 的行却要逐行回表
EXPLAIN SELECT * FROM orders WHERE amount &gt; 1;
-- 期望：优化器选 ALL，而不是走 idx_user_amount

-- 索引的代价：写放大
SHOW INDEX FROM orders;`,
          hints: [
            '要让优化器真的放弃索引，需要让选择率估算变高，可以用 FORCE INDEX 对比「强制走索引」的耗时。',
            '每个二级索引都要在 INSERT/UPDATE/DELETE 时同步维护，还要占缓冲池——索引不是免费的。',
            '三条标准可以是：选择性低于 10% 不建、写多读少的表谨慎建、能用覆盖索引才建宽索引。'
          ],
          solution: '结论应包含：索引服务于「选择性高的过滤 + 排序 + 覆盖」，写密集场景要控制索引数量，' +
            '模糊匹配与函数包裹无法用 B+ 树，应改写或上全文索引。'
        }
      ]
    },

    /* ================================================================ P3 */
    {
      id: 'P3',
      title: '并发与恢复：亲手复现四类异常',
      en: 'CONCURRENCY & RECOVERY LAB',
      tagline: '用两个 mysql 会话复现脏读、不可重复读、幻读与丢失更新，再用锁与隔离级别逐个修掉。',
      level: '高级',
      minutes: 300,
      chapters: ['ch07', 'ch04'],
      goals: [
        '能在两个并发会话中稳定复现四类并发异常，并解释每一类违反了哪条隔离性要求',
        '能说清 2PL 与 MVCC 各自防住了什么、没防住什么，知道丢失更新为什么需要显式加锁',
        '能用 WAL 与检查点解释崩溃恢复流程，并通过关闭/强制杀进程验证持久性'
      ],
      intro: '事务这一章最容易「看懂但不会」。看懂是因为概念只有四个，不会是因为没有亲眼见过。' +
        '这个项目要求你真的开两个终端、按顺序敲语句、观察输出差异——尤其是「同一事务两次读结果不同」' +
        '这种在单会话里永远看不到的现象。最后一段会用一个故意杀进程的实验验证 WAL 的作用。',
      milestones: [
        {
          n: 1,
          title: '复现四类异常',
          tasks: [
            '建一张 account(id, balance) 表，插入两个账户各 1000 元。开两个会话 A、B。',
            '复现脏读：A 开启事务并 UPDATE 但不提交，B 在 READ UNCOMMITTED 下读到未提交值；记录 B 看到的余额。',
            '复现不可重复读：B 在 READ COMMITTED 下先读一次，A 提交修改，B 再读一次，两次结果不同。',
            '复现幻读：B 在 REPEATABLE READ 下执行范围查询两次，中间 A 插入新行，观察第二次结果。',
            '复现丢失更新：两个会话都先 SELECT 余额再 UPDATE 为「读到的值 + 100」，最终余额只加了 100。'
          ],
          starter: `-- 建立实验环境
CREATE TABLE account (
  id      INT PRIMARY KEY,
  balance DECIMAL(10,2) NOT NULL CHECK (balance &gt;= 0)
);
INSERT INTO account VALUES (1, 1000.00), (2, 1000.00);

-- 会话 A
SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
BEGIN;
UPDATE account SET balance = 500 WHERE id = 1;
-- 先不提交，切到会话 B

-- 会话 B
SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT balance FROM account WHERE id = 1;   -- 可能读到 500`,
          hints: [
            '每个会话都要单独 SET SESSION，全局变量改了会影响另一个会话，实验就不干净了。',
            'MySQL 默认 REPEATABLE READ，复现脏读必须显式降到 READ UNCOMMITTED。',
            '两张表要分别测试，否则一个会话的锁会阻塞另一个，看不出异常。'
          ],
          solution: '四类异常的判定标准：脏读=读到未提交；不可重复读=同一行两次读不同；幻读=同一范围两次读行数不同；' +
            '丢失更新=两个「读—改—写」互相覆盖。每条都要截图或记录具体数值。'
        },
        {
          n: 2,
          title: '用隔离级别与锁修复',
          tasks: [
            '把隔离级别依次改成 READ COMMITTED、REPEATABLE READ、SERIALIZABLE，重跑第一步的实验，记录哪些异常消失。',
            '在 REPEATABLE READ 下用 <code>SELECT ... FOR UPDATE</code> 重写「读—改—写」，验证丢失更新被消除。',
            '观察锁等待：A 持有行锁时 B 执行 UPDATE，用 <code>SHOW ENGINE INNODB STATUS</code> 找到等待信息。',
            '构造一个死锁：A 锁 id=1 再请求 id=2，B 反向操作，记录 MySQL 的报错与自动回滚的事务。',
            '整理一张表：隔离级别 × 四类异常，标出「能防 / 不能防」。'
          ],
          starter: `-- 悲观锁消除丢失更新
BEGIN;
SELECT balance FROM account WHERE id = 1 FOR UPDATE;   -- 持锁
UPDATE account SET balance = balance + 100 WHERE id = 1;
COMMIT;

-- 死锁构造
-- 会话 A: BEGIN; UPDATE account SET balance=balance+1 WHERE id=1;
-- 会话 B: BEGIN; UPDATE account SET balance=balance+1 WHERE id=2;
-- 会话 A: UPDATE account SET balance=balance+1 WHERE id=2;   -- 等待 B
-- 会话 B: UPDATE account SET balance=balance+1 WHERE id=1;   -- 死锁，一方被回滚`,
          hints: [
            'FOR UPDATE 必须在事务内才有意义，autocommit=1 时语句结束锁就释放了。',
            '死锁报错是 ERROR 1213，MySQL 会回滚「代价较小」的那个事务，重试即可。',
            'SERIALIZABLE 通过给读加共享锁来防幻读，代价是并发度骤降，生产环境极少用。'
          ],
          solution: '结论矩阵：READ UNCOMMITTED 一个都不防；READ COMMITTED 防脏读；REPEATABLE READ 防脏读与不可重复读（MySQL 用间隙锁还防了大部分幻读）；' +
            'SERIALIZABLE 全防但吞吐最低。丢失更新在任何隔离级别下都要靠 FOR UPDATE 或版本号解决。'
        },
        {
          n: 3,
          title: '崩溃恢复与持久性',
          tasks: [
            '查看 <code>innodb_flush_log_at_trx_commit</code> 的当前值，说明 0/1/2 三档在「提交后断电」时各丢多少数据。',
            '开启事务、更新若干行、提交；然后 <code>KILL -9</code> mysqld 进程，重启后检查数据是否还在。',
            '故意在提交前杀进程，重启后确认未提交的修改被 undo 回滚。',
            '找到错误日志中的恢复信息（redo 应用条数、undo 回滚条数），解释它们在做什么。',
            '写 200 字总结：WAL 为什么能让「提交只刷日志」也算持久。'
          ],
          starter: `-- 观察持久性相关参数
SHOW VARIABLES LIKE 'innodb_flush_log_at_trx_commit';
SHOW VARIABLES LIKE 'innodb_flush_method';

-- 提交后强杀进程，重启验证
BEGIN;
UPDATE account SET balance = balance + 1 WHERE id = 1;
COMMIT;
-- 然后在系统层面 kill -9 mysqld，再启动`,
          hints: [
            'innodb_flush_log_at_trx_commit=1 才是「每次提交都 fsync 日志」，等于 2 只写 OS 缓存，断电可能丢。',
            '不要在生产库上做杀进程实验；用容器或本地实例，实验前先备份。',
            '重启日志里会有「Starting crash recovery」与「Applying batch of log records」，这就是 redo 重放。'
          ],
          solution: '提交过的事务一定能恢复（redo 重放），未提交的会被 undo 回滚，二者共同保证原子性与持久性。' +
            'WAL 的关键是「日志顺序写 + 提交点只等日志落盘」，把随机写推迟到检查点批量完成。'
        }
      ]
    }
  ]);
})();
