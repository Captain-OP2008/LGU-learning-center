/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；每章 q1–q3 同时被 chXX.js 内嵌引用
 * 题型：mcq 单选 / tf 判断 / fill 填空 / multi 多选
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '管理学研究的核心问题是什么？',
        options: [
          { text: '如何通过他人把工作做成，并且做得有效', correct: true },
          { text: '如何最大化企业利润' },
          { text: '如何设计一套会计制度' },
          { text: '如何预测宏观经济走势' }
        ],
        explain: '管理学关注组织中的计划、组织、领导、控制，核心是<b>通过他人</b>有效完成工作。利润、会计、宏观预测分别是其他学科的核心问题。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: 'P-O-L-C 框架中的 O 指的是什么？',
        options: [
          { text: '组织（organizing）', correct: true },
          { text: '计划（planning）' },
          { text: '领导（leading）' },
          { text: '控制（controlling）' }
        ],
        explain: 'P-O-L-C 分别是计划、组织、领导、控制。组织职能解决的是分工、部门化、汇报关系与协调机制。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '随着管理层次上升，管理者时间分配通常发生什么变化？',
        options: [
          { text: '用于设定方向、协调跨部门的时间增加，具体技术指导减少', correct: true },
          { text: '用于一线技术操作的时间增加' },
          { text: '用于排班与设备维护的时间增加' },
          { text: '各层次的时间分配基本一致' }
        ],
        explain: '层级越高，概念技能越重要，工作越偏向方向设定、资源配置与跨部门协调；基层则更依赖技术技能。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['application'],
        stem: '读一个管理案例时，第一步最应该做什么？',
        options: [
          { text: '识别决策者面对的问题、约束与关键事实', correct: true },
          { text: '先把结论写下来' },
          { text: '先套用一个理论模型' },
          { text: '先评价当事人的对错' }
        ],
        explain: '案例阅读的顺序是「先诊断、再分析、后开方」。先套理论容易削足适履，先下结论容易忽略约束条件。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '管理学是一门只靠背概念就能拿高分的课。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '管理学考试大量使用情景题，要求把概念放到具体情境中判断。只背定义而不会用条件，往往在选择题和案例题上失分。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '本课程主教材《Management》的作者是 Robbins 与 ______。',
        answer: ['Coulter'],
        accept: ['Coulter', '库尔特', 'Mary Coulter'],
        explain: '教材为 Stephen P. Robbins 与 Mary A. Coulter 合著的《Management》（Pearson，2017）。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '明茨伯格的十种管理者角色中，下列哪些属于「信息角色」？',
        options: [
          { text: '监控者（monitor）', correct: true },
          { text: '传播者（disseminator）', correct: true },
          { text: '发言人（spokesperson）', correct: true },
          { text: '领导者（leader）' },
          { text: '谈判者（negotiator）' }
        ],
        explain: '信息角色包括监控者、传播者、发言人；领导者属于人际角色，谈判者属于决策角色。'
      },

      /* ---------------- ch01 管理与管理者 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '用更少的投入完成同样的产出，这体现的是？',
        options: [
          { text: '效率（efficiency）', correct: true },
          { text: '效果（effectiveness）' },
          { text: '效率与效果都不涉及' },
          { text: '只能说明规模更大' }
        ],
        explain: '效率关注「投入与产出的比值」，即把事做对；效果关注「目标是否达成」，即做对的事。两者可能背离。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '组织的三个基本特征不包括下列哪一项？',
        options: [
          { text: '必须以实现利润为目标', correct: true },
          { text: '有明确的目标' },
          { text: '由人组成' },
          { text: '有某种结构或协调机制' }
        ],
        explain: '组织由人组成、有共同目标、有结构。非营利组织同样符合定义，利润不是组织的必要条件。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['application'],
        stem: '经理出席行业晚宴并为公司剪彩，这主要扮演的是哪种角色？',
        options: [
          { text: '挂名首脑（figurehead）', correct: true },
          { text: '监控者（monitor）' },
          { text: '资源分配者（resource allocator）' },
          { text: '谈判者（negotiator）' }
        ],
        explain: '挂名首脑属于人际角色，履行礼仪性与象征性职责。监控者属信息角色，资源分配者与谈判者属决策角色。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '一线主管相对而言最需要哪一类技能？',
        options: [
          { text: '技术技能', correct: true },
          { text: '概念技能' },
          { text: '政治技能' },
          { text: '财务分析技能' }
        ],
        explain: '基层管理者直接指导作业，技术技能最重要；越往高层，概念技能（看清全局与关系）越关键，人际技能在各层都重要。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-7', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '管理具有普遍性，但不同层级、不同组织类型中管理工作的具体内容会有差异。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '管理的职能与逻辑具有普遍性，但时间分配、技能侧重、角色组合会随层级、规模、行业与文化而变化。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '四大管理职能中，把计划转化为分工、部门与汇报关系的是 ______。',
        answer: ['组织'],
        accept: ['组织', 'organizing', '组织职能'],
        explain: '计划定目标与路径，组织负责分工与结构，领导负责影响人，控制负责校正偏差。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-8', tier: 2, type: 'multi', difficulty: 2, tags: ['application'],
        stem: '下列哪些表现属于「把管理当控制」的常见错误？',
        options: [
          { text: '事事审批，下属没有决定空间', correct: true },
          { text: '用惩罚代替辅导，出错才出现', correct: true },
          { text: '只在下属汇报时听取信息，从不主动了解困难', correct: true },
          { text: '定期与下属做一对一沟通' },
          { text: '在授权时说明目标与边界' }
        ],
        explain: '把管理等同于控制，会表现为过度审批、惩罚导向、只在出问题时介入。定期一对一与清晰授权恰恰是纠偏做法。'
      },

      /* ---------------- ch02 决策 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '决策过程的第一步是？',
        options: [
          { text: '识别问题', correct: true },
          { text: '评估备选方案' },
          { text: '选择方案' },
          { text: '实施方案' }
        ],
        explain: '决策八步以「识别问题」开始，问题定义错了，后面所有分析都会偏。常见错误是把症状当问题。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '有限理性观点认为，决策者通常会追求？',
        options: [
          { text: '满意解（satisficing）', correct: true },
          { text: '数学上的最优解' },
          { text: '所有可能方案中的第一个' },
          { text: '完全随机的选择' }
        ],
        explain: '受信息、时间与认知限制，决策者无法穷尽所有方案，只能找到「足够好」的方案就停止搜索。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['application'],
        stem: '一个项目已投入 500 万元且明显失败，负责人因为「不能白投」而继续追加预算，这属于哪种偏见？',
        options: [
          { text: '沉没成本效应', correct: true },
          { text: '锚定效应' },
          { text: '可得性偏差' },
          { text: '框架效应' }
        ],
        explain: '沉没成本效应让人把已经无法收回的投入当作继续投入的理由。正确的问法是「如果今天从零开始，还会不会投」。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '程序化决策最适合用于？',
        options: [
          { text: '结构化、重复出现的问题', correct: true },
          { text: '从未出现过的新问题' },
          { text: '涉及重大战略转型的问题' },
          { text: '需要创造性方案的问题' }
        ],
        explain: '结构化问题有明确的触发条件与既有规则，可以用程序、政策、规则处理；非结构化问题才需要专门的分析与创造。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '在不确定性条件下，决策者能够列出所有可能结果并估计其概率。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '能列出结果并估计概率的是「风险」条件；不确定性条件下，结果或概率本身都无法可靠估计，只能依赖判断与经验。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-2', tier: 2, type: 'fill', difficulty: 2, tags: ['concept'],
        stem: '决策八步中，最容易被跳过、却决定评估是否可靠的一步是「为各标准分配 ______」。',
        answer: ['权重'],
        accept: ['权重', 'weight', '权重系数'],
        explain: '没有权重，多个标准就无法合成一个可比较的判断，评估会退化为「哪一项看起来顺眼」。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'multi', difficulty: 2, tags: ['application'],
        stem: '下列哪些做法有助于减少群体决策中的群体思维？',
        options: [
          { text: '指定一名成员专门扮演反方', correct: true },
          { text: '先匿名写下意见再讨论', correct: true },
          { text: '让领导者最后发言，避免先定调', correct: true },
          { text: '要求所有人当场表态支持' },
          { text: '只邀请观点一致的成员参加' }
        ],
        explain: '群体思维源于趋同压力。指定反方、匿名表达、领导后发言都能保护异见；强制表态与同质化成员会加剧趋同。'
      },

      /* ---------------- ch03 环境、文化与全球化 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '供应商与竞争对手通常被归入组织的？',
        options: [
          { text: '具体环境（任务环境）', correct: true },
          { text: '一般环境' },
          { text: '内部环境' },
          { text: '文化环境' }
        ],
        explain: '具体环境是与组织日常运营直接相关的部分（客户、供应商、竞争者、监管者）；一般环境包括经济、政治、社会、技术等宏观因素。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '按照「复杂程度 × 变化速度」划分，环境不确定性最高的是？',
        options: [
          { text: '复杂且动态', correct: true },
          { text: '简单且稳定' },
          { text: '简单且动态' },
          { text: '复杂且稳定' }
        ],
        explain: '元素多（复杂）且变化快（动态）时，组织最难预测与应对，需要更强的感知能力与更灵活的结构。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '强文化（strong culture）的典型特征是？',
        options: [
          { text: '核心价值观被广泛接受，成员行为高度一致', correct: true },
          { text: '公司规模大、部门多' },
          { text: '制度文件写得非常详细' },
          { text: '员工来自多个国家' }
        ],
        explain: '强文化指价值观被广泛认同并深刻影响行为。它在稳定环境中是资产，在需要快速转向时也可能成为阻力。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '同时追求全球效率与本地响应，并把能力在各地之间双向转移的全球化取向是？',
        options: [
          { text: '跨国（transnational）', correct: true },
          { text: '多国（multidomestic）' },
          { text: '全球（global）' },
          { text: '国际（international）' }
        ],
        explain: '多国取向重本地响应，全球取向重效率与标准化，国际取向把母国模式输出，跨国取向试图两者兼顾并双向学习，难度也最高。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-7', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '霍夫斯泰德的「权力距离」衡量的是一个社会接受权力不平等分配的程度。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '权力距离高，下属更接受等级差异与指令式管理；权力距离低，下属更期待参与和被平等对待。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'fill', difficulty: 2, tags: ['concept'],
        stem: '文化通过故事、仪式、符号和 ______ 等载体传递给新成员。',
        answer: ['语言'],
        accept: ['语言', 'language', '行话'],
        explain: '故事、仪式、物质符号与语言共同构成文化的社会化渠道；语言包括行话、称谓与内部笑话。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-8', tier: 2, type: 'multi', difficulty: 2, tags: ['application'],
        stem: '下列哪些属于跨文化管理中的常见错误？',
        options: [
          { text: '假设总部的做法在各市场都适用', correct: true },
          { text: '忽视当地的劳动法规与商业惯例', correct: true },
          { text: '用同一套考核标准直接评价不同文化背景的团队', correct: true },
          { text: '进入新市场前做文化尽调' },
          { text: '把原则统一、做法本地化' }
        ],
        explain: '跨文化错误多源于「以己度人」：默认普适、忽视法规、照搬考核。尽调与本地化恰恰是纠偏做法。'
      },

      /* ---------------- ch04 计划与战略 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '计划工作最基础的作用是？',
        options: [
          { text: '提供方向，并成为控制与评估的基准', correct: true },
          { text: '消除所有经营风险' },
          { text: '替代日常决策' },
          { text: '提高员工满意度' }
        ],
        explain: '计划给出目标与路径，同时提供「拿什么对照」的基准，这正是控制职能的起点。计划不能消除风险，只能让风险被看见。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['application'],
        stem: '用内部优势去抓住外部机会的 SWOT 组合策略称为？',
        options: [
          { text: 'SO 策略（增长型）', correct: true },
          { text: 'WO 策略（扭转型）' },
          { text: 'ST 策略（多元化）' },
          { text: 'WT 策略（防御型）' }
        ],
        explain: 'SO 用优势抓机会；WO 借外部机会补内部短板；ST 用优势对冲威胁；WT 收缩或退出。四个组合对应四种战略姿态。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '在 BCG 矩阵中，高市场增长率、高相对份额的业务属于？',
        options: [
          { text: '明星（star）', correct: true },
          { text: '现金牛（cash cow）' },
          { text: '问号（question mark）' },
          { text: '瘦狗（dog）' }
        ],
        explain: '明星业务增长快、份额高，通常需要持续投入以维持位置；现金牛低增长高份额，用于提供现金流。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '「夹在中间」（stuck in the middle）指的是？',
        options: [
          { text: '既没有成本优势，也没有足够的差异化', correct: true },
          { text: '同时服务多个细分市场' },
          { text: '既做国内又做海外市场' },
          { text: '同时采用进攻与防守策略' }
        ],
        explain: '波特认为企业必须明确选择成本领先、差异化或聚焦之一。两头都不占，就会在价格与价值上同时被夹击。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '目标应当写得尽量模糊，以便给执行者留出灵活空间。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '可考核的目标需要明确对象、标准、时限与责任人。模糊目标无法评估、也无法据此分配资源，只会把分歧推到执行阶段。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'fill', difficulty: 2, tags: ['concept'],
        stem: '只针对某一特定项目使用一次的计划，称为 ______ 计划。',
        answer: ['单一用途'],
        accept: ['单一用途', '单次', 'single-use'],
        explain: '单一用途计划（如项目预算、专项方案）用完即止；常备计划（政策、程序、规则）则反复使用。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-8', tier: 2, type: 'multi', difficulty: 2, tags: ['application'],
        stem: '下列哪些是战略落地失败的常见原因？',
        options: [
          { text: '目标没有分解到部门与个人', correct: true },
          { text: '预算与人力没有跟着战略调整', correct: true },
          { text: '只向下传达数字，不解释为什么', correct: true },
          { text: '缺少季度复盘与纠偏机制', correct: true },
          { text: '在制定阶段就让一线参与讨论' }
        ],
        explain: '战略失败多发生在「最后一公里」：目标不分解、资源不匹配、沟通只剩指标、没有复盘。让一线参与制定恰恰能减少落地阻力。'
      },

      /* ---------------- ch05 组织结构 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '管理幅度（span of control）指的是？',
        options: [
          { text: '一名管理者直接有效管理的下属数量', correct: true },
          { text: '一个部门的总人数' },
          { text: '组织层级的数量' },
          { text: '跨部门协作的项目数' }
        ],
        explain: '幅度决定层级：幅度宽则层级少、更扁平；幅度窄则层级多、监督更密，但沟通链更长、成本更高。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '把零售业务分为「大客户部」与「中小客户部」，属于哪种部门化？',
        options: [
          { text: '客户部门化', correct: true },
          { text: '职能部门化' },
          { text: '地区部门化' },
          { text: '流程部门化' }
        ],
        explain: '按服务对象划分是客户部门化，优点是贴合需求，代价是同一客户可能被多个部门重复接触。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '有机式组织（organic structure）的典型特征是？',
        options: [
          { text: '规则较少、决策分散、横向沟通多', correct: true },
          { text: '层级多、审批链长' },
          { text: '高度正规化、以书面流程为主' },
          { text: '所有决策集中于总部' }
        ],
        explain: '机械式靠规则与层级，适合稳定环境；有机式靠横向沟通与自主判断，适合需要快速响应的环境。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '矩阵结构最主要的挑战是？',
        options: [
          { text: '双重汇报带来的权责冲突与协调成本', correct: true },
          { text: '部门数量太少' },
          { text: '无法共享专业人才' },
          { text: '决策速度一定比职能制慢' }
        ],
        explain: '矩阵让员工同时向职能经理与项目经理汇报，能共享人才、加快响应，但必须事先划清决策权、冲突处理与考核归属。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '环境越不确定，组织结构越应当偏向机械式。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '不确定性高时需要更快感知与响应，应偏向有机式；机械式适合稳定、可预测的环境。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-9', tier: 2, type: 'fill', difficulty: 2, tags: ['concept'],
        stem: '在 RACI 责任矩阵中，每项任务应当有且只有一个 ______（最终问责人）。',
        answer: ['A'],
        accept: ['A', '问责人', 'accountable'],
        explain: 'A 只能有一个，否则出现问题时无人真正负责；R 可以有多个，C 与 I 按需设置。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-8', tier: 2, type: 'multi', difficulty: 2, tags: ['application'],
        stem: '下列哪些属于常见的「结构病」？',
        options: [
          { text: '部门墙：各管一段，接口处无人负责', correct: true },
          { text: '双重汇报失效：矩阵中两个上级都以为对方在管', correct: true },
          { text: '空壳岗位：有职位名称却没有明确产出', correct: true },
          { text: '为跨部门接口指定唯一对接人' },
          { text: '把交付物与升级路径写清楚' }
        ],
        explain: '结构病通常出现在接口与责任上。指定对接人、写清交付物与升级路径，正是预防手段。'
      },

      /* ---------------- ch06 人力资源、团队与激励 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '人力资源管理链条的第一步通常是？',
        options: [
          { text: '人力资源规划', correct: true },
          { text: '发布招聘广告' },
          { text: '设计薪酬结构' },
          { text: '组织入职培训' }
        ],
        explain: '先规划「需要多少人、什么能力、何时到位」，后面的招聘、甄选、培训才有依据。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '结构化面试相对非结构化面试的主要优势是？',
        options: [
          { text: '问题与评分标准统一，可比性更强、偏差更小', correct: true },
          { text: '可以更自由地了解候选人的个性' },
          { text: '耗时更短，不需要准备' },
          { text: '完全不受面试官主观影响' }
        ],
        explain: '结构化面试用同一套问题与锚点评分，提高信度与可比性；但它减少偏差，不等于完全消除主观判断。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '在双因素理论中，薪酬与工作条件通常属于？',
        options: [
          { text: '保健因素', correct: true },
          { text: '激励因素' },
          { text: '成长因素' },
          { text: '成就因素' }
        ],
        explain: '保健因素不足会引起不满，充足也不会带来持久激励；激励因素（成就、认可、责任、成长）才直接推动投入。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '期望理论认为，激励水平取决于？',
        options: [
          { text: '期望 × 工具性 × 效价', correct: true },
          { text: '能力 × 机会' },
          { text: '薪酬 × 工龄' },
          { text: '目标难度 × 反馈频率' }
        ],
        explain: '三者任一为零，激励即为零：不相信能做到（期望低）、做到也换不来结果（工具性低）、或结果对自己不重要（效价低）。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '团队在震荡期出现较多冲突，属于正常发展阶段。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '形成期礼貌、震荡期冲突、规范期建立规则、执行期产出、解散期收尾。震荡期有冲突是正常的，关键是把冲突引向任务而非人身。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'fill', difficulty: 2, tags: ['concept'],
        stem: '团队规模扩大后，个人努力程度反而下降的现象称为 ______。',
        answer: ['社会惰化'],
        accept: ['社会惰化', 'social loafing', '搭便车'],
        explain: '社会惰化源于责任分散与贡献不可见。明确分工、公开进度、按贡献评价可以有效减弱。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-8', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '工作特征模型（JCM）的核心工作特征包括哪些？',
        options: [
          { text: '技能多样性', correct: true },
          { text: '任务完整性', correct: true },
          { text: '自主性', correct: true },
          { text: '反馈', correct: true },
          { text: '薪酬水平' }
        ],
        explain: 'JCM 的五个核心特征是技能多样性、任务完整性、任务重要性、自主性与反馈，它们通过关键心理状态影响内在动机。薪酬不属于工作特征。'
      },

      /* ---------------- ch07 领导、沟通与控制 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '领导与管理的核心差别在于？',
        options: [
          { text: '领导更侧重方向与影响，管理更侧重秩序与效率', correct: true },
          { text: '领导不需要对人负责' },
          { text: '管理只存在于企业' },
          { text: '两者完全等同' }
        ],
        explain: '管理通过计划、结构、控制建立秩序；领导通过愿景、影响力与动员带来变化。优秀的组织两者都需要。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['application'],
        stem: '因为某人在专业领域水平高而愿意听从其意见，这属于哪种权力？',
        options: [
          { text: '专家权力', correct: true },
          { text: '法定权力' },
          { text: '奖赏权力' },
          { text: '强制权力' }
        ],
        explain: '专家权力来自知识与能力，参照权力来自认同与吸引，法定、奖赏、强制则来自职位与资源。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '在活动开始之前就介入、防止问题发生的控制类型是？',
        options: [
          { text: '事前控制（feedforward control）', correct: true },
          { text: '同期控制' },
          { text: '事后控制' },
          { text: '预算控制' }
        ],
        explain: '事前控制作用于输入（人、财、物、标准），同期控制作用于过程，事后控制作用于结果。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '变革型领导（transformational leadership）的典型做法是？',
        options: [
          { text: '用愿景激励、以身作则，并关注个体成长', correct: true },
          { text: '以奖惩交换绩效' },
          { text: '完全放手，不做任何干预' },
          { text: '只关注短期指标' }
        ],
        explain: '交易型领导以奖惩交换，变革型领导通过理想化影响、愿景激励、智力激发与个体关怀提升动机层次。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '在渠道丰富度上，面对面沟通通常高于电子邮件。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '面对面能同时传递语言、语气、表情与即时反馈，丰富度最高；邮件缺少语气与即时反馈，适合传递事实与留痕。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-8', tier: 2, type: 'fill', difficulty: 2, tags: ['concept'],
        stem: '控制过度、对细节层层干预的管理方式通常被称为 ______。',
        answer: ['微观管理'],
        accept: ['微观管理', 'micromanagement', 'micromanaging'],
        explain: '微观管理会压缩下属的判断空间，导致依赖与隐瞒。控制应设在关键节点与例外上，而不是每个动作。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些属于常见的沟通障碍？',
        options: [
          { text: '过滤：下级只报上级想听的部分', correct: true },
          { text: '选择性知觉：按自己的期待理解信息', correct: true },
          { text: '情绪：情绪激动时难以准确表达与接收', correct: true },
          { text: '语义差异：同一词语双方理解不同', correct: true },
          { text: '确认：复述对方意思以核对理解' }
        ],
        explain: '过滤、选择性知觉、情绪与语义差异都会扭曲信息。复述确认是克服障碍的方法，不是障碍本身。'
      },
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
