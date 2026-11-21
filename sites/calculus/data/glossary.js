/* =====================================================================
 * data/glossary.js · 微积分学习站 · 术语表数据
 * 共 181 条 · 覆盖 ch00–ch19 全部 20 个模块
 * 英文术语取自各章正文/节标题里的规范英文名；anchor 指向该术语所在小节
 * （chNN-sK = 该章第 K 个 h 块，见 data/chNN.js）
 * def 用初学者能懂的白话讲清「这是什么、什么时候会用到、容易和什么混」，
 *     可含行内公式 $...$（JS 字符串内反斜杠写成 \\，小于号写成 \\lt）
 * ===================================================================== */
CSC.registerGlossary([

  /* ------------------------------ ch00 总览与学习路线 ------------------------------ */
  { en: 'study route', zh: '学习路线', def: '网站按你剩下的时间给了三条走法：时间很紧就抓最要紧的，时间充裕就一章章读。它只帮你安排先看什么，不改变内容本身。', ch: 'ch00', anchor: 'ch00-s3' },
  { en: 'syllabus scope', zh: '学习范围', def: '给每一章标出它属于哪种范围：现在就要学的、以后才学的、开课前默认你会了的、以及不作要求的。看徽章就知道这一章该花多少力气。', ch: 'ch00', anchor: 'ch00-s2' },

  /* ------------------------------ ch01 函数 ------------------------------ */
  { en: 'function', zh: '函数', def: '把一个输入 $x$ 变成唯一一个输出 $f(x)$ 的规则。你可以把它想成一台机器：投进去一个数，只吐出一个数。', ch: 'ch01', anchor: 'ch01-s3' },
  { en: 'domain', zh: '定义域', def: '能让这个式子算得出来的 $x$ 的全体。看分母会不会是 0、根号里会不会变负、对数的真数是否为正，就能定出来。', ch: 'ch01', anchor: 'ch01-s3' },
  { en: 'range', zh: '值域', def: '函数真正能取到的那些 $y$ 值。常见做法是先看定义域和增减趋势，或者反过来解出 $x$。', ch: 'ch01', anchor: 'ch01-s3' },
  { en: 'piecewise-defined function', zh: '分段函数', def: '在不同区间用不同公式的函数，比如 $|x|$ 和 $\\lfloor x\\rfloor$。分段点两侧要分开看，不能拿一个公式套到底。', ch: 'ch01', anchor: 'ch01-s3' },
  { en: 'even function', zh: '偶函数', def: '$f(-x)=f(x)$ 的函数，图象关于 $y$ 轴对称。注意前提是定义域关于原点对称，否则无从谈起。', ch: 'ch01', anchor: 'ch01-s3' },
  { en: 'odd function', zh: '奇函数', def: '$f(-x)=-f(x)$ 的函数，图象绕原点转半圈后与自己重合。容易和偶函数混：偶的是关于 $y$ 轴对称，奇的是关于原点对称。', ch: 'ch01', anchor: 'ch01-s3' },
  { en: 'composite function', zh: '复合函数', def: '把一个函数的输出再喂给另一个函数，记作 $(f\\circ g)(x)=f(g(x))$。它的定义域要同时满足内层能算、外层能接。', ch: 'ch01', anchor: 'ch01-s4' },
  { en: 'periodic function', zh: '周期函数', def: '过一段固定长度就重复自己的函数，那段长度叫周期。$\\sin$ 和 $\\cos$ 的周期是 $2\\pi$，$\\tan$ 和 $\\cot$ 的周期是 $\\pi$。', ch: 'ch01', anchor: 'ch01-s5' },

  /* ------------------------------ ch02 极限与连续 ------------------------------ */
  { en: 'limit', zh: '极限', def: '看 $x$ 越来越靠近 $c$ 时，$f(x)$ 是不是稳定地靠近某个数 $L$。它只关心「靠近的过程」，不管 $x=c$ 这一点本身有没有定义。', ch: 'ch02', anchor: 'ch02-s4' },
  { en: 'epsilon-delta definition', zh: 'ε-δ 定义', def: '把「无限接近」写成能验算的说法：你给出任意小的误差 $\\varepsilon$，我都能找到一个范围 $\\delta$，让范围内的 $f(x)$ 与 $L$ 的差小于 $\\varepsilon$。', ch: 'ch02', anchor: 'ch02-s5' },
  { en: 'one-sided limit', zh: '单侧极限', def: '只从左边或只从右边靠近 $c$ 时的极限。两侧都存在且相等，双侧极限才存在，所以分段函数在分界点一定要分左右看。', ch: 'ch02', anchor: 'ch02-s6' },
  { en: 'limit laws', zh: '极限法则', def: '极限可以拆开算：和、差、积、商的极限，等于各自极限再做对应的运算。前提是每一项的极限都存在且有限，除法还要求分母极限不为 0。', ch: 'ch02', anchor: 'ch02-s4' },
  { en: 'sandwich theorem', zh: '夹逼定理', def: '如果 $f$ 被两个函数夹在中间，而上下两个都趋向同一个 $L$，那 $f$ 也只能趋向 $L$。求 $\\frac{\\sin\\theta}{\\theta}$ 这类没有现成法则可用的极限时靠它。', ch: 'ch02', anchor: 'ch02-s4' },
  { en: 'continuity', zh: '连续性', def: '函数在这一点的极限值恰好等于函数值，就叫连续——图象在那里不断开。三个条件要同时满足：该点有定义、极限存在、两者相等。', ch: 'ch02', anchor: 'ch02-s7' },
  { en: 'removable discontinuity', zh: '可去间断点', def: '函数在某点缺一个洞：极限存在，但该点没定义或值不对。把这一点补上或改对，函数就连续了。', ch: 'ch02', anchor: 'ch02-s7' },
  { en: 'infinite limit', zh: '无穷极限', def: '写 $\\lim_{x\\to c}f(x)=\\infty$ 只是说函数值越来越大、没有上界，属于「极限不存在」的一种。图象上对应一条竖直渐近线。', ch: 'ch02', anchor: 'ch02-s8' },
  { en: 'intermediate value theorem', zh: '介值定理', def: '连续函数从 $f(a)$ 走到 $f(b)$，中间每个值都会经过。想说明某个方程在区间里有解，在两端比较函数值的正负最方便。', ch: 'ch02', anchor: 'ch02-s7' },

  /* ------------------------------ ch03 导数 ------------------------------ */
  { en: 'derivative', zh: '导数', def: '导数描述「某一瞬间变化得多快」，几何上就是那一点切线的斜率。算法是把平均变化率 $\\frac{f(x+h)-f(x)}{h}$ 里的 $h$ 越压越小。', ch: 'ch03', anchor: 'ch03-s4' },
  { en: 'difference quotient', zh: '差商', def: '$\\frac{f(x+h)-f(x)}{h}$ 是一段路上的平均变化快慢，也就是割线斜率。把 $h$ 越缩越小，它就逼近导数。', ch: 'ch03', anchor: 'ch03-s3' },
  { en: 'differentiable', zh: '可导', def: '在这一点的导数算得出来，就叫可导。可导一定连续，连续却不一定可导——尖角处就是反例。', ch: 'ch03', anchor: 'ch03-s4' },
  { en: 'chain rule', zh: '链式法则', def: '复合函数求导要一层层乘：外层导数乘内层导数。可以想成剥洋葱，每剥一层都要乘上这一层的「变化率」。', ch: 'ch03', anchor: 'ch03-s8' },
  { en: 'implicit differentiation', zh: '隐函数求导', def: '当 $y$ 藏在一个方程里不好解出来时，两边同时对 $x$ 求导，并且把 $y$ 当成 $y(x)$——所以遇到 $y$ 要乘 $y\\prime$，最后再解出 $y\\prime$。', ch: 'ch03', anchor: 'ch03-s9' },
  { en: 'related rates', zh: '相关变化率', def: '几个量一起随时间变化时，先对时间求导找出它们变化快慢的关系，再把具体数值代进去。顺序不能反：先求导，后代值。', ch: 'ch03', anchor: 'ch03-s10' },
  { en: 'linearization', zh: '线性化', def: '用切线代替曲线做近似：$L(x)=f(a)+f\\prime(a)(x-a)$。离切点越近越准，是估算和误差分析的起点。', ch: 'ch03', anchor: 'ch03-s11' },
  { en: 'differential', zh: '微分', def: '$df=f\\prime(x)\\,dx$，表示自变量变化一点点时函数值大约变多少。常用来估算 $\\Delta f$ 和误差。', ch: 'ch03', anchor: 'ch03-s11' },

  /* ------------------------------ ch04 导数的应用 ------------------------------ */
  { en: 'extreme value', zh: '极值/最值', def: '闭区间上的连续函数一定能取到最大值与最小值（极值定理）。找的时候只需比较两类点：区间内部的临界点和两个端点。', ch: 'ch04', anchor: 'ch04-s3' },
  { en: 'critical point', zh: '临界点', def: '导数为 0 的点，或导数不存在的点，统称临界点。它只是「可能取极值」的候选，例如 $y=x^3$ 在 0 处导数为 0，却不是极值点。', ch: 'ch04', anchor: 'ch04-s3' },
  { en: "Rolle's theorem", zh: '罗尔定理', def: '两端高度一样、中间又光滑的曲线，路上至少有一处是平的（导数为 0）。三个条件：闭区间连续、开区间可导、两端函数值相等。', ch: 'ch04', anchor: 'ch04-s4' },
  { en: 'mean value theorem', zh: '中值定理（拉格朗日）', def: '一段路上的平均变化快慢，总会在路上某一瞬间被「瞬时变化率」恰好实现：$\\frac{f(b)-f(a)}{b-a}=f\\prime(c)$。', ch: 'ch04', anchor: 'ch04-s4' },
  { en: 'monotonic function', zh: '单调函数', def: '导数大于 0 就往上走（递增），小于 0 就往下走（递减）。要判断函数在哪段增、哪段减，看导数符号就够了。', ch: 'ch04', anchor: 'ch04-s5' },
  { en: 'concavity', zh: '凹凸性', def: '描述曲线向哪边弯：导数还在变大（$f\\prime\\prime>0$）是向上弯，导数在变小（$f\\prime\\prime\\lt 0$）是向下弯。', ch: 'ch04', anchor: 'ch04-s6' },
  { en: 'inflection point', zh: '拐点', def: '曲线由向上弯变成向下弯（或反过来）的那一点。必须验证两侧二阶导变号，只解出 $f\\prime\\prime=0$ 还不能算。', ch: 'ch04', anchor: 'ch04-s6' },
  { en: "Newton's method", zh: '牛顿法', def: '求方程 $f(x)=0$ 近似解的办法：在猜的点画切线，用切线与 $x$ 轴的交点当作下一个猜值，反复迭代就会靠近真正的根。', ch: 'ch04', anchor: 'ch04-s8' },
  { en: 'antiderivative', zh: '反导数/原函数', def: '已知一个函数的导数，倒推它是谁求导来的，这个「谁」就叫原函数。相差一个常数的原函数都成立，所以统一写 $+C$。', ch: 'ch04', anchor: 'ch04-s9' },

  /* ------------------------------ ch05 积分 ------------------------------ */
  { en: 'Riemann sum', zh: '黎曼和', def: '把区间切成很多小段，每段用一个矩形近似，再把矩形面积加起来。切得越细，这个和越接近真实的定积分。', ch: 'ch05', anchor: 'ch05-s3' },
  { en: 'sigma notation', zh: '求和记号', def: '用 $\\sum$ 把一串数加起来。常用三个结果：$\\sum k=\\frac{n(n+1)}2$、$\\sum k^2=\\frac{n(n+1)(2n+1)}6$、$\\sum k^3=\\left[\\frac{n(n+1)}2\\right]^2$。', ch: 'ch05', anchor: 'ch05-s4' },
  { en: 'definite integral', zh: '定积分', def: '把无数个细长条的面积加起来取极限，得到的一个确定的数：$\\int_a^b f(x)\\,dx$。它是数，不是一个带 $+C$ 的函数族。', ch: 'ch05', anchor: 'ch05-s5' },
  { en: 'integrand', zh: '被积函数', def: '积分号里正在被积的那个函数。$dx$ 则告诉你沿哪个变量积分，换元时动的就是它。', ch: 'ch05', anchor: 'ch05-s5' },
  { en: 'fundamental theorem of calculus', zh: '微积分基本定理', def: '它把两件看似无关的事接了起来：积分可以靠原函数来算，$\\int_a^b f=F(b)-F(a)$；反过来，变上限积分的导数就是原来的 $f$。', ch: 'ch05', anchor: 'ch05-s6' },
  { en: 'mean value theorem for definite integrals', zh: '定积分中值定理', def: '连续函数在区间上的平均值，等于某个点的函数值：$\\int_a^b f=f(c)(b-a)$。它说明连续函数一定取得到自己的平均值。', ch: 'ch05', anchor: 'ch05-s6' },
  { en: 'indefinite integral', zh: '不定积分', def: '所有原函数合在一起，写成 $\\int f(x)\\,dx=F(x)+C$。它是函数族，所以要带 $+C$；定积分是一个数，两者不是一回事。', ch: 'ch05', anchor: 'ch05-s7' },
  { en: 'substitution', zh: '换元法', def: '把复杂的一整块换成一个新变量 $u$，让积分变简单。换元要做三件事：换式子、换 $dx$，定积分还要换上下限。', ch: 'ch05', anchor: 'ch05-s7' },
  { en: 'net change', zh: '净变化', def: '变化率在区间上累积起来，就是总量净变了多少：$F(b)-F(a)=\\int_a^b F\\prime(x)\\,dx$。速度积分得位移，边际成本积分得成本增量。', ch: 'ch05', anchor: 'ch05-s6' },

  /* ------------------------------ ch06 定积分的应用 ------------------------------ */
  { en: 'cross-section', zh: '截面', def: '用一个平面去切立体，切出来的那片平面图形叫截面。已知每个位置的截面面积 $A(x)$，把面积沿轴累积就得到体积。', ch: 'ch06', anchor: 'ch06-s3' },
  { en: 'disk method', zh: '圆盘法', def: '绕轴旋转出来、中间没有洞的立体，可以切成一片片圆盘，每片体积是 $\\pi R^2\\,dx$，沿轴加起来就是总体积。', ch: 'ch06', anchor: 'ch06-s3' },
  { en: 'washer method', zh: '垫圈法', def: '旋转体和轴之间有空隙时，切出来的是带洞的圆环，用外圆面积减内圆面积：$\\pi(R^2-r^2)$，再沿轴积分。', ch: 'ch06', anchor: 'ch06-s3' },
  { en: 'cylindrical shell', zh: '柱壳法', def: '把旋转体想成一层层薄薄的圆筒，剪开摊平近似一块板：长是周长 $2\\pi r$、高是筒高、厚是 $dx$，乘起来再积分。', ch: 'ch06', anchor: 'ch06-s4' },
  { en: 'arc length', zh: '弧长', def: '把曲线切成许多极短的小段，每段用直线近似，长度是 $\\sqrt{1+(y\\prime)^2}\\,dx$，再沿区间积分。', ch: 'ch06', anchor: 'ch06-s5' },
  { en: 'surface of revolution', zh: '旋转曲面', def: '曲线绕轴旋转得到的曲面，面积要用弧长微元算：$S=\\int 2\\pi(\\text{半径})\\,ds$。这里千万不能用 $dx$。', ch: 'ch06', anchor: 'ch06-s6' },
  { en: 'work', zh: '功', def: '力沿位移做的功，等于力对位移的积分。弹簧的力随形变变大；抽液时每层液体被提升的高度不同，要按层积分。', ch: 'ch06', anchor: 'ch06-s7' },
  { en: 'center of mass', zh: '质心', def: '物体的平衡点。薄板用各点的位置乘密度做积分，再除以总质量；密度均匀时常数 $\\delta$ 会约掉。', ch: 'ch06', anchor: 'ch06-s8' },
  { en: 'centroid', zh: '形心', def: '只由形状决定的几何中心，不考虑密度。常用的现成结果：三角形距底 $h/3$，半圆板距直径 $\\frac{4a}{3\\pi}$，半圆弧距圆心 $\\frac{2a}{\\pi}$。', ch: 'ch06', anchor: 'ch06-s8' },

  /* ------------------------------ ch07 超越函数 ------------------------------ */
  { en: 'natural logarithm', zh: '自然对数', def: '把 $\\ln x$ 严格定义为曲线 $\\frac1t$ 从 1 到 $x$ 下方的面积：$\\ln x=\\int_1^x\\frac{dt}{t}$。这样定义之后，它的导数是 $\\frac1x$，也遵循对数的加法规则。', ch: 'ch07', anchor: 'ch07-s4' },
  { en: 'exponential function', zh: '指数函数', def: '$e^x$ 是 $\\ln x$ 的反函数：$\\ln$ 把乘法变成加法，$e^x$ 再把加法变回乘法。它最特别的地方是导数还是自己。', ch: 'ch07', anchor: 'ch07-s5' },
  { en: 'exponential growth', zh: '指数增长', def: '变化速度和当前数量成正比：$\\frac{dP}{dt}=kP$，解出来是 $P=P_0e^{kt}$。$k>0$ 时越长越快，$k\\lt 0$ 时逐渐衰减。', ch: 'ch07', anchor: 'ch07-s6' },
  { en: 'half-life', zh: '半衰期', def: '衰减到原来一半所需的时间，等于 $\\frac{\\ln2}{k}$。它和一开始有多少无关，所以能用来判断年代、算药效。', ch: 'ch07', anchor: 'ch07-s6' },
  { en: "L'Hôpital's rule", zh: '洛必达法则', def: '遇到 $\\frac00$ 或 $\\frac{\\infty}{\\infty}$ 的极限时，可以改成「分子求导除以分母求导」再取极限。每次用之前都要重新确认还是不是未定式。', ch: 'ch07', anchor: 'ch07-s7' },
  { en: 'indeterminate form', zh: '未定式', def: '直接代入得不出结论的七种样子：$\\frac00$、$\\frac{\\infty}{\\infty}$、$0\\cdot\\infty$、$\\infty-\\infty$、$1^\\infty$、$0^0$、$\\infty^0$。要变形或取对数才能算。', ch: 'ch07', anchor: 'ch07-s7' },
  { en: 'inverse trigonometric function', zh: '反三角函数', def: '反三角函数回答「什么角的正弦等于这个数」，比如 $\\arcsin x$。注意 $\\sin^{-1}x$ 表示反函数，不是 $\\frac1{\\sin x}$。', ch: 'ch07', anchor: 'ch07-s8' },
  { en: 'hyperbolic function', zh: '双曲函数', def: '由指数函数拼出来的函数：$\\sinh x=\\frac{e^x-e^{-x}}2$、$\\cosh x=\\frac{e^x+e^{-x}}2$。恒等式和三角很像，但 $\\cosh^2-\\sinh^2=1$ 中间是减号。', ch: 'ch07', anchor: 'ch07-s9' },
  { en: 'relative growth rate', zh: '相对增长率', def: '把「增长得多快」按当前数量平均一下：$\\frac1f\\frac{df}{dx}$。比较谁长得更快时，$\\ln x\\ll x^p\\ll a^x\\ll x^x$ 这条顺序很有用。', ch: 'ch07', anchor: 'ch07-s10' },

  /* ------------------------------ ch08 积分技术 ------------------------------ */
  { en: 'integration by parts', zh: '分部积分', def: '把乘积的求导法则反着用：$\\int u\\,dv=uv-\\int v\\,du$。挑谁当 $u$ 可以照「反－对－幂－指－三」的顺序。', ch: 'ch08', anchor: 'ch08-s4' },
  { en: 'trigonometric integral', zh: '三角积分', def: '三角函数的幂相乘时，奇次幂可以拆一个出来配 $du$，偶次幂用半角公式降幂。次数是奇是偶，决定用哪种办法。', ch: 'ch08', anchor: 'ch08-s5' },
  { en: 'trigonometric substitution', zh: '三角代换', def: '看到 $\\sqrt{a^2-x^2}$ 就令 $x=a\\sin\\theta$，看到 $\\sqrt{a^2+x^2}$ 令 $x=a\\tan\\theta$，看到 $\\sqrt{x^2-a^2}$ 令 $x=a\\sec\\theta$。这样根号就消掉了。', ch: 'ch08', anchor: 'ch08-s6' },
  { en: 'partial fractions', zh: '部分分式', def: '把一个复杂分式拆成几个简单分式之和，再分别积分。拆法由分母的因式决定：一次因式配一项，重复因式要从低次配到高次。', ch: 'ch08', anchor: 'ch08-s7' },
  { en: 'numerical integration', zh: '数值积分', def: '算不出原函数时，用有限个点上的函数值近似积分。中点法和梯形法的误差是 $O(h^2)$，辛普森法更准，但要求段数是偶数。', ch: 'ch08', anchor: 'ch08-s9' },
  { en: 'trapezoidal rule', zh: '梯形法', def: '把曲线下方的面积近似成一串梯形：$T_n=\\frac h2\\left[f(x_0)+2f(x_1)+\\cdots+f(x_n)\\right]$。对直线（一次函数）是精确的。', ch: 'ch08', anchor: 'ch08-s9' },
  { en: "Simpson's rule", zh: '辛普森法', def: '用抛物线去贴每一小段曲线，精度比梯形法高：$S_n=\\frac h3\\left[f(x_0)+4f(x_1)+2f(x_2)+\\cdots+f(x_n)\\right]$，段数 $n$ 必须是偶数。', ch: 'ch08', anchor: 'ch08-s9' },
  { en: 'improper integral', zh: '反常积分', def: '积分区间无限长，或者被积函数在某点附近无界（瑕点），都不能直接算，要用极限来定义。内部有瑕点时要拆成两段分别看。', ch: 'ch08', anchor: 'ch08-s10' },
  { en: 'comparison test', zh: '比较判别法', def: '拿一个已知敛散的非负函数作参照：大的收敛，小的必收敛；小的发散，大的必发散。常和 $\\int_1^\\infty\\frac{dx}{x^p}$ 比。', ch: 'ch08', anchor: 'ch08-s10' },

  /* ------------------------------ ch09 无穷序列与级数 ------------------------------ */
  { en: 'sequence', zh: '数列', def: '按顺序排下去的一列数 $\\{a_n\\}$，可以看成定义在正整数上的函数。研究它主要问一件事：往后走，它是不是越来越靠近某个数。', ch: 'ch09', anchor: 'ch09-s3' },
  { en: 'series', zh: '级数', def: '把一列数无限地加起来：$\\sum_{n=1}^\\infty a_n$。它是否有意义，要看前 $n$ 项之和 $s_n$ 是否趋向某个确定的数。', ch: 'ch09', anchor: 'ch09-s4' },
  { en: 'partial sum', zh: '部分和', def: '前 $n$ 项加起来的结果 $s_n=a_1+\\cdots+a_n$。级数收敛就是 $s_n$ 有极限；裂项的方法能直接算出 $s_n$。', ch: 'ch09', anchor: 'ch09-s4' },
  { en: 'geometric series', zh: '几何级数', def: '每一项都乘同一个比 $r$ 得到的级数：$\\sum ar^{n-1}$。$|r|\\lt 1$ 时总和收敛到 $\\frac a{1-r}$，否则发散。', ch: 'ch09', anchor: 'ch09-s4' },
  { en: 'p-series', zh: 'p 级数', def: '形如 $\\sum\\frac1{n^p}$ 的级数：$p>1$ 收敛，$p\\le1$ 发散。$p=1$ 就是调和级数，是判断发散最常用的参照物。', ch: 'ch09', anchor: 'ch09-s5' },
  { en: 'integral test', zh: '积分判别法', def: '把一个递减正函数在整数点上的取值当成级数的项。这样级数和曲线下方的面积同收敛、同发散，还能顺带估计误差。', ch: 'ch09', anchor: 'ch09-s5' },
  { en: 'ratio test', zh: '比值判别法', def: '看相邻两项比值的极限 $\\rho=\\lim\\left|\\frac{a_{n+1}}{a_n}\\right|$：小于 1 收敛，大于 1 发散，等于 1 时这个办法失灵。含阶乘或指数时最好用。', ch: 'ch09', anchor: 'ch09-s7' },
  { en: 'root test', zh: '根值判别法', def: '看每项开 $n$ 次根后的极限 $\\rho=\\lim\\sqrt[n]{|a_n|}$：小于 1 收敛，大于 1 发散，等于 1 时失灵。项里带 $n$ 次幂时好用。', ch: 'ch09', anchor: 'ch09-s7' },
  { en: 'alternating series', zh: '交错级数', def: '正负号交替出现的级数。如果每项的绝对值越来越小、最后趋于 0，级数就收敛（Leibniz 判别法）。', ch: 'ch09', anchor: 'ch09-s8' },
  { en: 'absolute convergence', zh: '绝对收敛', def: '把每项取绝对值后，级数仍然收敛，就叫绝对收敛。绝对收敛一定普通收敛，而且求和顺序可以随便换。', ch: 'ch09', anchor: 'ch09-s8' },
  { en: 'power series', zh: '幂级数', def: '形如 $\\sum c_n(x-a)^n$ 的级数，本质是「无限次的多项式」。它有一个收敛半径 $R$，在区间内部一定收敛。', ch: 'ch09', anchor: 'ch09-s9' },
  { en: 'Taylor series', zh: '泰勒级数', def: '用某一点处的所有导数信息，拼出一个幂级数来代表函数。但写出级数不等于它等于函数，还要余项趋向 0 才行。', ch: 'ch09', anchor: 'ch09-s10' },

  /* ------------------------------ ch10 参数方程与极坐标 ------------------------------ */
  { en: 'parametrization', zh: '参数化', def: '用另一个变量 $t$ 分别写出 $x$ 和 $y$，从而描述一条曲线：$x=f(t),\\ y=g(t)$。同一条曲线可以有很多种参数化方式。', ch: 'ch10', anchor: 'ch10-s3' },
  { en: 'parametric curve', zh: '参数曲线', def: '由参数方程给出的曲线。求斜率用 $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$，注意二阶导的分母只用 $\\frac{dx}{dt}$。', ch: 'ch10', anchor: 'ch10-s3' },
  { en: 'cycloid', zh: '摆线', def: '圆沿直线滚动时，圆周上一个固定点画出的轨迹：$x=a(t-\\sin t),\\ y=a(1-\\cos t)$。一拱的弧长是 $8a$，面积是 $3\\pi a^2$。', ch: 'ch10', anchor: 'ch10-s3' },
  { en: 'polar coordinates', zh: '极坐标', def: '用一个点到原点的距离 $r$ 和一个角度 $\\theta$ 来定位，换回直角坐标是 $x=r\\cos\\theta,\\ y=r\\sin\\theta$。同一个点的表示不唯一。', ch: 'ch10', anchor: 'ch10-s5' },
  { en: 'polar equation', zh: '极坐标方程', def: '以 $r=f(\\theta)$ 的形式给出的曲线。画图时先看有没有对称性，再挑几个关键角度算出点。', ch: 'ch10', anchor: 'ch10-s5' },
  { en: 'area in polar coordinates', zh: '极坐标面积', def: '极坐标下一小块扇形的面积是 $\\frac12r^2\\,d\\theta$，所以面积写成 $A=\\frac12\\int r^2\\,d\\theta$。角度区间要正好覆盖要算的那一块。', ch: 'ch10', anchor: 'ch10-s7' },
  { en: 'conic section', zh: '圆锥曲线', def: '圆、椭圆、抛物线、双曲线统称圆锥曲线，都是圆锥被平面切出来的。统一说法是：到焦点的距离，等于离心率乘到准线的距离。', ch: 'ch10', anchor: 'ch10-s8' },
  { en: 'eccentricity', zh: '离心率', def: '离心率 $e=\\frac ca$ 描述曲线「有多像椭圆」：椭圆 $e\\lt 1$，抛物线 $e=1$，双曲线 $e>1$。', ch: 'ch10', anchor: 'ch10-s9' },
  { en: 'directrix', zh: '准线', def: '圆锥曲线定义里那条固定的直线，和焦点一起刻画曲线。焦点在极点、准线是 $x=k$ 时，方程写成 $r=\\frac{ke}{1+e\\cos\\theta}$。', ch: 'ch10', anchor: 'ch10-s9' },

  /* ------------------------------ ch11 向量与空间几何 ------------------------------ */
  { en: 'vector', zh: '向量', def: '既有大小又有方向的量，画成箭头，写成 $\\mathbf v=\\langle v_1,v_2,v_3\\rangle$。它的长度 $|\\mathbf v|$ 要开根号算。', ch: 'ch11', anchor: 'ch11-s4' },
  { en: 'dot product', zh: '点积', def: '衡量两个向量「对齐」程度：$\\mathbf u\\cdot\\mathbf v=|\\mathbf u||\\mathbf v|\\cos\\theta$，结果是数。等于 0 就说明两个向量垂直。', ch: 'ch11', anchor: 'ch11-s5' },
  { en: 'cross product', zh: '叉积', def: '两个向量张成的平行四边形的「有向面积」，结果仍然是向量，方向用右手判定。等于零向量说明两者平行。', ch: 'ch11', anchor: 'ch11-s6' },
  { en: 'scalar projection', zh: '标量投影', def: '把一个向量投影到另一个方向上得到的长度，是一个数：$\\operatorname{comp}_{\\mathbf v}\\mathbf u=\\frac{\\mathbf u\\cdot\\mathbf v}{|\\mathbf v|}$。', ch: 'ch11', anchor: 'ch11-s5' },
  { en: 'vector projection', zh: '向量投影', def: '把向量真正投到另一个方向上的向量，分母是 $|\\mathbf v|^2$。标量投影是它的长度，分母是 $|\\mathbf v|$，两者别弄混。', ch: 'ch11', anchor: 'ch11-s5' },
  { en: 'triple scalar product', zh: '三重积', def: '三个向量一起算出的数 $(\\mathbf u\\times\\mathbf v)\\cdot\\mathbf w$，绝对值是平行六面体的体积。等于 0 说明三个向量共面。', ch: 'ch11', anchor: 'ch11-s6' },
  { en: 'normal vector', zh: '法向量', def: '垂直于平面或曲面的向量。平面方程写成 $a(x-x_0)+b(y-y_0)+c(z-z_0)=0$ 时，$\\langle a,b,c\\rangle$ 就是它的法向量。', ch: 'ch11', anchor: 'ch11-s7' },
  { en: 'quadric surface', zh: '二次曲面', def: '三元二次方程画出的曲面。看有几项平方、符号怎么配，就能认出它是柱面、抛物面、双曲面还是锥面。', ch: 'ch11', anchor: 'ch11-s8' },
  { en: 'trace', zh: '截痕', def: '用坐标平面去切曲面得到的曲线。先画几条截痕，整个曲面的形状就大致清楚了。', ch: 'ch11', anchor: 'ch11-s8' },

  /* ------------------------------ ch12 向量值函数与空间运动 ------------------------------ */
  { en: 'vector-valued function', zh: '向量值函数', def: '输入一个数、输出一个向量的函数，比如空间里的位置 $\\mathbf r(t)$。求极限、导数、积分时，对三个分量分别做就行。', ch: 'ch12', anchor: 'ch12-s3' },
  { en: 'velocity', zh: '速度', def: '位置向量对时间求导，得到速度向量。它既有大小也有方向，方向就是运动方向。', ch: 'ch12', anchor: 'ch12-s3' },
  { en: 'speed', zh: '速率', def: '速度向量的大小 $|\\mathbf v|$，是一个数。速度积分得到位移，速率积分得到走过的总路程。', ch: 'ch12', anchor: 'ch12-s3' },
  { en: 'acceleration', zh: '加速度', def: '速度对时间求导。它可以拆成切向部分 $a_T$（改变快慢）和法向部分 $a_N$（改变方向）。', ch: 'ch12', anchor: 'ch12-s2' },
  { en: 'arc length parameter', zh: '弧长参数', def: '从某个固定点量到当前点的弧长 $s(t)$；用它当参数时，曲线像是「匀速走」出来的。曲率就是切向量对弧长的变化率。', ch: 'ch12', anchor: 'ch12-s4' },
  { en: 'unit tangent vector', zh: '单位切向量', def: '把切向量 $\\mathbf r\\prime$ 除以自己的长度，得到只管方向的单位向量 $\\mathbf T$。切线方向用 $\\mathbf r\\prime$，单位切向量才用 $\\mathbf T$。', ch: 'ch12', anchor: 'ch12-s4' },
  { en: 'curvature', zh: '曲率', def: '曲线在一点「弯得有多厉害」，用单位切向量转动的快慢来衡量：$\\kappa=\\left|\\frac{d\\mathbf T}{ds}\\right|$。直线曲率为 0，圆半径越小越弯。', ch: 'ch12', anchor: 'ch12-s4' },
  { en: 'principal unit normal', zh: '主单位法向量', def: '指向曲线弯曲内侧的单位向量 $\\mathbf N$，和切向量 $\\mathbf T$ 垂直。曲率圆的圆心就沿这个方向。', ch: 'ch12', anchor: 'ch12-s4' },
  { en: 'osculating circle', zh: '密切圆', def: '在一点与曲线贴得最紧的圆：和曲线相切、曲率相同、圆心在弯曲的内侧。半径 $\\rho=\\frac1\\kappa$。', ch: 'ch12', anchor: 'ch12-s4' },
  { en: 'binormal vector', zh: '副法向量', def: '$\\mathbf B=\\mathbf T\\times\\mathbf N$，和切向量、法向量一起组成 $(\\mathbf T,\\mathbf N,\\mathbf B)$ 这套跟着曲线走的坐标架（Frenet 标架）。', ch: 'ch12', anchor: 'ch12-s4' },
  { en: 'torsion', zh: '挠率', def: '曲线离开原来那个平面的趋势，用副法向量的变化率衡量。挠率为 0 说明整条曲线都在同一个平面里。', ch: 'ch12', anchor: 'ch12-s4' },
  { en: 'tangential component', zh: '切向分量', def: '加速度沿切线方向的分量 $a_T$，负责改变快慢，可正可负；法向分量 $a_N$ 负责改变方向，永远非负。', ch: 'ch12', anchor: 'ch12-s4' },

  /* ------------------------------ ch13 偏导数 ------------------------------ */
  { en: 'partial derivative', zh: '偏导数', def: '多元函数里，把其他变量都当常数、只对一个变量求导，得到的就是偏导数。几何上相当于沿坐标方向切一刀看斜率。', ch: 'ch13', anchor: 'ch13-s5' },
  { en: 'mixed derivative', zh: '混合偏导', def: '先对 $x$ 再对 $y$ 求导，和先对 $y$ 再对 $x$ 求导，得到的两个二阶偏导。它们连续时就相等。', ch: 'ch13', anchor: 'ch13-s5' },
  { en: "Clairaut's theorem", zh: '克莱罗定理', def: '如果两个混合偏导 $f_{xy}$ 和 $f_{yx}$ 都连续，那么它们相等。用之前要先说明「偏导连续」这个前提。', ch: 'ch13', anchor: 'ch13-s5' },
  { en: 'level curve', zh: '等值线', def: '让函数值保持同一个常数的那些点连成的线 $f(x,y)=c$，像地图上的等高线。梯度永远和它垂直。', ch: 'ch13', anchor: 'ch13-s3' },
  { en: 'gradient', zh: '梯度', def: '把各个偏导排成一个向量 $\\nabla f=\\langle f_x,f_y\\rangle$。它指向函数增长最快的方向，长度就是最大变化率。', ch: 'ch13', anchor: 'ch13-s7' },
  { en: 'directional derivative', zh: '方向导数', def: '沿某个方向走时的变化率：$D_{\\mathbf u}f=\\nabla f\\cdot\\mathbf u$。方向向量要先化成单位向量，不然算出的不是「每单位长度」的变化。', ch: 'ch13', anchor: 'ch13-s7' },
  { en: 'tangent plane', zh: '切平面', def: '多元函数在某点的「切平面」，是一元函数切线的推广。曲面 $z=f(x,y)$ 的切平面，用两个偏导 $f_x,f_y$ 当斜度。', ch: 'ch13', anchor: 'ch13-s8' },
  { en: 'total differential', zh: '全微分', def: '$df=f_x\\,dx+f_y\\,dy$，表示自变量各动一点点时函数值大约变多少。它是整体的变化，不是单独某一项的偏导。', ch: 'ch13', anchor: 'ch13-s8' },
  { en: 'saddle point', zh: '鞍点', def: '一个方向看是最高点、另一个方向看是最低点，形状像马鞍。判别式 $D=f_{xx}f_{yy}-f_{xy}^2\\lt 0$ 时出现。', ch: 'ch13', anchor: 'ch13-s9' },
  { en: 'Lagrange multipliers', zh: '拉格朗日乘子', def: '在约束条件 $g=0$ 下找极值：令 $\\nabla f=\\lambda\\nabla g$，再和约束方程一起解。它只给出候选点，最后还要比较函数值。', ch: 'ch13', anchor: 'ch13-s10' },

  /* ------------------------------ ch14 多重积分 ------------------------------ */
  { en: 'double integral', zh: '二重积分', def: '把平面区域切成小方块，每块用函数值乘面积，全部加起来取极限。它可以算体积、面积和平均值。', ch: 'ch14', anchor: 'ch14-s3' },
  { en: 'iterated integral', zh: '累次积分', def: '把二重积分拆成两次一元积分：先对一个变量积，再对另一个积。里层的上下限可以含外层变量，外层必须是常数。', ch: 'ch14', anchor: 'ch14-s3' },
  { en: "Fubini's theorem", zh: '富比尼定理', def: '在矩形区域上，只要函数连续，两种积分次序算出来的结果一样，可以挑方便的顺序交换。', ch: 'ch14', anchor: 'ch14-s3' },
  { en: 'triple integral', zh: '三重积分', def: '把空间区域切成小方块累加。体积元 $dV$ 在不同坐标系里写法不同：直角坐标 $dz\\,dy\\,dx$、柱面 $r\\,dz\\,dr\\,d\\theta$、球面 $\\rho^2\\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta$。', ch: 'ch14', anchor: 'ch14-s7' },
  { en: 'cylindrical coordinates', zh: '柱面坐标', def: '把平面部分换成极坐标、$z$ 保持不变：$x=r\\cos\\theta,\\ y=r\\sin\\theta$，体积元是 $r\\,dz\\,dr\\,d\\theta$。适合绕 $z$ 轴对称的区域。', ch: 'ch14', anchor: 'ch14-s9' },
  { en: 'spherical coordinates', zh: '球面坐标', def: '$\\rho$ 是到原点的距离，$\\phi$ 是与 $z$ 轴的夹角，$\\theta$ 是方位角。体积元是 $\\rho^2\\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta$。', ch: 'ch14', anchor: 'ch14-s9' },
  { en: 'Jacobian', zh: '雅可比行列式', def: '换元时面积（体积）被拉伸或压缩的倍数，写成行列式 $J=\\frac{\\partial(x,y)}{\\partial(u,v)}$。积分里要乘它的绝对值。', ch: 'ch14', anchor: 'ch14-s10' },
  { en: 'change of variables', zh: '换元（变量代换）', def: '把难算的区域换成好算的坐标系：先定新区域 $G$，再算雅可比 $|J|$，然后在新变量下积分。', ch: 'ch14', anchor: 'ch14-s10' },
  { en: 'moment of inertia', zh: '转动惯量', def: '衡量物体「转起来有多费劲」，是质量乘上到转轴距离的平方再积分。离轴越远的点贡献越大。', ch: 'ch14', anchor: 'ch14-s8' },
  { en: 'joint probability density', zh: '联合概率密度', def: '两个随机变量一起取值时的概率分布，密度 $f(x,y)$ 非负、全平面二重积分为 1。落在某个区域 $R$ 的概率，就是 $f$ 在 $R$ 上的二重积分。', ch: 'ch14', anchor: 'ch14-s8' },

  /* ------------------------------ ch15 积分与向量场 ------------------------------ */
  { en: 'line integral', zh: '线积分', def: '沿一条曲线做积分。第一类 $\\int_C f\\,ds$ 对弧长积，和方向无关；第二类 $\\int_C\\mathbf F\\cdot d\\mathbf r$ 有方向，反向要变号。', ch: 'ch15', anchor: 'ch15-s3' },
  { en: 'vector field', zh: '向量场', def: '空间（或平面）每一点都放一个箭头，整体形成「场」，比如风速、电磁场。研究它主要看沿曲线累积多少、穿过曲面多少。', ch: 'ch15', anchor: 'ch15-s4' },
  { en: 'circulation', zh: '环量', def: '向量场沿闭曲线绕一圈的累积量 $\\oint_C\\mathbf F\\cdot d\\mathbf r$，量的是「绕着转」的趋势。', ch: 'ch15', anchor: 'ch15-s4' },
  { en: 'flux', zh: '通量', def: '向量场穿过曲线或曲面的总量，用它与法向的夹角来算：$\\iint_S\\mathbf F\\cdot\\mathbf n\\,d\\sigma$。', ch: 'ch15', anchor: 'ch15-s4' },
  { en: 'conservative field', zh: '保守场', def: '能写成某个标量函数梯度的场 $\\mathbf F=\\nabla f$。它沿任何闭曲线的环量都是 0，积分只和起点、终点有关。', ch: 'ch15', anchor: 'ch15-s5' },
  { en: 'potential function', zh: '势函数', def: '保守场对应的那个「高度函数」$f$，满足 $\\nabla f=\\mathbf F$。求法是逐次积分，再比较偏导定出积分常数。', ch: 'ch15', anchor: 'ch15-s5' },
  { en: 'path independence', zh: '路径无关', def: '线积分的值只取决于起点和终点，与走哪条路无关。它和「场是保守场」说的是同一件事。', ch: 'ch15', anchor: 'ch15-s5' },
  { en: "Green's theorem", zh: '格林定理', def: '平面上的闭环量积分，可以换成它围住区域上的二重积分：$\\oint_C M\\,dx+N\\,dy=\\iint_R(N_x-M_y)\\,dA$。曲线方向要取正向。', ch: 'ch15', anchor: 'ch15-s6' },
  { en: 'surface integral', zh: '曲面积分', def: '沿曲面做积分。标量版本 $\\iint_S G\\,d\\sigma$ 累加曲面上的量，向量版本 $\\iint_S\\mathbf F\\cdot\\mathbf n\\,d\\sigma$ 算通量。', ch: 'ch15', anchor: 'ch15-s6' },
  { en: 'orientation', zh: '定向', def: '给曲面选一个「正面」，也就是法向量朝哪边。通量和 Stokes 定理都要先定方向，闭曲面通常取外法向。', ch: 'ch15', anchor: 'ch15-s6' },
  { en: 'curl', zh: '旋度', def: '描述向量场在某点「打转」的强弱和转轴方向：$\\nabla\\times\\mathbf F$，结果是向量。梯度场的旋度恒为 0。', ch: 'ch15', anchor: 'ch15-s7' },
  { en: 'divergence', zh: '散度', def: '描述向量场在某点是往外涌还是往里吸：$\\nabla\\cdot\\mathbf F$，结果是数。正的像源，负的像汇。', ch: 'ch15', anchor: 'ch15-s8' },
  { en: "Stokes' theorem", zh: '斯托克斯定理', def: '沿闭曲线的环量，等于以这条曲线为边界的曲面上旋度的通量：$\\oint_C\\mathbf F\\cdot d\\mathbf r=\\iint_S(\\nabla\\times\\mathbf F)\\cdot\\mathbf n\\,d\\sigma$。', ch: 'ch15', anchor: 'ch15-s7' },
  { en: 'divergence theorem', zh: '散度定理（高斯定理）', def: '穿过闭曲面的通量，等于曲面围住区域里散度的体积分：$\\oiint_S\\mathbf F\\cdot\\mathbf n\\,d\\sigma=\\iiint_D\\nabla\\cdot\\mathbf F\\,dV$。曲面要闭合，法向取朝外。', ch: 'ch15', anchor: 'ch15-s8' },

  /* ------------------------------ ch16 一阶微分方程 ------------------------------ */
  { en: 'differential equation', zh: '微分方程', def: '含有未知函数及其导数的方程。它的解不是数，而是函数；通常还要配一个初始条件才能唯一确定。', ch: 'ch16', anchor: 'ch16-s3' },
  { en: 'initial value problem', zh: '初值问题', def: '微分方程加上一个初始条件，比如 $y(x_0)=y_0$。先用通解带一个常数，再用初值把这个常数定出来。', ch: 'ch16', anchor: 'ch16-s3' },
  { en: 'slope field', zh: '斜率场', def: '在平面上每一点画出斜率 $y\\prime=f(x,y)$ 的小线段，所有可能的解曲线都要顺着这些方向走。', ch: 'ch16', anchor: 'ch16-s3' },
  { en: "Euler's method", zh: '欧拉法', def: '数值解微分方程最简单的办法：从初始点出发，沿当前斜率走一小步，再按新位置的斜率走下一步。步长越小越准。', ch: 'ch16', anchor: 'ch16-s3' },
  { en: 'separable equation', zh: '可分离变量方程', def: '能把 $x$ 和 $y$ 分到等号两边的方程：$\\frac{dy}{g(y)}=f(x)\\,dx$，两边分别积分即可。', ch: 'ch16', anchor: 'ch16-s4' },
  { en: 'first-order linear equation', zh: '一阶线性方程', def: '标准形是 $y\\prime+P(x)y=Q(x)$。乘上一个积分因子 $\\mu=e^{\\int P\\,dx}$，左边就能凑成一个乘积的导数。', ch: 'ch16', anchor: 'ch16-s4' },
  { en: 'integrating factor', zh: '积分因子', def: '乘上去以后能把左边变成 $(\\mu y)\\prime$ 的因子 $\\mu(x)=e^{\\int P\\,dx}$。它只和 $P$ 有关。', ch: 'ch16', anchor: 'ch16-s4' },
  { en: 'orthogonal trajectories', zh: '正交轨线', def: '和原来那一族曲线处处垂直的另一族曲线。做法是把原斜率换成它的负倒数，再解新的微分方程。', ch: 'ch16', anchor: 'ch16-s4' },
  { en: 'logistic equation', zh: 'logistic 方程', def: '先快后慢、有上限的增长模型：$\\frac{dP}{dt}=rP(M-P)$。上限是 $M$，增长最快的位置在 $P=\\frac M2$。', ch: 'ch16', anchor: 'ch16-s6' },
  { en: 'equilibrium value', zh: '平衡值', def: '自治方程 $y\\prime=g(y)$ 中让 $g(y_0)=0$ 的值，系统停在那里就不动了。看 $g\\prime$ 的符号能判断它稳不稳。', ch: 'ch16', anchor: 'ch16-s6' },
  { en: 'phase plane', zh: '相平面', def: '用两个状态变量作坐标画出的平面，轨迹往哪走由 $x\\prime$、$y\\prime$ 的符号决定。用来观察两个量长期的相互关系。', ch: 'ch16', anchor: 'ch16-s7' },

  /* ------------------------------ ch17 二阶微分方程 ------------------------------ */
  { en: 'second-order linear equation', zh: '二阶线性方程', def: '含二阶导数的线性方程 $ay\\prime\\prime+by\\prime+cy=G(x)$。右端为 0 叫齐次，不为 0 叫非齐次。', ch: 'ch17', anchor: 'ch17-s3' },
  { en: 'homogeneous equation', zh: '齐次方程', def: '右端为 0 的线性方程。只要找到两个「线性无关」的解，它们的任意线性组合就是全部解。', ch: 'ch17', anchor: 'ch17-s3' },
  { en: 'characteristic equation', zh: '特征方程（辅助方程）', def: '把 $y=e^{rx}$ 代入常系数齐次方程，就得到 $ar^2+br+c=0$。解这个二次方程，对应三种不同形式的通解。', ch: 'ch17', anchor: 'ch17-s3' },
  { en: 'general solution', zh: '通解', def: '含有足够多个任意常数的解，能把所有解都包进去。二阶齐次方程的通解带两个常数 $c_1,c_2$。', ch: 'ch17', anchor: 'ch17-s3' },
  { en: 'particular solution', zh: '特解', def: '非齐次方程的一个不带常数的解 $y_p$。用它加上齐次通解，就得到非齐次方程的全部解。', ch: 'ch17', anchor: 'ch17-s4' },
  { en: 'method of undetermined coefficients', zh: '待定系数法', def: '按右端 $G(x)$ 的样子猜一个解（多项式、指数、正余弦成对），把系数留成未知数去定。猜的项和齐次解重复时，要乘 $x$ 或 $x^2$。', ch: 'ch17', anchor: 'ch17-s4' },
  { en: 'variation of parameters', zh: '参数变易法', def: '让齐次解里的常数变成函数 $v_1(x),v_2(x)$，代入非齐次方程解出它们。它对各种右端都适用。', ch: 'ch17', anchor: 'ch17-s4' },
  { en: 'Wronskian', zh: '朗斯基行列式', def: '$W=y_1y_2\\prime-y_1\\prime y_2$，用来判断两个解是否线性无关：不为 0 就无关。参数变易法里它是分母。', ch: 'ch17', anchor: 'ch17-s4' },
  { en: 'Euler equation', zh: '欧拉方程', def: '$ax^2y\\prime\\prime+bxy\\prime+cy=0$ 这种「系数是幂次」的方程。它的指标方程是 $ar(r-1)+br+c=0$，也可以代换 $x=e^z$ 化成常系数。', ch: 'ch17', anchor: 'ch17-s6' },
  { en: 'simple harmonic motion', zh: '简谐运动', def: '没有阻尼的弹簧振动：$my\\prime\\prime+ky=0$。解是正弦与余弦的组合，振幅和周期由初始条件决定。', ch: 'ch17', anchor: 'ch17-s5' },
  { en: 'damping', zh: '阻尼', def: '带阻力的振动：$y\\prime\\prime+2\\beta y\\prime+\\omega^2y=0$。比较 $\\beta$ 和 $\\omega$ 的大小，分成过阻尼、临界阻尼、欠阻尼三种情况。', ch: 'ch17', anchor: 'ch17-s5' },

  /* ------------------------------ ch18 附录 A ------------------------------ */
  { en: 'absolute value', zh: '绝对值', def: '$|x|$ 表示到原点的距离，等于 $\\sqrt{x^2}$。$|x|\\lt a$ 表示 $x$ 落在 $-a$ 和 $a$ 之间，$|x|>a$ 则要拆成两支写。', ch: 'ch18', anchor: 'ch18-s3' },
  { en: 'triangle inequality', zh: '三角不等式', def: '$|a+b|\\le|a|+|b|$：两段路合起来走，不会比分开走更远。它是估计误差、证明极限的基本工具。', ch: 'ch18', anchor: 'ch18-s3' },
  { en: 'mathematical induction', zh: '数学归纳法', def: '证明「对所有正整数都成立」的套路：先验第一个，再假设第 $k$ 个成立，并证明第 $k+1$ 个也成立。', ch: 'ch18', anchor: 'ch18-s4' },
  { en: 'complex number', zh: '复数', def: '$z=a+bi$，其中 $i^2=-1$。它可以看成平面上的一个点，长度 $|z|=\\sqrt{a^2+b^2}$，共轭是 $\\bar z=a-bi$。', ch: 'ch18', anchor: 'ch18-s9' },
  { en: "Euler's formula", zh: '欧拉公式', def: '$e^{i\\theta}=\\cos\\theta+i\\sin\\theta$，把指数和三角连在一起。微分方程解出复根时，用它把结果化回实函数。', ch: 'ch18', anchor: 'ch18-s9' },
  { en: 'probability density function', zh: '概率密度函数', def: '描述连续型随机变量的概率分布：非负、全积分为 1。落在某个区间上的概率，就是密度在这个区间上的积分。', ch: 'ch18', anchor: 'ch18-s10' },
  { en: 'increment theorem', zh: '增量定理', def: '把「可微」写成能计算的形式：$\\Delta z=f_x\\Delta x+f_y\\Delta y+\\varepsilon_1\\Delta x+\\varepsilon_2\\Delta y$，其中误差项比 $\\Delta x,\\Delta y$ 更快趋于 0。', ch: 'ch18', anchor: 'ch18-s12' },
  { en: 'mixed derivative theorem', zh: '混合偏导定理', def: '两个混合偏导都连续时它们相等。这是「求导次序可以交换」的正式说法，也是 $\\nabla\\times\\nabla f=\\mathbf 0$ 的依据。', ch: 'ch18', anchor: 'ch18-s12' },

  /* ------------------------------ ch19 全书公式速查表 ------------------------------ */
  { en: 'formula reference', zh: '公式速查表', def: '把所有常用公式集中在一页，按「长什么样」分类，方便做题时反查。它不是新知识，是随手可查的工具。', ch: 'ch19', anchor: 'ch19-s1' },
  { en: 'reduction formula', zh: '递推公式', def: '把高次幂的积分用低次幂表示出来的公式，反复用可以一路降到能直接积的形式。', ch: 'ch19', anchor: 'ch19-s16' },
  { en: 'integration table', zh: '积分表', def: '把各种常见形式的积分结果列成表，按被积函数的形状查：含 $ax+b$、$a^2+x^2$、根号、三角幂等。', ch: 'ch19', anchor: 'ch19-s6' }

]);
