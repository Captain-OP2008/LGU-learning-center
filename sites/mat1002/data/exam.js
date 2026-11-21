/* =====================================================================
 * exam.js · MAT1002 模拟卷 A
 * 范围：ch01–ch07（级数 / 幂级数与泰勒 / 参数曲线与极坐标 / 向量与空间 /
 *       偏导与多元极值 / 多重积分与三大定理）
 * 规格：12 题、满分 100、限时 120 分钟、闭卷无计算器
 * 题型：choice / tf / fill / keywords
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerExam({
    id: 'MAT1002-A',
    title: '微积分 II 模拟卷 A',
    style: '期末风格',
    subtitle: 'MAT1002 · 覆盖 ch01–ch07 的综合模拟，闭卷、无计算器',
    date: '2026-11-21',
    minutes: 120,
    totalScore: 100,
    summary: '本卷按期末形式组卷，覆盖七章主干：级数判据与余项、幂级数与泰勒展开、' +
      '参数曲线与极坐标、向量与空间几何、偏导与多元极值、多重积分与三大定理。' +
      '卷面 12 题：选择 10 小问共 40 分、判断 4 小问共 16 分、填空 10 小问共 40 分、' +
      '解答 2 题共 20 分。选择与填空占 80 分，目的是逼你把判据与公式记准；' +
      '两道解答题各两问，按步骤给分，写出关键等式即可得分。',
    instructions: [
      '时间 120 分钟，满分 100 分；闭卷，不允许使用计算器，答案保留精确形式（π、√2、ln 2 等）。',
      '选择与判断每题只有一个正确选项；填空只写最终结果，不必写过程，但解答题必须写出关键步骤。',
      '解答题按「判据/定理名称 → 关键等式 → 结果」三步给分，只写答案不写依据会扣分。',
      '级数题若用到判别法，请在答案中写明用的是哪一个（比值、根值、比较、积分、交错）。',
      '积分题若换坐标，请写出面积元或体积元（如 <code>r dr dθ</code>、<code>ρ<sup>2</sup>sin φ dρ dφ dθ</code>），漏写按步骤扣分。'
    ],
    questions: [

      /* ---------------------------------------------------------- Q1 */
      { no: 1, points: 8, type: 'single choice',
        intro: '本题考察 p 级数与几何级数。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '下面哪个级数收敛？',
            options: [
              { text: '<code>Σ 1/n</code>' },
              { text: '<code>Σ 1/n<sup>3/2</sup></code>', correct: true },
              { text: '<code>Σ 1/√n</code>' },
              { text: '<code>Σ n/(n+1)</code>' }
            ],
            explain: '这是 p 级数，<code>p = 3/2 &gt; 1</code>，收敛。其余：<code>p = 1</code> 与 <code>p = 1/2</code> 都发散；' +
              '<code>n/(n+1) → 1 ≠ 0</code>，通项不趋于零，必发散。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '<code>Σ<sub>n=0</sub><sup>∞</sup> (1/3)<sup>n</sup></code> 的和是：',
            options: [
              { text: '<code>1/2</code>' },
              { text: '<code>3/2</code>', correct: true },
              { text: '<code>3</code>' },
              { text: '发散' }
            ],
            explain: '公比 <code>r = 1/3</code>，首项 <code>a = 1</code>，和 <code>a/(1 − r) = 1/(2/3) = 3/2</code>。' +
              '注意 <code>n</code> 从 0 开始，若从 1 开始则是 <code>1/2</code>，这是最常见的陷阱。' }
        ] },

      /* ---------------------------------------------------------- Q2 */
      { no: 2, points: 8, type: 'true / false',
        intro: '判断下列陈述的真假，并说明理由。',
        parts: [
          { label: '(a)', points: 4, kind: 'tf',
            prompt: '条件收敛的级数一定收敛。',
            options: [
              { text: '正确', correct: true },
              { text: '错误' }
            ],
            explain: '正确。「条件收敛」的定义就是「收敛但不绝对收敛」，所以收敛是前提。典型例子是交错调和级数：' +
              '本身收敛，取绝对值后变成调和级数而发散。' },
          { label: '(b)', points: 4, kind: 'tf',
            prompt: '若比值判别法算得 <code>L = 1</code>，则级数收敛。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '错误。<code>L = 1</code> 是判别法失效的临界情形，收敛与发散都可能：' +
              '<code>Σ1/n</code> 发散、<code>Σ1/n<sup>2</sup></code> 收敛，两者的比值极限都是 1。' +
              '此时必须改用比较、积分或交错级数判别法。' }
        ] },

      /* ---------------------------------------------------------- Q3 */
      { no: 3, points: 8, type: 'fill in the blank',
        intro: '只写最终结果，不必写过程。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '<code>sin x</code> 的麦克劳林展开中，<code>x<sup>3</sup></code> 项的系数是 ______。',
            answer: '−1/6',
            accept: ['-1/6', '−1/6', '负六分之一'],
            explain: '<code>sin x = x − x<sup>3</sup>/3! + x<sup>5</sup>/5! − …</code>，所以 <code>x<sup>3</sup></code> 的系数是 ' +
              '<code>−1/3! = −1/6</code>。符号是负的，因为正弦的泰勒展开正负交替。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '幂级数 <code>Σ<sub>n=1</sub><sup>∞</sup> (−1)<sup>n+1</sup>x<sup>n</sup>/n</code> 在 <code>x = 1</code> 处的和是 ______。',
            answer: 'ln 2',
            accept: ['ln2', 'ln 2', 'ln(2)', '0.693'],
            explain: '这正是 <code>ln(1 + x)</code> 在 <code>x = 1</code> 的展开：' +
              '<code>ln 2 = 1 − 1/2 + 1/3 − 1/4 + …</code>。端点 <code>x = 1</code> 属于收敛域，' +
              '因为交错调和级数收敛（阿贝尔定理保证和函数在端点连续）。' }
        ] },

      /* ---------------------------------------------------------- Q4 */
      { no: 4, points: 8, type: 'single choice',
        intro: '本题考察交错级数与条件收敛。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '交错级数 <code>Σ(−1)<sup>n+1</sup>b<sub>n</sub></code>（<code>b<sub>n</sub></code> 递减趋 0）用前 <code>N</code> 项近似，' +
              '误差的界是：',
            options: [
              { text: '<code>b<sub>1</sub></code>' },
              { text: '<code>b<sub>N</sub></code>' },
              { text: '<code>b<sub>N+1</sub></code>', correct: true },
              { text: '<code>1/N<sup>2</sup></code>' }
            ],
            explain: '交错级数判别法给出 <code>|R<sub>N</sub>| ≤ b<sub>N+1</sub></code>：误差不超过第一个被舍去的项。' +
              '这个界既好记又紧，是估计所需项数的主要工具。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '级数 <code>Σ (−1)<sup>n</sup>/√n</code> 是：',
            options: [
              { text: '绝对收敛' },
              { text: '条件收敛', correct: true },
              { text: '发散' },
              { text: '无法判断' }
            ],
            explain: '取绝对值得 <code>Σ1/√n</code>，<code>p = 1/2 &lt; 1</code> 发散；但 <code>1/√n</code> 递减趋 0，' +
              '由交错级数判别法原级数收敛。收敛但不绝对收敛，故为条件收敛。' }
        ] },

      /* ---------------------------------------------------------- Q5 */
      { no: 5, points: 8, type: 'fill in the blank',
        intro: '极坐标与参数曲线的计算。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '圆 <code>r = 2cos θ</code> 围成的面积是 ______。',
            answer: 'π',
            accept: ['π', 'pi', '3.14'],
            explain: '<code>A = 1/2∫<sub>−π/2</sub><sup>π/2</sup>(2cos θ)<sup>2</sup>dθ = 2∫cos<sup>2</sup>θ dθ = π</code>。' +
              '也可先化为直角坐标：<code>(x − 1)<sup>2</sup> + y<sup>2</sup> = 1</code>，半径 1，面积 <code>π</code>。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '曲线 <code>r(t) = ⟨t, t<sup>2</sup>/2⟩</code> 从 <code>t = 0</code> 到 <code>t = 1</code> 的弧长是 ______。',
            answer: '(√2 + ln(1 + √2))/2',
            accept: ['(√2+ln(1+√2))/2', '(√2 + ln(1+√2))/2', '1.148', '(√2+ln(1+√2))/2'],
            explain: '<code>r′(t) = ⟨1, t⟩</code>，<code>|r′| = √(1 + t<sup>2</sup>)</code>，弧长 ' +
              '<code>s = ∫<sub>0</sub><sup>1</sup>√(1 + t<sup>2</sup>)dt = [t√(1+t<sup>2</sup>)/2 + ln(t + √(1+t<sup>2</sup>))/2]<sub>0</sub><sup>1</sup>' +
              ' = (√2 + ln(1 + √2))/2</code>，约 1.148。' }
        ] },

      /* ---------------------------------------------------------- Q6 */
      { no: 6, points: 8, type: 'single choice',
        intro: '本题考察平面方程与点积。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '平面 <code>x + 2y + 3z = 6</code> 的一个法向量是：',
            options: [
              { text: '<code>⟨1, 2, 3⟩</code>', correct: true },
              { text: '<code>⟨6, 0, 0⟩</code>' },
              { text: '<code>⟨1, 2, 6⟩</code>' },
              { text: '<code>⟨3, 2, 1⟩</code>' }
            ],
            explain: '平面 <code>ax + by + cz = d</code> 的法向量直接读系数：<code>⟨a, b, c⟩ = ⟨1, 2, 3⟩</code>。' +
              '常数项 <code>d</code> 只影响平面到原点的距离，不影响方向。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '向量 <code>a = ⟨1, 2, 2⟩</code> 与 <code>b = ⟨2, 1, −2⟩</code> 的关系是：',
            options: [
              { text: '平行' },
              { text: '垂直', correct: true },
              { text: '夹角 60°' },
              { text: '无法判断' }
            ],
            explain: '<code>a · b = 1·2 + 2·1 + 2·(−2) = 2 + 2 − 4 = 0</code>，点积为零且两向量非零，故垂直。' +
              '顺便：<code>|a| = |b| = 3</code>，所以它们还是一对等长正交向量。' }
        ] },

      /* ---------------------------------------------------------- Q7 */
      { no: 7, points: 8, type: 'fill in the blank',
        intro: '向量运算与曲率。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '<code>⟨1, 0, 0⟩ × ⟨0, 1, 0⟩</code> = ______。',
            answer: '⟨0, 0, 1⟩',
            accept: ['(0,0,1)', '⟨0,0,1⟩', 'k', '0,0,1'],
            explain: '标准基的叉积遵循循环次序：<code>i × j = k</code>，<code>j × k = i</code>，<code>k × i = j</code>。' +
              '所以结果是 <code>⟨0, 0, 1⟩</code>。叉积反交换，<code>j × i = −k</code>。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '半径 <code>R = 3</code> 的圆，曲率 <code>κ</code> = ______。',
            answer: '1/3',
            accept: ['1/3', '0.333', '三分之一'],
            explain: '圆的曲率恒为 <code>1/R</code>，所以 <code>κ = 1/3</code>。曲率是「单位弧长上切线转过的角度」，' +
              '半径越大转得越慢，曲率越小；直线可视为 <code>R → ∞</code>，曲率为 0。' }
        ] },

      /* ---------------------------------------------------------- Q8 */
      { no: 8, points: 8, type: 'single choice',
        intro: '本题考察多元函数的极值与方向导数。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '函数 <code>f(x, y) = x<sup>2</sup> + y<sup>2</sup> − 2x − 4y</code> 的极小值点是：',
            options: [
              { text: '<code>(1, 2)</code>', correct: true },
              { text: '<code>(−1, −2)</code>' },
              { text: '<code>(2, 1)</code>' },
              { text: '<code>(0, 0)</code>' }
            ],
            explain: '令 <code>f<sub>x</sub> = 2x − 2 = 0</code>、<code>f<sub>y</sub> = 2y − 4 = 0</code>，得唯一临界点 <code>(1, 2)</code>。' +
              '<code>f<sub>xx</sub> = 2 &gt; 0</code>、<code>D = 4 &gt; 0</code>，故为极小点，极小值 <code>−5</code>。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '在一点处，函数值增加最快的方向是：',
            options: [
              { text: '梯度的方向', correct: true },
              { text: '与梯度垂直的方向' },
              { text: '与梯度相反的方向' },
              { text: '沿 x 轴的方向' }
            ],
            explain: '<code>D<sub>u</sub>f = ∇f · u = |∇f|cos θ</code>，<code>u</code> 与 <code>∇f</code> 同向时取最大值。' +
              '相反方向下降最快，垂直方向（等值线方向）方向导数为 0。' }
        ] },

      /* ---------------------------------------------------------- Q9 */
      { no: 9, points: 8, type: 'fill in the blank',
        intro: '偏导数与约束极值。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '<code>f(x, y) = x<sup>2</sup>y<sup>3</sup></code>，则 <code>f<sub>xy</sub></code> = ______。',
            answer: '6xy²',
            accept: ['6xy^2', '6xy²', '6*x*y^2'],
            explain: '<code>f<sub>x</sub> = 2xy<sup>3</sup></code>，再对 <code>y</code> 求偏导得 <code>f<sub>xy</sub> = 6xy<sup>2</sup></code>。' +
              '也可以先对 <code>y</code> 后对 <code>x</code>，结果相同，因为两个混合偏导在该函数上连续。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '在约束 <code>x<sup>2</sup> + y<sup>2</sup> = 1</code> 下，<code>f(x, y) = x + y</code> 的最大值是 ______。',
            answer: '√2',
            accept: ['√2', 'sqrt2', '1.414', '根号2'],
            explain: '拉格朗日条件：<code>1 = 2λx</code>、<code>1 = 2λy</code>，故 <code>x = y</code>；代入约束得 <code>x = y = ±1/√2</code>。' +
              '取正号时 <code>f = 2/√2 = √2</code> 为最大值，负号时为最小值 <code>−√2</code>。' }
        ] },

      /* ---------------------------------------------------------- Q10 */
      { no: 10, points: 8, type: 'single choice',
        intro: '本题考察坐标变换下的面积元与体积元。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '极坐标下面积元 <code>dA</code> 等于：',
            options: [
              { text: '<code>dr dθ</code>' },
              { text: '<code>r dr dθ</code>', correct: true },
              { text: '<code>r<sup>2</sup> dr dθ</code>' },
              { text: '<code>r dθ</code>' }
            ],
            explain: '雅可比行列式 <code>∂(x,y)/∂(r,θ) = r</code>，所以 <code>dA = r dr dθ</code>。' +
              '几何上小扇形面积约为 <code>r Δr Δθ</code>，漏掉 <code>r</code> 量纲都不对。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '柱坐标 <code>(r, θ, z)</code> 下的体积元 <code>dV</code> 等于：',
            options: [
              { text: '<code>dr dθ dz</code>' },
              { text: '<code>r dr dθ dz</code>', correct: true },
              { text: '<code>r<sup>2</sup> dr dθ dz</code>' },
              { text: '<code>ρ<sup>2</sup>sin φ dρ dφ dθ</code>' }
            ],
            explain: '柱坐标只是在极坐标上再加一个 <code>z</code>，<code>dV = dA · dz = r dr dθ dz</code>。' +
              '第四项是球坐标的体积元，不要混用。' }
        ] },

      /* ---------------------------------------------------------- Q11 */
      { no: 11, points: 10, type: 'calculation',
        intro: '本题考察幂级数的收敛域与和函数，按步骤给分。',
        parts: [
          { label: '(a)', points: 6, kind: 'keywords',
            prompt: '求幂级数 <code>Σ<sub>n=1</sub><sup>∞</sup> n x<sup>n</sup></code> 的收敛区间与和函数。',
            keywords: ['比值', 'R = 1', '(−1, 1)', '端点', '发散', 'x/(1 − x)²', '逐项求导'],
            explain: '比值 <code>|a<sub>n+1</sub>/a<sub>n</sub>| = (n+1)|x|/n → |x|</code>，故 <code>R = 1</code>；端点 <code>x = ±1</code> 时通项不趋于 0，发散，' +
              '收敛区间为 <code>(−1, 1)</code>。求和：由 <code>1/(1 − x) = Σx<sup>n</sup></code> 逐项求导得 ' +
              '<code>1/(1 − x)<sup>2</sup> = Σn x<sup>n−1</sup></code>，两边乘 <code>x</code> 得 <code>Σn x<sup>n</sup> = x/(1 − x)<sup>2</sup></code>。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '利用 (a) 的结果，求 <code>Σ<sub>n=1</sub><sup>∞</sup> n/2<sup>n</sup></code>。',
            answer: '2',
            accept: ['2', '2.0'],
            explain: '在 <code>x/(1 − x)<sup>2</sup></code> 中代入 <code>x = 1/2</code>：分子 <code>1/2</code>，分母 <code>(1/2)<sup>2</sup> = 1/4</code>，' +
              '商为 <code>2</code>。这个级数绝对收敛（<code>|x| = 1/2 &lt; 1</code>），代入合法。' }
        ] },

      /* ---------------------------------------------------------- Q12 */
      { no: 12, points: 10, type: 'calculation',
        intro: '本题考察格林定理与散度定理，注意方向约定。',
        parts: [
          { label: '(a)', points: 6, kind: 'keywords',
            prompt: '设 <code>C</code> 为单位圆 <code>x<sup>2</sup> + y<sup>2</sup> = 1</code>，取逆时针方向，' +
              '<code>F = ⟨x<sup>2</sup> − y, x + y<sup>2</sup>⟩</code>。求 <code>∮<sub>C</sub> F · dr</code>。',
            keywords: ['格林定理', 'Q_x − P_y', '2', '单位圆面积 π', '2π', '逆时针为正'],
            explain: '<code>P = x<sup>2</sup> − y</code>、<code>Q = x + y<sup>2</sup></code>，<code>Q<sub>x</sub> − P<sub>y</sub> = 1 − (−1) = 2</code>。' +
              '由格林定理，环量 <code>= ∬<sub>D</sub>2 dA = 2 · π = 2π</code>。方向为逆时针，公式取正号。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '设 <code>S</code> 为单位球面，取外法向，<code>F = ⟨x, y, z⟩</code>。' +
              '用散度定理求 <code>∬<sub>S</sub> F · n dS</code>。',
            keywords: ['散度定理', 'div F = 3', '球体积 4π/3', '4π', '外法向'],
            explain: '<code>div F = 1 + 1 + 1 = 3</code>，由散度定理通量 <code>= ∭<sub>V</sub>3 dV = 3 · (4π/3) = 4π</code>。' +
              '若补写「S 为闭曲面、外法向，满足散度定理条件」，步骤分更稳。' }
        ] }
    ]
  });
})();
