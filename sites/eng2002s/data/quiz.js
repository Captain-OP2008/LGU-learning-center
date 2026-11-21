/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；每章 q1–q3 与 chXX.js 内嵌题一致
 * 字段：{ id, ch, kp, tier, type, difficulty, tags, stem, options, explain }
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '按课程安排，第 4–9 周的主题是什么？',
        options: [
          { text: '技术提案（technical proposals）', correct: true },
          { text: '技术报告与推荐报告' },
          { text: '简历与求职信' },
          { text: '模拟面试' }
        ],
        explain: '课程分三段：第 1–3 周技术交流与技术报告，第 4–9 周技术提案，第 10–15 周职业作品集与面试。提案段最长，因为它是 Assessment 1 的主体。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['assessment'],
        stem: 'Assessment 1（技术提案）在总评中占多少，如何拆分？',
        options: [
          { text: '50%，口头展示 25% + 书面提案 25%', correct: true },
          { text: '40%，求职信 15% + 面试 25%' },
          { text: '10%，只算课堂参与' },
          { text: '60%，全部来自书面报告' }
        ],
        explain: '大纲写明 A1 占 50%，口头展示与书面提案各 25%；A2 占 40%（求职信与简历 15%、面试 25%），参与度 10%。两项作业都不能偏废。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: 'ENG2002S 的先修课程是 ENG2001。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '大纲的 prerequisite 一栏写的是 ENG2001。这意味着课程默认你已经能写基本正确的英文段落，本课的重点转向体裁、论证与受众。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['reading'],
        stem: '第一周的三篇阅读（Pet Physics、The Physics of How Cats Drink、How Cats Lap Water）放在一起，主要用来做什么？',
        options: [
          { text: '比较科普文本与期刊论文在受众、证据和语言上的差异', correct: true },
          { text: '学习猫的解剖结构' },
          { text: '练习物理计算' },
          { text: '背诵三篇文章的结论' }
        ],
        explain: '三篇同题文本分属科普与期刊论文，课程用它们训练体裁分析：同一现象，受众不同，证据密度、术语解释与句子结构都会不同。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: 'Kinneavy 的交流三角形（communication triangle）用来分析什么关系？',
        options: [
          { text: '作者、读者与所谈论的现实之间的关系', correct: true },
          { text: '语法、词汇与发音之间的关系' },
          { text: '标题、段落与参考文献之间的关系' },
          { text: '分数、权重与绩点之间的关系' }
        ],
        explain: '三角形把交流拆成 writer、audience、reality 三个顶点，文本是三者互动的结果。写提案时，三个顶点分别对应你的立场、评审的知识背景与项目事实。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'multi', difficulty: 1, tags: ['method'],
        stem: '本站建议的章节学习流程包括下列哪些动作？（多选）',
        options: [
          { text: '先读「为什么」与导语，建立问题意识', correct: true },
          { text: '逐节读正文，遇到表格先看行列标题', correct: true },
          { text: '做完内嵌题与章末清单，再回看错题解释', correct: true },
          { text: '跳过所有例子，只背最后的要点列表' }
        ],
        explain: '例子承担了「把规则落到具体句子」的功能，跳过例子只背要点，遇到真实写作任务仍然不会用。读—练—回看解释是一个闭环。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'tf', difficulty: 1, tags: ['resource'],
        stem: '资料库中的文件是课程原始讲义、评分标准与阅读材料，可以直接用来对照作业要求。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '资料库按大纲、阅读、讲义、求职四组收录课程真实文件，文件名与课程目录一致。写作业前先读评分标准，比反复猜老师想要什么更有效。'
      },

      /* ---------------- ch01 受众、目的与体裁 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '技术交流失败最常见的原因是什么？',
        options: [
          { text: '作者假定读者与自己有相同的背景知识', correct: true },
          { text: '作者使用了太多专业术语' },
          { text: '文档太长' },
          { text: '没有插入足够多的图片' }
        ],
        explain: '术语、长度、配图都是表象；根因是作者没有站在读者位置估计「他知道什么、他要拿这份文档做什么」。受众分析先解决这个根因。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['audience'],
        stem: '受众分析最先要回答的三个问题是哪一组？',
        options: [
          { text: '谁读、读完要做什么、他已经知道什么', correct: true },
          { text: '写几页、用什么字体、放几张图' },
          { text: '用什么时态、主动还是被动、能否用第一人称' },
          { text: '交作业的截止日期、字数、查重率' }
        ],
        explain: '读者身份决定术语密度，读者要做的动作决定文档结构，读者已有知识决定哪些要解释。格式问题要在这三问之后才轮到。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'tf', difficulty: 1, tags: ['genre'],
        stem: '体裁（genre）主要由格式决定，与读者的期待和文本要完成的功能无关。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '这个说法是错的。体裁是「读者期待 + 交际功能 + 惯例形式」的组合；只模仿格式而不完成功能，写出来的只是空壳。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['genre'],
        stem: '语步（move）在体裁分析中指的是什么？',
        options: [
          { text: '体裁中承担特定交际功能的一个部分，如「陈述问题」「给出方案」', correct: true },
          { text: '段落之间的空格' },
          { text: '作者从初稿改到终稿的次数' },
          { text: '句子中主语和谓语的位置' }
        ],
        explain: '语步是功能单位，不是形式单位。同一语步可以用一段、一句或一张表实现；分析语步是为了看清「这类文本靠哪几步完成它的工作」。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['register'],
        stem: 'hedging（模糊限制）在技术写作中的主要作用是什么？',
        options: [
          { text: '让断言强度与证据强度匹配，避免过度承诺', correct: true },
          { text: '让文章看起来更谦虚，显得作者有礼貌' },
          { text: '增加字数，满足篇幅要求' },
          { text: '避免使用被动语态' }
        ],
        explain: 'hedging 是认识论工具：证据只支持「可能」，就写 may；证据支持「确定」，才写 shows。它不是客套，而是对结论强度的精确标注。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'multi', difficulty: 2, tags: ['purpose'],
        stem: '动笔前明确「目的」，需要回答下列哪些问题？（多选）',
        options: [
          { text: '读者读完应该知道什么', correct: true },
          { text: '读者读完应该做什么', correct: true },
          { text: '如果只能记住一句话，那句话是什么', correct: true },
          { text: '文档应该用几号字打印' }
        ],
        explain: '目的包含认知与行动两层：知道什么、做什么，再加一个「一句话主张」作为压缩测试。字号属于排版，不决定内容取舍。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['rewrite'],
        stem: '把一段面向专家的文字改写给新生看，最先应该调整什么？',
        options: [
          { text: '受众假设：补充术语解释、换掉未定义的缩写、给具体例子', correct: true },
          { text: '把字体调大' },
          { text: '把所有句子改成被动语态' },
          { text: '删掉全部数据，只留结论' }
        ],
        explain: '同题改写的第一步是重建受众模型：新生不知道哪些缩写、需要什么例子。数据要保留，但解释密度要提高；被动语态不是受众适配工具。'
      },

      /* ---------------- ch02 清晰、衔接与定义 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['cohesion'],
        stem: 'given-new 原则要求句子内部如何安排信息？',
        options: [
          { text: '已知信息放句首，新信息放句尾', correct: true },
          { text: '新信息放句首，已知信息放句尾' },
          { text: '所有新信息都放主语位置' },
          { text: '句子越短越好，不需要考虑顺序' }
        ],
        explain: '读者从已知走向未知最省力，所以旧信息作锚点、新信息落在句尾重音位置。下一句再把那个新信息当作已知，段落就自然向前推进。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['style'],
        stem: '名词化（nominalisation）过度使用会带来什么后果？',
        options: [
          { text: '动作被包装成抽象名词，句子变长且施动者消失', correct: true },
          { text: '句子变短，信息密度提高' },
          { text: '文章更口语化，读者更容易懂' },
          { text: '自动消除所有语法错误' }
        ],
        explain: '「make a decision」比「decide」长，「the implementation of the policy by the committee」把动作、施动者都埋进介词短语。名词化适合回指前文，不适合承担新动作。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'tf', difficulty: 1, tags: ['style'],
        stem: '在方法部分使用被动语态是合理的，因为读者关心的是「做了什么」，而不是「谁做的」。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '方法部分的焦点是程序与可复现性，施动者通常不重要或用「we」已在前文交代。但在需要明确责任或对比不同研究时，被动会掩盖关键信息。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['definition'],
        stem: '一个完整的技术定义通常包含哪三段？',
        options: [
          { text: '类别（term 属于什么）+ 区分特征 + 例子或用途', correct: true },
          { text: '历史 + 争议 + 参考文献' },
          { text: '同义词 + 反义词 + 词源' },
          { text: '公式 + 单位 + 有效数字' }
        ],
        explain: '先归入读者已知的类别，再给与同类其他成员不同的特征，最后用例子落地。缺少类别，读者无法定位；缺少区分特征，定义没有信息量。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['hedging'],
        stem: '实验只做了一次，样本量为 3，下列哪种表述最合适？',
        options: [
          { text: 'The results suggest that the coating may reduce glare.', correct: true },
          { text: 'The results prove that the coating reduces glare.' },
          { text: 'The results demonstrate beyond doubt that the coating eliminates glare.' },
          { text: 'The coating definitely reduces glare in all conditions.' }
        ],
        explain: '样本小、未重复，只能支持「可能」级别的结论。prove、beyond doubt、definitely 都把结论强度抬到证据之上，是审稿人最常挑的毛病。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'multi', difficulty: 2, tags: ['cohesion'],
        stem: '下列哪些属于常见的衔接手段？（多选）',
        options: [
          { text: '重复关键词或使用同义词链', correct: true },
          { text: '使用代词与指示词回指前文', correct: true },
          { text: '用连接词标明因果、转折、递进', correct: true },
          { text: '每段都用一个新的专有名词开头' }
        ],
        explain: '衔接靠「词汇重复、指代、连接词」三套工具协同。每段换新名词会切断线索，读者不知道新段落与上文什么关系。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '技术写作的三条底线是什么？',
        options: [
          { text: '准确、简洁、可核查', correct: true },
          { text: '华丽、含蓄、有文采' },
          { text: '越长越好、越难越好、越抽象越好' },
          { text: '押韵、对仗、排比' }
        ],
        explain: '准确指事实与数字无误，简洁指删掉不承担信息的词，可核查指给出处、单位、条件。三条都指向同一个目标：让读者能信任并使用这份文档。'
      },

      /* ---------------- ch03 进展报告与推荐报告 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['report'],
        stem: '进展报告（progress report）最核心的内容是什么？',
        options: [
          { text: '与计划的偏差、原因，以及下一步与需要的支持', correct: true },
          { text: '把做过的事情按时间顺序全部列出' },
          { text: '证明自己很忙' },
          { text: '只写好消息，坏消息留到期末' }
        ],
        explain: '进展报告的功能是让读者判断项目是否仍在轨道上，所以偏差、原因、纠偏动作比「做了什么」更重要。流水账没有决策价值。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['status'],
        stem: '任务已完成 80%，尚未验收，状态栏最合适的写法是？',
        options: [
          { text: 'In progress — 80% complete, acceptance test scheduled for 12 April', correct: true },
          { text: 'Completed' },
          { text: 'Delayed' },
          { text: 'Not started' }
        ],
        explain: '状态词要与完成度、下一节点一致。80% 且未验收既不是 completed，也不一定是 delayed；补上验收日期，读者才能判断风险。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'tf', difficulty: 2, tags: ['recommendation'],
        stem: '推荐报告可以先给结论，但必须交代比较标准与权重，否则结论不可复核。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '推荐报告的说服力来自「标准—权重—打分—结论」的链条。只给结论，读者无法判断你是否漏掉重要维度，也无法在不同意见间对话。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-5', tier: 3, type: 'mcq', difficulty: 3, tags: ['matrix'],
        stem: '某方案在权重 0.5 的维度得 3 分、权重 0.3 得 5 分、权重 0.2 得 4 分，加权总分是多少？',
        options: [
          { text: '3.8', correct: true },
          { text: '4.0' },
          { text: '12.0' },
          { text: '3.5' }
        ],
        explain: '0.5×3 + 0.3×5 + 0.2×4 = 1.5 + 1.5 + 0.8 = 3.8。加权前先确认权重之和为 1，否则分数不可比。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['modality'],
        stem: 'must、should、could 三者在建议中的区别是什么？',
        options: [
          { text: '强制程度依次降低：必须、应当、可以考虑', correct: true },
          { text: '礼貌程度依次降低' },
          { text: '三者完全同义，可以互换' },
          { text: 'must 用于过去时，should 用于将来时' }
        ],
        explain: '情态动词标记建议的约束力。must 意味着合规或安全要求，should 是推荐做法，could 是备选。混用会让读者低估风险或高估弹性。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'multi', difficulty: 2, tags: ['structure'],
        stem: '一份合格的推荐报告通常包含下列哪些部分？（多选）',
        options: [
          { text: '问题与决策背景', correct: true },
          { text: '比较标准与权重', correct: true },
          { text: '各方案数据与评分', correct: true },
          { text: '作者的私人偏好，无需理由' }
        ],
        explain: '推荐报告的结构是「背景—标准—证据—结论—实施建议」。私人偏好可以作为起点，但必须转成可讨论的标准，否则不是技术建议。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-8', tier: 2, type: 'mcq', difficulty: 2, tags: ['error'],
        stem: '下列哪种做法最可能让报告失去可信度？',
        options: [
          { text: '只写成功部分，隐去未达标的数据', correct: true },
          { text: '在附录放原始数据表' },
          { text: '给出测量不确定度' },
          { text: '说明样本量的限制' }
        ],
        explain: '选择性报告是可信度的头号杀手。读者一旦发现数据被挑过，所有结论都会被重新怀疑；主动交代限制反而增加信任。'
      },

      /* ---------------- ch04 技术提案 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '技术提案的本质是什么？',
        options: [
          { text: '用问题、方案与证据换取读者的资源或批准', correct: true },
          { text: '展示作者的专业词汇量' },
          { text: '把已经做完的事情写成报告' },
          { text: '介绍公司历史与组织架构' }
        ],
        explain: '提案是投资论证：读者付出预算、时间或权限，期待一个可验收的回报。所有章节都在回答「为什么值得投」。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['problem'],
        stem: '问题陈述（problem statement）要写清哪三件事？',
        options: [
          { text: '谁受影响、何时开始、损失有多大', correct: true },
          { text: '作者是谁、导师是谁、课程代码' },
          { text: '预算总额、供应商名称、付款方式' },
          { text: '文献综述、研究方法、参考文献' }
        ],
        explain: '问题要被量化成「谁的什么损失」，评审才能比较 urgency。只有「照明不好」不是问题陈述，「三栋宿舍走廊夜间照度不足 80 lux，学生投诉每月 12 起」才是。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'tf', difficulty: 2, tags: ['goal'],
        stem: '提案目标应当可验收，最好带数量、时间与判定方式。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '「改善照明」无法验收；「在 2025 年 9 月前把三栋走廊照度提升到 150 lux，用电不增加」可以。目标越可验收，评审越敢批预算。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-7', tier: 3, type: 'mcq', difficulty: 3, tags: ['budget'],
        stem: '改造投入 16,500 元，每年节省 20,600 元，静态回本期约为多久？',
        options: [
          { text: '约 9.6 个月', correct: true },
          { text: '约 0.8 个月' },
          { text: '约 2 年' },
          { text: '约 16 个月' }
        ],
        explain: '16,500 ÷ 20,600 ≈ 0.80 年，约 9.6 个月。回本期是提案最有说服力的单一数字，但必须说明电价、使用时长等假设。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['schedule'],
        stem: '实施计划里的里程碑（milestone）与普通任务的区别是什么？',
        options: [
          { text: '里程碑是可检查的交付成果或决策点，任务是为达成它所做的工作', correct: true },
          { text: '里程碑一定需要花钱，任务不需要' },
          { text: '里程碑只能有一个，任务可以有很多' },
          { text: '两者没有区别，只是叫法不同' }
        ],
        explain: '里程碑是「可以被验收的节点」，如「完成样机测试并签字」；任务是「做了什么」。评审看里程碑判断进度，看任务判断工作量。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-8', tier: 2, type: 'multi', difficulty: 2, tags: ['rubric'],
        stem: '书面提案评分标准中「内容与组织」通常关注下列哪些项？（多选）',
        options: [
          { text: '问题是否清楚且有必要解决', correct: true },
          { text: '目标是否明确、方案是否有证据', correct: true },
          { text: '受益者是否与问题对应、成本是否合理', correct: true },
          { text: '页眉是否使用了校徽' }
        ],
        explain: '内容与组织占 70%，关注问题—目标—方案—证据—收益—成本的闭环。格式与引用另占 10%，校徽不在评分项内。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-8', tier: 2, type: 'mcq', difficulty: 2, tags: ['call to action'],
        stem: '提案结尾的行动呼吁（call to action）应该怎么写？',
        options: [
          { text: '提出一个具体请求，并给出时间与下一步', correct: true },
          { text: '写「谢谢阅读」即可' },
          { text: '重复一遍全文摘要' },
          { text: '列出所有参考文献' }
        ],
        explain: '结尾要把论证转成决策：批准 16,500 元预算、在 4 月 15 日前启动一期改造。没有具体请求，评审读完不知道要做什么。'
      },

      /* ---------------- ch05 技术演讲 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '技术演讲与书面报告最根本的差别是什么？',
        options: [
          { text: '听众不能回读，信息必须按线性顺序一次讲清', correct: true },
          { text: '演讲不需要证据' },
          { text: '演讲可以省略所有数字' },
          { text: '演讲的句子必须更长' }
        ],
        explain: '读者可以跳读、回看，听众只能跟着时间轴走。因此演讲要更早给路线图、更频繁地重复主张，并把复杂内容拆成一页一主张。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['slides'],
        stem: '「一页一主张」原则要求每张幻灯片怎么做？',
        options: [
          { text: '标题写出这一页要证明的结论，页面只放支撑它的证据', correct: true },
          { text: '每页放满文字，供听众阅读' },
          { text: '每页只放一张装饰图' },
          { text: '标题统一写 Introduction、Method、Results' }
        ],
        explain: '断言式标题让听众即使走神也能抓住论证线。Results 这类标签只说明栏目，不传递结论；把结论写进标题，页面才有工作。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'tf', difficulty: 2, tags: ['slides'],
        stem: '幻灯片标题写「Results」比写「改造后用电下降 33%」更专业。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '这个说法是错的。断言式标题直接给结论，帮助听众跟上论证；「Results」只是目录标签，浪费了最醒目的一行。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['visual'],
        stem: '讲一张图表时，最有效的三步是什么？',
        options: [
          { text: '读轴与单位、指出趋势或异常、说明它对结论意味着什么', correct: true },
          { text: '先道歉图表做得不好，再快速翻过' },
          { text: '把图里每个数据点都念一遍' },
          { text: '只念标题，让听众自己看' }
        ],
        explain: '听众需要方向（轴是什么）、发现（趋势在哪）、意义（所以怎样）。三步之外的信息留在口头或备用页，不放在主图上。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['q&a'],
        stem: 'Q&amp;A 被问到不知道的问题时，最好的回应是？',
        options: [
          { text: '承认不知道，说明你会如何查证，并给出时间', correct: true },
          { text: '编一个听起来合理的答案' },
          { text: '反问对方「你觉得呢」' },
          { text: '沉默直到主持人换问题' }
        ],
        explain: '评审更在意可信度而非全知。承认边界并给出查证路径，显示的是研究者的诚实与方法意识；编答案一旦被追问就会崩。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'multi', difficulty: 2, tags: ['delivery'],
        stem: '下列哪些属于「声音与身体」的展示要素？（多选）',
        options: [
          { text: '语速与停顿', correct: true },
          { text: '音量与语调', correct: true },
          { text: '眼神接触与站姿', correct: true },
          { text: '参考文献的 APA 格式' }
        ],
        explain: '展示评分中 vocal and non-vocal communication 占 40%，包括语速、停顿、音量、语调、眼神、手势与站位。引用格式属于书面文档。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 3, type: 'mcq', difficulty: 3, tags: ['timing'],
        stem: '八分钟展示，比较合理的时间分配是哪一组？',
        options: [
          { text: '开场 1 分钟、主体 6 分钟、收尾 1 分钟', correct: true },
          { text: '开场 4 分钟、主体 2 分钟、收尾 2 分钟' },
          { text: '主体 8 分钟，不要开场与收尾' },
          { text: '开场 30 秒、主体 3 分钟、Q&amp;A 4 分钟' }
        ],
        explain: '开场要建立问题与路线图，主体按三到四个论点展开，收尾重申主张与请求。主体占约四分之三，才有足够证据；开场过长会挤压论证。'
      },

      /* ---------------- ch06 简历与求职信 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 2, type: 'mcq', difficulty: 2, tags: ['resume'],
        stem: '写简历前第一件事应该做什么？',
        options: [
          { text: '拆解招聘广告（JD），列出对方要的能力与关键词', correct: true },
          { text: '选一个漂亮的模板' },
          { text: '把所有经历都写上去，越多越好' },
          { text: '先写一封求职信' }
        ],
        explain: 'JD 是任务书：它告诉你对方按什么关键词筛选、按什么能力面试。先有 JD 清单，才有取舍标准；模板与排版是后面的事。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['bullet'],
        stem: '一条有力的经历句通常包含哪四要素？',
        options: [
          { text: '动作动词 + 对象 + 方法或工具 + 结果', correct: true },
          { text: '形容词 + 头衔 + 时间 + 公司名' },
          { text: '姓名 + 学号 + 专业 + 电话' },
          { text: '背景 + 困难 + 感想 + 展望' }
        ],
        explain: '「Built a Python meter-logging tool that cut data cleaning from 6 hours to 40 minutes」四要素齐全。读者由此知道你会什么、怎么用、带来什么。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'tf', difficulty: 2, tags: ['bullet'],
        stem: '「Responsible for the lighting project」是一个强有力的经历句开头。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '这个说法是错的。Responsible for 只说明职责范围，不说明你做了什么、做得怎样。换成动作动词（designed、audited、negotiated）并补结果，句子才有信息。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['cover letter'],
        stem: '求职信的四段通常按什么顺序展开？',
        options: [
          { text: '说明申请岗位与来源、匹配证据、为什么是这家机构、请求面试', correct: true },
          { text: '自我介绍、家庭背景、兴趣爱好、感谢',  },
          { text: '薪资要求、假期安排、到岗时间、联系方式' },
          { text: '公司历史、行业分析、宏观经济、结论' }
        ],
        explain: '第一段建立联系，第二段用两三个证据证明匹配，第三段说明对机构的了解，第四段给出具体请求。整封信一页，重点是匹配而非自传。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'multi', difficulty: 2, tags: ['quantify'],
        stem: '下列哪些属于把经历「量化」的合理方式？（多选）',
        options: [
          { text: '给出规模：3 栋楼、120 个测点、2 周', correct: true },
          { text: '给出变化：用电下降 33%、清洁时间从 6 小时降到 40 分钟', correct: true },
          { text: '给出频率：每周 2 次、共 14 次', correct: true },
          { text: '给出形容词：非常努力、极其负责' }
        ],
        explain: '量化是用规模、变化、频率、比例把「做了多少」变成可比较的数字。形容词无法验证，也无法让读者估计你的工作强度。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-8', tier: 3, type: 'mcq', difficulty: 3, tags: ['ats'],
        stem: '为了让简历通过申请人跟踪系统（ATS），最稳妥的做法是？',
        options: [
          { text: '用单栏、标准字体、可选中文本，避免把关键信息放进表格或图里', correct: true },
          { text: '把整份简历做成一张图片' },
          { text: '用三栏排版并插入图标表示技能' },
          { text: '把所有关键词写成白色小字放在页脚' }
        ],
        explain: 'ATS 解析的是文本流。表格、文本框、图片、图标都可能被读错或丢掉；白色隐藏文字会被判作弊。简洁单栏 + JD 原词最稳。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['keyword'],
        stem: '简历里的关键词应该怎么选？',
        options: [
          { text: '优先用 JD 中的原词，并与自己的真实经历对应', correct: true },
          { text: '尽量用生僻的高级词汇' },
          { text: '把能想到的词全部堆在技能栏' },
          { text: '只用同义词，避免重复' }
        ],
        explain: '筛选者（人和系统）按 JD 词汇匹配。用原词能过初筛，但每个词都要有经历支撑，否则面试一问就露。堆砌关键词反而降低可信度。'
      },

      /* ---------------- ch07 个人陈述、邮件与面试 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 3, type: 'mcq', difficulty: 3, tags: ['statement'],
        stem: '个人陈述与简历最重要的区别是什么？',
        options: [
          { text: '陈述要用一条主题把经历串成「为什么指向同一个方向」', correct: true },
          { text: '陈述必须比简历长' },
          { text: '陈述不需要事实，只需要感受' },
          { text: '陈述要列出所有课程成绩' }
        ],
        explain: '简历列事实，陈述解释事实之间的关系与意义。没有主题线，陈述只是简历的散文版，读者读完记不住你是谁。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 3, type: 'mcq', difficulty: 3, tags: ['narrative'],
        stem: '三段式（起点—转折—去向）中，篇幅与信息重心应该放在哪里？',
        options: [
          { text: '转折：你遇到什么落差、怎么诊断、怎么调整', correct: true },
          { text: '起点：从小学开始讲起' },
          { text: '去向：承诺改变世界' },
          { text: '三段平均分配，不设重心' }
        ],
        explain: '评审想看到判断力，而判断力在「预期落空—诊断—调整」里显现。起点只需交代背景，去向只需给可执行的下一步。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'tf', difficulty: 2, tags: ['email'],
        stem: '工作邮件的主题行写「Hello」是可以接受的，因为对方会打开看正文。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '这个说法是错的。主题行决定对方是否打开、何时处理。「Request: meter room access for 14–28 March」让人不打开就知道要做什么、急不急。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-6', tier: 3, type: 'mcq', difficulty: 3, tags: ['star'],
        stem: 'STAR 四段的比例大约是 1:1:4:2，其中占比最大的是哪一段？',
        options: [
          { text: 'Action：你具体做了什么', correct: true },
          { text: 'Situation：背景' },
          { text: 'Task：任务' },
          { text: 'Result：结果' }
        ],
        explain: '评审要判断的是「你如何工作」，所以动作要展开到三到四句：先查什么、和谁协作、改了什么。背景与任务各一句即可，结果一到两句带数字。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['interview'],
        stem: '行为面试题（behavioural question）主要考什么？',
        options: [
          { text: '你过去在具体情境中怎么做事，用来预测未来的工作方式', correct: true },
          { text: '你背了多少专业术语' },
          { text: '你的家庭背景' },
          { text: '你能否在压力下撒谎' }
        ],
        explain: '行为题假设「过去行为预测未来表现」，所以要用具体故事回答，而不是表态「我很擅长团队合作」。六个故事可覆盖八成行为题。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-8', tier: 2, type: 'multi', difficulty: 2, tags: ['interview'],
        stem: '面试反问环节，下列哪些问题比较合适？（多选）',
        options: [
          { text: '这个岗位前三个月的首要交付是什么', correct: true },
          { text: '团队目前最大的数据缺口在哪里', correct: true },
          { text: '上一任实习生做得最好的一件事是什么', correct: true },
          { text: '你们能给多少假期' }
        ],
        explain: '反问要显示你已经在思考如何把工作做好，所以问交付、缺口、团队经验。薪资与假期属于 HR 环节，技术面试问会显得关注点错位。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-8', tier: 2, type: 'mcq', difficulty: 2, tags: ['follow-up'],
        stem: '面试后的感谢邮件，最合适的发送时间与长度是？',
        options: [
          { text: '二十四小时内，三句话，提到一个具体话题', correct: true },
          { text: '一周后，附上三页自传' },
          { text: '不需要发，等对方通知' },
          { text: '当天深夜，群发给所有面试官' }
        ],
        explain: '二十四小时内对方还记得你；三句话足够表达感谢、重申一个匹配点、表示可补充材料。群发模板反而暴露你没有认真听。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
