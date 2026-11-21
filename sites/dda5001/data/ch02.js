/* =====================================================================
 * ch02.js · 第 2 章 · 多层网络：结构、激活与表示能力
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch02',
  num: '02',
  title: '多层网络：结构、激活与表示能力',
  en: 'MULTILAYER NETWORKS',
  goals: [
    '说明隐藏层如何把线性不可分问题变成线性可分，并用 XOR 手算一遍',
    '比较 sigmoid、tanh、ReLU、GELU 的导数与适用场景，解释梯度消失的成因',
    '说清万有逼近定理保证了什么、没有保证什么，以及深度相对宽度的优势',
    '给定任意 MLP 结构，准确算出参数量与每一层张量的形状',
    '用向量化代码实现前向传播，并根据激活值方差选择 Xavier 或 He 初始化'
  ],
  kp: [
    { id: 'ch02-1', title: '从感知机到多层感知机' },
    { id: 'ch02-2', title: '激活函数：sigmoid、tanh、ReLU、GELU' },
    { id: 'ch02-3', title: '万有逼近与深度优势' },
    { id: 'ch02-4', title: '参数计数与形状推演' },
    { id: 'ch02-5', title: '输出层与损失的配对' },
    { id: 'ch02-6', title: '前向传播的向量化实现' },
    { id: 'ch02-7', title: '初始化与信号传播' },
    { id: 'ch02-8', title: '形状与参数自查' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么需要隐藏层', html: '第 1 章的所有模型都是「输入线性变换后接一个输出层」，决策边界只能是超平面。隐藏层的作用不是「多算几步」，而是<b>换一个表示空间</b>：把原始输入映射到新坐标，在那里原本缠绕的类别变得可以用平面分开。理解这一点，才能理解为什么深度网络不是「更宽的线性模型」。' },
    { t: 'p', lead: true, html: '多层感知机（multilayer perceptron, MLP）是最基本的深度模型：若干全连接层堆叠，每层之间夹一个逐元素的非线性函数。它结构简单，却包含了深度学习的所有核心问题——表示能力、梯度传播、初始化、正则化。本章先把结构和形状讲清楚，第 3 章再回答「参数怎么学」。' },

    { t: 'h', lvl: 2, text: '从感知机到多层感知机', id: 'ch02-1' },
    { t: 'p', html: '感知机（perceptron）是 1958 年提出的线性分类器：<code>ŷ = sign(wᵀx + b)</code>，把输入空间切成两半。它的训练规则极其简单——分错就把权重往样本方向挪一点——并且在数据线性可分时保证收敛。但它连 XOR 都做不了：四个点里任何一条直线都会分错两个。' },
    { t: 'p', html: '解决办法是加一层。取两个隐藏单元 <code>h₁ = ReLU(x₁ + x₂)</code>、<code>h₂ = ReLU(x₁ + x₂ - 1)</code>，输出 <code>y = h₁ - 2h₂</code>，就能在四个点上得到 0、1、1、0。几何上看，隐藏层把四个点搬到了新的二维坐标 (h₁, h₂)，在那里一条直线就能分开。这就是「表示变换」的最小例子。' },
    { t: 'p', html: '写成矩阵形式：<code>h = φ(W₁x + b₁)</code>，<code>ŷ = W₂h + b₂</code>。其中 <code>φ</code> 逐元素作用。如果没有 <code>φ</code>，两层线性变换复合仍是线性变换，堆多少层都等价于一层——这是初学者最常犯的结构性错误。非线性的位置在「线性层之后、下一层之前」，顺序不能省。' },
    { t: 'code', lang: 'python', caption: '手算 XOR：隐藏层如何改变坐标', code: `import numpy as np

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
y = np.array([0, 1, 1, 0])

W1 = np.array([[1.0, 1.0], [1.0, 1.0]])   # 两个隐藏单元都看 x1+x2
b1 = np.array([0.0, -1.0])
W2 = np.array([[1.0, -2.0]])              # y = h1 - 2*h2
b2 = np.array([0.0])

h = np.maximum(0, X @ W1 + b1)            # (4, 2)
out = h @ W2.T + b2                       # (4, 1)
print(h)        # [[0,0],[1,0],[1,0],[2,1]]
print(out.ravel())  # [0. 1. 1. 0.]` },
    { t: 'p', html: '这段代码值得逐行看：隐藏层把 (0,0) 映射到 (0,0)、(0,1) 与 (1,0) 映射到 (1,0)、(1,1) 映射到 (2,1)。在新坐标里，前三个点的 h₂ 都是 0，第四个点是 1，于是 <code>h₁ - 2h₂</code> 恰好给出目标。手工设计出这组权重说明：表达能力不是问题，问题在于能否从数据里学到它们。' },

    { t: 'h', lvl: 2, text: '激活函数：sigmoid、tanh、ReLU、GELU', id: 'ch02-2' },
    { t: 'p', html: '激活函数决定网络的非线性形状，也决定梯度能不能传回去。sigmoid 把实数压到 (0,1)，导数 <code>σ(1-σ)</code> 最大只有 0.25；tanh 压到 (-1,1)，导数最大为 1 且零中心；ReLU 是 <code>max(0, z)</code>，正区间导数恒为 1，负区间为 0。' },
    { t: 'p', html: 'sigmoid 的问题是两端饱和：输入绝对值一大，导数就趋近于 0，多层连乘后梯度指数衰减。tanh 缓解了零中心问题，但饱和依旧。ReLU 在正区间不饱和，计算只需一次比较，成为深度网络的默认选择；代价是负区间梯度为零，学习率过大时神经元可能「死掉」，永久输出 0。' },
    { t: 'p', html: 'GELU 是 <code>x · Φ(x)</code>，其中 Φ 是标准正态的累积分布函数，常用 tanh 近似。它在零点附近平滑，负区间保留很小的梯度，因此在 Transformer 里比 ReLU 更常见。LeakyReLU 与 SiLU 是同类思路：给负区间留一个小斜率，避免神经元彻底失活。' },
    { t: 'table', head: ['函数', '表达式', '导数', '优点', '缺点与场景'], rows: [
      ['sigmoid', '1/(1+e⁻ᶻ)', 'σ(1-σ)，最大 0.25', '输出可解释为概率', '饱和导致梯度消失，仅用于二分类输出'],
      ['tanh', '(eᶻ-e⁻ᶻ)/(eᶻ+e⁻ᶻ)', '1-tanh²，最大 1', '零中心，收敛快于 sigmoid', '两端仍饱和，深网络慎用'],
      ['ReLU', 'max(0, z)', '1 或 0', '不饱和、计算便宜', '负区间死亡，需较小学习率'],
      ['LeakyReLU', 'max(αz, z)', '1 或 α', '避免神经元死亡', '多一个超参数 α'],
      ['GELU', 'z·Φ(z)', 'Φ(z)+z·φ(z)', '平滑、负区间有梯度', '计算稍贵，Transformer 常用']
    ] },
    { t: 'callout', kind: 'warn', title: '输出层不要乱加激活', html: '隐藏层用 ReLU 或 GELU，输出层要跟损失配对：多分类输出 logits（不加 softmax），交给 <code>CrossEntropyLoss</code>；二分类输出一个 logit，交给 <code>BCEWithLogitsLoss</code>；回归输出恒等。在输出层加 sigmoid 再喂给带 logits 的损失，等于做了两次变换，梯度会变小甚至出错。' },

    { t: 'h', lvl: 2, text: '万有逼近与深度优势', id: 'ch02-3' },
    { t: 'p', html: '万有逼近定理（universal approximation theorem）说：只要隐藏层足够宽，含一个隐藏层的网络可以在紧集上以任意精度逼近任意连续函数。这条定理保证了「MLP 这个模型族足够大」，但它没有保证三件事——需要多少参数、能不能从数据里学到、需要多少样本。' },
    { t: 'p', html: '宽度换精度的代价可能是指数级的。有些函数用深层结构表示只需要多项式个单元，用单层却需要指数个。直观理解：深度网络可以复用中间结果，第 k 层在前 k-1 层的基础上组合，形成指数多的线性区域；单层网络只能把输入空间切成有限多块，块数随宽度线性增长。' },
    { t: 'p', html: '所以「深」不是为了好看，而是为了在参数预算内表达更复杂的组合。但深度也带来优化困难：梯度要穿过更多层，容易消失或爆炸；训练数据有限时，深层模型更容易记住噪声。第 3、4 章的大部分技术——残差连接、归一化、更好的初始化——都是在解决「深」带来的副作用。' },
    { t: 'compare', left: { title: '宽而浅', html: '一个隐藏层、很多单元。理论上有万有逼近，优化相对容易，但参数量随宽度平方增长，表达组合结构时效率低。' }, right: { title: '深而窄', html: '多个隐藏层、每层单元较少。参数量省、能复用中间表示，但梯度传播难，需要初始化、归一化与残差连接配合。' } },

    { t: 'h', lvl: 2, text: '参数计数与形状推演', id: 'ch02-4' },
    { t: 'p', html: '全连接层的参数数量是 <code>fan_in × fan_out + fan_out</code>：权重矩阵加偏置向量。以 MNIST 的 784-256-10 网络为例，第一层 <code>784×256 + 256 = 200,960</code>，第二层 <code>256×10 + 10 = 2,570</code>，合计 203,530。会算这个数，才能在显存不足时判断该砍哪一层。' },
    { t: 'p', html: '形状推演的关键约定是「batch 维在最前」。<code>nn.Linear(in_features, out_features)</code> 只关心最后一维：输入 <code>(B, in)</code> 输出 <code>(B, out)</code>，输入 <code>(B, T, in)</code> 输出 <code>(B, T, out)</code>。中间任何一维对不上，PyTorch 会直接报错；真正危险的是「能跑但含义错了」，比如把类别维和序列维搞混。' },
    { t: 'code', lang: 'python', caption: '参数量与逐层形状：把每一步打印出来', code: `import torch
from torch import nn

net = nn.Sequential(
    nn.Flatten(),              # (B,1,28,28) -> (B,784)
    nn.Linear(784, 256), nn.ReLU(),
    nn.Linear(256, 10))

x = torch.randn(32, 1, 28, 28)
for layer in net:
    x = layer(x)
    print(f"{layer.__class__.__name__:12s} -> {tuple(x.shape)}")
# Flatten       -> (32, 784)
# Linear        -> (32, 256)
# ReLU          -> (32, 256)
# Linear        -> (32, 10)

total = sum(p.numel() for p in net.parameters())
print(total)   # 203530 = (784*256+256) + (256*10+10)` },
    { t: 'table', head: ['结构', '参数量', '说明'], rows: [
      ['784 → 10', '7,850', 'softmax 回归，无隐藏层'],
      ['784 → 256 → 10', '203,530', '一层隐藏层，约 26 倍'],
      ['784 → 512 → 256 → 10', '535,306', '两层隐藏层'],
      ['784 → 2048 → 2048 → 10', '5,830,666', '宽网络，参数增长极快'],
      ['卷积替代第一层（8 个 3×3 核）', '约 80', '同感受野下参数少两个数量级']
    ] },
    { t: 'p', html: '最后一行是第 5 章的伏笔：处理 28×28 图像时，一个 3×3 卷积核只有 9 个权重（加偏置 10 个），8 个核共 80 个参数，却能覆盖整张图。全连接层把每个像素都当成独立特征，浪费了「相邻像素相似」这个先验。参数量的差距不是实现细节，而是模型假设的差距。' },

    { t: 'h', lvl: 2, text: '输出层与损失的配对', id: 'ch02-5' },
    { t: 'p', html: '输出层的设计由任务决定，而任务由标签的形式决定。回归任务的标签是实数，输出一个标量或向量，损失用 MSE；二分类标签是 0/1，输出一个 logit，损失用带 logits 的 BCE；多分类标签是互斥类别，输出 K 个 logits，损失用交叉熵。' },
    { t: 'p', html: '多标签任务要特别小心：一张图可以同时有「人」「车」「树」，标签是 K 个独立的 0/1。此时输出层用逐元素 sigmoid，损失是 K 个 BCE 的平均，而不是 softmax 加交叉熵。用错的话，模型会被迫在「人」和「车」之间做选择，召回率大幅下降。' },
    { t: 'table', head: ['任务', '标签形状', '输出层', '损失函数', '预测方式'], rows: [
      ['回归', '(B,) 或 (B,D)', '恒等', 'MSELoss', '直接输出'],
      ['二分类', '(B,) 取值 0/1', '1 个 logit', 'BCEWithLogitsLoss', 'sigmoid 后卡阈值'],
      ['多分类', '(B,) 取值 0..K-1', 'K 个 logits', 'CrossEntropyLoss', 'argmax'],
      ['多标签', '(B,K) 取值 0/1', 'K 个 logit + sigmoid', 'BCEWithLogitsLoss', '每个标签独立卡阈值'],
      ['排序/对比', '成对或三元组', '归一化向量', 'Triplet / InfoNCE', '按相似度排序']
    ] },
    { t: 'p', html: '还有一个容易忽略的点：损失函数是否内置了激活。PyTorch 的 <code>CrossEntropyLoss</code> 与 <code>BCEWithLogitsLoss</code> 都内置了 log_softmax 或 sigmoid，接收的是 logits；而 <code>NLLLoss</code> 要求先自己做 log_softmax。混用不会报错，但会让梯度变小、收敛变慢，是实验中最隐蔽的 bug 之一。' },

    { t: 'h', lvl: 2, text: '前向传播的向量化实现', id: 'ch02-6' },
    { t: 'p', html: '前向传播的本质是一串矩阵乘法加逐元素函数。向量化的意义不只是快：它把「对每个样本循环」变成「对一批样本同时算」，让 GPU 的并行单元跑满，也让代码里的形状错误立刻暴露。写训练脚本时，应当先在小批量上把每一层的形状打印出来，确认无误再扩大规模。' },
    { t: 'code', lang: 'python', caption: '用 numpy 写一个两层 MLP 的前向传播', code: `import numpy as np

def relu(z):
    return np.maximum(0, z)

def forward(x, params):
    W1, b1, W2, b2 = params
    z1 = x @ W1 + b1          # (B, H)
    h1 = relu(z1)
    logits = h1 @ W2 + b2     # (B, K)
    # 数值稳定的 log_softmax
    shifted = logits - logits.max(axis=1, keepdims=True)
    logp = shifted - np.log(np.exp(shifted).sum(axis=1, keepdims=True))
    return h1, logp

rng = np.random.default_rng(0)
B, D, H, K = 8, 4, 16, 3
x = rng.normal(size=(B, D))
params = [rng.normal(size=(D, H)) * 0.5, np.zeros(H),
          rng.normal(size=(H, K)) * 0.5, np.zeros(K)]
h1, logp = forward(x, params)
print(h1.shape, logp.shape)   # (8, 16) (8, 3)
print(np.exp(logp).sum(axis=1))  # 每行和为 1` },
    { t: 'p', html: '这段代码没有用到任何深度学习框架，却能说明三件事：第一，前向传播就是几次矩阵乘法；第二，softmax 与 log 合并成 log_softmax 更稳定；第三，每行概率之和为 1 是可以验证的。把这三个检查写进单元测试，比肉眼读代码可靠得多。' },
    { t: 'callout', kind: 'tip', title: '形状检查清单', html: '输入 <code>(B, D)</code> → 第一层权重 <code>(D, H)</code> → 隐藏 <code>(B, H)</code> → 输出权重 <code>(H, K)</code> → logits <code>(B, K)</code>。任何一步对不上，先检查是不是把 <code>D</code> 和 <code>H</code> 写反，或者忘了 batch 维。' },

    { t: 'h', lvl: 2, text: '初始化与信号传播', id: 'ch02-7' },
    { t: 'p', html: '初始化看似无关紧要，实则决定训练能否开始。如果所有权重都初始化为 0，同一层的所有隐藏单元收到相同的输入、算出相同的梯度，永远保持相同——这叫对称性未被打破。所以必须随机初始化，让每个单元从不同的起点出发。' },
    { t: 'p', html: '随机的大小也有讲究。方差太大，激活值逐层放大，最后溢出；方差太小，激活值逐层缩小，到最后一层几乎为常数，梯度也随之消失。Xavier 初始化令 <code>Var(w) = 2/(fan_in + fan_out)</code>，适合 tanh 与 sigmoid；He 初始化令 <code>Var(w) = 2/fan_in</code>，补偿 ReLU 把一半激活置零造成的方差减半。' },
    { t: 'p', html: 'PyTorch 的 <code>nn.Linear</code> 默认用 Kaiming 均匀初始化，对 ReLU 网络基本够用；但如果你自己写层、或者换成 tanh，显式指定初始化会更稳。判断初始化是否合适，最直接的办法是打印每一层激活值的均值与标准差：健康的网络应当让它们在层间大致保持同一量级。' },
    { t: 'code', lang: 'python', caption: '比较两种初始化下激活值的逐层方差', code: `import torch
from torch import nn

def stack(depth=20, width=256, mode="he"):
    layers = []
    for _ in range(depth):
        lin = nn.Linear(width, width)
        if mode == "he":
            nn.init.kaiming_normal_(lin.weight, nonlinearity="relu")
        else:
            nn.init.normal_(lin.weight, std=0.01)
        layers += [lin, nn.ReLU()]
    return nn.Sequential(*layers)

x = torch.randn(64, 256)
for mode in ["he", "tiny"]:
    net = stack(mode=mode)
    h = x
    with torch.no_grad():
        for i, layer in enumerate(net):
            h = layer(h)
            if i % 4 == 3:
                print(mode, i, round(h.std().item(), 4))` },
    { t: 'p', html: '运行结果会看到：He 初始化下每层标准差稳定在 0.6 到 0.8 附近；标准差 0.01 的初始化则在几层之内把信号压到 1e-6 量级，此时反向传播的梯度也会同样微小，训练几乎停滞。这不是理论推演，而是可以用十行代码复现的现象，建议亲手跑一遍。' },

    { t: 'h', lvl: 2, text: '形状与参数自查', id: 'ch02-8' },
    { t: 'p', html: '这一章的计算题几乎都能用两分钟自查：写下每层的输入输出形状，再用公式累加参数量。养成习惯之后，看到报错里的 <code>size mismatch</code> 就能立刻定位是哪一层。' },
    { t: 'code', lang: 'python', caption: '打印每层形状与参数量，并与手算对照', code: `import torch
from torch import nn

model = nn.Sequential(
    nn.Flatten(),
    nn.Linear(784, 256), nn.ReLU(),
    nn.Linear(256, 64), nn.ReLU(),
    nn.Linear(64, 10),
)
x = torch.randn(32, 1, 28, 28)

# 逐层前向，打印形状变化
h = x
for layer in model:
    h = layer(h)
    print(f'{layer.__class__.__name__:12s} {tuple(h.shape)}')

# 参数量：与手算对照
total = sum(p.numel() for p in model.parameters())
print('总参数', total)
print('手算', (784 * 256 + 256) + (256 * 64 + 64) + (64 * 10 + 10))` },
    { t: 'p', html: '运行结果应显示 784 → 256 → 64 → 10，总参数 218762。如果手算与打印不一致，最常见的原因是漏加了偏置，或者把 <code>Flatten</code> 当成了一层可学习变换——它只改形状，没有参数。' },
    { t: 'table', head: ['报错信息', '真实原因', '怎么改'], rows: [
      ['mat1 and mat2 shapes cannot be multiplied', '输入特征数与 Linear 的 in_features 不一致', '检查 Flatten 之后的维度，或改 in_features'],
      ['Expected 4-dimensional input', '把 (B,C,H,W) 直接喂给了 Conv2d 之前的层', '确认张量是四维，灰度图要补通道维'],
      ['size mismatch for fc.weight', '分类头输出维度与类别数不一致', '把最后一层改成 num_classes'],
      ['CUDA out of memory', '不是形状问题，但常与 batch 过大同时出现', '减小 batch，或检查是否误保留了计算图']
    ] },

    { t: 'terms', items: [
      { en: 'multilayer perceptron', zh: '多层感知机', def: '由多个全连接层与逐元素非线性交替堆叠而成的前馈网络。' },
      { en: 'activation function', zh: '激活函数', def: '作用在每个线性层输出上的非线性函数，使网络能表示非线性映射。' },
      { en: 'universal approximation', zh: '万有逼近', def: '足够宽的单隐层网络可逼近紧集上的任意连续函数。' },
      { en: 'fan-in / fan-out', zh: '扇入 / 扇出', def: '一层输入的维度与输出的维度，决定参数量与初始化方差。' },
      { en: 'dying ReLU', zh: 'ReLU 死亡', def: '神经元长期处于负区间，梯度恒为零，参数不再更新。' },
      { en: 'logits', zh: 'logits', def: '输出层未归一化的分数，需经 softmax 或 sigmoid 才成为概率。' }
    ] },
    { t: 'quiz', qid: 'ch02-q1' },
    { t: 'quiz', qid: 'ch02-q2' },
    { t: 'quiz', qid: 'ch02-q3' },
    { t: 'keypoint', title: '本章要点', items: [
      { title: '非线性不可省', html: '去掉激活函数，多层线性变换复合仍是一层线性模型。' },
      { title: '激活的选择', html: '隐藏层默认 ReLU/GELU；输出层按任务配损失，不重复加激活。' },
      { title: '参数量公式', html: '全连接层为 fan_in × fan_out + fan_out；784-256-10 共 203,530。' },
      { title: '形状约定', html: 'batch 维在最前，Linear 只改最后一维；写代码前先打印形状。' },
      { title: '初始化', html: '随机打破对称；ReLU 用 He，tanh 用 Xavier；看激活方差验证。' }
    ] },
    { t: 'checklist', id: 'ch02', items: [
      '能用几何语言解释隐藏层为什么让 XOR 变得线性可分',
      '能写出 sigmoid、tanh、ReLU 的导数并比较饱和区间',
      '能说出万有逼近定理成立的前提，以及它没有保证什么',
      '能解释为什么深网络在表达组合结构时更省参数',
      '给定 784-512-256-10 的结构，能算出总参数量',
      '能判断多分类与多标签分别该用什么输出层与损失',
      '能手写向量化的两层前向传播，并验证每行概率和为 1',
      '能解释全零初始化为什么会让隐藏单元永远相同',
      '能说出 Xavier 与 He 初始化的方差公式及适用激活函数'
    ] },
    { t: 'p', html: '结构搭好之后，下一个问题是：这二十万个参数怎么从数据里学出来？下一章从计算图与链式法则出发，推导反向传播，并解释 PyTorch 的 autograd 到底替你做了什么。' },
    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章覆盖感知机与 XOR、四种激活函数、万有逼近与深度优势、参数量与形状推演、输出层与损失配对、向量化前向传播、Xavier 与 He 初始化。依据教材《Deep Learning: Foundations and Concepts》中深层网络与网络训练相关主题，以及《Pattern Recognition and Machine Learning》中文版对线性模型与基函数扩展的处理；定理只给结论与直觉，不展开证明。' }
  ]
});
