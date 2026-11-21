/* =====================================================================
 * ch02.js · 第 2 章「学术语体：正式、客观、精确、简洁」
 * 职责：把口语化的句子改成学术语体，并说明每一步改动背后的理由。
 * 依据：ENG1002 Lecture 07（Formal and Impersonal）、Lecture 12
 *       （Writing Concisely）、Strunk & White《The Elements of Style》。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch02',
  num: '02',
  title: '学术语体：正式、客观、精确、简洁',
  en: 'ACADEMIC STYLE',
  goals: [
    '用六个维度说清学术语体与日常语体的差别',
    '把口语词、缩写、短语动词改写成学术表达，而不靠生僻词堆砌',
    '用被动语态与名词化把「人」从句子中心移开，并知道何时不该用',
    '把模糊量词与绝对化判断改成可核查的数字与有分寸的结论',
    '用五种冗余的检查法，把一段话压缩三分之一而不丢信息'
  ],
  kp: [
    { id: 'ch02-1', title: '六个维度：学术语体与日常语体' },
    { id: 'ch02-2', title: '正式：去口语、去缩写、去短语动词' },
    { id: 'ch02-3', title: '客观：把人从句子中心移开' },
    { id: 'ch02-4', title: '精确：数字、定义与有分寸的判断' },
    { id: 'ch02-5', title: '简洁：五种冗余与改法' },
    { id: 'ch02-6', title: '名词化与被动：用对了才像学术' },
    { id: 'ch02-7', title: '句子长度、信息密度与改写示范' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么句子读起来「不像学术」', html: '把一段作文交给老师，最常见的评语是「too informal」。可到底哪里不正式？很多人的第一反应是换词：把 big 换成 enormous，把 get 换成 obtain，把 think 换成 deem。换完读起来更怪了。<b>学术语体不是「更难的词」，而是一整套关于读者、证据与分寸的约定</b>：谁在说、对谁说、说到什么程度、哪些信息必须给出来。这一章把这套约定拆成可操作的六条，每条都配改写示范。' },

    { t: 'p', lead: true, html: '先看两句话。<b>A：</b>「We looked into why students don’t exercise much and found out that it’s basically because the gym is too far.」<b>B：</b>「An investigation of students’ exercise habits found that distance from campus sports facilities was the main barrier to regular physical activity.」两句话说的是同一件事，但 A 是聊天，B 是学术写作。差别不在信息量，而在<b>信息来源的处理方式</b>：A 把「我们」放在前面，用 looked into、found out 这类口语动词，用 basically 表示不确定；B 把「研究」放在主语位置，用 investigation、barrier 这类名词，把结论说得明确但不夸张。' },

    { t: 'p', html: '这一章的目标不是让你每句话都写成 B。学术写作里也有短句、也有主动语态、也有「我们」。目标是让你<b>知道每一次选择的代价</b>：用口语词会显得随意，用过度正式的词会显得做作；用第一人称会显得主观，全用被动会显得躲闪；把话说死会超出证据，全用 may 又显得没结论。语体是一组旋钮，不是一个开关。' },

    { t: 'h', lvl: 2, text: '一、六个维度：学术语体与日常语体', id: 'ch02-1' },

    { t: 'p', html: '课程讲义把学术语体与日常语体的差别拆成六个维度：<b>读者、内容、句式、组织、语气、词汇</b>。六个维度里，读者是最根本的一个——学术写作的读者是「同一共同体里持怀疑态度的同行」，他们不满足于「我觉得」，要求你给出处、给限定、给反方。其余五个维度都是这个读者要求的后果。' },

    { t: 'table', caption: '六个维度的对照；写完后逐行自问：我这一篇更像左边还是右边', head: ['维度', '日常语体', '学术语体'], rows: [
      ['读者', '朋友、同学，共享背景，允许省略', '持怀疑态度的同行，背景不完全共享，必须交代清楚'],
      ['内容', '个人经历、感受、常识', '可核查的证据、数据、文献，个人经历只作引子'],
      ['句式', '短句、省略、反问、感叹', '完整句为主，允许复杂句，但一句一个主要意思'],
      ['组织', '想到哪写到哪，靠语气衔接', '主张先行，段落有主题句，段间有明确逻辑'],
      ['语气', '情绪化、绝对化、口语化', '中立、审慎、有分寸，结论不超出证据'],
      ['词汇', '基本词、短语动词、俚语', '通用学术词汇（AWL）、术语、精确的数量表达']
    ] },

    { t: 'p', html: '六个维度里，<b>词汇最容易改，也最容易被改坏</b>。有人把「a lot of」换成「a plethora of」，把「important」换成「paramount」，读起来像翻译软件。判断一个词该不该用，标准不是「难不难」，而是<b>它是否比原词更准确</b>。如果两个词意思一样，用简单的那个；如果一个词能表达更精确的程度或范围，用它。这条规则能挡掉九成的「高级词误用」。' },

    { t: 'p', html: '另一个常见误解是「学术写作不能有感情」。准确地说，学术写作不能<b>用情绪代替论证</b>。「This shocking result shows that the policy is a disaster」的问题不在 shocking，而在「a disaster」是一个没有标准的判断。改成「This result is inconsistent with the policy’s stated goal of reducing waiting times」，情绪没了，信息多了。' },

    { t: 'h', lvl: 2, text: '二、正式：去口语、去缩写、去短语动词', id: 'ch02-2' },

    { t: 'p', html: '正式化的第一层是<b>删掉口语标记</b>。缩写（don’t、it’s、can’t）在学术写作里一律展开；感叹号、反问句、直接称呼读者（you）都不出现；俚语与网络用语（kids、a lot、stuff、kind of、pretty good）换成中性表达。这些规则不需要理由，它们是体裁的入场券，就像穿正装参加答辩。' },

    { t: 'p', html: '第二层是<b>短语动词</b>（phrasal verbs）。英语口语大量使用「动词 + 介词」的组合：find out、look into、come up with、deal with、go up、put off。这些短语在口语里自然，在学术写作里显得随意，而且往往有更精确的单词对应。改写时不要查同义词词典，先问自己：这个动作的准确含义是什么？' },

    { t: 'table', caption: '常见口语表达与学术改写；右边不是「更高级」，而是「更准确」', head: ['口语表达', '学术改写', '改写的理由'], rows: [
      ['find out', 'discover / determine', '区分「偶然发现」与「通过分析确定」'],
      ['look into', 'investigate / examine', '指明是系统调查而非随意看看'],
      ['come up with', 'propose / develop', '区分「提出一个想法」与「发展一套方案」'],
      ['deal with', 'address / manage', '区分「处理问题」与「管理持续状态」'],
      ['go up / go down', 'increase / decrease / rise / decline', '区分方向与幅度，避免含糊'],
      ['put off', 'postpone / delay', '区分「主动推迟」与「被动延误」'],
      ['a lot of', 'many / numerous / a substantial proportion of', '按可数性与比例选择'],
      ['things / stuff', 'factors / materials / issues（按实际所指）', '迫使自己说清到底是什么'],
      ['and so on / etc.', '列出主要项，或改用 such as + 两类代表', '避免用省略号掩盖没想清楚'],
      ['I think / I feel', 'This essay argues / The evidence suggests', '把个人意见变成可检验的主张']
    ] },

    { t: 'p', html: '第三层是<b>避免「词典式」与「口号式」表达</b>。学术写作不引用词典定义（除非论文本身研究词典），也不用「In today’s society」「Since the beginning of time」这类空开头。这两种写法的共同问题是<b>用现成的句子回避自己的判断</b>。读者一眼就能看出来：这段话换成任何题目都成立，说明它没有提供任何信息。' },

    { t: 'p', html: '还有一个小细节：<b>缩写与符号的使用要统一</b>。第一次出现一个术语时给出全称与缩写，之后统一用缩写；数字在句首拼写出来，十以下的数字通常拼写，百分比用数字加 %。这些规则本身不重要，重要的是<b>全文一致</b>——不一致会让读者分心，也会让评分者怀疑你没有校对。' },

    { t: 'h', lvl: 2, text: '三、客观：把人从句子中心移开', id: 'ch02-3' },

    { t: 'p', html: '学术写作的「客观」不是「没有作者」，而是<b>让主张接受证据的检验，而不是靠作者的权威</b>。最直接的做法是把「人」从主语位置移开：不说「I found that distance matters」，而说「The analysis shows that distance matters」；不说「We can see a decline」，而说「The data show a decline」。这样读者关注的就不是「你怎么想」，而是「证据说明什么」。' },

    { t: 'p', html: '第一人称在学术写作里并非绝对禁止。在描述研究步骤时，「We surveyed 120 students」比「A survey of 120 students was conducted」更清楚，也更诚实；在表达判断时，「I argue」在某些学科里完全正常。但在 ENG1002 的作文里，课程要求<b>避免第一、第二人称</b>，理由很实际：这类作文考的是「能否用证据支持判断」，一旦出现「I think」，评分者会怀疑你的结论只是个人偏好。' },

    { t: 'p', html: '把「人」移开的两个主要工具是<b>被动语态</b>与<b>名词化</b>。被动语态把受事放在主语位置：「The policy was implemented in 2019.」名词化把动作变成名词：「The implementation of the policy…」。两者都能让句子显得客观，但都有代价：被动会隐藏施动者（谁实施的？），名词化会让句子变长、动作变抽象。用之前先问：<b>我需要隐藏施动者吗？这个动作比执行它的人更重要吗？</b>' },

    { t: 'p', html: '一个常见的过度客观化例子：「The utilization of the implementation of the policy resulted in a reduction in the level of satisfaction.」这句话里四个名词化叠在一起，读者要拆半天才知道「政策实施后满意度下降了」。改成「Implementing the policy reduced satisfaction」——同样的信息，一半的词。客观不等于绕弯子。' },

    { t: 'p', html: '个人副词也要清理：amazingly、surprisingly、obviously、clearly、of course。这些词在暗示「读者应该和我一样觉得」，但读者未必。如果结果真的出乎意料，用事实说明为什么意外（「contrary to the 2019 estimate」）；如果结论显而易见，就不需要说 obviously。' },

    { t: 'h', lvl: 2, text: '四、精确：数字、定义与有分寸的判断', id: 'ch02-4' },

    { t: 'p', html: '精确的第一条是<b>把模糊量词换成可核查的表达</b>。「many students」「often」「a significant improvement」听起来像有数据，其实什么也没说。改成「62 of the 120 students surveyed」「in four of the five semesters」「a 12-percentage-point increase」——读者能核对，结论才有分量。如果没有数据，就老实说「in the studies reviewed here」，不要用 many 假装有。' },

    { t: 'table', caption: '模糊表达与精确表达的对照；改写的关键是「能不能被核对」', head: ['模糊表达', '问题', '精确改写'], rows: [
      ['many / a lot of', '多少算多？', '62 of 120 respondents（给出分子分母）'],
      ['often / usually', '频率不明', 'in four of the five semesters（给出次数与总数）'],
      ['recently', '相对谁而言？', 'between 2019 and 2023（给出区间）'],
      ['significant', '统计显著还是幅度大？', 'statistically significant (p < .05) 或 a 12-point increase'],
      ['improve / get better', '哪个指标变好？', 'scores rose from 61 to 73（给出指标与数值）'],
      ['some researchers', '谁？', 'Chen and Lo (2024)（给出作者与年份）'],
      ['etc.', '还有哪些？', '列出主要三类，或用 such as A and B'],
      ['prove', '单个研究证明不了', 'suggest / provide evidence that']
    ] },

    { t: 'p', html: '第二条是<b>第一次出现术语时给定义</b>。什么叫「heavy social media use」？每天三小时还是五小时？什么叫「low-income family」？按什么标准划分？不定义，读者只能按自己的理解读，你的结论就不可复现。定义不需要很长，一句话就够：「In this essay, heavy use refers to more than three hours of daily use on non-academic platforms.」' },

    { t: 'p', html: '第三条是<b>避免绝对化</b>。all、every、never、always、none、proves 这些词在学术写作里几乎总是过强。一个有 120 人的样本，说明不了「所有大学生」；一个相关性，证明不了因果。改成 most、rarely、is associated with、suggests，结论仍然有力，但站得住。这不是胆小，而是<b>让结论的强度与证据的强度匹配</b>。' },

    { t: 'p', html: '第四条是<b>分清事实、推断与评价</b>。事实：「The survey response rate was 38%.」推断：「A low response rate may bias the estimate.」评价：「The survey design is therefore weak.」三者可以写在同一段里，但要用不同的语言标记：「The response rate was 38%, which may bias the estimate; this limits the strength of the conclusion.」读者能清楚知道哪句是数据、哪句是你的判断。' },

    { t: 'h', lvl: 2, text: '五、简洁：五种冗余与改法', id: 'ch02-5' },

    { t: 'p', html: 'Strunk 与 White 有一句被引用了一百年的判词：「Vigorous writing is concise. A sentence should contain no unnecessary words, a paragraph no unnecessary sentences, for the same reason that a drawing should have no unnecessary lines and a machine no unnecessary parts.」（Strunk & White, 1999, p. 90）简洁不是把文章写短，而是<b>让每一个词都承担信息</b>。课程讲义把冗余分成五类，每一类都有固定的改法。' },

    { t: 'p', html: '<b>第一类：冗余短语。</b>英语里有一批「长得像正式表达、其实只是把一个词拉长」的短语：due to the fact that → because；at this point in time → now；in order to → to；with regard to → regarding；despite the fact that → although。它们不带来任何额外信息，只增加阅读负担。' },

    { t: 'table', caption: '讲义里的冗余短语与单词对应；左边越「正式」，往往越啰嗦', head: ['冗余表达', '简洁改写'], rows: [
      ['at this point in time', 'now'],
      ['due to the fact that', 'because'],
      ['despite the fact that', 'although / even though'],
      ['with regard to', 'regarding / about'],
      ['in order to', 'to'],
      ['repeat again', 'repeat'],
      ['all of the', 'all'],
      ['each and every', 'every'],
      ['to have a dislike for', 'to dislike'],
      ['to conduct an investigation of', 'to investigate'],
      ['to make an analysis of', 'to analyze'],
      ['consensus of opinion', 'consensus'],
      ['past history', 'history'],
      ['small in size', 'small'],
      ['attractive in appearance', 'attractive'],
      ['proposed plan', 'plan']
    ] },

    { t: 'p', html: '<b>第二类：无意义的修饰语。</b>really、quite、very、highly、greatly、incredibly、truly、absolutely、essentially、totally、literally、virtually——这些词不改变命题的真假，只表达说话人的态度。删掉它们，句子不会损失信息；保留它们，读者会怀疑你在用语气弥补证据。「This is a very important finding」不如「This finding changes the estimated cost by 40%」。' },

    { t: 'p', html: '<b>第三类：空表达。</b>「Needless to say」「It is my opinion that」「In my opinion, I think」「What I am trying to say is」「The point I am trying to make is」——这些短语的作用是拖延，不是表达。删掉之后直接从主张开始，句子反而更有力。<b>第四类：多余的 there be 句。</b>「There are twelve researchers who studied this topic」改成「Twelve researchers studied this topic」，主语从虚位变成实位，句子短了六个词。' },

    { t: 'p', html: '<b>第五类：该用代词却重复名词。</b>「The chameleon uses protective coloration to blend in with its environment. In addition to being able to change its color, the chameleon also has an extraordinarily long tongue.」第二句的 the chameleon 可以换成 it：「It also has an extraordinarily long tongue.」重复名词会让读者以为你在说另一只变色龙；该用代词时不用，是另一种冗余。' },

    { t: 'p', html: '五类冗余的共同点是：<b>它们都不携带新信息，却占用读者的注意力</b>。检查方法很简单：逐句问「删掉这个词/短语，意思变了吗？」不变就删。一段 150 词的文字，按这五类清理一遍，通常能压到 110 词左右，而信息一点不少。压缩之后如果读起来更清楚，说明原来的字确实是多余的。' },

    { t: 'h', lvl: 2, text: '六、名词化与被动：用对了才像学术', id: 'ch02-6' },

    { t: 'p', html: '名词化（nominalisation）是把动词或形容词变成名词：implement → implementation，reduce → reduction，analyze → analysis。它的好处是<b>能把一个动作打包成一个「东西」，放进更大的句子里</b>：「The reduction in waiting times was larger than the reduction in costs.」两个比较对象都是名词，句子结构对称，读起来紧凑。' },

    { t: 'p', html: '坏处是<b>动作被藏起来了</b>：谁在减？减的是什么？什么时候减的？「The implementation of the reform led to an improvement in efficiency」这句话里，实施者、改革内容、效率指标全部缺席。读者只能猜。过度名词化的文章读起来像「僵尸名词」在互相碰撞，每个名词都正确，合起来没有画面。' },

    { t: 'p', html: '一个平衡的做法：<b>一段话里最多用两到三个名词化，而且只用在「这个动作本身是讨论对象」的地方</b>。如果动作的执行者是重点，用动词：「The government implemented the reform in 2019.」如果动作的结果是重点，可以用名词化：「The reform’s implementation took three years.」判断标准是<b>读者更需要知道「谁做的」还是「做成了什么」</b>。' },

    { t: 'p', html: '被动语态同理。它在三种情况下最有用：施动者未知（「The samples were collected in 2022」）、施动者不重要（「The data were analyzed using Python」）、需要把受事放在句首以衔接上文（「This gap was first identified by Chen and Lo (2024)」）。在其他情况下，主动语态更短、更清楚。全篇被动会让文章显得没有作者，也容易掩盖「谁该负责」这一关键信息。' },

    { t: 'p', html: '课程讲义把「使用被动语态与名词化」列为学术语体的特征，但没有说「越多越好」。<b>特征是默认选项，不是强制命令</b>。一段话里如果每一句都是被动加名词化，读者的阅读速度会下降一半，理解成本上升，评分者也会觉得你在模仿而非写作。目标是「读起来像学术」，不是「读起来像论文模板」。' },

    { t: 'h', lvl: 2, text: '七、句子长度、信息密度与改写示范', id: 'ch02-7' },

    { t: 'p', html: '学术句子的平均长度大约 15–25 词，超过 35 词就开始考验读者。长句本身不是错，错在<b>一句话里塞了三个主张</b>。判断方法：找出这句话的每个动词，如果一个动词对应一个独立的主张，而句子里有三个以上，就该拆。拆句不是把句子变简单，而是让每个主张都有机会被证据支持。' },

    { t: 'p', html: '还有一种更难发现的问题：<b>名词串</b>。英语允许名词修饰名词，但超过三个就难读：「student physical activity facility access barrier study」——读者要在脑子里加四个介词才能拼出意思。改成「a study of the barriers that students face in accessing physical activity facilities」，词多了，但一次就能读懂。' },

    { t: 'p', html: '下面这段是常见的「中式学术英语」，我们分四步改。<b>原文：</b>「With the rapid development of society, more and more university students are not doing enough physical exercise, which is a very serious problem that needs to be paid attention to by us, and there are many reasons such as they are too busy and the gym is too far.」' },

    { t: 'steps', items: [
      { title: '第一步 · 砍空开头与绝对化', html: '「With the rapid development of society」与题目无关，删；「more and more」改成可核查的趋势；「very serious」是评价，需要标准。' },
      { title: '第二步 · 拆句', html: '原句有四个主张：锻炼减少、问题严重、原因很多、原因是忙与远。拆成三句：现象、后果、原因。' },
      { title: '第三步 · 换掉口语与冗余', html: '「not doing enough」→「falling below recommended levels」；「needs to be paid attention to by us」→「requires attention」；「such as」后的例子要与主张对应。' },
      { title: '第四步 · 补限定与出处', html: '加上时间、样本与来源；把「many reasons」改成「two commonly cited reasons」，让读者知道你要讨论几个。' }
    ] },

    { t: 'p', html: '<b>改写后：</b>「Between 2015 and 2023, the share of university students meeting recommended physical activity levels fell from 48% to 31% (Chen & Lo, 2024). This decline matters because inactivity is associated with poorer sleep and higher rates of anxiety. Two explanations are commonly offered: increased academic workload and the distance between residences and sports facilities.」三段信息，三个句子，每一句都能被核对。字数比原文少，信息比原文多。' },

    { t: 'compare', caption: '同一段话的两种写法：右边不是「更高级」，而是「更清楚」', left: { title: '口语化 + 冗余', items: ['「A lot of students don’t exercise because they are very busy and the gym is really far away.」', '「It is obvious that something must be done about this problem.」', '「There are many researchers who think that this is a big issue.」'] }, right: { title: '学术语体', items: ['「Students who report fewer than three hours of free time per week are 30% less likely to exercise regularly (Chen & Lo, 2024).」', '「If the pattern persists, the university’s health budget will face higher demand.」', '「Chen and Lo (2024) estimate that distance explains about half of the variation in exercise frequency.」'] } },

    { t: 'p', html: '改写的最后一步是<b>朗读</b>。出声读一遍，凡是读起来喘不过气、或者读完忘了主语在哪的句子，都需要改。朗读还能抓出重复：同一个词在三句话里出现四次，读者会觉得你词汇量不够；同一个意思用三种说法讲了三遍，读者会觉得你在凑字数。改完再读一遍，如果比原来顺，说明改对了。' },

    { t: 'terms', items: [
      { en: 'register', zh: '语域', html: '语言使用的正式程度与场合匹配度。学术语域不等于「最难」，而是「最准确、最有分寸」。' },
      { en: 'nominalisation', zh: '名词化', html: '把动词或形容词变成名词，如 implement → implementation。能压缩信息，也会隐藏施动者。' },
      { en: 'passive voice', zh: '被动语态', html: '把受事放在主语位置。适合施动者未知、不重要或需要衔接上文时，不宜全篇使用。' },
      { en: 'hedging', zh: '模糊限制', html: '用 may、suggests、tends to 等词把结论限制在证据范围内。ch07 详讲。' },
      { en: 'redundancy', zh: '冗余', html: '不携带新信息的词或短语，如 due to the fact that、very、in my opinion。' },
      { en: 'phrasal verb', zh: '短语动词', html: '动词加介词/副词构成的组合，如 find out、look into。口语常用，学术写作多换单词动词。' },
      { en: 'precision', zh: '精确', html: '用可核查的数字、明确的定义与匹配证据强度的结论，替代模糊量词与绝对化判断。' }
    ] },

    { t: 'quiz', qid: 'ch02-q1' },
    { t: 'quiz', qid: 'ch02-q2' },
    { t: 'quiz', qid: 'ch02-q3' },

    { t: 'keypoint', items: [
      { title: '语体是六个维度的组合', html: '读者、内容、句式、组织、语气、词汇。读者是根，其余五项是后果。' },
      { title: '正式化先删口语标记', html: '缩写、反问、感叹、you、俚语、短语动词。改写时先问准确含义，别查同义词词典。' },
      { title: '客观靠移开「人」，不靠装腔', html: '被动与名词化各有用处，但过度使用会隐藏施动者、拉长句子。一段两三个名词化足够。' },
      { title: '精确＝可核查', html: 'many → 62 of 120；often → four of five semesters；prove → suggest。术语首现给定义。' },
      { title: '简洁＝每个词都有信息', html: '冗余短语、无意义修饰语、空表达、多余 there be、该用代词却重复名词。' },
      { title: '长句要拆，名词串要展开', html: '一句话三个以上独立主张就拆；三个以上名词连用就加介词。' }
    ] },

    { t: 'checklist', id: 'ch02', items: [
      '我能用六个维度说出一段话为什么「不像学术」',
      '我能把 find out、look into、come up with 改成更准确的单词动词',
      '我知道被动语态与名词化各自适合什么场合，以及过度使用的代价',
      '我能把「many students often improve a lot」改成可核查的表达',
      '我能给一个模糊术语下操作性定义，并说明为什么必须定义',
      '我能识别并改掉五类冗余，把一段 150 词压到 110 词',
      '我能把一句话里三个主张拆成三句，并保持逻辑连接',
      '我能读出一段话里的绝对化判断，并改成与证据匹配的强度',
      '我改写完会朗读一遍，检查喘不过气的地方与重复的词'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章覆盖学术语体的六个维度与四组可操作改写：正式化、客观化、精确化、简洁化。依据是 ENG1002 的 Lecture 07「Formal and Impersonal」与 Lecture 12「Writing Concisely」：前者给出学术/非学术的六维对照与 Don’ts（口语与短语动词、第一二人称、缩写、反问、个人副词、模糊量、绝对化、重复、基本词汇）、Dos（被动、名词化、tentative language、精确数字、AWL、引用、复杂句）；后者给出五类冗余（冗余短语、无意义修饰语、空表达、多余 there be、代词缺失）与压缩方法。Strunk 与 White 的引文出自《The Elements of Style》1999 年第 4 版第 90 页。文中的数字（48%、31%、30%）与文献（Chen & Lo, 2024）是为教学构造的示例，不是真实研究；具体作业对语体的要求以当学期评分标准为准。' }
  ]
});
