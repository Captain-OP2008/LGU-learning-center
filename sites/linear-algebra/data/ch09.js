/* =====================================================================
 * data/ch09.js · 第 9 章 复向量与复矩阵（Complex Vectors and Matrices）
 * 主线：i 是 90° 旋转 → 复数与极坐标 → 复内积（共轭） → Hermite/酉 → DFT/FFT
 * 结构：5 节 / 5 例题 / 3 定理 / 1 实验台 / 6 题内嵌
 * ===================================================================== */
CSC.registerChapter({
  id: "ch09",
  num: "09",
  title: "复向量与复矩阵",
  en: "Complex Vectors and Matrices",
  goals: [
    "你能把复数写成 $a+bi$ 与 $re^{i\\theta}$ 两种形式，并在复平面上把乘法解释成「旋转 + 伸缩」。",
    "你能用欧拉公式 $e^{i\\theta}=\\cos\\theta+i\\sin\\theta$ 把三角恒等式改写成指数运算，并说出它为什么不是凭空规定。",
    "你能用带共轭的内积 $\\mathbf{u}^{\\mathsf H}\\mathbf{v}$ 算复向量的长度、判断正交，并解释为什么不能直接用 $\\mathbf{u}^{\\mathsf T}\\mathbf{v}$。",
    "你能判断一个复矩阵是不是 Hermite 矩阵、酉矩阵，并说出谱定理在复数版里变成了什么。",
    "你能写出 4 点傅里叶矩阵并验证它的列两两正交，还能说清 FFT 怎样把 $n^2$ 次乘法降到 $n\\log_2n$ 次。"
  ],
  kp: [
    { id: "ch09-s1", title: "先看一个例子：i 是一个 90 度旋转" },
    { id: "ch09-s2", title: "§9.1 复数与复向量" },
    { id: "ch09-s3", title: "§9.1 复矩阵、共轭转置与内积" },
    { id: "ch09-s4", title: "§9.2 Hermite 矩阵与酉矩阵" },
    { id: "ch09-s5", title: "§9.3 快速傅里叶变换 FFT" }
  ],
  labIds: ["transform"],
  quizIds: ["ch09-q1", "ch09-q2", "ch09-q3", "ch09-q4", "ch09-q5", "ch09-q6"],
  blocks: [
    { t: "scope", scope: "extension", weeks: "第 11 周", sections: "§9.1–9.3", note: "选读章：不读也能进第 10 章，但第 10 章的傅里叶与图论会反复用本章的记号。" },

    { t: "callout", kind: "why", title: "这一章要解决什么问题",
      html: "<p>实数轴是一条直线。你可以在线上往左往右移、可以把刻度拉长压短，但有一个动作它<b>永远做不到</b>：转弯。二维平面上的旋转、交流电的相位、声波的叠加，都需要一个能「转」的数。这一章就是把这种数造出来，并且验证它没有破坏我们辛苦建立的线性代数。</p><p>关键一步是：把平面上的点本身当成数。规定 $i$ 表示「逆时针转 $90^\\circ$」这个动作，那么 $1\\to i\\to -1$，转两次回到 $-1$，于是 $i^2=-1$。所以 $i^2=-1$ 不是数学家拍脑袋的怪规定，而是「转两次 $90^\\circ$ 等于转 $180^\\circ$」的代数翻译。有了它，$a+bi$ 就同时是「平面上的点」和「一个数」：加法就是向量相加，乘法就是旋转加伸缩。</p><p>接下来要付一点代价。长度、正交这些概念在实数上靠 $\\mathbf{v}^{\\mathsf T}\\mathbf{v}$ 就够了；到了复数，同一个公式会让你算出「非零向量的长度是 $0$」。正确的修法是给内积加一个共轭，得到 $\\mathbf{u}^{\\mathsf H}\\mathbf{v}$。把这个修法贯彻到底，实对称矩阵变成 Hermite 矩阵、正交矩阵变成酉矩阵，而第 6 章的谱定理原封不动地成立。本章最后一步把这些结论装进傅里叶矩阵：它的列是复内积下的标准正交基，直接算要 $n^2$ 次乘法，FFT 只要 $n\\log_2 n$ 次——你手机里的音频压缩、图像压缩都靠这个差距活着。</p>" },

    { t: "callout", kind: "note", title: "开始前你需要知道",
      html: "<ul><li><b>复数的四则运算</b>：中学学过 $i^2=-1$、共轭、模长。本章 9.1 节会重讲一遍，忘了也能跟上。</li><li><b>第 6 章的对称矩阵与谱定理</b>：实对称矩阵有实特征值、有正交特征向量。本章要做的事就是把它翻译成复数版本。</li><li><b>第 4 章的正交与投影</b>：投影公式里到处是「转置 + 点积」，在复数里这两样都要换成「共轭转置 + 复内积」。</li><li><b>一点点三角</b>：只需记得 $\\sin(\\alpha+\\beta)$ 与 $\\cos(\\alpha+\\beta)$ 的和角公式，9.1 节用它们验证复数乘法的角度相加。</li></ul>" },

    // ============================================================ s1
    { t: "h", lvl: 2, text: "先看一个例子：i 是一个 90 度旋转", id: "ch09-s1" },
    { t: "p", lead: true, html: "先问一个看起来很小的问题：能不能造一个数，乘它一次，就把数轴上的 1 转到「旁边」去？实数轴只有左右，转不动。可如果允许离开这条线、进入平面，那么「把 $1$ 转到正上方」就是一个干净的动作。给这个动作起个名字：$i$。" },
    { t: "p", html: "现在把这个动作连做两次。$1$ 转到正上方变成 $i$；再从正上方接着转 $90^\\circ$，落到负方向，也就是 $-1$。把这两步写成乘法：第一步是 $i\\cdot 1=i$，第二步是 $i\\cdot i=i^2$。两次转 $90^\\circ$ 合起来是转 $180^\\circ$，结果必须是 $-1$。于是" },
    { t: "tex", tex: "i^2=-1,\\qquad i=\\text{逆时针 }90^\\circ\\text{ 的旋转}", caption: "虚数单位的几何含义：它不是「不存在的数」，而是一个旋转动作" },
    { t: "p", html: "所以 $i^2=-1$ 根本不是一个奇怪的规定，它是一条几何事实的代数写法。用大白话说：<b>$i$ 是「转 $90^\\circ$」这个动作本身</b>；$i^2=-1$ 只是说这个动作做两次等于掉头。有了这个理解，下面的乘法公式就不需要背了——它就是把「旋转 + 伸缩」翻译成坐标运算。" },
    { t: "p", html: "符号先交代清楚。一个<b>复数</b>（complex number）写成 $z=a+bi$，其中 $a$ 与 $b$ 都是普通的实数：$a$ 叫<b>实部</b>，$b$ 叫<b>虚部</b>，$i$ 是刚才那个旋转。把 $z$ 画成平面上的点或向量 $(a,b)$，横轴叫实轴、纵轴叫虚轴，这张平面叫<b>复平面</b>。两个复数相加，就是两个向量相加：" },
    { t: "tex", tex: "(a+bi)+(c+di)=(a+c)+(b+d)i" },
    { t: "p", html: "乘法按分配律展开，遇到 $i^2$ 就换成 $-1$：" },
    { t: "tex", tex: "(a+bi)(c+di)=ac+adi+bci+bdi^2=(ac-bd)+(ad+bc)i" },
    { t: "p", html: "拿具体数字走一遍：$(1+2i)(3-i)$。先把它当成两个括号相乘，逐项写出四个乘积 $1\\cdot3$、$1\\cdot(-i)$、$2i\\cdot3$、$2i\\cdot(-i)$，再把 $i^2$ 换成 $-1$：" },
    { t: "tex", tex: "(1+2i)(3-i)=3-i+6i-2i^2=3+5i+2=5+5i" },
    { t: "p", html: "注意乘法<b>不是</b>逐分量相乘：如果你把实部乘实部、虚部乘虚部，会得到 $3-2i$，那是错的。乘法是一次旋转，而旋转会同时搅动两个分量，这是复数乘法的全部内容。" },
    { t: "p", html: "把这件事写成矩阵，就露出它的线性代数面孔。把 $z=a+bi$ 看成列向量 $\\begin{bmatrix}a\\\\b\\end{bmatrix}$，乘上 $c+di$ 这个动作可以写成" },
    { t: "tex", tex: "\\begin{bmatrix}c&-d\\\\d&c\\end{bmatrix}\\begin{bmatrix}a\\\\b\\end{bmatrix}=\\begin{bmatrix}ac-bd\\\\ad+bc\\end{bmatrix}", caption: "乘以 c+di 的矩阵：一个旋转矩阵乘上伸缩因子" },
    { t: "p", html: "右边正是上面算出的乘积。左边这个矩阵你也许眼熟：它长得像旋转矩阵 $\\begin{bmatrix}\\cos\\theta&-\\sin\\theta\\\\ \\sin\\theta&\\cos\\theta\\end{bmatrix}$，只差一个倍数。把 $c+di$ 写成 $r(\\cos\\theta+i\\sin\\theta)$（$r$ 是点到原点的距离，$\\theta$ 是与实轴的夹角），矩阵就恰好是 $r$ 乘上那个旋转矩阵。用大白话说：<b>乘以一个复数，等价于把整个平面转一个角、再把所有长度按比例拉一下</b>。" },
    { t: "p", html: "顺便把三个基本概念一次说清。<b>共轭</b>（complex conjugate）是把虚部取反：$\\bar z=a-bi$，几何上是关于实轴做镜像。<b>模长</b>是点到原点的距离：$|z|=\\sqrt{a^2+b^2}$，而且 $|z|^2=z\\bar z$。这两条合起来给出除法：$z^{-1}=\\bar z/|z|^2$，因为 $z\\bar z$ 是实数，除以它不改变方向。" },
    { t: "p", html: "还有一件事必须提前说：复数<b>不能比大小</b>。$3+2i$ 与 $1-5i$ 谁大谁小，没有定义。所以凡是依赖「序」的结论（比如不等式、最大最小值），在复数里都要先换成模长或者实数部分再说。这一点在后面判断正交时很关键——复向量之间没有「夹角」，但可以有垂直。" },
    { t: "p", html: "最后登场的是本章最重要的一条公式。把指数函数 $e^x$、$\\cos x$、$\\sin x$ 的泰勒级数写出来，把 $x$ 换成 $i\\theta$，利用 $i^2=-1,\\ i^3=-i,\\ i^4=1$ 的循环，实部正好凑成 $\\cos\\theta$，虚部正好凑成 $\\sin\\theta$。于是有<b>欧拉公式</b>（Euler's formula）：" },
    { t: "tex", tex: "e^{i\\theta}=\\cos\\theta+i\\sin\\theta", caption: "欧拉公式：单位圆上的点，用指数写出来" },
    { t: "p", html: "它在说什么？$e^{i\\theta}$ 就是单位圆上辐角为 $\\theta$ 的那个点。代入 $\\theta=\\pi$ 得 $e^{i\\pi}=\\cos\\pi+i\\sin\\pi=-1$，也就是那个著名的 $e^{i\\pi}+1=0$；代入 $\\theta=\\pi/2$ 得 $e^{i\\pi/2}=i$，正是本章开头那个「转 $90^\\circ$」。用大白话说：<b>指数函数和三角函数是同一件事，只是从不同的侧面看</b>。这一步把「转角度」变成了「指数相加」，后面 FFT 的全部便利都来自这个改写。" },
    { t: "theorem", name: "Euler's Formula", zh: "欧拉公式与复数乘法", rows: [
      { k: "白话", html: "$e^{i\\theta}$ 是单位圆上转过 $\\theta$ 角的点；两个复数相乘，模长相乘、辐角相加。" },
      { k: "结论", html: "$e^{i\\theta}=\\cos\\theta+i\\sin\\theta$，且 $(r_1e^{i\\theta_1})(r_2e^{i\\theta_2})=r_1r_2\\,e^{i(\\theta_1+\\theta_2)}$。" },
      { k: "为什么", html: "把两个单位复数按三角形式乘开，用和角公式：$(\\cos\\theta_1+i\\sin\\theta_1)(\\cos\\theta_2+i\\sin\\theta_2)$ 的实部是 $\\cos\\theta_1\\cos\\theta_2-\\sin\\theta_1\\sin\\theta_2=\\cos(\\theta_1+\\theta_2)$，虚部是 $\\sin\\theta_1\\cos\\theta_2+\\cos\\theta_1\\sin\\theta_2=\\sin(\\theta_1+\\theta_2)$。" },
      { k: "用法", html: "算高次幂、开方、把三角恒等式变成指数运算，都走这条路：先化成 $re^{i\\theta}$，幂次变成乘法 $r^ne^{in\\theta}$。" }
    ]},
    { t: "callout", kind: "warn", title: "最常见的三个错",
      html: "<p><b>错法一</b>：把 $i$ 当成「$\\sqrt{-1}$ 的正根」，于是写 $\\sqrt{-1}\\cdot\\sqrt{-1}=\\sqrt{(-1)(-1)}=1$。错在哪？根式法则 $\\sqrt a\\sqrt b=\\sqrt{ab}$ 只在 $a,b$ 非负时成立，复数开方是多值的，不能这样搬。正确做法：$i^2=-1$ 是定义，任何乘法都先展开再换 $i^2=-1$。</p><p><b>错法二</b>：认为 $i$ 和 $-i$ 有「谁是正的那个」之分。没有。它们在复平面上关于实轴对称，地位完全平等，交换它们不会改变任何等式。</p><p><b>错法三</b>：给复数列不等式，比如写 $z\\gt 0$。复平面上没有大小，只有模长可以比较；想说「在右半平面」就写 $\\operatorname{Re}z\\gt 0$。</p>" },
    { t: "example", no: "9.1", tag: "极坐标算高次幂", fields: [
      { k: "题目", html: "计算 $(1+i)^8$ 与 $\\dfrac{1}{1+i}$，并把结果写成 $a+bi$。" },
      { k: "思路", html: "幂很高，别硬展开，先化成极坐标 $re^{i\\theta}$；除法用共轭有理化，再用极坐标核对。" },
      { k: "解答", html: "$1+i$ 的模是 $\\sqrt{1^2+1^2}=\\sqrt2$，辐角是 $45^\\circ=\\pi/4$，所以 $1+i=\\sqrt2\\,e^{i\\pi/4}$。于是 $(1+i)^8=(\\sqrt2)^8e^{i8\\cdot\\pi/4}=2^4e^{i2\\pi}=16$。用展开核对：$(1+i)^2=2i$，$(1+i)^4=(2i)^2=-4$，$(1+i)^8=(-4)^2=16$，两条路一致。再算倒数：$\\dfrac{1}{1+i}=\\dfrac{1-i}{(1+i)(1-i)}=\\dfrac{1-i}{2}=\\dfrac12-\\dfrac12 i$。" },
      { k: "点评", html: "低次幂直接展开更稳，高次幂必须走极坐标。两条路都算一遍是检验的好习惯：极坐标快但容易在角度上出错，展开慢但每一步都可查。" }
    ]},
    { t: "quiz", qid: "ch09-q1" },

    // ============================================================ s2
    { t: "h", lvl: 2, text: "§9.1 复数与复向量", id: "ch09-s2" },
    { t: "p", lead: true, html: "上一节把单个复数讲透了。现在把 $n$ 个复数排成一列，就得到<b>复向量</b>（complex vector）。这一节要回答一个问题：向量变成复的以后，长度和正交这两件事还成立吗？答案是有惊无险——公式要改一个地方，改完以后全部成立。" },
    { t: "p", html: "$\\mathbb{C}^n$ 就是「$n$ 个复数排成的列向量」的全体，例如 $\\mathbf{v}=\\begin{bmatrix}1+i\\\\2-3i\\end{bmatrix}\\in\\mathbb{C}^2$。加法照旧逐分量相加；数乘的「数」现在允许是复数：用 $c\\in\\mathbb{C}$ 乘 $\\mathbf{v}$，就是把每个分量都乘上 $c$。几何上，一次复数量乘让整个向量的所有分量<b>同步</b>旋转同一个角、伸缩同一个倍数。所以 $\\mathbb{C}^n$ 里的数乘比 $\\mathbb{R}^n$ 里的更「整齐」：实数只能拉伸或翻转方向，复数还能把整束分量一起转。用大白话说：$\\mathbb{C}^n$ 与 $\\mathbb{R}^{2n}$ 作为集合差不多大，但 $\\mathbb{C}^n$ 多了一个「乘 $i$ 就整体转 $90^\\circ$」的动作。" },
    { t: "p", html: "线性组合、张成、线性无关、基、维数——这些定义一个字都不用改，只是标量范围从 $\\mathbb{R}$ 换成 $\\mathbb{C}$。比如 $\\mathbb{C}^2$ 的一组基可以是 $\\begin{bmatrix}1\\\\0\\end{bmatrix}$ 与 $\\begin{bmatrix}0\\\\1\\end{bmatrix}$，也可以是 $\\begin{bmatrix}1\\\\ i\\end{bmatrix}$ 与 $\\begin{bmatrix}1\\\\-i\\end{bmatrix}$。判断线性无关的办法也没变：解 $c_1\\mathbf{v}_1+\\cdots+c_k\\mathbf{v}_k=\\mathbf{0}$，看是否只有全零解。" },
    { t: "p", html: "麻烦出在长度上。在 $\\mathbb{R}^n$ 里我们定义 $\\lVert\\mathbf{v}\\rVert^2=\\mathbf{v}^{\\mathsf T}\\mathbf{v}=v_1^2+\\cdots+v_n^2$。照抄到复数会立刻出事：取 $\\mathbf{v}=\\begin{bmatrix}1\\\\ i\\end{bmatrix}$，则 $v_1^2+v_2^2=1+i^2=1-1=0$。一个明明不是零的向量，长度算出 $0$。再取 $\\mathbf{v}=\\begin{bmatrix}1\\\\2i\\end{bmatrix}$，平方和是 $1+4i^2=-3$，长度的平方是负数，更荒唐。" },
    { t: "p", html: "问题出在「平方」上。复数的平方不一定非负，但<b>模长的平方</b> $|z|^2=z\\bar z$ 一定非负。所以正确的长度定义要给每个分量配一个共轭：" },
    { t: "tex", tex: "\\lVert\\mathbf{v}\\rVert^2=|v_1|^2+\\cdots+|v_n|^2=v_1\\bar v_1+\\cdots+v_n\\bar v_n", caption: "复向量的长度：每个分量先取模再平方" },
    { t: "p", html: "把这件事写成内积，就得到复内积的定义。对 $\\mathbf{u},\\mathbf{v}\\in\\mathbb{C}^n$，" },
    { t: "tex", tex: "\\mathbf{u}^{\\mathsf H}\\mathbf{v}=\\bar u_1v_1+\\bar u_2v_2+\\cdots+\\bar u_nv_n", caption: "复内积（Hermitian inner product）：第一个向量取共轭" },
    { t: "p", html: "符号解释：$\\bar u_j$ 是 $u_j$ 的共轭；$\\mathsf H$ 读作「Hermite 转置」，意思是「先转置、再取共轭」，所以 $\\mathbf{u}^{\\mathsf H}$ 是一个行向量 $[\\bar u_1,\\ \\bar u_2,\\ \\dots,\\ \\bar u_n]$。注意共轭加在<b>第一个</b>向量上，这是数学与物理的通行约定；加在第二个上也能建立理论，只是所有公式的共轭位置会整体镜像。本站全书统一加在第一个上。" },
    { t: "p", html: "这个内积有三条性质，和实内积一一对应。第一，$\\mathbf{v}^{\\mathsf H}\\mathbf{v}=\\lVert\\mathbf{v}\\rVert^2\\ge0$，而且等号只在 $\\mathbf{v}=\\mathbf{0}$ 时成立——「正定」。第二，交换两个向量会得到共轭：$\\mathbf{v}^{\\mathsf H}\\mathbf{u}=\\overline{\\mathbf{u}^{\\mathsf H}\\mathbf{v}}$；交换前后一般不再相等，只差一个共轭（实数时共轭不改变数值，所以看起来是对称的）。第三，对第二个向量是线性的：$\\mathbf{u}^{\\mathsf H}(c\\mathbf{v})=c\\,\\mathbf{u}^{\\mathsf H}\\mathbf{v}$；对第一个向量则是共轭线性。这三条合起来，就叫 $\\mathbb{C}^n$ 上的内积空间。" },
    { t: "p", html: "有了内积，正交的定义照抄：$\\mathbf{u}^{\\mathsf H}\\mathbf{v}=0$ 就说 $\\mathbf{u}$ 与 $\\mathbf{v}$ 正交（orthogonal）。注意这里的「等于 $0$」是一个复数等于 $0$，需要实部虚部同时为零，条件比实数情形更强。" },
    { t: "example", no: "9.2", tag: "共轭决定正交性", fields: [
      { k: "题目", html: "设 $\\mathbf{u}=\\begin{bmatrix}1\\\\ i\\end{bmatrix}$，$\\mathbf{v}=\\begin{bmatrix}i\\\\1\\end{bmatrix}$。求 $\\lVert\\mathbf{u}\\rVert$，判断两向量是否正交；再用不带共轭的 $\\mathbf{u}^{\\mathsf T}\\mathbf{v}$ 算一遍，看会发生什么。" },
      { k: "思路", html: "按定义逐项算 $\\bar u_jv_j$；对照 $\\mathbf{u}^{\\mathsf T}\\mathbf{v}=u_1v_1+u_2v_2$ 找差别。" },
      { k: "解答", html: "$\\mathbf{u}^{\\mathsf H}\\mathbf{v}=\\bar1\\cdot i+\\bar i\\cdot1= i+(-i)\\cdot1=i-i=0$，所以两向量正交。$\\lVert\\mathbf{u}\\rVert^2=\\bar1\\cdot1+\\bar i\\cdot i=1+1=2$，故 $\\lVert\\mathbf{u}\\rVert=\\sqrt2$。若误用 $\\mathbf{u}^{\\mathsf T}\\mathbf{v}=1\\cdot i+i\\cdot1=2i\\ne0$，就会把一对正交向量判成不正交。" },
      { k: "点评", html: "两个分量长得几乎一样（只是交换了位置并带一个 $i$），却是正交的。这在实向量里很难想象，在复向量里很常见：正交看的是「内积是否为 $0$」，不是「长得像不像」。" }
    ]},
    { t: "p", html: "再给一组标准正交基，后面构造酉矩阵要用。取 $\\mathbf{q}_1=\\frac{1}{\\sqrt2}\\begin{bmatrix}1\\\\ i\\end{bmatrix}$ 与 $\\mathbf{q}_2=\\frac{1}{\\sqrt2}\\begin{bmatrix}1\\\\-i\\end{bmatrix}$。两条都验证一下：$\\mathbf{q}_1^{\\mathsf H}\\mathbf{q}_1=\\frac12(1\\cdot1+\\bar i\\cdot i)=\\frac12(1+1)=1$；$\\mathbf{q}_1^{\\mathsf H}\\mathbf{q}_2=\\frac12(\\bar1\\cdot1+\\bar i\\cdot(-i))=\\frac12(1+(-i)(-i))=\\frac12(1+i^2)=0$。两个长度 $1$、彼此正交的向量，就是 $\\mathbb{C}^2$ 的一组<b>标准正交基</b>（orthonormal basis）。" },
    { t: "callout", kind: "tip", title: "一个记忆钩子",
      html: "<p>复内积的共轭位置，可以记成「<b>左边取共轭，长度才为正</b>」。因为 $\\mathbf{v}^{\\mathsf H}\\mathbf{v}=\\sum|v_j|^2$ 是「自己跟自己的内积」，共轭必须落在左边，才能保证每一项都是 $|v_j|^2$。如果哪天忘了共轭该加在哪边，就回到这一条检验：只有加在左边，$\\mathbf{v}^{\\mathsf H}\\mathbf{v}$ 才是实数且非负。</p>" },
    { t: "quiz", qid: "ch09-q2" },
    { t: "quiz", qid: "ch09-q3" },
    // ============================================================ s3
    { t: "h", lvl: 2, text: "§9.1 复矩阵、共轭转置与内积", id: "ch09-s3" },
    { t: "p", lead: true, html: "复矩阵就是每个元素都是复数的矩阵。加法、乘法、矩阵乘向量的公式一个字都不用改——只要你会算复数乘法和加法。真正需要升级的只有一个动作：转置。在实数里转置把行换成列；在复数里，光换位置不够，还得把每个元素取共轭。" },
    { t: "p", html: "定义是这样的：设 $A$ 是 $m\\times n$ 的复矩阵，元素为 $a_{ij}$。它的<b>共轭转置</b>（conjugate transpose）$A^{\\mathsf H}$ 是 $n\\times m$ 矩阵，第 $(j,i)$ 个元素是 $\\bar a_{ij}$。用符号写就是" },
    { t: "tex", tex: "A^{\\mathsf H}=(\\bar A)^{\\mathsf T}=\\overline{A^{\\mathsf T}}", caption: "先共轭再转置，或者先转置再共轭，结果一样" },
    { t: "p", html: "举个例子，$A=\\begin{bmatrix}1&i\\\\ 2+i&3\\end{bmatrix}$，则 $A^{\\mathsf H}=\\begin{bmatrix}1&2-i\\\\ -i&3\\end{bmatrix}$：位置换了，每个元素还取了共轭。$1$ 与 $3$ 是实数，共轭后不变；$i$ 变成 $-i$；$2+i$ 变成 $2-i$。对实矩阵，共轭不改变任何元素，$A^{\\mathsf H}$ 就退化成普通的转置 $A^{\\mathsf T}$。" },
    { t: "p", html: "共轭转置的运算规则和转置几乎一模一样，只有一条要调换顺序：" },
    { t: "list", items: [
      "$(A^{\\mathsf H})^{\\mathsf H}=A$：转两次回来。",
      "$(A+B)^{\\mathsf H}=A^{\\mathsf H}+B^{\\mathsf H}$：加法可以逐项处理。",
      "$(AB)^{\\mathsf H}=B^{\\mathsf H}A^{\\mathsf H}$：乘法要<b>反序</b>，和 $(AB)^{\\mathsf T}=B^{\\mathsf T}A^{\\mathsf T}$ 同理。",
      "$(A^{\\mathsf H})^{-1}=(A^{-1})^{\\mathsf H}$：可逆矩阵的共轭转置，逆就是逆的共轭转置。"
    ]},
    { t: "p", html: "为什么偏偏是「共轭 + 转置」而不是只用转置？因为只有这样，矩阵才能从内积的一边搬到另一边。对任意 $\\mathbf{x}\\in\\mathbb{C}^n$、$\\mathbf{y}\\in\\mathbb{C}^m$，有" },
    { t: "tex", tex: "(A\\mathbf{x})^{\\mathsf H}\\mathbf{y}=\\mathbf{x}^{\\mathsf H}(A^{\\mathsf H}\\mathbf{y})" },
    { t: "p", html: "这条等式是实矩阵版本 $(A\\mathbf{x})^{\\mathsf T}\\mathbf{y}=\\mathbf{x}^{\\mathsf T}(A^{\\mathsf T}\\mathbf{y})$ 的复版。它看起来只是符号搬运，实际上撑起了整本书后面所有「投影」「正交化」「最小二乘」的推导。你可以在草稿纸上用 $2\\times2$ 的具体数字验证一遍：两边算出的都是同一个复数，这是共轭转置存在的理由。" },
    { t: "p", html: "有了它，四个基本子空间可以整个搬到 $\\mathbb{C}^n$ 里。列空间 $C(A)$ 与零空间 $N(A)$ 的定义不变；正交关系变成" },
    { t: "tex", tex: "C(A)\\perp N(A^{\\mathsf H}),\\qquad N(A)\\perp C(A^{\\mathsf H})" },
    { t: "p", html: "用大白话说：消掉 $A$ 的那些方向（左零空间 $N(A^{\\mathsf H})$）垂直于 $A$ 的列空间；被 $A$ 送到零的那些方向（零空间）垂直于 $A^{\\mathsf H}$ 的列空间。维数关系也照旧：若 $A$ 是 $m\\times n$、秩为 $r$，则 $\\dim C(A)=r$、$\\dim N(A)=n-r$。整个第 3 章的基本定理在复数上原样成立。" },
    { t: "terms", cols: 2, items: [
      { en: "complex conjugate", zh: "复共轭", html: "把虚部取反：$\\bar z=a-bi$。几何上是关于实轴的镜像。" },
      { en: "conjugate transpose", zh: "共轭转置", html: "先转置再取共轭，记作 $A^{\\mathsf H}$；实矩阵时就是转置。" },
      { en: "Hermitian inner product", zh: "复内积", html: "$\\mathbf{u}^{\\mathsf H}\\mathbf{v}=\\sum\\bar u_jv_j$；第一个向量取共轭，保证自己与自己的内积非负。" },
      { en: "orthonormal basis", zh: "标准正交基", html: "两两正交且长度都是 $1$ 的一组基；在 $\\mathbb{C}^n$ 里用复内积判定。" }
    ]},
    { t: "example", no: "9.3", tag: "共轭转置与正交列", fields: [
      { k: "题目", html: "设 $A=\\begin{bmatrix}1&i\\\\ i&1\\end{bmatrix}$。求 $A^{\\mathsf H}$ 与 $A^{\\mathsf H}A$；判断 $A$ 是不是 Hermite 矩阵；$A$ 的两列在复内积下是否正交？" },
      { k: "思路", html: "先逐元素取共轭再转置；然后做矩阵乘法，注意 $i\\cdot i=-1$；正交性看 $\\mathbf{c}_1^{\\mathsf H}\\mathbf{c}_2$。" },
      { k: "解答", html: "逐元素取共轭得 $\\bar A=\\begin{bmatrix}1&-i\\\\ -i&1\\end{bmatrix}$，它恰好是对称的，所以 $A^{\\mathsf H}=\\begin{bmatrix}1&-i\\\\ -i&1\\end{bmatrix}\\ne A$——$A$ 不是 Hermite 矩阵（非对角元 $i$ 与 $\\bar i=-i$ 不相等）。再算 $A^{\\mathsf H}A=\\begin{bmatrix}1&-i\\\\ -i&1\\end{bmatrix}\\begin{bmatrix}1&i\\\\ i&1\\end{bmatrix}=\\begin{bmatrix}1+1&i-i\\\\ -i+i&1+1\\end{bmatrix}=\\begin{bmatrix}2&0\\\\ 0&2\\end{bmatrix}=2I$。所以两列正交，且各自长度平方为 $2$，即长度为 $\\sqrt2$。" },
      { k: "点评", html: "$A^{\\mathsf H}A=2I$ 说明 $A/\\sqrt2$ 是一个酉矩阵（下一节的主角）。这也提醒我们：$A^{\\mathsf H}A$ 是对角的，等价于「$A$ 的列在复内积下两两正交」——和实矩阵的 $A^{\\mathsf T}A$ 完全同构。" }
    ]},
    { t: "quiz", qid: "ch09-q4" },

    // ============================================================ s4
    { t: "h", lvl: 2, text: "§9.2 Hermite 矩阵与酉矩阵", id: "ch09-s4" },
    { t: "p", lead: true, html: "第 6 章有一个漂亮的结论：实对称矩阵一定有实特征值，而且特征向量可以选成一组标准正交基。这一节要问：到了复数，谁扮演「对称」的角色？答案叫 Hermite 矩阵；谁扮演「正交」的角色？答案叫酉矩阵。而谱定理会原封不动地再出现一次。" },
    { t: "p", html: "定义很直接：若复方阵满足 $A^{\\mathsf H}=A$，就称它是 <b>Hermite 矩阵</b>（Hermitian matrix），也叫埃尔米特矩阵。这个条件分两部分：对角元必须满足 $a_{ii}=\\bar a_{ii}$，也就是对角元必须是<b>实数</b>；不在对角线上的两个元素必须共轭对称，即 $a_{ij}=\\bar a_{ji}$。实对称矩阵满足这两个条件（实数的共轭是自己），所以实对称是 Hermite 的特例。" },
    { t: "p", html: "为什么非要跑到复数里来？因为实矩阵也可能有复特征值。看旋转矩阵 $R=\\begin{bmatrix}0&-1\\\\ 1&0\\end{bmatrix}$：它把每个向量转 $90^\\circ$，没有任何实向量在转完之后还留在原地，所以它<b>没有实特征值</b>。算一下 $\\det(R-\\lambda I)=\\lambda^2+1$，根是 $\\lambda=\\pm i$。也就是说，实矩阵的特征值可能住在复平面上。想让「特征值」这套理论完整，就必须允许复数出场——这正是这一章存在的最实在的理由。" },
    { t: "theorem", name: "Spectral Theorem (Complex)", zh: "Hermite 矩阵的谱定理", rows: [
      { k: "白话", html: "Hermite 矩阵和实对称矩阵一样好：特征值全是实数，特征向量可以选成一组标准正交基。" },
      { k: "条件", html: "$A$ 是 $n\\times n$ 复矩阵，且 $A^{\\mathsf H}=A$。" },
      { k: "结论", html: "$A=Q\\Lambda Q^{\\mathsf H}$，其中 $Q$ 是酉矩阵（列是一组标准正交基），$\\Lambda=\\operatorname{diag}(\\lambda_1,\\dots,\\lambda_n)$ 的对角元全是实数。" },
      { k: "证明（特征值实）", html: "设 $A\\mathbf{x}=\\lambda\\mathbf{x}$，$\\mathbf{x}\\ne\\mathbf{0}$。左乘 $\\mathbf{x}^{\\mathsf H}$ 得 $\\lambda\\,\\mathbf{x}^{\\mathsf H}\\mathbf{x}=\\mathbf{x}^{\\mathsf H}A\\mathbf{x}$。对这个等式整体取共轭转置（注意左边是复数乘以正实数，右边是 $1\\times1$ 的数）：$\\bar\\lambda\\,\\mathbf{x}^{\\mathsf H}\\mathbf{x}=(\\mathbf{x}^{\\mathsf H}A\\mathbf{x})^{\\mathsf H}=\\mathbf{x}^{\\mathsf H}A^{\\mathsf H}\\mathbf{x}=\\mathbf{x}^{\\mathsf H}A\\mathbf{x}=\\lambda\\,\\mathbf{x}^{\\mathsf H}\\mathbf{x}$。因为 $\\mathbf{x}^{\\mathsf H}\\mathbf{x}=\\lVert\\mathbf{x}\\rVert^2\\gt 0$，两边约掉得 $\\lambda=\\bar\\lambda$，即 $\\lambda$ 是实数。" },
      { k: "证明（特征向量正交）", html: "设 $A\\mathbf{x}_1=\\lambda_1\\mathbf{x}_1$，$A\\mathbf{x}_2=\\lambda_2\\mathbf{x}_2$，$\\lambda_1\\ne\\lambda_2$。由 $\\lambda_1\\mathbf{x}_2^{\\mathsf H}\\mathbf{x}_1=\\mathbf{x}_2^{\\mathsf H}A\\mathbf{x}_1=(A\\mathbf{x}_2)^{\\mathsf H}\\mathbf{x}_1=\\lambda_2\\mathbf{x}_2^{\\mathsf H}\\mathbf{x}_1$（最后一步用了 $\\lambda_2$ 是实数），移项得 $(\\lambda_1-\\lambda_2)\\mathbf{x}_2^{\\mathsf H}\\mathbf{x}_1=0$。系数不为零，所以 $\\mathbf{x}_2^{\\mathsf H}\\mathbf{x}_1=0$，两特征向量正交。" },
      { k: "用法", html: "看到 Hermite 矩阵，就立刻想「它能被一组标准正交的特征向量对角化」；这就是复版本的 $A=Q\\Lambda Q^{\\mathsf T}$。" }
    ]},
    { t: "p", html: "接着定义酉矩阵。若复方阵满足 $U^{\\mathsf H}U=I$，就称 $U$ 是<b>酉矩阵</b>（unitary matrix）。把它按列分块 $U=[\\mathbf{u}_1\\ \\cdots\\ \\mathbf{u}_n]$，条件 $U^{\\mathsf H}U=I$ 逐元素读出来是 $\\mathbf{u}_i^{\\mathsf H}\\mathbf{u}_j=\\delta_{ij}$：同一条列与自己内积为 $1$（长度 $1$），不同列内积为 $0$（正交）。所以<b>酉矩阵就是列向量构成一组标准正交基的矩阵</b>。由 $U^{\\mathsf H}U=I$ 两边取行列式还能推出 $U$ 可逆，且 $U^{-1}=U^{\\mathsf H}$——求逆只需要取共轭转置，这是酉矩阵最实用的性质。" },
    { t: "p", html: "酉矩阵有三条常用的性质，证明都很短，值得亲手写一遍。第一，<b>保长度</b>：$\\lVert U\\mathbf{x}\\rVert^2=(U\\mathbf{x})^{\\mathsf H}(U\\mathbf{x})=\\mathbf{x}^{\\mathsf H}U^{\\mathsf H}U\\mathbf{x}=\\mathbf{x}^{\\mathsf H}\\mathbf{x}=\\lVert\\mathbf{x}\\rVert^2$。第二，<b>保内积</b>：直接算 $(U\\mathbf{x})^{\\mathsf H}(U\\mathbf{y})=\\mathbf{x}^{\\mathsf H}U^{\\mathsf H}U\\mathbf{y}=\\mathbf{x}^{\\mathsf H}\\mathbf{y}$，所以酉变换保持所有长度与角度不变——它是复空间里的「刚体运动」。第三，<b>特征值的模都是 $1$</b>：若 $U\\mathbf{x}=\\lambda\\mathbf{x}$，则 $\\lVert\\mathbf{x}\\rVert=\\lVert U\\mathbf{x}\\rVert=|\\lambda|\\,\\lVert\\mathbf{x}\\rVert$，约掉正数得 $|\\lambda|=1$，即每个特征值都落在复平面的单位圆上。" },
    { t: "table", head: ["", "实矩阵版本", "复矩阵版本"], caption: "把第 6、7 章的结论整体搬到复数：只换名字，不换结构", rows: [
      ["对称", "$A^{\\mathsf T}=A$", "$A^{\\mathsf H}=A$（Hermite）"],
      ["正交", "$Q^{\\mathsf T}Q=I$", "$Q^{\\mathsf H}Q=I$（酉）"],
      ["谱定理", "$A=Q\\Lambda Q^{\\mathsf T}$", "$A=Q\\Lambda Q^{\\mathsf H}$"],
      ["特征值", "实对称矩阵的特征值全实", "Hermite 矩阵的特征值全实"],
      ["特征值的模", "正交矩阵的特征值模为 $1$", "酉矩阵的特征值模为 $1$"],
      ["对角化", "可正交对角化 $A=Q\\Lambda Q^{\\mathsf T}$", "可酉对角化 $A=Q\\Lambda Q^{\\mathsf H}$"]
    ]},
    { t: "example", no: "9.4", tag: "判断 Hermite 并求实特征值", fields: [
      { k: "题目", html: "判断 $A=\\begin{bmatrix}2&1-i\\\\ 1+i&3\\end{bmatrix}$ 是不是 Hermite 矩阵，并求它的特征值。" },
      { k: "思路", html: "Hermite 看两条：对角元是不是实数，非对角元是不是互为共轭。特征值用迹与行列式。" },
      { k: "解答", html: "对角元 $2,3$ 都是实数 ✓。非对角元是 $1-i$ 与 $1+i$，而 $\\overline{1-i}=1+i$ ✓。所以 $A^{\\mathsf H}=A$，是 Hermite 矩阵。求特征值：$\\operatorname{tr}A=5$，$\\det A=2\\cdot3-(1-i)(1+i)=6-(1+1)=4$，特征多项式 $\\lambda^2-5\\lambda+4=0$，解得 $\\lambda=1$ 与 $\\lambda=4$，都是实数，和谱定理的保证一致。" },
      { k: "点评", html: "如果算出来是 $\\lambda=2\\pm3i$，那一定算错了，或者 $A$ 根本不是 Hermite——谱定理可以当检查工具用。另外注意 $\\det A$ 是实数且为正，说明 $A$ 还是正定的（两个特征值都是正数）。" }
    ]},
    { t: "lab", id: "transform" },
    { t: "p", html: "上面的实验台里可以拖动旋转、剪切、缩放这些线性变换。把它调到「旋转」那一档，你看到的就是乘以 $e^{i\\theta}=\\cos\\theta+i\\sin\\theta$ 的实矩阵版本：角度固定时它保长度、保角度，正是酉矩阵在二维实平面里的样子。这也解释了为什么酉矩阵被叫做复空间里的「旋转」：它不改变任何长度，只改变方向。" },
    { t: "quiz", qid: "ch09-q5" },
    // ============================================================ s5
    { t: "h", lvl: 2, text: "§9.3 快速傅里叶变换 FFT", id: "ch09-s5" },
    { t: "p", lead: true, html: "想象你录下一秒钟的声音，把它切成 $n=2^{20}$ 个采样点。你手里只有一串高低起伏的数字，却想知道「里面有哪些频率、各有多响」。把时间信号拆成频率成分，就是傅里叶变换要做的事。写成矩阵，它是一个 $n\\times n$ 的复矩阵乘一个向量；直接算要 $n^2$ 次乘法，约一万亿次。FFT 用一个分治技巧把它压到 $n\\log_2n$ 量级，约两千万次——差了五万倍。手机能实时处理音频，靠的就是这个差距。" },
    { t: "p", html: "先把「频率成分」写成公式。给定 $n$ 个数 $x_0,x_1,\\dots,x_{n-1}$（信号的采样值），取 $\\omega=e^{2\\pi i/n}$，它是单位圆上转过 $1/n$ 圈的点。定义" },
    { t: "tex", tex: "y_k=\\sum_{j=0}^{n-1}x_j\\,\\omega^{jk},\\qquad k=0,1,\\dots,n-1", caption: "离散傅里叶变换（DFT）：第 k 个输出是第 k 个频率成分的「含量」" },
    { t: "p", html: "符号说明：$j$ 是时间下标（第几个采样），$k$ 是频率下标（第几个成分），$\\omega^{jk}$ 是模为 $1$ 的复数，乘上它只是把 $x_j$ 转到某个角度。$y_0$ 是所有采样点的和（平均值方向），叫「零频」；$y_k$ 越大，说明信号里第 $k$ 个频率越强。这一步叫<b>离散傅里叶变换</b>（Discrete Fourier Transform，DFT）。" },
    { t: "p", html: "把上面的求和按 $k$ 排成矩阵，就得到<b>傅里叶矩阵</b>（Fourier matrix）$F_n$：第 $k$ 行第 $j$ 列的元素是 $\\omega^{jk}$，于是 $\\mathbf{y}=F_n\\mathbf{x}$，是一个标准的矩阵乘向量。关键问题来了：$F_n$ 的列有什么性质？直接算内积。第 $k$ 列与第 $l$ 列的内积（复内积，第一列取共轭）是" },
    { t: "tex", tex: "\\sum_{j=0}^{n-1}\\overline{\\omega^{jk}}\\,\\omega^{jl}=\\sum_{j=0}^{n-1}\\omega^{j(l-k)}" },
    { t: "p", html: "当 $k=l$ 时，每一项都是 $\\omega^0=1$，和为 $n$。当 $k\\ne l$ 时，这是一个等比数列，公比 $q=\\omega^{l-k}\\ne1$ 但 $q^n=(\\omega^n)^{l-k}=1$，由等比求和公式 $\\sum_{j=0}^{n-1}q^j=\\frac{1-q^n}{1-q}=0$。合并两种情况就是" },
    { t: "tex", tex: "\\sum_{j=0}^{n-1}\\omega^{j(l-k)}=\\begin{cases}n,&k=l\\\\ 0,&k\\ne l\\end{cases}", caption: "傅里叶矩阵的列两两正交，这就是 DFT 能「拆频率」的根本原因" },
    { t: "theorem", name: "Fourier Matrix", zh: "傅里叶矩阵与酉性", rows: [
      { k: "白话", html: "傅里叶矩阵的列是两两正交的，长度平方都是 $n$；除以 $\\sqrt n$ 以后它就是酉矩阵，可逆且保长度；未归一化的 DFT 会把长度平方放大 $n$ 倍。" },
      { k: "结论", html: "$F_n^{\\mathsf H}F_n=nI$，所以 $\\frac{1}{\\sqrt n}F_n$ 是酉矩阵，且 $F_n^{-1}=\\frac1nF_n^{\\mathsf H}$。" },
      { k: "为什么", html: "内积计算就是上面那个等比数列求和：$k=l$ 得 $n$，$k\\ne l$ 得 $0$。这不是巧合——它和第 4 章正交基展开、第 9 章酉矩阵是同一件事。" },
      { k: "用法", html: "逆变换不用重新推导：$\\mathbf{x}=\\frac1nF_n^{\\mathsf H}\\mathbf{y}$，也就是把同样的变换再做一遍、除以 $n$、并把 $\\omega$ 换成 $\\bar\\omega$。" }
    ]},
    { t: "p", html: "以 $n=4$ 为例，$\\omega=e^{2\\pi i/4}=i$，逐项写出来是" },
    { t: "tex", tex: "F_4=\\begin{bmatrix}1&1&1&1\\\\ 1&i&-1&-i\\\\ 1&-1&1&-1\\\\ 1&-i&-1&i\\end{bmatrix}" },
    { t: "p", html: "随手验一对列：第 2 列 $\\mathbf{c}_2=(1,i,-1,-i)$ 与第 4 列 $\\mathbf{c}_4=(1,-i,-1,i)$。内积 $\\bar{\\mathbf{c}}_2^{\\mathsf T}\\mathbf{c}_4=(1)(1)+(-i)(-i)+(-1)(-1)+(i)(i)=1+i^2+1+i^2=0$。四条列的长度平方都是 $4$，所以 $(1/2)F_4$ 是酉矩阵。写成大白话：DFT 把信号从「时间的坐标系」换到「频率的坐标系」，而这两个坐标系都是标准正交的，所以换过去不会丢信息，换回来只要「乘共轭再除以 $n$」。" },
    { t: "p", html: "理论上完美，可是直接算 $F_n\\mathbf{x}$ 要做 $n^2$ 次复数乘法。$n=2^{20}$ 时，$n^2=2^{40}\\approx10^{12}$，哪怕每秒十亿次也要上千秒。1970 年代之前，人们真的就这么硬算。FFT 的突破来自一个观察：$\\omega^{jk}$ 里有大量重复，把下标分成偶数与奇数两组，就能用两个「一半大小」的 DFT 拼出答案。" },
    { t: "p", html: "设 $n=2m$。把采样值分成偶数下标 $x_0,x_2,\\dots,x_{2m-2}$ 与奇数下标 $x_1,x_3,\\dots,x_{2m-1}$，分别做 $m$ 点 DFT，记结果为 $E_0,\\dots,E_{m-1}$ 与 $O_0,\\dots,O_{m-1}$。注意偶数下标的贡献 $x_{2r}\\omega^{2rk}=x_{2r}(\\omega^2)^{rk}$，而 $\\omega^2=e^{2\\pi i/m}$ 正好是 $m$ 点 DFT 的根，所以 $E_k$ 确实是偶数序列的 $m$ 点 DFT。奇数下标会多出一个因子 $\\omega^k$。合并公式是" },
    { t: "tex", tex: "y_k=E_k+\\omega^kO_k,\\qquad y_{k+m}=E_k-\\omega^kO_k,\\qquad k=0,1,\\dots,m-1", caption: "FFT 的蝶形合并：一半加、一半减，充分利用 $\\omega^{k+m}=-\\omega^k$" },
    { t: "p", html: "为什么第二个式子是减号？因为 $\\omega^{m}=e^{\\pi i}=-1$，所以 $\\omega^{k+m}=-\\omega^k$，原本的「加」就翻成了「减」。这段代码的形状是一个<b>蝶形</b>：两个输入、一个乘子、一加一减两个输出。递归地做下去：$n$ 点问题变成两个 $n/2$ 点问题，每个又变成两个 $n/4$ 点问题……直到 $1$ 点 DFT（就是不变）。每一层要做 $n/2$ 个蝶形（$n/2$ 次复数乘法与 $n$ 次加法），一共 $\\log_2 n$ 层，所以总代价是 $O(n\\log_2 n)$。" },
    { t: "p", html: "拿 $n=4$ 走一遍全过程，和矩阵乘法逐个对答案。四个采样 $x_0,x_1,x_2,x_3$，先分奇偶：偶数组 $(x_0,x_2)$ 的两点 DFT 是 $E_0=x_0+x_2$、$E_1=x_0-x_2$；奇数组 $(x_1,x_3)$ 的两点 DFT 是 $O_0=x_1+x_3$、$O_1=x_1-x_3$。再按蝶形合并：$y_0=E_0+O_0=x_0+x_1+x_2+x_3$，$y_2=E_0-O_0=x_0-x_1+x_2-x_3$，$y_1=E_1+iO_1=x_0+ix_1-x_2-ix_3$，$y_3=E_1-iO_1=x_0-ix_1-x_2+ix_3$。把 $F_4$ 的行与 $(x_0,x_1,x_2,x_3)$ 相乘，得到的结果一模一样。这就是 FFT：不是近似，是同一个变换的另一种算法。" },
    { t: "example", no: "9.5", tag: "4 点 DFT 手算与能量检验", fields: [
      { k: "题目", html: "求 $\\mathbf{x}=(1,1,1,1)$ 与 $\\mathbf{x}=(1,0,0,0)$ 的 4 点 DFT（不做归一化，即 $\\mathbf{y}=F_4\\mathbf{x}$），并验证 $\\lVert\\mathbf{y}\\rVert^2=4\\lVert\\mathbf{x}\\rVert^2$。" },
      { k: "思路", html: "直接按 $y_k=\\sum x_j i^{jk}$ 算；能量关系来自 $F_4^{\\mathsf H}F_4=4I$。" },
      { k: "解答", html: "对 $(1,1,1,1)$：$y_0=1+1+1+1=4$，$y_1=1+i-1-i=0$，$y_2=1-1+1-1=0$，$y_3=1-i-1+i=0$，所以 $\\mathbf{y}=(4,0,0,0)$——常数信号只有零频成分，符合直觉。对 $(1,0,0,0)$：每一列的第一个元素都是 $1$，所以四个输出都是 $1$，$\\mathbf{y}=(1,1,1,1)$。能量检验：第一种情况 $\\lVert\\mathbf{y}\\rVert^2=16=4\\cdot4$；第二种情况 $\\lVert\\mathbf{y}\\rVert^2=4=4\\cdot1$，都对。" },
      { k: "点评", html: "两个极端的例子恰好对偶：时域最「平」的信号在频域只有一个点，时域只有一个脉冲的信号在频域最「平」。这也是傅里叶变换最有用的直觉——越集中的东西，变换后越分散。" }
    ]},
    { t: "p", html: "FFT 的用处远不止信号处理，列几个你能直接感受到的：<b>音频压缩</b>把声音切段做频域分析，人耳听不见的高频系数直接丢掉；<b>图像压缩</b> JPEG 对每 $8\\times8$ 小块做类似变换，同样丢掉人眼不敏感的高频；<b>多项式乘法</b>把两个多项式的系数向量做 DFT，逐点相乘，再逆变换回来，$O(n\\log_2 n)$ 完成原本 $O(n^2)$ 的卷积；<b>快速求解</b>差分方程、卷积方程，也是同一套路。第 10 章 §10.5 会把离散的 DFT 推广到连续函数，得到傅里叶级数——那本质上是同一个正交展开，只是基从 $n$ 个复指数变成了无穷多个。" },
    { t: "callout", kind: "warn", title: "归一化的三个约定，别混用",
      html: "<p>DFT 的公式有至少三种写法，差别只在 $1/n$ 放在哪里：<b>(1)</b> 正变换不除、逆变换除 $n$（本节采用），此时 $F_n^{\\mathsf H}F_n=nI$；<b>(2)</b> 正变换除 $\\sqrt n$、逆变换也除 $\\sqrt n$，此时矩阵直接是酉的，能量完全守恒；<b>(3)</b> 正变换除 $n$、逆变换不除。三种都对，但混着用就会差一个 $n$ 倍。做题或读代码时，第一件事是先找到作者把 $1/n$ 放在了哪一边。</p><p>另外，$\\omega$ 的符号方向（$e^{+2\\pi i/n}$ 还是 $e^{-2\\pi i/n}$）也只是约定：两者互为共轭，逆变换自然会把方向换回来。看到公式里 $\\omega$ 的指数是 $+jk$ 还是 $-jk$，不要慌，认准「正变换与逆变换的 $\\omega$ 共轭」这一条即可。</p>" },

    // ============================================================ 结尾
    { t: "keypoint", items: [
      { title: "一句话", html: "复数乘法 = 旋转 + 伸缩；$i$ 是「转 $90^\\circ$」这个动作，$i^2=-1$ 是转两次的结果。" },
      { title: "一个修法", html: "复向量的长度与正交必须用共轭内积 $\\mathbf{u}^{\\mathsf H}\\mathbf{v}$；只改这一处，第 3、4、6 章的全部结论都能搬过来。" },
      { title: "两个替换", html: "实对称换成 Hermite（$A^{\\mathsf H}=A$），正交换成酉（$U^{\\mathsf H}U=I$）；谱定理变成 $A=Q\\Lambda Q^{\\mathsf H}$，特征值仍然全实。" },
      { title: "一台引擎", html: "傅里叶矩阵的列两两正交，$(1/\\sqrt n)F_n$ 是酉矩阵；FFT 用奇偶分治把 $n^2$ 压到 $n\\log_2 n$，是本章所有应用的发动机。" }
    ]},
    { t: "p", html: "离开之前，回头看一眼这一章做了什么：它没有推翻前面任何一章，只是把「转置」升级成「共轭转置」、把「正交」升级成「酉」。升级之后，实数的理论在复数里一个字不差地成立，还多出了傅里叶矩阵这种在实数里根本写不出来的好东西。下一章会看到它在七个真实场景里出现：图、电路、Markov 链、线性规划、傅里叶级数、图形学、密码学——它们全都是 $A\\mathbf{x}=\\mathbf{b}$ 与 $A\\mathbf{x}=\\lambda\\mathbf{x}$ 换了件衣服。" },
    { t: "checklist", id: "ch09-check", items: [
      "我能说出 $i$ 的几何意义，并解释 $i^2=-1$ 为什么是「转两次 $90^\\circ$」而不是硬性规定。",
      "我能把 $a+bi$ 化成 $re^{i\\theta}$，并用欧拉公式算 $(1+i)^8$ 这样的高次幂。",
      "我能说清为什么复向量的长度不能用 $\\mathbf{v}^{\\mathsf T}\\mathbf{v}$，并给出一个反例。",
      "我能用 $\\mathbf{u}^{\\mathsf H}\\mathbf{v}=0$ 判断两个复向量是否正交，并注意共轭加在第一个向量上。",
      "我能写出 $A^{\\mathsf H}$，并用 $(AB)^{\\mathsf H}=B^{\\mathsf H}A^{\\mathsf H}$ 检查乘法的顺序。",
      "我能判断一个矩阵是不是 Hermite、是不是酉，并说出各自的性质（特征值实 / 模为 $1$）。",
      "我能复述 Hermite 谱定理，并用「特征值实、特征向量正交」解释它的两条结论。",
      "我能写出 $F_4$，验证两列正交，并用奇偶分治手算 4 点 FFT。",
      "我能解释 FFT 为什么是 $O(n\\log_2n)$：每一层 $n/2$ 次乘法与 $n$ 次加法，共 $\\log_2n$ 层。"
    ]},
    { t: "quiz", qid: "ch09-q6" }
  ]
});
