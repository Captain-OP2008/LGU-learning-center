/* =====================================================================
 * data/ch15.js · 第15章 积分与向量场（Integrals and Vector Fields）
 * 初学者版：112 blocks ｜ 4 定理卡 ｜ 8 例题 ｜ 1 公式清单 ｜ 2 实验台 ｜ 3 内嵌题
 * 结构：章首「为什么学」→ 逐节直觉与推导 → 例题 → 易错 → 公式清单 → 自查清单
 * ===================================================================== */
CSC.registerChapter({
 "id": "ch15",
 "num": "15",
 "title": "积分与向量场",
 "en": "Integrals and Vector Fields",
 "goals": [
  "能沿着一条曲线把「密度乘小段长度」加起来，算出一根细丝的质量、一面曲墙的面积。",
  "能看懂向量场，算出力沿弯曲路径做的功，并分清「环量」和「通量」这两种积分。",
  "能判断一个场是不是保守场，求出势函数，只靠两个端点就把线积分算出来。",
  "能用 Green 定理把闭曲线上的积分换成平面区域上的二重积分，会用「挖洞」处理奇点。",
  "能算曲面面积和穿过曲面的通量，并说清 Stokes 定理、散度定理分别在讲什么。"
 ],
 "kp": [
  {
   "id": "ch15-1",
   "title": "这一章要造的两把工具"
  },
  {
   "id": "ch15-2",
   "title": "15.1 沿着曲线积分：把弯线切成小段"
  },
  {
   "id": "ch15-3",
   "title": "15.2 向量场、功、环量与通量"
  },
  {
   "id": "ch15-4",
   "title": "15.3 路径无关与保守场：只认端点的积分"
  },
  {
   "id": "ch15-5",
   "title": "15.4 Green 定理：边界上的环量等于内部的旋转"
  },
  {
   "id": "ch15-6",
   "title": "15.5 曲面与面积：一片曲面有多大"
  },
  {
   "id": "ch15-7",
   "title": "15.6 曲面积分：薄壳的质量与穿过的流量"
  },
  {
   "id": "ch15-8",
   "title": "15.7 Stokes 定理：环量等于旋度的通量"
  },
  {
   "id": "ch15-9",
   "title": "15.8 散度定理：闭曲面上的通量等于内部的源"
  },
  {
   "id": "ch15-10",
   "title": "三大定理对照表"
  },
  {
   "id": "ch15-11",
   "title": "本章自查清单"
  }
 ],
 "blocks": [
  {
   "t": "callout",
   "kind": "why",
   "title": "这一章要解决什么问题",
   "html": "<p>想象你在帆船上。帆是一块固定的面，风从四面八方吹来，每一点的风速都有大小和方向。你想知道：一秒里到底有多少空气穿过了这张帆？只有垂直撞上帆面的风才算数，贴着帆面吹的风再多也穿不过去。这个「穿过去的量」就是本章要算的<strong>通量</strong>（flux）。</p><p>再看另一个场景：你用绳子拉着一辆小车，沿着弯曲的山路往上走。力时大时小，方向也跟着路转。走了多远、每一刻用力多少，两件事必须一起看——只有沿着路方向的那部分力才真正做功。把每一小段上「沿路方向的力乘小段长度」加起来，就是总功。这个「沿着线累加」的量叫<strong>线积分</strong>（line integral）。</p><p>这一章先造出这两种积分（沿着线的、穿过面的），再学会三个大定理。三个定理说的其实是同一句话：<strong>边界上的积分，等于内部某个「导数」的积分</strong>。一维的微积分基本定理 $\\int_a^b f'\\,dx=f(b)-f(a)$ 就是它们的祖师爷。</p>"
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "开始前你需要知道",
   "html": "<p><b>① 定积分。</b>第 5 章的 $\\int_a^b f\\,dx$ 是「把函数值沿着一维区间累加」。不会的话先回看 <a href=\"#/ch05\">第 5 章</a>。</p><p><b>② 参数曲线。</b>第 12 章用参数 $t$ 把曲线写成 $(x(t),y(t),z(t))$，还讲了速度向量和弧长。这是本章所有计算的入口，见 <a href=\"#/ch12\">第 12 章</a>。</p><p><b>③ 梯度。</b>第 13 章的 $\\nabla f$ 是「每点指向增长最快方向」的向量。本章最重要的一类向量场就是它，见 <a href=\"#/ch13\">第 13 章</a>。</p><p><b>④ 重积分。</b>第 14 章的二重、三重积分与极坐标、球坐标换元，在本章定理的右端会反复出现，见 <a href=\"#/ch14\">第 14 章</a>。</p>"
  },
  {
   "t": "scope",
   "scope": "outside",
   "weeks": "—",
   "sections": "§15.1–15.8"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "先看一个例子：风穿过一张帆",
   "id": "ch15-s1"
  },
  {
   "t": "p",
   "html": "假设帆是 $xy$ 平面里的一块区域，风的速度场是 $\\mathbf F(x,y)=M(x,y)\\mathbf i+N(x,y)\\mathbf j$。想知道有多少空气穿过帆，就要做两件事：<b>第一</b>，在帆上每一点，把风速投影到帆的法线方向（只有这个分量穿得过去）；<b>第二</b>，把整张帆上这些投影加起来。第一步是点乘，第二步是积分。<br>如果帆是弯的、风是三维的，同一个想法照样成立：把面切成小块，每块算「法向流量」，再累加。这就是<strong>曲面积分</strong>（surface integral）；当被积的是向量场的法向分量时，它有一个专门的名字：<strong>通量</strong>。<br>再看「沿着线累加」的那一半。推车上山时，每一小段路可以看成直线，力在那一小段上几乎不变。于是这一小段做的功约等于「力在前进方向上的分量 $\\times$ 小段长度」。把整条路的小功加起来，再让每段越来越短，极限就是线积分。你会发现：<b>线积分是在算「沿着一条线的累积效果」，曲面积分是在算「穿过一片面的累积效果」</b>。两种积分都是把一维的定积分搬到了曲线和曲面上。"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "两种累加",
     "html": "沿着一条曲线累加 → 线积分；穿过一片曲面累加 → 曲面积分（取法向分量时叫通量）。"
    },
    {
     "title": "一个统一的想法",
     "html": "把对象切小，每小段/每小块上近似成常数，加起来，再取极限。第 5 章定积分也是这么来的。"
    },
    {
     "title": "三个大定理",
     "html": "Green、Stokes、散度定理都在说：<b>边界的积分 = 内部的「导数」的积分</b>。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "15.1 沿着曲线积分：把弯线切成小段",
   "id": "ch15-s2"
  },
  {
   "t": "p",
   "html": "一根铁丝，粗细均匀，但每一点的密度不一样。整根有多重？密度是变的，不能直接拿「密度乘总长度」。办法很朴素：把铁丝切成很多很短的小段，每一小段短到密度几乎不变；称出（算）每小段的质量，再全部加起来。切得越细，答案越准。<br>把这件事写成数学，就是<strong>标量函数的线积分</strong>（line integral of a scalar function）。记号里的 $\\int_C$ 表示「沿着曲线 $C$ 累加」，$ds$ 表示「一小段弧长」，$f$ 是每点的密度。"
  },
  {
   "t": "tex",
   "tex": "\\int_C f(x,y,z)\\,ds=\\lim_{n\\to\\infty}\\sum_{k=1}^{n}f(x_k,y_k,z_k)\\,\\Delta s_k"
  },
  {
   "t": "p",
   "html": "逐个符号读一遍。$C$ 是曲线；$f$ 是我们想累加的量（密度、高度、温度都行）；$ds$ 是一小段弧长；$\\Delta s_k$ 是第 $k$ 小段的长度；$(x_k,y_k,z_k)$ 是这一小段上的一个代表点。右边那个极限的意思是：切得越来越细（$n\\to\\infty$），求和就逼近真实的积分值。<br>注意 $ds$ 是<b>弧长</b>，不是 $dx$ 也不是 $dt$。这一点决定了线积分和普通定积分的区别。"
  },
  {
   "t": "tex",
   "tex": "\\boxed{\\ \\int_C f\\,ds=\\int_a^b f\\bigl(g(t),h(t),k(t)\\bigr)\\,|\\mathbf v(t)|\\,dt\\ },\\qquad |\\mathbf v|=\\sqrt{\\Bigl(\\frac{dx}{dt}\\Bigr)^2+\\Bigl(\\frac{dy}{dt}\\Bigr)^2+\\Bigl(\\frac{dz}{dt}\\Bigr)^2}"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "第一步：把曲线参数化",
     "html": "把 $C$ 写成 $\\mathbf r(t)=(g(t),h(t),k(t))$，$a\\le t\\le b$。参数 $t$ 就是「沿着曲线走的时刻」，$t$ 增大就沿曲线正向前进。"
    },
    {
     "title": "第二步：算弧长元 $ds$",
     "html": "速度向量 $\\mathbf v=\\mathbf r'(t)$，它的长度 $|\\mathbf v|$ 是「每单位时间走多远」。所以在 $dt$ 时间里走了 $|\\mathbf v|\\,dt$ 那么长，即 $ds=|\\mathbf v|\\,dt$。"
    },
    {
     "title": "第三步：把 $x,y,z$ 换成 $t$ 再积分",
     "html": "把 $f$ 里的 $x,y,z$ 用 $g(t),h(t),k(t)$ 代掉，$ds$ 用 $|\\mathbf v|\\,dt$ 代掉，就得到只含 $t$ 的普通定积分，照第 5 章的办法算。"
    }
   ]
  },
  {
   "t": "callout",
   "kind": "warn",
   "title": "这一步最容易忘：$ds\\ne dt$",
   "html": "把 $ds$ 直接当成 $dt$ 是线积分最常见的一处错误。$ds$ 是「弧长」，$dt$ 是「参数的一小步」；两者差一个速度大小 $|\\mathbf v|$。因为 $|\\mathbf v|$ 常常是常数（比如圆上走、螺旋线上走），漏掉它时算出来的式子看着还挺像，很容易蒙混过关。每次写 $ds$ 时都问自己一句：$|\\mathbf v|$ 是多少？"
  },
  {
   "t": "p",
   "html": "还有一个重要性质：<b>$\\int_C f\\,ds$ 与行走方向无关</b>。因为 $ds$ 是长度，永远为正；从 $A$ 走到 $B$ 和从 $B$ 走回 $A$，切出来的小段和对应的函数值一样，累加结果一样。<br>但要小心：$\\int_C f\\,dx$ 这种「按坐标方向累加」的积分就与方向有关了。$dx$ 是 $x$ 方向的位移，反向走时 $dx$ 变号，结果也变号。后面学向量线积分时，这个区别会反复出现。<br>几何上，如果 $z=f(x,y)\\ge 0$，那么 $\\int_C f\\,ds$ 等于「立在曲线 $C$ 上方、高度为 $f$ 的那面曲墙」的面积。想象你沿着曲线剪一张纸，纸的高度随 $f$ 变化——积分就是这张纸的面积。当 $f\\equiv1$ 时，积分退化成曲线长度 $\\int_C ds$，这和第 12 章的弧长公式完全一致。<br>同样的积分还能算质量与转动惯量。设线密度为 $\\delta(x,y,z)$，则质量元和矩分别是："
  },
  {
   "t": "tex",
   "tex": "M=\\int_C\\delta\\,ds,\\qquad M_{yz}=\\int_C x\\delta\\,ds,\\quad M_{xz}=\\int_C y\\delta\\,ds,\\quad M_{xy}=\\int_C z\\delta\\,ds,\\qquad I_x=\\int_C(y^2+z^2)\\delta\\,ds"
  },
  {
   "t": "p",
   "html": "质心坐标是 $\\bar x=M_{yz}/M$，其余两个同理。这里的关键是质量元 $dm=\\delta\\,ds$——因为累加的是「线」，所以乘的是长度元 $ds$；到了第 14 章算立体时，乘的才是体积元 $dV$。累加对象不同，元就不同，这是整章都要遵守的规矩。"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "15.2 向量场与线积分：功、环量与通量",
   "id": "ch15-s3"
  },
  {
   "t": "p",
   "html": "有些量在空间每一点只有一个数，比如温度、气压，这叫<b>标量场</b>；有些量在每一点有一个箭头——既有方向又有大小——比如风速、磁场、水流速度，这叫<strong>向量场</strong>（vector field）。<br>你可以把向量场想成：往空气里撒满小箭头，每一点插一支，箭头方向就是该点向量的方向。画出来以后，场的「形状」一眼就能看出：箭头向外散开的地方有源，箭头转圈的地方有漩涡。"
  },
  {
   "t": "tex",
   "tex": "\\mathbf F(x,y,z)=M(x,y,z)\\,\\mathbf i+N(x,y,z)\\,\\mathbf j+P(x,y,z)\\,\\mathbf k"
  },
  {
   "t": "p",
   "html": "$\\mathbf i,\\mathbf j,\\mathbf k$ 是三个坐标轴方向的单位向量。$M,N,P$ 是三个普通函数，分别表示箭头在 $x,y,z$ 方向上的分量。换句话说，向量场就是「三个标量函数捆在一起」。要判断一个向量场连续或可导，就看 $M,N,P$ 是否连续或可导。<br>最重要的一类向量场来自梯度：给定标量函数 $f$，在每一点取 $\\nabla f$，得到的向量场叫<strong>梯度场</strong>。第 13 章说过，$\\nabla f$ 指向 $f$ 增长最快的方向。所以梯度场就是「每一点都朝着函数值上升最快的方向指」的箭头场。它有一个极好的性质：沿着它走，$f$ 的变化只跟起点终点有关——这条性质是 15.3 的主角。"
  },
  {
   "t": "tex",
   "tex": "\\nabla f=\\frac{\\partial f}{\\partial x}\\,\\mathbf i+\\frac{\\partial f}{\\partial y}\\,\\mathbf j+\\frac{\\partial f}{\\partial z}\\,\\mathbf k"
  },
  {
   "t": "p",
   "html": "现在把「场」和「曲线」放在一起：让一个点沿着曲线 $C$ 走，一路上读它所在位置的向量 $\\mathbf F$。我们只关心两件事：这个向量<strong>沿着路</strong>给了多少推力（切向分量），以及它<strong>垂直穿过路</strong>给了多少流量（法向分量）。前者的积分叫线积分（算功、算环量），后者的积分叫通量。<br>先算功。力 $\\mathbf F$ 沿曲线推一个物体，只有沿着前进方向的分量做功。设 $\\mathbf T$ 是曲线的<b>单位切向量</b>（沿路往前的单位箭头），那么「沿路的那部分力」就是投影 $\\mathbf F\\cdot\\mathbf T$。把每一小段上「投影 $\\times$ 小段长度」加起来，就是总功。"
  },
  {
   "t": "tex",
   "tex": "\\boxed{\\ \\int_C\\mathbf F\\cdot d\\mathbf r=\\int_C\\mathbf F\\cdot\\mathbf T\\,ds=\\int_a^b\\mathbf F(\\mathbf r(t))\\cdot\\mathbf r'(t)\\,dt\\ }"
  },
  {
   "t": "p",
   "html": "逐个符号读：$\\mathbf r(t)$ 是曲线上「时刻 $t$ 的位置」；$d\\mathbf r=\\mathbf T\\,ds$ 是沿着曲线的一小步位移向量（既有方向又有长度）；$\\mathbf F\\cdot d\\mathbf r$ 就是这一小步上做的功。左边写成 $\\int_C\\mathbf F\\cdot d\\mathbf r$ 是在强调「沿着曲线累加位移向量」；中间的 $\\int_C\\mathbf F\\cdot\\mathbf T\\,ds$ 是在强调「切向分量乘弧长」；右边的 $\\int_a^b\\mathbf F(\\mathbf r(t))\\cdot\\mathbf r'(t)\\,dt$ 才是真正动手算的式子。<br>这几种写法完全等价，随手换算：$\\mathbf F\\cdot d\\mathbf r=\\mathbf F\\cdot\\mathbf r'(t)\\,dt$。如果喜欢按坐标拆开，也可以写成 $\\int_C M\\,dx+N\\,dy+P\\,dz$，其中 $dx=g'(t)dt$、$dy=h'(t)dt$、$dz=k'(t)dt$。这和第 12 章参数曲线的弧长公式是同一套语言。"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "第一步：参数化曲线",
     "html": "写出 $\\mathbf r(t)$ 和 $\\mathbf r'(t)$，确定 $t$ 的范围。这决定了「沿哪个方向走」。"
    },
    {
     "title": "第二步：把场换成 $t$ 的函数",
     "html": "把 $\\mathbf F$ 中的 $x,y,z$ 代成 $g(t),h(t),k(t)$，得到一个只含 $t$ 的向量。"
    },
    {
     "title": "第三步：点乘、积分",
     "html": "算 $\\mathbf F(\\mathbf r(t))\\cdot\\mathbf r'(t)$，对 $t$ 从 $a$ 积到 $b$。点乘会得到一个普通函数，接下来的定积分就是第 5 章的事。"
    }
   ]
  },
  {
   "t": "p",
   "html": "<b>方向很重要。</b>沿曲线正向走，功是 $W$；反过来走，每一步位移都反向，功变成 $-W$。所以带方向的积分（$\\int\\mathbf F\\cdot d\\mathbf r$、$\\int f\\,dx$ 这类）反向都会变号，而 $\\int f\\,ds$ 不会。算之前先想清楚「题目要求从哪走到哪」。<br>如果曲线首尾相接，也就是一条<b>闭曲线</b>，这个积分叫<strong>环量</strong>（circulation），记作 $\\oint_C\\mathbf F\\cdot d\\mathbf r$。它衡量的是「场绕着这个圈转了多少」：水在漩涡里转，环量就不为 0；水流直直地流过去，绕着圈走一圈做的净功可能是 0。<br>另一种积分是「穿过曲线」的量。对平面上的闭曲线 $C$，取它朝外的单位法向量 $\\mathbf n$，那么 $\\oint_C\\mathbf F\\cdot\\mathbf n\\,ds$ 叫<strong>通量</strong>——它数的是「有多少流量穿过这条曲线」。正数表示净流出，负数表示净流入。<br>一句话记住：<b>环量用切向分量 $\\mathbf F\\cdot\\mathbf T$，通量用法向分量 $\\mathbf F\\cdot\\mathbf n$</b>。切向看「转」，法向看「穿」。"
  },
  {
   "t": "tex",
   "tex": "\\text{Flux}=\\oint_C\\mathbf F\\cdot\\mathbf n\\,ds=\\oint_C M\\,dy-N\\,dx\\qquad(C\\ \\text{逆时针},\\ \\mathbf n\\ \\text{外法向})"
  },
  {
   "t": "p",
   "html": "最后那个 $\\oint M\\,dy-N\\,dx$ 是怎么来的？把逆时针方向的单位切向量记成 $\\mathbf T=(dx/ds,\\,dy/ds)$，把 $\\mathbf T$ 顺时针转 $90^\\circ$ 就得到外法向 $\\mathbf n=(dy/ds,\\,-dx/ds)$。于是 $\\mathbf F\\cdot\\mathbf n\\,ds=M\\,dy-N\\,dx$。现在先用几何直觉理解，15.4 会用 Green 定理把它和散度连起来。"
  },
  {
   "t": "quiz",
   "qid": "ch15-q2"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "两种线积分",
     "html": "$\\int_C f\\,ds$ 累加「大小」，与方向无关；$\\int_C\\mathbf F\\cdot d\\mathbf r$ 累加「沿路的投影」，与方向有关。"
    },
    {
     "title": "环量与通量",
     "html": "环量 $=\\oint\\mathbf F\\cdot\\mathbf T\\,ds$ 量「转」；通量 $=\\oint\\mathbf F\\cdot\\mathbf n\\,ds$ 量「穿」。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "15.3 路径无关与保守场：只认端点的积分",
   "id": "ch15-s5"
  },
  {
   "t": "p",
   "html": "爬山时你会有个经验：不管走哪条路，从山脚到山顶，海拔总共升高了多少，只由起点和终点决定，跟路线无关。重力做的功也一样——你从一楼走到十楼，重力做的总功只跟高度差有关，绕多少圈都没用。<br>把这种「积分只由端点决定」的性质放大，就是<strong>路径无关</strong>（path independence）：在区域 $D$ 里任取两点 $A,B$，不管沿哪条路从 $A$ 到 $B$，$\\int_C\\mathbf F\\cdot d\\mathbf r$ 都等于同一个数。"
  },
  {
   "t": "tex",
   "tex": "\\int_C\\mathbf F\\cdot d\\mathbf r\\ \\text{与路径无关}\\quad\\Longleftrightarrow\\quad \\mathbf F\\ \\text{在}\\ D\\ \\text{上保守（conservative）}"
  },
  {
   "t": "p",
   "html": "为什么会「只认端点」？因为这样的场一定是某个标量函数的梯度：$\\mathbf F=\\nabla f$。这个 $f$ 叫<strong>势函数</strong>（potential function）。好比爬山时的「海拔图」：$f$ 就是海拔，$\\mathbf F$ 是「每点最陡的上坡方向」。沿着任何一条路走，海拔的变化只取决于起点终点。这就是下面这个定理的白话版。"
  },
  {
   "t": "theorem",
   "name": "线积分基本定理（Fundamental Theorem of Line Integrals）",
   "rows": [
    {
     "k": "白话",
     "html": "如果力场是某个「海拔函数」的梯度，那么沿任何路径做的功，都只等于海拔差。"
    },
    {
     "k": "条件",
     "html": "$f$ 可微、$\\nabla f$ 连续，$C$ 是从 $A$ 到 $B$ 的分段光滑曲线。"
    },
    {
     "k": "结论",
     "html": "$\\displaystyle\\int_C\\mathbf F\\cdot d\\mathbf r=\\int_C\\nabla f\\cdot d\\mathbf r=f(B)-f(A)$。"
    },
    {
     "k": "怎么用",
     "html": "先确认（或题目已经告诉你）$\\mathbf F=\\nabla f$，再只算两个端点的 $f$ 值作差。完全不用参数化曲线。"
    }
   ]
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "思路：把曲线积分变成一元函数的积分",
     "html": "沿着曲线走时，$f$ 的值是 $t$ 的函数：$\\varphi(t)=f(\\mathbf r(t))$。只要算出 $\\varphi'(t)$，再对 $t$ 积分，就能用微积分基本定理。"
    },
    {
     "title": "对 $\\varphi$ 用链式法则",
     "html": "$\\varphi'(t)=\\dfrac{d}{dt}f(\\mathbf r(t))=\\nabla f(\\mathbf r(t))\\cdot\\mathbf r'(t)=\\mathbf F(\\mathbf r(t))\\cdot\\mathbf r'(t)$。这一步说：沿路走时 $f$ 的瞬时变化率，正好是「梯度在该方向上的投影」，也就是力做的功率。"
    },
    {
     "title": "两边从 $a$ 积分到 $b$",
     "html": "$\\displaystyle\\int_a^b\\mathbf F\\cdot\\mathbf r'\\,dt=\\int_a^b\\varphi'(t)\\,dt=\\varphi(b)-\\varphi(a)$。"
    },
    {
     "title": "把端点换回 $A,B$",
     "html": "$\\varphi(a)=f(\\mathbf r(a))=f(A)$，$\\varphi(b)=f(B)$，于是 $\\int_C\\mathbf F\\cdot d\\mathbf r=f(B)-f(A)$。这正是 $\\int_a^b f'(x)dx=f(b)-f(a)$ 的曲线版。"
    }
   ]
  },
  {
   "t": "p",
   "html": "这个定理有一个直接推论：<b>保守场沿任何闭曲线的环量都是 0</b>（起点终点相同，$f(B)-f(A)=0$）。反过来也对：如果某个场沿所有闭曲线的环量都是 0，它就是保守场。于是下面三句话说的是同一件事：$\\mathbf F=\\nabla f$；$\\mathbf F$ 保守；$\\oint_C\\mathbf F\\cdot d\\mathbf r=0$（对区域内每一条闭曲线）。<br>但现实中题目往往不直接说「这个场是某个 $f$ 的梯度」。我们需要一个<strong>判据</strong>，只查偏导就能判断。这个判据就是组件测试（Component Test）："
  },
  {
   "t": "tex",
   "tex": "\\mathbf F\\ \\text{保守}\\ \\Longleftrightarrow\\ \\frac{\\partial P}{\\partial y}=\\frac{\\partial N}{\\partial z},\\qquad \\frac{\\partial M}{\\partial z}=\\frac{\\partial P}{\\partial x},\\qquad \\frac{\\partial N}{\\partial x}=\\frac{\\partial M}{\\partial y}\\qquad(\\mathbf F=M\\mathbf i+N\\mathbf j+P\\mathbf k)"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "判据是从哪来的？先看「必要条件」",
     "html": "如果 $\\mathbf F=\\nabla f$，那么 $M=f_x,\\ N=f_y,\\ P=f_z$。于是 $\\partial P/\\partial y=f_{zy}$，$\\partial N/\\partial z=f_{yz}$。只要 $f$ 的二阶偏导连续，混合偏导就相等，所以三对等式必须成立。换句话说：<b>三对偏导相等，就是「存在势函数」的必要条件</b>。"
    },
    {
     "title": "再想「充分性」：单连通才够",
     "html": "反方向（三对相等 $\\Rightarrow$ 有势函数）需要区域「没有洞」。在单连通区域上，用 Stokes 定理可以证明任意闭曲线的环量为 0，于是积分只认端点，势函数存在。如果有洞，绕洞的闭曲线可能积出非零值，判据就失效了。"
    },
    {
     "title": "什么是「单连通」",
     "html": "直观说：区域里任何一个圈都能在区域内部收缩成一个点。整个平面、整个空间、凸区域都单连通；平面去掉原点、空间去掉 $z$ 轴就不是——绕洞的圈收不回去。判据前必须先说一句「定义域是开且单连通的」。"
    }
   ]
  },
  {
   "t": "callout",
   "kind": "warn",
   "title": "经典反例：判据满足，但不保守",
   "html": "<p>看这个场：$\\mathbf F=\\dfrac{-y\\,\\mathbf i+x\\,\\mathbf j}{x^2+y^2}$，定义域是平面去掉原点。它描述的是「绕原点转圈」的漩涡。</p><p>算一下：$\\dfrac{\\partial N}{\\partial x}=\\dfrac{y^2-x^2}{(x^2+y^2)^2}=\\dfrac{\\partial M}{\\partial y}$，三对偏导全部相等，判据满足。但取绕原点的单位圆 $C$ 直接算环量，结果是 $2\\pi\\ne0$。</p><p>原因很简单：定义域有洞，不是单连通。绕洞走一圈，$f$ 绕不回来（它其实是一个角度函数，转一圈角度增加 $2\\pi$）。所以「判据满足」只保证「局部」像梯度，不保证「整体」有势函数。</p>"
  },
  {
   "t": "p",
   "html": "求势函数的方法很机械：解方程组 $f_x=M,\\ f_y=N,\\ f_z=P$。先对 $f_x=M$ 关于 $x$ 积分，得到的「积分常数」是一个只含 $y,z$ 的函数 $g(y,z)$；再对 $y$ 求偏导和 $N$ 比较，定出 $g_y$；再对 $z$ 定出最后一部分。最后别忘了加任意常数 $C$——势函数不唯一，但 $f(B)-f(A)$ 唯一。<br>最后把「恰当微分形式」也收进来。$M\\,dx+N\\,dy+P\\,dz$ 如果恰好等于某个 $df$，就说它是<strong>恰当</strong>（exact）的。判断方法还是那三对偏导；一旦恰当，积分立刻变成端点作差："
  },
  {
   "t": "tex",
   "tex": "\\int_A^B M\\,dx+N\\,dy+P\\,dz=f(B)-f(A)"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "三句话等价",
     "html": "保守 $\\iff$ 是梯度场 $\\mathbf F=\\nabla f$ $\\iff$ 沿任意闭曲线的环量为 0。"
    },
    {
     "title": "判据有前提",
     "html": "「三对偏导相等」只在开、单连通区域上才等价于保守；有洞时会出现满足判据却不保守的漩涡场。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "15.4 Green 定理：边界上的环量等于内部的旋转",
   "id": "ch15-s6"
  },
  {
   "t": "p",
   "html": "这一节要把「沿边界的线积分」换成「在区域上的二重积分」。先建立两个直觉。<br><b>第一个是「旋转」。</b>把一个小水车轮子放进平面流场里。如果水推着轮子转，就说明这个点附近有「旋转」。往右走时向上推、往上走时向左推，轮子就会转——这种「剪切」正是旋转的来源。旋转的强弱用一个数表示，叫<strong>环量密度</strong>，它等于旋度的 $\\mathbf k$ 分量："
  },
  {
   "t": "tex",
   "tex": "(\\nabla\\times\\mathbf F)\\cdot\\mathbf k=\\frac{\\partial N}{\\partial x}-\\frac{\\partial M}{\\partial y}\\qquad\\bigl(\\mathbf F=M\\mathbf i+N\\mathbf j\\bigr)"
  },
  {
   "t": "p",
   "html": "为什么是这个式子？想象流体在 $x$ 方向的流速 $M$ 随 $y$ 增大而增大，同时 $y$ 方向的流速 $N$ 随 $x$ 增大而增大。前一种情况会把轮子「上边往右推、下边往左推」，让它顺时针转；后一种情况会「右边往上推、左边往下推」，让它逆时针转。两个趋势相减，就是净旋转 $N_x-M_y$。<br><b>第二个是「源」。</b>如果每一点都在向外冒水，那么这个点有「源」；如果都在吸水，就有「汇」。源汇的强弱叫<strong>散度</strong>（divergence），等于「各方向流速的偏导之和」："
  },
  {
   "t": "tex",
   "tex": "\\nabla\\cdot\\mathbf F=\\frac{\\partial M}{\\partial x}+\\frac{\\partial N}{\\partial y}\\qquad(\\text{平面情形})"
  },
  {
   "t": "p",
   "html": "正数表示源（向外膨胀），负数表示汇，恒等于 0 表示「不可压缩」——水往哪里流都不会在这一点堆积或凭空产生。这两个量分别对应两种 Green 定理：<b>环量密度配切向积分，散度配法向积分</b>。<br>在写定理之前先约定方向：闭曲线 $C$ 的<strong>正向</strong>（也叫正定向）是「沿曲线走时，所围区域始终在你的左手边」，也就是逆时针方向。"
  },
  {
   "t": "theorem",
   "name": "Green 定理（平面上的边界与内部）",
   "rows": [
    {
     "k": "白话",
     "html": "沿闭曲线逆时针走一圈的「环量」，等于区域内部所有小块的「旋转」加起来；把切向换成法向，环量就换成通量，旋转就换成散度。"
    },
    {
     "k": "条件",
     "html": "$C$ 是分段光滑的简单闭曲线（不自交），$M,N$ 在包含 $R$ 的开区域上有连续的一阶偏导。"
    },
    {
     "k": "结论",
     "html": "$\\displaystyle\\oint_C M\\,dx+N\\,dy=\\iint_R\\Bigl(\\frac{\\partial N}{\\partial x}-\\frac{\\partial M}{\\partial y}\\Bigr)dA$；法向形式 $\\displaystyle\\oint_C M\\,dy-N\\,dx=\\iint_R\\Bigl(\\frac{\\partial M}{\\partial x}+\\frac{\\partial N}{\\partial y}\\Bigr)dA$。"
    },
    {
     "k": "怎么用",
     "html": "看到「闭曲线 + 难算的线积分」，先试 Green：确认正向，选对形式，把线积分改成二重积分（常换成极坐标）。"
    }
   ]
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "先证一个矩形",
     "html": "设区域是矩形 $R=[a,b]\\times[c,d]$，边界逆时针：下边从左到右、右边从下到上、上边从右到左、左边从上到下。先算 $\\oint_C M\\,dx$。"
    },
    {
     "title": "只留下上下两条边",
     "html": "左右两条边是竖直的，$dx=0$，不贡献。下边 $\\int_a^b M(x,c)\\,dx$；上边往左走，所以是 $\\int_b^a M(x,d)\\,dx=-\\int_a^b M(x,d)\\,dx$。"
    },
    {
     "title": "两条边合成一个二重积分",
     "html": "$\\displaystyle\\oint_C M\\,dx=-\\int_a^b\\bigl[M(x,d)-M(x,c)\\bigr]dx=-\\int_a^b\\!\\!\\int_c^d\\frac{\\partial M}{\\partial y}\\,dy\\,dx$。这里用了微积分基本定理：$M(x,d)-M(x,c)=\\int_c^d M_y\\,dy$。注意负号来自「上边往左走」。"
    },
    {
     "title": "对 $N\\,dy$ 重复一次",
     "html": "$\\displaystyle\\oint_C N\\,dy=\\int_c^d N(b,y)\\,dy-\\int_c^d N(a,y)\\,dy=\\int_a^b\\!\\!\\int_c^d\\frac{\\partial N}{\\partial x}\\,dy\\,dx$。两式相加就是矩形上的 Green 定理。"
    },
    {
     "title": "用「拼小矩形」推广到任意区域",
     "html": "把任意区域切成许多小矩形。内部相邻的公共边被走两次、方向相反，积分正好抵消；剩下的只有外边界。对所有小矩形求和，就得到整个区域上的 Green 定理。所以它本质上是「微积分基本定理 + 拼接」。"
    }
   ]
  },
  {
   "t": "p",
   "html": "法向形式其实不用重新证明：把环量形式里的场换成 $\\mathbf G=(-N)\\,\\mathbf i+M\\,\\mathbf j$（相当于把场整体旋转 $90^\\circ$），算一算 $\\partial G_y/\\partial x-\\partial G_x/\\partial y$，就得到 $M_x+N_y$。所以两种形式是同一个定理的两副面孔。<br>Green 定理还送了一个求面积的公式。在法向形式里取 $M=x,\\ N=0$（或者选别的组合），右边变成 $\\iint_R 1\\,dA$，左边就是边界积分："
  },
  {
   "t": "tex",
   "tex": "A=\\oint_C x\\,dy=-\\oint_C y\\,dx=\\frac12\\oint_C\\bigl(x\\,dy-y\\,dx\\bigr)\\qquad(C\\ \\text{正向})"
  },
  {
   "t": "p",
   "html": "它的用处是：参数曲线围成的区域，不用先画出区域再算二重积分，直接沿边界走一圈就能算出面积。椭圆、星形线这种参数方程给得漂亮的图形最省事。<br><b>遇到洞怎么办？</b>如果被积函数在区域里某点没有定义（比如分母是 $x^2+y^2$），不能直接对整个区域用 Green 定理。正确做法是<strong>挖洞</strong>：在坏点周围挖掉一个小圆，剩下一个「环域」。环域的外边界逆时针、内边界顺时针（这样区域始终在左手边），Green 定理照样成立。通常洞里的散度或旋转恰好是 0，于是「外边界积分 = 内边界反向积分」，问题就转移到了好算的小圆上。"
  },
  {
   "t": "lab",
   "id": "green"
  },
  {
   "t": "quiz",
   "qid": "ch15-q5"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "15.5 曲面与面积：一片曲面有多大",
   "id": "ch15-s7"
  },
  {
   "t": "p",
   "html": "求曲线长度时，我们把曲线切小段、用直线段近似、再取极限。求曲面面积同理：把曲面切成小块，每一小块近似成一个小平行四边形，把平行四边形面积加起来，再让块越来越小。<br>麻烦在于：曲面是弯的，一小块平行四边形的两条边分别是「沿着 $u$ 方向走一步」和「沿着 $v$ 方向走一步」，这两个向量叉乘的模就是面积。所以关键工具是<strong>参数曲面</strong>。<br>把曲面写成 $\\mathbf r(u,v)=f(u,v)\\,\\mathbf i+g(u,v)\\,\\mathbf j+h(u,v)\\,\\mathbf k$，$(u,v)$ 在参数域 $R$ 里跑。固定 $u$、让 $v$ 变，得到一条网格线；固定 $v$、让 $u$ 变，得到另一条。两条网格线在每点给出两个切向量：$\\mathbf r_u$ 和 $\\mathbf r_v$。它们叉乘得到的向量 $\\mathbf r_u\\times\\mathbf r_v$ <b>垂直于曲面</b>，这就是曲面的法向量。"
  },
  {
   "t": "tex",
   "tex": "d\\sigma=|\\mathbf r_u\\times\\mathbf r_v|\\,du\\,dv,\\qquad A=\\iint_R|\\mathbf r_u\\times\\mathbf r_v|\\,du\\,dv"
  },
  {
   "t": "p",
   "html": "为什么是叉乘的模？在参数域里取一个小矩形，边长 $du,dv$，映射到曲面上变成一个「弯的平行四边形」，两条边约等于 $\\mathbf r_u\\,du$ 和 $\\mathbf r_v\\,dv$。平行四边形面积 $=|\\mathbf r_u\\times\\mathbf r_v|\\,du\\,dv$。所以 $d\\sigma$ 就是这一小块的真实面积，积分起来就是总面积。<br>这里要求曲面<strong>光滑</strong>：$\\mathbf r_u,\\mathbf r_v$ 连续，且叉乘不为零（否则法向量消失，参数化在这一点失效）。<br>常用快算结果：圆锥 $\\mathbf r(r,\\theta)=r\\cos\\theta\\,\\mathbf i+r\\sin\\theta\\,\\mathbf j+r\\,\\mathbf k$ 有 $|\\mathbf r_r\\times\\mathbf r_\\theta|=\\sqrt2\\,r$；球面 $\\mathbf r(\\phi,\\theta)=a\\sin\\phi\\cos\\theta\\,\\mathbf i+a\\sin\\phi\\sin\\theta\\,\\mathbf j+a\\cos\\phi\\,\\mathbf k$ 有 $|\\mathbf r_\\phi\\times\\mathbf r_\\theta|=a^2\\sin\\phi$。这两个结果建议自己推一遍——推过一遍就不会记错。<br>如果曲面不是参数式给出的，而是方程给出的，还有两条省事的路：<br><b>隐式</b> $F(x,y,z)=c$：法向量方向是 $\\nabla F$，投影到某个坐标平面（单位法向量 $\\mathbf p$）时，面积元被「拉长」了 $|\\nabla F|/|\\nabla F\\cdot\\mathbf p|$ 倍；<br><b>显式</b> $z=f(x,y)$：这是隐式取 $F=z-f(x,y)$ 的特例，面积元是 $\\sqrt{f_x^2+f_y^2+1}\\,dx\\,dy$。"
  },
  {
   "t": "tex",
   "tex": "d\\sigma=\\frac{|\\nabla F|}{|\\nabla F\\cdot\\mathbf p|}\\,dA\\quad(\\text{隐式}),\\qquad d\\sigma=\\sqrt{f_x^2+f_y^2+1}\\,dx\\,dy\\quad(\\text{显式 }z=f(x,y))"
  },
  {
   "t": "p",
   "html": "显式公式里的「$+1$」最容易被漏掉。可以这样记：它来自 $\\mathbf n\\,d\\sigma=(-f_x\\,\\mathbf i-f_y\\,\\mathbf j+\\mathbf k)\\,dx\\,dy$，这个向量长度正好是 $\\sqrt{f_x^2+f_y^2+1}$。换句话说，倾斜的曲面在水平投影上看起来小，真实面积要乘上「倾斜放大倍数」。"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "三种给法，三个公式",
     "html": "参数式用 $|\\mathbf r_u\\times\\mathbf r_v|du\\,dv$；隐式用 $|\\nabla F|/|\\nabla F\\cdot\\mathbf p|\\,dA$；显式用 $\\sqrt{f_x^2+f_y^2+1}\\,dx\\,dy$。"
    },
    {
     "title": "面积元就是平行四边形",
     "html": "参数网格把参数域的小矩形映射成曲面上的小平行四边形，$d\\sigma$ 就是它的面积。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "15.6 曲面积分：薄壳的质量与穿过的流量",
   "id": "ch15-s8"
  },
  {
   "t": "p",
   "html": "线积分是把「线」切小段累加，曲面积分就是把「面」切小块累加。最直接的应用是求一块薄壳的质量：如果面上每一点的密度是 $G(x,y,z)$，那么每一小块的「质量 $\\approx$ 密度 $\\times$ 小块面积」，加起来就是总质量。这就是<strong>标量函数的曲面积分</strong>："
  },
  {
   "t": "tex",
   "tex": "\\iint_S G(x,y,z)\\,d\\sigma=\\lim_{n\\to\\infty}\\sum_{k=1}^{n}G(x_k,y_k,z_k)\\,\\Delta\\sigma_k"
  },
  {
   "t": "p",
   "html": "这里 $d\\sigma$ 是「一小块面积」，$S$ 是曲面，$G$ 是每点要累加的量。算法和 15.5 完全对应：曲面怎么给出，就用哪个面积元。"
  },
  {
   "t": "tex",
   "tex": "\\iint_S G\\,d\\sigma=\\begin{cases}\\displaystyle\\iint_R G\\bigl(f,g,h\\bigr)\\,|\\mathbf r_u\\times\\mathbf r_v|\\,du\\,dv & \\text{参数式 }\\mathbf r(u,v)\\\\[8pt] \\displaystyle\\iint_R G\\,\\frac{|\\nabla F|}{|\\nabla F\\cdot\\mathbf p|}\\,dA & \\text{隐式 }F=c\\\\[8pt] \\displaystyle\\iint_R G(x,y,f(x,y))\\,\\sqrt{f_x^2+f_y^2+1}\\,dx\\,dy & \\text{显式 }z=f(x,y)\\end{cases}"
  },
  {
   "t": "p",
   "html": "取 $G\\equiv1$，积分就退化成曲面面积；取 $G$ 为面密度，得到薄壳质量；乘上 $y^2+z^2$，得到绕 $x$ 轴的转动惯量。曲面由几块拼成时（比如立方体的六个面），用可加性逐块算再相加。注意在坐标平面内的那些面，对应的面积元会变得特别简单（例如 $z=0$ 的面上 $d\\sigma=dx\\,dy$）。<br>接下来是最重要的一步：给曲面<strong>定向</strong>。在曲面上每一点选一个法向量 $\\mathbf n$，如果能让这些法向量连续地铺满整个曲面，这个曲面就<strong>可定向</strong>（也叫双侧曲面）。想一下莫比乌斯带：沿着它走一圈回来，法向量会翻到反面——这种叫不可定向（单侧）曲面，本章不处理。<br>参数式 $\\mathbf r(u,v)$ 天然给出一个定向：$\\mathbf n=\\dfrac{\\mathbf r_u\\times\\mathbf r_v}{|\\mathbf r_u\\times\\mathbf r_v|}$。把参数顺序换一下（$u,v$ 互换），法向量就整体反向。封闭区域的边界曲面则约定取<strong>外法向</strong>。<br>有了法向，就能定义<strong>通量</strong>（flux）。设 $\\mathbf F$ 是流体的速度场（单位：米/秒），那么在曲面上每一点，只有法向分量 $\\mathbf F\\cdot\\mathbf n$ 能穿过去；乘上一小块面积 $d\\sigma$，就是这一小块每单位时间的流量。全部加起来，就是整个曲面的通量："
  },
  {
   "t": "tex",
   "tex": "\\boxed{\\ \\iint_S\\mathbf F\\cdot\\mathbf n\\,d\\sigma\\ }=\\text{单位时间内沿 }\\mathbf n\\ \\text{方向净穿过 }S\\ \\text{的流量}"
  },
  {
   "t": "p",
   "html": "实际计算时不用先算单位法向量再乘回去，直接用心算的「面积元向量」$\\mathbf n\\,d\\sigma$。三种给法对应三个公式："
  },
  {
   "t": "tex",
   "tex": "\\mathbf n\\,d\\sigma=(\\mathbf r_u\\times\\mathbf r_v)\\,du\\,dv\\quad(\\text{参数式}),\\qquad \\mathbf n\\,d\\sigma=\\pm\\frac{\\nabla g}{|\\nabla g\\cdot\\mathbf p|}\\,dA\\quad(\\text{隐式}),\\qquad \\mathbf n\\,d\\sigma=(-f_x\\,\\mathbf i-f_y\\,\\mathbf j+\\mathbf k)\\,dx\\,dy\\quad(\\text{显式，向上})"
  },
  {
   "t": "p",
   "html": "把这三个 <b>向量形式的面积元</b> 直接和 $\\mathbf F$ 点乘，就得到通量的被积函数。显式曲面的公式展开是 $\\text{Flux}=\\iint_R(-Mf_x-Nf_y+P)\\,dx\\,dy$；如果题目要「向下」的通量，整体加个负号。<br>方向感要一直绷着：把法向量取反，通量就变号。算完之后回头检查一句「我算的是向外还是向内」，这是本章最容易丢分的地方。"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "两个积分别混",
     "html": "$\\iint_S G\\,d\\sigma$ 累加「面上的量」（质量、面积）；$\\iint_S\\mathbf F\\cdot\\mathbf n\\,d\\sigma$ 累加「穿过面的流量」（通量）。"
    },
    {
     "title": "定向决定符号",
     "html": "先选法向：参数式用 $\\mathbf r_u\\times\\mathbf r_v$，封闭曲面用外法向。方向反了，答案整体变号。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "15.7 Stokes 定理：环量等于旋度的通量",
   "id": "ch15-s9"
  },
  {
   "t": "p",
   "html": "在 15.4 里我们看见：平面上的环量 = 区域内部「旋转」的总和。如果曲面是弯的呢？比如一个碗状的曲面，它的边界是一条空间闭曲线。Stokes 定理说：沿边界走一圈的环量，等于曲面上每一点「旋转」的通量。它就是把 Green 定理从平面搬到了空间中任意曲面上。<br>要写这个定理，先得把「旋转」推广到三维。平面里旋转只有一个方向（绕 $z$ 轴），空间中却有各种方向，所以「旋转」变成一个<strong>向量</strong>，叫<strong>旋度</strong>（curl）。"
  },
  {
   "t": "tex",
   "tex": "\\operatorname{curl}\\mathbf F=\\nabla\\times\\mathbf F=\\begin{vmatrix}\\mathbf i&\\mathbf j&\\mathbf k\\\\[2pt] \\dfrac{\\partial}{\\partial x}&\\dfrac{\\partial}{\\partial y}&\\dfrac{\\partial}{\\partial z}\\\\[6pt] M&N&P\\end{vmatrix}=\\Bigl(\\frac{\\partial P}{\\partial y}-\\frac{\\partial N}{\\partial z}\\Bigr)\\mathbf i+\\Bigl(\\frac{\\partial M}{\\partial z}-\\frac{\\partial P}{\\partial x}\\Bigr)\\mathbf j+\\Bigl(\\frac{\\partial N}{\\partial x}-\\frac{\\partial M}{\\partial y}\\Bigr)\\mathbf k"
  },
  {
   "t": "p",
   "html": "这个行列式只是帮助记忆的写法：第一行是三个单位向量，第二行是三个偏导算子，第三行是场的三个分量。按第一行展开时，$\\mathbf j$ 那一项前面<strong>带负号</strong>（因为 $\\mathbf j$ 在第二列，行列式展开的符号是 $-1$），这就是考试里最常见的抄错点。<br>记住两件事：<b>旋度是向量，不是数</b>；它的 $\\mathbf k$ 分量正好是 15.4 的环量密度 $(\\nabla\\times\\mathbf F)\\cdot\\mathbf k=N_x-M_y$。小水轮转得最快的方向，就是旋度指的方向。"
  },
  {
   "t": "theorem",
   "name": "Stokes 定理（Stokes' Theorem）",
   "rows": [
    {
     "k": "白话",
     "html": "沿曲面边界走一圈的环量，等于把旋度在整片曲面上「穿过去」加起来。"
    },
    {
     "k": "条件",
     "html": "$S$ 是分段光滑的有向曲面，边界 $C=\\partial S$ 是分段光滑闭曲线，$\\mathbf F$ 的分量在包含 $S$ 的开区域上有连续一阶偏导。"
    },
    {
     "k": "结论",
     "html": "$\\displaystyle\\oint_C\\mathbf F\\cdot d\\mathbf r=\\iint_S(\\nabla\\times\\mathbf F)\\cdot\\mathbf n\\,d\\sigma$。"
    },
    {
     "k": "怎么用",
     "html": "空间闭曲线上的环量难算时，换成以它为边界的简单曲面（平面圆盘、三角片），把线积分变成旋度的通量；反过来也行。"
    }
   ]
  },
  {
   "t": "p",
   "html": "定理里每个量都对上了：左边是沿边界 $C$ 的<strong>环量</strong>（切向分量的积分）；右边是<strong>旋度</strong>（每点的旋转向量）在曲面法向上的投影、乘面积元再积分——也就是旋度穿过曲面的<strong>通量</strong>。一句话：<b>边界上转一圈的效果 = 内部旋转的累积</b>。<br>方向和符号由<strong>右手法则</strong>绑定：右手四指顺着 $C$ 的正向弯曲，拇指指向的那一侧就是法向量 $\\mathbf n$ 的方向；反过来，从 $\\mathbf n$ 的尖端往下看，$C$ 应该是逆时针的。$\\mathbf n$ 选反，整个式子右边就变号。<br>Stokes 定理有一个非常好用的推论：<b>曲面可以随便换，只要边界相同</b>。如果 $S_1,S_2$ 是有相同边界 $C$ 的两个有向曲面，那么 $\\iint_{S_1}(\\nabla\\times\\mathbf F)\\cdot\\mathbf n\\,d\\sigma=\\iint_{S_2}(\\nabla\\times\\mathbf F)\\cdot\\mathbf n\\,d\\sigma$。所以遇到形状复杂的曲面（比如锥面、抛物面），可以换成同边界的平面圆盘来算，往往一步就出来。<br>当曲面是平面区域、法向取 $\\mathbf k$ 时，$d\\sigma=dx\\,dy$，旋度的 $\\mathbf k$ 分量就是 $N_x-M_y$，Stokes 立刻退化成 Green 定理。所以 Green 是 Stokes 的平面特例。<br>还有两个恒等式，把「梯度」「旋度」「散度」串了起来。第一个：<b>梯度场的旋度恒为零</b>，$\\nabla\\times\\nabla f=\\mathbf 0$。直觉是：梯度场沿任何闭曲线都没有环量（因为 $f(B)-f(A)=0$），由 Stokes，旋度的通量必须是 0，对任意曲面都成立，所以旋度处处为 0。<br>反方向的结论需要单连通：在单连通区域上，如果处处 $\\nabla\\times\\mathbf F=\\mathbf 0$，那么每条闭曲线的环量都是 0，于是 $\\mathbf F$ 保守。这就把 15.3 的判据补全了。<br>最后留意「有洞的曲面」：如果曲面像个救生圈，边界不止一条曲线，Stokes 定理仍然成立，但右边要取<strong>所有</strong>边界曲线上的积分，并且方向要统一（从法向尖端看，每条边界都按「区域在左手边」的规则走）。这种情况和第 15.4 节的多连通区域是一回事。"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "一句话",
     "html": "沿边界的环量 = 旋度在曲面上的通量。"
    },
    {
     "title": "两个提醒",
     "html": "右手法则绑定 $\\mathbf n$ 与 $C$；同边界可以换曲面，换成最省事的那个。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "15.8 散度定理：闭曲面上的通量等于内部的源",
   "id": "ch15-s10"
  },
  {
   "t": "p",
   "html": "想象一个气球，里面的空气在膨胀：每个点都在向外挤。那么从气球表面看，一定有空气在往外流。膨胀得越厉害，表面流出的总量越大。散度定理说的就是这件事：<b>闭曲面上的净通量，等于内部每一点「膨胀」的总和</b>。<br>先把「膨胀」写成公式。三维的<strong>散度</strong>（divergence）是三个方向流速的偏导之和："
  },
  {
   "t": "tex",
   "tex": "\\operatorname{div}\\mathbf F=\\nabla\\cdot\\mathbf F=\\frac{\\partial M}{\\partial x}+\\frac{\\partial N}{\\partial y}+\\frac{\\partial P}{\\partial z}"
  },
  {
   "t": "p",
   "html": "它是个数，不是向量。$\\nabla\\cdot\\mathbf F>0$ 表示这一点在「冒」（源），$<0$ 表示在「吸」（汇），$=0$ 表示不可压缩：流进来多少就流出去多少，不在这一点堆积。散度可以看成「单位体积的通量」，这也是为什么把散度在整个体积上积分，会等于边界上的总通量。"
  },
  {
   "t": "theorem",
   "name": "散度定理（Divergence Theorem / Gauss 定理）",
   "rows": [
    {
     "k": "白话",
     "html": "一个封闭曲面上「流出去的总量」，等于内部每个小体积「冒出多少」的总和。"
    },
    {
     "k": "条件",
     "html": "$\\mathbf F$ 的分量有连续一阶偏导；$S$ 是分段光滑的<strong>闭曲面</strong>（围成一个立体 $D$），$\\mathbf n$ 取<strong>外法向</strong>。"
    },
    {
     "k": "结论",
     "html": "$\\displaystyle\\oiint_S\\mathbf F\\cdot\\mathbf n\\,d\\sigma=\\iiint_D\\nabla\\cdot\\mathbf F\\,dV$。"
    },
    {
     "k": "怎么用",
     "html": "闭曲面上的通量难算（面多、参数化麻烦）时，改算内部的三重积分（常换柱坐标、球坐标）；曲面不闭合时，先补一块面凑成闭曲面。"
    }
   ]
  },
  {
   "t": "p",
   "html": "这里 $\\oiint$ 表示「沿闭曲面一圈积分」，$dV$ 是体积元，$D$ 是 $S$ 围成的立体。<b>必须用外法向</b>——这是定理的一部分，不是可选项。若取内法向，整个右边要加负号。<br>一个直接推论：如果整个区域内 $\\nabla\\cdot\\mathbf F\\equiv0$（处处不可压缩），那么穿过这个区域边界的净通量就是 0。水从一边流进去，必然从另一边流出来，总量抵消。<br>还有第二个恒等式：<b>旋度场的散度恒为零</b>，$\\nabla\\cdot(\\nabla\\times\\mathbf F)=0$。直觉是：旋度场描述的是一圈一圈的流动，它不会有「源」——任何闭合的小圈里，水绕一圈又回来了，净流出为 0。<br>这个恒等式常用来做「否定判断」：如果某个场在某个闭曲面上的通量不为 0，那么它<strong>不可能</strong>是任何场的旋度。"
  },
  {
   "t": "tex",
   "tex": "\\nabla\\cdot(\\nabla\\times\\mathbf F)=0\\qquad(\\text{旋度场无散}),\\qquad \\nabla\\times(\\nabla f)=\\mathbf 0\\qquad(\\text{梯度场无旋})"
  },
  {
   "t": "p",
   "html": "这两个恒等式在物理里到处出现，举两个最经典的例子。<br><b>Gauss 定律</b>：点电荷 $q$ 的电场 $\\mathbf E=\\dfrac{q}{4\\pi\\varepsilon_0}\\dfrac{\\mathbf r}{r^3}$。除了原点，处处散度为 0；但若把原点包含在闭曲面里，通量却是 $q/\\varepsilon_0$。这说明「源」集中在原点上。<br><b>流体连续性方程</b>：设 $\\mathbf F=\\delta\\mathbf v$（密度乘速度），质量守恒写成 $\\nabla\\cdot\\mathbf F+\\dfrac{\\partial\\delta}{\\partial t}=0$。散度定理就是「流入流出的差 = 内部质量的变化」这条常识的微分版。<br>最后把所有定理收进一句话。用 $\\nabla$ 记号写，Green、Stokes、散度定理其实是同一副面孔：<b>把一个微分算子作用在场上的结果在区域里积分，就等于场在边界上与这个算子「相配」的分量之和</b>。$\\nabla\\times$ 配<strong>切向</strong>分量（Green 环量形式、Stokes），$\\nabla\\cdot$ 配<strong>法向</strong>分量（Green 通量形式、散度定理）。一维的祖师爷就是 $\\int_a^b f'(x)\\,dx=f(b)-f(a)$：左边是「导数在区间上的积分」，右边是「函数在边界（两个端点）上的差」。"
  },
  {
   "t": "tex",
   "tex": "\\text{Green（切向）}\\ \\oint_C\\mathbf F\\cdot\\mathbf T\\,ds=\\iint_R(\\nabla\\times\\mathbf F)\\cdot\\mathbf k\\,dA\\ \\ \\Longrightarrow\\ \\ \\text{Stokes}\\ \\oint_C\\mathbf F\\cdot d\\mathbf r=\\iint_S(\\nabla\\times\\mathbf F)\\cdot\\mathbf n\\,d\\sigma"
  },
  {
   "t": "lab",
   "id": "fluxdiv"
  },
  {
   "t": "quiz",
   "qid": "ch15-q10"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "三大定理对照表",
   "id": "ch15-s11"
  },
  {
   "t": "table",
   "head": [
    "定理",
    "区域",
    "边界",
    "方向怎么定",
    "什么时候用"
   ],
   "rows": [
    [
     "<b>Green 环量形式</b>",
     "平面区域 $R$",
     "平面简单闭曲线 $C$",
     "逆时针（区域在左手边）",
     "闭曲线上的 $\\oint M\\,dx+N\\,dy$ 难算时，改成区域上的二重积分"
    ],
    [
     "<b>Green 通量形式</b>",
     "平面区域 $R$",
     "平面简单闭曲线 $C$",
     "逆时针 + 外法向",
     "算平面通量；挖洞处理奇点；推面积公式"
    ],
    [
     "<b>Stokes</b>",
     "空间中的有向曲面 $S$",
     "空间闭曲线 $C=\\partial S$",
     "$\\mathbf n$ 与 $C$ 满足右手法则",
     "空间环量 $\\oint\\mathbf F\\cdot d\\mathbf r$；曲面复杂时换同边界的简单曲面"
    ],
    [
     "<b>散度定理</b>",
     "空间立体 $D$",
     "闭曲面 $S=\\partial D$",
     "$\\mathbf n$ 必须是外法向",
     "闭曲面上的通量；面太多或参数化麻烦；补面后用"
    ]
   ]
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "例题：跟着做一遍",
   "id": "ch15-s12"
  },
  {
   "t": "example",
   "no": "1",
   "tag": "标量线积分：螺旋线上的 $\\int_C f\\,ds$",
   "fields": [
    {
     "k": "题目",
     "html": "求 $\\displaystyle\\int_C\\bigl(2xy+\\sqrt z\\bigr)\\,ds$，其中 $C$ 是螺旋线 $\\mathbf r(t)=\\cos t\\,\\mathbf i+\\sin t\\,\\mathbf j+t\\,\\mathbf k$，$0\\le t\\le\\pi$。"
    },
    {
     "k": "想一想",
     "html": "被积函数里有 $x,y,z$，曲线是参数式给的。第一件事一定是求 $|\\mathbf r'(t)|$，把 $ds$ 换成 $t$ 的语言；再把 $x,y,z$ 全部用 $t$ 表示。螺旋线上一圈走多远、$z$ 和 $t$ 什么关系，是这道题的关键。"
    },
    {
     "k": "解答",
     "html": "<p>先求速度与弧长元：$\\mathbf v=\\mathbf r'(t)=-\\sin t\\,\\mathbf i+\\cos t\\,\\mathbf j+\\mathbf k$，</p><p>$$|\\mathbf v|=\\sqrt{\\sin^2t+\\cos^2t+1}=\\sqrt2 .$$</p><p>它恒不为 0，说明曲线光滑，可以直接套公式。沿曲线 $x=\\cos t,\\ y=\\sin t,\\ z=t$，所以</p><p>$$f(\\mathbf r(t))=2\\cos t\\sin t+\\sqrt t=\\sin 2t+\\sqrt t .$$</p><p>代进线积分公式（注意乘 $|\\mathbf v|=\\sqrt2$）：</p><p>$$\\int_C f\\,ds=\\int_0^{\\pi}\\bigl(\\sin2t+t^{1/2}\\bigr)\\sqrt2\\,dt=\\sqrt2\\Bigl[-\\frac{\\cos 2t}{2}+\\frac23t^{3/2}\\Bigr]_0^{\\pi}.$$</p><p>先代 $\\pi$：$-\\frac{\\cos2\\pi}{2}+\\frac23\\pi^{3/2}=-\\frac12+\\frac23\\pi^{3/2}$；再代 $0$：$-\\frac12+0$。相减得 $\\frac23\\pi^{3/2}$，乘上 $\\sqrt2$：</p><p>$$\\boxed{\\ \\int_C f\\,ds=\\frac{2\\sqrt2}{3}\\pi^{3/2}\\approx5.25\\ }$$</p>"
    },
    {
     "k": "点评",
     "html": "$ds$ 一定要乘 $|\\mathbf v|=\\sqrt2$，这是本题唯一的「坑」。如果题目改成 $\\int_C f\\,dx$，就要用 $dx=-\\sin t\\,dt$，结果会与方向有关——两种积分不要混。另外 $\\sqrt z=\\sqrt t$ 在 $[0,\\pi]$ 上没有绝对值问题，可以直接写。"
    }
   ]
  },
  {
   "t": "example",
   "no": "2",
   "tag": "向量场做功：分段路径与路径相关性",
   "fields": [
    {
     "k": "题目",
     "html": "设 $\\mathbf F=(x+y)\\,\\mathbf i+(y-x)\\,\\mathbf j$。(a) 求 $\\mathbf F$ 沿折线 $C_1\\cup C_2$ 做的功，其中 $C_1$ 从 $(0,0)$ 到 $(1,0)$、$C_2$ 从 $(1,0)$ 到 $(1,1)$；(b) 求沿直线段 $(0,0)\\to(1,1)$ 做的功；(c) 判断 $\\mathbf F$ 是否保守。"
    },
    {
     "k": "想一想",
     "html": "折线要分段参数化，每一段上把 $x,y$ 代成具体的数或 $t$；两条路径算出来的功不一样，就说明积分依赖路径。判断保守则不必再算积分，直接查偏导。"
    },
    {
     "k": "解答",
     "html": "<p>(a) 在 $C_1$ 上 $y=0$、$x=t$（$0\\le t\\le1$），于是 $\\mathbf F=t\\,\\mathbf i-t\\,\\mathbf j$，$d\\mathbf r=\\mathbf i\\,dt$：</p><p>$$W_1=\\int_0^1 t\\,dt=\\frac12 .$$</p><p>在 $C_2$ 上 $x=1$、$y=t$，于是 $\\mathbf F=(1+t)\\,\\mathbf i+(t-1)\\,\\mathbf j$，$d\\mathbf r=\\mathbf j\\,dt$：</p><p>$$W_2=\\int_0^1(t-1)\\,dt=\\Bigl[\\frac{t^2}{2}-t\\Bigr]_0^1=-\\frac12 .$$</p><p>两段相加：$W=W_1+W_2=0$。</p><p>(b) 直线段 $\\mathbf r=t\\,\\mathbf i+t\\,\\mathbf j$：$x=y=t$，$\\mathbf F=2t\\,\\mathbf i+0\\,\\mathbf j$，$d\\mathbf r=(\\mathbf i+\\mathbf j)\\,dt$：</p><p>$$W'=\\int_0^1 2t\\,dt=1 .$$</p><p>(c) $M=x+y,\\ N=y-x$，所以 $\\partial N/\\partial x=-1$、$\\partial M/\\partial y=1$，两者不相等，因此 $\\mathbf F$ <b>不保守</b>。这与 (a)(b) 的结果互相印证：两条路径的功确实不同。"
    },
    {
     "k": "点评",
     "html": "分段路径的每一段都要单独把 $x,y$ 代成常数或 $t$。例如 $C_2$ 上 $x\\equiv1$，所以 $dx=0$，只有 $dy$ 那一项留下——漏掉这一点就会把两段混在一起算。判断保守性时，<b>只要有一对偏导不相等就可以否定</b>，不用再算线积分。"
    }
   ]
  },
  {
   "t": "example",
   "no": "3",
   "tag": "验证保守场、求势函数、用端点算线积分",
   "fields": [
    {
     "k": "题目",
     "html": "证明 $\\mathbf F=(e^x\\cos y+yz)\\,\\mathbf i+(xz-e^x\\sin y)\\,\\mathbf j+(xy+z)\\,\\mathbf k$ 在其自然定义域上保守，求势函数，并计算从 $A(0,0,0)$ 到 $B(1,\\pi/2,2)$ 的 $\\int_C\\mathbf F\\cdot d\\mathbf r$。"
    },
    {
     "k": "想一想",
     "html": "自然定义域是整个空间，开且单连通，可以放心用判据。判据通过后，求势函数就是解三个偏导方程：先积 $x$，把「常数」写成 $g(y,z)$，再逐层定出来。最后用 $f(B)-f(A)$，不需要参数化曲线。"
    },
    {
     "k": "解答",
     "html": "<p>先算三对偏导：</p><p>$$\\frac{\\partial P}{\\partial y}=x=\\frac{\\partial N}{\\partial z},\\qquad \\frac{\\partial M}{\\partial z}=y=\\frac{\\partial P}{\\partial x},\\qquad \\frac{\\partial N}{\\partial x}=z-e^x\\sin y=\\frac{\\partial M}{\\partial y}.$$</p><p>三对都相等，且定义域是单连通的，所以 $\\mathbf F$ 保守。求势函数，从 $f_x=M$ 开始：</p><p>$$f=\\int(e^x\\cos y+yz)\\,dx=e^x\\cos y+xyz+g(y,z).$$</p><p>这里的「常数」是 $g(y,z)$——因为对 $x$ 积分时 $y,z$ 都当作常数。接着对 $y$ 求偏导，和 $N$ 比较：</p><p>$$-e^x\\sin y+xz+\\frac{\\partial g}{\\partial y}=xz-e^x\\sin y\\ \\Longrightarrow\\ \\frac{\\partial g}{\\partial y}=0,$$</p><p>所以 $g$ 只与 $z$ 有关，记作 $h(z)$，此时 $f=e^x\\cos y+xyz+h(z)$。再对 $z$ 求偏导，和 $P$ 比较：</p><p>$$xy+h'(z)=xy+z\\ \\Longrightarrow\\ h(z)=\\frac{z^2}{2}+C .$$</p><p>得到势函数 $f(x,y,z)=e^x\\cos y+xyz+\\frac{z^2}{2}+C$。最后用端点作差：$f(A)=1$，$f(B)=e\\cdot0+1\\cdot\\frac{\\pi}{2}\\cdot2+\\frac{4}{2}=\\pi+2$，所以</p><p>$$\\int_C\\mathbf F\\cdot d\\mathbf r=f(B)-f(A)=(\\pi+2)-1=\\pi+1 .$$</p>"
    },
    {
     "k": "点评",
     "html": "第一次积分后的「常数」必须是 $g(y,z)$，不能一上来写 $+C$——否则后面 $xyz$ 和 $z^2/2$ 两项都会被丢掉。势函数不唯一（可以差一个常数），但 $f(B)-f(A)$ 唯一，所以最后算差时常数自动消掉。"
    }
   ]
  },
  {
   "t": "example",
   "no": "4",
   "tag": "Green 定理：环量计算与「挖洞」",
   "fields": [
    {
     "k": "题目",
     "html": "(a) 计算 $\\displaystyle\\oint_C xy\\,dy-y^2\\,dx$，其中 $C$ 是 $y=x^2$ 与 $y=x$ 在第一象限所围区域的正向边界；(b) 计算 $\\displaystyle\\oint_C\\frac{-y\\,dx+x\\,dy}{x^2+y^2}$，其中 $C$ 是任一不经过原点的逆时针简单闭曲线。"
    },
    {
     "k": "想一想",
     "html": "(a) 边界由两段曲线拼成，逐段算会很繁；被积函数只有一个二重积分能轻松算，明显是 Green 的活。先认清 $M,N$，注意 $M=-y^2$ 而不是 $-y$。<br>(b) 这个场在原点没有定义，必须分「$C$ 围不围住原点」两种情况；围住时用挖洞法，把问题转移到半径 $\\varepsilon$ 的小圆上。"
    },
    {
     "k": "解答",
     "html": "<p>(a) 取 $M=-y^2,\\ N=xy$，则</p><p>$$\\frac{\\partial N}{\\partial x}-\\frac{\\partial M}{\\partial y}=y-(-2y)=3y .$$</p><p>区域 $R$：$0\\le x\\le1$，$x^2\\le y\\le x$。用 Green 定理把线积分换成二重积分：</p><p>$$\\oint_C xy\\,dy-y^2\\,dx=\\iint_R3y\\,dA=\\int_0^1\\!\\!\\int_{x^2}^{x}3y\\,dy\\,dx=\\frac32\\int_0^1(x^2-x^4)\\,dx=\\frac32\\Bigl(\\frac13-\\frac15\\Bigr)=\\frac15 .$$</p><p>(b) 记 $\\mathbf F=\\dfrac{-y\\,\\mathbf i+x\\,\\mathbf j}{x^2+y^2}$。在去掉原点的区域上，</p><p>$$\\frac{\\partial N}{\\partial x}=\\frac{y^2-x^2}{(x^2+y^2)^2}=\\frac{\\partial M}{\\partial y},$$</p><p>所以只要区域里没有原点，散度（这里是环量密度）就是 0。</p><p><b>情形一：$C$ 不围住原点。</b> $C$ 内部的点全都有定义，Green 定理直接给出 $\\oint_C=0$。</p><p><b>情形二：$C$ 围住原点。</b> 在原点周围挖去半径 $\\varepsilon$ 的小圆 $C_\\varepsilon$，得到一个环域。环域的外边界是 $C$（逆时针），内边界是 $C_\\varepsilon$（顺时针）。Green 定理成立，而二重积分为 0，于是</p><p>$$\\oint_C-\\oint_{C_\\varepsilon(\\text{逆时针})}=0\\ \\Longrightarrow\\ \\oint_C=\\oint_{C_\\varepsilon}.$$</p><p>在小圆上取 $x=\\varepsilon\\cos t,\\ y=\\varepsilon\\sin t$，则 $dx=-\\varepsilon\\sin t\\,dt$，$dy=\\varepsilon\\cos t\\,dt$，</p><p>$$\\frac{-y\\,dx+x\\,dy}{x^2+y^2}=\\frac{\\varepsilon^2\\sin^2t+\\varepsilon^2\\cos^2t}{\\varepsilon^2}\\,dt=dt .$$</p><p>所以</p><p>$$\\boxed{\\ \\oint_C\\frac{-y\\,dx+x\\,dy}{x^2+y^2}=2\\pi\\ }\\qquad(\\text{绕原点时；不绕时为 }0)$$</p>"
    },
    {
     "k": "点评",
     "html": "挖洞法的关键是<b>内边界的定向</b>：为了让区域始终在左手边，内圆必须顺时针。漏掉这个负号，结论就反了。另一种理解方式：$C$ 和同向的小圆之间的环域里「旋转」处处为 0，所以沿 $C$ 的积分等于沿小圆的积分——把难算的 $C$ 换成好算的小圆，这也是 Stokes 的「换曲面」思想在平面上的版本。"
    }
   ]
  },
  {
   "t": "example",
   "no": "5",
   "tag": "用参数化求曲面面积：圆锥与球面",
   "fields": [
    {
     "k": "题目",
     "html": "(a) 求锥面 $z=\\sqrt{x^2+y^2}$ 在 $0\\le z\\le1$ 部分的面积；(b) 求半径 $a$ 的球面面积。"
    },
    {
     "k": "想一想",
     "html": "两题都用参数式最省事：锥面用「半径 + 角度」参数化，球面用「经度 + 纬度」。公式是 $A=\\iint_R|\\mathbf r_u\\times\\mathbf r_v|\\,du\\,dv$，先老老实实算叉乘，再取模。"
    },
    {
     "k": "解答",
     "html": "<p>(a) 取 $\\mathbf r(r,\\theta)=r\\cos\\theta\\,\\mathbf i+r\\sin\\theta\\,\\mathbf j+r\\,\\mathbf k$，$0\\le r\\le1$，$0\\le\\theta\\le2\\pi$。两个切向量是</p><p>$$\\mathbf r_r=\\cos\\theta\\,\\mathbf i+\\sin\\theta\\,\\mathbf j+\\mathbf k,\\qquad \\mathbf r_\\theta=-r\\sin\\theta\\,\\mathbf i+r\\cos\\theta\\,\\mathbf j .$$</p><p>叉乘：</p><p>$$\\mathbf r_r\\times\\mathbf r_\\theta=\\begin{vmatrix}\\mathbf i&\\mathbf j&\\mathbf k\\\\ \\cos\\theta&\\sin\\theta&1\\\\ -r\\sin\\theta&r\\cos\\theta&0\\end{vmatrix}=-r\\cos\\theta\\,\\mathbf i-r\\sin\\theta\\,\\mathbf j+r\\,\\mathbf k,$$</p><p>取模 $|\\mathbf r_r\\times\\mathbf r_\\theta|=\\sqrt{r^2+r^2}=\\sqrt2\\,r$。于是</p><p>$$A=\\int_0^{2\\pi}\\!\\!\\int_0^1\\sqrt2\\,r\\,dr\\,d\\theta=\\sqrt2\\cdot\\frac12\\cdot2\\pi=\\sqrt2\\,\\pi .$$</p><p>(b) 取 $\\mathbf r(\\phi,\\theta)=a\\sin\\phi\\cos\\theta\\,\\mathbf i+a\\sin\\phi\\sin\\theta\\,\\mathbf j+a\\cos\\phi\\,\\mathbf k$，$0\\le\\phi\\le\\pi$，$0\\le\\theta\\le2\\pi$。计算可得</p><p>$$|\\mathbf r_\\phi\\times\\mathbf r_\\theta|=a^2\\sin\\phi\\ \\Longrightarrow\\ A=\\int_0^{2\\pi}\\!\\!\\int_0^{\\pi}a^2\\sin\\phi\\,d\\phi\\,d\\theta=a^2\\cdot2\\cdot2\\pi=4\\pi a^2 .$$</p>"
    },
    {
     "k": "点评",
     "html": "$|\\mathbf r_\\phi\\times\\mathbf r_\\theta|=a^2\\sin\\phi$ 里的 $\\sin\\phi$ 在 $[0,\\pi]$ 上非负，可以直接去绝对值；如果参数范围越界，就要小心符号。球面被竖直柱面截下这类「一个投影对应两片曲面」的情形，必须拆成上下两片分别积分再相加，否则会算重。"
    }
   ]
  },
  {
   "t": "example",
   "no": "6",
   "tag": "曲面积分求通量：显式曲面与隐式曲面",
   "fields": [
    {
     "k": "题目",
     "html": "(a) 求 $\\mathbf F=z\\,\\mathbf k$ 向上穿过抛物面 $z=x^2+y^2$（$0\\le z\\le1$）的通量；(b) 求 $\\mathbf F=yz\\,\\mathbf j+z^2\\,\\mathbf k$ 向外穿过曲面 $S$ 的通量，$S$ 是由柱面 $y^2+z^2=1$（$z\\ge0$）与平面 $x=0$、$x=1$ 截出的部分。"
    },
    {
     "k": "想一想",
     "html": "(a) 曲面写成 $z=f(x,y)$，法向朝上，直接用 $\\mathbf n\\,d\\sigma=(-f_x,-f_y,1)\\,dx\\,dy$，被积函数会变简单。<br>(b) 曲面是柱面的一段，写成隐式 $g=y^2+z^2=1$ 最方便；外法向朝外，投影到 $xy$ 平面。注意分母里的绝对值。"
    },
    {
     "k": "解答",
     "html": "<p>(a) $f=x^2+y^2$，$f_x=2x$，$f_y=2y$。朝上的面积元向量是</p><p>$$\\mathbf n\\,d\\sigma=(-2x\\,\\mathbf i-2y\\,\\mathbf j+\\mathbf k)\\,dx\\,dy .$$</p><p>在曲面上 $\\mathbf F=z\\,\\mathbf k=(x^2+y^2)\\,\\mathbf k$，所以 $\\mathbf F\\cdot\\mathbf n\\,d\\sigma=(x^2+y^2)\\,dx\\,dy$：</p><p>$$\\text{Flux}=\\iint_{x^2+y^2\\le1}(x^2+y^2)\\,dA=\\int_0^{2\\pi}\\!\\!\\int_0^1 r^2\\cdot r\\,dr\\,d\\theta=2\\pi\\cdot\\frac14=\\frac{\\pi}{2}.$$</p><p>(b) 取 $g=y^2+z^2$，$\\nabla g=2y\\,\\mathbf j+2z\\,\\mathbf k$，$|\\nabla g|=2\\sqrt{y^2+z^2}=2$（在柱面上）。投影方向 $\\mathbf p=\\mathbf k$，$|\\nabla g\\cdot\\mathbf k|=2z$（$z\\ge0$），于是 $d\\sigma=\\dfrac{dA}{z}$，外法向 $\\mathbf n=\\dfrac{\\nabla g}{|\\nabla g|}=y\\,\\mathbf j+z\\,\\mathbf k$。</p><p>$$\\mathbf F\\cdot\\mathbf n=(yz\\,\\mathbf j+z^2\\mathbf k)\\cdot(y\\,\\mathbf j+z\\,\\mathbf k)=y^2z+z^3=z(y^2+z^2)=z .$$</p><p>投影区域是矩形 $0\\le x\\le1$，$-1\\le y\\le1$，面积 2。于是</p><p>$$\\text{Flux}=\\iint_S\\mathbf F\\cdot\\mathbf n\\,d\\sigma=\\iint_{R_{xy}}z\\cdot\\frac{dA}{z}=\\iint_{R_{xy}}dA=2 .$$</p>"
    },
    {
     "k": "点评",
     "html": "显式公式的三项是 $(-Mf_x-Nf_y+P)$，漏掉负号会得到相反答案。隐式公式的分母是 $|\\nabla g\\cdot\\mathbf p|$，绝对值不能丢；而 $\\mathbf n$ 取 $+\\nabla g$ 还是 $-\\nabla g$，要与题目要求的穿出方向一致。如果曲面恰好是某个立体的边界，改用散度定理通常更快（见例 8）。"
    }
   ]
  },
  {
   "t": "example",
   "no": "7",
   "tag": "用 Stokes 定理算空间环量",
   "fields": [
    {
     "k": "题目",
     "html": "计算 $\\displaystyle\\oint_C\\mathbf F\\cdot d\\mathbf r$，其中 $\\mathbf F=xz\\,\\mathbf i+xy\\,\\mathbf j+3xz\\,\\mathbf k$，$C$ 是平面 $2x+y+z=2$ 在第一卦限所截部分的正向边界（从上往下看为逆时针）。"
    },
    {
     "k": "想一想",
     "html": "$C$ 是三条空间线段的拼接，直接参数化逐段算很痛苦。它是平面片 $S$ 的边界，正好用 Stokes：先算旋度，再找一个与 $C$ 相容的法向，最后把曲面积分化成投影区域上的二重积分。"
    },
    {
     "k": "解答",
     "html": "<p>先算旋度：</p><p>$$\\nabla\\times\\mathbf F=\\begin{vmatrix}\\mathbf i&\\mathbf j&\\mathbf k\\\\ \\partial_x&\\partial_y&\\partial_z\\\\ xz&xy&3xz\\end{vmatrix}=(0-0)\\,\\mathbf i-(3z-x)\\,\\mathbf j+(y-0)\\,\\mathbf k=(x-3z)\\,\\mathbf j+y\\,\\mathbf k .$$</p><p>平面 $2x+y+z=2$ 是 $f=2x+y+z$ 的等值面，$\\nabla f=2\\mathbf i+\\mathbf j+\\mathbf k$。因为要求「从上往下看逆时针」，法向的 $\\mathbf k$ 分量应为正，取</p><p>$$\\mathbf n=\\frac{2\\mathbf i+\\mathbf j+\\mathbf k}{\\sqrt6},\\qquad d\\sigma=\\frac{|\\nabla f|}{|\\nabla f\\cdot\\mathbf k|}dA=\\sqrt6\\,dx\\,dy .$$</p><p>曲面上的 $z=2-2x-y$，所以旋度变成</p><p>$$\\nabla\\times\\mathbf F=(x-3(2-2x-y))\\,\\mathbf j+y\\,\\mathbf k=(7x+3y-6)\\,\\mathbf j+y\\,\\mathbf k .$$</p><p>与法向点乘，$\\sqrt6$ 恰好和 $d\\sigma$ 里的 $\\sqrt6$ 抵消：</p><p>$$(\\nabla\\times\\mathbf F)\\cdot\\mathbf n\\,d\\sigma=\\frac{(7x+3y-6)+y}{\\sqrt6}\\cdot\\sqrt6\\,dx\\,dy=(7x+4y-6)\\,dx\\,dy .$$</p><p>投影区域 $R$：$0\\le x\\le1$，$0\\le y\\le2-2x$。于是</p><p>$$\\oint_C\\mathbf F\\cdot d\\mathbf r=\\int_0^1\\!\\!\\int_0^{2-2x}(7x+4y-6)\\,dy\\,dx=\\int_0^1(-6x^2+10x-4)\\,dx=-2+5-4=-1 .$$</p>"
    },
    {
     "k": "点评",
     "html": "三个易错处：① 行列式展开时 $\\mathbf j$ 项带负号；② 法向必须与 $C$ 的逆时针方向满足右手法则，否则整体差一个负号；③ 等值面参数化时 $d\\sigma$ 的 $\\sqrt6$ 与点乘的 $1/\\sqrt6$ 会约掉，别因为「怎么多出个根号」而改公式。<br>如果曲面形状复杂，可以换成以 $C$ 为边界的平面圆盘来算——这就是「换曲面」的威力。"
    }
   ]
  },
  {
   "t": "example",
   "no": "8",
   "tag": "用散度定理算闭曲面通量",
   "fields": [
    {
     "k": "题目",
     "html": "(a) 求 $\\mathbf F=x^3\\,\\mathbf i+y^3\\,\\mathbf j+z^3\\,\\mathbf k$ 穿出球面 $x^2+y^2+z^2=a^2$ 的通量；(b) 求 $\\mathbf F=x\\,\\mathbf i+y\\,\\mathbf j+z^2\\,\\mathbf k$ 穿出圆柱体 $D$：$x^2+y^2\\le4$，$0\\le z\\le1$ 的边界曲面的通量。"
    },
    {
     "k": "想一想",
     "html": "两个曲面都是闭合的，而且曲面上直接算通量要点很多面（圆柱有侧面 + 上下底）。散度定理把它们变成一次三重积分，散度还算得很简单——这就是它的用武之地。"
    },
    {
     "k": "解答",
     "html": "<p>(a) $\\nabla\\cdot\\mathbf F=3x^2+3y^2+3z^2=3r^2$。用球坐标：</p><p>$$\\oiint_S\\mathbf F\\cdot\\mathbf n\\,d\\sigma=\\iiint_D3r^2\\,dV=\\int_0^{2\\pi}\\!\\!\\int_0^{\\pi}\\!\\!\\int_0^{a}3r^2\\cdot r^2\\sin\\phi\\,dr\\,d\\phi\\,d\\theta=3\\cdot4\\pi\\cdot\\frac{a^5}{5}=\\frac{12}{5}\\pi a^5 .$$</p><p>(b) $\\nabla\\cdot\\mathbf F=1+1+2z=2+2z$。柱体截面面积是 $4\\pi$，所以</p><p>$$\\oiint_S\\mathbf F\\cdot\\mathbf n\\,d\\sigma=\\iiint_D(2+2z)\\,dV=\\int_0^1(2+2z)\\cdot4\\pi\\,dz=4\\pi\\Bigl[2z+z^2\\Bigr]_0^1=12\\pi .$$</p>"
    },
    {
     "k": "点评",
     "html": "可以拿 (b) 逐面验算：侧面 $x^2+y^2=4$ 上外法向 $\\mathbf n=\\frac12(x\\,\\mathbf i+y\\,\\mathbf j)$，$\\mathbf F\\cdot\\mathbf n=\\frac{x^2+y^2}{2}=2$，面积 $2\\pi\\cdot2\\cdot1=4\\pi$，贡献 $8\\pi$；顶面 $z=1$ 上 $\\mathbf F\\cdot\\mathbf k=1$，面积 $4\\pi$，贡献 $4\\pi$；底面 $z=0$ 上 $\\mathbf F\\cdot(-\\mathbf k)=0$。合计 $12\\pi$，与三重积分一致。<br>用之前先检查三条：曲面闭合吗？方向是外法向吗？场在内部处处有定义吗？若场在某点无定义（比如 $\\mathbf r/r^3$ 在原点），要把该点挖掉，结论会变成「通量与曲面半径无关」。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "这些地方最容易错",
   "id": "ch15-s13"
  },
  {
   "t": "list",
   "items": [
    "<b>把 $ds$ 当成 $dt$。</b>错在少乘了 $|\\mathbf v|$。$ds$ 是弧长、$dt$ 是参数步长，两者差一个速度大小；圆、螺旋线上 $|\\mathbf v|$ 是常数，漏掉了不容易发现。每次写 $ds$ 都要先算 $|\\mathbf r'(t)|$。",
    "<b>搞混「与方向有关」和「与方向无关」。</b>$\\int_C f\\,ds$ 与方向无关；$\\int_C f\\,dx$、$\\oint\\mathbf F\\cdot d\\mathbf r$ 反向会变号。答完题回头看一眼「题目要求的行走方向」，符号错往往就出在这里。",
    "<b>把环量和通量混在一起。</b>环量用切向分量 $\\mathbf F\\cdot\\mathbf T$，通量用法向分量 $\\mathbf F\\cdot\\mathbf n$。看到「绕一圈转了多少」用环量，看到「穿过去多少」用通量。",
    "<b>用组件测试却不说「单连通」。</b>「三对偏导相等 $\\Rightarrow$ 保守」需要定义域开且单连通。$\\frac{-y\\mathbf i+x\\mathbf j}{x^2+y^2}$ 就是反例：判据满足，但绕原点环量是 $2\\pi$。写解答时先声明定义域，再写判据。",
    "<b>求势函数时只写 $+C$。</b>第一次对 $x$ 积分后的「常数」是 $g(y,z)$，之后要靠对 $y$、对 $z$ 的偏导把它逐层定出来。一上来写 $+C$ 会丢掉与 $y,z$ 有关的项。",
    "<b>Green 定理的方向和挖洞。</b>正向是逆时针（区域在左手边）；多连通区域必须挖洞，且内边界要顺时针。漏了内边界的负号，答案会整题反号。",
    "<b>面积元漏项。</b>显式公式 $\\sqrt{f_x^2+f_y^2+1}$ 里的「$+1$」不能丢；隐式公式的分母要带绝对值；参数式要先把叉乘算对再取模。三种公式用错对象也很常见——题目给的是哪种形式，就用哪种。",
    "<b>Stokes 的法向选反。</b>法向与边界方向必须满足右手法则。曲面换成「同边界的简单曲面」时，法向也要跟着换，否则结论差一个负号。",
    "<b>散度定理用在非闭曲面上。</b>定理要求闭曲面。曲面不闭合时要补面：$\\iint_S=\\oiint_{S\\cup S_{\\text{补}}}-\\iint_{S_{\\text{补}}}$，补面的通量常常是 0 或很好算。另外别忘了法向必须是外法向。",
    "<b>三个恒等式记反。</b>「梯度场无旋」$\\nabla\\times\\nabla f=0$、「旋度场无散」$\\nabla\\cdot(\\nabla\\times\\mathbf F)=0$。前者说明保守场的环量为 0，后者说明旋度场的通量为 0，用反证时别用错方向。",
    "<b>把「恰当微分」当成一个新东西。</b>$M\\,dx+N\\,dy+P\\,dz$ 恰当，就是 $\\mathbf F$ 保守、有势函数。判据、求法、用法完全一样，只是换了个写法。"
   ],
   "ordered": false
  },
  {
   "t": "callout",
   "kind": "warn",
   "title": "最容易混的一处：$ds$ 与方向",
   "html": "两道题最容易混：$\\int_C f\\,ds$ 里 $ds=|\\mathbf v|dt$，与方向无关；$\\int_C\\mathbf F\\cdot d\\mathbf r$ 里 $d\\mathbf r=\\mathbf r'(t)dt$，反向走结果变号。看到积分号旁边是 $ds$ 还是 $d\\mathbf r$，就决定了要不要乘 $|\\mathbf v|$、要不要管方向。"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "这一章要记住的",
   "id": "ch15-s14"
  },
  {
   "t": "formula",
   "items": [
    {
     "name": "标量线积分",
     "tex": "\\int_C f\\,ds=\\int_a^b f(\\mathbf r(t))\\,|\\mathbf r'(t)|\\,dt"
    },
    {
     "name": "向量线积分（功 / 环量）",
     "tex": "\\int_C\\mathbf F\\cdot d\\mathbf r=\\int_a^b\\mathbf F(\\mathbf r(t))\\cdot\\mathbf r'(t)\\,dt"
    },
    {
     "name": "线积分基本定理",
     "tex": "\\int_C\\nabla f\\cdot d\\mathbf r=f(B)-f(A)"
    },
    {
     "name": "保守场判据（单连通）",
     "tex": "P_y=N_z,\\quad M_z=P_x,\\quad N_x=M_y\\ \\Longleftrightarrow\\ \\mathbf F=\\nabla f"
    },
    {
     "name": "Green 环量形式",
     "tex": "\\oint_C M\\,dx+N\\,dy=\\iint_R(N_x-M_y)\\,dA"
    },
    {
     "name": "Green 通量形式",
     "tex": "\\oint_C M\\,dy-N\\,dx=\\iint_R(M_x+N_y)\\,dA"
    },
    {
     "name": "Green 面积公式",
     "tex": "A=\\frac12\\oint_C(x\\,dy-y\\,dx)"
    },
    {
     "name": "曲面面积元",
     "tex": "d\\sigma=|\\mathbf r_u\\times\\mathbf r_v|\\,du\\,dv"
    },
    {
     "name": "曲面面积（显式）",
     "tex": "A=\\iint_R\\sqrt{f_x^2+f_y^2+1}\\,dx\\,dy"
    },
    {
     "name": "通量（参数式）",
     "tex": "\\iint_S\\mathbf F\\cdot\\mathbf n\\,d\\sigma=\\iint_R\\mathbf F\\cdot(\\mathbf r_u\\times\\mathbf r_v)\\,du\\,dv"
    },
    {
     "name": "通量（显式，向上）",
     "tex": "\\text{Flux}=\\iint_R(-Mf_x-Nf_y+P)\\,dx\\,dy"
    },
    {
     "name": "Stokes 定理",
     "tex": "\\oint_C\\mathbf F\\cdot d\\mathbf r=\\iint_S(\\nabla\\times\\mathbf F)\\cdot\\mathbf n\\,d\\sigma"
    },
    {
     "name": "散度定理",
     "tex": "\\oiint_S\\mathbf F\\cdot\\mathbf n\\,d\\sigma=\\iiint_D\\nabla\\cdot\\mathbf F\\,dV"
    },
    {
     "name": "两个恒等式",
     "tex": "\\nabla\\times\\nabla f=\\mathbf 0,\\qquad \\nabla\\cdot(\\nabla\\times\\mathbf F)=0"
    }
   ]
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "如果只记三件事",
     "html": "① 线积分算「沿路」，曲面积分算「穿面」；② 保守场只认端点，判据要单连通；③ 三个大定理都是「边界积分 = 内部导数的积分」。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "接下来学什么",
   "id": "ch15-s15"
  },
  {
   "t": "p",
   "html": "这一章的三个定理，把第 5 章的微积分基本定理一路搬到了曲线、曲面和空间上。它们不是三套新东西，而是同一句话在不同维度下的样子：$\\int_a^b f'\\,dx=f(b)-f(a)$ 是最简单的版本，Green 是平面版，Stokes 是曲面版，散度定理是立体版。<br>下一章要学的<strong>一阶微分方程</strong>，会和这一章的「恰当微分」直接接上：$M\\,dx+N\\,dy=0$ 如果可以写成 $df=0$，解就是 $f=$ 常数——正是本章的保守场与势函数。再往后（二阶方程、物理课程），$\\nabla\\cdot$、$\\nabla\\times$ 这两个算子会以「Maxwell 方程组」「流体力学」的形式反复出现。可以说，这一章是整本书通往物理与后续数学课程的门口。"
  },
  {
   "t": "checklist",
   "id": "ch15",
   "items": [
    "我能说清 $\\int_C f\\,ds$ 与 $\\int_C f\\,dx$ 的本质区别，以及它们对方向敏不敏感。",
    "我能解释 $\\mathbf F\\cdot\\mathbf T$ 与 $\\mathbf F\\cdot\\mathbf n$ 分别在量什么，并分清环量与通量。",
    "我能判断一个场是否保守，并说清为什么判据要求定义域单连通；能举出「判据满足但不保守」的反例。",
    "我能由保守场求出势函数，并用 $f(B)-f(A)$ 算线积分。",
    "我能写出 Green 定理的两种形式，并解释「正向」和「挖洞」为什么必要。",
    "我能推导 Green 定理的矩形情形，并说出它和一维基本定理的关系。",
    "我能写出参数式、隐式、显式三种面积元，并说明显式公式里的「$+1$」从哪来。",
    "我能区分标量曲面积分与通量，并说清「定向」在通量里起什么作用。",
    "我能用 Stokes 定理算空间环量，并解释为什么可以「换曲面」。",
    "我能用散度定理算闭曲面通量，并解释为什么必须用外法向。",
    "我能说出 $\\nabla\\cdot(\\nabla\\times\\mathbf F)=0$ 与 $\\nabla\\times\\nabla f=\\mathbf 0$ 的含义，以及三大定理如何统一成一句话。"
   ]
  }
 ]
});
