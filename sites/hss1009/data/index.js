/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * title 必须与各章 chXX.js 的 title 逐字一致（首页卡片与检索都读这里）。
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：把社会现象量成可检验的数字', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：这门课回答什么问题、各章之间怎么衔接、怎样使用本站。' },
  { id: 'ch01', num: '01', title: '变量与频数：先把数据看清楚', en: 'VARIABLES & FREQUENCIES', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'grid', labs: 2,
    blurb: '从测量尺度、分析单位到频数表与列联表，学会在动手算之前先弄清数据是什么形状。' },
  { id: 'ch02', num: '02', title: '集中与离散：均值、标准差与 z 分数', en: 'CENTRAL TENDENCY & DISPERSION', part: 'Part II · 基础', week: 3, minutes: 90, icon: 'chart', labs: 2,
    blurb: '三个代表值各管什么、标准差为什么除以 n−1、z 分数如何把不同量表放到一把尺上。' },
  { id: 'ch03', num: '03', title: '抽样分布：标准误与中心极限定理', en: 'SAMPLING DISTRIBUTION & CLT', part: 'Part III · 深入', week: 4, minutes: 100, icon: 'function', labs: 2,
    blurb: '为什么样本均值自己也有分布、标准误为什么随 √n 缩小、置信区间到底在说什么。' },
  { id: 'ch04', num: '04', title: '假设检验：从零假设到 p 值', en: 'HYPOTHESIS TESTING', part: 'Part III · 深入', week: 5, minutes: 100, icon: 'target', labs: 2,
    blurb: '把「有没有差异」变成可判定的问题：写假设、设 α、读 p 值、算功效、说清两类错误。' },
  { id: 'ch05', num: '05', title: '两组均值比较：t 检验的三种形态', en: 'TWO-SAMPLE T TESTS', part: 'Part III · 深入', week: 6, minutes: 100, icon: 'layers', labs: 2,
    blurb: '单样本、独立样本与配对 t 各自对应什么设计，Levene 检验如何决定你该读哪一行。' },
  { id: 'ch06', num: '06', title: '多组均值比较：单因素方差分析', en: 'ONE-WAY ANOVA', part: 'Part IV · 综合', week: 7, minutes: 110, icon: 'star', labs: 2,
    blurb: '三组以上为什么不能连做 t 检验：平方和怎么分解、F 比怎么读、显著之后用 Tukey 找差异。' },
  { id: 'ch07', num: '07', title: '关系与分类：相关、回归与卡方', en: 'CORRELATION, REGRESSION & CHI-SQUARE', part: 'Part IV · 综合', week: 8, minutes: 110, icon: 'box', labs: 2,
    blurb: '用一个数字概括两变量的关系：r 与 r²、回归斜率与预测、卡方与列联表，以及相关为何不是因果。' }
]);
