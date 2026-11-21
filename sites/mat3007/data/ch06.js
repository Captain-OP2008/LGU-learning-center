/* =====================================================================
 * ch06.js · 第 6 章「无约束优化算法：沿着梯度往下走」
 * 职责：梯度下降与步长选择、收敛率与条件数、牛顿法与拟牛顿、信赖域、
 *       停止准则与算法选择，配合可运行的 NumPy/CVXPY 片段。
 * 依据：MAT3007 教材第 6 章（无约束最小化、梯度与牛顿方法）。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch06',
  num: '06',
  title: '无约束优化算法：沿着梯度往下走',
  en: 'UNCONSTRAINED MINIMIZATION',
  goals: [
    '写出梯度下降迭代，并用回溯线搜索选出一个保证下降的步长',
    '说明 <code>O(1/k)</code> 与线性收敛各自需要什么假设，条件数如何影响迭代次数',
    '写出牛顿方向与牛顿减量，解释为什么它具备仿射不变性与局部二次收敛',
    '说明 BFGS 如何用梯度差近似 Hessian，以及它比牛顿法省在哪里',
    '为一类具体问题（光滑/非光滑、大规模/小规模）选出合适的算法并给出停止准则'
  ],
  kp: [
    { id: 'ch06-1', title: '梯度下降' },
    { id: 'ch06-2', title: '步长与线搜索' },
    { id: 'ch06-3', title: '收敛速度与条件数' },
    { id: 'ch06-4', title: '牛顿法' },
    { id: 'ch06-5', title: '拟牛顿法' },
    { id: 'ch06-6', title: '信赖域方法' },
    { id: 'ch06-7', title: '停止准则' },
    { id: 'ch06-8', title: '算法怎么选' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么先读这一章', html: '第 4 章告诉我们「最优解长什么样」，第 5 章告诉我们「怎么验证它」。这一章回答最后一个问题：<b>怎么算出来</b>。现实中的凸优化问题动辄上万维，没有闭式解，只能迭代逼近。你会在这一章看到：同样是「往下走」，选不同的方向和步长，迭代次数能差三四个数量级；而条件数、光滑性这些看起来抽象的性质，直接决定了算法在你的数据上跑十分钟还是十小时。' },

    { t: 'p', lead: true, html: '考虑无约束问题 <code>min f(x)</code>，<code>x ∈ ℝ<sup>n</sup></code>，<code>f</code> 二阶可微且下有界。所有迭代法的骨架都一样：<code>x<sub>k+1</sub> = x<sub>k</sub> + t<sub>k</sub>d<sub>k</sub></code>，其中 <code>d<sub>k</sub></code> 是<b>搜索方向</b>，<code>t<sub>k</sub> &gt; 0</code> 是<b>步长</b>。区别只在两点：方向怎么选，步长怎么定。' },

    { t: 'h', lvl: 2, text: '一、梯度下降', id: 'ch06-1' },

    { t: 'p', html: '取 <code>d<sub>k</sub> = −∇f(x<sub>k</sub>)</code>，就是<b>梯度下降</b>（gradient descent）。理由是<b>最速下降</b>：在所有单位方向里，<code>−∇f</code> 使方向导数 <code>∇f<sup>T</sup>d</code> 最小。把 <code>f</code> 在 <code>x<sub>k</sub></code> 处一阶展开：<code>f(x<sub>k</sub> + t d) ≈ f(x<sub>k</sub>) + t∇f<sup>T</sup>d</code>，只要 <code>∇f<sup>T</sup>d &lt; 0</code> 且 <code>t</code> 足够小，函数值就下降。所以 <code>d</code> 称为<b>下降方向</b>的判据就是 <code>∇f<sup>T</sup>d &lt; 0</code>。' },

    { t: 'p', html: '梯度下降的几何图像是「沿等高线的法向走」。在狭长的山谷里，法向几乎垂直于山谷轴线，于是迭代在两侧来回横跳，每步只前进一点点——这就是著名的<b>锯齿现象</b>（zigzagging）。它不是实现 bug，而是方法本身的性质：梯度只含一阶信息，看不到「山谷有多长」。第 3 节的收敛率会精确量化这件事。' },

    { t: 'p', html: '写一个最小实现只需三行：' },

    { t: 'code', lang: 'python', caption: '朴素梯度下降（固定步长）', code: `import numpy as np

def grad_descent(f, grad, x0, t=0.1, iters=1000, tol=1e-8):
    x = np.array(x0, dtype=float)
    for k in range(iters):
        g = grad(x)
        if np.linalg.norm(g) <= tol:
            break
        x = x - t * g
    return x, f(x), k

# 例：f(x) = 0.5 * (x1^2 + 100 * x2^2)
f    = lambda x: 0.5 * (x[0]**2 + 100 * x[1]**2)
grad = lambda x: np.array([x[0], 100 * x[1]])
x, fx, k = grad_descent(f, grad, [1.0, 1.0], t=0.01)
print(k, x, fx)`},

    { t: 'p', html: '这个例子里 <code>L = 100</code>（最大曲率），若取 <code>t = 1/L = 0.01</code>，<code>x<sub>1</sub></code> 方向每步只缩小 <code>1%</code>，要走一千多步才能把误差从 1 降到 <code>10<sup>−6</sup></code>。同时 <code>x<sub>2</sub></code> 方向一步就到位。这就是「条件数差」的直接代价：同一个步长，对不同方向的效果天差地别。' },

    { t: 'callout', kind: 'warn', title: '步长太大会发散', html: '对 <code>f = ½x<sup>T</sup>Qx</code>，迭代是 <code>x<sub>k+1</sub> = (I − tQ)x<sub>k</sub></code>。收敛当且仅当所有 <code>|1 − tλ<sub>i</sub>(Q)| &lt; 1</code>，即 <code>0 &lt; t &lt; 2/λ<sub>max</sub>(Q)</code>。取 <code>t = 2/λ<sub>max</sub></code> 会振荡不收敛，超过就发散到无穷。所以固定步长必须知道 <code>L</code>，否则要用线搜索。' },

    { t: 'h', lvl: 2, text: '二、步长与线搜索', id: 'ch06-2' },

    { t: 'p', html: '实际代码里几乎不用固定步长，而是<b>回溯线搜索</b>（backtracking line search）：从一个较大的初始步长开始，只要下降量不够就按比例缩小。判据用 <b>Armijo 条件</b>：<code>f(x + t d) ≤ f(x) + α t ∇f<sup>T</sup>d</code>，常取 <code>α ∈ (0, 0.5)</code>，例如 <code>α = 0.3</code>；缩小系数 <code>β ∈ (0, 1)</code>，例如 <code>β = 0.5</code>。' },

    { t: 'p', html: 'Armijo 条件有两层意思：右边是「按一阶预测应有的下降量」的 <code>α</code> 折扣，所以它要求<b>实际下降至少达到预测下降的一个固定比例</b>。<code>α</code> 越小越容易满足，但步长会偏大、可能跳过最优点；<code>α</code> 接近 0.5 更保守。实践中最常用的组合是 <code>α = 0.3</code>、<code>β = 0.5</code>，几乎所有教材实现都这么写。' },

    { t: 'code', lang: 'python', caption: '回溯线搜索（Armijo）', code: `def backtrack(f, grad, x, d, alpha=0.3, beta=0.5, t0=1.0):
    t = t0
    fx, gTd = f(x), grad(x) @ d
    while f(x + t * d) > fx + alpha * t * gTd:
        t *= beta
    return t

# 梯度法主循环
def gd_armijo(f, grad, x0, iters=500, tol=1e-8):
    x = np.array(x0, dtype=float)
    for k in range(iters):
        g = grad(x)
        if np.linalg.norm(g) <= tol:
            break
        d = -g
        t = backtrack(f, grad, x, d)
        x = x + t * d
    return x, k`},

    { t: 'p', html: '回溯线搜索有一个漂亮的保证：若 <code>∇f</code> 是 <code>L</code>-Lipschitz 的（即 <code>||∇f(x) − ∇f(y)|| ≤ L||x − y||</code>，等价于 Hessian 的特征值不超过 <code>L</code>），则回溯终止时必有 <code>t ≥ min(1, β/L)</code>，且每步下降量满足 <code>f(x<sub>k+1</sub>) ≤ f(x<sub>k</sub>) − α t ||∇f(x<sub>k</sub>)||<sup>2</sup></code>。也就是说，<b>线搜索不会退化到「几乎不动」</b>，这是收敛性证明的关键引理。' },

    { t: 'p', html: '还存在 <b>Wolfe 条件</b>（同时要求 Armijo 与曲率条件 <code>∇f(x+td)<sup>T</sup>d ≥ c<sub>2</sub>∇f<sup>T</sup>d</code>），用于拟牛顿法保证 <code>y<sup>T</sup>s &gt; 0</code>、从而 Hessian 近似保持正定。只做回溯不满足曲率条件，BFGS 的更新公式可能失去正定性——这是实现拟牛顿法时最容易踩的坑。' },

    { t: 'quiz', qid: 'ch06-q1' },

    { t: 'h', lvl: 2, text: '三、收敛速度与条件数', id: 'ch06-3' },

    { t: 'p', html: '评价算法看好不好，核心指标是<b>收敛速度</b>：误差随迭代次数怎么衰减。设 <code>f</code> 凸、<code>∇f</code> 为 <code>L</code>-Lipschitz，取 <code>t = 1/L</code>，则 <code>f(x<sub>k</sub>) − f* ≤ L||x<sub>0</sub> − x*||<sup>2</sup> / (2k)</code>。这是 <code>O(1/k)</code>（次线性）收敛：每多十倍迭代，误差只降一个数量级，精度要求每提高一位就要多十倍的迭代。' },

    { t: 'p', html: '若 <code>f</code> 还是 <code>m</code>-强凸的（<code>∇<sup>2</sup>f ⪰ mI</code>，<code>m &gt; 0</code>），则有<b>线性收敛</b>：<code>||x<sub>k</sub> − x*|| ≤ (1 − m/L)<sup>k/2</sup>||x<sub>0</sub> − x*||</code>。注意底数小于 1，误差按几何级数衰减，这才是我们想要的。<b>比值 <code>κ = L/m</code> 就是条件数</b>：<code>κ = 1</code> 时一步到位，<code>κ</code> 越大收敛越慢。' },

    { t: 'table', caption: '梯度下降的迭代次数如何随条件数增长', head: ['条件数 κ', '收敛因子 <code>1 − 1/κ</code>', '降到 10<sup>−6</sup> 所需迭代（约）'], rows: [
      ['10', '0.90', '约 130 次'],
      ['100', '0.99', '约 1380 次'],
      ['10³', '0.999', '约 1.4 万次'],
      ['10⁶', '0.999999', '约 1400 万次']
    ] },

    { t: 'p', html: '这张表解释了为什么「梯度下降能跑但很慢」。更精确的结论是：迭代次数约为 <code>κ·ln(1/ε)</code>，其中 <code>ε</code> 是目标精度。所以对病态问题（<code>κ</code> 很大），一阶方法的成本随条件数线性增长，而牛顿法几乎与 <code>κ</code> 无关。<b>条件数不是一个抽象指标，它就是运行时间</b>。' },

    { t: 'p', html: '怎么改善？三种常见手段：<b>① 预处理</b>（preconditioning），换变量 <code>x = Pz</code>，使新问题的 Hessian 更接近单位阵；<b>② 加速</b>，如 Nesterov 动量，把 <code>O(1/k)</code> 改进到 <code>O(1/k<sup>2</sup>)</code>（这是凸光滑问题的一阶最优速率）；<b>③ 换二阶信息</b>，直接用牛顿法或拟牛顿法。' },

    { t: 'p', html: '对偶问题在这里又出现了一次：原问题条件数差，往往意味着对偶问题条件数好，反之亦然。第 7 章的原始-对偶方法正是利用这一点，同时在两边上做迭代。' },

    { t: 'h', lvl: 2, text: '四、牛顿法', id: 'ch06-4' },

    { t: 'p', html: '牛顿法用二阶近似代替一阶近似：在当前点展开到二次项 <code>f(x + v) ≈ f(x) + ∇f<sup>T</sup>v + ½v<sup>T</sup>∇<sup>2</sup>f v</code>，令导数为零得 <b>牛顿方向</b> <code>Δx<sub>nt</sub> = −(∇<sup>2</sup>f)<sup>−1</sup>∇f</code>。迭代形式是 <code>x<sub>k+1</sub> = x<sub>k</sub> + t<sub>k</sub>Δx<sub>nt</sub></code>，<code>t<sub>k</sub> = 1</code> 时称<b>纯牛顿步</b>。' },

    { t: 'p', html: '两个必须记住的性质。<b>① 仿射不变性</b>：对 <code>x</code> 做可逆线性变换，牛顿迭代的轨迹不变（梯度法会变）。这意味着牛顿法对问题的「尺度」不敏感，不需要手工调步长。<b>② 局部二次收敛</b>：在最优解附近且 Hessian 正定时，<code>||x<sub>k+1</sub> − x*|| ≤ C||x<sub>k</sub> − x*||<sup>2</sup></code>，误差每步「平方」，有效数字翻倍。' },

    { t: 'p', html: '牛顿方向一定是下降方向，因为 <code>∇f<sup>T</sup>Δx<sub>nt</sub> = −∇f<sup>T</sup>(∇<sup>2</sup>f)<sup>−1</sup>∇f = −λ(x)<sup>2</sup> &lt; 0</code>，其中 <code>λ(x)<sup>2</sup> = ∇f<sup>T</sup>(∇<sup>2</sup>f)<sup>−1</sup>∇f</code> 叫<b>牛顿减量</b>（Newton decrement）。它不只是个记号：<code>λ(x)<sup>2</sup>/2</code> 是 <code>f(x) − f*</code> 的一个可计算估计，所以 <code>λ(x)<sup>2</sup>/2 ≤ ε</code> 是一个有理论依据的停止准则。' },

    { t: 'p', html: '远离最优解时纯牛顿步可能发散或越过，所以实践中用<b>阻尼牛顿法</b>（damped Newton）：沿 <code>Δx<sub>nt</sub></code> 做回溯线搜索。理论上它分两个阶段：前期每次迭代把 <code>f(x) − f*</code> 减少至少一个固定量（线性阶段），进入邻域后自动切换到二次收敛（二次阶段）。总迭代次数约为 <code>(f(x<sub>0</sub>) − f*)/γ + ln ln(1/ε)</code>，其中 <code>γ</code> 是与问题有关的常数。' },

    { t: 'table', caption: '梯度法与牛顿法的对比', head: ['维度', '梯度下降', '牛顿法'], rows: [
      ['每步代价', '<code>O(n)</code>', '<code>O(n<sup>3</sup>)</code> 解线性系统 + <code>O(n<sup>2</sup>)</code> 组装 Hessian'],
      ['迭代次数', '约 <code>κ ln(1/ε)</code>', '约 <code>常数 + ln ln(1/ε)</code>'],
      ['条件数敏感', '是', '基本无关'],
      ['尺度不变性', '否，需要调步长', '是（仿射不变）'],
      ['适用规模', '大规模（<code>n</code> 上百万也可）', '中小规模（<code>n</code> 几百到几千）'],
      ['需要的信息', '一阶梯度', '二阶 Hessian']
    ] },

    { t: 'callout', kind: 'exam', title: '考试常问的三个点', html: '① 为什么牛顿方向是下降方向——用 <code>∇f<sup>T</sup>Δx<sub>nt</sub> = −λ<sup>2</sup> &lt; 0</code> 回答；② 牛顿法为什么在二次函数上一步收敛——因为二次近似就是函数本身；③ 为什么大规模问题不用牛顿法——Hessian 是 <code>n×n</code>，<code>n = 10<sup>5</sup></code> 时存不下也解不动。' },

    { t: 'h', lvl: 2, text: '五、拟牛顿法', id: 'ch06-5' },

    { t: 'p', html: '牛顿法的瓶颈是 <code>O(n<sup>3</sup>)</code> 的线性求解与 <code>O(n<sup>2</sup>)</code> 的 Hessian 存储。<b>拟牛顿法</b>（quasi-Newton）的想法是：不精确算 Hessian，而是用迭代中积累的梯度差去「学习」它。记 <code>s<sub>k</sub> = x<sub>k+1</sub> − x<sub>k</sub></code>、<code>y<sub>k</sub> = ∇f(x<sub>k+1</sub>) − ∇f(x<sub>k</sub>)</code>，要求近似矩阵 <code>B<sub>k+1</sub></code> 满足<b>割线方程</b> <code>B<sub>k+1</sub>s<sub>k</sub> = y<sub>k</sub></code>。一个方程定不下整个矩阵，于是再加「改动最小」的准则，得到不同的更新公式。' },

    { t: 'p', html: '最成功的公式是 <b>BFGS</b>（Broyden–Fletcher–Goldfarb–Shanno），对逆 Hessian 的近似 <code>H<sub>k</sub></code> 有：<code>H<sub>k+1</sub> = (I − ρ s y<sup>T</sup>)H<sub>k</sub>(I − ρ y s<sup>T</sup>) + ρ s s<sup>T</sup></code>，其中 <code>ρ = 1/(y<sup>T</sup>s)</code>。只要 <code>y<sup>T</sup>s &gt; 0</code>（曲率条件成立时必然如此），更新后的 <code>H</code> 保持正定，搜索方向 <code>−H∇f</code> 就是下降方向。' },

    { t: 'p', html: 'BFGS 每步只做两次秩一修正，代价 <code>O(n<sup>2</sup>)</code>，且收敛速度是<b>超线性</b>的（介于线性与二次之间，通常 10–20 步就到高精度）。它的内存还可以进一步压：<b>L-BFGS</b> 只保存最近 <code>m</code> 组 <code>(s, y)</code>（常取 <code>m = 5~20</code>），用两次循环递推算 <code>H∇f</code>，内存降到 <code>O(nm)</code>，是机器学习里最常用的「几乎免费的牛顿法」。' },

    { t: 'compare', title: '牛顿法 vs BFGS', left: { head: '牛顿法', items: [
      '需要精确 Hessian，可能算不出来或很贵',
      '每步 <code>O(n<sup>3</sup>)</code>，<code>n &gt; 5000</code> 基本不可行',
      '局部二次收敛，理论最漂亮',
      '要求 Hessian 正定，否则方向不一定下降'
    ] }, right: { head: 'BFGS / L-BFGS', items: [
      '只要梯度，通用性强',
      '每步 <code>O(n<sup>2</sup>)</code>，L-BFGS 降到 <code>O(nm)</code>',
      '超线性收敛，比梯度法快得多',
      '需配合 Wolfe 线搜索保持正定'
    ] } },

    { t: 'quiz', qid: 'ch06-q2' },

    { t: 'h', lvl: 2, text: '六、信赖域方法', id: 'ch06-6' },

    { t: 'p', html: '线搜索先定方向、再定步长；<b>信赖域</b>（trust region）反过来：先定一个「我信得过二次模型的半径」<code>Δ<sub>k</sub></code>，再在这个球里求模型的最小点：<code>min<sub>p</sub> m<sub>k</sub>(p) = f<sub>k</sub> + ∇f<sub>k</sub><sup>T</sup>p + ½p<sup>T</sup>B<sub>k</sub>p</code>，<code>s.t. ||p|| ≤ Δ<sub>k</sub></code>。半径根据「预测下降」与「实际下降」的比值调整：比值接近 1 就扩大半径，接近 0 或为负就缩小。' },

    { t: 'p', html: '信赖域的好处是它有一个明确的「模型可信度」概念。在线搜索里，如果方向几乎垂直于梯度（病态情形），回溯会把步长压到极小，进展缓慢；信赖域则会在方向不好时自然转向「沿负梯度走到边界」，兼顾方向与长度。牛顿法的强收敛性与梯度法的稳健性，在信赖域框架里被统一起来了。' },

    { t: 'p', html: '子问题 <code>min m(p)</code>、<code>||p|| ≤ Δ</code> 有闭式的近似解法（dogleg、截断共轭梯度）。其中 <code>||p|| = Δ</code> 时的最优解满足 <code>(B + μI)p = −g</code>、<code>μ ≥ 0</code>——这个形式你会在第 7 章的对数障碍与 Levenberg–Marquardt 方法里再次遇到，它们本质上是同一个数学结构。' },

    { t: 'h', lvl: 2, text: '七、停止准则', id: 'ch06-7' },

    { t: 'p', html: '「迭代到收敛」这句话在代码里必须翻译成可判定的条件。常见的四类：<b>① 梯度范数</b> <code>||∇f(x<sub>k</sub>)|| ≤ ε</code>（最常用，因为 <code>∇f = 0</code> 是必要条件）；<b>② 步长或位移</b> <code>||x<sub>k+1</sub> − x<sub>k</sub>|| ≤ ε</code>（简单，但缩放敏感）；<b>③ 目标值变化</b> <code>|f(x<sub>k+1</sub>) − f(x<sub>k</sub>)| ≤ ε</code>（适合平缓区域，但可能过早停止）；<b>④ 对偶间隙</b> <code>f(x) − g(λ) ≤ ε</code>（有约束时唯一有绝对意义的准则）。' },

    { t: 'p', html: '相对化很重要。绝对阈值 <code>ε = 10<sup>−6</sup></code> 对目标值在 0 附近的问题是合理的，对目标值在 <code>10<sup>9</sup></code> 量级的问题则过于严格（浮点误差都不止这么大），对 <code>10<sup>−8</sup></code> 量级的问题又太宽松。实践中用相对形式：<code>||∇f|| ≤ ε(1 + |f|)</code>，或按变量尺度归一化。' },

    { t: 'p', html: '还有几个必须设的保险：<b>最大迭代次数</b>（防止死循环）、<b>步长下界</b>（步长缩到机器精度以下说明已经卡住）、<b>非有限值检查</b>（<code>NaN</code> 沿 <code>NaN</code> 传播，会静默污染全部输出）。在非凸问题里，梯度为零也可能只是鞍点或局部极小，此时「收敛」的语义要写清楚：是收敛到驻点，不是收敛到全局最优。' },

    { t: 'p', html: '一个实用的习惯：<b>每 100 步打印一次 <code>f</code>、<code>||∇f||</code>、步长</b>。正常运行的曲线应该是单调下降、梯度平滑减小；若 <code>f</code> 上下抖动，几乎一定是步长太大或线搜索写错了；若 <code>f</code> 完全不动而梯度不小，多半是步长被压到零、或方向算错（比如忘了负号）。' },

    { t: 'quiz', qid: 'ch06-q3' },

    { t: 'h', lvl: 2, text: '八、算法怎么选', id: 'ch06-8' },

    { t: 'p', html: '没有「最好的算法」，只有「匹配问题结构的算法」。下面的决策顺序在实践中很管用：先看目标是否光滑，再看维数与精度要求，最后看能不能拿到二阶信息。' },

    { t: 'steps', items: [
      { title: '① 光滑 ?', html: '不光滑（含 <code>||x||<sub>1</sub></code>、<code>max</code>、指示函数）→ 次梯度法（<code>O(1/√k)</code>，慢但通用）或近端梯度/ADMM（利用结构，见第 7 章）。' },
      { title: '② 维数？', html: '小规模（<code>n ≤ 1000</code>）且要极高精度 → 牛顿法（阻尼 + 线搜索），几轮到几十轮就到机器精度。' },
      { title: '③ 中大规模？', html: '<code>10<sup>3</sup> ≤ n ≤ 10<sup>6</sup></code> → L-BFGS，20 轮左右通常已很好；有结构（稀疏、低秩）时用专门方法。' },
      { title: '④ 要在线 / 单机内存不够？', html: '随机梯度或小批量方法；并行/分布式时考虑 ADMM。' },
      { title: '⑤ 兜底', html: '先用梯度下降 + 回溯线搜索跑通逻辑，再换更快的算法；把两者结果对齐，是验证实现最快的方式。' }
    ] },

    { t: 'table', caption: '常见无约束算法速查', head: ['算法', '收敛速度', '每步代价', '典型场景'], rows: [
      ['梯度下降', '<code>O(1/k)</code> 或线性（强凸）', '<code>O(n)</code>', '教学基线、大规模、深度学习'],
      ['Nesterov 加速', '<code>O(1/k<sup>2</sup>)</code>', '<code>O(n)</code>', '凸光滑、需要中等精度'],
      ['次梯度法', '<code>O(1/√k)</code>', '<code>O(n)</code>', '非光滑、对偶分解'],
      ['牛顿法', '局部二次', '<code>O(n<sup>3</sup>)</code>', '中小规模、高精度'],
      ['L-BFGS', '超线性', '<code>O(nm)</code>', '大规模光滑、逻辑回归'],
      ['近端梯度', '线性（强凸）/ <code>O(1/k)</code>', '<code>O(n)</code> + 近端算子', 'Lasso、稀疏正则']
    ] },

    { t: 'p', html: '再看一个「用结构换速度」的例子。Lasso 问题 <code>min ½||Ax − b||<sup>2</sup> + μ||x||<sub>1</sub></code> 不光滑，梯度法用不上；但它可以拆成光滑项加简单非光滑项，用<b>近端梯度</b>（ISTA）：<code>x<sub>k+1</sub> = S<sub>μt</sub>(x<sub>k</sub> − tA<sup>T</sup>(Ax<sub>k</sub> − b))</code>，其中 <code>S</code> 是软阈值算子 <code>S<sub>τ</sub>(z) = sign(z)·max(|z| − τ, 0)</code>。每步只做矩阵乘与逐元素阈值，几十行代码就能到可用精度，这是第 7 章「算子分裂」思想的入门版。' },

    { t: 'callout', kind: 'tip', title: '调参的实用建议', html: '先用 <code>t = 1/L</code>（若知道 <code>L</code>）或回溯线搜索，不要在固定步长上反复手调。若 L-BFGS 不收敛，先检查线搜索是否满足 Wolfe 条件，再检查梯度是否写错（用有限差分 <code>(f(x+he) − f(x−he))/(2h)</code> 对照最可靠）。' },

    { t: 'terms', items: [
      { en: 'gradient descent', zh: '梯度下降', html: '沿负梯度方向迭代 <code>x<sub>k+1</sub> = x<sub>k</sub> − t∇f</code>。' },
      { en: 'backtracking line search', zh: '回溯线搜索', html: '从大步长开始按 <code>β</code> 缩小，直到满足 Armijo 条件。' },
      { en: 'Armijo condition', zh: 'Armijo 条件', html: '实际下降 ≥ 一阶预测下降的 <code>α</code> 倍。' },
      { en: 'strong convexity', zh: '强凸性', html: '<code>∇<sup>2</sup>f ⪰ mI</code>，<code>m &gt; 0</code>；保证线性收敛。' },
      { en: 'condition number', zh: '条件数', html: '<code>κ = L/m</code>，决定一阶方法的迭代次数。' },
      { en: 'Newton decrement', zh: '牛顿减量', html: '<code>λ<sup>2</sup> = ∇f<sup>T</sup>(∇<sup>2</sup>f)<sup>−1</sup>∇f</code>，可作停止判据。' },
      { en: 'quasi-Newton', zh: '拟牛顿法', html: '用梯度差近似 Hessian，BFGS 是最常用的一种。' },
      { en: 'trust region', zh: '信赖域', html: '在半径 <code>Δ</code> 的球内最小化二次模型，按实际/预测下降比调整半径。' }
    ] },

    { t: 'keypoint', items: [
      { title: '步长决定成败', html: '固定步长要 <code>t &lt; 2/λ<sub>max</sub></code>；实用做法是回溯线搜索，理论保证 <code>t ≥ min(1, β/L)</code>。' },
      { title: '收敛率分两档', html: '凸 + Lipschitz 梯度 → <code>O(1/k)</code>；再加强凸 → 线性收敛，速率由 <code>κ = L/m</code> 决定。' },
      { title: '牛顿法赢在条件数无关', html: '仿射不变 + 局部二次收敛，代价是每步 <code>O(n<sup>3</sup>)</code> 与需要正定 Hessian。' },
      { title: '拟牛顿是工程折中', html: 'BFGS 超线性、<code>O(n<sup>2</sup>)</code>；L-BFGS 降到 <code>O(nm)</code>，成为大规模默认选择。' },
      { title: '停止准则要相对化', html: '<code>||∇f|| ≤ ε(1+|f|)</code>；有约束时优先用对偶间隙。' },
      { title: '算法匹配结构', html: '非光滑走近端/次梯度，大规模走 L-BFGS，高精度小规模走牛顿法。' }
    ] },

    { t: 'checklist', id: 'ch06', items: [
      '我能写出梯度下降迭代，并说明为什么负梯度是最速下降方向',
      '我能实现回溯线搜索，并说出 <code>α</code>、<code>β</code> 的作用',
      '我能写出 <code>O(1/k)</code> 与线性收敛的假设与速率',
      '我能用条件数估算梯度下降需要多少轮迭代',
      '我能写出牛顿方向，并证明它是下降方向',
      '我能解释牛顿法为什么仿射不变、为什么局部二次收敛',
      '我能写出 BFGS 更新公式，并说明 <code>y<sup>T</sup>s &gt; 0</code> 的作用',
      '我能说出信赖域与线搜索的区别与各自优势',
      '我能为「非光滑 + 大规模」的问题选出合适算法',
      '我能设计一组有意义的停止准则，并解释为什么要相对化'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 MAT3007 教材第 6 章「无约束最小化」组织：梯度下降与最速下降、回溯线搜索与 Armijo 条件、<code>O(1/k)</code> 与强凸下的线性收敛、条件数对迭代次数的影响、牛顿方向与牛顿减量、阻尼牛顿法、BFGS/L-BFGS、信赖域框架、停止准则与算法选择。收敛率陈述均以「<code>f</code> 凸且 <code>∇f</code> 为 <code>L</code>-Lipschitz」为基准假设，强凸版本另加 <code>m &gt; 0</code>。次梯度法与近端梯度只作入门铺垫，细节留给第 7 章。考核范围以当学期 syllabus 与作业为准。' }
  ]
});
