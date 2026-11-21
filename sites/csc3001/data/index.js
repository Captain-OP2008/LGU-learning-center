/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：离散数学回答什么问题、八章之间怎么衔接、怎样使用本站的讲解与题库。' },
  { id: 'ch01', num: '01', title: '命题逻辑与量词', en: 'PROPOSITIONAL LOGIC & QUANTIFIERS', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'function', labs: 1,
    blurb: '把自然语言论证翻译成真值表与命题公式，用等价变形和量词否定判断推理是否成立。' },
  { id: 'ch02', num: '02', title: '证明方法与证明结构', en: 'PROOF METHODS & STRUCTURE', part: 'Part II · 基础', week: 3, minutes: 90, icon: 'target', labs: 1,
    blurb: '直接证明、逆否、反证、分情况与构造法：先判断该用哪一种，再把证明写成可检查的链条。' },
  { id: 'ch03', num: '03', title: '集合、关系与函数', en: 'SETS, RELATIONS & FUNCTIONS', part: 'Part III · 深入', week: 4, minutes: 90, icon: 'layers', labs: 1,
    blurb: '集合运算、二元关系的自反性与传递性、等价类与偏序、单射满射与基数，为计数和图论打地基。' },
  { id: 'ch04', num: '04', title: '数论与同余', en: 'NUMBER THEORY & CONGRUENCES', part: 'Part III · 深入', week: 5, minutes: 90, icon: 'grid', labs: 1,
    blurb: '整除、gcd 与贝祖等式、模逆、一次同余方程与中国剩余定理，一路走到 RSA 的算法骨架。' },
  { id: 'ch05', num: '05', title: '归纳法与递推关系', en: 'INDUCTION & RECURRENCE', part: 'Part III · 深入', week: 6, minutes: 100, icon: 'repeat', labs: 1,
    blurb: '数学归纳、强归纳、结构归纳与最小反例，建立递推式并用特征根、生成函数求出闭式。' },
  { id: 'ch06', num: '06', title: '计数与组合', en: 'COUNTING & COMBINATORICS', part: 'Part IV · 综合', week: 7, minutes: 100, icon: 'chart', labs: 1,
    blurb: '加法与乘法原理、排列组合、二项式定理、容斥与鸽巢，把「有多少种」变成能算的公式。' },
  { id: 'ch07', num: '07', title: '图论与树', en: 'GRAPHS & TREES', part: 'Part IV · 综合', week: 8, minutes: 110, icon: 'star', labs: 1,
    blurb: '图与树的术语、连通与度数、欧拉与哈密顿回路、最小生成树、最短路、哈斯图与偏序可视化。' }
]);
