/* =====================================================================
 * index.js · PSY1020 章节目录
 * 8 章；title / en 必须与各 chXX.js 的 title / en 逐字一致。
 * icon 取值：compass keyboard sparkle box layers function repeat cpu
 *            memory star grid chart zap rocket target code play flask trophy
 * ===================================================================== */
CSC.registerMeta([
  {
    id: 'ch00',
    num: '00',
    title: '课程地图：从数据到结论的统计路线',
    en: 'COURSE MAP',
    part: 'Part I · 导览',
    week: 1,
    minutes: 45,
    icon: 'compass',
    labs: '课程导览 · 工具准备',
    blurb: '先建立整门课的地图：描述与推断的分工、数据结构与记号、分析流程、效应量与软件工具。这一章不涉及公式推导，只回答「这门课要带你去哪、按什么顺序走」。'
  },
  {
    id: 'ch01',
    num: '01',
    title: '描述统计：把一堆分数说清楚',
    en: 'DESCRIPTIVE STATISTICS',
    part: 'Part II · 基础',
    week: 2,
    minutes: 110,
    icon: 'chart',
    labs: 'Python pandas · SPSS Frequencies',
    blurb: '测量尺度决定能算什么；频数分布与图表决定第一印象；集中趋势与离散程度决定如何概括；z 分数让不同量表可以比较。本章的目标是让你拿到任何一份数据，都能先用正确的方式说清楚它长什么样。'
  },
  {
    id: 'ch02',
    num: '02',
    title: '概率与抽样分布：推断的地基',
    en: 'PROBABILITY & SAMPLING DISTRIBUTIONS',
    part: 'Part II · 基础',
    week: 3,
    minutes: 100,
    icon: 'function',
    labs: 'Python scipy.stats · 正态表',
    blurb: '推断统计的全部逻辑都建立在抽样分布上。本章从概率规则讲到正态分布、标准误、中心极限定理与 t 分布，解释为什么「样本均值本身也是一个随机变量」，以及标准误为什么是误差棒与置信区间的核心。'
  },
  {
    id: 'ch03',
    num: '03',
    title: '假设检验：p 值到底在说什么',
    en: 'HYPOTHESIS TESTING',
    part: 'Part III · 深入',
    week: 4,
    minutes: 100,
    icon: 'target',
    labs: '模拟 p 值 · 功效计算',
    blurb: '零假设、备择假设、α、p 值、两类错误、功效、效应量与置信区间——这些词经常被混用。本章用模拟与图示把它们逐一拆开，重点纠正「p 值是 H₀ 为真的概率」这类高频误读。'
  },
  {
    id: 'ch04',
    num: '04',
    title: 't 检验：两组均值怎么比',
    en: 't TESTS',
    part: 'Part III · 深入',
    week: 5,
    minutes: 110,
    icon: 'layers',
    labs: 'SPSS Compare Means · Python',
    blurb: '单样本、独立样本、配对样本三种 t 检验，分别对应三种设计。本章讲清每种 t 的假设、自由度、效应量与报告方式，并说明方差不齐时为什么应改用 Welch，而不是硬读 Student t。'
  },
  {
    id: 'ch05',
    num: '05',
    title: '方差分析：三组以上怎么比',
    en: 'ANALYSIS OF VARIANCE',
    part: 'Part III · 深入',
    week: 6,
    minutes: 120,
    icon: 'grid',
    labs: 'SPSS One-Way / GLM · Python',
    blurb: '三组以上反复做 t 检验会让假阳性迅速膨胀。本章讲 F 比值、平方和分解、η²、事后检验、重复测量与双因素交互，重点是看懂 ANOVA 表，并知道 F 显著之后该做什么、不该做什么。'
  },
  {
    id: 'ch06',
    num: '06',
    title: '相关与回归：两个变量怎么一起动',
    en: 'CORRELATION & REGRESSION',
    part: 'Part IV · 综合',
    week: 7,
    minutes: 115,
    icon: 'repeat',
    labs: 'Python seaborn / statsmodels · SPSS',
    blurb: '从散点图与 Pearson r，到最小二乘回归、残差诊断与多元回归。本章反复强调两件事：先画图再算 r，以及相关不等于因果；同时教你用 r² 与残差图判断「这个模型到底有没有用」。'
  },
  {
    id: 'ch07',
    num: '07',
    title: '卡方、非参数与统计报告',
    en: 'CHI-SQUARE, NONPARAMETRICS & REPORTING',
    part: 'Part IV · 综合',
    week: 8,
    minutes: 110,
    icon: 'star',
    labs: 'SPSS Crosstabs / Nonparametric · APA 写作',
    blurb: '分类变量用卡方，顺序数据或小样本用非参数；最后把整门课收束成一张检验选择决策图。本章还讲 APA 报告规范、可重复性与开放科学，让「算出来」变成「写得清、别人能核对」。'
  }
]);
