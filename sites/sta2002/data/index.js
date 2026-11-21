/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * 说明：title 必须与 data/chXX.js 里的 title 逐字一致。
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：只有样本时，我们凭什么下结论', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先摊开整门课的地图：统计推断回答什么问题、七章如何依赖、三条主线怎么串，以及本站怎么用。' },
  { id: 'ch01', num: '01', title: '随机变量与常见分布：推断的原料', en: 'RANDOM VARIABLES AND DISTRIBUTIONS', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'chart', labs: 1,
    blurb: '从随机变量、密度与分布函数讲到期望方差、常见离散/连续分布与随机变量函数：把推断的原料备齐。' },
  { id: 'ch02', num: '02', title: '抽样分布与极限定理：估计量的分布', en: 'SAMPLING DISTRIBUTIONS AND LIMIT THEOREMS', part: 'Part II · 基础', week: 4, minutes: 100, icon: 'grid', labs: 1,
    blurb: '统计量为什么会波动：χ²、t、F 三大抽样分布，标准误，大数定律与中心极限定理，以及正态近似的边界。' },
  { id: 'ch03', num: '03', title: '点估计：矩法与极大似然', en: 'POINT ESTIMATION', part: 'Part III · 深入', week: 6, minutes: 100, icon: 'target', labs: 1,
    blurb: '用样本算一个数去猜参数：矩估计的套路、似然函数怎么建、五大常见分布的 MLE，以及数值求解与不变性。' },
  { id: 'ch04', num: '04', title: '估计量的评价与充分性', en: 'EVALUATING ESTIMATORS', part: 'Part III · 深入', week: 8, minutes: 100, icon: 'star', labs: 1,
    blurb: '估计量好不好，看偏差、方差与 MSE：充分统计量、Fisher 信息与 Cramér-Rao 下界，再到 UMVUE 的构造。' },
  { id: 'ch05', num: '05', title: '置信区间与枢轴量', en: 'CONFIDENCE INTERVALS', part: 'Part III · 深入', week: 10, minutes: 100, icon: 'layers', labs: 1,
    blurb: '给估计配一个误差范围：枢轴量怎么找，均值/比例/方差/两样本的区间怎么算，样本量与覆盖率如何权衡。' },
  { id: 'ch06', num: '06', title: '假设检验：错误、p 值与功效', en: 'HYPOTHESIS TESTING', part: 'Part IV · 综合', week: 12, minutes: 110, icon: 'zap', labs: 1,
    blurb: '把「有没有证据」变成判决：两类错误、拒绝域与 p 值、Neyman-Pearson 与似然比，以及功效和样本量。' },
  { id: 'ch07', num: '07', title: '常见检验与综合应用', en: 'COMMON TESTS AND APPLICATIONS', part: 'Part IV · 综合', week: 14, minutes: 110, icon: 'rocket', labs: 1,
    blurb: '按数据类型与设计挑检验：t 家族、卡方、ANOVA、回归，再用效应量与 A/B 全流程把结论写成可执行的报告。' }
]);
