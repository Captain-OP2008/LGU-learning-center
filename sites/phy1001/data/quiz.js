/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；每章 q1–q7 与 chXX.js 内嵌题一致
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: 'PHY1001 的主教材是哪一本？',
        options: [
          { text: 'Young &amp; Freedman《University Physics》第 13 版', correct: true },
          { text: 'Halliday / Resnick / Walker《Fundamentals of Physics》第 10 版' },
          { text: 'Feynman《The Feynman Lectures on Physics》' },
          { text: 'Kittel《Berkeley Physics Course, Vol. 1》' }
        ],
        explain: '课程大纲指定 Young &amp; Freedman 为主教材，Halliday 第 10 版与 Kittel 的伯克利教程为参考书，考试范围以课堂讲授与作业为准。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '按课程大纲，期末考试的权重是多少？',
        options: [
          { text: '40%', correct: true },
          { text: '30%' },
          { text: '20%' },
          { text: '10%' }
        ],
        explain: '大纲的比例是课堂 quiz 10%、作业 20%、期中 30%、期末 40%，期末占比最重，复习时应优先覆盖后半学期的 11–17 章。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '作业共 13 次，合计 130–140 题，占总评 20%。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '大纲给出 13 次作业、总题量 130–140，占 20%。作业题与考试题风格接近，是性价比最高的练习材料。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '课程前七周（期中之前）主要覆盖教材哪些章节？',
        options: [
          { text: '第 1–10 章：测量、矢量、运动学、牛顿定律、功与能、动量与转动', correct: true },
          { text: '第 11–17 章：角动量、平衡、引力、流体、振动与波' },
          { text: '只覆盖第 1–4 章的运动学部分' },
          { text: '整本教材一次讲完，不分期中期末' }
        ],
        explain: '大纲把学期分成两半：前七周覆盖第 1–10 章并进行期中考试，后七周覆盖第 11–17 章并以期末收尾。本站的 ch01–ch06 对应前半，ch07 对应后半。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['estimation'],
        stem: '用数量级估算：1 m<sup>3</sup> 水的质量约为多少？',
        options: [
          { text: '10<sup>3</sup> kg', correct: true },
          { text: '10<sup>1</sup> kg' },
          { text: '10<sup>6</sup> kg' },
          { text: '10<sup>−3</sup> kg' }
        ],
        explain: '水的密度约 10<sup>3</sup> kg/m<sup>3</sup>，所以 1 m<sup>3</sup> 的水约 1 吨。量级估算不需要精确值，但要能判断答案是否离谱，这是物理题的第一道检查。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'multi', difficulty: 2, tags: ['method'],
        stem: '物理建模的一般步骤包括下列哪些？（多选）',
        options: [
          { text: '画示意图、标出已知量与未知量', correct: true },
          { text: '选取坐标系与正方向', correct: true },
          { text: '写出方程并求解，最后做量纲和数量级检查', correct: true },
          { text: '先背下所有公式，再套用现成答案' }
        ],
        explain: '建模是「图—坐标系—方程—检查」的闭环。直接套公式往往在条件不满足时失效，而量纲与数量级检查能快速发现符号或单位错误。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '为什么力学第一章要先补矢量和微积分？',
        options: [
          { text: '力、速度、加速度都是矢量，且速度是位置的导数、加速度是速度的导数', correct: true },
          { text: '因为考试会单独考数学，与物理无关' },
          { text: '因为矢量比标量更容易计算' },
          { text: '因为教材第一章就是数学' }
        ],
        explain: '力学的核心量（位移、速度、加速度、力、动量）都是矢量，而瞬时速度与加速度的定义本身就是导数。没有矢量与微积分，只能做匀速直线运动的特例。'
      },

      /* ---------------- ch01 测量、单位与矢量 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['dimension'],
        stem: '用基本量纲 M、L、T 表示，力的量纲是什么？',
        options: [
          { text: 'MLT<sup>−2</sup>', correct: true },
          { text: 'MLT<sup>−1</sup>' },
          { text: 'ML<sup>2</sup>T<sup>−2</sup>' },
          { text: 'ML<sup>−1</sup>T<sup>−2</sup>' }
        ],
        explain: '由 F = ma，量纲为 M × LT<sup>−2</sup> = MLT<sup>−2</sup>。ML<sup>2</sup>T<sup>−2</sup> 是能量的量纲，两者容易混淆，区别在于长度的一次方还是二次方。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['vector'],
        stem: '两个非零矢量的点积为零，说明它们：',
        options: [
          { text: '互相垂直', correct: true },
          { text: '方向相同' },
          { text: '方向相反' },
          { text: '大小相等' }
        ],
        explain: 'A·B = AB cos θ，非零矢量点积为零只能来自 cos θ = 0，即 θ = 90°。这正是「做功为零」的几何条件：力与位移垂直。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'tf', difficulty: 1, tags: ['vector'],
        stem: '叉积满足交换律，即 A×B = B×A。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '叉积反交换：A×B = −B×A，方向由右手定则决定。点积才满足交换律。这一区别在力矩、角动量的方向判断中非常关键。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['vector'],
        stem: '矢量 A 大小为 10，与 +x 轴夹角 30°，其 x 分量是多少？',
        options: [
          { text: '8.66', correct: true },
          { text: '5.00' },
          { text: '10.0' },
          { text: '0.50' }
        ],
        explain: 'A<sub>x</sub> = A cos 30° = 10 × 0.866 = 8.66，A<sub>y</sub> = A sin 30° = 5.00。注意夹角必须从 +x 轴逆时针量起，否则正弦余弦会搞反。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'fill', difficulty: 1, tags: ['unit'],
        stem: '把 36 km/h 换算成 m/s，结果是多少？（只填数字）',
        answer: '10',
        accept: ['10', '10.0', '10 m/s'],
        explain: '1 km/h = 1000 m / 3600 s = 1/3.6 m/s，所以 36 km/h = 36/3.6 = 10 m/s。记住「除以 3.6」这个换算，比每次重推更快。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 1, type: 'multi', difficulty: 1, tags: ['unit'],
        stem: '下列哪些是 SI 基本单位？（多选）',
        options: [
          { text: '千克 kg', correct: true },
          { text: '秒 s', correct: true },
          { text: '牛顿 N' },
          { text: '摩尔 mol', correct: true }
        ],
        explain: 'SI 七个基本单位是 m、kg、s、A、K、mol、cd。牛顿是导出单位（kg·m/s<sup>2</sup>），焦耳、瓦特同理。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['sigfig'],
        stem: '测量值 0.00250 m 有几位有效数字？',
        options: [
          { text: '3 位', correct: true },
          { text: '2 位' },
          { text: '5 位' },
          { text: '6 位' }
        ],
        explain: '前导零不算有效数字，末尾的 0 若在小数点后则算。因此 2、5、0 三位有效。有效数字反映测量精度，写 0.0025 会丢掉一位精度信息。'
      },

      /* ---------------- ch02 直线运动 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '一个人绕操场跑完一圈回到起点，下列说法正确的是：',
        options: [
          { text: '位移为零，路程等于一圈的长度', correct: true },
          { text: '位移等于一圈的长度，路程为零' },
          { text: '位移与路程都为零' },
          { text: '位移与路程都等于一圈的长度' }
        ],
        explain: '位移是「起点指向终点」的矢量，回到起点即为零；路程是轨迹总长度，等于一圈。平均速度 = 位移/时间 = 0，但平均速率不为零。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['graph'],
        stem: 'v–t 图像中，曲线与时间轴围成的面积表示什么？',
        options: [
          { text: '位移', correct: true },
          { text: '加速度' },
          { text: '平均速度' },
          { text: '路程的平方' }
        ],
        explain: 'v dt 的积分就是位移，所以面积代表位移；时间轴下方的面积取负。加速度则对应 v–t 图的斜率，这是图像题的两条基本规则。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '加速度为负，物体一定在做减速运动。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '加速还是减速取决于 a 与 v 的方向关系，而不是 a 的正负。若 v 也为负，a 为负反而是加速（速度变得更负）。只有 a 与 v 反向才是减速。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['equation'],
        stem: '运动学方程 v = v<sub>0</sub> + at 中不包含下列哪个量？',
        options: [
          { text: '位移 x', correct: true },
          { text: '初速度 v<sub>0</sub>' },
          { text: '加速度 a' },
          { text: '时间 t' }
        ],
        explain: '四个常用方程各缺一个量：缺 x 的是 v = v<sub>0</sub> + at，缺 v 的是 x = v<sub>0</sub>t + ½at<sup>2</sup>，缺 t 的是 v<sup>2</sup> = v<sub>0</sub><sup>2</sup> + 2ax，缺 a 的是 x = ½(v<sub>0</sub> + v)t。选方程就是选「哪个量不需要」。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'fill', difficulty: 1, tags: ['calc'],
        stem: '物体从静止自由下落 2.0 s（g 取 9.8 m/s<sup>2</sup>，忽略空气阻力），下落高度是多少米？',
        answer: '19.6',
        accept: ['19.6', '19.6 m', '20'],
        explain: 'h = ½gt<sup>2</sup> = ½ × 9.8 × 4 = 19.6 m。自由落体的初速度为零，所以位移公式简化为 ½gt<sup>2</sup>。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'multi', difficulty: 2, tags: ['graph'],
        stem: '关于匀加速直线运动，下列说法正确的有：（多选）',
        options: [
          { text: 'a 恒定，v 随时间线性变化', correct: true },
          { text: 'x–t 图是抛物线', correct: true },
          { text: '平均速度等于初末速度的算术平均', correct: true },
          { text: '加速度随时间均匀增大' }
        ],
        explain: '匀加速意味着 a 为常数，v 线性变化，x 二次变化（抛物线）；且平均速度 = (v<sub>0</sub> + v)/2 只对匀加速成立。加速度「均匀增大」是变加速，不属于本节。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '汽车以 20 m/s 行驶，刹车后以 5 m/s<sup>2</sup> 的加速度减速，刹车距离是多少？',
        options: [
          { text: '40 m', correct: true },
          { text: '20 m' },
          { text: '80 m' },
          { text: '100 m' }
        ],
        explain: '用缺 t 的方程：0 = 20<sup>2</sup> − 2 × 5 × x，得 x = 400/10 = 40 m。也可先算刹车时间 4 s，再用平均速度 10 m/s × 4 s = 40 m。'
      },

      /* ---------------- ch03 二维运动 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['projectile'],
        stem: '抛体运动到达最高点时，速度的特点是：',
        options: [
          { text: '只有水平分量，竖直分量为零', correct: true },
          { text: '速度为零' },
          { text: '只有竖直分量' },
          { text: '水平与竖直分量都最大' }
        ],
        explain: '最高点是竖直速度改变符号的位置，v<sub>y</sub> = 0，但水平分量 v<sub>x</sub> 全程不变（忽略空气阻力），所以速度不为零。加速度始终是 g，方向向下。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['circular'],
        stem: '匀速圆周运动中，加速度的方向是：',
        options: [
          { text: '始终指向圆心', correct: true },
          { text: '始终沿速度方向' },
          { text: '始终背离圆心' },
          { text: '大小为零' }
        ],
        explain: '速率不变但方向不断改变，加速度只改变方向、不改变大小，因此垂直于速度、指向圆心，称为向心加速度 a = v<sup>2</sup>/r。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'tf', difficulty: 1, tags: ['projectile'],
        stem: '忽略空气阻力时，抛体运动的水平速度分量保持不变。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '水平方向没有力，加速度为零，所以 v<sub>x</sub> 恒定；竖直方向受重力，v<sub>y</sub> 均匀变化。两个方向独立，这是分解法的核心。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'fill', difficulty: 2, tags: ['projectile'],
        stem: '在水平面上以相同初速度抛射，要使射程最大，抛射角应为多少度？（只填数字）',
        answer: '45',
        accept: ['45', '45°', '45度'],
        explain: '射程 R = v<sub>0</sub><sup>2</sup>sin 2θ/g，sin 2θ 在 2θ = 90° 即 θ = 45° 时取最大值。互补角（如 30° 与 60°）射程相同，这是常考的对称性。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['relative'],
        stem: 'A 相对 B 的速度应写成：',
        options: [
          { text: 'v<sub>A</sub> − v<sub>B</sub>', correct: true },
          { text: 'v<sub>A</sub> + v<sub>B</sub>' },
          { text: 'v<sub>B</sub> − v<sub>A</sub>' },
          { text: 'v<sub>A</sub> × v<sub>B</sub>' }
        ],
        explain: '相对速度是「观察者自己静止」时的速度，需减去观察者的速度：v<sub>AB</sub> = v<sub>A</sub> − v<sub>B</sub>。注意 v<sub>BA</sub> = −v<sub>AB</sub>，不要把下标顺序弄反。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'multi', difficulty: 2, tags: ['circular'],
        stem: '匀速圆周运动中，下列哪些量在变化？（多选）',
        options: [
          { text: '速度的方向', correct: true },
          { text: '加速度的方向', correct: true },
          { text: '速率', correct: false },
          { text: '向心加速度的大小', correct: false }
        ],
        explain: '匀速圆周运动的「匀速」指速率不变，所以速率与 a = v<sup>2</sup>/r 的大小都不变；但速度与加速度的方向随位置不断旋转。矢量「变化」不等于「大小变化」。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['circular'],
        stem: '半径 0.50 m 的轮子以 4.0 rad/s 的角速度转动，边缘点的线速度是多少？',
        options: [
          { text: '2.0 m/s', correct: true },
          { text: '8.0 m/s' },
          { text: '0.13 m/s' },
          { text: '4.0 m/s' }
        ],
        explain: 'v = ωr = 4.0 × 0.50 = 2.0 m/s。角速度对所有半径相同，线速度与半径成正比：轮缘快、轮心慢，这正是「刚体」的含义。'
      },

      /* ---------------- ch04 牛顿定律 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '下列哪个参考系可以当作惯性系处理？',
        options: [
          { text: '相对地面静止或匀速直线运动的参考系', correct: true },
          { text: '正在加速起飞的飞机' },
          { text: '正在转弯的汽车' },
          { text: '正在转动的旋转木马' }
        ],
        explain: '惯性系是牛顿定律成立的参考系，即无加速度的参考系。加速、转弯、转动都产生非惯性效应（如被「甩」向一侧），需要引入惯性力才能套用 F = ma。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['friction'],
        stem: '最大静摩擦力的大小等于：',
        options: [
          { text: 'μ<sub>s</sub>N', correct: true },
          { text: 'μ<sub>k</sub>N' },
          { text: 'mg' },
          { text: 'μ<sub>s</sub>mg，与支持力无关' }
        ],
        explain: '最大静摩擦 f<sub>max</sub> = μ<sub>s</sub>N，N 是法向支持力，不一定等于 mg（斜面、加速电梯时都不同）。实际静摩擦在 0 到 f<sub>max</sub> 之间，由平衡条件决定。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '作用力与反作用力作用在同一个物体上，所以可以相互抵消。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '牛顿第三定律的一对力分别作用在两个不同物体上，永远不能相互抵消。能抵消的是「同一物体受到的」一对平衡力，两者不能混为一谈。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'fill', difficulty: 1, tags: ['calc'],
        stem: '质量 5 kg 的物体在水平面上受 20 N 的水平拉力，摩擦力为 5 N，其加速度是多少 m/s<sup>2</sup>？',
        answer: '3',
        accept: ['3', '3.0', '3 m/s2'],
        explain: '合力 = 20 − 5 = 15 N，a = F/m = 15/5 = 3 m/s<sup>2</sup>。先求合力再除以质量，这是所有动力学题的第一步。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['incline'],
        stem: '倾角 θ 的光滑斜面上，质量为 m 的物体沿斜面下滑的加速度是：',
        options: [
          { text: 'g sin θ', correct: true },
          { text: 'g cos θ' },
          { text: 'g tan θ' },
          { text: 'g' }
        ],
        explain: '重力沿斜面分量为 mg sin θ，支持力与重力垂直分量平衡，所以 a = g sin θ。θ = 0 时 a = 0，θ = 90° 时 a = g，两个极限可以检验公式。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'multi', difficulty: 2, tags: ['fbd'],
        stem: '画自由体图（FBD）时，应该画出下列哪些力？（多选）',
        options: [
          { text: '重力', correct: true },
          { text: '接触面给的支持力', correct: true },
          { text: '绳子给的张力', correct: true },
          { text: '物体「运动的力」或「惯性力」（惯性系中）' }
        ],
        explain: '自由体图只画「其他物体对该物体的真实作用力」：重力、支持力、摩擦力、张力等。「运动的力」「惯性力」不是真实相互作用，惯性系中不能画。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['apparent'],
        stem: '电梯以加速度 a 向上加速时，站在电梯里的人对地板的压力：',
        options: [
          { text: '大于自身的重力 mg', correct: true },
          { text: '等于 mg' },
          { text: '小于 mg' },
          { text: '等于零' }
        ],
        explain: '由 N − mg = ma 得 N = m(g + a) &gt; mg，称为「超重」。若电梯向下加速，N = m(g − a) &lt; mg，称为「失重」；自由落体时 N = 0。'
      },

      /* ---------------- ch05 功与能量 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['work'],
        stem: '物体沿水平面运动，重力对它做的功是：',
        options: [
          { text: '零，因为重力与位移垂直', correct: true },
          { text: 'mgh' },
          { text: '−mgh' },
          { text: '取决于运动时间' }
        ],
        explain: 'W = Fd cos θ，重力竖直向下、位移水平，θ = 90°，cos 90° = 0，所以不做功。这也是「水平移动物体时重力势能不变」的原因。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['theorem'],
        stem: '动能定理的内容是：',
        options: [
          { text: '合外力做的功等于动能的变化量', correct: true },
          { text: '重力做的功等于动能的变化量' },
          { text: '任意一个力做的功都等于动能变化' },
          { text: '动能永远守恒' }
        ],
        explain: 'W<sub>net</sub> = ΔK，只有「合力」的功才等于动能变化。单个力的功只改变对应的能量项（如重力做功对应重力势能），不能单独等于 ΔK。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'tf', difficulty: 2, tags: ['conservative'],
        stem: '滑动摩擦力做功与路径有关，因此它是非保守力。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '保守力的判据是「做功只与始末位置有关、沿闭合路径做功为零」。滑动摩擦力总是做负功且与路径长度成正比，所以是非保守力，机械能不守恒。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'fill', difficulty: 1, tags: ['calc'],
        stem: '质量 2 kg 的物体从 5 m 高处自由落下（g 取 9.8 m/s<sup>2</sup>），落地时的动能是多少焦耳？',
        answer: '98',
        accept: ['98', '98 J', '98.0'],
        explain: '机械能守恒：mgh = ½mv<sup>2</sup> = K，K = 2 × 9.8 × 5 = 98 J。也可先算 v = √(2gh) ≈ 9.9 m/s，再算 ½mv<sup>2</sup>，结果一致。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['spring'],
        stem: '弹簧被压缩 x 时储存的弹性势能是：',
        options: [
          { text: '½kx<sup>2</sup>', correct: true },
          { text: 'kx' },
          { text: 'kx<sup>2</sup>' },
          { text: '½kx' }
        ],
        explain: '弹力 F = −kx 随位移线性增大，做功是三角形面积 ½ × 底 × 高 = ½kx<sup>2</sup>。势能是二次函数，这是简谐运动周期与振幅无关的根源。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'multi', difficulty: 2, tags: ['conservation'],
        stem: '下列哪些情形下机械能守恒？（多选）',
        options: [
          { text: '只有重力做功的自由落体', correct: true },
          { text: '光滑斜面上的下滑（无摩擦）', correct: true },
          { text: '有滑动摩擦的斜面下滑' },
          { text: '弹簧振子的无阻尼振动', correct: true }
        ],
        explain: '机械能守恒的条件是「只有保守力做功」。摩擦生热会消耗机械能，有摩擦就不守恒；而弹簧弹力、重力都是保守力，对应的振动与下滑机械能守恒。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['power'],
        stem: '汽车以恒定速度 v 行驶，牵引力为 F，发动机的输出功率是：',
        options: [
          { text: 'Fv', correct: true },
          { text: 'F/v' },
          { text: 'Fv<sup>2</sup>' },
          { text: '½Fv<sup>2</sup>' }
        ],
        explain: 'P = W/t = Fd/t = Fv。功率恒定时，速度越大牵引力越小，这就是汽车「低速挡扭矩大、高速挡扭矩小」的原因。'
      },

      /* ---------------- ch06 动量与转动 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['momentum'],
        stem: '质量 2 kg 的物体以 3 m/s 向东运动，其动量大小是：',
        options: [
          { text: '6 kg·m/s', correct: true },
          { text: '1.5 kg·m/s' },
          { text: '18 kg·m/s' },
          { text: '3 kg·m/s' }
        ],
        explain: 'p = mv = 2 × 3 = 6 kg·m/s，方向向东（动量是矢量，答方向不能丢）。注意与动能 ½mv<sup>2</sup> = 9 J 区分：动量与速度成正比，动能与速度平方成正比。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['collision'],
        stem: '完全非弹性碰撞的特点是：',
        options: [
          { text: '动量守恒，动能损失最大，碰后共同速度', correct: true },
          { text: '动量与动能都守恒' },
          { text: '动量不守恒，动能守恒' },
          { text: '碰后各自以原速率弹回' }
        ],
        explain: '完全非弹性碰撞碰后粘在一起，共同速度 v = Σmv/Σm。动量始终守恒，但相对速度归零，动能损失达到同类碰撞中的最大值。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'tf', difficulty: 1, tags: ['rotation'],
        stem: '同一个刚体，绕不同转轴的转动惯量一定相同。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '转动惯量 I = Σmr<sup>2</sup> 依赖转轴位置。平行轴定理 I = I<sub>cm</sub> + Md<sup>2</sup> 说明轴离质心越远，I 越大。细杆绕中心是 ML<sup>2</sup>/12，绕端点是 ML<sup>2</sup>/3。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'fill', difficulty: 1, tags: ['collision'],
        stem: '1 kg 的物体以 4 m/s 撞上静止的 3 kg 物体并粘在一起，碰后共同速度是多少 m/s？',
        answer: '1',
        accept: ['1', '1.0', '1 m/s'],
        explain: '动量守恒：1 × 4 = (1 + 3)v，得 v = 1 m/s。初动能 8 J，末动能 ½ × 4 × 1 = 2 J，损失 6 J，损失比例正好等于 m<sub>2</sub>/(m<sub>1</sub>+m<sub>2</sub>) = 75%。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['inertia'],
        stem: '质量为 M、半径为 R 的均匀圆盘绕中心轴的转动惯量是：',
        options: [
          { text: '½MR<sup>2</sup>', correct: true },
          { text: 'MR<sup>2</sup>' },
          { text: '⅖MR<sup>2</sup>' },
          { text: '<sup>1</sup>⁄<sub>12</sub>MR<sup>2</sup>' }
        ],
        explain: '圆盘 ½MR<sup>2</sup>、圆环 MR<sup>2</sup>、实心球 ⅖MR<sup>2</sup>、细杆（中心）<sup>1</sup>⁄<sub>12</sub>ML<sup>2</sup>。质量越靠外，系数越大：环 &gt; 盘 &gt; 球。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'multi', difficulty: 2, tags: ['angular'],
        stem: '下列哪些情形下系统的角动量守恒？（多选）',
        options: [
          { text: '花样滑冰运动员收臂（忽略冰面摩擦）', correct: true },
          { text: '行星绕太阳运动（引力为有心力）', correct: true },
          { text: '转盘受到轴承的摩擦力矩作用时', correct: false },
          { text: '汽车以恒定功率加速，对轮轴取轴（发动机提供外力矩）', correct: false }
        ],
        explain: '角动量守恒的条件是合外力矩为零。收臂时手臂的内力不产生外力矩，引力沿连线、力矩为零，所以这两种情形 L 守恒。而轴承摩擦力矩、发动机扭矩都是外力矩，会改变角动量。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['rolling'],
        stem: '实心球、圆盘、圆环从同一斜面同一高度由静止纯滚动下滑，谁先到达底部？',
        options: [
          { text: '实心球，因为它的 I/(mR<sup>2</sup>) 最小', correct: true },
          { text: '圆环，因为它的转动惯量最大' },
          { text: '圆盘，因为它的形状居中' },
          { text: '三者同时到达' }
        ],
        explain: 'a = g sin θ/(1 + β)，β = I/(mR<sup>2</sup>)：球 0.4、盘 0.5、环 1.0。β 越小加速度越大，所以实心球最快。这与质量、半径无关，只与质量分布有关。'
      },

      /* ---------------- ch07 平衡、引力与振动波 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['equilibrium'],
        stem: '刚体处于静力平衡的条件是：',
        options: [
          { text: 'ΣF = 0 且 Στ = 0', correct: true },
          { text: '只要 ΣF = 0' },
          { text: '只要 Στ = 0' },
          { text: '速度为零即可，与力无关' }
        ],
        explain: '平动平衡要求合力为零，转动平衡要求合力矩为零，两条缺一不可。一对大小相等、方向相反但不共线的力（力偶）合力为零却会使物体转动，正是需要第二条的原因。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['shm'],
        stem: '单摆的周期 T = 2π√(L/g)，这说明周期：',
        options: [
          { text: '与摆球质量无关，只与摆长和重力加速度有关', correct: true },
          { text: '与摆球质量成正比' },
          { text: '与振幅成正比' },
          { text: '与摆长无关' }
        ],
        explain: '小角度下单摆的等效劲度系数 k = mg/L，质量在 T = 2π√(m/k) 中恰好约掉，所以周期与质量、振幅（小角度下）都无关，只由 L 与 g 决定。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'tf', difficulty: 2, tags: ['gravity'],
        stem: '逃逸速度与抛射方向有关，竖直向上抛最容易逃逸。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '逃逸速度 v<sub>esc</sub> = √(2GM/R) 只由天体质量与半径决定，与方向无关（忽略空气与地形）。因为逃逸的判据是总机械能 E ≥ 0，而 E 只依赖速率。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'fill', difficulty: 1, tags: ['pendulum'],
        stem: '摆长 1.0 m 的单摆，周期约为多少秒？（g 取 9.8 m/s<sup>2</sup>，保留一位小数）',
        answer: '2.0',
        accept: ['2.0', '2', '2 s', '2.01'],
        explain: 'T = 2π√(1.0/9.8) ≈ 2π × 0.319 ≈ 2.0 s。这就是「秒摆」（半周期 1 s）摆长约 1 m 的由来，也是早期摆钟校准的依据。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['fluid'],
        stem: '阿基米德原理指出，浸在流体中的物体所受浮力等于：',
        options: [
          { text: '物体排开流体的重量', correct: true },
          { text: '物体自身的重量' },
          { text: '物体的体积' },
          { text: '流体的总重量' }
        ],
        explain: 'F<sub>b</sub> = ρ<sub>f</sub>V<sub>排</sub>g，只与排开流体的体积和流体密度有关，与物体自身密度无关。漂浮时 F<sub>b</sub> = mg，由此可求吃水体积比。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'multi', difficulty: 2, tags: ['shm'],
        stem: '简谐运动的物体经过平衡位置时，下列哪些说法正确？（多选）',
        options: [
          { text: '速度大小达到最大值', correct: true },
          { text: '加速度为零', correct: true },
          { text: '动能最大', correct: true },
          { text: '回复力最大' }
        ],
        explain: '平衡位置 x = 0，回复力 F = −kx = 0、加速度 a = −ω<sup>2</sup>x = 0，而速度 |v| = Aω 最大、动能最大、势能为零。最大位移处正好相反。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['wave'],
        stem: '救护车鸣笛向你驶来时，你听到的音调：',
        options: [
          { text: '比静止时高，因为声波被「压缩」、波长变短', correct: true },
          { text: '比静止时低，因为声源在运动' },
          { text: '与静止时完全相同' },
          { text: '先高后低，与距离无关' }
        ],
        explain: '多普勒效应：f′ = f·v/(v − v<sub>s</sub>) &gt; f，接近时频率升高、音调变高；远离时 f′ = f·v/(v + v<sub>s</sub>) &lt; f，音调变低。这正是救护车「呜—哇」的由来。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
