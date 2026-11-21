/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；chXX-q1…q3 与各章内嵌 quiz 的 qid 一致。
 * 字段：{ id, ch, kp, tier, type:'mcq'|'tf', difficulty, tags, stem,
 *        options:[{ text, correct:true? }], explain }
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: 'ENG1002 的三个 Module 依次训练的核心能力是什么？',
        options: [
          { text: '正式客观与提问 → 精确清晰与引用 → 谨慎诚实与避免谬误', correct: true },
          { text: '听力 → 口语 → 翻译' },
          { text: '语法 → 词汇 → 拼写' },
          { text: '文学分析 → 创意写作 → 戏剧改编' }
        ],
        explain: '课程按 Module I（Formal and impersonal / Posing questions）、Module II（Precise and clear / Citing sources）、Module III（Honest and cautious / Avoiding logical fallacies）推进，最后落在论证与口语输出上。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '个人演示（individual presentation）占总评的比重是多少？',
        options: [
          { text: '25%', correct: true },
          { text: '10%' },
          { text: '40%' },
          { text: '60%' }
        ],
        explain: '课程说明写明个人演示占 25%，其中内容与视觉各占 25% 的评分权重，另有 1 分钟 Q&amp;A。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '因果分析论文（cause-effect essay）对来源的最低要求是？',
        options: [
          { text: '至少 3 个来源，含 3 处直接引用与 3 处转述', correct: true },
          { text: '至少 10 个来源，全部直接引用' },
          { text: '不需要来源，只写个人经历' },
          { text: '只需 1 个网页来源' }
        ],
        explain: '作业说明要求至少 3 个来源，并包含 3 处 quotation 与 3 处 paraphrase，全部用 APA 标注。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '论证论文（argument essay）的字数要求是？',
        options: [
          { text: '900–1200 词', correct: true },
          { text: '300–500 词' },
          { text: '1500–2000 词' },
          { text: '不设下限' }
        ],
        explain: 'Argument essay 要求 900–1200 词、至少 4 个高质量英文来源、至少 1 处直接引用与 3 处转述，并遵守 APA。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '因果分析论文安排在第 7 周（Week 7）提交。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '课程日程把 cause-effect essay 放在 Week 7（3 月 13/14 日），个人演示在 Week 8–9，论证论文在 Week 15。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '本课程使用的引用格式是？',
        options: [
          { text: 'APA 第 7 版', correct: true },
          { text: 'MLA 第 9 版' },
          { text: 'Chicago 注释体' },
          { text: 'IEEE 数字编号' }
        ],
        explain: '课程统一要求 APA 7：文内作者—年份，文末按姓氏字母序排列参考文献。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '课程把「学术写作」拆成可训练的能力，下列哪一项不属于本课程的四个主线？',
        options: [
          { text: '文学修辞与诗歌韵律', correct: true },
          { text: '正式与客观（formal and impersonal）' },
          { text: '精确与简洁（precise and concise）' },
          { text: '诚实与谨慎（honest and cautious）' }
        ],
        explain: '课程的四条主线是 formal/impersonal、precise/clear、citing sources、honest/cautious，文学修辞不在其中。'
      },

      /* ---------------- ch01 写作过程与文章结构 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['process'],
        stem: '下列哪一项最接近本章推荐的写作流程顺序？',
        options: [
          { text: '理解题目 → 构思 → 提纲 → 起草 → 修改', correct: true },
          { text: '起草 → 理解题目 → 修改 → 提纲' },
          { text: '修改 → 提纲 → 起草 → 构思' },
          { text: '提纲 → 修改 → 构思 → 起草' }
        ],
        explain: '先弄清题目要求与读者，再发散构思、收敛成提纲，然后一次成型起草，最后分层修改；顺序颠倒会让修改变成重写。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['thesis'],
        stem: '好的 thesis statement 通常具备哪个特征？',
        options: [
          { text: '具体、可争议，并能在规定篇幅内被证据支持', correct: true },
          { text: '越宽泛越好，方便展开' },
          { text: '必须是众所周知的事实' },
          { text: '只能放在结论段' }
        ],
        explain: '论文陈述要窄到能在一篇里证明，又要有人可能不同意，否则就没有论证空间；它通常出现在引言末尾。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['paragraph'],
        stem: '段落主题句（topic sentence）的主要作用是？',
        options: [
          { text: '预告本段要证明的分论点，让读者知道这段为何存在', correct: true },
          { text: '提供本段所有证据的原文' },
          { text: '重复上一段的最后一句' },
          { text: '引出下一章的内容' }
        ],
        explain: '主题句是段落的微型主张，后面的证据与解释都为它服务；读者扫一遍主题句就能还原全文骨架。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['structure'],
        stem: '结论段最不应该出现的内容是？',
        options: [
          { text: '一个此前从未出现过的新论点或新证据', correct: true },
          { text: '重申论文主张' },
          { text: '指出研究的局限' },
          { text: '给出进一步研究或实践的建议' }
        ],
        explain: '结论的任务是收束与升华，不是开启新战场；新论点会迫使读者重新评估全文，通常说明它本该出现在主体里。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'tf', difficulty: 2, tags: ['revision'],
        stem: '修改时应先处理整体结构（论点、段落顺序、证据是否够），再润色句子与用词。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '结构改动会让句子层面的润色白费，所以修改按「宏观—中观—微观」三层推进：先论点与段落，再句子，最后标点。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['outline'],
        stem: '写提纲（outline）最直接的好处是？',
        options: [
          { text: '在动笔前发现论证缺口与重复，节省返工时间', correct: true },
          { text: '让文章自动达到字数要求' },
          { text: '可以替代参考文献' },
          { text: '保证不会出现语法错误' }
        ],
        explain: '提纲是论证的骨架图：哪一段证明什么、证据放在哪里、段落之间如何过渡。缺口在提纲阶段暴露，代价最小。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['introduction'],
        stem: '学术论文引言常见的四步结构是？',
        options: [
          { text: '钩子 → 背景 → 问题或缺口 → 论文陈述', correct: true },
          { text: '结论 → 证据 → 方法 → 致谢' },
          { text: '定义 → 例子 → 反例 → 参考文献' },
          { text: '摘要 → 目录 → 正文 → 附录' }
        ],
        explain: '引言从吸引注意开始，交代背景，指出已有研究的缺口，最后给出本文主张；四步顺序让读者自然接受你的问题。'
      },

      /* ---------------- ch02 学术语体 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['register'],
        stem: '下列哪一句最符合学术语体？',
        options: [
          { text: 'The results indicate that the policy reduced waste by 38%.', correct: true },
          { text: 'We found out the policy really cut a lot of waste.' },
          { text: 'The policy? It works great, you know.' },
          { text: 'Waste went down big time after the policy.' }
        ],
        explain: '学术语体倾向名词化主语、精确动词与具体数字；find out、a lot of、you know、big time 都属于口语表达。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['formality'],
        stem: '学术写作中，缩写形式 don’t 应写成？',
        options: [
          { text: 'do not', correct: true },
          { text: 'dont' },
          { text: 'do n’t' },
          { text: '不应改写，缩写更自然' }
        ],
        explain: '缩写属于非正式语体标记，学术论文中一律展开：do not、cannot、it is；所有格与缩写也要区分清楚。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['impersonal'],
        stem: '把「I think the policy is unfair」改成更客观的学术表达，最合适的是？',
        options: [
          { text: 'The policy appears to place a disproportionate burden on low-income students.', correct: true },
          { text: 'I strongly believe the policy is unfair.' },
          { text: 'Everyone knows the policy is unfair.' },
          { text: 'In my opinion, the policy is unfair.' }
        ],
        explain: '去掉第一人称与情绪副词，用 appears to、disproportionate 这类可被证据检验的表达，把「我觉得」变成「证据显示」。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['precision'],
        stem: '「a lot of students」在学术写作中最好改为？',
        options: [
          { text: '37 percent of the 1,200 surveyed students', correct: true },
          { text: 'lots and lots of students' },
          { text: 'many many students' },
          { text: 'a huge amount of students' }
        ],
        explain: '学术写作要求可核查的精确量：给比例、样本量与时间范围，而不是 a lot of、many 这类模糊量词。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['concision'],
        stem: '「due to the fact that」最简洁的替换是？',
        options: [
          { text: 'because', correct: true },
          { text: 'owing to the fact that' },
          { text: 'in light of the fact that' },
          { text: 'for the reason that' }
        ],
        explain: '凡是能用 because 的地方就用 because；due to the fact that、for the reason that 都是同义冗词，只增加长度不增加信息。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['nominalisation'],
        stem: '「They decided to delay the project.」名词化（nominalisation）后的写法是？',
        options: [
          { text: 'The decision to delay the project was made.', correct: true },
          { text: 'They made a decision that delayed the project.' },
          { text: 'Delaying the project, they decided.' },
          { text: 'The project was delayed, they decided.' }
        ],
        explain: '名词化把动词 decide 变成名词 decision，让动作成为句子的主语或宾语，句子更紧凑，也更 impersonal。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'tf', difficulty: 2, tags: ['hedging'],
        stem: '学术写作应完全避免 may、seems、suggests 等模糊限制语，才能显得自信。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '模糊限制语不是软弱，而是让判断强度与证据强度匹配；该 hedge 时不 hedge 是过度概括，但也不能每句都 hedge。'
      },

      /* ---------------- ch03 因果分析 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'tf', difficulty: 1, tags: ['causation'],
        stem: '两个变量相关（correlation）就足以证明其中一个导致了另一个。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '相关只是因果的必要线索之一，还可能由混杂变量、反向因果或选择效应造成；因果主张需要机制、时间顺序与反事实证据。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['confounder'],
        stem: '混杂变量（confounding variable）指的是？',
        options: [
          { text: '同时影响自变量与因变量、因而制造出虚假关联的第三变量', correct: true },
          { text: '实验中随机分配的对照组' },
          { text: '研究者故意篡改的数据' },
          { text: '因变量的测量误差' }
        ],
        explain: '例如「冰淇淋销量」与「溺水人数」同升，真正的共同原因是气温；控制混杂变量是因果推断的核心工作。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['reverse'],
        stem: '下列哪一项是反向因果（reverse causation）的例子？',
        options: [
          { text: '不是运动使人快乐，而是快乐的人更愿意运动', correct: true },
          { text: '气温升高导致冰淇淋销量上升' },
          { text: '随机分组后实验组成绩更高' },
          { text: '样本量不足导致结论不稳' }
        ],
        explain: '反向因果是「结果反过来影响原因」：观察到 A 与 B 同变，实际方向可能是 B → A，需要用时间顺序或干预来排除。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['mechanism'],
        stem: '在因果论证中补充「机制」（mechanism）的作用是？',
        options: [
          { text: '说明原因通过什么步骤产生结果，让因果链条可信', correct: true },
          { text: '替代所有统计数据' },
          { text: '证明相关性不存在' },
          { text: '让文章字数达标' }
        ],
        explain: '机制把「A 与 B 相关」推进到「A 如何导致 B」：例如减少购买点 → 降低冲动消费 → 减少瓶装水销量，每一步都可检验。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['conditions'],
        stem: '「必要条件」与「充分条件」的区别是？',
        options: [
          { text: '没有它一定不行 vs 有它就一定行', correct: true },
          { text: '两者完全等价' },
          { text: '必要条件比充分条件更强' },
          { text: '充分条件只用于实验研究' }
        ],
        explain: '氧气是燃烧的必要条件（没有就不行），但只有氧气不一定燃烧；火花是充分条件之一（有它就行）。因果写作要区分两者。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['counterfactual'],
        stem: '反事实（counterfactual）推理问的是？',
        options: [
          { text: '如果原因没有发生，结果会怎样', correct: true },
          { text: '历史上是否真的发生过这件事' },
          { text: '结果是否可以被测量' },
          { text: '原因是否可以用文字描述' }
        ],
        explain: '因果主张隐含比较：没有 X 时 Y 会不同。反事实让这个比较显性化，也提醒我们注意「本来就会发生」的趋势。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['soWhat'],
        stem: '因果段落的「so what」句通常回答什么问题？',
        options: [
          { text: '这个因果发现对读者、政策或后续研究意味着什么', correct: true },
          { text: '这一段用了几个引用' },
          { text: '作者的母语是什么' },
          { text: '数据是用什么软件分析的' }
        ],
        explain: '只证明「A 导致 B」还不够，还要说明这个发现为什么重要：影响谁、能改变什么决策、还留下什么疑问。'
      },

      /* ---------------- ch04 研究起步 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['question'],
        stem: '好的研究问题通常具备什么特征？',
        options: [
          { text: '聚焦、可回答，并能在规定篇幅内用可得证据处理', correct: true },
          { text: '越大越好，覆盖越多议题越显深度' },
          { text: '必须能用一个 yes/no 回答' },
          { text: '不能涉及任何价值判断' }
        ],
        explain: '研究问题要窄到能在一篇论文里回答，又要留有争议空间；「社交媒体是否影响青少年」太大，改成「某平台使用时长与睡眠时长的关系」才可操作。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['search'],
        stem: '在数据库检索中，布尔运算符 AND 的作用是？',
        options: [
          { text: '缩小结果范围，要求两个词同时出现', correct: true },
          { text: '扩大结果范围，任一词出现即可' },
          { text: '排除某个词' },
          { text: '按时间排序' }
        ],
        explain: 'AND 取交集、缩小结果；OR 取并集、扩大结果；NOT 排除。检索时先用 AND 收窄，再用 OR 补同义词。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['sources'],
        stem: '下列哪一项属于一手来源（primary source）？',
        options: [
          { text: '研究者本人发表的实验报告', correct: true },
          { text: '教科书对这一实验的概述' },
          { text: '维基百科条目' },
          { text: '一篇综述文章对多项研究的总结' }
        ],
        explain: '一手来源是原始数据或亲历记录；教科书、百科、综述都是二手，它们可以帮你找线索，但关键主张应回到一手文献核实。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['evaluation'],
        stem: '评估一个网络来源时，下列哪组问题最有用？',
        options: [
          { text: '作者是谁、何时发表、证据来自哪里、目的是什么', correct: true },
          { text: '页面颜色是否好看、广告多不多' },
          { text: '字数是否超过三千' },
          { text: '是否能被翻译成中文' }
        ],
        explain: '来源评估围绕权威性、时效性、相关性、准确性与目的：作者资质、发表时间、证据来源、是否有商业或立场动机。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['chaining'],
        stem: '引文追踪（citation chaining）指的是？',
        options: [
          { text: '从一篇好文献的参考文献与引用它的文献向外扩展', correct: true },
          { text: '把参考文献按字母顺序抄一遍' },
          { text: '只搜索标题完全相同的文章' },
          { text: '用翻译软件逐句翻译文献' }
        ],
        explain: '向前追踪看该文引用了谁，向后追踪看谁引用了它；两条链能在短时间内把一个领域的核心文献圈出来。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['reading'],
        stem: '三遍阅读法的第一遍通常做什么？',
        options: [
          { text: '读标题、摘要、引言与结论，判断是否值得细读', correct: true },
          { text: '逐字抄写全文' },
          { text: '背下所有参考文献' },
          { text: '直接跳到方法部分的公式' }
        ],
        explain: '第一遍做「筛选」，第二遍读方法与结果、做笔记，第三遍带着问题精读并 reconstruct 论证；不是每篇都值得三遍。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 1, type: 'tf', difficulty: 1, tags: ['sources'],
        stem: '维基百科可以作为论文最终的引用来源。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '维基百科适合入门与找线索，但它可被随时编辑、不署名，不能作为学术引用的最终来源；应顺着他列出的参考文献回到原始出处。'
      },

      /* ---------------- ch05 APA 引用 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['apa'],
        stem: '两位作者的文献，APA 第 7 版文内引用应写成？',
        options: [
          { text: '(Walker &amp; Allen, 2004)', correct: true },
          { text: '(Walker and Allen, 2004)' },
          { text: '(Walker et al., 2004)' },
          { text: '(Walker, Allen, 2004)' }
        ],
        explain: '括号内用 &amp; 连接两位作者，年份随后；若在句子中叙述，则用 and，如 Walker and Allen (2004) argue that…。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['apa'],
        stem: '三位及以上作者的文献，APA 第 7 版文内引用应写成？',
        options: [
          { text: '(Wasserstein et al., 2005)', correct: true },
          { text: '(Wasserstein, Smith, &amp; Jones, 2005)' },
          { text: '(Wasserstein etc., 2005)' },
          { text: '(W. et al., 2005)' }
        ],
        explain: '三位及以上作者从第一次引用起就用第一作者加 et al.；参考文献表中则要列出全部作者（最多 20 位）。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['quotation'],
        stem: '直接引用（direct quotation）在 APA 中必须补上什么？',
        options: [
          { text: '页码或段落位置，如 (Hedetoft, 2013, p. 2)', correct: true },
          { text: '作者的年龄' },
          { text: '出版社的电话' },
          { text: '引文的总字数' }
        ],
        explain: '直接引用要让读者能定位原句，所以除作者与年份外还要页码；网络无页码时用段落号或标题加段号。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['reference'],
        stem: 'APA 参考文献表的排列顺序是？',
        options: [
          { text: '按第一作者姓氏的字母顺序', correct: true },
          { text: '按引用在文中出现的先后' },
          { text: '按出版年份从新到旧' },
          { text: '按文献篇幅从长到短' }
        ],
        explain: 'APA 用作者—日期制，参考文献表按姓氏字母序排列；同一作者多篇按年份先后，同年则加 a、b 区分。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'tf', difficulty: 2, tags: ['matching'],
        stem: '文内引用与文末参考文献必须一一对应：文中出现的每条都在表里，表里的每条都在文中被引用。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '一一对应是 APA 的基本检查：多出来的条目像没读过的装饰，缺失的条目则是未标注来源，两者都会被扣分甚至算抄袭。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['paraphrase'],
        stem: '用自己的话转述（paraphrase）了别人的观点，是否仍需要引用？',
        options: [
          { text: '需要，观点属于原作者，必须标注来源', correct: true },
          { text: '不需要，只要换了词就是自己的' },
          { text: '只有直接引用才需要引用' },
          { text: '只有教授要求时才需要' }
        ],
        explain: '引用标注的是「观点来源」而非「文字来源」；改词不改变观点归属，不标注就是抄袭。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['plagiarism'],
        stem: '「拼贴写作」（patchwriting）指的是？',
        options: [
          { text: '保留原文句式与词组、只替换少量词语的伪转述', correct: true },
          { text: '把一段话完整翻译成中文' },
          { text: '引用时标错了年份' },
          { text: '参考文献排版不整齐' }
        ],
        explain: 'patchwriting 看似转述，实则贴着原文走，既没有真正理解也构成抄袭；正确做法是读完合上原文，用自己的句子重建观点。'
      },

      /* ---------------- ch06 论证写作 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['toulmin'],
        stem: '图尔敏模型（Toulmin model）的六个要素是？',
        options: [
          { text: '主张、数据、依据、支撑、限定、反驳', correct: true },
          { text: '标题、摘要、引言、方法、结果、讨论' },
          { text: '主句、从句、短语、单词、标点、段落' },
          { text: '问题、假设、实验、统计、结论、附录' }
        ],
        explain: 'claim（主张）、data（数据）、warrant（依据）、backing（支撑）、qualifier（限定）、rebuttal（反驳）共同说明一个论证如何成立。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['claim'],
        stem: '「学校应当禁止一次性塑料瓶」属于哪一类主张？',
        options: [
          { text: '政策主张（policy claim）', correct: true },
          { text: '事实主张（fact claim）' },
          { text: '价值主张（value claim）' },
          { text: '定义主张（definition claim）' }
        ],
        explain: '政策主张回答「应该做什么」，需要效果、可行性与正当性三类理由；事实主张回答「是不是」，价值主张回答「好不好」。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['thesis'],
        stem: '论证论文的论文陈述通常包含哪三部分？',
        options: [
          { text: '立场、理由概览、限定或范围', correct: true },
          { text: '作者姓名、课程名称、日期' },
          { text: '三个反方观点' },
          { text: '研究方法、样本量、统计工具' }
        ],
        explain: '三段式让读者一眼看到你站哪边、凭什么、管到哪；限定部分尤其重要，它防止主张大到无法证明。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concession'],
        stem: '论证中先承认对方合理之处再反驳（concession + rebuttal）的作用是？',
        options: [
          { text: '显示论证公平且经过检验，从而增强可信度', correct: true },
          { text: '说明作者其实同意对方' },
          { text: '可以替代证据' },
          { text: '让文章显得更长' }
        ],
        explain: '只讲自己一方的论证显得脆弱；承认对方的强处再说明为何不改变结论，读者才相信你考虑过反面。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['peel'],
        stem: 'PEEL 段落结构指的是？',
        options: [
          { text: 'Point、Evidence、Explanation、Link', correct: true },
          { text: 'Plan、Edit、Export、Log' },
          { text: 'Problem、Example、Evaluation、Limitation' },
          { text: 'Paragraph、Essay、Evidence、Language' }
        ],
        explain: '先给分论点，再上证据，然后解释证据如何支持论点，最后回扣全文主张；解释（E2）是最常被省略、也最扣分的一步。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 1, type: 'tf', difficulty: 1, tags: ['voice'],
        stem: 'ENG1002 的论证论文允许大量使用「I think」「I feel」来表达立场。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '课程要求第三人称、impersonal 的学术语体：用 the evidence suggests、this essay argues that，而不是 I think。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['fallacy'],
        stem: '「今天允许在教室喝水，明天就会允许在教室吃饭，最后课堂就变成食堂」属于哪种谬误？',
        options: [
          { text: '滑坡谬误（slippery slope）', correct: true },
          { text: '人身攻击（ad hominem）' },
          { text: '循环论证（circular reasoning）' },
          { text: '虚假权威（appeal to authority）' }
        ],
        explain: '滑坡谬误在没有证据的情况下断言第一步必然导致一连串极端后果；正确做法是逐一检验每个「必然」是否成立。'
      },

      /* ---------------- ch07 学术口语 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['structure'],
        stem: '5–6 分钟演示较合理的时间分配是？',
        options: [
          { text: '开场约 45 秒、路线图 15 秒、主体三点各约 60 秒、收尾约 45 秒', correct: true },
          { text: '开场 3 分钟、主体 1 分钟、结尾 1 分钟' },
          { text: '全部时间讲背景，结论一句带过' },
          { text: '平均分成八段，每段 40 秒' }
        ],
        explain: '短演示的结构要精确到分钟：开场抓注意力、路线图给地图、三点主体各一分钟、收尾重申并过渡到 Q&amp;A。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['slides'],
        stem: '设计演示幻灯片时，一页最合适的做法是？',
        options: [
          { text: '只讲一个观点，标题写结论，正文不超过三行', correct: true },
          { text: '放满 80 词的段落，让听众自己读' },
          { text: '用五种颜色区分五个要点' },
          { text: '把讲稿全文贴在页面上' }
        ],
        explain: '幻灯片是给听众看的提示，不是讲稿：一页一个主张、标题写结论、图下标注来源，细节留在你嘴里。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['qa'],
        stem: 'Q&amp;A 环节推荐的应对顺序是？',
        options: [
          { text: '听清 → 复述确认 → 回答 → 确认对方满意', correct: true },
          { text: '立即反驳 → 提高音量 → 结束' },
          { text: '先道歉 → 跳过问题 → 进入下一题' },
          { text: '把问题转给听众' }
        ],
        explain: '复述给你两秒思考，也向全场确认问题；回答先给结论再给理由，最后问一句是否解答，能把 1 分钟用得很稳。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['delivery'],
        stem: '口语表达中，控制节奏最有效的做法是？',
        options: [
          { text: '在要点后与翻页前停顿，用停顿替代 um、so 等填充词', correct: true },
          { text: '尽量加快语速，讲完为止' },
          { text: '每句都加 you know' },
          { text: '始终盯着投影屏幕' }
        ],
        explain: '停顿让听众消化，也让讲者显得自信；填充词往往源于怕沉默，改法是主动停两秒。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['discussion'],
        stem: '小组讨论中，哪种发言最能推进讨论？',
        options: [
          { text: '引入新证据，或把两位同学的观点连接起来比较', correct: true },
          { text: '反复说 I agree with you' },
          { text: '一个人连续讲五分钟' },
          { text: '只重复老师说过的话' }
        ],
        explain: '推进讨论的三种动作是引入证据、连接观点、收束分歧；只表态不推进，评分上体现不出贡献。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['challenge'],
        stem: '下列哪一句是礼貌而有效的质疑？',
        options: [
          { text: 'That seems to assume X; the reading suggested Y instead.', correct: true },
          { text: 'That is completely wrong.' },
          { text: 'You clearly did not read the article.' },
          { text: 'Whatever, let us move on.' }
        ],
        explain: '有效质疑针对论证而非人：指认隐含假设、给出替代证据、留出修正空间；四种句式是澄清、要证据、指出来源、区分事实与价值。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-7', tier: 1, type: 'tf', difficulty: 1, tags: ['assessment'],
        stem: '个人演示的评分中，内容与视觉各占 25%，因此幻灯片设计与讲稿同样重要。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '课程说明把内容与视觉各设为 25%，再加交付与 Q&amp;A 的表现；把幻灯片当附属品，等于放弃四分之一的分数。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
