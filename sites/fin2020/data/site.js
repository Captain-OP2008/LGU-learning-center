/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'fin2020',
  short: 'FIN2020',
  name: '中级金融理论',
  en: 'Intermediate Financial Theory',
  dept: '经济与金融',
  lang: 'text',
  langLabel: '金融',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'FIN2020 // PRICING ENGINE',
  bootLog: [
    '> mounting course partition ... FIN2020',
    '> loading 8 modules: choice / claims / frontier / CAPM / options / SDF / frictions',
    '> indexing 56 quiz items, 1 mock exam, 3 projects ...',
    '> no-arbitrage check passed. ready to price.'
  ],

  /* 首页主视觉文案 */
  tagline: '把「价格为什么是这样」一层层拆开：复制、折现、均衡、摩擦。',
  missionEn: 'FIN2020 · 8 MODULES · 56 QUESTIONS',
  missionTitle: '从一张彩票开始<br><em>走到资产定价链</em>',
  lede: '八章按「选择 → 市场 → 组合 → 均衡 → 期权 → 统一 → 摩擦」推进。每章有可手算的数值例子、对比表、常见错误与自检清单，配套题库、模拟卷与三个实战项目。',
  searchPlaceholder: 'QUERY // 搜索章节、术语、公式与题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/FIN2020/',
  resources: {
    note: '本站唯一随课资料是教材 PDF；其余例子与习题均为本站按教材章节自编。',
    groups: [
      {
        name: '教材',
        items: [
          {
            title: 'Intermediate Financial Theory (3rd Edition) · Danthine & Donaldson',
            path: '学习资料/FIN2020_Intermediate_Financial_Theory_3rd_Edition_by_Jean_Pierre_Danthine.pdf',
            kind: 'pdf',
            note: '全书 15 章；本站 ch01–ch07 对应第 2–15 章的核心内容。'
          }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '中级金融理论（Intermediate Financial Theory）'],
    ['来源', 'CUHKSZ FIN2020 课程资料 · Danthine & Donaldson 教材第 3 版'],
    ['结构', '8 章正文 · 56 题题库 · 模拟卷 A · 3 个实战项目 · 资料库'],
    ['建议', '先读第 0 章建立地图；ch01–ch02 打地基，ch03–ch05 是主线，ch06 收束，ch07 放开假设。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    {
      label: '核心公式',
      blocks: [
        { t: 'p', html: '这一页只放「必须能默写」的式子。每个式子后面标了它的适用条件，条件比式子更容易被忽略。' },
        { t: 'table', caption: '九个必须记住的式子', head: ['主题', '公式', '适用条件'], rows: [
          ['定价核', 'p = E[m·x]', '无套利即可，m 的形式由偏好决定'],
          ['无风险利率', 'R^f = 1/E[m]', '同上；E[m] 是定价核的均值'],
          ['状态价格', 'q_s = π_s·m_s，π* = q/Σq', '完全市场唯一；不完全市场为一族'],
          ['组合方差', 'σ_p² = w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂', '两资产；多资产用矩阵形式'],
          ['资本市场线', 'μ_p = r_f + (μ_M − r_f)·σ_p/σ_M', '可自由借贷、同质预期'],
          ['CAPM', 'E[R] = r_f + β(E[R_M] − r_f)', 'β = cov(R,R_M)/var(R_M)'],
          ['买卖权平价', 'C − P = S − K/(1+r)^T', '欧式、无分红、同 K 同 T'],
          ['二项树', 'p* = (R − d)/(u − d)，C = E*[payoff]/R', '一步或可回溯的多步树'],
          ['Black-Scholes', 'C = S·N(d₁) − K·e^{−rT}·N(d₂)', '连续交易、常数 σ、无分红']
        ] },
        { t: 'p', html: '用法提醒：先写式子，再代数字，最后检查符号。定价类题目的分数大多丢在符号与折现上，而不是公式本身。' }
      ]
    },
    {
      label: '判读规则',
      blocks: [
        { t: 'p', html: '考试与实务里更常见的是「给现象、问判断」。下面这张表把现象直接映射到结论，看到关键词就能反应。' },
        { t: 'table', caption: '现象 → 判断 → 动作', head: ['看到什么', '说明什么', '该做什么'], rows: [
          ['cov(m, x) < 0', '坏状态支付少，价格被压低', '期望回报高于 R^f，要求更高折现率'],
          ['α > 0', '同等 β 下回报更高', '价格偏低，买入'],
          ['市价 < 复制成本', '存在套利', '买便宜的、卖复制组合，锁定差额'],
          ['隐含波动率微笑', 'BS 的常数 σ 假设不成立', '用随机波动率或跳跃模型修正'],
          ['分红提高后股价上涨', '信号：现金流撑得住', '按信号处理，而非按现金流折现'],
          ['公司发股后股价下跌', '逆向选择：管理层认为高估', '下调估值，关注发行折价'],
          ['存款保险引入', '消除挤兑的坏均衡', '配合资本监管抑制道德风险']
        ] },
        { t: 'p', html: '判断类的答案要写「机制 → 结论 → 动作」三段，只写结论通常只能拿一半分。' }
      ]
    },
    {
      label: '术语速查',
      blocks: [
        { t: 'p', html: '八个术语覆盖全书主线：从偏好到定价，再到摩擦。英文名是考试与文献里的通用写法。' },
        { t: 'terms', items: [
          { en: 'risk aversion', zh: '风险厌恶', html: 'u 为凹函数，A(w) = −u″/u′ > 0；表现为 CE 低于期望值。' },
          { en: 'state price', zh: '状态价格', html: '状态 s 的或有权益价格 q_s；Σq = 1/R^f，π* = q/Σq。' },
          { en: 'efficient frontier', zh: '有效前沿', html: '给定 σ 下 μ 最高的组合集合；加入无风险资产后变成直线。' },
          { en: 'beta', zh: '贝塔', html: 'cov(R_i, R_M)/var(R_M)，衡量系统性风险，是 CAPM 的唯一风险因子。' },
          { en: 'risk-neutral probability', zh: '风险中性概率', html: 'p* = (R − d)/(u − d)，由价格反推，不含任何主观信念。' },
          { en: 'stochastic discount factor', zh: '随机贴现因子', html: 'm = βu′(c₁)/u′(c₀)；p = E[m·x] 统一全部定价公式。' },
          { en: 'adverse selection', zh: '逆向选择', html: '签约前信息不对称，导致高质量供给退出、市场萎缩。' },
          { en: 'agency cost', zh: '代理成本', html: '利益冲突造成的价值损失；分股权代理与债务代理两类。' }
        ] },
        { t: 'p', html: '记术语时连带记「它解决什么问题」，比只背中文译名有用得多。' }
      ]
    },
    {
      label: '易错清单',
      blocks: [
        { t: 'p', html: '以下五条是批改中最常见的失分点，每一条都对应一个可以自查的动作。' },
        { t: 'table', caption: '五个高频错误与自查动作', head: ['错误', '为什么会错', '自查动作'], rows: [
          ['把 π* 当成客观概率', 'π* 是归一化的状态价格，不是预测', '问自己：这个数是从价格推的，还是从数据推的？'],
          ['以为分散化能消除所有风险', 'N → ∞ 时 σ_p → σ√ρ，系统性风险仍在', '检查公式里是否还有 ρ'],
          ['用总风险 σ 去套 CAPM', 'CAPM 只给系统性风险定价', '先算 β，再代 SML'],
          ['对美式期权直接套平价', '提前行权使平价变成不等式', '看题干有没有「美式」与「分红」'],
          ['把「风险大」直接等同于「回报高」', '只有与 m 负相关的风险才被补偿', '看 cov(m,x) 的符号，而不是 σ 的大小']
        ] },
        { t: 'p', html: '考前把这张表读一遍，比再做十道同类题更有效——错误是重复的，题目不是。' }
      ]
    }
  ]
};
