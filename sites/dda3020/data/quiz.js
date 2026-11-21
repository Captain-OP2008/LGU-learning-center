/* =====================================================================
 * quiz.js · DDA3020 分章题库
 * 结构：{ items:[{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options?, answer?, accept?, code?, explain }] }
 * 题型：mcq / tf / fill / multi
 * 覆盖：ch00–ch07，每章 7 题，共 56 题
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '与「把规则一条条写死」的传统程序相比，机器学习最本质的区别是什么？',
        options: [
          { text: '机器学习程序一定更快' },
          { text: '行为由数据估计出的参数决定，而不是由人预先写好的规则决定', correct: true },
          { text: '机器学习不需要输入输出' },
          { text: '机器学习程序不会出错' }
        ],
        explain: '传统程序是人写规则、机器执行；机器学习是人给数据和目标，机器自己估计参数。规则没有消失，而是变成了「模型形式 + 损失函数」，由优化过程填充具体数值。这也解释了为什么数据质量与分布漂移会直接决定效果。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '监督学习与无监督学习的主要区别，在于训练数据是否带有标签。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '监督学习从 (x, y) 对里学映射，无监督学习只给 x、去发现结构（聚类、降维、密度估计）。强化学习是第三类：没有标准答案，只有延迟的奖励信号。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'multi', difficulty: 2,
        tags: ['process'],
        stem: '一个规范的监督学习流程通常包含下面哪些环节？（多选）',
        options: [
          { text: '划分训练集、验证集与测试集', correct: true },
          { text: '选定模型形式与损失函数', correct: true },
          { text: '用测试集反复调超参数，直到分数最高' },
          { text: '在训练集上拟合参数，在验证集上选超参数', correct: true },
          { text: '训练结束后只在测试集上评估一次', correct: true }
        ],
        explain: '验证集用于选模型与超参数，测试集只做最终的一次性评估。反复用测试集调参等于把测试集变成了验证集，报告出来的分数会偏乐观，这也是最常见的流程性错误之一。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '模型在训练集上误差很低、在测试集上误差明显更高，最准确的描述是？',
        options: [
          { text: '欠拟合' },
          { text: '过拟合', correct: true },
          { text: '数据泄漏' },
          { text: '梯度消失' }
        ],
        explain: '训练误差低说明模型容量足够、已经拟合了训练数据；测试误差高说明它拟合进了训练集特有的噪声，泛化能力差，这就是过拟合。欠拟合的表现是训练误差本身就高。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'fill', difficulty: 1,
        tags: ['process'],
        stem: '把数据分成训练集、验证集和 ______，其中最后一份只在最终评估时使用一次。',
        answer: '测试集',
        accept: ['测试集（test set）', 'test set', '测试数据'],
        explain: '训练集学参数，验证集选超参数与模型，测试集给出对泛化误差的无偏估计。三者混用会让评估失真，尤其是拿测试集调参，等于偷看考题。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '在期望平方误差的分解 E[(y - ŷ)²] = 噪声 + 偏差² + 方差 中，哪一项是无论怎么改进模型都无法消除的？',
        options: [
          { text: '偏差的平方' },
          { text: '方差' },
          { text: '数据本身的噪声', correct: true },
          { text: '三项都可以消除' }
        ],
        explain: '噪声来自数据生成过程，是目标值本身的随机性，任何模型都消不掉。增加模型复杂度可以降偏差但抬升方差，减小复杂度反过来，所以只能在这两项之间权衡，不可能让总误差低于噪声水平。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-8', tier: 1, type: 'fill', difficulty: 1,
        tags: ['process'],
        stem: '本站建议的学法：每章读完先合上正文做 ______，再动手做一个项目里程碑，把知识变成能跑通的代码。',
        answer: '自检清单',
        accept: ['checklist', '自检清单（checklist）', '章末自检清单'],
        explain: '自检清单里的每一条都是「我能不能说清/写出来」，它会暴露「以为懂了其实讲不出」的地方；项目里程碑则把这些点变成可运行的代码。只读不做，漏洞会一路带到后面的章节。'
      },

      /* ---------------- ch01 数学基础 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['math'],
        stem: '若随机变量 X 与 Y 相互独立，则 Var(X + Y) 等于？',
        options: [
          { text: 'Var(X) + Var(Y) + 2Cov(X, Y)' },
          { text: 'Var(X) + Var(Y)', correct: true },
          { text: 'Var(X) · Var(Y)' },
          { text: '2Var(X) + 2Var(Y)' }
        ],
        explain: '方差的可加性只在协方差为零时成立：Var(X+Y) = Var(X) + Var(Y) + 2Cov(X,Y)。独立蕴含协方差为零，所以第二项消失。注意反向不成立——协方差为零不等于独立，除非是联合高斯。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['math'],
        stem: '贝叶斯公式把先验概率与似然结合成后验概率，分母 p(x) 起归一化作用。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'p(θ|x) = p(x|θ)p(θ) / p(x)，其中 p(x) 与 θ 无关，只保证后验对 θ 积分为 1，因此常被写成「正比于」。做最大后验估计（MAP）时可以完全忽略分母，因为它不改变 argmax。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['math'],
        stem: '下面哪些函数在实数域上是凸函数？（多选）',
        options: [
          { text: '<code>f(x) = x²</code>', correct: true },
          { text: '<code>f(x) = eˣ</code>', correct: true },
          { text: '<code>f(x) = |x|</code>', correct: true },
          { text: '<code>f(x) = -x²</code>' },
          { text: '<code>f(x) = log x</code>（x &gt; 0）' }
        ],
        explain: '凸函数的定义是 f(αx + (1-α)y) ≤ αf(x) + (1-α)f(y)：函数图像上任意两点的连线都在曲线上方。x²、eˣ、|x| 都满足；-x² 是凹的；log x 是凹的（它的负数是凸的）。判断梯度下降能否收敛，第一步就是看损失是否凸。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'fill', difficulty: 1,
        tags: ['math'],
        stem: '梯度下降的更新式是 w ← w - η∇L(w)，其中控制每步走多远的 η 称为 ______。',
        answer: '学习率',
        accept: ['learning rate', '步长', '学习率（learning rate）'],
        explain: 'η 太大时会在最优点两侧来回震荡甚至发散，太小时收敛极慢且容易停在平坦区域。实践中常用 1e-3 起步，配合学习率衰减或自适应优化器。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['math'],
        stem: '对矩阵 X 做奇异值分解 X = UΣVᵀ，其中 V 的列向量是什么？',
        options: [
          { text: 'X 的左奇异向量，也是 XXᵀ 的特征向量' },
          { text: 'X 的右奇异向量，也是 XᵀX 的特征向量', correct: true },
          { text: 'X 的特征向量' },
          { text: 'X 的行空间的一组基，与 XᵀX 无关' }
        ],
        explain: '由 X = UΣVᵀ 得 XᵀX = VΣ²Vᵀ，所以 V 的列是 XᵀX 的单位特征向量（右奇异向量），U 的列是 XXᵀ 的特征向量（左奇异向量），奇异值是 Σ 对角线上的非负数。PCA 正是取中心化矩阵的 V 前 k 列作投影方向。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['math'],
        stem: '约束优化中的互补松弛条件 αᵢgᵢ(x) = 0 说明了什么？',
        options: [
          { text: '所有约束都必须取等号' },
          { text: '若某个约束没有被激活（gᵢ &lt; 0），则其对应乘子必为零', correct: true },
          { text: '乘子一定是负数' },
          { text: '目标函数一定是线性的' }
        ],
        explain: '互补松弛要求「约束」与「乘子」至少有一个为零：约束严格满足时乘子为零，乘子为正时约束必然取等号。SVM 里这条性质直接给出「只有支持向量对应的 α 非零」，从而得到稀疏解。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 1, type: 'fill', difficulty: 1,
        tags: ['math'],
        stem: '对一维高斯分布做最大似然估计，均值 μ 的估计量恰好是样本 ______。',
        answer: '均值',
        accept: ['均值（mean）', '平均数', '样本均值'],
        explain: '对 ℓ(μ, σ²) 求导并令其为零，得到 μ̂ = (1/n)Σxᵢ。这看起来理所当然，但它是「平方损失 + 高斯噪声」这一假设推出来的结论，噪声换成拉普拉斯分布，最大似然给出的就是样本中位数。'
      },

      /* ---------------- ch02 线性回归与逻辑回归 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['model'],
        stem: '最小二乘的闭式解 w = (XᵀX)⁻¹Xᵀy 在什么情况下不能直接用？',
        options: [
          { text: '当样本数少于特征数，或特征之间存在完全共线时', correct: true },
          { text: '当 y 是连续值时' },
          { text: '当特征已经标准化时' },
          { text: '当样本数大于一万时' }
        ],
        explain: '这两类情况都会让 XᵀX 奇异或接近奇异，逆矩阵不存在或数值极不稳定。解决办法是加正则（岭回归解 (XᵀX + λI)⁻¹Xᵀy 一定可逆）或改用梯度下降、SVD 伪逆。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'tf', difficulty: 1,
        tags: ['model'],
        stem: '逻辑回归的输出 σ(wᵀx + b) 可以直接解释为样本属于正类的概率。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'sigmoid 把实数映射到 (0,1)，模型假设 log[p/(1-p)] = wᵀx + b，于是 p = σ(wᵀx + b)。但要注意这是「模型假设下的概率」，若特征与标签的关系被错误设定，输出的数值并不校准，不能直接当真实概率用。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-1', tier: 2, type: 'multi', difficulty: 2,
        tags: ['model'],
        stem: '下面哪些是标准线性回归模型（含高斯噪声假设）的前提？（多选）',
        options: [
          { text: '模型对参数是线性的', correct: true },
          { text: '误差的均值为零', correct: true },
          { text: '误差同方差且彼此不相关', correct: true },
          { text: '特征必须服从高斯分布' },
          { text: '目标值必须是二值的' }
        ],
        explain: '线性回归只要求「对参数线性」和误差的良好性质；特征本身不需要服从高斯，甚至可以是非连续的（做哑变量）。目标值必须是连续量，二值目标是逻辑回归的范畴。注意「对参数线性」不等于「对特征线性」，多项式回归仍然属于线性模型。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'fill', difficulty: 2,
        tags: ['model'],
        stem: '岭回归在平方损失上加 λ‖w‖²，等价于在高斯先验下做 ______ 估计。',
        answer: '最大后验',
        accept: ['MAP', '最大后验（MAP）', 'maximum a posteriori'],
        explain: 'L2 正则项来自参数的高斯先验取负对数，所以岭回归 = 高斯似然 × 高斯先验的最大后验估计。同理 L1 对应拉普拉斯先验，这也是 L1 为什么会产生稀疏解的一个解释角度。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['math'],
        stem: '多分类 softmax 配合交叉熵时，损失对 logits 的梯度是什么形式？',
        options: [
          { text: '预测概率减去 one-hot 标签，即 p - y', correct: true },
          { text: '预测概率乘以标签' },
          { text: '标签减去预测概率再除以样本数' },
          { text: '恒为常数，与输入无关' }
        ],
        explain: '把 softmax 与交叉熵合起来求导，softmax 的雅可比与 log 的导数相互抵消，结果干净得惊人：∂L/∂z = p - y。这也是框架里 softmax 与交叉熵总被合并成一个算子的原因——分开算既慢又不数值稳定。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-7', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['model'],
        stem: '关于 softmax 回归，下面哪条说法正确？',
        options: [
          { text: '各类输出之和为 1，可看作类别分布', correct: true },
          { text: '每个类别独立用一个 sigmoid，输出之和不必为 1' },
          { text: '只能处理二分类' },
          { text: '输出值可以大于 1' }
        ],
        explain: 'softmax 用指数归一化保证输出非负且和为 1；二分类时它退化为 sigmoid。多个独立 sigmoid 用于多标签场景（一张图可以同时有猫和狗），两者的损失分别是 categorical cross-entropy 与 binary cross-entropy。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'fill', difficulty: 1,
        tags: ['math'],
        stem: '若假设观测噪声服从零均值高斯分布，最大似然估计等价于最小化 ______ 损失。',
        answer: '平方',
        accept: ['均方', '平方误差', '均方误差', 'MSE', 'squared error'],
        explain: '高斯密度的负对数里正好出现 (y - ŷ)²/σ²，最大化似然就是最小化残差平方和。这条对应关系是「为什么回归默认用 MSE」的理论依据；换成长尾噪声时，绝对值损失或 Huber 损失更稳健。'
      },

      /* ---------------- ch03 SVM 与核方法 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['model'],
        stem: '在 SVM 中把函数间隔固定为 1 之后，几何间隔等于多少？',
        options: [
          { text: '‖w‖' },
          { text: '1 / ‖w‖', correct: true },
          { text: '‖w‖²' },
          { text: '1 / ‖w‖²' }
        ],
        explain: '几何间隔是「点到超平面的欧氏距离」：|wᵀx + b| / ‖w‖。函数间隔固定为 1 时，最近点的几何间隔就是 1/‖w‖。最大化间隔于是等价于最小化 ‖w‖，再平方并加 1/2 就是为了求导方便。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['model'],
        stem: 'SVM 的最终解只依赖支持向量，删掉其他样本不会改变决策边界。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '由互补松弛条件，非支持向量的 α 为零，它们根本不进入 w = Σαᵢyᵢxᵢ 的求和。所以 SVM 对「远离边界的数据」天然不敏感，这也是它在小样本、高维问题上表现稳健的原因之一。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['math'],
        stem: '关于核函数与 Mercer 条件，下面哪些说法正确？（多选）',
        options: [
          { text: '合法核对应的核矩阵必须对称半正定', correct: true },
          { text: '核函数等价于某个高维特征空间中的内积', correct: true },
          { text: '任意二元函数都可以当核函数使用' },
          { text: '核技巧避免显式计算高维映射', correct: true },
          { text: '核方法只能用于分类' }
        ],
        explain: 'Mercer 定理说：核矩阵对称半正定 ⟺ 存在特征映射 φ 使 K(x,z) = φ(x)ᵀφ(z)。所以核不是随便挑的，随手写一个函数很可能让对偶问题非凸。核技巧的价值在于只算内积、不算 φ；它同样可用于回归（SVR）、PCA（核 PCA）等。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['model'],
        stem: '软间隔 SVM 中惩罚系数 C 越大，对误分类的容忍度越低，等价于正则强度越 ______。',
        answer: '弱',
        accept: ['小', '弱（正则更弱）', '更弱'],
        explain: 'C 是正则强度的倒数：C 很大时模型几乎不允许违反间隔，边界尽量贴合训练数据，方差大、容易过拟合；C 很小时允许更多违反，边界更平滑、偏差大。调 C 本质上就是在偏差与方差之间移动。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['model'],
        stem: 'RBF 核 K(x, z) = exp(-γ‖x - z‖²) 中，γ 增大时通常会发生什么？',
        options: [
          { text: '单个样本的影响范围变大，边界更平滑' },
          { text: '单个样本的影响范围变小，边界更弯曲，容易过拟合', correct: true },
          { text: '模型退化为线性 SVM' },
          { text: '核矩阵变成单位阵，与 γ 无关' }
        ],
        explain: 'γ 控制「多近才算近」：γ 大时距离稍远核值就衰减到零，每个支持向量的影响只覆盖很小的邻域，边界因此围绕训练点剧烈弯曲，训练误差低但泛化差。γ 小时近似线性。通常与 C 一起在网格上搜索。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['model'],
        stem: '硬间隔 SVM 的原始优化问题是什么？',
        options: [
          { text: 'min ½‖w‖²，约束 yᵢ(wᵀxᵢ + b) ≥ 1 对所有 i 成立', correct: true },
          { text: 'min Σξᵢ，约束 yᵢ(wᵀxᵢ + b) ≥ 1 - ξᵢ' },
          { text: 'max ½‖w‖²，约束 yᵢ(wᵀxᵢ + b) ≤ 1' },
          { text: 'min ‖w‖₁，约束 yᵢ(wᵀxᵢ + b) ≥ 0' }
        ],
        explain: '「最大化间隔 1/‖w‖」等价于「最小化 ‖w‖」，平方并乘 1/2 只是让导数更干净。约束要求所有样本不仅被正确分类，还要落在间隔边界之外。第二项是软间隔的写法，多了松弛变量 ξ。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['math'],
        stem: '软间隔 SVM 的损失可以写成 max(0, 1 - y·f(x))，这个损失叫 ______ 损失。',
        answer: '合页',
        accept: ['hinge', 'hinge loss', '合页损失（hinge）', '铰链'],
        explain: 'hinge 损失在 margin 大于 1 时为零，否则线性增长，形状像一个合页。它和 L2 正则一起构成 SVM 的经验风险最小化形式；与逻辑损失相比，hinge 在间隔足够大时直接给零损失，所以解更稀疏（只由支持向量决定）。'
      },

      /* ---------------- ch04 决策树与集成学习 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['model'],
        stem: '二分类问题中，Gini 不纯度的最大值是多少？',
        options: [
          { text: '0' },
          { text: '0.5', correct: true },
          { text: '1' },
          { text: 'log₂2 = 1' }
        ],
        explain: 'Gini = 1 - Σpₖ²，两类各占一半时取最大值 1 - (0.25 + 0.25) = 0.5；纯节点为 0。熵在同一点取最大值 1（以 2 为底）。两者度量不同但单调趋势一致，实践中选哪个对树结构影响不大。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['model'],
        stem: '决策树可以把预测值外推到训练集目标值范围之外。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '回归树的每个叶子输出该区域训练样本的平均值，所以预测值必然落在训练目标的最小值与最大值之间，天生不能外推。对有时间趋势或需要外推的任务，应当对目标做差分/去趋势，或改用线性模型。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['model'],
        stem: '随机森林中的「随机」体现在哪些地方？（多选）',
        options: [
          { text: '每棵树用 bootstrap 抽样的样本来训练', correct: true },
          { text: '每次分裂只在随机选出的特征子集中找最优切分', correct: true },
          { text: '随机打乱标签后再训练' },
          { text: '树与树之间串行拟合前一轮的残差' },
          { text: '预测时对所有树的结果取平均或投票', correct: true }
        ],
        explain: '两层随机（样本 + 特征）降低树之间的相关性 ρ，按 ρσ² + (1-ρ)σ²/B 的关系，平均后的方差显著下降。打乱标签会彻底破坏信号；串行拟合残差是 boosting 的做法，不是 bagging。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['math'],
        stem: '信息增益等于父节点的熵减去各子节点熵的 ______ 平均。',
        answer: '加权',
        accept: ['加权平均', '按样本比例加权', 'weighted'],
        explain: 'IG = H(parent) - Σ(m_child/m)·H(child)，权重是子节点样本占比。不加权会偏好产生大量小节点的切分——每个小节点都很纯，但它只覆盖极少数样本，对整体没有意义。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['model'],
        stem: 'Boosting 主要降低的是误差分解中的哪一项？',
        options: [
          { text: '偏差', correct: true },
          { text: '方差' },
          { text: '噪声' },
          { text: '三项都等量降低' }
        ],
        explain: 'Boosting 串行地拟合当前模型的负梯度（平方损失下就是残差），每轮都在纠正上一轮的系统性错误，所以整体偏差不断下降。代价是串行训练、对噪声敏感，且树太深时方差会上升。Bagging 的作用恰好相反：主要降方差。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['tool'],
        stem: '在 sklearn 的决策树里，做代价复杂度后剪枝应该调哪个参数？',
        options: [
          { text: '<code>max_depth</code>' },
          { text: '<code>min_samples_leaf</code>' },
          { text: '<code>ccp_alpha</code>', correct: true },
          { text: '<code>max_features</code>' }
        ],
        explain: '前三个里只有 ccp_alpha 是后剪枝：先长满一棵树，再按「复杂度代价 = 误差 + α·叶子数」自底向上剪。max_depth 与 min_samples_leaf 都是预剪枝，在生长过程中提前停止。后剪枝通常泛化更好但更慢。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'fill', difficulty: 1,
        tags: ['model'],
        stem: '回归树的叶子节点把落入该区域的样本预测为它们的 ______。',
        answer: '均值',
        accept: ['平均值', '均值（mean）', '平均'],
        explain: '在平方损失下，使区域内的误差平方和最小的常数就是该区域目标的均值，所以叶子输出均值。若损失换成绝对值，最优常数变成中位数——这也是「损失函数决定叶子输出」的一个直接例子。'
      },

      /* ---------------- ch05 神经网络 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['model'],
        stem: '如果多层神经网络中每层都不加非线性激活函数，整个网络等价于什么？',
        options: [
          { text: '一个线性变换', correct: true },
          { text: '一个更深的非线性模型' },
          { text: '一个决策树' },
          { text: '一个核 SVM' }
        ],
        explain: '线性变换的复合仍是线性变换：W₂(W₁x) = (W₂W₁)x。所以没有激活函数时，一百层和一层没有本质区别。非线性激活是深度网络表达能力的来源，这也是「深度」有意义的前提。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'tf', difficulty: 2,
        tags: ['math'],
        stem: '反向传播本质上就是链式法则，加上对中间结果的复用，从而避免重复计算。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '前向时缓存每层的激活值，反向时从损失开始逐层用链式法则乘上局部导数，每层的 δ 只需算一次并传给前一层。它不是「另一种求导方法」，而是对链式法则的高效组织，复杂度与前向同阶。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['model'],
        stem: '关于卷积神经网络，下面哪些说法正确？（多选）',
        options: [
          { text: '卷积核在整张图上共享权重，参数量与图像尺寸无关', correct: true },
          { text: '局部连接利用了图像相邻像素相关的先验', correct: true },
          { text: '池化层可以降低特征图尺寸、提供一定的平移不变性', correct: true },
          { text: '卷积层要求输入必须是灰度图' },
          { text: '每个卷积核只能检测一种固定模式', correct: true }
        ],
        explain: '参数共享与局部连接是 CNN 相对全连接的核心优势：一张 224×224 的图接全连接层会有上亿参数，而 3×3 卷积核只有 9 个权重（乘通道数）。每个卷积核学到一个局部模式（边缘、纹理），深层的核组合出更复杂的结构。彩色图只需通道数设为 3。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'fill', difficulty: 2,
        tags: ['math'],
        stem: '输入边长 H、卷积核 K、填充 P、步长 S 时，输出边长为 ⌊(H + 2P - K)/S⌋ + ______。',
        answer: '1',
        accept: ['1', '+1', '一'],
        explain: '这个公式可以从「核能放几个位置」直接理解：有效长度 H + 2P - K，每步移动 S，能放下的位置数再加一。例如 32×32 输入、3×3 核、P=1、S=1 时输出仍是 32×32，这就是 same padding 的由来。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['tool'],
        stem: 'He 初始化（方差 2/fan_in）最适合配合哪种激活函数？',
        options: [
          { text: 'tanh' },
          { text: 'ReLU', correct: true },
          { text: 'sigmoid' },
          { text: 'softmax' }
        ],
        explain: 'ReLU 把约一半输入置零，等效地把方差减半，所以需要比 Xavier（2/(fan_in+fan_out)）更大的初始方差来补偿。用错初始化会让深层网络的激活值逐层衰减到零或爆炸，训练几乎无法启动。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-8', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['model'],
        stem: '标准自注意力机制的计算复杂度（关于序列长度 n）是多少？',
        options: [
          { text: 'O(n)' },
          { text: 'O(n log n)' },
          { text: 'O(n²d)', correct: true },
          { text: 'O(1)' }
        ],
        explain: '要算 n×n 的注意力矩阵 QKᵀ，每个元素是长度为 d 的内积，所以是 O(n²d)。这是长文本场景的核心瓶颈，也是各种稀疏注意力、线性注意力、FlashAttention（省显存而非降复杂度）出现的动机。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'fill', difficulty: 2,
        tags: ['model'],
        stem: 'LSTM 靠细胞状态的 ______ 更新（而不是反复相乘）来缓解梯度消失。',
        answer: '加法',
        accept: ['相加', '加法（additive）', '加性'],
        explain: 'c_t = f_t ⊙ c_{t-1} + i_t ⊙ g_t：门控让信息可以沿「加法通道」几乎无损地传很远，梯度回传时不会像 RNN 那样连乘多个雅可比而指数衰减。GRU 用更新门做同样的事，参数更少。'
      },

      /* ---------------- ch06 过拟合与模型评估 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '期望平方误差可以分解为哪三项？',
        options: [
          { text: '噪声 + 偏差² + 方差', correct: true },
          { text: '噪声 + 偏差 + 方差²' },
          { text: '偏差² + 方差 + 正则项' },
          { text: '训练误差 + 验证误差 + 测试误差' }
        ],
        explain: 'E[(y - ŷ)²] = σ² + (E[ŷ] - f(x))² + Var(ŷ)。偏差衡量「平均预测偏离真实函数多远」，方差衡量「换一批训练数据预测波动多大」。增加模型容量通常降偏差、升方差，这就是权衡的来源。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-8', tier: 1, type: 'tf', difficulty: 1,
        tags: ['process'],
        stem: '只要最终报告的是最好的一次结果，测试集就可以反复用来挑选模型。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '每用测试集做一次选择，测试集的信息就泄漏进模型一次，报告分数会系统性偏乐观。正确做法是验证集（或交叉验证）做所有选择，测试集只在最后评估一次，且评估后不再改模型。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['process'],
        stem: '下面哪些做法构成了数据泄漏？（多选）',
        options: [
          { text: '在划分训练/测试之前，用全量数据做标准化', correct: true },
          { text: '用未来时刻的数据预测过去', correct: true },
          { text: '目标编码时用到了全量数据的标签均值', correct: true },
          { text: '在训练折内部对图像做随机翻转增强' },
          { text: '把缺失值用全量数据的中位数填充', correct: true }
        ],
        explain: '凡是「测试集的信息参与了训练或选择」都是泄漏。标准化、填充、目标编码都必须只在训练折上 fit，再 transform 到验证/测试折（用 Pipeline 最省心）；时间序列要按时间切分，不能随机打乱。训练折内部的增强只用到训练数据，是合法的。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'fill', difficulty: 2,
        tags: ['metric'],
        stem: 'AUC 等于随机取一个正样本和一个负样本，正样本得分高于负样本得分的 ______。',
        answer: '概率',
        accept: ['概率（probability）', '可能性', 'probability'],
        explain: '这个等价定义比「ROC 曲线下面积」直观得多，也解释了 AUC 对类别不平衡不敏感的原因：它只看正负样本得分的相对顺序，与阈值、与正负比例都无关。代价是它不反映预测概率是否校准。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['model'],
        stem: '为什么 L1 正则（Lasso）容易产生稀疏解，而 L2（Ridge）不会？',
        options: [
          { text: 'L1 的约束区域是菱形，最优解容易落在坐标轴上', correct: true },
          { text: 'L1 的梯度恒为零' },
          { text: 'L1 对参数做了平方放缩' },
          { text: 'L1 会把所有参数都变成零' }
        ],
        explain: '从几何看，L1 的等高线（菱形）有尖角落在坐标轴上，损失等高线扩张时最先接触的往往是尖角，于是某些系数恰好为零。L2 的约束区域是圆，接触点一般不在轴上。从优化看，L1 在零点不可导且次梯度包含零，也是稀疏的来源。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-7', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['metric'],
        stem: '在做代价敏感决策时，若误报（FP）的代价为 C_FP、漏报（FN）的代价为 C_FN，理论上应把判定阈值设在哪里？',
        options: [
          { text: '0.5，与代价无关' },
          { text: 'C_FP / (C_FP + C_FN)', correct: true },
          { text: 'C_FN / (C_FP + C_FN)' },
          { text: '1 - C_FP / C_FN' }
        ],
        explain: '预测为正的期望代价是 (1-p)C_FP，预测为负的期望代价是 p·C_FN，令两者相等得 p* = C_FP/(C_FP+C_FN)。直觉检查：漏报代价远大于误报时，C_FN 很大，阈值趋近 0，也就是「宁可多报也别漏」。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'fill', difficulty: 2,
        tags: ['metric'],
        stem: '正负样本极度不平衡时，比 ROC 曲线更能反映正类识别质量的是 ______ 曲线及其曲线下面积 AP。',
        answer: 'PR',
        accept: ['PR 曲线', 'precision-recall', '精确率-召回率', 'PR'],
        explain: '不平衡时负样本极多，假阳性率的分母很大，FPR 变化被稀释，ROC 看起来依然漂亮。PR 曲线的召回率分母是正样本数，精确率直接受假阳性影响，因此对少数类更敏感。'
      },

      /* ---------------- ch07 无监督学习 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['model'],
        stem: 'K-Means 的 Lloyd 算法中，分配步与更新步分别做了什么？',
        options: [
          { text: '分配步把点分给最近质心，更新步把质心移到所属点均值', correct: true },
          { text: '分配步更新质心，更新步重新分配点' },
          { text: '两步都在随机重新初始化质心' },
          { text: '分配步计算轮廓系数，更新步选择 k' }
        ],
        explain: '固定质心时，把点分给最近质心最小化距离；固定分配时，把质心移到均值最小化平方和。两步各自都是对当前另一变量的最优解，所以目标函数单调不增，必然收敛——但只到局部最优。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['metric'],
        stem: '轮廓系数接近 1，说明样本离本簇很近、离最近的异簇很远。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 's = (b - a)/max(a, b)：a 是到同簇其他点的平均距离，b 是到最近异簇的平均距离。a 小、b 大时 s 接近 1；s 接近 0 说明点在簇边界上；负值说明它可能被分错了簇。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['model'],
        stem: '关于 EM 算法，下面哪些说法正确？（多选）',
        options: [
          { text: '每次迭代对数似然单调不减', correct: true },
          { text: '收敛到的是局部最优，结果依赖初始化', correct: true },
          { text: 'E 步计算隐变量的后验（责任度）', correct: true },
          { text: '只要迭代足够久就一定能找到全局最优' },
          { text: '它不能用于含有隐变量的模型' }
        ],
        explain: 'EM 优化的是似然的下界（ELBO）：E 步让下界与似然相切，M 步抬高下界，所以似然单调不减。但下界非凸，不同初始化收敛到不同局部最优，且靠近最优时收敛很慢（线性收敛）。它的适用面正是「含隐变量、似然难直接优化」的模型。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['model'],
        stem: 'GMM 的 E 步算出的后验概率 γᵢₖ 通常被称为样本 i 对成分 k 的 ______。',
        answer: '责任度',
        accept: ['responsibility', '责任度（responsibility）', 'responsibilities'],
        explain: 'γᵢₖ = πₖN(xᵢ|μₖ,Σₖ) / ΣⱼπⱼN(xᵢ|μⱼ,Σⱼ)，表示「在当前参数下，样本 i 由第 k 个成分生成的概率」。M 步把它当权重去更新均值与协方差，等价于加权版的样本统计量。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['math'],
        stem: 'PCA 的第一主成分方向是什么？',
        options: [
          { text: '协方差矩阵最大特征值对应的特征向量', correct: true },
          { text: '数据均值方向' },
          { text: '协方差矩阵最小特征值对应的特征向量' },
          { text: '任意一个与均值正交的方向' }
        ],
        explain: '在 ‖w‖ = 1 的约束下最大化 wᵀΣw，拉格朗日条件给出 Σw = λw，最大值就是最大特征值 λ₁。所以第一主成分是最大特征向量，投影后的方差正好是 λ₁；后续主成分在与前面全部正交的约束下依次取次大特征向量。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['model'],
        stem: 'K-Means 可以看作 GMM 在什么条件下的特例？',
        options: [
          { text: '各成分共享球形协方差，且方差趋于零', correct: true },
          { text: '各成分协方差为任意全矩阵' },
          { text: '成分数趋于无穷' },
          { text: '先验权重全部相等且方差趋于无穷' }
        ],
        explain: '共享 Σ = σ²I 且 σ² → 0 时，责任度退化为「最近成分得 1、其余得 0」，软分配变成硬分配，E 步即「分给最近质心」、M 步即「取均值」。这也说明 K-Means 的球形、等大小假设是从哪里来的。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-7', tier: 1, type: 'fill', difficulty: 1,
        tags: ['metric'],
        stem: '第 i 个主成分的解释方差比等于 λᵢ 除以所有特征值之和，即占总 ______ 的比例。',
        answer: '方差',
        accept: ['方差（variance）', '总方差', '方差总量'],
        explain: '特征值之和等于各特征的方差之和（对中心化数据），所以 λᵢ/Σλ 就是该方向解释的方差比例。累加前 k 项得到累计解释方差比，常用来定 k（如 90%），但它只说明「保住了多少波动」，不保证这些波动对分类有用。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
