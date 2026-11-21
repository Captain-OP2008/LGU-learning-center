/* =====================================================================
 * quiz.js · PSY1020 题库
 * 8 章 × 7 题 = 56 题；每题带 explain，内嵌 quiz 只引用每章 q1–q3。
 * type 仅用 mcq / tf / multi 三种，选项 correct 标记唯一（multi 为多个）。
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '下列哪一项属于推断统计（inferential statistics）的工作？',
        options: [
          { text: '用样本均值估计总体均值并给出置信区间', correct: true },
          { text: '画一张频数分布直方图', correct: false },
          { text: '计算一组分数的标准差', correct: false },
          { text: '把原始分数整理成频数表', correct: false }
        ],
        explain: '推断统计用样本信息对总体下结论，估计与置信区间是典型代表；其余三项都只是描述当前样本。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '总体参数通常用希腊字母表示，样本统计量通常用拉丁字母表示。',
        options: [
          { text: '对', correct: true },
          { text: '错', correct: false }
        ],
        explain: '这是统计记号的基本约定，例如总体均值 μ 与样本均值 M，总体标准差 σ 与样本标准差 SD。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['process'],
        stem: '拿到一份新数据后，下列哪一步最应该先做？',
        options: [
          { text: '画图并检查数据分布、缺失与异常值', correct: true },
          { text: '立刻跑独立样本 t 检验', correct: false },
          { text: '先写结果段的结论', correct: false },
          { text: '先做多重比较校正', correct: false }
        ],
        explain: '先看数据才能判断该用什么检验、假设是否满足；跳过这一步直接跑检验是后面许多错误的源头。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['interpret'],
        stem: '关于 p 值与效应量的关系，下列说法正确的是？',
        options: [
          { text: 'p 值小不必然意味着效应大，大样本下很小的效应也可能显著', correct: true },
          { text: 'p 值越小，效应量一定越大', correct: false },
          { text: '效应量大就一定显著', correct: false },
          { text: '两者是同一个概念的不同写法', correct: false }
        ],
        explain: '显著性受样本量影响，效应量描述差异大小；两者互补，报告时都要给。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '置信区间比单独的点估计提供了更多关于估计不确定性的信息。',
        options: [
          { text: '对', correct: true },
          { text: '错', correct: false }
        ],
        explain: '置信区间同时给出估计值与精度，宽度反映不确定性，比只报一个均值或差值更有信息量。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['tool'],
        stem: '本课程建议使用的主要分析工具组合是？',
        options: [
          { text: 'SPSS 与 Python（或 R）', correct: true },
          { text: '只用 Excel 手工计算', correct: false },
          { text: '只用计算器', correct: false },
          { text: '只用 AMOS', correct: false }
        ],
        explain: '课程以 SPSS 的菜单操作入门，同时用 Python 或 R 做可复算的脚本分析，两者互补。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '假设检验中，当 H₀ 为真却拒绝了它，这属于？',
        options: [
          { text: '第一类错误（α 错误）', correct: true },
          { text: '第二类错误（β 错误）', correct: false },
          { text: '效应量过大', correct: false },
          { text: '抽样偏差', correct: false }
        ],
        explain: 'H₀ 为真而拒绝是假阳性，即第一类错误；H₀ 为假而未拒绝才是第二类错误。'
      },

      /* ---------------- ch01 描述统计 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '摄氏温度属于哪一种测量尺度？',
        options: [
          { text: '等距尺度（interval）', correct: true },
          { text: '称名尺度（nominal）', correct: false },
          { text: '顺序尺度（ordinal）', correct: false },
          { text: '等比尺度（ratio）', correct: false }
        ],
        explain: '摄氏温度有相等单位但没有绝对零点，0 度不表示没有温度，因此是等距尺度。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '在偏态分布中，均值通常比中位数更容易被极端值拉向一侧。',
        options: [
          { text: '对', correct: true },
          { text: '错', correct: false }
        ],
        explain: '均值使用每个分数的数值，极端值影响很大；中位数只看位置，因此更稳健。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['compute'],
        stem: '数据 2, 4, 4, 4, 5, 5, 7, 9 的中位数是多少？',
        options: [
          { text: '4.5', correct: true },
          { text: '4', correct: false },
          { text: '5', correct: false },
          { text: '4.75', correct: false }
        ],
        explain: '共 8 个数，排序后取第 4 与第 5 个（4 和 5）的平均，得到 4.5。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '标准差与方差的关系是？',
        options: [
          { text: '标准差是方差的平方根，单位与原始分数一致', correct: true },
          { text: '方差是标准差的平方根', correct: false },
          { text: '两者完全相同，只是符号不同', correct: false },
          { text: '标准差等于方差除以样本量', correct: false }
        ],
        explain: '方差是离差平方的平均，单位被平方；开方得到标准差，回到原始单位，便于解释。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['interpret'],
        stem: '某人的 z 分数为 +1.5，这意味着？',
        options: [
          { text: '他的分数比均值高 1.5 个标准差', correct: true },
          { text: '他的分数是均值的 1.5 倍', correct: false },
          { text: '有 1.5% 的人比他高', correct: false },
          { text: '他的分数比均值高 1.5 分', correct: false }
        ],
        explain: 'z 分数以标准差为单位，+1.5 表示高于均值 1.5 个标准差，与原始单位无关。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'tf', difficulty: 2, tags: ['tool'],
        stem: 'SPSS 的 Frequencies 过程可以直接输出均值、中位数、标准差、偏度与峰度。',
        options: [
          { text: '对', correct: true },
          { text: '错', correct: false }
        ],
        explain: 'Analyze → Descriptive Statistics → Frequencies 的 Statistics 选项提供这些指标，适合快速描述。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['error'],
        stem: '下列哪种做法属于描述统计中的常见错误？',
        options: [
          { text: '数据严重右偏时只用均值代表典型水平', correct: true },
          { text: '同时报告均值与中位数', correct: false },
          { text: '报告标准差与样本量', correct: false },
          { text: '画直方图检查分布形状', correct: false }
        ],
        explain: '偏态分布中均值会被极端值拉走，不能代表大多数人的水平；应结合中位数与图形描述。'
      },

      /* ---------------- ch02 概率与抽样分布 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['compute'],
        stem: '若事件 A 与 B 互斥，则 P(A 或 B) 等于？',
        options: [
          { text: 'P(A) + P(B)', correct: true },
          { text: 'P(A) × P(B)', correct: false },
          { text: 'P(A) + P(B) − P(A 且 B)', correct: false },
          { text: '1 − P(A) × P(B)', correct: false }
        ],
        explain: '互斥事件不能同时发生，交集概率为 0，加法法则退化为两者概率直接相加。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '标准正态分布中，约 95% 的观测落在什么范围内？',
        options: [
          { text: '均值 ±1.96 个标准差', correct: true },
          { text: '均值 ±1 个标准差', correct: false },
          { text: '均值 ±2.58 个标准差', correct: false },
          { text: '均值 ±3 个标准差', correct: false }
        ],
        explain: '±1.96 SD 对应约 95%，±1 SD 约 68%，±2.58 SD 约 99%。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '标准误（standard error）随样本量增大而减小。',
        options: [
          { text: '对', correct: true },
          { text: '错', correct: false }
        ],
        explain: '标准误等于总体标准差除以样本量的平方根，样本越大，估计越稳定，标准误越小。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '中心极限定理（CLT）主要告诉我们什么？',
        options: [
          { text: '样本量足够大时，样本均值的抽样分布近似正态', correct: true },
          { text: '原始数据一定服从正态分布', correct: false },
          { text: '样本均值一定等于总体均值', correct: false },
          { text: '大样本时不需要报告标准误', correct: false }
        ],
        explain: 'CLT 说的是均值分布，不是原始分数分布；它让 t 与 z 检验在大样本下对总体形状不敏感。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: 't 分布比标准正态分布尾部更厚，主要原因是？',
        options: [
          { text: '用样本标准差估计标准误，引入了额外的不确定性', correct: true },
          { text: 't 分布只适用于小样本，大样本不存在', correct: false },
          { text: 't 分布假设总体均值已知', correct: false },
          { text: 't 分布是偏态分布', correct: false }
        ],
        explain: '分母是估计值而非已知常数，导致更厚的尾部；df 增大时 t 逐渐接近正态。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '二项分布要求每次试验只有两种结果、试验相互独立、成功概率固定。',
        options: [
          { text: '对', correct: true },
          { text: '错', correct: false }
        ],
        explain: '这是二项分布的三个基本条件；违反独立性或概率不固定时，需要改用其他模型。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['error'],
        stem: '下列关于标准误的说法，哪一个是正确的？',
        options: [
          { text: '标准误是统计量（如均值）的抽样分布标准差，不是个体分数的标准差', correct: true },
          { text: '标准误就是样本标准差，两者可以互换', correct: false },
          { text: '标准误越大说明估计越精确', correct: false },
          { text: '标准误只在 t 检验中出现', correct: false }
        ],
        explain: 'SD 描述个体差异，SE 描述统计量的稳定性；混淆两者会严重误读误差棒与置信区间。'
      },

      /* ---------------- ch03 假设检验 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: 'p 值的正确解释是？',
        options: [
          { text: '在 H₀ 为真的前提下，得到当前或更极端结果的概率', correct: true },
          { text: 'H₀ 为真的概率', correct: false },
          { text: 'H₁ 为真的概率', correct: false },
          { text: '结果可重复的概率', correct: false }
        ],
        explain: 'p 值以 H₀ 为条件，描述数据的极端程度，不是假设为真的概率。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'tf', difficulty: 1, tags: ['error'],
        stem: 'p = .03 意味着零假设为真的概率是 3%。',
        options: [
          { text: '对', correct: false },
          { text: '错', correct: true }
        ],
        explain: '这是最常见的误读；p 值是「H₀ 下出现该数据的概率」，不是「H₀ 为真的概率」。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['compute'],
        stem: '双侧检验、α = .05 时，z 的临界值约为？',
        options: [
          { text: '±1.96', correct: true },
          { text: '±1.645', correct: false },
          { text: '±2.58', correct: false },
          { text: '±1.00', correct: false }
        ],
        explain: '双侧各留 2.5%，对应 z = ±1.96；±1.645 是单侧 α = .05 的临界值。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '效应量不变、样本量增大时，统计功效会？',
        options: [
          { text: '增大', correct: true },
          { text: '减小', correct: false },
          { text: '不变', correct: false },
          { text: '先增大后减小', correct: false }
        ],
        explain: '样本量增大使标准误变小，同样的效应更容易被检测到，功效上升。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['interpret'],
        stem: 'Cohen\'s d = 0.2 通常被理解为？',
        options: [
          { text: '小效应', correct: true },
          { text: '中等效应', correct: false },
          { text: '大效应', correct: false },
          { text: '无效应', correct: false }
        ],
        explain: 'Cohen 的经验参照：0.2 小、0.5 中、0.8 大；具体领域应结合实际情况判断。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '同一个双侧检验中，95% 置信区间不包含 0 与 p 小于 .05 通常是等价的。',
        options: [
          { text: '对', correct: true },
          { text: '错', correct: false }
        ],
        explain: '两者都基于同一抽样分布；CI 还额外给出效应大小的可能范围，信息更丰富。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-7', tier: 3, type: 'mcq', difficulty: 3, tags: ['compute'],
        stem: '做 20 次相互独立的检验，每次 α = .05，至少出现一次假阳性的概率约为？',
        options: [
          { text: '64%', correct: true },
          { text: '5%', correct: false },
          { text: '20%', correct: false },
          { text: '95%', correct: false }
        ],
        explain: '1 − .95²⁰ ≈ .642；这就是族错误率膨胀，需要 Bonferroni 或 FDR 等方法控制。'
      },

      /* ---------------- ch04 t 检验 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '单样本 t 检验适用于下列哪种情形？',
        options: [
          { text: '一个样本的均值与一个已知总体均值比较', correct: true },
          { text: '两个独立样本的均值比较', correct: false },
          { text: '三个组的均值比较', correct: false },
          { text: '两个连续变量的相关', correct: false }
        ],
        explain: '单样本 t 检验把样本均值与一个已知常数（总体均值或理论值）比较，df = n − 1。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['compute'],
        stem: '独立样本 t 检验（方差齐性版本）的自由度是？',
        options: [
          { text: 'n₁ + n₂ − 2', correct: true },
          { text: 'n₁ + n₂ − 1', correct: false },
          { text: 'n − 1', correct: false },
          { text: 'n₁ × n₂ − 2', correct: false }
        ],
        explain: '两组各自估计均值用掉一个 df，合并方差共 df = (n₁−1) + (n₂−1) = n₁+n₂−2。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '配对 t 检验通过分析差值控制了个体差异，通常比独立样本 t 更有功效。',
        options: [
          { text: '对', correct: true },
          { text: '错', correct: false }
        ],
        explain: '个体差异在差值中被抵消，误差项变小，同样的效应更容易显著。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['compute'],
        stem: '配对 t 检验的 t 值分子是？',
        options: [
          { text: '差值的均值', correct: true },
          { text: '两组均值之差除以 2', correct: false },
          { text: '两组标准差之差', correct: false },
          { text: '差值的方差', correct: false }
        ],
        explain: 't = 差值均值 / 差值标准误，检验的是「差值的总体均值是否为 0」。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['assumption'],
        stem: 'Levene 检验显著，最恰当的处理是？',
        options: [
          { text: '报告 Welch t 检验，它不要求方差齐性', correct: true },
          { text: '忽略它，继续用 Student t 检验', correct: false },
          { text: '把数据全部取对数后直接做相关', correct: false },
          { text: '删掉方差大的那一组', correct: false }
        ],
        explain: '方差不齐时 Welch 校正更稳健；样本量均衡时 Student t 尚可，但报告 Welch 更稳妥。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 1, type: 'tf', difficulty: 1, tags: ['tool'],
        stem: 'SPSS 的独立样本 t 检验默认同时输出 Levene 检验与两种 t 结果。',
        options: [
          { text: '对', correct: true },
          { text: '错', correct: false }
        ],
        explain: '输出表中「Equal variances assumed」与「not assumed」两行，按 Levene 结果选择读哪一行。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['interpret'],
        stem: 'Cohen\'s d = 0.8 通常被视为？',
        options: [
          { text: '大效应', correct: true },
          { text: '小效应', correct: false },
          { text: '中等效应', correct: false },
          { text: '无法判断，d 不能分级', correct: false }
        ],
        explain: '按 Cohen 的经验参照，0.8 属于大效应；但效应大小最终要结合研究情境解释。'
      },

      /* ---------------- ch05 方差分析 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 2, type: 'mcq', difficulty: 2, tags: ['compute'],
        stem: '四个组两两比较，一共需要做多少次检验？',
        options: [
          { text: '6 次', correct: true },
          { text: '4 次', correct: false },
          { text: '12 次', correct: false },
          { text: '3 次', correct: false }
        ],
        explain: '组合数 C(4,2) = 6；比较次数越多，至少一次假阳性的概率越大。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['interpret'],
        stem: 'F 值接近 1 通常说明？',
        options: [
          { text: '组间变异与组内变异差不多，没有明显处理效应', correct: true },
          { text: '所有组均值完全相等', correct: false },
          { text: '样本量太小', correct: false },
          { text: '方差齐性被违反', correct: false }
        ],
        explain: 'F 是组间均方与组内均方之比，零假设下两者都只反映误差，比值在 1 附近波动。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['compute'],
        stem: '三组、每组 20 人，单因素 ANOVA 的 F 自由度是？',
        options: [
          { text: '(2, 57)', correct: true },
          { text: '(3, 60)', correct: false },
          { text: '(2, 60)', correct: false },
          { text: '(3, 57)', correct: false }
        ],
        explain: 'df_between = k − 1 = 2；df_within = N − k = 60 − 3 = 57。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'tf', difficulty: 2, tags: ['interpret'],
        stem: 'F 检验显著说明所有组两两之间都显著不同。',
        options: [
          { text: '对', correct: false },
          { text: '错', correct: true }
        ],
        explain: 'F 显著只说明「至少有一组不同」，具体哪几组不同要靠事后检验。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['interpret'],
        stem: 'η² = .14 的含义是？',
        options: [
          { text: '自变量解释了因变量约 14% 的变异，属于大效应', correct: true },
          { text: '有 14% 的被试显著', correct: false },
          { text: 'p 值为 .14', correct: false },
          { text: '组间均值差为 14 分', correct: false }
        ],
        explain: 'η² = SS_between/SS_total，是变异解释比例；.14 按经验参照属于大效应。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['assumption'],
        stem: '重复测量 ANOVA 中 Mauchly 检验显著，应该？',
        options: [
          { text: '读 Greenhouse–Geisser 校正后的结果', correct: true },
          { text: '忽略，照读未校正的 p', correct: false },
          { text: '改用独立样本 t 检验', correct: false },
          { text: '删掉一组数据', correct: false }
        ],
        explain: 'Mauchly 显著说明球形假设违反，未校正的 F 偏宽松，应读校正后的 df 与 p。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-6', tier: 3, type: 'mcq', difficulty: 3, tags: ['interpret'],
        stem: '双因素 ANOVA 中交互作用显著，意味着？',
        options: [
          { text: '一个因素的效应随另一个因素的水平而变化', correct: true },
          { text: '两个因素都一定没有主效应', correct: false },
          { text: '两个因素完全独立', correct: false },
          { text: '样本量不足', correct: false }
        ],
        explain: '交互显著说明不能脱离另一个因素单独解释某个因素的效应，需要分水平看简单效应。'
      },

      /* ---------------- ch06 相关与回归 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['interpret'],
        stem: 'r = −.60 表示？',
        options: [
          { text: '中等偏强的负相关', correct: true },
          { text: '弱相关', correct: false },
          { text: '60% 的变异被解释', correct: false },
          { text: '因果关系很强', correct: false }
        ],
        explain: '绝对值 .60 属于较大强度，负号表示一个升高另一个下降；解释比例要看 r² = .36。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['compute'],
        stem: 'r = .40 时，r² 等于？',
        options: [
          { text: '.16', correct: true },
          { text: '.40', correct: false },
          { text: '.20', correct: false },
          { text: '.80', correct: false }
        ],
        explain: 'r² = .40² = .16，表示 Y 的变异中约 16% 能被 X 解释。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-1', tier: 2, type: 'tf', difficulty: 2, tags: ['error'],
        stem: '散点图呈 U 形、Pearson r 接近 0，说明两个变量之间没有任何关系。',
        options: [
          { text: '对', correct: false },
          { text: '错', correct: true }
        ],
        explain: 'r 只测量线性关系；U 形是明显的非线性关系，r 接近 0 会掩盖它，所以必须先看散点图。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['interpret'],
        stem: '回归方程 Ŷ = 20 + 3X 中，斜率 3 的含义是？',
        options: [
          { text: 'X 每增加 1 个单位，Y 平均增加 3 个单位', correct: true },
          { text: 'X 与 Y 的相关系数是 3', correct: false },
          { text: 'Y 的变异有 3% 被解释', correct: false },
          { text: 'X = 0 时 Y 等于 3', correct: false }
        ],
        explain: '斜率是 X 变化一个单位时 Y 的平均变化量；截距 20 才是 X = 0 时的预测值。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['assumption'],
        stem: '残差 vs 拟合值图呈漏斗形，最可能提示？',
        options: [
          { text: '方差不齐（heteroscedasticity）', correct: true },
          { text: '残差完全随机', correct: false },
          { text: '线性关系极强', correct: false },
          { text: '样本量过大', correct: false }
        ],
        explain: '残差随拟合值增大而变宽说明误差方差不恒定，可考虑变换或稳健标准误。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '多元回归中每个系数表示「其他预测变量保持不变时」该变量的效应。',
        options: [
          { text: '对', correct: true },
          { text: '错', correct: false }
        ],
        explain: '这是多元回归系数与一元回归系数最关键的区别，也是「统计控制」的含义。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '下列哪种设计最能支持因果结论？',
        options: [
          { text: '随机对照实验', correct: true },
          { text: '横断相关研究', correct: false },
          { text: '两个变量的散点图', correct: false },
          { text: '大样本问卷相关', correct: false }
        ],
        explain: '随机分配能平衡已知与未知的混杂变量，满足时间顺序与排除替代解释的要求。'
      },

      /* ---------------- ch07 卡方、非参数与报告 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['compute'],
        stem: '卡方拟合优度检验的自由度是？',
        options: [
          { text: 'k − 1（k 为类别数）', correct: true },
          { text: 'N − 1', correct: false },
          { text: 'k', correct: false },
          { text: '(r − 1)(c − 1)', correct: false }
        ],
        explain: '总和固定，最后一个类别的频数不自由，所以 df = k − 1。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['compute'],
        stem: '2 × 3 列联表的卡方独立性检验自由度为？',
        options: [
          { text: '2', correct: true },
          { text: '3', correct: false },
          { text: '5', correct: false },
          { text: '6', correct: false }
        ],
        explain: 'df = (r − 1)(c − 1) = (2 − 1)(3 − 1) = 2。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'tf', difficulty: 2, tags: ['assumption'],
        stem: '卡方检验中若许多格子的期望频数小于 5，χ² 的近似可能不准确。',
        options: [
          { text: '对', correct: true },
          { text: '错', correct: false }
        ],
        explain: '期望频数过小会让 χ² 分布近似变差，可合并类别、增加样本或用精确检验。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['choose'],
        stem: '两个独立组、因变量是顺序数据，宜用哪种检验？',
        options: [
          { text: 'Mann–Whitney U 检验', correct: true },
          { text: '独立样本 t 检验', correct: false },
          { text: '配对 t 检验', correct: false },
          { text: '卡方拟合优度检验', correct: false }
        ],
        explain: '顺序数据不满足 t 检验的等距假设，Mann–Whitney U 基于秩，适合两组独立样本。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['choose'],
        stem: '三组以上独立样本、方差不齐且分布偏态，宜用？',
        options: [
          { text: 'Kruskal–Wallis 检验', correct: true },
          { text: '单因素 ANOVA', correct: false },
          { text: '重复测量 ANOVA', correct: false },
          { text: 'Pearson 相关', correct: false }
        ],
        explain: 'Kruskal–Wallis 是三组以上独立样本的非参数替代，不依赖正态与方差齐性。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'tf', difficulty: 2, tags: ['interpret'],
        stem: '非参数检验显著后，应报告「均值差异显著」作为主要结论。',
        options: [
          { text: '对', correct: false },
          { text: '错', correct: true }
        ],
        explain: '非参数检验比较的是分布位置或秩，应报告中位数或秩统计量，不能直接说均值差异。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['report'],
        stem: '按 APA 格式，p = .000 应写成？',
        options: [
          { text: 'p < .001', correct: true },
          { text: 'p = .000', correct: false },
          { text: 'p = 0', correct: false },
          { text: 'p < .05', correct: false }
        ],
        explain: 'p 值报告到三位小数，小于 .001 时写 p < .001；p = .000 在 APA 中是错误写法。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
