/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'eng2002s',
  short: 'ENG2002S',
  name: '理工科英语交流',
  en: 'English for Science and Engineering Communication',
  dept: '人文与语言',
  lang: 'text',
  langLabel: 'English',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'ENG2002S // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... ENG2002S',
    '> loading 8 modules ...',
    '> calibrating glossary & quiz bank ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '从读懂一篇论文，到在面试里讲清自己。',
  missionEn: 'ENG2002S · 8 MODULES · 3 ASSESSED TEXTS',
  missionTitle: '从零开始<br><em>理工科英语交流 全掌握</em>',
  lede: '这门课不教「高级词汇」，而教一套可重复的写作与表达流程：先判断受众、目的与体裁，再把句子写到准确、简洁、可核查，最后把同一套论证用到报告、提案、演讲与求职材料里。每章配术语表、对照表、常见错误、自检清单与分章题库。',
  searchPlaceholder: 'QUERY // 搜索章节、术语、句型与题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录下的 ENG2002S 文件夹，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/ENG2002S/',
  resources: {
    note: '以下均为 CUHKSZ ENG2002S 的真实课程资料，按「大纲与评分标准—阅读与文本分析—课堂讲义—求职与面试」四组排列。写作业前先读评分标准，再对照讲义与样例，比反复猜要求有效。',
    groups: [
      {
        name: '大纲与评分标准',
        note: '先看课程大纲确认两个作业的比例与周次，再逐条读评分标准：评分表就是写作任务书。',
        items: [
          { title: 'ENG2002S 课程大纲（2024–25 T2，v009）', path: '考试资料/ENG2002S_v009_241021_AY2024_25_T2_Final.docx', kind: 'docx', note: '3 学分、先修 ENG2001；A1 提案 50%、A2 作品集 40%、参与 10%。' },
          { title: 'Assessment 2 完整说明（作品集与面试）', path: '学习资料/ENG2002S_Assessment_2_Professional_portfolio_and_interview_ENG2002_Professional_Portfolio_and_Job_Interview_Instructions.docx', kind: 'docx', note: 'Part A 求职信与简历各一页，Part B 小组面试 15–25 分钟。' },
          { title: 'A2 作品集评分标准', path: '学习资料/ENG2002S_Assessment_2_Professional_portfolio_and_interview_ENG2002_Professional_Portfolio_Scoring_Rubric.docx', kind: 'docx', note: '对照它检查求职信与简历的匹配度、证据与格式。' },
          { title: 'A1 书面提案评分标准', path: '作业习题/ENG2002S_Technical_Written_Proposal_Scoring_Rubric.docx', kind: 'docx', note: '语言 20%、内容与组织 70%、格式与引用 10%，逐项都有描述。' },
          { title: 'A1 提案口头展示评分标准', path: '作业习题/ENG2002S_Technical_Proposal_Presentation_Scoring_Rubric.docx', kind: 'docx', note: '内容与组织 40%、声音与身体 40%、语法词汇 10%、问答 10%。' },
          { title: 'A1 提案任务说明', path: '作业习题/ENG2002S_Technical_Proposal_Instructions.docx', kind: 'docx', note: '选题范围、篇幅、提交方式与展示时长。' }
        ]
      },
      {
        name: '阅读与文本分析',
        note: '第一周的三篇同题文本是理解「受众决定语言」的最好材料：两篇科普、一篇期刊论文，对照读差异。',
        items: [
          { title: 'Reading 1：Pet Physics（科普）', path: '学习资料/ENG2002S_Week_01_Reading_1_Pet_Physics.pdf', kind: 'pdf', note: '面向普通读者的短篇科普，观察它如何解释术语。' },
          { title: 'Reading 2：The Physics of How Cats Drink（科普）', path: '学习资料/ENG2002S_Week_01_Reading_2_The_Physics_of_How_Cats_Drink.pdf', kind: 'pdf', note: '比第一篇多一层研究过程，适合分析「证据如何出现」。' },
          { title: 'Reading 3：How Cats Lap Water（期刊论文）', path: '学习资料/ENG2002S_Week_01_Reading_3_How_Cats_Lap_Water_Uptake_by_Felis_catus.pdf', kind: 'pdf', note: '方法、数据与限制齐全，用来对比学术语域与科普语域。' },
          { title: '三篇文本对比工作表', path: '学习资料/ENG2002S_Week_01_Text_Comparison_Worksheet.docx', kind: 'docx', note: '按受众、目的、证据、语言四栏做对比，可直接当 ch01 的练习。' }
        ]
      },
      {
        name: '课堂讲义',
        note: '讲义按周次排列；写作业卡住时，先回到对应周的讲义看老师给的框架与样例。',
        items: [
          { title: 'Week 1：技术交流导论', path: '学习资料/ENG2002S_Week_01_Session_1.pptx', kind: 'pptx', note: '交流三角形、受众与目的、体裁分析入门。' },
          { title: 'Week 2：清晰度、衔接与定义', path: '学习资料/ENG2002S_Week_02_session_1_Complete.pptx', kind: 'pptx', note: 'given-new、衔接手段、技术定义与进展报告。' },
          { title: 'Week 3：推荐报告', path: '学习资料/ENG2002S_Week_03_session_1.pptx', kind: 'pptx', note: '比较标准、权重与建议写法，对应 ch03 后半。' },
          { title: 'Week 5：分析提案的 Solution 部分', path: '学习资料/ENG2002S_Week_05_W5S1_Analyzing_the_Solution_section_2025.docx', kind: 'docx', note: '拆解优秀提案如何写方案与证据，对应 ch04 第四、五节。' },
          { title: 'Week 6：准备技术演讲', path: '学习资料/ENG2002S_Week_06_Preparing_technical_presentations_key_points.pptx', kind: 'pptx', note: '结构、幻灯片与时间预算。' },
          { title: 'Week 6：发表技术演讲', path: '学习资料/ENG2002S_Week_06_Delivering_technical_presentations_key_points.pptx', kind: 'pptx', note: '声音、身体、Q&amp;A 与临场处理，对应 ch05。' }
        ]
      },
      {
        name: '求职与面试',
        note: '第 10–13 周的讲义与样例：先看样例的结构，再用自己的经历替换内容，不要照抄措辞。',
        items: [
          { title: 'Week 10：简历写作', path: '学习资料/ENG2002S_Week_10_Resume_or_CV_Week_10_session_1.pptx', kind: 'pptx', note: '简历结构、经历句与常见错误。' },
          { title: '简历样例 4', path: '学习资料/ENG2002S_Week_10_Resume_or_CV_Resume_Sample_4.pdf', kind: 'pdf', note: '一页式样例，注意它如何用动词与数字开头。' },
          { title: 'Week 11：求职信写作', path: '学习资料/ENG2002S_Week_11_Cover_letter_Week_10_session_2.pptx', kind: 'pptx', note: '四段式结构、称呼与结尾请求。' },
          { title: 'Week 12：个人陈述', path: '学习资料/ENG2002S_Week_12_Personal_Statement.pptx', kind: 'pptx', note: '主题线与三段式，对应 ch07 前两节。' },
          { title: 'Week 12：工作邮件', path: '学习资料/ENG2002S_Week_12_Writing_emails.pptx', kind: 'pptx', note: '主题行、称呼、请求与语气刻度。' },
          { title: 'Week 13：面试工作坊', path: '学习资料/ENG2002S_Week_13_Interview_Week_13_Session_2.pptx', kind: 'pptx', note: '三类问题、STAR 与反问，对应 ch07 后半。' }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '理工科英语交流（English for Science and Engineering Communication，ENG2002S），3 学分，先修 ENG2001'],
    ['来源', 'CUHKSZ ENG2002S 课程资料：大纲、评分标准、第一周阅读、周次讲义与求职样例'],
    ['结构', '8 章正文 · 56 题分章题库 · 模拟卷 A · 3 个实战项目 · 四组资料库'],
    ['建议', '先读第 0 章建立地图，再按 ch01→ch07 推进；每章的改写练习与结尾自检清单不要跳过。']
  ],

  /* 速查表：写作、报告、提案与求职（4 页） */
  cheat: [
    {
      label: '交流三角形与体裁',
      blocks: [
        { t: 'p', html: '动笔前先定位三个顶点：<b>作者</b>（你的立场与证据）、<b>读者</b>（知识背景与要做的决定）、<b>现实</b>（可核查的事实与数据）。三角形一旦偏移，语言再漂亮也不解决问题。' },
        { t: 'table', caption: '三种读者与三种写法', head: ['读者', '关心什么', '写法'], rows: [
          ['决策者（院长、物业）', '成本、收益、风险、什么时候能看到结果', '先给结论与数字，细节放附录'],
          ['同行（工程师、评审）', '方法是否可靠、假设是否成立', '给方法、数据、误差与限制'],
          ['外行（新生、公众）', '这跟我有什么关系', '从具体场景切入，术语第一次出现就解释']
        ] },
        { t: 'table', caption: '常见体裁的核心语步', head: ['体裁', '必须完成的语步', '常见失误'], rows: [
          ['进展报告', '状态—偏差—原因—下一步—需要的支持', '只列做过的事，不给判断'],
          ['推荐报告', '背景—标准与权重—证据—结论—实施建议', '只给结论，不交代标准'],
          ['技术提案', '问题—目标—方案—证据—预算—回本—请求', '问题没有量化，收益无法验收'],
          ['求职信', '申请—匹配证据—为什么是这家—请求面试', '复述简历，没有机构信息']
        ] }
      ]
    },
    {
      label: '技术写作句型',
      blocks: [
        { t: 'p', html: '改句子的顺序：<b>先找动作，再找施动者，最后决定要不要被动</b>。名词化把动作藏进名词，被动把施动者藏进介词短语，两者叠加，句子就只剩抽象名词。' },
        { t: 'table', caption: '改写前后对照', head: ['弱', '强', '改动'], rows: [
          ['The implementation of the modification was carried out by the team.', 'The team modified the plan.', '去名词化 + 去被动'],
          ['There are several factors that affect the result.', 'Three factors affect the result.', '去 there be + 给数量'],
          ['It is important to note that the sample was small.', 'The sample was small (n = 3), so the result is tentative.', '删套话 + 给数字 + 给限制'],
          ['Due to the fact that the meter failed, data collection stopped.', 'The meter failed, so data collection stopped.', '删冗长介词短语']
        ] },
        { t: 'table', caption: '断言强度与证据', head: ['证据强度', '合适动词', '例句'], rows: [
          ['一次实验、小样本', 'suggest、may、appear', 'The results suggest that the coating may reduce glare.'],
          ['多次重复、统计显著', 'show、indicate', 'The results show a 33% reduction (p &lt; 0.05).'],
          ['机理清楚、可复现', 'demonstrate、confirm', 'The test demonstrates that the timer resets at midnight.'],
          ['尚未验证', 'hypothesise、we expect', 'We hypothesise that occupancy drives the evening peak.']
        ] }
      ]
    },
    {
      label: '报告与提案',
      blocks: [
        { t: 'p', html: '提案的说服链只有五环：<b>问题有多贵 → 目标是什么 → 方案为什么有效 → 要花多少钱、多久回本 → 现在请你做什么</b>。任何一环缺失，评审都会停在那里。' },
        { t: 'table', caption: '提案八段与评分点', head: ['段落', '写什么', '评分关注'], rows: [
          ['标题与摘要', '对象、方案、关键数字', '能否一眼看懂'],
          ['问题陈述', '谁、何时、损失多少、数据来源', '是否量化、是否归因'],
          ['目标与范围', '可验收指标、不做什么', '是否有边界'],
          ['方案与证据', '技术路线、试点数据、引用', '证据是否支撑结论'],
          ['实施计划', '里程碑、责任人、时间', '是否可执行'],
          ['预算', '设备、施工、维护、不可预见费', '是否有遗漏'],
          ['收益与回本', '年节省、回本期、假设', '测算是否透明'],
          ['结论与请求', '复述问题—方案—收益，具体请求', '是否有行动']
        ] },
        { t: 'table', caption: '三个必算的数字', head: ['数字', '算法', '注意'], rows: [
          ['年节省', '（改造前功率 − 改造后功率）× 时长 × 电价', '时长要用实测或账单，不要凭感觉'],
          ['静态回本期', '总投入 ÷ 年节省', '写明是否含维护与更换'],
          ['单位面积或单位床位成本', '总投入 ÷ 面积或床位数', '便于与其他楼比较']
        ] }
      ]
    },
    {
      label: '求职与面试',
      blocks: [
        { t: 'p', html: '简历句的公式：<b>动作动词 + 对象 + 方法或工具 + 结果</b>。结果优先用数字，其次用别人的反馈或后续采用。没有结果的句子只是职责描述。' },
        { t: 'table', caption: '简历动词与量化', head: ['场景', '可用动词', '量化方式'], rows: [
          ['搭建/开发', 'built、designed、implemented', '规模（36 盏灯）、时长（2 周）、效率（6 小时→40 分钟）'],
          ['分析', 'analysed、modelled、audited', '样本量、误差、节省比例'],
          ['协调', 'coordinated、negotiated、liaised', '人数、次数、周期、达成结果'],
          ['改进', 'reduced、cut、streamlined', '百分比、金额、时间']
        ] },
        { t: 'table', caption: '面试三类题与应对', head: ['类型', '问什么', '结构'], rows: [
          ['行为', '讲一次冲突/失败/说服', 'STAR，比例 1:1:4:2'],
          ['技术', '解释概念、诊断、估算', '复述—假设—步骤—数量级'],
          ['动机', '为什么这个岗位/机构', '机构具体信息 + 你的经历 + 连接']
        ] },
        { t: 'p', html: '邮件四要素：<b>主题行说事由，称呼按职能，正文三到五句给请求与期限，签名四行内</b>。拒绝给替代，催促陈述事实与后果，面试后二十四小时内发三句话的感谢邮件。' }
      ]
    }
  ]
};
