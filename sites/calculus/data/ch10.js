/* =====================================================================
 * data/ch10.js · 第10章 参数方程与极坐标（Parametric Equations and Polar Coordinates）
 * 初学者版正文：100 blocks / 0 定理 / 5 例题 / 1 公式 / 2 列表 / 3 表格 / 6 小结卡 / 10 步骤流 / 2 实验台 / 0 演算台 / 8 内嵌题
 * ===================================================================== */
CSC.registerChapter({
 "id": "ch10",
 "num": "10",
 "title": "参数方程与极坐标",
 "en": "Parametric Equations and Polar Coordinates",
 "goals": [
  "能说清参数方程在做什么：为什么请出第三个变量 $t$，以及同一条曲线为什么有很多种参数化。",
  "会把参数方程消参成直角坐标方程，并说出被描出的到底是整条曲线还是其中一段。",
  "能用 $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$ 求切线与凹凸性，用 $ds$ 求弧长和旋转曲面面积，用 $\\int y\\,dx$ 求面积。",
  "能在极坐标与直角坐标之间互化，并用对称性、零点、极值三步画出常见极坐标曲线。",
  "能用 $A=\\frac12\\int r^2\\,d\\theta$ 求面积，并能由 $r=\\frac{ke}{1\\pm e\\cos\\theta}$ 读出离心率、准线与曲线类型。"
 ],
 "kp": [
  {
   "id": "ch10-1",
   "title": "核心概念与公式"
  },
  {
   "id": "ch10-2",
   "title": "10.1 参数曲线：用第三个变量记录位置"
  },
  {
   "id": "ch10-3",
   "title": "10.2 参数曲线的微积分"
  },
  {
   "id": "ch10-4",
   "title": "10.3 极坐标：一个角度加一个距离"
  },
  {
   "id": "ch10-5",
   "title": "10.4 极坐标曲线怎么画"
  },
  {
   "id": "ch10-6",
   "title": "10.5 极坐标下的面积与弧长"
  },
  {
   "id": "ch10-7",
   "title": "10.6 圆锥曲线"
  },
  {
   "id": "ch10-8",
   "title": "10.7 极坐标下的圆锥曲线"
  }
 ],
 "blocks": [
  {
   "t": "callout",
   "kind": "why",
   "title": "这一章要解决什么问题",
   "html": "<p>你在游乐园坐过山车。有人问：「第 3 秒的时候，你在哪个高度？」这个问题里有两个量：水平走了多远、离地多高。它们都随时间变，而且被同一个「第几秒」同时决定。</p>\n<p>可我们之前学的曲线都是 $y=f(x)$ 的样子：给一个 $x$，算一个 $y$。这种写法有个硬性要求——一个 $x$ 只能对应一个 $y$。过山车的轨道会绕回来，同一个位置会出现两次；圆也是，一个 $x$ 对应上下两个 $y$。用 $y=f(x)$ 根本写不下来。</p>\n<p>还有一类问题更麻烦。雷达站告诉你「目标在东北方向 3 公里」，这句话里没有横坐标也没有纵坐标，只有一个方向和一段距离。硬翻译成 $x,y$ 反而绕远路。</p>\n<p>所以这一章要造两套新写法。第一套请出<b>第三个变量 $t$</b>，让它同时决定 $x$ 和 $y$，专门对付会绕回来的曲线。第二套改用<b>角度加距离</b>来定位平面上的点，专门对付绕着中心转的问题。两套写法最后都回到同一件事：求切线、求长度、求面积。</p>"
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "开始前你需要知道",
   "html": "<ul>\n<li><b>导数与链式法则</b>：这一章几乎每个公式都是链式法则的变形。不熟先回<a href=\"#/ch03\">第 3 章</a>。</li>\n<li><b>定积分与换元法</b>：把 $\\int y\\,dx$ 换成对 $t$ 的积分，用的就是换元，见<a href=\"#/ch05\">第 5 章</a>。</li>\n<li><b>弧长与旋转曲面</b>：第 6 章用 $ds=\\sqrt{1+(y')^2}\\,dx$ 算过弧长，这一章只是把 $ds$ 换成参数形式，可回看<a href=\"#/ch06\">第 6 章</a>。</li>\n<li><b>三角函数</b>：$\\cos,\\sin$ 的周期与对称性、$1-\\cos\\theta=2\\sin^2\\frac\\theta2$ 这类恒等式会反复出现，见<a href=\"#/ch01\">第 1 章</a>。</li>\n</ul>"
  },
  {
   "t": "scope",
   "scope": "outside",
   "weeks": "—",
   "sections": "§10.1–10.7"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "先看一个例子：过山车在第 3 秒停在哪里",
   "id": "ch10-s1"
  },
  {
   "t": "p",
   "html": "<p>假设一辆过山车从起点开始计时，第 $t$ 秒时它的水平位置是 $x=t^2$ 米，高度是 $y=20-4t$ 米。先不管这个式子现不现实，只看结构：$x$ 和 $y$ 都是 $t$ 的函数。</p>\n<p>$t=0$ 时它在 $(0,20)$；$t=1$ 时在 $(1,16)$；$t=3$ 时在 $(9,8)$。想知道「什么时候到哪」，看 $t$ 就行。</p>\n<p>麻烦在于，$y=f(x)$ 这种写法答不了这个问题。它只能说「高度是水平位置的函数」，说不出「第几秒」。而且一旦轨道绕回来，同一个 $x$ 会对应好几个 $y$，连函数都不是了。</p>"
  },
  {
   "t": "tex",
   "tex": "x=f(t),\\qquad y=g(t),\\qquad \\alpha\\le t\\le\\beta"
  },
  {
   "t": "p",
   "html": "<p>逐个说：$t$ 叫<b>参数</b>（parameter），你可以直接把它当成时间；$f(t)$ 和 $g(t)$ 是两个普通函数，一个算横坐标、一个算纵坐标；$[\\alpha,\\beta]$ 叫<b>参数区间</b>，规定 $t$ 能取哪些值，$\\alpha$ 是起点、$\\beta$ 是终点。</p>\n<p>$t=\\alpha$ 对应的点 $(f(\\alpha),g(\\alpha))$ 叫<b>初始点</b>，$t=\\beta$ 对应的点叫<b>终止点</b>。如果区间一直延伸到无穷，这两个点就不存在。</p>\n<p>记住一句话：<b>$t$ 不是曲线上的点，它是「第几秒」。</b>曲线是点随时间移动留下的痕迹。所以参数方程比 $y=f(x)$ 多记录了一样东西——<b>走法</b>：从哪出发、往哪走、走多快。</p>"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "10.1 参数曲线：用第三个变量记录位置（Parametrizations of Plane Curves）",
   "id": "ch10-s3"
  },
  {
   "t": "p",
   "html": "<p>先解决一个具体问题：圆怎么写？</p>\n<p>你会写 $x^2+y^2=1$，可这不是 $y=f(x)$ 的形式。硬解出来要分成 $y=\\sqrt{1-x^2}$ 和 $y=-\\sqrt{1-x^2}$ 两段，还得规定 $x\\in[-1,1]$。写起来别扭，求导更别扭。</p>\n<p>换个思路：圆上的点，不就是「从 $(1,0)$ 出发，逆时针转 $t$ 弧度后到达的位置」吗？横坐标是 $\\cos t$，纵坐标是 $\\sin t$。一个 $t$ 配一个点，干净利落。</p>"
  },
  {
   "t": "tex",
   "tex": "x=\\cos t,\\qquad y=\\sin t,\\qquad 0\\le t\\le 2\\pi"
  },
  {
   "t": "p",
   "html": "<p>把 $t$ 想成钟表指针转过的角度。$t=0$ 时在 $(1,0)$，$t=\\frac\\pi2$ 时在 $(0,1)$，$t=\\pi$ 时在 $(-1,0)$，$t=\\frac{3\\pi}2$ 时在 $(0,-1)$，$t=2\\pi$ 时回到 $(1,0)$。</p>\n<p>于是「点在哪」和「第几秒」被同一句话回答了。这是参数方程最实在的好处：它不只画形状，还记录了<b>方向</b>和<b>快慢</b>。</p>"
  },
  {
   "t": "p",
   "html": "<p>同一条曲线可以有很多种参数化（parametrization），区别只在走法。$x=\\cos 2t,\\ y=\\sin 2t,\\ 0\\le t\\le\\pi$ 画的还是那个圆，但 $t$ 只要从 0 走到 $\\pi$ 就转完一圈（真正的转角是 $2t$），走得快一倍；$x=\\cos t,\\ y=-\\sin t$ 也是这个圆，只是顺时针走。</p>\n<p>反过来，题目给你参数方程、要你还原成 $x,y$ 的关系式，这叫<b>消参</b>（eliminate the parameter）。手法只有两类：一是<b>解出一个 $t$ 代进去</b>，比如 $x=t+1,\\ y=t^2$ 得 $t=x-1$，所以 $y=(x-1)^2$；二是<b>凑恒等式</b>，看到 $\\cos,\\sin$ 就用 $\\cos^2t+\\sin^2t=1$，看到 $\\sec,\\tan$ 就用 $\\sec^2t-\\tan^2t=1$。</p>"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "先看结构，选手法",
     "html": "有 $\\cos,\\sin$ 就凑平方和；$t$ 只出现一次就直接解出来。先别急着算。"
    },
    {
     "title": "把 $t$ 完全赶走",
     "html": "得到只含 $x,y$ 的方程 $F(x,y)=0$。这一步只管形状。"
    },
    {
     "title": "回头翻译 $t$ 的范围",
     "html": "这是最容易漏的一步。$t\\ge0$ 会限制 $x$ 只能取一部分，最终轨迹可能只是整条曲线的一段。"
    }
   ]
  },
  {
   "t": "callout",
   "kind": "warn",
   "title": "消参之后，一定要回头看范围",
   "html": "<p>看这个例子：$x=\\sqrt t,\\ y=t,\\ t\\ge0$。由 $x=\\sqrt t$ 得 $t=x^2$，所以 $y=x^2$。很多人写到这里就停笔，答案写成「抛物线 $y=x^2$」。</p>\n<p>错。因为 $t\\ge0$ 意味着 $x=\\sqrt t\\ge0$，所以真正被描出来的只有<b>右半支</b>，也就是 $x\\ge0$ 的那一半。</p>\n<p>口诀：<b>消参消掉的是 $t$，不是 $t$ 的范围。</b>范围要跟着一起翻译过去。</p>"
  },
  {
   "t": "table",
   "head": [
    "曲线",
    "参数方程",
    "参数范围与说明"
   ],
   "rows": [
    [
     "过 $(a,b)$、斜率 $m$ 的直线",
     "$x=a+t,\\ y=b+mt$",
     "$t\\in\\mathbb R$；$t$ 就是「向右走了多少」"
    ],
    [
     "圆 $x^2+y^2=a^2$",
     "$x=a\\cos t,\\ y=a\\sin t$",
     "$0\\le t\\le2\\pi$，逆时针；把 $t$ 换成 $-t$ 变顺时针"
    ],
    [
     "椭圆 $\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1$",
     "$x=a\\cos t,\\ y=b\\sin t$",
     "$0\\le t\\le2\\pi$；$a,b$ 是两个方向的半轴"
    ],
    [
     "双曲线右支 $\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1$",
     "$x=a\\sec t,\\ y=b\\tan t$",
     "$-\\frac\\pi2 \\lt t \\lt \\frac\\pi2$，靠 $\\sec^2t-\\tan^2t=1$"
    ],
    [
     "函数 $y=f(x)$",
     "$x=t,\\ y=f(t)$",
     "$t$ 取 $f$ 的定义域，叫自然参数化"
    ],
    [
     "摆线",
     "$x=a(t-\\sin t),\\ y=a(1-\\cos t)$",
     "半径 $a$ 的轮子沿直线滚，$t$ 是滚过的角度"
    ]
   ]
  },
  {
   "t": "p",
   "html": "<p>最后一行值得单独说。想象一个半径 $a$ 的轮子沿地面向右滚，轮缘上有一个红点，一开始在最低点。轮子滚过的角度是 $t$，轮心前进了 $at$。</p>\n<p>红点相对轮心，往后退了 $a\\sin t$、往上抬了 $a\\cos t$。所以横坐标是轮心位置减掉后退量：$at-a\\sin t$；纵坐标是轮心高度 $a$ 减去「比轮心低多少」$a\\cos t$，得 $a(1-\\cos t)$。</p>"
  },
  {
   "t": "tex",
   "tex": "x=a(t-\\sin t),\\qquad y=a(1-\\cos t),\\qquad t\\in\\mathbb R"
  },
  {
   "t": "p",
   "html": "<p>摆线（cycloid）有两个漂亮的物理性质。</p>\n<p>第一，让小球从高处沿光滑轨道由静止滑下，想在最短时间内到达终点，轨道不该是直线，而该是<b>倒过来的摆线</b>。这叫最速降线（brachistochrone）。</p>\n<p>第二，在摆线上任意位置由静止释放小球，到达最低点的时间都一样，都是 $T=\\pi\\sqrt{a/g}$（$g$ 是重力加速度）。这叫等时性（tautochrone），摆线因此也叫等时曲线。</p>"
  },
  {
   "t": "quiz",
   "qid": "ch10-q1"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "参数方程在做什么",
     "html": "$x=f(t),\\ y=g(t)$，$t$ 走过区间，点就画出曲线。它记录的是走法，不只是形状。"
    },
    {
     "title": "消参",
     "html": "解出 $t$ 代入，或凑 $\\cos^2+\\sin^2=1$ 这类恒等式；消完必须把 $t$ 的范围翻译成 $x,y$ 的范围。"
    },
    {
     "title": "摆线",
     "html": "$x=a(t-\\sin t),\\ y=a(1-\\cos t)$。$t\\in[0,2\\pi]$ 对应轮子转一圈，画出一个拱。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "10.2 参数曲线的微积分：斜率、弧长与面积（Calculus with Parametric Curves）",
   "id": "ch10-s4"
  },
  {
   "t": "p",
   "html": "<p>曲线有了，接着问：它有多陡？</p>\n<p>对 $y=f(x)$，陡不陡看 $\\frac{dy}{dx}$。可参数曲线里 $y$ 不是 $x$ 的函数，$x$ 和 $y$ 都挂在 $t$ 上。怎么求「$y$ 随 $x$ 的变化率」？</p>\n<p>先想画面：$t$ 往前走时，$x$ 变化的快慢是 $\\frac{dx}{dt}$，$y$ 变化的快慢是 $\\frac{dy}{dt}$。那么「$x$ 每变 1 个单位，$y$ 跟着变多少」，自然就是两者相除。</p>"
  },
  {
   "t": "tex",
   "tex": "\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt},\\qquad \\frac{dx}{dt}\\ne0"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "把 $y$ 看成 $x$ 的函数",
     "html": "在曲线光滑、$x$ 不来回折返的那一段上，$y$ 确实由 $x$ 唯一决定，可以写成 $y=y(x)$。"
    },
    {
     "title": "两边对 $t$ 用链式法则",
     "html": "因为 $x=x(t)$，所以 $y=y(x(t))$。对 $t$ 求导得 $\\frac{dy}{dt}=\\frac{dy}{dx}\\cdot\\frac{dx}{dt}$。这句话的意思是：$y$ 对 $t$ 的变化，等于「$y$ 对 $x$ 的变化」乘上「$x$ 对 $t$ 的变化」。"
    },
    {
     "title": "两边除以 $\\frac{dx}{dt}$",
     "html": "只要 $\\frac{dx}{dt}\\ne0$，就能除过去，得到 $\\frac{dy}{dx}=\\dfrac{dy/dt}{dx/dt}$。"
    }
   ]
  },
  {
   "t": "p",
   "html": "<p>有人会问：$\\frac{dy}{dt}$ 和 $\\frac{dx}{dt}$ 都是导数，又不是分数，怎么能像分数一样约？</p>\n<p>它们确实不是分数，但它们是<b>「变化量之比」的极限</b>。把 $t$ 的一小步记作 $\\Delta t$，那么 $x$ 的一小步约等于 $\\frac{dx}{dt}\\Delta t$，$y$ 的一小步约等于 $\\frac{dy}{dt}\\Delta t$。两者相除是 $\\frac{\\frac{dy}{dt}\\Delta t}{\\frac{dx}{dt}\\Delta t}$，分子分母里的 $\\Delta t$ 是<b>同一个</b>，可以直接约掉，只剩 $\\frac{dy/dt}{dx/dt}$。让 $\\Delta t\\to0$，近似就变成精确的等式。</p>\n<p>所以「可以这样除」不是把导数硬当分数算，而是上下乘的是同一个 $\\Delta t$。这也顺带解释了为什么要求 $\\frac{dx}{dt}\\ne0$：分母不能是 0。</p>"
  },
  {
   "t": "p",
   "html": "<p>公式一出来，三种特殊情况就清楚了。</p>\n<p>若 $\\frac{dy}{dt}=0$ 而 $\\frac{dx}{dt}\\ne0$，斜率是 0，切线<b>水平</b>，方程 $y=y_0$。若 $\\frac{dx}{dt}=0$ 而 $\\frac{dy}{dt}\\ne0$，分母为 0 而分子不为 0，斜率无穷大，切线<b>垂直</b>，方程 $x=x_0$。</p>\n<p>若两个同时为 0，公式变成 $\\frac00$，失效。这时点可能停一下再转向（尖点），也可能曲线自己穿过自己（自交点），必须单独判断。</p>"
  },
  {
   "t": "callout",
   "kind": "warn",
   "title": "两个导数同时为零，别急着下结论",
   "html": "<p>星形线 $x=\\cos^3t,\\ y=\\sin^3t$ 在 $t=0$ 处，$\\frac{dx}{dt}=-3\\cos^2t\\sin t=0$，$\\frac{dy}{dt}=3\\sin^2t\\cos t=0$，两个都是 0。</p>\n<p>这个点不是「没有切线」，而是曲线在这里拐了个尖。要判断方向，得看 $t\\to0$ 时 $\\frac{dy/dt}{dx/dt}$ 的极限，或者直接看图形。遇到两个导数为 0，写「公式失效、需单独讨论」，比硬套公式安全。</p>"
  },
  {
   "t": "tex",
   "tex": "\\frac{d^2y}{dx^2}=\\frac{\\dfrac{d}{dt}\\left(\\dfrac{dy}{dx}\\right)}{\\dfrac{dx}{dt}},\\qquad \\frac{dx}{dt}\\ne0"
  },
  {
   "t": "p",
   "html": "<p>二阶导描述<b>弯曲的方向</b>：$\\frac{d^2y}{dx^2} \\gt 0$ 时曲线凹向上（像一只碗），小于 0 时凹向下（像扣着的碗）。</p>\n<p>求法是「把 $\\frac{dy}{dx}$ 再对 $x$ 求一次导」。可 $\\frac{dy}{dx}$ 是 $t$ 的表达式，要对 $x$ 求导还得走链式法则：先对 $t$ 求导，再乘 $\\frac{dt}{dx}$，也就是<b>除以</b> $\\frac{dx}{dt}$。</p>\n<p>所以分母永远是 $\\frac{dx}{dt}$，不是 $\\frac{d^2x}{dt^2}$。这是这一节最容易写错的一行。</p>"
  },
  {
   "t": "quiz",
   "qid": "ch10-q3"
  },
  {
   "t": "p",
   "html": "<p>接下来算长度。一条弯弯曲曲的曲线，怎么量？</p>\n<p>办法还是「切碎」。把曲线切成很多很短的小段，短到每一段几乎就是直线。这一小段的横向长度是 $dx$，纵向长度是 $dy$，由勾股定理，它的长度是 $\\sqrt{(dx)^2+(dy)^2}$。把所有小段加起来，就是弧长。</p>"
  },
  {
   "t": "tex",
   "tex": "L=\\int_\\alpha^\\beta\\sqrt{\\left(\\frac{dx}{dt}\\right)^2+\\left(\\frac{dy}{dt}\\right)^2}\\,dt"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "写出 $dx,dy$ 和 $dt$ 的关系",
     "html": "$dx=\\frac{dx}{dt}dt$，$dy=\\frac{dy}{dt}dt$。$t$ 走一小步，$x,y$ 各走一小步。"
    },
    {
     "title": "代入勾股定理",
     "html": "把这一小段的长度记作 $ds$，由勾股定理 $ds=\\sqrt{(dx)^2+(dy)^2}=\\sqrt{\\left(\\frac{dx}{dt}\\right)^2(dt)^2+\\left(\\frac{dy}{dt}\\right)^2(dt)^2}$。"
    },
    {
     "title": "把 $dt$ 提到根号外",
     "html": "两项都含 $(dt)^2$，提出来开方得 $ds=\\sqrt{\\left(\\frac{dx}{dt}\\right)^2+\\left(\\frac{dy}{dt}\\right)^2}\\,dt$。因为 $dt \\gt 0$，开方不用加绝对值。再从 $\\alpha$ 积到 $\\beta$。"
    }
   ]
  },
  {
   "t": "p",
   "html": "<p>公式能用要满足两个条件。一是曲线<b>光滑</b>（smooth）：$\\frac{dx}{dt}$ 与 $\\frac{dy}{dt}$ 都连续，且不能同时为 0——同时为 0 说明动点停住了，可能出现尖点。二是 $t$ 从 $\\alpha$ 到 $\\beta$ 时曲线<b>恰好被走一遍</b>，不折返、不重复；走两遍就算出两倍长度。</p>\n<p>满足条件时，弧长与参数怎么选无关：换一种走法，长度不变。</p>\n<p>把上限看成变量，就得到<b>弧长函数</b> $s(t)=\\int_a^t\\sqrt{(f'(z))^2+(g'(z))^2}\\,dz$，它表示「从 $t=a$ 走到 $t$ 走了多远」。由微积分基本定理，$\\frac{ds}{dt}=\\sqrt{(dx/dt)^2+(dy/dt)^2}$。</p>"
  },
  {
   "t": "p",
   "html": "<p>再看面积。对 $y=f(x)$，曲线下方的面积是 $\\int y\\,dx$：把区域切成竖条，每条宽 $dx$、高 $y$，加起来就是面积。</p>\n<p>参数曲线用同一句话，只是 $y$ 和 $dx$ 都要换成 $t$ 的说法：$y$ 换成 $g(t)$，$dx$ 换成 $f'(t)\\,dt$。</p>"
  },
  {
   "t": "tex",
   "tex": "A=\\int_{x=f(\\alpha)}^{x=f(\\beta)}y\\,dx=\\int_\\alpha^\\beta g(t)\\,f'(t)\\,dt"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "从熟悉的式子出发",
     "html": "$A=\\int y\\,dx$，这里 $y$ 是被积函数，$x$ 是积分变量。"
    },
    {
     "title": "把 $x$ 换成 $t$",
     "html": "令 $x=f(t)$，则 $dx=f'(t)\\,dt$。积分限跟着换：$x=f(\\alpha)$ 对应 $t=\\alpha$，$x=f(\\beta)$ 对应 $t=\\beta$。"
    },
    {
     "title": "把 $y$ 也换成 $t$",
     "html": "曲线上的 $y$ 就是 $g(t)$，于是 $A=\\int_\\alpha^\\beta g(t)\\,f'(t)\\,dt$。"
    }
   ]
  },
  {
   "t": "p",
   "html": "<p>注意被积函数是 $g(t)f'(t)$，<b>不是</b> $g(t)f(t)$。前者是「高 × 宽的变化率」，后者没有几何意义。</p>\n<p>还要注意方向。如果 $x=f(t)$ 在区间上递减，$f'(t) \\lt 0$，积分出来是负的。这时要么把上下限对调，要么取绝对值。稳妥的做法是：先确认 $t$ 增大时 $x$ 往哪边走，让积分方向与「从左到右」一致。</p>"
  },
  {
   "t": "p",
   "html": "<p>把一段曲线绕 $x$ 轴转一圈，扫出一张曲面。还是切碎：取一小段弧，长度 $ds$，它到轴的距离是 $y$。这一小段转一圈扫出一条很窄的带子；把带子剪开摊平，近似一个矩形——长是转一圈的周长 $2\\pi y$，宽是 $ds$。所以这一小块面积是 $2\\pi y\\,ds$，加起来得 $S=\\int_\\alpha^\\beta 2\\pi y\\,ds$（要求 $y\\ge0$）。绕 $y$ 轴转时，到轴的距离换成 $x$，公式变成 $S=\\int 2\\pi x\\,ds$。</p>\n<p>顺手说一个「算不出来」的著名例子。椭圆 $\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1$（$a \\gt b$）的周长是 $P=4a\\int_0^{\\pi/2}\\sqrt{1-e^2\\sin^2t}\\,dt$，其中 $e=\\frac{\\sqrt{a^2-b^2}}{a}$ 是离心率。这个积分没有初等原函数，只能用级数或数值方法逼近。所以椭圆周长写成积分形式就是完整的答案，不必硬凑。</p>"
  },
  {
   "t": "lab",
   "id": "paramcurve"
  },
  {
   "t": "quiz",
   "qid": "ch10-q4"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "斜率",
     "html": "$\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$。它来自链式法则 $\\frac{dy}{dt}=\\frac{dy}{dx}\\cdot\\frac{dx}{dt}$，两边除以 $\\frac{dx}{dt}$。"
    },
    {
     "title": "二阶导",
     "html": "分子是对 $t$ 求导，分母永远是 $\\frac{dx}{dt}$，不是 $\\frac{d^2x}{dt^2}$。"
    },
    {
     "title": "长度与面积",
     "html": "$ds=\\sqrt{(dx/dt)^2+(dy/dt)^2}\\,dt$；$A=\\int g(t)f'(t)\\,dt$，宽是 $f'(t)dt$，不是 $f(t)dt$。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "10.3 极坐标：一个角度加一个距离（Polar Coordinates）",
   "id": "ch10-s5"
  },
  {
   "t": "p",
   "html": "<p>换一个场景。你在海上，雷达站告诉你：「目标在东北方向，距离 3 公里。」这句话里没有横坐标纵坐标，只有方向和距离，可它已经把位置说死了。</p>\n<p>这就是<b>极坐标</b>（polar coordinates）的想法：不设两条垂直的坐标轴，改成「从原点出发，朝哪个方向，走多远」。</p>\n<p>先固定两样东西：一个点 $O$，叫<b>极点</b>（pole），相当于直角坐标的原点；一条从 $O$ 出发的射线，叫<b>极轴</b>（polar axis），通常取 $x$ 轴正半轴。平面上一点 $P$ 就记作 $(r,\\theta)$。</p>"
  },
  {
   "t": "tex",
   "tex": "x=r\\cos\\theta,\\qquad y=r\\sin\\theta,\\qquad r^2=x^2+y^2,\\qquad \\tan\\theta=\\frac{y}{x}"
  },
  {
   "t": "p",
   "html": "<p>逐个说。$r$ 是 $O$ 到 $P$ 的<b>有向距离</b>；$\\theta$ 是极轴转到 $OP$ 的<b>有向角</b>，逆时针为正。这两个数和直角坐标说的是同一件事：$x=r\\cos\\theta$ 是「斜边乘余弦得横边」，$y=r\\sin\\theta$ 是「斜边乘正弦得竖边」。</p>\n<p>反过去，$r^2=x^2+y^2$ 来自勾股定理；$\\tan\\theta=\\frac yx$ 只给出相差 $\\pi$ 的两个候选角，必须结合点在第几象限来定。</p>\n<p>$r$ 允许是负数，这是极坐标最反直觉的地方。<b>负号表示「朝反方向量」</b>：先按 $\\theta$ 定出一条射线，再沿它的反方向走 $|r|$。等价说法是把角再转 $\\pi$，然后量正的 $r$，即 $(r,\\theta)=(-r,\\theta+\\pi)$。</p>"
  },
  {
   "t": "tex",
   "tex": "(r,\\theta)=(r,\\theta+2n\\pi)=(-r,\\theta+(2n+1)\\pi),\\qquad n\\in\\mathbb Z"
  },
  {
   "t": "p",
   "html": "<p>这个式子说明：<b>同一个点有无穷多种写法。</b>比如 $\\left(2,\\frac\\pi6\\right)$ 也可以写成 $\\left(2,\\frac\\pi6+2n\\pi\\right)$，还可以写成 $\\left(-2,\\frac{7\\pi}6+2n\\pi\\right)$。</p>\n<p>先认清两个简单方程：$r=a$ 是以极点为圆心、半径 $|a|$ 的圆；$\\theta=\\theta_0$ 是过极点、倾角 $\\theta_0$ 的<b>整条直线</b>——因为 $r$ 可以取负，只取 $r\\ge0$ 只是半条射线。</p>"
  },
  {
   "t": "callout",
   "kind": "warn",
   "title": "求交点，别只解一个方程",
   "html": "<p>教材里的典型例子：$r=2\\cos\\frac\\theta3$ 与圆 $r=\\sqrt2$。解 $2\\cos\\frac\\theta3=\\sqrt2$ 只能得到 $\\left(\\sqrt2,\\frac{3\\pi}4\\right)$ 一个交点。</p>\n<p>另一个交点 $\\left(\\sqrt2,\\frac{5\\pi}4\\right)$ 要用 $2\\cos\\frac\\theta3=-\\sqrt2$ 才解得出来——它对应「其中一条曲线用负半径描述同一个点」。</p>\n<p>所以求极坐标交点要解<b>两个方程</b>：$f_1=f_2$ 和 $f_1=-f_2$，最后一定画图核对。</p>"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "含一次项的极坐标方程：两边同乘 $r$",
     "html": "$r=2\\cos\\theta-4\\sin\\theta$ 两边乘 $r$，得 $r^2=2r\\cos\\theta-4r\\sin\\theta$，即 $x^2+y^2=2x-4y$。配方得 $(x-1)^2+(y+2)^2=5$，是圆心 $(1,-2)$、半径 $\\sqrt5$ 的圆。"
    },
    {
     "title": "直角坐标化极坐标：先展开再凑 $r^2$",
     "html": "$x^2+(y-3)^2=9$ 展开成 $x^2+y^2=6y$。把 $x^2+y^2$ 换成 $r^2$、$y$ 换成 $r\\sin\\theta$，得 $r^2=6r\\sin\\theta$，即 $r=0$ 或 $r=6\\sin\\theta$。$r=0$ 是极点，已经包含在 $r=6\\sin\\theta$ 里（$\\theta=0$ 时 $r=0$），所以答案是 $r=6\\sin\\theta$。"
    },
    {
     "title": "含平方项的：直接代入",
     "html": "$r^2\\cos^2\\theta-r^2\\sin^2\\theta=1$ 就是 $x^2-y^2=1$；$r^2\\cos\\theta\\sin\\theta=4$ 就是 $xy=4$。"
    }
   ]
  },
  {
   "t": "quiz",
   "qid": "ch10-q5"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "极坐标是什么",
     "html": "用「距离 $r$ + 角度 $\\theta$」定位一个点。$x=r\\cos\\theta$，$y=r\\sin\\theta$。"
    },
    {
     "title": "表示不唯一",
     "html": "$(r,\\theta)=(r,\\theta+2n\\pi)=(-r,\\theta+(2n+1)\\pi)$，同一个点有无穷多种写法。"
    },
    {
     "title": "求交点",
     "html": "要解 $f_1=f_2$ 和 $f_1=-f_2$ 两个方程，再画图核对。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "10.4 极坐标曲线怎么画：对称性、零点、极值（Graphing Polar Coordinate Equations）",
   "id": "ch10-s6"
  },
  {
   "t": "p",
   "html": "<p>画极坐标曲线之前，先做对称性检验。设 $(r,\\theta)$ 是曲线上的点，那么：</p>\n<ul>\n<li>关于 $x$ 轴对称：$(r,-\\theta)$ 也在曲线上，等价写法是 $(-r,\\pi-\\theta)$。</li>\n<li>关于 $y$ 轴对称：$(r,\\pi-\\theta)$ 也在曲线上，等价写法是 $(-r,-\\theta)$。</li>\n<li>关于原点对称：$(r,\\theta+\\pi)$ 也在曲线上，等价写法是 $(-r,\\theta)$。</li>\n</ul>\n<p>这三条只是<b>充分</b>检验：一条都验不出来，不代表曲线没有对称性，可能换一种等价写法才验得出来。所以对称性用来省事，不用来下结论。</p>"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "用对称性砍区间",
     "html": "如果曲线关于 $x$ 轴对称，只讨论 $\\theta\\in[0,\\pi]$，另一半镜像过去。"
    },
    {
     "title": "找曲线过极点的角度",
     "html": "解 $r=f(\\theta)=0$，这些角度是曲线穿过极点的位置，也是分段的天然边界。"
    },
    {
     "title": "看 $r$ 的最大、最小与增减",
     "html": "求 $f'$ 的零点，找出最近点和最远点，这一步决定图形「鼓」在哪里。"
    },
    {
     "title": "先画 $r\\theta$ 图当表，再转成 $xy$ 图",
     "html": "把 $r=f(\\theta)$ 当普通函数画出来，横轴 $\\theta$、纵轴 $r$，照着它描点。机器作图时就是把它当成参数方程 $x=f(\\theta)\\cos\\theta,\\ y=f(\\theta)\\sin\\theta$。"
    }
   ]
  },
  {
   "t": "p",
   "html": "<p>想在极坐标曲线上求切线，最省事的办法是把它<b>当成参数曲线</b>：把 $\\theta$ 当参数，$x=f(\\theta)\\cos\\theta$，$y=f(\\theta)\\sin\\theta$，再用 10.2 的 $\\frac{dy}{dx}=\\frac{dy/d\\theta}{dx/d\\theta}$。</p>"
  },
  {
   "t": "tex",
   "tex": "\\frac{dy}{dx}=\\frac{f'(\\theta)\\sin\\theta+f(\\theta)\\cos\\theta}{f'(\\theta)\\cos\\theta-f(\\theta)\\sin\\theta}"
  },
  {
   "t": "callout",
   "kind": "warn",
   "title": "$\\frac{dy}{dx}$ 不是 $\\frac{dr}{d\\theta}$",
   "html": "<p>这是极坐标里最常见的混淆。$\\frac{dr}{d\\theta}$ 说的是「半径随角度变多快」，它描述的是 $r\\theta$ 平面上的斜率，不是 $xy$ 平面上的切线斜率。</p>\n<p>真正的切线斜率要把 $x,y$ 都对 $\\theta$ 求导再相除。还有一个好用的结论：曲线经过极点时 $f(\\theta_0)=0$，那里的切线斜率就是 $\\tan\\theta_0$。</p>"
  },
  {
   "t": "table",
   "head": [
    "名称",
    "典型方程",
    "长什么样"
   ],
   "rows": [
    [
     "心形线 cardioid",
     "$r=a(1-\\cos\\theta)$、$r=a(1+\\cos\\theta)$",
     "关于 $x$ 轴对称，尖点在极点，$0\\le r\\le2a$"
    ],
    [
     "蜗线 limaçon",
     "$r=a\\pm b\\cos\\theta$（$a,b \\gt 0$）",
     "$a \\gt b$ 无环；$a=b$ 就是心形线；$a \\lt b$ 出现内环"
    ],
    [
     "玫瑰线 rose",
     "$r=a\\cos n\\theta$",
     "$n$ 为奇数有 $n$ 瓣，$n$ 为偶数有 $2n$ 瓣，每瓣最远到 $|a|$"
    ],
    [
     "双纽线 lemniscate",
     "$r^2=a^2\\cos2\\theta$",
     "「∞」形两环；要 $\\cos2\\theta\\ge0$ 才有实图"
    ],
    [
     "螺线 spiral",
     "$r=\\theta$、$r=e^{\\theta/10}$、$r=8/\\theta$",
     "随 $\\theta$ 增大不断向外（或向内）缠绕"
    ]
   ]
  },
  {
   "t": "quiz",
   "qid": "ch10-q6"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "10.5 极坐标下的面积与弧长：把区域切成小扇形（Areas and Lengths in Polar Coordinates）",
   "id": "ch10-s7"
  },
  {
   "t": "p",
   "html": "<p>极坐标下算面积，思路和直角坐标一样：切碎、求和、取极限。只是切法不同——直角坐标切竖条，极坐标切<b>小扇形</b>。</p>\n<p>先回忆一个事实：整个圆的面积是 $\\pi r^2$，对应一整个 $2\\pi$ 的角度。那么角度只占 $\\Delta\\theta$ 的一小块扇形，面积按比例分：$\\frac{\\Delta\\theta}{2\\pi}\\cdot\\pi r^2=\\frac12r^2\\Delta\\theta$。把这一小块的面积记作 $dA$，就是 $dA=\\frac12r^2\\,d\\theta$。</p>\n<p>公式有两个前提：$r\\ge0$，且角度区间长度不超过 $2\\pi$。不满足的话，区域会自我重叠（算重）或扫出负面积，这时先按对称性把区域分块。</p>\n<p>如果要算的是两条曲线<b>之间</b>的区域，内圈是 $r_1(\\theta)$、外圈是 $r_2(\\theta)$，那么每一小块就是外圈扇形减内圈扇形，积分限由两条曲线的交点决定。</p>"
  },
  {
   "t": "tex",
   "tex": "dA=\\frac12r^2\\,d\\theta,\\qquad A=\\int_\\alpha^\\beta\\frac12r^2\\,d\\theta,\\qquad A=\\frac12\\int_\\alpha^\\beta\\left(r_2^2-r_1^2\\right)d\\theta"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "取一小块角度",
     "html": "在 $\\theta$ 处取一小段 $d\\theta$。这一小段扫过的区域，两条边是射线，外边是一小段曲线。"
    },
    {
     "title": "在小块里把 $r$ 当常数",
     "html": "$d\\theta$ 很小时，这块区域里的 $r$ 几乎不变，可以当成半径 $r$、圆心角 $d\\theta$ 的扇形，面积 $\\frac12r^2d\\theta$。"
    },
    {
     "title": "累加取极限",
     "html": "从 $\\alpha$ 到 $\\beta$ 把所有小扇形加起来，就是 $A=\\int_\\alpha^\\beta\\frac12r^2\\,d\\theta$。"
    }
   ]
  },
  {
   "t": "callout",
   "kind": "warn",
   "title": "积分限定错，面积一定错",
   "html": "<p>极坐标面积题，难的不是积分，是定限。三个常见坑：</p>\n<p>① 只解 $f_1=f_2$，漏掉 $f_1=-f_2$ 给出的交点；② 一律从 $0$ 积到 $2\\pi$，把只覆盖一部分的区域算重；③ 没注意 $r \\lt 0$ 的那一段，把内环画到外面去了。</p>\n<p>稳妥流程：先画图，标出所有交点，再看「从哪条射线扫到哪条射线正好扫完这块区域」。</p>"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "还是从 $ds=\\sqrt{(dx)^2+(dy)^2}$ 出发",
     "html": "极坐标的弧长没有新原理。把 $x=r\\cos\\theta$、$y=r\\sin\\theta$ 对 $\\theta$ 求导即可。记 $r'=\\frac{dr}{d\\theta}$。"
    },
    {
     "title": "求导，再把平方相加",
     "html": "$\\frac{dx}{d\\theta}=r'\\cos\\theta-r\\sin\\theta$，$\\frac{dy}{d\\theta}=r'\\sin\\theta+r\\cos\\theta$。平方相加时，交叉项 $-2rr'\\sin\\theta\\cos\\theta$ 与 $+2rr'\\sin\\theta\\cos\\theta$ 正好抵消，剩下的用 $\\sin^2+\\cos^2=1$ 并成 $r'^2+r^2$。"
    },
    {
     "title": "开方得弧长元",
     "html": "$ds=\\sqrt{r^2+r'^2}\\,d\\theta$，所以 $L=\\int_\\alpha^\\beta\\sqrt{r^2+\\left(\\frac{dr}{d\\theta}\\right)^2}\\,d\\theta$。"
    }
   ]
  },
  {
   "t": "tex",
   "tex": "L=\\int_\\alpha^\\beta\\sqrt{r^2+\\left(\\frac{dr}{d\\theta}\\right)^2}\\,d\\theta"
  },
  {
   "t": "p",
   "html": "<p>拿心形线 $r=1-\\cos\\theta$ 练一次，求它的周长。$r'=\\sin\\theta$，所以 $r^2+r'^2=(1-\\cos\\theta)^2+\\sin^2\\theta=2-2\\cos\\theta$。</p>\n<p>用半角公式 $1-\\cos\\theta=2\\sin^2\\frac\\theta2$，得 $\\sqrt{2-2\\cos\\theta}=2\\left|\\sin\\frac\\theta2\\right|$。在 $0\\le\\theta\\le2\\pi$ 上，$\\frac\\theta2\\in[0,\\pi]$，正弦非负，绝对值可以直接去掉。于是 $L=\\int_0^{2\\pi}2\\sin\\frac\\theta2\\,d\\theta=\\left[-4\\cos\\frac\\theta2\\right]_0^{2\\pi}=4+4=8$。</p>"
  },
  {
   "t": "lab",
   "id": "polar"
  },
  {
   "t": "quiz",
   "qid": "ch10-q7"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "面积元",
     "html": "$dA=\\frac12r^2d\\theta$ 来自小扇形面积，所以 $A=\\frac12\\int_\\alpha^\\beta r^2\\,d\\theta$。"
    },
    {
     "title": "两块之间",
     "html": "$A=\\frac12\\int\\left(r_2^2-r_1^2\\right)d\\theta$，积分限由交点决定。"
    },
    {
     "title": "弧长",
     "html": "$L=\\int\\sqrt{r^2+r'^2}\\,d\\theta$，它和参数曲线的 $ds$ 是同一个东西。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "10.6 圆锥曲线：一个焦点、一条准线（Conic Sections）",
   "id": "ch10-s8"
  },
  {
   "t": "p",
   "html": "<p>「圆锥曲线」（conic sections）这个名字很直白：用一个平面去切一个双圆锥，切口边缘就是圆、椭圆、抛物线或双曲线。平面过顶点时，退化成一点或两条直线。</p>\n<p>但切割方式不好算。真正好用的是<b>到定点与定直线的距离关系</b>：抛物线是到焦点与准线等距；椭圆是到两个焦点距离之<b>和</b>为常数；双曲线是到两个焦点距离之<b>差的绝对值</b>为常数。三种定义只差一个字，形状就差很远。</p>"
  },
  {
   "t": "table",
   "head": [
    "曲线与标准方程",
    "焦点与关键量"
   ],
   "rows": [
    [
     "抛物线 $x^2=4py$",
     "焦点 $(0,p)$，准线 $y=-p$；$|p|$ 是顶点到焦点的距离，顶点在焦点与准线正中"
    ],
    [
     "椭圆 $\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1\\ (a \\gt b)$",
     "$b^2=a^2-c^2$，焦点 $(\\pm c,0)$，长轴 $2a$、短轴 $2b$"
    ],
    [
     "双曲线 $\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1$",
     "$c^2=a^2+b^2$，焦点 $(\\pm c,0)$，渐近线 $y=\\pm\\frac bax$"
    ]
   ]
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "同类项归拢",
     "html": "$x^2-4y^2+2x+8y-7=0$。$x$ 的项放一起：$x^2+2x$；$y$ 的项放一起：$-4y^2+8y$。"
    },
    {
     "title": "各自配方",
     "html": "$x^2+2x=(x+1)^2-1$；$-4(y^2-2y)=-4\\left[(y-1)^2-1\\right]=-4(y-1)^2+4$。"
    },
    {
     "title": "代回并整理",
     "html": "$(x+1)^2-1-4(y-1)^2+4-7=0$，即 $(x+1)^2-4(y-1)^2=4$，两边除以 4 得 $\\frac{(x+1)^2}{4}-(y-1)^2=1$。"
    },
    {
     "title": "读要素",
     "html": "中心 $(-1,1)$，$a=2$，$b=1$，$c=\\sqrt5$，焦点 $\\left(-1\\pm\\sqrt5,1\\right)$，渐近线 $y-1=\\pm\\frac12(x+1)$。"
    }
   ]
  },
  {
   "t": "p",
   "html": "<p>如果方程里有 $xy$ 项，比如 $Ax^2+Bxy+Cy^2+\\cdots=0$，说明这条曲线被转过了一个角度。先算判别式 $B^2-4AC$：小于 0 是椭圆型，等于 0 是抛物线型，大于 0 是双曲线型。</p>\n<p>要写出标准形，得把坐标转回去。取旋转角 $\\alpha$ 满足 $\\cot2\\alpha=\\frac{A-C}{B}$（取 $0 \\lt \\alpha \\lt \\frac\\pi2$），作代换 $x=X\\cos\\alpha-Y\\sin\\alpha,\\ y=X\\sin\\alpha+Y\\cos\\alpha$，$XY$ 项就消失了，再配方平移即可。</p>"
  },
  {
   "t": "quiz",
   "qid": "ch10-q9"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "三种定义",
     "html": "抛物线到焦点与准线等距；椭圆到两焦点距离之和为常数；双曲线是差的绝对值为常数。"
    },
    {
     "title": "两个关系",
     "html": "椭圆 $b^2=a^2-c^2$，双曲线 $c^2=a^2+b^2$。"
    },
    {
     "title": "有 $xy$ 项",
     "html": "先算 $B^2-4AC$ 判型，再用 $\\cot2\\alpha=\\frac{A-C}{B}$ 定旋转角。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "10.7 极坐标下的圆锥曲线：三种曲线一个方程（Conics in Polar Coordinates）",
   "id": "ch10-s9"
  },
  {
   "t": "p",
   "html": "<p>先给三种曲线一个统一的形状参数：<b>离心率</b>（eccentricity）$e=\\frac ca$，其中 $c$ 是半焦距，$a$ 是半长轴（双曲线里是半实轴）。椭圆 $e \\lt 1$，抛物线 $e=1$，双曲线 $e \\gt 1$。$e$ 越接近 1，椭圆越扁。</p>\n<p>然后是一句把三种曲线全包住的话：设 $F$ 是焦点，$D$ 是点 $P$ 到对应准线的垂足，若 $PF=e\\cdot PD$，则 $e=1$ 时是抛物线，$e \\lt 1$ 时是椭圆，$e \\gt 1$ 时是双曲线。</p>"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "把焦点放在极点",
     "html": "设焦点在极点 $O$，准线是竖直线 $x=k$（$k \\gt 0$）。点 $P$ 的极坐标是 $(r,\\theta)$，先设 $r \\gt 0$。"
    },
    {
     "title": "写出两个距离",
     "html": "$PF$ 就是 $r$。$P$ 到准线 $x=k$ 的距离是 $PD=k-r\\cos\\theta$，因为 $P$ 的横坐标是 $r\\cos\\theta$，离 $x=k$ 还差这么多。"
    },
    {
     "title": "代入定义，解出 $r$",
     "html": "$r=e(k-r\\cos\\theta)$，即 $r+er\\cos\\theta=ke$，所以 $r=\\frac{ke}{1+e\\cos\\theta}$。"
    }
   ]
  },
  {
   "t": "tex",
   "tex": "r=\\frac{ke}{1+e\\cos\\theta}"
  },
  {
   "t": "table",
   "head": [
    "准线位置",
    "极坐标方程"
   ],
   "rows": [
    [
     "$x=k$（在右）",
     "$r=\\dfrac{ke}{1+e\\cos\\theta}$"
    ],
    [
     "$x=-k$（在左）",
     "$r=\\dfrac{ke}{1-e\\cos\\theta}$"
    ],
    [
     "$y=k$（在上）",
     "$r=\\dfrac{ke}{1+e\\sin\\theta}$"
    ],
    [
     "$y=-k$（在下）",
     "$r=\\dfrac{ke}{1-e\\sin\\theta}$"
    ]
   ]
  },
  {
   "t": "p",
   "html": "<p>对椭圆，$k$ 和 $a,e$ 之间有关系 $ke=a(1-e^2)$，代回去得 $r=\\frac{a(1-e^2)}{1+e\\cos\\theta}$。当 $e=0$ 时它退化成 $r=a$，也就是圆——圆是离心率为 0 的椭圆。</p>\n<p>顺便记住极坐标里最常用的两个图形。过极点、圆心在 $(a,\\theta_0)$、半径为 $a$ 的圆：$r=2a\\cos(\\theta-\\theta_0)$，特例是 $r=2a\\cos\\theta$ 与 $r=2a\\sin\\theta$。不过极点、离极点最近距离为 $r_0$、垂足方向为 $\\theta_0$ 的直线：$r\\cos(\\theta-\\theta_0)=r_0$。</p>"
  },
  {
   "t": "quiz",
   "qid": "ch10-q10"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "统一方程",
     "html": "$r=\\frac{ke}{1\\pm e\\cos\\theta}$（准线竖直），准线水平就把 $\\cos$ 换成 $\\sin$。"
    },
    {
     "title": "怎么读",
     "html": "先把分母常数项化成 1，再读 $e$ 与 $k$：$e$ 定类型，$k$ 定准线位置。"
    },
    {
     "title": "椭圆",
     "html": "$ke=a(1-e^2)$，据此由方程反求半长轴。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "例题：跟着做一遍",
   "id": "ch10-s10"
  },
  {
   "t": "list",
   "items": [
    "给一组参数方程，要你消参并说明轨迹范围。<b>抓手</b>：解出一个 $t$ 代入，或凑恒等式；最后把 $t$ 的范围翻译成 $x,y$ 的限制。",
    "求参数曲线的切线、水平切线与垂直切线。<b>抓手</b>：先算 $\\frac{dx}{dt}$ 与 $\\frac{dy}{dt}$ 再相除；分子为零看水平，分母为零看垂直，两边同时为零要单独讨论。",
    "求参数曲线的弧长、面积与旋转曲面面积。<b>抓手</b>：先把 $ds$ 或 $dx$ 换成 $t$ 的表达式，能开方就开方，再用对称性把区间缩小。",
    "极坐标与直角坐标互化。<b>抓手</b>：极坐标化直角坐标常常两边乘 $r$；直角坐标化极坐标常常先展开再配方。",
    "极坐标求面积（包括两条曲线之间的区域）。<b>抓手</b>：先画图，求全部交点（两个方程都要解），再决定从哪条射线扫到哪条射线。",
    "识别圆锥曲线并读出要素。<b>抓手</b>：没有 $xy$ 项就配方；有 $xy$ 项先算 $B^2-4AC$；极坐标方程先把分母常数项归一化，再读 $e$ 与 $k$。"
   ],
   "ordered": false
  },
  {
   "t": "example",
   "no": "1",
   "tag": "参数曲线的切线、水平切线与垂直切线（10.2）",
   "fields": [
    {
     "k": "题目",
     "html": "<p>设曲线 $x=t^3-3t,\\quad y=t^2$。</p><p>(1) 求 $t=2$ 处的切线方程；(2) 求曲线上有水平切线的点与有垂直切线的点；(3) 判断 $t=0$ 处曲线是凹向上还是凹向下。</p>"
    },
    {
     "k": "想一想",
     "html": "<p>曲线是参数形式，第一步一定是把 $\\frac{dx}{dt}$ 和 $\\frac{dy}{dt}$ 算出来，再用 $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$。</p><p>水平切线对应「$y$ 暂时不变」，即 $\\frac{dy}{dt}=0$；垂直切线对应「$x$ 暂时不变」，即 $\\frac{dx}{dt}=0$。两种都要检查另一个导数不为 0，否则公式失效。</p><p>凹凸性看二阶导的符号，别忘了最后要除以 $\\frac{dx}{dt}$。</p>"
    },
    {
     "k": "解答",
     "html": "<p>先求导：</p>$$\\frac{dx}{dt}=3t^2-3=3(t^2-1),\\qquad \\frac{dy}{dt}=2t,\\qquad \\frac{dy}{dx}=\\frac{2t}{3(t^2-1)}.$$<p><b>(1)</b> $t=2$ 时 $\\frac{dy}{dx}=\\frac{4}{3\\cdot3}=\\frac49$，对应点是 $(8-6,\\ 4)=(2,4)$。切线方程 $y-4=\\frac49(x-2)$，整理得 $y=\\frac49x+\\frac{28}9$。</p><p><b>(2)</b> 水平切线：令 $\\frac{dy}{dt}=2t=0$，得 $t=0$，此时 $\\frac{dx}{dt}=-3\\ne0$，点为 $(0,0)$，切线 $y=0$。</p><p>垂直切线：令 $\\frac{dx}{dt}=3(t^2-1)=0$，得 $t=\\pm1$，此时 $\\frac{dy}{dt}=\\pm2\\ne0$。$t=1$ 时点为 $(-2,1)$，切线 $x=-2$；$t=-1$ 时点为 $(2,1)$，切线 $x=2$。</p><p><b>(3)</b> 对 $\\frac{dy}{dx}$ 用商法则对 $t$ 求导：</p>$$\\frac{d}{dt}\\left(\\frac{2t}{3(t^2-1)}\\right)=\\frac{2\\cdot3(t^2-1)-2t\\cdot6t}{9(t^2-1)^2}=\\frac{-6(t^2+1)}{9(t^2-1)^2}.$$<p>再除以 $\\frac{dx}{dt}=3(t^2-1)$：</p>$$\\frac{d^2y}{dx^2}=\\frac{-6(t^2+1)}{9(t^2-1)^2}\\cdot\\frac{1}{3(t^2-1)}=\\frac{-2(t^2+1)}{9(t^2-1)^3}.$$<p>代入 $t=0$ 得 $\\frac{-2}{9\\cdot(-1)}=\\frac29 \\gt 0$，所以 $t=0$ 处曲线<b>凹向上</b>。</p>"
    },
    {
     "k": "点评",
     "html": "<p>最容易丢的是二阶导最后那一步除法：分子已经算好了，别忘了再除以 $\\frac{dx}{dt}$。商法则的分子次序也别写反。</p><p>求垂直切线时要确认 $\\frac{dy}{dt}\\ne0$。如果两个导数同时为 0（比如星形线在 $t=0,\\frac\\pi2,\\pi,\\frac{3\\pi}2$），那一点要单独讨论，不能直接说「垂直切线」。</p>"
    }
   ]
  },
  {
   "t": "example",
   "no": "2",
   "tag": "参数曲线的弧长与旋转曲面面积（10.2）",
   "fields": [
    {
     "k": "题目",
     "html": "<p>星形线 $x=\\cos^3t,\\quad y=\\sin^3t,\\quad 0\\le t\\le2\\pi$。</p><p>(1) 求全长；(2) 求它绕 $x$ 轴旋转所得曲面的面积。</p>"
    },
    {
     "k": "想一想",
     "html": "<p>先把弧长元 $ds$ 算出来，化简时会出现 $|\\cos t\\sin t|$，绝对值先留着。</p><p>星形线关于两条坐标轴都对称，所以只算第一象限那一段再乘 4。旋转曲面只取上半支（$y\\ge0$），否则上下两支扫出的面积会互相抵消。</p>"
    },
    {
     "k": "解答",
     "html": "<p>求导：</p>$$\\frac{dx}{dt}=-3\\cos^2t\\sin t,\\qquad \\frac{dy}{dt}=3\\sin^2t\\cos t,$$<p>所以</p>$$\\sqrt{\\left(\\frac{dx}{dt}\\right)^2+\\left(\\frac{dy}{dt}\\right)^2}=3|\\cos t\\sin t|=\\frac32|\\sin2t|.$$<p><b>(1)</b> 四条对称段每段一样长，取 $0\\le t\\le\\frac\\pi2$ 再乘 4：</p>$$L=4\\int_0^{\\pi/2}3\\cos t\\sin t\\,dt=12\\left[\\frac{\\sin^2t}{2}\\right]_0^{\\pi/2}=12\\cdot\\frac12=6.$$<p><b>(2)</b> 上半支对应 $0\\le t\\le\\pi$，此时 $y=\\sin^3t\\ge0$。绕 $x$ 轴转一圈就扫出整个曲面：</p>$$S=\\int_0^{\\pi}2\\pi\\sin^3t\\cdot3|\\cos t\\sin t|\\,dt=6\\pi\\int_0^{\\pi}\\sin^4t\\,|\\cos t|\\,dt.$$<p>按 $\\cos t$ 在 $\\left[0,\\frac\\pi2\\right]$ 为正、在 $\\left[\\frac\\pi2,\\pi\\right]$ 为负拆开：</p>$$\\int_0^{\\pi}\\sin^4t|\\cos t|\\,dt=\\int_0^{\\pi/2}\\sin^4t\\cos t\\,dt-\\int_{\\pi/2}^{\\pi}\\sin^4t\\cos t\\,dt=\\frac15-\\left(-\\frac15\\right)=\\frac25.$$<p>所以 $S=6\\pi\\cdot\\frac25=\\frac{12\\pi}{5}$。</p>"
    },
    {
     "k": "点评",
     "html": "<p>① $ds$ 里的 $3|\\cos t\\sin t|$ 不能丢绝对值；② 旋转曲面只取上半支，如果对 $0\\le t\\le2\\pi$ 直接积分会得到 $S=0$，因为上下两支抵消；③ 记两个结果：星形线（$a=1$）全长 $6$、绕 $x$ 轴的旋转面面积 $\\frac{12\\pi}5$；摆线一拱弧长 $8a$、面积 $3\\pi a^2$、旋转面 $\\frac{64\\pi a^2}{3}$。</p>"
    }
   ]
  },
  {
   "t": "example",
   "no": "3",
   "tag": "极坐标下的面积（10.5）",
   "fields": [
    {
     "k": "题目",
     "html": "<p>(1) 求心形线 $r=1-\\cos\\theta$ 所围区域的面积；(2) 求圆 $r=1$ 内部、且在心脏线 $r=1-\\cos\\theta$ 外部的区域面积。</p>"
    },
    {
     "k": "想一想",
     "html": "<p>(1) 直接用 $A=\\int\\frac12r^2d\\theta$。心形线关于 $x$ 轴对称，可以只算上半再乘 2，省一半计算。</p><p>(2) 先要弄清两件事：区域长在哪一段角度上，以及哪条曲线在外、哪条在内。这得画图，再解交点。</p>"
    },
    {
     "k": "解答",
     "html": "<p><b>(1)</b> 关于 $x$ 轴对称，$\\theta$ 从 0 到 $\\pi$ 描出上半部分，所以</p>$$A=2\\int_0^{\\pi}\\frac12(1-\\cos\\theta)^2d\\theta=\\int_0^{\\pi}\\left(1-2\\cos\\theta+\\cos^2\\theta\\right)d\\theta.$$<p>代入 $\\cos^2\\theta=\\frac{1+\\cos2\\theta}{2}$：</p>$$A=\\int_0^{\\pi}\\left(\\frac32-2\\cos\\theta+\\frac12\\cos2\\theta\\right)d\\theta=\\left[\\frac32\\theta-2\\sin\\theta+\\frac14\\sin2\\theta\\right]_0^{\\pi}=\\frac{3\\pi}{2}.$$<p><b>(2)</b> 先求交点：$1=1-\\cos\\theta$，得 $\\cos\\theta=0$，即 $\\theta=\\pm\\frac\\pi2$。</p><p>在 $0\\le\\theta\\le\\frac\\pi2$ 上，$1-\\cos\\theta$ 从 0 涨到 1，所以圆 $r=1$ 在外、心形线在内。区域关于 $x$ 轴对称，取上半再乘 2：</p>$$A=2\\int_0^{\\pi/2}\\frac12\\left[1^2-(1-\\cos\\theta)^2\\right]d\\theta=\\int_0^{\\pi/2}\\left(2\\cos\\theta-\\cos^2\\theta\\right)d\\theta.$$<p>再用 $\\cos^2\\theta=\\frac{1+\\cos2\\theta}{2}$：</p>$$A=\\int_0^{\\pi/2}\\left(2\\cos\\theta-\\frac12-\\frac12\\cos2\\theta\\right)d\\theta=\\left[2\\sin\\theta-\\frac\\theta2-\\frac{\\sin2\\theta}{4}\\right]_0^{\\pi/2}=2-\\frac\\pi4=\\frac{8-\\pi}{4}.$$"
    },
    {
     "k": "点评",
     "html": "<p>① 面积公式里的 $\\frac12$ 和 $r^2$ 一个都不能漏；② 第 (2) 问必须先画图确认「谁在外、谁在内」，否则 $(r_2^2-r_1^2)$ 会写反，结果变成负数；③ 积分限若写成 $0\\to2\\pi$，会把区域重复计算；④ 心形线 $r=a(1-\\cos\\theta)$ 的面积是 $\\frac{3\\pi a^2}2$，可以记下来当检验。</p>"
    }
   ]
  },
  {
   "t": "example",
   "no": "4",
   "tag": "极坐标与直角坐标互化、极坐标曲线作图（10.3 / 10.4）",
   "fields": [
    {
     "k": "题目",
     "html": "<p>(1) 把 $r=2\\cos\\theta-4\\sin\\theta$ 化为直角坐标方程，说明它是什么图形；(2) 讨论 $r=1+2\\cos\\theta$ 的对称性、零点与极值，说明它是什么曲线。</p>"
    },
    {
     "k": "想一想",
     "html": "<p>(1) 方程里出现 $\\cos\\theta,\\sin\\theta$ 的一次项，两边同乘 $r$ 就能造出 $r^2$、$r\\cos\\theta$、$r\\sin\\theta$ 三个可替换的量。</p><p>(2) 用 10.4 的三步：先验对称性，再解 $r=0$，最后看 $r$ 的最大最小值。注意 $r$ 为负的那一段画在反方向。</p>"
    },
    {
     "k": "解答",
     "html": "<p><b>(1)</b> 两边同乘 $r$：</p>$$r^2=2r\\cos\\theta-4r\\sin\\theta\\ \\Longrightarrow\\ x^2+y^2=2x-4y.$$<p>配方：</p>$$(x^2-2x+1)+(y^2+4y+4)=5\\ \\Longrightarrow\\ (x-1)^2+(y+2)^2=5.$$<p>图形是圆心 $(1,-2)$、半径 $\\sqrt5$ 的圆，且过极点（$r=0$ 时方程成立）。</p><p><b>(2)</b> 记 $f(\\theta)=1+2\\cos\\theta$。</p><p>① 对称性：$f(-\\theta)=f(\\theta)$，曲线关于 $x$ 轴对称，只需讨论 $0\\le\\theta\\le\\pi$ 再镜像。</p><p>② 零点：$1+2\\cos\\theta=0$ 得 $\\cos\\theta=-\\frac12$，即 $\\theta=\\frac{2\\pi}3,\\frac{4\\pi}3$。曲线两次经过极点，过极点处的切线斜率分别是 $\\tan\\frac{2\\pi}3=-\\sqrt3$ 与 $\\tan\\frac{4\\pi}3=\\sqrt3$。</p><p>③ 极值：$\\theta=0$ 时 $r_{\\max}=3$，对应最远点 $(3,0)$；$\\theta=\\pi$ 时 $r_{\\min}=-1$，按 $(-r,\\theta+\\pi)=(1,0)$ 换算，这是<b>内环</b>的最右点。</p><p>④ 判形：方程形如 $r=a+b\\cos\\theta$，且 $a=1 \\lt b=2$，所以是<b>带内环的蜗线</b>。内环由 $\\frac{2\\pi}3 \\lt \\theta \\lt \\frac{4\\pi}3$ 上 $r \\lt 0$ 的那段描出，落在 $0 \\lt x \\lt 1$ 内；外圈由其余部分描出，最远到 $(3,0)$。</p>"
    },
    {
     "k": "点评",
     "html": "<p>① 极坐标化直角坐标的关键动作是「乘 $r$」；② 最易错的是把 $r=-1$（$\\theta=\\pi$）当成「极轴负半轴上距极点 1 的点」。按定义它是点 $(1,0)$，也就是内环的右端点；③ 玫瑰线 $r=\\cos n\\theta$：$n$ 为奇数得 $n$ 瓣，$n$ 为偶数得 $2n$ 瓣，因为每瓣被正 $r$、负 $r$ 各描了一次。</p>"
    }
   ]
  },
  {
   "t": "example",
   "no": "5",
   "tag": "圆锥曲线的极坐标方程与类型识别（10.7 / 10.6）",
   "fields": [
    {
     "k": "题目",
     "html": "<p>(1) 焦点在极点、离心率 $e=\\frac32$、对应准线为 $x=2$，求极坐标方程并判断类型；(2) 判断 $r=\\dfrac{12}{3+\\sin\\theta}$ 是什么曲线，求离心率、准线与半长轴；(3) 判断 $x^2+4xy+y^2=1$ 的类型，并求旋转角。</p>"
    },
    {
     "k": "想一想",
     "html": "<p>(1)(2) 都用统一方程 $r=\\frac{ke}{1\\pm e\\cos\\theta}$。读参数之前，先把分母的常数项化成 1，否则会把 $\\frac{12}{3+\\sin\\theta}$ 里的 3 误当成 $k$。</p><p>(3) 有 $xy$ 项就先算 $B^2-4AC$ 判型，再用 $\\cot2\\alpha=\\frac{A-C}{B}$ 定旋转角。</p>"
    },
    {
     "k": "解答",
     "html": "<p><b>(1)</b> 准线是 $x=k$ 型，取 $k=2$：</p>$$r=\\frac{ke}{1+e\\cos\\theta}=\\frac{2\\cdot\\frac32}{1+\\frac32\\cos\\theta}=\\frac{6}{2+3\\cos\\theta}.$$<p>因为 $e=\\frac32 \\gt 1$，这是<b>双曲线</b>的一支（另一支对应另一个焦点与准线）。</p><p><b>(2)</b> 分子分母同除 3：</p>$$r=\\frac{4}{1+\\frac13\\sin\\theta}.$$<p>与 $r=\\frac{ke}{1+e\\sin\\theta}$ 比较，得 $e=\\frac13 \\lt 1$，是<b>椭圆</b>；由 $ke=4$ 得准线 $y=k=12$，在极轴上方，与焦点配对。</p><p>再由 $ke=a(1-e^2)$：$4=a\\left(1-\\frac19\\right)=a\\cdot\\frac89$，得 $a=\\frac92$。</p><p>检验：最近点 $r=\\frac{4}{1+\\frac13}=3$，最远点 $r=\\frac{4}{1-\\frac13}=6$，而 $a(1-e)=3$、$a(1+e)=6$，对得上。</p><p><b>(3)</b> $A=1,\\ B=4,\\ C=1$，判别式</p>$$B^2-4AC=16-4=12 \\gt 0,$$<p>所以是双曲线型。旋转角满足</p>$$\\cot2\\alpha=\\frac{A-C}{B}=\\frac04=0\\ \\Longrightarrow\\ 2\\alpha=\\frac\\pi2\\ \\Longrightarrow\\ \\alpha=\\frac\\pi4.$$<p>作代换 $x=\\frac{X-Y}{\\sqrt2},\\ y=\\frac{X+Y}{\\sqrt2}$，代入 $x^2+4xy+y^2=1$。因为 $x^2+y^2=X^2+Y^2$、$4xy=2\\left(X^2-Y^2\\right)$，所以</p>$$3X^2-Y^2=1\\ \\Longrightarrow\\ \\frac{X^2}{1/3}-\\frac{Y^2}{1}=1.$$<p>它是双曲线，转过 $45^\\circ$ 后标准形为 $3X^2-Y^2=1$。</p>"
    },
    {
     "k": "点评",
     "html": "<p>① 写方程时 $k$ 与分母的 $\\pm$ 必须配套：准线 $x=k$ 用 $1+e\\cos\\theta$，$x=-k$ 用 $1-e\\cos\\theta$，准线水平则把 $\\cos$ 换成 $\\sin$；② 由方程反求参数时先归一化，把分母常数项除成 1；③ 判别式只判「型」，要标准形还得完成旋转加配方。</p>"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "这些地方最容易错",
   "id": "ch10-s11"
  },
  {
   "t": "list",
   "items": [
    "$ds$ 里的 $dt$ 丢了，或者开方后忘加绝对值。<b>错在</b>把 $\\sqrt{(dx/dt)^2+(dy/dt)^2}$ 当成一定为正、可以直接开出的东西，可 $\\cos t\\sin t$ 会变号。<b>正确做法</b>：先写成 $|\\cdots|$，再按区间去号，或用对称性把区间缩到符号固定的一段。",
    "二阶导写成 $\\frac{d^2y/dt^2}{d^2x/dt^2}$。<b>错在</b>把 $\\frac{dy}{dx}$ 当成普通分式，上下各求二阶导；实际上它对 $x$ 求导要先对 $t$ 求导、再除以 $\\frac{dx}{dt}$。",
    "面积写成 $\\int g(t)f(t)\\,dt$。<b>错在</b>只把 $y$ 换成了 $g(t)$，忘了 $dx$ 也要换成 $f'(t)dt$。$x$ 的变化率才是「宽」。",
    "极坐标求交点只解 $f_1=f_2$。<b>错在</b>忽略了同一个点可以用负半径表示，漏掉 $f_1=-f_2$ 那一族解，算面积时积分限就少了一段。",
    "把 $\\frac{dy}{dx}$ 和 $\\frac{dr}{d\\theta}$ 混为一谈。<b>错在</b>忘了前者是 $xy$ 平面上的切线斜率，后者只是 $r\\theta$ 平面上的变化率。",
    "椭圆与双曲线的 $a,b,c$ 关系记反。<b>错在</b>只背了「$a^2=b^2+c^2$」这一条。椭圆是 $b^2=a^2-c^2$（焦点在长轴内部），双曲线是 $c^2=a^2+b^2$（焦点在顶点外面）。",
    "极坐标面积忘了前提条件。<b>错在</b>没检查 $r\\ge0$ 和区间长度是否超过 $2\\pi$，于是区域被算重，或者算出负面积。"
   ],
   "ordered": false
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "这一章要记住的",
   "id": "ch10-s12"
  },
  {
   "t": "formula",
   "items": [
    {
     "name": "参数求导",
     "tex": "\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}"
    },
    {
     "name": "参数二阶导",
     "tex": "\\frac{d^2y}{dx^2}=\\frac{\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)}{\\frac{dx}{dt}}"
    },
    {
     "name": "参数曲线弧长",
     "tex": "L=\\int_\\alpha^\\beta\\sqrt{\\left(\\frac{dx}{dt}\\right)^2+\\left(\\frac{dy}{dt}\\right)^2}\\,dt"
    },
    {
     "name": "参数曲线面积",
     "tex": "A=\\int_\\alpha^\\beta g(t)\\,f'(t)\\,dt"
    },
    {
     "name": "旋转曲面面积",
     "tex": "S=\\int_\\alpha^\\beta 2\\pi y\\,ds"
    },
    {
     "name": "极坐标与直角坐标",
     "tex": "x=r\\cos\\theta,\\quad y=r\\sin\\theta,\\quad r^2=x^2+y^2"
    },
    {
     "name": "极坐标面积",
     "tex": "A=\\int_\\alpha^\\beta\\frac12r^2\\,d\\theta"
    },
    {
     "name": "极坐标弧长",
     "tex": "L=\\int_\\alpha^\\beta\\sqrt{r^2+\\left(\\frac{dr}{d\\theta}\\right)^2}\\,d\\theta"
    },
    {
     "name": "圆锥曲线统一方程",
     "tex": "r=\\frac{ke}{1\\pm e\\cos\\theta}"
    },
    {
     "name": "离心率判型",
     "tex": "e \\lt 1\\ \\text{椭圆},\\qquad e=1\\ \\text{抛物线},\\qquad e \\gt 1\\ \\text{双曲线}"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "接下来学什么",
   "id": "ch10-s18"
  },
  {
   "t": "p",
   "html": "<p>这一章造的两套语言，后面会一直用。</p>\n<p>参数方程会走进<a href=\"#/ch12\">第 12 章</a>：那里把 $x(t),y(t)$ 打包成一个向量，研究速度、加速度和弧长参数化，摆线的等时性会在那里被真正证明。再往后，<a href=\"#/ch13\">第 13 章</a>用 $ds$ 定义曲率，用的还是这一章的弧长元。</p>\n<p>极坐标会走进<a href=\"#/ch14\">第 14 章</a>：二重积分在极坐标下的面积元是 $dA=r\\,dr\\,d\\theta$，而这一章的 $\\frac12r^2d\\theta$ 正是对 $r$ 积完分之后的结果。再往后，<a href=\"#/ch15\">第 15 章</a>用它算极坐标图形的质心与转动惯量。</p>\n<p>圆锥曲线则直接对应物理里的开普勒定律：行星轨道就是一条焦点在太阳上的椭圆。</p>"
  },
  {
   "t": "checklist",
   "id": "ch10",
   "items": [
    "我能说清 $x=f(t),y=g(t)$ 里的 $t$ 是什么，以及为什么圆和摆线用 $y=f(x)$ 写不出来。",
    "我能把一条参数曲线消参，并说出参数区间限制了哪一段。",
    "我能推导 $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$，并说清为什么可以这样除。",
    "我能写出 $ds$ 和 $\\int y\\,dx$ 的参数形式，并说明每一项是从哪来的。",
    "我能在极坐标与直角坐标之间互化，并解释 $r \\lt 0$ 是什么意思。",
    "我能推出 $dA=\\frac12r^2d\\theta$，并说清极坐标求交点为什么要解两个方程。",
    "我能由 $r=\\frac{ke}{1\\pm e\\cos\\theta}$ 读出离心率、准线与曲线类型。"
   ]
  }
 ]
});
