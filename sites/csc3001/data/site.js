/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'csc3001',
  short: 'CSC3001',
  name: '离散数学',
  en: 'Discrete Mathematics',
  dept: '计算机科学',
  lang: 'text',
  langLabel: '数学',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读 + 自测',
  bootHead: 'CSC3001 // DISCRETE LAB',
  bootLog: [
    '> mounting discrete partition ... CSC3001',
    '> indexing 8 chapters: logic, proof, sets, number theory',
    '> compiling induction, counting & graph engines ...',
    '> proof checker online. ready when you are.'
  ],

  /* 首页主视觉文案 */
  tagline: '把离散结构读成一张可走通的地图。',
  missionEn: 'CSC3001 · 8 MODULES',
  missionTitle: '从一条边开始<br><em>读懂离散世界</em>',
  lede: '从命题逻辑、证明方法到集合、数论、归纳、计数与图论，八章沿着「定义—例子—证明—计算」逐层推进。每章配有对比表、常见错误、可手算的例子与自检清单，读完能独立完成证明与计数题。',
  searchPlaceholder: 'QUERY // 搜索：归纳 · 容斥 · 欧拉回路 · 哈斯图 · 同余',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/CSC3001/',
  resources: {
    note: '收录 CSC3001 的讲义、作业、习题课与考试资料；文件名即原始文件，点击后用系统默认程序打开。',
    groups: [
      { name: '讲义与课件', note: '按章节顺序排列，先读对应讲义，再读本站正文与例子。', items: [
        { title: '命题逻辑（LN01）', path: '学习资料/CSC3001_LN_01_Propositional_logic.pdf', kind: 'pdf', note: '命题、联结词、真值表与逻辑等价' },
        { title: '证明方法（LN03）', path: '学习资料/CSC3001_LN_03_Methods_of_proofs.pdf', kind: 'pdf', note: '直接证明、逆否、反证与分情况' },
        { title: '数学归纳（LN04）', path: '学习资料/CSC3001_LN_04_1_Mathematical_induction.pdf', kind: 'pdf', note: '归纳法、强归纳与最小反例' },
        { title: '递归（LN05）', path: '学习资料/CSC3001_LN_05_Recursion.pdf', kind: 'pdf', note: '递归定义、递推关系与求解' },
        { title: '图论导引（LN08）', path: '学习资料/CSC3001_LN_08_Introduction_to_graphs.pdf', kind: 'pdf', note: '图的术语、连通性、树与生成树' },
        { title: '映射计数（LN12）', path: '学习资料/CSC3001_LN_12_Counting_by_mapping.pdf', kind: 'pdf', note: '用双射与映射把计数题变形' }
      ] },
      { name: '作业与习题', note: '先独立完成，再对照答案；把错题标回对应章节。', items: [
        { title: 'Assignment 01', path: '作业习题/CSC3001_Assignment_01.pdf', kind: 'pdf', note: '集合、逻辑与证明的综合练习' },
        { title: 'Assignment 01 解答', path: '作业习题/CSC3001_Assignment_01_Solution.pdf', kind: 'pdf', note: '官方参考解答与评分要点' },
        { title: '2024 Fall Tutorial 1', path: '作业习题/CSC3001_2024Fall_Tutorial1.pdf', kind: 'pdf', note: '逻辑与证明习题课材料' },
        { title: 'Tutorial 05（含解答）', path: '作业习题/CSC3001_Tutorial_05_With_Solution.pdf', kind: 'pdf', note: '归纳与递推专题，附完整解答' },
        { title: '2023 Fall 作业包', path: '作业习题/CSC3001_2023Fall_HW.zip', kind: 'zip', note: '整套作业与部分参考解答' }
      ] },
      { name: '考试与复习', note: '先限时模拟，再按答案归因；错题回到对应章节重读。', items: [
        { title: '2022 Final', path: '考试资料/CSC3001_2022_Final.pdf', kind: 'pdf', note: '期末真题，覆盖全学期' },
        { title: '2023 Midterm', path: '考试资料/CSC3001_2023_Midterm.pdf', kind: 'pdf', note: '期中真题，侧重逻辑、集合与数论' },
        { title: '2024 Midterm（含解答）', path: '考试资料/CSC3001_2024_Midterm_WithSolution.pdf', kind: 'pdf', note: '最新期中卷与逐题解答' },
        { title: 'Final Revision I', path: '考试资料/CSC3001_Final_revision_I.pdf', kind: 'pdf', note: '期末复习提纲与典型题' },
        { title: 'Final Paper Solution', path: '考试资料/CSC3001_Discrete_Mathematics_final_paper_Solution.pdf', kind: 'pdf', note: '期末卷参考解答，适合对答案' }
      ] }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '离散数学（Discrete Mathematics），CUHKSZ CSC3001'],
    ['来源', 'CUHKSZ CSC3001 课程讲义、作业与考试资料'],
    ['结构', '8 章正文 · 分章题库 · 模拟卷 · 实战项目 · 资料库'],
    ['建议', '先读第 0 章建立地图；证明与计数两章配合纸笔手算，图论章边画边读。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    { label: '核心定义', blocks: [
      { t: 'table', head: ['术语', '一句话定义', '最容易混的点'], rows: [
        ['重言式', '在所有赋值下都为真的命题公式', '和「可满足」不是一回事：可满足只要求有一组赋值成真'],
        ['等价关系', '自反、对称、传递的二元关系', '等价类构成划分；偏序不要求对称'],
        ['偏序', '自反、反对称、传递的二元关系', '允许不可比；全序要求任意两个元素可比'],
        ['单射 / 满射', '单射：不同输入给不同输出；满射：陪域每个元素都被取到', '有限集上单射与满射等价，无限集上不等价'],
        ['树', '连通且无回路的无向图', 'n 个顶点、n−1 条边只是等价刻画之一，需配合连通或无环'],
        ['生成树', '包含全部顶点、恰好 n−1 条边且连通的子图', '最小生成树优化总权，不是某点到其他点的最短路']
      ], caption: '考前五分钟扫一遍：先分清「定义要求什么」，再看反例' },
      { t: 'keypoint', items: [
        { title: '三个「反」字要分清', html: '逆命题交换前后件，否命题否定前后件，逆否命题既交换又否定；只有逆否与原命题等价。' },
        { title: '关系的四个性质', html: '自反看对角线，对称看转置，反对称看「双向只有自己」，传递看路径能否直接连边。' },
        { title: '图的连通分两层', html: '无向只说连通；有向分弱连通（忽略方向）与强连通（双向可达）。' }
      ] }
    ] },
    { label: '常用公式', blocks: [
      { t: 'table', head: ['名称', '公式', '适用条件'], rows: [
        ['容斥（两集合）', '|A∪B| = |A| + |B| − |A∩B|', '有限集，先加后减重复'] ,
        ['容斥（三集合）', '|A∪B∪C| = Σ|A| − Σ|A∩B| + |A∩B∩C|', '符号交替，别漏三交'] ,
        ['二项式定理', '(x+y)<sup>n</sup> = Σ<sub>k=0</sub><sup>n</sup> C(n,k) x<sup>k</sup> y<sup>n−k</sup>', 'n 为非负整数'] ,
        ['组合恒等式', 'C(n,k) = C(n,n−k)；C(n,k) = C(n−1,k−1) + C(n−1,k)', '第二个即帕斯卡公式'] ,
        ['握手引理', 'Σ<sub>v∈V</sub> deg(v) = 2|E|', '无向图；自环贡献 2 度'] ,
        ['树的边数', 'm = n − 1', '连通且无回路，或连通且 m = n−1'] ,
        ['凯莱公式', 'n 个带标号顶点的树共有 n<sup>n−2</sup> 棵', 'n ≥ 2，顶点有标号'] ,
        ['二阶递推', 'a<sub>n</sub> = c<sub>1</sub>a<sub>n−1</sub> + c<sub>2</sub>a<sub>n−2</sub>，特征方程 r<sup>2</sup> = c<sub>1</sub>r + c<sub>2</sub>', '相异根：a<sub>n</sub> = Ar<sub>1</sub><sup>n</sup> + Br<sub>2</sub><sup>n</sup>']
      ], caption: '套公式前先回答：对象有序吗？允许重复吗？边权非负吗？' },
      { t: 'callout', kind: 'tip', title: '公式的选择顺序', html: '计数题先判断「有序 / 无序」与「可重复 / 不可重复」，四象限对应 2<sup>n</sup>、n!、C(n+k−1,k)、C(n,k)；图论题先数度数，再判连通，最后才选算法。' }
    ] },
    { label: '答题模板', blocks: [
      { t: 'steps', items: [
        { title: '归纳证明模板', html: '写清 P(n)；基础步验证最小的 n；归纳步假设 P(k) 成立，用 P(k) 推出 P(k+1)，并标明哪一步用了归纳假设；最后点明结论对所有 n 成立。' },
        { title: '计数题模板', html: '先给对象编号，判断是否有序、是否允许重复；再用加法或乘法原理拆分；必要时用容斥去重；最后用小的 n 手算验证公式。' },
        { title: '图论判定模板', html: '先写顶点数、边数、度序列；欧拉回路看是否为偶度且连通；哈密顿先试 Dirac / Ore；最短路先看边权符号，再选算法。' }
      ] },
      { t: 'callout', kind: 'warn', title: '三个高频失分点', html: '归纳步不用归纳假设，只做代数变形；容斥漏掉三交或符号写反；把 Dijkstra 用在负权图上，或把 MST 当成最短路树。' }
    ] },
    { label: '易错清单', blocks: [
      { t: 'table', head: ['错误说法', '为什么错', '正确说法'], rows: [
        ['「n 个顶点 n−1 条边就是树」', '可能不连通且有回路，例如三角形加一个孤立点', '还要加上连通或无回路之一'],
        ['「哈密顿回路没有充分条件就是不存在」', 'Dirac / Ore 只是充分条件，不满足不代表不存在', '不满足时尝试构造，或用割点等给反例'],
        ['「Dijkstra 加负边也能跑」', '已确定顶点的距离可能被负边推翻', '含负边改用 Bellman-Ford'],
        ['「排列组合可以随便乘」', '乘之前要确认每一步的选择数不依赖前面的选择', '用乘法原理前先画决策树，检查分支数是否固定'],
        ['「A 推出 B 等价于 B 推出 A」', '逆命题与原命题不等价', '只有逆否命题与原命题等价']
      ], caption: '每一条都对应一个反例，记不住公式时先想反例' },
      { t: 'keypoint', items: [
        { title: '先问「有没有反例」', html: '全称命题先试 n = 1、n = 2、空集、孤立点、负权边这些边界，再动笔证明。' },
        { title: '答案要能被别人检查', html: '写清每一步用了哪条定义或定理，不跳步；计算题保留中间值，方便对答案。' }
      ] }
    ] }
  ]
};
