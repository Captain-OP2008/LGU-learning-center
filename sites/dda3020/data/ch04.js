/* =====================================================================
 * ch04.js · 第 4 章「决策树与集成学习」
 * 职责：讲清「一棵树怎么长出来」与「很多棵树怎么合起来」，把不纯度、
 *       贪心分裂、剪枝、bagging、boosting 串成一条线。
 * 依据：DDA3020_ML_Lecture_08_Tree_Methods、DDA3020_Week_07_Decision_Trees.pptx。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch04',
  num: '04',
  title: '决策树与集成学习',
  en: 'TREE METHODS & ENSEMBLES',
  goals: [
    '用「轴对齐的矩形切分」解释决策树能表达什么、不能表达什么',
    '手算 Gini 不纯度与信息增益，说明为什么分裂要贪心选最优特征与阈值',
    '写出回归树的方差下降准则，并解释叶子值为什么取均值',
    '用预剪枝与后剪枝控制树的复杂度，说明两者在偏差-方差上的差别',
    '区分 bagging 与 boosting 的并行性、偏差来源与调参重点',
    '解释随机森林的两个随机性与梯度提升的残差拟合'
  ],
  kp: [
    { id: 'ch04-1', title: '树为什么能切分空间' },
    { id: 'ch04-2', title: '不纯度：Gini 与熵' },
    { id: 'ch04-3', title: '信息增益与贪心分裂' },
    { id: 'ch04-4', title: '回归树与方差下降' },
    { id: 'ch04-5', title: '预剪枝与后剪枝' },
    { id: 'ch04-6', title: 'bagging 与随机森林' },
    { id: 'ch04-7', title: 'boosting 与梯度提升' },
    { id: 'ch04-8', title: '常见错误与自查' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么树模型至今仍是表格数据王者', html: '在结构化数据（Excel 表、数据库导出）上，梯度提升树经常打得过神经网络，而且不需要标准化、能处理缺失值、可解释性好。原因藏在它的归纳偏置里：<b>树假设「决策是若干个阈值判断的串联」</b>，这恰好符合人类做表格决策的方式。这一章把树的生长、剪枝与集成讲透，你在竞赛和实习里的第一把武器就有了。' },

    { t: 'p', lead: true, html: '这一章有两级结构。<b>第一级是一棵树</b>：怎么选分裂点、怎么控制深度、叶子输出什么。<b>第二级是很多棵树</b>：bagging 让它们并行投票降方差，boosting 让它们串行纠错降偏差。两级都建立在同一个基础上——树是「分段常数函数」，训练就是贪心地找最好的分段方式。' },

    { t: 'h', lvl: 2, text: '一、树为什么能切分空间', id: 'ch04-1' },

    { t: 'p', html: '一次分裂形如「<code>x<sub>j</sub> ≤ t</code> 往左，否则往右」。每分裂一次，特征空间就被一个与坐标轴平行的超平面切成两半。深度为 <code>D</code> 的树最多产生 <code>2<sup>D</sup></code> 个叶子，也就是把空间切成 <code>2<sup>D</sup></code> 个轴对齐的矩形（高维叫超矩形）。预测时新样本落进哪个矩形，就输出那个矩形里的多数类或均值。' },

    { t: 'p', html: '由此可以推出三个重要性质。<b>第一，边界只能是轴对齐的</b>：一棵树很难用少量节点表达 <code>y = x<sub>1</sub> + x<sub>2</sub></code> 这样的斜线边界，它只能用阶梯去逼近，需要很多次分裂。这也是为什么对线性关系强的数据，线性模型往往比单棵树更省参数。<b>第二，对特征单调变换不变</b>：把 <code>x</code> 换成 <code>log x</code>，分裂点跟着变，切分结果一样，所以树不需要标准化。<b>第三，树是分段常数</b>：叶子里的预测值在矩形内部恒定，函数不连续，无法外推——回归树在训练集范围之外只会输出边界值。' },

    { t: 'p', html: '树的训练是<b>贪心</b>的：每一步选当前看起来最好的分裂，选完就不再回头。这不能保证全局最优（找最优树是 NP 难问题），但计算可行、效果通常够好。理解这一点很重要：树的所有「毛病」——不稳定、容易过拟合、边界锯齿——都源自「贪心 + 分段常数」这两个设计选择。' },

    { t: 'p', html: '不稳定性值得单独说。训练数据改动一点点（比如删掉一个样本），最优分裂点可能移动，整棵树的结构随之大变，预测也跟着变。<b>高方差</b>是单棵树的典型病症，而 bagging 正是针对这个病症开的药——这也是下一节之后所有集成方法的动机。' },

    { t: 'h', lvl: 2, text: '二、不纯度：Gini 与熵', id: 'ch04-2' },

    { t: 'p', html: '节点「纯」意味着里面几乎只有一类样本。要选分裂，先得把「纯不纯」量化。设节点里第 <code>k</code> 类占比为 <code>p<sub>k</sub></code>，两个最常用的指标是：<b>Gini 不纯度</b> <code>Gini = 1 - Σp<sub>k</sub><sup>2</sup></code>，<b>熵</b> <code>H = -Σp<sub>k</sub>log<sub>2</sub>p<sub>k</sub></code>。两者都在「全是一类」时为 0，在「均匀混合」时最大（二分类时 Gini 最大 0.5，熵最大 1）。' },

    { t: 'p', html: '算一个具体例子。节点里 10 个样本，6 正 4 负：<code>Gini = 1 - (0.36 + 0.16) = 0.48</code>；<code>H = -(0.6log<sub>2</sub>0.6 + 0.4log<sub>2</sub>0.4) ≈ 0.971</code>。如果分成两个节点，左 5 个全正、右 5 个（1 正 4 负），则左 <code>Gini = 0</code>、右 <code>Gini = 1 - (0.04 + 0.64) = 0.32</code>，加权平均 <code>(5/10)·0 + (5/10)·0.32 = 0.16</code>。分裂把不纯度从 0.48 降到 0.16，这就是这次分裂的收益。' },

    { t: 'p', html: '两个指标有什么区别？Gini 只用到平方，计算更快（sklearn 默认），且对多数类的惩罚略重；熵用到对数，对「中间比例」更敏感，理论上与信息论直接对应。实践中两者给出的树<b>几乎一样</b>，差异远小于超参数的影响。真正需要注意的是：<b>不纯度是节点级的局部指标，不纯度下降最多不等于泛化最好</b>——这正是剪枝存在的理由。' },

    { t: 'table', head: ['指标', '公式', '二分类最大值', '特点'], rows: [
      ['Gini 不纯度', '<code>1 - Σp<sub>k</sub><sup>2</sup></code>', '0.5', '快，sklearn 默认，偏向多数类'],
      ['熵', '<code>-Σp<sub>k</sub>log<sub>2</sub>p<sub>k</sub></code>', '1.0', '与信息增益配套，对中间比例敏感'],
      ['误分类率', '<code>1 - max<sub>k</sub>p<sub>k</sub></code>', '0.5', '不可导，不适合做分裂准则'],
      ['方差（回归）', '<code>(1/m)Σ(y<sub>i</sub> - ȳ)<sup>2</sup></code>', '—', '回归树的对应物，见第四节']
    ], caption: '前三个用于分类，第四个用于回归；误分类率看着直观，实际几乎不用' },

    { t: 'h', lvl: 2, text: '三、信息增益与贪心分裂', id: 'ch04-3' },

    { t: 'p', html: '信息增益（information gain）定义为分裂前后的熵差：<code>IG = H(parent) - Σ(m<sub>child</sub>/m)·H(child)</code>，其中 <code>m</code> 是样本数。它是 ID3 算法的分裂准则；C4.5 改用<b>增益率</b> <code>IG / splitinfo</code> 来惩罚「取值特别多的特征」——否则用 ID 号做特征，每个样本一个叶子，增益最大但毫无意义。CART 用 Gini，分裂规则是二叉的，这也是 sklearn 的实现。' },

    { t: 'p', html: '对连续特征，候选阈值不是无限的。把该特征排序，只在<b>相邻异类样本的中点</b>试切，最多 <code>n - 1</code> 个候选；对每个候选算加权不纯度，取最小。特征有 <code>d</code> 维、样本 <code>n</code> 个时，一次分裂的代价约 <code>O(d·n log n)</code>（排序占大头）。这就是为什么树在特征很多时训练会慢——每一层都要把所有特征重新扫一遍。' },

    { t: 'p', html: '有三个实现细节影响结果。<b>类别特征</b>：sklearn 的树只接受数值，需要 one-hot 或目标编码，而 one-hot 会让「取值多」的特征获得不公平的优势。<b>缺失值</b>：sklearn 的 <code>DecisionTreeClassifier</code> 不接受缺失值，必须先填充或加缺失指示列；要原生支持缺失值，可改用 <code>HistGradientBoostingClassifier</code>，LightGBM/XGBoost 也让缺失值走默认分支。<b>样本权重</b>：加权 Gini 只需把 <code>p<sub>k</sub></code> 换成加权占比，这一点在处理类别不平衡时很有用。' },

    { t: 'p', html: '贪心分裂的局限要认清。它只看一步，可能错过「先分 A 没收益、但分了 A 之后分 B 收益极大」的组合；它也不做特征交互的显式建模，斜边界只能靠阶梯逼近。这两点靠「多棵树」而不是「更聪明的单棵树」来弥补，这是集成方法的基本思路。' },

    { t: 'code', lang: 'python', caption: '手算 Gini 与信息增益，验证「分裂收益」的计算方式', code: `import numpy as np

def gini(y):
    if len(y) == 0:
        return 0.0
    p = np.bincount(y) / len(y)
    return 1.0 - np.sum(p ** 2)

def gain(y, left_mask):
    yl, yr = y[left_mask], y[~left_mask]
    return gini(y) - (len(yl) / len(y)) * gini(yl) - (len(yr) / len(y)) * gini(yr)

# 父节点：6 正 4 负
y = np.array([1] * 6 + [0] * 4)
print('parent gini =', round(gini(y), 4))

# 候选分裂 A：左 5 全正，右 1 正 4 负
mask_a = np.array([True] * 5 + [False] * 5)
print('gain A =', round(gain(y, mask_a), 4))

# 候选分裂 B：左 3 正 2 负，右 3 正 2 负（几乎没帮助）
mask_b = np.array([True] * 5 + [False] * 5) & np.array([True, True, False, False, False] * 2)
print('gain B =', round(gain(y, mask_b), 4))` },

    { t: 'p', html: '算出来 A 的增益约 0.32、B 的增益接近 0，与手算一致。把这套逻辑写成循环遍历所有特征与阈值，就是一棵 CART 的完整训练过程。真正实现里还要处理「最小分裂样本数」「最小叶子样本数」这类停止条件，它们直接决定树能长多深。' },

    { t: 'h', lvl: 2, text: '四、回归树与方差下降', id: 'ch04-4' },

    { t: 'p', html: '回归树把「不纯度」换成<b>方差</b>：节点内 <code>Var = (1/m)Σ(y<sub>i</sub> - ȳ)<sup>2</sup></code>，分裂准则是最小化加权方差 <code>Σ(m<sub>child</sub>/m)·Var(child)</code>。叶子输出该叶子里 <code>y</code> 的均值——这是平方损失下的最优常数预测，与 ch02 的「最小二乘解是投影」是同一个结论。' },

    { t: 'p', html: '回归树最需要注意的是<b>不能外推</b>。叶子的输出只能是训练集里某个区域 <code>y</code> 的均值，所以测试样本落在训练范围之外时，预测值被「钉」在边界叶子的均值上，不会随 <code>x</code> 继续增长。用它做时间序列预测或房价预测时，这一点会系统性低估高价房。' },

    { t: 'p', html: '回归树也是梯度提升的基本单元（第七节）。GBDT 每一轮拟合的是「当前模型残差」，而残差是连续的，所以必须用回归树。分类任务里虽然标签离散，但提升时拟合的是对数几率或梯度，仍然是回归树。这个细节解释了为什么 <code>GradientBoostingClassifier</code> 内部的基学习器是 <code>DecisionTreeRegressor</code>。' },

    { t: 'h', lvl: 2, text: '五、预剪枝与后剪枝', id: 'ch04-5' },

    { t: 'p', html: '不加限制的树会一直分裂到每个叶子只有一个样本，训练误差为零、测试误差爆炸。<b>预剪枝</b>（pre-pruning）在生长时提前停：限制 <code>max_depth</code>、<code>min_samples_split</code>、<code>min_samples_leaf</code>、<code>min_impurity_decrease</code>。<b>后剪枝</b>（post-pruning）先长满，再从下往上把「剪掉后验证误差不升」的子树换成叶子，代价复杂度剪枝（cost-complexity pruning）用 <code>R(T) + α|T|</code> 衡量，<code>α</code> 用交叉验证选。' },

    { t: 'p', html: '两者的差别在偏差-方差上。<b>预剪枝是「不给自己犯错的机会」</b>：可能过早停止，错过「先分一次亏、再分一次赚」的组合，偏差偏大，但计算便宜。<b>后剪枝是「先长出来再看」</b>：能看到完整结构再决定砍哪里，通常泛化更好，代价是训练更贵。sklearn 的 <code>ccp_alpha</code> 就是后剪枝参数，<code>ccp_alpha = 0</code> 表示不剪。' },

    { t: 'p', html: '实践中最有效的往往是<b>组合</b>：先设一个不太紧的 <code>max_depth</code>（比如 8–12）防止内存爆炸，再用 <code>ccp_alpha</code> 或验证集早停做二次控制。另外要区分「树深」和「叶子数」：<code>max_leaf_nodes</code> 直接控制模型容量，比 <code>max_depth</code> 更贴近「分段常数函数的段数」，在 boosting 里通常更好调。' },

    { t: 'code', lang: 'python', caption: '深度与泛化的关系：训练分一直涨，测试分先升后降', code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

X, y = make_classification(n_samples=1000, n_features=12, n_informative=5,
                           n_redundant=0, flip_y=0.1, random_state=1)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=1)

for depth in [1, 2, 3, 5, 8, 12, None]:
    tree = DecisionTreeClassifier(max_depth=depth, random_state=0).fit(Xtr, ytr)
    print('depth=%-4s train=%.3f test=%.3f leaves=%d' % (
        depth, tree.score(Xtr, ytr), tree.score(Xte, yte), tree.get_n_leaves()))` },

    { t: 'p', html: '典型输出：深度 1–2 时训练与测试都在 0.7 出头（欠拟合）；深度 5 时测试最高；深度 12 与不限制时训练接近 1.0、测试掉到 0.8 以下。这条「训练单调上升、测试先升后降」的曲线是过拟合的标准形状，ch06 会用学习曲线再讲一遍。<b>树是观察过拟合最直观的模型</b>，因为它的容量可以用「叶子数」直接读出来。' },

    { t: 'h', lvl: 2, text: '六、bagging 与随机森林', id: 'ch04-6' },

    { t: 'p', html: 'bagging（bootstrap aggregating）的做法：从 <code>n</code> 个样本里有放回地抽 <code>n</code> 个，训练一棵树；重复 <code>B</code> 次；预测时分类投票、回归取平均。每棵树看到约 <code>63.2%</code> 的不同样本（<code>1 - 1/e</code>），剩下的是袋外样本（out-of-bag, OOB），可以直接用来估泛化误差，不必额外划分验证集。' },

    { t: 'p', html: '为什么能降方差？设 <code>B</code> 个模型的预测方差各为 <code>σ<sup>2</sup></code>、两两相关系数为 <code>ρ</code>，则平均后的方差是 <code>ρσ<sup>2</sup> + (1-ρ)σ<sup>2</sup>/B</code>。第二项随 <code>B</code> 增大趋于零，<b>第一项由相关性决定，加多少棵树都消不掉</b>。所以 bagging 的关键不是「多」，而是「让树之间不相关」。' },

    { t: 'p', html: '随机森林（random forest）在 bagging 上再加一层随机：每次分裂时只从 <code>d</code> 个特征里随机抽 <code>m</code> 个候选（分类常用 <code>√d</code>，回归常用 <code>d/3</code>）。这层随机性刻意削弱了强特征的主导地位，把树之间的相关性 <code>ρ</code> 压下来，正好打在方差公式的第一项上。这是「随机森林比纯 bagging 更好」的精确解释。' },

    { t: 'p', html: '代价是偏差略升（每棵树能看到的信息变少），但方差降得更多，净效果通常是泛化更好。随机森林几乎不需要调参就能给出一个强基线：<code>n_estimators</code> 取 300–500、<code>max_features</code> 用默认、<code>min_samples_leaf</code> 取 1–5，剩下交给 OOB 分数。它的<b>特征重要性</b>（不纯度下降的平均）要谨慎使用：对高基数特征有偏，相关特征之间会互相分摊，最好用置换重要性（permutation importance）交叉验证。' },

    { t: 'h', lvl: 2, text: '七、boosting 与梯度提升', id: 'ch04-7' },

    { t: 'p', html: 'boosting 的思路完全不同：串行地训练一系列<b>弱学习器</b>，每一个都专注纠正前面犯的错。AdaBoost 提高被分错样本的权重；梯度提升（gradient boosting）把这个想法推广成「拟合负梯度」：设当前模型 <code>F<sub>t-1</sub></code>，计算残差 <code>r<sub>i</sub> = y<sub>i</sub> - F<sub>t-1</sub>(x<sub>i</sub>)</code>，训练一棵回归树 <code>h<sub>t</sub></code> 去拟合 <code>r</code>，然后 <code>F<sub>t</sub> = F<sub>t-1</sub> + ν·h<sub>t</sub></code>，<code>ν</code> 是学习率（shrinkage）。' },

    { t: 'p', html: '对平方损失，负梯度恰好就是残差，所以「拟合残差」和「梯度下降」在这里是一回事。换成对数损失（分类）时，负梯度不再是残差而是「<code>y - p</code>」乘某个权重，这就是为什么 GBDT 分类要用回归树拟合梯度而不是直接拟合标签。理解这一层，你就能自己把 GBDT 推广到任意可微损失——这也是 XGBoost、LightGBM 的起点。' },

    { t: 'p', html: 'boosting 主要降<b>偏差</b>：每加一棵树，模型容量就增加一点，训练误差单调下降。所以它的过拟合风险来自「树太多、学习率太大、单棵树太深」。调参的重点顺序是：先定 <code>n_estimators</code> 与 <code>learning_rate</code>（二者此消彼长，常用 0.05–0.1 配几百到几千棵），再定树的复杂度（<code>max_depth</code> 3–8，或 <code>num_leaves</code> 31 左右），最后用早停（early stopping）在验证损失不再下降时停。' },

    { t: 'compare', left: { title: 'bagging / 随机森林', html: '并行训练，每棵树独立；靠<b>降方差</b>取胜；单棵树可以很深；几乎不用调参；对噪声与离群点较稳健。' }, right: { title: 'boosting / GBDT', html: '串行训练，后一棵依赖前一棵；靠<b>降偏差</b>取胜；单棵树很浅（3–8 层）；对学习率、树数、早停敏感；容易在噪声标签上过拟合。' } },

    { t: 'table', head: ['', '随机森林', '梯度提升树'], rows: [
      ['训练方式', '并行、独立', '串行、依赖'],
      ['主要作用', '降方差', '降偏差'],
      ['树的深度', '深（不限制）', '浅（3–8）'],
      ['关键超参', '<code>n_estimators</code>、<code>max_features</code>', '<code>learning_rate</code>、<code>n_estimators</code>、<code>max_depth</code>'],
      ['过拟合表现', '加树不会明显变差', '加树过多会过拟合'],
      ['训练速度', '易并行，快', '难并行（XGBoost/LightGBM 有优化）'],
      ['典型场景', '快速基线、特征筛选', '竞赛与生产的主力']
    ], caption: '两者不是「谁更好」，而是「治不同的病」' },

    { t: 'code', lang: 'python', caption: '随机森林与梯度提升在同一份数据上的对比（含 OOB 与早停）', code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=2000, n_features=20, n_informative=8,
                           n_redundant=2, flip_y=0.05, random_state=7)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=7)

rf = RandomForestClassifier(n_estimators=400, oob_score=True,
                            n_jobs=-1, random_state=0).fit(Xtr, ytr)
print('RF  oob=%.3f  test=%.3f' % (rf.oob_score_, rf.score(Xte, yte)))

gb = GradientBoostingClassifier(n_estimators=500, learning_rate=0.05,
                                max_depth=3, subsample=0.8,
                                n_iter_no_change=20, validation_fraction=0.15,
                                random_state=0).fit(Xtr, ytr)
print('GB  trees=%d  test=%.3f' % (gb.n_estimators_, gb.score(Xte, yte)))
print('GB  top-3 features =', np.argsort(gb.feature_importances_)[::-1][:3])` },

    { t: 'p', html: '在 2000 条、20 维的数据上，两者通常都能到 0.9 以上，差距在 1–2 个百分点内。真正的差别出现在数据规模上：样本到几十万、特征到几千时，随机森林的并行优势明显；而 boosting 在中等规模上通常精度更高。生产环境里更常用 LightGBM 或 XGBoost，它们针对分裂查找与直方图做了工程优化，接口与本节的 sklearn 版本类似。' },

    { t: 'h', lvl: 2, text: '八、常见错误与自查', id: 'ch04-8' },

    { t: 'table', head: ['错误做法', '后果', '正确做法'], rows: [
      ['不限制深度就训练单棵树', '训练 100%、测试崩，叶子数爆炸', '设 <code>max_depth</code>/<code>max_leaf_nodes</code>，或改用集成'],
      ['用训练集的不纯度重要性做特征选择', '高基数特征被高估', '用置换重要性 + 交叉验证'],
      ['把随机森林的 <code>n_estimators</code> 当调参重点', '加树只降方差，边际收益很快耗尽', '优先调 <code>max_features</code>、<code>min_samples_leaf</code>'],
      ['boosting 不设早停', '树数过多，验证损失回升', '留验证集，<code>n_iter_no_change</code> 早停'],
      ['对 tree 做标准化/归一化', '不影响结果，白费功夫（但也不出错）', '把精力放在缺失值、类别编码、深度上'],
      ['用回归树做超出训练范围的外推', '预测被钉在边界值，系统性偏差', '改用线性模型或对目标做变换'],
      ['忽略类别不平衡', '树偏向多数类，少数类召回极低', '设 <code>class_weight</code> 或调阈值']
    ], caption: '前三条是「把树当线性模型用」的典型误解，后四条是工程细节' },

    { t: 'p', html: '自查三问：<b>我的树有多少叶子</b>（容量是否与样本量匹配）、<b>我的重要性是怎么算的</b>（是否被高基数特征污染）、<b>我的验证集有没有参与调参</b>（是否已经泄漏）。这三问同样适用于后面所有模型。' },

    { t: 'terms', items: [
      { en: 'impurity', zh: '不纯度', html: '节点内类别混合程度的度量，Gini 与熵是最常用的两种。' },
      { en: 'information gain', zh: '信息增益', html: '分裂前后熵的减少量，ID3 的分裂准则。' },
      { en: 'pruning', zh: '剪枝', html: '去掉对泛化无益的子树；预剪枝在生长时停，后剪枝长完再砍。' },
      { en: 'bagging', zh: '自助聚合', html: '有放回采样训练多个模型再平均，主要降低方差。' },
      { en: 'out-of-bag', zh: '袋外样本', html: '每次 bootstrap 未被抽中的约 36.8% 样本，可免费估计泛化误差。' },
      { en: 'random forest', zh: '随机森林', html: 'bagging + 每次分裂随机选特征子集，进一步降低树间相关性。' },
      { en: 'gradient boosting', zh: '梯度提升', html: '串行拟合当前模型的负梯度，用学习率缩放每棵树的贡献。' }
    ] },

    { t: 'quiz', qid: 'ch04-q1' },
    { t: 'quiz', qid: 'ch04-q2' },
    { t: 'quiz', qid: 'ch04-q3' },

    { t: 'keypoint', items: [
      { title: '树 = 轴对齐的矩形切分', html: '边界只能平行于坐标轴，斜边界要靠多次分裂逼近。' },
      { title: 'Gini 与熵几乎等价', html: '两者都衡量混合程度，差异远小于超参数影响；sklearn 默认 Gini。' },
      { title: '回归树叶子输出均值', html: '平方损失下的最优常数；树不能外推。' },
      { title: '预剪枝省算力，后剪枝泛化好', html: '实践中组合使用：先限深，再用 <code>ccp_alpha</code> 或早停。' },
      { title: 'bagging 降方差，boosting 降偏差', html: '前者并行、树可深；后者串行、树要浅。' },
      { title: '随机森林的第二层随机性压低相关性', html: '平均后方差是 <code>ρσ<sup>2</sup> + (1-ρ)σ<sup>2</sup>/B</code>，只有 <code>ρ</code> 能被随机特征子集压下来。' }
    ] },

    { t: 'checklist', id: 'ch04', items: [
      '我能用「轴对齐矩形」解释树的表达能力与局限',
      '我能手算 Gini 与信息增益，并说明两者差别',
      '我能写出回归树的方差下降准则与叶子输出',
      '我能说明预剪枝与后剪枝在偏差-方差上的不同',
      '我能解释 bagging 为什么能降方差，以及 <code>ρ</code> 的作用',
      '我能说出随机森林的两个随机性分别解决什么问题',
      '我能说明 GBDT 为什么用回归树拟合负梯度',
      '我能给出 boosting 的调参顺序与早停做法',
      '我能指出本章常见错误中任意四条的原因'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 DDA3020_ML_Lecture_08_Tree_Methods 与 DDA3020_Week_07_Decision_Trees.pptx 组织，覆盖轴对齐切分、Gini 与熵、信息增益与增益率、连续特征候选阈值、回归树与方差下降、预剪枝与代价复杂度后剪枝、bagging 与 OOB、随机森林的特征子集、梯度提升与学习率。讲义中的 CART 完整伪代码、XGBoost 的二阶泰勒展开、LightGBM 的直方图与 leaf-wise 生长属于扩展内容，本站只在必要处点名；章内三段代码（手算增益、深度曲线、随机森林与 GBDT 对比）均可独立运行复现。' }
  ]
});
