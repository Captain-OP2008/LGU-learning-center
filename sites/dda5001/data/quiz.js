/* =====================================================================
 * quiz.js · DDA5001 深度学习 分章题库
 * 结构：{ items:[{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options?, answer?, accept?, code?, explain }] }
 * 题型：mcq / tf / fill / multi / predict
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
        stem: '本站八章的安排遵循哪条主线？',
        options: [
          { text: '先讲生成模型，再讲判别模型，最后补数学' },
          { text: '从概率与损失出发，依次到多层结构、反向传播、训练、卷积、序列，最后生成模型与端到端实战', correct: true },
          { text: '按字母顺序排列，彼此独立' },
          { text: '先讲部署与运维，再讲模型结构' }
        ],
        explain: '八章是一条依赖链：ch01 用概率把损失讲清楚，ch02 给出多层结构，ch03 说明梯度怎么来，ch04 讲怎么训得动，ch05 与 ch06 分别处理空间与序列结构，ch07 换成生成目标并收束到端到端项目。后面的章节会反复用到前面的结论，跳读容易断链。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '必须先修完测度论与泛函分析，才能开始学深度学习。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '课程只要求「用得上的数学」：矩阵乘法、偏导与链式法则、概率里的期望与条件分布、softmax 与对数的数值性质。测度论与泛函分析是研究理论时的工具，不是读懂本课程与写出可训练模型的前提。缺少的部分可以按需补，而不是先停半年。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '本站反复强调的三条主线是哪些？（多选）',
        options: [
          { text: '概率与损失：模型输出什么分布、损失从哪来', correct: true },
          { text: '优化：梯度怎么算、参数怎么更新', correct: true },
          { text: '表示：网络如何把输入变换成有用的特征', correct: true },
          { text: '编译器优化：如何把 Python 编译成机器码' },
          { text: '网络协议：如何保证分布式训练的通信' }
        ],
        explain: '三条主线贯穿全书：概率决定了「输出什么、损失是什么」，优化决定了「参数怎么动」，表示决定了「中间层学到什么」。编译器与通信协议是工程实现细节，不是本课程的组织线索，虽然它们在真实系统里也重要。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'fill', difficulty: 2,
        tags: ['math'],
        stem: '一张 28×28 的灰度图直接接到 10 类 softmax（无隐藏层），参数量是 ______（含偏置）。',
        answer: '7850',
        accept: ['7850 个', '7850个', '7,850'],
        explain: '输入维度 28×28 = 784，每个类别需要 784 个权重加 1 个偏置，共 10×(784+1) = 7850。这个数字是后续所有对比的基准：加一个 256 维隐藏层后变成 203530，参数量的增长要能随手算出来。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '这门课要解决的核心问题是什么？',
        options: [
          { text: '手写一套深度学习框架的底层算子' },
          { text: '从数据中学习可泛化的映射与表示，并让它在没见过的样本上有效', correct: true },
          { text: '证明某个网络结构的收敛性上界' },
          { text: '把已有模型部署到手机上' }
        ],
        explain: '核心是「学习 + 泛化」：用数据拟合一个函数，并保证它在训练集之外仍然有效。写框架、证收敛、做部署都是相关工程或理论研究，本课程把它们当作背景而不是主线。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: `import torch
x = torch.arange(12).reshape(3, 4)
print(x.sum(dim=0).tolist())`,
        stem: '这段代码打印什么？',
        answer: '[12, 15, 18, 21]',
        accept: ['[12, 15, 18, 21]', '12 15 18 21'],
        explain: 'arange(12) 生成 0 到 11，reshape(3, 4) 后每一行是 [0,1,2,3]、[4,5,6,7]、[8,9,10,11]。dim=0 沿行方向求和，得到每列之和 [0+4+8, 1+5+9, 2+6+10, 3+7+11] = [12,15,18,21]。分清 dim 是「被压掉的轴」是后面所有广播与矩阵运算的基础。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '按本站建议，学完一章后最有效的下一步是什么？',
        options: [
          { text: '立刻开始下一章的视频' },
          { text: '合上正文做自检清单与内嵌题，再挑一个项目里程碑动手实现', correct: true },
          { text: '把本章代码原样抄一遍' },
          { text: '只背术语表里的英文缩写' }
        ],
        explain: '自检清单暴露「以为懂了其实说不清」的地方，内嵌题检查概念边界，项目里程碑把它变成能跑通的代码。抄代码不产生理解，跳过自检则会把漏洞带到后面章节——尤其是反向传播与训练技巧，前面的漏洞会在那里集中爆发。'
      },

      /* ---------------- ch01 概率视角 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '分类任务普遍用交叉熵而不用均方误差，主要原因是？',
        options: [
          { text: '交叉熵计算更快，少一次除法' },
          { text: '交叉熵是分类分布的最大似然损失，梯度尺度更合适，且不会因 softmax 饱和而几乎消失', correct: true },
          { text: '均方误差不能求导' },
          { text: '交叉熵只适用于二分类' }
        ],
        explain: '把标签看成 one-hot 的分类分布，最小化交叉熵就是最大化似然。它与 softmax 组合后梯度是「预测减标签」，尺度合适；MSE 配 sigmoid/softmax 时梯度会带上激活函数的导数，预测错得很离谱时梯度反而很小，学习几乎停滞。MSE 当然可导，交叉熵也不限于二分类。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'tf', difficulty: 2,
        tags: ['math'],
        stem: '在高斯噪声假设下，最大似然估计等价于最小化平方误差。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '若 y = f(x) + ε 且 ε ~ N(0, σ²)，对数似然是 -||y - f(x)||²/(2σ²) 加常数，最大化它等价于最小化平方误差。这解释了为什么回归默认用 MSE：它不是随手选的，而是高斯假设下的最大似然。换噪声分布（如拉普拉斯）就会得到绝对值损失。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['math'],
        stem: '对真实分布 p 与模型分布 q，交叉熵可以分解为 H(p) + ______。',
        answer: 'KL 散度',
        accept: ['KL散度', 'KL divergence', 'KL', '相对熵'],
        explain: 'H(p, q) = H(p) + KL(p||q)。H(p) 由数据决定、与模型无关，所以最小化交叉熵等价于最小化 KL 散度。这也说明交叉熵不可能低于数据本身的熵——那是模型完美的理论下界。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-7', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '模型对 100 个样本都输出 0.9 的正类概率，其中恰好 90 个是正类。这说明？',
        options: [
          { text: '模型准确率只有 90%，不合格' },
          { text: '模型在这个置信度上校准良好，0.9 确实对应 90% 的正例比例', correct: true },
          { text: '模型一定过拟合了' },
          { text: '无法判断，必须看 AUC' }
        ],
        explain: '校准（calibration）看的是「预测概率」与「实际频率」是否一致：说 0.9 的那批样本里约有 90% 为正，就是校准良好。准确率、AUC 衡量的是排序与阈值表现，与校准是不同维度——一个 AUC 很高的模型完全可能过度自信。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些损失可以写成负对数似然的形式？（多选）',
        options: [
          { text: '多分类的 softmax 交叉熵', correct: true },
          { text: '二分类的二元交叉熵', correct: true },
          { text: '高斯假设下的均方误差（差一个常数与尺度）', correct: true },
          { text: '分类准确率' },
          { text: 'L2 正则项' }
        ],
        explain: 'softmax 交叉熵与 BCE 都是对应分布（分类分布、伯努利分布）的负对数似然；MSE 在高斯假设下也与负对数似然只差常数倍。准确率不可微、不是似然；L2 正则是对参数的先验（高斯先验的负对数），不是数据似然。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: `import torch
logits = torch.tensor([[2.0, 0.0]])
target = torch.tensor([0])
loss = torch.nn.functional.cross_entropy(logits, target)
print(round(loss.item(), 3))`,
        stem: '这段代码打印什么？',
        answer: '0.127',
        accept: ['0.127', '.127', '0.1269', '0.13'],
        explain: 'softmax 后正类概率是 e²/(e²+e⁰) ≈ 0.8808，负对数似然为 -ln(0.8808) ≈ 0.1269，保留三位小数是 0.127。也可以直接用 log(1 + e^(-2)) 算。注意 cross_entropy 内部已含 softmax，输入必须是 logits，不能再手动 softmax 一次。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['math'],
        stem: '二分类的 sigmoid 与多分类的 softmax 是什么关系？',
        options: [
          { text: '完全无关，一个用于回归一个用于分类' },
          { text: '两类时 softmax 退化后与 sigmoid 等价，只差一个 logit 之差的参数化', correct: true },
          { text: 'softmax 是 sigmoid 的平方' },
          { text: 'sigmoid 只能处理一个样本' }
        ],
        explain: '两类时 softmax 的两个输出只依赖 logit 之差 z1 - z2，把它记为 z，则正类概率是 1/(1+e^(-z))，正是 sigmoid。所以二分类用「一个 logit + sigmoid + BCE」与「两个 logit + softmax + CE」在数学上等价，前者少一个参数、数值更省。'
      },

      /* ---------------- ch02 多层网络 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '单层感知机为什么解决不了 XOR？',
        options: [
          { text: '因为 XOR 的样本太少' },
          { text: '因为 XOR 不是线性可分的，一条直线无法把两类点分开', correct: true },
          { text: '因为感知机不能求导' },
          { text: '因为 XOR 需要三个类别' }
        ],
        explain: 'XOR 的四个点 (0,0)、(1,1) 为一类，(0,1)、(1,0) 为另一类，任何直线都无法把它们分开，而单层感知机的决策边界就是一条直线。加一个隐藏层后，网络可以先把输入映射到新空间，在那里线性可分——这就是「表示变换」的意义。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['math'],
        stem: 'ReLU 在 0 处不可导，所以实践中不能用来训练神经网络。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'ReLU 只在 0 点不可导，而梯度下降几乎不会恰好落在 0；框架把 0 处的导数约定为 0 或 1（次梯度），训练完全正常。ReLU 的正区间导数恒为 1，缓解了 sigmoid 的饱和问题，是深层网络能训练起来的关键之一。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'fill', difficulty: 2,
        tags: ['math'],
        stem: '一个 784 → 256 → 10 的全连接网络（每层含偏置），参数量是 ______。',
        answer: '203530',
        accept: ['203530 个', '203,530', '203530个'],
        explain: '第一层 784×256 + 256 = 200960，第二层 256×10 + 10 = 2570，合计 203530。计算时别忘了偏置，也别忘了每一层都要乘加一次；这个数字在卷积一章还会拿来与参数量小得多的卷积层对比。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '多分类且类别互斥时，输出层与损失的正确配对是？',
        options: [
          { text: 'sigmoid + 交叉熵' },
          { text: 'softmax + 交叉熵（或框架里含 softmax 的 cross_entropy）', correct: true },
          { text: '线性输出 + 均方误差' },
          { text: 'softmax + 二元交叉熵，逐个类别算' }
        ],
        explain: '互斥多分类对应分类分布，softmax 把 logits 变成和为 1 的概率，交叉熵是它的负对数似然。多标签（一张图可以同时有猫和狗）才用每个类别独立的 sigmoid + BCE；线性输出配 MSE 是回归的配置。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-7', tier: 3, type: 'multi', difficulty: 3,
        tags: ['concept'],
        stem: '关于初始化，下面哪些说法正确？（多选）',
        options: [
          { text: 'Xavier 初始化适合 tanh / sigmoid，兼顾前向与反向的方差', correct: true },
          { text: 'He 初始化适合 ReLU，因为 ReLU 把一半激活置零，需要更大的方差补偿', correct: true },
          { text: '所有权重初始化为 0 会让同一层的神经元学到完全相同的特征', correct: true },
          { text: '初始化越大越好，这样梯度一定不会消失' },
          { text: '偏置必须初始化为 0 且之后不能更新' }
        ],
        explain: 'Xavier 让方差在层间大致保持，适配对称的 tanh/sigmoid；He 针对 ReLU 的半数置零把增益乘以 2。全零初始化会让同层神经元梯度相同，永远对称、学不到多样特征。初始化过大则前向激活饱和、梯度爆炸，并非越大越好；偏置正常参与训练。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: `from torch import nn
net = nn.Sequential(
    nn.Linear(784, 256), nn.ReLU(),
    nn.Linear(256, 10))
print(sum(p.numel() for p in net.parameters()))`,
        stem: '这段代码打印什么？',
        answer: '203530',
        accept: ['203530', '203,530'],
        explain: 'Linear(784, 256) 有 784×256 个权重加 256 个偏置，共 200960；Linear(256, 10) 有 2560 + 10 = 2570。ReLU 没有参数。合计 203530。学会用 numel() 逐层核对，比凭记忆估参数可靠。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-3', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '万有逼近定理说明了什么？',
        options: [
          { text: '只要一个隐藏层足够宽，就能以任意精度逼近紧集上的连续函数' },
          { text: '只要一个隐藏层足够宽，就能以任意精度逼近紧集上的连续函数，但不保证梯度下降能找到这组参数，也不说明需要多少样本', correct: true },
          { text: '深层网络一定比浅层网络差' },
          { text: '网络的参数量越少，泛化一定越好' }
        ],
        explain: '定理是存在性结论：存在一组参数能逼近目标函数，但没有说这组参数容易被优化到，也没有给出所需宽度与样本量。实践中深层网络用更少参数达到同样表达力，且更符合数据的分层结构，所以「能逼近」不等于「能学到」。'
      },

      /* ---------------- ch03 反向传播 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '反向传播的本质是什么？',
        options: [
          { text: '一种随机搜索参数的方法' },
          { text: '在计算图上用链式法则从输出往输入逐层求导，并复用中间结果', correct: true },
          { text: '把网络反向再前向跑一遍' },
          { text: '一种正则化手段' }
        ],
        explain: '反向传播 = 链式法则 + 动态规划：每个节点只需把上游传来的梯度乘上本地导数再分发下去，中间结果被复用，复杂度与前向同阶。它不是独立的优化算法，而是算梯度的方式；算出梯度后仍要用 SGD、Adam 等更新参数。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-5', tier: 3, type: 'tf', difficulty: 3,
        tags: ['concept'],
        stem: '损失是标量时，反向模式自动微分一次反向就能得到所有输入的梯度，因此比前向模式更适合神经网络。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '前向模式的代价与输入维度成正比，反向模式的代价与输出维度成正比。神经网络的损失是标量（输出维 1）、参数却有百万级（输入维巨大），所以一次反向就够的反向模式明显更省。若函数是少数输入到海量输出，则前向模式更合适。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'fill', difficulty: 2,
        tags: ['math'],
        stem: '梯度检查常用 ______ 差分，其截断误差是 O(h²)。',
        answer: '中心',
        accept: ['中心差分', 'central', 'central difference', '中心差分法'],
        explain: '中心差分 (f(x+h) - f(x-h)) / (2h) 的误差是 O(h²)，而前向差分 (f(x+h) - f(x)) / h 只有 O(h)。检查时用 float64、取 h 约 1e-5，并避开 ReLU 的折点与不可导处，否则数值梯度与解析梯度会对不上。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['code'],
        stem: 'PyTorch 中调用 loss.backward() 后，为什么每个训练步都要 zero_grad()？',
        options: [
          { text: '因为梯度会累加到 .grad 上，不清零就会把历史批次混在一起' },
          { text: '因为梯度会累加到 .grad 上，不清零就会把历史批次混在一起，等价于用了更大的有效批量且方向被旧梯度污染', correct: true },
          { text: '因为 zero_grad 会重置模型参数' },
          { text: '因为不清零会报错' }
        ],
        explain: 'backward() 默认累加而不是覆盖，这方便了梯度累积（小显存模拟大 batch）与多损失相加，但常规训练必须在每步前清零。忘记清零不会报错，只会让梯度越积越大、更新方向偏离当前批次，表现为 loss 抖动或发散。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-8', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些因素会导致梯度消失？（多选）',
        options: [
          { text: '深层网络里反复乘以小于 1 的雅可比矩阵', correct: true },
          { text: 'sigmoid / tanh 在饱和区导数接近 0', correct: true },
          { text: '权重初始化过小，每层输出方差逐层收缩', correct: true },
          { text: '学习率设得太大' },
          { text: '训练样本太多' }
        ],
        explain: '梯度消失的根源是连乘：雅可比谱半径小于 1、激活饱和、初始化过小都会让梯度指数衰减。学习率过大会导致爆炸而不是消失；样本量影响泛化与训练时间，不直接决定梯度范数。缓解手段包括 ReLU、残差连接、合适的初始化与归一化。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: `import torch
x = torch.tensor([1.0, 2.0, 3.0], requires_grad=True)
y = (x ** 2).sum()
y.backward()
print(x.grad.tolist())`,
        stem: '这段代码打印什么？',
        answer: '[2.0, 4.0, 6.0]',
        accept: ['[2.0, 4.0, 6.0]', '[2, 4, 6]', '2.0 4.0 6.0'],
        explain: 'y = x1² + x2² + x3²，对每个分量求导得 2x，即 [2,4,6]。sum() 把向量变成标量，所以可以直接 backward()；若 y 不是标量，需要给 backward() 传一个同形状的梯度。这也说明为什么损失函数最后总要聚合成一个数。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['math'],
        stem: '函数 f: R^n → R^m 的雅可比矩阵形状是？',
        options: [
          { text: 'n × n' },
          { text: 'm × n，第 i 行第 j 列是 ∂f_i/∂x_j', correct: true },
          { text: 'n × m，与前者互为转置但语义不同' },
          { text: 'm × m' }
        ],
        explain: '雅可比把输入的 n 维扰动线性映射成输出的 m 维扰动，所以是 m 行 n 列。反向传播里每一层都在做「雅可比转置乘上游梯度」：上游是 m 维，乘完得到 n 维，维度正好对上。把它记成「输出维 × 输入维」就不会写反。'
      },

      /* ---------------- ch04 网络训练 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'Adam 优化器结合了哪两种思想？',
        options: [
          { text: '动量（一阶矩）与 RMSProp（二阶矩），并做偏差修正', correct: true },
          { text: 'L1 与 L2 正则' },
          { text: 'dropout 与批归一化' },
          { text: '网格搜索与随机搜索' }
        ],
        explain: 'Adam 维护梯度的指数滑动平均（一阶矩，类似动量）与梯度平方的滑动平均（二阶矩，类似 RMSProp），用后者对步长逐参数缩放，并对初期偏向 0 的估计做偏差修正。它默认好用，但在某些任务上泛化略逊于调好的 SGD + 动量，不能盲信默认值。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: 'BatchNorm 在训练和推理时都使用当前批次的均值与方差。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '训练时用当前 batch 的统计量并更新滑动平均；推理时用训练阶段累积的滑动平均（running statistics），否则同一张图在不同批次里会得到不同输出。忘记 model.eval() 是部署时指标掉点的常见原因。LayerNorm 不依赖批次，训练推理行为一致。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '常见的学习率调度是：先线性 warmup，再按 ______ 曲线退火到接近 0。',
        answer: '余弦',
        accept: ['余弦', 'cosine', '余弦退火'],
        explain: 'warmup 让训练初期步长从小到大，避免随机初始化阶段的大梯度破坏权重；随后余弦退火让学习率平滑下降，末期以小步长精细收敛。相比阶梯式衰减，余弦曲线没有突变点，配合 warmup 是 Transformer 与视觉任务的常用配置。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-7', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '训练损失持续下降、验证损失先降后升，最可能是？',
        options: [
          { text: '欠拟合' },
          { text: '过拟合', correct: true },
          { text: '学习率太小' },
          { text: '数据泄漏' }
        ],
        explain: '训练损失降说明模型容量足够、优化正常；验证损失回升说明它开始记住训练集的噪声而非通用规律。应对包括早停、增强、正则、减小模型或增加数据。若两者都高则是欠拟合，方向相反：加大模型、延长训练、检查特征。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些属于正则化手段？（多选）',
        options: [
          { text: 'weight decay（L2 惩罚）', correct: true },
          { text: 'dropout', correct: true },
          { text: '早停（early stopping）', correct: true },
          { text: '把学习率调大十倍' },
          { text: '去掉验证集以增加训练数据' }
        ],
        explain: '三者的共同点是限制模型对训练集的拟合能力：L2 压小权重、dropout 随机屏蔽神经元迫使冗余表示、早停在验证指标变差前停下。调大学习率是优化设置，不构成正则；去掉验证集只会让你看不见过拟合，不是正则。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: `w, g, v = 1.0, 0.5, 0.0
lr, momentum = 0.1, 0.9
v = momentum * v + g
w = w - lr * v
print(round(w, 2))`,
        stem: '这段代码打印什么？',
        answer: '0.95',
        accept: ['0.95', '.95'],
        explain: '第一步动量 v = 0.9×0 + 0.5 = 0.5，参数更新 w = 1.0 - 0.1×0.5 = 0.95。动量把历史梯度累积起来，在梯度方向一致时加速、在来回震荡时相互抵消；这也是为什么它常写成 v = βv + g 而不是 v = βv + (1-β)g（后者等价于换了学习率尺度）。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-8', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '反复用测试集挑超参数，会带来什么问题？',
        options: [
          { text: '没有影响，测试集就是用来评估的' },
          { text: '测试集信息泄漏进模型选择，报告的指标会乐观偏置，真实泛化被高估', correct: true },
          { text: '只会让训练变慢' },
          { text: '会让训练集变大' }
        ],
        explain: '每看一次测试集并据此改一次决策，测试集就承担了一部分验证集的角色，其指标不再是对未见数据的无偏估计。正确做法是训练集调参、验证集选模型、测试集只在最后用一次；如果必须反复用，就要划出独立的 holdout 或做嵌套交叉验证。'
      },

      /* ---------------- ch05 卷积网络 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['math'],
        stem: '输入 32×32，卷积核 3×3，padding=1，stride=1，输出尺寸是？',
        options: [
          { text: '30×30' },
          { text: '32×32', correct: true },
          { text: '16×16' },
          { text: '34×34' }
        ],
        explain: '按 (H + 2P - K)/S + 1 = (32 + 2 - 3)/1 + 1 = 32。padding=1 补一圈零，正好抵消 3×3 核带来的尺寸收缩，这叫 same padding。若 stride=2，则输出 16×16；若 padding=0，则 30×30。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '卷积层的参数量会随输入图像分辨率的增大而增大。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '参数量是 K×K×C_in×C_out + C_out，只与核大小和通道数有关，与输入的高宽无关。分辨率变大只会让计算量（乘加次数）按面积增长，权重数量不变——这正是卷积比全连接省参数的根本原因。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['math'],
        stem: '三层连续的 3×3 卷积（stride=1、无空洞），感受野是 ______。',
        answer: '7',
        accept: ['7×7', '7 x 7', '7'],
        explain: '每加一层 3×3、stride=1 的卷积，感受野增加 K-1 = 2：第一层 3，第二层 5，第三层 7。所以三个 3×3 等价于一个 7×7 的感受野，但参数是 27 对 49，还多两次非线性。插入 stride=2 或池化会让感受野近似翻倍。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'ResNet 的残差连接主要解决什么问题？',
        options: [
          { text: '减少参数量' },
          { text: '深层网络的退化问题：让恒等映射容易学，并给梯度提供短路径', correct: true },
          { text: '替代池化' },
          { text: '把卷积变成全连接' }
        ],
        explain: 'plain 网络加深后训练误差反而上升，说明优化困难而非容量不足。y = x + F(x) 让网络只需把 F 学成接近 0 就能实现恒等映射，深层至少不劣于浅层；反向时梯度可经捷径直接回流，缓解消失。它不减少参数，反而略增（投影捷径）。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些图像增强通常保持标签不变？（多选）',
        options: [
          { text: '随机裁剪（物体仍在框内）', correct: true },
          { text: '水平翻转（猫的图片）', correct: true },
          { text: '小角度旋转', correct: true },
          { text: '把数字 6 旋转 180°' },
          { text: '对测试集做随机增强后再评估' }
        ],
        explain: '裁剪、翻转、小角度旋转不改变类别语义，是常用增强。数字 6 旋转 180° 会变成 9，标签被改变；测试集做随机增强会让指标随随机种子波动，评估必须用确定性预处理。增强的选择原则始终是「变换后标签是否仍然成立」。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: `from torch import nn
c = nn.Conv2d(3, 16, kernel_size=3, padding=1, bias=True)
print(sum(p.numel() for p in c.parameters()))`,
        stem: '这段代码打印什么？',
        answer: '448',
        accept: ['448', '448 个'],
        explain: '3×3×3 的核、16 个输出通道：权重 3×3×3×16 = 432，加 16 个偏置，共 448。注意输入通道是 3（RGB），不是 16；也别忘了 bias=True 时每个输出通道有一个偏置。同样的层若输入 224×224，参数量仍是 448。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '用 ImageNet 预训练权重做迁移学习，第一步应该检查什么？',
        options: [
          { text: '把学习率设成 1.0' },
          { text: '预处理是否与预训练模型一致（归一化、通道顺序、输入尺寸）', correct: true },
          { text: '先把所有卷积层解冻' },
          { text: '把分类头删掉，直接输出 1000 类' }
        ],
        explain: '预训练权重是在特定预处理下学到的，输入分布错位会让特征失效，效果可能不如随机初始化。确认归一化均值方差、RGB 顺序、缩放与裁剪方式一致后，再替换分类头、冻结主干、用小学习率微调。'
      },

      /* ---------------- ch06 序列建模 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'LSTM 缓解梯度消失的关键设计是？',
        options: [
          { text: '用了比 tanh 更快的激活函数' },
          { text: '细胞状态通过加法更新，梯度可以沿这条路径近乎无损地回传', correct: true },
          { text: '参数量比 RNN 少' },
          { text: '去掉了所有非线性' }
        ],
        explain: 'c_t = f_t ⊙ c_{t-1} + i_t ⊙ g_t 中，c_{t-1} 到 c_t 的路径只乘一个遗忘门。当 f_t 接近 1 时梯度几乎原样传回，不必反复穿过 W_hh 与 tanh 的导数。门的非线性仍在，但主干道是加法的——这是 LSTM 与普通 RNN 的本质差别。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '自注意力对位置是置换等变的，所以必须额外注入位置信息。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '自注意力对每个位置做的是同一套加权求和，打乱输入顺序，输出只是跟着打乱，模型无法区分「猫追狗」与「狗追猫」。位置编码（正弦、可学习、RoPE、ALiBi）把顺序信息加进表示或注意力分数，才让模型具备顺序感。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'fill', difficulty: 2,
        tags: ['math'],
        stem: '缩放点积注意力把 q·k 除以 ______，防止维度大时 softmax 饱和。',
        answer: 'sqrt(d_k)',
        accept: ['√d_k', 'sqrt(dk)', '根号 d_k', 'd_k 的平方根', '根号下 d_k'],
        explain: '若 q、k 各维独立、方差为 1，点积的方差是 d_k，维度越大分数越极端，softmax 会把几乎全部权重压在一个位置，梯度趋近 0。除以 √d_k 把方差拉回 1，保持分布平滑。这个缩放不是可调超参，去掉后深层 Transformer 明显更难训。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-7', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['code'],
        stem: '实现因果注意力时，掩码应该在什么时候加？',
        options: [
          { text: 'softmax 之后，把上三角权重置零' },
          { text: 'softmax 之前，把未来位置的分数置为负无穷', correct: true },
          { text: '在计算 q、k 之前修改输入' },
          { text: '不需要掩码，模型自己能学会' }
        ],
        explain: 'softmax 之前把未来分数设为 -inf，指数后正好是 0，且剩余权重仍然归一化。若先 softmax 再置零，剩下的权重之和小于 1，输出尺度被缩小，等价于给每个位置乘了一个随位置变化的系数——不会报错，但结果悄悄错了。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-6', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '一个标准 Transformer 层包含哪些部件？（多选）',
        options: [
          { text: '多头自注意力', correct: true },
          { text: '逐位置的前馈网络', correct: true },
          { text: '残差连接与 LayerNorm', correct: true },
          { text: '卷积与最大池化' },
          { text: '循环单元与门控' }
        ],
        explain: '标准层是「多头自注意力 → 残差 + LayerNorm → 前馈网络 → 残差 + LayerNorm」，前馈通常先升维 4 倍再降回。卷积、池化、循环门控属于 CNN 与 RNN 的构件，Transformer 用注意力取代了它们，不再需要递归或滑动窗口。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 3, type: 'predict', difficulty: 3,
        tags: ['code'],
        code: `import math, torch
q = torch.randn(1, 2, 4, 8)
k = torch.randn(1, 2, 4, 8)
scores = q @ k.transpose(-2, -1) / math.sqrt(8)
mask = torch.tril(torch.ones(4, 4)).bool()
w = scores.masked_fill(~mask, float('-inf')).softmax(-1)
print(w[0, 0].sum(-1).tolist())`,
        stem: '这段代码打印什么？',
        answer: '[1.0, 1.0, 1.0, 1.0]',
        accept: ['[1.0, 1.0, 1.0, 1.0]', '[1, 1, 1, 1]'],
        explain: '因果掩码把每一行右侧的未来置为 -inf，softmax 后这些位置为 0，剩余可见位置重新归一化，所以每一行的权重和仍然是 1。若忘了 mask 或者先 softmax 再置零，行和就不再是 1，这是检查实现是否正确的一个快速断言。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-8', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '自注意力的计算量随序列长度 T 如何增长？',
        options: [
          { text: '线性 O(T)' },
          { text: '平方 O(T²d)，因为要算 T×T 的分数矩阵', correct: true },
          { text: '常数 O(1)' },
          { text: '立方 O(T³)' }
        ],
        explain: '每个位置都要与所有位置算相似度，共 T² 个分数，每个分数是 d 维点积，所以是 O(T²d)，显存也要存 T×T。序列翻倍，注意力贵四倍；前馈部分是 O(Td²)，只贵两倍。长上下文优化（局部窗口、线性注意力、FlashAttention）都在对付这个二次项。'
      },

      /* ---------------- ch07 生成模型 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'VAE 的重参数化技巧解决什么问题？',
        options: [
          { text: '让 KL 项可以直接算出来' },
          { text: '把采样写成 μ + σ⊙ε，使随机采样节点可以反向传播梯度', correct: true },
          { text: '减少解码器的参数量' },
          { text: '保证潜变量一定是离散的' }
        ],
        explain: '从 N(μ, σ²) 直接采样是不可导的随机操作，梯度到此中断。写成 μ + σ⊙ε（ε ~ N(0,I)）后，随机性被隔离在不需要梯度的 ε 上，μ 与 σ 仍有梯度，整个 ELBO 才能用反向传播优化。这是 VAE 可训练的关键一步。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: 'GAN 的生成器可以给出样本的精确似然 p(x)。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'GAN 是隐式生成模型：它只定义了从噪声到样本的映射，没有写出 p(x) 的解析形式，也无法归一化。因此不能直接算似然，评估只能借助 FID、IS 这类间接指标。需要似然时要用 VAE、扩散或归一化流。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: 'DDPM 的训练目标是：给定时序 t 与加噪样本，让网络预测所加的 ______。',
        answer: '噪声',
        accept: ['噪声', 'noise', '噪声 ε', 'epsilon'],
        explain: '把 q(x_t|x_0) 写成 ᾱ_t 的闭式后，x_t 等于 ᾱ_t 的平方根乘 x_0 加上 1-ᾱ_t 的平方根乘 ε。网络只需从 x_t 与 t 回归 ε，损失是均方误差。这个目标简单稳定，把生成拆成许多小步去噪，是扩散模型效果好的核心原因。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '关于 FID，下面哪条说法正确？',
        options: [
          { text: 'FID 越高说明生成质量越好' },
          { text: 'FID 越低越好，但不同论文的实现与样本量不同，不能直接横向比较', correct: true },
          { text: 'FID 不需要真实图像' },
          { text: 'FID 能完全替代人工评估' }
        ],
        explain: 'FID 计算真实与生成图像在 Inception 特征空间中的 Frechet 距离，越低表示两个分布越接近。但它依赖特征提取器版本、缩放方式与样本量，样本少时估计有偏，所以跨论文的数字不可直接比。它也无法衡量文本对齐与美感，仍需人工评估。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '做端到端项目时，下面哪些做法是正确的？（多选）',
        options: [
          { text: '一开始就固定训练 / 验证 / 测试划分', correct: true },
          { text: '先建立简单基线，再上复杂模型', correct: true },
          { text: '训练与推理使用完全一致的预处理', correct: true },
          { text: '用测试集反复调超参数' },
          { text: '只看总体准确率，不看分组误差' }
        ],
        explain: '固定划分防止信息泄漏，基线确认数据与标签没问题，预处理一致保证推理分布不偏移。用测试集调参会让指标乐观偏置；只看平均数会掩盖某些类别或群体的系统性失败，误差分析要分组看。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-3', tier: 3, type: 'predict', difficulty: 3,
        tags: ['code'],
        code: `import torch
mu = torch.tensor([0.0, 0.0])
logvar = torch.tensor([0.0, 0.0])
kl = -0.5 * (1 + logvar - mu ** 2 - logvar.exp()).sum()
print(float(kl))`,
        stem: '这段代码打印什么？',
        answer: '0.0',
        accept: ['0.0', '0', '0.00'],
        explain: '当 μ = 0、logvar = 0（即 σ = 1）时，q(z|x) 正好是标准正态，与先验 N(0,I) 重合，KL 为 0。逐项看：1 + 0 - 0 - 1 = 0。这也是 VAE 训练初期 KL 很小、随编码器偏离先验而增大的原因；KL 项过大则会把后验压回先验，造成后验坍塌。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '普通自编码器为什么不能直接当生成模型？',
        options: [
          { text: '因为它不能压缩数据' },
          { text: '因为潜空间没有先验约束，随机采一个 z 解码出来可能是无意义的样本', correct: true },
          { text: '因为它的损失不可导' },
          { text: '因为它只能处理图像' }
        ],
        explain: '自编码器只保证训练样本能被重建，潜空间里没见过的点没有定义。要让采样有意义，需要给 z 一个先验（如标准正态）并让编码分布靠近它——VAE 正是加了这一步。也可以对潜空间做正则（如对抗自编码器），思路相同。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
