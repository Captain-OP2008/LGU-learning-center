/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；每章 q1–q3 与 chXX.js 内嵌题一致
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '本站覆盖 Jones《Macroeconomics》第三版的哪些章？',
        options: [
          { text: '第 2–14 章', correct: true },
          { text: '第 1–8 章' },
          { text: '第 9–16 章' },
          { text: '第 15–21 章' }
        ],
        explain: '本站覆盖教材第 2 到 14 章：从宏观度量、生产模型、索洛与罗默，到劳动市场、通胀与短期波动；第 1 章导论与第 15 章之后的扩展内容不在范围内。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '长期模型与短期模型最核心的区别是什么？',
        options: [
          { text: '价格与工资是否灵活：长期灵活，短期有粘性', correct: true },
          { text: '是否考虑政府支出' },
          { text: '是否使用数学公式' },
          { text: '是否假设完全竞争' }
        ],
        explain: '长期价格灵活，产出由潜在产出决定、货币中性；短期价格与工资有粘性，需求变化会先落到产出与就业上。这是两套模型分工的根源。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '教材共 21 章，分为 4 个部分。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '教材分四部分：导论与度量、长期增长、短期波动、应用专题，共 21 章。记住这个结构有助于把每章放回整体框架。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'fill', difficulty: 1, tags: ['calc'],
        stem: '按 70 法则，年增长 7% 时人均收入翻倍约需多少年？（只填数字）',
        answer: '10',
        accept: ['10', '10 年', '十年'],
        explain: '70 除以 7 等于 10 年。70 法则来自复利近似：翻倍时间约等于 70 除以年增长率（百分点），增长率越高所需时间越短。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-2', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '本站的七个主题包括下列哪些？',
        options: [
          { text: '长期增长', correct: true },
          { text: '劳动市场与失业', correct: true },
          { text: '通货膨胀', correct: true },
          { text: '短期波动与稳定政策', correct: true },
          { text: '量子场论' }
        ],
        explain: '本站七个主题是课程地图、宏观度量、生产模型、索洛、罗默、劳动市场、通胀与短期波动，对应教材第 2–14 章；量子场论与本课程无关。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: 'Y = C + I + G + NX 属于哪一类式子？',
        options: [
          { text: '恒等式', correct: true },
          { text: '行为方程' },
          { text: '均衡条件' },
          { text: '生产函数' }
        ],
        explain: '这是国民收入核算的恒等式：支出总是等于产出，四项加总按定义成立。行为方程描述人如何决策，均衡条件描述市场出清，两者都不是恒等式。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'fill', difficulty: 1, tags: ['fact'],
        stem: '2023 年前后美国人均 GDP 约为多少万美元？（只填数字）',
        answer: '8',
        accept: ['8', '8 万', '八万'],
        explain: '美国人均 GDP 约 8 万美元，印度约 2500 美元，相差三十倍以上。这个数量级差是理解增长与发展的起点。'
      },

      /* ---------------- ch01 宏观经济的度量 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '支出法核算 GDP 的恒等式是？',
        options: [
          { text: 'Y = C + I + G + NX', correct: true },
          { text: 'Y = C + S + T' },
          { text: 'Y = A K + L' },
          { text: 'Y = M V / P' }
        ],
        explain: '支出法把 GDP 拆成消费、投资、政府购买与净出口四项。Y = C + S + T 是收入法的分解，其余两个分别不是 GDP 核算式。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['calc'],
        stem: '某国 C = 14、I = 4、G = 4、NX = −1（单位：万亿美元），GDP 是多少？',
        options: [
          { text: '21 万亿美元', correct: true },
          { text: '23 万亿美元' },
          { text: '19 万亿美元' },
          { text: '13 万亿美元' }
        ],
        explain: 'Y = 14 + 4 + 4 − 1 = 21。净出口为负表示进口大于出口，要从总需求中扣除，不能当成加项。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '名义 GDP 上升，说明实际产出一定增加。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '名义 GDP 同时受价格与产量影响。若物价上涨而产量不变，名义 GDP 也会上升。判断实际产出要看实际 GDP 或 GDP 平减指数。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-2', tier: 2, type: 'fill', difficulty: 2, tags: ['calc'],
        stem: '基年名义 GDP 为 22、当年名义 GDP 为 32、实际 GDP 为 25，GDP 平减指数是多少？（只填数字）',
        answer: '128',
        accept: ['128', '128.0'],
        explain: '平减指数 = 名义 GDP / 实际 GDP × 100 = 32/25 × 100 = 128，表示物价水平比基年高 28%。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-1', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些计入当年的 GDP？',
        options: [
          { text: '本国境内当年生产的最终产品', correct: true },
          { text: '当年生产但未售出、计入库存的产品', correct: true },
          { text: '二手车的转手交易' },
          { text: '政府给个人的转移支付' },
          { text: '当年提供的服务的市场价值', correct: true }
        ],
        explain: 'GDP 统计本国境内当期生产的最终产品与服务，库存增加算投资；二手车转手只是产权转移，转移支付没有对应的生产，二者都不计入。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '失业率的分母是什么？',
        options: [
          { text: '劳动力（就业者 + 失业者）', correct: true },
          { text: '总人口' },
          { text: '成年人口' },
          { text: '就业者' }
        ],
        explain: '失业率 = 失业者 / 劳动力，劳动力只包括就业与正在找工作的人。退出劳动力的人不算失业，所以失业率可能因灰心工人退出而下降。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'fill', difficulty: 1, tags: ['calc'],
        stem: '去年物价指数 100、今年 110，通胀率是多少（%）？（只填数字）',
        answer: '10',
        accept: ['10', '10%'],
        explain: '通胀率 = (110 − 100)/100 × 100% = 10%。注意分母是去年的物价水平，不是今年的。'
      },

      /* ---------------- ch02 生产模型 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '在 Y = A K^(1/3) L^(2/3) 中，劳动收入份额是多少？',
        options: [
          { text: '2/3', correct: true },
          { text: '1/3' },
          { text: '1/2' },
          { text: '1' }
        ],
        explain: '柯布-道格拉斯函数中要素的指数等于其收入份额：劳动指数 2/3 即劳动份额，资本指数 1/3 即资本份额，两者相加为 1。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['calc'],
        stem: 'A = 10、人均资本 k = 27，人均产出 y 是多少？',
        options: [
          { text: '30', correct: true },
          { text: '90' },
          { text: '10' },
          { text: '270' }
        ],
        explain: 'y = A k^(1/3) = 10 × 27^(1/3) = 10 × 3 = 30。27 的立方根是 3，这是本题的关键中间量。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '在柯布-道格拉斯生产函数中，资本翻倍会使产出也翻倍。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '只有资本与劳动同时翻倍（规模报酬不变）产出才翻倍。单独把 k 从 27 增到 54，y 只从 30 升到 37.8，增长 26%，这是边际报酬递减。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'fill', difficulty: 2, tags: ['calc'],
        stem: '若两国人均产出差 30 倍且完全由人均资本解释，k 需要差多少倍？（只填数字）',
        answer: '27000',
        accept: ['27000', '27,000'],
        explain: 'y = A k^(1/3)，y 差 30 倍要求 k^(1/3) 差 30 倍，即 k 差 30^3 = 27000 倍。现实中资本最多差几十倍，所以收入差主要靠 A 解释。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些会提高全要素生产率 A？',
        options: [
          { text: '产权保护与契约执行的改善', correct: true },
          { text: '技术扩散与贸易开放', correct: true },
          { text: '资源错配减少', correct: true },
          { text: '单纯增加资本存量' }
        ],
        explain: 'A 捕捉「同样的 K 与 L 能产出多少」，制度、技术、配置效率都会改变它；单纯增加资本只沿生产函数移动，不改变 A。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '已知 gY = 5%、gK = 7%、gL = 1%，TFP 增长率 gA 是多少？',
        options: [
          { text: '2%', correct: true },
          { text: '3%' },
          { text: '4%' },
          { text: '1%' }
        ],
        explain: 'gA = gY − (1/3)gK − (2/3)gL = 5 − 2.33 − 0.67 = 2%。增长核算的权重必须用要素份额，不能用简单平均。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-4', tier: 3, type: 'fill', difficulty: 3, tags: ['calc'],
        stem: 'A = 10、K = 1000、L = 100 时，劳动的边际产品 MPL 约为多少？（保留两位小数）',
        answer: '14.36',
        accept: ['14.36', '14.4', '14.35'],
        explain: 'MPL = (2/3)·A·K^(1/3)·L^(−1/3) = (2/3)×10×10×0.2154 ≈ 14.36。可再用 wL + rK = Y = 2154 检验。'
      },

      /* ---------------- ch03 索洛模型 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '索洛模型中稳态的条件是什么？',
        options: [
          { text: 's·y = d·k，即人均投资等于人均折旧', correct: true },
          { text: 's = d' },
          { text: 'y = k' },
          { text: 'g = 0 且 A 增长' }
        ],
        explain: '稳态要求人均资本不再变化，即 Δk = s·y − d·k = 0，所以 s·y = d·k。注意不是 s = d，两者量纲不同。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: 's = 0.2、A = 10、d = 0.05，稳态人均产出 y* 约为多少？',
        options: [
          { text: '63.2', correct: true },
          { text: '40' },
          { text: '253' },
          { text: '30' }
        ],
        explain: 'y* = A(sA/d)^(1/2) = 10 × 40^(1/2) = 10 × 6.3249 ≈ 63.2。253 是稳态资本 k*，不要混淆。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '提高储蓄率会永久提高稳态的人均产出增长率。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '储蓄率提高只有水平效应：稳态收入从 63.2 升到 77.5，但到达新稳态后增长率仍为零。永久增长需要 A 持续增长。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'fill', difficulty: 2, tags: ['calc'],
        stem: 'A = 10、d = 0.05、s 从 0.2 升到 0.3，稳态人均产出 y* 约为多少？（保留一位小数）',
        answer: '77.5',
        accept: ['77.5', '77.46', '77.4'],
        explain: 'sA/d = 60，y* = 10 × 60^(1/2) ≈ 77.5，比原来的 63.2 高 22.5%。资本 k* 则从 253 升到 464.8。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些是索洛模型的特征？',
        options: [
          { text: '稳态人均增长率为零', correct: true },
          { text: '技术进步 A 是外生的', correct: true },
          { text: '参数相同的经济体条件收敛', correct: true },
          { text: '增长率由研发投入内生决定' }
        ],
        explain: '索洛模型的增长来自外生 A，稳态增长率为零，只解释水平差异与条件收敛；内生增长是罗默模型的特征。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '柯布-道格拉斯生产函数下，黄金律储蓄率等于什么？',
        options: [
          { text: '资本份额 1/3', correct: true },
          { text: '劳动份额 2/3' },
          { text: '折旧率 d' },
          { text: '1' }
        ],
        explain: '黄金律使稳态消费最大，一阶条件给出 s = 资本份额 = 1/3。超过 1/3 的储蓄率是动态无效率的：减少储蓄能让每代人消费更多。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'fill', difficulty: 1, tags: ['calc'],
        stem: 's = 0.2、d = 0.05 时，稳态资本产出比 K/Y 是多少？（只填数字）',
        answer: '4',
        accept: ['4', '4.0'],
        explain: '稳态时 K/Y = s/d = 0.2/0.05 = 4，与技术 A 无关。用 k*/y* = 253/63.2 ≈ 4 也能验证。'
      },

      /* ---------------- ch04 增长与思想 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '思想的「非竞争性」是指什么？',
        options: [
          { text: '一个人使用某个思想，不影响另一个人同时使用它', correct: true },
          { text: '思想不能被任何人拥有' },
          { text: '思想的生产不需要成本' },
          { text: '思想只能被一个国家使用' }
        ],
        explain: '非竞争性指使用上的不排他：配方可以被无数人同时使用而不减少。它与排他性（能否阻止别人使用）是两个不同维度。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: 'z = 0.0005、ℓ = 0.02、L = 1000，思想的增长率 gA 是多少？',
        options: [
          { text: '1%', correct: true },
          { text: '0.1%' },
          { text: '10%' },
          { text: '2%' }
        ],
        explain: 'L_at = ℓL = 20，gA = z·L_at = 0.0005 × 20 = 0.01，即 1%。按 70 法则，人均收入约 70 年翻倍。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '思想天然完全排他，所以市场对研发的供给是充分的。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '思想天然是非竞争性的，只能靠专利与版权获得部分排他性。排他不完全导致研发者收不回全部收益，市场供给不足，需要补贴或专利制度。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'fill', difficulty: 2, tags: ['calc'],
        stem: '同上参数，若研发人员比例 ℓ 升到 0.03，gA 是多少（%）？（只填数字）',
        answer: '1.5',
        accept: ['1.5', '1.5%'],
        explain: 'gA = z·ℓ·L = 0.0005 × 0.03 × 1000 = 0.015，即 1.5%。研发比例提高 50%，增长率也提高 50%，这是模型里线性关系的直接结果。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些政策具有增长效应（永久提高增长率）？',
        options: [
          { text: '研发补贴，提高研发人员比例', correct: true },
          { text: '改善科研基础设施，提高研发效率 z', correct: true },
          { text: '加强基础研究投入', correct: true },
          { text: '提高储蓄率' }
        ],
        explain: '增长效应来自提高 ℓ 或 z，让 gA 永久上升；提高储蓄率只有水平效应，改变稳态收入但不改变长期增长率。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '罗默模型规模效应的主要问题是什么？',
        options: [
          { text: '预言太强：人口越多增长率越高，横截面数据不支持', correct: true },
          { text: '完全无法用数学表达' },
          { text: '假设了价格完全灵活' },
          { text: '无法解释资本积累' }
        ],
        explain: 'gA = z·ℓ·L 对 L 线性，若成立则人口翻倍增长率翻倍，历史上早该出现天文数字的增长。查尔斯·琼斯因此提出研发报酬递减的半内生增长模型。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '索洛模型稳态时人均产出的增长率是多少（%）？（只填数字）',
        answer: '0',
        accept: ['0', '零', '0%'],
        explain: '稳态时 k 与 y 都是常数，增长率为零。这与数据中人均收入每年约 2% 的持续增长矛盾，正是罗默模型要补的缺口。'
      },

      /* ---------------- ch05 劳动市场 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: 's = 0.02、f = 0.40，稳态失业率 u* 约为多少？',
        options: [
          { text: '4.76%', correct: true },
          { text: '5.00%' },
          { text: '2.00%' },
          { text: '20.00%' }
        ],
        explain: 'u* = s/(s+f) = 0.02/0.42 ≈ 4.76%。注意分母是 s + f，不是 f；流入率与流出率共同决定失业率。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '衰退时失业率大幅上升，主要原因通常是？',
        options: [
          { text: '招聘冻结、失业者找到工作的概率 f 下降', correct: true },
          { text: '所有人都辞职' },
          { text: '劳动力总量突然减少' },
          { text: '工资立即大幅下降' }
        ],
        explain: '2008–09 年美国岗位空缺率从 3.4% 跌到 1.7%，f 下降是失业率上升的主因。仅靠 s 上升解释不了那么大的涨幅。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '失业率不包含没有工作也不找工作的人。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '失业率 = 失业者/劳动力，退出劳动力的人（灰心工人、全职照护者、退休者）不在分母也不在分子。所以失业率下降不一定代表变好。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'fill', difficulty: 2, tags: ['calc'],
        stem: 's = 0.03、f = 0.40，稳态失业率约为多少（%）？（保留两位小数）',
        answer: '6.98',
        accept: ['6.98', '6.98%', '7'],
        explain: 'u* = 0.03/0.43 ≈ 6.98%。流入率只升 1 个百分点，失业率却升了 2.2 个百分点，说明分母的放大效应。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '工资刚性（工资降不下去）的来源包括哪些？',
        options: [
          { text: '最低工资立法', correct: true },
          { text: '工会的集体谈判', correct: true },
          { text: '企业主动支付的效率工资', correct: true },
          { text: '完全竞争劳动市场' }
        ],
        explain: '最低工资、工会合同、效率工资与内部人权力都会让工资高于出清水平；完全竞争市场里工资可以自由调整，不会产生刚性失业。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '10 年后拿到 1000 美元，贴现率 5%，现值约为多少？',
        options: [
          { text: '613.9 美元', correct: true },
          { text: '1000 美元' },
          { text: '500 美元' },
          { text: '1628.9 美元' }
        ],
        explain: 'PDV = 1000/1.05^10 ≈ 613.9。1.05 的 10 次方约 1.629，所以现值是未来值除以 1.629；1628.9 是把复利方向搞反了。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '明瑟回归系数为 0.10，表示多读一年书工资约高多少（%）？（只填数字）',
        answer: '10',
        accept: ['10', '10%'],
        explain: '系数 0.10 对应 10% 的工资溢价，这是教育回报的常用估计。因果解释要谨慎：能力高的人可能本来就爱读书。'
      },

      /* ---------------- ch06 通货膨胀 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['calc'],
        stem: 'M = 1000、V = 5、Y = 2000，物价水平 P 是多少？',
        options: [
          { text: '2.5', correct: true },
          { text: '5', correct: false },
          { text: '10' },
          { text: '0.4' }
        ],
        explain: '由 MV = PY 得 P = MV/Y = 5000/2000 = 2.5。若 M 翻倍到 2000，V 与 Y 不变，P 变为 5，物价翻倍。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['calc'],
        stem: '货币增长 10%、速度不变、实际产出增长 3%，通胀率是多少？',
        options: [
          { text: '7%', correct: true },
          { text: '10%' },
          { text: '13%' },
          { text: '3%' }
        ],
        explain: 'π = gM + gV − gY = 10 + 0 − 3 = 7%。货币增长超过产出增长的部分才变成通胀，这是货币数量论的增长率形式。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '长期中货币供给变化只影响物价水平，不影响实际产出。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '这是货币中性：长期价格灵活，产出由生产函数决定，货币只改变 P。短期因价格粘性，货币才可能影响实际产出。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'fill', difficulty: 2, tags: ['calc'],
        stem: '名义利率 8%、通胀率 5%，精确的实际利率是多少（%）？（保留两位小数）',
        answer: '2.86',
        accept: ['2.86', '2.86%', '2.9'],
        explain: '精确式 r = (1+i)/(1+π) − 1 = 1.08/1.05 − 1 ≈ 2.86%。近似式 r ≈ i − π = 3%，通胀越高近似误差越大。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '通货膨胀的成本包括下列哪些？',
        options: [
          { text: '鞋底成本：为少持现金多跑银行', correct: true },
          { text: '菜单成本：频繁改价消耗资源', correct: true },
          { text: '财富在债权人与债务人之间的再分配', correct: true },
          { text: '提高实际产出与就业' }
        ],
        explain: '通胀的成本包括鞋底成本、菜单成本、税制扭曲、再分配与不确定性；它不会提高实际产出，长期反而损害增长。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '牺牲率衡量的是什么？',
        options: [
          { text: '通胀每降低 1 个百分点所损失的累计 GDP 百分比', correct: true },
          { text: '失业率每上升 1 个百分点所损失的通胀', correct: false },
          { text: '央行加息的幅度' },
          { text: '货币增长与通胀的差额' }
        ],
        explain: '牺牲率 = 累计产出损失 / 通胀下降的百分点数，美国的估计约 2 到 3。预期越可信，牺牲率越低。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'fill', difficulty: 1, tags: ['calc'],
        stem: '货币供给从 1000 翻倍到 2000，V 与 Y 不变，物价水平从 2.5 变为多少？（只填数字）',
        answer: '5',
        accept: ['5', '5.0'],
        explain: 'P = MV/Y，M 翻倍而 V、Y 不变，P 也翻倍，从 2.5 变为 5。这是货币中性的最简演示。'
      },

      /* ---------------- ch07 短期波动 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['calc'],
        stem: '产出缺口为 −6%，按奥肯定律失业率约上升多少个百分点？',
        options: [
          { text: '3 个百分点', correct: true },
          { text: '6 个百分点' },
          { text: '1.5 个百分点' },
          { text: '12 个百分点' }
        ],
        explain: 'Δu ≈ −0.5 × (−6%) = +3 个百分点。2008–09 年实际升幅更大，因为部分失业者退出了劳动力。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: 'IS 曲线向下倾斜（产出缺口随利率上升而下降）的原因是？',
        options: [
          { text: '利率上升提高投资机会成本、压低消费与净出口', correct: true },
          { text: '利率上升直接提高潜在产出' },
          { text: '利率上升让央行印更多钱' },
          { text: '利率上升降低通胀预期' }
        ],
        explain: '实际利率上升使投资的机会成本变大、耐用品消费推迟、本币升值抑制出口，总需求下降，产出缺口转负。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '名义利率触及零下限时，常规降息空间受限，需要财政政策补位。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '零下限（ZLB）锁住了常规货币政策，2008–09 与 2020 年都出现这种情况，美联储转向 QE 与前瞻指引，财政部推出大规模刺激。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'fill', difficulty: 2, tags: ['calc'],
        stem: 'π = π(−1) + (1/3)Ỹ，若 Ỹ = 3%，通胀率上升多少个百分点？（只填数字）',
        answer: '1',
        accept: ['1', '1 个百分点'],
        explain: 'π − π(−1) = (1/3) × 3% = 1 个百分点。通胀有惯性，产出缺口只改变通胀的变化量，不改变其水平。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '2008–09 年美国应对危机的政策包括哪些？',
        options: [
          { text: '量化宽松（QE），购买国债与 MBS', correct: true },
          { text: 'TARP，救助金融机构', correct: true },
          { text: 'ARRA，约 7870 亿美元的财政刺激', correct: true },
          { text: '大幅加息以抑制通胀' }
        ],
        explain: '危机中美联储降息到零并启动 QE，财政部推出 TARP，国会通过 ARRA；政策方向是宽松而不是加息，因为当时通胀在下降。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '油价大幅上涨（供给冲击）在短期模型中的效果是？',
        options: [
          { text: '通胀上升、产出下降', correct: true },
          { text: '通胀上升、产出上升' },
          { text: '通胀下降、产出上升' },
          { text: '通胀与产出都不变' }
        ],
        explain: '供给冲击让 AS 曲线上移：成本上升推高通胀，同时挤压利润与实际收入、压低产出。这种「滞胀」让政策陷入两难。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'fill', difficulty: 2, tags: ['calc'],
        stem: 'R = r* + π + 0.5(π − π*) + 0.5Ỹ，r* = 2、π = 2、π* = 2、Ỹ = 0，R 是多少（%）？（只填数字）',
        answer: '4',
        accept: ['4', '4%'],
        explain: 'R = 2 + 2 + 0.5×0 + 0.5×0 = 4%。这是中性利率：通胀等于目标、产出缺口为零时，名义利率等于实际利率加通胀。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
