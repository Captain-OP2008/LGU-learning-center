/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：从数据到因果的计量路线', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：计量经济学回答什么问题、三类数据各能回答什么、七章怎么串成一条线。' },
  { id: 'ch01', num: '01', title: '简单线性回归：一条直线能解释多少', en: 'SIMPLE LINEAR REGRESSION', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'function', labs: 1,
    blurb: '从最小二乘的几何直觉到 R² 与无偏性：一条直线能解释多少，又会在哪里骗你。' },
  { id: 'ch02', num: '02', title: '多元回归估计：控制变量到底控制了什么', en: 'MULTIPLE REGRESSION ESTIMATION', part: 'Part II · 基础', week: 3, minutes: 100, icon: 'layers', labs: 2,
    blurb: '偏效应、FWL 残差化、遗漏变量偏差公式与多重共线性：把「控制」这个词拆开看。' },
  { id: 'ch03', num: '03', title: '多元回归推断：t 检验、置信区间与 F 检验', en: 'INFERENCE IN MULTIPLE REGRESSION', part: 'Part III · 深入', week: 4, minutes: 100, icon: 'target', labs: 2,
    blurb: '标准误从哪来、t 与 F 怎么用、p 值为什么最容易被误读；学会读懂一张回归表。' },
  { id: 'ch04', num: '04', title: '函数形式与虚拟变量：把非线性写进回归', en: 'FUNCTIONAL FORM & DUMMY VARIABLES', part: 'Part III · 深入', week: 5, minutes: 100, icon: 'grid', labs: 2,
    blurb: '对数、二次项、交互项与虚拟变量：让模型长得像经济现实，而不是像一条直线。' },
  { id: 'ch05', num: '05', title: '异方差与模型设定：标准误为什么会错', en: 'HETEROSKEDASTICITY & SPECIFICATION', part: 'Part III · 深入', week: 6, minutes: 110, icon: 'zap', labs: 2,
    blurb: '残差图里的喇叭口意味着什么：异方差的后果、BP 与 White 检验、稳健标准误与 WLS。' },
  { id: 'ch06', num: '06', title: '时间序列回归：趋势、季节性与序列相关', en: 'TIME SERIES REGRESSION', part: 'Part IV · 综合', week: 7, minutes: 120, icon: 'repeat', labs: 2,
    blurb: '趋势虚增 R²、季节性混入系数、序列相关让 t 值虚高：时间序列的三道坎与三种解法。' },
  { id: 'ch07', num: '07', title: '面板数据与工具变量：走向因果推断', en: 'PANEL DATA & INSTRUMENTAL VARIABLES', part: 'Part IV · 综合', week: 8, minutes: 120, icon: 'rocket', labs: 3,
    blurb: '固定效应「自己跟自己比」、工具变量「借外生变异」：两条从相关走向因果的路，及各自主价。' }
]);
