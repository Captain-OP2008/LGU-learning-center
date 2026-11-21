/* =====================================================================
 * data/ch12.js · 第12章 向量值函数与空间运动（Vector-Valued Functions and Motion in Space）
 * 初学者版：先讲「为什么需要箭头函数」，再讲定义；每个符号首次出现都解释。
 * 内容：110 blocks / 0 定理 / 6 例题 / 1 公式 / 1 列表 / 2 实验台 / 0 演算台 / 10 内嵌题
 * ===================================================================== */
CSC.registerChapter({
 "id": "ch12",
 "num": "12",
 "title": "向量值函数与空间运动",
 "en": "Vector-Valued Functions and Motion in Space",
 "goals": [
  "说清向量值函数是什么，能对它求极限、求导、积分，并写出曲线在某点的切线。",
  "把位置、速度、加速度三者串成一条线：位置求导得速度，速度求导得加速度，反过来积分回去。",
  "会算空间曲线的弧长，理解为什么沿弧长求导能得到单位切向量 $\\mathbf T$。",
  "理解曲率 $\\kappa$ 在量什么，会算 $\\mathbf T,\\mathbf N,\\mathbf B$ 与曲率半径、曲率圆。",
  "能把加速度拆成“改变快慢”和“改变方向”两部分，并用抛体运动与极坐标描述真实运动。"
 ],
 "kp": [
  {
   "id": "ch12-1",
   "title": "先看一个例子：过山车上的三个箭头"
  },
  {
   "id": "ch12-2",
   "title": "12.1 位置、速度、加速度：把运动写成箭头"
  },
  {
   "id": "ch12-3",
   "title": "12.2 积分与抛体运动：把加速度积回去"
  },
  {
   "id": "ch12-4",
   "title": "12.3 弧长：沿着曲线量距离"
  },
  {
   "id": "ch12-5",
   "title": "12.4 曲率与法向量：曲线到底有多弯"
  },
  {
   "id": "ch12-6",
   "title": "12.5 加速度的分解与 TNB 标架"
  },
  {
   "id": "ch12-7",
   "title": "12.6 极坐标下的速度与加速度"
  }
 ],
 "blocks": [
  {
   "t": "callout",
   "kind": "why",
   "title": "这一章要解决什么问题",
   "html": "<p>坐过山车时，你的身体同时在感受三件事：速度有多快、方向朝哪边、转弯有多猛。轨道是一条空间曲线，而你的位置随时间不停变化——这就是本章要研究的东西：<b>运动</b>。</p><p>前面几章的函数 $y=f(x)$ 只能描述“一个数决定另一个数”。可现实里的运动是“时间决定一个位置”，而位置是一个箭头（向量）：它在 $x$ 方向走多远、$y$ 方向走多远、$z$ 方向走多远。于是我们需要一种新函数：吃进一个数 $t$，吐出一个向量。</p><p>本章要造的工具只有三件：<b>导数</b>（由位置得到速度和加速度）、<b>积分</b>（由加速度倒推位置）、<b>曲率</b>（量曲线弯得有多急）。学会它们，你就能算抛出去的球落在哪、过山车在第几秒最难受、行星绕太阳的轨道是什么形状。</p>"
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "开始前你需要知道",
   "html": "<ul><li><b>向量与叉积</b>：知道 $\\mathbf i,\\mathbf j,\\mathbf k$ 是三个方向的单位向量，会算点积和叉积。忘了就回看 <a href=\"#/ch11\">第 11 章</a>，本章的 $\\mathbf v\\times\\mathbf a$、$\\mathbf T\\times\\mathbf N$ 全靠叉积。</li><li><b>一元函数的求导与积分</b>：会算 $(t^2)'=2t$、$\\int t\\,dt=\\frac{t^2}{2}+C$，并且知道微积分基本定理（FTC）在说什么。见 <a href=\"#/ch03\">第 3 章</a> 与 <a href=\"#/ch05\">第 5 章</a>。</li><li><b>参数曲线</b>：知道 $x=f(t),\\ y=g(t)$ 可以把曲线画成一条轨迹。见 <a href=\"#/ch10\">第 10 章</a>；本章只是给这条轨迹再加一个 $z$ 分量。</li><li><b>极坐标</b>：知道 $(r,\\theta)$ 与 $(x,y)$ 的换算 $x=r\\cos\\theta,\\ y=r\\sin\\theta$。12.6 节会用到。</li></ul>"
  },
  {
   "t": "scope",
   "scope": "outside",
   "weeks": "—",
   "sections": "§12.1–12.6"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "先看一个例子：过山车上的三个箭头",
   "id": "ch12-s1"
  },
  {
   "t": "p",
   "html": "想象你坐上一列过山车，从起点出发。工程师想知道三件事，而这三件事恰好对应本章的三个核心量。<br><b>第一件：现在有多快？</b>注意“快”是标量，只有一个数；但“往哪个方向快”是箭头。所以真正的速度应该写成“速率 × 方向”，也就是一个<b>向量</b>。<br><b>第二件：正在往哪拐？</b>轨道弯了，你就被甩向一侧。弯得越急、开得越快，甩得越狠。描述“弯多急”的量叫<b>曲率</b>（curvature）。<br><b>第三件：加速度指向哪里？</b>加速度既可以让你变快变慢，也可以让你拐弯。本章最后一节会把它拆成两个互相垂直的分量，分别负责这两件事。"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "一句话",
     "html": "把位置写成<b>随时间变化的向量</b> $\\mathbf r(t)$，对它求导就得到速度，再求导得到加速度；反过来积分可以从加速度回到位置。"
    },
    {
     "title": "为什么值得学",
     "html": "这是微积分第一次离开“平面图像”，去描述真实的三维运动。物理、工程、动画里的运动轨迹都用这套语言。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "12.1 位置、速度、加速度：把运动写成箭头（Curves in Space and Their Tangents）",
   "id": "ch12-s2"
  },
  {
   "t": "p",
   "html": "一只蚂蚁在桌面上爬。你没法用 $y=f(x)$ 描述它的路线，因为它可能绕回来、可能原地转圈。但你可以在每一时刻 $t$ 记录它的位置：横坐标 $x$、纵坐标 $y$（在空间里再加一个高度 $z$）。于是位置就是一个随 $t$ 变化的向量，记作 $\\mathbf r(t)$。<br>$$\\mathbf r(t)=\\overrightarrow{OP}=f(t)\\,\\mathbf i+g(t)\\,\\mathbf j+h(t)\\,\\mathbf k,\\qquad x=f(t),\\ y=g(t),\\ z=h(t)$$逐字读一遍这个式子：$t$ 是<b>时间</b>（一个数）；$\\mathbf i,\\mathbf j,\\mathbf k$ 是 $x,y,z$ 三个方向的单位箭头；$f(t),g(t),h(t)$ 是三个普通的<b>标量函数</b>，分别告诉你此刻在三个方向上各走了多远。整个 $\\mathbf r(t)$ 叫<b>向量值函数</b>（vector-valued function）：它吃进一个数，吐出一个箭头。"
  },
  {
   "t": "callout",
   "kind": "tip",
   "title": "先想一想",
   "html": "<p>如果一只蚂蚁的位置是 $\\mathbf r(t)$，那么“它此刻在哪”和“它此刻往哪走”，哪一个只看 $\\mathbf r(t)$ 就能知道？</p><p>先记住这个问题，12.1 节后半段会回答：位置只告诉你“在哪”，要再加一个导数才能知道“往哪”。这就是速度的来历。</p>"
  },
  {
   "t": "p",
   "html": "$$\\lim_{t\\to t_0}\\mathbf r(t)=\\left(\\lim_{t\\to t_0}f(t)\\right)\\mathbf i+\\left(\\lim_{t\\to t_0}g(t)\\right)\\mathbf j+\\left(\\lim_{t\\to t_0}h(t)\\right)\\mathbf k$$向量函数的极限是<b>逐分量求</b>的：三个分量各自的极限都存在，整个向量极限才存在。连续也一样：$\\lim_{t\\to t_0}\\mathbf r(t)=\\mathbf r(t_0)$ 就说明三个分量同时在 $t_0$ 连续。换句话说，向量函数没有新花样，只是把一元的工具同时用在三个分量上。<br>现在来造导数。导数的老想法还记得吗？“函数值变了多少”除以“自变量变了多少”，再让分母趋近 0。把函数值换成箭头，分子就变成一个向量，但“除以一个数”仍然有意义（向量可以乘常数）。于是："
  },
  {
   "t": "p",
   "html": "$$\\mathbf r'(t)=\\frac{d\\mathbf r}{dt}=\\lim_{\\Delta t\\to 0}\\frac{\\mathbf r(t+\\Delta t)-\\mathbf r(t)}{\\Delta t}$$这个极限如果存在，就叫<b>导数</b>（derivative）。注意分子 $\\mathbf r(t+\\Delta t)-\\mathbf r(t)$ 是从旧位置指向新位置的<b>位移向量</b>，除以时间间隔 $\\Delta t$ 后，它表示“平均每秒位移多少”，方向与位移一致。"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "第一步：把差商写成分量",
     "html": "$\\dfrac{\\mathbf r(t+\\Delta t)-\\mathbf r(t)}{\\Delta t}=\\dfrac{f(t+\\Delta t)-f(t)}{\\Delta t}\\mathbf i+\\dfrac{g(t+\\Delta t)-g(t)}{\\Delta t}\\mathbf j+\\dfrac{h(t+\\Delta t)-h(t)}{\\Delta t}\\mathbf k$。"
    },
    {
     "title": "第二步：让 $\\Delta t\\to0$，三个分量各自变成一元导数",
     "html": "每个分量都是普通的一元差商，极限分别是 $f'(t),g'(t),h'(t)$。所以向量导数就是“逐分量求导”，没有新运算规则。"
    },
    {
     "title": "第三步：读几何意义",
     "html": "当 $\\Delta t\\to0$，点 $Q$ 沿曲线滑向点 $P$，割线 $PQ$ 就转成切线。于是 $\\mathbf r'(t_0)$ 是曲线在 $P$ 处的<b>切向量</b>，并且它的方向指向 $t$ 增大的方向，也就是<b>运动方向</b>。"
    }
   ]
  },
  {
   "t": "p",
   "html": "有了切向量，切线就好写了：过点 $\\mathbf r(t_0)$，方向用 $\\mathbf r'(t_0)$。注意这里 $s$ 是新的参数（不是时间），它只负责把直线上的点一个个标出来。"
  },
  {
   "t": "p",
   "html": "$$\\mathbf R(s)=\\mathbf r(t_0)+s\\,\\mathbf r'(t_0)\\quad\\Longleftrightarrow\\quad x=x_0+f'(t_0)s,\\ y=y_0+g'(t_0)s,\\ z=z_0+h'(t_0)s$$同样的道理，“位移”对时间求导是<b>速度</b>（velocity），“速度”对时间求导是<b>加速度</b>（acceleration）："
  },
  {
   "t": "p",
   "html": "$$\\mathbf v=\\frac{d\\mathbf r}{dt},\\qquad \\text{速率（speed）}=|\\mathbf v|,\\qquad \\mathbf a=\\frac{d\\mathbf v}{dt}=\\frac{d^2\\mathbf r}{dt^2}$$这里要分清两个词：<b>速度</b> $\\mathbf v$ 是箭头，既有快慢又有方向；<b>速率</b> $|\\mathbf v|$ 只是一个数，是速度箭头的长度。中文里常把两者混着说，读题时要看它要的是“速度”还是“速率”。"
  },
  {
   "t": "p",
   "html": "如果曲线的切向量连续、而且<b>永远不是零向量</b>，这条曲线就叫<b>光滑</b>（smooth）。零切向量意味着曲线在这里停住、拐出尖角，后面的曲率会算不下去。有限段光滑曲线首尾相接叫<b>分段光滑</b>（piecewise smooth），比如字母“V”。"
  },
  {
   "t": "table",
   "head": [
    "求导法则",
    "公式",
    "和标量有什么不同"
   ],
   "rows": [
    [
     "常向量",
     "$\\dfrac{d}{dt}\\mathbf C=\\mathbf 0$",
     "没有不同，常数的导数还是 0"
    ],
    [
     "数乘与函数乘",
     "$\\dfrac{d}{dt}[f(t)\\mathbf u]=f'\\mathbf u+f\\mathbf u'$；$\\dfrac{d}{dt}[c\\mathbf u]=c\\mathbf u'$",
     "就是普通乘积法则"
    ],
    [
     "和差",
     "$\\dfrac{d}{dt}(\\mathbf u\\pm\\mathbf v)=\\mathbf u'\\pm\\mathbf v'$",
     "逐分量相加"
    ],
    [
     "点积",
     "$\\dfrac{d}{dt}(\\mathbf u\\cdot\\mathbf v)=\\mathbf u'\\cdot\\mathbf v+\\mathbf u\\cdot\\mathbf v'$",
     "结果是一个数，但法则长得像乘积法则"
    ],
    [
     "叉积",
     "$\\dfrac{d}{dt}(\\mathbf u\\times\\mathbf v)=\\mathbf u'\\times\\mathbf v+\\mathbf u\\times\\mathbf v'$",
     "<b>顺序不能换</b>：叉积不满足交换律"
    ],
    [
     "链式法则",
     "$\\dfrac{d}{dt}\\mathbf u(f(t))=f'(t)\\,\\mathbf u'(f(t))$",
     "外层求导后还要乘内层导数"
    ]
   ]
  },
  {
   "t": "p",
   "html": "上表里最特别的一条是<b>常长度向量</b>。如果 $|\\mathbf r(t)|$ 一直不变（比如质点在球面上运动），那么位置向量和它的导数一定垂直："
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "从“长度不变”翻译成等式",
     "html": "$|\\mathbf r(t)|^2=\\mathbf r\\cdot\\mathbf r=$ 常数。"
    },
    {
     "title": "两边对 $t$ 求导",
     "html": "左边求导得 $\\dfrac{d}{dt}(\\mathbf r\\cdot\\mathbf r)=2\\mathbf r\\cdot\\mathbf r'$，右边常数的导数是 0，所以 $2\\mathbf r\\cdot\\mathbf r'=0$。"
    },
    {
     "title": "读出结论",
     "html": "$\\mathbf r\\cdot\\mathbf r'=0$，即位置向量与切向量垂直。直观上：如果运动方向有一点沿半径向外，长度就会变——长度不变，方向就只能切着走。"
    }
   ]
  },
  {
   "t": "tex",
   "tex": "|\\mathbf r(t)|\\equiv\\text{常数}\\quad\\Longrightarrow\\quad \\mathbf r\\cdot\\frac{d\\mathbf r}{dt}=0"
  },
  {
   "t": "quiz",
   "qid": "ch12-q1"
  },
  {
   "t": "quiz",
   "qid": "ch12-q2"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "符号都认识了吗",
     "html": "$\\mathbf r$ 位置、$\\mathbf v=\\mathbf r'$ 速度、$\\mathbf a=\\mathbf v'$ 加速度；$|\\mathbf v|$ 是速率（一个数）。"
    },
    {
     "title": "求导口诀",
     "html": "向量求导 = 逐分量求导。切线方向用 $\\mathbf r'(t_0)$，但它还不是单位向量。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "12.2 积分与抛体运动：把加速度积回去（Integrals of Vector Functions; Projectile Motion）",
   "id": "ch12-s3"
  },
  {
   "t": "p",
   "html": "12.1 是“位置 → 速度 → 加速度”往下走。实际题目常常反过来问：已知加速度（比如重力），求速度和位置。这时就要用积分，把箭头函数“积回去”。"
  },
  {
   "t": "p",
   "html": "$$\\int\\mathbf r(t)\\,dt=\\left(\\int f\\,dt\\right)\\mathbf i+\\left(\\int g\\,dt\\right)\\mathbf j+\\left(\\int h\\,dt\\right)\\mathbf k+\\mathbf C,\\qquad \\int_a^b\\mathbf r(t)\\,dt=\\mathbf R(b)-\\mathbf R(a)$$和标量一样，积分也是<b>逐分量</b>做。不定积分后面要加一个<b>常向量</b> $\\mathbf C=C_1\\mathbf i+C_2\\mathbf j+C_3\\mathbf k$；定积分的结果则是一个<b>常向量</b>（不是函数）。上面的 $\\mathbf R$ 是 $\\mathbf r$ 的任意一个原函数，第二个等号就是逐分量的微积分基本定理（FTC）。"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "初始问题长什么样",
     "html": "已知加速度 $\\dfrac{d^2\\mathbf r}{dt^2}=\\mathbf a(t)$，还知道出发时的位置 $\\mathbf r(0)=\\mathbf r_0$ 与初速度 $\\mathbf r'(0)=\\mathbf v_0$，要求 $\\mathbf r(t)$。"
    },
    {
     "title": "第一次积分：从加速度到速度",
     "html": "$\\mathbf v(t)=\\int\\mathbf a(t)\\,dt=\\mathbf A(t)+\\mathbf C_1$（$\\mathbf A$ 是某个原函数）。用 $\\mathbf v(0)=\\mathbf v_0$ 解出 $\\mathbf C_1$。"
    },
    {
     "title": "第二次积分：从速度到位置",
     "html": "$\\mathbf r(t)=\\int\\mathbf v(t)\\,dt=\\mathbf B(t)+\\mathbf C_2$。再用 $\\mathbf r(0)=\\mathbf r_0$ 解出 $\\mathbf C_2$。"
    },
    {
     "title": "为什么是两次",
     "html": "因为求导两次才能从位置得到加速度，所以反过来要积分两次；每次积分都冒出一个常向量，正好用两个初始条件各定一次。"
    }
   ]
  },
  {
   "t": "p",
   "html": "最能说明这套流程的，是<b>理想抛体运动</b>（ideal projectile motion）。把球斜着抛出去：忽略空气阻力，它只受一个竖直向下的重力加速度 $\\mathbf a=-g\\mathbf j$。设初速率为 $v_0$，发射角为 $\\alpha$（与水平面的夹角）。"
  },
  {
   "t": "tex",
   "tex": "\\mathbf v_0=(v_0\\cos\\alpha)\\,\\mathbf i+(v_0\\sin\\alpha)\\,\\mathbf j,\\qquad \\mathbf r_0=\\mathbf 0,\\qquad \\mathbf a=-g\\,\\mathbf j"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "第一次积分：加速度 → 速度",
     "html": "$\\mathbf v(t)=\\int(-g\\mathbf j)\\,dt=-gt\\,\\mathbf j+\\mathbf C_1$。代入 $t=0$ 得 $\\mathbf C_1=\\mathbf v_0$，所以 $\\mathbf v(t)=-(gt)\\mathbf j+\\mathbf v_0$。"
    },
    {
     "title": "第二次积分：速度 → 位置",
     "html": "$\\mathbf r(t)=\\int\\mathbf v(t)\\,dt=-\\tfrac12gt^2\\mathbf j+\\mathbf v_0t+\\mathbf C_2$。代入 $\\mathbf r(0)=\\mathbf 0$ 得 $\\mathbf C_2=\\mathbf 0$。"
    },
    {
     "title": "把初速度按分量拆开",
     "html": "水平方向 $v_0\\cos\\alpha$ 不变（没有水平加速度），竖直方向 $v_0\\sin\\alpha-gt$ 越减越小。把两个分量写回去就得到最后的位置公式。"
    }
   ]
  },
  {
   "t": "p",
   "html": "$$\\mathbf r(t)=\\big(v_0\\cos\\alpha\\big)t\\,\\mathbf i+\\Big(\\big(v_0\\sin\\alpha\\big)t-\\tfrac12gt^2\\Big)\\mathbf j$$写成坐标就是 $x=(v_0\\cos\\alpha)t$，$y=(v_0\\sin\\alpha)t-\\frac12gt^2$。从第一个式子解出 $t=\\dfrac{x}{v_0\\cos\\alpha}$，代进第二个式子，就得到轨迹方程——它是一条开口向下的<b>抛物线</b>："
  },
  {
   "t": "tex",
   "tex": "y=-\\frac{g}{2v_0^2\\cos^2\\alpha}\\,x^2+(\\tan\\alpha)\\,x"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "求最大高度：竖直速度变成 0 的时代",
     "html": "最高点时球不再上升，$\\dot y=v_0\\sin\\alpha-gt=0$，得 $t=\\dfrac{v_0\\sin\\alpha}{g}$。代回 $y$ 得 $y_{\\max}=\\dfrac{(v_0\\sin\\alpha)^2}{2g}$。"
    },
    {
     "title": "求飞行时间：落回同一水平面的时代",
     "html": "落地时 $y=0$，即 $t\\big(v_0\\sin\\alpha-\\tfrac12gt\\big)=0$，舍去 $t=0$（那是出发时刻），得 $t_{\\text{flight}}=\\dfrac{2v_0\\sin\\alpha}{g}$。"
    },
    {
     "title": "求射程：把飞行时间代进水平位置",
     "html": "$R=x(t_{\\text{flight}})=v_0\\cos\\alpha\\cdot\\dfrac{2v_0\\sin\\alpha}{g}=\\dfrac{v_0^2}{g}(2\\sin\\alpha\\cos\\alpha)=\\dfrac{v_0^2}{g}\\sin2\\alpha$。最后一步用了二倍角公式。"
    }
   ]
  },
  {
   "t": "p",
   "html": "$$y_{\\max}=\\frac{(v_0\\sin\\alpha)^2}{2g},\\qquad t_{\\text{flight}}=\\frac{2v_0\\sin\\alpha}{g},\\qquad R=\\frac{v_0^2}{g}\\sin2\\alpha$$注意这三个公式有一个共同前提：<b>从原点出发，最后落回同一高度的水平面</b>。如果发射点高度是 $Y_0$（比如从楼上往下扔），位置公式要改写，三个公式全部失效，要老老实实解二次方程。"
  },
  {
   "t": "p",
   "html": "$$\\mathbf r(t)=\\big(x_0+(v_0\\cos\\alpha)t\\big)\\,\\mathbf i+\\Big(Y_0+(v_0\\sin\\alpha)t-\\tfrac12gt^2\\Big)\\,\\mathbf j$$符号别混：$v_0$ 是<b>初速率</b>（单位 m/s），$Y_0$ 是<b>发射点的高度</b>（单位 m）；$x_0$ 只是水平起点，通常取 0。如果还有水平方向的风，把风的加速度并进去就行——竖直方向的积分完全不受影响。"
  },
  {
   "t": "quiz",
   "qid": "ch12-q3"
  },
  {
   "t": "quiz",
   "qid": "ch12-q4"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "流程",
     "html": "加速度积分一次得速度（用 $\\mathbf v_0$ 定常数），再积分一次得位置（用 $\\mathbf r_0$ 定常数）。"
    },
    {
     "title": "抛体三公式的用法",
     "html": "只适用于“从原点出发、落回同一高度”；否则回到 $y(t)=0$ 解二次方程。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "12.3 弧长：沿着曲线量距离（Arc Length in Space）",
   "id": "ch12-s4"
  },
  {
   "t": "p",
   "html": "开车走盘山公路，导航会告诉你“沿这条路走 12 公里”。可这条路的形状弯弯曲曲，12 公里不是两端之间的直线距离，而是<b>沿着曲线量出来的长度</b>。这个长度叫<b>弧长</b>（arc length）。怎么算？还是老套路：切小段、近似、求和、取极限。"
  },
  {
   "t": "p",
   "html": "$$L=\\int_a^b\\sqrt{\\left(\\frac{dx}{dt}\\right)^2+\\left(\\frac{dy}{dt}\\right)^2+\\left(\\frac{dz}{dt}\\right)^2}\\,dt=\\int_a^b|\\mathbf v(t)|\\,dt$$为什么被积函数是 $|\\mathbf v|$？把时间切成很小的一段 $dt$，这一小段里质点几乎沿直线走了 $d\\mathbf r=\\mathbf v\\,dt$，位移长度约为 $|\\mathbf v|\\,dt$。把所有小段的长度加起来，就是 $\\int|\\mathbf v|\\,dt$。所以在物理上，<b>弧长就是速率对时间的积分</b>——速率 5 m/s 走 3 秒，走的距离就是 15 米。"
  },
  {
   "t": "p",
   "html": "如果让终点可以移动，就得到<b>弧长函数</b>（arc length function）：从固定基点 $t_0$ 起，走到时刻 $t$ 一共走了多远。用 $\\tau$ 作积分变量，是因为 $t$ 已经用来当上限了。"
  },
  {
   "t": "p",
   "html": "$$s(t)=\\int_{t_0}^{t}|\\mathbf v(\\tau)|\\,d\\tau,\\qquad \\frac{ds}{dt}=|\\mathbf v(t)|\\gt 0$$$s$ 永远在增加（速率非负，除非停下来），所以 $s$ 与 $t$ 一一对应，可以反解出 $t=t(s)$。把 $t$ 换掉、改用 $s$ 当参数，就叫<b>弧长参数化</b>：这时“参数增加 1”恰好等于“沿曲线走了 1 米”。"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "目标：求 $\\dfrac{d\\mathbf r}{ds}$",
     "html": "我们想知道“沿曲线每走 1 米，位置向量怎么变”。按链式法则，$\\dfrac{d\\mathbf r}{ds}=\\dfrac{d\\mathbf r}{dt}\\cdot\\dfrac{dt}{ds}$。"
    },
    {
     "title": "算 $\\dfrac{dt}{ds}$",
     "html": "由 $\\dfrac{ds}{dt}=|\\mathbf v|\\gt0$，它的反函数导数是 $\\dfrac{dt}{ds}=\\dfrac{1}{|\\mathbf v|}$。"
    },
    {
     "title": "代回去",
     "html": "$\\dfrac{d\\mathbf r}{ds}=\\mathbf v\\cdot\\dfrac{1}{|\\mathbf v|}=\\dfrac{\\mathbf v}{|\\mathbf v|}$。右边正好是“方向单位化”，所以它是个单位向量。"
    }
   ]
  },
  {
   "t": "p",
   "html": "$$\\mathbf T=\\frac{\\mathbf v}{|\\mathbf v|}=\\frac{d\\mathbf r/dt}{ds/dt}=\\frac{d\\mathbf r}{ds}$$$\\mathbf T$ 叫<b>单位切向量</b>（unit tangent vector）。它丢掉了“走多快”的信息，只保留“朝哪走”，长度恒为 1。记住这句话：<b>对时间求导得到速度，对弧长求导得到单位切向量</b>。后面定义曲率时，就是看 $\\mathbf T$ 沿弧长怎么转。"
  },
  {
   "t": "quiz",
   "qid": "ch12-q5"
  },
  {
   "t": "quiz",
   "qid": "ch12-q6"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "两个公式",
     "html": "弧长 $L=\\int_a^b|\\mathbf v|\\,dt$，弧长函数 $s(t)=\\int_{t_0}^t|\\mathbf v|\\,d\\tau$，且 $\\dfrac{ds}{dt}=|\\mathbf v|$。"
    },
    {
     "title": "一个结论",
     "html": "$\\mathbf T=\\dfrac{d\\mathbf r}{ds}=\\dfrac{\\mathbf v}{|\\mathbf v|}$：它是单位向量，只表示方向。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "12.4 曲率与法向量：曲线到底有多弯（Curvature and Normal Vectors of a Curve）",
   "id": "ch12-s5"
  },
  {
   "t": "p",
   "html": "开车过弯时，你会感到两件事：方向盘转了多少、以及这个弯有多急。直线不用打方向；同样跑 100 米，小弯只需微调方向，急弯要打很多方向。<b>曲率</b>（curvature）就是把这个“弯的急缓”变成数字：它衡量<b>沿曲线每走单位长度，方向转动了多少</b>。"
  },
  {
   "t": "p",
   "html": "$$\\kappa=\\left|\\frac{d\\mathbf T}{ds}\\right|$$逐个符号读：$\\mathbf T$ 是 12.3 节算出的单位切向量，它只表示“朝哪走”；$s$ 是弧长（沿曲线走过的距离）；$\\dfrac{d\\mathbf T}{ds}$ 就是“每走 1 米，方向变了多少”。因为 $\\mathbf T$ 长度恒为 1，它只能转、不能变长，所以这个变化率纯粹反映转弯，取长度 $\\kappa$ 得到非负的数。$\\kappa$ 越大弯得越急。"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "目标：把“对弧长求导”换成“对时间求导”",
     "html": "定义里是 $\\dfrac{d\\mathbf T}{ds}$，但题目给的是 $\\mathbf r(t)$，所以要用链式法则：$\\dfrac{d\\mathbf T}{ds}=\\dfrac{d\\mathbf T}{dt}\\cdot\\dfrac{dt}{ds}$。"
    },
    {
     "title": "代入 $\\dfrac{dt}{ds}=\\dfrac{1}{|\\mathbf v|}$",
     "html": "12.3 节已经得到 $\\dfrac{ds}{dt}=|\\mathbf v|$，取倒数就是 $\\dfrac{dt}{ds}=\\dfrac{1}{|\\mathbf v|}$。"
    },
    {
     "title": "整理成可直接计算的公式",
     "html": "$\\kappa=\\left|\\dfrac{d\\mathbf T}{ds}\\right|=\\dfrac{1}{|\\mathbf v|}\\left|\\dfrac{d\\mathbf T}{dt}\\right|$。步骤是：先算 $\\mathbf T=\\mathbf v/|\\mathbf v|$，对 $t$ 求导，取长度，再除以速率。"
    }
   ]
  },
  {
   "t": "p",
   "html": "$$\\kappa=\\frac{1}{|\\mathbf v|}\\left|\\frac{d\\mathbf T}{dt}\\right|$$拿两个最简单的例子对照。半径 $a$ 的圆：$\\mathbf r=a\\cos t\\,\\mathbf i+a\\sin t\\,\\mathbf j$，算得 $|\\mathbf v|=a$，$\\mathbf T=-\\sin t\\,\\mathbf i+\\cos t\\,\\mathbf j$，$\\left|\\dfrac{d\\mathbf T}{dt}\\right|=1$，于是 $\\kappa=\\dfrac1a$——<b>半径越小，曲率越大</b>，与直觉一致。直线：$\\mathbf T$ 是常向量，导数为 0，所以 $\\kappa=0$。"
  },
  {
   "t": "p",
   "html": "现在来找转弯方向。因为 $|\\mathbf T|=1$ 恒成立，12.1 节已经证明“长度不变的向量与其导数垂直”，所以 $\\dfrac{d\\mathbf T}{ds}\\perp\\mathbf T$。把这个向量单位化，就得到<b>主单位法向量</b>（principal unit normal）："
  },
  {
   "t": "p",
   "html": "$$\\mathbf N=\\frac{1}{\\kappa}\\frac{d\\mathbf T}{ds}=\\frac{d\\mathbf T/dt}{\\left|d\\mathbf T/dt\\right|}$$$\\mathbf N$ 永远指向曲线<b>凹进去的一侧</b>，也就是转弯时“被甩出去”的相反方向。右边那个等式更实用：它不需要先算 $\\kappa$ 和 $s$，直接把 $\\mathbf T$ 对 $t$ 求导再单位化就行。注意 $\\kappa=0$ 的地方（直线、拐点）$\\mathbf N$ 没有定义。"
  },
  {
   "t": "p",
   "html": "把“弯曲程度”换成一个圆，就得到<b>曲率圆</b>（osculating circle，也叫密切圆）：在平面曲线的某点，找一个半径 $\\rho=1/\\kappa$ 的圆，使它和曲线在该点相切、弯曲程度也相同，圆心就落在凹侧沿 $\\mathbf N$ 的方向上。这个圆叫“此刻最贴合曲线的圆”，$\\rho$ 叫<b>曲率半径</b>，圆心叫<b>曲率中心</b>："
  },
  {
   "t": "p",
   "html": "$$\\rho=\\frac{1}{\\kappa},\\qquad C=\\mathbf r(t_0)+\\rho\\,\\mathbf N(t_0)$$如果曲线写成 $y=f(x)$（平面显函数），把 $x$ 当成参数就得到最常用的曲率公式；参数曲线 $x=f(t),y=g(t)$ 也有对应版本（点表示对 $t$ 求导）："
  },
  {
   "t": "p",
   "html": "$$\\kappa(x)=\\frac{|f''(x)|}{\\big[1+(f'(x))^2\\big]^{3/2}},\\qquad \\kappa=\\frac{|\\dot x\\ddot y-\\dot y\\ddot x|}{\\big(\\dot x^2+\\dot y^2\\big)^{3/2}}$$$\\kappa=0$ 恰好出现在拐点处（曲线由向上凹变向下凹，瞬时“不弯”）。$y=ax^2$ 在顶点处 $f''=2a$ 最大，所以顶点曲率最大、往两边越来越平。"
  },
  {
   "t": "p",
   "html": "空间曲线的定义与平面完全一样，只是多了一个 $z$。最常用的是螺旋线 $\\mathbf r=a\\cos t\\,\\mathbf i+a\\sin t\\,\\mathbf j+bt\\,\\mathbf k$（$a,b\\ge0$）：它是绕 $z$ 轴匀速上升的弹簧线，曲率是常数"
  },
  {
   "t": "p",
   "html": "$$\\kappa=\\frac{a}{a^2+b^2},\\qquad \\mathbf N=-(\\cos t)\\,\\mathbf i-(\\sin t)\\,\\mathbf j$$$\\mathbf N$ 平行于 $xy$ 平面、水平指向 $z$ 轴，说明螺旋线的“凹侧”始终朝中心轴。自检两个极端：$b=0$ 退化为半径 $a$ 的圆，$\\kappa=a/a^2=1/a$ ✓；$a=0$ 退化为直线（$z$ 轴），$\\kappa=0$ ✓。"
  },
  {
   "t": "lab",
   "id": "tnb"
  },
  {
   "t": "quiz",
   "qid": "ch12-q7"
  },
  {
   "t": "quiz",
   "qid": "ch12-q8"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "曲率在量什么",
     "html": "$\\kappa=\\left|\\dfrac{d\\mathbf T}{ds}\\right|$：沿曲线每走 1 米，方向转过的角度。直线 $\\kappa=0$，圆 $\\kappa=1/\\text{半径}$。"
    },
    {
     "title": "算 $\\mathbf N$ 的捷径",
     "html": "$\\mathbf N=\\dfrac{d\\mathbf T/dt}{|d\\mathbf T/dt|}$，不用先算 $\\kappa$ 或 $s$。"
    },
    {
     "title": "空间曲线的首选公式",
     "html": "$\\kappa=\\dfrac{|\\mathbf v\\times\\mathbf a|}{|\\mathbf v|^3}$（下一节推导），比先算 $\\mathbf T$ 再求导省事。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "12.5 加速度的分解与 TNB 标架（Tangential and Normal Components of Acceleration）",
   "id": "ch12-s6"
  },
  {
   "t": "p",
   "html": "12.4 有了前进方向 $\\mathbf T$ 和转弯方向 $\\mathbf N$。对空间曲线来说还缺一个方向：曲线除了“往前走、往边上拐”，还可能“扭出”当前所在的平面（像螺旋线在绕轴旋转）。这个方向由叉积补上："
  },
  {
   "t": "p",
   "html": "$$\\mathbf B=\\mathbf T\\times\\mathbf N\\qquad(\\text{副法向量，unit binormal vector})$$$\\mathbf T,\\mathbf N,\\mathbf B$ 组成一个随质点移动的<b>右手正交单位标架</b>，叫 <b>TNB 标架</b>（也叫 Frenet 标架）。三个两两垂直的单位箭头，就像随身携带的三根坐标轴。它们张成三个平面：$\\mathbf T,\\mathbf N$ 张成<b>密切平面</b>（osculating plane，曲线“此刻所在”的平面）、$\\mathbf N,\\mathbf B$ 张成<b>法平面</b>、$\\mathbf T,\\mathbf B$ 张成<b>从切平面</b>。"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "把速度写成“速率 × 方向”",
     "html": "$\\mathbf v=\\dfrac{d\\mathbf r}{dt}=\\dfrac{d\\mathbf r}{ds}\\cdot\\dfrac{ds}{dt}=\\mathbf T\\,\\dfrac{ds}{dt}$。这里 $\\dfrac{ds}{dt}=|\\mathbf v|$ 是速率。"
    },
    {
     "title": "对时间求导（乘积法则）",
     "html": "$\\mathbf a=\\dfrac{d}{dt}\\left(\\dfrac{ds}{dt}\\mathbf T\\right)=\\dfrac{d^2s}{dt^2}\\mathbf T+\\dfrac{ds}{dt}\\dfrac{d\\mathbf T}{dt}$。第一项来自“速率在变”，第二项来自“方向在变”。"
    },
    {
     "title": "把 $\\dfrac{d\\mathbf T}{dt}$ 用曲率表示",
     "html": "由曲率定义 $\\dfrac{d\\mathbf T}{ds}=\\kappa\\mathbf N$（长度是 $\\kappa$、方向是 $\\mathbf N$），再乘链式因子得 $\\dfrac{d\\mathbf T}{dt}=\\kappa\\dfrac{ds}{dt}\\mathbf N$。"
    },
    {
     "title": "合并同类项",
     "html": "$\\mathbf a=\\dfrac{d^2s}{dt^2}\\mathbf T+\\kappa\\left(\\dfrac{ds}{dt}\\right)^2\\mathbf N$。加速度被拆成沿 $\\mathbf T$ 和沿 $\\mathbf N$ 的两块，$\\mathbf B$ 方向没有分量。"
    }
   ]
  },
  {
   "t": "tex",
   "tex": "\\mathbf a=\\underbrace{\\frac{d}{dt}|\\mathbf v|}_{a_T}\\,\\mathbf T+\\underbrace{\\kappa|\\mathbf v|^2}_{a_N}\\,\\mathbf N"
  },
  {
   "t": "p",
   "html": "$$a_T=\\frac{d}{dt}|\\mathbf v|=\\frac{\\mathbf v\\cdot\\mathbf a}{|\\mathbf v|},\\qquad a_N=\\kappa|\\mathbf v|^2=\\frac{|\\mathbf v\\times\\mathbf a|}{|\\mathbf v|}=\\sqrt{|\\mathbf a|^2-a_T^{\\,2}}$$这两个分量各有分工：$a_T$ 只负责改变<b>快慢</b>（正表示加速、负表示减速）；$a_N$ 只负责改变<b>方向</b>，并且永远非负。所以无论曲线在三维空间里怎么扭，加速度都躺在 $\\mathbf T,\\mathbf N$ 张成的平面里——这是本章最漂亮的一句话。"
  },
  {
   "t": "p",
   "html": "做题目时，直接套最后一个等式最快：先算 $|\\mathbf v|$ 与 $a_T=\\dfrac{d}{dt}|\\mathbf v|$，再算 $|\\mathbf a|$，最后 $a_N=\\sqrt{|\\mathbf a|^2-a_T^2}$，连曲率和 $\\mathbf T,\\mathbf N$ 都不必求。反过来，$\\kappa=\\dfrac{a_N}{|\\mathbf v|^2}$ 也是一个求曲率的捷径。<br>匀速圆周运动是最好懂的样板：速率不变，所以 $a_T=0$；全部加速度沿 $\\mathbf N$ 指向圆心，大小 $a_N=\\kappa|\\mathbf v|^2=\\dfrac{|\\mathbf v|^2}{r}$。这也解释了为什么高速急转弯危险——速率翻一倍，$a_N$ 变成四倍。"
  },
  {
   "t": "p",
   "html": "最后补一个描述“扭转”的量：<b>挠率</b>（torsion）$\\tau$。曲率 $\\kappa$ 量的是曲线在密切平面内弯得多厉害；挠率量的是<b>密切平面本身绕 $\\mathbf T$ 转得多快</b>，也就是曲线“扭出平面”的程度。因为 $\\mathbf B$ 是密切平面的法向，$\\dfrac{d\\mathbf B}{ds}$ 就刻划这个转动："
  },
  {
   "t": "p",
   "html": "$$\\tau=-\\frac{d\\mathbf B}{ds}\\cdot\\mathbf N,\\qquad \\tau=\\frac{\\begin{vmatrix}\\dot x&amp;\\dot y&amp;\\dot z\\\\ \\ddot x&amp;\\ddot y&amp;\\ddot z\\\\ \\dddot x&amp;\\dddot y&amp;\\dddot z\\end{vmatrix}}{|\\mathbf v\\times\\mathbf a|^2}$$性质对照记：$\\kappa\\ge0$ 恒成立，$\\tau$ 可正可负可为零；<b>平面曲线 $\\tau\\equiv0$</b>（永远不扭出平面）；空间曲线是螺旋线，当且仅当曲率与挠率都是非零常数（只有常曲率还不够，圆也是常曲率）。"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "目标：证明 $\\kappa=\\dfrac{|\\mathbf v\\times\\mathbf a|}{|\\mathbf v|^3}$",
     "html": "从刚得到的分解 $\\mathbf v=\\dfrac{ds}{dt}\\mathbf T$、$\\mathbf a=\\dfrac{d^2s}{dt^2}\\mathbf T+\\kappa\\left(\\dfrac{ds}{dt}\\right)^2\\mathbf N$ 出发。"
    },
    {
     "title": "做叉积，利用 $\\mathbf T\\times\\mathbf T=\\mathbf 0$",
     "html": "$\\mathbf v\\times\\mathbf a=\\dfrac{ds}{dt}\\dfrac{d^2s}{dt^2}(\\mathbf T\\times\\mathbf T)+\\kappa\\left(\\dfrac{ds}{dt}\\right)^3(\\mathbf T\\times\\mathbf N)=\\kappa\\left(\\dfrac{ds}{dt}\\right)^3\\mathbf B$。"
    },
    {
     "title": "两边取长度",
     "html": "因为 $|\\mathbf B|=1$，$|\\mathbf v\\times\\mathbf a|=\\kappa\\left(\\dfrac{ds}{dt}\\right)^3=\\kappa|\\mathbf v|^3$。"
    },
    {
     "title": "解出 $\\kappa$",
     "html": "两边除以 $|\\mathbf v|^3$（这里 $|\\mathbf v|\\neq0$，曲线光滑）即得 $\\kappa=\\dfrac{|\\mathbf v\\times\\mathbf a|}{|\\mathbf v|^3}$。"
    }
   ]
  },
  {
   "t": "lab",
   "id": "accel"
  },
  {
   "t": "quiz",
   "qid": "ch12-q9"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "TNB 三件套",
     "html": "$\\mathbf T$ 前进方向、$\\mathbf N$ 转弯方向（指向凹侧）、$\\mathbf B=\\mathbf T\\times\\mathbf N$ 扭转方向，三者两两垂直、长度都是 1。"
    },
    {
     "title": "加速度分解",
     "html": "$\\mathbf a=a_T\\mathbf T+a_N\\mathbf N$；$a_T=\\dfrac{d}{dt}|\\mathbf v|$ 改快慢（可负），$a_N=\\kappa|\\mathbf v|^2$ 改方向（非负）。"
    },
    {
     "title": "两个捷径",
     "html": "$a_N=\\sqrt{|\\mathbf a|^2-a_T^2}$（不求曲率）；$\\kappa=\\dfrac{|\\mathbf v\\times\\mathbf a|}{|\\mathbf v|^3}$（不求 TNB）。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "12.6 极坐标下的速度与加速度（Velocity and Acceleration in Polar Coordinates）",
   "id": "ch12-s7"
  },
  {
   "t": "p",
   "html": "描述行星、卫星这类绕圈运动，用“离原点多远 $r$、转了多少角 $\\theta$”比用 $x,y$ 自然得多。但要注意：<b>极坐标的“坐标轴方向”会跟着转</b>。在点 $(r,\\theta)$ 处，定义两个随动单位向量："
  },
  {
   "t": "p",
   "html": "$$\\mathbf u_r=(\\cos\\theta)\\,\\mathbf i+(\\sin\\theta)\\,\\mathbf j,\\qquad \\mathbf u_\\theta=-(\\sin\\theta)\\,\\mathbf i+(\\cos\\theta)\\,\\mathbf j$$$\\mathbf u_r$ 从原点指向质点（沿半径向外），$\\mathbf u_\\theta$ 与它垂直、指向 $\\theta$ 增大的方向（逆时针）。它们和固定的 $\\mathbf i,\\mathbf j$ 不同：$\\theta$ 一变，两个箭头跟着转。对 $\\theta$ 求导会得到非常重要的一对关系："
  },
  {
   "t": "tex",
   "tex": "\\frac{d\\mathbf u_r}{d\\theta}=\\mathbf u_\\theta,\\qquad \\frac{d\\mathbf u_\\theta}{d\\theta}=-\\mathbf u_r"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "写出位置",
     "html": "$\\mathbf r=r\\,\\mathbf u_r$，其中 $r$ 和 $\\theta$ 都是 $t$ 的函数。"
    },
    {
     "title": "对时间求导，用乘积法则",
     "html": "$\\mathbf v=\\dfrac{dr}{dt}\\mathbf u_r+r\\dfrac{d\\mathbf u_r}{dt}$。"
    },
    {
     "title": "用链式法则处理随动向量",
     "html": "$\\dfrac{d\\mathbf u_r}{dt}=\\dfrac{d\\mathbf u_r}{d\\theta}\\dfrac{d\\theta}{dt}=\\dot\\theta\\,\\mathbf u_\\theta$。"
    },
    {
     "title": "合并",
     "html": "$\\mathbf v=\\dot r\\,\\mathbf u_r+r\\dot\\theta\\,\\mathbf u_\\theta$。两项分别叫<b>径向速度</b>与<b>横向速度</b>。"
    }
   ]
  },
  {
   "t": "tex",
   "tex": "\\mathbf v=\\dot r\\,\\mathbf u_r+r\\dot\\theta\\,\\mathbf u_\\theta"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "对速度再求导一次",
     "html": "$\\mathbf a=\\dfrac{d}{dt}\\left(\\dot r\\,\\mathbf u_r\\right)+\\dfrac{d}{dt}\\left(r\\dot\\theta\\,\\mathbf u_\\theta\\right)=\\ddot r\\,\\mathbf u_r+\\dot r\\,\\dot{\\mathbf u}_r+\\dot r\\dot\\theta\\,\\mathbf u_\\theta+r\\ddot\\theta\\,\\mathbf u_\\theta+r\\dot\\theta\\,\\dot{\\mathbf u}_\\theta$。"
    },
    {
     "title": "代入随动向量的导数",
     "html": "$\\dot{\\mathbf u}_r=\\dot\\theta\\,\\mathbf u_\\theta$，$\\dot{\\mathbf u}_\\theta=-\\dot\\theta\\,\\mathbf u_r$。"
    },
    {
     "title": "按 $\\mathbf u_r,\\mathbf u_\\theta$ 归并",
     "html": "$\\mathbf u_r$ 的系数是 $\\ddot r-r\\dot\\theta^2$；$\\mathbf u_\\theta$ 的系数是 $r\\ddot\\theta+2\\dot r\\dot\\theta$。整理即得下式。"
    }
   ]
  },
  {
   "t": "p",
   "html": "$$\\mathbf a=\\big(\\ddot r-r\\dot\\theta^2\\big)\\,\\mathbf u_r+\\big(r\\ddot\\theta+2\\dot r\\dot\\theta\\big)\\,\\mathbf u_\\theta$$怎么读这两个加速度项？径向的 $\\ddot r$ 是“沿半径加速”，$-r\\dot\\theta^2$ 是著名的<b>向心项</b>（想把你拉向圆心的那部分）；横向的 $r\\ddot\\theta$ 来自角速度变化，$2\\dot r\\dot\\theta$ 叫<b>科里奥利项</b>（半径变化与转动耦合产生）。只有圆周运动（$r$ 为常数，$\\dot r=\\ddot r=0$）才能把 $\\dot r,\\ddot r$ 直接删掉。"
  },
  {
   "t": "p",
   "html": "如果运动是三维的，在 $z$ 方向再加一项就行，这就是<b>柱面坐标</b>（cylindrical coordinates）：$\\mathbf r=r\\mathbf u_r+z\\mathbf k$，速度与加速度各多一个 $\\dot z\\,\\mathbf k$、$\\ddot z\\,\\mathbf k$。标架满足右手关系 $\\mathbf u_r\\times\\mathbf u_\\theta=\\mathbf k$。"
  },
  {
   "t": "p",
   "html": "$$\\mathbf r=r\\,\\mathbf u_r+z\\,\\mathbf k,\\quad \\mathbf v=\\dot r\\,\\mathbf u_r+r\\dot\\theta\\,\\mathbf u_\\theta+\\dot z\\,\\mathbf k,\\quad \\mathbf a=\\big(\\ddot r-r\\dot\\theta^2\\big)\\mathbf u_r+\\big(r\\ddot\\theta+2\\dot r\\dot\\theta\\big)\\mathbf u_\\theta+\\ddot z\\,\\mathbf k$$现在来看真正的大问题：行星为什么沿椭圆走？先看引力。太阳对行星的引力始终指向太阳，大小与距离平方成反比："
  },
  {
   "t": "tex",
   "tex": "\\mathbf F=-\\frac{GmM}{|\\mathbf r|^2}\\,\\frac{\\mathbf r}{|\\mathbf r|}\\quad\\Longrightarrow\\quad \\ddot{\\mathbf r}=-\\frac{GM}{|\\mathbf r|^3}\\,\\mathbf r"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "关键观察：加速度永远与位置反向",
     "html": "上式右边是 $\\mathbf r$ 的倍数，所以 $\\mathbf r\\times\\ddot{\\mathbf r}=\\mathbf r\\times\\big(-\\text{正数}\\cdot\\mathbf r\\big)=\\mathbf 0$。"
    },
    {
     "title": "造一个守恒量",
     "html": "对 $\\mathbf r\\times\\dot{\\mathbf r}$ 求导：$\\dfrac{d}{dt}(\\mathbf r\\times\\dot{\\mathbf r})=\\dot{\\mathbf r}\\times\\dot{\\mathbf r}+\\mathbf r\\times\\ddot{\\mathbf r}=\\mathbf 0+\\mathbf 0=\\mathbf 0$。"
    },
    {
     "title": "读出几何结论",
     "html": "导数为零意味着 $\\mathbf r\\times\\dot{\\mathbf r}=\\mathbf C$ 是常向量。位置向量 $\\mathbf r$ 始终与这个固定向量 $\\mathbf C$ 垂直，所以轨道被锁在一个固定平面内——<b>行星轨道是平面曲线</b>。"
    }
   ]
  },
  {
   "t": "p",
   "html": "有了守恒量，开普勒的三条经验定律就能逐个推出来。第一定律说轨道是椭圆；第二定律说“扫过的面积”守恒；第三定律把周期与半长轴联系起来。"
  },
  {
   "t": "table",
   "head": [
    "定律",
    "白话",
    "数学表述"
   ],
   "rows": [
    [
     "第一定律（椭圆律）",
     "行星轨道是以太阳为一个焦点的椭圆",
     "$r=\\dfrac{(1+e)r_0}{1+e\\cos\\theta}$，偏心率 $e=\\dfrac{r_0v_0^2}{GM}-1$（$r_0,v_0$ 为近日点的半径与速率）"
    ],
    [
     "第二定律（等面积律）",
     "太阳与行星的连线在相等时间扫过相等面积",
     "$\\mathbf C=\\mathbf r\\times\\dot{\\mathbf r}=r^2\\dot\\theta\\,\\mathbf k=r_0v_0\\,\\mathbf k$，故 $\\dfrac{dA}{dt}=\\dfrac12r^2\\dot\\theta=\\dfrac12r_0v_0$ 为常数"
    ],
    [
     "第三定律（周期–距离律）",
     "同一恒星系里，$T^2/a^3$ 对所有行星都一样",
     "$\\dfrac{T^2}{a^3}=\\dfrac{4\\pi^2}{GM}$"
    ]
   ]
  },
  {
   "t": "p",
   "html": "第二定律的推导最能体现极坐标的用处：$\\mathbf C=\\mathbf r\\times\\mathbf v=r\\mathbf u_r\\times(\\dot r\\mathbf u_r+r\\dot\\theta\\mathbf u_\\theta)=r^2\\dot\\theta\\,\\mathbf k$（用了 $\\mathbf u_r\\times\\mathbf u_r=\\mathbf 0$ 与 $\\mathbf u_r\\times\\mathbf u_\\theta=\\mathbf k$）。而极坐标下小扇形面积是 $dA=\\tfrac12r^2d\\theta$，所以 $\\dfrac{dA}{dt}=\\tfrac12r^2\\dot\\theta$ 是常数——这正是“等面积”的意思。第三定律则是把椭圆面积 $\\pi ab$ 与周期联立消去 $r_0,v_0$ 得到的。"
  },
  {
   "t": "quiz",
   "qid": "ch12-q10"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "两个公式",
     "html": "$\\mathbf v=\\dot r\\,\\mathbf u_r+r\\dot\\theta\\,\\mathbf u_\\theta$；$\\mathbf a=(\\ddot r-r\\dot\\theta^2)\\mathbf u_r+(r\\ddot\\theta+2\\dot r\\dot\\theta)\\mathbf u_\\theta$。"
    },
    {
     "title": "读法",
     "html": "$-r\\dot\\theta^2$ 是向心项，$2\\dot r\\dot\\theta$ 是科里奥利项；圆周运动才能删掉 $\\dot r,\\ddot r$ 的项。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "例题：跟着做一遍",
   "id": "ch12-s8"
  },
  {
   "t": "example",
   "no": "1",
   "tag": "空间曲线的切线、$\\mathbf T$ 与 $\\mathbf N$",
   "fields": [
    {
     "k": "题目",
     "html": "设曲线 $\\mathbf r(t)=t\\,\\mathbf i+t^2\\mathbf j+\\tfrac23t^3\\mathbf k$。(a) 求 $t=1$ 处的切线方程；(b) 求该点的单位切向量 $\\mathbf T$ 与主单位法向量 $\\mathbf N$。"
    },
    {
     "k": "想一想",
     "html": "切线方向就是速度向量 $\\mathbf v(1)$，不用单位化；而 $\\mathbf T$ 是“速度除以速率”，先单位化再求导才能得到 $\\mathbf N$。先看 $|\\mathbf v|$ 能不能化简——题目通常会把根号设计成完全平方。"
    },
    {
     "k": "解答",
     "html": "先求导：$\\mathbf v=\\mathbf r'=\\mathbf i+2t\\,\\mathbf j+2t^2\\mathbf k$，$\\mathbf a=\\mathbf r''=2\\mathbf j+4t\\,\\mathbf k$。<br>(a) $t=1$ 时切点是 $\\mathbf r(1)=\\mathbf i+\\mathbf j+\\tfrac23\\mathbf k$，方向是 $\\mathbf v(1)=\\mathbf i+2\\mathbf j+2\\mathbf k$。所以切线为 $$\\mathbf R(s)=\\left(\\mathbf i+\\mathbf j+\\tfrac23\\mathbf k\\right)+s\\left(\\mathbf i+2\\mathbf j+2\\mathbf k\\right),$$ 即 $\\dfrac{x-1}{1}=\\dfrac{y-1}{2}=\\dfrac{z-2/3}{2}$。<br>(b) 因为 $|\\mathbf v|=\\sqrt{1+4t^2+4t^4}=\\sqrt{(1+2t^2)^2}=1+2t^2$，所以 $$\\mathbf T=\\frac{\\mathbf v}{|\\mathbf v|}=\\frac{1}{1+2t^2}\\mathbf i+\\frac{2t}{1+2t^2}\\mathbf j+\\frac{2t^2}{1+2t^2}\\mathbf k.$$ 对 $t$ 求导并化简：$$\\frac{d\\mathbf T}{dt}=\\frac{2}{(1+2t^2)^2}\\big(-2t\\,\\mathbf i+(1-2t^2)\\mathbf j+2t\\,\\mathbf k\\big),$$ 其模长为 $\\dfrac{2}{1+2t^2}$（根号内又是完全平方）。于是 $$\\mathbf N=\\frac{d\\mathbf T/dt}{|d\\mathbf T/dt|}=\\frac{-2t\\,\\mathbf i+(1-2t^2)\\mathbf j+2t\\,\\mathbf k}{1+2t^2}.$$ 在 $t=1$：$\\mathbf T=\\tfrac13\\mathbf i+\\tfrac23\\mathbf j+\\tfrac23\\mathbf k$，$\\mathbf N=\\tfrac13(-2\\mathbf i-\\mathbf j+2\\mathbf k)$。验算：$\\mathbf T\\cdot\\mathbf N=\\tfrac19(-2-2+4)=0$ ✓。"
    },
    {
     "k": "点评",
     "html": "本题两处根号内都是完全平方，$|\\mathbf v|=1+2t^2$ <b>不带根号</b>，这是出题人留给你的方便，写成 $\\sqrt{1+2t^2}$ 反而会算不下去。求出 $\\mathbf N$ 后，用 $\\mathbf T\\cdot\\mathbf N=0$ 和 $|\\mathbf N|=1$ 抽查最快。顺带可得 $\\kappa=\\dfrac{1}{|\\mathbf v|}\\left|\\dfrac{d\\mathbf T}{dt}\\right|=\\dfrac{2}{(1+2t^2)^2}$，$t=1$ 时 $\\kappa=\\tfrac29$。"
    }
   ]
  },
  {
   "t": "example",
   "no": "2",
   "tag": "用向量公式与显函数公式求曲率、写曲率圆",
   "fields": [
    {
     "k": "题目",
     "html": "(a) 求螺旋线 $\\mathbf r(t)=2\\cos t\\,\\mathbf i+2\\sin t\\,\\mathbf j+t\\,\\mathbf k$ 的曲率。(b) 求 $y=\\ln x$ 在 $x=1$ 处的曲率、曲率半径与曲率圆方程。"
    },
    {
     "k": "想一想",
     "html": "空间曲线用 $\\kappa=\\dfrac{|\\mathbf v\\times\\mathbf a|}{|\\mathbf v|^3}$ 最省事；平面显函数用 $\\kappa=\\dfrac{|f''|}{[1+(f')^2]^{3/2}}$。写曲率圆前必须先判断曲线在这一点往哪边凹，因为圆心在凹侧。"
    },
    {
     "k": "解答",
     "html": "(a) $\\mathbf v=-2\\sin t\\,\\mathbf i+2\\cos t\\,\\mathbf j+\\mathbf k$，$\\mathbf a=-2\\cos t\\,\\mathbf i-2\\sin t\\,\\mathbf j$。叉积 $$\\mathbf v\\times\\mathbf a=\\begin{vmatrix}\\mathbf i&amp;\\mathbf j&amp;\\mathbf k\\\\ -2\\sin t&amp;2\\cos t&amp;1\\\\ -2\\cos t&amp;-2\\sin t&amp;0\\end{vmatrix}=2\\sin t\\,\\mathbf i+2\\cos t\\,\\mathbf j+4\\mathbf k,$$ 故 $|\\mathbf v\\times\\mathbf a|=\\sqrt{4+4+16}=2\\sqrt5$，$|\\mathbf v|=\\sqrt{4+1}=\\sqrt5$，$\\kappa=\\dfrac{2\\sqrt5}{(\\sqrt5)^3}=\\dfrac{2}{5}$。与螺旋线结论 $\\dfrac{a}{a^2+b^2}=\\dfrac{2}{4+1}$ 一致 ✓。<br>(b) $f'(x)=\\dfrac1x$，$f''(x)=-\\dfrac1{x^2}$；$x=1$ 时 $f'=1$，$f''=-1$。$$\\kappa=\\frac{|-1|}{(1+1^2)^{3/2}}=\\frac{1}{2\\sqrt2}=\\frac{\\sqrt2}{4},\\qquad \\rho=2\\sqrt2.$$ 切线方向是 $(1,f'(1))=(1,1)$，与它垂直的方向是 $(1,-1)$ 或 $(-1,1)$。因为 $f''(1)\\lt0$，曲线在 $x=1$ 附近向下凹，凹侧朝下，所以取单位法向量 $\\mathbf N=\\dfrac{1}{\\sqrt2}(1,-1)$。圆心 $$C=(1,0)+2\\sqrt2\\cdot\\frac{1}{\\sqrt2}(1,-1)=(-1,-2),$$ 曲率圆为 $(x+1)^2+(y+2)^2=8$。"
    },
    {
     "k": "点评",
     "html": "曲率中心永远沿 $\\mathbf N$ 指向凹侧，所以要先看 $f''$ 的符号。若把 $\\mathbf N$ 取成凸侧的 $\\dfrac{1}{\\sqrt2}(-1,1)$，会得到错误圆心 $(1,2)$。验算：圆心 $(-1,-2)$ 到 $(1,0)$ 的距离是 $\\sqrt{4+4}=2\\sqrt2=\\rho$ ✓。"
    }
   ]
  },
  {
   "t": "example",
   "no": "3",
   "tag": "弧长与弧长参数化",
   "fields": [
    {
     "k": "题目",
     "html": "设 $\\mathbf r(t)=e^t\\cos t\\,\\mathbf i+e^t\\sin t\\,\\mathbf j+e^t\\mathbf k$。(a) 求 $t=0$ 到 $t=\\ln2$ 的弧长；(b) 求以 $t=0$ 为基点的弧长参数 $s(t)$，并把曲线改写成 $s$ 的参数化。"
    },
    {
     "k": "想一想",
     "html": "先算 $|\\mathbf v|$。三个分量长得很对称，平方相加后交叉项会抵消，只留下 $\\cos^2+\\sin^2$。这类题一定是设计好的。"
    },
    {
     "k": "解答",
     "html": "$\\mathbf v=(e^t\\cos t-e^t\\sin t)\\mathbf i+(e^t\\sin t+e^t\\cos t)\\mathbf j+e^t\\mathbf k$，于是 $$|\\mathbf v|=e^t\\sqrt{(\\cos t-\\sin t)^2+(\\sin t+\\cos t)^2+1}=e^t\\sqrt{2(\\cos^2t+\\sin^2t)+1}=\\sqrt3\\,e^t.$$ (a) $L=\\displaystyle\\int_0^{\\ln2}\\sqrt3\\,e^t\\,dt=\\sqrt3(2-1)=\\sqrt3$。<br>(b) $s(t)=\\displaystyle\\int_0^{t}\\sqrt3\\,e^\\tau\\,d\\tau=\\sqrt3(e^t-1)$，反解得 $e^t=1+\\dfrac{s}{\\sqrt3}$，$t=\\ln\\!\\left(1+\\dfrac{s}{\\sqrt3}\\right)$。代回原曲线即得 $s$ 的参数化。"
    },
    {
     "k": "点评",
     "html": "弧长积分下限是基点 $t_0=0$，换基点只差一个常数，不影响 $\\dfrac{ds}{dt}=|\\mathbf v|$。自检：对 $\\sqrt3(e^t-1)$ 求导得 $\\sqrt3e^t=|\\mathbf v|$ ✓。被积函数是<b>速率</b>，曲线有 $z$ 分量时不能只写 $\\sqrt{x'^2+y'^2}$。"
    }
   ]
  },
  {
   "t": "example",
   "no": "4",
   "tag": "抛体运动：反求初速率、最大高度与射程",
   "fields": [
    {
     "k": "题目",
     "html": "一门炮要打到 $16\\ \\mathrm{km}$ 外的目标，取 $g=9.8\\ \\mathrm{m/s^2}$。(a) 发射角取 $45^\\circ$ 时，初速率应为多少？(b) 此时最大高度与飞行时间是多少？(c) 若初速率保持 (a) 的值，还有没有别的角度能打到同样远？"
    },
    {
     "k": "想一想",
     "html": "射程公式 $R=\\dfrac{v_0^2}{g}\\sin2\\alpha$ 里有 $v_0$，反解即可。注意 $R$ 只依赖 $\\sin2\\alpha$：$\\alpha$ 与 $90^\\circ-\\alpha$ 给出同一个射程。"
    },
    {
     "k": "解答",
     "html": "(a) $\\alpha=45^\\circ$ 时 $\\sin2\\alpha=1$，所以 $$16\\,000=\\frac{v_0^2}{9.8}\\ \\Longrightarrow\\ v_0^2=156\\,800\\ \\Longrightarrow\\ v_0\\approx396\\ \\mathrm{m/s}.$$ (b) 竖直初速度 $v_0\\sin45^\\circ\\approx280\\ \\mathrm{m/s}$，故 $$y_{\\max}=\\frac{280^2}{2\\times9.8}\\approx4000\\ \\mathrm m,\\qquad t_{\\text{flight}}=\\frac{2\\times280}{9.8}\\approx57.1\\ \\mathrm s.$$ 验算：$x=(v_0\\cos45^\\circ)t\\approx280\\times57.1\\approx15\\,988\\ \\mathrm m\\approx16\\ \\mathrm{km}$ ✓。<br>(c) $45^\\circ$ 是唯一解。因为 $\\sin2\\alpha$ 在 $2\\alpha=90^\\circ$ 取最大值 1，此时 $\\alpha$ 与 $90^\\circ-\\alpha$ 是同一个角。只有当 $\\sin2\\alpha\\lt1$ 时才会出现“两个互余的角射程相同”：例如目标改到 $12\\ \\mathrm{km}$，$\\sin2\\alpha=\\dfrac{12\\,000\\times9.8}{156\\,800}\\approx0.75$，$2\\alpha\\approx48.6^\\circ$ 或 $131.4^\\circ$，即 $\\alpha\\approx24.3^\\circ$ 或 $65.7^\\circ$。"
    },
    {
     "k": "点评",
     "html": "$v_0$ 是<b>初速率</b>（标量），不是竖直分量，这是最常见的误读。<b>发射点高度不为 0 时</b>，$y_{\\max}$、$t_{\\text{flight}}$、$R$ 三条公式全部失效，必须回到 $y(t)=0$ 解二次方程并舍去负根。"
    }
   ]
  },
  {
   "t": "example",
   "no": "5",
   "tag": "把加速度分解为 $a_T\\mathbf T+a_N\\mathbf N$",
   "fields": [
    {
     "k": "题目",
     "html": "质点在平面内运动，$\\mathbf r(t)=(\\cos t+t\\sin t)\\mathbf i+(\\sin t-t\\cos t)\\mathbf j$（$t\\gt0$）。不求出 $\\mathbf T,\\mathbf N$，把加速度写成 $\\mathbf a=a_T\\mathbf T+a_N\\mathbf N$。"
    },
    {
     "k": "想一想",
     "html": "先化简 $|\\mathbf v|$，再对它求导得 $a_T$；然后用 $|\\mathbf a|^2=a_T^2+a_N^2$ 开方得 $a_N$。全过程不需要 $\\mathbf T,\\mathbf N$。"
    },
    {
     "k": "解答",
     "html": "$\\mathbf v=(-\\sin t+\\sin t+t\\cos t)\\mathbf i+(\\cos t-\\cos t+t\\sin t)\\mathbf j=t\\cos t\\,\\mathbf i+t\\sin t\\,\\mathbf j$，故 $|\\mathbf v|=t$（$t\\gt0$），$a_T=\\dfrac{d}{dt}(t)=1$。<br>再求导：$\\mathbf a=(\\cos t-t\\sin t)\\mathbf i+(\\sin t+t\\cos t)\\mathbf j$，于是 $$|\\mathbf a|^2=(\\cos t-t\\sin t)^2+(\\sin t+t\\cos t)^2=t^2+1,$$ 交叉项正好抵消。所以 $a_N=\\sqrt{(t^2+1)-1}=t$，最终 $$\\mathbf a=1\\cdot\\mathbf T+t\\cdot\\mathbf N.$$"
    },
    {
     "k": "点评",
     "html": "$|\\mathbf v|=t$ 说明速率随时间线性增长，$a_T\\equiv1$ 是常数，符合直觉。三个易错点：$|\\mathbf a|^2$ 是<b>先平方再相加</b>；$a_N$ 开方取正根；展开时 $-2t\\sin t\\cos t$ 与 $+2t\\sin t\\cos t$ 相消，别漏项。"
    }
   ]
  },
  {
   "t": "example",
   "no": "6",
   "tag": "极坐标下的速度、加速度与开普勒第三定律",
   "fields": [
    {
     "k": "题目",
     "html": "(a) 设 $r=e^{2t}$，$\\theta=t$，求 $\\mathbf v$ 与 $\\mathbf a$ 关于 $\\mathbf u_r,\\mathbf u_\\theta$ 的表达式。(b) 已知地球轨道半长轴 $a\\approx1.50\\times10^{11}\\ \\mathrm m$、公转周期 $T=365.256$ 天，估算太阳质量（$G=6.6738\\times10^{-11}\\ \\mathrm{N\\,m^2/kg^2}$）。"
    },
    {
     "k": "想一想",
     "html": "(a) 先算 $\\dot r,\\ddot r,\\dot\\theta,\\ddot\\theta$ 再代极坐标公式，注意 $\\dot r$ 是<b>对时间</b>求导，不是对 $\\theta$。(b) 直接用开普勒第三定律 $\\dfrac{T^2}{a^3}=\\dfrac{4\\pi^2}{GM}$ 反解 $M$。"
    },
    {
     "k": "解答",
     "html": "(a) $\\dot r=2e^{2t}$，$\\ddot r=4e^{2t}$；$\\dot\\theta=1$，$\\ddot\\theta=0$。于是 $$\\mathbf v=2e^{2t}\\mathbf u_r+e^{2t}\\mathbf u_\\theta,$$ $$\\mathbf a=(4e^{2t}-e^{2t})\\mathbf u_r+(0+4e^{2t})\\mathbf u_\\theta=3e^{2t}\\mathbf u_r+4e^{2t}\\mathbf u_\\theta.$$ (b) 先把单位换成米和秒：$T=365.256\\times24\\times3600\\approx3.156\\times10^7\\ \\mathrm s$，$a^3=(1.50\\times10^{11})^3=3.375\\times10^{33}\\ \\mathrm{m^3}$。于是 $$\\frac{T^2}{a^3}=\\frac{(3.156\\times10^7)^2}{3.375\\times10^{33}}\\approx2.951\\times10^{-19}\\ \\mathrm{s^2/m^3},$$ $$M=\\frac{4\\pi^2}{G}\\cdot\\frac{a^3}{T^2}=\\frac{39.478}{6.6738\\times10^{-11}\\times2.951\\times10^{-19}}\\approx2.0\\times10^{30}\\ \\mathrm{kg}.$$"
    },
    {
     "k": "点评",
     "html": "(a) 中向心项 $-r\\dot\\theta^2=-e^{2t}$ 的负号，是答案取 $3e^{2t}$ 而不是 $5e^{2t}$ 的关键。(b) 结果与教材的 $M_{\\text{sun}}\\approx1.99\\times10^{30}\\ \\mathrm{kg}$ 吻合 ✓；$T$ 换算成秒、$a$ 换算成米，单位不统一就会差好几个数量级。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "这些地方最容易错",
   "id": "ch12-s9"
  },
  {
   "t": "list",
   "items": [
    "$\\mathbf r'$ 是切向量，$\\mathbf T$ 是单位切向量：切线方向直接用 $\\mathbf r'(t_0)$；$\\mathbf T$ 要再除以 $|\\mathbf v|$，求 $\\mathbf N$ 前必须先单位化再求导。",
    "$\\mathbf v$ 是速度（箭头），$|\\mathbf v|$ 是速率（数）：题目问“速率”时不要交一个向量；求速度时先写“速率 × 方向”再拆成分量，不容易丢项。",
    "叉积求导顺序不能换：$\\dfrac{d}{dt}(\\mathbf u\\times\\mathbf v)=\\mathbf u'\\times\\mathbf v+\\mathbf u\\times\\mathbf v'$，换顺序会整体差一个负号。",
    "$|\\mathbf r|$ 为常数 $\\Rightarrow\\mathbf r\\cdot\\mathbf r'=0$：一句话证明是两边对 $t$ 求导；反过来“正交”也能推出长度不变（在积分题里常用）。",
    "曲率永远非负：$|\\mathbf v\\times\\mathbf a|$、$|f''|$、$\\left|\\dfrac{d\\mathbf T}{ds}\\right|$ 都带绝对值；算完曲率是负数，一定哪里漏了绝对值。",
    "分母是 $|\\mathbf v|^3$ 不是 $|\\mathbf v|^2$；平面显函数公式的分母是 $[1+(f')^2]^{3/2}$，不是 $1+(f')^2$。",
    "曲率中心沿 $\\mathbf N$（凹侧）：$\\rho=1/\\kappa$、$C=\\mathbf r+\\rho\\mathbf N$；$f''\\gt0$ 时曲线向上凹、圆心在上方。",
    "$a_T$ 可正可负，$a_N$ 必非负：$a_T\\gt0$ 加速、$a_T\\lt0$ 减速；$a_N=\\sqrt{|\\mathbf a|^2-a_T^2}$ 开方只取正根。",
    "抛体三公式的前提是“从原点出发 + 落回同一高度”：发射点高度 $Y_0\\ne0$ 时全部作废，回到 $Y_0+(v_0\\sin\\alpha)t-\\frac12gt^2=0$ 解方程并舍负根。",
    "极坐标里 $\\dot r\\ne\\dfrac{dr}{d\\theta}$：$\\dot r$ 是对<b>时间</b>求导；只有 $r$ 为常数（圆周）才有 $\\dot r=\\ddot r=0$。",
    "挠率 $\\tau=0$ 等价于平面曲线；“常曲率 + 常挠率”才是螺旋线，只有常曲率不够（圆也是常曲率）。"
   ]
  },
  {
   "t": "callout",
   "kind": "warn",
   "title": "两个最常踩的坑",
   "html": "<p><b>坑一：把速度当速率。</b>看到“速度”先写向量，看到“速率”先想到长度。计算 $a_T=\\dfrac{d}{dt}|\\mathbf v|$ 时，如果 $|\\mathbf v|$ 有根号，往往一化简就没根号了，硬求导会非常痛苦。</p><p><b>坑二：忘记单位向量。</b>$\\mathbf T=\\dfrac{\\mathbf v}{|\\mathbf v|}$ 和 $\\mathbf N=\\dfrac{d\\mathbf T/dt}{|d\\mathbf T/dt|}$ 都必须除长度；曲率、曲率中心、加速度分解这几类题一旦漏除，后面全错。</p>"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "这一章要记住的",
   "id": "ch12-s10"
  },
  {
   "t": "formula",
   "items": [
    {
     "name": "位置、速度、加速度",
     "tex": "\\mathbf v=\\mathbf r'=\\frac{d\\mathbf r}{dt},\\qquad \\mathbf a=\\mathbf v'=\\mathbf r'',\\qquad \\text{速率}=|\\mathbf v|"
    },
    {
     "name": "切线方程",
     "tex": "\\mathbf R(s)=\\mathbf r(t_0)+s\\,\\mathbf r'(t_0)"
    },
    {
     "name": "常长度向量的导数",
     "tex": "|\\mathbf r|=\\text{常数}\\ \\Longrightarrow\\ \\mathbf r\\cdot\\mathbf r'=0"
    },
    {
     "name": "抛体运动位置（原点出发）",
     "tex": "\\mathbf r=(v_0\\cos\\alpha)t\\,\\mathbf i+\\Big((v_0\\sin\\alpha)t-\\tfrac12gt^2\\Big)\\mathbf j"
    },
    {
     "name": "抛体三公式（原点出发、落回同高）",
     "tex": "y_{\\max}=\\frac{v_0^2\\sin^2\\alpha}{2g},\\qquad t_{\\text{flight}}=\\frac{2v_0\\sin\\alpha}{g},\\qquad R=\\frac{v_0^2}{g}\\sin2\\alpha"
    },
    {
     "name": "弧长与弧长函数",
     "tex": "L=\\int_a^b|\\mathbf v|\\,dt,\\qquad s(t)=\\int_{t_0}^{t}|\\mathbf v(\\tau)|\\,d\\tau,\\qquad \\frac{ds}{dt}=|\\mathbf v|"
    },
    {
     "name": "单位切向量（两条路）",
     "tex": "\\mathbf T=\\frac{\\mathbf v}{|\\mathbf v|}=\\frac{d\\mathbf r}{ds}"
    },
    {
     "name": "曲率",
     "tex": "\\kappa=\\left|\\frac{d\\mathbf T}{ds}\\right|=\\frac{1}{|\\mathbf v|}\\left|\\frac{d\\mathbf T}{dt}\\right|=\\frac{|\\mathbf v\\times\\mathbf a|}{|\\mathbf v|^3}"
    },
    {
     "name": "平面曲线的曲率",
     "tex": "\\kappa(x)=\\frac{|f''(x)|}{\\big[1+(f'(x))^2\\big]^{3/2}},\\qquad \\kappa=\\frac{|\\dot x\\ddot y-\\dot y\\ddot x|}{\\big(\\dot x^2+\\dot y^2\\big)^{3/2}}"
    },
    {
     "name": "主法向量与副法向量",
     "tex": "\\mathbf N=\\frac{d\\mathbf T/dt}{|d\\mathbf T/dt|},\\qquad \\mathbf B=\\mathbf T\\times\\mathbf N"
    },
    {
     "name": "曲率半径与曲率中心",
     "tex": "\\rho=\\frac1\\kappa,\\qquad C=\\mathbf r(t_0)+\\rho\\,\\mathbf N(t_0)"
    },
    {
     "name": "加速度的分解",
     "tex": "\\mathbf a=a_T\\mathbf T+a_N\\mathbf N,\\quad a_T=\\frac{d}{dt}|\\mathbf v|=\\frac{\\mathbf v\\cdot\\mathbf a}{|\\mathbf v|},\\quad a_N=\\kappa|\\mathbf v|^2=\\frac{|\\mathbf v\\times\\mathbf a|}{|\\mathbf v|}"
    },
    {
     "name": "挠率",
     "tex": "\\tau=-\\frac{d\\mathbf B}{ds}\\cdot\\mathbf N,\\qquad \\tau=\\frac{\\det(\\dot{\\mathbf r},\\ddot{\\mathbf r},\\dddot{\\mathbf r})}{|\\mathbf v\\times\\mathbf a|^2}"
    },
    {
     "name": "极坐标的速度与加速度",
     "tex": "\\mathbf v=\\dot r\\,\\mathbf u_r+r\\dot\\theta\\,\\mathbf u_\\theta,\\qquad \\mathbf a=(\\ddot r-r\\dot\\theta^2)\\mathbf u_r+(r\\ddot\\theta+2\\dot r\\dot\\theta)\\mathbf u_\\theta"
    }
   ]
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "如果只记三件事",
     "html": "① 位置求导得速度、再求导得加速度，反过来积分两次；② $\\mathbf T=\\mathbf v/|\\mathbf v|$、$\\mathbf N$ 是 $\\mathbf T$ 变化的方向、$\\mathbf B=\\mathbf T\\times\\mathbf N$；③ 曲率 $\\kappa$ 量“方向转得多快”，加速度 $a_T\\mathbf T+a_N\\mathbf N$ 分别管快慢与方向。"
    },
    {
     "title": "两个看见就想",
     "html": "看见螺旋线，立刻想到 $\\kappa=\\dfrac{a}{a^2+b^2}$；看见“运动”两个字，立刻先写 $\\mathbf r(t)$，再套求导或积分的流程。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "接下来学什么",
   "id": "ch12-s11"
  },
  {
   "t": "p",
   "html": "这一章造出的三个概念会在后面反复出现。<b>弧长与单位切向量</b>会在 <a href=\"#/ch14\">第 14 章</a>变成重积分里的面积元与曲线长度的语言，也会在 <a href=\"#/ch15\">第 15 章</a>的向量场里用来算“沿路径做的功”。<b>曲率与 TNB 标架</b>是理解空间曲线几何的通用语言，物理里计算法向加速度、工程里设计铁轨与公路弯道都要用。<br>更直接的是：<b>极坐标下的速度与加速度</b>会在第 13 章升级成“多元函数的链式法则”，而“用积分从加速度倒推位置”就是第 16 章微分方程里“初值问题”的雏形。学完本章，你已经能用微积分完整描述一个质点的运动了。"
  },
  {
   "t": "checklist",
   "id": "ch12",
   "items": [
    "能说出 $\\mathbf r,\\mathbf v,\\mathbf a$ 各是什么，并解释为什么速度是箭头而速率是数。",
    "能对向量值函数求极限、求导、积分，并写出空间曲线在一点的切线。",
    "能把抛体运动的加速度积分两次得到位置，并解释三条射程公式的前提。",
    "能算空间曲线弧长与弧长函数，并说明为什么 $\\mathbf T=d\\mathbf r/ds$ 是单位向量。",
    "能用自己的话解释曲率在量什么，会算 $\\kappa$、$\\mathbf N$、$\\mathbf B$、曲率半径与曲率圆。",
    "能把加速度拆成 $a_T\\mathbf T+a_N\\mathbf N$，并说清哪部分改快慢、哪部分改方向。",
    "能写出极坐标下 $\\mathbf v,\\mathbf a$ 的表达式，并解释向心项与科里奥利项的来历。"
   ]
  }
 ]
});
