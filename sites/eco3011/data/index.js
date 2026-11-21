/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：这门课回答什么问题、各章之间怎么衔接、怎样使用本站。' },
  { id: 'ch01', num: '01', title: '预算、偏好与效用', en: 'BUDGET, PREFERENCES, UTILITY', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'box', labs: 1,
    blurb: '用预算集描述「买得起什么」，用偏好公理描述「想要什么」，再把两者合成效用函数与无差异曲线。' },
  { id: 'ch02', num: '02', title: '消费者选择与需求', en: 'CHOICE AND DEMAND', part: 'Part II · 基础', week: 3, minutes: 95, icon: 'target', labs: 1,
    blurb: '相切条件解出最优消费束，再从最优解推出需求曲线、弹性与斯勒茨基分解，解释需求为什么向下倾斜。' },
  { id: 'ch03', num: '03', title: '不确定性与跨期选择', en: 'UNCERTAINTY AND INTERTEMPORAL CHOICE', part: 'Part III · 深入', week: 5, minutes: 100, icon: 'zap', labs: 1,
    blurb: '把「结果 + 概率」写成彩票，用期望效用刻画风险态度；再把同一套工具搬到「今天消费还是明天消费」。' },
  { id: 'ch04', num: '04', title: '技术、成本与利润', en: 'TECHNOLOGY, COST, PROFIT', part: 'Part III · 深入', week: 7, minutes: 100, icon: 'layers', labs: 1,
    blurb: '从生产函数到等产量线，从成本最小化到 MC、AC 曲线族，最后用 p = MC 解出厂商的供给决策。' },
  { id: 'ch05', num: '05', title: '完全竞争与市场均衡', en: 'COMPETITION AND EQUILIBRIUM', part: 'Part III · 深入', week: 9, minutes: 90, icon: 'grid', labs: 1,
    blurb: '把单个厂商的供给水平加总成市场供给，求均衡、做比较静态，再用剩余与弹性评价税收和价格管制。' },
  { id: 'ch06', num: '06', title: '垄断、定价与寡头', en: 'MONOPOLY, PRICING, OLIGOPOLY', part: 'Part IV · 综合', week: 11, minutes: 105, icon: 'star', labs: 1,
    blurb: '市场势力从哪来、垄断如何定价与规制，以及古诺、伯特兰、斯塔克尔伯格与串谋四种策略互动。' },
  { id: 'ch07', num: '07', title: '一般均衡、福利与市场失灵', en: 'GENERAL EQUILIBRIUM AND WELFARE', part: 'Part IV · 综合', week: 13, minutes: 110, icon: 'chart', labs: 1,
    blurb: '把所有市场放在一起看：瓦尔拉斯定律、帕累托效率与两个福利定理，以及外部性、公共品与信息不对称。' }
]);
