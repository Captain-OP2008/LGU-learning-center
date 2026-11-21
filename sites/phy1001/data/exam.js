/* =====================================================================
 * exam.js · 模拟卷 A（CSC.registerExam）
 * 覆盖期中范围：测量与矢量、直线运动、二维运动、牛顿定律、功与能量、动量与转动
 * 12 题，满分 100，建议 90 分钟
 * ===================================================================== */
CSC.registerExam({
  id: 'PHY1001-A',
  title: '模拟卷 A · 期中范围',
  style: 'MIDTERM',
  subtitle: '覆盖第 1–10 章：测量与矢量、运动学、牛顿定律、功与能、动量与转动',
  date: '',
  minutes: 90,
  totalScore: 100,
  summary: '选择题 4 题（每题 2 小问）、判断题 1 题、填空题 4 题、计算与简答 3 题；共 12 题，满分 100 分。建议先用 45 分钟完成客观题，再用 45 分钟处理计算题。',
  instructions: [
    '考试为闭卷，可携带一张 A4 手写公式纸（双面）；不得使用具有通信或存储功能的计算器。',
    '所有计算题必须写出所用的物理定律、代入的数值与单位，只写答案不得满分。',
    '数值均取 g = 9.8 m/s²；结果保留三位有效数字即可，但中间步骤建议多留一位。',
    '遇到不会的题先跳过，先拿稳客观题与套公式就能得分的部分，最后再回头处理综合题。'
  ],
  questions: [
    {
      no: 1,
      points: 10,
      type: '概念题',
      intro: '量纲与单位是物理的第一道门槛，本题考查你能否在不计算的情况下判断表达式是否合理。',
      parts: [
        {
          label: '1(1)',
          points: 5,
          kind: 'choice',
          prompt: '下列哪个表达式的量纲与能量相同？',
          options: [
            { text: 'mv<sup>2</sup>', correct: true },
            { text: 'ma' },
            { text: 'mv/t' },
            { text: 'mgh/t' }
          ],
          explain: '能量量纲为 ML<sup>2</sup>T<sup>−2</sup>。mv<sup>2</sup> 的量纲是 M(LT<sup>−1</sup>)<sup>2</sup> = ML<sup>2</sup>T<sup>−2</sup>，与能量相同（差一个 ½ 的系数不影响量纲）。ma 是力，mv/t 也是力，mgh/t 是功率。'
        },
        {
          label: '1(2)',
          points: 5,
          kind: 'fill',
          prompt: '把 72 km/h 换算成 m/s，结果是多少？（只填数字）',
          answer: '20',
          explain: '72 ÷ 3.6 = 20 m/s。换算口诀是「km/h 除以 3.6 得 m/s」，反过来乘以 3.6。记住这个系数，可以避免在考试中现场推导。'
        }
      ]
    },
    {
      no: 2,
      points: 8,
      type: '矢量',
      intro: '矢量运算在力学里无处不在，点积判垂直、叉积定方向，是最常用的两个工具。',
      parts: [
        {
          label: '2(1)',
          points: 4,
          kind: 'choice',
          prompt: '力 F = (3 N, 4 N) 作用在位移 s = (4 m, −3 m) 上，该力做的功是多少？',
          options: [
            { text: '0 J', correct: true },
            { text: '24 J' },
            { text: '25 J' },
            { text: '−24 J' }
          ],
          explain: 'W = F·s = 3×4 + 4×(−3) = 12 − 12 = 0 J。两个矢量点积为零说明它们垂直，力不做功。这类题不要分别算大小再乘 cos θ，直接分量相乘相加最快。'
        },
        {
          label: '2(2)',
          points: 4,
          kind: 'fill',
          prompt: '矢量 A 大小为 10，与 +x 轴成 60°，它的 y 分量是多少？（保留一位小数）',
          answer: '8.7',
          explain: 'A<sub>y</sub> = 10 sin 60° = 10 × 0.866 = 8.66 ≈ 8.7。注意角度从 +x 轴量起：cos 给 x 分量、sin 给 y 分量，若角度从 y 轴量起则要对调。'
        }
      ]
    },
    {
      no: 3,
      points: 8,
      type: '运动学',
      intro: '图像题是运动学的送分题，也是易错题：斜率与面积的含义必须一眼认出。',
      parts: [
        {
          label: '3(1)',
          points: 4,
          kind: 'choice',
          prompt: '某物体的 v–t 图是一条从 (0, 4) 到 (4, 0) 的直线（单位：m/s 与 s）。它在 0–4 s 内的位移是多少？',
          options: [
            { text: '8 m', correct: true },
            { text: '16 m' },
            { text: '4 m' },
            { text: '0 m' }
          ],
          explain: '位移等于 v–t 图下的面积：三角形面积 ½ × 4 s × 4 m/s = 8 m。斜率则是加速度 (−1 m/s²)，说明物体在均匀减速，4 s 时恰好停下。'
        },
        {
          label: '3(2)',
          points: 4,
          kind: 'fill',
          prompt: '上题中物体的加速度大小是多少 m/s²？（只填数字）',
          answer: '1',
          explain: 'a = Δv/Δt = (0 − 4)/4 = −1 m/s²，大小为 1 m/s²。负号表示加速度与初速度反向，即减速；问「大小」时只填 1。'
        }
      ]
    },
    {
      no: 4,
      points: 10,
      type: '抛体运动',
      intro: '抛体运动的关键是把水平与竖直两个方向分开处理，再用时间把它们联系起来。',
      parts: [
        {
          label: '4(1)',
          points: 5,
          kind: 'choice',
          prompt: '以 20 m/s 的初速度、30° 仰角抛出一个小球（忽略空气阻力），它到达最高点所需的时间是多少？',
          options: [
            { text: '约 1.0 s', correct: true },
            { text: '约 2.0 s' },
            { text: '约 0.5 s' },
            { text: '约 1.7 s' }
          ],
          explain: '竖直分量 v<sub>0y</sub> = 20 sin 30° = 10 m/s，最高点时 v<sub>y</sub> = 0，t = v<sub>0y</sub>/g = 10/9.8 ≈ 1.0 s。水平分量 17.3 m/s 与此无关，只决定射程。'
        },
        {
          label: '4(2)',
          points: 5,
          kind: 'output',
          prompt: '上题中小球的最大高度是多少米？（写出计算过程，保留两位小数）',
          answer: '5.10',
          explain: 'h = v<sub>0y</sub><sup>2</sup>/(2g) = 100/19.6 ≈ 5.10 m。也可用 h = v<sub>0y</sub>t − ½gt<sup>2</sup> 代入 t = 1.02 s，结果一致。常见错误是直接用 20 m/s 的整体速度代入。'
        }
      ]
    },
    {
      no: 5,
      points: 8,
      type: '牛顿定律',
      intro: '本题考查「合力决定加速度」这一条主线，以及斜面问题的分解方法。',
      parts: [
        {
          label: '5(1)',
          points: 3,
          kind: 'tf',
          prompt: '物体运动方向一定与合外力方向相同。',
          options: [
            { text: '正确' },
            { text: '错误', correct: true }
          ],
          explain: '力决定的是加速度（速度的变化率），不是速度本身。减速时加速度与速度反向；匀速圆周运动时加速度始终指向圆心、与速度垂直。只有「合力为零则速度不变」这一条是必然的。'
        },
        {
          label: '5(2)',
          points: 5,
          kind: 'fill',
          prompt: '质量 4 kg 的物体在光滑水平面上受两个力：6 N 向东、8 N 向北。它的加速度大小是多少 m/s²？',
          answer: '2.5',
          explain: '两力垂直，合力大小 √(36 + 64) = 10 N，a = 10/4 = 2.5 m/s²。方向与合力相同（与东方向成 53°）。这是矢量合成的典型应用，不能把 6 + 8 直接相加。'
        }
      ]
    },
    {
      no: 6,
      points: 8,
      type: '斜面与摩擦',
      intro: '斜面上的动力学题是期中必考题型，核心是「沿斜面方向写牛顿第二定律」。',
      parts: [
        {
          label: '6(1)',
          points: 8,
          kind: 'output',
          prompt: '倾角 30° 的粗糙斜面，物体与斜面间动摩擦因数 μ<sub>k</sub> = 0.20。质量 2 kg 的物体从静止沿斜面下滑，求其加速度（保留两位小数），并说明 3 s 末的速度。',
          answer: 'a ≈ 3.20 m/s²，v ≈ 9.6 m/s',
          explain: '沿斜面：mg sin 30° − μ<sub>k</sub>mg cos 30° = ma，约去 m 得 a = g(sin 30° − 0.20 cos 30°) = 9.8(0.500 − 0.173) ≈ 3.20 m/s²。3 s 末 v = at ≈ 9.6 m/s。注意正压力 N = mg cos θ，不是 mg。'
        }
      ]
    },
    {
      no: 7,
      points: 8,
      type: '功与能',
      intro: '功与能的关系是「过程量」与「状态量」的桥梁，动能定理是最常用的工具。',
      parts: [
        {
          label: '7(1)',
          points: 4,
          kind: 'choice',
          prompt: '物体沿粗糙水平面滑行一段距离后停下，下列说法正确的是：',
          options: [
            { text: '摩擦力做负功，物体的动能减少', correct: true },
            { text: '摩擦力做正功，物体的动能增加' },
            { text: '重力做负功，物体的动能减少' },
            { text: '支持力做正功，抵消摩擦力的功' }
          ],
          explain: '摩擦力与位移反向，做负功，由动能定理 ΔK = W<sub>f</sub> &lt; 0，动能减少直至为零。重力与支持力都垂直于位移，不做功。摩擦生热的部分就是减少的动能。'
        },
        {
          label: '7(2)',
          points: 4,
          kind: 'fill',
          prompt: '质量 0.50 kg 的物体以 4.0 m/s 运动，它的动能是多少焦耳？',
          answer: '4.0',
          explain: 'K = ½mv<sup>2</sup> = ½ × 0.50 × 16 = 4.0 J。注意动能与速度的平方成正比：速度加倍，动能变四倍，这也是刹车距离随速度平方增长的原因。'
        }
      ]
    },
    {
      no: 8,
      points: 8,
      type: '能量守恒',
      intro: '本题要求你判断守恒条件是否满足，并说明能量到底去了哪里。',
      parts: [
        {
          label: '8(1)',
          points: 4,
          kind: 'keywords',
          prompt: '用一句话说明「机械能守恒」的适用条件，并各举一个守恒与不守恒的例子。',
          keywords: ['只有保守力做功', '重力', '弹簧', '摩擦', '不守恒', '生热'],
          explain: '条件是「只有保守力（重力、弹力、静电力）做功，没有摩擦等非保守力做功」。自由落体、光滑斜面、弹簧振子守恒；有滑动摩擦的斜面不守恒，减少的机械能转化为内能。'
        },
        {
          label: '8(2)',
          points: 4,
          kind: 'fill',
          prompt: '质量 1 kg 的物体从 20 m 高处自由下落（g = 9.8 m/s²），落地前瞬间的速度约为多少 m/s？',
          answer: '19.8',
          explain: 'mgh = ½mv<sup>2</sup> 得 v = √(2gh) = √(2 × 9.8 × 20) = √392 ≈ 19.8 m/s。质量在等式两边约掉，所以速度与质量无关——这是伽利略的著名结论。'
        }
      ]
    },
    {
      no: 9,
      points: 8,
      type: '动量',
      intro: '动量守恒与能量守恒常常同时出现，关键是要判断哪个量在什么条件下守恒。',
      parts: [
        {
          label: '9(1)',
          points: 4,
          kind: 'choice',
          prompt: '质量 2 kg 的小球以 3 m/s 撞上静止的 1 kg 小球，碰后粘在一起。碰后共同速度是多少？',
          options: [
            { text: '2 m/s', correct: true },
            { text: '1.5 m/s' },
            { text: '3 m/s' },
            { text: '0 m/s' }
          ],
          explain: '动量守恒：2 × 3 = (2 + 1)v，v = 2 m/s。碰前动能 9 J，碰后动能 ½ × 3 × 4 = 6 J，损失 3 J。完全非弹性碰撞动量守恒但动能不守恒，这是最常见的考点。'
        },
        {
          label: '9(2)',
          points: 4,
          kind: 'fill',
          prompt: '上题中碰撞损失的动能是多少焦耳？',
          answer: '3',
          explain: '初动能 ½ × 2 × 9 = 9 J，末动能 ½ × 3 × 2<sup>2</sup> = 6 J，损失 3 J。也可用 ΔK = ½μv<sub>rel</sub><sup>2</sup>（μ 为约化质量 2/3 kg）验证：½ × 2/3 × 9 = 3 J。'
        }
      ]
    },
    {
      no: 10,
      points: 8,
      type: '转动',
      intro: '转动惯量、力矩与角加速度的关系，与平动的 F = ma 完全对应。',
      parts: [
        {
          label: '10(1)',
          points: 4,
          kind: 'choice',
          prompt: '半径 0.20 m、质量 5 kg 的均匀圆盘绕中心轴转动。若在边缘施加 10 N 的切向力，角加速度是多少？',
          options: [
            { text: '20 rad/s²', correct: true },
            { text: '10 rad/s²' },
            { text: '40 rad/s²' },
            { text: '2 rad/s²' }
          ],
          explain: 'τ = rF = 0.20 × 10 = 2.0 N·m；I = ½MR<sup>2</sup> = ½ × 5 × 0.04 = 0.10 kg·m²；α = τ/I = 20 rad/s²。注意圆盘用 ½MR<sup>2</sup>，若误用 MR<sup>2</sup> 会得到一半的答案。'
        },
        {
          label: '10(2)',
          points: 4,
          kind: 'fill',
          prompt: '上题中的圆盘从静止开始，2 s 后的角速度是多少 rad/s？',
          answer: '40',
          explain: 'ω = αt = 20 × 2 = 40 rad/s。若问边缘线速度，再乘半径得 8 m/s。转动运动学公式与平动一一对应：ω = ω<sub>0</sub> + αt、θ = ω<sub>0</sub>t + ½αt<sup>2</sup>。'
        }
      ]
    },
    {
      no: 11,
      points: 8,
      type: '角动量',
      intro: '角动量守恒是本章最容易被误用的定律，本题要求你同时说明守恒的理由与能量的去向。',
      parts: [
        {
          label: '11(1)',
          points: 8,
          kind: 'output',
          prompt: '一名滑冰运动员张开手臂时转动惯量为 2.0 kg·m²、角速度为 3.0 rad/s。收臂后转动惯量变为 0.50 kg·m²。求收臂后的角速度，并说明转动动能如何变化、能量从哪里来。',
          answer: 'ω = 12 rad/s，动能从 9 J 增至 36 J，来自肌肉收臂做的功',
          explain: '角动量守恒：I<sub>1</sub>ω<sub>1</sub> = I<sub>2</sub>ω<sub>2</sub>，2.0 × 3.0 = 0.50 × ω<sub>2</sub>，得 ω<sub>2</sub> = 12 rad/s。动能 K = ½Iω<sup>2</sup> 从 9 J 变为 36 J，增加了 27 J。这部分能量不是「凭空产生」，而是运动员克服手臂的离心趋势向内收时肌肉做的功——所以角动量守恒并不意味着机械能守恒。'
        }
      ]
    },
    {
      no: 12,
      points: 8,
      type: '综合',
      intro: '最后一题把平动与转动接起来，考查你对「纯滚动」条件的理解。',
      parts: [
        {
          label: '12(1)',
          points: 4,
          kind: 'keywords',
          prompt: '写出纯滚动的两个运动学条件，并说明接触点的速度为什么是零。',
          keywords: ['v = ωR', 'a = αR', '接触点瞬时静止', '静摩擦', '不打滑'],
          explain: '纯滚动的条件是 v<sub>cm</sub> = ωR 与 a<sub>cm</sub> = αR。接触点同时参与「随质心平动」与「绕质心转动」，两者速度大小相等、方向相反，恰好抵消为零，所以接触点相对地面瞬时静止，摩擦力是静摩擦且不做功。'
        },
        {
          label: '12(2)',
          points: 4,
          kind: 'fill',
          prompt: '实心球（I = ⅖MR<sup>2</sup>）沿倾角 30° 的斜面纯滚动下滑，加速度约为多少 m/s²？（保留一位小数）',
          answer: '3.5',
          explain: 'a = g sin θ/(1 + I/(MR<sup>2</sup>)) = 9.8 × 0.5/(1 + 0.4) = 4.9/1.4 = 3.5 m/s²。若换成圆环（I = MR<sup>2</sup>），a = 4.9/2 = 2.45 m/s²，球更快——这就是「滚动比赛」中球总赢的原因。'
        }
      ]
    }
  ]
});
