/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：数据科学在回答什么问题', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：这门课回答什么问题、各章之间怎么衔接、怎样使用本站。' },
  { id: 'ch01', num: '01', title: '概率论基础：把不确定性写成数字', en: 'PROBABILITY FOUNDATIONS', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'sparkle', labs: 1,
    blurb: '从样本空间与公理出发，走到条件概率、全概率与贝叶斯，学会把直觉翻译成可以计算的概率。' },
  { id: 'ch02', num: '02', title: '随机变量与常见分布：期望、方差与三条分布', en: 'RANDOM VARIABLES & DISTRIBUTIONS', part: 'Part II · 基础', week: 4, minutes: 95, icon: 'chart', labs: 1,
    blurb: '用期望与方差概括随机变量，掌握二项、泊松、正态三条常用分布以及中心极限定理。' },
  { id: 'ch03', num: '03', title: '统计推断：抽样分布、估计与置信区间', en: 'STATISTICAL INFERENCE', part: 'Part III · 深入', week: 6, minutes: 100, icon: 'target', labs: 1,
    blurb: '从样本反推总体：标准误、点估计的三条标准、t 与 z 的选择，以及置信区间的正确读法。' },
  { id: 'ch04', num: '04', title: '线性回归：用一条直线概括关系', en: 'LINEAR REGRESSION', part: 'Part III · 深入', week: 8, minutes: 110, icon: 'function', labs: 1,
    blurb: '从相关系数到最小二乘，手算斜率与截距，读懂 R²、系数检验与残差诊断，并知道什么时候不该外推。' },
  { id: 'ch05', num: '05', title: '凸集与凸函数：为什么优化问题好解', en: 'CONVEXITY', part: 'Part III · 深入', week: 10, minutes: 110, icon: 'layers', labs: 1,
    blurb: '凸性是把「局部最优即全局最优」变成定理的条件，本章讲凸集、保凸运算、一阶二阶判定与 Jensen 不等式。' },
  { id: 'ch06', num: '06', title: '优化方法：梯度下降、牛顿法与收敛', en: 'OPTIMIZATION METHODS', part: 'Part IV · 综合', week: 12, minutes: 110, icon: 'zap', labs: 1,
    blurb: '把凸性变成算法：梯度下降怎么选学习率、牛顿法为什么快、条件数如何决定收敛速度，以及不收敛时先查什么。' },
  { id: 'ch07', num: '07', title: '机器学习入门：KNN、逻辑回归与模型选择', en: 'MACHINE LEARNING BASICS', part: 'Part IV · 综合', week: 14, minutes: 120, icon: 'cpu', labs: 1,
    blurb: 'KNN、逻辑回归、混淆矩阵与交叉验证：把前面所有工具接到一个真实的分类任务上，并学会诚实地评估模型。' }
]);
