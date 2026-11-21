/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * 说明：title 必须与 data/chXX.js 里的 title 逐字一致。
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：微积分之前要备好什么', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先摊开整门课的地图：微积分真正依赖哪些预科工具、七章怎么衔接、怎样使用本站的正文与题库。' },
  { id: 'ch01', num: '01', title: '函数与图像：把关系画成曲线', en: 'FUNCTIONS & GRAPHS', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'function', labs: 1,
    blurb: '从函数记号、定义域值域讲到图像变换、复合与反函数，最后用平均变化率为导数铺路。' },
  { id: 'ch02', num: '02', title: '多项式与有理函数：零点、端点与渐近线', en: 'POLYNOMIAL & RATIONAL FUNCTIONS', part: 'Part II · 基础', week: 3, minutes: 100, icon: 'chart', labs: 1,
    blurb: '用端点行为、零点重数与渐近线三件事，把多项式与有理函数的图像完整画出来。' },
  { id: 'ch03', num: '03', title: '指数与对数：增长、衰减与尺度', en: 'EXPONENTIAL & LOGARITHMIC FUNCTIONS', part: 'Part III · 深入', week: 5, minutes: 100, icon: 'zap', labs: 1,
    blurb: '复利、半衰期与对数坐标：看懂指数增长的速度，也学会用对数把乘法变加法。' },
  { id: 'ch04', num: '04', title: '三角与单位圆：角度、弧度与周期', en: 'TRIGONOMETRY & THE UNIT CIRCLE', part: 'Part III · 深入', week: 7, minutes: 110, icon: 'repeat', labs: 1,
    blurb: '把角放回单位圆：弧度制、特殊角、正弦型函数的四个参数，以及正切为什么会有渐近线。' },
  { id: 'ch05', num: '05', title: '三角恒等式与解三角形：化简与测量', en: 'TRIG IDENTITIES & TRIANGLE SOLVING', part: 'Part III · 深入', week: 9, minutes: 110, icon: 'target', labs: 1,
    blurb: '从基本恒等式推到和差、倍角，再用正弦与余弦定理测量那些拉不到卷尺的距离。' },
  { id: 'ch06', num: '06', title: '方程组与数列：从线性到递推', en: 'SYSTEMS & SEQUENCES', part: 'Part IV · 综合', week: 12, minutes: 110, icon: 'grid', labs: 1,
    blurb: '消元、矩阵与行列式解方程组，再用求和记号、等差等比、归纳法与二项式定理处理离散结构。' },
  { id: 'ch07', num: '07', title: '圆锥曲线与极限预览：从解析几何到微积分', en: 'CONICS & LIMITS PREVIEW', part: 'Part IV · 综合', week: 14, minutes: 120, icon: 'star', labs: 1,
    blurb: '圆、椭圆、双曲线与抛物线的标准形，参数方程与极坐标，最后用极限与导数预览接上微积分。' }
]);
