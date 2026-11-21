/* =====================================================================
 * ch05.js · 第 5 章「对偶：从另一个角度看同一个问题」
 * 职责：构造拉格朗日函数与对偶函数，讲清弱/强对偶、Slater 条件、KKT、
 *       影子价格与灵敏度，并给出用对偶解题的完整流程与数值例子。
 * 依据：MAT3007 教材第 5 章（拉格朗日对偶、KKT、灵敏度分析）。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch05',
  num: '05',
  title: '对偶：从另一个角度看同一个问题',
  en: 'LAGRANGIAN DUALITY',
  goals: [
    '写出拉格朗日函数与对偶函数，并说明对偶函数为什么恒为凹',
    '证明弱对偶不等式 <code>d* ≤ p*</code>，并说出强对偶成立需要什么条件',
    '用 Slater 条件判断一个凸问题是否强对偶，并说明 LP 为什么总成立',
    '写出 KKT 四个条件，用互补松弛解释「约束起作用」的含义',
    '用影子价格解释最优值对右端项的敏感度，并手算一个 LP 的对偶解'
  ],
  kp: [
    { id: 'ch05-1', title: '拉格朗日函数' },
    { id: 'ch05-2', title: '对偶函数与下界' },
    { id: 'ch05-3', title: '弱对偶与强对偶' },
    { id: 'ch05-4', title: 'Slater 条件' },
    { id: 'ch05-5', title: 'KKT 条件' },
    { id: 'ch05-6', title: '影子价格与灵敏度' },
    { id: 'ch05-7', title: '对偶的几何解释' },
    { id: 'ch05-8', title: '用对偶解题' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么要绕到「另一个问题」', html: '同一个凸问题可以从两个方向看：原问题在可行域里找最低点，对偶问题在乘子空间里找最高的下界。两个方向在最优点相遇，间隙为零。这不是数学游戏——对偶函数往往有闭式、乘子有明确的经济含义（影子价格）、对偶问题常常比原问题维度更低或结构更好（可以分解）。第 6、7 章的算法几乎全部建立在对偶之上：内点法解的是 KKT 系统，ADMM 交替更新原变量与对偶变量，灵敏度分析直接读乘子。' },

    { t: 'p', lead: true, html: '考虑标准形问题 <code>min f<sub>0</sub>(x)</code>，<code>s.t. f<sub>i</sub>(x) ≤ 0</code>（<code>i = 1…m</code>），<code>h<sub>i</sub>(x) = 0</code>（<code>i = 1…p</code>）。它的<b>拉格朗日函数</b>（Lagrangian）是 <code>L(x, λ, ν) = f<sub>0</sub>(x) + Σ λ<sub>i</sub>f<sub>i</sub>(x) + Σ ν<sub>i</sub>h<sub>i</sub>(x)</code>，其中 <code>λ ≥ 0</code> 是不等式约束的乘子，<code>ν</code> 是等式约束的乘子。把约束「搬进目标」，是这一章所有推导的起点。' },

    { t: 'h', lvl: 2, text: '一、拉格朗日函数', id: 'ch05-1' },

    { t: 'p', html: '为什么这样搬？关键在于符号。<b>对可行点 <code>x</code></b>（所有 <code>f<sub>i</sub>(x) ≤ 0</code>、<code>h<sub>i</sub>(x) = 0</code>），由于 <code>λ<sub>i</sub> ≥ 0</code>，有 <code>λ<sub>i</sub>f<sub>i</sub>(x) ≤ 0</code>，等式项为 0，所以 <code>L(x, λ, ν) ≤ f<sub>0</sub>(x)</code>。也就是说，<b>对任何 <code>λ ≥ 0</code> 与任何可行点，拉格朗日函数都是目标值的一个下界</b>。<code>λ</code> 越能把约束「惩罚」得狠，这个下界越松；我们要找的，是最紧的那个下界。' },

    { t: 'p', html: '对不可行点，<code>λ<sub>i</sub>f<sub>i</sub>(x)</code> 可能是正的，此时 <code>L</code> 可能大于 <code>f<sub>0</sub>(x)</code>——这没关系，因为我们只关心可行点上的下界性质。若某个 <code>f<sub>i</sub>(x) &gt; 0</code>，加大 <code>λ<sub>i</sub></code> 会让 <code>L</code> 变大，相当于「惩罚违反约束的点」。这正是把约束写进目标的直观机制。' },

    { t: 'p', html: '举个具体例子。问题 <code>min x<sup>2</sup></code>、<code>s.t. x ≥ 1</code>，写成标准形是 <code>min x<sup>2</sup></code>、<code>1 − x ≤ 0</code>。拉格朗日函数 <code>L(x, λ) = x<sup>2</sup> + λ(1 − x)</code>，<code>λ ≥ 0</code>。在 <code>x = 1</code> 处，<code>L(1, λ) = 1</code> 对任意 <code>λ</code>；在 <code>x = 2</code> 处，<code>L(2, λ) = 4 − λ</code>，只要 <code>λ ≥ 0</code> 就 ≤ 4，确实是下界（虽然不够紧）。在 <code>x = 0.5</code> 处（不可行），<code>L(0.5, λ) = 0.25 + 0.5λ</code>，<code>λ</code> 一大就超过 <code>f<sub>0</sub></code>——不可行点不受下界保护，符合预期。' },

    { t: 'p', html: '乘子的符号约定必须记牢：<b>不等式约束 <code>f<sub>i</sub> ≤ 0</code> 的乘子 <code>λ<sub>i</sub> ≥ 0</code>，等式约束的乘子 <code>ν<sub>i</sub></code> 符号自由</b>。很多推导错误都源于把 <code>λ</code> 当成可正可负。原因很简单：若 <code>λ<sub>i</sub> &lt; 0</code>，则 <code>λ<sub>i</sub>f<sub>i</sub></code> 在可行点上为正，<code>L</code> 就不再是下界，整个对偶框架会崩塌。' },

    { t: 'callout', kind: 'tip', title: '写拉格朗日函数的三步', html: '① 把所有约束改写成「左边 ≤ 0」或「左边 = 0」；② 每个不等式配一个 <code>λ<sub>i</sub> ≥ 0</code>，每个等式配一个自由的 <code>ν<sub>i</sub></code>；③ 把 <code>λ<sub>i</sub>·(约束左边)</code> 与 <code>ν<sub>i</sub>·(约束左边)</code> 加到目标上。检查：代一个可行点进去，结果必须 ≤ 原目标值。' },

    { t: 'h', lvl: 2, text: '二、对偶函数与下界', id: 'ch05-2' },

    { t: 'p', html: '固定乘子，对 <code>x</code> 取下确界，得到<b>对偶函数</b>（dual function）<code>g(λ, ν) = inf<sub>x</sub> L(x, λ, ν)</code>。下确界是对整个定义域取的，可能取到 <code>−∞</code>（当 <code>L</code> 在某个方向上无下界时）。由上一节的下界性质，立刻得到：<b>对任意 <code>λ ≥ 0</code>，<code>g(λ, ν) ≤ p*</code></b>，其中 <code>p*</code> 是原问题最优值。这就是对偶函数作为「下界生成器」的全部价值。' },

    { t: 'p', html: '对偶函数有一个非常重要的结构性质：<b>它恒为凹函数</b>。因为对每个固定的 <code>x</code>，<code>L(x, λ, ν)</code> 是 <code>(λ, ν)</code> 的仿射函数；而对偶函数是一族仿射函数的逐点下确界，下确界保持凹性（与第 3 章「上确界保持凸性」对称）。注意这个结论<b>不要求原问题凸</b>：即使 <code>f<sub>0</sub></code>、<code>f<sub>i</sub></code> 都是非凸的，<code>g</code> 仍然凹。' },

    { t: 'p', html: '手算一个对偶函数。<b>LP</b>：<code>min c<sup>T</sup>x</code>、<code>s.t. Ax = b</code>、<code>x ≥ 0</code>。拉格朗日函数 <code>L = c<sup>T</sup>x + ν<sup>T</sup>(b − Ax) = (c − A<sup>T</sup>ν)<sup>T</sup>x + b<sup>T</sup>ν</code>。对 <code>x ≥ 0</code> 取下确界：若 <code>c − A<sup>T</sup>ν ≥ 0</code>（分量非负），则下确界在 <code>x = 0</code> 取到，值为 <code>b<sup>T</sup>ν</code>；否则某个系数为负，<code>x</code> 沿该方向跑到无穷，下确界是 <code>−∞</code>。于是 <code>g(ν) = b<sup>T</sup>ν</code> 当 <code>A<sup>T</sup>ν ≤ c</code>，否则 <code>−∞</code>。' },

    { t: 'p', html: '把这个 <code>g</code> 代进对偶问题 <code>max g(ν)</code>，就得到 <b>LP 的对偶问题</b>：<code>max b<sup>T</sup>ν</code>、<code>s.t. A<sup>T</sup>ν ≤ c</code>。原问题是最小化、约束是等式与非负，对偶是最大化、约束是不等式——两边的结构完全对称。这个推导只用了「下确界」一个操作，没有用到任何 LP 的特殊性质，所以它对一般凸问题同样适用。' },

    { t: 'p', html: '再看一个二次的例子。问题 <code>min ½x<sup>T</sup>Qx</code>、<code>s.t. Ax ≤ b</code>（<code>Q ≻ 0</code>）。<code>L = ½x<sup>T</sup>Qx + λ<sup>T</sup>(Ax − b)</code>。对 <code>x</code> 求导令零：<code>Qx + A<sup>T</sup>λ = 0</code>，得 <code>x = −Q<sup>−1</sup>A<sup>T</sup>λ</code>。代回得 <code>g(λ) = −½λ<sup>T</sup>AQ<sup>−1</sup>A<sup>T</sup>λ − b<sup>T</sup>λ</code>，这是一个凹二次函数。对偶问题就是 <code>max g(λ)</code>、<code>λ ≥ 0</code>——一个「盒子约束 + 凹二次」的简单问题，变量个数等于约束个数，常常比原问题小得多。' },

    { t: 'quiz', qid: 'ch05-q1' },

    { t: 'h', lvl: 2, text: '三、弱对偶与强对偶', id: 'ch05-3' },

    { t: 'p', html: '<b>弱对偶</b>（weak duality）：设 <code>d*</code> 是对偶问题的最优值，<code>p*</code> 是原问题最优值，则恒有 <code>d* ≤ p*</code>。证明只需一行：对任意可行 <code>x</code> 与任意 <code>λ ≥ 0</code>，<code>g(λ, ν) ≤ L(x, λ, ν) ≤ f<sub>0</sub>(x)</code>；对 <code>x</code> 取下确界得 <code>g ≤ p*</code>，再对 <code>λ</code> 取上确界得 <code>d* ≤ p*</code>。<b>这个不等式对任何问题都成立，无论凸不凸。</b>' },

    { t: 'p', html: '差值 <code>p* − d*</code> 叫<b>对偶间隙</b>（duality gap）。间隙为零时称<b>强对偶</b>（strong duality）成立。凸问题在满足一定条件时强对偶成立；非凸问题通常有正间隙，但也有例外（某些非凸问题的间隙恰好为零，例如某些整数规划的特殊结构）。间隙的大小可以用来判断「对偶解离最优有多远」。' },

    { t: 'p', html: '强对偶为什么重要？因为它给了两个等价的视角。<b>原问题给上界</b>（任何可行解的目标值都不小于 <code>p*</code>），<b>对偶问题给下界</b>（任何乘子给出的 <code>g</code> 都不大于 <code>p*</code>）。当两者相等时，你既可以用原问题求解，也可以用对偶问题求解，还可以用「原问题的可行解 + 对偶问题的可行解」夹逼出最优值。很多算法就是这样设计的：交替更新原变量与对偶变量，直到间隙小于阈值。' },

    { t: 'table', caption: '弱对偶与强对偶的对照', head: ['性质', '弱对偶', '强对偶'], rows: [
      ['不等式', '<code>d* ≤ p*</code>', '<code>d* = p*</code>'],
      ['成立条件', '对任何问题恒成立', '凸问题 + 约束规范（如 Slater）'],
      ['是否要求凸', '不要求', '通常要求'],
      ['用途', '给下界、判断最优性、剪枝', '等价求解、灵敏度、KKT 充分性'],
      ['间隙', '可能为正', '为零']
    ] },

    { t: 'p', html: '一个数值例子：<code>min x<sup>2</sup></code>、<code>s.t. x ≥ 1</code>。原问题最优值 <code>p* = 1</code>（<code>x = 1</code>）。对偶函数 <code>g(λ) = inf<sub>x</sub>(x<sup>2</sup> + λ(1−x))</code>：对 <code>x</code> 求导得 <code>2x − λ = 0</code>，<code>x = λ/2</code>，代回得 <code>g(λ) = λ − λ<sup>2</sup>/4</code>。对 <code>λ ≥ 0</code> 最大化：顶点在 <code>λ = 2</code>，<code>g(2) = 2 − 1 = 1</code>。所以 <code>d* = 1 = p*</code>，强对偶成立，最优乘子 <code>λ* = 2</code>。这个 <code>λ*</code> 的含义是：约束右端从 1 增加到 <code>1+ε</code>，最优值大约增加 <code>2ε</code>。' },

    { t: 'p', html: '再看一个强对偶<b>失效</b>的情形，理解条件的重要性：<code>min x</code>、<code>s.t. x<sup>2</sup> ≤ 0</code>。可行域只有 <code>x = 0</code>，<code>p* = 0</code>。<code>L = x + λx<sup>2</sup></code>，<code>g(λ) = inf<sub>x</sub>(λx<sup>2</sup> + x)</code>。当 <code>λ &gt; 0</code> 时最小值为 <code>−1/(4λ)</code>；当 <code>λ = 0</code> 时 <code>g = −∞</code>。对偶问题 <code>max −1/(4λ)</code> 的上确界是 0（取不到）。这里 <code>d* = 0 = p*</code>，强对偶在数值上成立，但对偶最优解不存在——<b>强对偶的「成立」与「可达」是两件事</b>，考试里要分清。' },

    { t: 'h', lvl: 2, text: '四、Slater 条件', id: 'ch05-4' },

    { t: 'p', html: '强对偶不会无条件成立。保证它成立的常用条件是<b>Slater 条件</b>：存在严格可行点 <code>x̃</code>，使所有不等式约束 <code>f<sub>i</sub>(x̃) &lt; 0</code>（若 <code>f<sub>i</sub></code> 是仿射的，则允许 <code>f<sub>i</sub>(x̃) ≤ 0</code>），等式约束 <code>h<sub>i</sub>(x̃) = 0</code>。也就是说，可行域要有「内部」，不能是一个扁平的集合。若 Slater 条件成立且问题是凸的，则强对偶成立，且对偶最优解可达。' },

    { t: 'p', html: '仿射不等式的豁免很重要。LP 的约束全是仿射的，Slater 条件退化为「存在可行点」——只要 LP 可行且有界，强对偶就成立。这就是为什么线性规划的对偶理论如此干净：不需要任何「严格内部」的假设。反过来，若约束是 <code>x<sup>2</sup> ≤ 0</code> 这种「退化」的凸约束，可行域是一个点，没有严格内部，Slater 条件失效，强对偶的证明就要另想办法。' },

    { t: 'p', html: '一个常见误解：Slater 条件是<b>充分条件</b>，不是必要条件。有些问题不满足 Slater 条件，强对偶仍然成立（例如可行域虽无内点，但结构特殊）。所以考试里若题目不满足 Slater，不能直接断言「强对偶不成立」，只能说「Slater 条件不能用来保证」。要证不成立，必须构造出正间隙的例子。' },

    { t: 'p', html: 'Slater 条件还有一个「相对内部」的版本：若可行域的仿射包不是整个空间（例如有等式约束把可行域压在一个低维平面上），严格可行性只需要在相对内部成立。这在有大量等式约束的问题里很常见，判断时先看等式约束把维数降到了多少。' },

    { t: 'callout', kind: 'warn', title: '「凸」不等于「强对偶」', html: '凸问题也可能有正的对偶间隙，只是需要构造得很刻意（通常是非多面体的约束、且 Slater 失效）。做题时若题目说「凸问题」，不要自动写 <code>d* = p*</code>，要补一句「若 Slater 条件成立，则强对偶成立」。这句话是很多证明题的关键得分点。' },

    { t: 'quiz', qid: 'ch05-q2' },

    { t: 'h', lvl: 2, text: '五、KKT 条件', id: 'ch05-5' },

    { t: 'p', html: '强对偶成立时，原问题与对偶问题的最优解满足一组耦合条件，叫 <b>KKT 条件</b>（Karush–Kuhn–Tucker conditions）。它由四部分组成：<b>① 平稳性</b>（stationarity）<code>∇f<sub>0</sub>(x) + Σ λ<sub>i</sub>∇f<sub>i</sub>(x) + Σ ν<sub>i</sub>∇h<sub>i</sub>(x) = 0</code>；<b>② 原始可行</b><code>f<sub>i</sub>(x) ≤ 0</code>、<code>h<sub>i</sub>(x) = 0</code>；<b>③ 对偶可行</b><code>λ<sub>i</sub> ≥ 0</code>；<b>④ 互补松弛</b><code>λ<sub>i</sub>f<sub>i</sub>(x) = 0</code>。' },

    { t: 'p', html: '<b>平稳性</b>说的是「目标梯度 + 约束梯度的非负组合 = 0」：在最优解处，目标想往外走的方向，恰好被起作用的约束挡住。<b>互补松弛</b>说的是「要么约束起作用（<code>f<sub>i</sub> = 0</code>），要么乘子为零（<code>λ<sub>i</sub> = 0</code>）」：没起作用的约束不值钱，值钱的约束一定起作用。这两条把第 2 章的支撑超平面与第 4 章的局部最优条件连了起来。' },

    { t: 'p', html: 'KKT 的地位取决于问题是否凸。<b>凸问题</b>：KKT 是充要条件——任何满足 KKT 的点都是全局最优。<b>非凸问题</b>：KKT 只是必要条件，满足 KKT 的点可能只是局部最优或鞍点。所以「解 KKT 系统」这个做法，在凸问题里是安全的，在非凸问题里只能当作筛选候选点的手段。' },

    { t: 'p', html: '用前面的例子验算：<code>min x<sup>2</sup></code>、<code>s.t. 1 − x ≤ 0</code>。KKT：平稳性 <code>2x − λ = 0</code>；原始可行 <code>x ≥ 1</code>；对偶可行 <code>λ ≥ 0</code>；互补松弛 <code>λ(1 − x) = 0</code>。分两种情形：<code>λ = 0</code> 时 <code>x = 0</code>，违反 <code>x ≥ 1</code>；<code>1 − x = 0</code> 时 <code>x = 1</code>，<code>λ = 2 ≥ 0</code>。唯一解 <code>(x, λ) = (1, 2)</code>，与前面的对偶解一致。' },

    { t: 'table', caption: 'KKT 四个条件的作用', head: ['条件', '数学形式', '几何含义'], rows: [
      ['平稳性', '<code>∇f<sub>0</sub> + Σλ<sub>i</sub>∇f<sub>i</sub> + Σν<sub>i</sub>∇h<sub>i</sub> = 0</code>', '目标的下降方向被约束挡住'],
      ['原始可行', '<code>f<sub>i</sub> ≤ 0</code>，<code>h<sub>i</sub> = 0</code>', '点在可行域内'],
      ['对偶可行', '<code>λ<sub>i</sub> ≥ 0</code>', '约束只能「挡」不能「拉」'],
      ['互补松弛', '<code>λ<sub>i</sub>f<sub>i</sub> = 0</code>', '不起作用的约束乘子为零']
    ] },

    { t: 'p', html: '一个容易被忽略的细节：<b>互补松弛是「乘积为零」而不是「两者都为零」</b>。它允许 <code>f<sub>i</sub> = 0</code> 且 <code>λ<sub>i</sub> &gt; 0</code>（约束紧、值钱），也允许 <code>f<sub>i</sub> &lt; 0</code> 且 <code>λ<sub>i</sub> = 0</code>（约束松、不值钱），但不允许「约束松且乘子正」。做题时按「约束是否取等」分支讨论，是最稳的解法。' },

    { t: 'p', html: 'KKT 还解释了为什么第 1 章那个生产计划里，原料 3 用完了却没有影子价格：三条约束在最优解处都取等（<code>f<sub>i</sub> = 0</code>），互补松弛自动满足，但乘子可以是零。乘子为零意味着「这条约束虽然紧，但并不限制目标进一步改善」——因为另外两条约束已经把它卡死了。这是<b>退化</b>（degeneracy）的典型表现，也是第 7 章内点法要处理数值困难的来源之一。' },

    { t: 'quiz', qid: 'ch05-q3' },

    { t: 'h', lvl: 2, text: '六、影子价格与灵敏度', id: 'ch05-6' },

    { t: 'p', html: '把约束右端改成参数：<code>p*(u) = min f<sub>0</sub>(x)</code>、<code>s.t. f<sub>i</sub>(x) ≤ u<sub>i</sub></code>、<code>h<sub>i</sub>(x) = 0</code>。在强对偶与可微的假设下，<code>∂p*/∂u<sub>i</sub> = −λ<sub>i</sub>*</code>。<b>乘子就是最优值对右端项的敏感度</b>，经济学里叫影子价格：多一单位资源，最优目标能改善 <code>λ<sub>i</sub>*</code>。这个结论是灵敏度分析的全部基础。' },

    { t: 'p', html: '注意负号与方向。对极小化问题，<code>u<sub>i</sub></code> 变大（约束放宽）时最优值只会变小或不变，所以 <code>∂p*/∂u<sub>i</sub> ≤ 0</code>，而 <code>λ<sub>i</sub>* ≥ 0</code>，负号对得上。对极大化问题（例如利润），符号会翻转，写答案时要先明确「这是 min 还是 max」。' },

    { t: 'p', html: '手算一个完整 LP 的对偶。原问题：<code>min 2x<sub>1</sub> + 3x<sub>2</sub></code>，<code>s.t. x<sub>1</sub> + x<sub>2</sub> ≥ 4</code>，<code>x<sub>1</sub> + 3x<sub>2</sub> ≥ 6</code>，<code>x ≥ 0</code>。可行域顶点是 <code>(6,0)</code>、<code>(3,1)</code>、<code>(0,4)</code>，目标值分别是 12、9、12，所以 <code>p* = 9</code>，最优解 <code>(3,1)</code>。' },

    { t: 'p', html: '对偶问题：<code>max 4y<sub>1</sub> + 6y<sub>2</sub></code>，<code>s.t. y<sub>1</sub> + y<sub>2</sub> ≤ 2</code>，<code>y<sub>1</sub> + 3y<sub>2</sub> ≤ 3</code>，<code>y ≥ 0</code>。顶点是 <code>(0,0)</code>、<code>(2,0)</code>、<code>(0,1)</code>、<code>(1.5, 0.5)</code>，目标值 0、8、6、9，所以 <code>d* = 9</code>。强弱对偶在这里取等，两个问题的最优值都是 9。' },

    { t: 'p', html: '验证互补松弛：<code>x<sub>1</sub> = 3 &gt; 0</code> 迫使第一条对偶约束取等（<code>1.5 + 0.5 = 2</code>）；<code>x<sub>2</sub> = 1 &gt; 0</code> 迫使第二条取等（<code>1.5 + 1.5 = 3</code>）；<code>y<sub>1</sub> = 1.5 &gt; 0</code> 迫使第一条原始约束取等（<code>3 + 1 = 4</code>）；<code>y<sub>2</sub> = 0.5 &gt; 0</code> 迫使第二条取等（<code>3 + 3 = 6</code>）。四条全部对上，说明解是自洽的。<b>互补松弛是检验手算结果最快的方法</b>，比重新解一遍省时间。' },

    { t: 'p', html: '灵敏度怎么读：<code>y<sub>1</sub> = 1.5</code> 表示第一条约束右端从 4 增加到 4.1，最优值大约从 9 降到 <code>9 − 1.5×0.1 = 8.85</code>；<code>y<sub>2</sub> = 0.5</code> 表示第二条右端从 6 增到 6.1，最优值降到 <code>8.95</code>。这只是<b>局部</b>结论：右端变化太大时，最优解的「起作用约束集合」会变，线性关系失效。灵敏度分析的适用边界，就是「基不变」的范围。' },

    { t: 'h', lvl: 2, text: '七、对偶的几何解释', id: 'ch05-7' },

    { t: 'p', html: '定义集合 <code>G = {(f<sub>1</sub>(x), …, f<sub>m</sub>(x), h(x), f<sub>0</sub>(x)) | x ∈ dom}</code>，把每个 <code>x</code> 映射成一个点：前 <code>m</code> 个坐标是「违反约束的程度」，最后一个是目标值。原问题的最优值 <code>p*</code> 就是 <code>G</code> 在「前 <code>m</code> 个坐标 ≤ 0、等式坐标为 0」这个区域里的最低点。' },

    { t: 'p', html: '对偶函数则可以写成 <code>g(λ, ν) = inf<sub>(u,t)∈G</sub> (t + λ<sup>T</sup>u + ν<sup>T</sup>w)</code>。对固定的 <code>(λ, ν)</code>，<code>t + λ<sup>T</sup>u + ν<sup>T</sup>w = 常数</code> 是一个超平面；<code>g</code> 就是「把这个超平面往下推，直到刚好托住 <code>G</code>」时的高度。所以<b>对偶函数就是在用一族超平面从下方支撑集合 <code>G</code></b>。' },

    { t: 'p', html: '强对偶的几何含义因此变得清楚：<b>存在一个非垂直的支撑超平面，恰好托在 <code>(0, p*)</code> 处</b>。若 <code>G</code> 在 <code>u = 0</code> 附近是凸的，这样的支撑面一定存在（分离定理）；若 <code>G</code> 凹进去，支撑面就只能托在更低的地方，于是出现正间隙。第 2 章的分离超平面定理在这里兑现了它的承诺。' },

    { t: 'p', html: '这个图像还解释了两件事。<b>为什么对偶函数恒凹</b>：它是「支撑面高度」的下确界，而支撑面高度是 <code>(λ, ν)</code> 的仿射函数。 <b>为什么乘子非负</b>：支撑面的法向量必须指向「可行区域」，即 <code>u</code> 的分量方向不能反。若 <code>λ<sub>i</sub> &lt; 0</code>，支撑面就托在了错误的一侧，托不住 <code>G</code>。' },

    { t: 'callout', kind: 'exam', title: '几何解释怎么考', html: '常见问法：「画出集合 <code>G</code>，说明对偶函数的最优值对应哪条支撑超平面」「举一个 <code>G</code> 非凸导致正间隙的例子」。答这类题不需要复杂计算，关键是画出 <code>u</code> 与 <code>t</code> 两个坐标，标出可行区域 <code>u ≤ 0</code>，再画一条斜率为 <code>−λ</code> 的直线托住 <code>G</code>。' },

    { t: 'h', lvl: 2, text: '八、用对偶解题', id: 'ch05-8' },

    { t: 'p', html: '对偶不只是理论工具，它给了一条完整的解题路径。下面五步几乎适用于所有「求对偶问题 / 验证最优性 / 算灵敏度」的题。' },

    { t: 'steps', items: [
      { title: '① 标准化', html: '把问题写成 <code>min f<sub>0</sub></code>、<code>f<sub>i</sub> ≤ 0</code>、<code>h<sub>i</sub> = 0</code>。注意 <code>≥</code> 要乘 −1 翻转，<code>max</code> 要取负。' },
      { title: '② 写拉格朗日函数', html: '每个不等式配 <code>λ<sub>i</sub> ≥ 0</code>，每个等式配自由 <code>ν<sub>i</sub></code>，把约束左边乘上乘子加进目标。' },
      { title: '③ 求下确界', html: '对 <code>x</code> 求 <code>inf L</code>。线性项看系数是否为零（否则 <code>−∞</code>），二次项配方或用一阶条件，得到 <code>g(λ, ν)</code> 的闭式与定义域。' },
      { title: '④ 写出对偶问题', html: '<code>max g(λ, ν)</code>、<code>λ ≥ 0</code>。它一定凸，可用标准求解器。' },
      { title: '⑤ 验证与解读', html: '用互补松弛检查原-对偶解是否自洽；用 <code>λ<sub>i</sub>*</code> 读影子价格；若间隙为零，则两边最优值相等，可作为答案互检。' }
    ] },

    { t: 'code', lang: 'python', caption: '用 CVXPY 同时拿到原问题与对偶的解', code: `import cvxpy as cp
import numpy as np

x = cp.Variable(2, nonneg=True)
cons = [x[0] + x[1] >= 4, x[0] + 3 * x[1] >= 6]
prob = cp.Problem(cp.Minimize(2 * x[0] + 3 * x[1]), cons)
prob.solve()

print("p* =", round(prob.value, 6))            # 9.0
print("x* =", np.round(x.value, 6))            # [3. 1.]
print("lambda* =", [round(c.dual_value, 6) for c in cons])   # [1.5, 0.5]

# 对偶问题：max 4 y1 + 6 y2, s.t. y1 + y2 <= 2, y1 + 3 y2 <= 3, y >= 0
y = cp.Variable(2, nonneg=True)
dual = cp.Problem(cp.Maximize(4 * y[0] + 6 * y[1]),
                  [y[0] + y[1] <= 2, y[0] + 3 * y[1] <= 3])
dual.solve()
print("d* =", round(dual.value, 6))            # 9.0，与 p* 相等` },

    { t: 'p', html: '运行结果里 <code>p*</code> 与 <code>d*</code> 都是 9，<code>lambda*</code> 是 <code>[1.5, 0.5]</code>，与手算完全一致。CVXPY 给出的 <code>dual_value</code> 就是 KKT 乘子；若某条约束的乘子是 0，说明它在最优解处不起作用（或虽然起作用但退化）。<b>用代码验证手算，是这一章最有效的练习方式</b>：先手推，再跑代码，对不上就回去找哪一步符号错了。' },

    { t: 'p', html: '最后提醒一个实践中的坑：求解器返回的乘子可能因为「约束写法不同」而变号或缩放。<code>2x<sub>1</sub> + 2x<sub>2</sub> ≥ 8</code> 与 <code>x<sub>1</sub> + x<sub>2</sub> ≥ 4</code> 是同一个约束，但乘子会差一个因子 2。读乘子时一定要连同「约束是怎么写的」一起读，否则灵敏度会算错一个倍数。' },

    { t: 'terms', items: [
      { en: 'Lagrangian', zh: '拉格朗日函数', html: '目标加上约束左端与乘子的内积，是原问题的「无约束化」形式。' },
      { en: 'dual function', zh: '对偶函数', html: '拉格朗日函数对原变量取下确界，恒为凹，给出最优值的下界。' },
      { en: 'weak duality', zh: '弱对偶', html: '<code>d* ≤ p*</code> 恒成立，不要求问题凸。' },
      { en: 'strong duality', zh: '强对偶', html: '<code>d* = p*</code>，凸问题在 Slater 条件等约束规范下成立。' },
      { en: 'Slater condition', zh: 'Slater 条件', html: '存在严格可行点；仿射不等式可放宽为普通可行。' },
      { en: 'KKT conditions', zh: 'KKT 条件', html: '平稳性、原始可行、对偶可行、互补松弛四条的合称。' },
      { en: 'shadow price', zh: '影子价格', html: '约束右端每增加一单位时最优值的改善量，等于该约束的乘子。' },
      { en: 'duality gap', zh: '对偶间隙', html: '<code>p* − d*</code>，衡量对偶解离最优值多远。' }
    ] },

    { t: 'keypoint', items: [
      { title: '拉格朗日函数把约束搬进目标', html: '对可行点它 ≤ 目标值，因此对偶函数给出下界；乘子符号不能错。' },
      { title: '对偶函数恒凹', html: '仿射函数族的下确界；不要求原问题凸，也不需要 <code>f<sub>i</sub></code> 凸。' },
      { title: '弱对偶无条件成立', html: '<code>d* ≤ p*</code>；强对偶需要凸 + 约束规范（如 Slater）。' },
      { title: 'Slater 是充分条件', html: '仿射不等式可放宽为普通可行，所以 LP 可行有界即强对偶。' },
      { title: 'KKT 凸时充要', html: '凸问题里满足 KKT 即全局最优；非凸问题里它只是必要条件。' },
      { title: '乘子即影子价格', html: '<code>∂p*/∂u<sub>i</sub> = −λ<sub>i</sub>*</code>；只在该约束的基不变范围内有效。' }
    ] },

    { t: 'checklist', id: 'ch05', items: [
      '我能写出拉格朗日函数，并检查乘子的符号约定',
      '我能证明弱对偶不等式 <code>d* ≤ p*</code>',
      '我能对一个 LP 手算出对偶问题，并验证两边最优值相等',
      '我能写出对偶函数，并说出它为什么恒为凹',
      '我能陈述 Slater 条件，并说明仿射不等式为什么可以放宽',
      '我能写出 KKT 四个条件，并用互补松弛判断约束是否起作用',
      '我能说明凸问题里 KKT 是充要条件、非凸问题里只是必要条件',
      '我能由乘子读出影子价格，并解释它的适用范围',
      '我能用 <code>G</code> 集合与支撑超平面解释强对偶的几何含义',
      '我能用 CVXPY 同时跑原问题与对偶问题，并核对结果'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 MAT3007 教材第 5 章「拉格朗日对偶」组织：拉格朗日函数、对偶函数与下界性质、弱/强对偶、Slater 条件、KKT 条件、影子价格与灵敏度、几何解释。LP 对偶的推导采用等式形式 <code>Ax = b, x ≥ 0</code>，不等式形式的符号约定另见正文说明；灵敏度公式 <code>∂p*/∂u<sub>i</sub> = −λ<sub>i</sub>*</code> 只在强对偶与可微时成立。数值例子 <code>min 2x<sub>1</sub>+3x<sub>2</sub></code> 的最优解 <code>(3,1)</code>、对偶解 <code>(1.5, 0.5)</code> 均已手算与代码互检。考核范围以当学期 syllabus 与习题课为准。' }
  ]
});
