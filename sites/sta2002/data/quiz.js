/* =====================================================================
 * quiz.js · STA2002 分章题库
 * 结构：{ items:[{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options?, answer?, accept?, explain }] }
 * 题型：mcq / tf / fill / multi
 * 覆盖：ch00–ch07，每章 7 题，共 49 题；q1–q3 与正文内嵌小测对应
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '统计推断要解决的核心问题是下面哪一个？',
        options: [
          { text: '已知总体分布，计算样本恰好取某个值的概率' },
          { text: '只掌握样本，却要对总体参数下结论并说明不确定性', correct: true },
          { text: '把样本数据完整地描述一遍，不做任何推广' },
          { text: '证明每一次抽样都必然得到相同的样本均值' }
        ],
        explain: '推断的方向是「样本 → 总体」：总体参数未知，样本可观测，于是用统计量估计参数、用区间表达精度、用检验判断证据。已知分布算概率属于概率论，是反方向。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '概率论从已知的分布出发推导数据的行为，统计学则从数据出发推断分布或参数。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '这正是两门课的分工。概率论给定 θ 和分布，问「数据会怎样」；统计学只看到数据，问「θ 可能是多少、证据够不够」。推断的不确定性来自抽样，而不是来自分布本身。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '本站把统计推断的方法主线概括为三条，它们是？',
        options: [
          { text: '描述、可视化、汇报' },
          { text: '点估计、区间估计、假设检验', correct: true },
          { text: '抽样、随机化、重复实验' },
          { text: '正态、二项、泊松' }
        ],
        explain: '点估计给一个数，区间估计给一个范围，假设检验给一个判决。三者共用同一套抽样分布理论，也互相换算：区间与检验对偶，估计量的方差决定区间宽度与检验功效。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '电池寿命例子中，μ 与 x̄ 的角色分别是？',
        options: [
          { text: 'μ 是样本均值，x̄ 是总体均值' },
          { text: 'μ 是未知的总体参数，x̄ 是可计算的样本统计量', correct: true },
          { text: '两者都是随机变量，且取值一定相同' },
          { text: 'μ 是标准差，x̄ 是均值' }
        ],
        explain: 'μ 是总体均值，固定但未知；x̄ 由样本算出，随抽样而变，是统计量。所有推断都在问：这个会变的 x̄ 离固定的 μ 有多远，这种距离的分布能否用样本自己估出来。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '本站约定用希腊字母 θ 表示总体的______（填一个中文词）。',
        answer: '参数',
        accept: ['总体参数', '未知参数', '参数'],
        explain: 'θ 是总体参数，如均值 μ、比例 p、方差 σ²；带帽子的 θ̂ 表示它的估计量。把「参数」与「统计量」分清，是后面所有公式的前提。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['method'],
        stem: '下面哪些是本课程推荐的做题习惯？（多选）',
        options: [
          { text: '先看数据分布与异常点，再选方法', correct: true },
          { text: '先写清 H₀ 与 H₁，再算统计量', correct: true },
          { text: '报告结果时同时给出区间与效应量', correct: true },
          { text: '只要 p 小于 0.05 就说明效应很大' },
          { text: '算完点估计就可以，不必报告不确定性' }
        ],
        explain: '看图、定假设、报区间是三条基本功。p 值小只说明「不太可能是噪声」，与效应大小无关；只报点估计则隐藏了抽样误差，读者无法判断结果的精度。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-8', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['method'],
        stem: '关于本站的练习节奏，下面哪种安排最合理？',
        options: [
          { text: '先背完所有公式，再一次性做模拟卷' },
          { text: '读一节正文并做内嵌小测，再刷该章题库，最后用模拟卷检验', correct: true },
          { text: '直接做模拟卷，错了再回头看书' },
          { text: '只看例题，不做任何练习' }
        ],
        explain: '内嵌小测紧跟刚读的内容，用来即时检查理解；章末题库覆盖全章，用来暴露盲点；模拟卷用来练时间分配与综合题。三者顺序反过来，容易在基础不牢时反复受挫。'
      },

      /* ---------------- ch01 随机变量与常见分布 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '设连续随机变量 X 的密度为 f(x)，下面哪条性质一定成立？',
        options: [
          { text: '<code>f(x) = P(X = x)</code>' },
          { text: '<code>f(x) ≥ 0</code> 且 <code>∫f(x)dx = 1</code>', correct: true },
          { text: '<code>f(x)</code> 的取值必须在 0 与 1 之间' },
          { text: '<code>P(a &lt; X &lt; b) = f(b) − f(a)</code>' }
        ],
        explain: '密度非负且全积分为 1；单个点的概率为 0，所以 f(x) 不是概率，也可以大于 1（只要积分仍为 1）。区间概率是密度在区间上的积分，不是端点相减。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['calculation'],
        stem: '已知 <code>Var(X) = 4</code>，则 <code>Var(3X − 2)</code> 等于？',
        options: [
          { text: '10' },
          { text: '34' },
          { text: '36', correct: true },
          { text: '12' }
        ],
        explain: '方差对线性变换的性质是 <code>Var(aX + b) = a²Var(X)</code>：常数平移不影响离散程度，斜率要平方。所以 <code>9 × 4 = 36</code>，与 −2 无关。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'fill', difficulty: 1,
        tags: ['calculation'],
        stem: '若 <code>X ~ Exp(λ = 0.5)</code>，则 <code>E(X)</code> 等于多少？（填数字）',
        answer: '2',
        accept: ['2', '2.0'],
        explain: '指数分布的均值是 <code>1/λ</code>，代入得 <code>1/0.5 = 2</code>。注意别把 λ 当成均值：λ 越大，衰减越快，均值越小。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '下面哪个关系式正确？',
        options: [
          { text: '<code>Var(X) = E(X²) − [E(X)]²</code>', correct: true },
          { text: '<code>Var(X) = E(X²) + [E(X)]²</code>' },
          { text: '<code>Var(X) = [E(X)]² − E(X²)</code>' },
          { text: '<code>Var(X) = E(X²)</code>' }
        ],
        explain: '这是方差的计算公式，展开 <code>E[(X−μ)²]</code> 即得。它把「先平方再平均」与「均值平方」分开，手算时通常比直接按定义算更快。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '两个随机变量不相关，就一定能推出它们独立。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '独立可以推出不相关，但反过来不成立。经典反例是 <code>X ~ U(−1,1)</code>、<code>Y = X²</code>：协方差为 0，但 Y 完全由 X 决定。只有当联合分布是二元正态时，不相关才等价于独立。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '做 10 次独立重复试验，每次成功概率为 0.3，记成功次数为 X，则 X 的分布是？',
        options: [
          { text: '<code>Poisson(3)</code>' },
          { text: '<code>Binomial(10, 0.3)</code>', correct: true },
          { text: '<code>Geometric(0.3)</code>' },
          { text: '<code>Normal(3, 2.1)</code>' }
        ],
        explain: '固定次数 n、每次独立、成功概率相同，成功次数服从二项分布。泊松是「次数不固定、平均发生率已知」的计数；几何分布数的是「第一次成功前的失败次数」。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '若 X 与 Y 独立，<code>P(X = 1) = 0.5</code>、<code>P(Y = 1) = 0.4</code>，则 <code>P(X = 1, Y = 1)</code> 等于？（填小数）',
        answer: '0.2',
        accept: ['0.2', '0.20'],
        explain: '独立时联合概率等于边缘概率之积：<code>0.5 × 0.4 = 0.2</code>。这条性质对离散与连续（换成密度）都成立，是因子分解与充分统计量的起点。'
      },

      /* ---------------- ch02 抽样分布与极限定理 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '样本均值 x̄ 的标准误（standard error）是？',
        options: [
          { text: '<code>σ</code>' },
          { text: '<code>σ/√n</code>', correct: true },
          { text: '<code>σ²/n</code>' },
          { text: '<code>s/√n</code> 在任何情形下都精确成立' }
        ],
        explain: '若总体标准差为 σ，则 <code>Var(x̄) = σ²/n</code>，标准误是 <code>σ/√n</code>。σ 未知时用 s 代替，得到的是估计的标准误；小样本下还要改用 t 分布。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '正态总体、σ 未知时，统计量 <code>(x̄ − μ)/(s/√n)</code> 服从？',
        options: [
          { text: '标准正态 <code>N(0,1)</code>' },
          { text: '<code>t<sub>n−1</sub></code>', correct: true },
          { text: '<code>χ²<sub>n−1</sub></code>' },
          { text: '<code>F<sub>1,n−1</sub></code>' }
        ],
        explain: '分子是正态、分母里的 <code>(n−1)s²/σ²</code> 是卡方，两者独立，按定义得到自由度 n−1 的 t。若 σ 已知就用 z；若 n 很大，t 与 z 几乎重合，但考试仍应写出 t 与自由度。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '<code>X ~ Binomial(100, 0.5)</code>，用连续性修正计算 <code>P(X ≤ 55)</code> 时，标准化后的 z 值约为多少？（填小数，保留一位）',
        answer: '1.1',
        accept: ['1.1', '1.10', '1.1'],
        explain: '连续性修正把 55 扩展到 55.5，均值 50、标准差 <code>√(100×0.5×0.5) = 5</code>，于是 <code>z = (55.5 − 50)/5 = 1.1</code>，概率约 <code>Φ(1.1) = 0.864</code>。不修正会得到 <code>z = 1</code>、概率 0.841，差了约 2 个百分点。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '正态总体下，<code>(n−1)s²/σ²</code> 服从自由度为多少的卡方分布？',
        options: [
          { text: '<code>n</code>' },
          { text: '<code>n−1</code>', correct: true },
          { text: '<code>n−2</code>' },
          { text: '<code>2n</code>' }
        ],
        explain: '因为 s² 用掉了样本均值这一个约束，离差平方和只有 n−1 个自由度。这也解释了为什么 s² 的分母是 n−1：这样 <code>E(s²) = σ²</code>。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '大数定律说明：当 n 增大时，样本均值 x̄ 依概率收敛到总体均值 μ。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '这是弱大数定律的结论，只需要有限均值，不要求正态。它保证「平均起来会靠拢」，但不描述 x̄ 的分布形状，也不给出误差的概率上界——后者是中心极限定理与切比雪夫不等式的事。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['calculation'],
        stem: '样本量从 100 增加到 400，样本均值的标准误变为原来的？',
        options: [
          { text: '1/4' },
          { text: '1/2', correct: true },
          { text: '1/16' },
          { text: '不变' }
        ],
        explain: '标准误与 <code>√n</code> 成反比：n 变 4 倍，<code>√n</code> 变 2 倍，标准误减半。这也意味着精度翻倍需要 4 倍样本量，边际成本递增。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '要求 95% 置信区间的半宽不超过 2，已知 σ = 10，按 <code>n ≥ (1.96σ/E)²</code> 计算，样本量至少为多少？（填整数）',
        answer: '97',
        accept: ['97', '96.04 向上取整'],
        explain: '<code>(1.96 × 10/2)² = 9.8² = 96.04</code>，样本量必须向上取整为 97。若填 96，半宽会略大于 2；样本量问题永远向「更保守」的方向取整。'
      },

      /* ---------------- ch03 点估计 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['calculation'],
        stem: '设 <code>X ~ Exp(λ)</code>，用一阶矩法估计 λ，结果是？',
        options: [
          { text: '<code>λ̂ = x̄</code>' },
          { text: '<code>λ̂ = 1/x̄</code>', correct: true },
          { text: '<code>λ̂ = x̄/2</code>' },
          { text: '<code>λ̂ = 1/x̄²</code>' }
        ],
        explain: '矩法令总体矩等于样本矩：<code>E(X) = 1/λ = x̄</code>，解得 <code>λ̂ = 1/x̄</code>。注意它与 MLE 相同纯属指数分布的巧合；换成正态或均匀分布，两种方法可能给出不同答案。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '设 <code>X₁,…,Xₙ ~ Uniform(0, θ)</code>，θ 的极大似然估计是？',
        options: [
          { text: '<code>2x̄</code>' },
          { text: '<code>max(x₁,…,xₙ)</code>', correct: true },
          { text: '<code>min(x₁,…,xₙ)</code>' },
          { text: '<code>x̄/2</code>' }
        ],
        explain: '似然函数在 <code>θ ≥ max xᵢ</code> 时为 <code>θ<sup>−n</sup></code>，随 θ 增大而减小，所以要在可行域内取最小的 θ，即样本最大值。这个 MLE 是有偏的：<code>E(max) = nθ/(n+1)</code>，乘 <code>(n+1)/n</code> 才无偏。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'fill', difficulty: 1,
        tags: ['calculation'],
        stem: '样本为 3、1、2、4，来自泊松分布，则 λ 的极大似然估计为多少？（填小数）',
        answer: '2.5',
        accept: ['2.5', '2.50'],
        explain: '泊松的 MLE 是样本均值：<code>(3+1+2+4)/4 = 2.5</code>。推导上，得分函数 <code>Σxᵢ/λ − n = 0</code> 直接给出 <code>λ̂ = x̄</code>。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '极大似然估计在任何模型下都是无偏估计。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'MLE 只保证「最像这批数据」，不保证无偏。正态方差的 MLE 除以 n，期望是 <code>(n−1)σ²/n</code>；均匀分布 θ 的 MLE 是样本最大值，期望 <code>nθ/(n+1)</code>，都偏低。MLE 的优点是一致性、渐近正态与渐近有效，不是有限样本无偏。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['method'],
        stem: '求 MLE 时通常先取对数，主要原因是？',
        options: [
          { text: '对数把乘积变成求和，求导更容易，且不改变最大值位置', correct: true },
          { text: '取对数后方差变小' },
          { text: '取对数后估计量自动无偏' },
          { text: '对数似然一定比似然大' }
        ],
        explain: '对数单调递增，<code>argmax log L = argmax L</code>；同时把连乘转成连加，得分函数变成一项项相加，数值上也避免了下溢。它是计算技巧，不改变估计量的统计性质。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '若 θ̂ 是 θ 的 MLE，g 是单调函数，则 g(θ) 的 MLE 是？',
        options: [
          { text: '<code>g(θ̂)</code>', correct: true },
          { text: '<code>θ̂</code>' },
          { text: '<code>g<sup>−1</sup>(θ̂)</code>' },
          { text: '无法确定' }
        ],
        explain: '这是不变性原理（invariance）：似然在参数变换下只差一个雅可比因子，而雅可比与参数无关时不影响最大值位置，所以把 MLE 直接代入 g 即可。例如 <code>σ̂²</code> 的 MLE 开方就是 <code>σ̂</code>。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'fill', difficulty: 1,
        tags: ['calculation'],
        stem: '20 次伯努利试验中有 8 次成功，成功概率 p 的 MLE 为多少？（填小数）',
        answer: '0.4',
        accept: ['0.4', '0.40'],
        explain: '伯努利似然 <code>p<sup>S</sup>(1−p)<sup>n−S</sup></code> 的 MLE 是 <code>p̂ = S/n = 8/20 = 0.4</code>。这也等于矩估计，因为伯努利的均值就是 p。'
      },

      /* ---------------- ch04 估计量的评价与充分性 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '样本方差 <code>s² = Σ(xᵢ − x̄)²/(n−1)</code> 的分母取 n−1，是为了？',
        options: [
          { text: '让 s² 成为 σ² 的无偏估计', correct: true },
          { text: '让 s² 的方差最小' },
          { text: '让 s² 服从卡方分布' },
          { text: '让计算更简单' }
        ],
        explain: '<code>E[Σ(xᵢ−x̄)²] = (n−1)σ²</code>，所以除以 n−1 后期望正好是 σ²。除以 n 得到的是 MLE，偏小 <code>σ²/n</code>。无偏性不是唯一标准，但在教学与软件默认输出里，s² 通常指无偏版本。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '对 <code>Bernoulli(p)</code> 样本，p 的充分统计量是？',
        options: [
          { text: '样本最大值' },
          { text: '成功次数 <code>ΣXᵢ</code>', correct: true },
          { text: '样本均值与样本方差' },
          { text: '第一个观测 <code>X₁</code>' }
        ],
        explain: '把似然写成 <code>p<sup>Σxᵢ</sup>(1−p)<sup>n−Σxᵢ</sup></code>，按因子分解定理，<code>ΣXᵢ</code> 是充分统计量。直观上，知道总成功次数后，具体哪几次成功不再提供 p 的信息。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '<code>X ~ Bernoulli(p)</code>，n = 100、p = 0.5 时，Cramér-Rao 下界等于多少？（填小数）',
        answer: '0.0025',
        accept: ['0.0025', '1/400', '0.00250'],
        explain: '伯努利的 Fisher 信息是 <code>1/[p(1−p)]</code>，n 个样本为 <code>n/[p(1−p)]</code>，CRLB 是它的倒数 <code>p(1−p)/n = 0.25/100 = 0.0025</code>。而 <code>p̂</code> 的方差正好等于它，所以 <code>p̂</code> 达到下界。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '均方误差 MSE 与方差、偏差的关系是？',
        options: [
          { text: '<code>MSE = Var + Bias²</code>', correct: true },
          { text: '<code>MSE = Var − Bias²</code>' },
          { text: '<code>MSE = Var × Bias</code>' },
          { text: '<code>MSE = Bias²</code>' }
        ],
        explain: '把 <code>E[(θ̂−θ)²]</code> 在 <code>E(θ̂)</code> 处展开，交叉项为零，得到方差加偏差平方。它说明「稍微有偏但方差很小」的估计量可能比无偏但方差大的更好，这是收缩估计的出发点。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '一个无偏估计量一定比任何有偏估计量的 MSE 小。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '反例很多：正态均值用收缩估计 <code>cX̄</code>，当 μ 接近 0 时 MSE 更小；均匀分布用 <code>(n+1)/n·max</code> 无偏，但 <code>2X̄</code> 有偏、方差却只有前者的 <code>7/15</code> 左右（n=5 时 θ²/15 对 θ²/35）。评价估计量要同时看偏差与方差。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '<code>X ~ Poisson(λ)</code> 的 Fisher 信息（单个观测）是？',
        options: [
          { text: '<code>λ</code>' },
          { text: '<code>1/λ</code>', correct: true },
          { text: '<code>1/λ²</code>' },
          { text: '<code>λ²</code>' }
        ],
        explain: '对数似然 <code>x log λ − λ</code> 的二阶导为 <code>−x/λ²</code>，取负期望得 <code>1/λ</code>。于是 n 个样本的 CRLB 为 <code>λ/n</code>，而 <code>x̄</code> 的方差正好是 <code>λ/n</code>，达到下界。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '对 <code>Uniform(0, θ)</code>，用 <code>(n+1)/n · max(Xᵢ)</code> 作无偏估计。当 n = 5 时，这个系数等于多少？（填小数）',
        answer: '1.2',
        accept: ['1.2', '1.20', '6/5'],
        explain: '系数是 <code>(n+1)/n</code>，n = 5 时为 1.2。样本最大值的期望是 <code>nθ/(n+1)</code>，乘 1.2 后期望回到 θ。这个估计量的方差是 <code>θ²/[n(n+2)]</code>，比 <code>2X̄</code> 的 <code>θ²/(3n)</code> 小，是 UMVUE。'
      },

      /* ---------------- ch05 置信区间 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '「95% 置信区间」的正确解释是？',
        options: [
          { text: '总体参数有 95% 的概率落在这次算出的区间内' },
          { text: '反复抽样、每次按同样方法构造区间，约 95% 的区间会覆盖参数', correct: true },
          { text: '样本有 95% 的概率代表总体' },
          { text: '区间有 95% 的概率包含样本均值' }
        ],
        explain: '概率说的是「构造方法」的长期覆盖率，不是某一次具体区间的概率。参数固定，区间随机；一旦算出 [930.8, 1005.2]，它要么覆盖 μ 要么不覆盖，概率不再是 95%。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '估计正态总体均值时，σ 未知且样本量较小，应使用？',
        options: [
          { text: 'z 区间，用 s 代替 σ' },
          { text: 't 区间，自由度 n−1', correct: true },
          { text: '卡方区间' },
          { text: 'F 区间' }
        ],
        explain: 'σ 未知时用 <code>s/√n</code> 会引入额外不确定性，<code>(x̄−μ)/(s/√n)</code> 服从 <code>t<sub>n−1</sub></code>，临界值比 1.96 大，区间更宽。n 很大时 t 与 z 差别可以忽略，但小样本必须用 t。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '要求 95% 区间半宽不超过 2，σ = 10，样本量至少为多少？（填整数）',
        answer: '97',
        accept: ['97'],
        explain: '半宽 <code>1.96 × 10/√n ≤ 2</code>，解得 <code>n ≥ 96.04</code>，向上取整 97。样本量问题一律向上取整，否则约束不满足。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '其他条件不变，置信水平从 90% 提高到 99%，区间会？',
        options: [
          { text: '变窄' },
          { text: '变宽', correct: true },
          { text: '不变' },
          { text: '先变窄再变宽' }
        ],
        explain: '置信水平越高，需要覆盖的概率越多，临界值 <code>z<sub>1−α/2</sub></code> 越大（90% 用 1.645，99% 用 2.576），半宽随之变大。精度与置信度是一对权衡。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-1', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '一旦算出具体的区间 [930.8, 1005.2]，就可以说 μ 有 95% 的概率落在这个区间内。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '具体区间的端点已经固定，μ 也是固定的，事件「μ 在区间内」非真即假，没有 95% 的概率可言。95% 描述的是构造方法的覆盖率，不是某次实现。这是置信区间最常被误读的一句话。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '比例的 Wald 置信区间以什么为中心？',
        options: [
          { text: '0.5' },
          { text: '样本比例 <code>p̂</code>', correct: true },
          { text: '总体比例 p' },
          { text: '样本量 n' }
        ],
        explain: 'Wald 区间是 <code>p̂ ± z√(p̂(1−p̂)/n)</code>，中心是 p̂。它在 p̂ 接近 0 或 1 时表现很差（可能越界、覆盖率不足），所以小样本或极端比例应改用 Wilson 区间。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'fill', difficulty: 1,
        tags: ['calculation'],
        stem: 'n = 100、σ = 10、95% 置信水平下，均值的置信区间半宽为多少？（填小数）',
        answer: '1.96',
        accept: ['1.96', '1.960'],
        explain: '<code>1.96 × 10/√100 = 19.6/10 = 1.96</code>。半宽与 σ 成正比、与 √n 成反比；要让半宽减半，样本量要变 4 倍。'
      },

      /* ---------------- ch06 假设检验 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '第一类错误指的是？',
        options: [
          { text: 'H₀ 为真时没有拒绝 H₀' },
          { text: 'H₀ 为真时拒绝了 H₀', correct: true },
          { text: 'H₀ 为假时拒绝了 H₀' },
          { text: 'H₀ 为假时没有拒绝 H₀' }
        ],
        explain: '第一类错误是「误报」：H₀ 本来成立，却因样本波动被判为不成立，概率记作 α。第二类错误是「漏报」：H₁ 成立却没检测出来，概率记作 β。功效是 <code>1 − β</code>。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: 'p 值的定义是？',
        options: [
          { text: 'H₀ 为真的概率' },
          { text: 'H₀ 下，得到当前或更极端结果的概率', correct: true },
          { text: 'H₁ 为真的概率' },
          { text: '结论犯错的概率' }
        ],
        explain: 'p 值是在「H₀ 成立」这个前提下，计算样本结果及更极端情况的概率。它不是 H₀ 为真的概率（那需要贝叶斯先验），也不是决策错误的概率；它只是证据强度的一个刻度。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'fill', difficulty: 1,
        tags: ['calculation'],
        stem: '某检验的第二类错误概率 β = 0.2，则功效（power）等于多少？（填小数）',
        answer: '0.8',
        accept: ['0.8', '0.80'],
        explain: '功效定义为 <code>1 − β</code>，即 H₁ 为真时正确拒绝 H₀ 的概率。<code>1 − 0.2 = 0.8</code>。功效随效应量、样本量增大而提高，随 α 减小而降低。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '其他条件不变，把显著性水平 α 从 0.05 降到 0.01，会有什么后果？',
        options: [
          { text: '第二类错误 β 增大，功效下降', correct: true },
          { text: '第二类错误 β 减小，功效上升' },
          { text: '两类错误都减小' },
          { text: '两类错误都不变' }
        ],
        explain: 'α 与 β 在样本量固定时此消彼长：拒绝门槛更严，误报少了，但真实效应更容易漏掉。想要两者同时下降，只能增大样本量或提高效应量。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '检验结果不拒绝 H₀，就证明 H₀ 一定为真。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '不拒绝只说明「证据不足以推翻」，可能是 H₀ 真，也可能是样本量太小、效应太弱而没检测出来。正确表述是「在 α 水平下未发现显著差异」，并报告区间，让读者看到还能容纳多大的效应。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'Neyman-Pearson 引理说明，对简单对简单假设，在给定 α 下功效最大的检验是？',
        options: [
          { text: '似然比检验', correct: true },
          { text: '卡方检验' },
          { text: '符号检验' },
          { text: '任何无偏检验' }
        ],
        explain: 'NP 引理：拒绝域取在似然比 <code>L(θ₁)/L(θ₀)</code> 最大的区域，可在控制 α 的同时最大化功效，这样的检验称为最优势检验（MP test）。它只适用于两个点假设，复合假设要用 UMP 或 GLR。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'fill', difficulty: 1,
        tags: ['calculation'],
        stem: '单侧检验、α = 0.05 时，正态临界值 <code>z<sub>0.05</sub></code> 约为多少？（填小数，三位）',
        answer: '1.645',
        accept: ['1.645', '1.64', '1.65'],
        explain: '右尾面积 0.05 对应 <code>z = 1.645</code>；双侧 0.05 则用 1.96。单侧与双侧的临界值不同，考试要先看清 H₁ 的方向，再决定用哪一个。'
      },

      /* ---------------- ch07 常见检验与综合应用 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['method'],
        stem: '比较两组连续数据的均值，两组样本量相差很大且标准差悬殊，最稳妥的选择是？',
        options: [
          { text: '合并方差 t 检验' },
          { text: 'Welch t 检验', correct: true },
          { text: '配对 t 检验' },
          { text: '卡方检验' }
        ],
        explain: '合并方差假定 <code>σ₁² = σ₂²</code>，在这类数据上不成立，会导致第一类错误率偏离。Welch 用各自的 <code>sᵢ²/nᵢ</code> 并近似自由度，方差不等时更可靠，方差相等时也只损失很少功效。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '卡方拟合优度检验中，若类别数为 k、用数据估计了 m 个参数，自由度是？',
        options: [
          { text: '<code>k</code>' },
          { text: '<code>k−1</code>' },
          { text: '<code>k−1−m</code>', correct: true },
          { text: '<code>k−m</code>' }
        ],
        explain: '总共 k 个格子，总和固定用掉 1 个自由度；每从数据估计一个参数，再扣 1 个。例如检验泊松拟合、用样本估计 λ，则 m = 1。忘记减 m 是常见错误，会把 p 值算小。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '回归斜率 <code>b₁ = 0.8</code>、<code>SE(b₁) = 0.0894</code>，检验 <code>H₀: β₁ = 0</code> 的 t 值约为多少？（填小数，两位）',
        answer: '8.95',
        accept: ['8.95', '8.9', '8.94'],
        explain: '<code>t = b₁/SE(b₁) = 0.8/0.0894 ≈ 8.95</code>，df = n − 2。这个值远大于临界值 2.10（df = 18），p 远小于 0.05。注意自由度是 n−2，因为估计了截距与斜率两个参数。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '单因素方差分析的 F 检验拒绝了 H₀，正确的结论是？',
        options: [
          { text: '所有组的均值都不同' },
          { text: '至少有一组的均值与其他组不同', correct: true },
          { text: '第一组与第二组一定不同' },
          { text: '组内方差等于组间方差' }
        ],
        explain: 'ANOVA 的 H₀ 是「所有组均值相等」，拒绝只否定这个整体命题，说明至少有一组不同，但没说是哪一组。要定位差异需事后比较（Tukey、Bonferroni），并注意控制族错误率。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '配对 t 检验的自由度等于配对数减 1。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '配对后把每对差值当作一个样本，问题化为单样本 t，自由度自然是 <code>n−1</code>（n 为配对数），而不是 <code>2n−2</code>。这也是配对设计在样本量上更经济的原因之一。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: 'Cohen 的 d 等于 0.5，按常用经验标准属于？',
        options: [
          { text: '小效应' },
          { text: '中等效应', correct: true },
          { text: '大效应' },
          { text: '无法判断' }
        ],
        explain: '常用参考值是 0.2 小、0.5 中、0.8 大。d 用合并标准差标准化，因此可跨研究比较；但它依赖场景，教育或心理领域 0.5 可能已很重要，工程领域可能微不足道，最终要结合业务判断。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'fill', difficulty: 1,
        tags: ['calculation'],
        stem: '2×2 列联表的卡方独立性检验，自由度是多少？（填整数）',
        answer: '1',
        accept: ['1'],
        explain: '自由度 <code>(r−1)(c−1) = (2−1)(2−1) = 1</code>。此时卡方值约等于两比例 z 检验统计量的平方，两种做法给出相同的 p 值。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
