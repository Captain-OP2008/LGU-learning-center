/* =====================================================================
 * ch06.js · 第 6 章「求职文书：简历与求职信」
 * 职责：把招聘广告当任务书，用可核查的经历句与关键词映射，
 *       写出一页简历与四段求职信；对齐 A2 Part A 的提交要求。
 * 依据：Week 10（résumé / CV）、Week 11（cover letter）、
 *       Assessment 2 Part A 说明与 Professional Portfolio Rubric。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch06',
  num: '06',
  title: '求职文书：简历与求职信',
  en: 'RÉSUMÉ & COVER LETTER',
  goals: [
    '把一则招聘广告拆成硬性要求、加分项与关键词三张清单',
    '用动作动词加对象加方法加结果的公式改写经历句',
    '把量化写进简历，同时保证每个数字都能在面试中被追问',
    '按四段结构写出针对具体岗位与机构的求职信',
    '避开格式、语气与可检索性上的常见失分点'
  ],
  kp: [
    { id: 'ch06-1', title: '招聘广告是任务书：硬性、加分与关键词' },
    { id: 'ch06-2', title: '简历的三种结构：时间、功能、混合' },
    { id: 'ch06-3', title: '经历句公式：动作、对象、方法、结果' },
    { id: 'ch06-4', title: '量化：数字从哪来，怎么写得诚实' },
    { id: 'ch06-5', title: '求职信四段：来意、匹配、再匹配、请求' },
    { id: 'ch06-6', title: '关键词映射：把岗位要求逐条对上经历' },
    { id: 'ch06-7', title: '语气与礼貌：正式但不僵硬' },
    { id: 'ch06-8', title: '可检索性与常见错误' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么简历不是「我的自传」', html: '招聘方看一份简历的平均时间只有几秒，看求职信也不过一分钟。他们不是在了解你的一生，而是在做一次<b>匹配判断</b>：这个人能不能干这份活、有没有证据、会不会带来额外麻烦。因此简历与求职信不是「把自己写全」，而是「把岗位要的东西写清楚，并有证据」。这一章从招聘广告开始，因为它是唯一的任务书。' },

    { t: 'p', lead: true, html: '课程把求职文书放在 Assessment 2 Part A，占 15%：一页简历加一页求职信，合成一个 PDF，致 Director of Human Resources，要求使用真实相关经历，抄袭或 AI 代写记零。这一章按「读广告 → 选结构 → 写经历 → 量化 → 写信 → 映射关键词 → 调语气 → 查格式」展开，每一步都指向可提交的成品。' },

    { t: 'h', lvl: 2, text: '一、招聘广告是任务书：硬性、加分与关键词', id: 'ch06-1' },

    { t: 'p', html: '拿到招聘广告（job description，JD）先做三件事。<b>第一，分硬性与加分</b>：<em>must be enrolled in an engineering programme</em> 是硬性，<em>experience with Python is a plus</em> 是加分。硬性不满足，其他写得再好也会被筛掉；加分项决定你在满足硬性的人里排第几。<b>第二，圈动词</b>：analyze、coordinate、test、document、communicate，这些动词就是你简历里应该出现的动词。<b>第三，抄名词</b>：工具名、流程名、证书名，原词照抄，不要换同义词。' },

    { t: 'p', html: '很多申请者败在第一步：用一份通用简历投所有岗位，关键词对不上，机器筛就把你过滤了。正确做法是<b>一岗一版</b>：保留经历库，针对每个岗位重排顺序、替换动词、补上广告里的名词。重排不等于编造——你做过的事不变，只是把与岗位最相关的三条提到最前。' },

    { t: 'table', caption: '招聘广告拆解示例：硬性、加分与关键词', head: ['类别', '广告原文', '你要做的动作'], rows: [
      ['硬性', 'Final-year student in electrical engineering', '在教育背景第一行写清专业、年级、预计毕业时间'],
      ['硬性', 'Able to work 20 hours per week during term', '在求职信里明确可投入时间，不要等对方问'],
      ['加分', 'Experience with data logging and Python', '把传感器记录与 Python 处理写成一条经历'],
      ['加分', 'Familiar with campus facility operations', '把与后勤处合作取数的经历提前'],
      ['关键词', 'energy audit, lighting retrofit, payback analysis', '原词出现在简历与求职信各一次，不要只写「节能项目」']
    ] },

    { t: 'p', html: '拆完广告，做一张<b>要求—证据表</b>：左列抄要求，右列写你用哪段经历、哪个数字、哪个产出满足它。右列空着的，就是你要么补经历、要么承认不满足的地方。这张表是后面简历与求职信的骨架，也是面试前复习的提纲。' },

    { t: 'h', lvl: 2, text: '二、简历的三种结构：时间、功能、混合', id: 'ch06-2' },

    { t: 'p', html: '简历结构有三种。<b>时间式（reverse chronological）</b>按时间倒序排经历，招聘方最熟悉，适合经历连续、与岗位相关的人。<b>功能式（functional）</b>按能力分组，弱化时间线，适合转行或经历有空档的人，但招聘方会警惕「是不是在藏什么」。<b>混合式（hybrid）</b>开头放能力摘要，下面仍按时间排经历，是学生最常用的折中。' },

    { t: 'p', html: '对本科生来说，混合式最稳：最上面一行姓名与联系方式，接着三行<b>能力摘要</b>（点明专业、方向、最强的一项证据），然后教育背景、项目经历、实习或兼职、技能与证书。顺序不是死的：如果项目比课程更能证明能力，就把项目放教育前面。原则只有一条：<b>把与岗位最相关的放最上面</b>。' },

    { t: 'table', caption: '一页简历的模块与篇幅建议', head: ['模块', '内容', '建议行数', '常见问题'], rows: [
      ['抬头', '姓名、邮箱、电话、城市', '2–3 行', '放照片、出生日期、家庭住址'],
      ['能力摘要', '专业方向 + 一条最强证据', '2–3 行', '写成空洞的「勤奋好学」'],
      ['教育背景', '学校、专业、年级、GPA（可选）、相关课程', '3–4 行', '列十门课程，没有重点'],
      ['项目经历', '2–3 个项目，各 2–4 条 bullet', '8–12 行', '只写职责，不写结果'],
      ['实习与兼职', '与岗位相关的优先', '3–6 行', '把无关兼职写满一页'],
      ['技能与证书', '工具、语言、证书、可投入时间', '2–4 行', '写「精通 Office」这类无法验证的话']
    ] },

    { t: 'p', html: '一页是硬约束。课程要求简历一页、求职信一页，合成一个 PDF。一页不是限制，而是筛选：它逼你决定什么最重要。删的时候先删无关兼职、重复的课程名、形容词；不要删数字与产出。如果实在放不下，把作品集链接放一行，让想深看的人自己点。' },

    { t: 'p', html: '排版还有几个硬规则：<b>字体统一</b>（正文 10–11 磅，标题 12–14 磅）、<b>页边距不小于 1.5 厘米</b>、<b>时间倒序</b>、<b>每条 bullet 不超过两行</b>、<b>动词开头</b>。不要用表格与分栏做复杂版式，很多简历系统读不了。留白不是浪费，是让招聘方的眼睛有落点。' },

    { t: 'h', lvl: 2, text: '三、经历句公式：动作、对象、方法、结果', id: 'ch06-3' },

    { t: 'p', html: '一条好的经历句包含四个成分：<b>动作动词 + 对象 + 方法 + 结果</b>。动作动词说明你做了什么（designed、calibrated、automated、coordinated），对象说明对什么做的（a 12-node sensor network），方法说明怎么做的（using LoRa and a Python logger），结果说明带来了什么（cut data loss from 8% to 1%）。四个成分不必每次齐全，但至少要有动作与结果。' },

    { t: 'table', caption: '经历句改写：从职责到证据', head: ['弱写法', '问题', '强写法'], rows: [
      ['Responsible for the lighting project', '只有职责，没有动作与结果', 'Audited 240 corridor lamps and proposed a retrofit that cut energy use by 33%'],
      ['Helped the team with data collection', 'helped 无法说明你做了什么', 'Logged power data at 1-minute intervals for 14 days and cleaned 20,160 readings in Python'],
      ['Worked on a website', '对象与结果都模糊', 'Built a three-page dashboard that let the facilities team track daily use in under a minute'],
      ['Good communication skills', '形容词，不可验证', 'Presented findings to three stakeholders and revised the proposal after their feedback']
    ] },

    { t: 'p', html: '动词的选择要具体。<b>强动词</b>：designed、built、calibrated、automated、diagnosed、negotiated、documented、trained。<b>弱动词</b>：responsible for、helped with、participated in、worked on、assisted。弱动词不是不能用，而是不能当主干——它们只说明你在场，不说明你做了什么。' },

    { t: 'p', html: '时态也要统一：<b>当前岗位用现在时，过去经历用过去时</b>。同一个项目里不要一会儿 <em>design</em> 一会儿 <em>designed</em>。如果项目还在进行，可以用现在时，但要与截止时间一致。时态混乱会让招聘方怀疑经历的真实性，这是很低级的失分。' },

    { t: 'p', html: '还有一条内容规则：<b>每条 bullet 只讲一件事</b>。把「设计电路、采购元件、写报告」塞进一条，读者记不住任何一件。拆成三条，每条一个动词一个结果，信息量反而更大。一页简历通常 12–16 条 bullet，每条都应该是可追问的。' },

    { t: 'h', lvl: 2, text: '四、量化：数字从哪来，怎么写得诚实', id: 'ch06-4' },

    { t: 'p', html: '数字让经历可比较，也让你在面试中有话可说。四类常见量化：<b>规模</b>（240 盏灯、12 个节点、3 个校区）、<b>效率</b>（处理时间从 2 小时降到 20 分钟）、<b>质量</b>（误差从 8% 降到 1%、故障率下降一半）、<b>影响</b>（年节省 2 万元、覆盖 600 名学生）。不必每类都有，但每条重要经历至少有一个数字。' },

    { t: 'p', html: '数字必须能追溯。面试官会问「33% 怎么算的」，你要能答出基线、测量方式与样本量。如果数字是估算，就写 <em>about</em> 或 <em>estimated</em>，并在面试时说明假设。编数字是最危险的操作：一旦被追问细节，整份简历的可信度都会崩。课程明确要求真实经历，抄袭或代写记零，编造数字同样属于学术不端。' },

    { t: 'p', html: '没有硬数字时，用<b>可核查的替代量</b>：参与人数、文档页数、代码行数、测试用例数、会议次数、覆盖范围。例如「组织了 4 次跨班组会议，形成 3 页需求清单，被后勤处采纳」。这些数字不夸张，但能证明你做了事、事情有产出。' },

    { t: 'p', html: '量化的语气要克制。一条 bullet 里塞五个数字，读者会怀疑真实性；一条里一个核心数字，反而可信。比例与绝对值最好同时给：<em>cut energy use by 33% (from 5.1 to 3.4 kWh per day)</em>。比例说明效果，绝对值说明规模，两者一起才完整。' },

    { t: 'h', lvl: 2, text: '五、求职信四段：来意、匹配、再匹配、请求', id: 'ch06-5' },

    { t: 'p', html: '求职信（cover letter）不是简历的复述，而是<b>解释为什么这份简历配这个岗位</b>。四段结构最稳。<b>第一段，来意与来源</b>：申请什么岗位、从哪里看到、一句话说明你为什么合适。<b>第二段，匹配证据一</b>：挑岗位最看重的一项要求，用一段经历证明。<b>第三段，匹配证据二</b>：再挑一项，最好是与第一段不同的能力（技术 + 沟通、分析 + 落地）。<b>第四段，请求与收尾</b>：明确请求面试、给出可投入时间与联系方式、礼貌结束。' },

    { t: 'p', html: '第一段不要写 <em>I am writing to apply for the position of…</em> 这种把信封内容重复一遍的开头。可以直接给匹配结论：<em>Your energy audit team needs someone who can turn meter data into a costed retrofit plan; I built exactly that for three dormitory corridors last semester.</em> 一句话，岗位需求、你的证据、关联全在。' },

    { t: 'table', caption: '四段求职信的分工与句式', head: ['段落', '任务', '可用句式', '长度'], rows: [
      ['第 1 段', '岗位、来源、匹配结论', 'Your team needs …; I have …', '3–4 句'],
      ['第 2 段', '最强证据（技术或分析）', 'In my role as …, I … which resulted in …', '5–7 句'],
      ['第 3 段', '第二证据（沟通或落地）', 'I also coordinated … , which required …', '4–6 句'],
      ['第 4 段', '请求面试、时间、联系方式', 'I would welcome the chance to discuss …', '3–4 句']
    ] },

    { t: 'p', html: '求职信要针对<b>具体机构</b>，不能只有岗位名。写清你为什么投这家：他们的项目、他们的服务对象、你与他们工作的交集。课程要求致 Director of Human Resources，称呼写 <em>Dear Director of Human Resources</em>；如果知道姓名，写 <em>Dear Ms Chan</em> 更好。不知道性别时用全名，不要用 <em>Dear Sir or Madam</em> 这种上世纪的写法。' },

    { t: 'p', html: '结尾的请求要具体但不卑微。<em>I would welcome the opportunity to discuss how I can support your energy audit team. I am available for an interview on weekday afternoons and can be reached at …</em> 给出可面试时间，减少对方一次往返。不要写 <em>I hope you will consider me</em> 这种把决定权全交出去、自己毫无存在感的句子。' },

    { t: 'h', lvl: 2, text: '六、关键词映射：把岗位要求逐条对上经历', id: 'ch06-6' },

    { t: 'p', html: '关键词映射（keyword mapping）是把 JD 的要求逐条翻译成你的证据。做法：左列抄要求（原词），中列写你的经历，右列写你准备放在简历还是求职信。映射完，你会发现两件事：哪些要求你有证据但没写出来，哪些要求你确实没有。前者补进简历，后者在求职信里用相邻能力 bridging，不要硬编。' },

    { t: 'table', caption: '要求—证据映射示例（能源分析实习）', head: ['岗位要求（原词）', '我的证据', '放在哪'], rows: [
      ['energy audit', '三栋宿舍走廊照明审计，240 盏，14 天记录', '简历项目第一条'],
      ['payback analysis', '算出 16,500 元投资、9.6 个月回本', '简历 + 求职信第二段'],
      ['Python', '用 pandas 清洗 20,160 条读数', '技能栏 + 项目第二条'],
      ['stakeholder communication', '向后勤处做 8 分钟汇报，按反馈改方案', '求职信第三段'],
      ['Chinese and English', '课程展示与报告均为英文，日常中文沟通', '技能栏一行']
    ] },

    { t: 'p', html: '映射还要注意<b>原词复现</b>。JD 写 <em>data logging</em>，你写 <em>data collection</em>，机器筛可能匹配不上；JD 写 <em>lighting retrofit</em>，你写 <em>lamp replacement</em>，人读得懂，系统读不懂。做法是自然地把原词放进句子里，不要堆关键词——堆砌会被招聘方一眼看穿，反而减分。' },

    { t: 'p', html: '如果某条硬性要求你确实不满足，不要假装满足。可以在求职信里承认并给替代证据：<em>I have not yet worked with HVAC systems, but I built the metering and analysis workflow for a lighting project, which uses the same data pipeline.</em> 诚实加迁移能力，比编造一段经历安全得多。' },

    { t: 'h', lvl: 2, text: '七、语气与礼貌：正式但不僵硬', id: 'ch06-7' },

    { t: 'p', html: '求职文书的语气有三个刻度：<b>正式度</b>（完整句、无缩写、无表情符号）、<b>自信度</b>（说事实，不用 <em>I think I can</em>）、<b>温度</b>（对机构与读者有基本尊重，不谄媚）。三者平衡的写法是：<em>I built a metering workflow that cut manual data cleaning from two hours to twenty minutes.</em> 没有形容词，但自信与礼貌都在。' },

    { t: 'p', html: '几个具体禁区。<b>不要用缩略形式</b>：I am、I have、do not，不要写成 I am 的缩写。<b>不要用感叹号</b>。<b>不要用 <em>I am the best candidate</em></b> 这类自我评价，让证据说话。<b>不要贬低别人</b>：<em>unlike other students</em> 会让读者不舒服。<b>不要过度道歉</b>：<em>Sorry to bother you</em> 开头等于先把自己放低。' },

    { t: 'p', html: '称呼与结尾也有讲究。知道姓名用 <em>Dear Ms Chan</em>，不知道用 <em>Dear Director of Human Resources</em>，实在不知道部门用 <em>Dear Hiring Manager</em>。结尾用 <em>Yours sincerely</em>（知道姓名）或 <em>Yours faithfully</em>（不知道姓名），下面是全名与联系方式。中文名建议写成 <em>Given Family</em> 的固定顺序，全篇一致，不要一半倒装一半不倒装。' },

    { t: 'p', html: '还有一个常被忽略的礼貌：<b>尊重读者的时间</b>。求职信一页、四段、每段不超过七句，就是在说「我知道你很忙」。反过来，两页半、从童年讲起，无论语言多好，都在增加读者的成本。技术写作的礼貌，本质上就是替读者省时间。' },

    { t: 'h', lvl: 2, text: '八、可检索性与常见错误', id: 'ch06-8' },

    { t: 'p', html: '很多机构用申请人跟踪系统（applicant tracking system，ATS）先筛一遍。ATS 读不了复杂排版：分栏、表格、文本框、图片里的字，它可能全部丢掉。因此简历要<b>单栏、纯文本、标准标题</b>（Education、Experience、Skills），文件用 PDF 但文字可选，不要扫描成图片。文件名写 <em>Family_Given_Resume.pdf</em>，不要写 <em>final_final_v3.pdf</em>。' },

    { t: 'table', caption: '八个高频错误与修法', head: ['错误', '后果', '修法'], rows: [
      ['一份简历投所有岗位', '关键词不匹配，机器筛掉', '一岗一版，重排与替换关键词'],
      ['Responsible for… 开头', '只有职责，没有结果', '改成动作动词 + 对象 + 结果'],
      ['数字无法追溯', '面试追问即崩', '写清基线、方法、样本量，估算加 about'],
      ['超过一页', '违反课程要求，重点被稀释', '删无关兼职与重复课程'],
      ['求职信复述简历', '浪费一次说服机会', '每段给新证据，解释为什么匹配'],
      ['称呼与机构名写错', '第一行就失分', '投前逐字核对机构名与人名'],
      ['拼写与格式不统一', '显得不认真', '打印出来读一遍，检查日期与标点'],
      ['用 AI 代写整封', '课程按零分处理', '只用工具检查语法，内容必须自己写']
    ] },

    { t: 'p', html: '提交前做一次「十秒测试」：把简历给一个不了解你的人看十秒，然后拿走，问他「这个人最擅长什么、有什么证据」。答得出来，说明层级与重点对了；答不出来，说明信息太散。再做一次「追问测试」：挑三条 bullet，问自己「如果面试官追问细节，我能不能给出数字、方法与情境」。答不上来的，要么补细节，要么删掉。' },

    { t: 'p', html: '最后是格式检查清单：一页吗？PDF 打开缺字吗？日期格式统一吗？时态一致吗？机构名与人名拼对了吗？邮箱是否专业（不要用昵称邮箱）？电话带国家码吗？附件命名规范吗？这八个问题过一遍，能挡掉大多数「内容不错但第一轮就被刷」的情况。' },

    { t: 'terms', items: [
      { en: 'job description (JD)', zh: '招聘广告', html: '岗位的任务书，拆成硬性要求、加分项与关键词三张清单，是简历与求职信的唯一依据。' },
      { en: 'reverse chronological', zh: '时间倒序', html: '按最近经历在前的简历结构，招聘方最熟悉，适合经历连续且相关的人。' },
      { en: 'action verb', zh: '动作动词', html: 'designed、calibrated、automated 等说明具体动作的动词，替代 responsible for 这类弱表达。' },
      { en: 'quantification', zh: '量化', html: '用规模、效率、质量或影响数字证明结果；数字必须能追溯，估算要标注。' },
      { en: 'cover letter', zh: '求职信', html: '四段结构：来意与匹配结论、证据一、证据二、请求面试；不是简历的复述。' },
      { en: 'keyword mapping', zh: '关键词映射', html: '把岗位要求逐条对上自己的经历与产出，决定放在简历还是求职信。' },
      { en: 'ATS', zh: '申请人跟踪系统', html: '自动筛选简历的软件，读不了复杂排版；单栏、标准标题、可选文字最稳。' }
    ] },

    { t: 'quiz', qid: 'ch06-q1' },
    { t: 'quiz', qid: 'ch06-q2' },
    { t: 'quiz', qid: 'ch06-q3' },

    { t: 'keypoint', items: [
      { title: 'JD 是任务书', html: '拆硬性、加分、关键词三张清单；一岗一版，原词复现，不堆砌。' },
      { title: '结构服务匹配', html: '学生用混合式：能力摘要 + 教育 + 项目 + 技能；最相关的放最上面。' },
      { title: '经历句四件套', html: '动作动词 + 对象 + 方法 + 结果。弱动词只说明在场，不说明贡献。' },
      { title: '数字要能追问', html: '每条重要经历至少一个数字，写清基线、方法与样本量；估算标 about。' },
      { title: '求职信给新证据', html: '四段：来意与结论、证据一、证据二、请求。不复述简历，不写空洞赞美。' },
      { title: '格式也是能力', html: '一页、单栏、标准标题、PDF 可选文字、文件名规范；拼写与称呼零错误。' }
    ] },

    { t: 'checklist', id: 'ch06', items: [
      '我能把一则真实 JD 拆成硬性、加分与关键词三张清单',
      '我能做一张要求—证据表，并标出哪些要求我确实没有证据',
      '我能把三条「负责……」式句子改写成动作加结果的经历句',
      '我能给每条重要经历补一个可追溯的数字，并准备被追问时的解释',
      '我能按四段结构写出一封针对具体机构与岗位的求职信',
      '我能在求职信里给出与简历不同的第二证据，而不是复述',
      '我能检查称呼、机构名、时态、日期格式与文件名是否符合规范',
      '我能通过十秒测试与追问测试，判断简历的重点是否清楚',
      '我知道课程要求一页简历加一页求职信、合成一个 PDF、真实经历'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应第 10 周的 résumé / CV 与第 11 周的 cover letter 两次课，并遵循 Assessment 2 Part A 的提交要求：求职信与简历各一页、合成一个 PDF、致 Director of Human Resources、使用真实相关经历、抄袭或 AI 代写记零。经历句公式、量化写法与关键词映射参照课堂讲义、Resume Sample 与 action verbs 清单，并衔接 Professional Portfolio Scoring Rubric 对内容、语言与格式的要求。照明审计的数字沿用前几章的教学算例，仅作示例。' }
  ]
});
