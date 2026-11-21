/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：中级金融理论在算什么', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：金融理论到底在算什么、四大部分如何衔接、怎样使用本站。' },
  { id: 'ch01', num: '01', title: '不确定性下的选择：期望效用与风险厌恶', en: 'CHOICE UNDER UNCERTAINTY', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'layers', labs: 1,
    blurb: '从彩票选择出发，用期望效用刻画偏好，再以确定性等价与风险溢价把「怕风险」变成一个可算的数字。' },
  { id: 'ch02', num: '02', title: '或有权益、状态价格与无套利', en: 'CONTINGENT CLAIMS & NO-ARBITRAGE', part: 'Part II · 基础', week: 3, minutes: 90, icon: 'grid', labs: 1,
    blurb: '把未来拆成状态，用一组状态价格给所有可复制支付定价；一价定律与套利组合是本课的地基。' },
  { id: 'ch03', num: '03', title: '均值-方差分析与组合前沿', en: 'MEAN-VARIANCE ANALYSIS', part: 'Part III · 深入', week: 4, minutes: 100, icon: 'chart', labs: 1,
    blurb: '只用一个均值和一个方差描述风险，画出可达集、最小方差组合与有效前沿，并引入无风险资产得到 CML。' },
  { id: 'ch04', num: '04', title: 'CAPM 与均衡资产定价', en: 'CAPM & EQUILIBRIUM PRICING', part: 'Part III · 深入', week: 5, minutes: 90, icon: 'target', labs: 1,
    blurb: '让所有人同时优化，市场组合成为切点组合，于是期望回报由 β 决定——SML 与 α 的判读。' },
  { id: 'ch05', num: '05', title: '期权与无套利定价', en: 'OPTIONS & NO-ARBITRAGE', part: 'Part III · 深入', week: 6, minutes: 100, icon: 'repeat', labs: 1,
    blurb: '用股票与债券复制非线性支付：平价关系、二项树、风险中性概率与 Black-Scholes 的直觉。' },
  { id: 'ch06', num: '06', title: '随机贴现因子与跨期均衡', en: 'SDF & INTERTEMPORAL EQUILIBRIUM', part: 'Part IV · 综合', week: 7, minutes: 100, icon: 'star', labs: 1,
    blurb: '用 p = E[m·x] 把前面所有公式收进一个框架，再面对股权溢价之谜与无风险利率之谜。' },
  { id: 'ch07', num: '07', title: '信息不对称、代理与公司金融', en: 'ASYMMETRIC INFO & CORPORATE FINANCE', part: 'Part IV · 综合', week: 8, minutes: 90, icon: 'trophy', labs: 1,
    blurb: '拆掉完美市场假设：逆向选择、信号、代理成本、融资优序与银行挤兑如何改变融资与估值。' }
]);
