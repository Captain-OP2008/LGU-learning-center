/* =====================================================================
 * data/ch06.js · 第 6 章 特征值与特征向量（Eigenvalues and Eigenvectors）
 * 主线：矩阵作用在大多数向量上都会把它转向，唯独特征向量原地不动、只被拉长。
 * 抓住这些「不动方向」，A 的幂、微分方程、二次型就全部变成普通的乘法。
 * ===================================================================== */
CSC.registerChapter({
  id: "ch06",
  num: "06",
  title: "特征值与特征向量",
  en: "Eigenvalues and Eigenvectors",
  goals: [
    "你能用 $A\\mathbf{v}=\\lambda\\mathbf{v}$ 判断一个向量是不是特征向量、一个数是不是特征值，并说清 $\\lambda\\lt0$、$\\lambda=0$ 的几何含义。",
    "你能解特征方程 $\\det(A-\\lambda I)=0$，并用 $\\operatorname{tr}(A)=\\sum\\lambda_i$、$\\det(A)=\\prod\\lambda_i$ 检查答案。",
    "你能判断矩阵是否可对角化，并在可对角化时写出 $A=S\\Lambda S^{-1}$、用它计算 $A^{k}$。",
    "你能解常系数线性微分方程组 $\\dfrac{d\\mathbf{u}}{dt}=A\\mathbf{u}$，说出稳定性由特征值的实部决定。",
    "你能证明（或至少说清）实对称矩阵的特征值全实、不同特征值的特征向量正交，并写出谱分解 $A=Q\\Lambda Q^{\\mathsf T}$。",
    "你能用特征值、顺序主子式、配方法三种方式判断一个二次型是否正定。"
  ],
  kp: [
    { id: "ch06-s1", title: "先看一个例子：矩阵把圆变成椭圆" },
    { id: "ch06-s2", title: "§6.1 特征值与特征向量入门（$A\\mathbf{v}=\\lambda\\mathbf{v}$）" },
    { id: "ch06-s3", title: "§6.1 特征多项式、迹与行列式" },
    { id: "ch06-s4", title: "§6.2 对角化 $A=S\\Lambda S^{-1}$" },
    { id: "ch06-s5", title: "§6.3 微分方程组与矩阵指数" },
    { id: "ch06-s6", title: "§6.4 对称矩阵：实特征值、正交特征向量" },
    { id: "ch06-s7", title: "§6.5 正定矩阵与二次型" },
    { id: "ch06-s8", title: "本章回看：为什么特征值重要" }
  ],
  labIds: ["eigen", "diagonalize"],
  quizIds: ["ch06-q1", "ch06-q2", "ch06-q3", "ch06-q4", "ch06-q5", "ch06-q6", "ch06-q7"],
  blocks: [
    { t: "scope", scope: "core", weeks: "第 8–9 周", sections: "§6.1–6.5" },
    { t: "callout", kind: "why", title: "这一章要解决什么问题", html: "<p>先看一个画面。把单位圆上的每一个点都乘上矩阵 $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$，圆会被拉成一个椭圆：有的方向被拉长 3 倍，有的方向一动没动。令人意外的是，<b>只有两个方向</b>经历了「纯粹的拉伸」——其他方向的向量既被拉长又被转向。这两个特殊方向就是<b>特征向量</b>（eigenvector），拉伸的倍数就是<b>特征值</b>（eigenvalue）。</p><p>为什么值得专门找这两个方向？因为一旦换到这组方向上，矩阵的作用就退化成一串普通的乘法：$A^k$ 不过是把每个方向上的数各自乘 $k$ 次方；微分方程 $\\dfrac{d\\mathbf{u}}{dt}=A\\mathbf{u}$ 不过是几个独立的一元指数衰减；二次型 $\\mathbf{x}^{\\mathsf T}A\\mathbf{x}$ 的正负，也不过是看这些乘数是正是负。矩阵最难缠的部分——方向之间的耦合——被特征向量一次性解开了。</p><p>这一章的主线只有一句话：<b>把矩阵换到它自己的特征方向上，让矩阵变成对角阵</b>。做不到的时候（特征向量不够），我们退而求其次；做得到的时候（尤其是对称矩阵），一切都变得透明。</p>" },
    { t: "callout", kind: "note", title: "开始前你需要知道", html: "<ul><li><b>行列式</b>：会算 $2\\times2$、$3\\times3$ 的行列式，知道 $\\det(A-\\lambda I)=0$ 表示 $A-\\lambda I$ 奇异。这是求特征值的唯一入口，见 <a href='#/ch05'>第 5 章</a>。</li><li><b>零空间与线性无关</b>：知道 $(A-\\lambda I)\\mathbf{v}=\\mathbf{0}$ 的非零解就是特征向量；知道「$n$ 个向量线性无关」是什么意思。见 <a href='#/ch03'>第 3 章</a>。</li><li><b>矩阵乘法与逆</b>：会算 $S^{-1}AS$ 这种三明治乘法，并理解 $S^{-1}$ 是「换回原来的坐标」。见 <a href='#/ch02'>第 2 章</a>。</li><li><b>微分方程的基础</b>：知道 $y'=\\lambda y$ 的解是 $y=Ce^{\\lambda t}$，会用初始值定常数。6.3 节会把这一条推广到方程组。</li></ul>" },

    { t: "h", lvl: 2, text: "先看一个例子：矩阵把圆变成椭圆", id: "ch06-s1" },
    { t: "p", html: "在平面上画一个单位圆：所有长度为 1 的向量 $\\mathbf{v}=(\\cos\\theta,\\sin\\theta)$ 的集合。现在把每个点都乘上矩阵 $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$，问：这些像点组成的图形是什么？" },
    { t: "p", html: "先算几个特殊点。$\\mathbf{v}_1=\\left(\\frac{1}{\\sqrt2},\\frac{1}{\\sqrt2}\\right)$（$45^\\circ$ 方向）：$A\\mathbf{v}_1=\\left(\\frac{2+1}{\\sqrt2},\\frac{1+2}{\\sqrt2}\\right)=\\left(\\frac{3}{\\sqrt2},\\frac{3}{\\sqrt2}\\right)=3\\mathbf{v}_1$。方向完全没变，长度乘了 3。再取 $\\mathbf{v}_2=\\left(\\frac{1}{\\sqrt2},-\\frac{1}{\\sqrt2}\\right)$（$-45^\\circ$ 方向）：$A\\mathbf{v}_2=\\left(\\frac{2-1}{\\sqrt2},\\frac{1-2}{\\sqrt2}\\right)=\\left(\\frac{1}{\\sqrt2},-\\frac{1}{\\sqrt2}\\right)=1\\cdot\\mathbf{v}_2$。方向还是没变，长度不变。" },
    { t: "p", html: "再取 $\\mathbf{e}_1=(1,0)$：$A\\mathbf{e}_1=(2,1)$，方向被转了一下，长度变成 $\\sqrt5\\approx2.24$；取 $\\mathbf{e}_2=(0,1)$：$A\\mathbf{e}_2=(1,2)$，长度也是 $\\sqrt5$。这些方向既被拉伸又被转向，但拉伸倍数都落在 1 与 3 之间。把整个圆的所有像点画出来，得到的是一条椭圆：<b>半轴长 3，沿 $45^\\circ$ 方向；半轴长 1，沿 $-45^\\circ$ 方向</b>。圆被拉长成椭圆。" },
    { t: "p", html: "为什么半轴恰好是 3 与 1？因为 $\\mathbf{v}_1$ 与 $\\mathbf{v}_2$ 互相垂直，圆上任一点都能写成 $\\mathbf{v}=\\alpha\\mathbf{v}_1+\\beta\\mathbf{v}_2$，其中 $\\alpha=\\mathbf{v}\\cdot\\mathbf{v}_1$、$\\beta=\\mathbf{v}\\cdot\\mathbf{v}_2$，且 $\\alpha^2+\\beta^2=\\lVert\\mathbf{v}\\rVert^2=1$。于是 $A\\mathbf{v}=3\\alpha\\mathbf{v}_1+1\\cdot\\beta\\mathbf{v}_2$，像的长度的平方是 $(3\\alpha)^2+(\\beta)^2$：当 $\\lvert\\alpha\\rvert=1$ 时最长（$=3$），当 $\\lvert\\beta\\rvert=1$ 时最短（$=1$）。椭圆的半轴，就是这个矩阵在特征方向上的伸缩倍数。" },
    { t: "example", no: "1", tag: "圆变成椭圆", fields: [
      { k: "题目", html: "设 $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$。(a) 验证 $\\mathbf{v}_1=\\left(\\frac{1}{\\sqrt2},\\frac{1}{\\sqrt2}\\right)$ 与 $\\mathbf{v}_2=\\left(\\frac{1}{\\sqrt2},-\\frac{1}{\\sqrt2}\\right)$ 满足 $A\\mathbf{v}=\\lambda\\mathbf{v}$，求出对应的 $\\lambda$。(b) 单位圆经 $A$ 作用后的图形有几个半轴？长度各是多少？方向朝哪？" },
      { k: "思路", html: "直接乘一遍，看结果是不是原向量的倍数。判断椭圆的半轴，就找「像的长度」的最大值与最小值，而它们出现在特征方向上。" },
      { k: "解答", html: "<p>(a) $A\\mathbf{v}_1=\\left(\\frac{3}{\\sqrt2},\\frac{3}{\\sqrt2}\\right)=3\\mathbf{v}_1$，所以 $\\lambda_1=3$；$A\\mathbf{v}_2=\\left(\\frac{1}{\\sqrt2},-\\frac{1}{\\sqrt2}\\right)=1\\cdot\\mathbf{v}_2$，所以 $\\lambda_2=1$。</p><p>(b) 两个半轴，长度分别是 3 与 1。长的沿 $\\mathbf{v}_1$ 方向（即直线 $y=x$），短的沿 $\\mathbf{v}_2$ 方向（直线 $y=-x$）。两条轴互相垂直。</p>" },
      { k: "点评", html: "这个例子里 $A$ 是对称矩阵（$A^{\\mathsf T}=A$），所以它的两个特征向量恰好正交，椭圆的两条轴也恰好垂直。如果 $A$ 不对称，单位圆的像仍然是椭圆，但两条轴一般不再垂直——这正是 <a href='#/ch07'>第 7 章</a> 奇异值分解要处理的情形（椭圆的长短半轴是奇异值，方向是左奇异向量）。本章先把最舒服的对称情形弄透。" }
    ]},
    { t: "p", html: "这个画面里有两个词值得先记住：<b>被纯粹拉伸的方向</b>（特征向量）与<b>拉伸的倍数</b>（特征值）。它们不依赖坐标系，是矩阵自身的性质——换一组基，矩阵的元素会变，但特征值不变（6.2 节会证明）。所以特征值是矩阵的「固有频率」，这也正是 eigen 一词在德语里的意思：「自己的」。" },
    { t: "quiz", qid: "ch06-q1" },
    { t: "p", html: "上面只是观察。接下来把它写成定义、给出算法。" },

    { t: "h", lvl: 2, text: "§6.1 特征值与特征向量入门（$A\\mathbf{v}=\\lambda\\mathbf{v}$）", id: "ch06-s2" },
    { t: "p", html: "定义：设 $A$ 是 $n\\times n$ 矩阵。若存在<b>非零</b>向量 $\\mathbf{v}\\in\\mathbb{R}^n$ 与实数 $\\lambda$，使得" },
    { t: "tex", tex: "A\\mathbf{v}=\\lambda\\mathbf{v},\\qquad \\mathbf{v}\\ne\\mathbf{0}", caption: "特征值方程：$A$ 作用在 $\\mathbf{v}$ 上，等于把 $\\mathbf{v}$ 拉长 $\\lambda$ 倍" },
    { t: "p", html: "就说 $\\lambda$ 是 $A$ 的一个<b>特征值</b>，$\\mathbf{v}$ 是对应于 $\\lambda$ 的<b>特征向量</b>。逐个解释：$A$ 是给定的 $n\\times n$ 矩阵；$\\mathbf{v}$ 是非零列向量；$\\lambda$ 是一个实数（本章以实特征值为主，复特征值只在稳定性讨论与 <a href='#/ch09'>第 9 章</a> 出现）。式子的意思是「$A\\mathbf{v}$ 与 $\\mathbf{v}$ 平行」，即 $A$ 没有把 $\\mathbf{v}$ 转向，只是把它拉长或压短。" },
    { t: "p", html: "为什么必须要求 $\\mathbf{v}\\ne\\mathbf{0}$？因为 $A\\mathbf{0}=\\lambda\\mathbf{0}$ 对任何 $\\lambda$ 都成立，若允许零向量，所有数都成了特征值，定义就没有意义了。用大白话说：<b>特征向量是「被矩阵放过的方向」，特征值是「放过的代价」——方向不变，长度乘 $\\lambda$</b>。" },
    { t: "p", html: "$\\lambda$ 的符号和大小都有几何含义。$\\lambda\\gt1$：同向拉长；$0\\lt\\lambda\\lt1$：同向压短；$\\lambda=1$：原地不动；$\\lambda=0$：被压到原点（这说明 $A$ 有非零零空间，即 $A$ 奇异）；$\\lambda\\lt0$：方向反过来再伸缩（转 $180^\\circ$）。所以「特征值是 0」与「矩阵不可逆」是同一件事——这是第 5 章「$\\det=0$ $\\iff$ 奇异」的特征值版本（因为 $\\det(A)=\\prod\\lambda_i$，见 6.1 节后半）。" },
    { t: "p", html: "怎么求？把定义移项：$A\\mathbf{v}=\\lambda\\mathbf{v}$ 等价于 $A\\mathbf{v}-\\lambda\\mathbf{v}=\\mathbf{0}$，即 $(A-\\lambda I)\\mathbf{v}=\\mathbf{0}$。这里 $I$ 是单位矩阵，$\\lambda I$ 是把 $\\lambda$ 放在对角线上得到的矩阵（因为 $\\lambda\\mathbf{v}=\\lambda I\\mathbf{v}$）。于是问题变成：<b>齐次方程 $(A-\\lambda I)\\mathbf{v}=\\mathbf{0}$ 有非零解</b>。由第 3 章的知识，齐次方程有非零解当且仅当系数矩阵奇异，即" },
    { t: "tex", tex: "\\det(A-\\lambda I)=0", caption: "特征方程：解出 $\\lambda$，就得到全部特征值" },
    { t: "p", html: "这个方程叫<b>特征方程</b>（characteristic equation），左边 $\\det(A-\\lambda I)$ 是 $\\lambda$ 的 $n$ 次多项式，叫<b>特征多项式</b>（characteristic polynomial）。所以求特征值分四步：① 写出 $A-\\lambda I$（对角线上的每个元都减去 $\\lambda$）；② 算它的行列式，得到多项式；③ 解多项式方程，得到 $n$ 个根（计重数）；④ 把每个 $\\lambda$ 代回 $(A-\\lambda I)\\mathbf{v}=\\mathbf{0}$，解出非零的 $\\mathbf{v}$。" },
    { t: "steps", items: [
      { title: "写 A−λI", html: "只在主对角线上减 $\\lambda$，其余元素不动。这一步最容易漏减某个对角元。" },
      { title: "算行列式得到特征多项式", html: "$2\\times2$ 时是 $\\lambda^2-\\operatorname{tr}(A)\\lambda+\\det(A)$；$3\\times3$ 时按行展开，通常先造零再展开。" },
      { title: "解方程求 λ", html: "因式分解或求根公式。重根也要写全（$\\lambda=2,2$ 算两个特征值）。" },
      { title: "对每个 λ 解 (A−λI)v=0", html: "把 $\\lambda$ 代进去，用消元求零空间的一组基。所有非零解都是特征向量，可以任意数乘。" }
    ]},
    { t: "example", no: "2", tag: "2×2 求特征值与特征向量", fields: [
      { k: "题目", html: "求 $A=\\begin{bmatrix}3&1\\\\0&2\\end{bmatrix}$ 的全部特征值与特征向量。" },
      { k: "思路", html: "按四步走。这个矩阵是上三角的，$A-\\lambda I=\\begin{bmatrix}3-\\lambda&1\\\\0&2-\\lambda\\end{bmatrix}$，行列式直接是对角元乘积。" },
      { k: "解答", html: "<p>特征多项式：$\\det(A-\\lambda I)=(3-\\lambda)(2-\\lambda)$，特征值 $\\lambda_1=3$、$\\lambda_2=2$。</p><p>对 $\\lambda=3$：$A-3I=\\begin{bmatrix}0&1\\\\0&-1\\end{bmatrix}$，方程 $0\\cdot v_1+v_2=0$，即 $v_2=0$，$v_1$ 任意。取 $\\mathbf{v}_1=(1,0)$。</p><p>对 $\\lambda=2$：$A-2I=\\begin{bmatrix}1&1\\\\0&0\\end{bmatrix}$，方程 $v_1+v_2=0$，取 $\\mathbf{v}_2=(1,-1)$。</p><p>验证：$A(1,0)=(3,0)=3(1,0)$；$A(1,-1)=(3-1,-2)=(2,-2)=2(1,-1)$，都对。</p>" },
      { k: "点评", html: "上三角矩阵的特征值就是对角元，这是一个可以省力的观察：任何三角矩阵都如此。但<b>特征向量不是对角元对应的单位向量</b>——$\\lambda=2$ 的特征向量是 $(1,-1)$，不是 $(0,1)$。另一个易错点：$\\lambda=3$ 时解出 $v_2=0$，别把 $\\mathbf{v}_1=(0,1)$ 当成答案（代进去 $A(0,1)=(1,2)\\ne3(0,1)$）。" }
    ]},
    { t: "p", html: "注意特征向量不唯一：若 $\\mathbf{v}$ 是特征向量，$2\\mathbf{v}$、$-3\\mathbf{v}$ 也都是同一个 $\\lambda$ 的特征向量。所以答案要写成「全体非零解」或「取一组基」，不能写「特征向量是 $(1,0)$」就完事。同一个 $\\lambda$ 的所有特征向量加上零向量，组成一个子空间 $N(A-\\lambda I)$，叫<b>特征空间</b>（eigenspace）。它的维数叫 $\\lambda$ 的<b>几何重数</b>：在 $2\\times2$ 里，几何重数最多是 2。" },
    { t: "p", html: "拖一拖下面的实验台可以直观看到：给定一个矩阵，特征方向上的箭头只改变长度，其他方向的箭头会被转开；拖动滑块改变矩阵的元素时，两个特征方向与对应的 $\\lambda$ 一起变化。" },
    { t: "lab", id: "eigen" },
    { t: "p", html: "在实验台里把某个 $\\lambda$ 调到 0 试试：此时一个特征向量被压到原点，两个特征向量变得共线，矩阵的行列式也随之变成 0。这再次说明了「$\\lambda=0$ $\\iff$ 奇异」。" },
    { t: "p", html: "有两类矩阵的特征值可以直接「看出来」，考试里常考。第一类是<b>投影矩阵</b>：$P^2=P$。若 $P\\mathbf{v}=\\lambda\\mathbf{v}$，两边再作用一次 $P$，得 $P^2\\mathbf{v}=\\lambda P\\mathbf{v}=\\lambda^2\\mathbf{v}$；但 $P^2\\mathbf{v}=P\\mathbf{v}=\\lambda\\mathbf{v}$，所以 $\\lambda^2=\\lambda$，即 $\\lambda=0$ 或 $1$。几何上很自然：投影后落在平面上的点不动（$\\lambda=1$），被压到原点的方向归零（$\\lambda=0$）。第二类是<b>旋转矩阵</b>（转的不是 $0^\\circ$ 或 $180^\\circ$）：它把每个方向都转开，没有实特征向量，所以特征值是复数——在实数范围内「无特征值」。这两种情形正好对应「谱很简单」与「谱跳出实数」两个极端。" },
    { t: "quiz", qid: "ch06-q2" },

    { t: "h", lvl: 2, text: "§6.1 特征多项式、迹与行列式", id: "ch06-s3" },
    { t: "p", html: "特征多项式有两个系数特别有用，它们把「$n$ 个特征值」和「矩阵的两个简单量」直接连起来。" },
    { t: "theorem", name: "特征值之和与积", zh: "迹与行列式的特征值公式", rows: [
      { k: "白话", html: "所有特征值加起来等于矩阵的迹，乘起来等于矩阵的行列式。算完特征值拿它验算，能抓住大部分计算错误。" },
      { k: "结论", html: "$\\lambda_1+\\lambda_2+\\cdots+\\lambda_n=\\operatorname{tr}(A)=a_{11}+a_{22}+\\cdots+a_{nn}$；$\\lambda_1\\lambda_2\\cdots\\lambda_n=\\det(A)$。" },
      { k: "为什么", html: "设 $p(\\lambda)=\\det(A-\\lambda I)=(-1)^n(\\lambda-\\lambda_1)\\cdots(\\lambda-\\lambda_n)$。比较 $\\lambda^{n-1}$ 的系数：左边展开得 $(-1)^{n-1}\\operatorname{tr}(A)$，右边得 $-(-1)^n\\sum\\lambda_i$，两者相等即得 $\\sum\\lambda_i=\\operatorname{tr}(A)$。再令 $\\lambda=0$：$p(0)=\\det(A)=(-1)^n\\prod(-\\lambda_i)=\\prod\\lambda_i$。" },
      { k: "用法", html: "$2\\times2$ 时先用 $\\operatorname{tr}$ 与 $\\det$ 写出 $\\lambda^2-\\operatorname{tr}\\lambda+\\det=0$，比展开行列式快；算出 $\\lambda_1,\\lambda_2$ 后，用 $\\lambda_1+\\lambda_2$ 与 $\\lambda_1\\lambda_2$ 回代检查。" }
    ]},
    { t: "p", html: "对 $2\\times2$ 矩阵 $A=\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}$，特征多项式写成 $\\lambda^2-(a+d)\\lambda+(ad-bc)=0$，即 $\\lambda^2-\\operatorname{tr}(A)\\lambda+\\det(A)=0$。这是一个只需要记一个公式就能用的模板。更妙的是，若已知一个特征值，另一个用 $\\operatorname{tr}-\\lambda_1$ 就能秒出，不必再解方程。" },
    { t: "p", html: "还有一条性质后面会反复用到：<b>相似矩阵有相同的特征多项式</b>。若 $B=M^{-1}AM$，则 $B-\\lambda I=M^{-1}(A-\\lambda I)M$，两边取行列式并用乘法定理：$\\det(B-\\lambda I)=\\det(M^{-1})\\det(A-\\lambda I)\\det(M)=\\det(A-\\lambda I)$。所以特征值只由线性变换决定，与选哪组基无关——这条性质在第 8 章「相似矩阵」里是核心。" },
    { t: "example", no: "3", tag: "用迹与行列式反求特征值", fields: [
      { k: "题目", html: "设 $A=\\begin{bmatrix}4&1\\\\2&3\\end{bmatrix}$。(a) 用迹与行列式写出特征方程并求特征值；(b) 求两组特征向量；(c) 验证 $\\lambda_1+\\lambda_2=\\operatorname{tr}(A)$ 与 $\\lambda_1\\lambda_2=\\det(A)$。" },
      { k: "思路", html: "$\\operatorname{tr}(A)=4+3=7$，$\\det(A)=12-2=10$，特征方程 $\\lambda^2-7\\lambda+10=0$。因式分解得 $(\\lambda-5)(\\lambda-2)=0$。" },
      { k: "解答", html: "<p>(a) $\\operatorname{tr}(A)=7$，$\\det(A)=10$，特征方程 $\\lambda^2-7\\lambda+10=0$，解得 $\\lambda_1=5$、$\\lambda_2=2$。</p><p>(b) 对 $\\lambda=5$：$A-5I=\\begin{bmatrix}-1&1\\\\2&-2\\end{bmatrix}$，方程 $-v_1+v_2=0$，取 $\\mathbf{v}_1=(1,1)$。对 $\\lambda=2$：$A-2I=\\begin{bmatrix}2&1\\\\2&1\\end{bmatrix}$，方程 $2v_1+v_2=0$，取 $\\mathbf{v}_2=(1,-2)$。</p><p>(c) $\\lambda_1+\\lambda_2=7=\\operatorname{tr}(A)$，$\\lambda_1\\lambda_2=10=\\det(A)$，都对。</p>" },
      { k: "点评", html: "特征向量要代回原式验证：$A(1,1)=(5,5)$ ✓，$A(1,-2)=(2,-4)=2(1,-2)$ ✓。注意 $\\mathbf{v}_2$ 的分量顺序：由 $2v_1+v_2=0$ 得 $v_2=-2v_1$，所以取 $(1,-2)$ 而不是 $(1,2)$。特征向量差一个符号无所谓，差一个分量符号就全错了。" }
    ]},
    { t: "p", html: "重根怎么处理？$\\lambda$ 作为多项式的根出现的次数叫<b>代数重数</b>，对应特征空间的维数叫<b>几何重数</b>。几何重数永远不超过代数重数，但可以更小。举两个极端：$A=I$ 的特征值是 $1,1$（代数重数 2），而整个平面都是特征空间（几何重数 2）；$A=\\begin{bmatrix}2&1\\\\0&2\\end{bmatrix}$ 的特征值也是 $2,2$，但 $(A-2I)\\mathbf{v}=\\mathbf{0}$ 只有一个方向 $(1,0)$，几何重数只有 1。后者叫<b>缺陷矩阵</b>（defective matrix），它不能对角化——下一节就会看到原因。" },
    { t: "quiz", qid: "ch06-q3" },
    { t: "h", lvl: 2, text: "§6.2 对角化 $A=S\\Lambda S^{-1}$", id: "ch06-s4" },
    { t: "p", html: "特征值有什么用？最直接的用处是：如果矩阵有 $n$ 个线性无关的特征向量，那么换到这组特征向量作基，矩阵就变成对角阵。而「对角」意味着各个方向互不干扰——复杂的矩阵乘法立刻退化成一串数的乘法。" },
    { t: "p", html: "把 $n$ 个特征向量按列排成矩阵 $S=[\\mathbf{v}_1\\ \\mathbf{v}_2\\ \\cdots\\ \\mathbf{v}_n]$，把对应的特征值排成对角阵 $\\Lambda=\\operatorname{diag}(\\lambda_1,\\dots,\\lambda_n)$。因为 $A\\mathbf{v}_i=\\lambda_i\\mathbf{v}_i$，用矩阵乘法的「列视角」逐列看：$AS$ 的第 $i$ 列是 $A\\mathbf{v}_i=\\lambda_i\\mathbf{v}_i$，而 $S\\Lambda$ 的第 $i$ 列也是 $\\lambda_i\\mathbf{v}_i$。于是" },
    { t: "tex", tex: "AS=S\\Lambda,\\qquad A=S\\Lambda S^{-1},\\qquad A^{k}=S\\Lambda^{k}S^{-1}", caption: "对角化：前提是 $S$ 可逆，即 $n$ 个特征向量线性无关" },
    { t: "p", html: "这里的 $S$ 可逆，当且仅当 $\\mathbf{v}_1,\\dots,\\mathbf{v}_n$ 线性无关。$\\Lambda^k$ 只需把每个对角元取 $k$ 次方，所以 $A^k$ 的计算被彻底简化。用大白话说：<b>对角化 = 换一组基（特征向量基），让变换变成纯拉伸</b>。第 8 章会把这件事重新解释成「换基」，这里只要会用就行。" },
    { t: "p", html: "什么时候一定可以对角化？有一个很好用的充分条件：<b>若 $n$ 个特征值互不相同，则对应的特征向量线性无关，矩阵一定可对角化</b>。证明的思路是反证：假设 $c_1\\mathbf{v}_1+\\cdots+c_k\\mathbf{v}_k=\\mathbf{0}$ 有非平凡关系，取最短的这样一组，两边乘 $A$ 得 $c_1\\lambda_1\\mathbf{v}_1+\\cdots+c_k\\lambda_k\\mathbf{v}_k=\\mathbf{0}$，再减去 $\\lambda_k$ 倍的原式，就消掉了 $\\mathbf{v}_k$，得到一个更短的非平凡关系，矛盾。特征值有重根时，可能可对角化（如 $A=I$），也可能不可（如缺陷矩阵 $\\begin{bmatrix}2&1\\\\0&2\\end{bmatrix}$）。判据是：<b>每个特征值的几何重数都等于代数重数</b>，等价于「能找到 $n$ 个线性无关的特征向量」。" },
    { t: "theorem", name: "对角化定理", zh: "可对角化的条件与用途", rows: [
      { k: "白话", html: "矩阵能不能变成对角阵，取决于它的特征向量够不够多——要凑满 $n$ 个且线性无关。" },
      { k: "条件", html: "存在 $n$ 个线性无关的特征向量。充分条件：$n$ 个特征值互不相同；等价判据：每个特征值的几何重数等于代数重数。" },
      { k: "结论", html: "$A=S\\Lambda S^{-1}$，其中 $S$ 的列是特征向量、$\\Lambda$ 的对角元是特征值；$A^k=S\\Lambda^kS^{-1}$。" },
      { k: "用法", html: "① 算高次幂；② 解差分方程 $\\mathbf{u}_{k+1}=A\\mathbf{u}_k$（通解 $\\mathbf{u}_k=\\sum c_i\\lambda_i^{k}\\mathbf{v}_i$）；③ 判断稳定性（$\\lvert\\lambda_i\\rvert\\lt1$ 则衰减）。" },
      { k: "易错", html: "$S$ 的列顺序必须与 $\\Lambda$ 的对角元顺序一一对应；若把 $\\mathbf{v}_1$ 放第一列，$\\lambda_1$ 就必须是 $\\Lambda$ 的第一个对角元，否则 $AS=S\\Lambda$ 不成立。" }
    ]},
    { t: "example", no: "4", tag: "对角化与 $A^k$", fields: [
      { k: "题目", html: "设 $A=\\begin{bmatrix}4&1\\\\2&3\\end{bmatrix}$。(a) 前面已求出 $\\lambda_1=5,\\mathbf{v}_1=(1,1)$，$\\lambda_2=2,\\mathbf{v}_2=(1,-2)$。写出 $S$、$\\Lambda$ 与 $S^{-1}$。(b) 求 $A^{k}$ 的通式，并用 $k=1$ 验算。(c) 当 $k\\to\\infty$ 时 $A^k$ 的行为如何？" },
      { k: "思路", html: "$S$ 的列是特征向量，$\\Lambda$ 按同样顺序放特征值。$S^{-1}$ 用 $2\\times2$ 逆矩阵公式。$A^k=S\\Lambda^kS^{-1}$，逐项展开。" },
      { k: "解答", html: "<p>(a) $S=\\begin{bmatrix}1&1\\\\1&-2\\end{bmatrix}$，$\\Lambda=\\begin{bmatrix}5&0\\\\0&2\\end{bmatrix}$。$\\det(S)=1\\cdot(-2)-1\\cdot1=-3$，所以 $S^{-1}=\\frac{1}{-3}\\begin{bmatrix}-2&-1\\\\-1&1\\end{bmatrix}=\\begin{bmatrix}\\frac23&\\frac13\\\\ \\frac13&-\\frac13\\end{bmatrix}$。</p><p>(b) $A^k=S\\begin{bmatrix}5^k&0\\\\0&2^k\\end{bmatrix}S^{-1}=\\frac13\\begin{bmatrix}2\\cdot5^k+2^k&5^k-2^k\\\\2\\cdot5^k-2^{k+1}&5^k+2^{k+1}\\end{bmatrix}$。取 $k=1$：$\\frac13\\begin{bmatrix}10+2&5-2\\\\10-4&5+4\\end{bmatrix}=\\frac13\\begin{bmatrix}12&3\\\\6&9\\end{bmatrix}=\\begin{bmatrix}4&1\\\\2&3\\end{bmatrix}=A$，对。</p><p>(c) 因为 $5\\gt2\\gt0$，两项都随 $k$ 增大而增大，但 $5^k$ 主导，$A^k\\approx\\frac{5^k}{3}\\begin{bmatrix}2&1\\\\2&1\\end{bmatrix}$。$A^k$ 的各列趋于同一方向，极限是秩 1 矩阵（两列成比例）；增长速率由最大特征值 $5$ 决定。</p>" },
      { k: "点评", html: "$S^{-1}$ 里分母 $-3$ 很容易丢，丢了以后 $k=1$ 就验算不回去——所以「用 $k=1$ 回代」是这类题的自检神器。另外注意 $A^k$ 不是把每个元素取 $k$ 次方，而是 $S\\Lambda^kS^{-1}$；$\\Lambda^k$ 才是逐元素取幂。" }
    ]},
    { t: "p", html: "实验台里可以选一个可对角化的矩阵，拖动 $k$ 看 $A^k\\mathbf{x}$ 怎么随迭代变化：当最大的特征值大于 1 时，向量方向迅速被拉到主特征向量方向；小于 1 时，整个向量缩向原点。这就是「幂法」求主特征值的原理。" },
    { t: "lab", id: "diagonalize" },
    { t: "p", html: "再看一个把对角化用到极致的经典例子：斐波那契数列 $F_0=0,F_1=1,F_{k+1}=F_k+F_{k-1}$。把它写成向量递推：令 $\\mathbf{u}_k=\\begin{bmatrix}F_{k+1}\\\\F_k\\end{bmatrix}$，则 $\\mathbf{u}_{k+1}=\\begin{bmatrix}F_{k+1}+F_k\\\\F_{k+1}\\end{bmatrix}=\\begin{bmatrix}1&1\\\\1&0\\end{bmatrix}\\mathbf{u}_k$。矩阵 $A=\\begin{bmatrix}1&1\\\\1&0\\end{bmatrix}$ 的特征方程是 $\\lambda^2-\\lambda-1=0$，特征值 $\\lambda_1=\\frac{1+\\sqrt5}{2}=\\varphi$（黄金比）、$\\lambda_2=\\frac{1-\\sqrt5}{2}=\\psi$。由 $\\mathbf{u}_k=A^k\\mathbf{u}_0$ 与对角化，可以解出通项 $F_k=\\frac{\\varphi^k-\\psi^k}{\\sqrt5}$。这个公式说明：斐波那契数列的指数增长速率由主特征值 $\\varphi\\approx1.618$ 决定——这正是「最大特征值主导长期行为」的实例，也解释了为什么相邻项之比趋于黄金比。" },
    { t: "quiz", qid: "ch06-q4" },

    { t: "h", lvl: 2, text: "§6.3 微分方程组与矩阵指数", id: "ch06-s5" },
    { t: "p", html: "考虑两个互相影响的量 $u_1(t),u_2(t)$，它们的变化率由彼此决定：" },
    { t: "tex", tex: "\\frac{d\\mathbf{u}}{dt}=A\\mathbf{u},\\qquad \\mathbf{u}(0)=\\mathbf{u}_0", caption: "常系数线性微分方程组；$\\mathbf{u}$ 是随时间变化的向量" },
    { t: "p", html: "这里 $\\mathbf{u}(t)=\\begin{bmatrix}u_1(t)\\\\u_2(t)\\end{bmatrix}$ 是未知向量，$A$ 是常矩阵，$\\mathbf{u}_0$ 是初始条件。单个方程 $u'=\\lambda u$ 的解是 $u=Ce^{\\lambda t}$；方程组能不能也用指数试？试一下 $\\mathbf{u}(t)=\\mathbf{v}e^{\\lambda t}$：左边 $\\dfrac{d\\mathbf{u}}{dt}=\\lambda\\mathbf{v}e^{\\lambda t}$，右边 $A\\mathbf{u}=A\\mathbf{v}e^{\\lambda t}$。两边约掉非零的 $e^{\\lambda t}$，得到 $A\\mathbf{v}=\\lambda\\mathbf{v}$——正好是特征值方程。所以<b>每一个特征对 $(\\lambda,\\mathbf{v})$ 都给出一组解 $\\mathbf{v}e^{\\lambda t}$</b>。" },
    { t: "p", html: "方程是线性的，所以解可以叠加。若 $A$ 有 $n$ 个线性无关的特征向量，通解就是" },
    { t: "tex", tex: "\\mathbf{u}(t)=c_1e^{\\lambda_1 t}\\mathbf{v}_1+c_2e^{\\lambda_2 t}\\mathbf{v}_2+\\cdots+c_ne^{\\lambda_n t}\\mathbf{v}_n", caption: "通解：每个特征方向独立地按自己的速率指数变化" },
    { t: "p", html: "系数 $c_i$ 由初始条件定：令 $t=0$，得 $c_1\\mathbf{v}_1+\\cdots+c_n\\mathbf{v}_n=\\mathbf{u}_0$，即 $S\\mathbf{c}=\\mathbf{u}_0$，所以 $\\mathbf{c}=S^{-1}\\mathbf{u}_0$。把这个式子代回去，可以写成紧凑形式 $\\mathbf{u}(t)=e^{At}\\mathbf{u}_0$，其中<b>矩阵指数</b>定义为" },
    { t: "tex", tex: "e^{At}=I+At+\\frac{(At)^2}{2!}+\\frac{(At)^3}{3!}+\\cdots=S\\,e^{\\Lambda t}\\,S^{-1},\\qquad e^{\\Lambda t}=\\operatorname{diag}(e^{\\lambda_1t},\\dots,e^{\\lambda_nt})", caption: "矩阵指数：按泰勒级数定义；可对角化时用 $S$ 与对角阵计算" },
    { t: "p", html: "稳定性完全由特征值的实部决定：所有 $\\lambda_i\\lt0$ 时，每一项 $e^{\\lambda_i t}$ 都趋于 0，解衰减到零（稳定）；只要有一个 $\\lambda_i\\gt0$，对应方向就指数增长（不稳定）；若特征值是纯虚数，解振荡不衰减。这个判据不需要解方程，只要算特征值——这就是特征值在工程里最常用的地方。" },
    { t: "example", no: "5", tag: "解 2×2 微分方程组", fields: [
      { k: "题目", html: "解 $\\dfrac{d\\mathbf{u}}{dt}=A\\mathbf{u}$，其中 $A=\\begin{bmatrix}0&1\\\\-2&-3\\end{bmatrix}$，$\\mathbf{u}(0)=\\begin{bmatrix}1\\\\0\\end{bmatrix}$，并判断稳定性。" },
      { k: "思路", html: "先求特征值与特征向量；再把初始条件写成特征向量的组合，定出 $c_1,c_2$；最后写出 $\\mathbf{u}(t)$。" },
      { k: "解答", html: "<p>$\\operatorname{tr}(A)=-3$，$\\det(A)=0\\cdot(-3)-1\\cdot(-2)=2$，特征方程 $\\lambda^2+3\\lambda+2=0$，得 $\\lambda_1=-1$、$\\lambda_2=-2$。</p><p>$\\lambda=-1$：$A+I=\\begin{bmatrix}1&1\\\\-2&-2\\end{bmatrix}$，解得 $\\mathbf{v}_1=(1,-1)$。$\\lambda=-2$：$A+2I=\\begin{bmatrix}2&1\\\\-2&-1\\end{bmatrix}$，解得 $\\mathbf{v}_2=(1,-2)$。</p><p>设 $\\mathbf{u}(0)=c_1\\mathbf{v}_1+c_2\\mathbf{v}_2$，解 $\\begin{cases}c_1+c_2=1\\\\-c_1-2c_2=0\\end{cases}$，得 $c_1=2$、$c_2=-1$。所以 $\\mathbf{u}(t)=2e^{-t}\\begin{bmatrix}1\\\\-1\\end{bmatrix}-e^{-2t}\\begin{bmatrix}1\\\\-2\\end{bmatrix}=\\begin{bmatrix}2e^{-t}-e^{-2t}\\\\-2e^{-t}+2e^{-2t}\\end{bmatrix}$。</p><p>稳定性：两个特征值都小于 0，所以 $t\\to\\infty$ 时 $\\mathbf{u}(t)\\to\\mathbf{0}$，系统渐近稳定。</p>" },
      { k: "点评", html: "验证三件事：$t=0$ 时 $\\mathbf{u}(0)=(1,0)$ ✓；把 $\\mathbf{u}(t)$ 代回方程，两个分量都对得上；$t\\to\\infty$ 时两项都消失 ✓。注意 $\\lambda=-1$ 的衰减比 $\\lambda=-2$ 慢，所以长期行为由「最接近 0 的特征值」决定——类似的道理在差分方程里由「绝对值最大的特征值」主导，方向相反，别记混。" }
    ]},
    { t: "p", html: "如果 $A$ 不能对角化，$e^{At}$ 里会出现 $te^{\\lambda t}$ 这样的项（来自若尔当块，见 <a href='#/ch08'>第 8 章</a>）。例如 $A=\\begin{bmatrix}2&1\\\\0&2\\end{bmatrix}$，$e^{At}=e^{2t}\\begin{bmatrix}1&t\\\\0&1\\end{bmatrix}$。这说明重特征值对应的解可能以多项式速度增长，稳定性判据仍然只看 $\\lambda$ 的实部是否小于 0。" },
    { t: "quiz", qid: "ch06-q5" },

    { t: "h", lvl: 2, text: "§6.4 对称矩阵：实特征值、正交特征向量", id: "ch06-s6" },
    { t: "p", html: "一般的矩阵，特征值可能是复数，特征向量之间也未必正交，甚至可能不够 $n$ 个。但<b>实对称矩阵</b>（$A^{\\mathsf T}=A$）是一个完美的例外：它一定可以正交对角化，而且特征值全是实数。这不是巧合，是线性代数里最漂亮的定理之一，叫<b>谱定理</b>（spectral theorem）。" },
    { t: "p", html: "先说正交性。设 $A\\mathbf{u}=\\lambda\\mathbf{u}$、$A\\mathbf{w}=\\mu\\mathbf{w}$，且 $\\lambda\\ne\\mu$。计算 $\\lambda\\mathbf{u}\\cdot\\mathbf{w}=(A\\mathbf{u})\\cdot\\mathbf{w}$。利用「转置可以挪到另一边」：$(A\\mathbf{u})\\cdot\\mathbf{w}=\\mathbf{u}\\cdot(A^{\\mathsf T}\\mathbf{w})=\\mathbf{u}\\cdot(A\\mathbf{w})=\\mu\\,\\mathbf{u}\\cdot\\mathbf{w}$。于是 $(\\lambda-\\mu)(\\mathbf{u}\\cdot\\mathbf{w})=0$。因为 $\\lambda\\ne\\mu$，只能 $\\mathbf{u}\\cdot\\mathbf{w}=0$。用大白话说：<b>不同特征值的特征向量一定互相垂直</b>——这一步只用到了 $A^{\\mathsf T}=A$。" },
    { t: "p", html: "再说实性。$2\\times2$ 的情形可以直接看出来：$A=\\begin{bmatrix}a&b\\\\b&c\\end{bmatrix}$ 的特征多项式是 $\\lambda^2-(a+c)\\lambda+(ac-b^2)$，判别式 $\\Delta=(a+c)^2-4(ac-b^2)=(a-c)^2+4b^2\\ge0$，所以两个根都是实数。$n$ 维的证明需要复向量（<a href='#/ch09'>第 9 章</a>），思路是：若 $A\\mathbf{x}=\\lambda\\mathbf{x}$ 且 $\\mathbf{x}$ 是复向量，则 $\\lambda\\lVert\\mathbf{x}\\rVert^2=\\mathbf{x}^{\\mathsf H}A\\mathbf{x}$，而右边在 $A^{\\mathsf H}=A$ 时是实数，所以 $\\lambda$ 是实数。" },
    { t: "p", html: "把单位特征向量按列排成 $Q$。因为特征向量两两正交且长度为 1，$Q$ 是正交矩阵：$Q^{\\mathsf T}Q=I$，即 $Q^{-1}=Q^{\\mathsf T}$。代进对角化公式 $A=Q\\Lambda Q^{-1}$，得到" },
    { t: "tex", tex: "A=Q\\Lambda Q^{\\mathsf T}=\\lambda_1\\mathbf{q}_1\\mathbf{q}_1^{\\mathsf T}+\\lambda_2\\mathbf{q}_2\\mathbf{q}_2^{\\mathsf T}+\\cdots+\\lambda_n\\mathbf{q}_n\\mathbf{q}_n^{\\mathsf T}", caption: "谱分解：对称矩阵 = 一组互相垂直的秩 1 投影的加权和" },
    { t: "p", html: "这个式子叫<b>谱分解</b>（spectral decomposition）。每一项 $\\mathbf{q}_i\\mathbf{q}_i^{\\mathsf T}$ 是一个秩 1 的投影矩阵（把向量投影到 $\\mathbf{q}_i$ 方向），$\\lambda_i$ 是这一项的权重。它把「矩阵」拆成了「若干条互相垂直的方向 + 各自的权重」，是 <a href='#/ch07'>第 7 章</a> SVD 的雏形：SVD 就是把同样的想法推广到非对称矩阵，代价是要用两组正交基。" },
    { t: "theorem", name: "谱定理", zh: "实对称矩阵的正交对角化", rows: [
      { k: "白话", html: "实对称矩阵一定能找到一组互相垂直的单位特征向量，把矩阵变成对角阵。" },
      { k: "条件", html: "$A$ 是实矩阵且 $A^{\\mathsf T}=A$。" },
      { k: "结论", html: "① $A$ 的所有特征值都是实数；② 不同特征值的特征向量正交；③ 存在正交矩阵 $Q$ 使 $A=Q\\Lambda Q^{\\mathsf T}$，$\\Lambda$ 是对角阵；④ $A=\\sum\\lambda_i\\mathbf{q}_i\\mathbf{q}_i^{\\mathsf T}$。" },
      { k: "证明思路", html: "实性用复向量与 $A^{\\mathsf H}=A$；正交性用 $(A\\mathbf{u})\\cdot\\mathbf{w}=\\mathbf{u}\\cdot(A\\mathbf{w})$；存在性用归纳法：取一个特征向量 $\\mathbf{q}_1$，在它的正交补上 $A$ 仍然是实对称的，继续归纳。重特征值的情形需要在特征空间内再做一次正交化（Gram–Schmidt）。" },
      { k: "用法", html: "对称矩阵的二次型 $\\mathbf{x}^{\\mathsf T}A\\mathbf{x}=\\sum\\lambda_i(\\mathbf{q}_i^{\\mathsf T}\\mathbf{x})^2$，最大值、最小值就是最大、最小特征值；这是下一节正定判定的基础。" }
    ]},
    { t: "example", no: "6", tag: "对称矩阵正交对角化", fields: [
      { k: "题目", html: "设 $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$。(a) 求特征值与单位特征向量；(b) 写出 $Q$、$\\Lambda$，验证 $Q^{\\mathsf T}Q=I$ 与 $A=Q\\Lambda Q^{\\mathsf T}$；(c) 把 $A$ 写成谱分解。" },
      { k: "思路", html: "$\\operatorname{tr}(A)=4$、$\\det(A)=3$，特征方程 $\\lambda^2-4\\lambda+3=0$，根为 3 和 1。特征向量归一化后按列排。" },
      { k: "解答", html: "<p>(a) $\\lambda_1=3$：$A-3I=\\begin{bmatrix}-1&1\\\\1&-1\\end{bmatrix}$，$\\mathbf{v}_1=(1,1)$，归一化 $\\mathbf{q}_1=\\left(\\frac{1}{\\sqrt2},\\frac{1}{\\sqrt2}\\right)$。$\\lambda_2=1$：$A-I=\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$，$\\mathbf{v}_2=(1,-1)$，归一化 $\\mathbf{q}_2=\\left(\\frac{1}{\\sqrt2},-\\frac{1}{\\sqrt2}\\right)$。</p><p>(b) $Q=\\frac{1}{\\sqrt2}\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}$，$\\Lambda=\\begin{bmatrix}3&0\\\\0&1\\end{bmatrix}$。$Q^{\\mathsf T}Q=\\frac12\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}=\\frac12\\begin{bmatrix}2&0\\\\0&2\\end{bmatrix}=I$。而 $Q\\Lambda Q^{\\mathsf T}=3\\mathbf{q}_1\\mathbf{q}_1^{\\mathsf T}+1\\cdot\\mathbf{q}_2\\mathbf{q}_2^{\\mathsf T}=3\\cdot\\frac12\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}+\\frac12\\begin{bmatrix}1&-1\\\\-1&1\\end{bmatrix}=\\begin{bmatrix}1.5&1.5\\\\1.5&1.5\\end{bmatrix}+\\begin{bmatrix}0.5&-0.5\\\\-0.5&0.5\\end{bmatrix}=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}=A$。</p><p>(c) $A=3\\mathbf{q}_1\\mathbf{q}_1^{\\mathsf T}+1\\cdot\\mathbf{q}_2\\mathbf{q}_2^{\\mathsf T}$。</p>" },
      { k: "点评", html: "这个矩阵就是本章开头把圆变成椭圆的矩阵：$\\lambda=3$ 对应长轴方向 $(1,1)$，$\\lambda=1$ 对应短轴方向 $(1,-1)$，两个方向正交——与「椭圆两轴垂直」完全一致。这也说明对称矩阵的谱分解把几何图像讲清楚了：$A=Q\\Lambda Q^{\\mathsf T}$ 的意思是「先转到特征方向、各自缩放、再转回来」。" }
    ]},
    { t: "quiz", qid: "ch06-q6" },
    { t: "h", lvl: 2, text: "§6.5 正定矩阵与二次型", id: "ch06-s7" },
    { t: "p", html: "形如 $f(\\mathbf{x})=\\mathbf{x}^{\\mathsf T}A\\mathbf{x}=\\sum_{i,j}a_{ij}x_ix_j$ 的式子叫<b>二次型</b>（quadratic form）：它是 $x_1,\\dots,x_n$ 的二次齐次多项式。例如两个变量时，$f=2x_1^2+4x_1x_2+5x_2^2$ 对应的矩阵是 $A=\\begin{bmatrix}2&2\\\\2&5\\end{bmatrix}$——规律是：平方项系数放在对角线上，交叉项 $x_ix_j$ 的系数对半分给 $a_{ij}$ 与 $a_{ji}$，这样 $A$ 一定是对称的。为什么可以假设 $A$ 对称？因为任何矩阵的反对称部分对二次型没有贡献：$\\mathbf{x}^{\\mathsf T}A\\mathbf{x}=\\mathbf{x}^{\\mathsf T}\\left(\\frac{A+A^{\\mathsf T}}2\\right)\\mathbf{x}$。" },
    { t: "p", html: "二次型最重要的问题是<b>符号</b>：它对所有非零 $\\mathbf{x}$ 都为正吗？几何上，$f(\\mathbf{x})=1$ 是一条曲线（面），$f$ 是碗形还是马鞍形，决定了优化问题里一个点是极小值、极大值还是鞍点。" },
    { t: "p", html: "定义：若对一切 $\\mathbf{x}\\ne\\mathbf{0}$ 都有 $\\mathbf{x}^{\\mathsf T}A\\mathbf{x}\\gt0$，就说 $A$ 是<b>正定</b>的（positive definite）；若 $\\ge0$ 则叫<b>半正定</b>；若既有正值又有负值，叫<b>不定</b>（indefinite）。用大白话说：<b>正定 = 这个二次型是一个开口向上的碗，除了原点之外处处为正</b>。" },
    { t: "p", html: "怎么判断？有三套等价的办法，用哪套取决于题目给的是什么。" },
    { t: "list", ordered: true, items: [
      "<b>看特征值</b>：$A$ 正定 $\\iff$ 所有特征值 $\\lambda_i\\gt0$。理由：对称矩阵可正交对角化，令 $\\mathbf{y}=Q^{\\mathsf T}\\mathbf{x}$，则 $\\mathbf{x}^{\\mathsf T}A\\mathbf{x}=\\sum\\lambda_iy_i^2$；$\\mathbf{x}\\ne\\mathbf{0}$ 时 $\\mathbf{y}\\ne\\mathbf{0}$，所以只要每个 $\\lambda_i\\gt0$，和就为正；有负特征值时取对应的 $\\mathbf{y}$ 方向就得到负值。",
      "<b>看顺序主子式</b>（Sylvester 判据）：$A$ 正定 $\\iff$ 左上角 $1\\times1$、$2\\times2$、…、$n\\times n$ 的顺序主子式全为正。不必算特征值，只算行列式。",
      "<b>配方</b>：把 $\\mathbf{x}^{\\mathsf T}A\\mathbf{x}$ 写成若干个完全平方之和 $d_1y_1^2+\\cdots+d_ny_n^2$，正定 $\\iff$ 所有系数 $d_i\\gt0$。这些 $d_i$ 就是消元的主元，也对应 $A=LDL^{\\mathsf T}$ 中 $D$ 的对角元。"
    ]},
    { t: "p", html: "三套判据为什么一致？特征值判据与配方判据是同一件事的两种算法（正交变换与消元变换都能把二次型化成平方和，只是变换矩阵一个正交、一个三角）；顺序主子式判据则来自「顺序主子式 = 前 $k$ 个主元的乘积」，主元全正等价于所有前缀乘积全正。实际做题时：$2\\times2$ 用 $\\operatorname{tr}$ 与 $\\det$ 最快；$3\\times3$ 以上用顺序主子式通常比求特征值省力；需要写出正平方和时用配方。" },
    { t: "theorem", name: "正定矩阵的等价判据", zh: "Sylvester 判据与配方判据", rows: [
      { k: "白话", html: "「二次型恒正」「特征值全正」「顺序主子式全正」「配方后平方项系数全正」是同一件事的四种说法。" },
      { k: "条件", html: "$A$ 是实对称矩阵（二次型的矩阵总可以取对称）。" },
      { k: "结论", html: "$A$ 正定 $\\iff$ 所有 $\\lambda_i\\gt0$ $\\iff$ 所有顺序主子式 $\\Delta_k\\gt0$ $\\iff$ 消元主元全为正。" },
      { k: "提醒", html: "必须是<b>顺序</b>主子式（左上角开始），不是任意主子式；半正定对应「$\\ge0$」，此时特征值可为 0、主子式可为 0。" },
      { k: "用法", html: "判定极值：多元函数在驻点处的 Hessian 正定 $\\Rightarrow$ 极小值，不定 $\\Rightarrow$ 鞍点；这是二阶导数判别法在矩阵上的推广。" }
    ]},
    { t: "p", html: "先看两个 $2\\times2$ 的例子，把三种判据都对一遍。" },
    { t: "example", no: "7", tag: "正定判定四连", fields: [
      { k: "题目", html: "判断下列矩阵的正定性并说明理由：(a) $A=\\begin{bmatrix}2&2\\\\2&5\\end{bmatrix}$；(b) $B=\\begin{bmatrix}1&2\\\\2&1\\end{bmatrix}$；(c) $C=\\begin{bmatrix}2&-1&0\\\\-1&2&-1\\\\0&-1&2\\end{bmatrix}$；(d) $D=\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$。" },
      { k: "思路", html: "$2\\times2$ 用「$\\operatorname{tr}\\gt0$ 且 $\\det\\gt0$」或顺序主子式；$3\\times3$ 用三个顺序主子式；再各举一个使二次型取负（或零）的向量作为反例。" },
      { k: "解答", html: "<p>(a) $\\Delta_1=2\\gt0$，$\\Delta_2=2\\cdot5-2\\cdot2=6\\gt0$，正定。配方：$2x_1^2+4x_1x_2+5x_2^2=2(x_1+x_2)^2+3x_2^2$，两个系数都正。</p><p>(b) $\\Delta_1=1\\gt0$，$\\Delta_2=1-4=-3\\lt0$，不定。取 $\\mathbf{x}=(1,-1)$：$\\mathbf{x}^{\\mathsf T}B\\mathbf{x}=1-4+1=-2\\lt0$；取 $\\mathbf{x}=(1,1)$ 得 $1+4+1=6\\gt0$，一正一负。</p><p>(c) $\\Delta_1=2$，$\\Delta_2=\\begin{vmatrix}2&-1\\\\-1&2\\end{vmatrix}=3$，$\\Delta_3=\\det(C)=2(4-1)-(-1)(-2)=6-2=4$，全正，所以正定。它的特征值是 $2-\\sqrt2,\\ 2,\\ 2+\\sqrt2$，确实全正。</p><p>(d) $\\Delta_1=1\\gt0$，$\\Delta_2=1-1=0$，半正定。因为 $\\mathbf{x}^{\\mathsf T}D\\mathbf{x}=x_1^2+2x_1x_2+x_2^2=(x_1+x_2)^2\\ge0$，且取 $\\mathbf{x}=(1,-1)$ 时等于 0。</p>" },
      { k: "点评", html: "四个小问覆盖了正定、不定、半正定、以及「主子式为 0 时不能判正定」。特别注意 (b)：$\\operatorname{tr}=2\\gt0$ 但 $\\det=-3\\lt0$，所以两个特征值一正一负——「迹为正」单独不能说明正定。(d) 提醒：这个半正定但非正定的矩阵是奇异的（$\\det=0$），它的零空间方向让二次型取 0。" }
    ]},
    { t: "p", html: "正定矩阵与「椭圆」也直接相关。二次型 $\\mathbf{x}^{\\mathsf T}A\\mathbf{x}=1$ 在 $A$ 正定时是一条椭圆（高维是椭球），它的半轴长是 $1/\\sqrt{\\lambda_i}$，方向是特征向量——特征值越大，那个方向被「压得越紧」。这和第 7 章 SVD 把圆变成椭圆的图像是同一件事的两个方向：对称正定矩阵的 SVD 就是它的谱分解（$U=V=Q$，$\\sigma_i=\\lambda_i$）。在多元微积分里，函数在驻点的 Hessian 矩阵若是正定的，驻点就是极小值；若不定，就是鞍点。二阶导数判别法在 $n$ 维的推广，就是「判断 Hessian 是否正定」。" },
    { t: "quiz", qid: "ch06-q7" },

    { t: "h", lvl: 2, text: "本章回看：为什么特征值重要", id: "ch06-s8" },
    { t: "p", html: "把这一章压缩成一句话：<b>特征值让我们把矩阵的耦合作用拆成互不干扰的一维作用</b>。矩阵 $A$ 在标准坐标下是一张互相纠缠的表格；换到特征向量坐标下，它就是对角阵，每个方向各管各的。对角化能成功时，所有问题——幂、指数、二次型、稳定性——都退化成一维问题。" },
    { t: "table", head: ["问题", "特征值视角", "关键公式"], rows: [
      ["$A^k$ 的增长与稳定性", "$\\lvert\\lambda_i\\rvert$ 决定衰减或爆炸，最大者主导", "$A^k=S\\Lambda^kS^{-1}$"],
      ["微分方程 $d\\mathbf{u}/dt=A\\mathbf{u}$", "实部为负则衰减，为正则发散", "$\\mathbf{u}(t)=\\sum c_ie^{\\lambda_it}\\mathbf{v}_i$"],
      ["二次型 $\\mathbf{x}^{\\mathsf T}A\\mathbf{x}$ 的符号", "特征值全正即正定", "$\\mathbf{x}^{\\mathsf T}A\\mathbf{x}=\\sum\\lambda_iy_i^2$"],
      ["对称矩阵的主轴", "特征向量给出正交主轴", "$A=Q\\Lambda Q^{\\mathsf T}$"],
      ["非对称矩阵的主方向", "没有实特征值时也有主方向（用奇异值）", "见第 7 章"],
      ["相似矩阵", "特征值、迹、行列式都不变", "$B=M^{-1}AM$"]
    ], caption: "特征值在全书中的位置：凡是「方向 + 缩放」的问题，都回到这里" },
    { t: "p", html: "也要知道特征值的局限。第一，不是所有实矩阵都有实特征值：旋转 $90^\\circ$ 的矩阵 $\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}$ 的特征值是 $\\pm i$，在实数范围内无解——它的作用就是「转」，根本没有不动方向。这类问题要用复数（<a href='#/ch09'>第 9 章</a>）或 SVD（<a href='#/ch07'>第 7 章</a>）处理。第二，不可对角化的矩阵依然存在，若尔当形（<a href='#/ch08'>第 8 章</a>）是它的「最简替代」。第三，特征值对扰动可能很敏感：一个几乎不可对角化的矩阵，稍微动一下，特征向量可能大幅改变——数值计算时要小心（<a href='#/ch11'>第 11 章</a>）。" },
    { t: "callout", kind: "warn", title: "这一章最容易错的五个地方", html: "<p><b>① 特征向量写成零向量。</b>零向量不能当特征向量，定义里明确要求 $\\mathbf{v}\\ne\\mathbf{0}$。</p><p><b>② 特征向量与特征值配错。</b>求出 $\\lambda_1,\\lambda_2$ 后，每个 $\\lambda$ 要单独代回 $A-\\lambda I$ 解零空间；不要用 $\\lambda_1$ 的方程解出的向量配给 $\\lambda_2$。</p><p><b>③ 忘记特征向量不唯一。</b>$(1,1)$ 与 $(2,2)$ 是同一个特征向量方向；答案写「特征向量是 $(1,1)$」不如写「特征向量是 $t(1,1)$，$t\\ne0$」。</p><p><b>④ 把 $A+B$ 的特征值当成 $\\lambda_A+\\lambda_B$。</b>特征值对加法没有这种性质；$A+B$ 的特征值一般不能由 $A$、$B$ 各自的特征值相加得到（对 $AB$ 更是如此）。</p><p><b>⑤ 以为特征值相同就相似。</b>特征值相同只是相似的必要条件，不是充分条件（<a href='#/ch08'>第 8 章</a> 会给反例）。</p>" },
    { t: "keypoint", items: [
      { title: "一句话", html: "$A\\mathbf{v}=\\lambda\\mathbf{v}$：特征向量是被 $A$ 放过、只改长度的方向；特征值是拉伸倍数。" },
      { title: "怎么求", html: "解 $\\det(A-\\lambda I)=0$ 得特征值，再对每个 $\\lambda$ 解 $(A-\\lambda I)\\mathbf{v}=\\mathbf{0}$ 得特征向量。" },
      { title: "两个检查", html: "$\\sum\\lambda_i=\\operatorname{tr}(A)$，$\\prod\\lambda_i=\\det(A)$。算完立刻验算。" },
      { title: "对角化", html: "$A=S\\Lambda S^{-1}$，前提是 $n$ 个线性无关的特征向量；它把 $A^k$、微分方程、二次型全部变成一维问题。" },
      { title: "对称矩阵", html: "实特征值、正交特征向量、$A=Q\\Lambda Q^{\\mathsf T}$；正定等价于所有特征值（或顺序主子式）为正。" }
    ]},
    { t: "callout", kind: "exam", title: "考试视角：这章会怎么考", html: "<p>典型题型：① <b>求 $2\\times2$、$3\\times3$ 的特征值与特征向量</b>——先写 $\\operatorname{tr}$、$\\det$ 定二次方程，再解零空间；答案用 $t\\mathbf{v}$ 表示。② <b>判断可否对角化</b>——数一数线性无关特征向量的个数，或看几何重数是否等于代数重数。③ <b>算 $A^k$ 或解 $\\mathbf{u}_{k+1}=A\\mathbf{u}_k$</b>——$S\\Lambda^kS^{-1}$，再做稳定性讨论。④ <b>解 $d\\mathbf{u}/dt=A\\mathbf{u}$</b>——特征对叠加，初始条件定系数。⑤ <b>对称矩阵正交对角化</b>——记得把特征向量单位化，并验证 $Q^{\\mathsf T}Q=I$。⑥ <b>判定正定</b>——写清用的是哪一套判据。</p><p>阅卷时最常扣分的不是思路，而是细节：特征值算错、特征向量没代回验证、$S$ 的列与 $\\Lambda$ 的顺序不一致、忘了单位化、把「半正定」答成「正定」。建议每题算完后用 $\\operatorname{tr}$、$\\det$ 或 $A\\mathbf{v}=\\lambda\\mathbf{v}$ 回代一次，这一分钟很值。</p>" },
    { t: "checklist", id: "ch06-check", items: [
      "我能写出特征值方程并解释为什么特征向量必须非零。",
      "我能对 $2\\times2$ 矩阵用 $\\lambda^2-\\operatorname{tr}\\lambda+\\det=0$ 快速求特征值，并用和、积验算。",
      "我能对给定的 $\\lambda$ 解 $(A-\\lambda I)\\mathbf{v}=\\mathbf{0}$，并把答案写成 $t\\mathbf{v}$ 的形式。",
      "我能判断一个矩阵是否可对角化，并说出「特征向量不够」时会发生什么。",
      "我能用 $A^k=S\\Lambda^kS^{-1}$ 计算矩阵的高次幂，并解释稳定性。",
      "我能解 $d\\mathbf{u}/dt=A\\mathbf{u}$，并用初始条件定出系数。",
      "我能证明对称矩阵不同特征值的特征向量正交，并写出 $A=Q\\Lambda Q^{\\mathsf T}$。",
      "我能用特征值、顺序主子式、配方法三种方式判断同一个矩阵是否正定。"
    ]}
  ]
});
