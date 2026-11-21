/* =====================================================================
 * exam.js · DDA5001 模拟卷 A
 * 范围：ch00–ch07（概率与损失 / 多层网络 / 反向传播 / 训练 /
 *       卷积 / 序列与注意力 / 生成模型与端到端）
 * 规格：12 题、满分 100、限时 90 分钟
 * 题型：choice / tf / fill / output / keywords
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerExam({
    id: 'DDA5001-A',
    title: '深度学习 模拟卷 A',
    style: '期末风格',
    subtitle: 'DDA5001 · 覆盖 ch00–ch07 的综合模拟',
    date: '2026-11-21',
    minutes: 90,
    totalScore: 100,
    summary: '本卷覆盖八章全部内容：概率视角与损失、多层网络结构与初始化、反向传播与自动微分、' +
      '训练与正则、卷积网络、序列与注意力、生成模型与端到端流程。卷面 12 题：' +
      '选择 2 题共 14 分、判断 1 题 6 分、填空 3 题共 24 分、读代码写输出 3 题共 28 分、' +
      '简答关键词 3 题共 28 分。建议闭卷限时完成，读代码题先手算再对答案。',
    instructions: [
      '时间 90 分钟，满分 100 分。计时开始后不会暂停，刷新页面也按真实时间计算。',
      '题型：单项选择 4 小问、判断 2 小问、填空 4 小问、读代码写输出 6 小问、简答关键词 6 小问。',
      '读代码题按输出逐字比对，数字保留题目要求的位数；简答题按关键词命中比例给分，答出要点即可。',
      '代码默认使用 Python 3 与 PyTorch，张量形状写作 (B, C, H, W)，概率保留三位小数。',
      '简答题不必写完整代码，但提到的方法要能对应到具体机制，只写名词不给分。'
    ],
    questions: [

      /* ---------------------------------------------------------- Q1 */
      { no: 1, points: 6, type: 'single choice',
        intro: '本题考察损失函数与卷积的算术。',
        parts: [
          { label: '(a)', points: 3, kind: 'choice',
            prompt: '关于交叉熵 <code>H(p, q)</code>，下面哪条分解是正确的？',
            options: [
              { text: '<code>H(p, q) = H(p) + KL(p || q)</code>', correct: true },
              { text: '<code>H(p, q) = KL(p || q) - H(p)</code>' },
              { text: '<code>H(p, q) = H(q) + KL(q || p)</code>' },
              { text: '<code>H(p, q) = H(p) × KL(p || q)</code>' }
            ],
            explain: '交叉熵等于真实分布的熵加上两个分布的 KL 散度。H(p) 由数据决定、与模型无关，' +
              '所以最小化交叉熵等价于最小化 KL(p||q)，把模型分布拉向真实分布。' +
              '反过来写 H(q)+KL(q||p) 是另一个量，不对称的 KL 方向不能随意交换。' },
          { label: '(b)', points: 3, kind: 'choice',
            prompt: '输入 224×224，卷积核 7×7，padding=3，stride=2，输出特征图的空间尺寸是？',
            options: [
              { text: '112×112', correct: true },
              { text: '111×111' },
              { text: '109×109' },
              { text: '56×56' }
            ],
            explain: '按 <code>floor((H + 2P - K)/S) + 1</code>：<code>(224 + 6 - 7)/2 + 1 = 223/2 + 1</code>，' +
              '整除得 111，加 1 等于 112。这正是 ResNet 首层的配置：7×7 大核快速降分辨率，' +
              'padding=3 保证 224 恰好减半，不出现取整浪费。' }
        ] },

      /* ---------------------------------------------------------- Q2 */
      { no: 2, points: 6, type: 'true / false',
        intro: '判断下列说法，并说明理由。',
        parts: [
          { label: '(a)', points: 3, kind: 'tf',
            prompt: '卷积层的参数量会随输入图像分辨率的增大而增大。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '参数量是 <code>K×K×C_in×C_out + C_out</code>，只与核大小和通道数有关。' +
              '分辨率变大只增加乘加次数，不增加权重个数。这是卷积相对全连接最关键的参数效率来源。' },
          { label: '(b)', points: 3, kind: 'tf',
            prompt: 'BatchNorm 在推理时使用当前批次的均值与方差。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '训练时用当前 batch 的统计量并更新滑动平均；推理时用训练阶段累积的 running statistics。' +
              '若推理仍用当前 batch，同一张图在不同批次里会得到不同输出，部署结果不可复现。' }
        ] },

      /* ---------------------------------------------------------- Q3 */
      { no: 3, points: 8, type: 'fill in the blank',
        intro: '本题考察感受野与参数量的计算。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '三层连续的 3×3 卷积（stride=1、无空洞），感受野是 ______。',
            answer: '7',
            accept: ['7×7', '7 x 7', '7'],
            explain: '每加一层 3×3、stride=1 的卷积，感受野增加 K-1 = 2：3 → 5 → 7。' +
              '三个 3×3 与一个 7×7 的感受野相同，但参数是 27 对 49，且多两次非线性，所以 VGG 全用 3×3。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '一个 784 → 256 → 10 的全连接网络（每层含偏置），参数量是 ______。',
            answer: '203530',
            accept: ['203530 个', '203,530', '203530个'],
            explain: '第一层 784×256 + 256 = 200960，第二层 256×10 + 10 = 2570，合计 203530。' +
              '对照同一任务的单层 softmax（7850），能直观看到隐藏层带来的参数增长。' }
        ] },

      /* ---------------------------------------------------------- Q4 */
      { no: 4, points: 8, type: 'read code',
        intro: '写出下面程序打印的内容。',
        parts: [
          { label: '(a)', points: 4, kind: 'output',
            prompt: '程序输出什么？',
            code: `import torch
logits = torch.tensor([[1.0, 3.0, 2.0]])
p = logits.softmax(dim=-1)
print(p.argmax().item(), round(p.max().item(), 3))`,
            answer: '1 0.665',
            accept: ['1 0.665', '1 0.6652', '1 0.6652'],
            explain: 'softmax 后三个概率约为 0.090、0.665、0.245，最大值的下标是 1。' +
              '因为 logits 相差 1 与 2，指数放大了差距：e³/(e¹+e³+e²) ≈ 0.665。' +
              'argmax 返回下标而不是概率，round 只影响显示，不影响 argmax。' },
          { label: '(b)', points: 4, kind: 'output',
            prompt: '程序输出什么？',
            code: `import torch
scores = torch.zeros(1, 1, 3, 3)
mask = torch.tril(torch.ones(3, 3)).bool()
w = scores.masked_fill(~mask, float('-inf')).softmax(-1)
print(w[0, 0].sum(-1).tolist())`,
            answer: '[1.0, 1.0, 1.0]',
            accept: ['[1.0, 1.0, 1.0]', '[1, 1, 1]'],
            explain: '分数全为 0，掩码把每行右侧置为 -inf，softmax 后这些位置为 0，' +
              '可见位置的权重重新归一化，所以每一行权重和仍是 1。' +
              '若先 softmax 再置零，行和会小于 1——这是检查因果掩码实现是否正确的快速断言。' }
        ] },

      /* ---------------------------------------------------------- Q5 */
      { no: 5, points: 8, type: 'single choice',
        intro: '本题考察序列模型与训练策略。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: 'LSTM 缓解梯度消失的关键机制是？',
            options: [
              { text: '用 ReLU 替换了 tanh，导数恒为 1' },
              { text: '细胞状态通过加法更新，梯度沿这条路径只需乘遗忘门', correct: true },
              { text: '门控减少了参数量，梯度自然变大' },
              { text: '在时间维度上做了批归一化' }
            ],
            explain: '<code>c_t = f_t ⊙ c_{t-1} + i_t ⊙ g_t</code> 中，c_{t-1} 到 c_t 只乘一个门。' +
              '当遗忘门接近 1，梯度几乎原样回传，不必穿过 W_hh 与 tanh 的连乘。' +
              'LSTM 的门仍是 sigmoid，参数量比 vanilla RNN 更多，靠的是梯度路径而不是容量。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '训练深度网络时，先 warmup 再余弦退火的主要目的是？',
            options: [
              { text: '让学习率始终保持在最大值，加快收敛' },
              { text: '初期用小步长避免大梯度破坏权重，后期平滑衰减以精细收敛', correct: true },
              { text: '让优化器自动选择动量系数' },
              { text: '替代正则化，防止过拟合' }
            ],
            explain: 'warmup 让步长从很小线性升到峰值，避免随机初始化阶段的大梯度把权重打乱；' +
              '余弦退火随后平滑降到接近 0，末期以小步长收敛到一个更平的极小值。' +
              '它属于优化调度，不是正则化，也不能替代权重衰减或早停。' }
        ] },

      /* ---------------------------------------------------------- Q6 */
      { no: 6, points: 8, type: 'short answer',
        intro: '用关键词回答，不必写完整推导。',
        parts: [
          { label: '(a)', points: 4, kind: 'keywords',
            prompt: '解释深层 sigmoid 网络为什么会出现梯度消失。',
            keywords: ['连乘', '饱和', '导数小于 1', '指数衰减', '链式法则'],
            explain: '反向传播按链式法则逐层相乘，sigmoid 的导数最大只有 0.25，' +
              '且输入稍大就进入饱和区、导数趋近 0。几十层连乘后梯度按指数衰减，' +
              '浅层几乎收不到有效信号。这不是数值精度问题，而是结构性的连乘效应。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '写出两条缓解梯度消失的具体做法，并各用一句话说明原理。',
            keywords: [['ReLU', '残差', '归一化', 'BatchNorm', 'LayerNorm', 'He 初始化', 'Xavier', '门控'], '梯度', '初始化', '捷径'],
            explain: '常见组合：ReLU 在正区间导数恒为 1，避免饱和；残差连接提供恒等捷径，' +
              '让梯度绕过中间层；BatchNorm/LayerNorm 稳定每层输入分布；' +
              'He/Xavier 初始化让每层方差大致保持。原理都是缩短梯度路径或避免连乘因子过小。' }
        ] },

      /* ---------------------------------------------------------- Q7 */
      { no: 7, points: 10, type: 'read code',
        intro: '按步计算，写出程序输出。',
        parts: [
          { label: '(a)', points: 5, kind: 'output',
            prompt: '程序输出什么？',
            code: `w, v = 1.0, 0.0
for g in [0.5, 0.5]:
    v = 0.9 * v + g
    w = w - 0.2 * v
print(round(w, 2))`,
            answer: '0.71',
            accept: ['0.71', '.71'],
            explain: '第一步：v = 0.9×0 + 0.5 = 0.5，w = 1.0 - 0.2×0.5 = 0.9。' +
              '第二步：v = 0.9×0.5 + 0.5 = 0.95，w = 0.9 - 0.2×0.95 = 0.71。' +
              '梯度同向时动量累积、步长变大，这就是动量加速的直观来源。' },
          { label: '(b)', points: 5, kind: 'output',
            prompt: '程序输出什么？',
            code: `from torch import nn
c = nn.Conv2d(3, 8, kernel_size=5, padding=2)
print(sum(p.numel() for p in c.parameters()))`,
            answer: '608',
            accept: ['608', '608 个'],
            explain: '权重 5×5×3×8 = 600，偏置每个输出通道一个，共 8 个，合计 608。' +
              '输入通道是 3（RGB），不是 8；padding=2 只影响输出尺寸，不影响参数量。' },
        ] },

      /* ---------------------------------------------------------- Q8 */
      { no: 8, points: 10, type: 'short answer',
        intro: '结合结构设计回答。',
        parts: [
          { label: '(a)', points: 5, kind: 'keywords',
            prompt: 'ResNet 的残差连接为什么能让上百层的网络训练起来？',
            keywords: ['恒等映射', '退化', '梯度', '捷径', '连乘'],
            explain: '深层 plain 网络的训练误差反而上升，说明问题在优化而非容量。' +
              'y = x + F(x) 让网络只需把 F 学成接近 0 就能实现恒等映射，深层至少不劣于浅层；' +
              '反向时梯度可经捷径直接回流，不必穿过所有层的连乘，缓解消失。' },
          { label: '(b)', points: 5, kind: 'keywords',
            prompt: '用 ImageNet 预训练模型做小数据集分类，写出三个关键步骤及各自理由。',
            keywords: [['预处理一致', '归一化一致', '与预训练一致'], ['冻结', '替换分类头', '只训分类头'], ['小学习率', '微调', '解冻']],
            explain: '第一步保证预处理与预训练完全一致，否则特征分布错位；' +
              '第二步替换最后的分类层并冻结主干，先只训练新头；' +
              '第三步以较小学习率（通常比从头训练小一个量级）解冻部分层微调。' +
              '数据量很少时也可以只做前两步，避免灾难性遗忘。' }
        ] },

      /* ---------------------------------------------------------- Q9 */
      { no: 9, points: 8, type: 'fill in the blank',
        intro: '本题考察注意力的细节与复杂度。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '缩放点积注意力把 <code>q·k</code> 除以 ______，防止维度大时 softmax 饱和。',
            answer: 'sqrt(d_k)',
            accept: ['√d_k', 'sqrt(dk)', '根号 d_k', 'd_k 的平方根'],
            explain: 'q、k 各维方差为 1 时，点积方差是 d_k，维度越大分数越极端，' +
              'softmax 会把权重压在一个位置上、梯度趋近 0。除以 √d_k 把方差拉回 1。' +
              '这个缩放是结构的一部分，不是可调超参。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '自注意力的计算量随序列长度 T 的增长是 O(______)。',
            answer: 'T²',
            accept: ['T^2', 'T²', '平方'],
            explain: '每个位置与所有位置算相似度，共 T² 个分数，每个是 d 维点积，所以是 O(T²d)。' +
              '显存也要存 T×T 的分数矩阵。序列翻倍，注意力部分贵四倍，这是长上下文优化的出发点。' }
        ] },

      /* ---------------------------------------------------------- Q10 */
      { no: 10, points: 10, type: 'read code',
        intro: '写出程序输出，注意数值细节。',
        parts: [
          { label: '(a)', points: 5, kind: 'output',
            prompt: '程序输出什么？',
            code: `import torch
mu = torch.tensor([1.0, 0.0])
logvar = torch.tensor([0.0, 0.0])
kl = -0.5 * (1 + logvar - mu ** 2 - logvar.exp()).sum()
print(float(kl))`,
            answer: '0.5',
            accept: ['0.5', '.5', '0.50'],
            explain: '逐项：第一维 1 + 0 - 1 - 1 = -1，第二维 1 + 0 - 0 - 1 = 0，求和 -1，' +
              '乘 -0.5 得 0.5。KL 衡量编码分布偏离标准正态的程度：μ 越远离 0、σ 越偏离 1，KL 越大。' +
              '这也是 VAE 中 KL 项会阻止后验任意散开的原因。' },
          { label: '(b)', points: 5, kind: 'output',
            prompt: '程序输出什么？',
            code: `import torch
x = torch.tensor([1.0, 2.0], requires_grad=True)
y = (3 * x).sum()
y.backward()
print(x.grad.tolist())`,
            answer: '[3.0, 3.0]',
            accept: ['[3.0, 3.0]', '[3, 3]', '3.0 3.0'],
            explain: 'y = 3x₁ + 3x₂，对每个分量求导都是 3。sum() 把向量聚成标量，' +
              '所以可以直接 backward()。注意 .grad 是累加的，若再调用一次 backward()，' +
              '梯度会变成 [6,6]——这就是训练循环里必须 zero_grad() 的原因。' }
        ] },

      /* ---------------------------------------------------------- Q11 */
      { no: 11, points: 10, type: 'short answer',
        intro: '回答生成模型的两个常见问题。',
        parts: [
          { label: '(a)', points: 5, kind: 'keywords',
            prompt: '什么是 GAN 的模式崩溃？说明成因与至少一种缓解办法。',
            keywords: ['多样性', '少数样本', '判别器', 'WGAN', '谱归一化', '梯度惩罚'],
            explain: '生成器发现少数几个样本最能骗过判别器，就反复生成它们，' +
              '输出的多样性丢失。成因是判别器对模式覆盖的惩罚不足，' +
              '以及对抗训练的不稳定平衡。缓解包括 WGAN + 梯度惩罚、谱归一化、' +
              'TTUR（生成器与判别器用不同学习率）、以及小批量判别。' },
          { label: '(b)', points: 5, kind: 'keywords',
            prompt: '为什么两篇论文报告的 FID 不能直接横向比较？',
            keywords: ['特征提取器', '实现', '样本量', '预处理', '随机种子'],
            explain: 'FID 依赖 Inception 特征提取器的版本、图像缩放与裁剪方式、' +
              '参与计算的样本数量（样本少时统计量估计有偏）以及随机种子。' +
              '只有同一套评测代码、同一份真实样本、同样样本量下的数字才有可比性。' }
        ] },

      /* ---------------------------------------------------------- Q12 */
      { no: 12, points: 8, type: 'short answer',
        intro: '收束全卷的两个机制题。',
        parts: [
          { label: '(a)', points: 4, kind: 'keywords',
            prompt: 'seq2seq 的信息瓶颈是什么？注意力如何绕过它？',
            keywords: ['固定长度', '上下文向量', '加权求和', '回看', '编码器'],
            explain: '编码器把整段输入压进一个固定维度的上下文向量，句子越长，' +
              '细节被覆盖得越多，解码后半句时信息已经丢失。' +
              '注意力让解码器每一步对编码器的所有位置打分、加权求和，' +
              '相当于按需检索，而不是一次性压缩。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '写出扩散模型（DDPM）的训练目标与采样过程各一句话。',
            keywords: ['加噪', '预测噪声', '均方误差', '逐步去噪', '时间步'],
            explain: '训练：随机取时间步 t，对干净样本加噪得到 x_t，让网络从 x_t 与 t 回归所加的噪声，' +
              '损失是均方误差。采样：从标准正态噪声出发，用网络预测的噪声逐步去噪，' +
              '经 T 步得到样本。训练可并行（任意 t 一步加噪），采样必须串行。' }
        ] }
    ]
  });
})();
