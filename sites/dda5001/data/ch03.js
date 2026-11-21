/* =====================================================================
 * ch03.js · 第 3 章 · 反向传播与自动微分
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch03',
  num: '03',
  title: '反向传播与自动微分',
  en: 'BACKPROP & AUTOGRAD',
  goals: [
    '把一个两层网络画成计算图，并标出前向与反向各自需要保存的张量',
    '用链式法则推导线性层、ReLU 与 softmax 交叉熵的局部梯度',
    '手推 784-64-10 网络的 dW1、db1、dW2、db2，并与 autograd 的结果逐项对照',
    '说明前向模式与反向模式自动微分的成本差异，解释深度学习为何选反向模式',
    '用中心差分做梯度检查，并定位梯度消失或爆炸发生在哪一层'
  ],
  kp: [
    { id: 'ch03-1', title: '计算图：把前向写成有向无环图' },
    { id: 'ch03-2', title: '链式法则与雅可比矩阵' },
    { id: 'ch03-3', title: '反向传播的四条公式' },
    { id: 'ch03-4', title: '手推两层网络梯度' },
    { id: 'ch03-5', title: '前向模式与反向模式自动微分' },
    { id: 'ch03-6', title: 'PyTorch autograd 的机制' },
    { id: 'ch03-7', title: '梯度检查与数值稳定性' },
    { id: 'ch03-8', title: '梯度消失与梯度爆炸' },
    { id: 'ch03-9', title: '梯度自查清单' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '梯度从哪来', html: '第 2 章搭好了网络，但参数还是随机的。要让损失下降，必须知道每个参数该往哪个方向挪——这就是梯度。反向传播不是新算法，它只是<b>链式法则在计算图上的一次系统化应用</b>：前向时记录中间结果，反向时从损失出发，把「上游传来的梯度」乘以「本地的偏导」，一层层传回去。' },
    { t: 'p', lead: true, html: '这一章的内容在考试与面试里出现频率最高：手推梯度、判断形状、解释梯度消失。学的时候不要只背公式，而要在纸上把一个小网络的每个张量画出来，标上形状，再走一遍反向。走通一次，后面看到任何层都能自己推。' },

    { t: 'h', lvl: 2, text: '计算图：把前向写成有向无环图', id: 'ch03-1' },
    { t: 'p', html: '计算图把每个张量看作节点，把每个运算看作边。以 <code>z = Wx + b</code>、<code>a = ReLU(z)</code>、<code>L = CE(a, y)</code> 为例，节点依次是 x、W、b、Wx、z、a、L。前向计算时，框架不仅算出数值，还记录「谁由谁产生」，这张记录就是反向传播的路线图。' },
    { t: 'p', html: '反向必须按拓扑逆序进行：只有当一个节点的所有下游都用完，它的梯度才累加完毕。这就是为什么 PyTorch 的 <code>backward()</code> 从标量损失出发，按图的逆序依次调用每个运算的 <code>backward</code> 函数。如果图里有分支（一个张量被多处使用），梯度会在该节点处相加，而不是覆盖。' },
    { t: 'p', html: '图带来的直接好处是模块化：每个运算只需要知道两件事——怎么算前向输出，怎么把上游梯度乘上本地雅可比得到下游梯度。至于整张图长什么样、有多少层，运算本身不需要关心。这种「局部规则 + 全局调度」的设计，正是深度学习框架能支持任意结构的原因。' },

    { t: 'h', lvl: 2, text: '链式法则与雅可比矩阵', id: 'ch03-2' },
    { t: 'p', html: '标量复合函数求导是熟悉的 <code>dz/dx = dz/dy · dy/dx</code>。到了向量情形，<code>y = f(x)</code> 的导数不再是一个数，而是一个矩阵：<code>J[i,j] = ∂y_i/∂x_j</code>，称为雅可比矩阵。链式法则变成矩阵乘法：<code>J_{f∘g} = J_f · J_g</code>。' },
    { t: 'p', html: '反向传播从不显式构造完整雅可比，而是「向量-雅可比积」：给定上游梯度 <code>v = ∂L/∂y</code>，只需算 <code>vᵀJ</code> 就能得到 <code>∂L/∂x</code>。这一步把复杂度从「矩阵大小」降到「一次矩阵乘法」。例如 Linear 层 <code>y = Wx</code> 的雅可比是 W，向量-雅可比积就是 <code>Wᵀv</code>，形状自然对得上。' },
    { t: 'p', html: '逐元素函数（ReLU、sigmoid）的雅可比是对角矩阵，向量-雅可比积退化为逐元素相乘。这就是代码里 <code>delta * (z > 0)</code> 的来历，而不是什么特殊技巧。理解「对角雅可比 = 逐元素乘」，反向传播的一大半公式就不需要背了。' },
    { t: 'callout', kind: 'tip', title: '形状自检法', html: '任何梯度都必须与对应参数同形：<code>dW</code> 与 <code>W</code> 同形，<code>db</code> 与 <code>b</code> 同形，<code>dx</code> 与 <code>x</code> 同形。如果推出来的形状不对，先别怀疑数学，检查是不是转置放错了位置。' },

    { t: 'h', lvl: 2, text: '反向传播的四条公式', id: 'ch03-3' },
    { t: 'p', html: '考虑一层 <code>z = Wx + b</code>，<code>a = φ(z)</code>，损失为 L。设上游梯度 <code>g = ∂L/∂a</code>。第一步穿过激活：<code>δ = ∂L/∂z = g ⊙ φ′(z)</code>，其中 ⊙ 是逐元素乘。第二步分三路：<code>∂L/∂W = δ xᵀ</code>，<code>∂L/∂b = δ</code>，<code>∂L/∂x = Wᵀδ</code>。' },
    { t: 'p', html: '这四条公式覆盖了全连接网络的全部反向计算。批量情形下，<code>δ</code> 的形状是 <code>(B, out)</code>，<code>x</code> 是 <code>(B, in)</code>，于是 <code>δ xᵀ</code> 是 <code>(out, in)</code>，与 W 同形；<code>Wᵀδ</code> 是 <code>(B, in)</code>，与 x 同形。偏置的梯度要对 batch 维求和：<code>∂L/∂b = Σ_b δ_b</code>，因为同一个 b 被所有样本共享。' },
    { t: 'table', head: ['量', '公式', '形状', '记忆点'], rows: [
      ['δ（对 z 的梯度）', 'g ⊙ φ′(z)', '(B, out)', '激活的导数逐元素乘'],
      ['dW', 'δ xᵀ', '(out, in)', '上游梯度乘输入'],
      ['db', 'Σ_b δ', '(out,)', 'batch 维求和'],
      ['dx', 'Wᵀ δ', '(B, in)', '权重转置乘上游'],
      ['dL/dz（softmax+CE）', '(p - y) / B', '(B, K)', '概率减 one-hot']
    ] },
    { t: 'p', html: '最后一行是分类任务里最常考的结论：softmax 加交叉熵的联合梯度就是「预测概率减 one-hot」，再除以 batch 大小。它之所以这么干净，是因为 log_softmax 与负对数似然在求导时互相抵消。框架把这两个运算合并成一个算子，正是为了利用这个化简。' },

    { t: 'h', lvl: 2, text: '手推两层网络梯度', id: 'ch03-4' },
    { t: 'p', html: '设网络为 <code>z₁ = W₁x + b₁</code>，<code>h = ReLU(z₁)</code>，<code>z₂ = W₂h + b₂</code>，<code>L = CE(z₂, y)</code>。反向从 L 开始：先得到 <code>dz₂ = (p - y)/B</code>；再算 <code>dW₂ = dz₂ hᵀ</code>、<code>db₂ = Σ dz₂</code>、<code>dh = W₂ᵀ dz₂</code>。' },
    { t: 'p', html: '接着穿过 ReLU：<code>dz₁ = dh ⊙ 1[z₁ > 0]</code>。最后 <code>dW₁ = dz₁ xᵀ</code>、<code>db₁ = Σ dz₁</code>、<code>dx = W₁ᵀ dz₁</code>。整个过程只用到矩阵乘法、转置与逐元素乘，没有任何「黑魔法」。手推一遍之后，再看框架代码，每一行都能对上。' },
    { t: 'p', html: '一个常见的符号错误是把 <code>dW₂ = dz₂ hᵀ</code> 写成 <code>h dz₂ᵀ</code>。用形状检查就能发现：<code>dz₂</code> 是 <code>(B, K)</code>，<code>h</code> 是 <code>(B, H)</code>，要得到 <code>(K, H)</code> 的 dW₂，必须是 <code>dz₂ᵀ h</code>（批量求和后）或单样本下的 <code>dz₂ hᵀ</code>。批量实现通常写成 <code>dz2.T @ h</code>。' },
    { t: 'code', lang: 'python', caption: '手写两层网络的反向传播，并与 autograd 对照', code: `import torch

torch.manual_seed(0)
B, D, H, K = 8, 5, 7, 3
x = torch.randn(B, D)
y = torch.randint(0, K, (B,))

W1 = torch.randn(D, H, requires_grad=True)
b1 = torch.zeros(H, requires_grad=True)
W2 = torch.randn(H, K, requires_grad=True)
b2 = torch.zeros(K, requires_grad=True)

z1 = x @ W1 + b1
h = torch.relu(z1)
logits = h @ W2 + b2
loss = torch.nn.functional.cross_entropy(logits, y)
loss.backward()

# 手写版本：p - onehot，再逐层回传
with torch.no_grad():
    p = torch.softmax(logits, dim=1)
    dz2 = (p - torch.nn.functional.one_hot(y, K).float()) / B
    dW2 = dz2.T @ h
    db2 = dz2.sum(0)
    dh = dz2 @ W2.T
    dz1 = dh * (z1 > 0)
    dW1 = dz1.T @ x
    db1 = dz1.sum(0)

for name, a, b in [("dW1", dW1, W1.grad), ("db1", db1, b1.grad),
                   ("dW2", dW2, W2.grad), ("db2", db2, b2.grad)]:
    print(name, torch.allclose(a, b, atol=1e-6))   # 全部 True` },
    { t: 'p', html: '这段代码是本课程最值得亲手敲一遍的片段：它把「推导」与「框架」放在同一组数值上对照，任何符号错误都会立刻暴露。注意 <code>torch.no_grad()</code> 的作用——手写部分不需要建图；而 <code>one_hot</code> 转成 float 是为了与概率相减。' },

    { t: 'h', lvl: 2, text: '前向模式与反向模式自动微分', id: 'ch03-5' },
    { t: 'p', html: '自动微分（automatic differentiation）不是数值差分，也不是符号求导，而是对每个基本运算应用链式法则，精确到浮点误差。它有两种遍历方向：前向模式从输入出发，沿着计算顺序传播「输入对当前节点的导数」；反向模式从输出出发，逆序传播「当前节点对输出的导数」。' },
    { t: 'p', html: '成本差异来自输入与输出的维度。设函数有 n 个输入、m 个输出：前向模式一次传播得到一个输入对所有输出的影响，需要 n 次；反向模式一次得到一个输出对所有输入的影响，需要 m 次。深度学习是「几百万个参数 → 一个标量损失」，即 n 巨大、m=1，所以反向模式一次就能算完，成本约为前向的两到三倍。' },
    { t: 'table', head: ['维度', '前向模式', '反向模式'], rows: [
      ['遍历方向', '输入 → 输出', '输出 → 输入'],
      ['一次传播得到', '一个输入的整行雅可比', '一个输出的整列雅可比'],
      ['总成本', '约 n 次前向', '约 m 次前向'],
      ['适合', '输入少、输出多', '输入多、输出少（深度学习）'],
      ['实现', '对偶数、JVP', '反向图、VJP']
    ] },
    { t: 'p', html: '反向模式需要保存前向的中间结果（激活值、掩码），因此显存占用随深度增长。训练时 batch 越大、层越深，显存越紧张，这也是梯度检查点（gradient checkpointing）存在的原因：用重算换取显存。理解了这一点，就不会把「显存不够」简单归咎于模型太大。' },

    { t: 'h', lvl: 2, text: 'PyTorch autograd 的机制', id: 'ch03-6' },
    { t: 'p', html: '在 PyTorch 里，<code>requires_grad=True</code> 的张量是「叶子」，参与运算后产生的新张量会带一个 <code>grad_fn</code>，指向生成它的运算。调用 <code>loss.backward()</code> 时，引擎从损失出发，沿 <code>grad_fn</code> 链逆序执行每个运算的反向函数，把结果累加到叶子张量的 <code>.grad</code> 上。' },
    { t: 'p', html: '三个细节决定你能否写对训练循环。第一，梯度是累加的，所以每步更新前必须 <code>optimizer.zero_grad()</code>，否则梯度会跨 batch 叠加。第二，默认反向一次后图就被释放，若要二次反向需 <code>retain_graph=True</code>。第三，推理或手动计算时应包在 <code>torch.no_grad()</code> 里，既省显存也避免误建图。' },
    { t: 'code', lang: 'python', caption: '观察 grad_fn、叶子张量与梯度累加', code: `import torch

x = torch.tensor([2.0, 3.0])
w = torch.tensor([1.0, -1.0], requires_grad=True)

y = (w * x).sum()          # 中间张量，非叶子
print(y.grad_fn)           # <SumBackward0>
print(w.is_leaf, y.is_leaf)  # True False

y.backward()
print(w.grad)              # tensor([2., 3.])，即 x

y.backward()               # 第二次反向：梯度累加，不是覆盖
print(w.grad)              # tensor([4., 6.])

w.grad.zero_()             # 手动清零，等价于 optimizer.zero_grad()
print(w.grad)              # tensor([0., 0.])` },
    { t: 'p', html: '如果对中间张量调用 <code>backward()</code>，必须传一个与它同形的 <code>gradient</code> 参数，因为反向的起点需要一个「上游梯度」。对损失这种标量则不用传，默认是 1。这条规则解释了为什么 <code>loss.backward()</code> 可以直接调用，而 <code>logits.backward()</code> 会报错。' },
    { t: 'callout', kind: 'warn', title: '三个会静默出错的写法', html: '① 忘记 <code>zero_grad()</code>：损失震荡或突然爆炸，因为梯度在累加。② 在需要梯度的计算里用了 in-place 操作（如 <code>relu_()</code>）修改了反向要用的张量：报「one of the variables needed has been modified」。③ 把 <code>.item()</code> 或 <code>.numpy()</code> 用在需要梯度的张量上：图在这里断开，参数永远不更新。' },

    { t: 'h', lvl: 2, text: '梯度检查与数值稳定性', id: 'ch03-7' },
    { t: 'p', html: '手推的梯度再仔细也可能出错，标准做法是梯度检查：用中心差分近似数值梯度 <code>(L(θ+ε) - L(θ-ε)) / (2ε)</code>，与解析梯度比较相对误差。中心差分的误差是 O(ε²)，比前向差分精确；ε 取 1e-4 左右，太大截断误差明显，太小被浮点噪声淹没。' },
    { t: 'p', html: '检查时要用双精度（float64），并关闭 dropout 等随机性；相对误差小于 1e-7 基本可认为正确，1e-4 到 1e-2 之间要警惕，大于 1e-2 通常是真的写错了。注意 ReLU 在 0 点不可导，若参数恰好落在折点附近，数值梯度会失真——这是检查本身的局限，不是代码错误。' },
    { t: 'p', html: '数值稳定性是另一半问题。概率很小时直接算 <code>log(p)</code> 会得到负无穷，正确做法是用 log-sum-exp 把最大值提出来；计算 <code>1 - p</code> 时若 p 接近 1 会损失精度，应改用 <code>log1p(-p)</code> 或直接使用框架的 logits 版本损失。这些不是「优化技巧」，而是保证梯度有意义的必要条件。' },
    { t: 'code', lang: 'python', caption: '中心差分梯度检查', code: `import torch

def f(w):
    return (w ** 3).sum()          # 解析梯度 3w^2

w = torch.tensor([0.5, -1.2, 2.0], dtype=torch.float64, requires_grad=True)
loss = f(w)
loss.backward()
analytic = w.grad.clone()

eps = 1e-6
numeric = torch.zeros_like(w)
for i in range(len(w)):
    plus = w.detach().clone(); plus[i] += eps
    minus = w.detach().clone(); minus[i] -= eps
    numeric[i] = (f(plus) - f(minus)) / (2 * eps)

rel = (analytic - numeric).abs() / (analytic.abs() + numeric.abs() + 1e-12)
print(analytic, numeric)
print(rel.max().item())            # 约 1e-10，说明实现正确` },
    { t: 'p', html: '真实网络里做检查时，只抽查少量参数即可，不必对全部百万参数做差分。先把模型切到 eval 模式、固定输入、用 float64 复制一份小模型，再对比两套梯度。这套流程写成一个函数，以后每加一个自定义层就跑一次，能省下大量调试时间。' },

    { t: 'h', lvl: 2, text: '梯度消失与梯度爆炸', id: 'ch03-8' },
    { t: 'p', html: '反向传播是雅可比矩阵的连乘。如果每层的谱范数略小于 1，连乘 L 层后梯度按指数衰减；略大于 1 则指数增长。sigmoid 的导数最大 0.25，十层之后上界是 <code>0.25¹⁰ ≈ 1e-6</code>，这就是经典梯度消失的算术来源。' },
    { t: 'p', html: '爆炸的表现是损失变成 NaN、参数瞬间飞到极大；消失的表现是浅层几乎不更新、损失停滞但也不报错，隐蔽得多。诊断方法是打印每一层权重的梯度范数：如果从后往前迅速衰减几个数量级，就是消失；迅速增大则是爆炸。' },
    { t: 'table', head: ['现象', '常见原因', '对策'], rows: [
      ['浅层梯度接近 0', 'sigmoid/tanh 饱和，连乘衰减', '换 ReLU/GELU、He 初始化、残差连接'],
      ['梯度逐层放大到 inf', '初始化方差过大、学习率过高', '减小初始化方差、梯度裁剪、降学习率'],
      ['某些单元永远输出 0', 'ReLU 死亡', 'LeakyReLU、减小学习率、检查偏置初始化'],
      ['训练后期突然 NaN', '除零、log(0)、异常样本', '加 eps、检查数据、梯度裁剪'],
      ['深层网络难训练', '恒等映射未被学习', '残差连接、归一化层']
    ] },
    { t: 'p', html: '工程上的通用兜底是梯度裁剪：<code>torch.nn.utils.clip_grad_norm_(params, max_norm=1.0)</code>，把所有参数的梯度整体缩放到范数不超过阈值。它不解决根因，但能防止一次异常 batch 把训练毁掉，在 RNN 与 Transformer 训练里几乎是标配。' },

    { t: 'h', lvl: 2, text: '梯度自查清单', id: 'ch03-9' },
    { t: 'p', html: '自己写的层或损失函数上线前，至少要过一遍梯度检查：用中心差分估计数值梯度，与反向传播的解析梯度比较相对误差。下面的函数可以直接复制到任何 PyTorch 项目里，对一组参数逐个扰动。' },
    { t: 'code', lang: 'python', caption: '通用的梯度检查函数与一次实际调用', code: `import torch

def grad_check(fn, params, eps=1e-5, tol=1e-4):
    """fn 返回标量损失；params 是 requires_grad 的张量列表。"""
    loss = fn()
    loss.backward()
    for p in params:
        num = torch.zeros_like(p)
        flat = p.detach().view(-1)
        for i in range(flat.numel()):
            old = flat[i].item()
            flat[i] = old + eps
            hi = fn().item()
            flat[i] = old - eps
            lo = fn().item()
            flat[i] = old
            num.view(-1)[i] = (hi - lo) / (2 * eps)
        rel = (num - p.grad).abs().max() / (num.abs().max() + 1e-12)
        print('相对误差', rel.item(), '通过' if rel < tol else '不通过')

# 用一个小网络验证：三层 MLP + 交叉熵
torch.manual_seed(0)
W1 = torch.randn(4, 3, requires_grad=True)
W2 = torch.randn(3, 2, requires_grad=True)
x = torch.randn(5, 4)
y = torch.randint(0, 2, (5,))

def loss_fn():
    h = torch.relu(x @ W1)
    return torch.nn.functional.cross_entropy(h @ W2, y)

grad_check(loss_fn, [W1, W2])` },
    { t: 'callout', kind: 'tip', title: '梯度检查的三条纪律', html: '一、用双精度（<code>.double()</code>）做检查，单精度的差分噪声会掩盖真实误差；二、检查前关掉 dropout 与 BN 的训练行为，否则损失本身带随机性；三、eps 取 1e-5 左右，太小会被浮点误差淹没，太大则差分近似本身不准。' },
    { t: 'p', html: '如果某个参数的相对误差偏大，先看它是否出现在 <code>max</code>、<code>abs</code>、<code>masked_fill</code> 这类不可导或分段可导的位置附近：这些点的数值梯度在两侧不同，中心差分本来就会失真。排除这些位置之后仍然不通过，才说明反向实现写错了。' },

    { t: 'terms', items: [
      { en: 'computational graph', zh: '计算图', def: '把张量与运算组织成有向无环图，记录前向依赖以支持反向传播。' },
      { en: 'Jacobian', zh: '雅可比矩阵', def: '向量函数对所有输入分量的偏导组成的矩阵。' },
      { en: 'vector-Jacobian product', zh: '向量-雅可比积', def: '给定上游梯度直接算下游梯度，避免构造完整雅可比。' },
      { en: 'leaf tensor', zh: '叶子张量', def: '由用户创建、不被其他运算产生的张量，梯度累加在它的 grad 上。' },
      { en: 'gradient clipping', zh: '梯度裁剪', def: '按范数或数值上限缩放梯度，防止爆炸。' },
      { en: 'log-sum-exp', zh: 'log-sum-exp', def: '先减最大值再取指数的稳定计算技巧，用于 softmax 与对数概率。' }
    ] },
    { t: 'quiz', qid: 'ch03-q1' },
    { t: 'quiz', qid: 'ch03-q2' },
    { t: 'quiz', qid: 'ch03-q3' },
    { t: 'keypoint', title: '本章要点', items: [
      { title: '反向即链式法则', html: '前向记录中间量，反向按拓扑逆序做向量-雅可比积。' },
      { title: '四条公式', html: 'δ = g ⊙ φ′(z)；dW = δxᵀ；db = Σδ；dx = Wᵀδ。' },
      { title: 'softmax + CE', html: '联合梯度是 (p - y)/B，框架内部已合并，不要重复 softmax。' },
      { title: '为什么用反向模式', html: '参数多、输出少，一次反向即可得到全部参数梯度。' },
      { title: '诊断梯度', html: '逐层打印梯度范数；消失换激活与初始化，爆炸用裁剪与降学习率。' }
    ] },
    { t: 'checklist', id: 'ch03', items: [
      '能画出两层网络的计算图，并标出反向需要保存的张量',
      '能写出 Linear + ReLU 的四条反向公式并检查形状',
      '能手推 softmax 交叉熵对 logits 的梯度为 (p - y)/B',
      '能用 numpy 或 torch 手写一遍两层网络的反向并与 autograd 对齐',
      '能解释前向模式与反向模式的成本差异，以及深度学习选后者的原因',
      '能说明 zero_grad、retain_graph、no_grad 各自解决什么问题',
      '能用中心差分做梯度检查，并解释 ε 为什么不能太大或太小',
      '能通过逐层梯度范数判断消失还是爆炸，并给出两条对策',
      '知道梯度裁剪的调用方式与适用场景'
    ] },
    { t: 'p', html: '梯度能算出来，只说明「方向有了」。下一步要决定「走多快、走多稳」：学习率怎么设、要不要动量、正则加在哪里。第 4 章把优化器与正则化放在一起讲，因为它们在实验中总是同时出现。' },
    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章覆盖计算图、链式法则与雅可比、反向传播公式、两层网络手推、前向与反向模式自动微分、PyTorch autograd 机制、梯度检查与数值稳定性、梯度消失与爆炸。依据教材《Deep Learning: Foundations and Concepts》中网络训练与反向传播相关主题，以及《Pattern Recognition and Machine Learning》中文版对误差反向传播的推导；数值例子均可复现。' }
  ]
});
