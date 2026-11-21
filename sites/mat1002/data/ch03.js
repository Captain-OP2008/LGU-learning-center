/* =====================================================================
 * ch03.js · 第 3 章「泰勒展开与近似计算」
 * 教材对应：Thomas 第 10.8（泰勒多项式与泰勒级数）、10.9（收敛性）；
 * 二项级数取自 10.8 例与习题。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch03',
  num: '03',
  title: '泰勒展开与近似计算',
  en: 'TAYLOR SERIES AND APPROXIMATION',
  goals: [
    '说清泰勒多项式为什么是「在某点匹配直到 n 阶导数」的唯一 n 次多项式',
    '写出五个必背展开及其成立区间，并说明收敛半径各是多少',
    '用拉格朗日余项证明误差上界，并算出达到给定精度所需的阶数',
    '用级数展开求 <code>0/0</code> 型极限与无法初等积分的定积分',
    '避免「展开后只留低阶项」「在奇点处展开」「忘了收敛区间」三类错误'
  ],
  kp: [
    { id: 'ch03-1', title: '从线性逼近到泰勒多项式' },
    { id: 'ch03-2', title: '泰勒公式与拉格朗日余项' },
    { id: 'ch03-3', title: '五个必背展开' },
    { id: 'ch03-4', title: '用余项控制误差' },
    { id: 'ch03-5', title: '用级数求极限与积分' },
    { id: 'ch03-6', title: '二项级数' },
    { id: 'ch03-7', title: '展开中心的选择与陷阱' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么这一章是全课的枢纽', html: '前三章一直在问「级数收不收敛」，这一章开始问「收敛到哪个函数」。一旦能写 <code>f(x) = Σc<sub>n</sub>(x − a)<sup>n</sup></code>，你就同时拿到了三样东西：<b>近似</b>（截断成多项式）、<b>误差</b>（拉格朗日余项）、<b>算法</b>（逐项计算）。这也是计算器算 sin、e<sup>x</sup>、ln 的真实原理——不是查表，而是算多项式。后面 ch06 的多元泰勒公式只是把 <code>(x − a)</code> 换成一阶、二阶微分形式，思想完全一样。' },

    { t: 'p', lead: true, html: '本章的主线是一条「逼近精度逐级提升」的阶梯：常数逼近（<code>f(a)</code>）→ 线性逼近（切线）→ 二次逼近（匹配弯曲程度）→ n 次逼近。每升一级，就多匹配一个导数，误差就多降一阶。理论上，这一切由泰勒定理保证；实践上，你只需要记住五个展开和一套估误差的流程。' },

    { t: 'h', lvl: 2, text: '一、从线性逼近到泰勒多项式', id: 'ch03-1' },

    { t: 'p', html: '一元微积分里最熟的近似是切线：<code>f(x) ≈ f(a) + f′(a)(x − a)</code>。它保证在 <code>x = a</code> 处函数值与一阶导数都相同，所以曲线与切线在 a 点相切。但切线只有一条直线，弯曲的曲线很快偏离。自然的想法是：<b>再匹配二阶导数</b>，用一条抛物线去贴合弯曲程度；再匹配三阶导数，用三次曲线去贴合拐弯的变化。' },

    { t: 'p', html: '把这些要求写成方程，就得到泰勒多项式的构造。设 <code>P<sub>n</sub>(x) = c<sub>0</sub> + c<sub>1</sub>(x − a) + … + c<sub>n</sub>(x − a)<sup>n</sup></code>，要求 <code>P<sub>n</sub><sup>(k)</sup>(a) = f<sup>(k)</sup>(a)</code>（<code>k = 0, 1, …, n</code>）。逐次求导并代 <code>x = a</code>，得 <code>c<sub>k</sub> = f<sup>(k)</sup>(a)/k!</code>。于是 <b><code>P<sub>n</sub>(x) = Σ<sub>k=0</sub><sup>n</sup> f<sup>(k)</sup>(a)(x − a)<sup>k</sup>/k!</code></b>。这个推导只用到「多项式的 k 阶导数在 a 点等于 <code>k! c<sub>k</sub></code>」，是本章唯一需要记住的证明。' },

    { t: 'p', html: '为什么要除以 <code>k!</code>？因为对 <code>(x − a)<sup>k</sup></code> 连续求 k 次导会掉出 <code>k(k−1)…1 = k!</code>，除以它才能让系数恰好等于导数值。这也解释了为什么阶乘在级数里到处出现：它不是人为引入的，而是「匹配导数」这个要求的必然结果。' },

    { t: 'compare', left: { title: '线性化（一阶）', html: '<code>L(x) = f(a) + f′(a)(x − a)</code>。误差是 <code>O((x − a)<sup>2</sup>)</code>。优点：只需要一个导数，计算极快；缺点：离 a 稍远就偏。物理里的「小角近似 <code>sin θ ≈ θ</code>」就是 a = 0 的一阶泰勒。' }, right: { title: '二次逼近', html: '<code>Q(x) = f(a) + f′(a)(x − a) + f″(a)(x − a)<sup>2</sup>/2</code>。误差是 <code>O((x − a)<sup>3</sup>)</code>。它多匹配了凹凸性，所以在极值点附近明显更准。<code>cos θ ≈ 1 − θ<sup>2</sup>/2</code> 就是它。' } },

    { t: 'callout', kind: 'tip', title: '一个立刻能用的结论', html: '若 <code>f</code> 在 a 处 <code>n</code> 阶可导且 <code>P<sub>n</sub></code> 是它的泰勒多项式，则 <code>f(x) − P<sub>n</sub>(x) = o((x − a)<sup>n</sup>)</code>。也就是说，泰勒多项式是<b>唯一</b>一个「误差比 <code>(x − a)<sup>n</sup></code> 更高阶」的 n 次多项式。这条唯一性常用来做「系数比对」：如果已知 <code>f(x) = Σc<sub>n</sub>(x − a)<sup>n</sup></code>，那么 <code>c<sub>n</sub></code> 只能是 <code>f<sup>(n)</sup>(a)/n!</code>。' },

    { t: 'h', lvl: 2, text: '二、泰勒公式与拉格朗日余项', id: 'ch03-2' },

    { t: 'p', html: '<b>泰勒定理</b>：若 <code>f</code> 在包含 a 与 x 的区间上有 <code>n+1</code> 阶导数，则 <code>f(x) = P<sub>n</sub>(x) + R<sub>n</sub>(x)</code>，其中余项可写成<b>拉格朗日形式</b>：<code>R<sub>n</sub>(x) = f<sup>(n+1)</sup>(c)(x − a)<sup>n+1</sup>/(n+1)!</code>，<code>c</code> 是介于 a 与 x 之间的某个点。注意 c 的具体位置不知道，只知道它存在——这已经足够估误差，因为通常能给 <code>|f<sup>(n+1)</sup>|</code> 找一个上界 M，于是 <code>|R<sub>n</sub>| ≤ M|x − a|<sup>n+1</sup>/(n+1)!</code>。' },

    { t: 'p', html: '余项还有另一种<b>积分形式</b>：<code>R<sub>n</sub>(x) = ∫<sub>a</sub><sup>x</sup> f<sup>(n+1)</sup>(t)(x − t)<sup>n</sup>/n! dt</code>。它由「反复分部积分」得到，在估计积分型误差时更好用。考试里拉格朗日形式出现得更多，因为只要估导数的上界就行；但如果题目要求证明某个积分不等式，积分形式往往更直接。' },

    { t: 'table', head: ['余项形式', '表达式', '何时好用', '缺点'], rows: [
      ['拉格朗日', '<code>f<sup>(n+1)</sup>(c)(x−a)<sup>n+1</sup>/(n+1)!</code>', '只需估计导数的上界', 'c 未知，估计偏保守'],
      ['柯西', '<code>f<sup>(n+1)</sup>(c)(x−c)<sup>n</sup>(x−a)/(n+1)!</code>', '某些函数的误差更紧', '形式复杂，少用'],
      ['积分型', '<code>∫<sub>a</sub><sup>x</sup> f<sup>(n+1)</sup>(t)(x−t)<sup>n</sup>/n! dt</code>', '证明不等式、处理变号', '需要会估积分'],
      ['皮亚诺', '<code>o((x−a)<sup>n</sup>)</code>', '只关心极限与阶数', '不能给数值误差']
    ], caption: '四种余项说的是同一件事，选择标准是「你需要多精确的信息」' },

    { t: 'p', html: '皮亚诺余项值得单独说一句：它不给出数值，只给出<b>阶</b>。求极限时用它最方便，因为极限只关心「谁是更高阶的无穷小」。而一旦题目问「精确到小数点后几位」，就必须换拉格朗日或积分形式，因为你需要一个可以算出来的上界。' },

    { t: 'h', lvl: 2, text: '三、五个必背展开', id: 'ch03-3' },

    { t: 'p', html: '下面的五个展开必须背到「看见函数就能写出前三项，并说出收敛区间」的程度。它们不是五个孤立公式：后四个都能从前两个推出来，考试若忘了可以现场推，但会浪费时间。' },

    { t: 'table', head: ['函数', '展开式', '收敛区间'], rows: [
      ['<code>e<sup>x</sup></code>', '<code>Σ<sub>n=0</sub><sup>∞</sup> x<sup>n</sup>/n!</code>', '<code>(−∞, ∞)</code>'],
      ['<code>sin x</code>', '<code>Σ<sub>n=0</sub><sup>∞</sup> (−1)<sup>n</sup>x<sup>2n+1</sup>/(2n+1)!</code>', '<code>(−∞, ∞)</code>'],
      ['<code>cos x</code>', '<code>Σ<sub>n=0</sub><sup>∞</sup> (−1)<sup>n</sup>x<sup>2n</sup>/(2n)!</code>', '<code>(−∞, ∞)</code>'],
      ['<code>1/(1 − x)</code>', '<code>Σ<sub>n=0</sub><sup>∞</sup> x<sup>n</sup></code>', '<code>(−1, 1)</code>'],
      ['<code>ln(1 + x)</code>', '<code>Σ<sub>n=1</sub><sup>∞</sup> (−1)<sup>n−1</sup>x<sup>n</sup>/n</code>', '<code>(−1, 1]</code>'],
      ['<code>arctan x</code>', '<code>Σ<sub>n=0</sub><sup>∞</sup> (−1)<sup>n</sup>x<sup>2n+1</sup>/(2n+1)</code>', '<code>[−1, 1]</code>'],
      ['<code>(1 + x)<sup>α</sup></code>', '<code>1 + Σ<sub>n=1</sub><sup>∞</sup> α(α−1)…(α−n+1)x<sup>n</sup>/n!</code>', '<code>|x| &lt; 1</code>（端点看 α）']
    ], caption: '前五个按「匹配导数」直接算；后两个由 <code>1/(1 − x)</code> 积分或求导得到' },

    { t: 'p', html: '推导关系值得理一遍，这样忘了也能重建。<b>（1）</b><code>e<sup>x</sup></code> 的所有导数都是 <code>e<sup>x</sup></code>，在 0 处为 1，直接得 <code>Σx<sup>n</sup>/n!</code>。<b>（2）</b><code>sin</code> 的导数循环为 <code>cos, −sin, −cos, sin</code>，在 0 处取值 <code>0, 1, 0, −1</code> 循环，所以只剩奇次项且符号交替。<b>（3）</b><code>cos</code> 同理只剩偶次项。<b>（4）</b><code>1/(1 − x)</code> 是几何级数。<b>（5）</b><code>ln(1 + x)</code> 是 <code>1/(1 + t)</code> 从 0 到 x 的积分，把 <code>1/(1 + t) = Σ(−1)<sup>n</sup>t<sup>n</sup></code> 逐项积分即得。<b>（6）</b><code>arctan x</code> 是 <code>1/(1 + t<sup>2</sup>)</code> 的积分，同理。<b>（7）</b>二项级数由 <code>f<sup>(n)</sup>(0) = α(α−1)…(α−n+1)</code> 直接算。' },

    { t: 'callout', kind: 'warn', title: '三个最高频的展开错误', html: '<b>一、<code>sin</code> 写成 <code>x − x<sup>2</sup>/2 + …</code>：</b>sin 是奇函数，展开里不能有偶次项。<br><b>二、<code>ln(1 + x)</code> 写成 <code>x − x<sup>2</sup>/2 + x<sup>3</sup>/3 − …</code> 却把区间写成 <code>(−1, 1)</code>：</b>x = 1 处是交错调和级数，收敛，区间应为 <code>(−1, 1]</code>。<br><b>三、<code>(1 + x)<sup>α</sup></code> 忘记 <code>α</code> 不是正整数时级数无穷：</b>α 为正整数时它其实退化成有限多项式，此时「收敛区间」是全体实数。' },

    { t: 'h', lvl: 2, text: '四、用余项控制误差', id: 'ch03-4' },

    { t: 'p', html: '误差估计的标准流程有四步：<b>（1）</b>把函数展开到 <code>P<sub>n</sub></code>；<b>（2）</b>写出 <code>R<sub>n</sub></code> 的拉格朗日形式；<b>（3）</b>在 a 与 x 之间给 <code>|f<sup>(n+1)</sup>(c)|</code> 找上界 M；<b>（4）</b>解不等式 <code>M|x − a|<sup>n+1</sup>/(n+1)! &lt; ε</code> 得到 n。难点在第三步，因为 <code>c</code> 未知，必须找「对区间内所有 c 都成立」的上界。' },

    { t: 'p', html: '例：用 <code>e<sup>x</sup></code> 的展开近似 <code>e<sup>0.1</sup></code>，要求误差小于 <code>10<sup>−6</sup></code>。所有导数都是 <code>e<sup>c</sup></code>，而 <code>c ∈ (0, 0.1)</code> 时 <code>e<sup>c</sup> &lt; e<sup>0.1</sup> &lt; 1.11</code>。于是 <code>|R<sub>n</sub>| ≤ 1.11 · 0.1<sup>n+1</sup>/(n+1)!</code>。试 n = 3：<code>1.11 · 10<sup>−4</sup>/24 ≈ 4.6 × 10<sup>−6</sup></code>，还不够；n = 4：<code>1.11 · 10<sup>−5</sup>/120 ≈ 9.3 × 10<sup>−8</sup></code>，够了。所以取四项：<code>1 + 0.1 + 0.005 + 0.000167 ≈ 1.105167</code>。' },

    { t: 'p', html: '对 <code>sin x</code> 与 <code>cos x</code>，估计会简单得多，因为所有导数的绝对值都不超过 1，于是 <code>|R<sub>n</sub>| ≤ |x|<sup>n+1</sup>/(n+1)!</code>，与 x 无关的常数被彻底消掉。例：<code>sin x ≈ x − x<sup>3</sup>/6</code> 在 <code>|x| ≤ 1</code> 上的误差不超过 <code>1/5! = 1/120 ≈ 0.0083</code>。这就是为什么小角近似只在 <code>|θ|</code> 很小时才好用。' },

    { t: 'steps', items: [
      { title: '第一步 · 确定中心 a', html: '题目给的点就是 a；若要估整个区间上的误差，a 通常取区间中点以减小 <code>|x − a|</code>。' },
      { title: '第二步 · 展开到 n 阶', html: '写出 <code>P<sub>n</sub></code> 与 <code>R<sub>n</sub></code>；n 先猜一个，不够再升。' },
      { title: '第三步 · 估导数上界', html: '在 a 与 x 之间找 <code>|f<sup>(n+1)</sup>|</code> 的最大值；三角函数用 1，指数用区间端点，对数用 <code>1/(1 + c)</code> 的下界。' },
      { title: '第四步 · 解不等式定 n', html: '把上界代入 <code>M|x−a|<sup>n+1</sup>/(n+1)! &lt; ε</code>；阶乘增长极快，通常 n 只要 5–8。' },
      { title: '第五步 · 给出近似值', html: '代入数值算 <code>P<sub>n</sub>(x)</code>；最后写明「误差不超过 ε」，这是得分点。' }
    ] },

    { t: 'h', lvl: 2, text: '五、用级数求极限与积分', id: 'ch03-5' },

    { t: 'p', html: '洛必达法则能处理的 <code>0/0</code> 型极限，泰勒展开几乎都能处理，而且往往更快。做法是把分子分母各展开到<b>同一阶</b>，消去主导项，剩下的最低阶项决定极限。关键是「展开到哪一阶」：展开不够会得到 <code>0/0</code>，展开过头只是多算。经验法则是展开到<b>分母的最低非零阶</b>为止。' },

    { t: 'p', html: '例：<code>lim<sub>x→0</sub> (sin x − x)/x<sup>3</sup></code>。展开 <code>sin x = x − x<sup>3</sup>/6 + O(x<sup>5</sup>)</code>，分子为 <code>−x<sup>3</sup>/6 + O(x<sup>5</sup>)</code>，除以 <code>x<sup>3</sup></code> 得 <code>−1/6 + O(x<sup>2</sup>)</code>，极限 <code>−1/6</code>。若用洛必达要做三次，每次都要小心符号；展开只需一行。' },

    { t: 'p', html: '级数还能算「积不出来」的积分。例：<code>∫<sub>0</sub><sup>1</sup> e<sup>−x<sup>2</sup></sup> dx</code> 没有初等原函数，但把 <code>e<sup>−t</sup> = Σ(−1)<sup>n</sup>t<sup>n</sup>/n!</code> 中的 t 换成 <code>x<sup>2</sup></code>，得 <code>e<sup>−x<sup>2</sup></sup> = Σ(−1)<sup>n</sup>x<sup>2n</sup>/n!</code>，逐项积分得 <code>Σ(−1)<sup>n</sup>/((2n+1)n!)</code>。前五项给出 <code>1 − 1/3 + 1/10 − 1/42 + 1/216 ≈ 0.7475</code>，与真值 0.7468 相差不到 0.001。' },

    { t: 'p', html: '这类题的标准写法是：<b>（1）</b>写出被积函数的展开并说明收敛区间包含积分区间；<b>（2）</b>逐项积分（依据 ch02 的逐项积分定理）；<b>（3）</b>若要求数值，用交错级数的误差界截断。三步里第一步最容易漏，如果积分区间超出收敛半径，逐项积分就是非法的。' },

    { t: 'h', lvl: 2, text: '六、二项级数', id: 'ch03-6' },

    { t: 'p', html: '<b>二项级数</b>：对任意实数 <code>α</code>，<code>(1 + x)<sup>α</sup> = 1 + αx + α(α−1)x<sup>2</sup>/2! + …</code>，即 <code>Σ<sub>n=0</sub><sup>∞</sup> C(α, n)x<sup>n</sup></code>，其中 <code>C(α, n) = α(α−1)…(α−n+1)/n!</code>。当 α 是非负整数时，从 <code>n = α + 1</code> 起系数为 0，级数退化成有限和，这正是二项定理。当 α 不是整数时，级数无穷，收敛半径为 1。' },

    { t: 'p', html: '最常用的三个特例：<code>√(1 + x) = 1 + x/2 − x<sup>2</sup>/8 + x<sup>3</sup>/16 − …</code>（α = 1/2）；<code>1/√(1 + x) = 1 − x/2 + 3x<sup>2</sup>/8 − …</code>（α = −1/2）；<code>1/(1 + x) = 1 − x + x<sup>2</sup> − …</code>（α = −1，就是几何级数）。这三个在物理的近似计算里出现频率极高，例如单摆周期的小角修正、相对论的低速展开。' },

    { t: 'callout', kind: 'ai', title: '让 AI 帮你检查展开，而不是替你展开', html: '泰勒展开是最容易被 AI 生成得「看起来对、其实错一项」的内容：符号、阶乘、奇偶性任一处出错都不显眼。有效的用法是：你自己先写，再让 AI 逐项核对「第 n 项系数是否等于 <code>f<sup>(n)</sup>(a)/n!</code>」；或者反过来，让 AI 给一个展开，你来验算前三阶导数。不要直接抄它的结果，因为阅卷看的是推导过程，而过程只有你自己写得出来。' },

    { t: 'h', lvl: 2, text: '七、展开中心的选择与陷阱', id: 'ch03-7' },

    { t: 'p', html: '展开中心 a 不一定是 0。题目说「在 x = 2 处展开」，就必须用 <code>(x − 2)<sup>n</sup></code>，系数是 <code>f<sup>(n)</sup>(2)/n!</code>。选 a 的原则是<b>让函数在 a 处好算</b>：<code>ln x</code> 在 <code>x = 1</code> 处展开（得 <code>ln(1 + (x − 1))</code>），<code>√x</code> 在 <code>x = 4</code> 处展开（因为 <code>√4 = 2</code> 好算），<code>e<sup>x</sup></code> 在 0 处。选错中心不会致命，但会让系数变成难看的数。' },

    { t: 'p', html: '四个必须避开的陷阱。<b>一、在奇点处展开：</b><code>ln x</code> 不能在 <code>x = 0</code> 展开，因为函数在 0 处没有定义、导数发散。<b>二、忘记收敛区间：</b>展开式只在收敛区间内等于原函数；在区间外，级数可能收敛到别的值（<code>ln(1 + x)</code> 在 <code>x &gt; 1</code> 时级数发散），也可能根本不收敛。<b>三、只留低阶项却声称「精确」：</b>没有余项估计就不能说误差多大。<b>四、复合时忘记换元范围：</b><code>e<sup>−x<sup>2</sup></sup></code> 的展开对一切 x 成立，但 <code>ln(1 + x<sup>2</sup>)</code> 的展开要求 <code>|x| &lt; 1</code>，因为外层 ln 的收敛区间是 <code>(−1, 1]</code> 而内层是 <code>x<sup>2</sup></code>。' },

    { t: 'table', head: ['函数', '推荐中心', '原因'], rows: [
      ['<code>e<sup>x</sup>, sin x, cos x</code>', '0', '导数在 0 处取值简单，展开最整洁'],
      ['<code>ln x</code>', '1', '0 是奇点；在 1 处得 <code>ln(1 + t)</code> 标准形'],
      ['<code>√x</code>', '4 或 9', '<code>√4 = 2</code> 好算，且 <code>√(4 + t) = 2√(1 + t/4)</code>'],
      ['<code>1/x</code>', '1', '0 是奇点；<code>1/(1 + t)</code> 是几何级数'],
      ['<code>arctan x</code>', '0', '导数 <code>1/(1 + x<sup>2</sup>)</code> 在 0 处展开最方便']
    ], caption: '中心选得好，系数就是 <code>1/n!</code> 这种干净形式；选得差，系数会带一堆幂' },

    { t: 'terms', items: [
      { en: 'Taylor polynomial', zh: '泰勒多项式', html: '在 a 处匹配 f 直到 n 阶导数的 n 次多项式 <code>P<sub>n</sub></code>。' },
      { en: 'Taylor series', zh: '泰勒级数', html: '<code>Σf<sup>(n)</sup>(a)(x−a)<sup>n</sup>/n!</code>；在收敛区间内等于 f。' },
      { en: 'remainder', zh: '余项', html: '<code>R<sub>n</sub> = f − P<sub>n</sub></code>；拉格朗日形式用中值点 c 表示。' },
      { en: 'Maclaurin series', zh: '麦克劳林级数', html: '中心 a = 0 的泰勒级数；五个必背展开都是它。' },
      { en: 'binomial series', zh: '二项级数', html: '<code>(1 + x)<sup>α</sup></code> 的展开；α 非整数时无穷、半径 1。' },
      { en: 'order of approximation', zh: '逼近阶', html: '误差是 <code>O((x−a)<sup>n+1</sup>)</code> 时称 n 阶逼近。' },
      { en: 'singularity', zh: '奇点', html: '函数或导数无定义的点；不能在奇点处展开。' }
    ] },

    { t: 'quiz', qid: 'ch03-q1' },
    { t: 'quiz', qid: 'ch03-q2' },
    { t: 'quiz', qid: 'ch03-q3' },

    { t: 'keypoint', items: [
      { title: '系数公式来自匹配导数', html: '<code>c<sub>k</sub> = f<sup>(k)</sup>(a)/k!</code>；阶乘是「连续求导掉出 k!」的必然结果。' },
      { title: '余项决定一切', html: '拉格朗日余项给数值上界，皮亚诺余项只给阶；求极限用后者，估精度用前者。' },
      { title: '五个展开加两个推论', html: '<code>e<sup>x</sup></code>、<code>sin</code>、<code>cos</code>、<code>1/(1−x)</code>、<code>ln(1+x)</code>，再由积分得 <code>arctan</code>、由导数得二项级数。' },
      { title: '区间必须写', html: '<code>ln(1+x)</code> 是 <code>(−1, 1]</code>，<code>arctan</code> 是 <code>[−1, 1]</code>，别一律写 <code>(−1, 1)</code>。' },
      { title: '极限展开到分母的阶', html: '展开不足会残留 <code>0/0</code>，展开过头只是浪费；以分母最低非零阶为准。' },
      { title: '中心要选在好算的点', html: '在奇点处不能展开；中心选得对，系数才干净、误差才小。' }
    ] },

    { t: 'checklist', id: 'ch03', items: [
      '我能推导 <code>c<sub>k</sub> = f<sup>(k)</sup>(a)/k!</code>，并解释为什么除以阶乘',
      '我能写出泰勒定理并说明拉格朗日余项里 c 的含义',
      '我能默写五个必背展开及各自的收敛区间',
      '我能从 <code>1/(1−x)</code> 出发，通过积分得到 <code>ln(1+x)</code> 与 <code>arctan x</code> 的展开',
      '我能给定精度，用拉格朗日余项算出需要展开到第几阶',
      '我能用展开求 <code>(sin x − x)/x<sup>3</sup></code> 这类极限，并说明展开到几阶',
      '我能把 <code>e<sup>−x<sup>2</sup></sup></code> 逐项积分并给出数值近似',
      '我能写出二项级数，并说出 α 为整数与非整数时的差别',
      '我能说出至少三个泰勒展开的常见错误，并各给一个反例'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应 Thomas《Calculus》第 13 版 SI 单位第 10.8 节（泰勒多项式与泰勒级数）与 10.9 节（收敛性）。拉格朗日余项与积分型余项均取自 10.8 的定理；二项级数在 10.8 的例与习题中出现，课程大纲把它列为必备内容。本章不讨论多元泰勒公式的完整形式（那属于教材 14.10，按大纲跳过），只在 ch06 末尾给二阶判别式时用到「二阶展开」的想法。复变函数视角的收敛半径解释（奇点距离）超出本课范围，正文只用「比值法算半径」这一条路径。' }
  ]
});
