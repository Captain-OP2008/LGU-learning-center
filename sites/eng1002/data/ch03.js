/* =====================================================================
 * ch03.js · 第 3 章「因果分析：解释「为什么」与「所以呢」」
 * 职责：把「A 导致 B」写成能经受质疑的因果论证，而不是相关性的误读。
 * 依据：ENG1002 Cause and Effect Essay 说明（Week 7）、Lecture 07 的
 *       tentative language、课程对「主题要有价值」的要求。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch03',
  num: '03',
  title: '因果分析：解释「为什么」与「所以呢」',
  en: 'CAUSE & EFFECT',
  goals: [
    '分清相关与因果，说出三种最常见的误判来源',
    '按证据强度给因果主张排序，并据此调整结论的措辞',
    '用机制（mediating mechanism）把「为什么」讲到过程层面',
    '区分必要原因、充分原因与促成因素，避免单一原因谬误',
    '把因果分析收束到「所以呢」，写出与证据匹配的后果判断'
  ],
  kp: [
    { id: 'ch03-1', title: '因果分析要回答的两个问题' },
    { id: 'ch03-2', title: '相关不是因果：三种误判' },
    { id: 'ch03-3', title: '证据等级：什么样的设计能支持因果' },
    { id: 'ch03-4', title: '机制：把「为什么」讲到过程' },
    { id: 'ch03-5', title: '必要、充分与促成：原因不止一种' },
    { id: 'ch03-6', title: '替代解释与反事实' },
    { id: 'ch03-7', title: '从原因到后果：写出「所以呢」' },
    { id: 'ch03-8', title: '因果段落的骨架与常见谬误' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么因果作文最容易写空', html: '因果作文的题目通常长这样：「Discuss the causes of X」或「What are the effects of Y?」。很多人拿到题目就开始列点：原因一、原因二、原因三，每条配一句解释。写满三页，读起来却像一份清单——因为<b>清单只回答了「有哪些」，没有回答「为什么是它」</b>。因果分析的核心不是数量，而是<b>机制与排除</b>：你要说清 A 通过什么路径影响 B，还要说清为什么不是 C、D、E。这一章讲的就是这两件事。' },

    { t: 'p', lead: true, html: '先区分两个问题。<b>「为什么」</b>问的是原因：为什么大学生运动量下降？<b>「所以呢」</b>问的是后果与意义：运动量下降会带来什么，谁应该在意？一篇合格的因果作文两个都要回答，而且<b>回答的强度必须与证据的强度匹配</b>。如果证据只是一个横断面调查，你能说「与……相关」，不能说「导致」；如果证据来自随机对照试验，你才可以说「使……下降」。这一章先教你怎么判断证据强度，再教你怎么把强度写进句子里。' },

    { t: 'p', html: '课程对因果作文的要求里有一条特别值得记住：<b>主题必须有价值</b>（the topic should matter）。这不只是「别写太无聊的题」，而是一个论证要求：如果结论是「运动少不好」，读者不需要读三页就知道。有价值的因果分析要能改变读者的判断——让他们看到一个原以为无关的因素其实有关，或者一个原以为有效的方法其实无效。' },

    { t: 'h', lvl: 2, text: '一、因果分析要回答的两个问题', id: 'ch03-1' },

    { t: 'p', html: '把因果作文拆成四个部件，写作时就不会跑偏：<b>结果（outcome）</b>——你要解释的现象，必须有明确的操作定义；<b>原因（cause）</b>——你主张的影响因素，通常两到三个，不宜过多；<b>机制（mechanism）</b>——原因通过什么中间环节影响结果；<b>限定（scope）</b>——这个结论对谁、在什么条件下成立。四个部件里，机制最容易被跳过，也最能体现水平。' },

    { t: 'p', html: '结果的定义要具体到可以测量。「学业压力」不是一个可测量的结果，「每周自报的焦虑症状得分」才是。「城市生活质量」太宽，「通勤时间与租金占收入比例」才可操作。定义越具体，后面的因果主张越容易检验，也越不容易被「这要看情况」一句话推翻。' },

    { t: 'table', caption: '四个部件与常见失误；写提纲时逐格填一遍', head: ['部件', '要写清什么', '常见失误'], rows: [
      ['结果', '可测量的指标、时间范围、人群', '用抽象名词（well-being、development）代替指标'],
      ['原因', '两到三个因素，每个有独立证据', '列七八个原因，每个只有一句话'],
      ['机制', 'A 通过什么中间变量影响 B', '只给相关性，不给过程'],
      ['限定', '对谁成立、在什么条件下失效', '把局部结论推广到所有人、所有时期']
    ] },

    { t: 'p', html: '四个部件之外还有一个隐含要求：<b>因果主张要有反方</b>。如果你说「社交媒体使用导致焦虑上升」，必须知道有人主张「是焦虑的人更爱用社交媒体」（反向因果），或者「两者都受第三个因素影响」（如睡眠不足）。不处理这些替代解释，你的因果论证只是把相关性又说了一遍。' },

    { t: 'p', html: '课程要求因果作文至少用三个来源，其中三个直接引用、三个转述。这个数量不是形式主义：<b>三个来源分别承担不同功能</b>——一个提供结果的数据，一个提供机制的证据，一个提供反方或边界条件。如果你的三个来源都在说同一件事，说明你还没有把论证结构想清楚。' },

    { t: 'h', lvl: 2, text: '二、相关不是因果：三种误判', id: 'ch03-2' },

    { t: 'p', html: '两个变量一起变化，只说明它们<b>相关</b>（correlation）。要主张一个导致另一个，必须排除其他解释。课程讲义反复强调的「correlation is not causation」，落到写作里有三种最常见的误判，每一种都有对应的检查问句。' },

    { t: 'p', html: '<b>第一种：混杂变量（confounding variable）。</b>冰淇淋销量与溺水人数同时上升，不是冰淇淋导致溺水，而是夏天到了——气温同时影响两者。检查问句：<b>有没有一个因素同时影响 A 和 B？</b>在写作里，处理混杂变量的标准动作是「控制」：说明研究是否控制了收入、年龄、基线水平等变量，或者明确指出「本研究未控制 X，因此结论应谨慎」。' },

    { t: 'p', html: '<b>第二种：反向因果（reverse causation）。</b>研究发现「经常运动的人幸福感更高」，可能是运动让人幸福，也可能是幸福的人更愿意运动。检查问句：<b>时间顺序对吗？有没有可能 B 导致 A？</b>处理方式是看纵向数据：如果先测运动、若干年后再测幸福感，反向因果的解释就弱一些。写作时要明确说明「数据来自哪一年、变量在何时测量」。' },

    { t: 'p', html: '<b>第三种：选择效应与巧合（selection and coincidence）。</b>选了某个城市做案例，发现「有地铁的城市更富裕」，可能只是富裕城市才修得起地铁。检查问句：<b>样本是怎么来的？比较组是否可比？</b>处理方式是找「自然实验」或「政策冲击」：某条地铁线的开通时间由外生因素决定，就近似一次实验。' },

    { t: 'compare', caption: '同一组数据的两种解读：左边是相关，右边才接近因果', left: { title: '相关式解读（不充分）', items: ['「经常使用图书馆的学生成绩更好，所以图书馆使用提高了成绩。」', '「咖啡消费量高的国家人均寿命更长，所以咖啡延长寿命。」', '「采用新教学法的班级出勤率更高，所以新教学法有效。」'] }, right: { title: '因果式解读（需要额外证据）', items: ['「在控制入学成绩与家庭收入后，图书馆使用频率仍与 GPA 正相关（β = .18）。」', '「咖啡消费与寿命的关系在控制人均收入后消失，提示原相关由富裕程度驱动。」', '「新教学法在两个班级轮换实施，出勤率差异随实施时间出现，而非先于实施。」'] } },

    { t: 'p', html: '三种误判的共同点是：<b>它们都能生成一个看起来很像因果的相关</b>。所以因果写作的重点不在于「找到一个相关」，而在于「说清你排除了哪些替代解释」。一段好的因果段落，通常会有一句明确的排除句：「Although both groups differed at baseline, the gap widened only after the program began, which makes a selection explanation less likely.」' },

    { t: 'h', lvl: 2, text: '三、证据等级：什么样的设计能支持因果', id: 'ch03-3' },

    { t: 'p', html: '不是所有证据都一样重。评估一个因果主张，先看研究设计，再看样本与测量。下面的等级从强到弱排列；等级越高，你能用的动词越强（causes、leads to），等级越低，越要用（is associated with、may contribute to）。' },

    { t: 'table', caption: '因果证据的等级；写作时按等级选择动词强度', head: ['设计', '能支持什么', '写作时的措辞'], rows: [
      ['随机对照试验（RCT）', '干预与结果之间的因果效应', 'reduced / increased / led to'],
      ['自然实验、政策冲击', '近似因果效应，依赖外生性假设', 'is estimated to have reduced'],
      ['纵向追踪（面板数据）', '时间顺序明确，可控制部分稳定差异', 'predicted / was followed by'],
      ['横断面调查 + 控制变量', '相关关系，排除部分混杂', 'is associated with / correlates with'],
      ['案例研究、访谈', '机制线索、当事人解释', 'participants reported / suggests'],
      ['专家意见、新闻', '背景与问题意识，不作因果证据', 'arguably / according to']
    ] },

    { t: 'p', html: '等级不是绝对的。一个设计精良的纵向研究，可能比一个小样本、测量粗糙的 RCT 更可信。判断时要看三件事：<b>样本是否代表目标人群、测量是否可靠、分析是否控制了明显的混杂</b>。这三件事在论文的方法部分通常都有交代，读的时候要主动找，而不是只看摘要的结论句。' },

    { t: 'p', html: '写作时的常见错误是「升级」：来源说的是 associated with，作文里写成 causes。这种升级会让论证看起来更有力，实际上把结论推到了证据之外，评分者一眼就能看出来。正确做法是<b>保留来源的强度</b>，再用机制与多项证据的收敛（convergence）来加强整体论证：三个不同设计的研究都指向同一方向，比一个研究用强动词更有说服力。' },

    { t: 'p', html: '还有一点：<b>效应大小（effect size）比统计显著性更值得写</b>。「显著」只说明不太可能是偶然，不说明影响有多大。一个使成绩提高 0.5 分的干预，即使 p < .001，也没有实际意义。写因果作文时，尽量给出具体幅度：「a 12-percentage-point increase」「roughly one-third of the gap」，读者才能判断这个原因重不重要。' },

    { t: 'h', lvl: 2, text: '四、机制：把「为什么」讲到过程', id: 'ch03-4' },

    { t: 'p', html: '机制是因果论证的「黑箱打开」。你说 A 导致 B，读者会问：<b>中间发生了什么？</b>如果答不上来，这个因果主张就只是统计上的相关。机制不需要很复杂，但必须具体到能想象出过程：「通勤时间长 → 可支配时间减少 → 做饭时间被压缩 → 外卖频率上升 → 热量摄入增加」。每一步都可以单独检验。' },

    { t: 'p', html: '找机制的方法有三种。<b>第一种：问「然后呢」。</b>从原因出发，连续问三到四次「然后呢」，直到到达结果。每一次回答都是一个中间变量。<b>第二种：找中介变量（mediator）。</b>如果研究显示「A 与 B 相关，但在控制 M 之后关系减弱」，M 就是候选机制。<b>第三种：读质性研究。</b>访谈与观察能提供当事人自己的解释，虽然不能单独证明因果，但能提示机制的方向。' },

    { t: 'steps', items: [
      { title: '第一步 · 写出因果链', html: '用箭头写出从原因到结果的四到五个环节，每个环节都是一个可测量的变量。' },
      { title: '第二步 · 标出证据', html: '每个箭头旁边标上支持它的来源；没有来源的环节，明确写成「a plausible mechanism」而不是事实。' },
      { title: '第三步 · 找断点', html: '哪一步最弱？在正文里承认它，并说明需要什么证据才能补上。' },
      { title: '第四步 · 写进段落', html: '主题句给机制，随后两句给证据，最后一句给限定。整段不超过一个机制。' }
    ] },

    { t: 'p', html: '机制写得好的标志是：<b>读者能自己往下推</b>。你给了「通勤时间 → 做饭时间 → 外卖」，读者自然想到「那如果公司提供晚餐，这个链条就断了」。这种可推演性说明你的机制不是编的，而是有现实约束的。反过来，如果机制只能靠形容词支撑（「巨大的压力导致严重的后果」），说明你还没有真正解释。' },

    { t: 'p', html: '机制也要防过度延伸。一个常见的毛病是「一步到位」：从「社交媒体使用」直接跳到「抑郁」，中间什么都不说。另一头是「无限细分」：把每一步都拆成十个环节，读者跟丢。合适的粒度是<b>三到五个环节，每个环节都有独立的证据或常识支持</b>。' },

    { t: 'h', lvl: 2, text: '五、必要、充分与促成：原因不止一种', id: 'ch03-5' },

    { t: 'p', html: '「原因」不是一个单一概念。逻辑学区分三类：<b>必要原因（necessary cause）</b>——没有它，结果不会发生；<b>充分原因（sufficient cause）</b>——有它，结果一定发生；<b>促成因素（contributory cause）</b>——它提高结果发生的概率，但既不必要也不充分。大多数社会现象的因果主张，都是促成因素，而不是必要或充分原因。' },

    { t: 'table', caption: '三类原因的例子与写作含义', head: ['类型', '定义', '例子', '写作含义'], rows: [
      ['必要原因', '无之必不然', '氧气之于燃烧；报名资格之于入学', '可以说 without X, Y cannot occur'],
      ['充分原因', '有之必然', '达到分数线且名额充足之于录取', '可以说 X alone is enough to produce Y'],
      ['促成因素', '提高概率，非必要非充分', '睡眠不足之于成绩下降', '要说 increases the likelihood / contributes to']
    ] },

    { t: 'p', html: '把促成因素写成充分原因，是最常见的越界。比如「贫困导致犯罪」——贫困既不是犯罪的必要条件（很多贫困者不犯罪），也不是充分条件（很多犯罪与贫困无关）。更准确的说法是「贫困通过增加压力与削弱社会支持，提高了某些类型犯罪的发生概率，且这一关联在控制……后仍然存在」。句子长了，但每一句都站得住。' },

    { t: 'p', html: '原因还有<b>层次</b>之分。<b>远端原因（distal）</b>是结构性、历史性的条件；<b>近端原因（proximal）</b>是直接触发事件。一场抗议的远端原因可能是十年的失业率上升，近端原因是某次执法事件。好的因果分析会同时给两层，并说明它们如何连接：远端原因积累压力，近端原因点燃。只写远端，读者觉得空；只写近端，读者觉得浅。' },

    { t: 'p', html: '第三组区分是<b>单因与多因</b>。社会现象几乎都是多因的，但作文不能列七八条。可行的策略是「两到三个主因 + 一句承认其他因素」：主线讲透两个机制，结尾用一句话说明「其他因素（如 X）也可能起作用，但本文聚焦于 Y，因为……」。这样既没有假装穷尽，也没有散掉。' },

    { t: 'h', lvl: 2, text: '六、替代解释与反事实', id: 'ch03-6' },

    { t: 'p', html: '因果论证的说服力，一半来自「我支持的这个解释有多好」，另一半来自「我排除了哪些竞争解释」。这一步叫<b>替代解释检验</b>。做法很朴素：列出两到三个同样能解释数据的说法，然后逐一说明为什么你的解释更可信。' },

    { t: 'p', html: '常用的排除策略有三种。<b>时间顺序</b>：原因必须先于结果，如果结果在原因之前出现，因果方向就反了。<b>剂量反应</b>：如果原因真的起作用，暴露越多、效应越强；没有剂量反应，因果解释就弱。<b>消失检验</b>：移除原因后结果是否回落。三种策略都不需要新数据，只要在设计或文献里找对应证据。' },

    { t: 'p', html: '<b>反事实（counterfactual）</b>是另一种有力工具：问「如果当时没有 X，会怎样？」反事实不能直接观察，但可以借助比较组近似。政策评估里的「处理组 vs 对照组」就是反事实的操作化。写作时可以用一句话点出反事实：「Without the 2019 expansion, the enrolment gap would probably have continued to widen at its pre-2019 rate.」这句话比「政策很重要」有力得多，因为它给出了一个可比较的基准。' },

    { t: 'p', html: '处理替代解释时要注意语气。<b>不要说「这些解释都是错的」，而要说「这些解释不能说明全部现象」</b>。比如：「A selection effect may explain part of the gap, since wealthier districts were more likely to adopt the program. However, the gap continued to widen after the program was extended to poorer districts, which a selection explanation cannot easily account for.」承认对手的部分合理性，再用新证据收窄它的解释力，这是学术写作的标准动作。' },

    { t: 'p', html: '一个常见的逻辑错误是<b>「事后归因」（post hoc ergo propter hoc）</b>：因为 B 发生在 A 之后，就断定 A 导致 B。校庆之后成绩下降，不等于校庆导致成绩下降。破解方法是找第三变量或比较组：没有校庆的年份成绩是否也下降？如果也下降，A 就不是原因。' },

    { t: 'h', lvl: 2, text: '七、从原因到后果：写出「所以呢」', id: 'ch03-7' },

    { t: 'p', html: '因果作文的后半段是后果。很多人把后果写成「影响一、影响二、影响三」，同样的问题：只有清单，没有机制，也没有意义判断。<b>后果段落要回答三个问题：对谁有影响？影响多大？这个影响为什么值得关注？</b>第三个问题就是「所以呢」。' },

    { t: 'p', html: '「值得关注」有几种常见写法。<b>规模</b>：受影响的人数或金额足够大（「affects roughly 40% of first-year students」）。<b>不可逆</b>：后果一旦发生就难挽回（「dropout is difficult to reverse because……’）。<b>分配</b>：后果集中落在某一群体身上（「the burden falls disproportionately on students who already work part-time」）。<b>趋势</b>：如果不干预，情况会恶化（「at the current rate, the gap would double by 2030」）。四种写法都比「这是一个严重的问题」有力。' },

    { t: 'p', html: '后果也要分短期与长期、直接与间接。短期后果容易观察，长期后果需要推断，推断就要标明不确定性：「In the short term, the policy reduced waiting times by 18%. In the longer term, however, the additional demand may offset these gains unless capacity is expanded.」这句话同时给了证据与条件，读者知道结论在什么情况下成立。' },

    { t: 'p', html: '结尾不要重复开头。好的结尾把因果链收束成一个判断，并指出它的边界：「The evidence suggests that distance, rather than motivation, is the binding constraint on exercise frequency among first-year students; if this is right, then building a gym nearer to residences should raise participation more than a motivation campaign would.」这句话有主张、有机制、有政策含义，也有可检验的预测——四件事在一句话里完成。' },

    { t: 'h', lvl: 2, text: '八、因果段落的骨架与常见谬误', id: 'ch03-8' },

    { t: 'p', html: '一个可复用的因果段落骨架是四句话：<b>主题句给机制</b>（「One reason for the decline is the distance between residences and sports facilities, which raises the time cost of exercise.」）；<b>证据句给数据</b>（「In a survey of 1,200 first-year students, those living more than 1.5 km from a gym reported 40% fewer weekly sessions.」）；<b>排除句处理替代解释</b>（「This gap persisted after controlling for prior exercise habits and free time, which makes a motivation-based explanation less likely.」）；<b>限定句收窄结论</b>（「The pattern is clearest for students without cars; for those with vehicles, distance matters much less.」）。四句话，一段完整的因果论证。' },

    { t: 'compare', caption: '因果段落的两种写法', left: { title: '清单式（弱）', items: ['「There are many reasons for the decline. First, students are busy. Second, the gym is far. Third, motivation is low.」', '「These reasons show that the problem is serious and needs attention.」'] }, right: { title: '机制式（强）', items: ['「The most plausible mechanism is time cost: a 30-minute round trip reduces the expected benefit of a 45-minute workout.」', '「Consistent with this, students living within 1 km report twice as many sessions, and the difference shrinks among car owners.」'] } },

    { t: 'p', html: '最后列一下因果写作里最常见的五个谬误，写完自查：<b>事后归因</b>（先后即因果）；<b>单一原因</b>（把多因现象归给一个因素）；<b>滑坡</b>（一步推到底，不给中间环节）；<b>循环论证</b>（用结果解释结果，如「他失败是因为他不够成功」）；<b>以偏概全</b>（用小样本或个案推出普遍结论）。五个谬误的共同点是<b>跳过了机制与限定</b>，而这两样正是因果论证的核心。' },

    { t: 'p', html: '还有两个写作层面的提醒。第一，<b>因果动词要分级</b>：cause / lead to / result in 是强动词，contribute to / be associated with / may explain 是弱动词。全文的动词强度应该与研究设计匹配，不能一段强一段弱。第二，<b>不要把相关性写成因果的过渡句</b>：「Since X is correlated with Y, X must be causing Y」——这个 since 用错了一次，整段论证就废了。' },

    { t: 'terms', items: [
      { en: 'correlation', zh: '相关', html: '两个变量同向或反向变化，不蕴含因果。写作中用 is associated with 表达。' },
      { en: 'confounding variable', zh: '混杂变量', html: '同时影响自变量与因变量的第三因素，会制造虚假因果。' },
      { en: 'reverse causation', zh: '反向因果', html: '结果反过来影响原因，常见于横断面数据。' },
      { en: 'mechanism', zh: '机制', html: '原因影响结果的中间过程，通常由三到五个可测量的环节构成。' },
      { en: 'counterfactual', zh: '反事实', html: '「如果没有 X 会怎样」的假设比较，用于估计因果效应。' },
      { en: 'necessary / sufficient cause', zh: '必要原因 / 充分原因', html: '无之必不然 / 有之必然。多数社会现象的原因只是促成因素。' },
      { en: 'post hoc fallacy', zh: '事后归因谬误', html: '因为 B 在 A 之后发生，就断定 A 导致 B。' },
      { en: 'effect size', zh: '效应大小', html: '影响的实际幅度，比统计显著性更能说明原因重不重要。' }
    ] },

    { t: 'quiz', qid: 'ch03-q1' },
    { t: 'quiz', qid: 'ch03-q2' },
    { t: 'quiz', qid: 'ch03-q3' },

    { t: 'keypoint', items: [
      { title: '四个部件', html: '结果（可测量）、原因（两三个）、机制（三到五环）、限定（对谁成立）。' },
      { title: '相关不是因果', html: '混杂变量、反向因果、选择效应。每种都要有对应的排除句。' },
      { title: '证据等级决定动词强度', html: 'RCT 用 reduced，横断面用 is associated with。不要升级来源的措辞。' },
      { title: '机制是黑箱打开', html: '连问「然后呢」，找中介变量，用质性研究补方向。' },
      { title: '原因分三类三层', html: '必要/充分/促成；远端/近端；单因/多因。多数主张只是促成因素。' },
      { title: '「所以呢」要有规模、不可逆、分配或趋势', html: '四种写法都比「这是一个严重问题」有力。' }
    ] },

    { t: 'checklist', id: 'ch03', items: [
      '我能给结果下一个可测量的操作定义',
      '我能说出混杂变量、反向因果、选择效应各一个例子',
      '我能判断一篇文献用的是哪种设计，并据此选择动词强度',
      '我能把一个因果主张拆成三到五个环节的机制链',
      '我能区分必要原因、充分原因与促成因素，并用对措辞',
      '我能写出至少一个替代解释，并说明为什么我的解释更可信',
      '我能用规模、不可逆、分配或趋势中的一种写出「所以呢」',
      '我能按「机制—证据—排除—限定」四句骨架写一段因果分析',
      '我能自查事后归因、单一原因、滑坡、循环论证、以偏概全'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章覆盖因果作文的完整链条：结果定义、相关与因果的区分、证据等级、机制、原因类型、替代解释与反事实、后果判断、段落骨架与五类谬误。依据是 ENG1002 的 Cause and Effect Essay 说明（Week 7 截止，要求至少三个来源、三个直接引用与三个转述、不少于三页、APA 格式，并强调 correlation 不等于 causation 与主题要有价值），以及 Lecture 07 关于 tentative language 的要求（用 may、suggests 等词让结论与证据匹配）。文中出现的调查数字（1,200 名学生、40%、18%）与文献示例均为教学构造，用于演示写法，不是可引用的真实研究；具体作业的字数与来源要求以当学期作业说明为准。' }
  ]
});
