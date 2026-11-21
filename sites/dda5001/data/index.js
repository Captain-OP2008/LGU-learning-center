/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * 说明：title 必须与 data/chXX.js 里的 title 逐字一致。
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：深度学习在解决什么问题', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先摊开整门课的地图：深度学习解决哪类问题、八章之间怎么依赖、三条主线如何交织，以及本站怎么用。' },
  { id: 'ch01', num: '01', title: '概率视角：从最大似然到交叉熵', en: 'PROBABILITY & LOSS', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'function', labs: 1,
    blurb: '从最大似然推出平方误差与交叉熵，看清 softmax 回归就是一个概率模型，并用 log-sum-exp 把它写稳。' },
  { id: 'ch02', num: '02', title: '多层网络：结构、激活与表示能力', en: 'MULTILAYER NETWORKS', part: 'Part II · 基础', week: 4, minutes: 100, icon: 'layers', labs: 1,
    blurb: '从 XOR 出发理解为什么需要隐藏层，比较激活函数，学会参数计数、形状推演与正确的初始化。' },
  { id: 'ch03', num: '03', title: '反向传播与自动微分', en: 'BACKPROP & AUTOGRAD', part: 'Part III · 深入', week: 6, minutes: 110, icon: 'repeat', labs: 1,
    blurb: '把计算图、链式法则与四条反向公式讲透，手推两层网络梯度，再用 autograd 与梯度检查核对。' },
  { id: 'ch04', num: '04', title: '网络训练：优化、正则与调参', en: 'NETWORK TRAINING', part: 'Part III · 深入', week: 8, minutes: 110, icon: 'chart', labs: 1,
    blurb: 'SGD 到 Adam 的取舍、学习率调度、L2/dropout/归一化，以及一套可复现的调参与诊断流程。' },
  { id: 'ch05', num: '05', title: '卷积网络：权值共享与视觉表示', en: 'CONVOLUTIONAL NETWORKS', part: 'Part III · 深入', week: 10, minutes: 110, icon: 'grid', labs: 1,
    blurb: '从输出尺寸与感受野算起，看 LeNet 到 ResNet 的设计演化，再做增强、迁移与可视化。' },
  { id: 'ch06', num: '06', title: '序列建模与注意力机制', en: 'SEQUENCES & ATTENTION', part: 'Part IV · 综合', week: 12, minutes: 120, icon: 'zap', labs: 1,
    blurb: 'RNN、LSTM 到 Transformer：为什么注意力取代循环，位置编码与掩码各自解决什么问题。' },
  { id: 'ch07', num: '07', title: '生成模型与端到端实战', en: 'GENERATIVE MODELS', part: 'Part IV · 综合', week: 14, minutes: 120, icon: 'rocket', labs: 1,
    blurb: '自编码器、VAE、GAN 与扩散模型的统一视角，加上评估、部署与伦理，把全书收成一条完整流水线。' }
]);
