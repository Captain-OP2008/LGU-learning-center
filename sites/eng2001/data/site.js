/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'eng2001',
  short: 'ENG2001',
  name: '学术英语 II',
  en: 'English for Academic Purposes II',
  dept: '人文与语言',
  lang: 'text',
  langLabel: 'English',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'ENG2001 // WRITING LAB',
  bootLog: [
    '> mounting course partition ... ENG2001',
    '> loading 8 modules: read → question → review → argue → present',
    '> indexing 56 quiz items & 4 cheat sheets ...',
    '> ready. start with ch00 to see the whole map.'
  ],

  /* 首页主视觉文案 */
  tagline: '先学会读一篇论文，再写出自己的那一篇。',
  missionEn: 'ENG2001 · 8 MODULES · 4 DELIVERABLES',
  missionTitle: '从读到写<br><em>学术英语 II</em>',
  lede: '学术英语不是「更难的英语」，而是一套可拆解的流程：读结构、提问题、做综述、定方法、搭论证、讲清楚、改到定稿。八章按这条线推进，每章配术语表、对照表、内嵌练习与结尾自检清单。',
  searchPlaceholder: 'QUERY // 搜索章节、术语、句式与题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/ENG2001/',
  resources: {
    note: '以下文件均为 CUHKSZ ENG2001 的真实课程资料，按「大纲与项目说明—课堂讲义—阅读材料与模板」三组排列；建议先读课程大纲与项目说明确认交付物，再按周次跟讲义，写作时直接取模板。',
    groups: [
      {
        name: '大纲与项目说明',
        note: '先看课程大纲与两份评分标准：交付物、字数、评分维度都在里面，写作前先对着 rubric 反推结构。',
        items: [
          { title: 'ENG2001 课程大纲（Course Outline）', path: '学习资料/ENG2001_Week_01_Class_1_Introduction_to_the_course_ENG2001_Course_Outline_Fall_2024.docx', kind: 'docx', note: '考核比例、周次安排、交付物清单，开学第一份该读的文件。' },
          { title: '研究项目总说明（Research Project Instructions）', path: '作业习题/ENG2001____Research_project_submission_folder____ENG2001_Research_Project_Instructions_Fall_2024.docx', kind: 'docx', note: '论文与展示的总要求，对应本站 ch02、ch05、ch07。' },
          { title: '研究论文评分标准（Research Paper Rubric）', path: '作业习题/ENG2001____Research_project_submission_folder____ENG2001_Research_Paper_Scoring_Rubric_Fall_2024.docx', kind: 'docx', note: '按维度给分，写作前逐条对照可以少走弯路。' },
          { title: '研究提案说明与评分标准（Proposal）', path: '作业习题/ENG2001_Research_proposal_submission_ENG2001_Research_proposal_instructions_+_scoring_rubrics.docx', kind: 'docx', note: '一页提案的字段与评分点，对应 ch02 末尾的提案练习。' },
          { title: '口头展示评分标准（Presentation Rubric）', path: '作业习题/ENG2001____Research_project_submission_folder____ENG2001_Research_Presentation_Scoring_Rubric_Fall_2024.docx', kind: 'docx', note: '内容、组织、语言、交付四项，对应 ch06 的演讲自评表。' }
        ]
      },
      {
        name: '课堂讲义',
        note: '按周次编号（Week 01–12）；同一周有 Class 1 / Class 2 两份，复习时先看与当前章节对应的那一份。',
        items: [
          { title: 'Week 1 Class 2：侦探游戏与下周阅读', path: '学习资料/ENG2001_Week_01_Class_2_Detective_game_+_reading_for_the_next_week_ENG_2001_Fall_2024_Week_1_Class_2_DL.pdf', kind: 'pdf', note: '用侦探游戏引出「证据 → 推断」，是 ch05 论证结构的起点。' },
          { title: 'Week 2 Class 1：检索、评估来源与确定研究问题', path: '学习资料/ENG2001_Week_02_Class_1_Searching_Evaluating_sources_+_Identify_a_research_topic_&_research_questions_ENG_2001_Fall_2024_Week_2_Class_2_DL.pdf', kind: 'pdf', note: '布尔检索与 CRAAP 评估的课堂版，对应 ch02。' },
          { title: 'Week 3 Class 2：研究问题与引言（含文献综述）', path: '学习资料/ENG2001_Week_03_Class_2_RQ_+_Introduction_including_Literature_review_ENG_2001_Fall_2024_Week_3_Class_2_DL.pdf', kind: 'pdf', note: 'RQ 与 introduction 的对接方式，是 ch03 的核心材料。' },
          { title: 'Week 4 Class 1：方法之问卷设计', path: '学习资料/ENG2001_Week_04_Class_1_Methods_questionnaire_ENG_2001_Fall_2024_Week_4_Class_1_Methods_questionnaire.pdf', kind: 'pdf', note: '题型、量表与双管题的课堂示例，对应 ch04 前半。' },
          { title: 'Week 5 Class 2：公共演讲的三种诉诸', path: '学习资料/ENG2001_Week_05_Class_2_Public_speech_Three_appeals_2024_fall_Week_5_Class_2_DL.pdf', kind: 'pdf', note: 'ethos / pathos / logos 的判定与使用，对应 ch06 前半。' },
          { title: 'Week 6 Class 1：论证结构', path: '学习资料/ENG2001_Week_06_Class_1Argument_structure_2024_Fall_Week_6_Class_1_DL.pdf', kind: 'pdf', note: 'claim–data–warrant 的课堂推演，对应 ch05 全章。' },
          { title: 'Week 10 Class 1：方法与结果的写作', path: '学习资料/ENG2001_Week_10_Class_1_Writing_of_Method_&_Findings_2024_Week_10_Class_1_Writing_of_methods_&_results_DL.pdf', kind: 'pdf', note: '方法与结果两节的时态、语态与信息顺序，对应 ch04 与 ch07。' },
          { title: 'Week 10 Class 2：讨论的写作', path: '学习资料/ENG2001_Week_10_Class_02_Writing_of_discussion_DL.pdf', kind: 'pdf', note: '讨论四步（解释、比较、限制、启示）的范例句，对应 ch07。' },
          { title: 'Week 12 Class 1：摘要、结论、回扣与 APA 7', path: '学习资料/ENG2001_Week_12_Class_1_Abstract_Conclusion_Recapture_APA7_Week_12_Class_1_Writing_of_abstract_&_Assessment_Instructions.pdf', kind: 'pdf', note: '摘要五句式与结论写法的收尾讲义，定稿前必看。' }
        ]
      },
      {
        name: '阅读材料与模板',
        note: '两篇指定阅读是全书唯一引用的文献；模板与工作纸可以直接下载后改写，不要从零开始排版。',
        items: [
          { title: 'Yu & Lee (2014)：中国 EFL 学生在同伴反馈中的一语与二语使用', path: '学习资料/ENG2001_Week_01_Class_2_Detective_game_+_reading_for_the_next_week_Yu_&_Lee_2014_An_analysis_of_Chinese_EFL_students_use_of_first_and_second_language_in_the_peer_feedback_of_L2_writing.pdf', kind: 'pdf', note: 'ch01 的拆解样例、ch05 的证据来源，全书反复引用。' },
          { title: 'Wang (2018)：中国学生长期留学的学术适应', path: '学习资料/ENG2001_Week_04_Class_2_Methods_interview_+_Timeline_+_Significance_Wang_2018_Long_Term_Chinese_Students_Transitional_Experiences_in_UK_Higher_Education_A_Particular_Focus_on_their_Academic_Adjustment.pdf', kind: 'pdf', note: '质性访谈研究，ch04 的抽样与访谈范例。' },
          { title: 'APA 7 简明指南（Brief Version）', path: '学习资料/ENG2001_Week_12_Class_1_Abstract_Conclusion_Recapture_APA7_2024_APA_7_Style_Brief_version.pdf', kind: 'pdf', note: '文内引用与参考文献条目的官方速查，配合 ch03、ch07 使用。' },
          { title: '研究论文模板（Research Paper Template）', path: '作业习题/ENG2001____Research_project_submission_folder____ENG2001_Research_paper_template.docx', kind: 'docx', note: '已排好标题层级与页面设置，直接套用可省掉格式返工。' },
          { title: '文献综述学习工作纸（Literature Review Workshop）', path: '学习资料/ENG2001_Week_11_Class_1_Literature_review_writing_Literature_review_learning_workshop_worksheet.docx', kind: 'docx', note: '把多篇文献合并成主题句的练习，对应 ch03 的 synthesis 练习。' },
          { title: '研究项目展示与海报工作纸', path: '学习资料/ENG2001_Week_12_Class_2_Poster_feedback_to_PPT_prepration_Poster_feedback_worksheet.docx', kind: 'docx', note: '海报自评与互评清单，对应 ch06 后半的海报部分。' }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '学术英语 II（English for Academic Purposes II，ENG2001），人文与语言'],
    ['来源', 'CUHKSZ ENG2001 课程资料：大纲、周次讲义、两篇指定阅读、项目模板与评分标准'],
    ['结构', '8 章正文 · 56 题分章题库 · 模拟卷 A · 3 个实战项目 · 4 页速查表 · 资料库'],
    ['建议', '先读第 0 章建立地图，再按 ch01→ch07 推进；每章结尾的自检清单与内嵌题不要跳过。']
  ],

  /* 速查表：写作与演讲速查（4 页） */
  cheat: [
    {
      label: '学术语域与句式',
      blocks: [
        { t: 'p', html: '学术语域不是「用大词」，而是三条可检验的标准：<b>信息密度高</b>（每句都在推进）、<b>非人格化</b>（少用 I think，多用证据说话）、<b>可核查</b>（每个判断都能指向来源或数据）。改写的方向通常是：把口语评价换成可观察的量，把「我们做了」换成「研究做了什么」。' },
        { t: 'table', caption: '同一意思的三种写法：口语 → 学术', head: ['口语说法', '学术写法', '改动在哪'], rows: [
          ['A lot of students think that feedback is useful.', 'A substantial proportion of students regarded feedback as useful.', '模糊量词精确化，think 换成 regard as'],
          ['We did a survey because we wanted to know their views.', 'A survey was conducted to examine how students view feedback.', '被动语态 + 目的不定式'],
          ['The results are very good.', 'The results are consistent with the hypothesis.', '形容词换成可验证的判断'],
          ['This is a big problem.', 'This remains a persistent challenge for first-year writers.', '尺寸词换成时间与对象都明确的描述']
        ] },
        { t: 'table', caption: '三个必会句式（写作时直接套）', head: ['功能', '模板', '注意'], rows: [
          ['界定范围', 'This study focuses on X rather than Y.', 'rather than 明确边界，避免被追问「为什么不管 Y」'],
          ['报告发现', 'The data indicate that ...', 'indicate / suggest 比 prove 稳妥，除非真有因果实验'],
          ['承认限制', 'One limitation of this study is that ...', '主动写限制比被审稿人指出更可信']
        ] }
      ]
    },
    {
      label: '引用与 APA 7',
      blocks: [
        { t: 'p', html: '引用的目的不是「显示读过」，而是<b>把主张接到证据上</b>。APA 7 只要求两件事：正文里的括号能让人一眼找到文末条目；文末条目能让人一眼找到原文。凡是做不到这两点的格式，都是无效格式。' },
        { t: 'table', caption: '文内引用四种情形', head: ['情形', '写法', '要点'], rows: [
          ['括号式，一位作者', '(Wang, 2018)', '作者与年份之间用逗号，句号在括号外'],
          ['叙述式，作者作句子成分', 'Wang (2018) argues that ...', '年份紧跟姓名，动词用一般现在时'],
          ['两位作者', '(Yu & Lee, 2014)', '正文括号用 &，叙述式句子用 and'],
          ['直接引语', '(Wang, 2018, p. 45)', '必须给页码；无页码用 para. 或章节名']
        ] },
        { t: 'table', caption: '参考文献条目模板（占位符替换成真实信息）', head: ['类型', '模板', '要点'], rows: [
          ['期刊论文', 'Author, A. A. (Year). Title of article. Journal Name, volume(issue), pages. https://doi.org/xxxx', '期刊名与卷号斜体，标题只有首词与专名大写'],
          ['专著', 'Author, A. A. (Year). Title of book. Publisher.', '书名斜体，出版社不写地点'],
          ['网页', 'Author, A. A. (Year, Month Day). Title of page. Site Name. URL', '无个人作者时机构作作者；日期取页面上的发布日'],
          ['课堂讲义', 'Author, A. A. (Year). Title of slides [PowerPoint slides]. Institution.', '方括号注明载体，未公开材料也要给出处']
        ] },
        { t: 'p', html: '一致性检查只问三句：正文里出现的每个名字，文末有没有对应条目？文末每个条目，正文有没有至少引用一次？同一个来源在正文与文末的年份、拼写是否完全一致？' }
      ]
    },
    {
      label: '论证与演讲模板',
      blocks: [
        { t: 'p', html: '论证的最小单位是「主张 + 证据 + 担保」：<code>claim</code> 是你希望别人接受的话，<code>data</code> 是支撑它的事实，<code>warrant</code> 是「为什么这条事实能推出这个主张」的那句常被省略的话。写段落时先把 warrant 补出来，逻辑漏洞通常就露出来了。' },
        { t: 'table', caption: 'Toulmin 六要素：六个自问句', head: ['要素', '自问', '示例'], rows: [
          ['Claim 主张', '我希望读者接受什么？', '同伴反馈能提升二语写作的修改质量。'],
          ['Data 证据', '我手上有什么事实？', 'Yu and Lee (2014) 观察到学生在反馈后改写内容与语言。'],
          ['Warrant 担保', '这条证据凭什么支持主张？', '因为修改质量取决于学生是否理解反馈所指的问题。'],
          ['Backing 支撑', '担保本身有依据吗？', '写作修改研究普遍把「理解」列为中介变量。'],
          ['Qualifier 限定', '在什么条件下成立？', '对中级水平、有结构化反馈表的学生更明显。'],
          ['Rebuttal 反驳', '最强的反例是什么？', '若反馈只纠语法，改写深度可能不升反降。']
        ] },
        { t: 'table', caption: '十分钟研究演讲骨架', head: ['时间', '内容', '目的'], rows: [
          ['0:00–0:30', '钩子 + 问题 + 路线图', '三十秒内让听众知道「为什么值得听」'],
          ['0:30–3:00', '背景与 gap', '建立必要性：已有研究缺了什么'],
          ['3:00–6:30', '方法 + 结果（一图一结论）', '证明你知道自己在做什么'],
          ['6:30–8:30', '讨论与限制', '显示判断力，而不是回避弱点'],
          ['8:30–10:00', '结论 + 邀请提问', '留下一句能被记住的话']
        ] }
      ]
    },
    {
      label: '常见错误清单',
      blocks: [
        { t: 'p', html: '下面六条是这门课作业里最常见的失分点，每条都对应一个可执行的改法。交稿前把它们当 checklist 逐条过一遍，比再读一遍范文更有效。' },
        { t: 'table', caption: '症状 → 原因 → 改法', head: ['症状', '为什么扣分', '改法'], rows: [
          ['整段没有主题句', '读者找不到你的主张，只能自己猜', '段首写一句 claim，后面全部服务于它'],
          ['引用堆成读书报告', '缺少 synthesis，看不出你的判断', '按主题合并来源，段末给 comment'],
          ['结果段出现 because', '结果与讨论混写，读者分不清事实与解释', '结果只报告，把解释整段移到讨论'],
          ['时态全用现在时', '方法与结果应描述已发生的事', '方法/结果用过去时，普遍事实用现在时'],
          ['海报塞满正文', '视觉密度过高，听众读字不听你讲', '一页一主张，图优先于表，表优先于字'],
          ['参考文献与正文对不上', '学术规范硬伤，容易被判不当引用', '交稿前双向核对一次作者与年份']
        ] }
      ]
    }
  ]
};
