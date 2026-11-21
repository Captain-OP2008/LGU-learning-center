/* =====================================================================
 * ch02.js · 第 2 章「线性回归与逻辑回归」
 * 职责：从最小二乘一路推到逻辑回归，说明「平方损失」和「交叉熵」都不是
 *       拍脑袋选的，而是两条不同的概率假设的自然结果。
 * 依据：DDA3020 Lecture 05 Linear Regression、Lecture 06 Logistic Regression。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch02',
  num: '02',
  title: '线性回归与逻辑回归',
  en: 'LINEAR & LOGISTIC REGRESSION',
  goals: [
    '写出线性模型的假设空间，并解释「线性」指的是对参数线性而不是对特征线性',
    '从高斯噪声假设推出平方损失，从伯努利假设推出交叉熵，说明两个损失的来源',
    '推导逻辑回归的梯度，并解释为什么它没有闭式解却仍然好用',
    '用岭回归的正则项解释系数收缩，说明 λ 增大时偏差与方差如何交换',
    '在多分类与不平衡数据上正确选择输出层、损失与评估指标'
  ],
  kp: [
    { id: 'ch02-1', title: '线性模型与假设空间' },
    { id: 'ch02-2', title: '最小二乘与正规方程' },
    { id: 'ch02-3', title: '从最大似然看平方损失' },
    { id: 'ch02-4', title: '岭回归与正则化' },
    { id: 'ch02-5', title: '从回归到分类：sigmoid 与 log-odds' },
    { id: 'ch02-6', title: '交叉熵与梯度推导' },
    { id: 'ch02-7', title: '多分类 softmax 与评估' },
    { id: 'ch02-8', title: '常见错误与自查' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么这两个模型值得花一整章', html: '线性回归和逻辑回归是本课仅有的两个「可以完整手推、又能直接上生产」的模型。它们的损失函数、梯度形式、正则化方式、评估指标，在后面的 SVM、神经网络、甚至 Transformer 里都会原样复现。把这一章推透，后面很多内容只是把 <code>Xw</code> 换成更复杂的函数。' },

    { t: 'p', lead: true, html: '这一章有两条主线。<b>第一条是回归</b>：输出是连续值，损失用平方，解有闭式形式，几何上是投影。<b>第二条是分类</b>：输出是概率，损失用交叉熵，解只能迭代。两条线在「线性打分 + 概率假设」这个层面是同一个东西，区别只在最后接的是恒等函数还是 sigmoid。' },

    { t: 'h', lvl: 2, text: '一、线性模型与假设空间', id: 'ch02-1' },

    { t: 'p', html: '线性回归的模型是 <code>ŷ = w<sub>1</sub>x<sub>1</sub> + w<sub>2</sub>x<sub>2</sub> + … + w<sub>d</sub>x<sub>d</sub> + b</code>。把所有样本堆起来就是 <code>ŷ = Xw + b·1</code>，习惯上在 <code>X</code> 左边加一列全 1，把 <code>b</code> 吸收进 <code>w</code>，写成 <code>ŷ = Xw</code>。这个技巧要养成习惯：<b>截距就是「特征恒为 1」的那一维</b>，这样公式里不用单独处理它。' },

    { t: 'p', html: '「线性」这个词容易误解。它指的是<b>对参数 <code>w</code> 线性</b>，不是对输入 <code>x</code> 线性。所以 <code>ŷ = w<sub>1</sub>x + w<sub>2</sub>x<sup>2</sup></code> 仍然是线性回归——只要把 <code>x<sup>2</sup></code> 看成第二个特征就行。同理，<code>log x</code>、<code>x<sub>1</sub>x<sub>2</sub></code>、<code>sin x</code> 都可以当特征放进去。这条性质叫「基函数展开」：模型在原始空间是曲线，在特征空间仍是超平面。' },

    { t: 'p', html: '假设空间（hypothesis space）就是「所有可能的 <code>w</code> 对应的函数集合」。<code>d</code> 个特征时它是 <code>d+1</code> 维空间里的全部超平面。模型容量由特征数决定：特征太少会欠拟合（用直线拟合抛物线），特征太多会过拟合（用 20 次多项式穿过 21 个点）。<b>选特征本质上是在选假设空间的大小</b>，这件事在 ch06 会用偏差-方差的语言重新讲一遍。' },

    { t: 'p', html: '评估回归最常用的三个量：均方误差 <code>MSE = (1/n)Σ(y<sub>i</sub> - ŷ<sub>i</sub>)<sup>2</sup></code>、均方根误差 <code>RMSE = √MSE</code>（量纲和 <code>y</code> 一致）、决定系数 <code>R<sup>2</sup> = 1 - SSE/SST</code>。注意 <code>R<sup>2</sup></code> 在训练集上一定落在 [0,1] 且随特征增加单调不减，<b>但在测试集上可以是负数</b>——预测得比「直接猜均值」还差时就会这样。看到负的 <code>R<sup>2</sup></code> 不要以为算错了，那是模型真的崩了。' },

    { t: 'h', lvl: 2, text: '二、最小二乘与正规方程', id: 'ch02-2' },

    { t: 'p', html: '最小二乘（ordinary least squares, OLS）的目标是 <code>J(w) = (1/2)||Xw - y||<sup>2</sup></code>，前面的 <code>1/2</code> 只是为了求导后消掉 2。展开：<code>J = (1/2)(w<sup>T</sup>X<sup>T</sup>Xw - 2w<sup>T</sup>X<sup>T</sup>y + y<sup>T</sup>y)</code>。对 <code>w</code> 求梯度：<code>∇J = X<sup>T</sup>Xw - X<sup>T</sup>y</code>。令其为零，得正规方程 <code>X<sup>T</sup>Xw = X<sup>T</sup>y</code>，解为 <code>w = (X<sup>T</sup>X)<sup>-1</sup>X<sup>T</sup>y</code>。' },

    { t: 'p', html: '这个解有三个值得记住的解释。<b>几何上</b>，它是 <code>y</code> 在 <code>X</code> 列空间上的投影，残差垂直于每一列（上一章已经推过）。<b>统计上</b>，它是高斯噪声假设下的最大似然估计。<b>计算上</b>，它把「最小化」这个优化问题变成了一次线性方程组求解，不需要迭代、不需要调学习率——这是极少数有解析解的机器学习模型。' },

    { t: 'p', html: '代价也很明确：形成 <code>X<sup>T</sup>X</code> 需要 <code>O(nd<sup>2</sup>)</code>，求逆需要 <code>O(d<sup>3</sup>)</code>。样本数 <code>n</code> 大不是问题，特征数 <code>d</code> 大才是问题。所以 <code>d</code> 上万时改用梯度下降或随机梯度下降，每次只看一个 batch，代价 <code>O(batch·d)</code>。另外 <code>X<sup>T</sup>X</code> 可逆要求 <code>X</code> 列满秩；特征之间完全共线（比如同时放了「面积（平方米）」和「面积（平方英尺）」）时矩阵奇异，解不唯一，数值上也会炸。' },

    { t: 'code', lang: 'python', caption: '闭式解与梯度下降在同一份数据上的对比', code: `import numpy as np

rng = np.random.default_rng(7)
n, d = 200, 4
X = rng.normal(size=(n, d))
X = np.column_stack([np.ones(n), X])
w_true = np.array([2.0, -1.5, 0.8, 0.0, 3.0])
y = X @ w_true + rng.normal(scale=0.5, size=n)

# 闭式解
w_closed = np.linalg.solve(X.T @ X, X.T @ y)

# 梯度下降：J = 1/(2n) * ||Xw - y||^2, grad = X^T (Xw - y) / n
w = np.zeros(d + 1)
lr = 0.1
for step in range(2000):
    grad = X.T @ (X @ w - y) / n
    w -= lr * grad

print('closed :', np.round(w_closed, 3))
print('gd     :', np.round(w, 3))
print('max diff =', np.abs(w_closed - w).max())` },

    { t: 'p', html: '这段代码里学习率 0.1 能收敛，是因为特征已标准化、<code>X<sup>T</sup>X/n</code> 的最大特征值不大。如果某一列的量纲是「万元」而另一列是「平方米」，条件数会到几千，同一个 0.1 会让某个方向直接发散。这就是为什么<b>标准化几乎是线性模型的第一步</b>，而不是可选项。' },

    { t: 'h', lvl: 2, text: '三、从最大似然看平方损失', id: 'ch02-3' },

    { t: 'p', html: '为什么用平方而不用绝对值？答案来自概率假设。假设 <code>y<sub>i</sub> = w<sup>T</sup>x<sub>i</sub> + ε<sub>i</sub></code>，其中 <code>ε<sub>i</sub></code> 独立同分布、服从 <code>N(0, σ<sup>2</sup>)</code>。那么给定 <code>x<sub>i</sub></code> 时 <code>y<sub>i</sub></code> 服从 <code>N(w<sup>T</sup>x<sub>i</sub>, σ<sup>2</sup>)</code>。对数似然：' },

    { t: 'p', html: '<code>ℓ(w) = -n/2·log(2πσ<sup>2</sup>) - 1/(2σ<sup>2</sup>)·Σ(y<sub>i</sub> - w<sup>T</sup>x<sub>i</sub>)<sup>2</sup></code>。前两项与 <code>w</code> 无关，最大化 <code>ℓ</code> 等价于最小化 <code>Σ(y<sub>i</sub> - w<sup>T</sup>x<sub>i</sub>)<sup>2</sup></code>。所以<b>平方损失 = 高斯噪声假设 + 最大似然</b>。这条推导说明：用 MSE 时你其实已经悄悄假设了「误差是对称的、方差恒定的、偶尔的大偏差不算离谱」。' },

    { t: 'p', html: '如果假设噪声服从拉普拉斯分布 <code>p(ε) ∝ exp(-|ε|/b)</code>，同样的推导会得到<b>绝对值损失</b>，也就是最小绝对偏差（least absolute deviations, LAD）。它对离群点更稳健，代价是零点不可导、解不唯一。这个对照表说明一件事：<b>损失函数不是审美选择，而是噪声模型的声明</b>。数据里有 5% 的标注错误时，MSE 会被这些点严重拖偏，LAD 或 Huber 损失更合适。' },

    { t: 'table', head: ['损失', '等价于哪种噪声假设', '对离群点', '可导性'], rows: [
      ['平方损失 <code>(y-ŷ)<sup>2</sup></code>', '高斯 <code>N(0, σ<sup>2</sup>)</code>', '敏感，误差平方放大', '处处可导'],
      ['绝对值损失 <code>|y-ŷ|</code>', '拉普拉斯', '稳健', '零点不可导'],
      ['Huber 损失', '高斯与小误差、拉普拉斯与大误差的混合', '较稳健', '一阶可导'],
      ['分位数损失', '非对称拉普拉斯', '取决于分位数', '次梯度']
    ], caption: '换个噪声假设，就换一个损失；这是回归里最容易被忽略的一层' },

    { t: 'h', lvl: 2, text: '四、岭回归与正则化', id: 'ch02-4' },

    { t: 'p', html: '当特征之间高度相关、或 <code>d</code> 接近甚至超过 <code>n</code> 时，OLS 的系数会变得极大且符号乱跳：数据里加一点噪声，<code>w</code> 就换一个方向。这叫<b>方差过大</b>。岭回归（ridge regression）在目标里加一个惩罚：<code>J(w) = (1/2)||Xw - y||<sup>2</sup> + (λ/2)||w||<sup>2</sup></code>。求导令零得 <code>(X<sup>T</sup>X + λI)w = X<sup>T</sup>y</code>，解为 <code>w = (X<sup>T</sup>X + λI)<sup>-1</sup>X<sup>T</sup>y</code>。' },

    { t: 'p', html: '加 <code>λI</code> 有两个效果。第一，即使 <code>X<sup>T</sup>X</code> 奇异，加一个正数到对角线上也让矩阵可逆，问题从「无解或无穷多解」变成「唯一解」。第二，它把解往原点拉：<code>λ → 0</code> 时退化为 OLS，<code>λ → ∞</code> 时 <code>w → 0</code>。这个「收缩」（shrinkage）是<b>用一点偏差换大幅方差下降</b>，在测试集上往往净赚。注意通常<b>不惩罚截距</b>，因为把预测整体平移不应该受惩罚。' },

    { t: 'p', html: '从 SVD 角度看会更清楚。设 <code>X = UΣV<sup>T</sup></code>，则 OLS 的解在 <code>v<sub>j</sub></code> 方向上的系数是 <code>u<sub>j</sub><sup>T</sup>y / σ<sub>j</sub></code>，岭回归是 <code>σ<sub>j</sub>/(σ<sub>j</sub><sup>2</sup> + λ) · u<sub>j</sub><sup>T</sup>y</code>。当 <code>σ<sub>j</sub></code> 很小（那个方向几乎没信息）时，OLS 除以一个接近零的数会把噪声放大成巨大的系数；岭回归的因子 <code>σ<sub>j</sub>/(σ<sub>j</sub><sup>2</sup>+λ)</code> 在 <code>σ<sub>j</sub> → 0</code> 时也趋于 0，正好把噪声压掉。<b>这就是「正则化 = 抑制小奇异值方向」的精确版本</b>。' },

    { t: 'code', lang: 'python', caption: 'λ 路径：系数如何被一步步压小', code: `import numpy as np
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(3)
n = 80
x1 = rng.normal(size=n)
x2 = x1 + 0.01 * rng.normal(size=n)          # 高度共线
X = np.column_stack([x1, x2])
y = 3 * x1 - 2 * x2 + rng.normal(scale=0.1, size=n)
X = StandardScaler().fit_transform(X)

for lam in [0.001, 0.1, 1.0, 10.0, 100.0]:
    m = Ridge(alpha=lam).fit(X, y)
    print('alpha=%7.3f  coef=%s' % (lam, np.round(m.coef_, 3)))
# alpha 增大，两个系数先膨胀后一起收缩，最后都趋近 0` },

    { t: 'p', html: '把 <code>α</code> 从 0.001 调到 100，你会看到系数先因为共线性而很大，然后随正则增强迅速变小。真实数据里选 <code>λ</code> 靠交叉验证（ch06），不靠看系数好不好看。还要区分 L2 与 L1：<b>L2（岭）让系数变小但不为零，L1（lasso）会把一部分系数压成精确的 0</b>，因此自带特征选择。两者的几何解释是「约束区域是圆还是菱形」，菱形更容易在坐标轴上碰到最优解。' },

    { t: 'compare', left: { title: '无正则（OLS）', html: '无偏，但方差大；共线时系数不稳定、符号可能违反常识；<code>d > n</code> 时无唯一解。' }, right: { title: 'L2 正则（Ridge）', html: '有偏，但方差小、解唯一；系数整体收缩、彼此更均衡；需要标准化，否则惩罚不公平。' } },

    { t: 'h', lvl: 2, text: '五、从回归到分类：sigmoid 与 log-odds', id: 'ch02-5' },

    { t: 'p', html: '分类任务的第一反应是把标签编码成 0/1 然后做线性回归。这行不通，原因有三：预测值可以小于 0 或大于 1，不是概率；平方损失对「已经分对但不够自信」的样本仍施加惩罚，梯度会被远离边界的正确样本主导；而且它对概率的假设是高斯，与 0/1 标签完全不符。' },

    { t: 'p', html: '正确做法是把线性打分 <code>z = w<sup>T</sup>x</code> 通过 sigmoid 压到 (0,1)：<code>σ(z) = 1/(1 + e<sup>-z</sup>)</code>。它的性质要背下来：<code>σ(0) = 0.5</code>、<code>σ(-z) = 1 - σ(z)</code>、导数 <code>σ′(z) = σ(z)(1 - σ(z))</code>、<code>z → ±∞</code> 时饱和到 1 或 0。把 <code>σ</code> 的反函数拿出来：<code>log(p/(1-p)) = z = w<sup>T</sup>x</code>，左边就是<b>对数几率</b>（log-odds）。所以逻辑回归假设的是「对数几率对特征线性」，而不是「概率对特征线性」。' },

    { t: 'p', html: '这个假设带来一个漂亮的解释：<code>w<sub>j</sub></code> 表示 <code>x<sub>j</sub></code> 每增加一个单位，<b>几率（odds）乘以 <code>e<sup>w<sub>j</sub></sup></code></b>。比如 <code>w<sub>j</sub> = 0.7</code>，则几率变为 <code>e<sup>0.7</sup> ≈ 2.01</code> 倍。<code>w<sub>j</sub> = 0</code> 表示该特征不影响判断。这比「系数是斜率」更好解释，也是医学、金融里偏爱逻辑回归的原因。' },

    { t: 'p', html: '决策边界是 <code>w<sup>T</sup>x = 0</code>，仍然是一个超平面。所以逻辑回归是<b>线性分类器</b>：它能画出的边界和感知机一样，区别在于它输出校准过的概率、并且有唯一的最优解（凸问题）。想画曲线边界，还是那招——加多项式特征，或者换核方法（ch03）。' },

    { t: 'h', lvl: 2, text: '六、交叉熵与梯度推导', id: 'ch02-6' },

    { t: 'p', html: '把标签看成伯努利随机变量：<code>P(y=1|x) = σ(w<sup>T</sup>x)</code>，<code>P(y=0|x) = 1 - σ(w<sup>T</sup>x)</code>。合起来 <code>P(y|x) = σ<sup>y</sup>(1-σ)<sup>1-y</sup></code>。对数似然 <code>ℓ(w) = Σ[y log σ + (1-y) log(1-σ)]</code>。最大化它等价于最小化负对数似然，也就是<b>二元交叉熵</b>（binary cross-entropy, BCE）：<code>J(w) = -(1/n)Σ[y<sub>i</sub>log p<sub>i</sub> + (1-y<sub>i</sub>)log(1-p<sub>i</sub>)]</code>。' },

    { t: 'p', html: '这个损失有两个关键性质。<b>第一，它是凸的</b>：<code>J</code> 的 Hessian 是 <code>(1/n)X<sup>T</sup>SX</code>，其中 <code>S = diag(p<sub>i</sub>(1-p<sub>i</sub>))</code> 半正定，所以 <code>J</code> 凸，任何局部最优就是全局最优。<b>第二，它对错误且自信的预测惩罚极大</b>：真实标签 1、预测 0.01 时，单样本损失是 <code>-log 0.01 ≈ 4.6</code>；预测 0.99 时损失只有 0.01。这正好是我们想要的「错得离谱就重罚」。' },

    { t: 'p', html: '梯度推导只用到 <code>σ′(z) = σ(z)(1-σ(z))</code> 这一条。对单个样本：<code>∂J/∂z = p - y</code>；再用链式法则 <code>∂z/∂w = x</code>，得 <code>∂J/∂w = (p - y)x</code>。写成矩阵形式：<code>∇J(w) = (1/n)X<sup>T</sup>(σ(Xw) - y)</code>。请把这个式子和线性回归的 <code>X<sup>T</sup>(Xw - y)/n</code> 并排看：<b>形式完全一样，只是把 <code>Xw</code> 换成了 <code>σ(Xw)</code></b>。这不是巧合——两者都是「广义线性模型 + 对应分布的负对数似然」，梯度自然长成「特征 × 残差」的形状。' },

    { t: 'p', html: '为什么没有闭式解？因为 <code>∇J = 0</code> 里 <code>w</code> 被包在 sigmoid 里，<code>X<sup>T</sup>(σ(Xw) - y) = 0</code> 是超越方程，解不出来。实践中有三种走法：批量/随机梯度下降（最常用）、牛顿法（用 Hessian，二次收敛，但每步 <code>O(nd<sup>2</sup>)</code>）、以及它的稳定变体 IRLS。sklearn 默认用 L-BFGS，本质是拟牛顿法。' },

    { t: 'code', lang: 'python', caption: '手写梯度下降训练逻辑回归，再与 sklearn 对照', code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=500, n_features=2, n_redundant=0,
                           n_clusters_per_class=1, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0)

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

Xb = np.column_stack([np.ones(len(Xtr)), Xtr])
w = np.zeros(Xb.shape[1])
for _ in range(5000):
    p = sigmoid(Xb @ w)
    grad = Xb.T @ (p - ytr) / len(ytr)
    w -= 0.5 * grad

acc = ((sigmoid(np.column_stack([np.ones(len(Xte)), Xte]) @ w) > 0.5) == yte).mean()
print('手写 GD  accuracy =', round(acc, 3))

clf = LogisticRegression().fit(Xtr, ytr)
print('sklearn accuracy =', round(clf.score(Xte, yte), 3))
print('sklearn coef     =', np.round(clf.coef_[0], 3), 'intercept =', round(clf.intercept_[0], 3))` },

    { t: 'p', html: '两者准确率通常在同一个量级，系数也可能不同——因为 <code>make_classification</code> 生成的数据未必线性可分，而且 sklearn 默认带 L2 正则（<code>C=1.0</code>）。想对齐，把 <code>LogisticRegression(penalty=None)</code> 打开再比。这个练习的价值在于确认：<b>逻辑回归没有魔法，就是「线性打分 + sigmoid + 交叉熵 + 梯度下降」</b>。' },

    { t: 'h', lvl: 2, text: '七、多分类 softmax 与评估', id: 'ch02-7' },

    { t: 'p', html: '多分类时把每个类各给一个线性打分 <code>z<sub>k</sub> = w<sub>k</sub><sup>T</sup>x</code>，再用 softmax 转成概率：<code>p<sub>k</sub> = exp(z<sub>k</sub>) / Σ<sub>j</sub>exp(z<sub>j</sub>)</code>。它保证输出非负且和为 1。softmax 对「整体平移」不变（所有 <code>z</code> 加同一个常数，概率不变），所以参数不唯一，需要正则化或固定一个类的打分为 0 来消除冗余。' },

    { t: 'p', html: '损失是分类交叉熵 <code>J = -(1/n)Σ log p<sub>i,y<sub>i</sub></sub></code>，梯度同样漂亮：<code>∂J/∂z<sub>i</sub> = p<sub>i</sub> - onehot(y<sub>i</sub>)</code>，再乘 <code>x<sub>i</sub></code> 得参数梯度。数值实现上有个细节：<code>exp</code> 容易溢出，标准做法是先减去每行的最大值再取指数（log-sum-exp 技巧），结果不变但数值稳定。' },

    { t: 'p', html: '评估分类不能只看准确率。混淆矩阵给出四个数：真正例 <code>TP</code>、假正例 <code>FP</code>、真负例 <code>TN</code>、假负例 <code>FN</code>。由此定义精确率 <code>P = TP/(TP+FP)</code>（预测为正的里有多少真对）、召回率 <code>R = TP/(TP+FN)</code>（真正的正例里抓到了多少）、<code>F1 = 2PR/(P+R)</code>。准确率在类别不平衡时会骗人：99 个负例 1 个正例，全猜负也有 99% 准确率，但召回率为 0。' },

    { t: 'p', html: '还有阈值问题。<code>σ(z) > 0.5</code> 只是默认，不是定理。医疗筛查要把阈值调低（宁可误报，不可漏诊），垃圾邮件要把阈值调高（宁可漏掉，不可误杀）。阈值的选择应该由<b>两类错误的代价</b>决定，而不是由 0.5 这个数字决定。这件事在 ch06 会展开成代价敏感学习。' },

    { t: 'h', lvl: 2, text: '八、常见错误与自查', id: 'ch02-8' },

    { t: 'table', head: ['错误做法', '后果', '正确做法'], rows: [
      ['先对全体数据标准化再划分训练/测试', '测试集信息泄漏，分数虚高', '先划分，再只用训练集 fit 标准化器'],
      ['用线性回归做 0/1 分类', '预测越界、被远离边界的点主导', '换 sigmoid + 交叉熵'],
      ['把「线性」理解为对特征线性', '以为必须手动造曲线特征才行', '加 <code>x<sup>2</sup></code>、交互项即可，仍是线性模型'],
      ['共线特征下解释系数符号', '系数符号与常识相反，误判因果', '先看 VIF/相关矩阵，或改用岭回归'],
      ['类别不平衡仍报准确率', '99% 准确率的模型可能毫无用处', '报 P/R/F1、混淆矩阵、PR 曲线'],
      ['训练集上 <code>R<sup>2</sup></code> 高就宣布成功', '过拟合被掩盖', '看验证集/测试集，且与「猜均值」基线比']
    ], caption: '前两条是最常见的工程事故，后四条是最常见的理解偏差' },

    { t: 'p', html: '自查清单可以压缩成三问：<b>我的损失对应什么概率假设？我的评估指标对应什么业务代价？我的预处理有没有偷看测试集？</b> 这三问在后面的 SVM、树模型、神经网络里一字不改地适用。' },

    { t: 'terms', items: [
      { en: 'ordinary least squares', zh: '普通最小二乘', html: '最小化残差平方和的线性回归，解由正规方程给出。' },
      { en: 'ridge regression', zh: '岭回归', html: '在平方损失上加 L2 惩罚，使解唯一并把系数向零收缩。' },
      { en: 'log-odds', zh: '对数几率', html: '<code>log(p/(1-p))</code>，逻辑回归假设它对特征线性。' },
      { en: 'sigmoid', zh: 'S 型函数', html: '<code>1/(1+e<sup>-z</sup>)</code>，把实数压到 (0,1)，导数为其自身乘 (1-自身)。' },
      { en: 'cross-entropy', zh: '交叉熵', html: '负对数似然；分类任务的标准损失，对自信的错误惩罚极大。' },
      { en: 'softmax', zh: '归一化指数', html: '把 <code>K</code> 个打分转成和为 1 的概率，多分类输出层。' },
      { en: 'shrinkage', zh: '收缩', html: '正则化把参数估计往先验（通常是 0）拉，用偏差换方差。' }
    ] },

    { t: 'quiz', qid: 'ch02-q1' },
    { t: 'quiz', qid: 'ch02-q2' },
    { t: 'quiz', qid: 'ch02-q3' },

    { t: 'keypoint', items: [
      { title: '线性指对参数线性', html: '把 <code>x<sup>2</sup></code>、<code>log x</code> 当新特征，模型仍叫线性回归。' },
      { title: '平方损失 ⇔ 高斯噪声', html: '换拉普拉斯噪声就得到绝对值损失；损失是噪声假设的声明。' },
      { title: '岭回归把奇异矩阵变可逆', html: '<code>(X<sup>T</sup>X + λI)<sup>-1</sup>X<sup>T</sup>y</code>，并抑制小奇异值方向。' },
      { title: '逻辑回归的梯度与线性回归同形', html: '<code>X<sup>T</sup>(σ(Xw) - y)/n</code>，只是把 <code>Xw</code> 换成 <code>σ(Xw)</code>。' },
      { title: '交叉熵是凸的', html: 'Hessian <code>X<sup>T</sup>SX</code> 半正定，梯度下降必达全局最优。' },
      { title: '阈值 0.5 不是定理', html: '按两类错误的代价调阈值；不平衡数据看 PR 曲线而非准确率。' }
    ] },

    { t: 'checklist', id: 'ch02', items: [
      '我能写出线性回归的假设空间，并解释「线性」指什么',
      '我能从高斯噪声假设推出平方损失，并说出每一步用到的性质',
      '我能推导 <code>(X<sup>T</sup>X + λI)<sup>-1</sup>X<sup>T</sup>y</code>，并说明 λ 的作用',
      '我能从 SVD 角度解释岭回归为什么能抑制噪声',
      '我能写出 sigmoid 的导数，并用它推出逻辑回归的梯度',
      '我能说明为什么逻辑回归没有闭式解，以及常用的三种解法',
      '我能写出 softmax 与多分类交叉熵，并说出数值稳定技巧',
      '我能用混淆矩阵算出 P、R、F1，并解释不平衡时准确率为何失效',
      '我能说出本章六条常见错误中任意四条的原因'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 DDA3020 Lecture 05 Linear Regression 与 Lecture 06 Logistic Regression 组织，覆盖假设空间与基函数展开、正规方程、高斯噪声与平方损失的等价性、岭回归与 SVD 视角、sigmoid 与对数几率、二元与多类交叉熵、梯度推导、softmax 数值稳定、混淆矩阵与 P/R/F1。讲义中的加权最小二乘、局部加权回归、以及 IRLS 的完整推导属于扩展内容，本站只保留与后续章节直接相关的部分；章内三段代码（闭式解对比、λ 路径、手写梯度下降）均可独立运行复现。' }
  ]
});
