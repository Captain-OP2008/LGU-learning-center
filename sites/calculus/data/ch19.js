/* =====================================================================
 * data/ch19.js · 第F章 全书公式速查表（Formula Reference · about 510 formulas）
 * 内容：110 blocks / 0 定理 / 0 例题 / 0 公式 / 2 列表 / 1 实验台 / 0 演算台 / 0 内嵌题
 * ===================================================================== */
CSC.registerChapter({
 "id": "ch19",
 "num": "F",
 "title": "全书公式速查表",
 "en": "Formula Reference · about 510 formulas",
 "goals": [
  "查到并写对代数、三角与双曲恒等式。",
  "用等价无穷小和常用极限表计算极限。",
  "按被积函数的形状查积分表，写出基本积分与含 $a^2\\pm x^2$ 的结果。",
  "写出常用级数展开、弧长/曲率公式与三大定理。",
  "知道哪些公式可以直接套，哪些必须自己推。"
 ],
 "kp": [
  {
   "id": "ch19-1",
   "title": "4.0 积分总则（p.1243）"
  },
  {
   "id": "ch19-2",
   "title": "4.1 基本形式"
  },
  {
   "id": "ch19-3",
   "title": "4.2 含 $ax+b$"
  },
  {
   "id": "ch19-4",
   "title": "4.3 含 $a^2+x^2$ 识别特征：分母是\"平方和\""
  },
  {
   "id": "ch19-5",
   "title": "4.4 含 $a^2-x^2$ 识别特征：分母是\"平方差\"、$a^2$ 在前"
  },
  {
   "id": "ch19-6",
   "title": "4.5 含 $x^2-a^2$ 识别特征：$x^2$ 在前，需 $|x|&gt;a$"
  },
  {
   "id": "ch19-7",
   "title": "4.6 含 $\\sqrt{2ax-x^2}$ 识别特征：配方成 $a^2-(x-a)^2$"
  },
  {
   "id": "ch19-8",
   "title": "4.7 三角幂与三角乘积"
  },
  {
   "id": "ch19-9",
   "title": "4.8 反三角形式"
  },
  {
   "id": "ch19-10",
   "title": "4.9 指数与对数形式"
  },
  {
   "id": "ch19-11",
   "title": "4.10 双曲形式与定积分"
  },
  {
   "id": "ch19-12",
   "title": "7.1 弧长、面积、体积、曲面面积（第 6 章）"
  },
  {
   "id": "ch19-13",
   "title": "7.2 向量、直线、平面（第 12 章）"
  },
  {
   "id": "ch19-14",
   "title": "7.3 空间曲线：弧长、$TNB$ 与曲率（第 13 章）"
  },
  {
   "id": "ch19-15",
   "title": "7.4 多元微分（第 14 章）"
  },
  {
   "id": "ch19-16",
   "title": "7.5 重积分与三大定理（第 15 章 / p.1239–p.1240）"
  }
 ],
 "blocks": [
  {
   "t": "callout",
   "kind": "why",
   "title": "这张表怎么用",
   "html": "<p>学到后面你会发现，微积分里真正难的不是「推新公式」，而是「选对工具」：这个积分长什么样、该查哪一条？这个展开收敛到哪？$\\nabla\\times\\mathbf F$ 和 $\\nabla\\cdot\\mathbf F$ 到底有什么区别？</p>\n<p>这张表把全书的公式按主题排好，是<b>字典</b>，不是课文。你可以不从头读，但不能不知道去哪查。</p>\n<p>为了让「只会查表」变成「看得懂、用得对」，每一组前面加了一两句导读（这组公式解决什么问题、最常用的是哪几个），每组后面加一条使用提示（什么时候能直接套、哪里最容易错）。</p>"
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "开始前你需要知道",
   "html": "<ul><li>每张表都带<b>条件</b>（例如 $a\\gt0$、$|x|\\lt1$、$n\\ne-1$）。忽略条件，是这类题最常见的出错原因。</li>\n<li>不定积分最后别忘 $+C$；定积分注意上下限的方向（$\\int_b^a=-\\int_a^b$）。</li>\n<li>查表顺序：先看被积函数（或函数）的<b>形状</b>，再按分组定位；形状不吻合时，先换元把式子变成表里的样子。</li></ul>"
  },
  {
   "t": "scope",
   "scope": "tool",
   "weeks": "—",
   "sections": "全书公式"
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "这张表的来源",
   "html": "<p>内容来自教材书末的参考页（A Brief Table of Integrals、Basic Algebra Formulas、Limits/Differentiation/Integration Rules，p.1229–p.1243），并按全书正文补充了常用结论。它不是用来从头读的，是用来查的。</p>"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "代数、三角与双曲恒等式",
   "id": "ch19-s1"
  },
  {
   "t": "p",
   "html": "<b>导读</b>：这一组是「化简工具」。代数恒等式帮你拆括号、配方；三角恒等式帮你把陌生角化成熟角；双曲函数则是「和三角函数一一对应、只差几个符号」的亲戚。用得最多的三个：$\\sin^2u+\\cos^2u=1$、二倍角 $\\cos2u=\\cos^2u-\\sin^2u$、降幂公式——遇到 $\\sin^2x$ 要积分，第一反应就是降幂。"
  },
  {
   "t": "p",
   "html": "<strong>代数（p.1235–p.1236）</strong>"
  },
  {
   "t": "table",
   "head": [
    "名称",
    "公式"
   ],
   "rows": [
    [
     "指数律",
     "$a^ma^n=a^{m+n}$，$(ab)^m=a^mb^m$，$(a^m)^n=a^{mn}$，$\\dfrac{a^m}{a^n}=a^{m-n}$，$a^{-m}=\\dfrac{1}{a^m}$，$a^0=1\\ (a\\neq0)$"
    ],
    [
     "符号律",
     "$-(-a)=a$，$-\\dfrac{a}{b}=\\dfrac{-a}{b}=\\dfrac{a}{-b}$，$\\dfrac{a}{b/c}=\\dfrac{ac}{b}$"
    ],
    [
     "二项式定理",
     "$(a+b)^n=\\sum_{k=0}^{n}\\binom{n}{k}a^{n-k}b^k$，$\\binom{n}{k}=\\dfrac{n(n-1)\\cdots(n-k+1)}{k!}$"
    ],
    [
     "立方和差",
     "$a^3\\pm b^3=(a\\pm b)(a^2\\mp ab+b^2)$"
    ],
    [
     "同次幂差",
     "$a^n-b^n=(a-b)(a^{n-1}+a^{n-2}b+\\cdots+b^{n-1})$"
    ],
    [
     "配方法",
     "$ax^2+bx+c=a\\left(x+\\dfrac{b}{2a}\\right)^2+\\left(c-\\dfrac{b^2}{4a}\\right)$"
    ],
    [
     "求根公式",
     "$x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}$"
    ]
   ]
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "使用提示：配方是通用动作",
   "html": "把 $x^2+bx$ 补成 $\\left(x+\\dfrac b2\\right)^2-\\dfrac{b^2}4$，就能求圆心、解二次不等式、算 $\\displaystyle\\int\\frac{dx}{x^2+4x+13}$ 这类积分。配上的数要两边都加，圆心坐标取相反数。"
  },
  {
   "t": "p",
   "html": "<strong>三角（p.1238）</strong>"
  },
  {
   "t": "table",
   "head": [
    "类别",
    "公式"
   ],
   "rows": [
    [
     "倒数关系",
     "$\\tan u=\\dfrac{\\sin u}{\\cos u}$，$\\cot u=\\dfrac{\\cos u}{\\sin u}$，$\\sec u=\\dfrac{1}{\\cos u}$，$\\csc u=\\dfrac{1}{\\sin u}$"
    ],
    [
     "勾股型",
     "$\\sin^2u+\\cos^2u=1$，$\\sec^2u=1+\\tan^2u$，$\\csc^2u=1+\\cot^2u$"
    ],
    [
     "奇偶性",
     "$\\sin(-u)=-\\sin u$，$\\cos(-u)=\\cos u$，$\\tan(-u)=-\\tan u$"
    ],
    [
     "二倍角",
     "$\\sin2u=2\\sin u\\cos u$，$\\cos2u=\\cos^2u-\\sin^2u$，$\\tan2u=\\dfrac{2\\tan u}{1-\\tan^2u}$"
    ],
    [
     "降幂",
     "$\\cos^2u=\\dfrac{1+\\cos2u}{2}$，$\\sin^2u=\\dfrac{1-\\cos2u}{2}$"
    ],
    [
     "和角",
     "$\\sin(A\\pm B)=\\sin A\\cos B\\pm\\cos A\\sin B$；$\\cos(A\\pm B)=\\cos A\\cos B\\mp\\sin A\\sin B$；$\\tan(A\\pm B)=\\dfrac{\\tan A\\pm\\tan B}{1\\mp\\tan A\\tan B}$"
    ],
    [
     "余角",
     "$\\sin\\left(\\dfrac{\\pi}{2}-A\\right)=\\cos A$，$\\cos\\left(\\dfrac{\\pi}{2}-A\\right)=\\sin A$；$\\sin\\left(\\dfrac{\\pi}{2}+A\\right)=\\cos A$，$\\cos\\left(\\dfrac{\\pi}{2}+A\\right)=-\\sin A$"
    ],
    [
     "积化和差",
     "$\\sin A\\sin B=\\frac12[\\cos(A-B)-\\cos(A+B)]$；$\\cos A\\cos B=\\frac12[\\cos(A-B)+\\cos(A+B)]$；$\\sin A\\cos B=\\frac12[\\sin(A-B)+\\sin(A+B)]$"
    ],
    [
     "和差化积",
     "$\\sin A\\pm\\sin B=2\\sin\\frac{A\\pm B}{2}\\cos\\frac{A\\mp B}{2}$；$\\cos A+\\cos B=2\\cos\\frac{A+B}{2}\\cos\\frac{A-B}{2}$；$\\cos A-\\cos B=-2\\sin\\frac{A+B}{2}\\sin\\frac{A-B}{2}$"
    ],
    [
     "弧度制",
     "$180^\\circ=\\pi$ 弧度；扇形弧长 $s=r\\theta$"
    ]
   ]
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "使用提示：三角的两条主线",
   "html": "换角公式别死记，记住两个源头：和角公式与 $\\sin^2+\\cos^2=1$，其余都能推。另外记住两条：<b>余函数（$\\cos,\\cot,\\csc$）的导数都带负号</b>；遇到 $\\sin^2x$ 或 $\\cos^2x$ 要积分，先用降幂。"
  },
  {
   "t": "p",
   "html": "<strong>双曲函数（第 7 章）</strong>"
  },
  {
   "t": "tex",
   "tex": "\\sinh x=\\frac{e^x-e^{-x}}{2},\\quad \\cosh x=\\frac{e^x+e^{-x}}{2},\\quad \\tanh x=\\frac{\\sinh x}{\\cosh x}$$\n$$\\cosh^2x-\\sinh^2x=1,\\quad \\sinh2x=2\\sinh x\\cosh x,\\quad \\cosh2x=\\cosh^2x+\\sinh^2x$$\n$$\\sinh^{-1}x=\\ln\\!\\left(x+\\sqrt{x^2+1}\\right),\\quad \\cosh^{-1}x=\\ln\\!\\left(x+\\sqrt{x^2-1}\\right)\\ (x\\ge1),\\quad \\tanh^{-1}x=\\tfrac12\\ln\\frac{1+x}{1-x}\\ (|x|&lt;1)"
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "使用提示：双曲与三角的对应",
   "html": "双曲函数与三角函数一一对应，只是符号有差别：$\\cosh^2x-\\sinh^2x=1$（这里是减号，三角是加号）；$(\\cosh x)'=\\sinh x$（不带负号）。看到结果里出现 $\\ln\\left(x+\\sqrt{x^2+1}\\right)$，就知道它是反双曲函数。"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "极限与等价无穷小（含常用极限清单）",
   "id": "ch19-s2"
  },
  {
   "t": "p",
   "html": "<b>导读</b>：算极限先看能不能「直接代入」（连续函数代入即可）。遇到 $\\dfrac00$ 或 $\\dfrac{\\infty}{\\infty}$，再动用下面的工具。三个最常用：等价无穷小、洛必达法则、$1^\\infty$ 型的标准形。"
  },
  {
   "t": "p",
   "html": "<strong>极限运算法则（p.1241）</strong>：设 $\\lim_{x\\to c}f(x)=L$，$\\lim_{x\\to c}g(x)=M$，则"
  },
  {
   "t": "tex",
   "tex": "\\lim_{x\\to c}\\bigl(f\\pm g\\bigr)=L\\pm M,\\qquad \\lim_{x\\to c}(f\\cdot g)=LM,\\qquad \\lim_{x\\to c}\\frac{f}{g}=\\frac{L}{M}\\ (M\\neq0),\\qquad \\lim_{x\\to c}kf=kL"
  },
  {
   "t": "p",
   "html": "<strong>代入原则</strong>：$P$ 为多项式 $\\Rightarrow \\lim_{x\\to c}P(x)=P(c)$；$Q(c)\\neq0 \\Rightarrow \\lim_{x\\to c}\\dfrac{P(x)}{Q(x)}=\\dfrac{P(c)}{Q(c)}$；$f$ 在 $c$ 连续 $\\Rightarrow \\lim_{x\\to c}f(x)=f(c)$；$g$ 在 $L$ 连续 $\\Rightarrow \\lim_{x\\to c}g(f(x))=g(L)$。"
  },
  {
   "t": "p",
   "html": "<strong>夹逼定理</strong>：$g(x)\\le f(x)\\le h(x)$ 且 $\\lim g=\\lim h=L$ $\\Rightarrow \\lim f=L$。\n<strong>保序性</strong>：$f(x)\\le g(x)$ 且两极限存在 $\\Rightarrow \\lim f\\le\\lim g$。"
  },
  {
   "t": "p",
   "html": "<strong>L'Hôpital 法则</strong>：$f(a)=g(a)=0$（或同趋于 $\\pm\\infty$），$f',g'$ 在含 $a$ 的开区间存在、$g'(x)\\neq0\\ (x\\neq a)$，则"
  },
  {
   "t": "tex",
   "tex": "\\lim_{x\\to a}\\frac{f(x)}{g(x)}=\\lim_{x\\to a}\\frac{f'(x)}{g'(x)}\\quad(\\text{右端存在时})"
  },
  {
   "t": "p",
   "html": "<strong>等价无穷小（$x\\to0$）</strong>——乘除可换、加减慎用"
  },
  {
   "t": "table",
   "head": [
    "等价",
    "等价",
    "等价"
   ],
   "rows": [
    [
     "$\\sin x\\sim x$",
     "$\\tan x\\sim x$",
     "$\\arcsin x\\sim x$"
    ],
    [
     "$\\arctan x\\sim x$",
     "$1-\\cos x\\sim\\dfrac{x^2}{2}$",
     "$\\sec x-1\\sim\\dfrac{x^2}{2}$"
    ],
    [
     "$e^x-1\\sim x$",
     "$a^x-1\\sim x\\ln a$",
     "$\\ln(1+x)\\sim x$"
    ],
    [
     "$(1+x)^\\alpha-1\\sim\\alpha x$",
     "$x-\\sin x\\sim\\dfrac{x^3}{6}$",
     "$\\tan x-x\\sim\\dfrac{x^3}{3}$"
    ],
    [
     "$x-\\ln(1+x)\\sim\\dfrac{x^2}{2}$",
     "$\\tan x-\\sin x\\sim\\dfrac{x^3}{2}$",
     "$\\sinh x\\sim x$，$\\tanh x\\sim x$"
    ]
   ]
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "使用提示：等价无穷小只能在乘除里换",
   "html": "等价无穷小只能在<b>乘除</b>中替换；在加减里直接换会出错：$\\tan x-\\sin x$ 不能写成 $x-x=0$（正确答案的主项是 $\\dfrac{x^3}2$）。原因是两个「近似相等」的量相减，误差会被放大。"
  },
  {
   "t": "p",
   "html": "<strong>常用极限清单</strong>"
  },
  {
   "t": "tex",
   "tex": "\\lim_{x\\to0}\\frac{\\sin x}{x}=1,\\qquad \\lim_{x\\to0}\\frac{1-\\cos x}{x}=0,\\qquad \\lim_{x\\to0}(1+x)^{1/x}=e,\\qquad \\lim_{n\\to\\infty}\\left(1+\\frac1n\\right)^n=e$$\n$$\\lim_{x\\to0}\\frac{\\ln(1+x)}{x}=1,\\qquad \\lim_{x\\to0}\\frac{e^x-1}{x}=1,\\qquad \\lim_{x\\to0^+}x\\ln x=0,\\qquad \\lim_{x\\to\\infty}\\frac{\\ln x}{x^p}=0\\ (p&gt;0)$$\n$$\\lim_{x\\to\\infty}\\left(1+\\frac{a}{x}\\right)^{x}=e^a,\\qquad \\lim_{x\\to0}\\frac{\\cosh x-1}{x^2}=\\frac12,\\qquad \\lim_{x\\to\\infty}\\frac{x^n}{e^x}=0,\\qquad \\lim_{x\\to\\pm\\infty}\\left(1+\\frac1x\\right)^{x}=e"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "导数法则与导数表",
   "id": "ch19-s3"
  },
  {
   "t": "p",
   "html": "<b>导读</b>：导数表是「查到就能用」的部分。最常出现的五个：$(x^n)'=nx^{n-1}$、$(\\sin x)'=\\cos x$、$(\\cos x)'=-\\sin x$、$(e^x)'=e^x$、$(\\ln x)'=\\dfrac1x$。复合函数别忘了链式法则。"
  },
  {
   "t": "p",
   "html": "<strong>一般法则（$u,y$ 均为 $x$ 的可导函数，p.1242）</strong>"
  },
  {
   "t": "tex",
   "tex": "(c)'=0,\\qquad (u\\pm y)'=u'\\pm y',\\qquad (cu)'=cu',\\qquad (uy)'=u'y+uy',\\qquad \\left(\\frac{u}{y}\\right)'=\\frac{u'y-uy'}{y^2}$$\n$$(x^n)'=nx^{n-1},\\qquad \\bigl(f(g(x))\\bigr)'=f'(g(x))\\,g'(x)"
  },
  {
   "t": "p",
   "html": "<strong>基本导数表</strong>"
  },
  {
   "t": "table",
   "head": [
    "$f(x)$",
    "$f'(x)$",
    "$f(x)$",
    "$f'(x)$"
   ],
   "rows": [
    [
     "$\\sin x$",
     "$\\cos x$",
     "$\\sinh x$",
     "$\\cosh x$"
    ],
    [
     "$\\cos x$",
     "$-\\sin x$",
     "$\\cosh x$",
     "$\\sinh x$"
    ],
    [
     "$\\tan x$",
     "$\\sec^2x$",
     "$\\tanh x$",
     "$\\operatorname{sech}^2x$"
    ],
    [
     "$\\cot x$",
     "$-\\csc^2x$",
     "$\\coth x$",
     "$-\\operatorname{csch}^2x$"
    ],
    [
     "$\\sec x$",
     "$\\sec x\\tan x$",
     "$\\operatorname{sech}x$",
     "$-\\operatorname{sech}x\\tanh x$"
    ],
    [
     "$\\csc x$",
     "$-\\csc x\\cot x$",
     "$\\operatorname{csch}x$",
     "$-\\operatorname{csch}x\\coth x$"
    ],
    [
     "$e^x$",
     "$e^x$",
     "$\\ln x$",
     "$1/x$"
    ],
    [
     "$a^x$",
     "$a^x\\ln a$",
     "$\\log_ax$",
     "$\\dfrac{1}{x\\ln a}$"
    ]
   ]
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "使用提示：三角求导的负号规律",
   "html": "正弦属「正」，余弦、余切、余割属「余」。<b>余函数的导数都带负号</b>：$(\\cos x)'=-\\sin x$、$(\\cot x)'=-\\csc^2x$、$(\\csc x)'=-\\csc x\\cot x$；而 $(\\sec x)'=\\sec x\\tan x$ 是正号。反三角函数的导数分母带根号，$\\arcsin$ 与 $\\arccos$ 只差一个负号。"
  },
  {
   "t": "p",
   "html": "<strong>反三角与反双曲</strong>"
  },
  {
   "t": "tex",
   "tex": "\\frac{d}{dx}\\sin^{-1}x=\\frac{1}{\\sqrt{1-x^2}},\\qquad \\frac{d}{dx}\\cos^{-1}x=-\\frac{1}{\\sqrt{1-x^2}},\\qquad \\frac{d}{dx}\\tan^{-1}x=\\frac{1}{1+x^2},\\qquad \\frac{d}{dx}\\cot^{-1}x=-\\frac{1}{1+x^2}$$\n$$\\frac{d}{dx}\\sec^{-1}x=\\frac{1}{|x|\\sqrt{x^2-1}}\\ (|x|&gt;1),\\qquad \\frac{d}{dx}\\csc^{-1}x=-\\frac{1}{|x|\\sqrt{x^2-1}}\\ (|x|&gt;1)$$\n$$\\frac{d}{dx}\\sinh^{-1}x=\\frac{1}{\\sqrt{1+x^2}},\\qquad \\frac{d}{dx}\\cosh^{-1}x=\\frac{1}{\\sqrt{x^2-1}}\\ (x&gt;1),\\qquad \\frac{d}{dx}\\tanh^{-1}x=\\frac{1}{1-x^2}\\ (|x|&lt;1)$$\n$$\\frac{d}{dx}\\coth^{-1}x=\\frac{1}{1-x^2}\\ (|x|&gt;1),\\qquad \\frac{d}{dx}\\operatorname{sech}^{-1}x=-\\frac{1}{x\\sqrt{1-x^2}}\\ (0&lt;x&lt;1),\\qquad \\frac{d}{dx}\\operatorname{csch}^{-1}x=-\\frac{1}{|x|\\sqrt{1+x^2}}"
  },
  {
   "t": "p",
   "html": "<strong>参数方程与隐函数</strong>"
  },
  {
   "t": "tex",
   "tex": "\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt},\\qquad \\frac{d^2y}{dx^2}=\\frac{dy'/dt}{dx/dt}\\quad\\left(y'=\\frac{dy}{dx}\\right)"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "积分法则与基本积分表",
   "id": "ch19-s4"
  },
  {
   "t": "p",
   "html": "<b>导读</b>：积分表是全书最有用的一张。查表方法：先看被积函数的「形状」——分母是平方和？平方差？有根号吗？——再到对应的 4.x 组去找。找不到时，用下面「模式 → 手法」表决定是换元、分部还是配方。"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "4.0 积分总则（p.1243）",
   "id": "ch19-s5"
  },
  {
   "t": "tex",
   "tex": "\\int_a^a f=0,\\qquad \\int_b^a f=-\\int_a^b f,\\qquad \\int_a^b kf=k\\int_a^b f,\\qquad \\int_a^b(f\\pm g)=\\int_a^b f\\pm\\int_a^b g$$\n$$\\int_a^b f+\\int_b^c f=\\int_a^c f,\\qquad m(b-a)\\le\\int_a^b f\\le M(b-a)\\ \\bigl(m\\le f\\le M\\ \\text{on}\\ [a,b]\\bigr)$$\n$$f\\ge g\\ \\text{on}\\ [a,b]\\Rightarrow\\int_a^b f\\ge\\int_a^b g;\\qquad f\\ge0\\Rightarrow\\int_a^b f\\ge0"
  },
  {
   "t": "p",
   "html": "<strong>微积分基本定理</strong>：$f$ 在 $[a,b]$ 连续时 $F(x)=\\int_a^x f(t)\\,dt$ 连续、在 $(a,b)$ 可导且 $F'(x)=\\dfrac{d}{dx}\\int_a^x f(t)\\,dt=f(x)$；若 $F$ 是 $f$ 的任一原函数，则 $\\int_a^b f(x)\\,dx=F(b)-F(a)$。"
  },
  {
   "t": "tex",
   "tex": "\\int_a^b f(g(x))g'(x)\\,dx=\\int_{g(a)}^{g(b)}f(u)\\,du,\\qquad \\int_a^b u\\,v'\\,dx=\\Bigl[u\\,v\\Bigr]_a^b-\\int_a^b v\\,u'\\,dx"
  },
  {
   "t": "lab",
   "id": "inttable"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "4.1 基本形式",
   "id": "ch19-s6"
  },
  {
   "t": "tex",
   "tex": "\\int k\\,dx=kx+C,\\qquad \\int x^n dx=\\frac{x^{n+1}}{n+1}+C\\ (n\\neq-1),\\qquad \\int \\frac{dx}{x}=\\ln|x|+C$$\n$$\\int e^x dx=e^x+C,\\qquad \\int a^x dx=\\frac{a^x}{\\ln a}+C\\ (a&gt;0,a\\neq1),\\qquad \\int \\sin x\\,dx=-\\cos x+C,\\qquad \\int \\cos x\\,dx=\\sin x+C$$\n$$\\int \\sec^2x\\,dx=\\tan x+C,\\quad \\int \\csc^2x\\,dx=-\\cot x+C,\\quad \\int \\sec x\\tan x\\,dx=\\sec x+C,\\quad \\int \\csc x\\cot x\\,dx=-\\csc x+C$$\n$$\\int \\tan x\\,dx=\\ln|\\sec x|+C,\\quad \\int \\cot x\\,dx=\\ln|\\sin x|+C,\\quad \\int \\sinh x\\,dx=\\cosh x+C,\\quad \\int \\cosh x\\,dx=\\sinh x+C"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "4.2 含 $ax+b$",
   "id": "ch19-s7"
  },
  {
   "t": "tex",
   "tex": "\\int (ax+b)^n dx=\\frac{(ax+b)^{n+1}}{a(n+1)}+C\\ (n\\neq-1),\\qquad \\int (ax+b)^{-1}dx=\\frac1a\\ln|ax+b|+C$$\n$$\\int \\frac{dx}{x(ax+b)}=\\frac1b\\ln\\left|\\frac{x}{ax+b}\\right|+C,\\qquad \\int \\frac{dx}{(ax+b)^2}=-\\frac{1}{a(ax+b)}+C$$\n$$\\int x(ax+b)^n dx=\\frac{(ax+b)^{n+1}}{a^2}\\left[\\frac{ax+b}{n+2}-\\frac{b}{n+1}\\right]+C\\ (n\\neq-1,-2)"
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "使用提示：幂法则先化指数",
   "html": "幂法则 $\\displaystyle\\int x^n dx=\\frac{x^{n+1}}{n+1}+C$ 的前提是 $n\\ne-1$。遇到 $\\sqrt x$、$\\dfrac1{x^3}$ 先写成 $x^{1/2}$、$x^{-3}$ 再套。含 $ax+b$ 的积分先换元 $u=ax+b$，则 $dx=\\dfrac{du}a$。"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "4.3 含 $a^2+x^2$ 识别特征：分母是\"平方和\"",
   "id": "ch19-s8"
  },
  {
   "t": "tex",
   "tex": "\\int \\frac{dx}{a^2+x^2}=\\frac1a\\tan^{-1}\\frac{x}{a}+C,\\qquad \\int \\frac{dx}{(a^2+x^2)^2}=\\frac{x}{2a^2(a^2+x^2)}+\\frac{1}{2a^3}\\tan^{-1}\\frac{x}{a}+C$$\n$$\\int \\frac{dx}{\\sqrt{a^2+x^2}}=\\sinh^{-1}\\frac{x}{a}+C=\\ln\\left(x+\\sqrt{a^2+x^2}\\right)+C$$\n$$\\int \\sqrt{a^2+x^2}\\,dx=\\frac{x}{2}\\sqrt{a^2+x^2}+\\frac{a^2}{2}\\ln\\left(x+\\sqrt{a^2+x^2}\\right)+C$$\n$$\\int x^2\\sqrt{a^2+x^2}\\,dx=\\frac{x}{8}(a^2+2x^2)\\sqrt{a^2+x^2}-\\frac{a^4}{8}\\ln\\left(x+\\sqrt{a^2+x^2}\\right)+C$$\n$$\\int \\frac{\\sqrt{a^2+x^2}}{x}dx=\\sqrt{a^2+x^2}-a\\ln\\left|\\frac{a+\\sqrt{a^2+x^2}}{x}\\right|+C,\\qquad \\int \\frac{\\sqrt{a^2+x^2}}{x^2}dx=-\\frac{\\sqrt{a^2+x^2}}{x}+\\ln\\left|x+\\sqrt{a^2+x^2}\\right|+C$$\n$$\\int \\frac{dx}{x\\sqrt{a^2+x^2}}=-\\frac1a\\ln\\left|\\frac{a+\\sqrt{a^2+x^2}}{x}\\right|+C,\\qquad \\int \\frac{dx}{x^2\\sqrt{a^2+x^2}}=-\\frac{\\sqrt{a^2+x^2}}{a^2x}+C,\\qquad \\int \\frac{dx}{x^2(a^2+x^2)}=-\\frac{1}{a^2x}-\\frac{1}{a^3}\\tan^{-1}\\frac{x}{a}+C"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "4.4 含 $a^2-x^2$ 识别特征：分母是\"平方差\"、$a^2$ 在前",
   "id": "ch19-s9"
  },
  {
   "t": "tex",
   "tex": "\\int \\frac{dx}{\\sqrt{a^2-x^2}}=\\sin^{-1}\\frac{x}{a}+C,\\qquad \\int \\frac{dx}{a^2-x^2}=\\frac{1}{2a}\\ln\\left|\\frac{a+x}{a-x}\\right|+C\\ (|x|&lt;a)$$\n$$\\int \\sqrt{a^2-x^2}\\,dx=\\frac{x}{2}\\sqrt{a^2-x^2}+\\frac{a^2}{2}\\sin^{-1}\\frac{x}{a}+C$$\n$$\\int x^2\\sqrt{a^2-x^2}\\,dx=\\frac{a^4}{8}\\sin^{-1}\\frac{x}{a}-\\frac{x}{8}\\sqrt{a^2-x^2}\\left(a^2-2x^2\\right)+C$$\n$$\\int \\frac{\\sqrt{a^2-x^2}}{x}dx=\\sqrt{a^2-x^2}-a\\ln\\left|\\frac{a+\\sqrt{a^2-x^2}}{x}\\right|+C,\\qquad \\int \\frac{\\sqrt{a^2-x^2}}{x^2}dx=-\\frac{\\sqrt{a^2-x^2}}{x}-\\sin^{-1}\\frac{x}{a}+C$$\n$$\\int \\frac{dx}{x\\sqrt{a^2-x^2}}=-\\frac1a\\ln\\left|\\frac{a+\\sqrt{a^2-x^2}}{x}\\right|+C,\\qquad \\int \\frac{dx}{x^2\\sqrt{a^2-x^2}}=-\\frac{\\sqrt{a^2-x^2}}{a^2x}+C$$\n$$\\int x\\sqrt{a^2-x^2}\\,dx=-\\frac13\\left(a^2-x^2\\right)^{3/2}+C,\\qquad \\int \\frac{x^2dx}{\\sqrt{a^2-x^2}}=\\frac{a^2}{2}\\sin^{-1}\\frac{x}{a}-\\frac{x}{2}\\sqrt{a^2-x^2}+C"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "4.5 含 $x^2-a^2$ 识别特征：$x^2$ 在前，需 $|x|&gt;a$",
   "id": "ch19-s10"
  },
  {
   "t": "tex",
   "tex": "\\int \\frac{dx}{\\sqrt{x^2-a^2}}=\\ln\\left|x+\\sqrt{x^2-a^2}\\right|+C,\\qquad \\int \\frac{dx}{x^2-a^2}=\\frac{1}{2a}\\ln\\left|\\frac{x-a}{x+a}\\right|+C$$\n$$\\int \\sqrt{x^2-a^2}\\,dx=\\frac{x}{2}\\sqrt{x^2-a^2}-\\frac{a^2}{2}\\ln\\left|x+\\sqrt{x^2-a^2}\\right|+C$$\n$$\\int x^2\\sqrt{x^2-a^2}\\,dx=\\frac{x}{8}\\left(2x^2-a^2\\right)\\sqrt{x^2-a^2}-\\frac{a^4}{8}\\ln\\left|x+\\sqrt{x^2-a^2}\\right|+C$$\n$$\\int \\frac{\\sqrt{x^2-a^2}}{x}dx=\\sqrt{x^2-a^2}-a\\sec^{-1}\\left|\\frac{x}{a}\\right|+C,\\qquad \\int \\frac{\\sqrt{x^2-a^2}}{x^2}dx=-\\frac{\\sqrt{x^2-a^2}}{x}+\\ln\\left|x+\\sqrt{x^2-a^2}\\right|+C$$\n$$\\int \\frac{dx}{x\\sqrt{x^2-a^2}}=\\frac1a\\sec^{-1}\\left|\\frac{x}{a}\\right|+C,\\qquad \\int \\frac{dx}{x^2\\sqrt{x^2-a^2}}=\\frac{\\sqrt{x^2-a^2}}{a^2x}+C$$\n$$\\int \\frac{dx}{x^2(x^2-a^2)}=\\frac{1}{a^2x}+\\frac{1}{2a^3}\\ln\\left|\\frac{x-a}{x+a}\\right|+C"
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "使用提示：三种平方形式怎么认",
   "html": "$a^2+x^2$（平方和）→ 结果里有 $\\tan^{-1}$；$a^2-x^2$（$a^2$ 在前）→ 结果里有 $\\sin^{-1}$ 或 $\\ln$；$x^2-a^2$（$x^2$ 在前）→ 结果里有 $\\ln$，且要求 $|x|\\gt a$。公式里的 $a$ 在分母外，$\\dfrac1a$ 这个因子别丢。"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "4.6 含 $\\sqrt{2ax-x^2}$ 识别特征：配方成 $a^2-(x-a)^2$",
   "id": "ch19-s11"
  },
  {
   "t": "tex",
   "tex": "\\int \\frac{dx}{\\sqrt{2ax-x^2}}=\\sin^{-1}\\left(\\frac{x-a}{a}\\right)+C,\\qquad \\int \\sqrt{2ax-x^2}\\,dx=\\frac{x-a}{2}\\sqrt{2ax-x^2}+\\frac{a^2}{2}\\sin^{-1}\\left(\\frac{x-a}{a}\\right)+C$$\n$$\\int \\frac{\\sqrt{2ax-x^2}}{x}dx=\\sqrt{2ax-x^2}+a\\sin^{-1}\\left(\\frac{x-a}{a}\\right)+C,\\qquad \\int \\frac{\\sqrt{2ax-x^2}}{x^2}dx=-\\frac{\\sqrt{2ax-x^2}}{x}-\\sin^{-1}\\left(\\frac{x-a}{a}\\right)+C$$\n$$\\int x\\sqrt{2ax-x^2}\\,dx=\\frac{(x+a)(2x-3a)}{6}\\sqrt{2ax-x^2}+\\frac{a^3}{2}\\sin^{-1}\\left(\\frac{x-a}{a}\\right)+C$$\n$$\\int \\frac{x\\,dx}{\\sqrt{2ax-x^2}}=a\\sin^{-1}\\left(\\frac{x-a}{a}\\right)-\\sqrt{2ax-x^2}+C,\\qquad \\int \\frac{dx}{x\\sqrt{2ax-x^2}}=-\\frac1a\\ln\\left|\\frac{a+\\sqrt{2ax-x^2}}{x}\\right|+C$$\n$$\\int \\sqrt{\\frac{2a-x}{x}}\\,dx=\\sqrt{2ax-x^2}+a\\sin^{-1}\\left(\\frac{x-a}{a}\\right)+C,\\qquad \\int \\sqrt{\\frac{x}{2a-x}}\\,dx=-\\sqrt{2ax-x^2}+a\\sin^{-1}\\left(\\frac{x-a}{a}\\right)+C"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "4.7 三角幂与三角乘积",
   "id": "ch19-s12"
  },
  {
   "t": "tex",
   "tex": "\\int \\sin ax\\,dx=-\\frac1a\\cos ax+C,\\qquad \\int \\cos ax\\,dx=\\frac1a\\sin ax+C,\\qquad \\int \\sec ax\\,dx=\\frac1a\\ln|\\sec ax+\\tan ax|+C$$\n$$\\int \\sin^2ax\\,dx=\\frac{x}{2}-\\frac{\\sin2ax}{4a}+C,\\qquad \\int \\cos^2ax\\,dx=\\frac{x}{2}+\\frac{\\sin2ax}{4a}+C,\\qquad \\int \\tan ax\\,dx=\\frac1a\\ln|\\sec ax|+C$$\n$$\\int \\sin^n ax\\,dx=-\\frac{\\sin^{n-1}ax\\cos ax}{na}+\\frac{n-1}{n}\\int \\sin^{n-2}ax\\,dx\\qquad(n\\neq0)$$\n$$\\int \\cos^n ax\\,dx=\\frac{\\cos^{n-1}ax\\sin ax}{na}+\\frac{n-1}{n}\\int \\cos^{n-2}ax\\,dx\\qquad(n\\neq0)$$\n$$\\int \\tan^2ax\\,dx=\\frac1a\\tan ax-x+C,\\qquad \\int \\tan^nax\\,dx=\\frac{\\tan^{n-1}ax}{a(n-1)}-\\int \\tan^{n-2}ax\\,dx\\ (n\\neq1)$$\n$$\\int \\sec^nax\\,dx=\\frac{\\sec^{n-2}ax\\tan ax}{a(n-1)}+\\frac{n-2}{n-1}\\int \\sec^{n-2}ax\\,dx\\ (n\\neq1)$$\n$$\\int \\sec^nax\\tan ax\\,dx=\\frac{\\sec^nax}{na}+C\\ (n\\neq0),\\qquad \\int \\csc^nax\\cot ax\\,dx=-\\frac{\\csc^nax}{na}+C\\ (n\\neq0)$$\n$$\\int \\sin ax\\cos bx\\,dx=-\\frac{\\cos(a+b)x}{2(a+b)}-\\frac{\\cos(a-b)x}{2(a-b)}+C\\ (a^2\\neq b^2)$$\n$$\\int \\sin ax\\sin bx\\,dx=\\frac{\\sin(a-b)x}{2(a-b)}-\\frac{\\sin(a+b)x}{2(a+b)}+C,\\qquad \\int \\cos ax\\cos bx\\,dx=\\frac{\\sin(a-b)x}{2(a-b)}+\\frac{\\sin(a+b)x}{2(a+b)}+C$$\n$$\\int \\sin ax\\cos ax\\,dx=-\\frac{\\cos2ax}{4a}+C,\\qquad \\int \\sin^nax\\cos ax\\,dx=\\frac{\\sin^{n+1}ax}{(n+1)a}+C\\ (n\\neq-1)$$\n$$\\int \\frac{dx}{b+c\\sin ax}=\\frac{2}{\\sqrt{b^2-c^2}}\\tan^{-1}\\frac{b\\tan\\frac{ax}{2}+c}{\\sqrt{b^2-c^2}}+C\\ (b^2&gt;c^2)"
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "使用提示：配方与三角幂",
   "html": "含 $\\sqrt{2ax-x^2}$ 先配方成 $a^2-(x-a)^2$，再用平方差那组公式。三角幂 $\\sin^mx\\cos^nx$：只要 $m$ 或 $n$ 有一个是奇数，就拆一个出来凑 $du$；都是偶数则用降幂。$\\tan^n,\\sec^n$ 用递推公式，每用一次把 $n$ 降 2，直到变成能直接积的 $\\tan x$ 或 $\\sec x$。"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "4.8 反三角形式",
   "id": "ch19-s13"
  },
  {
   "t": "tex",
   "tex": "\\int \\sin^{-1}ax\\,dx=x\\sin^{-1}ax+\\frac{\\sqrt{1-a^2x^2}}{a}+C,\\qquad \\int \\cos^{-1}ax\\,dx=x\\cos^{-1}ax-\\frac{\\sqrt{1-a^2x^2}}{a}+C$$\n$$\\int \\tan^{-1}ax\\,dx=x\\tan^{-1}ax-\\frac{1}{2a}\\ln\\left(1+a^2x^2\\right)+C$$\n$$\\int x^n\\sin^{-1}ax\\,dx=\\frac{x^{n+1}}{n+1}\\sin^{-1}ax-\\frac{a}{n+1}\\int\\frac{x^{n+1}dx}{\\sqrt{1-a^2x^2}}\\ (n\\neq-1)"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "4.9 指数与对数形式",
   "id": "ch19-s14"
  },
  {
   "t": "tex",
   "tex": "\\int e^{ax}dx=\\frac1a e^{ax}+C,\\quad \\int b^{ax}dx=\\frac{b^{ax}}{a\\ln b}+C\\ (b&gt;0,b\\neq1),\\quad \\int xe^{ax}dx=\\frac{e^{ax}}{a^2}(ax-1)+C$$\n$$\\int e^{ax}\\sin bx\\,dx=\\frac{e^{ax}}{a^2+b^2}\\left(a\\sin bx-b\\cos bx\\right)+C,\\qquad \\int e^{ax}\\cos bx\\,dx=\\frac{e^{ax}}{a^2+b^2}\\left(a\\cos bx+b\\sin bx\\right)+C$$\n$$\\int \\ln ax\\,dx=x\\ln ax-x+C,\\qquad \\int x^n\\ln ax\\,dx=\\frac{x^{n+1}}{n+1}\\ln ax-\\frac{x^{n+1}}{(n+1)^2}+C\\ (n\\neq-1)$$\n$$\\int x^n(\\ln ax)^m dx=\\frac{x^{n+1}(\\ln ax)^m}{n+1}-\\frac{m}{n+1}\\int x^n(\\ln ax)^{m-1}dx\\ (n\\neq-1)$$\n$$\\int \\frac{(\\ln ax)^m}{x}dx=\\frac{(\\ln ax)^{m+1}}{m+1}+C\\ (m\\neq-1),\\qquad \\int \\frac{dx}{x\\ln ax}=\\ln|\\ln ax|+C"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "4.10 双曲形式与定积分",
   "id": "ch19-s15"
  },
  {
   "t": "tex",
   "tex": "\\int \\tanh ax\\,dx=\\frac1a\\ln(\\cosh ax)+C,\\quad \\int \\coth ax\\,dx=\\frac1a\\ln|\\sinh ax|+C,\\quad \\int \\operatorname{sech}^2ax\\,dx=\\frac1a\\tanh ax+C$$\n$$\\int \\operatorname{sech}ax\\,dx=\\frac1a\\sin^{-1}(\\tanh ax)+C=\\frac{2}{a}\\tan^{-1}e^{ax}+C,\\qquad \\int \\operatorname{csch}ax\\,dx=\\frac1a\\ln\\left|\\tanh\\frac{ax}{2}\\right|+C$$\n$$\\int \\sinh^2ax\\,dx=\\frac{\\sinh2ax}{4a}-\\frac{x}{2}+C,\\qquad \\int \\cosh^2ax\\,dx=\\frac{\\sinh2ax}{4a}+\\frac{x}{2}+C$$\n$$\\int_0^\\infty x^{n-1}e^{-x}dx=\\Gamma(n)=(n-1)!\\ (n&gt;0),\\qquad \\int_0^\\infty e^{-ax^2}dx=\\frac12\\sqrt{\\frac{\\pi}{a}}\\ (a&gt;0)$$\n$$\\int_0^{\\pi/2}\\sin^nx\\,dx=\\int_0^{\\pi/2}\\cos^nx\\,dx=\\begin{cases}\\dfrac{n-1}{n}\\cdot\\dfrac{n-3}{n-2}\\cdots\\dfrac{1}{2}\\cdot\\dfrac{\\pi}{2},&amp; n\\ \\text{为偶}\\\\[2mm]\\dfrac{n-1}{n}\\cdot\\dfrac{n-3}{n-2}\\cdots\\dfrac{2}{3},&amp; n\\ \\text{为奇}\\ (&gt;1)\\end{cases}"
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "使用提示：分部与特殊定积分",
   "html": "$\\displaystyle\\int e^{ax}\\sin bx\\,dx$ 要分部两次，再把原积分移项「解出来」；$\\displaystyle\\int\\ln x\\,dx$、$\\displaystyle\\int x^n\\ln x\\,dx$ 把 $\\ln x$ 当作 $u$ 分部。$\\displaystyle\\int_0^\\infty x^{n-1}e^{-x}dx=(n-1)!$ 是 $\\Gamma$ 函数；$\\displaystyle\\int_0^{\\pi/2}\\sin^nx\\,dx$ 的偶/奇公式（Wallis）在算三角幂定积分时很好用。"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "常用积分技巧的\"模式 → 手法\"表",
   "id": "ch19-s16"
  },
  {
   "t": "p",
   "html": "<b>导读</b>：拿到一个积分，先在这张表里找最像的形状，再决定手法。它比背公式更有用——因为题目多半是「换元 + 查表」的组合，认形状比记公式重要。"
  },
  {
   "t": "table",
   "head": [
    "被积函数模式",
    "手法",
    "关键动作 / 例子"
   ],
   "rows": [
    [
     "复合函数 × 内层导数",
     "<strong>换元</strong> $u=g(x)$",
     "$\\int f(g)g'\\,dx=\\int f(u)du$；$\\int\\frac{2x}{1+x^2}dx=\\ln(1+x^2)+C$"
    ],
    [
     "含 $\\sqrt{a^2-x^2}$",
     "三角代换 $x=a\\sin\\theta$",
     "$dx=a\\cos\\theta\\,d\\theta$，$\\sqrt{a^2-x^2}=a\\cos\\theta$"
    ],
    [
     "含 $\\sqrt{a^2+x^2}$",
     "三角代换 $x=a\\tan\\theta$",
     "$\\sqrt{a^2+x^2}=a\\sec\\theta$"
    ],
    [
     "含 $\\sqrt{x^2-a^2}$",
     "三角代换 $x=a\\sec\\theta$",
     "$\\sqrt{x^2-a^2}=a|\\tan\\theta|$"
    ],
    [
     "含 $\\sqrt{2ax-x^2}$",
     "先配方，再 $x-a=a\\sin\\theta$",
     "$2ax-x^2=a^2-(x-a)^2$"
    ],
    [
     "含 $\\sqrt{a^2\\pm x^2}$ 但只一次",
     "双曲代换 / 直接查表",
     "$x=a\\sinh t$ 免去回代三角"
    ],
    [
     "有理函数 $P/Q$",
     "<strong>部分分式</strong>",
     "先做除法 $\\deg P\\ge\\deg Q$；分母因式分解后拆项"
    ],
    [
     "分母为不可约二次式",
     "配方 + $\\arctan$ / $\\ln$",
     "$x^2+4x+13=(x+2)^2+9\\Rightarrow\\int\\frac{dx}{x^2+4x+13}=\\frac13\\tan^{-1}\\frac{x+2}{3}+C$"
    ],
    [
     "$x^n e^{ax}$、$x^n\\sin ax$、$x^n\\ln x$",
     "<strong>分部积分</strong>（把 $x^n$ 降次）",
     "$\\int u\\,dv=uv-\\int v\\,du$，$u$ 取对数/反三角/多项式"
    ],
    [
     "$\\int e^{ax}\\sin bx\\,dx$",
     "分部两次 → <strong>解方程</strong>",
     "移项得 $\\frac{e^{ax}(a\\sin bx-b\\cos bx)}{a^2+b^2}+C$"
    ],
    [
     "$\\sin^m x\\cos^n x$",
     "$m$ 或 $n$ 为奇数 → 拆一个凑 $du$；均为偶数 → <strong>降幂</strong>",
     "$\\int\\sin^3x\\,dx=\\int(1-\\cos^2x)\\sin x\\,dx$"
    ],
    [
     "$\\tan^n x$、$\\sec^n x$",
     "<strong>递推公式</strong>",
     "见 §4.7；$\\int\\sec^3x\\,dx=\\frac12\\sec x\\tan x+\\frac12\\ln|\\sec x+\\tan x|+C$"
    ],
    [
     "$\\sqrt{x^2\\pm a^2}$ 与 $x$ 的混合分式",
     "$x=a\\sec\\theta$ / $x=a\\sinh t$，或查 §4.3–4.5",
     "结果里的 $\\ln\\left|x+\\sqrt{x^2\\pm a^2}\\right|$ 就是反双曲函数"
    ],
    [
     "对称区间上的奇/偶函数",
     "<strong>对称性</strong>",
     "奇 $\\Rightarrow0$；偶 $\\Rightarrow2\\int_0^a$"
    ],
    [
     "$\\int_0^\\infty x^ne^{-x}dx$ 型",
     "分部 $n$ 次 → $\\Gamma$ 函数",
     "$=n!$"
    ],
    [
     "带绝对值的被积函数",
     "<strong>拆分区间</strong>",
     "在零点处断开，逐段去绝对值"
    ],
    [
     "反常积分先判敛散",
     "<strong>比较判别 / $p$ 判别</strong>",
     "$\\int_1^\\infty\\frac{dx}{x^p}$ 收敛 $\\iff p&gt;1$；$\\int_0^1\\frac{dx}{x^p}$ 收敛 $\\iff p&lt;1$"
    ]
   ]
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "使用提示：按这个顺序试",
   "html": "先看能不能换元凑 $du$；再看根号决定三角代换；有理函数用部分分式；剩下 $x^ne^{ax}$、$x^n\\sin ax$、$x^n\\ln x$ 一律分部。定积分先看区间是否对称：奇函数积 $0$，偶函数翻倍。"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "常用级数展开与求和",
   "id": "ch19-s17"
  },
  {
   "t": "p",
   "html": "<b>导读</b>：级数展开只需要认识三个「源头」：$\\dfrac1{1-x}$、$e^x$、$\\sin x$；其余（$\\cos x$、$\\ln(1+x)$、$\\arctan x$、二项级数）都能由它们变形或逐项积分得到。每个展开都要写清收敛区间，误差估计用拉格朗日余项。"
  },
  {
   "t": "p",
   "html": "<strong>收敛性判别（p.1238）</strong>：$\\sum a_n$ 收敛的必要条件 $a_n\\to0$（<strong>第 $n$ 项判别法</strong>，若 $a_n\\not\\to0$ 则发散）；几何级数 $\\sum ar^n$ 收敛 $\\iff|r|&lt;1$，和为 $\\frac{a}{1-r}$；$p$ 级数 $\\sum 1/n^p$ 收敛 $\\iff p&gt;1$；非负项级数用<strong>积分判别、比值判别、根值判别、比较/极限比较</strong>；有负项时先查 $\\sum|a_n|$（<strong>绝对收敛 $\\Rightarrow$ 收敛</strong>）；交错级数用<strong>交错级数判别法</strong>。"
  },
  {
   "t": "p",
   "html": "<strong>误差估计</strong>：若 $|f^{(n+1)}(x)|\\le M$ 在 $|x-a|\\le d$ 上成立，则\n$$\\bigl|R_n(x)\\bigr|=\\left|f(x)-P_n(x)\\right|\\le\\frac{M}{(n+1)!}|x-a|^{n+1}\\quad(|x-a|\\le d)$$"
  },
  {
   "t": "p",
   "html": "<b>三个最常用的展开</b>：$\\dfrac1{1-x}$、$e^x$、$\\sin x$。先看这三个，其余都能由它们推出来。"
  },
  {
   "t": "tex",
   "tex": "\\frac{1}{1-x}=\\sum_{n=0}^{\\infty}x^n=1+x+x^2+\\cdots\\quad(|x|&lt;1),\\qquad \\frac{1}{1+x}=\\sum_{n=0}^{\\infty}(-1)^nx^n\\quad(|x|&lt;1)$$\n$$e^x=\\sum_{n=0}^{\\infty}\\frac{x^n}{n!}=1+x+\\frac{x^2}{2!}+\\cdots\\quad(|x|&lt;\\infty)$$\n$$\\sin x=\\sum_{n=0}^{\\infty}\\frac{(-1)^nx^{2n+1}}{(2n+1)!}=x-\\frac{x^3}{3!}+\\frac{x^5}{5!}-\\cdots\\quad(|x|&lt;\\infty)$$\n$$\\cos x=\\sum_{n=0}^{\\infty}\\frac{(-1)^nx^{2n}}{(2n)!}=1-\\frac{x^2}{2!}+\\frac{x^4}{4!}-\\cdots\\quad(|x|&lt;\\infty)$$\n$$\\ln(1+x)=\\sum_{n=1}^{\\infty}\\frac{(-1)^{n-1}x^n}{n}=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\cdots\\quad(-1&lt;x\\le1)$$\n$$\\ln\\frac{1+x}{1-x}=2\\tanh^{-1}x=2\\sum_{n=0}^{\\infty}\\frac{x^{2n+1}}{2n+1}=2\\left(x+\\frac{x^3}{3}+\\frac{x^5}{5}+\\cdots\\right)\\quad(|x|&lt;1)$$\n$$\\tan^{-1}x=\\sum_{n=0}^{\\infty}\\frac{(-1)^nx^{2n+1}}{2n+1}=x-\\frac{x^3}{3}+\\frac{x^5}{5}-\\cdots\\quad(|x|\\le1)"
  },
  {
   "t": "p",
   "html": "<strong>二项级数</strong>"
  },
  {
   "t": "tex",
   "tex": "(1+x)^m=1+mx+\\frac{m(m-1)}{2!}x^2+\\cdots+\\binom{m}{k}x^k+\\cdots=1+\\sum_{k=1}^{\\infty}\\binom{m}{k}x^k\\quad(|x|&lt;1)$$\n$$\\binom{m}{1}=m,\\qquad \\binom{m}{2}=\\frac{m(m-1)}{2!},\\qquad \\binom{m}{k}=\\frac{m(m-1)\\cdots(m-k+1)}{k!}\\ (k\\ge3)"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "几何与多元公式（第 6、12、13、14、15 章）",
   "id": "ch19-s18"
  },
  {
   "t": "p",
   "html": "<b>导读</b>：这一组把一元与多元的「几何公式」集中在一起。一元部分（7.1）全是微元求和；多元部分（7.2–7.5）先认向量运算，再认梯度/散度/旋度，最后是三大定理——它们说的其实是同一件事：内部的积分可以化成边界上的积分。"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "7.1 弧长、面积、体积、曲面面积（第 6 章）",
   "id": "ch19-s19"
  },
  {
   "t": "tex",
   "tex": "L=\\int_a^b\\sqrt{1+\\left(\\frac{dy}{dx}\\right)^2}\\,dx=\\int_a^b\\sqrt{\\left(\\frac{dx}{dt}\\right)^2+\\left(\\frac{dy}{dt}\\right)^2}\\,dt=\\int_\\alpha^\\beta\\sqrt{r^2+\\left(\\frac{dr}{d\\theta}\\right)^2}\\,d\\theta$$\n$$A=\\int_a^b\\bigl(f(x)-g(x)\\bigr)dx,\\qquad A=\\int_\\alpha^\\beta\\frac12 r^2\\,d\\theta,\\qquad V=\\int_a^b A(x)\\,dx$$\n$$\\text{垫片法：}V=\\int_a^b\\pi\\bigl(R^2-r^2\\bigr)dx;\\qquad \\text{柱壳法：}V=\\int_a^b2\\pi\\,(\\text{壳半径})(\\text{壳高})\\,dx$$\n$$S=\\int_a^b2\\pi y\\sqrt{1+\\left(\\frac{dy}{dx}\\right)^2}\\,dx\\ (\\text{绕 }x\\text{ 轴}),\\qquad S=\\int_a^b2\\pi x\\sqrt{1+\\left(\\frac{dx}{dy}\\right)^2}\\,dy\\ (\\text{绕 }y\\text{ 轴})$$\n$$\\text{质心：}\\bar{x}=\\frac1M\\int x\\,dm,\\qquad M=\\int\\delta\\,dA;\\qquad \\text{Pappus：}V=2\\pi\\bar{r}A,\\quad S=2\\pi\\bar{r}L\\ (\\bar{r}=\\text{形心到轴距离})"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "7.2 向量、直线、平面（第 12 章）",
   "id": "ch19-s20"
  },
  {
   "t": "tex",
   "tex": "\\mathbf{u}\\cdot\\mathbf{v}=|\\mathbf{u}||\\mathbf{v}|\\cos\\theta,\\qquad |\\mathbf{u}\\times\\mathbf{v}|=|\\mathbf{u}||\\mathbf{v}|\\sin\\theta,\\qquad \\mathbf{u}\\cdot(\\mathbf{v}\\times\\mathbf{w})=\\begin{vmatrix}u_1&amp;u_2&amp;u_3\\\\v_1&amp;v_2&amp;v_3\\\\w_1&amp;w_2&amp;w_3\\end{vmatrix}$$\n$$\\mathbf{u}\\times\\mathbf{v}=\\begin{vmatrix}\\mathbf{i}&amp;\\mathbf{j}&amp;\\mathbf{k}\\\\u_1&amp;u_2&amp;u_3\\\\v_1&amp;v_2&amp;v_3\\end{vmatrix},\\qquad \\mathbf{u}\\cdot(\\mathbf{v}\\times\\mathbf{w})=(\\mathbf{u}\\times\\mathbf{v})\\cdot\\mathbf{w},\\qquad \\mathbf{u}\\times(\\mathbf{v}\\times\\mathbf{w})=(\\mathbf{u}\\cdot\\mathbf{w})\\mathbf{v}-(\\mathbf{u}\\cdot\\mathbf{v})\\mathbf{w}$$\n$$|\\mathbf{u}\\times\\mathbf{v}|=\\text{平行四边形面积};\\qquad \\text{点到平面 }Ax+By+Cz=D\\text{ 的距离}=\\frac{|Ax_0+By_0+Cz_0-D|}{\\sqrt{A^2+B^2+C^2}}"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "7.3 空间曲线：弧长、$TNB$ 与曲率（第 13 章）",
   "id": "ch19-s21"
  },
  {
   "t": "tex",
   "tex": "s(t)=\\int_{t_0}^{t}|\\mathbf{v}(\\tau)|\\,d\\tau,\\qquad \\mathbf{T}=\\frac{\\mathbf{v}}{|\\mathbf{v}|},\\qquad \\mathbf{N}=\\frac{d\\mathbf{T}/dt}{|d\\mathbf{T}/dt|},\\qquad \\mathbf{B}=\\mathbf{T}\\times\\mathbf{N}$$\n$$\\kappa=\\left|\\frac{d\\mathbf{T}}{ds}\\right|=\\frac{|\\mathbf{T}'(t)|}{|\\mathbf{v}(t)|}=\\frac{|\\mathbf{v}\\times\\mathbf{a}|}{|\\mathbf{v}|^3},\\qquad \\kappa(x)=\\frac{|y''|}{\\left[1+(y')^2\\right]^{3/2}},\\qquad \\rho=\\frac1\\kappa$$\n$$\\mathbf{a}=a_T\\mathbf{T}+a_N\\mathbf{N},\\qquad a_T=\\frac{d}{dt}|\\mathbf{v}|=\\frac{\\mathbf{v}\\cdot\\mathbf{a}}{|\\mathbf{v}|},\\qquad a_N=\\kappa|\\mathbf{v}|^2=\\sqrt{|\\mathbf{a}|^2-a_T^2}$$\n$$\\text{挠率：}\\tau=-\\frac{d\\mathbf{B}}{ds}\\cdot\\mathbf{N};\\qquad \\text{主法向分量方向总指向凹侧}"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "7.4 多元微分（第 14 章）",
   "id": "ch19-s22"
  },
  {
   "t": "tex",
   "tex": "\\nabla f=\\frac{\\partial f}{\\partial x}\\mathbf{i}+\\frac{\\partial f}{\\partial y}\\mathbf{j}+\\frac{\\partial f}{\\partial z}\\mathbf{k},\\qquad D_{\\mathbf{u}}f=\\nabla f\\cdot\\mathbf{u}=|\\nabla f|\\cos\\theta$$\n$$\\text{切平面：}f_x(a,b)(x-a)+f_y(a,b)(y-b)-(z-f(a,b))=0;\\qquad \\text{全微分：}df=f_x\\,dx+f_y\\,dy$$\n$$dz=\\frac{\\partial z}{\\partial u}du+\\frac{\\partial z}{\\partial v}dv,\\qquad \\frac{dw}{dt}=\\frac{\\partial w}{\\partial x}\\frac{dx}{dt}+\\frac{\\partial w}{\\partial y}\\frac{dy}{dt}+\\frac{\\partial w}{\\partial z}\\frac{dz}{dt}\\quad(\\text{链式法则})$$\n$$\\text{拉格朗日乘子：}\\nabla f=\\lambda\\nabla g,\\qquad \\text{二元判别：}f_{xx}f_{yy}-f_{xy}^2&gt;0\\ \\text{且}\\ f_{xx}&lt;0\\Rightarrow\\text{极大};\\ f_{xx}&gt;0\\Rightarrow\\text{极小};\\ &lt;0\\Rightarrow\\text{鞍点}"
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "7.5 重积分与三大定理（第 15 章 / p.1239–p.1240）",
   "id": "ch19-s23"
  },
  {
   "t": "tex",
   "tex": "\\iint_R f\\,dA=\\int_\\alpha^\\beta\\int_{r_1(\\theta)}^{r_2(\\theta)}f(r\\cos\\theta,r\\sin\\theta)\\,r\\,dr\\,d\\theta$$\n$$\\iiint_D f\\,dV=\\iiint_{\\text{cyl}}f\\,r\\,dz\\,dr\\,d\\theta=\\iiint_{\\text{sph}}f\\,\\rho^2\\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta$$\n$$\\text{曲面面积：}S=\\iint_R\\sqrt{f_x^2+f_y^2+1}\\,dA;\\qquad \\mathbf{r}(u,v):\\ S=\\iint_D\\left|\\mathbf{r}_u\\times\\mathbf{r}_v\\right|du\\,dv"
  },
  {
   "t": "p",
   "html": "<strong>梯度 / 散度 / 旋度 / 拉普拉斯（$\\mathbf{F}=M\\mathbf{i}+N\\mathbf{j}+P\\mathbf{k}$，$\\nabla f$ 见 §7.4）</strong>"
  },
  {
   "t": "tex",
   "tex": "\\nabla\\cdot\\mathbf{F}=\\frac{\\partial M}{\\partial x}+\\frac{\\partial N}{\\partial y}+\\frac{\\partial P}{\\partial z}$$\n$$\\nabla\\times\\mathbf{F}=\\begin{vmatrix}\\mathbf{i}&amp;\\mathbf{j}&amp;\\mathbf{k}\\\\[1mm]\\dfrac{\\partial}{\\partial x}&amp;\\dfrac{\\partial}{\\partial y}&amp;\\dfrac{\\partial}{\\partial z}\\\\[2mm]M&amp;N&amp;P\\end{vmatrix}=\\left(\\frac{\\partial P}{\\partial y}-\\frac{\\partial N}{\\partial z}\\right)\\mathbf{i}+\\left(\\frac{\\partial M}{\\partial z}-\\frac{\\partial P}{\\partial x}\\right)\\mathbf{j}+\\left(\\frac{\\partial N}{\\partial x}-\\frac{\\partial M}{\\partial y}\\right)\\mathbf{k}$$\n$$\\nabla^2f=\\frac{\\partial^2f}{\\partial x^2}+\\frac{\\partial^2f}{\\partial y^2}+\\frac{\\partial^2f}{\\partial z^2}"
  },
  {
   "t": "p",
   "html": "<strong>三大定理</strong>"
  },
  {
   "t": "tex",
   "tex": "\\text{Green（切向）：}\\oint_C\\mathbf{F}\\cdot\\mathbf{T}\\,ds=\\iint_R(\\nabla\\times\\mathbf{F})\\cdot\\mathbf{k}\\,dA=\\iint_R\\left(\\frac{\\partial N}{\\partial x}-\\frac{\\partial M}{\\partial y}\\right)dA$$\n$$\\text{Green（法向）：}\\oint_C\\mathbf{F}\\cdot\\mathbf{n}\\,ds=\\iint_R\\nabla\\cdot\\mathbf{F}\\,dA$$\n$$\\text{Stokes：}\\oint_C\\mathbf{F}\\cdot\\mathbf{T}\\,ds=\\iint_S(\\nabla\\times\\mathbf{F})\\cdot\\mathbf{n}\\,d\\sigma,\\qquad \\text{散度定理：}\\oiint_S\\mathbf{F}\\cdot\\mathbf{n}\\,d\\sigma=\\iiint_D\\nabla\\cdot\\mathbf{F}\\,dV$$\n$$\\text{线积分基本定理：}\\int_A^B\\mathbf{F}\\cdot d\\mathbf{r}=f(B)-f(A)\\iff \\mathbf{F}=\\nabla f\\iff \\oint\\mathbf{F}\\cdot d\\mathbf{r}=0\\ (\\text{单连通域上})$$\n$$\\text{通量：}\\iint_S\\mathbf{F}\\cdot\\mathbf{n}\\,d\\sigma=\\iint_R\\mathbf{F}\\cdot(\\mathbf{r}_u\\times\\mathbf{r}_v)\\,du\\,dv;\\qquad \\text{环量密度}=(\\nabla\\times\\mathbf{F})\\cdot\\mathbf{n}"
  },
  {
   "t": "p",
   "html": "<strong>向量恒等式（p.1240）</strong>"
  },
  {
   "t": "tex",
   "tex": "\\nabla\\times(\\nabla f)=\\mathbf{0},\\qquad \\nabla\\cdot(\\nabla\\times\\mathbf{F})=0,\\qquad \\nabla\\cdot(g\\mathbf{F})=g\\,\\nabla\\cdot\\mathbf{F}+\\nabla g\\cdot\\mathbf{F}$$\n$$\\nabla\\times(g\\mathbf{F})=g\\,\\nabla\\times\\mathbf{F}+\\nabla g\\times\\mathbf{F},\\qquad \\nabla(fg)=f\\nabla g+g\\nabla f,\\qquad \\nabla(\\mathbf{F}_1\\cdot\\mathbf{F}_2)=(\\mathbf{F}_1\\cdot\\nabla)\\mathbf{F}_2+(\\mathbf{F}_2\\cdot\\nabla)\\mathbf{F}_1+\\mathbf{F}_1\\times(\\nabla\\times\\mathbf{F}_2)+\\mathbf{F}_2\\times(\\nabla\\times\\mathbf{F}_1)"
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "使用提示：微元与 Jacobi 因子",
   "html": "这一组的共同点是「微元求和」：弧长 $ds=\\sqrt{1+(y')^2}\\,dx$、旋转体 $dV=2\\pi rh\\,dx$、曲面面积 $dS=2\\pi y\\,ds$。多元部分：梯度指向最陡上升方向，散度是「源」，旋度是「转」；换坐标时别忘乘 Jacobi 因子 $r$（极坐标/柱坐标）或 $\\rho^2\\sin\\phi$（球坐标）。"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "使用提示：什么时候查表，什么时候必须推导",
   "id": "ch19-s24"
  },
  {
   "t": "p",
   "html": "<b>（1）什么时候可以直接查表</b>"
  },
  {
   "t": "list",
   "ordered": true,
   "items": [
    "<b>被积函数「长得像积分表」就查表</b>：见到 $\\dfrac{1}{a^2+x^2}$、$\\sqrt{a^2-x^2}$、$\\dfrac{1}{\\sqrt{x^2-a^2}}$，直接套 4.3–4.5 那几组，比现场代换省事得多。",
    "<b>极限里出现 $\\sin x,\\ \\ln(1+x),\\ e^x-1,\\ 1-\\cos x$，且 $x\\to0$</b>：先写等价无穷小；如果分母是 $x^3$，要保留到三次项，不能只留一项。",
    "<b>求切向/法向加速度、曲率、弧长</b>：直接用公式 $a_T=\\dfrac{\\mathbf v\\cdot\\mathbf a}{|\\mathbf v|}$、$\\kappa=\\dfrac{|\\mathbf v\\times\\mathbf a|}{|\\mathbf v|^3}$，不必从 $d\\mathbf T/ds$ 推。",
    "<b>判别级数</b>：先看通项是否趋于 $0$，再按「几何级数 / $p$ 级数 → 比值、根值 → 比较 → 交错」的顺序试，一步能定就停。",
    "<b>二重、三重积分</b>：被积函数含 $x^2+y^2$，或区域是圆盘、圆环、球，立刻换极坐标、柱坐标或球坐标，记得乘 Jacobi 因子 $r$ 或 $\\rho^2\\sin\\phi$。"
   ]
  },
  {
   "t": "p",
   "html": "<b>（2）什么时候必须自己推，不能套</b>"
  },
  {
   "t": "list",
   "ordered": true,
   "items": [
    "<b>换元后的三角回代</b>（如 $x=a\\sin\\theta$）：必须画直角三角形或用恒等式回代，直接写 $\\theta$ 会漏掉回代这一步。",
    "<b>反常积分的敛散性</b>：必须写极限定义 $\\lim_{b\\to\\infty}\\int_a^b$，不能直接代 $\\infty$；被积函数在区间内部无界时，要在那一点「拆开」分别讨论。",
    "<b>级数收敛性证明</b>：比值、根值判别法失效（极限为 1）时，要改用比较判别或积分判别，并把比较对象写清楚。",
    "<b>隐函数、相关变化率、参数方程的二阶导</b>：必须显式用链式法则；$\\dfrac{d^2y}{dx^2}=\\dfrac{dy'/dt}{dx/dt}$ 里的 $y'$ 要先写成 $t$ 的函数再求导。",
    "<b>Stokes 定理、散度定理的定向</b>：法向与边界切向必须满足右手法则，$C$ 的正向要与 $S$ 的法向配套，这一条必须画图确认，不能凭记忆。"
   ]
  },
  {
   "t": "p",
   "html": "<strong>（3）最容易记错的 10 个公式</strong>"
  },
  {
   "t": "table",
   "head": [
    "#",
    "容易记错的地方",
    "正确形式"
   ],
   "rows": [
    [
     "1",
     "把 $\\int\\frac{dx}{x}$ 写成 $\\ln x$",
     "$\\ln\\left|x\\right|+C$，绝对值不能丢"
    ],
    [
     "2",
     "$\\int\\sec^3x\\,dx$ 只写 $\\frac12\\sec x\\tan x$",
     "还要 $+\\frac12\\ln\\left|\\sec x+\\tan x\\right|+C$"
    ],
    [
     "3",
     "$\\frac{d}{dx}\\sec^{-1}x$ 漏绝对值",
     "$\\dfrac{1}{\\left|x\\right|\\sqrt{x^2-1}}\\ (|x|&gt;1)$"
    ],
    [
     "4",
     "$\\int\\cos^{-1}ax\\,dx$ 的符号",
     "$x\\cos^{-1}ax-\\dfrac{\\sqrt{1-a^2x^2}}{a}+C$（<strong>减</strong>号）"
    ],
    [
     "5",
     "$\\int\\ln x\\,dx$ 漏 $-x$",
     "$x\\ln x-x+C$"
    ],
    [
     "6",
     "$\\int e^{ax}\\cos bx\\,dx$ 系数写成 $a^2-b^2$",
     "分母是 $a^2+b^2$，且分子为 $a\\cos bx+b\\sin bx$"
    ],
    [
     "7",
     "$\\int\\frac{dx}{a^2-x^2}$ 与 $\\int\\frac{dx}{x^2-a^2}$ 混",
     "前者 $\\frac{1}{2a}\\ln\\left|\\frac{a+x}{a-x}\\right|$；后者 $\\frac{1}{2a}\\ln\\left|\\frac{x-a}{x+a}\\right|$（互为相反数）"
    ],
    [
     "8",
     "降幂公式 $\\int\\sin^2ax\\,dx$ 忘 $x$ 项",
     "$\\frac{x}{2}-\\frac{\\sin2ax}{4a}+C$（$\\cos^2$ 中间为 $+$）"
    ],
    [
     "9",
     "记 $\\int\\sec x\\,dx=\\ln\\left|\\sec x\\right|$",
     "$\\ln\\left|\\sec x+\\tan x\\right|+C$；$\\int\\csc x\\,dx=-\\ln\\left|\\csc x+\\cot x\\right|+C$"
    ],
    [
     "10",
     "把 $\\nabla\\times(\\nabla f)=\\mathbf{0}$ 与 $\\nabla\\cdot(\\nabla\\times\\mathbf{F})=0$ 写反",
     "旋度的散度为零、梯度的旋度为零；反向（$\\nabla\\cdot(\\nabla f)=\\nabla^2f$）<strong>不为零</strong>"
    ]
   ]
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "这张表的三种用法",
   "html": "<p>① 平时做作业：按被积函数的形状查积分表；② 复习一章之前：先读该组的导读，知道这组公式在解决什么问题；③ 做题卡住时：看「使用提示」，判断该查表还是该自己推。</p>"
  },
  {
   "t": "checklist",
   "id": "ch19",
   "items": [
    "我能写出三角的和角、二倍角、降幂公式，并说出它们各自什么时候用。",
    "我能默写五个基本导数（$x^n,\\sin x,\\cos x,e^x,\\ln x$）和三个基本积分。",
    "我能根据分母形状（$a^2+x^2$、$a^2-x^2$、$x^2-a^2$）选对积分公式。",
    "我知道等价无穷小只能用在乘除里，不会在加减里乱替换。",
    "我能写出 $e^x$、$\\sin x$、$\\cos x$ 的展开式和收敛区间。",
    "我能说出梯度、散度、旋度分别在描述什么。"
   ]
  }
 ]
});
