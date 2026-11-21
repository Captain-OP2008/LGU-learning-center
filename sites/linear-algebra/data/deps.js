/* =====================================================================
 * data/deps.js · 线性代数学习站 · 章节依赖图数据
 * 15 个节点（ch00–ch14）+ 29 条有向边（强 7 / 中 15 / 弱 7）
 * 依据 .work/la-site/OUTLINE.md §四「依赖图」：
 *   边 A → B 表示「先学 A，再学 B」；强度 强 / 中 / 弱。
 *   强 = 不学前置几乎无法继续；中 = 核心内容或大量例题借用；
 *   弱 = 工具性引用、回顾性阅读或个别例子用到。
 * 图性质：无环有向图（DAG），且对每条边都做过「反向不重复」的对称校验。
 *
 * 与 OUTLINE §四 的两点必要微调（均为保证无环，已在任务里报备）：
 *   1) OUTLINE 写「ch13 → ch01/ch02/ch03（弱）」，但 ch13 本身又由
 *      ch05/ch06/ch07/ch08 汇入，而 ch01→ch02→ch05→ch13 已构成通路，
 *      这三条反向边会立刻造出环。这里按「附录汇总在分解之后读」的语义
 *      保留 ch05/ch06/ch07/ch08 → ch13 四条弱边，去掉那三条回指边。
 *   2) OUTLINE 说 ch14「孤立工具节点（或 ch00 → ch14 弱）」，这里取后者，
 *      让公式速查表从总览页可达。
 * 其余边与 OUTLINE §四 逐条一致。
 * ===================================================================== */
CSC.registerDeps({
  nodes: [
    { id: 'ch00', num: '00', title: '总览与学习路线', en: 'Overview & Study Routes', part: 'Part I · 向量的语言' },
    { id: 'ch01', num: '01', title: '向量导论', en: 'Introduction to Vectors', part: 'Part I · 向量的语言' },
    { id: 'ch02', num: '02', title: '解线性方程组', en: 'Solving Linear Equations', part: 'Part I · 向量的语言' },

    { id: 'ch03', num: '03', title: '向量空间与子空间', en: 'Vector Spaces and Subspaces', part: 'Part II · 子空间与正交' },
    { id: 'ch04', num: '04', title: '正交性', en: 'Orthogonality', part: 'Part II · 子空间与正交' },
    { id: 'ch05', num: '05', title: '行列式', en: 'Determinants', part: 'Part II · 子空间与正交' },

    { id: 'ch06', num: '06', title: '特征值与特征向量', en: 'Eigenvalues and Eigenvectors', part: 'Part III · 特征与分解' },
    { id: 'ch07', num: '07', title: '奇异值分解', en: 'The Singular Value Decomposition', part: 'Part III · 特征与分解' },
    { id: 'ch08', num: '08', title: '线性变换', en: 'Linear Transformations', part: 'Part III · 特征与分解' },

    { id: 'ch09', num: '09', title: '复向量与复矩阵', en: 'Complex Vectors and Matrices', part: 'Part IV · 复数、应用与数值' },
    { id: 'ch10', num: '10', title: '应用', en: 'Applications', part: 'Part IV · 复数、应用与数值' },
    { id: 'ch11', num: '11', title: '数值线性代数', en: 'Numerical Linear Algebra', part: 'Part IV · 复数、应用与数值' },
    { id: 'ch12', num: '12', title: '概率统计中的线性代数', en: 'Linear Algebra in Probability & Statistics', part: 'Part IV · 复数、应用与数值' },
    { id: 'ch13', num: 'A', title: '附录：矩阵分解与六大定理', en: 'Matrix Factorizations & Six Great Theorems', part: 'Part IV · 复数、应用与数值' },
    { id: 'ch14', num: 'F', title: '全书公式速查表', en: 'Formula Reference', part: 'Part IV · 复数、应用与数值' }
  ],

  edges: [
    /* ---------------- 起点：总览 ---------------- */
    ['ch00', 'ch01', '中'],

    /* ---------------- Part I：向量 → 方程组 ---------------- */
    ['ch01', 'ch02', '强'],
    ['ch02', 'ch03', '强'],
    ['ch01', 'ch03', '中'],
    ['ch02', 'ch05', '中'],

    /* ---------------- Part II：子空间 → 正交 → 行列式 ---------------- */
    ['ch03', 'ch04', '强'],
    ['ch03', 'ch05', '弱'],
    ['ch04', 'ch06', '中'],
    ['ch05', 'ch06', '强'],

    /* ---------------- Part III：特征值 → SVD → 变换 ---------------- */
    ['ch06', 'ch07', '强'],
    ['ch04', 'ch07', '强'],
    ['ch03', 'ch08', '强'],
    ['ch06', 'ch08', '中'],

    /* ---------------- Part IV：复数、应用、数值、统计 ---------------- */
    ['ch04', 'ch09', '中'],
    ['ch06', 'ch09', '中'],
    ['ch07', 'ch09', '中'],
    ['ch06', 'ch10', '中'],
    ['ch07', 'ch10', '中'],
    ['ch02', 'ch11', '中'],
    ['ch04', 'ch11', '中'],
    ['ch05', 'ch11', '弱'],
    ['ch04', 'ch12', '中'],
    ['ch06', 'ch12', '中'],
    ['ch07', 'ch12', '中'],

    /* ---------------- 附录与工具 ---------------- */
    ['ch05', 'ch13', '弱'],
    ['ch06', 'ch13', '弱'],
    ['ch07', 'ch13', '弱'],
    ['ch08', 'ch13', '弱'],
    ['ch00', 'ch14', '弱']
  ]
});
