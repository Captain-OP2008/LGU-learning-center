/* =====================================================================
 * index.js · MAT3007 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：凸优化回答什么问题、八章如何衔接、怎样使用本站。' },
  { id: 'ch01', num: '01', title: '优化问题与建模', en: 'MODELING', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'grid', labs: 1,
    blurb: '把一段业务描述翻成决策变量、目标与约束，识别 LP、QP 与锥规划，并避开常见建模陷阱。' },
  { id: 'ch02', num: '02', title: '凸集', en: 'CONVEX SETS', part: 'Part II · 基础', week: 3, minutes: 90, icon: 'layers', labs: 2,
    blurb: '用凸组合与分离定理刻画可行域的形状：多面体、锥、半空间与保凸运算。' },
  { id: 'ch03', num: '03', title: '凸函数', en: 'CONVEX FUNCTIONS', part: 'Part II · 基础', week: 4, minutes: 90, icon: 'function', labs: 2,
    blurb: '从一阶、二阶条件到保凸运算，学会判定目标函数的形状并读懂强凸与条件数。' },
  { id: 'ch04', num: '04', title: '凸优化问题', en: 'CONVEX PROBLEMS', part: 'Part III · 深入', week: 5, minutes: 90, icon: 'box', labs: 2,
    blurb: '标准形、等价变换与 LP/QP/SOCP/SDP 的层次，学会把一个模型改写成求解器能吃的形式。' },
  { id: 'ch05', num: '05', title: '对偶与 KKT', en: 'DUALITY & KKT', part: 'Part III · 深入', week: 6, minutes: 120, icon: 'repeat', labs: 2,
    blurb: '拉格朗日函数、弱对偶与强对偶、Slater 条件与 KKT，用影子价格读出最优解的灵敏度。' },
  { id: 'ch06', num: '06', title: '无约束优化算法', en: 'UNCONSTRAINED', part: 'Part IV · 综合', week: 7, minutes: 120, icon: 'zap', labs: 2,
    blurb: '梯度下降、回溯线搜索、牛顿法与拟牛顿法：收敛速率、条件数与停止准则。' },
  { id: 'ch07', num: '07', title: '约束算法与内点法', en: 'CONSTRAINED', part: 'Part IV · 综合', week: 8, minutes: 120, icon: 'cpu', labs: 2,
    blurb: '从罚函数到对数障碍与原始-对偶内点法，比较单纯形法，并用 ADMM 处理可分裂问题。' }
]);
