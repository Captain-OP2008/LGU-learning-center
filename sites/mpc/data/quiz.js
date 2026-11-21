/* =====================================================================
 * quiz.js · MPC 分章题库
 * 结构：{ items:[{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options?, answer?, accept?, code?, explain }] }
 * 题型：mcq / tf / fill / multi / predict
 * 覆盖：ch00–ch07，每章 7 题，共 56 题
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '微积分课老师写 <code>((x+h)<sup>2</sup> − x<sup>2</sup>)/h</code> 后说「展开、约掉、取极限」，这一步主要考验哪种预科能力？',
        options: [
          { text: '记住导数的定义式' },
          { text: '代数变形：展开、合并同类项、约分', correct: true },
          { text: '用计算器求数值' },
          { text: '背三角恒等式' }
        ],
        explain: '这一步没有任何新定理，全部是代数：展开得 <code>2xh + h<sup>2</sup></code>，除以 h 得 <code>2x + h</code>，再令 h → 0。预科要练到这类变形不用想，微积分课才有余力理解「极限」本身。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '本站的七章可以任意打乱顺序学习，包括把 ch05 放在 ch04 之前，不影响理解。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '01 → 02 与 04 → 05 是硬依赖：没有函数语言读不懂后面每一章，没有弧度与单位圆，三角恒等式就只是符号游戏。其余章节可以按需调整，但这两组建议按顺序。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '水柱高度 <code>h(x) = −0.05x<sup>2</sup> + 0.8x + 1.2</code>，配方后顶点纵坐标是多少？（填数字，单位米）',
        answer: '4.4',
        accept: ['4.4', '4.4 米', '22/5'],
        explain: '提 −0.05：<code>h = −0.05(x<sup>2</sup> − 16x) + 1.2 = −0.05(x − 8)<sup>2</sup> + 3.2 + 1.2 = −0.05(x−8)<sup>2</sup> + 4.4</code>。顶点 (8, 4.4)，所以最高 4.4 米。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['tool'],
        stem: '计算器处于 DEG 模式时输入 <code>sin(π/6)</code>，得到的结果最接近下面哪个？',
        options: [
          { text: '0.5' },
          { text: '0.0091', correct: true },
          { text: '1' },
          { text: '报错，无法计算' }
        ],
        explain: 'DEG 模式把括号里的数当作角度：<code>π/6 ≈ 0.5236°</code>，其正弦约 0.00914。要得到 0.5 必须切到 RAD。这是「弧度与角度混用」最典型的事故，用 <code>sin 30° = 0.5</code> 可以快速自检。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '解出矩形花园的 <code>x = 10</code> 与 <code>x = 30</code> 两个根，但篱笆总长只有 40 米。四步法里哪一步能发现 30 必须舍去？',
        options: [
          { text: '翻译' },
          { text: '选工具' },
          { text: '代回检验（检查定义域）', correct: true },
          { text: '计算' }
        ],
        explain: '定义域是 <code>0 &lt; x &lt; 20</code>，30 超出范围，代回会算出负的边长。第四步「代回检验」不只是核对数值，还包括检查答案是否落在定义域与实际约束内。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '本站反复使用的「四步法」包含下面哪些步骤？（多选）',
        options: [
          { text: '把中文题意翻译成方程或不等式', correct: true },
          { text: '按结构选择工具（配方、取对数、正弦/余弦定理）', correct: true },
          { text: '算出答案后代回原式并检查定义域', correct: true },
          { text: '先用计算器画出图像，再倒推公式' },
          { text: '把公式表全部背下来再开始做题' }
        ],
        explain: '四步是翻译 → 选工具 → 算 → 代回检验。画图是辅助手段不是步骤本身；背公式表既不充分也不必要，选错工具时公式表帮不上忙。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code', 'calc'],
        code: 'from sympy import symbols, expand\nx = symbols("x")\nf = -0.05*x**2 + 0.8*x + 1.2\nvertex_x = 8\nprint(f.subs(x, vertex_x))',
        stem: '这段代码在验证抛物线的顶点纵坐标。输出是什么？',
        answer: '4.40000000000000',
        accept: ['4.4', '4.40000000000000', '4.4 米'],
        explain: '顶点横坐标 <code>−b/(2a) = −0.8/(2×(−0.05)) = 8</code>，代入得 <code>−0.05×64 + 6.4 + 1.2 = −3.2 + 7.6 = 4.4</code>。浮点运算会打印出 4.40000000000000 这样的尾数，数值上就是 4.4。'
      },

      /* ---------------- ch01 函数与图像 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '<code>f(x) = √(x − 3)/(x − 5)</code> 的定义域是？',
        options: [
          { text: '<code>x ≥ 3</code>' },
          { text: '<code>x ≥ 3</code> 且 <code>x ≠ 5</code>', correct: true },
          { text: '<code>x ≠ 5</code>' },
          { text: '全体实数' }
        ],
        explain: '根号要求 <code>x − 3 ≥ 0</code>，分母要求 <code>x − 5 ≠ 0</code>，两个条件取交集：<code>x ≥ 3</code> 且 <code>x ≠ 5</code>。只写其中一个都会漏掉另一半限制。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '对任意函数都有 <code>f(x + h) = f(x) + h</code>。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '这只对一次函数成立。函数规则作用在整个输入上：<code>f(x) = x<sup>2</sup></code> 时 <code>f(x+h) = x<sup>2</sup> + 2xh + h<sup>2</sup></code>，不是 <code>x<sup>2</sup> + h</code>。这个错误会直接毁掉导数的推导。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '<code>f(x) = 2x<sup>2</sup> − 8x + 5</code> 的最小值是多少？',
        answer: '−3',
        accept: ['-3', '−3', '负3'],
        explain: '配方：<code>2(x<sup>2</sup> − 4x) + 5 = 2(x − 2)<sup>2</sup> − 8 + 5 = 2(x−2)<sup>2</sup> − 3</code>。平方项最小为 0，所以最小值 −3，在 <code>x = 2</code> 取到。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['graph'],
        stem: '把 <code>y = √x</code> 变成 <code>y = −2√(x + 1) − 3</code>，正确的变换顺序描述是？',
        options: [
          { text: '右移 1、纵向拉伸 2、向上 3' },
          { text: '左移 1、纵向拉伸 2 倍并关于 x 轴翻折、向下 3', correct: true },
          { text: '左移 1、水平压缩 2 倍、向下 3' },
          { text: '右移 1、关于 y 轴翻折、向下 3' }
        ],
        explain: '括号内 <code>x + 1</code> 是向左 1；外面系数 −2 表示纵向拉伸 2 倍再关于 x 轴翻折；最后的 −3 是向下 3。起点 (0,0) 变到 (−1,−3)，可用 <code>x = 0</code> 时 <code>y = −5</code> 验证。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '<code>f(x) = x<sup>2</sup></code>、<code>g(x) = x − 3</code>，则 <code>f(g(5))</code> 等于？',
        options: [
          { text: '2' },
          { text: '4', correct: true },
          { text: '22' },
          { text: '25' }
        ],
        explain: '从里往外：<code>g(5) = 2</code>，再 <code>f(2) = 4</code>。若算成 <code>g(f(5)) = 25 − 3 = 22</code> 就说明顺序反了；复合不满足交换律。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-1', tier: 2, type: 'multi', difficulty: 2,
        tags: ['graph'],
        stem: '下面哪些关系是函数 <code>y = f(x)</code>？（多选）',
        options: [
          { text: '<code>y = x<sup>2</sup></code>', correct: true },
          { text: '<code>x<sup>2</sup> + y<sup>2</sup> = 25</code> 的整条曲线' },
          { text: '<code>y = √(25 − x<sup>2</sup>)</code>（上半圆）', correct: true },
          { text: '<code>y = ±√x</code>' },
          { text: '<code>y = |x|</code>', correct: true }
        ],
        explain: '用垂直线测试：整圆在 <code>x = 0</code> 处有两个 y，不是函数；<code>y = ±√x</code> 同样一处两值。上半圆、抛物线、绝对值都满足「每个 x 恰好一个 y」。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code', 'calc'],
        code: 'def avg_rate(f, a, b):\n    return (f(b) - f(a)) / (b - a)\n\nf = lambda x: x**2\nprint(avg_rate(f, 1, 1.1))',
        stem: '这段代码计算 <code>f(x) = x<sup>2</sup></code> 在 [1, 1.1] 上的平均变化率，输出最接近哪个数？',
        answer: '2.1',
        accept: ['2.1', '2.100000000000001', '2.10'],
        explain: '<code>(1.1<sup>2</sup> − 1<sup>2</sup>)/0.1 = (1.21 − 1)/0.1 = 2.1</code>。区间越短，这个值越接近 <code>x = 1</code> 处的瞬时变化率 2，也就是 <code>f′(1) = 2</code>。浮点误差可能打印 2.100000000000001。'
      },

      /* ---------------- ch02 多项式与有理函数 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '<code>f(x) = −2x<sup>3</sup> + 5x<sup>2</sup> − x + 7</code> 当 <code>x → +∞</code> 时趋向？',
        options: [
          { text: '+∞' },
          { text: '−∞', correct: true },
          { text: '0' },
          { text: '7' }
        ],
        explain: '首项 <code>−2x<sup>3</sup></code> 主导：次数 3 是奇数，首项系数为负，所以右端向下、左端向上。代 <code>x = 1000</code> 可验证：<code>−2×10<sup>9</sup></code> 压倒数百万量级的其余项。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['graph'],
        stem: '<code>P(x) = (x − 1)<sup>2</sup>(x + 3)</code> 的图像在 <code>x = 1</code> 处穿过横轴。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '<code>x = 1</code> 是二重零点，偶重意味着图像在这里与横轴相切后原路返回，不穿过。只有 <code>x = −3</code>（单重）才穿过。判断只看重数的奇偶。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '<code>P(x) = x<sup>3</sup> − 2x<sup>2</sup> + 4x − 7</code> 除以 <code>x − 2</code> 的余数是多少？',
        answer: '1',
        accept: ['1', '余数 1'],
        explain: '由余数定理，余数等于 <code>P(2) = 8 − 8 + 8 − 7 = 1</code>。不需要做长除。若做长除，商是 <code>x<sup>2</sup> + 4</code>，乘回去 <code>(x−2)(x<sup>2</sup>+4) + 1</code> 正好还原。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '<code>R(x) = (x<sup>2</sup> − 4)/(x − 2)</code> 在 <code>x = 2</code> 处的图像特征是？',
        options: [
          { text: '垂直渐近线' },
          { text: '一个孔 (2, 4)', correct: true },
          { text: '水平渐近线 y = 0' },
          { text: '连续且取值为 2' }
        ],
        explain: '分解得 <code>(x−2)(x+2)/(x−2)</code>，约掉后是 <code>x + 2</code>，但 <code>x ≠ 2</code>，所以缺 (2, 4) 这一点，是孔不是渐近线。判断顺序必须是先约分再判类型。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['graph'],
        stem: '<code>R(x) = (2x<sup>2</sup> − 3x + 1)/(x<sup>2</sup> − 4)</code> 的水平渐近线是？',
        options: [
          { text: '<code>y = 0</code>' },
          { text: '<code>y = 2</code>', correct: true },
          { text: '<code>y = 1</code>' },
          { text: '没有水平渐近线' }
        ],
        explain: '分子分母次数相同（都是 2），水平渐近线是首项系数之比 <code>2/1 = 2</code>。垂直渐近线是 <code>x = ±2</code>。若分子次数比分母大 1，才会出现斜渐近线。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['graph'],
        stem: '下面哪些函数在 <code>x = 2</code> 处有<b>垂直渐近线</b>？（多选）',
        options: [
          { text: '<code>1/(x − 2)</code>', correct: true },
          { text: '<code>(x<sup>2</sup> − 4)/(x − 2)</code>' },
          { text: '<code>(x + 1)/(x<sup>2</sup> − 4)</code>', correct: true },
          { text: '<code>(x − 2)/(x<sup>2</sup> − 4)</code>' },
          { text: '<code>1/(x<sup>2</sup> + 4)</code>' }
        ],
        explain: '垂直渐近线要求分母为零且约分后仍为零。<code>(x<sup>2</sup>−4)/(x−2)</code> 与 <code>(x−2)/(x<sup>2</sup>−4)</code> 都能约掉 <code>(x−2)</code>，在 x = 2 处是孔；<code>1/(x<sup>2</sup>+4)</code> 分母恒正，没有垂直渐近线。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-6', tier: 3, type: 'predict', difficulty: 3,
        tags: ['code', 'calc'],
        code: 'import sympy as sp\nx = sp.symbols("x")\nexpr = (x - 1)*(x + 3)/(x - 2)\nprint(sp.solve_univariate_inequality(expr >= 0, x, relational=False))',
        stem: '这段代码解不等式 <code>(x − 1)(x + 3)/(x − 2) ≥ 0</code>，结果区间是？',
        answer: '[-3, 1] U (2, oo)',
        accept: ['[-3, 1] U (2, oo)', '[-3,1]∪(2,+∞)', '[-3, 1] ∪ (2, +∞)'],
        explain: '临界点 −3、1、2 把数轴分成四段，测试点定号得 <code>[−3, 1]</code> 为正、<code>(2, +∞)</code> 为正。2 是分母零点，必须用圆括号；−3 与 1 是分子零点且可取等号，用方括号。'
      },

      /* ---------------- ch03 指数与对数 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '下面哪组数据最像「指数增长」？',
        options: [
          { text: '2, 4, 6, 8, 10（每次加 2）' },
          { text: '2, 4, 8, 16, 32（每次乘 2）', correct: true },
          { text: '1, 4, 9, 16, 25（平方数）' },
          { text: '1, 1, 2, 3, 5（斐波那契）' }
        ],
        explain: '指数增长的判据是「等间隔的比值恒定」：4/2 = 8/4 = 16/8 = 2。第一组差恒定是线性，第三组是幂函数，第四组是递推但不是等比。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '对任意正数 a、b，都有 <code>log(a + b) = log a + log b</code>。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '对数律只管乘法：<code>log(ab) = log a + log b</code>。取 a = b = 10 反例：<code>log 20 ≈ 1.301</code>，而 <code>log10 + log10 = 2</code>。加法没有对应的对数律。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '解 <code>2<sup>x+1</sup> = 10</code>，<code>x</code> 的精确值是 <code>log<sub>2</sub>10 − 1</code>，近似值是多少？（保留三位小数）',
        answer: '2.322',
        accept: ['2.3219', '2.322', '≈2.322', '2.32'],
        explain: '两边取对数：<code>(x+1)ln2 = ln10</code>，<code>x = ln10/ln2 − 1 ≈ 3.3219 − 1 = 2.3219</code>。检验：<code>2<sup>3.3219</sup> ≈ 10</code>，成立。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '1000 元按年利率 5% 连续复利存 10 年，本息合计约为？',
        options: [
          { text: '1500 元' },
          { text: '1628.89 元' },
          { text: '1648.72 元', correct: true },
          { text: '2000 元' }
        ],
        explain: '连续复利 <code>A = Pe<sup>rt</sup> = 1000e<sup>0.5</sup> ≈ 1648.72</code>。1628.89 是按年复利 <code>1000×1.05<sup>10</sup></code> 的结果；从按日到连续只多几分钱，说明复利频率的收益递减。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '某药物半衰期 6 小时，初始剂量 400 mg。20 小时后剩余量约为？',
        options: [
          { text: '约 40 mg', correct: true },
          { text: '约 100 mg' },
          { text: '约 200 mg' },
          { text: '约 20 mg' }
        ],
        explain: '<code>N = 400 × 0.5<sup>20/6</sup> ≈ 400 × 0.5<sup>3.333</sup> ≈ 400 × 0.0992 ≈ 39.7</code> mg。20 小时约 3.33 个半衰期，剩不到十分之一。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些等式恒成立？（多选）',
        options: [
          { text: '<code>log<sub>a</sub>(xy) = log<sub>a</sub>x + log<sub>a</sub>y</code>（x, y &gt; 0）', correct: true },
          { text: '<code>log<sub>a</sub>(x/y) = log<sub>a</sub>x − log<sub>a</sub>y</code>', correct: true },
          { text: '<code>log<sub>a</sub>(x<sup>r</sup>) = r·log<sub>a</sub>x</code>', correct: true },
          { text: '<code>log<sub>a</sub>(x + y) = log<sub>a</sub>x + log<sub>a</sub>y</code>' },
          { text: '<code>(log<sub>a</sub>x)<sup>2</sup> = 2log<sub>a</sub>x</code>' }
        ],
        explain: '三条对数律对应乘、除、幂。加法和「对数的平方」都没有简化公式：后者是 <code>log<sub>a</sub>(x<sup>2</sup>)</code> 的误写，只有当 <code>log<sub>a</sub>x</code> 恰为 0 或 2 时才碰巧成立，不是恒等式。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-5', tier: 3, type: 'predict', difficulty: 3,
        tags: ['code', 'calc'],
        code: 'import math\n# solve log2(x-1) + log2(x+3) = 3\n# (x-1)(x+3) = 8  ->  x^2 + 2x - 11 = 0\nroots = [(-2 + math.sqrt(4 + 44)) / 2, (-2 - math.sqrt(4 + 44)) / 2]\nprint([round(r, 3) for r in roots])',
        stem: '这段代码在解 <code>log<sub>2</sub>(x − 1) + log<sub>2</sub>(x + 3) = 3</code>。两个根中哪个是有效解？',
        answer: '2.464',
        accept: ['2.464', 'x = -1 + 2√3', '-1+2√3', '2.46'],
        explain: '合并得 <code>(x−1)(x+3) = 8</code>，即 <code>x<sup>2</sup> + 2x − 11 = 0</code>，根为 <code>−1 ± 2√3</code>。负根约 −4.464 使 <code>x − 1 &lt; 0</code>，对数无定义，舍去；有效解是 <code>−1 + 2√3 ≈ 2.464</code>。'
      },

      /* ---------------- ch04 三角与单位圆 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '150° 换算成弧度是？',
        options: [
          { text: '5π/6', correct: true },
          { text: '3π/4' },
          { text: '2π/3' },
          { text: '7π/6' }
        ],
        explain: '<code>150 × π/180 = 5π/6</code>。检验：5π/6 ≈ 2.618，在 π/2 ≈ 1.571 与 π ≈ 3.142 之间，位于第二象限，与 150° 一致。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-6', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '<code>y = tan x</code> 的基本周期是 <code>2π</code>。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'tan 的周期是 <code>π</code>，因为斜率在转过半圈后就重复了。sin 与 cos 才是 2π。这个区别在解三角方程时决定加 <code>kπ</code> 还是 <code>2kπ</code>。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'fill', difficulty: 1,
        tags: ['calc'],
        stem: '<code>sin(5π/6)</code> 的值是多少？（填分数）',
        answer: '1/2',
        accept: ['1/2', '0.5', '二分之一'],
        explain: '5π/6 在第二象限，参考角 <code>π − 5π/6 = π/6</code>，第二象限 sin 为正，所以等于 <code>sin(π/6) = 1/2</code>。符号与数值分开处理，不要一步到位。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['graph'],
        stem: '<code>y = 3sin(2x − π/3) + 1</code> 的周期是？',
        options: [
          { text: '<code>π</code>', correct: true },
          { text: '<code>2π</code>' },
          { text: '<code>π/2</code>' },
          { text: '<code>4π</code>' }
        ],
        explain: '<code>T = 2π/|B| = 2π/2 = π</code>。振幅是 3，中线是 <code>y = 1</code>，相位是右移 <code>π/6</code>（因为 <code>2x − π/3 = 2(x − π/6)</code>）。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['graph'],
        stem: '<code>y = 3sin(2x − π/3) + 1</code> 相对 <code>y = 3sin(2x) + 1</code> 做了什么？',
        options: [
          { text: '左移 π/3' },
          { text: '右移 π/6', correct: true },
          { text: '右移 π/3' },
          { text: '左移 π/6' }
        ],
        explain: '把括号内提取 2：<code>3sin(2(x − π/6)) + 1</code>，所以右移 π/6。若误读常数项 π/3 就会选右移 π/3——必须先提取 B 再读 C。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些说法正确？（多选）',
        options: [
          { text: '在单位圆上，<code>cos θ</code> 是点的横坐标', correct: true },
          { text: '<code>sin<sup>2</sup>θ + cos<sup>2</sup>θ = 1</code> 对一切 θ 成立', correct: true },
          { text: '弧度制下弧长公式是 <code>s = rθ</code>', correct: true },
          { text: '<code>tan θ</code> 在 <code>θ = π/2</code> 处等于 0' },
          { text: '第二象限 <code>cos θ &gt; 0</code>' }
        ],
        explain: '单位圆定义给出 cos 是横坐标、sin 是纵坐标，勾股定理给出平方和恒为 1；<code>s = rθ</code> 只在弧度制下成立。tan 在 π/2 处无定义（分母 cos 为 0），第二象限 cos 为负。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-1', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code', 'calc'],
        code: 'import math\nr = 12\ntheta = 5 * math.pi / 6\nprint(round(r * theta, 2))',
        stem: '这段代码算半径 12 cm、圆心角 150° 的弧长，输出约为？',
        answer: '31.42',
        accept: ['31.42', '10π', '31.4'],
        explain: '<code>s = rθ = 12 × 5π/6 = 10π ≈ 31.42</code> cm。若 θ 误用 150（度），会得到 1800 这种荒谬结果，正好说明弧度制的必要性。'
      },

      /* ---------------- ch05 三角恒等式与解三角形 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '<code>sin 75°</code> 的精确值是？',
        options: [
          { text: '<code>(√6 − √2)/4</code>' },
          { text: '<code>(√6 + √2)/4</code>', correct: true },
          { text: '<code>(√3 + 1)/2</code>' },
          { text: '<code>√3/2</code>' }
        ],
        explain: '<code>sin(45°+30°) = sin45 cos30 + cos45 sin30 = (√2/2)(√3/2) + (√2/2)(1/2) = (√6+√2)/4 ≈ 0.966</code>。75° 接近 90°，sin 应接近 1，可据此排除小于 0.9 的选项。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '证明恒等式时，可以把待证等式两边同时乘以同一个含 θ 的式子，只要两边都乘就行。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '这是循环论证，而且乘的式子可能为零，会引入不成立的情况。正确做法是只对一边变形，或两边各自变形到同一个中间式，每一步都用已知恒等式。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '已知 <code>sin θ = 3/5</code> 且 θ 在第一象限，<code>cos 2θ</code> 等于多少？（填分数）',
        answer: '7/25',
        accept: ['7/25', '0.28', '二十八分之七'],
        explain: '用 <code>cos 2θ = 1 − 2sin<sup>2</sup>θ = 1 − 2(9/25) = 7/25</code>。也可先求 <code>cos θ = 4/5</code>，再用 <code>cos<sup>2</sup> − sin<sup>2</sup> = 16/25 − 9/25 = 7/25</code> 核对。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '<code>2sin<sup>2</sup>x − sin x − 1 = 0</code> 在 <code>[0, 2π)</code> 内有几个解？',
        options: [
          { text: '1 个' },
          { text: '2 个' },
          { text: '3 个', correct: true },
          { text: '4 个' }
        ],
        explain: '换元因式分解：<code>(2sin x + 1)(sin x − 1) = 0</code>，得 <code>sin x = −1/2</code> 或 <code>1</code>。<code>−1/2</code> 给出 <code>7π/6</code>、<code>11π/6</code> 两个解，<code>1</code> 给出 <code>π/2</code>，共 3 个。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '<code>a = 10</code>、<code>b = 12</code>、<code>A = 30°</code> 的三角形有几个解？',
        options: [
          { text: '0 个' },
          { text: '1 个' },
          { text: '2 个', correct: true },
          { text: '无穷多个' }
        ],
        explain: '<code>b sin A = 12 × 0.5 = 6</code>，满足 <code>6 &lt; a &lt; b</code>（即 <code>b sinA &lt; a &lt; b</code>），属于 SSA 两解情形。<code>sin B = 0.6</code> 给 B ≈ 36.87° 或 143.13°，两个三角形都合法。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些情形适合用余弦定理？（多选）',
        options: [
          { text: '已知两边及夹角（SAS）', correct: true },
          { text: '已知三边（SSS）', correct: true },
          { text: '已知两角及一边（AAS）' },
          { text: '已知两边及其中一边的对角（SSA）' },
          { text: '已知三边求面积（配合海伦公式）', correct: true }
        ],
        explain: '余弦定理处理「边与夹角」或「三边」的关系。AAS 用正弦定理更直接；SSA 虽然也能用余弦定理列二次方程，但标准做法是正弦定理加两解判断。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-6', tier: 3, type: 'predict', difficulty: 3,
        tags: ['code', 'calc'],
        code: 'import math\nb, c, A = 8, 7, math.radians(60)\na = math.sqrt(b**2 + c**2 - 2*b*c*math.cos(A))\nprint(round(a, 3))',
        stem: '这段代码用余弦定理求第三边，输出约为？',
        answer: '7.55',
        accept: ['7.55', '7.550', '√57', '7.5498'],
        explain: '<code>a<sup>2</sup> = 64 + 49 − 2×8×7×0.5 = 113 − 56 = 57</code>，<code>a = √57 ≈ 7.55</code>。检验：夹角 60° 接近等边情形，a 应接近 7 到 8 之间，合理。'
      },

      /* ---------------- ch06 方程组与数列 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['calc'],
        stem: '方程组 <code>2x + 3y = 12</code> 与 <code>x − y = 1</code> 的解是？',
        options: [
          { text: '(3, 2)', correct: true },
          { text: '(2, 3)' },
          { text: '(3, −2)' },
          { text: '(1, 2)' }
        ],
        explain: '由第二式 <code>x = y + 1</code>，代入第一式得 <code>5y = 10</code>，<code>y = 2</code>，<code>x = 3</code>。检验：<code>2(3)+3(2)=12</code>、<code>3−2=1</code>，都对。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '二元一次方程组的系数行列式 <code>D = 0</code> 时，方程组一定无解。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'D = 0 只说明两直线平行或重合。若常数项也成比例则无穷多解（如 <code>x+y=2</code> 与 <code>2x+2y=4</code>）；常数项不成比例才无解。还要看消元后是 <code>0 = 0</code> 还是 <code>0 = 非零</code>。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-6', tier: 1, type: 'fill', difficulty: 1,
        tags: ['calc'],
        stem: '<code>1 + 2 + 3 + … + n</code> 的求和公式是？（用 n 表示）',
        answer: 'n(n+1)/2',
        accept: ['n(n+1)/2', 'n(n+1)/2', '(n^2+n)/2', 'n(n + 1)/2'],
        explain: '倒序相加：<code>S = 1+…+n</code>，倒着写 <code>S = n+…+1</code>，两式相加得 <code>2S = n(n+1)</code>，所以 <code>S = n(n+1)/2</code>。也可以用数学归纳法证明。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '<code>1/2 + 1/4 + 1/8 + …</code> 的无穷和是？',
        options: [
          { text: '1', correct: true },
          { text: '2' },
          { text: '1/2' },
          { text: '发散，没有和' }
        ],
        explain: '这是 <code>a<sub>1</sub> = 1/2</code>、<code>r = 1/2</code> 的等比级数，<code>|r| &lt; 1</code> 收敛，和为 <code>a<sub>1</sub>/(1−r) = (1/2)/(1/2) = 1</code>。部分和 0.5、0.75、0.875… 确实逼近 1。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '<code>(x + 2)<sup>4</sup></code> 展开式中 <code>x<sup>3</sup></code> 的系数是？',
        options: [
          { text: '4' },
          { text: '8', correct: true },
          { text: '16' },
          { text: '32' }
        ],
        explain: '通项 <code>C(4,k)x<sup>4−k</sup>2<sup>k</sup></code>，要 <code>x<sup>3</sup></code> 取 <code>k = 1</code>，系数 <code>C(4,1)×2 = 8</code>。完整展开是 <code>x<sup>4</sup> + 8x<sup>3</sup> + 24x<sup>2</sup> + 32x + 16</code>，代 x = 1 得 81 = 3<sup>4</sup>，可验算。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '关于等差数列与等比数列，下面哪些说法正确？（多选）',
        options: [
          { text: '等差数列相邻两项之差恒定', correct: true },
          { text: '等比数列相邻两项之比恒定（各项非零）', correct: true },
          { text: '等比数列的无穷和总存在' },
          { text: '等差数列前 n 项和可用倒序相加推出', correct: true },
          { text: '等比数列前 n 项和公式对 r = 1 也适用' }
        ],
        explain: '无穷等比和只在 <code>|r| &lt; 1</code> 时存在；<code>r = 1</code> 时求和公式分母为零，必须单独处理（和为 <code>na<sub>1</sub></code>）。前三项与第四项是两类数列的基本性质。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-2', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code', 'calc'],
        code: 'import sympy as sp\nx, y = sp.symbols("x y")\nsol = sp.solve([2*x + 3*y - 12, x - y - 1], [x, y])\nprint(sol)',
        stem: '这段代码解 <code>2x + 3y = 12</code> 与 <code>x − y = 1</code>，输出是？',
        answer: '{x: 3, y: 2}',
        accept: ['{x: 3, y: 2}', 'x=3, y=2', '(3, 2)'],
        explain: '消元得 <code>y = 2</code>、<code>x = 3</code>，所以解是 <code>{x: 3, y: 2}</code>。代回两式都成立。若用克拉默法则：<code>D = −5</code>，<code>D<sub>x</sub> = −15</code>，<code>D<sub>y</sub> = −10</code>，同样得 (3, 2)。'
      },

      /* ---------------- ch07 圆锥曲线与极限预览 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '圆 <code>x<sup>2</sup> + y<sup>2</sup> − 6x + 4y − 12 = 0</code> 的圆心与半径是？',
        options: [
          { text: '圆心 (3, −2)，半径 5', correct: true },
          { text: '圆心 (−3, 2)，半径 5' },
          { text: '圆心 (3, −2)，半径 25' },
          { text: '圆心 (6, −4)，半径 12' }
        ],
        explain: '配方：<code>(x−3)<sup>2</sup> + (y+2)<sup>2</sup> = 12 + 9 + 4 = 25</code>，所以圆心 (3, −2)、半径 5。半径是等式右边的平方根，不是 25 本身。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '椭圆的标准形中，焦距参数满足 <code>c<sup>2</sup> = a<sup>2</sup> + b<sup>2</sup></code>。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '椭圆是 <code>c<sup>2</sup> = a<sup>2</sup> − b<sup>2</sup></code>（c 最小）；双曲线才是 <code>c<sup>2</sup> = a<sup>2</sup> + b<sup>2</sup></code>（c 最大）。记「椭圆里 c 最小、双曲线里 c 最大」就不会用错。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-6', tier: 1, type: 'fill', difficulty: 1,
        tags: ['calc'],
        stem: '<code>lim<sub>x→2</sub> (x<sup>2</sup> − 4)/(x − 2)</code> 等于多少？',
        answer: '4',
        accept: ['4', '四'],
        explain: '约分：<code>(x−2)(x+2)/(x−2) = x + 2</code>（x ≠ 2），令 x → 2 得 4。注意 <code>f(2)</code> 本身没有定义，极限存在但与函数值无关——这是极限概念的关键。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['graph'],
        stem: '极坐标方程 <code>r = 2cos θ</code> 对应的图形是？',
        options: [
          { text: '以 (1, 0) 为圆心、半径 1 的圆', correct: true },
          { text: '以原点为圆心、半径 2 的圆' },
          { text: '一条过原点的直线' },
          { text: '心形线' }
        ],
        explain: '两边乘 r：<code>r<sup>2</sup> = 2r cos θ</code>，即 <code>x<sup>2</sup> + y<sup>2</sup> = 2x</code>，配方得 <code>(x−1)<sup>2</sup> + y<sup>2</sup> = 1</code>。θ 从 0 到 π 就画完整个圆，π 到 2π 重复。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '用导数定义求 <code>f(x) = x<sup>2</sup></code> 的导数，结果是？',
        options: [
          { text: '<code>2x</code>', correct: true },
          { text: '<code>x</code>' },
          { text: '<code>2x + h</code>' },
          { text: '<code>x<sup>2</sup></code>' }
        ],
        explain: '差商 <code>((x+h)<sup>2</sup> − x<sup>2</sup>)/h = (2xh + h<sup>2</sup>)/h = 2x + h</code>，再令 <code>h → 0</code> 得 <code>2x</code>。<code>2x + h</code> 是取极限之前的式子，不是导数。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些说法正确？（多选）',
        options: [
          { text: '函数在 c 处连续要求 f(c) 有定义、极限存在、两者相等', correct: true },
          { text: '极限存在时，函数在该点一定有定义' },
          { text: '<code>lim<sub>x→0</sub> sin x / x = 1</code> 在弧度制下成立', correct: true },
          { text: '参数方程能描述运动的方向，普通方程不能', correct: true },
          { text: '极坐标中 r 必须为正' }
        ],
        explain: '极限可以与函数值无关（如 <code>(x<sup>2</sup>−4)/(x−2)</code> 在 x = 2 无定义但极限为 4）；sin x/x 的极限依赖弧度制；负 r 表示反方向。连续性三条缺一不可。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-1', tier: 3, type: 'predict', difficulty: 3,
        tags: ['code', 'calc'],
        code: 'a = 2\nh, k = 2, -3\nfocus_y = k + 1/(4*a)\nprint(focus_y)',
        stem: '这段代码求 <code>y = 2(x − 2)<sup>2</sup> − 3</code> 的焦点纵坐标，输出是？',
        answer: '-2.875',
        accept: ['-2.875', '−2.875', '-23/8', '−23/8'],
        explain: '顶点 (2, −3)，<code>a = 2</code>，焦点距顶点 <code>1/(4a) = 1/8 = 0.125</code>，开口向上，所以焦点 <code>(2, −3 + 0.125) = (2, −2.875)</code>，即 <code>−23/8</code>。准线是 <code>y = −3.125</code>。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
