/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'eng1002',
  short: 'ENG1002',
  name: '学术英语 I',
  en: 'English for Academic Purposes I',
  dept: '人文与语言',
  lang: 'text',
  langLabel: 'English',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'ENG1002 // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... ENG1002',
    '> loading 8 modules ...',
    '> calibrating glossary & quiz bank ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '从一句正式的话，到一篇站得住的论文。',
  missionEn: 'ENG1002 · 8 MODULES · 3 ESSAYS',
  missionTitle: '从零开始<br><em>学术英语 I</em>',
  lede: '学术写作不是天赋，而是一套可以拆开练的动作：把话说正式、把主张说清楚、把来源标明白、把反方想周全。本站按「语体—结构—因果—检索—引用—论证—口语」推进，每章配术语表、对照表、自检清单与内嵌练习，题库与模拟卷可以直接自测。',
  searchPlaceholder: 'QUERY // 搜索章节、术语与题目',

  /* 资料库（path 相对 "CUHKSZ course/ENG1002" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/ENG1002/',
  resources: {
    note: '以下文件均为 CUHKSZ ENG1002 的真实课程资料，按「大纲与作业说明—课堂讲义—范文与样例—阅读与演示」四组排列。建议先读课程日程与评分标准确认要求，再按讲次跟讲义，最后用 A 级范文对照自己的稿子。',
    groups: [
      {
        name: '大纲与作业说明',
        note: '先看课程日程与评分标准：三篇大作业的截止周、字数、来源数量与评分维度都在这些文件里。',
        items: [
          { title: 'ENG1002 课程日程（2024 春季，15 周）', path: '学习资料/ENG1002_EAP1_Course_Schedule.docx', kind: 'docx', note: '每周主题、Module 划分与三次评估的时间点，开学第一份该读的文件。' },
          { title: 'EAP1 课程大纲', path: '作业习题/ENG1002_EAP1_Course_Syllabus.doc', kind: 'doc', note: '课程目标、考核比例与课堂政策，写作业前先确认总评构成。' },
          { title: '写作评分标准（Essay Rubric）', path: '作业习题/ENG1002_Writing_Assignments_2024_EAP1_Essay_Rubric.docx', kind: 'docx', note: '内容、组织、语言、引用四个维度的分档描述，改稿时逐条对照。' },
          { title: '论证论文作业说明（2024）', path: '作业习题/ENG1002_Lecture_17_2024_EAP1_Argument_Essay_Assignment_Instruction.docx', kind: 'docx', note: '900–1200 词、至少 4 个来源、第三人称、APA，占期末大作业。' },
          { title: '因果分析论文作业说明', path: '作业习题/ENG1002_Assignment_Instructions_Cause_and_Effect_Essay_Assignment_Instructions.docx', kind: 'docx', note: '至少 3 个来源、3 处引用 + 3 处转述、3 页以上，Week 7 提交。' }
        ]
      },
      {
        name: '课堂讲义',
        note: 'Lecture 07/12/21 是本课程语体训练的三根柱子：正式客观、简洁、谨慎；Lecture 09/10 讲来源与 APA。',
        items: [
          { title: 'Lecture 07：正式与客观（Formal &amp; Impersonal）', path: '学习资料/ENG1002_Lecture_07_EAP_Characteristics_Formal_&_Impersonal_PPT.pptx', kind: 'pptx', note: '学术语体与非学术语体的六维对照，Don\'ts 与 Dos 清单对应本站 ch02。' },
          { title: 'Lecture 12：写得简洁（Be Concise）', path: '学习资料/ENG1002_Lecture_12_Module_II_EAP_Characteristics_I_Be_Concise_PPT.pptx', kind: 'pptx', note: '五类冗词与 Strunk &amp; White 的「Vigorous writing is concise」，对应 ch02 后半。' },
          { title: 'Lecture 21：谨慎表达（Hedging）', path: '学习资料/ENG1002_Lecture_21_Honest_and_cautious_Hedging_PPT.pptx', kind: 'pptx', note: 'may、could、tends to、it is likely 的用法与过度模糊的反例，对应 ch03/ch06。' },
          { title: 'Lecture 10：APA 第 7 版指南', path: '学习资料/ENG1002_Lecture_10_APA_Style_Guide_7th_edition.pdf', kind: 'pdf', note: '文内引用、参考文献条目与格式细节的官方说明，ch05 的主要依据。' },
          { title: 'Lecture 09：来源层级（Hierarchy of Sources）', path: '学习资料/ENG1002_Lecture_09_Hierarchy_of_Sources.pdf', kind: 'pdf', note: '一手/二手与学术/大众的层级图，ch04 评估来源时的对照表。' },
          { title: 'Lecture 19&amp;20：避免逻辑谬误', path: '学习资料/ENG1002_Lecture_19&20_Lecture_19&20_Avoiding_Logical_Fallacies_PPT.pptx', kind: 'pptx', note: '十类常见谬误的定义与例子，ch06 与 ch07 的谬误清单来源。' }
        ]
      },
      {
        name: '范文与样例',
        note: '读范文不要只看「写得好」，要标出它的论文陈述、每段主题句与引用位置，再模仿结构而不是句子。',
        items: [
          { title: 'A 级因果分析范文（Sample 1）', path: '作业习题/ENG1002_A_grade_cause_and_effect_essays_Sample_1.pdf', kind: 'pdf', note: '完整 APA 格式的因果论文，可对照 ch03 的机制链与限定写法。' },
          { title: '因果分析范文合集（高/中/低三档）', path: '作业习题/ENG1002_Sample_Cause_and_Effect_Essays_High.pdf', kind: 'pdf', note: '同题不同档，最能看出评分标准落在哪些具体句子上。' },
          { title: 'APA 7 学生样张', path: '作业习题/ENG1002_Lecture_10_APA_7_Student_Sample_Paper.pdf', kind: 'pdf', note: '标题页、页眉、文内引用与参考文献的完整排版示例。' },
          { title: 'A 级论证论文范文（2020, Sample 1）', path: '作业习题/ENG1002_Sample_Argument_Essays_2020_A_Grade_Argument_Essay_Sample_1.docx', kind: 'docx', note: '注意它的让步段位置与反驳方式，对应 ch06 的 Toulmin 结构。' },
          { title: '论证论文范文（Great Writing 5）', path: '作业习题/ENG1002_Lecture_17_Argument_essay_sample_from_Great_Writing_5.pdf', kind: 'pdf', note: '教材范文，结构清晰，适合拆段落做 PEEL 标注练习。' }
        ]
      },
      {
        name: '阅读与演示',
        note: '课程阅读既是语言输入，也是因果/论证写作的素材库；演示说明与 TED 排练指南对应 ch07。',
        items: [
          { title: 'Reading 2：睡眠习惯与大学成绩', path: '学习资料/ENG1002_Course_Readings_READING_2_Better_sleep_habits_lead_to_better_college_grades.docx', kind: 'docx', note: '典型的因果类科普阅读，可用来练「相关还是因果」的判断。' },
          { title: 'Reading 3：社交媒体使用与学业表现', path: '学习资料/ENG1002_Course_Readings_READING_3_Effects_of_social_media_usage_and_social_media_multitasking_on_the_academic_performance_of_university_students.pdf', kind: 'pdf', note: '一手研究，含样本、方法与局限，适合做 ch04 的五栏笔记。' },
          { title: 'Strunk &amp; White《The Elements of Style》', path: '学习资料/ENG1002_Lecture_13_William_Strunk_E_B_White_The_Elements_of_Style_Longman_1999.pdf', kind: 'pdf', note: '简洁写作的经典小册子，Lecture 12/13 的直接来源。' },
          { title: 'Orwell《Politics and the English Language》', path: '学习资料/ENG1002_Supplemental_Course_Readings_Politics_and_the_English_Language_George_Orwell.pdf', kind: 'pdf', note: '讨论语言如何被空话腐蚀，写语体分析时的常引文章。' },
          { title: '个人演示说明（2024）', path: '学习资料/ENG1002_Individual_Presentation_Files_2024_EAP1_Individual_Presentation_Instructions.docx', kind: 'docx', note: '5–6 分钟、1 分钟 Q&amp;A、内容与视觉各 25%，ch07 的评分依据。' }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '学术英语 I（English for Academic Purposes I，ENG1002），2024 春季 15 周'],
    ['来源', 'CUHKSZ ENG1002 课程资料：日程、讲义、作业说明、范文与阅读材料'],
    ['结构', '8 章正文 · 56 题分章题库 · 模拟卷 A · 3 个实战项目 · 资料库'],
    ['建议', '先读第 0 章建立地图，再按 ch01→ch07 推进；每章的自检清单与内嵌题不要跳过。']
  ],

  /* 速查表：4 页 */
  cheat: [
    {
      label: '学术语体',
      blocks: [
        { t: 'p', html: '学术语体的四条主线是<b>正式、客观、精确、简洁</b>。判断一句话是否合格，先问：它像不像在会议上对一群陌生读者说话？有没有把「我觉得」换成「证据显示」？数字是否可核查？有没有可以删掉的词？' },
        { t: 'table', caption: '常见口语表达与学术替换', head: ['口语 / 非正式', '学术替换', '原因'], rows: [
          ['a lot of, lots of', 'a substantial number of / 37% of', '模糊量不可核查'],
          ['find out', 'determine, establish, identify', '短语动词偏口语'],
          ['due to the fact that', 'because', '五个词换一个词'],
          ['I think / I feel', 'The evidence suggests / It appears that', '去掉第一人称与情绪'],
          ['don\'t, can\'t, it\'s', 'do not, cannot, it is', '缩写是非正式标记'],
          ['big, good, bad', 'substantial, effective, detrimental', '评价性形容词过于笼统'],
          ['and so on, etc.', '列出具体项，或删去', '学术写作避免开放列举']
        ] },
        { t: 'p', html: '名词化（nominalisation）是把动词或形容词变成名词，让动作成为主语：<code>They decided → The decision was made</code>；<code>Prices rose sharply → The sharp rise in prices</code>。名词化让句子更紧凑，但连用三个以上会让读者喘不过气——一段里出现两三次就够了。' }
      ]
    },
    {
      label: '引用与参考文献',
      blocks: [
        { t: 'p', html: 'APA 是<b>作者—年份</b>制：文内给（作者, 年份），文末按姓氏字母序给完整条目。两条铁律：直接引用必须给页码；文内与文末必须一一对应。' },
        { t: 'table', caption: '文内引用速查（APA 7）', head: ['情形', '括号式', '叙述式'], rows: [
          ['1 位作者', '(Walker, 2007)', 'Walker (2007) argues…'],
          ['2 位作者', '(Walker &amp; Allen, 2004)', 'Walker and Allen (2004) argue…'],
          ['3 位及以上', '(Wasserstein et al., 2005)', 'Wasserstein et al. (2005) argue…'],
          ['直接引用', '(Hedetoft, 2013, p. 2)', 'Hedetoft (2013) states that "…" (p. 2).'],
          ['同姓作者', '(J. Smith, 2020; R. Smith, 2019)', '用名字首字母区分'],
          ['同年多篇', '(Chen, 2020a, 2020b)', '按标题字母序标 a、b'],
          ['无日期', '(Author, n.d.)', 'n.d. = no date'],
          ['机构作者', '(World Health Organization [WHO], 2021)', '首次给全称与缩写，之后用 WHO']
        ] },
        { t: 'table', caption: '四类参考文献条目骨架', head: ['类型', '骨架', '示例'], rows: [
          ['书籍', '作者. (年份). 书名（斜体，版次）. 出版社.', 'Strunk, W., Jr., &amp; White, E. B. (1999). The elements of style (4th ed.). Longman.'],
          ['期刊论文', '作者. (年份). 标题. 刊名（斜体）, 卷（期）, 页码. DOI', 'Walker, R. (2007). Extensive reading. J EAP, 6(3), 210–225.'],
          ['网页', '作者或机构. (年份). 标题（斜体）. 站点. URL', 'WHO. (2021). Physical activity. https://…'],
          ['书中章节', '作者. (年份). 章节名. In 编者（Ed.）, 书名（pp. xx–xx）. 出版社.', '用 In 引出编者，页码放括号内']
        ] }
      ]
    },
    {
      label: '论证与段落',
      blocks: [
        { t: 'p', html: '论证的最小单位不是「观点」，而是<b>主张 + 证据 + 解释</b>。图尔敏模型把它扩成六格：claim（主张）、data（数据）、warrant（依据）、backing（支撑）、qualifier（限定）、rebuttal（反驳）。' },
        { t: 'table', caption: '图尔敏六要素与自检问题', head: ['要素', '回答的问题', '写作中的位置'], rows: [
          ['Claim', '我主张什么？', '论文陈述、段落主题句'],
          ['Data', '凭什么？', '引用、数据、案例'],
          ['Warrant', '数据为什么能推出主张？', '解释句，最常被省略'],
          ['Backing', '这条依据本身可靠吗？', '补充研究或理论'],
          ['Qualifier', '在什么范围内成立？', 'likely、in most cases、among…'],
          ['Rebuttal', '反方会怎么反驳？', '让步段 + 反驳']
        ] },
        { t: 'table', caption: 'PEEL 段落四步', head: ['步骤', '写什么', '常见错误'], rows: [
          ['Point', '一句可争论的分论点', '写成事实陈述，无可辩'],
          ['Evidence', '引用或数据，标明来源', '只给观点，不给证据'],
          ['Explanation', '证据如何支持分论点', '让证据「自己说话」'],
          ['Link', '回扣论文陈述或过渡到下一段', '段落之间靠 Firstly / Secondly 硬接']
        ] },
        { t: 'p', html: '引言四步：<b>钩子 → 背景 → 问题或缺口 → 论文陈述</b>；结论三步：<b>重申（换措辞）→ 限定与局限 → 影响或建议</b>。结论不要引入新论点，新论点说明它本该在主体里。' }
      ]
    },
    {
      label: '谬误与口语',
      blocks: [
        { t: 'p', html: '识别谬误的目的不是「抓别人的错」，而是检查自己的论证有没有偷懒。看到「必然」「所有人」「不是……就是……」这类词，先停下来问证据在哪里。' },
        { t: 'table', caption: '十类高频逻辑谬误', head: ['谬误', '特征', '破解问法'], rows: [
          ['滑坡（slippery slope）', '第一步必然导致极端后果', '每一步的证据呢？'],
          ['虚假两难（false dilemma）', '只给两个选项', '是否存在第三种可能？'],
          ['稻草人（straw man）', '歪曲对方观点再攻击', '对方的原话是什么？'],
          ['人身攻击（ad hominem）', '攻击提出者而非论证', '论证本身成立吗？'],
          ['诉诸权威（appeal to authority）', '仅凭身份定真假', '该权威在本领域吗？'],
          ['循环论证（circular）', '结论当前提', '去掉结论后还剩下什么？'],
          ['以偏概全（hasty generalisation）', '小样本推全体', '样本多大、代表谁？'],
          ['post hoc', '先后即因果', '有没有混杂变量？'],
          ['诉诸情感（appeal to emotion）', '用恐惧或同情替代证据', '数据在哪？'],
          ['一厢情愿（wishful thinking）', '因为希望所以为真', '反证是什么？']
        ] },
        { t: 'table', caption: '5–6 分钟演示的时间与评分', head: ['环节', '时长', '要点'], rows: [
          ['开场', '约 45 秒', '一个问题、一个数字或一个反差'],
          ['路线图', '约 15 秒', '告诉大家你要讲三点'],
          ['主体', '三点各约 60 秒', '一页一个主张，标题写结论'],
          ['收尾', '约 45 秒', '重申主张，引出 Q&amp;A'],
          ['Q&amp;A', '1 分钟', '听清 → 复述 → 回答 → 确认']
        ] },
        { t: 'p', html: '评分四维：<b>内容（25%）、视觉（25%）、交付（声音/停顿/眼神）、Q&amp;A</b>。排练四步：读稿计时 → 只留关键词 → 站着对空气讲 → 录像回看。把 um、so、you know 换成两秒停顿，是性价比最高的改进。' }
      ]
    }
  ]
};
