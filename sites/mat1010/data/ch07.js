/* =====================================================================
 * ch07.js · 第 7 章「约束优化与动态：拉格朗日到差分方程」
 * 职责：把最优化从「无约束」推进到「有约束」，再推进到「跨期」：
 *       拉格朗日乘子、影子价格、二阶条件、线性方程组与 Cramer 法则、
 *       差分方程与蛛网模型。全部围绕预算约束与跨期决策。
 * 依据：Essential Mathematics for Economic Analysis（5th ed）第 16–19 章
 *       的约束优化与差分方程部分。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch07',
  num: '07',
  title: '约束优化与动态：拉格朗日到差分方程',
  en: 'CONSTRAINED OPTIMIZATION & DYNAMICS',
  goals: [
    '写出拉格朗日函数，用一阶条件解出预算约束下的最优消费组合',
    '解释乘子的影子价格含义，并用它估算收入或资源变化的影响',
    '用相切条件与二阶条件判断最优解，处理边界解与角点解',
    '用矩阵与 Cramer 法则解线性方程组，判断比较静态的符号',
    '建立与求解一阶差分方程，判断稳定性，并用蛛网模型解释价格波动'
  ],
  kp: [
    { id: 'ch07-1', title: '约束与拉格朗日构造' },
    { id: 'ch07-2', title: '一阶条件与相切条件' },
    { id: 'ch07-3', title: '乘子的影子价格' },
    { id: 'ch07-4', title: '二阶条件与边界解' },
    { id: 'ch07-5', title: '矩阵与 Cramer 法则' },
    { id: 'ch07-6', title: '差分方程与稳定性' },
    { id: 'ch07-7', title: '微分方程与连续时间' },
    { id: 'ch07-8', title: '蛛网模型与价格波动' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '没有约束的最优化不是经济问题', html: '如果预算无限、产能无限、时间无限，最优解通常是把某个变量推到无穷，或者落在毫无意义的角点上。经济学的核心恰恰是<b>稀缺</b>：收入有限、产能有限、时间有限。约束优化（constrained optimization）把「想要更多」和「只能这么多」放进同一个问题，拉格朗日乘子则给出一条额外信息：约束放松一单位，目标能改善多少。这个数就是「影子价格」，是本章最有用的产出。' },

    { t: 'p', lead: true, html: '前两章分别解决了「无约束极值」与「多变量偏导」。本章把两者合起来：在 <code>g(x, y) = c</code> 的约束下最大化或最小化 <code>f(x, y)</code>。方法叫<b>拉格朗日乘子法（Lagrange multiplier method）</b>：构造 <code>L = f + λ(c − g)</code>，对每个变量与 λ 求偏导并令其为零，解方程组。' },

    { t: 'p', html: '章末再把「静态」推进到「动态」：当最优选择跨期时，今天的价格会影响明天的供给，形成差分方程。差分方程的解、稳定条件与蛛网模型，解释了为什么农产品价格会周期性波动、为什么有些市场会自我修正而有些会发散。这是本课的收尾，也是把前面所有工具串起来的地方。' },

    { t: 'h', lvl: 2, text: '一、约束与拉格朗日构造', id: 'ch07-1' },

    { t: 'p', html: '约束优化的标准形式：最大化 <code>f(x, y)</code>，受约束 <code>g(x, y) = c</code>。构造<b>拉格朗日函数</b> <code>L(x, y, λ) = f(x, y) + λ(c − g(x, y))</code>。λ 叫<b>拉格朗日乘子（Lagrange multiplier）</b>。注意括号里写 <code>c − g</code> 而不是 <code>g − c</code>，符号约定会影响 λ 的读法；只要前后一致即可。' },

    { t: 'p', html: '为什么这样构造？在约束面上 <code>g = c</code>，所以 <code>L = f</code>，两者的值相同；而在约束面之外，λ 项惩罚偏离。对 L 求偏导时，λ 的偏导正好还原约束 <code>c − g = 0</code>。于是「在约束内找 f 的极值」变成「在更大的空间里找 L 的驻点」，工具就回到 ch06 的偏导。' },

    { t: 'p', html: '例：消费者效用 <code>U = xy</code>，价格 <code>p = 2</code>、<code>q = 5</code>，收入 <code>m = 100</code>，预算约束 <code>2x + 5y = 100</code>。构造 <code>L = xy + λ(100 − 2x − 5y)</code>。三个一阶条件：<code>L<sub>x</sub> = y − 2λ = 0</code>、<code>L<sub>y</sub> = x − 5λ = 0</code>、<code>L<sub>λ</sub> = 100 − 2x − 5y = 0</code>。' },

    { t: 'p', html: '由前两式得 <code>y = 2λ</code>、<code>x = 5λ</code>，所以 <code>y/x = 2/5</code>，即 <code>y = 0.4x</code>。代入预算：<code>2x + 5(0.4x) = 2x + 2x = 4x = 100</code>，得 <code>x = 25</code>、<code>y = 10</code>。λ 由 <code>y = 2λ</code> 得 <code>λ = 5</code>。效用 <code>U = 25 × 10 = 250</code>。' },

    { t: 'p', html: '这个解法有通用结构：先由「边际效用比等于价格比」定出两种商品的比例，再代入预算定出规模。可以验证 <code>MU<sub>x</sub>/p = y/2 = 5</code>、<code>MU<sub>y</sub>/q = x/5 = 5</code>，两者相等且都等于 λ。这就是下一节的相切条件。' },

    { t: 'table', head: ['步骤', '操作', '本例结果'], rows: [
      ['1. 写约束', '<code>2x + 5y = 100</code>', '预算线'],
      ['2. 构造 L', '<code>L = xy + λ(100 − 2x − 5y)</code>', '三变量函数'],
      ['3. 一阶条件', '<code>y = 2λ, x = 5λ, 2x + 5y = 100</code>', '三个方程'],
      ['4. 解比例', '<code>y/x = 2/5</code>', '<code>y = 0.4x</code>'],
      ['5. 代回约束', '<code>4x = 100</code>', '<code>x* = 25, y* = 10</code>'],
      ['6. 读乘子', '<code>λ = y/2 = 5</code>', '收入的边际效用']
    ], caption: '拉格朗日法的六步流程，几乎所有约束题都照此走' },

    { t: 'h', lvl: 2, text: '二、一阶条件与相切条件', id: 'ch07-2' },

    { t: 'p', html: '一阶条件的几何含义是<b>相切（tangency）</b>：在最优点，目标函数的等值线与约束曲线相切。两条曲线斜率相等，等价于 <code>MRS = p/q</code>，即 <code>MU<sub>x</sub>/MU<sub>y</sub> = p<sub>x</sub>/p<sub>y</sub></code>，或写成 <code>MU<sub>x</sub>/p<sub>x</sub> = MU<sub>y</sub>/p<sub>y</sub></code>：每一元钱花在任何商品上的边际效用相等。' },

    { t: 'p', html: '如果不等，就有改进空间。假设 <code>MU<sub>x</sub>/p<sub>x</sub> &gt; MU<sub>y</sub>/p<sub>y</sub></code>，说明同样一元钱花在 x 上带来的效用更多，消费者应少买 y、多买 x，直到两者相等。这个「边际调整」的逻辑是所有最优化一阶条件的共同直觉，也是第四章「边际收益等于边际成本」的同一个故事。' },

    { t: 'p', html: '用上面的例子验证：<code>MU<sub>x</sub> = y = 10</code>、<code>MU<sub>y</sub> = x = 25</code>，<code>MU<sub>x</sub>/p = 10/2 = 5</code>、<code>MU<sub>y</sub>/q = 25/5 = 5</code> ✓。若消费者误选 <code>x = 20, y = 12</code>（仍在预算上：<code>40 + 60 = 100</code>），则 <code>MU<sub>x</sub>/p = 6 &gt; MU<sub>y</sub>/q = 4</code>，效用 <code>240 &lt; 250</code>，确实变差。' },

    { t: 'p', html: '相切条件是<b>必要条件</b>，不是充分条件。它只保证「在约束面上无法沿切线方向改进」，但如果等值线弯曲方向不对，切点可能是效用最小点而不是最大点。这就需要对二阶条件再检查一次，下一节展开。另外，相切也可能出现在「角点」——消费者只买一种商品，此时切线条件不成立，要单独处理。' },

    { t: 'p', html: '一个常见变体：<code>Cobb-Douglas</code> 效用 <code>U = x<sup>a</sup>y<sup>b</sup></code> 在预算 <code>p x + q y = m</code> 下的解是 <code>x* = [a/(a+b)]·(m/p)</code>、<code>y* = [b/(a+b)]·(m/q)</code>：支出份额固定为 <code>a/(a+b)</code> 与 <code>b/(a+b)</code>。这是 Cobb-Douglas 最方便的性质，考试里可直接用，但要知道它来自相切条件。' },

    { t: 'quiz', qid: 'ch07-q1' },

    { t: 'h', lvl: 2, text: '三、乘子的影子价格', id: 'ch07-3' },

    { t: 'p', html: '乘子 λ 的经济含义是<b>影子价格（shadow price）</b>：约束右端 c 增加一单位，最优目标值约增加 λ。数学上 <code>dU*/dm = λ</code>（包络定理）。在上例中 λ=5，意思是收入从 100 增加到 101，效用约增加 5；精确计算 <code>x=25.25, y=10.1, U=255.025</code>，增量 5.025，与 5 非常接近。' },

    { t: 'p', html: '影子价格是管理决策的货币化工具。若约束是「产能 100 小时」，λ=5 表示多一小时产能值 5 元：如果加班成本低于 5 元/小时，就该加班；高于 5 元就不该。若约束是「预算」，λ 是收入的边际效用，可用来比较「给消费者 1 元」与「给消费者 1 单位商品」哪个更有效。' },

    { t: 'p', html: 'λ 的符号也有信息。在最大化问题里，约束放松不会让目标变差，所以 λ ≥ 0；若 λ = 0，说明约束<b>不起作用</b>（松弛），此时最优解与无约束解相同。在最小化成本问题里，λ 是把产量要求放松一单位能省下的成本，同样非负。' },

    { t: 'p', html: '成本最小化的例子：<code>Q = L<sup>0.5</sup>K<sup>0.5</sup></code>，工资 <code>w = 4</code>、资本租金 <code>r = 9</code>，要求 <code>Q = 100</code>。构造 <code>L = 4L + 9K + λ(100 − L<sup>0.5</sup>K<sup>0.5</sup>)</code>。相切条件 <code>MP<sub>L</sub>/MP<sub>K</sub> = w/r</code> 给出 <code>K/L = 4/9</code>，即 <code>K = 4L/9</code>；代入产量约束 <code>(2/3)L = 100</code>，得 <code>L = 150</code>、<code>K = 66.67</code>，最小成本 <code>4×150 + 9×66.67 = 1200</code>。' },

    { t: 'p', html: '接着读乘子：<code>λ = ∂C*/∂Q</code>，即多生产一单位产量的边际成本。由 <code>L = 4L + 9K + λ(100 − Q)</code> 的一阶条件可解出 λ，数值上等于在最优点的边际成本（约 6）。这解释了为什么「影子价格」与「边际成本」经常是同一个数：它们都是「放松一单位约束的代价」。' },

    { t: 'table', head: ['约束类型', '乘子读法', '决策用途'], rows: [
      ['预算 <code>m</code>', '收入的边际效用', '比较现金补贴与实物补贴'],
      ['产能 <code>H</code> 小时', '每小时产能的价值', '决定是否加班、是否扩产'],
      ['产量要求 <code>Q</code>', '边际成本', '定价、外包还是自产'],
      ['排放上限', '边际减排成本', '碳价、排污权交易']
    ], caption: '同一个 λ，在不同约束下读法不同，但都是「放松一单位的边际价值」' },

    { t: 'h', lvl: 2, text: '四、二阶条件与边界解', id: 'ch07-4' },

    { t: 'p', html: '约束优化的二阶条件用<b>加边 Hessian（bordered Hessian）</b>：把约束的偏导作为一行一列加在 Hessian 外面。二元情形下，最大化要求加边行列式 <code>|H̄| &gt; 0</code>，最小化要求 <code>|H̄| &lt; 0</code>（符号约定因教材而异，做题时按课堂定义）。直观上，它检查「沿约束曲线的二阶变化」是否朝对的方向弯。' },

    { t: 'p', html: '对大多数经济题，二阶条件可以先用图形判断：无差异曲线凸向原点、等产量线凸向原点、预算线是直线，切点就是最大（或最小）点。只有当函数非凸、或者题目特意设置「凹的等值线」时，才需要动加边 Hessian。考试里如果题目只要求「求最优解」，通常默认二阶条件满足。' },

    { t: 'p', html: '更重要的一类是<b>边界解（corner solution）</b>：最优解落在约束的端点上，某个变量取 0。例如 <code>U = x + 2y</code>、<code>p<sub>x</sub> = 2</code>、<code>p<sub>y</sub> = 3</code>、<code>m = 12</code>：x 的「每元效用」是 0.5，y 是 0.667，y 更划算，所以全部买 y：<code>x = 0, y = 4, U = 8</code>。此时相切条件不成立（无差异曲线是直线，与预算线不切于内点），必须用角点比较。' },

    { t: 'p', html: '处理边界解的方法：① 先按内点解求一阶条件，若解出负值或超出约束，则说明最优在边界；② 把边界值（如 x=0）代入约束，化为一元问题求最优；③ 比较各候选点的目标值，取最大。这与第四章闭区间最值「比较内部驻点与端点」完全同构。' },

    { t: 'p', html: '不等式约束的一般框架是 <b>Kuhn-Tucker 条件</b>：<code>L = f + λ(c − g)</code>，加上 <code>λ ≥ 0</code>、<code>λ(c − g) = 0</code>（互补松弛）。互补松弛的意思是：约束不起作用时 λ=0，约束起作用时 λ 可以为正。这个条件把「内点解」与「边界解」统一进一个式子，是线性规划与运筹学的入口。' },

    { t: 'h', lvl: 2, text: '五、矩阵与 Cramer 法则', id: 'ch07-5' },

    { t: 'p', html: '线性方程组可以写成矩阵形式 <code>Ax = b</code>。二元情形：<code>a<sub>11</sub>x + a<sub>12</sub>y = b<sub>1</sub></code>、<code>a<sub>21</sub>x + a<sub>22</sub>y = b<sub>2</sub></code>。<b>Cramer 法则（Cramer rule）</b>给出 <code>x = det(A<sub>x</sub>)/det(A)</code>、<code>y = det(A<sub>y</sub>)/det(A)</code>，其中 <code>A<sub>x</sub></code> 是把 A 的第一列换成 b 得到的矩阵。' },

    { t: 'p', html: '例：<code>2x + 3y = 12</code>、<code>x − y = 1</code>。系数行列式 <code>det(A) = 2×(−1) − 3×1 = −5</code>。<code>det(A<sub>x</sub>) = 12×(−1) − 3×1 = −15</code>，所以 <code>x = 3</code>；<code>det(A<sub>y</sub>) = 2×1 − 12×1 = −10</code>，所以 <code>y = 2</code>。验证：<code>2×3 + 3×2 = 12</code> ✓，<code>3 − 2 = 1</code> ✓。' },

    { t: 'p', html: 'Cramer 法则的价值不在「解方程」（消元法更快），而在<b>比较静态（comparative statics）</b>：把 b 看成参数，<code>x = det(A<sub>x</sub>)/det(A)</code> 直接给出「b 变化时 x 怎么变」的符号。例如需求与供给联立、IS-LM 联立，都可以用行列式判断政策变量的影响方向，而不必解出完整表达式。' },

    { t: 'p', html: '当 <code>det(A) = 0</code> 时，方程组要么无解，要么有无穷多解（两条直线平行或重合）。经济上这对应「约束不独立」：例如两个约束其实是同一个预算约束的倍数，此时拉格朗日乘子不唯一，模型退化。遇到 det=0，先检查约束之间是否线性相关。' },

    { t: 'p', html: '三元以上同理：<code>x<sub>i</sub> = det(A<sub>i</sub>)/det(A)</code>，其中 <code>A<sub>i</sub></code> 是把第 i 列换成 b。手算三元行列式可用余子式展开，但考试通常只考二元或给出简化数字。矩阵的更多性质（秩、逆、特征值）在后续线性代数课里展开，本课只要求会用 Cramer 法则解二元方程组。' },

    { t: 'quiz', qid: 'ch07-q2' },

    { t: 'h', lvl: 2, text: '六、差分方程与稳定性', id: 'ch07-6' },

    { t: 'p', html: '<b>差分方程（difference equation）</b>描述离散时间序列的演化。一阶线性形式：<code>y<sub>t+1</sub> = a y<sub>t</sub> + b</code>。它的<b>稳态（steady state）</b>是令 <code>y<sub>t+1</sub> = y<sub>t</sub> = y*</code> 解出的值：<code>y* = b/(1 − a)</code>（<code>a ≠ 1</code>）。通解是 <code>y<sub>t</sub> = y* + (y<sub>0</sub> − y*)(a)<sup>t</sup></code>。' },

    { t: 'p', html: '例：<code>y<sub>t+1</sub> = 0.8y<sub>t</sub> + 20</code>。稳态 <code>y* = 20/(1 − 0.8) = 100</code>。若 <code>y<sub>0</sub> = 50</code>，通解 <code>y<sub>t</sub> = 100 − 50(0.8)<sup>t</sup></code>：<code>t=1</code> 时 60，<code>t=2</code> 时 68，<code>t=3</code> 时 74.4，逐步逼近 100 但永不达到。每期把「与稳态的差距」缩小 20%，这就是收敛。' },

    { t: 'p', html: '稳定性完全由 <code>|a|</code> 决定：<code>|a| &lt; 1</code> 收敛到稳态；<code>|a| &gt; 1</code> 发散；<code>a &lt; 0</code> 时出现<b>振荡</b>（正负交替），<code>a &gt; 0</code> 时单调趋近。<code>a = 1</code> 时无稳态（除非 b=0），序列是等差。<code>a = −1</code> 时在两值之间永久振荡。' },

    { t: 'p', html: '经济解释：<code>a</code> 可以理解为「惯性」或「调整速度」。<code>a = 0.8</code> 表示 80% 的偏差会延续到下一期，20% 被修正；<code>a</code> 越接近 1，调整越慢。政策如果能把 a 压低（例如提高市场流动性、减少调整成本），收敛就更快。' },

    { t: 'table', head: ['参数范围', '行为', '经济场景'], rows: [
      ['<code>0 &lt; a &lt; 1</code>', '单调收敛', '价格逐步回归均衡'],
      ['<code>−1 &lt; a &lt; 0</code>', '振荡收敛', '库存周期逐渐衰减'],
      ['<code>a &gt; 1</code>', '单调发散', '投机泡沫'],
      ['<code>a &lt; −1</code>', '振荡发散', '蛛网模型的爆炸式波动'],
      ['<code>|a| = 1</code>', '不收敛', '随机游走、永久振荡']
    ], caption: '一阶差分方程的长期行为只看 a 的绝对值与符号' },

    { t: 'h', lvl: 2, text: '七、微分方程与连续时间', id: 'ch07-7' },

    { t: 'p', html: '连续时间版本是<b>微分方程（differential equation）</b>：<code>dp/dt + a p = b</code>（<code>a &gt; 0</code>）。稳态 <code>p* = b/a</code>；通解 <code>p(t) = b/a + (p<sub>0</sub> − b/a)e<sup>−at</sup></code>。因为 <code>e<sup>−at</sup> → 0</code>，只要 <code>a &gt; 0</code>，解一定收敛到稳态，收敛速度由 a 决定（半衰期 <code>ln2/a</code>）。' },

    { t: 'p', html: '例：<code>dp/dt + 2p = 60</code>，<code>p<sub>0</sub> = 10</code>。稳态 <code>p* = 30</code>，解 <code>p(t) = 30 − 20e<sup>−2t</sup></code>。半衰期 <code>ln2/2 ≈ 0.347</code>：约 0.35 个时间单位后，与稳态的差距减半。这与离散版本的 <code>0.8<sup>t</sup></code> 是同一件事的两种时间刻度。' },

    { t: 'p', html: '连续与离散的对应：离散的 <code>a</code> 对应连续的 <code>e<sup>−aΔt</sup></code>。离散里 <code>|a| &lt; 1</code> 收敛，对应连续里 <code>a &gt; 0</code> 收敛。考试如果同时出现两种形式，先认清「时间单位」：离散是一期一期，连续是瞬时变化率。' },

    { t: 'p', html: '经济应用：价格调整模型 <code>dp/dt = k(D(p) − S(p))</code>——价格按超额需求调整，<code>k &gt; 0</code> 是调整速度。若需求向下、供给向上，线性化后得到 <code>dp/dt + a p = b</code> 的形式，<code>a &gt; 0</code> 保证价格回到均衡。若供给曲线向后弯（如劳动供给在高工资时反而减少），<code>a</code> 可能变号，价格就会远离均衡。' },

    { t: 'h', lvl: 2, text: '八、蛛网模型与价格波动', id: 'ch07-8' },

    { t: 'p', html: '<b>蛛网模型（cobweb model）</b>把「供给滞后」写进差分方程：本期需求看本期价格 <code>Q<sup>d</sup><sub>t</sub> = 100 − 2P<sub>t</sub></code>，本期供给看上期价格 <code>Q<sup>s</sup><sub>t</sub> = 20 + 3P<sub>t−1</sub></code>，市场出清 <code>Q<sup>d</sup><sub>t</sub> = Q<sup>s</sup><sub>t</sub></code>。代入得 <code>100 − 2P<sub>t</sub> = 20 + 3P<sub>t−1</sub></code>，即 <code>P<sub>t</sub> = 40 − 1.5P<sub>t−1</sub></code>。' },

    { t: 'p', html: '稳态：<code>P = 40 − 1.5P</code> 给 <code>2.5P = 40</code>，<code>P* = 16</code>，与 ch00 的静态均衡一致。但动态系数 <code>a = −1.5</code>，<code>|a| &gt; 1</code>，所以价格<b>振荡发散</b>：16 → 16 → 若从 <code>P<sub>0</sub> = 20</code> 出发，<code>P<sub>1</sub> = 10</code>、<code>P<sub>2</sub> = 25</code>、<code>P<sub>3</sub> = 2.5</code>、<code>P<sub>4</sub> = 36.25</code>，振幅越来越大。' },

    { t: 'p', html: '稳定性条件：把 <code>P<sub>t</sub> = α − βP<sub>t−1</sub></code> 与供需斜率联系起来，<code>β = −(供给斜率)/(需求斜率) = 3/2</code>。收敛要求 <code>β &lt; 1</code>，即供给曲线比需求曲线<b>更陡</b>（供给对价格更不敏感）。本例供给斜率 3 大于需求斜率绝对值 2，所以发散。' },

    { t: 'p', html: '政策含义：农产品供给周期长（供给对价格不敏感、曲线陡），容易发散；若政府建立缓冲库存、或让供给更快响应价格（缩短生产周期、改善信息），就相当于把 β 压到 1 以下，价格波动会收敛。这就是「蛛网模型」在农业政策里的经典应用。' },

    { t: 'p', html: '把本章串起来：拉格朗日解决「约束下的静态最优」，乘子给出「放松约束的价值」；差分方程解决「跨期演化」，稳定性条件给出「会不会回到均衡」。两者合起来，就是经济分析里最常见的两类问题——<b>选择</b>与<b>调整</b>。' },

    { t: 'callout', kind: 'exam', title: '约束优化与动态题的检查清单', html: '① 约束写对了吗（预算、产能、产量）？② 拉格朗日符号一致吗？③ 一阶条件是否解出比例再代约束？④ λ 的数值与单位读对了吗？⑤ 内点解还是角点解，二阶条件需要吗？⑥ 差分方程先求稳态，再看 <code>|a|</code> 与符号；⑦ 最后用一句话解释经济含义。' },

    { t: 'terms', items: [
      { en: 'Lagrange multiplier', zh: '拉格朗日乘子', html: '构造 <code>L = f + λ(c − g)</code> 时引入的 λ，等于约束的边际价值。' },
      { en: 'shadow price', zh: '影子价格', html: '约束放松一单位带来的目标改善，即 <code>λ = dU*/dc</code>。' },
      { en: 'tangency condition', zh: '相切条件', html: '<code>MRS = p<sub>x</sub>/p<sub>y</sub></code>，等值线与约束曲线斜率相等。' },
      { en: 'corner solution', zh: '角点解', html: '最优解在约束端点、某变量取 0，相切条件不适用。' },
      { en: "Cramer's rule", zh: '克莱姆法则', html: '<code>x<sub>i</sub> = det(A<sub>i</sub>)/det(A)</code>，用行列式解线性方程组。' },
      { en: 'difference equation', zh: '差分方程', html: '描述离散序列演化，如 <code>y<sub>t+1</sub> = ay<sub>t</sub> + b</code>。' },
      { en: 'steady state', zh: '稳态', html: '令 <code>y<sub>t+1</sub> = y<sub>t</sub></code> 解出的长期值，<code>y* = b/(1−a)</code>。' },
      { en: 'cobweb model', zh: '蛛网模型', html: '供给滞后一期，价格按 <code>P<sub>t</sub> = α − βP<sub>t−1</sub></code> 演化。' }
    ] },

    { t: 'keypoint', items: [
      { title: '拉格朗日把约束装进目标', html: '<code>L = f + λ(c − g)</code>；一阶条件包含「边际替代率 = 价格比」与约束本身。' },
      { title: '相切条件是必要条件', html: '每个内点最优都满足 <code>MU<sub>x</sub>/p<sub>x</sub> = MU<sub>y</sub>/p<sub>y</sub></code>；不满足就有改进空间。' },
      { title: 'λ 是影子价格', html: '收入 100→101 时 <code>U</code> 从 250 增到约 255，<code>λ = 5</code>；成本问题里 λ 是边际成本。' },
      { title: 'Cramer 法则用于比较静态', html: '<code>det = −5</code> 的方程组解出 <code>x=3, y=2</code>；<code>det = 0</code> 时约束不独立。' },
      { title: '差分方程先求稳态再看 |a|', html: '<code>y<sub>t+1</sub> = 0.8y<sub>t</sub> + 20</code> 收敛到 100；<code>|a| &gt; 1</code> 发散，<code>a &lt; 0</code> 振荡。' },
      { title: '蛛网发散的条件是供给更陡', html: '<code>P<sub>t</sub> = 40 − 1.5P<sub>t−1</sub></code>，<code>|−1.5| &gt; 1</code>；供给斜率 3 大于需求斜率绝对值 2。' }
    ] },

    { t: 'checklist', id: 'ch07', items: [
      '我能写出预算约束下 <code>U = xy</code> 的拉格朗日函数并解出 <code>x=25, y=10</code>',
      '我能说明 <code>y/x = p<sub>x</sub>/p<sub>y</sub></code> 与相切条件是同一件事',
      '我能用 <code>λ = 5</code> 解释「收入增加 1 元，效用约增 5」并核对数值',
      '我能把 Cobb-Douglas 效用 <code>U = x<sup>a</sup>y<sup>b</sup></code> 的解写成支出份额形式',
      '我能判断 <code>U = x + 2y</code> 在 <code>p<sub>x</sub>=2, p<sub>y</sub>=3</code> 下的角点解',
      '我能构造成本最小化问题并解出 <code>L=150, K=66.67, C=1200</code>',
      '我能用 Cramer 法则解 <code>2x+3y=12, x−y=1</code> 并说明 det=0 的含义',
      '我能求 <code>y<sub>t+1</sub>=0.8y<sub>t</sub>+20</code> 的稳态与通解，并判断收敛',
      '我能写出蛛网模型的价格递推式，并用斜率比较判断发散'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应《Essential Mathematics for Economic Analysis》（第 5 版）的约束优化与动态部分：拉格朗日乘子法、相切条件、影子价格、加边 Hessian 与角点解、线性方程组与 Cramer 法则、一阶差分方程、一阶线性微分方程与蛛网模型。效用与成本的数值为本站设定，用于把「乘子 = 影子价格」「供给更陡则蛛网发散」两个结论算实。全书八章到此收束：ch00 的均衡、ch01–ch02 的函数与代数、ch03–ch05 的微分与积分、ch06–ch07 的多元与动态，构成一套完整的经济分析工具箱。' }
  ]
});
