/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * title 必须与 chXX.js 的 title 逐字一致
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：把管理会计读成一条决策链', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先看清这门课为谁服务、七章如何串成「归集—分析—规划—控制」的链条，以及本站怎么用。' },
  { id: 'ch01', num: '01', title: '成本概念：对象、分类与成本习性', en: 'COST CONCEPTS & CLASSIFICATION', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'layers', labs: 1,
    blurb: '成本对象、直接与间接成本、产品成本与期间费用、固定与变动成本：管理会计的第一套词汇。' },
  { id: 'ch02', num: '02', title: '分批成本法：订单式生产的成本归集', en: 'JOB-ORDER COSTING', part: 'Part II · 基础', week: 3, minutes: 100, icon: 'box', labs: 1,
    blurb: '从领料单到制造费用分配率，把每一张订单的成本算清，并处理多分配与少分配。' },
  { id: 'ch03', num: '03', title: '分步成本法：连续生产与约当产量', en: 'PROCESS COSTING', part: 'Part III · 深入', week: 4, minutes: 100, icon: 'repeat', labs: 1,
    blurb: '用约当产量把在制品折成完工品，加权平均法与先进先出法的差别就藏在这里。' },
  { id: 'ch04', num: '04', title: '本量利分析：贡献毛益、保本点与杠杆', en: 'COST–VOLUME–PROFIT ANALYSIS', part: 'Part III · 深入', week: 5, minutes: 95, icon: 'chart', labs: 1,
    blurb: '贡献毛益率、保本点、目标利润、安全边际与经营杠杆：一句话决定该不该降价。' },
  { id: 'ch05', num: '05', title: '作业成本法：把间接成本算准', en: 'ACTIVITY-BASED COSTING', part: 'Part III · 深入', week: 6, minutes: 100, icon: 'grid', labs: 1,
    blurb: '作业、成本池与成本动因：为什么高产量的产品会被低产量的订单拖累，以及怎么纠正。' },
  { id: 'ch06', num: '06', title: '总预算：从销售预测到现金预算', en: 'THE MASTER BUDGET', part: 'Part IV · 综合', week: 7, minutes: 110, icon: 'target', labs: 1,
    blurb: '销售、生产、材料、人工、制造费用、现金六张预算环环相扣，一张算错后面全错。' },
  { id: 'ch07', num: '07', title: '标准成本、差异分析与相关成本决策', en: 'STANDARD COSTS & DECISION MAKING', part: 'Part IV · 综合', week: 8, minutes: 115, icon: 'zap', labs: 1,
    blurb: '价格差异与数量差异、弹性预算、自制或外购、特殊订单与约束资源：把数字变成决策。' }
]);
