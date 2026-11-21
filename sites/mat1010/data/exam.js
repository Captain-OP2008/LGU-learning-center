/* =====================================================================
 * exam.js · MAT1010 模拟卷 A
 * 范围：ch00–ch07（代数 / 函数 / 导数 / 最优化 / 积分 / 多元 / 约束与动态）
 * 规格：12 题、满分 100、限时 100 分钟
 * 题型：choice / tf / fill / output / keywords
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerExam({
    id: 'MAT1010-A',
    title: '经济分析数学 模拟卷 A',
    style: '期末风格',
    subtitle: 'MAT1010 · 覆盖 ch00–ch07 的综合模拟',
    date: '2026-11-21',
    minutes: 100,
    totalScore: 100,
    summary: '本卷覆盖八章主干：代数与方程、函数与图形、导数与边际、极限与最优化、' +
      '积分与累积、偏导与多元极值、拉格朗日与差分方程。卷面 12 题：第 1–6 题各 8 分（48 分），' +
      '第 7–9 题各 10 分（30 分），第 10–11 题各 8 分（16 分），第 12 题 6 分，合计 100 分。' +
      '计算题要求写出关键步骤，只写答案不给过程分；简答题按关键词命中给分，但要能说出「为什么」。',
    instructions: [
      '时间 100 分钟，满分 100 分。计时开始后不会暂停，刷新页面也按真实时间计算。',
      '题型与分值：第 1–6 题各 8 分；第 7–9 题各 10 分；第 10–11 题各 8 分；第 12 题 6 分。合计 100 分。',
      '计算题按步骤给分：写出公式、代入、结果、单位或经济解释，缺一步扣该步分值。',
      '选择题只有一个正确选项；判断题只需写「正确」或「错误」，但简答要说明理由。',
      '数值答案保留题目要求的精度；未要求时保留两位小数即可。'
    ],
    questions: [

      /* ---------------------------------------------------------- Q1 */
      { no: 1, points: 8, type: 'single choice',
        intro: '本题考察代数基础：二次方程与指数方程。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '方程 <code>2x<sup>2</sup> − 8x + 6 = 0</code> 的两个根是：',
            options: [
              { text: '<code>x = 1</code> 与 <code>x = 3</code>', correct: true },
              { text: '<code>x = −1</code> 与 <code>x = −3</code>' },
              { text: '<code>x = 2</code> 与 <code>x = 6</code>' },
              { text: '<code>x = 1</code> 与 <code>x = −3</code>' }
            ],
            explain: '两边除以 2 得 <code>x<sup>2</sup> − 4x + 3 = 0</code>，因式分解为 <code>(x−1)(x−3) = 0</code>。' +
              '用求根公式同样得到 <code>x = [8 ± √(64−48)]/4 = [8 ± 4]/4</code>，即 1 与 3。' +
              '先约简再分解，比直接套公式更不容易算错。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '解 <code>3<sup>x</sup> = 12</code>，得 <code>x</code> 等于：',
            options: [
              { text: '<code>ln12 / ln3 ≈ 2.2619</code>', correct: true },
              { text: '<code>ln12 − ln3 ≈ 1.3863</code>' },
              { text: '<code>12/3 = 4</code>' },
              { text: '<code>ln(12/3) ≈ 1.3863</code>' }
            ],
            explain: '两边取自然对数：<code>x ln3 = ln12</code>，所以 <code>x = ln12/ln3</code>。' +
              '指数方程的标准解法是「取对数把指数拉下来」，而不是把底数或指数直接相除。' +
              '换底公式 <code>log<sub>3</sub>12 = ln12/ln3</code> 是同一个式子。' }
        ] },

      /* ---------------------------------------------------------- Q2 */
      { no: 2, points: 8, type: 'true / false',
        intro: '判断下列陈述的真假，每小题 2 分。',
        parts: [
          { label: '(a)', points: 2, kind: 'tf',
            prompt: '不等式 <code>|x − 3| ≤ 2</code> 的解集是 <code>1 ≤ x ≤ 5</code>。',
            options: [
              { text: '正确', correct: true },
              { text: '错误' }
            ],
            explain: '<code>|x−3| ≤ 2</code> 等价于 <code>−2 ≤ x−3 ≤ 2</code>，三边加 3 得 <code>1 ≤ x ≤ 5</code>。' },
          { label: '(b)', points: 2, kind: 'tf',
            prompt: '<code>e<sup>ln2</sup> = ln2</code>。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '<code>e<sup>ln2</sup> = 2</code>，不是 <code>ln2 ≈ 0.693</code>。指数与对数互为反函数：' +
              '<code>e<sup>ln x</sup> = x</code>、<code>ln(e<sup>x</sup>) = x</code>，两条不要记混。' },
          { label: '(c)', points: 2, kind: 'tf',
            prompt: '<code>1.05<sup>3</sup> &gt; 1.15</code>。',
            options: [
              { text: '正确', correct: true },
              { text: '错误' }
            ],
            explain: '<code>1.05<sup>3</sup> = 1.157625 &gt; 1.15</code>。三年每年 5% 的复利总增长 15.76%，' +
              '高于单利的 15%，差额来自「利息也生息」。' },
          { label: '(d)', points: 2, kind: 'tf',
            prompt: '某指标从 80 上升到 100，涨幅是 20%。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '涨幅 <code>= (100−80)/80 = 25%</code>，分母是原值 80。20% 是「从 100 降到 80」的跌幅，' +
              '两个方向的百分比分母不同，不能互换。' }
        ] },

      /* ---------------------------------------------------------- Q3 */
      { no: 3, points: 8, type: 'fill in the blank',
        intro: '本题考察求和与复利，每空 4 分。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '<code>1 + 2 + 3 + … + 100 =</code> ______。',
            answer: '5050',
            accept: ['5050', '5,050'],
            explain: '等差数列求和 <code>n(n+1)/2 = 100×101/2 = 5050</code>。' +
              '这个公式在算总收益、总成本、年金时反复出现。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '<code>1.05<sup>3</sup> =</code> ______（保留六位小数）。',
            answer: '1.157625',
            accept: ['1.157625'],
            explain: '<code>1.05<sup>2</sup> = 1.1025</code>，再乘 1.05 得 <code>1.157625</code>。' +
              '若按单利算只有 1.15，复利多出的 0.007625 是「利滚利」的部分。' }
        ] },

      /* ---------------------------------------------------------- Q4 */
      { no: 4, points: 8, type: 'single choice',
        intro: '本题考察函数图形与经济函数。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '抛物线 <code>y = −2x<sup>2</sup> + 12x − 10</code> 的顶点是：',
            options: [
              { text: '<code>(3, 8)</code>', correct: true },
              { text: '<code>(−3, 8)</code>' },
              { text: '<code>(3, −8)</code>' },
              { text: '<code>(6, 26)</code>' }
            ],
            explain: '顶点横坐标 <code>x = −b/(2a) = −12/(−4) = 3</code>，代入得 <code>y = −18 + 36 − 10 = 8</code>。' +
              '因为 <code>a = −2 &lt; 0</code>，开口向下，顶点是最大值点，经济上对应「收入最大」的产量。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '成本 <code>C(Q) = 200 + 5Q + 0.1Q<sup>2</sup></code>，平均成本最小时的产量约为：',
            options: [
              { text: '<code>Q = √2000 ≈ 44.72</code>', correct: true },
              { text: '<code>Q = 20</code>' },
              { text: '<code>Q = 100</code>' },
              { text: '<code>Q = 200</code>' }
            ],
            explain: '<code>AC = 200/Q + 5 + 0.1Q</code>，求导 <code>−200/Q<sup>2</sup> + 0.1 = 0</code>，' +
              '得 <code>Q<sup>2</sup> = 2000</code>，<code>Q ≈ 44.72</code>。此时 <code>AC = MC ≈ 13.944</code>，' +
              '边际成本曲线正好穿过平均成本曲线的最低点。' }
        ] },

      /* ---------------------------------------------------------- Q5 */
      { no: 5, points: 8, type: 'calculation',
        intro: '求下列函数的导数，每小题 4 分，要求写出使用哪条法则。',
        parts: [
          { label: '(a)', points: 4, kind: 'output',
            prompt: '求 <code>f(x) = (x<sup>2</sup> + 1)(3x − 2)</code> 的导数。',
            answer: '9x² − 4x + 3',
            accept: ['9x^2-4x+3', '9x²−4x+3', '9x^2 − 4x + 3'],
            explain: '乘积法则：<code>f′ = 2x(3x−2) + (x<sup>2</sup>+1)·3</code>' +
              '<code> = 6x<sup>2</sup> − 4x + 3x<sup>2</sup> + 3 = 9x<sup>2</sup> − 4x + 3</code>。' +
              '先展开再求导也得到同一结果，可用来验算。' },
          { label: '(b)', points: 4, kind: 'output',
            prompt: '求 <code>g(x) = (3x<sup>2</sup> + 1)<sup>5</sup></code> 的导数。',
            answer: '30x(3x² + 1)⁴',
            accept: ['30x(3x^2+1)^4', '30x(3x²+1)^4'],
            explain: '链式法则：外层降一次方，乘内层导数。' +
              '<code>g′ = 5(3x<sup>2</sup>+1)<sup>4</sup>·6x = 30x(3x<sup>2</sup>+1)<sup>4</sup></code>。' +
              '忘记乘 6x 是最常见的失分点。' }
        ] },

      /* ---------------------------------------------------------- Q6 */
      { no: 6, points: 8, type: 'calculation',
        intro: '极限与单变量最优化，每小题 4 分。',
        parts: [
          { label: '(a)', points: 4, kind: 'output',
            prompt: '求 <code>lim<sub>x→2</sub> (x<sup>2</sup> − 4)/(x − 2)</code>。',
            answer: '4',
            accept: ['4', '等于4'],
            explain: '分子因式分解 <code>(x−2)(x+2)</code>，约去 <code>x−2</code> 得 <code>x+2</code>，' +
              '代入 2 得 4。0/0 型不能直接代入，先化简；也可以用洛必达法则对分子分母分别求导。' },
          { label: '(b)', points: 4, kind: 'output',
            prompt: '求 <code>f(x) = x<sup>3</sup> − 3x<sup>2</sup> + 4</code> 的极大值与极小值。',
            answer: '极大值 f(0)=4，极小值 f(2)=0',
            accept: ['极大4极小0', '极大值4，极小值0'],
            explain: '<code>f′ = 3x<sup>2</sup> − 6x = 3x(x−2)</code>，驻点 0 与 2。' +
              '<code>f″ = 6x−6</code>：<code>f″(0) = −6 &lt; 0</code> 极大，<code>f(0) = 4</code>；' +
              '<code>f″(2) = 6 &gt; 0</code> 极小，<code>f(2) = 0</code>。' }
        ] },

      /* ---------------------------------------------------------- Q7 */
      { no: 7, points: 10, type: 'calculation',
        intro: '垄断定价与弹性，共 10 分。',
        parts: [
          { label: '(a)', points: 4, kind: 'output',
            prompt: '厂商面对需求 <code>P = 100 − 2Q</code>，成本 <code>C = 20Q</code>。求利润最大时的产量与价格。',
            answer: 'Q = 20，P = 60',
            accept: ['Q=20,P=60', '产量20价格60'],
            explain: '<code>R = 100Q − 2Q<sup>2</sup></code>，<code>MR = 100 − 4Q</code>；<code>MC = 20</code>。' +
              '令 <code>MR = MC</code>：<code>100 − 4Q = 20</code>，<code>Q = 20</code>，代入需求得 <code>P = 60</code>。' },
          { label: '(b)', points: 6, kind: 'output',
            prompt: '求最大利润，并计算该点的勒纳指数 <code>(P − MC)/P</code>，解释它的含义。',
            answer: '利润 800，勒纳指数 2/3，表示价格是边际成本的 3 倍',
            accept: ['800，2/3', '利润800，勒纳指数2/3'],
            explain: '利润 <code>π = 60×20 − 20×20 = 1200 − 400 = 800</code>。' +
              '<code>(P−MC)/P = (60−20)/60 = 2/3</code>，即价格比边际成本高 2/3，' +
              '加价幅度由需求弹性决定：弹性越小，勒纳指数越大，垄断势力越强。' }
        ] },

      /* ---------------------------------------------------------- Q8 */
      { no: 8, points: 10, type: 'fill in the blank',
        intro: '积分与累积，共 10 分。',
        parts: [
          { label: '(a)', points: 3, kind: 'fill',
            prompt: '<code>∫<sub>0</sub><sup>3</sup> (2x + 1) dx =</code> ______。',
            answer: '12',
            accept: ['12'],
            explain: '原函数 <code>x<sup>2</sup> + x</code>，代入上下限 <code>(9+3) − 0 = 12</code>。' +
              '几何上是梯形面积：两高 1 与 7、底 3，面积 <code>(1+7)×3/2 = 12</code>。' },
          { label: '(b)', points: 3, kind: 'fill',
            prompt: '<code>∫<sub>0</sub><sup>1</sup> x e<sup>x</sup> dx =</code> ______。',
            answer: '1',
            accept: ['1'],
            explain: '分部积分 <code>∫xe<sup>x</sup>dx = e<sup>x</sup>(x−1) + C</code>，' +
              '代入 0 与 1：<code>e(0) − 1×(−1) = 1</code>。选 <code>u=x</code> 是因为求导后变简单。' },
          { label: '(c)', points: 4, kind: 'fill',
            prompt: '需求 <code>P = 8 − 2Q</code>、市场价格为 2 时，消费者剩余为 ______。',
            answer: '9',
            accept: ['9'],
            explain: '价格 2 对应 <code>Q = 3</code>。<code>CS = ∫<sub>0</sub><sup>3</sup>(6−2Q)dQ = 18 − 9 = 9</code>，' +
              '也可用三角形 <code>(8−2)×3/2 = 9</code>。消费者剩余是「愿意付的」减去「实际付的」。' }
        ] },

      /* ---------------------------------------------------------- Q9 */
      { no: 9, points: 10, type: 'calculation',
        intro: '偏导数与生产函数，共 10 分。',
        parts: [
          { label: '(a)', points: 5, kind: 'output',
            prompt: '设 <code>z = 3x<sup>2</sup>y + 5y<sup>3</sup></code>，求 <code>∂z/∂x</code> 与 <code>∂z/∂y</code>，' +
              '并算出在 <code>(2, 1)</code> 处的值。',
            answer: 'z_x=6xy=12，z_y=3x²+15y²=27',
            accept: ['12和27', 'z_x=12,z_y=27'],
            explain: '对 x 求偏导把 y 当常数：<code>z<sub>x</sub> = 6xy</code>，在 <code>(2,1)</code> 处为 12。' +
              '对 y 求偏导把 x 当常数：<code>z<sub>y</sub> = 3x<sup>2</sup> + 15y<sup>2</sup></code>，在 <code>(2,1)</code> 处为 <code>12+15 = 27</code>。' },
          { label: '(b)', points: 5, kind: 'output',
            prompt: '生产函数 <code>Q = 10K<sup>0.3</sup>L<sup>0.7</sup></code>，在 <code>K = L = 8</code> 处求 <code>Q</code>、' +
              '<code>MP<sub>K</sub></code>、<code>MP<sub>L</sub></code>，并验证欧拉定理。',
            answer: 'Q=80，MP_K=3，MP_L=7，8×3+8×7=80',
            accept: ['Q=80,MP_K=3,MP_L=7', '80，3，7'],
            explain: '<code>Q = 10×8<sup>0.3+0.7</sup> = 80</code>。' +
              '<code>MP<sub>K</sub> = 0.3Q/K = 0.3×80/8 = 3</code>，<code>MP<sub>L</sub> = 0.7Q/L = 7</code>。' +
              '欧拉定理：<code>K·MP<sub>K</sub> + L·MP<sub>L</sub> = 24+56 = 80 = Q</code>，说明规模报酬不变时按边际产品付酬正好分配完产出。' }
        ] },

      /* ---------------------------------------------------------- Q10 */
      { no: 10, points: 8, type: 'calculation',
        intro: '拉格朗日乘子与影子价格，共 8 分。',
        parts: [
          { label: '(a)', points: 5, kind: 'output',
            prompt: '效用 <code>U = xy</code>，<code>p<sub>x</sub> = 2</code>、<code>p<sub>y</sub> = 5</code>、收入 <code>m = 100</code>。' +
              '写出拉格朗日函数并求最优消费组合与 λ。',
            answer: 'L=xy+λ(100−2x−5y)，x=25，y=10，λ=5',
            accept: ['x=25,y=10,λ=5', '25，10，5'],
            explain: '一阶条件：<code>y = 2λ</code>、<code>x = 5λ</code>、<code>2x+5y = 100</code>。' +
              '前两式给 <code>y/x = 2/5</code>，即 <code>y = 0.4x</code>；代入预算 <code>4x = 100</code>，' +
              '<code>x = 25</code>、<code>y = 10</code>、<code>λ = 5</code>，效用 250。' },
          { label: '(b)', points: 3, kind: 'keywords',
            prompt: '解释 λ = 5 的经济含义，并说明收入从 100 增到 101 时效用大约增加多少。',
            keywords: ['影子价格', '收入边际效用', '约5', 'dU/dm'],
            explain: 'λ 是约束的影子价格：<code>λ = dU*/dm</code>，收入每增加 1 元，最优效用约增加 5。' +
              '精确计算 <code>x=25.25, y=10.1, U=255.025</code>，增量 5.025，与 5 吻合。' }
        ] },

      /* ---------------------------------------------------------- Q11 */
      { no: 11, points: 8, type: 'fill in the blank',
        intro: '差分方程与蛛网模型，共 8 分。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '差分方程 <code>y<sub>t+1</sub> = 0.8y<sub>t</sub> + 20</code> 的稳态值是 ______。',
            answer: '100',
            accept: ['100'],
            explain: '令 <code>y<sub>t+1</sub> = y<sub>t</sub> = y*</code>，得 <code>y* = 0.8y* + 20</code>，' +
              '<code>0.2y* = 20</code>，<code>y* = 100</code>。因 <code>|0.8| &lt; 1</code>，从任意初值都收敛。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '蛛网模型中价格递推为 <code>P<sub>t</sub> = 40 − 1.5P<sub>t−1</sub></code>。判断它是否收敛，' +
              '并说明与供需斜率的关系。',
            keywords: ['发散', '|a|>1', '振荡', '供给更陡', '斜率3大于2'],
            explain: '系数 <code>a = −1.5</code>，<code>|a| &gt; 1</code>，所以振荡发散。' +
              '稳定条件是 <code>|a| &lt; 1</code>，等价于供给曲线比需求曲线更陡；' +
              '本例供给斜率 3 大于需求斜率绝对值 2，故发散。' }
        ] },

      /* ---------------------------------------------------------- Q12 */
      { no: 12, points: 6, type: 'short answer',
        intro: '综合简答，共 6 分。',
        parts: [
          { label: '(a)', points: 3, kind: 'keywords',
            prompt: '为什么边际成本曲线一定穿过平均成本曲线的最低点？用「边际与平均」的关系解释。',
            keywords: ['MC<AC 时 AC 下降', 'MC>AC 时 AC 上升', '交点即最低点', '边际拉动平均'],
            explain: '平均成本是「已经发生的总量的平均」，边际成本是「再一单位的增量」。' +
              '若 <code>MC &lt; AC</code>，新增一单位把平均值往下拉，AC 下降；' +
              '若 <code>MC &gt; AC</code>，新增一单位把平均值往上推，AC 上升。' +
              '一降一升之间必经 <code>MC = AC</code> 的点，那就是 AC 的最低点。' },
          { label: '(b)', points: 3, kind: 'keywords',
            prompt: '把「导数、积分、约束优化」各用一句经济语言概括，并说明它们分别回答什么问题。',
            keywords: ['导数=边际', '积分=累积', '约束优化=稀缺下的选择', '增量/总量/最优'],
            explain: '导数回答「再多一单位会怎样」，对应边际量（边际成本、边际效用）；' +
              '积分回答「许多小增量累加起来是多少」，对应总量与面积（总成本、消费者剩余、现值）；' +
              '约束优化回答「在资源有限时怎么选最好」，对应拉格朗日与影子价格。' +
              '三者合起来，就是「边际—总量—最优」的完整链条。' }
        ] }
    ]
  });
})();
