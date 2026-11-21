/* =====================================================================
 * ch06.js · 第 6 章 · 序列建模与注意力机制
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch06',
  num: '06',
  title: '序列建模与注意力机制',
  en: 'SEQUENCES & ATTENTION',
  goals: [
    '说清序列建模与图像建模的差别：变长、次序、长程依赖',
    '写出 RNN 的递推式与 BPTT 的梯度路径，解释梯度消失与爆炸的来源',
    '比较 LSTM 与 GRU 的门控结构，并算出它们的参数量',
    '用注意力机制解释 seq2seq 的瓶颈如何被打破，写出缩放点积注意力',
    '分析自注意力的复杂度，说明位置编码与掩码各自解决什么问题'
  ],
  kp: [
    { id: 'ch06-1', title: '序列数据的三个挑战' },
    { id: 'ch06-2', title: 'RNN 与沿时间反向传播' },
    { id: 'ch06-3', title: 'LSTM 与 GRU' },
    { id: 'ch06-4', title: 'seq2seq 与信息瓶颈' },
    { id: 'ch06-5', title: '注意力机制' },
    { id: 'ch06-6', title: 'Transformer 与自注意力' },
    { id: 'ch06-7', title: '位置编码与掩码' },
    { id: 'ch06-8', title: '复杂度与工程取舍' },
    { id: 'ch06-9', title: '注意力实现自查' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '顺序本身是信息', html: '「狗咬人」和「人咬狗」用的是同一组词，但意思相反。把句子当成词袋，模型永远分不清这两句。序列建模的核心难点是：<b>输入长度可变</b>、<b>顺序携带语义</b>、<b>依赖可能跨越很远</b>。循环网络与注意力给出了两代不同的答案。' },
    { t: 'p', lead: true, html: '这一章沿着一条线走：RNN 用隐状态把历史压缩成一个向量，但压缩有损、梯度难传；LSTM 用门控缓解；seq2seq 把编码解码分离，却卡在固定长度的瓶颈上；注意力让解码器直接回看编码器的每一步；Transformer 干脆把「回看」做成唯一的结构。每一步都是在修补上一步的缺陷。' },

    { t: 'h', lvl: 2, text: '序列数据的三个挑战', id: 'ch06-1' },
    { t: 'p', html: '第一个挑战是变长。图像可以固定成 224×224，句子却从几个词到几千个词不等。批处理时要么补齐到同一长度并加掩码，要么用打包（packing）跳过填充位置。补齐会浪费计算，掩码写错则会把填充符当成真实输入。' },
    { t: 'p', html: '第二个挑战是顺序。词袋模型对排列不敏感，而语法与语义高度依赖顺序。位置信息必须显式注入：循环网络靠递推的先后顺序，Transformer 靠位置编码。去掉位置编码的自注意力是置换等变的，它看待「我打你」与「你打我」完全一样。' },
    { t: 'p', html: '第三个挑战是长程依赖。句首的主语可能要到句尾才等到谓语，代词指代的对象可能在上一段。循环网络把历史压进一个固定维度的隐状态，距离越远，信息衰减越严重。注意力的出现，本质上是把「压缩历史」换成「按需检索历史」。' },
    { t: 'compare', left: { title: '循环网络的做法', html: '隐状态 <code>h_t</code> 递推地汇总历史，每一步只看前一状态与当前输入。参数在所有时间步共享，计算量随长度线性增长。' }, right: { title: '注意力的做法', html: '保留所有位置的表示，每一步用查询去「检索」整段序列。没有递推，可以并行；代价是两两交互带来的平方复杂度。' } },

    { t: 'h', lvl: 2, text: 'RNN 与沿时间反向传播', id: 'ch06-2' },
    { t: 'p', html: '最朴素的循环网络在每个时间步做 <code>h_t = tanh(W_hh h_{t-1} + W_xh x_t + b_h)</code>，输出 <code>y_t = W_hy h_t + b_y</code>。同一个 <code>W_hh</code> 在所有时间步复用，所以参数量与序列长度无关。这也是它能把变长输入处理成变长输出的原因。' },
    { t: 'p', html: '训练时把网络按时间展开，再对整个展开图做反向传播，叫沿时间反向传播（BPTT）。梯度从最后一步往回传，每经过一步就乘一次 <code>W_hh</code> 与 tanh 的导数。若 <code>W_hh</code> 的谱半径小于 1，梯度指数衰减；大于 1 则指数爆炸。' },
    { t: 'p', html: '梯度爆炸表现为 loss 突然变 NaN，用梯度裁剪（按范数裁剪到 1 或 5）即可控制。梯度消失更麻烦：远处的信息根本传不回来，模型学不到长程依赖。换激活函数只能缓解，真正的解法是换结构——LSTM 的细胞状态提供了一条加法的高速通道。' },
    { t: 'code', lang: 'python', caption: '手写一个最简 RNN 单元，观察隐状态如何递推', code: `import torch
from torch import nn

class VanillaRNN(nn.Module):
    def __init__(self, input_size, hidden_size):
        super().__init__()
        self.hidden_size = hidden_size
        self.w_xh = nn.Linear(input_size, hidden_size)
        self.w_hh = nn.Linear(hidden_size, hidden_size, bias=False)
        self.w_hy = nn.Linear(hidden_size, 1)

    def forward(self, xs):
        h = torch.zeros(xs.size(1), self.hidden_size)
        outputs = []
        for x_t in xs:                       # xs: (T, B, D) 按时间展开
            h = torch.tanh(self.w_xh(x_t) + self.w_hh(h))
            outputs.append(self.w_hy(h))
        return torch.stack(outputs), h

rnn = VanillaRNN(8, 16)
seq = torch.randn(20, 4, 8)                  # 20 步，批量 4
ys, h_last = rnn(seq)
print(ys.shape, h_last.shape)               # (20, 4, 1) (4, 16)` },
    { t: 'p', html: '注意 <code>w_hh</code> 没有偏置：偏置由 <code>w_xh</code> 提供一次就够，重复加等价于换一个初值。另外循环里对 <code>T</code> 维做 Python 循环，速度慢；实践中用 <code>nn.RNN</code> 或直接调用底层融合算子，它们把时间步展开成一次矩阵乘。' },
    { t: 'p', html: 'BPTT 的显存随序列长度线性增长，长序列会撑爆显存。工程上的折中是截断 BPTT：把序列切成固定长度的片段，只在片段内反传，隐状态跨片段传递但不回传梯度。语言模型训练常用几百到几千 token 的片段，就是这个原因。' },

    { t: 'h', lvl: 2, text: 'LSTM 与 GRU', id: 'ch06-3' },
    { t: 'p', html: 'LSTM 引入细胞状态 <code>c_t</code> 与三个门：遗忘门 <code>f_t</code> 决定旧信息保留多少，输入门 <code>i_t</code> 决定新信息写入多少，输出门 <code>o_t</code> 决定暴露多少给隐状态。核心更新是 <code>c_t = f_t ⊙ c_{t-1} + i_t ⊙ g_t</code>——加法让梯度可以近乎无损地沿时间回传。' },
    { t: 'p', html: '门本身是 sigmoid，输出在 0 到 1 之间，相当于软开关。sigmoid 的饱和区导数很小，但因为是乘在细胞状态的加法路径上，梯度仍然能通过「遗忘门接近 1」的通道保留下来。这就是 LSTM 能记住几百步的原因，不是因为它更复杂，而是因为它的梯度路径更短。' },
    { t: 'p', html: 'GRU 把遗忘门与输入门合并成更新门 <code>z_t</code>，并用重置门 <code>r_t</code> 控制候选状态看多少历史，同时把细胞状态与隐状态合并。参数量约为 LSTM 的 3/4，效果在多数任务上相当，训练更快。小数据或算力受限时，GRU 往往是更实际的起点。' },
    { t: 'table', head: ['结构', '门数', '状态', '单层参数量（h 维）', '特点'], rows: [
      ['Vanilla RNN', '0', 'h', 'h(h+d)+h', '简单，长程依赖弱'],
      ['LSTM', '3', 'h, c', '4h(h+d)+4h', '细胞状态加法通道，记忆长'],
      ['GRU', '2', 'h', '3h(h+d)+3h', '参数少 25%，训练快'],
      ['双向 RNN', '—', 'h 前后向', '约 2 倍', '需要完整序列，不能在线解码']
    ] },
    { t: 'p', html: '双向网络把前向与后向的隐状态拼起来，每个位置都能看到左右上下文，对分类与标注很有效。但它要求整段序列先到齐，不能用于自回归生成——解码时未来的词还不存在。所以语言模型用单向（或因果掩码），编码器可以用双向。' },

    { t: 'h', lvl: 2, text: 'seq2seq 与信息瓶颈', id: 'ch06-4' },
    { t: 'p', html: 'seq2seq 把任务拆成编码器与解码器：编码器读完整个输入，把最后隐状态作为上下文向量交给解码器，解码器逐步生成输出。机器翻译、摘要、对话都可以套这个框架，输入输出长度不必相等。' },
    { t: 'p', html: '问题在于那个上下文向量是固定长度的。源句有 50 个词还是 5 个词，都要压进同一个几百维的向量；解码到后半句时，早年的信息已经被覆盖。句子越长，BLEU 掉得越厉害，这就是信息瓶颈。' },
    { t: 'p', html: '一个自然的修补是让解码器每一步都能回看编码器的全部隐状态，而不是只看最后一个。具体做法是给每个编码位置打分、归一化成权重、加权求和得到当前步的上下文。这个机制就是注意力，它把「压缩」换成了「检索」。' },
    { t: 'callout', kind: 'tip', title: '先有瓶颈，才有注意力', html: '很多教材直接从注意力讲起，容易让人以为它只是一个技巧。把 seq2seq 的固定向量瓶颈讲清楚，注意力的必要性就变成了算术问题：解码第 t 步需要的信息在源句第 3 个词，固定向量却把它和第 40 个词混在一起——不检索就取不回来。' },

    { t: 'h', lvl: 2, text: '注意力机制', id: 'ch06-5' },
    { t: 'p', html: '注意力把输入组织成键值对：查询 <code>q</code> 与每个键 <code>k_i</code> 算相似度 <code>e_i</code>，softmax 得到权重 <code>α_i</code>，输出是值的加权和 <code>Σ α_i v_i</code>。权重之和为 1，所以输出始终在值向量的凸包内，不会因序列变长而数值爆炸。' },
    { t: 'p', html: '打分函数有多种：点积 <code>q·k</code> 最快，加性（Bahdanau）用一层小网络，双线性用 <code>q^T W k</code>。点积的方差随维度增长，维度大时 softmax 会饱和，所以 Transformer 除以 <code>√d_k</code> 做缩放。这个细节不是可选项，去掉后深层训练明显不稳。' },
    { t: 'p', html: '注意力还有一层好处是可解释：权重矩阵画出来，能看到「它翻译这个词时看了源句哪些词」。对齐关系不需要额外监督就能浮现，这也是注意力最早在翻译任务上引起关注的原因之一。' },
    { t: 'table', head: ['打分方式', '公式', '复杂度', '适用'], rows: [
      ['点积', 'q·k', 'O(d)', '维度不大、追求速度'],
      ['缩放点积', 'q·k / √d_k', 'O(d)', 'Transformer 默认'],
      ['双线性', 'qᵀ W k', 'O(d²)', '需要学相似度度量'],
      ['加性', 'vᵀ tanh(W[q;k])', 'O(d²)', '维度差异大时更稳']
    ] },

    { t: 'h', lvl: 2, text: 'Transformer 与自注意力', id: 'ch06-6' },
    { t: 'p', html: '自注意力让序列中的每个位置都对自己这一整段做注意力：查询、键、值都由同一个输入线性变换得到。这样任意两个位置之间的路径长度都是 1，长程依赖不再需要穿过几十步递推，梯度也不会指数衰减。' },
    { t: 'p', html: '多头注意力把表示切成 h 份，每份独立做注意力再拼接。不同的头可以关注不同关系：有的看相邻词，有的看句法依存，有的看指代。单头只能学一种加权，多头提供了并行的多个「视角」，参数量不变而表达力更强。' },
    { t: 'p', html: '一个 Transformer 层是「多头自注意力 → 残差 + LayerNorm → 前馈网络 → 残差 + LayerNorm」。前馈网络逐位置独立，先升维到 4 倍再降回，提供非线性。残差与 LayerNorm 让几十层堆叠可以训练，这一点与 ResNet 的逻辑完全一致。' },
    { t: 'code', lang: 'python', caption: '缩放点积注意力与因果掩码', code: `import math
import torch

def attention(q, k, v, mask=None):
    # q: (B, H, T, D)  k/v: (B, H, S, D)
    scores = q @ k.transpose(-2, -1) / math.sqrt(q.size(-1))
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))
    weights = scores.softmax(dim=-1)
    return weights @ v, weights

T = 4
q = torch.randn(1, 2, T, 8)
k = torch.randn(1, 2, T, 8)
v = torch.randn(1, 2, T, 8)
causal = torch.tril(torch.ones(T, T)).bool()
out, w = attention(q, k, v, causal)
print(out.shape, w.shape)          # (1, 2, 4, 8) (1, 2, 4, 4)
print(w[0, 0].round(decimals=2))   # 上三角为 0，只能看左侧` },
    { t: 'p', html: '这段代码里 <code>masked_fill</code> 必须在 softmax 之前：先把未来位置的分数置为负无穷，softmax 后权重恰好为 0。如果先 softmax 再置零，剩余权重之和不再是 1，输出尺度会错。这是实现因果注意力最常见的 bug。' },

    { t: 'h', lvl: 2, text: '位置编码与掩码', id: 'ch06-7' },
    { t: 'p', html: '自注意力对置换等变：把输入顺序打乱，输出只是跟着打乱，模型无法区分「猫追狗」与「狗追猫」。位置编码把位置信息加进词向量，打破这种对称。正弦编码用不同频率的 sin/cos，好处是可以外推到训练时没见过的长度。' },
    { t: 'p', html: '可学习的位置嵌入更简单，但长度被训练时的最大长度锁死，超出就没有对应的行。旋转位置编码（RoPE）把位置写成旋转矩阵作用在 q、k 上，使点积只依赖相对距离，外推性更好，已成为主流大模型的选择。' },
    { t: 'p', html: '掩码有两类，容易混淆。填充掩码（padding mask）把补齐的无效位置屏蔽掉，避免它们参与注意力；因果掩码（causal mask）把每个位置右侧的未来屏蔽掉，保证自回归生成时不会偷看答案。训练时两者常常同时使用，形状要对齐到 <code>(B, 1, T, S)</code> 才能广播。' },
    { t: 'table', head: ['编码方式', '形式', '外推性', '备注'], rows: [
      ['正弦编码', '固定公式，不加参数', '较好', '早期 Transformer 使用'],
      ['可学习嵌入', '查表，长度固定', '差', '超过最大长度即失效'],
      ['相对位置偏置', '加到注意力分数上', '中等', 'T5 等模型使用'],
      ['RoPE', '对 q、k 做旋转', '好', '主流大模型采用'],
      ['ALiBi', '按距离线性惩罚', '好', '实现简单，长文本常用']
    ] },
    { t: 'p', html: '掩码写错不会报错，只会让指标变好得可疑。训练语言模型时如果忘了因果掩码，模型能直接看到下一个词，训练 loss 会掉到接近 0，但生成时完全不会。看到「好得不像真的」的困惑度，第一件事就是检查掩码。' },

    { t: 'h', lvl: 2, text: '复杂度与工程取舍', id: 'ch06-8' },
    { t: 'p', html: '自注意力的计算量是 <code>O(T²d)</code>，显存也是 <code>O(T²)</code>，因为要存 T×T 的分数矩阵。序列翻倍，注意力部分贵四倍；前馈网络是 <code>O(Td²)</code>，只贵两倍。长序列时，二次项成为瓶颈，这就是长上下文研究的出发点。' },
    { t: 'p', html: '工程上的应对有三类：稀疏或局部注意力，只让每个位置看邻近窗口；线性注意力，用核函数近似 softmax 把复杂度降到线性；以及 FlashAttention 这类 IO 感知的实现，不改变数学结果，只减少显存读写，把常数降下来。前两类改模型，后一类改实现。' },
    { t: 'p', html: '还有一条常被忽略的取舍：RNN 的复杂度是 <code>O(Td²)</code>，序列很长时反而比注意力省。但它不能并行，训练慢。实际选择取决于长度、算力与延迟要求：短序列用 Transformer，超长流式场景仍有人用状态空间模型（SSM）或门控循环结构。' },
    { t: 'table', head: ['结构', '每层计算量', '并行性', '长序列表现'], rows: [
      ['RNN / LSTM', 'O(T·d²)', '时间步串行', '长程依赖弱'],
      ['自注意力', 'O(T²·d)', '完全并行', '二次增长，长文本贵'],
      ['局部窗口注意力', 'O(T·w·d)', '并行', '局部强、全局弱'],
      ['线性注意力 / SSM', 'O(T·d²)', '并行', '线性增长，表达略弱']
    ] },
    { t: 'p', html: '理解这些取舍比记住某个模型的结构更重要。面试里问「为什么 Transformer 能取代 RNN」，标准答案不是「效果更好」，而是「训练可以并行，且任意位置路径长度为 1」；再补一句「代价是推理时 KV 缓存随长度增长、注意力是平方复杂度」，就完整了。' },

    { t: 'h', lvl: 2, text: '注意力实现自查', id: 'ch06-9' },
    { t: 'p', html: '手写注意力时，错误几乎总落在三个地方：缩放因子漏了、掩码加在了错误的位置、形状在 batch 与 head 两维之间转错。这一节按「形状 → 掩码 → 缩放」的顺序自查一遍，基本能覆盖全部常见 bug。' },
    { t: 'table', head: ['张量', '形状（B=batch, T=长度, d=维度, h=头数）', '含义'], rows: [
      ['x', 'B × T × d', '输入序列，每个位置一个 d 维向量'],
      ['Q, K, V', 'B × h × T × d/h', '投影后按头拆分，方便并行计算'],
      ['scores', 'B × h × T × T', '每个 query 对每个 key 的相似度'],
      ['mask', '1 × 1 × T × T（可广播）', '上三角为 -inf，禁止看到未来'],
      ['attn', 'B × h × T × T', 'softmax 之后每行和为 1'],
      ['out', 'B × T × d', '各头拼接后过一次输出投影']
    ] },
    { t: 'p', html: '掩码必须加在 softmax <b>之前</b>，而且是加一个很大的负数而不是乘 0：乘 0 之后 exp(0)=1，被屏蔽的位置仍然会分到概率。用 <code>-1e9</code> 或 <code>torch.finfo(dtype).min</code>，softmax 之后这些位置的概率就是 0。' },
    { t: 'code', lang: 'python', caption: '掩码 softmax 的形状与数值自查', code: `import torch
import torch.nn.functional as F

B, h, T, d = 2, 4, 5, 8
q = torch.randn(B, h, T, d)
k = torch.randn(B, h, T, d)
v = torch.randn(B, h, T, d)

scores = q @ k.transpose(-2, -1) / (d ** 0.5)   # B h T T
mask = torch.triu(torch.ones(T, T, dtype=torch.bool), diagonal=1)
print('scores', tuple(scores.shape), 'mask', tuple(mask.shape))

scores = scores.masked_fill(mask, float('-inf'))
attn = F.softmax(scores, dim=-1)

print('每行和', attn.sum(-1).min().item(), attn.sum(-1).max().item())
print('未来位置概率', attn.masked_select(mask).abs().max().item())  # 应为 0
out = (attn @ v).transpose(1, 2).reshape(B, T, d)
print('输出', tuple(out.shape))

# 反向传播也要能穿过掩码：梯度在被屏蔽位置应为 0
out.sum().backward()
print('q 梯度有限', torch.isfinite(q.grad).all().item())` },
    { t: 'p', html: '运行后检查三件事：每行概率和是否等于 1（浮点误差内）、未来位置的概率是否严格为 0、反向传播后梯度是否仍然有限。如果第二项不为 0，说明掩码加晚了或用了乘法；如果第三项出现 nan，通常是整行都被屏蔽，softmax 的分母变成 0。' },
    { t: 'p', html: 'Transformer 的训练稳定性靠三件套：先 warmup 再衰减、按范数裁剪梯度、用混合精度但把 softmax 与归一化留在 fp32。warmup 的作用是让注意力在早期不要一步走太远；裁剪阈值一般取 1.0；fp16 下 softmax 的指数容易溢出，bf16 的动态范围更大，条件允许时优先用它。' },
    { t: 'table', head: ['手段', '典型设置', '解决什么'], rows: [
      ['学习率 warmup', '前 5% 步数线性升到峰值', '早期注意力随机，避免一步走偏'],
      ['梯度裁剪', 'global norm ≤ 1.0', '偶发的尖峰把参数带飞'],
      ['混合精度', 'bf16 优先，softmax 留 fp32', '省显存、提速，同时保数值稳定']
    ] },
    { t: 'compare', left: { title: '先拼头再算注意力', html: '把 h 个头拼回 d 维再一起算，代码短，但每个头共享同一套 scores，等价于单头。只在教学演示里成立，不能用于真实模型。' }, right: { title: '按头拆开并行算', html: '把 d 拆成 h 份，形状变成 B×h×T×d/h，各头独立算 scores 再拼接。这是标准实现，也是 GPU 上效率最高的写法。' } },
    { t: 'callout', kind: 'tip', title: '一个便宜的单元测试', html: '把序列长度设为 2，手算一遍注意力权重，与代码输出对比。<code>T=2</code> 时掩码只屏蔽一个位置，任何缩放或转置错误都会立刻暴露，比在长序列上调试快得多。' },

    { t: 'terms', items: [
      { en: 'BPTT', zh: '沿时间反向传播', def: '把循环网络按时间展开后做反向传播，梯度沿时间步连乘。' },
      { en: 'gating', zh: '门控', def: '用 sigmoid 输出 0 到 1 的软开关，控制信息的保留与写入。' },
      { en: 'attention', zh: '注意力', def: '用查询与键的相似度加权求和值，实现按需检索。' },
      { en: 'self-attention', zh: '自注意力', def: '查询、键、值都来自同一序列的注意力。' },
      { en: 'causal mask', zh: '因果掩码', def: '屏蔽未来位置，保证自回归生成不偷看答案。' },
      { en: 'positional encoding', zh: '位置编码', def: '把位置信息注入表示，打破自注意力的置换等变性。' }
    ] },
    { t: 'quiz', qid: 'ch06-q1' },
    { t: 'quiz', qid: 'ch06-q2' },
    { t: 'quiz', qid: 'ch06-q3' },
    { t: 'keypoint', title: '本章要点', items: [
      { title: '梯度路径', html: 'RNN 的梯度沿时间连乘 W_hh；LSTM 用细胞状态的加法路径绕过连乘。' },
      { title: '缩放', html: '点积注意力除以 √d_k，防止维度大时 softmax 饱和。' },
      { title: '掩码顺序', html: '先 mask 再 softmax；因果掩码与填充掩码形状要能广播。' },
      { title: '并行性', html: '自注意力任意两位置路径长度为 1，训练可完全并行。' },
      { title: '复杂度', html: '注意力 O(T²d)，前馈 O(Td²)；长序列的瓶颈在二次项。' }
    ] },
    { t: 'checklist', id: 'ch06', items: [
      '能列出序列建模的三个挑战，并各举一个例子',
      '能写出 RNN 递推式，说明参数量为何与序列长度无关',
      '能解释 BPTT 中梯度消失与爆炸的来源，以及梯度裁剪的作用',
      '能画出 LSTM 的三个门，说明细胞状态为什么能保留长程信息',
      '能比较 LSTM 与 GRU 的门数与参数量',
      '能说清 seq2seq 的信息瓶颈，以及注意力如何绕过它',
      '能写出缩放点积注意力，并解释除以 √d_k 的原因',
      '能说明多头注意力与单头的区别，以及残差与 LayerNorm 的位置',
      '能区分填充掩码与因果掩码，知道掩码必须在 softmax 之前',
      '能比较 RNN、自注意力与线性注意力的复杂度与并行性'
    ] },
    { t: 'p', html: '到这里，判别式模型的主线已经走完：从概率与损失，到多层结构、反向传播、训练技巧，再到卷积与序列。最后一章换一个方向——不预测标签，而是学习数据本身的分布，并把前面所有零件组装成一个端到端项目。' },
    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章覆盖序列数据的挑战、RNN 与 BPTT、LSTM 与 GRU 的门控、seq2seq 的信息瓶颈、注意力打分函数、Transformer 自注意力与多头、位置编码与掩码、复杂度与工程取舍。依据教材《Deep Learning: Foundations and Concepts》中序列模型与注意力相关主题，以及《Pattern Recognition and Machine Learning》中文版对序列数据与图模型的讨论；复杂度与参数量按标准实现估算。' }
  ]
});
