/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * title 与 en 必须与 chXX.js 逐字一致
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：从现金流到价值', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：公司金融回答什么问题、八章如何衔接、怎样使用本站。' },
  { id: 'ch01', num: '01', title: '公司金融导论：目标、代理问题与金融市场', en: 'INTRODUCTION TO CORPORATE FINANCE', part: 'Part II · 基础', week: 3, minutes: 90, icon: 'function', labs: 1,
    blurb: '企业组织形式、股东价值最大化、代理成本、金融市场与有效市场：先把「为谁决策、在哪决策」讲清楚。' },
  { id: 'ch02', num: '02', title: '财务报表与现金流：从利润到自由现金流', en: 'FINANCIAL STATEMENTS & CASH FLOW', part: 'Part II · 基础', week: 4, minutes: 90, icon: 'chart', labs: 1,
    blurb: '三张报表、比率分析、杜邦分解，以及把净利润调整为经营现金流与 FCFF 的完整链条。' },
  { id: 'ch03', num: '03', title: '货币时间价值：折现、年金与永续年金', en: 'TIME VALUE OF MONEY', part: 'Part III · 核心', week: 5, minutes: 90, icon: 'chart', labs: 1,
    blurb: '终值与现值、复利与 EAR、年金与永续年金、增长永续与贷款摊销：一切估值的地基。' },
  { id: 'ch04', num: '04', title: '债券与股票估值：给证券定价', en: 'BOND & STOCK VALUATION', part: 'Part III · 核心', week: 6, minutes: 100, icon: 'target', labs: 1,
    blurb: '债券定价与 YTM、久期与利率风险，股利折现模型、增长与 PVGO，以及乘数法的用法与边界。' },
  { id: 'ch05', num: '05', title: '资本预算：NPV、IRR 与增量现金流', en: 'CAPITAL BUDGETING', part: 'Part III · 核心', week: 8, minutes: 110, icon: 'zap', labs: 1,
    blurb: 'NPV/IRR/PI/回收期的取舍、增量现金流的三条原则、折旧税盾、营运资本与敏感性分析。' },
  { id: 'ch06', num: '06', title: '风险与收益：从组合到 CAPM', en: 'RISK & RETURN', part: 'Part IV · 综合', week: 10, minutes: 110, icon: 'layers', labs: 1,
    blurb: '期望收益与方差、组合分散化、系统与非系统风险、β 与 CAPM、SML 与 alpha。' },
  { id: 'ch07', num: '07', title: '资本成本、资本结构与股利政策', en: 'COST OF CAPITAL & CAPITAL STRUCTURE', part: 'Part IV · 综合', week: 11, minutes: 110, icon: 'repeat', labs: 1,
    blurb: 'WACC 的构造、MM 定理与税盾、财务困境成本、优序融资，以及股利政策是否影响价值。' }
]);
