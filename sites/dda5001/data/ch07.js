/* =====================================================================
 * ch07.js · 第 7 章 · 生成模型与端到端实战
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch07',
  num: '07',
  title: '生成模型与端到端实战',
  en: 'GENERATIVE MODELS',
  goals: [
    '区分判别式与生成式目标，说清显式密度与隐式分布两条路线',
    '写出自编码器的重建目标，并解释它为什么不能直接当生成模型',
    '推导 VAE 的变分下界与重参数化技巧，说明 KL 项的作用',
    '比较 GAN 与扩散模型的训练目标、样本质量与稳定性',
    '设计一个端到端项目：数据划分、训练、评估、误差分析与部署监控'
  ],
  kp: [
    { id: 'ch07-1', title: '生成任务与似然' },
    { id: 'ch07-2', title: '自编码器' },
    { id: 'ch07-3', title: 'VAE 与变分下界' },
    { id: 'ch07-4', title: 'GAN 与对抗训练' },
    { id: 'ch07-5', title: '扩散模型' },
    { id: 'ch07-6', title: '评估：FID、IS 与人工判断' },
    { id: 'ch07-7', title: '端到端：从数据到部署' },
    { id: 'ch07-8', title: '伦理、版权与可复现' },
    { id: 'ch07-9', title: '评估与复现自查' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '学会分布，而不只是边界', html: '前面的模型都在学 <code>p(y|x)</code>：给一张图，判断是不是猫。生成模型要学 <code>p(x)</code> 本身：什么样的图才算「像猫」。这个目标更难，因为要刻画整个高维分布；也更有用，因为一旦能采样，就能做补全、超分、翻译、设计。' },
    { t: 'p', lead: true, html: '这一章按「怎么表示分布」把生成模型分成几条路线：自编码器用瓶颈压缩，VAE 给潜变量加概率结构，GAN 用判别器当裁判，扩散模型把生成拆成许多小步去噪。最后回到工程：怎么评估生成质量，怎么把整个流程做成可交付的系统，以及哪些边界不能越过。' },

    { t: 'h', lvl: 2, text: '生成任务与似然', id: 'ch07-1' },
    { t: 'p', html: '生成模型的目标是拟合数据分布 <code>p_data(x)</code>，然后采样 <code>x ~ p_model</code> 或算似然 <code>p_model(x)</code>。前者用于创作与增强，后者用于异常检测与压缩。条件生成再加一个 <code>y</code>，就得到文生图、语音合成这类任务。' },
    { t: 'p', html: '两条路线。显式密度模型写出 <code>p_θ(x)</code> 的解析形式，可以算似然、可以用最大似然训练，包括自回归模型、归一化流、VAE 与扩散模型。隐式模型只给出采样过程，不写密度，代表是 GAN——它无法直接算 <code>p(x)</code>，但采样快、样本锐利。' },
    { t: 'p', html: '高维分布的难点在于归一化常数。图像空间是 <code>256×256×3</code> 维，任何未归一化的能量函数都积不出分母。自回归把联合分布拆成条件概率的乘积，绕开归一化；VAE 用变分下界绕开；扩散模型把生成拆成小步，每步只学一个简单的高斯去噪。' },
    { t: 'table', head: ['模型族', '密度', '训练目标', '采样', '典型问题'], rows: [
      ['自回归', '显式', '最大似然（逐 token）', '逐位生成，慢', '长序列误差累积'],
      ['VAE', '显式下界', 'ELBO', '一次前向，快', '样本偏模糊'],
      ['GAN', '隐式', '对抗损失', '一次前向，快', '模式崩溃、训练不稳'],
      ['扩散', '显式（变分下界）', '去噪回归', '几十到上千步', '采样慢'],
      ['归一化流', '显式', '精确最大似然', '可逆变换', '维度与结构受限']
    ] },

    { t: 'h', lvl: 2, text: '自编码器', id: 'ch07-2' },
    { t: 'p', html: '自编码器由编码器与解码器组成：编码器把输入压成低维表示 <code>z</code>，解码器从 <code>z</code> 重建输入，损失是重建误差。它不需要标签，是自监督学习的基本形态。瓶颈迫使模型保留最重要的信息，去掉噪声与冗余。' },
    { t: 'p', html: '但普通自编码器不是生成模型。它只保证「训练样本能被重建」，潜空间里没见过的点解码出来可能是无意义的图。要让潜空间连续、可采样，必须给 <code>z</code> 一个先验分布，并让编码分布靠近它——这正是 VAE 做的事。' },
    { t: 'p', html: '变体还有去噪自编码器（输入加噪、重建干净图）、稀疏自编码器（对激活加 L1）、掩码自编码器（遮住部分输入再重建）。它们的目标都是学到有用的表示，而不是生成；在预训练与异常检测里仍然常用。' },
    { t: 'code', lang: 'python', caption: '最小自编码器：瓶颈维度决定压缩程度', code: `import torch
from torch import nn

class AutoEncoder(nn.Module):
    def __init__(self, in_dim=784, latent=32):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(in_dim, 256), nn.ReLU(),
            nn.Linear(256, latent))
        self.decoder = nn.Sequential(
            nn.Linear(latent, 256), nn.ReLU(),
            nn.Linear(256, in_dim), nn.Sigmoid())

    def forward(self, x):
        z = self.encoder(x)
        return self.decoder(z), z

model = AutoEncoder()
x = torch.rand(64, 784)
recon, z = model(x)
loss = nn.functional.mse_loss(recon, x)
print(recon.shape, z.shape, float(loss))   # (64,784) (64,32)` },
    { t: 'p', html: '瓶颈维度是超参：太小则欠拟合，重建模糊；太大则模型直接抄过去，学不到结构。常见做法是从 32 或 64 起，看重建误差与下游任务表现再调。训练完只看重建 loss 不够，还要把 <code>z</code> 画出来，确认类别在潜空间里分开了。' },

    { t: 'h', lvl: 2, text: 'VAE 与变分下界', id: 'ch07-3' },
    { t: 'p', html: 'VAE 假设数据由潜变量生成：先采 <code>z ~ N(0, I)</code>，再由 <code>p_θ(x|z)</code> 生成 <code>x</code>。真正的后验 <code>p(z|x)</code> 不可算，于是用编码器 <code>q_φ(z|x)</code> 去近似它。两者之间的 KL 距离无法直接最小化，转而最大化证据下界（ELBO）。' },
    { t: 'p', html: 'ELBO 有两项：<code>E_q[log p(x|z)]</code> 是重建项，鼓励解码器还原输入；<code>-KL(q(z|x) || p(z))</code> 是正则项，鼓励编码分布靠近标准正态。两项相互拉扯：只优化重建，潜空间会散开；只优化 KL，解码器学不到东西。' },
    { t: 'p', html: '重参数化是让 VAE 能训练的关键。直接从 <code>N(μ, σ²)</code> 采样不可导，改为 <code>z = μ + σ ⊙ ε</code>，其中 <code>ε ~ N(0, I)</code>。随机性被移到不参与求导的 <code>ε</code> 上，梯度可以正常流过 <code>μ</code> 与 <code>σ</code>。没有这一步，反向传播在采样节点就断了。' },
    { t: 'code', lang: 'python', caption: 'VAE 的重参数化与损失（高斯先验下的闭式 KL）', code: `import torch
from torch import nn
import torch.nn.functional as F

class VAE(nn.Module):
    def __init__(self, in_dim=784, hidden=256, latent=16):
        super().__init__()
        self.fc1 = nn.Linear(in_dim, hidden)
        self.mu = nn.Linear(hidden, latent)
        self.logvar = nn.Linear(hidden, latent)
        self.fc2 = nn.Linear(latent, hidden)
        self.fc3 = nn.Linear(hidden, in_dim)

    def encode(self, x):
        h = F.relu(self.fc1(x))
        return self.mu(h), self.logvar(h)

    def forward(self, x):
        mu, logvar = self.encode(x)
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        z = mu + std * eps                  # 重参数化
        recon = torch.sigmoid(self.fc3(F.relu(self.fc2(z))))
        kl = -0.5 * (1 + logvar - mu.pow(2) - logvar.exp()).sum(1)
        rec = F.binary_cross_entropy(recon, x, reduction='none').sum(1)
        return recon, (rec + kl).mean()      # 负 ELBO` },
    { t: 'p', html: '实践中还有一个坑叫后验坍塌（posterior collapse）：KL 项太强，编码器干脆输出先验，<code>z</code> 不含信息，解码器只能靠自身先验生成。表现为重建尚可但样本单调。缓解办法有 KL 退火（训练初期给 KL 小权重，逐步加大）、free bits，或换更强的解码器。' },

    { t: 'h', lvl: 2, text: 'GAN 与对抗训练', id: 'ch07-4' },
    { t: 'p', html: 'GAN 用一个生成器 <code>G</code> 与一个判别器 <code>D</code> 对抗：<code>G</code> 把噪声变成样本，<code>D</code> 判断输入是真实还是生成。目标是 <code>min_G max_D E[log D(x)] + E[log(1 - D(G(z)))]</code>。理想情况下 <code>D</code> 的输出处处是 0.5，生成分布与真实分布重合。' },
    { t: 'p', html: '训练难点有两个。模式崩溃：<code>G</code> 发现某几个样本最能骗过 <code>D</code>，就反复生成它们，多样性丢失。训练不稳：<code>D</code> 太强则 <code>G</code> 的梯度消失，<code>D</code> 太弱则 <code>G</code> 没有有效信号，两者的平衡很脆弱。' },
    { t: 'p', html: '改进方向包括：把 JS 散度换成 Wasserstein 距离（WGAN），加梯度惩罚（WGAN-GP）稳定 Lipschitz 约束；用谱归一化限制 <code>D</code> 的 Lipschitz 常数；用 TTUR 让 <code>G</code> 与 <code>D</code> 用不同学习率。StyleGAN 系列则从架构上解耦风格与噪声，把样本质量推到很高。' },
    { t: 'compare', left: { title: 'GAN 的取舍', html: '一次前向即可采样，快；样本锐利；不需要显式密度。但训练不稳、容易模式崩溃、无法算似然，评估只能靠间接指标。' }, right: { title: '扩散的取舍', html: '训练目标简单稳定（回归去噪）；样本质量与多样性好；有似然下界。但采样要几十到上千步，推理成本高，需要蒸馏或快速采样器加速。' } },

    { t: 'h', lvl: 2, text: '扩散模型', id: 'ch07-5' },
    { t: 'p', html: '扩散模型分两个过程。前向过程逐步加高斯噪声，<code>q(x_t|x_{t-1}) = N(√(1-β_t) x_{t-1}, β_t I)</code>，经过 T 步后数据变成近似标准正态。反向过程学一个网络，从纯噪声逐步去噪，恢复出样本。' },
    { t: 'p', html: '训练目标可以化简成「预测噪声」：给一张图和一个随机时间步 <code>t</code>，加噪得到 <code>x_t</code>，让网络预测所加的噪声 <code>ε</code>，损失是均方误差。这个目标简单到只有一行代码，却是 DDPM 效果好的关键——它把生成拆成许多容易学的局部去噪问题。' },
    { t: 'p', html: '采样时从 <code>x_T ~ N(0, I)</code> 出发，逐步减去预测的噪声并加回少量随机性，直到 <code>x_0</code>。步数多则慢，于是有 DDIM 这样的确定性采样器，几十步就能出图；潜空间扩散（LDM）先把图像压到低维潜空间再扩散，把计算量降一个数量级。' },
    { t: 'code', lang: 'python', caption: '扩散的加噪与训练损失（预测噪声）', code: `import torch

def linear_beta_schedule(T=1000, beta_start=1e-4, beta_end=0.02):
    return torch.linspace(beta_start, beta_end, T)

T = 1000
betas = linear_beta_schedule(T)
alphas = 1.0 - betas
alpha_bar = torch.cumprod(alphas, dim=0)

def q_sample(x0, t, noise):
    # 直接把 x0 加噪到第 t 步，不必逐步循环
    a = alpha_bar[t].view(-1, 1, 1, 1)
    return a.sqrt() * x0 + (1 - a).sqrt() * noise

x0 = torch.randn(2, 3, 32, 32)
t = torch.tensor([10, 999])
eps = torch.randn_like(x0)
xt = q_sample(x0, t, eps)
loss = ((eps - xt * 0.1) ** 2).mean()   # 示意：真实中由网络预测 eps
print(xt.shape, float(loss))` },
    { t: 'p', html: '注意 <code>q_sample</code> 用了累积乘积 <code>ᾱ_t</code>，可以一步跳到任意时刻，训练时不必真的加 <code>t</code> 次噪声。这是扩散训练高效的原因。反过来，采样必须逐步走，因为每一步都要用网络预测当前噪声，无法并行。' },

    { t: 'h', lvl: 2, text: '评估：FID、IS 与人工判断', id: 'ch07-6' },
    { t: 'p', html: '生成质量没有单一指标。Inception Score（IS）用预训练分类器算「每张图是否清晰」与「类别是否多样」，但它只关心 ImageNet 类别，与真实数据分布无关，甚至对记忆训练样本的模型给高分。' },
    { t: 'p', html: 'FID 把真实图与生成图分别送进 Inception 提取特征，拟合两个高斯分布，算它们之间的 Frechet 距离。FID 越低越好，既考虑质量也考虑多样性，是目前最常用的指标。但它依赖特征提取器，样本量小时估计有偏，不同实现之间不能直接比。' },
    { t: 'p', html: '更细的分析用 precision 与 recall：precision 衡量生成样本有多少落在真实分布内（质量），recall 衡量真实分布有多少被覆盖（多样性）。两者分开看，才能区分「图很清晰但只生成一类」与「多样但模糊」。最终仍需人工评估，尤其是文本对齐与美感这类指标算不出的维度。' },
    { t: 'table', head: ['指标', '衡量什么', '方向', '局限'], rows: [
      ['IS', '清晰度 + 类别多样性', '越高越好', '与真实分布无关，可被记忆欺骗'],
      ['FID', '特征分布的 Frechet 距离', '越低越好', '依赖 Inception，样本少时有偏'],
      ['Precision', '生成样本的质量', '越高越好', '不反映覆盖'],
      ['Recall', '对真实分布的覆盖', '越高越好', '不反映质量'],
      ['人工评估', '对齐、美感、可用性', '主观', '成本高、难复现']
    ] },
    { t: 'callout', kind: 'warn', title: '不要跨论文比 FID', html: 'FID 依赖特征提取器版本、图像缩放方式、样本数量与随机种子。两个模型只有在同一套评测代码、同一份真实样本、同样的样本量下比较才有意义。看到「我们的 FID 比 SOTA 低 0.3」，先问评测协议是否一致。' },

    { t: 'h', lvl: 2, text: '端到端：从数据到部署', id: 'ch07-7' },
    { t: 'p', html: '一个可交付的项目有固定骨架：明确任务与指标 → 数据划分与预处理 → 建立基线 → 训练与调参 → 评估与误差分析 → 导出与部署 → 监控与迭代。每一步都要留下可复现的记录，否则调参就是碰运气。' },
    { t: 'p', html: '数据划分要在最开始固定，测试集只在最后用一次。预处理（归一化、分词、增强）必须与训练一致地应用到推理。基线优先选最简单的方案：逻辑回归或小 CNN，先确认数据与标签没有问题，再上复杂模型。' },
    { t: 'p', html: '误差分析比调参更有价值。把错例按类别、置信度、图像质量分组，找出系统性的失败模式：是某些类别总被混淆，还是低光照样本普遍失败？针对失败模式做数据补充或结构调整，比盲目加层数有效得多。' },
    { t: 'p', html: '部署要考虑延迟、显存与批量。训练用 float32，推理可以量化到 int8 或半精度；大模型用蒸馏或剪枝。上线后监控输入分布漂移与预测分布变化，设置回滚机制。模型不是交付即完成，而是一个需要维护的组件。' },
    { t: 'table', head: ['阶段', '关键动作', '产出', '常见失误'], rows: [
      ['定义', '任务、指标、约束', '一页问题说明', '指标与业务目标脱节'],
      ['数据', '划分、清洗、预处理', '可复现的数据管道', '预处理训练推理不一致'],
      ['基线', '最简单可行模型', '基线指标', '跳过基线直接上大模型'],
      ['训练', '调参、正则、早停', '模型与日志', '用测试集调参'],
      ['评估', '整体指标 + 分组误差', '误差分析报告', '只看一个平均数'],
      ['部署', '导出、量化、监控', '服务与告警', '忽略分布漂移']
    ] },

    { t: 'h', lvl: 2, text: '伦理、版权与可复现', id: 'ch07-8' },
    { t: 'p', html: '生成模型会记忆训练数据。扩散模型可能复现训练图的部分像素，语言模型可能逐字吐出训练文本。数据来源的授权、肖像与商标的使用、生成内容的标识，都是必须提前处理的合规问题，而不是上线后再补。' },
    { t: 'p', html: '偏见同样会被放大。训练数据里某一群体样本少，模型在该群体上的误差就高；生成模型还会把刻板印象具象化。缓解手段包括数据平衡、分组评估、输出过滤与人工审核，但没有任何一种能完全消除，需要明确责任边界。' },
    { t: 'p', html: '可复现是工程底线：固定随机种子、记录配置与依赖版本、保存数据切分、记录硬件与训练时长。深度学习的结果对种子敏感，一次跑出的提升可能只是噪声。至少跑三个种子取均值与方差，再判断改动是否有效。' },
    { t: 'p', html: '最后是使用边界。生成模型适合辅助创作、数据增强、原型探索；不适合在无审核的情况下生成新闻、法律意见或医疗建议。把模型的置信度、局限与失败模式写进文档，是对使用者最基本的负责。' },

    { t: 'h', lvl: 2, text: '评估与复现自查', id: 'ch07-9' },
    { t: 'p', html: '生成模型的评估比分类更容易自欺：指标好看但样本崩坏、用训练集算 FID、换了随机种子结果差一大截。下面这张表把高频陷阱集中起来，后面一段代码演示如何在同一次采样里同时看指标与样本。' },
    { t: 'table', head: ['陷阱', '为什么错', '正确做法'], rows: [
      ['在训练集上算 FID', '模型见过这些样本，分数虚高', '固定一份与训练集不重叠的参考集'],
      ['只报一个种子', '生成模型方差大，单次结果可能只是运气', '至少三个种子，报均值与标准差'],
      ['跨论文比 FID', '特征提取器、样本量、预处理不同，数值不可比', '只在同一 pipeline 内比较'],
      ['只看 FID 不看样本', 'FID 对局部崩坏不敏感', '固定网格采样，人眼过一遍'],
      ['采样温度写死', '温度改变多样性与保真度的权衡', '报告温度并做一组对比']
    ] },
    { t: 'code', lang: 'python', caption: '固定种子采样 + 温度对比 + 指标与样本一起记录', code: `import torch

@torch.no_grad()
def sample(model, n, temperature=1.0, seed=0):
    g = torch.Generator().manual_seed(seed)
    z = torch.randn(n, model.latent_dim, generator=g) * temperature
    return model.decode(z)

report = {}
for temp in [0.7, 1.0, 1.3]:
    for seed in [0, 1, 2]:
        imgs = sample(model, 64, temp, seed)
        report[(temp, seed)] = {
            'mean': imgs.mean().item(),
            'std': imgs.std().item(),
            'finite': torch.isfinite(imgs).all().item(),
        }

# 同一份报告里既有指标也有可复现的采样条件
for k, v in report.items():
    print(k, {kk: round(vv, 4) if isinstance(vv, float) else vv for kk, vv in v.items()})

# 保存固定网格，供人眼复核
grid = sample(model, 16, 1.0, 0)
print('保存样本', tuple(grid.shape))` },
    { t: 'p', html: '一个小技巧：把「采样条件」当作实验配置的一部分写进报告——模型版本、种子、温度、样本数、参考集指纹。评审或复审时，只要这五项一致，结果就能被任何人复现；缺一项，数字就只能当作传闻。' },
    { t: 'callout', kind: 'tip', title: '报告的最后一页', html: '留一页写清楚：数据来源与许可、模型规模与训练成本、已知失败模式、不适用的场景。这一页往往比指标更能体现你是否真正理解手里的模型。' },

    { t: 'terms', items: [
      { en: 'ELBO', zh: '证据下界', def: '对数似然的下界，等于重建项减去 KL 项，VAE 的优化目标。' },
      { en: 'reparameterization', zh: '重参数化', def: '把采样写成 μ + σ⊙ε，使随机节点可导。' },
      { en: 'mode collapse', zh: '模式崩溃', def: '生成器只产出少数样本、丢失多样性。' },
      { en: 'diffusion', zh: '扩散模型', def: '学习从噪声逐步去噪生成样本的模型族。' },
      { en: 'FID', zh: 'Frechet Inception 距离', def: '真实与生成特征分布之间的距离，越低越好。' },
      { en: 'distribution shift', zh: '分布漂移', def: '部署后输入分布变化，导致模型性能下降。' }
    ] },
    { t: 'quiz', qid: 'ch07-q1' },
    { t: 'quiz', qid: 'ch07-q2' },
    { t: 'quiz', qid: 'ch07-q3' },
    { t: 'keypoint', title: '本章要点', items: [
      { title: '两条路线', html: '显式密度可算似然（VAE、扩散、自回归），隐式分布只给采样（GAN）。' },
      { title: 'VAE 损失', html: '负 ELBO = 重建误差 + KL(q(z|x)||N(0,I))；重参数化让采样可导。' },
      { title: 'GAN 难点', html: '模式崩溃与训练不稳；WGAN、谱归一化、TTUR 是常见补救。' },
      { title: '扩散训练', html: '随机时间步加噪，网络预测噪声，损失是 MSE；采样需逐步去噪。' },
      { title: '评估', html: 'FID 越低越好，但不能跨协议比较；precision/recall 分开看质量与覆盖。' }
    ] },
    { t: 'checklist', id: 'ch07', items: [
      '能区分判别式与生成式目标，并各举一个应用',
      '能说出显式密度与隐式分布的代表模型及取舍',
      '能写出自编码器的重建损失，并解释它为什么不是生成模型',
      '能推导 ELBO 的两项，说明 KL 项过强会导致后验坍塌',
      '能写出重参数化公式，解释它为什么让梯度可以通过采样',
      '能说明 GAN 的对抗目标与模式崩溃的成因',
      '能描述扩散的前向加噪与反向去噪，写出预测噪声的损失',
      '能比较 FID、IS、precision/recall 的适用与局限',
      '能列出端到端项目的七个阶段与各阶段常见失误',
      '知道生成模型的版权、偏见与可复现风险，并能说出至少两条缓解措施'
    ] },
    { t: 'p', html: '八章走完，从「什么是概率损失」到「如何把一个生成模型交付上线」。真正的掌握不在于记住每个公式，而在于遇到新问题时能判断：该用哪种结构、损失怎么配、梯度从哪来、怎么验证它真的有效。' },
    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章覆盖生成任务与似然、自编码器、VAE 的变分下界与重参数化、GAN 的对抗训练与模式崩溃、扩散模型的前向与反向过程、FID/IS/精确率召回率评估、端到端项目流程、伦理版权与可复现。依据教材《Deep Learning: Foundations and Concepts》中生成模型相关主题，以及《Pattern Recognition and Machine Learning》中文版对隐变量模型与变分推断的讨论；指标数值与模型规模为公开资料的近似描述。' }
  ]
});
