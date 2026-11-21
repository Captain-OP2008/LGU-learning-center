/* =====================================================================
 * exam.js · 模拟卷 A（CSC.registerExam）
 * 覆盖全学期：学术语体、写作结构、因果分析、资料检索、APA 引用、
 * 论证写作、口语演示与逻辑谬误
 * 12 题，满分 100，建议 90 分钟
 * ===================================================================== */
CSC.registerExam({
  id: 'ENG1002-A',
  title: '模拟卷 A · 全学期综合',
  style: 'FINAL',
  subtitle: '覆盖第 0–7 章：语体、结构、因果、检索、引用、论证与口语',
  date: '',
  minutes: 90,
  totalScore: 100,
  summary: '本卷 12 题、满分 100：单项选择题 9 道（每题 4–5 分）、判断题 1 道（4 分）、填空题 2 道（各 4 分）、简答与改写题 6 道（4–6 分）。建议先用 40 分钟完成客观题，再用 50 分钟处理改写与简答题；简答题按要点给分，写出关键术语即可得分。',
  instructions: [
    '闭卷考试，不得携带任何资料；所有改写与简答题用英文作答，术语拼写错误不扣分，但表达不清会影响得分。',
    '选择题只有一个最佳答案；判断题只需写 True 或 False；填空题只填关键词，不必写完整句。',
    '改写题要求保留原意、改变句式，并符合学术语体；只替换一两个词不得满分。',
    '简答题按要点给分：先给结论，再给理由或例子；时间不够时优先写要点，不要留空。'
  ],
  questions: [
    {
      no: 1,
      points: 8,
      type: '学术语体',
      intro: '正式、客观、精确、简洁是学术语体的四条主线。本题从「辨认」到「改写」检验你是否真的会用。',
      parts: [
        {
          label: '1(1)',
          points: 4,
          kind: 'choice',
          prompt: '下列哪一句最符合学术语体？',
          options: [
            { text: 'The survey indicates that 62% of first-year students skip breakfast at least twice a week.', correct: true },
            { text: 'We found out that lots of first-year students skip breakfast a lot.' },
            { text: 'First-year students? They hardly ever eat breakfast, you know.' },
            { text: 'Breakfast skipping is a big problem for students nowadays.' }
          ],
          explain: '学术句用名词化主语、精确动词与可核查数字（62%、twice a week）；find out、lots of、you know、big problem 都是口语标记。'
        },
        {
          label: '1(2)',
          points: 4,
          kind: 'output',
          prompt: '把下面这句改写成学术语体（保留原意）："I think online classes are really bad because students can’t focus."',
          answer: 'Online instruction appears to reduce students’ ability to concentrate, which may lower learning outcomes.',
          explain: '改写要点：去掉 I think 与 really，把 bad 换成可论证的判断（reduce concentration / lower outcomes），用 appears to、may 让语气与证据匹配，并用从句或名词化合并因果。'
        }
      ]
    },
    {
      no: 2,
      points: 10,
      type: 'APA 文内引用',
      intro: '文内引用是 APA 最常考的部分：作者数量决定写法，直接引用还要页码。',
      parts: [
        {
          label: '2(1)',
          points: 5,
          kind: 'choice',
          prompt: '一篇有两位作者（Walker 与 Allen）、发表于 2004 年的文献，文内引用应写成？',
          options: [
            { text: '(Walker &amp; Allen, 2004)', correct: true },
            { text: '(Walker and Allen, 2004)' },
            { text: '(Walker et al., 2004)' },
            { text: '(Walker, Allen, 2004)' }
          ],
          explain: '括号内两位作者用 &amp; 连接，年份在后并用逗号隔开；只有在句子中叙述时才用 and，如 Walker and Allen (2004) argue…。'
        },
        {
          label: '2(2)',
          points: 5,
          kind: 'choice',
          prompt: '你直接引用了 Hedetoft 2013 年著作第 2 页的一句话，正确的文内标注是？',
          options: [
            { text: '(Hedetoft, 2013, p. 2)', correct: true },
            { text: '(Hedetoft, 2013)' },
            { text: '(Hedetoft, p. 2)' },
            { text: '(Hedetoft 2013, page 2)' }
          ],
          explain: '直接引用必须给出定位信息：作者、年份、页码（p. 或 pp.），三项用逗号分隔；缺页码会被视为无法核实。'
        }
      ]
    },
    {
      no: 3,
      points: 10,
      type: '参考文献',
      intro: '参考文献表不是装饰，它要能让读者按图索骥找到原文。',
      parts: [
        {
          label: '3(1)',
          points: 5,
          kind: 'choice',
          prompt: 'APA 参考文献表的排列依据是？',
          options: [
            { text: '第一作者姓氏的字母顺序', correct: true },
            { text: '在正文中出现的先后顺序' },
            { text: '出版年份从新到旧' },
            { text: '文献重要程度从高到低' }
          ],
          explain: 'APA 采用作者—日期制，文末按姓氏字母序排列；同一作者按年份先后，同年再加 a、b 区分。'
        },
        {
          label: '3(2)',
          points: 5,
          kind: 'keywords',
          prompt: '写出一条「书籍」的 APA 7 参考文献条目必须包含的四类信息。',
          keywords: ['作者', '年份', '书名', '出版社', '斜体', '版次'],
          explain: '书籍条目的骨架是：作者.（年份）. 书名（斜体，首字母大写，其余小写）（版次）. 出版社。示例：Strunk, W., Jr., &amp; White, E. B. (1999). The elements of style (4th ed.). Longman.'
        }
      ]
    },
    {
      no: 4,
      points: 8,
      type: '因果分析',
      intro: '因果论文最常见的失分点是「把相关当因果」。本题要求你识别混杂因素并说明因果成立的条件。',
      parts: [
        {
          label: '4(1)',
          points: 4,
          kind: 'choice',
          prompt: '研究发现「每天喝咖啡的人寿命更长」。下列哪一项最可能是混杂变量？',
          options: [
            { text: '收入水平：收入高的人既喝得起咖啡，也能获得更好的医疗', correct: true },
            { text: '咖啡的品种' },
            { text: '研究者的国籍' },
            { text: '统计软件的选择' }
          ],
          explain: '混杂变量同时影响「是否喝咖啡」与「寿命」，会制造虚假因果。收入、教育、职业等社会经济因素是最常见的混杂变量。'
        },
        {
          label: '4(2)',
          points: 4,
          kind: 'keywords',
          prompt: '要让「A 导致 B」的因果主张可信，除相关性外至少还要提供哪两类证据？',
          keywords: ['时间顺序', '机制', '机制解释', '反事实', '控制混杂', '排除反向因果', '实验', '干预'],
          explain: '最低要求是时间顺序（原因先于结果）与排除替代解释（混杂、反向因果、选择效应）；更强的证据是机制解释与干预实验。'
        }
      ]
    },
    {
      no: 5,
      points: 8,
      type: '论证结构',
      intro: '图尔敏模型把「有观点」拆成「能被检验的论证」。',
      parts: [
        {
          label: '5(1)',
          points: 4,
          kind: 'choice',
          prompt: '在「校园应禁止一次性塑料瓶，因为某校禁用后塑料垃圾下降 40%」这一论证中，「某校禁用后下降 40%」属于图尔敏模型的哪一要素？',
          options: [
            { text: '数据（data / grounds）', correct: true },
            { text: '主张（claim）' },
            { text: '依据（warrant）' },
            { text: '限定（qualifier）' }
          ],
          explain: '主张是「应禁止」，数据是「下降 40%」这一证据，依据是连接两者的普遍原则（减少塑料使用能减少垃圾），限定则说明结论的适用范围。'
        },
        {
          label: '5(2)',
          points: 4,
          kind: 'tf',
          prompt: '论证中先承认反方合理之处、再说明为何不改变结论，会削弱自己的立场。',
          options: [
            { text: 'True' },
            { text: 'False', correct: true }
          ],
          explain: '让步—反驳（concession–rebuttal）显示作者检验过反面证据，通常增强可信度；真正的削弱是只提反方而不回应。'
        }
      ]
    },
    {
      no: 6,
      points: 8,
      type: '资料检索',
      intro: '检索不是「输入关键词然后祈祷」，而是有策略地缩小、扩大与追踪。',
      parts: [
        {
          label: '6(1)',
          points: 4,
          kind: 'choice',
          prompt: '在数据库中检索 "social media AND sleep AND adolescents"，结果会怎样？',
          options: [
            { text: '只返回同时包含三个词的文献，结果更少但更相关', correct: true },
            { text: '返回包含任一词的文献，结果更多' },
            { text: '排除所有含 sleep 的文献' },
            { text: '按发表时间排序' }
          ],
          explain: 'AND 取交集，用于收窄；若结果太少，再把某个 AND 换成 OR 并补同义词（如 teenagers OR adolescents）。'
        },
        {
          label: '6(2)',
          points: 4,
          kind: 'fill',
          prompt: '研究者本人发表的研究报告、原始数据或亲历记录，在文献分类中称为（填中文术语，四个字以内）。',
          answer: '一手来源',
          explain: '一手来源（primary source）是原始证据；教科书、综述、百科是二手来源，适合入门与追踪线索，但关键数据应回到一手文献。'
        }
      ]
    },
    {
      no: 7,
      points: 10,
      type: '转述与引用',
      intro: '转述是学术写作的核心技能，也是最容易踩抄袭红线的地方。',
      parts: [
        {
          label: '7(1)',
          points: 5,
          kind: 'choice',
          prompt: '下列哪种做法属于「拼贴写作」（patchwriting）？',
          options: [
            { text: '保留原文句式，只把几个词换成同义词，仍标注来源', correct: true },
            { text: '读完原文后合上材料，用自己的句子重建观点并标注来源' },
            { text: '直接引用并加引号与页码' },
            { text: '概括整段并标注作者与年份' }
          ],
          explain: 'patchwriting 贴着原文走，换词不换结构，既没理解也构成抄袭；即使标了来源，文字仍属于借用。正确做法是理解后重写。'
        },
        {
          label: '7(2)',
          points: 5,
          kind: 'output',
          prompt: '用一句话转述以下观点并补上 APA 文内引用："Walker (2007) argues that extensive reading improves academic vocabulary far more than memorising word lists."',
          answer: 'Walker (2007) contends that reading widely builds academic vocabulary more effectively than rote memorisation of word lists.',
          explain: '转述要换结构而非换词：把 improves…far more than 改为 builds…more effectively than，保留作者与年份，不复制原句的从句骨架。'
        }
      ]
    },
    {
      no: 8,
      points: 8,
      type: '简洁表达',
      intro: 'Strunk 与 White 的原则只有一句：Vigorous writing is concise。',
      parts: [
        {
          label: '8(1)',
          points: 4,
          kind: 'fill',
          prompt: '用一个词替换 "due to the fact that"（只填英文单词）。',
          answer: 'because',
          explain: 'due to the fact that、for the reason that、owing to the fact that 都是 because 的冗长版本；一个词能说清就不要用五个。'
        },
        {
          label: '8(2)',
          points: 4,
          kind: 'choice',
          prompt: '下列哪一句最简洁且不损失信息？',
          options: [
            { text: 'The committee postponed the decision until March.', correct: true },
            { text: 'The committee made the decision to postpone the decision until March.' },
            { text: 'It was decided by the committee that a postponement of the decision would take place until March.' },
            { text: 'The committee was of the opinion that the decision should be postponed until March.' }
          ],
          explain: 'B 重复 decision，C 堆叠名词化与虚主语，D 用 was of the opinion that 绕圈；A 用实义动词 postponed 直接表达。'
        }
      ]
    },
    {
      no: 9,
      points: 8,
      type: '谨慎表达',
      intro: 'hedging 不是含糊，而是让判断强度与证据强度对齐。',
      parts: [
        {
          label: '9(1)',
          points: 4,
          kind: 'choice',
          prompt: '一项只有 30 人参与的小样本研究，最合适的结论表述是？',
          options: [
            { text: 'The findings suggest that the programme may improve attendance among first-year students.', correct: true },
            { text: 'The programme improves attendance among all first-year students.' },
            { text: 'The programme definitely solves the attendance problem.' },
            { text: 'Every university should adopt the programme immediately.' }
          ],
          explain: '样本小、范围窄，结论就要用 suggest、may、among first-year students 限定；用 improves…all、definitely、every 属于过度概括。'
        },
        {
          label: '9(2)',
          points: 4,
          kind: 'output',
          prompt: '改写下面的过度概括句，使其与「仅在一所学校调查」的证据强度匹配："Online quizzes make students learn better."',
          answer: 'At the surveyed school, online quizzes appear to be associated with better learning outcomes.',
          explain: '限定范围（at the surveyed school）、改因果为关联（be associated with）、加 appears to；三步把「普遍规律」降回「一项调查的发现」。'
        }
      ]
    },
    {
      no: 10,
      points: 8,
      type: '逻辑谬误',
      intro: '识别谬误是论证写作的防守技术：先能命名，才能反驳。',
      parts: [
        {
          label: '10(1)',
          points: 4,
          kind: 'choice',
          prompt: '「如果允许学生带电脑进考场，他们就会作弊，然后学位贬值，最后整个教育体系崩溃。」这属于哪种谬误？',
          options: [
            { text: '滑坡谬误（slippery slope）', correct: true },
            { text: '人身攻击（ad hominem）' },
            { text: '循环论证（circular reasoning）' },
            { text: '虚假权威（appeal to authority）' }
          ],
          explain: '滑坡谬误在没有证据的情况下断言第一步必然引发一连串极端后果；检验方法是逐一追问每个「必然」是否有依据。'
        },
        {
          label: '10(2)',
          points: 4,
          kind: 'keywords',
          prompt: '写出两种常见的「诉诸情感」之外的论证谬误名称（中文或英文均可）。',
          keywords: ['滑坡', '人身攻击', '循环论证', '虚假两难', '稻草人', '诉诸权威', '以偏概全', 'post hoc', 'hasty generalisation'],
          explain: '常见谬误还有虚假两难（false dilemma）、稻草人（straw man）、以偏概全（hasty generalisation）、post hoc（错认因果）等；写作中既要避免使用，也要能识别并命名。'
        }
      ]
    },
    {
      no: 11,
      points: 8,
      type: '学术口语',
      intro: '5–6 分钟的演示，结构、幻灯片与 Q&A 同样计入评分。',
      parts: [
        {
          label: '11(1)',
          points: 4,
          kind: 'choice',
          prompt: '5–6 分钟演示中，主体部分较合理的时间安排是？',
          options: [
            { text: '三个要点各约 1 分钟，开场与收尾各约 45 秒', correct: true },
            { text: '背景讲 4 分钟，结论 10 秒' },
            { text: '八个要点各 40 秒，不留开场' },
            { text: '主体不设要点，随机发挥' }
          ],
          explain: '短演示要精确到分钟：开场抓注意、路线图定位、三点主体各一分钟、收尾重申并引出 Q&amp;A；背景过长会挤掉论证。'
        },
        {
          label: '11(2)',
          points: 4,
          kind: 'output',
          prompt: 'Q&amp;A 中听众问了一个你没准备的问题。写出一句得体的回应（英文），说明你会如何争取时间并给出方向。',
          answer: 'That is a fair point; I did not examine that variable, but the pattern in my data suggests it deserves a follow-up study.',
          explain: '得体回应三步：承认问题合理、说明自己数据的边界、给出可追的方向；不要编造数据，也不要用 That is wrong 直接顶回去。'
        }
      ]
    },
    {
      no: 12,
      points: 6,
      type: '综合写作',
      intro: '最后一道题把全卷能力收束成一句话：给定题目，写出可论证的论文陈述。',
      parts: [
        {
          label: '12(1)',
          points: 6,
          kind: 'output',
          prompt: '题目：「Should universities require all first-year students to take a course in academic writing?」写出一句 25–40 词的论文陈述，包含立场、理由概览与限定。',
          answer: 'Universities should require a first-year academic writing course because it equips students with citation and argument skills needed across disciplines, although the requirement should be paired with discipline-specific support.',
          explain: '合格答案要三件事齐全：明确立场（should require）、理由（citation and argument skills）、限定（paired with discipline-specific support）；只写 I agree 或只列理由都不算完整。'
        }
      ]
    }
  ]
});
