/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * resBase 指向课程原始资料目录（相对本文件所在站点目录）。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'mat1002',
  short: 'MAT1002',
  name: '微积分 II',
  en: 'Calculus II',
  dept: '数学与优化',
  lang: 'text',
  langLabel: '数学',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'MAT1002 // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... MAT1002',
    '> loading 8 modules ...',
    '> calibrating glossary & quiz bank ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '把课程读成一张可以走通的地图。',
  missionEn: 'MAT1002 · 8 MODULES',
  missionTitle: '从零开始<br><em>微积分 II 全掌握</em>',
  lede: '从级数一路走到斯托克斯与散度定理：每章先给判据与公式的来路，再用例题、对比表和常见错误把它压实，最后用题库与模拟卷自检。',
  searchPlaceholder: 'QUERY // 搜索本站章节、术语与题目',

  /* 资料库（path 相对 resBase，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/MAT1001&1002/',
  resources: {
    note: '收录 MAT1001&1002 的教材、讲义、作业与历年卷；文件名即原始文件，点击后用系统默认程序打开，页码与章节对应教材 Thomas\' Calculus 13e SI Units。',
    groups: [
      { name: '教材与大纲', note: '整门课的地基：一本主教材、一本分析参考书、两份课程大纲。', items: [
        { title: 'Thomas\' Calculus（13e, SI Units）', path: '学习资料/MAT1001&1002_Thomas_Calculus_SI_Units.pdf', kind: 'pdf', note: '主教材，第 10–16 章对应本站 ch01–ch07' },
        { title: 'Introduction to Real Analysis（Bartle, 4e）', path: '学习资料/MAT1001&1002_Introduction_to_Real_Analysis_4th_by_Robert_G_Bartle.pdf', kind: 'pdf', note: '想补 ε–N 严格证明时看前几章' },
        { title: 'MAT1002 课程大纲（Lecture 06）', path: '学习资料/MAT1002_Course_Outline_(Lecture_06).pdf', kind: 'pdf', note: '官方覆盖范围、评分构成与考试安排' },
        { title: 'MAT1001 课程大纲（Lecture 07/08）', path: '学习资料/MAT1001_Course_Outline_Lecture_07_Lecture_08_(V0_2023_09_4).pdf', kind: 'pdf', note: '前置课范围，ch00 的地图据此对齐' }
      ] },

      { name: '课堂讲义 L1–L13', note: 'MAT1001 的十三讲，ch01–ch05 的例题多来自这里；L1–L5 是单元微积分复习。', items: [
        { title: 'L1 · 函数、极限与连续', path: '学习资料/MAT1001_L1_updated0911.pdf', kind: 'pdf', note: '前置复习，读 ch06 多元极限前先翻一遍' },
        { title: 'L2 · 导数与求导法则', path: '学习资料/MAT1001_L2_updated0920.pdf', kind: 'pdf', note: '链式法则的一元版本，ch06 会推广到多元' },
        { title: 'L3 · 导数的应用', path: '学习资料/MAT1001_L3_updated0920.pdf', kind: 'pdf', note: '极值与单调性，对应 ch06 的二阶判别' },
        { title: 'L4 · 积分与基本定理', path: '学习资料/MAT1001_L4_updated1011.pdf', kind: 'pdf', note: '定积分与面积，ch07 重积分的直觉来源' },
        { title: 'L5 · 积分技巧', path: '学习资料/MAT1001_L5.pdf', kind: 'pdf', note: '换元与分部，ch07 的雅可比是它的高维版' },
        { title: 'L6 · 积分应用', path: '学习资料/MAT1001_L6_updated1018.pdf', kind: 'pdf', note: '弧长与旋转体，对照 ch04 的参数弧长' },
        { title: 'L7 · 反常积分', path: '学习资料/MAT1001_L7_updated1025.pdf', kind: 'pdf', note: '与 ch01 的积分判别法同一套比较思想' },
        { title: 'L8 · 数列与级数初步', path: '学习资料/MAT1001_L8_updated1101.pdf', kind: 'pdf', note: '部分和与几何级数，ch01 的起点' },
        { title: 'L9 · 级数判别法', path: '学习资料/MAT1001_L9_updated1113.pdf', kind: 'pdf', note: '比较、比值、交错，覆盖 ch01–ch02' },
        { title: 'L10 · 幂级数与泰勒', path: '学习资料/MAT1001_L10.pdf', kind: 'pdf', note: '收敛半径与展开，覆盖 ch02–ch03' },
        { title: 'L11 · 参数曲线与极坐标', path: '学习资料/MAT1001_L11.pdf', kind: 'pdf', note: '对应 ch04，含极坐标面积例题' },
        { title: 'L12 · 向量与空间几何', path: '学习资料/MAT1001_L12_updated1129.pdf', kind: 'pdf', note: '点积、叉积、直线与平面，对应 ch05' },
        { title: 'L13 · 偏导数与重积分', path: '学习资料/MAT1001_L13_updated1206.pdf', kind: 'pdf', note: '对应 ch06–ch07 的开头' }
      ] },

      { name: '作业与习题解答', note: 'MAT1002 的作业按教材章节布置；答案册按章编号，M10–M16 正是本学期范围。', items: [
        { title: 'MAT1002 作业章节清单', path: '作业习题/MAT1002_Assignment_Chapters.pdf', kind: 'pdf', note: '十二次作业分别对应哪几节' },
        { title: 'Assignment 7 参考解答', path: '作业习题/MAT1002_Assignment_7_Solution.pdf', kind: 'pdf', note: '级数与幂级数的标准写法' },
        { title: 'Assignment 13 参考解答', path: '作业习题/MAT1002_Assignment13_Solution.pdf', kind: 'pdf', note: '向量场定理的完整推导示范' },
        { title: 'MAT1001 作业章节清单', path: '作业习题/MAT1001_Assignment_Chapters.pdf', kind: 'pdf', note: '前置课作业范围，用来定位复习点' },
        { title: 'Thomas 第 10 章习题答案', path: '作业习题/托马斯微积分 13全球版 习题答案/TC-13e-MV-ISM-10.pdf', kind: 'pdf', note: '数列与级数，配合 ch01' },
        { title: 'Thomas 第 11 章习题答案', path: '作业习题/托马斯微积分 13全球版 习题答案/TC-13e-MV-ISM-11.pdf', kind: 'pdf', note: '幂级数与泰勒，配合 ch02–ch03' },
        { title: 'Thomas 第 12 章习题答案', path: '作业习题/托马斯微积分 13全球版 习题答案/TC-13e-MV-ISM-12.pdf', kind: 'pdf', note: '参数曲线与极坐标，配合 ch04' },
        { title: 'Thomas 第 13 章习题答案', path: '作业习题/托马斯微积分 13全球版 习题答案/TC-13e-MV-ISM-13.pdf', kind: 'pdf', note: '向量与空间几何，配合 ch05' },
        { title: 'Thomas 第 14 章习题答案', path: '作业习题/托马斯微积分 13全球版 习题答案/TC-13e-MV-ISM-14.pdf', kind: 'pdf', note: '偏导数，配合 ch06' },
        { title: 'Thomas 第 15 章习题答案', path: '作业习题/托马斯微积分 13全球版 习题答案/TC-13e-MV-ISM-15.pdf', kind: 'pdf', note: '多重积分，配合 ch07 前半' },
        { title: 'Thomas 第 16 章习题答案', path: '作业习题/托马斯微积分 13全球版 习题答案/TC-13e-MV-ISM-16.pdf', kind: 'pdf', note: '线面积分与三大定理，配合 ch07 后半' },
        { title: '高数习题全解指南（上册）', path: '作业习题/MAT1001&1002_高等数学_习题全解指南_第7版_上册.pdf', kind: 'pdf', note: '中文对照解法，适合自查步骤' },
        { title: '高数习题全解指南（下册）', path: '作业习题/MAT1001&1002_高等数学_习题全解指南_第7版_下册.pdf', kind: 'pdf', note: '重积分与向量场部分的中文详解' }
      ] },

      { name: '考试资料', note: '历年期中期末与官方解答；做卷时先掐表，再看答案。', items: [
        { title: 'MAT1002 2023 期中', path: '考试资料/MAT1002_2023_Midterm.pdf', kind: 'pdf', note: '级数 + 泰勒，题量与正式考试一致' },
        { title: 'MAT1002 2023 期中（含解答）', path: '考试资料/MAT1002_2023_Midterm_WithSolution.pdf', kind: 'pdf', note: '对照评分点，看步骤分怎么给' },
        { title: 'MAT1002 2024 期中', path: '考试资料/MAT1002_2024_Midterm.pdf', kind: 'pdf', note: '近一次期中，风格最接近本站模拟卷' },
        { title: 'MAT1002 2024 期中（含解答）', path: '考试资料/MAT1002_2024_Midterm_WithSolution.pdf', kind: 'pdf', note: '注意收敛区间端点讨论的写法' },
        { title: 'MAT1002 2023 期末', path: '考试资料/MAT1002_2023_Final.pdf', kind: 'pdf', note: '全范围，向量场定理占分最高' },
        { title: 'MAT1001 2022 期中（含解答）', path: '考试资料/MAT1001_2022_Midterm_WithSolution.pdf', kind: 'pdf', note: '前置课基线，用来查漏' },
        { title: 'MAT1001 2022 期末', path: '考试资料/MAT1001_2022_Final.pdf', kind: 'pdf', note: '单元微积分综合，ch06–ch07 的计算基础' },
        { title: 'MAT1001 2023 期中（含解答）', path: '考试资料/MAT1001_2023_Midterm_WithSolution.pdf', kind: 'pdf', note: '极限与导数部分的严格写法参考' }
      ] }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '微积分 II（Calculus II）'],
    ['来源', 'CUHKSZ MAT1001&1002 课程资料'],
    ['结构', '8 章正文 · 分章题库 · 模拟卷 · 实战项目 · 资料库'],
    ['建议', '先读第 0 章建立地图，再按顺序推进；每章结尾的自检清单不要跳过。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    { label: '级数判据', blocks: [
      { t: 'table', head: ['判别法', '适用对象', '结论', '备注'], rows: [
        ['第 n 项判别', '<code>Σ a<sub>n</sub></code>', '<code>a<sub>n</sub> ↛ 0</code> 则发散', '只能判发散，<code>a<sub>n</sub>→0</code> 时无效'],
        ['几何级数', '<code>Σ ar<sup>n</sup></code>', '<code>|r| &lt; 1</code> 收敛于 <code>a/(1−r)</code>', '先化成标准形式再套'],
        ['p 级数', '<code>Σ 1/n<sup>p</sup></code>', '<code>p &gt; 1</code> 收敛', '调和级数是 <code>p = 1</code>'],
        ['积分判别', '<code>a<sub>n</sub> = f(n)</code>，<code>f</code> 正、连续、递减', '与 <code>∫<sub>1</sub><sup>∞</sup> f</code> 同敛散', '余项满足 <code>R<sub>N</sub> ≤ ∫<sub>N</sub><sup>∞</sup> f</code>'],
        ['比较判别', '<code>0 ≤ a<sub>n</sub> ≤ b<sub>n</sub></code>', '<code>Σ b<sub>n</sub></code> 收敛则 <code>Σ a<sub>n</sub></code> 收敛', '放缩方向别写反'],
        ['极限比较', '<code>a<sub>n</sub>, b<sub>n</sub> &gt; 0</code>，<code>a<sub>n</sub>/b<sub>n</sub> → c &gt; 0</code>', '同敛散', '先猜阶，再选 <code>b<sub>n</sub></code>'],
        ['比值判别', '<code>|a<sub>n+1</sub>/a<sub>n</sub>| → L</code>', '<code>L &lt; 1</code> 收敛，<code>L &gt; 1</code> 发散', '<code>L = 1</code> 失效'],
        ['根值判别', '<code>|a<sub>n</sub>|<sup>1/n</sup> → L</code>', '同上', '含 <code>n</code> 次幂时最快'],
        ['交错级数', '<code>Σ (−1)<sup>n−1</sup>b<sub>n</sub></code>，<code>b<sub>n</sub></code> 递减趋 0', '收敛，且 <code>|R<sub>N</sub>| ≤ b<sub>N+1</sub></code>', '误差界是它最大的价值']
      ], caption: '拿到级数先看通项：趋 0 只是入场券，判据才是结论' },
      { t: 'compare', left: { title: '绝对收敛', html: '<code>Σ|a<sub>n</sub>|</code> 收敛。此时原级数必收敛，且可任意重排、可拆成两个收敛的正项级数之差。' }, right: { title: '条件收敛', html: '<code>Σa<sub>n</sub></code> 收敛但 <code>Σ|a<sub>n</sub>|</code> 发散。重排会改变和（黎曼重排定理），不能随意换序。' } },
      { t: 'callout', kind: 'warn', title: '三个最常见的错误', html: '<code>a<sub>n</sub> → 0</code> 不蕴含收敛（调和级数）；比值判别 <code>L = 1</code> 时不能下结论；<code>Σ a<sub>n</sub>b<sub>n</sub></code> 不能由两个收敛级数相乘直接判收敛。' }
    ] },

    { label: '泰勒展开', blocks: [
      { t: 'table', head: ['函数', '麦克劳林展开', '收敛区间'], rows: [
        ['<code>e<sup>x</sup></code>', '<code>Σ x<sup>n</sup>/n!</code>', '<code>(−∞, ∞)</code>'],
        ['<code>sin x</code>', '<code>Σ (−1)<sup>n</sup>x<sup>2n+1</sup>/(2n+1)!</code>', '<code>(−∞, ∞)</code>'],
        ['<code>cos x</code>', '<code>Σ (−1)<sup>n</sup>x<sup>2n</sup>/(2n)!</code>', '<code>(−∞, ∞)</code>'],
        ['<code>1/(1−x)</code>', '<code>Σ x<sup>n</sup></code>', '<code>(−1, 1)</code>'],
        ['<code>ln(1+x)</code>', '<code>Σ (−1)<sup>n+1</sup>x<sup>n</sup>/n</code>', '<code>(−1, 1]</code>'],
        ['<code>arctan x</code>', '<code>Σ (−1)<sup>n</sup>x<sup>2n+1</sup>/(2n+1)</code>', '<code>[−1, 1]</code>'],
        ['<code>(1+x)<sup>α</sup></code>', '<code>1 + Σ α(α−1)…(α−n+1)x<sup>n</sup>/n!</code>', '<code>|x| &lt; 1</code>（<code>α</code> 非整数时）']
      ], caption: '考试默认你背得出前五个；后两个要会用余项估误差' },
      { t: 'table', head: ['余项形式', '表达式', '什么时候用'], rows: [
        ['拉格朗日余项', '<code>R<sub>n</sub>(x) = f<sup>(n+1)</sup>(c)x<sup>n+1</sup>/(n+1)!</code>，<code>c</code> 在 0 与 <code>x</code> 之间', '证明不等式、给误差上界'],
        ['交替级数余项', '<code>|R<sub>N</sub>| ≤ b<sub>N+1</sub></code>', '展开式本身是交错级数时最快'],
        ['积分余项', '<code>R<sub>n</sub>(x) = ∫<sub>0</sub><sup>x</sup> f<sup>(n+1)</sup>(t)(x−t)<sup>n</sup>/n! dt</code>', '需要精确表达式或估计积分'],
        ['等价无穷小', '<code>f(x) = P<sub>n</sub>(x) + o(x<sup>n</sup>)</code>', '求极限时只关心阶数']
      ], caption: '「误差小于 10<sup>−3</sup>」的题，一律是解 <code>|R<sub>n</sub>| ≤ 10<sup>−3</sup></code> 求 <code>n</code>' },
      { t: 'callout', kind: 'tip', title: '展开中心可以换', html: '求 <code>ln x</code> 在 <code>x = 2</code> 附近的展开，就把 <code>ln x = ln 2 + ln(1 + (x−2)/2)</code> 再套标准式；不要硬求高阶导数。' }
    ] },

    { label: '曲线与极坐标', blocks: [
      { t: 'table', head: ['对象', '公式', '注意'], rows: [
        ['参数曲线斜率', '<code>dy/dx = (dy/dt)/(dx/dt)</code>', '<code>dx/dt = 0</code> 处是竖直切线，需单独讨论'],
        ['参数曲线弧长', '<code>L = ∫ √((dx/dt)<sup>2</sup> + (dy/dt)<sup>2</sup>) dt</code>', '先确认曲线简单、不重复走'],
        ['极坐标转直角', '<code>x = r cos θ</code>，<code>y = r sin θ</code>', '<code>r</code> 可为负，方向反过来'],
        ['极坐标面积', '<code>A = ½∫<sub>α</sub><sup>β</sup> r<sup>2</sup> dθ</code>', '积分限要覆盖整个区域一次'],
        ['极坐标弧长', '<code>L = ∫ √(r<sup>2</sup> + (dr/dθ)<sup>2</sup>) dθ</code>', '与参数式同源，令 <code>t = θ</code>'],
        ['极坐标切线斜率', '<code>dy/dx = (r′ sin θ + r cos θ)/(r′ cos θ − r sin θ)</code>', '分母为 0 时竖直']
      ], caption: '极坐标题九成的错误不在公式，而在积分限' },
      { t: 'compare', left: { title: '玫瑰线 r = a cos(nθ)', html: '<code>n</code> 为奇数：<code>n</code> 片花瓣；<code>n</code> 为偶数：<code>2n</code> 片花瓣。整条曲线画完所需角度分别是 <code>π</code> 与 <code>2π</code>。' }, right: { title: '心形线 r = a(1 ± cos θ)', html: '过极点，关于极轴对称；面积 <code>3πa<sup>2</sup>/2</code>，弧长 <code>8a</code>。加上 <code>sin</code> 版本就是把图形转 90°。' } },
      { t: 'callout', kind: 'warn', title: 'r = 2cos θ 到底是什么', html: '两边乘 <code>r</code> 得 <code>r<sup>2</sup> = 2r cos θ</code>，即 <code>x<sup>2</sup> + y<sup>2</sup> = 2x</code>，是圆心 <code>(1,0)</code>、半径 1 的圆。把极坐标方程转直角再判断形状，比背图形可靠。' }
    ] },

    { label: '空间几何', blocks: [
      { t: 'table', head: ['运算', '公式', '几何意义'], rows: [
        ['点积', '<code>u·v = |u||v|cos θ</code>', '投影、夹角、判垂直'],
        ['叉积模长', '<code>|u×v| = |u||v|sin θ</code>', '平行四边形面积'],
        ['混合积', '<code>u·(v×w)</code>', '平行六面体体积，为 0 则共面'],
        ['直线', '<code>r = r<sub>0</sub> + t d</code>', '<code>d</code> 是方向向量'],
        ['平面', '<code>n·(r − r<sub>0</sub>) = 0</code>', '<code>n</code> 是法向量'],
        ['点到平面距离', '<code>|n·(P<sub>0</sub> − P)|/|n|</code>', '先取平面上任一点'],
        ['异面直线距离', '<code>|(P<sub>2</sub>−P<sub>1</sub>)·(d<sub>1</sub>×d<sub>2</sub>)|/|d<sub>1</sub>×d<sub>2</sub>|</code>', '公垂线方向就是叉积'],
        ['曲率', '<code>κ = |r′×r″|/|r′|<sup>3</sup></code>', '圆上等于 <code>1/R</code>'],
        ['单位切向量', '<code>T = r′/|r′|</code>', '再对弧长求导得 <code>N</code>']
      ], caption: '叉积只对三维向量有定义，点积对任意维都有' },
      { t: 'table', head: ['二次曲面', '标准方程', '形状'], rows: [
        ['椭球面', '<code>x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> + z<sup>2</sup>/c<sup>2</sup> = 1</code>', '封闭，三个轴截都是椭圆'],
        ['单叶双曲面', '<code>x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> − z<sup>2</sup>/c<sup>2</sup> = 1</code>', '连通，水平截是椭圆'],
        ['双叶双曲面', '<code>z<sup>2</sup>/c<sup>2</sup> − x<sup>2</sup>/a<sup>2</sup> − y<sup>2</sup>/b<sup>2</sup> = 1</code>', '两片，一正两负'],
        ['椭圆抛物面', '<code>z = x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup></code>', '开口向上，水平截是椭圆'],
        ['双曲抛物面', '<code>z = x<sup>2</sup>/a<sup>2</sup> − y<sup>2</sup>/b<sup>2</sup></code>', '马鞍面，含两条直母线'],
        ['锥面', '<code>z<sup>2</sup> = x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup></code>', '过原点的两叶锥']
      ], caption: '先数负号个数，再看哪个变量单独出现，形状基本就定了' },
      { t: 'callout', kind: 'tip', title: '判断两条直线的关系', html: '先算 <code>d<sub>1</sub>×d<sub>2</sub></code>：为 0 则平行或重合，再用连线上一点是否平行于 <code>d</code> 区分；不为 0 则算混合积，为 0 相交、非 0 异面。' }
    ] },

    { label: '多元微分', blocks: [
      { t: 'table', head: ['概念', '定义 / 公式', '易错点'], rows: [
        ['偏导数', '<code>f<sub>x</sub> = lim<sub>h→0</sub> [f(x+h,y) − f(x,y)]/h</code>', '只沿坐标轴方向'],
        ['可微', '<code>Δf = f<sub>x</sub>Δx + f<sub>y</sub>Δy + o(ρ)</code>', '偏导存在 ≠ 可微'],
        ['链式法则', '<code>dz/dt = z<sub>x</sub>x′ + z<sub>y</sub>y′</code>', '漏项最常见'],
        ['方向导数', '<code>D<sub>u</sub>f = ∇f·u</code>，<code>|u| = 1</code>', '<code>u</code> 必须先单位化'],
        ['梯度', '<code>∇f = ⟨f<sub>x</sub>, f<sub>y</sub>⟩</code>', '垂直等值线，指向增长最快方向'],
        ['切平面', '<code>f<sub>x</sub>(x−x<sub>0</sub>) + f<sub>y</sub>(y−y<sub>0</sub>) − (z−z<sub>0</sub>) = 0</code>', '隐函数 <code>F = 0</code> 时用法向量 <code>∇F</code>'],
        ['二阶判别', '<code>D = f<sub>xx</sub>f<sub>yy</sub> − f<sub>xy</sub><sup>2</sup></code>', '<code>D &gt; 0</code> 才有极值，<code>D &lt; 0</code> 是鞍点'],
        ['拉格朗日', '<code>∇f = λ∇g</code>', '别忘了同时解约束方程']
      ], caption: '一元的所有结论几乎都要加条件才能搬到多元' },
      { t: 'compare', left: { title: '无条件极值', html: '解 <code>∇f = 0</code> 找驻点，再用 <code>D = f<sub>xx</sub>f<sub>yy</sub> − f<sub>xy</sub><sup>2</sup></code>：<code>D &gt; 0</code> 且 <code>f<sub>xx</sub> &gt; 0</code> 极小、<code>f<sub>xx</sub> &lt; 0</code> 极大；<code>D &lt; 0</code> 鞍点；<code>D = 0</code> 失效。' }, right: { title: '条件极值', html: '解 <code>∇f = λ∇g</code> 与 <code>g = 0</code> 组成的方程组，把所有候选点代入比较大小；边界另算。几何上是在等值线与约束曲线相切处取极值。' } },
      { t: 'callout', kind: 'warn', title: '经典反例', html: '<code>f(x,y) = xy/(x<sup>2</sup>+y<sup>2</sup>)</code>（原点补 0）在原点两个偏导都存在且为 0，但函数不连续，更不可微。判断可微必须回到定义。' }
    ] },

    { label: '积分与三大定理', blocks: [
      { t: 'table', head: ['坐标系', '面积 / 体积元', '何时用'], rows: [
        ['直角坐标', '<code>dA = dx dy</code>，<code>dV = dx dy dz</code>', '区域边界是直线或简单曲线'],
        ['极坐标', '<code>dA = r dr dθ</code>', '圆、扇形、玫瑰线'],
        ['柱坐标', '<code>dV = r dr dθ dz</code>', '绕 z 轴的旋转体'],
        ['球坐标', '<code>dV = ρ<sup>2</sup> sin φ dρ dφ dθ</code>', '球、锥、<code>x<sup>2</sup>+y<sup>2</sup>+z<sup>2</sup></code> 型'],
        ['一般换元', '<code>dA = |∂(x,y)/∂(u,v)| du dv</code>', '椭圆、平行四边形区域'],
        ['线积分（标量）', '<code>∫<sub>C</sub> f ds</code>', '弧长、质量'],
        ['线积分（向量）', '<code>∫<sub>C</sub> F·dr</code>', '功、环流']
      ], caption: '雅可比行列式必须取绝对值；极坐标的 <code>r</code> 就是最简单的雅可比' },
      { t: 'compare', left: { title: '格林定理', html: '<code>∮<sub>C</sub> P dx + Q dy = ∬<sub>D</sub> (Q<sub>x</sub> − P<sub>y</sub>) dA</code>，<code>C</code> 取正向（区域在左侧，逆时针）。把平面上的线积分换成二重积分。' }, right: { title: '斯托克斯定理', html: '<code>∮<sub>C</sub> F·dr = ∬<sub>S</sub> (∇×F)·n dS</code>，<code>C</code> 是 <code>S</code> 的边界，方向与 <code>n</code> 右手法则一致。格林是它在平面上的特例。' } },
      { t: 'table', head: ['定理', '等式', '方向约定'], rows: [
        ['散度定理', '<code>∬<sub>S</sub> F·n dS = ∭<sub>V</sub> ∇·F dV</code>', '<code>n</code> 取外法向'],
        ['保守场判定', '<code>F = ∇f</code> ⇔ <code>∇×F = 0</code>（单连通域）', '缺单连通会出错'],
        ['路径无关', '<code>∫<sub>C</sub> F·dr</code> 只依赖起点终点', '等价于存在势函数'],
        ['通量', '<code>∬<sub>S</sub> F·n dS</code>', '曲面定向决定正负号']
      ], caption: '三大定理统一写成「边界的积分 = 内部的导数积分」' },
      { t: 'callout', kind: 'tip', title: '先看对称性', html: '区域关于 <code>x</code> 轴对称且被积函数是 <code>y</code> 的奇函数，积分直接为 0；<code>F = ⟨x,y,z⟩</code> 过单位球面的通量用散度定理一步得 <code>4π</code>，硬算曲面积分要做三次。' }
    ] }
  ]
};
