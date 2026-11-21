/* =====================================================================
 * projects.js · DDA5001 实战项目
 * 结构：{ id, title, en, tagline, level, minutes, chapters, goals, intro,
 *         milestones:[{ n, title, tasks, starter, hints, solution }] }
 * 三个项目由易到难：numpy 手写 softmax 回归 → Fashion-MNIST 小型 CNN
 * → 字符级 Transformer 语言模型。默认 Python 3 + numpy / PyTorch。
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerProjects([

    /* ================================================================ P1 */
    {
      id: 'P1',
      title: '从零手写 Softmax 回归',
      en: 'SOFTMAX FROM SCRATCH',
      tagline: '只用 numpy，把「线性模型 + softmax + 交叉熵 + 梯度下降」这条链亲手跑通。',
      level: '入门',
      minutes: 120,
      chapters: ['ch01', 'ch02'],
      goals: [
        '能写出数值稳定的 softmax 与交叉熵，并解释为什么要减去最大值',
        '能推导并实现 softmax 回归的解析梯度 dW = Xᵀ(P - Y)/N',
        '能用训练曲线、混淆矩阵与决策边界判断模型是欠拟合、过拟合还是学习率不当'
      ],
      intro: '框架里的 model.fit() 一行就训完了，代价是你不知道里面发生了什么。这个项目把那一行拆开：' +
        '自己生成三分类数据、自己初始化参数、自己写前向、自己推梯度、自己写更新，最后用一张决策边界图验收。' +
        '做完它，ch01 的「交叉熵 = 最大似然」和 ch02 的「输出层与损失要配对」就不再是口号，而是你调过的几行代码。',
      milestones: [
        {
          n: 1,
          title: '数据、参数与数值稳定的前向',
          tasks: [
            '用 numpy 生成三分类的二维数据：三个高斯中心分别取 (0,0)、(3,1)、(1,3)，每类 300 个点，标准差 0.8，固定随机种子 0。',
            '按训练集统计量做标准化（减均值、除标准差），而不是用全量数据——这一步是后面「不泄漏」习惯的起点。',
            '实现 softmax：先减去每行最大值再取 exp，最后归一化。用一组 logits=[1000, 1001, 1002] 验证不溢出。',
            '实现交叉熵损失：对正确类别的负对数概率取平均；同时返回 one-hot 目标矩阵，供反向使用。',
            '打印初始参数形状、初始损失，并与「均匀猜测」的 ln(3)≈1.0986 对照。'
          ],
          starter: `import numpy as np

rng = np.random.default_rng(0)

def make_data(n=300, std=0.8):
    centers = np.array([[0.0, 0.0], [3.0, 1.0], [1.0, 3.0]])
    X, y = [], []
    for k, c in enumerate(centers):
        X.append(rng.normal(c, std, size=(n, 2)))
        y.append(np.full(n, k))
    return np.vstack(X), np.concatenate(y)

X, y = make_data()
perm = rng.permutation(len(X))
X, y = X[perm], y[perm]

# 待实现：标准化、初始化 W (2,3) 与 b (3,)

def softmax(logits):
    # 待实现：减去最大值后再 exp
    pass

def cross_entropy(probs, y, k=3):
    # 待实现：返回平均损失与 one-hot 矩阵
    pass`,
          hints: [
            '减去最大值不改变 softmax 的结果（分子分母同乘一个常数），但能防止 exp(1000) 溢出为 inf。',
            '初始化不要全零：全零时同一层的所有神经元梯度相同，永远学不出差异。用 rng.normal(0, 0.01, size=(2,3))。',
            '标准化要用训练集的 mean/std，验证集沿用同一组数；否则评估时输入分布与训练不一致。'
          ],
          solution: `def softmax(logits):
    z = logits - logits.max(axis=1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=1, keepdims=True)

def cross_entropy(probs, y, k=3):
    n = len(y)
    Y = np.eye(k)[y]
    loss = -np.log(probs[np.arange(n), y] + 1e-12).mean()
    return loss, Y`
        },
        {
          n: 2,
          title: '解析梯度与训练循环',
          tasks: [
            '推导 dW 与 db：对交叉熵求导，得到 dlogits = (P - Y)/N，再链式乘回线性层。',
            '实现一次完整的前向-反向-更新，用数值梯度检查（扰动单个参数，比较解析梯度与 (L(w+ε)-L(w-ε))/2ε）验证误差小于 1e-6。',
            '写全批量梯度下降，训练 300 步，学习率 0.5，每 20 步记录一次损失与准确率。',
            '画损失曲线；确认损失单调下降且最终训练准确率超过 0.95。',
            '故意把学习率改成 5.0，观察损失爆炸；再改成 1e-5，观察几乎不降。把两种现象各写一句话解释。'
          ],
          starter: `# 接上一关
for step in range(300):
    logits = Xs @ W + b
    P = softmax(logits)
    loss, Y = cross_entropy(P, y)
    # 待实现：dW, db 与参数更新
    if step % 20 == 0:
        acc = (P.argmax(1) == y).mean()
        print(step, round(loss, 4), round(acc, 4))`,
          hints: [
            'dlogits 的形状必须是 (N,3)；先写 (P - Y)/N，再用 X.T @ dlogits 得到 (2,3) 的 dW，db 是 dlogits 按列求和。',
            '数值梯度检查时只扰动一个元素，其余固定；ε 取 1e-5 左右，太小会被浮点误差淹没。',
            '学习率 5.0 时 softmax 饱和、梯度仍然很大，参数一步跨过极小值来回震荡；1e-5 时每步移动太小，300 步走不到谷底。'
          ],
          solution: `dlogits = (P - Y) / len(y)          # (N,3)
dW = Xs.T @ dlogits                 # (2,3)
db = dlogits.sum(axis=0)            # (3,)
W -= lr * dW
b -= lr * db`
        },
        {
          n: 3,
          title: '决策边界、混淆矩阵与误差分析',
          tasks: [
            '在 [-4,6]×[-3,7] 上铺 200×200 的网格，用训练好的模型预测每点的类别，画出三色决策边界并叠加训练点。',
            '在验证集（从数据中留出 20%）上算混淆矩阵，指出最容易被混淆的两个类别及原因。',
            '统计被错分样本到各自类中心的距离，判断错误集中在边界附近还是远离中心。',
            '写一段 150 字的小结：模型学到了什么几何结构？线性边界对这份数据够不够？',
            '把类别中心改成非线性排布（例如两类同心圆），重跑并说明线性模型为什么会失败。'
          ],
          starter: `# 网格预测
xs = np.linspace(-4, 6, 200)
ys = np.linspace(-3, 7, 200)
grid = np.array([[a, b] for a in xs for b in ys])
grid = (grid - mu) / sd
pred = softmax(grid @ W + b).argmax(1).reshape(200, 200)

# 待实现：用 contourf 画边界、scatter 叠加训练点
cm = np.zeros((3, 3), dtype=int)
for t, p in zip(y_val, pred_val):
    cm[t, p] += 1
print(cm)`,
          hints: [
            'contourf 的 x、y 与 Z 维度要对齐：Z 的形状应是 (len(ys), len(xs))，用 reshape 后转置一次即可。',
            '混淆矩阵第 i 行第 j 列表示真实为 i、预测为 j 的样本数；对角线是正确数，行和是该类总数。',
            '同心圆数据上线性模型无论怎么训练都只能画一条直线，训练损失很快卡住——这是「模型容量不足」而不是优化失败。'
          ],
          solution: `# 关键结论（写进报告即可）
# 1. softmax 回归的决策边界是分段的超平面，三类的边界两两相交；
# 2. 错误几乎全部落在两类中心的连线上，远离中心的点几乎不会错；
# 3. 线性模型对同心圆无能为力：需要隐藏层把特征映射到可分空间（ch02 的主题）。`
        }
      ]
    },

    /* ================================================================ P2 */
    {
      id: 'P2',
      title: 'Fashion-MNIST 小型卷积网络',
      en: 'FASHION-MNIST CNN',
      tagline: '从 88% 的全连接基线做到 92% 左右的 CNN，并做一次有证据的调参与错误分析。',
      level: '进阶',
      minutes: 240,
      chapters: ['ch03', 'ch04', 'ch05'],
      goals: [
        '能用 PyTorch 搭出 conv-BN-ReLU-pool 的完整管线，并说清每个张量的形状',
        '能用数据增强、BatchNorm 与学习率调度把验证准确率从基线推到 92% 附近',
        '能通过混淆矩阵、错分样本与卷积核可视化定位模型的具体弱点，而不是只报一个数字'
      ],
      intro: '这个项目的重点不是刷分，而是建立「改动—验证—解释」的闭环：每一次提分都要能说清是哪个机制带来的。' +
        '你会先跑一个全连接基线，再换成卷积、加 BN、加增强，每一步只改一个变量并记录验证准确率。' +
        '最后挑出模型最常混淆的两类，用可视化的方式解释它到底看到了什么。',
      milestones: [
        {
          n: 1,
          title: '数据管线与全连接基线',
          tasks: [
            '用 torchvision 加载 Fashion-MNIST，训练集 60000、测试集 10000；从训练集再切 5000 张做验证集。',
            '做标准化（均值 0.2860、标准差 0.3530），并说明为什么不用 ImageNet 的均值方差。',
            '搭一个 784→256→10 的全连接网络，交叉熵损失、Adam、学习率 1e-3、batch 128，训练 5 个 epoch。',
            '记录每个 epoch 的训练损失、验证损失与验证准确率；基线应落在 0.87–0.89 区间。',
            '保存最佳验证模型，并写一个函数：输入一批图像，输出预测类别与置信度。'
          ],
          starter: `import torch
from torch import nn
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms

tf = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.2860,), (0.3530,)),
])
train_full = datasets.FashionMNIST('data', train=True, download=True, transform=tf)
test = datasets.FashionMNIST('data', train=False, download=True, transform=tf)
train, val = random_split(train_full, [55000, 5000])

model = nn.Sequential(
    nn.Flatten(),
    nn.Linear(784, 256), nn.ReLU(),
    nn.Linear(256, 10),
)
# 待实现：训练循环 + 每轮验证 + 保存最佳权重`,
          hints: [
            'Fashion-MNIST 是单通道 28×28，均值方差必须按它自己的像素统计，套用 ImageNet 的三通道数值会让输入整体偏移。',
            '验证集要从训练集切，不能动测试集；测试集只在最后评估一次，否则调参时就已经泄漏了。',
            'nn.CrossEntropyLoss 内部含 log_softmax，网络最后一层直接输出 logits，不要再加 softmax。'
          ],
          solution: `opt = torch.optim.Adam(model.parameters(), lr=1e-3)
lossf = nn.CrossEntropyLoss()
best = 0.0
for epoch in range(5):
    model.train()
    for xb, yb in DataLoader(train, batch_size=128, shuffle=True):
        opt.zero_grad()
        loss = lossf(model(xb), yb)
        loss.backward()
        opt.step()
    # 验证：model.eval() + torch.no_grad()，记录 acc 并保存最佳
# 基线验证准确率约 0.88`
        },
        {
          n: 2,
          title: '卷积、BatchNorm 与数据增强',
          tasks: [
            '搭一个小型 CNN：Conv(1→32,3,pad=1)-BN-ReLU → Conv(32→32,3,pad=1)-BN-ReLU → MaxPool2 → Conv(32→64,3,pad=1)-BN-ReLU → MaxPool2 → Flatten → Linear(64×7×7→10)。',
            '逐层打印输出形状，确认 28→28→14→14→7 的降采样路径与 3136 维展平向量对得上。',
            '加入训练期增强：RandomCrop(28, padding=4) 与 RandomHorizontalFlip；验证与测试阶段只做 ToTensor+Normalize。',
            '用同一套超参训练 8 个 epoch，记录验证准确率；目标 ≥0.91。',
            '做消融：分别去掉 BN、去掉增强各跑一次，把三次结果列成表，说明各自贡献了多少。'
          ],
          starter: `def conv_block(cin, cout):
    return nn.Sequential(
        nn.Conv2d(cin, cout, 3, padding=1, bias=False),
        nn.BatchNorm2d(cout),
        nn.ReLU(inplace=True),
    )

model = nn.Sequential(
    conv_block(1, 32),
    conv_block(32, 32),
    nn.MaxPool2d(2),
    conv_block(32, 64),
    nn.MaxPool2d(2),
    nn.Flatten(),
    nn.Linear(64 * 7 * 7, 10),
)
# 待实现：对比 有/无 BN、有/无增强 的验证准确率`,
          hints: [
            'Conv2d 后接 BatchNorm2d 时通常把 conv 的 bias 设为 False，因为 BN 的 β 会吸收偏置，留着只是多一组无效参数。',
            '增强只加在训练集上；若验证集也 RandomCrop，评估结果会随机抖动，无法比较模型。',
            '卷积核 3×3、padding=1、stride=1 时空间尺寸不变，尺寸只在 MaxPool 处减半，所以 28→14→7。'
          ],
          solution: `# 典型消融结果（同种子、同轮数）
# 全连接基线        0.881
# CNN 无 BN 无增强   0.905
# CNN + BN          0.918
# CNN + BN + 增强    0.926
# 结论：BN 主要稳住训练、允许更大学习率；增强提升泛化，二者叠加最好。`
        },
        {
          n: 3,
          title: '调参、混淆矩阵与卷积核可视化',
          tasks: [
            '对学习率做网格 {3e-4, 1e-3, 3e-3}，每个跑 6 个 epoch，记录验证准确率并选出最优。',
            '在测试集上算混淆矩阵，找出最容易被混淆的两对类别（提示：Shirt 与 T-shirt、Pullover 与 Coat）。',
            '挑 12 张错分样本画出来，标注真实类别与预测类别，写出你的观察。',
            '把第一层 32 个 3×3 卷积核按 8×4 网格画出来，说明其中哪些像边缘检测器、哪些像纹理检测器。',
            '写一份 300 字实验报告：基线 → 每一步改动的收益 → 剩余误差的主要来源 → 下一步可以试什么。'
          ],
          starter: `model.eval()
preds, trues = [], []
with torch.no_grad():
    for xb, yb in DataLoader(test, batch_size=256):
        preds.append(model(xb).argmax(1))
        trues.append(yb)
preds = torch.cat(preds)
trues = torch.cat(trues)
print('test acc', (preds == trues).float().mean().item())

# 待实现：混淆矩阵、错分样本网格、第一层卷积核可视化`,
          hints: [
            '混淆矩阵用 sklearn.metrics.confusion_matrix 或手写累加都可以，但要按类别名打印，否则看不出语义。',
            '错分样本不要只挑置信度最高的：高置信度错误往往揭示了系统性偏差，比边界样本更有信息量。',
            '第一层卷积核的可视化直接对 weight[0] 做 min-max 归一化再 imshow，形状是 (32,1,3,3)。'
          ],
          solution: `# 报告骨架
# 1. 基线：全连接 0.881，主要错在 Shirt/T-shirt/Pullover 三类的纹理相近；
# 2. 改动收益：BN +0.013，增强 +0.008，学习率 1e-3 最优；
# 3. 剩余误差：约 60% 集中在上述三类，模型对小图案与宽松剪裁不敏感；
# 4. 下一步：更强的增强（旋转、Cutout）或迁移学习，而不是继续加深网络。`
        }
      ]
    },

    /* ================================================================ P3 */
    {
      id: 'P3',
      title: '字符级 Transformer 语言模型',
      en: 'CHAR-LEVEL TRANSFORMER',
      tagline: '从分词、掩码注意力到采样，手搭一个能续写文本的小型 GPT，并用困惑度验收。',
      level: '挑战',
      minutes: 300,
      chapters: ['ch03', 'ch06', 'ch07'],
      goals: [
        '能实现因果自注意力、残差块与层归一化，并验证掩码没有泄漏未来信息',
        '能训练字符级语言模型，用验证困惑度与 unigram 基线对比',
        '能用温度与 top-k 采样生成文本，并解释不同参数对输出的影响'
      ],
      intro: '这是全书内容的汇合点：ch03 的反向传播保证梯度能穿过几十个块，ch06 的注意力负责建模长程依赖，' +
        'ch07 的生成视角让你理解「语言模型就是一个下一字符的分类器」。' +
        '项目规模刻意做小：一层或两层、几十万参数、几分钟训练，重点是每一步都可验证，而不是堆算力。',
      milestones: [
        {
          n: 1,
          title: '字符表、分块与下一字符目标',
          tasks: [
            '准备一份 10 万字符以上的纯文本（莎士比亚全集、维基片段或你自己的笔记），统计字符表并建立 stoi/itos 映射。',
            '把全文编码成整数数组，按 90/10 切训练与验证。',
            '实现 get_batch：随机取 B 个起点，输入是 x[i:i+T]，目标是把输入左移一位的 y[i+1:i+T+1]。',
            '打印一个批次的形状与解码后的文本，确认 x 与 y 错开一位。',
            '写一个 unigram 基线：统计字符频率并按频率采样，记录它的验证交叉熵（约 3.3 nat）。'
          ],
          starter: `import torch

text = open('corpus.txt', encoding='utf-8').read()
chars = sorted(set(text))
stoi = {c: i for i, c in enumerate(chars)}
itos = {i: c for c, i in stoi.items()}
data = torch.tensor([stoi[c] for c in text], dtype=torch.long)
n = int(0.9 * len(data))
train_data, val_data = data[:n], data[n:]

def get_batch(split, B=32, T=128):
    d = train_data if split == 'train' else val_data
    ix = torch.randint(len(d) - T - 1, (B,))
    x = torch.stack([d[i:i + T] for i in ix])
    y = torch.stack([d[i + 1:i + T + 1] for i in ix])
    return x, y

# 待实现：验证形状、解码一个批次、算 unigram 基线`,
          hints: [
            '目标不是「预测整段」，而是每个位置都预测下一个字符，所以一批里有 B×T 个分类任务，损失是平均交叉熵。',
            '字符表大小通常几十到一百多，远小于词表；这也是字符级模型参数少、训练快的原因。',
            'unigram 基线的交叉熵就是 -Σ p(c) log p(c)，用训练集频率估计 p(c)，可直接作为 sanity check。'
          ],
          solution: `x, y = get_batch('train')
print(x.shape, y.shape)                       # (32,128)
print(''.join(itos[i] for i in x[0][:40]))
print(''.join(itos[i] for i in y[0][:40]))    # 比上一行左移一位

import collections, math
cnt = collections.Counter(text)
total = len(text)
ce = -sum((v / total) * math.log(v / total) for v in cnt.values())
print('unigram CE', round(ce, 3))             # 约 3.2–3.4`
        },
        {
          n: 2,
          title: '因果自注意力与 Transformer 块',
          tasks: [
            '实现单头自注意力：q、k、v 线性投影，scores = q @ kᵀ / √d，加下三角掩码后 softmax，再乘 v。',
            '用断言验证掩码正确：随机输入下，改动序列最后一个字符，前 T-1 个位置的输出必须完全不变。',
            '实现 Transformer 块：LayerNorm → 注意力 → 残差 → LayerNorm → 两层 MLP（4 倍扩张、GELU）→ 残差。',
            '堆 2 个块，加上 token 嵌入与位置嵌入，输出投影到词表；打印总参数量，应在 10 万–50 万之间。',
            '确认输出 logits 形状为 (B,T,V)，并用交叉熵损失跑一次前向，损失应接近 ln(V)。'
          ],
          starter: `import torch.nn as nn
import torch.nn.functional as F

class Head(nn.Module):
    def __init__(self, d_model, head_size, block_size):
        super().__init__()
        self.q = nn.Linear(d_model, head_size, bias=False)
        self.k = nn.Linear(d_model, head_size, bias=False)
        self.v = nn.Linear(d_model, head_size, bias=False)
        self.register_buffer('tril', torch.tril(torch.ones(block_size, block_size)))

    def forward(self, x):
        B, T, C = x.shape
        q, k, v = self.q(x), self.k(x), self.v(x)
        # 待实现：scores、掩码、softmax、加权求和
        return out

# 待实现：Block、位置嵌入、语言模型头`,
          hints: [
            '掩码要在 softmax 之前把上三角填成 -inf，不是 softmax 之后置零；后者会让每行和小于 1，权重不再归一化。',
            '残差要求输入输出维度一致；若 d_model 与 head_size 不同，需要在注意力后加一个投影。',
            '位置嵌入用 nn.Embedding(block_size, d_model)，与 token 嵌入相加，不要拼接。'
          ],
          solution: `scores = q @ k.transpose(-2, -1) / (k.size(-1) ** 0.5)
scores = scores.masked_fill(self.tril[:T, :T] == 0, float('-inf'))
att = F.softmax(scores, dim=-1)
out = att @ v

# 掩码自检：改动最后一个字符，前面的输出必须不变
x2 = x.clone()
x2[:, -1] = torch.randint(0, 10, (B,))
assert torch.allclose(model(x)[:, :-1], model(x2)[:, :-1], atol=1e-6)`
        },
        {
          n: 3,
          title: '训练、困惑度与采样',
          tasks: [
            '用 AdamW（lr 3e-4、weight_decay 0.01）、余弦退火训练 3000 步，每 200 步记录训练与验证损失。',
            '把损失换算成困惑度 exp(loss)，与 unigram 基线比较；目标验证困惑度低于 2.2。',
            '实现采样函数：从一段提示出发，逐步取最后一个位置的 logits，按温度缩放后做 softmax 采样，追加到序列。',
            '对比温度 0.5、0.8、1.2 与 top-k=10 的生成结果，各写一句观察。',
            '写 200 字总结：模型的错误是拼写层面还是语法层面？困惑度下降主要来自哪类字符？'
          ],
          starter: `opt = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=0.01)
sched = torch.optim.lr_scheduler.CosineAnnealingLR(opt, T_max=3000)
lossf = nn.CrossEntropyLoss()

for step in range(3000):
    xb, yb = get_batch('train')
    logits = model(xb)
    loss = lossf(logits.view(-1, logits.size(-1)), yb.view(-1))
    opt.zero_grad()
    loss.backward()
    opt.step()
    sched.step()

@torch.no_grad()
def sample(prompt, n=200, temperature=1.0, top_k=None):
    # 待实现
    pass`,
          hints: [
            '评估时一定要 model.eval() + torch.no_grad()，否则 dropout 与 BN 会让验证损失抖动。',
            '困惑度 = exp(交叉熵)，可直接理解为「模型在每一步平均在多少个字符之间犹豫」。',
            '温度趋近 0 时退化为贪心，输出重复；温度过高会放大小概率错误，出现乱码。top-k 先截断再采样能兼顾多样性与质量。'
          ],
          solution: `@torch.no_grad()
def sample(prompt, n=200, temperature=1.0, top_k=None):
    model.eval()
    idx = torch.tensor([[stoi[c] for c in prompt]])
    for _ in range(n):
        logits = model(idx[:, -block_size:])[:, -1, :] / temperature
        if top_k:
            v, _ = torch.topk(logits, top_k)
            logits[logits < v[:, [-1]]] = float('-inf')
        probs = F.softmax(logits, dim=-1)
        nxt = torch.multinomial(probs, 1)
        idx = torch.cat([idx, nxt], dim=1)
    return ''.join(itos[i] for i in idx[0].tolist())`
        }
      ]
    }
  ]);
})();
