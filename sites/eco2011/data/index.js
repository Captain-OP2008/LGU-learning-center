/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：经济学研究什么问题、七章怎么衔接、怎样使用本站的讲义与题库。' },
  { id: 'ch01', num: '01', title: '稀缺、选择与机会成本', en: 'SCARCITY & CHOICE', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'star', labs: 1,
    blurb: '资源有限而欲望无穷，于是每一次选择都有代价：学会用机会成本、边际与激励三把尺子衡量取舍。' },
  { id: 'ch02', num: '02', title: '供给、需求与市场均衡', en: 'SUPPLY & DEMAND', part: 'Part II · 基础', week: 3, minutes: 90, icon: 'chart', labs: 1,
    blurb: '把买者与卖者的行为画成两条曲线，求出均衡价格与数量，并判断价格上限、下限带来的短缺与过剩。' },
  { id: 'ch03', num: '03', title: '弹性及其应用', en: 'ELASTICITY', part: 'Part III · 深入', week: 4, minutes: 100, icon: 'function', labs: 2,
    blurb: '用弹性衡量「数量对价格有多敏感」，进而解释总收益变化、税收归宿与无谓损失的大小。' },
  { id: 'ch04', num: '04', title: '消费者选择与需求曲线', en: 'CONSUMER CHOICE', part: 'Part III · 深入', week: 5, minutes: 100, icon: 'layers', labs: 2,
    blurb: '从效用最大化与预算约束推出需求曲线：无差异曲线、边际替代率与收入效应、替代效应。' },
  { id: 'ch05', num: '05', title: '生产成本与企业决策', en: 'PRODUCTION COSTS', part: 'Part III · 深入', week: 6, minutes: 100, icon: 'grid', labs: 2,
    blurb: '从生产函数到成本曲线，理清 MC、AVC、ATC 的关系，用 MR = MC 决定产量与停产。' },
  { id: 'ch06', num: '06', title: '市场结构：完全竞争、垄断与寡头', en: 'MARKET STRUCTURE', part: 'Part IV · 综合', week: 7, minutes: 110, icon: 'cpu', labs: 2,
    blurb: '同一条 MR = MC 规则，在四种市场结构下推出不同的价格、产量与福利结果，并解释企业间的策略互动。' },
  { id: 'ch07', num: '07', title: '市场失灵与政府角色', en: 'MARKET FAILURE', part: 'Part IV · 综合', week: 8, minutes: 110, icon: 'target', labs: 2,
    blurb: '外部性、公共品、共有资源与信息不对称会让市场结果偏离效率，政策工具也各有代价。' }
]);
