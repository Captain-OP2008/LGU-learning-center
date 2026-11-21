/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'eng1001',
  short: 'ENG1001',
  name: '英语桥接课程',
  en: 'English Bridge Program',
  dept: '人文与语言',
  lang: 'text',
  langLabel: 'English',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'ENG1001 // WRITING LAB',
  bootLog: [
    '> mounting course partition ... ENG1001',
    '> loading 8 modules ... reading, summary, citation, speaking',
    '> calibrating glossary & quiz bank ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '从读懂一篇英文文章，到写出自己的判断，再到讲给一屋子人听。',
  missionEn: 'ENG1001 · 8 MODULES · READING → WRITING → SPEAKING',
  missionTitle: '从「会考试」<br><em>到会用英语做事</em>',
  lede: 'ENG1001 不是语法补习，而是一条完整的工作流：先读懂学术文章的结构与论证，再把它压成摘要，用准确的语言写出有出处的文章，最后做成五分钟的口头汇报。每一章都配术语表、对照表、自检清单与分章题库；读完一章，你应该能立刻动手做一件具体的事。',
  searchPlaceholder: 'QUERY // 搜索章节、术语、引用格式与题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录下的 ENG1001 文件夹，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/ENG1001/',
  resources: {
    note: '以下文件均为 CUHKSZ ENG1001 的真实课程资料，按「大纲与评分—写作模块—口头汇报与练习」三组排列。建议先看 syllabus 与写作 rubric 确认任务要求，再按模块顺序读讲义，最后用文章与听力练习卷做实战。具体作业比例、提交方式以当学期 syllabus 为准。',
    groups: [
      {
        name: '大纲与评分',
        note: '先读 syllabus 与课程安排，再读两份 rubric：写作与口头汇报的评分维度都在里面，写作业前对照一遍能省很多返工。',
        items: [
          { title: 'ENG1001 课程大纲（Syllabus）', path: '作业习题/ENG1001_2023_EBP_Syllabus.docx', kind: 'docx', note: '课程目标、模块安排、作业类型与学术诚信要求，开学第一份该读的文件。' },
          { title: '2023 秋季课程安排（Course Schedule）', path: '学习资料/ENG1001_2023_EBP_Course_Schedule.docx', kind: 'docx', note: '每周主题与任务节点，用来对照本站 ch00 的学期节奏。' },
          { title: '写作评分标准解读（Understanding the Writing Rubric）', path: '作业习题/ENG1001_WRITING_ASSIGNMENTS_Understanding_the_Writing_Rubric.docx', kind: 'docx', note: '内容、组织、语言、引用四个维度分别看什么，写文章前先读。' },
          { title: '个人文章评分表（Personal Essay Rubric）', path: '作业习题/ENG1001_WRITING_ASSIGNMENTS_2023_EBP_Essay_Rubric_Personal_Essay.docx', kind: 'docx', note: '个人文章的分项标准，对应本站 ch06 的 rubric 自评。' },
          { title: '口头汇报评分表（Rubric for Oral Presentations）', path: '学习资料/ENG1001_INDIVIDUAL_PRESENTATIONS_2023_EBP_Rubric_for_oral_presentations.docx', kind: 'docx', note: '内容、组织、表达、视觉辅助、时间与问答，对应 ch07。' }
        ]
      },
      {
        name: '写作模块讲义',
        note: 'Writing I–IV 是写作主线：段落与文章、语言、引用与改写、来源与 APA；Summary / Response / Personal Essay 三份专题课件对应具体文体。',
        items: [
          { title: 'Module I Writing：段落与文章结构', path: '学习资料/ENG1001_Module_I_Writing.ppt', kind: 'ppt', note: '从主题句到段落展开，对应本站 ch01–ch02 与 ch06 的 PEEL。' },
          { title: 'Module II Writing：学术语言', path: '学习资料/ENG1001_Module_II_Writing_Language.ppt', kind: 'ppt', note: '语域、准确、简洁与衔接，对应 ch03。' },
          { title: 'Module III Writing：抄袭、改写与直接引用', path: '学习资料/ENG1001_Module_III_Writing_Plagiarism_Paraphrasing_Direct_Quotation.ppt', kind: 'ppt', note: '改写四步与引用规则，对应 ch04。' },
          { title: 'Module IV Writing：优质来源与 APA 引用', path: '学习资料/ENG1001_Module_IV_Writing_Modul_IV_Writing_Finding_Quality_Sources_and_APA_Citation_Style.pptx', kind: 'pptx', note: '来源评估与 APA 基本格式，对应 ch05。' },
          { title: 'Module IV Writing：APA 参考文献表的不同来源类型', path: '学习资料/ENG1001_Module_IV_Writing_Different_sources_in_APA_styles_in_the_reference_list.pdf', kind: 'pdf', note: '期刊、书、网页等条目的对照示例，做参考文献表时逐条核对。' },
          { title: 'How to Write a Summary', path: '学习资料/ENG1001_FALL_2023_EBP_POWERPOINT_LESSONS_How_to_Write_a_Summary.ppt', kind: 'ppt', note: '摘要的骨架与常见错误，对应 ch02。' },
          { title: 'How to Write a Response Essay', path: '作业习题/ENG1001_FALL_2023_EBP_POWERPOINT_LESSONS_How_to_Write_a_Response_Essay.ppt', kind: 'ppt', note: '回应文章的读—限定—表态流程，对应 ch06 后半。' },
          { title: 'How to Write a Personal Essay', path: '作业习题/ENG1001_FALL_2023_EBP_POWERPOINT_LESSONS_How_to_Write_a_Personal_Essay.ppt', kind: 'ppt', note: '个人经验如何变成论点，对应 ch06 前半。' },
          { title: 'The Writing Process：从构思到改稿', path: '学习资料/ENG1001_FALL_2023_EBP_POWERPOINT_LESSONS_The_Writing_Process.pptx', kind: 'pptx', note: '计划、起草、修改、校对的完整流程，配合 ch03 的三遍改稿。' }
        ]
      },
      {
        name: '口头汇报与练习',
        note: '口头汇报的四份课件对应内容、肢体、视觉与整体表达；文章与听力练习卷用来做阅读和听力训练，期末汇报的文章也在这一组。',
        items: [
          { title: 'Public Speaking：汇报的整体策略', path: '学习资料/ENG1001_FALL_2023_EBP_POWERPOINT_LESSONS_Public_Speaking.pptx', kind: 'pptx', note: '结构、听众分析与临场，对应 ch07 前半。' },
          { title: 'Speaking：肢体语言（Body Language）', path: '学习资料/ENG1001_Module_II_Speaking_Body_language.ppt', kind: 'ppt', note: '站姿、手势与眼神，对应 ch07 第三节。' },
          { title: 'Speaking：内容组织（Content）', path: '学习资料/ENG1001_Module_III_Speaking_Content_Module_III_Speaking_Content.pptx', kind: 'pptx', note: '一论点三支撑与过渡，对应 ch07 第二节。' },
          { title: 'Speaking：视觉辅助（Visual Aids）', path: '学习资料/ENG1001_Module_IV_Speaking_Visual_Aids.ppt', kind: 'ppt', note: '幻灯片设计与图表使用，对应 ch07 第五节。' },
          { title: '期末汇报指定文章（Final Presentation Article）', path: '考试资料/ENG1001_Documents_for_the_final_presentation_the_article.docx', kind: 'docx', note: '期末口头汇报的阅读材料，可用来练摘要与回应。' },
          { title: '听力练习卷 1（含答案）', path: '考试资料/ENG1001_PRACTICE_FinalS_Listening_Exam_1_QUIZ.docx', kind: 'docx', note: '限时听一遍再对答案，答案在 Keys to Listening Exam #1。' },
          { title: '听力练习卷 1 答案', path: '考试资料/ENG1001_PRACTICE_FinalS_Keys_to_Listening_Exam_#1.docx', kind: 'docx', note: '做完再打开，重点看漏听的是数字、转折还是态度词。' },
          { title: '阅读材料：Privacy in a Digital World', path: '学习资料/ENG1001_COURSE_MATERIALS_Privacy_in_a_digital_world.docx', kind: 'docx', note: '适合练主旨、证据与回应文章，本站多处用作示例。' },
          { title: '阅读材料：AI 修复名画的争议', path: '学习资料/ENG1001_COURSE_MATERIALS_Artificial_intelligence_is_restoring_lost_works_by_Klimt_Picasso_and_Rembrandt_Not_everyone_is_happy_about_it.docx', kind: 'docx', note: '技术能力与决策程序两层争论，适合练摘要与限定 thesis。' }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '英语桥接课程（English Bridge Program，ENG1001），读写与口头汇报综合训练'],
    ['来源', 'CUHKSZ ENG1001 课程资料：syllabus、写作与口头汇报 rubric、Writing I–IV 与 Speaking 模块课件、练习文章与听力卷'],
    ['结构', '8 章正文 · 56 题分章题库 · 模拟卷 A · 3 个实战项目 · 4 页速查表 · 资料库'],
    ['建议', '先读第 0 章建立地图，再按 ch01→ch07 推进；每章的批注、摘要、改写练习要真的动笔，只看不写等于没学。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    {
      label: '阅读与摘要',
      blocks: [
        { t: 'p', html: '读学术文章的顺序是<b>先结构、再主旨、后细节</b>：看标题与小标题猜框架，读首段与每段第一句抓主旨，最后才回头处理生词与数据。摘要则是反方向：先确认主旨，再挑两三个分点，最后用一句话收束。' },
        { t: 'table', caption: '一段式摘要的四句骨架', head: ['位置', '作用', '句式'], rows: [
          ['第 1 句', '出处 + 主旨', 'In “Title,” Author (Year) argues that ______.'],
          ['第 2 句', '第一个分点', 'The author first shows that ______.'],
          ['第 3 句', '第二个分点', 'She then explains that ______.'],
          ['第 4 句', '收束', 'The article concludes that ______.']
        ] },
        { t: 'table', caption: '摘要里该留与该删', head: ['保留', '删除'], rows: [
          ['主旨、关键分点、作者的限定条件', '具体例子、重复数据、修辞性描写'],
          ['能改变结论的反例或让步', '你的评价（convincing、important、should）'],
          ['作者的身份与文章目的（如政策报告）', '与主旨无关的背景段']
        ] }
      ]
    },
    {
      label: '引用与 APA',
      blocks: [
        { t: 'p', html: '引用方式只有三种：<b>直接引用</b>（原句 + 引号 + 页码）、<b>改写</b>（换句法、保留观点、标注作者年份）、<b>概括</b>（压缩成一句判断、标注来源）。判断标准不是「改了多少词」，而是「这句话的句法与结构是谁的」。' },
        { t: 'table', caption: 'APA 第 7 版文内引用速查', head: ['情形', '文内写法'], rows: [
          ['一位作者', '(Smith, 2021) 或 Smith (2021) argues ...'],
          ['两位作者', '(Smith & Lee, 2021)，正文中用 and'],
          ['三位及以上', '(Smith et al., 2021)，首次即用 et al.'],
          ['直接引用', '(Smith, 2021, p. 45)'],
          ['无日期', '(Smith, n.d.)'],
          ['机构作者', '第一次写全称加缩写：World Health Organization [WHO], 2021']
        ] },
        { t: 'table', caption: '参考文献表三类条目', head: ['类型', '格式'], rows: [
          ['期刊文章', 'Author, A. A. (Year). Title of article. Journal Name, volume(issue), pages. https://doi.org/xxx'],
          ['书', 'Author, A. A. (Year). Title of work (2nd ed.). Publisher.'],
          ['网页', 'Author or Organization. (Year, Month Day). Title of page. Site Name. URL']
        ] }
      ]
    },
    {
      label: '句子与衔接',
      blocks: [
        { t: 'p', html: '学术句子追求<b>准确、简洁、可跟随</b>。写完一段后做三件事：把名词化还原成动词、删掉空洞修饰、检查每个代词是否有明确先行词。三件事做完，段落通常会短四分之一，意思反而更清楚。' },
        { t: 'table', caption: '四类高频错误与改法', head: ['错误', '病句', '改法'], rows: [
          ['主谓不一致', 'The number of studies have increased.', 'The number ... has increased.'],
          ['悬垂修饰', 'After reading the article, the conclusion seemed clear.', 'After I read the article, the conclusion seemed clear.'],
          ['逗号拼接', 'The sample was small, the results are tentative.', 'The sample was small; therefore, the results are tentative.'],
          ['时态混乱', 'Smith argues that the policy failed, and he notes it is failing now.', 'Smith argues that the policy failed ... he notes that it is failing now.']
        ] },
        { t: 'table', caption: '冗余 → 简洁', head: ['冗余', '简洁'], rows: [
          ['due to the fact that', 'because'],
          ['in order to', 'to'],
          ['each and every', 'every'],
          ['make a decision', 'decide'],
          ['at this point in time', 'now']
        ] },
        { t: 'p', html: '衔接靠三条线同时工作：<b>指代</b>（this policy 指前句哪个名词）、<b>连接词</b>（however 表转折、therefore 表结果）、<b>关键词复现</b>（同一术语反复出现，读者才知道还在同一话题上）。只堆连接词、不管理指代，段落仍然会散。' }
      ]
    },
    {
      label: '口头汇报',
      blocks: [
        { t: 'p', html: '五分钟汇报的默认配置：<b>一句核心信息、三条支撑、五页幻灯片、三轮排练</b>。开场给钩子与路线图，主体每点一个路标词，收束重述判断并给落点。幻灯片是提词板，不是讲稿。' },
        { t: 'table', caption: '时间与内容分配', head: ['部分', '占比', '内容'], rows: [
          ['开场', '15%', '钩子 + 为什么重要 + 路线图'],
          ['主体', '70%', '三条支撑，各配证据与一句解释'],
          ['收束', '15%', '重述核心信息 + 落点/建议'],
          ['问答', '另计', '复述问题 → 结论 → 一条理由']
        ] },
        { t: 'table', caption: '上台前的检查清单', head: ['检查项', '标准'], rows: [
          ['核心信息', '一句完整判断，能被听众复述'],
          ['幻灯片', '一页一个观点，正文 ≤ 6 行，字号 ≥ 24'],
          ['来源', '数据与图片都在页面角落标注'],
          ['排练', '对稿、对时、对场各一遍，录像回看'],
          ['填充词', '每分钟 ≤ 2 次，用停顿替代'],
          ['问答', '准备「不会时怎么答」的三种句式']
        ] }
      ]
    }
  ]
};
