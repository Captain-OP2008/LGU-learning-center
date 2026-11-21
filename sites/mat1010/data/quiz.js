/* =====================================================================
 * quiz.js · MAT1010 分章题库
 * 结构：{ items:[{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options?, answer?, accept?, explain }] }
 * 题型：mcq / tf / fill / multi
 * 覆盖：ch00–ch07，每章 7 题，共 56 题
 * 说明：每章前 3 题与章内嵌 quiz 的 qid 一一对应。
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '这门课的主题，下面哪种描述最准确？',
        options: [
          { text: '把经济问题翻译成函数与方程，用边际、弹性、现值、约束四类工具求解并解释', correct: true },
          { text: '背诵经济学名词的定义，不涉及计算' },
          { text: '证明数学分析中的定理，重点在严密性' },
          { text: '用统计软件处理数据，重点是编程' }
        ],
        explain: '本站的定位是「用数学读经济现象」：先建模（函数、方程、约束），再算（导数、积分、最优化），最后解释结果。它既不是纯背书，也不是数学分析证明课，更不是编程课。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '需求 <code>Q<sup>d</sup> = 100 − 2P</code>、供给 <code>Q<sup>s</sup> = 20 + 3P</code> 的市场，均衡价格是 16。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '令 <code>100 − 2P = 20 + 3P</code>，得 <code>5P = 80</code>，<code>P* = 16</code>，代回得 <code>Q* = 68</code>。这个例子在后面每一章都会以不同形式复现。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'multi', difficulty: 1,
        tags: ['concept'],
        stem: '本站反复使用的四个核心概念是哪些？（多选）',
        options: [
          { text: '边际（marginal）', correct: true },
          { text: '弹性（elasticity）', correct: true },
          { text: '现值（present value）', correct: true },
          { text: '约束（constraint）', correct: true },
          { text: '熵（entropy）' },
          { text: '矩阵的秩（rank）' }
        ],
        explain: '边际回答「再多一单位会怎样」，弹性回答「相对变化有多敏感」，现值把未来折回今天，约束刻画稀缺。四者贯穿全课；熵与秩不是本课主线（矩阵只在 ch07 的 Cramer 法则里用到）。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '若收入上升使需求变为 <code>Q<sup>d</sup> = 120 − 2P</code>，供给仍为 <code>Q<sup>s</sup> = 20 + 3P</code>，新的均衡价格是 ______。',
        answer: '20',
        accept: ['20', 'P=20', 'P*=20'],
        explain: '<code>120 − 2P = 20 + 3P</code> 给 <code>5P = 120</code>，<code>P* = 20</code>，<code>Q* = 80</code>。需求整体右移 20，价格上升 4、数量增加 12，这就是比较静态。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '需求 <code>Q = 100 − 2P</code>，在 <code>P = 40</code>、<code>Q = 20</code> 处，需求价格弹性的绝对值约为多少？',
        options: [
          { text: '0.67' },
          { text: '2' },
          { text: '4', correct: true },
          { text: '40' }
        ],
        explain: '<code>E = (dQ/dP)(P/Q) = −2 × 40/20 = −4</code>，取绝对值为 4，属于富有弹性。同一函数在 <code>P = 20, Q = 60</code> 处只有 0.67，说明弹性沿需求线变化，不是常数（除非是常弹性形式）。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '按连续复利 5% 折现，10 年后的 1000 元今天约值 ______ 元（取整，已知 <code>e<sup>−0.5</sup> ≈ 0.6065</code>）。',
        answer: '607',
        accept: ['607', '606.5', '约607'],
        explain: '现值 <code>1000 × e<sup>−0.05×10</sup> = 1000 × e<sup>−0.5</sup> ≈ 606.5</code>。这就是「折现」：未来的一元钱不如今天的一元钱值钱，折现率越高、期限越长，缩水越厉害。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['method'],
        stem: '本站推荐的建模四步，正确顺序是？',
        options: [
          { text: '先算答案，再补假设，最后画图' },
          { text: '界定问题与变量 → 写出关系（函数/方程/约束）→ 求解 → 解释并检查合理性', correct: true },
          { text: '选公式 → 代入数字 → 交卷' },
          { text: '收集数据 → 回归 → 写结论，不需要假设' }
        ],
        explain: '建模的起点是「要回答什么问题、哪些量是变量、哪些是参数」，然后才写关系式。求解只是第三步；最后必须回到经济含义，检查符号、量纲与边界是否合理。跳过解释这一步，答案就只是数字。'
      },

      /* ---------------- ch01 代数基础 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['calculation'],
        stem: '<code>2<sup>3</sup> × 2<sup>4</sup></code> 等于多少？',
        options: [
          { text: '<code>2<sup>7</sup> = 128</code>', correct: true },
          { text: '<code>2<sup>12</sup> = 4096</code>' },
          { text: '<code>4<sup>7</sup></code>' },
          { text: '<code>2<sup>1</sup> = 2</code>' }
        ],
        explain: '同底数相乘，指数相加：<code>2<sup>3</sup>·2<sup>4</sup> = 2<sup>3+4</sup> = 2<sup>7</sup> = 128</code>。常见的错误是把指数相乘（得 <code>2<sup>12</sup></code>），那是幂的幂才用的规则。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '解方程 <code>3<sup>x</sup> = 12</code>，得 <code>x = ln12 / ln3 ≈</code> ______（保留四位小数）。',
        answer: '2.2619',
        accept: ['2.2619', '2.262', '约2.2619'],
        explain: '两边取自然对数：<code>x ln3 = ln12</code>，所以 <code>x = ln12/ln3 ≈ 2.4849/1.0986 ≈ 2.2619</code>。取对数把「指数上的未知数」拉下来，这是解指数方程的标准手法。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'fill', difficulty: 1,
        tags: ['calculation'],
        stem: '<code>1 + 2 + 3 + … + 100</code> 的和是 ______。',
        answer: '5050',
        accept: ['5050', '5,050'],
        explain: '等差数列求和 <code>n(n+1)/2 = 100×101/2 = 5050</code>。这个公式在算总收益、总成本、年金时反复出现，值得记牢。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '方程 <code>2x<sup>2</sup> − 8x + 6 = 0</code> 的两个根是？',
        options: [
          { text: '<code>x = 1</code> 与 <code>x = 3</code>', correct: true },
          { text: '<code>x = −1</code> 与 <code>x = −3</code>' },
          { text: '<code>x = 2</code> 与 <code>x = 6</code>' },
          { text: '<code>x = 1</code> 与 <code>x = −3</code>' }
        ],
        explain: '先除以 2：<code>x<sup>2</sup> − 4x + 3 = 0</code>，因式分解 <code>(x−1)(x−3) = 0</code>，得 1 与 3。用求根公式也一样：<code>x = [8 ± √(64−48)]/4 = [8 ± 4]/4</code>。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'tf', difficulty: 2,
        tags: ['calculation'],
        stem: '不等式 <code>|x − 3| ≤ 2</code> 的解集是 <code>1 ≤ x ≤ 5</code>。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '<code>|x−3| ≤ 2</code> 等价于 <code>−2 ≤ x−3 ≤ 2</code>，三边加 3 得 <code>1 ≤ x ≤ 5</code>。绝对值不等式先拆成双侧不等式，再解，最稳妥。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '某指标从 80 上升到 100，涨幅是多少？',
        options: [
          { text: '25%', correct: true },
          { text: '20%' },
          { text: '80%' },
          { text: '125%' }
        ],
        explain: '涨幅 <code>= (100−80)/80 = 0.25 = 25%</code>。注意分母是「原来的值」：从 100 降到 80 的跌幅是 20%，同样差 20，百分比不同。基期不同，百分比不可直接比较。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '<code>1.05<sup>3</sup></code> 的值是 ______（保留六位小数）。',
        answer: '1.157625',
        accept: ['1.157625', '1.1576'],
        explain: '<code>1.05<sup>2</sup> = 1.1025</code>，再乘 1.05 得 <code>1.157625</code>。三年每年 5% 的复利，总增长 15.7625%，而不是简单的 15%——差额来自「利息也生息」。'
      },

      /* ---------------- ch02 函数与图形 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '抛物线 <code>y = −2x<sup>2</sup> + 12x − 10</code> 的顶点坐标是？',
        options: [
          { text: '<code>(3, 8)</code>', correct: true },
          { text: '<code>(−3, 8)</code>' },
          { text: '<code>(3, −8)</code>' },
          { text: '<code>(6, 26)</code>' }
        ],
        explain: '顶点横坐标 <code>x = −b/(2a) = −12/(−4) = 3</code>，代入得 <code>y = −18 + 36 − 10 = 8</code>。因为 <code>a = −2 &lt; 0</code>，开口向下，顶点是最大值点。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'fill', difficulty: 1,
        tags: ['calculation'],
        stem: '过点 <code>(2, 5)</code> 与 <code>(6, 13)</code> 的直线，斜率是 ______。',
        answer: '2',
        accept: ['2', 'k=2'],
        explain: '<code>k = (13−5)/(6−2) = 8/4 = 2</code>，所以 <code>y = 2x + 1</code>。斜率 2 表示 x 每增加 1，y 增加 2；截距 1 是 x=0 时的值。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '函数 <code>y = 3x − 6</code> 的反函数是？',
        options: [
          { text: '<code>x = (y + 6)/3</code>', correct: true },
          { text: '<code>x = 3y − 6</code>' },
          { text: '<code>x = (y − 6)/3</code>' },
          { text: '<code>x = 1/(3y − 6)</code>' }
        ],
        explain: '把 y 解出来：<code>3x = y + 6</code>，<code>x = (y+6)/3</code>，即 <code>y<sup>−1</sup>(x) = (x+6)/3</code>。反函数与原函数关于 <code>y = x</code> 对称；需求函数的反函数就是「价格作为数量的函数」，即反需求曲线。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-7', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['calculation'],
        stem: '成本 <code>C(Q) = 200 + 5Q + 0.1Q<sup>2</sup></code>，平均成本最小时的产量约为？',
        options: [
          { text: '<code>Q = √2000 ≈ 44.72</code>', correct: true },
          { text: '<code>Q = 20</code>' },
          { text: '<code>Q = 100</code>' },
          { text: '<code>Q = 200</code>' }
        ],
        explain: '<code>AC = 200/Q + 5 + 0.1Q</code>，求导得 <code>−200/Q<sup>2</sup> + 0.1 = 0</code>，<code>Q<sup>2</sup> = 2000</code>，<code>Q ≈ 44.72</code>。此时 <code>AC = MC ≈ 13.944</code>，即边际成本曲线穿过平均成本曲线的最低点——这是成本理论里最重要的一个交点。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '函数 <code>f(x) = 1/(x − 3)</code> 的定义域是「除 3 以外的所有实数」。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '分母不能为零，所以 <code>x ≠ 3</code>，定义域是 <code>(−∞, 3) ∪ (3, +∞)</code>。找定义域要检查三件事：分母不为零、偶次根号内非负、对数内为正。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '下面哪个等式成立？',
        options: [
          { text: '<code>ln(e<sup>2</sup>) = 2</code>', correct: true },
          { text: '<code>ln(e<sup>2</sup>) = e<sup>2</sup></code>' },
          { text: '<code>e<sup>ln2</sup> = ln2</code>' },
          { text: '<code>ln(1) = 1</code>' }
        ],
        explain: '对数与指数互为反函数：<code>ln(e<sup>2</sup>) = 2</code>，<code>e<sup>ln2</sup> = 2</code>，<code>ln1 = 0</code>。这三条是换底、解指数方程、算连续复利的基础，务必分清。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '若 <code>f(u) = √u</code>、<code>g(x) = x<sup>2</sup> + 1</code>，则复合函数 <code>f(g(x)) =</code> ______。',
        answer: '√(x²+1)',
        accept: ['√(x²+1)', 'sqrt(x^2+1)', '(x²+1)^(1/2)', '根号下x²+1'],
        explain: '复合就是把内层整体塞进外层：<code>f(g(x)) = √(x<sup>2</sup>+1)</code>。定义域是所有实数，因为 <code>x<sup>2</sup>+1 ≥ 1 &gt; 0</code>。注意 <code>f(g(x))</code> 与 <code>g(f(x)) = x+1</code> 通常不同，复合不满足交换律。'
      },

      /* ---------------- ch03 导数与边际分析 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['calculation'],
        stem: '<code>f(x) = x<sup>3</sup></code> 在 <code>x = 2</code> 处的导数是？',
        options: [
          { text: '12', correct: true },
          { text: '8' },
          { text: '6' },
          { text: '3' }
        ],
        explain: '<code>f′(x) = 3x<sup>2</sup></code>，所以 <code>f′(2) = 12</code>。8 是函数值 <code>f(2)</code>，别把「点的值」与「点的斜率」混为一谈。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '<code>(x<sup>2</sup> + 1)(3x − 2)</code> 的导数是？',
        options: [
          { text: '<code>9x<sup>2</sup> − 4x + 3</code>', correct: true },
          { text: '<code>6x</code>' },
          { text: '<code>3x<sup>2</sup> + 3</code>' },
          { text: '<code>9x<sup>2</sup> + 4x − 3</code>' }
        ],
        explain: '乘积法则：<code>2x(3x−2) + (x<sup>2</sup>+1)·3 = 6x<sup>2</sup> − 4x + 3x<sup>2</sup> + 3 = 9x<sup>2</sup> − 4x + 3</code>。先展开再求导也能得到同样结果，但乘积法则在因子多时更省事。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '<code>(3x<sup>2</sup> + 1)<sup>5</sup></code> 的导数是 <code>30x(3x<sup>2</sup> + 1)<sup>n</sup></code>，其中 n = ______。',
        answer: '4',
        accept: ['4', 'n=4'],
        explain: '链式法则：外层 5 次方降为 4 次方，再乘内层导数 <code>6x</code>，得 <code>5(3x<sup>2</sup>+1)<sup>4</sup>·6x = 30x(3x<sup>2</sup>+1)<sup>4</sup></code>。忘记乘内层导数是链式法则最常见的错。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '<code>f(x) = ln(3x + 1)</code>，则 <code>f′(0) =</code> ______。',
        answer: '3',
        accept: ['3', 'f′(0)=3'],
        explain: '<code>f′(x) = 3/(3x+1)</code>，代入 <code>x = 0</code> 得 3。一般地 <code>[ln(ax+b)]′ = a/(ax+b)</code>，分子是内层导数，不是 1。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '成本 <code>C(Q) = 200 + 5Q + 0.1Q<sup>2</sup></code> 的边际成本是？',
        options: [
          { text: '<code>5 + 0.2Q</code>', correct: true },
          { text: '<code>200/Q + 5 + 0.1Q</code>' },
          { text: '<code>0.2Q</code>' },
          { text: '<code>5 + 0.1Q</code>' }
        ],
        explain: '对 Q 求导：常数 200 的导数为 0，<code>5Q</code> 给 5，<code>0.1Q<sup>2</sup></code> 给 <code>0.2Q</code>，所以 <code>MC = 5 + 0.2Q</code>。第二个选项是平均成本 AC，别混。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '需求 <code>Q = 100 − 2P</code>，在 <code>P = 20</code>、<code>Q = 60</code> 处需求价格弹性（取绝对值）约为？',
        options: [
          { text: '0.67', correct: true },
          { text: '2' },
          { text: '1.5' },
          { text: '40' }
        ],
        explain: '<code>|E| = |(dQ/dP)(P/Q)| = 2 × 20/60 ≈ 0.67 &lt; 1</code>，缺乏弹性，此时涨价能让总收益增加。同一需求线在 <code>P = 40</code> 处 <code>|E| = 4</code>，富有弹性，涨价反而减少收益。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-8', tier: 3, type: 'fill', difficulty: 3,
        tags: ['calculation'],
        stem: '用一阶近似，<code>√101 ≈</code> ______（保留两位小数）。',
        answer: '10.05',
        accept: ['10.05', '10.0499'],
        explain: '取 <code>f(x) = √x</code>，在 <code>x = 100</code> 处 <code>f = 10</code>、<code>f′ = 1/(2√x) = 0.05</code>，所以 <code>f(101) ≈ 10 + 0.05×1 = 10.05</code>。微分近似 <code>f(x+dx) ≈ f(x) + f′(x)dx</code> 在经济学里就是「边际量乘变化量」。'
      },

      /* ---------------- ch04 极限与最优化 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'fill', difficulty: 1,
        tags: ['calculation'],
        stem: '<code>lim<sub>x→2</sub> (x<sup>2</sup> − 4)/(x − 2) =</code> ______。',
        answer: '4',
        accept: ['4', '等于4'],
        explain: '分子因式分解 <code>(x−2)(x+2)</code>，约去 <code>x−2</code> 得 <code>x+2</code>，代入 2 得 4。0/0 型先约分再代入；约分前不能直接代，因为分母为 0 无定义。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '<code>lim<sub>x→0</sub> (e<sup>x</sup> − 1)/x</code> 等于？',
        options: [
          { text: '1', correct: true },
          { text: '0' },
          { text: 'e' },
          { text: '不存在' }
        ],
        explain: '这是 <code>e<sup>x</sup></code> 在 0 处的导数定义，等于 <code>e<sup>0</sup> = 1</code>；用洛必达法则也得到 <code>e<sup>x</sup>/1 → 1</code>。它是连续复利、对数求导与指数增长的核心极限。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '<code>f(x) = x<sup>3</sup> − 3x<sup>2</sup> + 4</code> 的极大值是？',
        options: [
          { text: '4', correct: true },
          { text: '0' },
          { text: '2' },
          { text: '−1' }
        ],
        explain: '<code>f′ = 3x<sup>2</sup> − 6x = 3x(x−2)</code>，驻点 x=0 与 x=2。<code>f″ = 6x − 6</code>，<code>f″(0) = −6 &lt; 0</code> 故 x=0 是极大，<code>f(0) = 4</code>；<code>f″(2) = 6 &gt; 0</code> 故 x=2 是极小，<code>f(2) = 0</code>。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-7', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['calculation'],
        stem: '垄断厂商面对需求 <code>P = 100 − 2Q</code>，成本 <code>C = 20Q</code>。利润最大时的产量与价格是？',
        options: [
          { text: '<code>Q = 20, P = 60</code>', correct: true },
          { text: '<code>Q = 25, P = 50</code>' },
          { text: '<code>Q = 40, P = 20</code>' },
          { text: '<code>Q = 10, P = 80</code>' }
        ],
        explain: '<code>R = 100Q − 2Q<sup>2</sup></code>，<code>MR = 100 − 4Q</code>；<code>MC = 20</code>；令 <code>MR = MC</code> 得 <code>Q = 20</code>，代入需求得 <code>P = 60</code>，利润 <code>60×20 − 20×20 = 800</code>。注意垄断者定价高于边际成本，加价幅度由弹性决定。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '闭区间上的连续函数一定能取到最大值与最小值。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '这是极值定理（extreme value theorem）：连续 + 闭区间保证最大最小值存在。两个条件缺一不可：开区间上 <code>f(x)=x</code> 取不到端点；<code>f(x)=1/x</code> 在 <code>(0,1]</code> 上无界。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'fill', difficulty: 1,
        tags: ['calculation'],
        stem: '<code>f(x) = x<sup>3</sup> − 3x<sup>2</sup></code> 的非零驻点是 x = ______。',
        answer: '2',
        accept: ['2', 'x=2'],
        explain: '<code>f′ = 3x<sup>2</sup> − 6x = 3x(x−2)</code>，驻点为 0 与 2，非零的是 2。驻点是「斜率为零」的点，不一定是最值点，还要看二阶导或两侧符号。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-8', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '对某商品征从量税，税负在消费者与生产者之间如何分担？',
        options: [
          { text: '弹性小（更不敏感）的一方承担更多', correct: true },
          { text: '总是消费者承担全部' },
          { text: '总是生产者承担全部' },
          { text: '按人数平均分担' }
        ],
        explain: '税负归宿由相对弹性决定：需求越缺乏弹性，消费者承担越多；供给越缺乏弹性，生产者承担越多。极端情形下，垂直的需求曲线让消费者承担全部，垂直的供给曲线让生产者承担全部。'
      },

      /* ---------------- ch05 积分与累积 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'fill', difficulty: 1,
        tags: ['calculation'],
        stem: '<code>∫<sub>0</sub><sup>3</sup> (2x + 1) dx =</code> ______。',
        answer: '12',
        accept: ['12', '等于12'],
        explain: '原函数 <code>x<sup>2</sup> + x</code>，代入上下限：<code>(9+3) − 0 = 12</code>。几何上是梯形面积：底 3、两高 1 与 7，面积 <code>(1+7)×3/2 = 12</code>。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '<code>∫ 2x(x<sup>2</sup> + 1)<sup>3</sup> dx</code> 等于？',
        options: [
          { text: '<code>(x<sup>2</sup> + 1)<sup>4</sup>/4 + C</code>', correct: true },
          { text: '<code>(x<sup>2</sup> + 1)<sup>4</sup> + C</code>' },
          { text: '<code>2x(x<sup>2</sup> + 1)<sup>4</sup>/4 + C</code>' },
          { text: '<code>(x<sup>2</sup> + 1)<sup>3</sup>/3 + C</code>' }
        ],
        explain: '令 <code>u = x<sup>2</sup>+1</code>，<code>du = 2x dx</code>，积分变成 <code>∫u<sup>3</sup>du = u<sup>4</sup>/4 + C</code>，回代即得。换元的关键是「凑出内层导数」，这里 2x 正好是 du。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '年收入 1000 元、利率 5%、无限期持续，其现值是？',
        options: [
          { text: '20000 元', correct: true },
          { text: '2000 元' },
          { text: '1000 元' },
          { text: '100000 元' }
        ],
        explain: '永续年金现值 <code>PV = A/r = 1000/0.05 = 20000</code>。直觉：要每年拿到 5%，需要本金 20000。离散情形 <code>Σ A/(1+r)<sup>t</sup></code> 也是同一结果，连续折现 <code>∫A e<sup>−rt</sup>dt</code> 同样得 <code>A/r</code>。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 3, type: 'fill', difficulty: 3,
        tags: ['calculation'],
        stem: '<code>∫<sub>0</sub><sup>1</sup> x e<sup>x</sup> dx =</code> ______。',
        answer: '1',
        accept: ['1', '等于1'],
        explain: '分部积分：<code>∫xe<sup>x</sup>dx = e<sup>x</sup>(x−1) + C</code>。代入 0 与 1：<code>e<sup>1</sup>(0) − e<sup>0</sup>(−1) = 1</code>。选 u=x、dv=e<sup>x</sup>dx 是因为 x 求导后变简单。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '需求 <code>P = 8 − 2Q</code>、市场价格为 2 时，消费者剩余是？',
        options: [
          { text: '9', correct: true },
          { text: '6' },
          { text: '18' },
          { text: '3' }
        ],
        explain: '价格 2 对应 <code>Q = 3</code>。CS 是需求线以下、价格线以上的三角形：<code>∫<sub>0</sub><sup>3</sup>(8−2Q−2)dQ = ∫<sub>0</sub><sup>3</sup>(6−2Q)dQ = 18 − 9 = 9</code>。也可用三角形 <code>(8−2)×3/2 = 9</code>。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '广义积分 <code>∫<sub>1</sub><sup>∞</sup> x<sup>−2</sup> dx</code> 收敛，且值等于 1。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '原函数 <code>−1/x</code>，上限取极限 <code>−1/x → 0</code>，所以积分 <code>= 0 − (−1) = 1</code>。指数小于 −1 时收敛，大于等于 −1 时发散（如 <code>∫1/x</code> 发散），这条判据在算永续收益时常用。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-8', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['calculation'],
        stem: '洛伦兹曲线 <code>L(x) = x<sup>2</sup></code> 对应的基尼系数是？',
        options: [
          { text: '<code>1/3</code>', correct: true },
          { text: '<code>1/2</code>' },
          { text: '<code>2/3</code>' },
          { text: '<code>1/4</code>' }
        ],
        explain: '基尼系数 <code>G = 1 − 2∫<sub>0</sub><sup>1</sup>L(x)dx = 1 − 2(1/3) = 1/3</code>。几何上它是「完全平等线」与洛伦兹曲线之间的面积除以三角形面积。<code>L(x)=x</code> 时 G=0，<code>L(x)=0</code> 时 G=1。'
      },

      /* ---------------- ch06 多元函数 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '<code>z = 3x<sup>2</sup>y + 5y<sup>3</sup></code> 在点 <code>(2, 1)</code> 处，<code>∂z/∂x</code> 等于？',
        options: [
          { text: '12', correct: true },
          { text: '27' },
          { text: '6' },
          { text: '17' }
        ],
        explain: '对 x 求偏导时把 y 当常数：<code>z<sub>x</sub> = 6xy</code>，代入 <code>(2,1)</code> 得 12。27 是 <code>z<sub>y</sub> = 3x<sup>2</sup>+15y<sup>2</sup></code> 在该点的值，17 是函数值 <code>z(2,1)</code>。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '生产函数 <code>Q = 10K<sup>0.3</sup>L<sup>0.7</sup></code>，在 <code>K = L = 8</code> 处 <code>MP<sub>K</sub> = 3</code>、<code>MP<sub>L</sub> = 7</code>，则产量 Q = ______。',
        answer: '80',
        accept: ['80', 'Q=80'],
        explain: '欧拉定理（一次齐次）：<code>K·MP<sub>K</sub> + L·MP<sub>L</sub> = Q</code>，即 <code>8×3 + 8×7 = 24 + 56 = 80</code>。也可直接代入：<code>10×8<sup>0.3</sup>×8<sup>0.7</sup> = 10×8 = 80</code>。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-8', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '<code>z = x<sup>2</sup> + y<sup>2</sup> − 4x − 6y + 13</code> 的极小点与极小值是？',
        options: [
          { text: '<code>(2, 3)</code>，极小值 0', correct: true },
          { text: '<code>(−2, −3)</code>，极小值 0' },
          { text: '<code>(2, 3)</code>，极小值 13' },
          { text: '<code>(0, 0)</code>，极小值 13' }
        ],
        explain: '<code>z<sub>x</sub> = 2x−4 = 0</code> 给 x=2，<code>z<sub>y</sub> = 2y−6 = 0</code> 给 y=3；代入 <code>4+9−8−18+13 = 0</code>。二阶：<code>z<sub>xx</sub>=2, z<sub>yy</sub>=2, z<sub>xy</sub>=0</code>，<code>D=4&gt;0</code> 且 <code>z<sub>xx</sub>&gt;0</code>，确为极小。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '圆 <code>x<sup>2</sup> + y<sup>2</sup> = 25</code> 在点 <code>(3, 4)</code> 处的斜率 <code>dy/dx</code> 是？',
        options: [
          { text: '<code>−3/4</code>', correct: true },
          { text: '<code>3/4</code>' },
          { text: '<code>−4/3</code>' },
          { text: '<code>4/3</code>' }
        ],
        explain: '隐函数求导：<code>2x + 2y·y′ = 0</code>，<code>y′ = −x/y</code>，在 <code>(3,4)</code> 处为 <code>−3/4</code>。一般公式 <code>dy/dx = −f<sub>x</sub>/f<sub>y</sub></code>，这里的负号不能丢。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '在 <code>(8, 8)</code> 处，<code>MP<sub>K</sub> = 3</code>、<code>MP<sub>L</sub> = 7</code>。若 K 与 L 各增加 0.1，用全微分估算产量增加约 ______。',
        answer: '1.0',
        accept: ['1', '1.0', '约1'],
        explain: '<code>dQ ≈ MP<sub>K</sub>dK + MP<sub>L</sub>dL = 3×0.1 + 7×0.1 = 1.0</code>。精确值略大（交叉项为正），但一阶近似已足够判断「小幅调整」的方向与量级。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: 'Young 定理说明，二阶偏导连续时：',
        options: [
          { text: '<code>z<sub>xy</sub> = z<sub>yx</sub></code>，求导次序无关', correct: true },
          { text: '<code>z<sub>xx</sub> = z<sub>yy</sub></code>，两个纯二阶偏导相等' },
          { text: '所有二阶偏导都为零' },
          { text: '偏导数一定不存在' }
        ],
        explain: 'Young 定理只保证交叉偏导与次序无关，不保证 <code>z<sub>xx</sub> = z<sub>yy</sub></code>（例如 <code>z = x<sup>2</sup> + 3y<sup>2</sup></code> 中两者是 2 与 6）。它让考试里可以挑好算的顺序求交叉项。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'Cobb-Douglas 生产函数 <code>Q = AK<sup>α</sup>L<sup>β</sup></code> 满足 <code>α + β = 1</code> 时，规模报酬是？',
        options: [
          { text: '不变（所有投入翻倍，产出也翻倍）', correct: true },
          { text: '递增' },
          { text: '递减' },
          { text: '无法判断，取决于 A' }
        ],
        explain: '把 K、L 同乘 t，得 <code>t<sup>α+β</sup>Q</code>。α+β=1 时等于 <code>tQ</code>，规模报酬不变；大于 1 递增，小于 1 递减。A 只影响整体水平（技术进步），不改变齐次次数。'
      },

      /* ---------------- ch07 约束优化与动态 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '效用 <code>U = xy</code>，价格 <code>p<sub>x</sub> = 2</code>、<code>p<sub>y</sub> = 5</code>，收入 <code>m = 100</code>。最优消费组合是？',
        options: [
          { text: '<code>x = 25, y = 10</code>', correct: true },
          { text: '<code>x = 20, y = 12</code>' },
          { text: '<code>x = 50, y = 0</code>' },
          { text: '<code>x = 10, y = 16</code>' }
        ],
        explain: '相切条件 <code>MU<sub>x</sub>/MU<sub>y</sub> = y/x = p<sub>x</sub>/p<sub>y</sub> = 2/5</code>，所以 <code>y = 0.4x</code>；代入预算 <code>2x + 5(0.4x) = 4x = 100</code>，得 <code>x = 25, y = 10</code>，效用 250。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '用 Cramer 法则解 <code>2x + 3y = 12</code>、<code>x − y = 1</code>，得 x = ______。',
        answer: '3',
        accept: ['3', 'x=3'],
        explain: '系数行列式 <code>det = 2(−1) − 3(1) = −5</code>；<code>det<sub>x</sub> = 12(−1) − 3(1) = −15</code>；<code>x = −15/−5 = 3</code>，代回得 y=2。行列式为零时方程组无唯一解。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '差分方程 <code>y<sub>t+1</sub> = 0.8y<sub>t</sub> + 20</code> 的稳态值是 ______。',
        answer: '100',
        accept: ['100', 'y*=100'],
        explain: '令 <code>y<sub>t+1</sub> = y<sub>t</sub> = y*</code>，得 <code>y* = 0.8y* + 20</code>，<code>0.2y* = 20</code>，<code>y* = 100</code>。因 <code>|0.8| &lt; 1</code>，从任意初值都会收敛到 100。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '在 <code>U = xy</code>、收入 100 的问题中解出 <code>λ = 5</code>。它的含义是？',
        options: [
          { text: '收入增加 1 元，最优效用约增加 5', correct: true },
          { text: '价格上升 1 元，效用增加 5' },
          { text: '效用最大值为 5' },
          { text: '消费者会储蓄 5 元' }
        ],
        explain: 'λ 是约束的影子价格：<code>dU*/dm = λ</code>。收入 100→101 时最优效用约 255，增量约 5，与 λ 吻合。它不是效用水平，也不是价格，而是「放松一单位约束的边际价值」。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-8', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '蛛网模型中若价格递推式为 <code>P<sub>t</sub> = 40 − 1.5P<sub>t−1</sub></code>，价格会收敛到均衡。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '系数 <code>a = −1.5</code>，<code>|a| &gt; 1</code>，所以振荡发散，不会收敛。稳定条件是 <code>|a| &lt; 1</code>，等价于供给曲线比需求曲线更陡（斜率 3 大于 2）。负号表示每期在均衡两侧交替。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-4', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['calculation'],
        stem: '效用 <code>U = x + 2y</code>，<code>p<sub>x</sub> = 2</code>、<code>p<sub>y</sub> = 3</code>、<code>m = 12</code>。最优选择是？',
        options: [
          { text: '<code>x = 0, y = 4</code>（角点解）', correct: true },
          { text: '<code>x = 6, y = 0</code>' },
          { text: '<code>x = 3, y = 2</code>' },
          { text: '<code>x = 2, y = 8/3</code>' }
        ],
        explain: '每元效用：x 为 <code>1/2 = 0.5</code>，y 为 <code>2/3 ≈ 0.667</code>，y 更划算，所以全部买 y：<code>y = 12/3 = 4</code>，<code>U = 8</code>。无差异曲线是直线，与预算线不切于内点，最优在边界。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '微分方程 <code>dp/dt + 2p = 60</code> 的稳态价格是 ______。',
        answer: '30',
        accept: ['30', 'p*=30'],
        explain: '稳态时 <code>dp/dt = 0</code>，得 <code>2p = 60</code>，<code>p* = 30</code>。因系数 <code>a = 2 &gt; 0</code>，解 <code>p(t) = 30 + (p<sub>0</sub>−30)e<sup>−2t</sup></code> 收敛到 30，半衰期 <code>ln2/2 ≈ 0.347</code>。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
