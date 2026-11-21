/* =====================================================================
 * data/quiz.js · 题库（选择题，含逐项解析）
 * 来源：旧「托马斯微积分复习网站」270 道选择题，按新站 schema 转换
 * 字段：id / ch / type / difficulty / tags / scope / stem / options[{text,correct}] / explain(HTML)
 * 注入：CSC.registerQuizPack({ items:[…] })
 * 统计：270 题，覆盖 19 章
 * ===================================================================== */
CSC.registerQuizPack((function () {
  var PACK = {
 "items": [
  {
   "id": "ch01-q1",
   "ch": "ch01",
   "type": "mcq",
   "difficulty": 1,
   "kp": "1.1 函数及其图象", "tags": ["concept"],
   "scope": "prereq",
   "stem": "下列方程所表示的曲线中，哪个能使 $y$ 成为 $x$ 的函数？",
   "options": [
    {
     "text": "$x^{2}+y^{2}=1$",
     "correct": false
    },
    {
     "text": "$y=x^{3}$",
     "correct": true
    },
    {
     "text": "$|y|=x$",
     "correct": false
    },
    {
     "text": "$y^{2}=x$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$x^{2}+y^{2}=1$ 是圆，$x=0$ 时 $y=\\pm1$，竖直线与其交于两点。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$y=x^{3}$ 对每个 $x$ 只给出一个值，任一竖直线至多交图象一点。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$|y|=x$ 在 $x=1$ 时 $y=1$ 或 $y=-1$，一对多，不是函数。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$y^{2}=x$ 开口向右，$x=1$ 时 $y=\\pm1$，一个 $x$ 对应两个 $y$。</span></div>"
  },
  {
   "id": "ch01-q2",
   "ch": "ch01",
   "type": "mcq",
   "difficulty": 2,
   "kp": "1.1 自然定义域与值域", "tags": ["concept","trap"],
   "scope": "prereq",
   "stem": "函数 $f(x)=\\sqrt{\\frac{x-2}{x+3}}$ 的自然定义域是？",
   "options": [
    {
     "text": "$[2,\\infty)$",
     "correct": false
    },
    {
     "text": "$(-3,2]$",
     "correct": false
    },
    {
     "text": "$(-\\infty,-3)\\cup[2,\\infty)$",
     "correct": true
    },
    {
     "text": "$(-\\infty,-3]\\cup[2,\\infty)$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。只解 $x-2\\ge0$ 得 $x\\ge2$，漏掉了取负值的另一段 $x<-3$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$(-3,2]$ 是 $\\frac{x-2}{x+3}\\le0$ 的解，符号取反了。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。需 $\\frac{x-2}{x+3}\\ge0$ 且 $x\\neq-3$，解得 $x<-3$ 或 $x\\ge2$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$x=-3$ 使分母为零，必须挖去，不能写成闭端点。</span></div>"
  },
  {
   "id": "ch01-q3",
   "ch": "ch01",
   "type": "mcq",
   "difficulty": 2,
   "kp": "1.1 自然定义域与值域", "tags": ["output"],
   "scope": "prereq",
   "stem": "函数 $y=x^{2}-4x+7$ 在 $x\\in[0,3]$ 上的值域是？",
   "options": [
    {
     "text": "$[3,\\infty)$",
     "correct": false
    },
    {
     "text": "$[4,7]$",
     "correct": false
    },
    {
     "text": "$[3,7]$",
     "correct": true
    },
    {
     "text": "$[3,4]$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$[3,\\infty)$ 是它在 $\\mathbb R$ 上的值域，忽略了 $0\\le x\\le3$ 的限制。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。把端点值 $y(3)=4$ 当成了最小值，顶点处 $y(2)=3$ 更小。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。配方得 $y=(x-2)^{2}+3$，顶点 $y(2)=3$；端点 $y(0)=7$、$y(3)=4$，最大 $7$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。最大值在端点 $y(0)=7$，必须比较顶点与两个端点。</span></div>"
  },
  {
   "id": "ch01-q4",
   "ch": "ch01",
   "type": "mcq",
   "difficulty": 3,
   "kp": "1.1 奇偶性判定", "tags": ["concept","trap"],
   "scope": "prereq",
   "stem": "设 $f$ 是偶函数、$g$ 是奇函数，且都在 $\\mathbb R$ 上有定义，则下列函数一定是奇函数的是？",
   "options": [
    {
     "text": "$(f\\circ g)(x)$",
     "correct": false
    },
    {
     "text": "$(g\\circ f)(x)$",
     "correct": false
    },
    {
     "text": "$(f\\cdot f)(x)$",
     "correct": false
    },
    {
     "text": "$(g\\circ g)(x)$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$f(g(-x))=f(-g(x))=f(g(x))$，外层为偶，复合后是偶函数。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$g(f(-x))=g(f(x))$，内层为偶，复合结果为偶函数。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$f(-x)f(-x)=f(x)f(x)$，偶乘偶得偶函数。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$g(g(-x))=g(-g(x))=-g(g(x))$，内、外层都奇，复合仍为奇函数。</span></div>"
  },
  {
   "id": "ch01-q5",
   "ch": "ch01",
   "type": "mcq",
   "difficulty": 1,
   "kp": "1.1 分段函数", "tags": ["output"],
   "scope": "prereq",
   "stem": "设分段函数 $f(x)$：当 $x<0$ 时 $f(x)=-x$，当 $0\\le x\\le1$ 时 $f(x)=x^{2}$，当 $x>1$ 时 $f(x)=1$，则 $f(-2)+f(1)+f(2)$ 等于？",
   "options": [
    {
     "text": "$4$",
     "correct": true
    },
    {
     "text": "$7$",
     "correct": false
    },
    {
     "text": "$0$",
     "correct": false
    },
    {
     "text": "$6$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$f(-2)=2$、$f(1)=1$（取 $x^{2}$ 支）、$f(2)=1$，和为 $4$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。得 $7$ 是把 $f(2)$ 也代入了 $x^{2}$ 支，$x=2>1$ 应取常数支 $1$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。得 $0$ 是把 $f(-2)$ 算成了 $-2$，第一支应为 $f(x)=-x$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。得 $6$ 是把 $x=-2$ 代入了 $x^{2}$ 支得 $4$，$x<0$ 只能用 $-x$。</span></div>"
  },
  {
   "id": "ch01-q6",
   "ch": "ch01",
   "type": "mcq",
   "difficulty": 3,
   "kp": "1.2 复合函数", "tags": ["concept","trap"],
   "scope": "prereq",
   "stem": "设 $f(x)=x^{2}$，$g(x)=\\sqrt{x}$，则复合函数 $(f\\circ g)(x)$ 及其定义域是？",
   "options": [
    {
     "text": "$x^{2}\\sqrt{x}$，定义域 $[0,\\infty)$",
     "correct": false
    },
    {
     "text": "$x$，定义域 $[0,\\infty)$",
     "correct": true
    },
    {
     "text": "$x$，定义域 $\\mathbb R$",
     "correct": false
    },
    {
     "text": "$|x|$，定义域 $\\mathbb R$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。把复合 $f(g(x))$ 当成了乘积 $f(x)g(x)=x^{2}\\sqrt{x}$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$(f\\circ g)(x)=(\\sqrt{x})^{2}=x$；仍需 $x\\ge0$，化简不改变定义域。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。化简为 $x$ 后误取定义域 $\\mathbb R$，忘了先要求 $x\\in D(g)=[0,\\infty)$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$|x|$ 是 $\\sqrt{x^{2}}$ 的结果，本题先开方再平方，在 $x\\ge0$ 上等于 $x$。</span></div>"
  },
  {
   "id": "ch01-q7",
   "ch": "ch01",
   "type": "mcq",
   "difficulty": 2,
   "kp": "1.2 图象的平移、伸缩与反射", "tags": ["output","trap"],
   "scope": "prereq",
   "stem": "设 $f(x)=x^{4}-4x^{3}+10$。把 $y=f(x)$ 的图象先横向压缩为原来的 $\\frac{1}{2}$，再关于 $y$ 轴反射，所得函数的解析式是？",
   "options": [
    {
     "text": "$x^{4}+32x^{3}+10$",
     "correct": false
    },
    {
     "text": "$16x^{4}+32x^{3}+10$",
     "correct": true
    },
    {
     "text": "$\\frac{x^{4}}{16}+\\frac{x^{3}}{2}+10$",
     "correct": false
    },
    {
     "text": "$16x^{4}-32x^{3}+10$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$(-2x)^{4}=16x^{4}$，系数也要被四次方放大，不是 $x^{4}$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。压缩 $2$ 倍取 $x\\to2x$，反射取 $x\\to-x$，合为 $f(-2x)=16x^{4}+32x^{3}+10$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。把横向压缩写成了 $f(x/2)$，那是横向拉伸，方向弄反了。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$-4(-2x)^{3}=+32x^{3}$，奇次项的负号被漏掉了。</span></div>"
  },
  {
   "id": "ch01-q8",
   "ch": "ch01",
   "type": "mcq",
   "difficulty": 1,
   "kp": "1.3 三角函数", "tags": ["output"],
   "scope": "prereq",
   "stem": "已知 $\\sin x=\\frac{3}{5}$ 且 $x\\in\\left(\\frac{\\pi}{2},\\pi\\right)$，则 $\\cos x$ 等于？",
   "options": [
    {
     "text": "$-\\frac{4}{5}$",
     "correct": true
    },
    {
     "text": "$\\frac{4}{5}$",
     "correct": false
    },
    {
     "text": "$-\\frac{3}{4}$",
     "correct": false
    },
    {
     "text": "$-\\frac{5}{4}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$\\cos^{2}x=1-\\frac{9}{25}=\\frac{16}{25}$，$x$ 在第 II 象限故 $\\cos x=-\\frac{4}{5}$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\frac{4}{5}$ 丢了象限符号，第 II 象限的余弦必为负。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$-\\frac{3}{4}$ 是 $\\tan x=\\frac{\\sin x}{\\cos x}$ 的值，问的是余弦。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$|\\cos x|\\le1$；$-\\frac{5}{4}$ 是 $\\sec x=\\frac{r}{x}$，倒数关系弄反了。</span></div>"
  },
  {
   "id": "ch01-q9",
   "ch": "ch01",
   "type": "mcq",
   "difficulty": 2,
   "kp": "1.3 三角恒等式与降幂公式", "tags": ["output"],
   "scope": "prereq",
   "stem": "用降幂公式求 $\\cos^{2}\\frac{5\\pi}{12}$ 的值。",
   "options": [
    {
     "text": "$\\frac{2-\\sqrt{3}}{2}$",
     "correct": false
    },
    {
     "text": "$\\frac{2+\\sqrt{3}}{4}$",
     "correct": false
    },
    {
     "text": "$-\\frac{\\sqrt{3}}{2}$",
     "correct": false
    },
    {
     "text": "$\\frac{2-\\sqrt{3}}{4}$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。把分母 $4$ 的一半丢了，$\\frac{1-\\sqrt{3}/2}{2}$ 不是 $1-\\frac{\\sqrt{3}}{2}$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\cos\\frac{5\\pi}{6}=-\\frac{\\sqrt{3}}{2}$，降幂公式分子应取减号。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$-\\frac{\\sqrt{3}}{2}$ 是 $\\cos\\frac{5\\pi}{6}$，本题还要平方并降幂。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$\\cos^2\\theta=\\frac{1+\\cos2\\theta}{2}$，$2\\theta=\\frac{5\\pi}{6}$，得 $\\frac{2-\\sqrt{3}}{4}$。</span></div>"
  },
  {
   "id": "ch01-q10",
   "ch": "ch01",
   "type": "mcq",
   "difficulty": 2,
   "kp": "1.3 正弦曲线的参数", "tags": ["concept"],
   "scope": "prereq",
   "stem": "关于曲线 $y=2\\sin(x+\\pi)-1$，下列说法正确的是？",
   "options": [
    {
     "text": "振幅 $2$，周期 $2\\pi$，左移 $\\pi$，下移 $1$",
     "correct": true
    },
    {
     "text": "振幅 $2$，周期 $\\pi$，左移 $\\pi$，下移 $1$",
     "correct": false
    },
    {
     "text": "振幅 $1$，周期 $2\\pi$，左移 $\\pi$，下移 $2$",
     "correct": false
    },
    {
     "text": "振幅 $2$，周期 $2\\pi$，右移 $\\pi$，上移 $1$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。对照 $A\\sin[\\frac{2\\pi}{B}(x-C)]+D$：$A=2$，$B=2\\pi$，$C=-\\pi$，$D=-1$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$x$ 的系数为 $1$，周期是 $2\\pi$，不是 $\\pi$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。振幅是 $|A|=2$；$-1$ 是垂直位移 $D$，不决定振幅。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$x+\\pi=x-(-\\pi)$ 是左移 $\\pi$；$D=-1$ 是下移而非上移。</span></div>"
  },
  {
   "id": "ch02-q1",
   "ch": "ch02",
   "type": "mcq",
   "difficulty": 1,
   "kp": "2.1 变化率与曲线的切线", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "设 $f(x)=x^{2}$，则 $f$ 在区间 $[1,3]$ 上的平均变化率为？",
   "options": [
    {
     "text": "$8$",
     "correct": false
    },
    {
     "text": "$4$",
     "correct": true
    },
    {
     "text": "$2$",
     "correct": false
    },
    {
     "text": "$3$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$8=f(3)-f(1)$ 只是函数值的改变量 $\\Delta y$，漏掉了除以 $\\Delta x=2$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。平均变化率 $=\\frac{f(3)-f(1)}{3-1}=\\frac{9-1}{2}=4$，它就是割线的斜率。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$2=3-1$ 是自变量的改变量 $\\Delta x$，不是平均变化率。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$3$ 是右端点的横坐标，把端点当成变化率是把 $x$ 与 $\\Delta y/\\Delta x$ 混为一谈。</span></div>"
  },
  {
   "id": "ch02-q2",
   "ch": "ch02",
   "type": "mcq",
   "difficulty": 2,
   "kp": "2.1 变化率与曲线的切线", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "曲线 $y=x^{2}$ 在点 $P(2,4)$ 处的切线方程是？",
   "options": [
    {
     "text": "$y=4x+4$",
     "correct": false
    },
    {
     "text": "$y=4x$",
     "correct": false
    },
    {
     "text": "$y=4x-4$",
     "correct": true
    },
    {
     "text": "$y=2x$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。斜率 $4$ 是对的，但点斜式展开时截距符号写反了，应为 $y=4x-4$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。斜率对却漏了截距：$y=4x$ 不过点 $(2,4)$，代入得 $8\\ne4$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。割线斜率 $\\frac{(2+h)^{2}-4}{h}=4+h\\to4$，点斜式 $y=4+4(x-2)=4x-4$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$2=\\frac{4-0}{2-0}$ 是原点与 $P$ 连线（割线）的斜率，不是该点切线的斜率。</span></div>"
  },
  {
   "id": "ch02-q3",
   "ch": "ch02",
   "type": "mcq",
   "difficulty": 1,
   "kp": "2.2 函数极限与极限法则", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "设 $f(x)=\\frac{x^{2}-1}{x-1}$（$x\\ne1$），且 $f(1)=5$，则 $\\lim_{x\\to1}f(x)=$？",
   "options": [
    {
     "text": "$5$",
     "correct": false
    },
    {
     "text": "$0$",
     "correct": false
    },
    {
     "text": "不存在",
     "correct": false
    },
    {
     "text": "$2$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$5$ 是 $f(1)$ 的函数值；极限只看 $x\\to1$ 且 $x\\ne1$ 时的趋势，与函数值无关。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$0$ 来自把分子分母在 $x=1$ 处的值相除得 $0/0$；$0/0$ 只是不定式信号，必须约分。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。约分后 $f(x)=x+1$ 在 $x\\to1$ 时趋于 $2$，极限存在；$x=1$ 处无定义只影响连续性。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$x\\ne1$ 时 $\\frac{x^{2}-1}{x-1}=x+1\\to2$，极限与 $f(1)=5$ 无关。</span></div>"
  },
  {
   "id": "ch02-q4",
   "ch": "ch02",
   "type": "mcq",
   "difficulty": 2,
   "kp": "2.2 函数极限与极限法则", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "$\\lim_{x\\to0}\\frac{\\sqrt{x^{2}+100}-10}{x^{2}}=$？",
   "options": [
    {
     "text": "$0$",
     "correct": false
    },
    {
     "text": "$\\frac{1}{20}$",
     "correct": true
    },
    {
     "text": "$\\frac{1}{10}$",
     "correct": false
    },
    {
     "text": "$20$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。数值表在 $|x|$ 极小时因舍入误差跳成 $0$，那只是计算器的假象，代数化简给出 $0.05$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。乘共轭后约去 $x^{2}$，得 $\\frac{1}{\\sqrt{x^{2}+100}+10}$，代入 $x=0$ 即 $\\frac{1}{20}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。有理化后分母是 $\\sqrt{x^{2}+100}+10\\to20$，漏掉那个 $10$ 才会得到 $\\frac{1}{10}$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$20$ 是分母的极限，整体应是它的倒数 $\\frac{1}{20}$，而不是 $20$。</span></div>"
  },
  {
   "id": "ch02-q5",
   "ch": "ch02",
   "type": "mcq",
   "difficulty": 3,
   "kp": "2.3 极限的精确定义", "tags": ["exam","concept","trap"],
   "scope": "midterm",
   "stem": "用定义证明 $\\lim_{x\\to1}(5x-3)=2$ 时，若给定 $\\varepsilon=0.5$，则可取 $\\delta=$？",
   "options": [
    {
     "text": "$0.1$",
     "correct": true
    },
    {
     "text": "$0.5$",
     "correct": false
    },
    {
     "text": "$2.5$",
     "correct": false
    },
    {
     "text": "$0.02$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$|(5x-3)-2|=5|x-1|<\\varepsilon$ 要求 $|x-1|<\\frac{\\varepsilon}{5}=0.1$，故取 $\\delta=0.1$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\delta=\\varepsilon$ 只适用于 $|f(x)-L|=|x-c|$ 的情形；本题多出因子 $5$，必须除以 $5$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$2.5=5\\varepsilon$ 把因子 $5$ 乘反了，解不等式时应把 $5$ 除过去。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$0.02$ 相当于把 $\\varepsilon$ 除了两次 $5$（即 $\\varepsilon/25$），只除一次得 $0.1$。</span></div>"
  },
  {
   "id": "ch02-q6",
   "ch": "ch02",
   "type": "mcq",
   "difficulty": 1,
   "kp": "2.4 单侧极限", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "设 $x<1$ 时 $f(x)=x+1$，$x\\ge1$ 时 $f(x)=x^{2}+3$，则 $\\lim_{x\\to1}f(x)=$？",
   "options": [
    {
     "text": "不存在",
     "correct": true
    },
    {
     "text": "$2$",
     "correct": false
    },
    {
     "text": "$4$",
     "correct": false
    },
    {
     "text": "$3$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。左极限 $\\lim_{x\\to1^{-}}(x+1)=2$，右极限 $\\lim_{x\\to1^{+}}(x^{2}+3)=4$，两者不等，由 Th6 知极限不存在。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$2$ 只是左极限；双侧极限存在要求左右极限相等，而右极限是 $4$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$4$ 只是右极限（也等于 $f(1)$）；单侧极限存在推不出双侧极限存在。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$3$ 只是右段表达式 $x^{2}+3$ 的常数项，把它当成极限值没有依据。</span></div>"
  },
  {
   "id": "ch02-q7",
   "ch": "ch02",
   "type": "mcq",
   "difficulty": 2,
   "kp": "2.4 单侧极限", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "$\\lim_{x\\to0}\\frac{\\sin 2x}{5x}=$？",
   "options": [
    {
     "text": "$\\frac{1}{5}$",
     "correct": false
    },
    {
     "text": "$1$",
     "correct": false
    },
    {
     "text": "$\\frac{2}{5}$",
     "correct": true
    },
    {
     "text": "$\\frac{5}{2}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac{1}{5}$ 相当于把 $\\frac{\\sin 2x}{x}$ 当成了 $1$；它实际趋于 $2$，配系数时分子要补上 $2$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。只有上下完全一致的 $\\frac{\\sin\\theta}{\\theta}$ 才趋于 $1$；这里分子是 $\\sin 2x$、分母是 $5x$，不能直接得 $1$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$\\frac{\\sin 2x}{5x}=\\frac{2}{5}\\cdot\\frac{\\sin 2x}{2x}\\to\\frac{2}{5}\\cdot1=\\frac{2}{5}$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{5}{2}$ 是 $\\frac{2}{5}$ 的倒数，把该补在分子的 $2$ 与分母的 $5$ 写反了位置。</span></div>"
  },
  {
   "id": "ch02-q8",
   "ch": "ch02",
   "type": "mcq",
   "difficulty": 2,
   "kp": "2.5 连续性", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "$f(x)=\\frac{1}{x^{2}}$ 在 $x=0$ 处的间断点类型是？",
   "options": [
    {
     "text": "可去间断点",
     "correct": false
    },
    {
     "text": "无穷间断点",
     "correct": true
    },
    {
     "text": "跳跃间断点",
     "correct": false
    },
    {
     "text": "振荡间断点",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。可去间断点要求 $\\lim_{x\\to0}f(x)$ 存在且为有限数；这里极限是 $\\infty$，属于极限不存在。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$\\lim_{x\\to0}\\frac{1}{x^{2}}=\\infty$，单侧极限为无穷大，属于无穷间断点。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。跳跃间断点要求左右极限都存在但不相等（如 $\\lfloor x\\rfloor$ 在整数点）；这里左右极限都是 $+\\infty$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。振荡间断点指极限因无限振荡而不存在（如 $\\sin\\frac{1}{x}$），与无界发散是两回事。</span></div>"
  },
  {
   "id": "ch02-q9",
   "ch": "ch02",
   "type": "mcq",
   "difficulty": 2,
   "kp": "2.5 连续性", "tags": ["exam","concept"],
   "scope": "midterm",
   "stem": "设 $f(x)=x^{3}-x-1$ 在 $[1,2]$ 上连续，$f(1)=-1$，$f(2)=5$。由介值定理能推出的结论是？",
   "options": [
    {
     "text": "存在 $c\\in(1,2)$ 使 $f(c)=-2$",
     "correct": false
    },
    {
     "text": "$f(1.5)=2$",
     "correct": false
    },
    {
     "text": "$f$ 在 $(1,2)$ 内恰有一个零点",
     "correct": false
    },
    {
     "text": "存在 $c\\in(1,2)$ 使 $f(c)=0$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$-2$ 比 $f(1)=-1$ 还小，并不介于 $f(1)$ 与 $f(2)$ 之间，IVT 的前提不满足，不能断言取到。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。IVT 只保证存在某个 $c$，不给出位置，更不会恰在 $x=1.5$ 处取到两端函数值的平均 $2$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。IVT 只保证至少有一个零点，不保证唯一；要断言唯一还需 $f$ 在 $(1,2)$ 上单调（如 $f'>0$）。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$0$ 介于 $f(1)=-1$ 与 $f(2)=5$ 之间，由介值定理（零点存在定理）存在 $c\\in(1,2)$ 使 $f(c)=0$。</span></div>"
  },
  {
   "id": "ch02-q10",
   "ch": "ch02",
   "type": "mcq",
   "difficulty": 3,
   "kp": "2.6 无穷极限与渐近线", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "$\\lim_{x\\to-\\infty}\\left(\\sqrt{x^{2}+16}-x\\right)=$？",
   "options": [
    {
     "text": "$+\\infty$",
     "correct": true
    },
    {
     "text": "$0$",
     "correct": false
    },
    {
     "text": "$-\\infty$",
     "correct": false
    },
    {
     "text": "$16$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$x<0$ 时 $\\sqrt{x^{2}+16}\\approx|x|=-x$，故 $\\sqrt{x^{2}+16}-x\\approx-2x\\to+\\infty$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$0$ 是 $x\\to+\\infty$ 时的结果；$x\\to-\\infty$ 时两项同号增长，不是 $\\infty-\\infty=0$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。这是把 $\\sqrt{x^{2}}$ 写成 $x$（$x<0$ 时应为 $|x|=-x$）造成的符号错误，极限应为 $+\\infty$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。有理化后得 $\\frac{16}{\\sqrt{x^{2}+16}+x}$，分母趋于 $0^{+}$，商发散到 $+\\infty$ 而不停在 $16$。</span></div>"
  },
  {
   "id": "ch02-q11",
   "ch": "ch02",
   "type": "mcq",
   "difficulty": 1,
   "kp": "2.1 变化率与曲线的切线", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "自由落体运动中，物体下落的距离 $y$（单位：m）与时间 $t$（单位：s）满足 $y=4.9t^{2}$。该物体在 $t=2$ s 时的瞬时速度（单位：m/s）是？",
   "options": [
    {
     "text": "$9.8$",
     "correct": false
    },
    {
     "text": "$4.9$",
     "correct": false
    },
    {
     "text": "$19.6$",
     "correct": true
    },
    {
     "text": "$0$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$9.8$ 是 $t=1$ s 时的瞬时速度，也恰好等于 $[0,2]$ s 上的平均速度 $\\frac{19.6-0}{2}=9.8$；这里把起算时刻代成了 $t_0=1$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$4.9$ 只是 $y=4.9t^{2}$ 的系数；化简平均速度时会带出因子 $2t_0=4$，直接把系数当成速度是漏掉了这一步。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。从 $t=2$ 起算 $h$ 秒的平均速度为 $\\frac{4.9(2+h)^{2}-4.9\\cdot 2^{2}}{h}=\\frac{19.6h+4.9h^{2}}{h}=19.6+4.9h$，令 $h\\to0$ 得瞬时速度 $19.6$ m/s。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$0$ 来自把 $(2+h)^{2}$ 错展开成 $2^{2}+h^{2}$（漏掉中间项 $4h$），那样只会得到 $\\frac{4.9h^{2}}{h}=4.9h\\to0$。</span></div>"
  },
  {
   "id": "ch02-q12",
   "ch": "ch02",
   "type": "mcq",
   "difficulty": 1,
   "kp": "2.2 函数极限与极限法则", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "已知对一切 $x\\ne0$ 都有 $1-\\frac{x^{2}}{4}\\le u(x)\\le 1+\\frac{x^{2}}{2}$，则 $\\lim_{x\\to0}u(x)=$？",
   "options": [
    {
     "text": "$0$",
     "correct": false
    },
    {
     "text": "$1$",
     "correct": true
    },
    {
     "text": "$1+\\frac{x^{2}}{2}$",
     "correct": false
    },
    {
     "text": "不存在",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。这是把 $u(x)$ 的上下界当成了 $\\frac{x^{2}}{4}$ 与 $\\frac{x^{2}}{2}$（它们趋于 $0$）；不等式两边还各有一个常数项 $1$，两个界的极限都是 $1$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$\\lim_{x\\to0}\\left(1-\\frac{x^{2}}{4}\\right)=1$，$\\lim_{x\\to0}\\left(1+\\frac{x^{2}}{2}\\right)=1$，由夹逼定理（Th4）得 $\\lim_{x\\to0}u(x)=1$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。这是上界本身（仍含 $x$）；夹逼定理要求先对两个界取极限，而不是照抄其中一边的表达式。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。夹逼定理并不要求知道 $u$ 的具体表达式，只要两个界的极限存在且相等即可；这里它们都等于 $1$，极限存在。</span></div>"
  },
  {
   "id": "ch02-q13",
   "ch": "ch02",
   "type": "mcq",
   "difficulty": 3,
   "kp": "2.2 函数极限与极限法则", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "设 $\\lim_{x\\to2}\\frac{f(x)-5}{x-2}=3$，则 $\\lim_{x\\to2}f(x)=$？",
   "options": [
    {
     "text": "$5$",
     "correct": true
    },
    {
     "text": "$3$",
     "correct": false
    },
    {
     "text": "$0$",
     "correct": false
    },
    {
     "text": "条件不足，不能确定",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$f(x)-5=\\frac{f(x)-5}{x-2}\\cdot(x-2)$，右端两个因子的极限 $3$ 与 $0$ 都存在且有限，由积法则（Th1）得 $\\lim_{x\\to2}(f(x)-5)=3\\cdot0=0$，故 $\\lim_{x\\to2}f(x)=5$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$3$ 是商 $\\frac{f(x)-5}{x-2}$ 的极限，不是 $f$ 的极限；直接把它当答案漏掉了分子里的常数 $5$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。积法则给出的是 $\\lim_{x\\to2}(f(x)-5)=0$，即 $\\lim_{x\\to2}f(x)=5$；把 $\\lim_{x\\to2}(f(x)-5)$ 当成 $\\lim_{x\\to2}f(x)$ 是漏掉了那个 $5$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。分母趋于 $0$ 而商有有限极限，恰恰迫使分子趋于 $0$；再配合 $f(x)-5=\\frac{f(x)-5}{x-2}(x-2)$ 就能算出 $\\lim_{x\\to2}f(x)=5$，条件并不缺少。</span></div>"
  },
  {
   "id": "ch02-q14",
   "ch": "ch02",
   "type": "mcq",
   "difficulty": 2,
   "kp": "2.3 极限的精确定义", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "$\\lim_{x\\to2}\\frac{5}{(x-2)^{2}}=\\infty$ 的精确含义是：对任意 $B>0$，存在 $\\delta>0$，使得？",
   "options": [
    {
     "text": "$0<|x-2|<\\delta\\Rightarrow\\left|\\frac{5}{(x-2)^{2}}-B\\right|<\\varepsilon$",
     "correct": false
    },
    {
     "text": "$|x-2|<\\delta\\Rightarrow\\frac{5}{(x-2)^{2}}>B$",
     "correct": false
    },
    {
     "text": "$x>\\delta\\Rightarrow\\frac{5}{(x-2)^{2}}>B$",
     "correct": false
    },
    {
     "text": "$0<|x-2|<\\delta\\Rightarrow\\frac{5}{(x-2)^{2}}>B$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。这是有限极限 $\\lim_{x\\to c}f(x)=L$ 的 $\\varepsilon$-$\\delta$ 形式（还把该记作 $L$ 的位置写成了 $B$）；$\\infty$ 不是实数，谈不上「与 $B$ 的距离小于 $\\varepsilon$」。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。漏掉了 $0<|x-2|$：$x=2$ 处 $\\frac{5}{(x-2)^{2}}$ 无定义，定义必须把这个点排除在外。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$x>\\delta$ 是 $x\\to+\\infty$ 时 $\\lim f(x)=\\infty$ 的写法（且阈值习惯记作 $M$），与 $x\\to2$ 无关。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$\\lim_{x\\to c}f(x)=\\infty$ 指对任意 $B>0$ 存在 $\\delta>0$，使 $0<|x-c|<\\delta\\Rightarrow f(x)>B$；本题 $c=2$，即 $0<|x-2|<\\delta\\Rightarrow\\frac{5}{(x-2)^{2}}>B$。</span></div>"
  },
  {
   "id": "ch02-q15",
   "ch": "ch02",
   "type": "mcq",
   "difficulty": 1,
   "kp": "2.4 单侧极限", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "设 $f(x)=\\sqrt{4-x^{2}}$，则 $\\lim_{x\\to-2^{+}}f(x)=$？",
   "options": [
    {
     "text": "$0$",
     "correct": true
    },
    {
     "text": "$2$",
     "correct": false
    },
    {
     "text": "$4$",
     "correct": false
    },
    {
     "text": "不存在，因为 $x<-2$ 时 $f(x)$ 没有定义",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$x\\to-2^{+}$ 时只取 $x>-2$，此时 $4-x^{2}\\to0^{+}$，于是 $\\sqrt{4-x^{2}}\\to0$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$2=\\sqrt{4-0^{2}}=f(0)$ 是 $x=0$ 处的函数值，与 $x\\to-2^{+}$ 的趋势无关。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$4$ 是根号内的常数项；$x\\to-2$ 时 $4-x^{2}=4-4\\to0$，不能把 $4-x^{2}$ 直接读成 $4$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$x<-2$ 时确实无定义，但右极限只考察 $x>-2$ 的一侧：$f$ 在 $(-2,0]$ 上有定义且趋于 $0$，该单侧极限存在（在定义域端点处只要求相应的单侧极限存在）。</span></div>"
  },
  {
   "id": "ch02-q16",
   "ch": "ch02",
   "type": "mcq",
   "difficulty": 2,
   "kp": "2.3 极限的精确定义", "tags": ["exam","concept","trap"],
   "scope": "midterm",
   "stem": "用 $\\varepsilon$-$\\delta$ 定义证明 $\\lim_{x\\to5}\\sqrt{x-1}=2$ 时，若取 $\\varepsilon=1$，则 $|\\sqrt{x-1}-2|<1$ 等价于？",
   "options": [
    {
     "text": "$-1<\\sqrt{x-1}<1$",
     "correct": false
    },
    {
     "text": "$1<x<9$",
     "correct": false
    },
    {
     "text": "$2<x<10$",
     "correct": true
    },
    {
     "text": "$\\sqrt{x-1}<3$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。由 $|\\sqrt{x-1}-2|<1$ 写出的应是 $-1<\\sqrt{x-1}-2<1$；这里把中间的 $-2$ 丢了，正确形式是 $1<\\sqrt{x-1}<3$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。由 $1<\\sqrt{x-1}<3$ 平方得 $1<x-1<9$，还要再加 $1$ 才是 $x$ 的范围，即 $2<x<10$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$|\\sqrt{x-1}-2|<1\\iff-1<\\sqrt{x-1}-2<1\\iff1<\\sqrt{x-1}<3\\iff1<x-1<9\\iff2<x<10$，也就是 $|x-5|<3$，故可取 $\\delta=3$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。这只保留了上界，漏掉 $\\sqrt{x-1}>1$；满足 $\\sqrt{x-1}<3$ 的 $x$ 可以取到任意接近 $1$ 的值（如 $x=1.01$），此时 $|\\sqrt{x-1}-2|\\approx1.9>1$，条件不成立。</span></div>"
  },
  {
   "id": "ch02-q17",
   "ch": "ch02",
   "type": "mcq",
   "difficulty": 2,
   "kp": "2.5 连续性", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "设 $f(x)=\\begin{cases}\\dfrac{x^{2}+x-6}{x-2}, & x<2\\\\ ax+1, & x\\ge2\\end{cases}$。若 $f$ 在 $x=2$ 处连续，则 $a=$？",
   "options": [
    {
     "text": "$a=\\frac{5}{2}$",
     "correct": false
    },
    {
     "text": "$a=2$",
     "correct": true
    },
    {
     "text": "$a=-1$",
     "correct": false
    },
    {
     "text": "不存在这样的 $a$，因为 $x\\to2^{-}$ 时分子分母都趋于 $0$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。这是解 $2a=5$ 得到的结果，漏掉了右段的常数项：$f(2)=2a+1$ 而不是 $2a$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$x<2$ 时 $\\frac{x^{2}+x-6}{x-2}=\\frac{(x+3)(x-2)}{x-2}=x+3\\to5$；右段在 $x=2$ 处（即 $f(2)$）取值为 $2a+1$。连续要求左右极限相等且都等于函数值，即 $2a+1=5$，故 $a=2$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$x^{2}+x-6=(x+3)(x-2)$（两数之积为 $-6$、和为 $1$）；若错分解成 $(x-3)(x-2)$，就会把左极限算成 $2-3=-1$，从而解出 $a=-1$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$0/0$ 只是不定式的信号而不是结论；约去公因式 $(x-2)$ 后左极限存在且等于 $5$，取 $a=2$ 时右极限与函数值都是 $5$，函数在该点连续。</span></div>"
  },
  {
   "id": "ch02-q18",
   "ch": "ch02",
   "type": "mcq",
   "difficulty": 2,
   "kp": "2.5 连续性", "tags": ["exam","concept"],
   "scope": "midterm",
   "stem": "下列函数中，$x=2$ 是哪一个的可去间断点？",
   "options": [
    {
     "text": "$f(x)=\\dfrac{x}{x-2}$",
     "correct": false
    },
    {
     "text": "$f(x)=\\dfrac{|x-2|}{x-2}$",
     "correct": false
    },
    {
     "text": "$f(x)=\\sin\\dfrac{1}{x-2}$",
     "correct": false
    },
    {
     "text": "$f(x)=\\dfrac{x^{2}+x-6}{x^{2}-4}$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\lim_{x\\to2^{+}}\\frac{x}{x-2}=+\\infty$、$\\lim_{x\\to2^{-}}\\frac{x}{x-2}=-\\infty$，单侧极限为无穷大，属于无穷间断点。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$x\\to2^{-}$ 时 $\\frac{|x-2|}{x-2}=-1$，$x\\to2^{+}$ 时为 $1$，左右极限都存在但不相等，属于跳跃间断点。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$x\\to2$ 时 $\\frac{1}{x-2}$ 无界，$\\sin\\frac{1}{x-2}$ 在 $[-1,1]$ 内无限振荡，极限不存在，属于振荡间断点，补充定义也消除不了。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$x\\ne2$ 时 $\\frac{x^{2}+x-6}{x^{2}-4}=\\frac{(x+3)(x-2)}{(x+2)(x-2)}=\\frac{x+3}{x+2}\\to\\frac{5}{4}$，极限存在且有限，只要补充定义 $f(2)=\\frac{5}{4}$ 即可连续，故 $x=2$ 是可去间断点。</span></div>"
  },
  {
   "id": "ch02-q19",
   "ch": "ch02",
   "type": "mcq",
   "difficulty": 2,
   "kp": "2.6 无穷极限与渐近线", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "曲线 $y=\\dfrac{x^{3}-2}{|x|^{3}+1}$ 的水平渐近线是？",
   "options": [
    {
     "text": "$y=1$ 与 $y=-1$",
     "correct": true
    },
    {
     "text": "只有 $y=1$",
     "correct": false
    },
    {
     "text": "只有 $y=-1$",
     "correct": false
    },
    {
     "text": "$y=1$ 与 $y=0$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$x\\to+\\infty$ 时 $|x|^{3}=x^{3}$，$y=\\frac{1-2x^{-3}}{1+x^{-3}}\\to1$；$x\\to-\\infty$ 时 $|x|^{3}=-x^{3}$，$y=\\frac{x^{3}-2}{-x^{3}+1}\\to-1$。两个方向各得一条，故有 $y=1$ 与 $y=-1$ 两条水平渐近线。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。只算了 $x\\to+\\infty$ 一侧；$x\\to-\\infty$ 必须单独算，此时 $|x|^{3}=-x^{3}$，得到的是 $y=-1$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。只算了 $x\\to-\\infty$ 一侧；$x\\to+\\infty$ 时 $|x|^{3}=x^{3}$，极限为 $1$，故 $y=1$ 也是水平渐近线。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。分子分母同为 $3$ 次，$x\\to\\pm\\infty$ 时的极限是最高次项系数之比（$\\pm1$）而不是 $0$；只有分母次数更高时极限才为 $0$。</span></div>"
  },
  {
   "id": "ch02-q20",
   "ch": "ch02",
   "type": "mcq",
   "difficulty": 3,
   "kp": "2.6 无穷极限与渐近线", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "曲线 $y=\\dfrac{x^{2}-3}{2x-4}$ 的所有渐近线是？",
   "options": [
    {
     "text": "斜渐近线 $y=\\frac{x}{2}$ 与垂直渐近线 $x=2$",
     "correct": false
    },
    {
     "text": "斜渐近线 $y=\\frac{x}{2}+1$ 与垂直渐近线 $x=2$",
     "correct": true
    },
    {
     "text": "斜渐近线 $y=2x+1$ 与垂直渐近线 $x=2$",
     "correct": false
    },
    {
     "text": "只有斜渐近线 $y=\\frac{x}{2}+1$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。长除法给出 $y=\\frac{x}{2}+1+\\frac{1}{2x-4}$；只取最高次项之比 $\\frac{x^{2}}{2x}=\\frac{x}{2}$ 会丢掉商里的常数项 $1$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。长除法：$x^{2}-3=\\left(\\frac{x}{2}+1\\right)(2x-4)+1$，故 $y=\\frac{x}{2}+1+\\frac{1}{2x-4}$，$x\\to\\pm\\infty$ 时余项 $\\to0$，得斜渐近线 $y=\\frac{x}{2}+1$；又 $\\lim_{x\\to2^{+}}y=+\\infty$、$\\lim_{x\\to2^{-}}y=-\\infty$，故 $x=2$ 是垂直渐近线。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac{x^{2}}{2x}=\\frac{1}{2}x$，商的最高次项系数是 $\\frac{1}{2}$；写成 $2x$ 是把分母的系数 $2$ 乘了上去而不是除掉。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。漏掉了垂直渐近线：分母 $2x-4$ 在 $x=2$ 处为零而分子 $x^{2}-3=1\\ne0$，该点两侧的单侧极限为 $\\pm\\infty$，故 $x=2$ 是垂直渐近线。</span></div>"
  },
  {
   "id": "ch03-q1",
   "ch": "ch03",
   "type": "mcq",
   "difficulty": 1,
   "kp": "3.1 点处的切线与导数", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "曲线 $y=x^{2}$ 在点 $(3,9)$ 处的切线方程是？",
   "options": [
    {
     "text": "$y=6x+27$",
     "correct": false
    },
    {
     "text": "$y=6x-18$",
     "correct": false
    },
    {
     "text": "$y=9x-18$",
     "correct": false
    },
    {
     "text": "$y=6x-9$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。点斜式写成了 $y-9=6(x+3)$，把 $x-3$ 的符号弄反，展开后得到 $y=6x+27$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。只写了 $y=6(x-3)$，漏加切点纵坐标 $f(3)=9$，切线必须过点 $(3,9)$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。把函数值 $f(3)=9$ 当成了切线斜率；斜率应由导数 $y'=2x$ 在 $x=3$ 处求得，即 $6$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$y'=2x$，在 $x=3$ 处切线斜率 $m=6$，由点斜式 $y-9=6(x-3)$ 得 $y=6x-9$。</span></div>"
  },
  {
   "id": "ch03-q2",
   "ch": "ch03",
   "type": "mcq",
   "difficulty": 2,
   "kp": "3.2 导数作为函数", "tags": ["exam","concept"],
   "scope": "midterm",
   "stem": "关于 $f(x)=|x|$ 在 $x=0$ 处的性质，下列说法正确的是？",
   "options": [
    {
     "text": "连续但不可导，因为左右导数分别是 $-1$ 与 $1$",
     "correct": true
    },
    {
     "text": "连续且可导，$f'(0)=0$",
     "correct": false
    },
    {
     "text": "在 $x=0$ 处间断，所以不可导",
     "correct": false
    },
    {
     "text": "不可导，因为 $x=0$ 处有垂直切线",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$f'(0^{-})=-1$、$f'(0^{+})=1$ 不相等，图像在原点成角点，故连续但不可导。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。连续是可导的必要条件而非充分条件；$|x|$ 在 $0$ 处左右导数不相等，$f'(0)$ 不存在。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\lim\\limits_{x\\to0}|x|=0=f(0)$，函数在 $0$ 处连续；这里并未间断。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。垂直切线指差商趋于 $\\pm\\infty$（如 $x^{1/3}$ 在 $0$）；$|x|$ 在 $0$ 的左右导数有限，是角点。</span></div>"
  },
  {
   "id": "ch03-q3",
   "ch": "ch03",
   "type": "mcq",
   "difficulty": 1,
   "kp": "3.3 求导法则", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "函数 $y=\\dfrac{1}{x^{3}}$ 的导数是？",
   "options": [
    {
     "text": "$\\dfrac{3}{x^{4}}$",
     "correct": false
    },
    {
     "text": "$-\\dfrac{3}{x^{4}}$",
     "correct": true
    },
    {
     "text": "$-\\dfrac{1}{3x^{4}}$",
     "correct": false
    },
    {
     "text": "$-3x^{-2}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。漏了负号：$x^{-3}$ 的指数为负，求导得 $-3x^{-4}$，整体带负号。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。先化形为 $y=x^{-3}$，用幂法则得 $y'=-3x^{-4}=-\\dfrac{3}{x^{4}}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。把幂法则当成了除以指数；法则是系数乘 $n$、指数减 $1$，并非除以 $n$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。指数从 $-3$ 变成 $-2$ 等于加 1，方向弄反了；应指数减 $1$ 得 $x^{-4}$。</span></div>"
  },
  {
   "id": "ch03-q4",
   "ch": "ch03",
   "type": "mcq",
   "difficulty": 2,
   "kp": "3.4 导数作为变化率", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "质点沿直线运动，位置 $s=t^{3}-6t^{2}+9t$（$s$ 单位米，$t$ 单位秒），则 $t=2$ 时它的速度为？",
   "options": [
    {
     "text": "$-3$ m/s",
     "correct": true
    },
    {
     "text": "$3$ m/s",
     "correct": false
    },
    {
     "text": "$0$ m/s",
     "correct": false
    },
    {
     "text": "$-6$ m/s",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$v=s'=3t^{2}-12t+9$，代入 $t=2$ 得 $12-24+9=-3$，负号表示沿 $s$ 减小的方向运动。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$3$ 是速率 $|v|$；题目问的是速度，必须带符号，答案应为 $-3$ m/s。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$v=0$ 对应 $3(t-1)(t-3)=0$，即 $t=1$ 或 $t=3$（瞬时静止），$t=2$ 时并不静止。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$-6$ 是 $t=2$ 时的加速度 $a=v'=6t-12$，把加速度当成了速度。</span></div>"
  },
  {
   "id": "ch03-q5",
   "ch": "ch03",
   "type": "mcq",
   "difficulty": 1,
   "kp": "3.5 三角函数导数", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "函数 $y=3\\sin x-2\\cos x$ 的导数是？",
   "options": [
    {
     "text": "$3\\cos x+2\\sin x$",
     "correct": true
    },
    {
     "text": "$3\\cos x-2\\sin x$",
     "correct": false
    },
    {
     "text": "$-3\\cos x+2\\sin x$",
     "correct": false
    },
    {
     "text": "$3\\sin x-2\\cos x$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。逐项求导：$(3\\sin x)'=3\\cos x$，$(-2\\cos x)'=-2\\cdot(-\\sin x)=2\\sin x$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。漏了 $\\cos$ 求导的负号：$(\\cos x)'=-\\sin x$，故 $-2\\cos x$ 这一项应给出 $+2\\sin x$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。把 $\\sin$ 的导数记成了 $-\\cos x$；口诀「余函数带负号」只适用于 $\\cos,\\cot,\\csc$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。这是原函数本身，两项都没有求导。</span></div>"
  },
  {
   "id": "ch03-q6",
   "ch": "ch03",
   "type": "mcq",
   "difficulty": 3,
   "kp": "3.5 三角函数导数", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "$\\dfrac{d^{999}}{dx^{999}}\\cos x$ 等于？",
   "options": [
    {
     "text": "$\\cos x$",
     "correct": false
    },
    {
     "text": "$-\\sin x$",
     "correct": false
    },
    {
     "text": "$\\sin x$",
     "correct": true
    },
    {
     "text": "$-\\cos x$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\cos x$ 是第 0 阶（原函数）也是第 4 阶导数；$999$ 不是 4 的倍数。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$-\\sin x$ 是第 1 阶导数；余数是 3 而不是 1，不能按 $999\\bmod4=1$ 起数。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$\\cos x$ 的高阶导以 4 为周期循环，$999=4\\times249+3$ 取第 3 阶，得 $\\sin x$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$-\\cos x$ 是第 2 阶导数；把 $999=4\\times249+3$ 的余数错当成 2 就会得到它。</span></div>"
  },
  {
   "id": "ch03-q7",
   "ch": "ch03",
   "type": "mcq",
   "difficulty": 2,
   "kp": "3.6 链式法则", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "复合函数 $y=\\sin(x^{2}+x)$ 的导数是？",
   "options": [
    {
     "text": "$\\cos(x^{2}+x)$",
     "correct": false
    },
    {
     "text": "$\\cos(2x+1)$",
     "correct": false
    },
    {
     "text": "$\\cos(x^{2}+x)(2x+1)$",
     "correct": true
    },
    {
     "text": "$-\\sin(x^{2}+x)(2x+1)$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。只对外层求导，漏乘内层导数 $2x+1$，链式法则要求逐层乘到底。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。把内层 $x^{2}+x$ 也求导并替换掉了；外层应原样保留为 $\\cos(x^{2}+x)$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。由外向内：外层 $\\sin$ 求导得 $\\cos(x^{2}+x)$，再乘内层导数 $(x^{2}+x)'=2x+1$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。把 $\\sin$ 的导数记成了 $-\\sin$（那是 $\\cos$ 的导数）；$\\sin$ 求导得 $\\cos$，无负号。</span></div>"
  },
  {
   "id": "ch03-q8",
   "ch": "ch03",
   "type": "mcq",
   "difficulty": 2,
   "kp": "3.7 隐函数求导", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "圆 $x^{2}+y^{2}=25$ 在点 $(3,4)$ 处的切线斜率是？",
   "options": [
    {
     "text": "$\\dfrac{3}{4}$",
     "correct": false
    },
    {
     "text": "$-\\dfrac{3}{4}$",
     "correct": true
    },
    {
     "text": "$-\\dfrac{4}{3}$",
     "correct": false
    },
    {
     "text": "$\\dfrac{4}{3}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。漏了负号：两边对 $x$ 求导得 $2x+2yy'=0$，解出 $y'=-\\dfrac{x}{y}$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。隐函数求导得 $y'=-\\dfrac{x}{y}$，代入 $x=3,y=4$ 得切线斜率 $-\\dfrac{3}{4}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。把商写反成 $-\\dfrac{y}{x}$；分子是 $x$、分母是 $y$，代入 $(3,4)$ 应得 $-\\dfrac{3}{4}$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\dfrac{4}{3}$ 是法线斜率，等于切线斜率的负倒数 $-\\dfrac{1}{m}$，不是切线斜率。</span></div>"
  },
  {
   "id": "ch03-q9",
   "ch": "ch03",
   "type": "mcq",
   "difficulty": 2,
   "kp": "3.8 相关变化率", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "球形气球体积以 $100$ cm$^{3}$/s 的速率增大，当半径 $r=5$ cm 时半径的增长速率为？",
   "options": [
    {
     "text": "$\\dfrac{25}{\\pi}$ cm/s",
     "correct": false
    },
    {
     "text": "$\\dfrac{1}{\\pi}$ cm/s",
     "correct": true
    },
    {
     "text": "$\\dfrac{5}{\\pi}$ cm/s",
     "correct": false
    },
    {
     "text": "$\\dfrac{1}{5\\pi}$ cm/s",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。用了 $4\\pi$ 而漏掉 $r^{2}=25$，把 $\\dfrac{dV}{dr}=4\\pi r^{2}$ 当成了常数 $4\\pi$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$V=\\frac{4}{3}\\pi r^{3}$ 对 $t$ 求导得 $\\frac{dV}{dt}=4\\pi r^{2}r'$，代 $r=5$ 得 $r'=1/\\pi$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。把 $4\\pi r^{2}$ 写成了 $4\\pi r$，少乘一个 $r$，于是解出 $\\dfrac{100}{20\\pi}=\\dfrac{5}{\\pi}$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。相当于把 $\\dfrac{dV}{dr}$ 写成 $4\\pi r^{3}$；幂法则给出 $4\\pi r^{2}$，指数不会留在系数上。</span></div>"
  },
  {
   "id": "ch03-q10",
   "ch": "ch03",
   "type": "mcq",
   "difficulty": 3,
   "kp": "3.9 线性化与微分", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "用微分估计：测得球直径 $D$ 的相对误差为 $1\\%$，则按 $V=\\dfrac{\\pi}{6}D^{3}$ 算出的体积的相对误差约为？",
   "options": [
    {
     "text": "$1\\%$",
     "correct": false
    },
    {
     "text": "$9\\%$",
     "correct": false
    },
    {
     "text": "$6\\%$",
     "correct": false
    },
    {
     "text": "$3\\%$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。只有 $V$ 与 $D$ 成正比时才保持 $1\\%$；这里 $V\\propto D^{3}$，误差会被放大。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$9\\%$ 是把系数 3 又平方了一次；线性估计中 $\\dfrac{dV}{V}=3\\dfrac{dD}{D}$，只乘一次 3。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$6\\%$ 相当于指数取 6；若改为表面积 $S\\propto D^{2}$，相对误差才是 $2\\%$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$dV=\\dfrac{\\pi}{2}D^{2}dD$，故 $\\dfrac{dV}{V}=3\\dfrac{dD}{D}=3\\%$，指数 3 就是放大倍数。</span></div>"
  },
  {
   "id": "ch03-q11",
   "ch": "ch03",
   "type": "mcq",
   "difficulty": 1,
   "kp": "3.1 点处的切线与导数", "tags": ["exam","concept"],
   "scope": "midterm",
   "stem": "设 $f(x)=\\sqrt{x}$，用导数定义求 $f'(9)$，结果是？",
   "options": [
    {
     "text": "$\\dfrac{1}{3}$",
     "correct": false
    },
    {
     "text": "$0$",
     "correct": false
    },
    {
     "text": "$\\dfrac{1}{6}$",
     "correct": true
    },
    {
     "text": "$3$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。有理化后分母为 $\\sqrt{9+h}+3\\to 6$；若把分母只留一项 $\\sqrt{9}=3$，就会得到 $\\dfrac{1}{3}$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。没有先把分子中的 $h$ 约去就令 $h=0$，遇到 $\\dfrac{0}{0}$ 型并误认为极限是 $0$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。由定义 $f'(9)=\\lim\\limits_{h\\to 0}\\dfrac{\\sqrt{9+h}-3}{h}$，有理化得 $\\lim\\limits_{h\\to 0}\\dfrac{1}{\\sqrt{9+h}+3}=\\dfrac{1}{6}$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$3=\\sqrt{9}=f(9)$ 是函数值；$f'(9)$ 是差商的极限，不能把函数值当成导数。</span></div>"
  },
  {
   "id": "ch03-q12",
   "ch": "ch03",
   "type": "mcq",
   "difficulty": 3,
   "kp": "3.2 导数作为函数", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "设当 $x\\le 1$ 时 $f(x)=ax+b$，当 $x\\gt 1$ 时 $f(x)=x^{2}$。若 $f$ 在 $x=1$ 处可导，则 $a,b$ 的值是？",
   "options": [
    {
     "text": "$a=\\dfrac{1}{2}$，$b=\\dfrac{1}{2}$",
     "correct": false
    },
    {
     "text": "$a=2$，$b=0$",
     "correct": false
    },
    {
     "text": "$a=2$，$b=1$",
     "correct": false
    },
    {
     "text": "$a=2$，$b=-1$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。只用了连续性 $a+b=1$，还额外假设了 $a=b$；此时左导数为 $\\dfrac{1}{2}$，与右导数 $2$ 不等，并不可导。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。只让左右导数相等而取了 $b=0$；此时 $f(1)=a+b=2$，而 $x\\to 1^{+}$ 时 $f(x)=x^{2}\\to 1$，左右极限不等，函数在 $x=1$ 处间断，必不可导。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。联立 $a+b=1$ 与 $a=2$ 时移项出错：应为 $b=1-a=-1$，不是 $1$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。可导必先连续，故 $a+b=1$；左导数由 $ax+b$ 得 $a$，右导数由 $x^{2}$ 求导并代 $x=1$ 得 $2$，令 $a=2$ 得 $b=-1$，此时 $f'(1)=2$。</span></div>"
  },
  {
   "id": "ch03-q13",
   "ch": "ch03",
   "type": "mcq",
   "difficulty": 1,
   "kp": "3.3 求导法则", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "函数 $y=\\dfrac{2x+1}{x^{2}+1}$ 的导数是？",
   "options": [
    {
     "text": "$\\dfrac{2-2x-2x^{2}}{(x^{2}+1)^{2}}$",
     "correct": true
    },
    {
     "text": "$\\dfrac{2x^{2}+2x-2}{(x^{2}+1)^{2}}$",
     "correct": false
    },
    {
     "text": "$\\dfrac{2-2x-2x^{2}}{x^{2}+1}$",
     "correct": false
    },
    {
     "text": "$\\dfrac{2}{x^{2}+1}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$y'=\\dfrac{2(x^{2}+1)-(2x+1)(2x)}{(x^{2}+1)^{2}}=\\dfrac{2-2x-2x^{2}}{(x^{2}+1)^{2}}$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。分子顺序写反了：这里相当于 $(2x+1)(2x)-2(x^{2}+1)$，与商法则的 $u'v-uv'$ 整体差一个负号。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。漏掉分母的平方，商法则的分母是 $v^{2}=(x^{2}+1)^{2}$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。只对分子求导再除以分母，$v'=2x$ 完全没有参与运算。</span></div>"
  },
  {
   "id": "ch03-q14",
   "ch": "ch03",
   "type": "mcq",
   "difficulty": 2,
   "kp": "3.4 导数作为变化率", "tags": ["exam","concept"],
   "scope": "midterm",
   "stem": "质点沿直线运动，位置 $s(t)=t^{3}-3t^{2}$（$s$ 单位米，$t$ 单位秒，$t\\ge 0$）。在下列哪个时间段内质点的速率在增大？",
   "options": [
    {
     "text": "$1\\lt t\\lt 2$",
     "correct": false
    },
    {
     "text": "$0\\lt t\\lt 1$ 或 $t\\gt 2$",
     "correct": true
    },
    {
     "text": "$t\\gt 1$",
     "correct": false
    },
    {
     "text": "$0\\lt t\\lt 2$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。这一段上 $v\\lt 0$ 而 $a\\gt 0$，即 $v\\cdot a\\lt 0$，速率在减小（减速），恰好答反。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$v=s'=3t(t-2)$，$a=v'=6(t-1)$；速率增大要求 $v\\cdot a\\gt 0$，即 $0\\lt t\\lt 1$（$v,a$ 同为负）与 $t\\gt 2$（同为正）这两段。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。只把 $a\\gt 0$（即 $t\\gt 1$）当成加速的条件，没有同时看速度的符号；其中 $1\\lt t\\lt 2$ 一段实际在减速。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。这是 $v\\lt 0$ 的整个区间（质点朝 $s$ 减小的方向运动），其中 $1\\lt t\\lt 2$ 一段的速率在减小。</span></div>"
  },
  {
   "id": "ch03-q15",
   "ch": "ch03",
   "type": "mcq",
   "difficulty": 2,
   "kp": "3.5 三角函数导数", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "设 $x$ 是角度制下角的大小（单位：度），$x^{\\circ}$ 表示这个角。则 $\\dfrac{d}{dx}\\sin(x^{\\circ})$ 等于？",
   "options": [
    {
     "text": "$\\cos(x^{\\circ})$",
     "correct": false
    },
    {
     "text": "$\\dfrac{180}{\\pi}\\cos(x^{\\circ})$",
     "correct": false
    },
    {
     "text": "$\\dfrac{\\pi}{180}\\cos(x^{\\circ})$",
     "correct": true
    },
    {
     "text": "$-\\dfrac{\\pi}{180}\\cos(x^{\\circ})$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$(\\sin x)'=\\cos x$ 只在弧度制下成立；这里必须先换算成弧度，漏掉了系数 $\\dfrac{\\pi}{180}$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。换算系数写反了：$x^{\\circ}=\\dfrac{\\pi x}{180}$ 弧度，系数应是 $\\dfrac{\\pi}{180}$，不是 $\\dfrac{180}{\\pi}$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$x^{\\circ}=\\dfrac{\\pi x}{180}$ 弧度，故 $\\sin(x^{\\circ})=\\sin\\left(\\dfrac{\\pi x}{180}\\right)$，求导得 $\\dfrac{\\pi}{180}\\cos\\left(\\dfrac{\\pi x}{180}\\right)=\\dfrac{\\pi}{180}\\cos(x^{\\circ})$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。多了一个负号：$\\sin$ 的导数是 $\\cos$；求导带负号的是 $\\cos,\\cot,\\csc$ 这类“余函数”。</span></div>"
  },
  {
   "id": "ch03-q16",
   "ch": "ch03",
   "type": "mcq",
   "difficulty": 1,
   "kp": "3.6 链式法则", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "函数 $y=\\cos(3x^{2}+1)$ 的导数是？",
   "options": [
    {
     "text": "$-6x\\sin(3x^{2}+1)$",
     "correct": true
    },
    {
     "text": "$-\\sin(3x^{2}+1)$",
     "correct": false
    },
    {
     "text": "$6x\\sin(3x^{2}+1)$",
     "correct": false
    },
    {
     "text": "$-6x\\cos(3x^{2}+1)$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。外层 $\\cos$ 求导得 $-\\sin(3x^{2}+1)$，再乘内层导数 $(3x^{2}+1)'=6x$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。只对外层求导，漏乘内层导数 $6x$；链式法则要求逐层乘到底。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。漏掉 $(\\cos u)'=-\\sin u$ 中的负号，把余弦求导的符号弄丢了。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\cos$ 求导后应变成 $-\\sin$，这里外层仍写着 $\\cos$，等于没有完成对外层的求导。</span></div>"
  },
  {
   "id": "ch03-q17",
   "ch": "ch03",
   "type": "mcq",
   "difficulty": 2,
   "kp": "3.6 链式法则", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "函数 $y=\\sec(1-x^{2})$ 的导数是？",
   "options": [
    {
     "text": "$-2x\\sec^{2}(1-x^{2})$",
     "correct": false
    },
    {
     "text": "$2x\\sec(1-x^{2})\\tan(1-x^{2})$",
     "correct": false
    },
    {
     "text": "$\\sec(1-x^{2})\\tan(1-x^{2})$",
     "correct": false
    },
    {
     "text": "$-2x\\sec(1-x^{2})\\tan(1-x^{2})$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。把 $(\\sec u)'$ 记成了 $\\sec^{2}u$（那是 $\\tan$ 的导数），漏掉 $\\tan$ 因子。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。漏掉内层导数 $(1-x^{2})'=-2x$ 中的负号，符号弄反了。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。漏乘内层导数 $-2x$，只算了外层 $\\sec$ 的导数。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$(\\sec u)'=\\sec u\\tan u\\cdot u'$，取 $u=1-x^{2}$、$u'=-2x$，得 $-2x\\sec(1-x^{2})\\tan(1-x^{2})$。</span></div>"
  },
  {
   "id": "ch03-q18",
   "ch": "ch03",
   "type": "mcq",
   "difficulty": 3,
   "kp": "3.7 隐函数求导", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "由方程 $2x^{3}-3y^{2}=8$ 确定可导函数 $y=y(x)$，则 $y''$（用 $x,y$ 表示）是？",
   "options": [
    {
     "text": "$\\dfrac{2x}{y}$",
     "correct": false
    },
    {
     "text": "$\\dfrac{2x}{y}-\\dfrac{x^{4}}{y^{3}}$",
     "correct": true
    },
    {
     "text": "$\\dfrac{2x}{y}+\\dfrac{x^{4}}{y^{3}}$",
     "correct": false
    },
    {
     "text": "$\\dfrac{2x}{y}-\\dfrac{x^{4}}{y^{2}}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。把 $y'=\\dfrac{x^{2}}{y}$ 中的 $y$ 当成了常数，漏掉对 $\\dfrac{1}{y}$ 求导产生的 $-\\dfrac{x^{2}y'}{y^{2}}$ 这一项。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。两边对 $x$ 求导得 $6x^{2}-6yy'=0$，即 $y'=\\dfrac{x^{2}}{y}$；再用商法则 $y''=\\dfrac{2xy-x^{2}y'}{y^{2}}$，回代 $y'$ 得 $\\dfrac{2x}{y}-\\dfrac{x^{4}}{y^{3}}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。商法则的分子应是 $(2x)\\cdot y-x^{2}\\cdot y'$；写成加号等于把 $y$ 在分母上求导的符号弄反。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。回代后应为 $-\\dfrac{x^{2}\\cdot(x^{2}/y)}{y^{2}}=-\\dfrac{x^{4}}{y^{3}}$，这里分母少算了一次 $y$。</span></div>"
  },
  {
   "id": "ch03-q19",
   "ch": "ch03",
   "type": "mcq",
   "difficulty": 2,
   "kp": "3.8 相关变化率", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "长 $10$ m 的梯子斜靠在竖直墙面上，底端沿地面以 $1$ m/s 的速率离开墙面向外滑动。当底端距墙 $6$ m 时，顶端沿墙面下滑的速率是？",
   "options": [
    {
     "text": "$\\dfrac{3}{4}$ m/s",
     "correct": true
    },
    {
     "text": "$1$ m/s",
     "correct": false
    },
    {
     "text": "$\\dfrac{4}{3}$ m/s",
     "correct": false
    },
    {
     "text": "$\\dfrac{3}{2}$ m/s",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。由 $x^{2}+y^{2}=100$ 对 $t$ 求导得 $2x\\dfrac{dx}{dt}+2y\\dfrac{dy}{dt}=0$，故下滑速率 $\\left|\\dfrac{dy}{dt}\\right|=\\dfrac{x}{y}\\dfrac{dx}{dt}$；$x=6$ 时 $y=8$，得 $\\dfrac{6}{8}\\times 1=\\dfrac{3}{4}$ m/s。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。直接把底端的速率当成了顶端的速率；两端的速率由 $x^{2}+y^{2}=100$ 联系，一般并不相等。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。把关系式解成了 $\\left|\\dfrac{dy}{dt}\\right|=\\dfrac{y}{x}\\dfrac{dx}{dt}$（商写反），代入得 $\\dfrac{8}{6}=\\dfrac{4}{3}$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。把梯长误当成 $x+y=10$，于是取 $y=4$；实际由 $x^{2}+y^{2}=100$ 得 $y=8$，比值是 $\\dfrac{x}{y}=\\dfrac{6}{8}$。</span></div>"
  },
  {
   "id": "ch03-q20",
   "ch": "ch03",
   "type": "mcq",
   "difficulty": 2,
   "kp": "3.9 线性化与微分", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "用 $f(x)=\\sqrt[3]{x}$ 在 $a=8$ 处的线性化估计 $\\sqrt[3]{8.06}$，结果是？",
   "options": [
    {
     "text": "$1.995$",
     "correct": false
    },
    {
     "text": "$2.01$",
     "correct": false
    },
    {
     "text": "$2.005$",
     "correct": true
    },
    {
     "text": "$2.06$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。把 $\\Delta x=+0.06$ 当成 $-0.06$ 代入，方向弄反了：$8.06\\gt 8$，估计值应大于 $f(8)=2$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。把 $f'(8)$ 算成了 $\\dfrac{1}{3}\\cdot 8^{-1/3}=\\dfrac{1}{6}$（指数取了 $-1/3$，应为 $-2/3$），于是得 $2+\\dfrac{0.06}{6}=2.01$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$f'(x)=\\dfrac{1}{3}x^{-2/3}$，$f(8)=2$，$f'(8)=\\dfrac{1}{3}\\cdot\\dfrac{1}{4}=\\dfrac{1}{12}$，故 $L(x)=2+\\dfrac{1}{12}(x-8)$，$L(8.06)=2+\\dfrac{0.06}{12}=2.005$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。漏乘导数，直接写成 $2+(x-8)=2.06$，相当于把斜率当成了 $1$。</span></div>"
  },
  {
   "id": "ch04-q1",
   "ch": "ch04",
   "type": "mcq",
   "difficulty": 1,
   "kp": "4.1 闭区间上函数的极值", "tags": ["exam","concept"],
   "scope": "midterm",
   "stem": "关于闭区间上的极值定理（定理 1），下列说法正确的是？",
   "options": [
    {
     "text": "$f$ 在闭区间 $[a,b]$ 上连续，则必取到最大值 $M$ 与最小值 $m$",
     "correct": true
    },
    {
     "text": "$f$ 在开区间 $(a,b)$ 上连续，则必取到最大值与最小值",
     "correct": false
    },
    {
     "text": "只要 $f$ 有界，就必在 $[a,b]$ 上取到最大值与最小值",
     "correct": false
    },
    {
     "text": "$f$ 在 $[a,b]$ 上有定义，则必取到最大值与最小值",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。极值定理：$f$ 在闭区间 $[a,b]$ 上连续，则必在该区间上取到最大值 $M$ 与最小值 $m$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。开区间不满足定理的「闭」条件，$y=x$ 在 $(0,1)$ 上就取不到最值。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。有界不等于取到，如 $y=x$ 在 $(-1,1)$ 上有界，却既无最大值也无最小值。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。仅有定义不够，还需连续：把 $y=x$ 在 $x=1$ 处强行定义为 $0$，函数在 $[0,1]$ 上因这点不连续而无最大值。</span></div>"
  },
  {
   "id": "ch04-q2",
   "ch": "ch04",
   "type": "mcq",
   "difficulty": 2,
   "kp": "4.1 闭区间上函数的极值", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "函数 $f(x)=x^{2/3}$ 在 $[-2,3]$ 上的绝对最小值及取到位置是？",
   "options": [
    {
     "text": "$\\sqrt[3]{4}$，在 $x=-2$ 处取到",
     "correct": false
    },
    {
     "text": "$\\sqrt[3]{9}$，在 $x=3$ 处取到",
     "correct": false
    },
    {
     "text": "不存在，因为 $f'(0)$ 不存在",
     "correct": false
    },
    {
     "text": "$0$，在 $x=0$ 处取到",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\sqrt[3]{4}=f(-2)$ 只是一个端点值，比 $f(0)=0$ 大，不是最小值。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\sqrt[3]{9}=f(3)$ 是本题的绝对最大值，不是最小值。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$f'(0)$ 不存在恰恰使 $x=0$ 成为临界点；极值定理保证连续函数在闭区间上必取到最值。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$f'(x)=\\frac{2}{3}x^{-1/3}$ 无零点，$x=0$ 处 $f'$ 不存在，仍是临界点；三者中 $f(0)=0$ 最小。</span></div>"
  },
  {
   "id": "ch04-q3",
   "ch": "ch04",
   "type": "mcq",
   "difficulty": 1,
   "kp": "4.2 中值定理", "tags": ["exam","concept"],
   "scope": "midterm",
   "stem": "对 $f(x)=x^{2}$ 在 $[0,2]$ 上用中值定理，定理保证存在的 $c$ 是？",
   "options": [
    {
     "text": "$c=\\frac{1}{2}$",
     "correct": false
    },
    {
     "text": "$c=1$",
     "correct": true
    },
    {
     "text": "$c=2$",
     "correct": false
    },
    {
     "text": "$c=\\sqrt{2}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac{1}{2}$ 是 $f'(c)=\\frac{1}{2}$ 的解，但本题平均变化率是 $2$，不是 $\\frac{1}{2}$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。平均变化率 $\\frac{f(2)-f(0)}{2-0}=\\frac{4-0}{2}=2$，令 $f'(c)=2c=2$ 得 $c=1\\in(0,2)$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$c$ 必须落在开区间 $(0,2)$ 内，取到端点 $x=2$ 不符合定理结论。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\sqrt{2}$ 是令 $f(c)=2$ 解出的点，把「函数值等于平均变化率」与「导数等于平均变化率」混了。</span></div>"
  },
  {
   "id": "ch04-q4",
   "ch": "ch04",
   "type": "mcq",
   "difficulty": 2,
   "kp": "4.2 中值定理", "tags": ["exam","concept"],
   "scope": "midterm",
   "stem": "函数 $f(x)=x^{3}-x$ 在 $[-1,1]$ 上满足 Rolle 定理条件，定理保证存在的 $c$ 是？",
   "options": [
    {
     "text": "$c=\\frac{1}{2}$",
     "correct": false
    },
    {
     "text": "$c=\\pm1$",
     "correct": false
    },
    {
     "text": "$c=\\pm\\frac{\\sqrt{3}}{3}$",
     "correct": true
    },
    {
     "text": "$c=0$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$f'\\left(\\frac{1}{2}\\right)=\\frac{3}{4}-1=-\\frac{1}{4}\\ne0$，该点导数不为零。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\pm1$ 是区间端点，而定理保证的 $c$ 必须落在开区间 $(-1,1)$ 内。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$f(-1)=f(1)=0$ 且 $f$ 在 $[-1,1]$ 连续、$(-1,1)$ 可导；由 $f'(x)=3x^{2}-1=0$ 得 $x=\\pm\\frac{\\sqrt{3}}{3}$，均在开区间内。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$f'(0)=-1\\ne0$，该点导数值不为零，不满足定理的结论。</span></div>"
  },
  {
   "id": "ch04-q5",
   "ch": "ch04",
   "type": "mcq",
   "difficulty": 1,
   "kp": "4.3 单调性与一阶导数判别法", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "设 $f$ 在 $x=1$ 处连续，在 $(0,1)$ 上 $f'(x)$ 为负，在 $(1,2)$ 上 $f'(x)$ 为正，则 $x=1$ 是 $f$ 的？",
   "options": [
    {
     "text": "无法判断，需要 $f''(1)$ 的符号",
     "correct": false
    },
    {
     "text": "局部极大值点",
     "correct": false
    },
    {
     "text": "不是极值点",
     "correct": false
    },
    {
     "text": "局部极小值点",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。一阶导数判别法只看 $f'$ 在临界点两侧的符号变化，$f'(1)$ 不存在也照样适用，无须 $f''(1)$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。局部极大对应 $f'$ 由正变负，本题符号变化方向正好相反。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$f'$ 在 $x=1$ 两侧变号，故 $x=1$ 是极值点；只有不变号才不是极值点。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$f'$ 从左到右由负变正，一阶导数判别法给出 $x=1$ 处取局部极小。</span></div>"
  },
  {
   "id": "ch04-q6",
   "ch": "ch04",
   "type": "mcq",
   "difficulty": 3,
   "kp": "4.3 单调性与一阶导数判别法", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "函数 $f(x)=x^{1/3}(x-4)$（其中 $f'(x)=\\frac{4(x-1)}{3x^{2/3}}$）的临界点与极值情况是？",
   "options": [
    {
     "text": "$x=1$ 是唯一临界点，$x=1$ 处取极小值",
     "correct": false
    },
    {
     "text": "$x=0$ 是唯一临界点，$x=0$ 处取极大值",
     "correct": false
    },
    {
     "text": "$x=0$ 与 $x=1$ 都是临界点，但只有 $x=1$ 是极值点",
     "correct": true
    },
    {
     "text": "$x=0$ 与 $x=1$ 都是临界点，且两处都取极小值",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$x=0$ 处 $f'$ 不存在，按定义（内部点且 $f'$ 不存在）它也是临界点，不能漏掉。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$x=1$ 处 $f'=0$ 且左负右正，取极小值的是 $x=1$；$x=0$ 处 $f'$ 不变号。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$f'(1)=0$，$f'(0)$ 不存在，两点都是临界点；$f'$ 在 $x=0$ 两侧同为负、不变号，故 $x=0$ 不是极值点。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$x=0$ 两侧 $f'$ 都是负的，没有出现极小所需的「由负变正」。</span></div>"
  },
  {
   "id": "ch04-q7",
   "ch": "ch04",
   "type": "mcq",
   "difficulty": 2,
   "kp": "4.4 凹凸性与曲线作图", "tags": ["exam","concept"],
   "scope": "midterm",
   "stem": "设 $f(x)=x^{4}$，关于点 $(0,0)$ 的结论正确的是？",
   "options": [
    {
     "text": "无法判断，因为 $f''(0)$ 不存在",
     "correct": false
    },
    {
     "text": "是拐点，因为 $f'(0)=0$",
     "correct": false
    },
    {
     "text": "不是拐点，因为 $f''$ 在 $x=0$ 两侧不变号",
     "correct": true
    },
    {
     "text": "是拐点，因为 $f''(0)=0$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$f''(x)=12x^{2}$ 在 $x=0$ 处存在且等于 $0$；$f''$ 不存在的拐点见 $y=x^{1/3}$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$f'(0)=0$ 只说明 $x=0$ 是驻点，与凹凸性是否改变无关。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$f''(x)=12x^{2}$ 在 $x=0$ 两侧都为正，凹凸性没有改变，故 $(0,0)$ 不是拐点（该处是极小值点）。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$f''(c)=0$ 只是拐点的必要条件而非充分条件，还必须验证两侧 $f''$ 是否变号。</span></div>"
  },
  {
   "id": "ch04-q8",
   "ch": "ch04",
   "type": "mcq",
   "difficulty": 2,
   "kp": "4.5 应用最优化", "tags": ["exam","concept"],
   "scope": "midterm",
   "stem": "用边长 $a$ 的正方形纸板四角各剪去边长 $x$ 的小正方形，折成无盖方盒，体积 $V(x)=x(a-2x)^{2}$，其定义域是？",
   "options": [
    {
     "text": "$x>0$",
     "correct": false
    },
    {
     "text": "$0\\le x\\le\\frac{a}{2}$",
     "correct": true
    },
    {
     "text": "$0\\le x\\le a$",
     "correct": false
    },
    {
     "text": "$0\\le x\\le\\frac{a}{6}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。开区间 $x>0$ 丢掉了端点，无法按闭区间三步法直接比较端点值。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。由 $x\\ge0$ 与底边 $a-2x\\ge0$ 得 $0\\le x\\le\\frac{a}{2}$；端点对应退化盒，比较最值时也要代入。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$x$ 超过 $\\frac{a}{2}$ 后底边 $a-2x$ 变负，几何上不成立。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{a}{6}$ 是令 $V'(x)=(a-2x)(a-6x)=0$ 得到的临界点，不是定义域的上界。</span></div>"
  },
  {
   "id": "ch04-q9",
   "ch": "ch04",
   "type": "mcq",
   "difficulty": 1,
   "kp": "4.6 牛顿法", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "用牛顿法解方程 $x^{3}-x-1=0$，取 $x_0=1$，则 $x_1$ 等于？",
   "options": [
    {
     "text": "$0.5$",
     "correct": false
    },
    {
     "text": "$1.5$",
     "correct": true
    },
    {
     "text": "$1.25$",
     "correct": false
    },
    {
     "text": "$2$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$0.5=1+\\frac{-1}{2}$，把迭代公式 $x_n-\\frac{f}{f'}$ 中的减号写成了加号。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$f(1)=-1$，由 $f'(x)=3x^{2}-1$ 得 $f'(1)=2$，故 $x_1=1-\\frac{-1}{2}=1.5$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$1.25$ 相当于分母取成 $4$，但 $f'(1)=3\\cdot1-1=2$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$2$ 相当于 $x_0+1$，完全没有用到 $f(1)=-1$ 与 $f'(1)=2$ 的比值。</span></div>"
  },
  {
   "id": "ch04-q10",
   "ch": "ch04",
   "type": "mcq",
   "difficulty": 2,
   "kp": "4.7 反导数", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "已知 $F'(x)=x^{1/3}-2\\sin 2x$ 且 $F(0)=1$，则 $F(x)$ 等于？",
   "options": [
    {
     "text": "$\\frac{3}{4}x^{4/3}+\\cos 2x+1$",
     "correct": false
    },
    {
     "text": "$\\frac{4}{3}x^{4/3}+\\cos 2x$",
     "correct": false
    },
    {
     "text": "$\\frac{3}{4}x^{4/3}-\\cos 2x+2$",
     "correct": false
    },
    {
     "text": "$\\frac{3}{4}x^{4/3}+\\cos 2x$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。代入得 $F(0)=1+1=2$，不满足初始条件 $F(0)=1$，说明常数 $C$ 应为 $0$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\int x^{1/3}dx$ 的系数是 $\\frac{1}{4/3}=\\frac{3}{4}$，写成 $\\frac{4}{3}$ 是把系数取了倒数。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$(-\\cos 2x)'=2\\sin 2x$，求导得 $x^{1/3}+2\\sin 2x$，与题给的 $-2\\sin 2x$ 符号相反。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$\\int x^{1/3}dx=\\frac{3}{4}x^{4/3}$，$\\int\\sin 2x\\,dx=-\\frac{1}{2}\\cos 2x$，得 $F=\\frac{3}{4}x^{4/3}+\\cos 2x+C$，由 $F(0)=1$ 定出 $C=0$。</span></div>"
  },
  {
   "id": "ch04-q11",
   "ch": "ch04",
   "type": "mcq",
   "difficulty": 2,
   "kp": "4.1 闭区间上函数的极值", "tags": ["exam","concept"],
   "scope": "midterm",
   "stem": "关于 Fermat 定理（若 $f$ 在定义域的内部点 $c$ 取局部极值且 $f'(c)$ 存在，则 $f'(c)=0$），下列说法正确的是？",
   "options": [
    {
     "text": "若 $f'(c)=0$，则 $f$ 在 $c$ 处必取局部极值",
     "correct": false
    },
    {
     "text": "若 $f$ 在内部点 $c$ 取局部极值，则必有 $f'(c)=0$（无须假设 $f'(c)$ 存在）",
     "correct": false
    },
    {
     "text": "若 $f$ 在内部点 $c$ 取局部极值且 $f'(c)$ 存在，则 $f'(c)=0$",
     "correct": true
    },
    {
     "text": "若 $f'(c)$ 不存在，则 $f$ 在 $c$ 处必取局部极值",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。反例 $f(x)=x^{3}$：$f'(0)=0$，但 $f'$ 在 $x=0$ 两侧都为正、不变号，$x=0$ 不是极值点。$f'(c)=0$ 只是极值的必要条件，不是充分条件。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。反例 $f(x)=|x|$：$x=0$ 是极小值点，但 $f'(0)$ 不存在。Fermat 定理的结论以「$f'(c)$ 存在」为前提，去掉这个前提结论就不成立。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。这正是 Fermat 定理：$c$ 是定义域的内部点、$f$ 在 $c$ 取局部极值、$f'(c)$ 存在，三者齐备才有 $f'(c)=0$。它把「找局部极值」的范围压缩为临界点（$f'=0$ 的点与 $f'$ 不存在的点）再加端点。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。反例 $f(x)=x^{1/3}$：$f'(0)$ 不存在，但 $f(0)=0$ 两侧的函数值一负一正，$x=0$ 不是极值点（该点是竖直切线型拐点）。</span></div>"
  },
  {
   "id": "ch04-q12",
   "ch": "ch04",
   "type": "mcq",
   "difficulty": 1,
   "kp": "4.2 中值定理", "tags": ["exam","concept"],
   "scope": "midterm",
   "stem": "设 $f$ 与 $g$ 都在开区间 $(a,b)$ 上可导，且对一切 $x\\in(a,b)$ 都有 $f'(x)=g'(x)$。则下列结论正确的是？",
   "options": [
    {
     "text": "在 $(a,b)$ 上必有 $f(x)=g(x)$",
     "correct": false
    },
    {
     "text": "在 $(a,b)$ 上必有 $f(x)=g(x)+C$，其中 $C$ 为某个常数",
     "correct": true
    },
    {
     "text": "只能断定 $f$ 与 $g$ 在 $(a,b)$ 上同增同减，无法确定 $f-g$ 的取值",
     "correct": false
    },
    {
     "text": "还需补充条件 $f(a)=g(a)$，才能断定 $f-g$ 在 $(a,b)$ 上为常数",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。导函数相同只说明两者相差一个常数，例如 $f(x)=x^{2}$ 与 $g(x)=x^{2}+5$ 的导数都是 $2x$，但函数值并不相等。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。这是中值定理的推论 2：令 $h=f-g$，则 $h'=0$ 在 $(a,b)$ 上处处成立，由推论 1 得 $h\\equiv C$，即 $f(x)=g(x)+C$；该结论对无限区间同样成立，也正是「反导数族 $F(x)+C$」的理论依据。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。由 $f'=g'$ 可以完全确定 $f-g$ 是一个常数（推论 2），这比「同增同减」强得多，不需要任何函数值信息。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$f-g$ 为常数由 $f'=g'$ 直接得到，不需要端点值条件；$(a,b)$ 是开区间时 $f,g$ 甚至可以在端点处没有定义，这个补充条件既非必要也可能无意义。</span></div>"
  },
  {
   "id": "ch04-q13",
   "ch": "ch04",
   "type": "mcq",
   "difficulty": 3,
   "kp": "4.2 中值定理", "tags": ["exam","concept","trap"],
   "scope": "midterm",
   "stem": "要证明方程 $x^{3}+x-1=0$ 在 $\\mathbb{R}$ 上恰有一个实根，下列论证正确的是？",
   "options": [
    {
     "text": "由 $f'(x)=3x^{2}+1>0$ 知 $f$ 严格递增，故 $f(x)=0$ 恰有一个实根",
     "correct": false
    },
    {
     "text": "因为 $f(-1)=-3<0$、$f(1)=1>0$ 且 $f$ 连续，所以由 Rolle 定理，在 $(-1,1)$ 内存在 $c$ 使 $f'(c)=0$，该 $c$ 就是方程的唯一实根",
     "correct": false
    },
    {
     "text": "因为 $f'(x)=3x^{2}+1$ 在 $\\mathbb{R}$ 上没有零点，所以 $f(x)=0$ 没有实根",
     "correct": false
    },
    {
     "text": "由 $f(0)=-1<0<f(1)=1$ 与介值定理得 $(0,1)$ 内有根；又 $f'(x)=3x^{2}+1>0$ 说明 $f$ 严格递增，故根唯一，方程恰有一个实根",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$f'>0$ 只保证「至多一个根」，不能保证根存在：例如 $f(x)=e^{x}$ 也严格递增，却没有任何零点。必须先用介值定理证明存在性，这一步不能省。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。Rolle 定理要求 $f(a)=f(b)$，而这里 $f(-1)=-3\\ne f(1)=1$，条件不满足，不能强行使用；况且定理给出的是 $f'$ 的零点，并不是 $f$ 的零点，而 $3x^{2}+1=0$ 在实数范围内根本无解。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$f'$ 没有零点只说明 $f$ 严格单调，与 $f$ 本身有没有零点无关；$f(0)=-1$、$f(1)=1$ 已经表明 $(0,1)$ 内必有根，把导函数的零点与函数的零点混为一谈是典型错误。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。存在性：$f$ 在 $[0,1]$ 上连续且 $f(0)f(1)<0$，由介值定理得 $(0,1)$ 内有根；唯一性：$f'(x)=3x^{2}+1>0$ 于 $\\mathbb{R}$ 成立，$f$ 严格递增，若有两个不同的根 $x_1<x_2$，则与递增性矛盾。故恰有一个实根。</span></div>"
  },
  {
   "id": "ch04-q14",
   "ch": "ch04",
   "type": "mcq",
   "difficulty": 2,
   "kp": "4.3 单调性与一阶导数判别法", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "设 $f$ 处处可导，且 $f'(x)=(x-1)^{2}(x+2)$。则 $f$ 的极值情况是？",
   "options": [
    {
     "text": "$x=-2$ 处取局部极小值；$x=1$ 处 $f'(1)=0$ 但 $f'$ 不变号，不取极值",
     "correct": true
    },
    {
     "text": "$x=-2$ 处取局部极大值；$x=1$ 处取局部极小值",
     "correct": false
    },
    {
     "text": "$x=-2$ 处取局部极小值；$x=1$ 处取局部极大值",
     "correct": false
    },
    {
     "text": "$f$ 在 $\\mathbb{R}$ 上单调递增，没有极值点",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$(x-1)^{2}\\ge0$，故 $f'$ 的符号由 $x+2$ 决定：$x<-2$ 时 $f'<0$，$-2<x<1$ 与 $x>1$ 时 $f'>0$。$f'$ 在 $x=-2$ 处由负变正，一阶导数判别法给出局部极小；$x=1$ 处 $f'$ 两侧同为正，不变号，故不是极值点。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$x=-2$ 两侧 $f'$ 是「由负变正」，对应局部极小而不是极大，符号判反了；$x=1$ 处 $f'$ 不变号，也不能是极值点。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$x=-2$ 处确为极小（$f'$ 负变正）。$x=1$ 虽满足 $f'(1)=0$，但因子 $(x-1)^{2}$ 使其两侧 $f'$ 都为正，按一阶导数判别法「不变号则不是极值点」。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。漏掉了 $x<-2$ 时 $x+2<0$ 使 $f'<0$，$f$ 在 $(-\\infty,-2)$ 上其实是递减的；$f$ 只在 $[-2,\\infty)$ 上递增。</span></div>"
  },
  {
   "id": "ch04-q15",
   "ch": "ch04",
   "type": "mcq",
   "difficulty": 1,
   "kp": "4.4 凹凸性与曲线作图", "tags": ["exam","concept"],
   "scope": "midterm",
   "stem": "设 $f$ 在含 $x=c$ 的开区间上二阶可导，且 $f'(c)=0$、$f''(c)=0$。关于 $x=c$ 处是否取极值，下列结论正确的是？",
   "options": [
    {
     "text": "一定取局部极大值",
     "correct": false
    },
    {
     "text": "一定不取极值，因为 $f'(c)=0$ 且 $f''(c)=0$ 说明 $(c,f(c))$ 是拐点",
     "correct": false
    },
    {
     "text": "仅凭这两个条件无法判定，须改用一阶导数判别法",
     "correct": true
    },
    {
     "text": "一定取局部极小值",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。反例 $f(x)=x^{4}$：$f'(0)=f''(0)=0$，但 $x=0$ 是局部极小值点，不是极大。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。反例 $f(x)=x^{4}$：$f''(0)=0$ 却不是拐点（$f''$ 在 $0$ 两侧都为正，凹凸性没变），且 $x=0$ 处确实取到极小值。$f''(c)=0$ 只是拐点的必要条件，不能反过来用。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$f'(c)=0$ 且 $f''(c)=0$ 时二阶导数判别法失效，三种情形都可能：$x^{4}$ 在 $0$ 处取极小、$-x^{4}$ 在 $0$ 处取极大、$x^{3}$ 在 $0$ 处不取极值。只能回到一阶导数判别法，看 $f'$ 在 $c$ 两侧是否变号。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。反例 $f(x)=-x^{4}$：$f'(0)=f''(0)=0$，但 $x=0$ 处取局部极大值。$f''(c)=0$ 既不落在 $f''>0$ 也不落在 $f''<0$，不能当作判别法使用。</span></div>"
  },
  {
   "id": "ch04-q16",
   "ch": "ch04",
   "type": "mcq",
   "difficulty": 2,
   "kp": "4.4 凹凸性与曲线作图", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "曲线 $f(x)=x^{3}-3x^{2}+1$ 的凹凸区间与拐点是？",
   "options": [
    {
     "text": "$(-\\infty,1)$ 上凹向下，$(1,\\infty)$ 上凹向上，拐点为 $(1,-1)$",
     "correct": true
    },
    {
     "text": "$(-\\infty,1)$ 上凹向上，$(1,\\infty)$ 上凹向下，拐点为 $(1,-1)$",
     "correct": false
    },
    {
     "text": "$(-\\infty,1)$ 上凹向下，$(1,\\infty)$ 上凹向上，拐点为 $(1,0)$",
     "correct": false
    },
    {
     "text": "$(-\\infty,2)$ 上凹向下，$(2,\\infty)$ 上凹向上，拐点为 $(2,-3)$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$f'(x)=3x^{2}-6x$，$f''(x)=6x-6=6(x-1)$。$x<1$ 时 $f''<0$ 故凹向下，$x>1$ 时 $f''>0$ 故凹向上，$f''$ 在 $x=1$ 两侧变号；纵坐标取 $f(1)=1-3+1=-1$，故拐点为 $(1,-1)$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。凹凸方向判反了：$x<1$ 时 $f''(x)=6(x-1)<0$，对应的是「凹向下」；$x>1$ 时 $f''>0$ 对应「凹向上」。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。拐点横坐标 $x=1$ 正确，但纵坐标必须代入原函数：$f(1)=1-3+1=-1$，不是 $0$（把 $f''(1)=0$ 里的 $0$ 当成了纵坐标）。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$x=2$ 是 $f'(x)=3x(x-2)=0$ 的驻点，即局部极小值点 $f(2)=-3$，不是拐点；凹凸性只看 $f''(x)=6x-6$ 的零点 $x=1$。</span></div>"
  },
  {
   "id": "ch04-q17",
   "ch": "ch04",
   "type": "mcq",
   "difficulty": 3,
   "kp": "4.5 应用最优化", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "在半径为 $R$ 的球内作一个内接正圆柱（轴线过球心）。当圆柱体积最大时，它的高 $h$ 与底面半径 $r$ 分别是？",
   "options": [
    {
     "text": "$h=\\frac{\\sqrt{3}}{3}R$，$r=\\frac{\\sqrt{6}}{3}R$",
     "correct": false
    },
    {
     "text": "$h=\\frac{\\sqrt{6}}{3}R$，$r=\\frac{2\\sqrt{3}}{3}R$",
     "correct": false
    },
    {
     "text": "$h=\\frac{2\\sqrt{3}}{3}R$，$r=\\frac{\\sqrt{3}}{3}R$",
     "correct": false
    },
    {
     "text": "$h=\\frac{2\\sqrt{3}}{3}R$，$r=\\frac{\\sqrt{6}}{3}R$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。这是把约束写成 $r^{2}+h^{2}=R^{2}$（漏掉「球心到底面圆心的距离是 $h/2$」）的结果：此时 $V(h)=\\pi(R^{2}-h^{2})h$，$V'(h)=\\pi(R^{2}-3h^{2})=0$ 给出 $h=\\frac{\\sqrt{3}}{3}R$，与正确答案不符。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。把 $h$ 与 $r$ 的最优值互换了：正确结果是高较长、半径较短，即 $h=\\frac{2\\sqrt{3}}{3}R$、$r=\\frac{\\sqrt{6}}{3}R$。而且这组值还破坏了约束 $r^{2}+\\frac{h^{2}}{4}=R^{2}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$h$ 正确，但 $r$ 取成了 $\\frac{h}{2}=\\frac{\\sqrt{3}}{3}R$，这是把「等体积圆柱罐表面积最小时 $h=2r$」的结论错搬过来；本题最优时 $h=\\sqrt{2}\\,r$，$r=\\sqrt{R^{2}-\\frac{h^{2}}{4}}=\\frac{\\sqrt{6}}{3}R$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。由 $r^{2}+\\left(\\frac{h}{2}\\right)^{2}=R^{2}$ 得 $r^{2}=R^{2}-\\frac{h^{2}}{4}$，于是 $V(h)=\\pi\\left(R^{2}-\\frac{h^{2}}{4}\\right)h=\\pi R^{2}h-\\frac{\\pi}{4}h^{3}$，$0\\le h\\le 2R$。令 $V'(h)=\\pi R^{2}-\\frac{3\\pi}{4}h^{2}=0$ 得 $h^{2}=\\frac{4R^{2}}{3}$，即 $h=\\frac{2\\sqrt{3}}{3}R$；此时 $r^{2}=R^{2}-\\frac{R^{2}}{3}=\\frac{2R^{2}}{3}$，$r=\\frac{\\sqrt{6}}{3}R$。端点 $h=0$ 与 $h=2R$ 处 $V=0$，故该临界点给出最大体积。</span></div>"
  },
  {
   "id": "ch04-q18",
   "ch": "ch04",
   "type": "mcq",
   "difficulty": 2,
   "kp": "4.5 应用最优化", "tags": ["exam","output"],
   "scope": "midterm",
   "stem": "要制造一个容积为 $V$ 的带盖圆柱形罐，使其表面积最小，则底面半径 $r$ 与高 $h$ 是？",
   "options": [
    {
     "text": "$r=\\sqrt[3]{\\frac{V}{\\pi}}$，$h=r$",
     "correct": false
    },
    {
     "text": "$r=\\sqrt[3]{\\frac{V}{2\\pi}}$，$h=2r$",
     "correct": true
    },
    {
     "text": "$r=\\sqrt[3]{\\frac{V}{2\\pi}}$，$h=r$",
     "correct": false
    },
    {
     "text": "该问题在开区间 $r>0$ 上没有最小值，因为端点无法代入比较",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。这是把表面积算成 $A=\\pi r^{2}+2\\pi rh$（少算了一个底面）的结果：由 $h=\\frac{V}{\\pi r^{2}}$ 得 $A(r)=\\pi r^{2}+\\frac{2V}{r}$，$A'(r)=2\\pi r-\\frac{2V}{r^{2}}=0$ 给出 $r^{3}=\\frac{V}{\\pi}$。带盖罐应有上下两个底面，$A=2\\pi r^{2}+2\\pi rh$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。由 $h=\\frac{V}{\\pi r^{2}}$ 得 $A(r)=2\\pi r^{2}+\\frac{2V}{r}$（$r>0$），令 $A'(r)=4\\pi r-\\frac{2V}{r^{2}}=0$ 得 $r^{3}=\\frac{V}{2\\pi}$，即 $r=\\sqrt[3]{\\frac{V}{2\\pi}}$；代回 $h=\\frac{V}{\\pi r^{2}}=2\\sqrt[3]{\\frac{V}{2\\pi}}=2r$。又 $A''(r)=4\\pi+\\frac{4V}{r^{3}}>0$，唯一临界点即全局最小点。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$r$ 求对了，但最优关系是 $h=2r$：把 $r=\\sqrt[3]{\\frac{V}{2\\pi}}$ 代入 $h=\\frac{V}{\\pi r^{2}}$ 得 $h=2\\sqrt[3]{\\frac{V}{2\\pi}}=2r$。$h=r$ 只是「形状接近正方体」的直觉，不是 $A'(r)=0$ 的解。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$r>0$ 是开区间，端点值确实无从比较，但可以用二阶导数（$A''>0$ 说明 $A$ 严格凸）或单调性论证该唯一临界点就是最小值点，最小值是存在的，不能说「没有最小值」。</span></div>"
  },
  {
   "id": "ch04-q19",
   "ch": "ch04",
   "type": "mcq",
   "difficulty": 2,
   "kp": "4.6 牛顿法", "tags": ["exam","concept"],
   "scope": "midterm",
   "stem": "关于用牛顿法求方程 $f(x)=0$ 的近似根，下列说法正确的是？",
   "options": [
    {
     "text": "迭代公式是 $x_{n+1}=x_n+\\frac{f(x_n)}{f'(x_n)}$，因此每迭代一步都会更接近零点",
     "correct": false
    },
    {
     "text": "只要初始值 $x_0$ 取在根所在的区间内，就一定能收敛到该区间内的那个根",
     "correct": false
    },
    {
     "text": "若某步出现 $f'(x_n)=0$，则 $x_{n+1}$ 无定义、迭代中断，必须另换初始值",
     "correct": true
    },
    {
     "text": "为稳妥起见应把 $x_0$ 取为根所在区间的端点，此时介值定理可保证迭代收敛",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。迭代公式是 $x_{n+1}=x_n-\\frac{f(x_n)}{f'(x_n)}$，减号写成加号相当于沿切线反向走；而且「每步都更接近零点」也不成立，序列可能震荡甚至发散。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$x_0$ 落在某个根附近并不保证收敛到它。例如 $f(x)=x^{3}-x$ 取 $x_0=0.5$：$f(0.5)=-0.375$、$f'(0.5)=-0.25$，得 $x_1=0.5-1.5=-1$，一步就跳到了远处的根 $-1$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。迭代公式中 $f'(x_n)$ 出现在分母，某步 $f'(x_n)=0$ 时该步无定义，只能更换初始值。此外还要留意：$x_0$ 太远会收敛到别的根或震荡不收敛；根附近曲线极平坦（如 $f(x)=(x-1)^{40}$）时，判据 $|x_{n+1}-x_n|$ 虽已很小，停机点却仍离根很远。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。介值定理只保证 $f$ 在区间内有零点，与牛顿法是否收敛毫无关系；把端点取作 $x_0$ 既无必要，还可能碰上 $f'(x_0)=0$ 使公式直接失效。</span></div>"
  },
  {
   "id": "ch04-q20",
   "ch": "ch04",
   "type": "mcq",
   "difficulty": 1,
   "kp": "4.7 反导数", "tags": ["exam","output","trap"],
   "scope": "midterm",
   "stem": "质点沿直线运动，其加速度 $a(t)=6t$，且 $v(0)=1$、$s(0)=2$（$s$ 为位置）。则 $s(t)$ 等于？",
   "options": [
    {
     "text": "$t^{3}+t+2$",
     "correct": true
    },
    {
     "text": "$3t^{3}+t+2$",
     "correct": false
    },
    {
     "text": "$t^{3}+t$",
     "correct": false
    },
    {
     "text": "$3t^{2}+t+2$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$v(t)=\\int 6t\\,dt=3t^{2}+C_1$，由 $v(0)=1$ 得 $C_1=1$，即 $v(t)=3t^{2}+1$；再积分得 $s(t)=\\int(3t^{2}+1)\\,dt=t^{3}+t+C_2$，由 $s(0)=2$ 得 $C_2=2$。校验：$s'=3t^{2}+1=v$，$s''=6t=a$，两个初始条件都满足。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\int 3t^{2}\\,dt=\\frac{3t^{3}}{3}=t^{3}$，写成 $3t^{3}$ 是漏除了系数 $3$；该函数求导得 $9t^{2}+1$，并不等于速度 $3t^{2}+1$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。逐次反导有几个初始条件就要定几个常数：$v(0)=1$ 定出 $C_1=1$，$s(0)=2$ 还要定出 $C_2=2$。漏掉 $C_2$ 会使 $s(0)=0\\ne2$，不满足初始条件。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。它的导数是 $6t+1$，既不等于 $v(t)=3t^{2}+1$，也不等于加速度 $6t$。错在把 $v(t)=3t^{2}+1$ 再积分时，对 $3t^{2}$ 这一项忘记降次（直接抄成 $3t^{2}$），只把常数项 $1$ 积成了 $t$；$\\int 3t^{2}\\,dt$ 应为 $t^{3}$。</span></div>"
  },
  {
   "id": "ch05-q1",
   "ch": "ch05",
   "type": "mcq",
   "difficulty": 1,
   "kp": "5.1 面积与有限和估算", "tags": ["exam","output"],
   "scope": "both",
   "stem": "用中点法则（$n=2$，每个子区间取中点）估算 $\\int_0^2 x^2\\,dx$，结果是",
   "options": [
    {
     "text": "$1$",
     "correct": false
    },
    {
     "text": "$5$",
     "correct": false
    },
    {
     "text": "$2.5$",
     "correct": true
    },
    {
     "text": "$\\frac{8}{3}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$1$ 是取左端点的黎曼和 $f(0)\\cdot1+f(1)\\cdot1=0+1$，明显偏低。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$5$ 是取右端点的黎曼和 $f(1)+f(2)=1+4$，明显偏高。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$\\Delta x=1$，中点为 $0.5$ 与 $1.5$，和为 $0.25+2.25=2.5$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac83$ 是定积分的精确值，不是 $n=2$ 时中点法则的估算值。</span></div>"
  },
  {
   "id": "ch05-q2",
   "ch": "ch05",
   "type": "mcq",
   "difficulty": 2,
   "kp": "5.1 面积与有限和估算", "tags": ["exam","output","trap"],
   "scope": "both",
   "stem": "某物体运动的速度 $v(t)=49-9.8t$（单位 m/s），则在 $0\\le t\\le 8$ 内该物体经过的总路程是",
   "options": [
    {
     "text": "$166.6$ m",
     "correct": true
    },
    {
     "text": "$122.5$ m",
     "correct": false
    },
    {
     "text": "$78.4$ m",
     "correct": false
    },
    {
     "text": "$44.1$ m",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$t=5$ 时 $v=0$，按速率积分分段取绝对值：$122.5+44.1=166.6$ m。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$122.5$ 只是上升段 $\\int_0^5 v\\,dt$ 的路程，漏掉下降段。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$78.4$ 是位移 $\\int_0^8 v\\,dt=392-313.6$，上下两段正负相消后的净变化。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$44.1$ 只是下降段 $\\left|\\int_5^8 v\\,dt\\right|$，漏掉上升段。</span></div>"
  },
  {
   "id": "ch05-q3",
   "ch": "ch05",
   "type": "mcq",
   "difficulty": 1,
   "kp": "5.2 求和记号与有限和的极限", "tags": ["exam","output"],
   "scope": "both",
   "stem": "$\\sum_{k=1}^{10} k^{2}$ 的值是",
   "options": [
    {
     "text": "$385$",
     "correct": true
    },
    {
     "text": "$55$",
     "correct": false
    },
    {
     "text": "$1155$",
     "correct": false
    },
    {
     "text": "$3025$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$\\sum_{k=1}^{n}k^{2}=\\frac{n(n+1)(2n+1)}{6}=\\frac{10\\cdot11\\cdot21}{6}=385$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$55=\\frac{10\\cdot11}{2}$ 是 $\\sum_{k=1}^{10}k$，把平方和公式记成了一次和。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$1155$ 是把分母 $6$ 误记成 $2$（$\\frac{2310}{2}$），结果偏大三倍。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$3025=55^{2}$ 是立方和 $\\sum_{k=1}^{10}k^{3}=\\left[\\frac{n(n+1)}{2}\\right]^{2}$。</span></div>"
  },
  {
   "id": "ch05-q4",
   "ch": "ch05",
   "type": "mcq",
   "difficulty": 2,
   "kp": "5.2 求和记号与有限和的极限", "tags": ["exam","output"],
   "scope": "both",
   "stem": "把 $\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\left(1+k\\cdot\\frac{2}{n}\\right)\\frac{2}{n}$ 写成 $[a,b]$ 上的定积分，结果是",
   "options": [
    {
     "text": "$\\int_0^2 x\\,dx$",
     "correct": false
    },
    {
     "text": "$\\int_1^3 x\\,dx$",
     "correct": true
    },
    {
     "text": "$\\int_1^3 (1+x)\\,dx$",
     "correct": false
    },
    {
     "text": "$\\int_1^3 2x\\,dx$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。左端点是 $a=1$ 而非 $0$：把 $c_k=1+\\frac{2k}{n}$ 里的常数项 $1$ 丢了。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$\\Delta x=\\frac{2}{n}$，$c_k=1+k\\Delta x$，故 $a=1$、$b=3$，$f(x)=x$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$c_k$ 中的 $1$ 是区间左端点（定限信息），不能塞进被积函数。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\Delta x=\\frac{2}{n}$ 已含全部常数，被积函数仍是 $f(x)=x$，没有因子 $2$。</span></div>"
  },
  {
   "id": "ch05-q5",
   "ch": "ch05",
   "type": "mcq",
   "difficulty": 3,
   "kp": "5.3 定积分", "tags": ["exam","output","trap"],
   "scope": "both",
   "stem": "用最大最小值不等式估计 $I=\\int_0^2\\frac{1}{x+1}\\,dx$，正确的范围是",
   "options": [
    {
     "text": "$\\frac13\\le I\\le 1$",
     "correct": false
    },
    {
     "text": "$\\frac23\\le I\\le 2$",
     "correct": true
    },
    {
     "text": "$\\frac23\\le I\\le 1$",
     "correct": false
    },
    {
     "text": "$\\frac13\\le I\\le 2$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$f$ 递减，$\\min f=f(2)=\\frac13$、$\\max f=f(0)=1$ 都对，但忘了乘区间长。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$\\min f=\\frac13$、$\\max f=1$，区间长 $b-a=2$，故 $\\frac13\\cdot2\\le I\\le1\\cdot2$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。上限漏乘区间长：应为 $1\\cdot(2-0)=2$，不是 $1$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。下限漏乘区间长：应为 $\\frac13\\cdot(2-0)=\\frac23$，不是 $\\frac13$。</span></div>"
  },
  {
   "id": "ch05-q6",
   "ch": "ch05",
   "type": "mcq",
   "difficulty": 2,
   "kp": "5.4 微积分基本定理", "tags": ["exam","output","trap"],
   "scope": "both",
   "stem": "设 $y=\\int_1^{x^{2}}\\cos t\\,dt$，则 $\\frac{dy}{dx}=$",
   "options": [
    {
     "text": "$\\cos x^{2}$",
     "correct": false
    },
    {
     "text": "$2x\\cos x^{2}$",
     "correct": true
    },
    {
     "text": "$2x\\cos x$",
     "correct": false
    },
    {
     "text": "$-2x\\cos x^{2}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。漏掉链式因子：上限是 $x^{2}$，必须再乘 $(x^{2})'=2x$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。由 FTC1 与链式法则：$\\frac{dy}{dx}=\\cos(x^{2})\\cdot 2x$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。上限是 $x^{2}$ 不是 $x$，$\\cos$ 的自变量写错了。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。符号多余：下限是常数 $1$，只有下限含 $x$ 时才出现负号。</span></div>"
  },
  {
   "id": "ch05-q7",
   "ch": "ch05",
   "type": "mcq",
   "difficulty": 3,
   "kp": "5.4 微积分基本定理", "tags": ["exam","output","trap"],
   "scope": "both",
   "stem": "曲线 $y=\\sin x$ 与 $x$ 轴在 $[0,2\\pi]$ 上围成的图形总面积是",
   "options": [
    {
     "text": "$0$",
     "correct": false
    },
    {
     "text": "$2$",
     "correct": false
    },
    {
     "text": "$-2$",
     "correct": false
    },
    {
     "text": "$4$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$0$ 是净面积 $\\int_0^{2\\pi}\\sin x\\,dx$，上下两半正负相消，不是总面积。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$2$ 只是 $[0,\\pi]$ 上一半的面积，漏掉 $x$ 轴下方的另一块。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$-2$ 是 $\\int_{\\pi}^{2\\pi}\\sin x\\,dx$ 的值，作为面积应取其绝对值。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。总面积 $=\\int_0^{2\\pi}|\\sin x|dx=2+2=4$，先按零点 $\\pi$ 分段再取绝对值。</span></div>"
  },
  {
   "id": "ch05-q8",
   "ch": "ch05",
   "type": "mcq",
   "difficulty": 1,
   "kp": "5.5 不定积分与换元法", "tags": ["exam","output"],
   "scope": "both",
   "stem": "$\\int 2x\\,e^{x^{2}}dx=$",
   "options": [
    {
     "text": "$e^{x^{2}}+C$",
     "correct": true
    },
    {
     "text": "$2e^{x^{2}}+C$",
     "correct": false
    },
    {
     "text": "$e^{x^{2}}$",
     "correct": false
    },
    {
     "text": "$x^{2}e^{x^{2}}+C$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。令 $u=x^{2}$，$du=2x\\,dx$，原式 $=\\int e^{u}du=e^{x^{2}}+C$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。多乘了 $2$：$du=2x\\,dx$ 中的 $2$ 已与 $2x$ 相消，结果不该带系数 $2$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。漏写 $+C$：不定积分是一族函数，任意常数不能省。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。把 $u=x^{2}$ 乘在 $e^{u}$ 之外了，换元后应把 $u$ 写回指数位置。</span></div>"
  },
  {
   "id": "ch05-q9",
   "ch": "ch05",
   "type": "mcq",
   "difficulty": 2,
   "kp": "5.6 定积分换元与曲线间面积", "tags": ["exam","output","trap"],
   "scope": "both",
   "stem": "$\\int_0^{\\pi/2}\\frac{\\cos\\theta}{4+3\\sin\\theta}\\,d\\theta=$",
   "options": [
    {
     "text": "$\\ln\\frac74$",
     "correct": false
    },
    {
     "text": "$\\frac13\\ln\\frac47$",
     "correct": false
    },
    {
     "text": "$\\frac13\\ln\\frac74$",
     "correct": true
    },
    {
     "text": "$0$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。漏掉 $\\frac13$：由 $\\cos\\theta\\,d\\theta=\\frac13du$ 可知系数不能丢。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。上下限代反了：应代入 $u=7$ 减 $u=4$，得 $\\ln\\frac74$ 而非 $\\ln\\frac47$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$u=4+3\\sin\\theta$，$du=3\\cos\\theta\\,d\\theta$，换限 $4\\to7$ 得 $\\frac13\\ln\\frac74$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。换了元却仍用旧限 $\\theta=0,\\frac{\\pi}{2}$ 代入 $\\ln|u|$，才会算出 $0$。</span></div>"
  },
  {
   "id": "ch05-q10",
   "ch": "ch05",
   "type": "mcq",
   "difficulty": 2,
   "kp": "5.6 定积分换元与曲线间面积", "tags": ["exam","output"],
   "scope": "both",
   "stem": "抛物线 $y=x^{2}$ 与直线 $y=2x$ 所围区域的面积是",
   "options": [
    {
     "text": "$\\frac23$",
     "correct": false
    },
    {
     "text": "$\\frac83$",
     "correct": false
    },
    {
     "text": "$-\\frac43$",
     "correct": false
    },
    {
     "text": "$\\frac43$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac23$ 是把上限误定成 $x=1$（两曲线并不交于 $x=1$）算出的结果。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\frac83=\\int_0^2x^{2}dx$ 只是下曲线下的面积，还要减去直线下方的部分。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。负号来自上减下写反了：$\\int_0^2(x^{2}-2x)dx=-\\frac43$，面积应取正。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。交点 $x=0,2$，$A=\\int_0^2(2x-x^{2})dx=\\left[x^{2}-\\frac{x^{3}}{3}\\right]_0^2=\\frac43$。</span></div>"
  },
  {
   "id": "ch05-q11",
   "ch": "ch05",
   "type": "mcq",
   "difficulty": 1,
   "kp": "5.1 面积与有限和估算", "tags": ["exam","output"],
   "scope": "both",
   "stem": "用 $n=4$ 的等宽分割估算 $f(x)=1-x^{2}$ 在 $[0,1]$ 上的面积，所得的下和与上和分别是",
   "options": [
    {
     "text": "$0.78125$ 与 $0.53125$",
     "correct": false
    },
    {
     "text": "$0.671875$ 与 $0.78125$",
     "correct": false
    },
    {
     "text": "$0.53125$ 与 $0.78125$",
     "correct": true
    },
    {
     "text": "$2.125$ 与 $3.125$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$f(x)=1-x^{2}$ 在 $[0,1]$ 上单调递减，左端点取到的是每段上的最大值，左端点和是上和 $0.78125$；把两个数对调恰好把上、下和弄反了。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$0.671875$ 是取四个子区间中点的中点和，即中点法则的估计值；它介于下和与上和之间，既不是下和也不是上和。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$\\Delta x=\\frac14$，函数值依次为 $1,\\ 0.9375,\\ 0.75,\\ 0.4375,\\ 0$。右端点和 $\\frac14(0.9375+0.75+0.4375+0)=0.53125$ 是下和（递减函数在右端点取最小值），左端点和 $\\frac14(1+0.9375+0.75+0.4375)=0.78125$ 是上和。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$2.125$ 与 $3.125$ 只是两端点处函数值之和，忘记乘子 $\\Delta x=\\frac14$；矩形面积必须是 $f(c_k)\\Delta x$ 之后再求和。</span></div>"
  },
  {
   "id": "ch05-q12",
   "ch": "ch05",
   "type": "mcq",
   "difficulty": 1,
   "kp": "5.2 求和记号与有限和的极限", "tags": ["exam","output"],
   "scope": "both",
   "stem": "$\\sum_{k=1}^{20}(2k-1)$ 的值是",
   "options": [
    {
     "text": "$210$",
     "correct": false
    },
    {
     "text": "$420$",
     "correct": false
    },
    {
     "text": "$441$",
     "correct": false
    },
    {
     "text": "$400$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$210=\\frac{20\\cdot21}{2}$ 是 $\\sum_{k=1}^{20}k$，把奇数之和当成了自然数之和。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$420=2\\sum_{k=1}^{20}k$ 是 $\\sum_{k=1}^{20}2k$，漏减了每一项里的 $1$（一共 20 个 $1$）。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$441=21^{2}$ 相当于把求和上限写成 $21$，多算了一项 $2\\cdot21-1=41$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。由线性性质 $\\sum_{k=1}^{20}(2k-1)=2\\sum_{k=1}^{20}k-\\sum_{k=1}^{20}1=2\\cdot\\frac{20\\cdot21}{2}-20=420-20=400$，即 $20^{2}$。</span></div>"
  },
  {
   "id": "ch05-q13",
   "ch": "ch05",
   "type": "mcq",
   "difficulty": 1,
   "kp": "5.3 定积分", "tags": ["exam","output"],
   "scope": "both",
   "stem": "设 $\\int_1^4 f(x)\\,dx=5$，$\\int_1^2 f(x)\\,dx=-1$，则 $\\int_4^2 f(x)\\,dx=$",
   "options": [
    {
     "text": "$-6$",
     "correct": true
    },
    {
     "text": "$6$",
     "correct": false
    },
    {
     "text": "$4$",
     "correct": false
    },
    {
     "text": "$-4$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。由区间可加性 $\\int_1^4 f=\\int_1^2 f+\\int_2^4 f$，得 $\\int_2^4 f=5-(-1)=6$；再由换序性质 $\\int_4^2 f=-\\int_2^4 f=-6$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$6=\\int_2^4 f\\,dx$ 只是拆区间得到的结果，最后一步忘了用 $\\int_b^a f=-\\int_a^b f$ 变号。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$4=5-1$ 是把 $\\int_1^2 f=-1$ 的负号丢掉了，应当做 $5-(-1)$ 而不是 $5-1$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$-4$ 是先丢掉负号算成 $5-1=4$，又多补了一次换序的负号，两处符号错误叠加。</span></div>"
  },
  {
   "id": "ch05-q14",
   "ch": "ch05",
   "type": "mcq",
   "difficulty": 2,
   "kp": "5.3 定积分", "tags": ["exam","output"],
   "scope": "both",
   "stem": "函数 $f(x)=x^{3}$ 在 $[-1,2]$ 上的平均值是",
   "options": [
    {
     "text": "$\\frac{15}{4}$",
     "correct": false
    },
    {
     "text": "$\\frac{5}{4}$",
     "correct": true
    },
    {
     "text": "$\\frac{7}{2}$",
     "correct": false
    },
    {
     "text": "$\\frac{17}{12}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac{15}{4}$ 只是积分值 $\\int_{-1}^{2}x^{3}dx=\\left[\\frac{x^{4}}{4}\\right]_{-1}^{2}=4-\\frac14$，平均值还必须除以区间长度 $b-a=3$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$\\int_{-1}^{2}x^{3}dx=\\frac{2^{4}}{4}-\\frac{(-1)^{4}}{4}=4-\\frac14=\\frac{15}{4}$，故平均值为 $\\frac{1}{2-(-1)}\\cdot\\frac{15}{4}=\\frac{15}{12}=\\frac54$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac72=\\frac{f(2)+f(-1)}{2}=\\frac{8-1}{2}$ 是两端点函数值的算术平均；积分平均值的定义是 $\\frac{1}{b-a}\\int_a^b f$，与端点值无关。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{17}{12}$ 来自把 $[-1,0]$ 上为负的积分取绝对值当面积（$\\frac14+4=\\frac{17}{4}$）再除以 3；平均值用的是净积分，负的部分不能取绝对值。</span></div>"
  },
  {
   "id": "ch05-q15",
   "ch": "ch05",
   "type": "mcq",
   "difficulty": 2,
   "kp": "5.4 微积分基本定理", "tags": ["exam","output","trap"],
   "scope": "both",
   "stem": "$\\frac{d}{dx}\\int_{x}^{x^{2}}\\frac{1}{t}\\,dt=$",
   "options": [
    {
     "text": "$\\frac{2}{x}$",
     "correct": false
    },
    {
     "text": "$\\frac{3}{x}$",
     "correct": false
    },
    {
     "text": "$\\frac{1}{x}$",
     "correct": true
    },
    {
     "text": "$\\frac{1-x}{x^{2}}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac{2}{x}$ 只算了上限项 $\\frac{1}{x^{2}}\\cdot(x^{2})'=\\frac2x$，漏掉下限项 $-\\frac1x\\cdot(x)'=-\\frac1x$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\frac3x$ 是把下限项写成 $+\\frac1x$ 的结果；下限在积分号下方，它的贡献必须带负号。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。由 $\\frac{d}{dx}\\int_{u(x)}^{v(x)}f(t)\\,dt=f(v)v'-f(u)u'$ 得 $\\frac{1}{x^{2}}\\cdot2x-\\frac1x\\cdot1=\\frac2x-\\frac1x=\\frac1x$。（也可先算出 $\\ln x^{2}-\\ln x=\\ln x$ 再求导。）</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{1-x}{x^{2}}=\\frac{1}{x^{2}}-\\frac1x$ 是上限漏乘链式因子（把 $(x^{2})'$ 当成 $1$）后与下限项相加的结果。</span></div>"
  },
  {
   "id": "ch05-q16",
   "ch": "ch05",
   "type": "mcq",
   "difficulty": 3,
   "kp": "5.4 微积分基本定理", "tags": ["exam","concept","trap"],
   "scope": "both",
   "stem": "对 $f(x)=x^{2}$ 在 $[0,3]$ 上应用积分中值定理，使 $f(c)=\\frac{1}{3}\\int_0^3 x^{2}\\,dx$ 的 $c$ 是",
   "options": [
    {
     "text": "$3$",
     "correct": false
    },
    {
     "text": "$\\frac{3}{2}$",
     "correct": false
    },
    {
     "text": "$\\sqrt[3]{9}$",
     "correct": false
    },
    {
     "text": "$\\sqrt{3}$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$3$ 是平均值 $f(c)=\\frac13\\int_0^3x^{2}dx=\\frac13\\cdot9=3$ 本身，不是 $c$；还须再解 $c^{2}=3$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\frac32$ 是区间 $[0,3]$ 的中点；中值定理只保证存在某个 $c$，一般不等于中点（本题 $c=\\sqrt3\\approx1.73$）。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\sqrt[3]{9}$ 来自把 $c$ 误当成积分上限去解 $\\int_0^{c}x^{2}dx=3$（即 $\\frac{c^{3}}{3}=3$）；中值定理里的 $c$ 是被积函数的自变量，不是积分限。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$\\frac13\\int_0^3x^{2}dx=\\frac13\\left[\\frac{x^{3}}{3}\\right]_0^3=\\frac13\\cdot9=3$，由 $c^{2}=3$ 得 $c=\\sqrt3$，且 $\\sqrt3\\in[0,3]$ 满足定理条件。</span></div>"
  },
  {
   "id": "ch05-q17",
   "ch": "ch05",
   "type": "mcq",
   "difficulty": 2,
   "kp": "5.5 不定积分与换元法", "tags": ["exam","output","trap"],
   "scope": "both",
   "stem": "$\\int\\frac{dx}{\\sqrt{2x+1}}=$",
   "options": [
    {
     "text": "$2\\sqrt{2x+1}+C$",
     "correct": false
    },
    {
     "text": "$\\sqrt{2x+1}+C$",
     "correct": true
    },
    {
     "text": "$\\frac{1}{2}\\sqrt{2x+1}+C$",
     "correct": false
    },
    {
     "text": "$\\frac{2}{3}(2x+1)^{3/2}+C$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。令 $u=2x+1$ 有 $du=2\\,dx$，即 $dx=\\frac12du$；把常数因子写成 $2$（方向弄反）才会得到 $2\\sqrt{2x+1}$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$u=2x+1$，$du=2\\,dx$，故 $\\int\\frac{dx}{\\sqrt{2x+1}}=\\frac12\\int u^{-1/2}du=\\frac12\\cdot2u^{1/2}+C=\\sqrt{2x+1}+C$；求导检验 $\\frac{d}{dx}\\sqrt{2x+1}=\\frac{1}{\\sqrt{2x+1}}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac12\\int u^{-1/2}du=\\frac12\\cdot\\frac{u^{1/2}}{1/2}=u^{1/2}$，这里漏掉了除以 $\\frac12$ 这一步，结果只有正确答案的一半。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。把幂次 $-\\frac12$ 看成了 $+\\frac12$：$\\frac{u^{3/2}}{3/2}$ 对应的是 $\\int u^{1/2}du$，而本题是 $\\int u^{-1/2}du$。</span></div>"
  },
  {
   "id": "ch05-q18",
   "ch": "ch05",
   "type": "mcq",
   "difficulty": 2,
   "kp": "5.5 不定积分与换元法", "tags": ["exam","output","trap"],
   "scope": "both",
   "stem": "$\\int \\sin^{2}x\\,dx=$",
   "options": [
    {
     "text": "$\\frac{x}{2}-\\frac{\\sin 2x}{4}+C$",
     "correct": true
    },
    {
     "text": "$\\frac{\\sin^{3}x}{3}+C$",
     "correct": false
    },
    {
     "text": "$\\frac{x}{2}-\\sin 2x+C$",
     "correct": false
    },
    {
     "text": "$\\frac{x}{2}+\\frac{\\sin 2x}{4}+C$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。用降幂公式 $\\sin^{2}x=\\frac{1-\\cos2x}{2}$，得 $\\int\\frac{1-\\cos2x}{2}dx=\\frac{x}{2}-\\frac12\\cdot\\frac{\\sin2x}{2}+C=\\frac{x}{2}-\\frac{\\sin2x}{4}+C$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\frac{\\sin^{3}x}{3}$ 是把 $\\sin^{2}x$ 当幂函数套用 $\\int u^{2}du$，但这里缺少 $du=\\cos x\\,dx$ 这个因子；对它求导得 $\\sin^{2}x\\cos x$，还原不出 $\\sin^{2}x$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\int\\cos2x\\,dx=\\frac{\\sin2x}{2}$，前面还有因子 $-\\frac12$，应当得到 $-\\frac{\\sin2x}{4}$；漏掉这个 $\\frac12$ 才写成 $-\\sin2x$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\sin$ 项的符号写反了：被积函数是 $\\frac{1-\\cos2x}{2}$，由 $\\cos$ 积出的 $\\sin$ 项必须带负号。</span></div>"
  },
  {
   "id": "ch05-q19",
   "ch": "ch05",
   "type": "mcq",
   "difficulty": 2,
   "kp": "5.6 定积分换元与曲线间面积", "tags": ["exam","output"],
   "scope": "both",
   "stem": "$\\int_{-2}^{2}(x^{3}+x^{2})\\,dx=$",
   "options": [
    {
     "text": "$0$",
     "correct": false
    },
    {
     "text": "$\\frac{8}{3}$",
     "correct": false
    },
    {
     "text": "$\\frac{40}{3}$",
     "correct": false
    },
    {
     "text": "$\\frac{16}{3}$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$0$ 相当于把 $x^{2}$ 也当奇函数相消了；$x^{2}$ 是偶函数，$\\int_{-2}^{2}x^{2}dx=2\\int_0^2x^{2}dx=\\frac{16}{3}\\ne0$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\frac83=\\int_0^2x^{2}dx$ 只算了对称区间的一半，偶函数应当用 $\\int_{-a}^{a}f=2\\int_0^{a}f$ 翻倍。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac{40}{3}$ 是把奇函数部分也算成 $2\\int_0^2x^{3}dx=8$ 再加上 $\\frac{16}{3}$；奇函数在对称区间上的积分恒为 $0$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$x^{3}$ 是奇函数，由对称性 $\\int_{-2}^{2}x^{3}dx=0$；$x^{2}$ 是偶函数，$\\int_{-2}^{2}x^{2}dx=2\\left[\\frac{x^{3}}{3}\\right]_0^2=\\frac{16}{3}$。故原式 $=0+\\frac{16}{3}=\\frac{16}{3}$。</span></div>"
  },
  {
   "id": "ch05-q20",
   "ch": "ch05",
   "type": "mcq",
   "difficulty": 3,
   "kp": "5.6 定积分换元与曲线间面积", "tags": ["exam","output","trap"],
   "scope": "both",
   "stem": "抛物线 $y^{2}=4x$ 与直线 $y=2x-4$ 所围成的封闭区域面积是",
   "options": [
    {
     "text": "$\\frac{19}{3}$",
     "correct": false
    },
    {
     "text": "$9$",
     "correct": true
    },
    {
     "text": "$\\frac{8}{3}$",
     "correct": false
    },
    {
     "text": "$\\frac{20}{3}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac{19}{3}=\\int_1^4(2\\sqrt x-2x+4)dx$ 只算了 $1\\le x\\le4$ 那一段；区域在 $0\\le x\\le1$ 还有一块（抛物线左右两支之间的部分，宽 $4\\sqrt x$），漏掉它少算 $\\frac83$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。两曲线交于 $(1,-2)$ 与 $(4,4)$，即 $y$ 从 $-2$ 积到 $4$。对 $y$ 积分（右减左：右边界为直线 $x=\\frac{y+4}{2}$，左边界为抛物线 $x=\\frac{y^{2}}{4}$），得 $A=\\int_{-2}^{4}\\left(\\frac{y+4}{2}-\\frac{y^{2}}{4}\\right)dy=\\left[\\frac{y^{2}}{4}+2y-\\frac{y^{3}}{12}\\right]_{-2}^{4}=\\frac{20}{3}-\\left(-\\frac73\\right)=9$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac83=\\int_0^1 4\\sqrt x\\,dx$ 只是 $0\\le x\\le1$ 的那一小块（抛物线两支之间的部分），漏掉了 $1\\le x\\le4$ 的主体。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{20}{3}$ 是求出的原函数 $\\frac{y^{2}}{4}+2y-\\frac{y^{3}}{12}$ 只代入上限 $y=4$ 所得的值，忘了再减去下限 $y=-2$ 处的 $-\\frac73$。</span></div>"
  },
  {
   "id": "ch06-q1",
   "ch": "ch06",
   "type": "mcq",
   "difficulty": 1,
   "kp": "6.1 Volumes Using Cross-Sections（截面法求体积）", "tags": ["exam","output"],
   "scope": "final",
   "stem": "曲线 $y=\\sqrt{x}$ 与直线 $x=4$ 及 $x$ 轴围成的区域绕 $x$ 轴旋转，所得旋转体的体积为",
   "options": [
    {
     "text": "$\\frac{16\\pi}{3}$",
     "correct": false
    },
    {
     "text": "$8\\pi$",
     "correct": true
    },
    {
     "text": "$\\frac{64\\pi}{3}$",
     "correct": false
    },
    {
     "text": "$\\frac{128\\pi}{5}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac{16\\pi}{3}$ 把被积函数写成 $R(x)=\\sqrt{x}$ 而非 $R^2(x)=x$，圆盘面积是 $\\pi R^2$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。圆盘法 $R(x)=\\sqrt{x}$，$V=\\pi\\int_0^4 x\\,dx=\\pi\\cdot8=8\\pi$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac{64\\pi}{3}$ 相当于把半径写成 $R(x)=x$（漏了开方），得 $\\pi\\int_0^4x^2dx$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{128\\pi}{5}$ 是同一区域绕 $y$ 轴旋转（柱壳法 $\\int_0^4 2\\pi x\\sqrt{x}\\,dx$）的体积，旋转轴选错了。</span></div>"
  },
  {
   "id": "ch06-q2",
   "ch": "ch06",
   "type": "mcq",
   "difficulty": 2,
   "kp": "6.1 Volumes Using Cross-Sections（截面法求体积）", "tags": ["exam","output"],
   "scope": "final",
   "stem": "由 $y=x^2$ 与 $y=2x$ 围成的区域绕 $x$ 轴旋转，所得旋转体的体积为",
   "options": [
    {
     "text": "$\\frac{16\\pi}{3}$",
     "correct": false
    },
    {
     "text": "$\\frac{32\\pi}{3}$",
     "correct": false
    },
    {
     "text": "$\\frac{64\\pi}{15}$",
     "correct": true
    },
    {
     "text": "$\\frac{32\\pi}{5}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac{16\\pi}{3}$ 写成 $\\pi\\int_0^2(2x-x^2)dx$，把半径的平方漏成了半径本身。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\frac{32\\pi}{3}$ 只积了外半径 $\\pi\\int_0^2(2x)^2dx$，忘记减去内半径 $x^2$ 转出的洞。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。交点 $x=0,2$，$V=\\pi\\int_0^2(4x^2-x^4)dx=\\frac{64\\pi}{15}$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{32\\pi}{5}$ 只积了内半径 $\\pi\\int_0^2x^4dx$，那是洞的体积而不是垫圈体积。</span></div>"
  },
  {
   "id": "ch06-q3",
   "ch": "ch06",
   "type": "mcq",
   "difficulty": 1,
   "kp": "6.2 Volumes Using Cylindrical Shells（柱壳法求体积）", "tags": ["exam","output","trap"],
   "scope": "final",
   "stem": "由 $y=x^2$、$x$ 轴与直线 $x=1$ 围成的区域绕 $y$ 轴旋转，所得旋转体的体积为",
   "options": [
    {
     "text": "$\\frac{2\\pi}{5}$",
     "correct": false
    },
    {
     "text": "$\\frac{\\pi}{2}$",
     "correct": true
    },
    {
     "text": "$\\pi$",
     "correct": false
    },
    {
     "text": "$\\frac{\\pi}{4}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac{2\\pi}{5}$ 把壳半径写成 $x^2$（那是壳高），半径应是竖条到 $y$ 轴的距离 $x$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。柱壳法取竖条：壳半径 $x$、壳高 $x^2$，$V=\\int_0^1 2\\pi x\\cdot x^2dx=2\\pi\\cdot\\frac14=\\frac{\\pi}{2}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\pi$ 来自 $\\int_0^1 2\\pi x\\,dx$，把壳高当成 $1$，漏掉竖条从 $y=0$ 到 $y=x^2$ 的高度。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{\\pi}{4}$ 漏掉公式中的 $2$：柱壳摊平后的长是整圈周长 $2\\pi x$，不是 $\\pi x$。</span></div>"
  },
  {
   "id": "ch06-q4",
   "ch": "ch06",
   "type": "mcq",
   "difficulty": 2,
   "kp": "6.3 Arc Length（弧长）", "tags": ["exam","output","trap"],
   "scope": "final",
   "stem": "曲线 $y=\\frac{4\\sqrt{2}}{3}x^{3/2}-1$ 从 $x=0$ 到 $x=1$ 的弧长为",
   "options": [
    {
     "text": "$\\frac{13}{6}$",
     "correct": true
    },
    {
     "text": "$5$",
     "correct": false
    },
    {
     "text": "$\\frac{9}{4}$",
     "correct": false
    },
    {
     "text": "$\\frac{13}{3}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$y'=2\\sqrt{2}\\sqrt{x}$，$1+(y')^2=1+8x$，$L=\\int_0^1\\sqrt{1+8x}\\,dx=\\frac{13}{6}$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$5$ 是 $\\int_0^1(1+8x)dx$，把 $1+(y')^2$ 直接当成被积函数，弧长微元必须开方。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac{9}{4}$ 只代入上限 $x=1$ 处的 $\\frac{27}{12}$，漏掉下限 $x=0$ 处 $\\frac{1}{12}$ 的贡献。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{13}{3}$ 是原函数系数写错，$\\sqrt{1+8x}$ 的正确系数为 $\\frac18\\cdot\\frac23=\\frac{1}{12}$。</span></div>"
  },
  {
   "id": "ch06-q5",
   "ch": "ch06",
   "type": "mcq",
   "difficulty": 3,
   "kp": "6.3 Arc Length（弧长）", "tags": ["exam","output","trap"],
   "scope": "final",
   "stem": "曲线 $y=\\left(\\frac{x}{2}\\right)^{2/3}$ 从 $x=0$ 到 $x=2$ 的弧长为",
   "options": [
    {
     "text": "$\\frac{2}{27}(10\\sqrt{10}-1)$",
     "correct": true
    },
    {
     "text": "$\\frac{2}{27}(10\\sqrt{10}+1)$",
     "correct": false
    },
    {
     "text": "$\\frac{1}{9}(10\\sqrt{10}-1)$",
     "correct": false
    },
    {
     "text": "$\\frac{20\\sqrt{10}}{27}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$y'$ 在 $x=0$ 发散，用 $x=2y^{3/2}$，$L=\\int_0^1\\sqrt{1+9y}\\,dy=\\frac{2}{27}(10\\sqrt{10}-1)$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\frac{2}{27}(10\\sqrt{10}+1)$ 把定积分下限的符号弄反，应为 $u^{3/2}\\big|_1^{10}=10\\sqrt{10}-1$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac19(10\\sqrt{10}-1)$ 漏乘了换元系数 $\\frac23$：$\\int u^{1/2}du=\\frac23u^{3/2}$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{20\\sqrt{10}}{27}$ 只算了上限 $u=10$ 的 $\\frac{2}{27}\\cdot10\\sqrt{10}$，漏减下限 $u=1$。</span></div>"
  },
  {
   "id": "ch06-q6",
   "ch": "ch06",
   "type": "mcq",
   "difficulty": 1,
   "kp": "6.4 Areas of Surfaces of Revolution（旋转曲面面积）", "tags": ["exam","output","trap"],
   "scope": "final",
   "stem": "设 $f(x)\\ge0$ 在 $[a,b]$ 上光滑，其图像绕 $x$ 轴旋转一周所得曲面的面积 $S$ 为",
   "options": [
    {
     "text": "$\\int_a^b 2\\pi f(x)\\,dx$",
     "correct": false
    },
    {
     "text": "$\\int_a^b 2\\pi x\\sqrt{1+[f'(x)]^2}\\,dx$",
     "correct": false
    },
    {
     "text": "$\\int_a^b 2\\pi f(x)\\sqrt{1+[f'(x)]^2}\\,dx$",
     "correct": true
    },
    {
     "text": "$\\int_a^b \\pi[f(x)]^2\\sqrt{1+[f'(x)]^2}\\,dx$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。用 $dx$ 代替 $ds$ 会漏掉斜率的贡献，那只相当于把带面当成圆柱侧面。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$2\\pi x$ 把到轴的距离取成了 $x$，那是绕 $y$ 轴旋转的公式 $S=\\int 2\\pi x\\,ds$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。微元是「转一圈的周长」$2\\pi f(x)$ 乘弧长微元 $ds=\\sqrt{1+[f'(x)]^2}\\,dx$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。多乘了一个 $\\pi f(x)$：把周长 $2\\pi f(x)$ 误当成了圆盘面积 $\\pi[f(x)]^2$。</span></div>"
  },
  {
   "id": "ch06-q7",
   "ch": "ch06",
   "type": "mcq",
   "difficulty": 2,
   "kp": "6.4 Areas of Surfaces of Revolution（旋转曲面面积）", "tags": ["exam","output"],
   "scope": "final",
   "stem": "曲线 $y=2\\sqrt{x}$（$1\\le x\\le2$）绕 $x$ 轴旋转所得曲面的面积为",
   "options": [
    {
     "text": "$\\frac{8\\pi}{3}(6\\sqrt{6}-5\\sqrt{5})$",
     "correct": false
    },
    {
     "text": "$\\frac{8\\pi}{3}(2\\sqrt{2}-1)$",
     "correct": false
    },
    {
     "text": "$\\frac{4\\pi}{3}(3\\sqrt{3}-2\\sqrt{2})$",
     "correct": false
    },
    {
     "text": "$\\frac{8\\pi}{3}(3\\sqrt{3}-2\\sqrt{2})$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac{8\\pi}{3}(6\\sqrt{6}-5\\sqrt{5})$ 来自把 $y'$ 误写成 $\\frac{2}{\\sqrt{x}}$，多出 $1+\\frac4x$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\frac{8\\pi}{3}(2\\sqrt{2}-1)$ 来自 $\\int_1^2 2\\pi y\\,dx$，用 $dx$ 代替 $ds$ 是本节的经典错误。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac{4\\pi}{3}(3\\sqrt{3}-2\\sqrt{2})$ 少一个因子 $2$：$2\\pi\\cdot2\\sqrt{x}$ 已含 $4\\pi$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$S=4\\pi\\int_1^2\\sqrt{x+1}\\,dx=\\frac{8\\pi}{3}(3\\sqrt{3}-2\\sqrt{2})$，其中 $ds$ 已化简。</span></div>"
  },
  {
   "id": "ch06-q8",
   "ch": "ch06",
   "type": "mcq",
   "difficulty": 1,
   "kp": "6.5 Work and Fluid Forces（功与液体压力）", "tags": ["exam","output"],
   "scope": "final",
   "stem": "某弹簧压缩 $0.1$ m 需力 $50$ N，则把它从自然长度压缩 $0.2$ m 需做的功为",
   "options": [
    {
     "text": "$10$ J",
     "correct": true
    },
    {
     "text": "$100$ J",
     "correct": false
    },
    {
     "text": "$2.5$ J",
     "correct": false
    },
    {
     "text": "$5$ J",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。Hooke 定律 $F=kx$：$k=500$ N/m，$W=\\frac12kx_1^2=\\frac12\\cdot500\\cdot0.04=10$ J。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$100$ J 等于 $kx_1^2$，漏了 $\\frac12$：弹力随形变线性变化，$W=\\frac12kx_1^2$ 而不是 $Fx_1$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$2.5$ J 把最终形变量取成 $0.1$ m，题目问的是压缩到形变 $0.2$ m 所做的功。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$5$ J 用 $k=\\frac{50}{0.2}=250$ N/m，力与形变量必须配对，$50$ N 对应形变 $0.1$ m。</span></div>"
  },
  {
   "id": "ch06-q9",
   "ch": "ch06",
   "type": "mcq",
   "difficulty": 2,
   "kp": "6.5 Work and Fluid Forces（功与液体压力）", "tags": ["exam","output"],
   "scope": "final",
   "stem": "矩形闸门宽 $4$ m、高 $3$ m，竖直没入水中且顶边距水面 $2$ m，水对一侧的压力为（$w=9800$ N/m³）",
   "options": [
    {
     "text": "$235200$ N",
     "correct": false
    },
    {
     "text": "$411600$ N",
     "correct": true
    },
    {
     "text": "$588000$ N",
     "correct": false
    },
    {
     "text": "$205800$ N",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$235200$ N 用顶边深度 $2$ m 乘面积，压强随深度增大，应取形心深度 $3.5$ m。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。形心深度 $=2+\\frac32=3.5$ m，面积 $A=12$ m²，$F=whA=9800\\cdot3.5\\cdot12=411600$ N。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$588000$ N 用底边深度 $5$ m，那是最大压强处的值，等于把整块板按最深点受力算。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$205800$ N 把矩形面积算成三角形 $\\frac12\\cdot4\\cdot3=6$ m²，闸门面积是 $4\\cdot3=12$ m²。</span></div>"
  },
  {
   "id": "ch06-q10",
   "ch": "ch06",
   "type": "mcq",
   "difficulty": 2,
   "kp": "6.6 Moments and Centers of Mass（矩与质心）", "tags": ["exam","output","trap"],
   "scope": "final",
   "stem": "半径 $3$ 的圆盘形区域绕其平面内一条距圆心 $5$ 且不相交的直线旋转一周，所得圆环体的体积为",
   "options": [
    {
     "text": "$60\\pi^2$",
     "correct": false
    },
    {
     "text": "$45\\pi^2$",
     "correct": false
    },
    {
     "text": "$180\\pi^2$",
     "correct": false
    },
    {
     "text": "$90\\pi^2$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$60\\pi^2$ 把圆面积 $9\\pi$ 写成了圆周长 $2\\pi\\cdot3=6\\pi$，公式中的 $A$ 是区域面积。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$45\\pi^2$ 漏掉因子 $2$：形心绕轴一周走的路程是整圆 $2\\pi r$，不是 $\\pi r$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$180\\pi^2$ 把 $r$ 取成了直径 $10$，$r$ 是形心（圆心）到旋转轴的距离 $5$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。Pappus 定理：$r=5$，$A=\\pi\\cdot3^2=9\\pi$，$V=2\\pi rA=2\\pi\\cdot5\\cdot9\\pi=90\\pi^2$。</span></div>"
  },
  {
   "id": "ch07-q1",
   "ch": "ch07",
   "type": "mcq",
   "difficulty": 2,
   "kp": "7.1 反函数及其导数", "tags": ["exam","output","trap"],
   "scope": "final",
   "stem": "设 $f(x)=x^{3}+x+1$ 可逆，则 $(f^{-1})'(3)=$ ?",
   "options": [
    {
     "text": "$4$",
     "correct": false
    },
    {
     "text": "$\\frac{1}{3}$",
     "correct": false
    },
    {
     "text": "$\\frac{1}{28}$",
     "correct": false
    },
    {
     "text": "$\\frac{1}{4}$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$4=f'(1)$ 是原函数的导数值，反函数求导法则还要取它的倒数。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。把 $f'(1)$ 当成 $3x^{2}$ 在 $x=1$ 处的值 $3$，漏掉了求导得到的 $+1$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。这是把 $b=3$ 直接代入 $f'(x)=3x^{2}+1$ 得到的；公式里要代入 $a=f^{-1}(b)$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。由 $f(1)=3$ 得 $f^{-1}(3)=1$，又 $f'(x)=3x^{2}+1$，故 $(f^{-1})'(3)=\\frac{1}{f'(1)}=\\frac{1}{4}$。</span></div>"
  },
  {
   "id": "ch07-q2",
   "ch": "ch07",
   "type": "mcq",
   "difficulty": 1,
   "kp": "7.2 自然对数", "tags": ["exam","output"],
   "scope": "final",
   "stem": "计算 $\\int\\frac{dx}{x\\ln x}$（$x>1$）得 ?",
   "options": [
    {
     "text": "$\\ln|\\ln x|+C$",
     "correct": true
    },
    {
     "text": "$-\\frac{1}{\\ln x}+C$",
     "correct": false
    },
    {
     "text": "$\\frac{(\\ln x)^{2}}{2}+C$",
     "correct": false
    },
    {
     "text": "$\\ln x\\cdot\\ln|\\ln x|+C$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。令 $u=\\ln x$，则 $du=\\frac{dx}{x}$，故原式 $=\\int\\frac{du}{u}=\\ln|u|+C=\\ln|\\ln x|+C$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\int u^{-1}du=\\ln|u|+C$，不是幂函数积分 $-u^{-2}$ 那种形式。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。这相当于把 $(\\ln x)^{-1}$ 当成 $\\ln x$ 的一次幂去积分，指数算错了。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。换元后剩下的是 $\\frac{du}{u}$，不该再多乘一个 $\\ln x$ 因子。</span></div>"
  },
  {
   "id": "ch07-q3",
   "ch": "ch07",
   "type": "mcq",
   "difficulty": 3,
   "kp": "7.2 自然对数", "tags": ["exam","output","trap"],
   "scope": "final",
   "stem": "设 $y=x^{x}$（$x>0$），则 $\\frac{dy}{dx}=$ ?",
   "options": [
    {
     "text": "$x^{x}(\\ln x+1)$",
     "correct": true
    },
    {
     "text": "$x^{x}$",
     "correct": false
    },
    {
     "text": "$x\\cdot x^{x-1}$",
     "correct": false
    },
    {
     "text": "$x^{x}\\ln x$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。取对数得 $\\ln y=x\\ln x$，两边求导 $\\frac{y'}{y}=\\ln x+1$，乘回 $y=x^{x}$ 即得。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。这是把 $\\frac{d}{dx}(x\\ln x)$ 只算成 $1$ 的结果，漏掉了 $\\ln x$ 项。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。这是把 $x^{x}$ 当幂函数套用 $\\frac{d}{dx}x^{n}=nx^{n-1}$；指数是变量，必须先取对数。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。漏掉了 $x\\cdot\\frac{1}{x}=1$ 这一项，取对数求导后应得 $\\ln x+1$。</span></div>"
  },
  {
   "id": "ch07-q4",
   "ch": "ch07",
   "type": "mcq",
   "difficulty": 1,
   "kp": "7.3 指数函数", "tags": ["exam","output"],
   "scope": "final",
   "stem": "$\\int 2^{x}dx=$ ?",
   "options": [
    {
     "text": "$\\frac{2^{x}}{\\ln 2}+C$",
     "correct": true
    },
    {
     "text": "$2^{x}+C$",
     "correct": false
    },
    {
     "text": "$2^{x}\\ln 2+C$",
     "correct": false
    },
    {
     "text": "$\\frac{2^{x+1}}{x+1}+C$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。由 $\\int a^{u}du=\\frac{a^{u}}{\\ln a}+C$，取 $a=2$ 即得 $\\frac{2^{x}}{\\ln 2}+C$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。只有底为 $e$ 时才有 $\\int e^{x}dx=e^{x}+C$，这里 $\\ln 2\\ne1$，会少一个因子。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$2^{x}\\ln 2$ 是 $\\frac{d}{dx}2^{x}$；积分与求导方向相反，应当除以 $\\ln 2$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。幂函数法则 $\\int x^{n}dx=\\frac{x^{n+1}}{n+1}$ 只适用于底是变量、指数为常数的情形。</span></div>"
  },
  {
   "id": "ch07-q5",
   "ch": "ch07",
   "type": "mcq",
   "difficulty": 2,
   "kp": "7.4 指数变化与分离变量方程", "tags": ["exam","output"],
   "scope": "final",
   "stem": "某放射性物质满足 $y=y_{0}e^{-kt}$，半衰期为 20 天，则衰变常数 $k$（每天）为 ?",
   "options": [
    {
     "text": "$\\frac{\\ln 2}{10}$",
     "correct": false
    },
    {
     "text": "$\\frac{\\ln 2}{20}$",
     "correct": true
    },
    {
     "text": "$\\frac{1}{20}$",
     "correct": false
    },
    {
     "text": "$\\frac{20}{\\ln 2}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。分母应取半衰期 20 天；写成 $10$ 相当于把已知的 20 天当成了 10 天。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。把 $t=20$ 时 $y=\\frac{1}{2}y_{0}$ 代入得 $e^{-20k}=\\frac{1}{2}$，故 $k=\\frac{\\ln 2}{20}\\approx0.0347$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac{1}{20}$ 只看时间比例，没有体现 $e^{-kt}$ 中对数运算带来的 $\\ln 2$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。把半衰期公式 $T=\\frac{\\ln 2}{k}$ 的分子分母写反了，$k$ 应当是 $\\frac{\\ln 2}{T}$。</span></div>"
  },
  {
   "id": "ch07-q6",
   "ch": "ch07",
   "type": "mcq",
   "difficulty": 3,
   "kp": "7.5 不定式与洛必达法则", "tags": ["exam","output","trap"],
   "scope": "final",
   "stem": "$\\lim_{x\\to 0}\\frac{1-\\cos x}{x+x^{2}}=$ ?",
   "options": [
    {
     "text": "$\\infty$",
     "correct": false
    },
    {
     "text": "$0$",
     "correct": true
    },
    {
     "text": "$1$",
     "correct": false
    },
    {
     "text": "$\\frac{1}{2}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。分子 $1-\\cos x\\approx\\frac{x^{2}}{2}$ 是二阶小量，分母 $\\approx x$ 是一阶，比值趋于 $0$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。洛必达一次得 $\\lim\\frac{\\sin x}{1+2x}$，分母极限为 $1\\ne0$ 必须停止，代入得 $\\frac{0}{1}=0$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac{0}{0}$ 型不定式的值不一定是 $1$，本例分子是分母的高阶无穷小，比值为 $0$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。继续求导得 $\\frac{\\cos x}{2}\\to\\frac{1}{2}$，这是洛必达用过头；分母导数非零时就该停止。</span></div>"
  },
  {
   "id": "ch07-q7",
   "ch": "ch07",
   "type": "mcq",
   "difficulty": 1,
   "kp": "7.6 反三角函数", "tags": ["exam","output"],
   "scope": "final",
   "stem": "$\\int_{0}^{1/2}\\frac{dx}{\\sqrt{1-x^{2}}}=$ ?",
   "options": [
    {
     "text": "$\\frac{\\pi}{2}$",
     "correct": false
    },
    {
     "text": "$\\frac{\\pi}{3}$",
     "correct": false
    },
    {
     "text": "$\\frac{1}{2}$",
     "correct": false
    },
    {
     "text": "$\\frac{\\pi}{6}$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac{\\pi}{2}$ 是 $\\arcsin 1$ 的值，相当于把积分上限当成了 $1$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\frac{\\pi}{3}=\\arccos\\frac{1}{2}$，是把 $\\arccos$ 与 $\\arcsin$ 的值记混了。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac{1}{2}$ 是积分上限而不是积分值；被积函数在区间上恒大于 $1$，积分值必大于 $0.5$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$\\int\\frac{dx}{\\sqrt{1-x^{2}}}=\\arcsin x$，故原式 $=\\arcsin\\frac{1}{2}-\\arcsin 0=\\frac{\\pi}{6}$。</span></div>"
  },
  {
   "id": "ch07-q8",
   "ch": "ch07",
   "type": "mcq",
   "difficulty": 2,
   "kp": "7.6 反三角函数", "tags": ["exam","output"],
   "scope": "final",
   "stem": "$\\int\\frac{dx}{\\sqrt{4x-x^{2}}}=$ ?",
   "options": [
    {
     "text": "$\\frac{1}{2}\\arcsin\\frac{x-2}{2}+C$",
     "correct": false
    },
    {
     "text": "$\\arctan\\frac{x-2}{2}+C$",
     "correct": false
    },
    {
     "text": "$\\arcsin(x-2)+C$",
     "correct": false
    },
    {
     "text": "$\\arcsin\\frac{x-2}{2}+C$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。此处 $du=dx$，换元不产生系数 $\\frac{1}{2}$；只有 $u=2x+1$ 那类换元才留系数。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。根号内是平方差 $a^{2}-u^{2}$ 用 $\\arcsin$，分母为 $a^{2}+u^{2}$ 时才用 $\\arctan$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。漏了除以 $a=2$：公式是 $\\arcsin\\frac{u}{a}$，不是 $\\arcsin u$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。配方得 $4x-x^{2}=4-(x-2)^{2}$，取 $a=2,u=x-2$，套 $\\int\\frac{du}{\\sqrt{a^{2}-u^{2}}}=\\arcsin\\frac{u}{a}+C$。</span></div>"
  },
  {
   "id": "ch07-q9",
   "ch": "ch07",
   "type": "mcq",
   "difficulty": 1,
   "kp": "7.7 双曲函数", "tags": ["exam","output"],
   "scope": "final",
   "stem": "$\\int\\operatorname{csch}^{2}x dx=$ ?",
   "options": [
    {
     "text": "$-\\coth x+C$",
     "correct": true
    },
    {
     "text": "$\\coth x+C$",
     "correct": false
    },
    {
     "text": "$-\\operatorname{csch}x\\coth x+C$",
     "correct": false
    },
    {
     "text": "$-\\tanh x+C$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。因为 $\\frac{d}{dx}\\coth x=-\\operatorname{csch}^{2}x$，反过来积分即得 $-\\coth x+C$，负号是关键。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。漏了负号：$\\coth$ 的导数是 $-\\operatorname{csch}^{2}x$，原函数必须带负号。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$-\\operatorname{csch}x\\coth x$ 是 $\\operatorname{csch}x$ 的导数，其积分为 $-\\operatorname{csch}x+C$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。把 $\\coth$ 与 $\\tanh$ 混了；$\\int\\operatorname{sech}^{2}x dx=\\tanh x+C$ 才是无负号的那一组。</span></div>"
  },
  {
   "id": "ch07-q10",
   "ch": "ch07",
   "type": "mcq",
   "difficulty": 2,
   "kp": "7.8 相对增长率", "tags": ["exam","output"],
   "scope": "final",
   "stem": "$\\lim_{x\\to\\infty}\\frac{\\ln x}{x^{0.1}}=$ ?",
   "options": [
    {
     "text": "$\\frac{1}{10}$",
     "correct": false
    },
    {
     "text": "$10$",
     "correct": false
    },
    {
     "text": "$0$",
     "correct": true
    },
    {
     "text": "$\\infty$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac{1}{10}$ 来自 $x^{0.1}$ 的指数位置，与比值的极限无关。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$10$ 是对 $x^{0.1}$ 求导时出现的系数，不是比值的极限值。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。洛必达得 $\\lim\\frac{1/x}{0.1x^{-0.9}}=\\lim\\frac{10}{x^{0.1}}=0$，即任何正幂都快于 $\\ln x$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。把增长率阶梯记反了：$\\ln x\\ll x^{p}\\ll a^{x}\\ll x^{x}$，对数是最慢的一级。</span></div>"
  },
  {
   "id": "ch08-q1",
   "ch": "ch08",
   "type": "mcq",
   "difficulty": 1,
   "kp": "8.1 用基本积分公式", "tags": ["exam","output","trap"],
   "scope": "final",
   "stem": "$\\int \\frac{dx}{\\sqrt{25-x^{2}}}=$ ?",
   "options": [
    {
     "text": "$\\sin^{-1}x+C$",
     "correct": false
    },
    {
     "text": "$\\sin^{-1}\\frac{x}{5}+C$",
     "correct": true
    },
    {
     "text": "$\\frac{1}{5}\\sin^{-1}\\frac{x}{5}+C$",
     "correct": false
    },
    {
     "text": "$\\ln\\left|x+\\sqrt{25-x^{2}}\\right|+C$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。漏掉了 $\\frac{x}{a}$ 里的 $a=5$，反三角内应是 $\\frac{x}{5}$ 而不是 $x$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。套用 $\\int \\frac{dx}{\\sqrt{a^{2}-x^{2}}}=\\sin^{-1}\\frac{x}{a}+C$，取 $a=5$ 即得。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。该公式前没有系数 $\\frac{1}{a}$；$\\frac{1}{a}$ 只出现在 $\\int \\frac{dx}{a^{2}+x^{2}}=\\frac{1}{a}\\tan^{-1}\\frac{x}{a}+C$ 中。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。对数型来自 $\\int \\frac{dx}{\\sqrt{x^{2}+a^{2}}}$；$\\sqrt{25-x^{2}}$ 属反正弦型，不是对数型。</span></div>"
  },
  {
   "id": "ch08-q2",
   "ch": "ch08",
   "type": "mcq",
   "difficulty": 2,
   "kp": "8.1 用基本积分公式", "tags": ["exam","output","trap"],
   "scope": "final",
   "stem": "$\\int \\frac{4x^{2}}{x^{2}+1}\\,dx=$ ?",
   "options": [
    {
     "text": "$4x+C$",
     "correct": false
    },
    {
     "text": "$4x-\\tan^{-1}x+C$",
     "correct": false
    },
    {
     "text": "$4x-4\\tan^{-1}x+C$",
     "correct": true
    },
    {
     "text": "$2\\ln(x^{2}+1)+C$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。只积了长除得到的整项 $4$，把余项 $-\\frac{4}{x^{2}+1}$ 整个漏掉了。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。长除后是 $4-\\frac{4}{x^{2}+1}$，积余项时漏了分子上的 $4$，应为 $4\\tan^{-1}x$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。假分式先长除：$\\frac{4x^{2}}{x^{2}+1}=4-\\frac{4}{x^{2}+1}$，逐项积分得 $4x-4\\tan^{-1}x+C$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\int \\frac{dx}{x^{2}+1}=\\tan^{-1}x$ 而不是 $\\ln$；长除给出的整项 $4x$ 也不能丢。</span></div>"
  },
  {
   "id": "ch08-q3",
   "ch": "ch08",
   "type": "mcq",
   "difficulty": 1,
   "kp": "8.2 分部积分", "tags": ["exam","output"],
   "scope": "final",
   "stem": "$\\int x\\cos x\\,dx=$ ?",
   "options": [
    {
     "text": "$x\\sin x+\\cos x+C$",
     "correct": true
    },
    {
     "text": "$x\\sin x-\\cos x+C$",
     "correct": false
    },
    {
     "text": "$-x\\sin x+\\cos x+C$",
     "correct": false
    },
    {
     "text": "$\\frac{x^{2}}{2}\\sin x+C$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。取 $u=x,\\ dv=\\cos x\\,dx$，则 $v=\\sin x$，得 $x\\sin x-\\int \\sin x\\,dx=x\\sin x+\\cos x+C$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$-\\int \\sin x\\,dx=+\\cos x$，这里把末项符号写反了（$\\int \\sin x\\,dx=-\\cos x$）。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$v=\\sin x$（$\\int \\cos x\\,dx$ 不带负号），所以 $uv=x\\sin x$ 应为正，这里符号反了。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。把 $x$ 当成常数提出去了；两个函数相乘必须用分部积分。</span></div>"
  },
  {
   "id": "ch08-q4",
   "ch": "ch08",
   "type": "mcq",
   "difficulty": 3,
   "kp": "8.2 分部积分", "tags": ["exam","output","trap"],
   "scope": "final",
   "stem": "$\\int e^{x}\\sin x\\,dx=$ ?",
   "options": [
    {
     "text": "$\\frac{e^{x}(\\cos x-\\sin x)}{2}+C$",
     "correct": false
    },
    {
     "text": "$e^{x}(\\sin x-\\cos x)+C$",
     "correct": false
    },
    {
     "text": "$\\frac{e^{x}(\\sin x+\\cos x)}{2}+C$",
     "correct": false
    },
    {
     "text": "$\\frac{e^{x}(\\sin x-\\cos x)}{2}+C$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。符号反了：对它求导得 $-e^{x}\\sin x$，与被积函数差一个负号。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。漏了移项后除以 $2$：对它求导得 $2e^{x}\\sin x$，是正确答案的 $2$ 倍。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。这是 $\\int e^{x}\\cos x\\,dx$ 的结果，两个循环型积分的答案记混了（求导得 $e^{x}\\cos x$）。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。两次分部后原积分重现：$I=-e^{x}\\cos x+e^{x}\\sin x-I$，移项得 $2I=e^{x}(\\sin x-\\cos x)$。</span></div>"
  },
  {
   "id": "ch08-q5",
   "ch": "ch08",
   "type": "mcq",
   "difficulty": 2,
   "kp": "8.3 三角积分", "tags": ["exam","output"],
   "scope": "final",
   "stem": "$\\int \\sin^{3}x\\,dx=$ ?",
   "options": [
    {
     "text": "$\\cos x-\\frac{\\cos^{3}x}{3}+C$",
     "correct": false
    },
    {
     "text": "$\\frac{\\cos^{3}x}{3}-\\cos x+C$",
     "correct": true
    },
    {
     "text": "$\\frac{\\sin^{4}x}{4}+C$",
     "correct": false
    },
    {
     "text": "$-\\frac{\\cos^{4}x}{4}+C$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。整体差一个负号：换元时 $\\sin x\\,dx=-du$ 会带出负号，此项求导得 $-\\sin^{3}x$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。拆出一个 $\\sin x$ 配 $dx$，用 $\\sin^{2}x=1-\\cos^{2}x$ 并令 $u=\\cos x$，得 $-\\int(1-u^{2})du=\\frac{u^{3}}{3}-u+C$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\sin^{3}x$ 不是幂函数，不能直接套 $\\int u^{n}du$；要先把它化成 $\\cos x$ 的多项式。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。只把 $\\sin^{3}x$ 写成 $\\sin x\\cdot\\sin^{2}x$ 是不够的，还要把 $\\sin^{2}x$ 换成 $1-\\cos^{2}x$ 再换元。</span></div>"
  },
  {
   "id": "ch08-q6",
   "ch": "ch08",
   "type": "mcq",
   "difficulty": 1,
   "kp": "8.4 三角代换", "tags": ["exam","output"],
   "scope": "final",
   "stem": "计算 $\\int \\sqrt{4-x^{2}}\\,dx$ 时，最合适的三角代换是？",
   "options": [
    {
     "text": "$x=2\\sec\\theta$",
     "correct": false
    },
    {
     "text": "$x=2\\tan\\theta$",
     "correct": false
    },
    {
     "text": "$x=2\\sin\\theta$",
     "correct": true
    },
    {
     "text": "$x=\\frac{1}{2}\\sin\\theta$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$x=a\\sec\\theta$ 用于 $\\sqrt{x^{2}-a^{2}}$ 型；代入 $\\sqrt{4-x^{2}}$ 得不到 $a\\cos\\theta$ 的化简。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$x=a\\tan\\theta$ 用于 $\\sqrt{a^{2}+x^{2}}$ 型；代入会得到 $\\sqrt{4-4\\tan^{2}\\theta}$，无法化简。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。根式属 $\\sqrt{a^{2}-x^{2}}$ 型（$a=2$），令 $x=2\\sin\\theta$ 得 $\\sqrt{4-x^{2}}=2\\cos\\theta$、$dx=2\\cos\\theta\\,d\\theta$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。系数应是 $a=2$ 而不是 $\\frac{1}{2}$；$\\sqrt{a^{2}-x^{2}}$ 型要令 $x=a\\sin\\theta$。</span></div>"
  },
  {
   "id": "ch08-q7",
   "ch": "ch08",
   "type": "mcq",
   "difficulty": 2,
   "kp": "8.5 部分分式", "tags": ["exam","output"],
   "scope": "final",
   "stem": "分式 $\\frac{x+3}{(x-1)^{2}(x^{2}+1)}$ 的部分分式分解形式为？",
   "options": [
    {
     "text": "$\\frac{A}{x-1}+\\frac{B}{(x-1)^{2}}+\\frac{Cx+D}{x^{2}+1}$",
     "correct": true
    },
    {
     "text": "$\\frac{A}{(x-1)^{2}}+\\frac{Bx+C}{x^{2}+1}$",
     "correct": false
    },
    {
     "text": "$\\frac{A}{x-1}+\\frac{B}{(x-1)^{2}}+\\frac{C}{x^{2}+1}$",
     "correct": false
    },
    {
     "text": "$\\frac{A}{x-1}+\\frac{Bx+C}{(x-1)^{2}}+\\frac{Dx+E}{x^{2}+1}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。二重线性因子要写满两个次幂，不可约二次因子的分子必须是一次式 $Cx+D$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$(x-1)^{2}$ 是二重因子，必须写满 $\\frac{A}{x-1}+\\frac{B}{(x-1)^{2}}$，这里漏了低次幂项。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。不可约二次因子 $x^{2}+1$ 的分子必须是一次式 $Cx+D$，写成常数 $C$ 会漏解。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。二重线性因子 $(x-1)^{2}$ 的分子应是常数 $B$，一次式分子只用于不可约二次因子。</span></div>"
  },
  {
   "id": "ch08-q8",
   "ch": "ch08",
   "type": "mcq",
   "difficulty": 2,
   "kp": "8.6 积分表与 CAS", "tags": ["exam","concept"],
   "scope": "final",
   "stem": "下列积分中不能用初等函数表示（即非初等积分）的是？",
   "options": [
    {
     "text": "$\\int e^{-x}\\,dx$",
     "correct": false
    },
    {
     "text": "$\\int xe^{-x^{2}}\\,dx$",
     "correct": false
    },
    {
     "text": "$\\int \\frac{dx}{1+x^{2}}$",
     "correct": false
    },
    {
     "text": "$\\int e^{-x^{2}}\\,dx$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\int e^{-x}dx=-e^{-x}+C$，是初等函数（基本指数公式）。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。换元 $u=-x^{2}$（$du=-2x\\,dx$）即得 $-\\frac{1}{2}e^{-x^{2}}+C$，有初等原函数。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。这是基本公式 $\\int \\frac{dx}{1+x^{2}}=\\tan^{-1}x+C$，原函数是初等函数。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$\\int e^{-x^{2}}dx$ 的原函数存在但无法用初等函数有限组合表示，只能查表、数值积分或展成幂级数。</span></div>"
  },
  {
   "id": "ch08-q9",
   "ch": "ch08",
   "type": "mcq",
   "difficulty": 2,
   "kp": "8.7 数值积分", "tags": ["exam","output"],
   "scope": "final",
   "stem": "用梯形法（$n=2$）近似 $\\int_{0}^{2}x^{2}\\,dx$，得 $T=$ ?",
   "options": [
    {
     "text": "$6$",
     "correct": false
    },
    {
     "text": "$3$",
     "correct": true
    },
    {
     "text": "$\\frac{8}{3}$",
     "correct": false
    },
    {
     "text": "$4$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。漏乘了 $\\frac{\\Delta x}{2}=\\frac{1}{2}$：$0+2\\cdot 1+4=6$ 只是加权和，还要再乘 $\\frac{1}{2}$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$\\Delta x=1$，$y_{0}=0,y_{1}=1,y_{2}=4$，$T=\\frac{1}{2}(0+2\\cdot 1+4)=3$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac{8}{3}$ 是精确值（$x^{2}$ 为 $\\le3$ 次多项式时 $n=2$ 辛普森法也给出它），而梯形法只给近似值 $3$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。这是把中间点系数记成了辛普森法的 $4$：$\\frac{1}{2}(0+4\\cdot 1+4)=4$；梯形法中间点系数是 $2$。</span></div>"
  },
  {
   "id": "ch08-q10",
   "ch": "ch08",
   "type": "mcq",
   "difficulty": 3,
   "kp": "8.8 反常积分", "tags": ["exam","concept","trap"],
   "scope": "final",
   "stem": "下列反常积分中收敛的是？",
   "options": [
    {
     "text": "$\\int_{1}^{\\infty}\\frac{dx}{x^{0.999}}$",
     "correct": false
    },
    {
     "text": "$\\int_{0}^{1}\\frac{dx}{x^{1.001}}$",
     "correct": false
    },
    {
     "text": "$\\int_{1}^{\\infty}\\frac{dx}{x^{1.001}}$",
     "correct": true
    },
    {
     "text": "$\\int_{1}^{\\infty}\\frac{dx}{\\sqrt{x}}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$p=0.999\\le 1$；$\\int_{1}^{\\infty}\\frac{dx}{x^{p}}$ 在 $p\\le 1$ 时发散。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。这是 Type II（瑕点在 $x=0$）：$\\int_{0}^{1}\\frac{dx}{x^{p}}$ 在 $p\\ge 1$ 时发散，此处 $p=1.001$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$p=1.001>1$，由 $p$-积分标杆结论 $\\int_{1}^{\\infty}\\frac{dx}{x^{p}}$ 收敛（值为 $\\frac{1}{p-1}$）。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$p=\\frac{1}{2}\\le 1$，$\\int_{1}^{\\infty}x^{-1/2}dx=\\lim_{b\\to\\infty}2(\\sqrt{b}-1)$ 发散。</span></div>"
  },
  {
   "id": "ch08-q11",
   "ch": "ch08",
   "type": "mcq",
   "difficulty": 1,
   "kp": "8.1 用基本积分公式", "tags": ["exam","output"],
   "scope": "final",
   "stem": "$\\int_{-\\pi/2}^{\\pi/2}x^{2}\\sin x\\,dx=$ ?",
   "options": [
    {
     "text": "$0$",
     "correct": true
    },
    {
     "text": "$2(\\pi-2)$",
     "correct": false
    },
    {
     "text": "$2(2-\\pi)$",
     "correct": false
    },
    {
     "text": "$\\pi-2$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$x^{2}$ 是偶函数、$\\sin x$ 是奇函数，乘积 $x^{2}\\sin x$ 是奇函数；奇函数在对称区间 $[-\\pi/2,\\pi/2]$ 上的积分为 $0$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。误把 $x^{2}\\sin x$ 当成偶函数而算成了 $2\\int_{0}^{\\pi/2}x^{2}\\sin x\\,dx$。偶×奇＝奇，对称区间上的积分只能是 $0$，这个值本身（$2\\int_{0}^{\\pi/2}x^{2}\\sin x\\,dx=2(\\pi-2)$）只对偶函数成立。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。同样把被积函数误判成偶函数，并且在代入原函数 $\\int x^{2}\\sin x\\,dx=-x^{2}\\cos x+2x\\sin x+2\\cos x$ 时把符号用反，才得到这个负值。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\pi-2$ 是 $\\int_{0}^{\\pi/2}x^{2}\\sin x\\,dx$ 的值：既误判了奇偶性，又只算了半个区间而没有乘 $2$。</span></div>"
  },
  {
   "id": "ch08-q12",
   "ch": "ch08",
   "type": "mcq",
   "difficulty": 1,
   "kp": "8.2 分部积分", "tags": ["exam","output"],
   "scope": "final",
   "stem": "$\\int \\ln x\\,dx=$ ?",
   "options": [
    {
     "text": "$x\\ln x+x+C$",
     "correct": false
    },
    {
     "text": "$\\frac{(\\ln x)^{2}}{2}+C$",
     "correct": false
    },
    {
     "text": "$x\\ln x-x+C$",
     "correct": true
    },
    {
     "text": "$\\frac{1}{x}+C$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。分部积分后是 $x\\ln x-\\int x\\cdot\\frac{1}{x}dx=x\\ln x-x$，末项带负号；写成 $+x$ 是把 $\\int v\\,du$ 前的负号丢掉了。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。把 $\\ln x$ 当成幂函数去凑 $\\int u\\,du$。这里 $\\ln x$ 与 $dx$ 之间没有可配的导数关系（$d(\\ln x)=\\frac{dx}{x}$，与 $dx$ 配不上），必须用分部积分。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。把被积函数写成 $(\\ln x)\\cdot 1$，凑出 $\\int u\\,dv$：取 $u=\\ln x,\\ dv=dx$（则 $v=x$，$du=\\frac{dx}{x}$），得 $\\int\\ln x\\,dx=x\\ln x-\\int x\\cdot\\frac{1}{x}dx=x\\ln x-x+C$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{1}{x}$ 是 $\\ln x$ 的导数而不是它的原函数（$\\int\\frac{dx}{x}=\\ln|x|+C$），把求导和积分的方向弄反了。</span></div>"
  },
  {
   "id": "ch08-q13",
   "ch": "ch08",
   "type": "mcq",
   "difficulty": 2,
   "kp": "8.2 分部积分", "tags": ["exam","output","trap"],
   "scope": "final",
   "stem": "$\\int_{0}^{1}xe^{-x}\\,dx=$ ?",
   "options": [
    {
     "text": "$1-\\frac{1}{e}$",
     "correct": false
    },
    {
     "text": "$1-\\frac{2}{e}$",
     "correct": true
    },
    {
     "text": "$1$",
     "correct": false
    },
    {
     "text": "$-\\frac{1}{e}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。只算了分部后新出现的 $\\int_{0}^{1}e^{-x}dx=1-\\frac{1}{e}$，把边界项 $[uv]_{0}^{1}=[-xe^{-x}]_{0}^{1}=-\\frac{1}{e}$ 整个漏掉了。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。取 $u=x,\\ dv=e^{-x}dx$，则 $v=-e^{-x}$，$du=dx$：$\\int_{0}^{1}xe^{-x}dx=\\big[-xe^{-x}\\big]_{0}^{1}-\\int_{0}^{1}(-e^{-x})dx=-\\frac{1}{e}+\\left(1-\\frac{1}{e}\\right)=1-\\frac{2}{e}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。把边界项 $\\big[-xe^{-x}\\big]_{0}^{1}$ 代成了 $+\\frac{1}{e}$（$v=-e^{-x}$ 的负号丢了），再加上 $\\int_{0}^{1}e^{-x}dx=1-\\frac{1}{e}$ 才会得 $1$；正确代值是 $-e^{-1}-0=-\\frac{1}{e}$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。这是只算到边界项 $\\big[-xe^{-x}\\big]_{0}^{1}=-\\frac{1}{e}$ 就停手，把后面的 $-\\int_{0}^{1}v\\,du=+\\int_{0}^{1}e^{-x}dx$ 丢了，分部积分只做了一半。</span></div>"
  },
  {
   "id": "ch08-q14",
   "ch": "ch08",
   "type": "mcq",
   "difficulty": 2,
   "kp": "8.3 三角积分", "tags": ["exam","output","trap"],
   "scope": "final",
   "stem": "$\\int \\sin 3x\\cos 2x\\,dx=$ ?",
   "options": [
    {
     "text": "$-\\frac{1}{10}\\cos 5x+\\frac{1}{2}\\cos x+C$",
     "correct": false
    },
    {
     "text": "$-\\frac{1}{2}\\cos 5x-\\frac{1}{2}\\cos x+C$",
     "correct": false
    },
    {
     "text": "$\\frac{1}{10}\\cos 5x+\\frac{1}{2}\\cos x+C$",
     "correct": false
    },
    {
     "text": "$-\\frac{1}{10}\\cos 5x-\\frac{1}{2}\\cos x+C$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。积化和差后是 $\\frac{1}{2}(\\sin 5x+\\sin x)$，而 $\\int\\sin x\\,dx=-\\cos x$ 带负号，第二项应为 $-\\frac{1}{2}\\cos x$；这里把 $\\sin x$ 的积分符号写成了正。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。对 $\\sin 5x$ 积分时漏掉内层系数：$\\int\\sin 5x\\,dx=-\\frac{\\cos 5x}{5}$，前面的系数应是 $\\frac{1}{2}\\cdot\\frac{1}{5}=\\frac{1}{10}$ 而不是 $\\frac{1}{2}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\int\\sin u\\,du=-\\cos u$，两项积分都应带负号，这里把整体符号弄反了（对结果求导得 $-\\sin 3x\\cos 2x$，与被积函数差一个负号）。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。两个角不同，不能用 $\\sin^{2}+\\cos^{2}=1$，要用积化和差：$\\sin 3x\\cos 2x=\\frac{1}{2}[\\sin 5x+\\sin x]$，故原式 $=\\frac{1}{2}\\left(-\\frac{\\cos 5x}{5}-\\cos x\\right)+C=-\\frac{1}{10}\\cos 5x-\\frac{1}{2}\\cos x+C$。</span></div>"
  },
  {
   "id": "ch08-q15",
   "ch": "ch08",
   "type": "mcq",
   "difficulty": 3,
   "kp": "8.3 三角积分", "tags": ["exam","output","trap"],
   "scope": "final",
   "stem": "$\\int \\sin^{2}x\\cos^{2}x\\,dx=$ ?",
   "options": [
    {
     "text": "$\\frac{x}{8}-\\frac{\\sin 4x}{32}+C$",
     "correct": true
    },
    {
     "text": "$\\frac{x}{8}+\\frac{\\sin 4x}{32}+C$",
     "correct": false
    },
    {
     "text": "$\\frac{x}{4}-\\frac{\\sin 4x}{16}+C$",
     "correct": false
    },
    {
     "text": "$\\frac{\\sin^{3}2x}{24}+C$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$m,n$ 均偶，用半角降幂：$\\sin^{2}x\\cos^{2}x=\\frac{\\sin^{2}2x}{4}=\\frac{1-\\cos 4x}{8}$，积分得 $\\frac{x}{8}-\\frac{\\sin 4x}{32}+C$；求导回验 $\\frac{1}{8}-\\frac{4\\cos 4x}{32}=\\frac{1-\\cos 4x}{8}$ ✓。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\int\\cos 4x\\,dx=\\frac{\\sin 4x}{4}$ 前面还带着 $\\frac{1-\\cos 4x}{8}$ 中的负号，末项应为 $-\\frac{\\sin 4x}{32}$；此项求导得 $\\frac{1+\\cos 4x}{8}\\ne\\sin^{2}x\\cos^{2}x$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。把半角公式 $\\sin^{2}2x=\\frac{1-\\cos 4x}{2}$ 里的 $\\frac{1}{2}$ 漏掉了：正确的系数是 $\\frac{1}{8}$ 而不是 $\\frac{1}{4}$，两者恰好差一倍。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。把 $\\int\\sin^{2}2x\\,dx$ 当成幂函数积分了。$\\sin^{2}2x$ 必须先降幂成 $\\frac{1-\\cos 4x}{2}$ 再积分；且 $\\frac{\\sin^{3}2x}{24}$ 求导得 $\\frac{\\sin^{2}2x\\cos 2x}{4}\\ne\\sin^{2}x\\cos^{2}x$。</span></div>"
  },
  {
   "id": "ch08-q16",
   "ch": "ch08",
   "type": "mcq",
   "difficulty": 2,
   "kp": "8.4 三角代换", "tags": ["exam","output"],
   "scope": "final",
   "stem": "$\\int\\frac{dx}{\\sqrt{x^{2}-4}}$（$x>2$）$=$ ?",
   "options": [
    {
     "text": "$\\sin^{-1}\\frac{x}{2}+C$",
     "correct": false
    },
    {
     "text": "$\\ln\\left|x+\\sqrt{x^{2}+4}\\right|+C$",
     "correct": false
    },
    {
     "text": "$\\ln\\left|x+\\sqrt{x^{2}-4}\\right|+C$",
     "correct": true
    },
    {
     "text": "$\\frac{1}{4}\\ln\\left|\\frac{x-2}{x+2}\\right|+C$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\sin^{-1}\\frac{x}{2}$ 在 $x>2$ 时根本没有定义，而且它是 $\\sqrt{4-x^{2}}$（即 $\\sqrt{a^{2}-x^{2}}$ 型）的原函数，求导得 $\\frac{1}{\\sqrt{4-x^{2}}}$；本题根式属 $\\sqrt{x^{2}-a^{2}}$ 型，应令 $x=2\\sec\\theta$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。这是 $\\sqrt{x^{2}+a^{2}}$ 型（$a=2$）的结果：$\\sqrt{x^{2}+4}$ 要令 $x=2\\tan\\theta$，$\\sqrt{x^{2}-4}$ 要令 $x=2\\sec\\theta$，两者不能混；对它求导得 $\\frac{1}{\\sqrt{x^{2}+4}}$，不等于被积函数。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。令 $x=2\\sec\\theta$（$0<\\theta<\\frac{\\pi}{2}$），则 $dx=2\\sec\\theta\\tan\\theta\\,d\\theta$、$\\sqrt{x^{2}-4}=2\\tan\\theta$，原式 $=\\int\\sec\\theta\\,d\\theta=\\ln|\\sec\\theta+\\tan\\theta|+C$；由参考三角形（邻边 $2$、斜边 $x$）回代得 $\\ln\\left|x+\\sqrt{x^{2}-4}\\right|+C$（常数 $-\\ln 2$ 并入 $C$）。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{1}{4}\\ln\\left|\\frac{x-2}{x+2}\\right|$ 是部分分式法算 $\\int\\frac{dx}{x^{2}-4}$ 的结果，求导得 $\\frac{1}{x^{2}-4}$；本题被积函数含根号，不能按有理式去拆。</span></div>"
  },
  {
   "id": "ch08-q17",
   "ch": "ch08",
   "type": "mcq",
   "difficulty": 2,
   "kp": "8.5 部分分式", "tags": ["exam","output","trap"],
   "scope": "final",
   "stem": "$\\int\\frac{2x+3}{(x+1)^{2}}\\,dx=$ ?",
   "options": [
    {
     "text": "$2\\ln|x+1|+\\frac{1}{x+1}+C$",
     "correct": false
    },
    {
     "text": "$2\\ln|x+1|-\\frac{1}{x+1}+C$",
     "correct": true
    },
    {
     "text": "$2\\ln|x+1|-\\frac{1}{(x+1)^{2}}+C$",
     "correct": false
    },
    {
     "text": "$\\ln|x+1|-\\frac{1}{x+1}+C$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\int\\frac{du}{u^{2}}=-\\frac{1}{u}$，重因子项的积分带负号，应为 $-\\frac{1}{x+1}$；此项求导得 $\\frac{2}{x+1}-\\frac{1}{(x+1)^{2}}=\\frac{2x+1}{(x+1)^{2}}$，分子不对。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。按重因子拆法设 $\\frac{2x+3}{(x+1)^{2}}=\\frac{A}{x+1}+\\frac{B}{(x+1)^{2}}$，通分比较系数得 $A=2$、$A+B=3$ 即 $B=1$；逐项积分得 $2\\ln|x+1|-\\frac{1}{x+1}+C$（求导回验 $\\frac{2}{x+1}+\\frac{1}{(x+1)^{2}}=\\frac{2x+3}{(x+1)^{2}}$ ✓）。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。幂函数公式 $\\int u^{n}du=\\frac{u^{n+1}}{n+1}$ 在 $n=-2$ 时给出 $\\frac{(x+1)^{-1}}{-1}=-\\frac{1}{x+1}$；写成 $-\\frac{1}{(x+1)^{2}}$ 是漏了指数加一这一步，求导得 $\\frac{2}{(x+1)^{3}}$，与原被积函数不符。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。赋值 $x=-1$ 只能定出重因子项的分子 $B=1$，比较 $x$ 的系数还得 $A=2$；把 $\\frac{2}{x+1}$ 写成 $\\frac{1}{x+1}$ 是漏掉了系数 $2$。</span></div>"
  },
  {
   "id": "ch08-q18",
   "ch": "ch08",
   "type": "mcq",
   "difficulty": 2,
   "kp": "8.6 积分表与 CAS", "tags": ["exam","output"],
   "scope": "final",
   "stem": "$\\int\\tan^{3}x\\,dx=$ ?",
   "options": [
    {
     "text": "$\\frac{1}{3}\\tan^{3}x+C$",
     "correct": false
    },
    {
     "text": "$\\frac{1}{2}\\tan^{2}x-\\ln|\\cos x|+C$",
     "correct": false
    },
    {
     "text": "$\\tan^{2}x+\\ln|\\cos x|+C$",
     "correct": false
    },
    {
     "text": "$\\frac{1}{2}\\tan^{2}x+\\ln|\\cos x|+C$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\tan^{3}x$ 是三角函数的幂而不是 $x$ 的幂，不能直接套 $\\int u^{n}du$；此项求导得 $\\tan^{2}x\\sec^{2}x=\\tan^{2}x+\\tan^{4}x\\ne\\tan^{3}x$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。降次公式 $\\int\\tan^{n}x\\,dx=\\frac{1}{n-1}\\tan^{n-1}x-\\int\\tan^{n-2}x\\,dx$ 中剩下的是 $-\\int\\tan x\\,dx=-\\ln|\\sec x|=\\ln|\\cos x|$，符号应为加；此项求导得 $\\tan x\\sec^{2}x+\\tan x=\\tan^{3}x+2\\tan x$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。降次公式的系数是 $\\frac{1}{n-1}=\\frac{1}{2}$（$n=3$）而不是 $1$；此项求导得 $2\\tan x\\sec^{2}x-\\tan x=2\\tan^{3}x+\\tan x$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。套降次公式（$n=3$）：$\\int\\tan^{3}x\\,dx=\\frac{1}{2}\\tan^{2}x-\\int\\tan x\\,dx=\\frac{1}{2}\\tan^{2}x+\\ln|\\cos x|+C$；求导回验 $\\tan x\\sec^{2}x-\\tan x=\\tan x(\\sec^{2}x-1)=\\tan^{3}x$ ✓。</span></div>"
  },
  {
   "id": "ch08-q19",
   "ch": "ch08",
   "type": "mcq",
   "difficulty": 3,
   "kp": "8.7 数值积分", "tags": ["exam","output","trap"],
   "scope": "final",
   "stem": "用辛普森法计算 $\\int_{0}^{2}3x^{4}\\,dx$，若要求误差小于 $10^{-3}$，由误差界公式至少应取多少个子区间 $n$？",
   "options": [
    {
     "text": "$11$",
     "correct": false
    },
    {
     "text": "$10$",
     "correct": false
    },
    {
     "text": "$12$",
     "correct": true
    },
    {
     "text": "$6$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。解 $\\frac{12.8}{n^{4}}<10^{-3}$ 得 $n>10.63$，向上取整确实得 $11$，但辛普森法要求 $n$ 为偶数，$11$ 不能使用，必须再取到 $12$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$n=10$ 时误差界为 $\\frac{12.8}{10^{4}}=1.28\\times10^{-3}>10^{-3}$，不满足要求；把 $n>10.63$ 向下取整就会得到一个不达标的 $n$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$f^{(4)}=72$ 为常数，取 $M=72$，由 $|E_{S}|\\le\\frac{M(b-a)^{5}}{180n^{4}}=\\frac{72\\cdot 2^{5}}{180n^{4}}=\\frac{12.8}{n^{4}}$；令 $\\frac{12.8}{n^{4}}<10^{-3}$ 得 $n^{4}>12800$、$n>10.63$，且 $n$ 须为偶数，故最小 $n=12$（此时界为 $6.2\\times10^{-4}$）。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。这是漏掉 $(b-a)^{5}=2^{5}$ 中幂次的结果（只按 $(b-a)=2$ 的一次方算，界变成 $\\frac{0.8}{n^{4}}<10^{-3}$，得 $n\\ge 6$）；辛普森误差界中区间长度以 $5$ 次方出现。</span></div>"
  },
  {
   "id": "ch08-q20",
   "ch": "ch08",
   "type": "mcq",
   "difficulty": 1,
   "kp": "8.8 反常积分", "tags": ["exam","output"],
   "scope": "final",
   "stem": "$\\int_{1}^{\\infty}\\frac{dx}{x^{3/2}}=$ ?",
   "options": [
    {
     "text": "发散（$+\\infty$）",
     "correct": false
    },
    {
     "text": "$2$",
     "correct": true
    },
    {
     "text": "$-2$",
     "correct": false
    },
    {
     "text": "$\\frac{2}{3}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$p=\\frac{3}{2}>1$ 时 $\\int_{1}^{\\infty}\\frac{dx}{x^{p}}$ 收敛；只有把指数 $\\frac{3}{2}$ 误读成 $p=\\frac{2}{3}<1$ 才会判成发散。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$p=\\frac{3}{2}>1$，由 $p$-积分公式得 $\\int_{1}^{\\infty}\\frac{dx}{x^{3/2}}=\\frac{1}{p-1}=\\frac{1}{1/2}=2$；按定义验证：$\\lim_{b\\to\\infty}\\big[-2x^{-1/2}\\big]_{1}^{b}=\\lim_{b\\to\\infty}\\left(2-\\frac{2}{\\sqrt{b}}\\right)=2$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$-2$ 是误用了瑕点型公式 $\\int_{0}^{1}\\frac{dx}{x^{p}}=\\frac{1}{1-p}$（$p<1$）的结果（$\\frac{1}{1-3/2}=-2$）；本题是无穷区间（Type I），被积函数在 $[1,\\infty)$ 上无瑕点，应取 $\\frac{1}{p-1}$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。收敛值公式是 $\\frac{1}{p-1}=\\frac{1}{1/2}=2$，不是 $\\frac{1}{p}=\\frac{2}{3}$；$\\frac{2}{3}$ 是 $\\int_{0}^{1}\\sqrt{x}\\,dx$ 的值，与本题无关。</span></div>"
  },
  {
   "id": "ch09-q1",
   "ch": "ch09",
   "type": "mcq",
   "difficulty": 1,
   "kp": "9.1 Sequences（数列）", "tags": ["output"],
   "scope": "outside",
   "stem": "已知数列 $a_n=\\frac{\\ln n}{n}$，则 $\\lim_{n\\to\\infty}a_n=$ ?",
   "options": [
    {
     "text": "$0$",
     "correct": true
    },
    {
     "text": "$1$",
     "correct": false
    },
    {
     "text": "$\\infty$",
     "correct": false
    },
    {
     "text": "极限不存在",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。这是 Th 5 的六个常用极限之一：$\\lim_{n\\to\\infty}\\frac{\\ln n}{n}=0$，用洛必达法则算 $\\frac{1/x}{1}\\to0$ 即得。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$1$ 是 $\\lim\\sqrt[n]{n}$ 或 $\\lim x^{1/n}\\ (x>0)$ 的值；$\\ln n$ 增长慢于 $n$，比值趋于 $0$ 而不是 $1$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac{\\infty}{\\infty}$ 型用洛必达得 $\\frac{1/x}{1}\\to0$；分母 $n$ 增长远快于 $\\ln n$，故不趋于无穷。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。该数列有界且最终递减，极限存在且为 $0$；$\\ln n$ 虽无界，却被 $n$ 压住，不会出现无极限的情形。</span></div>"
  },
  {
   "id": "ch09-q2",
   "ch": "ch09",
   "type": "mcq",
   "difficulty": 1,
   "kp": "9.2 Infinite Series（无穷级数）", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "无穷级数 $\\sum_{n=1}^{\\infty}\\frac{2}{3^n}$ 的和是？",
   "options": [
    {
     "text": "$\\frac{2}{3}$",
     "correct": false
    },
    {
     "text": "$2$",
     "correct": false
    },
    {
     "text": "$1$",
     "correct": true
    },
    {
     "text": "$3$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac23$ 只是首项 $a_1$；收敛的几何级数之和是 $\\frac{a}{1-r}$，不是首项本身。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$2$ 相当于把公式记成 $\\frac{a}{r}=\\frac{2/3}{1/3}$，漏掉了分母中 $1-r$ 里的那个 $1$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。这是首项 $a=\\frac23$、公比 $r=\\frac13$ 的几何级数，$|r|<1$，和为 $\\frac{a}{1-r}=\\frac{2/3}{2/3}=1$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$3$ 相当于把首项取成 $2$ 再算 $\\frac{2}{1-1/3}$，忽略了通项分母中的 $3^n$ 使首项是 $\\frac23$。</span></div>"
  },
  {
   "id": "ch09-q3",
   "ch": "ch09",
   "type": "mcq",
   "difficulty": 2,
   "kp": "9.7 Power Series（幂级数）", "tags": ["output"],
   "scope": "outside",
   "stem": "幂级数 $\\sum_{n=1}^{\\infty}\\frac{(x-2)^n}{n\\cdot3^n}$ 的收敛域是？",
   "options": [
    {
     "text": "$(-1,5)$",
     "correct": false
    },
    {
     "text": "$(-1,5]$",
     "correct": false
    },
    {
     "text": "$[-3,3]$",
     "correct": false
    },
    {
     "text": "$[-1,5)$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$(-1,5)$ 漏检了两个端点：$x=-1$ 处 $\\sum\\frac{(-1)^n}{n}$ 由 Leibniz 判别法收敛，必须并入收敛域。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$x=5$ 处化为 $\\sum\\frac1n$ 是调和级数，发散；通项趋于 $0$ 只是必要条件，不能据此收进右端点。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$[-3,3]$ 把 $R=3$ 误当成以原点为中心的区间，而级数中心在 $x=2$，区间应是 $2\\pm3$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。比值法得 $\\frac{|x-2|}{3}<1$ 即 $R=3$；$x=5$ 时为调和级数发散，$x=-1$ 时为交错级数收敛，故为 $[-1,5)$。</span></div>"
  },
  {
   "id": "ch09-q4",
   "ch": "ch09",
   "type": "mcq",
   "difficulty": 2,
   "kp": "9.5 Absolute Convergence; The Ratio and Root Tests", "tags": ["output"],
   "scope": "outside",
   "stem": "级数 $\\sum_{n=1}^{\\infty}\\frac{n!\\cdot3^n}{n^n}$ 的敛散性是？",
   "options": [
    {
     "text": "绝对收敛",
     "correct": false
    },
    {
     "text": "发散",
     "correct": true
    },
    {
     "text": "条件收敛",
     "correct": false
    },
    {
     "text": "比值法失效，需换其他判别法",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。含阶乘与指数应首选比值法，得 $\\rho=\\frac3e>1$，按 Th 13 直接判发散；只有 $\\rho<1$ 才绝对收敛。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$\\frac{a_{n+1}}{a_n}=3\\left(\\frac{n}{n+1}\\right)^n\\to\\frac3e>1$，由比值法（Th 13）判发散。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。条件收敛要求级数收敛而绝对值级数发散；本题各项为正且 $\\rho>1$ 已判发散，谈不上收敛。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\left(\\frac{n}{n+1}\\right)^n\\to\\frac1e\\ne0$，乘上系数 $3$ 后 $\\rho=\\frac3e\\ne1$，比值法没有失效。</span></div>"
  },
  {
   "id": "ch09-q5",
   "ch": "ch09",
   "type": "mcq",
   "difficulty": 2,
   "kp": "9.6 Alternating Series and Conditional Convergence", "tags": ["output"],
   "scope": "outside",
   "stem": "级数 $\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{\\sqrt n}$ 属于哪种类型？",
   "options": [
    {
     "text": "绝对收敛",
     "correct": false
    },
    {
     "text": "发散，因为它是 $p=\\frac12\\le1$ 的 $p$-级数",
     "correct": false
    },
    {
     "text": "条件收敛",
     "correct": true
    },
    {
     "text": "发散，因为通项不趋于 $0$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\sum|a_n|=\\sum n^{-1/2}$ 是 $p=\\frac12\\le1$ 的 $p$-级数，发散，所以原级数不绝对收敛。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$p\\le1$ 只说明加上绝对值后的级数发散；交错符号使原级数由 Leibniz 判别法收敛。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。Leibniz 判别法三条全满足故收敛；而 $\\sum\\frac{1}{n^{1/2}}$ 是 $p=\\frac12\\le1$ 的发散 $p$-级数，故为条件收敛。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$u_n=\\frac{1}{\\sqrt n}\\to0$，通项趋于 $0$，第 $n$ 项判别法的发散条件不成立。</span></div>"
  },
  {
   "id": "ch09-q6",
   "ch": "ch09",
   "type": "mcq",
   "difficulty": 2,
   "kp": "9.3 The Integral Test（积分判别法）", "tags": ["output"],
   "scope": "outside",
   "stem": "级数 $\\sum_{n=2}^{\\infty}\\frac{1}{n(\\ln n)^2}$ 的敛散性是？",
   "options": [
    {
     "text": "发散，因为它像调和级数",
     "correct": false
    },
    {
     "text": "发散，它是 $p=\\frac12$ 的 $p$-级数",
     "correct": false
    },
    {
     "text": "积分判别法不适用，无法判定",
     "correct": false
    },
    {
     "text": "收敛",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\sum\\frac{1}{n\\ln n}$ 才像调和级数一样发散；本题指数 $p=2>1$，同样的反常积分收敛。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\sum n^{-1/2}$ 才是 $p=\\frac12$ 的 $p$-级数；本题通项多出 $(\\ln n)^2$ 因子，不能套 $p$-级数结论。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$f$ 在 $[2,\\infty)$ 上连续、为正且递减，积分判别法（Th 9）的三个条件全满足，可以判定。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$\\int_2^{\\infty}\\frac{dx}{x(\\ln x)^2}=\\frac{1}{\\ln2}$ 收敛，且 $f$ 连续、正、递减，由 Th 9 级数收敛。</span></div>"
  },
  {
   "id": "ch09-q7",
   "ch": "ch09",
   "type": "mcq",
   "difficulty": 2,
   "kp": "9.4 Comparison Tests（比较判别法）", "tags": ["output"],
   "scope": "outside",
   "stem": "级数 $\\sum_{n=1}^{\\infty}\\frac{2n+1}{n^2+2n+1}$ 的敛散性是？",
   "options": [
    {
     "text": "发散",
     "correct": true
    },
    {
     "text": "收敛，因为通项趋于 $0$",
     "correct": false
    },
    {
     "text": "收敛，这是 $p=2>1$ 的 $p$-级数",
     "correct": false
    },
    {
     "text": "条件收敛",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。取 $b_n=\\frac2n$，$\\lim\\frac{a_n}{b_n}=1$，由极限比较（Th 11）与发散的 $\\sum\\frac2n$ 同敛散。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$a_n\\to0$ 只是收敛的必要条件，调和级数就是反例；本题还要继续用比较法才能判断。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$n^2+2n+1=(n+1)^2$，通项约为 $\\frac{2n}{n^2}=\\frac2n$，分母只比分子高一次幂，不是 $\\frac1{n^2}$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。条件收敛要求原级数本身收敛；本题是正项级数且已由极限比较判定为发散。</span></div>"
  },
  {
   "id": "ch09-q8",
   "ch": "ch09",
   "type": "mcq",
   "difficulty": 1,
   "kp": "9.8 Taylor and Maclaurin Series", "tags": ["output"],
   "scope": "outside",
   "stem": "$\\cos x$ 的 Maclaurin 级数中 $x^4$ 的系数是？",
   "options": [
    {
     "text": "$-\\frac{1}{24}$",
     "correct": false
    },
    {
     "text": "$\\frac{1}{24}$",
     "correct": true
    },
    {
     "text": "$\\frac{1}{4}$",
     "correct": false
    },
    {
     "text": "$0$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$k=2$ 时 $(-1)^k=+1$，符号为正；只有 $x^2$ 项（$k=1$）的系数才是 $-\\frac12$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$\\cos x=\\sum\\frac{(-1)^kx^{2k}}{(2k)!}$，$k=2$ 项即 $x^4$，系数 $\\frac{1}{4!}=\\frac{1}{24}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。分母应是 $(2k)!$ 而不是 $2k$，$k=2$ 时 $(2\\cdot2)!=4!=24$，所以不是 $\\frac14$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\cos x$ 是偶函数，只含偶次幂，$x^4$ 项确实存在，其系数 $\\frac{1}{24}\\ne0$。</span></div>"
  },
  {
   "id": "ch09-q9",
   "ch": "ch09",
   "type": "mcq",
   "difficulty": 3,
   "kp": "9.9 Convergence of Taylor Series", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "用 $P_3(x)=x-\\frac{x^3}{3!}$ 近似 $\\sin x$，若要求 $|R_3(x)|\\le3\\times10^{-4}$，则 $|x|$ 最大约为？",
   "options": [
    {
     "text": "$0.036$",
     "correct": false
    },
    {
     "text": "$0.190$",
     "correct": false
    },
    {
     "text": "$0.514$",
     "correct": true
    },
    {
     "text": "$1.000$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$0.036$ 是 $|x|^5$ 的上界，还要开五次方才能得到 $|x|$ 的上界 $0.514$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$0.190$ 相当于把五次方误当成平方（$\\sqrt{0.036}$），阶数取错会得出偏严的结论。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。由 Th 24（$M=1$）：$\\frac{|x|^5}{120}\\le3\\times10^{-4}$，故 $|x|^5\\le0.036$，$|x|\\le0.514$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$|x|=1$ 时 $\\frac{|x|^5}{120}\\approx8.3\\times10^{-3}$，超出 $3\\times10^{-4}$ 约 28 倍，不满足要求。</span></div>"
  },
  {
   "id": "ch09-q10",
   "ch": "ch09",
   "type": "mcq",
   "difficulty": 3,
   "kp": "9.10 Applications of Taylor Series", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "$\\lim_{x\\to0}\\frac{\\ln(1+x)-x}{x^2}=$ ?",
   "options": [
    {
     "text": "$\\frac12$",
     "correct": false
    },
    {
     "text": "$0$",
     "correct": false
    },
    {
     "text": "$-\\infty$",
     "correct": false
    },
    {
     "text": "$-\\frac12$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac12$ 是 $\\lim_{x\\to0}\\frac{e^x-1-x}{x^2}$ 的值，符号来源相反，别与 $e^x$ 的展开混用。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$0$ 是把 $\\ln(1+x)$ 只展到 $x$ 项（分子看似恒为 0）的假象；分母为 $x^2$，必须展到 $x^2$ 项。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。分子与 $x^2$ 同阶，首次不抵消的项是 $-\\frac{x^2}{2}$，极限是有限值，不会趋于无穷。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$\\ln(1+x)=x-\\frac{x^2}{2}+\\cdots$，分子为 $-\\frac{x^2}{2}+\\cdots$，除以 $x^2$ 后趋于 $-\\frac12$。</span></div>"
  },
  {
   "id": "ch10-q1",
   "ch": "ch10",
   "type": "mcq",
   "difficulty": 1,
   "kp": "10.1 平面曲线的参数化", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "参数曲线 $x=\\sqrt{t},\\ y=t$（$t\\ge 0$）化为直角坐标方程后，其轨迹是？",
   "options": [
    {
     "text": "$y=x^{2}$，$x\\in\\mathbb{R}$",
     "correct": false
    },
    {
     "text": "$y=\\sqrt{x}$，$x\\ge 0$",
     "correct": false
    },
    {
     "text": "$y=x^{2}$，$x\\ge 0$",
     "correct": true
    },
    {
     "text": "$y=x^{2}$，$y\\ge 0$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。漏掉 $t\\ge 0$ 的限制，把 $x<0$ 的左半支也算进来了，而它并不被该参数化描出。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。由 $x=\\sqrt{t}$ 解出的是 $t=x^{2}$，不是 $\\sqrt{x}$，这里把两式的关系弄反了。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。由 $x=\\sqrt{t}$ 得 $t=x^{2}$，故 $y=t=x^{2}$；又 $t\\ge 0$ 给出 $x\\ge 0$，轨迹只是抛物线的右半支。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$y=x^{2}$ 上的点本就满足 $y\\ge 0$，此条件限制不了 $x$，等于把整条抛物线都算了进来。</span></div>"
  },
  {
   "id": "ch10-q2",
   "ch": "ch10",
   "type": "mcq",
   "difficulty": 2,
   "kp": "10.1 平面曲线的参数化", "tags": ["output"],
   "scope": "outside",
   "stem": "参数曲线 $x=2\\cos t,\\ y=2\\sin t$（$0\\le t\\le\\pi$）描出的图形是？",
   "options": [
    {
     "text": "整个圆 $x^{2}+y^{2}=4$",
     "correct": false
    },
    {
     "text": "圆 $x^{2}+y^{2}=4$ 的上半部分",
     "correct": true
    },
    {
     "text": "圆 $x^{2}+y^{2}=4$ 的下半部分",
     "correct": false
    },
    {
     "text": "圆 $x^{2}+y^{2}=4$ 的右半部分",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。要跑满 $0\\le t\\le 2\\pi$ 才得到整个圆；本题区间只到 $\\pi$，只剩上半圆。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$t$ 从 0 增到 $\\pi$ 时点由 $(2,0)$ 经 $(0,2)$ 到 $(-2,0)$，恰是 $y\\ge 0$ 的上半圆弧。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$0\\le t\\le\\pi$ 时 $y=2\\sin t\\ge 0$，描出的是上半圆；下半圆对应 $\\pi\\le t\\le 2\\pi$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。右半圆需 $x\\ge 0$，对应 $t$ 取 $[-\\frac{\\pi}{2},\\frac{\\pi}{2}]$ 一类区间，与本题区间不符。</span></div>"
  },
  {
   "id": "ch10-q3",
   "ch": "ch10",
   "type": "mcq",
   "difficulty": 1,
   "kp": "10.2 参数曲线的微积分", "tags": ["output"],
   "scope": "outside",
   "stem": "设参数曲线 $x=t^{2}+1,\\ y=t^{3}$，则 $t=1$ 处切线的斜率为？",
   "options": [
    {
     "text": "$3$",
     "correct": false
    },
    {
     "text": "$\\frac{2}{3}$",
     "correct": false
    },
    {
     "text": "$2$",
     "correct": false
    },
    {
     "text": "$\\frac{3}{2}$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$3$ 只是 $\\frac{dy}{dt}$ 在 $t=1$ 的值，还须除以 $\\frac{dx}{dt}=2$ 才是切线斜率。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。把参数求导链写反了：$\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}=\\frac{3t^{2}}{2t}$，不是 $\\frac{2t}{3t^{2}}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$2$ 是 $\\frac{dx}{dt}$ 在 $t=1$ 的值，斜率应取二者之商 $\\frac{3t}{2}$，代入后才得具体数。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$\\frac{dx}{dt}=2t$，$\\frac{dy}{dt}=3t^{2}$，故 $\\frac{dy}{dx}=\\frac{3t^{2}}{2t}=\\frac{3t}{2}$，代入 $t=1$ 得 $\\frac{3}{2}$。</span></div>"
  },
  {
   "id": "ch10-q4",
   "ch": "ch10",
   "type": "mcq",
   "difficulty": 2,
   "kp": "10.2 参数曲线的微积分", "tags": ["output"],
   "scope": "outside",
   "stem": "曲线 $x=t^{3}-3t,\\ y=t^{2}$ 上有垂直切线的点是？",
   "options": [
    {
     "text": "$(-2,1)$ 与 $(2,1)$",
     "correct": true
    },
    {
     "text": "$(0,0)$ 与 $(2,1)$",
     "correct": false
    },
    {
     "text": "$(-2,1)$ 与 $(0,0)$",
     "correct": false
    },
    {
     "text": "只有 $(0,0)$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$\\frac{dx}{dt}=3(t^{2}-1)=0$ 得 $t=\\pm 1$，此处 $\\frac{dy}{dt}=2t\\ne 0$，两点 $(-2,1)$、$(2,1)$ 的切线为 $x=-2$、$x=2$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$(2,1)$ 是垂直切线点，但 $(0,0)$ 处 $\\frac{dy}{dt}=0$ 而 $\\frac{dx}{dt}\\ne 0$，属水平切线。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$(0,0)$ 对应 $t=0$，那里 $\\frac{dx}{dt}=-3\\ne 0$，是水平切线；垂直切线点由 $\\frac{dx}{dt}=0$ 定出。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$(0,0)$ 是水平切线 $y=0$ 的点；垂直切线来自 $t=\\pm 1$，共有两个点，不止一个。</span></div>"
  },
  {
   "id": "ch10-q5",
   "ch": "ch10",
   "type": "mcq",
   "difficulty": 1,
   "kp": "10.3 极坐标", "tags": ["output"],
   "scope": "outside",
   "stem": "圆 $x^{2}+(y-3)^{2}=9$ 的极坐标方程是？",
   "options": [
    {
     "text": "$r=6\\cos\\theta$",
     "correct": false
    },
    {
     "text": "$r=3$",
     "correct": false
    },
    {
     "text": "$r=6\\sin\\theta$",
     "correct": true
    },
    {
     "text": "$r=-6\\sin\\theta$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$r=2a\\cos\\theta$ 型圆心在极轴上；本题圆心在 $(0,3)$，含 $y$ 方向平移，对应 $\\sin\\theta$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$r=3$ 是以极点为圆心、半径 3 的圆；原圆圆心在 $(0,3)$ 且过极点，形如 $r=2a\\sin\\theta$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。代入 $x=r\\cos\\theta,\\ y=r\\sin\\theta$ 得 $r^{2}-6r\\sin\\theta=0$，即 $r=6\\sin\\theta$（$r=0$ 已含其中）。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$r=-6\\sin\\theta$ 即 $x^{2}+(y+3)^{2}=9$，圆心在 $(0,-3)$，与原圆关于极轴对称。</span></div>"
  },
  {
   "id": "ch10-q6",
   "ch": "ch10",
   "type": "mcq",
   "difficulty": 2,
   "kp": "10.4 极坐标方程的作图", "tags": ["output"],
   "scope": "outside",
   "stem": "极坐标曲线 $r=3\\cos 2\\theta$ 共有多少瓣？",
   "options": [
    {
     "text": "$4$",
     "correct": true
    },
    {
     "text": "$2$",
     "correct": false
    },
    {
     "text": "$3$",
     "correct": false
    },
    {
     "text": "$6$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$r=a\\cos n\\theta$ 中 $n=2$ 为偶数，曲线有 $2n=4$ 瓣，每瓣最大半径为 $|a|=3$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$n$ 瓣只适用于 $n$ 为奇数；$n$ 为偶数时每瓣被正、负半径各描一次，共 $2n=4$ 瓣。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$3$ 是每瓣能达到的最大半径 $|a|$，不是瓣数；瓣数只由 $n=2$ 决定。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$6$ 是把半径系数 3 与 $n=2$ 相乘的结果；瓣数应为 $2n=4$。</span></div>"
  },
  {
   "id": "ch10-q7",
   "ch": "ch10",
   "type": "mcq",
   "difficulty": 2,
   "kp": "10.5 极坐标下的面积与弧长", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "心形线 $r=1-\\cos\\theta$ 所围区域的面积是？",
   "options": [
    {
     "text": "$3\\pi$",
     "correct": false
    },
    {
     "text": "$\\frac{3\\pi}{4}$",
     "correct": false
    },
    {
     "text": "$\\pi$",
     "correct": false
    },
    {
     "text": "$\\frac{3\\pi}{2}$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。漏掉面积公式中的 $\\frac{1}{2}$：$\\int_{0}^{2\\pi}(1-\\cos\\theta)^{2}d\\theta=3\\pi$，正好大一倍。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。这是只算 $0\\le\\theta\\le\\pi$ 半个区域的结果；心形线关于 $x$ 轴对称，还须乘 2。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。把 $r^{2}$ 写成了 $r$：$\\frac{1}{2}\\int_{0}^{2\\pi}(1-\\cos\\theta)d\\theta=\\pi$，面积元是 $\\frac{1}{2}r^{2}d\\theta$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$A=\\int_{0}^{2\\pi}\\frac{1}{2}(1-\\cos\\theta)^{2}d\\theta=\\frac{1}{2}(2\\pi+\\pi)=\\frac{3\\pi}{2}$。</span></div>"
  },
  {
   "id": "ch10-q8",
   "ch": "ch10",
   "type": "mcq",
   "difficulty": 3,
   "kp": "10.5 极坐标下的面积与弧长", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "心形线 $r=1-\\cos\\theta$ 的周长是？",
   "options": [
    {
     "text": "$4$",
     "correct": false
    },
    {
     "text": "$8$",
     "correct": true
    },
    {
     "text": "$2\\pi$",
     "correct": false
    },
    {
     "text": "$\\frac{3\\pi}{2}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。这是把 $\\sqrt{2-2\\cos\\theta}=2\\sin\\frac{\\theta}{2}$ 中的系数 2 丢掉后算得的结果。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。弧长 $L=\\int_{0}^{2\\pi}\\sqrt{2-2\\cos\\theta}\\,d\\theta=\\int_{0}^{2\\pi}2\\sin\\frac{\\theta}{2}\\,d\\theta=8$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$2\\pi$ 出自误用 $L=\\int r\\,d\\theta$；弧长元应为 $\\sqrt{r^{2}+(r')^{2}}\\,d\\theta$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{3\\pi}{2}$ 是这条心形线围成的面积，不是周长，两者用的公式不同。</span></div>"
  },
  {
   "id": "ch10-q9",
   "ch": "ch10",
   "type": "mcq",
   "difficulty": 1,
   "kp": "10.6 圆锥曲线", "tags": ["output"],
   "scope": "outside",
   "stem": "椭圆 $\\frac{x^{2}}{25}+\\frac{y^{2}}{9}=1$ 的焦点是？",
   "options": [
    {
     "text": "$(0,\\pm 4)$",
     "correct": false
    },
    {
     "text": "$(\\pm\\sqrt{34},0)$",
     "correct": false
    },
    {
     "text": "$(\\pm 4,0)$",
     "correct": true
    },
    {
     "text": "$(\\pm 5,0)$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$x$ 项分母 25 更大，长轴沿 $x$ 轴，焦点在 $x$ 轴上，不是 $(0,\\pm 4)$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$c^{2}=a^{2}+b^{2}$ 是双曲线的公式；椭圆用减法，得 $c^{2}=16$，不是 34。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$a=5$、$b=3$，椭圆用 $c^{2}=a^{2}-b^{2}=25-9=16$，得 $c=4$，焦点为 $(\\pm 4,0)$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$(\\pm 5,0)$ 是长轴顶点，$a=5$ 为半长轴；焦点到中心的距离是 $c=4$。</span></div>"
  },
  {
   "id": "ch10-q10",
   "ch": "ch10",
   "type": "mcq",
   "difficulty": 3,
   "kp": "10.7 极坐标下的圆锥曲线", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "焦点在极点的圆锥曲线 $r=\\frac{12}{3+\\sin\\theta}$，它的离心率与准线分别是？",
   "options": [
    {
     "text": "$e=\\frac{1}{3}$，准线 $y=12$",
     "correct": true
    },
    {
     "text": "$e=\\frac{1}{3}$，准线 $y=4$",
     "correct": false
    },
    {
     "text": "$e=3$，准线 $y=12$",
     "correct": false
    },
    {
     "text": "$e=3$，准线 $y=4$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。化为 $r=\\frac{4}{1+\\frac{1}{3}\\sin\\theta}$，与 $r=\\frac{ke}{1+e\\sin\\theta}$ 比较得 $e=\\frac{1}{3}$，再由 $ke=4$ 得 $k=12$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$ke=4$ 只是分子；$k$ 还须除以 $e=\\frac{1}{3}$，故准线为 $y=12$，不是 $y=4$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。先把分母常数项归一化为 1 才能读 $e$；直接读分母里的 3 会误判成 $e=3>1$ 的双曲线。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。归一化后 $e=\\frac{1}{3}$；又由 $k=\\frac{4}{e}=12$，两个数值都取错了。</span></div>"
  },
  {
   "id": "ch11-q1",
   "ch": "ch11",
   "type": "mcq",
   "difficulty": 1,
   "kp": "11.1 三维坐标系", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "点 $P(2,-1,3)$ 与 $Q(4,2,-1)$ 之间的距离是？",
   "options": [
    {
     "text": "$\\sqrt{20}$",
     "correct": false
    },
    {
     "text": "$9$",
     "correct": false
    },
    {
     "text": "$\\sqrt{29}$",
     "correct": true
    },
    {
     "text": "$29$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。只算了 $\\Delta x^2+\\Delta z^2=4+16=20$，漏掉了 $\\Delta y^2=9$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。把坐标差直接相加得 $2+3+4=9$；距离公式要求先平方求和再开方。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$\\Delta x=2,\\Delta y=3,\\Delta z=-4$，故 $|PQ|=\\sqrt{4+9+16}=\\sqrt{29}$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$29$ 是平方和 $2^2+3^2+4^2$，最后一步漏了开方。</span></div>"
  },
  {
   "id": "ch11-q2",
   "ch": "ch11",
   "type": "mcq",
   "difficulty": 1,
   "kp": "11.1 三维坐标系", "tags": ["output"],
   "scope": "outside",
   "stem": "球面 $x^{2}+y^{2}+z^{2}+3x-4z+1=0$ 的半径是？",
   "options": [
    {
     "text": "$\\frac{\\sqrt{21}}{2}$",
     "correct": true
    },
    {
     "text": "$\\frac{21}{4}$",
     "correct": false
    },
    {
     "text": "$\\frac{\\sqrt{29}}{2}$",
     "correct": false
    },
    {
     "text": "$2$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。配方得 $(x+\\frac32)^2+y^2+(z-2)^2=\\frac{21}4$，半径 $\\frac{\\sqrt{21}}2$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\frac{21}4$ 是 $a^2$，半径还要开方，应为 $\\frac{\\sqrt{21}}2$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。常数项通分算成 $\\frac{29}4$（把 $-1$ 当成 $+1$），正确是 $\\frac{21}4$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$2$ 是球心的 $z$ 坐标（由 $-4z$ 配方而来），不是半径。</span></div>"
  },
  {
   "id": "ch11-q3",
   "ch": "ch11",
   "type": "mcq",
   "difficulty": 1,
   "kp": "11.2 向量", "tags": ["output"],
   "scope": "outside",
   "stem": "设 $\\mathbf v=\\langle2,-4,4\\rangle$，则与 $\\mathbf v$ 同向且长度为 $3$ 的向量是？",
   "options": [
    {
     "text": "$\\langle2,-4,4\\rangle$",
     "correct": false
    },
    {
     "text": "$\\langle1,-2,2\\rangle$",
     "correct": true
    },
    {
     "text": "$\\langle6,-12,12\\rangle$",
     "correct": false
    },
    {
     "text": "$\\langle\\frac13,-\\frac23,\\frac23\\rangle$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。这是 $\\mathbf v$ 本身，长度 $|\\mathbf v|=\\sqrt{4+16+16}=6$，不是 $3$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$|\\mathbf v|=6$，单位化后乘 $3$ 得 $\\langle1,-2,2\\rangle$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。这是 $3\\mathbf v$，长度变成 $18$；长度 $k$ 应乘单位向量而非 $k\\mathbf v$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。这是单位向量（长度为 $1$），还要再乘 $3$ 才得长度为 $3$ 的同向向量。</span></div>"
  },
  {
   "id": "ch11-q4",
   "ch": "ch11",
   "type": "mcq",
   "difficulty": 1,
   "kp": "11.2 向量", "tags": ["output"],
   "scope": "outside",
   "stem": "点 $A(1,-2,4)$ 与 $B(3,4,-2)$ 的中点坐标是？",
   "options": [
    {
     "text": "$(2,1,1)$",
     "correct": true
    },
    {
     "text": "$(4,2,2)$",
     "correct": false
    },
    {
     "text": "$(1,3,-3)$",
     "correct": false
    },
    {
     "text": "$(-1,-3,3)$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$M=\\left(\\frac{1+3}2,\\frac{-2+4}2,\\frac{4-2}2\\right)=(2,1,1)$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$(4,2,2)$ 是两端点坐标之和，中点还要再除以 $2$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$(1,3,-3)$ 是 $\\overrightarrow{AB}=\\mathbf B-\\mathbf A$ 的分量，是向量不是中点。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$(-1,-3,3)$ 是起点减终点 $\\mathbf A-\\mathbf B$，与中点无关。</span></div>"
  },
  {
   "id": "ch11-q5",
   "ch": "ch11",
   "type": "mcq",
   "difficulty": 2,
   "kp": "11.3 点积", "tags": ["output"],
   "scope": "outside",
   "stem": "向量 $\\mathbf u=\\langle1,1,0\\rangle$ 与 $\\mathbf v=\\langle1,0,1\\rangle$ 的夹角是？",
   "options": [
    {
     "text": "$30^\\circ$",
     "correct": false
    },
    {
     "text": "$45^\\circ$",
     "correct": false
    },
    {
     "text": "$60^\\circ$",
     "correct": true
    },
    {
     "text": "$90^\\circ$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$30^\\circ$ 的余弦是 $\\frac{\\sqrt3}2$，而本题算得 $\\cos\\theta=\\frac12$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$45^\\circ$ 的余弦是 $\\frac{\\sqrt2}2$；本题点积 $1$、模长积 $2$，比值是 $\\frac12$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$|\\mathbf u|=|\\mathbf v|=\\sqrt2$，点积为 $1$，$\\cos\\theta=\\frac12$，故 $\\theta=60^\\circ$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\mathbf u\\cdot\\mathbf v=1\\ne0$，两向量不垂直；垂直判别看点积是否为零。</span></div>"
  },
  {
   "id": "ch11-q6",
   "ch": "ch11",
   "type": "mcq",
   "difficulty": 2,
   "kp": "11.3 点积", "tags": ["output"],
   "scope": "outside",
   "stem": "设 $\\mathbf u=\\langle1,2,3\\rangle$，$\\mathbf v=\\langle1,1,1\\rangle$，则 $\\operatorname{proj}_{\\mathbf v}\\mathbf u$ 等于？",
   "options": [
    {
     "text": "$\\langle2,2,2\\rangle$",
     "correct": true
    },
    {
     "text": "$\\langle1,1,1\\rangle$",
     "correct": false
    },
    {
     "text": "$2$",
     "correct": false
    },
    {
     "text": "$\\langle\\frac13,\\frac13,\\frac13\\rangle$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$\\mathbf u\\cdot\\mathbf v=6$，$|\\mathbf v|^2=3$，系数为 $2$，故投影是 $\\langle2,2,2\\rangle$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。那是 $\\mathbf v$ 本身，漏乘了系数 $\\frac{\\mathbf u\\cdot\\mathbf v}{|\\mathbf v|^2}=2$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$2$ 只是系数；投影是向量 $2\\mathbf v$，标量分量才是 $\\frac{6}{\\sqrt3}$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。那是 $\\mathbf v$ 的单位向量；公式分母为 $|\\mathbf v|^2=3$，结果还要乘 $\\mathbf v$。</span></div>"
  },
  {
   "id": "ch11-q7",
   "ch": "ch11",
   "type": "mcq",
   "difficulty": 2,
   "kp": "11.4 叉积", "tags": ["output"],
   "scope": "outside",
   "stem": "设 $\\mathbf u=\\langle2,1,0\\rangle$，$\\mathbf v=\\langle0,3,1\\rangle$，则 $\\mathbf u\\times\\mathbf v=$ ？",
   "options": [
    {
     "text": "$\\langle1,2,6\\rangle$",
     "correct": false
    },
    {
     "text": "$\\langle-1,2,-6\\rangle$",
     "correct": false
    },
    {
     "text": "$\\langle6,-2,1\\rangle$",
     "correct": false
    },
    {
     "text": "$\\langle1,-2,6\\rangle$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\mathbf j$ 分量应为 $u_3v_1-u_1v_3=0-2=-2$，写成 $+2$ 是漏了负号。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。这是 $\\mathbf v\\times\\mathbf u$；叉积反交换，交换次序结果整体变号。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。分量次序颠倒，把 $\\mathbf k$ 分量写到了第一位；正确顺序是 $1,-2,6$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$\\mathbf i$ 分量 $1$、$\\mathbf j$ 分量 $-2$、$\\mathbf k$ 分量 $6$，即 $\\langle1,-2,6\\rangle$。</span></div>"
  },
  {
   "id": "ch11-q8",
   "ch": "ch11",
   "type": "mcq",
   "difficulty": 3,
   "kp": "11.4 叉积", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "以 $\\mathbf u=\\langle1,1,0\\rangle$，$\\mathbf v=\\langle0,1,1\\rangle$，$\\mathbf w=\\langle0,1,-1\\rangle$ 为棱的平行六面体体积是？",
   "options": [
    {
     "text": "$2$",
     "correct": true
    },
    {
     "text": "$-2$",
     "correct": false
    },
    {
     "text": "$\\sqrt6$",
     "correct": false
    },
    {
     "text": "$\\frac13$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$\\mathbf u\\times\\mathbf v=\\langle1,-1,1\\rangle$，与 $\\mathbf w$ 点积为 $-2$，体积取绝对值得 $2$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。三重积等于 $-2$ 是代数值，体积要取绝对值，故为 $2$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\sqrt6$ 是 $|\\mathbf u\\times\\mathbf v||\\mathbf w|$，只在 $\\mathbf w$ 垂直底面时才等于体积。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac13$ 是四面体体积（再乘 $\\frac16$）；平行六面体体积不再乘 $\\frac16$。</span></div>"
  },
  {
   "id": "ch11-q9",
   "ch": "ch11",
   "type": "mcq",
   "difficulty": 2,
   "kp": "11.5 空间直线与平面", "tags": ["output"],
   "scope": "outside",
   "stem": "点 $P(1,1,1)$ 到平面 $x+2y-2z=3$ 的距离是？",
   "options": [
    {
     "text": "$2$",
     "correct": false
    },
    {
     "text": "$\\frac23$",
     "correct": true
    },
    {
     "text": "$\\frac29$",
     "correct": false
    },
    {
     "text": "$\\frac43$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$2$ 只是分子 $|1+2-2-3|=2$，忘了除以 $|\\mathbf n|=\\sqrt{1+4+4}=3$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$d=\\frac{|1+2-2-3|}{\\sqrt{1+4+4}}=\\frac23$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。分母用了 $A^2+B^2+C^2=9$ 却没有开方；点到平面距离的分母是 $|\\mathbf n|$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。把平面写成 $x+2y-2z+3=0$ 使 $D$ 的符号出错；须化成 $Ax+By+Cz-D=0$。</span></div>"
  },
  {
   "id": "ch11-q10",
   "ch": "ch11",
   "type": "mcq",
   "difficulty": 2,
   "kp": "11.6 柱面与二次曲面", "tags": ["output"],
   "scope": "outside",
   "stem": "曲面 $x^{2}+y^{2}+4z^{2}-2x+4y+1=0$ 的图形是？",
   "options": [
    {
     "text": "椭圆抛物面",
     "correct": false
    },
    {
     "text": "单叶双曲面",
     "correct": false
    },
    {
     "text": "椭球面",
     "correct": true
    },
    {
     "text": "椭圆锥面",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。椭圆抛物面要求两个平方项加一个一次项，本题三个变量都是平方项。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。单叶双曲面的标准型是两正一负且右边为 $1$，本题三项同号。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。配方得 $\\frac{(x-1)^2}4+\\frac{(y+2)^2}4+\\frac{z^2}1=1$，三项全正，是椭球面。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。椭圆锥面右边应为 $0$ 且平方项两同号一异号；本题配方后右边是 $4$。</span></div>"
  },
  {
   "id": "ch12-q1",
   "ch": "ch12",
   "type": "mcq",
   "difficulty": 1,
   "kp": "12.1 空间曲线及其切线", "tags": ["output"],
   "scope": "outside",
   "stem": "设 $\\mathbf r(t)=t^{3}\\mathbf i+\\sin t\\,\\mathbf j+e^{2t}\\mathbf k$，则 $\\mathbf r'(t)=$ ?",
   "options": [
    {
     "text": "$3t^{2}\\mathbf i-\\cos t\\,\\mathbf j+2e^{2t}\\mathbf k$",
     "correct": false
    },
    {
     "text": "$3t^{2}\\mathbf i+\\cos t\\,\\mathbf j+2e^{2t}\\mathbf k$",
     "correct": true
    },
    {
     "text": "$t^{2}\\mathbf i+\\cos t\\,\\mathbf j+e^{2t}\\mathbf k$",
     "correct": false
    },
    {
     "text": "$3t^{2}\\mathbf i+\\cos t\\,\\mathbf j+e^{2t}\\mathbf k$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$(\\sin t)'=\\cos t$ 而非 $-\\cos t$；$(-\\cos t)'$ 才等于 $\\sin t$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。向量函数逐分量求导：$(t^{3})'=3t^{2}$，$(\\sin t)'=\\cos t$，$(e^{2t})'=2e^{2t}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。既漏了幂函数法则的系数 $3$，也漏了 $e^{2t}$ 的链式法则系数 $2$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$e^{2t}$ 是复合函数，须用链式法则乘内层导数 $2$，得 $2e^{2t}$。</span></div>"
  },
  {
   "id": "ch12-q2",
   "ch": "ch12",
   "type": "mcq",
   "difficulty": 2,
   "kp": "12.1 空间曲线及其切线", "tags": ["output"],
   "scope": "outside",
   "stem": "曲线 $\\mathbf r(t)=t\\,\\mathbf i+t^{2}\\mathbf j+t^{3}\\mathbf k$ 在 $t=1$ 处的切线（参数 $s$）是？",
   "options": [
    {
     "text": "$\\mathbf R(s)=(\\mathbf i+\\mathbf j+\\mathbf k)+s(\\mathbf i+2\\mathbf j+3\\mathbf k)$",
     "correct": true
    },
    {
     "text": "$\\mathbf R(s)=(\\mathbf i+2\\mathbf j+3\\mathbf k)+s(\\mathbf i+\\mathbf j+\\mathbf k)$",
     "correct": false
    },
    {
     "text": "$\\mathbf R(s)=s(\\mathbf i+2\\mathbf j+3\\mathbf k)$",
     "correct": false
    },
    {
     "text": "$\\mathbf R(s)=(\\mathbf i+\\mathbf j+\\mathbf k)+s(3\\mathbf i+2\\mathbf j+\\mathbf k)$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。切点 $\\mathbf r(1)=(1,1,1)$，方向 $\\mathbf v(1)=\\mathbf i+2\\mathbf j+3\\mathbf k$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。把切点与方向向量写反了：$\\mathbf r(1)$ 是切点，$\\mathbf v(1)$ 才是方向。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。缺少切点 $\\mathbf i+\\mathbf j+\\mathbf k$，这条直线过原点而不是过切点。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。方向向量分量次序写反，应为 $\\mathbf v(1)=\\mathbf i+2\\mathbf j+3\\mathbf k$。</span></div>"
  },
  {
   "id": "ch12-q3",
   "ch": "ch12",
   "type": "mcq",
   "difficulty": 2,
   "kp": "12.2 向量函数的积分；抛体运动", "tags": ["output"],
   "scope": "outside",
   "stem": "从地面以初速率 $v_0=28\\ \\mathrm{m/s}$、发射角 $15^{\\circ}$ 抛出物体，取 $g=9.8\\ \\mathrm{m/s^{2}}$，射程约为？",
   "options": [
    {
     "text": "$80\\ \\mathrm m$",
     "correct": false
    },
    {
     "text": "$69.3\\ \\mathrm m$",
     "correct": false
    },
    {
     "text": "$40\\ \\mathrm m$",
     "correct": true
    },
    {
     "text": "$20.7\\ \\mathrm m$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$80$ m 是漏乘 $\\sin2\\alpha$ 的结果，只在 $\\alpha=45^{\\circ}$ 时才成立。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。把发射角又翻倍成 $60^{\\circ}$（误用 $\\sin4\\alpha$），$80\\sin60^{\\circ}\\approx69.3$ m。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$R=\\frac{v_0^{2}}{g}\\sin2\\alpha=\\frac{784}{9.8}\\sin30^{\\circ}=80\\times0.5=40$ m。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。误把 $\\sin2\\alpha$ 写成 $\\sin\\alpha$，得 $80\\sin15^{\\circ}\\approx20.7$ m。</span></div>"
  },
  {
   "id": "ch12-q4",
   "ch": "ch12",
   "type": "mcq",
   "difficulty": 3,
   "kp": "12.2 向量函数的积分；抛体运动", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "物体从高度 $Y_0>0$ 处以初速率 $v_0$、发射角 $\\alpha$ 抛出后落回水平地面，其飞行时间应满足？",
   "options": [
    {
     "text": "$t=\\frac{2v_0\\sin\\alpha}{g}$",
     "correct": false
    },
    {
     "text": "$t=\\frac{v_0\\sin\\alpha}{g}$",
     "correct": false
    },
    {
     "text": "$t=\\frac{2v_0\\cos\\alpha}{g}$",
     "correct": false
    },
    {
     "text": "$Y_0+(v_0\\sin\\alpha)t-\\frac12gt^{2}=0$ 的正根",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。该式由 $y=0$ 且 $Y_0=0$ 推出，只适用于从地面发射的情形。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\frac{v_0\\sin\\alpha}{g}$ 是到达最高点的时刻，此时只是竖直速度为零。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。竖直方向只含 $v_0\\sin\\alpha$，用 $\\cos\\alpha$ 是把水平分量当成了竖直分量。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。竖直分量 $y=Y_0+(v_0\\sin\\alpha)t-\\frac12gt^{2}$，令 $y=0$ 解二次方程并舍去负根。</span></div>"
  },
  {
   "id": "ch12-q5",
   "ch": "ch12",
   "type": "mcq",
   "difficulty": 1,
   "kp": "12.3 空间弧长", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "螺旋线 $\\mathbf r(t)=a\\cos t\\,\\mathbf i+a\\sin t\\,\\mathbf j+bt\\,\\mathbf k$（$a,b>0$）从 $t=0$ 到 $t=2\\pi$ 的弧长为？",
   "options": [
    {
     "text": "$2\\pi a$",
     "correct": false
    },
    {
     "text": "$2\\pi\\sqrt{a^{2}+b^{2}}$",
     "correct": true
    },
    {
     "text": "$2\\pi b$",
     "correct": false
    },
    {
     "text": "$2\\pi(a+b)$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$2\\pi a$ 只算了底面圆周，漏掉沿 $z$ 轴上升的贡献。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$|\\mathbf v|=\\sqrt{a^{2}+b^{2}}$ 为常数（圆周分量与竖直分量正交），乘 $2\\pi$ 即得。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$2\\pi b$ 只算了竖直方向的贡献，漏掉圆周方向的弧长。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$|\\mathbf v|$ 是两个正交分量平方和的开方，不是 $a+b$。</span></div>"
  },
  {
   "id": "ch12-q6",
   "ch": "ch12",
   "type": "mcq",
   "difficulty": 2,
   "kp": "12.3 空间弧长", "tags": ["output"],
   "scope": "outside",
   "stem": "设 $\\mathbf r(t)=e^{t}\\cos t\\,\\mathbf i+e^{t}\\sin t\\,\\mathbf j+e^{t}\\mathbf k$，以 $t=0$ 为基点的弧长参数 $s(t)=$ ?",
   "options": [
    {
     "text": "$\\sqrt3e^{t}$",
     "correct": false
    },
    {
     "text": "$3(e^{t}-1)$",
     "correct": false
    },
    {
     "text": "$\\sqrt3(e^{t}-1)$",
     "correct": true
    },
    {
     "text": "$e^{t}-1$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。该式在 $t=0$ 处等于 $\\sqrt3$ 而不是 $0$，不满足以 $t=0$ 为基点。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$3e^{t}$ 是 $|\\mathbf v|^{2}$，这里把速率的平方当成了速率。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$|\\mathbf v|=\\sqrt3e^{t}$，$s(t)=\\int_0^{t}\\sqrt3e^{\\tau}d\\tau=\\sqrt3(e^{t}-1)$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。漏了系数 $\\sqrt3$，等于把速率记成了 $e^{t}$。</span></div>"
  },
  {
   "id": "ch12-q7",
   "ch": "ch12",
   "type": "mcq",
   "difficulty": 1,
   "kp": "12.4 曲率与曲线的主法向量", "tags": ["output"],
   "scope": "outside",
   "stem": "曲线 $y=x^{2}$ 在顶点 $x=0$ 处的曲率 $\\kappa=$ ?",
   "options": [
    {
     "text": "$2$",
     "correct": true
    },
    {
     "text": "$\\frac{2}{5\\sqrt5}$",
     "correct": false
    },
    {
     "text": "$\\frac12$",
     "correct": false
    },
    {
     "text": "$0$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$\\kappa=\\frac{|f''|}{[1+(f')^{2}]^{3/2}}$，$x=0$ 时 $f'(0)=0$，故 $\\kappa=2$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\frac{2}{5\\sqrt5}$ 是 $x=1$ 处的曲率（$f'(1)=2$），代错了点。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac12$ 是顶点处的曲率半径 $\\rho=\\frac1\\kappa$，与曲率互为倒数。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\kappa=0$ 只出现在直线或拐点处；抛物线顶点处最弯，曲率最大。</span></div>"
  },
  {
   "id": "ch12-q8",
   "ch": "ch12",
   "type": "mcq",
   "difficulty": 1,
   "kp": "12.4 曲率与曲线的主法向量", "tags": ["output"],
   "scope": "outside",
   "stem": "螺旋线 $\\mathbf r(t)=2\\cos t\\,\\mathbf i+2\\sin t\\,\\mathbf j+t\\,\\mathbf k$ 的曲率 $\\kappa=$ ?",
   "options": [
    {
     "text": "$\\frac{5}{2}$",
     "correct": false
    },
    {
     "text": "$\\frac{2}{\\sqrt5}$",
     "correct": false
    },
    {
     "text": "$\\frac12$",
     "correct": false
    },
    {
     "text": "$\\frac{2}{5}$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac52$ 是曲率半径 $\\rho=\\frac1\\kappa$，与曲率互为倒数。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\frac{2}{\\sqrt5}$ 相当于分母用了 $|\\mathbf v|^{2}=5$，而公式分母是 $|\\mathbf v|^{3}=5\\sqrt5$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac12$ 是半径 $a=2$ 的圆的曲率 $\\frac1a$，忽略了螺距参数 $b=1$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。由螺旋线结论 $\\kappa=\\frac{a}{a^{2}+b^{2}}=\\frac{2}{4+1}=\\frac25$（$a=2$，$b=1$）。</span></div>"
  },
  {
   "id": "ch12-q9",
   "ch": "ch12",
   "type": "mcq",
   "difficulty": 2,
   "kp": "12.5 加速度的切向与法向分量", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "质点运动 $\\mathbf r(t)=(\\cos t+t\\sin t)\\mathbf i+(\\sin t-t\\cos t)\\mathbf j$（$t>0$），则 $a_T$ 与 $a_N$ 为？",
   "options": [
    {
     "text": "$a_T=t$，$a_N=1$",
     "correct": false
    },
    {
     "text": "$a_T=1$，$a_N=1$",
     "correct": false
    },
    {
     "text": "$a_T=1$，$a_N=t$",
     "correct": true
    },
    {
     "text": "$a_T=t$，$a_N=t$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。把两个分量对调了：切向分量 $a_T=\\frac{d}{dt}|\\mathbf v|$ 恒为 $1$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。漏掉 $a_N$ 中的因子 $t$：由 $a_N=\\sqrt{|\\mathbf a|^{2}-a_T^{2}}$ 得 $a_N=t$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$|\\mathbf v|=t$，$a_T=1$；$|\\mathbf a|^{2}=t^{2}+1$，$a_N=\\sqrt{t^{2}+1-1}=t$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$a_T=\\frac{d}{dt}|\\mathbf v|=\\frac{d}{dt}t=1$，是不含 $t$ 的常数，不是 $t$。</span></div>"
  },
  {
   "id": "ch12-q10",
   "ch": "ch12",
   "type": "mcq",
   "difficulty": 2,
   "kp": "12.6 极坐标下的速度与加速度", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "设 $r=e^{2t}$，$\\theta=t$，则速度 $\\mathbf v$ 关于 $\\mathbf u_r,\\mathbf u_\\theta$ 的表达式为？",
   "options": [
    {
     "text": "$e^{2t}\\mathbf u_r+2e^{2t}\\mathbf u_\\theta$",
     "correct": false
    },
    {
     "text": "$2e^{2t}\\mathbf u_r+e^{2t}\\mathbf u_\\theta$",
     "correct": true
    },
    {
     "text": "$2e^{2t}\\mathbf u_r+2e^{2t}\\mathbf u_\\theta$",
     "correct": false
    },
    {
     "text": "$e^{2t}\\mathbf u_r+e^{2t}\\mathbf u_\\theta$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。径向与横向的系数写反了：径向是 $\\dot r=2e^{2t}$，横向是 $r\\dot\\theta=e^{2t}$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。速度公式 $\\mathbf v=\\dot r\\mathbf u_r+r\\dot\\theta\\mathbf u_\\theta$ 的径向系数是 $\\dot r$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。横向速度是 $r\\dot\\theta=e^{2t}\\cdot1=e^{2t}$，只有径向才带系数 $2$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。径向速度是 $\\dot r=2e^{2t}$，漏掉链式法则带来的因子 $2$。</span></div>"
  },
  {
   "id": "ch13-q1",
   "ch": "ch13",
   "type": "mcq",
   "difficulty": 1,
   "kp": "13.1 Functions of Several Variables", "tags": ["concept"],
   "scope": "outside",
   "stem": "函数 $f(x,y)=\\sqrt{4-x^{2}-y^{2}}$ 的定义域是？",
   "options": [
    {
     "text": "开圆盘 $x^{2}+y^{2}<4$",
     "correct": false
    },
    {
     "text": "圆 $x^{2}+y^{2}=4$",
     "correct": false
    },
    {
     "text": "闭圆盘 $x^{2}+y^{2}\\le 4$",
     "correct": true
    },
    {
     "text": "整个 $xy$ 平面",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。漏取等号：边界上根号内为 $0$，$f$ 仍有定义，定义域应含边界。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。圆只是定义域的边界，圆内每一点也都有定义，不能只取圆周。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。根号内须非负，即 $x^{2}+y^{2}\\le 4$，含边界故为闭圆盘。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。当 $x^{2}+y^{2}>4$ 时根号内为负，取不到实数值，故不是全平面。</span></div>"
  },
  {
   "id": "ch13-q2",
   "ch": "ch13",
   "type": "mcq",
   "difficulty": 2,
   "kp": "13.2 Limits and Continuity in Higher Dimensions", "tags": ["concept"],
   "scope": "outside",
   "stem": "关于极限 $\\lim_{(x,y)\\to(0,0)}\\frac{x^{2}y}{x^{4}+y^{2}}$，下列结论正确的是？",
   "options": [
    {
     "text": "存在且为 $0$；因为沿所有直线 $y=mx$ 极限都为 $0$",
     "correct": false
    },
    {
     "text": "存在且为 $0$；因为分子的次数高于分母",
     "correct": false
    },
    {
     "text": "不存在；因为 $f$ 在 $(0,0)$ 处没有定义",
     "correct": false
    },
    {
     "text": "不存在；沿 $y=kx^{2}$ 时极限为 $\\frac{k}{1+k^{2}}$，随 $k$ 变化",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。沿所有直线相同不足以保证存在，本例如沿 $y=kx^{2}$ 极限随 $k$ 变。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。次数比较不是判据；沿 $y=kx^{2}$ 得 $\\frac{k}{1+k^{2}}$，随 $k$ 变化。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。结论对但理由错：无定义只说明 $f$ 不连续，极限仍可能存在。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。沿 $y=kx^{2}$（$x\\neq0$）有 $f=\\frac{k}{1+k^{2}}$，取不同 $k$ 极限不同，由路径法知极限不存在。</span></div>"
  },
  {
   "id": "ch13-q3",
   "ch": "ch13",
   "type": "mcq",
   "difficulty": 1,
   "kp": "13.3 Partial Derivatives", "tags": ["output"],
   "scope": "outside",
   "stem": "设 $f(x,y)=x^{2}y^{3}$，则 $f_{xy}$（先对 $x$ 后对 $y$ 求导）等于？",
   "options": [
    {
     "text": "$2xy^{3}$",
     "correct": false
    },
    {
     "text": "$6xy^{2}$",
     "correct": true
    },
    {
     "text": "$3x^{2}y^{2}$",
     "correct": false
    },
    {
     "text": "$6xy$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$2xy^{3}$ 只是 $f_x$，没有继续对 $y$ 求导。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$f_x=2xy^{3}$，再对 $y$ 求导得 $2x\\cdot 3y^{2}=6xy^{2}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$3x^{2}y^{2}$ 是 $f_y$，把求导的顺序与对象都弄错了。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$6xy$ 在 $3y^{2}$ 处漏了一次幂，$y$ 的指数应为 $2$。</span></div>"
  },
  {
   "id": "ch13-q4",
   "ch": "ch13",
   "type": "mcq",
   "difficulty": 3,
   "kp": "13.3 Partial Derivatives", "tags": ["concept","trap"],
   "scope": "outside",
   "stem": "关于 $f(x,y)$ 在点 $P$ 处的性质，下列推断正确的是？",
   "options": [
    {
     "text": "偏导在 $P$ 存在，则 $f$ 在 $P$ 连续",
     "correct": false
    },
    {
     "text": "$f$ 在 $P$ 可微，则偏导在 $P$ 连续",
     "correct": false
    },
    {
     "text": "偏导在 $P$ 存在，则 $f$ 在 $P$ 可微",
     "correct": false
    },
    {
     "text": "偏导在 $P$ 附近连续，则 $f$ 在 $P$ 可微",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。偏导存在推不出连续：如 $f=1$（$xy=0$）、$f=0$（$xy\\neq0$）在原点偏导为 $0$ 却不连续。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。可微只推出连续；可微时偏导未必连续，方向反了。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。偏导存在推不出可微，还需 $\\Delta z$ 与线性主部之差为高阶无穷小。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。这是 Increment 定理：$f_x,f_y$ 在含 $P$ 的开区域存在且连续，则 $f$ 在 $P$ 可微。</span></div>"
  },
  {
   "id": "ch13-q5",
   "ch": "ch13",
   "type": "mcq",
   "difficulty": 2,
   "kp": "13.4 The Chain Rule", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "设 $w=x^{2}+y^{2}$，$x=u-v$，$y=uv$，则 $\\frac{\\partial w}{\\partial u}$ 等于？",
   "options": [
    {
     "text": "$-2u+2v+2uv^{2}$",
     "correct": false
    },
    {
     "text": "$2u-2v+2uv$",
     "correct": false
    },
    {
     "text": "$2u-2v+2uv^{2}$",
     "correct": true
    },
    {
     "text": "$2u-2v$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。把 $\\partial x/\\partial u$ 写成了对 $v$ 的导数 $-1$，$x=u-v$ 对 $u$ 求导应为 $1$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。算 $y_u$ 时把 $y=uv$ 对 $u$ 的导数当成 $1$，漏了因子 $v$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$\\partial w/\\partial u=(2x)(1)+(2y)(v)=2(u-v)+2uv^{2}$，两条路线都不漏。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。只保留 $x$ 一条路线，漏掉 $y=uv$ 也含 $u$ 的项 $2yv$。</span></div>"
  },
  {
   "id": "ch13-q6",
   "ch": "ch13",
   "type": "mcq",
   "difficulty": 1,
   "kp": "13.5 Directional Derivatives and Gradient Vectors", "tags": ["output"],
   "scope": "outside",
   "stem": "函数 $f(x,y)=x^{2}+4y^{2}$ 在点 $(1,1)$ 处的最大变化率为？",
   "options": [
    {
     "text": "$\\sqrt{17}$",
     "correct": false
    },
    {
     "text": "$2\\sqrt{17}$",
     "correct": true
    },
    {
     "text": "$10$",
     "correct": false
    },
    {
     "text": "$68$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\sqrt{17}$ 相当于把 $\\sqrt{68}$ 又除以 $4$，化简时多提了一个因子。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$\\nabla f=(2x,8y)$，在 $(1,1)$ 为 $(2,8)$，最大变化率 $=|\\nabla f|=\\sqrt{68}=2\\sqrt{17}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$10$ 是分量之和 $2+8$，向量的模要按平方和开方。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$68$ 是 $|\\nabla f|^{2}$，即模的平方，还要再开方。</span></div>"
  },
  {
   "id": "ch13-q7",
   "ch": "ch13",
   "type": "mcq",
   "difficulty": 2,
   "kp": "13.6 Tangent Planes and Differentials", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "曲面 $z=x^{2}+y^{2}$ 在点 $(1,1,2)$ 处的切平面方程是？",
   "options": [
    {
     "text": "$z=2x+2y-4$",
     "correct": false
    },
    {
     "text": "$z=-2x-2y+6$",
     "correct": false
    },
    {
     "text": "$z=2x+2y$",
     "correct": false
    },
    {
     "text": "$z=2x+2y-2$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。相当于把 $-(z-z_0)$ 写成 $-z$，漏掉 $z_0=2$，常数项多减了 $2$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。把 $-(z-z_0)$ 写成 $+(z-z_0)$，法向量的 $z$ 分量符号反了。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。当作过原点的平面，漏掉切点 $(1,1,2)$ 带来的常数修正。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$f_x(1,1)=f_y(1,1)=2$，切平面 $2(x-1)+2(y-1)-(z-2)=0$，化简得 $z=2x+2y-2$。</span></div>"
  },
  {
   "id": "ch13-q8",
   "ch": "ch13",
   "type": "mcq",
   "difficulty": 2,
   "kp": "13.7 Extreme Values and Saddle Points", "tags": ["output"],
   "scope": "outside",
   "stem": "设 $f(x,y)=x^{2}-y^{2}$，则点 $(0,0)$ 是 $f$ 的？",
   "options": [
    {
     "text": "局部极大值点",
     "correct": false
    },
    {
     "text": "鞍点",
     "correct": true
    },
    {
     "text": "局部极小值点",
     "correct": false
    },
    {
     "text": "判别法失效，需回到定义",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。沿 $x$ 轴 $f=x^{2}>0=f(0,0)$，函数值还能增大，不是极大。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$f_x=f_y=0$ 给出临界点 $(0,0)$，$D=f_{xx}f_{yy}-f_{xy}^{2}=2\\cdot(-2)-0<0$，故为鞍点。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。虽有 $f_{xx}=2>0$，但 $D<0$ 时不能判极小；沿 $y$ 轴 $f=-y^{2}$ 在减小。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$D=-4\\neq0$，判别法有效；只有 $D=0$ 时才失效。</span></div>"
  },
  {
   "id": "ch13-q9",
   "ch": "ch13",
   "type": "mcq",
   "difficulty": 2,
   "kp": "13.8 Lagrange Multipliers", "tags": ["output"],
   "scope": "outside",
   "stem": "用拉格朗日乘子法求 $f(x,y)=xy$ 在约束 $x+y=2$ 下的最大值，结果为？",
   "options": [
    {
     "text": "$1$",
     "correct": true
    },
    {
     "text": "$2$",
     "correct": false
    },
    {
     "text": "$4$",
     "correct": false
    },
    {
     "text": "$0$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$\\nabla f=(y,x)=\\lambda(1,1)$ 给出 $x=y$，代入 $x+y=2$ 得 $(1,1)$，$f=1$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$2$ 是约束中的常数（$x+y=2$），不是目标函数的最大值。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$4$ 相当于把 $x=y=2$ 代入，但该点不满足约束 $x+y=2$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$0$ 是端点 $(0,2)$ 与 $(2,0)$ 处的值，不是内点的最大值。</span></div>"
  },
  {
   "id": "ch13-q10",
   "ch": "ch13",
   "type": "mcq",
   "difficulty": 3,
   "kp": "13.10 Partial Derivatives with Constrained Variables", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "设 $w=x^{2}+y^{2}+z^{2}$ 且 $z=x^{2}+y^{2}$，取 $x,y$ 为自变量，则 $\\left(\\frac{\\partial w}{\\partial x}\\right)_{y}$ 等于？",
   "options": [
    {
     "text": "$2x$",
     "correct": false
    },
    {
     "text": "$2x+4x^{3}+4xy^{2}$",
     "correct": true
    },
    {
     "text": "$2x+2z$",
     "correct": false
    },
    {
     "text": "$0$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$2x$ 只算了 $w$ 显含 $x$ 的部分，漏掉 $z$ 随 $x$ 变化带来的项。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。代入约束得 $w=x^{2}+y^{2}+(x^{2}+y^{2})^{2}$，对 $x$ 求偏导为 $2x+2(x^{2}+y^{2})\\cdot 2x$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$2x+2z$ 虽加了 $w_z=2z$，却漏乘链式因子 $z_x=2x$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$0$ 是改取 $x,z$ 为自变量（固定 $z$）时的结果，与本题选择不符。</span></div>"
  },
  {
   "id": "ch13-q11",
   "ch": "ch13",
   "type": "mcq",
   "difficulty": 1,
   "kp": "13.1 Functions of Several Variables", "tags": ["output"],
   "scope": "outside",
   "stem": "集合 $S=\\{(x,y):1\\le x^{2}+y^{2}<4\\}$ 是？",
   "options": [
    {
     "text": "有界开区域",
     "correct": false
    },
    {
     "text": "有界闭区域",
     "correct": false
    },
    {
     "text": "既不开也不闭的有界区域",
     "correct": true
    },
    {
     "text": "无界闭区域",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。内圆周 $x^{2}+y^{2}=1$ 上的点属于 $S$，即 $S$ 含有边界点，不是开区域。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。外圆周 $x^{2}+y^{2}=4$ 上的点不属于 $S$，即 $S$ 不含全部边界点，不是闭区域。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。内边界取到、外边界未取到，故既不开也不闭；又含于半径 $2$ 的圆盘内，有界。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$S$ 含于 $x^{2}+y^{2}<4$ 中故有界；缺外圆周上的点又使它不是闭集。</span></div>"
  },
  {
   "id": "ch13-q12",
   "ch": "ch13",
   "type": "mcq",
   "difficulty": 2,
   "kp": "13.2 Limits and Continuity in Higher Dimensions", "tags": ["concept"],
   "scope": "outside",
   "stem": "设 $f(x,y)=\\frac{xy}{\\sqrt{x^{2}+y^{2}}}$（$(x,y)\\neq(0,0)$），$f(0,0)=0$，则 $f$ 在 $(0,0)$ 处的性质是？",
   "options": [
    {
     "text": "$f$ 在 $(0,0)$ 处不连续",
     "correct": false
    },
    {
     "text": "$f$ 在 $(0,0)$ 处连续但不可微",
     "correct": true
    },
    {
     "text": "$f$ 在 $(0,0)$ 处连续且可微",
     "correct": false
    },
    {
     "text": "$f$ 在 $(0,0)$ 处偏导数不存在",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。由 $|xy|\\le\\frac{x^{2}+y^{2}}{2}$ 得 $|f|\\le\\frac{1}{2}\\sqrt{x^{2}+y^{2}}\\to0=f(0,0)$，故连续。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。夹逼得 $f\\to0=f(0,0)$，故连续；但 $\\frac{f(h,k)}{\\sqrt{h^{2}+k^{2}}}=\\frac{hk}{h^{2}+k^{2}}$ 沿 $k=h$ 趋于 $\\frac{1}{2}\\neq0$，故不可微。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。可微要求 $\\frac{\\Delta f-f_{x}\\Delta x-f_{y}\\Delta y}{\\sqrt{\\Delta x^{2}+\\Delta y^{2}}}\\to0$，本例沿 $k=h$ 该比值为 $\\frac{1}{2}$，不满足。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。由定义 $f_{x}(0,0)=\\lim_{h\\to0}\\frac{f(h,0)-0}{h}=0$，同理 $f_{y}(0,0)=0$，两条偏导都存在。</span></div>"
  },
  {
   "id": "ch13-q13",
   "ch": "ch13",
   "type": "mcq",
   "difficulty": 3,
   "kp": "13.3 Partial Derivatives", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "设 $f(x,y)=\\frac{xy(x^{2}-y^{2})}{x^{2}+y^{2}}$（$(x,y)\\neq(0,0)$），$f(0,0)=0$，则 $f_{xy}(0,0)$ 与 $f_{yx}(0,0)$ 的值是？",
   "options": [
    {
     "text": "$f_{xy}(0,0)=-1$，$f_{yx}(0,0)=1$",
     "correct": true
    },
    {
     "text": "$f_{xy}(0,0)=1$，$f_{yx}(0,0)=-1$",
     "correct": false
    },
    {
     "text": "两者都等于 $0$",
     "correct": false
    },
    {
     "text": "由 Clairaut 定理，两者必相等",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。由定义算得 $f_{x}(0,y)=-y$（$y\\neq0$）、$f_{y}(x,0)=x$（$x\\neq0$），故 $f_{xy}(0,0)=-1$，$f_{yx}(0,0)=1$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。两个值写反了：$f_{x}(0,y)=-y$ 再对 $y$ 求值得 $-1$；$f_{y}(x,0)=x$ 再对 $x$ 求值得 $1$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$f$ 沿两条坐标轴确实恒为 $0$，但 $f_{x}(0,y)=-y$ 并不恒为 $0$，故 $f_{xy}(0,0)=-1$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。Clairaut 定理要求 $f_{xy},f_{yx}$ 在 $(0,0)$ 连续，本例二阶混合偏导在原点不连续，条件不成立。</span></div>"
  },
  {
   "id": "ch13-q14",
   "ch": "ch13",
   "type": "mcq",
   "difficulty": 1,
   "kp": "13.4 The Chain Rule", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "设 $f(x,y)=x^{2}y+y^{3}$，$\\mathbf{r}(t)=(t^{2},t)$，则 $\\frac{d}{dt}f(\\mathbf{r}(t))\\big|_{t=1}=$？",
   "options": [
    {
     "text": "$2$",
     "correct": false
    },
    {
     "text": "$6$",
     "correct": false
    },
    {
     "text": "$4$",
     "correct": false
    },
    {
     "text": "$8$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$2=f(1,1)$ 是 $t=1$ 时的函数值，题目要的是沿曲线的变化率。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$6=(2,4)\\cdot(1,1)$ 用的是点 $\\mathbf{r}(1)=(1,1)$，应改用切向量 $\\mathbf{r}'(1)=(2,1)$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$4$ 只算了 $f_{x}\\frac{dx}{dt}=2\\cdot2$，漏掉 $f_{y}\\frac{dy}{dt}=4\\cdot1$ 这一条路线。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$\\nabla f=(2xy,x^{2}+3y^{2})$ 在 $(1,1)$ 为 $(2,4)$，$\\mathbf{r}'(1)=(2,1)$，点积得 $2\\cdot2+4\\cdot1=8$。</span></div>"
  },
  {
   "id": "ch13-q15",
   "ch": "ch13",
   "type": "mcq",
   "difficulty": 1,
   "kp": "13.5 Directional Derivatives and Gradient Vectors", "tags": ["output"],
   "scope": "outside",
   "stem": "设 $f(x,y)=x^{2}y$，则 $f$ 在点 $(1,2)$ 处沿 $\\mathbf{v}=3\\mathbf{i}+4\\mathbf{j}$ 方向的方向导数是？",
   "options": [
    {
     "text": "$16$",
     "correct": false
    },
    {
     "text": "$\\frac{16}{5}$",
     "correct": true
    },
    {
     "text": "$\\frac{16}{25}$",
     "correct": false
    },
    {
     "text": "$\\sqrt{17}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。直接用 $\\mathbf{v}$ 与梯度点乘：$4\\cdot3+1\\cdot4=16$，忘了先把方向向量单位化。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$\\nabla f=(2xy,x^{2})$ 在 $(1,2)$ 为 $(4,1)$，$|\\mathbf{v}|=5$，$D_{\\mathbf{u}}f=4\\cdot\\frac{3}{5}+1\\cdot\\frac{4}{5}=\\frac{16}{5}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac{16}{25}$ 相当于除以 $|\\mathbf{v}|^{2}=25$，而单位化只需除以 $|\\mathbf{v}|=5$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\sqrt{17}=|\\nabla f|$ 是沿梯度方向的最大变化率，不是沿 $(3,4)$ 方向的变化率。</span></div>"
  },
  {
   "id": "ch13-q16",
   "ch": "ch13",
   "type": "mcq",
   "difficulty": 2,
   "kp": "13.6 Tangent Planes and Differentials", "tags": ["output"],
   "scope": "outside",
   "stem": "曲面 $x^{2}+2y^{2}+3z^{2}=6$ 在点 $(1,1,1)$ 处的切平面方程是？",
   "options": [
    {
     "text": "$x+2y+3z=3$",
     "correct": false
    },
    {
     "text": "$x+2y+3z=6$",
     "correct": true
    },
    {
     "text": "$x+2y+3z=12$",
     "correct": false
    },
    {
     "text": "$x+y+z=3$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。右端 $3$ 是切点坐标之和 $x_{0}+y_{0}+z_{0}$；正确常数由 $x_{0}+2y_{0}+3z_{0}=6$ 定出。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$\\nabla F=(2x,4y,6z)$ 在 $(1,1,1)$ 为 $(2,4,6)$，切平面 $2(x-1)+4(y-1)+6(z-1)=0$，即 $x+2y+3z=6$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$12$ 属于未约简的方程 $2x+4y+6z=12$；系数约简为 $1,2,3$ 时右端应同步除以 $2$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\nabla F$ 在 $(1,1,1)$ 是 $(2,4,6)$ 而非 $(1,1,1)$，法向量的分量取错了。</span></div>"
  },
  {
   "id": "ch13-q17",
   "ch": "ch13",
   "type": "mcq",
   "difficulty": 2,
   "kp": "13.6 Tangent Planes and Differentials", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "设 $f(x,y)=\\sqrt{x^{2}+y^{2}}$，在点 $(3,4)$ 处取 $dx=0.01$，$dy=-0.02$，则全微分 $df=$？",
   "options": [
    {
     "text": "$0.010$",
     "correct": false
    },
    {
     "text": "$-0.016$",
     "correct": false
    },
    {
     "text": "$-0.010$",
     "correct": true
    },
    {
     "text": "$-0.10$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。把 $dy=-0.02$ 的负号当成正号才会得正值；$df$ 的符号由 $f_{x}dx+f_{y}dy$ 共同决定。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$-0.016$ 只是第二项 $f_{y}dy=\\frac{4}{5}(-0.02)$，漏掉第一项 $f_{x}dx=\\frac{3}{5}(0.01)=0.006$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$f_{x}=\\frac{x}{\\sqrt{x^{2}+y^{2}}}=\\frac{3}{5}$，$f_{y}=\\frac{4}{5}$，$df=\\frac{3}{5}(0.01)+\\frac{4}{5}(-0.02)=0.006-0.016=-0.010$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。把偏导误算为 $2x=6$、$2y=8$（对根式求导漏掉外层因子），得 $6(0.01)+8(-0.02)=-0.10$。</span></div>"
  },
  {
   "id": "ch13-q18",
   "ch": "ch13",
   "type": "mcq",
   "difficulty": 3,
   "kp": "13.7 Extreme Values and Saddle Points", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "函数 $f(x,y)=x^{2}+2y^{2}-2x-4y+5$ 在闭区域 $0\\le x\\le2$，$0\\le y\\le2$ 上的绝对最大值是？",
   "options": [
    {
     "text": "$2$",
     "correct": false
    },
    {
     "text": "$3$",
     "correct": false
    },
    {
     "text": "$4$",
     "correct": false
    },
    {
     "text": "$5$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$2$ 是内部驻点 $(1,1)$ 处的值，它其实是全区域上的最小值。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$3$ 是边 $x=0$（或 $x=2$）上驻点处的值，只查了边界驻点而漏算四个角点。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$4$ 是边 $y=0$（或 $y=2$）上驻点处的值，同样漏掉角点处的更大值。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。内部驻点 $(1,1)$ 给 $2$；四条边的驻点给 $3$ 与 $4$；四个角点都使 $f=5$，比较得最大值 $5$。</span></div>"
  },
  {
   "id": "ch13-q19",
   "ch": "ch13",
   "type": "mcq",
   "difficulty": 2,
   "kp": "13.8 Lagrange Multipliers", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "求 $f(x,y,z)=x^{2}+y^{2}+z^{2}$ 在平面 $x-y=0$ 与平面 $x+y+z=1$ 的交线上的最小值，结果是？",
   "options": [
    {
     "text": "$\\frac{1}{3}$",
     "correct": true
    },
    {
     "text": "$\\frac{1}{9}$",
     "correct": false
    },
    {
     "text": "$\\frac{\\sqrt{3}}{3}$",
     "correct": false
    },
    {
     "text": "$\\frac{2}{9}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。两约束须设两个乘子：$2x=\\lambda+\\mu$，$2y=\\lambda-\\mu$，$2z=\\lambda$；由 $x=y$ 得 $\\mu=0$、$x=z$，再由 $x+y+z=1$ 得 $x=y=z=\\frac{1}{3}$，$f=\\frac{1}{3}$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\frac{1}{9}$ 只算了 $x^{2}$ 一项，漏掉同样等于 $\\frac{1}{9}$ 的 $y^{2}$ 与 $z^{2}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac{\\sqrt{3}}{3}=\\sqrt{\\frac{1}{3}}$ 是最短距离本身；目标函数是距离平方，不必再开方。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{2}{9}$ 只算了 $x^{2}+y^{2}$ 两项，漏掉 $z^{2}=\\frac{1}{9}$。</span></div>"
  },
  {
   "id": "ch13-q20",
   "ch": "ch13",
   "type": "mcq",
   "difficulty": 2,
   "kp": "13.10 Partial Derivatives with Constrained Variables", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "设 $w=x^{2}+2y^{2}+3z^{2}$ 且 $z=x+y$，则 $\\left(\\frac{\\partial w}{\\partial x}\\right)_{z}$ 等于？",
   "options": [
    {
     "text": "$8x+6y$",
     "correct": false
    },
    {
     "text": "$4x-4z$",
     "correct": false
    },
    {
     "text": "$6x-4z$",
     "correct": true
    },
    {
     "text": "$4z-2x$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$8x+6y$ 是把 $y$ 当常数（即以 $x,y$ 为自变量）的结果，与下标 $z$ 的要求不符。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$4x-4z$ 只算了 $y$ 随 $x$ 变化的链式项 $w_{y}y_{x}=4y\\cdot(-1)=-4y$，漏掉 $w$ 显含 $x$ 的 $2x$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。固定 $z$ 时由 $z=x+y$ 得 $y=z-x$，代入得 $w=x^{2}+2(z-x)^{2}+3z^{2}$，$w_{x}=2x-4(z-x)=6x-4z$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。把 $y=z-x$ 对 $x$ 的导数当成 $+1$：$2x+4y=2x+4(z-x)=4z-2x$，而 $y_{x}$ 应为 $-1$。</span></div>"
  },
  {
   "id": "ch14-q1",
   "ch": "ch14",
   "type": "mcq",
   "difficulty": 1,
   "kp": "14.1 Double and Iterated Integrals over Rectangles", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "设 $R$ 是矩形 $0\\le x\\le1$、$0\\le y\\le2$，则 $\\int_0^1\\int_0^2 (x+y)\\,dy\\,dx$ 的值是？",
   "options": [
    {
     "text": "$3$",
     "correct": true
    },
    {
     "text": "$2$",
     "correct": false
    },
    {
     "text": "$4$",
     "correct": false
    },
    {
     "text": "$1$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。内层先对 $y$ 积：$\\int_0^2(x+y)\\,dy=2x+2$；外层 $\\int_0^1(2x+2)\\,dx=1+2=3$。矩形上由 Fubini 定理两序等值。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$2$ 只来自 $\\int_0^1\\int_0^2 y\\,dy\\,dx=2$，漏掉了内层对 $y$ 积分时由 $x$ 贡献的 $2x$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$4$ 是把 $\\int_0^1 2x\\,dx$ 误算成 $2x$ 在 $x=1$ 处的值 $2$（原函数应为 $x^2$），再加 $2$ 得到。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$1$ 是把 $\\iint(x+y)\\,dA$ 误当成 $(\\int x)(\\int y)$：Fubini 定理只降为两个累次积分，不能把被积函数的和拆成两积分之积。</span></div>"
  },
  {
   "id": "ch14-q2",
   "ch": "ch14",
   "type": "mcq",
   "difficulty": 2,
   "kp": "14.2 Double Integrals over General Regions", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "区域 $R$ 由 $y=x^2$ 与 $y=2x$ 围成，把 $\\iint_R f\\,dA$ 写成先对 $x$ 后对 $y$ 的累次积分，结果是？",
   "options": [
    {
     "text": "$\\int_0^4\\int_{\\sqrt y}^{y/2} f\\,dx\\,dy$",
     "correct": false
    },
    {
     "text": "$\\int_0^4\\int_{y/2}^{\\sqrt y} f\\,dx\\,dy$",
     "correct": true
    },
    {
     "text": "$\\int_0^2\\int_0^2 f\\,dx\\,dy$",
     "correct": false
    },
    {
     "text": "$\\int_0^4\\int_0^{\\sqrt y} f\\,dx\\,dy$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。横切时进 $R$ 处是左边界 $x=\\frac y2$（下限）、出 $R$ 处是右边界 $x=\\sqrt y$（上限），上下限写反会得到负值。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。交点 $(0,0)$、$(2,4)$；$0\\le y\\le4$ 内横线从 $x=\\frac y2$（由 $y=2x$）进、从 $x=\\sqrt y$（由 $y=x^2$）出。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。这是把区域当成了常数限的正方形，而原区域上下界是曲线，交换次序必须先画图重新穿线。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。下限写 $0$ 相当于换成由 $y$ 轴、$y=x^2$、$y=4$ 围成的另一块区域，漏掉了左边界 $x=\\frac y2$。</span></div>"
  },
  {
   "id": "ch14-q3",
   "ch": "ch14",
   "type": "mcq",
   "difficulty": 2,
   "kp": "14.2 Double Integrals over General Regions", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "交换积分次序后，$\\int_0^1\\int_x^1 \\sin(y^2)\\,dy\\,dx$ 的值是？",
   "options": [
    {
     "text": "$1-\\cos 1$",
     "correct": false
    },
    {
     "text": "$\\frac{\\cos 1-1}{2}$",
     "correct": false
    },
    {
     "text": "$\\frac{1-\\cos 1}{2}$",
     "correct": true
    },
    {
     "text": "$\\frac{1}{2}\\sin 1$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。漏了换元 $u=y^2$ 带来的系数：$\\int_0^1 y\\sin(y^2)\\,dy=\\frac12\\int_0^1\\sin u\\,du$，正确值还要除以 $2$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。换序后为 $\\frac12[-\\cos u]_0^1=\\frac{1-\\cos 1}{2}$；写成 $\\cos 1-1$ 是把 $-\\cos u$ 代入上下限时符号弄反。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。原区域横切后为 $0\\le x\\le y$、$0\\le y\\le1$，故原式 $=\\int_0^1 y\\sin(y^2)\\,dy=\\frac{1-\\cos1}{2}$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac12\\sin 1$ 相当于把 $\\int_0^1\\sin u\\,du$ 误当作 $\\sin u$ 在 $u=1$ 处的取值，漏掉 $-\\cos u$ 的端点相减。</span></div>"
  },
  {
   "id": "ch14-q4",
   "ch": "ch14",
   "type": "mcq",
   "difficulty": 1,
   "kp": "14.3 Area by Double Integration", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "单位圆盘 $R: x^2+y^2\\le1$ 上，函数 $f(x,y)=x^2+y^2$ 的平均值是？",
   "options": [
    {
     "text": "$\\frac{1}{4}$",
     "correct": false
    },
    {
     "text": "$\\frac{1}{3}$",
     "correct": false
    },
    {
     "text": "$\\frac{\\pi}{2}$",
     "correct": false
    },
    {
     "text": "$\\frac{1}{2}$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac14$ 只是极坐标内层 $\\int_0^1 r^3dr$ 的值，忘了对 $\\theta$ 积分还要乘 $2\\pi$，最后也别忘了除面积 $\\pi$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。把 $dA$ 写成 $dr\\,d\\theta$ 漏掉因子 $r$ 才会出现这种结果；极坐标必须用 $dA=r\\,dr\\,d\\theta$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac{\\pi}{2}=\\int_0^{2\\pi}\\int_0^1 r^3\\,dr\\,d\\theta$ 是积分值本身，求平均值还须除以圆盘面积 $\\pi$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$\\bar f=\\frac{1}{\\pi}\\iint_R(x^2+y^2)\\,dA=\\frac12$：积分值 $\\frac{\\pi}{2}$ 再除圆盘面积 $\\pi$。</span></div>"
  },
  {
   "id": "ch14-q5",
   "ch": "ch14",
   "type": "mcq",
   "difficulty": 1,
   "kp": "14.4 Double Integrals in Polar Form", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "区域 $R$ 是圆环 $1\\le x^2+y^2\\le4$ 位于第一象限的部分，则 $\\iint_R f\\,dA$ 化为极坐标的累次积分是？",
   "options": [
    {
     "text": "$\\int_0^{\\pi/2}\\int_1^2 f(r\\cos\\theta,r\\sin\\theta)\\,r\\,dr\\,d\\theta$",
     "correct": true
    },
    {
     "text": "$\\int_0^{2\\pi}\\int_1^2 f(r\\cos\\theta,r\\sin\\theta)\\,r\\,dr\\,d\\theta$",
     "correct": false
    },
    {
     "text": "$\\int_0^{\\pi/2}\\int_1^2 f(r\\cos\\theta,r\\sin\\theta)\\,dr\\,d\\theta$",
     "correct": false
    },
    {
     "text": "$\\int_0^{\\pi/2}\\int_1^2 f(r\\cos\\theta,r\\sin\\theta)\\,\\frac{1}{r}\\,dr\\,d\\theta$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$dA=r\\,dr\\,d\\theta$；圆环给出 $1\\le r\\le2$，第一象限给出 $0\\le\\theta\\le\\frac{\\pi}{2}$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\theta$ 取 $0\\to2\\pi$ 会把四个象限都算进去，得到整个圆环，而不是第一象限那四分之一。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。漏掉极坐标的雅可比因子：$dx\\,dy=r\\,dr\\,d\\theta$，少乘 $r$ 会使结果偏小。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。环带面积微元是 $r\\,dr\\,d\\theta$（雅可比 $J=r$），写成 $\\frac1r$ 相当于把雅可比取成了倒数。</span></div>"
  },
  {
   "id": "ch14-q6",
   "ch": "ch14",
   "type": "mcq",
   "difficulty": 2,
   "kp": "14.5 Triple Integrals in Rectangular Coordinates", "tags": ["output"],
   "scope": "outside",
   "stem": "立体 $D$ 由抛物面 $z=x^2+y^2$ 与平面 $z=4$ 围成，把 $\\iiint_D F\\,dV$ 写成 $dz\\,dy\\,dx$ 次序的累次积分是？",
   "options": [
    {
     "text": "$\\int_{-2}^{2}\\int_0^{\\sqrt{4-x^2}}\\int_{x^2+y^2}^{4} F\\,dz\\,dy\\,dx$",
     "correct": false
    },
    {
     "text": "$\\int_{-2}^{2}\\int_{-\\sqrt{4-x^2}}^{\\sqrt{4-x^2}}\\int_{x^2+y^2}^{4} F\\,dz\\,dy\\,dx$",
     "correct": true
    },
    {
     "text": "$\\int_{-2}^{2}\\int_{-\\sqrt{4-x^2}}^{\\sqrt{4-x^2}}\\int_{4}^{x^2+y^2} F\\,dz\\,dy\\,dx$",
     "correct": false
    },
    {
     "text": "$\\int_{-2}^{2}\\int_{-2}^{2}\\int_{x^2+y^2}^{4} F\\,dz\\,dy\\,dx$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$y$ 取 $0\\to\\sqrt{4-x^2}$ 只覆盖投影圆盘的上半；投影是整个圆盘，$y$ 应从 $-\\sqrt{4-x^2}$ 到 $\\sqrt{4-x^2}$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。投影到 $xy$ 平面得圆盘 $x^2+y^2\\le4$；竖线进 $D$ 于下曲面 $z=x^2+y^2$、出于上曲面 $z=4$，故 $x^2+y^2\\le z\\le4$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$dz$ 的上下限写反了：进 $D$ 处是下曲面 $z=x^2+y^2$（下限），出 $D$ 处是上曲面 $z=4$（上限）。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。投影是圆盘而不是正方形 $[-2,2]\\times[-2,2]$，$y$ 的上下限必须随 $x$ 变化。</span></div>"
  },
  {
   "id": "ch14-q7",
   "ch": "ch14",
   "type": "mcq",
   "difficulty": 2,
   "kp": "14.6 Applications", "tags": ["output"],
   "scope": "outside",
   "stem": "薄板 $R$ 的面密度为 $\\delta(x,y)$，则它关于 $x$ 轴的转动惯量 $I_x$ 等于？",
   "options": [
    {
     "text": "$\\iint_R x^2\\delta\\,dA$",
     "correct": false
    },
    {
     "text": "$\\iint_R (x^2+y^2)\\delta\\,dA$",
     "correct": false
    },
    {
     "text": "$\\iint_R y^2\\delta\\,dA$",
     "correct": true
    },
    {
     "text": "$\\iint_R y\\delta\\,dA$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\iint_R x^2\\delta\\,dA$ 是绕 $y$ 轴的转动惯量 $I_y$：到 $y$ 轴的距离才是 $x$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\iint_R(x^2+y^2)\\delta\\,dA$ 是绕原点的极转动惯量 $I_0=I_x+I_y$，不是绕某一条轴的转动惯量。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$I_x=\\iint_R y^2\\delta\\,dA$：质量元到 $x$ 轴的距离是 $y$，符合 $I=\\int r^2\\,dm$ 的定义。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\iint_R y\\delta\\,dA$ 是绕 $x$ 轴的一阶矩 $M_x$（用于求 $\\bar y=M_x/M$），还缺一个 $y$ 因子。</span></div>"
  },
  {
   "id": "ch14-q8",
   "ch": "ch14",
   "type": "mcq",
   "difficulty": 2,
   "kp": "14.7 Triple Integrals in Cylindrical and Spherical Coordinates", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "立体 $D$ 是圆锥面 $z=\\sqrt{x^2+y^2}$ 与平面 $z=2$ 围成的锥体内部，则用柱面坐标写出的 $\\iiint_D f\\,dV$ 是？",
   "options": [
    {
     "text": "$\\int_0^{2\\pi}\\int_0^2\\int_0^2 f\\,r\\,dz\\,dr\\,d\\theta$",
     "correct": false
    },
    {
     "text": "$\\int_0^{2\\pi}\\int_0^2\\int_0^{r} f\\,r\\,dz\\,dr\\,d\\theta$",
     "correct": false
    },
    {
     "text": "$\\int_0^{2\\pi}\\int_0^2\\int_{r}^{2} f\\,dz\\,dr\\,d\\theta$",
     "correct": false
    },
    {
     "text": "$\\int_0^{2\\pi}\\int_0^2\\int_{r}^{2} f\\,r\\,dz\\,dr\\,d\\theta$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$z$ 从 $0$ 到 $2$ 是整根竖线，会把锥面外侧不属于 $D$ 的部分也算进去；$D$ 内必须满足 $r\\le z$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$z$ 限写成 $0\\to r$ 得到的是锥面下方那一块，与 $D$（锥面之上、平面 $z=2$ 之下）恰好相反。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。漏掉柱面坐标的体积因子：$dV=r\\,dz\\,dr\\,d\\theta$，少乘 $r$ 会使结果偏小。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。锥面即 $z=r$，故 $r\\le z\\le2$；配 $0\\le r\\le2$、$0\\le\\theta\\le2\\pi$ 与 $dV=r\\,dz\\,dr\\,d\\theta$。</span></div>"
  },
  {
   "id": "ch14-q9",
   "ch": "ch14",
   "type": "mcq",
   "difficulty": 3,
   "kp": "14.8 Substitutions in Multiple Integrals", "tags": ["concept","trap"],
   "scope": "outside",
   "stem": "用换元 $x=2u$、$y=3v$ 计算椭圆区域 $R: \\frac{x^2}{4}+\\frac{y^2}{9}\\le1$ 上的 $\\iint_R f(x,y)\\,dx\\,dy$，化为 $uv$ 平面上的积分正确的是？",
   "options": [
    {
     "text": "$\\iint_G f(2u,3v)\\cdot6\\,du\\,dv$",
     "correct": true
    },
    {
     "text": "$\\iint_G f(2u,3v)\\cdot\\frac{1}{6}\\,du\\,dv$",
     "correct": false
    },
    {
     "text": "$\\iint_G f(2u,3v)\\,du\\,dv$",
     "correct": false
    },
    {
     "text": "$\\iint_R f(2u,3v)\\cdot6\\,du\\,dv$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。线性变换的雅可比 $x_uy_v-x_vy_u=2\\cdot3-0\\cdot0=6$，换元公式乘 $|J|=6$；椭圆边界化为 $u^2+v^2=1$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\frac16$ 是逆变换 $\\frac{\\partial(u,v)}{\\partial(x,y)}$ 的雅可比，而换元公式里乘的必须是正变换的 $|J|$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。漏乘面积放大率 $|J|=6$，相当于按单位圆盘计算，结果会偏小 $6$ 倍。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。换元必须连区域一起换：积分区域要改写为 $uv$ 平面上的原像 $G: u^2+v^2\\le1$，不能仍写 $R$。</span></div>"
  },
  {
   "id": "ch14-q10",
   "ch": "ch14",
   "type": "mcq",
   "difficulty": 1,
   "kp": "14.7 Triple Integrals in Cylindrical and Spherical Coordinates", "tags": ["output"],
   "scope": "outside",
   "stem": "球面坐标中，球 $\\rho\\le a$ 的体积写成累次积分时，体积微元与 $\\phi$ 的取值范围分别是？",
   "options": [
    {
     "text": "$dV=\\rho^2\\sin\\theta\\,d\\rho\\,d\\phi\\,d\\theta$，$0\\le\\phi\\le\\pi$",
     "correct": false
    },
    {
     "text": "$dV=\\rho^2\\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta$，$0\\le\\phi\\le\\pi$",
     "correct": true
    },
    {
     "text": "$dV=\\rho^2\\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta$，$0\\le\\phi\\le2\\pi$",
     "correct": false
    },
    {
     "text": "$dV=\\rho\\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta$，$0\\le\\phi\\le\\pi$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。微元含 $\\rho^2\\sin\\phi$；$\\sin\\phi$ 里的 $\\phi$ 是与 $z$ 轴的夹角，不是方位角 $\\theta$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$dV=\\rho^2\\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta$ 是三边长之积；球含全部方向，故 $0\\le\\phi\\le\\pi$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\phi$ 是与 $z$ 轴正向的夹角，范围 $0\\to\\pi$；$0\\to2\\pi$ 是方位角 $\\theta$ 的范围。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。漏了一个 $\\rho$：纬线方向弧长为 $\\rho\\sin\\phi\\,\\Delta\\theta$、经线方向为 $\\rho\\,\\Delta\\phi$，故微元含 $\\rho^2$。</span></div>"
  },
  {
   "id": "ch14-q11",
   "ch": "ch14",
   "type": "mcq",
   "difficulty": 1,
   "kp": "14.1 Double and Iterated Integrals over Rectangles", "tags": ["output"],
   "scope": "outside",
   "stem": "矩形 $R: 0\\le x\\le2,\\ 0\\le y\\le1$ 上，把 $\\iint_R f(x,y)\\,dA$ 写成先对 $x$ 的累次积分是？",
   "options": [
    {
     "text": "$\\int_0^1\\int_0^2 f(x,y)\\,dx\\,dy$",
     "correct": true
    },
    {
     "text": "$\\int_0^2\\int_0^1 f(x,y)\\,dx\\,dy$",
     "correct": false
    },
    {
     "text": "$\\int_0^1\\int_0^2 f(x,y)\\,dy\\,dx$",
     "correct": false
    },
    {
     "text": "$\\int_0^2\\int_0^1 \\int_0^1 f(x,y)\\,dx\\,dy\\,dz$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。先对 $x$ 积就写 $dx$，其限 $0\\to2$ 紧贴最内层积分号；Fubini 定理保证矩形上两序等值。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。内层是 $dx$ 却配了 $0\\to1$，那是 $y$ 的范围，$x$ 的限被错配成了 $y$ 的限。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$dy\\,dx$ 表示先对 $y$ 积，与要求的「先对 $x$」次序相反，且内层配的 $0\\to2$ 也是 $x$ 的限。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。二重积分只需两层积分号；多写一层 $dz$ 等于在矩形上又对 $z$ 积了一遍，无端多算。</span></div>"
  },
  {
   "id": "ch14-q12",
   "ch": "ch14",
   "type": "mcq",
   "difficulty": 1,
   "kp": "14.2 Double Integrals over General Regions", "tags": ["output"],
   "scope": "outside",
   "stem": "交换积分次序后，$\\int_0^1\\int_0^{1-x^2} f(x,y)\\,dy\\,dx$ 等于？",
   "options": [
    {
     "text": "$\\int_0^1\\int_0^{1-y^2} f(x,y)\\,dx\\,dy$",
     "correct": false
    },
    {
     "text": "$\\int_0^1\\int_0^{\\sqrt{1-y}} f(x,y)\\,dx\\,dy$",
     "correct": true
    },
    {
     "text": "$\\int_0^1\\int_0^1 f(x,y)\\,dx\\,dy$",
     "correct": false
    },
    {
     "text": "$\\int_0^1\\int_{1-y^2}^{1} f(x,y)\\,dx\\,dy$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。由 $y=1-x^2$ 反解得 $x=\\sqrt{1-y}$（区域在 $x\\ge0$）；写成 $\\sqrt{1-y^2}$ 是把它与本式混淆了。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。区域为 $0\\le x\\le1,\\ 0\\le y\\le1-x^2$；横切时 $0\\le y\\le1$ 内 $x$ 从 $0$ 进、从 $\\sqrt{1-y}$ 出。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。两个限都写成常数，等于把区域当成了单位正方形，丢掉了上边界 $y=1-x^2$，区域被放大。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。下限写成 $1-y^2$ 取的是抛物线 $y=1-x^2$ 上方那块，与原区域（抛物线下方）恰好互补。</span></div>"
  },
  {
   "id": "ch14-q13",
   "ch": "ch14",
   "type": "mcq",
   "difficulty": 1,
   "kp": "14.3 Area by Double Integration", "tags": ["output"],
   "scope": "outside",
   "stem": "求由曲线 $y=x^2$ 与 $y=2-x^2$ 所围区域的面积，结果是？",
   "options": [
    {
     "text": "$\\frac{4}{3}$",
     "correct": false
    },
    {
     "text": "$2$",
     "correct": false
    },
    {
     "text": "$\\frac{8}{3}$",
     "correct": true
    },
    {
     "text": "$\\frac{16}{3}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac43$ 只积了对称区间的一半（$0\\to1$）；对称区域必须积满 $-1\\to1$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$2$ 是两抛物线在 $x=0$ 处的竖直间距（最大高度），是高度而非积分出来的面积。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。交点 $x=\\pm1$；$A=\\int_{-1}^{1}(2-2x^2)dx=\\big[2x-\\frac{2x^3}3\\big]_{-1}^{1}=\\frac83$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{16}{3}$ 是把 $y$ 的限写成 $\\pm(2-x^2)$、上下两块都算进去的结果，恰为正确值的两倍。</span></div>"
  },
  {
   "id": "ch14-q14",
   "ch": "ch14",
   "type": "mcq",
   "difficulty": 2,
   "kp": "14.4 Double Integrals in Polar Form", "tags": ["output"],
   "scope": "outside",
   "stem": "单位圆盘 $R: x^2+y^2\\le1$ 上，$\\iint_R (x^2+y^2)^2\\,dA$ 的值是？",
   "options": [
    {
     "text": "$\\frac{\\pi}{2}$",
     "correct": false
    },
    {
     "text": "$\\frac{\\pi}{5}$",
     "correct": false
    },
    {
     "text": "$\\frac{\\pi}{4}$",
     "correct": false
    },
    {
     "text": "$\\frac{\\pi}{3}$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac{\\pi}{2}$ 对应内层 $\\int_0^1r^3dr$，被积函数被当成了 $x^2+y^2$（即 $r^2$）而非它的平方。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\frac{\\pi}{5}$ 来自漏乘极坐标雅可比 $r$：$\\int_0^1r^4dr=\\frac15$，且 $\\theta$ 只乘了 $\\pi$ 而非 $2\\pi$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac{\\pi}{4}$ 对应内层 $\\int_0^1r^3dr=\\frac14$ 且 $\\theta$ 只积 $0\\to\\pi$，被积函数与角度范围都打了对折。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。被积函数为 $r^4$，$\\int_0^{2\\pi}\\!\\!\\int_0^1 r^5\\,dr\\,d\\theta=2\\pi\\cdot\\frac16=\\frac{\\pi}{3}$。</span></div>"
  },
  {
   "id": "ch14-q15",
   "ch": "ch14",
   "type": "mcq",
   "difficulty": 2,
   "kp": "14.2 Double Integrals over General Regions", "tags": ["output"],
   "scope": "outside",
   "stem": "交换积分次序后，$\\int_0^1\\int_0^{1-x} \\frac{x^2}{1+y^2}\\,dy\\,dx$ 等于？",
   "options": [
    {
     "text": "$\\int_0^1\\int_0^{1-y} \\frac{x^2}{1+y^2}\\,dx\\,dy$",
     "correct": true
    },
    {
     "text": "$\\int_0^1\\int_0^{1-y} \\frac{x^2}{1+y}\\,dx\\,dy$",
     "correct": false
    },
    {
     "text": "$\\int_0^1\\int_{1-x}^{1} \\frac{x^2}{1+y^2}\\,dx\\,dy$",
     "correct": false
    },
    {
     "text": "$\\int_0^1\\int_0^{1-x} \\frac{x^2}{1+y^2}\\,dx\\,dy$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。区域 $0\\le x\\le1,\\ 0\\le y\\le1-x$ 是三角形；横切时 $x$ 从 $0$ 到 $1-y$，被积函数不变。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。两个限换对了，但把分母 $1+y^2$ 抄成了 $1+y$，被积函数已经不是原来的函数，结果变了。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。内层下限写成 $1-x$ 是混用了变量：换序后外层是 $y$，内层 $x$ 的下限应为 $0$（区域贴着 $y$ 轴）。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。两层次序并未真正交换：内层仍是 $dx$ 且限仍是 $0\\to1-x$，与给定的累次积分完全一样。</span></div>"
  },
  {
   "id": "ch14-q16",
   "ch": "ch14",
   "type": "mcq",
   "difficulty": 2,
   "kp": "14.5 Triple Integrals in Rectangular Coordinates", "tags": ["concept"],
   "scope": "outside",
   "stem": "用 $dz\\,dy\\,dx$ 次序的累次积分表示球体 $x^2+y^2+z^2\\le9$ 的体积，正确的是？",
   "options": [
    {
     "text": "$\\int_{-3}^{3}\\int_{-\\sqrt{9-x^2}}^{\\sqrt{9-x^2}}\\int_{0}^{\\sqrt{9-x^2-y^2}} dz\\,dy\\,dx$",
     "correct": false
    },
    {
     "text": "$\\int_{-3}^{3}\\int_{-\\sqrt{9-x^2}}^{\\sqrt{9-x^2}}\\int_{-\\sqrt{9-x^2-y^2}}^{\\sqrt{9-x^2-y^2}} dz\\,dy\\,dx$",
     "correct": true
    },
    {
     "text": "$\\int_{-3}^{3}\\int_{-3}^{3}\\int_{-3}^{3} dz\\,dy\\,dx$",
     "correct": false
    },
    {
     "text": "$\\int_{0}^{3}\\int_{0}^{\\sqrt{9-x^2}}\\int_{-\\sqrt{9-x^2-y^2}}^{\\sqrt{9-x^2-y^2}} r\\,dz\\,dy\\,dx$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$z$ 取 $0\\to\\sqrt{9-x^2-y^2}$ 只是上半球；球体在 $xy$ 面上下各半，$z$ 须从负根号积起。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。投影是圆盘 $x^2+y^2\\le9$；竖线穿球体，进于 $z=-\\sqrt{9-x^2-y^2}$、出于正根号。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。三个限全是常数（$y,z$ 都取 $\\pm3$），算出的是棱长 6 的正方体体积，不是球体。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。直角坐标的 $dz\\,dy\\,dx$ 中不该出现极坐标因子 $r$；用 $r$ 就必须把外两层也改成极坐标限。</span></div>"
  },
  {
   "id": "ch14-q17",
   "ch": "ch14",
   "type": "mcq",
   "difficulty": 2,
   "kp": "14.7 Triple Integrals in Cylindrical and Spherical Coordinates", "tags": ["output"],
   "scope": "outside",
   "stem": "用球面坐标求球体 $\\rho\\le2$ 中满足 $\\phi\\le\\frac{\\pi}{3}$ 的球面扇形体积，结果是？",
   "options": [
    {
     "text": "$\\frac{4\\pi}{3}$",
     "correct": false
    },
    {
     "text": "$\\frac{8\\pi}{3}$",
     "correct": true
    },
    {
     "text": "$\\frac{32\\pi}{3}$",
     "correct": false
    },
    {
     "text": "$\\frac{16\\pi}{3}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac{4\\pi}{3}$ 是半径 $1$ 的整球体积；本题 $\\rho$ 的上限是 $2$，且只取 $\\phi\\le\\frac{\\pi}{3}$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$\\rho$ 积出 $\\frac83$、$\\phi$ 积出 $\\frac12$、$\\theta$ 积出 $2\\pi$，三者相乘得 $\\frac{8\\pi}3$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac{32\\pi}{3}$ 是半径 $2$ 的整球体积，即把 $\\phi$ 限当成了 $0\\to\\pi$，忘了只取 $\\phi\\le\\frac{\\pi}{3}$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{16\\pi}{3}$ 是把 $\\phi$ 限取成 $0\\to\\frac{\\pi}{2}$（当成半球）的结果，而本题限是 $\\frac{\\pi}{3}$。</span></div>"
  },
  {
   "id": "ch14-q18",
   "ch": "ch14",
   "type": "mcq",
   "difficulty": 2,
   "kp": "14.7 Triple Integrals in Cylindrical and Spherical Coordinates", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "用柱面坐标计算由圆锥面 $z=\\sqrt{x^2+y^2}$ 与平面 $z=3$ 围成立体的体积，结果是？",
   "options": [
    {
     "text": "$9\\pi$",
     "correct": true
    },
    {
     "text": "$27\\pi$",
     "correct": false
    },
    {
     "text": "$18\\pi$",
     "correct": false
    },
    {
     "text": "$\\frac{9\\pi}{2}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。锥面即 $z=r$，故 $r\\le z\\le3$：$2\\pi\\int_0^3(3r-r^2)dr=2\\pi\\cdot\\frac92=9\\pi$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$27\\pi=\\pi r^2h$ 是漏掉锥体体积公式里的 $\\frac13$，相当于把该立体当成了等底等高的圆柱。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$18\\pi$ 来自把 $z$ 的限写成 $0\\to r$，那算的是锥面 $z=r$ 下方那块（顶点在原点），不是本题立体。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{9\\pi}{2}$ 是 $\\theta$ 只积了 $0\\to\\pi$（半个圆周）的结果，立体被削去了一半。</span></div>"
  },
  {
   "id": "ch14-q19",
   "ch": "ch14",
   "type": "mcq",
   "difficulty": 3,
   "kp": "14.6 Applications", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "三角形薄板顶点为 $(0,0),(4,0),(0,2)$，面密度 $\\delta(x,y)=x+y$，则它的形心纵坐标 $\\bar y$ 等于？",
   "options": [
    {
     "text": "$\\frac{5}{3}$",
     "correct": false
    },
    {
     "text": "$\\frac{4}{3}$",
     "correct": false
    },
    {
     "text": "$\\frac{1}{2}$",
     "correct": false
    },
    {
     "text": "$\\frac{2}{3}$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac53$ 是形心横坐标 $\\bar x=\\frac{M_y}{M}$；求 $\\bar y$ 要用 $M_x=\\iint y\\delta\\,dA$，两个一阶矩不能互换。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\frac43$ 是用面积 $4$ 代替质量 $M=8$ 作分母的结果；形心公式的分母必须是质量。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac12$ 来自把密度当成 $\\delta=x$（丢掉 $y$ 项），此时 $M=\\frac{16}3,M_x=\\frac83$，与本题密度不符。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$M=8$，$M_x=\\frac{16}3$（由 $\\iint y(x+y)\\,dA$ 算得），故 $\\bar y=\\frac{M_x}{M}=\\frac23$。</span></div>"
  },
  {
   "id": "ch14-q20",
   "ch": "ch14",
   "type": "mcq",
   "difficulty": 3,
   "kp": "14.8 Substitutions in Multiple Integrals", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "用换元 $u=x+y,\\ v=x-y$ 计算 $\\iint_R (x+y)\\,dx\\,dy$，其中 $R$ 是矩形 $1\\le x\\le2,\\ 1\\le y\\le2$，结果是？",
   "options": [
    {
     "text": "$6$",
     "correct": false
    },
    {
     "text": "$12$",
     "correct": false
    },
    {
     "text": "$3$",
     "correct": true
    },
    {
     "text": "$\\frac{3}{2}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$6$ 是漏乘雅可比 $|J|=\\frac12$ 的结果；换元公式必须乘面积放大率 $|J|$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$12$ 是把 $|J|$ 取成 $2$（即取成行列式的倒数）造成的，$x=\\frac{u+v}2,y=\\frac{u-v}2$ 给出 $|J|=\\frac12$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$x+y=u$，$|J|=\\frac12$；$R$ 的像是菱形 $G$，$\\iint_R(x+y)\\,dA=\\frac12\\iint_G u\\,dA=3$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac32$ 是把 $|J|$ 取成 $\\frac14$（即 $|J|$ 的平方）造成的，恰为正确值的一半。</span></div>"
  },
  {
   "id": "ch15-q1",
   "ch": "ch15",
   "type": "mcq",
   "difficulty": 1,
   "kp": "15.1 标量函数的线积分", "tags": ["output"],
   "scope": "outside",
   "stem": "$C$ 为从 $(0,0)$ 到 $(1,1)$ 的直线段，则 $\\int_C(x+y)\\,ds=$ ?",
   "options": [
    {
     "text": "$\\sqrt{2}$",
     "correct": true
    },
    {
     "text": "$1$",
     "correct": false
    },
    {
     "text": "$2$",
     "correct": false
    },
    {
     "text": "$2\\sqrt{2}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$\\mathbf r(t)=(t,t)$，$|\\mathbf v|=\\sqrt2$，$x+y=2t$，得 $\\int_0^1 2t\\sqrt2\\,dt=\\sqrt2$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$1$ 是 $\\int_0^1 2t\\,dt$，漏乘弧长因子 $|\\mathbf v|=\\sqrt{2}$；$ds\\ne dt$ 是最常见的错误。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$2$ 相当于把被积函数在端点取常值 $2$ 再乘区间长度 $1$，没有对参数 $t$ 做积分。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$2\\sqrt{2}$ 相当于把被积函数取成常值 $2$ 再乘长度 $1$ 与 $\\sqrt{2}$，重复计入。</span></div>"
  },
  {
   "id": "ch15-q2",
   "ch": "ch15",
   "type": "mcq",
   "difficulty": 2,
   "kp": "15.2 向量场与线积分", "tags": ["output"],
   "scope": "outside",
   "stem": "$\\mathbf F=y\\mathbf i-x\\mathbf j$，$C$ 为单位圆 $x^{2}+y^{2}=1$ 从上方看逆时针。环量 $\\oint_C\\mathbf F\\cdot d\\mathbf r=$ ?",
   "options": [
    {
     "text": "$2\\pi$",
     "correct": false
    },
    {
     "text": "$-2\\pi$",
     "correct": true
    },
    {
     "text": "$0$",
     "correct": false
    },
    {
     "text": "$-\\pi$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。场 $x\\mathbf i+y\\mathbf j$ 沿逆时针单位圆的环量才是 $2\\pi$；本题的场与它差一个符号。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。单位圆上 $\\mathbf F\\cdot d\\mathbf r=-\\sin^2t-\\cos^2t=-1$，故环量 $=\\int_0^{2\\pi}(-1)dt=-2\\pi$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$0$ 只对梯度场成立；此处 $\\nabla\\times\\mathbf F=-2\\mathbf k\\ne\\mathbf 0$，环量不为零。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$-\\pi$ 只积了半圈或漏乘 $2$；闭曲线一整圈的环量是 $2\\pi$ 的整数倍。</span></div>"
  },
  {
   "id": "ch15-q3",
   "ch": "ch15",
   "type": "mcq",
   "difficulty": 1,
   "kp": "15.3 路径无关、保守场与势函数", "tags": ["output"],
   "scope": "outside",
   "stem": "$f(x,y,z)=x^{2}y+z^{3}$，$\\mathbf F=\\nabla f$，$A(1,1,1)$，$B(2,3,1)$，则 $\\int_A^B\\mathbf F\\cdot d\\mathbf r=$ ?",
   "options": [
    {
     "text": "$2$",
     "correct": false
    },
    {
     "text": "$11$",
     "correct": true
    },
    {
     "text": "$13$",
     "correct": false
    },
    {
     "text": "$9$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$2=f(A)=1\\cdot 1+1$，把起点函数值当成了积分值；线积分基本定理要求作差 $f(B)-f(A)$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。由线积分基本定理 $\\int_A^B\\nabla f\\cdot d\\mathbf r=f(B)-f(A)=13-2=11$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$13=f(B)=2^{2}\\cdot 3+1$，只取了终点值，漏减起点值 $f(A)=2$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$9$ 来自把 $A$ 点的 $x^{2}y$ 误用 $x=2$ 算成 $4$；代入 $A(1,1,1)$ 应为 $1\\cdot 1+1=2$。</span></div>"
  },
  {
   "id": "ch15-q4",
   "ch": "ch15",
   "type": "mcq",
   "difficulty": 2,
   "kp": "15.3 路径无关、保守场与势函数", "tags": ["output"],
   "scope": "outside",
   "stem": "$\\mathbf F=3x^{2}y\\,\\mathbf i+(x^{3}+2y)\\mathbf j$ 在平面上保守，则它的一个势函数是？",
   "options": [
    {
     "text": "$3x^{2}y+x^{3}+2y$",
     "correct": false
    },
    {
     "text": "$x^{3}y-y^{2}$",
     "correct": false
    },
    {
     "text": "$x^{3}y+y^{2}$",
     "correct": true
    },
    {
     "text": "$x^{3}+y^{2}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。这是把 $M,N$ 直接相加当成了 $f$；它对 $x,y$ 的偏导并不等于 $\\mathbf F$ 的两个分量。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。它的 $\\partial f/\\partial y=x^{3}-2y\\ne x^{3}+2y=N$，相当于对 $g'(y)=2y$ 积分时写错了符号。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$\\partial f/\\partial x=3x^2y=M$，$\\partial f/\\partial y=x^3+2y=N$，故 $f=x^3y+y^2$ 是势函数。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。它的 $\\partial f/\\partial x=3x^{2}\\ne M=3x^{2}y$，对 $3x^{2}y$ 关于 $x$ 积分时把因子 $y$ 丢掉了。</span></div>"
  },
  {
   "id": "ch15-q5",
   "ch": "ch15",
   "type": "mcq",
   "difficulty": 1,
   "kp": "15.4 平面 Green 定理", "tags": ["output"],
   "scope": "outside",
   "stem": "$C$ 是单位圆 $x^{2}+y^{2}=1$ 的正向（逆时针），则 $\\oint_C(x\\,dy-y\\,dx)=$ ?",
   "options": [
    {
     "text": "$2\\pi$",
     "correct": true
    },
    {
     "text": "$\\pi$",
     "correct": false
    },
    {
     "text": "$0$",
     "correct": false
    },
    {
     "text": "$-2\\pi$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$M=-y,N=x$，Green 定理给 $\\oint_C(xdy-ydx)=\\iint_R 2\\,dA=2\\pi$，即面积公式的两倍。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\pi$ 是单位圆的面积 $A$；面积公式给出的是 $A=\\frac{1}{2}\\oint_C(x\\,dy-y\\,dx)$，故积分为 $2A$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$0$ 只在场为梯度场时成立；此处 $\\nabla\\times(x\\mathbf i-y\\mathbf j)=2\\mathbf k\\ne\\mathbf 0$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$-2\\pi$ 来自把 $C$ 的正向取成了顺时针；逆时针方向下该积分为正。</span></div>"
  },
  {
   "id": "ch15-q6",
   "ch": "ch15",
   "type": "mcq",
   "difficulty": 3,
   "kp": "15.4 平面 Green 定理", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "$C$ 是 $R$ 的正向边界，$\\mathbf n$ 为外法向，$\\mathbf F=M\\mathbf i+N\\mathbf j$。Green 通量形式给 $\\oint_C\\mathbf F\\cdot\\mathbf n\\,ds$ 等于？",
   "options": [
    {
     "text": "$\\iint_R\\left(\\frac{\\partial N}{\\partial x}-\\frac{\\partial M}{\\partial y}\\right)dA$",
     "correct": false
    },
    {
     "text": "$\\iint_R\\left(\\frac{\\partial M}{\\partial y}-\\frac{\\partial N}{\\partial x}\\right)dA$",
     "correct": false
    },
    {
     "text": "$\\iint_R\\left(\\frac{\\partial N}{\\partial y}-\\frac{\\partial M}{\\partial x}\\right)dA$",
     "correct": false
    },
    {
     "text": "$\\iint_R\\left(\\frac{\\partial M}{\\partial x}+\\frac{\\partial N}{\\partial y}\\right)dA$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$N_{x}-M_{y}$ 是环量密度，属环量-旋度形式，对应切向分量而非法向通量。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。它把环量密度整体取了反号，恒等于 $-\\nabla\\times\\mathbf F\\cdot\\mathbf k$，只在旋度为零时才给 0。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。它把散度 $M_{x}+N_{y}$ 的两项都改了符号；除非 $M_{x}=N_{y}=0$，否则与真实通量不符。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。通量-散度形式为 $\\oint_C M\\,dy-N\\,dx=\\iint_R(M_{x}+N_{y})dA$，即外法向通量等于散度的二重积分。</span></div>"
  },
  {
   "id": "ch15-q7",
   "ch": "ch15",
   "type": "mcq",
   "difficulty": 2,
   "kp": "15.5 曲面与面积", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "锥面 $z=\\sqrt{x^{2}+y^{2}}$ 被平面 $z=1$ 截下的部分，其面积为？",
   "options": [
    {
     "text": "$\\sqrt{2}\\pi$",
     "correct": true
    },
    {
     "text": "$\\pi$",
     "correct": false
    },
    {
     "text": "$2\\pi$",
     "correct": false
    },
    {
     "text": "$\\frac{\\sqrt{2}}{2}\\pi$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。锥面的面积元为 $\\sqrt2 r\\,dr\\,d\\theta$，故 $A=\\sqrt2\\pi$（角向 $2\\pi$、径向 $1/2$）。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\pi$ 是底面圆的面积，相当于把面积元当成 $r\\,dr\\,d\\theta$，漏掉了斜面因子 $\\sqrt{2}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$2\\pi$ 相当于把 $|\\mathbf r_r\\times\\mathbf r_\\theta|$ 记成 $2r$；叉积的模是 $\\sqrt2\\,r$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{\\sqrt2}{2}\\pi$ 是内层 $\\int_0^1\\sqrt2\\,r\\,dr$ 之后漏乘角向积分给出的 $2\\pi$。</span></div>"
  },
  {
   "id": "ch15-q8",
   "ch": "ch15",
   "type": "mcq",
   "difficulty": 2,
   "kp": "15.6 曲面积分", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "$\\mathbf F=z\\mathbf k$ 向上穿过抛物面 $z=x^{2}+y^{2}\\ (0\\le z\\le 1)$ 的通量为？",
   "options": [
    {
     "text": "$\\pi$",
     "correct": false
    },
    {
     "text": "$\\frac{\\pi}{4}$",
     "correct": false
    },
    {
     "text": "$\\frac{\\pi}{2}$",
     "correct": true
    },
    {
     "text": "$\\frac{2\\pi}{3}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\pi$ 相当于把被积函数里的 $z$ 取成最大值 $1$，得 $\\iint_R dA=\\pi$，忽略了 $z=x^{2}+y^{2}$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\frac{\\pi}{4}$ 是内层 $\\int_0^1 r^{3}dr=\\frac{1}{4}$ 之后误乘 $\\pi$；角向积分应贡献 $2\\pi$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$\\mathbf n\\,d\\sigma=(-2x,-2y,1)dx\\,dy$，被积函数是 $z=x^2+y^2$，极坐标积分得 $\\pi/2$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{2\\pi}{3}$ 是漏掉极坐标面积元中的因子 $r$，按 $\\int_0^{2\\pi}\\!\\int_0^1 r^{2}dr\\,d\\theta$ 算出的。</span></div>"
  },
  {
   "id": "ch15-q9",
   "ch": "ch15",
   "type": "mcq",
   "difficulty": 3,
   "kp": "15.7 Stokes 定理", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "$\\mathbf F=z\\mathbf i+x\\mathbf j+y\\mathbf k$，$C$：$x^2+y^2=1$ 与 $z=1$ 的交线，上方看逆时针。$\\oint_C\\mathbf F\\cdot d\\mathbf r=$ ?",
   "options": [
    {
     "text": "$2\\pi$",
     "correct": false
    },
    {
     "text": "$\\pi$",
     "correct": true
    },
    {
     "text": "$3\\pi$",
     "correct": false
    },
    {
     "text": "$0$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$2\\pi$ 来自把旋度错算成 $2\\mathbf k$（如把两个等于 $1$ 的偏导相加）；正确旋度是 $(1,1,1)$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。旋度 $\\nabla\\times\\mathbf F=(1,1,1)$，取圆盘 $z=1$、$\\mathbf n=\\mathbf k$，得 $\\iint 1\\,dA=\\pi$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$3\\pi$ 是把 $|\\nabla\\times\\mathbf F|=\\sqrt3$ 当成 $3$ 乘面积；法向是 $\\mathbf k$，应取旋度的 $k$ 分量 $1$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$0$ 只在 $\\mathbf F$ 为梯度场时成立；此处 $\\nabla\\times\\mathbf F=(1,1,1)\\ne\\mathbf 0$。</span></div>"
  },
  {
   "id": "ch15-q10",
   "ch": "ch15",
   "type": "mcq",
   "difficulty": 2,
   "kp": "15.8 散度定理与统一理论", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "$\\mathbf F=x\\mathbf i+y\\mathbf j+z^{2}\\mathbf k$ 穿出圆柱体 $x^{2}+y^{2}\\le 4,\\ 0\\le z\\le 1$ 的边界曲面（外法向）的通量为？",
   "options": [
    {
     "text": "$20\\pi$",
     "correct": false
    },
    {
     "text": "$8\\pi$",
     "correct": false
    },
    {
     "text": "$4\\pi$",
     "correct": false
    },
    {
     "text": "$12\\pi$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$20\\pi$ 来自把侧面上的 $\\mathbf F\\cdot\\mathbf n$ 写成 $x^2+y^2=4$（实际为 $2$），侧面多算成 $16\\pi$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$8\\pi$ 是漏掉 $\\partial P/\\partial z=2z$ 这一项，只用 $\\nabla\\cdot\\mathbf F=2$ 乘上体积 $4\\pi$ 的结果。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$4\\pi$ 只是顶面 $z=1$ 的通量（$\\mathbf F\\cdot\\mathbf k=z^{2}=1$ 乘面积 $4\\pi$），漏掉了侧面的 $8\\pi$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$\\nabla\\cdot\\mathbf F=2+2z$，散度定理给 $\\iiint_D(2+2z)dV=4\\pi\\int_0^1(2+2z)dz=12\\pi$。</span></div>"
  },
  {
   "id": "ch15-q11",
   "ch": "ch15",
   "type": "mcq",
   "difficulty": 1,
   "kp": "15.1 标量函数的线积分", "tags": ["output"],
   "scope": "outside",
   "stem": "$C$ 是单位圆的上半圆周 $x^{2}+y^{2}=1,\\ y\\ge 0$，则 $\\displaystyle\\int_C(x^{2}+y^{2})\\,ds=$ ?",
   "options": [
    {
     "text": "$\\pi$",
     "correct": true
    },
    {
     "text": "$2\\pi$",
     "correct": false
    },
    {
     "text": "$0$",
     "correct": false
    },
    {
     "text": "$\\frac{\\pi}{2}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。在 $C$ 上恒有 $x^{2}+y^{2}=1$，被积函数先化简为常数 $1$，故积分等于 $C$ 的弧长：$\\int_C ds=\\pi\\cdot1=\\pi$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$2\\pi$ 是整个单位圆的周长；本题 $C$ 只是上半圆周，弧长要减半，忽略了限制 $y\\ge0$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$0$ 来自把标量线积分当成保守场的闭路积分；$C$ 不是闭曲线，且被积函数在 $C$ 上恒为 $1>0$、$ds>0$，积分必为正。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{\\pi}{2}$ 是把被积函数误代成了 $x$，按 $\\int_0^{\\pi}\\cos t\\,dt$ 的思路算完又把它当成弧长；$x^{2}+y^{2}$ 中的平方不能丢。</span></div>"
  },
  {
   "id": "ch15-q12",
   "ch": "ch15",
   "type": "mcq",
   "difficulty": 2,
   "kp": "15.2 向量场与线积分", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "$\\mathbf F=xy\\,\\mathbf i+(x+y)\\mathbf j$，$C$ 为 $y=x^{2}$ 上从 $(0,0)$ 到 $(1,1)$ 的一段，$\\displaystyle\\int_C\\mathbf F\\cdot d\\mathbf r=$ ?",
   "options": [
    {
     "text": "$-\\frac{17}{12}$",
     "correct": false
    },
    {
     "text": "$\\frac{17}{12}$",
     "correct": true
    },
    {
     "text": "$\\frac{13}{12}$",
     "correct": false
    },
    {
     "text": "$1$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$-\\frac{17}{12}$ 是把路径走反（由 $(1,1)$ 到 $(0,0)$）的结果；线积分对方向敏感、反向变号，但题设方向是 $x$ 从 $0$ 增到 $1$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。取 $\\mathbf r(t)=t\\,\\mathbf i+t^{2}\\mathbf j\\ (0\\le t\\le1)$，则 $\\mathbf F=t^{3}\\mathbf i+(t+t^{2})\\mathbf j$、$d\\mathbf r=(\\mathbf i+2t\\,\\mathbf j)dt$，积分 $=\\int_0^1(3t^{3}+2t^{2})dt=\\frac34+\\frac23=\\frac{17}{12}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac{13}{12}$ 是把 $d\\mathbf r=(\\mathbf i+2t\\,\\mathbf j)dt$ 中的因子 $2$ 漏掉，按 $\\int_0^1(t^{3}+t+t^{2})dt$ 算出；正确应为 $\\int_0^1(3t^{3}+2t^{2})dt$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$1$ 来自把 $\\mathbf F$ 误当保守场再用势函数 $\\frac{1}{2}x^{2}y+\\frac{1}{2}y^{2}$ 作差；实际 $\\partial N/\\partial x=1\\ne x=\\partial M/\\partial y$，$\\mathbf F$ 不保守，线积分不能只查端点。</span></div>"
  },
  {
   "id": "ch15-q13",
   "ch": "ch15",
   "type": "mcq",
   "difficulty": 3,
   "kp": "15.3 路径无关、保守场与势函数", "tags": ["concept","trap"],
   "scope": "outside",
   "stem": "设 $\\mathbf F=\\frac{-y\\,\\mathbf i+x\\,\\mathbf j}{x^{2}+y^{2}}$，在 $D=\\mathbb R^{2}\\setminus\\{(0,0)\\}$ 上 $\\mathbf F$ 是否保守？",
   "options": [
    {
     "text": "$\\mathbf F$ 保守，因为 $D$ 是开连通区域，且组件测试的三对偏导等式全部成立。",
     "correct": false
    },
    {
     "text": "$\\mathbf F$ 保守，因为在 $C$ 上 $\\oint_C\\mathbf F\\cdot d\\mathbf r=f(B)-f(A)=0$。",
     "correct": false
    },
    {
     "text": "$\\mathbf F$ 不保守，且上述单位圆上的环量等于 $-2\\pi$。",
     "correct": false
    },
    {
     "text": "$\\mathbf F$ 不保守，因为沿 $D$ 内绕原点一周的单位圆（从上方看逆时针）有 $\\oint_C\\mathbf F\\cdot d\\mathbf r=2\\pi\\ne0$。",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。组件测试的前提是定义域开<strong>且单连通</strong>，而 $D$ 被挖去原点、不单连通，充分性失效，不能由偏导相等推出保守。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\oint_C\\mathbf F\\cdot d\\mathbf r=f(B)-f(A)$ 是线积分基本定理，只在 $\\mathbf F=\\nabla f$（保守场）时成立；用它去论证保守性是循环论证，且本题环量实为 $2\\pi$ 而非 $0$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\mathbf F$ 确实不保守，但数值错了：逆时针参数化下被积式恰为 $dt$，环量是 $+2\\pi$；$-2\\pi$ 对应顺时针方向，与题设定向相反。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。保守场必须使任一闭曲线的环路积分为 $0$；取 $\\mathbf r=\\cos t\\,\\mathbf i+\\sin t\\,\\mathbf j$，得 $\\mathbf F\\cdot d\\mathbf r=\\frac{\\sin^{2}t+\\cos^{2}t}{1}dt=dt$，故 $\\oint_C\\mathbf F\\cdot d\\mathbf r=\\int_0^{2\\pi}dt=2\\pi\\ne0$，与保守场的环路性质矛盾。</span></div>"
  },
  {
   "id": "ch15-q14",
   "ch": "ch15",
   "type": "mcq",
   "difficulty": 2,
   "kp": "15.4 平面 Green 定理", "tags": ["output"],
   "scope": "outside",
   "stem": "$C$ 是圆周 $x^{2}+y^{2}=4$，从上方看取逆时针方向，则 $\\displaystyle\\oint_C\\frac{-y\\,dx+x\\,dy}{x^{2}+y^{2}}=$ ?",
   "options": [
    {
     "text": "$0$",
     "correct": false
    },
    {
     "text": "$-2\\pi$",
     "correct": false
    },
    {
     "text": "$8\\pi$",
     "correct": false
    },
    {
     "text": "$2\\pi$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$0$ 来自直接对 $C$ 所围圆盘套 Green 定理；该圆盘含原点，被积函数在原点无定义，定理的前提不成立，必须先挖去原点附近的小圆。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$-2\\pi$ 是把 $C$ 的定向取成了顺时针；题设为逆时针，此时环量为正。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$8\\pi$ 来自把分母按 $x^{2}+y^{2}=4$ 提到积分号外后，又把分子 $4\\,dt$ 当成 $8\\,dt$（相当于多乘了 $2$）；约分后只剩 $\\int_0^{2\\pi}dt$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。挖去以原点为心的小圆后，环域内 $N_{x}-M_{y}=0$，故积分与半径无关；取 $x=2\\cos t,\\ y=2\\sin t$，被积式 $=\\frac{4(\\sin^{2}t+\\cos^{2}t)}{4}dt=dt$，积分 $=\\int_0^{2\\pi}dt=2\\pi$，与沿单位圆的环量相同。</span></div>"
  },
  {
   "id": "ch15-q15",
   "ch": "ch15",
   "type": "mcq",
   "difficulty": 1,
   "kp": "15.4 平面 Green 定理", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "$C$ 是椭圆 $x=2\\cos t,\\ y=3\\sin t,\\ 0\\le t\\le 2\\pi$，方向与 $t$ 增大的方向一致，则 $\\displaystyle\\oint_C x\\,dy=$ ?",
   "options": [
    {
     "text": "$3\\pi$",
     "correct": false
    },
    {
     "text": "$12\\pi$",
     "correct": false
    },
    {
     "text": "$6\\pi$",
     "correct": true
    },
    {
     "text": "$0$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$3\\pi$ 是把 $x$ 当成了 $\\cos t$ 而丢掉半轴因子 $2$，只算了 $\\int_0^{2\\pi}3\\cos^{2}t\\,dt$；曲线上 $x=2\\cos t$，这个 $2$ 不能省。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$12\\pi$ 是把 $\\int_0^{2\\pi}\\cos^{2}t\\,dt=\\pi$ 误记成 $2\\pi$（或误用倍角公式把 $6\\cos^{2}t$ 写成 $6(1+\\cos2t)$）；半轴积为 $ab=6$，面积就是 $6\\pi$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$dy=3\\cos t\\,dt$，故 $\\oint_C x\\,dy=\\int_0^{2\\pi}6\\cos^{2}t\\,dt=6\\pi$；与 Green 面积公式 $A=\\oint_C x\\,dy=\\pi ab=\\pi\\cdot2\\cdot3=6\\pi$ 完全一致。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$0$ 来自只积了 $x$ 却漏掉 $dy$ 中的 $\\cos t$，或把 $x\\,dy$ 与对弧长的 $x\\,ds$ 混为一谈；椭圆面积非零，绕行一周的 $\\oint x\\,dy$ 不可能为 $0$。</span></div>"
  },
  {
   "id": "ch15-q16",
   "ch": "ch15",
   "type": "mcq",
   "difficulty": 2,
   "kp": "15.5 曲面与面积", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "半径 $a$ 的上半球面（$z\\ge0$）由球面参数化 $\\mathbf r(\\phi,\\theta)=a\\sin\\phi\\cos\\theta\\,\\mathbf i+a\\sin\\phi\\sin\\theta\\,\\mathbf j+a\\cos\\phi\\,\\mathbf k$ 给出，其面积为？",
   "options": [
    {
     "text": "$\\pi a^{2}$",
     "correct": false
    },
    {
     "text": "$2\\pi a^{2}$",
     "correct": true
    },
    {
     "text": "$4\\pi a^{2}$",
     "correct": false
    },
    {
     "text": "$\\frac{\\pi a^{2}}{2}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\pi a^{2}$ 是半球面在 $xy$ 平面上投影圆盘的面积，把弯曲的球面按平面圆盘来算了；曲面面积必须用 $d\\sigma=a^{2}\\sin\\phi\\,d\\phi\\,d\\theta$，在球面上 $d\\sigma\\ne dx\\,dy$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$|\\mathbf r_\\phi\\times\\mathbf r_\\theta|=a^{2}\\sin\\phi$（在 $0\\le\\phi\\le\\frac{\\pi}{2}$ 上 $\\sin\\phi\\ge0$，可直接去绝对值），故 $A=\\int_0^{2\\pi}\\!\\int_0^{\\pi/2}a^{2}\\sin\\phi\\,d\\phi\\,d\\theta=a^{2}\\cdot1\\cdot2\\pi=2\\pi a^{2}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$4\\pi a^{2}$ 是整球面的面积，对应 $\\phi$ 从 $0$ 积到 $\\pi$；上半球面只有 $\\phi\\in[0,\\frac{\\pi}{2}]$，恰为一半。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{\\pi a^{2}}{2}$ 是只取一个卦限的结果（$\\theta$ 只积 $\\frac{\\pi}{2}$、$\\phi$ 只积 $\\frac{\\pi}{2}$），漏掉了绕 $z$ 轴一整圈 $\\theta\\in[0,2\\pi]$ 的贡献。</span></div>"
  },
  {
   "id": "ch15-q17",
   "ch": "ch15",
   "type": "mcq",
   "difficulty": 2,
   "kp": "15.6 曲面积分", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "圆柱面 $S:\\ x^{2}+y^{2}=4,\\ 0\\le z\\le 2$ 上有面密度 $\\delta(x,y,z)=z$ 的薄壳，则其质量 $M=\\displaystyle\\iint_S z\\,d\\sigma=$ ?",
   "options": [
    {
     "text": "$\\pi$",
     "correct": false
    },
    {
     "text": "$8\\pi$",
     "correct": true
    },
    {
     "text": "$16\\pi$",
     "correct": false
    },
    {
     "text": "$4\\pi$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\pi$ 是把三重积分的体积元 $r\\,dr\\,d\\theta\\,dz$ 搬到了曲面上；柱面上 $r\\equiv2$ 为常数，不该再出现 $dr$，面积元是 $2\\,d\\theta\\,dz$——这样做等于把二维的曲面积分退化成了对 $z$ 的一维积分。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。取 $\\mathbf r(\\theta,z)=2\\cos\\theta\\,\\mathbf i+2\\sin\\theta\\,\\mathbf j+z\\,\\mathbf k$，则 $|\\mathbf r_\\theta\\times\\mathbf r_z|=2$，$d\\sigma=2\\,d\\theta\\,dz$，故 $M=\\int_0^{2\\pi}\\!\\int_0^{2}z\\cdot2\\,dz\\,d\\theta=2\\cdot2\\pi\\cdot2=8\\pi$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$16\\pi$ 多乘了一个因子 $2$，相当于把面积元记成 $4\\,d\\theta\\,dz$；半径是 $2$ 时 $|\\mathbf r_\\theta\\times\\mathbf r_z|=r=2$，而面积元中的这个 $r$ 只出现一次。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$4\\pi$ 是漏掉被积函数 $\\delta=z$ 后只算了侧面积 $8\\pi$ 的一半（$\\frac12\\cdot2\\pi\\cdot2\\cdot2=4\\pi$ 是把高也除半了）；柱面 $0\\le z\\le2$ 的高是 $2$，侧面积应为 $8\\pi$。</span></div>"
  },
  {
   "id": "ch15-q18",
   "ch": "ch15",
   "type": "mcq",
   "difficulty": 1,
   "kp": "15.7 Stokes 定理", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "设 $\\mathbf F=xy\\,\\mathbf i+yz\\,\\mathbf j+zx\\,\\mathbf k$，则 $\\nabla\\times\\mathbf F$ 在点 $(1,2,3)$ 处的值是？",
   "options": [
    {
     "text": "$-2\\mathbf i+3\\mathbf j-\\mathbf k$",
     "correct": false
    },
    {
     "text": "$2\\mathbf i+3\\mathbf j+\\mathbf k$",
     "correct": false
    },
    {
     "text": "$-2\\mathbf i-3\\mathbf j-\\mathbf k$",
     "correct": true
    },
    {
     "text": "$-2\\mathbf i-3\\mathbf j+\\mathbf k$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$-2\\mathbf i+3\\mathbf j-\\mathbf k$ 只把 $\\mathbf i$ 分量算对，$\\mathbf j$ 分量的符号取反了：应为 $M_z-P_x=0-z=-z=-3$，不是 $+3$——相当于把 $\\partial/\\partial x$ 作用在 $zx$ 上得的 $z$ 当成了正号。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$2\\mathbf i+3\\mathbf j+\\mathbf k$ 是把三个分量的负号全部丢掉（只记成 $y,z,x$ 的取值），忽略了旋度公式中每项都是“后对前”的差，如 $P_y-N_z=0-y=-y$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$P_y-N_z=0-y=-y$，$M_z-P_x=0-z=-z$，$N_x-M_y=0-x=-x$，故 $\\nabla\\times\\mathbf F=-y\\,\\mathbf i-z\\,\\mathbf j-x\\,\\mathbf k$；代入 $(1,2,3)$ 得 $-2\\mathbf i-3\\mathbf j-\\mathbf k$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$-2\\mathbf i-3\\mathbf j+\\mathbf k$ 的第三个分量符号错了：$N_x-M_y=0-x=-x=-1$，应为 $-\\mathbf k$ 而非 $+\\mathbf k$；把 $zx$ 误当成只含 $z$ 的项就会漏掉这个负号。</span></div>"
  },
  {
   "id": "ch15-q19",
   "ch": "ch15",
   "type": "mcq",
   "difficulty": 3,
   "kp": "15.7 Stokes 定理", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "设 $\\mathbf F=xy\\,\\mathbf k$，$S$ 为上半球面 $x^{2}+y^{2}+z^{2}=1,\\ z\\ge0$，$\\mathbf n$ 为其向外的单位法向量。$\\displaystyle\\iint_S(\\nabla\\times\\mathbf F)\\cdot\\mathbf n\\,d\\sigma=$ ?",
   "options": [
    {
     "text": "$\\pi$",
     "correct": false
    },
    {
     "text": "$2\\pi$",
     "correct": false
    },
    {
     "text": "$4\\pi$",
     "correct": false
    },
    {
     "text": "$0$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\pi$ 是 $S$ 在 $xy$ 平面上投影圆的面积；若把被积函数误当成 $1$（或漏掉 $\\mathbf n$ 只积 $|\\nabla\\times\\mathbf F|$），再由 $d\\sigma=\\frac{dx\\,dy}{z}$ 换算就会得到它。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$2\\pi$ 是 $S$ 的表面积（$2\\pi a^{2}$，$a=1$）；只有当被积函数恒为 $1$ 时积分才等于表面积，而本题被积函数 $x^{2}-y^{2}$ 并非常数，必须与法向量点乘后逐点积分。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$4\\pi$ 是整球面的表面积，且把 $S$ 当成了闭曲面——散度定理要求曲面闭合，本题的 $S$ 有赤道圆作边界，不能直接使用。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$\\nabla\\times\\mathbf F=\\bigl(P_y-N_z,\\ M_z-P_x,\\ N_x-M_y\\bigr)=(x,\\,-y,\\,0)$，在 $|\\mathbf r|=1$ 的球面上 $\\mathbf n=\\mathbf r$，故 $(\\nabla\\times\\mathbf F)\\cdot\\mathbf n=x^{2}-y^{2}$。区域 $S$（上半球面）关于 $y=x$ 对称，于是 $\\iint_S x^{2}d\\sigma=\\iint_S y^{2}d\\sigma$，两者相减得 $0$，即环量为 $0$。</span></div>"
  },
  {
   "id": "ch15-q20",
   "ch": "ch15",
   "type": "mcq",
   "difficulty": 2,
   "kp": "15.8 散度定理与统一理论", "tags": ["output"],
   "scope": "outside",
   "stem": "$\\mathbf F=x\\,\\mathbf i+y\\,\\mathbf j+z\\,\\mathbf k$，$S$ 为上半球面 $x^{2}+y^{2}+z^{2}=4,\\ z\\ge0$，$\\mathbf n$ 为外法向。$\\displaystyle\\iint_S\\mathbf F\\cdot\\mathbf n\\,d\\sigma=$ ?",
   "options": [
    {
     "text": "$8\\pi$",
     "correct": false
    },
    {
     "text": "$16\\pi$",
     "correct": true
    },
    {
     "text": "$12\\pi$",
     "correct": false
    },
    {
     "text": "$11\\pi$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$8\\pi$ 是 $S$ 的表面积（$2\\pi\\cdot2^{2}$），相当于把被积函数 $\\mathbf F\\cdot\\mathbf n$ 记成了 $1$；实际上 $\\mathbf F\\cdot\\mathbf n=|\\mathbf F|$ 随点变化，在赤道附近最大。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$\\mathbf F=x\\mathbf i+y\\mathbf j+z\\mathbf k$ 沿径向，故 $\\mathbf F\\cdot\\mathbf n=|\\mathbf F|$，在球面上 $|\\mathbf F|=2$，被积函数恒等于 $2$，于是积分 $=2\\times$（表面积）$=2\\cdot2\\pi\\cdot2^{2}=16\\pi$。（曲面不闭合，不能直接对 $S$ 用散度定理；补上底面圆盘 $z=0$ 后 $\\iiint_D3\\,dV=3\\cdot\\frac{16\\pi}{3}=16\\pi$，而底面上外法向为 $-\\mathbf k$、$\\mathbf F\\cdot(-\\mathbf k)=-z=0$，故通量全部来自 $S$，结果一致。）</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$12\\pi$ 来自直接对 $S$ 用散度定理却把体积算错：半球体体积是 $\\frac{2}{3}\\pi\\cdot2^{3}=\\frac{16\\pi}{3}$，乘 $\\nabla\\cdot\\mathbf F=3$ 得 $16\\pi$，不是 $12\\pi$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$11\\pi$ 是把被积函数当成变化的量去逐点积分的错算结果；本题 $\\mathbf F\\cdot\\mathbf n=|\\mathbf F|=2$ 是常数，无需做任何复杂积分。</span></div>"
  },
  {
   "id": "ch16-q1",
   "ch": "ch16",
   "type": "mcq",
   "difficulty": 1,
   "kp": "16.1 斜率场与欧拉法", "tags": ["exam","output","trap"],
   "scope": "final",
   "stem": "微分方程 $y'=x+y$ 的斜率场中，点 $(1,2)$ 处的线段斜率为多少？",
   "options": [
    {
     "text": "$3$",
     "correct": true
    },
    {
     "text": "$2$",
     "correct": false
    },
    {
     "text": "$1$",
     "correct": false
    },
    {
     "text": "$-3$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。斜率值就是 $f(1,2)=1+2=3$，故该点线段斜率为 $3$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$2$ 只取了 $y=2$，漏掉 $f=x+y$ 中的 $x=1$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$1$ 只取了 $x=1$，漏掉式中的 $y=2$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$-3$ 是把 $x+y$ 误当成 $x-y$（漏看加号）的结果。</span></div>"
  },
  {
   "id": "ch16-q2",
   "ch": "ch16",
   "type": "mcq",
   "difficulty": 2,
   "kp": "16.1 斜率场与欧拉法", "tags": ["exam","output","trap"],
   "scope": "final",
   "stem": "对初值问题 $y'=1+y$、$y(0)=1$，取步长 $\\Delta x=0.5$，用欧拉法求得的 $y_1$ 为？",
   "options": [
    {
     "text": "$2.0000$",
     "correct": true
    },
    {
     "text": "$1.5000$",
     "correct": false
    },
    {
     "text": "$2.5000$",
     "correct": false
    },
    {
     "text": "$3.5000$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$y_1=y_0+f(0,1)\\Delta x=1+2\\times0.5=2.0000$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$1.5000$ 只用了斜率 $1$，漏掉 $f=1+y$ 中的 $y_0=1$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$2.5000$ 用了斜率 $3$，那是第二步在 $(0.5,2)$ 处的斜率，被提前使用了。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$3.5000$ 是走完两步的 $y_2$，把两步的结果当成了第一步。</span></div>"
  },
  {
   "id": "ch16-q3",
   "ch": "ch16",
   "type": "mcq",
   "difficulty": 2,
   "kp": "16.2 一阶线性方程", "tags": ["exam","output"],
   "scope": "final",
   "stem": "把方程 $xy'-3y=x^{3}\\ln x$（$x>0$）化为标准形后，$P(x)$ 等于？",
   "options": [
    {
     "text": "$\\frac{3}{x}$",
     "correct": false
    },
    {
     "text": "$-\\frac{3}{x}$",
     "correct": true
    },
    {
     "text": "$-3$",
     "correct": false
    },
    {
     "text": "$\\frac{3}{x^{2}}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。丢掉了移项后的负号，标准形 $y'-\\frac{3}{x}y=x^{2}\\ln x$ 中 $P=-\\frac{3}{x}$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。两边除以 $x$ 得 $y'-\\frac{3}{x}y=x^{2}\\ln x$，故 $P(x)=-\\frac{3}{x}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$-3$ 是没有除以 $x$、根本没化成标准形的结果。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\frac{3}{x^{2}}$ 相当于两边除以 $x^{2}$，而标准形只除以 $x$。</span></div>"
  },
  {
   "id": "ch16-q4",
   "ch": "ch16",
   "type": "mcq",
   "difficulty": 1,
   "kp": "16.2 一阶线性方程", "tags": ["exam","output"],
   "scope": "final",
   "stem": "初值问题 $y'+2y=0$、$y(0)=3$ 的解为？",
   "options": [
    {
     "text": "$y=3e^{2x}$",
     "correct": false
    },
    {
     "text": "$y=3e^{-2x}$",
     "correct": true
    },
    {
     "text": "$y=3-2x$",
     "correct": false
    },
    {
     "text": "$y=Ce^{-2x}$（$C$ 为任意常数）",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。指数上丢了负号，把衰减解写成了增长解。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。积分因子 $e^{2x}$ 得 $(e^{2x}y)'=0$，故 $y=Ce^{-2x}$，由 $y(0)=3$ 定出 $C=3$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。这等于把 $y'=-2y$ 当成常斜率 $y'=-2$ 积分，忽略了增长率与 $y$ 成正比。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。这是通解；初值 $y(0)=3$ 已把 $C$ 定为 $3$，题目要的是特解。</span></div>"
  },
  {
   "id": "ch16-q5",
   "ch": "ch16",
   "type": "mcq",
   "difficulty": 1,
   "kp": "16.3 应用问题", "tags": ["exam","output"],
   "scope": "final",
   "stem": "水箱初始盛 $500$ L 盐水，以 $10$ L/min 注入、以 $5$ L/min 排出并保持搅拌均匀，则 $t$ 时刻液体总体积 $V(t)=$？",
   "options": [
    {
     "text": "$500+10t$",
     "correct": false
    },
    {
     "text": "$500-5t$",
     "correct": false
    },
    {
     "text": "$500+5t$",
     "correct": true
    },
    {
     "text": "$500$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。只加了流入量，忘了同时还有 $5$ L/min 在流出。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。把体积变化写成只有流出，符号与题意相反。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$V(t)=V_0+(r_{\\text{in}}-r_{\\text{out}})t=500+(10-5)t=500+5t$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$V$ 只在流入速率等于流出速率时才是常数，本题两者不等。</span></div>"
  },
  {
   "id": "ch16-q6",
   "ch": "ch16",
   "type": "mcq",
   "difficulty": 2,
   "kp": "16.3 应用问题", "tags": ["exam","output"],
   "scope": "final",
   "stem": "RL 电路中 $L\\frac{di}{dt}+Ri=V$、$i(0)=0$，则电流的稳态值与电路时间常数分别是？",
   "options": [
    {
     "text": "稳态 $\\frac{V}{L}$，时间常数 $\\frac{L}{R}$",
     "correct": false
    },
    {
     "text": "稳态 $\\frac{V}{R}$，时间常数 $\\frac{R}{L}$",
     "correct": false
    },
    {
     "text": "稳态 $\\frac{V}{R}$，时间常数 $\\frac{1}{RL}$",
     "correct": false
    },
    {
     "text": "稳态 $\\frac{V}{R}$，时间常数 $\\frac{L}{R}$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。稳态值应是 $\\frac{V}{R}$，$\\frac{V}{L}$ 的单位也不是电流。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。时间常数记反了，正确值为 $\\tau=\\frac{L}{R}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac{1}{RL}$ 没有依据，把 $R$ 放到分母上是凭空的组合。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$i=\\frac{V}{R}\\left(1-e^{-(R/L)t}\\right)$，稳态 $\\frac{V}{R}$，$\\tau=\\frac{L}{R}$。</span></div>"
  },
  {
   "id": "ch16-q7",
   "ch": "ch16",
   "type": "mcq",
   "difficulty": 1,
   "kp": "16.4 自治方程与相线", "tags": ["exam","output"],
   "scope": "final",
   "stem": "自治方程 $y'=g(y)$ 中 $g(y_0)=0$，若 $g'(y_0)<0$，则平衡值 $y_0$ 是？",
   "options": [
    {
     "text": "稳定（吸引）平衡值",
     "correct": true
    },
    {
     "text": "不稳定（排斥）平衡值",
     "correct": false
    },
    {
     "text": "不能判定，必须比较 $y_0$ 两侧 $g$ 的符号",
     "correct": false
    },
    {
     "text": "一定是解曲线的拐点",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。判据 $g'(y_0)<0$ 就是稳定，附近各解都向 $y_0$ 靠拢。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$g'(y_0)>0$ 才是不稳定，符号记反了。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。两侧符号法只在 $g'(y_0)=0$ 时才非用不可。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$y''=g'(y)g(y)$ 在 $y_0$ 处为零，但那是水平解所在直线，不是拐点。</span></div>"
  },
  {
   "id": "ch16-q8",
   "ch": "ch16",
   "type": "mcq",
   "difficulty": 2,
   "kp": "16.4 自治方程与相线", "tags": ["exam","output"],
   "scope": "final",
   "stem": "logistic 方程 $\\frac{dP}{dt}=rP(M-P)$ 中，种群增长最快的时刻对应的种群数量是？",
   "options": [
    {
     "text": "$P=M$",
     "correct": false
    },
    {
     "text": "$P=\\frac{M}{2}$",
     "correct": true
    },
    {
     "text": "$P=\\sqrt{M}$",
     "correct": false
    },
    {
     "text": "$P=M-P_0$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$P=M$ 是环境容纳量（上限），此时 $dP/dt=0$，增长最慢。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$P''=r(M-2P)P'$ 在 $P=\\frac{M}{2}$ 处变号，此处 $dP/dt$ 最大，解曲线出现拐点。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\sqrt{M}$ 与拐点无关，是把量纲关系记混后的臆造值。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$M-P_0$ 是初始时尚未利用的空间，不是增长最快处的种群量。</span></div>"
  },
  {
   "id": "ch16-q9",
   "ch": "ch16",
   "type": "mcq",
   "difficulty": 2,
   "kp": "16.5 相平面", "tags": ["exam","output","trap"],
   "scope": "final",
   "stem": "竞争-捕猎模型 $\\frac{dx}{dt}=(2-y)x$、$\\frac{dy}{dt}=(3-x)y$ 的平衡点是？",
   "options": [
    {
     "text": "$(0,0)$ 与 $(2,3)$",
     "correct": false
    },
    {
     "text": "只有 $(0,0)$",
     "correct": false
    },
    {
     "text": "$(0,0)$ 与 $(3,2)$",
     "correct": true
    },
    {
     "text": "只有 $(3,2)$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。把 $a=2$、$m=3$ 直接当成坐标，真正的交点是 $\\left(\\frac{m}{n},\\frac{a}{b}\\right)=(3,2)$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。漏掉非平凡平衡点：零倾线 $y=2$ 与 $x=3$ 的交点也使两式为零。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。令 $(2-y)x=0$ 与 $(3-x)y=0$，得 $(0,0)$ 与 $\\left(\\frac{m}{n},\\frac{a}{b}\\right)=(3,2)$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$(0,0)$ 也是平衡点，它是两物种都灭绝的静止点，不能漏。</span></div>"
  },
  {
   "id": "ch16-q10",
   "ch": "ch16",
   "type": "mcq",
   "difficulty": 3,
   "kp": "16.5 相平面", "tags": ["exam","output","trap"],
   "scope": "final",
   "stem": "对竞争-捕猎模型 $\\frac{dx}{dt}=(a-by)x$、$\\frac{dy}{dt}=(m-nx)y$，关于非平凡平衡点 $\\left(\\frac{m}{n},\\frac{a}{b}\\right)$ 的结论是？",
   "options": [
    {
     "text": "它是稳定平衡点，$t\\to\\infty$ 时两物种数量都趋于该点，可以长期共存",
     "correct": false
    },
    {
     "text": "它是中心型平衡点，轨迹绕它形成闭曲线，两物种数量周期振荡",
     "correct": false
    },
    {
     "text": "它虽使两式同时为零，但零倾线只有坐标轴，轨迹方向无法分区判断",
     "correct": false
    },
    {
     "text": "它是鞍点式平衡点，除极特殊初值外轨迹都远离它，两物种几乎不可能共存",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。这是最诱人的误判：邻域内既有流入区也有流出区，它不是稳定结点。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。绕平衡点转圈是捕食者-被捕食者模型的结论，与本模型相反。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。零倾线还包括直线 $y=\\frac{a}{b}$ 与 $x=\\frac{m}{n}$，正是它们把平面分块。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。零倾线分成四区，只有两条特殊轨迹趋近它，其余都远离，故不稳定、几乎无法共存。</span></div>"
  },
  {
   "id": "ch17-q1",
   "ch": "ch17",
   "type": "mcq",
   "difficulty": 1,
   "kp": "17.1 二阶线性方程", "tags": ["output"],
   "scope": "outside",
   "stem": "常系数齐次方程 $y''-5y'+6y=0$ 的通解是？",
   "options": [
    {
     "text": "$y=c_1e^{2x}+c_2e^{3x}$",
     "correct": true
    },
    {
     "text": "$y=c_1e^{-2x}+c_2e^{-3x}$",
     "correct": false
    },
    {
     "text": "$y=c_1e^{5x}+c_2e^{6x}$",
     "correct": false
    },
    {
     "text": "$y=(c_1+c_2x)e^{2x}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。特征方程 $r^{2}-5r+6=(r-2)(r-3)=0$ 得两个不等实根 $2,3$，由定理 3 得该通解。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。根的正负号搞反：$r^{2}-5r+6=0$ 的两根和为 $5$、积为 $6$，都是正数 $2,3$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。把系数 $5,6$ 直接当成了特征根；特征方程是 $r^{2}-5r+6=0$，根为 $2,3$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$(c_1+c_2x)e^{2x}$ 是二重根 $r=2$ 的形式；本题判别式 $25-24=1>0$，不是重根。</span></div>"
  },
  {
   "id": "ch17-q2",
   "ch": "ch17",
   "type": "mcq",
   "difficulty": 2,
   "kp": "17.1 二阶线性方程", "tags": ["output"],
   "scope": "outside",
   "stem": "解初值问题 $y''-2y'+y=0$，$y(0)=1$，$y'(0)=-1$，得？",
   "options": [
    {
     "text": "$y=(1+2x)e^{x}$",
     "correct": false
    },
    {
     "text": "$y=(1-2x)e^{x}$",
     "correct": true
    },
    {
     "text": "$y=(1-x)e^{x}$",
     "correct": false
    },
    {
     "text": "$y=(1-2x)e^{-x}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$y=(1+2x)e^{x}$ 有 $y'=(3+2x)e^{x}$，在 $x=0$ 处为 $3$，与 $y'(0)=-1$ 不符；应取 $c_2=-2$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$r^{2}-2r+1=(r-1)^{2}$ 为二重根 $r=1$，通解 $y=(c_1+c_2x)e^{x}$；由 $y(0)=c_1=1$、$y'(0)=c_1+c_2=-1$ 得 $c_2=-2$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$y=(1-x)e^{x}$ 有 $y'=-xe^{x}$，故 $y'(0)=0$，只满足了 $y(0)=1$，漏用了第二个初值。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$r=-1$ 是方程 $y''+2y'+y=0$ 的特征根；本题特征方程的根是二重的 $r=1$。</span></div>"
  },
  {
   "id": "ch17-q3",
   "ch": "ch17",
   "type": "mcq",
   "difficulty": 2,
   "kp": "17.1 二阶线性方程", "tags": ["output"],
   "scope": "outside",
   "stem": "方程 $y''-4y'+5y=0$ 的通解是？",
   "options": [
    {
     "text": "$y=c_1e^{2x}+c_2e^{x}$",
     "correct": false
    },
    {
     "text": "$y=e^{x}(c_1\\cos 2x+c_2\\sin 2x)$",
     "correct": false
    },
    {
     "text": "$y=e^{2x}(c_1\\cos x+c_2\\sin x)$",
     "correct": true
    },
    {
     "text": "$y=e^{2x}(c_1\\cos 2x+c_2\\sin 2x)$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。判别式 $b^{2}-4ac=16-20=-4<0$，特征根是共轭复根 $2\\pm i$，不是两个实根。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。实部与虚部对调了：$r=2\\pm i$ 给出 $\\alpha=2,\\ \\beta=1$，指数应为 $e^{2x}$、三角内应为 $x$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$r^{2}-4r+5=0$ 得 $r=\\dfrac{4\\pm\\sqrt{-4}}{2}=2\\pm i$，即 $\\alpha=2,\\ \\beta=1$，由定理 5 得该通解。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\beta=\\dfrac{\\sqrt{4ac-b^{2}}}{2a}=\\dfrac{\\sqrt{20-16}}{2}=1$，写成 $2$ 是忘了除以 $2a$。</span></div>"
  },
  {
   "id": "ch17-q4",
   "ch": "ch17",
   "type": "mcq",
   "difficulty": 2,
   "kp": "17.2 非齐次线性方程", "tags": ["output"],
   "scope": "outside",
   "stem": "用待定系数法求 $y''-y'-2y=6e^{-x}$ 的特解，合适的试探形式是？",
   "options": [
    {
     "text": "$y_p=Ae^{-x}$",
     "correct": false
    },
    {
     "text": "$y_p=Ae^{x}$",
     "correct": false
    },
    {
     "text": "$y_p=Ax^{2}e^{-x}$",
     "correct": false
    },
    {
     "text": "$y_p=Axe^{-x}$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$r=-1$ 是单特征根，$Ae^{-x}$ 已包含在 $y_c$ 中，代入左端得 $0$，无法匹配 $6e^{-x}$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。非齐次项是指数 $e^{-x}$，试探解的指数必须相同；$e^{x}$ 代进去不产生 $e^{-x}$ 类项。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。乘 $x^{2}$ 只用于 $r=-1$ 为二重根的情形；本题根为 $2,-1$，多乘一个 $x$ 会无解。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。先解 $r^{2}-r-2=(r-2)(r+1)=0$ 知 $r=-1$ 是单根，撞车须乘 $x$；代 $y_p=Axe^{-x}$ 得 $-3Ae^{-x}=6e^{-x}$。</span></div>"
  },
  {
   "id": "ch17-q5",
   "ch": "ch17",
   "type": "mcq",
   "difficulty": 1,
   "kp": "17.2 非齐次线性方程", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "设 $y_c$ 是 $y''+y'-2y=G(x)$ 对应齐次方程的通解，$y_p$ 是该方程的一个特解，则其通解是？",
   "options": [
    {
     "text": "$y=y_c+y_p$",
     "correct": true
    },
    {
     "text": "$y=y_c$",
     "correct": false
    },
    {
     "text": "$y=y_p$",
     "correct": false
    },
    {
     "text": "$y=y_c-y_p$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。定理 7：非齐次方程通解等于齐次通解加任一特解；任意两解之差满足齐次方程，差别只在 $y_c$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$y_c$ 只满足齐次方程，代回非齐次方程左端得 $0$ 而不是 $G(x)$，必须再加上特解。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。只写 $y_p$ 丢掉了两个任意常数，无法满足两个初值条件，也漏掉了齐次部分的解。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。符号错：$y_c-y_p$ 代回左端得 $-G(x)$，只有 $y_c+y_p$ 才满足原方程。</span></div>"
  },
  {
   "id": "ch17-q6",
   "ch": "ch17",
   "type": "mcq",
   "difficulty": 1,
   "kp": "17.3 应用", "tags": ["output"],
   "scope": "outside",
   "stem": "弹簧-质量系统方程 $y''+2\\beta y'+\\omega^{2}y=0$（$\\omega=\\sqrt{k/m}$）中，当 $\\beta<\\omega$ 时物体的运动是？",
   "options": [
    {
     "text": "临界阻尼，$y=(c_1+c_2t)e^{-\\omega t}$",
     "correct": false
    },
    {
     "text": "欠阻尼，振荡且振幅按 $e^{-\\beta t}$ 衰减",
     "correct": true
    },
    {
     "text": "过阻尼，$y=c_1e^{r_1t}+c_2e^{r_2t}$（$r_1,r_2<0$）",
     "correct": false
    },
    {
     "text": "简谐振动，周期 $T=\\dfrac{2\\pi}{\\omega}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$(c_1+c_2t)e^{-\\omega t}$ 对应 $\\beta=\\omega$ 的临界阻尼，其特征方程判别式为零。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$\\beta<\\omega$ 时 $r=-\\beta\\pm i\\sqrt{\\omega^{2}-\\beta^{2}}$，通解含 $e^{-\\beta t}$ 与正余弦因子，故振荡且振幅衰减。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。两个负实根 $r_1,r_2$ 出现在 $\\beta>\\omega$ 的过阻尼情形，此时运动不振荡。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。简谐振动要求阻尼 $d=0$ 即 $\\beta=0$；有阻尼时准周期为 $2\\pi/\\sqrt{\\omega^{2}-\\beta^{2}}$，比 $2\\pi/\\omega$ 大。</span></div>"
  },
  {
   "id": "ch17-q7",
   "ch": "ch17",
   "type": "mcq",
   "difficulty": 2,
   "kp": "17.3 应用", "tags": ["output"],
   "scope": "outside",
   "stem": "质量 $m=5$ kg 的物体挂在弹簧常数 $k=20$ N/m 的弹簧上做无阻尼自由振动，则该简谐振动的周期是？",
   "options": [
    {
     "text": "$T=2\\pi$ s",
     "correct": false
    },
    {
     "text": "$T=\\dfrac{2\\pi}{5}$ s",
     "correct": false
    },
    {
     "text": "$T=\\pi$ s",
     "correct": true
    },
    {
     "text": "$T=4\\pi$ s",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$2\\pi$ 对应 $\\omega=1$；本题 $\\omega=\\sqrt{k/m}=\\sqrt{20/5}=2$，周期应为 $\\pi$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。把质量 $5$ 当成了 $\\omega$；实际上 $\\omega=\\sqrt{k/m}=2$，故 $T=2\\pi/\\omega=\\pi$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$\\omega=\\sqrt{k/m}=\\sqrt{20/5}=2$，简谐振动周期 $T=2\\pi/\\omega=2\\pi/2=\\pi$ s。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。这是把 $\\omega$ 记成了 $\\sqrt{m/k}=0.5$；正确写法是 $\\omega=\\sqrt{k/m}=2$。</span></div>"
  },
  {
   "id": "ch17-q8",
   "ch": "ch17",
   "type": "mcq",
   "difficulty": 1,
   "kp": "17.4 欧拉方程", "tags": ["output","trap"],
   "scope": "outside",
   "stem": "对欧拉方程 $x^{2}y''-3xy'+68y=0$（$x>0$）试解 $y=x^{r}$，所得指标方程是？",
   "options": [
    {
     "text": "$r^{2}-3r+68=0$",
     "correct": false
    },
    {
     "text": "$r^{2}+3r+68=0$",
     "correct": false
    },
    {
     "text": "$r^{2}-4r-68=0$",
     "correct": false
    },
    {
     "text": "$r^{2}-4r+68=0$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。漏掉了 $ar(r-1)$ 展开出的 $-r$ 项，把系数原样搬运；正确应为 $r^{2}-4r+68=0$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$bxy'$ 中 $b=-3$，代入 $ar(r-1)+br+c$ 得 $-3r$，符号不能取反。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。常数项符号错：$c=68$，指标方程的常数项就是 $+68$，不是 $-68$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$a=1,b=-3,c=68$，指标方程 $ar(r-1)+br+c=r(r-1)-3r+68=r^{2}-4r+68=0$，根为 $2\\pm 8i$。</span></div>"
  },
  {
   "id": "ch17-q9",
   "ch": "ch17",
   "type": "mcq",
   "difficulty": 2,
   "kp": "17.5 幂级数解法", "tags": ["concept"],
   "scope": "outside",
   "stem": "设 $y=\\sum_{n=0}^{\\infty}c_nx^{n}$ 代入 $y''+xy'+y=0$，比较 $x^{n}$ 的系数所得递推关系是？",
   "options": [
    {
     "text": "$c_{n+2}=-\\dfrac{c_n}{n+2}$",
     "correct": true
    },
    {
     "text": "$c_{n+2}=-\\dfrac{c_n}{(n+2)(n+1)}$",
     "correct": false
    },
    {
     "text": "$c_{n+2}=\\dfrac{c_n}{n+2}$",
     "correct": false
    },
    {
     "text": "$c_{n+2}=\\dfrac{2n-1}{(n+2)(n+1)}c_n$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$x^{n}$ 的系数为 $(n+2)(n+1)c_{n+2}+nc_n+c_n=0$，即 $(n+2)c_{n+2}=-c_n$，故该递推成立。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。把 $y''$ 的系数与 $y$ 直接相除；$xy'$ 给的 $nc_n$ 要与 $y$ 的 $c_n$ 合并成 $(n+1)c_n$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。符号错：移项后应带负号，$c_{n+2}$ 与 $c_n$ 反号，所以奇偶两支都交替变号。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。这是 $y''-2xy'+y=0$ 的递推（$y'$ 前是 $-2x$）；本题 $xy'$ 前为正号，结果简单得多。</span></div>"
  },
  {
   "id": "ch17-q10",
   "ch": "ch17",
   "type": "mcq",
   "difficulty": 3,
   "kp": "17.5 幂级数解法", "tags": ["concept","trap"],
   "scope": "outside",
   "stem": "对 $y''-2xy'+y=0$，递推为 $c_{n+2}=\\dfrac{2n-1}{(n+2)(n+1)}c_n$，则 $c_4$ 与 $c_0$ 的关系是？",
   "options": [
    {
     "text": "$c_4=\\dfrac{c_0}{8}$",
     "correct": false
    },
    {
     "text": "$c_4=-\\dfrac{c_0}{8}$",
     "correct": true
    },
    {
     "text": "$c_4=-\\dfrac{3c_0}{8}$",
     "correct": false
    },
    {
     "text": "$c_4=-\\dfrac{c_1}{8}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。符号错：$n=0$ 给出 $c_2=-\\dfrac{c_0}{2}$ 已带负号，$c_4=\\dfrac{3}{12}c_2$ 仍为负。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$n=0$ 得 $c_2=-\\dfrac{c_0}{2}$；$n=2$ 得 $c_4=\\dfrac{3}{12}c_2=\\dfrac14\\left(-\\dfrac{c_0}{2}\\right)=-\\dfrac{c_0}{8}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。分母漏掉因子 $(n+1)$：若把系数写成 $\\dfrac{2n-1}{n+2}=\\dfrac34$，就会多算成 $-\\dfrac{3c_0}{8}$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$c_4$ 是偶次项，只能由 $c_0$ 经偶次支生成；$c_1$ 生成的是 $c_3,c_5$ 等奇次项。</span></div>"
  },
  {
   "id": "ch18-q1",
   "ch": "ch18",
   "type": "mcq",
   "difficulty": 1,
   "kp": "A.1 实数与实轴", "tags": ["output"],
   "scope": "tool",
   "stem": "不等式 $|2x-3|<5$ 的解集是？",
   "options": [
    {
     "text": "$(-1,\\,4)$",
     "correct": true
    },
    {
     "text": "$(-4,\\,1)$",
     "correct": false
    },
    {
     "text": "$(-\\infty,-1)\\cup(4,\\infty)$",
     "correct": false
    },
    {
     "text": "$(-2,\\,8)$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$-5<2x-3<5$，两边加 $3$ 得 $-2<2x<8$，再除以 $2$ 得 $-1<x<4$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$(-4,1)$ 是 $|2x+3|<5$ 的解集，本题中间项是 $2x-3$，符号代反了。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。这是 $|2x-3|>5$ 的解集；$|u|<a$ 应合成一个区间，写成并集用错了大于型结论。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。忘记最后除以 $2$：$-2<2x<8$ 还要化成 $-1<x<4$。</span></div>"
  },
  {
   "id": "ch18-q2",
   "ch": "ch18",
   "type": "mcq",
   "difficulty": 1,
   "kp": "A.1 实数与实轴", "tags": ["output"],
   "scope": "tool",
   "stem": "化简 $\\sqrt{(x-5)^{2}}$ 的结果是？",
   "options": [
    {
     "text": "$x-5$",
     "correct": false
    },
    {
     "text": "$\\lvert x-5\\rvert$",
     "correct": true
    },
    {
     "text": "$5-x$",
     "correct": false
    },
    {
     "text": "$(x-5)^{2}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\sqrt{a^{2}}=\\lvert a\\rvert$ 而不是 $a$，只有当 $x\\ge5$ 时 $x-5$ 才等于结果。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$\\sqrt{a^{2}}=\\lvert a\\rvert$，取 $a=x-5$ 得 $\\lvert x-5\\rvert$，对一切实数 $x$ 都成立。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$5-x=-(x-5)$，只在 $x\\le5$ 时与 $\\lvert x-5\\rvert$ 相等，区间取反了。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。根号与平方抵消后不再留平方：$x=0$ 时原式为 $5$，而 $(x-5)^{2}=25$。</span></div>"
  },
  {
   "id": "ch18-q3",
   "ch": "ch18",
   "type": "mcq",
   "difficulty": 2,
   "kp": "A.2 数学归纳法", "tags": ["output"],
   "scope": "tool",
   "stem": "用数学归纳法证明 $n!>3^{n}$，第一步应验证的起始整数 $n_{1}$ 是？",
   "options": [
    {
     "text": "$n_{1}=7$",
     "correct": true
    },
    {
     "text": "$n_{1}=6$",
     "correct": false
    },
    {
     "text": "$n_{1}=5$",
     "correct": false
    },
    {
     "text": "$n_{1}=4$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。$6!=720<3^{6}=729$ 不成立，而 $7!=5040>3^{7}=2187$ 成立，故基例取 $n_{1}=7$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$6!=720$ 小于 $3^{6}=729$，基例在 $n=6$ 不成立，归纳法无法启动。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$5!=120$ 远小于 $3^{5}=243$，不能作为起点。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$4!=24$ 小于 $3^{4}=81$，取 $n_{1}=4$ 第一步就失败。</span></div>"
  },
  {
   "id": "ch18-q4",
   "ch": "ch18",
   "type": "mcq",
   "difficulty": 1,
   "kp": "A.3 直线、圆、抛物线", "tags": ["output"],
   "scope": "tool",
   "stem": "圆 $x^{2}+y^{2}+4x-6y-3=0$ 的圆心与半径是？",
   "options": [
    {
     "text": "$(2,-3)$，半径 $4$",
     "correct": false
    },
    {
     "text": "$(-2,3)$，半径 $16$",
     "correct": false
    },
    {
     "text": "$(-2,3)$，半径 $4$",
     "correct": true
    },
    {
     "text": "$(4,-6)$，半径 $4$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。圆心要取相反数：$(x+2)^{2}$ 与 $(y-3)^{2}$ 给出圆心 $(-2,3)$，不是 $(2,-3)$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。圆心对，但半径是 $a$ 不是 $a^{2}$：右边为 $16$ 时半径 $a=\\sqrt{16}=4$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。配方得 $(x+2)^{2}+(y-3)^{2}=16$，圆心 $(-2,3)$，半径 $\\sqrt{16}=4$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$(4,-6)$ 是一次项系数，不是圆心；圆心取配方后括号内常数的相反数。</span></div>"
  },
  {
   "id": "ch18-q5",
   "ch": "ch18",
   "type": "mcq",
   "difficulty": 3,
   "kp": "A.4 极限定理的证明", "tags": ["output","trap"],
   "scope": "tool",
   "stem": "在乘积法则 $\\lim(fg)=LM$ 的 $\\varepsilon$ 证明中，把 $fg-LM$ 拆项所用的恒等式是？",
   "options": [
    {
     "text": "$fg-LM=(f-L)(g-M)$",
     "correct": false
    },
    {
     "text": "$fg-LM=(f-L)g+L(g-M)$",
     "correct": true
    },
    {
     "text": "$fg-LM=(f-L)g-L(g-M)$",
     "correct": false
    },
    {
     "text": "$fg-LM=(f+L)(g+M)-2LM$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。展开 $(f-L)(g-M)$ 多出 $-fM-Lg+2LM$，不等于 $fg-LM$，无法直接估计。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$(f-L)g+L(g-M)=fg-Lg+Lg-LM=fg-LM$，再用三角不等式拆成两项估计。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。展开得 $fg-2Lg+LM$，比 $fg-LM$ 多出 $-2Lg+2LM$，符号用错了。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。该式展开含 $fM+Lg$ 等交叉项，与待估的 $fg-LM$ 不符。</span></div>"
  },
  {
   "id": "ch18-q6",
   "ch": "ch18",
   "type": "mcq",
   "difficulty": 1,
   "kp": "A.5 常用极限清单", "tags": ["output"],
   "scope": "tool",
   "stem": "$\\lim_{x\\to\\infty}\\left(1+\\frac{3}{x}\\right)^{x}$ 的值是？",
   "options": [
    {
     "text": "$e^{3}$",
     "correct": true
    },
    {
     "text": "$e$",
     "correct": false
    },
    {
     "text": "$3e$",
     "correct": false
    },
    {
     "text": "$1$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。这是 $1^{\\infty}$ 型标准形 $\\lim_{x\\to\\infty}(1+\\frac{a}{x})^{x}=e^{a}$，取 $a=3$ 得 $e^{3}$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$e$ 对应 $a=1$，即 $(1+\\frac1x)^{x}$；本题括号内是 $\\frac3x$，指数应取 $3$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。把 $e^{a}$ 误写成 $ae$；$a$ 应出现在指数位置而不是乘在前面。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。括号内趋于 $1$、指数趋于无穷，属 $1^{\\infty}$ 型不定式，极限不是 $1$。</span></div>"
  },
  {
   "id": "ch18-q7",
   "ch": "ch18",
   "type": "mcq",
   "difficulty": 2,
   "kp": "A.7 复数", "tags": ["output"],
   "scope": "tool",
   "stem": "$-16$ 的四次方根中，辐角为 $\\frac{\\pi}{4}$ 的那个根是？",
   "options": [
    {
     "text": "$\\sqrt{2}(-1+i)$",
     "correct": false
    },
    {
     "text": "$2(1+i)$",
     "correct": false
    },
    {
     "text": "$\\sqrt{2}(1+i)$",
     "correct": true
    },
    {
     "text": "$\\sqrt{2}(1-i)$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\sqrt{2}(-1+i)$ 的辐角是 $\\frac{3\\pi}{4}$，对应 $k=1$，不是 $k=0$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。模写错：$2(1+i)$ 的模是 $2\\sqrt{2}$，而四次方根的模应为 $\\sqrt[4]{16}=2$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$r=\\sqrt[4]{16}=2$，$k=0$ 时辐角为 $\\frac{\\pi}{4}$，故该根为 $2e^{i\\pi/4}=\\sqrt{2}(1+i)$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\sqrt{2}(1-i)$ 的辐角是 $-\\frac{\\pi}{4}$（即 $\\frac{7\\pi}{4}$），对应 $k=3$。</span></div>"
  },
  {
   "id": "ch18-q8",
   "ch": "ch18",
   "type": "mcq",
   "difficulty": 2,
   "kp": "A.7 复数", "tags": ["output"],
   "scope": "tool",
   "stem": "复数 $z=1+i\\sqrt{3}$ 的极形式是？",
   "options": [
    {
     "text": "$2e^{i\\pi/6}$",
     "correct": false
    },
    {
     "text": "$4e^{i\\pi/3}$",
     "correct": false
    },
    {
     "text": "$2e^{i2\\pi/3}$",
     "correct": false
    },
    {
     "text": "$2e^{i\\pi/3}$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\tan\\theta=\\sqrt{3}$ 且 $z$ 在第一象限，故 $\\theta=\\frac{\\pi}{3}$，不是 $\\frac{\\pi}{6}$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$4$ 是 $\\lvert z\\rvert^{2}=1^{2}+3$ 的值，模应是 $\\sqrt{4}=2$，辐角部分是对的。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac{2\\pi}{3}$ 在第二象限，而 $z$ 的实部、虚部都为正，辐角应在第一象限。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。$r=\\sqrt{1+3}=2$，$\\theta=\\arctan\\sqrt{3}=\\frac{\\pi}{3}$，故 $z=2e^{i\\pi/3}$。</span></div>"
  },
  {
   "id": "ch18-q9",
   "ch": "ch18",
   "type": "mcq",
   "difficulty": 2,
   "kp": "A.8 概率", "tags": ["output"],
   "scope": "tool",
   "stem": "某元件寿命 $T$（小时）的密度为 $f(t)=2e^{-2t}\\,(t\\ge0)$，则 $P\\left(T\\le\\frac{1}{2}\\right)=$ ?",
   "options": [
    {
     "text": "$e^{-1}$",
     "correct": false
    },
    {
     "text": "$1-e^{-1}$",
     "correct": true
    },
    {
     "text": "$\\frac{1}{2}$",
     "correct": false
    },
    {
     "text": "$1-e^{-2}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$e^{-1}$ 是 $P(T>\\frac12)$ 的值，与所求互补，少减了一步。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。$\\int_{0}^{1/2}2e^{-2t}\\,dt=\\left[-e^{-2t}\\right]_{0}^{1/2}=1-e^{-1}\\approx0.632$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac12$ 是指数分布的均值 $1/c$，不是区间概率，概率要由积分算出。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$1-e^{-2}$ 是积分到上限 $t=1$ 的结果，把上限 $\\frac12$ 记成了 $1$。</span></div>"
  },
  {
   "id": "ch18-q10",
   "ch": "ch18",
   "type": "mcq",
   "difficulty": 3,
   "kp": "A.10 混合偏导与增量定理", "tags": ["concept","trap"],
   "scope": "tool",
   "stem": "混合偏导定理断言 $f_{xy}(a,b)=f_{yx}(a,b)$，它成立所需的条件是？",
   "options": [
    {
     "text": "只要求 $f$ 在 $(a,b)$ 连续",
     "correct": false
    },
    {
     "text": "只要求 $f_{x}$ 与 $f_{y}$ 在 $(a,b)$ 存在",
     "correct": false
    },
    {
     "text": "只要求 $f_{xy}$ 与 $f_{yx}$ 在 $(a,b)$ 存在",
     "correct": false
    },
    {
     "text": "$f,f_{x},f_{y},f_{xy},f_{yx}$ 在含 $(a,b)$ 的开区域内有定义且在 $(a,b)$ 连续",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。仅有 $f$ 连续不够，二阶混合偏导还需存在且连续才能交换求导次序。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。一阶偏导存在不够，定理还要求 $f_{xy},f_{yx}$ 存在且在 $(a,b)$ 连续。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。两者都存在仍可能不相等，关键是它们在 $(a,b)$ 处连续。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。定理要求这五个函数在含 $(a,b)$ 的开区域内有定义且在 $(a,b)$ 连续。</span></div>"
  },
  {
   "id": "ch19-q1",
   "ch": "ch19",
   "type": "mcq",
   "difficulty": 1,
   "kp": "4.1 基本形式", "tags": ["concept"],
   "scope": "tool",
   "stem": "下列基本积分公式中，正确的是？",
   "options": [
    {
     "text": "$\\int x^{n}\\,dx=\\frac{x^{n-1}}{n-1}+C\\ (n\\neq1)$",
     "correct": false
    },
    {
     "text": "$\\int x^{n}\\,dx=nx^{n-1}+C$",
     "correct": false
    },
    {
     "text": "$\\int x^{n}\\,dx=\\frac{x^{n+1}}{n+1}+C\\ (n\\neq-1)$",
     "correct": true
    },
    {
     "text": "$\\int \\frac{dx}{x}=\\frac{x^{-1}}{-1}+C$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。这是照求导的方向把幂次降低；积分应当升幂为 $\\frac{x^{n+1}}{n+1}$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$nx^{n-1}$ 是 $(x^{n})'$，求导与积分互为逆运算，不能把导数公式当积分公式。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。幂函数积分幂次加一、再除以新幂次，只要求 $n\\neq-1$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$n=-1$ 时升幂公式失效；这样写得到 $-\\frac1x+C$，求导是 $\\frac{1}{x^{2}}$ 而不是 $\\frac1x$。</span></div>"
  },
  {
   "id": "ch19-q2",
   "ch": "ch19",
   "type": "mcq",
   "difficulty": 1,
   "kp": "三、导数法则与导数表", "tags": ["output"],
   "scope": "tool",
   "stem": "根据基本导数表，$\\frac{d}{dx}\\cot x$ 等于？",
   "options": [
    {
     "text": "$\\csc^{2}x$",
     "correct": false
    },
    {
     "text": "$-\\csc^{2}x$",
     "correct": true
    },
    {
     "text": "$-\\sec^{2}x$",
     "correct": false
    },
    {
     "text": "$\\csc x\\cot x$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。漏了负号：$\\cot x$ 的导数是 $-\\csc^{2}x$，取正号不成立。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。基本导数表给出 $(\\cot x)'=-\\csc^{2}x$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\sec^{2}x$ 属于 $\\tan x$；$\\cot x$ 对应的是 $\\csc^{2}x$，且符号为负。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$\\csc x\\cot x$ 出现在 $(\\csc x)'=-\\csc x\\cot x$ 中，不是 $\\cot x$ 的导数。</span></div>"
  },
  {
   "id": "ch19-q3",
   "ch": "ch19",
   "type": "mcq",
   "difficulty": 2,
   "kp": "4.3 含 a^2+x^2", "tags": ["output"],
   "scope": "tool",
   "stem": "查积分表，$\\int \\frac{dx}{a^{2}+x^{2}}$（$a>0$）等于？",
   "options": [
    {
     "text": "$\\frac{1}{a}\\ln\\left|\\frac{a+x}{a-x}\\right|+C$",
     "correct": false
    },
    {
     "text": "$\\frac{1}{2a}\\ln\\left|\\frac{x-a}{x+a}\\right|+C$",
     "correct": false
    },
    {
     "text": "$\\sin^{-1}\\frac{x}{a}+C$",
     "correct": false
    },
    {
     "text": "$\\frac{1}{a}\\tan^{-1}\\frac{x}{a}+C$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。这是 $\\int\\frac{dx}{a^{2}-x^{2}}$ 的结果，属于平方差型，与分母 $a^{2}+x^{2}$ 不符。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。这是 $\\int\\frac{dx}{x^{2}-a^{2}}$ 的结果，它与上一条互为相反数，同样不适用平方和。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\sin^{-1}\\frac{x}{a}$ 对应 $\\int\\frac{dx}{\\sqrt{a^{2}-x^{2}}}$，本题分母没有根号。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。分母是平方和 $a^{2}+x^{2}$ 时查 §4.3，结果为 $\\frac{1}{a}\\tan^{-1}\\frac{x}{a}+C$。</span></div>"
  },
  {
   "id": "ch19-q4",
   "ch": "ch19",
   "type": "mcq",
   "difficulty": 2,
   "kp": "4.4 含 a^2-x^2", "tags": ["output"],
   "scope": "tool",
   "stem": "计算 $\\int_{0}^{1}\\frac{dx}{\\sqrt{4-x^{2}}}$ 的值。",
   "options": [
    {
     "text": "$\\frac{\\pi}{3}$",
     "correct": false
    },
    {
     "text": "$\\frac{\\pi}{6}$",
     "correct": true
    },
    {
     "text": "$\\frac{\\pi}{2}$",
     "correct": false
    },
    {
     "text": "$\\frac{1}{4}\\ln 3$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$\\frac{\\pi}{3}$ 相当于把 $\\frac{x}{a}$ 当成了 $\\frac{\\sqrt3}{2}$；上限 $x=1$ 时 $\\frac{x}{2}=\\frac12$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。原函数是 $\\sin^{-1}\\frac{x}{2}$，代入上下限得 $\\sin^{-1}\\frac12-\\sin^{-1}0=\\frac{\\pi}{6}$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$\\frac{\\pi}{2}$ 是上限取 $x=a=2$ 的结果，本题上限只有 $1$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。含 $\\ln$ 的是 $\\int\\frac{dx}{a^{2}-x^{2}}$ 型；本题分母带根号，应查反正弦型。</span></div>"
  },
  {
   "id": "ch19-q5",
   "ch": "ch19",
   "type": "mcq",
   "difficulty": 2,
   "kp": "二、极限与等价无穷小", "tags": ["output"],
   "scope": "tool",
   "stem": "当 $x\\to0$ 时，$1-\\cos x$ 的等价无穷小是？",
   "options": [
    {
     "text": "$x$",
     "correct": false
    },
    {
     "text": "$x^{2}$",
     "correct": false
    },
    {
     "text": "$\\frac{x^{3}}{6}$",
     "correct": false
    },
    {
     "text": "$\\frac{x^{2}}{2}$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$1-\\cos x$ 是二阶小量，比 $x$ 更快趋于 $0$，两者之比趋于 $0$ 而非 $1$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。由 $\\cos x\\approx1-\\frac{x^{2}}{2}$ 可知还差系数 $\\frac12$，$x^{2}$ 与它并不等价。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$x-\\sin x\\sim\\frac{x^{3}}{6}$ 才是同阶；$1-\\cos x$ 只到二次。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。等价无穷小表给出 $1-\\cos x\\sim\\frac{x^{2}}{2}$，用降幂公式也可验证。</span></div>"
  },
  {
   "id": "ch19-q6",
   "ch": "ch19",
   "type": "mcq",
   "difficulty": 1,
   "kp": "一、代数、三角与双曲恒等式", "tags": ["output"],
   "scope": "tool",
   "stem": "根据降幂公式，$\\sin^{2}u$ 等于？",
   "options": [
    {
     "text": "$\\frac{1+\\cos2u}{2}$",
     "correct": false
    },
    {
     "text": "$\\frac{\\cos2u-1}{2}$",
     "correct": false
    },
    {
     "text": "$\\frac{1-\\cos2u}{2}$",
     "correct": true
    },
    {
     "text": "$2\\sin u\\cos u$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。这是 $\\cos^{2}u$ 的降幂公式，$\\sin$ 与 $\\cos$ 的两个公式不能互换。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\frac{\\cos2u-1}{2}=-\\sin^{2}u$，与正确答案只差一个符号。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。降幂公式给出 $\\sin^{2}u=\\frac{1-\\cos2u}{2}$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。$2\\sin u\\cos u=\\sin2u$，这是二倍角公式，不是降幂结果。</span></div>"
  },
  {
   "id": "ch19-q7",
   "ch": "ch19",
   "type": "mcq",
   "difficulty": 3,
   "kp": "4.9 指数与对数形式", "tags": ["concept","trap"],
   "scope": "tool",
   "stem": "下列哪个是 $\\int e^{ax}\\cos bx\\,dx$ 的正确结果？",
   "options": [
    {
     "text": "$\\frac{e^{ax}}{a^{2}-b^{2}}\\left(a\\cos bx+b\\sin bx\\right)+C$",
     "correct": false
    },
    {
     "text": "$\\frac{e^{ax}}{a^{2}+b^{2}}\\left(a\\cos bx+b\\sin bx\\right)+C$",
     "correct": true
    },
    {
     "text": "$\\frac{e^{ax}}{a^{2}+b^{2}}\\left(a\\sin bx-b\\cos bx\\right)+C$",
     "correct": false
    },
    {
     "text": "$e^{ax}\\left(a\\cos bx+b\\sin bx\\right)+C$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。分母最容易被误写成 $a^{2}-b^{2}$；分部两次解方程得到的是 $a^{2}+b^{2}$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">B</b><span class=\"oeT\">对。分部两次后移项解方程，得 $\\frac{e^{ax}}{a^{2}+b^{2}}(a\\cos bx+b\\sin bx)+C$。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$a\\sin bx-b\\cos bx$ 是 $\\int e^{ax}\\sin bx\\,dx$ 的分子，两式极易记反。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。漏了分母 $\\frac{1}{a^{2}+b^{2}}$；对它求导会多出因子 $a^{2}+b^{2}$。</span></div>"
  },
  {
   "id": "ch19-q8",
   "ch": "ch19",
   "type": "mcq",
   "difficulty": 1,
   "kp": "六、常用级数展开与求和", "tags": ["concept"],
   "scope": "tool",
   "stem": "几何级数 $\\sum_{n=0}^{\\infty}ar^{n}$ 收敛的条件与和分别是？",
   "options": [
    {
     "text": "$|r|>1$，和为 $\\frac{a}{1-r}$",
     "correct": false
    },
    {
     "text": "$|r|<1$，和为 $\\frac{a}{1+r}$",
     "correct": false
    },
    {
     "text": "$r\\neq1$，和为 $\\frac{a}{1-r}$",
     "correct": false
    },
    {
     "text": "$|r|<1$，和为 $\\frac{a}{1-r}$",
     "correct": true
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。$|r|>1$ 时通项 $ar^{n}$ 不趋于 $0$，级数发散，求和公式失效。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。分母应是 $1-r$；$\\frac{a}{1+r}$ 对应的是含 $(-1)^{n}$ 的交错级数。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。$r\\neq1$ 只保证分母非零；收敛仍然要求 $|r|<1$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">D</b><span class=\"oeT\">对。几何级数 $\\sum ar^{n}$ 收敛当且仅当 $|r|<1$，此时和为 $\\frac{a}{1-r}$。</span></div>"
  },
  {
   "id": "ch19-q9",
   "ch": "ch19",
   "type": "mcq",
   "difficulty": 2,
   "kp": "七、几何与多元公式", "tags": ["output"],
   "scope": "tool",
   "stem": "空间曲线 $\\mathbf{r}(t)$ 的曲率 $\\kappa$ 等于？（$\\mathbf{v}$、$\\mathbf{a}$ 为速度与加速度）",
   "options": [
    {
     "text": "$\\frac{|\\mathbf{v}\\times\\mathbf{a}|}{|\\mathbf{v}|^{3}}$",
     "correct": true
    },
    {
     "text": "$\\frac{|\\mathbf{v}\\cdot\\mathbf{a}|}{|\\mathbf{v}|^{3}}$",
     "correct": false
    },
    {
     "text": "$\\frac{|\\mathbf{v}\\times\\mathbf{a}|}{|\\mathbf{v}|^{2}}$",
     "correct": false
    },
    {
     "text": "$\\frac{|\\mathbf{a}|}{|\\mathbf{v}|^{3}}$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp ok\"><b class=\"oeL\">A</b><span class=\"oeT\">对。速查表给出 $\\kappa=\\frac{|\\mathbf{v}\\times\\mathbf{a}|}{|\\mathbf{v}|^{3}}$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。$\\mathbf{v}\\cdot\\mathbf{a}$ 给出的是切向分量 $a_T$，与曲率无关。</span></div><div class=\"optExp\"><b class=\"oeL\">C</b><span class=\"oeT\">错。分母应是 $|\\mathbf{v}|^{3}$；$|\\mathbf{v}|^{2}$ 出现在 $a_N=\\kappa|\\mathbf{v}|^{2}$ 中。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。漏了叉积：直线运动时 $\\mathbf{a}$ 可以不为零而曲率为零。</span></div>"
  },
  {
   "id": "ch19-q10",
   "ch": "ch19",
   "type": "mcq",
   "difficulty": 3,
   "kp": "八、考场使用提示", "tags": ["output","trap"],
   "scope": "tool",
   "stem": "速查表「最容易记错的公式」中，$\\int\\sec x\\,dx$ 的正确形式是？",
   "options": [
    {
     "text": "$\\ln|\\sec x|+C$",
     "correct": false
    },
    {
     "text": "$\\frac{1}{2}\\sec x\\tan x+\\frac{1}{2}\\ln|\\sec x+\\tan x|+C$",
     "correct": false
    },
    {
     "text": "$\\ln|\\sec x+\\tan x|+C$",
     "correct": true
    },
    {
     "text": "$\\ln|\\sec x\\tan x|+C$",
     "correct": false
    }
   ],
   "explain": "<div class=\"optExp\"><b class=\"oeL\">A</b><span class=\"oeT\">错。漏了 $\\tan x$：对 $\\ln|\\sec x|$ 求导得 $\\tan x$，不是 $\\sec x$。</span></div><div class=\"optExp\"><b class=\"oeL\">B</b><span class=\"oeT\">错。这是 $\\int\\sec^{3}x\\,dx$ 的结果，比 $\\int\\sec x\\,dx$ 多出 $\\frac12\\sec x\\tan x$。</span></div><div class=\"optExp ok\"><b class=\"oeL\">C</b><span class=\"oeT\">对。$\\int\\sec x\\,dx=\\ln|\\sec x+\\tan x|+C$，速查表专门提醒不要漏 $\\tan x$。</span></div><div class=\"optExp\"><b class=\"oeL\">D</b><span class=\"oeT\">错。对数真数应是和式 $\\sec x+\\tan x$；乘积型求导得不到 $\\sec x$。</span></div>"
  }
 ]
};
  CSC._quizPack = PACK;
  return PACK;
})());
