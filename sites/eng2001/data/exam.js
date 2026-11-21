/* =====================================================================
 * exam.js · 模拟卷 A（CSC.registerExam）
 * 覆盖全学期 7 个主题：学术阅读、选题与检索、文献综述、研究方法、
 * 论证、演讲与海报、结果讨论与定稿
 * 12 题，满分 100，建议 100 分钟
 * ===================================================================== */
CSC.registerExam({
  id: 'ENG2001-A',
  title: '模拟卷 A · 全学期综合',
  style: 'FINAL',
  subtitle: '覆盖第 1–7 章：学术阅读与 IMRaD、选题与 RQ、文献综述与引用、研究方法、论证、演讲与海报、结果讨论与定稿',
  date: '',
  minutes: 100,
  totalScore: 100,
  summary: '选择题与判断题 12 小问、填空题与简答题 6 小问、开放写作 4 小问；共 12 题，满分 100 分。建议前 45 分钟完成客观题，后 55 分钟处理改写、综述与写作题。',
  instructions: [
    '考试为闭卷，不得携带笔记；可以查阅课程提供的 APA 7 格式模板（若监考允许）。',
    '改写与写作题按「内容准确、语域合适、格式规范」三项评分，只写关键词不得满分。',
    '所有英文例句请写成完整句子，避免使用口语缩写（don\'t、gonna）与感叹号。',
    '引用题的答案只需给出格式，不需要编造具体的文献条目。'
  ],
  questions: [
    {
      no: 1,
      points: 8,
      type: '学术语域',
      intro: '学术语域的差别往往不在「用了什么难词」，而在名词化、动词选择与强度控制三个地方。',
      parts: [
        {
          label: '1(1)',
          points: 4,
          kind: 'choice',
          prompt: '下列哪一句最符合学术语域？',
          options: [
            { text: 'The decline in attendance coincided with the introduction of online lectures.', correct: true },
            { text: 'Attendance dropped a lot right after they put lectures online.' },
            { text: 'Loads of students stopped coming when lectures went online.' },
            { text: 'Online lectures made attendance crash!' }
          ],
          explain: 'A 句用名词化（decline、introduction）、中性动词（coincided with）与克制的强度，且不预设因果。其余三句含口语强度词（a lot、loads of）、口语动词（crash）或感叹号，语域偏低，其中 D 还暗示了因果。'
        },
        {
          label: '1(2)',
          points: 4,
          kind: 'output',
          prompt: '把下面这句改写成学术语域（保留原意，不改数据）：Many students said the feedback was really useful but kind of vague.',
          answer: 'Students reported that the feedback was useful but insufficiently specific.',
          explain: '改写要做三件事：把 said 换成 reported、删去 really 与 kind of 这类口语强化词、把 vague 换成更准确的 insufficiently specific。原句的「有用但模糊」两层意思都要保留，不能只留一半。'
        }
      ]
    },
    {
      no: 2,
      points: 8,
      type: 'IMRaD 与摘要',
      intro: 'IMRaD 是读者提问链的物化：每块回答一个问题，位置错了，读者就找不到答案。',
      parts: [
        {
          label: '2(1)',
          points: 4,
          kind: 'choice',
          prompt: '下列哪一项不属于 Results 部分的功能？',
          options: [
            { text: '解释为什么会出现这个结果', correct: true },
            { text: '报告样本量与描述统计' },
            { text: '呈现图表并指向关键数据' },
            { text: '按研究问题顺序组织发现' }
          ],
          explain: '解释属于 Discussion。Results 只报告「看到了什么」：样本、描述统计、图表与关键数字。把 because 或 suggests 写进 Results，等于替读者先做了判断。'
        },
        {
          label: '2(2)',
          points: 4,
          kind: 'tf',
          prompt: '判断：摘要中应当引用至少两篇关键文献，以显示作者读过相关研究。',
          options: [
            { text: '错误', correct: true },
            { text: '正确' }
          ],
          explain: '摘要通常不出现引用：它是全文的压缩，读者需要的是背景、空白、做法、发现与意义。用引用占篇幅会挤掉真正需要交代的信息，文献对话留给引言与讨论。'
        }
      ]
    },
    {
      no: 3,
      points: 8,
      type: '选题与研究问题',
      intro: '好选题的三个条件是可行、有意义、可研究；一个 RQ 还要有对象、焦点、语境与可回答的提问方式。',
      parts: [
        {
          label: '3(1)',
          points: 4,
          kind: 'choice',
          prompt: '下列哪一个最像可操作的研究问题？',
          options: [
            { text: 'How do first-year students at one EMI university describe the usefulness of peer feedback?', correct: true },
            { text: 'Is peer feedback good or bad?' },
            { text: 'What is the future of education?' },
            { text: 'Should teachers give more feedback?' }
          ],
          explain: 'A 句给出了对象（first-year students）、焦点（usefulness of peer feedback）、语境（one EMI university）与可回答的提问方式（describe）。B 是二元价值判断，C 范围过大，D 是立场问题而非研究问题。'
        },
        {
          label: '3(2)',
          points: 4,
          kind: 'output',
          prompt: '把「中国大学生如何使用 AI 写作工具」收窄成一个 RQ，并写出它的对象、焦点、语境三个零件。',
          answer: 'RQ: How do second-year students in one Chinese university use generative AI tools when drafting literature reviews? 对象：second-year students；焦点：use of generative AI when drafting literature reviews；语境：one Chinese university。',
          explain: '收窄的关键是加限定：年级、工具类型、写作环节、学校范围。三个零件缺一不可——只说「中国大学生」仍然太大，只说「AI 写作」则没有对象，读者无法判断你要收集什么资料。'
        }
      ]
    },
    {
      no: 4,
      points: 8,
      type: '检索与评估',
      intro: '检索是把问题翻译成运算符，评估是判断检索到的东西能不能用。',
      parts: [
        {
          label: '4(1)',
          points: 4,
          kind: 'choice',
          prompt: '检索结果过多且混杂，最有效的第一步是？',
          options: [
            { text: '用 AND 增加限定词，并把检索限定在标题或摘要字段', correct: true },
            { text: '把所有结果都下载下来逐篇筛' },
            { text: '改用 OR 扩大检索范围' },
            { text: '换一个完全不相关的关键词' }
          ],
          explain: '结果过多时要做减法：AND 增加必要条件、限定字段（title/abstract）、加年份或文献类型。OR 是扩大，会把结果变得更多；全下载再筛则把检索问题变成了时间问题。'
        },
        {
          label: '4(2)',
          points: 4,
          kind: 'keywords',
          prompt: '写出 CRAAP 五个评估维度的英文词，并各用半句话说明它问什么。',
          keywords: ['Currency', 'Relevance', 'Authority', 'Accuracy', 'Purpose', '时效', '相关', '权威', '准确', '目的'],
          explain: 'CRAAP 是 Currency（是否够新）、Relevance（是否切题）、Authority（作者与出版方是否可信）、Accuracy（证据与数据是否可核）、Purpose（写作目的是告知、说服还是营销）。五问的顺序就是从「能不能用」到「该不该信」。'
        }
      ]
    },
    {
      no: 5,
      points: 8,
      type: '文献综述',
      intro: '综述的组织单位是论点，不是文献。',
      parts: [
        {
          label: '5(1)',
          points: 4,
          kind: 'choice',
          prompt: '下列哪种写法最像「综合」而不是「罗列」？',
          options: [
            { text: '三组研究都发现反馈的具体性影响采纳率，但对「具体到何种程度」的判断不同。', correct: true },
            { text: '王（2018）研究了反馈。李（2019）也研究了反馈。张（2020）还研究了反馈。' },
            { text: '关于反馈，有很多研究，下面分别介绍。' },
            { text: '反馈很重要（王，2018）。反馈非常关键（李，2019）。' }
          ],
          explain: '综合是把多篇研究放进同一个比较维度：共同发现是什么、分歧在哪。B 是按文献排队，C 是空转的过渡句，D 是同意反复，三者都没有产生新判断。'
        },
        {
          label: '5(2)',
          points: 4,
          kind: 'output',
          prompt: '用一个综述段落的三段式（主张—证据—评论）写三句话，主题是「同伴反馈的具体性」。不需要真实文献，用（Author, Year）占位即可。',
          answer: '具体性是同伴反馈被采纳的关键条件（Author, Year）。两项课堂研究发现，给出修改位置的评语比笼统的「再改改」更容易被采纳（Author, Year）。不过这些研究都依赖自我报告，实际修改行为是否同步改变仍不清楚。',
          explain: '三句各司其职：第一句给主张，第二句给证据并说明证据类型，第三句做评论——指出证据的边界。第三句是区分「读过」与「读懂」的地方，也是引出 gap 的位置。'
        }
      ]
    },
    {
      no: 6,
      points: 8,
      type: '引用与转述',
      intro: '引用是让读者能追溯，转述是让观点进入你的论证。两者都不是「换个说法」。',
      parts: [
        {
          label: '6(1)',
          points: 4,
          kind: 'choice',
          prompt: '下列哪种做法构成抄袭？',
          options: [
            { text: '改写三段他人论述并标注了出处，但结构与原文高度相似', correct: true },
            { text: '直接引用一句并加了引号与页码' },
            { text: '总结一篇论文的主要发现并标注作者与年份' },
            { text: '引用自己课程作业中的一段并注明' }
          ],
          explain: '改写后结构仍与原文一致，属于 patchwriting：表达换了皮，思路仍是别人的，标注出处也不能免除「未形成自己表述」的问题。其余三项分别是规范引用、规范总结与（需许可的）自我引用。'
        },
        {
          label: '6(2)',
          points: 4,
          kind: 'fill',
          prompt: '按 APA 7，把下面这条文内引用补全（只写括号内的部分）：一项由 Chen 与 Li 在 2021 年发表的研究。',
          answer: '(Chen & Li, 2021)',
          explain: 'APA 7 两位作者的文内引用是（Chen & Li, 2021）；三位及以上用 et al.（Chen et al., 2021）。注意括号内用 &，叙述句中用 and，且年份前有逗号。'
        }
      ]
    },
    {
      no: 7,
      points: 8,
      type: '研究方法',
      intro: '方法章要让别人能判断你的结论可不可信，甚至能照着再做一遍。',
      parts: [
        {
          label: '7(1)',
          points: 4,
          kind: 'choice',
          prompt: '想测量「学生对 AI 反馈的信任程度」，下列哪种工具最合适？',
          options: [
            { text: '五点李克特量表，从「非常不信任」到「非常信任」', correct: true },
            { text: '一道是非题：你信任 AI 反馈吗？' },
            { text: '让受访者写一篇五百字作文' },
            { text: '统计学生使用 AI 工具的次数' }
          ],
          explain: '信任程度是连续的态度变量，李克特量表能区分强度；是非题只能得到二分结果，作文难以量化，使用次数测的是行为而非信任。工具要与变量的性质匹配。'
        },
        {
          label: '7(2)',
          points: 4,
          kind: 'tf',
          prompt: '判断：只要问卷的信度高，就说明它测到了研究者想要测的概念。',
          options: [
            { text: '错误', correct: true },
            { text: '正确' }
          ],
          explain: '信高管的是「稳定一致」，效度才管「测的是不是那个东西」。一份每次都稳定地测错概念的问卷，信度可以很高而效度为零。两者要分别报告。'
        }
      ]
    },
    {
      no: 8,
      points: 9,
      type: '论证结构',
      intro: '论证不是把观点说得更响，而是把「数据为何支持主张」这条桥搭出来。',
      parts: [
        {
          label: '8(1)',
          points: 5,
          kind: 'choice',
          prompt: '「这项研究的受访者都来自一所大学，因此中国大学生的写作焦虑普遍偏高。」这个论证缺的是什么？',
          options: [
            { text: 'warrant：从一所大学的样本推到全国总体，需要额外的代表性依据', correct: true },
            { text: 'claim：作者没有给出结论' },
            { text: 'data：作者没有引用任何数据' },
            { text: 'qualifier：作者不该使用「普遍」这个词' }
          ],
          explain: '主张与数据都在，缺的是连接二者的推理依据：为什么一所大学的样本能代表全国。补 warrant 的办法是加限定（在该校范围内）、补代表性证据，或改写主张的范围。D 只是症状，不是缺失的成分。'
        },
        {
          label: '8(2)',
          points: 4,
          kind: 'keywords',
          prompt: '写出 Toulmin 模型的六个要素（英文即可）。',
          keywords: ['claim', 'data', 'warrant', 'backing', 'qualifier', 'rebuttal', '主张', '数据', '依据', '支撑', '限定', '反驳'],
          explain: '六要素是 claim、data、warrant、backing、qualifier、rebuttal。写作中最常被省略的是 warrant 与 qualifier：前者是推理规则，后者是结论的强度限定。'
        }
      ]
    },
    {
      no: 9,
      points: 9,
      type: '谬误与反驳',
      intro: '识别谬误的目的是把自己的论证修好，而不是在辩论中给对方贴标签。',
      parts: [
        {
          label: '9(1)',
          points: 5,
          kind: 'choice',
          prompt: '「如果允许学生在考试中使用 AI，下一步他们就会让 AI 写完整篇论文，再下一步学位就没有意义了。」这属于哪种谬误？',
          options: [
            { text: '滑坡（slippery slope）', correct: true },
            { text: '稻草人（straw man）' },
            { text: '循环论证（circular reasoning）' },
            { text: '诉诸权威（appeal to authority）' }
          ],
          explain: '滑坡谬误在没有证据的情况下断言一连串后果必然发生。破解方法是追问每一步的概率与机制：允许使用 AI 是否必然导致代写？有没有中间的制度约束？'
        },
        {
          label: '9(2)',
          points: 4,
          kind: 'output',
          prompt: '用「让步 + 反驳」写两句话，回应「AI 反馈会让学生不再思考」这一担心。',
          answer: 'It is reasonable to worry that AI feedback may reduce students\' own reasoning, since ready-made comments can be adopted without scrutiny. However, this risk depends on how the feedback is used: when students are asked to evaluate and revise the comments, the tool becomes an object of analysis rather than a substitute for thought.',
          explain: '第一句准确复述并承认对方担心，第二句指出该担心成立的条件（如何使用），从而把「会不会」转化为「在什么条件下会」。让步不是投降，而是把讨论推进到机制层面。'
        }
      ]
    },
    {
      no: 10,
      points: 9,
      type: '演讲与海报',
      intro: '听众不能回看，所以结构必须被听见。',
      parts: [
        {
          label: '10(1)',
          points: 5,
          kind: 'choice',
          prompt: '十五分钟的学术报告，开场最有效的做法是？',
          options: [
            { text: '用一个具体现象或数字引出问题，随后给出你的一句话主张与路线图', correct: true },
            { text: '先感谢主办方、导师与同学，再介绍自己的学习经历' },
            { text: '直接开始念第一张幻灯片上的定义' },
            { text: '先讲三个笑话活跃气氛' }
          ],
          explain: '开场三十秒要回答「为什么值得听」与「你要说什么」。具体现象建立相关性，一句话主张给出方向，路线图让听众知道接下来去哪。致谢与自我介绍可以压缩成一句，定义留到需要时再给。'
        },
        {
          label: '10(2)',
          points: 4,
          kind: 'keywords',
          prompt: '写出四个可用于路标语（signposting）的英文表达，并标明它们各自标记什么位置。',
          keywords: ['First', 'Second', 'By contrast', 'To sum up', 'Turning to', 'In other words', '开头', '对比', '总结', '过渡'],
          explain: '常用路标语：First / Second（列举）、Turning to（换话题）、By contrast（对比）、In other words（解释）、To sum up（收束）。它们的共同点是把「结构位置」说出来，而不是让听众自己推断。'
        }
      ]
    },
    {
      no: 11,
      points: 9,
      type: '幻灯片与视觉',
      intro: '幻灯片是视觉支架，不是提词器。',
      parts: [
        {
          label: '11(1)',
          points: 5,
          kind: 'choice',
          prompt: '下列哪一页幻灯片最符合「一页一主张」的原则？',
          options: [
            { text: '标题写「Peer feedback was adopted most when it named a specific location」，页面只放一张对应的条形图', correct: true },
            { text: '标题写「Results」，页面放三段完整段落' },
            { text: '标题写「Introduction」，页面放十行小字文献综述' },
            { text: '标题写「Discussion」，页面放四张不相关的图' }
          ],
          explain: '主张式标题让听众即使不听讲解也能获得信息，一张对应的图提供证据。标题写「Results」只是目录标签，段落与十行小字则把幻灯片变成了文档。'
        },
        {
          label: '11(2)',
          points: 4,
          kind: 'output',
          prompt: '把幻灯片标题「Methods」改写成一个主张句，并说明改写后听众能获得什么。',
          answer: '改写：Forty-two students rated three feedback sources on the same five-point scale。听众能立即知道你研究了什么、规模多大，而不需要等你讲完才拼出信息。',
          explain: '主张式标题把「章节名」换成「这一页的结论或事实」。改写后，听众在你看图之前就已经拿到了信息，讲解可以专注于为什么与所以呢。'
        }
      ]
    },
    {
      no: 12,
      points: 8,
      type: '结果、讨论与定稿',
      intro: '结果报告，讨论解释；摘要必须与正文同强度。',
      parts: [
        {
          label: '12(1)',
          points: 4,
          kind: 'choice',
          prompt: '下列哪一句应放在讨论章而不是结果章？',
          options: [
            { text: 'A possible explanation is that students treat authorship as a signal of reliability.', correct: true },
            { text: 'The mean rating for teacher feedback was 4.2.', correct: false },
            { text: 'Table 1 summarises the three feedback sources.', correct: false },
            { text: 'Thirteen of the 42 respondents selected the lowest option.' }
          ],
          explain: 'A possible explanation 是解释，属于讨论。其余三句分别报告均值、指向图表、报告人数，都是结果章的写法。'
        },
        {
          label: '12(2)',
          points: 4,
          kind: 'fill',
          prompt: '按顺序写出讨论四步（中文，用顿号分隔）。',
          answer: '解释、比较、限制、启示',
          accept: ['解释、比较、限制、启示', '解释，比较，限制，启示', '解释 比较 限制 启示'],
          explain: '四步是解释机制、与文献比较、说明限制、给出启示。顺序可微调但不能跳步：缺解释读者不知意义，缺比较研究悬空，缺限制结论可疑，缺启示读者会问 so what。'
        }
      ]
    }
  ]
});
