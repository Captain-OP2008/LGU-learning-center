/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'gfh1000',
  short: 'GFH1000',
  name: '与人文对话',
  en: 'Dialogues with Humanities',
  dept: '通识与国情',
  lang: 'text',
  langLabel: '人文',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'GFH1000 // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... GFH1000',
    '> loading 8 modules ...',
    '> calibrating glossary & quiz bank ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '把经典读成一张可以走通的地图。',
  missionEn: 'GFH1000 · 8 MODULES · 11 CLASSICS',
  missionTitle: '从零开始<br><em>与人文对话</em>',
  lede: '从苏格拉底、孔子、圣经、佛陀，到斯密、马克思与密尔：每一章先给问题，再拆概念，配文本例子、对照表、常见误读与自检清单。八章之后，你带走的不只是知识点，而是一套读经典、写论证的方法。',
  searchPlaceholder: 'QUERY // 搜索章节、术语、人物与题目',

  /* 资料库（path 相对 resBase，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/GFH1000/',
  resources: {
    note: '以下 49 份文件均为 CUHKSZ GFH1000 的真实课程资料，按「大纲与导论—经典讲义—每周讨论与反思—写作与考核」四组排列。建议先读课程大纲确认范围，再按讲次读讲义，最后用讨论题与反思题检验自己是否真的读懂。',
    groups: [
      {
        name: '大纲与导论',
        note: '先看课程大纲：三大主题、每周阅读、考核比例与截止日期都在里面；中译版可以对照英文原文使用。',
        items: [
          { title: 'GFH1000 课程大纲（2025–26 Term 2）', path: '学习资料/GFH1000_Course_Outline_2025_26_2_Kuan_yen_Liu.pdf', kind: 'pdf', note: '8 条 learning outcomes、考核结构与每周阅读，开学第一份该读的文件。' },
          { title: '《与人文对话》中译版（2024，部分）', path: '学习资料/GFH1000_《与人文对话》中译版2024_部分.pdf', kind: 'pdf', note: '课程教材的中译选段，适合对照英文原文确认术语。' },
          { title: 'Essay Structure and Outline', path: '学习资料/GFH1000_Essay_Structure_and_Outline.pdf', kind: 'pdf', note: '论文结构与提纲示范，写 term paper 前先看。' },
          { title: '写作指南与评分标准', path: '学习资料/GFH1000_Writing_Guideline_1_Grading_Criteria_2_Guideline_for_Writing_Kuan_yen_Liu_External_Review.pdf', kind: 'pdf', note: '评分维度、引用规范与常见失分点。' }
        ]
      },
      {
        name: '经典讲义',
        note: '按课堂讲次排列：柏拉图、孔子、圣经、佛教、斯密、马克思、密尔。每份讲义都对应本站一章，可先读讲义再回看章节。',
        items: [
          { title: 'Lecture 02：Plato’s Symposium', path: '学习资料/GFH1000_Lecture_02_Platos_Symposium.pdf', kind: 'pdf', note: '对应 ch01：六篇讲辞、爱的阶梯与苏格拉底的追问。' },
          { title: 'Lecture 03：Confucius’s Analects', path: '学习资料/GFH1000_Lecture_03_Confuciuss_Analects_Kuan_yen_Liu.pdf', kind: 'pdf', note: '对应 ch02：仁、礼、君子、德治与正名。' },
          { title: 'Lecture PPT：The Bible', path: '学习资料/GFH1000_Lecture_PPt_The_Bible_Kuan_yen_Liu.pdf', kind: 'pdf', note: '对应 ch03：两约、创世、堕落、亚伯拉罕与恩典。' },
          { title: 'The Heart Sutra and Chinese Buddhism', path: '学习资料/GFH1000_Text_5_The_Heart_Sutra_and_Chinese_Buddhism.pdf', kind: 'pdf', note: '对应 ch04：五蕴、缘起、空、四圣谛与禅净。' },
          { title: 'Adam Smith: The Wealth of Nations（选段）', path: '学习资料/GFH1000_Adam_Smith_The_Wealth_of_Nation_(Excerpts).pdf', kind: 'pdf', note: '对应 ch05：别针工厂、交换倾向与看不见的手。' },
          { title: 'Kuan-yen Liu：Karl Marx', path: '学习资料/GFH1000_Kuan_yen_Liu_Karl_Marx.pdf', kind: 'pdf', note: '对应 ch06：异化四层、剩余价值、机器与意识形态。' },
          { title: 'John Stuart Mill on Liberty', path: '学习资料/GFH1000_John_Stuart_Mill_on_Liberty_Kuan_yen_Liu.pdf', kind: 'pdf', note: '对应 ch07：社会自由、言论自由、个性与伤害原则。' }
        ]
      },
      {
        name: '每周讨论与反思',
        note: '讨论课 handout 给你争点，反思题给你写作入口。先自己做一遍，再去看讲义里的框架。',
        items: [
          { title: 'Tutorial Handout：Confucius’s Analects', path: '作业习题/GFH1000_Tutorial_Handout_Confuciuss_The_Analects.pdf', kind: 'pdf', note: '对应 ch02：原文选段与讨论问题。' },
          { title: 'Tutorial Handout：The Bible', path: '作业习题/GFH1000_Tutorial_Handout_The_Bible_Kuan_yen_Liu.pdf', kind: 'pdf', note: '对应 ch03：创世、堕落与约伯的讨论题。' },
          { title: 'Tutorial Handout：The Heart Sutra', path: '作业习题/GFH1000_Tutorial_Handout_The_Heart_Sutra.pdf', kind: 'pdf', note: '对应 ch04：空、无我、四谛的细读问题。' },
          { title: 'Tutorial Handout：Adam Smith', path: '作业习题/GFH1000_Tutorial_Handout_Adam_Smiths_The_Wealth_of_Nations.pdf', kind: 'pdf', note: '对应 ch05：分工、自利与市场社会的争论。' },
          { title: '反思题：Plato’s Symposium', path: '学习资料/GFH1000_Reflective_Journal_Questions_for_Platos_Symposium.pdf', kind: 'pdf', note: '对应 ch01：爱欲、身体与美的问题。' },
          { title: '反思题：The Heart Sutra', path: '学习资料/GFH1000_Reflective_Journal_Questions_for_The_Heart_Sutra.pdf', kind: 'pdf', note: '对应 ch04：把空观与个人经验连起来。' }
        ]
      },
      {
        name: '写作与考核',
        note: '论文、展示与考试的具体要求都在这里；先看评分标准，再动笔，能省下大量返工。',
        items: [
          { title: 'Term Paper Prompt（Spring 2024）', path: '作业习题/GFH1000_Term_Paper_Prompt_Spring_2024.pdf', kind: 'pdf', note: '论文题目与要求；注意字数、引用与截止日期。' },
          { title: 'Co-teaching Presentation 评分表', path: '作业习题/GFH1000_The_Rubric_of_Students_Co_Teaching_Presentation_Kuan_yen_Liu.pdf', kind: 'pdf', note: '10 分钟展示加讨论的评分维度。' },
          { title: 'Reflective Journal：Adam Smith', path: '学习资料/GFH1000_Reflective_Journal_Question_concerning_Adam_Smith_Kuan_yen_Liu.pdf', kind: 'pdf', note: '把斯密与当代市场经验连起来的反思题。' },
          { title: 'Reflective Journal：Karl Marx', path: '学习资料/GFH1000_Reflective_Journal_Question_concerning_Karl_Marx_Kuan_yen_Liu.pdf', kind: 'pdf', note: '异化与当代劳动的反思题。' },
          { title: 'Tutorial Study Questions：Mill’s On Liberty', path: '作业习题/GFH1000_Tutorial_Study_Questions_concerning_Mills_On_Liberty.pdf', kind: 'pdf', note: '言论自由与伤害原则的讨论题，适合考前自测。' }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '与人文对话（Dialogues with Humanities，GFH1000），8 个模块'],
    ['来源', 'CUHKSZ GFH1000 课程资料：大纲、经典讲义、讨论 handout、反思题与写作指南'],
    ['结构', '8 章正文 · 56 题分章题库 · 模拟卷 A · 3 个实战项目 · 49 份资料'],
    ['建议', '先读第 0 章建立地图，再按 ch01→ch07 推进；每章的内嵌题与自检清单不要跳过。']
  ],

  /* 速查表：读经典、核心概念、论证写作、考试评分（4 页） */
  cheat: [
    {
      label: '读经典',
      blocks: [
        { t: 'p', html: '读经典不是「找中心思想」，而是<b>重建一个论证</b>：作者在回答什么问题？他用了哪些概念？前提是什么？结论是什么？哪里可以反驳？每读一段，都问这五个问题。' },
        { t: 'table', caption: '四步细读法', head: ['步骤', '要问的问题', '产出'], rows: [
          ['1. 定位', '这段在整篇的哪里？前后文在做什么？', '一段 50 字的语境摘要'],
          ['2. 拆句', '关键词是什么？有没有歧义？', '3–5 个术语卡'],
          ['3. 重建', '前提—推理—结论是什么？', '一段论证图或编号提纲'],
          ['4. 评价', '最强反对意见是什么？作者能回应吗？', '一个反例 + 一句回应']
        ] },
        { t: 'p', html: '常见错误：把译文当原文、把作者的话与人物的话混为一谈、用一句引文证明整个论点、只找「金句」而不看论证。遇到看不懂的地方，先标记，不要用现代概念硬套。' }
      ]
    },
    {
      label: '核心概念',
      blocks: [
        { t: 'p', html: '八章的概念可以分成三组：<b>自我与潜能</b>（柏拉图、孔子）、<b>信仰与限制</b>（圣经、佛教）、<b>自我与制度</b>（斯密、马克思、密尔）。比较时先问「他们在回答同一个问题吗」，再问「答案为什么不同」。' },
        { t: 'table', caption: '经典对照速查', head: ['传统', '核心问题', '关键概念', '容易误解'], rows: [
          ['柏拉图', '正义值得追求吗？', '灵魂三分、各司其职、爱的阶梯', '把正义当成「守规矩」'],
          ['孔子', '人如何在关系中成德？', '仁、礼、君子、正名', '把礼当成繁文缛节'],
          ['圣经', '人为何受苦？如何得救？', '创造、堕落、恩典、因信称义', '把苦难简单归为报应'],
          ['佛教', '苦从哪来、如何止息？', '四谛、五蕴、缘起、空', '把空当成虚无'],
          ['斯密', '自利如何形成秩序？', '分工、交换、看不见的手', '把斯密当成「贪婪无害」'],
          ['马克思', '劳动为何不属于人？', '异化、剩余价值、意识形态', '把异化当成心理感受'],
          ['密尔', '社会能对个人做什么？', '伤害原则、个性、言论自由', '把自由当成「想做什么就做什么」']
        ] },
        { t: 'p', html: '比较题的高分句式：「两人都关心 X，但 A 把 X 理解为……，B 把 X 理解为……；差别在于他们对 Y 的判断不同。这一差别导致……」不要只写「A 支持、B 反对」。' }
      ]
    },
    {
      label: '论证写作',
      blocks: [
        { t: 'p', html: '一篇合格的人文短文只需要四块：<b>问题—论点—文本证据—反对意见与回应</b>。引言不要写「自古以来」，直接给出你要解决的问题与你的判断；每一段只做一件事。' },
        { t: 'table', caption: '段落功能与句式', head: ['段落', '功能', '可用句式'], rows: [
          ['引言', '提出问题、给出论点', '「本文要论证的是……」'],
          ['文本', '引原文、解释语境', '「在……的语境中，这句话的意思是……」'],
          ['论证', '从文本推出理由', '「如果……那么……；作者此处预设了……」'],
          ['反对', '呈现最强反例', '「有人可能反驳说……；这一反驳的力量在于……」'],
          ['回应', '承认合理、限定论点', '「这一批评揭示了……，但它并不否定……」'],
          ['结论', '回答引言、留下问题', '「因此，至少在这一意义上……」']
        ] },
        { t: 'p', html: '引用三条底线：引文必须准确；出处必须可查；解释必须区分「作者说的」与「我认为」。不要用「众所周知」「古人云」代替具体文本，也不要把二手解释冒充原文。' }
      ]
    },
    {
      label: '考试评分',
      blocks: [
        { t: 'p', html: 'GFH1000 的总评由参与、展示、随堂写作、测验、反思日志与论文构成。纸笔考试通常考「概念辨析 + 文本细读 + 短论」，不是背名词。' },
        { t: 'table', caption: '考核结构与准备重点', head: ['项目', '权重', '准备方式'], rows: [
          ['Participation', '8%', '每周读原文，带一个问题进讨论课'],
          ['Co-teaching Presentation', '6%', '10 分钟展示 + 带讨论，先定一个争点'],
          ['In-Class Written Assignments', '16%', '限时细读，练「引文—解释—评价」'],
          ['Quizzes', '20%', '每章 7 题的自测，错题回看概念'],
          ['Reflective Journals', '20%', '每周 700–1000 英文词或 900–1200 中文字'],
          ['Term Paper', '30%', '1400–1800 英文词或 1600–2200 中文字']
        ] },
        { t: 'table', caption: '考场时间分配（以 120 分钟为例）', head: ['题型', '建议时间', '策略'], rows: [
          ['选择/判断/填空', '35–40 分钟', '先做有把握的，不确定的标记后回'],
          ['概念辨析', '20 分钟', '定义 + 一个例子 + 一个反例'],
          ['文本细读', '25 分钟', '引原文、说语境、重建论证'],
          ['短论', '35–40 分钟', '先列三点提纲，再写，留 5 分钟检查']
        ] },
        { t: 'p', html: '最后提醒：答题时把「我认为」与「文本说」分开；不确定的引文宁可意译并说明出处，也不要伪造原文。老师给分的是论证质量，不是立场是否正确。' }
      ]
    }
  ]
};
