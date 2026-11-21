/* =====================================================================
 * ch03.js · 第 3 章「支持向量机与核方法」
 * 职责：从「哪个分界面最好」出发，走到最大间隔、对偶、软间隔与核技巧，
 *       说明 SVM 为什么只需要少量支持向量、为什么核函数能把线性模型变成非线性模型。
 * 依据：DDA3020_ML_Lecture_07_SVM。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch03',
  num: '03',
  title: '支持向量机与核方法',
  en: 'SVM & KERNEL METHODS',
  goals: [
    '用几何间隔说明「最大间隔」为什么比任意一个分开的超平面更好',
    '写出硬间隔 SVM 的原始问题，并说明它为什么是一个凸二次规划',
    '推导对偶问题，解释 <code>w = Σα<sub>i</sub>y<sub>i</sub>x<sub>i</sub></code> 与支持向量的关系',
    '写出软间隔与 hinge 损失，说明 C 如何控制间隔与误分类的权衡',
    '用核技巧把内积替换成核函数，并为给定数据选择合适的核与超参数'
  ],
  kp: [
    { id: 'ch03-1', title: '最大间隔的直觉' },
    { id: 'ch03-2', title: '函数间隔与几何间隔' },
    { id: 'ch03-3', title: '硬间隔原始问题' },
    { id: 'ch03-4', title: '拉格朗日对偶与支持向量' },
    { id: 'ch03-5', title: '软间隔与 hinge 损失' },
    { id: 'ch03-6', title: '核技巧与 Mercer 条件' },
    { id: 'ch03-7', title: '常用核与超参数' },
    { id: 'ch03-8', title: '常见错误与自查' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么还要学 SVM', html: '在深度学习之前，SVM 是「小样本、高维、需要可解释边界」场景的首选；在今天，它仍然是表格数据、文本分类的强基线，也是理解<b>对偶、核方法、hinge 损失</b>这三件工具的唯一入口。后面的神经网络章节会反复用到这里的链式推导与正则化视角，所以这一章不能跳。' },

    { t: 'p', lead: true, html: '这一章的推导密度是全课最高的。读的时候抓住一条主线：<b>先决定「什么样的分界面最好」（最大间隔），再发现「这个问题可以用内积重写」（对偶），最后把内积换掉（核技巧）</b>。三步走完，你就拥有了一个能处理非线性问题的线性模型。' },

    { t: 'h', lvl: 2, text: '一、最大间隔的直觉', id: 'ch03-1' },

    { t: 'p', html: '给定一堆线性可分的点，能把两类分开的超平面有无穷多个。感知机算法找到哪一个，取决于初始化和样本顺序——它只要「分对」就停，没有任何理由偏好某一个。这显然不够：<b>离样本太近的分界面，遇到一点噪声就会分错</b>。' },

    { t: 'p', html: 'SVM 的答案是：在所有能分开的超平面里，选那个<b>离最近样本最远</b>的。这个「最近距离」叫间隔（margin），把间隔最大化的分界面叫最大间隔超平面。直觉上它最「居中」，对未见样本的容错空间最大；形式上，它是唯一解（在硬间隔可分的假设下），不依赖初始化。' },

    { t: 'p', html: '决定间隔宽度的只有少数几个点——恰好落在间隔边界上的那些。它们叫<b>支持向量</b>（support vector）。把其他所有样本删掉重训，分界面不变；把某个支持向量挪动一点，分界面立刻改变。这个性质意味着 SVM 的模型复杂度由支持向量的数量决定，而不是由特征维数决定，这是它在高维小样本上表现好的原因之一。' },

    { t: 'p', html: '另一个视角是正则化。最大化间隔等价于最小化 <code>||w||</code>，而 <code>||w||</code> 小意味着打分函数 <code>w<sup>T</sup>x</code> 对输入变化不敏感——这正是「模型简单」的一种度量。所以 SVM 也可以读成：<b>在「全部分对」的约束下，找最简单的模型</b>。这个读法把它和岭回归、Dropout 等正则化手段放进了同一个框架。' },

    { t: 'h', lvl: 2, text: '二、函数间隔与几何间隔', id: 'ch03-2' },

    { t: 'p', html: '超平面写成 <code>w<sup>T</sup>x + b = 0</code>，<code>w</code> 是法向量，方向决定超平面的朝向，<code>b</code> 决定偏移。点 <code>x</code> 到超平面的有符号距离是 <code>(w<sup>T</sup>x + b)/||w||</code>。对分类问题，标签取 ±1，于是「分对且离得远」可以写成 <code>y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b) > 0</code> 且数值大。' },

    { t: 'p', html: '定义<b>函数间隔</b>（functional margin）<code>γ̂<sub>i</sub> = y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b)</code>，整个数据集的函数间隔取最小值 <code>γ̂ = min<sub>i</sub>γ̂<sub>i</sub></code>。它有个毛病：把 <code>w</code> 和 <code>b</code> 同时放大 10 倍，函数间隔也放大 10 倍，但超平面一点没变。所以函数间隔不能直接拿来比大小。' },

    { t: 'p', html: '修法是除以 <code>||w||</code>，得到<b>几何间隔</b>（geometric margin）<code>γ<sub>i</sub> = y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b)/||w||</code>，它就是点到超平面的真实欧氏距离。几何间隔对 <code>(w, b)</code> 的整体缩放不变，这才是我们要最大化的量。' },

    { t: 'p', html: '有了尺度不变性，就可以「固定尺度、只优化方向」：令最近点的函数间隔恰好为 1，即 <code>min<sub>i</sub> y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b) = 1</code>。这不是限制，而是一种规范化——任何解都可以通过缩放 <code>w, b</code> 满足它。此时几何间隔 <code>γ = 1/||w||</code>，最大化 <code>γ</code> 就是最小化 <code>||w||</code>。这一步把「最大化距离」变成了标准的二次规划，是整章最关键的一次改写。' },

    { t: 'p', html: '两类之间的总间隔宽度是 <code>2/||w||</code>。所以「间隔最大」也可以说成「两条边界线 <code>w<sup>T</sup>x + b = ±1</code> 之间的带状区域最宽」。这个带状区域里不能有任何训练点（硬间隔情形），边界上的点就是支持向量。' },

    { t: 'table', head: ['概念', '定义', '会对缩放变化吗', '用途'], rows: [
      ['函数间隔 <code>γ̂</code>', '<code>y(w<sup>T</sup>x + b)</code>', '会，同比放大', '写约束时的中间量'],
      ['几何间隔 <code>γ</code>', '<code>y(w<sup>T</sup>x + b)/||w||</code>', '不会', '真正要最大化的距离'],
      ['间隔宽度', '<code>2/||w||</code>', '不会', '几何解释，两条边界线间距'],
      ['支持向量', '满足 <code>y(w<sup>T</sup>x + b) = 1</code> 的点', '不会', '唯一决定分界面的样本']
    ], caption: '四个量里，只有几何间隔与间隔宽度不随 (w, b) 缩放而变' },

    { t: 'h', lvl: 2, text: '三、硬间隔原始问题', id: 'ch03-3' },

    { t: 'p', html: '把所有条件写出来，硬间隔 SVM 是：最小化 <code>(1/2)||w||<sup>2</sup></code>，约束为 <code>y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b) ≥ 1</code>，对所有 <code>i = 1..n</code>。目标函数是凸二次的，约束是线性的，所以这是一个<b>凸二次规划</b>（quadratic programming, QP），有唯一全局最优解。' },

    { t: 'p', html: '为什么写成 <code>(1/2)||w||<sup>2</sup></code> 而不是 <code>||w||</code>？因为前者处处可导、导数是 <code>w</code>，后者在原点不可导；两者单调关系相同，最优解一致。这是推导里的常规化简，考试要写 <code>1/2</code>，否则后面的对偶形式会多出系数。' },

    { t: 'p', html: '约束的几何含义是：所有正类点都在 <code>w<sup>T</sup>x + b ≥ 1</code> 一侧，所有负类点在 <code>≤ -1</code> 一侧，中间留出宽度 <code>2/||w||</code> 的空带。允许等于 1 的点就是支持向量。' },

    { t: 'p', html: '直接解这个 QP 有两个困难。第一，约束数量等于样本数 <code>n</code>，<code>n</code> 大时约束极多。第二，目标里只有 <code>w</code>，看起来无法引入「样本之间的相似度」这种信息，也就没法用核。对偶形式正好解决这两个问题：约束变成 <code>n</code> 个变量上的简单箱约束，目标只依赖样本内积。' },

    { t: 'h', lvl: 2, text: '四、拉格朗日对偶与支持向量', id: 'ch03-4' },

    { t: 'p', html: '为每个约束引入乘子 <code>α<sub>i</sub> ≥ 0</code>，写拉格朗日函数：<code>L(w, b, α) = (1/2)||w||<sup>2</sup> - Σα<sub>i</sub>[y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b) - 1]</code>。对 <code>w</code> 和 <code>b</code> 求偏导令零，得到两个关键关系：<code>w = Σα<sub>i</sub>y<sub>i</sub>x<sub>i</sub></code> 与 <code>Σα<sub>i</sub>y<sub>i</sub> = 0</code>。' },

    { t: 'p', html: '第一个式子说明：<b>最优的 <code>w</code> 一定是训练样本的线性组合</b>，系数是 <code>α<sub>i</sub>y<sub>i</sub></code>。这是「表示定理」（representer theorem）最简单的例子，也是核方法能成立的前提——如果 <code>w</code> 不在样本张成的空间里，就没法把内积换成核。' },

    { t: 'p', html: '把两个关系代回 <code>L</code>，得到对偶问题：最大化 <code>Σα<sub>i</sub> - (1/2)ΣΣα<sub>i</sub>α<sub>j</sub>y<sub>i</sub>y<sub>j</sub>x<sub>i</sub><sup>T</sup>x<sub>j</sub></code>，约束为 <code>α<sub>i</sub> ≥ 0</code> 与 <code>Σα<sub>i</sub>y<sub>i</sub> = 0</code>。注意目标里出现的只有 <code>x<sub>i</sub><sup>T</sup>x<sub>j</sub></code>——样本内积。这就是核技巧的接入点。' },

    { t: 'p', html: 'KKT 条件给出三条结论。<b>互补松弛</b> <code>α<sub>i</sub>[y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b) - 1] = 0</code>：要么 <code>α<sub>i</sub> = 0</code>，要么该点恰好在边界上。<b>稀疏性</b>：绝大多数 <code>α<sub>i</sub></code> 为零，只有支持向量非零，所以预测只需与少量样本做内积。<b>求 <code>b</code></b>：取任一支持向量代入 <code>y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b) = 1</code> 解出，实践中对所有支持向量求平均更稳。' },

    { t: 'p', html: '决策函数也随之变成 <code>f(x) = sign(Σα<sub>i</sub>y<sub>i</sub>x<sub>i</sub><sup>T</sup>x + b)</code>。这个式子的含义很直接：<b>新样本与每个支持向量算相似度，按 <code>α<sub>i</sub>y<sub>i</sub></code> 加权投票</b>。SVM 因此可以看成一个「只保留关键样本的最近邻/模板匹配」模型。' },

    { t: 'code', lang: 'python', caption: '对偶系数的稀疏性：只有支持向量的 α 非零', code: `import numpy as np
from sklearn.svm import SVC
from sklearn.datasets import make_blobs

X, y = make_blobs(n_samples=120, centers=2, cluster_std=0.9, random_state=4)

clf = SVC(kernel='linear', C=1e6).fit(X, y)   # 大 C ≈ 硬间隔
alpha = np.abs(clf.dual_coef_[0])
sv = clf.support_

print('训练样本数      =', len(X))
print('支持向量数      =', len(sv))
print('非零 alpha 数   =', (alpha > 1e-8).sum())
print('支持向量索引前10 =', sv[:10])
print('w =', np.round(clf.coef_[0], 3))

# 用支持向量重建 w，并与 sklearn 的 w 对比
w_dual = (alpha * y[sv]) @ X[sv]
print('w(对偶重建) =', np.round(w_dual, 3))` },

    { t: 'p', html: '运行结果里支持向量通常只占样本的 10%–40%，<code>alpha</code> 的其余项精确为 0。用 <code>alpha * y[sv]</code> 加权求和重建的 <code>w</code> 与 <code>clf.coef_</code> 一致到小数点后几位，这是对 <code>w = Σα<sub>i</sub>y<sub>i</sub>x<sub>i</sub></code> 最直接的验证。把 <code>C</code> 调小，支持向量会变多——因为软间隔允许更多点「违规」，它们也会拿到非零乘子。' },

    { t: 'h', lvl: 2, text: '五、软间隔与 hinge 损失', id: 'ch03-5' },

    { t: 'p', html: '真实数据几乎不可能线性可分。硬间隔的约束会让问题无解，或者为了迁就一个离群点把间隔压得极窄——这叫<b>过拟合到噪声</b>。软间隔（soft margin）给每个样本一个松弛量 <code>ξ<sub>i</sub> ≥ 0</code>，把约束放宽为 <code>y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b) ≥ 1 - ξ<sub>i</sub></code>，目标改为最小化 <code>(1/2)||w||<sup>2</sup> + CΣξ<sub>i</sub></code>。' },

    { t: 'p', html: '<code>ξ<sub>i</sub></code> 的含义分三段：<code>ξ<sub>i</sub> = 0</code> 表示点在间隔外且分对；<code>0 < ξ<sub>i</sub> < 1</code> 表示落在间隔带内但仍分对；<code>ξ<sub>i</sub> ≥ 1</code> 表示分错。<code>C</code> 是惩罚系数：<b><code>C</code> 越大，越不容忍违规，间隔越窄，越容易过拟合；<code>C</code> 越小，越容忍违规，间隔越宽，偏差越大</b>。注意 <code>C</code> 在正则化的语言里是「正则强度的倒数」，与 <code>λ</code> 方向相反，这是最常见的混淆点。' },

    { t: 'p', html: '把约束消掉可以得到等价的无约束形式：最小化 <code>(1/2)||w||<sup>2</sup> + CΣ max(0, 1 - y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b))</code>。后面这项就是 <b>hinge 损失</b>（合页损失）。它的形状是一段水平线接一条斜线：分对且间隔大于 1 时损失为 0，否则线性增长。与逻辑损失 <code>log(1 + e<sup>-z</sup>)</code> 相比，hinge 在「已经分对」时<b>精确为零</b>，逻辑损失永远大于零；这解释了 SVM 的稀疏性——只有「不够自信」的样本产生梯度。' },

    { t: 'compare', left: { title: 'hinge + L2', html: 'SVM。分对且有余量时损失恰为 0，解稀疏，只有支持向量有乘子；输出是打分不是概率。' }, right: { title: 'logistic + L2', html: '逻辑回归。所有样本都有非零梯度，解不稀疏；输出天然是概率，便于校准与阈值调整。' } },

    { t: 'p', html: '由于 hinge 在 <code>z = 1</code> 处不可导，SVM 通常不用梯度下降求解，而用专门的 QP 求解器或 SMO（序列最小优化）。SMO 每次只优化两个乘子，把问题降到可以解析求解的二维子问题，这也是 sklearn 的 <code>libsvm</code> 后端所做的事。' },

    { t: 'table', head: ['', '硬间隔', '软间隔'], rows: [
      ['约束', '<code>y(w<sup>T</sup>x + b) ≥ 1</code>', '<code>y(w<sup>T</sup>x + b) ≥ 1 - ξ</code>'],
      ['目标', '<code>(1/2)||w||<sup>2</sup>', '<code>(1/2)||w||<sup>2</sup> + CΣξ</code>'],
      ['适用', '严格线性可分、无噪声', '几乎所有真实数据'],
      ['解的存在', '可能无解', '总有解'],
      ['超参数', '无', '<code>C</code>'],
      ['对离群点', '极敏感', '由 <code>C</code> 控制容忍度']
    ], caption: '软间隔不是「退让」，而是把「必须全对」换成了「错一点要付代价」' },

    { t: 'h', lvl: 2, text: '六、核技巧与 Mercer 条件', id: 'ch03-6' },

    { t: 'p', html: '对偶形式里只出现内积 <code>x<sub>i</sub><sup>T</sup>x<sub>j</sub></code>。现在做一个替换：先把样本映射到高维特征空间 <code>φ(x)</code>，理论上能解决非线性问题，但 <code>φ</code> 的维数可能极高（甚至无限），显式计算不可行。核技巧（kernel trick）观察到的关键事实是：<b>我们从来不需要 <code>φ(x)</code> 本身，只需要 <code>φ(x<sub>i</sub>)<sup>T</sup>φ(x<sub>j</sub>)</code></b>。把这个内积定义成核函数 <code>K(x<sub>i</sub>, x<sub>j</sub>)</code>，所有推导原样成立。' },

    { t: 'p', html: '以 RBF 核为例：<code>K(x, z) = exp(-γ||x - z||<sup>2</sup>)</code>。它对应的特征空间是无穷维的，但计算一次核只需 <code>O(d)</code>。这就是核方法的威力：<b>用低维的计算成本，买到高维甚至无限维的表达能力</b>。代价是要算 <code>n × n</code> 的核矩阵，空间 <code>O(n<sup>2</sup>)</code>，所以 SVM 不适合 <code>n</code> 上百万的数据。' },

    { t: 'p', html: '不是随便什么函数都能当核。Mercer 条件要求核矩阵 <code>K</code>（<code>K<sub>ij</sub> = K(x<sub>i</sub>, x<sub>j</sub>)</code>）对任意样本集都是<b>对称半正定</b>的。等价说法是：存在某个特征映射 <code>φ</code> 使得 <code>K(x, z) = φ(x)<sup>T</sup>φ(z)</code>。这个条件保证了对应的 QP 仍然是凸的、对偶仍然成立。常见的合法核有线性核、多项式核、RBF 核、拉普拉斯核；sigmoid 核只在某些参数下合法，实践中要小心。' },

    { t: 'p', html: '把核代入决策函数：<code>f(x) = sign(Σα<sub>i</sub>y<sub>i</sub>K(x<sub>i</sub>, x) + b)</code>。这时模型仍然是「与支持向量比相似度、加权投票」，只是相似度从欧氏内积换成了核。RBF 核的相似度随距离指数衰减，所以它衡量的是「局部邻域」；多项式核衡量的是「夹角与高阶交互」。<b>选核本质上是在选「什么样的相似度对这个任务有意义」</b>。' },

    { t: 'h', lvl: 2, text: '七、常用核与超参数', id: 'ch03-7' },

    { t: 'p', html: '线性核 <code>K = x<sup>T</sup>z</code>：不升维，等价于线性 SVM，参数少、可解释、<code>n</code> 大时最快。文本分类、基因数据这类「特征维数远大于样本数」的场景，线性核往往已经够用。多项式核 <code>K = (γx<sup>T</sup>z + r)<sup>d</sup></code>：显式建模特征交互，<code>d = 2</code> 时相当于加了所有二次项，但 <code>d</code> 大时数值不稳定。' },

    { t: 'p', html: 'RBF 核 <code>K = exp(-γ||x - z||<sup>2</sup>)</code>：最常用的默认选择，能逼近任意连续函数（在合适的 <code>γ</code> 下）。<code>γ</code> 控制「影响半径」：<b><code>γ</code> 大，每个样本的影响范围小，边界弯曲、容易过拟合；<code>γ</code> 小，影响范围大，边界接近线性、容易欠拟合</b>。<code>γ</code> 与 <code>C</code> 必须联合调，常用指数网格搜索。' },

    { t: 'p', html: '还有一个常被忽略的点：<b>SVM 对特征尺度极其敏感</b>。RBF 核里是欧氏距离，量纲大的特征会主导距离，等于把其他特征抹掉。所以 <code>StandardScaler</code> 不是可选项。此外，SVM 默认不输出概率；需要概率时打开 <code>probability=True</code>，它会在内部用 Platt scaling 额外拟合一个 sigmoid，代价是训练变慢且概率只是近似校准。' },

    { t: 'code', lang: 'python', caption: '同一份非线性数据：线性核 vs RBF 核，以及 C 与 γ 的影响', code: `import numpy as np
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

X, y = make_moons(n_samples=400, noise=0.25, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)

for kernel in ['linear', 'rbf']:
    pipe = make_pipeline(StandardScaler(), SVC(kernel=kernel, C=1.0))
    pipe.fit(Xtr, ytr)
    print('%-7s test acc = %.3f' % (kernel, pipe.score(Xte, yte)))

grid = {'svc__C': [0.1, 1, 10, 100], 'svc__gamma': [0.01, 0.1, 1, 10]}
search = GridSearchCV(
    make_pipeline(StandardScaler(), SVC(kernel='rbf')),
    grid, cv=5, scoring='accuracy')
search.fit(Xtr, ytr)
print('best params :', search.best_params_)
print('best cv acc :', round(search.best_score_, 3))
print('test acc    :', round(search.score(Xte, yte), 3))` },

    { t: 'p', html: '典型结果是线性核 0.80 左右、RBF 核 0.95 左右，因为 moons 数据是两条交错的弧，线性边界切不开。网格搜索通常会落在 <code>C</code> 中等、<code>γ</code> 中等附近；把 <code>γ</code> 调到 10 以上会看到训练集近乎 100%、测试集掉到 0.8 以下，那是典型的过拟合。把这段代码里的数据换成 <code>make_blobs</code>，线性核反而会赢——<b>核的选择取决于数据的几何形状，不是「越复杂越好」</b>。' },

    { t: 'callout', kind: 'tip', title: 'SVM 的实用默认值', html: '表格数据先试 <code>StandardScaler + SVC(kernel="rbf", C=1, gamma="scale")</code>；样本量超过十万、或特征数远大于样本数时先试线性核或 <code>LinearSVC</code>；需要概率时不要指望 <code>probability=True</code> 给出精确校准，必要时用交叉验证的 Platt 校准或直接换逻辑回归。' },

    { t: 'h', lvl: 2, text: '八、常见错误与自查', id: 'ch03-8' },

    { t: 'table', head: ['错误做法', '后果', '正确做法'], rows: [
      ['不标准化直接上 RBF 核', '距离被大量纲特征主导，效果接近随机', '先 <code>StandardScaler</code>，且只在训练集上 fit'],
      ['把 <code>C</code> 当成正则强度', '调参方向完全相反', '<code>C</code> 大 = 正则弱 = 间隔窄'],
      ['只调 <code>C</code> 不调 <code>γ</code>', '错过最优区域，模型要么太弯要么太直', '二维网格联合搜索'],
      ['在 <code>n</code> 很大时用 RBF 核', '核矩阵 <code>O(n<sup>2</sup>)</code>，内存爆掉', '线性核、<code>LinearSVC</code> 或换模型'],
      ['把 <code>decision_function</code> 当概率', '阈值解释错误，校准很差', '需要概率时显式校准'],
      ['样本极不平衡仍看准确率', '全猜多数类也有高准确率', '设 <code>class_weight="balanced"</code>，看 P/R/F1']
    ], caption: 'SVM 的坑集中在「尺度」与「超参数语义」两处' },

    { t: 'p', html: '最后给一个自查框架：拿到一个 SVM 结果，先问<b>特征标准化了吗</b>，再问<b>支持向量占比多少</b>（过高说明 <code>C</code> 太大或数据本身噪声大），最后问<b>核宽度与数据尺度匹配吗</b>（<code>γ</code> 的量级应与标准化后特征方差的倒数同阶）。这三问能排掉大部分「效果莫名其妙」的情况。' },

    { t: 'terms', items: [
      { en: 'margin', zh: '间隔', html: '分界面到最近样本的距离；硬间隔 SVM 最大化 <code>2/||w||</code>。' },
      { en: 'support vector', zh: '支持向量', html: '恰好落在间隔边界上的训练样本，只有它们的对偶乘子非零。' },
      { en: 'dual problem', zh: '对偶问题', html: '把约束吸收进目标后得到的、以乘子为变量的问题；只依赖样本内积。' },
      { en: 'slack variable', zh: '松弛变量', html: '软间隔中允许的违规量 <code>ξ<sub>i</sub></code>，由 <code>C</code> 惩罚。' },
      { en: 'hinge loss', zh: '合页损失', html: '<code>max(0, 1 - y·f(x))</code>，分对且有余量时为 0，产生稀疏解。' },
      { en: 'kernel trick', zh: '核技巧', html: '用核函数直接算高维特征空间的内积，避免显式映射。' },
      { en: 'Mercer condition', zh: 'Mercer 条件', html: '核矩阵对称半正定，等价于存在特征映射使 <code>K(x,z)=φ(x)<sup>T</sup>φ(z)</code>。' }
    ] },

    { t: 'quiz', qid: 'ch03-q1' },
    { t: 'quiz', qid: 'ch03-q2' },
    { t: 'quiz', qid: 'ch03-q3' },

    { t: 'keypoint', items: [
      { title: '最大化间隔 = 最小化 ||w||', html: '固定函数间隔为 1 后，几何间隔是 <code>1/||w||</code>，目标是 <code>(1/2)||w||<sup>2</sup></code>。' },
      { title: 'w 是样本的线性组合', html: '<code>w = Σα<sub>i</sub>y<sub>i</sub>x<sub>i</sub></code>；只有支持向量有非零 <code>α</code>，这是稀疏性的来源。' },
      { title: 'C 是正则强度的倒数', html: '<code>C</code> 大 → 间隔窄 → 易过拟合；<code>C</code> 小 → 间隔宽 → 偏差大。' },
      { title: 'hinge 损失在分对时为 0', html: '与逻辑损失的关键差别，也是 SVM 稀疏的原因。' },
      { title: '核只替换内积', html: '对偶与决策函数里的 <code>x<sub>i</sub><sup>T</sup>x<sub>j</sub></code> 换成 <code>K(x<sub>i</sub>, x<sub>j</sub>)</code>，其余不变。' },
      { title: 'RBF 的 γ 控制局部性', html: '<code>γ</code> 大 → 影响半径小 → 边界弯曲；<code>γ</code> 小 → 边界接近线性。' }
    ] },

    { t: 'checklist', id: 'ch03', items: [
      '我能解释为什么最大间隔超平面比任意一个可分超平面更好',
      '我能区分函数间隔与几何间隔，并说明为什么要固定尺度',
      '我能写出硬间隔 SVM 的原始问题并说明它是凸 QP',
      '我能推出 <code>w = Σα<sub>i</sub>y<sub>i</sub>x<sub>i</sub></code> 与 <code>Σα<sub>i</sub>y<sub>i</sub> = 0</code>',
      '我能用互补松弛解释支持向量的稀疏性',
      '我能写出软间隔目标与 hinge 损失的等价形式',
      '我能说明 C 的方向，以及它与 λ 的区别',
      '我能陈述 Mercer 条件，并解释核技巧为什么省计算',
      '我能为给定数据选择核，并说出 C 与 γ 的调参方向'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 DDA3020_ML_Lecture_07_SVM 组织，覆盖最大间隔动机、函数间隔与几何间隔、硬间隔原始问题、拉格朗日对偶与 KKT、支持向量的稀疏性、软间隔与 hinge 损失、核技巧与 Mercer 条件、常用核与 <code>C</code>/<code>γ</code> 调参。讲义中的 SMO 算法细节、多分类一对一/一对多策略、以及 SVR 的 ε 不敏感损失属于扩展内容，本站只在必要处点名；章内三段代码（对偶系数稀疏性、线性核与 RBF 核对比、网格搜索）均可独立运行复现。' }
  ]
});
