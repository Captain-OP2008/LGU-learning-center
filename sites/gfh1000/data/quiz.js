/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；每章 q1–q3 与 chXX.js 正文内嵌题一致。
 * 字段：{ id, ch, kp, tier, type, difficulty, tags, stem, options|answer, explain }
 * ===================================================================== */
(function () {
  'use strict';
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '下列哪一项<b>不属于</b> GFH1000 的三大主题？',
        options: [
          { text: '自我与人类潜能（Self and Human Potential）' },
          { text: '信仰与人的限制（Faith and Human Limitation）' },
          { text: '自我与社会制度（Self in Social Institutions）' },
          { text: '量子力学与意识（Quantum Mechanics and Consciousness）', correct: true }
        ],
        explain: '课程大纲列出的三大主题是自我与人类潜能、信仰与人的限制、自我与社会制度。量子力学与意识不是本课程的主题，课程走的是经典细读而非自然科学概论。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '「诠释学循环」（hermeneutic circle）通常指：',
        options: [
          { text: '整体意义与部分细节互相规定，理解在两者之间来回修正', correct: true },
          { text: '读者可以完全不看文本，凭自己的经验任意解释' },
          { text: '作者的原意是唯一标准，读者不应提出不同理解' },
          { text: '文本的意义由出版商的销量决定' }
        ],
        explain: '诠释学循环说的是：要理解整段话，需要先理解每个词句；要理解每个词句，又需要先把握整段话的语境。理解因此是来回修正的过程，既不是任意发挥，也不是只找作者原意。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['assessment'],
        stem: '按课程大纲，Term Paper 占总评的多少？',
        options: [
          { text: '30%', correct: true },
          { text: '20%' },
          { text: '16%' },
          { text: '8%' }
        ],
        explain: '大纲的权重是 Participation 8%、Co-teaching Presentation 6%、In-Class Written Assignments 16%、Quizzes 20%、Reflective Journals 20%、Term Paper 30%。论文占比最重，应尽早准备。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '苏格拉底式追问（elenchus）的主要目的是：',
        options: [
          { text: '通过追问暴露定义中的矛盾，迫使对话者修正或重新寻求定义', correct: true },
          { text: '用修辞技巧说服对方接受自己的结论' },
          { text: '引用权威经典，让对方闭嘴' },
          { text: '统计多数人的意见，以人数决定真理' }
        ],
        explain: '反诘法不是辩论术，而是一种检验：先接受对方的定义，再推出与常识或对方其他信念冲突的结论，使对方承认自己并不知道。它的作用是清除虚假的确定性，而不是替对方给出答案。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'multi', difficulty: 1, tags: ['writing'],
        stem: '写反思日志时，课程建议把哪三条线交织起来？（多选）',
        options: [
          { text: '个人经验：具体发生过的事、你的困惑', correct: true },
          { text: '文本证据：引文、语境、作者论证', correct: true },
          { text: '概念分析：定义、区分、反驳与回应', correct: true },
          { text: '只写情绪，不引文本，也不作分析' }
        ],
        explain: '反思日志不是日记，也不是读书报告。它要求从具体经验出发，用文本证据检验自己的前见，再用概念分析把经验说清楚；三者缺一，文章就会变成感想或摘要。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['writing'],
        stem: '在论文中引用经典文本时，最应避免的做法是：',
        options: [
          { text: '只凭印象概括文本，不引原文也不标出处', correct: true },
          { text: '引用原文并说明它在上下文中的含义' },
          { text: '区分作者的话与自己的解释' },
          { text: '对同一段文本给出不同译本的对照' }
        ],
        explain: '学术写作要求「让文本证据说话」：引文、出处、语境、解释四者缺一不可。只凭印象概括，既无法验证，也容易把自己的想法冒充成作者的观点。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-8', tier: 2, type: 'multi', difficulty: 2, tags: ['method'],
        stem: '使用本站复习 GFH1000 时，下列哪些做法是合理的？（多选）',
        options: [
          { text: '先读章节正文，再做内嵌小测，最后回看错题的解释', correct: true },
          { text: '按周把阅读、讨论与日志串起来，而不是考前一次性突击', correct: true },
          { text: '把每章的核心概念用自己的话讲给同学听，检验是否真的理解', correct: true },
          { text: '只背题库答案，不看文本与论证' }
        ],
        explain: '人文课考的是理解与论证，不是答案记忆。先读后测、按周积累、用自己的话复述，都是在检验「能否独立重建论证」；只背答案遇到换一种问法就会失效。'
      },

      /* ---------------- ch01 苏格拉底与柏拉图 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '苏格拉底的反诘法（elenchus）通常如何运作？',
        options: [
          { text: '接受对话者的定义，推出与其其他信念冲突的结论，使其承认困惑', correct: true },
          { text: '直接宣布正确答案，要求对方背诵' },
          { text: '诉诸多数人的投票' },
          { text: '引用荷马史诗的权威，结束争论' }
        ],
        explain: '反诘法是「以子之矛攻子之盾」：不预设自己的答案，而是从对方的定义出发，看它能否与对方接受的其他命题相容。矛盾出现时，对话者被促使其修正定义，而不是被说服接受一个现成结论。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '格劳孔讲述「古格斯戒指」的故事，主要是为了：',
        options: [
          { text: '提出「人是否只因害怕惩罚才守正义」的挑战', correct: true },
          { text: '证明戒指的工艺水平很高' },
          { text: '说明牧羊人比国王更幸福' },
          { text: '支持色拉叙马霍斯「正义是强者的利益」的结论' }
        ],
        explain: '古格斯戴上戒指可以隐身，于是引诱王后、杀死国王。格劳孔用这个故事追问：如果做坏事不会被发现，正义的人还会守正义吗？这挑战的是「正义本身值得追求」，而不只是「正义能带来好名声」。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '第俄提玛所说的「爱的阶梯」，最高一级是：',
        options: [
          { text: '对「美本身」的观照', correct: true },
          { text: '对某个美丽身体的爱' },
          { text: '对城邦法律的爱' },
          { text: '对财富与名誉的爱' }
        ],
        explain: '爱的阶梯从爱一个美的身体，到爱所有身体之美，再到心灵、制度与知识之美，最后是「美本身」。第俄提玛的重点不是否定肉体，而是让爱欲从占有个别对象转向对永恒形式的渴望。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '色拉叙马霍斯（Thrasymachus）对正义的核心主张是：',
        options: [
          { text: '正义是强者的利益，法律由统治者制定以维护自身', correct: true },
          { text: '正义是灵魂各部分的和谐' },
          { text: '正义是每个人按天性做最适合自己的工作' },
          { text: '正义是神所命令的' }
        ],
        explain: '色拉叙马霍斯把正义还原为权力：统治者制定法律，所谓「合法」就是有利于统治者。苏格拉底的反驳是指出统治者也会犯错，若法律违背统治者自身利益，其定义就自相矛盾。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '柏拉图把灵魂分为哪三部分？',
        options: [
          { text: '理性、激情、欲望', correct: true },
          { text: '记忆、想象、意志' },
          { text: '本我、自我、超我' },
          { text: '感觉、知觉、思维' }
        ],
        explain: '理性（logistikon）负责判断与统摄，激情（thymoeides）是义愤与荣誉感，欲望（epithymetikon）是吃喝财色等。正义就是三者各司其职、理性统摄，而不是压抑欲望。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '阿里斯托芬在《会饮篇》讲的神话，把爱欲（eros）解释为：',
        options: [
          { text: '对失去的另一半、对整全的渴望', correct: true },
          { text: '对神的虔诚敬畏' },
          { text: '对城邦政治权力的追求' },
          { text: '对财富的理性计算' }
        ],
        explain: '阿里斯托芬说，原始人是圆球形的，被宙斯劈成两半，于是每个人都在寻找自己的另一半。这个神话把爱欲理解为对「整全」的渴望，既浪漫又带有匮乏感，与第俄提玛的「丰盈」形成对照。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-9', tier: 2, type: 'tf', difficulty: 2, tags: ['interpretation'],
        stem: '柏拉图对话是作者直接陈述自己观点的论文，因此不需要考虑人物与戏剧结构。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '柏拉图从不以自己名义说话，观点由人物在戏剧场景中展开；谁在说、对谁说、何时说，都会影响论证的含义。把对话读成论文，会忽略反讽、留白与人物性格。'
      },

      /* ---------------- ch02 孔子与儒家伦理 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '孔子回答颜渊「克己复礼为仁」，其中「克己」的意思是：',
        options: [
          { text: '约束、克制自己的私欲与冲动', correct: true },
          { text: '战胜别人，取得权力' },
          { text: '完全消灭自己的情感' },
          { text: '遵守法律条文即可' }
        ],
        explain: '「克己」是约束自己，不是消灭自己；「复礼」是让行为回到礼的规范。仁不是外在服从，而是通过礼的实践把欲望与情感调适到合宜的方向。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '下列哪一项<b>不属于</b>《论语》开篇所说的「君子三乐」？',
        options: [
          { text: '拥有权力与财富', correct: true },
          { text: '学而时习之' },
          { text: '有朋自远方来' },
          { text: '人不知而不愠' }
        ],
        explain: '《论语》1.1 的三乐是学习并实践、朋友远来、被人不了解却不恼怒。权力与财富不是君子的快乐来源；孔子甚至说「不义而富且贵，于我如浮云」。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '孔子说「政者，正也」，其核心含义是：',
        options: [
          { text: '统治者先端正自己，才能端正他人', correct: true },
          { text: '政治就是制定严刑峻法' },
          { text: '政治是权力斗争，与道德无关' },
          { text: '政治只需要发展经济' }
        ],
        explain: '「政者正也」把政治与道德连在一起：为政者若自身不正，即使命令也不会被服从。这是德治的思路，与法家「以法为教、以吏为师」形成对比。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '孔子重视「礼」，主要是因为礼：',
        options: [
          { text: '把抽象的情感与伦理落实为可重复的身体实践与社会规范', correct: true },
          { text: '只是贵族显示身份的排场' },
          { text: '可以取代一切法律' },
          { text: '保证人死后升天' }
        ],
        explain: '礼不只是仪式，它规定了父子、君臣、朋友之间如何相处，把仁的情感变成可学习、可传递的行为。没有礼，仁容易流为空洞的好意；没有仁，礼则沦为虚伪的表演。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['ethics'],
        stem: '「父子相隐」的故事常被用来说明：',
        options: [
          { text: '亲亲之情与公共正义之间可能存在张力', correct: true },
          { text: '孔子主张废除一切法律' },
          { text: '儒家认为偷羊是正当的' },
          { text: '家庭关系与伦理无关' }
        ],
        explain: '叶公说「其父攘羊，而子证之」是直，孔子却说「父为子隐，子为父隐，直在其中矣」。这不是鼓励偷窃，而是指出家庭亲情有其伦理分量；如何与公共正义协调，是后世争论的焦点。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '孔子的「正名」主张，最准确的理解是：',
        options: [
          { text: '让名分与相应的责任、行为相符，以维持可预期的秩序', correct: true },
          { text: '给万物重新取名字' },
          { text: '用法律禁止人们说话' },
          { text: '只要名义上正确，行为不重要' }
        ],
        explain: '「君君，臣臣，父父，子子」不是单纯服从，而是每个名分都带着责任：君要像君，父要像父。名实不符，秩序就会混乱；正名是把语言与伦理责任重新对齐。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-8', tier: 2, type: 'multi', difficulty: 2, tags: ['compare'],
        stem: '关于儒家与法家的差异，下列哪些说法正确？（多选）',
        options: [
          { text: '儒家重德治与教化，法家重刑赏与制度', correct: true },
          { text: '孔子认为「道之以德，齐之以礼」能使人「有耻且格」', correct: true },
          { text: '法家主张以法律和官僚制度维持秩序', correct: true },
          { text: '儒家与法家都认为道德教化完全无用' }
        ],
        explain: '儒家相信教化能培养羞耻心与内在约束，法家则认为人皆趋利避害，必须靠明法、必罚与官僚考核。两者并非「一个讲道德、一个讲权力」的简单对立，而是对人性与秩序的不同判断。'
      },

      /* ---------------- ch03 圣经传统 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '《创世记》说人按「神的形象」（imago Dei）被造，这一说法通常被理解为：',
        options: [
          { text: '人有独特的尊严与责任，被托付治理大地', correct: true },
          { text: '人就是神，可以取代神' },
          { text: '人的外貌与神完全相同' },
          { text: '人不需要对自然负责' }
        ],
        explain: '「形象」不是外貌，而是指人具有理性、道德能力与关系性，并被托付「管理」大地。治理不是任意掠夺，而是代表神照料受造界；这一解释在当代生态神学中尤其重要。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '蛇引诱夏娃吃「知善恶树」的果子，这个禁令的核心是：',
        options: [
          { text: '人试图自行定义善恶，取代神的判断', correct: true },
          { text: '人不能吃任何水果' },
          { text: '知识本身绝对有害' },
          { text: '夏娃比亚当更聪明' }
        ],
        explain: '「知善恶」不是单纯获得知识，而是取得自己判定善恶的资格。堕落的本质是自主性的僭越：人不再信任神所划定的界限，而要自己当标准。后果是羞耻、躲藏与推责。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['ethics'],
        stem: '「好撒玛利亚人」的比喻，重点在于：',
        options: [
          { text: '邻舍是任何有需要的人，不分族群与宗教身份', correct: true },
          { text: '撒玛利亚人比犹太人更富有' },
          { text: '祭司与利未人做得对' },
          { text: '只有血缘亲属才值得帮助' }
        ],
        explain: '祭司与利未人看见伤者却绕道走，被歧视的撒玛利亚人却停下来照料。耶稣用这个故事回答「谁是我的邻舍」：问题不是「谁值得我爱」，而是「我愿不愿意成为别人的邻舍」。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '《约伯记》主要挑战了哪一种神学？',
        options: [
          { text: '「受苦必然是犯罪的结果」的报应神学', correct: true },
          { text: '「神创造世界」的创造神学' },
          { text: '「爱邻舍」的伦理教导' },
          { text: '「因信称义」的保罗神学' }
        ],
        explain: '约伯是义人却遭受巨难，三个朋友坚持他一定犯了罪，这就是报应神学。约伯记没有给出简单答案，而是让神在旋风中显现，以受造界的广大反问约伯：人的苦难不能只用因果报应来解释。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '亚伯拉罕献以撒的故事，最核心的宗教问题是：',
        options: [
          { text: '信仰是否要求人放弃最珍视的东西，甚至违背常理', correct: true },
          { text: '以撒是否适合做祭祀' },
          { text: '亚伯拉罕是否富有' },
          { text: '如何用理性证明神存在' }
        ],
        explain: '神要亚伯拉罕献上独子，又在最后一刻阻止。克尔凯郭尔用它说明信仰的「悖论」：亚伯拉罕无法用普遍伦理为自己辩护，只能以对神的信任纵身一跃。这个故事也因此成为信仰与伦理张力的经典案例。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '奥古斯丁与佩拉纠（Pelagius）争论的焦点是：',
        options: [
          { text: '人能否靠自己的意志与善行得救，还是必须依赖神的恩典', correct: true },
          { text: '圣经应该用哪种语言翻译' },
          { text: '教会是否应该拥有财产' },
          { text: '地球是不是宇宙的中心' }
        ],
        explain: '佩拉纠强调人有自由意志，可以靠善行得救；奥古斯丁认为原罪使人意志受损，得救只能靠恩典。这场争论深刻影响了路德的「因信称义」与后世对自由意志的理解。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-8', tier: 2, type: 'tf', difficulty: 2, tags: ['compare'],
        stem: '《古兰经》与《圣经》对神的理解完全相同，包括三位一体。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '《古兰经》坚持严格的独一神论（tawhid），明确反对「三位一体」与「神有子」。它与《圣经》共享亚伯拉罕传统、创世、先知与末日审判等主题，但在神观上有根本分歧。'
      },

      /* ---------------- ch04 佛教与心经 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '四圣谛的正确顺序是：',
        options: [
          { text: '苦、集、灭、道', correct: true },
          { text: '集、苦、道、灭' },
          { text: '灭、道、苦、集' },
          { text: '道、灭、集、苦' }
        ],
        explain: '四圣谛模仿医学诊断：先承认苦（苦），再找出原因（集），确认可以痊愈（灭），最后给出治疗方法（道）。顺序不是随意的，它对应「问题—病因—目标—方案」的推理结构。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '下列哪一项<b>不属于</b>五蕴？',
        options: [
          { text: '恒常不变的自我（ātman）', correct: true },
          { text: '色（身体与物质）' },
          { text: '受（感受）' },
          { text: '行（意志与造作）' }
        ],
        explain: '五蕴是色、受、想、行、识，涵盖物质与心理现象；佛教的「无我」正是说，在这些蕴之外找不到一个恒常不变的自我。把五蕴当成「我」或「我的」，就是苦的根源。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['text'],
        stem: '《心经》「色不异空，空不异色」的意思是：',
        options: [
          { text: '现象与空性不是两个东西，现象当体即空', correct: true },
          { text: '颜色与天空没有关系' },
          { text: '世界完全不存在' },
          { text: '空是一种神秘的液体' }
        ],
        explain: '「不异」是否定两者分离：不是先有「色」再有个「空」藏在后面，而是色本身就是因缘和合、没有自性，所以当体即空。下一句「色即是空，空即是色」把这一不二关系说得更彻底。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '「缘起」（dependent co-arising）的核心主张是：',
        options: [
          { text: '一切现象依条件而生灭，没有独立自存的自性', correct: true },
          { text: '万物由一位造物主创造' },
          { text: '事物永恒不变' },
          { text: '一切皆由偶然产生，没有因果' }
        ],
        explain: '缘起说「此有故彼有，此无故彼无」：现象依条件生起，条件散则灭。因此没有永恒不变的「自性」，但也不是毫无规律的偶然。空性正是缘起的另一面。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '佛教的「业」（karma）最准确的理解是：',
        options: [
          { text: '有意的行为及其在后续生命中留下的倾向与后果', correct: true },
          { text: '命中注定、无法改变的命运' },
          { text: '神对信徒的奖赏与惩罚' },
          { text: '纯粹偶然的运气' }
        ],
        explain: '业不是命定论：它强调行为（尤其是有意图的行为）会熏习成倾向，影响未来，但条件可以改变，修行也能转变业力。把业理解成「注定」会取消伦理责任，正好与佛教的原意相反。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['compare'],
        stem: '大乘佛教与上座部佛教的理想，主要差别在于：',
        options: [
          { text: '大乘以菩萨道普度众生为目标，上座部以阿罗汉的个人解脱为目标', correct: true },
          { text: '大乘不承认四圣谛' },
          { text: '上座部不相信因果' },
          { text: '两者完全相同，没有差别' }
        ],
        explain: '上座部重视戒定慧与个人解脱，阿罗汉是理想；大乘提出菩萨理想，强调慈悲与方便，甚至说「众生无边誓愿度」。两者共享四谛、缘起等基础，但修行目标与对涅槃的理解有差异。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-8', tier: 2, type: 'multi', difficulty: 2, tags: ['compare'],
        stem: '关于中国佛教的禅与净土，下列哪些说法正确？（多选）',
        options: [
          { text: '禅宗强调直指人心、见性成佛，重视坐禅与公案', correct: true },
          { text: '净土宗强调念佛名号、依靠阿弥陀佛的愿力往生净土', correct: true },
          { text: '禅宗偏重自力，净土宗偏重他力', correct: true },
          { text: '两者都否定因果与修行' }
        ],
        explain: '禅宗以「不立文字、直指人心」著称，慧能更强调顿悟；净土以信愿行与念佛为纲，依靠佛的愿力。自力与他力的对比是理想型，实际上中国佛教常禅净双修，并非截然对立。'
      },

      /* ---------------- ch05 亚当·斯密 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '斯密用「别针工厂」的例子主要说明：',
        options: [
          { text: '分工能大幅提高劳动生产率', correct: true },
          { text: '工厂应该雇佣更多童工' },
          { text: '别针是当时最重要的出口商品' },
          { text: '工人越少，效率越高' }
        ],
        explain: '斯密说，十个工人分工协作，一天可做四万八千枚别针，人均四千八百枚；若各自独立完成全部工序，或许连二十枚都做不出来。分工通过专业化、省去换工具的工夫与机器发明，提升了生产力。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '斯密「看不见的手」的核心意思是：',
        options: [
          { text: '个人追求自身利益时，可能在市场机制下无意中促进社会利益', correct: true },
          { text: '有一只神秘的手在操纵价格' },
          { text: '政府应该完全不管经济' },
          { text: '商人总是有意识地服务公众' }
        ],
        explain: '斯密不是说商人利他，而是说市场价格、竞争与分工把自利行为引向满足他人需要。屠夫、酿酒师、面包师给我们晚餐，不是出于仁慈，而是因为他们要谋生；但这一过程受制度与竞争约束，不是无条件的好事。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '斯密除《国富论》外，还写了哪部重要著作，讨论道德情感与正义？',
        options: [
          { text: '《道德情感论》（The Theory of Moral Sentiments）', correct: true },
          { text: '《社会契约论》' },
          { text: '《论自由》' },
          { text: '《资本论》' }
        ],
        explain: '《道德情感论》讨论同情（sympathy）、公正旁观者（impartial spectator）与正义。所谓「斯密问题」就是：一边讲同情，一边讲自利，是否矛盾？多数解释认为两书互补：市场需要正义与信任作背景。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '斯密对分工代价的担忧主要是：',
        options: [
          { text: '长期重复单一工序会使工人变得迟钝、失去全面发展', correct: true },
          { text: '分工会让工人收入过高' },
          { text: '分工会导致人口减少' },
          { text: '分工使机器无法发明' }
        ],
        explain: '斯密在《国富论》第五卷指出，分工使工人一生只做几个简单动作，心智容易退化。他主张用公共教育来补救，这显示他并非无条件赞美分工，也不是「市场万能论」者。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '斯密认为政府应承担的三项职能<b>不包括</b>：',
        options: [
          { text: '直接经营企业、决定生产什么', correct: true },
          { text: '国防' },
          { text: '司法与产权保护' },
          { text: '公共工程与教育' }
        ],
        explain: '斯密列出国防、司法、公共工程与教育三项职能，认为这些事私人市场难以充分提供。他反对的是重商主义的垄断与过度干预，不是主张无政府；「守夜人国家」是对他的简化。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '斯密说「消费是一切生产的唯一目的」，这句话针对的是：',
        options: [
          { text: '重商主义把金银与生产者利益置于消费者之上', correct: true },
          { text: '消费者应该节俭，不买东西' },
          { text: '政府应该限制消费' },
          { text: '商人比消费者更重要' }
        ],
        explain: '重商主义认为财富就是金银，鼓励出口、限制进口，牺牲消费者利益来保护生产者。斯密反过来说，生产是为了满足人的需要，消费者利益才是最终标准；垄断与关税往往让少数商人得利、多数人受损。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-8', tier: 2, type: 'mcq', difficulty: 2, tags: ['compare'],
        stem: '斯密与马克思对分工的看法，最关键的区别是：',
        options: [
          { text: '斯密把分工视为生产力进步，马克思则看到分工背后的异化与阶级关系', correct: true },
          { text: '斯密支持分工，马克思也完全支持分工' },
          { text: '两人都认为分工与所有制无关' },
          { text: '马克思否认分工能提高效率' }
        ],
        explain: '斯密承认分工提高效率，也担忧工人变迟钝；马克思则进一步追问：谁拥有生产资料、谁承担枯燥劳动？在资本主义下，分工不只是技术问题，而是资本控制劳动、工人被片面化的方式。'
      },

      /* ---------------- ch06 马克思与异化 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '马克思「异化劳动」的四重规定<b>不包括</b>：',
        options: [
          { text: '人与自然的和谐相处', correct: true },
          { text: '劳动者与劳动产品相异化' },
          { text: '劳动者与生产活动相异化' },
          { text: '人与自己的类本质相异化' }
        ],
        explain: '四重规定是：产品、生产活动、类本质、人与人。马克思说，工人生产的财富越多，他自己越贫乏；劳动不是自由自觉的活动，而是外在的强制；人把类生活当作谋生手段；最终人同人相异化。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '「劳动产品异化」的意思是：',
        options: [
          { text: '工人生产的产品成为异己的力量，反过来支配工人', correct: true },
          { text: '工人不喜欢自己生产的产品' },
          { text: '产品被卖到外国市场' },
          { text: '工人拥有全部产品' }
        ],
        explain: '在资本主义下，工人生产的产品不属于自己，而属于资本家；产品越多，资本越强大，工人越依赖市场。马克思说，物化劳动积累为资本，资本又反过来支配活劳动，这就是产品的异化。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '马克思的「剩余价值」是指：',
        options: [
          { text: '工人创造的价值超过其工资的部分，被资本家无偿占有', correct: true },
          { text: '商品售价减去成本后的全部利润' },
          { text: '工人储蓄下来的钱' },
          { text: '政府征收的税' }
        ],
        explain: '劳动力是一种特殊商品，它的使用能创造比自身价值（工资）更多的价值。这个差额就是剩余价值，是利润、利息与地租的来源。马克思用「剥削」描述这一结构性关系，而不只是道德指责。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '马克思的「意识形态」概念，最准确的理解是：',
        options: [
          { text: '统治阶级的观念被普遍化，使被压迫者把现存秩序当成自然合理', correct: true },
          { text: '任何系统化的思想体系' },
          { text: '科学理论的另一个名字' },
          { text: '个人的偶然想法' }
        ],
        explain: '在《德意志意识形态》中，马克思说「统治阶级的思想在每一时代都是占统治地位的思想」。意识形态不是简单的谎言，而是让特定阶级的利益看起来像普遍真理；批判的任务是揭示其社会条件。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '马克思设想的共产主义社会中，劳动应当是：',
        options: [
          { text: '自由自觉的活动，而不是单纯谋生的手段', correct: true },
          { text: '由国家统一分配的苦役' },
          { text: '完全不需要劳动' },
          { text: '只由机器完成，人不必参与' }
        ],
        explain: '马克思区分「必然王国」与「自由王国」：物质生产永远需要，但共产主义让人不再被分工固定，可以上午打猎、下午捕鱼、晚上从事批判。劳动从外在强制变成自我实现，这是类本质的恢复。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '「工人成为机器的附肢」这一说法，描述的是：',
        options: [
          { text: '机器支配劳动节奏，工人只承担局部、重复的动作', correct: true },
          { text: '工人拥有机器的一部分产权' },
          { text: '工人维修机器的技术很高' },
          { text: '机器完全由工人控制' }
        ],
        explain: '在工厂制度中，机器体系规定了生产的速度与工序，工人不是使用机器的主人，而是被机器使用的「器官」。马克思以此说明分工与技术的结合如何加深异化，而不仅是提高效率。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-8', tier: 3, type: 'multi', difficulty: 3, tags: ['critique'],
        stem: '下列哪些是对马克思的常见批评？（多选）',
        options: [
          { text: '经济决定论：过度强调经济基础，低估文化与政治的作用', correct: true },
          { text: '道德相对主义：把道德视为阶级利益的产物，难以谴责不义', correct: true },
          { text: '历史预测失败：先进工业国没有先发生革命，苏联实验出现集权', correct: true },
          { text: '马克思完全否认阶级的存在' }
        ],
        explain: '常见批评包括经济决定论、道德相对主义、历史预测失败，以及苏联实验的教训。马克思本人并非简单否认文化或道德，但他的理论确实把经济关系放在解释社会结构的核心，这是争论所在。'
      },

      /* ---------------- ch07 密尔与自由 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '密尔的「伤害原则」（harm principle）主张：',
        options: [
          { text: '干涉他人自由的唯一正当理由是防止其伤害他人', correct: true },
          { text: '只要为了对方好，就可以强制他' },
          { text: '自由是没有边界的' },
          { text: '多数人同意就可以限制任何行为' }
        ],
        explain: '密尔说，一个人自己的好处——身体上的或道德上的——都不足以成为强制他的理由。只有当行为伤害他人时，社会才有权干涉；仅涉及本人的行为，个人对自己的身心拥有主权。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '下列哪一项<b>不是</b>密尔为言论自由提出的论证？',
        options: [
          { text: '多数人投票通过的意见必然是真理', correct: true },
          { text: '被压制的意见可能是正确的，压制它让我们失去纠错机会' },
          { text: '即使意见正确，不被挑战也会变成僵死的教条' },
          { text: '多数意见与少数意见各含部分真理，需要交锋' }
        ],
        explain: '密尔恰恰反对「多数即真理」。他的论证是可错性、僵死教条与部分真理；他还指出，压制意见预设了自己不会错，而历史上无数「异端」后来被证明正确。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '按密尔的区分，下列哪一项属于「冒犯」而非「伤害」？',
        options: [
          { text: '一个人发表了让你非常不舒服的批评意见', correct: true },
          { text: '一个人殴打你致伤' },
          { text: '一个人偷走你的钱包' },
          { text: '一个人散布关于你的虚假事实，使你失去工作' }
        ],
        explain: '伤害是对他人权利或利益的实际侵害，如殴打、盗窃、诽谤；冒犯只是让人不适。密尔允许对冒犯进行批评与劝告，但不允许用法律强制；这个区分是言论自由争论的关键。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '密尔所说的「多数人的暴政」主要指：',
        options: [
          { text: '多数人通过舆论、习俗与法律压迫少数人的生活方式', correct: true },
          { text: '多数人通过选举更换政府' },
          { text: '少数人统治多数人' },
          { text: '君主独裁' }
        ],
        explain: '密尔担心的不是传统的王权，而是民主时代的「社会暴政」：多数人以「公共意见」为名，把不合常规的人边缘化。这种压迫不一定违法，却可能比法律更深入地侵入个人生活。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '密尔为什么重视「个性」（individuality）与「生活实验」？',
        options: [
          { text: '不同的生活方式互相竞争，能促进个人发展与社会进步', correct: true },
          { text: '因为标新立异本身就是道德义务' },
          { text: '因为传统习俗完全没有价值' },
          { text: '因为只有天才才配拥有自由' }
        ],
        explain: '密尔认为，人不是按同一个模子铸造的；允许不同生活方式尝试，才能让个人发现自己的天性，也让社会保持活力。他反对的是无反思地服从习俗，不是反对经过思考的传统。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['compare'],
        stem: '密尔与卢梭对自由的理解，最关键的分歧是：',
        options: [
          { text: '密尔强调个人免于干涉的消极自由，卢梭强调服从公意的积极自由', correct: true },
          { text: '密尔支持君主制，卢梭支持民主制' },
          { text: '密尔否认自由的重要性，卢梭重视自由' },
          { text: '两人都认为自由就是做任何想做的事' }
        ],
        explain: '卢梭说服从公意就是服从自己的真正意志，甚至说「强迫他自由」；密尔则警惕任何以「真正自我」或「公意」为名的强制。一个把自由寄托在共同体的自我统治，一个寄托在个人免受共同体压迫。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '密尔的自由理论完全不需要功利主义，他只诉诸自然权利。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '密尔是功利主义者，但他把自由视为「人类作为进步存有」的长期利益，而不是每次都计算快乐。他用功利为自由辩护，同时区分高级快乐与低级快乐；把他读成自然权利论者，会忽略《论自由》的后果论基础。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
