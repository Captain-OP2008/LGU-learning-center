/* =====================================================================
 * ch04.js · 第 4 章「期望、方差与矩母函数」
 * 职责：用一个数概括分布的位置与尺度；用矩母函数识别分布、生成矩；
 *       用切比雪夫给出不依赖分布的保守界。
 * 依据：Hogg & Tanis 第 9 版 §2.2–2.4、§4.1–4.2；STA2001 Lecture 09–11。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch04',
  num: '04',
  title: '期望、方差与矩母函数',
  en: 'EXPECTATION, VARIANCE & MGF',
  goals: [
    '用定义与 LOTUS 计算 <code>E(g(X))</code>，避免先求 <code>g(X)</code> 的分布这一多余步骤',
    '用 <code>Var(X) = E(X<sup>2</sup>) - [E(X)]<sup>2</sup></code> 计算方差，并解释标准差的量纲意义',
    '写出矩母函数 <code>M(t) = E(e<sup>tX</sup>)</code>，用它求矩、识别分布、处理独立和的分布',
    '默写二项、几何、泊松、均匀、指数、正态六个分布的均值与方差',
    '用切比雪夫不等式给出不依赖分布形状的概率界，并与正态的精确值对照'
  ],
  kp: [
    { id: 'ch04-1', title: '期望与 LOTUS' },
    { id: 'ch04-2', title: '方差、标准差与计算捷径' },
    { id: 'ch04-3', title: '矩与矩母函数' },
    { id: 'ch04-4', title: '常见分布的均值与方差表' },
    { id: 'ch04-5', title: '切比雪夫不等式' },
    { id: 'ch04-6', title: '期望与方差的性质和陷阱' },
    { id: 'ch04-7', title: '常见错误与自检方法' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么一个数不够，要两个', html: '知道「平均寿命 1000 小时」并不足以判断一批灯泡好不好：如果一半 0 小时、一半 2000 小时，均值仍是 1000，但质量完全不同。<b>期望告诉你分布的中心在哪，方差告诉你它摊得有多开。</b>这两个数构成了对分布的最低限度概括，也是后面置信区间、检验统计量的分子分母的来源。再往上一层，矩母函数把「所有矩」打包成一个函数，从而能用微积分代替求和。' },

    { t: 'p', lead: true, html: '本章有三个层次：<b>第一层</b>是定义与计算，学会用 LOTUS 直接算 <code>E(g(X))</code>；<b>第二层</b>是性质，知道期望是线性的、方差不满足线性；<b>第三层</b>是矩母函数，它把「分布」翻译成一个函数，使「独立和的分布」从卷积变成相乘。三层都服务于同一个目的：<b>用少量数字或函数概括分布，而不必画出整条曲线。</b>' },

    { t: 'h', lvl: 2, text: '一、期望与 LOTUS', id: 'ch04-1' },

    { t: 'p', html: '<b>期望（expectation）</b>是随机变量的「概率加权平均」。离散型 <code>E(X) = Σ x·p(x)</code>，连续型 <code>E(X) = ∫ x·f(x)dx</code>，前提是绝对收敛（<code>Σ|x|p(x) &lt; ∞</code> 或 <code>∫|x|f(x)dx &lt; ∞</code>），否则称期望不存在。<b>柯西分布就是经典的反例</b>：密度 <code>1/(π(1+x<sup>2</sup>))</code> 对称，但因为尾部太厚，积分不绝对收敛，期望无定义——不能因为「对称」就说期望是 0。' },

    { t: 'p', html: '如果每次求 <code>E(g(X))</code> 都要先求 <code>g(X)</code> 的分布，计算量会爆炸。所幸有<b>无意识统计学家法则（LOTUS, law of the unconscious statistician）</b>：<code>E(g(X)) = Σ g(x)p(x)</code> 或 <code>∫ g(x)f(x)dx</code>，<b>直接用 <code>X</code> 的分布加权 <code>g(x)</code> 即可，不必知道 <code>g(X)</code> 的分布</b>。这条法则把第 3 章的变量变换从「必须做」降级为「只在需要分布时才做」。' },

    { t: 'p', html: '用 LOTUS 算一个必须算的例子：<code>X ~ U(0,1)</code>，求 <code>E(X<sup>2</sup>)</code>。直接积分 <code>∫<sub>0</sub><sup>1</sup> x<sup>2</sup>dx = 1/3</code>，无需先求 <code>X<sup>2</sup></code> 的密度 <code>1/(2√y)</code>。若用后者验证：<code>∫<sub>0</sub><sup>1</sup> y·(2√y)<sup>-1</sup>dy = (1/2)∫<sub>0</sub><sup>1</sup>√y dy = (1/2)(2/3) = 1/3</code>，一致。<b>两条路都通，但 LOTUS 少一步变换，也少一次出错机会。</b>' },

    { t: 'p', html: '期望的三条基本性质必须熟到条件反射：<b>（1）线性性</b>：<code>E(aX+b) = aE(X)+b</code>，且 <code>E(X+Y) = E(X)+E(Y)</code> 对任意 <code>X,Y</code> 成立，<b>不要求独立</b>；<b>（2）常数</b>：<code>E(c) = c</code>；<b>（3）独立时的乘积性</b>：若 <code>X,Y</code> 独立，<code>E(XY) = E(X)E(Y)</code>。<b>第（3）条反过来不成立</b>：<code>E(XY)=E(X)E(Y)</code> 推不出独立，只能推出不相关（第 5 章会讲）。' },

    { t: 'callout', kind: 'tip', title: '线性性是最容易被低估的工具', html: '求 <code>E(X<sub>1</sub>+…+X<sub>n</sub>)</code> 时，无论各 <code>X<sub>i</sub></code> 是否独立、是否同分布，都可以直接拆成 <code>ΣE(X<sub>i</sub>)</code>。<b>「n 个随机变量之和的期望等于期望之和」没有任何前提</b>，这是概率论里最「免费」的一条性质，考试中大量题目靠它一步化简。' },

    { t: 'h', lvl: 2, text: '二、方差、标准差与计算捷径', id: 'ch04-2' },

    { t: 'p', html: '<b>方差（variance）</b>定义为 <code>Var(X) = E[(X-μ)<sup>2</sup>]</code>，其中 <code>μ = E(X)</code>；<b>标准差（standard deviation）</b>是 <code>σ = √Var(X)</code>。方差衡量「偏离均值的平方的平均」，标准差把它开方回原来的量纲。<b>报告结果时用标准差，做推导时用方差</b>，因为方差有更好的代数性质。' },

    { t: 'p', html: '直接按定义算要减去均值再平方，容易出错。实际计算几乎都用等价公式：<code>Var(X) = E(X<sup>2</sup>) - [E(X)]<sup>2</sup></code>。展开 <code>E[(X-μ)<sup>2</sup>] = E(X<sup>2</sup>) - 2μE(X) + μ<sup>2</sup> = E(X<sup>2</sup>) - μ<sup>2</sup></code> 即可验证。<b>这个公式省掉了「先算偏差」这一步，但也带来一个新风险：两个大数相减，容易因舍入误差出现负值</b>，若算出负方差，一定是 <code>E(X<sup>2</sup>)</code> 或 <code>μ</code> 算错了。' },

    { t: 'p', html: '方差的性质与期望不同，注意三条：<b>（1）平移不变</b>：<code>Var(X+b) = Var(X)</code>，因为整体平移不改变离散程度；<b>（2）缩放平方</b>：<code>Var(aX) = a<sup>2</sup>Var(X)</code>，因为偏差被放大 <code>a</code> 倍、平方后放大 <code>a<sup>2</sup></code> 倍；<b>（3）和不一定等于和</b>：<code>Var(X+Y) = Var(X)+Var(Y)+2Cov(X,Y)</code>，只有独立（或不相关）时协方差项才为 0。' },

    { t: 'compare', left: { title: '期望是线性的', html: '<code>E(X+Y) = E(X)+E(Y)</code> 恒成立；<code>E(aX) = aE(X)</code> 恒成立。无论独立与否。' }, right: { title: '方差不是线性的', html: '<code>Var(X+Y) = Var(X)+Var(Y)</code> <b>只在独立（或至少不相关）时成立</b>；一般情况下还要加 <code>2Cov(X,Y)</code>。这是第 5 章的重点。' } },

    { t: 'p', html: '一个具体算例：<code>X ~ B(10, 0.3)</code>。用公式 <code>E(X) = np = 3</code>，<code>Var(X) = np(1-p) = 2.1</code>，标准差 <code>≈ 1.449</code>。若用定义验证：<code>E(X<sup>2</sup>) = Var + μ<sup>2</sup> = 2.1 + 9 = 11.1</code>，而 <code>Σk<sup>2</sup>C(10,k)0.3<sup>k</sup>0.7<sup>10-k</sup></code> 确实收敛到 11.1。<b>「先背公式、再用定义抽查一两个」是检验自己是否真懂的好办法。</b>' },

    { t: 'h', lvl: 2, text: '三、矩与矩母函数', id: 'ch04-3' },

    { t: 'p', html: '<b>k 阶矩（moment）</b>指 <code>E(X<sup>k</sup>)</code>，<b>k 阶中心矩</b>指 <code>E[(X-μ)<sup>k</sup>]</code>。一阶原点矩是均值，二阶中心矩是方差，三阶中心矩衡量偏斜（skewness），四阶衡量尾部厚度（kurtosis）。<b>正态的偏度为 0、峰度为 3</b>（超额峰度 0），这两个数是「像不像正态」的常用判据。' },

    { t: 'p', html: '把所有矩打包成一个函数，就是<b>矩母函数（moment generating function, mgf）</b>：<code>M(t) = E(e<sup>tX</sup>)</code>，在 <code>t = 0</code> 附近存在。<b>它的核心性质有两条</b>：其一，<code>M<sup>(k)</sup>(0) = E(X<sup>k</sup>)</code>，第 <code>k</code> 阶导数在 0 处的值就是第 <code>k</code> 阶原点矩；其二，<b>分布与矩母函数一一对应</b>（在 <code>t=0</code> 的邻域内存在时），所以「认出 <code>M(t)</code> 的形式」等于「认出分布」，不必再算密度。' },

    { t: 'p', html: '第一条性质的证明只需交换求导与期望：<code>M′(t) = d/dt E(e<sup>tX</sup>) = E(Xe<sup>tX</sup>)</code>，令 <code>t=0</code> 得 <code>E(X)</code>；再求导得 <code>M″(0) = E(X<sup>2</sup>)</code>。<b>用 <code>M″(0) - [M′(0)]<sup>2</sup></code> 求方差，往往比直接积分快</b>，尤其是二项、泊松这类求和式分布。' },

    { t: 'table', head: ['分布', '矩母函数 <code>M(t)</code>', '适用范围'], rows: [
      ['<code>Bern(p)</code>', '<code>1-p+pe<sup>t</sup></code>', '所有 <code>t</code>'],
      ['<code>B(n,p)</code>', '<code>(1-p+pe<sup>t</sup>)<sup>n</sup></code>', '所有 <code>t</code>'],
      ['<code>Poi(λ)</code>', '<code>exp(λ(e<sup>t</sup>-1))</code>', '所有 <code>t</code>'],
      ['<code>Geo(p)</code>', '<code>pe<sup>t</sup>/(1-(1-p)e<sup>t</sup>)</code>', '<code>t &lt; -ln(1-p)</code>'],
      ['<code>Exp(λ)</code>', '<code>λ/(λ-t)</code>', '<code>t &lt; λ</code>'],
      ['<code>N(μ,σ<sup>2</sup>)</code>', '<code>exp(μt+σ<sup>2</sup>t<sup>2</sup>/2)</code>', '所有 <code>t</code>']
    ], caption: '认出形式比背下来更重要：见 <code>exp(λ(e<sup>t</sup>-1))</code> 就是泊松' },

    { t: 'p', html: '矩母函数真正的威力在<b>独立和</b>：若 <code>X,Y</code> 独立，则 <code>M<sub>X+Y</sub>(t) = E(e<sup>t(X+Y)</sup>) = E(e<sup>tX</sup>)E(e<sup>tY</sup>) = M<sub>X</sub>(t)M<sub>Y</sub>(t)</code>。<b>「相加」变成了「相乘」</b>，于是「两个独立泊松之和仍是泊松」只需一行：<code>exp(λ<sub>1</sub>(e<sup>t</sup>-1))·exp(λ<sub>2</sub>(e<sup>t</sup>-1)) = exp((λ<sub>1</sub>+λ<sub>2</sub>)(e<sup>t</sup>-1))</code>。同理可证二项（同 <code>p</code>）、正态、伽马的可加性。<b>这是第 5 章卷积与第 6 章中心极限定理的技术支点。</b>' },

    { t: 'callout', kind: 'warn', title: '矩母函数不一定存在', html: '柯西分布、对数正态等分布的 <code>E(e<sup>tX</sup>)</code> 在任何 <code>t ≠ 0</code> 处都发散，此时矩母函数不存在。<b>「不存在」不代表「没有矩」</b>：对数正态的所有矩都有限，但矩母函数仍不收敛。替代工具是<b>特征函数</b> <code>φ(t)=E(e<sup>itX</sup>)</code>，它对一切分布都存在，且同样有唯一性。本站不展开特征函数，但要知道矩母函数的适用是有边界的。' },

    { t: 'h', lvl: 2, text: '四、常见分布的均值与方差表', id: 'ch04-4' },

    { t: 'p', html: '下表是全课使用频率最高的一张表。建议做到<b>看到分布名就能报出均值与方差</b>，并知道参数的直观含义；推导可以忘，结论必须熟。' },

    { t: 'table', head: ['分布', '参数含义', '<code>E(X)</code>', '<code>Var(X)</code>'], rows: [
      ['<code>Bern(p)</code>', '<code>p</code> = 成功概率', '<code>p</code>', '<code>p(1-p)</code>'],
      ['<code>B(n,p)</code>', '<code>n</code> 次、每次 <code>p</code>', '<code>np</code>', '<code>np(1-p)</code>'],
      ['<code>Geo(p)</code>', '首次成功的试验次数', '<code>1/p</code>', '<code>(1-p)/p<sup>2</sup></code>'],
      ['<code>Poi(λ)</code>', '单位时间平均事件数', '<code>λ</code>', '<code>λ</code>'],
      ['<code>U(a,b)</code>', '区间端点', '<code>(a+b)/2</code>', '<code>(b-a)<sup>2</sup>/12</code>'],
      ['<code>Exp(λ)</code>', '发生率（均值 <code>1/λ</code>）', '<code>1/λ</code>', '<code>1/λ<sup>2</sup></code>'],
      ['<code>N(μ,σ<sup>2</sup>)</code>', '位置与尺度', '<code>μ</code>', '<code>σ<sup>2</sup></code>']
    ], caption: '泊松的均值等于方差，这是它最显著的特征' },

    { t: 'p', html: '表里有三条值得单独记：<b>泊松的均值与方差相等</b>，所以样本均值与样本方差差得远时，泊松假设就值得怀疑；<b>指数的标准差等于均值</b>，变异系数恒为 1，说明它相当「散」；<b>均匀的方差只依赖区间长度</b>，与位置无关，长度翻倍方差变四倍。这三条在第 7 章的模型诊断里都会用到。' },

    { t: 'p', html: '几何分布还有一条「无记忆」的离散版本：<code>P(X &gt; m+n | X &gt; m) = P(X &gt; n)</code>，与指数分布完全平行。<b>它的期望 <code>1/p</code> 常被误记成 <code>1/(1-p)</code></b>，检查办法是取 <code>p=1</code>：必然一次成功，期望应为 1，而 <code>1/p=1</code> 正确、<code>1/(1-p)</code> 发散。用极端值验算公式，是记忆分布参数最有效的方法。' },

    { t: 'h', lvl: 2, text: '五、切比雪夫不等式', id: 'ch04-5' },

    { t: 'p', html: '知道均值与方差，能在不知道分布形状的情况下说多少？<b>切比雪夫不等式（Chebyshev inequality）</b>给出一个保守但普适的答案：对任意 <code>k &gt; 0</code>，<code>P(|X-μ| ≥ kσ) ≤ 1/k<sup>2</sup></code>，等价地 <code>P(|X-μ| &lt; kσ) ≥ 1 - 1/k<sup>2</sup></code>。<b>它只用到均值与方差，不要求任何分布假设。</b>' },

    { t: 'p', html: '证明只有三行：<code>σ<sup>2</sup> = E[(X-μ)<sup>2</sup>] ≥ E[(X-μ)<sup>2</sup>·1<sub>{|X-μ|≥kσ}</sub>] ≥ k<sup>2</sup>σ<sup>2</sup>·P(|X-μ|≥kσ)</code>，两边除以 <code>k<sup>2</sup>σ<sup>2</sup></code> 即得。<b>核心思想是「把积分区域缩小到尾部，被积函数只会变小」</b>，这条「截断」技巧在概率不等式里反复出现（马尔可夫、切尔诺夫都是同一思路）。' },

    { t: 'table', head: ['<code>k</code>', '切比雪夫上界', '正态的精确值', '差距'], rows: [
      ['1', '1.000', '0.317', '界几乎无用'],
      ['2', '0.250', '0.046', '约 5 倍'],
      ['3', '0.111', '0.0027', '约 41 倍'],
      ['4', '0.063', '0.00006', '约 1000 倍']
    ], caption: '切比雪夫的界很松，但它是「无条件成立」的' },

    { t: 'p', html: '<b>界松不是缺点，是代价。</b>它不需要知道分布，所以对任何分布都成立；正态的 0.0027 依赖「恰好是正态」这个强假设。考试里切比雪夫通常出现在两类题：<b>一类是「用切比雪夫估计概率上界」</b>，直接代 <code>1/k<sup>2</sup></code>；<b>另一类是「样本量至少多大才能保证误差小于某值」</b>，把 <code>k = ε√n/σ</code> 代入解 <code>n</code>，这正是大数定律的初等版本。' },

    { t: 'callout', kind: 'exam', title: '一个必考的题型', html: '「设 <code>E(X)=μ, Var(X)=σ<sup>2</sup></code>，用切比雪夫不等式估计 <code>P(|X-μ| ≥ 2σ)</code> 的上界，并说明这个界是否可能达到。」答案：<code>≤ 1/4</code>；<b>可以达到</b>，构造取三个值 <code>-2σ, 0, 2σ</code> 的离散分布，各以 <code>1/8, 3/4, 1/8</code> 的概率取值，则均值 0、方差 <code>σ<sup>2</sup></code>、尾部概率恰为 <code>1/4</code>。<b>「界是否可达」是区分「会代公式」与「真懂」的题眼。</b>' },

    { t: 'h', lvl: 2, text: '六、期望与方差的性质和陷阱', id: 'ch04-6' },

    { t: 'p', html: '这一节把最容易出错的性质集中对比。它们单独看都不难，混在一起时错误率极高——因为期望与方差的性质「长得像但不一样」，而直觉往往站在错的那一边。' },

    { t: 'table', head: ['运算', '期望', '方差', '前提'], rows: [
      ['加常数', '<code>E(X+b)=E(X)+b</code>', '<code>Var(X+b)=Var(X)</code>', '无条件'],
      ['乘常数', '<code>E(aX)=aE(X)</code>', '<code>Var(aX)=a<sup>2</sup>Var(X)</code>', '无条件'],
      ['两变量和', '<code>E(X+Y)=E(X)+E(Y)</code>', '<code>Var(X+Y)=Var(X)+Var(Y)+2Cov</code>', '期望无条件；方差的简化需独立/不相关'],
      ['两变量积', '<code>E(XY)=E(X)E(Y)</code>', '无简单公式', '需独立'],
      ['函数', '<code>E(g(X))</code> 用 LOTUS', '<code>Var(g(X))</code> 也要 LOTUS', '非线性时 <code>E(g(X)) ≠ g(E(X))</code>']
    ], caption: '最后一行是最高频的误区：<code>E(X<sup>2</sup>) ≠ [E(X)]<sup>2</sup>' },

    { t: 'p', html: '关于 <code>E(g(X)) ≠ g(E(X))</code>，举一个能记住的例子：<code>X ~ U(0,2)</code>，<code>E(X)=1</code>，但 <code>E(X<sup>2</sup>) = ∫<sub>0</sub><sup>2</sup> x<sup>2</sup>/2 dx = 4/3 ≠ 1</code>。差额 <code>4/3 - 1 = 1/3</code> 正好是 <code>Var(X) = (2-0)<sup>2</sup>/12 = 1/3</code>，对应公式 <code>E(X<sup>2</sup>) = Var(X) + [E(X)]<sup>2</sup></code>。<b>只有当 <code>g</code> 是线性函数时，<code>E(g(X)) = g(E(X))</code> 才成立。</b>' },

    { t: 'p', html: '另一个高频陷阱：<b>「<code>E(XY)=E(X)E(Y)</code>」不能反推独立</b>。取 <code>X ~ U(-1,1)</code>，<code>Y = X<sup>2</sup></code>，则 <code>E(XY) = E(X<sup>3</sup>) = 0 = E(X)E(Y)</code>，但 <code>Y</code> 完全由 <code>X</code> 决定，显然不独立。<b>能反推的只有「不相关」，而「不相关」是比「独立」弱得多的条件</b>（第 5 章会正式区分）。这个反例几乎每张卷子都会用到。' },

    { t: 'h', lvl: 2, text: '七、常见错误与自检方法', id: 'ch04-7' },

    { t: 'table', head: ['错误', '表现', '纠正'], rows: [
      ['把 <code>E(g(X))</code> 写成 <code>g(E(X))</code>', '如 <code>E(X<sup>2</sup>)=(E X)<sup>2</sup></code>', '用 LOTUS 重新算，差额是方差'],
      ['方差算成负值', '<code>E(X<sup>2</sup>) &lt; μ<sup>2</sup></code>', '检查 <code>E(X<sup>2</sup>)</code> 的积分/求和'],
      ['独立条件漏写', '<code>Var(X+Y)=VarX+VarY</code> 无条件用', '先确认独立或不相关'],
      ['<code>E(XY)=E(X)E(Y)</code> 反推独立', '把不相关当独立', '不相关推不出独立'],
      ['期望不存在的分布硬算', '柯西分布「对称所以均值 0」', '先验证绝对收敛'],
      ['矩母函数越界使用', '对厚尾分布求 <code>M(t)</code>', '改用特征函数或不使用']
    ], caption: '六类错误中，前两条是期末丢分主力' },

    { t: 'p', html: '自检流程：<b>① 先问「期望是否存在」，厚尾分布要验绝对收敛；② 算 <code>E(X<sup>2</sup>)</code> 用 LOTUS，不先求 <code>X<sup>2</sup></code> 的分布；③ 方差用 <code>E(X<sup>2</sup>) - μ<sup>2</sup></code>，算完必须非负；④ 拆两变量和之前，确认独立或不相关，否则补协方差项；⑤ 用极端参数验算公式</b>（<code>p=1</code> 的几何、<code>n=1</code> 的二项、<code>λ→0</code> 的指数）；<b>⑥ 若用了矩母函数，检查 <code>t</code> 在收敛域内</b>。' },

    { t: 'quiz', qid: 'ch04-q1' },
    { t: 'quiz', qid: 'ch04-q2' },
    { t: 'quiz', qid: 'ch04-q3' },

    { t: 'keypoint', items: [
      { title: 'LOTUS 让「求 <code>g(X)</code> 的期望」不必先求分布', html: '<code>E(g(X)) = Σg(x)p(x)</code> 或 <code>∫g(x)f(x)dx</code>，直接用 <code>X</code> 的分布加权。' },
      { title: '期望线性无条件，方差不是', html: '<code>E(X+Y)=E(X)+E(Y)</code> 永远成立；<code>Var(X+Y)</code> 在独立时才等于方差之和。' },
      { title: '方差公式与符号检查', html: '<code>Var = E(X<sup>2</sup>) - μ<sup>2</sup></code> 必须非负；负值说明前一步算错。' },
      { title: '矩母函数的两大用途', html: '求矩（<code>M<sup>(k)</sup>(0)=E(X<sup>k</sup>)</code>）与识别分布（唯一性），独立和则变成函数相乘。' },
      { title: '常见分布的均值方差要背', html: '二项 <code>np, np(1-p)</code>；泊松 <code>λ, λ</code>；指数 <code>1/λ, 1/λ<sup>2</sup></code>；均匀 <code>(a+b)/2, (b-a)<sup>2</sup>/12</code>。' },
      { title: '切比雪夫普适但松', html: '<code>P(|X-μ|≥kσ) ≤ 1/k<sup>2</sup></code>，不依赖分布；正态实际值远小于它，差距就是「假设的价钱」。' }
    ] },

    { t: 'checklist', id: 'ch04', items: [
      '我能用定义与 LOTUS 分别算出 <code>E(X<sup>2</sup>)</code>，并说明为什么两者等价',
      '我能说出期望存在的条件，并举出期望不存在的例子',
      '我能证明 <code>Var(X)=E(X<sup>2</sup>)-[E(X)]<sup>2</sup></code>',
      '我能说出 <code>E(X+Y)=E(X)+E(Y)</code> 为什么不要求独立，而方差之和要求独立',
      '我能写出六个常见分布的 <code>E</code> 与 <code>Var</code>，并用极端参数验算',
      '我能用 <code>M′(0)</code> 与 <code>M″(0)</code> 求泊松的均值与方差',
      '我能用矩母函数证明两个独立泊松之和仍是泊松',
      '我知道矩母函数可能不存在，并知道替代工具是特征函数',
      '我能用切比雪夫不等式给出概率上界，并说明该界一般达不到',
      '我能举出 <code>E(XY)=E(X)E(Y)</code> 但 <code>X,Y</code> 不独立的例子'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 Hogg & Tanis 第 9 版 §2.2–2.4（期望、方差、矩）与 §4.1–4.2（矩母函数），对应 STA2001 Lecture 09–11。常见分布表只保留后续抽样与推断真正用到的七个；矩母函数表给出收敛域，是因为考试会问「<code>t</code> 在什么范围内成立」。切比雪夫的可达性构造取自课程习题的同类题。特征函数只提及不展开，若你的课程不考矩母函数存在性，可跳过该警告框。第 5 章会把协方差项正式引入，本章只需知道「方差之和需独立」这一条界限。' }
  ]
});
