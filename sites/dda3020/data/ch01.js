/* =====================================================================
 * ch01.js · 第 1 章「数学基础：概率、线性代数与优化」
 * 职责：给后面所有模型准备三套语言——概率（不确定性）、线性代数（几何）、
 *       优化（怎么把损失压下去），并在最后一节把三者合成一个最小例子。
 * 依据：DDA3020 Lecture 02 Probability、Lecture 03 Linear Algebra、
 *       Lecture 04 Optimization。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch01',
  num: '01',
  title: '数学基础：概率、线性代数与优化',
  en: 'PROBABILITY, LINEAR ALGEBRA & OPTIMIZATION',
  goals: [
    '用期望与方差把「噪声有多大」写成可计算的量，并解释方差为什么不能直接相加',
    '从最大似然推出伯努利与高斯的参数估计，说明取对数的两个理由',
    '把最小二乘解释成「把 y 投影到 X 的列空间」，并写出正规方程',
    '判断一个函数是否凸，并用步长与曲率的关系解释梯度下降为什么会发散',
    '写出带约束问题的拉格朗日函数与 KKT 条件，为支持向量机的对偶推导铺路'
  ],
  kp: [
    { id: 'ch01-1', title: '为什么先补三门数学' },
    { id: 'ch01-2', title: '随机变量、期望与方差' },
    { id: 'ch01-3', title: '条件概率、贝叶斯与最大似然' },
    { id: 'ch01-4', title: '内积、投影与矩阵分解' },
    { id: 'ch01-5', title: '梯度、凸性与步长' },
    { id: 'ch01-6', title: '约束优化与 KKT 条件' },
    { id: 'ch01-7', title: '三者合流：一维高斯的最大似然' },
    { id: 'ch01-8', title: '常见错误与自查方法' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么先补三门数学', html: '后面的每一章都在做同一件事：<b>写一个带参数的函数，定义一个损失，然后想办法把它压到最小</b>。概率负责说清「数据为什么是随机的、损失凭什么合理」；线性代数负责说清「参数空间长什么样、解在几何上是什么」；优化负责说清「怎么走到解、走多快、会不会卡住」。三样缺一样，公式就只是符号；三样都有，你看到一个模型就能自己把它推出来。' },

    { t: 'p', lead: true, html: '这一章不追求数学上的完备，只挑后面七章真正会用到的部分。读的时候请始终带着一个问题：<b>这个定义是为了解决什么麻烦才被发明出来的</b>。比如「方差」不是为了折磨人，而是因为均值无法描述「预测有多不稳定」；「凸函数」也不是纯数学概念，它保证梯度下降不会停在局部最优。' },

    { t: 'h', lvl: 2, text: '一、为什么先补三门数学', id: 'ch01-1' },

    { t: 'p', html: '拿一个最简单的任务开刀：根据房屋面积预测价格。你有一百条数据，想找一条直线。这里立刻冒出三个问题。第一，数据里的价格有测量误差、也有没记录的因素（楼层、学区），这部分不确定性怎么描述？——概率。第二，一百条数据可以写成一百个方程，但未知数只有两个，方程组<b>无解</b>；「最接近的解」是什么意思？——线性代数里的投影。第三，怎么真的把这条直线算出来？——优化。' },

    { t: 'p', html: '所以这三门数学不是三门独立的课，而是同一个问题的三个侧面。下面这张表把它们与后续章节的对应关系钉死，你以后遇到不认识的符号，可以回来查它属于哪一侧。' },

    { t: 'table', head: ['数学侧', '核心对象', '在本课的第一个用途', '后续还会用到'], rows: [
      ['概率', '随机变量、分布、期望', '把观测写成 <code>y = f(x) + ε</code>，<code>ε</code> 服从某个分布', '最大似然推损失（ch02）、GMM 的隐变量（ch07）'],
      ['线性代数', '向量、矩阵、内积、特征值', '把 <code>n</code> 个样本堆成矩阵 <code>X</code>，把预测写成 <code>Xw</code>', 'SVM 的对偶（ch03）、PCA（ch07）'],
      ['优化', '梯度、凸性、约束', '最小化残差平方和，得到 <code>w</code>', '逻辑回归的迭代解（ch02）、神经网络的反向传播（ch05）']
    ], caption: '一张表定位：看见新符号，先问它属于哪一侧' },

    { t: 'p', html: '还有一个现实理由：这门课的考试大量考推导。推导题的评分点通常不在最后那个式子，而在<b>你用了哪条性质、在哪一步做了近似、为什么可以交换求和与求导</b>。这些都属于本章的内容。' },

    { t: 'h', lvl: 2, text: '二、随机变量、期望与方差', id: 'ch01-2' },

    { t: 'p', html: '随机变量（random variable）是把「随机试验的结果」映射成数的函数。掷一次骰子，结果是 1 到 6 之一，记 <code>X</code>；一个样本的特征向量有 <code>d</code> 维，记 <code>x ∈ R<sup>d</sup></code>。离散情形用概率质量函数 <code>P(X = x)</code>，连续情形用概率密度 <code>p(x)</code>。这里有个高频错误：<b>密度不是概率</b>。密度可以大于 1（比如方差很小的正态分布在峰值处），而概率必须落在 [0, 1]；连续随机变量取某个具体值的概率是 0，只有落在区间里的概率才有意义。' },

    { t: 'p', html: '期望（expectation）是「按概率加权的平均」，记 <code>E[X] = Σ x·P(x)</code> 或 <code>∫ x·p(x)dx</code>。它有三个性质必须背熟：线性性 <code>E[aX + bY] = aE[X] + bE[Y]</code>（<b>不需要独立</b>）、独立时乘积可拆 <code>E[XY] = E[X]E[Y]</code>、以及 <code>E[g(X)] ≠ g(E[X])</code>（詹森不等式给出方向，凸函数时左边更大）。最后这条是很多错误的源头：<code>E[1/X]</code> 一般不等于 <code>1/E[X]</code>。' },

    { t: 'p', html: '方差（variance）衡量「离均值有多散」，定义为 <code>Var(X) = E[(X - E[X])<sup>2</sup>] = E[X<sup>2</sup>] - (E[X])<sup>2</sup></code>。第二个等号在计算时更好用。它满足 <code>Var(aX + b) = a<sup>2</sup>Var(X)</code>——注意截距 <code>b</code> 不改变方差，缩放要平方。两个随机变量相加时，<code>Var(X + Y) = Var(X) + Var(Y) + 2Cov(X, Y)</code>；只有独立（或至少不相关）时协方差项才为零。凭直觉把方差直接相加，是集成学习那一章最常见的推导错误。' },

    { t: 'code', lang: 'python', caption: '用 numpy 验证 E[X^2] - (E[X])^2 与直接算方差一致', code: `import numpy as np

rng = np.random.default_rng(0)
x = rng.normal(loc=2.0, scale=3.0, size=200000)

print('sample mean      =', x.mean())
print('direct variance  =', x.var())
print('E[X^2] - E[X]^2  =', (x ** 2).mean() - x.mean() ** 2)

# 缩放与平移：Var(2X + 5) 应等于 4 * Var(X)
print('Var(2X+5)        =', (2 * x + 5).var())
print('4 * Var(X)       =', 4 * x.var())` },

    { t: 'p', html: '跑一遍你会发现两组数字在小数点后几位才对得上，差别来自样本量有限。这提醒一件事：<b>样本方差是估计量，不是真值</b>，样本量越大越接近。讲义里出现的 <code>σ<sup>2</sup></code> 常常指真实方差，而代码里的 <code>x.var()</code> 默认除以 <code>n</code>（有偏），<code>ddof=1</code> 才是除以 <code>n-1</code>。考试写公式时用 <code>1/n</code>，做统计推断时用 <code>1/(n-1)</code>，两者别混。' },

    { t: 'h', lvl: 2, text: '三、条件概率、贝叶斯与最大似然', id: 'ch01-3' },

    { t: 'p', html: '条件概率 <code>P(A|B) = P(A ∩ B) / P(B)</code> 回答「已知 B 发生，A 的可能性有多大」。把它反过来用就是贝叶斯公式：<code>P(A|B) = P(B|A)·P(A) / P(B)</code>。四个部件的名字要记牢：<code>P(A)</code> 先验（prior）、<code>P(B|A)</code> 似然（likelihood）、<code>P(A|B)</code> 后验（posterior）、<code>P(B)</code> 证据（evidence，常起归一化作用）。' },

    { t: 'p', html: '这个公式在机器学习里的意义是：<b>它把「模型生成数据的概率」和「看到数据后模型为真的概率」接了起来</b>。朴素贝叶斯分类器直接用它做决策；生成式模型（GMM、VAE）用它做推断；甚至逻辑回归也可以看成对后验概率建模。' },

    { t: 'compare', left: { title: '频率派：参数是固定的未知数', html: '认为 <code>θ</code> 客观存在但不已知，用最大似然 <code>θ̂ = argmax log p(D|θ)</code> 做点估计，再用置信区间描述不确定性。计算简单，样本多时性质好。' }, right: { title: '贝叶斯派：参数是随机变量', html: '认为 <code>θ</code> 本身有先验分布，观测后得到后验 <code>p(θ|D) ∝ p(D|θ)p(θ)</code>，预测时对整个后验积分。小样本时更稳，代价是积分通常算不动，需要近似。' } },

    { t: 'p', html: '最大似然估计（maximum likelihood estimation, MLE）是频率派的核心工具，也是本课推导损失函数的主力。步骤固定：写出似然 <code>L(θ) = ∏ p(x<sub>i</sub>|θ)</code>、取对数变成求和、对 <code>θ</code> 求导令其为零、解出 <code>θ̂</code>。取对数有两个理由：<b>数值上</b>，几百个小于 1 的数相乘会下溢成 0；<b>计算上</b>，乘积求导要用乘法法则，求和求导只需逐项。由于 <code>log</code> 单调递增，argmax 不变，所以这一步完全安全。' },

    { t: 'p', html: '两个必须会手推的结论。伯努利分布 <code>p(x) = θ<sup>x</sup>(1-θ)<sup>1-x</sup></code>，对数似然 <code>ℓ(θ) = Σ[x<sub>i</sub>log θ + (1-x<sub>i</sub>)log(1-θ)]</code>，求导得 <code>θ̂ = (1/n)Σx<sub>i</sub></code>，就是样本里正例的比例。一维高斯 <code>N(μ, σ<sup>2</sup>)</code>，对数似然对 <code>μ</code> 求导得 <code>μ̂ = x̄</code>，对 <code>σ<sup>2</sup></code> 求导得 <code>σ̂<sup>2</sup> = (1/n)Σ(x<sub>i</sub> - x̄)<sup>2</sup></code>。注意后者除以 <code>n</code> 而不是 <code>n-1</code>——MLE 是有偏的，这也是「有偏估计」这个词第一次出现的地方。' },

    { t: 'callout', kind: 'warn', title: '对数似然不是概率', html: '<code>ℓ(θ)</code> 可以是负数、可以任意小，它的绝对值没有意义，只有<b>不同 θ 之间的大小比较</b>有意义。考试里写「对数似然为 -3.2，所以概率是 e<sup>-3.2</sup>」是错的：似然是密度的乘积，不是概率。' },

    { t: 'h', lvl: 2, text: '四、内积、投影与矩阵分解', id: 'ch01-4' },

    { t: 'p', html: '把 <code>n</code> 个样本、<code>d</code> 个特征堆成一个 <code>n × d</code> 的矩阵 <code>X</code>，把标签堆成 <code>n × 1</code> 的向量 <code>y</code>。线性模型就是 <code>ŷ = Xw</code>。这里 <code>Xw</code> 的几何意义是：<b>用 <code>X</code> 的 <code>d</code> 个列向量的线性组合去逼近 <code>y</code></b>。所有可能的组合构成 <code>X</code> 的列空间（column space），而 <code>y</code> 一般不在这个空间里——这就是「方程组无解」的几何版本。' },

    { t: 'p', html: '无解时我们退而求其次：在列空间里找一个离 <code>y</code> 最近的点。最近点就是 <code>y</code> 在列空间上的<b>正交投影</b>，残差 <code>y - Xw</code> 必须垂直于列空间的每一列，即 <code>X<sup>T</sup>(y - Xw) = 0</code>，整理得正规方程 <code>X<sup>T</sup>Xw = X<sup>T</sup>y</code>。当 <code>X<sup>T</sup>X</code> 可逆时 <code>w = (X<sup>T</sup>X)<sup>-1</sup>X<sup>T</sup>y</code>。这条推导只用了一次「垂直即内积为零」，却把最小二乘、投影、正规方程三件事一次说清，是本课最值得记住的推导之一。' },

    { t: 'p', html: '矩阵分解里最常用的是特征值分解与奇异值分解（singular value decomposition, SVD）。对称矩阵 <code>A</code> 可分解为 <code>QΛQ<sup>T</sup></code>，<code>Q</code> 的列是正交特征向量，<code>Λ</code> 对角线上是特征值。任意 <code>n × d</code> 矩阵可分解为 <code>UΣV<sup>T</sup></code>。SVD 的两个用途后面都会碰到：<b>求伪逆</b>（<code>X<sup>+</sup> = VΣ<sup>+</sup>U<sup>T</sup></code>，用于 <code>X<sup>T</sup>X</code> 不可逆时）、<b>做主成分</b>（ch07 的 PCA 就是取 <code>V</code> 的前 <code>k</code> 列）。' },

    { t: 'p', html: '还有一个判定要会：对称矩阵 <code>A</code> 是<b>半正定</b>（positive semi-definite, PSD）当且仅当对所有 <code>x</code> 有 <code>x<sup>T</sup>Ax ≥ 0</code>，等价于所有特征值非负。这个条件在后面反复出现：协方差矩阵一定 PSD；损失函数的 Hessian 若 PSD，函数就是凸的；核矩阵必须 PSD，才叫合法的核（Mercer 条件）。' },

    { t: 'code', lang: 'python', caption: '最小二乘：正规方程 vs SVD 伪逆 vs numpy 内置', code: `import numpy as np

rng = np.random.default_rng(1)
X = rng.normal(size=(60, 3))
X = np.column_stack([np.ones(60), X])          # 加一列 1 作为截距
true_w = np.array([1.5, -2.0, 0.5, 3.0])
y = X @ true_w + rng.normal(scale=0.1, size=60)

w_normal = np.linalg.solve(X.T @ X, X.T @ y)   # 正规方程
w_pinv = np.linalg.pinv(X) @ y                 # SVD 伪逆
w_lstsq = np.linalg.lstsq(X, y, rcond=None)[0]

print('normal :', np.round(w_normal, 4))
print('pinv   :', np.round(w_pinv, 4))
print('lstsq :', np.round(w_lstsq, 4))
print('residual norm =', np.linalg.norm(y - X @ w_normal))` },

    { t: 'p', html: '三种写法结果一致到小数点后多位，因为数据量足够、矩阵满秩。把样本数改成 2（小于特征数 4），<code>X<sup>T</sup>X</code> 会奇异，<code>np.linalg.solve</code> 直接报错，而伪逆仍然给出一个「最小范数解」。这个差别在 ch02 讲岭回归时会再用到：加一个 <code>λI</code> 就是把奇异矩阵变成可逆。' },

    { t: 'h', lvl: 2, text: '五、梯度、凸性与步长', id: 'ch01-5' },

    { t: 'p', html: '梯度 <code>∇f(θ)</code> 是偏导数组成的向量，指向函数<b>上升最快</b>的方向，长度是那个方向的斜率。所以要让函数变小，就往 <code>-∇f</code> 走：<code>θ<sub>t+1</sub> = θ<sub>t</sub> - η∇f(θ<sub>t</sub>)</code>。<code>η</code> 叫学习率或步长。这个式子就是梯度下降（gradient descent），后面所有模型的训练都是它的变体。' },

    { t: 'p', html: '凸性（convexity）的定义是：对任意 <code>θ<sub>1</sub>, θ<sub>2</sub></code> 与 <code>t ∈ [0,1]</code>，有 <code>f(tθ<sub>1</sub> + (1-t)θ<sub>2</sub>) ≤ tf(θ<sub>1</sub>) + (1-t)f(θ<sub>2</sub>)</code>。几何上就是「函数图像上任意两点的连线都在图像上方」。它的价值在于：<b>凸函数的任何局部极小都是全局极小</b>，所以梯度下降只要收敛，就一定收敛到最优解，不需要多次随机初始化去赌。判断方法：一元看二阶导非负；多元看 Hessian 半正定；常见的组合规则是「凸函数之和仍凸、凸函数与正系数数乘仍凸」。' },

    { t: 'table', head: ['函数', '凸吗', '本课出现的地方'], rows: [
      ['<code>w<sup>T</sup>Aw + b<sup>T</sup>w + c</code>（<code>A</code> PSD）', '凸', '最小二乘、岭回归的目标函数'],
      ['<code>-log σ(w<sup>T</sup>x)</code>（逻辑损失）', '凸', '逻辑回归（ch02）'],
      ['hinge loss <code>max(0, 1 - y·w<sup>T</sup>x)</code>', '凸', '支持向量机（ch03）'],
      ['<code>-(y log p + (1-y) log(1-p))</code>（交叉熵）', '凸（对 <code>w</code>）', '逻辑回归、神经网络输出层'],
      ['含隐藏层的神经网络损失', '非凸', 'ch05，只能找局部最优']
    ], caption: '前四行是「凸 + 可微」的舒适区；第五行是本课唯一需要担心初始化的地方' },

    { t: 'p', html: '步长怎么选？对二次函数 <code>f(w) = (1/2)w<sup>T</sup>Aw</code>，梯度下降稳定的条件是 <code>η < 2/λ<sub>max</sub>(A)</code>，其中 <code>λ<sub>max</sub></code> 是最大特征值（也就是最陡方向的曲率）。<code>η</code> 略小于这个界时收敛最快；超过就震荡发散。这解释了一个常见现象：<b>特征量纲差很多时，Hessian 的条件数很大，同一个步长在某些方向太大、另一些方向太小</b>，所以要么标准化特征，要么用自适应方法（ch05 的 Adam）。' },

    { t: 'code', lang: 'python', caption: '同一个二次函数，三个学习率的命运', code: `import numpy as np

A = np.array([[4.0, 0.0], [0.0, 1.0]])   # 特征值 4 与 1，lambda_max = 4
b = np.array([0.0, 0.0])

def run(lr, steps=30):
    w = np.array([1.0, 1.0])
    for _ in range(steps):
        w = w - lr * (A @ w + b)
    return w

for lr in (0.1, 0.45, 0.6):
    w = run(lr)
    print('lr=%.2f  w=%s  |w|=%.4f' % (lr, np.round(w, 4), np.linalg.norm(w)))
# 理论界 2 / lambda_max = 0.5；0.45 收敛，0.6 发散` },

    { t: 'p', html: '这段代码值得亲手改几个数：把 <code>A</code> 换成 <code>[[100, 0], [0, 1]]</code>，再试 <code>lr = 0.1</code>，你会看到第二个方向几乎不动、第一个方向已经来回跳。这就是「条件数大导致收敛慢」的具体样子，也是标准化特征为什么几乎是所有模型的第一步。' },

    { t: 'h', lvl: 2, text: '六、约束优化与 KKT 条件', id: 'ch01-6' },

    { t: 'p', html: '很多模型不是「随便找最小值」，而是「在满足某些条件下找最小值」。支持向量机要在「所有样本都被正确分类且间隔至少为 1」的约束下最大化间隔；PCA 要在「投影方向是单位向量」的约束下最大化方差。这类问题的标准写法是：最小化 <code>f(w)</code>，满足 <code>g<sub>i</sub>(w) ≤ 0</code> 与 <code>h<sub>j</sub>(w) = 0</code>。' },

    { t: 'p', html: '解法是拉格朗日乘子法：构造 <code>L(w, α, β) = f(w) + Σα<sub>i</sub>g<sub>i</sub>(w) + Σβ<sub>j</sub>h<sub>j</sub>(w)</code>，其中 <code>α<sub>i</sub> ≥ 0</code>。在凸且满足 Slater 条件时，最优解由 KKT 条件刻画：<b>平稳性</b> <code>∇<sub>w</sub>L = 0</code>；<b>原始可行性</b> <code>g<sub>i</sub> ≤ 0, h<sub>j</sub> = 0</code>；<b>对偶可行性</b> <code>α<sub>i</sub> ≥ 0</code>；<b>互补松弛</b> <code>α<sub>i</sub>g<sub>i</sub>(w) = 0</code>。' },

    { t: 'p', html: '互补松弛是理解 SVM 稀疏性的钥匙：它说「要么约束不起作用（<code>g<sub>i</sub> < 0</code>），要么乘子为零（<code>α<sub>i</sub> = 0</code>）」。换句话说，<b>只有紧约束（恰好取等号的样本）才会得到非零乘子</b>。在 SVM 里，这些样本就是支持向量；其余样本对决策边界没有任何贡献，这正是 SVM 只需要存少量样本的原因。' },

    { t: 'p', html: '另一个必须建立的直觉是<b>对偶</b>。原问题难在约束多、变量多；对偶问题把约束吸收进目标，变量换成乘子，往往维数等于样本数、且形式更适合用核函数。弱对偶告诉我们对偶最优 ≤ 原始最优；凸 + Slater 条件下两者相等（强对偶），这时可以用 KKT 解原问题。ch03 会完整走一遍这条路。' },

    { t: 'h', lvl: 2, text: '七、三者合流：一维高斯的最大似然', id: 'ch01-7' },

    { t: 'p', html: '现在把三套语言合起来看一个完整例子：给一堆一维数据，假设它来自高斯分布，用最大似然估参数。这个例子小到可以手算，但它包含了「写似然 → 取对数 → 求导 → 解方程 → 看几何意义」的全流程。' },

    { t: 'steps', items: [
      { title: '第一步 · 写似然', html: '假设 <code>x<sub>i</sub> ~ N(μ, σ<sup>2</sup>)</code> 独立同分布，则 <code>L(μ, σ<sup>2</sup>) = ∏ (2πσ<sup>2</sup>)<sup>-1/2</sup> exp(-(x<sub>i</sub>-μ)<sup>2</sup>/(2σ<sup>2</sup>))</code>。' },
      { title: '第二步 · 取对数', html: '<code>ℓ = -(n/2)log(2π) - (n/2)log σ<sup>2</sup> - (1/(2σ<sup>2</sup>))Σ(x<sub>i</sub>-μ)<sup>2</sup></code>。乘积变成求和，指数变成乘法。' },
      { title: '第三步 · 对 μ 求导', html: '<code>∂ℓ/∂μ = (1/σ<sup>2</sup>)Σ(x<sub>i</sub>-μ) = 0</code>，得 <code>μ̂ = x̄</code>。无论 <code>σ<sup>2</sup></code> 是多少，均值的最优估计都是样本均值。' },
      { title: '第四步 · 对 σ² 求导', html: '<code>∂ℓ/∂σ<sup>2</sup> = -n/(2σ<sup>2</sup>) + (1/(2σ<sup>4</sup>))Σ(x<sub>i</sub>-μ̂)<sup>2</sup> = 0</code>，得 <code>σ̂<sup>2</sup> = (1/n)Σ(x<sub>i</sub>-x̄)<sup>2</sup></code>。' },
      { title: '第五步 · 回头看几何', html: '这两个估计就是「把数据中心平移到样本均值、把尺度缩放到样本标准差」。它同时也是「<code>ℓ<sub>2</sub></code> 意义下最优的常数预测器」，与本章第四节的投影是同一件事。' }
    ] },

    { t: 'p', html: '最后一步值得多看一眼：<code>σ̂<sup>2</sup></code> 除以 <code>n</code>，期望是 <code>(n-1)/n·σ<sup>2</sup></code>，比真值小，所以是<b>有偏</b>的。除以 <code>n-1</code> 才无偏。MLE 偏爱「把方差估小一点」，因为似然在分母上——方差越小，模型对已观测点越「自信」。这个偏差在样本少时很明显，也是正则化思想的雏形：<b>让模型别太自信</b>。' },

    { t: 'h', lvl: 2, text: '八、常见错误与自查方法', id: 'ch01-8' },

    { t: 'table', head: ['错误说法 / 做法', '为什么错', '正确做法'], rows: [
      ['「密度 1.8，所以概率是 1.8」', '密度可大于 1，只有积分才是概率', '对区间积分；单点概率为 0'],
      ['「<code>Var(X+Y) = Var(X)+Var(Y)</code> 总是成立」', '只有不相关时协方差项才消失', '写出 <code>+2Cov(X,Y)</code>，再判断是否为零'],
      ['「<code>E[1/X] = 1/E[X]</code>」', '期望不能穿过非线性函数', '用詹森不等式判断方向，或直接积分'],
      ['「梯度为零就是最小值」', '也可能是最大值或鞍点', '检查 Hessian：PSD 才是极小'],
      ['「步长越小越安全」', '太小会收敛极慢，迭代次数不够时看起来像没学', '按 <code>2/λ<sub>max</sub></code> 估上界，配合标准化'],
      ['「对数似然越大越接近 1」', '对数似然不是概率，无上界可比', '只比较同一数据集上不同参数的大小']
    ], caption: '六条里有四条是符号误用，两条是概念混淆；考前逐条自查' },

    { t: 'p', html: '自查的方法很简单：<b>每写下一个等式，问自己「这一步用了哪条性质」</b>。用了期望的线性性？用了独立性？用了 <code>log</code> 单调？说不出性质名，就说明这一步是猜的，考试很可能扣分。这个方法在 ch02 之后会一直用得上。' },

    { t: 'terms', items: [
      { en: 'random variable', zh: '随机变量', html: '把随机试验的结果映射为数值的函数；离散用分布列，连续用密度描述。' },
      { en: 'maximum likelihood', zh: '最大似然估计', html: '选出让已观测数据出现概率最大的参数；等价于最小化负对数似然。' },
      { en: 'projection', zh: '投影', html: '向量在子空间上最近的点，残差与该子空间正交；最小二乘就是投影。' },
      { en: 'positive semi-definite', zh: '半正定', html: '对称矩阵满足 <code>x<sup>T</sup>Ax ≥ 0</code> 对所有 <code>x</code> 成立，等价于特征值非负。' },
      { en: 'convexity', zh: '凸性', html: '函数图像上任意两点连线不低于图像本身；凸函数的局部极小即全局极小。' },
      { en: 'KKT conditions', zh: 'KKT 条件', html: '凸约束优化最优解的必要条件：平稳性、原始可行、对偶可行、互补松弛。' },
      { en: 'condition number', zh: '条件数', html: '最大与最小特征值之比；越大，梯度下降在同样步长下越难兼顾各方向。' }
    ] },

    { t: 'quiz', qid: 'ch01-q1' },
    { t: 'quiz', qid: 'ch01-q2' },
    { t: 'quiz', qid: 'ch01-q3' },

    { t: 'keypoint', items: [
      { title: '密度 ≠ 概率', html: '密度可以大于 1；连续变量单点概率为 0，只有区间积分才有意义。' },
      { title: '方差相加要看协方差', html: '独立（不相关）时才能直接相加；否则必须加 <code>2Cov</code>。' },
      { title: 'MLE 四步：似然、取对数、求导、解方程', html: '取对数只为数值稳定与化简，argmax 不变。' },
      { title: '最小二乘 = 投影 + 正交', html: '残差垂直于列空间，一步推出正规方程 <code>X<sup>T</sup>Xw = X<sup>T</sup>y</code>。' },
      { title: '步长上界由最大曲率决定', html: '<code>η < 2/λ<sub>max</sub></code>；条件数大时要么标准化，要么换自适应方法。' },
      { title: '互补松弛解释 SVM 的稀疏性', html: '只有紧约束的样本有非零乘子，也就是支持向量。' }
    ] },

    { t: 'checklist', id: 'ch01', items: [
      '我能说出密度与概率的区别，并各举一个例子',
      '我能手推伯努利与一维高斯的 MLE，并说明 <code>1/n</code> 与 <code>1/(n-1)</code> 的差别',
      '我能解释为什么最大似然要取对数，并说出两个理由',
      '我能用「残差垂直于列空间」推出正规方程',
      '我能判断一个二次函数是否凸，并写出它的 Hessian',
      '我能用 <code>2/λ<sub>max</sub></code> 解释梯度下降为什么会发散',
      '我能写出 KKT 的四个条件，并说明互补松弛的含义',
      '我能解释特征值分解与 SVD 的关系，以及伪逆什么时候用',
      '我能指出本章六条常见错误中任意三条的错因'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 DDA3020 Lecture 02 Probability、Lecture 03 Linear Algebra、Lecture 04 Optimization 三份讲义组织，覆盖随机变量与常见分布、期望方差、条件概率与贝叶斯、最大似然、向量与矩阵运算、投影与正规方程、特征值与 SVD、梯度下降与凸性、拉格朗日乘子与 KKT。讲义中关于矩阵微积分的完整表格、以及各类分布的矩生成函数属于扩展内容，本站只保留后续七章会用到的部分；习题中的数值例子（方差计算、投影、步长实验）均可由章内代码复现。' }
  ]
});
