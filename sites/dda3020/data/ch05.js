/* =====================================================================
 * ch05.js · 第 5 章「神经网络：从 MLP 到 Transformer」
 * 职责：把「感知机 → 多层网络 → 反向传播 → CNN → RNN → 注意力」串成
 *       一条「同一个梯度下降框架，不断换结构」的主线。
 * 依据：DDA3020_ML_Lecture_09_Neural_Networks、10_CNN、11_RNN_Transformer、
 *       DDA3020_Week_09_Multi_layer_Feedforward_Neural_Network.pptx、
 *       DDA3020_Lectures_softmax_gradient.pdf。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch05',
  num: '05',
  title: '神经网络：从 MLP 到 Transformer',
  en: 'NEURAL NETWORKS',
  goals: [
    '用「隐藏层 = 学出来的特征」解释多层网络为什么比线性模型强',
    '手写两层网络的前向与反向传播，说清每一维形状与链式法则的对应',
    '为输出层选择正确的激活与损失组合，并解释 softmax 与交叉熵的梯度',
    '用初始化与优化器的选择解释「训练不收敛」的常见原因',
    '比较 CNN、RNN、Transformer 的归纳偏置，并为给定任务选择合适的结构'
  ],
  kp: [
    { id: 'ch05-1', title: '从感知机到多层感知机' },
    { id: 'ch05-2', title: '激活函数与通用逼近' },
    { id: 'ch05-3', title: '反向传播：链式法则' },
    { id: 'ch05-4', title: 'softmax 与交叉熵' },
    { id: 'ch05-5', title: '初始化与优化器' },
    { id: 'ch05-6', title: 'CNN：卷积与池化' },
    { id: 'ch05-7', title: 'RNN、LSTM 与序列建模' },
    { id: 'ch05-8', title: '注意力与 Transformer' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么神经网络不是「另一门课」', html: '把上一章的逻辑回归拿出来看：线性打分加 sigmoid，再加交叉熵和梯度下降。神经网络做的事只有一件——<b>把「线性打分」换成「线性 + 非线性 + 线性 + …」的复合</b>，让模型自己学特征。损失、梯度、优化器全都没变。所以这一章不需要你重新学一套数学，只需要你学会「怎么把链式法则写对、把张量形状对齐」。' },

    { t: 'p', lead: true, html: '这一章按历史顺序走，但每一步都回答同一个问题：<b>这个结构加了什么归纳偏置</b>。MLP 假设「特征之间可以任意组合」；CNN 假设「局部模式在图像各处重复出现」；RNN 假设「序列有顺序、状态要传递」；Transformer 假设「任意两个位置都可能相关，且应该并行计算」。理解了偏置，你就能判断一个新任务该用哪种结构。' },

    { t: 'h', lvl: 2, text: '一、从感知机到多层感知机', id: 'ch05-1' },

    { t: 'p', html: '感知机（perceptron）是 <code>f(x) = sign(w<sup>T</sup>x + b)</code>，只能画线性边界。1969 年 XOR 问题说明了它的局限：四个点 <code>(0,0)→0, (0,1)→1, (1,0)→1, (1,1)→0</code> 无法被一条直线分开。这个结论曾经让神经网络研究停滞了十几年。' },

    { t: 'p', html: '解法是加一层。令 <code>h = σ(W<sub>1</sub>x + b<sub>1</sub>)</code>，<code>ŷ = σ(w<sub>2</sub><sup>T</sup>h + b<sub>2</sub>)</code>。中间这层 <code>h</code> 叫隐藏层，它的每个维度都是原始特征的一个非线性组合——<b>相当于模型自己学出了一组新特征</b>。对 XOR，两个隐藏单元分别学「<code>x<sub>1</sub> OR x<sub>2</sub></code>」和「<code>x<sub>1</sub> AND x<sub>2</sub></code>」，输出层再做一次「OR 减去 AND」，就能把两类分开。' },

    { t: 'p', html: '这个例子说明 MLP 的本质：<b>它不是「更复杂的线性模型」，而是「先做表示学习、再做线性分类」</b>。第一层到隐藏层是表示学习，隐藏层到输出是分类器。深度带来的是「组合复用」：第 <code>l</code> 层可以复用第 <code>l-1</code> 层学到的模式，所以深层网络表达同一函数所需的参数可以远少于浅层网络。' },

    { t: 'p', html: '符号约定要统一，否则后面推导会乱。记第 <code>l</code> 层：输入 <code>a<sup>(l-1)</sup></code>（<code>n × d<sub>l-1</sub></code>），权重 <code>W<sup>(l)</sup></code>（<code>d<sub>l-1</sub> × d<sub>l</sub></code>），偏置 <code>b<sup>(l)</sup></code>（长度 <code>d<sub>l</sub></code>），预激活 <code>z<sup>(l)</sup> = a<sup>(l-1)</sup>W<sup>(l)</sup> + b<sup>(l)</sup></code>，激活 <code>a<sup>(l)</sup> = σ(z<sup>(l)</sup>)</code>。注意这里把权重写成「输入维在前、输出维在后」，与 PyTorch 的 <code>nn.Linear(in, out)</code> 一致，做矩阵乘法时不用转置。' },

    { t: 'h', lvl: 2, text: '二、激活函数与通用逼近', id: 'ch05-2' },

    { t: 'p', html: '如果所有层都是线性的，复合起来还是线性：<code>W<sub>2</sub>(W<sub>1</sub>x) = (W<sub>2</sub>W<sub>1</sub>)x</code>，深度完全白费。所以每层之间必须夹一个非线性函数，这就是激活函数。<b>它是「深度有意义」的唯一原因</b>，这句话值得记一辈子。' },

    { t: 'p', html: 'sigmoid <code>1/(1+e<sup>-z</sup>)</code>：输出在 (0,1)，历史上最常用，但两端饱和、导数趋零，深层网络里梯度会逐层乘上小于 0.25 的因子，很快消失。tanh 是它的中心化版本，输出 (-1,1)，导数最大为 1，比 sigmoid 好一些，但仍会饱和。' },

    { t: 'p', html: 'ReLU <code>max(0, z)</code>：正半轴导数恒为 1，彻底解决正区间的梯度消失；计算极快；还带来稀疏性（约一半神经元输出为 0）。代价是负半轴导数为 0，可能出现「死亡 ReLU」——某个神经元对所有输入都输出 0，梯度永远为零，再也学不回来。Leaky ReLU、ELU、GELU 都是对这个缺点的修补，其中 GELU 是 Transformer 的默认选择。' },

    { t: 'p', html: '通用逼近定理（universal approximation theorem）说：一个含足够多隐藏单元的单隐层网络，可以以任意精度逼近任意连续函数（在紧集上）。这个定理常被误读为「一层就够了」。它只保证<b>存在性</b>，不保证「梯度下降能找到」，也不保证「样本量够用」。实践中深层网络用少得多的参数就能达到同样精度，所以真正决定成败的是可优化性与数据，而不是定理本身。' },

    { t: 'table', head: ['激活', '公式', '导数', '典型用途'], rows: [
      ['sigmoid', '<code>1/(1+e<sup>-z</sup>)</code>', '<code>σ(1-σ)</code>，最大 0.25', '二分类输出层；深层网络里少用'],
      ['tanh', '<code>(e<sup>z</sup>-e<sup>-z</sup>)/(e<sup>z</sup>+e<sup>-z</sup>)</code>', '<code>1-tanh<sup>2</sup></code>，最大 1', 'RNN 隐藏状态（旧做法）'],
      ['ReLU', '<code>max(0,z)</code>', '正区间 1，负区间 0', 'CNN、MLP 的默认隐藏层'],
      ['Leaky ReLU', '<code>max(αz, z)</code>，<code>α≈0.01</code>', '正 1，负 <code>α</code>', '缓解死亡 ReLU'],
      ['GELU', '<code>z·Φ(z)</code>', '平滑版 ReLU', 'Transformer 的默认选择']
    ], caption: '选激活只看两件事：会不会饱和、负半轴还有没有梯度' },

    { t: 'h', lvl: 2, text: '三、反向传播：链式法则', id: 'ch05-3' },

    { t: 'p', html: '训练要算 <code>∂L/∂W<sup>(l)</sup></code> 对每一层。反向传播（backpropagation）就是<b>从最后一层往前，反复用链式法则</b>，并且复用中间结果，使总代价与前向传播同阶（<code>O(参数量)</code>）。如果不是复用，逐层独立求导的代价会指数级增长。' },

    { t: 'p', html: '记 <code>δ<sup>(l)</sup> = ∂L/∂z<sup>(l)</sup></code>，称为第 <code>l</code> 层的误差信号。四个公式：<b>输出层</b> <code>δ<sup>(L)</sup> = ∂L/∂a<sup>(L)</sup> ⊙ σ′(z<sup>(L)</sup>)</code>；<b>反向传递</b> <code>δ<sup>(l)</sup> = (δ<sup>(l+1)</sup>W<sup>(l+1)T</sup>) ⊙ σ′(z<sup>(l)</sup>)</code>；<b>权重梯度</b> <code>∂L/∂W<sup>(l)</sup> = a<sup>(l-1)T</sup>δ<sup>(l)</sup></code>；<b>偏置梯度</b> <code>∂L/∂b<sup>(l)</sup> = Σδ<sup>(l)</sup></code>（对 batch 求和）。' },

    { t: 'p', html: '形状检查是最好的调试手段。<code>a<sup>(l-1)</sup></code> 是 <code>n×d<sub>l-1</sub></code>，<code>δ<sup>(l)</sup></code> 是 <code>n×d<sub>l</sub></code>，相乘得 <code>d<sub>l-1</sub>×d<sub>l</sub></code>，正好是 <code>W<sup>(l)</sup></code> 的形状。<b>如果你写出来的梯度形状与参数形状不一致，一定是转置或求和维度搞错了</b>，不用怀疑数学。' },

    { t: 'p', html: '两个常见坑。<b>第一个</b>：<code>δ</code> 的传递里 <code>W</code> 要转置，因为反向时「输出维变输入维」。<b>第二个</b>：softmax + 交叉熵的梯度可以合并化简成 <code>p - y</code>，不必真的对 softmax 求雅可比矩阵（那是 <code>K×K</code> 的，虽然也能算，但浪费）。这个化简在下一节展开。' },

    { t: 'code', lang: 'python', caption: '纯 numpy 两层网络：前向、反向、训练 XOR', code: `import numpy as np

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
y = np.array([[0], [1], [1], [0]], dtype=float)

rng = np.random.default_rng(0)
W1 = rng.normal(scale=0.5, size=(2, 4)); b1 = np.zeros(4)
W2 = rng.normal(scale=0.5, size=(4, 1)); b2 = np.zeros(1)

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

for epoch in range(20001):
    # ---- forward ----
    z1 = X @ W1 + b1
    a1 = np.tanh(z1)
    z2 = a1 @ W2 + b2
    p  = sigmoid(z2)

    # ---- loss (binary cross entropy) ----
    loss = -np.mean(y * np.log(p + 1e-9) + (1 - y) * np.log(1 - p + 1e-9))

    # ---- backward ----
    d2 = (p - y) / len(X)              # dL/dz2, 已合并 sigmoid+BCE
    dW2 = a1.T @ d2; db2 = d2.sum(0)
    d1 = (d2 @ W2.T) * (1 - a1 ** 2)   # tanh 的导数
    dW1 = X.T @ d1; db1 = d1.sum(0)

    # ---- update ----
    lr = 0.5
    W1 -= lr * dW1; b1 -= lr * db1
    W2 -= lr * dW2; b2 -= lr * db2

    if epoch % 5000 == 0:
        print('epoch %5d  loss=%.4f' % (epoch, loss))

print('predict:', np.round(p.ravel(), 3))` },

    { t: 'p', html: '这段代码里只有四行是「反向传播」，其余都是样板。把 <code>tanh</code> 换成 ReLU，只需把导数 <code>(1 - a1**2)</code> 换成 <code>(z1 > 0)</code>；把损失换成平方损失，只需改 <code>d2</code>。这就是框架做的事：<b>自动微分把「换激活、换损失」从改数学变成改一行配置</b>。跑通它，你再看 PyTorch 的 <code>loss.backward()</code> 就不会觉得神秘了。' },

    { t: 'h', lvl: 2, text: '四、softmax 与交叉熵', id: 'ch05-4' },

    { t: 'p', html: '多分类输出层用 softmax：<code>p<sub>k</sub> = exp(z<sub>k</sub>)/Σ<sub>j</sub>exp(z<sub>j</sub>)</code>。损失是交叉熵 <code>L = -log p<sub>y</sub></code>（<code>y</code> 是真实类）。两者的组合有一个极简的梯度：<code>∂L/∂z<sub>k</sub> = p<sub>k</sub> - 1[k = y]</code>，也就是 <b>预测概率向量减去 one-hot 标签</b>。' },

    { t: 'p', html: '这个结果值得自己推一遍。关键是 softmax 的雅可比：<code>∂p<sub>k</sub>/∂z<sub>j</sub> = p<sub>k</sub>(1[k=j] - p<sub>j</sub>)</code>。代入 <code>L = -log p<sub>y</sub></code> 后，求和项两两抵消，只剩 <code>p<sub>k</sub> - 1[k=y]</code>。推导里用到的唯一技巧是「<code>Σp<sub>j</sub> = 1</code>」，所以 <code>Σ(p<sub>k</sub> - onehot)</code> 恰好为零——这也解释了 softmax 对整体平移不变。' },

    { t: 'p', html: '数值实现要用 log-sum-exp：先减去 <code>max(z)</code> 再取指数，结果不变但不会溢出。更稳的做法是用框架的 <code>CrossEntropyLoss</code>（它内部合并了 log-softmax 与 NLL），<b>不要先手动 softmax 再传 log</b>，那样既慢又容易在 <code>log(0)</code> 处出问题。' },

    { t: 'p', html: '输出层与损失的搭配有一张必须背的表：回归用恒等输出 + 平方损失；二分类用 sigmoid + BCE；多分类用 softmax + 交叉熵；多标签（一张图可以同时有猫和狗）用<b>每个标签各自 sigmoid</b> + BCE，而不是 softmax。最后这条是最常见的错误——softmax 强制各类互斥，多标签场景下会强行压低其他类的概率。' },

    { t: 'h', lvl: 2, text: '五、初始化与优化器', id: 'ch05-5' },

    { t: 'p', html: '全零初始化是灾难：同一层的所有神经元梯度完全相同，永远学成一样的东西（对称性没被打破）。初始化太小，信号逐层衰减，输出接近常数；太大，信号逐层放大，激活饱和或溢出。正确做法是让<b>每层输出的方差大致保持不变</b>。' },

    { t: 'p', html: 'Xavier（Glorot）初始化取 <code>Var(W) = 2/(fan<sub>in</sub> + fan<sub>out</sub>)</code>，适合 tanh 这类关于原点对称的激活。He 初始化取 <code>Var(W) = 2/fan<sub>in</sub></code>，专为 ReLU 设计——因为 ReLU 把一半输出置零，方差少了一半，所以要乘 2 补回来。这两个公式不是玄学，都是「前向方差守恒」的一阶推导结果。' },

    { t: 'p', html: '优化器方面，SGD 只按当前梯度走，遇到「一个方向陡、一个方向平」的峡谷会来回震荡。Momentum 累积历史梯度，相当于给下降加惯性，能冲过平坦区与局部噪声。Adam 同时估计梯度的一阶矩与二阶矩，给每个参数自适应学习率，默认 <code>lr = 1e-3, betas = (0.9, 0.999), eps = 1e-8</code>，是大多数任务的稳妥起点。' },

    { t: 'p', html: '还有三个训练技巧值得知道。<b>批归一化</b>（batch normalization）在每个 mini-batch 上对预激活做标准化，允许更大的学习率、对初始化更鲁棒。<b>Dropout</b> 训练时随机置零一部分神经元，相当于集成很多子网络，是廉价的正则化。<b>学习率调度</b>（warmup + cosine decay）几乎是大模型训练的标配，先用小学习率热身避免早期发散，再逐步衰减到精细收敛。' },

    { t: 'code', lang: 'python', caption: '同一个任务：sklearn 的 MLP 与 PyTorch 的最小训练循环', code: `import numpy as np
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier

X, y = make_moons(n_samples=600, noise=0.25, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0)

mlp = MLPClassifier(hidden_layer_sizes=(32, 32), activation='relu',
                    solver='adam', learning_rate_init=1e-3,
                    max_iter=500, random_state=0).fit(Xtr, ytr)
print('sklearn MLP test acc =', round(mlp.score(Xte, yte), 3))
print('每层权重形状 =', [w.shape for w in mlp.coefs_])

# ---- PyTorch 等价写法（概念对照） ----
# import torch
# net = torch.nn.Sequential(
#     torch.nn.Linear(2, 32), torch.nn.ReLU(),
#     torch.nn.Linear(32, 32), torch.nn.ReLU(),
#     torch.nn.Linear(32, 2))
# opt = torch.optim.Adam(net.parameters(), lr=1e-3)
# loss_fn = torch.nn.CrossEntropyLoss()
# for xb, yb in loader:
#     opt.zero_grad()
#     loss = loss_fn(net(xb), yb)
#     loss.backward()
#     opt.step()` },

    { t: 'p', html: 'sklearn 版本三行就能得到一个能用的 MLP，适合表格数据与小规模实验；PyTorch 版本要多写循环，但换来对层、初始化、正则、调度的完全控制。<b>两者算的是同一个东西</b>：<code>MLPClassifier</code> 内部也是「线性 + ReLU + 线性 + softmax + 交叉熵 + Adam」，只是把这些都封装了。' },

    { t: 'h', lvl: 2, text: '六、CNN：卷积与池化', id: 'ch05-6' },

    { t: 'p', html: '全连接层处理图像有两个问题：参数爆炸（<code>224×224×3</code> 的图接到 1000 个隐藏单元要 1.5 亿参数）、以及完全丢弃了空间结构（把像素打乱，结果一样）。卷积层用两个假设解决它：<b>局部性</b>（一个像素只与邻域相关）与<b>平移不变性</b>（同一个模式出现在图像任何位置都该被同样的检测器识别）。' },

    { t: 'p', html: '卷积核（filter）是一个小矩阵，在输入上滑动做加权求和，得到特征图（feature map）。关键在<b>参数共享</b>：同一个核在整张图上复用，所以参数量只取决于核大小与通道数（一个 <code>3×3×C<sub>in</sub>×C<sub>out</sub></code> 的卷积层有 <code>9·C<sub>in</sub>·C<sub>out</sub></code> 个权重），与图像尺寸无关。' },

    { t: 'p', html: '输出尺寸公式必须会算：<code>H<sub>out</sub> = ⌊(H<sub>in</sub> + 2P - K)/S⌋ + 1</code>，<code>K</code> 是核大小、<code>P</code> 是填充、<code>S</code> 是步长。例：<code>32×32</code> 输入、<code>K=3, P=1, S=1</code> 时输出仍是 <code>32×32</code>（same padding）；<code>S=2</code> 时变 <code>16×16</code>。池化层（pooling）做降采样，<code>2×2</code> 最大池化把尺寸减半，没有参数，提供一定的平移鲁棒性。' },

    { t: 'p', html: '一个典型的 CNN 是「卷积 → 激活 → 池化」堆几层，再接全连接分类头。浅层学到边缘与颜色斑块，中层学到纹理与部件，深层学到物体级模式——这个层级结构是 CNN 在图像上有效的经验解释。残差连接（residual connection）<code>y = F(x) + x</code> 让梯度有一条直通路径，是把网络做深的关键发明。' },

    { t: 'h', lvl: 2, text: '七、RNN、LSTM 与序列建模', id: 'ch05-7' },

    { t: 'p', html: '序列数据（文本、语音、股价）的长度可变，且顺序有意义。RNN 用一个隐藏状态 <code>h<sub>t</sub> = tanh(W<sub>h</sub>h<sub>t-1</sub> + W<sub>x</sub>x<sub>t</sub> + b)</code> 把历史压缩进去，参数在所有时间步共享。它的问题在反向传播：梯度要沿时间连乘 <code>W<sub>h</sub></code> 与 <code>tanh′</code>，<b>连乘几十步后要么消失要么爆炸</b>。' },

    { t: 'p', html: 'LSTM 用门控解决它。三个门：遗忘门 <code>f<sub>t</sub> = σ(W<sub>f</sub>[h<sub>t-1</sub>, x<sub>t</sub>] + b<sub>f</sub>)</code>、输入门 <code>i<sub>t</sub></code>、输出门 <code>o<sub>t</sub></code>，加上一条细胞状态 <code>c<sub>t</sub> = f<sub>t</sub> ⊙ c<sub>t-1</sub> + i<sub>t</sub> ⊙ c̃<sub>t</sub></code>。关键是 <code>c</code> 的更新是<b>加法</b>，梯度可以近似恒等地上传很多步，这就是「长程记忆」的来源。GRU 是简化版，把遗忘与输入合并成一个更新门，参数更少、效果相近。' },

    { t: 'p', html: 'RNN 还有两个结构性限制。<b>串行</b>：<code>h<sub>t</sub></code> 依赖 <code>h<sub>t-1</sub></code>，无法在时间维并行，训练慢。<b>定长瓶颈</b>：编码器把整个句子压成一个向量，长句信息会丢。注意力机制正是为打破第二个限制而生，而 Transformer 连第一个也打破了。' },

    { t: 'h', lvl: 2, text: '八、注意力与 Transformer', id: 'ch05-8' },

    { t: 'p', html: '自注意力（self-attention）让每个位置直接「看」所有其他位置。每个 token 投影出三个向量：查询 <code>q</code>、键 <code>k</code>、值 <code>v</code>。注意力权重是 <code>softmax(qk<sup>T</sup>/√d<sub>k</sub>)</code>，输出是权重的加权和 <code>Σα<sub>j</sub>v<sub>j</sub></code>。除以 <code>√d<sub>k</sub></code> 是为了防止点积随维数增大而方差过大、把 softmax 推到饱和区。' },

    { t: 'p', html: '写成矩阵形式：<code>Attention(Q, K, V) = softmax(QK<sup>T</sup>/√d<sub>k</sub>)V</code>。多头注意力（multi-head）并行做 <code>h</code> 组，每组学不同的「关系类型」，再拼接投影。因为自注意力本身对顺序无感（打乱输入，输出只是跟着打乱），必须加<b>位置编码</b>（positional encoding），正弦编码或可学习的位置向量都可以。' },

    { t: 'p', html: '一个 Transformer 层 = 多头注意力 + 残差 + LayerNorm，再接前馈网络（两层线性 + 激活）+ 残差 + LayerNorm。堆 <code>N</code> 层就是编码器；解码器再多一个「交叉注意力」，用解码器的查询去看编码器的键值。它的代价是复杂度 <code>O(n<sup>2</sup>d)</code>：序列长度翻倍，注意力矩阵大四倍，这也是长上下文昂贵的原因。' },

    { t: 'table', head: ['结构', '归纳偏置', '并行性', '典型任务', '主要弱点'], rows: [
      ['MLP', '特征可任意组合', '强', '表格数据、小规模分类', '不利用结构，参数多'],
      ['CNN', '局部模式、平移不变', '强（空间维）', '图像、音频、部分文本', '长程依赖需要很深的堆叠'],
      ['RNN/LSTM', '顺序、状态传递', '弱（时间维串行）', '语音、时序、早期机器翻译', '长程梯度消失、训练慢'],
      ['Transformer', '任意位置可相关、内容寻址', '强（时间维）', '大语言模型、视觉、多模态', '<code>O(n<sup>2</sup>)</code> 复杂度、数据需求大']
    ], caption: '选结构就是选归纳偏置；偏置对了，数据效率高一个数量级' },

    { t: 'h', lvl: 2, text: '九、常见错误与自查', id: 'ch05-9' },

    { t: 'p', html: '先补一个规模上的直觉：这一章的推导都以「小网络」为例，但真实模型的参数动辄上亿。所以<b>调试神经网络的核心不是看懂每一层，而是看几条曲线</b>：训练损失是否单调下降、验证损失是否在某个 epoch 后回升、梯度范数是否爆炸或归零、激活值是否大面积饱和。这四条曲线能定位 80% 的训练问题。' },

    { t: 'table', head: ['症状', '可能原因', '处理'], rows: [
      ['损失完全不降', '学习率太大/太小、标签或形状错了', '先用一个 batch 过拟合到 0，确认管线正确'],
      ['训练降、验证升', '过拟合', '加 Dropout/权重衰减、减容量、增数据、早停'],
      ['损失变 NaN', '学习率过大、log(0)、梯度爆炸', '降学习率、加梯度裁剪、用 log-softmax'],
      ['深层网络几乎不学', '激活饱和或初始化不当', '换 ReLU、用 He/Xavier、加批归一化'],
      ['多标签任务用 softmax', '强制类别互斥', '每个标签独立 sigmoid + BCE'],
      ['只在训练集上评估', '完全无法发现过拟合', '固定划分验证集，且不参与调参']
    ], caption: '前四条是优化问题，后两条是方法论问题' },

    { t: 'p', html: '还有一个非常实用的技巧：<b>先让模型在一个小 batch 上过拟合到接近零损失</b>。如果连 8 个样本都记不住，说明代码有 bug（形状错、梯度没接上、标签错位），而不是模型容量不够。这个检查只要几十秒，能省掉几小时的盲目调参。' },

    { t: 'terms', items: [
      { en: 'backpropagation', zh: '反向传播', html: '从损失出发逆序应用链式法则，复用中间结果计算所有参数的梯度。' },
      { en: 'activation function', zh: '激活函数', html: '层间的非线性变换；没有它，多层网络等价于单层线性模型。' },
      { en: 'vanishing gradient', zh: '梯度消失', html: '梯度沿层或时间连乘小于 1 的因子而趋于零，导致浅层几乎不更新。' },
      { en: 'batch normalization', zh: '批归一化', html: '对 mini-batch 的预激活做标准化，稳定训练并允许更大学习率。' },
      { en: 'receptive field', zh: '感受野', html: '输出特征图上一个位置对应输入区域的大小，随层数增加而扩大。' },
      { en: 'gating', zh: '门控', html: '用 sigmoid 输出控制信息通过比例，LSTM 与 GRU 的核心机制。' },
      { en: 'self-attention', zh: '自注意力', html: '<code>softmax(QK<sup>T</sup>/√d)V</code>，让每个位置按内容加权聚合全局信息。' }
    ] },

    { t: 'quiz', qid: 'ch05-q1' },
    { t: 'quiz', qid: 'ch05-q2' },
    { t: 'quiz', qid: 'ch05-q3' },

    { t: 'keypoint', items: [
      { title: '没有非线性，深度毫无意义', html: '多层线性复合仍是线性；激活函数是「深度有效」的唯一原因。' },
      { title: '反向传播 = 链式法则 + 复用', html: '四个公式：输出层 δ、反向传递 δ、权重梯度、偏置梯度；形状必须对齐。' },
      { title: 'softmax + 交叉熵的梯度是 p - y', html: '合并化简，不必算 <code>K×K</code> 雅可比；数值上用 log-sum-exp。' },
      { title: '初始化要保方差', html: 'Xavier 配 tanh，He 配 ReLU；全零初始化破坏对称性。' },
      { title: 'CNN 靠参数共享省参数', html: '参数量与图像尺寸无关；输出尺寸用 <code>⌊(H+2P-K)/S⌋+1</code>。' },
      { title: 'LSTM 的加法更新保住梯度', html: '细胞状态 <code>c</code> 的加法路径让梯度近似恒等上传。' },
      { title: '注意力去掉串行与定长瓶颈', html: '代价是 <code>O(n<sup>2</sup>)</code> 复杂度与对位置编码的依赖。' }
    ] },

    { t: 'checklist', id: 'ch05', items: [
      '我能用 XOR 说明为什么需要隐藏层',
      '我能写出前向传播的每一维形状，并做形状检查',
      '我能手推两层网络的反向传播四个公式',
      '我能解释为什么 softmax + 交叉熵的梯度是 <code>p - y</code>',
      '我能为回归、二分类、多分类、多标签分别选择输出层与损失',
      '我能说明 Xavier 与 He 初始化的方差来源',
      '我能算出卷积输出的尺寸，并解释参数共享',
      '我能说明 LSTM 相比 RNN 解决了什么问题',
      '我能写出自注意力的公式，并解释为什么要除以 <code>√d<sub>k</sub></code>'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 DDA3020_ML_Lecture_09_Neural_Networks、Lecture 10 CNN、Lecture 11 RNN_Transformer，以及 DDA3020_Week_09_Multi_layer_Feedforward_Neural_Network.pptx 与 DDA3020_Lectures_softmax_gradient.pdf 组织，覆盖感知机与 XOR、隐藏层与表示学习、常用激活、通用逼近、反向传播四公式、softmax 梯度化简、初始化、SGD/Momentum/Adam、批归一化与 Dropout、卷积尺寸与参数共享、池化与残差、RNN/LSTM/GRU、自注意力与 Transformer 结构。讲义中的完整反向传播证明、卷积的反向传播、以及多头注意力的实现细节属于扩展内容，本站只保留理解结构所需的部分；章内两段代码（numpy 两层网络、sklearn 与 PyTorch 对照）均可独立运行复现。' }
  ]
});
