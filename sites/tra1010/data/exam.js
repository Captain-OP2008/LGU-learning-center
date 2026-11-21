/* =====================================================================
 * exam.js · 模拟卷 A（CSC.registerExam）
 * 覆盖 ch00–ch07，11 题，满分 100，建议 110 分钟。
 * ===================================================================== */
CSC.registerExam({
  id: 'TRA1010-A',
  title: '模拟卷 A',
  style: 'FINAL',
  subtitle: '覆盖第 0–7 章：课程地图、翻译定义、学科地图、七种技法、翻译转换、等值、目的论、规范与文化转向',
  date: '',
  minutes: 110,
  totalScore: 100,
  summary: '共 11 题 100 分：单选 12 分、判断 8 分、填空 8 分、术语解释 8 分、译文评析 20 分、转换标注 10 分、四层分析 8 分、目的分析 8 分、规范分析 8 分、综合论述 10 分。建议用时 110 分钟，先做客观题，再留 50 分钟给评析与论述。',
  instructions: [
    '闭卷。客观题直接作答；评析与论述题按要点给分，不必逐字复述课件。',
    '评析题要求先定场景与读者，再逐层判断，最后写取舍；只写「译得好/不好」不得分。',
    '引用理论时写清概念名与提出者；记不清年份可以不写，不得编造页码。',
    '所有例子必须落到具体词句，空谈理论最多得一半分。'
  ],
  questions: [
    {
      no: 1, points: 12, type: '单项选择',
      intro: '下列四题各有一个最合适的答案，每题 3 分。',
      parts: [
        {
          label: '1-1', points: 3, kind: 'choice',
          prompt: 'He has left 译成「他已经走了」，按 Catford 的分类属于哪一类转换？',
          options: [
            { text: '层次转换', correct: true },
            { text: '结构转换' },
            { text: '类别转换' },
            { text: '内部系统转换' }
          ],
          explain: '英文用完成体这一语法形式，中文用「已经」「了」等词汇手段，属于语法层与词汇层之间的层次转换。'
        },
        {
          label: '1-2', points: 3, kind: 'choice',
          prompt: 'I do not think so 译成法语 Je pense que non（我认为不是），属于七种技法中的哪一种？',
          options: [
            { text: '词性转换' },
            { text: '调制', correct: true },
            { text: '等值' },
            { text: '改编' }
          ],
          explain: '调制是视角或否定焦点的改变：英语否定主句，法语否定从句。等值是固定套语替换，改编是情境整体替换。'
        },
        {
          label: '1-3', points: 3, kind: 'choice',
          prompt: '研究译者在翻译过程中如何做决策，属于 Holmes 地图的哪一类？',
          options: [
            { text: '产品取向描写研究' },
            { text: '过程取向描写研究', correct: true },
            { text: '功能取向描写研究' },
            { text: '翻译政策研究' }
          ],
          explain: '过程取向研究译者的认知与决策，常用有声思维、眼动与键盘记录；产品取向看成品，功能取向看译文在目标文化的作用。'
        },
        {
          label: '1-4', points: 3, kind: 'choice',
          prompt: '合同里的 shall 译成「应」而不是「须」，按 Koller 的分类主要涉及哪一层等值？',
          options: [
            { text: '指称等值' },
            { text: '内涵等值' },
            { text: '文本规范等值', correct: true },
            { text: '形式等值' }
          ],
          explain: '「应」与「须」的命题内容相同，差别在合同体裁对义务强度的规范，因此是文本规范等值的问题。'
        }
      ]
    },
    {
      no: 2, points: 8, type: '判断',
      intro: '判断下列说法，每题 2 分。',
      parts: [
        {
          label: '2-1', points: 2, kind: 'tf',
          prompt: '等值意味着译文与原文在每个层面都完全相等。',
          options: [
            { text: '正确' },
            { text: '错误', correct: true }
          ],
          explain: '等值是分层的关系而非同一性；译文只能在指定层面上与原文可核对地对应，要求每层相等等于要求译文就是原文。'
        },
        {
          label: '2-2', points: 2, kind: 'tf',
          prompt: '直译与意译是二元对立，一篇译文只能属于其中一种。',
          options: [
            { text: '正确' },
            { text: '错误', correct: true }
          ],
          explain: '两者是连续谱，同一篇译文的不同句子可以落在不同位置，判断要看词序、词性、喻体等具体指标。'
        },
        {
          label: '2-3', points: 2, kind: 'tf',
          prompt: '按 Skopos 理论，目的规则的优先级高于连贯规则与忠实规则。',
          options: [
            { text: '正确', correct: true },
            { text: '错误' }
          ],
          explain: '层级是目的 > 连贯 > 忠实；目的决定译文要完成什么，连贯保证读得通，忠实规定与原文的对应程度。'
        },
        {
          label: '2-4', points: 2, kind: 'tf',
          prompt: '描写翻译研究主张先描述译者实际怎么做，再谈评价。',
          options: [
            { text: '正确', correct: true },
            { text: '错误' }
          ],
          explain: '描写研究把评价悬置，先收集语料、重建规范、解释现象；评价仍可做，但要说明依据哪套规范与哪类读者。'
        }
      ]
    },
    {
      no: 3, points: 8, type: '填空',
      intro: '填写术语或类别，每题 2 分。',
      parts: [
        {
          label: '3-1', points: 2, kind: 'fill',
          prompt: '把小说《红楼梦》改编成电视剧，按 Jakobson 的分类属于____翻译。',
          answer: '符际', accept: ['符际翻译', 'intersemiotic'],
          explain: '文字转换为影像与声音，是不同符号系统之间的转换，属符际翻译。'
        },
        {
          label: '3-2', points: 2, kind: 'fill',
          prompt: 'Catford 把译文对形式对应的偏离称为翻译____。',
          answer: '转换', accept: ['shift', '翻译转换'],
          explain: '转换分层次转换与范畴转换，范畴转换再分结构、类别、单位、内部系统四种。'
        },
        {
          label: '3-3', points: 2, kind: 'fill',
          prompt: 'Venuti 把消除异域感、让译文读起来像目标语原创的策略称为____。',
          answer: '归化', accept: ['domestication', '归化翻译'],
          explain: '归化与异化相对：前者消除翻译痕迹，后者保留异域感，让读者意识到自己在读译本。'
        },
        {
          label: '3-4', points: 2, kind: 'fill',
          prompt: 'Bourdieu 用来指译者在长期实践中形成的选择倾向的概念是____。',
          answer: '惯习', accept: ['habitus'],
          explain: '惯习与场域、资本一起解释译者的选择倾向；它往往不假思索，却能反映其职业轨迹。'
        }
      ]
    },
    {
      no: 4, points: 8, type: '术语解释',
      intro: '任选四个术语，各用一两句话解释，每个 2 分。',
      parts: [
        {
          label: '4-1', points: 8, kind: 'keywords',
          prompt: '解释下列术语中的任意四个：动态对等、翻译转换、翻译委托、规范、归化、显性翻译。',
          keywords: ['动态对等', '读者反应', '形式对应', '转换', '委托', '目的', '规范', '目标语', '归化', '异域', '显性', '译本'],
          explain: '每个术语 2 分：动态对等须提到读者反应与自然；翻译转换须提到偏离形式对应；翻译委托须提到读者与目的；规范须提到目标语社群的共享期待；归化须提到消除异域感；显性翻译须提到保留原文文化语境。'
        }
      ]
    },
    {
      no: 5, points: 10, type: '译文评析',
      intro: '阅读原文与两个译文，写 150 字左右的评析。',
      code: 'Please mind the gap between the train and the platform.',
      codeTitle: '原文（伦敦地铁广播）',
      parts: [
        {
          label: '5-1', points: 10, kind: 'keywords',
          prompt: '甲译：「请小心站台与列车之间的空隙。」乙译：「请留意站台空隙。」请按指称、内涵、语用、形式四层比较两译，并说明广播场景下应选哪一版、代价是什么。',
          keywords: ['指称', '语用', '形式', '媒介', '时长', '取舍', '礼貌', '压缩'],
          explain: '指称层两译都正确；内涵层甲保留 Please 的礼貌，乙更简短；语用层乙在广播中更易听完；形式层乙压缩了信息。广播约三秒，应选乙或更短的版本，代价是「列车与站台之间」的精确位置被省略。答出三层以上并有取舍说明可得满分。'
        }
      ]
    },
    {
      no: 6, points: 10, type: '译文评析',
      intro: '阅读原文与两个译文，写 150 字左右的评析。',
      code: 'It never rains but it pours.',
      codeTitle: '原文（英语谚语）',
      parts: [
        {
          label: '6-1', points: 10, kind: 'keywords',
          prompt: '甲译：「不雨则已，一雨倾盆。」乙译：「祸不单行。」请比较两译的喻体、语体与适用语境，并说明哪一种更接近原文的谚语功能。',
          keywords: ['喻体', '直译', '成语', '语体', '语境', '谚语', '等值', '功能'],
          explain: '甲保留雨与倾盆的喻体，属直译，书面语体，适合文学或解释性语境；乙换成中文成语，属等值或归化，口语化，适合日常劝慰。两者都能承担谚语功能，选择取决于语境与读者；若上下文谈天气，甲更合适，若谈接连的倒霉事，乙更自然。'
        }
      ]
    },
    {
      no: 7, points: 10, type: '转换标注',
      intro: '写出下列译文相对原文所用的转换类型（用 Catford 的中文术语），每题 2 分。',
      parts: [
        {
          label: '7-1', points: 2, kind: 'fill',
          prompt: 'The proposal was rejected by the committee. → 委员会否决了这项提案。',
          answer: '结构转换', accept: ['结构', 'structure shift'],
          explain: '被动转主动，主语从受事变为施事，句法结构改变，属结构转换。'
        },
        {
          label: '7-2', points: 2, kind: 'fill',
          prompt: 'She is a good cook. → 她做饭做得好。',
          answer: '类别转换', accept: ['类别', 'class shift', '词性转换'],
          explain: '名词 cook 转为动词短语「做饭」，形容词 good 转为补语「好」，词类改变，属类别转换。'
        },
        {
          label: '7-3', points: 2, kind: 'fill',
          prompt: 'He left without saying goodbye. → 他不辞而别。',
          answer: '单位转换', accept: ['单位', 'unit shift'],
          explain: '英文的介词短语降为一个中文成语（词），对应单位变小，属单位转换。'
        },
        {
          label: '7-4', points: 2, kind: 'fill',
          prompt: 'He has left. → 他已经走了。',
          answer: '层次转换', accept: ['层次', 'level shift'],
          explain: '英文完成体这一语法形式，中文用「已经」「了」等词汇手段承担，属层次转换。'
        },
        {
          label: '7-5', points: 2, kind: 'fill',
          prompt: '英语 advice（不可数）译成法语 des conseils（复数）。',
          answer: '内部系统转换', accept: ['内部系统', 'intra-system shift', '系统内部转换'],
          explain: '两种语言都有数的子系统，译文在系统内部换用了复数成员，属内部系统转换。'
        }
      ]
    },
    {
      no: 8, points: 8, type: '四层分析',
      intro: '用指称、内涵、语用、形式四层分析下列译文选择。',
      parts: [
        {
          label: '8-1', points: 8, kind: 'keywords',
          prompt: '仓库门口的 Staff only 牌子，译成「员工专用」还是「闲人免进」？请按四层说明理由。',
          keywords: ['指称', '语用', '内涵', '形式', '场合', '语气', '警告', '礼貌'],
          explain: '指称层两者相同；内涵层「闲人免进」带轻蔑与警告，「员工专用」中性；语用层仓库要阻止无关人员进入，但不宜冒犯访客；形式层两者都短。应选「员工专用」，若需更强警示可加「非请勿入」。答出四层并有场景判断得满分。'
        }
      ]
    },
    {
      no: 9, points: 8, type: '目的分析',
      intro: '阅读委托，回答问题。',
      parts: [
        {
          label: '9-1', points: 8, kind: 'keywords',
          prompt: '委托：把一份药品说明书译成中文，读者是患者与家属，印在纸盒内页，要求安全用药、剂量无歧义。请指出这份 brief 的目的、两条不可牺牲的底线，以及 Nord 的忠诚原则在此如何约束译者。',
          keywords: ['读者', '安全', '剂量', '连贯', '忠诚', '作者', '委托方', '歧义'],
          explain: '目的是让患者安全用药；底线是剂量准确与禁忌完整；忠诚要求译者对患者、原厂与委托方负责，不能为可读性删掉警告。答出目的、底线与忠诚三方关系可得满分。'
        }
      ]
    },
    {
      no: 10, points: 8, type: '规范分析',
      intro: '阅读情境，回答问题。',
      parts: [
        {
          label: '10-1', points: 8, kind: 'keywords',
          prompt: '某出版社 2015 年重译一部 1980 年代已有译本的小说，把长句大量拆短、把注释改为文内解释。请用 Toury 的三类规范分析这一现象，并说明还需要什么材料才能确认你的判断。',
          keywords: ['预备规范', '初始规范', '操作规范', '副文本', '读者', '接受性', '重译', '证据'],
          explain: '重译本身涉及预备规范（选材与重译政策）；拆长句、改注释属操作规范；整体偏向目标语接受性属初始规范。确认判断还需译序、出版社选题档案、同期书评等副文本，否则只是从译文反推，容易循环论证。'
        }
      ]
    },
    {
      no: 11, points: 10, type: '综合论述',
      intro: '写 250 字左右的论述，要求举例。',
      parts: [
        {
          label: '11-1', points: 10, kind: 'keywords',
          prompt: '等值、目的、规范三种视角各自回答什么问题？它们如何互补？请用一个具体译例说明。',
          keywords: ['等值', '层面', '目的', '委托', '规范', '目标语', '互补', '语境', '译例', '取舍'],
          explain: '等值回答「译文与原文在哪些层面可比」，目的回答「译文要完成什么」，规范回答「目标语文化接受什么样的译法」。三者互补：等值给比较框架，目的给优先级，规范给历史与社群依据。举例须落到具体词句，并说明三种视角如何解释同一处理。'
        }
      ]
    }
  ]
});
