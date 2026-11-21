/* =====================================================================
 * data/adv-analysis.js · 进阶专题 01
 * 分析基础与严格证明：把「显然」拆成一步都不能省的推理
 * 5 小节 · 只用静态 block（h/p/list/tex/steps/example/theorem/formula/
 * table/callout/compare/keypoint/checklist），不挂 lab / quiz。
 * 主线：Cauchy–Schwarz 三种证明 → 秩-零化度 → 投影矩阵刻画 →
 *       谱定理 → SVD 存在性。每一条都给出完整证明，不引用未证结论。
 * ===================================================================== */
CSC.registerAdvanced({
  id: "adv-analysis",
  order: 1,
  title: "分析基础与严格证明",
  en: "ANALYSIS & RIGOR",
  tagline: "把「显然」拆成一步都不能省的推理",
  level: "进阶",
  minutes: 100,
  prereq: ["ch01", "ch03", "ch04", "ch06", "ch07"],

  intro: "<p>主课程里你已经会用 Cauchy–Schwarz 判断夹角、用秩-零化度数维数、用投影公式做最小二乘、用谱定理和 SVD 解决实际问题。可如果追问一句「凭什么」，多数回答会卡住：公式是对的，但理由是什么？</p>"
    + "<p>这一篇只做一件事——把四个常用结论的证明完整写一遍：Cauchy–Schwarz 不等式、秩-零化度定理、投影矩阵的刻画、谱定理，最后收在 SVD 的存在性上。你会看到「严格」不是更难的公式，而是每一句话都能指出依据：这里用的是定义，那里用的是已证的定理，还有一步是逻辑。</p>"
    + "<p>读它不需要新知识，只需要你愿意在「我会做这道题」之外，再问一句「凭什么可以这样做」。第 4 章的最小二乘、第 6 章的对角化、第 7 章的 SVD，后面都会回到这里来取地基。</p>",

  goals: [
    "你能说清一段证明由「已知、变形、引用、结论」四部分组成，并指出一段话缺的是哪一环。",
    "你能用判别式法、正交分解法、拉格朗日恒等式三种办法证明 Cauchy–Schwarz，并说出每种办法暴露了哪层结构。",
    "你能完整复述秩-零化度定理的证明，特别是「基的延拓」与「无关性」两步。",
    "你能证明「对称且幂等」等价于「是到列空间的正交投影」，并用它推导最小二乘的正规方程。",
    "你能写出实对称矩阵正交对角化的归纳证明，并指出归纳假设用在哪里。",
    "你能从 A 的转置乘 A 的谱分解出发构造 SVD，并验证 U、V 的标准正交性与分解等式。"
  ],

  sections: [
    {
      id: "adv-analysis-s1",
      title: "证明的语法：从 Cauchy–Schwarz 说起",
      en: "THE GRAMMAR OF PROOF",
      minutes: 18,
      blocks: [
        { t: "callout", kind: "why", title: "这一节要解决什么问题", html: "主课程第 1 章用 Cauchy–Schwarz 保证余弦值不越界，你可能照着模板算过几道题。可这个不等式为什么成立？为什么等号只在共线时取到？这一节先看一个「直觉翻车」的例子，再把证明的骨架搭起来，最后用三种完全不同的办法证同一个不等式。" },

        { t: "p", html: "先看一个反例，它说明直觉有多不可靠。很多人第一次见到矩阵乘法，会默认 $AB=BA$。拿两个 $2\\times2$ 矩阵试一下：$A=\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}$，$B=\\begin{bmatrix}1&0\\\\1&1\\end{bmatrix}$。直接算：$AB=\\begin{bmatrix}2&1\\\\1&1\\end{bmatrix}$，而 $BA=\\begin{bmatrix}1&1\\\\1&2\\end{bmatrix}$。两个结果不同。" },

        { t: "p", html: "这个例子不复杂，却说明一件事：数学里的「显然」经常只是「我见过的例子都这样」。证明的作用不是让你相信，而是把「为什么对」拆成一串小到无法反驳的步骤。桥墩只有三种：<b>定义</b>（这句话到底是什么意思）、<b>已证的定理</b>（前人已经替你把这块板钉牢）、<b>逻辑规则</b>（由「所有 $A$ 都是 $B$」和「$x$ 是 $A$」推出「$x$ 是 $B$」）。除了这三种，别的都不能踩。" },

        { t: "callout", kind: "note", title: "证明与验算的区别", html: "验算是对一个具体例子算一遍，证明是对所有情况给一个理由。一个反例能推翻命题，一万个正例也不能证明它。所以「我试了好几个数都对」不是证明，只是还没有找到反例。" },

        { t: "p", html: "第一个要证的结论是 Cauchy–Schwarz 不等式。它在第 1 章出现过，当时是拿来保证 $\\cos\\theta$ 落在 $[-1,1]$ 之间。现在我们给它三个独立的证明，你会看到同一件事可以有三种完全不同的「抓手」。" },

        { t: "tex", tex: "\\lvert\\mathbf{u}\\cdot\\mathbf{v}\\rvert\\le\\lVert\\mathbf{u}\\rVert\\,\\lVert\\mathbf{v}\\rVert", caption: "Cauchy–Schwarz 不等式（$\\mathbf{u},\\mathbf{v}\\in\\mathbb{R}^n$）" },

        { t: "p", html: "证明一：判别式法。若 $\\mathbf{v}=\\mathbf{0}$，两边都是 $0$，不等式成立。否则考虑关于实数 $t$ 的二次函数 $f(t)=\\lVert\\mathbf{u}-t\\mathbf{v}\\rVert^2$。它对任意 $t$ 都非负，展开得 $f(t)=\\lVert\\mathbf{v}\\rVert^2t^2-2(\\mathbf{u}\\cdot\\mathbf{v})t+\\lVert\\mathbf{u}\\rVert^2$。一个开口向上的二次函数处处非负，判别式必须不大于零：$4(\\mathbf{u}\\cdot\\mathbf{v})^2-4\\lVert\\mathbf{u}\\rVert^2\\lVert\\mathbf{v}\\rVert^2\\le0$。两边开方即得结论。" },

        { t: "p", html: "证明二：正交分解法。把 $\\mathbf{u}$ 拆成沿 $\\mathbf{v}$ 方向的部分与垂直于 $\\mathbf{v}$ 的部分：令 $c=\\frac{\\mathbf{u}\\cdot\\mathbf{v}}{\\lVert\\mathbf{v}\\rVert^2}$，$\\mathbf{p}=c\\mathbf{v}$，$\\mathbf{e}=\\mathbf{u}-\\mathbf{p}$。直接验算 $\\mathbf{v}\\cdot\\mathbf{e}=\\mathbf{v}\\cdot\\mathbf{u}-c\\lVert\\mathbf{v}\\rVert^2=0$，所以 $\\mathbf{e}\\perp\\mathbf{v}$。于是 $\\lVert\\mathbf{u}\\rVert^2=\\lVert\\mathbf{p}\\rVert^2+\\lVert\\mathbf{e}\\rVert^2\\ge\\lVert\\mathbf{p}\\rVert^2=c^2\\lVert\\mathbf{v}\\rVert^2=\\frac{(\\mathbf{u}\\cdot\\mathbf{v})^2}{\\lVert\\mathbf{v}\\rVert^2}$，整理即得。" },

        { t: "p", html: "证明三：拉格朗日恒等式。对任意实数 $u_i,v_i$，有 $\\left(\\sum_i u_iv_i\\right)^2=\\left(\\sum_i u_i^2\\right)\\left(\\sum_i v_i^2\\right)-\\sum_{i\\lt j}(u_iv_j-u_jv_i)^2$。右边最后一项是非负数之和，所以左边不超过两个平方和的乘积。这个恒等式把「差值」直接写成了「面积的平方和」，一行展开就能验证。" },

        { t: "callout", kind: "tip", title: "三种证明各自暴露什么", html: "判别式法说明「不等式来自二次型的非负性」；正交分解法说明「不等式来自勾股定理」；拉格朗日恒等式说明「不等式来自二维面积公式」。同一结论，三种抓手——这正是数学里「理解一个定理」的常见样子：不是记住一句陈述，而是知道它可以从几个方向被推出来。" },

        { t: "p", html: "等号什么时候成立？判别式法里，等号意味着二次函数有重根，即存在 $t$ 使 $\\mathbf{u}=t\\mathbf{v}$；正交分解法里，等号意味着 $\\mathbf{e}=\\mathbf{0}$，也就是 $\\mathbf{u}$ 完全落在 $\\mathbf{v}$ 的方向上。两种说法一致：<b>等号当且仅当两个向量共线</b>。" },

        { t: "example", no: "1.1", tag: "用 Cauchy–Schwarz 证三角不等式", fields: [
          { k: "题目", html: "证明 $\\lVert\\mathbf{u}+\\mathbf{v}\\rVert\\le\\lVert\\mathbf{u}\\rVert+\\lVert\\mathbf{v}\\rVert$。" },
          { k: "思路", html: "两边平方，把左边展开成 $\\lVert\\mathbf{u}\\rVert^2+2\\mathbf{u}\\cdot\\mathbf{v}+\\lVert\\mathbf{v}\\rVert^2$，中间项用 Cauchy–Schwarz 控制。" },
          { k: "解答", html: "$\\lVert\\mathbf{u}+\\mathbf{v}\\rVert^2=\\lVert\\mathbf{u}\\rVert^2+2\\mathbf{u}\\cdot\\mathbf{v}+\\lVert\\mathbf{v}\\rVert^2\\le\\lVert\\mathbf{u}\\rVert^2+2\\lVert\\mathbf{u}\\rVert\\lVert\\mathbf{v}\\rVert+\\lVert\\mathbf{v}\\rVert^2=(\\lVert\\mathbf{u}\\rVert+\\lVert\\mathbf{v}\\rVert)^2$。两边开方（长度非负）即得。" },
          { k: "点评", html: "这一步只用了 Cauchy–Schwarz，没有用任何几何直觉。注意开方时要求两边都非负，这由范数的定义保证。" }
        ]},

        { t: "p", html: "再举两个「换工具」的例子。命题一：不存在 $n$ 阶实矩阵 $A,B$ 使 $AB-BA=I$——用迹一行解决，因为迹对交换子为 $0$，而 $\\operatorname{tr}(I)=n\\ne0$。命题二：任意一组线性无关的向量都能扩充成基——用构造法，每次挑一个不在当前张成里的向量，直到维数用完。前者用不变量（迹），后者用构造，都是「站在更高处看」的典型。" },

        { t: "p", html: "再补一个「严格」的常见战场：量词顺序。命题「对每个 $\\varepsilon\\gt0$，存在 $\\delta\\gt0$，使得……」与「存在 $\\delta\\gt0$，对每个 $\\varepsilon\\gt0$，使得……」看起来只差语序，意思完全不同：前者允许 $\\delta$ 随 $\\varepsilon$ 变，后者要求一个 $\\delta$ 通吃所有 $\\varepsilon$。极限定义用的是前者；一致连续与逐点连续的区别，也正好落在 $\\delta$ 能不能只依赖 $\\varepsilon$ 上。写证明时把量词写清楚，比多写十行推导更能防错。" },

        { t: "p", html: "最后说一个实用的写作习惯：证明可以分两段写。第一段是草稿，从结论倒推，问「要证这个，只需证什么」；第二段是正文，从已知正推，把草稿里的每一步按顺序补上理由。草稿里可以有「显然」「应该成立」这类话，正文里一句都不能留。很多人写证明卡住，不是不会推，而是把草稿直接当成了正文。" },

        { t: "p", html: "这就是「分析基础」的样子：不追求技巧，追求每一步都能指出依据。下面四节用同样的标准处理四个更大的结论：秩-零化度、投影矩阵、谱定理与 SVD。" }
      ]
    },

    {
      id: "adv-analysis-s2",
      title: "秩-零化度定理：把维数问题变成计数问题",
      en: "RANK-NULLITY, PROVED",
      minutes: 20,
      blocks: [
        { t: "callout", kind: "why", title: "这一节要解决什么问题", html: "秩-零化度定理 $\\dim N(A)+\\operatorname{rank}(A)=n$ 在第 3 章出现过，当时可能只是记住了一张表格。可它是全书最有用的计数工具：算维数、判可解性、理解 SVD 的零空间，全靠它。这一节把证明完整写一遍。" },

        { t: "p", html: "设 $A$ 是 $m\\times n$ 矩阵，秩为 $r$。定理说 $\\dim N(A)=n-r$。换个说法：$n$ 维输入被分成两部分，$r$ 维能到达输出，$n-r$ 维被压成零。这个「分成两部分」的图像，比公式本身更值得记住。" },

        { t: "p", html: "证明的想法很朴素：先找到被压成零的那部分（零空间的基），再把它们补齐成整个 $\\mathbb{R}^n$ 的基，然后数一数剩下的向量有几个——它们正好对应能到达的方向。下面是五步。" },

        { t: "steps", items: [
          { title: "第一步：取零空间的基", html: "零空间是子空间，设其维数为 $k$，取一组基 $\\mathbf{v}_1,\\dots,\\mathbf{v}_k$。这组向量线性无关，且 $A\\mathbf{v}_i=\\mathbf{0}$。" },
          { title: "第二步：延拓成整个空间的基", html: "由基延拓定理，可以再添 $n-k$ 个向量，使 $\\mathbf{v}_1,\\dots,\\mathbf{v}_n$ 成为 $\\mathbb{R}^n$ 的基。" },
          { title: "第三步：证明像向量张成列空间", html: "任意 $\\mathbf{x}=\\sum_{i=1}^n a_i\\mathbf{v}_i$，则 $A\\mathbf{x}=\\sum_{i=1}^n a_iA\\mathbf{v}_i=\\sum_{i=k+1}^n a_iA\\mathbf{v}_i$——前 $k$ 项被零空间吃掉。所以 $A\\mathbf{v}_{k+1},\\dots,A\\mathbf{v}_n$ 张成 $C(A)$。" },
          { title: "第四步：证明像向量线性无关", html: "若 $\\sum_{i=k+1}^n c_iA\\mathbf{v}_i=\\mathbf{0}$，则 $A\\left(\\sum_{i=k+1}^n c_i\\mathbf{v}_i\\right)=\\mathbf{0}$，即 $\\sum_{i=k+1}^n c_i\\mathbf{v}_i\\in N(A)$。而 $\\mathbf{v}_1,\\dots,\\mathbf{v}_n$ 整体是基，表示唯一，所以所有 $c_i=0$。" },
          { title: "第五步：数个数", html: "$C(A)$ 有一组含 $n-k$ 个向量的基，所以 $r=n-k$，即 $k=n-r$。" }
        ]},

        { t: "p", html: "第 2 步用到了一个这里没有展开的事实：任何线性无关组都能延拓成基。它的证明不难——只要还不能张成空间，就取一个不在当前张成里的向量添进去，无关性保持，而空间维数有限，所以有限步后必然张成。严格写出来要用「极大线性无关组」的语言，这里先接受它。" },

        { t: "callout", kind: "warn", title: "最容易含糊的一步", html: "第 4 步依赖「整体基的表示唯一」。如果 $\\sum c_i\\mathbf{v}_i$ 既能写成零空间基的组合，又出现在整体基的展开里，那么把两种写法相减，就得到整体基的一个线性关系；由基的无关性，所有系数为零。少了这句「表示唯一」，无关性的证明就悬空了。" },

        { t: "theorem", name: "秩-零化度定理", zh: "Rank–Nullity Theorem", rows: [
          { k: "白话", html: "矩阵把输入空间分成两块：能到达的那块维数等于秩，被压成零的那块维数等于零化度，两块加起来正好是输入的维数。" },
          { k: "条件", html: "$A$ 是 $m\\times n$ 实矩阵，$r=\\operatorname{rank}(A)$。" },
          { k: "结论", html: "$\\dim C(A)+\\dim N(A)=r+(n-r)=n$。" },
          { k: "证明", html: "取 $N(A)$ 的基并延拓成 $\\mathbb{R}^n$ 的基；像向量 $A\\mathbf{v}_{k+1},\\dots,A\\mathbf{v}_n$ 张成 $C(A)$ 且线性无关，所以 $r=n-k$。" }
        ]},

        { t: "table", head: ["子空间", "所在空间", "维数", "与谁正交"], rows: [
          ["$C(A)$", "$\\mathbb{R}^m$", "$r$", "$N(A^{\\mathsf T})$"],
          ["$N(A)$", "$\\mathbb{R}^n$", "$n-r$", "$C(A^{\\mathsf T})$"],
          ["$C(A^{\\mathsf T})$", "$\\mathbb{R}^n$", "$r$", "$N(A)$"],
          ["$N(A^{\\mathsf T})$", "$\\mathbb{R}^m$", "$m-r$", "$C(A)$"]
        ], caption: "四个基本子空间的维数与正交关系（线性代数基本定理）" },

        { t: "p", html: "这张表就是「线性代数基本定理」。注意两件事：第一，行空间与列空间维数相同，都是 $r$；第二，正交关系是成对的，$C(A)$ 与 $N(A^{\\mathsf T})$ 在同一个 $\\mathbb{R}^m$ 里，$C(A^{\\mathsf T})$ 与 $N(A)$ 在同一个 $\\mathbb{R}^n$ 里。跨空间的「正交」是没有定义的。" },

        { t: "p", html: "秩还有一个等价定义：列向量组中极大线性无关组所含向量的个数。它和「主元个数」等价，因为主元列恰好构成列空间的一组基。用哪个定义取决于场合：动手算的时候数主元，写证明的时候用「极大无关组」谈维数更方便。" },

        { t: "p", html: "顺带把「秩也等于行空间维数」补上。行变换不改变行空间：新行是旧行的线性组合，而旧行也能由新行还原，所以 $A$ 与它的简化行阶梯形 $R$ 有相同的行空间；而 $R$ 的非零行显然线性无关，个数正好是主元个数 $r$。于是行空间维数也是 $r$。这也是为什么 $C(A)$ 与 $C(A^{\\mathsf T})$ 维数相同，尽管它们住在不同的空间里。" },

        { t: "example", no: "2.1", tag: "具体矩阵验证", fields: [
          { k: "题目", html: "$A=\\begin{bmatrix}1&2&3&4\\\\2&4&6&8\\end{bmatrix}$，求秩与零空间维数，并写出零空间的一组基。" },
          { k: "思路", html: "第二行是第一行的 $2$ 倍，所以秩为 $1$；$n=4$，由秩-零化度定理零空间维数是 $3$。" },
          { k: "解答", html: "主元在第一列，自由变量是 $x_2,x_3,x_4$，方程化简为 $x_1+2x_2+3x_3+4x_4=0$。分别令 $(x_2,x_3,x_4)$ 取 $(1,0,0)$、$(0,1,0)$、$(0,0,1)$，得零空间的基 $(-2,1,0,0)$、$(-3,0,1,0)$、$(-4,0,0,1)$。" },
          { k: "点评", html: "秩 $1$ 加零化度 $3$ 正好等于 $4$。这也预告了 SVD：$A^{\\mathsf T}A$ 与 $A$ 有相同的秩，所以非零奇异值正好 $1$ 个。" }
        ]},

        { t: "p", html: "这条定理在 SVD 里还会再用一次：$A^{\\mathsf T}A$ 的非零特征值个数等于 $\\operatorname{rank}(A)$，而零特征值的个数等于 $\\dim N(A)=n-r$。换句话说，SVD 里「非零奇异值有 $r$ 个、零有 $n-r$ 个」这句话，就是秩-零化度定理的另一种写法。" },

        { t: "example", no: "2.2", tag: "秩 2 的 3×3 矩阵", fields: [
          { k: "题目", html: "$A=\\begin{bmatrix}1&2&3\\\\2&4&7\\\\3&6&10\\end{bmatrix}$，求秩与零空间维数，并写出零空间的一组基。" },
          { k: "思路", html: "做消元数主元；$n=3$，零化度就是 $3-r$。" },
          { k: "解答", html: "第二行减第一行的 $2$ 倍得 $(0,0,1)$；第三行减第一行的 $3$ 倍得 $(0,0,1)$，再减去第二行得零行。阶梯形有 $2$ 个主元，所以 $r=2$，零化度 $3-2=1$。回代：$x_3=0$，$x_1+2x_2=0$，取 $x_2=1$ 得 $x_1=-2$。零空间的基是 $(-2,1,0)$。" },
          { k: "点评", html: "把 $(-2,1,0)$ 代回原矩阵逐行验证：第一行 $-2+2+0=0$，第二行 $-4+4+0=0$，第三行 $-6+6+0=0$。写零空间基之前一定要代回验证，这是最省时间的自检。" }
        ]},

        { t: "p", html: "为什么这个证明值得反复看？因为它示范了一个通用套路：把「维数」问题翻译成「基的个数」问题，再用「基的表示唯一」把无关性证掉。后面 SVD 的存在性证明里，你会看到同一套路再来一次。" },

        { t: "p", html: "还有一个常见误解：$A\\mathbf{x}=\\mathbf{b}$ 有解时，解集不是子空间，但它的「大小」由零空间决定——自由变量每取一组值，就得到解集里的一个点，所以解集作为仿射空间的维数正好是 $n-r$。" }
      ]
    },

    {
      id: "adv-analysis-s3",
      title: "投影矩阵：一个公式的三条性质",
      en: "PROJECTION MATRICES",
      minutes: 20,
      blocks: [
        { t: "callout", kind: "why", title: "这一节要解决什么问题", html: "最小二乘是第 4 章的主角，核心是一个矩阵 $P=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}$。这个公式看起来复杂，其实只有三条性质在起作用：幂等、对称、值域是列空间。这一节把三条性质证出来，再证明它们反过来刻画了投影。" },

        { t: "p", html: "先把问题摆清楚。给定 $A$（$m\\times n$，列满秩）与 $\\mathbf{b}\\in\\mathbb{R}^m$，方程 $A\\mathbf{x}=\\mathbf{b}$ 一般无解。我们要在 $C(A)$ 里找离 $\\mathbf{b}$ 最近的点 $\\mathbf{p}$。几何直觉说：最近点就是「$\\mathbf{b}$ 到 $C(A)$ 的垂足」，也就是 $\\mathbf{b}-\\mathbf{p}$ 垂直于 $C(A)$。" },

        { t: "p", html: "把直觉写成方程：$\\mathbf{b}-\\mathbf{p}$ 要与 $A$ 的每一列正交，即 $A^{\\mathsf T}(\\mathbf{b}-A\\hat{\\mathbf{x}})=\\mathbf{0}$，整理得 $A^{\\mathsf T}A\\hat{\\mathbf{x}}=A^{\\mathsf T}\\mathbf{b}$。因为 $A$ 列满秩，$A^{\\mathsf T}A$ 可逆，于是 $\\hat{\\mathbf{x}}=(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}\\mathbf{b}$，投影 $\\mathbf{p}=A\\hat{\\mathbf{x}}=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}\\mathbf{b}$。" },

        { t: "tex", tex: "P=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T},\\qquad \\mathbf{p}=P\\mathbf{b}", caption: "到 $C(A)$ 的正交投影矩阵（$A$ 列满秩）" },

        { t: "p", html: "性质一：$P^2=P$。代入直接算：$P^2=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}=P$，中间用了 $A^{\\mathsf T}A(A^{\\mathsf T}A)^{-1}=I$。这条性质说明「投两次和投一次一样」。" },

        { t: "p", html: "性质二：$P^{\\mathsf T}=P$。因为 $A^{\\mathsf T}A$ 对称，它的逆也对称；转置整个式子，两个 $A$ 交换位置，中间那个逆不动，于是又回到原式。这条性质说明「投影是正交投影」，不是斜投影。" },

        { t: "p", html: "性质三：$C(P)=C(A)$。一方面 $P\\mathbf{x}=A\\left[(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}\\mathbf{x}\\right]$ 总在 $C(A)$ 里；另一方面，对 $C(A)$ 里的任意向量 $\\mathbf{y}=A\\mathbf{c}$，有 $P\\mathbf{y}=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}A\\mathbf{c}=A\\mathbf{c}=\\mathbf{y}$。所以 $C(A)$ 里每个向量都被 $P$ 固定，$P$ 的值域正好是 $C(A)$。" },

        { t: "p", html: "反过来更重要：<b>如果一个矩阵同时满足 $P^2=P$ 与 $P^{\\mathsf T}=P$，它一定是到 $C(P)$ 的正交投影。</b>证明只需把任意 $\\mathbf{b}$ 拆成 $P\\mathbf{b}+(I-P)\\mathbf{b}$，再验证第二块与 $C(P)$ 正交：对任意 $\\mathbf{x}$，$(P\\mathbf{x})^{\\mathsf T}(I-P)\\mathbf{b}=\\mathbf{x}^{\\mathsf T}P(I-P)\\mathbf{b}=\\mathbf{x}^{\\mathsf T}(P-P^2)\\mathbf{b}=0$。既然 $\\mathbf{b}$ 到 $C(P)$ 的垂足唯一，而 $P\\mathbf{b}$ 就是那个垂足，刻画成立。" },

        { t: "theorem", name: "投影矩阵的刻画", zh: "Characterization of Orthogonal Projection", rows: [
          { k: "白话", html: "一个矩阵是正交投影，当且仅当它「投两次不变」且「转置等于自己」。" },
          { k: "条件", html: "$P$ 是 $n\\times n$ 实矩阵。" },
          { k: "结论", html: "$P^2=P$ 且 $P^{\\mathsf T}=P$ $\\iff$ $P$ 是到 $C(P)$ 的正交投影。" },
          { k: "证明", html: "正向由上面三条性质；反向把 $\\mathbf{b}$ 拆成 $P\\mathbf{b}+(I-P)\\mathbf{b}$，验证第二块与 $C(P)$ 正交，再用垂足唯一性。" }
        ]},

        { t: "p", html: "这个刻画顺手解释了两件事。第一，$I-P$ 也是投影：$(I-P)^2=I-2P+P^2=I-P$，$(I-P)^{\\mathsf T}=I-P$。它投到 $C(P)$ 的正交补，也就是 $N(P)$。第二，投影只会让向量变短：因为 $\\mathbf{b}=P\\mathbf{b}+(I-P)\\mathbf{b}$ 且两块正交，勾股定理给出 $\\lVert\\mathbf{b}\\rVert^2=\\lVert P\\mathbf{b}\\rVert^2+\\lVert(I-P)\\mathbf{b}\\rVert^2\\ge\\lVert P\\mathbf{b}\\rVert^2$。" },

        { t: "p", html: "还有一条常被忽略的结论：$\\operatorname{rank}(P)=\\operatorname{rank}(A)$。因为 $C(P)=C(A)$，而秩等于列空间的维数。再补一条：$\\operatorname{tr}(P)=\\operatorname{rank}(P)$。$P$ 对称所以可正交对角化，$P^2=P$ 意味着每个特征值满足 $\\lambda^2=\\lambda$，即只能是 $0$ 或 $1$；$1$ 的个数就是秩，而迹等于特征值之和。统计里说「一个投影占用了几维」，用的就是这个数。" },

        { t: "example", no: "3.1", tag: "投影到一条直线", fields: [
          { k: "题目", html: "把 $\\mathbf{b}=(1,2,3)$ 投影到 $\\mathbf{a}=(1,1,1)$ 张成的直线上，求投影、误差与最小距离。" },
          { k: "思路", html: "一维投影矩阵是 $P=\\frac{\\mathbf{a}\\mathbf{a}^{\\mathsf T}}{\\mathbf{a}^{\\mathsf T}\\mathbf{a}}$。" },
          { k: "解答", html: "$\\mathbf{a}^{\\mathsf T}\\mathbf{a}=3$，$\\mathbf{a}\\mathbf{a}^{\\mathsf T}$ 是三行三列全 $1$ 矩阵，所以 $P=\\frac13J$。$P\\mathbf{b}=\\frac13(6,6,6)=(2,2,2)$。误差 $\\mathbf{e}=\\mathbf{b}-P\\mathbf{b}=(-1,0,1)$，验算 $\\mathbf{a}\\cdot\\mathbf{e}=-1+0+1=0$。$\\lVert\\mathbf{e}\\rVert=\\sqrt2$，所以最小距离是 $\\sqrt2$。" },
          { k: "点评", html: "三维里用公式算，比画图可靠；验算「误差与方向正交」是必须做的一步。" }
        ]},

        { t: "example", no: "3.2", tag: "最小二乘拟合直线", fields: [
          { k: "题目", html: "用直线 $y=c_0+c_1t$ 拟合三点 $(0,1)$、$(1,2)$、$(2,4)$，求最小二乘解与残差平方和。" },
          { k: "思路", html: "把问题写成 $A\\mathbf{c}=\\mathbf{b}$，其中 $A$ 的第一列是全 $1$、第二列是 $t$ 的取值。" },
          { k: "解答", html: "$A=\\begin{bmatrix}1&0\\\\1&1\\\\1&2\\end{bmatrix}$，$\\mathbf{b}=(1,2,4)$。$A^{\\mathsf T}A=\\begin{bmatrix}3&3\\\\3&5\\end{bmatrix}$，$A^{\\mathsf T}\\mathbf{b}=(7,10)$。解方程组得 $c_1=\\frac32$、$c_0=\\frac56$。拟合值 $\\left(\\frac56,\\frac73,\\frac{23}{6}\\right)$，残差 $\\left(\\frac16,-\\frac13,\\frac16\\right)$，残差平方和 $\\frac{1}{36}+\\frac19+\\frac{1}{36}=\\frac16$。" },
          { k: "点评", html: "验算残差与 $A$ 的两列都正交：$\\frac16-\\frac13+\\frac16=0$，$0\\cdot\\frac16+1\\cdot\\left(-\\frac13\\right)+2\\cdot\\frac16=0$。手算保留分数比写小数干净得多，也能让「正交」这一步一眼看出。" }
        ]},

        { t: "callout", kind: "warn", title: "两个高频错误", html: "最常见的错是把投影矩阵写成 $AA^{\\mathsf T}$：它连维数都对不上，也不满足幂等性，根本不是投影。另一个常见错是列不满秩时硬用 $(A^{\\mathsf T}A)^{-1}$——这时 $A^{\\mathsf T}A$ 不可逆，最小二乘解不唯一，要用伪逆 $A^{+}$。" },

        { t: "p", html: "投影矩阵还有一个统计读法：$P$ 把观测向量 $\\mathbf{b}$ 分成「模型能解释的部分」$P\\mathbf{b}$ 与「残差」$(I-P)\\mathbf{b}$，两者正交，所以 $\\lVert\\mathbf{b}\\rVert^2=\\lVert P\\mathbf{b}\\rVert^2+\\lVert(I-P)\\mathbf{b}\\rVert^2$。这正是回归分析里「总平方和 = 回归平方和 + 残差平方和」的几何版本，而 $R^2$ 就是前一项所占的比例。" },

        { t: "p", html: "最后回到最小二乘的几何图像：$\\mathbf{b}$ 被拆成「列空间里的投影」与「垂直于列空间的误差」两块，前者是能解释的部分，后者是残差。拟合直线的「残差平方和最小」，说的就是误差这一块的长度最小。" }
      ]
    },

    {
      id: "adv-analysis-s4",
      title: "对称矩阵为什么能正交对角化",
      en: "THE SPECTRAL THEOREM",
      minutes: 22,
      blocks: [
        { t: "callout", kind: "why", title: "这一节要解决什么问题", html: "谱定理说：实对称矩阵一定能正交对角化。这句话在第 6 章出现时，你可能只是接受了它。可它并不显然：为什么「对称」这个条件刚好够？为什么特征向量能选成互相正交？这一节给出完整证明。" },

        { t: "p", html: "定理：设 $A$ 是 $n\\times n$ 实对称矩阵（$A^{\\mathsf T}=A$），则存在正交矩阵 $Q$ 与对角矩阵 $\\Lambda$，使 $A=Q\\Lambda Q^{\\mathsf T}$。等价说法：存在 $n$ 个两两正交的单位特征向量。" },

        { t: "p", html: "证明分三步：特征值为实、不同特征值的特征向量正交、用归纳法造出 $n$ 个正交特征向量。前两步是局部性质，第三步才是关键。" },

        { t: "p", html: "第一步：特征值为实数。设 $A\\mathbf{x}=\\lambda\\mathbf{x}$，其中 $\\mathbf{x}\\ne\\mathbf{0}$ 允许是复向量。两边左乘 $\\mathbf{x}^{\\mathsf H}$，得 $\\mathbf{x}^{\\mathsf H}A\\mathbf{x}=\\lambda\\mathbf{x}^{\\mathsf H}\\mathbf{x}$。左边是一个复数，但它的共轭等于 $\\mathbf{x}^{\\mathsf H}A^{\\mathsf T}\\mathbf{x}=\\mathbf{x}^{\\mathsf H}A\\mathbf{x}$（用了 $A$ 实对称），所以左边是实数；右边 $\\mathbf{x}^{\\mathsf H}\\mathbf{x}$ 是正实数。于是 $\\lambda$ 是实数。" },

        { t: "p", html: "第二步：不同特征值的特征向量正交。设 $A\\mathbf{x}=\\lambda\\mathbf{x}$，$A\\mathbf{y}=\\mu\\mathbf{y}$，$\\lambda\\ne\\mu$。则 $\\lambda\\mathbf{x}^{\\mathsf T}\\mathbf{y}=(A\\mathbf{x})^{\\mathsf T}\\mathbf{y}=\\mathbf{x}^{\\mathsf T}A^{\\mathsf T}\\mathbf{y}=\\mathbf{x}^{\\mathsf T}A\\mathbf{y}=\\mu\\mathbf{x}^{\\mathsf T}\\mathbf{y}$。移项得 $(\\lambda-\\mu)\\mathbf{x}^{\\mathsf T}\\mathbf{y}=0$，因为 $\\lambda\\ne\\mu$，所以 $\\mathbf{x}^{\\mathsf T}\\mathbf{y}=0$。" },

        { t: "p", html: "第三步：归纳。$n=1$ 时显然成立。设对 $n-1$ 成立。取 $A$ 的一个单位特征向量 $\\mathbf{q}_1$——它存在，因为特征多项式在复数域里有根，而上一步已经证明根是实数。令 $W=\\mathbf{q}_1^{\\perp}$，即所有与 $\\mathbf{q}_1$ 正交的向量组成的子空间，维数是 $n-1$。" },

        { t: "p", html: "关键观察：$A$ 把 $W$ 映到 $W$ 自身。若 $\\mathbf{w}\\in W$，则 $\\mathbf{q}_1^{\\mathsf T}(A\\mathbf{w})=(A\\mathbf{q}_1)^{\\mathsf T}\\mathbf{w}=\\lambda_1\\mathbf{q}_1^{\\mathsf T}\\mathbf{w}=0$，所以 $A\\mathbf{w}\\in W$。于是 $A$ 在 $W$ 上是一个 $(n-1)$ 维的实对称变换（对称性从 $A$ 继承），由归纳假设，$W$ 里存在 $n-1$ 个两两正交的单位特征向量。加上 $\\mathbf{q}_1$，就得到 $n$ 个。" },

        { t: "steps", items: [
          { title: "第一步：实特征值", html: "用 $\\mathbf{x}^{\\mathsf H}A\\mathbf{x}$ 是实数，推出 $\\lambda$ 是实数。" },
          { title: "第二步：不同特征值正交", html: "比较 $(A\\mathbf{x})^{\\mathsf T}\\mathbf{y}$ 的两种算法，得到 $(\\lambda-\\mu)\\mathbf{x}^{\\mathsf T}\\mathbf{y}=0$。" },
          { title: "第三步：取一个特征向量", html: "取单位特征向量 $\\mathbf{q}_1$，考虑正交补 $W=\\mathbf{q}_1^{\\perp}$。" },
          { title: "第四步：验证不变性", html: "证明 $A(W)\\subseteq W$，这样归纳假设才能用在 $W$ 上。" },
          { title: "第五步：归纳收尾", html: "在 $W$ 上找到 $n-1$ 个正交特征向量，连同 $\\mathbf{q}_1$ 一起构成标准正交特征基。" }
        ]},

        { t: "theorem", name: "谱定理（实对称版）", zh: "Spectral Theorem", rows: [
          { k: "白话", html: "对称矩阵在某个「不歪斜」的坐标系里只是分别拉伸各轴，而且这些轴可以选成互相垂直的单位向量。" },
          { k: "条件", html: "$A$ 是 $n\\times n$ 实矩阵且 $A^{\\mathsf T}=A$。" },
          { k: "结论", html: "存在正交矩阵 $Q$ 与对角矩阵 $\\Lambda$，使 $A=Q\\Lambda Q^{\\mathsf T}$。" },
          { k: "证明", html: "实特征值 + 不同特征值正交 + 在正交补上归纳。" }
        ]},

        { t: "tex", tex: "A=Q\\Lambda Q^{\\mathsf T}=\\sum_{i=1}^n\\lambda_i\\mathbf{q}_i\\mathbf{q}_i^{\\mathsf T}", caption: "谱分解：对称矩阵是一组正交秩 1 投影的加权和" },

        { t: "p", html: "最后这个求和形式叫谱分解。每一项 $\\mathbf{q}_i\\mathbf{q}_i^{\\mathsf T}$ 是一个秩 1 的投影矩阵（投到 $\\mathbf{q}_i$ 张成的直线上），所以谱分解说的是：对称矩阵是一组互相正交的投影按特征值加权相加。这也解释了为什么对称矩阵的「行为」完全由特征值和特征方向决定。" },

        { t: "p", html: "谱定理还有一个直接推论，叫主轴定理：二次型 $\\mathbf{x}^{\\mathsf T}A\\mathbf{x}$ 在正交变换 $\\mathbf{x}=Q\\mathbf{y}$ 下变成 $\\sum_i\\lambda_iy_i^2$。于是正定与否一眼可判：所有 $\\lambda_i\\gt0$ 就是正定，有正有负就是不定，全非负就是半正定。第 6 章用配方法和主子式判正定，本质都是在算这组特征值的符号。" },

        { t: "p", html: "为什么必须强调「正交」而不只是「可对角化」？因为正交矩阵的逆就是转置，数值上极其稳定；而且正交特征向量给出了一组「不歪斜」的坐标系，二次型的正负、主方向都能直接读出来。这就是第 6 章用特征值判正定的理论依据。" },

        { t: "example", no: "4.1", tag: "2×2 对称矩阵正交对角化", fields: [
          { k: "题目", html: "对 $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$ 做正交对角化。" },
          { k: "思路", html: "先解特征方程，再单位化特征向量。" },
          { k: "解答", html: "$\\det(A-\\lambda I)=(2-\\lambda)^2-1=(\\lambda-1)(\\lambda-3)$，特征值为 $1$ 与 $3$。$\\lambda=1$ 时 $A-I=\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$，特征向量 $(1,-1)$；$\\lambda=3$ 时 $A-3I=\\begin{bmatrix}-1&1\\\\1&-1\\end{bmatrix}$，特征向量 $(1,1)$。单位化得 $\\mathbf{q}_1=(1,1)/\\sqrt2$，$\\mathbf{q}_2=(1,-1)/\\sqrt2$。于是 $Q=\\frac{1}{\\sqrt2}\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}$，$Q\\Lambda Q^{\\mathsf T}=A$。" },
          { k: "点评", html: "两个特征向量自动正交（因为特征值不同），这是对称矩阵的特权；验算 $Q^{\\mathsf T}Q=I$ 与 $Q\\Lambda Q^{\\mathsf T}=A$ 各一遍。" }
        ]},

        { t: "callout", kind: "note", title: "复矩阵的版本", html: "把「实对称」换成「Hermite（$A^{\\mathsf H}=A$）」、「正交」换成「酉」，谱定理照样成立：Hermite 矩阵可以被酉矩阵对角化，特征值全为实数。证明几乎逐字照搬，只需把转置换成共轭转置、把 $\\mathbf{x}^{\\mathsf T}$ 换成 $\\mathbf{x}^{\\mathsf H}$。第 9 章讲复矩阵时用的就是这一版。" },

        { t: "callout", kind: "warn", title: "归纳法里最容易漏的一步", html: "是「$A$ 把 $W$ 映到自身」。没有它，$W$ 上的限制没有定义，归纳就接不上。另一个坑：特征值可能重复，但第二步只处理「不同特征值」的情形，重复的情况交给第三步——在正交补里继续找，直到找满 $n$ 个。" },

        { t: "p", html: "谱定理还给出正定性的另一条判据：对称矩阵正定当且仅当所有特征值大于 $0$。这条判据和「所有顺序主子式大于 $0$」等价，但证明路径不同：前者走正交对角化，后者走消元与 Schur 补。两条路都值得会，因为不同题目给的信息不一样。" },

        { t: "p", html: "谱定理还有一个数值上的好处：正交变换不放大误差。计算 $Q\\Lambda Q^{\\mathsf T}$ 时，每一步的舍入误差都被限制在原量级，不会像非正交变换那样被放大。所以对称矩阵的特征值问题在数值上「好惹」，一般矩阵则要绕道 Schur 形去处理。" },

        { t: "p", html: "顺带回答一个常见疑问：非对称矩阵能不能正交对角化？一般不能。例如 $\\begin{bmatrix}0&1\\\\0&0\\end{bmatrix}$ 根本不可对角化；$\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}$ 可对角化，但特征值是 $\\pm i$，特征向量是复的。对称性才是「正交」二字的真正来源。" }
      ]
    },

    {
      id: "adv-analysis-s5",
      title: "SVD 存在性：从 A 的转置乘 A 出发",
      en: "EXISTENCE OF THE SVD",
      minutes: 20,
      blocks: [
        { t: "callout", kind: "why", title: "这一节要解决什么问题", html: "SVD 说任何矩阵都能写成 $U\\Sigma V^{\\mathsf T}$。第 7 章给了算法：对 $A^{\\mathsf T}A$ 求特征分解。可为什么这样做一定得到 SVD？为什么 $U$ 的列也是标准正交的？这一节把存在性证明补完。" },

        { t: "p", html: "设 $A$ 是 $m\\times n$ 矩阵，秩为 $r$。目标是找到正交矩阵 $U$（$m\\times m$）、$V$（$n\\times n$）与非负对角矩阵 $\\Sigma$（$m\\times n$），使 $A=U\\Sigma V^{\\mathsf T}$。" },

        { t: "p", html: "第一步：$A^{\\mathsf T}A$ 是对称半正定的。对称显然；半正定因为 $\\mathbf{x}^{\\mathsf T}A^{\\mathsf T}A\\mathbf{x}=\\lVert A\\mathbf{x}\\rVert^2\\ge0$。由谱定理，存在标准正交特征向量 $\\mathbf{v}_1,\\dots,\\mathbf{v}_n$ 与实数特征值 $\\lambda_1\\ge\\cdots\\ge\\lambda_n\\ge0$。" },

        { t: "p", html: "第二步：非零特征值正好有 $r$ 个。$\\lambda_i=0$ 当且仅当 $A\\mathbf{v}_i=\\mathbf{0}$（因为 $\\lVert A\\mathbf{v}_i\\rVert^2=\\mathbf{v}_i^{\\mathsf T}A^{\\mathsf T}A\\mathbf{v}_i=\\lambda_i$），而 $A\\mathbf{x}=\\mathbf{0}$ 的解空间维数是 $n-r$（秩-零化度定理）。所以恰有 $n-r$ 个零特征值，非零的正好 $r$ 个。" },

        { t: "p", html: "第三步：构造 $U$ 的前 $r$ 列。令 $\\sigma_i=\\sqrt{\\lambda_i}$，对 $i=1,\\dots,r$ 定义 $\\mathbf{u}_i=\\frac{A\\mathbf{v}_i}{\\sigma_i}$。先验证它们是单位向量：$\\lVert\\mathbf{u}_i\\rVert^2=\\frac{\\mathbf{v}_i^{\\mathsf T}A^{\\mathsf T}A\\mathbf{v}_i}{\\sigma_i^2}=\\frac{\\lambda_i}{\\lambda_i}=1$。再验证两两正交：$\\mathbf{u}_i^{\\mathsf T}\\mathbf{u}_j=\\frac{\\mathbf{v}_i^{\\mathsf T}A^{\\mathsf T}A\\mathbf{v}_j}{\\sigma_i\\sigma_j}=\\frac{\\lambda_j\\mathbf{v}_i^{\\mathsf T}\\mathbf{v}_j}{\\sigma_i\\sigma_j}$，当 $i\\ne j$ 时因 $\\mathbf{v}_i\\perp\\mathbf{v}_j$ 而为零。" },

        { t: "p", html: "第四步：补全正交基。把 $\\mathbf{u}_1,\\dots,\\mathbf{u}_r$ 补成 $\\mathbb{R}^m$ 的标准正交基，得到 $U$ 的全部列；$\\mathbf{v}_1,\\dots,\\mathbf{v}_n$ 本身已经是 $\\mathbb{R}^n$ 的标准正交基，直接作为 $V$ 的列。" },

        { t: "p", html: "第五步：验证 $A=U\\Sigma V^{\\mathsf T}$。两边都是矩阵，只要验证它们在基 $\\mathbf{v}_1,\\dots,\\mathbf{v}_n$ 上作用相同即可。对 $i\\le r$：$U\\Sigma V^{\\mathsf T}\\mathbf{v}_i=U\\Sigma\\mathbf{e}_i=\\sigma_i\\mathbf{u}_i=A\\mathbf{v}_i$。对 $i\\gt r$：$\\lambda_i=0$，所以 $A\\mathbf{v}_i=\\mathbf{0}$，而 $\\Sigma\\mathbf{e}_i=\\mathbf{0}$，两边也相等。既然两组矩阵在基上一致，它们就相等。" },

        { t: "theorem", name: "SVD 存在性定理", zh: "Existence of the Singular Value Decomposition", rows: [
          { k: "白话", html: "任何矩阵都能拆成「旋转（或镜像）× 沿坐标轴拉伸 × 旋转」三件事的复合，而且两个旋转都是正交的。" },
          { k: "条件", html: "$A$ 是任意 $m\\times n$ 实矩阵。" },
          { k: "结论", html: "存在正交矩阵 $U,V$ 与非负对角矩阵 $\\Sigma$，使 $A=U\\Sigma V^{\\mathsf T}$。" },
          { k: "证明", html: "对 $A^{\\mathsf T}A$ 用谱定理；用 $\\mathbf{u}_i=A\\mathbf{v}_i/\\sigma_i$ 构造 $U$ 的前 $r$ 列并验证标准正交；补全基后在基上验证等式。" }
        ]},

        { t: "tex", tex: "A=U\\Sigma V^{\\mathsf T}=\\sum_{i=1}^r\\sigma_i\\mathbf{u}_i\\mathbf{v}_i^{\\mathsf T}", caption: "SVD 与秩 1 展开（$r=\\operatorname{rank}(A)$）" },

        { t: "p", html: "这个证明是构造性的：它同时给出了算法——先对 $A^{\\mathsf T}A$ 做特征分解，再算 $\\mathbf{u}_i=A\\mathbf{v}_i/\\sigma_i$，最后补全正交基。实际计算当然不会真的去算 $A^{\\mathsf T}A$（那会把条件数平方），而是用双对角化或 Jacobi 方法，但数学上的存在性就来自这里。" },

        { t: "example", no: "5.1", tag: "一个秩 1 矩阵的 SVD", fields: [
          { k: "题目", html: "求 $A=\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$ 的 SVD。" },
          { k: "思路", html: "先算 $A^{\\mathsf T}A$，再按公式构造 $V$、$\\Sigma$、$U$。" },
          { k: "解答", html: "$A^{\\mathsf T}A=\\begin{bmatrix}5&10\\\\10&20\\end{bmatrix}$，秩为 $1$，特征值是 $25$ 与 $0$。$\\lambda_1=25$ 对应 $\\mathbf{v}_1=(1,2)/\\sqrt5$；$\\lambda_2=0$ 对应 $\\mathbf{v}_2=(2,-1)/\\sqrt5$。$\\sigma_1=5$，$\\mathbf{u}_1=A\\mathbf{v}_1/5=\\frac{1}{5\\sqrt5}(5,10)=(1,2)/\\sqrt5$。补一个与 $\\mathbf{u}_1$ 正交的单位向量 $\\mathbf{u}_2=(2,-1)/\\sqrt5$。于是 $A=5\\mathbf{u}_1\\mathbf{v}_1^{\\mathsf T}$。" },
          { k: "点评", html: "秩 1 矩阵的 SVD 只有一项。验算 $5\\mathbf{u}_1\\mathbf{v}_1^{\\mathsf T}=5\\cdot\\frac15\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}=A$。这里 $\\mathbf{u}_1=\\mathbf{v}_1$ 是巧合——这个矩阵恰好对称。" }
        ]},

        { t: "p", html: "实际计算里更常用的是经济型 SVD：只保留 $U$ 的前 $r$ 列、$V$ 的前 $r$ 列与 $\\Sigma$ 的前 $r$ 个奇异值，写成 $A=U_r\\Sigma_rV_r^{\\mathsf T}$。它和完整 SVD 在数学上等价，但存储与运算都省得多。第 7 章的图像压缩、PCA 与伪逆，用的都是这个版本；再截断到前 $k\\lt r$ 项，就得到最优的低秩近似。" },

        { t: "callout", kind: "warn", title: "三个高频错误", html: "把 $\\sigma_i$ 当成 $A$ 的特征值（它们是 $A^{\\mathsf T}A$ 特征值的平方根）；用 $AA^{\\mathsf T}$ 求 $V$（应该用 $A^{\\mathsf T}A$ 求 $V$、用 $AA^{\\mathsf T}$ 求 $U$，两者不能混）；忘了 $U$ 要补到 $m$ 维、$V$ 要补到 $n$ 维。" },

        { t: "p", html: "存在性证明的另一层意义是：它告诉我们「为什么任何矩阵都有 SVD」。答案不是巧合，而是 $A^{\\mathsf T}A$ 一定对称半正定，而对称半正定矩阵一定有正交特征基——这是谱定理保证的。所以 SVD 的普适性，本质上是谱定理的普适性。" },

        { t: "p", html: "实际求 SVD 不会真的形成 $A^{\\mathsf T}A$，而是先把 $A$ 双对角化（用 Householder 变换从左右两侧消元），再对双对角矩阵做隐式 QR 迭代。整个过程只做正交变换，条件数不会被平方，误差控制得很好。这就是为什么第 7 章给的算法与这一节的证明「方向一致、细节不同」。" },

        { t: "p", html: "最后点一下：这个证明用到的工具只有两个——谱定理与秩-零化度定理，而这两条恰好是前面两节证过的。所以「严格」不是一堆孤立的技术，它是一张互相支撑的网：Cauchy–Schwarz 撑起角度，秩-零化度撑起维数，谱定理撑起对称，SVD 再把它们收拢成对任意矩阵都成立的分解。" }
      ]
    }
  ],

  checklist: { id: "adv-analysis-check", items: [
    "你能说清「验算」与「证明」的区别，并举出一个「一万个正例也不能证明」的例子吗？",
    "你能不看书写出 Cauchy–Schwarz 的判别式法证明，并说明等号条件吗？",
    "秩-零化度定理的证明里，「基的延拓」和「像向量无关」各自用了什么事实？",
    "你能证明「对称 + 幂等」的矩阵一定是到其列空间的正交投影吗？",
    "谱定理的归纳证明里，为什么必须先证 $A(W)\\subseteq W$？",
    "SVD 存在性证明中，$\\mathbf{u}_i$ 的标准正交性是怎么验证的？"
  ] },

  keypoint: { items: [
    { title: "证明有语法", html: "已知、变形、引用、结论；能踩的只有定义、已证定理、逻辑规则。" },
    { title: "不等式靠非负性", html: "Cauchy–Schwarz 的三个证明分别来自二次型非负、勾股定理、面积恒等式。" },
    { title: "维数靠基计数", html: "把「维数」翻译成「基的个数」，再用表示唯一证无关性。" },
    { title: "投影靠两条性质", html: "$P^2=P$ 与 $P^{\\mathsf T}=P$ 刻画了正交投影，正规方程由此而来。" },
    { title: "对称靠归纳", html: "实特征值 + 不同特征值正交 + 在正交补上归纳，三步缺一不可。" },
    { title: "SVD 靠谱定理", html: "对 $A^{\\mathsf T}A$ 用谱定理，再构造 $U$ 并补全基，存在性就落地了。" }
  ] },

  finish: "<p>读到这里，你不必记住每个证明的细节，但要记住三件事：证明是把「为什么对」拆成可检验的小步；每一步都要能指出依据；很多结论的证明只用到前一节的结论，所以数学是一张网，不是一串公式。</p>"
    + "<p>建议你合上页面，拿一张白纸，把秩-零化度定理和谱定理各默写一遍。写完再回主课程第 3 章与第 6 章看那两页，你会发现它们变短了——不是字变少了，而是每个符号后面都站着一句你能解释的话。之后读下一篇<a href='#/advanced/adv-proof'>证明与构造</a>，那里会把这套语法用到分块矩阵、行列式公理与若尔当形上。</p>"
});
