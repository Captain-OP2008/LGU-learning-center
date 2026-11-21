/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；每章 q1–q7，其中 q1–q3 与 chXX.js 内嵌题对应。
 * 字段：id / ch / kp / tier / type / difficulty / tags / stem / options|correct|answer / explain
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '管理会计主要服务于哪一类使用者？',
        options: [
          { text: '企业内部管理层，用于计划、控制与决策', correct: true },
          { text: '外部投资者与债权人，用于评估企业价值' },
          { text: '税务机关，用于核定应纳税额' },
          { text: '证券监管机构，用于审核披露文件' }
        ],
        explain: '管理会计面向内部，强调未来导向与决策相关性；财务会计面向外部，按会计准则出具通用报表。两者的信息使用者不同，是区分的第一条线。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '「成本对象」（cost object）指的是什么？',
        options: [
          { text: '需要单独计量成本的任何对象，如产品、订单、部门或客户', correct: true },
          { text: '企业当期发生的全部费用' },
          { text: '只指最终卖给客户的产品' },
          { text: '成本会计科目表中的一级科目' }
        ],
        explain: '成本对象是归集成本的「靶子」，可以是一件产品、一张订单、一条产品线、一个部门或一位客户。确定了对象，才能谈直接成本与间接成本的划分。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '管理会计与财务会计一样，必须严格遵循外部会计准则编制报表。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '管理会计不受 GAAP 或 IFRS 的强制约束，格式与口径可以按管理需要设计；财务会计才必须遵循会计准则对外报告。这是两者最重要的制度差异。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['process'],
        stem: '用管理会计回答一个决策问题，比较合理的顺序是：',
        options: [
          { text: '界定问题与备选方案 → 识别相关收入与成本 → 计算各方案增量结果 → 结合非量化因素判断', correct: true },
          { text: '先做会计分录 → 再编报表 → 最后比较利润' },
          { text: '先算全部成本 → 再按产量分摊 → 最后看单位成本高低' },
          { text: '先定结论 → 再找数据支持 → 最后调整口径' }
        ],
        explain: '决策四步是「问题—相关数据—增量比较—非量化因素」。先定结论再找数据是典型的确认偏误，管理会计要避免。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['process'],
        stem: '制造企业的产品成本，在账面上通常按什么顺序流转？',
        options: [
          { text: '原材料 → 在产品 → 产成品 → 销售成本', correct: true },
          { text: '原材料 → 产成品 → 在产品 → 销售成本' },
          { text: '在产品 → 原材料 → 销售成本 → 产成品' },
          { text: '产成品 → 在产品 → 原材料 → 销售成本' }
        ],
        explain: '直接材料、直接人工与制造费用先进入在产品（WIP），完工后转入产成品（FG），销售时再转入销售成本（COGS）。这条链条是分批法与分步法共同的主干。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '本站配套教材是 Garrison、Noreen、Brewer 合著的《Managerial Accounting》第几版？请填阿拉伯数字。',
        answer: '15',
        explain: '课程资料库中的教材为第 15 版，本站各章的章节对应关系以该版为准；不同版次的章号可能略有差异。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-1', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些属于管理会计信息的典型特征？（多选）',
        options: [
          { text: '面向未来，含预算与预测', correct: true },
          { text: '按内部管理需要设计口径', correct: true },
          { text: '可以包含非货币信息，如质量与交期', correct: true },
          { text: '必须经外部审计后才能使用' }
        ],
        explain: '管理会计信息未来导向、口径灵活、可含非货币维度，且不需要外部审计；需要外部审计的是对外财务报告。'
      },

      /* ---------------- ch01 成本概念 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '制造成本的三个要素是：',
        options: [
          { text: '直接材料、直接人工、制造费用', correct: true },
          { text: '直接材料、直接人工、销售费用' },
          { text: '直接材料、制造费用、管理费用' },
          { text: '直接人工、制造费用、财务费用' }
        ],
        explain: '产品成本由直接材料、直接人工与制造费用构成；销售费用、管理费用与财务费用属于期间费用，不计入产品成本。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '主要成本（prime cost）等于直接材料加直接人工，加工成本（conversion cost）等于直接人工加制造费用。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '主要成本 = DM + DL，加工成本 = DL + MOH。两者都含直接人工，所以不能把两者相加当作总成本，否则人工会被重复计算。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '某公司维修成本在 12,000 小时时为 13,600 元，在 7,000 小时时为 9,600 元。用高低点法，单位变动成本是多少？',
        options: [
          { text: '0.8 元/小时', correct: true },
          { text: '1.25 元/小时' },
          { text: '0.6 元/小时' },
          { text: '4,000 元/小时' }
        ],
        explain: 'b = (13,600 − 9,600) ÷ (12,000 − 7,000) = 4,000 ÷ 5,000 = 0.8 元/小时。高低点法只用业务量最高与最低两个点，选点依据是业务量而不是成本。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'fill', difficulty: 2, tags: ['calculation'],
        stem: '承上题，固定成本 a 是多少元？（只填数字）',
        answer: '4000',
        explain: 'a = 13,600 − 0.8 × 12,000 = 4,000 元；用低点验证：9,600 − 0.8 × 7,000 = 4,000 元。混合成本公式为 y = 4,000 + 0.8x。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '某企业生产 1,000 件产品，售出 800 件，单位产品成本 300 元，期间费用 60,000 元，售价 500 元。若误把 60,000 元期间费用计入产品成本，当期利润会：',
        options: [
          { text: '虚增 12,000 元', correct: true },
          { text: '虚减 12,000 元' },
          { text: '不变' },
          { text: '虚增 60,000 元' }
        ],
        explain: '正确利润 = 800 × (500 − 300) − 60,000 = 100,000 元。误计入产品成本后，单位成本变为 360 元，200 件存货吸收了 12,000 元费用，当期费用减少 12,000 元，利润虚增 12,000 元。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '成本习性（cost behavior）描述的是成本如何随什么变化？',
        options: [
          { text: '随业务量（如产量、销量、工时）变化', correct: true },
          { text: '随时间自然流逝而变化' },
          { text: '随会计政策变更而变化' },
          { text: '随产品售价变化而变化' }
        ],
        explain: '成本习性指成本总额与业务量之间的依存关系，分为固定、变动与混合三类。判断习性看的是「总额」，不是单位额。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '关于直接成本与间接成本，下列说法正确的有：（多选）',
        options: [
          { text: '直接成本可以经济地追溯到成本对象', correct: true },
          { text: '间接成本需要按某种基础分配', correct: true },
          { text: '同一项成本对某个对象是直接成本，对另一个对象可能是间接成本', correct: true },
          { text: '间接成本一定比直接成本金额小' }
        ],
        explain: '直接与间接是相对于特定成本对象而言的，同一笔费用换个对象就可能从直接变间接；金额大小与直接性无关。'
      },

      /* ---------------- ch02 分批成本法 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '分批成本法（job-order costing）最适合下列哪种生产环境？',
        options: [
          { text: '按客户订单定制、每批产品规格不同', correct: true },
          { text: '连续大量生产同一种标准产品' },
          { text: '只提供一种标准化服务且无差异' },
          { text: '产品完全无法辨认批次' }
        ],
        explain: '分批法以「订单/批次」为成本对象，适合定制化、多品种、小批量；连续大量生产同质产品更适合分步成本法。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '某车间预算制造费用 480,000 元，预算直接人工工时 40,000 小时。预定分配率是多少？',
        options: [
          { text: '12 元/直接人工小时', correct: true },
          { text: '8 元/直接人工小时' },
          { text: '24 元/直接人工小时' },
          { text: '0.083 元/直接人工小时' }
        ],
        explain: '预定分配率 = 预算制造费用 ÷ 预算分配基础 = 480,000 ÷ 40,000 = 12 元/直接人工小时。用预算数而非实际数，是为了在订单完工时就能算出成本。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '订单 A-101 耗用直接材料 9,000 元、直接人工 800 小时（工资率 25 元/小时），制造费用按 12 元/直接人工小时分配。该订单总成本是多少？',
        options: [
          { text: '38,600 元', correct: true },
          { text: '29,000 元' },
          { text: '47,600 元' },
          { text: '33,800 元' }
        ],
        explain: 'DM 9,000 + DL 800 × 25 = 20,000 + MOH 800 × 12 = 9,600，合计 38,600 元。订单成本单只归集这三项，销售与管理费用不进订单成本。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '本期实际制造费用 51,000 元，已分配制造费用 48,000 元。下列说法正确的是：',
        options: [
          { text: '分配不足 3,000 元，应调增销售成本或在制品与产成品', correct: true },
          { text: '过度分配 3,000 元，应调减销售成本' },
          { text: '属于正常差异，不需要处理' },
          { text: '应直接计入营业外收入' }
        ],
        explain: '实际 51,000 > 已分配 48,000，差额 3,000 元为分配不足（underapplied）。期末通常按比例分摊到在产品、产成品与销售成本，或全部计入销售成本。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '在分批成本法下，直接材料与直接人工直接计入各订单的成本单，制造费用则通过预定分配率分配。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '直接成本可追溯到订单，直接计入；制造费用是间接成本，无法逐单追溯，只能按预定分配率分配。这是分批法「直接追溯 + 分配」的组合。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-5', tier: 3, type: 'fill', difficulty: 3, tags: ['calculation'],
        stem: '分配不足 3,000 元，在产品 10,000 元、产成品 21,000 元、销售成本 112,000 元。按账面比例分摊，销售成本应分摊多少元？（只填数字）',
        answer: '2349',
        explain: '销售成本占比 112,000 ÷ 143,000 ≈ 0.7832，分摊 3,000 × 0.7832 ≈ 2,349 元；在产品 210 元、产成品 441 元，合计 3,000 元。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'multi', difficulty: 2, tags: ['process'],
        stem: '分批成本法下，订单成本单通常依据哪些原始凭证登记？（多选）',
        options: [
          { text: '领料单（material requisition）', correct: true },
          { text: '工时卡或计工单（time ticket）', correct: true },
          { text: '制造费用分配表', correct: true },
          { text: '销售合同中的报价单' }
        ],
        explain: '领料单证明材料流向订单，工时卡证明人工归属，制造费用按预定分配率汇总分配。报价单是定价文件，不是成本归集的原始凭证。'
      },

      /* ---------------- ch03 分步成本法 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '加权平均法下：期初在产品 1,000 件（材料 100%、转换 40%），本期投入 9,000 件，完工 8,500 件，期末在产品 1,500 件（材料 100%、转换 60%）。材料约当产量是多少？',
        options: [
          { text: '10,000 件', correct: true },
          { text: '9,000 件' },
          { text: '8,500 件' },
          { text: '10,600 件' }
        ],
        explain: '加权平均法不区分期初与本期：材料约当 = 完工 8,500 + 期末 1,500 × 100% = 10,000 件。期初在产品的材料已在上期投入，本期不再计算。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '承上题，转换成本约当产量是多少？',
        options: [
          { text: '9,400 件', correct: true },
          { text: '10,000 件' },
          { text: '8,500 件' },
          { text: '9,100 件' }
        ],
        explain: '转换约当 = 8,500 + 1,500 × 60% = 8,500 + 900 = 9,400 件。转换成本按完工进度折算，材料若一次投入则期末按 100% 计。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '承上题，若材料成本合计 110,000 元、转换成本合计 94,000 元，单位材料成本与单位转换成本分别是：',
        options: [
          { text: '11.00 元与 10.00 元', correct: true },
          { text: '10.00 元与 11.00 元' },
          { text: '12.00 元与 9.40 元' },
          { text: '11.00 元与 9.40 元' }
        ],
        explain: '单位材料 = 110,000 ÷ 10,000 = 11.00 元；单位转换 = 94,000 ÷ 9,400 = 10.00 元；合计单位成本 21.00 元。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '先进先出法把期初在产品的成本与本期的成本分开计算，因此期初存货不会「稀释」本期单位成本。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'FIFO 先把期初在产品完工，本期成本只分配给「本期开工并完工」与期末在产品，期初存货成本单独结转；加权平均法则把两者混合。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-4', tier: 3, type: 'fill', difficulty: 3, tags: ['calculation'],
        stem: 'FIFO 下：期初在产品 2,000 件（材料 100%、转换 50%），本期完工 8,500 件，期末 1,500 件（材料 100%、转换 40%）。本期材料约当产量是多少件？（只填数字）',
        answer: '8000',
        explain: 'FIFO 只算本期完成的工作量：本期开工并完工 8,500 − 2,000 = 6,500 件，加期末 1,500 件，共 8,000 件；期初 2,000 件的材料已在上期投入，不计入。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '承 ch03-q1、q3，加权平均法下完工转出的成本是多少？',
        options: [
          { text: '178,500 元', correct: true },
          { text: '170,000 元' },
          { text: '204,000 元' },
          { text: '191,000 元' }
        ],
        explain: '单位总成本 11 + 10 = 21 元，转出 8,500 × 21 = 178,500 元；期末 1,500 × (11 + 6) = 25,500 元；两者合计 204,000 元，与投入总额相等。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '计算约当产量时，通常需要哪些信息？（多选）',
        options: [
          { text: '本期完工并转出的数量', correct: true },
          { text: '期末在产品的数量', correct: true },
          { text: '期末在产品的完工比例（分成本项）', correct: true },
          { text: '产品的最终售价' }
        ],
        explain: '约当产量 = 完工数量 + 期末在产品 × 完工比例（FIFO 还要扣除期初已完工程度）。售价与约当产量无关。'
      },

      /* ---------------- ch04 本量利分析 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['calculation'],
        stem: '售价 50 元、单位变动成本 30 元、固定成本 200,000 元。单位贡献毛益是多少？',
        options: [
          { text: '20 元', correct: true },
          { text: '30 元' },
          { text: '50 元' },
          { text: '80 元' }
        ],
        explain: '单位贡献毛益 = 售价 − 单位变动成本 = 50 − 30 = 20 元。它先用来覆盖固定成本，覆盖完之后才形成利润。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '承上题，保本销量是多少件？',
        options: [
          { text: '10,000 件', correct: true },
          { text: '6,667 件' },
          { text: '4,000 件' },
          { text: '12,000 件' }
        ],
        explain: '保本销量 = 固定成本 ÷ 单位贡献毛益 = 200,000 ÷ 20 = 10,000 件；保本销售额 = 10,000 × 50 = 500,000 元。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '承上题，若实际销量 12,000 件，安全边际率是多少？',
        options: [
          { text: '16.67%', correct: true },
          { text: '20.00%' },
          { text: '83.33%' },
          { text: '2.00%' }
        ],
        explain: '安全边际量 = 12,000 − 10,000 = 2,000 件；安全边际额 100,000 元；安全边际率 = 2,000 ÷ 12,000 ≈ 16.67%。它衡量销量下滑多少才亏损。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '承上题，若要实现目标利润 100,000 元，销量应达到多少件？',
        options: [
          { text: '15,000 件', correct: true },
          { text: '10,000 件' },
          { text: '5,000 件' },
          { text: '20,000 件' }
        ],
        explain: '目标销量 = (固定成本 + 目标利润) ÷ 单位贡献毛益 = (200,000 + 100,000) ÷ 20 = 15,000 件。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '经营杠杆系数为 6 时，销量增加 10% 会使利润增加约 60%。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '经营杠杆系数 = 贡献毛益 ÷ 营业利润，衡量利润对销量变化的敏感度。销量 +10% → 利润约 +60%，放大 6 倍。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-4', tier: 3, type: 'fill', difficulty: 3, tags: ['calculation'],
        stem: 'A 产品单位贡献 40 元、B 产品单位贡献 60 元，销售组合 3:2。加权平均单位贡献毛益是多少元？（只填数字）',
        answer: '48',
        explain: '加权单位贡献 = 40 × 3/5 + 60 × 2/5 = 24 + 24 = 48 元。若固定成本 240,000 元，保本组合销量 = 240,000 ÷ 48 = 5,000 单位（A 3,000、B 2,000）。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: 'CVP 分析的成立依赖哪些假设？（多选）',
        options: [
          { text: '售价在相关范围内不变', correct: true },
          { text: '单位变动成本不变', correct: true },
          { text: '固定成本总额不变', correct: true },
          { text: '产品组合随销量变化而自动调整' }
        ],
        explain: 'CVP 假设售价、单位变动成本、固定成本在相关范围内稳定，多产品时还假设销售组合不变。组合自动变化会破坏加权贡献毛益的可比性。'
      },

      /* ---------------- ch05 作业成本法 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 2, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '某厂制造费用 576,000 元，按直接人工小时分配；标准件 10,000 件每件 2 小时，定制件 1,000 件每件 4 小时。传统分配率是多少？',
        options: [
          { text: '24 元/直接人工小时', correct: true },
          { text: '20 元/直接人工小时' },
          { text: '12 元/直接人工小时' },
          { text: '48 元/直接人工小时' }
        ],
        explain: '总工时 = 10,000 × 2 + 1,000 × 4 = 24,000 小时；576,000 ÷ 24,000 = 24 元/小时。单一分配率把不同作业的消耗平均化了。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '机器相关成本库 280,000 元，机器工时 14,000 小时。该作业的分配率是多少？',
        options: [
          { text: '20 元/机器小时', correct: true },
          { text: '14 元/机器小时' },
          { text: '2.8 元/机器小时' },
          { text: '40 元/机器小时' }
        ],
        explain: '作业分配率 = 成本库金额 ÷ 作业动因总量 = 280,000 ÷ 14,000 = 20 元/机器小时。ABC 的核心就是「一个成本库一个动因一个率」。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-4', tier: 3, type: 'mcq', difficulty: 3, tags: ['calculation'],
        stem: '标准件 10,000 件：直接材料 20 元/件、直接人工 2 小时 × 10 元、机器 1 小时、订单 20 张、换线 8 次、检验 50 次。用 ABC 算，单位成本约是多少？',
        options: [
          { text: '65.6 元', correct: true },
          { text: '88.0 元' },
          { text: '70.0 元' },
          { text: '60.0 元' }
        ],
        explain: '单位成本 = 20 + 20 + (20 × 1) + (600 × 20 ÷ 10,000) + (3,000 × 8 ÷ 10,000) + (400 × 50 ÷ 10,000) = 20 + 20 + 20 + 1.2 + 2.4 + 2 = 65.6 元。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: 'ABC 通常会降低高产量、简单产品的成本，提高低产量、复杂定制产品的成本。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '传统单一分配率按工时平均分摊，高产量产品承担了过多间接成本；ABC 按作业动因追溯，复杂低产量产品消耗更多换线、订单、检验，成本被还原后升高。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-4', tier: 3, type: 'fill', difficulty: 3, tags: ['calculation'],
        stem: '定制件 1,000 件：直接材料 60 元/件、直接人工 4 小时 × 10 元、机器 4 小时、订单 100 张、换线 40 次、检验 150 次。用 ABC 算，单位成本约是多少元？（只填数字）',
        answer: '420',
        explain: '单位成本 = 60 + 40 + 80 + 60 + 120 + 60 = 420 元。同样的作业费率，定制件因为订单多、换线多、检验多，成本远高于标准件的 65.6 元。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '下列哪种情形最适合引入作业成本法？',
        options: [
          { text: '间接成本占比高、产品多样、各产品消耗的作业差异大', correct: true },
          { text: '只有一种产品且几乎全部是直接材料' },
          { text: '间接成本占比很低、生产高度标准化' },
          { text: '企业规模很小、只有一名员工' }
        ],
        explain: 'ABC 的价值来自「纠正单一分配率的交叉补贴」，因此产品越多样、间接成本越高、作业消耗差异越大，收益越明显；反之实施成本可能超过收益。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '关于成本动因（cost driver），下列说法正确的有：（多选）',
        options: [
          { text: '它是导致成本发生的因素，也是分配间接成本的基础', correct: true },
          { text: '机器小时、订单数、换线次数都可以作为动因', correct: true },
          { text: '动因应与成本消耗存在因果或合理关联', correct: true },
          { text: '动因只能选财务指标' }
        ],
        explain: '动因解释「为什么发生成本」，可以是机器小时、订单数、换线次数等非财务量；选择标准是因果性、合理性与可计量性。'
      },

      /* ---------------- ch06 总预算 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: 'Q1 销量 10,000 件、Q2 销量 12,000 件，期末存货为下季销量的 20%，Q1 期初存货 2,000 件。Q1 产量是多少？',
        options: [
          { text: '10,400 件', correct: true },
          { text: '10,000 件' },
          { text: '12,000 件' },
          { text: '9,600 件' }
        ],
        explain: '产量 = 销量 + 期末存货 − 期初存货 = 10,000 + 2,400 − 2,000 = 10,400 件。存货政策让产量略高于销量。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-4', tier: 3, type: 'mcq', difficulty: 3, tags: ['calculation'],
        stem: 'Q1 产量 10,400 件，每件用 2 公斤材料，期末材料为下季需用量的 10%，期初材料 2,080 公斤。Q1 材料采购量是多少？',
        options: [
          { text: '21,240 公斤', correct: true },
          { text: '20,800 公斤' },
          { text: '23,040 公斤' },
          { text: '19,760 公斤' }
        ],
        explain: '耗用 20,800 + 期末 2,520（12,600 × 2 × 10%）− 期初 2,080 = 21,240 公斤。采购量要同时满足本期耗用与下期安全库存。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '变动制造费用 3 元/件，Q1 产量 10,400 件；固定制造费用每季 120,000 元，其中折旧 30,000 元。Q1 制造费用的现金支出是多少？',
        options: [
          { text: '121,200 元', correct: true },
          { text: '151,200 元' },
          { text: '91,200 元' },
          { text: '181,200 元' }
        ],
        explain: '制造费用合计 = 31,200 + 120,000 = 151,200 元；折旧不付现，现金支出 = 151,200 − 30,000 = 121,200 元。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-5', tier: 3, type: 'mcq', difficulty: 3, tags: ['calculation'],
        stem: 'Q1 期初现金 40,000 元，流入 450,000 元，流出 511,300 元。Q1 期末前现金余额是多少？',
        options: [
          { text: '−21,300 元', correct: true },
          { text: '21,300 元' },
          { text: '−11,300 元' },
          { text: '38,700 元' }
        ],
        explain: '40,000 + 450,000 − 511,300 = −21,300 元，出现资金缺口。需借款补足最低现金余额，借款后才是期末现金 38,700 元。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-6', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '弹性预算按实际业务量重算变动成本，固定成本保持不变，因此能区分规模差异与效率差异。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '静态预算按计划销量编制，实际销量不同就无法比较成本控制好坏；弹性预算把变动成本调到实际业务量，剩下的差异才反映价格与效率。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['process'],
        stem: '总预算的编制起点通常是：',
        options: [
          { text: '销售预算', correct: true },
          { text: '生产预算' },
          { text: '现金预算' },
          { text: '预计资产负债表' }
        ],
        explain: '销售预算给出销量与收款，生产、采购、人工、费用都由它推出，现金预算再把这些收付排到时间轴上，最后才是预计报表。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '编制现金预算时，下列哪些项目通常不会形成现金流出？（多选）',
        options: [
          { text: '厂房折旧', correct: true },
          { text: '无形资产摊销', correct: true },
          { text: '计提的坏账准备', correct: true },
          { text: '支付供应商货款' }
        ],
        explain: '折旧、摊销、坏账准备都是非付现费用，只影响利润不影响现金；支付货款是实打实的现金流出。现金预算只认收付实现制。'
      },

      /* ---------------- ch07 标准成本与决策 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '标准单价 5 元、实际单价 5.20 元、实际用量 29,000 公斤。材料价格差异是多少？',
        options: [
          { text: '5,800 元（不利）', correct: true },
          { text: '5,800 元（有利）' },
          { text: '2,500 元（不利）' },
          { text: '8,300 元（不利）' }
        ],
        explain: '价差 = (AP − SP) × AQ = (5.20 − 5.00) × 29,000 = 5,800 元；实际价高于标准价，为不利差异。注意乘的是实际用量。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '产量 9,500 件，标准用量 3 公斤/件，实际用量 29,000 公斤，标准单价 5 元。材料数量差异是多少？',
        options: [
          { text: '2,500 元（不利）', correct: true },
          { text: '2,500 元（有利）' },
          { text: '5,800 元（不利）' },
          { text: '1,500 元（不利）' }
        ],
        explain: '标准用量 = 9,500 × 3 = 28,500 公斤；量差 = (29,000 − 28,500) × 5 = 2,500 元，实际用量超过标准，为不利差异。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '实际工时 19,400 小时，标准工时 19,000 小时，标准工资率 20 元/小时。人工效率差异是多少？',
        options: [
          { text: '8,000 元（不利）', correct: true },
          { text: '9,700 元（不利）' },
          { text: '8,000 元（有利）' },
          { text: '400 元（不利）' }
        ],
        explain: '效率差异 = (AH − SH) × SR = (19,400 − 19,000) × 20 = 8,000 元，多用 400 小时为不利差异；工资率差异另算为 9,700 元。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-4', tier: 3, type: 'mcq', difficulty: 3, tags: ['calculation'],
        stem: '预算固定制造费用 80,000 元，实际产量 9,500 件、标准工时 2 小时/件、固定制造费用分配率 4 元/小时。产量差异是多少？',
        options: [
          { text: '4,000 元（不利）', correct: true },
          { text: '1,500 元（不利）' },
          { text: '4,000 元（有利）' },
          { text: '5,500 元（不利）' }
        ],
        explain: '已分配固定制造费用 = 9,500 × 2 × 4 = 76,000 元；产量差异 = 80,000 − 76,000 = 4,000 元（不利），反映产能利用不足。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-6', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '已经发生的研发支出属于沉没成本，在做「是否继续开发」的决策时不应计入相关成本。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '沉没成本已经发生且无法收回，不因当前决策改变，因此与决策无关。相关成本只包括未来会因决策而改变的成本与收入。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '单位变动成本 45 元，闲置产能下客户出价 50 元订 2,000 件。这笔特殊订单的增量利润是多少？',
        options: [
          { text: '10,000 元', correct: true },
          { text: '90,000 元' },
          { text: '100,000 元' },
          { text: '−10,000 元' }
        ],
        explain: '增量收入 2,000 × 50 = 100,000 元，增量成本 2,000 × 45 = 90,000 元，增量利润 10,000 元。闲置产能下无机会成本，可以接受。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些属于决策的相关成本？（多选）',
        options: [
          { text: '因接受订单而多耗用的直接材料', correct: true },
          { text: '因停产而可以避免的专属设备租金', correct: true },
          { text: '因占用瓶颈资源而放弃的正常销售贡献毛益', correct: true },
          { text: '上月已经支付且无法退回的设备款' }
        ],
        explain: '前两项是未来增量成本，第三项是机会成本，都属于相关成本；上月已付且不可退的设备款是沉没成本，与当前决策无关。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
