/* =====================================================================
 * quiz.js · MAT2041 分章题库
 * 结构：{ items:[{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options?, answer?, accept?, code?, explain }] }
 * 题型：mcq / tf / multi / fill / predict
 * 覆盖：ch00–ch07，每章 7 题，共 49 题
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '课程资料（讲义、作业、往年卷）显示 MAT2041 的实际主题是什么？',
        options: [
          { text: '数学分析：极限、连续、微分与积分' },
          { text: '线性代数及其应用：向量、矩阵、子空间、特征值与 SVD', correct: true },
          { text: '概率论与数理统计' },
          { text: '复变函数与积分变换' }
        ],
        explain: '课程 PDF 明确写 Linear Algebra and Applications；作业与考试围绕线性方程组、矩阵、四个基本子空间、特征值与奇异值展开。门户沿用了「数学分析」这个名字，但本站内容以真实资料为准。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '线性代数的题目只要算出数值答案就够了，证明步骤不影响得分。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '本课程大量题目要求「证明或给出反例」，例如证明 N(A) ⊆ N(A²)、证明相似矩阵行列式相同、判断命题真假。只写答案无法展示推理，过程分往往占大头。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '本站把七章内容串成一条主线，下面哪条最准确？',
        options: [
          { text: '向量与内积 → 方程组 → 矩阵代数 → 子空间 → 线性变换 → 特征值 → 正交与 SVD', correct: true },
          { text: '导数 → 积分 → 级数 → 微分方程' },
          { text: '集合 → 映射 → 群环域 → 伽罗瓦理论' },
          { text: '随机变量 → 分布 → 期望 → 大数定律' }
        ],
        explain: '七章是一条递进链：先有长度与夹角（ch01），再解方程（ch02），把运算结构化（ch03），抽象出空间与维数（ch04），升级为变换（ch05），找不变量（ch06），最后用正交分解收束（ch07）。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-1', tier: 2, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '门户课程名写作「数学分析」，与资料实际主题不一致；本站选择按真实资料写线性代数。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '这是本站明确说明的处理：courses.json 的 title 保持「数学分析」不改，但章节、题库、项目全部依据 MAT2041 的真实 PDF 写线性代数，避免内容与资料脱节。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '第 7 章的核心分解把任意矩阵写成 UΣVᵀ，这个分解的英文缩写是 ______。',
        answer: 'SVD',
        accept: ['SVD', '奇异值分解', 'singular value decomposition', 'Singular Value Decomposition'],
        explain: 'SVD 即奇异值分解：U、V 是正交矩阵，Σ 的对角线是非负奇异值。它对任意 m×n 矩阵都存在，是本章综合前面所有工具的地方。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'multi', difficulty: 1,
        tags: ['concept'],
        stem: '本站希望读者形成哪些能力？（多选）',
        options: [
          { text: '把几何问题翻译成矩阵计算', correct: true },
          { text: '写出结构清晰的证明，而不只是算答案', correct: true },
          { text: '用维数、秩、正交性解释「为什么」', correct: true },
          { text: '背下所有公式，不理解来源' }
        ],
        explain: '三门能力对应三种题型：计算题要会把几何翻成代数，证明题要会写逻辑链，概念题要会用不变量解释现象。纯背诵在遇到变形题时会失效。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 2, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '矩阵 A 的四个基本子空间中，位于 ℝⁿ 且由 Ax = 0 的解组成的是 ______。',
        answer: '零空间',
        accept: ['零空间', 'N(A)', 'null space', 'Null space', '核'],
        explain: '零空间 N(A) = {x : Ax = 0}，位于 ℝⁿ，维数为 n − rank(A)。另外三个是列空间（ℝᵐ）、行空间（ℝⁿ）、左零空间（ℝᵐ）。'
      },

      /* ---------------- ch01 向量、内积与范数 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['compute'],
        stem: '设 u = (1, 2)、v = (3, −1)，则 u · v 等于多少？',
        options: [
          { text: '1', correct: true },
          { text: '5' },
          { text: '−1' },
          { text: '7' }
        ],
        explain: '点积按分量相乘再相加：1×3 + 2×(−1) = 3 − 2 = 1。注意第二项是负数，不要写成 3 + 2。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['compute'],
        stem: '向量 (3, 4) 的欧氏长度是多少？',
        options: [
          { text: '5', correct: true },
          { text: '7' },
          { text: '25' },
          { text: '√7' }
        ],
        explain: '‖(3, 4)‖ = √(3² + 4²) = √25 = 5。长度是各分量平方和的平方根，不是分量之和。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '若 u · v = 0，则 u 与 v 中至少有一个是零向量。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '正交只要求内积为零，非零向量也可以垂直。例如 (1, 0) 与 (0, 1) 的内积为 0，但两个都不是零向量。零向量与所有向量正交，但不能反过来说。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '两个非零向量的夹角满足 cos θ = u · v / (‖u‖ · ______)。',
        answer: '‖v‖',
        accept: ['‖v‖', '||v||', 'v的范数', 'v 的范数', '|v|'],
        explain: '余弦公式的分母是两个向量长度的乘积。由 Cauchy–Schwarz 不等式，比值落在 [−1, 1] 内，所以夹角有定义。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-2', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '实向量点积满足下面哪些性质？（多选）',
        options: [
          { text: '对称性：u · v = v · u', correct: true },
          { text: '对第一变元线性：(cu + dw) · v = c(u · v) + d(w · v)', correct: true },
          { text: '正定性：u · u ≥ 0，且等号只在 u = 0 时成立', correct: true },
          { text: '结合律：(u · v) · w = u · (v · w)' }
        ],
        explain: '点积的结果是标量，所以「(u·v)·w」只是数乘向量，而「u·(v·w)」是另一个方向，谈结合律没有意义。前三条正是内积公理。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: 'u = [1, 2, 2]\nprint(sum(x * x for x in u) ** 0.5)',
        stem: '这段 Python 代码输出什么？',
        answer: '3.0',
        accept: ['3.0', '3'],
        explain: 'sum 计算 1 + 4 + 4 = 9，再开平方得 3.0。这正是欧氏范数的计算方式：先平方和，再开根号。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-6', tier: 3, type: 'fill', difficulty: 2,
        tags: ['proof'],
        stem: 'Cauchy–Schwarz 不等式 |u · v| ≤ ‖u‖‖v‖ 取等号，当且仅当 u 与 v ______。',
        answer: '线性相关',
        accept: ['线性相关', '成比例', '共线', '平行', '其中一个为零向量'],
        explain: '取等条件是两个向量位于同一条直线上，即线性相关（含有一个为零向量的情形）。证明来自判别式 ‖u + tv‖² ≥ 0 的二次式判别式非正。'
      },

      /* ---------------- ch02 线性方程组与高斯消元 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['compute'],
        stem: '方程组 x + y = 3、x − y = 1 的解是什么？',
        options: [
          { text: '(2, 1)', correct: true },
          { text: '(1, 2)' },
          { text: '(3, 0)' },
          { text: '(0, 3)' }
        ],
        explain: '两式相加得 2x = 4，所以 x = 2；代回得 y = 1。验算：2 + 1 = 3，2 − 1 = 1，正确。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-7', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '设 A 是 m×n 矩阵。Ax = b 有唯一解，需要满足什么条件？',
        options: [
          { text: 'rank(A) = rank([A|b]) = n', correct: true },
          { text: 'rank(A) = rank([A|b]) 小于 n' },
          { text: 'rank(A) 小于 rank([A|b])' },
          { text: 'm 小于 n 且 b 任意' }
        ],
        explain: '两个秩相等保证有解；秩等于未知数个数 n 保证没有自由变量，所以唯一。若秩小于 n，则有无穷多解；若两个秩不等，则无解。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '对矩阵做初等行变换会保持它的列空间不变。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '行变换保持的是行空间与解集，不保持列空间。例如 [[1,1],[1,1]] 的列空间是直线 y = x，化到 [[1,1],[0,0]] 后列空间变成 x 轴。求列空间基时必须回到原矩阵取主元列。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-6', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '若 xₚ 是 Ax = b 的一个特解，则通解可以写成 x = xₚ + xₕ，其中 xₕ 属于 ______。',
        answer: '零空间',
        accept: ['零空间', 'N(A)', 'null space', 'Ax=0的解空间', '齐次解空间'],
        explain: '两个解的差满足 A(x − xₚ) = b − b = 0，所以差在零空间。反过来，特解加任意齐次解仍是解，因此解集是 xₚ + N(A)。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些条件能保证齐次方程 Ax = 0 有非零解？（多选）',
        options: [
          { text: 'A 是 2×3 矩阵', correct: true },
          { text: 'A 有一列全为零', correct: true },
          { text: 'rank(A) 小于未知数个数 n', correct: true },
          { text: 'A 是 n×n 可逆矩阵' }
        ],
        explain: '齐次方程有非零解 ⇔ rank(A) < n。2×3 时秩至多 2 小于 3；有零列时列相关；秩小于 n 是定义。可逆方阵的零空间只有零向量，是唯一解。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'fill', difficulty: 2,
        tags: ['compute'],
        stem: '一个 3×5 矩阵的秩为 2，则它的零空间维数是 ______。',
        answer: '3',
        accept: ['3', '三'],
        explain: '秩-零化度：nullity = n − rank = 5 − 2 = 3。自由变量有 3 个，所以零空间是三维的。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '增广矩阵消元后若出现形如「0 0 … 0 | c」（c ≠ 0）的行，则方程组 ______。',
        answer: '无解',
        accept: ['无解', '没有解', '不相容', 'inconsistent'],
        explain: '这一行对应方程 0 = c，矛盾，所以无解。等价说法是 rank(A) 小于 rank([A|b])。'
      },

      /* ---------------- ch03 矩阵代数、逆与 LU ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '对任意可乘的矩阵 A、B，(AB)ᵀ 等于什么？',
        options: [
          { text: 'BᵀAᵀ', correct: true },
          { text: 'AᵀBᵀ' },
          { text: 'AB' },
          { text: 'BA' }
        ],
        explain: '转置反转乘积顺序：先 A 后 B，转置后先 Bᵀ 后 Aᵀ。用元素比较可证：(AB)ᵀ 的 (i,j) 元素等于 A 第 j 行与 B 第 i 列的点积，正是 BᵀAᵀ 的 (i,j) 元素。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['compute'],
        stem: 'A = [[1, 2], [3, 4]] 的逆是什么？',
        options: [
          { text: '[[−2, 1], [1.5, −0.5]]', correct: true },
          { text: '[[4, −2], [−3, 1]]' },
          { text: '[[−2, 1.5], [1, −0.5]]' },
          { text: '[[4, −3], [−2, 1]]' }
        ],
        explain: 'det = 1×4 − 2×3 = −2，A⁻¹ = (1/−2)[[4, −2], [−3, 1]] = [[−2, 1], [1.5, −0.5]]。验算第一行乘 A：(−2)×1 + 1×3 = 1，(−2)×2 + 1×4 = 0。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '若 A、B 都可逆，则 (A + B)⁻¹ = A⁻¹ + B⁻¹。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '逆对加法没有分配律。取 B = −A，则 A + B = 0 不可逆，右边却是 2A⁻¹，明显不成立。正确的反序规则只对乘积成立：(AB)⁻¹ = B⁻¹A⁻¹。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-5', tier: 3, type: 'fill', difficulty: 3,
        tags: ['compute'],
        stem: '分块上三角矩阵 [[B, C], [0, E]] 的逆中，右上块是 ______（用 B、C、E 的逆表示）。',
        answer: '−B⁻¹CE⁻¹',
        accept: ['−B⁻¹CE⁻¹', '-B⁻¹CE⁻¹', '-B^(-1)CE^(-1)', '−B^{-1}CE^{-1}', '-B^{-1}CE^{-1}', '−B⁻¹ C E⁻¹'],
        explain: '设逆为 [[X, Y], [0, Z]]，相乘得 X = B⁻¹、Z = E⁻¹，右上块满足 BY + CE⁻¹ = 0，所以 Y = −B⁻¹CE⁻¹。顺序不能换。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '对 n×n 矩阵 A，下面哪些条件等价于 A 可逆？（多选）',
        options: [
          { text: 'rank(A) = n', correct: true },
          { text: 'N(A) = {0}', correct: true },
          { text: 'RREF(A) = I', correct: true },
          { text: 'det(A) = 0' }
        ],
        explain: '可逆 ⇔ 满秩 ⇔ 零空间只有零 ⇔ 行最简形为单位矩阵 ⇔ 行列式非零。det(A) = 0 恰好是可逆的反面，矩阵奇异。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '在无行交换的 LU 分解中，L 是单位下三角矩阵，它的对角线元素全是 ______。',
        answer: '1',
        accept: ['1', '一'],
        explain: '单位下三角的意思是下三角且对角线全为 1。L 的非对角元素是消元乘数，U 的对角线才是主元，不一定是 1。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-1', tier: 3, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '若 AB = 0，则一定有 A = 0 或 B = 0。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '矩阵有零因子。取 A = [[1, 0], [0, 0]]、B = [[0, 0], [1, 0]]，则 AB = 0，但 A、B 都不为零。正确结论是 C(B) ⊆ N(A)。'
      },

      /* ---------------- ch04 向量空间、基与四个基本子空间 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '下面哪个集合是 ℝ² 的子空间？',
        options: [
          { text: '直线 y = 2x', correct: true },
          { text: '直线 y = 2x + 1' },
          { text: '第一象限' },
          { text: '单位圆' }
        ],
        explain: '过原点的直线含零向量，且对加法与数乘封闭，是子空间。y = 2x + 1 不过原点；第一象限对负数乘不封闭；单位圆对加法不封闭。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-7', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['compute'],
        stem: '一个 2×4 矩阵的秩为 2，它的零空间维数是多少？',
        options: [
          { text: '2', correct: true },
          { text: '0' },
          { text: '4' },
          { text: '1' }
        ],
        explain: 'nullity = n − rank = 4 − 2 = 2。零空间位于 ℝ⁴，有两个自由变量，所以是二维的。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '初等行变换保持矩阵的行空间不变。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '行变换把新行写成旧行的线性组合，且操作可逆，所以行空间不变。因此 RREF 的非零行可以作为行空间的基。注意列空间不保持。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-8', tier: 2, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '两个子空间 U、W 满足 dim(U + W) = dim U + dim W − dim(______)。',
        answer: 'U∩W',
        accept: ['U∩W', 'U ∩ W', 'U交W', '交集'],
        explain: '这是子空间维数公式：分别数 U 与 W 的维数时，交集被数了两次，所以减掉一次。当交集为零时，和是直和，维数直接相加。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '设 A 是 m×n 矩阵，rank(A) = r。下面哪些维数对应正确？（多选）',
        options: [
          { text: 'dim C(A) = r', correct: true },
          { text: 'dim N(A) = n − r', correct: true },
          { text: 'dim R(A) = r', correct: true },
          { text: 'dim N(Aᵀ) = n − r' }
        ],
        explain: '左零空间 N(Aᵀ) 位于 ℝᵐ，维数是 m − r，不是 n − r。其余三个都正确：列空间与行空间维数都是 r，零空间是 n − r。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '把 A 化到 RREF 后，主元所在的列对应回原矩阵 A 的列，这些列构成 ______ 的一组基。',
        answer: '列空间',
        accept: ['列空间', 'C(A)', 'column space', '像空间'],
        explain: '行变换保持列之间的线性关系，所以主元列在原矩阵中线性无关，且张成整个列空间。注意不能直接取 RREF 的列，因为行变换改变列空间。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 3, type: 'tf', difficulty: 2,
        tags: ['proof'],
        stem: '对任意方阵 A，都有 N(A) ⊆ N(A²)。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '若 x ∈ N(A)，则 Ax = 0，于是 A²x = A(Ax) = A0 = 0，所以 x ∈ N(A²)。包含可能是真包含，例如 A = [[0,1],[0,0]] 时 N(A) 一维、N(A²) 二维。'
      },

      /* ---------------- ch05 线性变换与基变换 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '下面哪个映射 T: ℝ² → ℝ² 是线性变换？',
        options: [
          { text: 'T(x, y) = (2x, y)', correct: true },
          { text: 'T(x, y) = (x + 1, y)' },
          { text: 'T(x, y) = (x², y)' },
          { text: 'T(x, y) = (‖(x, y)‖, 0)' }
        ],
        explain: '线性要求 T(0) = 0 且保持加法与数乘。(x + 1, y) 把零送到 (1, 0)；(x², y) 不保数乘；范数不保数乘（‖−x‖ = ‖x‖ 而不是 −‖x‖）。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['compute'],
        stem: '逆时针旋转 90° 的标准矩阵是什么？',
        options: [
          { text: '[[0, −1], [1, 0]]', correct: true },
          { text: '[[1, 0], [0, −1]]' },
          { text: '[[0, 1], [1, 0]]' },
          { text: '[[−1, 0], [0, 1]]' }
        ],
        explain: 'e₁ = (1, 0) 转到 (0, 1)，e₂ = (0, 1) 转到 (−1, 0)，所以第一列是 (0, 1)、第二列是 (−1, 0)，矩阵为 [[0, −1], [1, 0]]。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '相似矩阵一定有相同的列空间。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '相似矩阵是同一变换在不同基下的矩阵，共享秩、迹、行列式、特征值，但列空间依赖坐标系，通常不同。例如 [[1,1],[0,2]] 与 [[1,0],[0,2]] 相似，列空间却不一样。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '线性变换 T 在基 B 下的矩阵可以写成 [T]_B = P_B⁻¹ ______ P_B，其中空白处是 T 的标准矩阵。',
        answer: 'A',
        accept: ['A', 'T的标准矩阵', '标准矩阵'],
        explain: '推导：先由 B 坐标换到标准坐标（乘 P_B），作用标准矩阵 A，再换回 B 坐标（乘 P_B⁻¹）。三个矩阵依次相乘，中间就是 A。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '相似变换 P⁻¹AP 会保持下面哪些量？（多选）',
        options: [
          { text: '秩', correct: true },
          { text: '迹', correct: true },
          { text: '行列式', correct: true },
          { text: '列空间' }
        ],
        explain: '秩、迹、行列式、特征多项式都是变换本身的不变量，与基无关。列空间是「标准坐标下的像」，换基后会改变，不是相似不变量。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '线性映射 T: ℝ³ → ℝ² 不可能成为 ______（填「单射」或「满射」）。',
        answer: '单射',
        accept: ['单射', 'injective', '一对一'],
        explain: '定义域维数 3 大于陪域维数 2，核至少一维，所以必有非零向量被压成零，不可能是单射。它可以是满射，例如投影 (x, y, z) ↦ (x, y)。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-8', tier: 2, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '若 x_{n+1} = Ax_n，则 x_n = Aⁿx₀。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '反复代入：x₁ = Ax₀，x₂ = Ax₁ = A²x₀，归纳得 x_n = Aⁿx₀。若 A 可对角化，再用 Aⁿ = PDⁿP⁻¹ 分析长期行为。'
      },

      /* ---------------- ch06 行列式与特征值 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['compute'],
        stem: 'det [[2, 1], [3, 4]] 等于多少？',
        options: [
          { text: '5', correct: true },
          { text: '11' },
          { text: '−5' },
          { text: '8' }
        ],
        explain: '2×2 行列式是 ad − bc = 2×4 − 1×3 = 8 − 3 = 5。不要算成对角线之和 2 + 4 = 6 或 2×4 + 1×3 = 11。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['compute'],
        stem: '上三角矩阵 [[3, 1], [0, 2]] 的特征值是什么？',
        options: [
          { text: '3 与 2', correct: true },
          { text: '1 与 6' },
          { text: '3 与 −2' },
          { text: '只有 3' }
        ],
        explain: '三角矩阵的特征值就是对角线元素，因为 det(A − λI) = (3 − λ)(2 − λ)。对应特征向量分别是 (1, 0) 与 (1, −1)。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-8', tier: 2, type: 'tf', difficulty: 2,
        tags: ['proof'],
        stem: '实对称矩阵属于不同特征值的特征向量一定互相正交。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '设 Av = λv、Aw = μw 且 λ ≠ μ。由对称性 λvᵀw = (Av)ᵀw = vᵀAᵀw = vᵀAw = μvᵀw，所以 (λ − μ)vᵀw = 0，只能 vᵀw = 0。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-6', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '方程 det(A − λI) = 0 的根称为矩阵 A 的 ______。',
        answer: '特征值',
        accept: ['特征值', 'eigenvalue', '特征根'],
        explain: '这些根使 A − λI 奇异，从而存在非零 v 满足 (A − λI)v = 0，即 Av = λv。根的重数叫代数重数。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些条件能保证 n×n 矩阵 A 可对角化？（多选）',
        options: [
          { text: 'A 有 n 个线性无关的特征向量', correct: true },
          { text: 'A 有 n 个互不相同的特征值', correct: true },
          { text: 'A 是实对称矩阵', correct: true },
          { text: 'A 可逆' }
        ],
        explain: '可对角化的定义就是有 n 个线性无关特征向量；互异特征值自动给出无关特征向量；实对称矩阵可正交对角化。可逆只保证特征值非零，不保证特征向量够，例如剪切矩阵可逆但不可对角化。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '矩阵的迹等于所有 ______ 之和（按重数计）。',
        answer: '特征值',
        accept: ['特征值', 'eigenvalue', '特征根'],
        explain: '比较特征多项式 λⁿ⁻¹ 的系数可得 tr(A) = Σλᵢ；常数项给出 det(A) = Πλᵢ。这两个关系可用来快速核对特征值。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-2', tier: 3, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '对任意同阶方阵 A、B，都有 det(A + B) = det A + det B。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '行列式对每一行线性，但不是对整个矩阵可加。取 A = I、B = −I（2×2），det(A + B) = 0，而 det A + det B = 1 + 1 = 2。'
      },

      /* ---------------- ch07 正交性、最小二乘与 SVD ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['compute'],
        stem: 'b = (3, 1) 在直线 span{(1, 1)} 上的正交投影是什么？',
        options: [
          { text: '(2, 2)', correct: true },
          { text: '(3, 1)' },
          { text: '(1, 1)' },
          { text: '(1, −1)' }
        ],
        explain: '投影矩阵 P = (1/2)[[1,1],[1,1]]，Pb = (1/2)(4, 4) = (2, 2)。残差 (1, −1) 与 (1, 1) 点积为 0，说明确实是垂足。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '最小二乘问题 min ‖Ax − b‖ 的正规方程是什么？',
        options: [
          { text: 'AᵀAx = Aᵀb', correct: true },
          { text: 'AAᵀx = b' },
          { text: 'Ax = Aᵀb' },
          { text: 'AᵀAx = b' }
        ],
        explain: '残差 b − Ax 与列空间正交，所以 Aᵀ(b − Ax) = 0，整理得 AᵀAx = Aᵀb。A 列满秩时解唯一，x̂ = (AᵀA)⁻¹Aᵀb。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '矩阵 A 的奇异值是 AᵀA 的特征值的非负平方根。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'AᵀA 对称半正定，特征值 λᵢ ≥ 0，奇异值 σᵢ = √λᵢ。右奇异向量是 AᵀA 的特征向量，左奇异向量由 uᵢ = Avᵢ/σᵢ 得到。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '矩阵的条件数定义为 κ(A) = σₘₐₓ / ______。',
        answer: 'σₘᵢₙ',
        accept: ['σmin', 'σₘᵢₙ', '最小奇异值', 'sigma_min', 'σ_min'],
        explain: '条件数衡量解对输入误差的敏感度。κ 接近 1 时稳定；κ 很大时，小奇异值方向会把误差放大，方程组病态。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '关于任意 m×n 矩阵 A 的 SVD，下面哪些说法正确？（多选）',
        options: [
          { text: 'A = UΣVᵀ 对任意矩阵都存在', correct: true },
          { text: '非零奇异值的个数等于 rank(A)', correct: true },
          { text: 'U 与 V 都是正交矩阵', correct: true },
          { text: 'Σ 一定是方阵' }
        ],
        explain: 'Σ 与 A 同型（m×n），只有对角位置可能非零，所以不一定是方阵。其余三条是 SVD 的基本性质，也是它能统一处理任意矩阵的原因。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-8', tier: 3, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '用 SVD 截断到前 k 项得到最佳秩-k 近似 Aₖ，误差 ‖A − Aₖ‖₂ 等于第 ______ 个奇异值。',
        answer: 'k+1',
        accept: ['k+1', 'k + 1', 'k＋1'],
        explain: 'Eckart–Young 定理：Aₖ = Σᵢ₌₁ᵏ σᵢuᵢvᵢᵀ 是所有秩不超过 k 的矩阵中离 A 最近的，谱范数误差正好是 σₖ₊₁。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-6', tier: 3, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '对任意方阵 A，A 的每个特征值的绝对值都是 A 的奇异值。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '这只对正规矩阵（含对称矩阵）成立。A = [[1, 1], [0, 1]] 的特征值都是 1，但奇异值约为 1.618 与 0.618，来自 AᵀA 的特征值。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
