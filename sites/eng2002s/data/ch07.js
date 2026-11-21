/* =====================================================================
 * ch07.js · 第 7 章「个人陈述、邮件与面试」
 * 职责：把前三章的「写清楚」推进到「讲自己」——个人陈述的故事线、
 *       工作邮件的四要素、面试三类问题与 STAR 应答、一分钟自我介绍。
 * 依据：Week 11–12（personal statement、writing emails）、
 *       Week 13–15（interview skills、A2B job interview）。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch07',
  num: '07',
  title: '个人陈述、邮件与面试',
  en: 'PERSONAL STATEMENT, EMAIL & INTERVIEW',
  goals: [
    '用一个主题把个人陈述串成起点—转折—去向的故事线',
    '写出主题行清楚、请求明确、附件规范的工作邮件',
    '按行为、技术、动机三类准备面试问题，并用 STAR 结构作答',
    '设计一份一分钟自我介绍，覆盖现在、过去与去向',
    '用追问、反问与感谢邮件把一次面试收好尾'
  ],
  kp: [
    { id: 'ch07-1', title: '个人陈述：一条主题，不是简历扩写' },
    { id: 'ch07-2', title: '三段式：起点、转折、去向' },
    { id: 'ch07-3', title: '邮件四要素：主题、称呼、正文、签名' },
    { id: 'ch07-4', title: '语气刻度：请求、期限与拒绝' },
    { id: 'ch07-5', title: '面试三类问题：行为、技术、动机' },
    { id: 'ch07-6', title: 'STAR：把经历讲成可评估的故事' },
    { id: 'ch07-7', title: '一分钟自我介绍：现在、过去、去向' },
    { id: 'ch07-8', title: '追问、反问与收尾' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么「讲自己」反而更难', html: '写报告时你知道读者要什么；写个人陈述、发邮件、面试时，读者要的是<b>判断你</b>：你是谁、你能做什么、和你共事会不会舒服。这三件事没有标准答案，于是很多人走向两个极端——要么把简历扩写成散文，要么堆形容词「勤奋、热情、有责任心」。这一章的办法是：<b>用一条主题统起来，用具体场景证明，用对方的语言收尾</b>。' },

    { t: 'p', lead: true, html: '课程最后五周全部围绕「把自己交出去」：第 11 周改求职信、写个人陈述，第 12 周练个人陈述与工作邮件，第 13–14 周面试工作坊，第 15 周进行 Assessment 2 Part B 的小组面试（占 25%，2–4 人一组，15–25 分钟，含一分钟自我介绍与三个问题）。这一章按「陈述 → 邮件 → 面试 → 自我介绍 → 收尾」展开，每一节都能直接拿去练。' },

    { t: 'h', lvl: 2, text: '一、个人陈述：一条主题，不是简历扩写', id: 'ch07-1' },

    { t: 'p', html: '个人陈述（personal statement）与简历的分工不同：简历列事实，陈述讲<b>这些事实为什么指向同一个方向</b>。因此它必须有一条主题（through-line），一句话能说完，例如「我关心的是让节能数据真正进入物业的决策」。主题之下选三到四个场景，每个场景证明主题的一面：发现问题、做出东西、被人采用、遇到挫折后调整。' },

    { t: 'p', html: '最常见的失败是<b>清单式陈述</b>：我参加过竞赛、我做过项目、我当过志愿者、我会三种语言。读者读完只记得「经历不少」，不记得「你是谁」。修法很直接：删掉与主题无关的经历，哪怕它很光鲜；把留下的每个场景写到有细节——时间、地点、你具体做了什么、结果是什么。' },

    { t: 'table', caption: '简历式陈述 vs 主题式陈述', head: ['维度', '简历式（弱）', '主题式（强）'], rows: [
      ['开头', 'I am a hard-working student from…', 'The first time I saw the meter room, I realised the data existed but nobody used it.'],
      ['主体', '罗列四段经历，各一句', '三个场景，每个 4–6 句，证明同一主题'],
      ['证据', '形容词与头衔', '具体动作、数字、别人的反馈'],
      ['结尾', 'I hope to be admitted', '把主题接到对方项目：what I want to build next'],
      ['读者感受', '经历不少，但记不住', '这个人有条线，且这条线与我们要做的事有关']
    ] },

    { t: 'p', html: '个人陈述还要回答<b>为什么是现在、为什么是这里</b>。「为什么是现在」指你的下一步为什么合乎逻辑：已经做了照明审计，接下来想学建筑能耗建模。「为什么是这里」指对方机构有什么不可替代：某位老师的方向、某个实验室的设备、某个城市的气候数据。这两问不回答，陈述就只是自我介绍，不是申请理由。' },

    { t: 'p', html: '长度控制在一页到一页半，四到五段。第一段给主题与一个具体场景，中间两到三段各讲一个转折，最后一段接到对方与未来。不要写童年立志，除非童年场景直接解释了现在的选择；不要引用名人名言，评审看过太多遍。用你自己的话，写你真正做过的事。' },

    { t: 'h', lvl: 2, text: '二、三段式：起点、转折、去向', id: 'ch07-2' },

    { t: 'p', html: '三段式是最稳的叙事骨架：<b>起点（past）</b>交代你从哪来、最初对什么问题感兴趣；<b>转折（present）</b>讲你做了什么、遇到什么困难、怎么调整，这是全文的重心；<b>去向（future）</b>说明你接下来想做什么、为什么与对方匹配。三段不是三段话，而是三种功能，可以各占一到两段。' },

    { t: 'p', html: '起点要短。两句话交代背景与兴趣来源即可，不要从小学写起。转折要具体：你发现数据对不上、方案被后勤处否掉、展示时被问住，然后你改了什么。转折的价值在于<b>显示判断力</b>——评审想看到你不是一路顺风顺水，而是遇到问题会调整。去向要克制：不要承诺「改变世界」，写一个可执行的下一步。' },

    { t: 'p', html: '写转折时用一个固定句式：<b>I expected X, but Y happened, so I Z.</b> 例如 <em>I expected the retrofit to cut energy use by 30%, but the first week showed only 12%, so I checked the timer settings and found the manual override was still active.</em> 一句话里有预期、有落差、有诊断、有动作，评审立刻知道你怎么工作。' },

    { t: 'p', html: '三段之间要有<b>因果链</b>，不能只是时间顺序。起点提出的问题，转折里被具体化；转折里学到的东西，去向里被用上。检查方法：把每段最后一句与下一段第一句连起来读，如果读起来像「然后……然后……」，说明缺少因果；如果像「因为……所以……」，链条就成立了。' },

    { t: 'h', lvl: 2, text: '三、邮件四要素：主题、称呼、正文、签名', id: 'ch07-3' },

    { t: 'p', html: '工作邮件（professional email）有四个要素。<b>主题行</b>：写清事由与对象，例如 <em>Request: meter room access for 14–28 March (ENG2002S project)</em>。不要写 <em>Question</em> 或 <em>Hello</em>。<b>称呼</b>：知道姓名用 <em>Dear Professor Li</em>，不知道用 <em>Dear Facilities Office</em>。<b>正文</b>：三到五句，说明来意、必要信息、明确请求与期限。<b>签名</b>：姓名、学号、专业、电话，四行以内。' },

    { t: 'table', caption: '一封请求邮件的解剖（示例）', head: ['部分', '内容', '作用'], rows: [
      ['主题行', 'Request: meter room access for 14–28 March (ENG2002S project)', '让对方不打开就知道要做什么'],
      ['称呼', 'Dear Facilities Office,', '按职能称呼，避免猜姓名'],
      ['第一句', 'I am a third-year student working on a lighting audit for three dormitory corridors.', '交代身份与事由'],
      ['第二、三句', 'I need to log power use at one-minute intervals for two weeks. The meter room in Building A would be sufficient.', '给必要信息，缩小请求范围'],
      ['第四句', 'Could I have access between 14 and 28 March, preferably on weekday mornings?', '明确请求与时间'],
      ['结尾', 'Thank you for your time. I am happy to provide a supervision plan.', '礼貌 + 主动补位'],
      ['签名', 'Chen Wei · 120030001 · Electrical Engineering · 138-0000-0000', '让对方能快速联系']
    ] },

    { t: 'p', html: '邮件正文有一个「三句原则」：<b>第一句说明你是谁、为什么写；第二句给必要信息；第三句给请求与期限</b>。超过五句，对方可能扫一眼就关。需要给背景的，把细节放附件，正文只写「详见附件一页说明」。附件命名要能独立看懂：<em>ChenWei_LightingAudit_Plan.pdf</em>，不要用 <em>document1.pdf</em>。' },

    { t: 'p', html: '回复邮件时，<b>不要只写「收到」</b>。写清你会做什么、什么时候做：<em>Thank you. I will send the revised plan by Friday 18:00 and confirm the access time on Monday.</em> 这让对方不必再追问一次。如果需要拒绝，先给理由再给替代：<em>I cannot attend the Tuesday meeting, but I can join online or send notes beforehand.</em> 拒绝一件事，同时保住关系。' },

    { t: 'p', html: '还有几个格式细节：<b>一封邮件只谈一件事</b>，两件事就发两封；<b>不要用全大写</b>，那在邮件里等于喊；<b>不要用表情符号</b>，除非对方先用；<b>引用回复时删掉无关历史</b>，别让一串 RE: RE: RE: 占满屏幕。这些细节不涉及语法，但直接影响对方愿不愿意帮你。' },

    { t: 'h', lvl: 2, text: '四、语气刻度：请求、期限与拒绝', id: 'ch07-4' },

    { t: 'p', html: '邮件的语气有三个刻度：<b>正式</b>（第一次联系、对外、涉及审批）、<b>半正式</b>（熟悉的同事、课程助教）、<b>内部</b>（同组同学）。刻度靠四个变量调节：称呼、缩略形式、礼貌句式、直接程度。第一次联系用正式：完整句、无缩写、<em>Could you please…</em>；熟悉之后可以半正式，但不要把 <em>Hey</em> 用在教授身上。' },

    { t: 'p', html: '请求的礼貌不等于绕弯。<em>I was wondering if it might perhaps be possible for you to consider…</em> 读三遍才知道你要什么。更稳的写法是：<em>Could you approve the attached budget by 20 March?</em> 礼貌在 <em>Could you</em> 与 <em>Thank you</em> 里，不在层层嵌套的从句里。技术交流的礼貌，核心是<b>让对方容易答应</b>：请求具体、期限清楚、理由充分。' },

    { t: 'p', html: '期限要写清日期与时间，不要写「尽快」。<em>by Friday 18:00</em> 比 <em>as soon as possible</em> 有用；如果事情紧急，说清为什么紧急：<em>by Friday, because the supplier closes orders on Monday</em>。给对方一个可以理解的截止理由，对方更容易配合。' },

    { t: 'p', html: '拒绝与催促是两种高难度邮件。<b>拒绝</b>：先感谢，再说明限制，最后给替代方案，不要编借口。<b>催促</b>：假设对方只是忙，不要指责；给出原约定的时间与影响：<em>I am following up on the access request I sent on 3 March. The data collection window closes on 28 March, so I would need confirmation by Friday to stay on schedule.</em> 陈述事实与后果，比「请尽快回复」有效。' },

    { t: 'h', lvl: 2, text: '五、面试三类问题：行为、技术、动机', id: 'ch07-5' },

    { t: 'p', html: '面试问题看似无穷，其实三类。<b>行为题（behavioural）</b>：讲一次你解决冲突、错过截止、说服别人的经历，考的是你过去怎么做事。<b>技术题（technical）</b>：解释一个概念、诊断一个故障、估算一个数量，考的是知识是否真懂。<b>动机题（motivational）</b>：为什么这个岗位、为什么这家机构、五年后想做什么，考的是匹配与稳定性。三类准备方法不同：行为题靠故事库，技术题靠讲清思路，动机题靠对机构的了解。' },

    { t: 'table', caption: '三类面试问题与准备动作', head: ['类型', '典型问法', '准备什么', '常见失分'], rows: [
      ['行为', 'Tell me about a time you disagreed with a teammate.', '六个故事，各含情境、任务、动作、结果', '讲成流水账，没有结果与反思'],
      ['技术', 'How would you estimate the lighting load of a building?', '把思路拆成三步，边讲边算', '直接给答案，不解释假设'],
      ['动机', 'Why do you want this role?', '机构近期项目 + 你的相关经历', '空泛赞美，任何公司都能套用']
    ] },

    { t: 'p', html: '行为题的故事要<b>提前准备六个</b>：一次成功、一次失败、一次冲突、一次说服、一次紧急、一次主动。六个故事可以覆盖八成行为题。每个故事按 STAR 写成一页卡片，考前只复习卡片，不背逐字稿。技术题则要练「出声思考」：先复述问题、再给假设、再给步骤、最后给数量级，哪怕算不精确，思路清楚就得分。' },

    { t: 'p', html: '动机题最容易被低估。很多人只准备「我很喜欢这个行业」，评审立刻知道你没做功课。正确做法是<b>把机构的具体信息与你的经历接起来</b>：<em>Your campus energy team published a retrofit case last year; I did a similar audit on three dormitory corridors, and I want to work on the next phase at building scale.</em> 一句话里有对方、有自己、有连接。' },

    { t: 'p', html: '课程的小组面试（Part B）还有一个特点：<b>2–4 人一组，15–25 分钟，个人计分</b>。这意味着你既要表现自己，又不能压过组员。做法是：回答自己的问题时给足结构，别人回答时认真听并在合适处补一句，不抢话、不纠正细枝末节。评审看的是「和你共事会不会舒服」，团队行为本身就是评分对象。' },

    { t: 'h', lvl: 2, text: '六、STAR：把经历讲成可评估的故事', id: 'ch07-6' },

    { t: 'p', html: 'STAR 是行为题的通用结构：<b>Situation</b>（情境，一两句）、<b>Task</b>（任务，一句）、<b>Action</b>（动作，三到四句，重点）、<b>Result</b>（结果，一两句，带数字或反馈）。四段的比例大约是 1:1:4:2，动作占一半以上，因为评审要判断的是「你具体怎么做」。' },

    { t: 'p', html: '示例：<em>In our lighting project, the first week showed only 12% savings instead of the expected 30% (S). I was responsible for the control settings (T). I checked the timer logs, found the manual override was still active on two floors, and reran the schedule with the facilities team (A). Savings rose to 33%, and the facilities office adopted the setting for the other two buildings (R).</em> 六句话，有落差、有诊断、有协作、有结果。' },

    { t: 'p', html: '三个常见错误。<b>一是情境太长</b>：花一分钟讲背景，动作只剩一句。<b>二是没有「我」</b>：全程说「我们」，评审不知道你做了什么；用「我们」交代背景，用「我」讲你的动作。<b>三是结果空泛</b>：写「项目顺利结束」，不如写「节省 33%，被另外两栋楼采用」。结果最好有数字、有别人的反馈、有后续影响。' },

    { t: 'p', html: 'STAR 还要准备<b>失败版</b>。被问「讲一次失败」，不要选一个假失败（「我太追求完美」），也不要选一个致命错误。选一个可控的失误：漏了一个依赖、估错工作量、沟通不到位。重点在 A 与 R：你当时怎么补救、后来改了什么流程。评审想听的是学习能力，不是完美记录。' },

    { t: 'h', lvl: 2, text: '七、一分钟自我介绍：现在、过去、去向', id: 'ch07-7' },

    { t: 'p', html: '一分钟自我介绍（self-introduction）不要复述简历。用「现在—过去—去向」三句：<b>现在</b>你是谁、在做什么；<b>过去</b>一件最能证明你能力的事；<b>去向</b>你为什么坐在这里、想做什么。三句各十五到二十秒，中间可以加一句连接，总共一分钟出头。' },

    { t: 'p', html: '示例：<em>I am Chen Wei, a third-year electrical engineering student at CUHK-Shenzhen (现在). Last semester I audited the lighting in three dormitory corridors and found a 33% saving that paid back in ten months (过去). I am here because your team is scaling up campus retrofits, and I want to work on the metering and verification side (去向).</em> 三句，有身份、有证据、有匹配。' },

    { t: 'p', html: '自我介绍要练到<b>不背稿也能说</b>。方法是记三个关键词，不记句子：身份、33%、计量。现场用不同的话把三个词串起来，听起来自然，也不会因为忘词卡住。练的时候录音，听自己有没有填充词、语速是否超过每分钟 160 词、有没有在结尾停住。' },

    { t: 'p', html: '还有两个现场细节。<b>一是看着人说</b>：自我介绍时轮流看每位面试官，不要盯桌面。<b>二是结尾留钩子</b>：最后一句可以埋一个对方会追问的点，例如「我想做的是计量与验证」，对方很可能顺着问，你就把面试引到你准备最充分的地方。' },

    { t: 'h', lvl: 2, text: '八、追问、反问与收尾', id: 'ch07-8' },

    { t: 'p', html: '面试不是问答，是<b>来回</b>。对方追问细节，说明他对你的故事感兴趣，这是好信号。追问时不要慌，回到 STAR 的某一层补充：他问「你怎么发现的」，你补 Action；他问「结果怎么衡量」，你补 Result 的基线。如果确实不知道，就说不知道，并给一个获取答案的路径。' },

    { t: 'p', html: '反问环节（questions for the interviewer）至少要准备三个问题，且必须是<b>网上查不到、只有内部人知道</b>的。例如「这个岗位前三个月的首要交付是什么」「团队现在最大的数据缺口在哪」「上一任实习生做的最好的一件事是什么」。不要问薪资、假期、能不能远程——这些该在 HR 环节问，不是技术面试。' },

    { t: 'p', html: '收尾三件事。<b>第一，重申匹配</b>：一句话说你为什么适合，不要重复整场。<b>第二，问下一步</b>：<em>What are the next steps, and when should I expect to hear back?</em> <b>第三，感谢</b>：起身、眼神、道谢，别急着收电脑。面试结束后二十四小时内发一封感谢邮件，提到一个具体话题，不要群发模板。' },

    { t: 'p', html: '感谢邮件的写法：主题行 <em>Thank you — interview for energy data intern (Chen Wei)</em>；正文三句，感谢时间、重申一个匹配点、表示可补充材料；签名与求职信一致。不要写三页，不要重复简历。一封得体的感谢邮件，往往在两个候选人差不多时起作用。' },

    { t: 'terms', items: [
      { en: 'personal statement', zh: '个人陈述', html: '用一条主题串起起点、转折与去向的申请文书，讲事实为什么指向同一个方向。' },
      { en: 'through-line', zh: '主题线', html: '贯穿全文的一句话主张，决定哪些经历保留、哪些删掉。' },
      { en: 'STAR', zh: '情境—任务—动作—结果', html: '行为题的回答结构，动作占一半以上，结果要有数字或反馈。' },
      { en: 'behavioural question', zh: '行为题', html: '让你讲过去一次具体经历的问题，用来预测未来的工作方式。' },
      { en: 'self-introduction', zh: '自我介绍', html: '一分钟内讲清现在、过去与去向，用三个关键词而非逐字稿。' },
      { en: 'follow-up email', zh: '跟进邮件', html: '面试后二十四小时内的感谢与重申匹配，三句话即可，不要群发模板。' },
      { en: 'clarifying question', zh: '澄清提问', html: '面试中确认题意或获取条件的提问，显示你在解决问题前先定义问题。' }
    ] },

    { t: 'quiz', qid: 'ch07-q1' },
    { t: 'quiz', qid: 'ch07-q2' },
    { t: 'quiz', qid: 'ch07-q3' },

    { t: 'keypoint', items: [
      { title: '陈述要有一条线', html: '一条主题，三个场景，每个场景有细节与结果。清单式罗列记不住人。' },
      { title: '三段式有因果', html: '起点提出问题，转折具体化并显示调整，去向接到对方与下一步。' },
      { title: '邮件四要素', html: '主题行说事由，称呼按职能，正文三到五句给请求与期限，签名四行内。' },
      { title: '礼貌是让对方容易答应', html: '请求具体、期限清楚、理由充分；拒绝给替代，催促陈述事实与后果。' },
      { title: '面试三类题', html: '行为靠六个故事，技术靠出声思考，动机靠对机构的了解。' },
      { title: 'STAR 比例 1:1:4:2', html: '动作占一半以上；用「我」讲动作，结果带数字或反馈；失败版重点在补救与改进。' }
    ] },

    { t: 'checklist', id: 'ch07', items: [
      '我能用一句话说出个人陈述的主题，并判断哪些经历该删',
      '我能按起点、转折、去向写出三段，并检查段与段之间是否有因果',
      '我能写一封五句以内的请求邮件，主题行、称呼、请求、期限、签名齐全',
      '我能把「尽快」改成具体日期，并给出一个对方能理解的截止理由',
      '我能为行为、技术、动机三类问题各准备一个示例答案',
      '我有六个 STAR 故事卡片，每个都含情境、任务、动作、结果',
      '我能在一分钟内完成自我介绍，并用三个关键词而不是逐字稿',
      '我能准备三个只有内部人知道的反问，并在收尾时问下一步',
      '我知道面试后二十四小时内要发一封三句话的感谢邮件'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应第 11 周的个人陈述、第 12 周的个人陈述练习与工作邮件、第 13–14 周的面试工作坊，以及第 15 周的 Assessment 2 Part B 小组面试（占 25%，2–4 人一组，15–25 分钟，含一分钟自我介绍与三个问题，个人计分）。三段式、STAR、三类问题与反问策略参照课堂讲义与面试工作坊材料；个人陈述与邮件的示例为教学构造，姓名、学号、电话均为虚构，不对应任何真实学生。' }
  ]
});
