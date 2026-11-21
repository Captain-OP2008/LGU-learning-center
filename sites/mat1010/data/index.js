/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * 说明：title 必须与 data/chXX.js 里的 title 逐字一致。
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：用数学读经济现象', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先摊开整门课的地图：经济模型怎么搭、四条主线怎么走、供需均衡这个例子怎么贯穿八章。' },
  { id: 'ch01', num: '01', title: '代数基础：指数、方程与不等式', en: 'ALGEBRA ESSENTIALS', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'function', labs: 1,
    blurb: '把指数、对数、方程、不等式与求和练熟：这些是后面求均衡、解最优、算现值的通用工具。' },
  { id: 'ch02', num: '02', title: '函数与图形：把经济关系画成曲线', en: 'FUNCTIONS & GRAPHS', part: 'Part II · 基础', week: 4, minutes: 95, icon: 'chart', labs: 1,
    blurb: '从定义域到顶点、从反函数到成本曲线：让一条方程变成能读懂的图，再从图读出经济含义。' },
  { id: 'ch03', num: '03', title: '导数与边际分析：变化的速率', en: 'DERIVATIVES & MARGINAL ANALYSIS', part: 'Part III · 深入', week: 6, minutes: 100, icon: 'zap', labs: 1,
    blurb: '用导数把「再多一单位」变成可算的数：边际成本、边际收益、弹性与一阶近似，都在这一章。' },
  { id: 'ch04', num: '04', title: '极限、连续与单变量最优化', en: 'LIMITS & OPTIMIZATION', part: 'Part III · 深入', week: 8, minutes: 110, icon: 'target', labs: 1,
    blurb: '极限与连续保证「最优存在」，一阶与二阶条件告诉你「最优在哪」，垄断定价是第一个完整应用。' },
  { id: 'ch05', num: '05', title: '积分与累积：从边际回到总量', en: 'INTEGRALS & ACCUMULATION', part: 'Part III · 深入', week: 10, minutes: 105, icon: 'layers', labs: 1,
    blurb: '把边际函数积回去得到总量：消费者剩余、现值、净现值与基尼系数，都是「面积」的经济读法。' },
  { id: 'ch06', num: '06', title: '多元函数与偏导数：生产的两个方向', en: 'MULTIVARIABLE FUNCTIONS', part: 'Part IV · 综合', week: 12, minutes: 115, icon: 'grid', labs: 1,
    blurb: '资本与劳动同时变：偏导给出边际产品，全微分做近似，欧拉定理讲分配，Hessian 判别极值。' },
  { id: 'ch07', num: '07', title: '约束优化与动态：拉格朗日到差分方程', en: 'CONSTRAINED OPTIMIZATION & DYNAMICS', part: 'Part IV · 综合', week: 14, minutes: 120, icon: 'repeat', labs: 1,
    blurb: '稀缺下的最优选择：拉格朗日与影子价格、Cramer 法则，再用差分方程看价格会不会回到均衡。' }
]);
