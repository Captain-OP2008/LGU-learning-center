/* =====================================================================
 * ch01.js · 第 1 章「随机变量与常见分布：推断的原料」
 * 职责：把概率论里真正会用到的部分重新组织一遍——分布怎么描述、
 *       期望方差怎么算、常见分布长什么样、函数的分布怎么求、联合与条件怎么用。
 * 依据：STA2002 讲义概率复习部分与期末卷第一类计算题（分布、期望、变换）。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch01',
  num: '01',
  title: '随机变量与常见分布：推断的原料',
  en: 'RANDOM VARIABLES AND DISTRIBUTIONS',
  goals: [
    '写出随机变量的分布函数，并说明它为什么能唯一确定分布',
    '用期望与方差的性质快速计算线性变换与独立和的均值、方差',
    '默写八个常见分布的密度或质量函数、均值与方差，并说出各自的典型场景',
    '用分布函数法与变量替换法求随机变量函数的分布',
    '用协方差、相关系数与条件期望处理二维问题，判断独立与不相关的关系'
  ],
  kp: [
    { id: 'ch01-1', title: '随机变量、分布函数与两类分布' },
    { id: 'ch01-2', title: '期望、方差与矩' },
    { id: 'ch01-3', title: '常见离散分布' },
    { id: 'ch01-4', title: '常见连续分布' },
    { id: 'ch01-5', title: '随机变量函数的分布' },
    { id: 'ch01-6', title: '联合分布、独立性与条件期望' },
    { id: 'ch01-7', title: '常见错误与解题模板' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么推断要从分布讲起', html: '统计推断的每一个公式，背后都站着一个分布假设。置信区间为什么乘 <code>t<sub>n−1</sub></code> 而不是 1.96？因为样本均值标准化之后服从 t 分布。检验统计量为什么在 H₀ 下服从 χ²？因为它是正态平方和。如果你只会背公式、不知道分布的名字，题目稍一变形就无从下手。这一章不是把概率论重学一遍，而是把<b>后面七章真正会用到的部分</b>挑出来，练到能随手写出密度、算出期望、求出函数的分布。' },

    { t: 'p', lead: true, html: '先看一个具体落差。概率论课上，题目会告诉你 <code>X ~ N(10, 4)</code>，让你算 <code>P(X &gt; 12)</code>；统计推断里，题目只给你 25 个观测值，然后问「μ 是不是 10」。要跨过这一步，你必须先能<b>把「数据 + 模型」翻译成一个分布</b>：样本均值 X̄ 服从什么？它的标准差是多少？未知参数换掉之后分布变不变？这一章把翻译所需的词汇与工具备齐。' },

    { t: 'h', lvl: 2, text: '一、随机变量、分布函数与两类分布', id: 'ch01-1' },

    { t: 'p', html: '随机变量（random variable）是从样本空间到实数的函数：它把「掷三次硬币」这种结果映射成一个数，例如正面次数。一旦映射完成，我们就不再关心原始结果，只关心这个数取各值的可能性。描述这种可能性的统一工具是<b>分布函数（cumulative distribution function, CDF）</b>：<code>F(x) = P(X ≤ x)</code>，它对所有实数有定义，单调不减、右连续，且 <code>F(−∞) = 0</code>、<code>F(+∞) = 1</code>。' },

    { t: 'p', html: '离散型随机变量用概率质量函数（pmf）<code>p(x) = P(X = x)</code> 描述，要求每个 <code>p(x) ≥ 0</code> 且所有可能取值的概率之和为 1。连续型随机变量用概率密度函数（pdf）<code>f(x)</code> 描述，要求 <code>f(x) ≥ 0</code> 且全轴积分为 1，而概率由积分给出：<code>P(a &lt; X ≤ b) = ∫<sub>a</sub><sup>b</sup> f(x) dx</code>。两者最容易混的一点是：<b>密度不是概率</b>，<code>f(x)</code> 可以大于 1（例如 Uniform(0, 0.5) 的密度恒为 2），也可以在某点取任意值而不影响分布。' },

    { t: 'table', caption: '三个函数各管什么：读题时先看它给的是哪一个', head: ['对象', '离散型', '连续型', '关键性质'], rows: [
      ['pmf / pdf', '<code>p(x) = P(X = x)</code>', '<code>f(x) = F′(x)</code>（几乎处处）', '非负；离散求和为 1，连续积分为 1'],
      ['CDF', '<code>F(x) = Σ<sub>t≤x</sub> p(t)</code>', '<code>F(x) = ∫<sub>−∞</sub><sup>x</sup> f(t) dt</code>', '单调不减、右连续、两端极限 0 与 1'],
      ['区间概率', '<code>P(a &lt; X ≤ b) = Σ p(t)</code>', '<code>P(a &lt; X ≤ b) = F(b) − F(a)</code>', '连续型时端点开闭不影响结果'],
      ['单点概率', '<code>P(X = x) = p(x)</code> 可正', '<code>P(X = x) = 0</code>', '连续型单点概率为零，别用密度代替']
    ] },

    { t: 'callout', kind: 'tip', title: '拿到一个密度，先做两件事', html: '第一，<b>写清支撑集</b>（support）：<code>f(x) = 2x</code> 只在 <code>0 &lt; x &lt; 1</code> 上成立，别的地方是 0。第二，<b>验一下积分是否为 1</b>：<code>∫<sub>0</sub><sup>1</sup> 2x dx = 1</code>，通过。这两步花不到半分钟，却能挡住后面 80% 的积分区间错误——尤其是求 <code>E(X)</code> 时把积分下限写成 −∞。' },

    { t: 'quiz', qid: 'ch01-q1' },

    { t: 'h', lvl: 2, text: '二、期望、方差与矩', id: 'ch01-2' },

    { t: 'p', html: '期望（expectation）是加权平均：离散时 <code>E(X) = Σ x p(x)</code>，连续时 <code>E(X) = ∫ x f(x) dx</code>。更一般地，对函数 <code>g</code> 有 <code>E[g(X)] = Σ g(x)p(x)</code> 或 <code>∫ g(x)f(x)dx</code>——注意这里是<b>先变换再平均</b>，不是「先平均再变换」，<code>E[g(X)] ≠ g(E[X])</code> 一般成立（等号只在 g 为线性时成立，这就是 Jensen 不等式要说的方向问题）。' },

    { t: 'p', html: '方差（variance）度量围绕均值的离散程度：<code>Var(X) = E[(X − μ)²] = E(X²) − [E(X)]²</code>。后一个等号是手算时最常用的形式，因为 <code>E(X²)</code> 往往比 <code>E[(X−μ)²]</code> 好算。标准差 <code>σ = √Var(X)</code> 与 X 同量纲，报告结果时通常用它。' },

    { t: 'table', caption: '四条必须形成条件反射的性质', head: ['性质', '表达式', '什么时候会用'], rows: [
      ['线性', '<code>E(aX + b) = aE(X) + b</code>', '标准化、把单位从小时换成分钟'],
      ['方差缩放', '<code>Var(aX + b) = a²Var(X)</code>', '求 <code>Var(X̄) = σ²/n</code> 的关键一步'],
      ['独立可加', '<code>Var(X + Y) = Var(X) + Var(Y)</code>（独立时）', '样本和、两次测量的合成误差'],
      ['一般不独立', '<code>Var(X + Y) = VarX + VarY + 2Cov(X,Y)</code>', '配对数据、同一对象的重复测量']
    ] },

    { t: 'p', html: '一个具体算例：设 <code>X</code> 的均值 10、方差 4，令 <code>Y = 3X − 2</code>。则 <code>E(Y) = 3 × 10 − 2 = 28</code>，<code>Var(Y) = 9 × 4 = 36</code>，<code>SD(Y) = 6</code>。注意常数项只平移均值，不改变方差；系数 3 进入方差时要平方。这两个动作在后面的标准化 <code>Z = (X̄ − μ)/(σ/√n)</code> 里会反复出现：减均值、除标准差，方差被压成 1。' },

    { t: 'callout', kind: 'warn', title: '方差的两个高频错误', html: '<b>错误一：</b>写 <code>Var(3X) = 3Var(X)</code>。正确是 <code>9Var(X)</code>，因为偏差被放大了 3 倍，平方之后是 9 倍。<br><b>错误二：</b>不管独立与否都写 <code>Var(X + Y) = VarX + VarY</code>。若两者正相关，真实方差更大；配对设计的配对 t 检验正是利用了「差值方差里协方差被消掉」这一点，才比两独立样本更灵敏。' },

    { t: 'h', lvl: 2, text: '三、常见离散分布', id: 'ch01-3' },

    { t: 'p', html: '离散分布里，本课高频出现的是四个：伯努利、二项、泊松、几何。它们的共同点是「数次数」或「数次数直到成功」，区别在于试验次数是固定的还是随机的。伯努利（Bernoulli）是一次试验的成功指示，参数 <code>p</code>；二项（Binomial）是 n 次独立伯努利的和，参数 <code>(n, p)</code>；泊松（Poisson）是单位时间或单位面积内稀有事件的发生次数，参数 <code>λ</code>；几何（Geometric）是首次成功所需的试验次数，参数 <code>p</code>。' },

    { t: 'table', caption: '常见离散分布：均值与方差要背，场景要能对上', head: ['分布', '参数', 'pmf', '均值', '方差', '典型场景'], rows: [
      ['Bernoulli', '<code>p</code>', '<code>p<sup>x</sup>(1−p)<sup>1−x</sup></code>', '<code>p</code>', '<code>p(1−p)</code>', '一次抽检是否合格'],
      ['Binomial', '<code>n, p</code>', '<code>C(n,x)p<sup>x</sup>(1−p)<sup>n−x</sup></code>', '<code>np</code>', '<code>np(1−p)</code>', '10 件产品中的次品数'],
      ['Poisson', '<code>λ</code>', '<code>e<sup>−λ</sup>λ<sup>x</sup>/x!</code>', '<code>λ</code>', '<code>λ</code>', '一小时内到达的顾客数'],
      ['Geometric', '<code>p</code>', '<code>(1−p)<sup>x−1</sup>p</code>', '<code>1/p</code>', '<code>(1−p)/p²</code>', '首次命中目标要打几枪']
    ] },

    { t: 'p', html: '算一个泊松的例子。设某路口每小时事故数 <code>X ~ Poisson(3)</code>，则 <code>P(X = 2) = e<sup>−3</sup>3²/2! = 9e<sup>−3</sup>/2 ≈ 0.224</code>。再算 <code>P(X ≥ 1) = 1 − P(X = 0) = 1 − e<sup>−3</sup> ≈ 0.950</code>。「至少一次」用补事件，是这类题的标准起手式。泊松的均值与方差相等（都等于 λ），这个特征常被用来做初步判断：如果样本方差远大于样本均值，可能存在过度离散，纯泊松模型就不合适。' },

    { t: 'p', html: '二项分布则要小心「有放回 / 无放回」。从 100 件含 5 件次品的产品中抽 10 件，若逐件放回，次品数 <code>X ~ Binomial(10, 0.05)</code>；若一次抽 10 件不放回，严格说是超几何分布，但当总体远大于样本时（如 10000 件抽 10 件），二项近似足够好。考试若没说明，按独立同分布（即二项）处理；若题目强调「不放回且总体不大」，就要用超几何。' },

    { t: 'quiz', qid: 'ch01-q2' },

    { t: 'h', lvl: 2, text: '四、常见连续分布', id: 'ch01-4' },

    { t: 'p', html: '连续分布的主干是均匀、指数、正态、伽马四个。均匀分布（Uniform）表示「在区间内完全无偏好」，密度是常数 <code>1/(b−a)</code>；指数分布（Exponential）描述等待时间，密度 <code>λe<sup>−λx</sup></code>（x &gt; 0），有<b>无记忆性</b> <code>P(X &gt; s+t | X &gt; s) = P(X &gt; t)</code>；正态分布（Normal）是后面所有推断的默认模型，密度由 <code>μ</code> 与 <code>σ²</code> 完全决定；伽马分布（Gamma）是指数分布的推广，形状参数 <code>α</code>、率参数 <code>λ</code>，当 <code>α = k</code> 为整数时是 k 个独立指数之和。' },

    { t: 'table', caption: '常见连续分布：注意参数化约定（率 vs 尺度）', head: ['分布', '参数', '密度', '均值', '方差'], rows: [
      ['Uniform(a,b)', '<code>a &lt; b</code>', '<code>1/(b−a)</code>，a &lt; x &lt; b', '<code>(a+b)/2</code>', '<code>(b−a)²/12</code>'],
      ['Exponential(λ)', '<code>λ &gt; 0</code>（率）', '<code>λe<sup>−λx</sup></code>，x &gt; 0', '<code>1/λ</code>', '<code>1/λ²</code>'],
      ['Normal(μ,σ²)', '<code>μ, σ &gt; 0</code>', '<code>(2πσ²)<sup>−1/2</sup>e<sup>−(x−μ)²/(2σ²)</sup></code>', '<code>μ</code>', '<code>σ²</code>'],
      ['Gamma(α,λ)', '<code>α, λ &gt; 0</code>（率）', '<code>λ<sup>α</sup>x<sup>α−1</sup>e<sup>−λx</sup>/Γ(α)</code>', '<code>α/λ</code>', '<code>α/λ²</code>'],
      ['Beta(α,β)', '<code>α, β &gt; 0</code>', '<code>x<sup>α−1</sup>(1−x)<sup>β−1</sup>/B(α,β)</code>，0 &lt; x &lt; 1', '<code>α/(α+β)</code>', '<code>αβ/((α+β)²(α+β+1))</code>']
    ] },

    { t: 'p', html: '正态分布的一切计算都靠标准化：若 <code>X ~ N(μ, σ²)</code>，则 <code>Z = (X − μ)/σ ~ N(0, 1)</code>，从而 <code>P(X ≤ x) = Φ((x − μ)/σ)</code>。经验法则值得记住：<code>P(|X − μ| &lt; σ) ≈ 0.683</code>、<code>P(|X − μ| &lt; 2σ) ≈ 0.954</code>、<code>P(|X − μ| &lt; 3σ) ≈ 0.997</code>。更常用的是两个分位数：<code>z<sub>0.975</sub> = 1.96</code>、<code>z<sub>0.995</sub> = 2.576</code>，它们会在 ch05 的区间公式里反复出现。' },

    { t: 'p', html: '指数分布算一个：设 <code>X ~ Exponential(0.5)</code>（平均等待 2 小时），则 <code>P(X &gt; 2) = e<sup>−0.5×2</sup> = e<sup>−1</sup> ≈ 0.368</code>。若已经等了 2 小时，再等超过 2 小时的概率仍是 <code>e<sup>−1</sup></code>——无记忆性说的是「过去不提供信息」。这条性质在排队论与可靠性里很常见，也是判断「题目能不能用指数模型」的关键：如果设备会老化（越用越容易坏），指数模型就不合适，应该用威布尔或伽马。' },

    { t: 'callout', kind: 'tip', title: '参数化陷阱：λ 是率还是尺度', html: '不同教材对指数分布与伽马分布有两种写法：<code>f(x) = λe<sup>−λx</sup></code>（率参数，均值 1/λ）与 <code>f(x) = (1/β)e<sup>−x/β</sup></code>（尺度参数，均值 β）。本课一律用<b>率参数 λ</b>。做题时先看题目给的是「平均每小时 3 个」还是「平均间隔 1/3 小时」，前者是 λ = 3，后者也是 λ = 3，别把 1/3 直接当 λ 代进去。' },

    { t: 'h', lvl: 2, text: '五、随机变量函数的分布', id: 'ch01-5' },

    { t: 'p', html: '已知 X 的分布，求 <code>Y = g(X)</code> 的分布，有两种标准方法。<b>分布函数法</b>最稳：先写 <code>F<sub>Y</sub>(y) = P(g(X) ≤ y)</code>，把事件翻译成 X 的取值范围，用 X 的分布算出来，再对 y 求导得密度。它适用于任何 g，包括不单调的情形（如 <code>Y = X²</code>）。<b>变量替换法</b>更快：若 g 单调可导，则 <code>f<sub>Y</sub>(y) = f<sub>X</sub>(g<sup>−1</sup>(y)) · |d/dy g<sup>−1</sup>(y)|</code>，那个绝对值就是雅可比因子（Jacobian）。' },

    { t: 'p', html: '举例：设 <code>X ~ N(0,1)</code>，求 <code>Y = X²</code> 的密度。用分布函数法，对 <code>y &gt; 0</code>：<code>F<sub>Y</sub>(y) = P(−√y ≤ X ≤ √y) = 2Φ(√y) − 1</code>，求导得 <code>f<sub>Y</sub>(y) = y<sup>−1/2</sup>φ(√y) = (2πy)<sup>−1/2</sup>e<sup>−y/2</sup></code>，这正是自由度 1 的 χ² 分布。这个结果不是巧合：ch02 里「正态样本的平方和服从 χ²」就是从它推广来的。' },

    { t: 'p', html: '再举一个线性变换：若 <code>X ~ N(μ, σ²)</code>，<code>Y = aX + b</code>（a ≠ 0），则 <code>Y ~ N(aμ + b, a²σ²)</code>。正态分布在仿射变换下封闭，这条性质让「样本均值仍服从正态」变得显然：X̄ 是 X₁…Xₙ 的线性组合，独立正态的线性组合仍是正态，均值与方差按 ch01-2 的性质算即可。' },

    { t: 'callout', kind: 'warn', title: '求函数分布时最常见的两个漏项', html: '<b>漏支撑集。</b><code>Y = X²</code> 只在 <code>y &gt; 0</code> 有密度，写答案时必须注明 <code>y &gt; 0</code>，否则积分到 −∞ 会得到荒谬结果。<br><b>漏雅可比。</b>变量替换时忘记乘 <code>|dx/dy|</code>，密度积分不等于 1，一验就露馅。记忆口诀：<b>换变量要换三样——表达式、支撑集、微分</b>。' },

    { t: 'quiz', qid: 'ch01-q3' },

    { t: 'h', lvl: 2, text: '六、联合分布、独立性与条件期望', id: 'ch01-6' },

    { t: 'p', html: '两个随机变量的联合分布由联合密度 <code>f(x, y)</code> 描述，边缘密度通过对另一个变量积分得到：<code>f<sub>X</sub>(x) = ∫ f(x,y)dy</code>。独立（independence）的定义是联合密度能分解：<code>f(x,y) = f<sub>X</sub>(x)f<sub>Y</sub>(y)</code> 对几乎所有 (x, y) 成立；等价地，<code>P(X ∈ A, Y ∈ B) = P(X ∈ A)P(Y ∈ B)</code> 对一切集合成立。判断独立性优先用「支撑集是不是矩形 + 能否分解」，而不是先算协方差。' },

    { t: 'p', html: '协方差 <code>Cov(X,Y) = E[(X−EX)(Y−EY)] = E(XY) − E(X)E(Y)</code> 度量线性关联的方向与强度，相关系数 <code>ρ = Cov(X,Y)/(σ<sub>X</sub>σ<sub>Y</sub>)</code> 把它归一到 [−1, 1]。要记住一条单向关系：<b>独立 ⇒ 不相关，但不相关 ⇏ 独立</b>。反例：<code>X ~ N(0,1)</code>、<code>Y = X²</code>，两者协方差为 0（因为 <code>E(X³) = 0</code>），但 Y 完全由 X 决定，显然不独立。' },

    { t: 'p', html: '条件期望 <code>E(Y | X)</code> 是 X 的函数，本身也是一个随机变量；对它再取期望就回到无条件期望：<code>E[E(Y|X)] = E(Y)</code>（全期望公式）。方差也有对应的分解：<code>Var(Y) = E[Var(Y|X)] + Var(E[Y|X])</code>，读作「总变异 = 组内变异 + 组间变异」。这条式子是 ch07 方差分析（ANOVA）的理论根据，也是理解「为什么分层能降低方差」的钥匙。' },

    { t: 'p', html: '一个条件期望的算例：设 <code>Y | X = x ~ Poisson(x)</code> 且 <code>X ~ Gamma(2, 1)</code>，则 <code>E(Y|X) = X</code>，于是 <code>E(Y) = E(X) = 2</code>；又 <code>Var(Y|X) = X</code>，所以 <code>Var(Y) = E(X) + Var(X) = 2 + 2 = 4</code>。注意这里 Var(Y) 明显大于 E(Y)，说明混合之后出现了过度离散——这解释了为什么「泊松的均值等于方差」只在同质总体里成立。' },

    { t: 'h', lvl: 2, text: '七、常见错误与解题模板', id: 'ch01-7' },

    { t: 'p', html: '这一节把批改作业时反复出现的错误集中列出来。每一条都写成「错误说法 → 为什么错 → 正确做法」，考前扫一遍比再做十道题管用。' },

    { t: 'table', caption: '六个真实的学生错误（每一条都在作业里出现过）', head: ['错误说法', '错在哪', '正确做法'], rows: [
      ['「密度 f(0.3) = 1.2，所以概率超过 1 了」', '密度不是概率，只有积分才是概率', '概率是 <code>∫<sub>a</sub><sup>b</sup>f</code>，密度可大于 1'],
      ['「E(X²) = (E(X))²」', '只有常数的平方才这样', '<code>E(X²) = Var(X) + (E(X))²</code>'],
      ['「Var(2X) = 2Var(X)」', '缩放系数要平方', '<code>Var(2X) = 4Var(X)</code>'],
      ['「Cov = 0，所以独立」', '不相关只排除线性关系', '要看联合密度能否分解'],
      ['「P(X = 3) = f(3)」', '连续型单点概率为 0', '连续型用 <code>F(b) − F(a)</code> 算区间概率'],
      ['「指数分布无记忆，所以什么都能用」', '无记忆是特有性质，不是普遍规律', '先确认模型假设，老化过程要用别的分布']
    ] },

    { t: 'p', html: '解题模板可以固定成四步：<b>一、写模型</b>（X 服从什么分布、参数是什么、独立吗）；<b>二、写目标</b>（求的是概率、期望、方差，还是函数的分布）；<b>三、选工具</b>（离散求和 / 连续积分 / 性质 / 变换公式）；<b>四、验算</b>（概率是否在 [0,1]、密度积分是否为 1、方差是否非负）。这四步写在卷面上也是得分点，因为阅卷看的是过程而不是最后那个数。' },

    { t: 'terms', items: [
      { en: 'random variable', zh: '随机变量', html: '从样本空间到实数的可测函数；它把随机结果变成一个可以计算的数。' },
      { en: 'cumulative distribution function', zh: '分布函数', html: '<code>F(x) = P(X ≤ x)</code>；单调不减、右连续，唯一确定分布。' },
      { en: 'probability density function', zh: '概率密度函数', html: '连续型随机变量的密度；积分给概率，本身不是概率。' },
      { en: 'expectation', zh: '期望', html: '概率加权的平均值，记作 E(X)；线性运算可交换，非线性不可。' },
      { en: 'variance', zh: '方差', html: '<code>E[(X−μ)²]</code>，度量离散程度；线性变换后要乘系数的平方。' },
      { en: 'Jacobian', zh: '雅可比因子', html: '变量替换时出现的导数绝对值，保证变换后的密度仍积分为 1。' },
      { en: 'conditional expectation', zh: '条件期望', html: '给定 X 后 Y 的平均，记作 <code>E(Y|X)</code>；它本身是 X 的随机函数。' }
    ] },

    { t: 'keypoint', items: [
      { title: '密度不是概率', html: '连续型的概率靠积分；单点概率为零，密度值可以大于 1。' },
      { title: '期望线性，方差平方', html: '<code>E(aX+b) = aE(X)+b</code>，<code>Var(aX+b) = a²Var(X)</code>；这是后面标准化的全部依据。' },
      { title: '八个分布要能默写', html: '伯努利、二项、泊松、几何、均匀、指数、正态、伽马；均值方差与场景一起记。' },
      { title: '求函数分布先写 CDF', html: '分布函数法通杀单调与非单调；变量替换法快，但别忘支撑集与雅可比。' },
      { title: '独立强于不相关', html: '独立 ⇒ 协方差为零；反过来不成立，<code>Y = X²</code> 就是反例。' },
      { title: '全期望与全方差', html: '<code>E[E(Y|X)] = E(Y)</code>，<code>Var(Y) = E[Var(Y|X)] + Var(E[Y|X])</code>，ch07 的 ANOVA 由此而来。' }
    ] },

    { t: 'checklist', id: 'ch01', items: [
      '我能写出分布函数的三个必要条件，并说明它为什么唯一确定分布',
      '我能举出一个密度大于 1 的例子，并解释为什么不矛盾',
      '我能不查表写出八个常见分布的均值与方差',
      '我能用 <code>Var(aX+b) = a²Var(X)</code> 手算一个线性变换的均值与方差',
      '我能用分布函数法求 <code>Y = X²</code>（X 为标准正态）的密度',
      '我能举一个「协方差为零但不独立」的例子并验证',
      '我能写出全期望公式与全方差分解，并说明各项的含义',
      '我能说出指数分布无记忆性的表达式，并判断什么场景不适用',
      '我能列出至少四个本章表格里的常见错误，并说出正确做法'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章按 STA2002 讲义的概率复习主线组织，覆盖随机变量与分布函数、期望与方差、常见离散与连续分布、随机变量函数的分布、联合分布与条件期望五块内容；例题中的数值（泊松 λ = 3、指数 λ = 0.5、<code>Y = X²</code> 的 χ² 推导）均为可手算的课堂级例子，用于衔接 ch02 的抽样分布。往年期末卷中「求密度、求期望、求变换后的分布」一类题的解法与本章模板一致；未涉及测度论细节与特征函数的完整理论，那些超出本课考核范围。' }
  ]
});
