/* =====================================================================
 * ch03.js · 第 3 章「随机变量与分布：离散、连续与变换」
 * 职责：把实验结果映射成数；用 pmf/pdf/cdf 描述分布；给出常见分布族；
 *       掌握变量变换的三种办法（单调、累积法、雅可比）。
 * 依据：Hogg & Tanis 第 9 版 §2.1–2.4、§3.1–3.3；STA2001 Lecture 05–09。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch03',
  num: '03',
  title: '随机变量与分布：离散、连续与变换',
  en: 'RANDOM VARIABLES & DISTRIBUTIONS',
  goals: [
    '把随机试验的结果映射成随机变量，并写出它的分布函数 <code>F(x)</code>',
    '区分离散型的 pmf 与连续型的 pdf，说明为什么连续型单点概率为 0 却仍可能发生',
    '识别二项、几何、泊松、均匀、指数、正态六个常见分布，并说出各自的适用场景',
    '用单调变换、累积分布法与雅可比三种办法求变换后变量的分布',
    '对正态变量做标准化，并用标准正态表计算任意区间的概率'
  ],
  kp: [
    { id: 'ch03-1', title: '随机变量与分布函数' },
    { id: 'ch03-2', title: '离散型：概率质量函数' },
    { id: 'ch03-3', title: '连续型：概率密度函数' },
    { id: 'ch03-4', title: '六个常见分布族' },
    { id: 'ch03-5', title: '变量变换：单调、累积法、雅可比' },
    { id: 'ch03-6', title: '正态分布与标准化' },
    { id: 'ch03-7', title: '指数分布与无记忆性' },
    { id: 'ch03-8', title: '常见错误与自检方法' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么要把结果变成数', html: '样本空间里的结果可能是「正面」「次品」「下雨」，这些符号没法做加减乘除，也没法算期望。随机变量（random variable）做的事只有一件：<b>给每个结果贴一个数</b>。一旦贴上数，就能求和、积分、比较大小，于是「概率」变成了「分布的图形」，后面所有期望、方差、抽样分布才有落脚点。这一章是整门课从「集合」转向「函数」的转折。' },

    { t: 'p', lead: true, html: '本章的关键词是<b>分布</b>。一个随机变量之所以有用，不是因为它取值多少，而是因为<b>它取各个值的可能性有规律</b>。离散型用概率质量函数逐点列出，连续型用密度函数描述「单位长度上的概率」，两者统一用分布函数 <code>F(x) = P(X ≤ x)</code> 概括。把 <code>F</code> 想成「累积到 x 为止的概率」，后面几乎所有计算都能归到它身上。' },

    { t: 'h', lvl: 2, text: '一、随机变量与分布函数', id: 'ch03-1' },

    { t: 'p', html: '<b>随机变量（random variable, r.v.）</b>是从样本空间到实数的函数 <code>X: S → ℝ</code>。它不是一个会变的数，而是一个「规则」：试验结果一确定，<code>X</code> 的取值就确定。<b>随机性来自试验，不来自 <code>X</code> 本身。</b>例如掷两枚硬币，<code>X</code> = 正面个数，则 <code>X(HH)=2, X(HT)=1, X(TH)=1, X(TT)=0</code>，四个样本点被映到三个数上。' },

    { t: 'p', html: '<b>分布函数（cumulative distribution function, cdf）</b>定义为 <code>F(x) = P(X ≤ x)</code>，对一切实数 <code>x</code> 有定义。它有三条性质：单调不减；右连续；<code>lim<sub>x→-∞</sub>F(x)=0</code>、<code>lim<sub>x→+∞</sub>F(x)=1</code>。任何满足这三条的阶梯或曲线，都对应某个随机变量——这是判断「一个函数能不能当 cdf」的标准。' },

    { t: 'p', html: '用 <code>F</code> 表示区间概率：<code>P(a &lt; X ≤ b) = F(b) - F(a)</code>。注意左端是严格小于、右端是小于等于，因为 <code>F</code> 累积的是「不超过」。对连续型变量，端点取不取等号不影响概率（单点概率为 0），但对离散型影响巨大：<code>P(X = a) = F(a) - F(a<sup>-</sup>)</code>，即跳跃高度。<b>离散型的 <code>F</code> 是阶梯，每一级台阶的高度就是该点的概率。</b>' },

    { t: 'compare', left: { title: '离散型', html: '取值可列（有限或可数无限）。用<b>概率质量函数</b> <code>p(x) = P(X = x)</code> 描述，要求 <code>p(x) ≥ 0</code> 且 <code>Σp(x) = 1</code>。<code>F</code> 是阶梯函数，在取值点跳跃。' }, right: { title: '连续型', html: '取值充满区间。用<b>概率密度函数</b> <code>f(x)</code> 描述，要求 <code>f(x) ≥ 0</code> 且 <code>∫f(x)dx = 1</code>。<code>f(x)</code> 不是概率，可以大于 1；<code>P(X=x)=0</code> 对每个点成立。' } },

    { t: 'p', html: '「密度可以大于 1」是初学最不适应的一点。取 <code>X ~ U(0, 0.5)</code>，密度在区间上恒为 <code>1/0.5 = 2</code>，确实大于 1，但它在任何长度 <code>h</code> 的小区间上的概率约为 <code>2h</code>，仍小于 1。密度是「概率的浓度」，要乘上长度才是概率，就像密度大于 1 的物质每立方米可以超过 1 吨一样。<b>把 <code>f(x)</code> 读成「x 附近单位长度内的概率」就不会误解。</b>' },

    { t: 'callout', kind: 'tip', title: '连续型单点概率为 0，但事件仍会发生', html: '<code>P(X = 0.5) = 0</code> 不代表「<code>X</code> 不可能等于 0.5」。概率为 0 的事件叫<b>零概率事件</b>，不等于不可能事件；概率为 1 的事件也不等于必然事件。这是连续型与离散型最本质的差别，第 1 章「概率是测度」的视角在这里第一次显出威力。' },

    { t: 'h', lvl: 2, text: '二、离散型：概率质量函数', id: 'ch03-2' },

    { t: 'p', html: '离散型随机变量的全部信息就是一张「取值—概率」表：<code>p(x<sub>i</sub>) = P(X = x<sub>i</sub>)</code>。写这张表要满足两条：每个概率非负，总和为 1。<b>归一化是最常用的求解手段</b>：题目给出 <code>p(x) = c·g(x)</code> 的形式，先让 <code>Σc·g(x) = 1</code> 解出 <code>c</code>，再算其他概率。' },

    { t: 'p', html: '举个必须用归一化的例子：<code>X</code> 取 <code>1,2,3</code>，<code>p(k) = c·k</code>。由 <code>c(1+2+3) = 6c = 1</code> 得 <code>c = 1/6</code>，于是 <code>p(1)=1/6, p(2)=1/3, p(3)=1/2</code>。<b>算完回代检查总和是否为 1，这一步不能省</b>——它能抓住绝大多数代数错误。' },

    { t: 'p', html: '离散型的 <code>F</code> 由累加得到：<code>F(x) = Σ<sub>x<sub>i</sub> ≤ x</sub> p(x<sub>i</sub>)</code>。画出来是一组台阶，在 <code>x<sub>i</sub></code> 处向上跳 <code>p(x<sub>i</sub>)</code>。<b>求 <code>P(X &gt; 3)</code> 时不要写成 <code>1 - F(3)</code> 就完事</b>——<code>F(3)</code> 包含 <code>P(X=3)</code>，所以 <code>P(X&gt;3) = 1 - F(3)</code> 是对的（因为 <code>&gt;3</code> 排除了 3），但 <code>P(X ≥ 3) = 1 - F(3) + p(3)</code>。含不含等号，在离散情形下差一个概率。' },

    { t: 'table', head: ['要求', '写法', '提醒'], rows: [
      ['恰好 k 次', '<code>P(X = k) = p(k)</code>', '直接查表或代公式'],
      ['不超过 k', '<code>F(k) = Σ<sub>i≤k</sub> p(i)</code>', '含 k'],
      ['至少 k', '<code>1 - F(k-1)</code>', '注意是 <code>k-1</code>，不是 <code>k</code>'],
      ['严格大于 k', '<code>1 - F(k)</code>', '正好与「至少 k+1」相同'],
      ['介于 a 与 b 之间', '<code>F(b) - F(a-1)</code>', '两端都含时用 <code>a-1</code>']
    ], caption: '离散型的「含不含等号」必须逐字对照' },

    { t: 'h', lvl: 2, text: '三、连续型：概率密度函数', id: 'ch03-3' },

    { t: 'p', html: '连续型随机变量用<b>概率密度函数（probability density function, pdf）</b> <code>f(x)</code> 描述，概率由积分给出：<code>P(a ≤ X ≤ b) = ∫<sub>a</sub><sup>b</sup> f(x)dx</code>，且 <code>F(x) = ∫<sub>-∞</sub><sup>x</sup> f(t)dt</code>。由微积分基本定理，在 <code>f</code> 连续的点上 <code>F′(x) = f(x)</code>。<b>求 <code>f</code> 就是求 <code>F</code> 的导数，求 <code>F</code> 就是积分——这一对互逆操作贯穿全章。</b>' },

    { t: 'p', html: '最常见的连续分布是<b>均匀分布（uniform）</b> <code>X ~ U(a,b)</code>：密度在 <code>(a,b)</code> 上恒为 <code>1/(b-a)</code>，其余为 0。它的概率只与区间长度有关，与位置无关，所以 <code>P(c ≤ X ≤ d) = (d-c)/(b-a)</code>。<b>均匀分布是「完全无知」的数学表达</b>，也是后面做模拟与几何概型的基础。' },

    { t: 'p', html: '第二个是<b>指数分布（exponential）</b> <code>X ~ Exp(λ)</code>：密度 <code>f(x) = λe<sup>-λx</sup></code>（<code>x &gt; 0</code>），分布函数 <code>F(x) = 1 - e<sup>-λx</sup></code>。参数 <code>λ</code> 是「单位时间内的发生率」，均值 <code>1/λ</code>。<b>注意两种参数化</b>：有的教材写 <code>Exp(θ)</code> 且 <code>θ = 1/λ</code> 表示均值，做题时看题目给的是率还是均值，代错就差一个倒数。' },

    { t: 'p', html: '连续型的运算有三条常用规则：<code>P(X = c) = 0</code>；<code>P(a ≤ X ≤ b) = P(a &lt; X &lt; b)</code>（端点无所谓）；<code>P(X &gt; a) = 1 - F(a)</code>。<b>第三条在指数、正态题里最常用</b>，因为 <code>F</code> 通常有现成表达式而积分不易算。' },

    { t: 'h', lvl: 2, text: '四、六个常见分布族', id: 'ch03-4' },

    { t: 'p', html: '这一节把后续各章反复用到的六个分布集中列出。不要试图一次背下全部公式，<b>先记住「什么场景用它」，公式可以在做题时回查</b>；场景判断错了，公式背得再熟也没用。' },

    { t: 'table', head: ['分布', '记号', '场景', 'pmf / pdf'], rows: [
      ['伯努利', '<code>Bern(p)</code>', '一次试验，成功/失败', '<code>p<sup>x</sup>(1-p)<sup>1-x</sup></code>，<code>x=0,1</code>'],
      ['二项', '<code>B(n,p)</code>', '<code>n</code> 次独立重复中成功次数', '<code>C(n,x)p<sup>x</sup>(1-p)<sup>n-x</sup></code>'],
      ['几何', '<code>Geo(p)</code>', '首次成功所需的试验次数', '<code>(1-p)<sup>x-1</sup>p</code>，<code>x=1,2,…</code>'],
      ['泊松', '<code>Poi(λ)</code>', '单位时间/面积内的事件数', '<code>e<sup>-λ</sup>λ<sup>x</sup>/x!</code>，<code>x=0,1,…</code>'],
      ['均匀', '<code>U(a,b)</code>', '区间内完全等可能', '<code>1/(b-a)</code>，<code>a&lt;x&lt;b</code>'],
      ['指数', '<code>Exp(λ)</code>', '等待时间、寿命', '<code>λe<sup>-λx</sup></code>，<code>x&gt;0</code>'],
      ['正态', '<code>N(μ,σ<sup>2</sup>)</code>', '大量独立因素叠加', '<code>(1/√(2πσ<sup>2</sup>))e<sup>-(x-μ)<sup>2</sup>/(2σ<sup>2</sup>)</sup></code>']
    ], caption: '七个（伯努利是二项的特例），场景比公式更重要' },

    { t: 'p', html: '几个必须建立的直觉：<b>二项</b>是「固定次数、数成功」；<b>几何</b>是「不固定次数、等第一次成功」；<b>泊松</b>是「固定时间、数事件」，可以看作 <code>n</code> 很大、<code>p</code> 很小时二项的极限（<code>λ = np</code>）；<b>指数</b>是泊松的「等待时间版本」——事件数服从泊松，相邻事件间隔就服从指数。这层对应关系在第 6 章的更新过程里还会出现。' },

    { t: 'p', html: '关于泊松还有一条实用性质：若 <code>X ~ Poi(λ<sub>1</sub>)</code> 与 <code>Y ~ Poi(λ<sub>2</sub>)</code> 独立，则 <code>X+Y ~ Poi(λ<sub>1</sub>+λ<sub>2</sub>)</code>。这条在第 5 章的卷积里会用，也解释了「两个独立区域的计数可以合并」。<b>但不是所有分布都有这种封闭性，正态有、泊松有、二项（同 <code>p</code>）有，均匀没有</b>——这也是第 5 章要专门讨论线性组合的原因。' },

    { t: 'h', lvl: 2, text: '五、变量变换：单调、累积法、雅可比', id: 'ch03-5' },

    { t: 'p', html: '已知 <code>X</code> 的分布，求 <code>Y = g(X)</code> 的分布，是本章的技术核心。方法有三条，按 <code>g</code> 的性质选用：<b>单调变换用公式法，非单调用累积分布法，多维用雅可比。</b>三者本质相同，都是「把概率搬到新坐标上」，只是搬运工具不同。' },

    { t: 'steps', items: [
      { title: '方法一 · 单调变换的直接公式', html: '若 <code>g</code> 严格单调且可导，反函数为 <code>h = g<sup>-1</sup></code>，则 <code>f<sub>Y</sub>(y) = f<sub>X</sub>(h(y))·|h′(y)|</code>。绝对值保证密度非负；<code>|h′|</code> 是「坐标拉伸的补偿」，因为概率总量不能因换坐标而改变。' },
      { title: '方法二 · 累积分布法', html: '先写 <code>F<sub>Y</sub>(y) = P(Y ≤ y) = P(g(X) ≤ y)</code>，把不等式解成关于 <code>X</code> 的条件，用 <code>F<sub>X</sub></code> 表示，再对 <code>y</code> 求导。<b><code>g</code> 不单调时只能用这条</b>，例如 <code>Y = X<sup>2</sup></code> 要分成 <code>X ≤ -√y</code> 与 <code>X ≤ √y</code> 两支。' },
      { title: '方法三 · 多维的雅可比', html: '两个变量换两个变量时，<code>f<sub>U,V</sub>(u,v) = f<sub>X,Y</sub>(x(u,v), y(u,v))·|J|</code>，其中 <code>J</code> 是逆变换的雅可比行列式。<b>一维的 <code>|h′|</code> 就是 <code>|J|</code> 的特例</b>，理解了一维，多维只是把导数换成行列式。' },
      { title: '收尾 · 检查支撑集', html: '求出密度后必须写明 <code>y</code> 的取值范围，并验证在该范围上积分为 1。<b>最常见的失分是漏写支撑集</b>，导致答案看起来对、实际上不完整。' }
    ] },

    { t: 'p', html: '一个用方法一的例子：设 <code>X ~ U(0,1)</code>，<code>Y = -2ln X</code>。反函数 <code>x = e<sup>-y/2</sup></code>，导数 <code>|dx/dy| = (1/2)e<sup>-y/2</sup></code>，密度 <code>f<sub>X</sub>(x) = 1</code>，于是 <code>f<sub>Y</sub>(y) = (1/2)e<sup>-y/2</sup></code>（<code>y &gt; 0</code>），即 <code>Y ~ Exp(1/2)</code>，均值 2。<b>这条「均匀分布经 <code>-ln</code> 变成指数」的变换是随机数生成的标准做法</b>：计算机只会生成均匀随机数，要生成其他分布，就反解其 cdf。' },

    { t: 'p', html: '一个用方法二的例子：<code>X ~ U(0,1)</code>，<code>Y = X<sup>2</sup></code>。因为 <code>X ≥ 0</code>，<code>F<sub>Y</sub>(y) = P(X<sup>2</sup> ≤ y) = P(X ≤ √y) = √y</code>（<code>0 &lt; y &lt; 1</code>）。求导得 <code>f<sub>Y</sub>(y) = 1/(2√y)</code>。<b>验证：<code>∫<sub>0</sub><sup>1</sup> (2√y)<sup>-1</sup>dy = √y|<sub>0</sub><sup>1</sup> = 1</code>，通过。</b>这条密度在 0 附近趋于无穷，但积分有限，这正是「密度可以无界」的典型。' },

    { t: 'callout', kind: 'warn', title: '变换公式里的绝对值不能省', html: '若 <code>g</code> 递减（如 <code>Y = -X</code>），<code>h′</code> 为负，不加绝对值会得到负密度。<b>物理意义是：概率密度必须是「概率的浓度」，浓度不能为负。</b>另外，非单调变换（如 <code>Y = X<sup>2</sup></code> 当 <code>X</code> 可取负值）不能直接套公式，必须用累积法把两支的概率相加，漏掉一支就少一半。' },

    { t: 'h', lvl: 2, text: '六、正态分布与标准化', id: 'ch03-6' },

    { t: 'p', html: '<b>正态分布（normal distribution）</b> <code>X ~ N(μ, σ<sup>2</sup>)</code> 的密度是钟形曲线，关于 <code>μ</code> 对称，在 <code>μ ± σ</code> 处有拐点。它的分布函数没有初等闭式，所以所有计算都靠<b>标准化（standardization）</b>：令 <code>Z = (X-μ)/σ</code>，则 <code>Z ~ N(0,1)</code>，且 <code>P(X ≤ x) = Φ((x-μ)/σ)</code>，其中 <code>Φ</code> 是标准正态的 cdf。' },

    { t: 'p', html: '标准化为什么成立？因为线性变换保持正态性：若 <code>X ~ N(μ,σ<sup>2</sup>)</code>，则 <code>aX+b ~ N(aμ+b, a<sup>2</sup>σ<sup>2</sup>)</code>。取 <code>a = 1/σ, b = -μ/σ</code> 就得到 <code>N(0,1)</code>。<b>这条「线性变换保持正态」的性质第 5 章还会推广到多维</b>，是整门课最实用的性质之一。' },

    { t: 'table', head: ['区间', '概率（约）', '常用临界值'], rows: [
      ['<code>μ ± 1σ</code>', '0.683', '<code>z<sub>0.1587</sub> = 1</code>'],
      ['<code>μ ± 1.96σ</code>', '0.950', '<code>z<sub>0.025</sub> = 1.96</code>'],
      ['<code>μ ± 2σ</code>', '0.954', '<code>z<sub>0.0228</sub> = 2</code>'],
      ['<code>μ ± 2.58σ</code>', '0.990', '<code>z<sub>0.005</sub> = 2.58</code>'],
      ['<code>μ ± 3σ</code>', '0.997', '<code>z<sub>0.00135</sub> = 3</code>']
    ], caption: '第 7 章的置信区间系数全部来自这张表' },

    { t: 'p', html: '用表时注意两条：<b><code>Φ(-z) = 1 - Φ(z)</code></b>（对称性），以及 <b><code>P(a &lt; X &lt; b) = Φ((b-μ)/σ) - Φ((a-μ)/σ)</code></b>。很多表的表头只给 <code>Φ(z)</code> 对 <code>z &gt; 0</code> 的值，负值要靠对称性换算；如果直接查负值查不到就以为出错，是最可惜的失分。' },

    { t: 'p', html: '正态分布还有一个「经验法则」：落在 <code>μ ± 3σ</code> 之外的概率只有 0.3%，所以工程上把 <code>3σ</code> 当作「异常」的边界。<b>但这条法则依赖正态假设</b>，厚尾分布（如金融收益率）里 <code>3σ</code> 事件远比 0.3% 常见，这就是「黑天鹅」的统计根源。第 4 章的切比雪夫不等式给出不依赖正态的保守界，可以对照着看。' },

    { t: 'h', lvl: 2, text: '七、指数分布与无记忆性', id: 'ch03-7' },

    { t: 'p', html: '指数分布最重要的性质是<b>无记忆性（memoryless property）</b>：<code>P(X &gt; s+t | X &gt; s) = P(X &gt; t)</code>。用中文说：<b>已经等了 <code>s</code> 小时还没等到，再等 <code>t</code> 小时的概率，与从头开始等 <code>t</code> 小时一样。</b>过去的时间被「忘掉」了。' },

    { t: 'p', html: '验证只需一行：<code>P(X&gt;s+t | X&gt;s) = P(X&gt;s+t)/P(X&gt;s) = e<sup>-λ(s+t)</sup>/e<sup>-λs</sup> = e<sup>-λt</sup> = P(X&gt;t)</code>。分子分母都是指数形式，相除时 <code>s</code> 被约掉。<b>离散情形里，几何分布 <code>Geo(p)</code> 也有同样的性质</b>，两者是「连续/离散」的对应版本。' },

    { t: 'p', html: '无记忆性带来一个反直觉的结论：如果灯泡寿命服从指数分布，那么一只已经亮了 1000 小时的灯泡，<b>剩余寿命的分布与全新灯泡完全相同</b>。「旧的不如新的」在这个模型里不成立。现实中灯泡会老化，所以指数分布适合「随机失效」而非「磨损失效」；这也解释了为什么本课第 0 章的灯泡例子要专门讨论指数假设是否合理。' },

    { t: 'callout', kind: 'exam', title: '本章在考试中的四种出场方式', html: '① 给 <code>f(x)</code> 含未知常数，求常数并算区间概率（必考）；② 判断分布类型并写出 pmf/pdf；③ 变量变换求新密度（常与 <code>Y=X<sup>2</sup></code>、<code>Y=e<sup>X</sup></code> 搭配）；④ 正态标准化算概率或反查分位数。<b>第 ③ 类分值最高、失分也最多，务必写清支撑集。</b>' },

    { t: 'h', lvl: 2, text: '八、常见错误与自检方法', id: 'ch03-8' },

    { t: 'table', head: ['错误', '表现', '纠正'], rows: [
      ['把密度当概率', '<code>f(0.5) = 2</code> 就说「概率是 2」', '密度需乘区间长度才是概率'],
      ['离散型含等号错位', '<code>P(X ≥ 2) = 1 - F(2)</code>', '应为 <code>1 - F(1)</code>'],
      ['漏写支撑集', '写出 <code>f<sub>Y</sub>(y)</code> 却不写 <code>y</code> 的范围', '补上范围并验证积分为 1'],
      ['非单调变换直接套公式', '<code>Y=X<sup>2</sup></code> 只用一支', '用累积法把两支相加'],
      ['指数参数混淆', '<code>λ</code> 与 <code>1/λ</code> 用反', '看题目给的是率还是均值'],
      ['正态查表不看正负', '负值直接查不到', '用 <code>Φ(-z)=1-Φ(z)</code>']
    ], caption: '六类错误，其中「漏支撑集」在期中最常见' },

    { t: 'p', html: '自检流程：<b>① 先判断离散还是连续，写出对应的描述函数；② 用归一化条件求未知常数；③ 求概率时确认端点含不含，离散型逐点核对；④ 做变量变换后必须写支撑集并积分验证；⑤ 正态题先标准化再查表，负值用对称性；⑥ 用 <code>F</code> 与 <code>f</code> 互推一遍</b>，两种算法结果一致才交卷。' },

    { t: 'quiz', qid: 'ch03-q1' },
    { t: 'quiz', qid: 'ch03-q2' },
    { t: 'quiz', qid: 'ch03-q3' },

    { t: 'keypoint', items: [
      { title: '随机变量是函数，不是数', html: '<code>X: S → ℝ</code>，把结果映成实数；随机性来自试验，不来自映射本身。' },
      { title: '离散看 pmf，连续看 pdf', html: '<code>p(x)</code> 是概率，<code>f(x)</code> 是浓度；前者求和为 1，后者积分为 1。' },
      { title: '连续型单点概率为 0', html: '<code>P(X=c)=0</code>，所以区间端点取不取等号不影响概率；但离散型会差一个点。' },
      { title: '三个变换方法按 <code>g</code> 的性质选', html: '单调用公式、非单调用累积法、多维用雅可比；三者都是概率守恒。' },
      { title: '正态的一切计算靠标准化', html: '<code>Z=(X-μ)/σ ~ N(0,1)</code>，再查 <code>Φ</code>；负值用 <code>Φ(-z)=1-Φ(z)</code>。' },
      { title: '指数与几何都有无记忆性', html: '<code>P(X&gt;s+t|X&gt;s)=P(X&gt;t)</code>，过去不提供信息。' }
    ] },

    { t: 'checklist', id: 'ch03', items: [
      '我能把掷两枚硬币的「正面个数」写成随机变量，并列出它的 pmf 与 cdf',
      '我能说出 cdf 的三条性质，并用它们判断一个给定函数能否当分布函数',
      '我能解释为什么连续型的密度可以大于 1，以及 <code>P(X=x)=0</code> 的含义',
      '我能由 <code>p(k)=c·k</code> 这类形式用归一化条件解出常数',
      '我能区分二项、几何、泊松的适用场景，并说出指数与泊松的对应关系',
      '我能用单调变换公式求 <code>Y=-2lnX</code> 的分布，并说明 <code>|h′|</code> 的作用',
      '我能用累积分布法求 <code>Y=X<sup>2</sup></code> 的密度，并写清支撑集',
      '我能把任意正态变量标准化，并算出 <code>μ±1.96σ</code> 对应的概率',
      '我能证明指数分布的无记忆性，并解释它对灯泡寿命意味着什么',
      '我做完题会检查支撑集、归一化与 <code>F</code>/<code>f</code> 互推'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 Hogg & Tanis 第 9 版 §2.1–2.4（随机变量、离散分布、连续分布、分布函数）与 §3.1–3.3（常见分布、变量变换），对应 STA2001 Lecture 05–09。常见分布表只列后续章节真正用到的七个，省略了负二项、伽马、贝塔等族，它们会在第 5、6 章按需出现。变换三法中的雅可比只给结论与使用条件，完整推导留给第 5 章的多维情形；指数与几何的无记忆性对照，是讲义里没有明写但考试常考的关联。若你的教材把正态放在第 4 章，按主题检索即可，不影响使用。' }
  ]
});
