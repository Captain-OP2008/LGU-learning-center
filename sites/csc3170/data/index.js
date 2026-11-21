/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * 说明：title 必须与 data/chXX.js 里的 title 逐字一致。
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：数据库在解决什么问题', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先摊开整门课的地图：数据库比文件系统多做了什么、七章怎么衔接、三层抽象与选课系统这条主线怎么用。' },
  { id: 'ch01', num: '01', title: '概念建模：ER 图与关系模式转换', en: 'ER MODELING & RELATIONAL MAPPING', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'box', labs: 1,
    blurb: '从需求出发画 ER 图：实体、属性、基数比、弱实体，再按五条规则转成带主键与外键的关系模式。' },
  { id: 'ch02', num: '02', title: '关系模型与关系代数：查询的形式基础', en: 'RELATIONAL MODEL & ALGEBRA', part: 'Part II · 基础', week: 4, minutes: 90, icon: 'function', labs: 1,
    blurb: '把表看成元组的集合，用 σ、π、⋈、÷ 写出查询，再用等价变换解释优化器为什么能重排你的 SQL。' },
  { id: 'ch03', num: '03', title: 'SQL 查询：连接、聚合与子查询', en: 'SQL QUERIES: JOINS, AGGREGATION & SUBQUERIES', part: 'Part II · 基础', week: 5, minutes: 100, icon: 'code', labs: 2,
    blurb: '按逻辑执行顺序理解 SELECT：内外连接、GROUP BY 与 HAVING、相关子查询、NULL 的五个陷阱与窗口函数。' },
  { id: 'ch04', num: '04', title: '高级 SQL：视图、约束、触发器与编程', en: 'ADVANCED SQL: VIEWS, CONSTRAINTS, TRIGGERS & PROGRAMMING', part: 'Part III · 深入', week: 7, minutes: 110, icon: 'layers', labs: 1,
    blurb: '用视图做权限边界、用约束代替应用补丁、用触发器与存储过程封装逻辑，并守住 SQL 注入这条红线。' },
  { id: 'ch05', num: '05', title: '函数依赖与范式', en: 'FUNCTIONAL DEPENDENCIES & NORMAL FORMS', part: 'Part III · 深入', week: 9, minutes: 100, icon: 'grid', labs: 1,
    blurb: '从三类异常出发，用 Armstrong 公理、属性闭包与最小覆盖判定候选键，再一路推到 BCNF、3NF 与无损连接。' },
  { id: 'ch06', num: '06', title: '存储、索引与查询优化', en: 'STORAGE, INDEXING & QUERY OPTIMIZATION', part: 'Part IV · 综合', week: 11, minutes: 110, icon: 'cpu', labs: 2,
    blurb: '把性能还原成页读：堆文件与聚簇、B+ 树的扇出、联合索引与覆盖索引、三种连接算法与执行计划怎么读。' },
  { id: 'ch07', num: '07', title: '事务、并发控制与恢复', en: 'TRANSACTIONS, CONCURRENCY & RECOVERY', part: 'Part IV · 综合', week: 13, minutes: 120, icon: 'zap', labs: 1,
    blurb: 'ACID 到四类并发异常、隔离级别与 MVCC、2PL 与优先图、死锁处理，最后用 WAL 与检查点收尾崩溃恢复。' }
]);
