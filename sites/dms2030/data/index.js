/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * title 必须与 chXX.js 的 title 逐字一致
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：从一条生产线到一张供应网络', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：一家工厂从接单到交付要回答哪些问题、七章分别站在哪一段、怎样使用本站。' },
  { id: 'ch01', num: '01', title: '战略与生产力：运营凭什么赢', en: 'OPERATIONS STRATEGY & PRODUCTIVITY', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'target', labs: 1,
    blurb: '竞争维度、订单赢家与资格、权衡与效率前沿、生产力三口径：先想清楚「凭什么赢」，再谈怎么算。' },
  { id: 'ch02', num: '02', title: '产品设计、产能与学习曲线', en: 'PRODUCT DESIGN, CAPACITY & LEARNING', part: 'Part II · 基础', week: 3, minutes: 90, icon: 'box', labs: 1,
    blurb: '设计五阶段、DFM/DFA、设计产能与最佳运营水平、扩张决策树、学习曲线的翻倍规律。' },
  { id: 'ch03', num: '03', title: '流程分析：瓶颈、利特尔法则与等待', en: 'PROCESS ANALYSIS & QUEUEING', part: 'Part III · 深入', week: 5, minutes: 100, icon: 'repeat', labs: 1,
    blurb: '流程类型、瓶颈与产出率、利特尔法则 WIP = R × T、排队公式与利用率、产线平衡与服务流程差异。' },
  { id: 'ch04', num: '04', title: '质量：六西格玛与统计过程控制', en: 'QUALITY: SIX SIGMA & SPC', part: 'Part III · 深入', week: 7, minutes: 95, icon: 'chart', labs: 1,
    blurb: '质量成本、六西格玛的 3.4 ppm、DMAIC、Cp 与 Cpk、X̄–R 控制图、抽样风险与改进工具箱。' },
  { id: 'ch05', num: '05', title: '库存管理：EOQ、安全库存与 ABC', en: 'INVENTORY MANAGEMENT', part: 'Part III · 深入', week: 9, minutes: 100, icon: 'layers', labs: 1,
    blurb: '库存的五类成本、ABC 分类、EOQ 与成本平坦性、数量折扣、安全库存与再订货点、周转率与盘点。' },
  { id: 'ch06', num: '06', title: '预测与产销计划：从 S&OP 到 MRP', en: 'FORECASTING, S&OP & MRP', part: 'Part IV · 综合', week: 11, minutes: 95, icon: 'grid', labs: 1,
    blurb: '预测四法则、移动平均与指数平滑、MAD 与跟踪信号、平准与追逐、S&OP 会议、MRP 展开与倒推。' },
  { id: 'ch07', num: '07', title: '精益与供应链设计：采购、物流与风险', en: 'LEAN & SUPPLY CHAIN DESIGN', part: 'Part IV · 综合', week: 13, minutes: 110, icon: 'zap', labs: 1,
    blurb: '精益七大浪费、看板与节拍、牛鞭效应、TCO 与运输选择、仓网设计、TOC、延迟差异化与供应链韧性。' }
]);
