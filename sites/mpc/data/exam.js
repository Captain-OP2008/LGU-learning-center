/* =====================================================================
 * exam.js · MPC 模拟卷 A（CSC.registerExam）
 * 范围：ch00–ch07 综合
 * 规格：12 题、满分 100、限时 90 分钟
 * 题型：choice / tf / fill / output / keywords
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerExam({
    id: 'MPC-A',
    title: '微积分预科 模拟卷 A',
    style: '期末风格',
    subtitle: 'MPC · 覆盖 ch00–ch07 的综合模拟',
    date: '2026-11-21',
    minutes: 90,
    totalScore: 100,
    summary: '本卷覆盖八章：函数与图像、多项式与有理函数、指数与对数、三角与单位圆、' +
      '三角恒等式与解三角形、方程组与数列、圆锥曲线与极限预览。卷面 12 题：' +
      '选择 4 题共 32 分、判断 2 题共 14 分、填空 2 题共 14 分、' +
      '计算写答案 4 题共 38 分、简答与解释 2 题共 18 分，合计 100 分。' +
      '建议闭卷限时完成，计算题写清关键步骤，简答题按要点作答。',
    instructions: [
      '时间 90 分钟，满分 100 分。计时开始后不暂停，刷新页面也按真实时间计算。',
      '题型：单项选择 8 小问、判断 4 小问、填空 4 小问、计算写答案 8 小问、简答 4 小问。',
      '计算题只需写最终答案，但建议保留一两步关键变形以便自查；简答题按关键词命中比例给分。',
      '除特别说明外，三角函数的自变量一律用弧度；答案可以保留 π、√、ln 等精确形式。',
      '本卷不提供公式表。若某题卡住超过 6 分钟，先标记跳过，最后统一回看。'
    ],
    questions: [

      /* ---------------------------------------------------------- Q1 */
      { no: 1, points: 8, type: 'single choice',
        intro: '本题考察函数定义域与图像变换。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '函数 <code>f(x) = √(x − 3)/(x − 5)</code> 的定义域是？',
            options: [
              { text: '<code>x ≥ 3</code>' },
              { text: '<code>x ≥ 3</code> 且 <code>x ≠ 5</code>', correct: true },
              { text: '<code>x ≠ 5</code>' },
              { text: '全体实数' }
            ],
            explain: '根号要求被开方数非负：<code>x − 3 ≥ 0</code>；分母不能为零：<code>x − 5 ≠ 0</code>。' +
              '两个条件同时满足，取交集得 <code>x ≥ 3</code> 且 <code>x ≠ 5</code>。只写其中一条是最常见的失分点。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '把 <code>y = √x</code> 的图像变成 <code>y = −2√(x + 1) − 3</code>，正确的描述是？',
            options: [
              { text: '右移 1、纵向拉伸 2 倍、向上 3' },
              { text: '左移 1、纵向拉伸 2 倍并关于 x 轴翻折、向下 3', correct: true },
              { text: '左移 1、水平压缩 2 倍、向下 3' },
              { text: '右移 1、关于 y 轴翻折、向下 3' }
            ],
            explain: '括号内 <code>x + 1</code> 表示向左平移 1；系数 −2 先把图像纵向拉伸 2 倍，再关于 x 轴翻折；' +
              '末尾的 −3 表示向下平移 3。原来的起点 (0, 0) 映射到 (−1, −3)，可以用这个点快速验证变换是否写反。' }
        ] },

      /* ---------------------------------------------------------- Q2 */
      { no: 2, points: 8, type: 'true / false',
        intro: '判断下列陈述的真假。',
        parts: [
          { label: '(a)', points: 4, kind: 'tf',
            prompt: '对任意函数 <code>f</code>，都有 <code>f(x + h) = f(x) + h</code>。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '这只对斜率为 1 的一次函数成立。函数规则作用在整个输入上：' +
              '<code>f(x) = x<sup>2</sup></code> 时 <code>f(x + h) = x<sup>2</sup> + 2xh + h<sup>2</sup></code>，' +
              '并不是 <code>x<sup>2</sup> + h</code>。把函数当线性运算，会在导数推导的第一步就出错。' },
          { label: '(b)', points: 4, kind: 'tf',
            prompt: '多项式 <code>P(x) = (x − 1)<sup>2</sup>(x + 3)</code> 的图像在 <code>x = 1</code> 处穿过横轴。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '<code>x = 1</code> 是二重零点，重数为偶数，图像在该点与横轴相切后原路返回，不穿过。' +
              '只有 <code>x = −3</code> 是单重零点，图像在那里穿过横轴。判断穿与切只看重数的奇偶。' }
        ] },

      /* ---------------------------------------------------------- Q3 */
      { no: 3, points: 8, type: 'fill in the blank',
        intro: '把答案写在横线处，需要时保留精确形式。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '函数 <code>f(x) = 2x<sup>2</sup> − 8x + 5</code> 的最小值是 ______。',
            answer: '−3',
            accept: ['-3', '−3', '负 3'],
            explain: '配方：<code>2(x<sup>2</sup> − 4x) + 5 = 2(x − 2)<sup>2</sup> − 8 + 5 = 2(x − 2)<sup>2</sup> − 3</code>。' +
              '平方项最小为 0，所以最小值是 −3，在 <code>x = 2</code> 处取到。也可以直接用顶点公式 <code>−Δ/(4a)</code> 核对。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '方程 <code>2<sup>x+1</sup> = 10</code> 的解是 <code>x =</code> ______（可写精确形式，或保留三位小数）。',
            answer: 'log₂10 − 1 ≈ 2.322',
            accept: ['2.322', '2.3219', 'log2(10)-1', 'log₂10 − 1', 'ln10/ln2 - 1'],
            explain: '两边取自然对数：<code>(x + 1)ln 2 = ln 10</code>，所以 <code>x = ln 10 / ln 2 − 1 ≈ 3.3219 − 1 = 2.3219</code>。' +
              '检验：<code>2<sup>3.3219</sup> ≈ 10</code>，成立。写成 <code>log₂10 − 1</code> 是同一结果的精确形式。' }
        ] },

      /* ---------------------------------------------------------- Q4 */
      { no: 4, points: 8, type: 'single choice',
        intro: '本题考察弧度制与正弦型函数。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '<code>150°</code> 换算成弧度是？',
            options: [
              { text: '<code>5π/6</code>', correct: true },
              { text: '<code>3π/4</code>' },
              { text: '<code>2π/3</code>' },
              { text: '<code>7π/6</code>' }
            ],
            explain: '用 <code>150 × π/180</code> 化简得 <code>5π/6</code>。' +
              '检验：5π/6 ≈ 2.618，落在 π/2 ≈ 1.571 与 π ≈ 3.142 之间，属于第二象限，与 150° 的位置一致。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '函数 <code>y = 3sin(2x − π/3) + 1</code> 的周期是？',
            options: [
              { text: '<code>π</code>', correct: true },
              { text: '<code>2π</code>' },
              { text: '<code>π/2</code>' },
              { text: '<code>4π</code>' }
            ],
            explain: '周期 <code>T = 2π/|B| = 2π/2 = π</code>。振幅是 3，中线是 <code>y = 1</code>，' +
              '相位是右移 <code>π/6</code>（因为 <code>2x − π/3 = 2(x − π/6)</code>）。四个参数要分清各自对应哪个数。' }
        ] },

      /* ---------------------------------------------------------- Q5 */
      { no: 5, points: 6, type: 'true / false',
        intro: '判断下列陈述的真假。',
        parts: [
          { label: '(a)', points: 3, kind: 'tf',
            prompt: '<code>y = tan x</code> 的基本周期是 <code>π</code>。',
            options: [
              { text: '正确', correct: true },
              { text: '错误' }
            ],
            explain: 'tan 的周期是 π：直线斜率在角度转过半圈后就重复，<code>tan(x + π) = tan x</code> 对定义域内一切 x 成立。' +
              'sin 与 cos 的周期才是 2π。这个区别决定解三角方程时加 <code>kπ</code> 还是 <code>2kπ</code>。' },
          { label: '(b)', points: 3, kind: 'tf',
            prompt: '对任意正数 <code>a, b</code>，都有 <code>log(a + b) = log a + log b</code>。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '对数律只管乘法：<code>log(ab) = log a + log b</code>。取 <code>a = b = 10</code> 即得反例：' +
              '<code>log 20 ≈ 1.301</code>，而 <code>log 10 + log 10 = 2</code>。加法没有对应的对数律，这是代数变形中最常被误用的一条。' }
        ] },

      /* ---------------------------------------------------------- Q6 */
      { no: 6, points: 6, type: 'fill in the blank',
        intro: '把答案写在横线处，角度一律用弧度。',
        parts: [
          { label: '(a)', points: 3, kind: 'fill',
            prompt: '<code>sin(5π/6) =</code> ______。',
            answer: '1/2',
            accept: ['1/2', '0.5', '二分之一'],
            explain: '5π/6 在第二象限，参考角是 <code>π − 5π/6 = π/6</code>。第二象限正弦为正，' +
              '所以 <code>sin(5π/6) = sin(π/6) = 1/2</code>。先定象限符号、再算参考角数值，两步分开不易出错。' },
          { label: '(b)', points: 3, kind: 'fill',
            prompt: '已知 <code>sin θ = 3/5</code> 且 θ 在第一象限，则 <code>cos 2θ =</code> ______。',
            answer: '7/25',
            accept: ['7/25', '0.28'],
            explain: '用二倍角公式 <code>cos 2θ = 1 − 2sin<sup>2</sup>θ = 1 − 2(9/25) = 7/25</code>。' +
              '也可以先求 <code>cos θ = 4/5</code>，再用 <code>cos<sup>2</sup>θ − sin<sup>2</sup>θ = 16/25 − 9/25 = 7/25</code> 核对。' }
        ] },

      /* ---------------------------------------------------------- Q7 */
      { no: 7, points: 8, type: 'single choice',
        intro: '本题考察方程组与二项式系数。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '方程组 <code>2x + 3y = 12</code> 与 <code>x − y = 1</code> 的解是？',
            options: [
              { text: '<code>(3, 2)</code>', correct: true },
              { text: '<code>(2, 3)</code>' },
              { text: '<code>(3, −2)</code>' },
              { text: '<code>(1, 2)</code>' }
            ],
            explain: '由第二式得 <code>x = y + 1</code>，代入第一式：<code>2(y + 1) + 3y = 12</code>，即 <code>5y = 10</code>，' +
              '<code>y = 2</code>，<code>x = 3</code>。代回检验：<code>2(3) + 3(2) = 12</code>、<code>3 − 2 = 1</code>，都成立。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '<code>(x + 2)<sup>4</sup></code> 的展开式中，<code>x<sup>3</sup></code> 项的系数是？',
            options: [
              { text: '4' },
              { text: '8', correct: true },
              { text: '16' },
              { text: '32' }
            ],
            explain: '通项是 <code>C(4,k)·x<sup>4−k</sup>·2<sup>k</sup></code>，要得到 <code>x<sup>3</sup></code> 需 <code>k = 1</code>，' +
              '系数为 <code>C(4,1)×2 = 8</code>。完整展开是 <code>x<sup>4</sup> + 8x<sup>3</sup> + 24x<sup>2</sup> + 32x + 16</code>，' +
              '代 <code>x = 1</code> 得 81 = 3<sup>4</sup>，可用来验算整条展开式。' }
        ] },

      /* ---------------------------------------------------------- Q8 */
      { no: 8, points: 8, type: 'calculate',
        intro: '写出计算结果，不必写完整过程，但保留关键一步便于自查。',
        parts: [
          { label: '(a)', points: 4, kind: 'output',
            prompt: '某药物半衰期为 6 小时，初始剂量 400 mg。20 小时后体内剩余约为 ______ mg（保留一位小数）。',
            answer: '约 39.7 mg',
            accept: ['39.7', '39.7 mg', '约39.7', '40'],
            explain: '20 小时相当于 <code>20/6 ≈ 3.33</code> 个半衰期，剩余量 ' +
              '<code>400 × (1/2)<sup>20/6</sup> ≈ 400 × 0.0992 ≈ 39.7</code> mg。' +
              '注意指数部分必须是「经过时间 ÷ 半衰期」，直接乘 400 的 1/2 的整数次幂会算错。' },
          { label: '(b)', points: 4, kind: 'output',
            prompt: '三角形中 <code>b = 8</code>、<code>c = 7</code>、<code>A = 60°</code>，则 <code>a =</code> ______（可写精确形式）。',
            answer: '√57 ≈ 7.55',
            accept: ['√57', '7.55', '7.5498', 'sqrt(57)'],
            explain: '余弦定理：<code>a<sup>2</sup> = b<sup>2</sup> + c<sup>2</sup> − 2bc·cos A = 64 + 49 − 2×8×7×0.5 = 113 − 56 = 57</code>，' +
              '所以 <code>a = √57 ≈ 7.55</code>。检验：60° 接近等边情形，a 落在 7 与 8 之间，数量级合理。' }
        ] },

      /* ---------------------------------------------------------- Q9 */
      { no: 9, points: 8, type: 'short answer',
        intro: '用两三句话回答，答出要点即可。',
        parts: [
          { label: '(a)', points: 4, kind: 'keywords',
            prompt: '为什么 <code>R(x) = (x<sup>2</sup> − 4)/(x − 2)</code> 在 <code>x = 2</code> 处是「孔」而不是垂直渐近线？',
            keywords: ['约分', 'x ≠ 2', '极限为 4', '化简后为 x + 2', '孔'],
            explain: '分子因式分解为 <code>(x − 2)(x + 2)</code>，与分母约分后得 <code>x + 2</code>，但原式仍要求 <code>x ≠ 2</code>。' +
              '所以图像就是直线 <code>y = x + 2</code> 挖掉 <code>(2, 4)</code> 这一点：函数在该点无定义，但极限存在且等于 4。' +
              '垂直渐近线要求约分后分母仍然为零且函数值趋于无穷，这里不满足。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '已知两边 <code>a, b</code> 与其中一边的对角 <code>A</code>（SSA），什么条件下三角形有两个解？',
            keywords: ['b sinA < a < b', '正弦定理', 'sin B 有两个值', '钝角解', 'A 为锐角'],
            explain: '当 <code>A</code> 为锐角且 <code>b·sin A &lt; a &lt; b</code> 时，由正弦定理算出的 ' +
              '<code>sin B = b·sin A / a</code> 介于 0 与 1 之间且不等于 1，' +
              '于是 <code>B</code> 有一个锐角解和一个钝角解，两者都能与 A 组成合法三角形，因此有两解。' +
              '若 <code>a = b sin A</code> 则恰一解（直角），<code>a &lt; b sin A</code> 无解，<code>a ≥ b</code> 也只有一解。' }
        ] },

      /* ---------------------------------------------------------- Q10 */
      { no: 10, points: 10, type: 'calculate',
        intro: '写出结果；若为极限或无穷和，说明它存在的原因。',
        parts: [
          { label: '(a)', points: 5, kind: 'output',
            prompt: '无穷和 <code>1/2 + 1/4 + 1/8 + …</code> 等于 ______。',
            answer: '1',
            accept: ['1', '一'],
            explain: '这是首项 <code>a<sub>1</sub> = 1/2</code>、公比 <code>r = 1/2</code> 的等比级数。' +
              '因为 <code>|r| &lt; 1</code>，级数收敛，和为 <code>a<sub>1</sub>/(1 − r) = (1/2)/(1/2) = 1</code>。' +
              '部分和 0.5、0.75、0.875… 单调递增且始终小于 1，与结论一致。' },
          { label: '(b)', points: 5, kind: 'output',
            prompt: '<code>lim<sub>x→2</sub> (x<sup>2</sup> − 4)/(x − 2) =</code> ______。',
            answer: '4',
            accept: ['4', '四'],
            explain: '代入得 <code>0/0</code> 型，先因式分解约分：<code>(x − 2)(x + 2)/(x − 2) = x + 2</code>（要求 <code>x ≠ 2</code>），' +
              '再令 <code>x → 2</code> 得 4。注意 <code>f(2)</code> 本身没有定义，' +
              '极限存在与否和函数在该点是否有定义无关，这正是极限概念与「代入求值」的区别。' }
        ] },

      /* ---------------------------------------------------------- Q11 */
      { no: 11, points: 10, type: 'short answer',
        intro: '说明理由，必要时举出反例。',
        parts: [
          { label: '(a)', points: 5, kind: 'keywords',
            prompt: '为什么不存在 <code>log(a + b) = log a + log b</code> 这样的「加法对数律」？请给出一个具体反例。',
            keywords: ['log(ab)', '反例', 'log 20', '1.301', '不相等'],
            explain: '对数把乘法变成加法：<code>log(ab) = log a + log b</code>，但加法本身没有对应的化简律。' +
              '反例：<code>a = b = 10</code> 时左边 <code>log 20 ≈ 1.301</code>，右边 <code>1 + 1 = 2</code>，明显不等。' +
              '原因是 <code>log</code> 是幂运算的逆，而幂运算把加法变成乘法 <code>e<sup>p+q</sup> = e<sup>p</sup>e<sup>q</sup></code>，' +
              '所以逆运算只能把乘法拆成加法，方向反不过来。' },
          { label: '(b)', points: 5, kind: 'keywords',
            prompt: '椭圆与双曲线的标准形中，参数 <code>a, b, c</code> 的关系分别是什么？为什么不能混用？',
            keywords: ['c² = a² − b²', 'c² = a² + b²', '椭圆 c 最小', '双曲线 c 最大', '焦点位置'],
            explain: '椭圆满足 <code>c<sup>2</sup> = a<sup>2</sup> − b<sup>2</sup></code>，其中 a 是长半轴、c 是半焦距，' +
              '所以 <code>c &lt; a</code>；双曲线满足 <code>c<sup>2</sup> = a<sup>2</sup> + b<sup>2</sup></code>，' +
              'c 是焦点到中心的距离，反而是三者中最大的。' +
              '记法：椭圆里 c 最小，双曲线里 c 最大。混用会导致焦点算到曲线内部（椭圆）或算不出来（双曲线），' +
              '画图时立刻能看出矛盾。' }
        ] },

      /* ---------------------------------------------------------- Q12 */
      { no: 12, points: 12, type: 'comprehensive',
        intro: '综合题，写出关键步骤与最终答案。',
        parts: [
          { label: '(a)', points: 6, kind: 'output',
            prompt: '把极坐标方程 <code>r = 2cos θ</code> 化为直角坐标方程，并说明它是什么图形。',
            answer: '(x − 1)² + y² = 1，圆心 (1, 0)、半径 1 的圆',
            accept: ['(x-1)^2+y^2=1', 'x² + y² = 2x', '圆心(1,0)半径1的圆', '(x−1)²+y²=1'],
            explain: '两边同乘 r：<code>r<sup>2</sup> = 2r cos θ</code>。用 <code>r<sup>2</sup> = x<sup>2</sup> + y<sup>2</sup></code>、' +
              '<code>r cos θ = x</code> 得 <code>x<sup>2</sup> + y<sup>2</sup> = 2x</code>，' +
              '配方为 <code>(x − 1)<sup>2</sup> + y<sup>2</sup> = 1</code>：圆心 (1, 0)、半径 1。' +
              '注意 θ 只从 0 转到 π 就画完整个圆，π 到 2π 是在重复同一条曲线。' },
          { label: '(b)', points: 6, kind: 'output',
            prompt: '抛物线 <code>y = 2(x − 2)<sup>2</sup> − 3</code> 的焦点坐标是 ______，准线方程是 ______。',
            answer: '焦点 (2, −23/8)，准线 y = −25/8',
            accept: ['(2, -23/8)', '(2, −2.875)', 'y=-25/8', 'y = −3.125', '(2,-23/8) y=-25/8'],
            explain: '顶点是 <code>(2, −3)</code>，<code>a = 2</code>，开口向上。焦点到顶点的距离 ' +
              '<code>p = 1/(4a) = 1/8</code>，所以焦点 <code>(2, −3 + 1/8) = (2, −23/8)</code>，' +
              '准线在顶点下方同样距离：<code>y = −3 − 1/8 = −25/8</code>。' +
              '检验：焦点到准线的距离为 <code>2p = 1/4</code>，与 <code>1/(2a)</code> 一致。' }
        ] }
    ]
  });
})();
