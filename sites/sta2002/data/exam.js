/* =====================================================================
 * exam.js · STA2002 模拟卷 A
 * 范围：ch00–ch07（分布基础 / 抽样分布 / 点估计 / 估计量评价 /
 *       置信区间 / 假设检验 / 常见检验与综合应用）
 * 规格：12 题、满分 100、限时 100 分钟
 * 题型：choice / tf / fill / output / keywords
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerExam({
    id: 'STA2002-A',
    title: '模拟卷 A',
    style: '期末风格',
    subtitle: 'STA2002 · 覆盖 ch00–ch07 的综合模拟',
    date: '2026-11-21',
    minutes: 100,
    totalScore: 100,
    summary: '本卷覆盖八章全部内容：随机变量与分布、抽样分布与极限定理、矩法与极大似然、' +
      '估计量的偏差与方差、充分性与 Fisher 信息、置信区间、假设检验与功效、常见检验与 A/B 应用。' +
      '卷面 12 题：选择 2 题共 16 分、判断 2 题共 16 分、填空 2 题共 16 分、计算输出 4 题共 32 分、' +
      '简答 2 题共 20 分。建议闭卷限时完成，计算题写清公式与代入过程，简答题按关键词作答。',
    instructions: [
      '时间 100 分钟，满分 100 分。计时开始后不会暂停，刷新页面也按真实时间计算。',
      '题型：单项选择 2 题、判断 2 题、填空 2 题、计算输出 4 题、简答 2 题。',
      '计算题必须写出统计量、自由度与关键代入步骤；只写答案不给过程分。',
      '概率与分位数可使用近似值：z0.025 = 1.96、z0.05 = 1.645、t24,0.025 = 2.064、χ²1,0.95 = 3.841。',
      '简答题按关键词命中比例给分，答出要点即可，不必展开成段落。'
    ],
    questions: [
      /* ---------------------------------------------------------- Q1 */
      { no: 1, points: 8, type: 'single choice',
        intro: '本题考察常见分布的期望、方差与线性变换。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '已知 <code>Var(X) = 4</code>，则 <code>Var(3X − 2)</code> 等于？',
            options: [
              { text: '10' },
              { text: '34' },
              { text: '36', correct: true },
              { text: '12' }
            ],
            explain: '<code>Var(aX+b) = a²Var(X)</code>，常数平移不改变离散程度，斜率要平方：<code>9 × 4 = 36</code>。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '若 <code>X ~ Exp(λ = 0.5)</code>，则 <code>E(X)</code> 与 <code>Var(X)</code> 分别是？',
            options: [
              { text: '2 和 4', correct: true },
              { text: '0.5 和 0.25' },
              { text: '2 和 2' },
              { text: '0.5 和 2' }
            ],
            explain: '指数分布均值 <code>1/λ</code>、方差 <code>1/λ²</code>，代入 λ = 0.5 得 2 与 4。均值与标准差相等，这是指数分布的特征。' }
        ] },

      /* ---------------------------------------------------------- Q2 */
      { no: 2, points: 8, type: 'true / false',
        intro: '判断下列陈述的真假，并说明理由。',
        parts: [
          { label: '(a)', points: 4, kind: 'tf',
            prompt: '连续随机变量的密度函数 <code>f(x)</code> 可以大于 1。',
            options: [
              { text: '正确', correct: true },
              { text: '错误' }
            ],
            explain: '密度不是概率，只要求非负且全积分为 1。例如 <code>U(0, 0.5)</code> 的密度在区间内恒为 2。区间概率是密度在区间上的积分，仍不超过 1。' },
          { label: '(b)', points: 4, kind: 'tf',
            prompt: '两个随机变量不相关，则它们一定独立。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '独立可推出不相关，反之不成立。反例：<code>X ~ U(−1,1)</code>、<code>Y = X²</code>，协方差为 0 但 Y 由 X 完全决定。只有联合正态时两者等价。' }
        ] },

      /* ---------------------------------------------------------- Q3 */
      { no: 3, points: 8, type: 'fill in the blank',
        intro: '填写数值，保留合适的小数位。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '总体标准差 σ = 10、样本量 n = 100，则样本均值的标准误等于多少？',
            explain: '<code>SE = σ/√n = 10/10 = 1</code>。标准误衡量 x̄ 的抽样波动，n 越大越小，与 <code>√n</code> 成反比。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '样本量 n = 25、总体正态但 σ 未知，检验均值时 t 统计量的自由度是多少？',
            explain: '自由度 <code>n − 1 = 24</code>。用 s 估计 σ 消耗了一个自由度；查表应查 <code>t<sub>24</sub></code>，而不是 25 或 26。' }
        ] },

      /* ---------------------------------------------------------- Q4 */
      { no: 4, points: 8, type: 'single choice',
        intro: '本题考察矩估计与极大似然估计。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '设 <code>X₁,…,Xₙ ~ Uniform(0, θ)</code>，θ 的极大似然估计是？',
            options: [
              { text: '<code>2x̄</code>' },
              { text: '<code>max(x₁,…,xₙ)</code>', correct: true },
              { text: '<code>min(x₁,…,xₙ)</code>' },
              { text: '<code>x̄/2</code>' }
            ],
            explain: '似然在 <code>θ ≥ max xᵢ</code> 时为 <code>θ<sup>−n</sup></code>，随 θ 递减，故取可行域下界 <code>max xᵢ</code>。矩估计才是 <code>2x̄</code>，两者不同。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '样本 3、1、2、4 来自泊松分布，λ 的极大似然估计是？',
            options: [
              { text: '2' },
              { text: '2.5', correct: true },
              { text: '3' },
              { text: '10' }
            ],
            explain: '泊松 MLE 为样本均值：<code>(3+1+2+4)/4 = 2.5</code>。得分函数 <code>Σxᵢ/λ − n = 0</code> 直接解出。' }
        ] },

      /* ---------------------------------------------------------- Q5 */
      { no: 5, points: 8, type: 'true / false',
        intro: '判断下列关于估计量性质的陈述。',
        parts: [
          { label: '(a)', points: 4, kind: 'tf',
            prompt: '极大似然估计在任何模型下都是无偏的。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: 'MLE 不保证有限样本无偏：正态方差 MLE 期望为 <code>(n−1)σ²/n</code>，均匀 θ 的 MLE 期望为 <code>nθ/(n+1)</code>。它的优点是相合、渐近正态与渐近有效。' },
          { label: '(b)', points: 4, kind: 'tf',
            prompt: '样本方差 <code>s² = Σ(xᵢ−x̄)²/(n−1)</code> 是总体方差的无偏估计。',
            options: [
              { text: '正确', correct: true },
              { text: '错误' }
            ],
            explain: '<code>E[Σ(xᵢ−x̄)²] = (n−1)σ²</code>，故除以 n−1 后期望为 σ²。除以 n 的版本是 MLE，偏低 <code>σ²/n</code>。' }
        ] },

      /* ---------------------------------------------------------- Q6 */
      { no: 6, points: 8, type: 'fill in the blank',
        intro: '填写数值或表达式。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '<code>X ~ Bernoulli(p)</code>，n = 100、p = 0.5 时，Cramér-Rao 下界等于多少？',
            explain: 'Bernoulli 的 Fisher 信息为 <code>1/[p(1−p)]</code>，n 个样本为 <code>n/[p(1−p)]</code>，其倒数为 <code>p(1−p)/n = 0.25/100 = 0.0025</code>。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: 'n = 100、σ = 10、95% 置信水平下，均值置信区间的半宽是多少？',
            explain: '<code>1.96 × 10/√100 = 1.96</code>。半宽与 σ 成正比、与 <code>√n</code> 成反比。' }
        ] },

      /* ---------------------------------------------------------- Q7 */
      { no: 7, points: 8, type: 'single choice',
        intro: '本题考察假设检验的逻辑。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: 'p 值的定义是？',
            options: [
              { text: 'H₀ 为真的概率' },
              { text: 'H₀ 下得到当前或更极端结果的概率', correct: true },
              { text: 'H₁ 为真的概率' },
              { text: '结论出错的概率' }
            ],
            explain: 'p 值以 H₀ 为前提，计算样本结果及更极端情况的概率。它既不是 H₀ 为真的概率，也不是决策错误率。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '样本量不变，把 α 从 0.05 降到 0.01，通常会导致？',
            options: [
              { text: 'β 增大，功效下降', correct: true },
              { text: 'β 减小，功效上升' },
              { text: '两类错误同时减小' },
              { text: '两类错误都不变' }
            ],
            explain: '拒绝门槛更严会减少误报，但真实效应更容易漏掉，β 增大、功效 <code>1−β</code> 下降。要同时降低两类错误只能增大样本量或提高效应量。' }
        ] },

      /* ---------------------------------------------------------- Q8 */
      { no: 8, points: 8, type: 'short answer',
        intro: '用 2–3 句话回答，按关键词给分。',
        parts: [
          { label: '(a)', points: 4, kind: 'keywords',
            prompt: '解释「95% 置信区间」的含义，并指出一种常见误读。',
            explain: '关键词：重复抽样、同样方法构造、约 95% 的区间覆盖参数、参数固定而区间随机。误读：说「μ 有 95% 概率落在这次算出的区间内」——具体区间端点是固定的，事件非真即假。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '什么是检验的功效？列出两个能提高功效的因素。',
            explain: '功效 = <code>1 − β</code>，即 H₁ 为真时正确拒绝 H₀ 的概率。提高途径：增大样本量、增大效应量（或降低测量误差）、适当放宽 α、改用更有效的检验。' }
        ] },

      /* ---------------------------------------------------------- Q9 */
      { no: 9, points: 8, type: 'calculation',
        intro: '写出公式与代入过程，给出数值结果。',
        parts: [
          { label: '(a)', points: 4, kind: 'output',
            prompt: '电池样本 n = 25、x̄ = 968、s = 90，检验 <code>H₀: μ = 1000</code> 对 <code>H₁: μ &lt; 1000</code>。求 t 统计量。',
            explain: '<code>t = (968 − 1000)/(90/√25) = −32/18 ≈ −1.778</code>，df = 24。左单侧 p ≈ 0.044，小于 0.05，拒绝 H₀；若做双侧检验，p ≈ 0.088，则不拒绝——方向要在看数据前定好。' },
          { label: '(b)', points: 4, kind: 'output',
            prompt: '2×2 列联表：A 组 100 人中 30 人成功，B 组 100 人中 40 人成功。求卡方独立性检验的统计量。',
            explain: '合并比例 <code>p̂ = 70/200 = 0.35</code>，各格期望 35、65。<code>χ² = 2×(25/35) + 2×(25/65) ≈ 1.429 + 0.769 = 2.198</code>，df = 1。它等于两比例 z 统计量的平方：<code>z ≈ −1.482</code>，<code>z² ≈ 2.20</code>。' }
        ] },

      /* ---------------------------------------------------------- Q10 */
      { no: 10, points: 8, type: 'calculation',
        intro: '写出公式与代入过程，给出数值结果。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '回归斜率 <code>b₁ = 0.8</code>、<code>SE(b₁) = 0.0894</code>，求 <code>H₀: β₁ = 0</code> 的 t 值（保留两位小数）。',
            explain: '<code>t = 0.8/0.0894 ≈ 8.95</code>，df = n − 2。远大于临界值 2.10（df = 18），p 远小于 0.05，拒绝斜率为零。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '单因素方差分析：三组各 10 人，SSB = 120、SSW = 540，求 F 值。',
            explain: '<code>MSB = 120/2 = 60</code>、<code>MSW = 540/27 = 20</code>、<code>F = 3.0</code>，df = (2, 27)。临界值约 3.35，故在 5% 水平不拒绝「三组均值相等」。' }
        ] },

      /* ---------------------------------------------------------- Q11 */
      { no: 11, points: 10, type: 'short answer',
        intro: '按要点作答，每小题 5 分。',
        parts: [
          { label: '(a)', points: 5, kind: 'keywords',
            prompt: '写出第一类错误与第二类错误的定义，并说明 α、β 与功效的关系。',
            explain: '第一类：H₀ 真却拒绝，概率 α；第二类：H₀ 假却没拒绝，概率 β。功效 = <code>1−β</code>。样本量固定时 α 减小则 β 增大；增大 n、增大效应量可同时改善两者。' },
          { label: '(b)', points: 5, kind: 'keywords',
            prompt: 'A/B 测试中为什么不能反复查看 p 值并及时停止？给出一种正确做法。',
            explain: '每次查看都是一次检验，多次检验会膨胀整体第一类错误（peeking）。正确做法：预先固定样本量与主要指标，跑完再分析；确需中期监测则用 alpha spending 或组序贯设计。' }
        ] },

      /* ---------------------------------------------------------- Q12 */
      { no: 12, points: 10, type: 'calculation',
        intro: '综合应用题，写出关键步骤。',
        parts: [
          { label: '(a)', points: 5, kind: 'output',
            prompt: 'A 组 100 人 30 人转化、B 组 100 人 40 人转化，求两比例 z 检验的 z 值（保留两位小数）。',
            explain: '<code>p̂ = 0.35</code>，<code>SE = √(0.35×0.65×2/100) ≈ 0.0675</code>，<code>z = (0.30−0.40)/0.0675 ≈ −1.48</code>。双侧 p ≈ 0.14，不拒绝；区间包含 0，不能宣称两组相同，只能说未发现显著差异。' },
          { label: '(b)', points: 5, kind: 'output',
            prompt: '基线转化率 10%，希望检出 11% 的提升（10% → 11%），α = 0.05、功效 0.8。按每组样本量公式估算 n（可用近似）。',
            explain: '<code>n = (1.645+0.841)²×[0.1×0.9 + 0.11×0.89]/0.01² ≈ 6.18×0.1879/0.0001 ≈ 11,612</code> 每组。检出 1 个百分点的提升需要两万多人，样本不足时「不显著」几乎必然。' }
        ] }
    ]
  });
})();
