/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'fin2010',
  short: 'FIN2010',
  name: '公司金融',
  en: 'Corporate Finance',
  dept: '经济与管理学院',
  lang: 'text',
  langLabel: '金融',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'FIN2010 // VALUATION DESK',
  bootLog: [
    '> mounting course partition ... FIN2010',
    '> loading 8 modules ...',
    '> calibrating cash-flow ledger & quiz bank ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '把未来的现金流，折成今天能比较的一个数。',
  missionEn: 'FIN2010 · 8 MODULES · 14 WEEKS',
  missionTitle: '从现金流到价值<br><em>公司金融全掌握</em>',
  lede: '公司金融只回答一个问题：这笔钱今天投出去，未来能不能收回更多。围绕它，本课从报表与现金流出发，经货币时间价值、证券估值、资本预算，走到风险、资本成本与资本结构。每章配术语表、对照表、自检清单与题库，公式都带算例。',
  searchPlaceholder: 'QUERY // 搜索章节、公式、术语与题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录下的 FIN2010 文件夹，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/FIN2010/',
  resources: {
    note: '以下 4 个文件均为 CUHKSZ FIN2010 的真实课程资料，按「教材与参考书—复习与考试」两组排列。中文教材适合先建立直觉，Brealey 与 Van Horne 适合查推导与案例，期中复习资料用于考前自测。',
    groups: [
      {
        name: '教材与参考书',
        note: '两本教材覆盖同一套主题、写法不同：中文版删去了部分推导，英文原版例题更完整。建议以一本为主，卡住时换另一本看同一概念。',
        items: [
          { title: '《财务管理基础》第 13 版（中文版）', path: '学习资料/FIN2010_财务管理基础_第13版_中文版.pdf', kind: 'pdf', note: '中文主教材，术语与课堂讲义一致，适合第一遍建立框架。' },
          { title: 'Brealey, Myers & Allen《Fundamentals of Corporate Finance》第 10 版', path: '学习资料/FIN2010_Fundamentals_of_Corporate_Finance_10th_Edition.pdf', kind: 'pdf', note: '英文主教材，NPV 与估值的例题最贴近考试风格。' }
        ]
      },
      {
        name: '复习与考试',
        note: '考前先用复习资料过一遍范围，再用 Van Horne 的章节习题补薄弱点；两本书的符号体系略有差异，做题时注意统一。',
        items: [
          { title: 'FIN2010 期中复习资料', path: '考试资料/FIN2010_期中复习资料.pdf', kind: 'pdf', note: '期中范围、公式清单与典型题型，考前一周边做边对答案。' },
          { title: 'Van Horne & Wachowicz《Fundamentals of Financial Management》第 13 版', path: '学习资料/FIN2010_James_C_Van_Horne_John_M_Wachowicz_Fundamentals_of_Financial_Management_13th_Edition_Pearson_Education_Limited_2008.pdf', kind: 'pdf', note: '参考教材，资本结构与营运资本章节的案例更偏实务。' }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '公司金融（Corporate Finance，FIN2010），CUHKSZ 经济与管理学院'],
    ['来源', 'CUHKSZ FIN2010 课程资料：中文教材、Brealey 第 10 版、Van Horne 第 13 版与期中复习资料'],
    ['结构', '8 章正文 · 56 题分章题库 · 模拟卷 A · 3 个实战项目 · 资料库'],
    ['建议', '先读第 0 章建立地图，再按 ch01→ch07 推进；每章结尾的自检清单与内嵌题不要跳过。']
  ],

  /* 速查表：公式与口径速查（4 页） */
  cheat: [
    {
      label: '时间价值与估值',
      blocks: [
        { t: 'p', html: '折现的唯一原则：<b>现金流与折现率必须同口径</b>——名义现金流配名义利率，月现金流配月利率，税后现金流配税后折现率。几乎所有计算错误都源于口径错配。' },
        { t: 'table', caption: '时间价值核心公式', head: ['名称', '公式', '要点'], rows: [
          ['终值 / 现值', 'FV = PV(1 + r)<sup>n</sup>；PV = FV/(1 + r)<sup>n</sup>', 'n 与 r 的时间单位必须一致'],
          ['有效年利率', 'EAR = (1 + APR/m)<sup>m</sup> − 1', 'm 为每年复利次数'],
          ['永续年金', 'PV = C/r', '分子是每期固定现金流'],
          ['增长永续年金', 'PV = C<sub>1</sub>/(r − g)', '分子必须是下一期；g &lt; r'],
          ['年金现值', 'PV = C × [1 − 1/(1 + r)<sup>n</sup>]/r', '房贷、租金、债券票息'],
          ['年金终值', 'FV = C × [(1 + r)<sup>n</sup> − 1]/r', '定期定额储蓄'],
          ['实际利率（费雪）', '(1 + r<sub>nom</sub>)/(1 + π) − 1', '近似为 r<sub>nom</sub> − π']
        ] },
        { t: 'table', caption: '债券与股票定价', head: ['对象', '公式', '关键判断'], rows: [
          ['债券价格', 'P = Σ C/(1 + y)<sup>t</sup> + F/(1 + y)<sup>n</sup>', '价格与 YTM 反向'],
          ['溢价 / 折价', '票息 &gt; YTM 溢价；票息 &lt; YTM 折价', '等于面值时两者相等'],
          ['久期', 'D = Σ t × PV(CF<sub>t</sub>)/P', '期限越长、票息越低，D 越大'],
          ['股利折现（固定增长）', 'P<sub>0</sub> = D<sub>1</sub>/(r − g)', 'D<sub>1</sub> = D<sub>0</sub>(1 + g)'],
          ['PVGO', 'P<sub>0</sub> = E<sub>1</sub>/r + PVGO', 'ROE &gt; r 时 PVGO 为正'],
          ['P/E', 'P<sub>0</sub>/E<sub>1</sub> = 支付率/(r − g)', 'g 越高、r 越低，倍数越高']
        ] }
      ]
    },
    {
      label: '报表与现金流',
      blocks: [
        { t: 'p', html: '现金流量表把利润翻译成现金：<b>CFO 用间接法</b>（净利润 + 非现金项目 ± 营运资本变动），<b>投资与筹资活动</b>单列。估值要的是自由现金流，不是会计利润。' },
        { t: 'table', caption: '现金流三条链', head: ['指标', '公式', '归属'], rows: [
          ['CFO', '净利润 + 折旧摊销 − 营运资本增加', '经营活动'],
          ['FCFF', 'EBIT(1 − t) + 折旧 − 资本支出 − 营运资本增加', '股东 + 债权人'],
          ['FCFF（另一路径）', 'CFO + 利息(1 − t) − 资本支出', '与上式等价'],
          ['FCFE', 'FCFF − 利息(1 − t) + 净借款', '仅股东'],
          ['NOPAT', 'EBIT × (1 − t)', '付息前、税后']
        ] },
        { t: 'table', caption: '常用比率与杜邦分解', head: ['比率', '公式', '看什么'], rows: [
          ['流动比率', '流动资产/流动负债', '短期偿债能力'],
          ['速动比率', '(流动资产 − 存货)/流动负债', '剔除存货后的偿债能力'],
          ['资产负债率', '总负债/总资产', '财务杠杆'],
          ['ROE', '净利润/权益', '股东回报'],
          ['杜邦分解', '净利率 × 总资产周转率 × 权益乘数', 'ROE 的来源'],
          ['利息保障倍数', 'EBIT/利息', '偿债安全边际']
        ] }
      ]
    },
    {
      label: '资本预算',
      blocks: [
        { t: 'p', html: '资本预算只算<b>增量</b>现金流：忽略沉没成本、计入机会成本、剔除分摊费用、不扣利息（利息在折现率里）。三条原则记牢，一半的题就不会错。' },
        { t: 'table', caption: '四个决策准则', head: ['准则', '接受条件', '主要缺陷'], rows: [
          ['NPV', 'NPV &gt; 0', '需要准确的折现率'],
          ['IRR', 'IRR &gt; r', '非传统现金流可能多解；互斥项目可能误判'],
          ['PI', 'PI &gt; 1', '互斥项目偏向小项目'],
          ['回收期', '短于门槛', '忽略时间价值与回收期后现金流']
        ] },
        { t: 'table', caption: '经营现金流与税盾', head: ['项目', '公式', '备注'], rows: [
          ['OCF（自下而上）', '净利润 + 折旧', '无利息时适用'],
          ['OCF（自上而下）', '收入 − 付现成本 − 税', '税已含折旧抵税'],
          ['OCF（税盾法）', '(收入 − 付现成本)(1 − t) + 折旧 × t', '最常用'],
          ['折旧税盾', '折旧 × t', '折旧本身不是现金流'],
          ['期末现金流', '残值 + 营运资本回收 − 处置税', '残值高于账面时需交税']
        ] }
      ]
    },
    {
      label: '风险与资本成本',
      blocks: [
        { t: 'p', html: '风险分两类：<b>非系统风险</b>可以分散掉、市场不给溢价；<b>系统风险</b>用 β 度量、通过 CAPM 获得溢价。折现率只补偿系统风险，这是整门课最容易被忽略的一句话。' },
        { t: 'table', caption: '组合与 CAPM', head: ['名称', '公式', '要点'], rows: [
          ['组合期望收益', 'E(R<sub>p</sub>) = Σ w<sub>i</sub>E(R<sub>i</sub>)', '线性加权'],
          ['两资产组合方差', 'σ<sub>p</sub><sup>2</sup> = w<sub>1</sub><sup>2</sup>σ<sub>1</sub><sup>2</sup> + w<sub>2</sub><sup>2</sup>σ<sub>2</sub><sup>2</sup> + 2w<sub>1</sub>w<sub>2</sub>ρσ<sub>1</sub>σ<sub>2</sub>', 'ρ &lt; 1 即有分散化收益'],
          ['β', 'β<sub>i</sub> = Cov(R<sub>i</sub>, R<sub>m</sub>)/σ<sub>m</sub><sup>2</sup>', '市场 β = 1'],
          ['CAPM', 'E(R<sub>i</sub>) = r<sub>f</sub> + β<sub>i</sub>(E(R<sub>m</sub>) − r<sub>f</sub>)', 'SML 上的点定价合理'],
          ['Alpha', 'α = 实际收益 − CAPM 要求收益', '正 α 可能被低估']
        ] },
        { t: 'table', caption: '资本成本与资本结构', head: ['名称', '公式', '要点'], rows: [
          ['WACC', '(E/V)r<sub>e</sub> + (D/V)r<sub>d</sub>(1 − t)', '权重用市值'],
          ['税后债务成本', 'r<sub>d</sub>(1 − t)', '利息抵税'],
          ['MM 有税', 'V<sub>L</sub> = V<sub>U</sub> + tD', '税盾 = tD'],
          ['权益成本（CAPM）', 'r<sub>e</sub> = r<sub>f</sub> + β<sub>e</sub>(E(R<sub>m</sub>) − r<sub>f</sub>)', '杠杆会抬高 β<sub>e</sub>'],
          ['优序融资', '内部资金 → 债务 → 股票', '信息不对称驱动']
        ] }
      ]
    }
  ]
};
