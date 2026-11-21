/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'psy1020',
  short: 'PSY1020',
  name: '心理学统计方法',
  en: 'Statistical Methods for Psychology',
  dept: '心理学与社科',
  lang: 'text',
  langLabel: '统计',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'PSY1020 // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... PSY1020',
    '> loading 8 modules ...',
    '> calibrating distributions & quiz bank ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '从一堆分数，到一句站得住的结论。',
  missionEn: 'PSY1020 · 8 MODULES · 56 PRACTICE ITEMS',
  missionTitle: '从零开始<br><em>心理学统计方法 全掌握</em>',
  lede: '统计不是公式集合，而是一条从数据到结论的推理链：先把分数说清楚，再理解抽样波动，然后用假设检验、t、ANOVA、相关与回归回答具体问题，最后按规范把结果写出来。每章配术语表、对照表、自检清单与题库，另有模拟卷与三个可动手的数据项目。',
  searchPlaceholder: 'QUERY // 搜索章节、术语、公式与题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录下的 PSY1020 文件夹，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/PSY1020/',
  resources: {
    note: '本课程公开资料目前只包含一本指定教材 PDF，因此资料库仅设一组；建议按章节顺序阅读，配合本站的术语表与自检清单使用。课程讲义、作业与真题未在公开目录中提供，如有更新可再补充。',
    groups: [
      {
        name: '教材',
        note: '课程指定教材，覆盖描述统计、概率、假设检验、t、ANOVA、相关回归、卡方与非参数。',
        items: [
          { title: '《Statistical Methods for Psychology》课程教材', path: '学习资料/PSY1020_Statistical_methods_for_psychology.pdf', kind: 'pdf', note: '本课唯一公开教材；按 ch01–ch07 的主题对应阅读，公式推导可跳读，重点看例题与假设检查。' }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '心理学统计方法（Statistical Methods for Psychology，PSY1020），8 章'],
    ['来源', 'CUHKSZ PSY1020 课程资料：指定教材 PDF；章节内容依据教材与 APA 第 7 版整理'],
    ['结构', '8 章正文 · 56 题分章题库 · 模拟卷 A（12 题 / 100 分）· 3 个实战项目 · 资料库'],
    ['建议', '先读第 0 章建立地图，再按 ch01→ch07 推进；每章先看例子与表格，再做内嵌题与自检清单。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    {
      label: '描述与分布',
      blocks: [
        { t: 'p', html: '描述统计只回答「这份数据长什么样」，不对外推下结论。选指标前先确认<b>测量尺度</b>与<b>分布形状</b>：严重偏态时均值会被极端值拉走，应同时给中位数。' },
        { t: 'table', caption: '常用描述统计量与公式', head: ['指标', '公式 / 做法', '什么时候用'], rows: [
          ['均值 M', 'ΣX / n', '分布大致对称、需要利用全部信息'],
          ['中位数 Md', '排序后中间位置的值', '偏态、有极端值、顺序数据'],
          ['标准差 SD', '√[Σ(X − M)² / (n − 1)]', '描述个体差异，与原始分同单位'],
          ['四分位距 IQR', 'Q₃ − Q₁', '偏态分布，配合箱线图识别异常值'],
          ['z 分数', '(X − M) / SD', '跨量表比较、判断相对位置'],
          ['偏度', 'z 分数的三阶矩', '绝对值 &gt; 1 提示明显偏态']
        ] }
      ]
    },
    {
      label: '抽样与检验',
      blocks: [
        { t: 'p', html: '推断的核心是<b>抽样分布</b>：样本均值本身也是随机变量，其标准差叫标准误。所有 t、F、χ² 检验都在比较「观察到的差异」与「随机波动能解释多少」。' },
        { t: 'table', caption: '推断常用公式与自由度', head: ['量', '公式', '自由度 / 备注'], rows: [
          ['标准误（均值）', 'SE = SD / √n', 'n 越大，估计越稳'],
          ['单样本 t', 't = (M − μ₀) / SE', 'df = n − 1'],
          ['独立样本 t', 't = (M₁ − M₂) / SE<sub>diff</sub>', 'df = n₁ + n₂ − 2（方差齐性）'],
          ['配对 t', 't = M<sub>diff</sub> / SE<sub>diff</sub>', 'df = n − 1（对子数）'],
          ['95% CI（均值）', 'M ± t<sub>crit</sub> × SE', 't<sub>crit</sub> 由 df 与 α 决定'],
          ['Cohen\'s d', '(M₁ − M₂) / SD<sub>pooled</sub>', '0.2 小、0.5 中、0.8 大'],
          ['F 比值', 'MS<sub>between</sub> / MS<sub>within</sub>', 'df = (k − 1, N − k)'],
          ['η²', 'SS<sub>between</sub> / SS<sub>total</sub>', '.01 小、.06 中、.14 大']
        ] }
      ]
    },
    {
      label: '检验选择',
      blocks: [
        { t: 'p', html: '选检验按三步走：<b>因变量类型 → 组数与设计 → 假设是否满足</b>。先定这三件事，再打开软件；不要看结果不显著就换一个检验重跑。' },
        { t: 'table', caption: '常见研究问题与对应检验', head: ['研究问题', '检验', '关键假设 / 备注'], rows: [
          ['一组连续分数 vs 已知常模', '单样本 t', '近似正态；小样本偏态用 Wilcoxon'],
          ['两组独立、连续因变量', '独立样本 t', '方差齐性；不齐用 Welch'],
          ['同一批人前后两次', '配对 t', '差值近似正态'],
          ['三组以上独立', '单因素 ANOVA', '方差齐性；显著后做事后检验'],
          ['同一批人三个时间点', '重复测量 ANOVA', '球形假设；违反用 GG 校正'],
          ['两个分类变量的关联', '卡方独立性检验', '期望频数 ≥ 5'],
          ['两个连续变量的关系', 'Pearson 相关 / 回归', '线性、无极端值'],
          ['顺序数据或小样本偏态', 'Mann–Whitney / Kruskal–Wallis', '比较分布位置，不报均值差']
        ] }
      ]
    },
    {
      label: '报告速查',
      blocks: [
        { t: 'p', html: 'APA 结果段的结构是<b>描述 → 检验 → 解释</b>。统计符号斜体，p 值三位小数，效应量与 95% CI 不是可选项。写作时避免「证明」「导致」这类过强的词。' },
        { t: 'table', caption: '常见统计量的 APA 写法', head: ['分析', '模板', '示例'], rows: [
          ['t 检验', '<i>t</i>(df) = …，<i>p</i> = …，<i>d</i> = …，95% CI […]', '<i>t</i>(38) = 2.31，<i>p</i> = .027，<i>d</i> = 0.72'],
          ['ANOVA', '<i>F</i>(df₁, df₂) = …，<i>p</i> = …，η² = …', '<i>F</i>(2, 57) = 4.82，<i>p</i> = .012，η² = .14'],
          ['相关', '<i>r</i>(df) = …，<i>p</i> = …，95% CI […]', '<i>r</i>(118) = −.34，<i>p</i> &lt; .001'],
          ['卡方', '<i>χ²</i>(df, <i>N</i> = …) = …，<i>p</i> = …，φ = …', '<i>χ²</i>(1, <i>N</i> = 170) = 9.84，<i>p</i> = .002，φ = .24'],
          ['p 值边界', '小于 .001 写 <i>p</i> &lt; .001', '不能写 <i>p</i> = .000']
        ] }
      ]
    }
  ]
};
