/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'dda5001',
  short: 'DDA5001',
  name: '深度学习',
  en: 'Deep Learning',
  dept: '统计与数据科学',
  lang: 'python',
  langLabel: 'Python',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'DDA5001 // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... DDA5001',
    '> loading 8 modules ... tensors, graphs, gradients online',
    '> calibrating glossary & quiz bank ... 56 items indexed',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '把「模型为什么能学」拆成可以手算的每一步。',
  missionEn: 'DDA5001 · 8 MODULES',
  missionTitle: '从概率到生成<br><em>深度学习 全链路</em>',
  lede: '先建立整门课的地图，再逐章推进：每个公式都配可运行代码，每个结构都配形状推演与对比表，' +
    '每章结尾有自检清单、内嵌练习与完整题库——目标是把「调包」变成「知道自己在调什么」。',
  searchPlaceholder: 'QUERY // 搜索章节、术语、公式与题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/DDA5001/',
  resources: {
    note: '本站公开资料只收录两份课程指定的英文与中文教材（PDF），正文中的主题引用均以这两本书为口径；' +
      '课件、作业与考试材料未包含在资料库中，请以课程平台发布为准。',
    groups: [
      { name: '教材与参考书', note: '两本书覆盖全课程：英文版讲基础与概念，中文版对应模式识别与机器学习的经典推导，可对照阅读。', items: [
        { title: 'Deep Learning: Foundations and Concepts', path: '学习资料/DDA5001_Deep_Learning_Foundations_and_Concepts.pdf', kind: 'pdf',
          note: 'Bishop & Bishop。概率视角、多层网络、反向传播、卷积与序列模型的英文主线教材。' },
        { title: '模式识别与机器学习（中文版）', path: '学习资料/DDA5001_模式识别与机器学习_中文版.pdf', kind: 'pdf',
          note: 'Bishop。最大似然、指数族、线性模型与变分推断的中文译本，适合补齐 ch01 与 ch07 的推导。' }
      ] }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '深度学习（Deep Learning），统计与数据科学系 DDA5001'],
    ['来源', 'CUHKSZ DDA5001 课程资料；教材为 Bishop 两本'],
    ['结构', '8 章正文 · 56 题分章题库 · 模拟卷 A · 3 个实战项目 · 速查表'],
    ['建议', '先读第 0 章建立地图；ch01 的概率视角与 ch03 的反向传播务必动手推导一遍。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    { label: '损失与梯度', blocks: [
      { t: 'table', head: ['任务', '输出层', '损失', '对 logits 的梯度'], rows: [
        ['回归', '线性（1 维）', '<code>MSE = (y - ŷ)²</code>', '<code>2(ŷ - y)</code>'],
        ['二分类', 'sigmoid（1 维）', '<code>BCE = -[y log p + (1-y) log(1-p)]</code>', '<code>p - y</code>'],
        ['多分类', 'softmax（K 维）', '<code>CE = -log p_y</code>', '<code>p - onehot(y)</code>'],
        ['多标签', 'sigmoid（K 维）', 'K 个 BCE 求和', '逐维 <code>p_k - y_k</code>']
      ], caption: 'softmax + 交叉熵、sigmoid + BCE 的梯度都化简成「预测减标签」，这是框架把两者打包在一起的原因' },
      { t: 'table', head: ['量', '定义', '记忆点'], rows: [
        ['信息量', '<code>-log p</code>', '概率越小，事件发生带来的信息越大'],
        ['熵', '<code>H(p) = -Σ p log p</code>', '分布本身的不确定度，与模型无关'],
        ['交叉熵', '<code>H(p,q) = -Σ p log q</code>', '用 q 编码 p 的平均码长'],
        ['KL 散度', '<code>KL(p||q) = H(p,q) - H(p)</code>', '非负、不对称；最小化 CE 等价于最小化 KL']
      ], caption: '考试常问「CE 与 KL 差什么」：差一个只依赖数据的 H(p)，所以优化时二者同解' },
      { t: 'callout', kind: 'warn', title: '两个必须避开的数值坑',
        html: '一、<code>softmax</code> 前先减行最大值，否则 <code>exp(1000)</code> 溢出为 inf；' +
          '二、交叉熵里不要先算 <code>log(softmax(x))</code>，直接用 <code>log_softmax</code> + <code>NLLLoss</code>，' +
          '否则小概率会被截断成 0，梯度变成 NaN。' }
    ] },

    { label: '形状与参数量', blocks: [
      { t: 'table', head: ['层', '输入', '输出', '参数量'], rows: [
        ['Linear', '<code>(B, d_in)</code>', '<code>(B, d_out)</code>', '<code>d_in·d_out + d_out</code>'],
        ['Conv2d', '<code>(B, C_in, H, W)</code>', '<code>(B, C_out, H\', W\')</code>', '<code>K²·C_in·C_out + C_out</code>'],
        ['BatchNorm2d', '<code>(B, C, H, W)</code>', '同形状', '<code>2C</code>（γ、β）'],
        ['MaxPool2d(2)', '<code>(B, C, H, W)</code>', '<code>(B, C, H/2, W/2)</code>', '0'],
        ['Embedding', '<code>(B, T)</code> 整数', '<code>(B, T, d)</code>', '<code>V·d</code>']
      ], caption: '卷积参数量与输入分辨率无关，只与核大小和通道数有关——这是它比全连接省参数的根本原因' },
      { t: 'table', head: ['公式', '写法', '例子'], rows: [
        ['卷积输出尺寸', '<code>floor((H + 2P - K)/S) + 1</code>', '224, K7, P3, S2 → 112'],
        ['感受野', '每层 <code>+ (K-1)·jump</code>', '三个 3×3 → 7×7'],
        ['自注意力计算量', '<code>O(T²·d)</code>', 'T 翻倍，注意力部分贵 4 倍'],
        ['缩放点积', '<code>q·k / √d_k</code>', '把点积方差拉回 1，防 softmax 饱和']
      ], caption: '形状推演先写 batch 维再写特征维；参数量最后统一加偏置，别在中间漏掉' },
      { t: 'callout', kind: 'tip', title: '初始化速记',
        html: '<code>Xavier</code>（tanh/sigmoid）方差按 <code>2/(fan_in+fan_out)</code>；' +
          '<code>He</code>（ReLU）按 <code>2/fan_in</code>。原则只有一条：让每层输出的方差大致保持不变。' }
    ] },

    { label: '训练与调参', blocks: [
      { t: 'table', head: ['优化器', '更新要点', '适用场景', '主要超参'], rows: [
        ['SGD', '<code>w -= lr·g</code>', '大 batch、追求极致泛化', 'lr、momentum'],
        ['Momentum', '累积历史梯度', '地形狭长、震荡明显', 'lr、β=0.9'],
        ['RMSProp', '按梯度平方的滑动平均缩放', '非平稳目标、RNN', 'lr、β=0.9、ε'],
        ['Adam', '动量 + 二阶矩，偏差校正', '默认首选、稀疏梯度', 'lr=3e-4、β=(0.9,0.999)'],
        ['AdamW', 'Adam + 解耦权重衰减', 'Transformer 等大模型', 'lr、weight_decay=0.01']
      ], caption: 'Adam 收敛快但泛化有时略差；比赛里常见「Adam 预热 + SGD 收尾」的组合' },
      { t: 'table', head: ['症状', '先查什么', '常用处方'], rows: [
        ['训练损失不降', '学习率、标签对齐、损失与输出层是否配对', '调小/调大 lr，跑一次单批过拟合'],
        ['训练降验证升', '数据划分、增强强度、模型容量', '早停、weight decay、dropout、加数据'],
        ['损失变 NaN', 'log(0)、除零、梯度爆炸', 'log_softmax、梯度裁剪、混合精度缩放'],
        ['准确率卡住', '学习率过大、BN 统计量、类别不平衡', 'warmup + 余弦、检查 eval/train 模式']
      ], caption: '调参顺序：先保证能过拟合一个小批（容量与实现无误），再谈正则与泛化' },
      { t: 'callout', kind: 'warn', title: '三个最常见的隐性错误',
        html: '一、验证集参与了标准化或调参（数据泄漏）；二、忘了 <code>optimizer.zero_grad()</code>，梯度累加；' +
          '三、评估时没切 <code>model.eval()</code>，dropout 与 BN 仍在训练模式。' }
    ] },

    { label: '考试答题模板', blocks: [
      { t: 'table', head: ['题型', '答题结构', '踩分点'], rows: [
        ['计算题（尺寸/参数/感受野）', '写公式 → 代数 → 结果带单位', '公式 1 分、代入 1 分、结果 1 分'],
        ['推导题（梯度/KL）', '定义 → 展开 → 化简 → 结论', '每步等号要成立，跳步容易丢分'],
        ['解释题（为什么）', '机制一句话 → 反例/对比 → 后果', '先说机制，再补「如果不这样会怎样」'],
        ['设计题（选结构/调参）', '约束 → 方案 → 代价', '给出取舍理由，不只报一个选择'],
        ['读代码题', '手算关键步 → 写输出 → 标注形状', '输出逐字对齐，数字保留题目要求位数']
      ], caption: '简答题按关键词给分：每个要点单独成句，不要写成一大段让阅卷人自己找' },
      { t: 'table', head: ['常考对比', '一句话结论'], rows: [
        ['BN vs LN', 'BN 沿 batch 归一化、推理用滑动统计；LN 沿特征归一化、训练推理一致，适合变长序列'],
        ['GAN vs 扩散', 'GAN 一步生成、训练不稳易模式崩溃；扩散多步采样、训练稳定但慢'],
        ['RNN vs 注意力', 'RNN 串行、长程依赖衰减；注意力并行、路径长度 O(1)，代价是 O(T²)'],
        ['L1 vs L2', 'L1 稀疏、可做特征选择；L2 平滑、闭式解友好、对大权重惩罚更强']
      ], caption: '对比题先给结论再给一句机制，两句话就能拿满，不要铺陈背景' },
      { t: 'callout', kind: 'exam', title: '时间分配建议（90 分钟卷）',
        html: '选择与判断 20 分钟、填空与计算 25 分钟、读代码 20 分钟、简答 25 分钟；' +
          '留 5 分钟检查单位、形状与「是否要求保留三位小数」。卡住超过 3 分钟的题先跳过。' }
    ] }
  ]
};
