/* =====================================================================
 * ch05.js · 第 5 章「多维随机变量与线性组合」
 * 职责：从一元走向二元——联合、边缘、条件、独立、相关；
 *       掌握线性组合的均值方差与正态的可加性，为第 6 章铺路。
 * 依据：Hogg & Tanis 第 9 版 §4.3–4.6、§5.1–5.3；STA2001 Lecture 12–14。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch05',
  num: '05',
  title: '多维随机变量与线性组合',
  en: 'MULTIVARIATE DISTRIBUTIONS',
  goals: [
    '由联合分布求边缘分布与条件分布，并用条件期望的加权平均还原无条件期望',
    '用「联合密度能否分解为乘积」判断两个变量是否独立，并说清独立与不相关的区别',
    '计算协方差与相关系数，解释相关系数量的是「线性关系」而非「因果关系」',
    '写出 <code>Var(aX+bY)</code> 的完整公式，并在独立与相关两种情形下正确简化',
    '证明独立正态变量之和仍为正态，并用卷积或矩母函数求和的分布'
  ],
  kp: [
    { id: 'ch05-1', title: '联合分布与边缘分布' },
    { id: 'ch05-2', title: '条件分布与条件期望' },
    { id: 'ch05-3', title: '独立性：联合等于乘积' },
    { id: 'ch05-4', title: '协方差与相关系数' },
    { id: 'ch05-5', title: '线性组合的均值与方差' },
    { id: 'ch05-6', title: '正态的可加性与卷积' },
    { id: 'ch05-7', title: '常见错误与自检方法' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么必须从一元走到二元', html: '现实里的量很少孤立出现：身高与体重、气温与销量、两次测量的误差。只知道各自的分布，无法回答「身高 180 的人体重多少」「两个误差相加会怎样」。<b>联合分布才能承载「关系」。</b>更实际的原因是：第 6 章的样本均值 <code>x̄ = (X<sub>1</sub>+…+X<sub>n</sub>)/n</code> 本身就是 <code>n</code> 个随机变量的线性组合，它的方差公式正是本章第 5 节的结果；不会本章，抽样分布就只能背。' },

    { t: 'p', lead: true, html: '本章有两个关键词：<b>联合</b>与<b>组合</b>。联合分布描述两个变量「一起」怎么取值，边缘分布是把它压回一维，条件分布是固定一个再看另一个，协方差则用一个数概括「同向还是反向」。组合部分讨论 <code>aX+bY</code> 的均值与方差——这是全课最高频的计算，也是中心极限定理能成立的原因。' },

    { t: 'h', lvl: 2, text: '一、联合分布与边缘分布', id: 'ch05-1' },

    { t: 'p', html: '两个随机变量的<b>联合分布函数（joint cdf）</b>是 <code>F(x,y) = P(X ≤ x, Y ≤ y)</code>。离散型用<b>联合概率质量函数</b> <code>p(x,y) = P(X=x, Y=y)</code>，要求非负且总和为 1；连续型用<b>联合密度</b> <code>f(x,y)</code>，要求非负且二重积分为 1，区域概率为 <code>P((X,Y) ∈ D) = ∬<sub>D</sub> f(x,y)dA</code>。' },

    { t: 'p', html: '把另一个变量「求和掉」或「积分掉」，就得到<b>边缘分布（marginal distribution）</b>：<code>p<sub>X</sub>(x) = Σ<sub>y</sub> p(x,y)</code>，<code>f<sub>X</sub>(x) = ∫ f(x,y)dy</code>。<b>「边缘」这个名字来自列联表：把表格按行或按列加总，结果写在页边空白处。</b>注意边缘分布只保留单个变量的信息，<b>丢掉联合分布会丢失全部「关系」信息</b>，反过来也不行。' },

    { t: 'p', html: '一个最小的离散例子：<code>X</code> 取 0、1，<code>Y</code> 取 0、1，联合概率 <code>p(0,0)=0.3, p(0,1)=0.2, p(1,0)=0.1, p(1,1)=0.4</code>。按行加总得 <code>p<sub>X</sub>(0)=0.5, p<sub>X</sub>(1)=0.5</code>；按列加总得 <code>p<sub>Y</sub>(0)=0.4, p<sub>Y</sub>(1)=0.6</code>。<b>验证：两组边缘各自求和为 1，联合总和也为 1。</b>这张 2×2 表在后面的独立性、协方差计算里会反复出现。' },

    { t: 'p', html: '连续型的典型例子是<b>联合均匀分布</b>：<code>(X,Y)</code> 在单位正方形上均匀，<code>f(x,y)=1</code>（<code>0&lt;x&lt;1, 0&lt;y&lt;1</code>）。边缘 <code>f<sub>X</sub>(x)=∫<sub>0</sub><sup>1</sup>1dy=1</code>，也是均匀。<b>但联合均匀的边缘一定均匀吗？不一定——只有在矩形区域上才成立。</b>若区域是三角形 <code>0&lt;y&lt;x&lt;1</code>，边缘 <code>f<sub>X</sub>(x)=x</code>、<code>f<sub>Y</sub>(y)=1-y</code>，都不再是常数。区域形状决定了边缘的形状。' },

    { t: 'table', head: ['已知', '能求', '不能求'], rows: [
      ['联合 <code>p(x,y)</code>', '边缘、条件、协方差、任意事件概率', '—'],
      ['两个边缘 <code>p<sub>X</sub>, p<sub>Y</sub></code>', '各自的均值方差', '联合分布、协方差、独立性'],
      ['边缘 + 独立', '联合（相乘即可）、协方差为 0', '—（这是最强的一组条件）'],
      ['边缘 + 相关系数', '协方差', '完整的联合分布（相关不等于依赖形式）']
    ], caption: '信息量：联合 ⊃ 边缘，独立性是一条额外的强假设' },

    { t: 'h', lvl: 2, text: '二、条件分布与条件期望', id: 'ch05-2' },

    { t: 'p', html: '固定 <code>X = x</code> 后，<code>Y</code> 的分布叫<b>条件分布（conditional distribution）</b>：离散型 <code>p(y|x) = p(x,y)/p<sub>X</sub>(x)</code>，连续型 <code>f(y|x) = f(x,y)/f<sub>X</sub>(x)</code>（要求分母大于 0）。<b>形式与第 2 章的条件概率完全一致，只是把事件换成了密度。</b>连续型在 <code>X=x</code> 处的条件密度是「极限意义」下的定义，严格写法要用 <code>P(Y≤y | x &lt; X ≤ x+h)</code> 取极限，本站按教材惯例直接使用。' },

    { t: 'p', html: '<b>条件期望（conditional expectation）</b><code>E(Y|X=x)</code> 是条件分布的均值。把它看成 <code>x</code> 的函数，<code>E(Y|X)</code> 本身就是一个<b>随机变量</b>——<code>X</code> 取不同值时它取不同值。这一点是初学最大的障碍：<code>E(Y)</code> 是一个数，<code>E(Y|X)</code> 是一个函数（随机变量），<code>E(Y|X=x)</code> 才是数。' },

    { t: 'p', html: '两条性质必须掌握。<b>全期望公式（law of total expectation）</b>：<code>E(Y) = E[E(Y|X)]</code>，即「先按 <code>X</code> 分组求平均，再对各组平均加权」，与第 2 章的全概率公式同构。<b>全方差公式（law of total variance）</b>：<code>Var(Y) = E[Var(Y|X)] + Var[E(Y|X)]</code>，含义是「总波动 = 组内波动的平均 + 组间波动」。' },

    { t: 'p', html: '全方差公式有一个漂亮的解释：<b>知道 <code>X</code> 之后，<code>Y</code> 的不确定性只剩组内的那部分；组间那部分已经被 <code>X</code> 解释掉了。</b>这正是方差分析（ANOVA）与回归 <code>R<sup>2</sup></code> 的思想源头：<code>R<sup>2</sup> = Var[E(Y|X)] / Var(Y)</code>，即「被解释的方差占比」。第 7 章检验组间差异时，用的就是这两块的比值。' },

    { t: 'p', html: '一个连续型的算例：设 <code>f(x,y) = 2</code>（<code>0 &lt; y &lt; x &lt; 1</code>），求 <code>E(Y|X=x)</code>。先算边缘 <code>f<sub>X</sub>(x) = ∫<sub>0</sub><sup>x</sup>2dy = 2x</code>，条件密度 <code>f(y|x) = 2/(2x) = 1/x</code>（<code>0&lt;y&lt;x</code>），即在 <code>(0,x)</code> 上均匀。于是 <code>E(Y|X=x) = x/2</code>，再取期望 <code>E(Y) = E(X/2) = (1/2)(1/2) = 1/4</code>（因 <code>f<sub>X</sub></code> 对应 <code>X</code> 的均值 1/2）。<b>用对称性验算：三角形重心在 (2/3, 1/3)，而 <code>E(X)=2/3</code>、<code>E(Y)=1/3</code>，与上面 1/4 不符——说明 <code>E(X)=1/2</code> 算错了，重算 <code>∫<sub>0</sub><sup>1</sup>x·2x dx = 2/3</code>，于是 <code>E(Y)=1/3</code>，一致。</b>' },

    { t: 'h', lvl: 2, text: '三、独立性：联合等于乘积', id: 'ch05-3' },

    { t: 'p', html: '若对一切 <code>x,y</code> 有 <code>F(x,y) = F<sub>X</sub>(x)F<sub>Y</sub>(y)</code>，则 <code>X</code> 与 <code>Y</code> <b>独立（independent）</b>。等价地，离散型 <code>p(x,y) = p<sub>X</sub>(x)p<sub>Y</sub>(y)</code>，连续型 <code>f(x,y) = f<sub>X</sub>(x)f<sub>Y</sub>(y)</code>。<b>实操判据：联合密度能否写成「只含 x 的函数 × 只含 y 的函数」，且支撑集是矩形。</b>' },

    { t: 'p', html: '第二条「支撑集是矩形」常被忽略。看 <code>f(x,y) = 2</code>（<code>0 &lt; y &lt; x &lt; 1</code>）：<b>数值</b>上它是常数，看似能拆成 <code>1×2</code>，但支撑集是三角形，<code>x</code> 的取值范围依赖 <code>y</code>，所以<b>不独立</b>。反之，<code>f(x,y) = 4xy</code>（<code>0&lt;x&lt;1, 0&lt;y&lt;1</code>）能拆成 <code>(2x)(2y)</code>，支撑集是矩形，<b>独立</b>。判独立要同时看「表达式」与「区域」，缺一不可。' },

    { t: 'p', html: '独立带来的便利有三条：<b>联合 = 边缘之积</b>；<b><code>E(XY) = E(X)E(Y)</code></b>；<b><code>Var(X+Y) = Var(X)+Var(Y)</code></b>。反过来，这三条都<b>不能</b>推出独立（第二条与第三条只推出不相关）。第 4 章给过的 <code>Y=X<sup>2</sup></code> 反例在这里仍然有效：<code>E(XY)=0=E(X)E(Y)</code>，但 <code>Y</code> 由 <code>X</code> 完全决定。' },

    { t: 'callout', kind: 'warn', title: '「独立」是模型假设，不是数据结论', html: '独立性通常来自抽样设计（随机抽样、独立重复），而不是从数据「看出来」的。两列数字的样本相关系数接近 0，只能说明<b>没有线性关系</b>，不能说明独立；样本量小时更是完全不可靠。<b>写题时若题目没给独立，就不能用 <code>E(XY)=E(X)E(Y)</code></b>，这条纪律比任何公式都重要。' },

    { t: 'h', lvl: 2, text: '四、协方差与相关系数', id: 'ch05-4' },

    { t: 'p', html: '<b>协方差（covariance）</b>定义为 <code>Cov(X,Y) = E[(X-μ<sub>X</sub>)(Y-μ<sub>Y</sub>)] = E(XY) - E(X)E(Y)</code>。它衡量「两个变量是否同向偏离均值」：同向偏离时乘积为正，反向为负。<b>协方差是有量纲的</b>，单位是 <code>X</code> 的单位乘 <code>Y</code> 的单位，所以数值大小没法直接比较。' },

    { t: 'p', html: '把它标准化，就得到<b>相关系数（correlation coefficient）</b>：<code>ρ = Cov(X,Y) / (σ<sub>X</sub>σ<sub>Y</sub>)</code>，取值恒在 <code>[-1, 1]</code> 内。<code>ρ = ±1</code> 当且仅当 <code>Y</code> 与 <code>X</code> 有严格的线性关系 <code>Y = aX+b</code>（<code>a</code> 的符号决定正负）。<b>证明用柯西–施瓦茨不等式：<code>[Cov(X,Y)]<sup>2</sup> ≤ Var(X)Var(Y)</code>。</b>' },

    { t: 'p', html: '一个完整算例：用第 1 节那张 2×2 表。<code>E(X)=0×0.5+1×0.5=0.5</code>，<code>E(Y)=0×0.4+1×0.6=0.6</code>，<code>E(XY)=1×1×0.4=0.4</code>，故 <code>Cov=0.4-0.3=0.1</code>。<code>Var(X)=0.5-0.25=0.25</code>，<code>Var(Y)=0.6-0.36=0.24</code>，<code>ρ=0.1/√(0.25×0.24)=0.1/0.2449≈0.408</code>。<b>正相关但不强，与「<code>X=1</code> 时 <code>Y=1</code> 的概率是 0.8」的直观相符。</b>' },

    { t: 'table', head: ['说法', '是否成立', '说明'], rows: [
      ['独立 ⇒ 不相关', '成立', '<code>Cov=0</code> 由 <code>E(XY)=E(X)E(Y)</code> 直接得到'],
      ['不相关 ⇒ 独立', '不成立', '<code>Y=X<sup>2</sup></code>、<code>X~U(-1,1)</code> 是反例'],
      ['<code>ρ=0</code> ⇒ 无关系', '不成立', '只说明无<b>线性</b>关系，可能有 U 形关系'],
      ['<code>ρ</code> 大 ⇒ 因果', '不成立', '相关可能是共同原因或选择偏差造成'],
      ['正态下 <code>ρ=0</code> ⇒ 独立', '成立', '二元正态的特殊性质，别的一般没有']
    ], caption: '相关系数只测线性，且与因果无关' },

    { t: 'p', html: '最后一行值得单独记：<b>二元正态是极少数「不相关即独立」的分布</b>。这是因为二元正态的密度完全由五个参数 <code>(μ<sub>X</sub>, μ<sub>Y</sub>, σ<sub>X</sub>, σ<sub>Y</sub>, ρ)</code> 决定，<code>ρ=0</code> 时密度恰好分解成两个一元正态之积。第 6 章的正态抽样理论大量依赖这条性质，所以它不只是趣闻。' },

    { t: 'h', lvl: 2, text: '五、线性组合的均值与方差', id: 'ch05-5' },

    { t: 'p', html: '设 <code>Z = aX + bY</code>，则 <code>E(Z) = aE(X) + bE(Y)</code>，<b>无条件成立</b>；<code>Var(Z) = a<sup>2</sup>Var(X) + b<sup>2</sup>Var(Y) + 2ab·Cov(X,Y)</code>。<b>这个公式是全课最重要的计算工具</b>：第 6 章的 <code>Var(x̄) = σ<sup>2</sup>/n</code>、第 7 章两样本差的方差，都是它的特例。' },

    { t: 'p', html: '两个特例要背下来：<b>和</b> <code>Var(X+Y) = VarX + VarY + 2Cov</code>；<b>差</b> <code>Var(X-Y) = VarX + VarY - 2Cov</code>。<b>注意差的方差也是「加」</b>，因为 <code>b=-1</code> 时平方后仍为正——这是最反直觉的一点：两个独立量相减，波动不会抵消，反而变大。' },

    { t: 'steps', items: [
      { title: '第一步 · 展开系数', html: '把 <code>Z</code> 写成 <code>Σa<sub>i</sub>X<sub>i</sub></code>，逐个列出 <code>a<sub>i</sub></code>。系数带负号时不要漏，它在方差里会被平方。' },
      { title: '第二步 · 期望直接相加', html: '<code>E(Z) = Σa<sub>i</sub>E(X<sub>i</sub>)</code>，不需要任何独立性。' },
      { title: '第三步 · 方差展开成协方差矩阵', html: '<code>Var(Z) = Σa<sub>i</sub><sup>2</sup>Var(X<sub>i</sub>) + 2Σ<sub>i&lt;j</sub>a<sub>i</sub>a<sub>j</sub>Cov(X<sub>i</sub>,X<sub>j</sub>)</code>。独立时第二项全为 0。' },
      { title: '第四步 · 检查量纲与符号', html: '方差必须非负；若算出负值，检查交叉项系数是否漏了 2 或符号。' }
    ] },

    { t: 'p', html: '一个必考的应用：设 <code>X<sub>1</sub>,…,X<sub>n</sub></code> 独立同分布，均值 <code>μ</code>、方差 <code>σ<sup>2</sup></code>，则 <code>x̄ = (1/n)ΣX<sub>i</sub></code> 满足 <code>E(x̄) = μ</code>、<code>Var(x̄) = σ<sup>2</sup>/n</code>。<b>推导只用两行</b>：系数都是 <code>1/n</code>，方差是 <code>Σ(1/n)<sup>2</sup>σ<sup>2</sup> = n·σ<sup>2</sup>/n<sup>2</sup> = σ<sup>2</sup>/n</code>。<b>「样本量翻 4 倍，标准误减半」正是这个 <code>1/√n</code> 的来源</b>，第 6 章整章都建立在它上面。' },

    { t: 'callout', kind: 'tip', title: '负相关会让你「赚到」', html: '若 <code>Cov(X,Y) &lt; 0</code>，则 <code>Var(X+Y) = VarX+VarY+2Cov</code> 会<b>小于</b>两者之和。这就是投资组合分散化的数学原理：把两只负相关的股票放在一起，总波动反而下降。<b>相关性的符号决定了「合并」是放大还是缩小风险</b>，这条直觉比公式更值得记住。' },

    { t: 'h', lvl: 2, text: '六、正态的可加性与卷积', id: 'ch05-6' },

    { t: 'p', html: '两个独立随机变量之和的分布，一般要求<b>卷积（convolution）</b>：<code>f<sub>Z</sub>(z) = ∫ f<sub>X</sub>(x)f<sub>Y</sub>(z-x)dx</code>（连续型），离散型则是 <code>p<sub>Z</sub>(z) = Σ<sub>x</sub>p<sub>X</sub>(x)p<sub>Y</sub>(z-x)</code>。<b>卷积就是把「和为 z」的所有拆分方式逐一相加</b>，几何上是把一条密度翻转后平移、再与另一条相乘积分。' },

    { t: 'p', html: '卷积计算量大，所以实际做题优先用矩母函数：<code>M<sub>X+Y</sub>(t) = M<sub>X</sub>(t)M<sub>Y</sub>(t)</code>，相乘后认出形式即可。两条最常用的结论：<b>独立正态之和仍正态</b>，<code>N(μ<sub>1</sub>,σ<sub>1</sub><sup>2</sup>) + N(μ<sub>2</sub>,σ<sub>2</sub><sup>2</sup>) = N(μ<sub>1</sub>+μ<sub>2</sub>, σ<sub>1</sub><sup>2</sup>+σ<sub>2</sub><sup>2</sup>)</code>；<b>独立泊松之和仍泊松</b>，参数相加。' },

    { t: 'p', html: '正态那条结论其实有一个更强的版本：<b>独立正态变量的任意线性组合仍为正态</b>，<code>Σa<sub>i</sub>X<sub>i</sub> ~ N(Σa<sub>i</sub>μ<sub>i</sub>, Σa<sub>i</sub><sup>2</sup>σ<sub>i</sub><sup>2</sup>)</code>（独立时交叉项为 0）。<b>注意：这条对正态成立，对别的分布一般不成立。</b>两个独立均匀分布之和是三角形分布，不是均匀；两个独立指数之和是伽马，不是指数。<b>「和仍同族」是正态、泊松、伽马等少数分布的特权。</b>' },

    { t: 'p', html: '用卷积验证一个简单情形：<code>X,Y</code> 独立同分布 <code>U(0,1)</code>，求 <code>Z=X+Y</code>。对 <code>0&lt;z&lt;1</code>，<code>f<sub>Z</sub>(z)=∫<sub>0</sub><sup>z</sup>1·1dx=z</code>；对 <code>1&lt;z&lt;2</code>，<code>x</code> 只能从 <code>z-1</code> 到 1，得 <code>∫<sub>z-1</sub><sup>1</sup>dx=2-z</code>。<b>合起来是一个三角形，顶点在 <code>z=1</code>、高度 1，面积为 1。</b>这条三角形分布说明：即使两个变量都均匀，和也不均匀——「平均化」会把分布推向中间，这正是中心极限定理的直观雏形。' },

    { t: 'callout', kind: 'exam', title: '本章的三种考法', html: '① 给联合密度，求边缘、条件密度、<code>E(Y|X)</code>（必考，计算量大但套路固定）；② 给联合表，算协方差与相关系数，并判断独立（常与选择题结合）；③ 给独立正态变量，求线性组合的分布或概率（第 6、7 章的入口）。<b>第 ① 类务必先画支撑集</b>，积分上下限错了，后面全错。' },

    { t: 'h', lvl: 2, text: '七、常见错误与自检方法', id: 'ch05-7' },

    { t: 'table', head: ['错误', '表现', '纠正'], rows: [
      ['积分限不看支撑集', '<code>∫<sub>0</sub><sup>1</sup></code> 硬套三角形区域', '先画区域，再定上下限'],
      ['把 <code>f(x,y)=g(x)h(y)</code> 当独立', '忽略支撑集不是矩形', '同时检查区域能否分解为乘积'],
      ['不相关当独立', '<code>ρ=0</code> 就说独立', '只有二元正态下才成立'],
      ['差的方差写成相减', '<code>Var(X-Y)=VarX-VarY</code>', '应为 <code>VarX+VarY-2Cov</code>'],
      ['交叉项漏乘 2', '<code>2abCov</code> 写成 <code>abCov</code>', '从平方展开逐项核对'],
      ['条件期望当常数', '把 <code>E(Y|X)</code> 当成 <code>E(Y)</code>', '它是 <code>X</code> 的函数，是随机变量']
    ], caption: '前两条是本章计算失分的主因' },

    { t: 'p', html: '自检流程：<b>① 画出联合分布的支撑集，标出每个变量的范围；② 求边缘时确认积分限随另一变量变化；③ 判独立要同时验「表达式可分离」与「区域是矩形」；④ 算协方差先算 <code>E(XY)</code>、<code>E(X)</code>、<code>E(Y)</code> 三个数；⑤ 方差公式展开后检查交叉项系数 2；⑥ 用全期望公式抽查 <code>E(Y) = E[E(Y|X)]</code></b>，两条路结果一致才可信。' },

    { t: 'quiz', qid: 'ch05-q1' },
    { t: 'quiz', qid: 'ch05-q2' },
    { t: 'quiz', qid: 'ch05-q3' },

    { t: 'keypoint', items: [
      { title: '联合 ⊃ 边缘，反过来不行', html: '边缘丢失全部关系信息；只有「边缘 + 独立」才能还原联合。' },
      { title: '条件期望是随机变量', html: '<code>E(Y|X)</code> 随 <code>X</code> 变，<code>E(Y|X=x)</code> 才是数；<code>E(Y)=E[E(Y|X)]</code>。' },
      { title: '独立看两点：表达式与支撑集', html: '<code>f(x,y)=g(x)h(y)</code> 且区域为矩形，才独立；缺一不可。' },
      { title: '独立 ⇒ 不相关，反之不成立', html: '<code>ρ=0</code> 只排除线性关系；二元正态是「不相关即独立」的例外。' },
      { title: '<code>Var(aX+bY)</code> 的完整公式', html: '<code>a<sup>2</sup>VarX+b<sup>2</sup>VarY+2abCov</code>；差的方差也是加，不是减，交叉项符号随 <code>ab</code>。' },
      { title: '正态与泊松「和仍同族」', html: '其他分布一般不是：两个均匀之和是三角形，两个指数之和是伽马。' }
    ] },

    { t: 'checklist', id: 'ch05', items: [
      '我能由联合 pmf 表格按行、按列求边缘，并验证各自求和为 1',
      '我能对三角形区域上的联合密度求边缘，且积分限随另一变量变化',
      '我能写出条件密度公式，并算出 <code>E(Y|X=x)</code>',
      '我能说明 <code>E(Y|X)</code> 为什么是随机变量，并验证 <code>E(Y)=E[E(Y|X)]</code>',
      '我能用「表达式可分离 + 矩形支撑集」判断独立性，并举出反例',
      '我能算出 2×2 表的协方差与相关系数，并判断独立性',
      '我能举出 <code>ρ=0</code> 但不独立的例子，并说明二元正态为何例外',
      '我能写出 <code>Var(aX+bY)</code> 的完整公式，并解释差的方差为什么是加',
      '我能用两行推出 <code>Var(x̄)=σ<sup>2</sup>/n</code>，并说明 <code>1/√n</code> 的含义',
      '我能用卷积求两个独立 <code>U(0,1)</code> 之和的密度，并画出形状'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 Hogg & Tanis 第 9 版 §4.3–4.6（联合、边缘、条件、独立）与 §5.1–5.3（协方差、线性组合、正态理论），对应 STA2001 Lecture 12–14。2×2 表的数字为教学设定，相关系数 0.408 可复核；三角形区域例子与单位正方形均匀的对比取自讲义。卷积只演示两个均匀之和，一般情形建议用矩母函数，理由已在正文说明。第 6 章会直接把 <code>Var(x̄)=σ<sup>2</sup>/n</code> 当作已知结论使用，本章务必推一遍。若你的课程把二元正态放在第 6 章，本节结论可直接引用。' }
  ]
});
