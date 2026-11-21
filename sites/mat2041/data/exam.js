/* =====================================================================
 * exam.js · MAT2041 模拟卷 A
 * 范围：ch00–ch07（向量与内积 / 方程组 / 矩阵代数 / 子空间 /
 *       线性变换 / 行列式与特征值 / 正交与 SVD）
 * 规格：12 题、满分 100、限时 90 分钟
 * 题型：choice / tf / fill / output / keywords
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerExam({
    id: 'MAT2041-A',
    title: '线性代数与应用 模拟卷 A',
    style: '期末风格',
    subtitle: 'MAT2041 · 覆盖 ch00–ch07 的综合模拟',
    date: '2026-11-21',
    minutes: 90,
    totalScore: 100,
    summary: '本卷覆盖七章全部内容：向量与内积、线性方程组、矩阵代数与 LU、四个基本子空间、' +
      '线性变换与换基、行列式与特征值、正交投影与 SVD。卷面 12 题：选择 2 题共 16 分、' +
      '判断 2 题共 16 分、填空 2 题共 16 分、读代码写输出 2 题共 16 分、' +
      '证明与简答 4 题共 36 分。建议闭卷限时完成，证明题先写「要证什么」，再写关键等式。',
    instructions: [
      '时间 90 分钟，满分 100 分。计时开始后不会暂停，刷新页面也按真实时间计算。',
      '题型：单项选择 4 小问、判断 4 小问、填空 4 小问、读代码写输出 2 题、证明与简答 4 题。',
      '选择题只有一个正确选项；判断题只需判断真假；填空题写关键表达式即可。',
      '读代码题按行比对输出，列表的方括号与逗号也要写对；证明题按关键词命中比例给分。',
      '所有矩阵均为实矩阵，向量默认为列向量，内积为标准欧氏内积。'
    ],
    questions: [

      /* ---------------------------------------------------------- Q1 */
      { no: 1, points: 8, type: 'single choice',
        intro: '本题考察线性方程组与秩。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '方程组 x + y = 3、x − y = 1 的解是：',
            options: [
              { text: '(2, 1)', correct: true },
              { text: '(1, 2)' },
              { text: '(3, 0)' },
              { text: '(0, 3)' }
            ],
            explain: '两式相加得 2x = 4，x = 2；代回得 y = 1。验算 2 + 1 = 3、2 − 1 = 1，成立。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '矩阵 A = [[1, 2, 1], [2, 4, 2], [0, 0, 1]] 的秩是多少？',
            options: [
              { text: '1' },
              { text: '2', correct: true },
              { text: '3' },
              { text: '0' }
            ],
            explain: '第二行是第一行的 2 倍，消元后变为零行；第一行与第三行线性无关，所以秩为 2。列数 3 大于秩，零空间一维。' }
        ] },

      /* ---------------------------------------------------------- Q2 */
      { no: 2, points: 8, type: 'true / false',
        intro: '判断下列陈述的真假。',
        parts: [
          { label: '(a)', points: 4, kind: 'tf',
            prompt: '初等行变换保持矩阵的列空间不变。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '行变换保持解集与行空间，但会改变列空间。反例：[[1,1],[1,1]] 的列空间是 y = x，化到 [[1,1],[0,0]] 后列空间是 x 轴。求列空间基要回到原矩阵取主元列。' },
          { label: '(b)', points: 4, kind: 'tf',
            prompt: '实对称矩阵属于不同特征值的特征向量互相正交。',
            options: [
              { text: '正确', correct: true },
              { text: '错误' }
            ],
            explain: '由 Av = λv、Aw = μw 与 Aᵀ = A，得 λvᵀw = (Av)ᵀw = vᵀAw = μvᵀw，所以 (λ − μ)vᵀw = 0。λ ≠ μ 时只能 vᵀw = 0。' }
        ] },

      /* ---------------------------------------------------------- Q3 */
      { no: 3, points: 8, type: 'fill in the blank',
        intro: '把答案写在横线处。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '一个 3×5 矩阵的秩为 2，则它的零空间维数是 ______。',
            answer: '3',
            accept: ['3', '三'],
            explain: '秩-零化度定理：nullity = n − rank = 5 − 2 = 3。零空间位于 ℝ⁵，有三个自由变量。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: 'det [[2, 1], [3, 4]] = ______。',
            answer: '5',
            accept: ['5', '五'],
            explain: '2×2 行列式 ad − bc = 2×4 − 1×3 = 5。行列式非零，矩阵可逆。' }
        ] },

      /* ---------------------------------------------------------- Q4 */
      { no: 4, points: 8, type: 'read the code',
        intro: '写出下面 Python 代码的输出；注意列表格式。',
        parts: [
          { label: '(a)', points: 4, kind: 'output',
            prompt: '程序输出是什么？',
            code: 'u = [1, 2, 2]\nv = [2, 0, 1]\nprint(sum(a * b for a, b in zip(u, v)), sum(x * x for x in u) ** 0.5)',
            answer: '4 3.0',
            accept: ['4 3.0', '4 3'],
            explain: '点积 1×2 + 2×0 + 2×1 = 4；范数 √(1 + 4 + 4) = 3.0。print 用空格分隔两个值。' },
          { label: '(b)', points: 4, kind: 'output',
            prompt: '程序输出是什么？',
            code: 'A = [[1, 2], [3, 4]]\nx = [1, 1]\nprint([sum(a * b for a, b in zip(row, x)) for row in A])',
            answer: '[3, 7]',
            accept: ['[3, 7]', '[3,7]', '3 7'],
            explain: '逐行做点积：第一行 1 + 2 = 3，第二行 3 + 4 = 7。这正是矩阵乘向量 Ax 的分量算法。' }
        ] },

      /* ---------------------------------------------------------- Q5 */
      { no: 5, points: 8, type: 'short proof',
        intro: '用两三句话写出关键理由，不必展开成完整论文。',
        parts: [
          { label: '(a)', points: 4, kind: 'keywords',
            prompt: '证明对任意方阵 A，N(A) ⊆ N(A²)。',
            keywords: ['Ax=0', 'A²x=A(Ax)=0', '包含', '定义'],
            explain: '设 x ∈ N(A)，则 Ax = 0。于是 A²x = A(Ax) = A0 = 0，所以 x ∈ N(A²)。按包含的定义，N(A) 的每个元素都在 N(A²) 中，故 N(A) ⊆ N(A²)。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '为什么求列空间的基不能直接取 RREF 的列？给出理由与正确做法。',
            keywords: ['行变换改变列空间', '回到原矩阵', '主元列', '反例'],
            explain: '行变换保持解集，但不保持列空间，RREF 的列通常不在原列空间中。正确做法是记录 RREF 的主元列号，再回到原矩阵 A 取对应位置的列；这些列线性无关且张成 C(A)。' }
        ] },

      /* ---------------------------------------------------------- Q6 */
      { no: 6, points: 8, type: 'single choice',
        intro: '本题考察子空间与特征值。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '下面哪个集合是 ℝ² 的子空间？',
            options: [
              { text: '直线 y = 2x', correct: true },
              { text: '直线 y = 2x + 1' },
              { text: '第一象限' },
              { text: '单位圆' }
            ],
            explain: '过原点的直线含零向量，且对加法与数乘封闭。y = 2x + 1 不过原点；第一象限对负数乘不封闭；单位圆对加法不封闭。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '上三角矩阵 [[3, 1], [0, 2]] 的特征值是：',
            options: [
              { text: '3 与 2', correct: true },
              { text: '1 与 6' },
              { text: '3 与 −2' },
              { text: '只有 3' }
            ],
            explain: '三角矩阵的特征值就是对角线元素：det(A − λI) = (3 − λ)(2 − λ)。对应特征向量为 (1, 0) 与 (1, −1)。' }
        ] },

      /* ---------------------------------------------------------- Q7 */
      { no: 7, points: 8, type: 'short answer',
        intro: '写出关键结果与参数形式。',
        parts: [
          { label: '(a)', points: 4, kind: 'keywords',
            prompt: '求 A = [[1, 2, 1], [2, 4, 3]]、b = (4, 9) 时 Ax = b 的通解。',
            keywords: ['(3,0,1)', '(−2,1,0)', '特解', '零空间', 't'],
            explain: '消元得 x₃ = 1、x₁ + 2x₂ = 3，所以特解 xₚ = (3, 0, 1)，齐次方向 (−2, 1, 0)，通解 x = (3, 0, 1) + t(−2, 1, 0)。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '判断 Ax = b 何时无解、唯一解、无穷多解，需要比较哪几个量？',
            keywords: ['rank(A)', 'rank([A|b])', 'n', '自由变量'],
            explain: '先比较 rank(A) 与 rank([A|b])：不等则无解，相等则有解。有解时再看 rank(A) 与未知数个数 n：相等则唯一，小于 n 则有无穷多解（存在自由变量）。' }
        ] },

      /* ---------------------------------------------------------- Q8 */
      { no: 8, points: 8, type: 'fill in the blank',
        intro: '把答案写在横线处。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '无行交换的 LU 分解中，单位下三角矩阵 L 的对角线元素全是 ______。',
            answer: '1',
            accept: ['1', '一'],
            explain: 'L 的对角线固定为 1，非对角元素是消元乘数；U 的对角线才是主元。若做行交换，则写成 PA = LU。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '相似矩阵 P⁻¹AP 与 A 一定共享的三个量是秩、迹和 ______。',
            answer: '行列式',
            accept: ['行列式', 'determinant', 'det', '特征值'],
            explain: 'det(P⁻¹AP) = det(P⁻¹)det(A)det(P) = det(A)，迹也相同，特征多项式相同，所以特征值相同。列空间通常不共享。' }
        ] },

      /* ---------------------------------------------------------- Q9 */
      { no: 9, points: 8, type: 'read the code',
        intro: '写出下面 Python 代码的输出。',
        parts: [
          { label: '(a)', points: 8, kind: 'output',
            prompt: '程序输出是什么？',
            code: 'A = [[2, 1], [1, 2]]\nx = [1, 2]\nfor _ in range(2):\n    x = [sum(a * b for a, b in zip(row, x)) for row in A]\nprint(x)',
            answer: '[13, 14]',
            accept: ['[13, 14]', '[13,14]', '13 14'],
            explain: '第一次：Ax = (2+2, 1+4) = (4, 5)。第二次：A(4, 5) = (8+5, 4+10) = (13, 14)。循环执行两次，所以不是一次的结果。' }
        ] },

      /* ---------------------------------------------------------- Q10 */
      { no: 10, points: 10, type: 'proof',
        intro: '写出证明的关键步骤，允许使用特征值方程。',
        parts: [
          { label: '(a)', points: 5, kind: 'keywords',
            prompt: '证明：若 A² = 0，则 A 的所有特征值都是 0。',
            keywords: ['Av=λv', 'A²v=λ²v', 'λ²=0', 'λ=0', 'v≠0'],
            explain: '设 Av = λv 且 v ≠ 0。两边再作用 A 得 A²v = λAv = λ²v。由 A² = 0 得 λ²v = 0，而 v ≠ 0，所以 λ² = 0，λ = 0。' },
          { label: '(b)', points: 5, kind: 'keywords',
            prompt: '证明：实对称矩阵属于不同特征值的特征向量正交。',
            keywords: ['λvᵀw', 'vᵀAᵀw', '(λ−μ)vᵀw=0', 'λ≠μ', 'vᵀw=0'],
            explain: '设 Av = λv、Aw = μw，λ ≠ μ。由 Aᵀ = A，λvᵀw = (Av)ᵀw = vᵀAᵀw = vᵀAw = μvᵀw。移项得 (λ − μ)vᵀw = 0，故 vᵀw = 0。' }
        ] },

      /* ---------------------------------------------------------- Q11 */
      { no: 11, points: 8, type: 'single choice',
        intro: '本题考察 SVD 与投影。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '关于矩阵 A 的 SVD，下面哪条正确？',
            options: [
              { text: '非零奇异值的个数等于 rank(A)', correct: true },
              { text: '奇异值一定等于特征值' },
              { text: '只有可逆矩阵才有 SVD' },
              { text: 'Σ 一定是方阵' }
            ],
            explain: 'Σ 的非零对角元个数就是秩。奇异值是 AᵀA 特征值的平方根，一般不等于特征值；任意矩阵都有 SVD；Σ 与 A 同型，不一定是方阵。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: 'b = (3, 1) 在直线 span{(1, 1)} 上的正交投影是：',
            options: [
              { text: '(2, 2)', correct: true },
              { text: '(1, 1)' },
              { text: '(3, 1)' },
              { text: '(1, −1)' }
            ],
            explain: '投影矩阵 P = (1/2)[[1,1],[1,1]]，Pb = (2, 2)。残差 (1, −1) 与 (1, 1) 点积为零，确为垂足。' }
        ] },

      /* ---------------------------------------------------------- Q12 */
      { no: 12, points: 10, type: 'short answer',
        intro: '写出公式与几何解释。',
        parts: [
          { label: '(a)', points: 5, kind: 'keywords',
            prompt: '写出最小二乘的正规方程，并用投影解释残差的性质。',
            keywords: ['AᵀAx=Aᵀb', '残差', 'C(A)', '正交', '投影'],
            explain: '正规方程 AᵀAx = Aᵀb。几何上，Ax̂ 是 b 在 C(A) 上的正交投影，残差 r = b − Ax̂ 与 C(A) 正交，即 Aᵀr = 0；这正是正规方程的来源。' },
          { label: '(b)', points: 5, kind: 'keywords',
            prompt: '写出 rank-k 截断 SVD 的表达式，并指出它与原矩阵的谱范数误差。',
            keywords: ['Σσᵢuᵢvᵢᵀ', 'i=1到k', 'σₖ₊₁', 'Eckart–Young', '最佳秩k近似'],
            explain: 'Aₖ = Σᵢ₌₁ᵏ σᵢuᵢvᵢᵀ。Eckart–Young 定理说它是所有秩不超过 k 的矩阵中离 A 最近的，‖A − Aₖ‖₂ = σₖ₊₁。' }
        ] }
    ]
  });
})();
