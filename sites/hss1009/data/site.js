/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'hss1009',
  short: 'HSS1009',
  name: '社会科学统计',
  en: 'Statistics for the Social Sciences',
  dept: '统计与数据科学',
  lang: 'text',
  langLabel: 'SPSS',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'HSS1009 // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... HSS1009',
    '> loading 8 modules ...',
    '> calibrating sampling distributions & quiz bank ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '把「有没有差异」变成一句能复核的话。',
  missionEn: 'HSS1009 · 8 MODULES · SPSS',
  missionTitle: '从零开始<br><em>社会科学统计 全掌握</em>',
  lede: '这门课不教你背公式，而是教你走完一条链：把模糊的疑问写成可检验的假设，选对检验方法，读懂 SPSS 的输出，再用一句含统计量、p 值、效应量与置信区间的话说清结论。8 章从测量尺度走到相关与回归，每章配术语表、对照表、自检清单与题库。',
  searchPlaceholder: 'QUERY // 搜索章节、术语、公式与题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录下的 HSS1009 文件夹，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/HSS1009/',
  resources: {
    note: '本课在课程目录中只有一本教材，因此资料库只登记这一条，不做凑数。它是 SPSS 操作与统计概念的主参考：菜单路径、输出解读与例题都可直接对照章节正文使用。',
    groups: [
      {
        name: '教材',
        note: '课程主教材，覆盖描述统计、抽样分布、假设检验、方差分析、相关与回归的完整链条；书中例题的 SPSS 截图与本站在线正文的菜单路径一一对应。',
        items: [
          { title: '教材：Understanding Statistics for the Social Sciences with IBM SPSS', path: '学习资料/HSS1009_Understanding_Statistics_for_the_Social_Sciences_with_IBM_SPSS.pdf', kind: 'pdf', note: '按章节顺序读：ch01–ch02 对应前几章的描述统计，ch03–ch05 对应抽样与检验，ch06–ch07 对应方差分析与相关回归。' }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '社会科学统计（Statistics for the Social Sciences，HSS1009）'],
    ['来源', 'CUHKSZ HSS1009 课程资料（教材 PDF）与 SPSS 操作实践'],
    ['结构', '8 章正文 · 56 题分章题库 · 模拟卷 A · 3 个实战项目 · 资料库'],
    ['建议', '先读第 0 章建立地图，再按 ch01→ch07 推进；每章的自检清单与内嵌题不要跳过，最后用模拟卷限时自测。']
  ],

  /* 速查表：概念、公式、SPSS 路径与答题模板（4 页） */
  cheat: [
    {
      label: '核心概念',
      blocks: [
        { t: 'p', html: '统计的全部工作可以压成一句话：<b>用样本里看得见的变异，去推测总体里看不见的参数，并说明这份推测有多不确定。</b>描述统计负责「看得见」，推断统计负责「有多不确定」。' },
        { t: 'table', caption: '八个概念的一句话版本', head: ['概念', '一句话', '最容易混的点'], rows: [
          ['总体 / 样本', '总体是想下结论的全部对象，样本是真正测到的那部分', '样本量再大，方便抽样也不能推断总体'],
          ['参数 / 统计量', '参数是总体的数（μ、σ），统计量是样本的数（x̄、s）', '希腊字母给总体，拉丁字母给样本'],
          ['测量尺度', '定类 / 定序 / 定距 / 定比，决定能算什么', '单题李克特严格说是定序'],
          ['标准误', '统计量在反复抽样中的抖动幅度', 'SD 描述个体，SE 描述均值'],
          ['置信区间', '围绕估计值给出的一个区间，长期覆盖率等于置信水平', '不是「μ 落在里面的概率」'],
          ['p 值', 'H<sub>0</sub> 为真时抽到当前或更极端结果的概率', '不是「H<sub>0</sub> 为真的概率」'],
          ['效应量', '差异或关联有多大，与样本量无关', 'p 小不等于效应大'],
          ['统计功效', '真实存在差异时，检验能检出它的概率（1 − β）', '样本小、效应小、α 严 → 功效低']
        ] },
        { t: 'callout', kind: 'warn', title: '三个必须改掉的说法', html: '「p &lt; .05 证明有差异」→ 只能说「在 α = .05 下拒绝 H<sub>0</sub>」；「不显著说明没有差异」→ 只能说「未检出差异，可能是功效不足」；「相关显著说明有因果」→ 只能说明关联，因果要靠随机分配。' }
      ]
    },
    {
      label: '公式与判据',
      blocks: [
        { t: 'p', html: '所有检验都是同一个骨架：<code>统计量 =（观测到的差异）÷（该差异的标准误）</code>。差别只在于「差异」和「标准误」怎么算，以及对照哪条分布查临界值。' },
        { t: 'table', caption: '核心公式（n 为样本量，k 为组数，N 为总人数）', head: ['名称', '公式', '要点'], rows: [
          ['均值', 'x̄ = Σx / n', '对极端值敏感'],
          ['样本方差', 's<sup>2</sup> = SS / (n − 1)，SS = Σ(x − x̄)<sup>2</sup>', '除 n−1 才是无偏'],
          ['z 分数', 'z = (x − x̄) / s', '跨量表比较的通用尺'],
          ['标准误（均值）', 'SE = s / √n', 'n 变 4 倍，SE 减半'],
          ['置信区间', 'x̄ ± z × SE（σ 已知）或 x̄ ± t × SE', '99% 用 2.576，95% 用 1.960'],
          ['单样本 t', 't = (x̄ − μ<sub>0</sub>) / (s/√n)，df = n − 1', 'μ<sub>0</sub> 必须来自外部'],
          ['独立样本 t', 't = (x̄<sub>1</sub> − x̄<sub>2</sub>) / [s<sub>p</sub>√(1/n<sub>1</sub> + 1/n<sub>2</sub>)]，df = n<sub>1</sub>+n<sub>2</sub>−2', '先看 Levene 决定读哪行'],
          ['配对样本 t', 't = d̄ / (s<sub>d</sub>/√n)，df = 对数 − 1', '把每对相减，再当单样本做'],
          ['Cohen’s d', 'd = (x̄<sub>1</sub> − x̄<sub>2</sub>) / s<sub>p</sub>', '0.2 小 / 0.5 中 / 0.8 大'],
          ['单因素 F', 'F = MS<sub>组间</sub> / MS<sub>组内</sub>，df = (k−1, N−k)', 'SS<sub>总</sub> = SS<sub>组间</sub> + SS<sub>组内</sub>'],
          ['η²', 'η² = SS<sub>组间</sub> / SS<sub>总</sub>', '小样本偏大，可用 ω²'],
          ['Pearson r', 'r = Σ(z<sub>x</sub>z<sub>y</sub>)/(n−1)，r<sup>2</sup> 为解释比例', '只测线性关系'],
          ['回归斜率', 'b = r × (s<sub>y</sub>/s<sub>x</sub>)，a = ȳ − b x̄', 'b 有单位，β 无量纲'],
          ['卡方', 'χ<sup>2</sup> = Σ (O − E)<sup>2</sup>/E，E = 行合计×列合计/总数', '期望频数 ≥ 5 才好用']
        ] },
        { t: 'table', caption: '临门一脚：α 与临界值（双侧）', head: ['α', 'z 临界值', 't 临界值（df = 35）', '判断'], rows: [
          ['.10', '±1.645', '±1.690', '宽松，探索性研究'],
          ['.05', '±1.960', '±2.030', '惯例门槛'],
          ['.01', '±2.576', '±2.724', '严格，多重比较时用']
        ] },
        { t: 'p', html: '自由度的记法：<b>单样本 t</b> n−1；<b>独立样本 t</b> n<sub>1</sub>+n<sub>2</sub>−2（Welch 为小数）；<b>配对 t</b> 对数−1；<b>方差分析</b> (k−1, N−k)；<b>卡方独立性</b> (行数−1)(列数−1)；<b>相关</b> n−2。' }
      ]
    },
    {
      label: 'SPSS 路径',
      blocks: [
        { t: 'p', html: '菜单按「你要回答的问题」组织：先描述，再比较，最后看关系。<b>Analyze</b> 下三块最常用：Descriptive Statistics（描述）、Compare Means（均值比较）、Correlate / Regression（关系）。' },
        { t: 'table', caption: '按任务查菜单（Analyze 菜单）', head: ['任务', '路径', '要勾的选项'], rows: [
          ['频数与百分比', 'Descriptive Statistics &gt; Frequencies', 'Display frequency tables；Charts 选 Bar'],
          ['均值、标准差、偏度', 'Descriptive Statistics &gt; Descriptives', 'Mean / Std. deviation / Min / Max'],
          ['箱线图、极端值、正态性检验', 'Descriptive Statistics &gt; Explore', 'Plots 勾 Histogram + Boxplots；Statistics 勾 Outliers'],
          ['分类变量分组', 'Transform &gt; Visual Binning', '设 Cut points 后生成新变量'],
          ['单样本 t', 'Compare Means &gt; One-Sample T Test', 'Test Value 填 μ<sub>0</sub>'],
          ['独立样本 t', 'Compare Means &gt; Independent-Samples T Test', 'Grouping Variable 用 Define Groups 指定两个编码'],
          ['配对样本 t', 'Compare Means &gt; Paired-Samples T Test', '把前后测两列配成一对'],
          ['单因素方差分析', 'Compare Means &gt; One-Way ANOVA', 'Options 勾 Homogeneity of variance test；Post Hoc 选 Tukey'],
          ['相关矩阵', 'Correlate &gt; Bivariate', 'Pearson 或 Spearman；勾 Two-tailed'],
          ['一元/多元回归', 'Regression &gt; Linear', 'Statistics 勾 Estimates、Model fit；Plots 画残差'],
          ['列联表与卡方', 'Descriptive Statistics &gt; Crosstabs', 'Statistics 勾 Chi-square、Phi and Cramer’s V'],
          ['量表信度', 'Scale &gt; Reliability Analysis', 'Statistics 勾 Scale if item deleted']
        ] },
        { t: 'callout', kind: 'note', title: '读输出的固定顺序（照这个顺序不会乱）', html: '① 先看样本量与缺失（N）→ ② 看前提检验（Levene / 正态性）决定读哪一行 → ③ 看检验统计量与自由度 → ④ 看 Sig.（p 值）→ ⑤ 回到数据算效应量 → ⑥ 写结论句。跳过②直接看 p，是绝大多数误读的来源。' }
      ]
    },
    {
      label: '答题模板',
      blocks: [
        { t: 'p', html: '统计题的分数在「过程与表述」，不在最终数字。写答案时按下面的模板铺开，即使算错也能拿到方法与判断的分。' },
        { t: 'steps', caption: '一道检验题的标准六步', items: [
          { title: '① 定设计与尺度', html: '写清几组、是否同一批人、变量是连续还是分类、分析单位是什么。' },
          { title: '② 写 H<sub>0</sub> / H<sub>1</sub>', html: 'H<sub>0</sub> 写等式且针对总体参数；方向性主张进 H<sub>1</sub>，并注明单/双尾。' },
          { title: '③ 查前提、选方法', html: '独立/配对、两组/多组、是否方差齐、期望频数是否够大，逐条说明。' },
          { title: '④ 算统计量', html: '写公式、代入具体数字、给自由度；中间结果保留两位小数。' },
          { title: '⑤ 比 α 下判断', html: 'p 与事先设定的 α 比较，写出「拒绝/不拒绝 H<sub>0</sub>」，不要写「接受」。' },
          { title: '⑥ 报效应量与区间', html: 'd / η² / r² / V 一项，配差值或系数的 95% CI，再写方向与局限。' }
        ] },
        { t: 'table', caption: '结论句模板（把括号里的数字替换掉）', head: ['场景', '模板'], rows: [
          ['单样本 t', '样本均值（M = __, SD = __）与 __ 相比差异显著，t(__) = __，p = __，d = __。'],
          ['独立样本 t', '__ 组（M = __, SD = __）显著高于 __ 组（M = __, SD = __），t(__) = __，p = __，d = __，差值 95% CI [__, __]。'],
          ['配对 t', '前后测差异显著，t(__) = __，p = __，平均提升 __（95% CI [__, __]），d<sub>z</sub> = __。'],
          ['方差分析', '三组均值差异显著，F(__, __) = __，p = __，η² = __；Tukey 事后比较显示 __ 组显著高于 __ 组。'],
          ['相关', '两变量呈 __ 相关，r(__) = __，p = __，r<sup>2</sup> = __（解释 __% 的变异）。'],
          ['卡方', '两变量存在显著关联，χ²(__) = __，p = __，Cramér’s V = __；__ 的 __ 率高于 __。'],
          ['不显著', '未检出显著差异，t(__) = __，p = __，但差值 95% CI [__, __] 提示真实差异可能达到 __，功效不足，需扩大样本。']
        ] },
        { t: 'table', caption: '评分点自查（丢分最多的五处）', head: ['常见错误', '正确做法'], rows: [
          ['p 值写成 0.050、p = .000', '写 .05；p &lt; .001'],
          ['只写「显著」或「不显著」', '补齐统计量、df、p、效应量、方向'],
          ['把不显著写成「无差异」', '写「未检出差异」并给区间与功效'],
          ['Levene 显著却读第一行', '读 Equal variances not assumed'],
          ['用 r 的绝对值直接当强度、忘了平方', '报 r 与 r<sup>2</sup>，说明解释比例']
        ] },
        { t: 'callout', kind: 'warn', title: '最后 30 秒检查', html: '① 每个 p 值都有对照的 α 吗？② 每个「显著」后面都有效应量吗？③ 每个结论的主语是总体而不是样本吗？④ 有没有把相关写成因果？⑤ 数字与单位是否一致（小时 / 分 / 元）？' }
      ]
    }
  ]
};
