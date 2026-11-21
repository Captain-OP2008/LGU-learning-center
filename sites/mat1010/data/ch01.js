/* =====================================================================
 * ch01.js · 第 1 章「代数基础：指数、方程与不等式」
 * 职责：把后面六章要用的代数动作一次讲清：幂与对数、方程三型、
 *       不等式与绝对值、求和与复利、增长率。
 * 依据：Essential Mathematics for Economic Analysis（5th ed）第 1–4 章
 *       的代数预备与「增长率、复利」小节。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch01',
  num: '01',
  title: '代数基础：指数、方程与不等式',
  en: 'ALGEBRA ESSENTIALS',
  goals: [
    '熟练运用指数法则与对数法则，把乘方、开方、连乘写成可计算的形式',
    '解线性、二次与分式三类方程，并能判断解的个数与增根',
    '解一元一次不等式与含绝对值的不等式，写清变号规则',
    '用求和公式与复利公式处理分期付款、年金与折现问题',
    '区分增长率、百分比与百分点，为后面的弹性和边际分析打好语言基础'
  ],
  kp: [
    { id: 'ch01-1', title: '幂与指数法则' },
    { id: 'ch01-2', title: '对数、换底与连续增长' },
    { id: 'ch01-3', title: '方程三型：线性、二次、分式' },
    { id: 'ch01-4', title: '不等式与绝对值' },
    { id: 'ch01-5', title: '求和、复利与年金' },
    { id: 'ch01-6', title: '增长率、百分比与百分点' },
    { id: 'ch01-7', title: '常见代数陷阱' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么代数要单独占一章', html: '这门课后面的每一次推导，落到最后都是<b>四则运算加乘方</b>。可是考试里真正丢分的地方，常常不是不会求导，而是把 <code>(a+b)<sup>2</sup></code> 展开成 <code>a<sup>2</sup>+b<sup>2</sup></code>、把 <code>ln(a+b)</code> 拆成 <code>ln a + ln b</code>、解不等式时乘了负数却忘记变号。这些错误一旦发生，后面的经济学解释再漂亮也没用。这一章把地基重新浇一遍。' },

    { t: 'p', lead: true, html: '代数是把「关系」写成符号的语言。经济学里几乎每个关系都要写成方程或不等式：供需相等是方程，预算不超过收入是不等式，连续复利是带指数的式子。语言不熟，后面的思想就表达不出来。好消息是，这一章需要的技巧并不多，但每一条都必须练到不出错。' },

    { t: 'p', html: '先看代数在本课里的三个具体岗位。<b>第一，解方程</b>：均衡价格就是供给等于需求那个方程的解，最优产量就是一阶条件等于零那个方程的解。<b>第二，处理指数与对数</b>：复利、折现、指数增长、对数效用，全部绕不开 <code>e<sup>x</sup></code> 与 <code>ln x</code>。<b>第三，处理不等式</b>：预算约束、非负约束、闭区间最值，最后都要落到「x 在哪个范围里」。三个岗位对应本章的三块内容。' },

    { t: 'table', head: ['代数动作', '在本课哪里用', '出错代价'], rows: [
      ['指数运算', '复利、折现、生产函数、指数需求', '把 <code>e<sup>2x</sup></code> 当成 <code>2e<sup>x</sup></code>，整题作废'],
      ['对数运算', '解 <code>3<sup>x</sup>=12</code>、连续增长率、对数求导', '把 <code>ln(xy)</code> 写成 <code>ln x · ln y</code>'],
      ['解方程', '市场均衡、一阶条件、盈亏平衡点', '移项符号错，均衡价格变成负数还照抄'],
      ['解不等式', '预算约束、非负约束、最值的可行区间', '乘负数不变号，可行域整个反了'],
      ['求和与复利', '年金、分期还款、多期收益的现值', '把 10 期当成 9 期，差一位数'],
      ['增长率换算', '弹性、百分比变化、CAGR', '把百分点当百分比，结论夸大十倍']
    ], caption: '六类动作，每一类都在后面的章节里至少出现三次' },

    { t: 'h', lvl: 2, text: '一、幂与指数法则', id: 'ch01-1' },

    { t: 'p', html: '先约定写法：<code>a<sup>n</sup></code> 表示 n 个 a 相乘，a 叫底数（base），n 叫指数（exponent）。指数最初只对正整数有意义，但经济模型需要它扩展到负数、分数甚至无理数：负指数描述衰减，分数指数描述开方，无理指数描述连续增长。扩展的代价是必须遵守一套严格的法则，不能凭直觉。' },

    { t: 'table', head: ['法则', '口诀', '例子'], rows: [
      ['<code>a<sup>m</sup>·a<sup>n</sup> = a<sup>m+n</sup></code>', '同底相乘，指数相加', '<code>2<sup>3</sup>·2<sup>4</sup> = 2<sup>7</sup> = 128</code>'],
      ['<code>a<sup>m</sup>/a<sup>n</sup> = a<sup>m−n</sup></code>', '同底相除，指数相减', '<code>2<sup>5</sup>/2<sup>2</sup> = 2<sup>3</sup> = 8</code>'],
      ['<code>(a<sup>m</sup>)<sup>n</sup> = a<sup>mn</sup></code>', '幂的幂，指数相乘', '<code>(2<sup>3</sup>)<sup>4</sup> = 2<sup>12</sup> = 4096</code>'],
      ['<code>(ab)<sup>n</sup> = a<sup>n</sup>b<sup>n</sup></code>', '积的幂，分别乘方', '<code>(2·5)<sup>3</sup> = 8·125 = 1000</code>'],
      ['<code>a<sup>−n</sup> = 1/a<sup>n</sup></code>', '负指数是倒数', '<code>2<sup>−3</sup> = 1/8 = 0.125</code>'],
      ['<code>a<sup>m/n</sup> = <sup>n</sup>√(a<sup>m</sup>)</code>', '分数指数是开方', '<code>8<sup>2/3</sup> = (∛8)<sup>2</sup> = 4</code>']
    ], caption: '六条法则全部由「指数是乘法次数」这一条推出，忘了就现推' },

    { t: 'p', html: '注意法则的适用条件：<b>同底</b>才能直接加减指数。<code>2<sup>3</sup>·3<sup>3</sup></code> 不能写成 <code>6<sup>6</sup></code>，只能写成 <code>(2·3)<sup>3</sup> = 6<sup>3</sup> = 216</code>。同样，<code>a<sup>m</sup>+a<sup>n</sup></code> 没有任何合并公式，<code>2<sup>3</sup>+2<sup>4</sup> = 8+16 = 24</code>，不等于 <code>2<sup>7</sup></code>。这是最常见的两个误用。' },

    { t: 'p', html: '做两道经济味的练习。某基金连续三年年化收益 8%，三年后的 1 元变成 <code>1.08<sup>3</sup> ≈ 1.2597</code> 元，累计收益约 26%；如果改成连续复利 8%，三年后是 <code>e<sup>0.24</sup> ≈ 1.2712</code> 元，略高一点。再看生产函数：<code>Q = 10K<sup>0.3</sup>L<sup>0.7</sup></code>，当 <code>K = L = 8</code> 时，<code>K<sup>0.3</sup>L<sup>0.7</sup> = 8<sup>0.3+0.7</sup> = 8</code>，所以 <code>Q = 80</code>。这里用的正是「同底相乘指数相加」，把两个投入合并成一个幂，计算立刻变简单。' },

    { t: 'callout', kind: 'tip', title: '负指数与零指数别慌', html: '<code>a<sup>0</sup> = 1</code>（a≠0）不是规定出来的巧合，而是 <code>a<sup>n</sup>/a<sup>n</sup> = a<sup>0</sup></code> 且同数相除等于 1 的必然结果。负指数同理：<code>a<sup>−n</sup> = a<sup>0−n</sup> = a<sup>0</sup>/a<sup>n</sup> = 1/a<sup>n</sup></code>。理解了来源，就不会把 <code>2<sup>−3</sup></code> 写成 <code>−8</code>。' },

    { t: 'h', lvl: 2, text: '二、对数、换底与连续增长', id: 'ch01-2' },

    { t: 'p', html: '对数（logarithm）是指数的逆运算。<code>ln x</code> 读作「x 的自然对数」，定义是：<code>ln x = y</code> 当且仅当 <code>e<sup>y</sup> = x</code>，其中 <code>e ≈ 2.71828</code>。定义域是 <code>x &gt; 0</code>，值域是全体实数。经济学里用自然对数而不是以 10 为底，因为 <code>ln x</code> 的导数是 <code>1/x</code>，形式最干净。' },

    { t: 'table', head: ['法则', '写法', '例子'], rows: [
      ['乘积变加法', '<code>ln(xy) = ln x + ln y</code>', '<code>ln(2·5) = ln2 + ln5</code>'],
      ['商变减法', '<code>ln(x/y) = ln x − ln y</code>', '<code>ln(10/2) = ln10 − ln2</code>'],
      ['幂变系数', '<code>ln(x<sup>p</sup>) = p·ln x</code>', '<code>ln(8<sup>2</sup>) = 2ln8</code>'],
      ['底数为 1', '<code>ln 1 = 0</code>', '<code>e<sup>0</sup> = 1</code>'],
      ['底数为 e', '<code>ln e = 1</code>', '<code>e<sup>1</sup> = e</code>'],
      ['换底公式', '<code>log<sub>b</sub>x = ln x / ln b</code>', '<code>log<sub>3</sub>12 = ln12/ln3</code>']
    ], caption: '三条法则把乘除、乘方降级成加减、倍乘，这就是对数解方程的原理' },

    { t: 'p', html: '典型用法是解「指数在未知数上」的方程。比如 <code>3<sup>x</sup> = 12</code>，两边取自然对数：<code>x·ln3 = ln12</code>，所以 <code>x = ln12/ln3 = 2.4849/1.0986 ≈ 2.2619</code>。验算：<code>3<sup>2.2619</sup> = e<sup>2.2619×1.0986</sup> = e<sup>2.4849</sup> ≈ 12</code>。同类题还有「多少年翻倍」：<code>1.07<sup>t</sup> = 2</code> 给出 <code>t = ln2/ln1.07 = 0.6931/0.06766 ≈ 10.24</code> 年。' },

    { t: 'p', html: '连续增长用 <code>e</code> 表达最方便。若某变量按连续增长率 r 增长，t 期后为 <code>V(t) = V<sub>0</sub>e<sup>rt</sup></code>。年利率 6%、连续计息一年，<code>e<sup>0.06</sup> ≈ 1.061837</code>，即有效年利率 6.1837%，比名义 6% 高一点点；这个差额随 r 增大而迅速变大，r = 20% 时有效年利率已达 <code>e<sup>0.2</sup>−1 ≈ 22.14%</code>。金融产品宣传「连续复利」时，差别就藏在这里。' },

    { t: 'p', html: '再提醒一个方向性问题：<code>ln(x+y)</code> <b>没有</b>展开公式，它既不等于 <code>ln x + ln y</code>，也不等于 <code>ln x · ln y</code>。遇到 <code>ln(x+y)</code> 只能整体处理，或者先做变量代换。同理 <code>e<sup>x+y</sup> = e<sup>x</sup>·e<sup>y</sup></code> 是对的，而 <code>e<sup>xy</sup></code> 不能拆成 <code>e<sup>x</sup>e<sup>y</sup></code>。' },

    { t: 'quiz', qid: 'ch01-q1' },

    { t: 'h', lvl: 2, text: '三、方程三型：线性、二次、分式', id: 'ch01-3' },

    { t: 'p', html: '本课遇到的方程绝大多数属于三型。<b>线性方程</b> <code>ax + b = 0</code> 有唯一解 <code>x = −b/a</code>（a≠0），对应一条直线与横轴的交点。经济里最常见的线性方程是市场均衡：<code>100 − 2P = 20 + 3P</code>，移项得 <code>80 = 5P</code>，<code>P* = 16</code>，再代回任一式得 <code>Q* = 68</code>。解完务必代回原式验算，这是防移项错误最便宜的办法。' },

    { t: 'p', html: '<b>二次方程</b> <code>ax<sup>2</sup> + bx + c = 0</code> 用求根公式 <code>x = (−b ± √(b<sup>2</sup>−4ac))/(2a)</code>。判别式 <code>Δ = b<sup>2</sup>−4ac</code> 决定解的个数：Δ&gt;0 两个实根，Δ=0 一个重根，Δ&lt;0 无实根。以 <code>2x<sup>2</sup>−8x+6 = 0</code> 为例，先除以 2 化简为 <code>x<sup>2</sup>−4x+3 = 0</code>，因式分解 <code>(x−1)(x−3) = 0</code>，得 <code>x = 1</code> 或 <code>x = 3</code>；用公式验证：<code>Δ = 16−12 = 4</code>，<code>x = (4±2)/2</code>，同样是 1 和 3。' },

    { t: 'steps', items: [
      { title: '先化简', html: '两边同除公因数，把二次项系数变成 1，能省一半计算量。上例除以 2 后系数立刻变小。' },
      { title: '再看能不能因式分解', html: '找两个数，乘积等于常数项、和等于一次项系数的相反数。3 与 1 满足：积 3、和 4。' },
      { title: '分解不了就用公式', html: '求根公式永远有效。先算判别式 Δ，Δ&lt;0 直接写「无实根」，不要硬算。' },
      { title: '代回检验并取舍', html: '经济问题里常要舍去负根（价格、数量不能为负），这一步必须在答案里写明。' }
    ] },

    { t: 'p', html: '二次方程在经济里常出现在「盈亏平衡」和「最优产量」两类问题。例如总成本 <code>C(Q) = 200 + 5Q + 0.1Q<sup>2</sup></code>、价格固定 25 元，利润 <code>π(Q) = 25Q − 200 − 5Q − 0.1Q<sup>2</sup> = −0.1Q<sup>2</sup> + 20Q − 200</code>。令 <code>π = 0</code> 得 <code>Q<sup>2</sup> − 200Q + 2000 = 0</code>，<code>Q = (200 ± √(40000−8000))/2 = (200 ± 178.885)/2</code>，即 <code>Q ≈ 10.56</code> 与 <code>Q ≈ 189.44</code>：产量在这两个数之间才盈利。' },

    { t: 'p', html: '<b>分式方程</b>的关键是「先去分母，再验根」。例如 <code>(x+1)/(x−2) = 3</code>，两边乘 <code>(x−2)</code> 得 <code>x+1 = 3x−6</code>，<code>7 = 2x</code>，<code>x = 3.5</code>，代回分母 <code>3.5−2 = 1.5 ≠ 0</code>，成立。但如果方程是 <code>x/(x−2) = 2/(x−2)</code>，去分母得 <code>x = 2</code>，而 <code>x = 2</code> 让分母为零，这个根必须舍去，原方程无解——这类根叫增根（extraneous root），是分式方程特有的陷阱。' },

    { t: 'h', lvl: 2, text: '四、不等式与绝对值', id: 'ch01-4' },

    { t: 'p', html: '不等式的解集是一个区间，不是单个点。规则只有一条需要死记：<b>两边同乘或同除一个负数，不等号方向翻转</b>。例如 <code>−2x + 6 &gt; 4</code>，先移项得 <code>−2x &gt; −2</code>，再除以 −2 得 <code>x &lt; 1</code>，解集是 <code>(−∞, 1)</code>。如果忘记变号写成 <code>x &gt; 1</code>，可行域就整个反了，后面的最值一定算错。' },

    { t: 'p', html: '绝对值表示距离。<code>|x − 3| ≤ 2</code> 读作「x 到 3 的距离不超过 2」，直接翻译成双边不等式 <code>−2 ≤ x − 3 ≤ 2</code>，三边同加 3 得 <code>1 ≤ x ≤ 5</code>，解集是闭区间 <code>[1, 5]</code>。若换成 <code>|x − 3| ≥ 2</code>，则距离至少为 2，解集裂成两段：<code>x ≤ 1</code> 或 <code>x ≥ 5</code>。小于取中间，大于取两边——这句口诀配着数轴图记最牢。' },

    { t: 'callout', kind: 'warn', title: '三个高频不等式错误', html: '① 乘除负数不变号；② 把 <code>|x−3| ≤ 2</code> 直接拆成 <code>x−3 ≤ 2</code> 丢掉负半支；③ 不等式两边同乘含未知数的式子（如 <code>x−2</code>）却不讨论它的正负。第三条在分式不等式里最致命，正确做法是先移项通分，再用符号表判断。' },

    { t: 'p', html: '为什么本课要反复练不等式？因为经济问题的答案几乎都带约束。产量非负 <code>Q ≥ 0</code>；预算 <code>p<sub>1</sub>x<sub>1</sub> + p<sub>2</sub>x<sub>2</sub> ≤ m</code>；市场份额不超过 1；税率在 0 与 1 之间。求最值时，如果驻点落在可行区间外，最优解就只能在边界上取——这个判断的前提，正是你能把可行区间写对。' },

    { t: 'quiz', qid: 'ch01-q2' },

    { t: 'h', lvl: 2, text: '五、求和、复利与年金', id: 'ch01-5' },

    { t: 'p', html: '离散求和用 <code>Σ</code>。<code>Σ<sub>i=1</sub><sup>n</sup> i = n(n+1)/2</code>，所以 <code>1+2+…+100 = 5050</code>。这个公式在算「每期递增的现金流」时很好用。等比求和是 <code>Σ<sub>k=0</sub><sup>n−1</sup> ar<sup>k</sup> = a(1−r<sup>n</sup>)/(1−r)</code>（r≠1），它是所有年金公式的母公式。' },

    { t: 'p', html: '复利（compound interest）就是在每期结束时把利息并入本金。本金 P、年利率 r、每年计息 m 次、t 年，终值为 <code>P(1+r/m)<sup>mt</sup></code>；令 m→∞ 得到连续复利 <code>Pe<sup>rt</sup></code>。折现是反方向：t 年后的 F 元，按年复利折现为 <code>F/(1+r)<sup>t</sup></code>，按连续复利折现为 <code>Fe<sup>−rt</sup></code>。' },

    { t: 'p', html: '算一个年金。每年年末存入 1000 元、利率 5%、连续存 10 年，第 10 年末的终值是 <code>1000 × ((1.05<sup>10</sup>−1)/0.05)</code>。<code>1.05<sup>10</sup> ≈ 1.628895</code>，括号内为 <code>12.5779</code>，终值约 <b>12577.9 元</b>。如果问的是这 10 笔钱在今天的价值，则用现值公式 <code>1000 × (1−1.05<sup>−10</sup>)/0.05</code>，<code>1.05<sup>−10</sup> ≈ 0.613913</code>，现值约 <b>7721.7 元</b>。终值与现值差一个 <code>1.05<sup>10</sup></code> 的因子，这个关系可以用来验算。' },

    { t: 'table', head: ['计息方式', '1000 元存 3 年的终值', '说明'], rows: [
      ['单利 5%', '<code>1000(1+3×0.05) = 1150.00</code>', '只对本金计息，利息不再生息'],
      ['年复利 5%', '<code>1000×1.05<sup>3</sup> = 1157.63</code>', '每年把利息并入本金'],
      ['连续复利 5%', '<code>1000e<sup>0.15</sup> ≈ 1161.83</code>', '计息频率趋于无穷的极限'],
      ['连续 6% 的有效年利率', '<code>e<sup>0.06</sup>−1 ≈ 6.184%</code>', '连续利率换算成年复利利率']
    ], caption: '同一笔钱、同一个名义利率，计息方式不同，结果差出十几元；期限越长差距越大' },

    { t: 'p', html: '这里有一个容易忽略的点：<b>「年利率 5%」这句话本身不完整</b>，必须问清计息频率。信用卡宣传「日息万分之五」，换算成年化约 <code>0.0005×365 = 18.25%</code>，若按日复利则是 <code>(1+0.0005)<sup>365</sup>−1 ≈ 20.0%</code>。名义利率（nominal rate）与实际年利率（effective annual rate）的差别，就是复利频率造成的。' },

    { t: 'quiz', qid: 'ch01-q3' },

    { t: 'h', lvl: 2, text: '六、增长率、百分比与百分点', id: 'ch01-6' },

    { t: 'p', html: '增长率的标准写法是 <code>g = (新值 − 旧值)/旧值</code>。从 80 涨到 100，<code>g = 20/80 = 25%</code>；从 100 跌回 80，<code>g = −20/100 = −20%</code>。涨 25% 再跌 20% 正好回到原点，因为两次的<b>分母不同</b>。这个不对称性是很多人算错复合增长的原因：先涨 10% 再跌 10%，结果不是回到原值，而是 <code>1.1×0.9 = 0.99</code>，少了 1%。' },

    { t: 'p', html: '多期平均增长要用几何平均，即复合年增长率（CAGR）：<code>g = (V<sub>T</sub>/V<sub>0</sub>)<sup>1/T</sup> − 1</code>。某地 GDP 从 80 涨到 100 用了 5 年，<code>g = 1.25<sup>1/5</sup> − 1 ≈ 4.56%</code>，而不是算术平均的 5%。差别看似小，十年复利下来能差出好几个百分点。' },

    { t: 'p', html: '「翻倍时间」有一个好用的近似：<b>70 法则</b>，<code>t ≈ 70/r%</code>。年增长 7% 时约 10 年翻倍；精确值是 <code>ln2/0.07 ≈ 9.90</code> 年。增长率越低，近似越准；r = 20% 时近似给 3.5 年，精确值 <code>ln2/0.2 ≈ 3.47</code> 年，仍然够用。这个法则在讨论「多久能追平」「多久能回本」时非常方便。' },

    { t: 'p', html: '最后区分<b>百分比（percent）与百分点（percentage point）</b>。失业率从 5% 升到 6%，可以说「上升 1 个百分点」，也可以说「相对上升 20%」，但绝不能说「上升 1%」——那会被理解成 5.05%。同理，利率从 4% 降到 3%，是下降 1 个百分点、相对下降 25%。考试里写错这两个词，解释题直接扣分。' },

    { t: 'h', lvl: 2, text: '七、常见代数陷阱', id: 'ch01-7' },

    { t: 'p', html: '下面四条误用，每条都能在作业里找到真实案例。它们的共同点是「看起来很像某个正确公式」，所以必须靠对比记忆，而不是靠感觉。' },

    { t: 'p', html: '<b>陷阱一：平方展开。</b><code>(a+b)<sup>2</sup> = a<sup>2</sup> + 2ab + b<sup>2</sup></code>，中间项不能丢。经济里算方差、算平方损失时经常用到。<b>陷阱二：根号不可拆。</b><code>√(a+b) ≠ √a + √b</code>，取 <code>a = b = 9</code> 立即验证：左边 3√2 ≈ 4.24，右边 6。<b>陷阱三：对数不可拆和。</b><code>ln(a+b) ≠ ln a + ln b</code>，只有乘积才能拆成和。<b>陷阱四：约分不能约加法。</b><code>(x+2)/2 ≠ x</code>，分子是整体，不能只约掉其中一项。' },

    { t: 'compare', left: { title: '展开与因式分解：同一个式子的两个方向', html: '<code>(x+3)(x−3) = x<sup>2</sup>−9</code>。展开用于把乘积变成多项式，便于逐项求导；因式分解用于找根，<code>x<sup>2</sup>−9 = 0</code> 立刻给出 <code>x = ±3</code>。考试里先问自己「要根还是要系数」，再决定往哪个方向走。' }, right: { title: '配方：二次函数的第三种写法', html: '<code>x<sup>2</sup>−4x+3 = (x−2)<sup>2</sup>−1</code>。配方直接把顶点坐标读出来：顶点 <code>(2, −1)</code>，最小值 −1。ch02 讨论抛物线顶点、ch04 讨论极小值时，配方比求根公式更直观。' } },

    { t: 'p', html: '还有一个习惯值得养成：<b>算完代回原式</b>。方程代回看等号是否成立；不等式代回取一个端点附近的数试试；复利题用「终值 ÷ 现值 = 增长因子」反算期数。验算只要十几秒，却能拦住绝大多数符号错误。' },

    { t: 'callout', kind: 'exam', title: '考试里怎么写得干净', html: '解方程写「移项 → 化简 → 求根 → 取舍」四行；不等式写「移项 → 除系数（注明变号）→ 区间」；对数题写「两边取 ln → 用幂法则 → 解出」；复利题先写公式再代数字，最后单独一行写单位。判卷看的是步骤，不是心算速度。' },

    { t: 'terms', items: [
      { en: 'base / exponent', zh: '底数 / 指数', html: '<code>a<sup>n</sup></code> 中 a 是底数，n 是指数，表示 n 个 a 相乘。' },
      { en: 'natural logarithm', zh: '自然对数', html: '以 e 为底的对数 <code>ln x</code>，定义域 x&gt;0，导数为 1/x。' },
      { en: 'discriminant', zh: '判别式', html: '二次方程的 <code>Δ = b<sup>2</sup>−4ac</code>，符号决定实根个数。' },
      { en: 'extraneous root', zh: '增根', html: '去分母后产生、但使原式分母为零的根，必须舍去。' },
      { en: 'compound interest', zh: '复利', html: '每期把利息并入本金再计息，终值 <code>P(1+r/m)<sup>mt</sup></code>。' },
      { en: 'present value', zh: '现值', html: '未来现金流按利率折到今天的价值，连续情形为 <code>Fe<sup>−rt</sup></code>。' },
      { en: 'CAGR', zh: '复合年增长率', html: '多期平均增长率，<code>(V<sub>T</sub>/V<sub>0</sub>)<sup>1/T</sup>−1</code>，用几何平均而非算术平均。' },
      { en: 'percentage point', zh: '百分点', html: '两个百分比之差的绝对量；与「相对变化百分之几」不同。' }
    ] },

    { t: 'keypoint', items: [
      { title: '指数法则只在同底时合并', html: '<code>a<sup>m</sup>a<sup>n</sup> = a<sup>m+n</sup></code>、<code>(a<sup>m</sup>)<sup>n</sup> = a<sup>mn</sup></code>；<code>a<sup>m</sup>+a<sup>n</sup></code> 没有合并公式。' },
      { title: '对数把乘除降级为加减', html: '<code>ln(xy) = ln x + ln y</code>、<code>ln(x<sup>p</sup>) = p ln x</code>；<code>ln(x+y)</code> 不可拆。' },
      { title: '二次方程先看判别式', html: '<code>Δ = b<sup>2</sup>−4ac</code>：正两解、零一解、负无实解；经济题要舍负根。' },
      { title: '分式方程必须验根', html: '去分母得到的解若使原分母为零，即为增根，必须舍去。' },
      { title: '不等式乘负数要变号', html: '<code>−2x &gt; −2</code> 给出 <code>x &lt; 1</code>；绝对值小于取中间、大于取两边。' },
      { title: '增长与折现是互逆动作', html: '终值乘 <code>(1+r)<sup>t</sup></code> 或 <code>e<sup>rt</sup></code>，现值除回去；年金公式由等比求和推出。' }
    ] },

    { t: 'checklist', id: 'ch01', items: [
      '我能不看表写出六条指数法则，并各举一个数字例子',
      '我能把 <code>3<sup>x</sup> = 12</code> 解到 <code>x ≈ 2.2619</code>，并说明为什么两边取 ln',
      '我能用求根公式解 <code>2x<sup>2</sup>−8x+6 = 0</code>，并说出判别式的作用',
      '我能识别并舍去分式方程的增根',
      '我能解 <code>−2x+6 &gt; 4</code> 与 <code>|x−3| ≤ 2</code>，并写出区间',
      '我能算出每年 1000 元、利率 5%、10 年的年金终值与现值',
      '我能区分名义利率、有效年利率与连续复利，并做换算',
      '我能说清 25% 与 20% 为何不对称，并算出 5 年 25% 的 CAGR',
      '我能列出四个代数陷阱，并各写一个反例'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应《Essential Mathematics for Economic Analysis》（第 5 版）的代数预备部分：幂与指数、对数、线性与二次方程、不等式、求和与复利、增长率与百分比；同济《高等数学》第七版上册的预备知识可作计算训练补充。年金与连续复利的数字为本站自设，用于演示公式用法，实际产品以合同条款为准。下一章把这些代数式画成图形，开始建立「函数—曲线—斜率」的直觉。' }
  ]
});
