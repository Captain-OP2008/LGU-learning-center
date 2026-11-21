/* =====================================================================
 * ch06.js · 第 6 章「多元函数与偏导数：生产的两个方向」
 * 职责：从一元进入多元：偏导、全微分、隐函数、齐次函数与
 *       二元极值，全部围绕生产与效用两个经济场景。
 * 依据：Essential Mathematics for Economic Analysis（5th ed）第 13–15 章
 *       的多元函数与偏导数部分。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch06',
  num: '06',
  title: '多元函数与偏导数：生产的两个方向',
  en: 'MULTIVARIABLE FUNCTIONS',
  goals: [
    '写出二元函数的定义域，并画出等值线（等产量线、无差异曲线）',
    '计算一阶与二阶偏导，解释边际产品与边际替代率的含义',
    '用全微分与链式法则估算多变量同时变化的影响',
    '用隐函数求导求等值线斜率，理解边际替代率递减',
    '用齐次函数与欧拉定理分析规模报酬，用 Hessian 判别二元极值'
  ],
  kp: [
    { id: 'ch06-1', title: '二元函数与等值线' },
    { id: 'ch06-2', title: '偏导数与边际产品' },
    { id: 'ch06-3', title: '全微分与链式法则' },
    { id: 'ch06-4', title: '二阶偏导与 Young 定理' },
    { id: 'ch06-5', title: '隐函数与边际替代率' },
    { id: 'ch06-6', title: '齐次函数与欧拉定理' },
    { id: 'ch06-7', title: 'Cobb-Douglas 生产函数' },
    { id: 'ch06-8', title: '二元极值与 Hessian 判别' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '经济选择几乎都是多变量的', html: '消费者同时决定买多少苹果和多少面包，厂商同时选择资本与劳动，投资者同时配置股票与债券。只用一个变量的模型是简化，真实决策至少有两个方向。多元函数带来的新问题是：<b>「多一单位」到底指哪个变量多一单位</b>？这就引出了偏导数。把其它变量按住不动、只让一个变量变，得到的边际量才是经济学想要的「其它条件不变」下的效果。' },

    { t: 'p', lead: true, html: '二元函数 <code>z = f(x, y)</code> 把一对输入映到一个输出。经济里最常见的两个例子是生产函数 <code>Q = F(K, L)</code>（资本与劳动产出产量）与效用函数 <code>U = U(x, y)</code>（两种商品带来效用）。它们的图形是一张曲面，画在纸上只能画<b>等值线（level curve）</b>：把函数值相同的点连起来，得到等产量线或等无差异曲线。' },

    { t: 'p', html: '这一章的主线是「按住一个、动另一个」。偏导数就是这种操作的数学化；全微分把两个方向的变化合起来；隐函数求导给出等值线的斜率；齐次函数与欧拉定理处理「所有投入同比例变化」；Hessian 矩阵把一元二阶条件推广到二元。每一块都对应一个经济问题，不是纯技术。' },

    { t: 'h', lvl: 2, text: '一、二元函数与等值线', id: 'ch06-1' },

    { t: 'p', html: '二元函数 <code>z = f(x, y)</code> 的定义域是平面上的一个区域，通常要求 <code>x ≥ 0, y ≥ 0</code>（投入、消费量非负）。值域是 z 可能的取值范围。判断定义域时要注意分母不为零、根号内非负、对数内为正，这些规则与一元函数一样，只是要对两个变量分别检查。' },

    { t: 'p', html: '等值线是把 <code>f(x, y) = c</code> 的所有点连成的曲线。生产函数 <code>Q = 10K<sup>0.3</sup>L<sup>0.7</sup></code> 取 <code>Q = 80</code>，得 <code>10K<sup>0.3</sup>L<sup>0.7</sup> = 80</code>，即 <code>K<sup>0.3</sup>L<sup>0.7</sup> = 8</code>。两边取对数可解出 <code>L</code> 关于 <code>K</code> 的表达式，画出来是一条向右下方倾斜、凸向原点的曲线——这就是<b>等产量线（isoquant）</b>。' },

    { t: 'p', html: '等值线的形状传递重要信息。生产函数的等产量线凸向原点，表示「资本越多，替代同样劳动所需的资本增量越小」，即边际技术替代率递减；效用函数的无差异曲线同理，表示「一种商品越多，为换另一商品愿意放弃的越少」。如果等值线是直线，表示两种投入完全替代；如果是 L 形，表示完全互补（里昂惕夫生产函数）。' },

    { t: 'p', html: '画等值线的方法：固定 c，解出 <code>y = g(x)</code>，再按一元函数作图。对 Cobb-Douglas，<code>K<sup>α</sup>L<sup>β</sup> = c</code> 给出 <code>L = (c/K<sup>α</sup>)<sup>1/β</sup></code>，是一条凸曲线。对线性函数 <code>2x + 3y = c</code>，等值线是斜率 <code>−2/3</code> 的直线，经济上对应「完全替代」的偏好或投入。' },

    { t: 'table', head: ['函数类型', '等值线形状', '经济含义'], rows: [
      ['<code>Q = 10K<sup>0.3</sup>L<sup>0.7</sup></code>', '凸向原点的曲线', '两种投入可替代，替代率递减'],
      ['<code>U = xy</code>', '双曲线', '标准的凸偏好，边际替代率递减'],
      ['<code>U = 2x + 3y</code>', '直线', '完全替代品，替代率恒定'],
      ['<code>U = min(x, y)</code>', 'L 形折线', '完全互补品，必须按比例消费'],
      ['<code>Q = K + L</code>', '直线', '投入完全替代，规模报酬不变']
    ], caption: '等值线的弯曲程度就是「替代的难易程度」' },

    { t: 'h', lvl: 2, text: '二、偏导数与边际产品', id: 'ch06-2' },

    { t: 'p', html: '偏导数（partial derivative）<code>∂f/∂x</code> 的定义是：把 y 当作常数，只让 x 变化，得到的导数。记号用 <code>∂</code> 而不是 <code>d</code>，提醒你还有别的变量。<code>∂f/∂x</code> 也可以写成 <code>f<sub>x</sub></code>。求偏导的操作与一元求导完全相同，只是其它变量按常数处理。' },

    { t: 'p', html: '例：<code>z = 3x<sup>2</sup>y + 5y<sup>3</sup></code>。对 x 求偏导时把 y 当常数：<code>z<sub>x</sub> = 6xy</code>；对 y 求偏导时把 x 当常数：<code>z<sub>y</sub> = 3x<sup>2</sup> + 15y<sup>2</sup></code>。在点 <code>(2, 1)</code> 处，<code>z<sub>x</sub> = 12</code>、<code>z<sub>y</sub> = 12 + 15 = 27</code>。含义是：在这一点，x 增加 1 单位，z 约增加 12；y 增加 1 单位，z 约增加 27。' },

    { t: 'p', html: '经济上，生产函数 <code>Q = F(K, L)</code> 的偏导就是<b>边际产品（marginal product）</b>：<code>∂Q/∂K = MP<sub>K</sub></code> 是资本多一单位带来的产量增量，<code>∂Q/∂L = MP<sub>L</sub></code> 是劳动多一单位带来的产量增量。对 Cobb-Douglas <code>Q = 10K<sup>0.3</sup>L<sup>0.7</sup></code>，<code>MP<sub>K</sub> = 3K<sup>−0.7</sup>L<sup>0.7</sup></code>，在 <code>K = L = 8</code> 处等于 3；<code>MP<sub>L</sub> = 7K<sup>0.3</sup>L<sup>−0.3</sup></code>，在同样点等于 7。' },

    { t: 'p', html: '注意 <code>MP<sub>K</sub> = 3</code> 与 <code>Q/K = 80/8 = 10</code> 不同：前者是「再多一单位资本」的边际增量，后者是平均每单位资本的产量。边际与平均的关系在 ch04 的平均成本—边际成本里已经见过：边际低于平均时平均下降，边际高于平均时平均上升。这里 <code>MP<sub>K</sub> = 3 &lt; AP<sub>K</sub> = 10</code>，说明资本的平均产出在下降。' },

    { t: 'quiz', qid: 'ch06-q1' },

    { t: 'h', lvl: 2, text: '三、全微分与链式法则', id: 'ch06-3' },

    { t: 'p', html: '当 x 与 y 同时发生小变化 <code>dx</code>、<code>dy</code> 时，函数的变化量近似为<b>全微分（total differential）</b>：<code>dz = z<sub>x</sub>dx + z<sub>y</sub>dy</code>。它把两个方向的贡献线性叠加，是一阶近似。dx、dy 越小，近似越准；交叉项 <code>z<sub>xy</sub>dxdy</code> 是二阶小量，被忽略。' },

    { t: 'p', html: '例：生产函数在 <code>(K, L) = (8, 8)</code> 处，<code>MP<sub>K</sub> = 3</code>、<code>MP<sub>L</sub> = 7</code>。若资本与劳动各增加 0.1，则 <code>dQ ≈ 3×0.1 + 7×0.1 = 1.0</code>，产量约从 80 增到 81。精确计算会略高一点（因为交叉项为正），但 1.0 已经足够做决策判断。全微分让「两个投入同时小幅调整」的估算变成一次加乘。' },

    { t: 'p', html: '多元链式法则处理「中间变量」：若 <code>z = f(x, y)</code> 且 <code>x = x(t)</code>、<code>y = y(t)</code>，则 <code>dz/dt = z<sub>x</sub>·x′(t) + z<sub>y</sub>·y′(t)</code>。这与一元链式法则结构一致，只是每个方向都要乘上自己的「内层导数」，再相加。' },

    { t: 'p', html: '例：<code>z = x<sup>2</sup>y</code>，<code>x = t<sup>2</sup></code>，<code>y = t<sup>3</sup></code>。直接代入得 <code>z = t<sup>7</sup></code>，<code>dz/dt = 7t<sup>6</sup></code>。用链式法则验证：<code>z<sub>x</sub> = 2xy = 2t<sup>5</sup></code>、<code>x′ = 2t</code>，第一项 <code>4t<sup>6</sup></code>；<code>z<sub>y</sub> = x<sup>2</sup> = t<sup>4</sup></code>、<code>y′ = 3t<sup>2</sup></code>，第二项 <code>3t<sup>6</sup></code>；合计 <code>7t<sup>6</sup></code> ✓。' },

    { t: 'p', html: '经济上，链式法则处理「时间中的复合变化」。例如产量随资本与劳动随时间增长：<code>dQ/dt = MP<sub>K</sub>·dK/dt + MP<sub>L</sub>·dL/dt</code>，这就是<b>增长核算（growth accounting）</b>的基本式：产出增长率等于各投入增长率乘以其产出弹性之和，再加上技术进步项。这个公式在宏观经济学里天天用。' },

    { t: 'h', lvl: 2, text: '四、二阶偏导与 Young 定理', id: 'ch06-4' },

    { t: 'p', html: '偏导数还可以再求偏导，得到四个二阶偏导：<code>z<sub>xx</sub></code>、<code>z<sub>yy</sub></code>（纯二阶）与 <code>z<sub>xy</sub></code>、<code>z<sub>yx</sub></code>（交叉二阶）。<b>Young 定理</b>指出：若二阶偏导连续，则 <code>z<sub>xy</sub> = z<sub>yx</sub></code>，求导次序无关。这条定理让你可以任选次序计算，通常先算简单的那个。' },

    { t: 'p', html: '例：<code>z = 3x<sup>2</sup>y + 5y<sup>3</sup></code>。已算 <code>z<sub>x</sub> = 6xy</code>、<code>z<sub>y</sub> = 3x<sup>2</sup> + 15y<sup>2</sup></code>。于是 <code>z<sub>xx</sub> = 6y</code>、<code>z<sub>xy</sub> = 6x</code>、<code>z<sub>yx</sub> = 6x</code>、<code>z<sub>yy</sub> = 30y</code>。在 <code>(2,1)</code> 处：<code>z<sub>xx</sub> = 6</code>、<code>z<sub>xy</sub> = 12</code>、<code>z<sub>yy</sub> = 30</code>。' },

    { t: 'p', html: '二阶偏导的经济含义：<code>z<sub>xx</sub> &lt; 0</code> 表示「x 的边际产出随 x 增加而递减」（边际报酬递减）；<code>z<sub>xy</sub></code> 的符号表示两种投入的<b>交叉效应</b>：若 <code>z<sub>xy</sub> &gt; 0</code>，资本增加会提高劳动的边际产出（协同），若 <code>z<sub>xy</sub> &lt; 0</code>，则是替代关系（一种投入多了，另一种的边际价值下降）。Cobb-Douglas 的 <code>Q<sub>KL</sub> &gt; 0</code>，说明资本与劳动是协同的。' },

    { t: 'table', head: ['二阶偏导', '记号', '经济读法'], rows: [
      ['纯二阶（x）', '<code>z<sub>xx</sub></code>', 'x 的边际效应随 x 递减还是递增'],
      ['纯二阶（y）', '<code>z<sub>yy</sub></code>', 'y 的边际效应随 y 递减还是递增'],
      ['交叉二阶', '<code>z<sub>xy</sub> = z<sub>yx</sub></code>', '一种投入增加对另一种边际产出的影响'],
      ['判别式', '<code>D = z<sub>xx</sub>z<sub>yy</sub> − z<sub>xy</sub><sup>2</sup></code>', '二元极值判别用，下一节展开']
    ], caption: 'Young 定理保证交叉偏导与次序无关，考试里可任选好算的顺序' },

    { t: 'h', lvl: 2, text: '五、隐函数与边际替代率', id: 'ch06-5' },

    { t: 'p', html: '等值线 <code>f(x, y) = c</code> 把 y 隐式地定义为 x 的函数。即使解不出显式表达式，也能求斜率：两边对 x 求导，用链式法则得 <code>f<sub>x</sub> + f<sub>y</sub>·dy/dx = 0</code>，所以 <code>dy/dx = −f<sub>x</sub>/f<sub>y</sub></code>（<code>f<sub>y</sub> ≠ 0</code>）。这就是<b>隐函数求导（implicit differentiation）</b>。' },

    { t: 'p', html: '例：圆 <code>x<sup>2</sup> + y<sup>2</sup> = 25</code>。两边对 x 求导得 <code>2x + 2y·y′ = 0</code>，所以 <code>y′ = −x/y</code>。在点 <code>(3, 4)</code> 处，<code>y′ = −3/4</code>。这个斜率是负的，说明在第一象限里圆是递减的；在 <code>(0,5)</code> 处斜率为 0（水平切线），在 <code>(5,0)</code> 处斜率不存在（垂直切线）。' },

    { t: 'p', html: '经济上，等产量线的斜率取负号就是<b>边际技术替代率（MRTS）</b>：<code>MRTS = −dL/dK = MP<sub>K</sub>/MP<sub>L</sub></code>，表示「为保持产量不变，增加一单位资本可以少用多少劳动」。无差异曲线的斜率取负号是<b>边际替代率（MRS）</b>：<code>MRS = MU<sub>x</sub>/MU<sub>y</sub></code>，表示为保持效用不变，增加一单位 x 可以放弃多少 y。' },

    { t: 'p', html: '例：<code>U = x<sup>0.5</sup>y<sup>0.5</sup></code>。<code>MU<sub>x</sub> = 0.5x<sup>−0.5</sup>y<sup>0.5</sup></code>、<code>MU<sub>y</sub> = 0.5x<sup>0.5</sup>y<sup>−0.5</sup></code>，所以 <code>MRS = MU<sub>x</sub>/MU<sub>y</sub> = y/x</code>。用隐函数法验证：<code>x<sup>0.5</sup>y<sup>0.5</sup> = c</code> 两边求导得 <code>0.5x<sup>−0.5</sup>y<sup>0.5</sup> + 0.5x<sup>0.5</sup>y<sup>−0.5</sup>y′ = 0</code>，解得 <code>y′ = −y/x</code>，取负号正是 <code>y/x</code> ✓。' },

    { t: 'p', html: 'MRS 随 x 增加而递减（<code>y/x</code> 在 x 变大时变小），这就是「边际替代率递减」，对应无差异曲线凸向原点。它是消费者偏好「多样化」的数学表达：已经有很多 x 时，再要一单位 x 只愿意放弃很少的 y。生产里的 MRTS 递减同理，说明两种投入不能无限替代。' },

    { t: 'h', lvl: 2, text: '六、齐次函数与欧拉定理', id: 'ch06-6' },

    { t: 'p', html: '若 <code>f(tx, ty) = t<sup>k</sup>f(x, y)</code> 对所有 <code>t &gt; 0</code> 成立，称 f 是 <b>k 次齐次函数（homogeneous of degree k）</b>。经济含义是「所有投入同比例放大 t 倍，产出放大 <code>t<sup>k</sup></code> 倍」：k=1 是规模报酬不变，k&gt;1 是递增，k&lt;1 是递减。Cobb-Douglas <code>Q = AK<sup>α</sup>L<sup>β</sup></code> 的齐次次数是 <code>α+β</code>。' },

    { t: 'p', html: '检验：<code>Q = 10K<sup>0.3</sup>L<sup>0.7</sup></code>，把 K、L 都换成 tK、tL，得 <code>10(tK)<sup>0.3</sup>(tL)<sup>0.7</sup> = 10t<sup>0.3+0.7</sup>K<sup>0.3</sup>L<sup>0.7</sup> = t·Q</code>，所以是 1 次齐次，规模报酬不变。若指数改为 0.4 与 0.7，和为 1.1，则是递增规模报酬；若改为 0.2 与 0.6，和为 0.8，则是递减。' },

    { t: 'p', html: '<b>欧拉定理（Euler theorem）</b>：若 f 是 k 次齐次且可微，则 <code>x·f<sub>x</sub> + y·f<sub>y</sub> = k·f</code>。对规模报酬不变的生产函数（k=1），即 <code>K·MP<sub>K</sub> + L·MP<sub>L</sub> = Q</code>：按边际产品付酬，正好把总产出分配完，不多不少。这是「边际生产力分配论」的数学基础。' },

    { t: 'p', html: '验证：<code>Q = 10K<sup>0.3</sup>L<sup>0.7</sup></code> 在 <code>K = L = 8</code> 处，<code>Q = 80</code>、<code>MP<sub>K</sub> = 3</code>、<code>MP<sub>L</sub> = 7</code>，于是 <code>8×3 + 8×7 = 24 + 56 = 80 = Q</code> ✓。这个恒等式在考试里常用来「已知边际产品求产出」或「验证齐次次数」，比重新代入快得多。' },

    { t: 'p', html: '一个有用的推论：对 k 次齐次函数，偏导 <code>f<sub>x</sub></code> 是 <code>k−1</code> 次齐次的。所以规模报酬不变的生产函数，其边际产品是 0 次齐次的——所有投入同比例增加，边际产品不变。这解释了为什么「规模报酬不变」常与「长期均衡中厂商利润为零」一起出现：边际产品不随规模变化，竞争会把价格压到平均成本。' },

    { t: 'quiz', qid: 'ch06-q2' },

    { t: 'h', lvl: 2, text: '七、Cobb-Douglas 生产函数', id: 'ch06-7' },

    { t: 'p', html: 'Cobb-Douglas 形式 <code>Q = AK<sup>α</sup>L<sup>β</sup></code>（A&gt;0，α、β&gt;0）是经济学里使用最广的生产函数。它的偏导 <code>MP<sub>K</sub> = αQ/K</code>、<code>MP<sub>L</sub> = βQ/L</code>，形式极简；产出弹性是常数 α 与 β：资本增加 1%，产出增加 α%；劳动增加 1%，产出增加 β%。' },

    { t: 'p', html: '这个「弹性等于指数」的性质是 Cobb-Douglas 最方便的地方。因为 <code>∂ln Q/∂ln K = α</code>，取对数后 <code>ln Q = ln A + α ln K + β ln L</code>，变成线性方程，可以直接用回归估计。计量经济学里大量生产函数研究都从这一步开始。' },

    { t: 'p', html: '边际技术替代率 <code>MRTS = MP<sub>K</sub>/MP<sub>L</sub> = (α/β)(L/K)</code>，随 <code>K/L</code> 上升而下降，等产量线凸向原点。若 <code>α + β = 1</code>，规模报酬不变，欧拉定理给出 <code>K·MP<sub>K</sub> + L·MP<sub>L</sub> = Q</code>，且劳动收入份额为 β、资本收入份额为 α。这解释了为什么国民收入核算里「劳动份额约 0.6–0.7」常被用作 β 的估计。' },

    { t: 'table', head: ['参数', '含义', '对图形的影响', '常见取值'], rows: [
      ['A', '全要素生产率', '整体高低（技术进步）', '由数据估计'],
      ['α', '资本产出弹性', '等产量线的弯曲程度', '0.3 左右'],
      ['β', '劳动产出弹性', '等产量线的弯曲程度', '0.7 左右'],
      ['α+β', '规模报酬', '&gt;1 递增、=1 不变、&lt;1 递减', '常用 1']
    ], caption: '四个参数各有经济含义；α+β 决定规模报酬，是最常考的性质' },

    { t: 'p', html: 'Cobb-Douglas 也有局限：它假设替代弹性恒为 1，意味着资本与劳动总能按固定比例相互替代，这在不那么灵活的行业里不符合现实。更一般的 CES 生产函数允许替代弹性取其它值，但计算更复杂。本课只要求掌握 Cobb-Douglas 的偏导、齐次性与欧拉定理。' },

    { t: 'h', lvl: 2, text: '八、二元极值与 Hessian 判别', id: 'ch06-8' },

    { t: 'p', html: '二元函数求极值，一阶条件是两个偏导同时为零：<code>f<sub>x</sub> = 0</code> 且 <code>f<sub>y</sub> = 0</code>。解出的点叫驻点。几何上，驻点处曲面有水平切平面，可能是山顶（极大）、谷底（极小），也可能是<b>鞍点（saddle point）</b>——一个方向上看是山顶，另一个方向上看是谷底。' },

    { t: 'p', html: '判别用二阶条件：令 <code>D = f<sub>xx</sub>f<sub>yy</sub> − f<sub>xy</sub><sup>2</sup></code>（Hessian 行列式）。若 <code>D &gt; 0</code> 且 <code>f<sub>xx</sub> &lt; 0</code>，是极大；若 <code>D &gt; 0</code> 且 <code>f<sub>xx</sub> &gt; 0</code>，是极小；若 <code>D &lt; 0</code>，是鞍点；若 <code>D = 0</code>，判别失效，需要更高阶信息。' },

    { t: 'p', html: '例：<code>z = x<sup>2</sup> + y<sup>2</sup> − 4x − 6y + 13</code>。<code>z<sub>x</sub> = 2x − 4 = 0</code> 给 x=2；<code>z<sub>y</sub> = 2y − 6 = 0</code> 给 y=3。驻点 <code>(2, 3)</code>，函数值 <code>4 + 9 − 8 − 18 + 13 = 0</code>。二阶：<code>z<sub>xx</sub> = 2</code>、<code>z<sub>yy</sub> = 2</code>、<code>z<sub>xy</sub> = 0</code>，<code>D = 4 &gt; 0</code> 且 <code>z<sub>xx</sub> &gt; 0</code>，所以是极小点，最小值 0。' },

    { t: 'p', html: '例：<code>z = x<sup>2</sup> − y<sup>2</sup></code>（鞍点标准例）。<code>z<sub>x</sub> = 2x = 0</code>、<code>z<sub>y</sub> = −2y = 0</code>，驻点 <code>(0,0)</code>。<code>z<sub>xx</sub> = 2</code>、<code>z<sub>yy</sub> = −2</code>、<code>z<sub>xy</sub> = 0</code>，<code>D = −4 &lt; 0</code>，是鞍点。沿 x 轴看它向上弯（有极小），沿 y 轴看它向下弯（有极大），所以「极小」与「极大」的结论都只对一半方向成立。' },

    { t: 'table', head: ['判别式', '二阶条件', '结论', '图形'], rows: [
      ['<code>D &gt; 0</code>', '<code>f<sub>xx</sub> &lt; 0</code>', '局部极大', '山顶'],
      ['<code>D &gt; 0</code>', '<code>f<sub>xx</sub> &gt; 0</code>', '局部极小', '谷底'],
      ['<code>D &lt; 0</code>', '任意', '鞍点', '马鞍面'],
      ['<code>D = 0</code>', '任意', '判别失效', '需高阶检查']
    ], caption: '<code>D</code> 的符号先判「是不是极值」，<code>f<sub>xx</sub></code> 的符号再判「极大还是极小」' },

    { t: 'p', html: '经济上的鞍点并不罕见。例如两种投入的边际产出一个递增一个递减，或者利润函数在某个方向上最优、另一个方向上发散。遇到鞍点，说明「同时调整两个变量」找不到稳定最优，必须加上约束（比如预算、产能），这正是 ch07 的主题。' },

    { t: 'p', html: '最后提醒：二元极值的 <code>D</code> 判别只适用于「内部驻点」。如果最优解在边界上（如 <code>K ≥ 0</code> 的边界 <code>K = 0</code>），一阶条件不再适用，要单独检查边界。这与 ch04 闭区间最值的逻辑一致，只是从一维区间变成了二维区域的边界曲线。' },

    { t: 'callout', kind: 'exam', title: '多元题的答题模板', html: '① 写清变量与目标函数（生产/效用/利润）；② 求两个一阶偏导并令其为零，解驻点；③ 求二阶偏导，算 <code>D</code>，判断极大/极小/鞍点；④ 若问边际量或替代率，写出 <code>MP</code>、<code>MRTS</code>、<code>MRS</code> 的表达式并代入具体点；⑤ 补一句经济解释（规模报酬、替代关系、最优投入组合）。' },

    { t: 'terms', items: [
      { en: 'partial derivative', zh: '偏导数', html: '固定其它变量，只对一个变量求导，记作 <code>∂f/∂x</code>。' },
      { en: 'total differential', zh: '全微分', html: '<code>dz = f<sub>x</sub>dx + f<sub>y</sub>dy</code>，多变量同时小变化的线性近似。' },
      { en: 'isoquant', zh: '等产量线', html: '产量相同的投入组合，斜率绝对值为 MRTS。' },
      { en: 'marginal rate of substitution', zh: '边际替代率', html: '<code>MRS = MU<sub>x</sub>/MU<sub>y</sub></code>，保持效用不变时两种商品的交换比。' },
      { en: 'homogeneous function', zh: '齐次函数', html: '所有变量同乘 t，函数值乘 <code>t<sup>k</sup></code>；k 为齐次次数。' },
      { en: 'Euler theorem', zh: '欧拉定理', html: 'k 次齐次函数满足 <code>x f<sub>x</sub> + y f<sub>y</sub> = k f</code>。' },
      { en: 'Hessian', zh: '海塞矩阵', html: '二阶偏导组成的矩阵，二元时行列式为 <code>f<sub>xx</sub>f<sub>yy</sub>−f<sub>xy</sub><sup>2</sup></code>。' },
      { en: 'saddle point', zh: '鞍点', html: '一个方向极大、另一方向极小的驻点，<code>D &lt; 0</code>。' }
    ] },

    { t: 'keypoint', items: [
      { title: '偏导就是「其它条件不变」', html: '对 x 求偏导时把 y 当常数；生产函数的偏导就是边际产品。' },
      { title: '全微分叠加两个方向', html: '<code>dz = z<sub>x</sub>dx + z<sub>y</sub>dy</code>；<code>(8,8)</code> 处各增 0.1，<code>dQ ≈ 1.0</code>。' },
      { title: '隐函数斜率 = −f<sub>x</sub>/f<sub>y</sub>', html: '圆 <code>x<sup>2</sup>+y<sup>2</sup>=25</code> 在 <code>(3,4)</code> 处斜率为 <code>−3/4</code>。' },
      { title: 'MRS 与 MRTS 都是等值线斜率的绝对值', html: '<code>U = x<sup>0.5</sup>y<sup>0.5</sup></code> 的 <code>MRS = y/x</code>，随 x 增加而递减。' },
      { title: '欧拉定理把产出分配完', html: '一次齐次时 <code>K·MP<sub>K</sub> + L·MP<sub>L</sub> = Q</code>；<code>8×3+8×7 = 80</code>。' },
      { title: '二元极值先看 D 再看 f<sub>xx</sub>', html: '<code>D&gt;0</code> 且 <code>f<sub>xx</sub>&lt;0</code> 极大；<code>D&lt;0</code> 鞍点；<code>D=0</code> 失效。' }
    ] },

    { t: 'checklist', id: 'ch06', items: [
      '我能写出二元函数的定义域，并画出 <code>Q = 10K<sup>0.3</sup>L<sup>0.7</sup></code> 的一条等产量线',
      '我能对 <code>z = 3x<sup>2</sup>y + 5y<sup>3</sup></code> 求两个偏导，并算出 <code>(2,1)</code> 处的值',
      '我能说明 <code>MP<sub>K</sub> = 3</code> 与 <code>AP<sub>K</sub> = 10</code> 的区别',
      '我能用全微分估算 <code>(8,8)</code> 处两投入各增 0.1 的产量变化',
      '我能用链式法则验证 <code>z = x<sup>2</sup>y</code>、<code>x=t<sup>2</sup></code>、<code>y=t<sup>3</sup></code> 时 <code>dz/dt = 7t<sup>6</sup></code>',
      '我能由 <code>x<sup>2</sup>+y<sup>2</sup>=25</code> 求出 <code>dy/dx = −x/y</code>',
      '我能算出 <code>U = x<sup>0.5</sup>y<sup>0.5</sup></code> 的 MRS 并说明其递减',
      '我能检验 Cobb-Douglas 的齐次次数，并用欧拉定理验证 <code>8×3+8×7 = 80</code>',
      '我能对 <code>z = x<sup>2</sup>+y<sup>2</sup>−4x−6y+13</code> 求极小点，并判断 <code>x<sup>2</sup>−y<sup>2</sup></code> 是鞍点'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应《Essential Mathematics for Economic Analysis》（第 5 版）的多元函数部分：偏导数、全微分与链式法则、二阶偏导与 Young 定理、隐函数求导、齐次函数与欧拉定理、二元极值与 Hessian 判别；Cobb-Douglas 的例子与数值为本站设定，用于串联边际产品、替代率与规模报酬。约束条件下的最优化（预算约束、成本最小化）留到下一章用拉格朗日乘子处理。' }
  ]
});
