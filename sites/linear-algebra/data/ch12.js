/* =====================================================================
 * data/ch12.js · 第 12 章 概率统计中的线性代数
 * 主线：平均数 = 投影 → 概率向量与方差 → 协方差矩阵与主方向 →
 *       多元高斯与加权最小二乘
 * 结构：4 节 / 5 例题 / 4 定理 / 1 实验台 / 6 题内嵌
 * ===================================================================== */
CSC.registerChapter({
  id: "ch12",
  num: "12",
  title: "概率统计中的线性代数",
  en: "Linear Algebra in Probability & Statistics",
  goals: [
    "你能把一列数据的平均数解释成「在常向量子空间上的投影」，并用残差与 $\\mathbf{1}$ 正交验证这件事。",
    "你能用概率向量写出期望与方差，说出方差为什么是「到均值的加权平方距离」。",
    "你能由数据矩阵算出协方差矩阵，验证它半正定，并用特征值、特征向量解释 PCA 的主方向。",
    "你能写出多元高斯密度里的二次型，说明 $\\Sigma$ 的特征值怎样决定等概率椭球的轴长。",
    "你能推出加权最小二乘的正规方程 $A^{\\mathsf T}WA\\hat{\\mathbf{x}}=A^{\\mathsf T}W\\mathbf{b}$，并说出 $W$ 与误差方差的关系。"
  ],
  kp: [
    { id: "ch12-s1", title: "先看一个例子：平均数是一个投影" },
    { id: "ch12-s2", title: "§12.1 均值、方差与概率" },
    { id: "ch12-s3", title: "§12.2 协方差矩阵与联合概率" },
    { id: "ch12-s4", title: "§12.3 多元高斯与加权最小二乘" }
  ],
  labIds: ["gaussian"],
  quizIds: ["ch12-q1", "ch12-q2", "ch12-q3", "ch12-q4", "ch12-q5", "ch12-q6"],
  blocks: [
    { t: "scope", scope: "extension", weeks: "第 12 周", sections: "§12.1–12.3", note: "本章是第 4 章（投影）与第 7 章（SVD）在统计里的直接落地，不引入新的矩阵分解。" },

    { t: "callout", kind: "why", title: "这一章要解决什么问题",
      html: "<p>拿到一列数据，第一件事通常是求平均数。这个动作太自然了，以至于很少有人问：为什么是平均数？为什么不是中位数、不是最大值？线性代数给了一个漂亮的回答：<b>平均数是一列数据在所有「常数向量」里找出的最近点，也就是一次投影</b>。平均数减不掉的那部分（残差）就是「波动」，它的长度平方除以数据个数就是方差。一句话：均值是投影，方差是残差的长度平方。</p><p>把一列数据推广成多列数据，问题就变成：几个变量一起变的时候，怎么描述它们「同步」的程度？答案是协方差矩阵。这个矩阵对称半正定，所以它有非负特征值和一组正交特征向量——特征向量的方向就是数据云的「主轴」，特征值就是各主轴上的方差。这就是主成分分析（PCA）：第 7 章的 SVD 刚刚讲完，这一章把它翻译成统计语言。</p><p>最后一节做两件事：把协方差矩阵塞进多元高斯密度（那个 $\\Sigma^{-1}$ 不是摆设，它决定了椭球的形状）；以及把「误差大小不一样」的最小二乘升级成加权最小二乘。两条都是第 4 章正规方程的直系后代。</p>" },

    { t: "callout", kind: "note", title: "开始前你需要知道",
      html: "<ul><li><b>第 4 章的投影与最小二乘</b>：$\\hat{\\mathbf{x}}=(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}\\mathbf{b}$，残差垂直于列空间。本章的均值、方差、加权最小二乘全是它的特例。</li><li><b>第 6 章对称矩阵的谱定理</b>：实对称矩阵有实特征值、正交特征向量。协方差矩阵正好是对称的。</li><li><b>第 7 章的 SVD 与 PCA</b>：本章会用 SVD 重讲一遍 PCA，两边对照着看最清楚。</li><li><b>概率的基本记号</b>：期望 $E[X]$、方差、独立。本章会重新定义一遍，不需要提前背公式。</li></ul>" },

    // ============================================================ s1
    { t: "h", lvl: 2, text: "先看一个例子：平均数是一个投影", id: "ch12-s1" },
    { t: "p", lead: true, html: "四个同学的身高是 $170,172,176,182$ 厘米。要报一个「代表值」，大家都会报平均数 $175$。为什么是它？因为它让「总误差」最小——但这句话里的「误差」怎么量、为什么用平方，一直没被解释清楚。这一节用第 4 章的投影把它讲透。" },
    { t: "p", html: "把四个数排成向量 $\\mathbf{x}=(170,172,176,182)^{\\mathsf T}$。所有「常数向量」长成 $c\\mathbf{1}=(c,c,c,c)^{\\mathsf T}$，它们组成 $\\mathbb{R}^4$ 里的一维子空间——一条过原点的直线，方向是 $\\mathbf{1}=(1,1,1,1)^{\\mathsf T}$。「用同一个数代表四个人」这件事，翻译成几何就是：<b>把 $\\mathbf{x}$ 投影到这条直线上</b>。" },
    { t: "p", html: "第 4 章的投影公式是 $\\mathbf{p}=\\frac{\\mathbf{x}^{\\mathsf T}\\mathbf{a}}{\\mathbf{a}^{\\mathsf T}\\mathbf{a}}\\mathbf{a}$，这里 $\\mathbf{a}=\\mathbf{1}$，于是" },
    { t: "tex", tex: "\\mathbf{p}=\\frac{\\mathbf{x}^{\\mathsf T}\\mathbf{1}}{\\mathbf{1}^{\\mathsf T}\\mathbf{1}}\\mathbf{1}=\\frac{x_1+x_2+x_3+x_4}{4}\\mathbf{1}=\\bar x\\,\\mathbf{1}", caption: "平均数就是投影的坐标：四个分量都等于 $\\bar x$" },
    { t: "p", html: "投影向量是 $\\mathbf{p}=(175,175,175,175)^{\\mathsf T}$，它的每个分量就是平均数 $\\bar x=175$。残差 $\\mathbf{e}=\\mathbf{x}-\\mathbf{p}=(-5,-3,1,7)^{\\mathsf T}$ 是「投影不掉的部分」，也就是每个人的身高相对平均数的偏差。第 4 章告诉我们：<b>残差一定垂直于投影方向</b>，验算一下 $\\mathbf{1}^{\\mathsf T}\\mathbf{e}=-5-3+1+7=0$——偏差之和为零。这不是巧合，它就是「平均数」三个字的定义。" },
    { t: "p", html: "于是方差有了几何意义：它是残差长度的平方除以数据个数，" },
    { t: "tex", tex: "\\text{方差}=\\frac{\\lVert\\mathbf{e}\\rVert^2}{n}=\\frac{1}{n}\\sum_{i=1}^{n}(x_i-\\bar x)^2" },
    { t: "p", html: "在这组数据里，$\\lVert\\mathbf{e}\\rVert^2=25+9+1+49=84$，所以方差是 $84/4=21$；标准差是 $\\sqrt{21}\\approx4.58$ 厘米。用大白话说：<b>平均数回答「这批数据的中心在哪」，标准差回答「这批数据离中心有多远」</b>；在几何上，前者是投影点的位置，后者是残差向量的长度。" },
    { t: "p", html: "顺便把投影矩阵写出来，它有一个极简的形式：$P=\\frac{1}{n}\\mathbf{1}\\mathbf{1}^{\\mathsf T}$，也就是一个所有元素都是 $1/n$ 的矩阵。它作用在任何向量上，都把那个向量的每个分量换成它的平均值。你可以验证第 4 章那三条性质：$P^2=P$（平均之后再平均不会变）、$P^{\\mathsf T}=P$（对称）、$\\operatorname{rank}P=1$（投影到一维子空间）。还有一个好玩的事实：$\\operatorname{trace}(P)=1$，恰好等于子空间的维数——投影矩阵的迹总是等于它投影到的子空间维数，这是第 6 章「迹 = 特征值之和」的一个漂亮应用。" },
    { t: "theorem", name: "Mean as Projection", zh: "均值就是投影", rows: [
      { k: "白话", html: "一列数据在「所有常数向量」组成的子空间上的投影，就是每个分量都等于平均数的那个向量；残差与 $\\mathbf{1}$ 正交，方差是残差长度的平方除以 $n$。" },
      { k: "条件", html: "$\\mathbf{x}\\in\\mathbb{R}^n$，$\\mathbf{1}=(1,\\dots,1)^{\\mathsf T}$。" },
      { k: "结论", html: "$\\mathbf{p}=\\frac{\\mathbf{x}^{\\mathsf T}\\mathbf{1}}{\\mathbf{1}^{\\mathsf T}\\mathbf{1}}\\mathbf{1}=\\bar x\\,\\mathbf{1}$；$\\mathbf{e}=\\mathbf{x}-\\mathbf{p}$ 满足 $\\mathbf{1}^{\\mathsf T}\\mathbf{e}=0$，且 $\\lVert\\mathbf{e}\\rVert^2=\\sum_i(x_i-\\bar x)^2$。" },
      { k: "证明", html: "投影到由 $\\mathbf{1}$ 张成的一维子空间：系数 $c=\\frac{\\mathbf{x}^{\\mathsf T}\\mathbf{1}}{\\mathbf{1}^{\\mathsf T}\\mathbf{1}}=\\frac{\\sum x_i}{n}=\\bar x$，所以投影是 $\\bar x\\mathbf{1}$。残差与 $\\mathbf{1}$ 的内积为 $\\sum(x_i-\\bar x)=\\sum x_i-n\\bar x=0$，即「偏差之和为零」。" },
      { k: "用法", html: "平均数、方差、标准差的几何解释都从这里来；把 $\\mathbf{1}$ 换成别的一组基，同一套公式就变成最小二乘与 PCA。" }
    ]},
    { t: "example", no: "12.1", tag: "投影、残差与方差", fields: [
      { k: "题目", html: "数据 $\\mathbf{x}=(1,2,3,4)^{\\mathsf T}$。求平均数、残差、方差（除以 $n$）与投影矩阵 $P$，并验证残差与 $\\mathbf{1}$ 正交、$P^2=P$。" },
      { k: "思路", html: "照投影公式算 $\\mathbf{p}=\\bar x\\mathbf{1}$，残差 $\\mathbf{e}=\\mathbf{x}-\\mathbf{p}$；方差是 $\\lVert\\mathbf{e}\\rVert^2/n$。" },
      { k: "解答", html: "$\\bar x=(1+2+3+4)/4=2.5$，$\\mathbf{p}=(2.5,2.5,2.5,2.5)^{\\mathsf T}$，$\\mathbf{e}=(-1.5,-0.5,0.5,1.5)^{\\mathsf T}$。$\\mathbf{1}^{\\mathsf T}\\mathbf{e}=-1.5-0.5+0.5+1.5=0$ ✓。方差 $=\\frac{1}{4}(2.25+0.25+0.25+2.25)=\\frac54=1.25$；若除以 $n-1=3$ 得样本方差 $\\frac53\\approx1.667$。$P=\\frac14\\begin{bmatrix}1&1&1&1\\\\ 1&1&1&1\\\\ 1&1&1&1\\\\ 1&1&1&1\\end{bmatrix}$，任何向量乘它都变成「各自平均数的四份拷贝」。" },
      { k: "点评", html: "除以 $n$ 还是 $n-1$ 是统计里绕不开的细节：除以 $n$ 的方差是「这批数据本身的离散程度」（总体方差），除以 $n-1$ 的是「用它去估计更大总体的方差」时的无偏估计。线性代数只负责「残差长度」这个几何量，除几就是统计约定的问题。" }
    ]},
    { t: "quiz", qid: "ch12-q1" },

    // ============================================================ s2
    { t: "h", lvl: 2, text: "§12.1 均值、方差与概率", id: "ch12-s2" },
    { t: "p", lead: true, html: "上一节处理的是「已经拿到的一列数」。这一节换成概率的语言：数据不是固定的一列，而是以不同概率出现的随机变量。线性代数在这里依然好用，因为期望就是一次内积，方差就是一次加权内积——所有的和都可以写成矩阵乘法。" },
    { t: "p", html: "先回顾<b>概率向量</b>：分量非负、和为 $1$ 的向量 $\\mathbf{p}=(p_1,\\dots,p_n)^{\\mathsf T}$。它是一个随机变量 $X$ 的分布：$X$ 以概率 $p_i$ 取值 $x_i$。这个定义和第 10 章的 Markov 矩阵是同一套语言（Markov 矩阵的每一列就是一个概率向量），只是这里只用一次，不迭代。" },
    { t: "p", html: "随机变量的<b>期望</b>（expectation）是加权平均：" },
    { t: "tex", tex: "E[X]=\\sum_{i=1}^{n}p_ix_i=\\mathbf{p}^{\\mathsf T}\\mathbf{x}", caption: "期望就是概率向量与取值向量的内积" },
    { t: "p", html: "写成一个点积，立刻能看出期望的两条性质是内积的线性性：$E[aX+b]=aE[X]+b$，因为 $\\mathbf{p}^{\\mathsf T}(a\\mathbf{x}+b\\mathbf{1})=a\\,\\mathbf{p}^{\\mathsf T}\\mathbf{x}+b\\,\\mathbf{p}^{\\mathsf T}\\mathbf{1}=aE[X]+b$（用了 $\\mathbf{p}^{\\mathsf T}\\mathbf{1}=1$）。这两条性质平时当作公理背，其实它就是「点积是线性的」。" },
    { t: "p", html: "<b>方差</b>（variance）量的是「离期望有多远」的加权平均平方：" },
    { t: "tex", tex: "\\operatorname{Var}(X)=E[(X-E[X])^2]=\\sum_{i=1}^{n}p_i\\,(x_i-\\mu)^2,\\qquad \\mu=E[X]" },
    { t: "p", html: "注意这里是「加权」平方和：每个偏差平方要乘上它出现的概率。把它写成矩阵形式，就是先把向量中心化 $\\mathbf{x}-\\mu\\mathbf{1}$，再算加权内积" },
    { t: "tex", tex: "\\operatorname{Var}(X)=(\\mathbf{x}-\\mu\\mathbf{1})^{\\mathsf T}D\\,(\\mathbf{x}-\\mu\\mathbf{1}),\\qquad D=\\operatorname{diag}(p_1,\\dots,p_n)", caption: "方差＝中心化向量的加权长度平方" },
    { t: "p", html: "这个写法值得多看一眼：$D$ 是概率组成的对角矩阵，它给每个分量配了不同的权重。当所有 $p_i$ 相等（均匀分布，比如掷骰子）时，$D=\\frac1nI$，方差就退化成 $\\frac1n\\lVert\\mathbf{x}-\\mu\\mathbf{1}\\rVert^2$——正好是上一节那个「残差长度平方除以 $n$」。所以上一节是这一节的等权特例。" },
    { t: "p", html: "还有一个常用恒等式：$\\operatorname{Var}(X)=E[X^2]-(E[X])^2$。它来自把平方展开：$E[(X-\\mu)^2]=E[X^2]-2\\mu E[X]+\\mu^2=E[X^2]-\\mu^2$。手算方差时它常常更快。" },
    { t: "example", no: "12.2", tag: "掷骰子的期望与方差", fields: [
      { k: "题目", html: "一枚均匀骰子，$X$ 取 $1,2,3,4,5,6$ 各以 $1/6$ 的概率。求 $E[X]$、$\\operatorname{Var}(X)$，并验证 $E[X^2]-(E[X])^2$ 与直接算的一致。" },
      { k: "思路", html: "按定义求加权和；用恒等式交叉验证。" },
      { k: "解答", html: "$\\mu=\\frac16(1+2+3+4+5+6)=\\frac{21}{6}=3.5$。直接算：$\\frac16\\sum(x_i-3.5)^2=\\frac16(6.25+2.25+0.25+0.25+2.25+6.25)=\\frac{17.5}{6}=\\frac{35}{12}\\approx2.917$。用恒等式：$E[X^2]=\\frac16(1+4+9+16+25+36)=\\frac{91}{6}$，所以 $E[X^2]-\\mu^2=\\frac{91}{6}-\\frac{49}{4}=\\frac{182-147}{12}=\\frac{35}{12}$ ✓。" },
      { k: "点评", html: "期望 $3.5$ 不是骰子能掷出的数——它只是「加权平均」这个线性运算的结果。方差 $2.917$ 是「离 $3.5$ 的平均平方距离」，开根号得标准差约 $1.71$。注意方差用的是平方，所以单位也变了（点数的平方），比较两个随机变量的波动时要开根号才直观。" }
    ]},
    { t: "p", html: "两个随机变量之间还有一个量叫<b>协方差</b>（covariance）：$\\operatorname{Cov}(X,Y)=E[(X-E[X])(Y-E[Y])]$。它是下一节的主角。一句话预告：把 $p$ 个变量两两之间的协方差排成矩阵，就得到协方差矩阵；而那个矩阵正好是「中心化数据矩阵的 $\\frac{1}{n-1}$ 倍内积」。" },
    { t: "p", html: "最后补一句连续情形。当 $X$ 的取值是连续的，求和换成积分，内积也换成积分：$E[X]=\\int x\\,f(x)\\,dx$，两个函数的内积是 $\\int f(x)g(x)\\,dx$。第 10 章的傅里叶级数用的正是这个内积——概率与傅里叶在「函数空间的内积」这一点上会合。这里不展开，只要知道「离散用求和、连续用积分，结构完全一样」就够了。" },
    { t: "quiz", qid: "ch12-q2" },

    // ============================================================ s3
    { t: "h", lvl: 2, text: "§12.2 协方差矩阵与联合概率", id: "ch12-s3" },
    { t: "p", lead: true, html: "一列数据有均值与方差。可现实里的数据总是多列：身高、体重、血压一起测，股票、汇率、利率一起动。只看每一列的方差，会漏掉最重要的一类信息——<b>它们是不是一起动</b>。身高和体重同涨同落，两支股票一起跌，这些「同步」关系才是数据分析的主角。描述它的工具，是一个对称半正定矩阵。" },
    { t: "p", html: "把数据排成一个 $n\\times p$ 的矩阵 $X$：$n$ 行是 $n$ 个样本，$p$ 列是 $p$ 个变量。第一步永远是<b>中心化</b>：把每一列减去它自己的均值。中心化之后，每一列的均值为 $0$，于是「围绕均值波动」就变成「向量本身」。这一步不能省，否则算出来的不是协方差而是「关于原点的二阶矩」。" },
    { t: "p", html: "定义<b>协方差矩阵</b>（covariance matrix）" },
    { t: "tex", tex: "S=\\frac{1}{n-1}X^{\\mathsf T}X", caption: "协方差矩阵：中心化数据矩阵的「自内积」再除以 n−1" },
    { t: "p", html: "这里除以 $n-1$ 而不是 $n$，是为了让 $S$ 成为总体协方差的无偏估计；§12.1 讲「这批数据本身的离散程度」时用的是 $n$。两者只差一个常数因子 $\\frac{n}{n-1}$，特征向量完全相同，特征值同比缩放。" },
    { t: "p", html: "它的第 $(i,j)$ 个元素是 $\\frac{1}{n-1}\\sum_k x_{ki}x_{kj}$，正好是变量 $i$ 与变量 $j$ 的样本协方差；对角线上 $i=j$，就是每个变量自己的方差。所以 $S$ 是一个 $p\\times p$ 的矩阵，它把「$p$ 个变量两两之间的关系」全部装了进去。注意 $S$ 是<b>变量数</b>的平方，不是样本数的平方——样本再多，这个矩阵也只有 $p\\times p$。" },
    { t: "p", html: "两个性质立刻能看出来。第一，$S^{\\mathsf T}=S$：协方差是对称的，$\\operatorname{Cov}(X,Y)=\\operatorname{Cov}(Y,X)$。第二，$S$ 半正定，因为对任意向量 $\\mathbf{v}\\in\\mathbb{R}^p$，" },
    { t: "tex", tex: "\\mathbf{v}^{\\mathsf T}S\\mathbf{v}=\\frac{1}{n-1}\\mathbf{v}^{\\mathsf T}X^{\\mathsf T}X\\mathbf{v}=\\frac{1}{n-1}\\lVert X\\mathbf{v}\\rVert^2\\ge0", caption: "协方差矩阵半正定：任何方向上的方差都不可能为负" },
    { t: "p", html: "这个式子是整节的枢纽。$X\\mathbf{v}$ 是「把 $n$ 个样本投影到方向 $\\mathbf{v}$ 上得到的一列数」，$\\lVert X\\mathbf{v}\\rVert^2$ 就是这一列数的波动大小。所以 $\\mathbf{v}^{\\mathsf T}S\\mathbf{v}$ 的物理意义是：<b>数据在 $\\mathbf{v}$ 这个方向上的方差</b>。方差当然不能是负的，所以 $S$ 必须半正定——这不是一个抽象条件，而是「方差非负」的直接翻译。" },
    { t: "p", html: "既然 $S$ 对称半正定，第 6 章的谱定理就可以用了：它有一组标准正交的特征向量和一堆非负特征值，" },
    { t: "tex", tex: "S=V\\Lambda V^{\\mathsf T},\\qquad \\lambda_1\\ge\\lambda_2\\ge\\cdots\\ge\\lambda_p\\ge0", caption: "协方差的谱分解：特征值是按大小排好的「各方向方差」" },
    { t: "p", html: "这组特征向量叫什么？叫<b>主方向</b>（principal directions）；特征值叫各主方向上的方差。第一个特征向量 $\\mathbf{v}_1$ 就是数据云拉得最长的那个方向，第二个 $\\mathbf{v}_2$ 是与它正交的方向里拉得次长的，依此类推。这正好是主成分分析（PCA）：<b>PCA 就是把数据转到一个由协方差矩阵特征向量组成的新坐标系里，让各分量互不相关、方差从大到小排列</b>。" },
    { t: "p", html: "为什么第一主方向一定是最大特征值的特征向量？因为「在单位方向 $\\mathbf{v}$ 上的方差」是 $\\mathbf{v}^{\\mathsf T}S\\mathbf{v}$，要找它的最大值，约束是 $\\lVert\\mathbf{v}\\rVert=1$。用拉格朗日乘子法：目标 $\\mathbf{v}^{\\mathsf T}S\\mathbf{v}-\\lambda(\\mathbf{v}^{\\mathsf T}\\mathbf{v}-1)$ 对 $\\mathbf{v}$ 求梯度，得 $2S\\mathbf{v}-2\\lambda\\mathbf{v}=\\mathbf{0}$，即 $S\\mathbf{v}=\\lambda\\mathbf{v}$。所以极值点必须是特征向量，而此时的方差值就是 $\\mathbf{v}^{\\mathsf T}S\\mathbf{v}=\\lambda\\lVert\\mathbf{v}\\rVert^2=\\lambda$。取最大的 $\\lambda$，就得到第一主方向。" },
    { t: "theorem", name: "Covariance and PCA", zh: "协方差矩阵与主成分", rows: [
      { k: "白话", html: "协方差矩阵对称半正定；它的特征向量是数据云的主方向，特征值是各方向上的方差；最大特征值的方向就是方差最大的方向。" },
      { k: "条件", html: "$X$ 是中心化后的 $n\\times p$ 数据矩阵，$S=\\frac{1}{n-1}X^{\\mathsf T}X$。" },
      { k: "结论", html: "$S=V\\Lambda V^{\\mathsf T}$，$\\lambda_i\\ge0$；在 $\\lVert\\mathbf{v}\\rVert=1$ 的约束下，$\\mathbf{v}^{\\mathsf T}S\\mathbf{v}$ 的最大值是 $\\lambda_1$，在 $\\mathbf{v}=\\mathbf{v}_1$ 处取到；前 $k$ 个主方向上的方差之和 $\\sum_{i=1}^k\\lambda_i$ 是「用 $k$ 维近似数据」保留的方差。" },
      { k: "证明", html: "半正定性：$\\mathbf{v}^{\\mathsf T}S\\mathbf{v}=\\frac{1}{n-1}\\lVert X\\mathbf{v}\\rVert^2\\ge0$。主方向的最优性：对 $\\mathbf{v}^{\\mathsf T}S\\mathbf{v}$ 在单位球上求极值，拉格朗日条件给出 $S\\mathbf{v}=\\lambda\\mathbf{v}$，极值是 $\\lambda$；特征值从大到小排，最大那个对应的就是最优方向。" },
      { k: "用法", html: "判断一个矩阵能不能是协方差矩阵：只看它是否对称、特征值是否全非负。算 PCA：中心化、算 $S$、对 $S$ 做特征分解（或对 $X$ 做 SVD），取前几个特征向量。" }
    ]},
    { t: "example", no: "12.3", tag: "协方差矩阵与主方向", fields: [
      { k: "题目", html: "四个二维样本：$(1,2)$、$(2,1)$、$(3,4)$、$(4,3)$。求均值、协方差矩阵 $S$、特征值与主方向，并说出第一主成分解释了百分之几的方差。" },
      { k: "思路", html: "先中心化，再算 $X^{\\mathsf T}X/(n-1)$；二维对称矩阵的特征值用「迹与行列式」快速求。" },
      { k: "解答", html: "均值是 $(2.5,2.5)$。中心化后四个点是 $(-1.5,-0.5)$、$(-0.5,-1.5)$、$(0.5,1.5)$、$(1.5,0.5)$。$X^{\\mathsf T}X=\\begin{bmatrix}5&3\\\\ 3&5\\end{bmatrix}$，所以 $S=\\frac13\\begin{bmatrix}5&3\\\\ 3&5\\end{bmatrix}=\\begin{bmatrix}5/3&1\\\\ 1&5/3\\end{bmatrix}$。迹为 $10/3$、行列式为 $\\frac{25}{9}-1=\\frac{16}{9}$，特征值满足 $\\lambda^2-\\frac{10}{3}\\lambda+\\frac{16}{9}=0$，解得 $\\lambda_1=\\frac83$、$\\lambda_2=\\frac23$。对应的特征向量是 $\\mathbf{v}_1=\\frac{1}{\\sqrt2}(1,1)^{\\mathsf T}$ 与 $\\mathbf{v}_2=\\frac{1}{\\sqrt2}(1,-1)^{\\mathsf T}$。第一主成分解释的方差比例是 $\\frac{8/3}{8/3+2/3}=0.8$，即 $80\\%$。" },
      { k: "点评", html: "数据云沿对角线 $y=x$ 拉得最长，这正是 $\\mathbf{v}_1=(1,1)/\\sqrt2$ 的方向；垂直方向 $y=-x$ 上只有 $2/3$ 的方差。换句话说，把二维数据压到一维（只保留第一主成分），还能保留 $80\\%$ 的波动信息——这就是 PCA 降维的算术依据。" }
    ]},
    { t: "p", html: "协方差矩阵还有一个「亲戚」，叫<b>相关矩阵</b>（correlation matrix）：把每个变量除以自己的标准差，再算协方差，得到 $R_{ij}=\\frac{S_{ij}}{\\sigma_i\\sigma_j}$，其中 $\\sigma_i=\\sqrt{S_{ii}}$。相关矩阵的对角线全是 $1$，非对角元的绝对值不超过 $1$——这条 $|R_{ij}|\\le1$ 不是统计定理，它就是第 1 章的 Cauchy–Schwarz 不等式：$|\\operatorname{Cov}(X,Y)|\\le\\sigma_X\\sigma_Y$，等价于 $|\\mathbf{x}^{\\mathsf T}\\mathbf{y}|\\le\\lVert\\mathbf{x}\\rVert\\lVert\\mathbf{y}\\rVert$。又一次，看起来是统计的结论，底层是内积。" },
    { t: "p", html: "最后一件事把「概率」和「矩阵」直接对上。两个离散随机变量的<b>联合分布</b>可以排成一个矩阵 $P$，第 $(i,j)$ 个元素是 $P(X=i,\\ Y=j)$，整个矩阵非负、所有元素加起来是 $1$。它的<b>边缘分布</b>怎么求？把每一行加起来得到 $X$ 的分布，每一列加起来得到 $Y$ 的分布——用矩阵写就是「右乘全 $1$ 向量」与「左乘全 $1$ 行向量」。而 $X$ 与 $Y$ <b>独立</b>，意思是联合分布等于两个边缘分布的外积：$P=\\mathbf{p}\\mathbf{q}^{\\mathsf T}$。外积矩阵的秩是 $1$，所以「独立」在矩阵语言里就是「秩为 $1$」。这是整本书里最漂亮的一次翻译：概率里的独立性 = 矩阵里的秩 $1$。" },
    { t: "lab", id: "gaussian" },
    { t: "p", html: "上面的实验台里画了一团二维点云和它的两条主方向。拖动数据或改变相关系数，你会看到：点云越「细长」，第一主方向上的方差占比就越大；当相关系数接近 $\\pm1$ 时，点云几乎压成一条线，协方差矩阵接近奇异（最小特征值趋于 $0$）。这也顺便解释了为什么「两个变量高度相关」会让回归系数不稳定——矩阵快奇异了，条件数（第 11 章）也跟着爆炸。" },
    { t: "example", no: "12.4", tag: "判断能否是协方差矩阵", fields: [
      { k: "题目", html: "下面两个矩阵，哪些可能是一个二维分布的协方差矩阵？$S_1=\\begin{bmatrix}2&1\\\\ 1&2\\end{bmatrix}$，$S_2=\\begin{bmatrix}1&2\\\\ 2&1\\end{bmatrix}$。" },
      { k: "思路", html: "协方差矩阵必须对称、半正定（特征值全非负）。" },
      { k: "解答", html: "两个都对称，所以只看特征值。$S_1$：迹 $4$、行列式 $3$，特征值 $3$ 与 $1$，都非负，可以作为协方差矩阵。$S_2$：迹 $2$、行列式 $1-4=-3$，特征值满足 $\\lambda^2-2\\lambda-3=0$，解得 $3$ 与 $-1$，出现负特征值，所以不可能。" },
      { k: "点评", html: "负特征值意味着「存在某个方向，方差是负数」，这不可能。也等价于 $S_2$ 不是半正定的：取 $\\mathbf{v}=(1,-1)$，$\\mathbf{v}^{\\mathsf T}S_2\\mathbf{v}=1-2-2+1=-2\\lt0$。判断「能不能是协方差矩阵」永远只需要这两步：对称 + 特征值非负。" }
    ]},
    { t: "quiz", qid: "ch12-q3" },
    { t: "quiz", qid: "ch12-q4" },

    // ============================================================ s4
    { t: "h", lvl: 2, text: "§12.3 多元高斯与加权最小二乘", id: "ch12-s4" },
    { t: "p", lead: true, html: "一元正态分布的密度是那条熟悉的钟形曲线。二维、三维、高维的版本长什么样？不是「几个钟形相乘」，而是一个由协方差矩阵决定的<b>椭球</b>：有的方向胖、有的方向瘦，胖瘦和朝向全写在 $\\Sigma$ 的特征值、特征向量里。这一节先看这个椭球，再用它解释加权最小二乘为什么长成那个样子。" },
    { t: "p", html: "先复习一元。$X\\sim N(\\mu,\\sigma^2)$ 的密度是" },
    { t: "tex", tex: "f(x)=\\frac{1}{\\sqrt{2\\pi\\sigma^2}}\\exp\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)" },
    { t: "p", html: "指数里是「到均值的距离除以标准差」的平方，外面的系数保证总积分为 $1$。把它推广到 $n$ 维：均值变成向量 $\\boldsymbol\\mu$，方差变成协方差矩阵 $\\Sigma$，除法变成「乘逆矩阵」，平方变成二次型：" },
    { t: "tex", tex: "p(\\mathbf{x})=\\frac{1}{(2\\pi)^{n/2}\\sqrt{\\det\\Sigma}}\\exp\\left(-\\frac12(\\mathbf{x}-\\boldsymbol\\mu)^{\\mathsf T}\\Sigma^{-1}(\\mathbf{x}-\\boldsymbol\\mu)\\right)", caption: "多元高斯密度：指数里是「马氏距离」的平方" },
    { t: "p", html: "符号说明：$\\boldsymbol\\mu$ 是 $n$ 维均值向量，$\\Sigma$ 是 $n\\times n$ 的协方差矩阵（必须<b>正定</b>，否则 $\\Sigma^{-1}$ 不存在、密度写不出来），$\\det\\Sigma$ 是行列式，$(2\\pi)^{n/2}\\sqrt{\\det\\Sigma}$ 是归一化常数。指数里那个二次型 $(\\mathbf{x}-\\boldsymbol\\mu)^{\\mathsf T}\\Sigma^{-1}(\\mathbf{x}-\\boldsymbol\\mu)$ 叫<b>马氏距离</b>（Mahalanobis distance）的平方：它不是普通的欧氏距离，而是先用 $\\Sigma^{-1}$ 「压扁」各方向再量的距离，所以方差大的方向距离显得小。顺便统一记号：本章的 $\\Sigma$ 专指协方差矩阵，与第 7 章 SVD 里那个「奇异值对角阵」的 $\\Sigma$ 不是同一个东西，本章不再用后者的记号。" },
    { t: "p", html: "密度相等的地方在哪里？指数相同的地方。让二次型等于常数 $c^2$，得到 $(\\mathbf{x}-\\boldsymbol\\mu)^{\\mathsf T}\\Sigma^{-1}(\\mathbf{x}-\\boldsymbol\\mu)=c^2$，这是一个以 $\\boldsymbol\\mu$ 为中心的<b>椭球面</b>。把 $\\Sigma$ 谱分解成 $\\Sigma=V\\Lambda V^{\\mathsf T}$，再令 $\\mathbf{y}=V^{\\mathsf T}(\\mathbf{x}-\\boldsymbol\\mu)$（转到主方向坐标系），方程就变成 $\\sum_i y_i^2/\\lambda_i=c^2$——每个方向的半轴长是 $c\\sqrt{\\lambda_i}$。所以 $\\Sigma$ 的特征向量给出椭球的<b>朝向</b>，$\\sqrt{\\lambda_i}$ 给出<b>半轴长</b>。取 $c=1$ 就是常说的「$1\\sigma$ 椭球」。" },
    { t: "theorem", name: "Gaussian Ellipsoid", zh: "多元高斯的等概率椭球", rows: [
      { k: "白话", html: "多元高斯的密度等高面是椭球；协方差矩阵的特征向量是椭球的轴方向，特征值的平方根是半轴长。" },
      { k: "条件", html: "$\\Sigma$ 对称正定，密度写成上面的形式。" },
      { k: "结论", html: "等概率面 $(\\mathbf{x}-\\boldsymbol\\mu)^{\\mathsf T}\\Sigma^{-1}(\\mathbf{x}-\\boldsymbol\\mu)=c^2$ 是一个椭球；令 $\\Sigma=V\\Lambda V^{\\mathsf T}$，则沿特征向量 $\\mathbf{v}_i$ 方向的半轴长是 $c\\sqrt{\\lambda_i}$。概率密度在长轴方向衰减得最慢。" },
      { k: "为什么", html: "在特征基下，二次型变成对角形式 $\\sum y_i^2/\\lambda_i$；这是标准椭球方程。$\\lambda_i$ 越大，同样的 $y_i$ 贡献越小，轴就越长。" },
      { k: "用法", html: "画二维高斯：先算特征值与特征向量，再按 $\\sqrt{\\lambda_i}$ 画椭圆；判断一个点是不是「离群」：算它的马氏距离平方，超过某个阈值就报警。" }
    ]},
    { t: "p", html: "看到这里，加权最小二乘就不神秘了。第 4 章的最小二乘假设每个观测的误差「一样大」，所以对每个残差一视同仁。可现实里常常不是：用精密仪器测的点误差很小，用粗糙仪器测的点误差很大，凭什么让它们同等投票？正确的做法是给每个观测一个权重 $w_i$，误差方差越大的观测权重越小。取 $w_i=1/\\sigma_i^2$（方差的倒数，方差的自然权重），把所有 $w_i$ 排成对角矩阵 $W=\\operatorname{diag}(w_1,\\dots,w_m)$，最小化" },
    { t: "tex", tex: "\\Phi(\\mathbf{x})=\\sum_{i=1}^{m}w_i\\,(b_i-\\mathbf{a}_i^{\\mathsf T}\\mathbf{x})^2=(\\mathbf{b}-A\\mathbf{x})^{\\mathsf T}W(\\mathbf{b}-A\\mathbf{x})", caption: "加权最小二乘：每个残差平方按权重求和" },
    { t: "p", html: "对 $\\mathbf{x}$ 求梯度。展开 $\\Phi=\\mathbf{b}^{\\mathsf T}W\\mathbf{b}-2\\mathbf{x}^{\\mathsf T}A^{\\mathsf T}W\\mathbf{b}+\\mathbf{x}^{\\mathsf T}A^{\\mathsf T}WA\\mathbf{x}$，梯度是 $-2A^{\\mathsf T}W\\mathbf{b}+2A^{\\mathsf T}WA\\mathbf{x}$，令其为零得到<b>加权正规方程</b>。用大白话说：<b>把第 4 章正规方程里的每个内积都换成「按 $W$ 加权」的内积</b>，结果一字不差。" },
    { t: "theorem", name: "Weighted Least Squares", zh: "加权最小二乘的正规方程", rows: [
      { k: "白话", html: "误差权重大小不一时，把残差平方按权重加起来最小化；解仍然由正规方程给出，只是 $A^{\\mathsf T}A$ 变成 $A^{\\mathsf T}WA$。" },
      { k: "条件", html: "$A$ 是 $m\\times n$ 列满秩矩阵；$W$ 是对称正定矩阵（最常用的是对角阵，$w_i\\gt0$）。" },
      { k: "结论", html: "$A^{\\mathsf T}WA\\,\\hat{\\mathbf{x}}=A^{\\mathsf T}W\\mathbf{b}$；$A^{\\mathsf T}WA$ 对称正定，所以 $\\hat{\\mathbf{x}}=(A^{\\mathsf T}WA)^{-1}A^{\\mathsf T}W\\mathbf{b}$ 唯一。" },
      { k: "证明", html: "展开目标函数并求梯度，令梯度为零即得方程。正定性：对 $\\mathbf{v}\\ne\\mathbf{0}$，$\\mathbf{v}^{\\mathsf T}A^{\\mathsf T}WA\\mathbf{v}=(A\\mathbf{v})^{\\mathsf T}W(A\\mathbf{v})\\gt0$，因为 $A$ 列满秩保证 $A\\mathbf{v}\\ne\\mathbf{0}$，而 $W$ 正定。" },
      { k: "用法", html: "误差方差已知就取 $w_i=1/\\sigma_i^2$；误差相关时取 $W=\\Sigma^{-1}$（$\\Sigma$ 是误差的协方差矩阵），这叫广义最小二乘。"
      }
    ]},
    { t: "example", no: "12.5", tag: "加权最小二乘拟合直线", fields: [
      { k: "题目", html: "三个点：$(0,1)$、$(1,2)$、$(2,4)$，权重分别是 $1,1,4$。用直线 $y=c+dt$ 做加权最小二乘拟合，并与不加权的结果比较。" },
      { k: "思路", html: "设 $A=\\begin{bmatrix}1&0\\\\ 1&1\\\\ 1&2\\end{bmatrix}$、$\\mathbf{b}=(1,2,4)^{\\mathsf T}$、$W=\\operatorname{diag}(1,1,4)$；解 $A^{\\mathsf T}WA\\mathbf{x}=A^{\\mathsf T}W\\mathbf{b}$。" },
      { k: "解答", html: "$A=\\begin{bmatrix}1&0\\\\ 1&1\\\\ 1&2\\end{bmatrix}$，$W=\\operatorname{diag}(1,1,4)$，所以 $WA=\\begin{bmatrix}1&0\\\\ 1&1\\\\ 4&8\\end{bmatrix}$。于是 $A^{\\mathsf T}WA=\\begin{bmatrix}1&1&1\\\\ 0&1&2\\end{bmatrix}\\begin{bmatrix}1&0\\\\ 1&1\\\\ 4&8\\end{bmatrix}=\\begin{bmatrix}6&9\\\\ 9&17\\end{bmatrix}$。再算 $W\\mathbf{b}=(1,2,16)^{\\mathsf T}$，得 $A^{\\mathsf T}W\\mathbf{b}=\\begin{bmatrix}1&1&1\\\\ 0&1&2\\end{bmatrix}\\begin{bmatrix}1\\\\2\\\\16\\end{bmatrix}=\\begin{bmatrix}19\\\\34\\end{bmatrix}$。解 $\\begin{bmatrix}6&9\\\\ 9&17\\end{bmatrix}\\begin{bmatrix}c\\\\d\\end{bmatrix}=\\begin{bmatrix}19\\\\34\\end{bmatrix}$：行列式 $21$，$c=\\frac{19\\cdot17-9\\cdot34}{21}=\\frac{17}{21}\\approx0.810$，$d=\\frac{6\\cdot34-9\\cdot19}{21}=\\frac{33}{21}=\\frac{11}{7}\\approx1.571$。不加权时 $A^{\\mathsf T}A=\\begin{bmatrix}3&3\\\\ 3&5\\end{bmatrix}$、$A^{\\mathsf T}\\mathbf{b}=(7,10)^{\\mathsf T}$，解得 $c=\\frac56\\approx0.833$、$d=1.5$。" },
      { k: "点评", html: "加权解在 $t=2$ 处的预测是 $0.810+2\\times1.571\\approx3.95$，非常接近那个权重为 $4$ 的点 $(2,4)$ 的 $y=4$；不加权解是 $0.833+3=3.83$，离得远一些。权重越大，拟合越「听」那个点的话。极端情形 $w_3\\to\\infty$ 会把直线硬拉过 $(2,4)$，那就是把约束当成了硬性条件。" }
    ]},
    { t: "p", html: "加权最小二乘和多元高斯是同一件事的两面。如果误差向量 $\\boldsymbol\\epsilon$ 服从均值为零、协方差为 $\\Sigma$ 的多元高斯，那么对数似然是 $-\\frac12(\\mathbf{b}-A\\mathbf{x})^{\\mathsf T}\\Sigma^{-1}(\\mathbf{b}-A\\mathbf{x})$ 加上常数，最大化似然等价于最小化这个二次型——正好是取 $W=\\Sigma^{-1}$ 的加权最小二乘。所以「最小二乘」不只是几何上「让残差最短」，它还是「在误差服从高斯时最可能的参数」。误差各个独立、方差相同时 $\\Sigma=\\sigma^2I$，$W$ 是数量矩阵，加权和不加权就是一回事，第 4 章又回来了。" },
    { t: "quiz", qid: "ch12-q5" },

    // ============================================================ 结尾
    { t: "keypoint", items: [
      { title: "一句话", html: "均值是投影，方差是残差长度的平方：统计里最基本的两个量，就是第 4 章投影公式的两个部分。" },
      { title: "两个矩阵", html: "数据矩阵 $X$ 与协方差矩阵 $S=\\frac{1}{n-1}X^{\\mathsf T}X$；$S$ 对称半正定，特征向量是主方向，特征值是各方向上的方差。" },
      { title: "一个翻译", html: "PCA 就是「用 $S$ 的特征向量重新选坐标轴」；它与第 7 章对 $X$ 做 SVD 是同一件事：若 $X=U\\Sigma_{\\mathrm{svd}}V^{\\mathsf T}$，则 $S=V\\frac{\\Sigma_{\\mathrm{svd}}^2}{n-1}V^{\\mathsf T}$。" },
      { title: "一个椭球", html: "多元高斯密度的等高面是椭球，轴方向是 $\\Sigma$ 的特征向量，半轴长是 $\\sqrt{\\lambda_i}$；指数里是马氏距离的平方。" },
      { title: "一条方程", html: "加权最小二乘的正规方程是 $A^{\\mathsf T}WA\\hat{\\mathbf{x}}=A^{\\mathsf T}W\\mathbf{b}$，取 $W=\\Sigma^{-1}$ 就是高斯最大似然；$W=I$ 退回第 4 章。" }
    ]},
    { t: "p", html: "把这一章放回全书看：第 4 章教你「怎么把向量投影到子空间」，第 12 章告诉你「平均数就是一次投影、最小二乘就是一次投影、PCA 就是换一组正交轴再做投影」。第 6、7 章的特征值与 SVD，在这里变成了「方差」与「主方向」。所以这一章不是新数学，它是同一套几何在数据上的方言。学会这门方言，你就能读懂大部分数据分析、机器学习与信号处理的教材。" },
    { t: "checklist", id: "ch12-check", items: [
      "我能把平均数写成 $\\frac{\\mathbf{x}^{\\mathsf T}\\mathbf{1}}{\\mathbf{1}^{\\mathsf T}\\mathbf{1}}\\mathbf{1}$，并验证残差与 $\\mathbf{1}$ 正交。",
      "我能用残差长度的平方写出方差，并解释除以 $n$ 与除以 $n-1$ 的差别。",
      "我能用概率向量写出期望与方差，并说出方差是「中心化向量的加权长度平方」。",
      "我能由数据矩阵算出协方差矩阵，并验证它对称、半正定。",
      "我能求出协方差矩阵的特征值、主方向，并算出第一主成分解释的方差比例。",
      "我能判断一个矩阵能不能是协方差矩阵（对称 + 特征值非负），并能用一个负特征值方向举出反例。",
      "我能写出多元高斯的密度，并说出 $\\Sigma$ 的特征值怎样决定等概率椭球的半轴长。",
      "我能推出加权最小二乘的正规方程，并解释 $W=\\Sigma^{-1}$ 与高斯最大似然的关系。"
    ]},
    { t: "quiz", qid: "ch12-q6" }
  ]
});
