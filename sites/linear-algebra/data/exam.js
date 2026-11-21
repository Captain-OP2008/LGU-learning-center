/* =====================================================================
 * data/exam.js · 线性代数学习站 · 模拟卷（两套）
 * 教材：Gilbert Strang《Introduction to Linear Algebra》5th Edition (2016)
 *
 *  A 卷「期中模拟」：6 题 / 100 分 / 120 分钟 · 范围 §1.1–6.5
 *    分值：ch01 12 + ch02 20 + ch03 20 + ch04 22 + ch05 12 + ch06 14
 *  B 卷「期末模拟」：10 题 / 100 分 / 150 分钟 · 全书重点
 *    分值：ch03 10 + ch04 14 + ch05 10 + ch06 16 + ch07 16 + ch08 12
 *          + ch09 8 + ch10 8 + ch11 3 + ch12 3
 *
 * 结构：{ id, title, style, subtitle, date, minutes, totalScore, summary,
 *        instructions, questions:[…] }
 *       question.parts[] 是判分单位：kind = choice | tf | fill | keywords
 *       （choice/tf 用 options[].correct；fill 用 answer/accept/placeholder；
 *        keywords 按关键词命中比例给分）
 * 注入：CSC.registerExam({...})；并挂 CSC._exams 供引擎在数据先加载时桥接
 * ===================================================================== */
(function () {
  'use strict';

  /* ================================================================ A 卷 */
  var A = {
    id: 'la-midterm',
    title: '期中模拟',
    style: 'A · MIDTERM',
    subtitle: 'Linear Algebra · Strang 5e · 闭卷限时模拟',
    date: '期中范围 §1.1–6.5',
    minutes: 120,
    totalScore: 100,
    summary: '按期中真实权重配分的 A 卷：<b>ch01 向量 12 分</b> · <b>ch02 解方程组 20 分</b> · <b>ch03 子空间 20 分</b> · <b>ch04 正交性 22 分</b> · <b>ch05 行列式 12 分</b> · <b>ch06 特征值 14 分</b>。题目以「算得对 + 说得清」为标准：选择与判断直接考查定义的条件，填空只填最终结果，简答按关键步骤给分。',
    instructions: [
      '闭卷、限时 <b>120 分钟</b>，满分 100 分。点击「开始作答」后计时开始，成绩保存在本地浏览器，可反复重做。',
      '数学公式用 <code>$...$</code>（行内）或 <code>$$...$$</code>（独立）书写，由页面自动排版。',
      '填空题只填<b>最终结果</b>，请写<b>精确值</b>（如 <code>8/5</code>、<code>-1/2</code>、<code>\\frac{3}{2}</code>），不要写四舍五入的小数。',
      '选择题、判断题直接点选；简答题按关键词命中比例给分，请把「用了什么定理、得到什么等式、结论是什么」写全。',
      '交卷后可以查看逐题解析与参考答案。做错的题建议回到对应章节的实验台与例题重看一遍。'
    ],
    questions: [
      /* ---------------- Q1 · ch01 向量与矩阵基础 12 分 ---------------- */
      {
        no: 1, points: 12, type: '向量与矩阵基础',
        intro: '本题覆盖 §1.1–1.3：线性组合、点积、单位向量与矩阵乘法。注意点积是「对应分量相乘再相加」，不是分量相加。',
        parts: [
          {
            label: '(a)', points: 2, kind: 'tf',
            prompt: '若 $\\mathbf{u}\\cdot\\mathbf{v}=0$，则 $\\mathbf{u}=\\mathbf{0}$ 或 $\\mathbf{v}=\\mathbf{0}$。',
            options: [
              { text: 'True (T)' },
              { text: 'False (F)', correct: true }
            ],
            explain: '错（F）。点积为零只说明两个向量<b>正交</b>，与它们是否为零向量无关。反例：$\\mathbf{u}=(1,0)$，$\\mathbf{v}=(0,1)$，$\\mathbf{u}\\cdot\\mathbf{v}=0$，但两个都不是零向量。易错点：把「正交」误当成「有零向量」；零向量确实与任何向量正交（$\\mathbf{0}\\cdot\\mathbf{v}=0$），但反过来不成立。'
          },
          {
            label: '(b)', points: 3, kind: 'choice',
            prompt: '设 $\\mathbf{u}=(1,2,3)$，$\\mathbf{v}=(4,-1,2)$，则 $\\mathbf{u}\\cdot\\mathbf{v}=$',
            options: [
              { text: '$8$', correct: true },
              { text: '$12$', correct: false },
              { text: '$-8$', correct: false },
              { text: '$11$', correct: false }
            ],
            explain: '答案 A：$\\mathbf{u}\\cdot\\mathbf{v}=1\\cdot4+2\\cdot(-1)+3\\cdot2=4-2+6=8$。<b>B</b> 错在把 $2\\cdot(-1)$ 算成 $+2$，得到 $4+2+6=12$；<b>C</b> 错在把整个点积取了反：$-(4-2+6)=-8$；<b>D</b> 错在把对应分量直接相加 $5+1+5=11$，点积必须先乘后加。'
          },
          {
            label: '(c)', points: 3, kind: 'fill',
            prompt: '与 $\\mathbf{a}=(3,4)$ 同向的单位向量为 $\\mathbf{a}/\\lVert\\mathbf{a}\\rVert$，它的第二个分量 $=$',
            answer: '4/5',
            accept: ['4/5', '0.8', '0.80', '\\frac{4}{5}'],
            placeholder: '填精确值，如 4/5',
            explain: '答案 $\\frac45$。$\\lVert\\mathbf{a}\\rVert=\\sqrt{3^2+4^2}=5$，所以单位向量是 $(\\frac35,\\frac45)$，第二个分量为 $\\frac45$。易错点：忘记除以长度，直接写 $4$；或把「同向」与「反向」混为一谈而写 $-\\frac45$——同向要求系数为正。'
          },
          {
            label: '(d)', points: 4, kind: 'fill',
            prompt: '设 $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$，则 $(A^2)_{22}=$（即 $A^2$ 的第 2 行第 2 列元素）',
            answer: '22',
            accept: ['22', '22.0'],
            placeholder: '填整数',
            explain: '答案 $22$。$A^2=A\\cdot A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}=\\begin{bmatrix}1\\cdot1+2\\cdot3&1\\cdot2+2\\cdot4\\\\3\\cdot1+4\\cdot3&3\\cdot2+4\\cdot4\\end{bmatrix}=\\begin{bmatrix}7&10\\\\15&22\\end{bmatrix}$，故 $(A^2)_{22}=22$。易错点：把 $A^2$ 逐元素平方（会得到 $\\begin{bmatrix}1&4\\\\9&16\\end{bmatrix}$）——矩阵乘法是「行乘列」，不是逐元素运算。'
          }
        ]
      },

      /* ---------------- Q2 · ch02 消元与逆矩阵 20 分 ---------------- */
      {
        no: 2, points: 20, type: '消元、逆矩阵与 LU',
        intro: '本题覆盖 §2.2–2.6：消元回代、奇异判定、2×2 逆矩阵与 LU 分解的含义。',
        parts: [
          {
            label: '(a)', points: 6, kind: 'fill',
            prompt: '用消元法解方程组 $$\\begin{cases}x+2y+z=8,\\\\ 2x+y+3z=13,\\\\ 3x+2y+2z=13.\\end{cases}$$ 则 $z=$',
            answer: '3',
            accept: ['3', '3.0'],
            placeholder: '填整数',
            explain: '答案 $z=3$。消元：$R_2-2R_1=(0,-3,1\\mid-3)$，$R_3-3R_1=(0,-4,-1\\mid-11)$；再消去第二个变量，$R_3-\\frac43R_2=(0,0,-\\frac73\\mid-7)$，得 $-\\frac73z=-7$，即 $z=3$。回代：$-3y+3=-3\\Rightarrow y=2$，$x+4+3=8\\Rightarrow x=1$。易错点：消元时只对系数行做变换却漏掉右端常数项；或回代时把 $-3y+z=-3$ 的符号写错。'
          },
          {
            label: '(b)', points: 5, kind: 'choice',
            prompt: '下列 $2\\times2$ 矩阵中，奇异（不可逆）的是：',
            options: [
              { text: '$\\begin{bmatrix}1&2\\\\3&6\\end{bmatrix}$', correct: true },
              { text: '$\\begin{bmatrix}1&2\\\\2&5\\end{bmatrix}$', correct: false },
              { text: '$\\begin{bmatrix}2&1\\\\1&1\\end{bmatrix}$', correct: false },
              { text: '$\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$', correct: false }
            ],
            explain: '答案 A：$\\det\\begin{bmatrix}1&2\\\\3&6\\end{bmatrix}=1\\cdot6-2\\cdot3=0$，第二行是第一行的 3 倍，两行线性相关，矩阵奇异。<b>B</b> 的行列式为 $1\\cdot5-2\\cdot2=1\\neq0$；<b>C</b> 的行列式为 $2\\cdot1-1\\cdot1=1\\neq0$；<b>D</b> 是置换矩阵，行列式为 $-1\\neq0$。易错点：只看「有没有零元素」判断奇异——矩阵可以没有零元素却奇异（如 A），也可以有很多零元素却可逆（如 D）。'
          },
          {
            label: '(c)', points: 5, kind: 'fill',
            prompt: '设 $A=\\begin{bmatrix}2&1\\\\1&1\\end{bmatrix}$，则 $A^{-1}$ 的第 2 行第 1 列元素 $=$',
            answer: '-1',
            accept: ['-1', '−1', '-1.0', '-1.00'],
            placeholder: '填整数',
            explain: '答案 $-1$。$\\det A=2\\cdot1-1\\cdot1=1$，$A^{-1}=\\frac1{\\det A}\\begin{bmatrix}1&-1\\\\-1&2\\end{bmatrix}=\\begin{bmatrix}1&-1\\\\-1&2\\end{bmatrix}$，故第 2 行第 1 列是 $-1$。易错点：2×2 逆矩阵公式中副对角线的两个元素要<b>变号</b>，主对角线两个元素只交换位置；把 $\\begin{bmatrix}1&-1\\\\-1&2\\end{bmatrix}$ 写成 $\\begin{bmatrix}1&1\\\\1&2\\end{bmatrix}$ 是最常见的错。'
          },
          {
            label: '(d)', points: 4, kind: 'keywords',
            prompt: '简述 $A=LU$ 分解中 $L$ 与 $U$ 分别是什么矩阵，并说明在什么情况下需要写成 $PA=LU$。（按关键点给分）',
            keywords: [
              ['下三角', '单位下三角', 'L 是下三角'],
              ['上三角', 'U 是上三角'],
              ['行交换', '换行', '置换', '主元为零', '主元为 0', '零主元', '换行消元']
            ],
            answer: '$L$ 是单位下三角矩阵（对角线全 1，记录消元乘数），$U$ 是上三角矩阵（消元后的结果）；当某个主元位置出现 0、必须交换两行才能继续消元时，先做行交换再分解，写成 $PA=LU$，其中 $P$ 是置换矩阵。',
            placeholder: '写出 L、U 的类型，以及为什么需要 P',
            explain: '评分要点：① $L$ 为单位下三角矩阵（记录消元乘数，对角线为 1）；② $U$ 为上三角矩阵（消元结果）；③ 主元位置为 0 时必须行交换，此时写成 $PA=LU$，$P$ 是置换矩阵。易错点：说成「$L$ 是下三角但对角线不一定是 1」——若不要求单位下三角，$LU$ 分解不唯一；以及把 $P$ 的作用说成「缩放行」——置换矩阵只交换行，不改变大小。'
          }
        ]
      },

      /* ---------------- Q3 · ch03 子空间 20 分 ---------------- */
      {
        no: 3, points: 20, type: '子空间、零空间与维数',
        intro: '本题覆盖 §3.1–3.5：秩、零空间、完整解与四个子空间的维数。做之前先把矩阵化成行阶梯形。',
        parts: [
          {
            label: '(a)', points: 6, kind: 'fill',
            prompt: '设 $A=\\begin{bmatrix}1&2&2&2\\\\2&4&6&8\\\\3&6&8&10\\end{bmatrix}$，则 $r=\\operatorname{rank}(A)=$',
            answer: '2',
            accept: ['2', '2.0'],
            placeholder: '填整数',
            explain: '答案 $r=2$。$R_2-2R_1=(0,0,2,4)$，$R_3-3R_1=(0,0,2,4)$，两行完全相同，再消去一个得零行；剩下两个非零行，所以秩为 2。易错点：把「非零行的个数」直接当成原矩阵的行数 $3$；或忽略 $R_3$ 其实是 $R_1+R_2$ 的线性组合。'
          },
          {
            label: '(b)', points: 4, kind: 'choice',
            prompt: '下列 $\\mathbb{R}^2$ 的子集中，是子空间的是：',
            options: [
              { text: '$\\{(x,y):x+y=1\\}$', correct: false },
              { text: '$\\{(x,y):x=2y\\}$', correct: true },
              { text: '$\\{(x,y):xy=0\\}$', correct: false },
              { text: '$\\{(x,y):x\\ge0\\}$', correct: false }
            ],
            explain: '答案 B：$\\{(x,y):x=2y\\}$ 是过原点的直线，对加法与数乘都封闭，是子空间。<b>A</b> 不过原点，零向量 $(0,0)$ 不在其中；<b>C</b> 是两条坐标轴的并集，$(1,0)+(0,1)=(1,1)$ 不在集合里，对加法不封闭；<b>D</b> 对加法封闭但对数乘不封闭（取 $c=-1$ 会把 $x\\ge0$ 变成 $x\\le0$）。易错点：只检查「过原点」就下结论——过原点是必要条件，还要验证对加法、数乘封闭。'
          },
          {
            label: '(c)', points: 5, kind: 'fill',
            prompt: '设 $A=\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$，$\\mathbf{b}=\\begin{bmatrix}3\\\\6\\end{bmatrix}$。$A\\mathbf{x}=\\mathbf{b}$ 的全体解中，满足 $x_2=1$ 的那个解有 $x_1=$',
            answer: '1',
            accept: ['1', '1.0'],
            placeholder: '填整数',
            explain: '答案 $x_1=1$。第一行给出 $x_1+2x_2=3$，代入 $x_2=1$ 得 $x_1=1$；一般解为 $\\mathbf{x}=\\begin{bmatrix}3\\\\0\\end{bmatrix}+t\\begin{bmatrix}-2\\\\1\\end{bmatrix}$（$t$ 任意），取 $t=1$ 即得 $(1,1)$。易错点：把「$A\\mathbf{x}=\\mathbf{b}$ 有解」当成「解唯一」——这里 $A$ 奇异、$\\mathbf{b}$ 在列空间中，所以有无穷多解。'
          },
          {
            label: '(d)', points: 2, kind: 'fill',
            prompt: '设 $A$ 是 $3\\times5$ 矩阵且 $\\operatorname{rank}(A)=3$，则 $\\dim N(A)=$',
            answer: '2',
            accept: ['2', '2.0'],
            placeholder: '填整数',
            explain: '答案 $2$。秩-零化度定理：$\\dim N(A)=n-r=5-3=2$。易错点：把 $m=3$ 当成 $n$ 用，写成 $3-3=0$。'
          },
          {
            label: '(e)', points: 3, kind: 'fill',
            prompt: '同上，$A$ 是 $3\\times5$ 且 $\\operatorname{rank}(A)=3$，则 $\\dim N(A^{\\mathsf T})=$',
            answer: '0',
            accept: ['0', '0.0'],
            placeholder: '填整数',
            explain: '答案 $0$。左零空间维数为 $m-r=3-3=0$：$A$ 的行满秩，$A^{\\mathsf T}\\mathbf{y}=\\mathbf{0}$ 只有零解。易错点：把 $\\dim N(A)$ 与 $\\dim N(A^{\\mathsf T})$ 混为一谈；两者分别用 $n-r$ 与 $m-r$，不要都用 $n$。'
          }
        ]
      },

      /* ---------------- Q4 · ch04 正交与最小二乘 22 分 ---------------- */
      {
        no: 4, points: 22, type: '投影与最小二乘',
        intro: '本题覆盖 §4.2–4.4：投影向量、投影矩阵、最小二乘正规方程与 Gram–Schmidt。计算量较大，注意「投影到直线」与「投影到子空间」公式的分母不同。',
        parts: [
          {
            label: '(a)', points: 5, kind: 'fill',
            prompt: '设 $\\mathbf{a}=(1,1,1)$，$\\mathbf{b}=(1,2,3)$。$\\mathbf{b}$ 在 $\\mathbf{a}$ 上的投影 $\\mathbf{p}=$',
            answer: '(2,2,2)',
            accept: ['(2,2,2)', '2,2,2', '\\begin{bmatrix}2\\\\2\\\\2\\end{bmatrix}', '(2, 2, 2)'],
            placeholder: '填向量，如 (2,2,2)',
            explain: '答案 $\\mathbf{p}=(2,2,2)$。$\\mathbf{p}=\\frac{\\mathbf{a}^{\\mathsf T}\\mathbf{b}}{\\mathbf{a}^{\\mathsf T}\\mathbf{a}}\\mathbf{a}=\\frac{1+2+3}{1+1+1}(1,1,1)=\\frac63(1,1,1)=(2,2,2)$。易错点：把分母写成 $\\lVert\\mathbf{a}\\rVert$ 而不是 $\\mathbf{a}^{\\mathsf T}\\mathbf{a}$，会得到 $(2\\sqrt3,2\\sqrt3,2\\sqrt3)$ 之类的错误结果；投影系数是标量 $2$，不是向量。'
          },
          {
            label: '(b)', points: 8, kind: 'fill',
            prompt: '用最小二乘拟合过三点 $(0,1),(1,2),(2,4)$ 的直线 $y=C+Dt$，则斜率 $D=$',
            answer: '3/2',
            accept: ['3/2', '1.5', '1.50', '\\frac{3}{2}'],
            placeholder: '填精确值，如 3/2',
            explain: '答案 $D=\\frac32$。设计矩阵 $A=\\begin{bmatrix}1&0\\\\1&1\\\\1&2\\end{bmatrix}$，正规方程 $A^{\\mathsf T}A\\hat{\\mathbf{x}}=A^{\\mathsf T}\\mathbf{b}$：$A^{\\mathsf T}A=\\begin{bmatrix}3&3\\\\3&5\\end{bmatrix}$，$A^{\\mathsf T}\\mathbf{b}=\\begin{bmatrix}7\\\\10\\end{bmatrix}$。由 $3C+3D=7$、$3C+5D=10$ 相减得 $2D=3$，故 $D=\\frac32$，$C=\\frac56$。易错点：把 $A^{\\mathsf T}A$ 算成 $AA^{\\mathsf T}$；或忘记每个方程右端也要求 $A^{\\mathsf T}\\mathbf{b}$，直接解 $A\\mathbf{x}=\\mathbf{b}$（三点不共线，无解）。'
          },
          {
            label: '(c)', points: 4, kind: 'choice',
            prompt: '设 $A$ 的列线性无关，$P=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}$ 是投影到 $C(A)$ 的矩阵，则下列一定成立的是：',
            options: [
              { text: '$P$ 一定可逆', correct: false },
              { text: '$P^2=P$', correct: true },
              { text: '$P=I$', correct: false },
              { text: '$P$ 一定是正交矩阵', correct: false }
            ],
            explain: '答案 B：投影两次与投影一次效果相同，$P^2=P$，且 $P^{\\mathsf T}=P$。<b>A</b> 错：$P$ 只在 $C(A)$ 整个空间时才可逆，否则有非零的零空间（被投影掉的误差方向），行列式为 0；<b>C</b> 错：只有投影到全空间时 $P=I$，一般 $P\\neq I$；<b>D</b> 错：正交矩阵要求 $P^{\\mathsf T}P=I$，投影矩阵满足 $P^{\\mathsf T}P=P$，只要 $P\\ne I$ 就有 $P^{\\mathsf T}P\\ne I$，$P$ 是<b>对称幂等</b>矩阵而不是正交矩阵。易错点：把「$P^{\\mathsf T}=P$」误读成「$P$ 是正交矩阵」。'
          },
          {
            label: '(d)', points: 5, kind: 'fill',
            prompt: '对 $\\mathbf{a}_1=(1,1,0)$、$\\mathbf{a}_2=(1,0,1)$ 做 Gram–Schmidt（先把 $\\mathbf{a}_1$ 单位化为 $\\mathbf{q}_1$），得 $\\mathbf{v}_2=\\mathbf{a}_2-(\\mathbf{a}_2\\cdot\\mathbf{q}_1)\\mathbf{q}_1$。$\\mathbf{v}_2$ 的第二个分量 $=$',
            answer: '-1/2',
            accept: ['-1/2', '-0.5', '−1/2', '-\\frac{1}{2}', '\\frac{-1}{2}'],
            placeholder: '填精确值，如 -1/2',
            explain: '答案 $-\\frac12$。$\\lVert\\mathbf{a}_1\\rVert=\\sqrt2$，$\\mathbf{q}_1=\\frac1{\\sqrt2}(1,1,0)$；$\\mathbf{a}_2\\cdot\\mathbf{q}_1=\\frac1{\\sqrt2}$，于是 $\\mathbf{v}_2=(1,0,1)-\\frac1{\\sqrt2}\\cdot\\frac1{\\sqrt2}(1,1,0)=(1,0,1)-(\\frac12,\\frac12,0)=(\\frac12,-\\frac12,1)$，第二个分量为 $-\\frac12$。易错点：忘记先单位化 $\\mathbf{q}_1$，直接用 $\\mathbf{a}_2-\\frac{\\mathbf{a}_2\\cdot\\mathbf{a}_1}{\\mathbf{a}_1\\cdot\\mathbf{a}_1}\\mathbf{a}_1$ 虽然也对，但本题已指定用 $\\mathbf{q}_1$；两个公式分母不同，混用会得到错值。'
          }
        ]
      },

      /* ---------------- Q5 · ch05 行列式 12 分 ---------------- */
      {
        no: 5, points: 12, type: '行列式与 Cramer 法则',
        intro: '本题覆盖 §5.1–5.3：用性质/展开算 $3\\times3$ 行列式、Cramer 法则与 $\\det(cA)$ 的缩放规律。',
        parts: [
          {
            label: '(a)', points: 4, kind: 'fill',
            prompt: '设 $A=\\begin{bmatrix}2&1&0\\\\1&2&1\\\\0&1&2\\end{bmatrix}$，则 $\\det(A)=$',
            answer: '4',
            accept: ['4', '4.0'],
            placeholder: '填整数',
            explain: '答案 $4$。按第一行展开：$\\det A=2\\begin{vmatrix}2&1\\\\1&2\\end{vmatrix}-1\\begin{vmatrix}1&1\\\\0&2\\end{vmatrix}+0=2(4-1)-1(2-0)=6-2=4$。易错点：第二项的代数余子式符号是负号（位置 $(1,2)$ 的符号为 $-$），漏掉会得到 $8$；把 $3\\times3$ 行列式按对角线「沙路法」算时漏乘或重乘。'
          },
          {
            label: '(b)', points: 4, kind: 'fill',
            prompt: '用 Cramer 法则解 $\\begin{cases}2x+y=5,\\\\ x+3y=7.\\end{cases}$ 则 $x=$',
            answer: '8/5',
            accept: ['8/5', '1.6', '1.60', '\\frac{8}{5}'],
            placeholder: '填精确值，如 8/5',
            explain: '答案 $x=\\frac85$。$\\det A=2\\cdot3-1\\cdot1=5$，$\\det A_1=\\begin{vmatrix}5&1\\\\7&3\\end{vmatrix}=15-7=8$，故 $x=\\frac{\\det A_1}{\\det A}=\\frac85$。易错点：把右端常数项替换错了列（应替换 $x$ 对应的第一列）；或把 Cramer 公式写成 $\\frac{\\det A}{\\det A_1}$（上下颠倒）。'
          },
          {
            label: '(c)', points: 4, kind: 'choice',
            prompt: '设 $A$ 是 $3\\times3$ 矩阵且 $\\det(A)=2$，则 $\\det(2A)=$',
            options: [
              { text: '$4$', correct: false },
              { text: '$8$', correct: false },
              { text: '$16$', correct: true },
              { text: '$2$', correct: false }
            ],
            explain: '答案 C：$\\det(2A)=2^3\\det A=8\\cdot2=16$，因为 $3\\times3$ 矩阵的每一行都乘了 $2$，每乘一行行列式乘一次 $2$，共三次。<b>A</b> 是 $\\det(2A)=\\det A+2$ 之类的错误；<b>B</b> 漏乘了一次 $2$；<b>D</b> 以为数乘不改变行列式。易错点：把 $\\det(cA)$ 写成 $c\\det A$，正确是 $c^n\\det A$。'
          }
        ]
      },

      /* ---------------- Q6 · ch06 特征值 14 分 ---------------- */
      {
        no: 6, points: 14, type: '特征值与正定性',
        intro: '本题覆盖 §6.1–6.5：特征方程、对角化条件与正定判定。所有计算都可以用「迹 = 特征值和、行列式 = 特征值积」快速检验。',
        parts: [
          {
            label: '(a)', points: 5, kind: 'fill',
            prompt: '设 $A=\\begin{bmatrix}4&1\\\\2&3\\end{bmatrix}$，则 $A$ 的较大特征值 $=$',
            answer: '5',
            accept: ['5', '5.0'],
            placeholder: '填整数',
            explain: '答案 $5$。$\\operatorname{tr}A=7$，$\\det A=4\\cdot3-1\\cdot2=10$，特征多项式 $\\lambda^2-7\\lambda+10=0$，解得 $\\lambda=2,5$，较大者为 $5$。验证：$\\lambda_1+\\lambda_2=7=\\operatorname{tr}A$，$\\lambda_1\\lambda_2=10=\\det A$。易错点：展开特征多项式时系数算错（$\\det(\\lambda I-A)$ 与 $\\det(A-\\lambda I)$ 只差一个非零常数，根相同）；或直接对矩阵元素求「平方根」式的错误猜测。'
          },
          {
            label: '(b)', points: 4, kind: 'choice',
            prompt: '设 $A=\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}$，关于 $A$ 是否可对角化，正确的结论是：',
            options: [
              { text: '可对角化，因为两个特征值都是实数', correct: false },
              { text: '可对角化，因为 $\\det A\\neq0$', correct: false },
              { text: '不可对角化，因为只有一个线性无关的特征向量', correct: true },
              { text: '不可对角化，因为 $\\det A=1$', correct: false }
            ],
            explain: '答案 C。$A$ 是 Jordan 块，特征值 $\\lambda=1$（二重）；解 $(A-I)\\mathbf{x}=\\mathbf{0}$ 得 $\\begin{bmatrix}0&1\\\\0&0\\end{bmatrix}\\mathbf{x}=\\mathbf{0}$，即 $x_2=0$，特征空间只有 $\\begin{bmatrix}1\\\\0\\end{bmatrix}$ 一个方向，线性无关的特征向量只有 1 个，凑不满 2 个，故不可对角化。<b>A</b> 错：特征值为实数只是可对角化的必要条件之一，重根时还要检查特征空间维数；<b>B</b> 错：可逆与可对角化是两件不同的事；<b>D</b> 错：行列式为 1 与对角化无关。'
          },
          {
            label: '(c)', points: 5, kind: 'fill',
            prompt: '设 $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$（它是对称正定矩阵），则它的较小特征值 $=$',
            answer: '1',
            accept: ['1', '1.0'],
            placeholder: '填整数',
            explain: '答案 $1$。$\\operatorname{tr}A=4$，$\\det A=3$，特征多项式 $\\lambda^2-4\\lambda+3=0$，得 $\\lambda=1,3$，较小者为 $1$。也可用二次型验证：$\\mathbf{x}^{\\mathsf T}A\\mathbf{x}=2x_1^2+2x_1x_2+2x_2^2=(x_1+x_2)^2+x_1^2+x_2^2\\gt0$，正定。易错点：把迹 4 当成最大特征值；对称矩阵的两个特征值必为实数，但不必相等。'
          }
        ]
      }
    ]
  };

  /* ================================================================ B 卷 */
  var B = {
    id: 'la-final',
    title: '期末模拟',
    style: 'B · FINAL',
    subtitle: 'Linear Algebra · Strang 5e · 闭卷限时模拟',
    date: '期末范围 全书重点 §3.1–12.3',
    minutes: 150,
    totalScore: 100,
    summary: '按期末真实权重配分的 B 卷：<b>ch03 子空间 10 分</b> · <b>ch04 正交性 14 分</b> · <b>ch05 行列式 10 分</b> · <b>ch06 特征值 16 分</b> · <b>ch07 SVD 16 分</b> · <b>ch08 线性变换 12 分</b> · <b>ch09 复数 8 分</b> · <b>ch10 应用 8 分</b> · <b>ch11 数值 3 分</b> · <b>ch12 统计 3 分</b>。后半学期是重点：SVD、特征值与换基占 44 分；前三章的基础题仍会出现，别在送分题上丢分。',
    instructions: [
      '闭卷、限时 <b>150 分钟</b>，满分 100 分。点击「开始作答」后计时开始，成绩保存在本地浏览器，可反复重做。',
      '数学公式用 <code>$...$</code>（行内）或 <code>$$...$$</code>（独立）书写，由页面自动排版。',
      '填空题只填<b>最终结果</b>，请写<b>精确值</b>（如 <code>3/2</code>、<code>1/3</code>、<code>-2</code>），不要写四舍五入的小数。',
      '选择题、判断题直接点选；简答题按关键词命中比例给分，请分点写清楚「定理 / 等式 / 结论」。',
      '交卷后可以查看逐题解析与参考答案；错题请回到对应章节的「实验台」与「题库」针对性复习。'
    ],
    questions: [
      /* ---------------- Q1 · ch03 子空间与维数 10 分 ---------------- */
      {
        no: 1, points: 10, type: '子空间与四个基本子空间',
        intro: '本题覆盖 §3.1–3.5：用秩-零化度定理算维数，并回顾四个基本子空间的正交关系。',
        parts: [
          {
            label: '(a)', points: 4, kind: 'fill',
            prompt: '设 $A$ 是 $4\\times6$ 矩阵且 $\\operatorname{rank}(A)=4$，则 $\\dim N(A)=$',
            answer: '2',
            accept: ['2', '2.0'],
            placeholder: '填整数',
            explain: '答案 $2$。秩-零化度定理：$\\dim N(A)=n-r=6-4=2$。易错点：用行数 $m=4$ 代 $n$；$\\dim N(A)$ 只看列数 $n$ 与秩 $r$。'
          },
          {
            label: '(b)', points: 3, kind: 'choice',
            prompt: '对任意 $m\\times n$ 矩阵 $A$，$N(A)$ 的正交补是：',
            options: [
              { text: '$C(A)$', correct: false },
              { text: '$C(A^{\\mathsf T})$', correct: true },
              { text: '$N(A^{\\mathsf T})$', correct: false },
              { text: '$C(A)\\cap N(A)$', correct: false }
            ],
            explain: '答案 B。基本定理的另一半：$N(A)^{\\perp}=C(A^{\\mathsf T})$（行空间），$N(A^{\\mathsf T})^{\\perp}=C(A)$。<b>A</b> 错：题目要求的是对任意 $m\\times n$ 矩阵都成立的关系；由基本定理 $N(A)^{\\perp}=C(A^{\\mathsf T})$，只有 $C(A)=C(A^{\\mathsf T})$（例如 $A$ 为实对称矩阵）时 $C(A)$ 才恰好是 $N(A)$ 的正交补；<b>C</b> 错：$N(A^{\\mathsf T})$ 是左零空间，它与 $C(A)$ 正交，而不是与 $N(A)$ 正交；<b>D</b> 错：$C(A)\\cap N(A)$ 一般只有零向量，维数不对。易错点：把「补」理解成「另一个子空间」，正交补要求两个子空间维数相加等于全空间维数。'
          },
          {
            label: '(c)', points: 3, kind: 'tf',
            prompt: '若 $A$ 的列向量线性无关，则 $N(A)=\\{\\mathbf{0}\\}$。',
            options: [
              { text: 'True (T)', correct: true },
              { text: 'False (F)' }
            ],
            explain: '对（T）。$A\\mathbf{x}=\\mathbf{0}$ 就是「$A$ 的列向量的线性组合等于零向量」，列线性无关意味着这个组合的系数只能全为 0，即 $\\mathbf{x}=\\mathbf{0}$。反过来也成立：零空间只有零向量 $\\Leftrightarrow$ 列满秩 $\\Leftrightarrow$ 列线性无关。易错点：把「列无关」与「行无关」混淆——列无关只保证 $r=n$，不保证 $m=n$ 或可逆。'
          }
        ]
      },

      /* ---------------- Q2 · ch04 最小二乘 14 分 ---------------- */
      {
        no: 2, points: 14, type: '最小二乘与正交投影',
        intro: '本题覆盖 §4.3：从法方程求拟合直线，并解释最小二乘的几何意义。',
        parts: [
          {
            label: '(a)', points: 6, kind: 'fill',
            prompt: '用最小二乘拟合过三点 $(1,1),(2,3),(3,3)$ 的直线 $y=C+Dt$，则截距 $C=$',
            answer: '1/3',
            accept: ['1/3', '\\frac{1}{3}'],
            placeholder: '填精确值，如 1/3',
            explain: '答案 $C=\\frac13$。设计矩阵 $A=\\begin{bmatrix}1&1\\\\1&2\\\\1&3\\end{bmatrix}$，$A^{\\mathsf T}A=\\begin{bmatrix}3&6\\\\6&14\\end{bmatrix}$，$A^{\\mathsf T}\\mathbf{b}=\\begin{bmatrix}7\\\\16\\end{bmatrix}$。正规方程 $3C+6D=7$、$6C+14D=16$；第一式乘 2 得 $6C+12D=14$，与第二式相减得 $2D=2$，即 $D=1$，代回得 $C=\\frac13$。故拟合直线为 $y=\\frac13+t$。易错点：把 $C$、$D$ 与「$t$、$y$ 的平均值」之间的关系记错（最小二乘直线必过样本均值点 $(2,\\frac73)$，可用来检验）。'
          },
          {
            label: '(b)', points: 4, kind: 'keywords',
            prompt: '用一句话说清：最小二乘解 $\\hat{\\mathbf{x}}$ 对应的残差 $\\mathbf{e}=\\mathbf{b}-A\\hat{\\mathbf{x}}$ 与 $C(A)$ 是什么关系？为什么？（按关键点给分）',
            keywords: [
              ['残差', '误差', 'e=b-A', 'b-Ax'],
              ['正交', '垂直', '垂直于'],
              ['列空间', 'C(A)', 'A 的列空间', '到列空间'],
              ['投影', '投影到']
            ],
            answer: '残差 $\\mathbf{e}=\\mathbf{b}-A\\hat{\\mathbf{x}}$ 与 $C(A)$ 正交。因为 $A\\hat{\\mathbf{x}}$ 是 $\\mathbf{b}$ 在 $C(A)$ 上的正交投影，$\\mathbf{b}$ 减去投影后剩下的部分垂直于整个列空间；等价地，法方程 $A^{\\mathsf T}A\\hat{\\mathbf{x}}=A^{\\mathsf T}\\mathbf{b}$ 就是 $A^{\\mathsf T}\\mathbf{e}=\\mathbf{0}$，即 $\\mathbf{e}\\in N(A^{\\mathsf T})=C(A)^{\\perp}$。',
            placeholder: '写出：残差与列空间的关系 + 一句理由',
            explain: '评分要点：① 残差（误差）与列空间正交；② 因为 $A\\hat{\\mathbf{x}}$ 是 $\\mathbf{b}$ 在列空间上的投影；③ 等价写法：$A^{\\mathsf T}\\mathbf{e}=\\mathbf{0}$。易错点：说「残差最小」而不说「与列空间正交」——「最小」是结论，正交才是可验证的几何条件；也不要漏掉这个正交关系是对整个列空间成立，不只是对某一列。'
          },
          {
            label: '(c)', points: 4, kind: 'tf',
            prompt: '若 $A$ 的列线性无关，则投影矩阵 $P=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}$ 满足 $P^{\\mathsf T}=P$ 且 $P^2=P$。',
            options: [
              { text: 'True (T)', correct: true },
              { text: 'False (F)' }
            ],
            explain: '对（T）。$P^{\\mathsf T}=A((A^{\\mathsf T}A)^{-1})^{\\mathsf T}A^{\\mathsf T}=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}=P$（用到 $A^{\\mathsf T}A$ 对称）；$P^2=A(A^{\\mathsf T}A)^{-1}(A^{\\mathsf T}A)(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}=P$。列满秩保证 $A^{\\mathsf T}A$ 可逆，投影矩阵才写得出来。易错点：把列满秩当成「$P$ 可逆」——投影矩阵一般不可逆，它有非零的零空间（被投影掉的方向）。'
          }
        ]
      },

      /* ---------------- Q3 · ch05 行列式 10 分 ---------------- */
      {
        no: 3, points: 10, type: '行列式性质与奇异判定',
        intro: '本题覆盖 §5.1：三角形行列式与「行列式为零」的含义。',
        parts: [
          {
            label: '(a)', points: 5, kind: 'fill',
            prompt: '设 $A=\\begin{bmatrix}1&2&3&4\\\\0&2&3&4\\\\0&0&3&4\\\\0&0&0&4\\end{bmatrix}$，则 $\\det(A)=$',
            answer: '24',
            accept: ['24', '24.0'],
            placeholder: '填整数',
            explain: '答案 $24$。上三角矩阵的行列式等于对角线元素之积：$1\\cdot2\\cdot3\\cdot4=24$。易错点：把上三角矩阵当成一般矩阵展开（会多算很多余子式，还容易错符号）；或把对角元相乘时漏掉左上角的 1。'
          },
          {
            label: '(b)', points: 5, kind: 'choice',
            prompt: '设 $A$ 是 $n\\times n$ 矩阵且 $\\det(A)=0$，则一定成立的是：',
            options: [
              { text: '$A$ 必有一行全为 0', correct: false },
              { text: '$A$ 的列向量线性相关', correct: true },
              { text: '$A$ 必有两行完全相同', correct: false },
              { text: '$A^{\\mathsf T}$ 没有零行', correct: false }
            ],
            explain: '答案 B：$\\det A=0\\Leftrightarrow A$ 奇异 $\\Leftrightarrow$ 列向量线性相关 $\\Leftrightarrow$ 存在非零 $\\mathbf{x}$ 使 $A\\mathbf{x}=\\mathbf{0}$。<b>A</b> 错：$\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$ 没有零行但行列式为 0；<b>C</b> 错：两列成比例也会奇异，两行不必完全相同；<b>D</b> 错：这个命题方向反了，$\\det A=0$ 推不出转置没有零行，而且「没有零行」与奇异与否无关。易错点：把「有零行」当成奇异的必要条件——奇异是线性相关，不是「有零元素」。'
          }
        ]
      },

      /* ---------------- Q4 · ch06 特征值与正定 16 分 ---------------- */
      {
        no: 4, points: 16, type: '特征值、对称矩阵与正定性',
        intro: '本题覆盖 §6.1–6.5：特征方程、对称矩阵的谱定理与正定判定。',
        parts: [
          {
            label: '(a)', points: 6, kind: 'fill',
            prompt: '设 $A=\\begin{bmatrix}0&1\\\\-2&-3\\end{bmatrix}$，则 $A$ 的较大特征值 $=$',
            answer: '-1',
            accept: ['-1', '−1', '-1.0', '-1.00'],
            placeholder: '填整数',
            explain: '答案 $-1$。$\\operatorname{tr}A=-3$，$\\det A=0\\cdot(-3)-1\\cdot(-2)=2$，特征多项式 $\\lambda^2+3\\lambda+2=0$，得 $\\lambda=-1,-2$，较大者为 $-1$。易错点：看到特征值为负就以为算错——特征值可以全是负的（这时系统稳定）；以及把「较大」按绝对值理解（按大小应为 $-1\\gt-2$）。'
          },
          {
            label: '(b)', points: 5, kind: 'choice',
            prompt: '关于实对称矩阵，一定成立的是：',
            options: [
              { text: '所有特征值都是正数', correct: false },
              { text: '可以选到一组正交的特征向量，且特征值全为实数', correct: true },
              { text: '一定正定', correct: false },
              { text: '一定可逆', correct: false }
            ],
            explain: '答案 B，这就是对称矩阵的谱定理：$A=Q\\Lambda Q^{\\mathsf T}$，$Q$ 正交，$\\Lambda$ 实对角。<b>A</b> 错：特征值可以是负数或零，例如 $\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$ 的特征值为 $1,-1$；<b>C</b> 错：正定要求所有特征值 $\\gt0$，对称只保证实；<b>D</b> 错：特征值可以为 0，此时不可逆。易错点：把「对称」与「正定」混为一谈；正定是更强的条件（对称 + 特征值全正）。'
          },
          {
            label: '(c)', points: 5, kind: 'tf',
            prompt: '矩阵 $A=\\begin{bmatrix}2&2\\\\2&3\\end{bmatrix}$ 是正定的。',
            options: [
              { text: 'True (T)', correct: true },
              { text: 'False (F)' }
            ],
            explain: '对（T）。用顺序主子式判定：一阶主子式 $2\\gt0$，二阶主子式 $\\det A=2\\cdot3-2\\cdot2=2\\gt0$，两者都正，故正定。（也可看特征值：$\\operatorname{tr}=5$，$\\det=2$，$\\lambda^2-5\\lambda+2=0$ 的两根都正。）易错点：只检查左上角元素 $2\\gt0$ 就下结论——必须所有顺序主子式都为正；也不要只算 $\\det\\gt0$ 就以为正定（还需要一阶主子式为正）。'
          }
        ]
      },

      /* ---------------- Q5 · ch07 SVD 16 分 ---------------- */
      {
        no: 5, points: 16, type: '奇异值分解',
        intro: '本题覆盖 §7.2–7.4：从 $A^{\\mathsf T}A$ 求奇异值、识别 SVD 中的基，以及用奇异值算条件数。',
        parts: [
          {
            label: '(a)', points: 6, kind: 'fill',
            prompt: '设 $A=\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$，则 $A$ 的非零奇异值 $=$',
            answer: '5',
            accept: ['5', '5.0'],
            placeholder: '填整数',
            explain: '答案 $5$。$A^{\\mathsf T}A=\\begin{bmatrix}5&10\\\\10&20\\end{bmatrix}=5\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$，秩为 1，非零特征值为 $\\operatorname{tr}(A^{\\mathsf T}A)=25$（另一个为 0），故非零奇异值 $\\sigma_1=\\sqrt{25}=5$。易错点：直接对 $A$ 求特征值——本题 $A$ 的特征值恰为 $0$ 与 $5$（数值巧合）；一般情况下奇异值是 $A^{\\mathsf T}A$ 特征值的平方根；另外本题是两个奇异值 $5$ 与 $0$，问「非零」只填 $5$。'
          },
          {
            label: '(b)', points: 5, kind: 'choice',
            prompt: '设 $A=U\\Sigma V^{\\mathsf T}$ 是 $m\\times n$ 矩阵的 SVD，则下列正确的是：',
            options: [
              { text: '$V$ 的列是 $AA^{\\mathsf T}$ 的特征向量', correct: false },
              { text: '$V$ 的列是 $A^{\\mathsf T}A$ 的特征向量', correct: true },
              { text: '$U$ 的列是 $A^{\\mathsf T}A$ 的特征向量', correct: false },
              { text: '$\\Sigma$ 的对角元是 $A$ 的特征值', correct: false }
            ],
            explain: '答案 B。从 $A^{\\mathsf T}A=V\\Sigma^{\\mathsf T}\\Sigma V^{\\mathsf T}$ 看出 $V$ 的列是 $A^{\\mathsf T}A$ 的单位特征向量（右奇异向量）；同理 $U$ 的列是 $AA^{\\mathsf T}$ 的特征向量（左奇异向量）。<b>A</b> 把 $U$、$V$ 弄反了；<b>C</b> 同样弄反；<b>D</b> 错：$\\Sigma$ 的对角元是奇异值 $\\sigma=\\sqrt{\\lambda(A^{\\mathsf T}A)}$，不是 $A$ 的特征值（$A$ 甚至可能不是方阵，或特征值为复数）。易错点：记混 $A^{\\mathsf T}A$ 与 $AA^{\\mathsf T}$ 分别对应 $V$ 还是 $U$。'
          },
          {
            label: '(c)', points: 5, kind: 'fill',
            prompt: '设 $A=\\operatorname{diag}(3,1)$，则 $A$ 的 2-范数条件数 $\\kappa_2(A)=$',
            answer: '3',
            accept: ['3', '3.0'],
            placeholder: '填整数',
            explain: '答案 $3$。对角矩阵的奇异值就是对角线元素的绝对值，$\\sigma_1=3$、$\\sigma_2=1$，条件数 $\\kappa_2=\\sigma_1/\\sigma_2=3$。易错点：把条件数写成行列式（$\\det A=3$ 只是巧合）；条件数衡量「输入相对误差被放大的倍数」，$\\kappa=3$ 表示误差最多放大 3 倍。'
          }
        ]
      },

      /* ---------------- Q6 · ch08 线性变换 12 分 ---------------- */
      {
        no: 6, points: 12, type: '线性变换与换基',
        intro: '本题覆盖 §8.1–8.3：由作用写出变换矩阵、用相似不变量绕过换基计算、识别相似不变量。',
        parts: [
          {
            label: '(a)', points: 4, kind: 'fill',
            prompt: '设线性变换 $T(x_1,x_2)=(x_1+2x_2,\\,3x_1)$，则 $T$ 的标准矩阵 $A$ 的第 2 行第 1 列元素 $=$',
            answer: '3',
            accept: ['3', '3.0'],
            placeholder: '填整数',
            explain: '答案 $3$。$T(\\mathbf{x})=A\\mathbf{x}$，$A$ 的两列是 $T(\\mathbf{e}_1)=T(1,0)=(1,3)$ 与 $T(\\mathbf{e}_2)=T(0,1)=(2,0)$，故 $A=\\begin{bmatrix}1&2\\\\3&0\\end{bmatrix}$，第 2 行第 1 列为 $3$。易错点：把列写成行（得到 $\\begin{bmatrix}1&3\\\\2&0\\end{bmatrix}$）——变换矩阵的第 $j$ 列是 $T(\\mathbf{e}_j)$，不是第 $j$ 个输出分量的系数。'
          },
          {
            label: '(b)', points: 4, kind: 'fill',
            prompt: '设 $A=\\begin{bmatrix}1&1\\\\0&2\\end{bmatrix}$，$M=\\begin{bmatrix}1&0\\\\1&1\\end{bmatrix}$，$B=M^{-1}AM$，则 $\\operatorname{tr}(B)=$',
            answer: '3',
            accept: ['3', '3.0'],
            placeholder: '填整数',
            explain: '答案 $3$。相似矩阵的迹不变，$\\operatorname{tr}(B)=\\operatorname{tr}(A)=1+2=3$，无需真的算 $M^{-1}AM$。易错点：花时间做矩阵乘法但某一步算错；或误以为迹只在 $M$ 是正交矩阵时不变——迹对<b>任意</b>可逆 $M$ 都是相似不变量。'
          },
          {
            label: '(c)', points: 4, kind: 'choice',
            prompt: '下列量中，<b>不是</b>相似不变量的是：',
            options: [
              { text: '迹 $\\operatorname{tr}(A)$', correct: false },
              { text: '行列式 $\\det(A)$', correct: false },
              { text: '特征值（含重数）', correct: false },
              { text: '列空间 $C(A)$', correct: true }
            ],
            explain: '答案 D。相似变换 $B=M^{-1}AM$ 相当于换一组基表示同一个线性变换，列空间会随基改变；只有「与基无关」的量才不变。<b>A、B、C</b> 都是相似不变量：$\\operatorname{tr}(M^{-1}AM)=\\operatorname{tr}(A)$，$\\det(M^{-1}AM)=\\det A$，特征多项式相同。易错点：把「秩」和「列空间」混为一谈——秩是相似不变量（列空间维数不变），但列空间本身不是。'
          }
        ]
      },

      /* ---------------- Q7 · ch09 复数与酉矩阵 8 分 ---------------- */
      {
        no: 7, points: 8, type: '复数与酉矩阵',
        intro: '本题覆盖 §9.1–9.3：复数除法与酉矩阵的行列式。',
        parts: [
          {
            label: '(a)', points: 4, kind: 'fill',
            prompt: '复数 $\\dfrac{1+i}{1-i}$ 的虚部 $=$',
            answer: '1',
            accept: ['1', '1.0'],
            placeholder: '填整数',
            explain: '答案 $1$。分子分母同乘共轭 $1+i$：$\\frac{(1+i)^2}{(1-i)(1+i)}=\\frac{1+2i+i^2}{1+1}=\\frac{2i}{2}=i$，虚部为 $1$。易错点：分母乘共轭时把 $1-i$ 的共轭写成 $1-i$（应为 $1+i$）；或把 $i^2$ 当成 $1$。'
          },
          {
            label: '(b)', points: 4, kind: 'choice',
            prompt: '关于酉矩阵 $U$（$U^{\\mathsf H}U=I$），一定成立的是：',
            options: [
              { text: '所有特征值都是实数', correct: false },
              { text: '$|\\det U|=1$', correct: true },
              { text: '$U$ 必是实矩阵', correct: false },
              { text: '$U$ 一定对称', correct: false }
            ],
            explain: '答案 B：$U^{\\mathsf H}U=I$ 两边取行列式得 $|\\det U|^2=1$，故 $|\\det U|=1$。<b>A</b> 错：酉矩阵的特征值在单位圆上，可以是 $e^{i\\theta}$ 这样的复数，例如 $U=\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}$ 的特征值是 $\\pm i$；特征值全为实数的是 Hermite 矩阵；<b>C</b> 错：酉矩阵可以是复矩阵；<b>D</b> 错：酉矩阵满足 $U^{\\mathsf H}U=I$，对称是另一回事。易错点：把「酉」与「Hermite」混为一谈。'
          }
        ]
      },

      /* ---------------- Q8 · ch10 应用 8 分 ---------------- */
      {
        no: 8, points: 8, type: 'Markov 矩阵与图',
        intro: '本题覆盖 §10.1 与 §10.3：Markov 稳态与拉普拉斯矩阵的零空间。',
        parts: [
          {
            label: '(a)', points: 4, kind: 'fill',
            prompt: '设转移矩阵 $P=\\begin{bmatrix}0.8&0.3\\\\0.2&0.7\\end{bmatrix}$（每列和为 1），则稳态向量 $\\boldsymbol{\\pi}$ 的第一个分量 $=$',
            answer: '3/5',
            accept: ['3/5', '0.6', '0.60', '\\frac{3}{5}'],
            placeholder: '填精确值，如 3/5',
            explain: '答案 $\\frac35$。解 $P\\boldsymbol{\\pi}=\\boldsymbol{\\pi}$：$0.8\\pi_1+0.3\\pi_2=\\pi_1$，即 $0.2\\pi_1=0.3\\pi_2$，所以 $\\pi_1=1.5\\pi_2$；结合 $\\pi_1+\\pi_2=1$ 得 $\\pi_2=0.4$、$\\pi_1=0.6=\\frac35$。易错点：解 $P\\boldsymbol{\\pi}=\\boldsymbol{\\pi}$ 时忘记再加归一化条件 $\\pi_1+\\pi_2=1$，只得到比例关系；另外注意 $P$ 的列和为 1，稳态是「列向量」满足 $P\\boldsymbol{\\pi}=\\boldsymbol{\\pi}$（若行向量写法要反过来乘）。'
          },
          {
            label: '(b)', points: 4, kind: 'choice',
            prompt: '设 $G$ 是连通图，$B$ 是它的关联矩阵，$L=B^{\\mathsf T}B$ 是拉普拉斯矩阵，则 $\\dim N(L)=$',
            options: [
              { text: '$0$', correct: false },
              { text: '$1$', correct: true },
              { text: '$n-1$', correct: false },
              { text: '$n$', correct: false }
            ],
            explain: '答案 B。$L\\mathbf{x}=\\mathbf{0}\\Leftrightarrow\\mathbf{x}^{\\mathsf T}L\\mathbf{x}=\\lVert B\\mathbf{x}\\rVert^2=0\\Leftrightarrow B\\mathbf{x}=\\mathbf{0}$；$B\\mathbf{x}=\\mathbf{0}$ 要求每条边上两个端点的值相等，连通图因此所有分量相等，解空间是常数向量张成的 1 维空间。易错点：把 $\\dim N(L)=1$ 记成「秩为 $n-1$」（后者是 $\\operatorname{rank}(L)=n-1$，两者互补）；对不连通图，$\\dim N(L)$ 等于连通分支数。'
          }
        ]
      },

      /* ---------------- Q9 · ch11 条件数 3 分 ---------------- */
      {
        no: 9, points: 3, type: '数值线性代数',
        intro: '§11.2：条件数是相对误差的放大倍数。',
        parts: [
          {
            label: '(a)', points: 3, kind: 'fill',
            prompt: '设 $A=\\operatorname{diag}(1,1000)$，则 $A$ 的 2-范数条件数 $\\kappa_2(A)=$',
            answer: '1000',
            accept: ['1000', '1000.0', '1e3', '10^3'],
            placeholder: '填数值',
            explain: '答案 $1000$。对角矩阵的奇异值 $\\sigma_1=1000$、$\\sigma_2=1$，$\\kappa_2=1000$。含义：输入 $\\mathbf{b}$ 有 $10^{-3}$ 的相对误差时，解 $\\mathbf{x}$ 的相对误差可能被放大到 $1000\\times10^{-3}=1$，即解的相对误差可达 100%。易错点：把条件数当作行列式（$\\det A=1000$ 是巧合）；或认为条件数与「误差本身」有关——它只放大量级，与具体误差数值无关。'
          }
        ]
      },

      /* ---------------- Q10 · ch12 协方差 3 分 ---------------- */
      {
        no: 10, points: 3, type: '概率统计中的线性代数',
        intro: '§12.2：协方差矩阵的对称半正定性。',
        parts: [
          {
            label: '(a)', points: 3, kind: 'choice',
            prompt: '随机向量 $\\mathbf{x}$ 的协方差矩阵 $\\Sigma$ 一定具有的性质是：',
            options: [
              { text: '对称且半正定', correct: true },
              { text: '一定正定', correct: false },
              { text: '一定可逆', correct: false },
              { text: '一定是对角矩阵', correct: false }
            ],
            explain: '答案 A：$\\Sigma=E[(\\mathbf{x}-\\boldsymbol{\\mu})(\\mathbf{x}-\\boldsymbol{\\mu})^{\\mathsf T}]$ 显然对称，且对任意 $\\mathbf{v}$，$\\mathbf{v}^{\\mathsf T}\\Sigma\\mathbf{v}=E[(\\mathbf{v}^{\\mathsf T}(\\mathbf{x}-\\boldsymbol{\\mu}))^2]\\ge0$，故半正定。<b>B/C</b> 错：某个分量是常数时该方向方差为 0，$\\Sigma$ 奇异（如 $x_1=x_2$）；<b>D</b> 错：分量之间有相关性时协方差矩阵有非零的非对角元。易错点：把「半正定」直接说成「正定」——正定额外要求每个方向方差都 $\\gt0$。'
          }
        ]
      }
    ]
  };

  /* ---------------------------------------------------------------- 注册 */
  var LIST = [A, B];
  function inject() {
    var C = window.CSC;
    if (!C || typeof C.registerExam !== 'function') return false;
    try { C._exams = LIST; } catch (e) {}
    LIST.forEach(function (exam) { C.registerExam(exam); });
    return true;
  }
  if (!inject()) {
    window.__LA_EXAM_PACK__ = LIST;
    var tries = 0;
    var timer = setInterval(function () {
      if (inject()) { clearInterval(timer); return; }
      if (++tries > 120) clearInterval(timer);
    }, 50);
  }
})();
