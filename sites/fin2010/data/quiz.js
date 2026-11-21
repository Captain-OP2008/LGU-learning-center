/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 每项字段：{ id, ch, kp, tier, type, difficulty, tags, stem, options, explain }
 * 8 章 × 7 题 = 56 题；每章 q1–q3 与 chXX.js 内嵌题一致。
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '整门公司金融课程的主线，最准确的概括是下列哪一项？',
        options: [
          { text: '把未来的现金流按与风险匹配的折现率折算成今天的价值，再据此做决策', correct: true },
          { text: '尽量把当期的会计利润做大，让每股收益逐年上升' },
          { text: '研究如何用最少的自有资金撬动最多的银行贷款' },
          { text: '记住各国资本市场的交易规则与监管条文' }
        ],
        explain: '公司金融的所有工具——NPV、债券定价、股票估值、WACC——都在回答同一个问题：未来的钱今天值多少，这笔投资值不值得做。利润、杠杆、规则都是这个主线的输入或约束，不是主线本身。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '按本课程的框架，企业财务管理的首要目标是：',
        options: [
          { text: '最大化股东的长期价值', correct: true },
          { text: '最大化当年的销售收入' },
          { text: '最大化员工人数与资产规模' },
          { text: '最小化每年的应纳税额' }
        ],
        explain: '股东价值最大化同时处理了时间、风险与投入资本三个维度，是可操作、可检验的目标。收入、规模、税负都只是中间变量，单独最大化其中任何一个都可能毁灭价值。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '本课程把「从会计利润推出自由现金流」放在哪一章？',
        options: [
          { text: '第 2 章：财务报表与现金流', correct: true },
          { text: '第 4 章：债券与股票估值' },
          { text: '第 6 章：风险与收益' },
          { text: '第 7 章：资本成本与资本结构' }
        ],
        explain: '第 2 章用三张报表把净利润调整为经营现金流，再推出企业自由现金流；后面的估值与资本预算都以这个现金流为原料。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '第 5 章资本预算的核心决策准则，教科书通常推荐：',
        options: [
          { text: '净现值（NPV）大于零则接受', correct: true },
          { text: '内部收益率（IRR）最高的项目优先' },
          { text: '回收期最短的项目优先' },
          { text: '盈利指数（PI）最小的项目优先' }
        ],
        explain: 'NPV 以货币为单位、可加、与股东财富严格同向。IRR、回收期、PI 都有各自的失效场景，只能作为交叉检验，不能替代 NPV 做最终决策。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '要估计一家公司的权益成本，本课程会在哪一章给出系统方法？',
        options: [
          { text: '第 6 章给出 CAPM 与 β，第 7 章把它接入 WACC', correct: true },
          { text: '第 2 章用流动比率直接推出权益成本' },
          { text: '第 3 章用年金公式推出权益成本' },
          { text: '第 4 章用债券票面利率代替权益成本' }
        ],
        explain: '第 6 章用 CAPM 把系统风险 β 转换成 required return，第 7 章再按市值权重把权益成本与税后债务成本加权成 WACC。两章是上下游关系。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '本课程的估值口径要求：企业自由现金流（FCFF）配 WACC，股权自由现金流（FCFE）配权益成本。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'FCFF 属于股东与债权人全体，对应全体资本提供者的加权成本 WACC；FCFE 只属于股东，对应权益成本。口径与折现率错配是估值中最常见的系统性错误。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['application'],
        stem: '学完本课程后，面对「要不要上一条新生产线」的问题，最完整的分析顺序是：',
        options: [
          { text: '估增量现金流 → 定与项目风险匹配的折现率 → 算 NPV 并做敏感性分析', correct: true },
          { text: '先看会计净利润是否为正，再决定是否投资' },
          { text: '先算 IRR，只要高于银行贷款利率就投资' },
          { text: '先看同行有没有上，再跟进' }
        ],
        explain: '正确顺序是现金流、折现率、NPV、敏感性分析。净利润含非现金项目与融资成本，IRR 在规模与多解上有陷阱，同行跟进更不是财务依据。'
      },

      /* ---------------- ch01 导论 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '公司制相对于个人独资企业，最主要的代价是：',
        options: [
          { text: '双重征税：公司利润先交企业所得税，分红时股东再交个人所得税', correct: true },
          { text: '股东对企业债务承担无限责任' },
          { text: '股权不能转让，企业无法永续经营' },
          { text: '无法通过发行债券融资' }
        ],
        explain: '公司制的核心交换是用双重征税换取有限责任与融资能力。有限责任、股权可转让、可发债都是公司制的优势，不是代价。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '「利润最大化」作为财务目标的主要缺陷不包括下列哪一项？',
        options: [
          { text: '它无法反映企业当期的销售收入规模', correct: true },
          { text: '它忽略了货币的时间价值' },
          { text: '它忽略了取得利润所承担的风险' },
          { text: '它忽略了取得利润所投入的资本' }
        ],
        explain: '利润最大化的三个缺陷是忽略时间、风险与投入资本。销售收入规模本来就不是目标，把它列为缺陷是把「规模」误当成了评价标准。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['application'],
        stem: '公司三年前花 200 万元做过一次市场调研，今天评估是否进入该市场。这 200 万元在决策中应：',
        options: [
          { text: '不计入，因为它是沉没成本，不因今天的决策而改变', correct: true },
          { text: '计入初始投资，因为它是项目的真实支出' },
          { text: '按三年折旧后的净值计入' },
          { text: '计入第一年的经营成本' }
        ],
        explain: '沉没成本已经发生且无法收回，做与不做都改变不了它，因此不属于增量现金流。把它计入会系统性压低项目 NPV、导致拒绝好项目。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '企业通过 IPO 发行新股并把募集资金拿到手，这笔交易发生在：',
        options: [
          { text: '一级市场', correct: true },
          { text: '二级市场' },
          { text: '货币市场' },
          { text: '同业拆借市场' }
        ],
        explain: '一级市场是企业发行新证券并取得资金的场所；二级市场是投资者之间转手已发行证券，企业不直接拿到钱。IPO 同时涉及两个市场，但融资发生在一级市场。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '公司宣布增发股票后股价往往下跌，最常用的解释是：',
        options: [
          { text: '信息不对称下，市场把增发解读为管理层认为股价被高估', correct: true },
          { text: '增发一定会降低公司的会计利润' },
          { text: '增发意味着公司即将破产' },
          { text: '增发会增加公司的所得税负担' }
        ],
        explain: '这是逆向选择的典型表现：质量差的公司更愿意发股票，投资者因此对所有增发要求折价。增发本身不改变当期利润，更不等于破产。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '下列哪一项不属于代理成本的组成部分？',
        options: [
          { text: '公司缴纳的企业所得税', correct: true },
          { text: '股东聘请审计机构监督管理层的费用' },
          { text: '管理层持有股票期权所付出的激励成本' },
          { text: '即使有治理机制，决策仍偏离最优造成的剩余损失' }
        ],
        explain: '代理成本包括监督成本、约束成本与剩余损失。企业所得税是税制安排，与股东和管理层的目标冲突无关。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '如果市场是「半强式有效」的，下列哪项最可能成立？',
        options: [
          { text: '公开信息已反映在价格中，靠财报公布后的基本面分析难以持续获得超额收益', correct: true },
          { text: '内幕信息也无法获得超额收益' },
          { text: '技术分析可以稳定获利' },
          { text: '所有股票的价格永远等于其内在价值' }
        ],
        explain: '半强式有效指价格已反映全部公开信息，因此基本面分析难以持续跑赢；强式有效才连内幕信息也反映。有效市场不等于价格永远正确，而是错误难以被系统利用。'
      },

      /* ---------------- ch02 报表与现金流 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'mcq', difficulty: 2, tags: ['formula'],
        stem: '企业自由现金流（FCFF）的正确算法是：',
        options: [
          { text: 'EBIT × (1 − 税率) + 折旧摊销 − 资本支出 − 营运资本增加', correct: true },
          { text: '净利润 + 折旧摊销 − 资本支出' },
          { text: '净利润 − 资本支出 − 营运资本增加' },
          { text: 'EBIT + 折旧摊销 − 利息 − 资本支出' }
        ],
        explain: 'FCFF 属于股东与债权人全体，要从付息前的 EBIT 出发算 NOPAT，再加回非现金的折旧摊销、减去资本支出与营运资本增加。用净利润会漏掉利息的税盾，口径不一致。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '在间接法下把净利润调整为经营现金流时，折旧要加回，原因是：',
        options: [
          { text: '折旧减少了利润，但没有流出现金', correct: true },
          { text: '折旧会增加公司的应纳税额' },
          { text: '折旧属于筹资活动现金流' },
          { text: '折旧是资本支出的一部分' }
        ],
        explain: '折旧是会计上的成本分摊，不涉及现金支付。它减少净利润却不减少现金，所以要从净利润加回；同时它抵税的作用已经体现在税项里。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['application'],
        stem: '某公司本年应收账款与存货合计增加 300 万元，应付账款增加 100 万元。这笔变化对经营现金流的影响是：',
        options: [
          { text: '减少 200 万元', correct: true },
          { text: '增加 200 万元' },
          { text: '减少 400 万元' },
          { text: '没有影响，因为都是资产负债表项目' }
        ],
        explain: '营运资本增加 = 经营性流动资产增加 − 经营性流动负债增加 = 300 − 100 = 200 万元。营运资本增加占用现金，在计算 CFO 时要减去。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['formula'],
        stem: '某公司流动资产 2000 万元、存货 600 万元、流动负债 1100 万元，其速动比率约为：',
        options: [
          { text: '1.27', correct: true },
          { text: '1.82' },
          { text: '0.55' },
          { text: '2.00' }
        ],
        explain: '速动比率 =（流动资产 − 存货）/ 流动负债 =（2000 − 600）/ 1100 = 1.27。1.82 是流动比率，两者差在是否剔除存货。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '一家公司连续三年经营现金流显著低于净利润，最应该警惕的是：',
        options: [
          { text: '应收账款或存货在吞掉现金，利润质量可能有问题', correct: true },
          { text: '公司的折旧年限太短，导致利润被低估' },
          { text: '公司的所得税率太高' },
          { text: '公司一定在进行大规模分红' }
        ],
        explain: '净利润按权责发生制确认，CFO 按收付实现制。两者长期背离，通常意味着赊销收不回或存货积压，是利润质量下降的典型信号。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '杜邦分解把 ROE 拆成三个因子的乘积，这三个因子是：',
        options: [
          { text: '净利率 × 总资产周转率 × 权益乘数', correct: true },
          { text: '毛利率 × 存货周转率 × 资产负债率' },
          { text: '净利率 × 利息保障倍数 × 分红率' },
          { text: 'ROA × 税率 × 流动比率' }
        ],
        explain: '杜邦分解对应「赚得多、转得快、借得多」三条路径。它让分析师能判断一家公司的高 ROE 是靠盈利、效率还是杠杆，从而评估可持续性。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-2', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '估值时应优先使用资产负债表上的账面价值，因为它客观、可审计。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '账面价值按历史成本与折旧计量，严重滞后于市场，品牌、专利、人力资本往往不入账。估值要用市场价值或未来现金流现值，账面价值只适合看资产结构与偿债能力。'
      },

      /* ---------------- ch03 货币时间价值 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['formula'],
        stem: '年利率 8%，五年后要付 100 万元，现在应存多少钱（约）？',
        options: [
          { text: '68.06 万元', correct: true },
          { text: '74.00 万元' },
          { text: '146.93 万元' },
          { text: '60.00 万元' }
        ],
        explain: 'PV = 100 / 1.08⁵ = 100 / 1.4693 ≈ 68.06 万元。146.93 是终值方向算反了，74 是单利折现，60 是直接把 40% 当总折现率。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['formula'],
        stem: '名义年利率 12%、按月计息，有效年利率（EAR）约为：',
        options: [
          { text: '12.68%', correct: true },
          { text: '12.00%' },
          { text: '12.75%' },
          { text: '1.00%' }
        ],
        explain: 'EAR = (1 + 0.12/12)¹² − 1 = 1.01¹² − 1 ≈ 12.68%。12.75% 是按日计息的结果，12% 是没有考虑复利的 APR。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['formula'],
        stem: '每年年末支付 12 万元、永久支付，折现率 6%，这笔现金流的现值是：',
        options: [
          { text: '200 万元', correct: true },
          { text: '72 万元' },
          { text: '无限大' },
          { text: '120 万元' }
        ],
        explain: '永续年金现值 = C / r = 12 / 0.06 = 200 万元。折现让远期的钱趋于零，总和收敛为有限值；200 万元按 6% 每年正好产生 12 万元收益，本金不动。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['formula'],
        stem: '下一期现金流 12 万元、折现率 6%、永久增长率 2%，其现值是：',
        options: [
          { text: '300 万元', correct: true },
          { text: '200 万元' },
          { text: '600 万元' },
          { text: '150 万元' }
        ],
        explain: '增长永续年金现值 = C₁ / (r − g) = 12 / (0.06 − 0.02) = 300 万元。分子必须是下一期现金流；若误用本期 12 万元且增长率 0，才会得到 200 万元。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['application'],
        stem: '贷款 300 万元、年利率 4.9%、30 年按月等额本息，计算月供时正确的口径是：',
        options: [
          { text: '月利率 4.9%/12，期数 360', correct: true },
          { text: '年利率 4.9%，期数 30' },
          { text: '月利率 4.9%，期数 360' },
          { text: '月利率 4.9%/12，期数 30' }
        ],
        explain: '现金流按月，折现率就必须是月利率、期数就必须是月数：4.9%/12 ≈ 0.4083%，30×12 = 360 期。口径错配是房贷计算最高频的错误。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['estimation'],
        stem: '用 72 法则估算：年收益率 9% 时，本金翻倍约需多少年？',
        options: [
          { text: '8 年', correct: true },
          { text: '9 年' },
          { text: '12 年' },
          { text: '4 年' }
        ],
        explain: '72 / 9 = 8 年。72 法则是复利翻倍年数的近似值，利率越高越准；9% 用 72 得 8 年，精确值约 8.04 年。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['formula'],
        stem: '名义利率 8%、通胀率 3%，实际利率约为：',
        options: [
          { text: '4.85%', correct: true },
          { text: '5.00%' },
          { text: '11.00%' },
          { text: '2.67%' }
        ],
        explain: '费雪方程：1.08 / 1.03 − 1 ≈ 4.85%。近似式 8% − 3% = 5% 忽略了交叉项 0.24%，通胀越高误差越大。'
      },

      /* ---------------- ch04 债券与股票估值 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '市场利率上升时，一张固定票息债券的价格会：',
        options: [
          { text: '下跌，因为未来现金流的现值变小', correct: true },
          { text: '上涨，因为债券变得更有吸引力' },
          { text: '不变，因为票息是合同写死的' },
          { text: '先涨后跌，取决于到期时间' }
        ],
        explain: '债券价格是未来票息与面值的现值，折现率上升则现值下降，价格下跌。票息不变，但市场要求的回报变了，价格必须调整到与新收益率一致。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '一张债券的价格高于面值，说明：',
        options: [
          { text: '票面利率高于市场要求的到期收益率', correct: true },
          { text: '票面利率低于市场要求的到期收益率' },
          { text: '发行人即将违约' },
          { text: '债券的久期为零' }
        ],
        explain: '票息高于市场要求时，投资者愿意溢价购买；反之则折价。价格等于面值时，票面利率等于 YTM。这与违约风险无关，违约风险体现在 YTM 的信用利差里。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '下列哪种债券的久期最长（其他条件相同）？',
        options: [
          { text: '期限 30 年、票息 2% 的债券', correct: true },
          { text: '期限 30 年、票息 8% 的债券' },
          { text: '期限 5 年、票息 2% 的债券' },
          { text: '期限 5 年、票息 8% 的债券' }
        ],
        explain: '期限越长、票息越低，现金流的现值越集中在遥远的到期日，久期越大。30 年低票息债券的久期接近 30 年，利率风险最高。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'mcq', difficulty: 2, tags: ['formula'],
        stem: '某股票刚支付股利 1.90 元，预期股利永久增长 5%，投资者要求回报 10%，其内在价值约为：',
        options: [
          { text: '39.90 元', correct: true },
          { text: '38.00 元' },
          { text: '19.00 元' },
          { text: '42.00 元' }
        ],
        explain: 'D₁ = 1.90 × 1.05 = 1.995 元，P₀ = 1.995 / (0.10 − 0.05) = 39.90 元。用 D₀ 直接除会得到 38 元，是忘记乘 (1+g) 的典型错误。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '一家公司 ROE 为 8%，资本成本为 10%。按照增长与价值的关系，它应该：',
        options: [
          { text: '提高分红或回购，因为留存利润再投资的回报低于资本成本', correct: true },
          { text: '尽量留存全部利润，因为增长总能创造价值' },
          { text: '大量借债扩大产能，以提高 ROE' },
          { text: '把股利支付率降到零，等待 ROE 上升' }
        ],
        explain: 'ROE < r 时，每留存一元再投资，创造的价值低于股东自己投资的机会成本，PVGO 为负。此时应把利润分掉，而不是盲目扩张。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '用 P/E 给周期股估值时，最危险的时点是：',
        options: [
          { text: '行业景气高点，利润 E 很大、P/E 看起来很低', correct: true },
          { text: '行业景气低点，利润 E 很小、P/E 看起来很高' },
          { text: '公司刚刚上市，没有历史数据' },
          { text: '公司分红率突然提高' }
        ],
        explain: '周期高点的 E 是不可持续的，用高点利润乘以倍数会严重高估。周期股常用正常化利润或 EV/EBITDA，避免被当期的 E 误导。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '乘数法可以完全替代股利折现模型，因为它更贴近市场。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '乘数法依赖可比公司，受周期、会计政策与市场情绪影响，且无法处理负利润。它只能作为交叉检验，不能替代现金流折现；专业估值通常两套都做并解释差异。'
      },

      /* ---------------- ch05 资本预算 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: 'NPV 准则的决策规则是：',
        options: [
          { text: 'NPV 大于零则接受，互斥项目选 NPV 最大的', correct: true },
          { text: 'NPV 大于零则拒绝，因为风险太高' },
          { text: 'NPV 越小越好，因为投入少' },
          { text: 'NPV 等于零则接受，大于零则拒绝' }
        ],
        explain: 'NPV 衡量项目为股东创造的财富，大于零即创造价值；互斥项目选 NPV 最大的，因为股东财富看总量而不是效率。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'mcq', difficulty: 2, tags: ['formula'],
        stem: '某项目年收入 800 万元、付现成本 400 万元、折旧 200 万元、税率 25%，其经营现金流 OCF 为：',
        options: [
          { text: '350 万元', correct: true },
          { text: '300 万元' },
          { text: '200 万元' },
          { text: '400 万元' }
        ],
        explain: 'OCF = (800 − 400) × 0.75 + 200 × 0.25 = 300 + 50 = 350 万元。等价于 EBIT 200 × 0.75 + 折旧 200 = 350。忘记加折旧税盾会得到 300。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '下列哪一项应该计入项目的增量现金流？',
        options: [
          { text: '把公司自有厂房用于该项目而放弃的市场租金', correct: true },
          { text: '三年前为该项目支付的市场调研费' },
          { text: '总部按收入比例分摊、不因项目增减而变化的管理费' },
          { text: '项目融资的贷款利息支出' }
        ],
        explain: '自有厂房的市场租金是机会成本，因项目而发生，应计入。调研费是沉没成本，分摊管理费不是增量，利息属于融资成本、已在折现率中体现。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '一个项目的现金流为 −100、+230、−132（万元），其 IRR 可能出现：',
        options: [
          { text: '两个解（10% 与 20%），因为现金流符号改变了两次', correct: true },
          { text: '唯一解，因为初始投资为负' },
          { text: '无解，因为最后一年现金流为负' },
          { text: '等于 0，因为总现金流为负' }
        ],
        explain: '现金流符号改变两次，NPV 曲线两次穿过横轴，IRR 有两个解。此时 IRR 无法给出唯一判断，应以 NPV 为准。这是非传统现金流项目的典型陷阱。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '回收期法最主要的缺陷是：',
        options: [
          { text: '忽略货币时间价值与回收期之后的现金流', correct: true },
          { text: '计算过于复杂，普通员工无法掌握' },
          { text: '一定高估项目的 NPV' },
          { text: '只适用于有债务融资的项目' }
        ],
        explain: '回收期简单直观，但把不同时点的现金流直接相加，且完全无视回收期之后的现金流。一个前期回本快、后期巨亏的项目会被它误判为好项目。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['application'],
        stem: '项目期初投入营运资本 150 万元，项目结束时收回。这笔现金流对 NPV 的影响是：',
        options: [
          { text: '期初减 150 万元，期末加 150 万元的现值，净影响为负的时间价值', correct: true },
          { text: '不影响 NPV，因为最终收回了' },
          { text: '期初加 150 万元，期末减 150 万元' },
          { text: '只在利润表上体现，与现金流无关' }
        ],
        explain: '营运资本期初流出、期末收回，金额相同但时点不同，折现后净现值为负——占用资金是有代价的。忽略它会高估项目价值。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['formula'],
        stem: '设备 1000 万元、5 年直线折旧、税率 25%，每年折旧税盾是：',
        options: [
          { text: '50 万元', correct: true },
          { text: '200 万元' },
          { text: '250 万元' },
          { text: '25 万元' }
        ],
        explain: '年折旧 = 1000 / 5 = 200 万元，折旧税盾 = 折旧 × 税率 = 200 × 25% = 50 万元。加的是税盾 50 万元，不是折旧 200 万元。'
      },

      /* ---------------- ch06 风险与收益 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['formula'],
        stem: '两资产各投 50%，σ₁ = 20%、σ₂ = 12%、相关系数 0.3，组合标准差约为：',
        options: [
          { text: '13.11%', correct: true },
          { text: '16.00%' },
          { text: '8.00%' },
          { text: '32.00%' }
        ],
        explain: 'σp² = 0.25×0.04 + 0.25×0.0144 + 2×0.25×0.20×0.12×0.3 = 0.0172，σp ≈ 13.11%。16% 是加权平均，只有 ρ = 1 时才成立。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '通过持有 30 只不同行业的股票，投资者主要能消除：',
        options: [
          { text: '非系统风险', correct: true },
          { text: '系统风险' },
          { text: '通胀风险' },
          { text: '利率风险' }
        ],
        explain: '分散化能消除公司/行业特有的非系统风险，但无法消除影响所有资产的市场风险。后者用 β 度量，是唯一获得溢价的风险。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'mcq', difficulty: 2, tags: ['formula'],
        stem: 'rf = 3%、β = 1.2、市场风险溢价 6%，CAPM 给出的 required return 是：',
        options: [
          { text: '10.2%', correct: true },
          { text: '9.0%' },
          { text: '7.2%' },
          { text: '12.0%' }
        ],
        explain: 'E(R) = 3% + 1.2 × 6% = 10.2%。7.2% 是把 β 乘在 rf 上的错误，9% 是 β = 1 的结果。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: 'β = 1.5 的含义是：',
        options: [
          { text: '市场上涨 1% 时，该资产平均上涨 1.5%，系统风险高于市场', correct: true },
          { text: '该资产的总风险是市场的 1.5 倍' },
          { text: '该资产的期望收益一定是 1.5%' },
          { text: '该资产有 1.5 的概率跑赢市场' }
        ],
        explain: 'β 衡量对市场波动的敏感度，不是总风险（总风险用 σ）、不是收益率、更不是胜率。β = 1.5 表示比市场更敏感，通常要求更高的回报。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '当两只股票的相关系数为 −1 时，下列哪项成立？',
        options: [
          { text: '可以按特定权重构造出标准差为零的组合', correct: true },
          { text: '组合收益一定为零' },
          { text: '组合标准差等于两者标准差的加权平均' },
          { text: '分散化完全无效' }
        ],
        explain: 'ρ = −1 时，两种资产的波动完全反向，按 σ₂/(σ₁+σ₂) 配比可以完全对冲，得到零风险组合，收益为加权平均（非零）。ρ = +1 时分散化才无效。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['formula'],
        stem: '某股票 β = 1.2，CAPM 要求的回报是 10.2%，你预测它明年收益 12%。其 Jensen\'s alpha 是：',
        options: [
          { text: '+1.8%', correct: true },
          { text: '−1.8%' },
          { text: '+12%' },
          { text: '+10.2%' }
        ],
        explain: 'α = 12% − 10.2% = +1.8%。正 alpha 表示按系统风险调整后，预期收益高于应有回报，资产可能被低估。alpha 是预测，不是保证。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '关于 CML 与 SML 的区别，正确的是：',
        options: [
          { text: 'CML 用总风险 σ 给有效组合定价，SML 用系统风险 β 给单个资产定价', correct: true },
          { text: 'CML 用 β，SML 用 σ' },
          { text: '两者完全等价，只是画法不同' },
          { text: 'SML 只适用于债券，CML 只适用于股票' }
        ],
        explain: '资本市场线描述「无风险资产 + 市场组合」的有效组合，横轴是 σ；证券市场线描述单个资产的期望收益与 β 的关系。给单个资产定价必须用 SML。'
      },

      /* ---------------- ch07 资本成本与资本结构 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['formula'],
        stem: 'WACC 的正确表达式是：',
        options: [
          { text: '(E/V) × rₑ + (D/V) × r_d × (1 − t)', correct: true },
          { text: '(E/V) × rₑ + (D/V) × r_d' },
          { text: '(E/V) × r_d + (D/V) × rₑ' },
          { text: 'rₑ + r_d' }
        ],
        explain: '债务成本要乘 (1 − t)，因为利息可以抵税，税后成本才是真实成本。权重按市值 E/V 与 D/V 计算，两者相加为 1。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['formula'],
        stem: '债务成本 6%、所得税率 25%，税后债务成本是：',
        options: [
          { text: '4.5%', correct: true },
          { text: '6.0%' },
          { text: '7.5%' },
          { text: '1.5%' }
        ],
        explain: '6% × (1 − 25%) = 4.5%。利息抵税让公司少交 1.5% 的税，净成本从 6% 降到 4.5%；1.5% 是税盾本身，不是税后成本。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '计算 WACC 时，权益与债务的权重应该用：',
        options: [
          { text: '市场价值', correct: true },
          { text: '账面价值' },
          { text: '历史投入成本' },
          { text: '发行时的票面金额' }
        ],
        explain: '资本成本反映的是「今天」投资者要求的回报，权重必须用今天的市值。账面权益是历史投入，与当前资本成本无关，用它会扭曲 WACC。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['formula'],
        stem: '在有公司税、无其他摩擦的 MM 世界里，负债 4000 万元、税率 25%，税盾价值是：',
        options: [
          { text: '1000 万元', correct: true },
          { text: '4000 万元' },
          { text: '3000 万元' },
          { text: '0' }
        ],
        explain: '税盾现值 = t × D = 25% × 4000 = 1000 万元，此时 V_L = V_U + 1000。这是理论上限，现实中还要扣掉财务困境成本。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '优序融资理论预测的融资顺序是：',
        options: [
          { text: '留存收益 → 债务 → 发行股票', correct: true },
          { text: '发行股票 → 债务 → 留存收益' },
          { text: '债务 → 留存收益 → 发行股票' },
          { text: '发行股票 → 留存收益 → 债务' }
        ],
        explain: '信息不对称下，发股票会被市场解读为股价高估、导致下跌，所以公司优先用内部资金，其次发债，最后才发股票。这解释了为什么盈利公司反而负债少。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '按照 MM 股利无关论，股利政策不影响公司价值的前提是：',
        options: [
          { text: '无税、无摩擦，且股东可以「自制股利」', correct: true },
          { text: '公司必须持续盈利且不分红' },
          { text: '市场处于熊市' },
          { text: '公司没有负债' }
        ],
        explain: 'MM 股利无关论假设无税、无发行成本、信息对称，股东可以通过卖出股票自制现金，因此分红与留存等价。现实中税收、信号与代理成本让政策变得相关。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-1', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '用 WACC 折现企业自由现金流（FCFF），得到的是企业价值；减去净债务后才得到股权价值。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'FCFF 属于股东与债权人全体，WACC 也是全体资本的成本，折现得到企业价值（EV）。要得到股东手里的股权价值，必须减去净债务。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
