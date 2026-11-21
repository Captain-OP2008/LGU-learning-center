/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * 说明：title 必须与 data/chXX.js 里的 title 逐字一致。
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：从级数到向量场', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先摊开整门课的地图：级数、曲线、空间、多元微积分与三大定理如何串成一条线，以及本站怎么用。' },
  { id: 'ch01', num: '01', title: '数列与级数：收敛的判据', en: 'SEQUENCES AND SERIES', part: 'Part II · 基础', week: 3, minutes: 90, icon: 'function', labs: 1,
    blurb: '从部分和与几何级数讲到 p 级数、积分判别与比较判别：给你一个级数，能选对判据、估出余项。' },
  { id: 'ch02', num: '02', title: '变号级数与幂级数', en: 'ALTERNATING SERIES AND POWER SERIES', part: 'Part II · 基础', week: 5, minutes: 100, icon: 'repeat', labs: 1,
    blurb: '分清绝对收敛与条件收敛，用比值、根值法求收敛半径，再把幂级数当成函数来运算。' },
  { id: 'ch03', num: '03', title: '泰勒展开与近似计算', en: 'TAYLOR SERIES AND APPROXIMATION', part: 'Part III · 深入', week: 7, minutes: 100, icon: 'chart', labs: 1,
    blurb: '把函数换成多项式：五个必背展开、拉格朗日余项，以及用级数求极限、估误差、算积分的套路。' },
  { id: 'ch04', num: '04', title: '参数曲线与极坐标', en: 'PARAMETRIC CURVES AND POLAR COORDINATES', part: 'Part III · 深入', week: 9, minutes: 110, icon: 'target', labs: 1,
    blurb: '用参数与极坐标描述平面曲线，算切线、弧长与面积；重点是极坐标的对称性与积分限。' },
  { id: 'ch05', num: '05', title: '向量、空间几何与空间曲线', en: 'VECTORS, SPACE GEOMETRY AND SPACE CURVES', part: 'Part III · 深入', week: 11, minutes: 110, icon: 'box', labs: 1,
    blurb: '点积、叉积、直线与平面、二次曲面，再到空间曲线的切向量、弧长、曲率与活动标架。' },
  { id: 'ch06', num: '06', title: '偏导数、梯度与多元极值', en: 'PARTIAL DERIVATIVES AND EXTREMA', part: 'Part IV · 综合', week: 13, minutes: 120, icon: 'star', labs: 1,
    blurb: '多元极限、偏导与可微、链式法则、梯度与切平面，最后用二阶判别与拉格朗日乘子求极值。' },
  { id: 'ch07', num: '07', title: '多重积分与向量场定理', en: 'MULTIPLE INTEGRALS AND VECTOR CALCULUS', part: 'Part IV · 综合', week: 15, minutes: 120, icon: 'rocket', labs: 1,
    blurb: '二重、三重积分与四种坐标系，线面积分，格林、斯托克斯、散度定理：把边界与内部互换。' }
]);
