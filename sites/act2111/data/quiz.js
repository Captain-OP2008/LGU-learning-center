/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 每项字段：{ id:'ch01-q1', ch:'ch01', kp:'ch01-1', tier:1, type:'mcq'|'tf'|'fill'|'multi'|'predict',
 *            difficulty:1, tags:['concept'], stem, options:[{text, correct:true?}], explain }
 * predict 类型额外含 code / codeTitle / answer。
 * 本文件：8 章 × 7 题 = 56 题，题型混合，每题带 explain。
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '财务会计最核心的任务是什么？',
        options: [
          { text: '记录企业活动，并按统一规则编制报表供外部使用者决策' },
          { text: '帮企业尽量少交税' },
          { text: '预测下一年度的股价' },
          { text: '替管理层做所有经营决策', correct: true }
        ],
        explain: '财务会计把交易与事项按会计准则翻译成三张报表，服务对象是股东、债权人、监管者等外部使用者；它提供信息，不代替决策，也不以避税或预测股价为目标。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '资产负债表反映的是企业某一期间的经营成果。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '资产负债表是「时点」报表，反映某一天资产、负债与权益的存量；「某一期间的经营成果」是利润表。现金流量表则是期间的现金流入流出。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些属于本课所说的三张基本财务报表？（多选）',
        options: [
          { text: '资产负债表', correct: true },
          { text: '利润表', correct: true },
          { text: '现金流量表', correct: true },
          { text: '试算平衡表' }
        ],
        explain: '三张基本报表是资产负债表、利润表、现金流量表；权益变动表是第四张。试算平衡表只是内部查错工具，不对外的正式报表。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '写出会计恒等式的标准形式（用「资产 / 负债 / 所有者权益」三个词）。',
        answer: '资产=负债+所有者权益',
        accept: ['资产 = 负债 + 所有者权益', '资产＝负债＋所有者权益', '资产=负债+权益', '资产 = 负债 + 权益'],
        explain: '会计恒等式是资产 = 负债 + 所有者权益。它说明企业的资产由债权人和股东两类资金支撑，任何一笔交易都保持等式两边相等。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '企业用现金购买一台生产设备，在现金流量表中应归入哪一类活动？',
        options: [
          { text: '经营活动' },
          { text: '投资活动', correct: true },
          { text: '筹资活动' },
          { text: '不进入现金流量表' }
        ],
        explain: '购买长期资产属于投资活动现金流出。经营活动是日常销售与采购，筹资活动是借款、发股、分红与回购。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '企业某一年的净利润一定等于当年现金的增加额。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '净利润按权责发生制确认，含赊销、折旧等非现金项目；现金增加还受投资、筹资活动影响。两者相等只是偶然，通常需要编制现金流量表解释差异。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-8', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['method'],
        stem: '按本课的安排，学习一章最有效的顺序是？',
        options: [
          { text: '先背题库答案，再回头看正文' },
          { text: '看目标与知识地图 → 精读正文与算例 → 做自检与章节题 → 完成项目', correct: true },
          { text: '只看视频，跳过所有练习' },
          { text: '直接读教材附录的准则原文' }
        ],
        explain: '本站每章按「目标 → 正文 → 自检 → 题库 → 项目」组织：先建立框架，再用算例固化，最后用题目和项目检验是否真会。顺序颠倒会变成死记硬背。'
      },

      /* ---------------- ch01 会计恒等式与四张报表 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['calculation'],
        stem: '某企业资产总额 100,000 元、负债总额 30,000 元，其所有者权益是多少？',
        options: [
          { text: '130,000 元' },
          { text: '70,000 元', correct: true },
          { text: '30,000 元' },
          { text: '无法确定' }
        ],
        explain: '由资产 = 负债 + 所有者权益，得权益 = 100,000 − 30,000 = 70,000 元。恒等式移项是最基础的交易分析工具。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '客户提前支付了下一年度的服务费，这笔「预收收入」在资产负债表上属于？',
        options: [
          { text: '资产' },
          { text: '负债', correct: true },
          { text: '收入' },
          { text: '所有者权益' }
        ],
        explain: '预收收入（unearned revenue）是企业尚未提供服务、但已收取的款项，构成未来履约义务，因此是负债；等服务提供后再转为收入。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-7', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '企业向股东支付现金股利，在现金流量表中通常归入？',
        options: [
          { text: '经营活动现金流出' },
          { text: '投资活动现金流出' },
          { text: '筹资活动现金流出', correct: true },
          { text: '不进入现金流量表' }
        ],
        explain: '支付股利是对股东出资回报的分配，属于筹资活动。IFRS 允许把支付的股利或利息列入筹资或经营活动，但一旦选定就要一致应用。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '资产的定义要求该资源预期能为企业带来未来经济利益。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '资产的三要素是：由过去交易形成、企业控制、预期带来未来经济利益。没有未来经济利益的资源（如已报废设备）不能继续列为资产。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些通常属于流动资产？（多选）',
        options: [
          { text: '现金', correct: true },
          { text: '应收账款', correct: true },
          { text: '存货', correct: true },
          { text: '生产设备' }
        ],
        explain: '流动资产是预期在一年或一个营业周期内变现、出售或耗用的资源：现金、应收、存货、预付费用。生产设备使用超过一年，属于非流动资产。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 1, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '期末留存收益 = 期初留存收益 + 本期净利润 − 什么？（填一个词）',
        answer: '股利',
        accept: ['现金股利', '已宣告股利', 'dividends', '股利分配'],
        explain: '留存收益是历年利润留在企业内的累积额：期初余额加本期净利润，减去宣告的股利。股票股利在权益内部转账，也减少留存收益，但不减少总权益。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-8', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '财务报表附注不是报表的组成部分，可以忽略。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '附注是财务报表不可分割的一部分，说明会计政策、科目明细、或有事项与后续事项。缺了附注，报表数字往往无法比较甚至无法理解。'
      },

      /* ---------------- ch02 复式记账 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '按借贷记账规则，资产增加应记在账户的哪一方？',
        options: [
          { text: '借方', correct: true },
          { text: '贷方' },
          { text: '借贷任意一方' },
          { text: '只在期末记一次' }
        ],
        explain: '资产与费用增加记借方，减少记贷方；负债、权益与收入增加记贷方，减少记借方。口诀是「资产费用借增贷减，负债权益收入贷增借减」。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-6', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '试算平衡表借贷合计相等，能说明什么？',
        options: [
          { text: '账簿一定没有错误' },
          { text: '每笔分录借贷金额相等，但可能仍有漏记、重复或科目用错', correct: true },
          { text: '利润一定为正' },
          { text: '现金流量一定为正' }
        ],
        explain: '试算平衡只验证「借贷金额相等」这一条算术关系。整笔漏记、整笔重复、借贷方向颠倒、科目用错、双方同额记错都不会破坏平衡。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-7', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪种错误无法通过试算平衡发现？',
        options: [
          { text: '只记了借方 500 元，漏记贷方' },
          { text: '把 1,200 元写成 120 元，但只错在借方' },
          { text: '整笔交易完全漏记', correct: true },
          { text: '借方合计比贷方多 300 元' }
        ],
        explain: '整笔漏记使借贷双方同时少记相同金额，合计仍然相等，试算平衡查不出来。其余三项都会造成借贷不等或单边金额异常。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: 'T 型账户的左边是借方，右边是贷方。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '账户的标准格式是左借右贷，这一约定全球通用。T 型账户把账户简化成一个「T」，用来快速看余额方向与发生额。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'fill', difficulty: 1,
        tags: ['process'],
        stem: '会计循环中，把日记账记录抄到各分类账户的步骤叫什么？（两个字）',
        answer: '过账',
        accept: ['过帐', 'posting', '过账（posting）'],
        explain: '过账（posting）是把日记账中每笔分录的借贷金额，分别抄入对应总分类账户的过程。过账后才可能编制试算平衡表。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'multi', difficulty: 2,
        tags: ['process'],
        stem: '下面哪些步骤属于会计循环？（多选）',
        options: [
          { text: '编制日记账', correct: true },
          { text: '过账到分类账户', correct: true },
          { text: '编制试算平衡表', correct: true },
          { text: '编制审计报告' }
        ],
        explain: '会计循环包括识别交易、编日记账、过账、试算平衡、调整、编报表、结账等。审计报告由外部审计师出具，不属于企业会计循环。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-8', tier: 1, type: 'tf', difficulty: 2,
        tags: ['process'],
        stem: '工作底稿是正式财务报表，可以直接对外发布。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '工作底稿是会计人员内部的草稿工具，用来汇总调整前余额、调整分录、调整后余额并衔接报表；它不是正式报表，也不能对外发布。'
      },

      /* ---------------- ch03 权责发生制 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '在权责发生制下，企业应在什么时候确认服务收入？',
        options: [
          { text: '收到现金时' },
          { text: '服务已经提供、履约义务完成时', correct: true },
          { text: '签订合同时' },
          { text: '客户提出需求时' }
        ],
        explain: '权责发生制按「权利与义务是否发生」确认：收入在履约义务完成时确认，费用在资源耗用或义务发生时确认，与现金收付时点无关。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['journal'],
        stem: '年初预付一年租金 12,000 元，每月末应做的调整分录是？',
        options: [
          { text: '借：预付租金 1,000；贷：现金 1,000' },
          { text: '借：租金费用 1,000；贷：预付租金 1,000', correct: true },
          { text: '借：租金费用 12,000；贷：预付租金 12,000' },
          { text: '不做分录，等年末一次处理' }
        ],
        explain: '预付时先记资产（预付租金），每月耗用 12,000 ÷ 12 = 1,000 元转为费用：借租金费用、贷预付租金。年末一次处理会违反权责发生制。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-8', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['journal'],
        stem: '结账时，宣告的现金股利应结转至哪个账户？',
        options: [
          { text: '营业收入' },
          { text: '留存收益', correct: true },
          { text: '资本公积' },
          { text: '应付账款' }
        ],
        explain: '股利是对留存收益的分配，不属于费用，不进入利润表。结账时借留存收益、贷股利（或直接借留存收益、贷应付股利），减少期末留存收益。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '收付实现制下，收入按实际收到现金的期间确认。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '收付实现制（cash basis）以现金收付为准：收到现金记收入，支付现金记费用。它简单但不反映履约进度，容易跨期扭曲利润。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些属于「应计项目」（accruals）？（多选）',
        options: [
          { text: '应计工资', correct: true },
          { text: '应计利息', correct: true },
          { text: '预付租金' },
          { text: '预收收入' }
        ],
        explain: '应计项目是「已发生但未收付」：应计收入与应计费用，期末需确认。预付租金与预收收入属于「递延项目」，是已收付但未发生。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '折旧是把固定资产的成本在其使用年限内系统分摊，而不是对资产做什么？（填两个字）',
        answer: '计价',
        accept: ['估值', '重新计价', '估价'],
        explain: '折旧是成本分摊（allocation），不是资产估值。账面价值只代表未摊销成本，与市价无关；土地通常不折旧。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-7', tier: 1, type: 'tf', difficulty: 2,
        tags: ['process'],
        stem: '一笔调整分录至少影响一个资产负债表账户和一个利润表账户。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '调整分录的作用是把「未记录」的期间影响补上：一边改资产或负债，一边改收入或费用。因此必然同时触及资产负债表与利润表。'
      },

      /* ---------------- ch04 现金与应收 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '银行对账单余额 25,000 元，企业已开出但银行尚未兑付的支票 3,000 元，银行代收票据 2,000 元。调节后的银行侧余额是多少？',
        options: [
          { text: '24,000 元', correct: true },
          { text: '26,000 元' },
          { text: '30,000 元' },
          { text: '20,000 元' }
        ],
        explain: '银行侧调节：25,000 + 2,000（银行已收企业未记）− 3,000（企业已付银行未付）= 24,000 元。未兑付支票在银行侧要减。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '应收账款余额 200,000 元，按 5% 计提坏账准备，计提前准备账户已有贷方余额 1,000 元。本期应确认的坏账费用是多少？',
        options: [
          { text: '10,000 元' },
          { text: '9,000 元', correct: true },
          { text: '11,000 元' },
          { text: '1,000 元' }
        ],
        explain: '应提准备 = 200,000 × 5% = 10,000 元；已有 1,000 元，故本期补提 10,000 − 1,000 = 9,000 元。备抵法看的是「应提数减已有数」，不是直接按收入比例。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-7', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: 'IFRS 15 收入确认五步法的第一步是？',
        options: [
          { text: '识别与客户订立的合同', correct: true },
          { text: '分摊交易价格' },
          { text: '确认收入' },
          { text: '确定履约义务' }
        ],
        explain: '五步法：① 识别合同；② 识别履约义务；③ 确定交易价格；④ 分摊交易价格至各履约义务；⑤ 在履约义务完成时（或过程中）确认收入。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '用备抵法核销一笔确实无法收回的应收账款，会减少当期净利润。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '核销时借坏账准备、贷应收账款，只减少应收净额与准备余额，不进入费用，因此不影响净利润。坏账费用在计提准备的期间已经确认。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '评估应收账款质量时，下面哪些做法有用？（多选）',
        options: [
          { text: '编制账龄分析表', correct: true },
          { text: '计算应收账款周转率与周转天数', correct: true },
          { text: '比较坏账准备占应收余额的比例', correct: true },
          { text: '只看应收账款总额的绝对值' }
        ],
        explain: '账龄看结构、周转率看回收速度、准备比例看计提是否充分，三者结合才能判断质量。只看总额会被「规模增长掩盖回收恶化」误导。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 1, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: '一张面值 60,000 元、年利率 6%、期限 90 天的应收票据，到期利息是多少元？（填数字）',
        answer: '900',
        accept: ['900元', '900 元'],
        explain: '利息 = 面值 × 年利率 × 期限/360 = 60,000 × 6% × 90/360 = 900 元。商业票据通常按 360 天计息。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-8', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '在代理销售中，企业按净额（佣金）确认收入；在自营销售中，按总额确认收入。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '主责人（principal）承担存货风险与定价权，按总额确认；代理人（agent）只赚佣金，按净额确认。判断标准是「谁控制商品、谁承担主要风险」。'
      },

      /* ---------------- ch05 存货 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '采购存货时支付的运输费，在存货成本中应如何处理？',
        options: [
          { text: '计入存货成本', correct: true },
          { text: '计入销售费用' },
          { text: '计入管理费用' },
          { text: '直接冲减收入' }
        ],
        explain: '存货成本包括采购价、进口税费、运输费、装卸费等使存货达到当前状态与地点的必要支出。销售费用是存货售出后才发生的支出。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '物价持续上涨时，与加权平均法相比，FIFO 下的销货成本与期末存货分别是？',
        options: [
          { text: '销货成本偏低、期末存货偏高', correct: true },
          { text: '销货成本偏高、期末存货偏低' },
          { text: '两者都偏低' },
          { text: '两者都偏高' }
        ],
        explain: 'FIFO 先卖旧货（低价），留下新货（高价），所以销货成本偏低、期末存货偏高、利润偏高。加权平均把高低价混在一起，结果居中。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '某存货成本 2,100 元，可变现净值 1,900 元。按成本与可变现净值孰低计量，应确认的减值损失是多少？',
        options: [
          { text: '0 元' },
          { text: '200 元', correct: true },
          { text: '1,900 元' },
          { text: '2,100 元' }
        ],
        explain: 'LCNRV 下取成本 2,100 与 NRV 1,900 的较低者 1,900，减值 2,100 − 1,900 = 200 元，计入当期损益。若 NRV 回升，减值可转回，但以原成本为上限。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: 'IFRS 允许企业采用后进先出法（LIFO）计量存货。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'IAS 2 明确禁止 LIFO，因为它在物价上涨时会压低利润、并可能造成资产负债表存货严重偏离市价。US GAAP 允许 LIFO，这是两套准则的显著差异。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'fill', difficulty: 1,
        tags: ['calculation'],
        stem: '可供销售成本 = 期初存货成本 + 什么？（填两个字）',
        answer: '采购',
        accept: ['本期采购', '购货', '进货', '采购成本'],
        explain: '可供销售成本 = 期初存货 + 本期采购净额（含运输费等使存货达到可售状态的支出）。它再在销货成本与期末存货之间分配。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-7', tier: 1, type: 'multi', difficulty: 2,
        tags: ['analysis'],
        stem: '期末存货被高估，会产生哪些影响？（多选）',
        options: [
          { text: '当期销货成本被低估', correct: true },
          { text: '当期净利润被高估', correct: true },
          { text: '下期净利润可能被低估', correct: true },
          { text: '当期现金流入增加' }
        ],
        explain: '期末存货高估 → 当期销货成本低估 → 当期利润高估；这批存货在下期卖出，下期成本偏高、利润偏低。存货计价错误不影响现金流。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-8', tier: 1, type: 'tf', difficulty: 2,
        tags: ['analysis'],
        stem: '存货周转率越高越好，所以企业应把周转率无上限地提高。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '周转率过高可能意味着库存过薄、频繁缺货，损失销售与客户。合理做法是在持有成本与缺货风险之间平衡，并与行业、历史水平对照。'
      },

      /* ---------------- ch06 长期资产 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '购入设备后发生的安装调试费，应如何处理？',
        options: [
          { text: '计入设备成本并随设备折旧', correct: true },
          { text: '直接计入当期管理费用' },
          { text: '计入销售费用' },
          { text: '冲减设备原值' }
        ],
        explain: '使资产达到预定可使用状态的必要支出（运输、安装、调试、专业人员培训中与资产直接相关的部分）都应资本化，计入成本后随资产折旧。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '设备成本 100,000 元、预计使用 5 年、无残值，按双倍余额递减法，第一年折旧额是多少？',
        options: [
          { text: '20,000 元' },
          { text: '40,000 元', correct: true },
          { text: '24,000 元' },
          { text: '18,000 元' }
        ],
        explain: '双倍余额递减的折旧率 = 2 ÷ 5 = 40%，第一年按期初账面价值 100,000 × 40% = 40,000 元。它不考虑残值，但最后两年要保证账面价值不低于残值。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '设备账面价值 28,000 元，以 25,000 元出售，应确认的处置损益是？',
        options: [
          { text: '利得 3,000 元' },
          { text: '损失 3,000 元', correct: true },
          { text: '损失 25,000 元' },
          { text: '不确认损益' }
        ],
        explain: '处置损益 = 售价 − 账面价值 = 25,000 − 28,000 = −3,000 元，即损失 3,000 元。账面价值是原值减累计折旧，不是原值。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '直线法下，固定资产每年的折旧额逐年递减。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '直线法每年折旧额相同 =（成本 − 残值）÷ 使用年限。逐年递减的是双倍余额递减法，年数总和法也是递减，但直线法不是。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-6', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些通常属于无形资产？（多选）',
        options: [
          { text: '专利权', correct: true },
          { text: '商标权', correct: true },
          { text: '商誉', correct: true },
          { text: '生产设备' }
        ],
        explain: '无形资产是没有实物形态的可辨认非货币性资产：专利、商标、版权、特许权、软件；商誉不可辨认但也在无形资产项下列示。设备是固定资产。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-7', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '企业内部研究阶段的支出，会计准则要求如何处理？（填两个字：费用化 / 资本化）',
        answer: '费用化',
        accept: ['计入费用', '计入当期损益', '费用化处理'],
        explain: '研究阶段（research）支出全部费用化；开发阶段（development）只有同时满足六项条件（技术可行、意图、能力、经济利益、资源、支出可计量）才可资本化。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-8', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '商誉在使用寿命内需要每年摊销，摊销年限一般不超过 10 年。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '商誉不摊销，而是每年做减值测试；发生减值时确认损失，且减值不得转回。摊销模式适用于有确定使用寿命的无形资产。'
      },

      /* ---------------- ch07 负债与权益分析 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '按实际利率法，某期债券的利息费用应如何计算？',
        options: [
          { text: '面值 × 票面利率' },
          { text: '期初账面价值 × 市场利率', correct: true },
          { text: '期末账面价值 × 票面利率' },
          { text: '面值 × 市场利率' }
        ],
        explain: '实际利率法用「期初账面价值 × 市场利率」确认利息费用，再减去现金利息（面值 × 票面利率），差额就是折价或溢价的摊销额。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '宣告并发放小额股票股利，对股东权益总额的影响是？',
        options: [
          { text: '增加' },
          { text: '减少' },
          { text: '不变', correct: true },
          { text: '无法判断' }
        ],
        explain: '股票股利把留存收益转入股本与资本公积，权益内部一增一减，总额不变。现金股利才会减少总权益。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-6', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '间接法下，应收账款余额增加 30,000 元，应如何调整净利润？',
        options: [
          { text: '加 30,000 元' },
          { text: '减 30,000 元', correct: true },
          { text: '不调整' },
          { text: '加 15,000 元' }
        ],
        explain: '应收账款增加说明收入中有 30,000 元尚未收到现金，要从净利润中减去。规则是：资产增加减现金，资产减少加现金。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '库存股是企业的资产，应列在资产负债表资产方。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '库存股是公司回购的自身股份，不能「拥有自己」，属于股东权益的减项，以负数列示。把它当资产会同时虚增资产与权益。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-7', tier: 1, type: 'multi', difficulty: 2,
        tags: ['analysis'],
        stem: '杜邦分析把 ROE 拆成哪三个因子的乘积？（多选）',
        options: [
          { text: '净利率', correct: true },
          { text: '总资产周转率', correct: true },
          { text: '权益乘数', correct: true },
          { text: '流动比率' }
        ],
        explain: 'ROE = 净利率 × 总资产周转率 × 权益乘数，分别代表盈利能力、资产效率与财务杠杆。流动比率属于短期偿债指标，不在杜邦分解中。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '当市场利率高于债券票面利率时，债券应折价还是溢价发行？（填两个字）',
        answer: '折价',
        accept: ['折价发行', '折价'],
        explain: '投资者要求市场利率的回报，而票面利息较低，只能以低于面值的价格买入来补足收益，因此折价发行。市场利率低于票面利率时则溢价。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-8', tier: 1, type: 'tf', difficulty: 2,
        tags: ['analysis'],
        stem: '流动比率越高越好，所以企业应尽可能提高流动比率。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '流动比率过高可能意味着现金闲置、存货积压或应收回收慢，资产使用效率低。合理水平取决于行业与经营模式，不是越高越好。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
