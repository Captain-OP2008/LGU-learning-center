/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'gfn1000',
  short: 'GFN1000',
  name: '与自然对话',
  en: 'Dialogues with Nature',
  dept: '通识与国情',
  lang: 'text',
  langLabel: '科学',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'GFN1000 // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... GFN1000',
    '> loading 8 modules ... plato / newton / darwin / watson',
    '> calibrating glossary & quiz bank ... 56 items ready',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '把十一个古老的问题，读成一张可以走通的地图。',
  missionEn: 'GFN1000 · 8 MODULES',
  missionTitle: '从洞穴到双螺旋<br><em>与自然对话</em>',
  lede: '从柏拉图的洞穴到沃森的双螺旋，再到李约瑟与席文的争论：八章、十一个 issue，每章配概念图、对比表、题库与自检清单，把「读经典」变成可训练的能力。',
  searchPlaceholder: 'QUERY // 搜索章节、术语与题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/GFN1000/',
  resources: {
    note: '以下文件均为 CUHKSZ GFN1000（与自然对话）的真实课程资料，按「大纲与教材—阅读指南—讲义与课件—写作与评分」四组排列。建议先读大纲确认范围与考核，再按 issue 顺序配合阅读指南推进，写作前先看评分细则。',
    groups: [
      {
        name: '大纲与教材',
        note: '先看大纲：三部分 11 个 issue、考核比例、班规都在里面；教材是全部指定阅读的合集，中译版可对照阅读。',
        items: [
          { title: 'GFN1000 课程大纲（含考核比例与 issue 列表）', path: '学习资料/GFN1000_course_outline_Zuo.pdf', kind: 'pdf', note: '开学第一份该读的文件：四个考核项、11 个 issue、5 条学习成果。' },
          { title: '课程日程表（2024 Fall）', path: '学习资料/GFN1000_Course_schedule_GFN_2024Fall.pdf', kind: 'pdf', note: '每讲对应的文本与 tutorial 安排，用来排复习进度。' },
          { title: '教材《In Dialogue with Nature》', path: '学习资料/GFN1000_In_Dialogue_with_Nature.pdf', kind: 'pdf', note: '全部指定阅读的英文合集，按 issue 编号即可定位。' },
          { title: '《与自然对话》中译版（2023）', path: '学习资料/GFN1000_《与自然对话》中译版2023.pdf', kind: 'pdf', note: '读英文吃力时的对照本；引用时仍以指定版本为准。' }
        ]
      },
      {
        name: '阅读指南',
        note: '每个 issue 配一份 reading guide，列出该读哪些段落、要抓哪几个论点；做完再看答案解析。',
        items: [
          { title: 'Reading Guide 01：柏拉图《理想国》与林德伯格', path: '学习资料/GFN1000_01ReadingGuide_Plato_Lindberg.pdf', kind: 'pdf', note: '洞穴寓言的四个阶段与理念论的要点，对应本站 ch01。' },
          { title: 'Reading Guide 02：林德伯格论亚里士多德与中世纪', path: '学习资料/GFN1000_02ReadingGuide_Lindberg.pdf', kind: 'pdf', note: '说明「古人如何处理已知事实」，是 ch02 前半的背景。' },
          { title: 'Reading Guide 03：科恩与牛顿', path: '学习资料/GFN1000_03ReadingGuide_Cohen_Newton.pdf', kind: 'pdf', note: '《原理》定义与三定律的读法，对应 ch02。' },
          { title: 'Reading Guide 04：达尔文《物种起源》', path: '学习资料/GFN1000_04ReadingGuide_Darwin.pdf', kind: 'pdf', note: '第四章的论证结构与三条反对意见，对应 ch03。' },
          { title: 'Reading Guide 05：沃森《DNA：生命的秘密》', path: '学习资料/GFN1000_05ReadingGuide_Watson.pdf', kind: 'pdf', note: '双螺旋的证据链与人物关系，对应 ch04 前半。' },
          { title: 'Reading Guide 06：卡尔森《寂静的春天》', path: '学习资料/GFN1000_06ReadingGuide_Carson.pdf', kind: 'pdf', note: '第六章的生态论证，对应 ch04 后半的伦理讨论。' },
          { title: 'Reading Guide 07：庞加莱《科学与方法》', path: '学习资料/GFN1000_07ReadingGuide_Poincare.pdf', kind: 'pdf', note: '两篇选文的段落范围与提问方式，对应 ch05。' },
          { title: 'Reading Guide 08：坎德尔《追寻记忆的痕迹》', path: '学习资料/GFN1000_08ReadingGuide_Kandel.pdf', kind: 'pdf', note: '第四章与第二十八章的读法，对应 ch06。' },
          { title: 'Reading Guide 09–11：李约瑟、席文与沈括、邓纳姆与欧几里得', path: '学习资料/GFN1000_09ReadingGuide_Needham.pdf', kind: 'pdf', note: '对应 ch07；同组的 10、11 分别处理中西比较与演绎结构。' },
          { title: '阅读指南习题答案汇总', path: '学习资料/GFN1000_Answers_to_questions_on_reading_guide.pdf', kind: 'pdf', note: '先自己写，再对照；答案的论证方式比结论更值得学。' }
        ]
      },
      {
        name: '讲义与课件',
        note: 'Lecture 讲义按讲次编号，与本站章节一一对应；pptx 是课堂投影版，信息更压缩，适合快速回顾。',
        items: [
          { title: 'Lecture 01：柏拉图与洞穴', path: '学习资料/GFN1000_1_Lecture_Plato.pdf', kind: 'pdf', note: '对应 ch01，含洞穴寓言的分段解读。' },
          { title: 'Lecture 03：牛顿与科恩', path: '学习资料/GFN1000_3_Lecture_Newton.pdf', kind: 'pdf', note: '对应 ch02，重点是定义 1–5 与三定律的读法。' },
          { title: 'Lecture 05：沃森与双螺旋', path: '学习资料/GFN1000_5_Lecture_Watson.pdf', kind: 'pdf', note: '对应 ch04，含 51 号照片与模型演化的图示。' },
          { title: 'Lecture 07：庞加莱与科学方法', path: '学习资料/GFN1000_7_Lecture_Poincare.pdf', kind: 'pdf', note: '对应 ch05，事实选择与数学发现四阶段。' },
          { title: 'Lecture 08：坎德尔与记忆', path: '学习资料/GFN1000_8_Lecture_Kandel.pdf', kind: 'pdf', note: '对应 ch06，缩鳃反射与意识问题的框架。' },
          { title: 'Lecture 09：李约瑟与中国的科学', path: '学习资料/GFN1000_9_Lecture_Needham.pdf', kind: 'pdf', note: '对应 ch07，五行、阴阳与有机宇宙观。' },
          { title: 'Lecture 10：席文与沈括', path: '学习资料/GFN1000_10_Lecture_Sivin&Shen.pdf', kind: 'pdf', note: '对应 ch07 后半，比较的方法论与《梦溪笔谈》选读。' },
          { title: 'Lecture 11：邓纳姆与欧几里得', path: '学习资料/GFN1000_11_Lecture_Dunham&Euclid.pdf', kind: 'pdf', note: '对应 ch07 最后一节，演绎结构与现代科学的独特性。' },
          { title: '课堂投影 01：柏拉图', path: '作业习题/GFN1000_Lecture_01_Plato.pptx', kind: 'pptx', note: '课堂用的精简版，可在复习时快速过一遍结构。' },
          { title: 'Tutorial 01：柏拉图讨论课（修订版）', path: '作业习题/GFN1000_Tutorial_01_Plato_revised.pptx', kind: 'pptx', note: '讨论课的问题清单，可直接用来准备 pre-class presentation。' }
        ]
      },
      {
        name: '写作与评分',
        note: '反思日志与学期论文都有模板和评分细则；动笔前先读 rubric，知道分数给在哪里。',
        items: [
          { title: '反思日志题目（Reflective Journal topics）', path: '学习资料/GFN1000_Reflective_Journal_topics.pdf', kind: 'pdf', note: '按 issue 给出的题目清单，选一个能落到具体段落的。' },
          { title: '反思日志模板（中文）', path: '学习资料/GFN1000_RJ_Template_Chinese.docx', kind: 'docx', note: '含结构与字数提示：中文 900–1200 字。' },
          { title: '反思日志模板（英文）', path: '学习资料/GFN1000_RJ_Template_English.docx', kind: 'docx', note: '英文 600–800 字，结构与中文版一致。' },
          { title: '反思日志工作坊材料', path: '学习资料/GFN1000_RJ_workshop.pdf', kind: 'pdf', note: '同学互评的评分维度，写之前先按这些维度自查。' },
          { title: '学期论文工作坊材料', path: '学习资料/GFN1000_TP_workshop.pdf', kind: 'pdf', note: '从选题到论证结构的流程，对应本站项目的第三步。' },
          { title: '论文评分细则（Grading Rubrics for Essay）', path: '作业习题/GFN1000_Grading_Rubrics_for_Essay.pdf', kind: 'pdf', note: '论点、证据、反方、语言四项的分档描述，最该先读的一页。' },
          { title: '讨论课参与评分细则', path: '作业习题/GFN1000_Grading_Rubrics_for_Tutorial_Participation.pdf', kind: 'pdf', note: '参与分不是「到场分」，看的是发言质量与回应他人的能力。' },
          { title: '学期论文选题（Term Paper Topics）', path: '作业习题/GFN1000_Term_Paper_Topics.pdf', kind: 'pdf', note: '官方题目清单，可与本站三个项目的选题互相参照。' },
          { title: '课程小词典（Mini dictionary）', path: '学习资料/GFN1000_Mini_dictionary.xlsx', kind: 'xlsx', note: '核心术语的中英对照，写论文时统一译名用。' },
          { title: 'VeriGuide 使用说明（2024 年 8 月更新）', path: '作业习题/GFN1000_Updated_Use_of_VeriGuideAWD_August2024.docx', kind: 'docx', note: '查重流程与引用规范，提交前务必过一遍。' }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '与自然对话（In Dialogue with Nature, GFN1000）'],
    ['来源', 'CUHKSZ 通识与国情课程资料（2024–25 学年）'],
    ['结构', '8 章正文 · 56 题题库 · 模拟卷 A · 3 个实战项目 · 资料库'],
    ['建议', '先读第 0 章建立地图，再按 issue 顺序推进；每章的自检清单与资料库里的评分细则配合使用。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    {
      label: '三条主线',
      blocks: [
        { t: 'p', html: '整门课可以压缩成一张表：三个部分各回答一类问题，十一篇文本分别给出一个答案。复习时先回忆这张表，再往里填细节。' },
        { t: 'table', caption: '三部分与 11 个 issue', head: ['部分', 'issue', '核心文本', '本站'], rows: [
          ['I 物理宇宙', '1 什么是真实的', '柏拉图《理想国》第七卷；林德伯格第二章', 'ch01'],
          ['I 物理宇宙', '2 古人如何处理已知事实', '林德伯格第三章、第十二章', 'ch02'],
          ['I 物理宇宙', '3 什么是近代科学', '科恩第七章；牛顿《原理》', 'ch02'],
          ['II 生命世界', '4 生命的定律', '达尔文《物种起源》第四章', 'ch03'],
          ['II 生命世界', '5 生命的密码', '沃森《DNA：生命的秘密》', 'ch04'],
          ['II 生命世界', '6 操纵生命的影响', '卡尔森《寂静的春天》第六章', 'ch04'],
          ['III 理解理解', '7 什么引导科学家的心智', '庞加莱《科学与方法》', 'ch05'],
          ['III 理解理解', '8 人的心智是什么', '坎德尔《追寻记忆的痕迹》', 'ch06'],
          ['III 理解理解', '9 中国古人对自然知道什么', '李约瑟《中国科学技术史》', 'ch07'],
          ['III 理解理解', '10 如何比较中西科学', '席文论文；沈括《梦溪笔谈》', 'ch07'],
          ['III 理解理解', '11 近代科学的独特性', '邓纳姆；欧几里得《几何原本》', 'ch07']
        ] }
      ]
    },
    {
      label: '关键术语',
      blocks: [
        { t: 'p', html: '写论文与答论述题时，术语的准确度直接决定分数。下表只给最省事的定义，展开见各章正文与课程小词典。' },
        { t: 'table', caption: '必须能一句话说清的术语', head: ['术语', '英文', '一句话'], rows: [
          ['形式', 'Form', '永恒、非形体、只能被理性把握的实在；个别事物分有它'],
          ['分有', 'participation', '个别事物因分享形式而获得名称与性质'],
          ['惯性', 'inertia', '物体保持匀速直线运动或静止的固有倾向'],
          ['自然选择', 'natural selection', '可遗传变异在繁殖过剩压力下造成的差异存活'],
          ['同源结构', 'homology', '源于共同祖先的结构，功能可以不同'],
          ['半保留复制', 'semi-conservative replication', '双链分开、各自作模板，子代含一旧一新'],
          ['约定主义', 'conventionalism', '公理是方便的选择而非先天真理'],
          ['关联思维', 'associative thinking', '以相似律与接触律把万物纳入五行网络'],
          ['有机宇宙观', 'organism', '秩序内在于事物本性，整体在和谐中运作'],
          ['公理系统', 'axiomatic system', '从定义、公设、公理出发逐条证明的结构']
        ] }
      ]
    },
    {
      label: '论证速查',
      blocks: [
        { t: 'p', html: '反思日志、论文与 tutorial 发言共用一套骨架。差别只在篇幅：发言 450 字、日志 900–1200 字、论文 1900–2300 字。' },
        { t: 'steps', items: [
          { title: '定位', html: '用一句话说清你要讨论的文本位置与问题，不要从「自古以来」开头。' },
          { title: '观察', html: '指出文本中一个具体细节（一句话、一个比喻、一个反例），说明它为何值得注意。' },
          { title: '论证', html: '给出你的解释，并用文本证据支撑；证据要能直接支持论点，而不是「提到过」。' },
          { title: '反方', html: '构造最强的反对意见，认真回应；回应不了就修改论点，而不是忽略它。' },
          { title: '收束', html: '指出你的论证留下了什么未解决的问题，或它对当代处境的含义。' }
        ] },
        { t: 'p', html: '三条自查：每段第一句是否能独立成句？引用是否都服务于论证？结论是否回应了引言提出的问题？三问都过，文章基本达标。' }
      ]
    },
    {
      label: '易混对比',
      blocks: [
        { t: 'table', caption: '四组最容易混的对照', head: ['对照', '一边', '另一边'], rows: [
          ['柏拉图 vs 亚里士多德', '形式独立存在于物质世界之外', '形式内在于个别事物之中'],
          ['伽利略 vs 牛顿', '分解并描述运动（水平匀速＋竖直匀加速）', '用力解释运动，天地统一于万有引力'],
          ['达尔文 vs 拉马克', '变异无方向，选择在后', '用进废退，获得性遗传，需求驱动'],
          ['有机论 vs 机械论', '秩序内在于本性，因果如乐团', '秩序由外部定律规定，因果如齿轮']
        ] },
        { t: 'p', html: '还有两组常被问到的区分：同源（共同祖先）与同功（趋同适应）；意识的统一性（绑定问题，较易）与主观性（困难问题，较难）。' }
      ]
    }
  ]
};
