/* =====================================================================
 * data/adv-proof.js · 进阶专题 02
 * 证明与构造：线性代数的严格地基
 * 5 小节 · 只用静态 block（不挂 lab / quiz / calc / code）
 * 主线：同一命题的多种证明 → 行列式的公理刻画 → Schur 补 →
 *       Schur 三角化与 Jordan 形 → 伪逆的构造与 Penrose 条件。
 * 所有定理只引用本篇或主课程已证的结论，不编造出处。
 * ===================================================================== */
CSC.registerAdvanced({
  id: "adv-proof",
  order: 2,
  title: "证明与构造",
  en: "PROOF & CONSTRUCTION",
  tagline: "从公理出发，把矩阵拆开再拼回去",
  level: "进阶",
  minutes: 95,
  prereq: ["ch02", "ch05", "ch06", "ch07"],

  intro: "<p>上一篇<a href='#/advanced/adv-analysis'>分析基础与严格证明</a>教的是「怎么把一句话证严」。这一篇换一个角度：当你手里没有现成公式时，怎么<b>构造</b>出想要的对象——一个分解、一个标准形、一个「逆」的替代品。</p>"
    + "<p>我们会做四件事：先看同一命题的几种证明，理解「换工具」比「多做题」有用；再用三条公理重新定义行列式，你会看到 $\\det(AB)=\\det(A)\\det(B)$ 其实是公理的推论；然后用 Schur 补把分块矩阵「消元」，一举得到分块求逆、行列式与正定判据；最后走到不能对角化的矩阵——Schur 三角化、Jordan 形，以及把「逆」推广到任意矩阵的伪逆。</p>"
    + "<p>这一篇的难度比上一篇高半档：证明更长，但用的工具仍然只有那几件——基、秩、正交、谱定理。每遇到一个新结论，先问「它依赖前面哪一条」，你会发现自己其实一直在同一张网上移动。</p>",

  goals: [
    "你能对同一个命题给出两种以上证明，并说清每种证明用到的核心工具。",
    "你能用三条公理推出行列式的其余性质，并解释为什么公理刻画是唯一的。",
    "你能写出 Schur 补的分解式，并用它计算分块行列式与判断分块矩阵的正定性。",
    "你能陈述 Schur 三角化与 Jordan 形定理，并用若尔当块计算矩阵幂与矩阵指数。",
    "你能从 SVD 构造伪逆，逐条验证四条 Penrose 条件，并说明它为什么给出最小范数最小二乘解。"
  ],

  sections: [
    {
      id: "adv-proof-s1",
      title: "同一命题的多种证明：换工具比多做题有用",
      en: "MANY PROOFS, ONE TRUTH",
      minutes: 18,
      blocks: [
        { t: "callout", kind: "why", title: "这一节要解决什么问题", html: "证明题做不出来，很多时候不是「不会推」，而是「选错了工具」。同一个命题，用定义硬推可能三页纸，用秩或特征值两行就完。这一节拿四个命题当靶子，每个给两种以上证明，让你看到工具之间的差别。" },

        { t: "p", html: "先立一条原则：<b>证明的难易取决于你站在哪个高度</b>。站在定义上，你只能逐分量算；站在秩上，你数维数；站在谱定理上，你只看特征值。高度越高，证明越短，但可用的前提也越少——所以真正的高手不是只会用高处的工具，而是知道什么时候该退回去。" },

        { t: "p", html: "靶子一：若 $A$ 可逆且 $AB=0$，则 $B=0$。证明只有一行：两边左乘 $A^{-1}$，得 $B=A^{-1}0=0$。这里没有技巧，用的是「可逆」的定义。它的反证版本是：若 $B\\ne0$，则存在非零列 $\\mathbf{b}$ 使 $A\\mathbf{b}=\\mathbf{0}$，与 $A$ 可逆矛盾。两种写法等价，但反证版本暴露了「可逆 = 零空间只有零向量」这个结构。" },

        { t: "p", html: "靶子二：不存在 $n\\times n$ 矩阵 $A,B$ 使 $AB-BA=I$。这个命题用分量硬算会陷入 $n^2$ 个方程的泥潭，但用迹一行就完：$\\operatorname{tr}(AB-BA)=\\operatorname{tr}(AB)-\\operatorname{tr}(BA)=0$，而 $\\operatorname{tr}(I)=n\\ne0$。迹是相似不变量，也是「交换子」的天然杀手。" },

        { t: "p", html: "靶子三：$\\operatorname{rank}(AB)\\le\\min(\\operatorname{rank}A,\\operatorname{rank}B)$。证明用两个观察。第一，$C(AB)\\subseteq C(A)$：$AB\\mathbf{x}=A(B\\mathbf{x})$ 总在 $C(A)$ 里，所以 $\\operatorname{rank}(AB)\\le\\operatorname{rank}(A)$。第二，对转置用同一条：$\\operatorname{rank}(AB)=\\operatorname{rank}((AB)^{\\mathsf T})=\\operatorname{rank}(B^{\\mathsf T}A^{\\mathsf T})\\le\\operatorname{rank}(B^{\\mathsf T})=\\operatorname{rank}(B)$。两条合起来就是结论。这里没有算任何分量，只用了「列空间包含」与「秩等于转置的秩」。" },

        { t: "p", html: "还有一个常被低估的工具：<b>归纳法</b>。线性代数里凡是要对维数 $n$ 下结论的命题，几乎都可以用归纳。比如「$n$ 阶范德蒙德行列式等于所有 $x_j-x_i$（$i\\lt j$）的乘积」：$n=2$ 时直接验证；一般情形用第 $i$ 行减去第 $i-1$ 行的 $x_1$ 倍，把第一列化成只剩一个非零元，再按第一列展开，剩下一个 $n-1$ 阶的同类行列式。归纳假设一套，结论就出来了。这个套路和后面 Schur 三角化的证明一模一样：先处理第一列，再把问题降一维。" },

        { t: "p", html: "再看一个用行列式性质证明的命题：奇数阶实反对称矩阵一定奇异。因为 $A^{\\mathsf T}=-A$，取行列式得 $\\det A=\\det(A^{\\mathsf T})=\\det(-A)=(-1)^n\\det A$；$n$ 为奇数时 $(-1)^n=-1$，所以 $\\det A=-\\det A$，即 $\\det A=0$。这个证明只用了转置与行列式的两条性质，没有算任何元素。" },

        { t: "p", html: "靶子四是重点：<b>若 $A$ 的列线性无关，则 $A^{\\mathsf T}A$ 可逆。</b>这个结论在第 4 章反复用到（投影公式的分母），值得给它三个证明。" },

        { t: "steps", items: [
          { title: "证明一：定义法", html: "设 $A^{\\mathsf T}A\\mathbf{x}=\\mathbf{0}$。两边左乘 $\\mathbf{x}^{\\mathsf T}$，得 $\\mathbf{x}^{\\mathsf T}A^{\\mathsf T}A\\mathbf{x}=\\lVert A\\mathbf{x}\\rVert^2=0$，所以 $A\\mathbf{x}=\\mathbf{0}$。由列线性无关，$\\mathbf{x}=\\mathbf{0}$。于是 $A^{\\mathsf T}A$ 的零空间只有零向量，$n\\times n$ 矩阵可逆。" },
          { title: "证明二：秩法", html: "先证 $N(A^{\\mathsf T}A)=N(A)$。包含关系 $N(A)\\subseteq N(A^{\\mathsf T}A)$ 显然；反方向正是证明一的第一步。于是 $\\operatorname{rank}(A^{\\mathsf T}A)=n-\\dim N(A^{\\mathsf T}A)=n-\\dim N(A)=\\operatorname{rank}(A)=n$。$n\\times n$ 矩阵满秩即可逆。" },
          { title: "证明三：特征值法", html: "$A^{\\mathsf T}A$ 对称半正定，特征值非负。若某个特征值为 $0$，对应特征向量 $\\mathbf{v}\\ne\\mathbf{0}$ 满足 $A^{\\mathsf T}A\\mathbf{v}=\\mathbf{0}$，由证明一得 $\\mathbf{v}=\\mathbf{0}$，矛盾。所以所有特征值严格为正，行列式为正，矩阵可逆。" }
        ]},

        { t: "callout", kind: "tip", title: "三种证明各买到什么", html: "定义法买到「$N(A^{\\mathsf T}A)=N(A)$」这条等式；秩法买到「秩-零化度可以直接套」的套路；特征值法买到「$A^{\\mathsf T}A$ 正定」这个更强的结论。同一件事，三种收获——所以做题时多写一种证明，往往比多做三道同类题划算。" },

        { t: "p", html: "再补一个构造型例子，说明「证明存在」有时等于「把对象造出来」。命题：给定 $\\mathbb{R}^n$ 的一组基 $\\mathbf{v}_1,\\dots,\\mathbf{v}_n$ 与任意 $n$ 个向量 $\\mathbf{w}_1,\\dots,\\mathbf{w}_n$，存在唯一的线性变换 $T$ 使 $T(\\mathbf{v}_i)=\\mathbf{w}_i$。" },

        { t: "p", html: "构造：对任意 $\\mathbf{x}=\\sum c_i\\mathbf{v}_i$（系数由基唯一确定），定义 $T(\\mathbf{x})=\\sum c_i\\mathbf{w}_i$。先验证这个定义不依赖表示（基的表示唯一），再验证线性（系数相加、数乘直接作用在 $c_i$ 上），最后验证 $T(\\mathbf{v}_i)=\\mathbf{w}_i$。唯一性：任何满足条件的 $T$ 在基上的值已固定，而线性变换由基上的值完全决定。" },

        { t: "p", html: "最后再提一件「工具之外」的事：证明的写法也有讲究。好的证明会先给一句路线图（「我们分三步：先……再……最后……」），再逐段执行；坏的证明从第一行就开始算，读到第五行读者已经不知道目标是什么。上面每个证明都用了这个结构——你可以回头数一数，路线图那句话出现在哪里。" },

        { t: "p", html: "这个构造是第 8 章「矩阵由基像决定」的严格版本。它示范了构造型证明的三段式：<b>造一个候选、验证它合格、证明它唯一</b>。后面 Schur 补与伪逆的证明，都是这个三段式的变体。" },

        { t: "callout", kind: "note", title: "反证法什么时候好用", html: "当结论是「不存在」「不可能」「至少有一个」时，反证法往往最省力：假设反面成立，找一个与已知矛盾的量（比如迹、秩、正负性）。上面靶子二就是典型——正面构造 $A,B$ 几乎无从下手，反证只需算一个迹。" }
      ]
    },

    {
      id: "adv-proof-s2",
      title: "行列式的公理刻画：三条规则定死一个函数",
      en: "AXIOMS OF THE DETERMINANT",
      minutes: 20,
      blocks: [
        { t: "callout", kind: "why", title: "这一节要解决什么问题", html: "第 5 章说行列式有三条性质，其余都由它们推出。可「推出」到底怎么推？为什么三条性质就能唯一确定一个函数？这一节把行列式重新定义成「满足三条公理的函数」，再把熟悉的性质一条条推出来。" },

        { t: "p", html: "把行列式看成一个函数：输入 $n$ 个行向量，输出一个数。公理只有三条：" },

        { t: "list", ordered: true, items: [
          "<b>规范性</b>：$\\det(I)=1$。",
          "<b>多线性</b>：固定其余行，行列式对每一行是线性的。也就是说，某一行乘以 $c$，行列式乘以 $c$；某一行拆成两个向量之和，行列式拆成两个行列式之和。",
          "<b>交错性</b>：若有两行相同，则行列式为 $0$。"
        ]},

        { t: "p", html: "先推第一条推论：<b>交换两行，行列式变号</b>。设 $f$ 是满足公理的函数。考虑把第 $i$ 行与第 $j$ 行都换成 $\\mathbf{r}_i+\\mathbf{r}_j$ 的矩阵，它有两行相同，由交错性 $f=0$。另一方面，按多线性把它展开成四项：$f(\\mathbf{r}_i,\\mathbf{r}_i)+f(\\mathbf{r}_i,\\mathbf{r}_j)+f(\\mathbf{r}_j,\\mathbf{r}_i)+f(\\mathbf{r}_j,\\mathbf{r}_j)$，其中两项因两行相同为 $0$。于是 $f(\\mathbf{r}_i,\\mathbf{r}_j)+f(\\mathbf{r}_j,\\mathbf{r}_i)=0$，即交换变号。" },

        { t: "p", html: "公理还有一个几何解释：$|\\det A|$ 是 $A$ 的列张成的平行体的体积。为什么？因为单位立方体体积为 $1$（规范性），而行变换对应「剪切、拉伸、交换坐标轴」，体积的变化正好与三条公理一致：剪切不变体积、沿一个方向拉伸按比例放大体积、交换两根轴只改变定向。所以「行列式 = 有向体积」不是巧合，而是公理的几何翻译。" },

        { t: "p", html: "第二条推论：<b>把一行的倍数加到另一行，行列式不变</b>。设新矩阵的第 $i$ 行是 $\\mathbf{r}_i+c\\mathbf{r}_j$。由多线性拆成两项：原行列式，加上 $c$ 倍「第 $i$ 行与第 $j$ 行都是 $\\mathbf{r}_j$」的行列式。后者由交错性为 $0$，所以不变。" },

        { t: "p", html: "第三条推论：<b>有一行全为零，行列式为 $0$</b>。零行等于 $0$ 乘任意行，由多线性提出因子 $0$。" },

        { t: "p", html: "这三条推论合起来说明：<b>高斯消元不改变行列式（除了换行变号）</b>。于是计算行列式可以化成「消成上三角再乘对角线」，这正是第 5 章的做法。但公理刻画给的不止是算法，还有唯一性。" },

        { t: "theorem", name: "行列式的唯一性", zh: "Uniqueness of the Determinant", rows: [
          { k: "白话", html: "满足三条公理的函数只有一个，就是行列式；所以可以用公理来定义它，而不必先写排列公式。" },
          { k: "条件", html: "$f$ 是 $n$ 个行向量的函数，满足规范、多线性、交错三条。" },
          { k: "结论", html: "$f(A)=\\sum_{\\sigma}\\operatorname{sgn}(\\sigma)a_{1\\sigma(1)}\\cdots a_{n\\sigma(n)}$，即排列公式。" },
          { k: "证明", html: "把每一行写成标准基的线性组合，用多线性展开成 $n^n$ 项；由交错性，只有「每行取不同基向量」的项存活，剩下 $n!$ 项，每项是 $\\pm$ 一个排列的乘积。" }
        ]},

        { t: "p", html: "唯一性的证明值得看一眼。把第 $i$ 行写成 $\\mathbf{r}_i=\\sum_j a_{ij}\\mathbf{e}_j$，代入 $f$ 并用多线性逐行展开，得到 $n^n$ 个形如 $f(\\mathbf{e}_{\\sigma(1)},\\dots,\\mathbf{e}_{\\sigma(n)})$ 的项，系数是 $a_{1\\sigma(1)}\\cdots a_{n\\sigma(n)}$。由交错性，只要两个下标相同，这一项就是 $0$；所以只剩 $\\sigma$ 为排列的 $n!$ 项。而每个排列都能通过若干次换行变成恒等排列，每次换行变号，所以 $f(\\mathbf{e}_{\\sigma(1)},\\dots)=(-1)^{\\#\\text{换行}}f(I)=\\operatorname{sgn}(\\sigma)$。这就是排列公式。" },

        { t: "p", html: "有了唯一性，<b>乘积法则可以「免费」得到</b>。固定可逆矩阵 $B$，定义 $D(A)=\\det(AB)$。把它看成 $A$ 的函数：$A$ 的第 $i$ 行线性地影响 $AB$ 的第 $i$ 行，所以 $D$ 多线性；$A$ 有两行相同则 $AB$ 有两行相同，所以 $D$ 交错；$D(I)=\\det(B)$。由唯一性，$D(A)=\\det(A)D(I)=\\det(A)\\det(B)$。$B$ 不可逆时两边都是 $0$，等式同样成立。" },

        { t: "callout", kind: "tip", title: "这个证明的妙处", html: "它没有逐项展开 $AB$，也没有用任何计算，只用了「满足公理的函数唯一」这一句话。这就是公理化方法的威力：把性质提炼成公理，剩下的结论自动成立。" },

        { t: "p", html: "把可逆判定与公理连起来看会更清楚：$A$ 奇异等价于行向量线性相关，等价于某一行是其余行的线性组合。用多线性把这一行拆开，每一项都有一个「两行相同」的因子，于是行列式为 $0$。反过来，若行列式非零，行向量必线性无关，消元能走到底，主元全非零，$A$ 可逆。" },

        { t: "p", html: "另外两条常用推论也可以从公理直接得到。<b>可逆判定</b>：若 $A$ 可逆，则 $\\det(A)\\det(A^{-1})=\\det(I)=1$，所以 $\\det(A)\\ne0$；若 $A$ 奇异，行向量线性相关，某一行是其余行的线性组合，用多线性与交错性可把行列式拆成若干「两行相同」的项，全为 $0$。" },

        { t: "p", html: "<b>克拉默法则</b>也是多线性的直接产物。设 $A\\mathbf{x}=\\mathbf{b}$，把第 $i$ 列换成 $\\mathbf{b}$ 得到 $A_i$。按列的多线性展开 $\\det(A_i)=\\sum_j x_j\\det(A\\text{ 的第 }i\\text{ 列换成第 }j\\text{ 列})$。当 $j\\ne i$ 时，新矩阵有两列相同，行列式为 $0$；只剩 $j=i$ 一项，等于 $x_i\\det(A)$。所以 $x_i=\\det(A_i)/\\det(A)$。" },

        { t: "p", html: "公理视角还能顺手推出<b>伴随矩阵求逆公式</b>。把 $A$ 的第 $j$ 列换成 $\\mathbf{b}=\\mathbf{e}_i$，由克拉默法则得 $(A^{-1})_{ij}=\\det(A\\text{ 的第 }j\\text{ 列换成 }\\mathbf{e}_i)/\\det A$；而那个行列式按第 $j$ 列展开，正好是代数余子式 $C_{ji}$。于是 $A^{-1}=\\operatorname{adj}(A)/\\det A$，其中 $\\operatorname{adj}(A)$ 的 $(i,j)$ 元是 $C_{ji}$——转置就是这么来的。" },

        { t: "example", no: "2.1", tag: "用公理算 3×3 行列式", fields: [
          { k: "题目", html: "计算 $\\det\\begin{bmatrix}2&1&3\\\\0&4&1\\\\5&2&0\\end{bmatrix}$。" },
          { k: "思路", html: "用「一行加另一行的倍数不改变行列式」把矩阵化到容易展开的形状，或用余子式展开。" },
          { k: "解答", html: "直接按第一行展开：$2\\begin{vmatrix}4&1\\\\2&0\\end{vmatrix}-1\\begin{vmatrix}0&1\\\\5&0\\end{vmatrix}+3\\begin{vmatrix}0&4\\\\5&2\\end{vmatrix}=2(0-2)-(0-5)+3(0-20)=-4+5-60=-59$。" },
          { k: "点评", html: "展开时第二项是「减」——因为 $(-1)^{1+2}=-1$。用公理视角看，这个符号来自「把第一行移到最上面需要交换的次数」，而不是背棋盘格。" }
        ]},

        { t: "compare", left: { title: "把行列式当公式背", html: "先背排列公式，再拿它算所有行列式；遇到 $4$ 阶以上就算不动。" }, right: { title: "把行列式当公理定义的函数", html: "三条公理唯一确定它；排列公式与消元算法都是推论。做题时按形状选工具：零多就展开，一般就消元。" } },

        { t: "p", html: "最后提醒一句：公理里的「多线性」是对每一行分别说的。所以行列式对「把一行换成两个向量之和」可以拆，但对「整个矩阵相加」不能拆。把这个区别记牢，$\\det(A+B)=\\det A+\\det B$ 这类错误就不会再犯。" },

        { t: "callout", kind: "warn", title: "两个常见误解", html: "第一，把「多线性」理解成「对整个矩阵线性」——它只对每一行分别线性，$\\det(A+B)=\\det A+\\det B$ 是错的。第二，以为公理只能定义、不能计算——恰恰相反，公理给出的消元算法是手算行列式最快的方法。" }
      ]
    },

    {
      id: "adv-proof-s3",
      title: "Schur 补：分块矩阵的消元",
      en: "THE SCHUR COMPLEMENT",
      minutes: 20,
      blocks: [
        { t: "callout", kind: "why", title: "这一节要解决什么问题", html: "分块矩阵看起来吓人：$\\begin{bmatrix}A&B\\\\C&D\\end{bmatrix}$ 的行列式、逆、正定性怎么算？答案是把左上角块 $A$ 当成「主元」，像消元一样把 $C$ 消掉，剩下的那块叫 Schur 补。这一节把分解式写出来，再拿它一次性解决三个问题。" },

        { t: "p", html: "设 $M=\\begin{bmatrix}A&B\\\\C&D\\end{bmatrix}$，其中 $A$ 可逆。仿照高斯消元，用分块的行变换把左下角的 $C$ 消掉：把第一个分块行左乘 $CA^{-1}$ 再减到第二个分块行。写成矩阵乘法就是下面的分解。" },

        { t: "tex", tex: "\\begin{bmatrix}A&B\\\\C&D\\end{bmatrix}=\\begin{bmatrix}I&0\\\\CA^{-1}&I\\end{bmatrix}\\begin{bmatrix}A&0\\\\0&S\\end{bmatrix}\\begin{bmatrix}I&A^{-1}B\\\\0&I\\end{bmatrix},\\qquad S=D-CA^{-1}B", caption: "分块 LU 分解；$S$ 叫 $A$ 的 Schur 补" },

        { t: "p", html: "验证只需乘一遍：右边先乘前两个，得 $\\begin{bmatrix}A&0\\\\C&S\\end{bmatrix}$，再乘第三个，右上角变成 $AA^{-1}B=B$，右下角变成 $CA^{-1}B+S=D$。等式成立。注意两个外侧因子都是单位三角矩阵，行列式都是 $1$。" },

        { t: "p", html: "第一个用途：<b>分块行列式</b>。对上面的分解取行列式，外侧两个因子贡献 $1$，中间是对角块矩阵，于是 $\\det M=\\det(A)\\det(S)$。这条公式把 $n+m$ 阶行列式降成两个小行列式之积，是手算分块行列式的主力。" },

        { t: "p", html: "第二个用途：<b>正定性判据</b>。设 $M$ 对称（于是 $C=B^{\\mathsf T}$）。若 $M$ 正定，则 $A$ 正定（取 $\\mathbf{y}=\\mathbf{0}$ 的二次型即可），且 $S$ 正定：对任意 $\\mathbf{z}\\ne\\mathbf{0}$，取 $\\mathbf{x}=-A^{-1}B\\mathbf{z}$，则 $\\begin{bmatrix}\\mathbf{x}\\\\\\mathbf{z}\\end{bmatrix}^{\\mathsf T}M\\begin{bmatrix}\\mathbf{x}\\\\\\mathbf{z}\\end{bmatrix}=\\mathbf{z}^{\\mathsf T}S\\mathbf{z}\\gt0$。反过来，若 $A$ 与 $S$ 都正定，则对任意 $(\\mathbf{x},\\mathbf{z})\\ne(\\mathbf{0},\\mathbf{0})$ 有恒等式 $\\begin{bmatrix}\\mathbf{x}\\\\\\mathbf{z}\\end{bmatrix}^{\\mathsf T}M\\begin{bmatrix}\\mathbf{x}\\\\\\mathbf{z}\\end{bmatrix}=(\\mathbf{x}+A^{-1}B\\mathbf{z})^{\\mathsf T}A(\\mathbf{x}+A^{-1}B\\mathbf{z})+\\mathbf{z}^{\\mathsf T}S\\mathbf{z}\\gt0$。所以 $M$ 正定当且仅当 $A$ 与 $S$ 都正定。" },

        { t: "p", html: "正定判据的用途远不止判断正定。在统计里，协方差矩阵分块后，Schur 补就是「条件协方差」，它正定说明「扣掉一部分变量后剩下的方差仍然非负」；在优化里，分块 KKT 矩阵的 Schur 补用来消去一部分变量，把问题降维。同一套公式，换个场景就换个名字。" },

        { t: "p", html: "第三个用途：<b>分块求逆</b>。由分解式取逆，得 $M^{-1}=\\begin{bmatrix}I&-A^{-1}B\\\\0&I\\end{bmatrix}\\begin{bmatrix}A^{-1}&0\\\\0&S^{-1}\\end{bmatrix}\\begin{bmatrix}I&0\\\\-CA^{-1}&I\\end{bmatrix}$，乘开就是 $\\begin{bmatrix}A^{-1}+A^{-1}BS^{-1}CA^{-1}&-A^{-1}BS^{-1}\\\\-S^{-1}CA^{-1}&S^{-1}\\end{bmatrix}$。这个公式在统计（分块协方差求逆）、控制（Kalman 滤波）与数值代数里到处出现。" },

        { t: "p", html: "分块行列式公式还有一个常见用途：算特征多项式。若矩阵是分块上三角的，$\\det(M-\\lambda I)=\\det(A-\\lambda I)\\det(D-\\lambda I)$，特征值就是两块特征值的并集。很多「看起来很大」的特征值问题，就是靠这个观察拆成两个小问题。" },

        { t: "p", html: "还有一条常考的推论：<b>分块三角矩阵的行列式等于对角块行列式之积</b>。$\\begin{bmatrix}A&B\\\\0&D\\end{bmatrix}$ 就是 $S=D$ 的特例，行列式等于 $\\det A\\det D$；同理 $\\begin{bmatrix}A&0\\\\C&D\\end{bmatrix}$ 也是 $\\det A\\det D$。这条结论在算特征多项式时很有用：分块三角矩阵的特征值就是各块特征值的并集。" },

        { t: "example", no: "3.1", tag: "3×3 对称矩阵的 Schur 补", fields: [
          { k: "题目", html: "对 $M=\\begin{bmatrix}2&1&1\\\\1&2&1\\\\1&1&2\\end{bmatrix}$ 取 $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$，求 Schur 补并验算 $\\det M$。" },
          { k: "思路", html: "$B$ 是前两行的最后一列，$C=B^{\\mathsf T}$，$D=2$。" },
          { k: "解答", html: "$A^{-1}=\\frac13\\begin{bmatrix}2&-1\\\\-1&2\\end{bmatrix}$，$CA^{-1}B=\\frac13\\begin{bmatrix}1&1\\end{bmatrix}\\begin{bmatrix}2&-1\\\\-1&2\\end{bmatrix}\\begin{bmatrix}1\\\\1\\end{bmatrix}=\\frac23$。所以 $S=2-\\frac23=\\frac43$。$\\det M=\\det(A)\\cdot S=3\\cdot\\frac43=4$。" },
          { k: "点评", html: "直接算特征值也能验算：$M=J+I$，$J$ 的特征值是 $3,0,0$，所以 $M$ 的特征值是 $4,1,1$，行列式 $4$。两种方法结果一致；$S=\\frac43\\gt0$ 且 $A$ 正定，也印证了 $M$ 正定。" }
        ]},

        { t: "p", html: "Schur 补在数值代数里还有一个身份：<b>块消元</b>。把大矩阵分块后先消掉左下块，相当于先解一部分变量再解剩下的，这正是稀疏直接解法（分块 LU、区域分解）的基本动作。它的代价是显式形成 $S$，所以实际实现里常用隐式方式避免求 $A^{-1}$。" },

        { t: "p", html: "Schur 补还有一个统计上的名字：条件协方差。把向量分成 $\\begin{bmatrix}\\mathbf{x}\\\\ \\mathbf{y}\\end{bmatrix}$ 两部分，若协方差矩阵是 $M$，则给定 $\\mathbf{y}$ 后 $\\mathbf{x}$ 的协方差正好是 $A-BD^{-1}C$——也就是另一种分块的 Schur 补。它衡量的是「扣掉 $\\mathbf{y}$ 能解释的部分之后，$\\mathbf{x}$ 还剩下多少不确定性」。" },

        { t: "callout", kind: "warn", title: "使用前提", html: "上面所有公式都要求 $A$ 可逆（或 $D$ 可逆，用另一侧分块）。$A$ 奇异时 Schur 补没有定义，但可以用伪逆写出类似的表达式；这也是伪逆在分块问题里的用途之一。" }
      ]
    },

    {
      id: "adv-proof-s4",
      title: "Schur 三角化与 Jordan 形：不能对角化怎么办",
      en: "SCHUR & JORDAN",
      minutes: 20,
      blocks: [
        { t: "callout", kind: "why", title: "这一节要解决什么问题", html: "谱定理只对对称矩阵成立。一般矩阵可能没有实特征值，也可能特征向量不够、根本不能对角化。可我们仍然想把它化成「接近对角」的形状——这就是 Schur 三角化与 Jordan 形要解决的问题。" },

        { t: "p", html: "先看复数域。定理（Schur 三角化）：任何复方阵 $A$ 都酉相似于上三角矩阵，即存在酉矩阵 $U$ 使 $U^{\\mathsf H}AU=T$ 为上三角。证明用归纳法，和谱定理的第一步几乎一样。" },

        { t: "steps", items: [
          { title: "第一步：找一个特征向量", html: "在复数域里，特征多项式必有根，所以 $A$ 有单位特征向量 $\\mathbf{x}_1$，对应特征值 $\\lambda_1$。" },
          { title: "第二步：补成酉矩阵", html: "把 $\\mathbf{x}_1$ 扩充成 $\\mathbb{C}^n$ 的标准正交基，排成 $U_1=[\\mathbf{x}_1\\ \\cdots\\ \\mathbf{x}_n]$。" },
          { title: "第三步：算相似矩阵", html: "$U_1^{\\mathsf H}AU_1$ 的第一列是 $U_1^{\\mathsf H}(\\lambda_1\\mathbf{x}_1)=\\lambda_1\\mathbf{e}_1$，所以它形如 $\\begin{bmatrix}\\lambda_1&*\\\\0&A_1\\end{bmatrix}$。" },
          { title: "第四步：对子矩阵归纳", html: "对 $(n-1)\\times(n-1)$ 的 $A_1$ 用归纳假设，得到酉矩阵 $U_2$；把 $U_2$ 补成 $\\operatorname{diag}(1,U_2)$ 作用上去，就得到上三角。" }
        ]},

        { t: "p", html: "Schur 三角化告诉我们：<b>任何复矩阵都能被压成上三角，只是对角线上是特征值、上方可能还有非零元素</b>。什么时候能压成对角？答案是「正规」。" },

        { t: "p", html: "定理：$A$ 可酉对角化当且仅当 $A$ 正规，即 $A^{\\mathsf H}A=AA^{\\mathsf H}$。必要性显然（对角矩阵与自己的共轭转置交换）。充分性：由 Schur 定理写 $A=UTU^{\\mathsf H}$，$T$ 上三角。正规性传递到 $T$：$T^{\\mathsf H}T=TT^{\\mathsf H}$。比较两边的 $(1,1)$ 元：左边是 $|t_{11}|^2$（第一列只有 $t_{11}$），右边是 $\\sum_j|t_{1j}|^2$，所以第一行除 $t_{11}$ 外全为 $0$。对右下角的 $(n-1)\\times(n-1)$ 子矩阵重复这个论证，最终 $T$ 是对角矩阵。" },

        { t: "callout", kind: "note", title: "正规矩阵包括谁", html: "实对称、Hermite、正交、酉、以及所有对角矩阵都是正规的。所以「正规」是谱定理能成立的最大范围；再往外，就只能退到 Jordan 形。" },

        { t: "p", html: "Jordan 形是另一条路：不做酉变换，只做相似变换，把矩阵化成「对角块 + 幂零部分」。定理（Jordan 形，存在性与唯一性）：任何复方阵 $A$ 都能写成 $A=PJP^{-1}$，其中 $J$ 是分块对角矩阵，每个块形如 $J_k(\\lambda)=\\lambda I+N$，$N$ 是只有上副对角线为 $1$ 的幂零矩阵；在重排块的顺序后，$J$ 唯一。" },

        { t: "p", html: "这个定理的完整证明较长，这里只说明它「靠什么成立」。核心是幂零变换的结构定理：对 $A-\\lambda I$ 反复作用，得到一串嵌套的子空间 $N(A-\\lambda I)\\subseteq N((A-\\lambda I)^2)\\subseteq\\cdots$，这串子空间最终稳定；在每个「层」里选一组向量，就能拼出若尔当链，链的个数等于几何重数，链的长度对应代数重数。存在性来自「广义特征向量张成整个空间」，唯一性来自链长的分布由 $(A-\\lambda I)^k$ 的零空间维数序列决定。" },

        { t: "p", html: "Jordan 形最实用的地方是算矩阵函数。若 $J=\\lambda I+N$，则 $J^k=(\\lambda I+N)^k=\\sum_{j=0}^{k}\\binom{k}{j}\\lambda^{k-j}N^j$，而 $N$ 幂零，求和只有有限项。同理 $e^{Jt}=e^{\\lambda t}(I+Nt+\\frac{(Nt)^2}{2!}+\\cdots)$，这也是第 6 章解微分方程组时「出现 $te^{\\lambda t}$ 项」的原因。" },

        { t: "example", no: "4.1", tag: "若尔当块的幂", fields: [
          { k: "题目", html: "设 $A=\\begin{bmatrix}2&1\\\\0&2\\end{bmatrix}$，求 $A^k$ 并解释为什么不是简单的 $2^kI$。" },
          { k: "思路", html: "把 $A$ 写成 $2I+N$，其中 $N=\\begin{bmatrix}0&1\\\\0&0\\end{bmatrix}$，$N^2=0$。" },
          { k: "解答", html: "$A^k=(2I+N)^k=2^kI+k2^{k-1}N=\\begin{bmatrix}2^k&k2^{k-1}\\\\0&2^k\\end{bmatrix}$。例如 $k=2$ 得 $\\begin{bmatrix}4&4\\\\0&4\\end{bmatrix}$，而 $A^2$ 直接算也是 $\\begin{bmatrix}4&4\\\\0&4\\end{bmatrix}$。" },
          { k: "点评", html: "多出来的 $k2^{k-1}$ 来自幂零部分；它的存在说明 $A$ 不能对角化——若 $A$ 相似于 $2I$，那 $A$ 本身就是 $2I$，矛盾。" }
        ]},

        { t: "p", html: "判断「能不能对角化」还有一条更快的路：<b>最小多项式</b>。它是指使 $m(A)=0$ 的最低次首一多项式，整除特征多项式。定理：$A$ 可对角化当且仅当最小多项式没有重根。例如 $\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}$ 的特征多项式是 $(\\lambda-1)^2$，最小多项式也是 $(\\lambda-1)^2$，有重根，所以不可对角化；而单位矩阵的特征多项式是 $(\\lambda-1)^n$，最小多项式却是 $\\lambda-1$，没有重根，可对角化。这条判据比逐个特征值数几何重数快得多。" },

        { t: "p", html: "Jordan 形另一个用途是算矩阵函数：任何收敛的幂级数 $f(A)$ 都可以通过 $f(PJP^{-1})=Pf(J)P^{-1}$ 来算，而 $f(J)$ 按块计算，块内用 $f(\\lambda I+N)=\\sum_k\\frac{f^{(k)}(\\lambda)}{k!}N^k$。这解释了为什么不可对角化的矩阵会出现 $te^{\\lambda t}$、$t^2e^{\\lambda t}$ 这样的项——它们来自幂零部分的各次幂。" },

        { t: "p", html: "把两条路放在一起比较：<b>Schur 三角化</b>保证「酉 + 上三角」，代价是对角线上方可能不干净；<b>Jordan 形</b>保证「最接近对角」，代价是变换矩阵 $P$ 一般不酉、条件数可能很大。数值计算里几乎只用 Schur 形（稳定），Jordan 形更多用于理论分析。" },

        { t: "p", html: "实矩阵还要多一层小心：如果特征值是复数，实 Jordan 形里会出现 $2\\times2$ 的块 $\\begin{bmatrix}a&-b\\\\b&a\\end{bmatrix}$，它对应「旋转 + 伸缩」，不能拆成两个实若尔当块。这也是为什么旋转矩阵在实数域里没有特征向量——它把每个实方向都转走了。" },

        { t: "callout", kind: "warn", title: "别把两者混用", html: "Schur 形不是唯一的（上三角部分依赖基的选择），Jordan 形在不计块顺序时唯一。写证明时引用「Jordan 标准形」要说明是在复数域上；实矩阵的实 Jordan 形会出现 $2\\times2$ 的旋转块，形式更复杂。" }
      ]
    },

    {
      id: "adv-proof-s5",
      title: "伪逆的构造：给每个矩阵一个「逆」",
      en: "CONSTRUCTING THE PSEUDOINVERSE",
      minutes: 19,
      blocks: [
        { t: "callout", kind: "why", title: "这一节要解决什么问题", html: "不可逆的矩阵没有逆，可我们仍然想「解」$A\\mathbf{x}=\\mathbf{b}$。最小二乘给了答案，但列相关时解不唯一。伪逆 $A^{+}$ 的作用是：在所有最小二乘解里挑出长度最小的那个，并且给出一套能替代逆矩阵的运算规则。" },

        { t: "p", html: "先把目标说清楚。对任意 $m\\times n$ 矩阵 $A$ 与 $\\mathbf{b}\\in\\mathbb{R}^m$，考虑两个要求：让 $\\lVert A\\mathbf{x}-\\mathbf{b}\\rVert$ 最小；在满足前一条的 $\\mathbf{x}$ 里，让 $\\lVert\\mathbf{x}\\rVert$ 最小。这样的 $\\mathbf{x}$ 存在且唯一，记作 $A^{+}\\mathbf{b}$。" },

        { t: "p", html: "构造直接用 SVD。设 $A=U\\Sigma V^{\\mathsf T}$，$\\Sigma$ 的对角元是 $\\sigma_1\\ge\\cdots\\ge\\sigma_r\\gt0$，其余为零。定义 $\\Sigma^{+}$ 为把 $\\Sigma$ 转置后把非零奇异值取倒数：$\\Sigma^{+}=\\operatorname{diag}(1/\\sigma_1,\\dots,1/\\sigma_r,0,\\dots)$（长方形时按转置后的形状补零）。再令 $A^{+}=V\\Sigma^{+}U^{\\mathsf T}$。" },

        { t: "tex", tex: "A=U\\Sigma V^{\\mathsf T}\\quad\\Longrightarrow\\quad A^{+}=V\\Sigma^{+}U^{\\mathsf T},\\qquad \\Sigma^{+}=\\operatorname{diag}\\!\\left(\\frac{1}{\\sigma_1},\\dots,\\frac{1}{\\sigma_r},0,\\dots,0\\right)", caption: "用 SVD 构造伪逆" },

        { t: "p", html: "为什么这样定义合理？把 $A$ 看成「先旋转、再拉伸、再旋转」。拉伸把某些方向压成 $0$，这些方向的信息已经丢了，无法还原，只能记 $0$；没被压成 $0$ 的方向，按 $1/\\sigma_i$ 缩回去就能还原。所以伪逆 = 「能还原的还原，不能还原的放弃」。" },

        { t: "p", html: "这个构造满足四条 Penrose 条件，逐条验证如下（用 $\\Sigma\\Sigma^{+}\\Sigma=\\Sigma$ 与 $\\Sigma^{+}\\Sigma\\Sigma^{+}=\\Sigma^{+}$，这两条对对角矩阵直接可见）：" },

        { t: "steps", items: [
          { title: "条件一：$AA^{+}A=A$", html: "$AA^{+}A=U\\Sigma V^{\\mathsf T}V\\Sigma^{+}U^{\\mathsf T}U\\Sigma V^{\\mathsf T}=U\\Sigma\\Sigma^{+}\\Sigma V^{\\mathsf T}=U\\Sigma V^{\\mathsf T}=A$。" },
          { title: "条件二：$A^{+}AA^{+}=A^{+}$", html: "同理，中间变成 $\\Sigma^{+}\\Sigma\\Sigma^{+}=\\Sigma^{+}$。" },
          { title: "条件三：$AA^{+}$ 对称", html: "$AA^{+}=U\\Sigma\\Sigma^{+}U^{\\mathsf T}$，而 $\\Sigma\\Sigma^{+}$ 是对角且对角元为 $0$ 或 $1$，所以整个矩阵对称。" },
          { title: "条件四：$A^{+}A$ 对称", html: "$A^{+}A=V\\Sigma^{+}\\Sigma V^{\\mathsf T}$，同理对称。" }
        ]},

        { t: "theorem", name: "伪逆的最小范数性质", zh: "Minimum-Norm Least Squares", rows: [
          { k: "白话", html: "在所有让残差最小的解里，$A^{+}\\mathbf{b}$ 是长度最短的那个。" },
          { k: "条件", html: "$A$ 是任意 $m\\times n$ 实矩阵，$\\mathbf{b}\\in\\mathbb{R}^m$。" },
          { k: "结论", html: "$A^{+}\\mathbf{b}$ 是 $\\lVert A\\mathbf{x}-\\mathbf{b}\\rVert$ 的最小化解中 $\\lVert\\mathbf{x}\\rVert$ 最小的唯一解。" },
          { k: "证明", html: "一般最小二乘解形如 $A^{+}\\mathbf{b}+(I-A^{+}A)\\mathbf{w}$；$A^{+}\\mathbf{b}$ 与 $(I-A^{+}A)\\mathbf{w}$ 正交（前者在行空间，后者在零空间），由勾股定理取 $\\mathbf{w}=\\mathbf{0}$ 最小。" }
        ]},

        { t: "p", html: "伪逆还有一个工程上的近亲：<b>Tikhonov 正则化</b>。当奇异值很小时，$1/\\sigma_i$ 会把噪声放大得厉害，于是把 $\\Sigma^{+}$ 换成 $\\sigma_i/(\\sigma_i^2+\\lambda)$，得到 $(A^{\\mathsf T}A+\\lambda I)^{-1}A^{\\mathsf T}$。它牺牲一点偏差换稳定，是岭回归与很多反问题的标准做法；$\\lambda\\to0$ 时它退化为伪逆。" },

        { t: "p", html: "证明里的关键事实是：$I-A^{+}A$ 是到 $N(A)$ 的正交投影，而 $A^{+}\\mathbf{b}\\in C(A^{\\mathsf T})=N(A)^{\\perp}$。所以最小二乘解集是「一个最小范数解 + 零空间」，其中最小范数解垂直于零空间，长度自然最短。这也解释了为什么列满秩时 $A^{+}=(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}$：此时零空间只有零向量，最小范数解就是唯一解。" },

        { t: "example", no: "5.1", tag: "秩 1 矩阵的伪逆", fields: [
          { k: "题目", html: "求 $A=\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$ 的伪逆，并解最小二乘问题 $A\\mathbf{x}\\approx\\mathbf{b}$，$\\mathbf{b}=(1,0)$。" },
          { k: "思路", html: "用上一篇算好的 SVD：$A=5\\mathbf{u}_1\\mathbf{v}_1^{\\mathsf T}$，$\\mathbf{u}_1=\\mathbf{v}_1=(1,2)/\\sqrt5$。" },
          { k: "解答", html: "秩 1 矩阵的伪逆是 $A^{+}=\\frac{1}{5}\\mathbf{v}_1\\mathbf{u}_1^{\\mathsf T}=\\frac{1}{25}\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$。于是 $A^{+}\\mathbf{b}=\\frac{1}{25}(1,2)$。验算：$A(A^{+}\\mathbf{b})=\\frac{1}{25}(5,10)=\\frac15(1,2)$，残差 $(1,0)-\\frac15(1,2)=\\left(\\frac45,-\\frac25\\right)$，它与 $C(A)$ 的方向 $(1,2)$ 正交：$\\frac45-\\frac45=0$。" },
          { k: "点评", html: "最小二乘解不唯一（零空间方向 $(2,-1)$ 可以随便加），但 $A^{+}\\mathbf{b}=\\frac{1}{25}(1,2)$ 与 $(2,-1)$ 正交，所以它是长度最小的那个。" }
        ]},

        { t: "callout", kind: "warn", title: "伪逆不能乱套逆的规则", html: "$A^{+}$ 一般不满足 $(AB)^{+}=B^{+}A^{+}$，也不满足 $A^{+}A=I$。它只保证四条 Penrose 条件。把伪逆当逆矩阵去做代数变形，是这一章最常见的错误。" },

        { t: "p", html: "从四个子空间看，伪逆的作用一目了然：$A^{+}$ 把 $C(A)$ 里的向量映回行空间，把 $N(A^{\\mathsf T})$ 里的向量映成零。换句话说，它在「能还原的方向」上求逆，在「被压掉的方向」上认输。$AA^{+}$ 是到列空间的正交投影，$A^{+}A$ 是到行空间的正交投影——两条投影就把伪逆的几何意义说完了。" },

        { t: "p", html: "伪逆在工程里最常见的用法有两个：一是解欠定或超定方程组（最小范数最小二乘解），二是做数据拟合时的「稳定求逆」。比如机器人逆运动学、断层扫描重建、推荐系统的评分补全，底层都是 $A^{+}\\mathbf{b}$。它的好处是不必先判断矩阵是否可逆——任何矩阵都有伪逆。" },

        { t: "p", html: "最后把这一篇的线索收一下：公理刻画告诉我们「性质可以定义对象」；Schur 补告诉我们「分块可以消元」；Schur 三角化与 Jordan 形告诉我们「不能对角化时退到哪里」；伪逆告诉我们「不可逆时用什么替代」。四种构造，同一个思路——<b>先问想要什么性质，再构造满足它的对象</b>。" }
      ]
    }
  ],

  checklist: { id: "adv-proof-check", items: [
    "你能对「$A$ 列满秩则 $A^{\\mathsf T}A$ 可逆」给出定义法、秩法、特征值法三种证明吗？",
    "行列式的三条公理分别是什么？「交换两行变号」是怎么从公理推出来的？",
    "你能写出 Schur 补的分解式，并说明 $\\det M=\\det A\\det S$ 是怎么来的吗？",
    "Schur 三角化与 Jordan 形的区别是什么？各自付出什么代价？",
    "四条 Penrose 条件分别是什么？$A^{+}\\mathbf{b}$ 为什么是最小范数最小二乘解？"
  ] },

  keypoint: { items: [
    { title: "换工具", html: "同一命题可以站在定义、秩、特征值三个高度证明；高度越高越短，但前提越少。" },
    { title: "公理定对象", html: "三条公理唯一确定行列式；乘积法则、可逆判定、克拉默法则都是推论。" },
    { title: "分块消元", html: "Schur 补 $S=D-CA^{-1}B$ 一举给出分块行列式、分块求逆与正定判据。" },
    { title: "两种标准形", html: "Schur 形：酉 + 上三角，数值稳定；Jordan 形：最接近对角，变换一般不酉。" },
    { title: "伪逆四条件", html: "$A^{+}=V\\Sigma^{+}U^{\\mathsf T}$ 满足四条 Penrose 条件，给出最小范数最小二乘解。" }
  ] },

  finish: "<p>这一篇的五个工具不会让计算变快，它们改变的是另一件事：当你算出一个答案，你能说清它为什么对；当别人给你一个命题，你能判断该从哪个高度下手。</p>"
    + "<p>接下来最值得做的练习，是回到<a href='#/ch05'>第 5 章</a>与<a href='#/ch06'>第 6 章</a>，把那些定理旁边的条件逐条拆掉，看哪个条件一拆就出事。每拆一次，你就多懂一层。也可以接着读<a href='#/advanced/adv-numeric'>数值实验</a>，看这些「漂亮的存在性」在浮点世界里会遇到什么麻烦。</p>"
});
