/* =====================================================================
 * ch07.js · 第 7 章「无监督学习：聚类、EM 与 PCA」
 * 职责：在没有标签的情况下找结构。三条线：划分式聚类（K-Means）、
 *       概率式聚类（GMM + EM）、降维（PCA），并用 EM 把它们统一起来。
 * 依据：DDA3020_ML_Lecture_14_Intro_Unsupervised_Learning、15_Kmeans、
 *       16_GMM_EM、17_PCA。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch07',
  num: '07',
  title: '无监督学习：聚类、EM 与 PCA',
  en: 'UNSUPERVISED LEARNING',
  goals: [
    '说清聚类与降维各自回答什么问题，以及「没有标签时如何评价结果」',
    '写出 K-Means 的目标函数，并解释 Lloyd 算法为什么单调不增、为什么会停在局部最优',
    '用隐变量解释高斯混合模型，并写出 EM 的 E 步与 M 步',
    '说明 K-Means 是 GMM 在协方差趋于零时的极限情形',
    '从方差最大化与 SVD 两个角度推导 PCA，并正确选择主成分个数'
  ],
  kp: [
    { id: 'ch07-1', title: '无监督的任务形态' },
    { id: 'ch07-2', title: 'K-Means 的目标与 Lloyd 算法' },
    { id: 'ch07-3', title: 'k 的选择与 K-Means 的局限' },
    { id: 'ch07-4', title: '高斯混合与隐变量' },
    { id: 'ch07-5', title: 'EM：E 步与 M 步' },
    { id: 'ch07-6', title: '从 EM 看 K-Means' },
    { id: 'ch07-7', title: 'PCA：方差最大化与 SVD' },
    { id: 'ch07-8', title: '常见错误与自查' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '没有标签时，我们到底在学什么', html: '监督学习的目标由标签定义，对错清楚；无监督学习没有标准答案，只能靠<b>对数据结构的假设</b>来定义「好」。K-Means 假设「簇是球形的、大小相近」；GMM 假设「数据由若干高斯混合生成」；PCA 假设「重要信息在方差大的方向上」。所以这一章的重点不是算法步骤，而是<b>每个方法背后的假设，以及假设被违反时会发生什么</b>。' },

    { t: 'p', lead: true, html: '无监督学习有两大任务。<b>聚类</b>回答「哪些样本属于一类」，输出是离散的分组；<b>降维</b>回答「用哪几个方向就能概括数据」，输出是低维表示。两者经常配合使用：先 PCA 降维再聚类，或者用聚类结果做新特征喂给监督模型。这一章按「划分式 → 概率式 → 降维」的顺序走，最后用 EM 把前两者统一。' },

    { t: 'h', lvl: 2, text: '一、无监督的任务形态', id: 'ch07-1' },

    { t: 'p', html: '聚类（clustering）把样本分成若干组，使组内相似、组间不同。难点在「相似」怎么定义：欧氏距离假设各向同性，余弦相似度关心方向、忽略长度，马氏距离考虑协方差。选错度量，后面所有步骤都白做——<b>聚类的效果上限由距离度量决定</b>。' },

    { t: 'p', html: '降维（dimensionality reduction）把 <code>d</code> 维数据压到 <code>k</code> 维，目的有三个：可视化（压到 2 维）、去噪（丢掉方差小的方向）、加速（下游模型的特征变少）。它与特征选择不同：特征选择是挑原始列的子集，降维是造新的线性或非线性组合，<b>可解释性更差但压缩率更高</b>。' },

    { t: 'p', html: '无监督的评估是个真问题。没有标签就没有「准确率」，只能用两类指标。<b>内部指标</b>只看数据本身：轮廓系数、Davies-Bouldin、Calinski-Harabasz、以及重建误差。<b>外部指标</b>需要额外标签（哪怕只是少量人工标注）：调整兰德指数、归一化互信息。实践中更可靠的做法是<b>看结果对业务是否有解释力</b>——聚类出的组能不能被领域专家命名，往往比任何指标都重要。' },

    { t: 'p', html: '还有一个必须提前说清的陷阱：<b>聚类算法总会给你 k 个簇，哪怕数据里根本没有簇</b>。均匀分布的数据丢进 K-Means，它照样把空间切成 Voronoi 区域并报告「找到了 5 类」。所以拿到聚类结果，第一件事是检验「结构是否真的存在」，而不是直接解读每一类的含义。' },

    { t: 'h', lvl: 2, text: '二、K-Means 的目标与 Lloyd 算法', id: 'ch07-2' },

    { t: 'p', html: 'K-Means 的目标是最小化簇内平方和（inertia）：<code>J = Σ<sub>k</sub>Σ<sub>x∈C<sub>k</sub></sub>||x - μ<sub>k</sub>||<sup>2</sup></code>，其中 <code>μ<sub>k</sub></code> 是第 <code>k</code> 个簇的质心。这是一个组合优化问题：把 <code>n</code> 个点分到 <code>k</code> 组有 <code>k<sup>n</sup></code> 种分法，穷举不可能。' },

    { t: 'p', html: 'Lloyd 算法用交替优化求解，两步循环：<b>分配步</b>固定质心，把每个点分给最近的质心（这步对固定 <code>μ</code> 是最优的）；<b>更新步</b>固定分配，把每个质心移到所属点的均值（这步对固定分配是最优的，因为均值最小化平方和）。两步都<b>不会让 <code>J</code> 上升</b>，而 <code>J</code> 有下界，所以算法必然收敛。' },

    { t: 'p', html: '但收敛到的是<b>局部最优</b>，不是全局最优。原因有二：分配是离散的，<code>J</code> 不是凸函数；结果强烈依赖初始化。两个补救：<b>k-means++</b> 初始化（第一个质心随机，后续按「离已选质心越远越可能被选中」的概率抽样），以及<b>多次重启取 inertia 最小</b>（sklearn 的 <code>n_init</code>，默认 10）。实践中这两条能把坏结果的出现率压到很低。' },

    { t: 'p', html: '复杂度是 <code>O(n·k·d·T)</code>，<code>T</code> 是迭代次数，通常几十次就收敛。所以 K-Means 极快，能处理百万级样本，这是它至今仍是「第一个该试的聚类方法」的原因。它的假设也很明确：<b>簇是凸的、各向同性的、大小相近的</b>。数据是长条形、环形、或密度差异极大时，K-Means 会给出违反直觉的切分。' },

    { t: 'code', lang: 'python', caption: 'K-Means：inertia 随 k 下降，但「肘部」才是可用的信号', code: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
from sklearn.metrics import silhouette_score

X, y_true = make_blobs(n_samples=600, centers=4, cluster_std=0.9,
                       random_state=0)

for k in range(2, 9):
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(X)
    sil = silhouette_score(X, km.labels_)
    print('k=%d  inertia=%9.1f  silhouette=%.3f' % (k, km.inertia_, sil))

km = KMeans(n_clusters=4, n_init=10, random_state=0).fit(X)
print('真实簇数 = 4, 预测簇数 =', len(np.unique(km.labels_)))
print('质心形状 =', km.cluster_centers_.shape)` },

    { t: 'p', html: 'inertia 随 <code>k</code> 单调下降，<code>k = n</code> 时为 0，所以不能取最小值。<b>肘部法</b>看曲线拐点：从 2 到 4 下降很快，4 之后变缓，拐点就在 4。但这个拐点经常不明显，更可靠的判据是轮廓系数（下一节）。这段代码还会告诉你一件重要的事：聚类结果与真实标签的编号无关，第 0 簇可能对应真实的第 2 类，<b>评估前必须先做标签匹配</b>。' },

    { t: 'h', lvl: 2, text: '三、k 的选择与 K-Means 的局限', id: 'ch07-3' },

    { t: 'p', html: '轮廓系数（silhouette）对每个点算 <code>s = (b - a)/max(a, b)</code>，其中 <code>a</code> 是到同簇其他点的平均距离、<code>b</code> 是到最近异簇的平均距离。取值 [-1, 1]：接近 1 表示「离本簇近、离异簇远」，接近 0 表示在边界上，负值表示可能分错了。全体平均就是聚类质量的一个内部度量，<b>它对簇的形状不敏感，比 inertia 更适合选 k</b>。' },

    { t: 'p', html: '除了轮廓系数，还有 Davies-Bouldin（越小越好）、Calinski-Harabasz（越大越好）。这些指标各有偏好，通常一起看：<b>如果三个指标都指向同一个 k，这个 k 才比较可信</b>。如果指标之间打架，说明数据结构本身模糊，任何 k 都只是人为切分。' },

    { t: 'p', html: 'K-Means 的局限要逐条记住。<b>第一，需要预先指定 k</b>，而 k 往往正是未知的。<b>第二，假设球形簇</b>：两个长条形簇会被沿短轴切开。<b>第三，对尺度敏感</b>：某个特征量纲大十倍，距离就被它主导，所以必须先标准化。<b>第四，对离群点敏感</b>：均值不是稳健统计量，一个极端点能把质心拉走。<b>第五，只能给出硬分配</b>：边界上的点属于哪一簇没有概率可言。' },

    { t: 'p', html: '对应五种局限，有五种改法：用 GMM 处理概率与椭圆簇（下一节）；用 DBSCAN 处理任意形状与噪声；用 K-Medoids 抵抗离群点；用层次聚类避免预先指定 k；用谱聚类处理非凸结构。这一章只深入 GMM，其余方法知道「它们为什么存在」即可。' },

    { t: 'p', html: '还有一个工程细节：<code>MiniBatchKMeans</code> 每次只用一个小批量更新质心，速度提升一个量级，代价是 inertia 略高。样本超过十万时它是默认选择，先用它粗分，再用全量 K-Means 在少量候选上精修，是常见的两阶段做法。' },

    { t: 'h', lvl: 2, text: '四、高斯混合与隐变量', id: 'ch07-4' },

    { t: 'p', html: 'K-Means 的硬分配太武断。换个生成式假设：数据由 <code>K</code> 个高斯分布混合生成，每个样本先按概率 <code>π<sub>k</sub></code> 选一个成分，再从 <code>N(μ<sub>k</sub>, Σ<sub>k</sub>)</code> 采样。于是 <code>p(x) = Σ<sub>k</sub>π<sub>k</sub>N(x | μ<sub>k</sub>, Σ<sub>k</sub>)</code>，这就是高斯混合模型（Gaussian mixture model, GMM）。' },

    { t: 'p', html: '这里引入了一个<b>隐变量</b>（latent variable）<code>z<sub>i</sub> ∈ {1..K}</code>，表示「第 <code>i</code> 个样本来自哪个成分」。我们能看见 <code>x</code>，看不见 <code>z</code>。这个「看不见」正是困难的来源：如果 <code>z</code> 已知，每一类的参数就是简单的样本均值与协方差（有闭式解）；如果参数已知，<code>z</code> 的后验也能直接算。偏偏两者都未知。' },

    { t: 'p', html: 'GMM 比 K-Means 灵活的地方在协方差矩阵。<code>Σ<sub>k</sub></code> 可以是全协方差（每个簇有自己的椭圆朝向）、对角（轴对齐）、球形（各向同性）、或所有簇共享一个 <code>Σ</code>。<code>covariance_type</code> 的选择是偏差-方差的又一次权衡：全协方差参数最多（每个簇 <code>d(d+1)/2</code> 个），高维小样本时极易过拟合甚至奇异；球形最省参数，退化成 K-Means 的软版本。' },

    { t: 'p', html: '参数估计不能直接求导，因为对数似然里 log 内部有求和：<code>ℓ = Σ<sub>i</sub>log(Σ<sub>k</sub>π<sub>k</sub>N(x<sub>i</sub>|μ<sub>k</sub>,Σ<sub>k</sub>))</code>。对 <code>μ<sub>k</sub></code> 求导会得到「每个样本按后验加权」的形式，而后验又依赖参数——这是一个鸡生蛋问题。EM 算法正是为这类问题设计的。' },

    { t: 'h', lvl: 2, text: '五、EM：E 步与 M 步', id: 'ch07-5' },

    { t: 'p', html: 'EM（expectation-maximization）的思路是：既然 <code>z</code> 看不见，就用当前参数猜它的分布，然后在这个「猜的分布」下最大化期望对数似然。两步循环：' },

    { t: 'steps', items: [
      { title: 'E 步 · 算责任度', html: '用当前参数计算每个样本属于每个成分的后验概率（叫责任度 responsibility）：<code>γ<sub>ik</sub> = π<sub>k</sub>N(x<sub>i</sub>|μ<sub>k</sub>,Σ<sub>k</sub>) / Σ<sub>j</sub>π<sub>j</sub>N(x<sub>i</sub>|μ<sub>j</sub>,Σ<sub>j</sub>)</code>。它满足 <code>Σ<sub>k</sub>γ<sub>ik</sub> = 1</code>。' },
      { title: 'M 步 · 重估参数', html: '把责任度当权重，更新三个参数：<code>N<sub>k</sub> = Σ<sub>i</sub>γ<sub>ik</sub></code>、<code>π<sub>k</sub> = N<sub>k</sub>/n</code>、<code>μ<sub>k</sub> = (1/N<sub>k</sub>)Σ<sub>i</sub>γ<sub>ik</sub>x<sub>i</sub></code>、<code>Σ<sub>k</sub> = (1/N<sub>k</sub>)Σ<sub>i</sub>γ<sub>ik</sub>(x<sub>i</sub>-μ<sub>k</sub>)(x<sub>i</sub>-μ<sub>k</sub>)<sup>T</sup></code>。' },
      { title: '迭代与停止', html: '重复 E/M 直到对数似然增量小于阈值或达到最大迭代次数。每次迭代对数似然<b>单调不减</b>，这是 EM 最重要的理论保证。' },
      { title: '收敛之后', html: '用 <code>γ<sub>ik</sub></code> 做软分配（取最大值为硬分配），用最终参数算每个样本的对数密度，极小值者可判为异常点。' }
    ] },

    { t: 'p', html: '为什么单调？因为 EM 优化的不是原始对数似然，而是它的一个下界（ELBO）：E 步让下界在当前参数处与真实似然相切，M 步抬高下界，两者叠加保证似然不降。这也解释了 EM 的两个特点：<b>收敛慢</b>（线性收敛，靠近最优时每步只进步一点）、<b>依赖初始化</b>（下界是非凸的，不同起点收敛到不同局部最优）。' },

    { t: 'p', html: '协方差矩阵还有个技术问题：如果某个成分只剩一个样本，<code>Σ<sub>k</sub></code> 会变成零矩阵、似然发散到无穷。这叫<b>奇异性</b>（singularity）。sklearn 用 <code>reg_covar</code>（默认 <code>1e-6</code>）给对角线加一个小正数来避免，训练时若看到 <code>ill-defined</code> 警告，通常就是某个簇塌缩了，可以调大 <code>reg_covar</code> 或减少成分数。' },

    { t: 'code', lang: 'python', caption: 'GMM：软分配、对数似然与协方差类型的选择', code: `import numpy as np
from sklearn.mixture import GaussianMixture
from sklearn.datasets import make_blobs

X, _ = make_blobs(n_samples=500, centers=3, cluster_std=[0.6, 1.2, 0.8],
                  random_state=1)

for cov in ['spherical', 'diag', 'full']:
    gmm = GaussianMixture(n_components=3, covariance_type=cov,
                          n_init=5, random_state=0).fit(X)
    print('%-9s BIC=%9.1f  mean log-lik=%.3f' % (
        cov, gmm.bic(X), gmm.score(X)))

best = GaussianMixture(n_components=3, covariance_type='full',
                       n_init=5, random_state=0).fit(X)
resp = best.predict_proba(X)          # 责任度矩阵 n x K
print('responsibility 形状 =', resp.shape, ' 每行和 =', resp.sum(1)[:3])
print('硬分配前 5 个 =', best.predict(X)[:5])
print('权重 =', np.round(best.weights_, 3))` },

    { t: 'p', html: '三种协方差类型里，<code>spherical</code> 参数最少、<code>full</code> 最多。<code>spherical</code> 的结果与 K-Means 很接近，<code>full</code> 能拟合椭圆的、倾斜的簇，但需要更多样本支撑。BIC 在「似然」与「参数量」之间做权衡，常用来选成分数——<b>BIC 越小越好</b>，注意它和 AIC 一样是相对比较，不是绝对好坏。' },

    { t: 'h', lvl: 2, text: '六、从 EM 看 K-Means', id: 'ch07-6' },

    { t: 'p', html: '把 GMM 的协方差限制成 <code>Σ<sub>k</sub> = σ<sup>2</sup>I</code>（所有簇共享、各向同性），并令 <code>σ<sup>2</sup> → 0</code>，责任度会退化成「只给最近的那个簇 1，其余 0」——<b>软分配变成硬分配</b>。此时 E 步就是「把点分给最近质心」，M 步就是「质心取均值」，正是 Lloyd 算法。' },

    { t: 'p', html: '这个视角很有用。它说明 K-Means 是 GMM 的一个<b>极限特例</b>，两者的关系类似「硬阈值 vs 软概率」。也解释了为什么 K-Means 对簇形状的假设那么强：它等价于假设所有簇都是同一个球、且球的半径趋于零。想要椭圆簇、想要概率输出、想要「这个点 60% 属于 A、40% 属于 B」的信息，就必须用 GMM。' },

    { t: 'p', html: '反过来说，GMM 也有 K-Means 没有的麻烦：参数更多、更容易过拟合、需要更多样本、对初始化更敏感、可能遇到奇异性。所以选择的判据不是「谁更高级」，而是<b>「簇的形状是否真的需要椭圆、是否需要概率输出」</b>。数据量大、簇近似球形时，K-Means 更快更稳；样本中等、簇明显是椭圆时，GMM 更合适。' },

    { t: 'compare', left: { title: 'K-Means', html: '硬分配；目标是最小化簇内平方和；假设球形、等大小；复杂度 <code>O(nkdT)</code>；用 inertia 与轮廓系数评估。' }, right: { title: 'GMM + EM', html: '软分配（责任度）；目标是最大化似然；可学椭圆与不同大小；复杂度更高；用对数似然、AIC/BIC 评估。' } },

    { t: 'h', lvl: 2, text: '七、PCA：方差最大化与 SVD', id: 'ch07-7' },

    { t: 'p', html: 'PCA（principal component analysis）要找一组正交方向，把数据投影上去后<b>方差最大</b>。第一个方向 <code>w<sub>1</sub></code> 解 <code>max<sub>||w||=1</sub> w<sup>T</sup>Σw</code>，用拉格朗日乘子得 <code>Σw = λw</code>——<b>最优方向就是协方差矩阵的最大特征向量</b>，最大值就是对应的特征值。第二个方向在与 <code>w<sub>1</sub></code> 正交的约束下重复，得到第二大特征向量，依此类推。' },

    { t: 'p', html: '所以 PCA 的全部内容可以压缩成一句话：<b>对中心化后的数据做特征值分解（或 SVD），取最大的 <code>k</code> 个特征向量作为投影方向</b>。用 SVD 更稳：设中心化矩阵 <code>X<sub>c</sub> = UΣV<sup>T</sup></code>，则 <code>V</code> 的前 <code>k</code> 列就是主成分方向，投影后的坐标是 <code>X<sub>c</sub>V<sub>k</sub> = U<sub>k</sub>Σ<sub>k</sub></code>，奇异值的平方除以 <code>n-1</code> 就是特征值。数值上 SVD 不需要显式形成 <code>X<sup>T</sup>X</code>，条件数更好。' },

    { t: 'p', html: '两个「必须做」的预处理：<b>中心化</b>（否则第一主成分会指向均值方向，毫无信息）、以及<b>是否标准化</b>的判断。如果不标准化，量纲大的特征会主导方差，PCA 退化成「找量纲最大的那几个特征」。当各特征单位不同（身高 cm 与收入元），应当标准化；当单位相同、你确实想保留方差差异（比如同一传感器阵列），可以不标准化。' },

    { t: 'p', html: '选几个主成分？看累计解释方差比 <code>Σ<sub>i≤k</sub>λ<sub>i</sub>/Σ<sub>i</sub>λ<sub>i</sub></code>，常见阈值是 85%、90% 或 95%。也可以看碎石图（scree plot）的拐点。还有一条更实用的判据：<b>把 PCA 当作下游模型的一步，用交叉验证选 k</b>——降维的目的是提升下游表现，不是让解释方差比好看。' },

    { t: 'p', html: 'PCA 的局限要认清。它是<b>线性</b>方法，流形弯曲（比如瑞士卷）时无法展开；它<b>只保证方差大</b>，方差大的方向不一定对分类有用（LDA 才是「类间可分」的准则）；它对<b>离群点敏感</b>，因为方差是平方量；主成分是原始特征的线性组合，<b>通常难以命名</b>。做可视化时，t-SNE 与 UMAP 往往比 PCA 好看，但它们不保距、不能用于下游建模，只适合展示。' },

    { t: 'code', lang: 'python', caption: 'PCA：解释方差比、重建误差与降维后的聚类', code: `import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_digits
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

X, y = load_digits(return_X_y=True)          # 1797 x 64
Xs = StandardScaler().fit_transform(X)

pca = PCA(n_components=0.95).fit(Xs)         # 保留 95% 方差
print('保留主成分数 =', pca.n_components_)
print('前 5 个解释方差比 =', np.round(pca.explained_variance_ratio_[:5], 3))
print('累计 =', round(pca.explained_variance_ratio_.sum(), 3))

Z = pca.transform(Xs)
recon = pca.inverse_transform(Z)
print('重建 MSE =', round(((Xs - recon) ** 2).mean(), 4))

Z2 = PCA(n_components=2).fit_transform(Xs)
km = KMeans(n_clusters=10, n_init=10, random_state=0).fit(Z2)
print('2 维轮廓系数 =', round(silhouette_score(Z2, km.labels_), 3))` },

    { t: 'p', html: '在手写数字上，通常 30 个左右主成分就能保留 95% 的方差，而原始是 64 维——压缩近一半，重建误差却很小。这说明<b>像素之间存在大量冗余</b>，方差集中在少数方向上。但注意后面那行：在 2 维 PCA 上做 10 类聚类，轮廓系数通常很低（0.3 以下），因为 10 类数字在 2 维里严重重叠。<b>「能可视化」和「能分开」是两回事</b>，这是降维最容易被误用的地方。' },

    { t: 'h', lvl: 2, text: '八、常见错误与自查', id: 'ch07-8' },

    { t: 'table', head: ['错误做法', '后果', '正确做法'], rows: [
      ['不标准化就做 K-Means 或 PCA', '量纲大的特征主导距离与方差', '先 <code>StandardScaler</code>，再聚类或降维'],
      ['用 inertia 最小选 k', 'inertia 随 k 单调下降，永远选最大 k', '肘部法 + 轮廓系数 + 业务解释'],
      ['把聚类结果当真实类别', '簇编号与真实标签无对应关系', '先做标签匹配，再用 ARI/NMI 评估'],
      ['GMM 用 full 协方差且样本很少', '协方差奇异、似然发散', '减小 <code>n_components</code>、用 diag/spherical、调大 <code>reg_covar</code>'],
      ['PCA 前不中心化', '第一主成分指向均值方向', '<code>PCA</code> 内部会中心化，手写实现要自己做'],
      ['用 PCA 降维后再划分训练/测试', '测试集信息泄漏', '在 Pipeline 内 fit，只在训练折上算'],
      ['拿 t-SNE 的图当聚类证据', 't-SNE 会制造虚假的簇结构', '可视化用 t-SNE，定量评估用轮廓系数']
    ], caption: '前两条是最高频的误用，后五条是流程与解释上的陷阱' },

    { t: 'p', html: '自查三问：<b>距离度量与数据尺度匹配吗？k 是我选的还是数据支持的？这些簇能被业务命名吗？</b> 第三问最容易被跳过，但它才是聚类有没有价值的最终判据。如果一个簇无法用一句话描述，它大概率只是算法在连续空间里人为切出的一块。' },

    { t: 'terms', items: [
      { en: 'inertia', zh: '簇内平方和', html: 'K-Means 的目标函数，等于各点到所属质心的平方距离之和。' },
      { en: 'silhouette', zh: '轮廓系数', html: '<code>(b-a)/max(a,b)</code>，衡量点与本簇、最近异簇的相对距离，取值 [-1,1]。' },
      { en: 'latent variable', zh: '隐变量', html: '观测不到、但影响观测的变量；GMM 中表示样本来自哪个成分。' },
      { en: 'responsibility', zh: '责任度', html: 'E 步算出的后验概率 <code>γ<sub>ik</sub></code>，表示样本 <code>i</code> 属于成分 <code>k</code> 的软归属。' },
      { en: 'ELBO', zh: '证据下界', html: '对数似然的下界；E 步让它与似然相切，M 步抬高它，因而似然单调不减。' },
      { en: 'explained variance ratio', zh: '解释方差比', html: '第 <code>i</code> 个主成分的特征值占总特征值的比例。' },
      { en: 'whitening', zh: '白化', html: '在 PCA 基础上把各方向缩放到单位方差，使协方差变为单位阵。' }
    ] },

    { t: 'quiz', qid: 'ch07-q1' },
    { t: 'quiz', qid: 'ch07-q2' },
    { t: 'quiz', qid: 'ch07-q3' },

    { t: 'keypoint', items: [
      { title: '聚类效果上限由距离度量决定', html: '度量选错，算法再调也没用；标准化是默认动作。' },
      { title: 'Lloyd 两步都单调不增', html: '分配步与更新步各自最优，所以收敛；但只保证局部最优。' },
      { title: 'K-Means 假设球形等大小簇', html: '长条、环形、密度差异大时必然失效。' },
      { title: 'EM 单调不减但收敛慢', html: 'E 步算责任度、M 步重估参数；依赖初始化，可能遇到奇异性。' },
      { title: 'K-Means 是 GMM 的极限', html: '共享球形协方差且 <code>σ<sup>2</sup>→0</code> 时，软分配退化为硬分配。' },
      { title: 'PCA = 协方差的最大特征向量', html: '用 SVD 实现更稳；中心化必做，标准化视情况而定。' },
      { title: '能可视化不等于能分开', html: '2 维 PCA 上聚类往往重叠严重，别拿图当证据。' }
    ] },

    { t: 'checklist', id: 'ch07', items: [
      '我能说清聚类与降维各自回答什么问题，以及如何评估',
      '我能写出 K-Means 的目标函数，并证明 Lloyd 两步都不会让 J 上升',
      '我能解释 K-Means 为什么只收敛到局部最优，以及两种补救',
      '我能用轮廓系数与肘部法选 k，并说明各自局限',
      '我能写出 GMM 的似然与隐变量含义',
      '我能写出 EM 的 E 步与 M 步公式，并解释单调性来源',
      '我能说明 K-Means 是 GMM 的哪种极限情形',
      '我能从方差最大化与 SVD 两个角度推导 PCA',
      '我能正确选择主成分个数，并说出 PCA 的四条局限'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 DDA3020_ML_Lecture_14_Intro_Unsupervised_Learning、15_Kmeans、16_GMM_EM、17_PCA 组织，覆盖聚类与降维的任务形态、内部与外部评估指标、K-Means 目标与 Lloyd 算法、k-means++ 与多次重启、k 的选择与五条局限、GMM 的生成假设与隐变量、EM 的 E/M 步与 ELBO 单调性、协方差类型与奇异性、K-Means 与 GMM 的极限关系、PCA 的方差最大化与 SVD 推导、解释方差比与重建误差。讲义中的谱聚类、DBSCAN、t-SNE/UMAP、以及 EM 的完整 ELBO 推导属于扩展内容，本站只在必要处点名；章内三段代码（K-Means 与轮廓系数、GMM 协方差类型、PCA 降维）均可独立运行复现。' }
  ]
});
