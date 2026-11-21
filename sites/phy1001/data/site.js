/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'phy1001',
  short: 'PHY1001',
  name: '大学物理 I',
  en: 'Physics I',
  dept: '物理与化学',
  lang: 'text',
  langLabel: '物理',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'PHY1001 // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... PHY1001',
    '> loading 8 modules ...',
    '> calibrating glossary & quiz bank ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '从测量到波，把力学读成一条能走通的线。',
  missionEn: 'PHY1001 · 8 MODULES · 28 LECTURES',
  missionTitle: '从零开始<br><em>大学物理 I</em>',
  lede: '力学不是一堆公式，而是一套「先画图、再分解、后写方程」的流程：从测量与矢量出发，经运动学、牛顿定律、功与能、动量与转动，最后收束于平衡、引力与振动波。每章配术语表、对照表、自检清单与题库。',
  searchPlaceholder: 'QUERY // 搜索章节、公式、术语与题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录下的 PHY1001 文件夹，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/PHY1001/',
  resources: {
    note: '以下文件均为 CUHKSZ PHY1001 的真实课程资料，按「大纲与教材—课堂讲义—作业与解答—考试真题」四组排列；建议先读课程大纲确认范围，再按讲次跟讲义，最后用真题检验。',
    groups: [
      {
        name: '大纲与教材',
        note: '先看课程大纲：28 讲、13 次作业、期中期末范围都在里面；两本教材可作查阅工具书。',
        items: [
          { title: 'PHY1001 课程大纲（含考核比例与讲次安排）', path: '其他资料/PHY1001_Course_Overview_General_24.pdf', kind: 'pdf', note: '每周讲次、章节范围、成绩构成，开学第一份该读的文件。' },
          { title: 'Young & Freedman《University Physics》第 13 版', path: '其他资料/PHY1001_Sears_13th_Edition.pdf', kind: 'pdf', note: '课程主教材，例题与习题风格最接近考试。' },
          { title: 'Halliday / Resnick / Walker《Fundamentals of Physics》第 10 版', path: '其他资料/PHY1001_Halliday_10th_Edition.pdf', kind: 'pdf', note: '参考教材，讲解更口语化，适合卡住时换一本书看。' }
        ]
      },
      {
        name: '课堂讲义',
        note: 'Lecture 按讲次编号（01–28），Week 文件是每周的合并版讲义，复习时用合并版更快。',
        items: [
          { title: 'Lecture 01：测量、单位与有效数字', path: '学习资料/PHY1001_Lecture_01.pdf', kind: 'pdf', note: '对应本站 ch01 前半，量纲与单位换算的起点。' },
          { title: 'Lecture 05：运动学与抛体', path: '学习资料/PHY1001_Lecture_05.pdf', kind: 'pdf', note: '对应 ch02–ch03，含抛体与圆周运动的课堂例题。' },
          { title: 'Lecture 17：转动与角动量', path: '学习资料/PHY1001_Lecture_17.pdf', kind: 'pdf', note: '对应 ch06，转动惯量与角动量守恒的推导。' },
          { title: 'Week 12–14 合并讲义：振动与波', path: '学习资料/PHY1001_Lecture_Week_12_13_14.pdf', kind: 'pdf', note: '对应 ch07 后半，简谐运动、驻波与声学。' }
        ]
      },
      {
        name: '作业与解答',
        note: '先独立做 HW，再对照 Solution；解答里的步骤比分值更重要。',
        items: [
          { title: 'HW 01：测量、矢量与一维运动', path: '学习资料/PHY1001_HW_01.pdf', kind: 'pdf', note: '开学第一份作业，难度与期中前段题相当。' },
          { title: 'HW 01 解答', path: '作业习题/PHY1001_HW_01_Solution_1.pdf', kind: 'pdf', note: '含详细步骤与常见错误提示。' },
          { title: '转动惯量专题指南', path: '作业习题/PHY1001_Rotational_Inertia_Guide.pdf', kind: 'pdf', note: 'ch06 的补充材料，平行轴定理与常见刚体的 I 汇总。' },
          { title: 'Tutorial 12：综合习题课', path: '作业习题/PHY1001_Tutorial_12.pdf', kind: 'pdf', note: '期末前的综合训练，覆盖转动与振动。' }
        ]
      },
      {
        name: '考试真题',
        note: '真题是最好的模拟卷：先限时做，再对照评分标准看「步骤分」怎么给。',
        items: [
          { title: '2024 期中解答', path: '考试资料/PHY1001_Midterm_2024_Solution.pdf', kind: 'pdf', note: '最近一次期中的完整解答，覆盖 ch01–ch06。' },
          { title: '2023 期中（含评分标准）', path: '考试资料/PHY1001_Midterm_2023_Solution_grading.pdf', kind: 'pdf', note: '可以看清每一步值多少分，练习书写规范。' },
          { title: '2022 期末真题', path: '考试资料/PHY1001_2022_Final.pdf', kind: 'pdf', note: '覆盖全学期，适合期末前两周限时训练。' },
          { title: '2023 期末（含解答）', path: '考试资料/PHY1001_2023_Final_WithSolution.pdf', kind: 'pdf', note: '做完直接对答案，重点看综合题的建模思路。' }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '大学物理 I（Physics I，PHY1001），力学部分，28 讲'],
    ['来源', 'CUHKSZ PHY1001 课程资料：大纲、讲义、13 次作业与历年真题'],
    ['结构', '8 章正文 · 56 题分章题库 · 模拟卷 A · 3 个实战项目 · 资料库'],
    ['建议', '先读第 0 章建立地图，再按 ch01→ch07 推进；每章结尾的自检清单与内嵌题不要跳过。']
  ],

  /* 速查表：公式与单位速查（4 页） */
  cheat: [
    {
      label: '运动学',
      blocks: [
        { t: 'p', html: '以下公式只对<b>匀加速直线运动</b>成立；曲线运动要先分解为两个一维问题。取 +x 为运动正方向时，减速的 a 取负值。' },
        { t: 'table', caption: '四个运动学方程：每个方程恰好缺一个量', head: ['方程', '缺的量', '适用'], rows: [
          ['v = v<sub>0</sub> + at', '位移 x', '已知 v<sub>0</sub>、a、t 求 v'],
          ['x = v<sub>0</sub>t + ½at<sup>2</sup>', '末速度 v', '已知 v<sub>0</sub>、a、t 求 x'],
          ['v<sup>2</sup> = v<sub>0</sub><sup>2</sup> + 2ax', '时间 t', '不含时间的题首选'],
          ['x = ½(v<sub>0</sub> + v)t', '加速度 a', '已知初末速度与时间']
        ] },
        { t: 'table', caption: '抛体与圆周的关键式', head: ['量', '公式', '备注'], rows: [
          ['射程（平地）', 'R = v<sub>0</sub><sup>2</sup>sin 2θ/g', 'θ = 45° 最大；互补角射程相同'],
          ['最大高度', 'h = (v<sub>0</sub>sin θ)<sup>2</sup>/(2g)', '由竖直分量单独决定'],
          ['向心加速度', 'a<sub>c</sub> = v<sup>2</sup>/r = ω<sup>2</sup>r', '方向始终指向圆心'],
          ['角量与线量', 'v = ωr，a<sub>t</sub> = αr', '角量对刚体各点相同']
        ] }
      ]
    },
    {
      label: '力与能',
      blocks: [
        { t: 'p', html: '动力学题的标准流程：<b>画自由体图 → 选坐标轴（沿运动方向最省事）→ 写 ΣF = ma → 解方程 → 检查量纲与极限</b>。能量题则先问「有哪些力做功、是否保守」。' },
        { t: 'table', caption: '力、功、能量的核心公式', head: ['名称', '公式', '要点'], rows: [
          ['牛顿第二定律', 'ΣF = ma', '合力，不是某一个力'],
          ['摩擦力', 'f<sub>k</sub> = μ<sub>k</sub>N，f<sub>s</sub> ≤ μ<sub>s</sub>N', 'N 不一定等于 mg'],
          ['斜面重力分量', 'mg sin θ（沿面），mg cos θ（垂直）', 'θ 是斜面与水平面的夹角'],
          ['功', 'W = Fd cos θ = F·d', '垂直不做功'],
          ['动能定理', 'W<sub>net</sub> = ΔK = ½mv<sup>2</sup> − ½mv<sub>0</sub><sup>2</sup>', '合力的功才等于 ΔK'],
          ['重力势能', 'U = mgh', '零势能面可任选'],
          ['弹性势能', 'U = ½kx<sup>2</sup>', 'k 为劲度系数'],
          ['机械能守恒', 'K<sub>1</sub> + U<sub>1</sub> = K<sub>2</sub> + U<sub>2</sub>', '只有保守力做功'],
          ['功率', 'P = W/t = Fv', '恒定功率时 F 与 v 成反比']
        ] }
      ]
    },
    {
      label: '动量与转动',
      blocks: [
        { t: 'p', html: '平动与转动一一对应：<code>m ↔ I</code>、<code>F ↔ τ</code>、<code>p = mv ↔ L = Iω</code>、<code>K = ½mv<sup>2</sup> ↔ ½Iω<sup>2</sup></code>。记不住转动公式时，先把平动公式写出来再逐项替换。' },
        { t: 'table', caption: '动量、碰撞与转动公式', head: ['名称', '公式', '要点'], rows: [
          ['动量', 'p = mv', '矢量；与 K 不同，正比于 v'],
          ['冲量定理', 'J = ∫F dt = Δp', '延长作用时间可减小平均力'],
          ['完全非弹性碰撞', 'v = Σmv/Σm', '动能损失最大'],
          ['一维弹性碰撞', "v<sub>1</sub>′ = ((m<sub>1</sub>−m<sub>2</sub>)/(m<sub>1</sub>+m<sub>2</sub>))v<sub>1</sub>", '等质量时交换速度'],
          ['转动惯量', 'I = Σmr<sup>2</sup>；平行轴 I = I<sub>cm</sub> + Md<sup>2</sup>', '圆盘 ½MR<sup>2</sup>、球 ⅖MR<sup>2</sup>'],
          ['转动定律', 'Στ = Iα', 'τ = rF sin θ'],
          ['角动量', 'L = Iω（刚体）；L = r×p（质点）', '合外力矩为零时守恒'],
          ['纯滚动', 'v = ωR，a = g sin θ/(1 + I/(mR<sup>2</sup>))', 'β 越小滚得越快']
        ] },
        { t: 'table', caption: '常见刚体转动惯量（绕对称轴）', head: ['刚体', 'I'], rows: [
          ['圆环', 'MR<sup>2</sup>'],
          ['圆盘', '½MR<sup>2</sup>'],
          ['实心球', '⅖MR<sup>2</sup>'],
          ['细杆（中心 / 端点）', '<sup>1</sup>⁄<sub>12</sub>ML<sup>2</sup> / <sup>1</sup>⁄<sub>3</sub>ML<sup>2</sup>']
        ] }
      ]
    },
    {
      label: '振动、波与常数',
      blocks: [
        { t: 'p', html: '振动与波共用一套「周期—频率—波长」语言：<code>T = 1/f</code>、<code>v = λf</code>。简谐运动的一切都从 <code>F = −kx</code> 出发，波的一切都从「介质连续 + 边界条件」出发。' },
        { t: 'table', caption: '振动、波与引力公式', head: ['名称', '公式', '要点'], rows: [
          ['简谐运动', 'x = A cos(ωt + φ)，ω = √(k/m)', 'T = 2π√(m/k)，与振幅无关'],
          ['单摆', 'T = 2π√(L/g)', '小角度（&lt; 10°）才成立'],
          ['SHM 能量', 'E = ½kA<sup>2</sup>，v<sub>max</sub> = Aω', '平衡位置 v 最大、a 为零'],
          ['波速关系', 'v = λf', '波速由介质决定，频率由波源决定'],
          ['弦上波速', 'v = √(T/μ)', 'T 为张力，μ 为线密度'],
          ['驻波（两端固定）', 'f<sub>n</sub> = nv/(2L)', 'n = 1 为基频'],
          ['多普勒', "f′ = f(v ± v<sub>o</sub>)/(v ∓ v<sub>s</sub>)", '靠近升调、远离降调'],
          ['万有引力', 'F = Gm<sub>1</sub>m<sub>2</sub>/r<sup>2</sup>', 'G = 6.67×10<sup>−11</sup>'],
          ['轨道 / 逃逸速度', 'v = √(GM/r)，v<sub>esc</sub> = √(2GM/R)', '地球 7.9 / 11.2 km/s']
        ] },
        { t: 'table', caption: '常用常数与单位换算（本课统一取 g = 9.8 m/s²）', head: ['量', '数值'], rows: [
          ['重力加速度 g', '9.8 m/s<sup>2</sup>（深圳约 9.79）'],
          ['万有引力常数 G', '6.67×10<sup>−11</sup> N·m<sup>2</sup>/kg<sup>2</sup>'],
          ['标准大气压', '1.01×10<sup>5</sup> Pa'],
          ['水的密度', '1.0×10<sup>3</sup> kg/m<sup>3</sup>'],
          ['空气中声速（20 °C）', '343 m/s'],
          ['km/h → m/s', '除以 3.6'],
          ['eV → J', '1 eV = 1.60×10<sup>−19</sup> J']
        ] }
      ]
    }
  ]
};
