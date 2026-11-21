/* =====================================================================
 * data/ch01.js · 第1章 向量导论（Introduction to Vectors）
 * 依据 Gilbert Strang《Introduction to Linear Algebra》5th Edition §1.1–1.3
 * 主线：向量是原材料 → 线性组合能拼出什么 → 点积量长度与夹角 → 矩阵把组合打包
 * ===================================================================== */
CSC.registerChapter({
 "id": "ch01",
 "num": "01",
 "title": "向量导论",
 "en": "Introduction to Vectors",
 "goals": [
  "你能用坐标和箭头两种语言做向量的加法与数乘，并说清每条运算规则为什么成立。",
  "你能判断一个向量能否写成给定向量组的线性组合，并解出全部系数。",
  "你能用坐标公式和长度夹角公式算点积，用它求长度、夹角与投影长度，并判断两个向量是否正交。",
  "你能复述 Cauchy–Schwarz 不等式的条件、结论与证明的关键一步，并指出等号何时成立。",
  "你能把 $A\\mathbf{x}$ 读成「$A$ 的列的线性组合」和「$A$ 的每一行与 $\\mathbf{x}$ 的点积」两种视角，并据此解释 $A\\mathbf{x}=\\mathbf{b}$ 的含义。",
  "你能按规则计算 $AB$，解释为什么 $AB\\ne BA$，并说出单位矩阵 $I$ 与单位数 $1$ 的对应关系。"
 ],
 "kp": [
  {
   "id": "ch01-s1",
   "title": "先看一个例子：两个箭头能拼出什么"
  },
  {
   "id": "ch01-s2",
   "title": "§1.1 向量与线性组合"
  },
  {
   "id": "ch01-s3",
   "title": "§1.1 线性组合的几何：张成空间 span 的雏形"
  },
  {
   "id": "ch01-s4",
   "title": "§1.2 长度、点积与夹角"
  },
  {
   "id": "ch01-s5",
   "title": "§1.2 单位向量、Cauchy–Schwarz 与三角不等式"
  },
  {
   "id": "ch01-s6",
   "title": "§1.3 矩阵与矩阵乘向量"
  },
  {
   "id": "ch01-s7",
   "title": "§1.3 矩阵运算规则与单位矩阵"
  }
 ],
 "blocks": [
  {
   "t": "scope",
   "scope": "core",
   "weeks": "第 1 周",
   "sections": "§1.1–1.3",
   "note": "建议 2 次、每次 48 分钟"
  },
  {
   "t": "callout",
   "kind": "why",
   "title": "这一章要解决什么问题",
   "html": "<p>线性代数这门课是从「解方程组」长出来的，但真正贯穿全书的原材料只有一种：<b>向量</b>（vector）。你可以把它想成一支箭头，也可以想成一列有序的数。两种看法缺一不可：箭头给你几何直觉，坐标给你计算公式。</p><p>这一章只回答三个问题。<b>第一，几个向量能拼出什么？</b>给你两支箭头，各自乘上系数再相加，能到达平面上的哪些点？有些组合铺满整个平面，有些只能沿一条直线走——这个「能到哪儿」的区别，就是后面列空间与秩的源头。<b>第二，怎么量长度和夹角？</b>靠<b>点积</b>（dot product）一个工具，长度、垂直、投影全从它算出来。<b>第三，怎么把一堆组合打包？</b>把系数排成一列、把向量排成矩阵，$A\\mathbf{x}$ 就是「用 $\\mathbf{x}$ 的份量去取 $A$ 的列」。这一句会在第 2 章变成解方程，在第 3 章变成列空间，在第 4 章变成正交。</p><p>说得更具体一点：本章结束时你会亲手算出 $A\\mathbf{x}$ 的每一个分量，也会明白为什么 $A\\mathbf{x}=\\mathbf{b}$ 里「$\\mathbf{b}$ 必须是 $A$ 的列的线性组合」这句话，比「解方程」三个字信息量大得多。</p>"
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "开始前你需要知道",
   "html": "<ul><li><b>平面直角坐标系与勾股定理</b>：点 $(x,y)$、距离 $\\sqrt{x^2+y^2}$。本章把它们推广到 $n$ 维。</li><li><b>解二元一次方程组</b>：会用一个未知数表示另一个，代入求解。第 <a href='#/ch02'>2 章</a>会把它系统化成消元法，本章只用最朴素的办法。</li><li><b>余弦的基本概念</b>：知道 $\\cos 0^\\circ=1$、$\\cos 90^\\circ=0$、$\\cos 180^\\circ=-1$，会查 $30^\\circ$、$45^\\circ$、$60^\\circ$ 的值。本章不做三角恒等变形，只用到这几条。</li><li><b>记号约定</b>：本书向量一律写成列向量 $\\mathbf{v}=\\begin{bmatrix}v_1\\\\ v_2\\end{bmatrix}$，粗体表示它是向量而不是数；$\\mathbb{R}^n$ 表示「$n$ 个实数排成一列」的全体；$\\mathbf{0}$ 表示零向量。若要把列向量横过来写，用转置 $\\mathbf{v}^{\\mathsf T}$：本章 §1.3 会给出定义，第 <a href='#/ch02'>2 章</a> §2.7 再系统讨论对称矩阵与置换。</li><li><b>一个心理准备</b>：本章几乎没有「计算技巧」，全是定义和几何解释。请把每个公式都用一句大白话翻译一遍——后面四章都会反复调用这些翻译。</li></ul>"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "先看一个例子：两个箭头能拼出什么",
   "id": "ch01-s1"
  },
  {
   "t": "p",
   "html": "先在坐标纸上画两支箭头，箭头都从原点出发：$\\mathbf{v}$ 从 $(0,0)$ 指到 $(1,2)$，意思是「向东走 1 格、向北走 2 格」；$\\mathbf{w}$ 从 $(0,0)$ 指到 $(2,3)$。一个人先按 $\\mathbf{v}$ 走一遍，再按 $\\mathbf{w}$ 走一遍，终点就是两段位移接起来的结果：$(1,2)+(2,3)=(3,5)$。这就是向量加法：<b>逐分量相加</b>。如果他先走两遍 $\\mathbf{v}$，再朝 $\\mathbf{w}$ 的反方向走一遍，终点是 $2(1,2)-(2,3)=(0,1)$——注意这里的减号没有让运算变成新东西，它就是「乘 $-1$ 再加」，也就是<b>数乘</b>。"
  },
  {
   "t": "p",
   "html": "现在把问题倒过来问：给定目标点 $\\mathbf{b}=(5,7)$，能不能只靠 $\\mathbf{v}$ 与 $\\mathbf{w}$ 这两支箭头（允许乘系数、允许反着走）到达？换句话说，找两个数 $c_1,c_2$ 使得 $c_1\\mathbf{v}+c_2\\mathbf{w}=\\mathbf{b}$。把它按分量拆开，就是两个方程：$(c_1+2c_2,\\ 2c_1+3c_2)=(5,7)$，即"
  },
  {
   "t": "tex",
   "tex": "c_1\\begin{bmatrix}1\\\\2\\end{bmatrix}+c_2\\begin{bmatrix}2\\\\3\\end{bmatrix}=\\begin{bmatrix}5\\\\7\\end{bmatrix}\\quad\\Longleftrightarrow\\quad\\begin{cases}c_1+2c_2=5\\\\ 2c_1+3c_2=7\\end{cases}",
   "caption": "同一件事的三种写法：箭头组合、矩阵方程、分量方程组"
  },
  {
   "t": "p",
   "html": "解这个二元方程组：由第一式 $c_1=5-2c_2$，代入第二式得 $2(5-2c_2)+3c_2=7$，即 $10-c_2=7$，所以 $c_2=3$，再回代得 $c_1=-1$。验算：$-\\mathbf{v}+3\\mathbf{w}=-(1,2)+3(2,3)=(-1,-2)+(6,9)=(5,7)$，对。系数一正一负完全合法：负号只表示「朝反方向走」，不是错误。这道题的答案还是一对唯一的数——因为两个方向不重合，两条「路」才能把平面撑开。"
  },
  {
   "t": "p",
   "html": "反过来，若 $\\mathbf{w}$ 恰好是 $\\mathbf{v}$ 的两倍，比如 $\\mathbf{v}=(1,2)$、$\\mathbf{w}=(2,4)$，那么 $c_1\\mathbf{v}+c_2\\mathbf{w}=(c_1+2c_2)(1,2)$，无论怎么选系数，终点只能落在直线 $y=2x$ 上，永远到不了 $(5,7)$。同一道「拼目标」的题，能不能拼出、拼法是否唯一，全看这几支箭头「方向是否重复」。这一章就是把这句话讲清楚，并用三种工具来度量它：组合、点积、矩阵。"
  },
  {
   "t": "quiz",
   "qid": "ch01-q1"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "§1.1 向量与线性组合",
   "id": "ch01-s2"
  },
  {
   "t": "p",
   "html": "正式地说，$\\mathbb{R}^2$ 中的一个<b>向量</b>（vector）是一对有序的实数 $\\mathbf{v}=(v_1,v_2)$，其中 $v_1$ 叫第一个分量（或横坐标），$v_2$ 叫第二个分量（或纵坐标）。把它竖起来写就是列向量："
  },
  {
   "t": "tex",
   "tex": "\\mathbf{v}=\\begin{bmatrix}v_1\\\\ v_2\\end{bmatrix}\\in\\mathbb{R}^2,\\qquad \\mathbf{u}=\\begin{bmatrix}u_1\\\\ u_2\\\\ \\vdots\\\\ u_n\\end{bmatrix}\\in\\mathbb{R}^n"
  },
  {
   "t": "p",
   "html": "这里每个符号的含义要逐字抠清楚：字母上方的粗体表示「这是一个向量」；$v_1,v_2$ 是普通的实数，叫分量；右下角的 $n$ 是维数，$\\mathbb{R}^n$ 读作「r n」，表示所有 $n$ 个实数排成一列组成的集合。$n$ 可以很大：图像的一行像素、一份 100 维的特征、一天的天气数据（温度、湿度、风力……）都可以是一个向量。几何上 $n=2$ 是平面箭头，$n=3$ 是空间箭头，$n\\gt3$ 画不出来，但代数运算与 $n=2$ 完全一样——这是线性代数能处理高维数据的原因。"
  },
  {
   "t": "p",
   "html": "向量的两个基本运算，定义都很朴素。加法是逐分量相加，数乘是每个分量都乘同一个数："
  },
  {
   "t": "tex",
   "tex": "\\mathbf{v}+\\mathbf{w}=\\begin{bmatrix}v_1+w_1\\\\ v_2+w_2\\end{bmatrix},\\qquad c\\mathbf{v}=\\begin{bmatrix}cv_1\\\\ cv_2\\end{bmatrix}"
  },
  {
   "t": "p",
   "html": "几何上，加法就是「首尾相接」：把 $\\mathbf{w}$ 的起点平移到 $\\mathbf{v}$ 的终点，从原点到 $\\mathbf{w}$ 终点的那支箭头就是 $\\mathbf{v}+\\mathbf{w}$；换个顺序接，得到同一个终点，所以 $\\mathbf{v}+\\mathbf{w}=\\mathbf{w}+\\mathbf{v}$。数乘则是伸缩：$|c|$ 是拉伸的倍数，$c\\gt0$ 方向不变，$c\\lt0$ 方向反过来。$c=0$ 把任何向量压成零向量 $\\mathbf{0}$，$c=-1$ 得到相反向量 $-\\mathbf{v}$。"
  },
  {
   "t": "p",
   "html": "这两条运算满足一组「看起来显然」的规则：交换律 $\\mathbf{u}+\\mathbf{v}=\\mathbf{v}+\\mathbf{u}$，结合律 $(\\mathbf{u}+\\mathbf{v})+\\mathbf{w}=\\mathbf{u}+(\\mathbf{v}+\\mathbf{w})$，零向量满足 $\\mathbf{v}+\\mathbf{0}=\\mathbf{v}$，相反向量满足 $\\mathbf{v}+(-\\mathbf{v})=\\mathbf{0}$，以及 $c(\\mathbf{u}+\\mathbf{v})=c\\mathbf{u}+c\\mathbf{v}$、$(c+d)\\mathbf{v}=c\\mathbf{v}+d\\mathbf{v}$。现在只需要会用；第 <a href='#/ch03'>3 章</a>会把这些规则抽象成「子空间的判定标准」，那时你会发现它们不是废话，而是筛选「什么样的集合配叫空间」的尺子。"
  },
  {
   "t": "p",
   "html": "有了加法和数乘，就能造出本章最重要的概念。<b>线性组合</b>（linear combination）：给定若干个同维向量 $\\mathbf{v}_1,\\dots,\\mathbf{v}_k$ 和 $k$ 个实数 $c_1,\\dots,c_k$，把每个向量乘上对应的系数再全部相加，所得向量"
  },
  {
   "t": "tex",
   "tex": "c_1\\mathbf{v}_1+c_2\\mathbf{v}_2+\\cdots+c_k\\mathbf{v}_k"
  },
  {
   "t": "p",
   "html": "就叫这些向量的一组线性组合，$c_1,\\dots,c_k$ 叫<b>系数</b>（coefficients）。名字里「线性」两个字是有约束力的：只允许「乘常数」和「相加」两种操作，不许出现平方、乘积、绝对值、开根号。所以 $2\\mathbf{v}_1-3\\mathbf{v}_2$ 是线性组合，而「把对应分量相乘再求和」（即第 <a href='#/ch01/ch01-s4'>1.2 节</a>才定义的点积）也不是。用大白话说：线性组合就是「按配方把几支箭头掺在一起」。"
  },
  {
   "t": "p",
   "html": "看两个最基本的事实。第一，平面里的标准基 $\\mathbf{e}_1=(1,0)$ 与 $\\mathbf{e}_2=(0,1)$ 能组合出任何向量：$(x,y)=x\\mathbf{e}_1+y\\mathbf{e}_2$，系数 $x,y$ 正好是坐标。第二，若 $\\mathbf{v}_1=(1,2)$、$\\mathbf{v}_2=(2,4)$，则一切组合都形如 $(c_1+2c_2)(1,2)$，都落在同一条直线上——这两支箭头方向重复了，组合的自由度只剩一个。同一套运算，仅仅因为向量之间「是否重复」，结果就分成「铺满平面」和「只走一条线」两种命运。第 3 节把这个区别说透。"
  },
  {
   "t": "callout",
   "kind": "warn",
   "title": "三个最容易混的写法",
   "html": "<p>第一，<b>向量相加不是对应分量相乘</b>：$(1,2)+(3,4)=(4,6)$，逐分量相加，别写成 $(3,8)$。</p><p>第二，<b>数乘与点积不是一回事</b>：$c\\mathbf{v}$ 是数乘，结果是向量；$\\mathbf{u}\\cdot\\mathbf{v}$ 是点积（第 4 节），结果是一个数。两者符号不同，绝不能混用。</p><p>第三，<b>线性组合的系数可以任意</b>：负数、分数、零都行。若题目要求「非负系数」，必须明说；不说明就默认 $c_i\\in\\mathbb{R}$。</p>"
  },
  {
   "t": "quiz",
   "qid": "ch01-q2"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "§1.1 线性组合的几何：张成空间 span 的雏形",
   "id": "ch01-s3"
  },
  {
   "t": "p",
   "html": "把所有可能的线性组合收进一个集合，这个集合的形状非常有限，只有三种可能。取一支非零向量 $\\mathbf{v}$，让系数 $c$ 跑遍所有实数，$c\\mathbf{v}$ 描出一条<b>过原点的直线</b>：$c$ 从 $0$ 增大，点沿箭头方向走远；$c$ 取负，点跳到反方向。若 $\\mathbf{v}=\\mathbf{0}$，那只能描出原点一个点。再取两支不共线的向量 $\\mathbf{v},\\mathbf{w}$，让两个系数各自自由，组合点就能铺满整个平面——因为你可以沿一个方向走到任意远，再沿另一个方向调整位置。"
  },
  {
   "t": "p",
   "html": "把这个集合命名：向量组 $\\mathbf{v}_1,\\dots,\\mathbf{v}_k$ 的<b>张成空间</b>（span，中文也叫生成空间）是它们全部线性组合组成的集合，记作"
  },
  {
   "t": "tex",
   "tex": "\\operatorname{span}\\{\\mathbf{v}_1,\\dots,\\mathbf{v}_k\\}=\\{c_1\\mathbf{v}_1+\\cdots+c_k\\mathbf{v}_k\\ :\\ c_1,\\dots,c_k\\in\\mathbb{R}\\}"
  },
  {
   "t": "p",
   "html": "读法：左边「span 大括号里一串向量」，右边「所有形如……的向量」，冒号后面写清 $c_i$ 的取值范围。三个提醒。第一，$\\operatorname{span}$ 的结果是一个<b>集合</b>，不是向量，所以写「$\\mathbf{b}\\in\\operatorname{span}\\{\\mathbf{v},\\mathbf{w}\\}$」，不能说「$\\mathbf{b}$ 等于 span」。第二，这个集合一定包含零向量：让所有系数取 0 即可。第三，系数允许任意实数，所以 span 里的点可以「往回走」，这也是它与「凸组合」（要求系数非负且和为 1）的区别。"
  },
  {
   "t": "lab",
   "id": "vecsum"
  },
  {
   "t": "p",
   "html": "在实验台里拖动两个箭头，画面上会同时显示组合点 $c_1\\mathbf{v}+c_2\\mathbf{w}$ 的轨迹。请重点做三件事：(1) 让两个箭头方向不同，观察怎样铺满平面；(2) 把 $\\mathbf{w}$ 慢慢拖到与 $\\mathbf{v}$ 同一条直线上，看平面怎样「塌」成一条线；(3) 读出当前组合的坐标，与手算的 $c_1\\mathbf{v}+c_2\\mathbf{w}$ 对照。"
  },
  {
   "t": "p",
   "html": "怎么判断两支箭头是否共线？最直接的办法是看坐标是否成比例：设 $\\mathbf{v}\\ne\\mathbf{0}$，只要存在实数 $k$ 使 $\\mathbf{w}=k\\mathbf{v}$，就共线。用分量写出来是 $w_1=kv_1$、$w_2=kv_2$。实际计算时常用它的等价形式「交叉相乘相等」：$v_1w_2=v_2w_1$，即 $v_1w_2-v_2w_1=0$。这个式子在第 <a href='#/ch05'>5 章</a>会被认出来：它正是 $2\\times2$ 矩阵的行列式 $\\det\\begin{bmatrix}v_1&w_1\\\\ v_2&w_2\\end{bmatrix}$。行列式为零就共线，不为零就撑开平面。"
  },
  {
   "t": "p",
   "html": "三个及以上的向量呢？先看前两个：若它们已经撑开平面，那么第三个向量本身也能写成前两个的组合（因为平面里的每个点都能），把它掺进来不会让 span 变大。所以「张成平面」这件事，两个不共线的向量就够了；向量再多，也只是把同一批点重复描述。第 <a href='#/ch03'>3 章</a>会把「够用又不重复」的向量组叫<b>基</b>（basis），本章先记住这个画面：方向不重复，才撑得开。"
  },
  {
   "t": "theorem",
   "name": "张成空间对加法与数乘封闭",
   "zh": "span 的封闭性",
   "rows": [
    {
     "k": "白话",
     "html": "把 span 里的两个点加起来、或把一个点乘上常数，得到的新点仍然待在这个 span 里。"
    },
    {
     "k": "条件",
     "html": "$\\mathbf{v}_1,\\dots,\\mathbf{v}_k$ 是 $\\mathbb{R}^n$ 中固定的向量，系数取任意实数。"
    },
    {
     "k": "结论",
     "html": "若 $\\mathbf{x},\\mathbf{y}\\in\\operatorname{span}\\{\\mathbf{v}_1,\\dots,\\mathbf{v}_k\\}$，则 $\\mathbf{x}+\\mathbf{y}$ 与 $c\\mathbf{x}$（$c\\in\\mathbb{R}$）也属于这个 span。"
    },
    {
     "k": "怎么用",
     "html": "这是「子空间」的第一个例子。第 3 章判定一个集合是不是子空间，查的正是「含零 + 对加法封闭 + 对数乘封闭」这三条。"
    },
    {
     "k": "证明",
     "html": "设 $\\mathbf{x}=\\sum_i c_i\\mathbf{v}_i$，$\\mathbf{y}=\\sum_i d_i\\mathbf{v}_i$。则 $\\mathbf{x}+\\mathbf{y}=\\sum_i (c_i+d_i)\\mathbf{v}_i$，系数 $c_i+d_i$ 仍是实数，所以 $\\mathbf{x}+\\mathbf{y}$ 是 $\\mathbf{v}_i$ 的线性组合；同理 $c\\mathbf{x}=\\sum_i (cc_i)\\mathbf{v}_i$。"
    }
   ]
  },
  {
   "t": "example",
   "no": "1.1",
   "tag": "线性组合与唯一性",
   "fields": [
    {
     "k": "题目",
     "html": "设 $\\mathbf{u}=(1,2)$，$\\mathbf{v}=(2,3)$。(a) 判断 $\\mathbf{b}=(5,7)$ 是否在 $\\operatorname{span}\\{\\mathbf{u},\\mathbf{v}\\}$ 中，若是，求出系数；(b) 判断 $\\mathbf{b}'=(1,3)$ 是否在 span 中，若是，求出系数；(c) 解释为什么这里每个向量在 span 中的表示方式是唯一的。"
    },
    {
     "k": "思路",
     "html": "设 $c_1\\mathbf{u}+c_2\\mathbf{v}=\\mathbf{b}$，把两个分量各写一个方程，得到含 $c_1,c_2$ 的二元一次方程组；解出后<b>一定代回原式验算</b>。判断唯一性不要看方程个数，要看两个向量是否共线。"
    },
    {
     "k": "解答",
     "html": "<p>(a) 方程 $c_1\\begin{bmatrix}1\\\\2\\end{bmatrix}+c_2\\begin{bmatrix}2\\\\3\\end{bmatrix}=\\begin{bmatrix}5\\\\7\\end{bmatrix}$ 即 $c_1+2c_2=5$、$2c_1+3c_2=7$。由第一式 $c_1=5-2c_2$，代入第二式：$10-4c_2+3c_2=7$，所以 $c_2=3$，$c_1=5-6=-1$。验算：$-\\mathbf{u}+3\\mathbf{v}=-(1,2)+3(2,3)=(-1+6,\\ -2+9)=(5,7)$。故 $\\mathbf{b}\\in\\operatorname{span}\\{\\mathbf{u},\\mathbf{v}\\}$，系数为 $(-1,3)$。</p><p>(b) 方程 $c_1+2c_2=1$、$2c_1+3c_2=3$。由第一式 $c_1=1-2c_2$，代入：$2-4c_2+3c_2=3$，得 $c_2=-1$，$c_1=3$。验算：$3(1,2)-(2,3)=(3,6)-(2,3)=(1,3)$。系数为 $(3,-1)$。</p><p>(c) 两向量交叉相乘：$1\\cdot3-2\\cdot2=-1\\ne0$，说明它们不共线。若有两组系数 $(c_1,c_2)$ 与 $(d_1,d_2)$ 都表示同一个 $\\mathbf{b}$，相减得 $(c_1-d_1)\\mathbf{u}+(c_2-d_2)\\mathbf{v}=\\mathbf{0}$。两个不共线的向量要组合出零向量，只能让两个系数都为 0（否则一个就是另一个的倍数），所以 $c_1=d_1$、$c_2=d_2$，表示唯一。</p>"
    },
    {
     "k": "点评",
     "html": "系数是负数、是分数都合法，唯一的要求是代回验算。本题真正的考点在 (c)：唯一性来自「不共线」，与方程有几个无关。若 $\\mathbf{u},\\mathbf{v}$ 共线，方程组要么无解（目标在线外），要么有无穷多解（目标在线内）——第 <a href='#/ch02'>2 章</a>会把这两种情况统一成「主元个数」的语言。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "§1.2 长度、点积与夹角",
   "id": "ch01-s4"
  },
  {
   "t": "p",
   "html": "拿到一支箭头，第一个想问的数是它有多长。平面上由勾股定理，$(v_1,v_2)$ 到原点的距离是 $\\sqrt{v_1^2+v_2^2}$；这个公式在 $n$ 维照搬，就叫向量的<b>长度</b>（length，也叫范数 norm）："
  },
  {
   "t": "tex",
   "tex": "\\lVert\\mathbf{v}\\rVert=\\sqrt{v_1^2+v_2^2+\\cdots+v_n^2}"
  },
  {
   "t": "p",
   "html": "符号 $\\lVert\\mathbf{v}\\rVert$ 两边的双竖线读作「范数」，结果是一个非负实数。三条性质要记牢：只有零向量的长度是 $0$；$\\lVert c\\mathbf{v}\\rVert=|c|\\,\\lVert\\mathbf{v}\\rVert$（伸长 $|c|$ 倍，$c$ 的符号被绝对值吃掉）；以及后面要证的三角不等式。注意长度公式里出现的是「分量的平方和」，这与线性组合的「系数乘向量再相加」完全是两种操作——向量能相加，但向量本身不能平方，平方的是它的分量。"
  },
  {
   "t": "p",
   "html": "长度只回答「多长」，不回答「朝哪」。要同时抓住长度和方向，需要一个把两支箭头「对在一起」的运算。定义两个同维向量的<b>点积</b>（dot product）：对应分量相乘再全部加起来："
  },
  {
   "t": "tex",
   "tex": "\\mathbf{u}\\cdot\\mathbf{v}=u_1v_1+u_2v_2+\\cdots+u_nv_n=\\sum_{i=1}^{n}u_iv_i"
  },
  {
   "t": "p",
   "html": "注意三件事。第一，点积的结果是一个<b>数</b>，不是向量；第二，两个向量必须同维，$\\mathbb{R}^2$ 的向量不能和 $\\mathbb{R}^3$ 的向量做点积；第三，$\\sum_{i=1}^{n}$ 是求和号，意思是「让 $i$ 从 1 走到 $n$，把每一项加起来」，它只是把一长串加法压缩成一行。计算上它满足交换律 $\\mathbf{u}\\cdot\\mathbf{v}=\\mathbf{v}\\cdot\\mathbf{u}$ 与分配律 $\\mathbf{u}\\cdot(\\mathbf{v}+\\mathbf{w})=\\mathbf{u}\\cdot\\mathbf{v}+\\mathbf{u}\\cdot\\mathbf{w}$，还有 $\\mathbf{u}\\cdot\\mathbf{u}=\\lVert\\mathbf{u}\\rVert^2$——最后这条请记成「自己点自己等于长度的平方」。"
  },
  {
   "t": "p",
   "html": "点积真正的威力在它的几何意义。同一本教材里它有三种算法，做题时按已知条件挑一种：(1) <b>坐标算法</b>，就是上面的定义，已知分量时最快；(2) <b>长度夹角算法</b>，$\\mathbf{u}\\cdot\\mathbf{v}=\\lVert\\mathbf{u}\\rVert\\,\\lVert\\mathbf{v}\\rVert\\cos\\theta$，其中 $\\theta$ 是两支箭头之间的夹角，取值 $[0,\\pi]$；(3) <b>投影算法</b>，$\\mathbf{u}\\cdot\\mathbf{v}$ 等于「$\\mathbf{u}$ 的长度」乘「$\\mathbf{v}$ 在 $\\mathbf{u}$ 方向上的投影长度」，投影落在反方向时取负号。三种算法算的是同一个数，这句话就是第 5 节 Cauchy–Schwarz 不等式要保证的事。"
  },
  {
   "t": "tex",
   "tex": "\\mathbf{u}\\cdot\\mathbf{v}=\\lVert\\mathbf{u}\\rVert\\,\\lVert\\mathbf{v}\\rVert\\cos\\theta",
   "caption": "点积的长度夹角算法：$\\theta$ 是两向量的夹角"
  },
  {
   "t": "p",
   "html": "为什么点积的符号能告诉我们夹角？因为长度永远非负，所以 $\\mathbf{u}\\cdot\\mathbf{v}$ 的符号完全由 $\\cos\\theta$ 决定：夹角是锐角时 $\\cos\\theta\\gt0$，点积为正；夹角是直角时 $\\cos\\theta=0$，点积为零；夹角是钝角时 $\\cos\\theta\\lt0$，点积为负。物理里做功 $W=\\mathbf{F}\\cdot\\mathbf{d}$ 就是同一个道理：力与位移同向，做正功；垂直，不做功；反向，做负功。"
  },
  {
   "t": "lab",
   "id": "dotprod"
  },
  {
   "t": "p",
   "html": "实验台里两支箭头可以任意拖动，读数条实时给出点积、两向量长度与夹角。请做三个实验：(1) 把夹角拖到 $90^\\circ$，看点积是否归零；(2) 固定长度，只改变夹角，观察点积随 $\\cos\\theta$ 变化的曲线形状；(3) 让一支箭头反向，验证点积变号而长度不变。"
  },
  {
   "t": "p",
   "html": "点积为零这个特例值得单独命名。若两个非零向量满足 $\\mathbf{u}\\cdot\\mathbf{v}=0$，就说它们<b>正交</b>（orthogonal），几何上就是夹角 $90^\\circ$。约定上，零向量与任何向量点积都是 $0$，所以「零向量与所有向量正交」这句话在代数上成立；但说「两支箭头垂直」时通常默认它们都非零。正交是全书出现频率最高的词之一：第 <a href='#/ch04'>4 章</a>整章都在讲正交，最小二乘、Gram–Schmidt、QR 分解都从「让点积等于 0」开始。"
  },
  {
   "t": "theorem",
   "name": "点积的几何公式",
   "zh": "余弦公式",
   "rows": [
    {
     "k": "白话",
     "html": "点积既能用坐标算，也能用长度乘夹角余弦算，两个算法永远一致。"
    },
    {
     "k": "条件",
     "html": "$\\mathbf{u},\\mathbf{v}\\in\\mathbb{R}^n$ 任意；当两者都非零时，$\\theta\\in[0,\\pi]$ 是它们的夹角。"
    },
    {
     "k": "结论",
     "html": "$\\mathbf{u}\\cdot\\mathbf{v}=\\lVert\\mathbf{u}\\rVert\\,\\lVert\\mathbf{v}\\rVert\\cos\\theta$；两者都非零时 $\\cos\\theta=\\dfrac{\\mathbf{u}\\cdot\\mathbf{v}}{\\lVert\\mathbf{u}\\rVert\\,\\lVert\\mathbf{v}\\rVert}$。若其中一个为零向量，右端按 $0$ 理解，等式仍成立。"
    },
    {
     "k": "怎么用",
     "html": "已知坐标求夹角，先算点积与两个长度再反查余弦；已知长度与夹角求点积，直接用右端。判断正交只需算点积是否为零，不必求角度。"
    },
    {
     "k": "证明",
     "html": "在由 $\\mathbf{u},\\mathbf{v},\\mathbf{v}-\\mathbf{u}$ 组成的三角形上用余弦定理：$\\lVert\\mathbf{v}-\\mathbf{u}\\rVert^2=\\lVert\\mathbf{u}\\rVert^2+\\lVert\\mathbf{v}\\rVert^2-2\\lVert\\mathbf{u}\\rVert\\,\\lVert\\mathbf{v}\\rVert\\cos\\theta$。另一方面，按点积的分配律展开 $\\lVert\\mathbf{v}-\\mathbf{u}\\rVert^2=(\\mathbf{v}-\\mathbf{u})\\cdot(\\mathbf{v}-\\mathbf{u})=\\lVert\\mathbf{v}\\rVert^2-2\\mathbf{u}\\cdot\\mathbf{v}+\\lVert\\mathbf{u}\\rVert^2$。两式相减，得 $-2\\mathbf{u}\\cdot\\mathbf{v}=-2\\lVert\\mathbf{u}\\rVert\\,\\lVert\\mathbf{v}\\rVert\\cos\\theta$，两边除以 $-2$ 即得结论。"
    }
   ]
  },
  {
   "t": "example",
   "no": "1.2",
   "tag": "点积求夹角",
   "fields": [
    {
     "k": "题目",
     "html": "设 $\\mathbf{u}=(3,1)$，$\\mathbf{v}=(1,2)$。(a) 求 $\\lVert\\mathbf{u}\\rVert$、$\\lVert\\mathbf{v}\\rVert$ 与 $\\mathbf{u}\\cdot\\mathbf{v}$；(b) 求两向量的夹角；(c) 判断夹角是锐角、直角还是钝角，并说明只看点积能否判断。"
    },
    {
     "k": "思路",
     "html": "先用坐标算法算点积与两个长度，再代 $\\cos\\theta$ 公式；角度不是特殊角时，用反余弦写出精确表达式。锐角/钝角只需点积符号，不必算出角度。"
    },
    {
     "k": "解答",
     "html": "<p>(a) $\\lVert\\mathbf{u}\\rVert=\\sqrt{3^2+1^2}=\\sqrt{10}$；$\\lVert\\mathbf{v}\\rVert=\\sqrt{1^2+2^2}=\\sqrt5$；$\\mathbf{u}\\cdot\\mathbf{v}=3\\cdot1+1\\cdot2=5$。</p><p>(b) $\\cos\\theta=\\dfrac{5}{\\sqrt{10}\\sqrt5}=\\dfrac{5}{\\sqrt{50}}=\\dfrac{5}{5\\sqrt2}=\\dfrac1{\\sqrt2}$，所以 $\\theta=45^\\circ$。</p><p>验算：$\\lVert\\mathbf{u}\\rVert\\lVert\\mathbf{v}\\rVert\\cos45^\\circ=\\sqrt{50}\\cdot\\frac{\\sqrt2}{2}=\\frac{\\sqrt{100}}{2}=5=\\mathbf{u}\\cdot\\mathbf{v}$，对。</p><p>(c) 点积 $5\\gt0$，所以夹角是锐角；这与 (b) 的 $45^\\circ$ 一致。</p>"
    },
    {
     "k": "点评",
     "html": "最常见的错误是忘了开根号：把 $\\lVert\\mathbf{u}\\rVert$ 写成 $10$，答案就会差一个量级。第二个错误是分母用成 $\\mathbf{u}\\cdot\\mathbf{v}$ 或某个长度，余弦公式的分母一定是两个长度之积。若算出 $|\\cos\\theta|\\gt1$，不用怀疑：一定是点积或长度算错了，因为第 5 节的不等式保证它不会超过 1。"
    }
   ]
  },
  {
   "t": "quiz",
   "qid": "ch01-q3"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "§1.2 单位向量、Cauchy–Schwarz 与三角不等式",
   "id": "ch01-s5"
  },
  {
   "t": "p",
   "html": "上面把 $\\cos\\theta$ 写成「点积除以两个长度」，这个式子里藏着一个数学问题：为什么右端算出来一定落在 $[-1,1]$？如果某天它算出 $1.5$，那么「夹角」就根本不存在。要保证这件事，就必须证明：对任意两个向量，点积的绝对值不超过长度之积。这条不等式叫 <b>Cauchy–Schwarz 不等式</b>（柯西-施瓦茨不等式），是全书最常用的不等式之一。"
  },
  {
   "t": "p",
   "html": "证明之前先做一次「标准化」。任何非零向量 $\\mathbf{v}$ 除以自己的长度，得到的向量 $\\hat{\\mathbf{v}}=\\dfrac{\\mathbf{v}}{\\lVert\\mathbf{v}\\rVert}$ 长度为 $1$，方向与 $\\mathbf{v}$ 相同，叫 $\\mathbf{v}$ 的<b>单位向量</b>（unit vector，符号上的小帽子表示「已归一」）。例如 $(3,4)$ 的长度是 $5$，单位向量是 $\\left(\\frac35,\\frac45\\right)$，验算 $(3/5)^2+(4/5)^2=1$。$\\mathbb{R}^n$ 中有 $n$ 支互相正交的单位向量 $\\mathbf{e}_1,\\dots,\\mathbf{e}_n$（第 $i$ 个位置是 1，其余是 0），它们是「标准方向」的标尺。"
  },
  {
   "t": "p",
   "html": "用单位向量写夹角公式会干净很多：$\\cos\\theta=\\hat{\\mathbf{u}}\\cdot\\hat{\\mathbf{v}}$。这也说明点积衡量的是「方向一致的程度」：同向时 $\\hat{\\mathbf{u}}\\cdot\\hat{\\mathbf{v}}=1$，垂直时为 $0$，反向时为 $-1$。下面这条定理保证它绝不会跑出 $[-1,1]$。"
  },
  {
   "t": "theorem",
   "name": "Cauchy–Schwarz 不等式",
   "zh": "柯西-施瓦茨不等式",
   "rows": [
    {
     "k": "白话",
     "html": "两个向量的点积，绝对值不会超过它们长度的乘积；方向越一致，点积越接近上限。"
    },
    {
     "k": "条件",
     "html": "$\\mathbf{u},\\mathbf{v}\\in\\mathbb{R}^n$ 任意；除 $\\mathbf{v}=\\mathbf{0}$ 的平凡情形外，下面证明中要除以 $\\lVert\\mathbf{v}\\rVert^2$。"
    },
    {
     "k": "结论",
     "html": "$|\\mathbf{u}\\cdot\\mathbf{v}|\\le\\lVert\\mathbf{u}\\rVert\\,\\lVert\\mathbf{v}\\rVert$。等号成立当且仅当 $\\mathbf{u}$ 与 $\\mathbf{v}$ 共线（其中之一是另一个的实数倍）。"
    },
    {
     "k": "怎么用",
     "html": "它保证 $\\cos\\theta$ 有定义，从而「夹角」这个概念合法；也用来证明三角不等式、给出误差界。第 <a href='#/ch04'>4 章</a>证明投影公式时还会再用一次。"
    },
    {
     "k": "证明",
     "html": "设 $\\mathbf{v}\\ne\\mathbf{0}$。对任意实数 $t$，向量 $\\mathbf{u}-t\\mathbf{v}$ 的长度平方非负：$0\\le\\lVert\\mathbf{u}-t\\mathbf{v}\\rVert^2=\\lVert\\mathbf{u}\\rVert^2-2t(\\mathbf{u}\\cdot\\mathbf{v})+t^2\\lVert\\mathbf{v}\\rVert^2$。这是关于 $t$ 的二次式，取使平方项与一次项抵消的 $t=\\dfrac{\\mathbf{u}\\cdot\\mathbf{v}}{\\lVert\\mathbf{v}\\rVert^2}$，得 $0\\le\\lVert\\mathbf{u}\\rVert^2-\\dfrac{(\\mathbf{u}\\cdot\\mathbf{v})^2}{\\lVert\\mathbf{v}\\rVert^2}$，即 $(\\mathbf{u}\\cdot\\mathbf{v})^2\\le\\lVert\\mathbf{u}\\rVert^2\\lVert\\mathbf{v}\\rVert^2$。两边开平方即得。等号成立等价于存在 $t$ 使 $\\lVert\\mathbf{u}-t\\mathbf{v}\\rVert=0$，即 $\\mathbf{u}=t\\mathbf{v}$，也就是共线。"
    }
   ]
  },
  {
   "t": "p",
   "html": "把这个证明的骨架再压缩一遍，方便记忆：<b>造一个永远非负的平方，让它等于一个二次函数，再取最小值</b>。这个模式在数学里反复出现，第 <a href='#/ch04'>4 章</a>证明最小二乘解唯一、第 <a href='#/ch06'>6 章</a>证明对称矩阵特征值为实数，用的都是「平方非负 + 取等号条件」。请特别注意等号条件：很多题目问「什么时候取等号」，答案永远是「共线（同向或反向）」，不是「相等」。"
  },
  {
   "t": "theorem",
   "name": "三角不等式",
   "zh": "长度和的界",
   "rows": [
    {
     "k": "白话",
     "html": "两支箭头首尾相接后的总长度，不会超过两支箭头长度之和；绕路永远不比直走短。"
    },
    {
     "k": "条件",
     "html": "$\\mathbf{u},\\mathbf{v}\\in\\mathbb{R}^n$ 任意。"
    },
    {
     "k": "结论",
     "html": "$\\lVert\\mathbf{u}+\\mathbf{v}\\rVert\\le\\lVert\\mathbf{u}\\rVert+\\lVert\\mathbf{v}\\rVert$，等号成立当且仅当两向量同向（一个是另一个的非负倍数）。"
    },
    {
     "k": "怎么用",
     "html": "估计误差与距离的上界：两个近似值相加，最坏误差不超过各自误差之和。第 <a href='#/ch11'>11 章</a>讨论数值稳定性时会用到。"
    },
    {
     "k": "证明",
     "html": "$\\lVert\\mathbf{u}+\\mathbf{v}\\rVert^2=(\\mathbf{u}+\\mathbf{v})\\cdot(\\mathbf{u}+\\mathbf{v})=\\lVert\\mathbf{u}\\rVert^2+2\\mathbf{u}\\cdot\\mathbf{v}+\\lVert\\mathbf{v}\\rVert^2$。由 Cauchy–Schwarz，$\\mathbf{u}\\cdot\\mathbf{v}\\le|\\mathbf{u}\\cdot\\mathbf{v}|\\le\\lVert\\mathbf{u}\\rVert\\lVert\\mathbf{v}\\rVert$，所以右端 $\\le\\lVert\\mathbf{u}\\rVert^2+2\\lVert\\mathbf{u}\\rVert\\lVert\\mathbf{v}\\rVert+\\lVert\\mathbf{v}\\rVert^2=(\\lVert\\mathbf{u}\\rVert+\\lVert\\mathbf{v}\\rVert)^2$。两边开平方得结论。"
    }
   ]
  },
  {
   "t": "p",
   "html": "Cauchy–Schwarz 还有几种「换皮」的写法，认识它们能省很多力气。在 $\\mathbb{R}^2$ 里，它就是 $|x_1y_1+x_2y_2|\\le\\sqrt{x_1^2+x_2^2}\\sqrt{y_1^2+y_2^2}$；在概率里，把中心化后的 $x_i$、$y_i$ 看成两组样本，它就变成「相关系数绝对值不超过 1」；在积分里，把求和换成积分，它变成 $\\left|\\int fg\\right|^2\\le\\int f^2\\int g^2$。同一个证明骨架，三种外衣。"
  },
  {
   "t": "example",
   "no": "1.3",
   "tag": "投影与正交分解",
   "fields": [
    {
     "k": "题目",
     "html": "设 $\\mathbf{a}=(1,1)$，$\\mathbf{b}=(4,3)$。(a) 求 $\\mathbf{b}$ 在 $\\mathbf{a}$ 方向上的投影向量的长度（带符号）；(b) 求投影向量 $\\mathbf{p}$，并验证 $\\mathbf{b}-\\mathbf{p}$ 与 $\\mathbf{a}$ 正交；(c) 用 $\\mathbf{b}=\\mathbf{p}+\\mathbf{e}$ 解释这次分解的几何意义。"
    },
    {
     "k": "思路",
     "html": "点积的第三种算法：$\\mathbf{a}\\cdot\\mathbf{b}=\\lVert\\mathbf{a}\\rVert\\times(\\mathbf{b}$ 在 $\\mathbf{a}$ 上的投影长度$)$。先算投影长度，再乘以 $\\mathbf{a}$ 的单位向量得到投影向量；最后用点积验证正交。"
    },
    {
     "k": "解答",
     "html": "<p>(a) $\\mathbf{a}\\cdot\\mathbf{b}=1\\cdot4+1\\cdot3=7$，$\\lVert\\mathbf{a}\\rVert=\\sqrt2$，所以投影长度（带符号）为 $\\dfrac{\\mathbf{a}\\cdot\\mathbf{b}}{\\lVert\\mathbf{a}\\rVert}=\\dfrac{7}{\\sqrt2}=\\dfrac{7\\sqrt2}{2}$。</p><p>(b) $\\mathbf{a}$ 的单位向量是 $\\hat{\\mathbf{a}}=\\left(\\frac{1}{\\sqrt2},\\frac{1}{\\sqrt2}\\right)$，于是 $\\mathbf{p}=\\dfrac{7}{\\sqrt2}\\hat{\\mathbf{a}}=\\dfrac{7}{2}(1,1)=(3.5,\\ 3.5)$。等价地 $\\mathbf{p}=\\dfrac{\\mathbf{a}\\cdot\\mathbf{b}}{\\mathbf{a}\\cdot\\mathbf{a}}\\,\\mathbf{a}=\\dfrac{7}{2}(1,1)$。</p><p>验证：$\\mathbf{b}-\\mathbf{p}=(4,3)-(3.5,3.5)=(0.5,-0.5)$，与 $\\mathbf{a}$ 的点积为 $0.5-0.5=0$，确实正交。</p><p>(c) $\\mathbf{b}=(3.5,3.5)+(0.5,-0.5)$：前一块沿着 $\\mathbf{a}$ 的方向，后一块垂直于 $\\mathbf{a}$。这就是把一个向量拆成「平行分量 + 垂直分量」，也是第 <a href='#/ch04'>4 章</a>投影公式的原型。</p>"
    },
    {
     "k": "点评",
     "html": "要区分两个量：<b>投影长度</b>是数（$7/\\sqrt2$），<b>投影向量</b>是向量（$(3.5,3.5)$）。题目问哪个就答哪个。投影长度可正可负：$\\theta$ 为钝角时点积为负，投影落在 $\\mathbf{a}$ 的反方向，此时「长度」带负号。最后一步的正交验证不能省——它是判断投影算对没算对的最快方法。"
    }
   ]
  },
  {
   "t": "quiz",
   "qid": "ch01-q4"
  },
  {
   "t": "quiz",
   "qid": "ch01-q5"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "§1.3 矩阵与矩阵乘向量",
   "id": "ch01-s6"
  },
  {
   "t": "p",
   "html": "§1.1 的线性组合 $c_1\\mathbf{v}_1+\\cdots+c_n\\mathbf{v}_n$ 每换一组系数就要重算一遍，很麻烦。如果固定向量组、只让系数变，能不能把「这堆向量」和「这组系数」各自排成一个方块，用一次乘法算完？可以。把 $n$ 支列向量并排站，得到 $m\\times n$ 的<b>矩阵</b>（matrix）$A$；把系数竖着排成 $\\mathbf{x}$。矩阵乘向量的规则定义为"
  },
  {
   "t": "tex",
   "tex": "A\\mathbf{x}=\\begin{bmatrix}a_{11}&a_{12}&\\cdots&a_{1n}\\\\ a_{21}&a_{22}&\\cdots&a_{2n}\\\\ \\vdots&\\vdots&&\\vdots\\\\ a_{m1}&a_{m2}&\\cdots&a_{mn}\\end{bmatrix}\\begin{bmatrix}x_1\\\\ x_2\\\\ \\vdots\\\\ x_n\\end{bmatrix}=\\begin{bmatrix}a_{11}x_1+a_{12}x_2+\\cdots+a_{1n}x_n\\\\ a_{21}x_1+a_{22}x_2+\\cdots+a_{2n}x_n\\\\ \\vdots\\\\ a_{m1}x_1+a_{m2}x_2+\\cdots+a_{mn}x_n\\end{bmatrix}"
  },
  {
   "t": "p",
   "html": "逐个符号解释：$a_{ij}$ 表示第 $i$ 行、第 $j$ 列的那个数，$i$ 从 1 到 $m$，$j$ 从 1 到 $n$；$m$ 是<b>行数</b>，$n$ 是<b>列数</b>；$A$ 叫 $m\\times n$ 矩阵（先读行、后读列）。乘法的可行性条件是：$A$ 的列数 $n$ 必须等于 $\\mathbf{x}$ 的分量个数。结果的维数只由 $A$ 的行数决定：$A\\mathbf{x}\\in\\mathbb{R}^m$。一句话口诀：<b>内维相等，外维定输出</b>。"
  },
  {
   "t": "p",
   "html": "按定义逐项算，是「行与 $\\mathbf{x}$ 的点积」：$A\\mathbf{x}$ 的第 $i$ 个分量，等于 $A$ 的第 $i$ 行与 $\\mathbf{x}$ 做点积。但还有第二种看法，信息量大得多：$A\\mathbf{x}$ 是 $A$ 的各列按 $\\mathbf{x}$ 的分量加权后的组合，即 $A\\mathbf{x}=x_1\\mathbf{a}_1+x_2\\mathbf{a}_2+\\cdots+x_n\\mathbf{a}_n$，其中 $\\mathbf{a}_j$ 是 $A$ 的第 $j$ 列。两种看法算出的结果当然相同，但前者告诉你「怎么算」，后者告诉你「为什么能算」。"
  },
  {
   "t": "theorem",
   "name": "矩阵乘向量的列组合解释",
   "zh": "Ax 的列视角",
   "rows": [
    {
     "k": "白话",
     "html": "$A\\mathbf{x}$ 就是把 $A$ 的各列按 $\\mathbf{x}$ 的分量当配方掺起来。"
    },
    {
     "k": "条件",
     "html": "$A$ 是 $m\\times n$ 矩阵，$\\mathbf{x}\\in\\mathbb{R}^n$；记 $A$ 的第 $j$ 列为 $\\mathbf{a}_j\\in\\mathbb{R}^m$。"
    },
    {
     "k": "结论",
     "html": "$A\\mathbf{x}=x_1\\mathbf{a}_1+x_2\\mathbf{a}_2+\\cdots+x_n\\mathbf{a}_n$，特别地 $A\\mathbf{x}$ 永远落在 $A$ 的各列张成的空间里。"
    },
    {
     "k": "怎么用",
     "html": "判断 $A\\mathbf{x}=\\mathbf{b}$ 有没有解，等价于问「$\\mathbf{b}$ 是不是 $A$ 的列的线性组合」。第 <a href='#/ch02'>2 章</a>的列图与第 <a href='#/ch03'>3 章</a>的列空间都建立在这句话上。"
    },
    {
     "k": "证明",
     "html": "比较两个向量的第 $i$ 个分量。$A\\mathbf{x}$ 的第 $i$ 分量按定义是 $\\sum_j a_{ij}x_j$；组合 $\\sum_j x_j\\mathbf{a}_j$ 的第 $i$ 分量是 $\\sum_j x_j(\\mathbf{a}_j)_i=\\sum_j x_j a_{ij}$。两式完全相同，所以两个向量相等。"
    }
   ]
  },
  {
   "t": "lab",
   "id": "matvec"
  },
  {
   "t": "p",
   "html": "实验台里拖动 $x_1,x_2$ 两个滑块，注意看输出点 $A\\mathbf{x}$ 怎么动：它永远落在两条列向量张成的平行四边形里，$x_1$ 决定沿第一列走多远，$x_2$ 决定沿第二列走多远。把 $x_1$ 调到 2、$x_2$ 调到 $-1$，读出结果，再手算 $2\\mathbf{a}_1-\\mathbf{a}_2$ 对照。"
  },
  {
   "t": "example",
   "no": "1.4",
   "tag": "矩阵乘向量的两种视角",
   "fields": [
    {
     "k": "题目",
     "html": "设 $A=\\begin{bmatrix}1&2&0\\\\ 3&1&1\\end{bmatrix}$，$\\mathbf{x}=\\begin{bmatrix}2\\\\ -1\\\\ 3\\end{bmatrix}$。(a) 按「行与 $\\mathbf{x}$ 点积」逐分量计算 $A\\mathbf{x}$；(b) 按「列的线性组合」计算 $A\\mathbf{x}$，并指出系数；(c) 判断 $A\\mathbf{x}=\\mathbf{b}$ 中 $\\mathbf{b}$ 必须满足什么条件。"
    },
    {
     "k": "思路",
     "html": "两种视角各算一遍，答案必须相同，这本身就是验算。列视角先认出三列 $\\mathbf{a}_1,\\mathbf{a}_2,\\mathbf{a}_3$，再用 $x_1,x_2,x_3$ 加权。" 
    },
    {
     "k": "解答",
     "html": "<p>(a) 第一行与 $\\mathbf{x}$ 点积：$1\\cdot2+2\\cdot(-1)+0\\cdot3=0$；第二行：$3\\cdot2+1\\cdot(-1)+1\\cdot3=8$。所以 $A\\mathbf{x}=\\begin{bmatrix}0\\\\8\\end{bmatrix}$。</p><p>(b) 三列分别是 $\\mathbf{a}_1=(1,3)$、$\\mathbf{a}_2=(2,1)$、$\\mathbf{a}_3=(0,1)$，故 $A\\mathbf{x}=2\\mathbf{a}_1-\\mathbf{a}_2+3\\mathbf{a}_3=2(1,3)-(2,1)+3(0,1)=(2,6)-(2,1)+(0,3)=(0,8)$，与 (a) 一致。系数就是 $\\mathbf{x}$ 的分量 $(2,-1,3)$。</p><p>(c) 由列视角，$A\\mathbf{x}$ 是 $\\mathbf{a}_1,\\mathbf{a}_2,\\mathbf{a}_3$ 的线性组合；反过来，$A\\mathbf{x}=\\mathbf{b}$ 有解等价于 $\\mathbf{b}$ 能写成这三列的组合。由于三个向量都在 $\\mathbb{R}^2$ 里，其中必定有一个是多余的（三个向量装不进两维，见第 <a href='#/ch03'>3 章</a>）；而 $\\mathbf{a}_1=(1,3)$ 与 $\\mathbf{a}_2=(2,1)$ 不共线（$1\\cdot1-3\\cdot2=-5\\ne0$），这两列已经张成整个 $\\mathbb{R}^2$，所以对任意 $\\mathbf{b}\\in\\mathbb{R}^2$ 都能找到解。</p>"
    },
    {
     "k": "点评",
     "html": "矩阵乘向量的计算错误八成来自行列错位，最省事的检查就是两种视角各算一遍。列视角还有一个副产品：只要看到 $\\mathbf{x}$ 的某个分量是 $0$，对应的列就不参与组合，可以直接跳过。注意 (c) 里「三列中必有一列多余」这件事并不显然，它等价于 $A$ 的列秩小于 3，第 3 章会用消元把它算出来。"
    }
   ]
  },
  {
   "t": "quiz",
   "qid": "ch01-q6"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "§1.3 矩阵运算规则与单位矩阵",
   "id": "ch01-s7"
  },
  {
   "t": "p",
   "html": "矩阵之间也能做加法、数乘和乘法，但每条规则都要先问「形状对不对」。加法与数乘都是逐元素进行：只有同形的两个矩阵才能相加，$A+B$ 的每个位置是对应位置相加；$cA$ 是每个元素乘 $c$。真正需要小心的是乘法。设 $A$ 是 $m\\times n$ 矩阵、$B$ 是 $n\\times p$ 矩阵，则 $AB$ 是 $m\\times p$ 矩阵，其第 $(i,j)$ 个元素是 $A$ 的第 $i$ 行与 $B$ 的第 $j$ 列的点积："
  },
  {
   "t": "tex",
   "tex": "(AB)_{ij}=\\sum_{k=1}^{n}a_{ik}b_{kj}"
  },
  {
   "t": "p",
   "html": "这里新出现的下标 $k$ 是「中间维」，它从 1 走到 $n$，走完就消失——所以 $m\\times n$ 乘 $n\\times p$ 得 $m\\times p$，中间那个 $n$ 必须相同且不出现在结果里。这也是判断「能不能乘、乘出来多大」的最快方法。注意乘法不要求两个矩阵同形，只要求内维相等，这是它比加法灵活的地方。"
  },
  {
   "t": "p",
   "html": "按列分块看，$AB$ 的第 $j$ 列恰好是 $A$ 乘 $B$ 的第 $j$ 列：$(AB)$ 的第 $j$ 列 $=A(B$ 的第 $j$ 列$)$。为什么？因为 $AB$ 的第 $j$ 列的第 $i$ 个元素是 $A$ 的第 $i$ 行与 $B$ 的第 $j$ 列的点积，这正是向量 $A\\mathbf{b}_j$ 的第 $i$ 个分量。这个视角把「矩阵乘矩阵」降级成「矩阵乘向量」算 $p$ 次，第 <a href='#/ch02'>2 章</a> §2.4 还会给出另外两种视角（行组合与列乘行求和），四种视角合起来才是完整的矩阵乘法。"
  },
  {
   "t": "p",
   "html": "矩阵乘法满足结合律 $(AB)C=A(BC)$、分配律 $A(B+C)=AB+AC$ 与 $(A+B)C=AC+BC$，数乘可以随意进出 $c(AB)=(cA)B=A(cB)$。但它<b>不满足交换律</b>：大多数情况下 $AB\\ne BA$，而且 $AB$ 有意义时 $BA$ 可能根本没有定义（形状不匹配）。这一点与数的乘法完全不同，做题时绝不能把 $AB$ 和 $BA$ 当成一回事。"
  },
  {
   "t": "p",
   "html": "数里有 $1$，矩阵里有<b>单位矩阵</b>（identity matrix）$I$：主对角线全是 $1$、其余位置全是 $0$ 的方阵。它满足 $AI=A$、$IA=A$（只要形状匹配），效果与「乘 1」一模一样。$I$ 的第 $j$ 列是第 $j$ 个标准基向量 $\\mathbf{e}_j$，所以 $I\\mathbf{x}=\\mathbf{x}$ 用列视角看就是「把 $\\mathbf{x}$ 的分量原封不动地当系数用」。第 <a href='#/ch02'>2 章</a>求逆矩阵时，$A^{-1}$ 的定义就是「满足 $A^{-1}A=I$ 的那个矩阵」。"
  },
  {
   "t": "p",
   "html": "最后补一个本章会用到的操作：<b>转置</b>（transpose）。把矩阵的行与列互换，得到 $A^{\\mathsf T}$：$A$ 的第 $i$ 行变成 $A^{\\mathsf T}$ 的第 $i$ 列，元素满足 $(A^{\\mathsf T})_{ij}=a_{ji}$。三条性质要记住：转置两次回到自己 $(A^{\\mathsf T})^{\\mathsf T}=A$；和的转置等于转置的和；<b>乘积的转置要把顺序反过来</b>，$(AB)^{\\mathsf T}=B^{\\mathsf T}A^{\\mathsf T}$。若方阵满足 $A^{\\mathsf T}=A$，叫<b>对称矩阵</b>（symmetric matrix），它在第 <a href='#/ch06'>6 章</a>会获得特殊待遇（特征值全为实数、特征向量可正交）。"
  },
  {
   "t": "p",
   "html": "转置第一次真正派上用场，是把点积写成矩阵乘法：把 $\\mathbf{u},\\mathbf{v}$ 都看成列向量，则 $\\mathbf{u}\\cdot\\mathbf{v}=\\mathbf{u}^{\\mathsf T}\\mathbf{v}$。左边是 $1\\times n$ 的行乘 $n\\times 1$ 的列，结果是 $1\\times1$ 矩阵，也就是一个数。这个写法在第 <a href='#/ch04'>4 章</a>会反复出现：投影公式里的 $A^{\\mathsf T}A$、最小二乘的正规方程 $A^{\\mathsf T}A\\hat{\\mathbf{x}}=A^{\\mathsf T}\\mathbf{b}$，全是「行乘列」的批量版本。"
  },
  {
   "t": "example",
   "no": "1.5",
   "tag": "矩阵乘法与转置",
   "fields": [
    {
     "k": "题目",
     "html": "设 $A=\\begin{bmatrix}1&2\\\\ 3&4\\end{bmatrix}$，$B=\\begin{bmatrix}1&0\\\\ 1&1\\end{bmatrix}$。(a) 用列视角求 $AB$；(b) 求 $BA$，说明 $AB\\ne BA$；(c) 验证 $(AB)^{\\mathsf T}=B^{\\mathsf T}A^{\\mathsf T}$。"
    },
    {
     "k": "思路",
     "html": "$AB$ 的第 $j$ 列 $=A$ 乘 $B$ 的第 $j$ 列。先写下 $B$ 的两列，再分别用 $A$ 去乘。转置验证把两个矩阵转置后按相反顺序相乘，与 $(AB)^{\\mathsf T}$ 对照。"
    },
    {
     "k": "解答",
     "html": "<p>(a) $B$ 的第 1 列是 $(1,1)$，第 2 列是 $(0,1)$。$A(1,1)=(1+2,\\ 3+4)=(3,7)$，$A(0,1)=(2,4)$。所以 $AB=\\begin{bmatrix}3&2\\\\ 7&4\\end{bmatrix}$。</p><p>(b) $BA$ 的第 1 列 $=B(1,3)=(1\\cdot1+0\\cdot3,\\ 1\\cdot1+1\\cdot3)=(1,4)$；第 2 列 $=B(2,4)=(2,\\ 2+4)=(2,6)$。故 $BA=\\begin{bmatrix}1&2\\\\ 4&6\\end{bmatrix}\\ne AB$。</p><p>(c) $(AB)^{\\mathsf T}=\\begin{bmatrix}3&7\\\\ 2&4\\end{bmatrix}$。另一方面 $B^{\\mathsf T}=\\begin{bmatrix}1&1\\\\ 0&1\\end{bmatrix}$，$A^{\\mathsf T}=\\begin{bmatrix}1&3\\\\ 2&4\\end{bmatrix}$，乘积 $B^{\\mathsf T}A^{\\mathsf T}=\\begin{bmatrix}1\\cdot1+1\\cdot2&1\\cdot3+1\\cdot4\\\\ 0\\cdot1+1\\cdot2&0\\cdot3+1\\cdot4\\end{bmatrix}=\\begin{bmatrix}3&7\\\\ 2&4\\end{bmatrix}$，与 $(AB)^{\\mathsf T}$ 相同。</p>"
    },
    {
     "k": "点评",
     "html": "列视角算 $AB$ 比逐元素算快得多，也更容易查错。(b) 提醒你：矩阵乘法不是「对应位置相乘再相加」那种对称运算，交换顺序结果一般会变。(c) 的反序规则最容易漏：写成 $(AB)^{\\mathsf T}=A^{\\mathsf T}B^{\\mathsf T}$ 是最常见的错误，正确顺序必须反过来，与 $(AB)^{-1}=B^{-1}A^{-1}$ 的规则同构。"
    }
   ]
  },
  {
   "t": "quiz",
   "qid": "ch01-q7"
  },
  {
   "t": "p",
   "html": "把本章三件事串成一条线：向量是原材料，线性组合是配方，点积是量尺，矩阵是把配方批量执行的机器。回头看第 1 节那道「拼目标」的题，它其实是 $A\\mathbf{x}=\\mathbf{b}$ 的一个 2 维实例：$A$ 的两列是 $\\mathbf{v},\\mathbf{w}$，未知向量 $\\mathbf{x}=(c_1,c_2)$，所求的 $\\mathbf{b}$ 是目标。第 <a href='#/ch02'>2 章</a>要回答的，正是这台机器什么时候能解、解有几个、怎么系统地算出来；而第 <a href='#/ch03'>3 章</a>会把「$A$ 的列的全体组合」命名为列空间，把「让 $A\\mathbf{x}=\\mathbf{0}$ 的全体 $\\mathbf{x}$」命名为零空间。本章所有看似零散的定义，都是那两座大厦的地基。"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "如果只记三件事",
     "html": "向量 = 箭头 = 一列数；线性组合 = 只许乘常数再相加；$A\\mathbf{x}$ = $A$ 的列按 $\\mathbf{x}$ 的份量组合。"
    },
    {
     "title": "点积的两个算法",
     "html": "坐标算法 $\\mathbf{u}\\cdot\\mathbf{v}=\\sum u_iv_i$；几何算法 $\\mathbf{u}\\cdot\\mathbf{v}=\\lVert\\mathbf{u}\\rVert\\lVert\\mathbf{v}\\rVert\\cos\\theta$。点积为 $0$ 就是正交。"
    },
    {
     "title": "一条不等式",
     "html": "$|\\mathbf{u}\\cdot\\mathbf{v}|\\le\\lVert\\mathbf{u}\\rVert\\lVert\\mathbf{v}\\rVert$，等号当且仅当共线。它保证「夹角」有定义。"
    },
    {
     "title": "矩阵乘法的三个检查",
     "html": "内维相等才能乘；结果形状是「外外」；$AB\\ne BA$，转置要反序 $(AB)^{\\mathsf T}=B^{\\mathsf T}A^{\\mathsf T}$。"
    }
   ]
  },
  {
   "t": "checklist",
   "id": "ch01",
   "items": [
    "我能用坐标算出 $2\\mathbf{v}-3\\mathbf{w}$，也能在图上把结果画出来，并解释负系数的几何含义。",
    "我能判断一个向量是否在给定向量组的 span 中：会写方程、会解系数、会代回验算。",
    "我能用「交叉相乘是否为零」判断两个向量是否共线，并说清共线与否对 span 形状的影响。",
    "我能分别用坐标与长度夹角两种算法算点积，两种结果一致时才放心。",
    "我能由点积符号判断夹角是锐角、直角还是钝角，并求出具体角度。",
    "我能复述 Cauchy–Schwarz 的证明骨架（造平方、取最小值），并指出等号条件。",
    "我能把 $A\\mathbf{x}$ 用行视角和列视角各算一遍，并说明两者为什么相等。",
    "我能按「内维相等、外维定输出」判断两个矩阵能否相乘，并算出乘积的形状。",
    "我能说明单位矩阵与数 $1$ 的对应关系，并写出 $(AB)^{\\mathsf T}$ 的正确展开。"
   ]
  }
 ]
});
