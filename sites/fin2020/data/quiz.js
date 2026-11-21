/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 每章 7 题，共 56 题；覆盖 ch00–ch07，每题带 explain。
 * 字段：{ id, ch, kp, tier, type, difficulty, tags, stem, options, answer, explain }
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 ---------------- */
      { id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '本站把中级金融理论的各个专题统一在哪个视角下？',
        options: [
          { text: '无套利与定价核：价格由「可复制」与「折现」共同决定', correct: true },
          { text: '财务报表分析：一切价格都能从三张表推出来' },
          { text: '技术分析：价格形态决定未来价格' },
          { text: '宏观预测：利率与增长决定所有资产回报' }
        ],
        explain: '课程的主线是「复制 + 无套利 + 随机贴现因子」，CAPM、期权定价与状态价格都是它的特例。' },

      { id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '在完全市场中，任何一种未来支付都能用现有资产复制出来。',
        options: [{ text: '正确', correct: true }, { text: '错误' }],
        explain: '完全市场的定义就是「状态数等于独立可交易资产数」，因此任何支付都可复制，价格唯一。' },

      { id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '「市场无套利」与下面哪一句等价？',
        options: [
          { text: '存在一组严格为正的状态价格（或定价核）', correct: true },
          { text: '所有资产的期望回报都相等' },
          { text: '所有投资者都风险中性' },
          { text: '市场价格永远等于内在价值' }
        ],
        explain: '资产定价第一基本定理：无套利等价于存在严格正的状态价格向量，这是全部定价公式的地基。' },

      { id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'fill', difficulty: 2, tags: ['concept'],
        stem: '定价公式 p = E[m·x] 中，m 被称为＿＿＿＿（写出中文名称即可）。',
        answer: '随机贴现因子',
        accept: ['随机贴现因子', '定价核', '随机折现因子'],
        explain: 'm 是跨期边际替代率，也叫定价核；p = E[m·x] 把 CAPM、状态价格与期权定价统一起来。' },

      { id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些属于本课程的四大板块？（多选）',
        options: [
          { text: '不确定性下的选择与风险厌恶', correct: true },
          { text: '市场结构与无套利定价', correct: true },
          { text: '组合选择与均衡资产定价', correct: true },
          { text: '信息摩擦、代理与公司金融', correct: true },
          { text: '高频交易策略的回测参数优化' }
        ],
        explain: '四大板块依次是选择、市场结构、组合与均衡、摩擦与公司金融；回测参数优化不在本课程范围。' },

      { id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '两状态例子中，或有权益 A 价格 0.40、B 价格 0.50，债券价格 0.90（面值 1）。无风险总回报 R^f 约为？',
        options: [
          { text: '1.111', correct: true },
          { text: '0.900' },
          { text: '1.000' },
          { text: '1.250' }
        ],
        explain: 'R^f = 1/(0.40+0.50) = 1/0.90 ≈ 1.111，对应无风险利率约 11.1%。' },

      { id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '面对一个新模型，本站建议的阅读顺序是？',
        options: [
          { text: '先问「它在什么假设下成立」，再推公式，最后找一个数值例子', correct: true },
          { text: '先背结论，考试时再想为什么' },
          { text: '先记公式的推导细节，例子可以跳过' },
          { text: '只看结论，假设部分不影响使用' }
        ],
        explain: '金融理论的结论几乎都对假设敏感；先定位假设、再用小数字验证，是最省力的学习路径。' },

      /* ---------------- ch01 ---------------- */
      { id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '效用 u(w) = √w，彩票以各半概率支付 121 与 81。该彩票的确定性等价 CE 是？',
        options: [
          { text: '100', correct: true },
          { text: '101' },
          { text: '110' },
          { text: '99' }
        ],
        explain: 'E[u] = 0.5×11 + 0.5×9 = 10，故 CE = 10² = 100；期望值 101 高于 CE，差额即风险溢价。' },

      { id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '承上题，该彩票的风险溢价是多少？',
        options: [
          { text: '1', correct: true },
          { text: '0' },
          { text: '0.5' },
          { text: '2' }
        ],
        explain: '风险溢价 = 期望值 − 确定性等价 = 101 − 100 = 1，这是为消除不确定性愿意放弃的金额。' },

      { id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '风险厌恶者面对公平赌博（期望收益为零）一定会拒绝。',
        options: [{ text: '正确', correct: true }, { text: '错误' }],
        explain: '公平赌博的期望效用低于确定财富的效用（Jensen 不等式），所以风险厌恶者拒绝。' },

      { id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'fill', difficulty: 3, tags: ['calc'],
        stem: 'u(w) = √w 在 w = 100 处的绝对风险厌恶系数 A(w) = −u″/u′ 等于＿＿（保留三位小数）。',
        answer: '0.005',
        accept: ['0.005', '0.0050', '1/200'],
        explain: 'u′ = 0.5w^(−0.5)，u″ = −0.25w^(−1.5)，故 A = 0.25/0.5 × w⁻¹ = 0.5/100 = 0.005。' },

      { id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'multi', difficulty: 3, tags: ['concept'],
        stem: '关于二阶随机占优（SSD），下列说法正确的是？（多选）',
        options: [
          { text: 'SSD 要求两个分布均值相同', correct: true },
          { text: 'SSD 比较的是累积分布函数的积分', correct: true },
          { text: 'SSD 成立则所有风险厌恶者都偏好前者', correct: true },
          { text: 'SSD 等价于方差更小' }
        ],
        explain: 'SSD 用累积分布的面积比较，对所有风险厌恶者成立；它不等价于方差更小，均值也必须相同。' },

      { id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'mcq', difficulty: 3, tags: ['concept'],
        stem: 'A 支付 (10, 30)、B 支付 (0, 40)，两状态等概率。下列判断正确的是？',
        options: [
          { text: '两者均值同为 20，FSD 不成立，但 A 二阶占优 B', correct: true },
          { text: 'B 一阶占优 A，因为它的上限更高' },
          { text: '两者方差相同，因此无差异' },
          { text: 'A 一阶占优 B，因为它没有零支付' }
        ],
        explain: '同均值时 FSD 必然不成立；B 在坏状态支付为 0，累积分布面积更大，故 A 二阶占优。' },

      { id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'mcq', difficulty: 3, tags: ['apply'],
        stem: '某人对 36 元损失（概率 0.5）愿付的最高保费为 19 元，公平保费为 18 元。这 1 元差额说明？',
        options: [
          { text: '他为消除不确定性愿意额外支付的金额，即风险溢价', correct: true },
          { text: '保险公司多收了他 1 元利润' },
          { text: '他的效用函数是风险中性的' },
          { text: '保费计算错误，应正好等于 18' }
        ],
        explain: '愿付上限高于公平保费的部分就是风险溢价，衡量他愿意为「确定性」付多少钱。' },

      /* ---------------- ch02 ---------------- */
      { id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '三状态状态价格 q = (0.20, 0.30, 0.40)。无风险总回报 R^f 是？',
        options: [
          { text: '1.111', correct: true },
          { text: '0.900' },
          { text: '1.900' },
          { text: '1.000' }
        ],
        explain: 'Σq = 0.90 是无风险债券的价格，故 R^f = 1/0.90 ≈ 1.111。' },

      { id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '承上题，风险中性概率 π* 等于？',
        options: [
          { text: '(2/9, 3/9, 4/9)', correct: true },
          { text: '(0.2, 0.3, 0.4)' },
          { text: '(0.5, 0.3, 0.2)' },
          { text: '(1/3, 1/3, 1/3)' }
        ],
        explain: 'π* = q/Σq，把状态价格归一化即得 (2/9, 3/9, 4/9)，三者之和为 1。' },

      { id: 'ch02-q3', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'mcq', difficulty: 3, tags: ['apply'],
        stem: '证券 D 支付 (2, 1, 3)，按给定状态价格应值 1.90，市场却报 1.80。套利者应当？',
        options: [
          { text: '买入 D，同时卖出复制组合，锁定 0.10 无风险利润', correct: true },
          { text: '卖出 D，因为价格低于理论值' },
          { text: '什么也不做，价差太小' },
          { text: '买入 D 并持有到期，赚取 0.10 的额外收益' }
        ],
        explain: '市价低于复制成本，买入被低估的 D、卖出复制组合即可锁定 1.90 − 1.80 = 0.10 的套利利润。' },

      { id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '无套利等价于存在一组严格为正的状态价格。',
        options: [{ text: '正确', correct: true }, { text: '错误' }],
        explain: '这正是资产定价第一基本定理；若某状态价格为负，就能构造出「今天不花钱、未来稳赚」的组合。' },

      { id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'fill', difficulty: 3, tags: ['calc'],
        stem: 'S = 8.80，K = 10，R^f = 1.111，看涨 0.60、看跌 0.80。按平价关系 C − P 应为＿＿（保留两位小数，含负号）。',
        answer: '-0.20',
        accept: ['-0.20', '-0.2', '−0.20'],
        explain: 'C − P = 0.60 − 0.80 = −0.20；S − K/R^f = 8.80 − 9.00 = −0.20，两边相等，平价成立。' },

      { id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '市场不完全时会出现哪些现象？（多选）',
        options: [
          { text: '状态价格不唯一，而是一个集合', correct: true },
          { text: '某些未来支付无法被现有资产复制', correct: true },
          { text: '可复制资产的价格仍然唯一', correct: true },
          { text: '无套利假设不再成立' }
        ],
        explain: '不完全市场只是「复制不全」，无套利仍可成立；不可复制支付没有唯一价格，可复制部分仍唯一。' },

      { id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '给一个可复制证券定价，最核心的原则是？',
        options: [
          { text: '一价定律：同一支付在同一时点只能有一个价格', correct: true },
          { text: '取历史价格的平均值' },
          { text: '按分析师的乐观程度调整' },
          { text: '用发行方的成本加成' }
        ],
        explain: '可复制意味着两个组合的未来支付完全相同，故今天的价格必须相同，否则套利。' },

      /* ---------------- ch03 ---------------- */
      { id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '股票 μ = 10%、σ = 20%，债券 μ = 6%、σ = 10%，相关系数为 0。各投一半，组合标准差约为？',
        options: [
          { text: '11.18%', correct: true },
          { text: '15.00%' },
          { text: '10.00%' },
          { text: '30.00%' }
        ],
        explain: 'σ_p = √(0.25×0.04 + 0.25×0.01) = √0.0125 ≈ 11.18%，低于加权平均的 15%。' },

      { id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'mcq', difficulty: 3, tags: ['calc'],
        stem: '承上题，最小方差组合中股票的权重是？',
        options: [
          { text: '0.20', correct: true },
          { text: '0.50' },
          { text: '0.80' },
          { text: '0.33' }
        ],
        explain: 'w* = (σ_b² − cov)/(σ_s² + σ_b² − 2cov) = 0.01/(0.04+0.01) = 0.2，此时 σ ≈ 8.94%。' },

      { id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'mcq', difficulty: 3, tags: ['calc'],
        stem: 'r_f = 4%，切点组合 μ = 7.71%、σ = 10.3%。它的夏普比率约为？',
        options: [
          { text: '0.36', correct: true },
          { text: '0.30' },
          { text: '0.75' },
          { text: '1.03' }
        ],
        explain: '夏普 = (7.71% − 4%)/10.3% ≈ 0.36，高于全股（0.30）与全债（0.20）。' },

      { id: 'ch03-q4', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'fill', difficulty: 3, tags: ['calc'],
        stem: '单因子结构下 σ_p = σ√(ρ + (1−ρ)/N)。取 σ = 30%、ρ = 0.3、N = 10，σ_p 约为＿＿%（保留一位小数）。',
        answer: '18.2',
        accept: ['18.2', '18.2%'],
        explain: 'σ_p = 30%×√(0.3 + 0.7/10) = 30%×√0.37 ≈ 18.2%，极限为 30%×√0.3 ≈ 16.4%。' },

      { id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '引入无风险资产后，有效前沿从双曲线变成一条从 r_f 出发的直线。',
        options: [{ text: '正确', correct: true }, { text: '错误' }],
        explain: '这条直线就是资本市场线，切点即市场组合；直线的斜率是夏普比率。' },

      { id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 1, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '做均值-方差组合优化，必须输入的参数有？（多选）',
        options: [
          { text: '各资产的期望收益', correct: true },
          { text: '各资产的方差', correct: true },
          { text: '资产之间的协方差', correct: true },
          { text: '投资者的年龄与职业' }
        ],
        explain: '均值-方差框架只用到一阶矩与二阶矩；年龄与职业不入模型，只能通过风险厌恶间接影响选择。' },

      { id: 'ch03-q7', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '充分分散化后，组合风险的下限由什么决定？',
        options: [
          { text: '共同因子风险 σ√ρ，无法通过增加资产数消除', correct: true },
          { text: '个股特有风险，随 N 增加而上升' },
          { text: '零，因为分散化能消除所有风险' },
          { text: '无风险利率' }
        ],
        explain: 'N → ∞ 时 σ_p → σ√ρ，剩下的是系统性风险；特质风险被平均掉。' },

      /* ---------------- ch04 ---------------- */
      { id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: 'r_f = 4%，市场风险溢价 6%，某股票 β = 1.5。按 CAPM，其期望回报为？',
        options: [
          { text: '13%', correct: true },
          { text: '10%' },
          { text: '9%' },
          { text: '15%' }
        ],
        explain: 'E[R] = 4% + 1.5×6% = 13%；β 每增加 0.5，期望回报增加 3 个百分点。' },

      { id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'mcq', difficulty: 3, tags: ['apply'],
        stem: '某股票实际期望回报 15%，按 CAPM 应为 13%。它的 α 与定价判断是？',
        options: [
          { text: 'α = +2%，价格偏低，应买入', correct: true },
          { text: 'α = +2%，价格偏高，应卖出' },
          { text: 'α = −2%，价格偏低，应买入' },
          { text: 'α = 0，无法判断' }
        ],
        explain: 'α 是实际回报减 SML 预测值；正 α 意味着同等 β 下回报更高，即当前价格偏低。' },

      { id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: 'CAPM 中的 β 衡量的是系统性风险，而非总风险。',
        options: [{ text: '正确', correct: true }, { text: '错误' }],
        explain: 'β = cov(R_i, R_M)/var(R_M)，只捕捉与市场共同波动的部分；特质风险可通过分散化消除，不被定价。' },

      { id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'fill', difficulty: 3, tags: ['calc'],
        stem: 'σ_i = 40%，β = 0.5，σ_M = 20%。该股票的特质方差（小数）为＿＿。',
        answer: '0.15',
        accept: ['0.15', '.15'],
        explain: '系统性方差 = β²σ_M² = 0.25×0.04 = 0.01，总方差 0.16，故特质方差 0.15。' },

      { id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: 'CAPM 的推导依赖哪些假设？（多选）',
        options: [
          { text: '投资者只关心均值与方差', correct: true },
          { text: '同质预期：所有人看到相同的参数', correct: true },
          { text: '可以按无风险利率自由借贷', correct: true },
          { text: '存在卖空限制与交易成本' }
        ],
        explain: 'CAPM 的标准假设是无摩擦、同质预期、单期、可自由借贷；卖空限制与交易成本属于放松后的扩展。' },

      { id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'mcq', difficulty: 3, tags: ['concept'],
        stem: '在均衡中，市场组合扮演什么角色？',
        options: [
          { text: '它位于有效前沿的切点上，是所有投资者持有的风险资产组合', correct: true },
          { text: '它只是众多可行组合中随意选出的一个' },
          { text: '它是风险最小的组合' },
          { text: '它与无风险利率无关' }
        ],
        explain: '同质预期下所有人都持有同一风险组合，加总后必然是市场组合，故它必须是切点组合。' },

      { id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'mcq', difficulty: 3, tags: ['empirical'],
        stem: '实证中「低 β 股票回报高于 CAPM 预测、高 β 低于预测」最可能与什么有关？',
        options: [
          { text: 'β 的测量误差与遗漏因子（如规模、价值）', correct: true },
          { text: 'CAPM 的算术推导有错' },
          { text: '市场组合无法观测，所以 β 一定为零' },
          { text: '投资者不再厌恶风险' }
        ],
        explain: '这只说明单因子模型不完整：β 有测量误差，且规模、价值等因子携带额外信息，不是 CAPM 推导错误。' },

      /* ---------------- ch05 ---------------- */
      { id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: 'S₀ = 100，u = 1.2，d = 0.8，R = 1.05，K = 100 的欧式看涨。复制组合中借款额 B 是？',
        options: [
          { text: '−38.10', correct: true },
          { text: '+38.10' },
          { text: '−40.00' },
          { text: '−50.00' }
        ],
        explain: 'Δ = 20/40 = 0.5，由 80×0.5 + 1.05B = 0 得 B = −40/1.05 ≈ −38.10，负号表示借钱。' },

      { id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'mcq', difficulty: 3, tags: ['calc'],
        stem: '承上题，同一标的、同执行价的欧式看跌价格约为？',
        options: [
          { text: '7.14', correct: true },
          { text: '4.76' },
          { text: '11.90' },
          { text: '2.38' }
        ],
        explain: '由平价 P = C − S + K/R = 11.90 − 100 + 95.24 ≈ 7.14。' },

      { id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '期权价格不依赖于股价上涨的客观概率。',
        options: [{ text: '正确', correct: true }, { text: '错误' }],
        explain: '复制组合只用 u、d、R，不用真实概率；概率信息已被股价本身吸收，这正是无套利定价的核心。' },

      { id: 'ch05-q4', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'fill', difficulty: 3, tags: ['calc'],
        stem: '两步树中 C_u = 26.19、C_d = 0、p* = 0.625、R = 1.05。根节点期权价约为＿＿（保留两位小数）。',
        answer: '15.59',
        accept: ['15.59', '15.6'],
        explain: 'C = (0.625×26.19 + 0.375×0)/1.05 ≈ 15.59，回溯法在每个节点做一次加权平均再折现。' },

      { id: 'ch05-q5', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '买卖权平价 C − P = S − K/(1+r)^T 成立需要哪些条件？（多选）',
        options: [
          { text: '欧式期权', correct: true },
          { text: '标的在期内无分红', correct: true },
          { text: '看涨与看跌的执行价、到期日相同', correct: true },
          { text: '股价服从对数正态分布' }
        ],
        explain: '平价只依赖「同一支付两种复制」，不需要任何分布假设；美式或有分红时它变成不等式。' },

      { id: 'ch05-q6', ch: 'ch05', kp: 'ch05-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '「持股 + 买入看跌」构成什么策略？',
        options: [
          { text: '保护性看跌，为下行封底', correct: true },
          { text: '备兑看涨，为上行封顶' },
          { text: '跨式，赌波动' },
          { text: '牛市价差，降低成本' }
        ],
        explain: '买看跌相当于给持股买保险：最大亏损锁定在 K 减权利金，上行收益保留。' },

      { id: 'ch05-q7', ch: 'ch05', kp: 'ch05-8', tier: 2, type: 'mcq', difficulty: 3, tags: ['concept'],
        stem: '不同执行价的隐含波动率连成「微笑」曲线，说明？',
        options: [
          { text: 'Black-Scholes 的常数波动率假设与市场不符', correct: true },
          { text: '市场参与者算错了期权价格' },
          { text: '平价关系不再成立' },
          { text: '股价一定服从对数正态分布' }
        ],
        explain: '若 BS 完全正确，隐含波动率应对所有执行价相同；微笑说明尾部风险被额外定价。' },

      /* ---------------- ch06 ---------------- */
      { id: 'ch06-q1', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: 'β = 0.98、γ = 2，消费增长 1.03 或 0.97 各半。无风险总回报 R^f 约为？',
        options: [
          { text: '1.018', correct: true },
          { text: '1.111' },
          { text: '0.982' },
          { text: '1.050' }
        ],
        explain: 'm_u = 0.98×1.03⁻² ≈ 0.9236，m_d ≈ 1.0413，E[m] ≈ 0.9825，故 R^f = 1/E[m] ≈ 1.018。' },

      { id: 'ch06-q2', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '若某资产的 cov(m, R) < 0，则它的期望回报应当？',
        options: [
          { text: '高于无风险利率，因为它在坏状态支付少', correct: true },
          { text: '低于无风险利率，因为它风险小' },
          { text: '正好等于无风险利率' },
          { text: '无法判断，需要知道方差' }
        ],
        explain: 'cov(m,R) < 0 意味着坏状态（m 大）支付少，价格被压低，期望回报因此高于 R^f。' },

      { id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'fill', difficulty: 2, tags: ['formula'],
        stem: 'CRRA 效用下，随机贴现因子 m = β·(c₁/c₀)^(−γ)。若 γ = 3，消费增长 1.02，β = 0.99，则 m ≈＿＿（保留三位小数）。',
        answer: '0.933',
        accept: ['0.933', '0.93'],
        explain: 'm = 0.99×1.02⁻³ ≈ 0.99×0.9423 ≈ 0.933；γ 越大，消费增长对 m 的压低越强。' },

      { id: 'ch06-q4', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '不完全市场里定价核不唯一，但可复制资产的价格仍然唯一。',
        options: [{ text: '正确', correct: true }, { text: '错误' }],
        explain: '定价核是一族，可它们在可复制方向上投影相同，故可复制资产价格一致；只有不可复制支付才没有唯一价。' },

      { id: 'ch06-q5', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'multi', difficulty: 3, tags: ['concept'],
        stem: '下列哪些是解释股权溢价之谜的主流方向？（多选）',
        options: [
          { text: '习惯形成：效用依赖消费与习惯之差', correct: true },
          { text: '长期风险：消费增长含持续成分', correct: true },
          { text: '罕见灾难：极小概率的深度衰退', correct: true },
          { text: '提高无风险利率以匹配溢价' }
        ],
        explain: '第四项是同义反复而非解释；前三条加上 Epstein-Zin 偏好，是文献中的四条主要路径。' },

      { id: 'ch06-q6', ch: 'ch06', kp: 'ch06-8', tier: 2, type: 'mcq', difficulty: 3, tags: ['concept'],
        stem: '为什么「高 γ 解释溢价」会同时制造无风险利率之谜？',
        options: [
          { text: '高 γ 让人急于消费，模型预测的利率被推得过高', correct: true },
          { text: '高 γ 会降低消费增长的波动' },
          { text: '高 γ 使定价核变大，从而压低利率' },
          { text: '两者无关，是两个独立的技术问题' }
        ],
        explain: 'γ 大时人们想平滑消费、要求高利率才肯储蓄，因此模型利率远高于现实，必须靠 β > 1 才能压回。' },

      { id: 'ch06-q7', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'mcq', difficulty: 3, tags: ['method'],
        stem: '关于 p = E[m·x]，下列理解正确的是？',
        options: [
          { text: '它是恒等式，理论的任务是说明 m 由什么决定', correct: true },
          { text: '它是一个可被数据直接证伪的经验规律' },
          { text: '它只对股票成立，对债券不成立' },
          { text: '它要求市场完全才能成立' }
        ],
        explain: '只要无套利就存在某个 m；不同模型给出不同的 m，数据拒绝的是 m 的具体形式，而非恒等式。' },

      /* ---------------- ch07 ---------------- */
      { id: 'ch07-q1', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '二手车市场中，若好车占比下降，最可能的结局是？',
        options: [
          { text: '买家出价随质量预期下降，好车退出，市场萎缩', correct: true },
          { text: '好车提高价格，市场自动恢复' },
          { text: '买家提高出价以吸引好车' },
          { text: '市场均衡不受信息影响' }
        ],
        explain: '逆向选择的自我强化：出价按平均质量定，低于好车保留价 → 好车退出 → 平均质量更差 → 出价更低。' },

      { id: 'ch07-q2', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'mcq', difficulty: 3, tags: ['apply'],
        stem: '公司宣布大规模增发股票后股价下跌，最合理的解释是？',
        options: [
          { text: '市场把它读作「管理层认为股价被高估」的信号', correct: true },
          { text: '增发本身消耗了公司现金' },
          { text: '新股一定比老股便宜' },
          { text: '投资者不喜欢公司变大' }
        ],
        explain: '这是 Myers-Majluf 的逆向选择逻辑：信息敏感度高的股权融资传递了估值信息，故公告效应为负。' },

      { id: 'ch07-q3', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '在无税、无摩擦、信息对称的世界里，资本结构不影响公司总价值。',
        options: [{ text: '正确', correct: true }, { text: '错误' }],
        explain: '这就是 MM 定理；它是有用的基准，任何「资本结构影响价值」的现象都对应某条假设被违反。' },

      { id: 'ch07-q4', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '融资优序理论给出的融资顺序是：内部资金 &gt; ＿＿ &gt; 股权融资。',
        answer: '债务',
        accept: ['债务', '负债', '债券'],
        explain: '债务对「公司价值」的信息敏感度低于股权，逆向选择成本较小，因此排在股权之前。' },

      { id: 'ch07-q5', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些属于债务代理成本？（多选）',
        options: [
          { text: '资产替代：股东偏好高风险项目', correct: true },
          { text: '投资不足：新项目收益先归债权人', correct: true },
          { text: '经理过度在职消费', correct: true },
          { text: '税盾带来的价值增加' }
        ],
        explain: '前两项是典型的债务代理成本；在职消费属于股权代理成本；税盾是收益而非成本。' },

      { id: 'ch07-q6', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'mcq', difficulty: 3, tags: ['concept'],
        stem: '戴蒙德-迪布维格模型中，挤兑为什么可能发生？',
        options: [
          { text: '它是自我实现的坏均衡：每个人都怕别人先取，于是抢先提取', correct: true },
          { text: '银行把存款投给了负 NPV 项目' },
          { text: '存款利率太低，储户集体抗议' },
          { text: '监管要求银行清算资产' }
        ],
        explain: '活期存款合同存在两个均衡：都不挤兑与都挤兑；后者不需要基本面恶化，恐慌本身即可触发。' },

      { id: 'ch07-q7', ch: 'ch07', kp: 'ch07-8', tier: 2, type: 'mcq', difficulty: 2, tags: ['policy'],
        stem: '存款保险主要解决什么问题，代价是什么？',
        options: [
          { text: '消除挤兑的坏均衡，代价是银行的道德风险', correct: true },
          { text: '提高银行利润，代价是储户收益下降' },
          { text: '消除逆向选择，代价是信息披露成本' },
          { text: '降低利率，代价是通货膨胀' }
        ],
        explain: '保险让储户不再抢先提取，从而消除坏均衡；但被保险的银行更敢冒险，故需资本监管配合。' }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
