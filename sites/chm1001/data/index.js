/* =====================================================================
 * index.js · CHM1001 课程元数据（CSC.registerMeta）
 * title 与各 chXX.js 的 title 逐字一致；week 递增；minutes 在 60–120 之间。
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerMeta([
    {
      id: 'ch00',
      num: '00',
      title: '课程地图：把化学读成一门可计算的科学',
      en: 'COURSE MAP',
      part: 'Part I · 导览',
      week: 1,
      minutes: 60,
      icon: 'compass',
      labs: ['用一张图说清八章之间的依赖关系', '识别「化学题」与「数学题」的分界'],
      blurb: '先看整门课的地形：从测量走到结构，再从计量走到能量。读完这一章，你会知道后面的每个公式是在回答什么问题，也知道哪些章节可以跳过、哪些必须按顺序读。'
    },
    {
      id: 'ch01',
      num: '01',
      title: '物质、能量与测量：先把数字量准',
      en: 'MATTER, ENERGY & MEASUREMENT',
      part: 'Part II · 基础',
      week: 2,
      minutes: 90,
      icon: 'function',
      labs: ['用有效数字规则处理一次乘除与加减混合运算', '把密度、温度、能量单位互换'],
      blurb: '化学的第一道门槛不是方程式，而是数字：谁的有效数字错了，后面的计算全错。这一章把单位、误差、密度与能量放在同一套语言里，让你此后写下的每个数都带得动单位。'
    },
    {
      id: 'ch02',
      num: '02',
      title: '原子、分子与离子：从微观粒子到化学式',
      en: 'ATOMS, MOLECULES & IONS',
      part: 'Part II · 基础',
      week: 3,
      minutes: 90,
      icon: 'target',
      labs: ['由质量分数反推实验式与分子式', '给离子化合物命名并写出离子式'],
      blurb: '质子数决定元素，电子排布决定性质，而化学式只是前两者的缩写。这一章把原子、同位素、离子与分子串起来，练到看见一个式量就能说出它的组成。'
    },
    {
      id: 'ch03',
      num: '03',
      title: '化学计量：配平、限量试剂与产率',
      en: 'STOICHIOMETRY',
      part: 'Part III · 深入',
      week: 4,
      minutes: 90,
      icon: 'grid',
      labs: ['配平含氧、含氢的燃烧反应', '用「摩尔数除以系数」判断限量试剂'],
      blurb: '配平是守恒律的记账方式，限量试剂是现实世界的约束。这一章把「克 → 摩尔 → 摩尔 → 克」这条桥修好，并让产率成为你评价一次合成的第一指标。'
    },
    {
      id: 'ch04',
      num: '04',
      title: '水溶液反应：沉淀、酸碱与氧化还原',
      en: 'REACTIONS IN AQUEOUS SOLUTION',
      part: 'Part III · 深入',
      week: 5,
      minutes: 90,
      icon: 'repeat',
      labs: ['用溶解性规则预测沉淀', '标出氧化还原反应中的氧化数变化'],
      blurb: '大多数化学反应发生在水里。这一章先教你写离子方程式，再把沉淀、酸碱、氧化还原三类反应归到同一套「离子重新组合」的框架下，最后落到滴定与浓度计算。'
    },
    {
      id: 'ch05',
      num: '05',
      title: '热化学：焓变、量热与盖斯定律',
      en: 'THERMOCHEMISTRY',
      part: 'Part III · 深入',
      week: 6,
      minutes: 90,
      icon: 'chart',
      labs: ['用 q = mcΔT 计算量热数据', '用标准生成焓算反应焓变'],
      blurb: '反应为什么自发？先看能量。这一章把「体系与环境」的边界画清，用焓变记账，用盖斯定律绕开测不到的反应，最后用 ΔG 判断方向。'
    },
    {
      id: 'ch06',
      num: '06',
      title: '原子结构与周期律：四个量子数与有效核电荷',
      en: 'ATOMIC STRUCTURE & PERIODICITY',
      part: 'Part IV · 综合',
      week: 7,
      minutes: 90,
      icon: 'cpu',
      labs: ['由量子数写出一组轨道并判断是否合法', '用 Z_eff 解释电离能的反常'],
      blurb: '光谱线不是随意出现的，它由四个量子数约束。这一章从光的量子化走到电子排布，再用有效核电荷解释周期表里那些「不听话」的凹陷与例外。'
    },
    {
      id: 'ch07',
      num: '07',
      title: '化学键与分子构型：从 Lewis 结构到分子间作用力',
      en: 'BONDING, GEOMETRY & IMF',
      part: 'Part IV · 综合',
      week: 8,
      minutes: 90,
      icon: 'layers',
      labs: ['画 Lewis 结构并算形式电荷', '用 VSEPR 判断几何并排序沸点'],
      blurb: '原子为什么成键、分子为什么有形状、沸点为什么有高有低——三个问题一条线。这一章从 Lewis 结构出发，经 VSEPR 与杂化，落到分子间作用力与宏观性质。'
    }
  ]);
})();
