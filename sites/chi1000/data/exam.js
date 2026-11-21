/* =====================================================================
 * exam.js · 模拟卷 A（CSC.registerExam）
 * 覆盖全课程八个单元：课程地图、五四小说、乡土叙事、都市小说、
 * 描写文、饮食散文、议论与驳论、文学革命与应用写作
 * 12 题，满分 100，建议 120 分钟
 * ===================================================================== */
CSC.registerExam({
  id: 'CHI1000-A',
  title: '模拟卷 A',
  style: 'FINAL',
  subtitle: '覆盖第 1–8 章：从五四小说到文学革命与学术写作，兼顾细读、比较与论证',
  date: '',
  minutes: 120,
  totalScore: 100,
  summary: '选择题 11 题（每题 4 分，共 44 分）、判断题 3 题（每题 4 分，共 12 分）、填空题 2 题（共 7 分）、简答与写作 5 题（共 37 分）；合计 12 道大题、满分 100 分。建议 50 分钟完成客观题，70 分钟用于简答与写作。',
  instructions: [
    '考试为闭卷；不得携带任何纸质或电子资料，不得使用具有通信功能的设备。',
    '选择题与判断题只需写出选项；填空题须写完整词语，写错字不得分。',
    '简答题须分点作答，每点先给判断、再给文本依据；只写结论不举例，最多得一半分。',
    '写作题要求 300 字以上，须有明确论点、至少两处文本证据，并避免整段复述情节。',
    '所有引文须加引号；如记不清原文，可用「大意是」转述，但不得伪造引文。'
  ],
  questions: [
    {
      no: 1,
      points: 8,
      type: '概念辨析',
      intro: '课程地图与读法是全部题目的基础，先确认你分得清「写了什么」「怎么写」「为什么这样写」。',
      parts: [
        {
          label: '1(1)',
          points: 4,
          kind: 'choice',
          prompt: '下列哪一项属于「怎么写」层面的问题？',
          options: [
            { text: '《祝福》为什么采用「我」回乡的回忆框架来叙述', correct: true },
            { text: '《祝福》的故事发生在哪个省', correct: false },
            { text: '祥林嫂一共改嫁了几次', correct: false },
            { text: '鲁四老爷家过年祭祖在什么时候', correct: false }
          ],
          explain: '「怎么写」问的是叙述者、结构、视角、语言等安排；其余三项都是情节与背景的事实性问题。'
        },
        {
          label: '1(2)',
          points: 4,
          kind: 'choice',
          prompt: '读《绣枕》时，最应当追问的是：',
          options: [
            { text: '一对靠枕为什么能承担起人物的命运', correct: true },
            { text: '靠枕用了多少种颜色的丝线', correct: false },
            { text: '白总长家住在哪条街', correct: false },
            { text: '大小姐的生日是哪一天', correct: false }
          ],
          explain: '物象之所以重要，是因为它被放进了人物的处境里；追问象征如何成立，才是文学阅读。'
        }
      ]
    },
    {
      no: 2,
      points: 8,
      type: '文本细读',
      intro: '《在酒楼上》的比喻是理解吕纬甫的关键，注意喻体与人物处境之间的对应。',
      parts: [
        {
          label: '2(1)',
          points: 4,
          kind: 'choice',
          prompt: '吕纬甫把自己比作蜂子或蝇子，这个比喻强调的是：',
          options: [
            { text: '飞出去又被吓回原处，反抗只绕了一个小圈子', correct: true },
            { text: '昆虫的生命短暂，人生无常', correct: false },
            { text: '他喜欢观察自然，有科学精神', correct: false },
            { text: '他少年时曾被蜂蜇过', correct: false }
          ],
          explain: '比喻的落点在「原地点」：青年时代的理想并未消失，只是被现实吓退，回到起点。'
        },
        {
          label: '2(2)',
          points: 4,
          kind: 'fill',
          prompt: '《在酒楼上》中，吕纬甫对「我」讲述自己替母亲做的事，其中一件是给三岁就死去的弟弟迁葬，另一件是给邻居的女儿送剪绒花。这两件事共同说明他：',
          answer: '在琐碎的人情事务中消耗自己',
          explain: '迁葬与送花都是「为别人」的小事，做得认真，却与当年的理想无关；这正是「绕回原处」的具体化。'
        }
      ]
    },
    {
      no: 3,
      points: 8,
      type: '五四小说',
      intro: '莎菲与《封锁》都把人物放进一个临时的、与日常隔绝的空间里。',
      parts: [
        {
          label: '3(1)',
          points: 4,
          kind: 'choice',
          prompt: '《莎菲女士的日记》采用日记体，最主要的艺术效果是：',
          options: [
            { text: '让欲望、犹疑与自我辩解不经转述地呈现出来', correct: true },
            { text: '使情节更加完整严密', correct: false },
            { text: '拉开叙述者与人物的距离', correct: false },
            { text: '方便作者插入大量议论', correct: false }
          ],
          explain: '日记体取消了全知叙述的整理与评判，读者被迫贴着莎菲的心理走。'
        },
        {
          label: '3(2)',
          points: 4,
          kind: 'tf',
          prompt: '《封锁》中电车上的相遇改变了现实秩序，封锁结束后两人仍继续交往。',
          options: [
            { text: '正确', correct: false },
            { text: '错误', correct: true }
          ],
          explain: '封锁是一个临时的梦，梦醒后一切归位，两人再没有下文，这正是小说的残酷处。'
        }
      ]
    },
    {
      no: 4,
      points: 8,
      type: '乡土叙事',
      intro: '乡土小说的「常」与「变」，往往体现在一个人、一件物、一个循环上。',
      parts: [
        {
          label: '4(1)',
          points: 4,
          kind: 'choice',
          prompt: '《萧萧》的结局说明：',
          options: [
            { text: '生下男孩使越轨者被制度重新接纳，循环继续', correct: true },
            { text: '萧萧的反抗彻底改变了乡村制度', correct: false },
            { text: '花狗被处死，乡村恢复了正义', correct: false },
            { text: '萧萧离家出走，开始新生活', correct: false }
          ],
          explain: '「添丁」把罪过转成功劳，制度不必修改就消化了反抗，这是小说最冷的一笔。'
        },
        {
          label: '4(2)',
          points: 4,
          kind: 'tf',
          prompt: '《断魂枪》中沙子龙的「不传」，既是对外人的拒绝，也是对自身时代的告别。',
          options: [
            { text: '正确', correct: true },
            { text: '错误', correct: false }
          ],
          explain: '枪法失去用武之地，沙子龙把它留给夜晚的自己，清醒而悲哀。'
        }
      ]
    },
    {
      no: 5,
      points: 8,
      type: '都市与心理',
      intro: '都市小说把外部景观写进人物的感官与心理，读的时候要注意「景」与「心」的转换。',
      parts: [
        {
          label: '5(1)',
          points: 4,
          kind: 'choice',
          prompt: '《梅雨之夕》的叙事重心是：',
          options: [
            { text: '「我」的想象、犹疑与自我辩解', correct: true },
            { text: '雨中交通事故的处理', correct: false },
            { text: '上海电车路线的变迁', correct: false },
            { text: '少女的家庭背景', correct: false }
          ],
          explain: '现实中两人几乎未交往，全部张力来自「我」的意识活动。'
        },
        {
          label: '5(2)',
          points: 4,
          kind: 'fill',
          prompt: '《倾城之恋》中，白流苏与范柳原最终结合，直接原因是＿＿＿＿。',
          answer: '香港的陷落',
          explain: '城市的毁灭让所有算计失效，两人才卸下防备；张爱玲以此写反讽，而非浪漫。'
        }
      ]
    },
    {
      no: 6,
      points: 8,
      type: '描写文',
      intro: '描写文考两件事：观察的位置与顺序，以及语言的分寸。',
      parts: [
        {
          label: '6(1)',
          points: 4,
          kind: 'choice',
          prompt: '写一段描写文，最先要确定的是：',
          options: [
            { text: '观察的位置与顺序', correct: true },
            { text: '用多少成语', correct: false },
            { text: '能否押韵', correct: false },
            { text: '篇幅是否够长', correct: false }
          ],
          explain: '位置决定看见什么，顺序决定读者能否跟上；缺了这两样，描写就只是形容词的堆叠。'
        },
        {
          label: '6(2)',
          points: 4,
          kind: 'keywords',
          prompt: '张岱《陶庵梦忆》的白描，常被概括为「少用形容词，靠＿＿与＿＿见景」。请在横线处填出两个词。',
          answer: '量词、动作',
          explain: '白描把可有可无的修饰删掉，用准确的量与具体的动作让物象自己显形。'
        }
      ]
    },
    {
      no: 7,
      points: 8,
      type: '饮食散文',
      intro: '谈吃的文章，味道只是入口，真正的落点在知识与人事。',
      parts: [
        {
          label: '7(1)',
          points: 4,
          kind: 'choice',
          prompt: '汪曾祺《泡茶馆》的「泡」字，最传神地写出：',
          options: [
            { text: '在茶馆里长时间消磨、观察与交往的状态', correct: true },
            { text: '泡茶的工序', correct: false },
            { text: '茶馆的装修风格', correct: false },
            { text: '茶叶的买卖行情', correct: false }
          ],
          explain: '「泡」既是时间也是姿态：无所事事地待着，才看得见茶客们的世态与趣味。'
        },
        {
          label: '7(2)',
          points: 4,
          kind: 'tf',
          prompt: '饮食散文只要把味道写得逼真就够了，不必有知识、记忆或议论。',
          options: [
            { text: '正确', correct: false },
            { text: '错误', correct: true }
          ],
          explain: '味觉是入口；没有知识与人事支撑，再逼真的味道也留不住读者。'
        }
      ]
    },
    {
      no: 8,
      points: 10,
      type: '议论与驳论',
      intro: '同写复仇，陈子昂、柳宗元、王安石的前提各不相同。答题时先分清各自在回答什么问题。',
      parts: [
        {
          label: '8(1)',
          points: 4,
          kind: 'choice',
          prompt: '柳宗元《驳复仇议》反驳陈子昂的核心是：',
          options: [
            { text: '礼与法不应二元并行，赏罚必须一致', correct: true },
            { text: '复仇在任何情况下都应鼓励', correct: false },
            { text: '案件的事实无法查清', correct: false },
            { text: '陈子昂的文章不够典雅', correct: false }
          ],
          explain: '陈子昂主张「诛而后旌」，柳宗元指出既杀又赏会让国法自相矛盾。'
        },
        {
          label: '8(2)',
          points: 6,
          kind: 'output',
          prompt: '用 120 字左右说明：苏轼《贾谊论》如何把「贾谊不遇」的旧说翻出新意？',
          answer: '苏轼把问题从「君主不用」转到贾谊自身：志大而量小，有才而不能自用其才，不能待时。',
          explain: '评分要点：指出旧说（文帝不用／大臣排挤）2 分；指出苏轼的换角度（责任转向贾谊自身）2 分；点出「志大而量小」「不能待时」等关键词 2 分。'
        }
      ]
    },
    {
      no: 9,
      points: 8,
      type: '文学革命',
      intro: '胡适与陈独秀的分歧，不只是语气，而是「改良」与「革命」两种路径。',
      parts: [
        {
          label: '9(1)',
          points: 4,
          kind: 'choice',
          prompt: '胡适「八事」的核心主张是：',
          options: [
            { text: '言之有物，要有自己的情感与思想', correct: true },
            { text: '严守格律，多用典故', correct: false },
            { text: '恢复科举文体', correct: false },
            { text: '只写文言，不写白话', correct: false }
          ],
          explain: '其余各条都在拆掉让人「不用自己想」的格式，为「有物」腾出位置。'
        },
        {
          label: '9(2)',
          points: 4,
          kind: 'tf',
          prompt: '陈独秀「三大主义」中的「国民文学」「写实文学」「社会文学」，分别对应读者、内容与功能三个层面。',
          options: [
            { text: '正确', correct: true },
            { text: '错误', correct: false }
          ],
          explain: '三组对立各有侧重：谁在写／写给谁、真不真、有没有用，合起来是一套完整主张。'
        }
      ]
    },
    {
      no: 10,
      points: 9,
      type: '应用文',
      intro: '演讲为听众而写，书信为收信人而写；对象决定详略与语气。',
      parts: [
        {
          label: '10(1)',
          points: 4,
          kind: 'choice',
          prompt: '演讲稿的「凤头、猪肚、豹尾」分别指：',
          options: [
            { text: '开头短而抓人、中间充实、结尾利落', correct: true },
            { text: '开头华丽、中间空洞、结尾冗长', correct: false },
            { text: '三段都要押韵', correct: false },
            { text: '只讲一个故事，不作结构安排', correct: false }
          ],
          explain: '演讲是一次性的：开头决定听众是否听下去，中间决定有无收获，结尾决定记住什么。'
        },
        {
          label: '10(2)',
          points: 5,
          kind: 'output',
          prompt: '给一位帮你改过论文的老师写一封 100 字左右的电邮：说明来意、具体致谢，并请对方再指点一处问题。',
          answer: '称呼得体、事由清楚、感谢具体、请求明确、署名与日期齐全。',
          explain: '评分要点：称谓与署名各 1 分；事由与具体致谢 2 分；请求明确、留有余地 1 分；语气分寸与格式 1 分。'
        }
      ]
    },
    {
      no: 11,
      points: 7,
      type: '学术规范',
      intro: '注释与引用不是格式问题，而是区分「你的」与「别人的」的界线。',
      parts: [
        {
          label: '11(1)',
          points: 4,
          kind: 'choice',
          prompt: '下列哪种做法符合学术规范？',
          options: [
            { text: '直接引用加引号，并注明作者、篇名、版本与页码', correct: true },
            { text: '把别人的观点改写几句，即可不加注', correct: false },
            { text: '只在文末列参考文献，正文不必注', correct: false },
            { text: '网络资料无须注明检索日期', correct: false }
          ],
          explain: '直接引用与转述都须注明；改写而不注明，仍属抄袭。'
        },
        {
          label: '11(2)',
          points: 3,
          kind: 'keywords',
          prompt: '一篇学期论文的正文，每一段最好只做一件事：提出一个判断、引用一段＿＿、解释它如何支持判断。',
          answer: '文本',
          explain: '「判断—证据—解释」是段落的基本单位；缺了解释，引文就只是装饰。'
        }
      ]
    },
    {
      no: 12,
      points: 10,
      type: '综合写作',
      intro: '本题考综合能力：提出论点、选择文本、组织证据，并在有限篇幅内说得清楚。',
      parts: [
        {
          label: '12',
          points: 10,
          kind: 'output',
          prompt: '从本课程任选一篇小说，以「一件物象如何承担人物的命运」为题，写 300 字以上的分析。要求：明确说出物象是什么、它在文本中出现了几次、每次出现改变了什么。',
          answer: '可选《绣枕》的靠枕、《断魂枪》的枪、《倾城之恋》的墙、《萧萧》的磨坊等；须有明确论点与至少两处文本证据。',
          explain: '评分要点：论点清楚 2 分；物象与人物处境的关联 3 分；至少两处文本证据并作解释 3 分；结构完整、语言通顺 2 分。只复述情节不给分。'
        }
      ]
    }
  ]
});
