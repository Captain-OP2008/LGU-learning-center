/* =====================================================================
 * data/quiz.js · 线性代数学习站 · 题库（12 章 / 240 道单选题 / 逐项解析）
 * 教材：Gilbert Strang《Introduction to Linear Algebra》5th Edition (2016)
 * 覆盖：ch01–ch12（ch00/ch13/ch14 为导读与工具页，不出题）
 * 题号：chNN-q1 … chNN-q20；kp = 教材英文节名；tags = concept/compute/trap/proof
 * 难度：基础(difficulty=1) 96 · 中等(=2) 96 · 综合(=3) 48（约 40/40/20）
 * 结构：CSC.registerQuizPack({ items:[ {id,ch,type,difficulty,kp,tags,stem,
 *        options:[{text,correct}×4 恰一正确], explain: optExp/oeL/oeT/ok 逐项解析} ] })
 * ===================================================================== */
CSC.registerQuizPack((function () {
  'use strict';
  var PACK = {
    items: [
      /* ---------------- ch01 · Introduction to Vectors（20 题） ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', type: 'mcq', difficulty: 1,
        kp: '1.1 Vectors and Linear Combinations', tags: ['compute'],
        stem: '设 $\\mathbf{u}=(1,2)$，$\\mathbf{v}=(3,-1)$，则 $2\\mathbf{u}-\\mathbf{v}=$？',
        options: [
          { text: '$(-1,5)$', correct: true },
          { text: '$(5,3)$', correct: false },
          { text: '$(-1,3)$', correct: false },
          { text: '$(5,5)$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$2\\mathbf{u}-\\mathbf{v}=(2,4)-(3,-1)=(-1,5)$，逐分量相减。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$(5,3)$ 是 $2\\mathbf{u}+\\mathbf{v}$ 的结果，把减号当成了加号。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。第二分量应为 $2\\cdot2-(-1)=5$，这里误算成 $4-1=3$，漏掉了负号。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。第一分量应为 $2-3=-1$，这里误算成 $2+3=5$。</span></div>"
      },
      {
        id: 'ch01-q2', ch: 'ch01', type: 'mcq', difficulty: 1,
        kp: '1.2 Lengths and Dot Products', tags: ['compute'],
        stem: '设 $\\mathbf{u}=(2,-1,3)$，$\\mathbf{v}=(1,4,-2)$，则 $\\mathbf{u}\\cdot\\mathbf{v}=$？',
        options: [
          { text: '$8$', correct: false },
          { text: '$-8$', correct: true },
          { text: '$-1$', correct: false },
          { text: '$0$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。点积为负，$2-4-6=-8$，符号被丢掉了。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$\\mathbf{u}\\cdot\\mathbf{v}=2\\cdot1+(-1)\\cdot4+3\\cdot(-2)=2-4-6=-8$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。把 $3\\times(-2)$ 误算成 $3+(-2)=1$，于是得到 $2-4+1=-1$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。把 $(-1)\\times4$ 当成 $+4$，于是得到 $2+4-6=0$，第二项符号错了。</span></div>"
      },
      {
        id: 'ch01-q3', ch: 'ch01', type: 'mcq', difficulty: 1,
        kp: '1.2 Lengths and Dot Products', tags: ['compute'],
        stem: '设 $\\mathbf{v}=(3,-4)$，则与 $\\mathbf{v}$ 同方向的单位向量是？',
        options: [
          { text: '$\\left(\\frac{3}{25},-\\frac{4}{25}\\right)$', correct: false },
          { text: '$\\left(-\\frac{3}{5},\\frac{4}{5}\\right)$', correct: false },
          { text: '$\\left(\\frac{3}{5},-\\frac{4}{5}\\right)$', correct: true },
          { text: '$\\left(\\frac{3}{7},-\\frac{4}{7}\\right)$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。除以的是 $\\lVert\\mathbf{v}\\rVert^2=25$；单位向量只需除以 $\\lVert\\mathbf{v}\\rVert=5$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。这是反方向的单位向量；$\\mathbf{v}$ 的正倍数才同方向，这里系数为负。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$\\lVert\\mathbf{v}\\rVert=\\sqrt{9+16}=5$，故单位向量为 $(3,-4)/5=\\left(\\frac{3}{5},-\\frac{4}{5}\\right)$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。把模算成 $3+4=7$；模是平方和开根，不是各分量绝对值相加。</span></div>"
      },
      {
        id: 'ch01-q4', ch: 'ch01', type: 'mcq', difficulty: 1,
        kp: '1.3 Matrices', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$，$\\mathbf{x}=(2,1)$（即列向量 $\\begin{bmatrix}2\\\\1\\end{bmatrix}$），则 $A\\mathbf{x}=$？',
        options: [
          { text: '$(3,7)$', correct: false },
          { text: '$(6,10)$', correct: false },
          { text: '$(4,7)$', correct: false },
          { text: '$(4,10)$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。这是把矩阵元直接相加 $(1+2,\\,3+4)$，根本没有乘 $\\mathbf{x}$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。第一分量把 $x_1=2$ 用了两次：$2\\cdot2+2\\cdot1=6$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。第二分量误算成 $3+4=7$，忘了乘 $\\mathbf{x}=(2,1)$ 的两个分量。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$A\\mathbf{x}=2\\begin{bmatrix}1\\\\3\\end{bmatrix}+1\\begin{bmatrix}2\\\\4\\end{bmatrix}=\\begin{bmatrix}4\\\\10\\end{bmatrix}$，即 $\\mathbf{x}$ 的分量作列的权重。</span></div>"
      },
      {
        id: 'ch01-q5', ch: 'ch01', type: 'mcq', difficulty: 1,
        kp: '1.1 Vectors and Linear Combinations', tags: ['concept'],
        stem: '设 $\\mathbf{v}_1=(1,2)$，$\\mathbf{v}_2=(2,4)$，则由这两个向量的全体线性组合构成的集合是？',
        options: [
          { text: '整个 $\\mathbb{R}^2$，因为题目给出了两个向量', correct: false },
          { text: '只含 $\\mathbf{0}$ 的集合，因为两个向量成比例', correct: false },
          { text: '过原点且方向为 $(1,2)$ 的直线', correct: true },
          { text: '只含 $(1,2)$ 与 $(2,4)$ 这两个向量的集合', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。两向量成比例，只有一个独立方向，只能张成一条直线，张不成整个 $\\mathbb{R}^2$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。组合集总包含 $\\mathbf{0}$（系数全取 $0$），还包含 $c(1,2)$ 这无穷多个非零点。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$c_1\\mathbf{v}_1+c_2\\mathbf{v}_2=(c_1+2c_2)(1,2)$，正是过原点、方向为 $(1,2)$ 的直线。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。组合可以是任意倍数，例如 $3\\mathbf{v}_1=(3,6)$ 也在其中，远不止这两个向量。</span></div>"
      },
      {
        id: 'ch01-q6', ch: 'ch01', type: 'mcq', difficulty: 1,
        kp: '1.2 Lengths and Dot Products', tags: ['compute'],
        stem: '设 $\\mathbf{u}=(2,-3)$，$\\mathbf{v}=(3,2)$，则这两个向量的位置关系或夹角是？',
        options: [
          { text: '平行且同向', correct: false },
          { text: '垂直，夹角为 $90^{\\circ}$', correct: true },
          { text: '夹角为 $60^{\\circ}$', correct: false },
          { text: '夹角为 $45^{\\circ}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。若平行则存在 $c$ 使 $(2,-3)=c(3,2)$，即 $2=3c$ 且 $-3=2c$，无解，两者不成比例。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$\\mathbf{u}\\cdot\\mathbf{v}=2\\cdot3+(-3)\\cdot2=0$，点积为零即两向量正交，夹角为 $90^{\\circ}$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\cos\\theta=\\frac{0}{\\sqrt{13}\\sqrt{13}}=0$，不是 $\\frac{1}{2}$，所以不是 $60^{\\circ}$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$45^{\\circ}$ 对应 $\\cos\\theta=\\frac{\\sqrt{2}}{2}$，而这里余弦值为 $0$。</span></div>"
      },
      {
        id: 'ch01-q7', ch: 'ch01', type: 'mcq', difficulty: 1,
        kp: '1.3 Matrices', tags: ['concept'],
        stem: '设 $A$ 是 $3\\times2$ 矩阵，$\\mathbf{x}=(x_1,x_2)$ 是二维列向量。关于 $A\\mathbf{x}$ 的说法正确的是？',
        options: [
          { text: '$A\\mathbf{x}=x_1\\mathbf{a}_1+x_2\\mathbf{a}_2$，即 $A$ 的两列以 $\\mathbf{x}$ 的分量为系数的组合，结果是三维向量', correct: true },
          { text: '$A\\mathbf{x}$ 是 $A$ 的两行的线性组合，结果是三维向量', correct: false },
          { text: '$A\\mathbf{x}$ 是 $A$ 的三行分别与 $\\mathbf{x}$ 求点积，所以结果是二维向量', correct: false },
          { text: '$A\\mathbf{x}$ 等于 $\\mathbf{x}$ 与 $A$ 第一列的点积，再加上 $A$ 的第二列', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。这就是矩阵乘向量的列组合视角：$A\\mathbf{x}=x_1\\mathbf{a}_1+x_2\\mathbf{a}_2$，两列都是三维的，结果仍是三维。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。行的组合给出的是 $A^{\\mathsf T}$ 的列的组合；$A\\mathbf{x}$ 用的是 $A$ 的列。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。做法对了一半（确实是行与 $\\mathbf{x}$ 求点积），但 $A$ 有三行，结果应有三个分量，是三维而非二维。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。系数要乘在对应的列上：$x_1\\mathbf{a}_1+x_2\\mathbf{a}_2$，不是把一个点积加到某一列上。</span></div>"
      },
      {
        id: 'ch01-q8', ch: 'ch01', type: 'mcq', difficulty: 2,
        kp: '1.3 Matrices', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$，$B=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$，则 $AB=$？',
        options: [
          { text: '$\\begin{bmatrix}2&2\\\\3&8\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}3&3\\\\4&6\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}4&10\\\\5&11\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}4&5\\\\10&11\\end{bmatrix}$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。这是逐项相乘（Hadamard 积）；矩阵乘法是 $A$ 的行与 $B$ 的列求点积再求和。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。这是对应元素相加，既没有相乘也没有把一行的各项累加。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。这里把 $(AB)_{ji}$ 当成了 $(AB)_{ij}$，整个乘积矩阵被转置了。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$AB=\\begin{bmatrix}1\\cdot2+2\\cdot1&1\\cdot1+2\\cdot2\\\\3\\cdot2+4\\cdot1&3\\cdot1+4\\cdot2\\end{bmatrix}=\\begin{bmatrix}4&5\\\\10&11\\end{bmatrix}$。</span></div>"
      },
      {
        id: 'ch01-q9', ch: 'ch01', type: 'mcq', difficulty: 2,
        kp: '1.1 Vectors and Linear Combinations', tags: ['concept', 'trap'],
        stem: '设 $\\mathbf{v}_1=(1,0,1)$，$\\mathbf{v}_2=(0,1,1)$，$\\mathbf{b}=(2,3,4)$。$\\mathbf{b}$ 能否写成 $\\mathbf{v}_1,\\mathbf{v}_2$ 的线性组合？',
        options: [
          { text: '能：取 $c_1=2$、$c_2=3$ 即可', correct: false },
          { text: '不能：前两个分量迫使 $c_1=2$、$c_2=3$，此时第三分量是 $5$，与 $4$ 不符', correct: true },
          { text: '能：因为 $\\mathbf{v}_1,\\mathbf{v}_2$ 线性无关，它们张成整个 $\\mathbb{R}^3$', correct: false },
          { text: '能：取 $c_1=1$、$c_2=3$ 即可（第三个分量正好凑成 $4$）', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$2\\mathbf{v}_1+3\\mathbf{v}_2=(2,3,5)$，第三分量是 $5$，不等于 $\\mathbf{b}$ 的第三分量 $4$。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。比较分量得 $c_1=2$、$c_2=3$、$c_1+c_2=4$，前两式与第三式矛盾，故 $\\mathbf{b}$ 不在张成空间内。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\mathbb{R}^3$ 中两个无关向量只张成一张平面；要张成整个 $\\mathbb{R}^3$ 至少需要三个无关向量。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$1\\mathbf{v}_1+3\\mathbf{v}_2=(1,3,4)$，第一分量是 $1$ 而不是 $2$，只凑对了第三个分量。</span></div>"
      },
      {
        id: 'ch01-q10', ch: 'ch01', type: 'mcq', difficulty: 2,
        kp: '1.2 Lengths and Dot Products', tags: ['compute'],
        stem: '设 $\\mathbf{u}=(1,0)$，$\\mathbf{v}=(1,\\sqrt{3})$，则 $\\mathbf{u}$ 与 $\\mathbf{v}$ 的夹角是？',
        options: [
          { text: '$30^{\\circ}$', correct: false },
          { text: '$45^{\\circ}$', correct: false },
          { text: '$60^{\\circ}$', correct: true },
          { text: '$90^{\\circ}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$\\cos\\theta=\\frac{1}{2}$ 对应 $60^{\\circ}$；$30^{\\circ}$ 对应的是 $\\cos\\theta=\\frac{\\sqrt{3}}{2}$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$\\cos45^{\\circ}=\\frac{\\sqrt{2}}{2}$，与算得的 $\\frac{1}{2}$ 不符。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$\\mathbf{u}\\cdot\\mathbf{v}=1$，$\\lVert\\mathbf{u}\\rVert=1$，$\\lVert\\mathbf{v}\\rVert=2$，故 $\\cos\\theta=\\frac{1}{2}$，$\\theta=60^{\\circ}$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。点积为 $1$ 而不是 $0$，两向量并不垂直。</span></div>"
      },
      {
        id: 'ch01-q11', ch: 'ch01', type: 'mcq', difficulty: 2,
        kp: '1.3 Matrices', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2&3\\\\4&5&6\\end{bmatrix}$，$\\mathbf{x}=(1,0,-1)$，则 $A\\mathbf{x}=$？',
        options: [
          { text: '$(2,2)$', correct: false },
          { text: '$(4,10)$', correct: false },
          { text: '$(2,10)$', correct: false },
          { text: '$(-2,-2)$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。两个分量都取反了；$x_3=-1$ 使第三列被减去，结果应为负。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。把 $x_3=-1$ 当成 $+1$，算成了 $\\mathbf{a}_1+\\mathbf{a}_3=(4,10)$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。第一分量符号错了，且第二分量同样把 $x_3=-1$ 当成 $+1$，两处都不对。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$A\\mathbf{x}=\\mathbf{a}_1-\\mathbf{a}_3=\\begin{bmatrix}1\\\\4\\end{bmatrix}-\\begin{bmatrix}3\\\\6\\end{bmatrix}=\\begin{bmatrix}-2\\\\-2\\end{bmatrix}$。</span></div>"
      },
      {
        id: 'ch01-q12', ch: 'ch01', type: 'mcq', difficulty: 1,
        kp: '1.3 Matrices', tags: ['concept'],
        stem: '设 $A$ 是 $3\\times2$ 矩阵，$B=\\begin{bmatrix}\\mathbf{b}_1&\\mathbf{b}_2\\end{bmatrix}$ 是 $2\\times2$ 矩阵。则 $AB$ 的第 2 列等于？',
        options: [
          { text: '$A\\mathbf{b}_2$', correct: true },
          { text: '$A$ 的第 2 列与 $\\mathbf{b}_2$ 逐分量相乘得到的向量', correct: false },
          { text: '$\\mathbf{b}_2 A$', correct: false },
          { text: '$A^{\\mathsf T}\\mathbf{b}_2$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$AB=\\begin{bmatrix}A\\mathbf{b}_1&A\\mathbf{b}_2\\end{bmatrix}$，第 2 列正是 $A$ 乘以 $B$ 的第 2 列。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。列是 $A$ 的各列以 $\\mathbf{b}_2$ 的分量为系数组合出来的，不是逐分量相乘。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\mathbf{b}_2$ 是二维列向量，不能左乘 $3\\times2$ 的 $A$，尺寸不匹配。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$A^{\\mathsf T}$ 是 $2\\times3$，用 $2\\times3$ 乘二维列向量 $\\mathbf{b}_2$ 无法进行。</span></div>"
      },
      {
        id: 'ch01-q13', ch: 'ch01', type: 'mcq', difficulty: 2,
        kp: '1.2 Lengths and Dot Products', tags: ['concept'],
        stem: '设 $\\lVert\\mathbf{u}\\rVert=2$，$\\lVert\\mathbf{v}\\rVert=3$。则 $\\mathbf{u}\\cdot\\mathbf{v}$ 的最大可能值是？',
        options: [
          { text: '$5$，即 $\\lVert\\mathbf{u}\\rVert+\\lVert\\mathbf{v}\\rVert$', correct: false },
          { text: '$13$，即 $\\lVert\\mathbf{u}\\rVert^2+\\lVert\\mathbf{v}\\rVert^2$', correct: false },
          { text: '$1$，即 $\\lvert 3-2\\rvert$', correct: false },
          { text: '$6$，即 $\\lVert\\mathbf{u}\\rVert\\lVert\\mathbf{v}\\rVert$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$\\lVert\\mathbf{u}\\rVert+\\lVert\\mathbf{v}\\rVert=5$ 是三角不等式里 $\\lVert\\mathbf{u}+\\mathbf{v}\\rVert$ 的上界，与点积无关。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$13$ 只是两个长度平方之和，点积不是平方和，不以此为上界。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$1$ 是长度之差；两向量反向时点积为 $-6$，绝对值仍可达 $6$，$1$ 显然不是上界。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。Cauchy–Schwarz 给出 $\\lvert\\mathbf{u}\\cdot\\mathbf{v}\\rvert\\le\\lVert\\mathbf{u}\\rVert\\lVert\\mathbf{v}\\rVert=6$，$\\mathbf{v}$ 与 $\\mathbf{u}$ 同向时取到 $6$。</span></div>"
      },
      {
        id: 'ch01-q14', ch: 'ch01', type: 'mcq', difficulty: 2,
        kp: '1.1 Vectors and Linear Combinations', tags: ['compute'],
        stem: '设 $\\mathbf{v}_1=(1,1,0)$，$\\mathbf{v}_2=(0,1,1)$，$\\mathbf{v}_3=(1,0,1)$，则 $\\mathbf{b}=(4,2,2)$ 等于？',
        options: [
          { text: '$2\\mathbf{v}_1+2\\mathbf{v}_2$', correct: false },
          { text: '$2\\mathbf{v}_1+2\\mathbf{v}_3$', correct: true },
          { text: '$\\mathbf{v}_1+\\mathbf{v}_2+\\mathbf{v}_3$', correct: false },
          { text: '$4\\mathbf{v}_1$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$2\\mathbf{v}_1+2\\mathbf{v}_2=(2,2,0)+(0,2,2)=(2,4,2)$，后两个分量对调了。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$2\\mathbf{v}_1+2\\mathbf{v}_3=(2,2,0)+(2,0,2)=(4,2,2)=\\mathbf{b}$，逐分量核对成立。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\mathbf{v}_1+\\mathbf{v}_2+\\mathbf{v}_3=(2,2,2)$，是三个向量取平均得到的分量，不是 $\\mathbf{b}$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$4\\mathbf{v}_1=(4,4,0)$，第二、第三分量与 $\\mathbf{b}$ 不符。</span></div>"
      },
      {
        id: 'ch01-q15', ch: 'ch01', type: 'mcq', difficulty: 2,
        kp: '1.3 Matrices', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&-1&0\\\\0&1&-1\\\\-1&0&1\\end{bmatrix}$，$\\mathbf{x}=(1,1,1)$，则 $A\\mathbf{x}=$？',
        options: [
          { text: '$\\begin{bmatrix}1\\\\1\\\\1\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}2\\\\2\\\\2\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}0\\\\0\\\\0\\end{bmatrix}$', correct: true },
          { text: '$\\begin{bmatrix}1\\\\0\\\\1\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。结果等于 $\\mathbf{x}$ 只在 $A=I$ 时成立；这里 $A$ 每行的元素之和都是 $0$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。这是把每行元素的绝对值相加，负号没有参与运算。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$A$ 的三列之和为零向量，故 $A\\mathbf{x}=\\mathbf{a}_1+\\mathbf{a}_2+\\mathbf{a}_3=\\mathbf{0}$；逐行算也是 $(0,0,0)$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。逐行相乘相加得 $(1-1+0,\\,0+1-1,\\,-1+0+1)=(0,0,0)$，不是 $(1,0,1)$。</span></div>"
      },
      {
        id: 'ch01-q16', ch: 'ch01', type: 'mcq', difficulty: 3,
        kp: '1.3 Matrices', tags: ['concept', 'trap'],
        stem: '设 $A,B,C$ 都是 $2\\times2$ 矩阵。下列结论一定成立的是？',
        options: [
          { text: '$A(B+C)=AB+AC$ 且 $(AB)C=A(BC)$', correct: true },
          { text: '$AB=BA$', correct: false },
          { text: '$(AB)^{\\mathsf T}=A^{\\mathsf T}B^{\\mathsf T}$', correct: false },
          { text: '若 $AB$ 是零矩阵，则 $A$ 与 $B$ 中至少有一个是零矩阵', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。矩阵乘法满足分配律与结合律，这两条对任意同阶方阵都成立，且不需要任何可逆性。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。取 $A=\\begin{bmatrix}1&1\\\\0&0\\end{bmatrix}$、$B=\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$，则 $AB$ 与 $BA$ 不相等，乘法一般不可交换。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。正确法则是 $(AB)^{\\mathsf T}=B^{\\mathsf T}A^{\\mathsf T}$，转置后因子顺序要反过来。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。取 $A=\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}$、$B=\\begin{bmatrix}0&0\\\\0&1\\end{bmatrix}$，$AB$ 是零矩阵但两者都不是零矩阵。</span></div>"
      },
      {
        id: 'ch01-q17', ch: 'ch01', type: 'mcq', difficulty: 2,
        kp: '1.2 Lengths and Dot Products', tags: ['proof'],
        stem: '设 $\\mathbf{x}\\in\\mathbb{R}^n$。下列哪一个是「$\\mathbf{x}^{\\mathsf T}\\mathbf{x}=0$ 当且仅当 $\\mathbf{x}=\\mathbf{0}$」的正确理由？',
        options: [
          { text: '因为 $\\mathbf{x}^{\\mathsf T}\\mathbf{x}=\\lVert\\mathbf{x}\\rVert$，而范数总不为零', correct: false },
          { text: '由 Cauchy–Schwarz，$\\lvert\\mathbf{x}^{\\mathsf T}\\mathbf{x}\\rvert\\le\\lVert\\mathbf{x}\\rVert^2$，所以它只能为 $0$', correct: false },
          { text: '因为点积对称，$\\mathbf{x}^{\\mathsf T}\\mathbf{x}=\\mathbf{x}^{\\mathsf T}\\mathbf{x}$', correct: false },
          { text: '因为 $\\mathbf{x}^{\\mathsf T}\\mathbf{x}=x_1^2+\\cdots+x_n^2$ 是 $n$ 个实数平方之和，非负且仅当每个 $x_i=0$ 时为零', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$\\mathbf{x}^{\\mathsf T}\\mathbf{x}=\\lVert\\mathbf{x}\\rVert^2$ 而不是 $\\lVert\\mathbf{x}\\rVert$；且 $\\mathbf{x}=\\mathbf{0}$ 时范数确实为 $0$，说法自相矛盾。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。Cauchy–Schwarz 只给上界，$\\lvert\\mathbf{x}^{\\mathsf T}\\mathbf{x}\\rvert\\le\\lVert\\mathbf{x}\\rVert^2$ 对任何 $\\mathbf{x}$ 都成立，推不出它等于 $0$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。对称性只说明左右两边相同，是同义反复，没有用到任何关于平方和的信息，不构成证明。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$x_1^2+\\cdots+x_n^2=0$ 等价于每一项为零，即每个分量 $x_i=0$，故 $\\mathbf{x}=\\mathbf{0}$；反之代入即得 $0$。</span></div>"
      },
      {
        id: 'ch01-q18', ch: 'ch01', type: 'mcq', difficulty: 3,
        kp: '1.1 Vectors and Linear Combinations', tags: ['concept'],
        stem: '设 $\\mathbf{v}_1=(1,0)$，$\\mathbf{v}_2=(0,1)$，$\\mathbf{v}_3=(1,1)$，$\\mathbf{b}=(2,1)$。关于把 $\\mathbf{b}$ 表成 $\\mathbf{v}_1,\\mathbf{v}_2,\\mathbf{v}_3$ 的线性组合，正确的说法是？',
        options: [
          { text: '表示唯一，系数只能取 $2,1,0$', correct: false },
          { text: '表示不唯一：$2\\mathbf{v}_1+\\mathbf{v}_2$ 与 $\\mathbf{v}_1+\\mathbf{v}_3$ 都等于 $\\mathbf{b}$', correct: true },
          { text: '无法表示，因为这三个向量都落在 $\\mathbb{R}^2$ 里', correct: false },
          { text: '表示唯一，因为 $\\mathbf{v}_1,\\mathbf{v}_2$ 线性无关', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$(2,1,0)$ 确实是一种系数，但存在别的系数也得到 $\\mathbf{b}$，所以并不唯一。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$2\\mathbf{v}_1+\\mathbf{v}_2=(2,1)$，$\\mathbf{v}_1+\\mathbf{v}_3=(1,0)+(1,1)=(2,1)$，同一向量有两种不同系数。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。向量都在 $\\mathbb{R}^2$ 中不影响能否组合出 $\\mathbf{b}$，这里恰好能表示，而且还很多。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\mathbf{v}_1,\\mathbf{v}_2$ 无关只保证用它们两个表示时系数唯一；再加上 $\\mathbf{v}_3=\\mathbf{v}_1+\\mathbf{v}_2$ 就不唯一了。</span></div>"
      },
      {
        id: 'ch01-q19', ch: 'ch01', type: 'mcq', difficulty: 3,
        kp: '1.2 Lengths and Dot Products', tags: ['compute'],
        stem: '设 $\\mathbf{a}=(1,1,1)$，$\\mathbf{b}=(3,1,2)$，则 $\\mathbf{b}$ 在 $\\mathbf{a}$ 上的投影向量 $\\mathbf{p}=\\frac{\\mathbf{a}^{\\mathsf T}\\mathbf{b}}{\\mathbf{a}^{\\mathsf T}\\mathbf{a}}\\mathbf{a}$ 是？',
        options: [
          { text: '$(2,2,2)$', correct: true },
          { text: '$(6,6,6)$', correct: false },
          { text: '$(1,-1,0)$', correct: false },
          { text: '$(3,1,2)$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$\\mathbf{a}^{\\mathsf T}\\mathbf{b}=3+1+2=6$，$\\mathbf{a}^{\\mathsf T}\\mathbf{a}=3$，故 $\\mathbf{p}=2(1,1,1)=(2,2,2)$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。直接用 $(\\mathbf{a}^{\\mathsf T}\\mathbf{b})\\mathbf{a}=6(1,1,1)$，漏掉了除以 $\\mathbf{a}^{\\mathsf T}\\mathbf{a}=3$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$(1,-1,0)=\\mathbf{b}-\\mathbf{p}$ 是与 $\\mathbf{a}$ 垂直的误差向量，不是投影本身。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。投影一般不等于 $\\mathbf{b}$；只有 $\\mathbf{b}$ 已在 $\\mathbf{a}$ 的方向上时才有 $\\mathbf{p}=\\mathbf{b}$。</span></div>"
      },
      {
        id: 'ch01-q20', ch: 'ch01', type: 'mcq', difficulty: 3,
        kp: '1.3 Matrices', tags: ['concept'],
        stem: '设 $A$ 是 $2\\times3$ 矩阵，$B$ 是 $3\\times2$ 矩阵。则 $(AB)^{\\mathsf T}$ 是 $2\\times2$ 矩阵，且它等于？',
        options: [
          { text: '$AB$', correct: false },
          { text: '$A^{\\mathsf T}B^{\\mathsf T}$', correct: false },
          { text: '$B^{\\mathsf T}A^{\\mathsf T}$', correct: true },
          { text: '$(BA)^{\\mathsf T}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$AB$ 与它的转置一般不相等，只有 $AB$ 本身对称时才相同。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$A^{\\mathsf T}$ 是 $3\\times2$、$B^{\\mathsf T}$ 是 $2\\times3$，$A^{\\mathsf T}B^{\\mathsf T}$ 是 $3\\times3$，尺寸就不对。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。转置要反序：$(AB)^{\\mathsf T}=B^{\\mathsf T}A^{\\mathsf T}$，即 $2\\times3$ 乘 $3\\times2$，恰得 $2\\times2$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$BA$ 是 $3\\times3$，$(BA)^{\\mathsf T}$ 也是 $3\\times3$，与 $(AB)^{\\mathsf T}$ 的尺寸不同。</span></div>"
      },
      /* ---------------- ch02 · Solving Linear Equations（20 题） ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', type: 'mcq', difficulty: 1,
        kp: '2.1 Vectors and Linear Equations', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2\\\\3&1\\end{bmatrix}$，$\\mathbf{b}=(3,4)$，则方程 $A\\mathbf{x}=\\mathbf{b}$ 的解是？',
        options: [
          { text: '$\\begin{bmatrix}1\\\\1\\end{bmatrix}$', correct: true },
          { text: '$\\begin{bmatrix}2\\\\1\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}1\\\\2\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}-1\\\\1\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$1\\begin{bmatrix}1\\\\3\\end{bmatrix}+1\\begin{bmatrix}2\\\\1\\end{bmatrix}=\\begin{bmatrix}3\\\\4\\end{bmatrix}=\\mathbf{b}$，两个分量都核对无误。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。代入得 $(1\\cdot2+2\\cdot1,\\,3\\cdot2+1\\cdot1)=(4,7)$，不等于 $\\mathbf{b}=(3,4)$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。代入得 $(1+4,\\,3+2)=(5,5)$，两分量都不对。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。代入得 $(-1+2,\\,-3+1)=(1,-2)$，不等于 $\\mathbf{b}$。</span></div>"
      },
      {
        id: 'ch02-q2', ch: 'ch02', type: 'mcq', difficulty: 1,
        kp: '2.2 The Idea of Elimination', tags: ['compute'],
        stem: '对 $A=\\begin{bmatrix}2&4\\\\3&1\\end{bmatrix}$ 用第一个主元消去 $(2,1)$ 元，消元后 $A$ 的第二行变为？',
        options: [
          { text: '$(3,1)-\\frac{2}{3}(2,4)=\\left(\\frac{5}{3},-\\frac{5}{3}\\right)$', correct: false },
          { text: '$(3,1)-3(2,4)=(-3,-11)$', correct: false },
          { text: '$(3,1)-\\frac{3}{2}(2,4)=(0,-5)$', correct: true },
          { text: '$(3,1)-2(2,4)=(-1,-7)$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。乘数写反了，应为 $\\frac{a_{21}}{a_{11}}=\\frac{3}{2}$；用 $\\frac{2}{3}$ 消不掉 $(2,1)$ 元。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。取乘数为 $3$ 等于把主元当成 $1$，实际主元是 $2$，第一列不会变成 $0$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。乘数 $\\ell_{21}=\\frac{3}{2}$，第二行减去 $\\frac{3}{2}$ 倍第一行，得 $(0,\\,1-6)=(0,-5)$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。乘数 $2$ 来自第二列之比 $\\frac{4}{2}$，消元要用第一列之比 $\\frac{3}{2}$。</span></div>"
      },
      {
        id: 'ch02-q3', ch: 'ch02', type: 'mcq', difficulty: 1,
        kp: '2.3 Elimination Using Matrices', tags: ['concept'],
        stem: '设 $A$ 是 $2\\times2$ 矩阵，$E=\\begin{bmatrix}1&0\\\\-3&1\\end{bmatrix}$。用 $E$ 左乘 $A$ 相当于对 $A$ 做什么变换？',
        options: [
          { text: '把第 2 行减去第 1 行的 $3$ 倍', correct: true },
          { text: '把第 1 行减去第 2 行的 $3$ 倍', correct: false },
          { text: '把第 2 列减去第 1 列的 $3$ 倍', correct: false },
          { text: '把第 2 行加上第 1 行的 $3$ 倍', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$E$ 的第二行是 $(-3,1)$，$(EA)$ 的第 2 行 $=-3R_1+R_2$，正是第 2 行减去第 1 行的 $3$ 倍。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。左乘 $E$ 改变的是第二行，不是第一行；$E$ 的第一行 $(1,0)$ 说明第一行保持不变。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。左乘做的是行变换，右乘才做列变换。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$(-3,1)$ 表示减 $3$ 倍而不是加 $3$ 倍，符号写反了。</span></div>"
      },
      {
        id: 'ch02-q4', ch: 'ch02', type: 'mcq', difficulty: 1,
        kp: '2.4 Rules for Matrix Operations', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2\\\\0&1\\end{bmatrix}$，$B=\\begin{bmatrix}3&1\\\\2&4\\end{bmatrix}$，则 $AB$ 的 $(1,2)$ 元（第 1 行第 2 列）是？',
        options: [
          { text: '$7$', correct: false },
          { text: '$9$', correct: true },
          { text: '$8$', correct: false },
          { text: '$4$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$7=1\\cdot3+2\\cdot2$ 是 $(1,1)$ 元，用的是 $B$ 的第 1 列。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$A$ 的第 1 行 $(1,2)$ 与 $B$ 的第 2 列 $(1,4)$ 求点积：$1\\cdot1+2\\cdot4=9$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$8=2\\cdot4$ 只算了第二项，漏掉 $1\\cdot1$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$4$ 是 $B$ 自己的 $(2,2)$ 元，不是乘积矩阵的元素。</span></div>"
      },
      {
        id: 'ch02-q5', ch: 'ch02', type: 'mcq', difficulty: 1,
        kp: '2.5 Inverse Matrices', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$，则 $A^{-1}=$？',
        options: [
          { text: '$\\frac{1}{2}\\begin{bmatrix}4&-2\\\\-3&1\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}4&-2\\\\-3&1\\end{bmatrix}$', correct: false },
          { text: '$\\frac{1}{-2}\\begin{bmatrix}4&2\\\\3&1\\end{bmatrix}$', correct: false },
          { text: '$\\frac{1}{-2}\\begin{bmatrix}4&-2\\\\-3&1\\end{bmatrix}$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。把 $\\det A$ 算成了 $2$（错用 $4-2$），正确值是 $1\\cdot4-2\\cdot3=-2$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。忘记除以 $\\det A=-2$，只写了伴随矩阵。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。副对角线元素没有取负号；逆矩阵公式里 $b,c$ 都要变号。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$\\det A=4-6=-2$，$A^{-1}=\\frac{1}{\\det A}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}=\\frac{1}{-2}\\begin{bmatrix}4&-2\\\\-3&1\\end{bmatrix}$；用 $[A\\mid I]$ 行化简到 $[I\\mid A^{-1}]$ 结果相同。</span></div>"
      },
      {
        id: 'ch02-q6', ch: 'ch02', type: 'mcq', difficulty: 1,
        kp: '2.6 Elimination = Factorization: A = LU', tags: ['compute'],
        stem: '把 $A=\\begin{bmatrix}4&1\\\\8&3\\end{bmatrix}$ 分解为 $A=LU$，其中 $L$ 是单位下三角、$U$ 是上三角，则 $L=$？',
        options: [
          { text: '$\\begin{bmatrix}1&0\\\\\\frac{1}{2}&1\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}1&0\\\\2&1\\end{bmatrix}$', correct: true },
          { text: '$\\begin{bmatrix}4&0\\\\8&1\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}1&2\\\\0&1\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。乘数应为 $\\frac{a_{21}}{a_{11}}=\\frac{8}{4}=2$，写成 $\\frac{1}{2}$ 方向反了。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$\\ell_{21}=2$，$U=\\begin{bmatrix}4&1\\\\0&1\\end{bmatrix}$，$L=\\begin{bmatrix}1&0\\\\2&1\\end{bmatrix}$，验算 $LU=A$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$L$ 的对角元必须全为 $1$（单位下三角），主元属于 $U$ 的对角线。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。这是上三角矩阵，而 $L$ 必须是下三角；乘数应放在 $(2,1)$ 位置。</span></div>"
      },
      {
        id: 'ch02-q7', ch: 'ch02', type: 'mcq', difficulty: 1,
        kp: '2.7 Transposes and Permutations', tags: ['concept'],
        stem: '下列矩阵中，是对称矩阵的是？',
        options: [
          { text: '$\\begin{bmatrix}1&2\\\\2&5\\end{bmatrix}$', correct: true },
          { text: '$\\begin{bmatrix}1&2\\\\3&5\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}0&1\\\\-1&0\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}1&0&2\\\\0&1&0\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$(1,2)$ 元与 $(2,1)$ 元都是 $2$，且为方阵，满足 $A^{\\mathsf T}=A$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$(1,2)$ 元是 $2$、$(2,1)$ 元是 $3$，转置后互换，不相等。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$(1,2)$ 元是 $1$、$(2,1)$ 元是 $-1$，这是反对称矩阵，不是对称矩阵。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$2\\times3$ 不是方阵，$A^{\\mathsf T}$ 与 $A$ 尺寸都不同，谈不上对称。</span></div>"
      },
      {
        id: 'ch02-q8', ch: 'ch02', type: 'mcq', difficulty: 2,
        kp: '2.1 Vectors and Linear Equations', tags: ['concept', 'trap'],
        stem: '方程组 $x+2y=3$，$2x+4y=6$ 的解的情况是？',
        options: [
          { text: '无解，因为第二个方程是第一个方程的 $2$ 倍', correct: false },
          { text: '有无穷多解：所有满足 $x+2y=3$ 的 $(x,y)$', correct: true },
          { text: '唯一解 $(3,0)$', correct: false },
          { text: '唯一解 $(1,1)$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。两式等价并不矛盾；消元后第二行化为 $(0,0\\mid0)$，而不是 $(0,0\\mid c)$ 那种无解情形。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。两个方程是同一条直线，解集为 $(3-2t,\\,t)$，$t$ 任意，故有无穷多解。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$(3,0)$ 只满足第一个方程，是解集中的一点，不能因为它符合就当成唯一解。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$(1,1)$ 同样满足 $x+2y=3$，也只是解集中的一个点，不是唯一解。</span></div>"
      },
      {
        id: 'ch02-q9', ch: 'ch02', type: 'mcq', difficulty: 2,
        kp: '2.2 The Idea of Elimination', tags: ['compute'],
        stem: '对 $A=\\begin{bmatrix}1&2&1\\\\2&5&3\\\\1&3&3\\end{bmatrix}$ 做消元，得到上三角矩阵 $U$。则 $U$ 的第三行是？',
        options: [
          { text: '$(0,1,2)$', correct: false },
          { text: '$(0,1,1)$', correct: false },
          { text: '$(0,0,2)$', correct: false },
          { text: '$(0,0,1)$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$(0,1,2)=R_3-R_1$ 只是第一次消元的结果，还要用第二个主元继续消去它。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$(0,1,1)=R_2-2R_1$ 是 $U$ 的第二行，不是第三行。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$(0,0,2)$ 少减了一次；应为 $(0,1,2)-(0,1,1)=(0,0,1)$。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$R_2-2R_1=(0,1,1)$，$R_3-R_1=(0,1,2)$，再作 $R_3\\leftarrow R_3-R_2$ 得 $(0,0,1)$。</span></div>"
      },
      {
        id: 'ch02-q10', ch: 'ch02', type: 'mcq', difficulty: 2,
        kp: '2.3 Elimination Using Matrices', tags: ['compute'],
        stem: '设 $E=\\begin{bmatrix}1&0&0\\\\-2&1&0\\\\0&0&1\\end{bmatrix}$，$A=\\begin{bmatrix}2&1&0\\\\4&1&3\\\\0&2&1\\end{bmatrix}$，则 $EA$ 的第二行是？',
        options: [
          { text: '$(0,3,-1)$', correct: false },
          { text: '$(4,1,3)$', correct: false },
          { text: '$(0,-1,3)$', correct: true },
          { text: '$(0,1,3)$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。分量顺序搞反：第一列相消得 $4-2\\cdot2=0$，第二列是 $1-2\\cdot1=-1$，不是 $(0,3,-1)$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。这是原来的第二行，说明左乘没有生效；$E$ 的第二行并不是 $(0,1,0)$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$E$ 的第二行 $(-2,1,0)$ 组合 $A$ 的三行：$-2R_1+R_2=(0,-1,3)$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。第二分量 $1-2\\cdot1=-1$ 而不是 $1$，符号漏掉了。</span></div>"
      },
      {
        id: 'ch02-q11', ch: 'ch02', type: 'mcq', difficulty: 2,
        kp: '2.4 Rules for Matrix Operations', tags: ['concept'],
        stem: '设 $A$ 为 $3\\times2$ 矩阵，$B$ 为 $2\\times4$ 矩阵。关于乘积 $AB$ 的说法正确的是？',
        options: [
          { text: '$AB$ 的 $(i,j)$ 元是 $A$ 的第 $i$ 行与 $B$ 的第 $j$ 列的点积', correct: true },
          { text: '$AB$ 的 $(i,j)$ 元是 $A$ 的第 $j$ 行与 $B$ 的第 $i$ 列的点积', correct: false },
          { text: '$AB$ 的第 $j$ 行是 $B$ 的各行的组合，系数取自 $B$ 的第 $j$ 行', correct: false },
          { text: '$AB$ 的第 $i$ 列是 $B$ 的各列的组合，系数取自 $A$ 的第 $i$ 列', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。这是行乘列的算法：$(AB)_{ij}=\\sum_k a_{ik}b_{kj}$，即 $A$ 的第 $i$ 行与 $B$ 的第 $j$ 列求点积。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。行、列的下标对调了；$A$ 只有 $2$ 行，$j$ 取到 $3$、$4$ 时第 $j$ 行根本不存在。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$AB$ 的第 $j$ 行确实是 $B$ 的各行的组合，但系数取自 $A$ 的第 $j$ 行，不是 $B$ 自己的行。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$AB$ 的第 $i$ 列是 $A$ 的各列的组合，系数取自 $B$ 的第 $i$ 列；这里把两个矩阵说反了。</span></div>"
      },
      {
        id: 'ch02-q12', ch: 'ch02', type: 'mcq', difficulty: 1,
        kp: '2.5 Inverse Matrices', tags: ['concept'],
        stem: '设 $A,B$ 都是 $2\\times2$ 可逆矩阵，则 $(AB)^{-1}=$？',
        options: [
          { text: '$A^{-1}B^{-1}$', correct: false },
          { text: '$AB$', correct: false },
          { text: '$B^{-1}A^{-1}$', correct: true },
          { text: '$A^{-1}+B^{-1}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。顺序必须反过来；$A^{-1}B^{-1}$ 实际上是 $(BA)^{-1}$，一般不等于 $(AB)^{-1}$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$AB$ 只有在 $A^2=I$ 这类特殊情形下才等于自己的逆，一般不是。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$(AB)(B^{-1}A^{-1})=A(BB^{-1})A^{-1}=AA^{-1}=I$，故 $(AB)^{-1}=B^{-1}A^{-1}$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。逆矩阵不是逐项取倒数再相加；$A^{-1}+B^{-1}$ 与 $AB$ 相乘一般得不到 $I$。</span></div>"
      },
      {
        id: 'ch02-q13', ch: 'ch02', type: 'mcq', difficulty: 2,
        kp: '2.6 Elimination = Factorization: A = LU', tags: ['concept'],
        stem: '对 $A=\\begin{bmatrix}0&2\\\\3&1\\end{bmatrix}$ 做 $PA=LU$ 的分解，则置换矩阵 $P=$？',
        options: [
          { text: '$I$，因为可以直接消元', correct: false },
          { text: '$\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$', correct: true },
          { text: '$\\begin{bmatrix}1&0\\\\1&1\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}0&1\\\\-1&0\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$(1,1)$ 元是 $0$，不能作主元，必须先交换第一行与第二行。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。交换两行得 $PA=\\begin{bmatrix}3&1\\\\0&2\\end{bmatrix}$ 已是上三角，此时 $L=I$、$U=\\begin{bmatrix}3&1\\\\0&2\\end{bmatrix}$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。这是 $L$ 的形状（单位下三角），不是置换矩阵；$P$ 每行每列恰有一个 $1$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。置换矩阵的元素只能是 $0$ 或 $1$，不能出现 $-1$。</span></div>"
      },
      {
        id: 'ch02-q14', ch: 'ch02', type: 'mcq', difficulty: 2,
        kp: '2.7 Transposes and Permutations', tags: ['concept'],
        stem: '设 $A$ 是 $2\\times3$ 矩阵，$B$ 是 $3\\times3$ 矩阵。下列等式恒成立的是？',
        options: [
          { text: '$(AB)^{\\mathsf T}=A^{\\mathsf T}B^{\\mathsf T}$', correct: false },
          { text: '$(AB)^{\\mathsf T}=B^{\\mathsf T}A^{\\mathsf T}$', correct: true },
          { text: '$AB=BA$', correct: false },
          { text: '$(AB)^{\\mathsf T}=A^{\\mathsf T}B$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$A^{\\mathsf T}$ 是 $3\\times2$、$B^{\\mathsf T}$ 是 $3\\times3$，中间维数 $2$ 与 $3$ 不符，$A^{\\mathsf T}B^{\\mathsf T}$ 无法相乘。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。转置要反序：$(AB)^{\\mathsf T}=B^{\\mathsf T}A^{\\mathsf T}$，$3\\times3$ 乘 $3\\times2$ 得 $3\\times2$，与左边尺寸一致。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$AB$ 是 $2\\times3$、$BA$ 是 $3\\times3$，尺寸都不同，不可能相等。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$A^{\\mathsf T}$ 为 $3\\times2$、$B$ 为 $3\\times3$，中间维数不匹配，乘积没有定义。</span></div>"
      },
      {
        id: 'ch02-q15', ch: 'ch02', type: 'mcq', difficulty: 3,
        kp: '2.1 Vectors and Linear Equations', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&0&2\\\\0&1&3\\end{bmatrix}$，$\\mathbf{b}=(4,5)$，则 $A\\mathbf{x}=\\mathbf{b}$ 的解是？',
        options: [
          { text: '唯一解 $(4,5,0)$', correct: false },
          { text: '无解，因为未知数比方程多', correct: false },
          { text: '无穷多解：$(4-2t,\\,5-3t,\\,t)$，$t$ 任意', correct: true },
          { text: '唯一解 $(4,5,1)$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$(4,5,0)$ 只是 $t=0$ 时的一个解；取 $t=1$ 得 $(2,2,1)$，代入同样满足两个方程。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。未知数多于方程不等于无解；这里前两列已张成 $\\mathbb{R}^2$，任何 $\\mathbf{b}$ 都可解，第三列带来的是自由变量。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。由 $x_1+2x_3=4$、$x_2+3x_3=5$，令自由变量 $x_3=t$，得 $(4-2t,\\,5-3t,\\,t)$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。代入 $x=(4,5,1)$ 得第一分量 $4+2\\cdot1=6\\ne4$，不满足方程。</span></div>"
      },
      {
        id: 'ch02-q16', ch: 'ch02', type: 'mcq', difficulty: 3,
        kp: '2.2 The Idea of Elimination', tags: ['concept', 'trap'],
        stem: '关于消元与行最简形（RREF）的说法，正确的是？',
        options: [
          { text: '任何矩阵都能只用初等行变换化成 RREF，且这个 RREF 是唯一的', correct: true },
          { text: '化成 RREF 的结果不唯一，取决于消元的先后顺序', correct: false },
          { text: '消元时主元必须始终保持为整数，否则就要换行', correct: false },
          { text: '若某一行化为 $(0,0,\\dots,0\\mid0)$，则方程组一定无解', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。初等行变换不改变解集，且每个矩阵的 RREF 唯一，所以可以用 RREF 直接读出解集。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。中间步骤会因消元顺序不同而不同，但最终的 RREF 相同；唯一性正是 RREF 与一般行阶梯形的关键区别。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。主元允许是分数，也可以乘非零常数化为 $1$；只有主元位置为 $0$ 时才需要换行。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$(0,\\dots,0\\mid0)$ 表示 $0=0$，该行多余、对应自由变量，方程组仍可能有解；无解对应的是 $(0,\\dots,0\\mid c)$ 且 $c$ 非零。</span></div>"
      },
      {
        id: 'ch02-q17', ch: 'ch02', type: 'mcq', difficulty: 2,
        kp: '2.3 Elimination Using Matrices', tags: ['proof'],
        stem: '有人断言「任何 $2\\times2$ 矩阵都能不换行、只用一次消元化成上三角」，并以 $A=\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$ 为例照此办理。这个论证错在哪里？',
        options: [
          { text: '它没有计算 $\\det A$，而 $\\det A=0$ 说明该矩阵不能消元', correct: false },
          { text: '它把阶数搞错了，消元只适用于 $3\\times3$ 以上的矩阵', correct: false },
          { text: '它没有把主元化为 $1$，所以得到的不是上三角矩阵', correct: false },
          { text: '它没有先检查 $(1,1)$ 元是否为 $0$；这里 $(1,1)$ 元为 $0$，必须先交换两行，此时应写成 $PA=LU$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$\\det A=0\\cdot0-1\\cdot1=-1\\ne0$，$A$ 可逆，问题并不在行列式。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。消元对任意阶矩阵都适用，与阶数无关。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。上三角只要求主对角线下方为零，并不要求主元为 $1$；把主元化为 $1$ 是 RREF 的要求。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$(1,1)$ 元为 $0$ 时不能作主元，必须先交换第一、二行，此时分解应写成 $PA=LU$ 而不是 $A=LU$。</span></div>"
      },
      {
        id: 'ch02-q18', ch: 'ch02', type: 'mcq', difficulty: 3,
        kp: '2.4 Rules for Matrix Operations', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2\\\\0&1\\end{bmatrix}$，$B=\\begin{bmatrix}1&0\\\\2&1\\end{bmatrix}$，则 $AB-BA=$？',
        options: [
          { text: '$\\begin{bmatrix}0&0\\\\0&0\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}4&0\\\\0&-4\\end{bmatrix}$', correct: true },
          { text: '$\\begin{bmatrix}-4&0\\\\0&4\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}4&0\\\\0&4\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。这等于假设 $AB=BA$；本题 $AB=\\begin{bmatrix}5&2\\\\2&1\\end{bmatrix}$、$BA=\\begin{bmatrix}1&2\\\\2&5\\end{bmatrix}$，并不相等。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$AB=\\begin{bmatrix}5&2\\\\2&1\\end{bmatrix}$，$BA=\\begin{bmatrix}1&2\\\\2&5\\end{bmatrix}$，相减得 $\\begin{bmatrix}4&0\\\\0&-4\\end{bmatrix}$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。这是 $BA-AB$，把顺序颠倒后符号整体反了。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。把两个对角元都当成 $+4$；$(2,2)$ 元应为 $1-5=-4$。</span></div>"
      },
      {
        id: 'ch02-q19', ch: 'ch02', type: 'mcq', difficulty: 2,
        kp: '2.5 Inverse Matrices', tags: ['concept'],
        stem: '设 $A$ 是 $2\\times2$ 矩阵，且 $A\\mathbf{x}=\\mathbf{0}$ 有非零解 $\\mathbf{x}=(1,2)$。则关于 $A$ 的正确说法是？',
        options: [
          { text: '$A$ 必须是零矩阵', correct: false },
          { text: '$A$ 可逆，因为 $\\mathbf{x}=(1,2)$ 不是零向量', correct: false },
          { text: '$\\det A=1$，因为 $\\mathbf{x}$ 的两个分量是 $1$ 和 $2$', correct: false },
          { text: '$A$ 的两列线性相关，$\\det A=0$，因此 $A$ 不可逆', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。取 $A=\\begin{bmatrix}2&-1\\\\4&-2\\end{bmatrix}$，$A(1,2)=(2-2,\\,4-4)=\\mathbf{0}$，但 $A$ 不是零矩阵。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。可逆矩阵的零空间只有 $\\mathbf{0}$；既然存在非零解，$A$ 一定不可逆。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\det A$ 必须为 $0$，$\\mathbf{x}$ 的分量取什么数值与行列式无关。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。非零向量 $(1,2)$ 使 $A\\mathbf{x}=\\mathbf{0}$，说明两列线性相关，于是 $\\det A=0$，$A$ 奇异不可逆。</span></div>"
      },
      {
        id: 'ch02-q20', ch: 'ch02', type: 'mcq', difficulty: 3,
        kp: '2.6 Elimination = Factorization: A = LU', tags: ['concept'],
        stem: '设 $A$ 是可逆的 $n\\times n$ 矩阵，且消元过程中不需要交换行。关于 $A=LU$ 分解，正确的说法是？',
        options: [
          { text: '$L$ 的对角元就是消元得到的主元', correct: false },
          { text: '分解不唯一，$L$ 可以任意选取', correct: false },
          { text: '分解唯一：$L$ 是对角元全为 $1$ 的下三角矩阵，$U$ 的对角元正是各步主元', correct: true },
          { text: '$U$ 必须是对角元全为 $1$ 的上三角矩阵', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$L$ 的对角元规定为 $1$；主元在 $U$ 的对角线上，不在 $L$ 上。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。在「$L$ 为单位下三角」的规定下分解唯一；$L$ 的 $(i,j)$ 元就是消元乘数 $\\ell_{ij}$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$U$ 的对角元就是各步主元，$L$ 记录乘数且对角元全为 $1$，两者都由 $A$ 唯一决定。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$U$ 的对角元是主元，一般不等于 $1$；对角元全为 $1$ 的是 $L$。</span></div>"
      },
      /* ---------------- ch03 · Vector Spaces and Subspaces（20 题） ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', type: 'mcq', difficulty: 1,
        kp: '3.1 Spaces of Vectors', tags: ['concept'],
        stem: '下列 $\\mathbb{R}^2$ 的子集中，对向量加法与数乘都封闭（即构成子空间）的是？',
        options: [
          { text: '$\\{(x,y):y=2x\\}$', correct: true },
          { text: '$\\{(x,y):y=x+1\\}$', correct: false },
          { text: '$\\{(x,y):x\\geq 0\\}$', correct: false },
          { text: '$\\{(x,y):x^2+y^2=1\\}$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。过原点的直线对加法与数乘都封闭：$(x,2x)+(x',2x')=(x+x',2(x+x'))$ 仍在集合内，$c(x,2x)=(cx,2cx)$ 也在。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$(0,1)$ 在集合内，但 $2(0,1)=(0,2)$ 不在，数乘不封闭；这是不过原点的直线，一定不含零向量。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$(1,0)$ 在集合内，但 $(-1)(1,0)=(-1,0)$ 的第一分量为负，不在集合内，数乘不封闭。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$(1,0)$ 与 $(0,1)$ 都在单位圆上，但它们之和 $(1,1)$ 不在圆上，加法不封闭。</span></div>"
      },
      {
        id: 'ch03-q2', ch: 'ch03', type: 'mcq', difficulty: 1,
        kp: '3.2 The Nullspace of A: Solving Ax = 0 and Rx = 0', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2&3\\\\2&4&7\\end{bmatrix}$，则零空间 $N(A)$ 的一个基是？',
        options: [
          { text: '$(2,1,0)$', correct: false },
          { text: '$(0,0,1)$', correct: false },
          { text: '$(-2,1,0)$', correct: true },
          { text: '$(-2,1,1)$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。代入第一行得 $2+2\\cdot1+3\\cdot0=4\\ne0$，该向量不在 $N(A)$ 中。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$(0,0,1)$ 代入第一行得 $3\\ne0$；$x_3$ 是主元变量恒取 $0$，不能当自由变量。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。消元得 $R=\\begin{bmatrix}1&2&0\\\\0&0&1\\end{bmatrix}$，$x_2$ 自由，$x_1=-2x_2$、$x_3=0$，取 $x_2=1$ 即得 $(-2,1,0)$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$(-2,1,1)$ 代入第一行得 $-2+2+3=3\\ne0$，它把本应为 $0$ 的 $x_3$ 也设成了 $1$。</span></div>"
      },
      {
        id: 'ch03-q3', ch: 'ch03', type: 'mcq', difficulty: 1,
        kp: '3.1 Spaces of Vectors', tags: ['concept'],
        stem: '设 $A$ 是 $3\\times 4$ 矩阵。下列关于列空间 $C(A)$ 的说法正确的是？',
        options: [
          { text: '$C(A)$ 是 $\\mathbb{R}^4$ 的子空间', correct: false },
          { text: '$C(A)$ 等于 $A$ 的行向量张成的空间', correct: false },
          { text: '$C(A)=N(A)$', correct: false },
          { text: '$C(A)$ 是 $\\mathbb{R}^3$ 的子空间，由 $A$ 的四个列向量的一切线性组合组成', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$A$ 的每个列向量只有 $3$ 个分量，故 $C(A)\\subseteq\\mathbb{R}^3$；$\\mathbb{R}^4$ 中放的是 $N(A)$ 与 $C(A^{\\mathsf T})$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。行向量张成的是行空间 $C(A^{\\mathsf T})\\subseteq\\mathbb{R}^4$，与列空间一般不是同一个空间。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$N(A)\\subseteq\\mathbb{R}^4$ 是 $A\\mathbf{x}=\\mathbf{0}$ 的解集，与列空间连所在空间都不同。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$A\\mathbf{x}$ 恰是四个列向量按 $x_1,x_2,x_3,x_4$ 的线性组合，故 $C(A)$ 就是列向量的张成，且位于 $\\mathbb{R}^3$。</span></div>"
      },
      {
        id: 'ch03-q4', ch: 'ch03', type: 'mcq', difficulty: 1,
        kp: '3.3 The Complete Solution to Ax = b', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$，$\\mathbf{b}=(3,6)$。方程组 $A\\mathbf{x}=\\mathbf{b}$ 的完整解是？',
        options: [
          { text: '$\\mathbf{x}=(3,0)+t(2,1)$', correct: false },
          { text: '$\\mathbf{x}=(3,0)$，且是唯一解', correct: false },
          { text: '$\\mathbf{x}=(3,0)+t(-2,1)$', correct: true },
          { text: '无解，因为 $\\det A=0$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$(2,1)$ 不在 $N(A)$ 中：$2+2\\cdot1=4\\ne0$，在特解上加它以后就不再是解。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$\\det A=0$ 说明 $A$ 奇异，$\\dim N(A)=1$，只要相容就必有无穷多解，不可能唯一。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。特解 $(3,0)$ 满足 $A\\mathbf{x}=(3,6)$，零空间由 $(-2,1)$ 张成（$x_1+2x_2=0$），故完整解是特解加零空间。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\mathbf{b}=(3,6)=3(1,2)$ 在列空间内，方程组确实相容；奇异只影响唯一性，不影响相容性。</span></div>"
      },
      {
        id: 'ch03-q5', ch: 'ch03', type: 'mcq', difficulty: 1,
        kp: '3.4 Independence, Basis and Dimension', tags: ['concept'],
        stem: '设 $\\mathbf{v}_1,\\dots,\\mathbf{v}_k$ 是 $\\mathbb{R}^n$ 中的向量。下列条件中与它们线性无关等价的是？',
        options: [
          { text: '方程 $c_1\\mathbf{v}_1+\\cdots+c_k\\mathbf{v}_k=\\mathbf{0}$ 只有 $c_1=\\cdots=c_k=0$ 这一个解', correct: true },
          { text: '其中任意两个向量都不成比例', correct: false },
          { text: '每个 $\\mathbf{v}_i$ 都不是零向量', correct: false },
          { text: '$k=n$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。这正是线性无关的定义：零向量只有系数全为 $0$ 的平凡表示。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。两两不成比例不足以保证无关，如 $(1,0,0),(0,1,0),(1,1,0)$ 两两不成比例却相关。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。都非零只是必要条件，$(1,0)$ 与 $(2,0)$ 都非零但显然相关。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$k=n$ 既不充分也不必要：$\\mathbb{R}^3$ 中三个相关向量也有 $k=3$，而两个无关向量只有 $k=2$。</span></div>"
      },
      {
        id: 'ch03-q6', ch: 'ch03', type: 'mcq', difficulty: 1,
        kp: '3.4 Independence, Basis and Dimension', tags: ['compute'],
        stem: '设 $\\mathbf{c}_1=(1,2,3)$，$\\mathbf{c}_2=(2,4,6)$，$\\mathbf{c}_3=(1,3,4)$，$A=[\\mathbf{c}_1\\ \\mathbf{c}_2\\ \\mathbf{c}_3]$。下列哪一组构成 $C(A)$ 的基？',
        options: [
          { text: '$\\{\\mathbf{c}_1,\\mathbf{c}_2\\}$', correct: false },
          { text: '$\\{\\mathbf{c}_1,\\mathbf{c}_2,\\mathbf{c}_3\\}$', correct: false },
          { text: '$\\{\\mathbf{c}_1,\\mathbf{c}_3\\}$', correct: true },
          { text: '$\\{\\mathbf{c}_3\\}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$\\mathbf{c}_2=2\\mathbf{c}_1$，两者相关，不能作基。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。三个向量能张成 $C(A)$ 但相关（$\\mathbf{c}_2=2\\mathbf{c}_1$），是生成组却不是基；基还要求线性无关。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$\\mathbf{c}_1,\\mathbf{c}_3$ 不成比例故无关，又 $\\mathbf{c}_2=2\\mathbf{c}_1$ 可由它们表示，所以它们既无关又张成 $C(A)$，$\\dim C(A)=2$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\{\\mathbf{c}_3\\}$ 只张成一条直线，漏掉了 $\\mathbf{c}_1$ 的方向，张成的空间比 $C(A)$ 小。</span></div>"
      },
      {
        id: 'ch03-q7', ch: 'ch03', type: 'mcq', difficulty: 1,
        kp: '3.5 Dimensions of the Four Subspaces', tags: ['compute'],
        stem: '设 $A$ 是 $3\\times 7$ 矩阵，且 $\\operatorname{rank}(A)=2$。则 $\\dim N(A)=$？',
        options: [
          { text: '$2$', correct: false },
          { text: '$4$', correct: false },
          { text: '$7$', correct: false },
          { text: '$5$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$2$ 就是秩本身；零空间的维数要由 $n-r$ 算出，不能直接取秩。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$4$ 来自 $7-3$，把行数 $m=3$ 当成了列数 $n$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$7$ 是列数 $n$，只有当 $A$ 为零矩阵、$r=0$ 时才有 $\\dim N(A)=7$。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。由秩-零化度定理，$\\dim N(A)=n-r=7-2=5$。</span></div>"
      },
      {
        id: 'ch03-q8', ch: 'ch03', type: 'mcq', difficulty: 1,
        kp: '3.5 Dimensions of the Four Subspaces', tags: ['concept'],
        stem: '设 $A$ 是 $m\\times n$ 矩阵，$\\operatorname{rank}(A)=r$。下列四个维数中等于 $m-r$ 的是？',
        options: [
          { text: '$\\dim C(A)$', correct: false },
          { text: '$\\dim N(A^{\\mathsf T})$', correct: true },
          { text: '$\\dim N(A)$', correct: false },
          { text: '$\\dim C(A^{\\mathsf T})$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$\\dim C(A)=r$，是列空间自身的维数。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$N(A^{\\mathsf T})$ 是 $\\mathbb{R}^m$ 中与 $C(A)$ 正交的子空间，维数为 $m-r$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\dim N(A)=n-r$，用的是列数 $n$ 而不是行数 $m$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\dim C(A^{\\mathsf T})=r$，行空间与列空间的维数都等于秩。</span></div>"
      },
      {
        id: 'ch03-q9', ch: 'ch03', type: 'mcq', difficulty: 2,
        kp: '3.1 Spaces of Vectors', tags: ['compute'],
        stem: '设 $S$ 是全体满足 $a_{11}+a_{22}+a_{33}=0$ 的 $3\\times 3$ 实矩阵构成的集合。则 $S$ 作为子空间的维数是？',
        options: [
          { text: '$8$', correct: true },
          { text: '$9$', correct: false },
          { text: '$6$', correct: false },
          { text: '$1$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。全体 $3\\times 3$ 矩阵构成 $9$ 维空间，迹为零是一个非平凡的线性约束，恰好去掉 $1$ 维，故 $\\dim S=8$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$9$ 是全体 $3\\times 3$ 矩阵的维数，漏掉了迹为零这个约束。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$6$ 只是非对角元的个数；对角线上还有两个自由参数，总维数不止 $6$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。把迹为零理解成只剩一个自由参数，实际每个线性约束只把维数降低 $1$。</span></div>"
      },
      {
        id: 'ch03-q10', ch: 'ch03', type: 'mcq', difficulty: 2,
        kp: '3.2 The Nullspace of A: Solving Ax = 0 and Rx = 0', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2&3\\\\2&5&7\\\\1&3&4\\end{bmatrix}$，则 $N(A)$ 的一个基是？',
        options: [
          { text: '$(1,1,1)$', correct: false },
          { text: '$(1,-1,1)$', correct: false },
          { text: '$(-1,1,1)$', correct: false },
          { text: '$(-1,-1,1)$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$A(1,1,1)=(6,14,8)\\ne\\mathbf{0}$，$(1,1,1)$ 不在零空间中。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$A(1,-1,1)=(2,4,2)\\ne\\mathbf{0}$，只把第二个分量取负并不能让三行同时为零。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$A(-1,1,1)=(4,10,6)\\ne\\mathbf{0}$，只把前两个分量取负仍不满足三个方程。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。消元得 $R=\\begin{bmatrix}1&0&1\\\\0&1&1\\\\0&0&0\\end{bmatrix}$，故 $x_1=-x_3$、$x_2=-x_3$，取 $x_3=1$ 得 $(-1,-1,1)$，且 $\\dim N(A)=3-2=1$。</span></div>"
      },
      {
        id: 'ch03-q11', ch: 'ch03', type: 'mcq', difficulty: 2,
        kp: '3.3 The Complete Solution to Ax = b', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2&3\\\\2&4&7\\end{bmatrix}$，$\\mathbf{b}=(1,3)$。则 $A\\mathbf{x}=\\mathbf{b}$ 的完整解是？',
        options: [
          { text: '$(1,0,0)+t(-2,1,0)$', correct: false },
          { text: '$(-2,0,1)+t(2,1,0)$', correct: false },
          { text: '$(-2,0,1)+t(-2,1,0)$', correct: true },
          { text: '$(-2,0,1)$，且是唯一解', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$A(1,0,0)=(1,2)\\ne(1,3)$，$(1,0,0)$ 不是特解，后面再叠加零空间向量也没用。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$(2,1,0)$ 不在 $N(A)$ 内：$2+2\\cdot1+0=4\\ne0$，方向向量的符号取反了。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。特解 $(-2,0,1)$ 给出 $A\\mathbf{x}=(-2+3,-4+7)=(1,3)$，零空间由 $(-2,1,0)$ 张成，两者相加即完整解。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\dim N(A)=3-2=1$，存在自由变量，解集是一条直线而不是单点。</span></div>"
      },
      {
        id: 'ch03-q12', ch: 'ch03', type: 'mcq', difficulty: 2,
        kp: '3.4 Independence, Basis and Dimension', tags: ['compute'],
        stem: '设 $\\mathbf{v}_1=(1,2,3)$，$\\mathbf{v}_2=(0,1,4)$，$\\mathbf{v}_3=(1,3,7)$。下列关于它们线性相关性的判断正确的是？',
        options: [
          { text: '线性无关，因为这是 $\\mathbb{R}^3$ 中的 $3$ 个向量', correct: false },
          { text: '线性相关，因为 $\\mathbf{v}_3=\\mathbf{v}_1+\\mathbf{v}_2$', correct: true },
          { text: '线性无关，因为 $\\mathbf{v}_1$ 与 $\\mathbf{v}_2$ 不成比例', correct: false },
          { text: '线性相关，因为 $\\mathbf{v}_1+\\mathbf{v}_2+\\mathbf{v}_3=\\mathbf{0}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$\\mathbb{R}^3$ 中三个向量可以相关，只有当以它们为列的行列式非零时才无关。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$(1,2,3)+(0,1,4)=(1,3,7)=\\mathbf{v}_3$，给出非平凡关系 $\\mathbf{v}_1+\\mathbf{v}_2-\\mathbf{v}_3=\\mathbf{0}$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。其中两个不成比例推不出整体无关，第三个向量可能正好落在这两个的张成里。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\mathbf{v}_1+\\mathbf{v}_2+\\mathbf{v}_3=(2,6,14)\\ne\\mathbf{0}$，系数取错了，正确的相关关系是 $1,1,-1$。</span></div>"
      },
      {
        id: 'ch03-q13', ch: 'ch03', type: 'mcq', difficulty: 2,
        kp: '3.4 Independence, Basis and Dimension', tags: ['concept'],
        stem: '设 $\\mathbf{v}_1,\\mathbf{v}_2,\\mathbf{v}_3$ 线性无关。关于 $\\mathbf{v}_1+\\mathbf{v}_2$、$\\mathbf{v}_2+\\mathbf{v}_3$、$\\mathbf{v}_1+\\mathbf{v}_3$ 这一组向量，正确的结论是？',
        options: [
          { text: '它们一定线性无关', correct: true },
          { text: '它们一定线性相关，因为每个向量都由两个 $\\mathbf{v}_i$ 相加得到', correct: false },
          { text: '只有当 $\\mathbf{v}_1,\\mathbf{v}_2,\\mathbf{v}_3$ 两两正交时才线性无关', correct: false },
          { text: '无法判断，取决于 $\\mathbf{v}_i$ 的具体分量', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。设 $c_1(\\mathbf{v}_1+\\mathbf{v}_2)+c_2(\\mathbf{v}_2+\\mathbf{v}_3)+c_3(\\mathbf{v}_1+\\mathbf{v}_3)=\\mathbf{0}$，合并同类项得 $(c_1+c_3)\\mathbf{v}_1+(c_1+c_2)\\mathbf{v}_2+(c_2+c_3)\\mathbf{v}_3=\\mathbf{0}$；由无关性得三个系数方程，联立解得 $c_1=c_2=c_3=0$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。由两个向量相加得到与相关性无关，本题中只有零系数的组合才给出零向量。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。正交只是无关的一种充分条件，$\\mathbf{v}_i$ 不必正交，上面的代数论证已经足够。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。结论对任意线性无关的 $\\mathbf{v}_1,\\mathbf{v}_2,\\mathbf{v}_3$ 都成立，与具体分量无关。</span></div>"
      },
      {
        id: 'ch03-q14', ch: 'ch03', type: 'mcq', difficulty: 2,
        kp: '3.5 Dimensions of the Four Subspaces', tags: ['trap', 'concept'],
        stem: '设 $A$ 是 $m\\times n$ 矩阵，$\\operatorname{rank}(A)=r$。下列关于四个基本子空间维数的说法正确的是？',
        options: [
          { text: '$\\dim C(A)=\\dim N(A)$ 总成立', correct: false },
          { text: '$\\dim C(A)+\\dim C(A^{\\mathsf T})=m$', correct: false },
          { text: '若 $r=n$，则 $A^{\\mathsf T}A$ 奇异', correct: false },
          { text: '$\\dim C(A)+\\dim N(A)=n$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$\\dim C(A)=r$ 而 $\\dim N(A)=n-r$，两者一般不等，只有 $r=n/2$ 时才碰巧相等。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$\\dim C(A)=\\dim C(A^{\\mathsf T})=r$，和为 $2r$；与 $C(A)$ 互补的是 $N(A^{\\mathsf T})$，其维数为 $m-r$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$r=n$ 表示列满秩，此时 $A^{\\mathsf T}A$ 是 $n\\times n$ 正定矩阵，必然可逆而不奇异。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。这就是秩-零化度定理：列空间维数 $r$ 加上零空间维数 $n-r$ 恰好等于列数 $n$。</span></div>"
      },
      {
        id: 'ch03-q15', ch: 'ch03', type: 'mcq', difficulty: 2,
        kp: '3.3 The Complete Solution to Ax = b', tags: ['proof', 'concept'],
        stem: '设 $A\\mathbf{x}=\\mathbf{b}$（$\\mathbf{b}\\ne\\mathbf{0}$）是相容方程组，$\\mathbf{x}_p$ 是它的一个特解。下列哪一段关于解集的论证是正确的？',
        options: [
          { text: '只有 $A$ 可逆时方程组才可能相容，所以解一定唯一', correct: false },
          { text: '$\\mathbf{x}_p+\\mathbf{x}_n$ 满足 $A(\\mathbf{x}_p+\\mathbf{x}_n)=\\mathbf{b}+\\mathbf{0}=\\mathbf{b}$，且任一解与 $\\mathbf{x}_p$ 之差落在 $N(A)$ 中，故解集恰为 $\\mathbf{x}_p+N(A)$', correct: true },
          { text: '解集是子空间，因为它等于 $\\mathbf{x}_p$ 与 $N(A)$ 的并', correct: false },
          { text: '特解可以取 $\\mathbf{x}_p=\\mathbf{0}$，因为零向量总在 $N(A)$ 中', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。相容性只要求 $\\mathbf{b}\\in C(A)$，与 $A$ 是否可逆无关；$A$ 奇异而相容时解仍有无穷多个。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。充分性由 $A\\mathbf{x}_n=\\mathbf{0}$ 直接验证；必要性由 $A(\\mathbf{x}-\\mathbf{x}_p)=\\mathbf{b}-\\mathbf{b}=\\mathbf{0}$ 得到，两方向都成立。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\mathbf{x}_p+N(A)$ 是逐项相加得到的和集而非并集；当 $\\mathbf{x}_p\\ne\\mathbf{0}$ 时它不含零向量，因而不是子空间。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\mathbf{x}_p=\\mathbf{0}$ 只在 $\\mathbf{b}=\\mathbf{0}$ 时才是解；零向量属于 $N(A)$ 并不能使它成为 $A\\mathbf{x}=\\mathbf{b}$ 的解。</span></div>"
      },
      {
        id: 'ch03-q16', ch: 'ch03', type: 'mcq', difficulty: 2,
        kp: '3.5 Dimensions of the Four Subspaces', tags: ['compute'],
        stem: '设 $A$ 是 $5\\times 3$ 矩阵，且 $A\\mathbf{x}=\\mathbf{0}$ 只有零解。则 $\\dim N(A^{\\mathsf T})=$？',
        options: [
          { text: '$0$', correct: false },
          { text: '$3$', correct: false },
          { text: '$2$', correct: true },
          { text: '$5$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$0$ 是 $\\dim N(A)$，不是 $\\dim N(A^{\\mathsf T})$；两者分别在 $\\mathbb{R}^n$ 与 $\\mathbb{R}^m$ 中。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$3$ 既是列数 $n$ 又是秩 $r$；$\\dim N(A^{\\mathsf T})$ 要用 $m-r$ 算。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$N(A)=\\{\\mathbf{0}\\}$ 说明 $r=n=3$，于是 $\\dim N(A^{\\mathsf T})=m-r=5-3=2$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$5$ 是行数 $m$，只有 $r=0$（$A$ 为零矩阵）时才有 $\\dim N(A^{\\mathsf T})=5$。</span></div>"
      },
      {
        id: 'ch03-q17', ch: 'ch03', type: 'mcq', difficulty: 3,
        kp: '3.4 Independence, Basis and Dimension', tags: ['concept'],
        stem: '设 $\\mathbf{v}_1,\\mathbf{v}_2,\\mathbf{v}_3$ 是 $\\mathbb{R}^3$ 中的向量，$A=[\\mathbf{v}_1\\ \\mathbf{v}_2\\ \\mathbf{v}_3]$ 为 $3\\times 3$ 矩阵。下列哪种情形能保证 $\\{\\mathbf{v}_1,\\mathbf{v}_2,\\mathbf{v}_3\\}$ 是 $\\mathbb{R}^3$ 的基？',
        options: [
          { text: '三个向量两两正交且都非零', correct: true },
          { text: '$\\det A=0$', correct: false },
          { text: '$A\\mathbf{x}=\\mathbf{0}$ 有非零解', correct: false },
          { text: '$\\mathbf{v}_1+\\mathbf{v}_2+\\mathbf{v}_3=\\mathbf{0}$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。两两正交的非零向量必无关（与 $\\mathbf{v}_i$ 作内积即得该系数为零），$\\mathbb{R}^3$ 中 $3$ 个无关向量自动张成 $\\mathbb{R}^3$，故为基。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$\\det A=0$ 恰说明三列相关，此时它们不能构成基。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。有非零解意味着 $N(A)\\ne\\{\\mathbf{0}\\}$，即列向量相关，正好与基的要求相反。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。这个等式本身就是系数为 $1,1,1$ 的非平凡关系，说明三个向量相关。</span></div>"
      },
      {
        id: 'ch03-q18', ch: 'ch03', type: 'mcq', difficulty: 3,
        kp: '3.1 Spaces of Vectors', tags: ['trap', 'concept'],
        stem: '设 $U=\\{(x,y):y=0\\}$、$V=\\{(x,y):x=0\\}$ 是 $\\mathbb{R}^2$ 的两个子空间。下列说法正确的是？',
        options: [
          { text: '$U\\cup V$ 是子空间，因为两个子空间的并仍是子空间', correct: false },
          { text: '$U\\cup V$ 不是子空间，因为 $(1,0)$ 与 $(0,1)$ 都在其中，而 $(1,1)$ 不在', correct: true },
          { text: '$U\\cap V$ 不是子空间', correct: false },
          { text: '$U+V=\\{\\mathbf{0}\\}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。并集一般对加法不封闭；只有其中一个子空间包含另一个时，并才仍然是子空间。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$(1,0)\\in U$、$(0,1)\\in V$ 都在并集中，但它们的和 $(1,1)$ 两点都不满足，加法不封闭。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。两个子空间的交仍是子空间；这里 $U\\cap V=\\{\\mathbf{0}\\}$，零向量子空间当然是子空间。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$U+V=\\mathbb{R}^2$，因为任意 $(x,y)=(x,0)+(0,y)$ 都能写成 $U$ 与 $V$ 中向量之和。</span></div>"
      },
      {
        id: 'ch03-q19', ch: 'ch03', type: 'mcq', difficulty: 3,
        kp: '3.3 The Complete Solution to Ax = b', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2&1&0\\\\0&0&1&1\\end{bmatrix}$，$\\mathbf{b}=(3,2)$。则 $A\\mathbf{x}=\\mathbf{b}$ 的完整解是？',
        options: [
          { text: '$(3,0,0,0)+s(-2,1,0,0)+t(1,0,-1,1)$', correct: false },
          { text: '$(1,0,2,0)+s(-2,1,0,0)+t(1,0,1,1)$', correct: false },
          { text: '$(1,0,2,0)+s(-2,1,0,0)$', correct: false },
          { text: '$(1,0,2,0)+s(-2,1,0,0)+t(1,0,-1,1)$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$(3,0,0,0)$ 代入得 $(3,0)$，第二个方程 $x_3+x_4=2$ 不满足，它不是特解。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$(1,0,1,1)$ 代入第二行得 $1+1=2\\ne0$，不在零空间中，方向向量取错了。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。只补上一个自由变量方向，而 $x_2$ 与 $x_4$ 都自由，$\\dim N(A)=4-2=2$，解集是二维的。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。特解 $(1,0,2,0)$ 给出 $(1+2,2)=(3,2)$，两个自由变量给出 $(-2,1,0,0)$ 与 $(1,0,-1,1)$，恰为二维解集。</span></div>"
      },
      {
        id: 'ch03-q20', ch: 'ch03', type: 'mcq', difficulty: 3,
        kp: '3.5 Dimensions of the Four Subspaces', tags: ['proof', 'concept'],
        stem: '设 $A$ 是 $4\\times 6$ 矩阵，$\\operatorname{rank}(A)=2$。四位同学分别给出四个基本子空间的维数，哪一位全部正确？',
        options: [
          { text: '$\\dim C(A)=4$，$\\dim N(A)=2$，$\\dim C(A^{\\mathsf T})=2$，$\\dim N(A^{\\mathsf T})=2$', correct: false },
          { text: '$\\dim C(A)=2$，$\\dim N(A)=4$，$\\dim C(A^{\\mathsf T})=4$，$\\dim N(A^{\\mathsf T})=2$', correct: false },
          { text: '$\\dim C(A)=2$，$\\dim N(A)=4$，$\\dim C(A^{\\mathsf T})=2$，$\\dim N(A^{\\mathsf T})=2$', correct: true },
          { text: '$\\dim C(A)=2$，$\\dim N(A)=4$，$\\dim C(A^{\\mathsf T})=2$，$\\dim N(A^{\\mathsf T})=4$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$\\dim C(A)$ 应等于秩 $2$，写成 $4$ 是把列空间与零空间的维数位置颠倒了。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$\\dim C(A^{\\mathsf T})$ 也等于秩 $2$，不是 $n-r=4$，后者是 $\\dim N(A)$ 的值。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。四个维数依次是 $r=2$、$n-r=6-2=4$、$r=2$、$m-r=4-2=2$，四项都正确。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\dim N(A^{\\mathsf T})=m-r=4-2=2$，写成 $4$ 是忘了从行数中减去秩。</span></div>"
      },
      /* ---------------- ch04 · Orthogonality（20 题） ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', type: 'mcq', difficulty: 1,
        kp: '4.1 Orthogonality of the Four Subspaces', tags: ['concept'],
        stem: '设 $A$ 是 $m\\times n$ 实矩阵。下列关系中正确的是？',
        options: [
          { text: '$N(A^{\\mathsf T})\\perp N(A)$', correct: false },
          { text: '$N(A)=C(A^{\\mathsf T})$', correct: false },
          { text: '$N(A)\\perp C(A^{\\mathsf T})$', correct: true },
          { text: '$C(A)\\perp N(A)$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$N(A^{\\mathsf T})\\subseteq\\mathbb{R}^m$ 而 $N(A)\\subseteq\\mathbb{R}^n$，不同空间中的子空间谈不上正交。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。两者互为正交补而不是相等；例如 $A$ 为零矩阵时 $N(A)=\\mathbb{R}^n$ 而 $C(A^{\\mathsf T})=\\{\\mathbf{0}\\}$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。若 $A\\mathbf{x}=\\mathbf{0}$ 且 $\\mathbf{y}=A^{\\mathsf T}\\mathbf{z}$，则 $\\mathbf{y}^{\\mathsf T}\\mathbf{x}=\\mathbf{z}^{\\mathsf T}A\\mathbf{x}=0$；两者维数 $(n-r)+r=n$ 又互补。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$C(A)\\subseteq\\mathbb{R}^m$ 而 $N(A)\\subseteq\\mathbb{R}^n$；与 $C(A)$ 正交的是 $N(A^{\\mathsf T})$。</span></div>"
      },
      {
        id: 'ch04-q2', ch: 'ch04', type: 'mcq', difficulty: 1,
        kp: '4.2 Projections', tags: ['compute'],
        stem: '设 $\\mathbf{a}=(1,2,2)$，$\\mathbf{b}=(3,1,4)$。$\\mathbf{b}$ 在 $\\mathbf{a}$ 张成的直线上的投影 $\\mathbf{p}=$？',
        options: [
          { text: '$\\frac{13}{3}(1,2,2)$', correct: false },
          { text: '$\\frac{13}{9}(1,2,2)$', correct: true },
          { text: '$\\frac{13}{9}(3,1,4)$', correct: false },
          { text: '$\\mathbf{b}-\\frac{13}{9}(1,2,2)$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。分母用了 $\\lVert\\mathbf{a}\\rVert=3$ 而不是 $\\mathbf{a}^{\\mathsf T}\\mathbf{a}=9$，公式是 $\\frac{\\mathbf{a}^{\\mathsf T}\\mathbf{b}}{\\mathbf{a}^{\\mathsf T}\\mathbf{a}}\\mathbf{a}$。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$\\mathbf{a}^{\\mathsf T}\\mathbf{b}=3+2+8=13$，$\\mathbf{a}^{\\mathsf T}\\mathbf{a}=1+4+4=9$，故 $\\mathbf{p}=\\frac{13}{9}(1,2,2)$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。系数 $\\frac{13}{9}$ 算对了，但乘的必须是 $\\mathbf{a}$ 而不是 $\\mathbf{b}$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。这是残差向量 $\\mathbf{e}=\\mathbf{b}-\\mathbf{p}$，它与 $\\mathbf{a}$ 正交，而不是投影本身。</span></div>"
      },
      {
        id: 'ch04-q3', ch: 'ch04', type: 'mcq', difficulty: 1,
        kp: '4.2 Projections', tags: ['concept'],
        stem: '设 $P$ 是 $\\mathbb{R}^n$ 到某个子空间的正交投影矩阵。下列关于 $P$ 的说法正确的是？',
        options: [
          { text: '$P$ 一定可逆，因为投影是线性变换', correct: false },
          { text: '$P^{\\mathsf T}=-P$', correct: false },
          { text: '$P^2=I$', correct: false },
          { text: '$P^2=P$ 且 $P^{\\mathsf T}=P$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。投影到真子空间时 $P$ 一定奇异，例如投影到直线时 $\\operatorname{rank}(P)=1$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。正交投影矩阵是对称的，$P^{\\mathsf T}=P$，而不是反对称。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$P^2=I$ 只有 $P=\\pm I$ 这类投影到整个空间的平凡情形才成立，一般 $P$ 幂等但不等于 $I$。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。投影两次与投影一次效果相同，故 $P^2=P$；而 $\\frac{\\mathbf{a}\\mathbf{a}^{\\mathsf T}}{\\mathbf{a}^{\\mathsf T}\\mathbf{a}}$ 与 $A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}$ 都显然对称。</span></div>"
      },
      {
        id: 'ch04-q4', ch: 'ch04', type: 'mcq', difficulty: 1,
        kp: '4.3 Least Squares Approximations', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1\\\\1\\\\1\\end{bmatrix}$，$\\mathbf{b}=(1,2,3)$，$\\hat{x}$ 使 $\\lVert A\\hat{x}-\\mathbf{b}\\rVert$ 最小。则 $\\hat{x}=$？',
        options: [
          { text: '$2$', correct: true },
          { text: '$1$', correct: false },
          { text: '$3$', correct: false },
          { text: '$6$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$A^{\\mathsf T}A=3$，$A^{\\mathsf T}\\mathbf{b}=1+2+3=6$，正规方程给出 $\\hat{x}=\\frac63=2$，即三个分量的平均值。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。取 $\\hat{x}=1$ 时残差为 $(0,1,2)$，长度平方是 $5$，比 $\\hat{x}=2$ 时的 $2$ 大。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$3$ 是 $\\mathbf{b}$ 的最大分量，残差为 $(-2,-1,0)$，长度平方是 $5$，不是最小。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$6$ 是 $A^{\\mathsf T}\\mathbf{b}$ 本身，忘了再除以 $A^{\\mathsf T}A=3$。</span></div>"
      },
      {
        id: 'ch04-q5', ch: 'ch04', type: 'mcq', difficulty: 1,
        kp: '4.4 Orthonormal Bases and Gram-Schmidt', tags: ['concept'],
        stem: '设 $\\mathbf{q}_1,\\dots,\\mathbf{q}_k$ 是 $\\mathbb{R}^n$ 中的非零向量。它们构成标准正交组的充要条件是？',
        options: [
          { text: '它们两两正交', correct: false },
          { text: '它们两两正交且每个 $\\lVert\\mathbf{q}_i\\rVert=1$', correct: true },
          { text: '它们线性无关', correct: false },
          { text: '每个 $\\mathbf{q}_i^{\\mathsf T}\\mathbf{q}_i=1$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。只正交还不够，长度不为 $1$ 时不算标准正交组，例如 $(2,0)$ 与 $(0,3)$。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。标准正交组要求 $\\mathbf{q}_i^{\\mathsf T}\\mathbf{q}_j=0$（$i\\ne j$）且 $\\mathbf{q}_i^{\\mathsf T}\\mathbf{q}_i=1$，即两两正交且都是单位向量。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。线性无关比标准正交弱得多，三个无关向量不一定两两正交。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。这只保证每个向量是单位向量，两两之间仍可能不正交。</span></div>"
      },
      {
        id: 'ch04-q6', ch: 'ch04', type: 'mcq', difficulty: 1,
        kp: '4.4 Orthonormal Bases and Gram-Schmidt', tags: ['compute'],
        stem: '设 $\\mathbf{a}_1=(1,1,0)$，$\\mathbf{a}_2=(1,0,1)$，第一步得 $\\mathbf{q}_1=\\frac{1}{\\sqrt2}(1,1,0)$。Gram–Schmidt 第二步的 $\\mathbf{u}=\\mathbf{a}_2-(\\mathbf{q}_1^{\\mathsf T}\\mathbf{a}_2)\\mathbf{q}_1$ 是？',
        options: [
          { text: '$(1,1,0)$', correct: false },
          { text: '$(\\frac12,\\frac12,1)$', correct: false },
          { text: '$(\\frac12,-\\frac12,1)$', correct: true },
          { text: '$(\\frac12,-\\frac12,0)$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$(1,1,0)$ 是 $\\mathbf{a}_1$ 本身，不是 $\\mathbf{u}$；$\\mathbf{u}$ 必须与 $\\mathbf{a}_1$ 正交。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。第二分量应为 $-\\frac12$：减去的向量是 $\\frac12(1,1,0)$，符号写反了。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$\\mathbf{q}_1^{\\mathsf T}\\mathbf{a}_2=\\frac{1}{\\sqrt2}$，故 $\\mathbf{u}=(1,0,1)-\\frac12(1,1,0)=(\\frac12,-\\frac12,1)$，且 $\\mathbf{u}^{\\mathsf T}\\mathbf{a}_1=0$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。第三分量不该变成 $0$：$\\mathbf{a}_2$ 的第三分量是 $1$，而 $\\mathbf{q}_1$ 的第三分量是 $0$，相减后仍为 $1$。</span></div>"
      },
      {
        id: 'ch04-q7', ch: 'ch04', type: 'mcq', difficulty: 1,
        kp: '4.2 Projections', tags: ['compute'],
        stem: '向量 $\\mathbf{a}=(1,2,2)$ 张成 $\\mathbb{R}^3$ 中的一条直线。$\\mathbb{R}^3$ 到该直线的投影矩阵 $P$ 是？',
        options: [
          { text: '$\\frac{1}{9}\\begin{bmatrix}1&2&2\\\\2&4&4\\\\2&4&4\\end{bmatrix}$', correct: true },
          { text: '$\\frac{1}{3}\\begin{bmatrix}1&2&2\\\\2&4&4\\\\2&4&4\\end{bmatrix}$', correct: false },
          { text: '$\\frac{1}{9}\\begin{bmatrix}1&4&4\\\\4&16&16\\\\4&16&16\\end{bmatrix}$', correct: false },
          { text: '$\\frac{1}{9}\\begin{bmatrix}1&1&1\\\\1&1&1\\\\1&1&1\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$P=\\frac{\\mathbf{a}\\mathbf{a}^{\\mathsf T}}{\\mathbf{a}^{\\mathsf T}\\mathbf{a}}$，$\\mathbf{a}^{\\mathsf T}\\mathbf{a}=1+4+4=9$，而 $\\mathbf{a}\\mathbf{a}^{\\mathsf T}$ 的第 $(i,j)$ 元是 $a_ia_j$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。分母用了 $\\lVert\\mathbf{a}\\rVert=3$ 而不是 $\\mathbf{a}^{\\mathsf T}\\mathbf{a}=9$，这样 $P$ 的迹会变成 $3$ 而不是 $1$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。把 $\\mathbf{a}\\mathbf{a}^{\\mathsf T}$ 算成了各分量的平方，外积的元素应是 $a_ia_j$ 而不是 $a_i^2$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。这相当于取 $\\mathbf{a}=(1,1,1)$，投影到的是立方体的对角线方向，不是 $(1,2,2)$ 的方向。</span></div>"
      },
      {
        id: 'ch04-q8', ch: 'ch04', type: 'mcq', difficulty: 1,
        kp: '4.1 Orthogonality of the Four Subspaces', tags: ['concept'],
        stem: '设 $A$ 是 $m\\times n$ 实矩阵。在 $\\mathbb{R}^m$ 中，$C(A)$ 的正交补是？',
        options: [
          { text: '$C(A^{\\mathsf T})$', correct: false },
          { text: '$N(A)$', correct: false },
          { text: '$\\{\\mathbf{0}\\}$', correct: false },
          { text: '$N(A^{\\mathsf T})$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$C(A^{\\mathsf T})\\subseteq\\mathbb{R}^n$ 是行空间，所在空间就不同，不可能是 $\\mathbb{R}^m$ 中 $C(A)$ 的正交补。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$N(A)\\subseteq\\mathbb{R}^n$；$N(A)$ 是 $C(A^{\\mathsf T})$ 的正交补，不是 $C(A)$ 的。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$C(A)$ 的正交补维数是 $m-r$，一般不为零。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$A^{\\mathsf T}\\mathbf{y}=\\mathbf{0}$ 等价于 $\\mathbf{y}$ 与每个列向量正交，故 $N(A^{\\mathsf T})$ 与整个 $C(A)$ 正交，维数 $m-r$ 又恰好互补。</span></div>"
      },
      {
        id: 'ch04-q9', ch: 'ch04', type: 'mcq', difficulty: 2,
        kp: '4.1 Orthogonality of the Four Subspaces', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&1&1\\\\2&2&2\\end{bmatrix}$，则 $N(A^{\\mathsf T})$ 的一个基是？',
        options: [
          { text: '$(1,2)$', correct: false },
          { text: '$(2,-1)$', correct: true },
          { text: '$(1,-1)$', correct: false },
          { text: '$(1,-2)$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$(1,2)$ 是 $A$ 的列向量方向，属于 $C(A)$；它与 $N(A^{\\mathsf T})$ 正交而不是属于其中。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$A^{\\mathsf T}\\mathbf{y}=\\mathbf{0}$ 即 $y_1+2y_2=0$，取 $y_2=-1$ 得 $(2,-1)$；且 $\\dim N(A^{\\mathsf T})=2-1=1$，一个向量即可张成。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。代入得 $1+2\\cdot(-1)=-1\\ne0$，不满足 $y_1+2y_2=0$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。代入得 $1+2\\cdot(-2)=-3\\ne0$，符号与倍数都取错了。</span></div>"
      },
      {
        id: 'ch04-q10', ch: 'ch04', type: 'mcq', difficulty: 2,
        kp: '4.2 Projections', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&0\\\\0&1\\\\1&1\\end{bmatrix}$。$\\mathbb{R}^3$ 到 $C(A)$ 上的投影矩阵 $P=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}$ 是？',
        options: [
          { text: '$\\frac{1}{3}\\begin{bmatrix}2&-1&1\\\\-1&2&1\\\\1&1&2\\end{bmatrix}$', correct: true },
          { text: '$\\begin{bmatrix}1&0&1\\\\0&1&1\\\\1&1&2\\end{bmatrix}$', correct: false },
          { text: '$\\frac{1}{3}\\begin{bmatrix}2&1&-1\\\\1&2&1\\\\-1&1&2\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$A^{\\mathsf T}A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$，逆为 $\\frac13\\begin{bmatrix}2&-1\\\\-1&2\\end{bmatrix}$，代回 $A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}$ 即得该 $3\\times 3$ 矩阵。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。这是 $AA^{\\mathsf T}$，漏乘了 $(A^{\\mathsf T}A)^{-1}$，它不满足幂等性 $P^2=P$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。非对角元的符号配错了：$-1$ 应出现在 $(1,2)$ 与 $(2,1)$ 位置，而不在 $(1,3)$ 与 $(3,1)$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。这是 $A^{\\mathsf T}A$（$2\\times2$），而投影到 $\\mathbb{R}^3$ 中子空间的 $P$ 必须是 $3\\times3$。</span></div>"
      },
      {
        id: 'ch04-q11', ch: 'ch04', type: 'mcq', difficulty: 2,
        kp: '4.3 Least Squares Approximations', tags: ['compute'],
        stem: '用直线 $y=C+Dt$ 最小二乘拟合三点 $(0,1),(1,2),(2,4)$，则 $\\hat{C}$ 与 $\\hat{D}$ 分别是？',
        options: [
          { text: '$\\hat{C}=0$，$\\hat{D}=2$', correct: false },
          { text: '$\\hat{C}=\\frac{3}{2}$，$\\hat{D}=\\frac{5}{6}$', correct: false },
          { text: '$\\hat{C}=\\frac{5}{6}$，$\\hat{D}=\\frac{3}{2}$', correct: true },
          { text: '$\\hat{C}=\\frac{7}{3}$，$\\hat{D}=2$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。这是强行过原点（$C=0$）时的斜率 $\\frac{\\sum t_ib_i}{\\sum t_i^2}=\\frac{10}{5}=2$，忽略了截距。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。把截距与斜率的位置写反了：截距是 $\\frac56$，斜率是 $\\frac32$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$A^{\\mathsf T}A=\\begin{bmatrix}3&3\\\\3&5\\end{bmatrix}$，$A^{\\mathsf T}\\mathbf{b}=(7,10)$，联立解得 $\\hat{C}=\\frac56$、$\\hat{D}=\\frac32$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。把 $\\hat{C}$ 直接取成分量平均 $\\frac73$、$\\hat{D}$ 取成过原点斜率 $2$，没有联立正规方程，两式并不相容。</span></div>"
      },
      {
        id: 'ch04-q12', ch: 'ch04', type: 'mcq', difficulty: 2,
        kp: '4.3 Least Squares Approximations', tags: ['concept'],
        stem: '设 $A$ 是 $m\\times n$ 矩阵且 $m\\gt n$，考虑用最小二乘解 $A\\mathbf{x}=\\mathbf{b}$。下列说法正确的是？',
        options: [
          { text: '正规方程 $A^{\\mathsf T}A\\hat{\\mathbf{x}}=A^{\\mathsf T}\\mathbf{b}$ 一定有唯一解', correct: false },
          { text: '当 $A$ 的列线性无关时 $A^{\\mathsf T}A$ 可逆，正规方程有唯一解', correct: true },
          { text: '最小二乘解一定满足 $A\\hat{\\mathbf{x}}=\\mathbf{b}$', correct: false },
          { text: '残差 $\\mathbf{b}-A\\hat{\\mathbf{x}}$ 与 $C(A)$ 中每个向量都成锐角', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。列相关时 $A^{\\mathsf T}A$ 奇异，正规方程有无穷多解，只能谈最小二乘解的集合。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$A^{\\mathsf T}A$ 正定当且仅当 $A$ 列满秩；列无关时它可逆，正规方程给出唯一的 $\\hat{\\mathbf{x}}$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\mathbf{b}$ 一般不在 $C(A)$ 内，$A\\hat{\\mathbf{x}}$ 只是 $C(A)$ 中离 $\\mathbf{b}$ 最近的点，误差不为零。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。残差与整个 $C(A)$ 正交，夹角是 $90^\\circ$ 而不是锐角。</span></div>"
      },
      {
        id: 'ch04-q13', ch: 'ch04', type: 'mcq', difficulty: 2,
        kp: '4.4 Orthonormal Bases and Gram-Schmidt', tags: ['compute'],
        stem: '设 $\\mathbf{a}_1=(1,1,1)$，$\\mathbf{a}_2=(1,0,1)$。对它们做 Gram–Schmidt 得到标准正交向量 $\\mathbf{q}_1,\\mathbf{q}_2$，则 $\\mathbf{q}_2=$？',
        options: [
          { text: '$\\frac{1}{\\sqrt3}(1,-2,1)$', correct: false },
          { text: '$\\frac13(1,-2,1)$', correct: false },
          { text: '$\\frac{1}{\\sqrt2}(1,0,-1)$', correct: false },
          { text: '$\\frac{1}{\\sqrt6}(1,-2,1)$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。分母应是 $\\sqrt6$：$\\mathbf{u}$ 的模是 $\\frac{\\sqrt6}{3}$，不是 $\\sqrt3$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。这是尚未单位化的 $\\mathbf{u}=\\frac13(1,-2,1)$，Gram–Schmidt 还要再除以 $\\lVert\\mathbf{u}\\rVert$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。它与 $\\mathbf{a}_1,\\mathbf{a}_2$ 都正交，但不在 $\\operatorname{span}\\{\\mathbf{a}_1,\\mathbf{a}_2\\}$ 内，不是 Gram–Schmidt 的第二步。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$\\mathbf{q}_1=\\frac{1}{\\sqrt3}(1,1,1)$，$\\mathbf{u}=\\mathbf{a}_2-\\frac23(1,1,1)=\\frac13(1,-2,1)$，$\\lVert\\mathbf{u}\\rVert=\\frac{\\sqrt6}{3}$，故 $\\mathbf{q}_2=\\frac{1}{\\sqrt6}(1,-2,1)$。</span></div>"
      },
      {
        id: 'ch04-q14', ch: 'ch04', type: 'mcq', difficulty: 2,
        kp: '4.2 Projections', tags: ['trap', 'concept'],
        stem: '设 $P$ 是 $\\mathbb{R}^3$ 到过原点平面 $W$ 的正交投影矩阵，$\\mathbf{b}\\in\\mathbb{R}^3$。下列说法正确的是？',
        options: [
          { text: '$P\\mathbf{b}$ 是 $W$ 中与 $\\mathbf{b}$ 距离最近的点', correct: true },
          { text: '$P\\mathbf{b}$ 与 $\\mathbf{b}$ 的夹角总是锐角', correct: false },
          { text: '若 $\\mathbf{b}\\perp W$，则 $P\\mathbf{b}=\\mathbf{b}$', correct: false },
          { text: '$\\lVert P\\mathbf{b}\\rVert\\geq\\lVert\\mathbf{b}\\rVert$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$\\mathbf{b}-P\\mathbf{b}$ 与 $W$ 正交，故对任意 $\\mathbf{w}\\in W$ 有 $\\lVert\\mathbf{b}-\\mathbf{w}\\rVert^2=\\lVert\\mathbf{b}-P\\mathbf{b}\\rVert^2+\\lVert P\\mathbf{b}-\\mathbf{w}\\rVert^2$，最小值在 $\\mathbf{w}=P\\mathbf{b}$ 处。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$\\mathbf{b}\\in W$ 时 $P\\mathbf{b}=\\mathbf{b}$，夹角为 $0$；$\\mathbf{b}\\perp W$ 时 $P\\mathbf{b}=\\mathbf{0}$，夹角无定义，并不总是锐角。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\mathbf{b}\\perp W$ 时它在 $W$ 上的分量为零，$P\\mathbf{b}=\\mathbf{0}$ 而不是 $\\mathbf{b}$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。正交投影只会缩短向量，$\\lVert P\\mathbf{b}\\rVert\\leq\\lVert\\mathbf{b}\\rVert$，等号仅在 $\\mathbf{b}\\in W$ 时成立。</span></div>"
      },
      {
        id: 'ch04-q15', ch: 'ch04', type: 'mcq', difficulty: 2,
        kp: '4.4 Orthonormal Bases and Gram-Schmidt', tags: ['concept'],
        stem: '设 $m\\times n$ 矩阵 $A$ 的列线性无关，$A=QR$，其中 $Q$ 的列标准正交、$R$ 为上三角。下列说法正确的是？',
        options: [
          { text: '$Q$ 是 $n\\times n$ 正交矩阵', correct: false },
          { text: '$Q$ 是 $m\\times n$ 矩阵且 $Q^{\\mathsf T}Q=I_n$，$R$ 是 $n\\times n$ 可逆上三角矩阵', correct: true },
          { text: '$R$ 一定是对角矩阵', correct: false },
          { text: '此时必有 $QQ^{\\mathsf T}=I_m$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$Q$ 与 $A$ 同型，是 $m\\times n$ 的高矩阵而不是方阵；只有 $m=n$ 时它才是 $n\\times n$ 正交矩阵。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。Gram–Schmidt 给出 $n$ 个标准正交列，故 $Q^{\\mathsf T}Q=I_n$；$R$ 的对角元是 $\\lVert\\mathbf{u}_i\\rVert\\gt0$，因而 $R$ 可逆。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$R$ 一般只是上三角，非对角元不为零，只有当 $A$ 的列本来就两两正交时才是对角阵。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$Q^{\\mathsf T}Q=I_n$ 是 $n\\times n$；而 $QQ^{\\mathsf T}$ 是 $m\\times m$ 的投影矩阵，$m\\gt n$ 时不等于 $I_m$。</span></div>"
      },
      {
        id: 'ch04-q16', ch: 'ch04', type: 'mcq', difficulty: 2,
        kp: '4.2 Projections', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&1\\\\0&1\\\\1&0\\end{bmatrix}$，$\\mathbf{b}=(1,1,1)$。$\\mathbf{b}$ 在 $C(A)$ 上的投影 $\\mathbf{p}=$？',
        options: [
          { text: '$(1,0,1)$', correct: false },
          { text: '$(1,1,1)$', correct: false },
          { text: '$(\\frac43,\\frac23,\\frac23)$', correct: true },
          { text: '$(\\frac23,\\frac23,\\frac23)$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。这是 $A$ 的第一列，对应 $\\hat{\\mathbf{x}}=(1,0)$；正规方程的解是 $\\hat{\\mathbf{x}}=(\\frac23,\\frac23)$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$C(A)$ 中向量满足 $b_3=b_1-b_2$，而 $1-1-1=-1\\ne0$，故 $\\mathbf{b}\\notin C(A)$，投影不等于它本身。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$A^{\\mathsf T}A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$，$A^{\\mathsf T}\\mathbf{b}=(2,2)$，解得 $\\hat{\\mathbf{x}}=(\\frac23,\\frac23)$，故 $\\mathbf{p}=A\\hat{\\mathbf{x}}=(\\frac43,\\frac23,\\frac23)$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。这是 $\\frac23\\mathbf{b}$，把 $\\mathbf{b}$ 的方向当成了 $C(A)$ 中的方向；投影必须落在 $C(A)$ 内。</span></div>"
      },
      {
        id: 'ch04-q17', ch: 'ch04', type: 'mcq', difficulty: 3,
        kp: '4.3 Least Squares Approximations', tags: ['proof', 'concept'],
        stem: '最小二乘解 $\\hat{\\mathbf{x}}$ 为什么由正规方程 $A^{\\mathsf T}A\\hat{\\mathbf{x}}=A^{\\mathsf T}\\mathbf{b}$ 确定？下列论证正确的是？',
        options: [
          { text: '残差 $\\mathbf{b}-A\\hat{\\mathbf{x}}$ 与 $C(A)$ 正交，即对一切 $\\mathbf{x}$ 有 $(A\\mathbf{x})^{\\mathsf T}(\\mathbf{b}-A\\hat{\\mathbf{x}})=0$，取 $\\mathbf{x}$ 为各标准基向量即得 $A^{\\mathsf T}(\\mathbf{b}-A\\hat{\\mathbf{x}})=\\mathbf{0}$', correct: true },
          { text: '$\\lVert A\\mathbf{x}-\\mathbf{b}\\rVert^2$ 的极小值点与 $A\\mathbf{x}=\\mathbf{b}$ 的解是同一批点', correct: false },
          { text: '$A^{\\mathsf T}A$ 总是对称正定的，所以 $\\hat{\\mathbf{x}}$ 一定唯一', correct: false },
          { text: '$\\mathbf{b}-A\\hat{\\mathbf{x}}$ 与 $N(A)$ 正交，而 $N(A)$ 与 $C(A)$ 维数相加为 $n$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。最近点处误差向量垂直于整个列空间，把它写成内积并取遍标准基向量，正好得到正规方程。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$\\lVert A\\mathbf{x}-\\mathbf{b}\\rVert^2$ 的梯度是 $2A^{\\mathsf T}(A\\mathbf{x}-\\mathbf{b})$，令其为零得正规方程；$A\\mathbf{x}=\\mathbf{b}$ 一般根本不相容。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$A^{\\mathsf T}A$ 只是半正定；列相关时它奇异，此时最小二乘解不唯一。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。残差与 $C(A)$ 正交，而 $N(A)$ 是 $\\mathbb{R}^n$ 中的子空间，与残差所在空间都不同。</span></div>"
      },
      {
        id: 'ch04-q18', ch: 'ch04', type: 'mcq', difficulty: 3,
        kp: '4.4 Orthonormal Bases and Gram-Schmidt', tags: ['trap', 'concept'],
        stem: '设 $Q$ 是 $n\\times n$ 实矩阵。下列说法正确的是？',
        options: [
          { text: '若 $Q$ 的列两两正交，则 $Q$ 是正交矩阵', correct: false },
          { text: '若 $Q^{\\mathsf T}Q=I$，则 $\\det Q=-1$', correct: false },
          { text: '正交矩阵的行列式可以取任意非零实数', correct: false },
          { text: '若 $Q^{\\mathsf T}Q=I$，则 $QQ^{\\mathsf T}=I$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。列两两正交还不够，必须每列长度都是 $1$；例如 $\\begin{bmatrix}2&0\\\\0&1\\end{bmatrix}$ 的列正交但 $Q^{\\mathsf T}Q\\ne I$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$Q^{\\mathsf T}Q=I$ 时 $\\det Q$ 可以是 $1$ 也可以是 $-1$，$Q=I$ 就是 $\\det Q=1$ 的反例。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。由 $(\\det Q)^2=\\det(Q^{\\mathsf T}Q)=1$ 知 $\\det Q$ 只能取 $\\pm1$ 两个值。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$Q^{\\mathsf T}Q=I$ 说明 $Q$ 可逆且 $Q^{-1}=Q^{\\mathsf T}$，于是 $QQ^{\\mathsf T}=QQ^{-1}=I$。</span></div>"
      },
      {
        id: 'ch04-q19', ch: 'ch04', type: 'mcq', difficulty: 3,
        kp: '4.3 Least Squares Approximations', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&0\\\\1&1\\\\1&2\\\\1&3\\end{bmatrix}$，$\\mathbf{b}=(0,5,4,7)$。最小二乘解 $\\hat{\\mathbf{x}}=(\\hat{C},\\hat{D})$ 是？',
        options: [
          { text: '$\\hat{C}=4$，$\\hat{D}=\\frac{17}{2}$', correct: false },
          { text: '$\\hat{C}=1$，$\\hat{D}=2$', correct: true },
          { text: '$\\hat{C}=2$，$\\hat{D}=1$', correct: false },
          { text: '$\\hat{C}=1$，$\\hat{D}=\\frac{17}{7}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。把两式分别除以 $4$ 得 $\\hat{C}=4$、$\\hat{D}=\\frac{17}{2}$，忽略了两式之间的耦合。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$A^{\\mathsf T}A=\\begin{bmatrix}4&6\\\\6&14\\end{bmatrix}$，$A^{\\mathsf T}\\mathbf{b}=(16,34)$，联立解得 $\\hat{C}=1$、$\\hat{D}=2$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。把截距与斜率对调了，拟合直线应是 $y=1+2t$ 而不是 $y=2+t$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\frac{17}{7}=\\frac{34}{14}$ 是假定直线过原点时的斜率公式，忽略了截距与斜率的耦合。</span></div>"
      },
      {
        id: 'ch04-q20', ch: 'ch04', type: 'mcq', difficulty: 3,
        kp: '4.1 Orthogonality of the Four Subspaces', tags: ['proof', 'concept'],
        stem: '设 $A$ 是 $m\\times n$ 矩阵，秩为 $r$。四位同学分别给出 $\\mathbb{R}^n=N(A)\\oplus C(A^{\\mathsf T})$ 的论证，哪一位是正确的？',
        options: [
          { text: '因为 $A^{\\mathsf T}A$ 是对称矩阵，所以它的零空间与列空间互补', correct: false },
          { text: '因为 $C(A^{\\mathsf T})$ 中每个向量都与 $N(A)$ 正交，而两个正交子空间之和一定等于整个空间', correct: false },
          { text: '若 $\\mathbf{x}\\in N(A)\\cap C(A^{\\mathsf T})$，设 $\\mathbf{x}=A^{\\mathsf T}\\mathbf{y}$，则 $\\lVert\\mathbf{x}\\rVert^2=\\mathbf{x}^{\\mathsf T}\\mathbf{x}=\\mathbf{y}^{\\mathsf T}A\\mathbf{x}=0$；又 $\\dim N(A)+\\dim C(A^{\\mathsf T})=(n-r)+r=n$，故为直和', correct: true },
          { text: '因为 $N(A)$ 与 $C(A^{\\mathsf T})$ 的元素个数相加正好等于 $n$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$A^{\\mathsf T}A$ 对称只保证它可以正交对角化，与 $N(A)$、$C(A^{\\mathsf T})$ 的直和分解没有直接关系。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。正交只是必要条件，还必须维数之和为 $n$ 才能断言两者张成整个空间。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。先用 $A\\mathbf{x}=\\mathbf{0}$ 证交集为零向量，再比较维数 $(n-r)+r=n$；交集为零且维数相加为 $n$，正是直和。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。子空间是无限集，元素个数不能相加；应当比较的是维数而不是元素个数。</span></div>"
      },
      /* ---------------- ch05 · Determinants（20 题） ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', type: 'mcq', difficulty: 1,
        kp: '5.1 The Properties of Determinants', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}3&1\\\\4&2\\end{bmatrix}$，则 $\\det(A)=$？',
        options: [
          { text: '$2$', correct: true },
          { text: '$-2$', correct: false },
          { text: '$10$', correct: false },
          { text: '$5$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$\\det(A)=3\\cdot2-1\\cdot4=6-4=2$，即主对角线元素之积减去副对角线元素之积。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$-2$ 来自 $bc-ad=4-6$，把被减数与减数写反了；$2\\times2$ 行列式的标准式是 $ad-bc$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$10$ 来自 $ad+bc=6+4$，误把公式里的减号当成了加号。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$5$ 是 $a+d=3+2$，这是主对角线元素之和（即迹），不是行列式。</span></div>"
      },
      {
        id: 'ch05-q2', ch: 'ch05', type: 'mcq', difficulty: 1,
        kp: '5.1 The Properties of Determinants', tags: ['concept'],
        stem: '上三角矩阵 $A=\\begin{bmatrix}2&7&1\\\\0&3&5\\\\0&0&4\\end{bmatrix}$ 的行列式 $\\det(A)=$？',
        options: [
          { text: '$0$', correct: false },
          { text: '$24$', correct: true },
          { text: '$9$', correct: false },
          { text: '$6$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。看到矩阵里有 $0$ 就判为奇异；三角阵的三条对角元都非零，行列式不为 $0$。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。三角矩阵的行列式等于对角元之积，$\\det(A)=2\\cdot3\\cdot4=24$，右上方那些非零元素不起作用。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$2+3+4=9$ 是把三个对角元相加，行列式要用乘积而不是和。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$2\\cdot3=6$ 只乘了前两条对角元，漏掉了第三条 $4$。</span></div>"
      },
      {
        id: 'ch05-q3', ch: 'ch05', type: 'mcq', difficulty: 1,
        kp: '5.1 The Properties of Determinants', tags: ['compute'],
        stem: '设 $A$ 是 $3\\times3$ 矩阵且 $\\det(A)=5$。把 $A$ 的第 $1$ 行与第 $2$ 行交换得到 $B$，则 $\\det(B)=$？',
        options: [
          { text: '$-5$', correct: true },
          { text: '$5$', correct: false },
          { text: '$0$', correct: false },
          { text: '$-10$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。交换两行使行列式变号，所以 $\\det(B)=-\\det(A)=-5$，绝对值不变。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。交换行不改变行列式的绝对值，但一定会改变符号；这是行列式的三条基本性质之一。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。只有两行相同或两行线性相关时行列式才为 $0$；交换只是重排，$B$ 仍然可逆。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$-10$ 把「变号」当成了「乘 $-2$」；一次行交换只贡献因子 $-1$。</span></div>"
      },
      {
        id: 'ch05-q4', ch: 'ch05', type: 'mcq', difficulty: 2,
        kp: '5.1 The Properties of Determinants', tags: ['compute'],
        stem: '设 $A$ 是 $3\\times3$ 矩阵且 $\\det(A)=3$，则 $\\det(2A)=$？',
        options: [
          { text: '$6$', correct: false },
          { text: '$24$', correct: true },
          { text: '$12$', correct: false },
          { text: '$48$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$2\\cdot3=6$ 只给一行乘了 $2$；数乘性质是对每一行分别使用的。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$2A$ 是每一行都乘 $2$，$3$ 行共提出因子 $2^3=8$，故 $\\det(2A)=8\\cdot3=24$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$12=2^2\\cdot3$，按两行提取因子，少算了一行。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$48=2^4\\cdot3$，多提取了一行；$3\\times3$ 矩阵只有 $3$ 行。</span></div>"
      },
      {
        id: 'ch05-q5', ch: 'ch05', type: 'mcq', difficulty: 2,
        kp: '5.1 The Properties of Determinants', tags: ['trap', 'concept'],
        stem: '设 $A$ 是 $3\\times3$ 矩阵。下列命题中正确的是？',
        options: [
          { text: '若 $A$ 有两行完全相同，则 $\\det(A)=0$。', correct: true },
          { text: '若 $\\det(A)=0$，则 $A$ 必有两行完全相同。', correct: false },
          { text: '若 $\\det(A)=0$，则 $A$ 必有一行全为 $0$。', correct: false },
          { text: '$\\det(A+B)=\\det(A)+\\det(B)$ 对任意同阶方阵都成立。', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。交换这两行行列式既不变又变号，只能为 $0$；等价说法是这两行线性相关。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。反例 $\\begin{bmatrix}1&2&3\\\\2&4&6\\\\0&0&1\\end{bmatrix}$ 的前两行成比例但互不相同，行列式仍为 $0$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。这个 $3\\times3$ 反例没有零行，行列式却为 $0$；奇异并不要求出现零行。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。行列式只对单独一行有可加性。取 $A=B=I_3$ 得 $\\det(2I_3)=2^3=8$，而 $\\det(I_3)+\\det(I_3)=2$。</span></div>"
      },
      {
        id: 'ch05-q6', ch: 'ch05', type: 'mcq', difficulty: 2,
        kp: '5.1 The Properties of Determinants', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2&3\\\\2&5&7\\\\3&7&9\\end{bmatrix}$。用消元法（不交换行）求 $\\det(A)$，结果为？',
        options: [
          { text: '$1$', correct: false },
          { text: '$-4$', correct: false },
          { text: '$-1$', correct: true },
          { text: '$0$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$1$ 是把 $2\\times2$ 余子式的两项都当成正号；实际是 $1\\cdot0-1\\cdot1=-1$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$-4$ 只算了左上角的 $2\\times2$ 块 $5\\cdot9-7\\cdot7$，把第一行的另外两项整个丢掉了。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$R_2-2R_1$、$R_3-3R_1$ 得 $\\begin{bmatrix}1&2&3\\\\0&1&1\\\\0&1&0\\end{bmatrix}$，按第一列展开得 $1\\cdot(1\\cdot0-1\\cdot1)=-1$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$0$ 是以为 $R_3-3R_1$ 产生了零行；实际第三行变成 $(0,1,0)$，并不为零。</span></div>"
      },
      {
        id: 'ch05-q7', ch: 'ch05', type: 'mcq', difficulty: 3,
        kp: '5.1 The Properties of Determinants', tags: ['proof', 'concept'],
        stem: '设 $A$ 是 $2\\times2$ 矩阵且 $A^2=A$。利用 $\\det(A^2)=\\det(A)\\det(A)$ 可推出 $\\det(A)$ 的取值只能是？',
        options: [
          { text: '$0$ 或 $1$', correct: true },
          { text: '$1$', correct: false },
          { text: '$0$', correct: false },
          { text: '$1$ 或 $-1$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。由 $A^2=A$ 两边取行列式得 $\\det(A)^2=\\det(A)$，即 $\\det(A)(\\det(A)-1)=0$，所以只能是 $0$ 或 $1$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。漏掉了 $0$：$A=\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}$ 满足 $A^2=A$，但 $\\det(A)=0$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。漏掉了 $1$：$A=I$ 满足 $A^2=A$，而 $\\det(I)=1$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。把 $-1$ 代入 $\\det(A)^2=\\det(A)$ 会得到 $1=-1$，不成立。</span></div>"
      },
      {
        id: 'ch05-q8', ch: 'ch05', type: 'mcq', difficulty: 2,
        kp: '5.2 Permutations and Cofactors', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}2&0&1\\\\1&3&2\\\\4&1&1\\end{bmatrix}$。按第一行做余子式展开求 $\\det(A)$，结果为？',
        options: [
          { text: '$9$', correct: false },
          { text: '$-13$', correct: false },
          { text: '$-11$', correct: false },
          { text: '$-9$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$9$ 是把结果整体取了相反数，符号交替因子用反了。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$-13$ 是给 $a_{11}$ 的余子式多加了负号，算成 $-2-11$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$-11$ 只算了第三项 $a_{13}M_{13}=1\\cdot(1-12)$，漏掉第一项的 $2\\cdot1=2$。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$\\det(A)=2\\cdot(3\\cdot1-2\\cdot1)-0\\cdot(\\cdots)+1\\cdot(1\\cdot1-3\\cdot4)=2+0-11=-9$。</span></div>"
      },
      {
        id: 'ch05-q9', ch: 'ch05', type: 'mcq', difficulty: 1,
        kp: '5.2 Permutations and Cofactors', tags: ['concept'],
        stem: '按行列式的完全展开式（排列定义），一个 $4\\times4$ 矩阵的行列式共有多少项？',
        options: [
          { text: '$4$', correct: false },
          { text: '$16$', correct: false },
          { text: '$24$', correct: true },
          { text: '$12$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$4$ 是矩阵的阶数，不是展开式的项数。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$16=4^2$ 是元素个数；展开式的项只能取自不同行不同列，不能任取。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。每一项由 $4$ 个不同行、不同列的元素相乘构成，对应一个 $4$ 阶排列，共 $4!=24$ 项，且每项带排列的符号。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$12=4\\cdot3$ 只数了前两列的所有搭配，漏掉了后两列也必须各取一个。</span></div>"
      },
      {
        id: 'ch05-q10', ch: 'ch05', type: 'mcq', difficulty: 2,
        kp: '5.2 Permutations and Cofactors', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2&3\\\\4&5&6\\\\7&8&9\\end{bmatrix}$，$C_{23}$ 是元素 $a_{23}$ 的代数余子式，则 $C_{23}=$？',
        options: [
          { text: '$6$', correct: true },
          { text: '$-6$', correct: false },
          { text: '$0$', correct: false },
          { text: '$18$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。删去第 $2$ 行第 $3$ 列得 $M_{23}=\\begin{vmatrix}1&2\\\\7&8\\end{vmatrix}=8-14=-6$，再乘 $(-1)^{2+3}=-1$，故 $C_{23}=6$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$-6$ 只是余子式 $M_{23}$，漏掉了符号因子 $(-1)^{2+3}$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\det(A)=0$ 是整矩阵的性质，不能推出每个余子式为 $0$；这里 $M_{23}=-6$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$18=a_{23}C_{23}=3\\cdot6$ 只是展开式中的一项；题目问的是代数余子式 $C_{23}$ 本身，不乘 $a_{23}$。</span></div>"
      },
      {
        id: 'ch05-q11', ch: 'ch05', type: 'mcq', difficulty: 2,
        kp: '5.2 Permutations and Cofactors', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}2&1&0&0\\\\1&3&0&0\\\\0&0&4&1\\\\0&0&1&2\\end{bmatrix}$，则 $\\det(A)=$？',
        options: [
          { text: '$0$', correct: false },
          { text: '$48$', correct: false },
          { text: '$5$', correct: false },
          { text: '$35$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。矩阵里 $0$ 很多，但两个 $2\\times2$ 块都可逆，行列式不为 $0$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$48=2\\cdot3\\cdot4\\cdot2$ 直接乘了对角元；这只在三角矩阵时才对，两个块内部还有非对角元。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$5$ 只是左上块的 $2\\cdot3-1\\cdot1$，把右下块整个丢掉了。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。这是分块对角矩阵，行列式等于各块行列式之积：$(2\\cdot3-1\\cdot1)(4\\cdot2-1\\cdot1)=5\\cdot7=35$。</span></div>"
      },
      {
        id: 'ch05-q12', ch: 'ch05', type: 'mcq', difficulty: 3,
        kp: '5.2 Permutations and Cofactors', tags: ['proof', 'concept'],
        stem: '设 $A$ 是 $n$ 阶方阵，$M_{ij}$ 是余子式，$C_{ij}$ 是代数余子式。下列等式一定成立的是？',
        options: [
          { text: '$C_{ij}=M_{ij}$', correct: false },
          { text: '$\\det(A)=\\sum_{j=1}^{n}a_{ij}M_{ij}$', correct: false },
          { text: '若 $A$ 的第 $i$ 行全为 $0$，则 $C_{i1}=\\cdots=C_{in}=0$', correct: false },
          { text: '$C_{ij}=(-1)^{i+j}M_{ij}$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。只有 $i+j$ 为偶数时两者才相等；$i+j$ 为奇数时差一个负号，如 $C_{23}=-M_{23}$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。沿第 $i$ 行展开必须用代数余子式：$\\det(A)=\\sum_j a_{ij}C_{ij}$，这里少了符号交替。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$C_{ij}$ 由删去第 $i$ 行后的子矩阵决定，与第 $i$ 行本身无关，完全可以非零；为零的只是展开和。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。代数余子式的定义就是在余子式前乘符号因子 $(-1)^{i+j}$，这是行列式按行展开的基础。</span></div>"
      },
      {
        id: 'ch05-q13', ch: 'ch05', type: 'mcq', difficulty: 2,
        kp: '5.2 Permutations and Cofactors', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2&0\\\\2&k&1\\\\0&1&1\\end{bmatrix}$。当 $k$ 取何值时 $A$ 奇异（即 $\\det(A)=0$）？',
        options: [
          { text: '$-5$', correct: false },
          { text: '$3$', correct: false },
          { text: '$5$', correct: true },
          { text: '$1$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$-5$ 是解 $k-5=0$ 时把移项符号写反了，应得 $k=5$ 而不是 $-5$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$3$ 来自把第二项算成 $-2$（漏乘因子 $2$），于是 $(k-1)-2=k-3=0$，即 $k=3$；正确应为 $(k-1)-4=0$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。按第一行展开得 $(k-1)-2\\cdot(2\\cdot1-1\\cdot0)=(k-1)-4=k-5$，令其为 $0$ 得 $k=5$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$1$ 只让 $k-1=0$，忽略了后面那一项 $-4$。</span></div>"
      },
      {
        id: 'ch05-q14', ch: 'ch05', type: 'mcq', difficulty: 1,
        kp: "5.3 Cramer's Rule, Inverses, and Volumes", tags: ['compute'],
        stem: '用 Cramer 法则解方程组 $\\begin{cases}2x+y=5\\\\ x+3y=10\\end{cases}$，则 $x=$？',
        options: [
          { text: '$3$', correct: false },
          { text: '$1$', correct: true },
          { text: '$5$', correct: false },
          { text: '$2$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$3$ 是 $y$ 的值，用 Cramer 法则求 $x$ 时替换的是第一列而不是第二列。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$\\det(A)=2\\cdot3-1\\cdot1=5$，把第一列换成右端项得 $\\det(A_1)=\\begin{vmatrix}5&1\\\\10&3\\end{vmatrix}=15-10=5$，故 $x=5/5=1$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$5$ 是系数矩阵的行列式 $\\det(A)$，它是分母，不是解。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$2$ 是 $x$ 的系数，不是 $x$ 的值；解由两个行列式之比给出。</span></div>"
      },
      {
        id: 'ch05-q15', ch: 'ch05', type: 'mcq', difficulty: 1,
        kp: "5.3 Cramer's Rule, Inverses, and Volumes", tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}3&1\\\\4&2\\end{bmatrix}$，则其伴随矩阵 $\\operatorname{adj}(A)=$？',
        options: [
          { text: '$\\begin{bmatrix}2&-1\\\\-4&3\\end{bmatrix}$', correct: true },
          { text: '$\\begin{bmatrix}3&-1\\\\-4&2\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}2&-4\\\\-1&3\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}3&4\\\\1&2\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$2\\times2$ 矩阵的伴随矩阵是 $\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}$，交换对角元并给非对角元变号，得 $\\begin{bmatrix}2&-1\\\\-4&3\\end{bmatrix}$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。只给非对角元变了号，没有交换对角元 $a=3$ 与 $d=2$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。把 $-b$ 与 $-c$ 的位置放反了，等于先转置再变号，$A\\operatorname{adj}(A)$ 就不等于 $\\det(A)I$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。这只是 $A^{\\mathsf T}$；伴随矩阵还要求交换对角元并改变非对角元的符号。</span></div>"
      },
      {
        id: 'ch05-q16', ch: 'ch05', type: 'mcq', difficulty: 2,
        kp: "5.3 Cramer's Rule, Inverses, and Volumes", tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}2&1&0\\\\1&2&1\\\\0&1&2\\end{bmatrix}$，$\\mathbf{b}=(4,6,4)^{\\mathsf T}$。用 Cramer 法则解 $A\\mathbf{x}=\\mathbf{b}$，则 $x_3=$？',
        options: [
          { text: '$4$', correct: false },
          { text: '$2$', correct: false },
          { text: '$1$', correct: true },
          { text: '$0$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$4=\\det(A)$ 是分母，不是解；Cramer 法则给的是两个行列式之比。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$2$ 是 $x_2$ 的值，替换成了第 $2$ 列，求错了分量。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$\\det(A)=2(4-1)-1(2-0)+0=4$，把第 $3$ 列换成 $\\mathbf{b}$ 后 $\\det(A_3)=2(8-6)-1(4-0)+4(1-0)=4$，故 $x_3=4/4=1$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$0$ 是误以为替换后行列式为零；实际 $\\det(A_3)=4$，解不为 $0$。</span></div>"
      },
      {
        id: 'ch05-q17', ch: 'ch05', type: 'mcq', difficulty: 1,
        kp: "5.3 Cramer's Rule, Inverses, and Volumes", tags: ['compute'],
        stem: '设 $A$、$B$ 都是 $2\\times2$ 矩阵，$\\det(A)=2$，$\\det(B)=5$，则 $\\det(AB)=$？',
        options: [
          { text: '$7$', correct: false },
          { text: '$2$', correct: false },
          { text: '$0$', correct: false },
          { text: '$10$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$7=2+5$ 把乘法定理当成了加法；$\\det(A+B)$ 一般也不等于 $\\det A+\\det B$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$2$ 只用了 $\\det(A)$，把 $B$ 的贡献漏掉了。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$A$、$B$ 都可逆（行列式非零），乘积也可逆，行列式不可能为 $0$。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。行列式对乘法是同态：$\\det(AB)=\\det(A)\\det(B)=2\\cdot5=10$。</span></div>"
      },
      {
        id: 'ch05-q18', ch: 'ch05', type: 'mcq', difficulty: 1,
        kp: "5.3 Cramer's Rule, Inverses, and Volumes", tags: ['concept'],
        stem: '设 $A$ 是 $n$ 阶方阵。下列等式对任意 $A$ 都成立的是？',
        options: [
          { text: '$\\det(A^{\\mathsf T})=\\det(A)$', correct: true },
          { text: '$\\det(-A)=\\det(A)$', correct: false },
          { text: '$\\det(A^{-1})=\\det(A)$', correct: false },
          { text: '$\\det(A^{\\mathsf T}A)=\\det(A)$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。转置把每个排列项重新排列但不改变其符号，故行列式不变；这也是「行性质」与「列性质」完全对称的原因。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。每行提出一个 $-1$，共 $n$ 个，得 $\\det(-A)=(-1)^n\\det(A)$，奇数阶时会变号。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。应为 $\\det(A^{-1})=1/\\det(A)$；只有 $\\det(A)=\\pm1$ 时两者才相等。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\det(A^{\\mathsf T}A)=\\det(A)^2$，一般不等于 $\\det(A)$，例如 $\\det(A)=2$ 时它是 $4$。</span></div>"
      },
      {
        id: 'ch05-q19', ch: 'ch05', type: 'mcq', difficulty: 3,
        kp: "5.3 Cramer's Rule, Inverses, and Volumes", tags: ['compute'],
        stem: '由向量 $\\mathbf{u}=(1,1,0)$、$\\mathbf{v}=(0,1,1)$、$\\mathbf{w}=(1,0,1)$ 张成的平行六面体，其体积是？',
        options: [
          { text: '$3$', correct: false },
          { text: '$6$', correct: false },
          { text: '$1$', correct: false },
          { text: '$2$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$3$ 是向量的个数（空间维数），不是体积。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$6=3!$ 是 $3\\times3$ 行列式展开的项数，和体积没有关系。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$1$ 只算了按第一行展开的第一项 $1\\cdot(1-0)$，漏掉了第二项贡献的 $1$。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。以三个向量为行作矩阵，$\\det=1(1-0)-1(0-1)+0=2$，体积等于 $|\\det|=2$。</span></div>"
      },
      {
        id: 'ch05-q20', ch: 'ch05', type: 'mcq', difficulty: 3,
        kp: "5.3 Cramer's Rule, Inverses, and Volumes", tags: ['trap', 'concept'],
        stem: '设 $A$、$B$ 是 $n$ 阶方阵。下列命题中正确的是？',
        options: [
          { text: '若 $\\det(A)=0$，则 $A\\mathbf{x}=\\mathbf{b}$ 对任意 $\\mathbf{b}$ 都无解。', correct: false },
          { text: '若 $\\det(AB)=0$，则 $A$ 与 $B$ 都奇异。', correct: false },
          { text: '$\\det(A)=0$ 当且仅当 $A$ 的某一行是另一行的倍数。', correct: false },
          { text: '若 $\\det(A)=0$，则 $A$ 不可逆，且存在 $\\mathbf{b}$ 使 $A\\mathbf{x}=\\mathbf{b}$ 无解。', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。若 $\\mathbf{b}$ 落在 $C(A)$ 内仍有无穷多解；例如 $n=2$ 时 $A=\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}$、$\\mathbf{b}=(1,0)^{\\mathsf T}$ 就有解。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$\\det(AB)=\\det(A)\\det(B)=0$ 只说明至少一个因子奇异，另一个完全可以可逆。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$3$ 阶以上行线性相关不一定成比例，例如 $(1,0,0)$、$(0,1,0)$、$(1,1,0)$ 中第三行是前两行之和。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$\\det(A)=0$ 等价于 $A$ 奇异即不可逆；此时列空间 $C(A)$ 不是整个 $\\mathbb{R}^n$，取 $\\mathbf{b}\\notin C(A)$ 就无解。</span></div>"
      },
      /* ---------------- ch06 · Eigenvalues and Eigenvectors（20 题） ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', type: 'mcq', difficulty: 1,
        kp: '6.1 Introduction to Eigenvalues', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}3&1\\\\0&2\\end{bmatrix}$，则 $A$ 的特征值是？',
        options: [
          { text: '$3$ 与 $2$', correct: true },
          { text: '$1$ 与 $6$', correct: false },
          { text: '$-3$ 与 $-2$', correct: false },
          { text: '$0$ 与 $5$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。三角矩阵的特征值就是对角元，也可由 $\\det(A-\\lambda I)=(3-\\lambda)(2-\\lambda)=0$ 得到，即 $3$ 与 $2$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$1$ 与 $6$ 之积是 $6=\\det(A)$，但它们的和 $7$ 不等于 $\\operatorname{tr}(A)=5$，不满足特征值之和等于迹。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。符号弄反了，$(3-\\lambda)(2-\\lambda)=0$ 的两个根都是正的。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\det(A)=6\\ne0$，所以 $0$ 不可能是特征值；$5$ 是迹而不是特征值。</span></div>"
      },
      {
        id: 'ch06-q2', ch: 'ch06', type: 'mcq', difficulty: 1,
        kp: '6.1 Introduction to Eigenvalues', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$，$\\mathbf{v}=(1,1)^{\\mathsf T}$。若 $A\\mathbf{v}=\\lambda\\mathbf{v}$，则 $\\lambda=$？',
        options: [
          { text: '$2$', correct: false },
          { text: '$3$', correct: true },
          { text: '$4$', correct: false },
          { text: '$1$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$2$ 是对角元，但 $A\\mathbf{v}=(3,3)^{\\mathsf T}\\ne(2,2)^{\\mathsf T}$，不满足定义。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$A\\mathbf{v}=(2\\cdot1+1\\cdot1,\\,1\\cdot1+2\\cdot1)^{\\mathsf T}=(3,3)^{\\mathsf T}=3\\mathbf{v}$，故 $\\lambda=3$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$4=\\operatorname{tr}(A)$ 是这个矩阵两个特征值 $3$ 与 $1$ 之和，不是单个特征值。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$1$ 是另一个特征值，它对应的特征向量是 $(1,-1)^{\\mathsf T}$，因为 $A(1,-1)^{\\mathsf T}=(1,-1)^{\\mathsf T}$。</span></div>"
      },
      {
        id: 'ch06-q3', ch: 'ch06', type: 'mcq', difficulty: 2,
        kp: '6.1 Introduction to Eigenvalues', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}4&1\\\\2&3\\end{bmatrix}$，则 $A$ 的特征值是？',
        options: [
          { text: '$4$ 与 $3$', correct: false },
          { text: '$-5$ 与 $-2$', correct: false },
          { text: '$5$ 与 $2$', correct: true },
          { text: '$6$ 与 $1$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。只有三角矩阵的特征值才等于对角元；这里非对角元 $1,2$ 不为零，不能直接用。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。方程 $\\lambda^2-7\\lambda+10=0$ 的根是 $5$ 与 $2$，不是它们的相反数。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$\\det(A-\\lambda I)=(4-\\lambda)(3-\\lambda)-2=\\lambda^2-7\\lambda+10=(\\lambda-5)(\\lambda-2)$，故特征值为 $5$ 与 $2$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$6+1=7=\\operatorname{tr}(A)$ 虽然对，但 $6\\cdot1=6\\ne\\det(A)=10$，不满足特征值之积等于行列式。</span></div>"
      },
      {
        id: 'ch06-q4', ch: 'ch06', type: 'mcq', difficulty: 1,
        kp: '6.1 Introduction to Eigenvalues', tags: ['concept'],
        stem: '设 $A$ 是 $2\\times2$ 矩阵，其特征值为 $2$ 与 $3$。则 $\\det(A)$ 与 $\\operatorname{tr}(A)$ 分别是？',
        options: [
          { text: '$\\det(A)=6$，$\\operatorname{tr}(A)=5$', correct: true },
          { text: '$\\det(A)=5$，$\\operatorname{tr}(A)=6$', correct: false },
          { text: '$\\det(A)=6$，$\\operatorname{tr}(A)=6$', correct: false },
          { text: '$\\det(A)=1$，$\\operatorname{tr}(A)=5$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。特征值之积等于行列式 $2\\cdot3=6$，特征值之和等于迹 $2+3=5$，这两条对任意阶方阵都成立。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。把积与和搞反了：$5$ 是和（迹），$6$ 才是积（行列式）。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。迹是 $2+3=5$，不能把行列式的值 $6$ 也拿来做迹。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$1=3-2$ 是特征值之差，与行列式无关；$\\det(A)$ 应为乘积。</span></div>"
      },
      {
        id: 'ch06-q5', ch: 'ch06', type: 'mcq', difficulty: 1,
        kp: '6.2 Diagonalizing a Matrix', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2\\\\0&3\\end{bmatrix}$，$\\lambda=3$ 是其特征值。属于 $\\lambda=3$ 的一个特征向量是？',
        options: [
          { text: '$(1,0)^{\\mathsf T}$', correct: false },
          { text: '$(2,1)^{\\mathsf T}$', correct: false },
          { text: '$(1,1)^{\\mathsf T}$', correct: true },
          { text: '$(0,1)^{\\mathsf T}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$(A-3I)(1,0)^{\\mathsf T}=(-2,0)^{\\mathsf T}\\ne\\mathbf{0}$，它只是按对角元猜的。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$(A-3I)(2,1)^{\\mathsf T}=(-2,0)^{\\mathsf T}\\ne\\mathbf{0}$，第二分量没有满足 $v_1=v_2$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$A-3I=\\begin{bmatrix}-2&2\\\\0&0\\end{bmatrix}$，方程 $-2v_1+2v_2=0$ 给出 $v_1=v_2$，取 $(1,1)^{\\mathsf T}$ 即可。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$(A-3I)(0,1)^{\\mathsf T}=(2,0)^{\\mathsf T}\\ne\\mathbf{0}$，它不满足 $v_1=v_2$。</span></div>"
      },
      {
        id: 'ch06-q6', ch: 'ch06', type: 'mcq', difficulty: 1,
        kp: '6.2 Diagonalizing a Matrix', tags: ['concept'],
        stem: '设 $A$ 是 $n$ 阶矩阵。下列条件中能保证 $A$ 可对角化的是？',
        options: [
          { text: '$A$ 可逆', correct: false },
          { text: '$A$ 的所有元素都非零', correct: false },
          { text: '$A$ 的迹非零', correct: false },
          { text: '$A$ 有 $n$ 个互不相同的特征值', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。可逆只说明 $0$ 不是特征值，与特征向量是否够多无关；例如 $n=2$ 时 $\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}$ 可逆但不可对角化。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。元素是否非零与特征值重复与否毫无关系，不能保证有 $n$ 个线性无关特征向量。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。迹非零只说明特征值之和不等于 $0$，仍可能出现重复特征值且特征向量不够。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。互不相同的特征值对应的特征向量线性无关，$n$ 个不同特征值正好给出 $n$ 个线性无关特征向量，于是 $A=S\\Lambda S^{-1}$。</span></div>"
      },
      {
        id: 'ch06-q7', ch: 'ch06', type: 'mcq', difficulty: 3,
        kp: '6.2 Diagonalizing a Matrix', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$，$n$ 为正整数，则 $A^n=$？',
        options: [
          { text: '$\\begin{bmatrix}2^n&n\\\\n&2^n\\end{bmatrix}$', correct: false },
          { text: '$\\frac12\\begin{bmatrix}3^n+1&3^n-1\\\\3^n-1&3^n+1\\end{bmatrix}$', correct: true },
          { text: '$\\begin{bmatrix}3^n&0\\\\0&1\\end{bmatrix}$', correct: false },
          { text: '$\\frac12\\begin{bmatrix}3^n-1&3^n+1\\\\3^n+1&3^n-1\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。矩阵幂不是逐元素乘方：$A^2=\\begin{bmatrix}5&4\\\\4&5\\end{bmatrix}$，而不是 $\\begin{bmatrix}4&2\\\\2&4\\end{bmatrix}$。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。特征值 $3,1$，特征向量 $(1,1)^{\\mathsf T},(1,-1)^{\\mathsf T}$，故 $A=S\\Lambda S^{-1}$，代入 $S=\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}$ 与 $S^{-1}=\\frac12\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}$ 即得。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。这只写了 $\\Lambda^n$，漏掉了两侧的 $S$ 与 $S^{-1}$；$A$ 本身并不是对角矩阵。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。把特征向量矩阵的两列顺序与 $3^n,1$ 的次序配错了。取 $n=1$ 得 $\\begin{bmatrix}1&2\\\\2&1\\end{bmatrix}\\ne A$。</span></div>"
      },
      {
        id: 'ch06-q8', ch: 'ch06', type: 'mcq', difficulty: 2,
        kp: '6.2 Diagonalizing a Matrix', tags: ['trap', 'concept'],
        stem: '关于「特征值有重复」与「矩阵可对角化」的关系，下列说法正确的是？',
        options: [
          { text: '只要特征值有重复，矩阵就一定不可对角化。', correct: false },
          { text: '特征值有重复的矩阵也可能可对角化，例如 $2I$。', correct: true },
          { text: '特征值有重复时，线性无关的特征向量只有一个。', correct: false },
          { text: '可对角化的矩阵，其特征值一定互不相同。', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。反例就是 $2I$：特征值全部重复，却可直接取 $S=I$ 完成对角化。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$2I$ 的特征值全是 $2$，但它本身已经是对角矩阵，且任何非零向量都是它的特征向量，当然可对角化。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$2I$ 的 $N(2I-2I)=N(0)=\\mathbb{R}^n$，维数为 $n$，$n$ 个线性无关的特征向量都存在。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。特征值互异只是可对角化的充分条件而非必要条件；$2I$ 可对角化但特征值重复。</span></div>"
      },
      {
        id: 'ch06-q9', ch: 'ch06', type: 'mcq', difficulty: 1,
        kp: '6.3 Systems of Differential Equations', tags: ['compute'],
        stem: '设 $\\frac{\\mathrm{d}\\mathbf{u}}{\\mathrm{d}t}=A\\mathbf{u}$，其中 $A=\\begin{bmatrix}1&0\\\\0&2\\end{bmatrix}$，$\\mathbf{u}(0)=(1,1)^{\\mathsf T}$。则 $\\mathbf{u}(t)=$？',
        options: [
          { text: '$(e^{t},e^{2t})^{\\mathsf T}$', correct: true },
          { text: '$(e^{2t},e^{t})^{\\mathsf T}$', correct: false },
          { text: '$(e^{t},2e^{2t})^{\\mathsf T}$', correct: false },
          { text: '$(e^{3t},e^{3t})^{\\mathsf T}$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。对角系统按分量各自求解：$u_1'=u_1$ 给 $e^{t}$，$u_2'=2u_2$ 给 $e^{2t}$，初值都是 $1$，故系数都是 $1$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。把两个分量对应的特征值 $1$ 与 $2$ 对调了，代回方程不成立。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$2$ 是指数上的增长率，不能拿到前面当系数；$t=0$ 时应回到 $(1,1)^{\\mathsf T}$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$3=\\operatorname{tr}(A)$ 不是任何一个分量的增长率，两个分量本来就有不同的衰减速度。</span></div>"
      },
      {
        id: 'ch06-q10', ch: 'ch06', type: 'mcq', difficulty: 2,
        kp: '6.3 Systems of Differential Equations', tags: ['concept'],
        stem: '设 $\\frac{\\mathrm{d}\\mathbf{u}}{\\mathrm{d}t}=A\\mathbf{u}$，$A$ 为常数矩阵。若对任意初值的解都满足 $\\mathbf{u}(t)\\to\\mathbf{0}$（$t\\to+\\infty$），则 $A$ 的特征值必须满足？',
        options: [
          { text: '所有特征值的实部 $\\lt 0$', correct: true },
          { text: '所有特征值都 $\\gt 0$', correct: false },
          { text: '所有特征值的实部都等于 $0$', correct: false },
          { text: '所有特征值的模都 $\\gt 1$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。解是若干项 $c_i e^{\\lambda_i t}\\mathbf{x}_i$ 的组合，实部为负时每个 $e^{\\lambda_i t}$ 都随时间衰减到 $0$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。正特征值使对应分量按 $e^{\\lambda t}$ 增长，解反而发散。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。纯虚或零实部时解振荡或保持常值，不会趋于 $\\mathbf{0}$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。条件是差分方程 $A^n$ 衰减的条件（谱半径 $\\lt1$），微分方程看的是特征值的实部。</span></div>"
      },
      {
        id: 'ch06-q11', ch: 'ch06', type: 'mcq', difficulty: 3,
        kp: '6.3 Systems of Differential Equations', tags: ['compute'],
        stem: '设 $\\frac{\\mathrm{d}\\mathbf{u}}{\\mathrm{d}t}=A\\mathbf{u}$，$A=\\begin{bmatrix}1&2\\\\0&3\\end{bmatrix}$，$\\mathbf{u}(0)=(3,2)^{\\mathsf T}$。则 $\\mathbf{u}(t)=$？',
        options: [
          { text: '$(3e^{t},2e^{3t})^{\\mathsf T}$', correct: false },
          { text: '$(e^{t}+2e^{3t},2e^{3t})^{\\mathsf T}$', correct: true },
          { text: '$(e^{3t}+2e^{t},2e^{t})^{\\mathsf T}$', correct: false },
          { text: '$(3e^{3t},2e^{3t})^{\\mathsf T}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。把初值分量直接当成系数，但 $(3,2)^{\\mathsf T}$ 不是特征向量。代回得 $A\\mathbf{u}=(3e^{t}+4e^{3t},6e^{3t})^{\\mathsf T}$，而 $\\mathbf{u}'=(3e^{t},6e^{3t})^{\\mathsf T}$，两者不等。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。特征值 $1,3$ 对应特征向量 $(1,0)^{\\mathsf T},(1,1)^{\\mathsf T}$，初值 $(3,2)^{\\mathsf T}=1\\cdot(1,0)^{\\mathsf T}+2\\cdot(1,1)^{\\mathsf T}$，故 $\\mathbf{u}=e^{t}(1,0)^{\\mathsf T}+2e^{3t}(1,1)^{\\mathsf T}$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。把两个特征值对应的项对调了。虽然 $t=0$ 时给出 $(3,2)^{\\mathsf T}$，但代回方程不成立。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。只用了特征值 $3$。此时 $A\\mathbf{u}=(3e^{3t}+4e^{3t},6e^{3t})^{\\mathsf T}$，与导数 $(9e^{3t},6e^{3t})^{\\mathsf T}$ 不相等。</span></div>"
      },
      {
        id: 'ch06-q12', ch: 'ch06', type: 'mcq', difficulty: 2,
        kp: '6.3 Systems of Differential Equations', tags: ['concept'],
        stem: '设 $A=S\\Lambda S^{-1}$，其中 $\\Lambda$ 是对角矩阵。则矩阵指数 $e^{At}=$？',
        options: [
          { text: '$I+At$', correct: false },
          { text: '$S^{-1}e^{\\Lambda t}S$', correct: false },
          { text: '$\\Lambda e^{t}$', correct: false },
          { text: '$Se^{\\Lambda t}S^{-1}$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$I+At$ 只是级数的前两项，一般不等于 $e^{At}$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$S$ 与 $S^{-1}$ 的位置反了，正确顺序是先 $S$、后 $S^{-1}$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\Lambda$ 是矩阵而 $e^{t}$ 是标量，这个写法没有意义；$t=0$ 时它也不等于 $I$。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。把级数逐项提出 $S$ 与 $S^{-1}$：$e^{At}=\\sum_{n=0}^{\\infty}A^nt^n/n!=S(\\sum_{n=0}^{\\infty}\\Lambda^nt^n/n!)S^{-1}=Se^{\\Lambda t}S^{-1}$。</span></div>"
      },
      {
        id: 'ch06-q13', ch: 'ch06', type: 'mcq', difficulty: 1,
        kp: '6.4 Symmetric Matrices', tags: ['concept'],
        stem: '设 $A$ 是实对称矩阵。下列结论一定成立的是？',
        options: [
          { text: '$A$ 一定正定。', correct: false },
          { text: '$A$ 的特征值全为实数，且属于不同特征值的特征向量相互正交。', correct: true },
          { text: '$A$ 一定可逆。', correct: false },
          { text: '$A$ 的特征值一定互不相同。', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。对称只保证特征值为实数，可能为负，例如 $\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$ 的特征值是 $1$ 与 $-1$。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。这是实对称矩阵谱定理的两条基本结论：特征值都是实数，且不同特征值的特征向量正交，因此可以正交对角化。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。对称矩阵可以有零特征值，如 $\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$，此时不可逆。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。特征值可以重复，例如 $2I$ 对称且两个特征值都是 $2$。</span></div>"
      },
      {
        id: 'ch06-q14', ch: 'ch06', type: 'mcq', difficulty: 2,
        kp: '6.4 Symmetric Matrices', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}2&2\\\\2&5\\end{bmatrix}$，则 $A$ 的特征值是？',
        options: [
          { text: '$2$ 与 $5$', correct: false },
          { text: '$3$ 与 $2$', correct: false },
          { text: '$6$ 与 $1$', correct: true },
          { text: '$7$ 与 $6$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。只有三角矩阵的特征值才等于对角元；这里非对角元 $2$ 不能忽略。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$3\\cdot2=6=\\det(A)$ 之积对了，但和 $5$ 不等于 $\\operatorname{tr}(A)=7$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$\\det(A-\\lambda I)=(2-\\lambda)(5-\\lambda)-4=\\lambda^2-7\\lambda+6=(\\lambda-6)(\\lambda-1)$，特征值是 $6$ 与 $1$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$7$ 与 $6$ 分别是迹与行列式，不是特征值本身。</span></div>"
      },
      {
        id: 'ch06-q15', ch: 'ch06', type: 'mcq', difficulty: 2,
        kp: '6.4 Symmetric Matrices', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}3&1\\\\1&3\\end{bmatrix}$，其特征值为 $4$ 与 $2$。在谱分解 $A=4\\mathbf{q}_1\\mathbf{q}_1^{\\mathsf T}+2\\mathbf{q}_2\\mathbf{q}_2^{\\mathsf T}$ 中，$\\mathbf{q}_1\\mathbf{q}_1^{\\mathsf T}=$？',
        options: [
          { text: '$\\frac12\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$', correct: true },
          { text: '$\\frac12\\begin{bmatrix}1&-1\\\\-1&1\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}$', correct: false },
          { text: '$\\frac12\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$\\lambda=4$ 对应特征向量 $(1,1)^{\\mathsf T}$，单位化得 $\\mathbf{q}_1=(1,1)^{\\mathsf T}/\\sqrt2$，外积即 $\\frac12\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。这是 $\\mathbf{q}_2\\mathbf{q}_2^{\\mathsf T}$，对应特征值 $2$ 的特征向量 $(1,-1)^{\\mathsf T}$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。两个投影矩阵之和才是 $I$，单个 $\\mathbf{q}_1\\mathbf{q}_1^{\\mathsf T}$ 的秩为 $1$，不是单位矩阵。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\mathbf{q}_1$ 的两个分量同号，外积四个元素都应非负，这个矩阵含负元素。</span></div>"
      },
      {
        id: 'ch06-q16', ch: 'ch06', type: 'mcq', difficulty: 3,
        kp: '6.4 Symmetric Matrices', tags: ['proof', 'concept'],
        stem: '设 $A$ 是实对称矩阵，$\\lambda_1\\ne\\lambda_2$ 是其特征值，$\\mathbf{x}_1,\\mathbf{x}_2$ 是对应的特征向量。下列哪条推理正确说明了 $\\mathbf{x}_1^{\\mathsf T}\\mathbf{x}_2=0$？',
        options: [
          { text: '因为 $A$ 的特征值都是实数，所以特征向量正交。', correct: false },
          { text: '因为 $A$ 可对角化，所以特征向量构成 $\\mathbb{R}^n$ 的一组基。', correct: false },
          { text: '因为 $\\det(A^{\\mathsf T})=\\det(A)$，所以两个特征向量正交。', correct: false },
          { text: '由 $A\\mathbf{x}_1=\\lambda_1\\mathbf{x}_1$ 左乘 $\\mathbf{x}_2^{\\mathsf T}$ 得 $\\lambda_1\\mathbf{x}_2^{\\mathsf T}\\mathbf{x}_1$；又由 $A^{\\mathsf T}=A$ 得 $\\mathbf{x}_2^{\\mathsf T}A\\mathbf{x}_1=(A\\mathbf{x}_2)^{\\mathsf T}\\mathbf{x}_1=\\lambda_2\\mathbf{x}_2^{\\mathsf T}\\mathbf{x}_1$；两式相减得 $(\\lambda_1-\\lambda_2)\\mathbf{x}_2^{\\mathsf T}\\mathbf{x}_1=0$，而 $\\lambda_1\\ne\\lambda_2$，故 $\\mathbf{x}_2^{\\mathsf T}\\mathbf{x}_1=0$。', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。特征值为实数与特征向量是否正交没有因果关系，这不是证明。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。可对角化只保证有 $n$ 个线性无关的特征向量，与正交性无关。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\det(A^{\\mathsf T})=\\det(A)$ 对任何方阵都成立，推不出任何正交性结论。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。关键是把 $\\mathbf{x}_2^{\\mathsf T}A\\mathbf{x}_1$ 用两种方式计算：一种用 $A\\mathbf{x}_1$，一种用对称性 $A^{\\mathsf T}=A$ 把 $A$ 移到 $\\mathbf{x}_2$ 上，再比较系数。</span></div>"
      },
      {
        id: 'ch06-q17', ch: 'ch06', type: 'mcq', difficulty: 1,
        kp: '6.5 Positive Definite Matrices', tags: ['compute'],
        stem: '用顺序主子式判定 $A=\\begin{bmatrix}2&1\\\\1&3\\end{bmatrix}$ 的正定性，结论与理由都正确的是？',
        options: [
          { text: '正定，因为一阶顺序主子式 $2\\gt 0$，二阶顺序主子式 $\\det(A)=5\\gt 0$。', correct: true },
          { text: '正定，因为两个对角元 $2$ 与 $3$ 都大于 $0$。', correct: false },
          { text: '不正定，因为非对角元 $1$ 不为 $0$。', correct: false },
          { text: '负定，因为 $\\det(A)=5\\gt 0$。', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$2\\times2$ 对称矩阵正定当且仅当 $\\Delta_1=a_{11}\\gt0$ 且 $\\Delta_2=\\det(A)\\gt0$，这里 $2\\gt0$、$5\\gt0$ 都满足。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。对角元全正不是充分条件，如 $\\begin{bmatrix}1&2\\\\2&1\\end{bmatrix}$ 的对角元是 $1,1$，却不定。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。非对角元非零不影响正定性，正定矩阵完全可以有非零的非对角元。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。负定要求奇数阶顺序主子式为负；这里 $\\Delta_1=2\\gt0$，不可能是负定。</span></div>"
      },
      {
        id: 'ch06-q18', ch: 'ch06', type: 'mcq', difficulty: 2,
        kp: '6.5 Positive Definite Matrices', tags: ['compute'],
        stem: '二次型 $q(x_1,x_2)=x_1^2+4x_1x_2+5x_2^2$ 配方后的结果是？',
        options: [
          { text: '$(x_1+4x_2)^2-11x_2^2$', correct: false },
          { text: '$(x_1+2x_2)^2-x_2^2$', correct: false },
          { text: '$(x_1+2x_2)^2+5x_2^2$', correct: false },
          { text: '$(x_1+2x_2)^2+x_2^2$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$(x_1+4x_2)^2$ 的交叉项系数是 $8$，已是题目中 $4$ 的两倍。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。展开后 $x_2^2$ 的系数是 $4-1=3$，不等于 $5$，而且这个式子是变号的。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。完全平方里已经含 $4x_2^2$，再整体加上 $5x_2^2$ 会多算一次。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$(x_1+2x_2)^2=x_1^2+4x_1x_2+4x_2^2$，还差 $x_2^2$，所以 $q=(x_1+2x_2)^2+x_2^2\\gt0$，二次型正定。</span></div>"
      },
      {
        id: 'ch06-q19', ch: 'ch06', type: 'mcq', difficulty: 2,
        kp: '6.5 Positive Definite Matrices', tags: ['concept'],
        stem: '设 $A$ 是 $n$ 阶实对称矩阵。下列条件中，与「$A$ 正定」不等价的是？',
        options: [
          { text: '所有特征值都 $\\gt 0$。', correct: false },
          { text: '所有顺序主子式都 $\\gt 0$。', correct: false },
          { text: '对一切 $\\mathbf{x}\\ne\\mathbf{0}$ 都有 $\\mathbf{x}^{\\mathsf T}A\\mathbf{x}\\gt 0$。', correct: false },
          { text: '$\\det(A)\\gt 0$。', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错（不选）。特征值全正是正定的标准等价条件，与正定等价，所以它不是本题要选的不等价项。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错（不选）。顺序主子式全正就是 Sylvester 判据，与正定等价。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错（不选）。这正是正定的定义式，属于等价条件。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对（本题选它）。$\\det(A)\\gt0$ 只是必要条件：$\\begin{bmatrix}-1&0\\\\0&-1\\end{bmatrix}$ 的行列式为 $1$，特征值却都是 $-1$，是负定的。</span></div>"
      },
      {
        id: 'ch06-q20', ch: 'ch06', type: 'mcq', difficulty: 3,
        kp: '6.5 Positive Definite Matrices', tags: ['trap', 'concept'],
        stem: '设 $A$ 是 $n$ 阶实对称矩阵，且 $A^2=A$。下列结论正确的是？',
        options: [
          { text: '$A$ 一定正定。', correct: false },
          { text: '$A$ 半正定，且 $A$ 正定当且仅当 $A=I$。', correct: true },
          { text: '$A$ 一定可逆。', correct: false },
          { text: '$A$ 的特征值可以是 $-1$。', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$n=2$ 时 $\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}$ 满足 $A^2=A$，但特征值含 $0$，只是半正定而非正定。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$A^2=A$ 给 $\\lambda^2=\\lambda$，故特征值只能是 $0$ 或 $1$，于是 $\\mathbf{x}^{\\mathsf T}A\\mathbf{x}\\ge0$；要正定必须排除 $0$，即 $A=I$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。投影矩阵可以有零特征值，如上面的例子，此时 $A$ 不可逆。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。把 $\\lambda=-1$ 代入 $\\lambda^2=\\lambda$ 得 $1=-1$，不成立；特征值只能是 $0$ 或 $1$。</span></div>"
      },
      /* ---------------- ch07 · The Singular Value Decomposition（20 题） ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', type: 'mcq', difficulty: 1,
        kp: '7.2 Bases and Matrices in the SVD', tags: ['concept'],
        stem: '设 $A$ 是 $m\\times n$ 矩阵，$r=\\operatorname{rank}(A)$，奇异值分解为 $A=U\\Sigma V^{\\mathsf T}$。关于 $U$、$\\Sigma$、$V$ 的说法，正确的是？',
        options: [
          { text: '$U$ 的列是 $AA^{\\mathsf T}$ 的单位特征向量，$V$ 的列是 $A^{\\mathsf T}A$ 的单位特征向量', correct: true },
          { text: '$U$ 的列是 $A^{\\mathsf T}A$ 的单位特征向量，$V$ 的列是 $AA^{\\mathsf T}$ 的单位特征向量', correct: false },
          { text: '$\\Sigma$ 的对角元就是 $A^{\\mathsf T}A$ 的全部特征值', correct: false },
          { text: '$U$、$V$ 可以任取正交矩阵，只要 $\\Sigma$ 的对角元降序排列', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。由 $A^{\\mathsf T}A=V\\Sigma^{\\mathsf T}\\Sigma V^{\\mathsf T}$ 知 $V$ 的列是 $A^{\\mathsf T}A$ 的单位特征向量；同理由 $AA^{\\mathsf T}=U\\Sigma\\Sigma^{\\mathsf T}U^{\\mathsf T}$ 知 $U$ 的列是 $AA^{\\mathsf T}$ 的单位特征向量。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。把 $U$ 与 $V$ 的角色弄反了：$A^{\\mathsf T}A$ 给出的是 $V$，$AA^{\\mathsf T}$ 给出的才是 $U$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\Sigma$ 的对角元是奇异值 $\\sigma_i=\\sqrt{\\lambda_i}$，比 $A^{\\mathsf T}A$ 的特征值少了一次开方。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$U$、$V$ 必须与 $A$ 的特征向量一一对应，随意取正交矩阵不能保证 $A=U\\Sigma V^{\\mathsf T}$ 成立。</span></div>"
      },
      {
        id: 'ch07-q2', ch: 'ch07', type: 'mcq', difficulty: 1,
        kp: '7.2 Bases and Matrices in the SVD', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}2&0\\\\0&-3\\end{bmatrix}$，则 $A$ 的两个奇异值是？',
        options: [
          { text: '$9$ 与 $4$', correct: false },
          { text: '$3$ 与 $2$', correct: true },
          { text: '$-3$ 与 $2$', correct: false },
          { text: '$3$ 与 $-2$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$9$ 与 $4$ 是 $A^{\\mathsf T}A$ 的特征值，忘记开平方；奇异值应取它们的算术平方根。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$A^{\\mathsf T}A=\\operatorname{diag}(4,9)$，特征值为 $9$ 与 $4$，故 $\\sigma_1=\\sqrt{9}=3$、$\\sigma_2=\\sqrt{4}=2$，按降序排列。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。奇异值定义为非负平方根，$A$ 的负特征值 $-3$ 不能直接当作奇异值使用。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$-2$ 不是任何平方根的结果；奇异值恒为非负数，负号在取平方根时就消失了。</span></div>"
      },
      {
        id: 'ch07-q3', ch: 'ch07', type: 'mcq', difficulty: 1,
        kp: '7.4 The Geometry of the SVD', tags: ['concept'],
        stem: '设 $A$ 是 $2\\times2$ 可逆矩阵，奇异值 $\\sigma_1\\ge\\sigma_2\\gt 0$。单位圆 $\\lVert\\mathbf{x}\\rVert=1$ 在映射 $\\mathbf{x}\\mapsto A\\mathbf{x}$ 下的像是？',
        options: [
          { text: '半径为 $\\sigma_1\\sigma_2$ 的圆', correct: false },
          { text: '半轴长为 $A$ 的特征值 $\\lambda_1$、$\\lambda_2$ 的椭圆', correct: false },
          { text: '半轴长为 $\\sigma_1$ 与 $\\sigma_2$ 的椭圆', correct: true },
          { text: '半轴长为 $1/\\sigma_1$ 与 $1/\\sigma_2$ 的椭圆', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。只有 $\\sigma_1=\\sigma_2$ 时像才是圆，且半径是 $\\sigma_1$ 而不是乘积 $\\sigma_1\\sigma_2$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。椭圆半轴是奇异值而非特征值，例如 $\\begin{bmatrix}1&2\\\\2&1\\end{bmatrix}$ 的特征值为 $3$ 与 $-1$，半轴却是 $3$ 与 $1$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$A=U\\Sigma V^{\\mathsf T}$ 中 $V^{\\mathsf T}$ 保持单位圆不变，$\\Sigma$ 把它拉成半轴为 $\\sigma_1,\\sigma_2$ 的轴对齐椭圆，$U$ 只作旋转。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$1/\\sigma_i$ 是 $A^{-1}$ 的奇异值，对应的是 $A^{-1}$ 把单位圆拉成的椭圆。</span></div>"
      },
      {
        id: 'ch07-q4', ch: 'ch07', type: 'mcq', difficulty: 1,
        kp: '7.3 Principal Component Analysis (PCA by the SVD)', tags: ['compute'],
        stem: '设数据已中心化，协方差矩阵为 $C=\\begin{bmatrix}9&0\\\\0&1\\end{bmatrix}$。第一主成分的方向与它解释的方差比例是？',
        options: [
          { text: '方向 $(1,0)$，比例 $\\frac{9}{10}$', correct: true },
          { text: '方向 $(0,1)$，比例 $\\frac{9}{10}$', correct: false },
          { text: '方向 $(1,0)$，比例 $\\frac{1}{10}$', correct: false },
          { text: '方向 $\\frac{1}{\\sqrt2}(1,1)$，比例 $\\frac12$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。最大特征值 $9$ 对应特征向量 $\\mathbf{e}_1$，它解释的方差比例为 $9/(9+1)=9/10$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$(0,1)$ 对应最小特征值 $1$，是第二主成分方向，把两个主成分的顺序弄反了。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$1/10$ 是第二主成分解释的比例，误把最小特征值当成了最大特征值。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$(1,1)/\\sqrt2$ 只有在两个特征值相等时才是主方向，这里 $C$ 已是对角阵，主方向就是坐标轴。</span></div>"
      },
      {
        id: 'ch07-q5', ch: 'ch07', type: 'mcq', difficulty: 1,
        kp: '7.1 Image Processing by Linear Algebra', tags: ['concept'],
        stem: '用 SVD 压缩一幅 $m\\times n$ 的灰度图像时，若只保留前 $r$ 个奇异值及其左右奇异向量，需要存储的参数个数约为？',
        options: [
          { text: '$r$', correct: false },
          { text: '$mn$', correct: false },
          { text: '$mr$', correct: false },
          { text: '$r(m+n+1)$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。只存 $r$ 个奇异值而丢掉 $\\mathbf{u}_i$ 与 $\\mathbf{v}_i$，根本无法重构出图像。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$mn$ 是原图的全部像素个数，一个数都没省，等于没有压缩。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$mr$ 只算了 $U$ 的前 $r$ 列，漏掉了 $V$ 的列与 $r$ 个奇异值本身。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。需存 $r$ 个 $\\sigma_i$、$U$ 的 $r$ 列（$mr$ 个数）与 $V$ 的 $r$ 列（$nr$ 个数），合计 $r(m+n+1)$。</span></div>"
      },
      {
        id: 'ch07-q6', ch: 'ch07', type: 'mcq', difficulty: 1,
        kp: '7.2 Bases and Matrices in the SVD', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$，则 $A$ 的秩与非零奇异值是？',
        options: [
          { text: '秩 $2$，$\\sigma_1=\\sigma_2=\\sqrt2$', correct: false },
          { text: '秩 $1$，$\\sigma_1=2$', correct: true },
          { text: '秩 $1$，$\\sigma_1=\\sqrt2$', correct: false },
          { text: '秩 $2$，$\\sigma_1=2$，$\\sigma_2=0$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。两行完全相同，秩只能是 $1$，不可能有两个非零奇异值。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$A^{\\mathsf T}A=\\begin{bmatrix}2&2\\\\2&2\\end{bmatrix}$ 的特征值为 $4$ 与 $0$，故 $\\sigma_1=\\sqrt4=2$，非零奇异值只有一个，秩为 $1$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\sqrt2$ 是列向量的长度，不是奇异值；$A^{\\mathsf T}A$ 的最大特征值是 $4$，开方得 $2$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\sigma_2=0$ 恰恰说明秩为 $1$，说秩是 $2$ 与 $\\sigma_2=0$ 自相矛盾。</span></div>"
      },
      {
        id: 'ch07-q7', ch: 'ch07', type: 'mcq', difficulty: 2,
        kp: '7.2 Bases and Matrices in the SVD', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2\\\\2&1\\end{bmatrix}$，则 $A$ 的两个奇异值是？',
        options: [
          { text: '$3$ 与 $-1$', correct: false },
          { text: '$3$ 与 $0$', correct: false },
          { text: '$3$ 与 $1$', correct: true },
          { text: '$9$ 与 $1$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$-1$ 是 $A$ 的特征值，奇异值要取非负平方根，不能保留负号。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$\\det A=1-4=-3\\ne0$，$A$ 可逆，不存在零奇异值。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$A^{\\mathsf T}A=\\begin{bmatrix}5&4\\\\4&5\\end{bmatrix}$ 的特征值为 $9$ 与 $1$，开方得奇异值 $3$ 与 $1$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$9$ 与 $1$ 是 $A^{\\mathsf T}A$ 的特征值，忘记开平方，把 $\\sigma$ 当成了 $\\lambda$。</span></div>"
      },
      {
        id: 'ch07-q8', ch: 'ch07', type: 'mcq', difficulty: 2,
        kp: '7.2 Bases and Matrices in the SVD', tags: ['concept', 'trap'],
        stem: '设 $A$ 是 $n$ 阶实对称矩阵，其特征值为 $\\lambda_1,\\dots,\\lambda_n$（可能有负值）。则 $A$ 的奇异值是？',
        options: [
          { text: '$\\lambda_1,\\dots,\\lambda_n$', correct: false },
          { text: '$\\lambda_1^2,\\dots,\\lambda_n^2$', correct: false },
          { text: '$\\sqrt{|\\lambda_1|},\\dots,\\sqrt{|\\lambda_n|}$', correct: false },
          { text: '$|\\lambda_1|,\\dots,|\\lambda_n|$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。特征值为负时它不是奇异值，例如 $\\begin{bmatrix}1&2\\\\2&1\\end{bmatrix}$ 的特征值是 $3$ 与 $-1$，奇异值却是 $3$ 与 $1$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$\\lambda_i^2$ 是 $A^{\\mathsf T}A=A^2$ 的特征值，还要再开一次平方才能得到奇异值。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。先开方再取绝对值的顺序错了，由 $\\sigma_i=\\sqrt{\\lambda_i^2}$ 看出根号作用在平方之上。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。对称时 $A^{\\mathsf T}A=A^2$，其特征值为 $\\lambda_i^2$，故 $\\sigma_i=\\sqrt{\\lambda_i^2}=|\\lambda_i|$。</span></div>"
      },
      {
        id: 'ch07-q9', ch: 'ch07', type: 'mcq', difficulty: 2,
        kp: '7.4 The Geometry of the SVD', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}4&0\\\\0&2\\end{bmatrix}$，则 $A$ 的条件数 $\\kappa(A)=\\sigma_1/\\sigma_2$ 等于？',
        options: [
          { text: '$2$', correct: true },
          { text: '$4$', correct: false },
          { text: '$8$', correct: false },
          { text: '$1$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$\\sigma_1=4$、$\\sigma_2=2$，故 $\\kappa=4/2=2$，两个方向的拉伸只差两倍。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$4$ 是最大奇异值 $\\sigma_1$ 本身，条件数要的是两个奇异值的比值。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$8$ 是 $\\sigma_1\\sigma_2=\\det A$，行列式的大小与条件数没有这种关系。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$1$ 是正交矩阵或单位阵的条件数，$A$ 不是正交矩阵，拉伸倍数不同。</span></div>"
      },
      {
        id: 'ch07-q10', ch: 'ch07', type: 'mcq', difficulty: 2,
        kp: '7.3 Principal Component Analysis (PCA by the SVD)', tags: ['compute'],
        stem: '设中心化后数据的协方差矩阵为 $C=\\begin{bmatrix}4&2\\\\2&4\\end{bmatrix}$，则第一主成分的单位方向与对应的方差是？',
        options: [
          { text: '$\\frac{1}{\\sqrt2}(1,-1)$，方差 $2$', correct: false },
          { text: '$\\frac{1}{\\sqrt2}(1,1)$，方差 $6$', correct: true },
          { text: '$\\frac{1}{\\sqrt2}(1,1)$，方差 $4$', correct: false },
          { text: '$(1,0)$，方差 $4$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$(1,-1)$ 对应特征值 $2$，是第二主成分方向，把两个特征向量弄反了。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$C\\begin{bmatrix}1\\\\1\\end{bmatrix}=\\begin{bmatrix}6\\\\6\\end{bmatrix}=6\\begin{bmatrix}1\\\\1\\end{bmatrix}$，故单位方向为 $(1,1)/\\sqrt2$，方差为 $6$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$4$ 是对角元而不是特征值；解 $\\det(C-\\lambda I)=0$ 得特征值 $6$ 与 $2$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$C$ 非对角，$(1,0)$ 不是特征向量，$C\\begin{bmatrix}1\\\\0\\end{bmatrix}=\\begin{bmatrix}4\\\\2\\end{bmatrix}$ 与 $(1,0)$ 不平行。</span></div>"
      },
      {
        id: 'ch07-q11', ch: 'ch07', type: 'mcq', difficulty: 2,
        kp: '7.2 Bases and Matrices in the SVD', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}3&0\\\\0&0\\end{bmatrix}$，则 $A$ 的 Moore-Penrose 伪逆 $A^{+}$ 是？',
        options: [
          { text: '$\\begin{bmatrix}3&0\\\\0&0\\end{bmatrix}$', correct: false },
          { text: '不存在，因为 $A$ 不可逆', correct: false },
          { text: '$\\begin{bmatrix}1/3&0\\\\0&0\\end{bmatrix}$', correct: true },
          { text: '$\\begin{bmatrix}1/3&0\\\\0&1\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$A^{+}=\\operatorname{diag}(1/3,0)\\ne A$：伪逆要把每个非零奇异值取倒数，$A$ 中的 $3$ 变成了 $1/3$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。伪逆对任何矩阵都存在（包括奇异矩阵与非方阵），只是奇异时不等于逆矩阵。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$A$ 已是对角形的 SVD，$\\Sigma^{+}=\\operatorname{diag}(1/3,0)$，非零奇异值取倒数，零奇异值仍取 $0$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。把零奇异值当成了 $1/0=1$，正确做法是零奇异值的倒数仍取 $0$。</span></div>"
      },
      {
        id: 'ch07-q12', ch: 'ch07', type: 'mcq', difficulty: 2,
        kp: '7.2 Bases and Matrices in the SVD', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$，其 SVD 中 $\\sigma_1=5$，$\\mathbf{u}_1=\\mathbf{v}_1=\\frac{1}{\\sqrt5}(1,2)^{\\mathsf T}$。则 $\\sigma_1\\mathbf{u}_1\\mathbf{v}_1^{\\mathsf T}$ 等于？',
        options: [
          { text: '$\\frac15\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}5&10\\\\10&20\\end{bmatrix}$', correct: false },
          { text: '$\\sqrt5\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。漏乘 $\\sigma_1=5$：$\\mathbf{u}_1\\mathbf{v}_1^{\\mathsf T}=\\frac15\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$，还要再乘 $5$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。重复乘了 $5$：$\\mathbf{u}_1\\mathbf{v}_1^{\\mathsf T}$ 已含因子 $\\frac15$，再乘 $5$ 恰好抵消。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。只归一化了 $\\mathbf{u}_1$，漏掉 $\\mathbf{v}_1$ 的因子 $\\frac{1}{\\sqrt5}$，系数变成 $5\\cdot\\frac{1}{\\sqrt5}=\\sqrt5$；正确系数是 $5\\cdot\\frac{1}{\\sqrt5}\\cdot\\frac{1}{\\sqrt5}=1$。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$5\\cdot\\frac15\\begin{bmatrix}1\\\\2\\end{bmatrix}\\begin{bmatrix}1&2\\end{bmatrix}=\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$，秩 $1$ 矩阵的这一项就等于 $A$ 本身。</span></div>"
      },
      {
        id: 'ch07-q13', ch: 'ch07', type: 'mcq', difficulty: 2,
        kp: '7.1 Image Processing by Linear Algebra', tags: ['compute'],
        stem: '一幅 $100\\times100$ 的灰度图像用 SVD 保留前 $5$ 个奇异值做近似，需要存储的数值个数与原始图像相比约为？',
        options: [
          { text: '$1005$，约为原来的 $\\frac{1}{10}$', correct: true },
          { text: '$500$，约为原来的 $\\frac{1}{20}$', correct: false },
          { text: '$1000$，约为原来的 $\\frac{1}{10}$', correct: false },
          { text: '$5$，压缩了 $2000$ 倍', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$5(100+100+1)=1005$，约为 $10000$ 个像素的十分之一。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$500=5\\times100$ 只算了 $U$ 的 $5$ 列，漏掉了奇异值与 $V$ 的列。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$1000=5\\times200$ 漏掉了 $5$ 个奇异值本身，正确个数是 $1005$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$5$ 只是奇异值的个数，没有算重构图像所必需的左右奇异向量。</span></div>"
      },
      {
        id: 'ch07-q14', ch: 'ch07', type: 'mcq', difficulty: 3,
        kp: '7.2 Bases and Matrices in the SVD', tags: ['proof'],
        stem: '学生证明「若 $A^{\\mathsf T}A\\mathbf{v}=\\lambda\\mathbf{v}$ 且 $\\lVert\\mathbf{v}\\rVert=1$，则 $\\lVert A\\mathbf{v}\\rVert=\\lambda$」的步骤如下：(i) $\\lVert A\\mathbf{v}\\rVert^2=(A\\mathbf{v})^{\\mathsf T}(A\\mathbf{v})$；(ii) $=\\mathbf{v}^{\\mathsf T}A^{\\mathsf T}A\\mathbf{v}$；(iii) $=\\mathbf{v}^{\\mathsf T}(\\lambda\\mathbf{v})=\\lambda\\lVert\\mathbf{v}\\rVert^2=\\lambda$；(iv) 故 $\\lVert A\\mathbf{v}\\rVert=\\lambda$。其中哪一步有误？',
        options: [
          { text: '第 (i) 步，$\\lVert A\\mathbf{v}\\rVert^2$ 应写成 $\\mathbf{v}^{\\mathsf T}A\\mathbf{v}$', correct: false },
          { text: '第 (iv) 步，由 $\\lVert A\\mathbf{v}\\rVert^2=\\lambda$ 应得 $\\lVert A\\mathbf{v}\\rVert=\\sqrt{\\lambda}$', correct: true },
          { text: '第 (ii) 步，$(A\\mathbf{v})^{\\mathsf T}(A\\mathbf{v})$ 不等于 $\\mathbf{v}^{\\mathsf T}A^{\\mathsf T}A\\mathbf{v}$', correct: false },
          { text: '第 (iii) 步，$\\mathbf{v}^{\\mathsf T}(\\lambda\\mathbf{v})$ 应等于 $\\lambda^2$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。第 (i) 步是范数平方的定义式，用的是 $(A\\mathbf{v})^{\\mathsf T}(A\\mathbf{v})$，不是二次型 $\\mathbf{v}^{\\mathsf T}A\\mathbf{v}$。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。由 $\\lVert A\\mathbf{v}\\rVert^2=\\lambda$ 开平方得 $\\lVert A\\mathbf{v}\\rVert=\\sqrt{\\lambda}$，这正是奇异值 $\\sigma=\\sqrt{\\lambda}$ 的来源。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。第 (ii) 步正确，因为 $(A\\mathbf{v})^{\\mathsf T}=\\mathbf{v}^{\\mathsf T}A^{\\mathsf T}$，展开后正是 $\\mathbf{v}^{\\mathsf T}A^{\\mathsf T}A\\mathbf{v}$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。第 (iii) 步正确，$\\mathbf{v}^{\\mathsf T}(\\lambda\\mathbf{v})=\\lambda(\\mathbf{v}^{\\mathsf T}\\mathbf{v})=\\lambda$，并不会出现 $\\lambda^2$。</span></div>"
      },
      {
        id: 'ch07-q15', ch: 'ch07', type: 'mcq', difficulty: 3,
        kp: '7.3 Principal Component Analysis (PCA by the SVD)', tags: ['concept'],
        stem: '设已中心化的数据矩阵 $X$（每行一个样本）的 SVD 为 $X=U\\Sigma V^{\\mathsf T}$，协方差矩阵取 $\\frac{1}{n-1}X^{\\mathsf T}X$。关于 PCA 的说法正确的是？',
        options: [
          { text: '主成分方向是 $U$ 的列向量', correct: false },
          { text: '第 $i$ 个主成分的方差就是 $\\sigma_i$', correct: false },
          { text: '主成分方向是 $V$ 的列向量，第 $i$ 个主成分的方差是 $\\sigma_i^2/(n-1)$', correct: true },
          { text: '主成分方向张成 $X$ 的零空间', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$U$ 的列是样本一侧的得分方向，主成分方向在特征一侧，应取 $V$ 的列。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。差了一个平方与因子：$X^{\\mathsf T}X=V\\Sigma^2V^{\\mathsf T}$，方差是 $\\sigma_i^2/(n-1)$ 而不是 $\\sigma_i$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$X^{\\mathsf T}X=V\\Sigma^2V^{\\mathsf T}$，故主方向是 $V$ 的列，对应方差为 $\\sigma_i^2/(n-1)$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。零空间方向对应方差 $0$，是最不值得保留的方向，与主成分正好相反。</span></div>"
      },
      {
        id: 'ch07-q16', ch: 'ch07', type: 'mcq', difficulty: 3,
        kp: '7.4 The Geometry of the SVD', tags: ['concept'],
        stem: '设 $A$ 是 $m\\times n$ 矩阵，$r=\\operatorname{rank}(A)$，SVD 为 $A=U\\Sigma V^{\\mathsf T}$。下列说法正确的是？',
        options: [
          { text: '$A$ 把 $N(A)$ 中的非零向量映为列空间中的非零向量', correct: false },
          { text: '$A$ 把 $C(A^{\\mathsf T})$ 中的单位向量映成长度不超过 $\\sigma_r$ 的向量', correct: false },
          { text: '$V$ 的前 $r$ 列张成 $N(A)$', correct: false },
          { text: '$A$ 把行空间的正交基 $\\mathbf{v}_1,\\dots,\\mathbf{v}_r$ 映为列空间的正交基 $\\sigma_1\\mathbf{u}_1,\\dots,\\sigma_r\\mathbf{u}_r$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$N(A)$ 中的向量被映为 $\\mathbf{0}$，这正是零空间的定义，不可能映成非零向量。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。方向反了：行空间中单位向量的像长介于 $\\sigma_r$ 与 $\\sigma_1$ 之间，不小于 $\\sigma_r$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$V$ 的前 $r$ 列张成行空间 $C(A^{\\mathsf T})$，$N(A)$ 由 $V$ 的后 $n-r$ 列张成。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$A\\mathbf{v}_i=\\sigma_i\\mathbf{u}_i$，行空间的正交基被映为列空间的正交基，长度分别放大 $\\sigma_i$ 倍。</span></div>"
      },
      {
        id: 'ch07-q17', ch: 'ch07', type: 'mcq', difficulty: 3,
        kp: '7.2 Bases and Matrices in the SVD', tags: ['compute'],
        stem: '设 $A=\\operatorname{diag}(5,3,1)$。在谱范数意义下，$A$ 的最佳秩 $1$ 近似 $A_1$ 及误差 $\\lVert A-A_1\\rVert_2$ 是？',
        options: [
          { text: '$A_1=\\operatorname{diag}(5,0,0)$，误差 $3$', correct: true },
          { text: '$A_1=\\operatorname{diag}(5,0,0)$，误差 $1$', correct: false },
          { text: '$A_1=\\operatorname{diag}(5,3,0)$，误差 $1$', correct: false },
          { text: '$A_1=\\operatorname{diag}(1,0,0)$，误差 $4$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。Eckart-Young 定理：截断前 $k$ 个奇异值后，谱范数误差等于第 $k+1$ 个奇异值，即 $\\sigma_2=3$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$1$ 是 $\\sigma_3$，对应秩 $2$ 近似的误差；秩 $1$ 近似的误差只看 $\\sigma_2$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\operatorname{diag}(5,3,0)$ 的秩是 $2$，它根本不是秩 $1$ 近似。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\operatorname{diag}(1,0,0)$ 的误差确实是 $\\lVert\\operatorname{diag}(4,3,1)\\rVert_2=4$，但它不是最佳秩 $1$ 近似；最佳近似是 $\\operatorname{diag}(5,0,0)$，误差为 $\\sigma_2=3$。</span></div>"
      },
      {
        id: 'ch07-q18', ch: 'ch07', type: 'mcq', difficulty: 2,
        kp: '7.4 The Geometry of the SVD', tags: ['concept', 'trap'],
        stem: '设 $A$ 是 $n$ 阶方阵，$\\sigma_1\\ge\\dots\\ge\\sigma_n\\ge 0$，条件数 $\\kappa(A)=\\sigma_1/\\sigma_n$。下列说法正确的是？',
        options: [
          { text: '若 $A$ 奇异，则 $\\kappa(A)=0$', correct: false },
          { text: '正交矩阵的条件数为 $1$', correct: true },
          { text: '条件数越大，$A\\mathbf{x}=\\mathbf{b}$ 的解对 $\\mathbf{b}$ 的扰动越不敏感', correct: false },
          { text: '条件数可以小于 $1$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$A$ 奇异时 $\\sigma_n=0$，条件数为无穷大而不是 $0$；条件数的最小值是 $1$（正交矩阵），$0$ 不可能是条件数的取值。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。正交矩阵的所有奇异值都等于 $1$，$\\kappa=1/1=1$，这是条件数最小的情形。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。条件数大意味着病态，$\\mathbf{b}$ 的微小相对误差会被放大到约 $\\kappa$ 倍，是更敏感而不是更不敏感。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。由 $\\sigma_1\\ge\\sigma_n\\gt 0$ 得 $\\kappa\\ge 1$，条件数不可能小于 $1$。</span></div>"
      },
      {
        id: 'ch07-q19', ch: 'ch07', type: 'mcq', difficulty: 1,
        kp: '7.1 Image Processing by Linear Algebra', tags: ['concept'],
        stem: '图像压缩时只保留前几个奇异值就能较好地还原原图，主要原因是？',
        options: [
          { text: '后面的奇异值都是负数，可以忽略', correct: false },
          { text: '左奇异向量 $\\mathbf{u}_i$ 之间正交，所以可以丢掉一半', correct: false },
          { text: '奇异值通常衰减很快，前几项已包含图像的主要能量，截断误差由被丢弃的最大奇异值控制', correct: true },
          { text: '图像矩阵一定是满秩的，去掉几项不影响结果', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。奇异值一律非负，不存在负数奇异值，能否忽略只看它的大小。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。正交性对所有 $i$ 都成立，不能说明后几项可以丢；能否丢取决于 $\\sigma_i$ 的大小。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。Eckart-Young 定理保证截断误差的谱范数等于下一个被丢弃的奇异值，$\\sigma_i$ 衰减快时误差很小。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。真实图像矩阵往往接近低秩，正是这一点才使低秩近似有效；满秩并不保证去掉几项没影响。</span></div>"
      },
      {
        id: 'ch07-q20', ch: 'ch07', type: 'mcq', difficulty: 1,
        kp: '7.3 Principal Component Analysis (PCA by the SVD)', tags: ['concept'],
        stem: '对数据做 PCA 之前通常先把每一列减去该列均值（中心化），主要原因是？',
        options: [
          { text: '中心化能使协方差矩阵变成对角阵', correct: false },
          { text: '中心化能保证数据矩阵满秩', correct: false },
          { text: '中心化能使所有奇异值都等于 $1$', correct: false },
          { text: '协方差矩阵的定义要求先减均值，否则均值方向会占据最大的方差', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。中心化不会让协方差矩阵对角化，对角化要靠特征向量（主成分）变换。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。中心化可能降秩（常数列会变成零列），所以不能保证满秩；数据的相关结构才决定秩的大小。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。中心化后的奇异值由数据的离散程度决定，一般并不等于 $1$。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$\\frac{1}{n-1}X^{\\mathsf T}X$ 只有在 $X$ 已中心化时才是协方差矩阵，否则第一主成分会指向均值方向。</span></div>"
      },
      /* ---------------- ch08 · Linear Transformations（20 题） ---------------- */
      {
        id: 'ch08-q1', ch: 'ch08', type: 'mcq', difficulty: 1,
        kp: '8.1 The Idea of a Linear Transformation', tags: ['concept'],
        stem: '下列映射 $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ 中，是线性变换的是？',
        options: [
          { text: '$T(x,y)=(2x-y,\\ x+3y)$', correct: true },
          { text: '$T(x,y)=(x+1,\\ y)$', correct: false },
          { text: '$T(x,y)=(x^2,\\ y)$', correct: false },
          { text: '$T(x,y)=(x,\\ |y|)$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。两个分量都是 $x,y$ 的一次齐次式，可写成矩阵 $\\begin{bmatrix}2&-1\\\\1&3\\end{bmatrix}$ 乘 $\\mathbf{x}$，满足线性性。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$T(0,0)=(1,0)\\ne(0,0)$，平移把原点移走了，$T(\\mathbf{0})=\\mathbf{0}$ 不成立。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$T(2,0)=(4,0)$ 而 $2T(1,0)=(2,0)$，不满足 $T(c\\mathbf{x})=cT(\\mathbf{x})$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$T(0,-1)=(0,1)$ 而 $-T(0,1)=(0,-1)$，绝对值破坏了数乘性。</span></div>"
      },
      {
        id: 'ch08-q2', ch: 'ch08', type: 'mcq', difficulty: 1,
        kp: '8.2 The Matrix of a Linear Transformation', tags: ['compute'],
        stem: '设 $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ 是线性变换，且 $T(\\mathbf{e}_1)=(2,1)$，$T(\\mathbf{e}_2)=(-1,3)$。则 $T$ 的标准矩阵是？',
        options: [
          { text: '$\\begin{bmatrix}2&1\\\\-1&3\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}2&-1\\\\1&3\\end{bmatrix}$', correct: true },
          { text: '$\\begin{bmatrix}1&3\\\\2&-1\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}-1&2\\\\3&1\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。把 $T(\\mathbf{e}_1)=(2,1)$ 按行写进去了，标准矩阵的第 $j$ 列才应是 $T(\\mathbf{e}_j)$。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。标准矩阵的列就是基向量的像：第 $1$ 列 $(2,1)^{\\mathsf T}$，第 $2$ 列 $(-1,3)^{\\mathsf T}$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。列的顺序与分量位置都乱了，$T(\\mathbf{e}_1)$ 应占第 $1$ 列而不是第 $2$ 列。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。相当于把两列倒序排列，$T(\\mathbf{e}_2)=(-1,3)^{\\mathsf T}$ 不应出现在第 $1$ 列。</span></div>"
      },
      {
        id: 'ch08-q3', ch: 'ch08', type: 'mcq', difficulty: 1,
        kp: '8.2 The Matrix of a Linear Transformation', tags: ['compute'],
        stem: '平面中绕原点逆时针旋转 $90^{\\circ}$ 的线性变换，其标准矩阵是？',
        options: [
          { text: '$\\begin{bmatrix}0&1\\\\-1&0\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}$', correct: true },
          { text: '$\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。这是顺时针旋转 $90^{\\circ}$ 的矩阵，旋转方向弄反了。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。这是关于 $x$ 轴的反射，$(1,0)$ 不动；而逆时针旋转把 $(1,0)$ 送到 $(0,1)$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$(1,0)\\mapsto(0,1)$，$(0,1)\\mapsto(-1,0)$，两列依次为 $(0,1)^{\\mathsf T}$ 与 $(-1,0)^{\\mathsf T}$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。这是关于直线 $y=x$ 的反射：它确实把 $(1,0)$ 送到 $(0,1)$，却把 $(0,1)$ 送到 $(1,0)$ 而非 $(-1,0)$。</span></div>"
      },
      {
        id: 'ch08-q4', ch: 'ch08', type: 'mcq', difficulty: 1,
        kp: '8.1 The Idea of a Linear Transformation', tags: ['concept'],
        stem: '设 $T:\\mathbb{R}^n\\to\\mathbb{R}^m$ 是线性变换。下列结论一定成立的是？',
        options: [
          { text: '$T$ 把线性无关组映为线性无关组', correct: false },
          { text: '$T$ 一定是单射', correct: false },
          { text: '$T$ 把正交向量映为正交向量', correct: false },
          { text: '$T(\\mathbf{0})=\\mathbf{0}$，且 $T$ 把子空间映为子空间', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。零变换把任何线性无关组都映成 $\\mathbf{0}$，映完不再无关。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。例如投影 $T(x,y)=(x,0)$，$T(0,1)=T(0,2)=\\mathbf{0}$，不是单射。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。线性变换只保持加法与数乘，不保持角度；$\\begin{bmatrix}1&0\\\\0&2\\end{bmatrix}$ 把正交的 $(1,1)$、$(1,-1)$ 映为 $(1,2)$、$(1,-2)$，点积为 $-3$。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$T(\\mathbf{0})=T(0\\cdot\\mathbf{0})=0\\cdot T(\\mathbf{0})=\\mathbf{0}$；子空间对加法与数乘封闭，其像同样封闭。</span></div>"
      },
      {
        id: 'ch08-q5', ch: 'ch08', type: 'mcq', difficulty: 2,
        kp: '8.2 The Matrix of a Linear Transformation', tags: ['compute'],
        stem: '设 $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ 是线性变换，且 $T(1,1)=(2,0)$，$T(1,0)=(0,1)$。则 $T$ 的标准矩阵是？',
        options: [
          { text: '$\\begin{bmatrix}0&2\\\\1&-1\\end{bmatrix}$', correct: true },
          { text: '$\\begin{bmatrix}2&0\\\\0&1\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}2&0\\\\-1&1\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}0&1\\\\2&-1\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$\\mathbf{e}_1=(1,0)$ 给第 $1$ 列 $(0,1)^{\\mathsf T}$；$\\mathbf{e}_2=(0,1)=(1,1)-(1,0)$，给 $(2,0)-(0,1)=(2,-1)^{\\mathsf T}$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。把已知的 $T(1,1)$、$T(1,0)$ 直接当成标准矩阵的列，忽略了输入不是标准基。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。把两组基的组合关系弄反了，误把 $\\mathbf{e}_1$ 写成 $(1,1)-(1,0)$，于是两列互换。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。这是正确答案的转置，把 $T(\\mathbf{e}_1)^{\\mathsf T}$、$T(\\mathbf{e}_2)^{\\mathsf T}$ 当成行写进了矩阵。</span></div>"
      },
      {
        id: 'ch08-q6', ch: 'ch08', type: 'mcq', difficulty: 2,
        kp: '8.3 The Search for a Good Basis', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2\\\\0&3\\end{bmatrix}$，$M=\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}$（$M$ 的列构成新基）。则 $B=M^{-1}AM$ 等于？',
        options: [
          { text: '$\\begin{bmatrix}1&3\\\\0&3\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}1&0\\\\0&3\\end{bmatrix}$', correct: true },
          { text: '$\\begin{bmatrix}3&0\\\\0&1\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}1&-3\\\\0&3\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。只算到 $AM=\\begin{bmatrix}1&3\\\\0&3\\end{bmatrix}$，忘记左乘 $M^{-1}$，新基下的矩阵必须是相似矩阵。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$M^{-1}=\\begin{bmatrix}1&-1\\\\0&1\\end{bmatrix}$，故 $M^{-1}AM=\\begin{bmatrix}1&0\\\\0&3\\end{bmatrix}$，其迹 $4$ 与 $A$ 相同。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。把两个对角元的顺序弄反了：$A\\mathbf{v}_1=\\mathbf{v}_1$，对应特征值 $1$ 应排在前。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。符号错在右上元：$(M^{-1}AM)$ 的 $(1,2)$ 元是 $3-3=0$，不是 $-3$。</span></div>"
      },
      {
        id: 'ch08-q7', ch: 'ch08', type: 'mcq', difficulty: 2,
        kp: '8.3 The Search for a Good Basis', tags: ['concept', 'trap'],
        stem: '设 $A$ 与 $B=M^{-1}AM$ 相似。下列量中两者不一定相同的是？',
        options: [
          { text: '$\\operatorname{tr}(A)$ 与 $\\operatorname{tr}(B)$', correct: false },
          { text: '$\\det(A)$ 与 $\\det(B)$', correct: false },
          { text: '$A$ 的特征向量与 $B$ 的特征向量', correct: true },
          { text: '$A$ 的特征值与 $B$ 的特征值', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$\\operatorname{tr}(M^{-1}AM)=\\operatorname{tr}(AMM^{-1})=\\operatorname{tr}(A)$，迹一定相同。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$\\det(M^{-1}AM)=\\det(M^{-1})\\det A\\det M=\\det A$，行列式一定相同。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。由 $A\\mathbf{x}=\\lambda\\mathbf{x}$ 得 $B(M^{-1}\\mathbf{x})=\\lambda(M^{-1}\\mathbf{x})$，特征向量被 $M^{-1}$ 作用，一般不同。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\det(B-\\lambda I)=\\det(A-\\lambda I)$，特征多项式相同，特征值一定相同。</span></div>"
      },
      {
        id: 'ch08-q8', ch: 'ch08', type: 'mcq', difficulty: 2,
        kp: '8.2 The Matrix of a Linear Transformation', tags: ['compute'],
        stem: "设 $T$ 是多项式空间（基 $1,x,x^2$）上的求导变换 $T(p)=p'$，则 $T$ 在该基下的矩阵是？",
        options: [
          { text: '$\\begin{bmatrix}0&0&0\\\\1&0&0\\\\0&2&0\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}0&1&0\\\\0&0&1\\\\0&0&0\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}0&2&0\\\\0&0&1\\\\0&0&0\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}0&1&0\\\\0&0&2\\\\0&0&0\\end{bmatrix}$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。这是正确答案的转置，相当于把 $T(1)$、$T(x)$、$T(x^2)$ 按行写进了矩阵。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。漏掉系数：$T(x^2)=2x$，第 $3$ 列应是 $(0,2,0)^{\\mathsf T}$ 而不是 $(0,1,0)^{\\mathsf T}$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。把系数 $2$ 放错了列，$T(x)=1$ 对应第 $2$ 列 $(1,0,0)^{\\mathsf T}$，其中不含因子 $2$。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$T(1)=0$，$T(x)=1$，$T(x^2)=2x$，三列依次为 $(0,0,0)^{\\mathsf T}$、$(1,0,0)^{\\mathsf T}$、$(0,2,0)^{\\mathsf T}$。</span></div>"
      },
      {
        id: 'ch08-q9', ch: 'ch08', type: 'mcq', difficulty: 1,
        kp: '8.1 The Idea of a Linear Transformation', tags: ['concept'],
        stem: '要说明 $T(x,y)=(x+y,\\ xy)$ 不是线性变换，下列反例成立的是？',
        options: [
          { text: '$T(2,2)=(4,4)$ 而 $2T(1,1)=(4,2)$，故 $T(2\\mathbf{v})\\ne 2T(\\mathbf{v})$', correct: true },
          { text: '因为 $T(0,0)=(0,0)$，所以 $T$ 不是线性变换', correct: false },
          { text: '因为 $T(2,0)=(4,0)$，而 $2T(1,0)=(2,0)$，两者不相等，故非线性', correct: false },
          { text: '因为 $T(1,0)=T(0,1)$，说明 $T$ 不是单射，所以不是线性变换', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$T(2,2)=(4,4)$，$2T(1,1)=2(2,1)=(4,2)$，两者不等，破坏了数乘性，故非线性。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$T(\\mathbf{0})=\\mathbf{0}$ 只是线性的必要条件，成立并不能推出线性，不能当反例。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。算错了 $T(2,0)$：$T(2,0)=(2+0,\\ 2\\cdot0)=(2,0)$，与 $2T(1,0)=(2,0)$ 恰好相等，反例不成立；错因是把第一个分量当成了 $2x$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。非单射并不能否定线性：投影 $T(x,y)=(x,0)$ 是线性变换，却把 $(0,1)$ 与 $(0,2)$ 都映成 $(0,0)$。</span></div>"
      },
      {
        id: 'ch08-q10', ch: 'ch08', type: 'mcq', difficulty: 2,
        kp: '8.3 The Search for a Good Basis', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}2&1\\\\0&3\\end{bmatrix}$，$B=M^{-1}AM$。则 $B$ 的迹与行列式分别是？',
        options: [
          { text: '$\\operatorname{tr}(B)=5$，$\\det(B)=5$', correct: false },
          { text: '$\\operatorname{tr}(B)=5$，$\\det(B)=6$', correct: true },
          { text: '$\\operatorname{tr}(B)=6$，$\\det(B)=5$', correct: false },
          { text: '$\\operatorname{tr}(B)=3$，$\\det(B)=2$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。迹算对了，但行列式是 $2\\cdot3-1\\cdot0=6$，把 $5$（迹）当成了行列式。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。相似不变量：$\\operatorname{tr}(B)=\\operatorname{tr}(A)=2+3=5$，$\\det(B)=\\det(A)=6$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。把迹与行列式的数值互换了，正确值是迹 $5$、行列式 $6$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$3$ 与 $2$ 只是 $A$ 的两个对角元；迹应为和 $5$，行列式应为积 $6$。</span></div>"
      },
      {
        id: 'ch08-q11', ch: 'ch08', type: 'mcq', difficulty: 3,
        kp: '8.2 The Matrix of a Linear Transformation', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}0&1\\\\-1&0\\end{bmatrix}$，$M=\\begin{bmatrix}1&1\\\\1&0\\end{bmatrix}$。则新基下的矩阵 $B=M^{-1}AM$ 等于？',
        options: [
          { text: '$\\begin{bmatrix}1&-2\\\\1&-1\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}1&0\\\\-1&-1\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}-1&-1\\\\2&1\\end{bmatrix}$', correct: true },
          { text: '$\\begin{bmatrix}0&1\\\\-1&0\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。换基方向写反了，算出的是 $MAM^{-1}$；新基下的矩阵应是 $M^{-1}AM$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。只算到 $AM=\\begin{bmatrix}1&0\\\\-1&-1\\end{bmatrix}$，漏掉了左乘 $M^{-1}$ 这一步。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$M^{-1}=\\begin{bmatrix}0&1\\\\1&-1\\end{bmatrix}$，乘得 $\\begin{bmatrix}-1&-1\\\\2&1\\end{bmatrix}$，其迹 $0$、行列式 $1$ 与 $A$ 一致。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。这是 $A$ 在标准基下的矩阵；换基后一般会改变，不能拿原矩阵顶替。</span></div>"
      },
      {
        id: 'ch08-q12', ch: 'ch08', type: 'mcq', difficulty: 2,
        kp: '8.2 The Matrix of a Linear Transformation', tags: ['proof'],
        stem: '为什么线性变换 $T$ 由它在基 $\\mathbf{v}_1,\\mathbf{v}_2$ 上的像唯一确定？正确的理由是？',
        options: [
          { text: '因为 $T$ 是连续映射', correct: false },
          { text: '因为 $T$ 可逆', correct: false },
          { text: '因为 $\\mathbf{v}_1,\\mathbf{v}_2$ 是正交的', correct: false },
          { text: '任意 $\\mathbf{x}$ 可唯一写成 $c_1\\mathbf{v}_1+c_2\\mathbf{v}_2$，由线性性 $T(\\mathbf{x})=c_1T(\\mathbf{v}_1)+c_2T(\\mathbf{v}_2)$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。有限维线性变换自动连续，连续性既推不出线性性，也推不出由基的像唯一确定。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。可逆与「由基的像决定」是两个独立事实，不可逆的变换同样由基的像决定。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。基不必正交，只要线性无关就能唯一表示 $\\mathbf{x}$，唯一性与正交性无关。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。基给出唯一坐标 $c_1,c_2$，再用 $T(c_1\\mathbf{v}_1+c_2\\mathbf{v}_2)=c_1T(\\mathbf{v}_1)+c_2T(\\mathbf{v}_2)$ 即得唯一像。</span></div>"
      },
      {
        id: 'ch08-q13', ch: 'ch08', type: 'mcq', difficulty: 3,
        kp: '8.3 The Search for a Good Basis', tags: ['concept'],
        stem: '设 $A=\\begin{bmatrix}2&1\\\\0&2\\end{bmatrix}$。关于 $A$ 能否对角化，正确的是？',
        options: [
          { text: '不能对角化：特征值 $2$ 的代数重数为 $2$，几何重数只有 $1$', correct: true },
          { text: '能对角化：因为它有两个特征值', correct: false },
          { text: '能对角化：因为 $A$ 可逆', correct: false },
          { text: '能对角化：$A$ 相似于 $\\begin{bmatrix}2&0\\\\0&2\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$A-2I=\\begin{bmatrix}0&1\\\\0&0\\end{bmatrix}$ 的秩为 $1$，零空间只有 $1$ 维，凑不齐 $2$ 个线性无关特征向量。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$A$ 的特征值只有二重根 $2$ 一个，并不存在两个互不相同的特征值。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\det A=4\\ne0$ 只说明可逆；可逆矩阵未必可对角化，本题就是反例。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\begin{bmatrix}2&0\\\\0&2\\end{bmatrix}=2I$ 只与它自己相似，而 $A\\ne 2I$，两者不可能相似。</span></div>"
      },
      {
        id: 'ch08-q14', ch: 'ch08', type: 'mcq', difficulty: 1,
        kp: '8.3 The Search for a Good Basis', tags: ['concept', 'trap'],
        stem: '设 $A$ 是 $n$ 阶方阵。下列说法正确的是？',
        options: [
          { text: '若 $A$ 有 $n$ 个互不相同的特征值，则 $A$ 一定可对角化', correct: true },
          { text: '若 $A$ 与 $B$ 有相同的特征值，则 $A$ 与 $B$ 一定相似', correct: false },
          { text: '若 $A$ 可逆，则 $A$ 一定可对角化', correct: false },
          { text: '若 $A$ 的特征值全都相同，则 $A$ 一定不能对角化', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。不同特征值对应的特征向量线性无关，$n$ 个互异特征值给出 $n$ 个无关特征向量，故可对角化。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$2I$ 与 $\\begin{bmatrix}2&1\\\\0&2\\end{bmatrix}$ 特征值都是 $2,2$，但后者不可对角化，二者不相似。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。可逆只说明没有零特征值；如旋转阵 $\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}$ 可逆，但在实数范围内没有实特征向量，不可对角化。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$2I$ 的特征值全为 $2$，它本身就是对角阵，当然可对角化。</span></div>"
      },
      {
        id: 'ch08-q15', ch: 'ch08', type: 'mcq', difficulty: 1,
        kp: '8.1 The Idea of a Linear Transformation', tags: ['compute'],
        stem: '设 $T$ 是 $\\mathbb{R}^2$ 到直线 $y=x$ 上的正交投影，则 $T$ 的矩阵是？',
        options: [
          { text: '$\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$', correct: false },
          { text: '$\\frac12\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$', correct: true },
          { text: '$\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。这是投影到 $x$ 轴的矩阵，它把 $(1,1)$ 映成 $(1,0)$，并不在直线 $y=x$ 上。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。这是关于 $y=x$ 的反射（交换两个坐标），反射不是投影，$T(1,1)$ 应仍为 $(1,1)$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。单位方向 $\\mathbf{u}=\\frac{1}{\\sqrt2}(1,1)^{\\mathsf T}$，$P=\\mathbf{u}\\mathbf{u}^{\\mathsf T}=\\frac12\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$，且 $P^2=P$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。漏掉归一化因子 $\\frac12$；该矩阵把 $(1,1)$ 映成 $(2,2)$，长度被放大了。</span></div>"
      },
      {
        id: 'ch08-q16', ch: 'ch08', type: 'mcq', difficulty: 2,
        kp: '8.2 The Matrix of a Linear Transformation', tags: ['compute'],
        stem: '设 $T(x,y)=(x+y,\\ x-y)$，$T$ 是可逆线性变换。则 $T^{-1}(x,y)$ 等于？',
        options: [
          { text: '$((x-y)/2,\\ (x+y)/2)$', correct: false },
          { text: '$(x-y,\\ x+y)$', correct: false },
          { text: '$T$ 不可逆，因为 $T(1,1)=(2,0)$', correct: false },
          { text: '$((x+y)/2,\\ (x-y)/2)$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。把两个分量弄反了；由 $u=x+y$、$v=x-y$ 解出 $x=(u+v)/2$、$y=(u-v)/2$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。漏掉因子 $\\frac12$；直接相加得到的是 $2x$，还要除以 $2$ 才是 $x$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$T$ 的矩阵 $\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}$ 行列式为 $-2\\ne0$，故 $T$ 可逆。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。设 $(u,v)=T(x,y)$，则 $u=x+y$、$v=x-y$，解得 $x=(u+v)/2$、$y=(u-v)/2$，故 $T^{-1}(x,y)=((x+y)/2,(x-y)/2)$。</span></div>"
      },
      {
        id: 'ch08-q17', ch: 'ch08', type: 'mcq', difficulty: 3,
        kp: '8.3 The Search for a Good Basis', tags: ['proof'],
        stem: '设 $A$ 与 $B=M^{-1}AM$ 相似。要证明它们有相同的特征值，正确的推理是？',
        options: [
          { text: '因为 $\\operatorname{tr}(A)=\\operatorname{tr}(B)$ 且 $\\det(A)=\\det(B)$，所以特征值相同', correct: false },
          { text: '$B\\mathbf{x}=\\lambda\\mathbf{x}$ 当且仅当 $A(M\\mathbf{x})=\\lambda(M\\mathbf{x})$，且 $M\\mathbf{x}\\ne\\mathbf{0}$，故特征值相同', correct: true },
          { text: '因为 $\\operatorname{rank}(A)=\\operatorname{rank}(B)$，秩相同则特征值相同', correct: false },
          { text: '因为 $B$ 由 $A$ 交换两行得到，行交换不改变特征值', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。迹与行列式相同只给出特征值的和与积，$3$ 阶以上不能由此确定各个特征值。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$M^{-1}AM\\mathbf{x}=\\lambda\\mathbf{x}$ 左乘 $M$ 得 $A(M\\mathbf{x})=\\lambda(M\\mathbf{x})$，特征向量只差可逆的 $M$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。秩相同推不出特征值相同：$\\begin{bmatrix}1&0\\\\0&2\\end{bmatrix}$ 与 $\\begin{bmatrix}1&0\\\\0&3\\end{bmatrix}$ 的秩都是 $2$，特征值却分别是 $1,2$ 与 $1,3$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$B=M^{-1}AM$ 是换基而不是行交换；而且行交换一般会改变特征值。</span></div>"
      },
      {
        id: 'ch08-q18', ch: 'ch08', type: 'mcq', difficulty: 3,
        kp: '8.3 The Search for a Good Basis', tags: ['compute'],
        stem: '设 $A$ 的特征值为 $1$ 与 $2$，且 $A$ 可对角化。则 $\\det(A^2+3A+2I)$ 等于？',
        options: [
          { text: '$18$', correct: false },
          { text: '$6$', correct: false },
          { text: '$72$', correct: true },
          { text: '$12$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$18=6+12$，把行列式当成了特征值之和；行列式应为所有特征值之积。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$6=f(1)$ 只是其中一个特征值，漏乘了 $f(2)=12$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$f(\\lambda)=\\lambda^2+3\\lambda+2$ 给出特征值 $6$ 与 $12$，故行列式为 $6\\cdot12=72$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$12=f(2)$ 只是一个特征值，行列式必须取全部特征值之积而不是单个值。</span></div>"
      },
      {
        id: 'ch08-q19', ch: 'ch08', type: 'mcq', difficulty: 2,
        kp: '8.3 The Search for a Good Basis', tags: ['concept'],
        stem: '设 $A$ 是 $4$ 阶矩阵，特征值 $2$ 的代数重数为 $3$、几何重数为 $1$。则 $A$ 的若尔当形中属于 $2$ 的部分是？',
        options: [
          { text: '三个 $1$ 阶块', correct: false },
          { text: '一个 $1$ 阶块与一个 $2$ 阶块', correct: false },
          { text: '两个 $2$ 阶块', correct: false },
          { text: '一个 $3$ 阶块', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。三个 $1$ 阶块意味着几何重数为 $3$，与题设的几何重数 $1$ 矛盾。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。两个块对应几何重数 $2$，而题设几何重数是 $1$，块数必须等于几何重数。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。两个 $2$ 阶块总阶数是 $4$，超过代数重数 $3$，且对应几何重数 $2$。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。块数等于几何重数 $1$，所有块总阶数等于代数重数 $3$，故唯一一块是 $3$ 阶块。</span></div>"
      },
      {
        id: 'ch08-q20', ch: 'ch08', type: 'mcq', difficulty: 1,
        kp: '8.1 The Idea of a Linear Transformation', tags: ['concept'],
        stem: '设 $T(\\mathbf{x})=A\\mathbf{x}$，其中 $A$ 是 $m\\times n$ 矩阵。下列说法正确的是？',
        options: [
          { text: '$T$ 的像等于 $N(A)$', correct: false },
          { text: '$T$ 的核等于 $C(A^{\\mathsf T})$', correct: false },
          { text: '$T$ 是单射当且仅当 $N(A)$ 只含零向量', correct: true },
          { text: '$T$ 是满射当且仅当 $m=n$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$T$ 的像是列空间 $C(A)$；$N(A)$ 是 $T$ 的核，两者一般完全不同。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$T$ 的核是 $N(A)$；$C(A^{\\mathsf T})$ 是行空间，它与核正交但一般并不相等。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$T(\\mathbf{x})=\\mathbf{0}$ 等价于 $A\\mathbf{x}=\\mathbf{0}$，故单射等价于零空间只含零向量。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。满射的条件是 $\\operatorname{rank}(A)=m$，与 $m=n$ 无关，例如 $2\\times3$ 矩阵也可以满射。</span></div>"
      },
      /* ---------------- ch09 · Complex Vectors and Matrices（20 题） ---------------- */
      {
        id: 'ch09-q1', ch: 'ch09', type: 'mcq', difficulty: 1,
        kp: '9.1 Complex Numbers', tags: ['compute'],
        stem: '设 $z=2+3i$，$w=1-2i$，则乘积 $zw=$？',
        options: [
          { text: '$8-i$', correct: true },
          { text: '$8-7i$', correct: false },
          { text: '$8+7i$', correct: false },
          { text: '$-4-i$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$zw=(2+3i)(1-2i)=2-4i+3i-6i^2=2-i+6=8-i$，关键是 $i^2=-1$ 让末项变成 $+6$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。把两个虚部的乘积符号都写成负，得 $2-4i-3i+6=8-7i$；实际 $3i\\cdot(-2i)=-6i^2=+6$ 是正的。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。把 $2\\cdot(-2i)$ 算成 $+4i$，得 $2+4i+3i+6=8+7i$，交叉项的符号写反了。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。误把 $i^2$ 当作 $1$，得 $2-4i+3i-6=-4-i$，丢掉了 $i^2=-1$ 这个定义。</span></div>"
      },
      {
        id: 'ch09-q2', ch: 'ch09', type: 'mcq', difficulty: 1,
        kp: '9.1 Complex Numbers', tags: ['compute'],
        stem: '设复数 $z=3-4i$，则模 $|z|$ 等于？',
        options: [
          { text: '$\\sqrt{7}$', correct: false },
          { text: '$5$', correct: true },
          { text: '$25$', correct: false },
          { text: '$7$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。把模写成 $\\sqrt{|3^2-4^2|}=\\sqrt{7}$，混淆了 $a^2+b^2$ 与 $a^2-b^2$。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$|z|=\\sqrt{3^2+(-4)^2}=\\sqrt{25}=5$，模是实部与虚部平方和的算术平方根。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。忘记开平方，直接取 $3^2+(-4)^2=25$，这个 25 是 $|z|^2$ 而不是 $|z|$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。把 $|3|+|-4|=7$ 相加，模不是两个分量绝对值之和（那是 1 范数）。</span></div>"
      },
      {
        id: 'ch09-q3', ch: 'ch09', type: 'mcq', difficulty: 1,
        kp: '9.1 Complex Numbers', tags: ['compute'],
        stem: '由欧拉公式 $e^{i\\theta}=\\cos\\theta+i\\sin\\theta$，可得 $e^{i\\pi/3}=$？',
        options: [
          { text: '$1$', correct: false },
          { text: '$-1$', correct: false },
          { text: '$\\frac{1}{2}+\\frac{\\sqrt{3}}{2}i$', correct: true },
          { text: '$i$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$1=e^{0}$ 对应 $\\theta=0$，把指数上的 $\\frac{\\pi}{3}$ 当成了 0。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$-1=e^{i\\pi}$ 对应 $\\theta=\\pi$，把 $\\frac{\\pi}{3}$ 与 $\\pi$ 混为一谈。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。取 $\\theta=\\frac{\\pi}{3}$，$\\cos\\frac{\\pi}{3}=\\frac{1}{2}$、$\\sin\\frac{\\pi}{3}=\\frac{\\sqrt{3}}{2}$，故 $e^{i\\pi/3}=\\frac{1}{2}+\\frac{\\sqrt{3}}{2}i$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$i=e^{i\\pi/2}$ 对应 $\\theta=\\frac{\\pi}{2}$，不是 $\\frac{\\pi}{3}$。</span></div>"
      },
      {
        id: 'ch09-q4', ch: 'ch09', type: 'mcq', difficulty: 2,
        kp: '9.1 Complex Numbers', tags: ['compute'],
        stem: '设 $z=1+\\sqrt{3}i$，则 $z^3=$？',
        options: [
          { text: '$8$', correct: false },
          { text: '$-8$', correct: true },
          { text: '$8i$', correct: false },
          { text: '$-8i$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。只算了 $|z|^3=8$ 而丢掉辐角，$z^3$ 的辐角是 $3\\cdot\\frac{\\pi}{3}=\\pi$，不是 0。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$|z|=2$，$\\arg z=\\frac{\\pi}{3}$，故 $z=2e^{i\\pi/3}$，$z^3=8e^{i\\pi}=-8$；直接乘 $(1+\\sqrt{3}i)^2=-2+2\\sqrt{3}i$ 再乘一次也得 $-8$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。把三倍辐角算成 $\\frac{\\pi}{2}$ 才会得 $8i$，实际 $3\\cdot\\frac{\\pi}{3}=\\pi$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。把辐角算成 $-\\frac{\\pi}{2}$ 才会得 $-8i$；模 8 是对的，但方向应是 $\\pi$。</span></div>"
      },
      {
        id: 'ch09-q5', ch: 'ch09', type: 'mcq', difficulty: 2,
        kp: '9.1 Complex Numbers', tags: ['compute'],
        stem: '设复向量 $\\mathbf{x}=(1,i,2)$，$\\mathbf{y}=(i,1,-i)$，则内积 $\\mathbf{x}^{\\mathsf H}\\mathbf{y}=$？',
        options: [
          { text: '$0$', correct: false },
          { text: '$2i$', correct: false },
          { text: '$-2i$', correct: true },
          { text: '$-2$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。没有取共轭直接算 $1\\cdot i+i\\cdot 1+2\\cdot(-i)=i+i-2i=0$，复内积必须对左向量取共轭。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。这是 $\\mathbf{y}^{\\mathsf H}\\mathbf{x}=2i$，交换次序得到的是原内积的共轭，应为 $-2i$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$\\mathbf{x}^{\\mathsf H}\\mathbf{y}=\\bar 1\\cdot i+\\bar i\\cdot 1+\\bar 2\\cdot(-i)=i-i-2i=-2i$，先取共轭再逐项相乘。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。把 $2\\cdot(-i)$ 当成实数 $-2$，把虚数单位丢掉了。</span></div>"
      },
      {
        id: 'ch09-q6', ch: 'ch09', type: 'mcq', difficulty: 2,
        kp: '9.1 Complex Numbers', tags: ['concept', 'trap'],
        stem: '设 $z,z_1,z_2$ 为非零复数，下列等式一定成立的是？',
        options: [
          { text: '$\\overline{z_1z_2}=\\bar z_1\\bar z_2$', correct: true },
          { text: '$|z_1+z_2|=|z_1|+|z_2|$', correct: false },
          { text: '$z\\bar z=|z|$', correct: false },
          { text: '$z^{-1}=\\bar z$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。共轭对乘法可分配：设 $z_1=a+bi$、$z_2=c+di$，则 $\\overline{z_1z_2}=(ac-bd)-(ad+bc)i=\\bar z_1\\bar z_2$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。一般只有三角不等式 $|z_1+z_2|\\le|z_1|+|z_2|$；取 $z_1=1$、$z_2=i$ 得左边 $\\sqrt{2}$、右边 2，等号不成立。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$z\\bar z=a^2+b^2=|z|^2$，得到的是模的平方，不是模本身。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$z^{-1}=\\frac{\\bar z}{z\\bar z}=\\frac{\\bar z}{|z|^2}$，只有 $|z|=1$ 时才等于 $\\bar z$。</span></div>"
      },
      {
        id: 'ch09-q7', ch: 'ch09', type: 'mcq', difficulty: 2,
        kp: '9.1 Complex Numbers', tags: ['concept'],
        stem: '设 $z=\\sqrt{3}+i$。它的极坐标形式 $z=re^{i\\theta}$（要求 $r\\gt0$，$0\\le\\theta\\lt2\\pi$）是？',
        options: [
          { text: '$2e^{i\\pi/6}$', correct: true },
          { text: '$2e^{i\\pi/3}$', correct: false },
          { text: '$4e^{i\\pi/6}$', correct: false },
          { text: '$e^{i\\pi/6}$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$r=\\sqrt{3+1}=2$，$\\tan\\theta=\\frac{1}{\\sqrt{3}}$ 且点在第一象限，故 $\\theta=\\frac{\\pi}{6}$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。把 $\\arg(1+\\sqrt{3}i)=\\frac{\\pi}{3}$ 与本题混淆；这里实部是 $\\sqrt{3}$、虚部是 1，角度是 $\\frac{\\pi}{6}$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。模算成 $3+1=4$，忘记开平方，模应是 $\\sqrt{4}=2$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。漏掉模因子，$e^{i\\pi/6}$ 的模是 1 而不是 2。</span></div>"
      },
      {
        id: 'ch09-q8', ch: 'ch09', type: 'mcq', difficulty: 1,
        kp: '9.2 Hermitian and Unitary Matrices', tags: ['concept'],
        stem: '下列矩阵中满足 $A^{\\mathsf H}=A$（即 Hermite 矩阵）的是？',
        options: [
          { text: '$\\begin{bmatrix}2&1+i\\\\1+i&3\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}0&1+i\\\\1-i&i\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}2&1+i\\\\1-i&3\\end{bmatrix}$', correct: true },
          { text: '$\\begin{bmatrix}2&1+i\\\\1-i&3i\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。两个非对角元都写成 $1+i$，转置共轭后 $(1,2)$ 元应为 $1-i$；它只是对称，不是 Hermite。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。对角元 $i$ 不是实数，Hermite 矩阵的对角元必须全为实数。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。转置并取共轭会把两个非对角元互换再共轭：$\\overline{1-i}=1+i$，对角元 $2,3$ 是实数，故 $A^{\\mathsf H}=A$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。对角元 $3i$ 非实，$A^{\\mathsf H}$ 的 $(2,2)$ 元是 $-3i$，与原矩阵不相等。</span></div>"
      },
      {
        id: 'ch09-q9', ch: 'ch09', type: 'mcq', difficulty: 1,
        kp: '9.2 Hermitian and Unitary Matrices', tags: ['compute'],
        stem: 'Hermite 矩阵 $A=\\begin{bmatrix}0&i\\\\-i&0\\end{bmatrix}$ 的两个特征值是？',
        options: [
          { text: '$\\pm1$', correct: true },
          { text: '$\\pm i$', correct: false },
          { text: '$0$', correct: false },
          { text: '$1$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$\\det(A-\\lambda I)=\\begin{vmatrix}-\\lambda&i\\\\-i&-\\lambda\\end{vmatrix}=\\lambda^2-(-i)(i)=\\lambda^2-1$，故 $\\lambda=\\pm1$，符合 Hermite 矩阵特征值为实数的结论。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。把展开式写成 $\\lambda^2+i\\cdot(-i)=\\lambda^2+1$，符号弄反；正确应为 $\\lambda^2-(i)(-i)=\\lambda^2-1$，得到实特征值 $\\pm1$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。只看对角元全为 0 就断定特征值为 0，忽略了非对角元的贡献。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\lambda^2=1$ 有两个根；迹为 0 也说明两根互为相反数，只写 1 漏了 $-1$。</span></div>"
      },
      {
        id: 'ch09-q10', ch: 'ch09', type: 'mcq', difficulty: 1,
        kp: '9.2 Hermitian and Unitary Matrices', tags: ['compute'],
        stem: '设 $U=\\frac{1}{\\sqrt{2}}\\begin{bmatrix}1&1\\\\i&-i\\end{bmatrix}$，则 $U^{\\mathsf H}U=$？',
        options: [
          { text: '$2I$', correct: false },
          { text: '$I$', correct: true },
          { text: '$\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。归一化因子要相乘两次，$\\frac{1}{\\sqrt{2}}\\cdot\\frac{1}{\\sqrt{2}}=\\frac{1}{2}$，算成 $2I$ 是把因子倒过来了。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$U^{\\mathsf H}=\\frac{1}{\\sqrt{2}}\\begin{bmatrix}1&-i\\\\1&i\\end{bmatrix}$，相乘得 $\\frac{1}{2}\\begin{bmatrix}1+1&1-1\\\\1-1&1+1\\end{bmatrix}=I$，故 $U$ 是酉矩阵。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。非对角元是两列的内积 $\\mathbf{u}_1^{\\mathsf H}\\mathbf{u}_2=\\frac{1}{2}(1-1)=0$；若为 1 说明两列不正交。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。对角元是各列长度的平方，两列长度都是 1，所以两个对角元都是 1，不是 1 与 $-1$。</span></div>"
      },
      {
        id: 'ch09-q11', ch: 'ch09', type: 'mcq', difficulty: 2,
        kp: '9.2 Hermitian and Unitary Matrices', tags: ['concept'],
        stem: '设 $U$ 是 $n\\times n$ 酉矩阵。下列命题中一定成立的是？',
        options: [
          { text: '$U$ 的特征值都是实数', correct: false },
          { text: '$U^{\\mathsf H}=U^{-1}$', correct: true },
          { text: '$U$ 一定是 Hermite 矩阵', correct: false },
          { text: '$\\det U=1$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。酉矩阵的特征值满足 $|\\lambda|=1$，可以是复数，例如 $\\begin{bmatrix}0&i\\\\i&0\\end{bmatrix}$ 的特征值是 $\\pm i$。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。酉矩阵定义为 $U^{\\mathsf H}U=I$，两边右乘 $U^{-1}$ 得 $U^{\\mathsf H}=U^{-1}$，即共轭转置就是逆。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。Hermite 要求 $U^{\\mathsf H}=U$，酉只要求 $U^{\\mathsf H}=U^{-1}$，两者只在实对称正交阵时才重合。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。只能推出 $|\\det U|=1$，$\\det U$ 可以是 $i$，如 $\\begin{bmatrix}i&0\\\\0&1\\end{bmatrix}$。</span></div>"
      },
      {
        id: 'ch09-q12', ch: 'ch09', type: 'mcq', difficulty: 3,
        kp: '9.2 Hermitian and Unitary Matrices', tags: ['concept', 'trap'],
        stem: '设 $A$ 是 $n$ 阶 Hermite 矩阵。下列结论中一定成立的是？',
        options: [
          { text: '$A$ 一定可逆', correct: false },
          { text: '$A$ 的特征值都是实数，且属于不同特征值的特征向量互相正交', correct: true },
          { text: '$A$ 一定能写成 $Q\\Lambda Q^{\\mathsf T}$，其中 $Q$ 是实正交矩阵', correct: false },
          { text: '$A$ 的特征值都非负', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。Hermite 只保证特征值为实，不保证非零；$\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$ 的特征值为 $2,0$，是奇异的。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$\\mathbf{x}^{\\mathsf H}A\\mathbf{x}$ 等于自身共轭故为实数，由此可证 $\\lambda$ 为实；若 $A\\mathbf{x}=\\lambda\\mathbf{x}$、$A\\mathbf{y}=\\mu\\mathbf{y}$ 且 $\\lambda\\neq\\mu$，则 $(\\lambda-\\mu)\\mathbf{x}^{\\mathsf H}\\mathbf{y}=0$，故 $\\mathbf{x}\\perp\\mathbf{y}$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$A$ 的元素可以含复数，一般只能酉对角化 $A=U\\Lambda U^{\\mathsf H}$，不能保证 $U$ 是实正交阵。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。非负还需要半正定条件；$\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$ 是 Hermite 却有特征值 $-1$。</span></div>"
      },
      {
        id: 'ch09-q13', ch: 'ch09', type: 'mcq', difficulty: 3,
        kp: '9.2 Hermitian and Unitary Matrices', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}2&1+i\\\\1-i&3\\end{bmatrix}$，$\\mathbf{x}=(1,i)$，则 $\\mathbf{x}^{\\mathsf H}A\\mathbf{x}=$？',
        options: [
          { text: '$3$', correct: true },
          { text: '$-1+2i$', correct: false },
          { text: '$1+2i$', correct: false },
          { text: '$1+i$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$A\\mathbf{x}=\\begin{bmatrix}2+(1+i)i\\\\ (1-i)+3i\\end{bmatrix}=\\begin{bmatrix}1+i\\\\1+2i\\end{bmatrix}$，再与 $\\mathbf{x}^{\\mathsf H}=(1,-i)$ 相乘得 $(1+i)+(-i)(1+2i)=3$，是实数。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。用 $\\mathbf{x}^{\\mathsf T}$ 而没取共轭：$(1,i)\\begin{bmatrix}1+i\\\\1+2i\\end{bmatrix}=1+i+i-2=-1+2i$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。只算了 $A\\mathbf{x}$ 的第二个分量 $(1-i)+3i=1+2i$，没有完成与 $(1,-i)$ 的内积。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。只算了 $A\\mathbf{x}$ 的第一个分量 $2+(1+i)i=1+i$，漏掉了第二项。</span></div>"
      },
      {
        id: 'ch09-q14', ch: 'ch09', type: 'mcq', difficulty: 3,
        kp: '9.2 Hermitian and Unitary Matrices', tags: ['proof'],
        stem: '要证明 Hermite 矩阵 $A$ 的特征值都是实数，设 $A\\mathbf{x}=\\lambda\\mathbf{x}$ 且 $\\mathbf{x}\\neq\\mathbf{0}$。下列论证中正确的是？',
        options: [
          { text: '$A$ 可逆，故 $\\lambda\\neq0$，因此 $\\lambda$ 是实数', correct: false },
          { text: '$\\det(A-\\lambda I)=0$ 是实系数方程，其实根都是实数', correct: false },
          { text: '因为 $A$ 的元素都是实数，所以特征值都是实数', correct: false },
          { text: '左乘 $\\mathbf{x}^{\\mathsf H}$ 得 $\\mathbf{x}^{\\mathsf H}A\\mathbf{x}=\\lambda\\mathbf{x}^{\\mathsf H}\\mathbf{x}$，左边是实数且 $\\mathbf{x}^{\\mathsf H}\\mathbf{x}\\gt0$，故 $\\lambda$ 是实数', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。Hermite 矩阵不必可逆，$\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$ 就奇异；而且可逆性与 $\\lambda$ 是否为实数无关。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。实系数方程可以有复根，例如 $\\lambda^2+1=0$，还要额外论证根落在实轴上。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。实矩阵的特征值未必是实数，$\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}$ 的特征值就是 $\\pm i$。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$(\\mathbf{x}^{\\mathsf H}A\\mathbf{x})^{\\mathsf H}=\\mathbf{x}^{\\mathsf H}A^{\\mathsf H}\\mathbf{x}=\\mathbf{x}^{\\mathsf H}A\\mathbf{x}$，说明它等于自身共轭、是实数；分母 $\\mathbf{x}^{\\mathsf H}\\mathbf{x}=\\lVert\\mathbf{x}\\rVert^2\\gt0$，故 $\\lambda$ 为实数。</span></div>"
      },
      {
        id: 'ch09-q15', ch: 'ch09', type: 'mcq', difficulty: 1,
        kp: '9.3 The Fast Fourier Transform', tags: ['compute'],
        stem: '取 $\\omega=e^{2\\pi i/4}=i$，DFT 矩阵 $F_4$ 的第 2 行（即 $j=1$，元素为 $\\omega^{jk}$，$k=0,1,2,3$）是？',
        options: [
          { text: '$(1,-1,1,-1)$', correct: false },
          { text: '$(1,i,-1,-i)$', correct: true },
          { text: '$(1,-i,-1,i)$', correct: false },
          { text: '$(1,1,1,1)$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。这是 $j=2$ 的行，$i^{2k}=(-1)^k$，对应频率 2 而不是 1。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$F_4$ 的 $(j,k)$ 元是 $\\omega^{jk}=i^{jk}$；固定 $j=1$ 依次得 $i^0,i^1,i^2,i^3=(1,i,-1,-i)$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。这是用 $\\omega^{-1}=-i$ 的幂得到的行，属于逆 DFT 矩阵而不是 $F_4$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。这是 $j=0$ 的行，全为 1，对应零频率。</span></div>"
      },
      {
        id: 'ch09-q16', ch: 'ch09', type: 'mcq', difficulty: 1,
        kp: '9.3 The Fast Fourier Transform', tags: ['compute'],
        stem: '取 $\\omega=e^{2\\pi i/4}=i$，则和 $\\sum_{k=0}^{3}\\omega^{k}$ 等于？',
        options: [
          { text: '$4$', correct: false },
          { text: '$1$', correct: false },
          { text: '$0$', correct: true },
          { text: '$1+i$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。把四项的模 1 相加得 4，但它们是四个不同方向的单位向量，代数和为 0。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。只取了 $k=0$ 的一项 $\\omega^0=1$，漏掉其余三项。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$1+i+(-1)+(-i)=0$；一般地 $\\omega\\neq1$ 时 $\\sum_{k=0}^{n-1}\\omega^{k}=\\frac{1-\\omega^{n}}{1-\\omega}=0$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$1+i$ 只是前两项的部分和，后两项 $-1$ 与 $-i$ 把它抵消掉了。</span></div>"
      },
      {
        id: 'ch09-q17', ch: 'ch09', type: 'mcq', difficulty: 2,
        kp: '9.3 The Fast Fourier Transform', tags: ['compute'],
        stem: '设 $\\mathbf{x}=(1,0,1,0)$，记 $\\mathbf{y}=F_4\\mathbf{x}$，即 $y_j=\\sum_{k=0}^{3}x_k i^{jk}$。则 $\\mathbf{y}=$？',
        options: [
          { text: '$(2,0,2,0)$', correct: true },
          { text: '$(2,2,2,2)$', correct: false },
          { text: '$(0,2,0,2)$', correct: false },
          { text: '$(4,0,0,0)$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$y_j=1\\cdot i^{0}+1\\cdot i^{2j}=1+(-1)^j$，$j$ 为偶数得 2、为奇数得 0，即 $(2,0,2,0)$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。把每个 $y_j$ 都算成 $\\sum x_k=2$，忽略了因子 $i^{jk}$ 随 $j$ 变化。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。奇偶性弄反了，$j=0$ 时 $y_0=1+1=2$，不可能是 0。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。这是 $\\mathbf{x}=(1,1,1,1)$ 的 DFT（四个 1 同相叠加得 4），本题只有两个 1。</span></div>"
      },
      {
        id: 'ch09-q18', ch: 'ch09', type: 'mcq', difficulty: 2,
        kp: '9.3 The Fast Fourier Transform', tags: ['concept'],
        stem: '关于快速傅里叶变换（FFT），下列说法正确的是？',
        options: [
          { text: 'FFT 要求 $n$ 必须是素数', correct: false },
          { text: 'FFT 只对实向量有定义', correct: false },
          { text: 'FFT 把 $n$ 点 DFT 的乘法次数从 $O(n^2)$ 降到 $O(n\\log n)$，做法是按下标奇偶把问题拆成两个 $n/2$ 点 DFT', correct: true },
          { text: 'FFT 可以直接求出任意矩阵的特征值', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。FFT 需要 $n$ 可以折半（常用 $n=2^m$），$n$ 为素数时反而没有这种拆分结构。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。DFT 对复向量同样有定义，FFT 照常计算，实向量只是特例。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。把偶数下标与奇数下标分开求和，各得到一个 $n/2$ 点 DFT，再乘旋转因子 $\\omega^{j}$ 合并，递归后乘加量约为 $n\\log_2 n$，而直接算是 $n^2$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。FFT 只加速 DFT 矩阵与向量的乘法，与一般矩阵的特征值无关。</span></div>"
      },
      {
        id: 'ch09-q19', ch: 'ch09', type: 'mcq', difficulty: 2,
        kp: '9.3 The Fast Fourier Transform', tags: ['concept'],
        stem: '设 $\\omega=e^{2\\pi i/n}$，$\\mathbf{f}_j=(1,\\omega^{j},\\omega^{2j},\\dots,\\omega^{(n-1)j})^{\\mathsf T}$ 是 $F_n$ 的第 $j$ 列。则 $\\mathbf{f}_j^{\\mathsf H}\\mathbf{f}_\\ell$ 等于（$\\delta_{j\\ell}$ 为 Kronecker 符号）？',
        options: [
          { text: '$\\delta_{j\\ell}$', correct: false },
          { text: '$0$', correct: false },
          { text: '$\\omega^{j\\ell}$', correct: false },
          { text: '$n\\delta_{j\\ell}$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。漏掉 $j=\\ell$ 时每项为 1、共 $n$ 项的因子 $n$，把正交列当成了单位向量。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。只有 $j\\neq\\ell$ 时才为 0，$j=\\ell$ 时内积是 $n$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。把列指标写成了内积结果；$\\omega^{j\\ell}$ 是矩阵元素，不是两列的内积。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$\\mathbf{f}_j^{\\mathsf H}\\mathbf{f}_\\ell=\\sum_{k=0}^{n-1}\\omega^{(\\ell-j)k}$，$j=\\ell$ 时每项为 1、和为 $n$；$j\\neq\\ell$ 时是公比 $\\omega^{\\ell-j}\\neq1$ 的等比级数，和为 0。</span></div>"
      },
      {
        id: 'ch09-q20', ch: 'ch09', type: 'mcq', difficulty: 3,
        kp: '9.3 The Fast Fourier Transform', tags: ['concept'],
        stem: '设 $P$ 是 $4\\times4$ 循环置换矩阵，$P\\mathbf{x}$ 把 $(x_1,x_2,x_3,x_4)^{\\mathsf T}$ 变为 $(x_2,x_3,x_4,x_1)^{\\mathsf T}$。则 $P$ 的特征值是？',
        options: [
          { text: '$1,1,1,1$', correct: false },
          { text: '$1,-1,1,-1$', correct: false },
          { text: '$1,i,-1,-i$', correct: true },
          { text: '$1,0,0,0$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$P$ 是置换矩阵，可对角化；若四个特征值全为 $1$，则 $P$ 相似于 $I$，从而 $P=I$，与 $P\\ne I$ 矛盾。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。这是 $P^2$（向量移动两位）的特征值；$P$ 的特征值还包括 $\\pm i$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。特征向量形如 $(1,\\lambda,\\lambda^2,\\lambda^3)^{\\mathsf T}$，代入 $P\\mathbf{x}=\\lambda\\mathbf{x}$ 得 $\\lambda^4=1$，故特征值为 $1,i,-1,-i$，正是 $F_4$ 中的四个 $\\omega^{k}$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$P$ 可逆（$P^4=I$），特征值全不为 0，且 $\\det P=-1$。</span></div>"
      },
      /* ---------------- ch10 · Applications（20 题） ---------------- */
      {
        id: 'ch10-q1', ch: 'ch10', type: 'mcq', difficulty: 1,
        kp: '10.1 Graphs and Networks', tags: ['concept'],
        stem: '设图有 3 个节点、2 条边：边 $e_1$ 从节点 1 指向节点 2，边 $e_2$ 从节点 2 指向节点 3。关联矩阵 $B$ 的每一行对应一条边，起点列写 $-1$、终点列写 $+1$。则 $e_1$ 对应的行是？',
        options: [
          { text: '$(-1,1,0)$', correct: true },
          { text: '$(1,-1,0)$', correct: false },
          { text: '$(-1,0,1)$', correct: false },
          { text: '$(0,-1,1)$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。边 $e_1$ 从节点 1 到节点 2，故第 1 列为 $-1$、第 2 列为 $+1$、第 3 列为 0，即 $(-1,1,0)$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$(1,-1,0)$ 表示边从节点 2 指向节点 1，方向写反了。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。把终点写成了节点 3；$e_1$ 只连接节点 1 与节点 2。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$(0,-1,1)$ 是从节点 2 到节点 3 的那条边的行。</span></div>"
      },
      {
        id: 'ch10-q2', ch: 'ch10', type: 'mcq', difficulty: 1,
        kp: '10.1 Graphs and Networks', tags: ['compute'],
        stem: '设图有 3 个节点、2 条边，边 $e_1$ 从节点 1 到节点 2，边 $e_2$ 从节点 2 到节点 3，关联矩阵 $B=\\begin{bmatrix}-1&1&0\\\\0&-1&1\\end{bmatrix}$。则 $L=B^{\\mathsf T}B$ 的 $(2,2)$ 元素是？',
        options: [
          { text: '$1$', correct: false },
          { text: '$2$', correct: true },
          { text: '$-1$', correct: false },
          { text: '$3$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。1 是节点 1 或节点 3 的度，它们各自只连着一条边。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$L$ 的对角元是节点度数：节点 2 同时连接 $e_1$ 与 $e_2$，度为 2；也可由 $B$ 第 2 列的平方和 $1^2+(-1)^2=2$ 得到。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$-1$ 是 $L$ 的非对角元（表示两点相邻），对角元是度数，非负。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。3 是节点总数（即矩阵阶数），不是节点 2 的度。</span></div>"
      },
      {
        id: 'ch10-q3', ch: 'ch10', type: 'mcq', difficulty: 2,
        kp: '10.1 Graphs and Networks', tags: ['proof', 'concept'],
        stem: '设连通图有 $n$ 个节点，$B$ 是其 $m\\times n$ 关联矩阵（每行一条边，起点 $-1$、终点 $+1$），$L=B^{\\mathsf T}B$。要证明 $\\dim N(L)=1$，下列论证正确的是？',
        options: [
          { text: '因为 $L$ 是对称矩阵，所以零空间维数为 1', correct: false },
          { text: '因为 $\\det L=0$，所以零空间维数为 1', correct: false },
          { text: '$L\\mathbf{x}=\\mathbf{0}$ 推出 $\\mathbf{x}^{\\mathsf T}L\\mathbf{x}=\\lVert B\\mathbf{x}\\rVert^2=0$，故 $B\\mathbf{x}=\\mathbf{0}$，即每条边两端电位相等；图连通时各分量全等，得 $\\mathbf{x}=c\\mathbf{1}$', correct: true },
          { text: '因为 $L$ 的行和为 0，所以 $N(L)$ 的维数等于节点数 $n$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。对称只说明 $L$ 可正交对角化，并不能确定零空间的维数；对称矩阵的零空间可以是任意维数。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$\\det L=0$ 只说明有零特征值，重数可以是 1 也可以是 $n-1$（如完全不连通的图），必须用连通性定维数。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$L$ 半正定，$\\mathbf{x}^{\\mathsf T}L\\mathbf{x}=\\lVert B\\mathbf{x}\\rVert^2$ 为零当且仅当 $B\\mathbf{x}=\\mathbf{0}$；$B\\mathbf{x}$ 的分量是各边两端的电位差，全零且连通时所有节点电位相同，故 $N(L)$ 由 $\\mathbf{1}$ 张成。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。行和为 0 只给出 $\\mathbf{1}\\in N(L)$，说明维数至少 1；$L$ 的秩是 $n-1$，零空间维数为 1 而不是 $n$。</span></div>"
      },
      {
        id: 'ch10-q4', ch: 'ch10', type: 'mcq', difficulty: 2,
        kp: '10.2 Matrices in Engineering', tags: ['concept'],
        stem: '某弹簧系统的刚度矩阵为 $K=\\begin{bmatrix}2&-1\\\\-1&2\\end{bmatrix}$（各弹簧刚度均为 1）。下列判断正确的是？',
        options: [
          { text: '$K$ 正定，因为 $2\\gt0$ 且 $\\det K=3\\gt0$', correct: true },
          { text: '$K$ 不正定，因为非对角元为负', correct: false },
          { text: '$K$ 正定，因为 $\\det K\\neq0$', correct: false },
          { text: '$K$ 只是半正定，因为行和为 1', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。对称矩阵正定的顺序主子式判据：一阶主子式 $2\\gt0$，二阶 $\\det K=4-1=3\\gt0$，故 $K$ 正定，弹簧系统有唯一平衡位置。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。非对角元为负是弹簧耦合的正常形式，正定性看的是主子式与 $\\mathbf{x}^{\\mathsf T}K\\mathbf{x}\\gt0$，不是非对角元的符号。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\det K\\neq0$ 只说明可逆；负定矩阵的行列式也可能非零，必须所有顺序主子式为正。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。行和 $2-1=1$ 与正定性无关；实际上 $\\mathbf{1}^{\\mathsf T}K\\mathbf{1}=2\\gt0$，$K$ 是正定的。</span></div>"
      },
      {
        id: 'ch10-q5', ch: 'ch10', type: 'mcq', difficulty: 2,
        kp: '10.2 Matrices in Engineering', tags: ['compute'],
        stem: '刚度矩阵 $K=\\begin{bmatrix}2&-1\\\\-1&2\\end{bmatrix}$，外力 $\\mathbf{f}=(1,0)$。解 $K\\mathbf{x}=\\mathbf{f}$，得位移 $\\mathbf{x}=$？',
        options: [
          { text: '$(1,1)$', correct: false },
          { text: '$(\\frac{1}{3},\\frac{2}{3})$', correct: false },
          { text: '$(\\frac{2}{3},\\frac{1}{3})$', correct: true },
          { text: '$(2,1)$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$(1,1)$ 满足第一个方程 $2-1=1$，但第二个方程 $-1+2=1\\neq0$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。两个分量解反了，代回第一式得 $2\\cdot\\frac{1}{3}-\\frac{2}{3}=0\\neq1$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。由 $-x_1+2x_2=0$ 得 $x_1=2x_2$，代入 $2x_1-x_2=1$ 得 $3x_2=1$，故 $x_2=\\frac{1}{3}$、$x_1=\\frac{2}{3}$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$(2,1)$ 代回得 $4-1=3\\neq1$，是把 $x_1=2x_2$ 直接当成答案、漏掉除以 3 的结果。</span></div>"
      },
      {
        id: 'ch10-q6', ch: 'ch10', type: 'mcq', difficulty: 3,
        kp: '10.2 Matrices in Engineering', tags: ['concept', 'trap'],
        stem: '三个质量块由两根弹簧串成一条链，两端都不固定，$K$ 是 $3\\times3$ 刚度矩阵。关于 $K$，下列结论正确的是？',
        options: [
          { text: '$K$ 正定', correct: false },
          { text: '$K$ 奇异，因为整体平移满足 $K\\mathbf{1}=\\mathbf{0}$', correct: true },
          { text: '$K$ 可逆且特征值全为正', correct: false },
          { text: '$K$ 的秩为 3', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。正定要求所有 $\\mathbf{x}\\neq\\mathbf{0}$ 都有 $\\mathbf{x}^{\\mathsf T}K\\mathbf{x}\\gt0$，但 $\\mathbf{1}^{\\mathsf T}K\\mathbf{1}=0$，故最多只能半正定。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。两端自由时整体平移不改变任何弹簧的伸长量，故 $K\\mathbf{1}=\\mathbf{0}$，即 $\\mathbf{1}\\in N(K)$，$K$ 奇异；固定端点之后 $K$ 才正定。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$K$ 有零特征值，不可逆，特征值不可能全为正。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。链连通且有一个刚体平移模态，秩为 $n-1=2$，不是 3。</span></div>"
      },
      {
        id: 'ch10-q7', ch: 'ch10', type: 'mcq', difficulty: 1,
        kp: '10.3 Markov Matrices, Population, and Economics', tags: ['concept'],
        stem: '下列矩阵中是 Markov 矩阵（元素非负且每列和为 1）的是？',
        options: [
          { text: '$\\begin{bmatrix}0.2&0.6\\\\0.8&0.4\\end{bmatrix}$', correct: true },
          { text: '$\\begin{bmatrix}0.5&0.5\\\\0.5&0.4\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}0.2&0.6\\\\0.8&0.6\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}-0.2&0.6\\\\1.2&0.4\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。元素非负，且两列和分别为 $0.2+0.8=1$ 与 $0.6+0.4=1$，满足列随机矩阵的定义。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。第二列和 $0.5+0.4=0.9\\neq1$，概率不守恒。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。第二列和 $0.6+0.6=1.2\\neq1$，超出的部分没有去处。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。出现负元素 $-0.2$，概率不能为负。</span></div>"
      },
      {
        id: 'ch10-q8', ch: 'ch10', type: 'mcq', difficulty: 1,
        kp: '10.3 Markov Matrices, Population, and Economics', tags: ['compute'],
        stem: 'Markov 矩阵 $P=\\begin{bmatrix}0.8&0.3\\\\0.2&0.7\\end{bmatrix}$ 的稳态向量 $\\mathbf{x}$（满足 $P\\mathbf{x}=\\mathbf{x}$ 且分量和为 1）是？',
        options: [
          { text: '$(0.5,0.5)$', correct: false },
          { text: '$(0.6,0.4)$', correct: true },
          { text: '$(0.4,0.6)$', correct: false },
          { text: '$(0.8,0.2)$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$P(0.5,0.5)^{\\mathsf T}=(0.55,0.45)^{\\mathsf T}\\neq(0.5,0.5)^{\\mathsf T}$，只有两列相同时它才是稳态。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。由 $P\\mathbf{x}=\\mathbf{x}$ 得 $0.2x_1=0.3x_2$，即 $x_2=\\frac{2}{3}x_1$；结合 $x_1+x_2=1$ 得 $(0.6,0.4)$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。分量顺序颠倒，$P(0.4,0.6)^{\\mathsf T}=(0.5,0.5)^{\\mathsf T}\\neq(0.4,0.6)^{\\mathsf T}$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$(0.8,0.2)$ 是第一列，$P(0.8,0.2)^{\\mathsf T}=(0.7,0.3)^{\\mathsf T}$，不是不动点。</span></div>"
      },
      {
        id: 'ch10-q9', ch: 'ch10', type: 'mcq', difficulty: 2,
        kp: '10.3 Markov Matrices, Population, and Economics', tags: ['concept', 'trap'],
        stem: '设 $P$ 是 $n$ 阶 Markov 矩阵（元素非负、每列和为 1）。下列结论中一定成立的是？',
        options: [
          { text: '$P$ 的特征值都是实数', correct: false },
          { text: '$P$ 一定可逆', correct: false },
          { text: '$P$ 一定可对角化', correct: false },
          { text: '$1$ 是 $P$ 的特征值', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。Markov 矩阵可以有复特征值，如循环置换 $\\begin{bmatrix}0&1&0\\\\0&0&1\\\\1&0&0\\end{bmatrix}$ 的特征值含 $e^{\\pm2\\pi i/3}$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$P$ 可能奇异，例如 $\\begin{bmatrix}0.5&0.5\\\\0.5&0.5\\end{bmatrix}$ 的秩为 1。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\begin{bmatrix}1&1&0\\\\0&0&1\\\\0&0&0\\end{bmatrix}$ 是 Markov 矩阵，但特征值 0 的几何重数为 1、代数重数为 2，不可对角化。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。列和为 1 即 $\\mathbf{1}^{\\mathsf T}P=\\mathbf{1}^{\\mathsf T}$，转置得 $P^{\\mathsf T}\\mathbf{1}=\\mathbf{1}$；$P$ 与 $P^{\\mathsf T}$ 特征值相同，故 $\\lambda=1$ 必是 $P$ 的特征值。</span></div>"
      },
      {
        id: 'ch10-q10', ch: 'ch10', type: 'mcq', difficulty: 2,
        kp: '10.3 Markov Matrices, Population, and Economics', tags: ['compute'],
        stem: '某城市与农村每年人口迁移：城市人口的 $10\\%$ 迁往农村，农村人口的 $20\\%$ 迁往城市。对应 Markov 矩阵 $P=\\begin{bmatrix}0.9&0.2\\\\0.1&0.8\\end{bmatrix}$（第一分量城市，第二分量农村）。长期稳态中城市人口占总人口的比例是？',
        options: [
          { text: '$\\frac{1}{3}$', correct: false },
          { text: '$\\frac{2}{3}$', correct: true },
          { text: '$0.9$', correct: false },
          { text: '$0.8$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$\\frac{1}{3}$ 是农村的比例，方向弄反了；$(\\frac{1}{3},\\frac{2}{3})$ 不满足 $P\\mathbf{x}=\\mathbf{x}$。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。稳态满足 $0.1x_1=0.2x_2$，即 $x_1=2x_2$；结合 $x_1+x_2=1$ 得城市 $\\frac{2}{3}$、农村 $\\frac{1}{3}$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$0.9$ 是城市留在城市的比例（第一列第一个元素），不是稳态份额。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$0.8$ 是农村留在农村的比例（第二列第二个元素），与稳态无关。</span></div>"
      },
      {
        id: 'ch10-q11', ch: 'ch10', type: 'mcq', difficulty: 1,
        kp: '10.4 Linear Programming', tags: ['concept'],
        stem: '线性规划 $\\min\\,\\mathbf{c}^{\\mathsf T}\\mathbf{x}$，约束 $A\\mathbf{x}=\\mathbf{b}$、$\\mathbf{x}\\ge\\mathbf{0}$，其中 $A$ 是 $m\\times n$、$m\\lt n$ 且行满秩。若最优解存在，它一定可以取在？',
        options: [
          { text: '可行域的内部点', correct: false },
          { text: '原点 $\\mathbf{x}=\\mathbf{0}$', correct: false },
          { text: '可行域的一个顶点，即可行解中非零分量对应的列线性无关', correct: true },
          { text: '无穷远处，因为问题一定无界', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。线性目标的梯度是常向量 $\\mathbf{c}$，在可行域内部没有驻点，最优值只能出现在边界上。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。原点只有在 $\\mathbf{b}=\\mathbf{0}$ 时才可行，一般不是可行解。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。线性函数在凸多面体上的最小值在顶点取到；顶点是基本可行解，把 $n-m$ 个变量取 0 后剩下的 $m$ 列线性无关。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。可行域有界时目标必有有限最优值；只有可行域无界且目标沿某方向无限下降时才无界。</span></div>"
      },
      {
        id: 'ch10-q12', ch: 'ch10', type: 'mcq', difficulty: 3,
        kp: '10.4 Linear Programming', tags: ['compute'],
        stem: '在约束 $x_1+2x_2\\le4$、$3x_1+x_2\\le6$、$x_1\\ge0$、$x_2\\ge0$ 下，目标函数 $x_1+x_2$ 的最大值是？',
        options: [
          { text: '$4$', correct: false },
          { text: '$3$', correct: false },
          { text: '$2$', correct: false },
          { text: '$\\frac{14}{5}$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$4$ 只是第一条约束的右端常数：由 $x_1+2x_2\\le4$ 不能推出 $x_1+x_2\\le4$，而且直线 $x_1+x_2=4$ 与可行域没有交点。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。3 来自 $(2,1)$，但 $3\\cdot2+1=7\\gt6$，该点不可行。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。2 是顶点 $(2,0)$ 与 $(0,2)$ 处的值，还不是最大。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。两约束的交点满足 $x_1+2x_2=4$、$3x_1+x_2=6$，解得 $(1.6,1.2)$，目标为 $2.8=\\frac{14}{5}$，比顶点 $(2,0)$、$(0,2)$ 处的 2 都大。</span></div>"
      },
      {
        id: 'ch10-q13', ch: 'ch10', type: 'mcq', difficulty: 1,
        kp: '10.5 Fourier Series: Linear Algebra for Functions', tags: ['concept'],
        stem: '在 $[-\\pi,\\pi]$ 上，函数族 $1,\\cos x,\\sin x,\\cos 2x,\\sin 2x,\\dots$ 两两正交。设 $f=a_0+\\sum_{k\\ge1}(a_k\\cos kx+b_k\\sin kx)$，则系数 $a_k$ 等于？',
        options: [
          { text: '$f$ 在 $\\cos kx$ 方向上的投影系数 $\\frac{\\langle f,\\cos kx\\rangle}{\\langle\\cos kx,\\cos kx\\rangle}$', correct: true },
          { text: '$f$ 与 $\\cos kx$ 的内积 $\\langle f,\\cos kx\\rangle$', correct: false },
          { text: '$f$ 的导数在 $\\cos kx$ 上的投影', correct: false },
          { text: '$f$ 的长度 $\\lVert f\\rVert$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。正交基下的坐标就是投影：$a_k=\\frac{\\langle f,\\cos kx\\rangle}{\\langle\\cos kx,\\cos kx\\rangle}$，其中 $\\langle\\cos kx,\\cos kx\\rangle=\\pi$（$k\\ge1$）。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。内积会随 $f$ 整体放大而一起放大，还要除以基函数的平方长度 $\\pi$ 才是坐标。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。傅里叶系数来自 $f$ 本身与基函数的内积，与求导无关。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\lVert f\\rVert$ 是 $f$ 的总长度，不区分是哪个频率方向上的分量。</span></div>"
      },
      {
        id: 'ch10-q14', ch: 'ch10', type: 'mcq', difficulty: 2,
        kp: '10.5 Fourier Series: Linear Algebra for Functions', tags: ['compute'],
        stem: '在 $[-\\pi,\\pi]$ 上，内积 $\\langle\\cos x,\\cos 2x\\rangle=\\int_{-\\pi}^{\\pi}\\cos x\\cos 2x\\,dx$ 等于？',
        options: [
          { text: '$\\pi$', correct: false },
          { text: '$0$', correct: true },
          { text: '$2\\pi$', correct: false },
          { text: '$\\frac{\\pi}{2}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$\\pi$ 是 $\\langle\\cos kx,\\cos kx\\rangle$ 的值（$k\\ge1$），不是不同频率之间的内积。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。积化和差 $\\cos x\\cos 2x=\\frac{1}{2}(\\cos 3x+\\cos x)$，两个余弦在整周期上的积分都是 0，故内积为 0，这正是不同频率正交。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$2\\pi$ 是 $\\langle1,1\\rangle$ 的值，常数函数的平方长度才是 $2\\pi$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\frac{\\pi}{2}$ 是漏掉积化和差的系数、或只积了半个周期得到的结果。</span></div>"
      },
      {
        id: 'ch10-q15', ch: 'ch10', type: 'mcq', difficulty: 2,
        kp: '10.5 Fourier Series: Linear Algebra for Functions', tags: ['concept'],
        stem: '设 $f(x)=1+\\cos x$，$x\\in[-\\pi,\\pi]$，按 $f=a_0+\\sum_{k\\ge1}(a_k\\cos kx+b_k\\sin kx)$ 展开。则 $(a_0,a_1)=$？',
        options: [
          { text: '$(1,0)$', correct: false },
          { text: '$(2,1)$', correct: false },
          { text: '$(1,1)$', correct: true },
          { text: '$(0,1)$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$a_1$ 不为 0：$1\\cdot\\cos x$ 的积分为 0，但 $\\cos^2x$ 的积分为 $\\pi$，合起来 $a_1=1$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$a_0$ 是平均值 1 而不是 2；2 是把 $\\int f=2\\pi$ 直接当成了系数。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$a_0$ 是均值 $\\frac{1}{2\\pi}\\int_{-\\pi}^{\\pi}(1+\\cos x)dx=1$；$a_1=\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi}(1+\\cos x)\\cos x\\,dx=\\frac{1}{\\pi}\\int\\cos^2x\\,dx=1$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$f$ 的均值为 1 不为 0；只有 $\\cos x$ 这类零均值函数才有 $a_0=0$。</span></div>"
      },
      {
        id: 'ch10-q16', ch: 'ch10', type: 'mcq', difficulty: 1,
        kp: '10.6 Computer Graphics', tags: ['compute'],
        stem: '平面中绕原点逆时针旋转 $90^\\circ$ 的变换矩阵是？',
        options: [
          { text: '$\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}$', correct: true },
          { text: '$\\begin{bmatrix}0&1\\\\-1&0\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}-1&0\\\\0&1\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。旋转矩阵 $R(\\theta)=\\begin{bmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{bmatrix}$，取 $\\theta=90^\\circ$ 得 $\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}$，它把 $(1,0)$ 送到 $(0,1)$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。这是顺时针旋转 $90^\\circ$，它把 $(1,0)$ 送到 $(0,-1)$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。这是关于 $x$ 轴的反射：$(1,0)$ 不动，而 $(0,1)$ 变成 $(0,-1)$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。这是关于 $y$ 轴的反射：$(1,0)$ 变成 $(-1,0)$。</span></div>"
      },
      {
        id: 'ch10-q17', ch: 'ch10', type: 'mcq', difficulty: 1,
        kp: '10.6 Computer Graphics', tags: ['concept'],
        stem: '在二维图形学中，把点 $(x,y)$ 写成齐次坐标 $(x,y,1)$ 的主要原因是？',
        options: [
          { text: '可以减小存储空间', correct: false },
          { text: '使旋转变成线性变换', correct: false },
          { text: '使缩放矩阵可逆', correct: false },
          { text: '使平移也能用矩阵乘法表示', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。齐次坐标多出一维，存储不减反增。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。旋转在普通坐标下已经是线性变换，$\\begin{bmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{bmatrix}$ 就够了。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。缩放矩阵在普通坐标下就可逆（缩放因子非零时），与齐次坐标无关。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。平移 $(x,y)\\mapsto(x+a,y+b)$ 不是线性变换，但 $\\begin{bmatrix}1&0&a\\\\0&1&b\\\\0&0&1\\end{bmatrix}\\begin{bmatrix}x\\\\y\\\\1\\end{bmatrix}=\\begin{bmatrix}x+a\\\\y+b\\\\1\\end{bmatrix}$，于是平移、旋转、缩放可统一成矩阵乘法并复合。</span></div>"
      },
      {
        id: 'ch10-q18', ch: 'ch10', type: 'mcq', difficulty: 3,
        kp: '10.6 Computer Graphics', tags: ['compute'],
        stem: '齐次坐标下先按 $R=\\begin{bmatrix}0&-1&0\\\\1&0&0\\\\0&0&1\\end{bmatrix}$ 旋转，再按 $T=\\begin{bmatrix}1&0&1\\\\0&1&2\\\\0&0&1\\end{bmatrix}$ 平移。点 $(1,0)$ 的像为？',
        options: [
          { text: '$(3,1)$', correct: false },
          { text: '$(1,3)$', correct: true },
          { text: '$(-1,3)$', correct: false },
          { text: '$(0,1)$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$(3,1)$ 把平移量的两个分量用反了，在 $x$ 方向加了 2。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。先旋转 $(1,0)\\mapsto(0,1)$，再平移 $(1,2)$ 得 $(1,3)$；合成矩阵 $TR=\\begin{bmatrix}0&-1&1\\\\1&0&2\\\\0&0&1\\end{bmatrix}$ 作用于 $(1,0,1)$ 同样得到 $(1,3,1)$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$(-1,3)$ 相当于先顺时针旋转 $90^\\circ$ 再平移，旋转方向反了。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$(0,1)$ 只做了旋转，漏掉了平移这一步。</span></div>"
      },
      {
        id: 'ch10-q19', ch: 'ch10', type: 'mcq', difficulty: 2,
        kp: '10.7 Linear Algebra for Cryptography', tags: ['compute'],
        stem: 'Hill 密码用矩阵 $K=\\begin{bmatrix}3&1\\\\1&2\\end{bmatrix}$ 加密，字母按 $A=0,B=1,\\dots,Z=25$ 编码，密文 $\\mathbf{c}\\equiv K\\mathbf{p}\\pmod{26}$。明文 $HI$ 对应的密文是？',
        options: [
          { text: '$XD$', correct: false },
          { text: '$HI$', correct: false },
          { text: '$DX$', correct: true },
          { text: '$CX$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$(3,23)$ 被读成了 $X,D$，矩阵乘法的两个分量顺序不能交换。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。这是明文本身，没有加密；$K(7,8)^{\\mathsf T}$ 不会回到 $(7,8)$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$H,I$ 编码为 $(7,8)^{\\mathsf T}$，$K(7,8)^{\\mathsf T}=(21+8,\\,7+16)^{\\mathsf T}=(29,23)^{\\mathsf T}\\equiv(3,23)^{\\mathsf T}\\pmod{26}$，即 $D,X$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。把模数误写成 27，$29-27=2$ 得 $C$；实际应模 26 得 3，即 $D$。</span></div>"
      },
      {
        id: 'ch10-q20', ch: 'ch10', type: 'mcq', difficulty: 3,
        kp: '10.7 Linear Algebra for Cryptography', tags: ['compute'],
        stem: 'Hill 密码用 $K=\\begin{bmatrix}3&1\\\\1&2\\end{bmatrix}$ 加密（模 26）。其解密矩阵 $K^{-1}\\pmod{26}$ 的第一行是？',
        options: [
          { text: '$(11,5)$', correct: false },
          { text: '$(2,-1)$', correct: false },
          { text: '$(16,5)$', correct: true },
          { text: '$(21,5)$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$(11,5)$ 是第二行的后一半，把 $K^{-1}$ 的两行搞混了；第二行应为 $(5,11)$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$(2,-1)$ 是伴随矩阵的第一行，还没有乘 $5^{-1}=21$，也没有把负元化为正。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$\\det K=5$，$5^{-1}\\equiv21\\pmod{26}$，故 $K^{-1}=21\\begin{bmatrix}2&-1\\\\-1&3\\end{bmatrix}\\equiv\\begin{bmatrix}42&-21\\\\-21&63\\end{bmatrix}\\equiv\\begin{bmatrix}16&5\\\\5&11\\end{bmatrix}$，第一行为 $(16,5)$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$(21,5)$ 把乘数 21 当成了第一个元素；$21\\cdot2=42\\equiv16$，第一行第一个元素应是 16。</span></div>"
      },
      /* ---------------- ch11 · Numerical Linear Algebra（20 题） ---------------- */
      {
        id: 'ch11-q1', ch: 'ch11', type: 'mcq', difficulty: 1,
        kp: '11.1 Gaussian Elimination in Practice', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}0&2\\\\3&4\\end{bmatrix}$，$\\mathbf{b}=\\begin{bmatrix}4\\\\11\\end{bmatrix}$。用部分主元法求解 $A\\mathbf{x}=\\mathbf{b}$（第一步先交换两行），则 $\\mathbf{x}=$？',
        options: [
          { text: '$(1,2)$', correct: true },
          { text: '$(2,1)$', correct: false },
          { text: '$(1,-2)$', correct: false },
          { text: '$(-1,2)$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。第一列主元 $a_{11}=0$，交换两行得 $\\begin{bmatrix}3&4\\\\0&2\\end{bmatrix}$，回代 $2x_2=4$ 得 $x_2=2$，再由 $3x_1+4\\cdot2=11$ 得 $x_1=1$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。把未知量顺序写反了。代回交换后的第二式（原第一行）得 $0\\cdot2+2\\cdot1=2\\ne4$，并不满足方程。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$x_1=1$ 是对的，问题出在 $x_2$：回代 $2x_2=4$ 应得 $x_2=2$，写成 $-2$ 是解这个方程时的符号错误。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$x_1=1$ 不为 $-1$；负号来自把交换后的行 $[0,2]$ 当成第一行去回代。</span></div>"
      },
      {
        id: 'ch11-q2', ch: 'ch11', type: 'mcq', difficulty: 1,
        kp: '11.1 Gaussian Elimination in Practice', tags: ['concept'],
        stem: '高斯消元在计算机上实现时通常采用部分主元法（partial pivoting），其主要目的是？',
        options: [
          { text: '把乘法次数从 $O(n^3)$ 降到 $O(n^2)$', correct: false },
          { text: '使每一步的乘子满足 $|l_{ij}|\\le1$，抑制舍入误差在消元过程中被放大', correct: true },
          { text: '保证对任何非奇异矩阵都能得到精确解，不受浮点数限制', correct: false },
          { text: '使消元得到的上三角矩阵 $U$ 一定是对角占优矩阵', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。部分主元只需比较并交换两行，乘法次数仍是 $O(n^3)$，只是多了一点比较开销。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。选当前列绝对值最大的元素作主元，可使 $|l_{ij}|=|a_{ij}/a_{jj}|\\le1$，避免小主元把已有的舍入误差放大成灾难。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。部分主元只控制误差放大，浮点舍入无法消除；对病态矩阵仍可能丢掉大量有效数字。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。部分主元不改变 $U$ 的占优性，一般的 $U$ 也不对角占优，它保证的是乘子有界而非对角占优。</span></div>"
      },
      {
        id: 'ch11-q3', ch: 'ch11', type: 'mcq', difficulty: 1,
        kp: '11.2 Norms and Condition Numbers', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&-2&3\\\\-4&5&-6\\end{bmatrix}$，则 $\\lVert A\\rVert_\\infty=$？',
        options: [
          { text: '$6$', correct: false },
          { text: '$9$', correct: false },
          { text: '$15$', correct: true },
          { text: '$21$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$6$ 只是第一行的绝对值之和 $1+2+3$，而 $\\lVert A\\rVert_\\infty$ 要取所有行和中的最大值。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$9$ 是第三列的列和 $3+6$，那是 $\\lVert A\\rVert_1$，不是行和。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。两行的绝对值之和分别为 $1+2+3=6$ 与 $4+5+6=15$，取最大得 $\\lVert A\\rVert_\\infty=15$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$21$ 是全部元素绝对值之和；范数是先对每行求和、再取最大，不是把所有元素加在一起。</span></div>"
      },
      {
        id: 'ch11-q4', ch: 'ch11', type: 'mcq', difficulty: 1,
        kp: '11.2 Norms and Condition Numbers', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}2&-1\\\\-3&4\\\\1&0\\end{bmatrix}$，则 $\\lVert A\\rVert_1=$？',
        options: [
          { text: '$5$', correct: false },
          { text: '$7$', correct: false },
          { text: '$6$', correct: true },
          { text: '$11$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$5$ 是第二列的列和 $1+4+0$，不是最大的那一列。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$7$ 是最大行和 $-3+4=7$（取绝对值相加），那是 $\\lVert A\\rVert_\\infty$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。两列的绝对值之和为 $2+3+1=6$ 与 $1+4+0=5$，取最大得 $\\lVert A\\rVert_1=6$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$11$ 是全部元素绝对值之和 $2+1+3+4+1+0$，不是列和的最大值。</span></div>"
      },
      {
        id: 'ch11-q5', ch: 'ch11', type: 'mcq', difficulty: 1,
        kp: '11.2 Norms and Condition Numbers', tags: ['concept'],
        stem: '设 $A$ 是 $m\\times n$ 矩阵，$\\sigma_1\\ge\\sigma_2\\ge\\cdots\\ge\\sigma_r\\gt0$ 是它的非零奇异值。则 $\\lVert A\\rVert_2$ 等于？',
        options: [
          { text: '$\\sigma_1$', correct: true },
          { text: '$\\sigma_1/\\sigma_r$', correct: false },
          { text: '$\\sqrt{\\sigma_1^2+\\cdots+\\sigma_r^2}$', correct: false },
          { text: '$\\sigma_r$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$\\lVert A\\rVert_2=\\max_{\\lVert\\mathbf{x}\\rVert_2=1}\\lVert A\\mathbf{x}\\rVert_2=\\sigma_1$，即最大奇异值，也就是 $A^{\\mathsf T}A$ 最大特征值的平方根。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$\\sigma_1/\\sigma_r$ 是 2-范数条件数 $\\kappa_2(A)$，它是误差放大倍数，不是范数本身。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\sqrt{\\sigma_1^2+\\cdots+\\sigma_r^2}$ 是 Frobenius 范数 $\\lVert A\\rVert_F$，它把所有奇异值都算了进去。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\sigma_r$ 是最小非零奇异值，衡量的是 $A$ 最「薄弱」的方向，不是 $\\lVert A\\rVert_2$。</span></div>"
      },
      {
        id: 'ch11-q6', ch: 'ch11', type: 'mcq', difficulty: 2,
        kp: '11.2 Norms and Condition Numbers', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$，则 $\\kappa_\\infty(A)=\\lVert A\\rVert_\\infty\\lVert A^{-1}\\rVert_\\infty=$？',
        options: [
          { text: '$7$', correct: false },
          { text: '$14$', correct: false },
          { text: '$21$', correct: true },
          { text: '$49$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$7$ 只是 $\\lVert A\\rVert_\\infty=\\max(3,7)$，条件数还要再乘 $\\lVert A^{-1}\\rVert_\\infty$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$14=7\\times2$ 把 $\\lVert A^{-1}\\rVert_\\infty$ 当成了 $1/|\\det(A)|$ 的倒数 $2$；实际 $\\lVert A^{-1}\\rVert_\\infty=\\max(3,2)=3$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$A^{-1}=\\begin{bmatrix}-2&1\\\\1.5&-0.5\\end{bmatrix}$，行和最大为 $3$，故 $\\kappa_\\infty=7\\times3=21$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$49=7^2$ 是 $\\lVert A\\rVert_\\infty$ 的平方；条件数是两个范数的乘积，不是同一个范数的平方。</span></div>"
      },
      {
        id: 'ch11-q7', ch: 'ch11', type: 'mcq', difficulty: 1,
        kp: '11.3 Iterative Methods and Preconditioners', tags: ['concept'],
        stem: '把 $A\\mathbf{x}=\\mathbf{b}$ 拆成 $A=M-N$，写成 $\\mathbf{x}=M^{-1}N\\mathbf{x}+M^{-1}\\mathbf{b}$，用迭代 $\\mathbf{x}_{k+1}=M^{-1}N\\mathbf{x}_k+M^{-1}\\mathbf{b}$ 求解。该迭代对任意初值都收敛的充要条件是？',
        options: [
          { text: '$\\rho(M^{-1}N)\\lt1$', correct: true },
          { text: '$\\rho(M^{-1}N)\\gt1$', correct: false },
          { text: '$\\lVert M^{-1}N\\rVert_\\infty\\lt1$', correct: false },
          { text: '$A$ 是对称正定矩阵', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。误差满足 $\\mathbf{e}_{k+1}=M^{-1}N\\mathbf{e}_k$，故 $\\mathbf{e}_k=(M^{-1}N)^k\\mathbf{e}_0\\to\\mathbf{0}$ 当且仅当谱半径小于 $1$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$\\rho\\gt1$ 时至少有一个误差分量按 $|\\lambda|^k$ 增长，迭代发散，条件写反了。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\lVert M^{-1}N\\rVert_\\infty\\lt1$ 只保证收敛，是充分条件；谱半径可以小于 $1$ 而某个诱导范数大于 $1$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$A$ 对称正定只保证某些方法（如共轭梯度）可用，对应的 Jacobi 迭代矩阵谱半径仍可能超过 $1$。</span></div>"
      },
      {
        id: 'ch11-q8', ch: 'ch11', type: 'mcq', difficulty: 2,
        kp: '11.3 Iterative Methods and Preconditioners', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}2&-1\\\\-1&2\\end{bmatrix}$，Jacobi 迭代矩阵 $B_J=-D^{-1}(L+U)$，则谱半径 $\\rho(B_J)=$？',
        options: [
          { text: '$1/4$', correct: false },
          { text: '$1/2$', correct: true },
          { text: '$1$', correct: false },
          { text: '$2$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$1/4$ 是同一矩阵 Gauss–Seidel 迭代矩阵的谱半径，不是 Jacobi 的。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$B_J=-\\frac12\\begin{bmatrix}0&-1\\\\-1&0\\end{bmatrix}=\\begin{bmatrix}0&1/2\\\\1/2&0\\end{bmatrix}$，特征值为 $\\pm1/2$，故谱半径为 $1/2$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$1$ 是 $A$ 的较小特征值（$A$ 的特征值为 $1$ 和 $3$），不是 $B_J$ 的谱半径。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$2$ 是 $A$ 的对角元，被误当成了迭代矩阵的谱半径；$B_J$ 的元素是 $1/2$。</span></div>"
      },
      {
        id: 'ch11-q9', ch: 'ch11', type: 'mcq', difficulty: 1,
        kp: '11.1 Gaussian Elimination in Practice', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}2&1\\\\4&3\\end{bmatrix}$，不换行做一次消元得 $U$。增长因子 $g=\\max|u_{ij}|/\\max|a_{ij}|=$？',
        options: [
          { text: '$1/2$', correct: true },
          { text: '$1$', correct: false },
          { text: '$2$', correct: false },
          { text: '$4$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。乘子 $l_{21}=4/2=2$，$u_{22}=3-2\\cdot1=1$，故 $U=\\begin{bmatrix}2&1\\\\0&1\\end{bmatrix}$，$\\max|u|=2$、$\\max|a|=4$，得 $1/2$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$g=1$ 出现在 $U$ 的最大元仍等于 $A$ 的最大元时；这里 $A$ 中的 $4$ 被消去了。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$2$ 是乘子 $l_{21}=a_{21}/a_{11}$，它只是消元的系数，不是增长因子。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$4$ 只是 $\\max|a_{ij}|$，增长因子要用消元后的 $U$ 与之相比，不能只报分母。</span></div>"
      },
      {
        id: 'ch11-q10', ch: 'ch11', type: 'mcq', difficulty: 2,
        kp: '11.1 Gaussian Elimination in Practice', tags: ['concept'],
        stem: '关于高斯消元的增长因子，下列说法正确的是？',
        options: [
          { text: '采用部分主元法后，增长因子对任意 $n\\times n$ 矩阵都不超过 $2$', correct: false },
          { text: '即使采用部分主元法，增长因子的理论上界仍随 $n$ 增长，最坏可达 $2^{n-1}$ 量级', correct: true },
          { text: '只要乘子满足 $|l_{ij}|\\le1$，增长因子就恒等于 $1$', correct: false },
          { text: '增长因子只由矩阵的条件数决定，与消元的换行次序无关', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。部分主元只保证 $|l_{ij}|\\le1$，并不能把增长限制在常数 $2$ 以内。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。乘子有界并不阻止中间元素变大，Wilkinson 型矩阵在部分主元下增长仍可达 $2^{n-1}$ 量级，只是实际问题中极少出现。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$|l_{ij}|\\le1$ 只约束乘子，$u_{ij}$ 仍可能远大于原矩阵元素，增长因子可以大于 $1$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。增长因子由 $U$ 的元素与原矩阵元素之比定义，换行次序直接改变 $U$，因此与消元顺序有关。</span></div>"
      },
      {
        id: 'ch11-q11', ch: 'ch11', type: 'mcq', difficulty: 2,
        kp: '11.2 Norms and Condition Numbers', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$，则 $\\kappa_2(A)=$？',
        options: [
          { text: '$1$', correct: false },
          { text: '$2$', correct: false },
          { text: '$3$', correct: true },
          { text: '$9$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$\\kappa_2=1$ 只对正交矩阵（或单位矩阵的倍数）成立，$A$ 不是正交矩阵。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$2$ 是对角元，不是奇异值；$A$ 的特征值为 $3$ 和 $1$，最大最小之比是 $3$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$A$ 对称，奇异值即特征值的绝对值 $3$ 与 $1$，故 $\\kappa_2=\\sigma_1/\\sigma_2=3$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$9=\\sigma_1^2$ 是最大特征值；条件数是两个奇异值之比，不是平方。</span></div>"
      },
      {
        id: 'ch11-q12', ch: 'ch11', type: 'mcq', difficulty: 2,
        kp: '11.2 Norms and Condition Numbers', tags: ['compute'],
        stem: '设 $\\kappa_\\infty(A)=100$，解 $A\\mathbf{x}=\\mathbf{b}$ 时右端有相对误差 $\\lVert\\Delta\\mathbf{b}\\rVert_\\infty/\\lVert\\mathbf{b}\\rVert_\\infty=10^{-6}$。由相对误差界估计，解 $\\mathbf{x}$ 的相对误差的上界约为？',
        options: [
          { text: '$10^{-8}$', correct: false },
          { text: '$10^{-6}$', correct: false },
          { text: '$10^{-4}$', correct: true },
          { text: '$10^{2}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$10^{-8}$ 是把 $10^{-6}$ 除以条件数得到的，误差界的乘法方向弄反了。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$10^{-6}$ 是右端自身的误差，忽略了 $A$ 会把解的误差放大约 $100$ 倍。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。相对误差界为 $\\kappa(A)$ 乘右端相对误差，即 $100\\times10^{-6}=10^{-4}$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$10^{2}$ 是条件数本身，它是放大倍数而不是解的相对误差。</span></div>"
      },
      {
        id: 'ch11-q13', ch: 'ch11', type: 'mcq', difficulty: 2,
        kp: '11.3 Iterative Methods and Preconditioners', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}2&-1\\\\-1&2\\end{bmatrix}$，Gauss–Seidel 迭代矩阵为 $B_{GS}=-(D+L)^{-1}U$，则 $\\rho(B_{GS})=$？',
        options: [
          { text: '$0$', correct: false },
          { text: '$1/2$', correct: false },
          { text: '$1$', correct: false },
          { text: '$1/4$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$B_{GS}$ 虽有一个特征值为 $0$，另一个是 $1/4$，谱半径取最大模，不为 $0$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$1/2$ 是同一矩阵的 Jacobi 谱半径，Gauss–Seidel 把它平方后得到更小的 $1/4$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$1$ 是收敛的临界值；本题谱半径严格小于 $1$，迭代收敛。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$D+L=\\begin{bmatrix}2&0\\\\-1&2\\end{bmatrix}$，$(D+L)^{-1}U=\\begin{bmatrix}0&-1/2\\\\0&-1/4\\end{bmatrix}$，加负号后为下三角，特征值 $0$ 与 $1/4$。</span></div>"
      },
      {
        id: 'ch11-q14', ch: 'ch11', type: 'mcq', difficulty: 1,
        kp: '11.3 Iterative Methods and Preconditioners', tags: ['concept'],
        stem: '共轭梯度法（CG）直接适用于下列哪类方程组？',
        options: [
          { text: '任意非奇异 $n\\times n$ 方程组', correct: false },
          { text: '系数矩阵对称正定的方程组', correct: true },
          { text: '系数矩阵为 $m\\times n$ 且 $m\\ne n$ 的最小二乘问题可直接套用', correct: false },
          { text: '任何对角占优的方程组', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。CG 依赖对称正定矩阵定义的内积，非对称矩阵无法保证搜索方向共轭，需改用 GMRES 等方法。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$A$ 对称正定时 $\\mathbf{u}^{\\mathsf T}A\\mathbf{v}$ 是内积，残差两两正交、方向 $A$-共轭，精确算术下 $n$ 步内收敛。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。非方阵的 $A$ 不能直接用于 CG，必须先化成正规方程 $A^{\\mathsf T}A\\hat{\\mathbf{x}}=A^{\\mathsf T}\\mathbf{b}$，此时 $A^{\\mathsf T}A$ 才对称正定。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。对角占优保证 Jacobi、Gauss–Seidel 收敛，与 CG 需要的对称正定条件无关。</span></div>"
      },
      {
        id: 'ch11-q15', ch: 'ch11', type: 'mcq', difficulty: 3,
        kp: '11.2 Norms and Condition Numbers', tags: ['concept', 'trap'],
        stem: '某 $10\\times10$ 可逆矩阵 $A$ 的条件数 $\\kappa_\\infty(A)=10^6$。下列说法正确的是？',
        options: [
          { text: '$A$ 一定是奇异矩阵，只是数值上接近奇异', correct: false },
          { text: '用双精度（约 $16$ 位有效数字）求解时，解 $\\mathbf{x}$ 大约只能保留 $10$ 位有效数字', correct: true },
          { text: '解的相对误差一定恰好等于 $10^{-6}$', correct: false },
          { text: '$A$ 的最小奇异值一定小于 $10^{-6}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。题干已给出 $A$ 可逆；条件数大只说明接近奇异，并不等于奇异，$\\kappa$ 有限就说明 $A^{-1}$ 存在。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。经验规律是每步运算约损失 $\\lg\\kappa$ 位有效数字，$16-6=10$，故解大约只剩 $10$ 位可信。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\kappa$ 是误差放大倍数的上界，实际误差取决于右端扰动的大小，可以远小于 $10^{-6}$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\kappa=\\sigma_1/\\sigma_n$ 只给出比值；若 $\\sigma_1$ 很大，$\\sigma_n$ 完全可以大于 $10^{-6}$。</span></div>"
      },
      {
        id: 'ch11-q16', ch: 'ch11', type: 'mcq', difficulty: 3,
        kp: '11.2 Norms and Condition Numbers', tags: ['proof'],
        stem: '设 $A$ 是 $m\\times n$ 矩阵，$\\lVert A\\rVert_1=\\max_{\\mathbf{x}\\ne\\mathbf{0}}\\lVert A\\mathbf{x}\\rVert_1/\\lVert\\mathbf{x}\\rVert_1$。下列哪一步推理正确，能证明 $\\lVert A\\rVert_1$ 等于最大列和？',
        options: [
          { text: '先对每个分量估计 $\\lVert A\\mathbf{x}\\rVert_1\\le\\sum_j\\left(\\sum_i|a_{ij}|\\right)|x_j|\\le\\left(\\max_j\\sum_i|a_{ij}|\\right)\\lVert\\mathbf{x}\\rVert_1$，再取列和最大的 $j^{*}$ 并令 $\\mathbf{x}=\\mathbf{e}_{j^{*}}$ 取到等号', correct: true },
          { text: '取 $\\mathbf{x}=(1,1,\\dots,1)^{\\mathsf T}$ 就能取到等号，所以最大列和就是这个范数', correct: false },
          { text: '$\\lVert A\\rVert_1$ 等于最大行和，因为 $A\\mathbf{x}$ 的第 $i$ 个分量只用到 $A$ 的第 $i$ 行', correct: false },
          { text: '$\\lVert A\\rVert_1=\\lVert A^{\\mathsf T}\\rVert_\\infty$ 不成立，因为转置改变了元素的绝对值之和', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。交换求和次序把系数提成列和，得到上界；再让 $\\mathbf{x}$ 集中在列和最大的一列（单位向量 $\\mathbf{e}_{j^{*}}$），不等号取等，故范数等于最大列和。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。全 $1$ 向量一般取不到等号，它把各列按系数混合起来，只能给出一个下界而不是极值。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。最大行和对应的是 $\\lVert A\\rVert_\\infty$；$\\lVert A\\rVert_1$ 由列决定，两种范数不能混。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。转置不改变元素的绝对值，只是把行列互换，等式 $\\lVert A\\rVert_1=\\lVert A^{\\mathsf T}\\rVert_\\infty$ 是成立的。</span></div>"
      },
      {
        id: 'ch11-q17', ch: 'ch11', type: 'mcq', difficulty: 3,
        kp: '11.3 Iterative Methods and Preconditioners', tags: ['compute'],
        stem: '设 $A=\\begin{bmatrix}1&2\\\\2&1\\end{bmatrix}$，用 Jacobi 迭代求解 $A\\mathbf{x}=\\mathbf{b}$。关于收敛性，正确的结论是？',
        options: [
          { text: '收敛，因为 $A$ 是对称矩阵', correct: false },
          { text: '收敛，因为 $\\rho(B_J)=1/2$', correct: false },
          { text: '发散，因为 $\\rho(B_J)=2\\gt1$', correct: true },
          { text: '发散，因为 $A$ 是奇异矩阵', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。对称性不保证 Jacobi 收敛；本题 $\\rho(B_J)=2$，误差按 $2^k$ 增长。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$1/2$ 是 $\\begin{bmatrix}2&-1\\\\-1&2\\end{bmatrix}$ 的 Jacobi 谱半径，本题矩阵不同。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$B_J=-\\begin{bmatrix}0&2\\\\2&0\\end{bmatrix}$ 的特征值为 $2$ 与 $-2$，谱半径为 $2\\gt1$，迭代发散。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\det(A)=1\\cdot1-2\\cdot2=-3\\ne0$，$A$ 非奇异；发散的原因是迭代矩阵谱半径大于 $1$。</span></div>"
      },
      {
        id: 'ch11-q18', ch: 'ch11', type: 'mcq', difficulty: 2,
        kp: '11.3 Iterative Methods and Preconditioners', tags: ['concept', 'trap'],
        stem: '求解 $A\\mathbf{x}=\\mathbf{b}$ 时引入可逆矩阵 $P$ 作预条件子，改解 $P^{-1}A\\mathbf{x}=P^{-1}\\mathbf{b}$。关于预条件子的作用，下列说法正确的是？',
        options: [
          { text: '预条件子能把条件数变成 $1$，从而一步得到精确解', correct: false },
          { text: '好的预条件子使 $P^{-1}A$ 的条件数变小、特征值更集中，从而加快 Krylov 子空间方法的收敛', correct: true },
          { text: '预条件子必须取 $P=I$，否则会改变方程组的解', correct: false },
          { text: '预条件子只对直接法（如 LU 消元）有效，对迭代法没有影响', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$P^{-1}A$ 一般仍有大于 $1$ 的条件数，预条件只改善收敛速度，不可能一步给出精确解。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。迭代步数大致随条件数或特征值分布变化，$P$ 接近 $A$ 时 $P^{-1}A$ 接近 $I$，特征值聚拢，收敛显著加快。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$P$ 可逆时 $P^{-1}A\\mathbf{x}=P^{-1}\\mathbf{b}$ 与 $A\\mathbf{x}=\\mathbf{b}$ 同解，左乘可逆矩阵不改变解集。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。预条件子正是为迭代法（CG、GMRES 等）设计的加速手段，与直接法无关。</span></div>"
      },
      {
        id: 'ch11-q19', ch: 'ch11', type: 'mcq', difficulty: 3,
        kp: '11.1 Gaussian Elimination in Practice', tags: ['proof'],
        stem: '甲说：『$A=\\begin{bmatrix}0&1\\\\1&1\\end{bmatrix}$ 不必换行，因为 $\\det(A)=-1\\ne0$，主元一定都非零。』乙说：『不行，$a_{11}=0$ 使第一步消元就要除以 $0$。』关于两人的说法，正确的是？',
        options: [
          { text: '甲对：$\\det(A)\\ne0$ 保证所有主元非零，可以直接消元', correct: false },
          { text: '乙对：$\\det(A)\\ne0$ 只保证存在一种行排列使主元全非零，而按原顺序 $a_{11}=0$ 使乘子 $a_{21}/a_{11}$ 无定义', correct: true },
          { text: '两人都对：换不换行结果一样，只是计算量不同', correct: false },
          { text: '两人都错：$\\det(A)=-1$ 说明矩阵奇异，应当停止计算', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$\\det(A)\\ne0$ 保证的是存在某个行排列使主元全非零，并不保证按原顺序的 $a_{11}\\ne0$。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。第一步需要 $l_{21}=a_{21}/a_{11}=1/0$，必须交换两行把 $a_{11}=1$ 换上来；换行后主元为 $1$ 与 $1$，乘积 $1$；交换一次行使 $\\det(PA)=-\\det(A)=1$，与 $\\det(A)=-1$ 相容。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。不换行时消元根本无法启动，这不是计算量的问题，而是运算本身无定义。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\det(A)=0\\cdot1-1\\cdot1=-1\\ne0$，$A$ 可逆，不应停止计算。</span></div>"
      },
      {
        id: 'ch11-q20', ch: 'ch11', type: 'mcq', difficulty: 2,
        kp: '11.3 Iterative Methods and Preconditioners', tags: ['concept'],
        stem: '设 $A$ 对称正定，$D$ 为其对角部分，且 $2D-A$ 也正定。关于求解 $A\\mathbf{x}=\\mathbf{b}$ 的 Jacobi 与 Gauss–Seidel 迭代，下列说法正确的是？',
        options: [
          { text: '两者都收敛，且通常 Jacobi 收敛更快', correct: false },
          { text: '只有 Jacobi 收敛，Gauss–Seidel 可能发散', correct: false },
          { text: '两者都一定发散，因为 $A$ 对称正定时对角元不占优', correct: false },
          { text: '两者都收敛，且通常 Gauss–Seidel 收敛更快', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。Gauss–Seidel 每步都用上了刚算出的新分量，相当于对 $B_J$ 做一次下三角化，谱半径一般更小而不是更大。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$A$ 对称正定时 Gauss–Seidel 无条件收敛，不存在只有 Jacobi 收敛的情形。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。收敛由迭代矩阵的谱半径决定；本题 $2D-A$ 正定恰好保证 $\\rho(B_J)\\lt1$，两者都收敛。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$2D-A$ 正定等价于 $\\rho(B_J)\\lt1$，Jacobi 收敛；对称正定又保证 Gauss–Seidel 收敛，且其谱半径通常更小、迭代更快。</span></div>"
      },
      /* ---------------- ch12 · Linear Algebra in Probability & Statistics（20 题） ---------------- */
      {
        id: 'ch12-q1', ch: 'ch12', type: 'mcq', difficulty: 1,
        kp: '12.1 Mean, Variance, and Probability', tags: ['compute'],
        stem: '设随机变量 $X$ 取值为 $1,2,4$ 的概率分别为 $0.2,0.5,0.3$，则期望 $E[X]=$？',
        options: [
          { text: '$2.33$', correct: false },
          { text: '$2.4$', correct: true },
          { text: '$2.8$', correct: false },
          { text: '$3.5$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$2.33$ 是算术平均 $(1+2+4)/3$，完全没有用到概率权重。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$E[X]=0.2\\cdot1+0.5\\cdot2+0.3\\cdot4=0.2+1+1.2=2.4$，即用概率加权的平均值。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$2.8$ 是把概率顺序与取值错配（用 $0.2,0.3,0.5$ 依次乘 $1,2,4$）得到的结果。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$3.5$ 是 $(1+2+4)/2$，把除以个数错写成了除以 $2$。</span></div>"
      },
      {
        id: 'ch12-q2', ch: 'ch12', type: 'mcq', difficulty: 1,
        kp: '12.1 Mean, Variance, and Probability', tags: ['concept'],
        stem: '设 $\\mathbf{p}=(p_1,\\dots,p_n)$。称 $\\mathbf{p}$ 为概率向量，当且仅当它满足？',
        options: [
          { text: '$\\sum_{i=1}^n p_i=1$，各分量可以为负', correct: false },
          { text: '$p_i\\ge0$ 且 $\\lVert\\mathbf{p}\\rVert_2=1$', correct: false },
          { text: '$p_i\\ge0$ 且 $\\sum_{i=1}^n p_i=1$', correct: true },
          { text: '$\\sum_{i=1}^n p_i=1$ 且 $p_1\\ge p_2\\ge\\cdots\\ge p_n$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。允许负分量会让「概率」失去意义，例如 $(-0.5,1.5)$ 之和为 $1$ 却不能描述任何随机试验。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$\\lVert\\mathbf{p}\\rVert_2=1$ 是单位向量的条件；如 $(0.5,0.5)$ 的和为 $1$，其 2-范数为 $\\sqrt{0.5}\\ne1$。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。概率非负，且所有可能结果的概率之和为 $1$，这两个条件合起来正好刻画概率向量。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。概率不必按大小排序，$(0.3,0.5,0.2)$ 同样是合法的概率向量。</span></div>"
      },
      {
        id: 'ch12-q3', ch: 'ch12', type: 'mcq', difficulty: 1,
        kp: '12.1 Mean, Variance, and Probability', tags: ['compute'],
        stem: '设数据向量 $\\mathbf{x}=(1,2,3,4)$，均值 $\\bar{x}=\\frac1n\\sum_i x_i$，方差按 $\\sigma^2=\\frac1n\\sum_i(x_i-\\bar{x})^2$ 定义，则 $\\sigma^2=$？',
        options: [
          { text: '$1.25$', correct: true },
          { text: '$1.5$', correct: false },
          { text: '$2.5$', correct: false },
          { text: '$5$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$\\bar{x}=2.5$，四个平方偏差为 $2.25,0.25,0.25,2.25$，和为 $5$，再除以 $n=4$ 得 $1.25$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$1.5$ 是极差的一半 $(4-1)/2$；方差要用每个数据到均值的平方距离，不是极差。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$2.5$ 是均值本身，它衡量数据中心的位置，不衡量离散程度。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$5$ 是平方偏差之和，忘记除以数据个数 $n=4$。</span></div>"
      },
      {
        id: 'ch12-q4', ch: 'ch12', type: 'mcq', difficulty: 1,
        kp: '12.1 Mean, Variance, and Probability', tags: ['concept'],
        stem: '设 $\\mathbf{x}\\in\\mathbb{R}^n$，$\\mathbf{1}=(1,1,\\dots,1)$，$\\bar{x}$ 为 $\\mathbf{x}$ 的均值。向量 $\\mathbf{x}$ 在 $\\mathbf{1}$ 上的投影是？',
        options: [
          { text: '$\\mathbf{x}-\\bar{x}\\mathbf{1}$', correct: false },
          { text: '$\\bar{x}\\mathbf{1}$', correct: true },
          { text: '$\\frac1n\\mathbf{x}$', correct: false },
          { text: '$\\bar{x}$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$\\mathbf{x}-\\bar{x}\\mathbf{1}$ 是去均值后的残差向量，它与 $\\mathbf{1}$ 正交，是投影的补分量而不是投影。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。投影为 $\\frac{\\mathbf{x}^{\\mathsf T}\\mathbf{1}}{\\mathbf{1}^{\\mathsf T}\\mathbf{1}}\\mathbf{1}$，而 $\\mathbf{1}^{\\mathsf T}\\mathbf{1}=n$、$\\mathbf{x}^{\\mathsf T}\\mathbf{1}=n\\bar{x}$，故得 $\\bar{x}\\mathbf{1}$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\frac1n\\mathbf{x}$ 只是把 $\\mathbf{x}$ 缩小 $n$ 倍，方向仍随 $\\mathbf{x}$ 变化，一般不在 $\\mathbf{1}$ 张成的直线上。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\bar{x}$ 是一个标量，而投影必须是 $\\mathbb{R}^n$ 中的向量 $\\bar{x}\\mathbf{1}$。</span></div>"
      },
      {
        id: 'ch12-q5', ch: 'ch12', type: 'mcq', difficulty: 2,
        kp: '12.1 Mean, Variance, and Probability', tags: ['concept'],
        stem: '设 $\\bar{x}$ 为 $\\mathbf{x}\\in\\mathbb{R}^n$ 的均值，方差 $\\sigma^2=\\frac1n\\sum_i(x_i-\\bar{x})^2$。则平方距离 $\\lVert\\mathbf{x}-\\bar{x}\\mathbf{1}\\rVert^2$ 等于？',
        options: [
          { text: '$\\sigma^2$', correct: false },
          { text: '$n^2\\sigma^2$', correct: false },
          { text: '$n\\sigma^2$', correct: true },
          { text: '$\\sqrt{n}\\,\\sigma^2$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。漏掉了因子 $n$；$\\sigma^2$ 是平方距离除以 $n$ 之后的结果。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$n^2\\sigma^2$ 相当于把每个偏差都乘了 $n$ 再求和，量纲也对不上。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。方差定义就是「到均值向量的平方距离除以个数」，即 $\\sigma^2=\\frac1n\\lVert\\mathbf{x}-\\bar{x}\\mathbf{1}\\rVert^2$，移项得 $n\\sigma^2$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\sqrt{n}\\,\\sigma^2$ 把标准差 $\\sigma$ 的 $n$ 倍与平方距离混淆了。</span></div>"
      },
      {
        id: 'ch12-q6', ch: 'ch12', type: 'mcq', difficulty: 2,
        kp: '12.1 Mean, Variance, and Probability', tags: ['compute'],
        stem: '设 $X$ 取值为 $0,1,2$ 的概率分别为 $0.5,0.3,0.2$，用 $\\operatorname{Var}(X)=E[X^2]-(E[X])^2$ 计算，$\\operatorname{Var}(X)=$？',
        options: [
          { text: '$0.61$', correct: true },
          { text: '$1.1$', correct: false },
          { text: '$0.49$', correct: false },
          { text: '$0.7$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$E[X]=0.3+0.4=0.7$，$E[X^2]=0.3\\cdot1+0.2\\cdot4=1.1$，故方差为 $1.1-0.49=0.61$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$1.1$ 只是 $E[X^2]$，忘记减去 $(E[X])^2$，相当于把原点二阶矩当成了方差。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$0.49$ 只是 $(E[X])^2$，它是公式里要减去的项，不是方差。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$0.7$ 是均值 $E[X]$，不是方差。</span></div>"
      },
      {
        id: 'ch12-q7', ch: 'ch12', type: 'mcq', difficulty: 2,
        kp: '12.1 Mean, Variance, and Probability', tags: ['concept'],
        stem: '把 $\\mathbf{x}$ 分解为 $\\bar{x}\\mathbf{1}$ 与 $\\mathbf{x}-\\bar{x}\\mathbf{1}$ 两部分。这两个向量正交的理由是？',
        options: [
          { text: '因为 $\\mathbf{1}$ 是单位向量', correct: false },
          { text: '因为两部分长度相等', correct: false },
          { text: '因为 $\\bar{x}\\mathbf{1}$ 是零向量', correct: false },
          { text: '因为 $(\\mathbf{x}-\\bar{x}\\mathbf{1})^{\\mathsf T}\\mathbf{1}=\\mathbf{x}^{\\mathsf T}\\mathbf{1}-n\\bar{x}=0$', correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$\\mathbf{1}$ 的长度是 $\\sqrt{n}$ 而不是 $1$；正交与否取决于内积是否为零，与长度是否为 $1$ 无关。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。两部分长度一般不相等，而且正交也推不出等长。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\bar{x}\\mathbf{1}$ 只有在所有数据全为 $0$ 时才是零向量，零向量与任何向量都「正交」但说明不了问题。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$\\mathbf{x}^{\\mathsf T}\\mathbf{1}=n\\bar{x}$，故内积为 $n\\bar{x}-\\bar{x}\\cdot n=0$，残差与 $\\mathbf{1}$ 正交。</span></div>"
      },
      {
        id: 'ch12-q8', ch: 'ch12', type: 'mcq', difficulty: 1,
        kp: '12.2 Covariance Matrices and Joint Probabilities', tags: ['concept'],
        stem: '设随机向量 $\\mathbf{x}=(X_1,\\dots,X_n)$ 的均值为 $\\mu$，协方差矩阵为 $C$。$C$ 的元素 $C_{ij}$ 定义为？',
        options: [
          { text: '$C_{ij}=E[X_iX_j]$', correct: false },
          { text: '$C_{ij}=E[(X_i-\\mu_i)(X_j-\\mu_j)]$', correct: true },
          { text: '$C_{ij}=E[(X_i-\\mu_i)^2]\\cdot E[(X_j-\\mu_j)^2]$', correct: false },
          { text: '$C_{ij}=E[X_i]-E[X_j]$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$E[X_iX_j]$ 是未中心化的二阶矩，只有当所有均值都为 $0$ 时才与协方差相同。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。协方差度量两个分量围绕各自均值的共同起伏；取 $i=j$ 时 $C_{ii}$ 正是 $X_i$ 的方差。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。把两个方差相乘得到的是方差的乘积，量纲是四次方，与协方差不符。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$E[X_i]-E[X_j]$ 是两个均值之差，与两个分量是否同向起伏毫无关系。</span></div>"
      },
      {
        id: 'ch12-q9', ch: 'ch12', type: 'mcq', difficulty: 2,
        kp: '12.2 Covariance Matrices and Joint Probabilities', tags: ['compute'],
        stem: '设 $\\mathbf{a}=(1,2,3,4)$，$\\mathbf{b}=(2,4,6,8)$，取 $\\mathbf{x}_i=(a_i,b_i)$，按 $C=\\frac1n\\sum_{i=1}^n(\\mathbf{x}_i-\\mu)(\\mathbf{x}_i-\\mu)^{\\mathsf T}$ 计算协方差矩阵，则 $C=$？',
        options: [
          { text: '$\\begin{bmatrix}1.25&2.5\\\\2.5&5\\end{bmatrix}$', correct: true },
          { text: '$\\begin{bmatrix}5&10\\\\10&20\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}1.25&2.5\\\\2.5&4\\end{bmatrix}$', correct: false },
          { text: '$\\begin{bmatrix}1.25&0\\\\0&5\\end{bmatrix}$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$\\bar{a}=2.5$、$\\bar{b}=5$，四组离差为 $(-1.5,-3),(-0.5,-1),(0.5,1),(1.5,3)$，平方与交叉项之和分别除以 $4$ 得 $1.25,5,2.5$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。忘记除以 $n=4$，矩阵是离差外积之和而不是平均值。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$C_{22}$ 应为 $(9+1+1+9)/4=5$，写成 $4$ 是漏加了其中一项。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\mathbf{b}=2\\mathbf{a}$ 完全线性相关，协方差不可能为 $0$，非对角元必须非零。</span></div>"
      },
      {
        id: 'ch12-q10', ch: 'ch12', type: 'mcq', difficulty: 2,
        kp: '12.2 Covariance Matrices and Joint Probabilities', tags: ['concept', 'trap'],
        stem: '设 $C$ 是某个二维随机向量的协方差矩阵。下列说法正确的是？',
        options: [
          { text: '$C$ 必定正定，因为方差总是正数', correct: false },
          { text: '$C$ 对称且半正定；当某个分量方差为 $0$ 或两分量完全线性相关时 $C$ 可能奇异', correct: true },
          { text: '$C$ 的特征值可以为负，负特征值表示两个分量负相关', correct: false },
          { text: '$C$ 一定是对角矩阵，因为各分量相互独立', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。若某个分量是常数，其方差为 $0$，$C$ 出现零行零列而奇异，只能保证半正定。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$\\mathbf{v}^{\\mathsf T}C\\mathbf{v}=E[(\\mathbf{v}^{\\mathsf T}(\\mathbf{x}-\\mu))^2]\\ge0$ 说明半正定；方差为 $0$ 或完全相关时 $C$ 不满秩。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。半正定矩阵的特征值非负；负相关表现为协方差 $C_{12}\\lt0$，不是负特征值。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$C$ 一般不是对角阵；只有各分量两两不相关时非对角元才为 $0$。</span></div>"
      },
      {
        id: 'ch12-q11', ch: 'ch12', type: 'mcq', difficulty: 1,
        kp: '12.2 Covariance Matrices and Joint Probabilities', tags: ['concept'],
        stem: '设 $C$ 是数据的协方差矩阵，特征值 $\\lambda_1\\ge\\lambda_2\\ge\\cdots\\ge\\lambda_n$，$\\mathbf{v}_1$ 是对应 $\\lambda_1$ 的单位特征向量。$\\mathbf{v}_1$ 的统计意义是？',
        options: [
          { text: '数据在 $\\mathbf{v}_1$ 方向上的均值为 $0$', correct: false },
          { text: '$\\mathbf{v}_1$ 是使数据点个数最多的方向', correct: false },
          { text: '数据投影到 $\\mathbf{v}_1$ 方向上的方差最大，$\\mathbf{v}_1$ 是第一主方向', correct: true },
          { text: '$\\mathbf{v}_1$ 对应的方差最小', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$\\mathbf{v}_1$ 方向上的均值是 $\\mathbf{v}_1^{\\mathsf T}\\mu$，不会因为它是主方向就恰好为 $0$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。主方向描述的是数据的离散程度，与数据点个数无关。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$\\operatorname{Var}(\\mathbf{v}^{\\mathsf T}\\mathbf{x})=\\mathbf{v}^{\\mathsf T}C\\mathbf{v}$，在单位约束下由 Rayleigh 商取最大，最大值是 $\\lambda_1$，方向即 $\\mathbf{v}_1$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\lambda_1$ 是最大特征值，对应方差最大；方差最小的方向是 $\\mathbf{v}_n$。</span></div>"
      },
      {
        id: 'ch12-q12', ch: 'ch12', type: 'mcq', difficulty: 2,
        kp: '12.2 Covariance Matrices and Joint Probabilities', tags: ['compute'],
        stem: '设二维数据的协方差矩阵 $C=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$。数据在第一主方向上的方差是？',
        options: [
          { text: '$1$', correct: false },
          { text: '$2$', correct: false },
          { text: '$3$', correct: true },
          { text: '$4$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$1$ 是较小的特征值，对应第二主方向上的方差，不是第一主方向。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$2$ 是单个分量的方差（对角元），主方向上的方差要看特征值。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$\\det(C-\\lambda I)=(2-\\lambda)^2-1=0$ 给出 $\\lambda=3$ 与 $\\lambda=1$，第一主方向方差为最大的 $3$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$4$ 是迹 $2+2$，等于两个主方向方差之和，不是最大方差。</span></div>"
      },
      {
        id: 'ch12-q13', ch: 'ch12', type: 'mcq', difficulty: 3,
        kp: '12.2 Covariance Matrices and Joint Probabilities', tags: ['proof'],
        stem: '要证明协方差矩阵 $C$ 半正定，即对任意 $\\mathbf{v}$ 有 $\\mathbf{v}^{\\mathsf T}C\\mathbf{v}\\ge0$。下列哪一步是关键？',
        options: [
          { text: '$\\mathbf{v}^{\\mathsf T}C\\mathbf{v}=E\\left[(\\mathbf{v}^{\\mathsf T}(\\mathbf{x}-\\mu))^{2}\\right]\\ge0$，因为它是某个随机变量平方的期望', correct: true },
          { text: '$C$ 的元素都是实数，所以二次型非负', correct: false },
          { text: '因为 $C$ 对称，而对称矩阵都是半正定的', correct: false },
          { text: '因为 $C$ 的迹等于各分量方差之和，迹为正就说明所有特征值为正', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。$C=E[(\\mathbf{x}-\\mu)(\\mathbf{x}-\\mu)^{\\mathsf T}]$，故二次型等于标量 $\\mathbf{v}^{\\mathsf T}(\\mathbf{x}-\\mu)$ 的平方的期望，必非负。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。元素为实数只说明 $C$ 是实矩阵；例如 $\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$ 全为实数却有负特征值。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。对称只保证特征值为实数，不保证非负；半正定需要额外的二次型条件。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。迹为正推不出特征值全正，例如特征值 $5$ 与 $-1$ 的迹为 $4$；何况可能还有零特征值。</span></div>"
      },
      {
        id: 'ch12-q14', ch: 'ch12', type: 'mcq', difficulty: 3,
        kp: '12.1 Mean, Variance, and Probability', tags: ['proof'],
        stem: '要说明「均值 $\\bar{x}$ 使平方距离 $\\sum_i(x_i-c)^2$ 达到最小」，正确的推理是？',
        options: [
          { text: '因为 $\\bar{x}$ 是算术平均，按定义它就是最优的', correct: false },
          { text: '因为 $\\sum_i(x_i-\\bar{x})=0$，所以 $\\bar{x}$ 最小化这个平方和', correct: false },
          { text: '因为平方距离 $\\sum_i(x_i-c)^2$ 对任何 $c$ 都相等', correct: false },
          { text: "令 $f(c)=\\sum_i(x_i-c)^2$，由 $f'(c)=-2\\sum_i(x_i-c)=0$ 得 $c=\\bar{x}$，又 $f''=2n\\gt0$，故为最小值点", correct: true }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。把定义当结论，没有给出任何论证；「按定义最优」不是数学证明。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$\\sum(x_i-\\bar{x})=0$ 只说明 $f'(\\bar{x})=0$，是驻点条件，还需 $f''\\gt0$ 才能断言最小。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$\\sum(x_i-c)^2$ 随 $c$ 明显变化，只有 $c=\\bar{x}$ 时才取到最小值。</span></div><div class='optExp ok'><b class='oeL'>D</b><span class='oeT'>对。$f(c)=nc^2-2c\\sum x_i+\\sum x_i^2$ 是开口向上的二次函数，唯一驻点 $c=\\bar{x}$ 即最小值点。</span></div>"
      },
      {
        id: 'ch12-q15', ch: 'ch12', type: 'mcq', difficulty: 1,
        kp: '12.3 Multivariate Gaussian and Weighted Least Squares', tags: ['concept'],
        stem: '加权最小二乘要最小化 $\\sum_{i=1}^m w_i(b_i-\\mathbf{a}_i^{\\mathsf T}\\mathbf{x})^2$，其中 $w_i\\gt0$。记 $W=\\operatorname{diag}(w_1,\\dots,w_m)$，则正规方程是？',
        options: [
          { text: '$A^{\\mathsf T}WA\\hat{\\mathbf{x}}=A^{\\mathsf T}W\\mathbf{b}$', correct: true },
          { text: '$A^{\\mathsf T}A\\hat{\\mathbf{x}}=A^{\\mathsf T}\\mathbf{b}$', correct: false },
          { text: '$AWA^{\\mathsf T}\\hat{\\mathbf{x}}=AW\\mathbf{b}$', correct: false },
          { text: '$WA\\hat{\\mathbf{x}}=W\\mathbf{b}$', correct: false }
        ],
        explain: "<div class='optExp ok'><b class='oeL'>A</b><span class='oeT'>对。目标写成 $(A\\mathbf{x}-\\mathbf{b})^{\\mathsf T}W(A\\mathbf{x}-\\mathbf{b})$，对 $\\mathbf{x}$ 求梯度置零即得 $A^{\\mathsf T}WA\\hat{\\mathbf{x}}=A^{\\mathsf T}W\\mathbf{b}$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。这是所有 $w_i=1$ 时的普通最小二乘正规方程，完全忽略了权重。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$AWA^{\\mathsf T}$ 是 $m\\times m$ 矩阵，而未知量 $\\hat{\\mathbf{x}}$ 是 $n$ 维，方程尺寸不匹配。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$W$ 可逆，两边左乘 $W^{-1}$ 就回到 $A\\hat{\\mathbf{x}}=\\mathbf{b}$，这是要求精确插值而不是最小二乘。</span></div>"
      },
      {
        id: 'ch12-q16', ch: 'ch12', type: 'mcq', difficulty: 1,
        kp: '12.3 Multivariate Gaussian and Weighted Least Squares', tags: ['compute'],
        stem: '对同一物理量做了两次测量，得 $b_1=1$、$b_2=5$，权重分别为 $w_1=1$、$w_2=3$。加权最小二乘估计 $\\hat{x}=\\sum_i w_ib_i/\\sum_i w_i=$？',
        options: [
          { text: '$2$', correct: false },
          { text: '$3$', correct: false },
          { text: '$4$', correct: true },
          { text: '$4.6$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$2$ 是把权重配反（用 $3$ 乘 $b_1$、$1$ 乘 $b_2$）得到的 $(3+5)/4$。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。$3$ 是两次测量的算术平均 $(1+5)/2$，没有使用权重。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。$\\hat{x}=(1\\cdot1+3\\cdot5)/(1+3)=16/4=4$，高权重的测量把估计拉向 $5$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$4.6$ 是把权重平方后当作权重 $(1\\cdot1+9\\cdot5)/(1+9)$ 的结果，权重不应平方。</span></div>"
      },
      {
        id: 'ch12-q17', ch: 'ch12', type: 'mcq', difficulty: 2,
        kp: '12.3 Multivariate Gaussian and Weighted Least Squares', tags: ['concept'],
        stem: '多元高斯密度为 $f(\\mathbf{x})=c\\exp\\left(-\\frac12(\\mathbf{x}-\\mu)^{\\mathsf T}\\Sigma^{-1}(\\mathbf{x}-\\mu)\\right)$。关于 $\\Sigma$，下列说法正确的是？',
        options: [
          { text: '$\\Sigma$ 可以是任意对称矩阵，$\\Sigma^{-1}$ 总存在', correct: false },
          { text: '$\\Sigma$ 只需半正定即可，密度仍然有定义', correct: false },
          { text: '$\\Sigma$ 必须是正定矩阵，否则密度无法在 $\\mathbb{R}^n$ 上正常归一化', correct: true },
          { text: '$\\Sigma$ 必须是单位矩阵，否则不是高斯分布', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。对称矩阵可能奇异，例如 $\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$ 的行列式为 $0$，$\\Sigma^{-1}$ 不存在。</span></div><div class='optExp'><b class='oeL'>B</b><span class='oeT'>错。半正定但奇异的 $\\Sigma$ 使二次型在某个方向恒为 $0$，密度沿该方向不衰减，积分发散。</span></div><div class='optExp ok'><b class='oeL'>C</b><span class='oeT'>对。正定保证 $\\Sigma^{-1}$ 存在且二次型恒正，指数部分在无穷远处按高斯速度衰减，密度才可归一化。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$\\Sigma$ 描述各分量的方差与相关性，任意正定矩阵都给出合法的多元高斯分布。</span></div>"
      },
      {
        id: 'ch12-q18', ch: 'ch12', type: 'mcq', difficulty: 2,
        kp: '12.3 Multivariate Gaussian and Weighted Least Squares', tags: ['compute'],
        stem: '设二维高斯分布的协方差矩阵 $\\Sigma=\\begin{bmatrix}4&0\\\\0&1\\end{bmatrix}$。其等密度线 $\\mathbf{x}^{\\mathsf T}\\Sigma^{-1}\\mathbf{x}=1$（椭圆）的两条半轴长度分别是？',
        options: [
          { text: '$4$ 和 $1$', correct: false },
          { text: '$2$ 和 $1$', correct: true },
          { text: '$16$ 和 $1$', correct: false },
          { text: '$2$ 和 $0.5$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$4$ 和 $1$ 是特征值，也就是方差；半轴长度要开平方。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。特征值为 $4$ 与 $1$，沿两个特征向量方向的半轴是 $\\sqrt{4}=2$ 与 $\\sqrt{1}=1$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$16$ 是 $4^2$，把方差又平方了一次，方向弄反了。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$0.5$ 来自 $\\sqrt{1/4}$，把第二半轴错当成了第一特征值倒数的开方。</span></div>"
      },
      {
        id: 'ch12-q19', ch: 'ch12', type: 'mcq', difficulty: 3,
        kp: '12.3 Multivariate Gaussian and Weighted Least Squares', tags: ['concept', 'trap'],
        stem: '用加权最小二乘处理 $m$ 组观测 $(b_i,\\mathbf{a}_i)$，权重为 $w_i$。若各次观测的误差相互独立、方差为 $\\sigma_i^2$，按统计理论应取？',
        options: [
          { text: '$w_i=\\sigma_i^2$，方差越大权重越大', correct: false },
          { text: '$w_i=1/\\sigma_i^2$，方差越小权重越大', correct: true },
          { text: '$w_i=1$，权重与误差大小无关', correct: false },
          { text: '$w_i=\\sigma_i$，权重与标准差成正比', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。这样会让噪声大的观测占更大比重，估计的方差反而增大，与「好数据多用力」相反。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$w_i=1/\\sigma_i^2$ 时加权估计达到最小方差（Gauss–Markov），精度高的观测被赋予更大权重。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。等权重只在同方差时才最优；方差不齐时它把低精度数据与高精度数据同等对待。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。权重应与方差成反比而不是与标准差成正比，用 $\\sigma_i$ 作权重也不满足最优性。</span></div>"
      },
      {
        id: 'ch12-q20', ch: 'ch12', type: 'mcq', difficulty: 3,
        kp: '12.3 Multivariate Gaussian and Weighted Least Squares', tags: ['compute'],
        stem: '设二维高斯分布的均值 $\\mu=(0,0)$，$\\Sigma=\\begin{bmatrix}2&0\\\\0&2\\end{bmatrix}$。在点 $\\mathbf{x}=(2,2)$ 处的二次型 $(\\mathbf{x}-\\mu)^{\\mathsf T}\\Sigma^{-1}(\\mathbf{x}-\\mu)=$？',
        options: [
          { text: '$2$', correct: false },
          { text: '$4$', correct: true },
          { text: '$8$', correct: false },
          { text: '$16$', correct: false }
        ],
        explain: "<div class='optExp'><b class='oeL'>A</b><span class='oeT'>错。$2$ 只算了其中一个分量的贡献 $\\frac12\\cdot2^2$，漏掉另一个分量。</span></div><div class='optExp ok'><b class='oeL'>B</b><span class='oeT'>对。$\\Sigma^{-1}=\\frac12 I$，故二次型为 $\\frac12(2^2+2^2)=\\frac12\\cdot8=4$。</span></div><div class='optExp'><b class='oeL'>C</b><span class='oeT'>错。$8$ 是 $\\mathbf{x}^{\\mathsf T}\\mathbf{x}=4+4$，没有乘上 $\\Sigma^{-1}$ 带来的因子 $\\frac12$。</span></div><div class='optExp'><b class='oeL'>D</b><span class='oeT'>错。$16$ 是把 $\\mathbf{x}^{\\mathsf T}\\mathbf{x}$ 又平方了一次，与二次型的定义不符。</span></div>"
      }
    ]
  };
  CSC._quizPack = PACK;
  return PACK;
})());
