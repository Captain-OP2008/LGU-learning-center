/* =====================================================================
 * exam.js · 模拟卷 A（CSC.registerExam）
 * 覆盖全课程：受众与体裁、句子清晰度、技术定义、报告、提案、演讲、
 * 求职文书与面试。12 题，满分 100，建议 90 分钟。
 * ===================================================================== */
CSC.registerExam({
  id: 'ENG2002S-A',
  title: '模拟卷 A · 全课程',
  style: 'FINAL',
  subtitle: '覆盖第 1–15 周：受众与体裁、技术写作语言、报告、提案、演讲、求职文书与面试',
  date: '',
  minutes: 90,
  totalScore: 100,
  summary: '客观题 12 分（选择、判断、填空），改写与写作题 60 分，长文写作 20 分，面试与反问 8 分；共 12 题，满分 100 分。建议先用 35 分钟完成客观题与短改写，再用 55 分钟写问题陈述、简历句与邮件。',
  instructions: [
    '闭卷。可以携带一张 A4 手写笔记（双面），但不得携带打印的范文或模板。',
    '改写题按「保留原意、去掉冗余、突出主张」评分；只改一个词而句子仍然臃肿，不得满分。',
    '写作题先列三行提纲再动笔，评分看重结构与证据，不看重辞藻。',
    '所有答案写在答题纸上，标明题号；时间不够时优先完成问题陈述与简历句这两道 10 分题。'
  ],
  questions: [
    {
      no: 1,
      points: 8,
      type: '概念辨析',
      intro: '前三个概念贯穿全课程：受众、体裁、语步。先判断定义，再判断一句话的对错。',
      parts: [
        {
          label: '1(1)',
          points: 4,
          kind: 'choice',
          prompt: '下列哪一项最准确地描述「体裁」（genre）？',
          options: [
            { text: '读者期待、交际功能与惯例形式的组合', correct: true },
            { text: '文档的字体、字号与页边距' },
            { text: '作者的写作风格与用词偏好' },
            { text: '文章的篇幅与章节数量' }
          ],
          explain: '体裁是社会的、功能的：读者带着期待读提案，提案就要完成「论证值得投资」的功能，形式只是这个功能的惯例外壳。只模仿格式，文本会空。'
        },
        {
          label: '1(2)',
          points: 4,
          kind: 'tf',
          prompt: '语步（move）是体裁中承担特定交际功能的部分，可以用一段、一句或一张表实现。',
          options: [
            { text: '正确', correct: true },
            { text: '错误' }
          ],
          explain: '语步是功能单位而非形式单位。同一个「陈述问题」语步，可以写成一段，也可以做成一张投诉统计表；分析语步是为了看清文本靠哪几步完成工作。'
        }
      ]
    },
    {
      no: 2,
      points: 8,
      type: '受众与邮件',
      intro: '邮件是课程里最小、也最常被写坏的体裁。本题考主题行与请求的写法。',
      parts: [
        {
          label: '2(1)',
          points: 4,
          kind: 'choice',
          prompt: '你要向学校设施管理处申请 3 月 14–28 日进入 A 栋电表间记录用电，主题行最合适的是：',
          options: [
            { text: 'Request: meter room access for 14–28 March (ENG2002S project)', correct: true },
            { text: 'Hello' },
            { text: 'Important!!! Please read' },
            { text: 'A question about the meter room and some other things' }
          ],
          explain: '主题行要让人不打开就知道「什么事、什么时间、与我何干」。Hello 没有信息，Important 是自我加冕，最后一项把两个话题混在一起，读者无法判断优先级。'
        },
        {
          label: '2(2)',
          points: 4,
          kind: 'output',
          prompt: '把下面这句请求改写成一句更具体、更容易被批准的话（不超过 30 词）：I would like to ask whether it might be possible for me to perhaps get some access to the meter room at some point.',
          answer: 'Could I have access to the A-building meter room on weekday mornings between 14 and 28 March?',
          explain: '原句用了四个模糊限制（would like、might、perhaps、at some point），读者读完仍不知道要什么。改写保留礼貌的 Could I，给出地点、时段与日期，请求立刻可执行。'
        }
      ]
    },
    {
      no: 3,
      points: 8,
      type: '句子改写',
      intro: '名词化与被动语态叠在一起，会把动作和施动者一起埋掉。本题要求把句子还原成「谁做什么」。',
      parts: [
        {
          label: '3(1)',
          points: 8,
          kind: 'output',
          prompt: '改写下面这句话，要求不超过 12 个词，并保留原意：The implementation of the modification of the schedule was carried out by the project team.',
          answer: 'The project team modified the schedule.',
          explain: '原句有三个名词化（implementation、modification、schedule）与一个被动（was carried out），真正的动作是 modified，施动者是 team。还原后 6 个词，信息一个不少。'
        }
      ]
    },
    {
      no: 4,
      points: 8,
      type: '技术定义',
      intro: '定义是提案与报告的基础。本题考查三段式结构与一个常见单位。',
      parts: [
        {
          label: '4(1)',
          points: 4,
          kind: 'keywords',
          prompt: '写出技术定义的三段结构，并各用一句话说明其作用。',
          keywords: ['类别', '区分特征', '例子', '用途', '读者已知'],
          explain: '三段是「归入类别 + 区分特征 + 例子或用途」。类别让读者定位，区分特征给出与同类其他成员不同的信息，例子让抽象定义落地。缺任何一段，定义都会悬空。'
        },
        {
          label: '4(2)',
          points: 4,
          kind: 'fill',
          prompt: '照度（illuminance）的国际单位是________（填英文单位名）。',
          answer: 'lux',
          explain: '照度的单位是 lux（勒克斯），1 lux = 1 lumen/m²。写作时第一次出现应给全称与单位，后文再用符号，避免读者在 lux 与 lumen 之间混淆。'
        }
      ]
    },
    {
      no: 5,
      points: 8,
      type: '进展报告',
      intro: '进展报告的价值在于让读者判断「是否还在轨道上」。本题考状态描述与偏差说明。',
      parts: [
        {
          label: '5(1)',
          points: 4,
          kind: 'choice',
          prompt: '项目完成 60%，因供应商延迟，验收从 4 月 12 日推到 4 月 26 日。最合适的表述是：',
          options: [
            { text: 'In progress — 60% complete; acceptance moved from 12 to 26 April because the supplier delayed delivery.', correct: true },
            { text: 'Completed.' },
            { text: 'Delayed.' },
            { text: 'No problems so far.' }
          ],
          explain: '状态行要同时给完成度、变化与原因。只写 Delayed 让读者无法判断影响；只写 Completed 与事实不符；No problems 掩盖了已经发生的延期。'
        },
        {
          label: '5(2)',
          points: 4,
          kind: 'output',
          prompt: '把「The project is delayed.」扩写成一句可执行的进展说明，包含完成度、原因与下一步（不超过 35 词）。',
          answer: 'The project is at 60%: the supplier delayed the sensors by two weeks, so acceptance moves to 26 April; we are testing the control settings in the meantime.',
          explain: '一句好的进展说明 = 状态 + 原因 + 影响 + 正在做的补救。补上「同时在做什么」，读者会判断你没有停摆，而是在并行推进。'
        }
      ]
    },
    {
      no: 6,
      points: 8,
      type: '推荐矩阵',
      intro: '推荐报告的说服力来自可复核的评分。本题计算加权总分并解释权重的来源。',
      parts: [
        {
          label: '6(1)',
          points: 4,
          kind: 'fill',
          prompt: '某方案在权重 0.40 的维度得 3 分、权重 0.35 得 4 分、权重 0.25 得 5 分。加权总分是多少？（保留两位小数）',
          answer: '3.85',
          explain: '0.40×3 + 0.35×4 + 0.25×5 = 1.20 + 1.40 + 1.25 = 3.85。先确认权重之和为 1（0.40+0.35+0.25=1.00），加权分数才可比。'
        },
        {
          label: '6(2)',
          points: 4,
          kind: 'output',
          prompt: '说明矩阵中的权重应当从哪里来，并给出一个获取权重的方法（不超过 50 词）。',
          answer: 'Weights should come from stakeholder priorities, not the author’s preference. I would ask the facilities manager to rank the criteria, then convert the ranking into weights and confirm it in writing.',
          explain: '权重是价值判断，必须由决策相关方确认。让干系人排序、转成权重、书面确认，既提高合法性，也让报告在评审会上经得起质问。'
        }
      ]
    },
    {
      no: 7,
      points: 10,
      type: '问题陈述',
      intro: '提案的第一道门槛是把「问题」写成可量化、可归责的损失。',
      parts: [
        {
          label: '7(1)',
          points: 10,
          kind: 'output',
          prompt: '写一段问题陈述（80–120 词），主题是「三栋宿舍走廊照明能耗高且照度不足」。要求写清谁受影响、何时开始、损失如何量化，并给出一个数据来源。',
          answer: 'Students in Buildings A–C have reported dim corridors since the fixtures were installed in 2019. A two-week log of 36 luminaires shows 4,100 kWh per month, 38% above the design estimate, while average illuminance at floor level is 62 lux, below the 100 lux guideline. The facilities office has received 12 complaints this semester. The overspend is about RMB 2,300 per month, and the dim light is a safety concern at night.',
          explain: '这段包含受影响者（A–C 栋学生）、时间（2019 年安装后）、两项损失（每月多耗 38%、照度 62 lux 低于 100 lux 指南）、投诉量与金额、数据来源（36 盏灯两周记录）。没有这些，问题陈述就只是抱怨。'
        }
      ]
    },
    {
      no: 8,
      points: 8,
      type: '目标与预算',
      intro: '评审批预算前会先看目标是否可验收、投入多久能收回。',
      parts: [
        {
          label: '8(1)',
          points: 4,
          kind: 'choice',
          prompt: '下列哪个目标最符合「可验收」的要求？',
          options: [
            { text: '在 2025 年 9 月前把三栋走廊照度提升到 150 lux，且月用电不高于 3,200 kWh。', correct: true },
            { text: '改善宿舍走廊的照明状况。' },
            { text: '让同学们满意。' },
            { text: '采用最先进的 LED 技术。' }
          ],
          explain: '可验收 = 有指标、有阈值、有时间、有判定方式。150 lux 与 3,200 kWh 都可测；「改善」「满意」「最先进」都无法判定是否完成。'
        },
        {
          label: '8(2)',
          points: 4,
          kind: 'fill',
          prompt: '改造投入 18,000 元，每年节省 24,000 元，静态回本期是几个月？（只填数字）',
          answer: '9',
          explain: '18,000 ÷ 24,000 = 0.75 年 = 9 个月。回本期是提案最有力的单一数字，但必须同时说明电价、使用时长与维护成本假设，否则评审会怀疑测算。'
        }
      ]
    },
    {
      no: 9,
      points: 8,
      type: '幻灯片标题',
      intro: '标题是幻灯片最醒目的一行。断言式标题让听众即使走神也能抓住论证。',
      parts: [
        {
          label: '9(1)',
          points: 4,
          kind: 'choice',
          prompt: '一页展示「改造后用电从 4,100 kWh 降到 2,750 kWh」，最合适的标题是：',
          options: [
            { text: 'Retrofit cuts monthly electricity use by 33%', correct: true },
            { text: 'Results' },
            { text: 'Data' },
            { text: 'Electricity consumption of Buildings A–C in 2024' }
          ],
          explain: '断言式标题直接给结论，页面上的图只是证据。Results 与 Data 是栏目名，不传递信息；最后一项描述了图，却没有告诉听众结论是什么。'
        },
        {
          label: '9(2)',
          points: 4,
          kind: 'output',
          prompt: '把一个标题「Method」改写成断言式标题，内容是关于「用两周分项计量定位待机损耗」（不超过 12 词）。',
          answer: 'Two-week submetering located 18% standby loss',
          explain: '改写要把「做了什么」变成「发现了什么」：方法名 Method 换成结果 18% standby loss，同时保留手段 submetering。标题有主张，听众才知道这页要证明什么。'
        }
      ]
    },
    {
      no: 10,
      points: 10,
      type: '简历经历句',
      intro: '简历句的公式是「动作动词 + 对象 + 方法 + 结果」。本题要求把职责句改成成果句。',
      parts: [
        {
          label: '10(1)',
          points: 10,
          kind: 'output',
          prompt: '把「Responsible for helping with the lighting project and doing some data analysis.」改写成一条简历经历句（不超过 30 词），至少包含一个数字。',
          answer: 'Built a Python meter-logging tool for 36 luminaires and cut data cleaning from 6 hours to 40 minutes per week.',
          explain: '原句只有职责，没有动作、方法、结果。改写用 Built 开头，给出对象（36 luminaires）、方法（Python tool）、结果（6 小时降到 40 分钟），读者立刻知道你会什么、带来什么。'
        }
      ]
    },
    {
      no: 11,
      points: 8,
      type: '邮件与语气',
      intro: '拒绝一件事，同时保住关系，是工作邮件的常见难点。',
      parts: [
        {
          label: '11(1)',
          points: 4,
          kind: 'choice',
          prompt: '你不能参加周二的项目会议，最合适的邮件写法是：',
          options: [
            { text: 'I cannot attend the Tuesday meeting, but I can join online or send written notes beforehand.', correct: true },
            { text: 'I cannot attend. Sorry.' },
            { text: 'I am too busy to attend.' },
            { text: 'Maybe I will come if I have time.' }
          ],
          explain: '拒绝要给替代方案，让对方仍有推进路径。只道歉没有解决问题；「太忙」显得不重视；「也许」让对方无法安排。给在线或书面替代，关系与进度都保住。'
        },
        {
          label: '11(2)',
          points: 4,
          kind: 'output',
          prompt: '写三句话的邮件正文，向教授请求把作业截止日期延到 4 月 18 日，理由是一次实验室设备故障（不超过 60 词）。',
          answer: 'I am writing to ask whether the proposal deadline could move to 18 April. The meter logger failed on 9 April and the replacement arrived only yesterday, so I lost four days of data collection. I can send the completed draft by 18 April and am happy to show the equipment log.',
          explain: '三句分别是请求、理由、承诺与证据。日期具体，理由可核查（设备故障、到货时间），并主动提供记录。比「家里有事，请通融」更可信，也更容易被批准。'
        }
      ]
    },
    {
      no: 12,
      points: 8,
      type: '面试',
      intro: '行为题用 STAR，反问环节用来显示你已经在思考如何把工作做好。',
      parts: [
        {
          label: '12(1)',
          points: 4,
          kind: 'output',
          prompt: '用 STAR 结构写一个 60–90 词的故事，回答「讲一次你和队友意见不一致的经历」。',
          answer: 'In our lighting project, a teammate wanted to skip the baseline week to save time (S). I was responsible for the measurement plan (T). I showed that without a baseline we could not claim savings, proposed a three-day shortened baseline, and split the metering shifts (A). The baseline showed 12% standby loss, and the team adopted the shortened protocol for the next building (R).',
          explain: '故事有情境、任务、动作、结果，动作占一半。关键是「用证据说服」而不是「我坚持我对」，结果带 12% 与「被下一栋楼采用」，显示影响可延续。'
        },
        {
          label: '12(2)',
          points: 4,
          kind: 'keywords',
          prompt: '写出三个适合在技术面试反问环节问的问题（每个不超过 15 词），并说明为什么合适。',
          keywords: ['前三个月', '交付', '数据缺口', '团队', '内部', '网上查不到'],
          explain: '好问题指向工作本身：前三个月的首要交付、团队最大的数据缺口、上一任实习生做得最好的一件事。它们显示你在预演入职，而且答案只有内部人知道，网上查不到。'
        }
      ]
    }
  ]
});
