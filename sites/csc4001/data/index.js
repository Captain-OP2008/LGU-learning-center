/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * 说明：title / en 必须与 data/chXX.js 里的 registerChapter 逐字一致。
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：编译器怎样读懂程序', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先摊开整门课的地图：编译器前端做什么、静态分析与测试各自解决什么、八章怎样互相支撑。' },
  { id: 'ch01', num: '01', title: '从源码到控制流图', en: 'SOURCE TO CFG', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'code', labs: 1,
    blurb: '把源码降解成三地址码，按 leader 规则切基本块、连 CFG，再识别支配关系与自然循环。' },
  { id: 'ch02', num: '02', title: '数据流分析：用抽象逼近程序行为', en: 'DATAFLOW ANALYSIS', part: 'Part II · 基础', week: 4, minutes: 100, icon: 'chart', labs: 1,
    blurb: '用有限抽象替代无限具体状态：传递函数、gen/kill、may/must 与可靠性的第一课。' },
  { id: 'ch03', num: '03', title: '经典数据流问题：到达定值与活跃变量', en: 'CLASSIC PROBLEMS', part: 'Part III · 深入', week: 6, minutes: 110, icon: 'layers', labs: 1,
    blurb: '四个经典问题一张表：到达定值、活跃变量、可用表达式、非常忙表达式，方向与汇合各不同。' },
  { id: 'ch04', num: '04', title: '格、不动点与 worklist', en: 'LATTICES & FIXPOINTS', part: 'Part III · 深入', week: 8, minutes: 110, icon: 'repeat', labs: 1,
    blurb: '回答「迭代为什么一定停、停在哪、解有多精确」：偏序与格、单调性、Kleene 定理与 MOP/MFP。' },
  { id: 'ch05', num: '05', title: '符号执行与约束求解', en: 'SYMBOLIC EXECUTION', part: 'Part III · 深入', week: 10, minutes: 120, icon: 'target', labs: 1,
    blurb: '把输入变成符号，沿路径累积条件，用 SMT 求解反例；再理解路径爆炸与 concolic 的取舍。' },
  { id: 'ch06', num: '06', title: '测试、覆盖与测试约简', en: 'TESTING & REDUCTION', part: 'Part IV · 综合', week: 12, minutes: 120, icon: 'flask', labs: 1,
    blurb: '覆盖率到底能说明什么：语句/分支/路径覆盖、oracle 问题、ddmin 与变异测试的分工。' },
  { id: 'ch07', num: '07', title: '缺陷定位、修复与维护', en: 'LOCALIZATION & REPAIR', part: 'Part IV · 综合', week: 14, minutes: 120, icon: 'zap', labs: 1,
    blurb: '从失败测试到可提交补丁：Ochiai 定位、根因分析、APR 工作流、补丁过拟合与回归。' }
]);
