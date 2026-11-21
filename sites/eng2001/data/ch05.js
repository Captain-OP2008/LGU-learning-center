/* =====================================================================
 * ch05.js · 第 5 章「论证结构：让每个主张都落在证据上」
 * 职责：claim-data-warrant 最小结构、Toulmin 六要素、证据等级、常见谬误、
 *       让步与反驳、PEEL 段落，以及全文层面的论证编排。
 * 依据：Week 6 Class 1（论证结构）讲义；Research Project 评分量表中
 *       「论点的支撑与推理」维度。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch05',
  num: '05',
  title: '论证结构：让每个主张都落在证据上',
  en: 'ARGUMENT',
  goals: [
    '用 claim、data、warrant 三件套检查一段话是否构成论证',
    '把一段日常议论改写成含 qualifier 与 rebuttal 的 Toulmin 结构',
    '按证据等级排列手头材料，并说明某项证据为何不足以支撑某个强度的主张',
    '识别六种常见逻辑谬误，并在自己的草稿里标出至少两处',
    '写出一个含让步与反驳的 PEEL 段落，使论点在压力下仍站得住'
  ],
  kp: [
    { id: 'ch05-1', title: '论证的最小单位' },
    { id: 'ch05-2', title: 'Toulmin 六要素' },
    { id: 'ch05-3', title: '证据等级' },
    { id: 'ch05-4', title: '六种常见谬误' },
    { id: 'ch05-5', title: '让步与反驳' },
    { id: 'ch05-6', title: 'PEEL：一段话的论证' },
    { id: 'ch05-7', title: '全文的论证编排' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么「有观点」不等于「有论证」', html: '<code>AI feedback is useful for students.</code> 这句话有观点，但没有论证。老师问一句 <b>How do you know?</b>，你答「大家都这么说」，论证就结束了。学术写作的要求不是让你更有观点，而是让你能回答这一问，并且<b>回答到别人无法轻易推翻</b>。这一章给出一副骨架：主张、证据、担保、限定、反驳——五个位置填满，一段话才真正站得住。' },

    { t: 'p', lead: true, html: '论证（argument）不是争吵，也不是修辞技巧的堆叠。它是一套<b>把理由和结论连接起来的可见结构</b>：读者能指出你的主张是什么、证据在哪、从证据到主张靠什么假设搭桥、这个结论在什么条件下成立、反例出现时你怎么回应。结构可见，论证才能被检验；结构隐去，读者只能选择信或不信。' },

    { t: 'h', lvl: 2, text: '一、论证的最小单位', id: 'ch05-1' },

    { t: 'p', html: '一段话要构成论证，至少需要三件东西：<b>主张（claim）</b>——你想让别人接受什么；<b>证据（data / grounds）</b>——你拿什么支持它；<b>担保（warrant）</b>——为什么这些证据能支持这个主张。第三件最容易被省略，也最容易被质疑。前两件写出来是「有观点有数据」，第三件写出来才叫「有推理」。' },

    { t: 'p', html: '看一个缺担保的例子：<code>Students prefer teacher feedback. In our survey, 68% agreed that teacher comments were more useful than peer comments.</code> 主张与证据都在，但中间缺一句：<b>为什么「同意更有用」等于「偏好」</b>？也许他们只是认为教师更有权威，并不代表更愿意采纳。补上担保：<code>Because stated usefulness is a reasonable proxy for the feedback students choose to act on ...</code>，论证才闭合。' },

    { t: 'compare', left: { title: '断言（assertion）', html: '<code>Peer feedback is ineffective because students do not trust each other.</code><br><br>「because」后面是另一个断言，不是证据。整句是两个主张互相支撑，读者只能接受或拒绝，无法检验。' }, right: { title: '论证（argument）', html: '<code>Peer feedback may be less effective than expected: in Yu and Lee\'s (2014) account of L2 writing classrooms, students frequently switched to their first language when evaluating peers\' texts, which suggests that the criteria were not fully shared.</code><br><br>主张带 qualifier（may be less effective），证据指向具体现象（语码转换），担保显式（criteria not shared），读者可以就任何一环提出异议。' } },

    { t: 'p', html: '担保之所以重要，是因为它暴露了论证的<b>隐含前提</b>。很多争论其实不是证据之争，而是担保之争：同一组数据，一方认为「满意度高说明教学有效」，另一方认为「满意度只说明期望被满足」。把担保写出来，争论才能聚焦；不写出来，双方会一直互相提供更多数据，却永远说不到一起。' },

    { t: 'h', lvl: 2, text: '二、Toulmin 六要素', id: 'ch05-2' },

    { t: 'p', html: 'Toulmin 模型把论证拆成六个位置，比三件套更细。它不是为了让你在论文里标注「这是 warrant」，而是为了让你在写作时<b>检查有没有位置空着</b>。空着的位置，就是审稿人和评分者会追问的地方。' },

    { t: 'table', caption: 'Toulmin 六要素：位置、作用与在论文里的样子', head: ['要素', '作用', '论文中的典型表述'], rows: [
      ['Claim', '你希望读者接受的主张', 'This study argues that ...'],
      ['Grounds / Data', '支撑主张的证据', 'Interview data from 14 students show ...'],
      ['Warrant', '证据到主张的桥梁（通常隐含）', 'Because stated preference predicts uptake ...'],
      ['Backing', '对担保本身的支持', 'A similar assumption is adopted by ...'],
      ['Qualifier', '主张的强度与条件', 'in most cases, tends to, may'],
      ['Rebuttal', '反例与例外，以及你的回应', 'This pattern did not hold for ...']
    ] },

    { t: 'p', html: '最容易漏的是 <b>qualifier</b> 与 <b>rebuttal</b>。初学者倾向于把主张写得越绝对越有气势——<code>AI feedback improves writing quality</code>。但在学术写作里，绝对主张意味着你承诺了无限证据：只要有一个反例，整句就倒。加上 qualifier（<code>under timed conditions</code>、<code>for lower-proficiency writers</code>），主张反而更强，因为它变得可防守。' },

    { t: 'p', html: 'Rebuttal 不是示弱，而是<b>预先拆掉对方最强的一击</b>。写 <code>It might be objected that ... However, ...</code> 的段落，读者会认为你想过反面；完全不提反例的段落，读者会自己替你想，而且想到的往往比你更狠。课程评分量表里「acknowledges counter-arguments」这一条，就是在看有没有 rebuttal。' },

    { t: 'h', lvl: 2, text: '三、证据等级', id: 'ch05-3' },

    { t: 'p', html: '不同证据支撑不同强度的主张。粗略地说，证据等级从高到低大致是：<b>你自己收集的一手资料（问卷、访谈、文本）&gt; 同行评审的实证研究 &gt; 系统综述与元分析 &gt; 机构报告与统计年鉴 &gt; 教材与百科 &gt; 新闻与个人经验</b>。等级不是绝对的，但它决定你能把话说多重：用个人经验只能支持「我注意到」，用一手资料可以支持「在本样本中」，用多项实证研究才敢说「普遍而言」。' },

    { t: 'table', caption: '证据类型与它所能支撑的主张强度', head: ['证据', '可以支撑的说法', '不能支撑的说法'], rows: [
      ['一次小样本问卷', '在本课程 42 名学生中，多数报告……', '大学生普遍认为……'],
      ['半结构化访谈', '受访者描述了三种判断反馈的方式……', '学生一般会按以下三步处理反馈'],
      ['已发表实证研究', '已有研究多发现……，但样本集中于……', '研究已经证明……'],
      ['个人观察', '我在批改中注意到……，这提示……', '数据显示……']
    ] },

    { t: 'p', html: '比等级更容易出错的是<b>证据与主张的错配</b>。用「学生说喜欢」去证明「学生学得更好」，用「相关性」去证明「因果」，用「一组数据」去证明「所有群体」——这三类错配在本科论文里极其常见，而且往往不是态度问题，而是没意识到主张的强度需要匹配证据的强度。修正办法很简单：把主张里的绝对词逐个降级（all → many、proves → suggests、causes → is associated with），直到它与你手上的证据相称。' },

    { t: 'p', html: '还有一条实用规则：<b>每个主张至少两个独立来源，或一个你自己的一手来源</b>。单一来源容易被质疑「那篇研究本身有问题」；两个来源相互独立，论证就有了冗余。如果你只有一个来源，就老老实实把它写成「某项研究指出」，而不是「研究表明」。' },

    { t: 'h', lvl: 2, text: '四、六种常见谬误', id: 'ch05-4' },

    { t: 'p', html: '谬误（fallacy）是看起来像论证、实际上推理断裂的结构。下面六种在学术写作里出现频率最高，而且多数不是故意诡辩，而是写作时省了一步。识别它们的用处不是给别人挑错，而是<b>在自己草稿上做体检</b>。' },

    { t: 'table', caption: '六种高频谬误及其修法', head: ['谬误', '它的样子', '怎么修'], rows: [
      ['以偏概全', '由几个个案推出整体结论', '补样本信息，把结论限定在样本范围内'],
      ['虚假两难', '把连续谱写成非此即彼', '增加中间选项，或说明为何只有两极'],
      ['事后归因', '因为 B 发生在 A 之后，就说 A 导致 B', '寻找机制证据或对照，改用「可能相关」'],
      ['稻草人', '把对方观点夸张成更弱的版本再反驳', '引用对方原话，按其最强版本回应'],
      ['诉诸权威', '因为某名人说了，所以成立', '追问该权威是否在本领域、有无证据'],
      ['循环论证', '用结论本身支持前提', '找出独立于结论的证据']
    ] },

    { t: 'p', html: '以偏概全在学生论文里最常见，因为它和「质性研究的有限样本」长得很像。区别在于<b>你有没有声明边界</b>：写「本研究访谈了 8 名大二学生，他们的叙述显示……」，这是有限度的结论；写「大学生普遍认为……」，就是把 8 个人当成了总体。同一批资料，前者可以发表，后者站不住。' },

    { t: 'p', html: '稻草人谬误则常见于文献批评。你想指出某项研究的局限，于是把它概括成一个更容易攻击的版本：「该研究认为反馈越多越好」。但原文可能写的是「在特定任务类型下，反馈频率与修改质量正相关」。正确做法是<b>先准确复述，再指出边界</b>：<code>Their claim holds for timed tasks; whether it extends to unpressured revision remains unclear.</code> 这样既批评了，也没有曲解。' },

    { t: 'h', lvl: 2, text: '五、让步与反驳', id: 'ch05-5' },

    { t: 'p', html: '成熟的论证会主动把最强的反例请进来。这不是为了显得客观，而是因为<b>读者迟早会想到它</b>：你替他说出来并回应，他就得跟着你的思路走；你不说，他就停在反例上，不再往下读。让步（concession）与反驳（rebuttal）通常成对出现，中间用 however、nevertheless、even so 连接。' },

    { t: 'p', html: '让步的写法有三种强度。<b>弱让步</b>：<code>While some studies report no effect, ...</code>（提一句就过）。<b>中让步</b>：<code>It is true that X; however, this applies mainly to ...</code>（承认条件，缩小范围）。<b>强让步</b>：<code>Even if X holds, the present data suggest ...</code>（假设对方成立，仍能推出自己的结论）。强让步最有说服力，也最需要证据支撑。' },

    { t: 'p', html: '反驳要有针对性。<b>反驳证据</b>：指出对方数据来自不同群体；<b>反驳担保</b>：指出从数据到结论的那座桥不成立；<b>反驳前提</b>：指出对方默认了一个未经验证的假设。三种里，反驳担保最有力，因为它直接拆结构，而不是提供另一组可能同样有问题的数据。' },

    { t: 'p', html: '一个常见误区是把让步写成投降：一段话里承认了三处局限，最后没有回到自己的主张，读者会觉得你自己都不信。正确节奏是<b>承认一点 → 限定范围 → 回到主张</b>：<code>Admittedly, the sample is small; nevertheless, the consistency of the pattern across all eight interviews suggests that ...</code> 承认之后一定要有 turn，turn 之后一定要回到 claim。' },

    { t: 'h', lvl: 2, text: '六、PEEL：一段话的论证', id: 'ch05-6' },

    { t: 'p', html: '段落是论证的最小完整单位。PEEL 是一个好用的四步模板：<b>Point（主张）、Evidence（证据）、Explanation（解释证据如何支持主张）、Link（与本段任务或下一段的连接）</b>。它和 Toulmin 不冲突：Point 是 claim，Evidence 是 grounds，Explanation 里藏着 warrant，Link 常常带出 qualifier 或指向反驳。' },

    { t: 'p', html: '写 PEEL 的难点在第三个字母。很多人写完证据就跳到下一段，读者只能自己完成推理。Explanation 要做两件事：<b>指出证据里的哪个细节支持主张</b>，以及<b>排除另一种解读</b>。例如：<code>Three of the eight participants revised only the surface errors marked in red, which suggests that the colour coding, rather than the comment content, drove their attention.</code> 这句既点了细节，也排除了「他们认同内容」这一解读。' },

    { t: 'p', html: 'Link 不必是华丽的过渡句。它可以只做一件事：<b>说明这段在整篇论证里的位置</b>——<code>This pattern matters because it qualifies the assumption that more feedback always leads to more revision.</code> 这类句子读者可能不会注意，但少了它，段落之间就会像并排摆放的积木，而不是一条推进的线。' },

    { t: 'p', html: '段落长度也影响论证可读性。一段超过两百词、包含三个以上主张，读者会记不住你要证明什么。经验做法是<b>一段一个主张</b>，如果发现某段有两个「因此」，就该拆成两段，各自配证据。拆段不是把文章切碎，而是让每个主张都有独立的支撑空间。' },

    { t: 'h', lvl: 2, text: '七、全文的论证编排', id: 'ch05-7' },

    { t: 'p', html: '段落之外，整篇论文也是一条论证链。引言的漏斗负责<b>建立必要性</b>：领域重要 → 已有研究做到哪 → 还缺什么 → 本研究做什么。综述负责<b>证明缺口真实存在</b>。方法负责<b>证明你有能力回答</b>。结果负责<b>呈现回答</b>。讨论负责<b>说明这个回答意味着什么、在什么条件下成立</b>。五块各承担一段推理，任何一块越界，链条就出现重复或断裂。' },

    { t: 'p', html: '一个检查全文论证的简单办法：<b>把每一节的第一句和最后一句抄到一张纸上</b>，连起来读。如果读得通，说明你的论证主线是显性的；如果读不通，说明关键推理藏在段落中间，读者（和评分者）不会替你去找。这个动作十分钟就能做完，性价比极高。' },

    { t: 'p', html: '最后一件事：<b>论证的强度要全文一致</b>。引言里写「本研究试图探讨」，结果章却写「数据证明」，讨论章又写「可能说明」——三处强度不匹配，读者会怀疑你到底发现了什么。定稿前把所有表达强度的词（prove、demonstrate、suggest、may、tend to）列出来，统一到与证据相称的那一档。' },

    { t: 'terms', items: [
      { en: 'claim', zh: '主张', html: '你希望读者接受的结论句。它应当是可被反驳的，否则不构成学术主张。' },
      { en: 'warrant', zh: '担保', html: '连接证据与主张的隐含前提。论证断裂多半断在这里，而不是证据不足。' },
      { en: 'qualifier', zh: '限定语', html: '标注主张强度与适用条件的表达，如 may、in most cases、for novice writers。' },
      { en: 'rebuttal', zh: '反驳', html: '对反例或对立观点的回应。可反驳证据、担保或前提，其中反驳担保最有力。' },
      { en: 'fallacy', zh: '谬误', html: '看似论证实则推理断裂的结构，如以偏概全、稻草人、循环论证。' },
      { en: 'PEEL', zh: '段落四步', html: 'Point、Evidence、Explanation、Link。用于保证一段话有主张、有证据、有推理、有衔接。' },
      { en: 'concession', zh: '让步', html: '主动承认对方观点或自身局限，通常与 however 引出的反驳成对出现。' }
    ] },

    { t: 'quiz', qid: 'ch05-q1' },
    { t: 'quiz', qid: 'ch05-q2' },
    { t: 'quiz', qid: 'ch05-q3' },

    { t: 'keypoint', items: [
      { title: '三件套缺一不可', html: '主张、证据、担保。缺担保的段落看起来有数据，其实没有推理。' },
      { title: '限定语让主张更强', html: '加上条件与强度标记，主张才可防守。绝对化的句子只要一个反例就倒。' },
      { title: '证据强度决定话能说多重', html: '小样本问卷只能说「在本样本中」，多项实证研究才敢说「普遍而言」。' },
      { title: '让步要有 turn', html: '承认一点、限定范围、回到主张。只承认不回收，读者会认为你自己也不信。' },
      { title: '一段一个主张', html: '出现两个「因此」就拆段。全文检查时抄下每节首末句，看主线是否连得起来。' }
    ] },

    { t: 'checklist', id: 'ch05', items: [
      '我能用 claim、data、warrant 三件套检查一段话，并指出缺了哪一件',
      '我能把一句绝对化的主张加上 qualifier，使它与我手上的证据相称',
      '我为自己的核心主张写了 rebuttal，并说清反驳的是证据、担保还是前提',
      '我能按证据等级排列手头材料，并说明某项材料不能支撑哪种强度的说法',
      '我在自己的草稿里找出并修掉了至少两处以偏概全或事后归因',
      '我能识别稻草人谬误，并在批评文献时先准确复述对方观点',
      '我写的段落符合 PEEL，Explanation 里排除了另一种解读',
      '我抄下了全文各节的首末句，能连成一条读得通的论证主线',
      '我统一了全文表达强度的词，没有出现引言试探、结果证明的错位'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应 Week 6 Class 1 的「论证结构」讲义，核心是把论证拆成可检查的位置（claim、data、warrant、qualifier、rebuttal），并对照 Research Project 评分量表中关于论点支撑与反例处理的维度。Toulmin 模型（主张、依据、担保、支持、限定、反驳）是论证研究中的经典框架，本章按其通行版本介绍，未涉及具体页码与版本信息；PEEL 是写作教学中广泛使用的段落模板，并非某位学者的原创理论。六种谬误的命名采用逻辑学与写作教材中的通用说法。文中引用的 Yu 与 Lee（2014）仅作为二语写作课堂中语码转换现象的来源示例，未引用其具体数据或结论；Wang（2018）未被引用。所有英文例句均为构造的教学示例，APA 模板中的作者与年份不指向真实出版物。' }
  ]
});
