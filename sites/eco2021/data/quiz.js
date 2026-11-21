/* =====================================================================
 * quiz.js · ECO2021 分章题库（8 章 × 7 题 = 56 题）
 * 结构：{ items: [{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options:[{text, correct?}], answer?, accept?, explain }] }
 * type：mcq（单选）、tf（判断）、multi（多选）、fill（填空）
 * 规则：mcq/tf 恰好一个 correct；multi ≥2 个 correct；fill 提供 answer 与 accept。
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      { id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '宏观经济学与微观经济学最核心的区别是什么？',
        options: [
          { text: '宏观研究总体变量及其相互关系，微观研究个体决策与市场', correct: true },
          { text: '宏观不使用模型，微观使用模型' },
          { text: '宏观只研究货币，微观只研究价格' },
          { text: '微观只研究企业，宏观只研究家庭' }
        ],
        explain: '两者都使用模型与优化假设，区别在分析层面：宏观关注 GDP、通胀、失业等总量，微观关注单个市场与个体选择。' },
      { id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '宏观经济学认为失业只是个人不愿工作的结果，因此不需要公共政策干预。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '宏观经济学把失业分为摩擦性、结构性与周期性，其中周期性失业来自总需求不足，政策可以通过总需求管理缓解。' },
      { id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '经济模型为什么要做简化假设？',
        options: [
          { text: '为了突出关键机制，使复杂现实可以被分析', correct: true },
          { text: '为了完全复制现实的所有细节' },
          { text: '为了证明所有政策都有效' },
          { text: '为了替代数据收集' }
        ],
        explain: '模型是地图而非领土：假设剔除次要因素，保留与研究问题相关的机制，因此假设是否合理要看问题而定。' },
      { id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'multi', difficulty: 1, tags: ['concept'],
        stem: '下列哪些属于宏观经济学研究的总体变量？',
        options: [
          { text: '国内生产总值', correct: true },
          { text: '通货膨胀率', correct: true },
          { text: '失业率', correct: true },
          { text: '某一家企业的季度利润' }
        ],
        explain: 'GDP、通胀率、失业率都是总量指标；单个企业的利润属于微观或会计问题，但所有企业利润加总才进入宏观分析。' },
      { id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'mcq', difficulty: 2, tags: ['method'],
        stem: '「政府应当把通胀目标设定为 2%」这句话属于哪类表述？',
        options: [
          { text: '规范表述，包含价值判断', correct: true },
          { text: '实证表述，可以被数据直接检验' },
          { text: '会计恒等式' },
          { text: '统计定义' }
        ],
        explain: '「应当」包含价值判断，属于规范表述；实证表述回答「是什么」，规范表述回答「应该怎样」。' },
      { id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '宏观经济学中最常用的总产出指标是____。',
        answer: 'GDP',
        accept: ['国内生产总值', 'GDP', 'gdp'],
        explain: 'GDP 是国内生产总值，衡量一国境内一定时期内生产的最终产品与服务价值，是宏观分析的核心总量。' },
      { id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '关于短期波动与长期增长，下列哪项正确？',
        options: [
          { text: '短期波动主要由总需求与总供给的互动决定，长期增长由资本、劳动与技术决定', correct: true },
          { text: '两者由完全相同的力量决定' },
          { text: '短期增长只看技术进步，长期只看需求' },
          { text: '长期增长只由货币政策决定' }
        ],
        explain: '短期价格黏性使需求冲击影响产出；长期价格灵活，产出回到潜在水平，增长由供给侧因素决定。' },

      /* ---------------- ch01 度量 ---------------- */
      { id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['calculation'],
        stem: '农民卖小麦 100 元、面粉厂卖面粉 150 元、面包房卖面包 250 元，用生产法计算的 GDP 是多少？',
        options: [
          { text: '250 元', correct: true },
          { text: '500 元' },
          { text: '400 元' },
          { text: '300 元' }
        ],
        explain: '生产法只计最终产品价值，或各环节增加值之和：100 + 50 + 100 = 250 元；直接相加销售额会重复计算中间产品。' },
      { id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '某国名义 GDP 为 9,360，按基年价格计算的实际 GDP 为 7,740，GDP 平减指数约为多少？',
        options: [
          { text: '120.9', correct: true },
          { text: '82.7' },
          { text: '100.0' },
          { text: '160.0' }
        ],
        explain: '平减指数 = 名义 GDP ÷ 实际 GDP × 100 = 9,360 ÷ 7,740 × 100 ≈ 120.9，表示物价相对基年上涨约 20.9%。' },
      { id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: 'CPI 与 GDP 平减指数的一个关键差别是：',
        options: [
          { text: 'CPI 包含进口消费品，平减指数只覆盖国内生产', correct: true },
          { text: 'CPI 只覆盖资本品，平减指数只覆盖消费品' },
          { text: '两者权重完全相同' },
          { text: '平减指数包含进口品，CPI 不包含' }
        ],
        explain: 'CPI 篮子包含居民购买的进口商品，GDP 平减指数只反映国内生产的最终产品价格，因此两者对油价与汇率的敏感度不同。' },
      { id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '失业率等于失业人数除以劳动年龄人口。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '失业率的分母是劳动力（就业者加正在求职的失业者），不是全部劳动年龄人口；后者对应的是失业人口占劳动年龄人口的比率。' },
      { id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '若实际 GDP 低于潜在 GDP，则产出缺口为：',
        options: [
          { text: '负值，经济存在闲置资源', correct: true },
          { text: '正值，经济过热' },
          { text: '零，经济处于均衡' },
          { text: '无法判断' }
        ],
        explain: '产出缺口 = 实际 GDP − 潜在 GDP；负缺口表示资源未充分利用、失业高于自然率，通常伴随通胀下行压力。' },
      { id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '比较各国居民实际生活水平时，更合适的口径是：',
        options: [
          { text: '按购买力平价换算的人均 GDP', correct: true },
          { text: '按市场汇率换算的 GDP 总量' },
          { text: '按市场汇率换算的人均 GDP' },
          { text: '各国本币 GDP 直接比较' }
        ],
        explain: 'PPP 换算考虑了非贸易品价格差异，更接近实际购买力；市场汇率更适合比较贸易、债务与跨境投资规模。' },
      { id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '失业率的分母是____。',
        answer: '劳动力',
        accept: ['劳动力人数', '劳动力人口', '劳动人口'],
        explain: '劳动力 = 就业人数 + 失业人数，不包括退出劳动力队伍的人；因此参与率下降会让失业率「假性改善」。' },

      /* ---------------- ch02 长期增长 ---------------- */
      { id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '按七十法则，年增长 5% 时人均收入翻倍约需多少年？',
        options: [
          { text: '14 年', correct: true },
          { text: '10 年' },
          { text: '35 年' },
          { text: '70 年' }
        ],
        explain: '翻倍时间约等于 70 ÷ 增长率（%）= 70 ÷ 5 = 14 年；这条法则来自 ln2 ≈ 0.693 的近似。' },
      { id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 3, tags: ['calculation'],
        stem: '在 y = A·k^0.3 中，若人均资本增加 10%、A 不变，人均产出约增加：',
        options: [
          { text: '3%', correct: true },
          { text: '10%' },
          { text: '30%' },
          { text: '0.3%' }
        ],
        explain: '人均产出按资本的 α 次方增长：1.1^0.3 ≈ 1.029，即约 3%；资本份额 α 决定资本深化的产出弹性。' },
      { id: 'ch02-q3', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'mcq', difficulty: 3, tags: ['calculation'],
        stem: '资本存量年增 6%、劳动年增 1%、TFP 年增 2%、α = 0.3，总产出年增约为：',
        options: [
          { text: '4.5%', correct: true },
          { text: '9%' },
          { text: '2%' },
          { text: '3.5%' }
        ],
        explain: '增长核算：2% + 0.3×6% + 0.7×1% = 4.5%；人均增长为 2% + 0.3×5% = 3.5%。' },
      { id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '在索洛模型中，提高储蓄率可以永久提高人均产出的增长率。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '储蓄率提高只提升稳态水平，转型期增长暂时加快，到达新稳态后人均增长回到技术进步率，只有水平效应。' },
      { id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '「条件收敛」的含义是：',
        options: [
          { text: '控制储蓄率、教育、制度等变量后，初始收入越低的国家增长越快', correct: true },
          { text: '所有国家最终收入水平完全相同' },
          { text: '穷国一定比富国增长快' },
          { text: '富国永远比穷国增长快' }
        ],
        explain: '绝对收敛不普遍，但控制结构变量后穷国有更快的追赶速度；缺少这些条件时，收敛不会自动发生。' },
      { id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 1, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些因素会提高全要素生产率（TFP）？',
        options: [
          { text: '工艺与技术创新', correct: true },
          { text: '管理效率与供应链优化', correct: true },
          { text: '劳动力从低效农业转向高效制造业', correct: true },
          { text: '单纯增加机器数量而不改变技术' }
        ],
        explain: 'TFP 衡量同样投入能生产多少产出；技术、管理与资源配置改善都提高 TFP，单纯堆资本属于资本深化。' },
      { id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '判断一个国家是否陷入「中等收入陷阱」，最应关注：',
        options: [
          { text: 'TFP 增速是否持续下滑、产业升级是否停滞', correct: true },
          { text: 'GDP 总量是否排在世界前列' },
          { text: '短期 CPI 是否低于 2%' },
          { text: '股市是否创新高' }
        ],
        explain: '中等收入陷阱的核心是低成本优势消失后缺乏创新与效率提升；TFP 贡献、人均收入区间与产业升级比总量或短期物价更能说明问题。' },

      /* ---------------- ch03 储蓄与金融 ---------------- */
      { id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 3, tags: ['calculation'],
        stem: '封闭经济中，Y = 1,000、C = 650、G = 220、T = 200，则私人储蓄、公共储蓄与投资分别为：',
        options: [
          { text: '150、−20、130', correct: true },
          { text: '350、−20、330' },
          { text: '150、20、170' },
          { text: '130、−20、150' }
        ],
        explain: '私人储蓄 = Y − T − C = 150；公共储蓄 = T − G = −20；国民储蓄 = 130，封闭经济中等于投资。' },
      { id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '政府赤字扩大在可贷资金市场中首先表现为：',
        options: [
          { text: '国民储蓄供给左移，利率上升、投资减少', correct: true },
          { text: '投资需求右移，利率与投资同时上升' },
          { text: '储蓄供给右移，利率下降' },
          { text: '投资需求左移，利率下降' }
        ],
        explain: '赤字使公共储蓄为负，国民储蓄供给减少（左移），均衡利率上升、投资被挤出；这是供给移动，不是需求移动。' },
      { id: 'ch03-q3', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'mcq', difficulty: 3, tags: ['calculation'],
        stem: '年利率 5% 时，五年后 10,000 元的现值约为：',
        options: [
          { text: '7,835 元', correct: true },
          { text: '8,000 元' },
          { text: '9,500 元' },
          { text: '12,763 元' }
        ],
        explain: 'PV = 10,000 ÷ 1.05^5 ≈ 7,835 元；折现率越高、期限越长，现值越低。' },
      { id: 'ch03-q4', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['calculation'],
        stem: '名义利率为 5%、通胀率为 3%，实际利率约为：',
        options: [
          { text: '2%', correct: true },
          { text: '8%' },
          { text: '5%' },
          { text: '−2%' }
        ],
        explain: '费雪方程近似为 r ≈ i − π = 5% − 3% = 2%；精确式为 (1+i)/(1+π) − 1。' },
      { id: 'ch03-q5', ch: 'ch03', kp: 'ch03-6', tier: 1, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '挤出效应意味着政府支出增加会一比一地完全替代私人投资。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '挤出是部分替代，程度取决于投资对利率的敏感度、经济是否接近充分就业以及货币政策是否配合；并非一比一。' },
      { id: 'ch03-q6', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '银行要求借款人提供抵押品，主要是为了缓解：',
        options: [
          { text: '逆向选择', correct: true },
          { text: '通货膨胀' },
          { text: '流动性过剩' },
          { text: '财政赤字' }
        ],
        explain: '抵押品让借款人承担违约损失，降低「最想借钱的人最可能还不上」的逆向选择问题；贷后监督则针对道德风险。' },
      { id: 'ch03-q7', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '封闭经济中，国民储蓄恒等于____。',
        answer: '投资',
        accept: ['投资支出', 'I', '总投资'],
        explain: '由 Y = C + I + G 移项得 I = Y − C − G = 国民储蓄；这是会计恒等式，不是行为假设。' },

      /* ---------------- ch04 货币与通胀 ---------------- */
      { id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '下列哪一项不是货币的职能？',
        options: [
          { text: '生产资本品', correct: true },
          { text: '交易媒介' },
          { text: '计价单位' },
          { text: '价值储藏' }
        ],
        explain: '货币的三大职能是交易媒介、计价单位与价值储藏；生产资本品是投资行为，不是货币职能。' },
      { id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '准备金率为 10% 时，1,000 元初始存款在简单模型下最终可创造多少存款？',
        options: [
          { text: '10,000 元', correct: true },
          { text: '1,100 元' },
          { text: '9,000 元' },
          { text: '100,000 元' }
        ],
        explain: '货币乘数 = 1 ÷ 0.1 = 10，存款总额 = 1,000 × 10 = 10,000 元；现实中现金漏出与超额准备金会使乘数变小。' },
      { id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '货币供给年增 10%、实际产出年增 3%、流通速度不变，长期通胀约为：',
        options: [
          { text: '7%', correct: true },
          { text: '13%' },
          { text: '3%' },
          { text: '10%' }
        ],
        explain: '增长率形式：π ≈ gM + gV − gY = 10% + 0 − 3% = 7%；这是长期关系，短期可能因闲置产能而偏离。' },
      { id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些属于通货膨胀的成本？',
        options: [
          { text: '鞋底成本', correct: true },
          { text: '菜单成本', correct: true },
          { text: '相对价格扭曲', correct: true },
          { text: '提高实际产出' }
        ],
        explain: '通胀带来鞋底成本、菜单成本、相对价格扭曲与财富再分配；它不会自动提高实际产出，恶性通胀反而压低产出。' },
      { id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '费雪效应表明，若预期通胀上升 2 个百分点，长期名义利率通常会：',
        options: [
          { text: '上升约 2 个百分点', correct: true },
          { text: '下降约 2 个百分点' },
          { text: '保持不变' },
          { text: '下降 4 个百分点' }
        ],
        explain: '名义利率 = 实际利率 + 预期通胀；实际利率由实际因素决定，预期通胀上升会一比一推高名义利率。' },
      { id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '央行在公开市场买入国债，最直接的效果是：',
        options: [
          { text: '基础货币增加，银行体系流动性上升', correct: true },
          { text: '基础货币减少，利率上升' },
          { text: '政府税收增加' },
          { text: '货币乘数下降' }
        ],
        explain: '买入国债向银行体系投放准备金，基础货币增加；乘数不变时货币供给扩张，短期利率下行。' },
      { id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '零利率下限意味着央行无法再把名义政策利率大幅下调。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '名义利率不能显著低于零，因为人们可持有现金；此时常规降息空间耗尽，需要 QE、前瞻指引或财政政策。' },

      /* ---------------- ch05 短期波动 ---------------- */
      { id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '短期总供给曲线向上倾斜的主要原因是：',
        options: [
          { text: '价格与工资存在黏性，调整滞后', correct: true },
          { text: '资本存量固定不变' },
          { text: '消费者偏好稳定' },
          { text: '政府支出不变' }
        ],
        explain: '黏性使物价上升时工资与成本未同步调整，企业利润空间扩大、增加产出；长期价格灵活，曲线变为垂直。' },
      { id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '物价水平下降导致消费增加，这在 AD-AS 模型中表现为：',
        options: [
          { text: '沿总需求曲线向右下方移动', correct: true },
          { text: '总需求曲线右移' },
          { text: '总供给曲线左移' },
          { text: '长期总供给曲线右移' }
        ],
        explain: '物价是纵轴变量，其变化引起沿曲线移动；只有物价以外的因素（信心、财政、货币）才使 AD 曲线整体移动。' },
      { id: 'ch05-q3', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: 'MPC = 0.8 时，政府购买乘数约为：',
        options: [
          { text: '5', correct: true },
          { text: '4' },
          { text: '1.25' },
          { text: '0.8' }
        ],
        explain: '政府购买乘数 = 1 ÷ (1 − MPC) = 1 ÷ 0.2 = 5；税收乘数为 −MPC/(1−MPC) = −4。' },
      { id: 'ch05-q4', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '石油价格大幅上涨最可能造成：',
        options: [
          { text: '短期总供给左移，产出下降、物价上升', correct: true },
          { text: '总需求右移，产出与物价同时上升' },
          { text: '长期总供给右移，物价下降' },
          { text: '总需求左移，产出与物价同时下降' }
        ],
        explain: '能源是生产成本，涨价使 SRAS 左移，形成「滞胀」：产出下降与通胀上升同时出现，政策面临两难。' },
      { id: 'ch05-q5', ch: 'ch05', kp: 'ch05-7', tier: 1, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '长期菲利普斯曲线是垂直的，因此长期不存在通胀与失业的取舍。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '长期预期通胀会与实际一致，失业回到自然率；只有短期、未被预期到的通胀才可能降低失业。' },
      { id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '下列哪项属于自动稳定器？',
        options: [
          { text: '累进所得税与失业保险', correct: true },
          { text: '临时基建投资' },
          { text: '一次性消费券' },
          { text: '央行降息' }
        ],
        explain: '自动稳定器无需立法即可逆周期调节：衰退时税收自动减少、失业救济自动增加；基建与消费券属于相机抉择。' },
      { id: 'ch05-q7', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'fill', difficulty: 2, tags: ['calculation'],
        stem: 'MPC = 0.75 时，政府购买乘数为____。',
        answer: '4',
        accept: ['4.0', '四'],
        explain: '乘数 = 1 ÷ (1 − 0.75) = 4；边际消费倾向越高，乘数越大。' },

      /* ---------------- ch06 政策 ---------------- */
      { id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '丁伯根法则的核心含义是：',
        options: [
          { text: '实现 N 个独立目标至少需要 N 个独立工具', correct: true },
          { text: '目标越多，工具越少越好' },
          { text: '财政政策永远优于货币政策' },
          { text: '央行应同时盯住所有目标' }
        ],
        explain: '一个工具只能实现一个独立目标；多个目标需要多个工具，否则必然顾此失彼。' },
      { id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '判断财政立场时应看：',
        options: [
          { text: '结构性赤字，剔除经济周期影响', correct: true },
          { text: '当年赤字绝对额' },
          { text: '政府债务总额' },
          { text: '税收总收入' }
        ],
        explain: '衰退时周期性赤字自动扩大，不代表财政扩张；结构性赤字剔除周期因素，才反映相机抉择的财政立场。' },
      { id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'mcq', difficulty: 3, tags: ['calculation'],
        stem: '债务/GDP 为 100%、实际利率 3%、增长率 5%、基本盈余为 0，则债务比率将：',
        options: [
          { text: '每年下降约 2 个百分点', correct: true },
          { text: '每年上升约 2 个百分点' },
          { text: '保持不变' },
          { text: '每年上升约 8 个百分点' }
        ],
        explain: 'Δd ≈ (r − g)×d − s = (3% − 5%)×100% − 0 = −2%，即债务比率每年下降约 2 个百分点。' },
      { id: 'ch06-q4', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'mcq', difficulty: 3, tags: ['calculation'],
        stem: '泰勒规则中 r* = 0.5%、通胀 4%、目标 2%、产出缺口 0，建议政策利率约为：',
        options: [
          { text: '5.5%', correct: true },
          { text: '4.5%' },
          { text: '6.5%' },
          { text: '2.5%' }
        ],
        explain: 'i = r* + π + 0.5(π − π*) + 0.5×缺口 = 0.5 + 4 + 0.5×2 = 5.5%。' },
      { id: 'ch06-q5', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '规则派认为，任何情况下都应机械执行规则，不允许央行保留任何灵活空间。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '主流折中是「有约束的相机抉择」：公开目标与反应函数，同时保留应对金融危机、疫情等异常冲击的空间。' },
      { id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '央行独立性有助于降低通胀，主要因为：',
        options: [
          { text: '它减少了政府制造意外通胀的政治激励', correct: true },
          { text: '它让央行不再需要关注就业' },
          { text: '它取消了财政政策' },
          { text: '它固定了汇率' }
        ],
        explain: '政府有减轻债务、刺激选举前经济的动机；独立央行更能抵抗这种压力，从而锚定通胀预期。' },
      { id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 1, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '2008、2020、2022 三轮危机给政策制定者的共同教训包括：',
        options: [
          { text: '危机中先止血、保流动性', correct: true },
          { text: '临时政策要有退出框架', correct: true },
          { text: '要关注救助的分配后果与政治可持续性', correct: true },
          { text: '危机后应永久维持零利率' }
        ],
        explain: '前三项是共同教训；永久零利率会催生泡沫与通胀，不是可持续的政策，2022 年的加息周期即为纠正。' },

      /* ---------------- ch07 开放经济 ---------------- */
      { id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '名义汇率 7.2 元/美元，中国商品 100 元，美国同类商品 20 美元，实际汇率约为：',
        options: [
          { text: '1.44', correct: true },
          { text: '0.72' },
          { text: '2.00' },
          { text: '144' }
        ],
        explain: 'ε = e × P*/P = 7.2 × 20 ÷ 100 = 1.44，表示外国商品相对本国商品贵 44%，数值上升为实际升值。' },
      { id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '若国民储蓄率为 20%、投资率为 25%，则经常账户大约为：',
        options: [
          { text: '逆差 5% 的 GDP', correct: true },
          { text: '顺差 5% 的 GDP' },
          { text: '平衡' },
          { text: '顺差 45% 的 GDP' }
        ],
        explain: 'CA = S − I = 20% − 25% = −5%，即经常账户逆差，需要向外国借入相当于 GDP 5% 的资源。' },
      { id: 'ch07-q3', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '购买力平价在短期容易偏离，主要原因不包括：',
        options: [
          { text: '两国利率完全相同', correct: true },
          { text: '非贸易品价格差异' },
          { text: '运输成本与关税' },
          { text: '品牌溢价与产品差异' }
        ],
        explain: 'PPP 偏离来自非贸易品、运输成本、关税与产品差异；利率相同与否不是 PPP 偏离的原因，利率平价是另一个理论。' },
      { id: 'ch07-q4', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '不可能三角指下列哪三项不能同时实现？',
        options: [
          { text: '资本自由流动、固定汇率、货币政策独立性', correct: true },
          { text: '经济增长、物价稳定、充分就业' },
          { text: '储蓄、投资、消费' },
          { text: '出口、进口、外汇储备' }
        ],
        explain: '三者最多选两个：资本自由流动加固定汇率会丧失货币政策独立性；要保留独立性就必须让汇率浮动或限制资本流动。' },
      { id: 'ch07-q5', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '在浮动汇率与资本自由流动下，财政扩张的效果通常被放大。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '财政扩张推高利率、吸引资本流入、本币升值、净出口下降，部分抵消扩张效果；浮动汇率下货币政策效果被放大。' },
      { id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '长期看，提高关税以减少贸易逆差通常：',
        options: [
          { text: '不改变经常账户总量，只改变贸易结构', correct: true },
          { text: '大幅减少逆差并增加国民储蓄' },
          { text: '必然引发通胀下降' },
          { text: '提高出口竞争力' }
        ],
        explain: '经常账户由 S − I 决定；关税减少进口的同时本币升值、出口下降，总量回到原水平，变化的是结构与分配。' },
      { id: 'ch07-q7', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'fill', difficulty: 2, tags: ['concept'],
        stem: '在不可能三角中，资本自由流动与固定汇率意味着放弃____。',
        answer: '货币政策独立性',
        accept: ['货币政策独立', '独立货币政策', '货币政策自主性'],
        explain: '为维持固定汇率，央行必须跟随外国利率买卖外汇，无法用利率调节国内经济，即丧失货币政策独立性。' }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
