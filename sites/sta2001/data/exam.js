/* =====================================================================
 * exam.js · STA2001 模拟卷 A
 * 范围：ch00–ch07（概率公理与计数 / 条件概率与贝叶斯 / 随机变量与分布 /
 *       期望方差 / 多维随机变量 / 抽样分布与极限定理 / 统计推断）
 * 规格：12 题、满分 100、限时 90 分钟
 * 题型：choice / tf / fill / output / keywords
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerExam({
    id: 'STA2001-A',
    title: '概率与统计 模拟卷 A',
    style: '期末风格',
    subtitle: 'STA2001 · 覆盖 ch00–ch07 的综合模拟',
    date: '2026-11-21',
    minutes: 90,
    totalScore: 100,
    summary: '本卷覆盖八章全部内容：计数与公理、条件概率与贝叶斯、随机变量与分布、期望方差、' +
      '多维随机变量、抽样分布与极限定理、估计与检验。卷面 12 题：前 10 题为计算与选择，' +
      '每题 8 分；最后两题为简答，各 10 分。建议闭卷限时完成，计算题务必写出公式再代数，' +
      '只写答案的步骤分拿不到。',
    instructions: [
      '时间 90 分钟，满分 100 分。计时开始后不会暂停，刷新页面也按真实时间计算。',
      '题型：单项选择、判断、填空、计算输出、简答（按关键词给分）。',
      '填空题只填最终结果；若结果是分数或小数，两种写法都接受，但不要带单位。',
      '简答题按关键词命中比例给分，答出要点即可，不需要长篇论述。',
      '正态分位数可查表：<code>z<sub>0.025</sub>=1.96</code>、<code>z<sub>0.05</sub>=1.645</code>、<code>Φ(1)=0.8413</code>。'
    ],
    questions: [

      /* ---------------------------------------------------------- Q1 */
      { no: 1, points: 8, type: 'single choice',
        intro: '本题考察排列组合与古典概型。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '5 个人排成一排，甲不站在两端的排法共有多少种？',
            options: [
              { text: '48' },
              { text: '72', correct: true },
              { text: '96' },
              { text: '120' }
            ],
            explain: '总排列 <code>5!=120</code>；甲在两端有 <code>2×4!=48</code> 种，减去得 <code>72</code>。也可正面算：甲有中间 3 个位置，其余 4 人任意排，<code>3×24=72</code>。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '从 8 人中选 3 人组成委员会（不分职务），共有多少种选法？',
            options: [
              { text: '24' },
              { text: '56', correct: true },
              { text: '336' },
              { text: '512' }
            ],
            explain: '不分职务用组合 <code>C(8,3)=56</code>。若三人分别担任主席、副主席、秘书，才用排列 <code>8×7×6=336</code>。「选人」与「排位」的区别决定用 <code>C</code> 还是 <code>P</code>。' }
        ] },

      /* ---------------------------------------------------------- Q2 */
      { no: 2, points: 8, type: 'single choice',
        intro: '本题考察概率公理与独立性。',
        parts: [
          { label: '(a)', points: 4, kind: 'tf',
            prompt: '对任意事件 <code>A</code>、<code>B</code>，<code>P(A∪B)=P(A)+P(B)-P(A∩B)</code> 都成立。',
            options: [
              { text: '正确', correct: true },
              { text: '错误' }
            ],
            explain: '这是容斥公式，把 <code>A∪B</code> 拆成互斥的 <code>A</code> 与「<code>B</code> 中不属于 <code>A</code> 的部分」，即得该式。它对任意事件成立，不需要独立或互斥。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '已知 <code>P(A)=0.4</code>、<code>P(B)=0.3</code>，且 <code>A</code>、<code>B</code> 相互独立，则 <code>P(A∪B)</code> 等于？',
            options: [
              { text: '0.58', correct: true },
              { text: '0.70' },
              { text: '0.12' },
              { text: '0.82' }
            ],
            explain: '独立给 <code>P(A∩B)=0.4×0.3=0.12</code>，再容斥：<code>0.4+0.3-0.12=0.58</code>。<b>注意不能直接相加</b>，那是互斥才成立的算法。' }
        ] },

      /* ---------------------------------------------------------- Q3 */
      { no: 3, points: 8, type: 'single choice',
        intro: '本题考察全概率公式与贝叶斯公式。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '甲厂供应 60% 的零件、次品率 2%，乙厂供应 40%、次品率 3%。随机取一件是次品的概率是？',
            options: [
              { text: '0.020' },
              { text: '0.024', correct: true },
              { text: '0.025' },
              { text: '0.030' }
            ],
            explain: '全概率：<code>0.6×0.02+0.4×0.03=0.012+0.012=0.024</code>。两个厂的次品率简单平均是 0.025，但产量占比不同，必须加权。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '沿用上题。已知取到的是次品，它来自甲厂的概率是 ______。',
            answer: '0.5',
            accept: ['0.5', '1/2', '.5', '50%'],
            explain: '贝叶斯：<code>P(甲|次)=0.012/0.024=0.5</code>。虽然甲厂次品率更低，但它供货量占 60%，两种效应对冲后正好各占一半。' }
        ] },

      /* ---------------------------------------------------------- Q4 */
      { no: 4, points: 8, type: 'single choice',
        intro: '本题考察贝叶斯公式与基率谬误。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '某病患病率 2%，检测灵敏度 90%、特异度 90%。某人检测阳性，他真正患病的概率约为？',
            options: [
              { text: '0.90' },
              { text: '0.50' },
              { text: '0.155', correct: true },
              { text: '0.018' }
            ],
            explain: '<code>P(D|+) = 0.02×0.9 / (0.02×0.9 + 0.98×0.1) = 0.018/0.116 ≈ 0.155</code>。阳性者中大部分是健康人的假阳性，因为健康人基数大。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '用一两句话解释：为什么灵敏度 90% 的检测，阳性者真正患病的概率却只有约 15%？',
            keywords: ['基率', '患病率低', '假阳性', '健康人基数大', '先验', '0.98'],
            explain: '关键在<b>基率</b>：患病率只有 2%，健康人占 98%。即使特异度 90%，健康人中仍有 <code>0.98×0.1=0.098</code> 的假阳性，远多于真阳性的 <code>0.018</code>。检测的「准」是相对同一人群而言，不能脱离患病率解读。' }
        ] },

      /* ---------------------------------------------------------- Q5 */
      { no: 5, points: 8, type: 'single choice',
        intro: '本题考察连续型随机变量与密度。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '<code>X ~ U(0,2)</code>，则 <code>P(X&gt;1.5)</code> 等于？',
            options: [
              { text: '0.125' },
              { text: '0.25', correct: true },
              { text: '0.5' },
              { text: '0.75' }
            ],
            explain: '均匀分布的概率等于长度比：区间 <code>(1.5,2)</code> 长 0.5，总长 2，概率 <code>0.5/2=0.25</code>。也可积分 <code>∫<sub>1.5</sub><sup>2</sup>(1/2)dx</code>。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '若 <code>X</code> 的密度为 <code>f(x)=cx</code>（<code>0&lt;x&lt;2</code>），其他位置为 0，则常数 <code>c</code> 等于 ______。',
            answer: '0.5',
            accept: ['1/2', '0.5', '.5'],
            explain: '密度必须积分为 1：<code>∫<sub>0</sub><sup>2</sup>cx dx = c·2 = 1</code>，故 <code>c=1/2</code>。注意 <code>c</code> 不是 1，因为支撑集长度是 2 且密度是线性的。' }
        ] },

      /* ---------------------------------------------------------- Q6 */
      { no: 6, points: 8, type: 'single choice',
        intro: '本题考察期望与方差的性质。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '已知 <code>E(X)=1</code>、<code>E(Y)=2</code>，则 <code>E(2X-3Y+1)</code> 等于？',
            options: [
              { text: '-3', correct: true },
              { text: '-4' },
              { text: '3' },
              { text: '9' }
            ],
            explain: '期望线性：<code>2×1-3×2+1=2-6+1=-3</code>。这条性质<b>不需要独立</b>，是它最方便的地方。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '<code>X</code>、<code>Y</code> 独立，<code>Var(X)=4</code>、<code>Var(Y)=1</code>，则 <code>Var(2X-3Y)</code> 等于？',
            options: [
              { text: '5' },
              { text: '13' },
              { text: '25', correct: true },
              { text: '7' }
            ],
            explain: '独立时方差可加且系数平方：<code>4×4+9×1=25</code>。负号被平方，<code>Var(-3Y)=9Var(Y)</code>；方差不会出现负数。' }
        ] },

      /* ---------------------------------------------------------- Q7 */
      { no: 7, points: 8, type: 'single choice',
        intro: '本题考察联合分布、独立性与协方差。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '联合分布为 <code>P(0,0)=0.3</code>、<code>P(0,1)=0.2</code>、<code>P(1,0)=0.2</code>、<code>P(1,1)=0.3</code>。关于 <code>X</code>、<code>Y</code> 的独立性，结论是？',
            options: [
              { text: '独立，因为 <code>P(1,1)=0.3</code> 为正' },
              { text: '不独立，因为 <code>P(1,1)=0.3 ≠ P(X=1)P(Y=1)=0.25</code>', correct: true },
              { text: '不独立，因为边缘分布不相等' },
              { text: '无法判断，需要更多数据' }
            ],
            explain: '边缘：<code>P(X=1)=0.5</code>、<code>P(Y=1)=0.5</code>，乘积 0.25 与联合 0.3 不等，故不独立。检查独立性只需找到一个格子的乘积关系不成立即可。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '沿用上题，<code>Cov(X,Y)</code> 等于 ______。',
            answer: '0.05',
            accept: ['0.05', '1/20', '.05'],
            explain: '<code>E(XY)=P(1,1)=0.3</code>，<code>E(X)E(Y)=0.5×0.5=0.25</code>，故 <code>Cov=0.05</code>。协方差非零恰好说明不独立；若为 0 则只能说明不相关。' }
        ] },

      /* ---------------------------------------------------------- Q8 */
      { no: 8, points: 8, type: 'single choice',
        intro: '本题考察中心极限定理与标准误。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '<code>n=64</code>、<code>μ=100</code>、<code>σ=16</code>，由 CLT，<code>P(x̄&lt;102)</code> 约等于？',
            options: [
              { text: '0.1587' },
              { text: '0.8413', correct: true },
              { text: '0.9772' },
              { text: '0.5000' }
            ],
            explain: '<code>SE=16/8=2</code>，<code>z=(102-100)/2=1</code>，<code>Φ(1)=0.8413</code>。先算标准误再标准化，顺序不能颠倒。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '若要求 <code>σ=16</code> 时标准误不超过 1，样本量 <code>n</code> 至少为 ______。',
            answer: '256',
            accept: ['256'],
            explain: '<code>σ/√n ≤ 1 → √n ≥ 16 → n ≥ 256</code>。精度提高 1 倍需要样本量变为 4 倍，这是 <code>1/√n</code> 规律的直接后果。' }
        ] },

      /* ---------------------------------------------------------- Q9 */
      { no: 9, points: 8, type: 'single choice',
        intro: '本题考察抽样分布与检验统计量的选择。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '单样本 <code>t</code> 检验中样本量为 16，则 <code>t</code> 分布的自由度是？',
            options: [
              { text: '16' },
              { text: '15', correct: true },
              { text: '14' },
              { text: '17' }
            ],
            explain: '自由度 <code>n-1=15</code>，因为 <code>S</code> 中用 <code>x̄</code> 估了一个参数。自由度算错，临界值就查错，结论可能整个反过来。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '总体近似正态、<code>σ</code> 未知、<code>n=20</code>，检验 <code>μ</code> 应使用？',
            options: [
              { text: '<code>z</code> 检验，因为 <code>n</code> 接近 30' },
              { text: '<code>t</code> 检验，用 <code>S</code> 代替 <code>σ</code>、自由度 19', correct: true },
              { text: '<code>χ<sup>2</sup></code> 检验' },
              { text: '<code>F</code> 检验' }
            ],
            explain: '<code>σ</code> 未知就用 <code>t</code>，与 <code>n</code> 大小无关；只有 <code>n</code> 很大时 <code>t</code> 与 <code>z</code> 才近似相同。<code>χ<sup>2</sup></code> 管方差，<code>F</code> 管方差比，都不用于均值。' }
        ] },

      /* ---------------------------------------------------------- Q10 */
      { no: 10, points: 8, type: 'single choice',
        intro: '本题考察置信区间的解释。',
        parts: [
          { label: '(a)', points: 4, kind: 'tf',
            prompt: '「<code>μ</code> 的 95% 置信区间为 <code>(937,1103)</code>」意味着 <code>μ</code> 有 95% 的概率落在这个区间内。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '<code>μ</code> 是固定常数，区间算出后也是固定的，概率只能是 0 或 1。95% 描述的是<b>构造方法的覆盖率</b>：重复抽样下约 95% 的区间会覆盖 <code>μ</code>。' },
          { label: '(b)', points: 4, kind: 'tf',
            prompt: '其他条件不变时，样本量越大，均值的置信区间越窄。',
            options: [
              { text: '正确', correct: true },
              { text: '错误' }
            ],
            explain: '区间半宽为 <code>t·S/√n</code>，<code>n</code> 越大半宽越小。但「更窄」不等于「更准」：区间窄只说明精度高，若抽样有偏，窄区间照样覆盖不到真值。' }
        ] },

      /* ---------------------------------------------------------- Q11 */
      { no: 11, points: 10, type: 'short answer',
        intro: '本题考察点估计的构造与评价。',
        parts: [
          { label: '(a)', points: 5, kind: 'keywords',
            prompt: '设 <code>X<sub>1</sub>,…,X<sub>n</sub></code> 来自伯努利分布 <code>B(1,p)</code>，求 <code>p</code> 的极大似然估计，并写出关键步骤。',
            keywords: ['似然', 'p^Σx (1-p)^(n-Σx)', '取对数', '求导', 'x̄', '样本比例'],
            explain: '似然 <code>L(p)=p<sup>Σx<sub>i</sub></sup>(1-p)<sup>n-Σx<sub>i</sub></sup></code>，取对数后求导：<code>Σx<sub>i</sub>/p-(n-Σx<sub>i</sub>)/(1-p)=0</code>，解得 <code>p̂=x̄</code>，即样本比例。<b>步骤分在「写似然 → 取对数 → 求导」</b>，只写答案不给满分。' },
          { label: '(b)', points: 5, kind: 'keywords',
            prompt: '说明为什么样本方差 <code>S<sup>2</sup>=Σ(X<sub>i</sub>-x̄)<sup>2</sup>/(n-1)</code> 是总体方差的无偏估计。',
            keywords: ['E(S²)=σ²', '自由度', 'n-1', 'Σ(X-x̄)²', '无偏', '补偿'],
            explain: '关键恒等式：<code>Σ(X<sub>i</sub>-x̄)<sup>2</sup>=Σ(X<sub>i</sub>-μ)<sup>2</sup>-n(x̄-μ)<sup>2</sup></code>。取期望得 <code>(n-1)σ<sup>2</sup></code>，故除以 <code>n-1</code> 后期望为 <code>σ<sup>2</sup></code>。直观上，<code>x̄</code> 使离差平方和比围绕 <code>μ</code> 时小，少掉的正好是一个自由度。' }
        ] },

      /* ---------------------------------------------------------- Q12 */
      { no: 12, points: 10, type: 'short answer',
        intro: '本题考察假设检验的逻辑与 p 值的解释。',
        parts: [
          { label: '(a)', points: 5, kind: 'keywords',
            prompt: '写出第一类错误与第二类错误的定义，并说明 <code>α</code>、<code>β</code> 与功效的关系。',
            keywords: ['弃真', '存伪', 'H0 为真却拒绝', 'H0 为假却没拒绝', 'α', 'β', '功效 1-β'],
            explain: '第一类错误：<code>H<sub>0</sub></code> 为真却被拒绝，概率 <code>α</code>（弃真）；第二类错误：<code>H<sub>0</sub></code> 为假却未拒绝，概率 <code>β</code>（存伪）；功效是 <code>1-β</code>。<code>n</code> 固定时 <code>α</code> 与 <code>β</code> 此消彼长，只有增大 <code>n</code> 才能同时降低。' },
          { label: '(b)', points: 5, kind: 'keywords',
            prompt: '指出「p=0.03 说明 <code>H<sub>0</sub></code> 为真的概率是 3%」这句话错在哪里，并给出 p 值的正确解释。',
            keywords: ['不是 H0 为真的概率', 'H0 为真时数据的概率', '条件方向相反', '更极端', '不衡量效应大小'],
            explain: 'p 值是 <code>P(数据或更极端 | H<sub>0</sub>)</code>，而「<code>H<sub>0</sub></code> 为真的概率」是 <code>P(H<sub>0</sub> | 数据)</code>，两者条件方向相反，不能互换。正确说法：若 <code>H<sub>0</sub></code> 成立，出现当前或更极端结果的概率是 3%。p 值也不衡量效应大小，样本足够大时微小差异也会显著。' }
        ] }
    ]
  });
})();
