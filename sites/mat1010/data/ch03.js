/* =====================================================================
 * ch03.js · 第 3 章「导数与边际分析：变化的速率」
 * 职责：从差商引入导数、给出全套求导法则、把导数翻译成边际量
 *       与弹性，并训练一阶近似估算。
 * 依据：Essential Mathematics for Economic Analysis（5th ed）第 7–9 章
 *       的微分与弹性部分。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch03',
  num: '03',
  title: '导数与边际分析：变化的速率',
  en: 'DERIVATIVES & MARGINAL ANALYSIS',
  goals: [
    '用差商的极限解释导数的定义，并说明它与切线斜率、瞬时变化率的关系',
    '熟练使用幂法则、和差法则、乘积法则、商法则与链式法则求导',
    '对指数函数与对数函数求导，处理 <code>e<sup>kx</sup></code> 与 <code>ln(ax+b)</code> 型结构',
    '把导数翻译成边际成本、边际收益、边际效用等经济量，并解释其符号与大小',
    '计算点弹性与弧弹性，用弹性判断涨价对收入的影响，并做一阶近似估算'
  ],
  kp: [
    { id: 'ch03-1', title: '导数：从差商到切线' },
    { id: 'ch03-2', title: '幂法则与和差法则' },
    { id: 'ch03-3', title: '乘积法则与商法则' },
    { id: 'ch03-4', title: '链式法则' },
    { id: 'ch03-5', title: '指数函数与对数函数求导' },
    { id: 'ch03-6', title: '高阶导数与边际量' },
    { id: 'ch03-7', title: '弹性：无量纲的敏感度' },
    { id: 'ch03-8', title: '微分与一阶近似' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '导数就是经济学里的「边际」', html: '经济学最重要的一个思想是「看增量，不看总量」。多生产一件要花多少钱？多雇一个工人能多产多少？价格再涨一块钱，销量会掉多少？这些问题问的都是「再增加一点点会怎样」，而数学上描述「一点点」的工具就是导数。<b>把导数读成「边际」，整门课就通了一半</b>；读成「求导运算」，就只是计算练习。' },

    { t: 'p', lead: true, html: '上一章的斜率只对直线有效，因为直线的陡峭程度处处相同。可经济关系几乎都是弯的：成本随产量加速上升，需求随价格越降越平缓，效用随消费递减。要描述一条曲线在某一点的陡峭程度，就得用<b>切线（tangent line）</b>的斜率；而切线斜率正是导数。' },

    { t: 'p', html: '这一章的结构很清楚：先把导数定义清楚（差商的极限），再给一套求导法则（幂、和差、乘积、商、链式、指数、对数），然后把导数翻译成边际量与弹性，最后用它做近似估算。法则部分需要练手，但真正决定你能不能做题的是<b>识别结构</b>：拿到一个函数，先判断它是和、积、商还是复合，再选法则。' },

    { t: 'h', lvl: 2, text: '一、导数：从差商到切线', id: 'ch03-1' },

    { t: 'p', html: '设函数 <code>y = f(x)</code>。当 x 从 <code>x<sub>0</sub></code> 变到 <code>x<sub>0</sub> + h</code> 时，函数值从 <code>f(x<sub>0</sub>)</code> 变到 <code>f(x<sub>0</sub>+h)</code>，平均变化率是差商 <code>[f(x<sub>0</sub>+h) − f(x<sub>0</sub>)]/h</code>。让 h 趋于 0，如果差商趋于一个确定的数，这个数就叫 <code>f</code> 在 <code>x<sub>0</sub></code> 处的导数，记作 <code>f′(x<sub>0</sub>)</code> 或 <code>df/dx</code>。' },

    { t: 'p', html: '以 <code>f(x) = x<sup>2</sup></code> 在 <code>x = 2</code> 处为例。差商为 <code>[(2+h)<sup>2</sup> − 4]/h = (4 + 4h + h<sup>2</sup> − 4)/h = 4 + h</code>。当 h→0，差商趋于 4，所以 <code>f′(2) = 4</code>。几何上，割线斜率随 h 变小而趋近切线斜率；代数上，<code>h<sup>2</sup></code> 是高阶小量，被 h 除之后仍含 h，最终消失。' },

    { t: 'p', html: '经济学把导数读成<b>边际（marginal）</b>：成本函数 <code>C(Q)</code> 的导数 <code>MC = C′(Q)</code> 是边际成本，即产量为 Q 时再多生产一件增加的成本；收入函数 <code>R(Q)</code> 的导数 <code>MR = R′(Q)</code> 是边际收益；效用函数 <code>U(x)</code> 的导数 <code>MU = U′(x)</code> 是边际效用。所有「边际××」都是导数，没有例外。' },

    { t: 'table', head: ['概念', '数学写法', '经济读法'], rows: [
      ['平均变化率', '<code>Δy/Δx</code>', '这一段区间的平均边际，离散数据用'],
      ['瞬时变化率', '<code>dy/dx = f′(x)</code>', '当前这一点的边际，连续模型用'],
      ['切线', '<code>y = f(x<sub>0</sub>) + f′(x<sub>0</sub>)(x − x<sub>0</sub>)</code>', '局部线性近似，预测小变动'],
      ['可导', '<code>f′(x<sub>0</sub>)</code> 存在', '曲线在该点光滑、没有尖角'],
      ['不可导的例子', '<code>f(x) = |x|</code> 在 0 处', '左右斜率不等，有折点']
    ], caption: '差商是「平均」，导数是「瞬时」，两者在 h 很小时几乎相等' },

    { t: 'callout', kind: 'tip', title: '别把导数符号只当运算', html: '<code>C′(Q) &gt; 0</code> 说的是「多生产会增加成本」，<code>C″(Q) &gt; 0</code> 说的是「增加得越来越快」。先读符号，再读数值，最后读变化趋势——这个顺序能让你在没有算完的情况下就判断答案是否合理。' },

    { t: 'h', lvl: 2, text: '二、幂法则与和差法则', id: 'ch03-2' },

    { t: 'p', html: '幂法则（power rule）：<code>(x<sup>n</sup>)′ = n·x<sup>n−1</sup></code>，对任意实数 n 成立（在定义域内）。所以 <code>x<sup>3</sup></code> 的导数是 <code>3x<sup>2</sup></code>，在 x=2 处等于 12；<code>√x = x<sup>1/2</sup></code> 的导数是 <code>0.5x<sup>−1/2</sup> = 1/(2√x)</code>；<code>1/x = x<sup>−1</sup></code> 的导数是 <code>−x<sup>−2</sup> = −1/x<sup>2</sup></code>。常数项求导为零。' },

    { t: 'p', html: '和差法则（sum rule）：<code>(f ± g)′ = f′ ± g′</code>；常数倍法则：<code>(cf)′ = c·f′</code>。合起来，多项式可以逐项求导：<code>(3x<sup>2</sup> − 5x + 7)′ = 6x − 5</code>。注意最后那个 7 消失了，因为常数的变化率为零——经济上就是「固定成本不影响边际成本」。' },

    { t: 'p', html: '多项式求导是后面所有计算的基础，练到不假思索最好。<code>(x<sup>4</sup> − 2x<sup>3</sup> + x)′ = 4x<sup>3</sup> − 6x<sup>2</sup> + 1</code>；<code>(5x<sup>3</sup>)′ = 15x<sup>2</sup></code>；<code>(200 + 5Q + 0.1Q<sup>2</sup>)′ = 5 + 0.2Q</code>。最后这个式子就是边际成本，固定成本 200 在求导后消失，正说明「固定成本不随产量变化，所以不是边际量」。' },

    { t: 'p', html: '有一个常见误区：把 <code>(f·g)′</code> 当成 <code>f′·g′</code>。用 <code>f = x<sup>2</sup></code>、<code>g = x<sup>3</sup></code> 检验：左边 <code>(x<sup>5</sup>)′ = 5x<sup>4</sup></code>，右边 <code>2x·3x<sup>2</sup> = 6x<sup>3</sup></code>，明显不等。乘积必须用下一节的乘积法则。' },

    { t: 'quiz', qid: 'ch03-q1' },

    { t: 'h', lvl: 2, text: '三、乘积法则与商法则', id: 'ch03-3' },

    { t: 'p', html: '乘积法则（product rule）：<code>(fg)′ = f′g + fg′</code>。口诀「前导后不导，加后导前不导」。例：<code>(x<sup>2</sup>+1)(3x−2)</code>，前导 <code>2x</code>、后导 <code>3</code>，所以导数为 <code>2x(3x−2) + (x<sup>2</sup>+1)·3 = 6x<sup>2</sup> − 4x + 3x<sup>2</sup> + 3 = 9x<sup>2</sup> − 4x + 3</code>。验算：先展开再求导，<code>3x<sup>3</sup> − 2x<sup>2</sup> + 3x − 2</code> 的导数也是 <code>9x<sup>2</sup> − 4x + 3</code> ✓。' },

    { t: 'p', html: '商法则（quotient rule）：<code>(f/g)′ = (f′g − fg′)/g<sup>2</sup></code>。口诀「上导下不导，减上不导下导，除以分母平方」。例：<code>(2x+1)/(x−3)</code>，分子导 2、分母导 1，所以 <code>[2(x−3) − (2x+1)·1]/(x−3)<sup>2</sup> = (2x−6−2x−1)/(x−3)<sup>2</sup> = −7/(x−3)<sup>2</sup></code>。结果恒为负，说明这个函数在 <code>x≠3</code> 上处处递减。' },

    { t: 'p', html: '两个法则的选择取决于结构：看到「两个因子相乘」用乘积法则，看到「一个分式、分子分母都含 x」用商法则。如果分母只是常数（如 <code>(x<sup>2</sup>+1)/3</code>），直接除出来再求导更快。如果分子是常数（如 <code>5/(x+2)</code>），可以用 <code>5(x+2)<sup>−1</sup></code> 加链式法则，比商法则省事。' },

    { t: 'table', head: ['结构', '例子', '用哪个法则', '结果'], rows: [
      ['多项式', '<code>3x<sup>2</sup> − 5x + 7</code>', '和差 + 幂', '<code>6x − 5</code>'],
      ['两个因子相乘', '<code>(x<sup>2</sup>+1)(3x−2)</code>', '乘积', '<code>9x<sup>2</sup> − 4x + 3</code>'],
      ['分式', '<code>(2x+1)/(x−3)</code>', '商', '<code>−7/(x−3)<sup>2</sup></code>'],
      ['复合', '<code>(3x<sup>2</sup>+1)<sup>5</sup></code>', '链式', '<code>30x(3x<sup>2</sup>+1)<sup>4</sup></code>'],
      ['指数', '<code>e<sup>3x</sup></code>', '链式 + 指数', '<code>3e<sup>3x</sup></code>'],
      ['对数', '<code>ln(3x+1)</code>', '链式 + 对数', '<code>3/(3x+1)</code>']
    ], caption: '先认结构，再选法则；结构认错，法则再熟也算不对' },

    { t: 'p', html: '一个实用建议：能用展开或化简避开的，就别硬套法则。比如 <code>(x+1)<sup>2</sup></code> 展开成 <code>x<sup>2</sup>+2x+1</code> 再求导，比链式快；<code>(x<sup>2</sup>−1)/(x−1)</code> 先约成 <code>x+1</code>（x≠1）再求导，比商法则快得多。法则不是越用越显得专业，少算一步就少一次出错机会。' },

    { t: 'h', lvl: 2, text: '四、链式法则', id: 'ch03-4' },

    { t: 'p', html: '链式法则（chain rule）处理复合函数：若 <code>y = f(u)</code>、<code>u = g(x)</code>，则 <code>dy/dx = f′(u)·g′(x)</code>，也写成 <code>dy/dx = (dy/du)(du/dx)</code>。口诀「外层导数乘内层导数」。它是整门课使用频率最高的法则，ch06 的偏导、ch07 的拉格朗日乘子都靠它。' },

    { t: 'p', html: '例：<code>y = (3x<sup>2</sup>+1)<sup>5</sup></code>。外层是 <code>u<sup>5</sup></code>，内层 <code>u = 3x<sup>2</sup>+1</code>。外层导数 <code>5u<sup>4</sup></code>，内层导数 <code>6x</code>，相乘得 <code>5(3x<sup>2</sup>+1)<sup>4</sup>·6x = 30x(3x<sup>2</sup>+1)<sup>4</sup></code>。检查一下量纲：外层把「u 的五次方」变成「u 的四次方」，内层补上「u 对 x 的变化率」，结构合理。' },

    { t: 'p', html: '再例：<code>y = e<sup>3x</sup></code>。外层 <code>e<sup>u</sup></code> 的导数还是 <code>e<sup>u</sup></code>，内层 <code>u = 3x</code> 的导数是 3，所以 <code>y′ = 3e<sup>3x</sup></code>。一般地 <code>(e<sup>kx</sup>)′ = ke<sup>kx</sup></code>：指数函数的导数等于自身乘以指数上的系数。这个结论在复利、增长模型里天天用。' },

    { t: 'p', html: '对数同理：<code>y = ln(3x+1)</code>，外层 <code>ln u</code> 的导数是 <code>1/u</code>，内层导数是 3，所以 <code>y′ = 3/(3x+1)</code>。一般地 <code>(ln(ax+b))′ = a/(ax+b)</code>。注意定义域要求 <code>3x+1 &gt; 0</code>，即 <code>x &gt; −1/3</code>；求导之前先确认在定义域内，这是很多题的隐含扣分点。' },

    { t: 'steps', items: [
      { title: '第一步 · 拆出内外层', html: '把函数写成 <code>f(g(x))</code> 的形式，明确哪部分是外层、哪部分是内层。例如 <code>(3x<sup>2</sup>+1)<sup>5</sup></code> 的外层是五次方，内层是括号里的二次式。' },
      { title: '第二步 · 外层对「整体」求导', html: '把内层当成一个字母 u，对外层求导，结果里保留 u。这一步不需要动 x。' },
      { title: '第三步 · 乘上内层导数', html: '再算 <code>du/dx</code>，乘到上一步的结果后面。漏乘内层导数是链式法则最常见的错误。' },
      { title: '第四步 · 代回并整理', html: '把 u 换回 x 的表达式，能合并的合并，能因式分解的分解，最后检查定义域。' }
    ] },

    { t: 'p', html: '多层嵌套就连续用：<code>y = e<sup>(x<sup>2</sup>+1)<sup>2</sup></sup></code> 有三层，从外到内依次是 <code>e<sup>u</sup></code>、<code>u = v<sup>2</sup></code>、<code>v = x<sup>2</sup>+1</code>，导数为 <code>e<sup>u</sup>·2v·2x</code>，代回得 <code>4x(x<sup>2</sup>+1)e<sup>(x<sup>2</sup>+1)<sup>2</sup></sup></code>。层数多时先在草稿上写下链条，再逐段相乘，不容易漏。' },

    { t: 'quiz', qid: 'ch03-q2' },

    { t: 'h', lvl: 2, text: '五、指数函数与对数函数求导', id: 'ch03-5' },

    { t: 'p', html: '指数函数的导数公式：<code>(e<sup>x</sup>)′ = e<sup>x</sup></code>，<code>(a<sup>x</sup>)′ = a<sup>x</sup>ln a</code>。前者是 e 被称为「自然」底数的原因——它是唯一一个导数等于自身的指数函数。后者多一个 <code>ln a</code> 因子，a=e 时 <code>ln e = 1</code>，退化为前者。' },

    { t: 'p', html: '对数函数的导数：<code>(ln x)′ = 1/x</code>，<code>(log<sub>a</sub>x)′ = 1/(x ln a)</code>。这两个公式配合链式法则可以覆盖绝大多数经济模型：<code>(ln(2x+5))′ = 2/(2x+5)</code>，<code>(x ln x)′ = ln x + 1</code>（乘积法则：<code>1·ln x + x·(1/x)</code>）。' },

    { t: 'p', html: '为什么要学对数求导？因为「变量在指数上」或者「一长串乘积」时，先取对数能把结构降级。这叫<b>对数求导法（logarithmic differentiation）</b>。例：<code>y = x<sup>x</sup></code>（x&gt;0），两边取对数 <code>ln y = x ln x</code>，两边对 x 求导：<code>y′/y = ln x + 1</code>，所以 <code>y′ = x<sup>x</sup>(ln x + 1)</code>。如果直接硬套公式，会无从下手。' },

    { t: 'p', html: '另一个高频场景是增长率。若 <code>y = f(t)</code>，则相对增长率（增长率本身）为 <code>y′/y = d(ln y)/dt</code>。所以「取对数再求导」等于「算增长率」，这也是为什么计量经济学里经常对变量取对数：系数直接读成百分比变化。' },

    { t: 'h', lvl: 2, text: '六、高阶导数与边际量', id: 'ch03-6' },

    { t: 'p', html: '对导数再求导，得到二阶导数 <code>f″(x)</code> 或 <code>d<sup>2</sup>y/dx<sup>2</sup></code>。它描述「斜率本身怎么变」：<code>f″ &gt; 0</code> 表示斜率递增、曲线向上弯（凸），<code>f″ &lt; 0</code> 表示斜率递减、曲线向下弯（凹）。ch04 判断极大极小时，靠的就是二阶导数的符号。' },

    { t: 'p', html: '例：<code>f(x) = x<sup>3</sup> − 3x<sup>2</sup></code>。一阶导 <code>f′(x) = 3x<sup>2</sup> − 6x = 3x(x−2)</code>，二阶导 <code>f″(x) = 6x − 6</code>。令 <code>f′ = 0</code> 得 <code>x = 0</code> 或 <code>x = 2</code>；在 x=0 处 <code>f″ = −6 &lt; 0</code>（极大），在 x=2 处 <code>f″ = 6 &gt; 0</code>（极小）。函数值分别为 <code>f(0) = 0</code>、<code>f(2) = −4</code>。这些计算在下一章会系统化。' },

    { t: 'p', html: '经济里的二阶导数同样有含义。<b>边际成本递增</b>（<code>C″ &gt; 0</code>）意味着越生产越费劲；<b>边际效用递减</b>（<code>U″ &lt; 0</code>）意味着越多越不稀罕；<b>边际收益递减</b>（<code>R″ &lt; 0</code>）意味着越卖越难卖上价。这三条「递减规律」本质上都是二阶导数为负。' },

    { t: 'table', head: ['总量函数', '一阶导（边际量）', '二阶导（边际的变化）', '典型符号'], rows: [
      ['总成本 <code>C(Q)</code>', '边际成本 <code>MC</code>', '边际成本递增/递减', '<code>C′ &gt; 0</code>，<code>C″ &gt; 0</code>'],
      ['总收入 <code>R(Q)</code>', '边际收益 <code>MR</code>', '边际收益递减', '<code>R′ &gt; 0</code> 后转负，<code>R″ &lt; 0</code>'],
      ['总效用 <code>U(x)</code>', '边际效用 <code>MU</code>', '边际效用递减', '<code>U′ &gt; 0</code>，<code>U″ &lt; 0</code>'],
      ['生产函数 <code>Q(L)</code>', '边际产量 <code>MP<sub>L</sub></code>', '边际报酬递减', '<code>MP &gt; 0</code> 后递减']
    ], caption: '总量的导数给边际，边际的导数给「边际递减」这一整套规律' },

    { t: 'p', html: '算一个完整的边际利润例子。价格 50 元、成本 <code>C(Q) = 200 + 5Q + 0.1Q<sup>2</sup></code>，则 <code>π(Q) = 50Q − C(Q) = 45Q − 200 − 0.1Q<sup>2</sup></code>。边际利润 <code>π′(Q) = 45 − 0.2Q</code>，令其为零得 <code>Q = 225</code>，最大利润 <code>π(225) = 45×225 − 200 − 0.1×225<sup>2</sup> = 10125 − 200 − 5062.5 = 4862.5</code> 元。第二步检查 <code>π″ = −0.2 &lt; 0</code>，确认是极大。' },

    { t: 'p', html: '这个例子里有个细节值得注意：<b>固定成本 200 不影响最优产量</b>。因为求导时它消失了，<code>π′</code> 里没有它。但固定成本影响「值不值得开工」——如果 <code>π(225) &lt; 0</code>，即使产量最优也亏钱，长期应该退出。这类「边际决定产量、总量决定去留」的区分，在 ch04 会专门讨论。' },

    { t: 'h', lvl: 2, text: '七、弹性：无量纲的敏感度', id: 'ch03-7' },

    { t: 'p', html: '需求的价格弹性（price elasticity of demand）定义为 <code>E = (dQ/dP)·(P/Q)</code>，也写成 <code>E = (dQ/Q)/(dP/P)</code>，即「价格变动 1% 引起需求量变动百分之几」。因为分子分母都是百分比，弹性没有单位，可以跨商品、跨市场比较。这是它比斜率好用的地方。' },

    { t: 'p', html: '例：<code>Q = 100 − 2P</code>，<code>dQ/dP = −2</code>。在 <code>P = 20</code>、<code>Q = 60</code> 处，<code>E = −2×20/60 = −2/3 ≈ −0.67</code>；在 <code>P = 40</code>、<code>Q = 20</code> 处，<code>E = −2×40/20 = −4</code>。同一条直线，弹性从 0.67 变到 4，说明<b>弹性不是常数，它随位置变化</b>。考试里问「该商品的需求弹性」而不给价格点，是无法回答的。' },

    { t: 'p', html: '经济学教材通常取绝对值来分类：<code>|E| &gt; 1</code> 称为<b>富有弹性</b>（elastic），降价能增加收入；<code>|E| &lt; 1</code> 称为<b>缺乏弹性</b>（inelastic），涨价能增加收入；<code>|E| = 1</code> 称为<b>单位弹性</b>（unit elastic），收入在这一点取极值。需求曲线通常向下倾斜，所以 E 为负，符号本身不重要，重要的是绝对值。' },

    { t: 'table', head: ['区间', '含义', '涨价 1% 的效果', '定价建议'], rows: [
      ['<code>|E| &gt; 1</code>', '富有弹性', '销量降超过 1%，收入下降', '降价促销'],
      ['<code>|E| = 1</code>', '单位弹性', '收入基本不变，此时收入最大', '维持价格'],
      ['<code>|E| &lt; 1</code>', '缺乏弹性', '销量降不到 1%，收入上升', '可以提价'],
      ['<code>E = 0</code>', '完全无弹性', '销量完全不变', '提价不损失销量'],
      ['<code>|E| → ∞</code>', '完全弹性', '稍微涨价销量归零', '只能接受市场价']
    ], caption: '弹性与收入的关系是定价决策的核心，也是考试的高频解释题' },

    { t: 'p', html: '推导一下「收入在单位弹性处最大」。收入 <code>R = P·Q(P)</code>，对 P 求导：<code>dR/dP = Q + P·(dQ/dP) = Q[1 + (P/Q)(dQ/dP)] = Q(1 + E)</code>。所以 <code>E = −1</code> 时 <code>dR/dP = 0</code>，收入取极值。这与上一章用抛物线顶点算出的 <code>P = 25</code>（此时 <code>|E| = 1</code>）完全一致——两条路殊途同归。' },

    { t: 'p', html: '还有两个相关概念：<b>弧弹性</b>用两点间的平均价格与平均数量计算，适合离散数据；<b>交叉价格弹性</b>衡量商品 A 的价格变动对商品 B 需求的影响，正值表示替代品，负值表示互补品；<b>收入弹性</b>衡量收入变动对需求的影响，大于 1 是奢侈品，小于 1 是必需品。这些在经济学课程里会展开，本课只要求会用导数算点弹性。' },

    { t: 'quiz', qid: 'ch03-q3' },

    { t: 'h', lvl: 2, text: '八、微分与一阶近似', id: 'ch03-8' },

    { t: 'p', html: '微分（differential）是把「小变化」线性化的工具：<code>dy = f′(x)dx</code>，其中 <code>dx</code> 是自变量的一个小增量。当 dx 很小时，真实的增量 <code>Δy = f(x+dx) − f(x)</code> 与微分 <code>dy</code> 非常接近。这就是一阶近似（first-order approximation）：<code>f(x+dx) ≈ f(x) + f′(x)dx</code>。' },

    { t: 'p', html: '例：估算 <code>√101</code>。取 <code>f(x) = √x</code>、<code>x = 100</code>、<code>dx = 1</code>。<code>f′(x) = 1/(2√x)</code>，<code>f′(100) = 1/20 = 0.05</code>，所以 <code>√101 ≈ 10 + 0.05×1 = 10.05</code>。真实值是 10.0499，误差不到万分之一。这类估算在考试里能用来快速检验答案，也能在数据不全时给出数量级判断。' },

    { t: 'p', html: '经济上的用法更多：产量从 100 增加到 101 时，成本增加多少？直接算 <code>C(101) − C(100)</code> 当然可以，但用 <code>MC(100)×1</code> 更快，而且更清楚地显示「增加的成本约等于边际成本」。同理，价格上调 1%，需求下降约 <code>|E|%</code>——这正是弹性作为「近似工具」的用法。' },

    { t: 'compare', left: { title: '精确计算', html: '<code>C(101) = 200 + 5×101 + 0.1×101<sup>2</sup> = 200 + 505 + 1020.1 = 1725.1</code>，比 <code>C(100) = 1700</code> 多 25.1。' }, right: { title: '一阶近似', html: '<code>MC(100) = 5 + 0.2×100 = 25</code>，估算多 25。与精确值差 0.1，正是二阶项 <code>0.1×dx<sup>2</sup> = 0.1</code>。dx 越小，近似越准。' } },

    { t: 'p', html: '近似公式还可以反用：如果已知 <code>f′(x)</code> 与 <code>Δy</code>，可以估 <code>dx ≈ Δy/f′(x)</code>。比如成本增加 25 元，估产量增加了大约 1 件，因为边际成本约 25。这类「反算」在解读报表、倒推产量时很好用。' },

    { t: 'callout', kind: 'exam', title: '求导题的检查清单', html: '① 结构认对了吗（和、积、商、复合）？② 链式法则的内层导数乘了吗？③ 常数项是否已消失？④ 指数函数的系数、对数函数的分母对吗？⑤ 定义域是否需要限制？五问过一遍，绝大多数求导错误都能自己发现。' },

    { t: 'terms', items: [
      { en: 'derivative', zh: '导数', html: '差商在 h→0 时的极限，表示瞬时变化率与切线斜率。' },
      { en: 'marginal cost', zh: '边际成本', html: '<code>MC = C′(Q)</code>，多生产一单位增加的成本。' },
      { en: 'product rule', zh: '乘积法则', html: '<code>(fg)′ = f′g + fg′</code>。' },
      { en: 'quotient rule', zh: '商法则', html: '<code>(f/g)′ = (f′g − fg′)/g<sup>2</sup></code>。' },
      { en: 'chain rule', zh: '链式法则', html: '<code>dy/dx = (dy/du)(du/dx)</code>，外层导数乘内层导数。' },
      { en: 'second derivative', zh: '二阶导数', html: '导数的导数，描述斜率的增减与曲线的凹凸。' },
      { en: 'elasticity', zh: '弹性', html: '<code>E = (dQ/dP)(P/Q)</code>，价格变 1% 引起需求变动的百分比。' },
      { en: 'differential', zh: '微分', html: '<code>dy = f′(x)dx</code>，用于一阶近似估算小变化。' }
    ] },

    { t: 'keypoint', items: [
      { title: '导数是差商的极限', html: '<code>f′(x) = lim<sub>h→0</sub>[f(x+h)−f(x)]/h</code>，几何上是切线斜率。' },
      { title: '先认结构再选法则', html: '和差逐项、乘积「前导后不导」、商「上导下减上不导下导」、复合「外层乘内层」。' },
      { title: '链式法则最常漏内层导数', html: '<code>(3x<sup>2</sup>+1)<sup>5</sup></code> 的导数是 <code>30x(3x<sup>2</sup>+1)<sup>4</sup></code>，不是 <code>5(3x<sup>2</sup>+1)<sup>4</sup></code>。' },
      { title: '指数与对数的导数', html: '<code>(e<sup>kx</sup>)′ = ke<sup>kx</sup></code>，<code>(ln(ax+b))′ = a/(ax+b)</code>。' },
      { title: '边际量就是导数', html: 'MC、MR、MU、MP 全是相应总量函数的导数；固定成本求导后消失。' },
      { title: '弹性随位置变化', html: '<code>Q = 100−2P</code> 在 P=20 时 |E|=0.67，在 P=40 时 |E|=4；收入在 |E|=1 处最大。' }
    ] },

    { t: 'checklist', id: 'ch03', items: [
      '我能用差商写出 <code>x<sup>2</sup></code> 在 x=2 处的导数推导，并说明极限的含义',
      '我能对任意多项式逐项求导，并解释常数项为何消失',
      '我能用乘积法则算出 <code>(x<sup>2</sup>+1)(3x−2)</code> 的导数',
      '我能用商法则算出 <code>(2x+1)/(x−3)</code> 的导数，并判断其符号',
      '我能用链式法则算出 <code>(3x<sup>2</sup>+1)<sup>5</sup></code> 的导数',
      '我能写出 <code>(e<sup>kx</sup>)′</code> 与 <code>(ln(ax+b))′</code> 并各举一例',
      '我能由 <code>C = 200+5Q+0.1Q<sup>2</sup></code> 写出 MC 与 MC(10)',
      '我能算出 <code>Q = 100−2P</code> 在 P=20 与 P=40 的弹性，并判断涨价对收入的影响',
      '我能用一阶近似估算 <code>√101</code> 并说明误差来源'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应《Essential Mathematics for Economic Analysis》（第 5 版）的微分部分：导数的定义与切线、求导法则、指数与对数函数求导、高阶导数、弹性与一阶近似；同济《高等数学》第七版上册的导数与微分章节可用于补充计算训练。边际成本、边际利润与弹性的数字均为本站设定，用于演示公式与结论的对应关系。下一章把「导数为零」升级为完整的极值判别，并处理闭区间与约束情形。' }
  ]
});
