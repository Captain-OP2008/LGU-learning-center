/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；每章 q1–q7，与各章内嵌的 chXX-q1..q3 对应
 * schema：CSC.registerQuizPack({ items: [{ id, ch, kp, tier, type, difficulty, tags, stem, options, explain }] })
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '心理学导论这门课研究的核心对象是什么？',
        options: [
          { text: '行为与心理过程，以及它们背后的机制与影响因素', correct: true },
          { text: '只研究异常心理与心理疾病', correct: false },
          { text: '只研究大脑的生理结构', correct: false },
          { text: '只研究人际关系与社会制度', correct: false }
        ],
        explain: '心理学研究行为与心理过程（感知、记忆、情绪、思维等）及其机制，既包括正常功能也包括异常，既看生物基础也看社会文化影响，不能压缩成任何单一分支。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '本站把全课排成七章，最主要的组织逻辑是什么？',
        options: [
          { text: '按「从方法与生物基础，到感知、学习、记忆、发展思维，最后到人格社会与健康」的递进', correct: true },
          { text: '按教材页码平均切成七段，不做重组', correct: false },
          { text: '按考试题型分成七类，每章一种题型', correct: false },
          { text: '按教师姓名排序', correct: false }
        ],
        explain: '七章是一条从底层机制到应用场景的线：先讲怎样做研究，再讲脑与感知，然后是学习与记忆这两类可塑机制，最后是发展与思维、人格社会与健康。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '下面哪一组最接近课程介绍的六个主要视角？',
        options: [
          { text: '生物、认知、行为、心理动力、人本、社会文化', correct: true },
          { text: '代数、几何、统计、微积分、概率、拓扑', correct: false },
          { text: '观察、实验、问卷、访谈、个案、档案', correct: false },
          { text: '感觉、知觉、注意、记忆、语言、思维', correct: false }
        ],
        explain: '六个视角回答的是「从哪一面看行为」：生物看神经与基因，认知看信息加工，行为看可观察的反应，心理动力看无意识冲突，人本看自我实现，社会文化看情境与文化。第三组是研究方法，第四组是认知过程的子话题。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'tf', difficulty: 1, tags: ['method'],
        stem: '判断：因为心理学研究人，所以它不需要像自然科学那样强调可检验的证据。',
        options: [
          { text: '错误', correct: true },
          { text: '正确', correct: false }
        ],
        explain: '恰恰相反。心理学的很多直觉命题自相矛盾，只有用可检验的假设、可重复的观察与统计推断，才能区分「听起来对」与「真的对」。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['method'],
        stem: '课程介绍的「从问题到结论」四步，正确的顺序是？',
        options: [
          { text: '提出可检验的假设 → 操作化变量并设计研究 → 收集与分析数据 → 解释结果并接受同行检验', correct: true },
          { text: '先得出结论 → 再找支持结论的例子 → 写成论文 → 找媒体宣传', correct: false },
          { text: '收集数据 → 提出假设 → 设计研究 → 解释结果', correct: false },
          { text: '阅读教材 → 记住结论 → 参加考试 → 忘记内容', correct: false }
        ],
        explain: '研究流程的关键是「假设先行、变量可操作、数据说话、结论可被同行挑战」。先有结论再找例子是确认偏差，不是研究。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'multi', difficulty: 2, tags: ['method'],
        stem: '关于本站建议的练习节奏，下列哪些说法是正确的？（多选）',
        options: [
          { text: '每章先通读一遍建立框架，再做内嵌题检验理解', correct: true },
          { text: '错题要回到对应小节重读，而不是只记答案', correct: true },
          { text: '考前几天应把全部时间用来反复阅读教材', correct: false },
          { text: '把各章题库混着做，比一次只做一章更能训练辨别', correct: true }
        ],
        explain: '推荐的循环是「通读建框架—做题暴露漏洞—回读补漏—混练迁移」。考前几天仍只反复阅读，正是第 5 章讲的低效策略，容易产生流畅性错觉。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '本课程使用的教材是？',
        options: [
          { text: 'Coon 与 Mitterer《Introduction to Psychology: Gateways to Mind and Behavior》', correct: true },
          { text: 'Myers《Social Psychology》', correct: false },
          { text: 'Kandel《Principles of Neural Science》', correct: false },
          { text: 'American Psychiatric Association 的 DSM-5', correct: false }
        ],
        explain: 'PSY1010 的指定教材是 Coon 与 Mitterer 的《Introduction to Psychology: Gateways to Mind and Behavior》（Wadsworth Cengage Learning，2012），资料库中提供的也是这一本。'
      },

      /* ---------------- ch01 心理学作为科学 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '心理学在 19 世纪末成为独立学科，最关键的一步是？',
        options: [
          { text: '把关于心理的思辨问题转成可以用观察与实验检验的经验问题', correct: true },
          { text: '哲学家开始讨论意识', correct: false },
          { text: '弗洛伊德提出无意识理论', correct: false },
          { text: '心理学家放弃了测量', correct: false }
        ],
        explain: '冯特建立实验室、铁钦纳与詹姆斯等人的工作，使心理学从哲学思辨转向以系统观察和实验为基础的经验科学，这才是学科独立的关键。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '把「攻击性」操作定义为「十分钟内推搡同伴的次数」，这一步的作用是？',
        options: [
          { text: '把抽象概念转成可观察、可测量的指标，使研究可以进行', correct: true },
          { text: '保证这个概念抓住了攻击性的全部含义', correct: false },
          { text: '证明攻击性由基因决定', correct: false },
          { text: '使研究不再需要统计', correct: false }
        ],
        explain: '操作定义用具体指标替代抽象概念，代价是它只覆盖概念的一部分。研究者要说明自己的操作定义抓住了哪一面，以及它可能漏掉什么。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['method'],
        stem: '要确定「睡眠不足导致记忆成绩下降」的因果关系，最关键的设计条件是？',
        options: [
          { text: '随机分配被试到不同睡眠时长条件，并控制其他变量', correct: true },
          { text: '测量被试平时的睡眠时长与成绩，算相关', correct: false },
          { text: '让被试自己报告睡眠是否充足', correct: false },
          { text: '只测试睡眠最少的那一组', correct: false }
        ],
        explain: '只有主动操纵自变量并随机分配，才能把成绩差异归因于睡眠时长而不是第三变量。观察相关无法排除「本来就记性好的人更爱睡觉」这类解释。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'tf', difficulty: 1, tags: ['method'],
        stem: '判断：两个变量之间的相关系数达到 −0.7，说明其中一个变量导致了另一个。',
        options: [
          { text: '错误', correct: true },
          { text: '正确', correct: false }
        ],
        explain: '相关只描述共同变化的强度与方向，不提供因果方向。−0.7 表示较强的负向关系，但可能是 A 导致 B、B 导致 A，或第三个变量同时影响两者。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['method'],
        stem: '「随机抽样」与「随机分配」的区别是？',
        options: [
          { text: '前者决定谁进入样本（提高外部效度），后者决定谁进入哪个条件（支持因果推断）', correct: true },
          { text: '两者是同一件事的两种说法', correct: false },
          { text: '前者用于实验，后者用于问卷', correct: false },
          { text: '前者保证结果显著，后者保证结果可重复', correct: false }
        ],
        explain: '随机抽样让样本能代表总体，关系到结论能否推广；随机分配让各组在实验前大致相等，关系到能否排除选择偏差、作出因果推断。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'multi', difficulty: 3, tags: ['method'],
        stem: '2015 年开放科学合作组织重复 100 项心理学研究，发现约 36% 得到显著结果、效应量平均约为原始的一半。下列哪些解读是恰当的？（多选）',
        options: [
          { text: '许多已发表效应可能被高估，部分来自小样本与发表偏差', correct: true },
          { text: '心理学所有结论都是假的，应当全部推翻', correct: false },
          { text: '重复失败不必然说明原始研究造假，也可能源于情境差异与统计功效不足', correct: true },
          { text: '评估一项发现时，效应量与可重复性比单一的 p 值更重要', correct: true }
        ],
        explain: '这个结果推动的是方法改革（预注册、大样本、报告效应量与置信区间），而不是全盘否定。把一次重复失败等同于造假，也犯了过度推断的错。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['ethics'],
        stem: '研究中对被试使用了欺骗，事后最必要的伦理步骤是？',
        options: [
          { text: '尽快进行事后说明（debriefing），解释欺骗的目的与必要性，并允许撤回数据', correct: true },
          { text: '不必告知，只要数据已经收集完', correct: false },
          { text: '在论文里加一句「被试已同意」即可', correct: false },
          { text: '把被试的姓名公开以便核查', correct: false }
        ],
        explain: '欺骗只有在必要、无害且事后充分说明时才可能被伦理委员会批准。事后说明要消除欺骗造成的误解，并尊重被试退出与撤回数据的权利。'
      },

      /* ---------------- ch02 脑与行为 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '神经元主要从哪个部位接收来自其他神经元的信号？',
        options: [
          { text: '树突', correct: true },
          { text: '轴突', correct: false },
          { text: '髓鞘', correct: false },
          { text: '突触小泡', correct: false }
        ],
        explain: '树突是接收端，轴突把动作电位传向末端，髓鞘包裹轴突加快传导，突触小泡储存并释放递质。方向搞反是最常见的失分点。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '判断：刺激越强，单个神经元产生的动作电位幅度就越大。',
        options: [
          { text: '错误', correct: true },
          { text: '正确', correct: false }
        ],
        explain: '动作电位遵循「全或无」原则：一旦达到阈限就完整发放，幅度不随刺激强度变化。强度信息靠发放频率与参与的神经元数量编码。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '可卡因等药物产生强烈欣快感，主要与哪条通路被反复激活有关？',
        options: [
          { text: '多巴胺奖赏通路（中脑—伏隔核）', correct: true },
          { text: '视觉皮层的通路', correct: false },
          { text: '小脑的运动协调通路', correct: false },
          { text: '延髓的呼吸中枢', correct: false }
        ],
        explain: '成瘾药物大多直接或间接增强多巴胺在伏隔核等区域的信号，带来强烈奖赏感并驱动重复使用；反复激活会引发耐受与敏化。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '遇到危险时心跳加速、瞳孔放大、消化减慢，这组反应由哪一部分主导？',
        options: [
          { text: '交感神经系统', correct: true },
          { text: '副交感神经系统', correct: false },
          { text: '躯体神经系统', correct: false },
          { text: '小脑', correct: false }
        ],
        explain: '交感系统负责动员（战或逃），副交感系统负责恢复与休息，两者对同一器官常有相反作用。躯体神经则支配骨骼肌的随意运动。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '枕叶视觉皮层受损最可能造成什么后果？',
        options: [
          { text: '视野缺损或无法形成视觉体验，尽管眼睛本身正常', correct: true },
          { text: '无法理解语言', correct: false },
          { text: '失去平衡感', correct: false },
          { text: '无法控制手指的精细动作', correct: false }
        ],
        explain: '枕叶是视觉信息的终点站。眼睛与视神经正常但皮层受损，仍可能看不见或出现视野缺失，这说明「看见」发生在脑里而不只是眼里。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'multi', difficulty: 3, tags: ['concept'],
        stem: '关于裂脑患者的研究，下列哪些说法正确？（多选）',
        options: [
          { text: '切断胼胝体后，两个半球之间无法直接交换信息', correct: true },
          { text: '信息呈现在左视野（传入右半球）时，患者可能无法用语言报告', correct: true },
          { text: '左半球通常在多数人中负责语言', correct: true },
          { text: '裂脑患者会变成两个人格，行为完全失控', correct: false }
        ],
        explain: '裂脑研究揭示的是分工：多数人左半球管语言，右半球在空间与面孔加工上有优势。患者日常行为基本正常，只在实验室的侧化呈现任务中暴露出分离。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['method'],
        stem: '「死鲑鱼 fMRI」研究的意义在于提醒我们？',
        options: [
          { text: '不做多重比较校正时，噪声数据也能产出看似显著的脑区激活', correct: true },
          { text: '鱼也有情绪', correct: false },
          { text: 'fMRI 完全无法用于脑研究', correct: false },
          { text: '脑成像不需要统计', correct: false }
        ],
        explain: '这项讽刺研究把上千个噪声体素做统计，未校正就出现了「显著」激活。它针对的是分析流程，而不是否定整个脑成像方法。'
      },

      /* ---------------- ch03 感觉、知觉与意识 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '绝对阈限指的是？',
        options: [
          { text: '在理想条件下，能被觉察到的最小刺激强度', correct: true },
          { text: '能分辨两个刺激差异的最小强度差', correct: false },
          { text: '感觉适应之后剩下的强度', correct: false },
          { text: '刺激能被耐受的最大强度', correct: false }
        ],
        explain: '绝对阈限是「有没有」的门槛，差别阈限（最小可觉差）是「变没变」的门槛。后者与原刺激强度的比例关系即韦伯定律。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '韦伯定律说的是？',
        options: [
          { text: '差别阈限与原刺激强度成固定比例，刺激越强，需要的变化量越大', correct: true },
          { text: '差别阈限与刺激强度无关', correct: false },
          { text: '感觉强度与刺激强度的对数成正比', correct: false },
          { text: '刺激越弱越容易被觉察', correct: false }
        ],
        explain: '在灯光很暗时加一支蜡烛就能察觉，在阳光下加一支却察觉不到。费希纳定律（感觉与刺激强度的对数成正比）是另一条相关但不同的规律。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '视网膜中央凹处主要分布着什么，它对什么最敏感？',
        options: [
          { text: '视锥细胞，对颜色与细节最敏感', correct: true },
          { text: '视杆细胞，对暗光最敏感', correct: false },
          { text: '双极细胞，对运动最敏感', correct: false },
          { text: '无长突细胞，对颜色最敏感', correct: false }
        ],
        explain: '中央凹视锥密集、视杆几乎缺席，所以白天看细节与颜色最清楚；夜间看暗处则依赖周边视网膜的视杆细胞，这也是为什么暗处看星星要「用余光」。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '看到一个由断开的线段组成的圆，却感知为完整的圆，这体现了哪条格式塔原则？',
        options: [
          { text: '闭合', correct: true },
          { text: '接近', correct: false },
          { text: '相似', correct: false },
          { text: '连续', correct: false }
        ],
        explain: '闭合是把缺口补全、看成完整图形的倾向。接近看距离、相似看属性、连续看线条走向，四条原则都是「整体大于部分之和」的例子。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '判断：只要刺激落在视网膜上，人就一定能意识到它。',
        options: [
          { text: '错误', correct: true },
          { text: '正确', correct: false }
        ],
        explain: '注意是过滤器。大猩猩实验里，专注数传球次数的被试有相当比例没看见走过场中央的大猩猩，这叫无意视盲，说明「看见」需要注意参与。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '关于 REM 睡眠，下列哪些描述正确？（多选）',
        options: [
          { text: '脑电活动接近清醒状态，多数生动的梦发生在此阶段', correct: true },
          { text: '骨骼肌张力显著降低，身体基本不能动', correct: true },
          { text: '一个睡眠周期中 REM 时长后半夜更长', correct: true },
          { text: 'REM 阶段大脑完全休息，代谢降到最低', correct: false }
        ],
        explain: 'REM 是「脑活跃、身体瘫痪」的状态，也叫异相睡眠。睡眠周期约 90 分钟，前半夜慢波睡眠多、后半夜 REM 多，所以熬夜对 REM 的削减尤其明显。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '长期饮酒者需要越来越大的量才有原来的效果，这属于？',
        options: [
          { text: '耐受（tolerance）', correct: true },
          { text: '戒断（withdrawal）', correct: false },
          { text: '敏化（sensitization）', correct: false },
          { text: '安慰剂效应', correct: false }
        ],
        explain: '耐受是同一剂量效果下降、需要加量；戒断是停用后出现相反症状。两者常同时出现，是物质使用障碍的重要标志。'
      },

      /* ---------------- ch04 学习 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '巴甫洛夫的狗听到铃声就分泌唾液，这里的铃声是？',
        options: [
          { text: '条件刺激（CS）', correct: true },
          { text: '无条件刺激（US）', correct: false },
          { text: '无条件反应（UR）', correct: false },
          { text: '条件反应（CR）', correct: false }
        ],
        explain: '食物是无条件刺激，唾液对食物是无条件反应；铃声最初是中性刺激，与食物反复配对后成为条件刺激，引发条件反应。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '吃了某家店的海鲜后上吐下泻，此后多年闻到那个味道就恶心。这个现象最能说明？',
        options: [
          { text: '味觉厌恶学习有生物准备性，一次配对即可形成且难以消退', correct: true },
          { text: '所有条件作用都必须多次配对', correct: false },
          { text: '经典条件作用只适用于实验室', correct: false },
          { text: '厌恶是纯粹的有意识推理', correct: false }
        ],
        explain: '加西亚（Garcia）的研究显示，味觉与内脏不适的联结只需一次、且可以间隔数小时，比其他条件作用更「准备就绪」，这挑战了「所有学习都遵循同一规律」的观点。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '孩子一哭，家长立刻拿走让他不舒服的任务，哭声因此增加。对家长而言这属于？',
        options: [
          { text: '负强化：移除厌恶刺激，使行为增加', correct: true },
          { text: '正强化：给予奖励，使行为增加', correct: false },
          { text: '正惩罚：给予厌恶刺激，使行为减少', correct: false },
          { text: '负惩罚：移除愉快刺激，使行为减少', correct: false }
        ],
        explain: '「正/负」指施加还是移除刺激，「强化/惩罚」指行为增加还是减少。移除任务让哭闹增加，是负强化；这也解释了为什么家长会无意中养出哭闹。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '老虎机为什么最难戒？它使用的是哪种强化程式？',
        options: [
          { text: '可变比率强化，反应数与奖赏不成固定比例，最难消退', correct: true },
          { text: '固定时距强化，每隔固定时间给一次奖赏', correct: false },
          { text: '固定比率强化，每固定次数给一次奖赏', correct: false },
          { text: '连续强化，每次都给予奖赏', correct: false }
        ],
        explain: '可变比率按平均反应数给奖，奖赏不可预测，产生高而稳定的反应率与极强的抗消退性。固定比率（计件工资）在奖赏后会有短暂停顿。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '判断：托尔曼的潜伏学习实验表明，学习可以在没有外部奖励的情况下发生，并在需要时才表现出来。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '没被奖励的迷宫组大鼠在获得奖励后立刻表现接近被奖励组，说明它们早已形成「认知地图」，只是没有动机表现出来。这支持了学习与表现可以分离。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '班杜拉的波波玩偶实验主要说明了？',
        options: [
          { text: '儿童可以通过观察榜样的行为及其后果来学习', correct: true },
          { text: '攻击性完全由基因决定', correct: false },
          { text: '只有直接强化才能学习', correct: false },
          { text: '惩罚对行为没有影响', correct: false }
        ],
        explain: '看到榜样被奖励的儿童更可能模仿攻击行为，看到被惩罚的更少，这叫替代强化。观察学习不需要自己亲历强化，这是社会认知理论的核心。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些做法符合基于学习原理的行为改变？（多选）',
        options: [
          { text: '把大目标拆成逐步接近的小步骤，对每一步给予反馈（塑造）', correct: true },
          { text: '想减少某个行为时，同时为替代行为提供强化', correct: true },
          { text: '用体罚快速压制行为，并期待长期效果', correct: false },
          { text: '记录行为发生的频率与情境，作为调整方案的依据', correct: true }
        ],
        explain: '塑造、替代强化与基线记录都是有证据支持的做法。体罚能短期压制行为，但会带来恐惧、攻击性模仿与关系损伤，且效果难以维持。'
      },

      /* ---------------- ch05 记忆 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '短时记忆的容量通常被描述为？',
        options: [
          { text: '约 7±2 个组块', correct: true },
          { text: '约 70 个组块', correct: false },
          { text: '约 2 个组块', correct: false },
          { text: '容量无限', correct: false }
        ],
        explain: '米勒提出 7±2，后来的研究（如考恩）多支持约 4±1 个组块。无论取哪个数，关键都是「组块」而非「字」，组块化能有效扩容。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '在巴德利的工作记忆模型中，负责分配注意与协调各子系统的成分是？',
        options: [
          { text: '中央执行', correct: true },
          { text: '语音环路', correct: false },
          { text: '视空间画板', correct: false },
          { text: '情景缓冲器', correct: false }
        ],
        explain: '中央执行是有限的控制中心；语音环路处理言语复述，视空间画板处理图像与空间，情景缓冲器把多来源信息整合成连贯情景。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: 'H.M. 切除海马后，哪一类记忆相对保留完好？',
        options: [
          { text: '程序性技能，如镜像描图越练越熟', correct: true },
          { text: '新发生的情景记忆', correct: false },
          { text: '新学的事实与词义', correct: false },
          { text: '对术后每一天的经历的回忆', correct: false }
        ],
        explain: '他能学会新技能却不记得练过，说明程序性记忆依赖基底节与小脑等系统，与形成新情景记忆的海马系统分离。这是「记忆是复数」最有力的证据之一。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '按加工水平理论，下列哪种任务最可能带来较好的记忆？',
        options: [
          { text: '判断这个词能否放进「他买了一___」这个句子', correct: true },
          { text: '判断这个词是不是大写字母', correct: false },
          { text: '判断这个词与另一个词是否押韵', correct: false },
          { text: '数这个词有几个字母', correct: false }
        ],
        explain: '语义加工最深，字形加工最浅，语音居中。填句任务要求理解意义并建立联结，因此记忆效果最好，这也是精细复述优于维持性复述的原因。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '换了新密码后总是不自觉地输入旧密码，这属于？',
        options: [
          { text: '前摄干扰：旧信息妨碍新信息', correct: true },
          { text: '倒摄干扰：新信息妨碍旧信息', correct: false },
          { text: '衰退：记忆痕迹随时间消失', correct: false },
          { text: '编码失败：信息从未进入记忆', correct: false }
        ],
        explain: '前摄干扰是「旧的挡新的」，倒摄干扰是「新的挡旧的」。学完新单词后旧单词想不起来是倒摄，总输旧密码是前摄，方向不要搞反。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'multi', difficulty: 3, tags: ['concept'],
        stem: '关于目击者证词，下列哪些说法有研究支持？（多选）',
        options: [
          { text: '事后提问的措辞可以改变证人对事件细节的记忆', correct: true },
          { text: '证人的信心与辨认准确率之间只有很弱的相关', correct: true },
          { text: '双盲列队与「嫌疑人可能不在其中」的提示能减少错误辨认', correct: true },
          { text: '只要证人非常确定，辨认结果就基本可信', correct: false }
        ],
        explain: '洛夫特斯的误导信息实验、信心—准确率弱相关的元分析、以及双盲列队研究都指向同一结论：可靠性要靠程序保障，而不是证人的确信程度。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '同样学四小时，下列哪种安排最有利于长期保持？',
        options: [
          { text: '分成四次、每次一小时、隔天进行，并穿插自测', correct: true },
          { text: '考前一次连续学完四小时', correct: false },
          { text: '连续四小时反复阅读同一章', correct: false },
          { text: '只看一遍视频，不做任何练习', correct: false }
        ],
        explain: '间隔效应与测试效应是学习科学里最稳的两条：分散学习配合提取练习，比集中阅读在延迟测验上成绩更好，尽管后者当下感觉更顺。'
      },

      /* ---------------- ch06 发展与思维 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '把同样多的水从矮杯倒进高杯，四岁孩子说「高杯里更多」。按皮亚杰，这体现？',
        options: [
          { text: '前运算期缺乏守恒，只注意一个维度', correct: true },
          { text: '具体运算期已掌握可逆性', correct: false },
          { text: '形式运算期的假设演绎推理', correct: false },
          { text: '感知运动期的客体永久性', correct: false }
        ],
        explain: '前运算期的孩子聚注于高度、忽略宽度，也还不能在头脑中把倒水的过程逆转回去。守恒的掌握是具体运算期的标志性成就。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '维果茨基的「最近发展区」指的是？',
        options: [
          { text: '独立水平与在帮助下可达到水平之间的区间', correct: true },
          { text: '已经掌握、不需要再教的内容', correct: false },
          { text: '完全超出能力、怎么帮都做不到的内容', correct: false },
          { text: '同龄人平均能达到的水平', correct: false }
        ],
        explain: 'ZPD 是教学的黄金区间：太难会挫败，太易无学习。支架就搭在这个区间里，随能力提高逐步撤掉，最终由孩子独立完成。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '在陌生情境测验中，安全型依恋的婴儿在母亲回来时通常？',
        options: [
          { text: '寻求接触与安慰，并能较快平静下来继续探索', correct: true },
          { text: '完全忽视母亲的返回', correct: false },
          { text: '既想靠近又推开，长时间无法安抚', correct: false },
          { text: '表现出无组织、矛盾的行为', correct: false }
        ],
        explain: '安全型的标志是「把照料者当安全基地」：分离时不安，重聚时靠近并恢复。回避型忽视、矛盾型既求又拒、混乱型行为无组织。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '「企鹅是鸟吗」这个问题让人犹豫，最能用来说明？',
        options: [
          { text: '日常概念以原型为中心，边缘成员判断更慢、更不确定', correct: true },
          { text: '人完全没有类别概念', correct: false },
          { text: '概念必须由必要且充分特征定义', correct: false },
          { text: '鸟类知识无法被测量', correct: false }
        ],
        explain: '原型模型认为类别有典型性梯度：麻雀比企鹅更「像鸟」，所以判断更快。经典的定义特征模型解释不了这种梯度与边界模糊。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '看完大量空难报道后高估坐飞机的风险，这属于？',
        options: [
          { text: '可得性启发', correct: true },
          { text: '代表性启发', correct: false },
          { text: '锚定效应', correct: false },
          { text: '确认偏差', correct: false }
        ],
        explain: '可得性启发按「例子多容易想起来」估计频率，媒体报道让空难极易想起，于是风险被高估。代表性启发是「像不像典型」，锚定是被初始数字拉动。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 1, type: 'tf', difficulty: 2, tags: ['method'],
        stem: '判断：一个测验的重测信度很高，就说明它测到了它声称要测的东西。',
        options: [
          { text: '错误', correct: true },
          { text: '正确', correct: false }
        ],
        explain: '信度是稳定，效度是准确。每天读数相同的坏秤信度极高却完全无效。高信度是高效度的必要条件，不是充分条件。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'multi', difficulty: 3, tags: ['method'],
        stem: '关于智力测验的群体差异，下列哪些表述是恰当的？（多选）',
        options: [
          { text: '群体均值差不能用来推断任何个体的能力', correct: true },
          { text: '组内遗传力高，并不证明组间差异由基因造成', correct: true },
          { text: '测验分数反映特定时间与经验下的表现，可以被教学改变', correct: true },
          { text: '既然差异可能有环境成分，就说明基因完全不起作用', correct: false }
        ],
        explain: '前三句是行为遗传学与测验研究的基本逻辑。最后一句走到了另一个极端：遗传与环境是交互的，否定环境决定不等于否定遗传影响，反之亦然。'
      },

      /* ---------------- ch07 人格、社会与健康 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '本来喜欢画画的孩子，每次画完都给钱，后来不给钱就不画了。这最可能是？',
        options: [
          { text: '过度理由效应：外在奖励削弱了内在动机', correct: true },
          { text: '负强化：移除厌恶刺激使行为增加', correct: false },
          { text: '观察学习：模仿了同伴', correct: false },
          { text: '消退：不再给予强化导致行为减少', correct: false }
        ],
        explain: '奖励把行为的原因从「我喜欢」改成了「为了钱」，撤掉奖励后行为就消失。对本来有趣的任务，奖励要慎用；对枯燥任务则另当别论。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '两因素理论认为情绪由什么构成？',
        options: [
          { text: '生理唤醒加上对唤醒的认知标签', correct: true },
          { text: '纯粹的身体反应，与解释无关', correct: false },
          { text: '纯粹的主观感受，与身体无关', correct: false },
          { text: '由面部肌肉单独决定', correct: false }
        ],
        explain: '沙赫特与辛格认为同样的心跳加速可以被标成恐惧或兴奋，标签取决于情境。詹姆斯—兰格强调「先身体后情绪」，坎农—巴德强调同时发生。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '大五人格中，与学业表现、工作绩效关系最稳定的维度通常是？',
        options: [
          { text: '尽责性', correct: true },
          { text: '外向性', correct: false },
          { text: '开放性', correct: false },
          { text: '宜人性', correct: false }
        ],
        explain: '尽责性包含自律、条理与坚持，对长期任务的完成度预测力最强。外向性更多预测社交行为，开放性预测对新观念的接受。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'tf', difficulty: 2, tags: ['method'],
        stem: '判断：MBTI 因为把人分成 16 种类型，所以比大五更适合用于招聘筛选。',
        options: [
          { text: '错误', correct: true },
          { text: '正确', correct: false }
        ],
        explain: 'MBTI 的重测信度与结构效度表现不佳，二分切分也丢掉了大量中间信息。招聘筛选需要能预测绩效的工具，类型标签不满足这个要求。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '街上有人晕倒，围观者很多却没人打电话，最可能的原因是？',
        options: [
          { text: '责任分散与多元无知：人多时每个人感到的责任更小，也从他人的不动推断「不紧急」', correct: true },
          { text: '围观者都缺乏同情心', correct: false },
          { text: '人群一定会产生攻击行为', correct: false },
          { text: '打电话这件事太难', correct: false }
        ],
        explain: '旁观者效应不是道德问题，而是情境结构问题。破解办法是指定具体的人与具体的任务：「穿蓝外套的先生，请你打 120。」'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '面对可协商的截止日期带来的压力，最匹配的应对方式是？',
        options: [
          { text: '问题聚焦应对：拆任务、排优先级、与对方沟通调整', correct: true },
          { text: '情绪聚焦应对：只做放松训练，不改变安排', correct: false },
          { text: '回避：不再想这件事', correct: false },
          { text: '否认：告诉自己截止日期不存在', correct: false }
        ],
        explain: '可控的压力源适合问题聚焦应对，不可控的（如等待检查结果）才适合情绪聚焦。用错方向会让问题积累或产生无助感。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '关于心理障碍与治疗，下列哪些说法是恰当的？（多选）',
        options: [
          { text: '诊断按症状群与功能损害划分，是分类系统而非病因系统', correct: true },
          { text: 'CBT 对焦虑与抑郁有较强的证据支持，常与药物联合使用', correct: true },
          { text: '同一个诊断下的人可能机制不同，共病也很常见', correct: true },
          { text: '心理障碍只要意志够强就能自己克服，不需要治疗', correct: false }
        ],
        explain: '诊断帮助沟通与选择治疗，但它不解释病因，还带来污名风险。CBT 是证据基础最厚的心理治疗之一，中重度障碍常与药物联合效果最好。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
