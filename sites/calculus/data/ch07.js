/* =====================================================================
 * data/ch07.js · 第7章 超越函数（Transcendental Functions）
 * 内容：110 blocks / 2 定理 / 7 例题 / 1 公式 / 2 列表 / 2 实验台 / 1 演算台 / 8 内嵌题
 * ===================================================================== */
CSC.registerChapter({
 "id": "ch07",
 "num": "7",
 "title": "超越函数",
 "en": "Transcendental Functions",
 "goals": [
  "学完这一章，你能说清为什么 $\\ln x$ 要用积分来定义，以及 $e$ 是什么。",
  "你能自己推出 $\\ln$ 与 $e^x$ 互为反函数，并求出它们的导数。",
  "你能用分离变量解「变化率与自身成正比」的问题，比如半衰期、冷却和复利。",
  "你能判断不定式的类型，用洛必达法则或取对数求出极限。",
  "你能说出反三角与双曲函数的定义、导数与积分，并比较两个函数谁增长更快。"
 ],
 "kp": [
  {
   "id": "ch07-1",
   "title": "核心概念与公式"
  },
  {
   "id": "ch07-2",
   "title": "7.1 反函数：把函数倒过来用（Inverse Functions and Their Derivatives）"
  },
  {
   "id": "ch07-3",
   "title": "7.2 自然对数：先从面积造一个函数（Natural Logarithms）"
  },
  {
   "id": "ch07-4",
   "title": "7.3 指数函数：对数的反函数（Exponential Functions）"
  },
  {
   "id": "ch07-5",
   "title": "7.4 指数变化：变化率与自身成正比（Exponential Change and Separable Differential Equations）"
  },
  {
   "id": "ch07-6",
   "title": "7.5 洛必达法则：两个量都趋于 0 时，谁更快？（Indeterminate Forms and L'Hôpital's Rule）"
  },
  {
   "id": "ch07-7",
   "title": "7.6 反三角函数：先划一块安全区，再倒过来（Inverse Trigonometric Functions）"
  },
  {
   "id": "ch07-8",
   "title": "7.7 双曲函数：用 $e$ 造一对孪生函数（Hyperbolic Functions）"
  },
  {
   "id": "ch07-9",
   "title": "7.8 谁长得更快：相对增长率（Relative Rates of Growth）"
  }
 ],
 "blocks": [
  {
   "t": "callout",
   "kind": "why",
   "title": "这一章要解决什么问题",
   "html": "<p>先想三个问题。第一，钱存在银行里，如果利息结算得越来越频繁，一年后到底能变成多少？第二，一杯热咖啡放在房间里，过多久会凉到能喝？第三，细菌每 20 分钟翻一倍，一天以后会有多少？</p>\n<p>这三个问题的答案指向同一类函数：它的变化速度与它自己的大小成正比。要把它算清楚，你需要一个能把乘法变成加法的工具——对数；还需要它的反函数——指数函数。</p>\n<p>这一章从「反函数」这个想法开始，先把 $\\ln x$ 与 $e^x$ 严格地造出来，再解决上面的增长问题；最后补上反三角函数、双曲函数，以及比较两个函数谁增长更快的办法。</p>"
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "开始前你需要知道",
   "html": "<ul>\n<li><b>函数与反函数</b>：第 1 章讲过，$y=f(x)$ 是一条「输入 → 输出」的规则。把输出倒推回输入，就是反函数。忘了就先回看 <a href=\"#/ch01\">第 1 章 · 函数</a>。</li>\n<li><b>极限与连续</b>：$\\ln x$ 的严格定义和洛必达法则都要用极限，需要时回看 <a href=\"#/ch02\">第 2 章 · 极限与连续</a>。</li>\n<li><b>求导法则</b>：链式法则与隐函数求导是这一章最常用的工具，见 <a href=\"#/ch03\">第 3 章 · 导数</a>。</li>\n<li><b>微积分基本定理</b>：它说「面积函数的导数就是被积函数」，本章用它给 $\\ln x$ 求导，见 <a href=\"#/ch05\">第 5 章 · 积分</a>。</li>\n</ul>"
  },
  {
   "t": "scope",
   "scope": "final",
   "weeks": "W10–W12",
   "sections": "§7.1–7.6, 7.8"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "从「利息怎么滚」说起",
   "id": "ch07-s1"
  },
  {
   "t": "p",
   "html": "假设年利率是 100%，存 1 元，一年后拿回 $1+1=2$ 元。如果把结算改成每半年一次，每次利率 50%，年底就是 $(1+0.5)^2=2.25$ 元。每季度结算一次，是 $(1+0.25)^4\\approx2.44$ 元。结算得越频繁，钱越多。那能不能无限多？把每次的利率写成 $1/n$，一年结算 $n$ 次，年底的钱就是下面这个式子。"
  },
  {
   "t": "tex",
   "tex": "\\left(1+\\frac1n\\right)^n"
  },
  {
   "t": "p",
   "html": "代几个数：$n=12$ 时约 $2.613$，$n=365$ 时约 $2.715$，$n=10000$ 时约 $2.718$。它在涨，但涨得越来越慢，最后停在一个数附近。这个数记作 $e\\approx2.718281828$。"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "本章主线",
     "html": "要研究 $e$ 以及「变化率与自身成正比」的现象，得先有一个能把乘法拆成加法的函数，也就是对数 $\\ln x$。而 $\\ln x$ 本身又要靠积分才能严格造出来。于是顺序是：反函数 → $\\ln x$ → $e^x$ → 解增长方程 → 洛必达 → 反三角与双曲 → 增长率比较。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "7.1 反函数：把函数倒过来用（Inverse Functions and Their Derivatives）",
   "id": "ch07-s3"
  },
  {
   "t": "p",
   "html": "摄氏与华氏温度的换算是 $\\text{摄氏}=\\frac59(\\text{华氏}-32)$。如果你手上有摄氏度，想反推华氏度，就把式子倒过来解。一对函数互相「倒推」，就说它们互为<b>反函数</b>（inverse function）。"
  },
  {
   "t": "tex",
   "tex": "f^{-1}(b)=a\\quad\\Longleftrightarrow\\quad f(a)=b"
  },
  {
   "t": "p",
   "html": "逐符号读一遍：$f^{-1}$ 读作「$f$ 的逆」，它<b>不是</b> $\\frac1f$；输入一个输出值 $b$，它告诉你原来哪个输入 $a$ 产生了 $b$。原函数的定义域变成反函数的值域，原函数的值域变成反函数的定义域。图像上，$y=f(x)$ 与 $y=f^{-1}(x)$ 关于直线 $y=x$ 对称：点 $(a,b)$ 对应点 $(b,a)$。"
  },
  {
   "t": "callout",
   "kind": "tip",
   "title": "先想一想",
   "html": "是不是每个函数都能倒过来？$y=x^2$ 和 $y=x^3$ 哪个能倒过来？提示：$x^2=4$ 有两个解 $2$ 和 $-2$，倒推回去该选哪个？"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "先要「一对一」",
     "html": "如果两个不同的输入给出同一个输出，倒推时就分不清原来是谁。所以函数必须满足：$x_1\\ne x_2$ 时 $f(x_1)\\ne f(x_2)$，这叫<b>一对一</b>（one-to-one）。"
    },
    {
     "title": "用水平线检验图像",
     "html": "在图像上画任意一条水平线。若它与曲线最多交一次，函数就是一对一的；若某条水平线交了两次，那两次的 $y$ 相同而 $x$ 不同，就没有反函数。"
    },
    {
     "title": "把「互为反函数」写成恒等式",
     "html": "两个函数互为反函数，等价于：先用 $f$ 再上 $f^{-1}$，回到原数；反过来也一样。这就是下面两个式子。"
    },
    {
     "title": "对恒等式求导，得到反函数的导数",
     "html": "设 $y=f^{-1}(x)$，则 $f(y)=x$。两边对 $x$ 求导，左边用链式法则得 $f'(y)\\cdot y'=1$，于是 $y'=\\frac{1}{f'(y)}$。再把 $y=f^{-1}(x)$ 代回去，就得到反函数求导公式。"
    }
   ]
  },
  {
   "t": "tex",
   "tex": "(f^{-1})'(b)=\\frac{1}{f'(a)},\\qquad a=f^{-1}(b)"
  },
  {
   "t": "theorem",
   "name": "反函数求导法则",
   "rows": [
    {
     "k": "白话",
     "html": "反函数图像的斜率，是原函数在同一点斜率的倒数。"
    },
    {
     "k": "条件",
     "html": "$f$ 在含 $a$ 的区间上可导，且 $f'(a)\\ne0$；$b=f(a)$。"
    },
    {
     "k": "结论",
     "html": "$(f^{-1})'(b)=\\dfrac{1}{f'(a)}$，其中 $a=f^{-1}(b)$。"
    },
    {
     "k": "怎么用",
     "html": "求某个具体点的导数值时，先观察哪个 $a$ 满足 $f(a)=b$，代进分母即可，不必先求出反函数公式。"
    }
   ]
  },
  {
   "t": "quiz",
   "qid": "ch07-q1"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "html": "反函数的定义是「倒推」：$f(a)=b$ 与 $f^{-1}(b)=a$ 说的是同一件事。"
    },
    {
     "html": "会倒推的前提是一对一（水平线检验）；反函数的斜率是原函数斜率的倒数。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "7.2 自然对数：先从面积造一个函数（Natural Logarithms）",
   "id": "ch07-s4"
  },
  {
   "t": "p",
   "html": "我们想找一个函数，它的导数正好是 $\\frac1x$。幂函数 $x^n$ 求导得 $nx^{n-1}$，想让指数变成 $-1$，就得取 $n=0$，可 $x^0=1$ 的导数是 $0$。这说明 $\\frac1x$ 在幂函数里找不到原函数。数学家换了个办法：用积分直接造一个。"
  },
  {
   "t": "tex",
   "tex": "\\ln x=\\int_1^x\\frac{1}{t}\\,dt"
  },
  {
   "t": "p",
   "html": "逐符号读：$\\ln$ 读作「自然对数」（natural logarithm），$t$ 只是积分里的临时变量（叫哑变量），真正变化的是上限 $x$。这个式子的意思是：从 $1$ 到 $x$、曲线 $y=\\frac1t$ 下方的面积。所以 $\\ln x$ 的定义域是 $x\\gt0$；$x=1$ 时面积为 $0$，即 $\\ln1=0$；$0\\lt x\\lt1$ 时积分方向相反，面积为负。"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "用微积分基本定理求导",
     "html": "第 5 章说过：面积函数 $F(x)=\\int_a^x f(t)\\,dt$ 的导数就是 $f(x)$。这里 $a=1$、$f(t)=\\frac1t$，所以直接得到 $\\frac{d}{dx}\\ln x=\\frac1x$。"
    },
    {
     "title": "遇到复合函数就用链式法则",
     "html": "如果里面不是 $x$ 而是 $u(x)$，还要乘上内层的导数：$\\frac{d}{dx}\\ln u=\\frac1u\\cdot u'$。"
    },
    {
     "title": "反过来写成积分公式",
     "html": "把导数式倒过来读：$\\frac1u$ 的原函数是 $\\ln|u|$。加绝对值是因为 $\\frac1u$ 在 $u\\lt0$ 时也有定义，而 $\\ln$ 只接受正数。"
    }
   ]
  },
  {
   "t": "tex",
   "tex": "\\frac{d}{dx}\\ln x=\\frac1x,\\qquad \\frac{d}{dx}\\ln u=\\frac{1}{u}\\frac{du}{dx},\\qquad \\int\\frac{du}{u}=\\ln|u|+C"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "想证明 $\\ln(bx)=\\ln b+\\ln x$",
     "html": "这种「把乘法拆成加法」的公式是 $\\ln$ 最重要的性质。证法很巧：先看两边的导数。"
    },
    {
     "title": "两边分别求导",
     "html": "左边 $\\frac{d}{dx}\\ln(bx)=\\frac{1}{bx}\\cdot b=\\frac1x$；右边 $\\frac{d}{dx}(\\ln b+\\ln x)=0+\\frac1x=\\frac1x$。两个函数的导数相同。"
    },
    {
     "title": "导数相同意味着只差一个常数",
     "html": "第 4 章的推论：导数恒相等的两个函数相差一个常数。于是 $\\ln(bx)=\\ln b+\\ln x+C$。"
    },
    {
     "title": "代一个特殊值把常数定下来",
     "html": "令 $x=1$：左边 $\\ln b$，右边 $\\ln b+0+C$，比较得 $C=0$。公式得证。用同样的办法可以推出商、倒数和幂的三条法则。"
    }
   ]
  },
  {
   "t": "tex",
   "tex": "\\ln(bx)=\\ln b+\\ln x,\\qquad \\ln\\frac bx=\\ln b-\\ln x,\\qquad \\ln\\frac1x=-\\ln x,\\qquad \\ln x^r=r\\ln x"
  },
  {
   "t": "p",
   "html": "现在可以给 $e$ 下定义了：$e$ 就是使 $\\ln e=1$ 的那个数。从面积看，它是让 $\\int_1^e\\frac{dt}{t}=1$ 成立的上限，数值约 $2.718281828$。它还有一个极限定义：$e=\\lim_{x\\to0}(1+x)^{1/x}$，这正是开头复利例子的连续版本。"
  },
  {
   "t": "p",
   "html": "$\\ln$ 还有一个常用技巧：<b>对数求导法</b>。遇到 $y=x^x$ 这种「底和指数都在变」的函数，直接求导很难；先取对数把指数拉下来变成乘法，就好办了。步骤是：取 $\\ln$ → 用对数法则拆开 → 两边对 $x$ 隐式求导 → 把 $y$ 乘回去。"
  },
  {
   "t": "theorem",
   "name": "对数法则",
   "rows": [
    {
     "k": "白话",
     "html": "对数把乘法变成加法、除法变成减法、幂变成倍数。"
    },
    {
     "k": "条件",
     "html": "$b\\gt0$，$x\\gt0$，$r$ 是任意实数。"
    },
    {
     "k": "结论",
     "html": "$\\ln(bx)=\\ln b+\\ln x$，$\\ln\\frac bx=\\ln b-\\ln x$，$\\ln x^r=r\\ln x$。"
    },
    {
     "k": "怎么用",
     "html": "化简式子、解指数方程；对数求导法的第一步就靠它。"
    }
   ]
  },
  {
   "t": "quiz",
   "qid": "ch07-q2"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "html": "$\\ln x$ 是「面积函数」：$\\ln x=\\int_1^x\\frac{1}{t}dt$，所以 $(\\ln x)'=\\frac1x$。"
    },
    {
     "html": "$e$ 是使 $\\ln e=1$ 的数；对数法则把乘除变加减，是对数求导法的关键。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "7.3 指数函数：对数的反函数（Exponential Functions）",
   "id": "ch07-s5"
  },
  {
   "t": "p",
   "html": "$\\ln$ 把乘法变成加法；那么它的反函数就该把加法变回乘法。这个反函数记作 $e^x$（也写作 $\\exp x$）。逐符号读：$e$ 就是刚才那个常数 $2.718\\ldots$，$e^x$ 表示「$e$ 的 $x$ 次方」。它的定义域是全体实数，值域是 $(0,\\infty)$；$e^0=1$；$x$ 很大时它涨得极快，$x\\to-\\infty$ 时它趋于 $0$。互为反函数的意思是下面两个式子同时成立。"
  },
  {
   "t": "tex",
   "tex": "e^{\\ln x}=x\\ (x\\gt0),\\qquad \\ln(e^x)=x,\\qquad e^x=\\ln^{-1}x"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "用反函数求导公式",
     "html": "把 $f(x)=\\ln x$ 与 $f^{-1}(x)=e^x$ 代进 7.1 的公式。"
    },
    {
     "title": "先算分母",
     "html": "$f'(x)=\\frac1x$，所以 $f'(f^{-1}(b))=\\frac{1}{e^b}$。"
    },
    {
     "title": "取倒数",
     "html": "$(f^{-1})'(b)=\\frac{1}{1/e^b}=e^b$。把字母 $b$ 换成 $x$，就得到 $(e^x)'=e^x$。"
    },
    {
     "title": "这说明什么",
     "html": "$e^x$ 的导数等于它自己。在所有函数里，只有它（以及它的常数倍）有这个性质。这就是微积分偏爱底数 $e$ 的原因。"
    }
   ]
  },
  {
   "t": "tex",
   "tex": "(e^x)'=e^x,\\qquad (e^u)'=e^u u',\\qquad \\int e^u\\,du=e^u+C"
  },
  {
   "t": "p",
   "html": "其他底数都能换成 $e$：$a^x=e^{x\\ln a}$，所以 $(a^x)'=a^x\\ln a$，多出来的 $\\ln a$ 不能丢。对数也一样：$\\log_a x=\\frac{\\ln x}{\\ln a}$，求导时带一个 $\\frac{1}{\\ln a}$。还有一个收获：因为 $x^n=e^{n\\ln x}$，幂法则 $x^n$ 的导数公式对任意实数 $n$ 都成立，不再只限于整数。"
  },
  {
   "t": "tex",
   "tex": "(a^x)'=a^x\\ln a,\\qquad \\int a^u\\,du=\\frac{a^u}{\\ln a}+C,\\qquad (\\log_a u)'=\\frac{1}{\\ln a}\\cdot\\frac{u'}{u}"
  },
  {
   "t": "lab",
   "id": "explog"
  },
  {
   "t": "quiz",
   "qid": "ch07-q3"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "html": "$e^x$ 与 $\\ln x$ 互为反函数：$e^{\\ln x}=x$，$\\ln(e^x)=x$。"
    },
    {
     "html": "$(e^x)'=e^x$；其他底数先换成 $e$，导数里会多出 $\\ln a$。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "7.4 指数变化：变化率与自身成正比（Exponential Change and Separable Differential Equations）",
   "id": "ch07-s6"
  },
  {
   "t": "p",
   "html": "细菌按个数繁殖：数量多，增长就快。放射性物质按原子数衰变：剩得多，单位时间衰变掉的也多。咖啡降温的速度，与它和室温的差成正比。这些现象的共同点是：<b>变化率与当时的量成正比</b>。写成方程就是下面这个。"
  },
  {
   "t": "tex",
   "tex": "\\frac{dy}{dt}=ky,\\qquad y(0)=y_0"
  },
  {
   "t": "p",
   "html": "逐符号读：$y(t)$ 是 $t$ 时刻的量；$\\frac{dy}{dt}$ 是它的变化率（涨得多快）；常数 $k$ 叫<b>相对增长率</b>，单位是「每单位时间」。$k\\gt0$ 表示增长，$k\\lt0$ 表示衰减。$y_0$ 是初始时刻的量。注意 $k$ 描述的是「按比例」的涨落，不是固定的速度。"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "把两个变量分开",
     "html": "方程 $\\frac{dy}{dt}=ky$ 两边同时除以 $y$、乘以 $dt$，得到 $\\frac{1}{y}dy=k\\,dt$。这一步叫<b>分离变量</b>，把含 $y$ 的放一边、含 $t$ 的放另一边。"
    },
    {
     "title": "两边积分",
     "html": "$\\int\\frac{1}{y}dy=\\int k\\,dt$。左边是 $\\ln|y|$，右边是 $kt+C$。"
    },
    {
     "title": "解出 $y$",
     "html": "两边取指数：$|y|=e^{kt+C}=e^C e^{kt}$。把 $e^C$ 记作一个新的正常数 $C_1$，得 $y=C_1e^{kt}$。"
    },
    {
     "title": "用初值定常数",
     "html": "代 $t=0$：$y(0)=C_1=y_0$。所以 $y=y_0e^{kt}$。这就是所有「变化率与自身成正比」问题的通解。"
    }
   ]
  },
  {
   "t": "tex",
   "tex": "y=y_0e^{kt}"
  },
  {
   "t": "p",
   "html": "<b>半衰期</b>：衰减到原来一半要多久？令 $y=\\frac{y_0}{2}$，代进 $y_0e^{-kt}=\\frac{y_0}{2}$，得到 $e^{-kt}=\\frac12$，两边取对数得 $t=\\frac{\\ln2}{k}$。注意它只与 $k$ 有关，与初始量 $y_0$ 无关——不管原来有多少，减半的时间都一样。"
  },
  {
   "t": "tex",
   "tex": "T_{\\text{半衰期}}=\\frac{\\ln2}{k}\\qquad(k\\gt0)"
  },
  {
   "t": "p",
   "html": "<b>牛顿冷却定律</b>是同一方程换了件衣服：物体温度 $H$ 与环境温度 $H_S$ 的<b>差</b>按比例衰减，即 $\\frac{dH}{dt}=-k(H-H_S)$。把 $y=H-H_S$ 当作新变量，它就变成 $y'=-ky$ 的标准形式，解得 $H-H_S=(H_0-H_S)e^{-kt}$。升温时也适用，只要温差的正负没搞反。几个常见数据：碳-14 的半衰期约 5730 年，考古测年就靠它；连续复利 $A=Pe^{rt}$，其中 $P$ 是本金、$r$ 是年利率；「每年减少 $p\\%$」对应 $k=\\ln(1-p)$，不是 $k=-p$，因为减少是按比例滚动的。"
  },
  {
   "t": "tex",
   "tex": "H-H_S=(H_0-H_S)e^{-kt}"
  },
  {
   "t": "quiz",
   "qid": "ch07-q5"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "html": "$\\frac{dy}{dt}=ky$ 的通解是 $y=y_0e^{kt}$：分离变量 → 积分 → 用初值定常数。"
    },
    {
     "html": "半衰期 $=\\frac{\\ln2}{k}$，与初始量无关；冷却问题先把环境温度减掉。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "7.5 洛必达法则：两个量都趋于 0 时，谁更快？（Indeterminate Forms and L'Hôpital's Rule）",
   "id": "ch07-s7"
  },
  {
   "t": "p",
   "html": "看 $\\lim_{x\\to0}\\frac{\\sin x}{x}$。$x\\to0$ 时分子 $\\sin x\\to0$，分母 $x\\to0$，直接代入得到 $\\frac00$。可 $\\frac00$ 不是数，不能算。这个极限到底是多少，取决于「分子和分母谁趋近 0 得更快」。这类「两个量都比出花样」的式子，就叫<b>不定式</b>（indeterminate form）。"
  },
  {
   "t": "tex",
   "tex": "\\frac00,\\quad \\frac{\\infty}{\\infty},\\quad 0\\cdot\\infty,\\quad \\infty-\\infty,\\quad 1^\\infty,\\quad 0^0,\\quad \\infty^0"
  },
  {
   "t": "p",
   "html": "这七个记号都只是「形状」，不是数。比如 $1^\\infty$ 不是 $1$，$0\\cdot\\infty$ 也不是 $0$。处理思路分两类：前两种 $\\frac00$ 与 $\\frac\\infty\\infty$ 可以直接用洛必达法则；后面五种要先变形，变回这两种之一。"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "先看一个简化版本",
     "html": "假设 $f(a)=g(a)=0$，并且两个函数在 $a$ 附近都可导。那么 $\\frac{f(x)-f(a)}{g(x)-g(a)}$ 就是 $\\frac{f(x)}{g(x)}$。"
    },
    {
     "title": "用柯西中值定理",
     "html": "在 $[a,x]$ 上用柯西中值定理：存在 $c$ 在 $a$ 与 $x$ 之间，使 $\\frac{f(x)-f(a)}{g(x)-g(a)}=\\frac{f'(c)}{g'(c)}$。"
    },
    {
     "title": "让 $x$ 靠近 $a$",
     "html": "$x\\to a$ 时 $c$ 也被夹着趋于 $a$。于是右边趋于 $\\frac{f'(a)}{g'(a)}$，左边就是 $\\frac{f(x)}{g(x)}$ 的极限。"
    },
    {
     "title": "得到法则",
     "html": "$\\lim_{x\\to a}\\frac{f(x)}{g(x)}=\\lim_{x\\to a}\\frac{f'(x)}{g'(x)}$。所以洛必达法则的本质，是把「函数值之比」换成「导数之比」。"
    }
   ]
  },
  {
   "t": "tex",
   "tex": "\\lim_{x\\to a}\\frac{f(x)}{g(x)}=\\lim_{x\\to a}\\frac{f'(x)}{g'(x)}"
  },
  {
   "t": "p",
   "html": "三个使用要点。第一，分子分母要<b>分别</b>求导，不是用商法则。第二，每用一次都要重新检查类型：只要还是 $\\frac00$ 或 $\\frac\\infty\\infty$ 就可以继续；一旦某个导数的极限是非零数，就必须停止求导，直接代入。第三，前两种以外的五种，先化成前两种：$0\\cdot\\infty$ 把一个因子写成倒数搬进分母；$\\infty-\\infty$ 先通分或乘共轭；$1^\\infty,0^0,\\infty^0$ 统一先取对数。"
  },
  {
   "t": "table",
   "head": [
    "形状",
    "典型例子",
    "变形手法"
   ],
   "rows": [
    [
     "$\\frac00$",
     "$\\lim_{x\\to0}\\frac{3x-\\sin x}{x}$",
     "分子分母分别求导"
    ],
    [
     "$\\frac{\\infty}{\\infty}$",
     "$\\lim_{x\\to\\infty}\\frac{e^x}{x^2}$",
     "直接求导，可反复用"
    ],
    [
     "$0\\cdot\\infty$",
     "$\\lim_{x\\to0^+}x\\ln x$",
     "把 $x$ 写成 $\\frac{1}{1/x}$ 搬进分母"
    ],
    [
     "$\\infty-\\infty$",
     "$\\lim_{x\\to0}\\left(\\frac1{\\sin x}-\\frac1x\\right)$",
     "先通分合并成一个分式"
    ],
    [
     "$\\infty-\\infty$（根式）",
     "$\\lim_{x\\to\\infty}(\\sqrt{x^2+x}-x)$",
     "乘共轭使根号消失"
    ],
    [
     "$1^\\infty$",
     "$\\lim_{x\\to0}(1+x)^{1/x}$",
     "取对数，变成 $\\frac00$ 或 $\\frac\\infty\\infty$"
    ],
    [
     "$0^0$ 或 $\\infty^0$",
     "$\\lim_{x\\to0^+}x^x$",
     "取对数后变成 $0\\cdot\\infty$"
    ]
   ]
  },
  {
   "t": "quiz",
   "qid": "ch07-q6"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "html": "洛必达法则 = 把「函数值之比」换成「导数之比」；只对 $\\frac00$ 与 $\\frac\\infty\\infty$ 直接使用。"
    },
    {
     "html": "每步都要重判类型；其他五种先变形（通分、取对数、换元、乘共轭）。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "7.6 反三角函数：先划一块安全区，再倒过来（Inverse Trigonometric Functions）",
   "id": "ch07-s8"
  },
  {
   "t": "p",
   "html": "$\\sin x$ 是周期函数，同一条水平线会与它的图像交很多次，所以它没有反函数。办法是先限制范围：只保留 $x\\in[-\\frac\\pi2,\\frac\\pi2]$ 的这一段。这一段上一对一，倒过来就得到<b>反正弦</b>（arcsine），记作 $\\arcsin x$。逐符号读：$\\arcsin x$ 表示「正弦值等于 $x$ 的那个角」，它<b>不是</b> $\\frac{1}{\\sin x}$；值域限定在 $[-\\frac\\pi2,\\frac\\pi2]$，是为了让答案唯一。例如 $\\arcsin\\frac12=\\frac\\pi6$，$\\arcsin(-\\frac12)=-\\frac\\pi6$。"
  },
  {
   "t": "tex",
   "tex": "y=\\arcsin x\\quad\\Longleftrightarrow\\quad \\sin y=x\\ \\text{且}\\ -\\frac\\pi2\\le y\\le\\frac\\pi2"
  },
  {
   "t": "table",
   "head": [
    "函数",
    "定义域",
    "值域"
   ],
   "rows": [
    [
     "$y=\\arcsin x$",
     "$[-1,1]$",
     "$\\left[-\\frac\\pi2,\\frac\\pi2\\right]$"
    ],
    [
     "$y=\\arccos x$",
     "$[-1,1]$",
     "$[0,\\pi]$"
    ],
    [
     "$y=\\arctan x$",
     "$(-\\infty,\\infty)$",
     "$\\left(-\\frac\\pi2,\\frac\\pi2\\right)$"
    ],
    [
     "$y=\\operatorname{arccot}x$",
     "$(-\\infty,\\infty)$",
     "$(0,\\pi)$"
    ],
    [
     "$y=\\operatorname{arcsec}x$",
     "$|x|\\ge1$",
     "$\\left[0,\\frac\\pi2\\right)\\cup\\left(\\frac\\pi2,\\pi\\right]$"
    ],
    [
     "$y=\\operatorname{arccsc}x$",
     "$|x|\\ge1$",
     "$\\left[-\\frac\\pi2,0\\right)\\cup\\left(0,\\frac\\pi2\\right]$"
    ]
   ]
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "设 $y=\\arcsin x$",
     "html": "按定义，$y$ 是那个角，满足 $\\sin y=x$，且 $y\\in[-\\frac\\pi2,\\frac\\pi2]$。"
    },
    {
     "title": "两边对 $x$ 求导",
     "html": "左边对 $x$ 求导是 $\\cos y\\cdot y'$（链式法则），右边对 $x$ 求导是 $1$。所以 $\\cos y\\cdot y'=1$，即 $y'=\\frac{1}{\\cos y}$。"
    },
    {
     "title": "把 $\\cos y$ 换成 $x$ 的表达式",
     "html": "在 $[-\\frac\\pi2,\\frac\\pi2]$ 上 $\\cos y\\ge0$，由 $\\sin^2y+\\cos^2y=1$ 得 $\\cos y=\\sqrt{1-\\sin^2y}=\\sqrt{1-x^2}$。"
    },
    {
     "title": "得到导数",
     "html": "$y'=\\frac{1}{\\sqrt{1-x^2}}$。同样的推导可以给出其余五个反三角函数的导数，只是符号和根号里的形状不同。"
    }
   ]
  },
  {
   "t": "tex",
   "tex": "(\\arcsin u)'=\\frac{u'}{\\sqrt{1-u^2}},\\quad (\\arccos u)'=-\\frac{u'}{\\sqrt{1-u^2}},\\quad (\\arctan u)'=\\frac{u'}{1+u^2},\\quad (\\operatorname{arccot}u)'=-\\frac{u'}{1+u^2}\\\\ (\\operatorname{arcsec}u)'=\\frac{u'}{|u|\\sqrt{u^2-1}},\\quad (\\operatorname{arccsc}u)'=-\\frac{u'}{|u|\\sqrt{u^2-1}}\\qquad(|u|\\gt1)"
  },
  {
   "t": "p",
   "html": "把导数公式倒过来读，就得到三个积分公式。用之前先<b>配方</b>，把根号或分母整理成 $a^2-u^2$、$a^2+u^2$、$u^2-a^2$ 的形状。例如 $4x-x^2=4-(x-2)^2$，$4x^2+4x+2=(2x+1)^2+1$。根号内是差用 $\\arcsin$，平方和用 $\\arctan$，平方差用 $\\operatorname{arcsec}$。"
  },
  {
   "t": "tex",
   "tex": "\\int\\frac{du}{\\sqrt{a^2-u^2}}=\\arcsin\\frac ua+C,\\qquad \\int\\frac{du}{a^2+u^2}=\\frac1a\\arctan\\frac ua+C,\\qquad \\int\\frac{du}{u\\sqrt{u^2-a^2}}=\\frac1a\\operatorname{arcsec}\\left|\\frac ua\\right|+C"
  },
  {
   "t": "lab",
   "id": "invtri"
  },
  {
   "t": "quiz",
   "qid": "ch07-q7"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "html": "反三角 = 三角函数限制范围后的反函数；$\\arcsin x$ 不是 $\\frac{1}{\\sin x}$。"
    },
    {
     "html": "求导用隐函数法；积分先配方，再看根号是 $a^2-u^2$、$a^2+u^2$ 还是 $u^2-a^2$。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "7.7 双曲函数：用 $e$ 造一对孪生函数（Hyperbolic Functions）",
   "id": "ch07-s9"
  },
  {
   "t": "p",
   "html": "把 $e^x$ 与 $e^{-x}$ 相加减再除以 2，会得到两个新函数：$\\sinh x=\\frac{e^x-e^{-x}}{2}$（双曲正弦，读作「shine」），$\\cosh x=\\frac{e^x+e^{-x}}{2}$（双曲余弦，读作「cosh」）。它们叫「双曲」函数，是因为点 $(\\cosh t,\\sinh t)$ 落在双曲线 $x^2-y^2=1$ 上；而且它们满足的恒等式与三角函数几乎一样，只差个别符号。其余四个由它们相除得到：$\\tanh=\\frac{\\sinh}{\\cosh}$，$\\coth=\\frac{\\cosh}{\\sinh}$，$\\operatorname{sech}=\\frac{1}{\\cosh}$，$\\operatorname{csch}=\\frac{1}{\\sinh}$。"
  },
  {
   "t": "tex",
   "tex": "\\sinh x=\\frac{e^x-e^{-x}}2,\\quad \\cosh x=\\frac{e^x+e^{-x}}2,\\quad \\tanh x=\\frac{\\sinh x}{\\cosh x},\\quad \\coth x=\\frac{\\cosh x}{\\sinh x}\\\\ \\cosh^2x-\\sinh^2x=1,\\quad \\sinh2x=2\\sinh x\\cosh x,\\quad \\cosh2x=\\cosh^2x+\\sinh^2x,\\quad \\cosh^2x=\\frac{\\cosh2x+1}{2},\\quad \\sinh^2x=\\frac{\\cosh2x-1}{2}"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "把定义代进去",
     "html": "要证 $\\cosh^2x-\\sinh^2x=1$，就把 $\\cosh x=\\frac{e^x+e^{-x}}{2}$ 与 $\\sinh x=\\frac{e^x-e^{-x}}{2}$ 都平方。"
    },
    {
     "title": "展开平方",
     "html": "$\\cosh^2x=\\frac{e^{2x}+2+e^{-2x}}{4}$，$\\sinh^2x=\\frac{e^{2x}-2+e^{-2x}}{4}$。"
    },
    {
     "title": "相减",
     "html": "分子中 $e^{2x}$ 与 $e^{-2x}$ 都抵消，只剩 $\\frac{2-(-2)}{4}=\\frac44=1$。这就是双曲版的勾股恒等式，注意它是减号。"
    }
   ]
  },
  {
   "t": "p",
   "html": "求导规则也好记：$\\sinh$ 的导数是 $\\cosh$，$\\cosh$ 的导数是 $\\sinh$，两个都没有负号。带 co- 的三个（$\\coth,\\operatorname{sech},\\operatorname{csch}$）求导则带负号。积分就是把导数表倒过来读。"
  },
  {
   "t": "tex",
   "tex": "(\\sinh u)'=\\cosh u\\,u',\\quad (\\cosh u)'=\\sinh u\\,u',\\quad (\\tanh u)'=\\operatorname{sech}^2u\\,u',\\quad (\\coth u)'=-\\operatorname{csch}^2u\\,u'"
  },
  {
   "t": "tex",
   "tex": "\\int\\sinh u\\,du=\\cosh u+C,\\quad \\int\\cosh u\\,du=\\sinh u+C,\\quad \\int\\operatorname{sech}^2u\\,du=\\tanh u+C,\\quad \\int\\operatorname{csch}^2u\\,du=-\\coth u+C,\\quad \\int\\coth u\\,du=\\ln|\\sinh u|+C"
  },
  {
   "t": "p",
   "html": "双曲函数也有反函数，记作 $\\sinh^{-1}x$、$\\cosh^{-1}x$ 等。这里的 $-1$ 表示「反函数」，<b>不是</b>倒数。它们可以写成对数：$\\sinh^{-1}x=\\ln(x+\\sqrt{x^2+1})$。对应的积分公式与反三角的公式长得很像，区别只在根号里是 $+$ 还是 $-$。"
  },
  {
   "t": "tex",
   "tex": "(\\sinh^{-1}u)'=\\frac{u'}{\\sqrt{1+u^2}},\\quad (\\cosh^{-1}u)'=\\frac{u'}{\\sqrt{u^2-1}},\\quad (\\tanh^{-1}u)'=\\frac{u'}{1-u^2}\\qquad(|u|\\lt1)\\\\ \\int\\frac{du}{\\sqrt{a^2+u^2}}=\\sinh^{-1}\\frac ua+C,\\qquad \\int\\frac{du}{\\sqrt{u^2-a^2}}=\\cosh^{-1}\\frac ua+C,\\qquad \\sinh^{-1}x=\\ln(x+\\sqrt{x^2+1})"
  },
  {
   "t": "quiz",
   "qid": "ch07-q9"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "html": "双曲函数是用 $e^x$ 与 $e^{-x}$ 拼出来的；恒等式与三角类似，但 $\\cosh^2-\\sinh^2=1$ 是减号。"
    },
    {
     "html": "（$\\sinh$）' = $\\cosh$，（$\\cosh$）' = $\\sinh$；带 co- 的求导有负号；反双曲的 $-1$ 不是倒数。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "7.8 谁长得更快：相对增长率（Relative Rates of Growth）",
   "id": "ch07-s10"
  },
  {
   "t": "p",
   "html": "两个函数都趋于无穷时，怎么判断谁更快？办法是看它们的<b>比值</b>。如果 $\\lim_{x\\to\\infty}\\frac{f(x)}{g(x)}=\\infty$，说明 $f$ 比 $g$ 快；如果比值趋于一个正的常数 $L$，说明两者<b>同阶</b>，增长得一样快（比如 $2x$ 与 $x$）。两个常用记号：$f=o(g)$ 表示「$f$ 比 $g$ 慢」；$f=O(g)$ 表示「$f$ 不超过 $g$ 的某个常数倍」。"
  },
  {
   "t": "tex",
   "tex": "f\\ \\text{更快}:\\ \\lim_{x\\to\\infty}\\frac{f}{g}=\\infty\\qquad\\text{同阶}:\\ \\lim_{x\\to\\infty}\\frac{f}{g}=L\\gt0\\\\ \\ln x\\ \\ll\\ x^p\\ (p\\gt0)\\ \\ll\\ a^x\\ (a\\gt1)\\ \\ll\\ x^x\\qquad(x\\to\\infty)"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "先写比值",
     "html": "要比较 $\\ln x$ 与 $x^p$（$p\\gt0$），就算 $\\lim_{x\\to\\infty}\\frac{\\ln x}{x^p}$。"
    },
    {
     "title": "用洛必达法则",
     "html": "这是 $\\frac\\infty\\infty$ 型，分子分母分别求导：$\\frac{1/x}{px^{p-1}}=\\frac{1}{px^p}$。"
    },
    {
     "title": "看极限",
     "html": "$p\\gt0$ 时 $x^p\\to\\infty$，所以比值趋于 $0$。这意味着 $\\ln x$ 比任何正幂都慢。"
    },
    {
     "title": "推广成阶梯",
     "html": "用同样的比值法可以证明：幂函数比不过指数函数，而 $x^x=e^{x\\ln x}$ 又比任何固定底的 $a^x$ 快。于是有上面的增长率阶梯。"
    }
   ]
  },
  {
   "t": "p",
   "html": "这个阶梯经常出现在两个地方。一是定积分与反常积分的收敛性判断：比如 $\\int_1^\\infty\\frac{dx}{\\ln x}$ 发散，因为 $\\frac{1}{\\ln x}$ 衰减得比 $\\frac1x$ 还慢。二是算法分析：顺序查找要 $O(n)$ 步，二分查找只要 $O(\\log n)$ 步；$n=26000$ 时前者约 26000 步，后者最多 15 步。"
  },
  {
   "t": "quiz",
   "qid": "ch07-q10"
  },
  {
   "t": "calc",
   "mode": "derivative",
   "title": "超越函数求导演算台",
   "desc": "输入 $e^x\\ln x$ 之类的表达式，看符号导数与数值导数是否一致。",
   "expr": "exp(x)*ln(x)",
   "args": {
    "x": 1
   }
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "这些内容会怎么用：常见题型长什么样",
   "id": "ch07-s12"
  },
  {
   "t": "list",
   "items": [
    "<b>求反函数或反函数的导数</b>：给你 $y=f(x)$，要求写出 $f^{-1}$，或者只问 $(f^{-1})'(b)$。后者不用求公式，先观察哪个 $a$ 满足 $f(a)=b$。",
    "<b>对数求导</b>：看到底和指数都在变的 $x^x$、$(\\sin x)^x$，或者一长串乘除开方，先取 $\\ln$ 化简。",
    "<b>不定式极限</b>：先判断是七种里的哪一种，能化简先化简，再用洛必达；$\\frac00$ 与 $\\frac\\infty\\infty$ 之外的五种先变形。",
    "<b>指数增长与衰减</b>：细菌、放射衰变、冷却、复利、药物浓度。套路是列 $y'=ky$、代入两组数据定 $y_0$ 与 $k$、再回答题目问的时刻。",
    "<b>反三角的导数与积分</b>：分母或根号里出现二次式，先配方成 $a^2\\pm u^2$，再套公式。",
    "<b>双曲函数</b>：求导、积分、化简；记住 $(\\cosh u)'=\\sinh u$、$(\\sinh u)'=\\cosh u$。",
    "<b>增长率比较</b>：问两个函数谁快、是否同阶，或借助增长率判断一个反常积分是否收敛。"
   ]
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "例题：跟着做一遍",
   "id": "ch07-s13"
  },
  {
   "t": "example",
   "no": "1",
   "tag": "反函数与反函数求导",
   "fields": [
    {
     "k": "题目",
     "html": "（教材 7.1 例 5、例 6 同型）(a) 求 $f(x)=x^3+2$（$x\\gt0$）的反函数及其导数。(b) 已知 $f(x)=x^3+x+1$ 可逆，求 $(f^{-1})'(3)$。"
    },
    {
     "k": "想一想",
     "html": "(a) 求反函数就是「由 $y$ 解出 $x$，再交换字母」。(b) 只求某一点的导数值，用反函数求导公式，关键是先看出哪个 $a$ 让 $f(a)=3$。"
    },
    {
     "k": "解答",
     "html": "(a) 由 $y=x^3+2$ 解出 $x=\\sqrt[3]{y-2}$，交换字母得 $f^{-1}(x)=\\sqrt[3]{x-2}$。求导：\n$$(f^{-1})'(x)=\\frac13(x-2)^{-2/3}=\\frac{1}{3\\sqrt[3]{(x-2)^2}}$$\n验算：$f'(x)=3x^2$，而 $\\frac{1}{f'(f^{-1}(x))}=\\frac{1}{3(\\sqrt[3]{x-2})^2}$，与上式相同。\n(b) 观察 $f(1)=1+1+1=3$，所以 $f^{-1}(3)=1$。又 $f'(x)=3x^2+1$，故\n$$(f^{-1})'(3)=\\frac{1}{f'(1)}=\\frac{1}{3+1}=\\frac14$$"
    },
    {
     "k": "点评",
     "html": "(a) 最后别忘了写定义域：$x\\gt0$ 时 $y\\gt2$，所以反函数的定义域是 $x\\gt2$。(b) 最容易错的是把 $3$ 直接代进 $f'$，写成 $\\frac{1}{f'(3)}$；公式要求代的是 $a=f^{-1}(b)=1$。"
    }
   ]
  },
  {
   "t": "example",
   "no": "2",
   "tag": "洛必达法则与 $1^\\infty$ 型",
   "fields": [
    {
     "k": "题目",
     "html": "（教材 7.5 例 1d、例 7 同型）求 (a) $\\lim\\limits_{x\\to0}\\frac{x-\\tan x}{x-\\sin x}$；(b) $\\lim\\limits_{x\\to0}(1+2x)^{1/(2x)}$；(c) $\\lim\\limits_{x\\to0}\\frac{1-\\cos x}{x+x^2}$。"
    },
    {
     "k": "想一想",
     "html": "(a) 代入是 $\\frac00$，用洛必达，注意可能要用两次。(b) 是 $1^\\infty$ 型，先取对数把指数拉下来。(c) 用一次洛必达后要看分母的极限是否为零：非零就该停。"
    },
    {
     "k": "解答",
     "html": "(a) 第一次洛必达：\n$$\\lim_{x\\to0}\\frac{x-\\tan x}{x-\\sin x}\\overset{\\frac00}{=}\\lim_{x\\to0}\\frac{1-\\sec^2x}{1-\\cos x}$$\n还是 $\\frac00$，但可以先化简：$1-\\sec^2x=-\\tan^2x$，于是原式 $=-\\lim\\frac{\\tan^2x}{1-\\cos x}$。再用一次洛必达（或直接估计 $\\tan x\\sim x$、$1-\\cos x\\sim\\frac{x^2}{2}$）得 $-\\lim\\frac{x^2}{x^2/2}=-2$。\n(b) 令 $y=(1+2x)^{1/(2x)}$，取对数：\n$$\\ln y=\\frac{\\ln(1+2x)}{2x}$$\n这是 $\\frac00$ 型，用洛必达：\n$$\\lim_{x\\to0}\\ln y=\\lim_{x\\to0}\\frac{\\frac{2}{1+2x}}{2}=1$$\n所以 $\\lim y=e^1=e$。\n(c) 用一次洛必达得 $\\lim\\limits_{x\\to0}\\frac{\\sin x}{1+2x}$。此刻分母趋于 $1$（非零），必须停止求导，直接代入得 $\\frac01=0$。"
    },
    {
     "k": "点评",
     "html": "洛必达不是「求到不能再求」，而是「求到不再是未定式就停」。$1^\\infty$ 型的标准流程是：取对数 → 用洛必达算 $L$ → 答案写 $e^L$。"
    }
   ]
  },
  {
   "t": "example",
   "no": "3",
   "tag": "分离变量：牛顿冷却定律",
   "fields": [
    {
     "k": "题目",
     "html": "（教材 7.4 例 6 同型）一杯 $100^\\circ\\text{C}$ 的咖啡放在 $25^\\circ\\text{C}$ 的房间里，20 分钟后温度降到 $60^\\circ\\text{C}$。再降到 $40^\\circ\\text{C}$ 还需要多少分钟？"
    },
    {
     "k": "想一想",
     "html": "冷却速度与「咖啡和室温的差」成正比，所以列方程 $\\frac{dH}{dt}=-k(H-25)$。先求 $k$，再求目标是 $40^\\circ\\text{C}$ 的时刻，最后减去已经过去的 20 分钟。"
    },
    {
     "k": "解答",
     "html": "令 $y=H-25$，方程变成 $y'=-ky$，解为 $y=y_0e^{-kt}$，即\n$$H-25=75e^{-kt}$$\n代入 $H(20)=60$：$35=75e^{-20k}$，得 $e^{-20k}=\\frac{7}{15}$，所以\n$$k=\\frac{1}{20}\\ln\\frac{15}{7}\\approx0.03809\\ \\text{（每分钟）}$$\n再令 $H=40$：$15=75e^{-kt}$，得 $e^{-kt}=\\frac15$，故\n$$t=\\frac{\\ln5}{k}=\\frac{20\\ln5}{\\ln15-\\ln7}\\approx\\frac{20\\times1.6094}{0.7621}\\approx42.2\\ \\text{分钟}$$\n已经过了 20 分钟，所以还需要 $42.2-20\\approx22$ 分钟。\n验算：$75e^{-0.03809\\times42.2}\\approx75\\times0.2=15$，对应 $H=40^\\circ\\text{C}$。"
    },
    {
     "k": "点评",
     "html": "三个坑：忘记先减环境温度 $25$；把「还需要多久」答成总时间；$k$ 的符号写错。$k$ 的具体表达式不唯一，但数值唯一。"
    }
   ]
  },
  {
   "t": "example",
   "no": "4",
   "tag": "放射性衰变与连续复利",
   "fields": [
    {
     "k": "题目",
     "html": "（教材 7.4 例 5 同型）(a) 某同位素的半衰期是 20 天，问 90% 的原子核完成衰变需要多少天？(b) 年利率 6% 的连续复利，本金翻倍要多少年？"
    },
    {
     "k": "想一想",
     "html": "(a) 半衰期给的是「减到一半」的时间，先用它求 $k$；「90% 完成衰变」意味着还剩 10%。(b) 翻倍就是 $A=2P$。"
    },
    {
     "k": "解答",
     "html": "(a) $k=\\frac{\\ln2}{20}\\approx0.03466$（每天），方程为 $y=y_0e^{-kt}$。剩 10% 时：\n$$y_0e^{-kt}=0.1y_0\\ \\Rightarrow\\ t=\\frac{\\ln10}{k}=\\frac{20\\ln10}{\\ln2}\\approx\\frac{20\\times2.3026}{0.6931}\\approx66.4\\ \\text{天}$$\n互检：$0.1=2^{-t/20}$，所以 $t=20\\log_210\\approx66.4$ 天。\n(b) 连续复利 $A=Pe^{rt}$，$r=0.06$。令 $A=2P$：\n$$2=e^{0.06t}\\ \\Rightarrow\\ t=\\frac{\\ln2}{0.06}\\approx\\frac{0.6931}{0.06}\\approx11.55\\ \\text{年}$$"
    },
    {
     "k": "点评",
     "html": "「已经衰变 90%」和「还剩 90%」是两件事，列方程前要读清楚。连续复利翻倍的时间约等于 $\\frac{69.3\\%}{r}$，这就是「72 法则」的来历。"
    }
   ]
  },
  {
   "t": "example",
   "no": "5",
   "tag": "反三角函数的积分（配方 + 换元）",
   "fields": [
    {
     "k": "题目",
     "html": "（教材 7.6 例 6、例 7 同型）求 (a) $\\int_0^{1/2}\\frac{dx}{\\sqrt{1-x^2}}$；(b) $\\int\\frac{dx}{\\sqrt{4x-x^2}}$；(c) $\\int\\frac{dx}{4x^2+4x+2}$。"
    },
    {
     "k": "想一想",
     "html": "(a) 直接是 $a^2-u^2$ 的形状，套 $\\arcsin$ 公式。(b) 先配方：$4x-x^2=4-(x-2)^2$。(c) 先配方：$4x^2+4x+2=(2x+1)^2+1$，再换元。"
    },
    {
     "k": "解答",
     "html": "(a) 取 $a=1$、$u=x$：\n$$\\int_0^{1/2}\\frac{dx}{\\sqrt{1-x^2}}=\\Big[\\arcsin x\\Big]_0^{1/2}=\\frac\\pi6-0=\\frac\\pi6$$\n(b) $4x-x^2=4-(x-2)^2$，令 $u=x-2$，$du=dx$：\n$$\\int\\frac{dx}{\\sqrt{4x-x^2}}=\\int\\frac{du}{\\sqrt{2^2-u^2}}=\\arcsin\\frac{x-2}{2}+C$$\n(c) $4x^2+4x+2=(2x+1)^2+1$，令 $u=2x+1$，$du=2\\,dx$：\n$$\\int\\frac{dx}{4x^2+4x+2}=\\frac12\\int\\frac{du}{u^2+1}=\\frac12\\arctan(2x+1)+C$$"
    },
    {
     "k": "点评",
     "html": "三个检查点：配方后根号内是差还是和；换元时 $du$ 多出来的系数（(c) 的 $\\frac12$ 最容易漏）；定积分换元后上下限要一起换。"
    }
   ]
  },
  {
   "t": "example",
   "no": "6",
   "tag": "双曲函数的求导与积分",
   "fields": [
    {
     "k": "题目",
     "html": "（教材 7.7 例 1 同型）求 (a) $\\frac{d}{dt}\\tanh\\sqrt{1+t^2}$；(b) $\\int_0^1\\sinh^2x\\,dx$；(c) $\\int\\coth5x\\,dx$。"
    },
    {
     "k": "想一想",
     "html": "(a) 是复合函数：外层 $\\tanh$，内层 $\\sqrt{1+t^2}$。(b) 用降幂公式 $\\sinh^2x=\\frac{\\cosh2x-1}{2}$。(c) 令 $u=\\sinh5x$，因为 $\\coth5x=\\frac{\\cosh5x}{\\sinh5x}$。"
    },
    {
     "k": "解答",
     "html": "(a) 记 $u=\\sqrt{1+t^2}$，$u'=\\frac{t}{\\sqrt{1+t^2}}$：\n$$\\frac{d}{dt}\\tanh\\sqrt{1+t^2}=\\operatorname{sech}^2\\sqrt{1+t^2}\\cdot\\frac{t}{\\sqrt{1+t^2}}=\\frac{t\\operatorname{sech}^2\\sqrt{1+t^2}}{\\sqrt{1+t^2}}$$\n(b) 用降幂公式：\n$$\\int_0^1\\sinh^2x\\,dx=\\frac12\\Big[\\frac{\\sinh2x}{2}-x\\Big]_0^1=\\frac{\\sinh2}{4}-\\frac12\\approx\\frac{3.6269}{4}-0.5\\approx0.40672$$\n(c) 令 $u=\\sinh5x$，则 $du=5\\cosh5x\\,dx$：\n$$\\int\\coth5x\\,dx=\\frac15\\int\\frac{du}{u}=\\frac15\\ln|\\sinh5x|+C$$"
    },
    {
     "k": "点评",
     "html": "区分 $\\sinh2x$（先乘 2 再取 sinh）与 $\\sinh^2x$（先取 sinh 再平方）。$\\int\\coth u\\,du=\\ln|\\sinh u|+C$ 与 $\\int\\cot u\\,du=\\ln|\\sin u|+C$ 结构一样，可以对照着记。"
    }
   ]
  },
  {
   "t": "example",
   "no": "7",
   "tag": "相对增长率比较",
   "fields": [
    {
     "k": "题目",
     "html": "（教材 7.8 例 1 及习题 19–22 同型）(a) 比较 $\\ln x$ 与 $x^{0.1}$ 的增长速度。(b) $x^{100}$ 与 $e^x$ 谁更快？(c) 比较 $x^x$ 与 $e^x$。(d) 借助增长率解释 $\\int_1^{\\infty}\\frac{dx}{\\ln x}$ 为什么发散。"
    },
    {
     "k": "想一想",
     "html": "比较快慢就写比值、算极限。遇到幂和指数混在一起，就把幂写成 $e$ 的指数形式，例如 $x^x=e^{x\\ln x}$。"
    },
    {
     "k": "解答",
     "html": "(a) 用洛必达：\n$$\\lim_{x\\to\\infty}\\frac{\\ln x}{x^{0.1}}=\\lim_{x\\to\\infty}\\frac{\\frac1x}{0.1x^{-0.9}}=\\lim_{x\\to\\infty}\\frac{10}{x^{0.1}}=0$$\n所以 $\\ln x$ 比任何正幂都慢。\n(b) 连续用 100 次洛必达：\n$$\\lim_{x\\to\\infty}\\frac{x^{100}}{e^x}=\\lim_{x\\to\\infty}\\frac{100!}{e^x}=0$$\n所以 $e^x$ 比任何多项式都快。\n(c) 写成指数：$x^x=e^{x\\ln x}$，于是\n$$\\lim_{x\\to\\infty}\\frac{x^x}{e^x}=\\lim_{x\\to\\infty}e^{x(\\ln x-1)}=\\infty$$\n所以 $x^x$ 比任何固定底的指数函数都快。\n(d) 在 $[e,\\infty)$ 上 $\\ln x\\lt x$，所以 $\\frac{1}{\\ln x}\\gt\\frac1x\\gt0$。而 $\\int_e^\\infty\\frac{dx}{x}$ 发散，由比较判别法知原积分发散。直观上：$\\ln x$ 涨得太慢，它的倒数也就衰减得太慢，积累起来仍然无穷。"
    },
    {
     "k": "点评",
     "html": "「同阶」（比值趋于正常数）与「更快」（比值趋于无穷）是两回事。比较判别法只对非负函数成立，并且要注意不等式方向：大的发散，小的也跟着发散。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "这些地方最容易错",
   "id": "ch07-s21"
  },
  {
   "t": "list",
   "items": [
    "<b>把 $f^{-1}$ 当成倒数。</b>错在把记号 $-1$ 读成「负一次方」。$\\sin^{-1}x$ 就是 $\\arcsin x$，不是 $\\frac{1}{\\sin x}$；$f^{-1}$ 是反函数，不是 $\\frac1f$。",
    "<b>反函数求导时把 $b$ 代进 $f'$。</b>公式的分母是 $f'(a)$，其中 $a=f^{-1}(b)$。错因是只盯着公式里的 $b$，忘了先把 $b$ 倒推回 $a$。",
    "<b>$\\int\\frac{du}{u}$ 忘写绝对值。</b>错在把 $\\ln u$ 的定义域 $(0,\\infty)$ 直接搬过来。当 $u\\lt0$ 时 $\\frac1u$ 仍有定义，原函数要写成 $\\ln|u|$。",
    "<b>$a^x$ 求导漏掉 $\\ln a$。</b>错在把 $e^x$ 的公式当通用公式。记住 $a^x=e^{x\\ln a}$，链式法则会带出 $\\ln a$；只有 $a=e$ 时它才等于 $1$ 而消失。",
    "<b>洛必达用过头。</b>用一次之后如果分母（或分子）的极限是非零数，就必须停手。继续求导会得到一个错误的答案。每步之前都要重新判断类型。",
    "<b>把 $1^\\infty$ 当成 1。</b>底数虽然趋于 1，但指数也在变，两者会「拉扯」出一个非平凡的结果。正确做法是先取对数求 $L$，再写 $e^L$。",
    "<b>增长/衰减题里把百分比直接当 $k$。</b>「每年减少 20%」意味着乘 $0.8$，对应 $k=\\ln0.8$，不是 $k=-0.2$。$k$ 是连续变化的速率，不是离散的百分比。",
    "<b>冷却题忘记减环境温度。</b>牛顿冷却定律描述的是「温差」按比例衰减，不是温度本身。先把 $H-H_S$ 当成新变量，再套指数公式。",
    "<b>反三角积分不配方就硬套。</b>公式只认 $a^2-u^2$、$a^2+u^2$、$u^2-a^2$ 三种形状。看到 $4x-x^2$ 先写成 $4-(x-2)^2$，看到 $4x^2+4x+2$ 先写成 $(2x+1)^2+1$。",
    "<b>把双曲恒等式写成加号。</b>三角是 $\\sin^2+\\cos^2=1$，双曲是 $\\cosh^2-\\sinh^2=1$，一加一减。另外反双曲的 $-1$ 表示反函数，不是倒数。"
   ]
  },
  {
   "t": "callout",
   "kind": "warn",
   "title": "两个最容易错的地方",
   "html": "第一，洛必达法则只对 $\\frac00$ 与 $\\frac\\infty\\infty$ 直接使用；其他形状必须先变形。第二，$\\int\\frac{du}{u}=\\ln|u|+C$ 的绝对值不能省，这是后面解微分方程时最常见的错误。"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "这一章要记住的",
   "id": "ch07-s11"
  },
  {
   "t": "formula",
   "items": [
    {
     "name": "反函数求导",
     "tex": "(f^{-1})'(b)=\\frac{1}{f'(a)},\\ a=f^{-1}(b)"
    },
    {
     "name": "自然对数定义",
     "tex": "\\ln x=\\int_1^x\\frac{1}{t}\\,dt"
    },
    {
     "name": "$\\ln$ 的导数与积分",
     "tex": "(\\ln u)'=\\frac{u'}{u},\\qquad \\int\\frac{du}{u}=\\ln|u|+C"
    },
    {
     "name": "对数法则",
     "tex": "\\ln(bx)=\\ln b+\\ln x,\\quad \\ln\\frac bx=\\ln b-\\ln x,\\quad \\ln x^r=r\\ln x"
    },
    {
     "name": "$e$ 的定义",
     "tex": "\\ln e=1,\\qquad e=\\lim_{x\\to0}(1+x)^{1/x}"
    },
    {
     "name": "指数函数导数",
     "tex": "(e^x)'=e^x,\\qquad (a^x)'=a^x\\ln a"
    },
    {
     "name": "指数变化",
     "tex": "\\frac{dy}{dt}=ky\\ \\Longrightarrow\\ y=y_0e^{kt}"
    },
    {
     "name": "半衰期",
     "tex": "T=\\frac{\\ln2}{k}"
    },
    {
     "name": "洛必达法则",
     "tex": "\\lim_{x\\to a}\\frac{f(x)}{g(x)}=\\lim_{x\\to a}\\frac{f'(x)}{g'(x)}"
    },
    {
     "name": "反三角导数",
     "tex": "(\\arcsin u)'=\\frac{u'}{\\sqrt{1-u^2}},\\qquad (\\arctan u)'=\\frac{u'}{1+u^2}"
    },
    {
     "name": "反三角积分",
     "tex": "\\int\\frac{du}{\\sqrt{a^2-u^2}}=\\arcsin\\frac ua+C,\\qquad \\int\\frac{du}{a^2+u^2}=\\frac1a\\arctan\\frac ua+C"
    },
    {
     "name": "双曲函数",
     "tex": "\\sinh x=\\frac{e^x-e^{-x}}2,\\quad \\cosh x=\\frac{e^x+e^{-x}}2,\\quad \\cosh^2x-\\sinh^2x=1"
    },
    {
     "name": "增长率阶梯",
     "tex": "\\ln x\\ll x^p\\ll a^x\\ll x^x"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "接下来学什么",
   "id": "ch07-s22"
  },
  {
   "t": "p",
   "html": "这一章的 $\\ln$ 与 $e^x$ 会马上在第 8 章派上用场：分部积分之后经常出现 $\\int\\frac{dx}{x}$，三角代换回代时也会撞见对数。第 9 章把 $e^x$ 展开成幂级数，你会发现它是最「标准」的级数。第 16 章的一阶微分方程，基本就是把 7.4 的分离变量再系统化一遍。而反三角函数，会在第 8 章的三角代换里以「回代」的形式再次出现。"
  },
  {
   "t": "checklist",
   "id": "ch07",
   "items": [
    "我能说清为什么 $\\ln x$ 要用积分定义，并解释 $\\ln1=0$。",
    "我能自己推出 $\\ln$ 与 $e^x$ 互为反函数，并推出 $(\\ln x)'=\\frac1x$、$(e^x)'=e^x$。",
    "我能由 $y=f(x)$ 求 $f^{-1}$，并用反函数求导公式算某点的导数值。",
    "我能用分离变量解 $y'=ky$，并求半衰期、冷却或复利问题。",
    "我能判断不定式的类型，用洛必达或取对数求出极限。",
    "我能写出反三角与双曲函数的定义、导数，并说明它们的积分公式怎么用。"
   ]
  }
 ]
});
