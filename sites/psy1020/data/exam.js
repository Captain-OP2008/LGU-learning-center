/* =====================================================================
 * exam.js · PSY1020 模拟卷 A
 * 12 题、满分 100、建议用时 110 分钟；题型为单选与判断，覆盖 ch00–ch07。
 * ===================================================================== */
CSC.registerExam({
  id: 'PSY1020-A',
  title: '模拟卷 A',
  style: 'FINAL',
  subtitle: '心理学统计方法 · 期末模拟（闭卷，允许使用计算器）',
  date: '',
  minutes: 110,
  totalScore: 100,
  summary: '本卷共 12 题，覆盖描述统计、概率与抽样、假设检验、t 检验、方差分析、相关与回归、卡方与非参数、报告规范。单选题每题只有一个正确选项；判断题只需判断正误。建议先做概念题，再处理需要计算的题目。',
  instructions: [
    '闭卷考试，允许使用不具备编程与通讯功能的计算器。',
    '单选题每题只有一个最佳答案，多选、错选均不得分。',
    '判断题请写「对」或「错」，不需要说明理由。',
    '涉及计算时保留两位小数；p 值报告到三位小数。',
    '全卷满分 100 分，建议用时 110 分钟。'
  ],
  questions: [
    {
      no: 1,
      points: 8,
      type: 'choice',
      intro: '一位研究者收集了 200 名学生的身高、体重与专业，想先了解数据的基本形态。',
      parts: [
        { label: '1', points: 2, kind: 'choice', prompt: '身高（厘米）属于哪一种测量尺度？', options: [
          { text: '等比尺度（ratio）', correct: true },
          { text: '等距尺度（interval）', correct: false },
          { text: '顺序尺度（ordinal）', correct: false },
          { text: '称名尺度（nominal）', correct: false }
        ], explain: '身高有绝对零点（0 厘米表示没有长度），且单位相等，属于等比尺度。' },
        { label: '2', points: 2, kind: 'choice', prompt: '若体重分布明显右偏，最能代表「典型体重」的指标是？', options: [
          { text: '中位数', correct: true },
          { text: '均值', correct: false },
          { text: '标准差', correct: false },
          { text: '极差', correct: false }
        ], explain: '右偏时均值被高值拉大，中位数对极端值稳健，更适合描述典型水平。' },
        { label: '3', points: 2, kind: 'choice', prompt: '专业（文科/理科/工科）属于哪一种测量尺度？', options: [
          { text: '称名尺度（nominal）', correct: true },
          { text: '顺序尺度（ordinal）', correct: false },
          { text: '等距尺度（interval）', correct: false },
          { text: '等比尺度（ratio）', correct: false }
        ], explain: '专业只是分类标签，类别之间没有大小顺序，属于称名尺度。' },
        { label: '4', points: 2, kind: 'choice', prompt: '要同时看体重与身高的关系，最合适的第一张图是？', options: [
          { text: '散点图', correct: true },
          { text: '饼图', correct: false },
          { text: '单一变量的条形图', correct: false },
          { text: '累积频数折线图', correct: false }
        ], explain: '两个连续变量的关系用散点图最直观，能同时看方向、强度与异常值。' }
      ]
    },
    {
      no: 2,
      points: 8,
      type: 'tf',
      intro: '判断下列关于概率与抽样分布的说法是否正确。',
      parts: [
        { label: '1', points: 2, kind: 'tf', prompt: '若 A 与 B 互斥，则 P(A 且 B) = 0。', options: [
          { text: '对', correct: true },
          { text: '错', correct: false }
        ], explain: '互斥意味着不能同时发生，交集概率为零。' },
        { label: '2', points: 2, kind: 'tf', prompt: '标准误随样本量增大而增大。', options: [
          { text: '对', correct: false },
          { text: '错', correct: true }
        ], explain: '标准误 = σ/√n，样本量增大时分母变大，标准误减小。' },
        { label: '3', points: 2, kind: 'tf', prompt: '中心极限定理要求原始数据服从正态分布。', options: [
          { text: '对', correct: false },
          { text: '错', correct: true }
        ], explain: 'CLT 说的是样本均值的分布在大样本下近似正态，并不要求原始数据正态。' },
        { label: '4', points: 2, kind: 'tf', prompt: 't 分布比标准正态分布尾部更厚，自由度增大时逐渐接近正态。', options: [
          { text: '对', correct: true },
          { text: '错', correct: false }
        ], explain: '估计标准误带来额外不确定性，尾部更厚；df 增大时 t 趋近 z。' }
      ]
    },
    {
      no: 3,
      points: 8,
      type: 'choice',
      intro: '一项研究检验新教学方法是否提高成绩，得到 t(38) = 2.31，p = .027，d = 0.72。',
      parts: [
        { label: '1', points: 2, kind: 'choice', prompt: 'p = .027 的正确解释是？', options: [
          { text: '若 H₀ 为真，得到当前或更极端结果的概率为 .027', correct: true },
          { text: 'H₀ 为真的概率是 .027', correct: false },
          { text: 'H₁ 为真的概率是 .027', correct: false },
          { text: '结果有 2.7% 的概率可重复', correct: false }
        ], explain: 'p 值以 H₀ 为条件，描述数据极端程度，不是假设为真的概率。' },
        { label: '2', points: 2, kind: 'choice', prompt: '在 α = .05 下，这项检验的结论是？', options: [
          { text: '拒绝 H₀，认为两组差异显著', correct: true },
          { text: '不拒绝 H₀，认为两组无差异', correct: false },
          { text: '证明新教学法一定有效', correct: false },
          { text: '样本量不足，无法判断', correct: false }
        ], explain: 'p = .027 < .05，拒绝 H₀；但「显著」不等于「证明」，也不等于「一定有效」。' },
        { label: '3', points: 2, kind: 'choice', prompt: 'd = 0.72 说明？', options: [
          { text: '属于中等偏大的效应', correct: true },
          { text: '属于小效应', correct: false },
          { text: 'p 值为 .72', correct: false },
          { text: '72% 的变异被解释', correct: false }
        ], explain: '按 Cohen 参照，0.5 中等、0.8 大，0.72 接近大效应。' },
        { label: '4', points: 2, kind: 'choice', prompt: '若研究者把 α 从 .05 改为 .01，这项结果会？', options: [
          { text: '不再显著，因为 p = .027 > .01', correct: true },
          { text: '仍然显著，因为 p 值不变', correct: false },
          { text: '效应量变小', correct: false },
          { text: '样本量自动增加', correct: false }
        ], explain: 'α 是判定阈值，p 值不变；阈值收紧后同样的 p 可能不再落入拒绝域。' }
      ]
    },
    {
      no: 4,
      points: 8,
      type: 'choice',
      intro: '比较两种记忆策略的效果，一组 25 人用策略 A，另一组 23 人用策略 B。',
      parts: [
        { label: '1', points: 2, kind: 'choice', prompt: '若两组相互独立、方差齐性成立，自由度是？', options: [
          { text: '46', correct: true },
          { text: '48', correct: false },
          { text: '24', correct: false },
          { text: '47', correct: false }
        ], explain: 'df = n₁ + n₂ − 2 = 25 + 23 − 2 = 46。' },
        { label: '2', points: 2, kind: 'choice', prompt: '若 Levene 检验 p = .01，应优先报告？', options: [
          { text: 'Welch t 检验', correct: true },
          { text: 'Student t 检验', correct: false },
          { text: '配对 t 检验', correct: false },
          { text: '卡方检验', correct: false }
        ], explain: 'Levene 显著说明方差不齐，Welch 校正不要求方差齐性，结果更稳妥。' },
        { label: '3', points: 2, kind: 'choice', prompt: '若同一批人先后使用两种策略，应改用？', options: [
          { text: '配对样本 t 检验', correct: true },
          { text: '独立样本 t 检验', correct: false },
          { text: '单因素 ANOVA', correct: false },
          { text: 'Pearson 相关', correct: false }
        ], explain: '同一批人接受两种条件，数据配对，配对 t 能控制个体差异。' },
        { label: '4', points: 2, kind: 'choice', prompt: '配对 t 检验的 H₀ 是？', options: [
          { text: '差值的总体均值为 0', correct: true },
          { text: '两组方差相等', correct: false },
          { text: '两个样本均值都等于 0', correct: false },
          { text: '差值服从正态分布', correct: false }
        ], explain: '配对 t 检验的是差值的总体均值是否为 0；正态性是假设，不是 H₀。' }
      ]
    },
    {
      no: 5,
      points: 10,
      type: 'choice',
      intro: '三种教学法各 20 人，期末成绩做单因素方差分析，得到 F(2, 57) = 5.42，p = .007，η² = .16。',
      parts: [
        { label: '1', points: 2, kind: 'choice', prompt: 'F 检验的 H₀ 是？', options: [
          { text: '三种教学法的总体均值全部相等', correct: true },
          { text: '三种教学法的样本均值全部相等', correct: false },
          { text: '三种教学法的方差全部相等', correct: false },
          { text: '至少有两组均值相等', correct: false }
        ], explain: 'ANOVA 的 H₀ 是所有组的总体均值相等，备择是「不全相等」。' },
        { label: '2', points: 2, kind: 'choice', prompt: 'df = (2, 57) 中，57 对应的是？', options: [
          { text: '组内自由度 N − k', correct: true },
          { text: '组间自由度 k − 1', correct: false },
          { text: '总自由度 N − 1', correct: false },
          { text: '样本量减 1', correct: false }
        ], explain: '分子 df = k − 1 = 2，分母 df = N − k = 60 − 3 = 57。' },
        { label: '3', points: 2, kind: 'choice', prompt: 'η² = .16 表示？', options: [
          { text: '教学法解释了约 16% 的成绩变异', correct: true },
          { text: '有 16% 的学生显著进步', correct: false },
          { text: '组间均值差为 16 分', correct: false },
          { text: 'p 值为 .16', correct: false }
        ], explain: 'η² = SS_between/SS_total，是变异解释比例。' },
        { label: '4', points: 2, kind: 'choice', prompt: 'F 显著后，下一步应当？', options: [
          { text: '做事后检验，找出哪几组不同', correct: true },
          { text: '直接下结论说三组都不同', correct: false },
          { text: '重新做三次 t 检验', correct: false },
          { text: '停止分析，因为已显著', correct: false }
        ], explain: 'F 只说明「有地方不同」，具体哪几组要靠事后检验（如 Tukey HSD）。' },
        { label: '5', points: 2, kind: 'choice', prompt: '若三组样本量差别很大且方差不齐，较稳妥的替代是？', options: [
          { text: 'Welch ANOVA 或 Kruskal–Wallis 检验', correct: true },
          { text: '重复测量 ANOVA', correct: false },
          { text: '双因素 ANOVA', correct: false },
          { text: '卡方拟合优度检验', correct: false }
        ], explain: '方差不齐且样本不均衡时，Welch ANOVA 或非参数 Kruskal–Wallis 更稳健。' }
      ]
    },
    {
      no: 6,
      points: 8,
      type: 'tf',
      intro: '判断下列关于方差分析的说法是否正确。',
      parts: [
        { label: '1', points: 2, kind: 'tf', prompt: '多次做两两 t 检验会膨胀族错误率。', options: [
          { text: '对', correct: true },
          { text: '错', correct: false }
        ], explain: '比较次数越多，至少一次假阳性的概率越大，ANOVA 用一次整体检验控制它。' },
        { label: '2', points: 2, kind: 'tf', prompt: 'F 显著说明所有组两两之间都有显著差异。', options: [
          { text: '对', correct: false },
          { text: '错', correct: true }
        ], explain: 'F 只说明至少有一组不同，具体差异要靠事后比较。' },
        { label: '3', points: 2, kind: 'tf', prompt: '重复测量 ANOVA 违反球形假设时，应读 Greenhouse–Geisser 校正结果。', options: [
          { text: '对', correct: true },
          { text: '错', correct: false }
        ], explain: 'Mauchly 显著时未校正的 F 偏宽松，应使用校正后的 df 与 p。' },
        { label: '4', points: 2, kind: 'tf', prompt: '交互作用显著时，主效应仍然可以脱离另一个因素单独解释。', options: [
          { text: '对', correct: false },
          { text: '错', correct: true }
        ], explain: '交互显著说明一个因素的效应随另一个因素水平变化，主效应可能误导，需分水平解释。' }
      ]
    },
    {
      no: 7,
      points: 8,
      type: 'choice',
      intro: '一项研究考察每日屏幕时间与睡眠时长的关系，n = 120，得到 r = −.34，p = .001。',
      parts: [
        { label: '1', points: 2, kind: 'choice', prompt: 'r = −.34 说明？', options: [
          { text: '中等偏弱的负相关', correct: true },
          { text: '强正相关', correct: false },
          { text: '34% 的变异被解释', correct: false },
          { text: '屏幕时间导致睡眠减少', correct: false }
        ], explain: '绝对值 .34 属中等偏弱，负号表示一个升高另一个下降。' },
        { label: '2', points: 2, kind: 'choice', prompt: 'r² 约为？', options: [
          { text: '.12', correct: true },
          { text: '.34', correct: false },
          { text: '.66', correct: false },
          { text: '.58', correct: false }
        ], explain: 'r² = .34² ≈ .12，即约 12% 的睡眠时长变异能被屏幕时间解释。' },
        { label: '3', points: 2, kind: 'choice', prompt: '在解释这项结果前，最应该先看？', options: [
          { text: '散点图，检查线性、异常值与范围', correct: true },
          { text: 'p 值是否小于 .001', correct: false },
          { text: '样本量是否大于 1000', correct: false },
          { text: '是否有第三个变量', correct: false }
        ], explain: 'r 只测线性关系，异常值与非线性都会误导；散点图是解释 r 的前提。' },
        { label: '4', points: 2, kind: 'choice', prompt: '若要检验「控制年龄后屏幕时间是否仍与睡眠有关」，应使用？', options: [
          { text: '多元回归，把年龄作为协变量', correct: true },
          { text: '再做一次 Pearson 相关', correct: false },
          { text: '卡方独立性检验', correct: false },
          { text: '配对 t 检验', correct: false }
        ], explain: '多元回归能在统计上控制年龄，看屏幕时间的偏效应是否仍显著。' }
      ]
    },
    {
      no: 8,
      points: 10,
      type: 'choice',
      intro: '用焦虑分数、每日咖啡杯数与睡眠时长建立回归模型，预测睡眠时长。',
      parts: [
        { label: '1', points: 2, kind: 'choice', prompt: '回归方程 Ŷ = 8.2 − 0.15X 中，X 为咖啡杯数，斜率说明？', options: [
          { text: '每多喝一杯咖啡，睡眠平均减少 0.15 小时', correct: true },
          { text: '咖啡解释了 15% 的睡眠变异', correct: false },
          { text: '咖啡与睡眠的相关系数是 −0.15', correct: false },
          { text: '不喝咖啡时睡眠为 −0.15 小时', correct: false }
        ], explain: '斜率是 X 增 1 单位时 Y 的平均变化，负号表示减少。' },
        { label: '2', points: 2, kind: 'choice', prompt: '残差图呈明显漏斗形，最可能的问题是？', options: [
          { text: '方差不齐', correct: true },
          { text: '线性关系不存在', correct: false },
          { text: '样本量太大', correct: false },
          { text: '截距为负', correct: false }
        ], explain: '残差随拟合值增大而扩散，说明误差方差不恒定。' },
        { label: '3', points: 2, kind: 'choice', prompt: '多元回归中 VIF = 12，提示？', options: [
          { text: '存在较严重的多重共线性', correct: true },
          { text: '模型拟合很好', correct: false },
          { text: '样本量不足', correct: false },
          { text: '残差服从正态分布', correct: false }
        ], explain: 'VIF 大于 10 通常提示共线性严重，系数估计不稳定、标准误变大。' },
        { label: '4', points: 2, kind: 'choice', prompt: '比较两个模型时，为什么更推荐调整后 R²？', options: [
          { text: '它按预测变量个数做了校正，避免「加变量就变大」', correct: true },
          { text: '它一定比 R² 大', correct: false },
          { text: '它不受样本量影响', correct: false },
          { text: '它等于 r 的平方', correct: false }
        ], explain: 'R² 随变量增加只升不降， adjusted R² 惩罚了无效变量。' },
        { label: '5', points: 2, kind: 'choice', prompt: '研究发现咖啡与睡眠相关，最不能直接得出的结论是？', options: [
          { text: '咖啡导致睡眠减少', correct: true },
          { text: '两者呈负相关', correct: false },
          { text: '咖啡摄入多的人睡眠平均更短', correct: false },
          { text: '可能存在第三个变量同时影响两者', correct: false }
        ], explain: '横断相关无法排除反向因果与混杂，「导致」需要实验或纵向设计支持。' }
      ]
    },
    {
      no: 9,
      points: 8,
      type: 'tf',
      intro: '判断下列关于卡方与非参数检验的说法是否正确。',
      parts: [
        { label: '1', points: 2, kind: 'tf', prompt: '卡方拟合优度检验的自由度是类别数减 1。', options: [
          { text: '对', correct: true },
          { text: '错', correct: false }
        ], explain: '总和固定，最后一个类别不自由，df = k − 1。' },
        { label: '2', points: 2, kind: 'tf', prompt: '2 × 2 列联表的卡方独立性检验自由度为 2。', options: [
          { text: '对', correct: false },
          { text: '错', correct: true }
        ], explain: 'df = (2 − 1)(2 − 1) = 1，不是 2。' },
        { label: '3', points: 2, kind: 'tf', prompt: 'Mann–Whitney U 检验可用于两个独立组的顺序数据。', options: [
          { text: '对', correct: true },
          { text: '错', correct: false }
        ], explain: '它基于秩，不要求等距与正态，适合两组独立样本。' },
        { label: '4', points: 2, kind: 'tf', prompt: '非参数检验显著后，报告「均值差异」是恰当的。', options: [
          { text: '对', correct: false },
          { text: '错', correct: true }
        ], explain: '非参数检验比较分布位置或秩，应报告中位数或秩统计量。' }
      ]
    },
    {
      no: 10,
      points: 8,
      type: 'choice',
      intro: '为下列研究问题选择最合适的检验。',
      parts: [
        { label: '1', points: 2, kind: 'choice', prompt: '同一批被试在三个时间点的焦虑分数比较。', options: [
          { text: '重复测量 ANOVA', correct: true },
          { text: '独立样本 ANOVA', correct: false },
          { text: '卡方独立性检验', correct: false },
          { text: 'Pearson 相关', correct: false }
        ], explain: '同一批人、三个时间点，属于被试内设计，用重复测量 ANOVA。' },
        { label: '2', points: 2, kind: 'choice', prompt: '性别（男/女）与是否及格（是/否）是否有关联。', options: [
          { text: '卡方独立性检验', correct: true },
          { text: '独立样本 t 检验', correct: false },
          { text: '单样本 t 检验', correct: false },
          { text: '重复测量 ANOVA', correct: false }
        ], explain: '两个变量都是分类变量，用列联表与卡方独立性检验。' },
        { label: '3', points: 2, kind: 'choice', prompt: '一个样本 15 人、分布严重偏态，与已知常模比较。', options: [
          { text: 'Wilcoxon 符号秩检验', correct: true },
          { text: '单样本 t 检验', correct: false },
          { text: '独立样本 t 检验', correct: false },
          { text: '双因素 ANOVA', correct: false }
        ], explain: '小样本且偏态，非参数 Wilcoxon 符号秩比 t 检验更稳妥。' },
        { label: '4', points: 2, kind: 'choice', prompt: '两个连续变量、样本很大但关系可能非线性。', options: [
          { text: '先画散点图，再决定用 Pearson 还是其他方法', correct: true },
          { text: '直接算 Pearson r 并报告', correct: false },
          { text: '直接做卡方检验', correct: false },
          { text: '直接做配对 t 检验', correct: false }
        ], explain: '先看图形判断关系形状，再选相关方法；Pearson r 只适合线性关系。' }
      ]
    },
    {
      no: 11,
      points: 8,
      type: 'tf',
      intro: '判断下列关于统计报告与科研规范的说法是否正确。',
      parts: [
        { label: '1', points: 2, kind: 'tf', prompt: 'APA 格式中，p = .000 是允许的写法。', options: [
          { text: '对', correct: false },
          { text: '错', correct: true }
        ], explain: 'p 值不会正好为 0，APA 要求写 p < .001。' },
        { label: '2', points: 2, kind: 'tf', prompt: '报告 t 检验时，应同时给出效应量与置信区间。', options: [
          { text: '对', correct: true },
          { text: '错', correct: false }
        ], explain: '效应量与 CI 让读者判断差异大小与精度，是 APA 的基本要求。' },
        { label: '3', points: 2, kind: 'tf', prompt: '预注册可以减少 p-hacking 与选择性报告。', options: [
          { text: '对', correct: true },
          { text: '错', correct: false }
        ], explain: '事先公开假设与分析计划，能约束事后改分析的空间。' },
        { label: '4', points: 2, kind: 'tf', prompt: 'p > .05 说明两个总体均值一定相等。', options: [
          { text: '对', correct: false },
          { text: '错', correct: true }
        ], explain: '不显著只是「证据不足」，不能证明 H₀ 为真，应结合 CI 与效应量解释。' }
      ]
    },
    {
      no: 12,
      points: 8,
      type: 'choice',
      intro: '综合应用题：把前面各章的概念串起来。',
      parts: [
        { label: '1', points: 2, kind: 'choice', prompt: '下列哪一项最可能导致「显著但无用」的结果？', options: [
          { text: '样本量极大而效应量极小', correct: true },
          { text: '样本量很小而效应量很大', correct: false },
          { text: '使用了非参数检验', correct: false },
          { text: '报告了置信区间', correct: false }
        ], explain: '大样本下很小的效应也能显著，因此必须结合效应量与 CI 判断实用性。' },
        { label: '2', points: 2, kind: 'choice', prompt: '同时检验 10 个独立假设、每个 α = .05，族错误率约为？', options: [
          { text: '40%', correct: true },
          { text: '5%', correct: false },
          { text: '10%', correct: false },
          { text: '95%', correct: false }
        ], explain: '1 − .95¹⁰ ≈ .40；可用 Bonferroni 把每次阈值设为 .005。' },
        { label: '3', points: 2, kind: 'choice', prompt: '研究者先看数据再决定用单侧检验，这属于？', options: [
          { text: 'p-hacking 的一种，会膨胀假阳性', correct: true },
          { text: '提高功效的推荐做法', correct: false },
          { text: '非参数检验的必要步骤', correct: false },
          { text: '预注册的标准流程', correct: false }
        ], explain: '检验方向应事先确定；看到结果再改方向会破坏 α 的控制。' },
        { label: '4', points: 2, kind: 'choice', prompt: '一份完整的结果段最不应该缺少？', options: [
          { text: '统计量、自由度、p、效应量与 CI', correct: true },
          { text: '软件版本号与电脑型号', correct: false },
          { text: '所有原始数据', correct: false },
          { text: '作者的个人观点', correct: false }
        ], explain: '这些是读者核对与判断结果所需的最小信息；原始数据可放在开放数据仓库。' }
      ]
    }
  ]
});
