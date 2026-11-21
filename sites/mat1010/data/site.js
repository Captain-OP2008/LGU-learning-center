/* =====================================================================
 * site.js · MAT1010 经济分析数学 站点配置（window.CSC_SITE）
 * ===================================================================== */
window.CSC_SITE = {
  id: 'mat1010',
  short: 'MAT1010',
  name: '经济分析数学',
  en: 'Mathematics for Economic Analysis',
  dept: '数学与优化',
  lang: 'text',
  langLabel: '数学',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读 + 计算',
  bootHead: 'MAT1010 // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... MAT1010',
    '> loading 8 modules: algebra, graphs, derivatives, optimization ...',
    '> calibrating supply & demand: Qd = 100 - 2P, Qs = 20 + 3P ...',
    '> equilibrium found at P = 16, Q = 68. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '把经济问题写成方程，再用微积分读出答案。',
  missionEn: 'MAT1010 · 8 MODULES',
  missionTitle: '从一条供需曲线<br><em>到拉格朗日与差分方程</em>',
  lede: '八章沿一条主线推进：先把经济关系写成函数与方程，再用导数刻画边际，用最优化找均衡与最优决策，用积分把边际还原成总量，最后用偏导、约束与动态方程处理多变量和跨期问题。每章配可手算的例题、对照表与自检清单，读完能独立完成一份小型经济建模报告。',
  searchPlaceholder: 'QUERY // 搜索：均衡 · 弹性 · 边际成本 · 拉格朗日 · 消费者剩余 · 现值 · 蛛网模型',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/MAT1010/',
  resources: {
    note: '收录 MAT1010 使用的英文教材两个版本与中文高等数学对照本；文件为原书 PDF，点击后用系统默认阅读器打开。',
    groups: [
      { name: '主教材', note: '课程主线以 Sydsaeter 与 Hammond 的《Essential Mathematics for Economic Analysis》为准，第五版页码对应本站各章标注。', items: [
        { title: 'Essential Mathematics for Economic Analysis · 5th Edition', path: '学习资料/MAT1010_Essential_Mathematics_for_Economic_Analysis_5th_Edition.pdf', kind: 'pdf', note: '主教材第五版：代数、微分、最优化与动态分析全覆盖' },
        { title: 'Essential Mathematics for Economic Analysis · 4th Edition', path: '学习资料/MAT1010_Essential_Mathematics_for_Economic_Analysis_4th_Edition.pdf', kind: 'pdf', note: '第四版：章节编号与第五版略有差异，可用来对照旧版习题' }
      ] },
      { name: '中文对照与微积分补充', note: '中文教材用于补齐极限、积分与级数的证明细节；英文教材的例题更贴近经济应用。', items: [
        { title: '高等数学（第七版）上册 · 同济大学', path: '学习资料/MAT1010_高等数学_第7版_上册_同济大学.pdf', kind: 'pdf', note: '对照 ch04 极限与连续、ch05 积分的严格定义与计算训练' },
        { title: 'Essential Mathematics · 5th Edition（极限与积分章节）', path: '学习资料/MAT1010_Essential_Mathematics_for_Economic_Analysis_5th_Edition.pdf', kind: 'pdf', note: '同一本书的极限、积分章节，配经济解释与消费者剩余例题' }
      ] },
      { name: '习题与延伸阅读', note: '做题优先用第四版课后题，数量多且答案完整；第五版新增章节适合做建模项目时查阅。', items: [
        { title: 'Essential Mathematics · 4th Edition（习题部分）', path: '学习资料/MAT1010_Essential_Mathematics_for_Economic_Analysis_4th_Edition.pdf', kind: 'pdf', note: '每节末尾的 Review Problems，适合按章刷题' },
        { title: '高等数学（第七版）上册（级数与广义积分）', path: '学习资料/MAT1010_高等数学_第7版_上册_同济大学.pdf', kind: 'pdf', note: '补充广义积分收敛判别，配合 ch05 的永续年金与基尼系数' }
      ] }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '经济分析数学（Mathematics for Economic Analysis），CUHKSZ MAT1010'],
    ['来源', 'Sydsaeter 与 Hammond《Essential Mathematics for Economic Analysis》第 4/5 版，同济《高等数学》第七版上册'],
    ['结构', '8 章正文 · 56 题题库 · 模拟卷 A · 3 个建模项目 · 资料库'],
    ['建议', '第 0 章先建立地图；ch03 与 ch04 的每道例题都要亲手算一遍，后面的积分与约束优化才有落脚点。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    { label: '核心定义', blocks: [
      { t: 'terms', items: [
        { en: 'Marginal', zh: '边际', html: '自变量增加一个单位时总量的变化，离散情形是差分，连续情形是导数。' },
        { en: 'Elasticity', zh: '弹性', html: '价格变动百分之一引起需求量变动的百分比，<code>E = (dQ/dP)(P/Q)</code>，通常取绝对值。' },
        { en: 'Present Value', zh: '现值', html: '把未来现金流按贴现率折回今天，连续贴现为 <code>PV = ∫ F e<sup>−rt</sup> dt</code>。' },
        { en: 'Shadow Price', zh: '影子价格', html: '约束右端增加一单位时最优目标值的增量，就是拉格朗日乘子 λ。' },
        { en: 'Homogeneous', zh: '齐次函数', html: '所有自变量同乘 t 后函数值乘 t<sup>k</sup>，则称 k 次齐次，规模报酬看 k 与 1 的大小。' },
        { en: 'Steady State', zh: '稳态', html: '差分方程中满足 <code>y<sub>t+1</sub> = y<sub>t</sub> = y*</code> 的点，收敛条件看系数的绝对值是否小于 1。' }
      ] },
      { t: 'keypoint', items: [
        { title: '两条铁律', html: '边际量决定「要不要再做一点」，总量决定「做了多少」；两者之间靠积分与求和互相还原。' },
        { title: '均衡的两种读法', html: '代数上是解方程 <code>Qd = Qs</code>，几何上是两条曲线交点，最优化里是「边际收益 = 边际成本」。' },
        { title: '约束下的最优', html: '相切条件 <code>MRS = p<sub>x</sub>/p<sub>y</sub></code> 与拉格朗日一阶条件等价，乘子给出放松约束的价值。' }
      ] }
    ] },
    { label: '公式与法则', blocks: [
      { t: 'table', head: ['函数', '导数', '使用场景'], rows: [
        ['<code>x<sup>n</sup></code>', '<code>n x<sup>n−1</sup></code>', '幂函数、生产函数、成本函数'],
        ['<code>e<sup>kx</sup></code>', '<code>k e<sup>kx</sup></code>', '连续复利、指数增长'],
        ['<code>ln x</code>', '<code>1/x</code>', '对数效用、增长率'],
        ['<code>a<sup>x</sup></code>', '<code>a<sup>x</sup> ln a</code>', '离散复利、人口模型'],
        ['<code>f·g</code>', '<code>f′g + fg′</code>', '收入 = 价格 × 数量'],
        ['<code>f/g</code>', '<code>(f′g − fg′)/g<sup>2</sup></code>', '平均成本、利润率'],
        ['<code>f(g(x))</code>', '<code>f′(g)·g′(x)</code>', '复合的增长与贴现'],
        ['<code>f(x,y)</code> 的偏导', '<code>∂f/∂x</code>（把 y 当常数）', '多投入的边际产品']
      ], caption: '先把函数拆成基本块，再逐块求导，比硬背公式可靠' },
      { t: 'table', head: ['积分', '结果', '提示'], rows: [
        ['<code>∫ x<sup>n</sup> dx</code>', '<code>x<sup>n+1</sup>/(n+1) + C</code>', 'n ≠ −1'],
        ['<code>∫ (1/x) dx</code>', '<code>ln|x| + C</code>', '跨过 0 要分段'],
        ['<code>∫ e<sup>kx</sup> dx</code>', '<code>e<sup>kx</sup>/k + C</code>', 'k ≠ 0'],
        ['<code>∫<sub>a</sub><sup>b</sup> f</code>', '<code>F(b) − F(a)</code>', '定积分是面积，不是原函数'],
        ['<code>∫ u dv</code>', '<code>uv − ∫ v du</code>', '多项式乘指数/对数时用'],
        ['<code>∫<sub>0</sub><sup>∞</sup> e<sup>−rt</sup> dt</code>', '<code>1/r</code>', '永续年金的贴现因子']
      ], caption: '积分号内的常数因子可以先提到外面，换元后别忘了换上下限' }
    ] },
    { label: '解题模板', blocks: [
      { t: 'steps', items: [
        { title: '① 写清楚变量与目标', html: '谁是选择变量（Q、L、K），谁是被决定的目标（利润、效用、成本），参数有哪些。' },
        { title: '② 把约束写成等式', html: '预算 <code>p<sub>x</sub>x + p<sub>y</sub>y = m</code>，成本 <code>wL + rK = C</code>，资源上限写成 ≤ 并先按等号解。' },
        { title: '③ 构造拉格朗日函数', html: '<code>ℒ = f(x,y) + λ(m − p<sub>x</sub>x − p<sub>y</sub>y)</code>，λ 前符号与约束移项方向要一致。' },
        { title: '④ 解一阶条件并联立', html: '三个方程三个未知数，先消 λ 得相切条件，再回代预算线。' },
        { title: '⑤ 用二阶条件或经济含义校验', html: '效用最大化要求加边 Hessian 负定；成本最小化要求正定，否则可能是角点解。' }
      ] },
      { t: 'callout', kind: 'tip', title: '单变量最优的三步检查', html: '先求 <code>f′(x) = 0</code> 的驻点，再看 <code>f″(x)</code> 的符号，最后把闭区间端点一并代入比较——考试里丢分最多的就是漏掉端点。' }
    ] },
    { label: '易错清单', blocks: [
      { t: 'callout', kind: 'warn', title: '这些地方最容易翻车', html: '弹性是「点弹性」还是「弧弹性」、积分上下限有没有换、差分方程的下标从 0 还是 1 开始，三处写错都会让整题答案偏移。' },
      { t: 'table', head: ['常见错误', '正确做法', '后果'], rows: [
        ['把 <code>ln(x+y)</code> 拆成 <code>ln x + ln y</code>', '对数只对乘法拆分', '后续求导全错'],
        ['对 <code>x<sup>2</sup>y</code> 求 x 的偏导时把 y 也求导', '偏导时其他变量视为常数', '多出一项'],
        ['定积分换元后仍用原上下限', '换元同时换上下限', '面积算成负数或错值'],
        ['拉格朗日乘子符号随意取', '让 ℒ 中约束项与目标同向', 'λ 的经济含义反号'],
        ['差分方程解出 y* 就结束', '再验证 <code>|a| &lt; 1</code> 才收敛', '把发散当均衡'],
        ['闭区间最值只查驻点', '驻点、端点、不可导点三者比较', '漏掉最大值']
      ], caption: '考前把这张表过一遍，比再刷十道同型题更有效' }
    ] },
    { label: '经济模型', blocks: [
      { t: 'table', head: ['模型', '方程', '结论'], rows: [
        ['线性供需', '<code>Qd = 100 − 2P</code>，<code>Qs = 20 + 3P</code>', '<code>P* = 16</code>，<code>Q* = 68</code>'],
        ['从价税', '<code>Qs = 20 + 3(P − 2)</code>', '<code>P = 17.2</code>，<code>Q = 65.6</code>，税负买卖双方分担'],
        ['垄断定价', '<code>P = 100 − 2Q</code>，<code>C = 20Q</code>', '<code>MR = MC</code> 得 <code>Q = 20</code>，<code>P = 60</code>，<code>π = 800</code>'],
        ['Cobb-Douglas', '<code>Q = 10K<sup>0.3</sup>L<sup>0.7</sup></code>', '规模报酬不变，欧拉定理：产出按边际产品分配完'],
        ['消费者剩余', '<code>P = 8 − 2Q</code>，价格 2', '<code>CS = ∫<sub>0</sub><sup>3</sup>(6 − 2Q)dQ = 9</code>'],
        ['永续年金', '每年 1000，<code>r = 5%</code>', '<code>PV = 1000/0.05 = 20000</code>']
      ], caption: '同一组数字会在不同章节反复出现，串起来看就明白各章为什么这样排' },
      { t: 'keypoint', items: [
        { title: '均衡与最优是同一套语言', html: '供需均衡解方程，利润最大化解导数等于零，本质都是「让两个边际量相等」。' },
        { title: '动态模型只多问一句', html: '静态模型问「均衡在哪」，差分方程追问「从任意起点会不会走到那里」，答案取决于系数的绝对值。' }
      ] }
    ] }
  ]
};
