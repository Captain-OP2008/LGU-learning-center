/* =====================================================================
 * ch06.js · 第 6 章「抽样分布与极限定理」
 * 职责：把第 5 章的线性组合结论落到「统计量」上——x̄、S²、比例、
 *       差值各自服从什么分布；中心极限定理为何让正态无处不在。
 * 依据：Hogg & Tanis 第 9 版 §5.4–5.6、§6.1–6.4；STA2001 Lecture 15–16。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch06',
  num: '06',
  title: '抽样分布与极限定理',
  en: 'SAMPLING DISTRIBUTIONS & LIMIT THEOREMS',
  goals: [
    '说明「统计量是随机变量」的含义，并区分样本均值的标准差与标准误',
    '陈述并应用中心极限定理，判断何时可以用正态近似（含连续性修正的边界）',
    '区分大数定律与中心极限定理回答的两个不同问题',
    '写出 <code>(n-1)S<sup>2</sup>/σ<sup>2</sup> ~ χ<sup>2</sup>(n-1)</code> 与 <code>t</code> 统计量的构造，并解释自由度从何而来',
    '在有限总体抽样中用有限总体修正，并反解达到给定误差所需的样本量'
  ],
  kp: [
    { id: 'ch06-1', title: '随机样本与统计量' },
    { id: 'ch06-2', title: '样本均值与标准误' },
    { id: 'ch06-3', title: '中心极限定理' },
    { id: 'ch06-4', title: '大数定律' },
    { id: 'ch06-5', title: 'χ²、t 与 F 抽样分布' },
    { id: 'ch06-6', title: '有限总体修正与样本量设计' },
    { id: 'ch06-7', title: '常见错误与自检方法' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '这一章是概率与统计的接缝', html: '前五章都在问「已知分布，数据会长什么样」。从这一章起，问题反过来：<b>数据已经拿到了，我们算出的 <code>x̄</code>、<code>S<sup>2</sup></code> 本身服从什么分布？</b>只有知道 <code>x̄</code> 的分布，才能说「<code>x̄</code> 离 <code>μ</code> 有多远算远」；只有知道 <code>t</code> 的分布，第 7 章的区间与检验才有依据。这一章若跳过，后面全部是背公式。' },

    { t: 'p', lead: true, html: '本章的主线是<b>「统计量有分布」</b>。样本均值、样本方差、样本比例都是从数据算出来的，每抽一次样就变一次，所以它们都是随机变量。求它们的分布，就是求「抽样分布（sampling distribution）」。中心极限定理告诉你，无论总体是什么形状，样本均值的分布都趋近正态；<code>t</code> 与 <code>χ<sup>2</sup></code> 告诉你，用小样本、用估计的 <code>S</code> 代替 <code>σ</code> 时该用什么分布。' },

    { t: 'h', lvl: 2, text: '一、随机样本与统计量', id: 'ch06-1' },

    { t: 'p', html: '<b>随机样本（random sample）</b>指 <code>n</code> 个相互独立、且与总体同分布的随机变量 <code>X<sub>1</sub>,…,X<sub>n</sub></code>，简称 i.i.d.（independent and identically distributed）。<b>三个词缺一不可</b>：独立保证信息不重复，同分布保证它们都在描述同一个总体。有放回抽样天然满足；无放回抽样在总体很大、样本很小时可近似满足（第 6 节给修正公式）。' },

    { t: 'p', html: '<b>统计量（statistic）</b>是只由样本算出、不含未知参数的函数，如 <code>x̄</code>、<code>S<sup>2</sup></code>、<code>min(X<sub>i</sub>)</code>。<b>它本身是随机变量</b>——换一组样本就换一个值；它的分布叫抽样分布。与之相对，<code>μ</code>、<code>σ<sup>2</sup></code> 是参数，是固定的未知常数，没有分布。这个区分在第 0 章提过，这里要落到计算上。' },

    { t: 'p', html: '两个最常用的统计量：<b>样本均值</b> <code>x̄ = (1/n)ΣX<sub>i</sub></code>，<b>样本方差</b> <code>S<sup>2</sup> = (1/(n-1))Σ(X<sub>i</sub>-x̄)<sup>2</sup></code>。<b>分母为什么是 <code>n-1</code> 而不是 <code>n</code>？</b>因为 <code>x̄</code> 用掉了样本的一个自由度：<code>Σ(X<sub>i</sub>-x̄) = 0</code>，只要知道前 <code>n-1</code> 个偏差，最后一个就被确定了。用 <code>n-1</code> 才能让 <code>E(S<sup>2</sup>) = σ<sup>2</sup></code>，即无偏。' },

    { t: 'p', html: '验证无偏性只需一行：<code>Σ(X<sub>i</sub>-x̄)<sup>2</sup> = ΣX<sub>i</sub><sup>2</sup> - nx̄<sup>2</sup></code>，取期望得 <code>n(σ<sup>2</sup>+μ<sup>2</sup>) - n(σ<sup>2</sup>/n+μ<sup>2</sup>) = (n-1)σ<sup>2</sup></code>，除以 <code>n-1</code> 恰为 <code>σ<sup>2</sup></code>。<b>若除以 <code>n</code>，期望是 <code>(n-1)σ<sup>2</sup>/n</code>，系统性偏小</b>——这就是「有偏样本方差」总是低估总体方差的原因，也解释了为什么小样本时必须用 <code>n-1</code>。' },

    { t: 'h', lvl: 2, text: '二、样本均值与标准误', id: 'ch06-2' },

    { t: 'p', html: '由第 5 章的线性组合公式立即可得：<code>E(x̄) = μ</code>，<code>Var(x̄) = σ<sup>2</sup>/n</code>。<b>两个结论的含义完全不同</b>：前者说 <code>x̄</code> 无偏，长期平均会命中 <code>μ</code>；后者说 <code>x̄</code> 的波动随 <code>n</code> 增大而变小，<code>n</code> 越大估计越稳。<b>注意 <code>Var(x̄)</code> 只依赖 <code>n</code>，不依赖总体分布的形状</b>，这是它最有用的一点。' },

    { t: 'p', html: '<code>x̄</code> 的标准差 <code>σ/√n</code> 有一个专门的名字：<b>标准误（standard error, SE）</b>。它与「标准差」的区别必须说清：<b>标准差 <code>σ</code> 描述单个观测值的离散程度；标准误 <code>σ/√n</code> 描述「样本均值这个估计量」的离散程度。</b>前者是总体的属性，后者是估计的精度，两者差一个 <code>√n</code>。' },

    { t: 'p', html: '当 <code>σ</code> 未知时，用 <code>S</code> 代替，得到<b>估计标准误</b> <code>SE = S/√n</code>。<b>这个替换不是免费的</b>：<code>S</code> 本身随机，会额外带来一份不确定性，于是 <code>(x̄-μ)/(S/√n)</code> 不再服从标准正态，而是服从 <code>t</code> 分布。<b>自由度 <code>n-1</code> 越小，<code>t</code> 的尾部越厚</b>，临界值越大，区间越宽——这是「小样本必须更保守」的数学表达。' },

    { t: 'table', head: ['<code>n</code>', '<code>t<sub>0.025</sub></code>', '<code>z<sub>0.025</sub></code>', '差距'], rows: [
      ['5', '2.776', '1.960', '+42%'],
      ['10', '2.262', '1.960', '+15%'],
      ['20', '2.093', '1.960', '+6.8%'],
      ['30', '2.045', '1.960', '+4.3%'],
      ['100', '1.984', '1.960', '+1.2%'],
      ['∞', '1.960', '1.960', '0']
    ], caption: 'n 越大 t 越接近 z，但小样本时差距不能忽略' },

    { t: 'p', html: '这张表解释了一个常见现象：<b>样本量 5 时，用 <code>z=1.96</code> 代替 <code>t=2.776</code>，置信区间会窄 42%，覆盖率远低于名义的 95%。</b>很多论文在 <code>n</code> 只有十几个时仍用 <code>z</code>，就是犯了这个错。经验上 <code>n &gt; 30</code> 且总体不太偏时，<code>t</code> 与 <code>z</code> 的差别可以忽略，但「可以忽略」的前提要写出来。' },

    { t: 'h', lvl: 2, text: '三、中心极限定理', id: 'ch06-3' },

    { t: 'p', html: '<b>中心极限定理（central limit theorem, CLT）</b>：设 <code>X<sub>1</sub>,…,X<sub>n</sub></code> i.i.d.，均值 <code>μ</code>、方差 <code>σ<sup>2</sup> &lt; ∞</code>，则当 <code>n → ∞</code> 时 <code>(x̄-μ)/(σ/√n) →<sub>d</sub> N(0,1)</code>，等价地 <code>x̄ ≈ N(μ, σ<sup>2</sup>/n)</code>。<b>注意它不要求总体正态</b>，只要求方差有限，这是它被称为「中心」的原因：无论起点是什么分布，标准化后的和都汇聚到同一个正态。' },

    { t: 'p', html: '为什么是正态？用矩母函数能看得很清楚。设 <code>Z<sub>n</sub> = (ΣX<sub>i</sub>-nμ)/(σ√n)</code>，其矩母函数为 <code>[M(t/(σ√n))·e<sup>-μt/(σ√n)</sup>]<sup>n</sup></code>。对 <code>M</code> 在 0 处做泰勒展开到二阶，<code>M(s) ≈ 1+μs+ (σ<sup>2</sup>+μ<sup>2</sup>)s<sup>2</sup>/2</code>，代入后取极限，指数部分收敛到 <code>t<sup>2</sup>/2</code>，正是标准正态的矩母函数。<b>展开只用到前两阶矩，所以「二阶矩有限」就够了</b>，更高阶的细节被 <code>n → ∞</code> 抹平。' },

    { t: 'p', html: '实际使用要回答两个问题：<b>多大 <code>n</code> 才够？</b>与<b>什么分布需要更大 <code>n</code>？</b>经验法则是 <code>n ≥ 30</code>，但它只是起点：<b>分布越偏、尾部越厚，所需 <code>n</code> 越大</b>；对称分布（如均匀）<code>n=10</code> 已相当接近，重尾分布（如对数正态）可能要几百。<b>判断近似好坏，最直接的办法是做模拟：从目标分布抽 10000 组样本，画 <code>x̄</code> 的直方图，与正态密度叠在一起看。</b>' },

    { t: 'table', head: ['总体分布', '<code>n=5</code>', '<code>n=30</code>', '<code>n=100</code>'], rows: [
      ['均匀 <code>U(0,1)</code>', '已接近对称', '很好', '极好'],
      ['指数 <code>Exp(1)</code>', '明显右偏', '可接受', '很好'],
      ['伯努利 <code>p=0.05</code>', '很偏、离散', '仍偏，需修正', '可接受'],
      ['对数正态', '严重右偏', '仍偏', '接近'],
      ['柯西', '不适用', '不适用', '不适用（方差无穷）']
    ], caption: '「n ≥ 30」是起点不是保证；最后一行是定理的前提被破坏' },

    { t: 'p', html: '离散总体用正态近似时，最好加<b>连续性修正（continuity correction）</b>：把 <code>P(X ≤ k)</code> 改成 <code>P(X ≤ k+0.5)</code>，把 <code>P(X ≥ k)</code> 改成 <code>P(X ≥ k-0.5)</code>。<b>理由是二项分布是阶梯状的，用连续曲线去贴台阶，应该贴到台阶的中点。</b>当 <code>np</code> 与 <code>n(1-p)</code> 都大于 5（更严格是 10）时，修不修差别不大；接近边界时修正能显著提高精度。' },

    { t: 'callout', kind: 'warn', title: 'CLT 的三种常见误用', html: '<b>一、以为「样本本身服从正态」。</b>CLT 说的是 <code>x̄</code> 的分布趋近正态，不是原始数据变正态。<b>二、对方差无穷的分布套用。</b>柯西分布不满足定理前提，<code>n</code> 再大也不会收敛。<b>三、把「近似」当「精确」。</b><code>n=30</code> 时若总体极度偏斜，<code>p</code> 值仍可能偏差可观；报告结论时最好注明近似条件是否满足。' },

    { t: 'h', lvl: 2, text: '四、大数定律', id: 'ch06-4' },

    { t: 'p', html: '<b>弱大数定律（weak law of large numbers）</b>：在 i.i.d. 且 <code>E|X| &lt; ∞</code> 下，对任意 <code>ε &gt; 0</code>，<code>P(|x̄-μ| &gt; ε) → 0</code>，记作 <code>x̄ →<sub>p</sub> μ</code>（依概率收敛）。用切比雪夫就能证：<code>P(|x̄-μ| ≥ ε) ≤ σ<sup>2</sup>/(nε<sup>2</sup>) → 0</code>。<b>它说的是「估计会越来越准」，是「平均」这个概念能被信任的数学基础。</b>' },

    { t: 'p', html: '大数定律与中心极限定理回答的是<b>两个不同的问题</b>，这是本章最容易被混淆的一对：<b>大数定律说 <code>x̄</code> 会收敛到 <code>μ</code></b>（位置，长期趋势）；<b>中心极限定理说 <code>x̄</code> 围绕 <code>μ</code> 的波动形状趋近正态</b>（形状，波动幅度 <code>σ/√n</code>）。<b>一个讲「会不会准」，一个讲「偏离多少、以什么形状偏离」</b>，两者合起来才完整描述了 <code>x̄</code> 的大样本行为。' },

    { t: 'table', head: ['', '大数定律', '中心极限定理'], rows: [
      ['回答', '<code>x̄</code> 会不会靠近 <code>μ</code>', '<code>x̄</code> 以什么形状围绕 <code>μ</code> 波动'],
      ['结论', '<code>x̄ →<sub>p</sub> μ</code>', '<code>(x̄-μ)/(σ/√n) →<sub>d</sub> N(0,1)</code>'],
      ['前提', '<code>E|X| &lt; ∞</code>', '<code>σ<sup>2</sup> &lt; ∞</code>'],
      ['用途', '证明估计量一致', '构造区间、算近似概率'],
      ['直觉', '抛硬币多了，正面比例趋近 <code>p</code>', '正面比例的波动近似钟形']
    ], caption: '一个管「趋近」，一个管「波形」，缺一不可' },

    { t: 'p', html: '大数定律还解释了一个日常误解：<b>「已经连续出了 10 次正面，下一次该出反面了」是错的。</b>独立抛掷时每次都是 <code>1/2</code>，大数定律说的是「长期比例会回到 <code>1/2</code>」，方式是<b>后面的次数足够多、把偏差稀释掉</b>，而不是「补偿性地多出反面」。这个错误叫<b>赌徒谬误（gambler\u2019s fallacy）</b>，本质是把大数定律读成了「补偿机制」。' },

    { t: 'h', lvl: 2, text: '五、χ²、t 与 F 抽样分布', id: 'ch06-5' },

    { t: 'p', html: '正态总体下，三个统计量有精确的分布，它们是第 7 章全部推断的零件。<b>第一个：样本方差的分布</b>。<code>(n-1)S<sup>2</sup>/σ<sup>2</sup> ~ χ<sup>2</sup>(n-1)</code>，自由度为 <code>n-1</code>。<code>χ<sup>2</sup>(k)</code> 是 <code>k</code> 个独立标准正态平方和，右偏，<code>k</code> 越大越对称。<b>用途</b>：估计或检验方差、做拟合优度检验。' },

    { t: 'p', html: '<b>第二个：<code>t</code> 分布</b>。若 <code>Z ~ N(0,1)</code> 与 <code>U ~ χ<sup>2</sup>(k)</code> 独立，则 <code>T = Z/√(U/k) ~ t(k)</code>。把 <code>Z = (x̄-μ)/(σ/√n)</code>、<code>U = (n-1)S<sup>2</sup>/σ<sup>2</sup></code> 代入，<code>σ</code> 恰好约掉，得 <code>T = (x̄-μ)/(S/√n) ~ t(n-1)</code>。<b>这就是「用 <code>S</code> 代替 <code>σ</code> 后分布变厚尾」的精确来源</b>：分母多了一个随机的 <code>√(U/k)</code>。' },

    { t: 'p', html: '<b>第三个：<code>F</code> 分布</b>。若 <code>U ~ χ<sup>2</sup>(m)</code> 与 <code>V ~ χ<sup>2</sup>(n)</code> 独立，则 <code>F = (U/m)/(V/n) ~ F(m,n)</code>。两组独立正态样本的方差比 <code>(S<sub>1</sub><sup>2</sup>/σ<sub>1</sub><sup>2</sup>)/(S<sub>2</sub><sup>2</sup>/σ<sub>2</sub><sup>2</sup>) ~ F(n<sub>1</sub>-1, n<sub>2</sub>-1)</code>。<b>用途</b>：比较两个方差（方差齐性检验）、方差分析。<code>F</code> 的两个自由度顺序不能颠倒，<code>F(m,n)</code> 与 <code>F(n,m)</code> 是倒数关系。' },

    { t: 'table', head: ['分布', '构造', '自由度', '典型用途'], rows: [
      ['<code>χ<sup>2</sup>(k)</code>', '<code>ΣZ<sub>i</sub><sup>2</sup></code>', '<code>k</code>', '方差区间、拟合优度、独立性检验'],
      ['<code>t(k)</code>', '<code>Z/√(U/k)</code>', '<code>k</code>', '均值区间与检验（<code>σ</code> 未知）'],
      ['<code>F(m,n)</code>', '<code>(U/m)/(V/n)</code>', '<code>m,n</code>', '方差比、ANOVA'],
      ['<code>z</code>', '<code>(x̄-μ)/(σ/√n)</code>', '—', '<code>σ</code> 已知或大样本']
    ], caption: '三个分布都由独立的正态平方和拼出来，自由度就是「独立信息的个数」' },

    { t: 'p', html: '自由度的直观含义值得多说一句：<b>它是「独立信息的个数」</b>。<code>S<sup>2</sup></code> 里用掉一个自由度估计 <code>x̄</code>，所以剩 <code>n-1</code>；两样本的合并方差用掉两个，剩 <code>n<sub>1</sub>+n<sub>2</sub>-2</code>；卡方拟合优度检验里每估计一个参数就少一个自由度。<b>自由度算错，查表就错，结论就错</b>，这是第 7 章最常见的失分点之一。' },

    { t: 'callout', kind: 'exam', title: '三个分布的考试出场方式', html: '① 给 <code>n</code>、<code>s<sup>2</sup></code>，求 <code>σ<sup>2</sup></code> 的置信区间（反查 <code>χ<sup>2</sup></code> 两侧分位数）；② 小样本均值检验，判断用 <code>z</code> 还是 <code>t</code>；③ 两组方差比较，写 <code>F</code> 统计量并说明两个自由度。<b>三题都要先写「总体正态、样本独立」的前提</b>，没写前提直接扣分。' },

    { t: 'h', lvl: 2, text: '六、有限总体修正与样本量设计', id: 'ch06-6' },

    { t: 'p', html: '前面的结论都假设「有放回」或「总体无限」。<b>无放回地从有限总体 <code>N</code> 个个体中抽 <code>n</code> 个</b>时，各观测不再独立，<code>Var(x̄) = (σ<sup>2</sup>/n)·(N-n)/(N-1)</code>。多出来的因子叫<b>有限总体修正（finite population correction, FPC）</b>，它总是小于 1，所以标准误比独立情形更小——<b>因为抽过的个体不会再被抽到，信息没有重复。</b>' },

    { t: 'p', html: '什么时候必须用修正？经验判据是<b>抽样比例 <code>n/N &gt; 5%</code></b>。比例很小时 <code>(N-n)/(N-1) ≈ 1</code>，修正可忽略；比例接近 1 时因子趋近 0，标准误趋近 0（因为几乎普查了全体）。<b>考试里若题目明确给出总体规模 <code>N</code>，通常就是在提示要用修正</b>，漏用会算大标准误、给出过宽的区间。' },

    { t: 'p', html: '样本量设计是 FPC 的逆问题：给定允许误差 <code>E</code> 与置信水平，求 <code>n</code>。独立情形由 <code>z·σ/√n ≤ E</code> 解出 <code>n ≥ (zσ/E)<sup>2</sup></code>；有限总体时 <code>n ≥ Nσ<sup>2</sup>z<sup>2</sup> / [(N-1)E<sup>2</sup> + σ<sup>2</sup>z<sup>2</sup>]</code>。<b>两个公式都要向上取整</b>，因为样本量不能是小数，而取整方向错了会达不到精度。' },

    { t: 'p', html: '举个具体数字：<code>σ=10</code>，要求 95% 置信区间的半宽不超过 2，则 <code>n ≥ (1.96×10/2)<sup>2</sup> = 96.04</code>，取 97。<b>注意是 97 不是 96</b>：<code>96</code> 对应的半宽是 <code>1.96×10/√96 = 2.0008 &gt; 2</code>，刚好不达标。<b>「算出 96.04 就写 96」是样本量题最常见的错</b>，正确做法是向上取整并回代验证。' },

    { t: 'callout', kind: 'tip', title: '样本量公式里的三个杠杆', html: '看 <code>n = (zσ/E)<sup>2</sup></code>：<b>要求越精确（<code>E</code> 越小），<code>n</code> 按平方增长</b>——误差减半，样本量翻四倍；<b>置信度越高（<code>z</code> 越大），<code>n</code> 也增大</b>，但 <code>z</code> 从 1.96 到 2.58 只增 32%，代价是平方后的 74%；<b><code>σ</code> 越大，需要越多样本</b>。三者中 <code>E</code> 最敏感，所以「精度要求」必须在研究设计阶段就谈定，不能事后再改。' },

    { t: 'h', lvl: 2, text: '七、常见错误与自检方法', id: 'ch06-7' },

    { t: 'table', head: ['错误', '表现', '纠正'], rows: [
      ['标准差与标准误混用', '把 <code>σ</code> 当作 <code>x̄</code> 的波动', '标准误是 <code>σ/√n</code>'],
      ['小样本硬用 <code>z</code>', '<code>n=8</code> 仍查 <code>1.96</code>', '<code>σ</code> 未知时用 <code>t(n-1)</code>'],
      ['把 CLT 当「数据正态」', '说「样本服从正态」', '是 <code>x̄</code> 的分布趋近正态'],
      ['对方差无穷的分布用 CLT', '柯西分布求 <code>x̄</code> 的区间', '定理前提不满足，结论无效'],
      ['自由度数错', '两样本用 <code>n-1</code>', '合并方差用 <code>n<sub>1</sub>+n<sub>2</sub>-2</code>'],
      ['样本量向下取整', '<code>96.04</code> 取 96', '向上取整并回代验证'],
      ['漏用有限总体修正', '<code>n/N=20%</code> 仍用 <code>σ/√n</code>', '乘 <code>√((N-n)/(N-1))</code>']
    ], caption: '七类错误，前两条在期中期末都高频' },

    { t: 'p', html: '自检流程：<b>① 先写清「i.i.d.、总体正态/大样本、<code>σ</code> 已知与否」三个前提；② 判断统计量服从 <code>z</code>、<code>t</code>、<code>χ<sup>2</sup></code> 还是 <code>F</code>；③ 确认自由度；④ 检查是否有限总体、是否需要 FPC；⑤ 算完回代看量级</b>（标准误应小于标准差，区间应包含点估计）；<b>⑥ 若用了正态近似，注明 <code>n</code> 与偏度是否支持</b>。' },

    { t: 'quiz', qid: 'ch06-q1' },
    { t: 'quiz', qid: 'ch06-q2' },
    { t: 'quiz', qid: 'ch06-q3' },

    { t: 'keypoint', items: [
      { title: '统计量是随机变量', html: '每抽一次样就变一次，所以有分布；参数 <code>μ</code> 没有分布，它是常数。' },
      { title: '<code>E(x̄)=μ</code>，<code>Var(x̄)=σ<sup>2</sup>/n</code>', html: '前者无偏，后者给出 <code>1/√n</code> 的收敛速度；两者都不要求总体正态。' },
      { title: '标准误不是标准差', html: '<code>σ</code> 描述单个观测，<code>σ/√n</code> 描述估计量；报告估计精度时用后者。' },
      { title: 'CLT 说的是 <code>x̄</code> 的形状', html: '不要求总体正态，只要求 <code>σ<sup>2</sup> &lt; ∞</code>；<code>n</code> 的需求取决于偏度。' },
      { title: '大数定律与 CLT 分工不同', html: '前者说「趋近」，后者说「以什么形状偏离」；赌徒谬误是把前者读成了补偿。' },
      { title: '三个抽样分布由正态平方和拼成', html: '<code>(n-1)S<sup>2</sup>/σ<sup>2</sup>~χ<sup>2</sup>(n-1)</code>；<code>(x̄-μ)/(S/√n)~t(n-1)</code>；方差比服从 <code>F</code>。' }
    ] },

    { t: 'checklist', id: 'ch06', items: [
      '我能写出随机样本的三条要求，并说明无放回抽样何时近似满足',
      '我能证明 <code>E(S<sup>2</sup>)=σ<sup>2</sup></code>，并解释分母为什么是 <code>n-1</code>',
      '我能用两行推出 <code>Var(x̄)=σ<sup>2</sup>/n</code>，并说明它与 <code>n</code> 的关系',
      '我能说清标准差与标准误的区别，并各举一个使用场景',
      '我能陈述 CLT 的前提与结论，并判断 <code>n=30</code> 是否足够',
      '我能解释大数定律与 CLT 分别回答什么问题，并指出赌徒谬误错在哪',
      '我能写出 <code>t</code> 统计量的构造，并说明自由度从何而来',
      '我能分别写出 <code>χ<sup>2</sup></code> 与 <code>F</code> 统计量的构造及各自自由度',
      '我知道 <code>n/N &gt; 5%</code> 时要用有限总体修正，并能写出修正因子',
      '我能由允许误差反解样本量，并正确向上取整、回代验证'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 Hogg & Tanis 第 9 版 §5.4–5.6（统计量、抽样分布）与 §6.1–6.4（中心极限定理、大数定律、<code>t</code>/<code>χ<sup>2</sup></code>/<code>F</code> 分布），对应 STA2001 Lecture 15–16。CLT 的矩母函数证明按讲义思路压缩为「展开到二阶」；<code>t</code> 临界值表取自标准 <code>t</code> 表；样本量算例 <code>(1.96×10/2)<sup>2</sup>=96.04</code> 与有限总体修正公式均可在讲义与教材习题中找到对应。柯西分布作为反例，是为强调「方差有限」这一前提不能省。若你的课程把 <code>F</code> 分布留到 ANOVA 再讲，本节结论可先记住构造，第 7 章双样本检验会再遇到它。' }
  ]
});
