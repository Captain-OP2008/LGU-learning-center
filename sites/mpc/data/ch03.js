/* =====================================================================
 * ch03.js · 第 3 章「指数与对数：增长、衰减与尺度」
 * 职责：乘法型的增长与衰减、复利与 e、对数作为指数方程的解、半衰期与
 *       对数坐标，以及「线性 / 指数 / 幂」三种模型的辨识。
 * 依据：Precalculus 7th Edition 第 4 章（Exponential and Logarithmic Functions）。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch03',
  num: '03',
  title: '指数与对数：增长、衰减与尺度',
  en: 'EXPONENTIAL & LOGARITHMIC FUNCTIONS',
  goals: [
    '用「每经过固定时间乘同一个倍数」识别指数增长与衰减',
    '写出复利与连续复利的公式，并解释 e 从哪里来',
    '把对数当作「指数方程的解」使用，熟练换底与三条对数律',
    '解指数与对数方程，并检验真数为正、底数合法',
    '用半衰期与对数坐标读出现实数据里的增长速率'
  ],
  kp: [
    { id: 'ch03-1', title: '指数函数的性质' },
    { id: 'ch03-2', title: '复利与常数 e' },
    { id: 'ch03-3', title: '增长与衰减模型' },
    { id: 'ch03-4', title: '对数的定义与换底' },
    { id: 'ch03-5', title: '对数方程与不等式' },
    { id: 'ch03-6', title: '半衰期与对数坐标' },
    { id: 'ch03-7', title: '三种模型的辨识' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么增长故事必须用指数讲', html: '线性增长是「每单位时间加同一个数」，指数增长是「每单位时间乘同一个倍数」。前者画出来是直线，后者画出来越来越陡，任何窗口都装不下。人口、复利、病毒传播、放射性衰变、药物代谢、地震能量，全是后者。更关键的是：<b>指数与对数互为逆运算</b>，所以只要方程里未知数在指数上，唯一的解法就是取对数。这一章把这条主线讲透。' },

    { t: 'p', lead: true, html: '本章从一个简单的观察开始：<code>2<sup>x</sup></code> 在 <code>x</code> 每增加 1 时翻倍，而不是加 2。这个「乘」的性质带来两个后果：函数值增长极快，且乘法关系可以用加法来描述——后者正是对数。于是整章分成两半：前半讲指数函数怎么长、怎么算复利；后半讲对数怎么把指数上的未知数拉下来，以及半衰期、对数坐标这些实用工具。' },

    { t: 'h', lvl: 2, text: '一、指数函数的性质', id: 'ch03-1' },

    { t: 'p', html: '指数函数是 <code>f(x) = a<sup>x</sup></code>，要求 <code>a &gt; 0</code> 且 <code>a ≠ 1</code>。<code>a = 1</code> 时函数恒等于 1，没有讨论价值；<code>a &lt; 0</code> 时负数开分数次方会出问题。它的图像有两个固定特征：恒过 <code>(0, 1)</code>，因为 <code>a<sup>0</sup> = 1</code>；水平渐近线是 <code>y = 0</code>，因为 <code>a<sup>x</sup> → 0</code>（<code>x → −∞</code>，<code>a &gt; 1</code>）。' },

    { t: 'table', head: ['x', '2<sup>x</sup>', '3<sup>x</sup>', '(1/2)<sup>x</sup>'], rows: [
      ['−2', '0.25', '0.111…', '4'],
      ['−1', '0.5', '0.333…', '2'],
      ['0', '1', '1', '1'],
      ['1', '2', '3', '0.5'],
      ['2', '4', '9', '0.25'],
      ['3', '8', '27', '0.125']
    ], caption: '底数大于 1 时递增，小于 1 时递减；两条曲线都过 (0,1)，且都以 x 轴为渐近线' },

    { t: 'p', html: '底数的大小决定陡峭程度：<code>a</code> 越大，<code>x &gt; 0</code> 时上升越快；<code>0 &lt; a &lt; 1</code> 时图像关于 y 轴翻折，变成衰减。注意 <code>(1/2)<sup>x</sup> = 2<sup>−x</sup></code>，所以「底数小于 1 的指数函数」本质上就是「底数大于 1 的指数函数加一个负号」，两者是同一族。' },

    { t: 'p', html: '指数运算律来自「数个数」：<code>a<sup>m</sup> · a<sup>n</sup> = a<sup>m+n</sup></code>（m 个 a 乘 n 个 a）、<code>a<sup>m</sup>/a<sup>n</sup> = a<sup>m−n</sup></code>、<code>(a<sup>m</sup>)<sup>n</sup> = a<sup>mn</sup></code>、<code>a<sup>−n</sup> = 1/a<sup>n</sup></code>、<code>a<sup>1/n</sup> = <sup>n</sup>√a</code>。这五条在后面解方程、求导时天天用，必须能脱口而出。特别提醒：<code>a<sup>m+n</sup> ≠ a<sup>m</sup> + a<sup>n</sup></code>，指数运算把加法变成乘法，不是把加法搬下来。' },

    { t: 'h', lvl: 2, text: '二、复利与常数 e', id: 'ch03-2' },

    { t: 'p', html: '本金 <code>P</code>、年利率 <code>r</code>、每年复利 <code>n</code> 次、存 <code>t</code> 年，本息合计 <code>A = P(1 + r/n)<sup>nt</sup></code>。每年复利一次是 <code>P(1 + r)<sup>t</sup></code>；按月复利 <code>n = 12</code>；按日 <code>n = 365</code>。复利越频繁，同样的年利率下收益越高，但增幅有限——它有个上限。' },

    { t: 'p', html: '让 <code>n → ∞</code>，<code>(1 + r/n)<sup>nt</sup></code> 趋于 <code>e<sup>rt</sup></code>，其中 <code>e ≈ 2.718281828</code> 是自然常数。这就是<b>连续复利</b>：<code>A = Pe<sup>rt</sup></code>。举例：1000 元、年利率 5%、10 年。按年复利：<code>1000 × 1.05<sup>10</sup> ≈ 1628.89</code>；按月：<code>1000 × (1 + 0.05/12)<sup>120</sup> ≈ 1647.01</code>；按日：约 1648.66；连续：<code>1000e<sup>0.5</sup> ≈ 1648.72</code>。可以看到，从「按日」到「连续」只多了几分钱，<b>复利频率的收益是递减的</b>。' },

    { t: 'table', head: ['复利方式', '公式', '10 年后本息', '比按年多'], rows: [
      ['每年一次', '<code>1000 × 1.05<sup>10</sup></code>', '1628.89', '—'],
      ['每季一次', '<code>1000 × (1 + 0.05/4)<sup>40</sup></code>', '1643.62', '14.73'],
      ['每月一次', '<code>1000 × (1 + 0.05/12)<sup>120</sup></code>', '1647.01', '18.12'],
      ['每天一次', '<code>1000 × (1 + 0.05/365)<sup>3650</sup></code>', '1648.66', '19.77'],
      ['连续', '<code>1000e<sup>0.5</sup></code>', '1648.72', '19.83']
    ], caption: 'e 不是人为规定的符号，而是「无限次复利」的极限值；这也是它在微积分里反复出现的原因' },

    { t: 'p', html: '<code>e</code> 的重要性还有一层：以 <code>e</code> 为底的指数函数 <code>e<sup>x</sup></code> 是唯一一个导数等于自身的函数（差一个常数倍的说法更准确：<code>(e<sup>kx</sup>)′ = ke<sup>kx</sup></code>）。所以科学模型几乎都写成 <code>e<sup>kt</sup></code> 的形式，而不是 <code>2<sup>t</sup></code>。两种写法可以互换：<code>2<sup>t</sup> = e<sup>(ln2)t</sup></code>，增长率 <code>k = ln 2 ≈ 0.693</code>。' },

    { t: 'h', lvl: 2, text: '三、增长与衰减模型', id: 'ch03-3' },

    { t: 'p', html: '任何「按固定比例变化」的量都可以写成 <code>N(t) = N<sub>0</sub>e<sup>kt</sup></code>。<code>k &gt; 0</code> 是增长，<code>k &lt; 0</code> 是衰减，<code>N<sub>0</sub></code> 是初始量。<code>k</code> 的单位是「每单位时间的相对变化率」：<code>k = 0.03</code> 表示每小时（或每年）增长约 3%。注意它和「翻倍时间」「半衰期」是一一对应的，只是说法不同。' },

    { t: 'table', head: ['已知条件', '求什么', '公式', '例子'], rows: [
      ['k 与 N<sub>0</sub>', '任意时刻的量', '<code>N = N<sub>0</sub>e<sup>kt</sup></code>', '细菌 k = 0.4/h，6 小时后是 11 倍'],
      ['翻倍时间 T', '增长率 k', '<code>k = ln2 / T</code>', 'T = 12 年 → k ≈ 0.0578'],
      ['k', '翻倍时间', '<code>T = ln2 / k</code>', 'k = 0.02 → T ≈ 34.7 年'],
      ['半衰期 T<sub>1/2</sub>', '衰减率 k', '<code>k = −ln2 / T<sub>1/2</sub></code>', '碳 14 的 5730 年 → k ≈ −0.000121'],
      ['两个时刻的数据', 'k', '<code>k = ln(N<sub>2</sub>/N<sub>1</sub>)/(t<sub>2</sub> − t<sub>1</sub>)</code>', '(2, 500) 与 (5, 4000) → k ≈ 0.693']
    ], caption: '所有指数模型的题都归结为：已知三个量，求第四个' },

    { t: 'p', html: '例：某培养皿初始有 200 个细菌，3 小时后有 1600 个，假设按指数增长。先求 <code>k</code>：<code>1600 = 200e<sup>3k</sup></code>，<code>e<sup>3k</sup> = 8</code>，<code>3k = ln 8 = 3ln2</code>，<code>k = ln2 ≈ 0.693</code>，即每小时翻一倍。问 10 小时后多少：<code>200e<sup>6.93</sup> ≈ 200 × 1024 = 204800</code>。问何时达到 10 万个：<code>100000 = 200e<sup>0.693t</sup></code>，<code>e<sup>0.693t</sup> = 500</code>，<code>t = ln500/0.693 ≈ 8.97</code> 小时。' },

    { t: 'callout', kind: 'warn', title: '错误说法：增长 3% 持续 10 年就是增长 30%', html: '为什么错：每一年是在<b>上一年的基础上</b>乘 1.03，不是加 0.03。正确说法：10 年后是 <code>1.03<sup>10</sup> ≈ 1.344</code>，即增长约 34.4%。年限越长，差距越大：50 年后是 <code>1.03<sup>50</sup> ≈ 4.38</code>，增长 338%，而不是 150%。复利与通货膨胀的计算都靠这个区别。' },

    { t: 'h', lvl: 2, text: '四、对数的定义与换底', id: 'ch03-4' },

    { t: 'p', html: '对数是指数的逆运算：<code>log<sub>a</sub>x = y</code> 当且仅当 <code>a<sup>y</sup> = x</code>。要求 <code>a &gt; 0</code>、<code>a ≠ 1</code>、<code>x &gt; 0</code>。所以「<code>log<sub>2</sub>8</code> 等于几」就是问「2 的几次方是 8」，答案是 3。常用两种底：<code>log<sub>10</sub></code> 记作 <code>lg</code> 或直接 <code>log</code>，<code>log<sub>e</sub></code> 记作 <code>ln</code>。' },

    { t: 'table', head: ['指数写法', '对数写法', '读法'], rows: [
      ['<code>2<sup>3</sup> = 8</code>', '<code>log<sub>2</sub>8 = 3</code>', '以 2 为底 8 的对数是 3'],
      ['<code>10<sup>−2</sup> = 0.01</code>', '<code>log<sub>10</sub>0.01 = −2</code>', '常用对数'],
      ['<code>e<sup>0</sup> = 1</code>', '<code>ln 1 = 0</code>', '任何底数 1 的对数都是 0'],
      ['<code>e<sup>1</sup> = e</code>', '<code>ln e = 1</code>', '自然对数的底'],
      ['<code>a<sup>log<sub>a</sub>x</sub> = x</code>', '<code>log<sub>a</sub>(a<sup>x</sup>) = x</code>', '互为逆运算，两条恒等式']
    ], caption: '把对数读成「指数是几」，绝大多数性质就能自己推出来' },

    { t: 'p', html: '三条对数律对应三条指数律：<code>log<sub>a</sub>(xy) = log<sub>a</sub>x + log<sub>a</sub>y</code>、<code>log<sub>a</sub>(x/y) = log<sub>a</sub>x − log<sub>a</sub>y</code>、<code>log<sub>a</sub>(x<sup>r</sup>) = r·log<sub>a</sub>x</code>。第一条把乘法变成加法，这正是对数在计算尺时代的意义，也是今天处理「连乘」问题的钥匙。第三条最重要：它把指数上的未知数<b>拉下来变成系数</b>，这是解指数方程的唯一通道。' },

    { t: 'p', html: '<b>换底公式</b>：<code>log<sub>a</sub>x = ln x / ln a</code>。计算器只有 <code>ln</code> 与 <code>log<sub>10</sub></code>，所以算 <code>log<sub>2</sub>10</code> 要写成 <code>ln10/ln2 ≈ 2.3026/0.6931 ≈ 3.3219</code>。换底还给出一个常用结论：<code>log<sub>a</sub>x · log<sub>x</sub>a = 1</code>，即互为倒数。' },

    { t: 'callout', kind: 'warn', title: '错误说法：log(a + b) = log a + log b', html: '为什么错：对数律只管<b>乘法</b>，不管加法。取 <code>a = b = 10</code>：<code>log(20) ≈ 1.301</code>，而 <code>log10 + log10 = 2</code>，差得很远。正确说法：<code>log(ab) = log a + log b</code>。同理 <code>(log x)<sup>2</sup> ≠ 2log x</code>，后者是 <code>log(x<sup>2</sup>)</code>；<code>log(x + y)</code> 没有简化公式，只能原样保留。' },

    { t: 'h', lvl: 2, text: '五、对数方程与不等式', id: 'ch03-5' },

    { t: 'p', html: '解指数方程的一般套路是「两边取对数」；解对数方程的一般套路是「化成指数形式」或「用对数律合并成一项」。两条路都要在最后<b>检验定义域</b>：对数的真数必须为正，底数必须为正且不等于 1。代入原式检验不是形式主义，它常常砍掉一半答案。' },

    { t: 'p', html: '例 1：<code>2<sup>x+1</sup> = 10</code>。两边取自然对数：<code>(x + 1)ln2 = ln10</code>，<code>x = ln10/ln2 − 1 ≈ 3.3219 − 1 = 2.3219</code>。例 2：<code>5e<sup>−0.2t</sup> = 2</code>。先除 5：<code>e<sup>−0.2t</sup> = 0.4</code>，取对数：<code>−0.2t = ln0.4 ≈ −0.9163</code>，<code>t ≈ 4.58</code>。例 3：<code>log<sub>2</sub>(x − 1) + log<sub>2</sub>(x + 3) = 3</code>。合并：<code>log<sub>2</sub>[(x−1)(x+3)] = 3</code>，化成指数：<code>(x−1)(x+3) = 8</code>，展开得 <code>x<sup>2</sup> + 2x − 11 = 0</code>，<code>x = −1 ± 2√3</code>。检验：<code>x = −1 − 2√3 ≈ −4.46</code> 使 <code>x + 3 &lt; 0</code>，舍去；只留 <code>x = −1 + 2√3 ≈ 2.46</code>。' },

    { t: 'p', html: '不等式要多一步：<b>底数小于 1 时，取对数要变号</b>。例：<code>0.5<sup>x</sup> &lt; 0.1</code>。两边取 <code>ln</code>（<code>ln0.5 &lt; 0</code>）：<code>x·ln0.5 &lt; ln0.1</code>，除以负数变号：<code>x &gt; ln0.1/ln0.5 ≈ 3.3219</code>。检验：<code>x = 4</code> 时 <code>0.5<sup>4</sup> = 0.0625 &lt; 0.1</code>，成立；<code>x = 3</code> 时 0.125，不成立。若底数大于 1，则不变号，这是唯一的区别。' },

    { t: 'h', lvl: 2, text: '六、半衰期与对数坐标', id: 'ch03-6' },

    { t: 'p', html: '<b>半衰期</b>是量减少到一半所需的时间，记作 <code>T<sub>1/2</sub></code>。由 <code>N<sub>0</sub>/2 = N<sub>0</sub>e<sup>kT</sup></code> 得 <code>T = ln2 / |k|</code>。碳 14 的半衰期约 5730 年，考古测年就靠它：测出样品中碳 14 的比例，反推年代。例：某样品碳 14 含量是正常的 30%，求年代。<code>0.3 = e<sup>−0.000121t</sup></code>，<code>t = −ln0.3/0.000121 ≈ 9958</code> 年。' },

    { t: 'p', html: '另一类问题是「还剩多少」：某药物半衰期 6 小时，初始剂量 400 mg，问 20 小时后剩多少。<code>N = 400 × (1/2)<sup>20/6</sup> = 400 × 0.5<sup>3.333</sup> ≈ 400 × 0.0992 ≈ 39.7</code> mg。注意这里的写法 <code>(1/2)<sup>t/T</sup></code> 与 <code>e<sup>kt</sup></code> 等价，选哪个只看方便。' },

    { t: 'p', html: '<b>对数坐标</b>把指数曲线拉成直线。若 <code>y = Ae<sup>kt</sup></code>，两边取对数得 <code>ln y = ln A + kt</code>，这是以 <code>t</code> 为横轴、<code>ln y</code> 为纵轴的直线，斜率就是 <code>k</code>。所以判断一组数据是不是指数增长，最快的方法是把 <code>y</code> 取对数再画：<b>成直线就是指数量，弯曲就不是</b>。同理，双对数坐标下成直线说明是幂函数 <code>y = Ax<sup>p</sup></code>。' },

    { t: 'table', head: ['坐标类型', '横轴', '纵轴', '成直线意味着'], rows: [
      ['普通坐标', 't', 'y', '线性关系 y = mt + b'],
      ['半对数坐标', 't', 'ln y', '指数关系 y = Ae<sup>kt</sup>'],
      ['双对数坐标', 'ln x', 'ln y', '幂函数 y = Ax<sup>p</sup>'],
      ['半对数坐标（x 取对数）', 'ln x', 'y', '对数关系 y = a ln x + b']
    ], caption: '「取对数把曲线拉直」是实验数据处理里最常用的技巧之一' },

    { t: 'h', lvl: 2, text: '七、三种模型的辨识', id: 'ch03-7' },

    { t: 'p', html: '拿到一组数据，先判断它属于线性、指数还是幂函数，再谈拟合。三种模型的差别在「等间隔变化时，输出怎么变」：线性是差恒定，指数是比恒定，幂函数是双对数斜率恒定。做题时最直接的检验是算相邻两项的差与比。' },

    { t: 'compare', left: { title: '指数增长 vs 幂函数增长', html: '<b>指数</b> <code>2<sup>x</sup></code>：底数固定，指数变。x 每加 1，值乘 2；x = 10 时 1024，x = 20 时约 100 万。<b>幂函数</b> <code>x<sup>2</sup></code>：指数固定，底数变；x 翻倍，值变 4 倍。长期看，指数一定赢过任何幂函数——这是「指数爆炸」的数学含义。' }, right: { title: '怎么用数据区分', html: '算相邻的比：<code>2, 4, 8, 16</code> 比值恒为 2，是指数；算相邻的差：<code>1, 4, 9, 16</code> 差为 <code>3, 5, 7</code>，是二次；若双对数图上成直线，是幂函数。只有三个数据点时，三种模型都可能拟合，别急着下结论。' } },

    { t: 'p', html: '例：某城市人口 <code>P(t) = 80e<sup>0.02t</sup></code>（万人，t 为 2000 年后的年数）。问 2030 年人口：<code>80e<sup>0.6</sup> ≈ 145.8</code> 万。问何时翻倍：<code>t = ln2/0.02 ≈ 34.7</code>，约 2035 年。若改成线性模型 <code>P = 80 + 1.6t</code>，2030 年只有 128 万，且永远不会有「翻倍时间」这个概念。模型选错，预测就会在几十年后差出一倍。' },

    { t: 'p', html: '最后一个提醒：指数模型只在<b>有限区间</b>内可信。细菌在培养皿里不可能无限增长，人口受资源限制，复利受市场影响。真实数据到了后期往往会「拐弯」，变成 logistic 曲线。本章的公式给出的是短期内的好近似，不是永恒定律。' },

    { t: 'terms', items: [
      { en: 'exponential function', zh: '指数函数', html: 'f(x) = a<sup>x</sup>（a &gt; 0，a ≠ 1）；恒过 (0,1)，以 x 轴为水平渐近线。' },
      { en: 'compound interest', zh: '复利', html: 'A = P(1 + r/n)<sup>nt</sup>；n → ∞ 时趋于连续复利 A = Pe<sup>rt</sup>。' },
      { en: 'e', zh: '自然常数', html: '约 2.71828，是 (1 + 1/n)<sup>n</sup> 的极限；e<sup>x</sup> 的导数等于自身。' },
      { en: 'logarithm', zh: '对数', html: 'log<sub>a</sub>x = y 表示 a<sup>y</sup> = x；把乘法变成加法，把指数拉成系数。' },
      { en: 'half-life', zh: '半衰期', html: '量减半所需时间，T = ln2/|k|；碳 14 测年、药物代谢都用它。' },
      { en: 'log scale', zh: '对数坐标', html: '纵轴取对数后，指数曲线变成直线，斜率就是增长率 k。' }
    ] },

    { t: 'quiz', qid: 'ch03-q1' },
    { t: 'quiz', qid: 'ch03-q2' },
    { t: 'quiz', qid: 'ch03-q3' },

    { t: 'keypoint', items: [
      { title: '指数是「乘同一个倍数」', html: '等间隔看比值，比值恒定就是指数；不要和「加同一个数」的线性混。' },
      { title: 'e 来自无限次复利', html: '连续复利 A = Pe<sup>rt</sup>；任何底数都能换成 e 的写法。' },
      { title: '解指数方程只有一条路：取对数', html: '把指数上的未知数拉下来；底数小于 1 时不等号要变向。' },
      { title: '对数律只管乘法', html: 'log(ab)、log(a/b)、log(a<sup>r</sup>) 有公式；log(a + b) 没有。' },
      { title: '半衰期与翻倍时间是一枚硬币的两面', html: 'T = ln2/|k|；测出一个就能算出另一个。' }
    ] },

    { t: 'checklist', id: 'ch03', items: [
      '我能说出 2<sup>x</sup> 与 x<sup>2</sup> 在 x 增大时的区别，并各举一个现实例子',
      '我能算出 1000 元按 5% 月复利存 10 年的本息，并与连续复利比较',
      '我能解释 e 是怎么从复利公式里出来的',
      '我能由「3 小时从 200 涨到 1600」求出增长率 k 与翻倍时间',
      '我能把 log<sub>2</sub>10 用 ln 表示并算出近似值',
      '我能解 2<sup>x+1</sup> = 10 与 5e<sup>−0.2t</sup> = 2，并写出精确解',
      '我能解 log<sub>2</sub>(x−1) + log<sub>2</sub>(x+3) = 3，并说明为什么要舍去一个根',
      '我能用碳 14 的半衰期估算 30% 含量对应的年代',
      '我能解释为什么「取对数后成直线」说明数据是指数关系'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应 Precalculus 7th Edition 第 4 章：指数函数的图像与运算律、复利与 e、指数增长与衰减模型、对数定义与三条对数律、换底公式、指数与对数方程及不等式、半衰期与对数坐标、模型辨识。教材中关于 logistic 增长与更复杂的金融公式只作为延伸提及，未展开推导。复利与碳 14 的数值使用常见近似（e ≈ 2.71828，碳 14 半衰期 5730 年），用于说明方法，不构成精确的金融或考古结论。' }
  ]
});
