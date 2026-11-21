/* =====================================================================
 * data/ch04.js · 第4章 正交性（Orthogonality）
 * 依据 Gilbert Strang《Introduction to Linear Algebra》5th Edition §4.1–4.4
 * 主线：垂直 → 四个子空间正交 → 投影 → 最小二乘 → Gram-Schmidt → QR
 * ===================================================================== */
CSC.registerChapter({
 "id": "ch04",
 "num": "04",
 "title": "正交性",
 "en": "Orthogonality",
 "goals": [
  "你能证明 $N(A)\\perp C(A^{\\mathsf T})$ 与 $N(A^{\\mathsf T})\\perp C(A)$，并说出四个子空间在 $\\mathbb{R}^m$、$\\mathbb{R}^n$ 中如何两两配对。",
  "你能把向量投影到一条直线上，写出投影向量、投影矩阵，并验证误差向量与直线正交。",
  "你能推导并使用投影到子空间的公式 $P=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}$，并验证 $P^2=P$、$P^{\\mathsf T}=P$。",
  "你能把「无解的方程组」转成最小二乘问题，写出正规方程并解出最优的 $\\hat{\\mathbf{x}}$，再计算残差平方和。",
  "你能用 Gram–Schmidt 把一组线性无关的向量化成标准正交基，并解释每一步为什么保持张成空间不变。",
  "你能写出 $A=QR$ 并说明 $Q$、$R$ 的形状与来源，判断一个方阵是否为正交矩阵。"
 ],
 "kp": [
  {
   "id": "ch04-s1",
   "title": "先看一个例子：点到直线的最短距离"
  },
  {
   "id": "ch04-s2",
   "title": "§4.1 四个子空间的正交关系"
  },
  {
   "id": "ch04-s3",
   "title": "§4.2 投影到一条直线"
  },
  {
   "id": "ch04-s4",
   "title": "§4.2 投影到子空间：投影矩阵公式"
  },
  {
   "id": "ch04-s5",
   "title": "§4.3 最小二乘：找不到精确解时找最好的"
  },
  {
   "id": "ch04-s6",
   "title": "§4.4 正交基与 Gram–Schmidt"
  },
  {
   "id": "ch04-s7",
   "title": "§4.4 QR 分解与正交矩阵"
  }
 ],
 "blocks": [
  {
   "t": "scope",
   "scope": "core",
   "weeks": "第 6–7 周",
   "sections": "§4.1–4.4",
   "note": "建议 3 次、每次 54 分钟"
  },
  {
   "t": "callout",
   "kind": "why",
   "title": "这一章要解决什么问题",
   "html": "<p>第 <a href='#/ch03'>3 章</a>把矩阵的四个子空间摆了出来，但只说了它们「多大」，没说它们「朝哪」。本章补上方向：$C(A)$ 与 $N(A^{\\mathsf T})$ 互相垂直，$C(A^{\\mathsf T})$ 与 $N(A)$ 互相垂直。四个子空间不只是维数互补，而是把整个空间切成两块互相垂直的「房间」。这句话是全书最漂亮的结构之一。</p><p>垂直带来一个非常实用的能力：<b>投影</b>（projection）。给定一支箭头 $\\mathbf{b}$ 和一条直线或一个平面，问「在这个平面里，哪个点离 $\\mathbf{b}$ 最近」？答案就是 $\\mathbf{b}$ 的投影。求法只有一句话：<b>误差向量必须与平面垂直</b>。把这句话写成方程，就得到投影公式与最小二乘的正规方程。</p><p>为什么最小二乘重要？因为真实数据几乎总是「方程比未知数多」，$A\\mathbf{x}=\\mathbf{b}$ 往往无解。我们不可能让误差为零，那就让误差的平方和最小——这就是最小二乘（least squares）。从 GPS 定位、股票拟合到机器学习，全都在解同一个正规方程。本章最后再给两个工具：Gram–Schmidt 把任意基变成正交基，QR 分解把 $A$ 拆成「正交乘三角」，让最小二乘的计算变得又稳又快。</p>"
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "开始前你需要知道",
   "html": "<ul><li><b>点积与正交</b>：$\\mathbf{u}\\cdot\\mathbf{v}=\\sum u_iv_i$，点积为零即正交（<a href='#/ch01'>第 1 章</a> §1.2）。本章全部内容都从 $\\mathbf{u}\\cdot\\mathbf{v}=0$ 出发。</li><li><b>四个子空间</b>：$C(A)$、$N(A)$、$C(A^{\\mathsf T})$、$N(A^{\\mathsf T})$ 的定义与维数表（<a href='#/ch03'>第 3 章</a> §3.5）。记不清先回去看一眼那张表，本章会天天用它。</li><li><b>转置与对称</b>：$(AB)^{\\mathsf T}=B^{\\mathsf T}A^{\\mathsf T}$，$A^{\\mathsf T}A$ 永远对称（<a href='#/ch02'>第 2 章</a> §2.7）。</li><li><b>一个直觉</b>：垂线段最短。本章所有「最小」结论，本质都是这个中学结论的高维版本。</li><li><b>记号</b>：$\\mathbf{p}$ 表示投影向量，$\\mathbf{e}=\\mathbf{b}-\\mathbf{p}$ 表示误差向量，$P$ 表示投影矩阵，$\\hat{\\mathbf{x}}$ 表示最小二乘解（带帽表示「估计值」）。</li></ul>"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "先看一个例子：点到直线的最短距离",
   "id": "ch04-s1"
  },
  {
   "t": "p",
    "html": "平面上有一条过原点的直线，方向向量 $\\mathbf{a}=(1,1)$；直线外一点 $\\mathbf{b}=(4,3)$。问：直线上哪个点离 $\\mathbf{b}$ 最近？中学的做法是作垂线，垂足就是最近点。现在用向量的语言把这件事重做一遍，因为高维空间里「画垂线」画不出来，只能靠代数。"
  },
  {
   "t": "p",
    "html": "设最近点是 $\\mathbf{p}=\\lambda\\mathbf{a}$（在直线上，所以是 $\\mathbf{a}$ 的倍数）。令误差向量 $\\mathbf{e}=\\mathbf{b}-\\mathbf{p}$。几何直觉：如果 $\\mathbf{e}$ 不垂直于直线，那么沿直线方向稍微挪动 $\\mathbf{p}$，距离还能变小——所以「最近」的必要条件是 $\\mathbf{e}\\perp\\mathbf{a}$。把 $\\mathbf{a}\\cdot(\\mathbf{b}-\\lambda\\mathbf{a})=0$ 解出来：$\\mathbf{a}\\cdot\\mathbf{b}=\\lambda\\,\\mathbf{a}\\cdot\\mathbf{a}$，即"
  },
  {
   "t": "tex",
   "tex": "\\lambda=\\frac{\\mathbf{a}\\cdot\\mathbf{b}}{\\mathbf{a}\\cdot\\mathbf{a}}=\\frac{7}{2},\\qquad \\mathbf{p}=\\frac72(1,1)=(3.5,\\ 3.5)"
  },
  {
   "t": "p",
    "html": "验证：$\\mathbf{e}=\\mathbf{b}-\\mathbf{p}=(4,3)-(3.5,3.5)=(0.5,-0.5)$，与 $\\mathbf{a}=(1,1)$ 的点积为 $0.5-0.5=0$，确实垂直。距离 $\\lVert\\mathbf{e}\\rVert=\\sqrt{0.25+0.25}=\\frac{\\sqrt2}{2}\\approx0.707$。这比随意取的一个点（比如 $\\mathbf{p}=(4,4)$，距离 $\\sqrt{0+1}=1$）更近。"
  },
  {
   "t": "p",
    "html": "这个例子里藏着本章的全部种子。第一，<b>「最近」等价于「误差垂直」</b>：这是投影的判别条件，也是最小二乘正规方程的来源。第二，$\\mathbf{b}$ 被拆成两部分 $\\mathbf{b}=\\mathbf{p}+\\mathbf{e}$，前者在直线的方向上，后者与直线垂直——这叫<b>正交分解</b>（orthogonal decomposition）。第三，如果把「直线」换成「平面」，做法完全一样：只要把「$\\mathbf{e}$ 垂直于这条线」换成「$\\mathbf{e}$ 垂直于这个平面里的每一条线」。"
  },
  {
   "t": "p",
    "html": "再看一个更难的情形：解 $A\\mathbf{x}=\\mathbf{b}$ 时方程比未知数多，通常无解。这时退而求其次：在所有 $A\\mathbf{x}$ 里找一个离 $\\mathbf{b}$ 最近的，让它「最接近」满足方程。这个点就是 $\\mathbf{b}$ 在列空间 $C(A)$ 上的投影；对应的 $\\mathbf{x}$ 就是<b>最小二乘解</b>。所以本章的路线图是：先讲正交（§4.1），再讲投影到直线（§4.2），推广到子空间（§4.2），然后用它做最小二乘（§4.3），最后用 Gram–Schmidt 与 QR 让计算变漂亮（§4.4）。"
  },
  {
   "t": "quiz",
   "qid": "ch04-q1"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "§4.1 四个子空间的正交关系",
   "id": "ch04-s2"
  },
  {
   "t": "p",
    "html": "先定义「空间与空间垂直」。设 $U,V$ 是 $\\mathbb{R}^n$ 的两个子空间，如果 $U$ 里每一个向量都与 $V$ 里每一个向量正交，就说 $U\\perp V$。注意要求是「每一个对每一个」，只找到一对垂直的向量不算。若 $U\\perp V$ 且 $U\\cap V=\\{\\mathbf{0}\\}$，它们的和空间里没有重复方向；当 $U$ 与 $V$ 的维数之和恰好等于整个空间的维数时，和空间就是整个空间，此时称 $V$ 为 $U$ 的<b>正交补</b>（orthogonal complement），记 $V=U^{\\perp}$，并记 $\\mathbb{R}^n=U\\oplus V$。"
  },
  {
   "t": "p",
    "html": "现在看四个基本子空间。第一个正交关系来自矩阵乘法的定义：若 $\\mathbf{x}\\in N(A)$，则 $A\\mathbf{x}=\\mathbf{0}$，意思是 $A$ 的每一行与 $\\mathbf{x}$ 的点积都是 $0$；而 $C(A^{\\mathsf T})$ 恰好是这些行的所有组合张成的空间。所以 $\\mathbf{x}$ 与行空间里的每个向量都正交——$N(A)\\perp C(A^{\\mathsf T})$。"
  },
  {
   "t": "tex",
   "tex": "N(A)\\perp C(A^{\\mathsf T}),\\qquad N(A^{\\mathsf T})\\perp C(A)"
  },
  {
   "t": "p",
    "html": "第二个关系同理，只是把 $A$ 换成 $A^{\\mathsf T}$：若 $\\mathbf{y}\\in N(A^{\\mathsf T})$，则 $A^{\\mathsf T}\\mathbf{y}=\\mathbf{0}$，即 $\\mathbf{y}^{\\mathsf T}A=\\mathbf{0}$，说明 $\\mathbf{y}$ 与 $A$ 的每一列都正交，故 $\\mathbf{y}\\perp C(A)$。用严格一点的写法：任取 $\\mathbf{x}\\in N(A)$、$\\mathbf{y}\\in\\mathbb{R}^m$，则 $(A^{\\mathsf T}\\mathbf{y})\\cdot\\mathbf{x}=\\mathbf{y}^{\\mathsf T}A\\mathbf{x}=\\mathbf{y}^{\\mathsf T}\\mathbf{0}=0$，而 $A^{\\mathsf T}\\mathbf{y}$ 跑遍 $C(A^{\\mathsf T})$，所以 $N(A)$ 与整个行空间正交。"
  },
  {
   "t": "p",
    "html": "光有「正交」还不够，还要知道它们「恰好互补」。第 <a href='#/ch03'>3 章</a>的维数表给了答案：$\\dim C(A^{\\mathsf T})=\\dim C(A)=r$，$\\dim N(A)=n-r$，两者相加等于 $n$。在 $\\mathbb{R}^n$ 里，两个正交子空间的维数相加正好等于总维数，说明它们不但正交，而且「合起来铺满」整个空间：$\\mathbb{R}^n=C(A^{\\mathsf T})\\oplus N(A)$。类似地，在 $\\mathbb{R}^m$ 里 $\\mathbb{R}^m=C(A)\\oplus N(A^{\\mathsf T})$。"
  },
  {
   "t": "theorem",
   "name": "正交补分解",
   "zh": "四个子空间的正交关系",
   "rows": [
    {
     "k": "白话",
     "html": "行空间与零空间把输入空间 $\\mathbb{R}^n$ 一分为二、互相垂直；列空间与左零空间把输出空间 $\\mathbb{R}^m$ 一分为二、互相垂直。"
    },
    {
     "k": "条件",
     "html": "$A$ 是 $m\\times n$ 实矩阵，$r=\\operatorname{rank}(A)$。"
    },
    {
     "k": "结论",
     "html": "$N(A)=C(A^{\\mathsf T})^{\\perp}$，$C(A^{\\mathsf T})=N(A)^{\\perp}$；$N(A^{\\mathsf T})=C(A)^{\\perp}$，$C(A)=N(A^{\\mathsf T})^{\\perp}$。于是 $\\mathbb{R}^n=C(A^{\\mathsf T})\\oplus N(A)$，$\\mathbb{R}^m=C(A)\\oplus N(A^{\\mathsf T})$。"
    },
    {
     "k": "怎么用",
     "html": "这是「完整解 = 特解 + 零空间」的几何版：$\\mathbf{b}$ 在 $C(A)$ 上的投影唯一，误差落在 $N(A^{\\mathsf T})$ 里。第 <a href='#/ch07'>7 章</a>的 SVD 会把四个空间的正交基同时找出来。"
    },
    {
     "k": "证明",
     "html": "正交性：任取 $\\mathbf{x}\\in N(A)$ 与 $A^{\\mathsf T}\\mathbf{y}\\in C(A^{\\mathsf T})$，$(A^{\\mathsf T}\\mathbf{y})\\cdot\\mathbf{x}=\\mathbf{y}^{\\mathsf T}A\\mathbf{x}=0$，故 $N(A)\\perp C(A^{\\mathsf T})$。维数：$\\dim N(A)+\\dim C(A^{\\mathsf T})=(n-r)+r=n$。再证两者只在零向量处相交：若 $\\mathbf{w}$ 同时属于 $N(A)$ 与 $C(A^{\\mathsf T})$，由已证的正交性，$\\mathbf{w}$ 与 $\\mathbf{w}$ 自己正交，即 $\\lVert\\mathbf{w}\\rVert^2=0$，故 $\\mathbf{w}=\\mathbf{0}$。于是两个子空间之和的维数为 $n$，所以 $\\mathbb{R}^n=C(A^{\\mathsf T})\\oplus N(A)$，即 $N(A)=C(A^{\\mathsf T})^{\\perp}$。另一对把 $A$ 换成 $A^{\\mathsf T}$ 即可。"
    }
   ]
  },
  {
   "t": "p",
    "html": "把这张图在脑子里摆好：$A$ 把 $\\mathbb{R}^n$ 的每个向量送到 $\\mathbb{R}^m$。输入空间 $\\mathbb{R}^n$ 被分成行空间（$r$ 维）与零空间（$n-r$ 维）；矩阵把行空间一一对应到列空间，把零空间整体压成零。输出空间 $\\mathbb{R}^m$ 被分成列空间（$r$ 维）与左零空间（$m-r$ 维）。所谓「$A\\mathbf{x}=\\mathbf{b}$ 无解」，就是 $\\mathbf{b}$ 落在 $C(A)$ 外面，它的「影子」在列空间里，影子与原目标的差落在左零空间里——这正是下一节要算的投影。"
  },
  {
   "t": "p",
    "html": "用一个具体的矩阵把这张图核对一遍。取 $A=\\begin{bmatrix}1&2&3\\\\ 2&4&6\\end{bmatrix}$。列空间：三列都在直线 $\\operatorname{span}\\{(1,2)\\}$ 上，故 $C(A)$ 是 $\\mathbb{R}^2$ 中的一维直线。左零空间：解 $A^{\\mathsf T}\\mathbf{y}=\\mathbf{0}$，即 $y_1+2y_2=0$ 与 $2y_1+4y_2=0$（同解），得 $\\mathbf{y}=t(-2,1)$。验证 $(1,2)\\cdot(-2,1)=0$：两条直线确实垂直，$\\mathbb{R}^2=C(A)\\oplus N(A^{\\mathsf T})$。输入空间这边：$N(A)$ 是平面 $x_1+2x_2+3x_3=0$（二维），行空间是 $\\mathbb{R}^3$ 中的直线 $\\operatorname{span}\\{(1,2,3)\\}$（一维），平面方程本身告诉我们：$N(A)$ 由所有与 $(1,2,3)$ 正交的向量组成，而 $(1,2,3)$ 张成的正是行空间——这就是 $N(A)=C(A^{\\mathsf T})^{\\perp}$ 的具体样子。"
  },
  {
   "t": "quiz",
   "qid": "ch04-q2"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "§4.2 投影到一条直线",
   "id": "ch04-s3"
  },
  {
   "t": "p",
    "html": "先把最简单的投影算成公式。给定非零向量 $\\mathbf{a}\\in\\mathbb{R}^m$（它张成一条过原点的直线）与向量 $\\mathbf{b}$，要找直线上离 $\\mathbf{b}$ 最近的点 $\\mathbf{p}$。本章开头已经推出判别条件：$\\mathbf{p}=\\lambda\\mathbf{a}$ 且 $\\mathbf{e}=\\mathbf{b}-\\mathbf{p}\\perp\\mathbf{a}$。解这个条件："
  },
  {
   "t": "tex",
   "tex": "\\mathbf{a}\\cdot(\\mathbf{b}-\\lambda\\mathbf{a})=0\\ \\Longrightarrow\\ \\lambda=\\frac{\\mathbf{a}\\cdot\\mathbf{b}}{\\mathbf{a}\\cdot\\mathbf{a}},\\qquad \\mathbf{p}=\\frac{\\mathbf{a}\\cdot\\mathbf{b}}{\\mathbf{a}\\cdot\\mathbf{a}}\\,\\mathbf{a}"
  },
  {
   "t": "p",
    "html": "这个式子里每个量都要说清楚：分子 $\\mathbf{a}\\cdot\\mathbf{b}$ 是点积，可正可负，所以 $\\lambda$ 可正可负——投影点可以落在 $\\mathbf{a}$ 的反方向；分母 $\\mathbf{a}\\cdot\\mathbf{a}=\\lVert\\mathbf{a}\\rVert^2$ 一定为正（$\\mathbf{a}\\ne\\mathbf{0}$），所以不会除零。$\\mathbf{p}$ 叫 $\\mathbf{b}$ 在 $\\mathbf{a}$ 上的<b>投影向量</b>，$\\mathbf{e}=\\mathbf{b}-\\mathbf{p}$ 叫<b>误差向量</b>（也叫残差），它的长度就是点到直线的最短距离。"
  },
  {
   "t": "p",
    "html": "把公式写成矩阵乘法的形式，能看出更多结构。注意 $\\mathbf{a}\\cdot\\mathbf{b}=\\mathbf{a}^{\\mathsf T}\\mathbf{b}$ 是一个数，而 $\\mathbf{a}\\mathbf{a}^{\\mathsf T}$ 是一个 $m\\times m$ 矩阵，于是"
  },
  {
   "t": "tex",
   "tex": "\\mathbf{p}=\\mathbf{a}\\,\\frac{\\mathbf{a}^{\\mathsf T}\\mathbf{b}}{\\mathbf{a}^{\\mathsf T}\\mathbf{a}}=\\underbrace{\\frac{\\mathbf{a}\\mathbf{a}^{\\mathsf T}}{\\mathbf{a}^{\\mathsf T}\\mathbf{a}}}_{P}\\,\\mathbf{b}"
  },
  {
   "t": "p",
    "html": "这个 $P$ 叫<b>投影矩阵</b>（projection matrix）。它只与直线方向 $\\mathbf{a}$ 有关，与 $\\mathbf{b}$ 无关——换一个目标点，投影的方向不变，只是落点变了。$P$ 有两个必须验证的性质：$P^2=P$（对投影结果再投影一次，位置不动）与 $P^{\\mathsf T}=P$（对称）。动手验证：$P^2=\\frac{\\mathbf{a}\\mathbf{a}^{\\mathsf T}\\mathbf{a}\\mathbf{a}^{\\mathsf T}}{(\\mathbf{a}^{\\mathsf T}\\mathbf{a})^2}=\\frac{\\mathbf{a}(\\mathbf{a}^{\\mathsf T}\\mathbf{a})\\mathbf{a}^{\\mathsf T}}{(\\mathbf{a}^{\\mathsf T}\\mathbf{a})^2}=\\frac{\\mathbf{a}\\mathbf{a}^{\\mathsf T}}{\\mathbf{a}^{\\mathsf T}\\mathbf{a}}=P$；对称性来自 $(\\mathbf{a}\\mathbf{a}^{\\mathsf T})^{\\mathsf T}=\\mathbf{a}\\mathbf{a}^{\\mathsf T}$。"
  },
  {
   "t": "p",
    "html": "为什么投影点真的「最近」？前面用的是「如果不垂直就能更近」的直觉，现在给一个严格的一句话证明：设 $\\mathbf{p}$ 满足 $\\mathbf{e}=\\mathbf{b}-\\mathbf{p}\\perp\\mathbf{a}$，直线上任取另一个点 $\\mathbf{p}'=\\mathbf{p}+\\mathbf{z}$（$\\mathbf{z}$ 沿直线方向，故 $\\mathbf{z}\\perp\\mathbf{e}$），则 $\\lVert\\mathbf{b}-\\mathbf{p}'\\rVert^2=\\lVert\\mathbf{e}-\\mathbf{z}\\rVert^2=\\lVert\\mathbf{e}\\rVert^2+\\lVert\\mathbf{z}\\rVert^2\\ge\\lVert\\mathbf{e}\\rVert^2$，等号只在 $\\mathbf{z}=\\mathbf{0}$ 时成立。这就是勾股定理的向量版：直角三角形斜边最长。"
  },
  {
   "t": "theorem",
   "name": "投影到直线",
   "zh": "一维投影",
   "rows": [
    {
     "k": "白话",
     "html": "把 $\\mathbf{b}$ 的「影子」投到 $\\mathbf{a}$ 的方向上：影子长度是 $\\mathbf{b}$ 在 $\\mathbf{a}$ 方向上的分量，方向由 $\\mathbf{a}$ 决定。"
    },
    {
     "k": "条件",
     "html": "$\\mathbf{a}\\in\\mathbb{R}^m$ 是非零向量；$\\mathbf{b}\\in\\mathbb{R}^m$ 任意。"
    },
    {
     "k": "结论",
     "html": "$\\mathbf{p}=\\dfrac{\\mathbf{a}^{\\mathsf T}\\mathbf{b}}{\\mathbf{a}^{\\mathsf T}\\mathbf{a}}\\mathbf{a}=P\\mathbf{b}$，其中 $P=\\dfrac{\\mathbf{a}\\mathbf{a}^{\\mathsf T}}{\\mathbf{a}^{\\mathsf T}\\mathbf{a}}$；$\\mathbf{e}=\\mathbf{b}-\\mathbf{p}\\perp\\mathbf{a}$，且对直线上任意 $\\mathbf{p}'$ 有 $\\lVert\\mathbf{b}-\\mathbf{p}\\rVert\\le\\lVert\\mathbf{b}-\\mathbf{p}'\\rVert$。"
    },
    {
     "k": "怎么用",
     "html": "求点到直线的距离：先算 $\\mathbf{p}$，再算 $\\lVert\\mathbf{b}-\\mathbf{p}\\rVert$。记忆口诀：<b>分子是点积，分母是自己点自己</b>。$P^2=P$、$P^{\\mathsf T}=P$ 是投影矩阵的身份证。"
    },
    {
     "k": "证明",
     "html": "垂直条件唯一确定 $\\lambda$；最近性由勾股恒等式 $\\lVert\\mathbf{b}-\\mathbf{p}'\\rVert^2=\\lVert\\mathbf{e}\\rVert^2+\\lVert\\mathbf{p}'-\\mathbf{p}\\rVert^2\\ge\\lVert\\mathbf{e}\\rVert^2$ 给出。两步合起来即结论。"
    }
   ]
  },
  {
   "t": "lab",
   "id": "projection"
  },
  {
   "t": "p",
    "html": "实验台里拖动 $\\mathbf{b}$ 与直线方向 $\\mathbf{a}$，观察投影点怎样沿直线滑动、误差向量怎样始终保持垂直。请特别验证两件事：(1) 当 $\\mathbf{b}$ 与 $\\mathbf{a}$ 的夹角超过 $90^\\circ$ 时，投影点跑到原点的另一侧；(2) 当 $\\mathbf{b}$ 本身就在直线上时，误差为零。"
  },
  {
   "t": "example",
   "no": "4.1",
   "tag": "投影公式与投影矩阵",
   "fields": [
    {
     "k": "题目",
      "html": "设 $\\mathbf{a}=(1,2)$，$\\mathbf{b}=(3,1)$。(a) 求 $\\mathbf{b}$ 在 $\\mathbf{a}$ 上的投影 $\\mathbf{p}$ 与误差 $\\mathbf{e}$；(b) 写出投影矩阵 $P$ 并验证 $P^2=P$、$P^{\\mathsf T}=P$；(c) 求 $\\mathbf{b}$ 到直线 $\\operatorname{span}\\{\\mathbf{a}\\}$ 的最短距离。"
    },
    {
     "k": "思路",
      "html": "套一维投影公式：先算 $\\mathbf{a}^{\\mathsf T}\\mathbf{b}$ 与 $\\mathbf{a}^{\\mathsf T}\\mathbf{a}$，得到 $\\mathbf{p}$；再用 $P$ 乘 $\\mathbf{b}$ 对照。最后验证垂直与距离。"
    },
    {
     "k": "解答",
      "html": "<p>(a) $\\mathbf{a}^{\\mathsf T}\\mathbf{b}=1\\cdot3+2\\cdot1=5$，$\\mathbf{a}^{\\mathsf T}\\mathbf{a}=1^2+2^2=5$，故 $\\mathbf{p}=\\frac55(1,2)=(1,2)$，$\\mathbf{e}=(3,1)-(1,2)=(2,-1)$。验证：$\\mathbf{a}^{\\mathsf T}\\mathbf{e}=1\\cdot2+2\\cdot(-1)=0$，垂直。</p><p>(b) $P=\\dfrac{\\mathbf{a}\\mathbf{a}^{\\mathsf T}}{\\mathbf{a}^{\\mathsf T}\\mathbf{a}}=\\dfrac15\\begin{bmatrix}1\\\\ 2\\end{bmatrix}\\begin{bmatrix}1&2\\end{bmatrix}=\\dfrac15\\begin{bmatrix}1&2\\\\ 2&4\\end{bmatrix}$。验证 $P\\mathbf{b}=\\frac15(3+2,\\\\ 6+4)=(1,2)=\\mathbf{p}$。再算 $P^2=\\frac1{25}\\begin{bmatrix}1&2\\\\ 2&4\\end{bmatrix}\\begin{bmatrix}1&2\\\\ 2&4\\end{bmatrix}=\\frac1{25}\\begin{bmatrix}5&10\\\\ 10&20\\end{bmatrix}=\\frac15\\begin{bmatrix}1&2\\\\ 2&4\\end{bmatrix}=P$；由于 $P$ 关于主对角线对称，$P^{\\mathsf T}=P$。</p><p>(c) $\\lVert\\mathbf{e}\\rVert=\\sqrt{2^2+(-1)^2}=\\sqrt5$，所以最短距离为 $\\sqrt5$。</p>"
    },
    {
     "k": "点评",
     "html": "注意 $\\mathbf{p}=(1,2)$ 恰好等于 $\\mathbf{a}$：因为 $\\mathbf{a}^{\\mathsf T}\\mathbf{b}=\\mathbf{a}^{\\mathsf T}\\mathbf{a}$，投影系数 $\\lambda=1$，说明 $\\mathbf{b}$ 在 $\\mathbf{a}$ 方向上的分量恰好等于 $\\mathbf{a}$ 本身。计算 $P$ 时最常见错误是漏掉分母，或者把 $\\mathbf{a}\\mathbf{a}^{\\mathsf T}$ 写成 $\\mathbf{a}^{\\mathsf T}\\mathbf{a}$（后者是一个数）。判断投影算得对不对，最快的方法永远是验算 $\\mathbf{a}^{\\mathsf T}\\mathbf{e}=0$。"
    }
   ]
  },
  {
   "t": "quiz",
   "qid": "ch04-q3"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "§4.2 投影到子空间：投影矩阵公式",
   "id": "ch04-s4"
  },
  {
   "t": "p",
    "html": "直线是一维子空间。真实问题里的「约束」通常不止一个方向：无解的方程组有多少个方程，$C(A)$ 就有多少个方向。所以要把投影从「投到一条线」推广到「投到一个子空间」。设 $A$ 是 $m\\times n$ 矩阵，各列线性无关，则 $C(A)$ 是 $\\mathbb{R}^m$ 中的一个 $n$ 维子空间。目标：在 $C(A)$ 里找离 $\\mathbf{b}$ 最近的点 $\\mathbf{p}$。"
  },
  {
   "t": "p",
    "html": "因为 $\\mathbf{p}\\in C(A)$，它一定能写成 $\\mathbf{p}=A\\hat{\\mathbf{x}}$（$\\hat{\\mathbf{x}}\\in\\mathbb{R}^n$ 是那个「最佳系数」）。最近的条件还是同一句话：误差 $\\mathbf{e}=\\mathbf{b}-A\\hat{\\mathbf{x}}$ 必须垂直于整个子空间。垂直于整个 $C(A)$，等价于垂直于它的一组基——取 $A$ 的各列就够了："
  },
  {
   "t": "tex",
   "tex": "A^{\\mathsf T}(\\mathbf{b}-A\\hat{\\mathbf{x}})=\\mathbf{0}\\ \\Longleftrightarrow\\ \\underbrace{A^{\\mathsf T}A}_{n\\times n}\\hat{\\mathbf{x}}=A^{\\mathsf T}\\mathbf{b}"
  },
  {
   "t": "p",
    "html": "这个 $n\\times n$ 的方程叫<b>正规方程</b>（normal equations）。「正规」在这里不是「正常」的意思，而是「垂直」：它记录的是「残差与列空间正交」这个几何条件。若 $A^{\\mathsf T}A$ 可逆，解出 $\\hat{\\mathbf{x}}=(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}\\mathbf{b}$，投影就是 $\\mathbf{p}=A\\hat{\\mathbf{x}}$。把它写成「$\\mathbf{b}$ 乘一个矩阵」的形式："
  },
  {
   "t": "tex",
   "tex": "P=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}"
  },
  {
   "t": "p",
    "html": "形状检查：$A$ 是 $m\\times n$，$A^{\\mathsf T}A$ 是 $n\\times n$，它的逆也是 $n\\times n$，最右边的 $A^{\\mathsf T}$ 是 $n\\times m$；乘起来 $P$ 是 $m\\times m$。所以 $P$ 作用在 $\\mathbb{R}^m$ 的向量上，与「投影到 $\\mathbb{R}^m$ 的子空间」相符。注意 $A$ 不是方阵，$A^{-1}$ 根本不存在——公式里出现的逆永远是 $(A^{\\mathsf T}A)^{-1}$，这是最容易被写错的地方。"
  },
  {
   "t": "p",
    "html": "$A^{\\mathsf T}A$ 什么时候可逆？答案与列是否无关完全对应。若 $A^{\\mathsf T}A\\mathbf{x}=\\mathbf{0}$，两边左乘 $\\mathbf{x}^{\\mathsf T}$ 得 $\\mathbf{x}^{\\mathsf T}A^{\\mathsf T}A\\mathbf{x}=\\lVert A\\mathbf{x}\\rVert^2=0$，所以 $A\\mathbf{x}=\\mathbf{0}$；若 $A$ 的列线性无关，只有 $\\mathbf{x}=\\mathbf{0}$，说明 $A^{\\mathsf T}A$ 的零空间只有零向量，因此可逆。反过来，若列相关，存在非零 $\\mathbf{x}$ 使 $A\\mathbf{x}=\\mathbf{0}$，那么 $A^{\\mathsf T}A\\mathbf{x}=\\mathbf{0}$ 也有非零解，不可逆。这正是「最小二乘解唯一」的条件。"
  },
  {
   "t": "theorem",
   "name": "投影到子空间",
   "zh": "投影矩阵公式",
   "rows": [
    {
     "k": "白话",
     "html": "把 $\\mathbf{b}$ 投到 $A$ 的列空间上：先解正规方程找到最佳系数 $\\hat{\\mathbf{x}}$，再用 $A$ 把系数变回向量。投影矩阵 $P$ 只由列空间决定，与 $\\mathbf{b}$ 无关。"
    },
    {
     "k": "条件",
     "html": "$A$ 是 $m\\times n$ 矩阵，各列线性无关（于是 $A^{\\mathsf T}A$ 可逆）；$\\mathbf{b}\\in\\mathbb{R}^m$ 任意。"
    },
    {
     "k": "结论",
     "html": "$\\hat{\\mathbf{x}}=(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}\\mathbf{b}$，$\\mathbf{p}=A\\hat{\\mathbf{x}}=P\\mathbf{b}$，$P=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}$。残差 $\\mathbf{e}=\\mathbf{b}-\\mathbf{p}\\in N(A^{\\mathsf T})$，且 $\\mathbf{p}$ 是 $C(A)$ 中离 $\\mathbf{b}$ 最近的点。"
    },
    {
     "k": "怎么用",
     "html": "两步走：先算 $A^{\\mathsf T}A$ 与 $A^{\\mathsf T}\\mathbf{b}$ 解方程（比直接求逆快），再算 $\\mathbf{p}=A\\hat{\\mathbf{x}}$。检验投影是否算对，看 $A^{\\mathsf T}\\mathbf{e}=\\mathbf{0}$ 是否成立。"
    },
    {
     "k": "证明",
     "html": "设 $\\mathbf{p}=A\\hat{\\mathbf{x}}$ 是 $C(A)$ 中离 $\\mathbf{b}$ 最近的点。对任意 $\\mathbf{z}\\in\\mathbb{R}^n$，$\\lVert\\mathbf{b}-A(\\hat{\\mathbf{x}}+\\mathbf{z})\\rVert^2=\\lVert\\mathbf{e}-A\\mathbf{z}\\rVert^2=\\lVert\\mathbf{e}\\rVert^2-2\\mathbf{e}^{\\mathsf T}A\\mathbf{z}+\\lVert A\\mathbf{z}\\rVert^2$。若 $A^{\\mathsf T}\\mathbf{e}=\\mathbf{0}$，交叉项消失，右端 $\\ge\\lVert\\mathbf{e}\\rVert^2$，故 $\\hat{\\mathbf{x}}$ 最优。而 $A^{\\mathsf T}\\mathbf{e}=\\mathbf{0}$ 正是正规方程 $A^{\\mathsf T}(\\mathbf{b}-A\\hat{\\mathbf{x}})=\\mathbf{0}$；由列无关，$A^{\\mathsf T}A$ 可逆，解唯一，所以最近点存在且唯一。"
    }
   ]
  },
  {
   "t": "p",
    "html": "投影矩阵 $P$ 有三条「身份证」，做题时用来验证。第一，$P^2=P$：投影两次与投影一次相同，因为第一次的结果已经在子空间里，再投不动。第二，$P^{\\mathsf T}=P$：因为 $(A^{\\mathsf T}A)^{-1}$ 是对称矩阵（对称矩阵的逆仍对称，第 <a href='#/ch02'>2 章</a>），所以 $P^{\\mathsf T}=A((A^{\\mathsf T}A)^{-1})^{\\mathsf T}A^{\\mathsf T}=P$。第三，$P\\mathbf{b}\\in C(A)$ 而 $(I-P)\\mathbf{b}=\\mathbf{e}\\in N(A^{\\mathsf T})$：$I-P$ 是投影到正交补（左零空间）的投影矩阵。"
  },
  {
   "t": "example",
   "no": "4.2",
   "tag": "投影到列空间",
   "fields": [
    {
     "k": "题目",
      "html": "设 $A=\\begin{bmatrix}1&1\\\\ 1&0\\\\ 0&1\\end{bmatrix}$，$\\mathbf{b}=(1,2,3)$。(a) 解正规方程求 $\\hat{\\mathbf{x}}$；(b) 求投影 $\\mathbf{p}$ 并验证 $\\mathbf{e}\\perp C(A)$；(c) 写出投影矩阵 $P$。"
    },
    {
     "k": "思路",
      "html": "先算 $A^{\\mathsf T}A$ 与 $A^{\\mathsf T}\\mathbf{b}$，解 $2\\times2$ 方程；再算 $A\\hat{\\mathbf{x}}$；最后用 $A^{\\mathsf T}\\mathbf{e}=\\mathbf{0}$ 检验。"
    },
    {
     "k": "解答",
      "html": "<p>(a) $A^{\\mathsf T}A=\\begin{bmatrix}1&1&0\\\\ 1&0&1\\end{bmatrix}\\begin{bmatrix}1&1\\\\ 1&0\\\\ 0&1\\end{bmatrix}=\\begin{bmatrix}2&1\\\\ 1&2\\end{bmatrix}$；$A^{\\mathsf T}\\mathbf{b}=\\begin{bmatrix}1&1&0\\\\ 1&0&1\\end{bmatrix}\\begin{bmatrix}1\\\\ 2\\\\ 3\\end{bmatrix}=\\begin{bmatrix}3\\\\ 4\\end{bmatrix}$。解 $\\begin{bmatrix}2&1\\\\ 1&2\\end{bmatrix}\\hat{\\mathbf{x}}=\\begin{bmatrix}3\\\\ 4\\end{bmatrix}$：行列式 $3$，逆为 $\\frac13\\begin{bmatrix}2&-1\\\\ -1&2\\end{bmatrix}$，故 $\\hat{\\mathbf{x}}=\\frac13\\begin{bmatrix}2&-1\\\\ -1&2\\end{bmatrix}\\begin{bmatrix}3\\\\ 4\\end{bmatrix}=\\frac13\\begin{bmatrix}2\\\\ 5\\end{bmatrix}=\\left(\\frac23,\\frac53\\right)$。</p><p>(b) $\\mathbf{p}=A\\hat{\\mathbf{x}}=\\frac23(1,1,0)+\\frac53(1,0,1)=\\left(\\frac73,\\frac23,\\frac53\\right)$。$\\mathbf{e}=\\mathbf{b}-\\mathbf{p}=\\left(-\\frac43,\\frac43,\\frac43\\right)$。验证：$A^{\\mathsf T}\\mathbf{e}=\\left(-\\frac43+\\frac43+0,\\\\ -\\frac43+0+\\frac43\\right)=(0,0)$，垂直。</p><p>(c) $A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}=A\\cdot\\frac13\\begin{bmatrix}2&-1\\\\ -1&2\\end{bmatrix}A^{\\mathsf T}=\\frac13\\begin{bmatrix}2&1&1\\\\ 1&2&-1\\\\ 1&-1&2\\end{bmatrix}$。验算：$P\\mathbf{b}=\\frac13(2+2+3,\\\\ 1+4-3,\\\\ 1-2+6)=\\frac13(7,2,5)=\\mathbf{p}$，对。</p>"
    },
    {
     "k": "点评",
      "html": "别把 $\\mathbf{p}$ 与 $\\hat{\\mathbf{x}}$ 搞混：$\\mathbf{p}$ 是 $\\mathbb{R}^3$ 里离 $\\mathbf{b}$ 最近的点，$\\hat{\\mathbf{x}}$ 是 $\\mathbb{R}^2$ 里的系数，两者维数都不同。$P$ 的迹等于 $2$，恰好等于列数（秩），这不是巧合：投影矩阵的迹等于它投影到的子空间维数。最后注意 $\\mathbf{e}=(-4/3,4/3,4/3)$ 与 $A$ 的两列都正交，所以它落在左零空间里——这正是 §4.1 的分解图。"
    }
   ]
  },
  {
   "t": "quiz",
   "qid": "ch04-q4"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "§4.3 最小二乘：找不到精确解时找最好的",
   "id": "ch04-s5"
  },
  {
   "t": "p",
    "html": "现在把投影用于真实数据。当方程个数 $m$ 大于未知数个数 $n$ 时，$A\\mathbf{x}=\\mathbf{b}$ 通常无解：用 $n$ 个参数去满足 $m$ 个约束，条件太多，一般做不到。比如用一条直线拟合 5 个数据点，很难让 5 个点全在线上。既然精确解不存在，就退一步：找使 $\\lVert A\\mathbf{x}-\\mathbf{b}\\rVert$ 最小的 $\\mathbf{x}$。这个「使误差平方和最小」的解叫<b>最小二乘解</b>（least squares solution）。"
  },
  {
   "t": "p",
    "html": "为什么用「平方和」而不是「绝对值的和」？因为平方和可导、可写成点积，最优化条件变成线性方程——这是能用线性代数解决的唯一选择。注意 $\\lVert A\\mathbf{x}-\\mathbf{b}\\rVert^2$ 是 $m$ 项平方之和，最小化它与最小化 $\\lVert A\\mathbf{x}-\\mathbf{b}\\rVert$ 等价（平方在非负区间上单调）。"
  },
  {
   "t": "p",
    "html": "几何上，$A\\mathbf{x}$ 只能落在 $C(A)$ 里，而 $\\mathbf{b}$ 一般不在。让距离最小，就是让 $A\\mathbf{x}$ 取 $C(A)$ 中离 $\\mathbf{b}$ 最近的那个点——也就是投影 $\\mathbf{p}$。于是最小二乘问题被投影问题一次解决："
  },
  {
   "t": "tex",
   "tex": "\\hat{\\mathbf{x}}=\\arg\\min_{\\mathbf{x}}\\ \\lVert A\\mathbf{x}-\\mathbf{b}\\rVert^2\\quad\\Longleftrightarrow\\quad A^{\\mathsf T}A\\hat{\\mathbf{x}}=A^{\\mathsf T}\\mathbf{b},\\qquad \\mathbf{p}=A\\hat{\\mathbf{x}},\\quad \\mathbf{e}=\\mathbf{b}-\\mathbf{p}\\perp C(A)"
  },
  {
   "t": "p",
    "html": "最优点的判别条件仍然是「残差垂直于列空间」：只要 $\\mathbf{e}\\perp C(A)$，任何别的 $A\\mathbf{x}$ 都只会更远（勾股定理）。把它写成方程就是 $A^{\\mathsf T}\\mathbf{e}=\\mathbf{0}$，展开就是正规方程。它也给出四个基本子空间的另一种说法：残差 $\\mathbf{e}$ 落在 $N(A^{\\mathsf T})$ 里，与 $C(A)$ 正交；而 $\\mathbf{p}$ 落在 $C(A)$ 里。$\\mathbf{b}=\\mathbf{p}+\\mathbf{e}$ 就是 $\\mathbf{b}$ 在 $\\mathbb{R}^m$ 中的正交分解。"
  },
  {
   "t": "p",
    "html": "最典型的应用是<b>拟合直线</b>。给定 $m$ 个数据点 $(t_1,b_1),\\dots,(t_m,b_m)$，想找一条直线 $y=C+Dt$ 使它「最贴近」这些点。把每个数据点代进直线方程，得到 $C+Dt_i=b_i$，这是关于 $(C,D)$ 的 $m$ 个方程、两个未知数。写成矩阵：设计矩阵 $A$ 的第一列全是 $1$，第二列是 $t_i$；未知向量 $\\mathbf{x}=(C,D)$。正规方程 $A^{\\mathsf T}A\\mathbf{x}=A^{\\mathsf T}\\mathbf{b}$ 是一个 $2\\times2$ 方程组，解出 $C,D$ 后，$y=C+Dt$ 就是拟合直线。"
  },
  {
   "t": "theorem",
   "name": "正规方程",
   "zh": "最小二乘解",
   "rows": [
    {
     "k": "白话",
     "html": "误差最小的那一组参数，满足「残差与 $A$ 的每一列都正交」。把这句话写成方程就是 $A^{\\mathsf T}A\\hat{\\mathbf{x}}=A^{\\mathsf T}\\mathbf{b}$。"
    },
    {
     "k": "条件",
     "html": "$A$ 是 $m\\times n$ 矩阵（通常 $m\\gt n$），各列线性无关，于是 $A^{\\mathsf T}A$ 可逆；$\\mathbf{b}\\in\\mathbb{R}^m$。"
    },
    {
     "k": "结论",
     "html": "最小二乘解唯一，为 $\\hat{\\mathbf{x}}=(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}\\mathbf{b}$；最小残差平方和为 $\\lVert\\mathbf{b}-A\\hat{\\mathbf{x}}\\rVert^2$，且 $A^{\\mathsf T}(\\mathbf{b}-A\\hat{\\mathbf{x}})=\\mathbf{0}$。"
    },
    {
     "k": "怎么用",
     "html": "实际计算从不真的求逆：先拼 $A^{\\mathsf T}A$（$n\\times n$ 小矩阵）与 $A^{\\mathsf T}\\mathbf{b}$，解这个 $n$ 元方程组；$n$ 很小时手算也很快。拟合直线时 $A$ 的两列分别是 $1$ 与 $t_i$。"
    },
    {
     "k": "证明",
     "html": "设 $\\hat{\\mathbf{x}}$ 满足 $A^{\\mathsf T}(\\mathbf{b}-A\\hat{\\mathbf{x}})=\\mathbf{0}$，记 $\\mathbf{e}=\\mathbf{b}-A\\hat{\\mathbf{x}}$。对任意 $\\mathbf{x}$，$\\lVert\\mathbf{b}-A\\mathbf{x}\\rVert^2=\\lVert\\mathbf{e}+A(\\hat{\\mathbf{x}}-\\mathbf{x})\\rVert^2=\\lVert\\mathbf{e}\\rVert^2+2\\mathbf{e}^{\\mathsf T}A(\\hat{\\mathbf{x}}-\\mathbf{x})+\\lVert A(\\hat{\\mathbf{x}}-\\mathbf{x})\\rVert^2$。由 $A^{\\mathsf T}\\mathbf{e}=\\mathbf{0}$，中间项为零，故右端 $\\ge\\lVert\\mathbf{e}\\rVert^2$，等号仅在 $A(\\hat{\\mathbf{x}}-\\mathbf{x})=\\mathbf{0}$ 时成立；列无关保证此时 $\\mathbf{x}=\\hat{\\mathbf{x}}$，所以最小点唯一。"
    }
   ]
  },
  {
   "t": "lab",
   "id": "leastsquares"
  },
  {
   "t": "p",
    "html": "实验台里给出一组散点，拖动拟合直线的两个参数，读数条实时显示残差平方和。把直线拖到「看起来最好」的位置，再与正规方程算出的最优直线对照——你会发现眼睛判断的最优点与公式给出的一致。切换数据点，观察拟合直线怎么随数据移动。"
  },
  {
   "t": "example",
   "no": "4.3",
   "tag": "最小二乘拟合直线",
   "fields": [
    {
     "k": "题目",
      "html": "已知三个数据点 $(0,1)$、$(1,2)$、$(2,4)$，用最小二乘拟合直线 $y=C+Dt$。(a) 写出设计矩阵 $A$ 与向量 $\\mathbf{b}$；(b) 解正规方程求 $C,D$；(c) 求残差、残差平方和，并验证残差与 $A$ 的列正交。"
    },
    {
     "k": "思路",
      "html": "每个点给一个方程 $C+Dt_i=b_i$，按 $t_i$ 排成矩阵。正规方程是 $2\\times2$ 的，直接解；残差逐点算，最后把两个残差加权求和检验正交条件。"
    },
    {
     "k": "解答",
      "html": "<p>(a) $A=\\begin{bmatrix}1&0\\\\ 1&1\\\\ 1&2\\end{bmatrix}$，$\\mathbf{b}=\\begin{bmatrix}1\\\\ 2\\\\ 4\\end{bmatrix}$。</p><p>(b) $A^{\\mathsf T}A=\\begin{bmatrix}3&3\\\\ 3&5\\end{bmatrix}$，$A^{\\mathsf T}\\mathbf{b}=\\begin{bmatrix}1+2+4\\\\ 0+2+8\\end{bmatrix}=\\begin{bmatrix}7\\\\ 10\\end{bmatrix}$。解 $\\begin{cases}3C+3D=7\\\\ 3C+5D=10\\end{cases}$：两式相减得 $2D=3$，$D=\\frac32$；代回得 $3C=7-\\frac92=\\frac52$，$C=\\frac56$。拟合直线为 $y=\\frac56+\\frac32t$。</p><p>(c) 预测值：$t=0$ 时 $\\frac56$，残差 $1-\\frac56=\\frac16$；$t=1$ 时 $\\frac56+\\frac96=\\frac{14}{6}=\\frac73$，残差 $2-\\frac73=-\\frac13$；$t=2$ 时 $\\frac56+3=\\frac{23}{6}$，残差 $4-\\frac{23}{6}=\\frac16$。残差向量 $\\mathbf{e}=\\left(\\frac16,-\\frac13,\\frac16\\right)$，残差平方和 $=\\frac1{36}+\\frac19+\\frac1{36}=\\frac6{36}=\\frac16$。</p><p>验证：$A^{\\mathsf T}\\mathbf{e}=\\left(\\frac16-\\frac13+\\frac16,\\\\ 0-\\frac13+\\frac13\\right)=(0,0)$，正交成立。</p>"
    },
    {
     "k": "点评",
      "html": "本题数据点不在一条直线上（三点斜率分别是 $1$ 与 $2$），所以精确解不存在；最小二乘给出的直线从三个点中间「穿过」。注意 $\\hat{\\mathbf{x}}$ 的两个分量是 $C$ 与 $D$，顺序由设计矩阵的列决定：第一列是常数项，第二列是 $t$，顺序颠倒答案就全错。残差之和为零、残差与 $t$ 的加权和为零，是任何最小二乘拟合直线的两个必然结果。"
    }
   ]
  },
  {
   "t": "quiz",
   "qid": "ch04-q5"
  },
  {
   "t": "quiz",
   "qid": "ch04-q6"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "§4.4 正交基与 Gram–Schmidt",
   "id": "ch04-s6"
  },
  {
   "t": "p",
    "html": "换一组基，同一个子空间的「坐标」会变，但有个选择能让所有计算都变简单：让基向量两两正交、长度都为 $1$。这样的基叫<b>标准正交基</b>（orthonormal basis）：$\\mathbf{q}_i\\cdot\\mathbf{q}_j=0$（$i\\ne j$），$\\lVert\\mathbf{q}_i\\rVert=1$。$\\mathbb{R}^3$ 的标准基 $\\mathbf{e}_1,\\mathbf{e}_2,\\mathbf{e}_3$ 就是最熟悉的例子。"
  },
  {
   "t": "p",
    "html": "好在哪？两件事。第一，写坐标不用解方程：任何 $\\mathbf{v}$ 在标准正交基下的系数直接就是点积："
  },
  {
   "t": "tex",
   "tex": "\\mathbf{v}=(\\mathbf{q}_1\\cdot\\mathbf{v})\\mathbf{q}_1+(\\mathbf{q}_2\\cdot\\mathbf{v})\\mathbf{q}_2+\\cdots+(\\mathbf{q}_n\\cdot\\mathbf{v})\\mathbf{q}_n"
  },
  {
   "t": "p",
    "html": "道理：两边与 $\\mathbf{q}_j$ 点积，正交性把其他项全部消掉，只剩 $\\mathbf{q}_j\\cdot\\mathbf{v}=\\mathbf{q}_j\\cdot(\\mathbf{q}_j\\cdot\\mathbf{v})\\mathbf{q}_j$ 这一项（用了 $\\lVert\\mathbf{q}_j\\rVert^2=1$）。第二，投影到子空间不用求逆：子空间若有一组标准正交基 $\\mathbf{q}_1,\\dots,\\mathbf{q}_k$，投影就是各方向投影之和 $\\mathbf{p}=(\\mathbf{q}_1^{\\mathsf T}\\mathbf{b})\\mathbf{q}_1+\\cdots+(\\mathbf{q}_k^{\\mathsf T}\\mathbf{b})\\mathbf{q}_k$——$A^{\\mathsf T}A=I$，逆自动消失。"
  },
  {
   "t": "p",
    "html": "问题是：给定一组线性无关的向量 $\\mathbf{a}_1,\\dots,\\mathbf{a}_k$，怎么造出张成同一子空间的标准正交基？方法叫 <b>Gram–Schmidt</b>（格拉姆-施密特），思路是「来一个，减掉已经占用的方向，再单位化」。"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "第一个方向",
     "html": "取 $\\mathbf{q}_1=\\dfrac{\\mathbf{a}_1}{\\lVert\\mathbf{a}_1\\rVert}$。它就是 $\\mathbf{a}_1$ 方向上的单位向量。"
    },
    {
     "title": "第二个方向",
     "html": "先去掉 $\\mathbf{a}_2$ 在 $\\mathbf{q}_1$ 上的分量：$\\mathbf{b}_2=\\mathbf{a}_2-(\\mathbf{q}_1^{\\mathsf T}\\mathbf{a}_2)\\mathbf{q}_1$，再单位化 $\\mathbf{q}_2=\\mathbf{b}_2/\\lVert\\mathbf{b}_2\\rVert$。"
    },
    {
     "title": "第 j 个方向",
     "html": "减掉前面所有方向的投影：$\\mathbf{b}_j=\\mathbf{a}_j-\\sum_{i\\lt j}(\\mathbf{q}_i^{\\mathsf T}\\mathbf{a}_j)\\mathbf{q}_i$，再单位化 $\\mathbf{q}_j=\\mathbf{b}_j/\\lVert\\mathbf{b}_j\\rVert$。"
    },
    {
     "title": "检查",
     "html": "每一步的 $\\mathbf{q}_j$ 都与之前的 $\\mathbf{q}_i$ 正交（与 $\\mathbf{q}_i$ 点积时，$\\mathbf{a}_j$ 的投影项正好抵消），且每个 $\\mathbf{a}_j$ 都能由 $\\mathbf{q}_1,\\dots,\\mathbf{q}_j$ 组合出来，所以张成空间不变。"
    }
   ]
  },
  {
   "t": "theorem",
   "name": "Gram–Schmidt 正交化",
   "zh": "GS 过程",
   "rows": [
    {
     "k": "白话",
     "html": "拿第一支当基准；以后每拿一支新的，先减掉它在已有方向上的投影，剩下的部分自然与已有方向垂直；最后单位化。"
    },
    {
     "k": "条件",
     "html": "$\\mathbf{a}_1,\\dots,\\mathbf{a}_k$ 线性无关。"
    },
    {
     "k": "结论",
     "html": "按上式得到的 $\\mathbf{q}_1,\\dots,\\mathbf{q}_k$ 是标准正交组，且对每个 $j$ 有 $\\operatorname{span}\\{\\mathbf{q}_1,\\dots,\\mathbf{q}_j\\}=\\operatorname{span}\\{\\mathbf{a}_1,\\dots,\\mathbf{a}_j\\}$。"
    },
    {
     "k": "怎么用",
     "html": "正交基让投影、最小二乘、特征向量正交化都变简单；第 <a href='#/ch07'>7 章</a>的 SVD 与第 <a href='#/ch06'>6 章</a>对称矩阵的对角化都要用它。手算时每算出一个 $\\mathbf{q}_j$ 就顺手验算与前面各向量的点积为 $0$。"
    },
    {
     "k": "证明",
     "html": "对 $j$ 归纳。$\\mathbf{b}_j$ 是 $\\mathbf{a}_j$ 减去它在 $\\mathbf{q}_1,\\dots,\\mathbf{q}_{j-1}$ 上的投影，所以 $\\mathbf{b}_j$ 与每个 $\\mathbf{q}_i$（$i\\lt j$）点积为零；归一化不改变方向。张成空间：$\\mathbf{q}_j$ 是 $\\mathbf{a}_1,\\dots,\\mathbf{a}_j$ 的组合，$\\mathbf{a}_j$ 也是 $\\mathbf{q}_1,\\dots,\\mathbf{q}_j$ 的组合（把减法移项），两个方向互相包含，故张成相同。线性无关保证 $\\mathbf{b}_j\\ne\\mathbf{0}$，正交化不会除以零。"
    }
   ]
  },
  {
   "t": "lab",
   "id": "gramschmidt"
  },
  {
   "t": "p",
    "html": "实验台里逐步执行 Gram–Schmidt：每点一次按钮，就减掉一个方向的投影并单位化。请盯着误差向量与已构造的 $\\mathbf{q}_i$，确认它们始终垂直；再改变输入向量，观察当输入接近线性相关时，$\\lVert\\mathbf{b}_j\\rVert$ 会变得很小——这就是数值上要小心的信号。"
  },
  {
   "t": "example",
   "no": "4.4",
   "tag": "Gram–Schmidt 手算",
   "fields": [
    {
     "k": "题目",
      "html": "设 $\\mathbf{a}_1=(1,1,0)$、$\\mathbf{a}_2=(1,0,1)$、$\\mathbf{a}_3=(0,1,1)$。用 Gram–Schmidt 求标准正交基 $\\mathbf{q}_1,\\mathbf{q}_2,\\mathbf{q}_3$，并验算正交性。"
    },
    {
     "k": "思路",
      "html": "先归一化 $\\mathbf{a}_1$；第二个减掉在 $\\mathbf{q}_1$ 上的投影再归一化；第三个减掉在 $\\mathbf{q}_1,\\mathbf{q}_2$ 上的投影再归一化。全程保留根号形式，避免舍入误差。"
    },
    {
     "k": "解答",
      "html": "<p>第一步：$\\lVert\\mathbf{a}_1\\rVert=\\sqrt2$，$\\mathbf{q}_1=\\left(\\frac1{\\sqrt2},\\frac1{\\sqrt2},0\\right)$。</p><p>第二步：$\\mathbf{q}_1^{\\mathsf T}\\mathbf{a}_2=\\frac1{\\sqrt2}$，$\\mathbf{b}_2=(1,0,1)-\\frac1{\\sqrt2}\\left(\\frac1{\\sqrt2},\\frac1{\\sqrt2},0\\right)=\\left(\\frac12,-\\frac12,1\\right)$，$\\lVert\\mathbf{b}_2\\rVert=\\sqrt{\\frac14+\\frac14+1}=\\sqrt{\\frac32}$，$\\mathbf{q}_2=\\left(\\frac1{\\sqrt6},-\\frac1{\\sqrt6},\\frac2{\\sqrt6}\\right)$。</p><p>第三步：$\\mathbf{q}_1^{\\mathsf T}\\mathbf{a}_3=\\frac1{\\sqrt2}$，$\\mathbf{q}_2^{\\mathsf T}\\mathbf{a}_3=\\frac1{\\sqrt6}$，$\\mathbf{b}_3=(0,1,1)-\\frac1{\\sqrt2}\\mathbf{q}_1-\\frac1{\\sqrt6}\\mathbf{q}_2=\\left(-\\frac23,\\frac23,\\frac23\\right)$，$\\lVert\\mathbf{b}_3\\rVert=\\sqrt{\\frac49+\\frac49+\\frac49}=\\frac2{\\sqrt3}$，$\\mathbf{q}_3=\\left(-\\frac1{\\sqrt3},\\frac1{\\sqrt3},\\frac1{\\sqrt3}\\right)$。</p><p>验算：$\\mathbf{q}_1^{\\mathsf T}\\mathbf{q}_2=\\frac1{\\sqrt{12}}-\\frac1{\\sqrt{12}}+0=0$；$\\mathbf{q}_1^{\\mathsf T}\\mathbf{q}_3=-\\frac1{\\sqrt6}+\\frac1{\\sqrt6}=0$；$\\mathbf{q}_2^{\\mathsf T}\\mathbf{q}_3=\\frac{-1-1+2}{\\sqrt{18}}=0$；长度平方均为 $1$。</p>"
    },
    {
     "k": "点评",
      "html": "三个最常见的错误：忘记单位化（只正交不标准）；减投影时符号写成加号；分母用成 $\\mathbf{q}_i^{\\mathsf T}\\mathbf{q}_i$（它是 $1$，没必要写）。本题的 $\\mathbf{b}_3$ 三个分量绝对值相等，不是巧合：三个输入向量高度对称，正交化后各方向「分量均匀」。留根号不要中途化小数，否则最后验算对不上。"
    }
   ]
  },
  {
   "t": "quiz",
   "qid": "ch04-q7"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "§4.4 QR 分解与正交矩阵",
   "id": "ch04-s7"
  },
  {
   "t": "p",
    "html": "把 Gram–Schmidt 写成矩阵语言，就得到本章最后一个分解。设 $A$ 是 $m\\times n$ 且各列线性无关，$\\mathbf{q}_1,\\dots,\\mathbf{q}_n$ 是它的列经 Gram–Schmidt 得到的标准正交基，把这些 $\\mathbf{q}_j$ 并排成 $Q$（$m\\times n$）。因为每个 $\\mathbf{a}_j$ 都能用 $\\mathbf{q}_1,\\dots,\\mathbf{q}_j$ 表示（Gram–Schmidt 的张成不变性），所以"
  },
  {
   "t": "tex",
   "tex": "A=QR,\\qquad Q^{\\mathsf T}Q=I,\\qquad R=\\begin{bmatrix}r_{11}&r_{12}&\\cdots&r_{1n}\\\\ 0&r_{22}&\\cdots&r_{2n}\\\\ \\vdots&\\vdots&\\ddots&\\vdots\\\\ 0&0&\\cdots&r_{nn}\\end{bmatrix}"
  },
  {
   "t": "p",
    "html": "其中 $R$ 是 $n\\times n$ 上三角矩阵，$r_{ij}=\\mathbf{q}_i^{\\mathsf T}\\mathbf{a}_j$（$i\\le j$）；对角线 $r_{jj}=\\lVert\\mathbf{b}_j\\rVert\\gt0$（$\\mathbf{b}_j$ 是正交化过程中未单位化的向量），所以对角线全为正。$i\\gt j$ 的位置为 $0$，因为 $\\mathbf{a}_j$ 只用前 $j$ 个 $\\mathbf{q}$ 表示。$Q$ 的列标准正交，所以 $Q^{\\mathsf T}Q=I_n$（注意不是 $QQ^{\\mathsf T}=I_m$，$Q$ 不是方阵时后者不成立）。"
  },
  {
   "t": "p",
    "html": "用上一节例 4.4 的数据可以写出 $R$：$r_{11}=\\mathbf{q}_1^{\\mathsf T}\\mathbf{a}_1=\\sqrt2$；$r_{12}=\\mathbf{q}_1^{\\mathsf T}\\mathbf{a}_2=\\frac1{\\sqrt2}$，$r_{22}=\\mathbf{q}_2^{\\mathsf T}\\mathbf{a}_2=\\frac3{\\sqrt6}$；$r_{13}=\\mathbf{q}_1^{\\mathsf T}\\mathbf{a}_3=\\frac1{\\sqrt2}$，$r_{23}=\\mathbf{q}_2^{\\mathsf T}\\mathbf{a}_3=\\frac1{\\sqrt6}$，$r_{33}=\\mathbf{q}_3^{\\mathsf T}\\mathbf{a}_3=\\frac2{\\sqrt3}$。于是"
  },
  {
   "t": "tex",
   "tex": "R=\\begin{bmatrix}\\sqrt2&\\frac1{\\sqrt2}&\\frac1{\\sqrt2}\\\\ 0&\\frac3{\\sqrt6}&\\frac1{\\sqrt6}\\\\ 0&0&\\frac2{\\sqrt3}\\end{bmatrix}"
  },
  {
   "t": "p",
    "html": "QR 分解最直接的用处，是让最小二乘变得又简单又稳定。把 $A=QR$ 代入正规方程：$A^{\\mathsf T}A=R^{\\mathsf T}Q^{\\mathsf T}QR=R^{\\mathsf T}R$，$A^{\\mathsf T}\\mathbf{b}=R^{\\mathsf T}Q^{\\mathsf T}\\mathbf{b}$，两边消去可逆的 $R^{\\mathsf T}$ 得"
  },
  {
   "t": "tex",
   "tex": "R\\hat{\\mathbf{x}}=Q^{\\mathsf T}\\mathbf{b}"
  },
  {
   "t": "p",
    "html": "右边只需一次矩阵乘向量，$R$ 是上三角，解它只需回代——不用构造 $A^{\\mathsf T}A$，也就避免了「平方条件数」的数值损失。这是数值线性代数里解最小二乘的标准做法，第 <a href='#/ch11'>11 章</a>会详细比较它与正规方程法的稳定性差别。"
  },
  {
   "t": "p",
    "html": "最后认识一类特殊矩阵。若方阵 $Q$ 满足 $Q^{\\mathsf T}Q=I$，叫<b>正交矩阵</b>（orthogonal matrix）；等价说法是 $Q^{-1}=Q^{\\mathsf T}$，也就是「逆矩阵恰好是转置」。它的列（同时也行）构成 $\\mathbb{R}^n$ 的标准正交基。旋转矩阵是最常见的例子，例如旋转 $30^\\circ$ 的矩阵 $Q=\\begin{bmatrix}\\frac{\\sqrt3}2&-\\frac12\\\\ \\frac12&\\frac{\\sqrt3}2\\end{bmatrix}$，两列都是单位向量且互相垂直。"
  },
  {
   "t": "theorem",
   "name": "正交矩阵",
   "zh": "保长度、保内积",
   "rows": [
    {
     "k": "白话",
     "html": "正交矩阵是「只旋转、不伸缩、不剪切」的动作：它把长度、夹角、点积全部原样保留。"
    },
    {
     "k": "条件",
     "html": "$Q$ 是 $n\\times n$ 实方阵，且 $Q^{\\mathsf T}Q=I$（等价于 $QQ^{\\mathsf T}=I$）。"
    },
    {
     "k": "结论",
     "html": "$Q^{-1}=Q^{\\mathsf T}$；$\\lVert Q\\mathbf{x}\\rVert=\\lVert\\mathbf{x}\\rVert$；$(Q\\mathbf{x})\\cdot(Q\\mathbf{y})=\\mathbf{x}\\cdot\\mathbf{y}$；$Q$ 的列与行都是标准正交基；两个正交矩阵的乘积仍是正交矩阵。"
    },
    {
     "k": "怎么用",
     "html": "正交矩阵把问题换到「同样好算」的坐标系里：第 <a href='#/ch06'>6 章</a>对称矩阵可被正交矩阵对角化，第 <a href='#/ch07'>7 章</a> SVD 的两端都是正交矩阵。第 <a href='#/ch05'>5 章</a>还会证明 $\\lvert\\det(Q)\\rvert=1$。"
    },
    {
     "k": "证明",
     "html": "逆：$Q^{\\mathsf T}Q=I$ 说明 $Q^{\\mathsf T}$ 是 $Q$ 的左逆，方阵的左逆即右逆，故 $Q^{-1}=Q^{\\mathsf T}$。长度：$\\lVert Q\\mathbf{x}\\rVert^2=(Q\\mathbf{x})^{\\mathsf T}(Q\\mathbf{x})=\\mathbf{x}^{\\mathsf T}Q^{\\mathsf T}Q\\mathbf{x}=\\mathbf{x}^{\\mathsf T}\\mathbf{x}=\\lVert\\mathbf{x}\\rVert^2$。内积：$(Q\\mathbf{x})^{\\mathsf T}(Q\\mathbf{y})=\\mathbf{x}^{\\mathsf T}Q^{\\mathsf T}Q\\mathbf{y}=\\mathbf{x}^{\\mathsf T}\\mathbf{y}$。乘积：$(Q_1Q_2)^{\\mathsf T}(Q_1Q_2)=Q_2^{\\mathsf T}Q_1^{\\mathsf T}Q_1Q_2=Q_2^{\\mathsf T}Q_2=I$。"
    }
   ]
  },
  {
   "t": "example",
   "no": "4.5",
   "tag": "判断正交矩阵",
   "fields": [
    {
     "k": "题目",
      "html": "(a) 判断 $Q=\\begin{bmatrix}\\frac{\\sqrt3}2&-\\frac12\\\\ \\frac12&\\frac{\\sqrt3}2\\end{bmatrix}$ 是否为正交矩阵；(b) 判断 $B=\\begin{bmatrix}1&1\\\\ 0&1\\end{bmatrix}$ 是否为正交矩阵；(c) 用 $\\mathbf{x}=(1,0)$、$\\mathbf{y}=(0,1)$ 验证 $Q$ 保长度与内积。"
    },
    {
     "k": "思路",
      "html": "正交矩阵的定义是 $Q^{\\mathsf T}Q=I$。最省事的做法是看两列是否标准正交：长度是否为 $1$、点积是否为 $0$。"
    },
    {
     "k": "解答",
      "html": "<p>(a) 第一列长度平方 $\\frac34+\\frac14=1$；第二列长度平方 $\\frac14+\\frac34=1$；两列点积 $\\frac{\\sqrt3}2\\cdot\\left(-\\frac12\\right)+\\frac12\\cdot\\frac{\\sqrt3}2=0$。所以 $Q^{\\mathsf T}Q=I$，是正交矩阵。</p><p>(b) 第一列长度平方 $1$，第二列长度平方 $2\\ne1$，不标准；且 $B^{\\mathsf T}B=\\begin{bmatrix}1&1\\\\ 1&2\\end{bmatrix}\\ne I$。所以不是正交矩阵。</p><p>(c) $Q\\mathbf{x}=\\left(\\frac{\\sqrt3}2,\\frac12\\right)$，长度 $=\\sqrt{\\frac34+\\frac14}=1=\\lVert\\mathbf{x}\\rVert$；$Q\\mathbf{y}=\\left(-\\frac12,\\frac{\\sqrt3}2\\right)$，长度也为 $1$；$(Q\\mathbf{x})\\cdot(Q\\mathbf{y})=-\\frac{\\sqrt3}4+\\frac{\\sqrt3}4=0=\\mathbf{x}\\cdot\\mathbf{y}$，保内积成立。</p>"
    },
    {
     "k": "点评",
     "html": "$B$ 是一个「剪切」矩阵：它把 $\\mathbf{x}$ 保持不动、把 $\\mathbf{y}$ 推到 $(1,1)$，长度从 $1$ 变成 $\\sqrt2$——这就是不正交的代价。判断时不要只看「行列式是否为 $\\pm1$」：$B$ 的 $\\det=1$，但它不是正交矩阵。正交性比行列式更强，必须逐列验证标准正交。"
    }
   ]
  },
  {
   "t": "p",
    "html": "正交矩阵在几何里只有两种长相：<b>旋转</b>与<b>反射</b>（以及它们的复合）。旋转保持手性，$\\det(Q)=1$；反射翻转手性，$\\det(Q)=-1$。第 <a href='#/ch05'>5 章</a>会证明正交矩阵的行列式只能是 $\\pm1$，这正是「不伸缩」的另一种说法：体积的缩放比例是 $1$。高维还有一个漂亮例子：把 $\\pm1$ 按特定方式排成矩阵（Hadamard 矩阵），它的列两两正交，常用于信号处理与编码。本章只需要记住：正交矩阵是「换坐标但不改变几何」的动作，所以它既能化简计算，又不会把最小二乘的误差放大。"
  },
  {
   "t": "quiz",
   "qid": "ch04-q8"
  },
  {
   "t": "p",
    "html": "本章从「点到直线最短距离」出发，最后得到了三件武器。第一，<b>正交判定</b>：点积为零；四个子空间按 $C(A)\\perp N(A^{\\mathsf T})$、$C(A^{\\mathsf T})\\perp N(A)$ 配对。第二，<b>投影</b>：误差垂直于子空间是「最近」的充要条件，它给出投影矩阵 $P=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}$ 与性质 $P^2=P$、$P^{\\mathsf T}=P$。第三，<b>正交化</b>：Gram–Schmidt 把任意基变成标准正交基，写成矩阵就是 $A=QR$。当 $A$ 的列标准正交时，投影公式里的逆消失，最小二乘变成 $R\\hat{\\mathbf{x}}=Q^{\\mathsf T}\\mathbf{b}$——这是数值上最稳定的解法。第 <a href='#/ch05'>5 章</a>会回头补一个数：行列式，它能一句话判定正交矩阵的 $\\det$ 只能是 $\\pm1$，也能把本章的「体积」直觉说清楚。"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "正交的两对",
     "html": "$N(A)\\perp C(A^{\\mathsf T})$，$N(A^{\\mathsf T})\\perp C(A)$；维数分别凑满 $n$ 与 $m$，所以是正交补分解。"
    },
    {
     "title": "投影一句话",
     "html": "最近 $\\iff$ 误差垂直于子空间。直线：$\\mathbf{p}=\\frac{\\mathbf{a}^{\\mathsf T}\\mathbf{b}}{\\mathbf{a}^{\\mathsf T}\\mathbf{a}}\\mathbf{a}$；子空间：$P=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}$。"
    },
    {
     "title": "最小二乘",
     "html": "无解时最小化 $\\lVert A\\mathbf{x}-\\mathbf{b}\\rVert^2$，等价于解正规方程 $A^{\\mathsf T}A\\hat{\\mathbf{x}}=A^{\\mathsf T}\\mathbf{b}$；残差落在 $N(A^{\\mathsf T})$。"
    },
    {
     "title": "正交化与 QR",
     "html": "Gram–Schmidt：减投影、再单位化，张成不变。写成矩阵 $A=QR$；正交矩阵满足 $Q^{-1}=Q^{\\mathsf T}$，保长度保内积。"
    }
   ]
  },
  {
   "t": "checklist",
   "id": "ch04",
   "items": [
    "我能用点积验证两个子空间正交，并说清为什么 $N(A)\\perp C(A^{\\mathsf T})$。",
    "我能写出 $\\mathbb{R}^n=C(A^{\\mathsf T})\\oplus N(A)$ 并解释「$\\oplus$」在这里意味着什么。",
    "我能把向量投影到一条直线上，写出投影向量与投影矩阵，并验算误差垂直。",
    "我能证明投影矩阵满足 $P^2=P$ 与 $P^{\\mathsf T}=P$，并说明这两条性质的几何含义。",
    "我能推导 $P=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}$，并解释为什么 $A^{\\mathsf T}A$ 可逆当且仅当列无关。",
    "我能把无解方程组改写成最小二乘问题，写出正规方程并解出拟合参数。",
    "我能计算残差与残差平方和，并验证残差与设计矩阵的列正交。",
    "我能用 Gram–Schmidt 把三个向量化成标准正交基，并验算两两点积为零。",
    "我能写出 $A=QR$ 并说明 $R$ 的上三角形状与正对角线从哪里来。",
    "我能判断一个方阵是否正交，并说明「保长度」与「保内积」为什么等价于 $Q^{\\mathsf T}Q=I$。"
   ]
  }
 ]
});
