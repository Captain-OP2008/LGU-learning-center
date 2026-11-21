/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；chXX 内嵌的 q1–q3 必须在这里存在
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '组织行为学通常在哪三个分析层次上展开研究？',
        options: [
          { text: '个体、群体、组织', correct: true },
          { text: '生理、认知、社会' },
          { text: '计划、组织、控制' },
          { text: '招聘、培训、薪酬' }
        ],
        explain: '组织行为学从个体（差异、动机、知觉）、群体（团队、沟通、冲突）到组织（结构、文化、变革）三个层次解释工作场所中的行为，三个层次相互嵌套而不是彼此替代。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: 'MARS 模型中的 S 指情境因素（situational factors），包括资源、时间、领导支持等外部条件。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'MARS 由动机（motivation）、能力（ability）、角色认知（role perceptions）与情境因素（situational factors）组成。前三个属于个体内部条件，S 指外部环境提供的支持或阻碍。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '「权变思维」在组织行为学中的核心含义是：',
        options: [
          { text: '同一做法在不同情境下可能产生不同效果，需要识别关键情境变量', correct: true },
          { text: '只要找到一种最佳做法，就可以在所有公司复制' },
          { text: '理论没有用处，只能依靠个人经验' },
          { text: '情境太复杂，所以不必区分条件' }
        ],
        explain: '权变（contingency）不是「随便都行」，而是「效果取决于条件」。它要求先识别关键变量（任务不确定性、文化、结构、员工成熟度），再判断某种做法在该条件下是否适用。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['evidence'],
        stem: '证据导向管理（evidence-based management）最符合下列哪种做法？',
        options: [
          { text: '把研究证据、组织自身数据与利益相关者的判断结合起来做决策', correct: true },
          { text: '只采纳资深管理者的个人经验' },
          { text: '只相信咨询公司的宣传案例' },
          { text: '只看竞争对手怎么做' }
        ],
        explain: '证据导向管理强调四类证据：最佳的研究证据、组织内部数据、利益相关者的价值与关切、专业经验。单一来源都容易出偏差，组合使用才能降低判断错误。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '关于组织行为学结论的使用，下列哪些说法正确？（多选）',
        options: [
          { text: '同一激励措施对不同员工可能效果不同', correct: true },
          { text: '研究结论通常有条件，需要看样本与情境', correct: true },
          { text: '从一种文化得出的结论不能直接套用到另一种文化', correct: true },
          { text: '只要统计显著，就可以忽略效应大小' }
        ],
        explain: '组织行为学的研究多为特定样本、特定情境下的概率性结论，使用时要注意效应大小、样本特征与文化边界；统计显著不等于管理上重要。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: 'MARS 模型中，A 代表「能力」，对应的英文单词是 ________。',
        answer: 'ability',
        explain: 'MARS = Motivation、Ability、Role perceptions、Situational factors。能力包括知识、技能与已形成的习惯，它决定「能不能做」，与动机决定的「愿不愿做」相互独立。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['textbook'],
        stem: '本站 MGT3250 课程使用的主教材是：',
        options: [
          { text: 'McShane &amp; Von Glinow《Organizational Behavior》第 9 版', correct: true },
          { text: 'Kotler &amp; Keller《Marketing Management》' },
          { text: 'Robbins《Management》' },
          { text: 'Kaplan &amp; Norton《The Balanced Scorecard》' }
        ],
        explain: '本课教材为 McShane 与 Von Glinow 的《Organizational Behavior》第 9 版（2021），全书 15 章，本站按主题重组为 8 个模块，章节对应关系见 ch00 的教材对照表。'
      },

      /* ---------------- ch01 个体差异 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['individual'],
        stem: '本章把个体差异分成三个层面，下列哪一组最准确？',
        options: [
          { text: '人格、价值观、自我概念', correct: true },
          { text: '身高、体重、年龄' },
          { text: '薪酬、职级、工龄' },
          { text: '部门、团队、岗位' }
        ],
        explain: '人格回答「我倾向于怎样行动」，价值观回答「我认为什么重要」，自我概念回答「我如何看待自己」。三者相对稳定，共同构成个体差异的核心，也解释同一制度下不同人的反应差异。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['bigfive'],
        stem: '大五人格中，与工作绩效相关最稳定、最普遍的是：',
        options: [
          { text: '尽责性（conscientiousness）', correct: true },
          { text: '开放性（openness）' },
          { text: '外倾性（extraversion）' },
          { text: '宜人性（agreeableness）' }
        ],
        explain: '尽责性涉及自律、条理、坚持与成就动机，对多数岗位的绩效都有稳定正相关。外倾性更能预测社交型岗位的表现，开放性与创造性岗位相关，宜人性与助人行为相关，但都不如尽责性普遍。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'tf', difficulty: 1, tags: ['mbti'],
        stem: 'MBTI 的四个维度与工作绩效之间存在稳定而强烈的相关，因此适合作为招聘筛选的主要依据。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'MBTI 的重测信度与预测效度都受到质疑，多数独立研究未发现类型与绩效的稳定强相关。它可以作为团队沟通与自我反思的语言，但不适合作为招聘筛选或晋升的主要依据。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['values'],
        stem: '在 Schwartz 价值观理论中，下列哪一组属于「自我超越」（self-transcendence）？',
        options: [
          { text: '普世主义与仁爱', correct: true },
          { text: '权力与成就' },
          { text: '享乐主义与刺激' },
          { text: '安全与 conformity' }
        ],
        explain: 'Schwartz 用两个维度划出四组价值：自我超越（普世主义、仁爱）、自我增强（权力、成就）、保守（安全、传统、遵从）、开放（自主、刺激、享乐）。自我超越强调超越个人利益、关心他人与自然。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'multi', difficulty: 2, tags: ['ethics'],
        stem: 'Rest 的道德四环节模型包括下列哪些成分？（多选）',
        options: [
          { text: '道德敏感：识别情境中存在道德问题', correct: true },
          { text: '道德判断：判断哪种做法在道德上更可取', correct: true },
          { text: '道德动机：把道德判断置于其他动机之上', correct: true },
          { text: '道德宣传：对外展示组织的道德口号' }
        ],
        explain: 'Rest 的四环节是敏感、判断、动机、行动（实施）。四者缺一不可：看不到问题、判断不出对错、没有动机坚持、或缺乏执行能力，都会导致「知道对却做不到」。道德宣传不在模型之内。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 1, type: 'fill', difficulty: 1, tags: ['self'],
        stem: '个体对自己能否完成某一具体任务的信念，称为自我________。',
        answer: '效能',
        explain: '自我效能（self-efficacy）针对具体任务，来源包括掌握经验、替代经验、社会说服与生理唤醒。它与自尊不同：自尊是整体自我评价，自我效能是「这件事我能不能做成」的判断。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['selfmonitor'],
        stem: '高自我监控（self-monitoring）者最典型的行为特征是：',
        options: [
          { text: '会根据情境与他人反应调整自己的表达方式', correct: true },
          { text: '在任何场合都坚持同一种表达方式' },
          { text: '完全不关注他人对自己的印象' },
          { text: '只依据自己内心感受行动，不看场合' }
        ],
        explain: '高自我监控者对社会线索敏感，善于调整自我呈现，因而在需要社交适应与跨界协调的岗位上更有优势；低自我监控者言行一致、表里如一，在需要稳定立场的岗位上更可信。两者各有代价。'
      },

      /* ---------------- ch02 社会知觉 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['perception'],
        stem: '社会知觉的三道「过滤器」通常指：',
        options: [
          { text: '选择、组织、解释', correct: true },
          { text: '视觉、听觉、触觉' },
          { text: '记忆、遗忘、回忆' },
          { text: '招聘、培训、考核' }
        ],
        explain: '人无法处理全部信息，先选择性注意（选择），再用已有框架归类（组织），最后赋予意义（解释）。三道过滤器都可能出错：只看想看的、按刻板印象归类、把模糊行为解释成敌意。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['attribution'],
        stem: '按 Kelley 的归因三线索，某员工在多数任务上都表现不佳（低区别性）、其他同事表现正常（低共识）、且他一贯如此（高一致性），最合理的归因是：',
        options: [
          { text: '内部归因：问题在该员工自身', correct: true },
          { text: '外部归因：问题在任务或环境' },
          { text: '情境归因：这次只是偶然' },
          { text: '无法归因，信息不足' }
        ],
        explain: 'Kelley 的共变模型：高一致性、低区别性、低共识指向行为者本人；高 consensus、高 distinctiveness、低 consistency 才更多指向外部情境。三线索组合起来，才能避免单一印象导致的误判。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'tf', difficulty: 1, tags: ['stereotype'],
        stem: '刻板印象一定都是负面的，正面印象不构成刻板印象。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '刻板印象是对一类人的简化概括，既可能是负面的，也可能是「正面」的（如「某类人数学好」）。正面刻板印象同样会遮蔽个体差异，并可能通过期望与行为形成自我实现预言。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['emotion'],
        stem: '情绪劳动中的「深层扮演」（deep acting）指：',
        options: [
          { text: '调整内心感受，使自己真正体验到应当表达的情绪', correct: true },
          { text: '只改变外在表情，不改变内心感受' },
          { text: '压抑所有情绪，不做任何表达' },
          { text: '把情绪发泄到同事身上' }
        ],
        explain: '表面扮演（surface acting）只改表情与语气，内心不变，长期易导致情绪耗竭；深层扮演通过重新解读情境、共情等方式改变内心感受，消耗较小，也更可能让对方感到真诚。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'multi', difficulty: 2, tags: ['ei'],
        stem: '按 Goleman 的框架，情绪智力包括下列哪些维度？（多选）',
        options: [
          { text: '自我觉察', correct: true },
          { text: '自我管理', correct: true },
          { text: '社会觉察', correct: true },
          { text: '关系管理', correct: true }
        ],
        explain: '四维度是自我觉察、自我管理、社会觉察、关系管理。它们的顺序有含义：先能识别自己的情绪，才能管理；先能读懂他人，才能处理关系。情绪智力不等于「脾气好」，也不等于智商。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'fill', difficulty: 2, tags: ['attitude'],
        stem: 'EVLN 模型中，员工主动且建设性地表达不满、试图改善现状的反应是________。',
        answer: '建言',
        explain: 'EVLN 指退出（exit）、建言（voice）、忠诚（loyalty）、忽视（neglect）。建言是主动且建设性的；忠诚是被动但建设性的；忽视是被动且破坏性的；退出是主动但破坏性的。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['stress'],
        stem: '塞利（Selye）的一般适应综合征（GAS）三阶段顺序是：',
        options: [
          { text: '警觉—抵抗—衰竭', correct: true },
          { text: '抵抗—警觉—恢复' },
          { text: '衰竭—抵抗—警觉' },
          { text: '警觉—恢复—抵抗' }
        ],
        explain: 'GAS 描述身体对持续压力的反应：警觉阶段动员资源，抵抗阶段维持应对，衰竭阶段资源耗尽、健康受损。它解释了为什么长期高压比短期高压更危险——问题出在抵抗阶段的持续消耗。'
      },

      /* ---------------- ch03 动机 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['motivation'],
        stem: '动机通常被拆成三个要素，它们是：',
        options: [
          { text: '方向、强度、持续性', correct: true },
          { text: '工资、奖金、福利' },
          { text: '能力、机会、绩效' },
          { text: '目标、反馈、评估' }
        ],
        explain: '方向指「选择做什么」，强度指「投入多少努力」，持续性指「坚持多久」。三者可以分离：方向对但强度不足，或强度高但遇挫即停，都不能带来稳定绩效。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['needs'],
        stem: '奥尔德弗 ERG 理论中的 R 指：',
        options: [
          { text: '关系需要（relatedness）', correct: true },
          { text: '尊重需要（respect）' },
          { text: '奖励需要（reward）' },
          { text: '责任需要（responsibility）' }
        ],
        explain: 'ERG = 生存（existence）、关系（relatedness）、成长（growth）。它把马斯洛的五层压缩为三层，并强调「受挫—回归」：高层需要长期无法满足时，人会退回去追求低层需要。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'tf', difficulty: 2, tags: ['expectancy'],
        stem: '在期望理论中，即使员工相信「努力能带来好绩效」，只要「好绩效不会带来想要的回报」，动机仍可能很低。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '动机 = 期望（E→P）× 工具性（P→O）× 效价（V）。三者是乘积关系，任何一项接近零，整体动机都接近零。这解释了「考核很严但奖励无关痛痒」时，员工为什么不再努力。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['equity'],
        stem: '按公平理论，当员工感知自己的「投入/产出」比低于参照对象时，最典型的反应是：',
        options: [
          { text: '减少投入，或要求提高产出（如加薪）', correct: true },
          { text: '立即提高工作绩效且不要求任何回报' },
          { text: '完全感知不到不公平' },
          { text: '自动把参照对象视为更高等级' }
        ],
        explain: '公平理论预测员工会通过改变投入、改变产出、改变参照对象或退出，来恢复感知公平。管理者若只调整薪酬而不处理参照对象与信息透明，公平感未必回升。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'multi', difficulty: 2, tags: ['goals'],
        stem: '有效的目标设置通常具备下列哪些特征？（多选）',
        options: [
          { text: '目标具体、可衡量', correct: true },
          { text: '目标有难度但通过努力可以达到', correct: true },
          { text: '过程中有反馈，能知道进展', correct: true },
          { text: '目标越多越好，不必排序' }
        ],
        explain: '具体、有难度、有反馈、被承诺，是目标设置发挥作用的条件。目标过多会分散注意力、引发优先级冲突；缺少反馈则无法调整策略。目标还要与能力、资源匹配，否则会带来压力与造假。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'fill', difficulty: 2, tags: ['jcm'],
        stem: '工作特征模型中，让员工能从头到尾完成一件完整产品的特征，称为任务________性。',
        answer: '完整',
        explain: '任务完整性（task identity）指工作是否包含完整的、可辨认的成果。它与技能多样性、任务重要性共同影响「体验到工作的意义」，进而影响内在动机、绩效与满意度。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['justice'],
        stem: '程序公平（procedural justice）主要关注：',
        options: [
          { text: '决策过程是否一致、无偏、可申诉、代表各方意见', correct: true },
          { text: '最终分到的奖金是否一样多' },
          { text: '领导说话是否客气' },
          { text: '公司是否盈利' }
        ],
        explain: '程序公平看「过程」，分配公平看「结果」，互动公平看「对待方式」，信息公平看「解释是否充分」。程序公平感高时，即使结果不理想，员工也更容易接受。'
      },

      /* ---------------- ch04 决策与创造力 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['decision'],
        stem: '「有限理性」（bounded rationality）的核心主张是：',
        options: [
          { text: '决策者受认知与信息限制，通常追求「满意」而非「最优」', correct: true },
          { text: '决策者总能掌握全部信息并算出最优解' },
          { text: '决策完全由情绪决定，与信息无关' },
          { text: '只要经验足够，就不需要任何分析' }
        ],
        explain: '西蒙指出，人的信息处理能力、时间与注意力都有限，因此会用启发式与「够好就行」的标准（satisficing）。有限理性不是「不理性」，而是在约束下的一种合理适应。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['bias'],
        stem: '「可得性偏差」（availability bias）指的是：',
        options: [
          { text: '依据容易想起的例子的多少来判断事件发生的概率', correct: true },
          { text: '依据最初接触的数字调整估计，调整不足' },
          { text: '只寻找支持自己观点的信息' },
          { text: '因为已经投入很多而继续追加投入' }
        ],
        explain: '可得性偏差来自记忆的易提取性：空难、裁员等事件因媒体反复报道而显得更常见，实际概率可能很低。它会让风险评估系统性地偏离基准率。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'tf', difficulty: 1, tags: ['escalation'],
        stem: '承诺升级（escalation of commitment）指决策者因为已经投入了大量资源，而继续向失败项目追加投入。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '承诺升级与沉没成本谬误有关：人把「已经投入」当成继续投入的理由，而不是看未来的边际收益。制度上可以用「独立复核」「预先设定退出条件」「更换决策者」来降低它。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['intuition'],
        stem: '在下列哪种条件下，专家直觉最值得信赖？',
        options: [
          { text: '领域有规律可循，且决策者能获得及时、明确的反馈', correct: true },
          { text: '环境高度随机，结果无法验证' },
          { text: '决策者只有一次经验，且从未得到反馈' },
          { text: '问题涉及大量陌生变量且没有先例' }
        ],
        explain: '卡尼曼与克莱因的共识是：直觉的可信度取决于「环境是否有可学习的规律」与「是否有足够快的反馈」。在低效度环境里，自信的直觉与随机猜测差别不大。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'multi', difficulty: 2, tags: ['creativity'],
        stem: '下列哪些做法有助于提升团队的创造力？（多选）',
        options: [
          { text: '发散与收敛交替进行，而不是一开始就评判', correct: true },
          { text: '引入背景多样的成员与外部信息', correct: true },
          { text: '允许试错，并为失败提供安全边界', correct: true },
          { text: '只奖励服从与按流程执行' }
        ],
        explain: '创造力需要发散（生成多种可能）与收敛（筛选可行方案）两个阶段，过早评判会扼杀想法；多样性带来认知冲突与新组合；试错安全影响人是否愿意提出不成熟的想法。只奖励服从会压制探索。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'fill', difficulty: 2, tags: ['group'],
        stem: '群体讨论后，成员的初始倾向被强化、决策变得比个人更极端，这一现象称为群体________。',
        answer: '极化',
        explain: '群体极化（group polarization）不是「群体一定更冒险」，而是「群体讨论会把初始倾向放大」：偏保守的更保守，偏冒险的更冒险。它常与群体思维、信息级联一起出现。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['participation'],
        stem: '员工参与决策最稳定、最直接的收益通常是：',
        options: [
          { text: '提高对决策的接受度与执行承诺', correct: true },
          { text: '保证决策质量一定更高' },
          { text: '缩短所有决策的时间' },
          { text: '消除组织中的所有冲突' }
        ],
        explain: '参与的主要收益在「接受度」与「承诺」，而不必然在决策质量：参与者的信息可能有限，过程也可能更慢。在决策质量重要且员工缺乏相关信息时，参与未必优于专家判断。'
      },

      /* ---------------- ch05 团队与沟通 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['team'],
        stem: '团队与一般群体最关键的差别是：',
        options: [
          { text: '成员之间存在相互依赖、共同目标与相互问责', correct: true },
          { text: '团队成员人数一定更多' },
          { text: '团队一定有正式领导' },
          { text: '团队成员一定在同一间办公室' }
        ],
        explain: '团队的核心是互依与共同产出：一个人的成果依赖另一个人的输入，且成员对整体结果共同负责。只共享信息、各自完成工作的群体，不必成为团队。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['development'],
        stem: 'Tuckman 的团队发展阶段顺序是：',
        options: [
          { text: '形成—震荡—规范—执行—解散', correct: true },
          { text: '形成—规范—震荡—执行—解散' },
          { text: '震荡—形成—执行—规范—解散' },
          { text: '规范—形成—震荡—解散—执行' }
        ],
        explain: '五个阶段是 forming、storming、norming、performing、adjourning。震荡期出现冲突是正常的，跳过它往往意味着分歧被压住，后面会以更难处理的方式出现。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'tf', difficulty: 1, tags: ['cohesion'],
        stem: '团队凝聚力越强，绩效一定越高。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '凝聚力影响成员留在团队与相互配合的意愿，但绩效还取决于绩效规范：高凝聚力配高绩效规范最好，高凝聚力配低绩效规范会一致地低效。所以凝聚力是「放大器」，不是「保证」。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['loafing'],
        stem: '社会惰化（social loafing）最可能发生在下列哪种情形？',
        options: [
          { text: '个人贡献无法被识别，团队规模较大', correct: true },
          { text: '任务被拆到每个人头上，成果可单独衡量' },
          { text: '团队规模很小且成员彼此熟悉' },
          { text: '任务本身具有挑战性且个人高度投入' }
        ],
        explain: '惰化源于「责任分散」与「贡献不可识别」：人越多、越难区分谁做了多少，个体越容易降低努力。对策包括缩小团队、明确分工、公开贡献、让任务本身有内在吸引力。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'multi', difficulty: 2, tags: ['safety'],
        stem: '心理安全（psychological safety）高的团队，通常会出现下列哪些行为？（多选）',
        options: [
          { text: '成员敢于承认自己不知道或犯了错', correct: true },
          { text: '成员愿意提出与多数人不同的意见', correct: true },
          { text: '成员在遇到困难时主动求助', correct: true },
          { text: '成员认为只有从不犯错的人才会被尊重' }
        ],
        explain: '心理安全指「在团队中承担人际风险是安全的」：可以提问、承认错误、提出异议，而不会被羞辱或惩罚。它与「高标准」并不矛盾——高绩效团队往往同时具备高标准与高心理安全。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'fill', difficulty: 1, tags: ['communication'],
        stem: '按渠道丰富度（media richness）排序，丰富度最高的沟通方式是________。',
        answer: '面对面',
        explain: '面对面能同时传递语言、语气、表情与即时反馈，丰富度最高；电话次之；邮件、文档等书面渠道更「瘦」，适合传递明确、可存档的信息，不适合处理模糊与冲突。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['culture'],
        stem: '在「高语境文化」（high-context culture）中，沟通的意义主要：',
        options: [
          { text: '依赖情境、关系与非语言线索，而不只在字面', correct: true },
          { text: '完全由字面文字决定，越直接越好' },
          { text: '只通过合同条款传达' },
          { text: '不需要任何共享背景' }
        ],
        explain: '高语境文化（如中国、日本）中，很多信息藏在关系、场合与「话外音」里；低语境文化（如德国、美国）更依赖明确的语言表达。跨文化沟通的误判，常来自把对方的委婉当成同意。'
      },

      /* ---------------- ch06 权力、影响与谈判 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['power'],
        stem: '因为「他懂别人不懂的东西，大家遇到专业问题都来请教他」而形成的权力，属于：',
        options: [
          { text: '专家权力（expert power）', correct: true },
          { text: '法定权力（legitimate power）' },
          { text: '奖赏权力（reward power）' },
          { text: '强制权力（coercive power）' }
        ],
        explain: '专家权力来自知识、判断与经验，别人因「不确定」而依赖你。它与职位无关，但也不稳定：知识过时、拒绝分享或被系统替代时，专家权力会迅速衰减。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['dependency'],
        stem: '按依赖理论，A 对 B 的权力大小主要取决于：',
        options: [
          { text: 'B 对 A 掌握资源的需要程度，以及 B 是否有替代来源', correct: true },
          { text: 'A 的年龄与工龄' },
          { text: 'A 在组织架构图中的层级' },
          { text: 'A 与 B 的私人关系好坏' }
        ],
        explain: '权力来自依赖：资源越重要、替代越少，依赖越强。这解释了为什么职位不高但掌握关键技能或信息的人有实际影响力，也解释了为什么「把知识写成文档」会削弱个人的不可替代性。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'tf', difficulty: 1, tags: ['influence'],
        stem: '在九种影响策略中，「施压」最容易带来对方发自内心的承诺。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '施压（pressure）通常只能换来短期服从，且容易引发抵抗与报复。理性说服、咨询与鼓舞性诉求更容易带来承诺；交换与结盟能推动决定，但承诺度较低。策略要匹配关系阶段与对方关切。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['politics'],
        stem: '组织政治行为最容易在下列哪种条件下增多？',
        options: [
          { text: '资源稀缺、目标模糊、决策规则不透明', correct: true },
          { text: '资源充足、目标清晰、规则公开' },
          { text: '组织规模很小且成员彼此熟悉' },
          { text: '绩效可以独立验证且奖惩分明' }
        ],
        explain: '政治行为是制度空隙中的理性选择：当资源不够分、目标说不清、规则不透明时，人只能通过非正式渠道争取。降低政治行为要靠压缩空隙——公开分配规则、明确决策标准、让绩效可验证。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'multi', difficulty: 2, tags: ['conflict'],
        stem: '下列哪些属于「功能性冲突」的特征？（多选）',
        options: [
          { text: '分歧集中在任务与方案上', correct: true },
          { text: '允许用证据与数据说话', correct: true },
          { text: '以解决问题而不是压倒对方为目标', correct: true },
          { text: '通过人身攻击迫使对方让步' }
        ],
        explain: '功能性冲突把分歧控制在任务层面，保留关系与信息通道；关系冲突针对人，几乎总是破坏性的。管理者可以主动设计「任务冲突」——指定反方、公开征集异议——但要阻止它滑向人身攻击。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'fill', difficulty: 2, tags: ['style'],
        stem: '在 Thomas-Kilmann 五种冲突处理风格中，高坚持己见、低合作性的风格是________。',
        answer: '竞争',
        explain: '竞争（competing）适合紧急、原则性或必须快速拍板的场景，但滥用会压住异议、损伤关系。它与合作、妥协、回避、迁就并列，没有绝对优劣，关键看情境与关系目标。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['negotiation'],
        stem: '谈判中的 BATNA 指：',
        options: [
          { text: '谈不成时的最佳替代方案', correct: true },
          { text: '双方可能成交的价格区间' },
          { text: '第一次报价的锚点' },
          { text: '对方的最低接受条件' }
        ],
        explain: 'BATNA（best alternative to a negotiated agreement）决定你的保留价与底气：BATNA 越强，越敢离开桌子。ZOPA 是双方保留价重叠的区间，两者常被混淆。'
      },

      /* ---------------- ch07 领导力、结构与变革 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['leadership'],
        stem: '费德勒权变模型用哪三个变量判断情境的有利程度？',
        options: [
          { text: '领导者—成员关系、任务结构、职位权力', correct: true },
          { text: '年龄、学历、工龄' },
          { text: '动机、能力、角色认知' },
          { text: '工资、奖金、福利' }
        ],
        explain: '三者共同决定领导者可用的影响力：关系好、任务清楚、职位权力强时情境最有利。费德勒认为领导风格相对固定，因此要「把领导者放到匹配的情境」，而不是要求他改变风格。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['pathgoal'],
        stem: '按路径—目标理论，当下属的任务高度模糊、不知道该怎么做时，领导者宜采用：',
        options: [
          { text: '指导型（directive）', correct: true },
          { text: '支持型（supportive）' },
          { text: '参与型（participative）' },
          { text: '成就型（achievement-oriented）' }
        ],
        explain: '路径—目标理论认为领导者的任务是清除通往目标的障碍：任务模糊时需要指导来降低不确定性；任务枯燥或压力大时支持型更合适；下属需要自主时用参与型。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'tf', difficulty: 1, tags: ['transform'],
        stem: '变革型领导与交易型领导是互斥的：一个领导者只能属于其中一种。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '两者是叠加关系：交易型建立基本的「目标—奖励—纠偏」结构，变革型再通过愿景、示范、智力激发与个性化关怀提升承诺。缺少交易结构，愿景容易变成空话；只有交易结构，则难以推动方向性变革。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['structure'],
        stem: '矩阵结构最主要的代价是：',
        options: [
          { text: '双线汇报导致权责冲突与决策变慢', correct: true },
          { text: '专业能力无法积累' },
          { text: '资源无法共享' },
          { text: '对外部环境变化反应过快' }
        ],
        explain: '矩阵同时保留职能与项目两条线，优势是兼顾专业深度与项目响应，代价是双线权力：谁定目标、谁评绩效容易冲突。它需要写清权责边界、设置升级通道，并让双方管理者具备谈判能力。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'multi', difficulty: 2, tags: ['culture'],
        stem: '沙因（Schein）的文化三层模型包括下列哪些层次？（多选）',
        options: [
          { text: '人造物（artifacts）', correct: true },
          { text: '信奉的价值观（espoused values）', correct: true },
          { text: '基本假设（basic assumptions）', correct: true },
          { text: '季度财务指标' }
        ],
        explain: '三层从外到内是人造物、信奉价值观、基本假设。三者不一致时，真正驱动行为的是最底层的基本假设——例如「出错会被追责」会压过墙上写的「坦诚沟通」。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-7', tier: 1, type: 'fill', difficulty: 1, tags: ['change'],
        stem: '勒温的三步变革模型是：解冻—改变—________。',
        answer: '再冻结',
        explain: '再冻结指用制度、奖励、文化与流程把新做法固定下来。最常见的失败是只做「改变」：培训结束、系统上线，但考核与奖惩没变，几个月后行为回到原样。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['actionresearch'],
        stem: '行动研究（action research）与「专家开药方」式变革最关键的区别是：',
        options: [
          { text: '被变革的成员参与诊断与方案设计', correct: true },
          { text: '完全不需要收集数据' },
          { text: '一定能在短期内完成' },
          { text: '只由外部顾问决定所有方案' }
        ],
        explain: '行动研究的循环是诊断—反馈—共同规划—实施—评估，核心是把成员变成设计者：参与降低阻力，也把一线知识带入方案。代价是周期长、对引导者要求高。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
