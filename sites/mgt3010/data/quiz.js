/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；每章 q1–q7，ch00–ch07 内嵌题取 q1–q3
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['framework'],
        stem: '本课程把全球商务拆成三个基本问题。下列哪一项<b>不属于</b>这三个问题？',
        options: [
          { text: '企业为什么要跨国经营（why）' },
          { text: '在哪里竞争、进入哪个市场（where）' },
          { text: '用什么方式进入并组织起来（how）' },
          { text: '如何保证每一次跨国投资都不亏损', correct: true }
        ],
        explain: '三个问题是「为什么跨国、在哪里竞争、怎么进入并组织」。最后一个选项不是分析问题，而是不可能达成的结果承诺——全球商务研究的是如何在不确定条件下做取舍，不是消除风险。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['framework'],
        stem: '本站七章的顺序是「全球化 → 正式制度 → 非正式制度 → 贸易与投资 → 外汇 → 一体化与进入 → 战略组织」。制度两章排在贸易与投资之前，主要理由是：',
        options: [
          { text: '制度决定交易成本与风险，是贸易与投资决策的前提', correct: true },
          { text: '制度章节的公式最多，必须先学' },
          { text: '制度内容考试占比最高' },
          { text: '制度分析与后面的章节没有关系，只是习惯顺序' }
        ],
        explain: '制度差异决定了「同样的生意在不同国家成本与风险差多少」。不先看清制度，后面的比较优势、进入模式、汇率风险都缺少约束条件，容易得出「哪里成本低就去哪里」的简单结论。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '「半全球化」意味着各国市场已经高度一体化，跨境套利机会基本消失。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '半全球化（semiglobalization）恰恰指跨境一体化只走到一半：部分要素可以流动、部分不能，套利机会仍然存在但受制度与距离限制。它反对「世界是平的」这种完全一体化假设。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'mcq', difficulty: 1, tags: ['framework'],
        stem: 'CAGE 距离框架的四个维度是：',
        options: [
          { text: '文化、行政、地理、经济', correct: true },
          { text: '成本、敏捷、治理、环境' },
          { text: '顾客、能力、竞争、渠道' },
          { text: '资本、资产、增长、效率' }
        ],
        explain: 'CAGE 是 Cultural、Administrative、Geographic、Economic 的首字母。它把「距离」拆成四类可核查的差异，避免只用地埋距离或语言差异来判断市场难度。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'mcq', difficulty: 1, tags: ['case'],
        stem: '案例分析推荐五步的第一步是：',
        options: [
          { text: '先界定决策问题与决策者是谁', correct: true },
          { text: '先列出所有可能的解决方案' },
          { text: '先查清公司的全部财务数据' },
          { text: '先写结论，再找证据支持' }
        ],
        explain: '案例分析的起点是「谁要做什么决策」。决策者与决策时点不同，需要的信息、可接受的方案与评价标准都不同。先写结论再找证据，容易把案例做成事后合理化。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'tf', difficulty: 1, tags: ['course'],
        stem: '本站每章固定采用「开篇 + 七个小节」的结构，资料库只收录本课程的两本教材 PDF。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '这是本站的编写口径：每章七个小节对应七个知识点，便于对照复习；资料库只放课程实际提供的两本教材，不额外编造文献或页码。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'multi', difficulty: 2, tags: ['method'],
        stem: '按本站建议，下列哪些复习做法是有效的？（多选）',
        options: [
          { text: '先读每章开篇的「为什么重要」，带着问题读小节', correct: true },
          { text: '用每章末尾的清单逐条自测，答不上来的回到对应小节', correct: true },
          { text: '把所有术语的中英文对照抄一遍，并各配一个例子', correct: true },
          { text: '只背结论，跳过案例里的数字与条件' }
        ],
        explain: '前三项分别对应「带着问题读、按清单自测、术语配例子」，都是主动加工。只背结论在选择题上可能勉强过关，但一遇到「某企业该选哪种进入方式」这类情境题就会失效。'
      },

      /* ---------------- ch01 全球化 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '「国际化」与「全球化」的区别，下列表述最准确的是：',
        options: [
          { text: '国际化是企业跨国经营程度提高的过程，全球化是各国经济相互依存、规则趋同的结果', correct: true },
          { text: '国际化指大企业，全球化指中小企业' },
          { text: '国际化只发生在制造业，全球化只发生在服务业' },
          { text: '两者完全同义，可以互换' }
        ],
        explain: '国际化（internationalization）描述企业层面的跨国扩张；全球化（globalization）描述国家与市场层面的相互依存与趋同。企业可以国际化而世界并未全球化，反之亦然。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['history'],
        stem: '最近一波全球化浪潮（约 1980 年代以后）最主要的两个驱动力是：',
        options: [
          { text: '运输与通信成本大幅下降，以及多国政策转向贸易投资自由化', correct: true },
          { text: '全球人口快速增长与耕地面积扩大' },
          { text: '金本位制度恢复与固定汇率回归' },
          { text: '各国普遍提高关税以保护本国产业' }
        ],
        explain: '技术（集装箱、航空、通信与互联网）压低了跨境交易成本，政策（关税下降、外资开放、区域协定）降低了制度壁垒。两者叠加，才使全球价值链的分工成为可能。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '半全球化的观点认为，跨境一体化已经完成，制度差异对企业已不构成成本。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '半全球化强调一体化只完成了一部分：贸易与资本流动增加，但劳动力流动、监管统一、语言与文化差异仍然存在，制度差异依旧是跨境经营的主要成本来源。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'mcq', difficulty: 1, tags: ['motive'],
        stem: '一家服装企业把工厂设在越南，主要是为了利用当地较低的生产成本。这属于哪类对外投资动因？',
        options: [
          { text: '效率寻求（efficiency seeking）', correct: true },
          { text: '市场寻求（market seeking）' },
          { text: '资源寻求（resource seeking）' },
          { text: '战略资产寻求（strategic asset seeking）' }
        ],
        explain: '效率寻求指把生产环节放到成本更低的地方，以降低成本、提升效率；资源寻求指获取矿产、能源等自然资源；市场寻求指靠近客户；战略资产寻求指获取品牌、技术、渠道等能力。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '「外来者劣势」（liability of foreignness）最典型的来源是：',
        options: [
          { text: '不熟悉本地制度、关系网络与消费者习惯，因而承担本地企业不必承担的成本', correct: true },
          { text: '外资企业规模一定比本地企业小' },
          { text: '外资企业的产品质量一定更差' },
          { text: '外资企业无法使用本国的管理经验' }
        ],
        explain: '外来者劣势是「身份带来的额外成本」：规则不熟、关系要从零建立、总部与本地沟通成本高、在东道国合法性较低。它与企业能力无关，即使管理很强也无法完全消除。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'multi', difficulty: 2, tags: ['debate'],
        stem: '全球化批评者常提出的问题包括哪些？（多选）',
        options: [
          { text: '低工资与弱环境标准被用来压低成本', correct: true },
          { text: '跨国企业把利润转移到低税地，侵蚀税基', correct: true },
          { text: '本土文化被全球品牌同质化', correct: true },
          { text: '所有参与全球化的国家都必然同等受益' }
        ],
        explain: '前三项是常见的三类批评：劳工与环境标准、税收与利润转移、文化与生活方式同质化。最后一项与事实相反，收益分配不均正是争议的核心。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '判断一家企业是否属于跨国公司（MNE），最关键的依据是：',
        options: [
          { text: '在多个国家拥有并控制增值活动，而不只是把产品卖到国外', correct: true },
          { text: '出口额占营业收入的比重超过一半' },
          { text: '在海外设有代表处或代理商' },
          { text: '员工中有外籍人士' }
        ],
        explain: '跨国公司的判定看「是否在海外拥有并控制增值活动」（生产、研发、服务、销售实体）。单纯出口或委托代理只涉及交易，不构成跨国经营的组织形态。'
      },

      /* ---------------- ch02 正式制度 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['law'],
        stem: '世界上主要的三大法律传统是：',
        options: [
          { text: '普通法、大陆法、宗教法（含伊斯兰法）', correct: true },
          { text: '宪法、刑法、民法' },
          { text: '成文法、判例法、国际法' },
          { text: '英美法、苏联法、习惯法' }
        ],
        explain: '三大法律传统是普通法（判例为基础）、大陆法（成文法典为基础）、宗教法（以宗教经典与解释为基础）。它们对合同、产权、投资者保护的处理方式不同，直接影响交易成本。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['law'],
        stem: '与大陆法系相比，普通法系在商业纠纷中的典型特点是：',
        options: [
          { text: '更依赖先例与法官裁量，合同条款往往写得更细以覆盖各种情形', correct: true },
          { text: '所有商业纠纷都由行政机关裁决' },
          { text: '合同只需要口头约定即可生效' },
          { text: '法官不能参考以往判决' }
        ],
        explain: '普通法以判例积累规则，法官在具体事实上有较大裁量空间，因此合同需要更详尽的条款与定义来降低不确定性；大陆法以法典条文为主，解释空间相对集中。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['politics'],
        stem: '关于政治体制与政策可预测性，下列说法较准确的是：',
        options: [
          { text: '民主体制政策受选举周期影响、方向可能摆动，但程序相对透明；集权体制决策快、方向可能突变', correct: true },
          { text: '民主体制政策永远稳定，集权体制政策永远混乱' },
          { text: '政治体制对企业经营没有任何影响' },
          { text: '只有集权体制才会出现征收外资的情况' }
        ],
        explain: '两种体制各有不确定性来源：民主体制的摆动来自选举与利益集团，集权体制的突变来自决策集中。企业要做的是识别不确定性类型，而不是给体制贴好坏标签。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'tf', difficulty: 1, tags: ['economy'],
        stem: '在指令经济中，价格主要由市场供求关系决定。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '指令经济由中央计划配置资源、制定价格；价格由市场供求决定的是市场经济。现实中的经济体大多是混合经济，两者成分并存，判断时要看具体行业与管制程度。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'multi', difficulty: 2, tags: ['risk'],
        stem: '下列哪些属于企业应纳入评估的国家风险？（多选）',
        options: [
          { text: '征收、国有化或强制转让股权', correct: true },
          { text: '政策突变，如突然提高关税或收紧外资准入', correct: true },
          { text: '资本管制与利润汇出限制', correct: true },
          { text: '竞争对手推出了新产品' }
        ],
        explain: '前三项都是东道国政治与制度层面的风险，属于国家风险的范畴；竞争对手推新品是商业风险，与国别制度无关，应放在竞争分析里。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['corruption'],
        stem: '东道国官僚体系腐败程度较高时，企业最合理的应对是：',
        options: [
          { text: '重新评估进入方式，倾向低承诺模式或引入本地合规伙伴，并预设退出条件', correct: true },
          { text: '按当地惯例支付好处费，因为这是必要的经营成本' },
          { text: '假装不知道，让本地员工自行处理' },
          { text: '加大投资，用规模优势抵消腐败成本' }
        ],
        explain: '腐败会提高交易成本、增加法律风险（包括母国《反海外腐败法》类法规的域外管辖）。合理做法是降低承诺、加强合规与本地伙伴筛选，而不是默认「入乡随俗」。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'tf', difficulty: 2, tags: ['finance'],
        stem: '制度分析只与法务部门有关，不需要写进项目的财务假设。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '制度差异最终会体现为成本与风险：许可周期、合规投入、税务争议、汇率管制、征收概率，都应转化为现金流与折现率假设。只写在法务备忘录里，决策层看不到。'
      },

      /* ---------------- ch03 非正式制度 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['culture'],
        stem: '霍夫斯泰德文化维度中的「权力距离」（power distance）指的是：',
        options: [
          { text: '一个社会中地位较低者接受权力被不平等分配的程度', correct: true },
          { text: '两国之间的地理距离' },
          { text: '企业总部与子公司之间的管理跨度' },
          { text: '收入分配的基尼系数' }
        ],
        explain: '权力距离衡量的是对等级与不平等的接受度。高权力距离社会中，下属较少挑战上级、决策集中；低权力距离社会中，参与式沟通更常见。它是社会层面的统计特征，不能直接套到个人。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['management'],
        stem: '在集体主义倾向较强的文化中设计激励机制，通常更有效的是：',
        options: [
          { text: '以团队绩效为主，兼顾个人贡献，避免公开制造内部排名', correct: true },
          { text: '只奖励个人销售冠军，并在全员大会上公布排名' },
          { text: '取消所有考核，完全平均分配' },
          { text: '只按工龄发奖金' }
        ],
        explain: '集体主义文化更看重群体和谐与面子，过度强调个人排名会破坏协作、让员工回避风险。团队指标为主、个人贡献为辅，既保留激励又降低社会摩擦。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'tf', difficulty: 2, tags: ['culture'],
        stem: '霍夫斯泰德的国别得分可以直接用来判断某一位具体员工的行为倾向。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '这是典型的「生态谬误」：国别得分描述的是社会分布的平均趋势，个体差异可能远大于国家间差异。正确用法是提示「哪些差异值得核查」，而不是给个人贴标签。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['language'],
        stem: '爱德华·霍尔（Edward Hall）所说的高语境文化，其沟通特点是：',
        options: [
          { text: '大量信息藏在情境、关系与非语言线索中，话不必说透', correct: true },
          { text: '所有信息都必须写在合同里，越明确越好' },
          { text: '只使用一种语言' },
          { text: '沟通时必须避免任何礼貌用语' }
        ],
        explain: '高语境沟通依赖共同背景与关系，含蓄、重面子；低语境沟通依赖明确的语言表述，合同条款写得细。跨国团队冲突常源于两种风格错配，而非态度问题。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'multi', difficulty: 2, tags: ['religion'],
        stem: '宗教主要通过哪些渠道影响企业经营？（多选）',
        options: [
          { text: '工作时间、节假日与休假安排', correct: true },
          { text: '饮食禁忌与产品成分、包装设计', correct: true },
          { text: '对利息、保险与金融产品的接受度', correct: true },
          { text: '企业的注册资本最低限额' }
        ],
        explain: '宗教影响作息、消费禁忌、金融合规与审美偏好；注册资本属于公司法范畴，由正式制度规定，与宗教无直接关系。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['culture'],
        stem: '关于「文化距离」的正确用法是：',
        options: [
          { text: '把它当作提示清单，指出哪些差异需要实地核查，而不是预测具体行为', correct: true },
          { text: '文化距离越大，投资一定越失败' },
          { text: '文化距离可以用两国直线距离精确计算' },
          { text: '文化距离只与语言是否相同有关' }
        ],
        explain: '文化距离是启发式工具：它提醒你注意权力距离、沟通风格、宗教习俗等差异点，但差异是否构成障碍取决于行业、合作方式与具体人群，必须实地验证。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['culture'],
        stem: '把文化分成「价值观—规范—外显物」三层，其主要用途是：',
        options: [
          { text: '提醒管理者：看得见的差异（外显物）容易模仿，深层价值观最难改变', correct: true },
          { text: '证明文化差异无法测量' },
          { text: '说明只有外显物才需要管理' },
          { text: '把文化简化为饮食习惯' }
        ],
        explain: '外显物（服饰、礼仪、办公布局）最容易观察与模仿，规范（什么行为被认可）次之，价值观（什么值得追求）最深、变化最慢。跨文化管理若要见效，必须触及规范与价值观，而不只是改表面。'
      },

      /* ---------------- ch04 贸易与 FDI ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['trade'],
        stem: '比较优势理论的核心是：',
        options: [
          { text: '各国应专业化生产机会成本较低的产品，通过交换双方都能获益', correct: true },
          { text: '只有绝对成本最低的国家才能出口' },
          { text: '贸易是零和游戏，一方获利必然另一方受损' },
          { text: '一国应生产所有自己需要的产品，避免依赖' }
        ],
        explain: '比较优势看的是机会成本而非绝对成本。即使一国在所有产品上都更贵，它仍应生产自己相对不那么吃亏的产品，通过贸易获益。绝对优势只是比较优势的特例。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['theory'],
        stem: '按产品生命周期理论，一项新产品从发明国走向全球生产的典型顺序是：',
        options: [
          { text: '发明国生产并出口 → 海外设厂生产 → 成本优势国生产并反向出口', correct: true },
          { text: '先在发展中国家生产 → 再出口到发达国家' },
          { text: '始终在发明国生产，不向外转移' },
          { text: '先在第三国代工，再回到发明国销售' }
        ],
        explain: '产品生命周期理论认为，新产品先在发明国生产并出口；成熟后技术扩散，海外设厂以靠近市场、绕开壁垒；标准化后成本成为关键，生产转向低成本国家并反向出口。它解释了 FDI 替代贸易的时点。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['policy'],
        stem: '关税与进口配额的主要区别是：',
        options: [
          { text: '关税给政府带来财政收入，配额的租金归持配额者，且配额的数量限制更直接', correct: true },
          { text: '关税没有成本，配额有成本' },
          { text: '配额能增加政府税收，关税不能' },
          { text: '两者完全等价，只是名称不同' }
        ],
        explain: '关税通过价格机制限制进口，收入归政府；配额直接限制数量，配额权利本身有市场价值（配额租金），归获得配额的主体。配额的不透明性更强，也更容易滋生寻租。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'multi', difficulty: 2, tags: ['fdi'],
        stem: '哪些情况会推动企业从「出口」转向「对外直接投资」？（多选）',
        options: [
          { text: '运输成本高或产品体积大、易损', correct: true },
          { text: '关税与非关税壁垒提高了出口成本', correct: true },
          { text: '东道国要求本地化生产或本地持股才能进入', correct: true },
          { text: '本国的会计年度发生变化' }
        ],
        explain: '运输成本、贸易壁垒、本地化要求都是「出口失效」的典型触发条件，此外还有市场规模足够大以支撑本地产能、需要快速响应客户等。会计年度变化与投资区位无关。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['oli'],
        stem: 'OLI 框架中的 L 指的是：',
        options: [
          { text: '区位优势（location advantage）', correct: true },
          { text: '学习能力（learning advantage）' },
          { text: '杠杆效应（leverage advantage）' },
          { text: '本地化程度（localization advantage）' }
        ],
        explain: 'OLI 是所有权优势（O）、区位优势（L）、内部化优势（I）。O 解释「为什么是你」，L 解释「为什么去那里」，I 解释「为什么自己干而不是授权」。三者同时成立，FDI 才是合理选择。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'tf', difficulty: 2, tags: ['fdi'],
        stem: '外资进入带来的技术溢出会自动发生，东道国企业无需具备吸收能力。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '技术溢出需要东道国企业具备吸收能力（人力资本、研发投入、管理水平），也需要人员流动、供应链联系等渠道。缺少吸收能力时，外资可能只是形成「孤岛」，溢出有限。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['decision'],
        stem: '在「出口还是投资」的决策中，第一步应当做的是：',
        options: [
          { text: '明确目标与约束，先排除法律上不可行的选项', correct: true },
          { text: '先比较各国的劳动力成本' },
          { text: '先选定进入方式，再找理由支持' },
          { text: '先看竞争对手在哪里设厂' }
        ],
        explain: '决策要先定目标（收入、成本、资源、学习）与硬约束（外资准入、持股上限、外汇管制），把不可行的选项先排除，再在剩余方案里比较成本与风险。顺序颠倒会用精细测算掩盖方向错误。'
      },

      /* ---------------- ch05 外汇 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['fx'],
        stem: '在直接标价法下（例如「1 美元 = 7.1 人民币」），数字从 7.1 变成 7.3 意味着：',
        options: [
          { text: '人民币贬值，出口企业收美元换回的人民币更多', correct: true },
          { text: '人民币升值，出口企业收入减少' },
          { text: '美元贬值，进口企业成本下降' },
          { text: '汇率没有变化，只是标价方式不同' }
        ],
        explain: '直接标价用本币表示一单位外币的价格。数字变大说明买一美元需要更多人民币，即本币贬值。此时出口收汇折成本币增加，进口付汇成本上升。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['policy'],
        stem: '「三元悖论」指的是下列三者中最多只能同时实现两个：',
        options: [
          { text: '资本自由流动、固定汇率、货币政策独立性', correct: true },
          { text: '低通胀、低失业、高增长' },
          { text: '出口、进口、外汇储备' },
          { text: '关税、配额、补贴' }
        ],
        explain: '三元悖论（不可能三角）说明：要保持固定汇率又要资本自由流动，就必须放弃利率自主；要保留货币政策独立性又要资本自由流动，汇率必须浮动。任何汇率制度安排都是在这三者中选两个。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['fx'],
        stem: '关于购买力平价（PPP）与利率平价，下列说法较准确的是：',
        options: [
          { text: 'PPP 更适合解释长期汇率水平，短期汇率更多受利差与资本流动影响', correct: true },
          { text: 'PPP 能精确预测下一季度的汇率' },
          { text: '利率平价认为高利率货币必然升值' },
          { text: '两者都只适用于固定汇率制度' }
        ],
        explain: 'PPP 依赖商品套利，受不可贸易品、运输成本与壁垒限制，只在长期有解释力；短期汇率由资本流动、利差与预期主导。利率平价则说明高利率货币远期通常贴水，而非必然升值。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'tf', difficulty: 2, tags: ['hedging'],
        stem: '企业做远期结汇不需要支付任何成本，因此优于期权。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '远期的成本隐含在远期点数里：若本币利率高于外币利率，远期卖出外币的价格会低于即期。此外远期锁死汇率，放弃了汇率有利变动带来的收益，这也是机会成本。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['risk'],
        stem: '折算风险（translation exposure）的典型特征是：',
        options: [
          { text: '影响合并报表的账面金额，但不直接改变现金流', correct: true },
          { text: '直接导致当期现金收入减少' },
          { text: '只影响企业的出口报价' },
          { text: '与汇率完全无关' }
        ],
        explain: '折算风险来自海外子公司报表折算成母公司报告货币，影响净资产、利润与财务比率，但现金并未实际收付。它会通过股价、贷款契约与考核指标产生间接影响。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'multi', difficulty: 2, tags: ['hedging'],
        stem: '下列哪些属于「自然对冲」的做法？（多选）',
        options: [
          { text: '在收入所在国本地采购、本地发薪', correct: true },
          { text: '用海外收入直接支付海外费用', correct: true },
          { text: '在本地融资，而不是从母公司借入外币', correct: true },
          { text: '买入美元看跌期权锁定结汇价格' }
        ],
        explain: '自然对冲是让收入与支出的币种匹配，不依赖金融工具；买入期权属于金融对冲。先做自然对冲，再用金融工具处理剩余净敞口，成本最低。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['history'],
        stem: '布雷顿森林体系走向解体的标志性事件是：',
        options: [
          { text: '1971 年美国停止美元兑换黄金，随后主要货币转向浮动', correct: true },
          { text: '1944 年国际货币基金组织成立' },
          { text: '1999 年欧元开始记账' },
          { text: '2008 年全球金融危机' }
        ],
        explain: '布雷顿森林体系实行美元与黄金挂钩、其他货币与美元挂钩。1971 年美元停止兑换黄金，1973 年主要货币转浮动，1976 年牙买加协定正式承认浮动汇率合法化。'
      },

      /* ---------------- ch06 一体化与进入 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['integration'],
        stem: '自由贸易区与关税同盟的关键区别是：',
        options: [
          { text: '关税同盟对外实行统一关税，自贸区各成员国保留各自对外关税', correct: true },
          { text: '自贸区允许人员自由流动，关税同盟不允许' },
          { text: '关税同盟不需要原产地规则，自贸区需要' },
          { text: '两者没有任何区别' }
        ],
        explain: '自贸区内部取消关税但各自保留对外关税，因此需要原产地规则防止转口套利；关税同盟在此基础上进一步统一对外关税，转口套利的空间被消除，但关税制定权让渡给了共同体。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-1', tier: 2, type: 'mcq', difficulty: 2, tags: ['rules'],
        stem: '自贸区需要原产地规则，主要目的是：',
        options: [
          { text: '防止外部商品从关税最低的成员国进入后免税转销其他成员国', correct: true },
          { text: '统计成员国的进出口总额' },
          { text: '限制成员国之间的贸易量' },
          { text: '统一成员国的增值税税率' }
        ],
        explain: '若各成员国对外关税不同，外部商品会先进入关税最低的国家，再免税卖到其他成员国，形成「贸易绕道」。原产地规则规定商品须在成员国内增值达到一定比例，才能享受优惠关税。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['welfare'],
        stem: '「贸易转移」（trade diversion）指的是：',
        options: [
          { text: '一体化后原本从成本最低的第三国进口，改从成本较高的成员国进口', correct: true },
          { text: '成员国之间的贸易量下降' },
          { text: '本国生产替代了进口' },
          { text: '关税收入转移给消费者' }
        ],
        explain: '贸易转移是把进口来源从效率最高的第三国换成享受优惠的成员国，全球资源效率下降；贸易创造则是用成本更低的成员国生产替代本国高成本生产，效率提高。净福利取决于两者大小。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'multi', difficulty: 2, tags: ['entry'],
        stem: '下列哪些进入方式的资源承诺相对较低？（多选）',
        options: [
          { text: '出口', correct: true },
          { text: '许可（licensing）', correct: true },
          { text: '特许经营（franchising）', correct: true },
          { text: '全资绿地建厂' }
        ],
        explain: '出口、许可、特许都以较少资本投入进入海外市场，退出也相对容易；全资绿地建厂投入最大、退出最难。资源承诺低通常意味着控制力弱，这是同一枚硬币的两面。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['entry'],
        stem: '某国规定外资在零售行业持股不得超过 49%。此时最可行的进入方式是：',
        options: [
          { text: '与本地企业合资，由本地伙伴持有多数股权', correct: true },
          { text: '设立全资子公司并申请豁免' },
          { text: '直接出口，不需要考虑股权限制' },
          { text: '放弃该国市场，不存在其他方式' }
        ],
        explain: '持股上限直接排除全资子公司；合资是在法律约束下仍能进入的方式，代价是控制权共享与伙伴冲突风险。出口虽可行，但零售业的核心是本地渠道与门店运营，出口无法替代。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'tf', difficulty: 2, tags: ['entry'],
        stem: '交钥匙工程不存在培养未来竞争者的风险。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '交钥匙工程把整套设施与技术移交给东道国客户，客户由此获得运营能力，未来可能成为同一市场上的竞争者，甚至带着更低的成本优势。这是交钥匙模式被讨论最多的战略代价。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['timing'],
        stem: '下列哪种情形最支持「先发进入」？',
        options: [
          { text: '市场会出现赢家通吃，且学习曲线陡峭、规则相对稳定', correct: true },
          { text: '规则频繁变动，监管方向不明' },
          { text: '市场需求尚未验证，技术路线可能被替代' },
          { text: '本地已有强势 incumbent（在位者）占据全部渠道' }
        ],
        explain: '先发优势来自抢渠道、建品牌、定标准与学习曲线。若存在赢家通吃、学习效应强、规则稳定，先发的收益大；若规则不稳或需求未验证，先发容易成为「试验品」，后发更稳。'
      },

      /* ---------------- ch07 战略与组织 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['strategy'],
        stem: '「全球战略」（global strategy）最适合的条件是：',
        options: [
          { text: '全球整合压力高、本地响应压力低', correct: true },
          { text: '全球整合压力低、本地响应压力高' },
          { text: '两个压力都很低' },
          { text: '两个压力都很高' }
        ],
        explain: '全球战略靠标准化产品、集中生产与统一品牌获取规模经济，适用于整合压力高、响应压力低的行业。两个压力都高时应追求跨国战略，都低时国际战略即可。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['strategy'],
        stem: '跨国战略（transnational strategy）实践中最主要的困难是：',
        options: [
          { text: '要同时做到全球效率与本地响应，协调成本高，管理稍松就退化为四不像', correct: true },
          { text: '它不需要任何本地化投入' },
          { text: '它只适用于小国市场' },
          { text: '它要求放弃规模经济' }
        ],
        explain: '跨国战略试图兼顾效率、响应与全球学习，需要双重矩阵、共享指标与知识流动机制，协调成本极高。若机制不到位，常见结果是「标准化没做成、本地化也不彻底」。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['organization'],
        stem: '矩阵结构最大的管理风险是：',
        options: [
          { text: '双重汇报导致指令冲突与责任模糊，决策变慢', correct: true },
          { text: '海外业务被完全放弃' },
          { text: '无法进入任何外国市场' },
          { text: '产品线被迫全部标准化' }
        ],
        explain: '矩阵让产品线与区域双线汇报，理论上兼顾两个维度，但冲突时谁说了算必须提前写清（权限表、升级机制、共同指标）。否则会议开不完，责任也追不到人。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'tf', difficulty: 2, tags: ['tax'],
        stem: '设计转移定价时只需考虑集团整体税负，不必考虑各单元的考核与激励。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '转移定价同时决定各国税负与各单元报表利润。把利润都留在总部，区域公司就没有积极性；留在区域，总部又看不清真实盈利能力。税务合规与考核公平必须一起设计。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'multi', difficulty: 2, tags: ['alignment'],
        stem: '本章的一致性检查包括下列哪些问题？（多选）',
        options: [
          { text: '战略与市场是否匹配（对两个压力的判断有证据吗）', correct: true },
          { text: '结构与战略是否匹配（选了全球战略却按区域设完整事业部？）', correct: true },
          { text: '考核与战略是否匹配（KPI 奖励的行为是战略需要的行为吗）', correct: true },
          { text: '公司品牌主色是否在全球统一' }
        ],
        explain: '五问是：战略与市场、结构与战略、考核与战略、能力与承诺、风险与缓冲。品牌主色属于执行细节，不构成战略一致性检查的层级。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['marketing'],
        stem: '应对平行进口（灰色市场）较有效的做法是：',
        options: [
          { text: '做产品版本与保修条款差异化，并配合区域授权与渠道管理', correct: true },
          { text: '只在合同里写「禁止转售」' },
          { text: '全球统一定价，不区分市场' },
          { text: '完全退出低价市场' }
        ],
        explain: '平行进口的根源是价差大于转售成本。合同禁止难以跨境执行，有效做法是让产品在不同市场不可完全替代（版本、包装、保修、语言），再配合授权渠道与供应链追踪。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['hr'],
        stem: '外派人员提前回国的失败，最常见的原因是：',
        options: [
          { text: '配偶与家庭不适应，以及跨文化管理能力不足', correct: true },
          { text: '专业技术能力不够' },
          { text: '外语考试成绩不达标' },
          { text: '总部薪酬给得太高' }
        ],
        explain: '外派失败多与家庭适应、文化融入、管理风格错配有关，而非专业能力。因此选拔要看跨文化适应性与家庭意愿，配套要有着陆支持、 mentor 与回流机制，而不只是语言培训。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
