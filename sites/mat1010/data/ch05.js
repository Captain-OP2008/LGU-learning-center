/* =====================================================================
 * ch05.js · 第 5 章「积分与累积：从边际回到总量」
 * 职责：讲清不定积分与定积分、换元与分部积分，并把积分用于
 *       消费者剩余、现值、广义积分与基尼系数。
 * 依据：Essential Mathematics for Economic Analysis（5th ed）第 11–12 章
 *       的积分及其经济应用。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch05',
  num: '05',
  title: '积分与累积：从边际回到总量',
  en: 'INTEGRALS & ACCUMULATION',
  goals: [
    '说出原函数与不定积分的关系，熟记基本积分表并会用线性性质',
    '用微积分基本定理计算定积分，把面积解释为累积量',
    '掌握换元法与分部积分，能处理复合函数与乘积形式的积分',
    '用定积分计算消费者剩余、生产者剩余与净现值，判断项目是否可行',
    '处理广义积分，并用洛伦兹曲线计算基尼系数'
  ],
  kp: [
    { id: 'ch05-1', title: '原函数与不定积分' },
    { id: 'ch05-2', title: '定积分与微积分基本定理' },
    { id: 'ch05-3', title: '换元法' },
    { id: 'ch05-4', title: '分部积分' },
    { id: 'ch05-5', title: '消费者剩余与生产者剩余' },
    { id: 'ch05-6', title: '现值、永续年金与净现值' },
    { id: 'ch05-7', title: '广义积分' },
    { id: 'ch05-8', title: '洛伦兹曲线与基尼系数' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '积分是「把一点点加回去」', html: '前面几章一直在做一件事：从总量求边际。已知总成本，求边际成本；已知效用，求边际效用。积分做的正好是反方向：<b>已知每一小段贡献多少，把它们加起来得到总量</b>。边际成本曲线下的面积就是总成本，需求曲线下的面积就是消费者愿意支付的总金额，折现因子曲线下的面积就是一串现金流的现值。理解了「面积 = 累积」，积分就不再是反导数技巧。' },

    { t: 'p', lead: true, html: '积分（integral）有两个面貌。作为<b>不定积分</b>，它是求导的逆运算，结果是带常数 C 的函数族；作为<b>定积分</b>，它是一段曲线下的面积，结果是一个数。两者由微积分基本定理连接：先求原函数，再代上下限相减。经济问题几乎都用定积分，因为要的是「总量」这个数。' },

    { t: 'p', html: '为什么经济学家需要积分？因为很多总量只能通过边际量累加得到。厂商知道每多生产一件的成本（边际成本），但想知道生产 100 件的总成本，就要把 100 个边际成本加起来——连续模型里就是积分。消费者愿意为第一件付高价、为第二件付稍低的价格，总愿意支付就是需求曲线下的面积。未来每一年都有一笔收益，总现值就是各年折现值之和的连续版本。' },

    { t: 'h', lvl: 2, text: '一、原函数与不定积分', id: 'ch05-1' },

    { t: 'p', html: '若 <code>F′(x) = f(x)</code>，则称 F 是 f 的一个<b>原函数（antiderivative）</b>，并记 <code>∫f(x)dx = F(x) + C</code>，C 是任意常数。因为常数的导数为零，原函数不唯一，相差一个常数。这个 C 在经济上对应「固定成本」——它不影响边际，但影响总量水平。' },

    { t: 'p', html: '基本积分表由求导公式倒推：<code>∫x<sup>n</sup>dx = x<sup>n+1</sup>/(n+1) + C</code>（n≠−1）；<code>∫(1/x)dx = ln|x| + C</code>；<code>∫e<sup>x</sup>dx = e<sup>x</sup> + C</code>；<code>∫a<sup>x</sup>dx = a<sup>x</sup>/ln a + C</code>；<code>∫k dx = kx + C</code>。线性性质：<code>∫(af + bg)dx = a∫f dx + b∫g dx</code>。' },

    { t: 'p', html: '例：<code>∫(2x + 1)dx = x<sup>2</sup> + x + C</code>。验证：对 <code>x<sup>2</sup>+x+C</code> 求导得 <code>2x+1</code> ✓。<b>验算永远是积分题最便宜的检查手段</b>：把你得到的原函数求导，看是否回到被积函数。积分比求导容易出错，因为方向多、技巧多，验算能拦住大部分错误。' },

    { t: 'table', head: ['被积函数', '原函数', '备注'], rows: [
      ['<code>x<sup>n</sup></code>', '<code>x<sup>n+1</sup>/(n+1) + C</code>', '<code>n ≠ −1</code>'],
      ['<code>1/x</code>', '<code>ln|x| + C</code>', '注意绝对值'],
      ['<code>e<sup>x</sup></code>', '<code>e<sup>x</sup> + C</code>', '导数等于自身'],
      ['<code>e<sup>kx</sup></code>', '<code>e<sup>kx</sup>/k + C</code>', '<code>k ≠ 0</code>'],
      ['<code>a<sup>x</sup></code>', '<code>a<sup>x</sup>/ln a + C</code>', '<code>a &gt; 0, a ≠ 1</code>'],
      ['<code>k</code>（常数）', '<code>kx + C</code>', '固定成本']
    ], caption: '六条基本积分，配合线性性质与换元、分部，覆盖本课全部题目' },

    { t: 'p', html: '经济上最直接的应用是「由边际成本求总成本」。设 <code>MC(Q) = 5 + 0.2Q</code>，则 <code>C(Q) = ∫MC dQ = 5Q + 0.1Q<sup>2</sup> + C</code>。若已知固定成本 <code>C(0) = 200</code>，代入得 <code>C = 200</code>，所以 <code>C(Q) = 200 + 5Q + 0.1Q<sup>2</sup></code>。这个式子正是前几章反复用的成本函数——现在你知道它是怎么来的了。' },

    { t: 'quiz', qid: 'ch05-q1' },

    { t: 'h', lvl: 2, text: '二、定积分与微积分基本定理', id: 'ch05-2' },

    { t: 'p', html: '定积分 <code>∫<sub>a</sub><sup>b</sup>f(x)dx</code> 表示曲线 <code>y=f(x)</code> 与横轴之间、从 a 到 b 的有向面积：在横轴上方为正，下方为负。它由「分割—求和—取极限」定义，但计算时不需要回到定义，用<b>微积分基本定理（fundamental theorem of calculus）</b>：若 F 是 f 的原函数，则 <code>∫<sub>a</sub><sup>b</sup>f(x)dx = F(b) − F(a)</code>。' },

    { t: 'p', html: '例：<code>∫<sub>0</sub><sup>3</sup>(2x+1)dx</code>。原函数 <code>x<sup>2</sup>+x</code>，代入上限 3 得 <code>9+3 = 12</code>，代入下限 0 得 0，所以积分值为 12。几何上这是梯形面积：底 3、两高 1 与 7，面积 <code>(1+7)×3/2 = 12</code> ✓。两种算法互相验证，考试里可以用来检查。' },

    { t: 'p', html: '定积分的性质：<code>∫<sub>a</sub><sup>b</sup> = −∫<sub>b</sub><sup>a</sup></code>（交换上下限变号）；<code>∫<sub>a</sub><sup>a</sup> = 0</code>；<code>∫<sub>a</sub><sup>b</sup> = ∫<sub>a</sub><sup>c</sup> + ∫<sub>c</sub><sup>b</sup></code>（区间可加）；常数可以提到积分号外。这些性质在分段函数与「求总面积」的题里经常用到。' },

    { t: 'p', html: '「面积 = 累积」的经济含义要具体化。若 <code>MC(Q)</code> 是边际成本，则 <code>∫<sub>0</sub><sup>Q*</sup>MC(Q)dQ</code> 是从 0 生产到 Q* 的<b>可变成本</b>（不含固定成本）。若 <code>MR(Q)</code> 是边际收益，则积分给出总收入。若 <code>f(t)</code> 是每单位时间的流入量，则积分给出总流入量。看到「总」「累积」「一共」这些词，就该想到积分。' },

    { t: 'p', html: '一个容易混的点：定积分算的是「净面积」，如果曲线穿过横轴，横轴下方的部分会抵消上方。若题目问「总面积」，要先把零点找出来分段取绝对值。经济上，利润曲线在盈亏平衡点两侧一正一负，累计利润是净面积，而「总盈利额」则要把亏损段单独处理。' },

    { t: 'h', lvl: 2, text: '三、换元法', id: 'ch05-3' },

    { t: 'p', html: '换元法（substitution）对应求导的链式法则。若被积函数里有「内层函数的导数」作为因子，就令 <code>u = g(x)</code>，则 <code>du = g′(x)dx</code>，积分化为 <code>∫f(u)du</code>。口诀：<b>看到复合结构，先找内层，再看外面有没有它的导数</b>。' },

    { t: 'p', html: '例：<code>∫2x(x<sup>2</sup>+1)<sup>3</sup>dx</code>。令 <code>u = x<sup>2</sup>+1</code>，则 <code>du = 2x dx</code>，正好是外面的因子。于是积分变为 <code>∫u<sup>3</sup>du = u<sup>4</sup>/4 + C</code>，代回得 <code>(x<sup>2</sup>+1)<sup>4</sup>/4 + C</code>。验算：求导得 <code>(x<sup>2</sup>+1)<sup>3</sup>·2x</code> ✓。' },

    { t: 'p', html: '例：<code>∫<sub>0</sub><sup>1</sup>xe<sup>x<sup>2</sup></sup>dx</code>。令 <code>u = x<sup>2</sup></code>，<code>du = 2x dx</code>，所以 <code>x dx = du/2</code>。换限：x=0 时 u=0，x=1 时 u=1。积分变为 <code>(1/2)∫<sub>0</sub><sup>1</sup>e<sup>u</sup>du = (1/2)(e−1) ≈ 0.8591</code>。定积分换元时<b>一定要换上下限</b>，否则代回 x 再算会多一步且容易错。' },

    { t: 'p', html: '换元的常见变形：<code>∫f(ax+b)dx</code> 令 <code>u = ax+b</code>，结果多一个 <code>1/a</code>；<code>∫(ln x)/x dx</code> 令 <code>u = ln x</code>，<code>du = dx/x</code>；<code>∫e<sup>ax</sup>dx = e<sup>ax</sup>/a + C</code> 本质也是换元。练熟这几种，绝大多数经济模型里的积分都能处理。' },

    { t: 'p', html: '如果「外面的导数」差一个常数因子怎么办？提出来即可。例如 <code>∫x(x<sup>2</sup>+1)<sup>3</sup>dx</code>，令 u 后 <code>du = 2x dx</code>，而外面只有 <code>x dx = du/2</code>，所以结果是 <code>(1/2)·u<sup>4</sup>/4 = (x<sup>2</sup>+1)<sup>4</sup>/8 + C</code>。常数因子可以随意调整，变量因子不行——这是判断「能不能用换元」的关键。' },

    { t: 'h', lvl: 2, text: '四、分部积分', id: 'ch05-4' },

    { t: 'p', html: '分部积分（integration by parts）对应乘积法则：<code>∫u dv = uv − ∫v du</code>。它把「两个函数相乘」的积分转化为另一个可能更简单的积分。选择 u 的原则是「求导后变简单」，选择 dv 的原则是「容易积分」。常用口诀「反对幂指三」，按此顺序优先选 u。' },

    { t: 'p', html: '例：<code>∫xe<sup>x</sup>dx</code>。令 <code>u = x</code>、<code>dv = e<sup>x</sup>dx</code>，则 <code>du = dx</code>、<code>v = e<sup>x</sup></code>。代入公式得 <code>xe<sup>x</sup> − ∫e<sup>x</sup>dx = xe<sup>x</sup> − e<sup>x</sup> + C = e<sup>x</sup>(x−1) + C</code>。验算：求导得 <code>e<sup>x</sup>(x−1) + e<sup>x</sup> = xe<sup>x</sup></code> ✓。' },

    { t: 'p', html: '算定积分：<code>∫<sub>0</sub><sup>1</sup>xe<sup>x</sup>dx = [e<sup>x</sup>(x−1)]<sub>0</sub><sup>1</sup> = e<sup>1</sup>(0) − e<sup>0</sup>(−1) = 1</code>。这个结果在经济学里可以解释为「单位时间内线性增长的收益流」的累积值，虽然简单，但展示了分部积分的完整流程。' },

    { t: 'p', html: '另一个常见类型是 <code>∫x ln x dx</code>。令 <code>u = ln x</code>、<code>dv = x dx</code>，则 <code>du = dx/x</code>、<code>v = x<sup>2</sup>/2</code>，得 <code>(x<sup>2</sup>/2)ln x − ∫(x/2)dx = (x<sup>2</sup>/2)ln x − x<sup>2</sup>/4 + C</code>。这类积分在算「对数效用下的总效用」时会出现。' },

    { t: 'p', html: '分部积分可能需要用两次，甚至回到原积分形成方程。例如 <code>∫e<sup>x</sup>sin x dx</code> 用两次后会得到 <code>−e<sup>x</sup>cos x + e<sup>x</sup>sin x − ∫e<sup>x</sup>sin x dx</code>，移项解出原积分。经济题里很少遇到这种，但考试的选择题可能考「用几次分部」的判断。' },

    { t: 'quiz', qid: 'ch05-q2' },

    { t: 'h', lvl: 2, text: '五、消费者剩余与生产者剩余', id: 'ch05-5' },

    { t: 'p', html: '消费者剩余（consumer surplus，CS）是「消费者愿意支付的总金额」减去「实际支付的总金额」。在反需求函数 <code>P = P(Q)</code> 下，愿意支付的总金额是需求曲线下从 0 到 Q* 的面积 <code>∫<sub>0</sub><sup>Q*</sup>P(Q)dQ</code>，实际支付是 <code>P*·Q*</code>，所以 <code>CS = ∫<sub>0</sub><sup>Q*</sup>P(Q)dQ − P*Q*</code>。' },

    { t: 'p', html: '例：需求 <code>P = 8 − 2Q</code>，市场价格 2。先求均衡数量：<code>8 − 2Q = 2</code>，<code>Q* = 3</code>。愿意支付总额 <code>∫<sub>0</sub><sup>3</sup>(8−2Q)dQ = [8Q − Q<sup>2</sup>]<sub>0</sub><sup>3</sup> = 24 − 9 = 15</code>；实际支付 <code>2×3 = 6</code>；所以 <code>CS = 9</code>。等价算法：<code>∫<sub>0</sub><sup>3</sup>[(8−2Q) − 2]dQ = ∫<sub>0</sub><sup>3</sup>(6−2Q)dQ = 18 − 9 = 9</code>，几何上是需求曲线与价格线之间的三角形。' },

    { t: 'p', html: '生产者剩余（producer surplus，PS）对称：是「实际收到的钱」减去「愿意接受的最低金额」，即价格线与供给曲线之间的面积。若供给 <code>P = 2 + 3Q</code>、价格 8，则 <code>Q* = 2</code>，<code>PS = 8×2 − ∫<sub>0</sub><sup>2</sup>(2+3Q)dQ = 16 − [2Q + 1.5Q<sup>2</sup>]<sub>0</sub><sup>2</sup> = 16 − (4+6) = 6</code>。总剩余 <code>CS + PS</code> 衡量市场交易带来的净福利。' },

    { t: 'table', head: ['概念', '公式', '几何'], rows: [
      ['消费者剩余 CS', '<code>∫<sub>0</sub><sup>Q*</sup>P<sub>d</sub>(Q)dQ − P*Q*</code>', '需求曲线与价格线之间的面积'],
      ['生产者剩余 PS', '<code>P*Q* − ∫<sub>0</sub><sup>Q*</sup>P<sub>s</sub>(Q)dQ</code>', '价格线与供给曲线之间的面积'],
      ['总剩余', '<code>CS + PS</code>', '两条曲线之间、到均衡点为止的面积'],
      ['无谓损失', '总剩余的减少量', '产量低于均衡时损失的那块三角形']
    ], caption: '四个量都是面积；算 CS/PS 时先求均衡点，再定积分上下限' },

    { t: 'p', html: '价格上升对 CS 的影响可以分解成两部分：原有消费者多付的钱（矩形），以及部分消费者退出的损失（三角形）。这个分解在税收与垄断的福利分析里反复出现。积分让「面积」变成可计算的数，而不是只能画图示意。' },

    { t: 'h', lvl: 2, text: '六、现值、永续年金与净现值', id: 'ch05-6' },

    { t: 'p', html: '第 1 章讲过离散折现 <code>F/(1+r)<sup>t</sup></code>。当现金流连续发生（比如每天都有收入），要用连续折现：t 时刻的现金流率 <code>R(t)</code> 的现值为 <code>R(t)e<sup>−rt</sup></code>，一段时间内的总现值是 <code>PV = ∫<sub>0</sub><sup>T</sup>R(t)e<sup>−rt</sup>dt</code>。这是本章最重要的经济应用。' },

    { t: 'p', html: '例：连续 10 年、每年 1000 元、连续复利 5%。<code>PV = ∫<sub>0</sub><sup>10</sup>1000e<sup>−0.05t</sup>dt = 1000[−e<sup>−0.05t</sup>/0.05]<sub>0</sub><sup>10</sup> = 20000(1 − e<sup>−0.5</sup>)</code>。<code>e<sup>−0.5</sup> ≈ 0.606531</code>，所以 <code>PV ≈ 20000×0.393469 ≈ 7869</code> 元。若这笔现金流永久持续，<code>T→∞</code>，<code>e<sup>−0.05T</sup>→0</code>，<code>PV = 20000</code> 元。' },

    { t: 'p', html: '永续年金（perpetuity）公式 <code>PV = R/r</code> 很好记：每年 1000 元、利率 5%，值 20000 元，相当于「按 5% 的利率，20000 元本金每年正好生出 1000 元利息」。这个「本金 × 利率 = 年收益」的直觉，比背公式更有用。' },

    { t: 'p', html: '净现值（net present value，NPV）= 现值 − 初始投资。若上例需要期初投入 7000 元，则 <code>NPV ≈ 7869 − 7000 = 869 &gt; 0</code>，项目可行；若投入 8000 元，<code>NPV ≈ −131 &lt; 0</code>，应拒绝。NPV 法则是最基本的投资决策准则：<b>NPV 为正就做，为负就不做</b>；多个项目互斥时选 NPV 最大的。' },

    { t: 'table', head: ['现金流形态', '现值公式', '数值例子（r=5%）'], rows: [
      ['单笔未来款 F', '<code>Fe<sup>−rT</sup></code>', '10 年后的 1000 元 ≈ 606.5 元'],
      ['连续流 R，期限 T', '<code>(R/r)(1−e<sup>−rT</sup>)</code>', '1000 元/年、10 年 ≈ 7869 元'],
      ['永续流 R', '<code>R/r</code>', '1000 元/年 ≈ 20000 元'],
      ['增长型永续流（增长率 g）', '<code>R/(r−g)</code>（<code>r&gt;g</code>）', '1000 元/年、g=2% ≈ 33333 元']
    ], caption: '四个公式覆盖绝大多数投资题；连续情形用 e，离散情形用 (1+r)<sup>t</sup>' },

    { t: 'p', html: '一个常见误区是把「10 年共 10000 元」直接当成现值。实际上 7869 元与 10000 元的差额 2131 元就是时间价值：未来的钱要打折。折现率越高、期限越长，折扣越大。这也是为什么高利率环境下长期项目更难通过 NPV 检验。' },

    { t: 'quiz', qid: 'ch05-q3' },

    { t: 'h', lvl: 2, text: '七、广义积分', id: 'ch05-7' },

    { t: 'p', html: '广义积分（improper integral）有两种：积分区间无限（如 <code>∫<sub>1</sub><sup>∞</sup></code>），或被积函数在区间内某点趋于无穷（如 <code>∫<sub>0</sub><sup>1</sup>1/√x dx</code>）。处理方法是取极限：<code>∫<sub>a</sub><sup>∞</sup>f = lim<sub>b→∞</sub>∫<sub>a</sub><sup>b</sup>f</code>。若极限存在且有限，称积分收敛；否则发散。' },

    { t: 'p', html: '例：<code>∫<sub>1</sub><sup>∞</sup>x<sup>−2</sup>dx = lim<sub>b→∞</sub>[−1/x]<sub>1</sub><sup>b</sup> = lim<sub>b→∞</sub>(−1/b + 1) = 1</code>。虽然区域无限长，面积却是有限的 1。这个结论在概率论（帕累托分布）与永续年金里都会出现。' },

    { t: 'p', html: '例：<code>∫<sub>1</sub><sup>∞</sup>x<sup>−1</sup>dx = lim<sub>b→∞</sub>[ln x]<sub>1</sub><sup>b</sup> = ∞</code>，发散。对比可见：<code>1/x<sup>2</sup></code> 收敛而 <code>1/x</code> 发散，分界在指数是否为 1。一般规律：<code>∫<sub>1</sub><sup>∞</sup>x<sup>−p</sup>dx</code> 当 <code>p &gt; 1</code> 时收敛，<code>p ≤ 1</code> 时发散。' },

    { t: 'p', html: '为什么经济学关心收敛？永续年金的现值就是一个广义积分：<code>∫<sub>0</sub><sup>∞</sup>Re<sup>−rt</sup>dt = R/r</code>，只有当折现因子足够强（<code>r &gt; 0</code>）时才收敛。如果增长率超过折现率（<code>g ≥ r</code>），增长型永续流的现值发散——这提示「永远比利率增长更快的现金流」没有有限价值，现实中不可能持续。' },

    { t: 'h', lvl: 2, text: '八、洛伦兹曲线与基尼系数', id: 'ch05-8' },

    { t: 'p', html: '洛伦兹曲线（Lorenz curve）描述收入分配：横轴是人口累计比例 x（从最穷到最富），纵轴是收入累计比例 <code>L(x)</code>。完全平均时 <code>L(x) = x</code>（45 度线）；完全不平均时曲线贴着横轴到 x=1 才跳到 1。实际曲线介于两者之间，且总是凸的（<code>L″ &gt; 0</code>）。' },

    { t: 'p', html: '基尼系数（Gini coefficient）定义为「45 度线与洛伦兹曲线之间的面积」除以「45 度线下的总面积」。45 度线下面积是 <code>1/2</code>，所以 <code>G = 2∫<sub>0</sub><sup>1</sup>(x − L(x))dx = 1 − 2∫<sub>0</sub><sup>1</sup>L(x)dx</code>。G=0 表示完全平均，G=1 表示完全不平均，实际国家多在 0.25–0.55 之间。' },

    { t: 'p', html: '例：<code>L(x) = x<sup>2</sup></code>（收入随人口比例加速集中）。<code>∫<sub>0</sub><sup>1</sup>x<sup>2</sup>dx = 1/3</code>，所以 <code>G = 1 − 2/3 = 1/3 ≈ 0.333</code>。这个数可以直接和各国的基尼系数比较，判断该分配的集中程度。若 <code>L(x) = x<sup>3</sup></code>，则 <code>G = 1 − 2/4 = 0.5</code>，更不平均。' },

    { t: 'p', html: '注意洛伦兹曲线必须满足 <code>L(0)=0</code>、<code>L(1)=1</code>、单调递增且凸。如果题目给的函数不满足这些，不能直接当洛伦兹曲线用。基尼系数对中间收入变化敏感，对两端变化相对不敏感，这是它的一个已知局限；实际分析中还会配合收入份额、贫困率等指标。' },

    { t: 'compare', left: { title: '离散数据', html: '给定 5 组收入份额，用梯形法近似面积：把每段近似成梯形，累加后算 G。数据越细，近似越准。' }, right: { title: '连续函数', html: '给定 <code>L(x)</code> 的解析式，直接积分 <code>1−2∫L</code>。本章例题用 <code>x<sup>2</sup></code>，结果为 1/3。' } },

    { t: 'callout', kind: 'exam', title: '积分题的检查清单', html: '① 原函数求对了吗（求导验算）？② 定积分换元时换了上下限吗？③ 面积题先找交点定上下限了吗？④ 广义积分写了极限吗？⑤ 结果为正吗（面积、剩余、现值都不该为负）？五问过一遍，比重新算一遍快。' },

    { t: 'terms', items: [
      { en: 'antiderivative', zh: '原函数', html: '导数等于被积函数的函数，相差一个常数。' },
      { en: 'indefinite integral', zh: '不定积分', html: '<code>∫f dx = F + C</code>，结果是函数族。' },
      { en: 'definite integral', zh: '定积分', html: '曲线下的有向面积，用 <code>F(b)−F(a)</code> 计算。' },
      { en: 'substitution', zh: '换元法', html: '令 <code>u=g(x)</code> 化简复合积分，定积分要同时换限。' },
      { en: 'integration by parts', zh: '分部积分', html: '<code>∫u dv = uv − ∫v du</code>，处理乘积形式。' },
      { en: 'consumer surplus', zh: '消费者剩余', html: '愿付总额减去实付金额，需求曲线与价格线之间的面积。' },
      { en: 'present value', zh: '现值', html: '未来现金流的折现总和，连续情形为 <code>∫Re<sup>−rt</sup>dt</code>。' },
      { en: 'Gini coefficient', zh: '基尼系数', html: '<code>1−2∫L(x)dx</code>，0 为完全平均，1 为完全不平均。' }
    ] },

    { t: 'keypoint', items: [
      { title: '积分是求导的逆运算', html: '<code>∫f dx = F+C</code> 当且仅当 <code>F′ = f</code>；算完求导验算。' },
      { title: '定积分用基本定理算', html: '<code>∫<sub>a</sub><sup>b</sup>f = F(b)−F(a)</code>；交换上下限变号。' },
      { title: '换元要换限', html: '定积分换元后上下限必须同步换成 u 的值，否则结果错。' },
      { title: '面积就是经济总量', html: 'MC 下面积 = 可变成本；需求曲线下面积 = 愿付总额；CS/PS 都是面积。' },
      { title: '现值是折现因子的积分', html: '<code>PV = ∫Re<sup>−rt</sup>dt</code>；永续流为 <code>R/r</code>，NPV 为正则项目可行。' },
      { title: '基尼系数由面积比定义', html: '<code>G = 1−2∫<sub>0</sub><sup>1</sup>L(x)dx</code>；<code>L=x<sup>2</sup></code> 时 G=1/3。' }
    ] },

    { t: 'checklist', id: 'ch05', items: [
      '我能写出六条基本积分公式，并用求导验算其中三条',
      '我能由 <code>MC = 5+0.2Q</code> 与固定成本 200 还原出总成本函数',
      '我能用基本定理算出 <code>∫<sub>0</sub><sup>3</sup>(2x+1)dx = 12</code>，并用梯形面积验证',
      '我能用换元法算出 <code>∫2x(x<sup>2</sup>+1)<sup>3</sup>dx</code> 与 <code>∫<sub>0</sub><sup>1</sup>xe<sup>x<sup>2</sup></sup>dx</code>',
      '我能用分部积分算出 <code>∫xe<sup>x</sup>dx</code> 与 <code>∫<sub>0</sub><sup>1</sup>xe<sup>x</sup>dx</code>',
      '我能算出 <code>P = 8−2Q</code>、价格 2 时的消费者剩余为 9',
      '我能算出连续 10 年、每年 1000 元、利率 5% 的现值约 7869 元',
      '我能判断 <code>∫<sub>1</sub><sup>∞</sup>x<sup>−2</sup>dx</code> 收敛而 <code>x<sup>−1</sup></code> 发散',
      '我能由 <code>L(x)=x<sup>2</sup></code> 算出基尼系数 1/3，并解释其含义'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应《Essential Mathematics for Economic Analysis》（第 5 版）的积分章节：不定积分、定积分与基本定理、换元与分部积分、广义积分，以及消费者剩余、现值与基尼系数等经济应用；同济《高等数学》第七版上册的定积分及其应用可作计算补充。所有数值例子由本站设定的需求、成本与现金流参数算出，可在 ch06、ch07 中继续使用。下一章把变量从一个扩展到两个，进入偏导数与多元分析。' }
  ]
});
