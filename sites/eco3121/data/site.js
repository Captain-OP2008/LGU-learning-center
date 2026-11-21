/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'eco3121',
  short: 'ECO3121',
  name: '计量经济学',
  en: 'Econometrics',
  dept: '经济与金融',
  lang: 'text',
  langLabel: '计量',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'ECO3121 // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... ECO3121',
    '> loading 8 modules ...',
    '> calibrating glossary & quiz bank ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '先问「这条系数能不能当因果」，再问「它有多大」。',
  missionEn: 'ECO3121 · 8 MODULES',
  missionTitle: '从一条回归线<br><em>走到因果推断</em>',
  lede: '八章按「描述 → 估计 → 推断 → 设定 → 时间 → 因果」推进：每章有概念、可手算的例子、对照表、常见错误与自检清单，配分章题库、一套模拟卷与三个可复现的实战项目。读完你应该能独立读一张回归表，并说清它的结论能走多远。',
  searchPlaceholder: 'QUERY // 搜索章节、术语与题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/ECO3121/',
  resources: {
    note: '本站点只链接课程目录中真实存在的三份文件：两份带解答的历年卷与一本教材。建议先读教材对应章节，再用历年卷做阶段自测；题目与解答在同一份 PDF 里，做的时候先遮住解答部分。',
    groups: [
      {
        name: '考试资料',
        note: '两份官方卷，均含解答。建议在期中、期末复习前各完整做一遍，限时完成后再对答案。',
        items: [
          { title: '2021 Final（含解答）', path: '考试资料/ECO3121_2021_Final_WithSolution.pdf', kind: 'PDF', note: '期末卷，覆盖全书；ch05–ch07 的题目集中在这里，适合检验识别策略与时间序列部分。' },
          { title: '2021 Midterm（含解答）', path: '考试资料/ECO3121_2021_Midterm_WithSolution.pdf', kind: 'PDF', note: '期中卷，覆盖 ch01–ch04；用来检查简单回归、多元推断与函数形式的掌握程度。' }
        ]
      },
      {
        name: '教材',
        note: '主教材为 Wooldridge 第 6 版。本站章节号与该书章节一一对应，读到不懂的地方直接翻原书对应小节。',
        items: [
          { title: 'Introductory Econometrics: A Modern Approach (6th ed.)', path: '学习资料/ECO3121_Introductory_Econometrics_A_Modern_Approach_6th_Edition.pdf', kind: 'PDF', note: '主教材全本。第 1–2 章对应 ch01，第 3 章对应 ch02，第 4–5 章对应 ch03，第 6–7 章对应 ch04，第 8–9 章对应 ch05，第 10–12 章对应 ch06，第 13–15 章对应 ch07。' },
          { title: '教材章节对照与阅读顺序', path: '学习资料/ECO3121_Introductory_Econometrics_A_Modern_Approach_6th_Edition.pdf', kind: 'PDF', note: '同一本教材的阅读指南：先读每章开头的例题与「Key Terms」，再读正文推导；习题只做带数据的那几道，其余留作复习。' }
        ]
      },
      {
        name: '阶段自测',
        note: '把两份卷子当作两个检查点，而不是「最后才做」的模拟题。',
        items: [
          { title: '期中前自测：ch01–ch04', path: '考试资料/ECO3121_2021_Midterm_WithSolution.pdf', kind: 'PDF', note: '学完 ch04 后限时 90 分钟完成，重点看「系数解释」与「假设检验」两类题的错误模式。' },
          { title: '期末前自测：ch05–ch07', path: '考试资料/ECO3121_2021_Final_WithSolution.pdf', kind: 'PDF', note: '学完 ch07 后限时 120 分钟完成，重点看异方差、序列相关与 IV 的论述题能否写出「假设—后果—修正」三段。' }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '计量经济学（Econometrics）· CUHKSZ ECO3121'],
    ['内容', '8 章正文 · 56 道分章题 · 1 套 100 分模拟卷 · 3 个实战项目 · 3 页速查表'],
    ['教材', 'Wooldridge, Introductory Econometrics: A Modern Approach, 6th ed.'],
    ['建议', '先读第 0 章建立地图；每章按「正文 → 手算例子 → 自检清单 → 题库」推进，学完 ch04 与 ch07 各做一次限时自测。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    {
      label: '系数怎么读',
      blocks: [
        { t: 'p', html: '同一个 β̂，因变量与自变量的形式不同，读法完全不同。先看「谁取了对数」，再决定是说「单位」「百分比」还是「弹性」。' },
        { t: 'table', caption: '四种函数形式的系数读法', head: ['模型', '形式', 'β̂ 的读法'], rows: [
          ['线性-线性', 'y = β<sub>0</sub> + β<sub>1</sub>x', 'x 增 1 单位，y 平均变 β̂<sub>1</sub> 单位'],
          ['对数-线性', 'log(y) = β<sub>0</sub> + β<sub>1</sub>x', 'x 增 1 单位，y 平均变 100β̂<sub>1</sub>%（半弹性）'],
          ['线性-对数', 'y = β<sub>0</sub> + β<sub>1</sub>log(x)', 'x 增 1%，y 平均变 β̂<sub>1</sub>/100 单位'],
          ['对数-对数', 'log(y) = β<sub>0</sub> + β<sub>1</sub>log(x)', 'x 增 1%，y 平均变 β̂<sub>1</sub>%（弹性）']
        ] },
        { t: 'p', html: '含二次项时，边际效应是 <code>β<sub>1</sub> + 2β<sub>2</sub>x</code>，必须指定 x 的位置；转折点在 <code>−β<sub>1</sub>/(2β<sub>2</sub>)</code>。含交互项时，x<sub>1</sub> 的边际效应是 <code>β<sub>1</sub> + β<sub>3</sub>x<sub>2</sub></code>，随 x<sub>2</sub> 变化。' },
        { t: 'callout', kind: 'tip', title: '一个防错习惯', html: '写完系数解释后，把「增加一单位」换成具体的量（多读一年书、多一个房间），再读一遍。如果句子在经济上说不通，多半是单位或对数读错了。' }
      ]
    },
    {
      label: '诊断与修正',
      blocks: [
        { t: 'p', html: '拿到一张回归表，按「设定 → 异方差 → 序列相关 → 共线性」的顺序做四项检查。每项都问：它影响系数，还是只影响标准误？' },
        { t: 'table', caption: '四类问题的诊断与修正', head: ['问题', '诊断', '影响', '修正'], rows: [
          ['异方差', '残差图、BP、White', '系数无偏、标准误错', 'HC 稳健标准误或 WLS'],
          ['序列相关', 'BG 检验、DW（辅助）', '系数无偏、标准误严重低估', 'HAC（Newey–West）标准误'],
          ['多重共线性', 'VIF、R<sub>j</sub><sup>2</sup>', '系数无偏、标准误膨胀', '删变量、加样本、合并变量'],
          ['函数形式误设', 'RESET、残差图', '系数有偏', '加二次项/交互项/换函数形式']
        ] },
        { t: 'p', html: '记忆口诀：<b>异方差与序列相关改「精度」，函数形式误设改「靶心」，共线性只让「靶心模糊」</b>。所以前者用稳健标准误，后者要重新设定模型，共线性则要看你的研究问题是否允许合并变量。' }
      ]
    },
    {
      label: '面板与 IV',
      blocks: [
        { t: 'p', html: '面板与工具变量是两条从「相关」走向「因果」的路。前者靠「自己跟自己比」消掉不随时间变化的因素，后者靠「外生变异」过滤掉内生部分。' },
        { t: 'table', caption: '面板三方法与 IV 两条件', head: ['工具', '核心操作', '关键假设', '代价'], rows: [
          ['固定效应 FE', '减去个体均值', 'u<sub>it</sub> 与 x 严格外生', '估不了不随时间变化的变量'],
          ['一阶差分 FD', '减去上一期', '同期外生（更弱）', '丢一期，T 小时效率低'],
          ['随机效应 RE', 'GLS 加权', 'a<sub>i</sub> 与 x 不相关', '假设不成立时有偏'],
          ['工具变量 IV', 'Cov(z,y)/Cov(z,x)', '相关 + 排他性', '方差大、估的是 LATE'],
          ['2SLS', '两阶段回归', '同上，工具数 ≥ 内生变量数', '弱工具时偏误放大']
        ] },
        { t: 'p', html: '三个必须记住的数字与规则：<b>第一阶段 F &gt; 10</b> 才算工具不弱；<b>Hausman 拒绝就用 FE</b>；<b>聚类层级要匹配处理分配层级</b>，组数少于 30–50 时要修正。' },
        { t: 'callout', kind: 'warn', title: '最容易被问倒的一句话', html: '「你的排他性约束怎么检验？」正确答案是：<b>无法直接检验，只能论证</b>。能说的是制度背景、安慰剂检验与过度识别检验的间接证据。答「跑个回归就检验了」会被扣分。' }
      ]
    }
  ]
};
