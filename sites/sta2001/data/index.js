/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * 说明：title 必须与 data/chXX.js 里的 title 逐字一致。
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：概率论与数理统计在做什么', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先摊开整门课的地图：概率论与统计学各自回答什么问题、八章如何依赖、四条核心词汇与三种考题长什么样。' },
  { id: 'ch01', num: '01', title: '概率的语言：样本空间、公理与计数', en: 'SAMPLE SPACES & COUNTING', part: 'Part II · 基础', week: 2, minutes: 95, icon: 'layers', labs: 1,
    blurb: '从样本空间与事件运算讲到三条公理、古典概型与计数四象限，再用容斥、几何概型把「数得清」变成「算得准」。' },
  { id: 'ch02', num: '02', title: '条件概率与独立性：从全概率到贝叶斯', en: 'CONDITIONAL PROBABILITY & BAYES', part: 'Part II · 基础', week: 4, minutes: 95, icon: 'repeat', labs: 1,
    blurb: '条件概率把样本空间缩小，全概率按原因分组，贝叶斯则反过来问「结果由哪个原因造成」——基率谬误就藏在这里。' },
  { id: 'ch03', num: '03', title: '随机变量与分布：离散、连续与变换', en: 'RANDOM VARIABLES & DISTRIBUTIONS', part: 'Part III · 深入', week: 6, minutes: 100, icon: 'chart', labs: 1,
    blurb: '用分布函数统一描述随机变量，掌握六个常见分布族，并学会单调变换、累积法与雅可比三条变量变换路线。' },
  { id: 'ch04', num: '04', title: '期望、方差与矩母函数', en: 'EXPECTATION, VARIANCE & MGF', part: 'Part III · 深入', week: 8, minutes: 100, icon: 'function', labs: 1,
    blurb: '期望是加权平均、方差是波动，LOTUS 让求期望不必先求分布；矩母函数则把「求矩」变成「求导」。' },
  { id: 'ch05', num: '05', title: '多维随机变量与线性组合', en: 'MULTIVARIATE DISTRIBUTIONS', part: 'Part III · 深入', week: 10, minutes: 100, icon: 'grid', labs: 1,
    blurb: '联合、边缘与条件分布构成二维图景；协方差刻画线性关联，线性组合的均值方差是后面抽样理论的地基。' },
  { id: 'ch06', num: '06', title: '抽样分布与极限定理', en: 'SAMPLING DISTRIBUTIONS & LIMIT THEOREMS', part: 'Part IV · 综合', week: 12, minutes: 110, icon: 'star', labs: 1,
    blurb: '统计量随抽样而变，于是有了标准误；中心极限定理让正态近似无处不在，χ²、t、F 三大分布由此登场。' },
  { id: 'ch07', num: '07', title: '统计推断：估计、区间与检验', en: 'STATISTICAL INFERENCE', part: 'Part IV · 综合', week: 14, minutes: 120, icon: 'target', labs: 1,
    blurb: '矩估计与极大似然给出点估计，枢轴量法给出区间，四要素框架给出检验——最后把 p 值的正确用法说清楚。' }
]);
