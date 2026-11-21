/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'mat2041',
  short: 'MAT2041',
  name: '线性代数与应用',
  en: 'Linear Algebra and Applications',
  dept: '数学与优化',
  lang: 'text',
  langLabel: '代数',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'MAT2041 // VECTOR SPACE',
  bootLog: [
    '> mounting course partition ... MAT2041',
    '> loading 8 modules ... vectors, systems, matrices, spaces',
    '> calibrating determinants, eigenvalues & SVD ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '从一条向量出发，走到 SVD。',
  missionEn: 'MAT2041 · 8 MODULES',
  missionTitle: '从向量到 SVD<br><em>线性代数 全掌握</em>',
  lede: '按「向量 → 方程组 → 矩阵 → 空间 → 变换 → 特征值 → SVD」推进：每章有概念、手算例子、对比表、常见错误与自检清单，并配套分章题库、模拟卷与证明项目。',
  searchPlaceholder: 'QUERY // 搜索本站章节、术语与题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/MAT2041/',
  resources: {
    note: '收录 MAT2041 的往年考试、作业与解答、专题练习；文件名保持原始拼写，点击后用系统默认程序打开。',
    groups: [
      { name: '考试资料', note: '期中、期末与样卷，均带解答或评分参考；建议限时闭卷后再看答案。', items: [
        { title: '2023 期末（含解答）', path: '考试资料/MAT2041_2023_Final_WithSolution.pdf', kind: 'pdf', note: '行列式、LU、特征值、SVD 与证明题' },
        { title: '2023 期中（含解答）', path: '考试资料/MAT2041_2023_Midterm_WithSolution.pdf', kind: 'pdf', note: '方程组、秩、子空间与矩阵代数' },
        { title: '2023 期末样卷', path: '考试资料/MAT2041_2023_Sample_Final.pdf', kind: 'pdf', note: '最小二乘、SVD、正定矩阵与动力系统' },
        { title: '2023 期中样卷', path: '考试资料/MAT2041_2023_Sample_Midterm.pdf', kind: 'pdf', note: '基础计算与概念判断，适合首轮自测' }
      ] },
      { name: '作业与解答', note: '按作业编号排列；blank/updated 为题目，Solution/sols 为参考解答。', items: [
        { title: 'Assignment 01 · 题目', path: '作业习题/MAT2041_Assignment_01_blank_updated.pdf', kind: 'pdf', note: '点积、范数、三角不等式与编码' },
        { title: 'Assignment 01 · 解答', path: '作业习题/MAT2041_Assignment_01_Solution.pdf', kind: 'pdf', note: '含证明写法与常见错误' },
        { title: 'Assignment 02 · 题目', path: '作业习题/MAT2041_Assignment_02_updated.pdf', kind: 'pdf', note: '方程组、RREF 与解的结构' },
        { title: 'Assignment 02 · 解答', path: '作业习题/MAT2041_Assignment_02_Solution.pdf', kind: 'pdf', note: '参数形式与秩判据' },
        { title: 'Assignment 03', path: '作业习题/MAT2041_Assignment_03_V1021.pdf', kind: 'pdf', note: '矩阵代数、逆与分块运算' },
        { title: 'Assignment 05 · 题目', path: '作业习题/MAT2041_Assignment_05.pdf', kind: 'pdf', note: '子空间、基与维数' },
        { title: 'Assignment 05 · 解答', path: '作业习题/MAT2041_Assignment_05_sols.pdf', kind: 'pdf', note: '基的构造与维数计算' },
        { title: 'Assignment 06 · 题目', path: '作业习题/MAT2041_Assignment_06.pdf', kind: 'pdf', note: '线性变换、核与像' },
        { title: 'Assignment 06 · 解答', path: '作业习题/MAT2041_4_Assignment6_With_Solution.pdf', kind: 'pdf', note: '变换矩阵与换基' },
        { title: 'Assignment 07 · 题目', path: '作业习题/MAT2041_Assignment_07.pdf', kind: 'pdf', note: '特征值、对角化与正交性' },
        { title: 'Assignment 07 · 修订版', path: '作业习题/MAT2041_Assignment_07_v2.pdf', kind: 'pdf', note: '修订后的题面，优先使用此版' }
      ] },
      { name: '专题与复习', note: '编号较特殊的作业与专题包，适合按主题补练。', items: [
        { title: 'Assignment 4 专题', path: '学习资料/MAT2041_Assingment4.pdf', kind: 'pdf', note: '原文件名拼写为 Assingment，内容为第四次作业' },
        { title: 'HW4 专题练习', path: '作业习题/MAT2041_23_HW4_3.pdf', kind: 'pdf', note: '矩阵与子空间的综合练习' },
        { title: 'HW3 专题练习', path: '作业习题/MAT2041_HW_03_4.pdf', kind: 'pdf', note: '方程组与秩的强化训练' }
      ] }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', 'MAT2041 线性代数与应用（Linear Algebra and Applications）'],
    ['来源', 'CUHKSZ MAT2041 课程资料：讲义、作业、期中期末与样卷'],
    ['结构', '8 章正文 · 分章题库 · 模拟卷 · 证明项目 · 资料库'],
    ['建议', '先读第 0 章建立地图，再按顺序推进；每章的表格与自检清单不要跳过。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    {
      label: '向量与内积',
      blocks: [
        { t: 'table', caption: '基本公式', head: ['对象', '公式', '备注'], rows: [
          ['点积', 'u · v = Σuᵢvᵢ', '对称、对每元线性、正定'],
          ['长度', '‖u‖ = √(u · u)', '非负；只有零向量长度为零'],
          ['距离', '‖u − v‖', '平移不变'],
          ['夹角', 'cos θ = u · v / (‖u‖‖v‖)', 'CS 保证比值在 [−1, 1]'],
          ['Cauchy–Schwarz', '|u · v| ≤ ‖u‖‖v‖', '取等 ⇔ 线性相关'],
          ['三角不等式', '‖u + v‖ ≤ ‖u‖ + ‖v‖', '取等 ⇔ 同向'],
          ['反向三角', '|‖u‖ − ‖v‖| ≤ ‖u − v‖', '取等 ⇔ 反向'],
          ['投影', 'p = a(aᵀb)/(aᵀa)', '残差 b − p 与 a 正交']
        ] },
        { t: 'callout', kind: 'tip', title: '考场速记', html: '看到「证明不等式」先平方；看到「投影」先写残差正交；看到「夹角」先算点积与两个长度。正交向量组自动线性无关，因为与其中一个做内积就能逼出系数为零。' }
      ]
    },
    {
      label: '方程组与秩',
      blocks: [
        { t: 'table', caption: '解的存在性与唯一性', head: ['条件', '结论', '几何'], rows: [
          ['rank(A) < rank([A|b])', '无解', 'b 不在 C(A)'],
          ['两个秩相等且 rank = n', '唯一解', '超平面交于一点'],
          ['两个秩相等且 rank < n', '无穷多解', '解集为 xₚ + N(A)'],
          ['齐次 Ax = 0', '必有零解', '非零解 ⇔ rank < n'],
          ['A 满列秩', '至多一个解', 'N(A) = {0}'],
          ['A 满行秩', '对每个 b 都有解', 'C(A) = ℝᵐ']
        ] },
        { t: 'table', caption: 'RREF 读法', head: ['看到什么', '说明什么', '下一步'], rows: [
          ['主元列', '基本变量', '其余列为自由变量'],
          ['自由列', '参数', '每个自由变量给一个基向量'],
          ['全零行 + 非零右端', '矛盾', '立即写无解'],
          ['全零行 + 零右端', '冗余方程', '继续读主元']
        ] },
        { t: 'callout', kind: 'warn', title: '别做列变换', html: '解方程只允许三类行变换。列变换会改变未知数的含义，除「交换两列并同步交换变量名」外都不保持解集。行变换保持解集，但不保持列空间，求列空间基要回到原矩阵取主元列。' }
      ]
    },
    {
      label: '矩阵与 LU',
      blocks: [
        { t: 'table', caption: '运算律', head: ['运算', '规则', '注意'], rows: [
          ['转置', '(AB)ᵀ = BᵀAᵀ', '顺序反转'],
          ['逆', '(AB)⁻¹ = B⁻¹A⁻¹', '顺序反转；A + B 无公式'],
          ['2×2 逆', '[[a,b],[c,d]]⁻¹ = 1/(ad−bc)[[d,−b],[−c,a]]', 'det 为零则不可逆'],
          ['分块上三角', '[[B,C],[0,E]]⁻¹ = [[B⁻¹, −B⁻¹CE⁻¹],[0,E⁻¹]]', '右上块顺序不能换'],
          ['LU', 'A = LU，L 单位下三角', 'L 存乘数，U 存主元'],
          ['行列式', 'det(AB) = det A det B', 'det(A+B) 无此公式']
        ] },
        { t: 'table', caption: '可逆的等价说法', head: ['说法', '等价于'], rows: [
          ['rank(A) = n', '列满秩'],
          ['N(A) = {0}', 'Ax = 0 只有零解'],
          ['RREF(A) = I', '行变换可化到单位矩阵'],
          ['det(A) ≠ 0', '行列式非零'],
          ['Ax = b 对每个 b 唯一解', '列空间为整个 ℝⁿ']
        ] },
        { t: 'callout', kind: 'tip', title: '算逆的顺序', html: '用 [A | I] 化到 [I | A⁻¹] 时，每一步都要同时对左右两半做。求分块逆时先确认对角块可逆，再套公式；不确定就用乘法验算，尤其是右上块的符号。' }
      ]
    },
    {
      label: '特征值与对角化',
      blocks: [
        { t: 'table', caption: '行列式与特征值', head: ['量', '公式 / 性质', '用途'], rows: [
          ['行列式', 'det(A − λI) = 0 的根为特征值', '求特征值'],
          ['迹', 'tr(A) = Σλᵢ', '核对特征值'],
          ['行列式', 'det(A) = Πλᵢ', '核对特征值'],
          ['三角矩阵', '特征值 = 对角线元素', '免展开'],
          ['相似', '特征多项式相同', '迹、det、特征值不变'],
          ['对称矩阵', '特征值实，特征向量正交', '可正交对角化']
        ] },
        { t: 'table', caption: '对角化检查', head: ['条件', '结论'], rows: [
          ['n 个互异特征值', '一定可对角化'],
          ['每个特征值几何重数 = 代数重数', '可对角化'],
          ['存在几何重数 < 代数重数', '不可对角化'],
          ['实对称', '一定可正交对角化'],
          ['A = PDP⁻¹', 'Aᵏ = PDᵏP⁻¹']
        ] },
        { t: 'callout', kind: 'warn', title: '两个高频错误', html: '第一，特征向量不能是零向量；λ = 0 是合法特征值，对应不可逆。第二，特征值重复不等于不可对角化，单位矩阵就只有一个特征值却已经对角；要看特征向量够不够。' }
      ]
    },
    {
      label: '正交、最小二乘与 SVD',
      blocks: [
        { t: 'table', caption: '投影与最小二乘', head: ['对象', '公式', '检查'], rows: [
          ['标准正交基投影', 'P = QQᵀ', 'QᵀQ = I'],
          ['一般基投影', 'P = A(AᵀA)⁻¹Aᵀ', 'A 列满秩'],
          ['正规方程', 'AᵀAx = Aᵀb', 'Aᵀ(b − Ax) = 0'],
          ['最小二乘解', 'x̂ = (AᵀA)⁻¹Aᵀb', '残差在 N(Aᵀ)'],
          ['QR 解法', 'Rx = Qᵀb', '回代，不用求逆']
        ] },
        { t: 'table', caption: 'SVD 一览', head: ['对象', '结论', '维数'], rows: [
          ['分解', 'A = UΣVᵀ', '任意 m×n 矩阵'],
          ['奇异值', 'σᵢ = √λᵢ(AᵀA)', '非零个数 = rank'],
          ['C(A)', 'U 的前 r 列', 'r'],
          ['N(Aᵀ)', 'U 的后 m − r 列', 'm − r'],
          ['R(A)', 'V 的前 r 列', 'r'],
          ['N(A)', 'V 的后 n − r 列', 'n − r'],
          ['低秩近似', 'Aₖ = Σᵢ₌₁ᵏ σᵢuᵢvᵢᵀ', '误差 σₖ₊₁']
        ] },
        { t: 'callout', kind: 'exam', title: 'SVD 题流程', html: '算 AᵀA → 求特征值与单位特征向量 → 取正平方根得 σ → 算 uᵢ = Avᵢ/σᵢ → 补全正交基 → 写 UΣVᵀ。四个子空间的基直接从 U、V 的前后段切，不要另起炉灶。' }
      ]
    }
  ]
};
