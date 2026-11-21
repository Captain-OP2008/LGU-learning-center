/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：财务会计回答什么问题、三张报表如何勾稽、八章之间怎么衔接、怎样使用本站。' },
  { id: 'ch01', num: '01', title: '会计恒等式与四张财务报表', en: 'THE ACCOUNTING EQUATION & FINANCIAL STATEMENTS', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'layers', labs: 1,
    blurb: '用会计恒等式分析交易，认识资产、负债、权益、收入与费用，并编出资产负债表、利润表、权益变动表与现金流量表。' },
  { id: 'ch02', num: '02', title: '复式记账：从交易到试算平衡', en: 'DOUBLE-ENTRY BOOKKEEPING', part: 'Part II · 基础', week: 3, minutes: 90, icon: 'grid', labs: 1,
    blurb: '掌握借贷规则、T 型账户、日记账与过账，编出试算平衡表，并知道它能查出什么错、查不出什么错。' },
  { id: 'ch03', num: '03', title: '权责发生制与期末调整分录', en: 'ACCRUAL ACCOUNTING & ADJUSTING ENTRIES', part: 'Part III · 深入', week: 4, minutes: 90, icon: 'repeat', labs: 1,
    blurb: '区分收付实现制与权责发生制，处理预付、折旧、预收、应计收入与应计费用五类调整，并完成结账。' },
  { id: 'ch04', num: '04', title: '现金、应收账款与收入确认', en: 'CASH, RECEIVABLES & REVENUE', part: 'Part III · 深入', week: 5, minutes: 90, icon: 'box', labs: 1,
    blurb: '编制银行余额调节表，用备抵法处理坏账与票据，按 IFRS 15 五步法确认收入，并判断主责人与代理人。' },
  { id: 'ch05', num: '05', title: '存货计价与销货成本', en: 'INVENTORY & COST OF GOODS SOLD', part: 'Part III · 深入', week: 6, minutes: 90, icon: 'chart', labs: 1,
    blurb: '算清存货成本构成，比较 FIFO、加权平均与 LIFO 对利润的影响，处理 LCNRV 减值与存货周转分析。' },
  { id: 'ch06', num: '06', title: '长期资产、折旧与无形资产', en: 'LONG-LIVED ASSETS & DEPRECIATION', part: 'Part IV · 综合', week: 7, minutes: 100, icon: 'target', labs: 1,
    blurb: '判断资本化与费用化，用直线法、工作量法与双倍余额递减法计提折旧，处理处置损益、无形资产与商誉减值。' },
  { id: 'ch07', num: '07', title: '负债、股东权益与报表分析', en: 'LIABILITIES, EQUITY & ANALYSIS', part: 'Part IV · 综合', week: 8, minutes: 110, icon: 'trophy', labs: 1,
    blurb: '处理债券折溢价与股利，用间接法编经营活动现金流，算四组比率并用杜邦分析判断利润质量与风险。' }
]);
