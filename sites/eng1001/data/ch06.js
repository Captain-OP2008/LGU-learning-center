/* =====================================================================
 * ch06.js · 第 6 章「从个人文章到回应文章」
 * 职责：把「写自己的经历」与「回应别人的观点」这两种最常考的体裁
 *       拆成可执行的步骤：论点、PEEL 段落、四种论证方式、开头结尾、互评。
 * 依据：ENG1001 Personal Essay 与 Response Essay 专题课件、写作评分标准。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch06',
  num: '06',
  title: '从个人文章到回应文章',
  en: 'PERSONAL & RESPONSE ESSAYS',
  goals: [
    '把一段个人经历写成有论点的文章，而不是按时间顺序的流水账',
    '用「先读懂、再限定、后表态」的步骤写出一篇回应文章',
    '写出可争论、可限定、可检验的 thesis，并预告两条以上理由',
    '用 PEEL 结构组织主体段，让解释部分占到段落的一半以上',
    '用让步—反驳与四种论证方式处理反方，而不是只堆支持性例子'
  ],
  kp: [
    { id: 'ch06-1', title: '个人文章：故事必须有一个论点' },
    { id: 'ch06-2', title: '回应文章：先读懂，再限定，后表态' },
    { id: 'ch06-3', title: 'Thesis：可争论、可限定、可检验' },
    { id: 'ch06-4', title: 'PEEL 段落：让解释占到一半' },
    { id: 'ch06-5', title: '四种论证方式与让步反驳' },
    { id: 'ch06-6', title: '开头三动作与结尾三不做' },
    { id: 'ch06-7', title: '写作过程、同伴互评与评分表' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '两种体裁，同一套底层能力', html: '个人文章（personal essay）与回应文章（response essay）看起来相反：一个写自己，一个写别人。但评分表看的是同一套东西——<b>有没有一个清楚的主张、有没有用证据推进它、有没有处理反方、段落之间有没有关系</b>。个人文章如果只是讲故事，回应文章如果只是表忠心或唱反调，都会停在「有内容、无论证」的档位。这一章把两种体裁拆成同一套动作，练一次，两种都能用。' },

    { t: 'p', lead: true, html: '先给一个判断标准：读完你的文章，读者能不能用一句话说出「作者想让我相信什么」？说不出来，问题多半不在语言，而在 thesis；说得出来但觉得「凭什么」，问题在证据与解释；说得出来也服气，但记不住任何一段，问题在结构。这一章按这三个层次依次处理。' },

    { t: 'h', lvl: 2, text: '一、个人文章：故事必须有一个论点', id: 'ch06-1' },

    { t: 'p', html: '个人文章最容易写成流水账：早上几点起床、路上看到什么、当时心情怎样、最后明白了一个道理。问题不在「写自己」，而在<b>缺少一个统摄全篇的判断</b>。同样是写一次失败的口头汇报，流水账会写「我很紧张，忘词了，最后勉强讲完」；有论点的写法会写「那次失败让我意识到，紧张不是因为准备不足，而是因为我一直在背稿，而不是在讲给别人听」。后者有一个可讨论的判断，前者只有事件。' },

    { t: 'p', html: '课程里的个人文章题目通常不是「写一件难忘的事」，而是带方向的要求：写一次你改变想法的经历、写一个你曾经误解的人、写一次失败如何影响你之后的选择。方向越具体，越不需要靠「升华」来凑字数。拿到题目先圈出三个词——<b>时间范围、事件类型、要你反思的问题</b>——三个词都回应了，文章就不会跑题。' },

    { t: 'p', html: '把经历变成论点，有一个三步动作。<b>选一个转折点</b>：不要写整个学期，写十分钟——一次对话、一个决定、一次当场出丑。<b>问「我原来以为什么，后来发现什么」</b>：这个前后差就是论点的雏形。<b>把发现写成一句可争论的话</b>：不是「我学会了自信」，而是「自信不是不紧张，而是允许自己紧张还继续讲」。越具体，越不像套话。' },

    { t: 'p', html: '个人文章的证据就是<b>细节</b>。抽象地说「我很焦虑」，读者没感觉；写「我把讲稿折成四折，折痕被手汗浸软了」，读者就看见了。细节的选择本身也是论证：你选哪些细节、略过哪些，决定了读者相信什么。所以个人文章不是「把发生过的事都写下来」，而是<b>为了证明那个判断，挑出三到四个最有说服力的瞬间</b>。' },

    { t: 'p', html: '还有一个常见毛病是<b>结尾升华</b>：故事讲完，突然来一句「这件事让我明白了人生的道理」。读者会觉得被说教。更好的结尾是把论点<b>放回场景</b>：下一次类似的情境里，你做了什么不同的选择。用行动收尾，比用格言收尾更有力，也更符合「展示而非告知」（show, don’t tell）的原则。' },

    { t: 'quiz', qid: 'ch06-q1' },

    { t: 'h', lvl: 2, text: '二、回应文章：先读懂，再限定，后表态', id: 'ch06-2' },

    { t: 'p', html: '回应文章（response essay）的前提是<b>真的读懂</b>。很多失分的回应，反驳的其实是作者没说过的话——这叫稻草人（straw man）。避免方法很机械：动笔前用三句话写出「作者的主张、作者的两条理由、作者的让步」，写不出来就回去读。这三句话就是你回应文章的起点，也是你摘要段的内容。' },

    { t: 'p', html: '第二步是<b>限定</b>。不要一上来就「完全同意」或「完全反对」，那通常会逼你夸大或忽略证据。更成熟的立场是「部分同意」：<code>While Chen is right that disclosure rules are needed, her argument underestimates how expensive compliance would be for small museums.</code> 这句话先承认对方一条，再指出对方低估了什么，立场清楚且可辩护。' },

    { t: 'p', html: '第三步才是<b>表态与给理由</b>。回应文章的 thesis 通常包含三样：你回应的是谁的什么观点、你的立场是什么、你的理由有哪两条。比如：<code>Although Ruiz (2022) correctly identifies authenticity as the central worry, this essay argues that the deeper problem is unequal access to restoration technology, because small museums cannot afford the tools and because the resulting gap reshapes what counts as a masterpiece.</code> 一句话里，对方观点、你的立场、两条理由都在。' },

    { t: 'compare', left: { title: '弱回应', html: '先抄两段原文，然后写「I agree with the author because this is very important. In my country, we also have this problem.」没有限定、没有理由、没有证据，只有态度。' }, right: { title: '强回应', html: '先用两句概括对方主张与让步，再用一句限定立场（同意哪部分、不同意哪部分），随后两段各给一条理由与证据，最后一段处理反方最强的一点。' } },

    { t: 'quiz', qid: 'ch06-q2' },

    { t: 'h', lvl: 2, text: '三、Thesis：可争论、可限定、可检验', id: 'ch06-3' },

    { t: 'p', html: '一个好的 thesis 要过三道测试。<b>可争论</b>：有没有人可能合理地反对？「污染有害健康」不可争论，是常识；「这座城市的限塑政策把成本转嫁给了小商户」可争论。<b>可限定</b>：范围是否收得住？「AI 改变教育」太宽，「AI 写作工具让大一学生的修改能力下降」才有边界。<b>可检验</b>：读者能不能用证据判断你对不对？「AI 写作工具很危险」是情绪，「AI 写作工具让学生跳过了修改环节，因而削弱了句子层面的编辑能力」可以被观察与反驳。' },

    { t: 'p', html: '中国学生最常写的是<b>太宽或太安全</b>的 thesis。「沟通很重要」「科技是一把双刃剑」「我们应该保护环境」都属于这一类：不错，但不需要论证，也推不出具体段落。改法是加三个限定词——<b>谁、在什么条件下、到什么程度</b>。「沟通很重要」改成「在跨文化团队里，书面沟通比口头沟通更能减少误解，因为它允许非母语者反复确认」。' },

    { t: 'p', html: '看一组修改前后的例子。原句：<code>Technology has changed the way students learn.</code> 问题：不可争论（几乎没人反对）、太宽（哪些技术、哪些学生、哪种学习）、无法检验（改变了什么）。第一改：<code>AI writing tools have changed how first-year students revise their essays.</code> 范围收窄了，但仍只是描述。第二改：<code>Because AI writing tools produce fluent first drafts, first-year students revise less at the sentence level, and this weakens the editing skill that academic writing requires.</code> 这一句有机制（流畅初稿 → 少做句子修改）、有对象（大一学生）、有可检验的判断（编辑能力被削弱），才算真正可用的 thesis。' },

    { t: 'p', html: 'Thesis 的位置通常在引言末尾，但不必是最后一句；有时先给一个小故事，再用 thesis 收束，效果更好。整篇文章里 thesis 只出现一次，结论段可以<b>重申</b>，但要换措辞，并把「所以呢」讲出来——不是重复一遍，而是说明这个判断对读者有什么用。' },

    { t: 'h', lvl: 2, text: '四、PEEL 段落：让解释占到一半', id: 'ch06-4' },

    { t: 'p', html: 'PEEL 是四个字母：<b>Point</b> 段首给分论点，<b>Evidence</b> 给证据，<b>Explanation</b> 解释证据如何支持分论点，<b>Link</b> 收束并连接下一段。四段里最容易缩水的是 Explanation——很多段落只有 P 和 E，证据一放就跳到下一段，读者只能自己猜「所以呢」。一个健康的段落，解释部分应占到<b>一半左右</b>的篇幅。' },

    { t: 'p', html: '看一个例子。P：<code>Disclosure rules alone cannot solve the authenticity problem.</code> E：<code>Chen (2023) found that visitors who read a disclosure label still described reconstructed works as “the original.”</code> E：<code>This suggests that information does not change the way viewers categorize an object; the label tells them what was done, but not what the work now is.</code> L：<code>If labels cannot shift perception, museums need to reconsider whether reconstruction should be presented as restoration at all.</code> 四句里，第三句是解释，第四句是推进，缺了它们，段落就只剩「有人研究过」。' },

    { t: 'p', html: 'PEEL 不是万能模板，它主要解决「段落有没有在论证」这个问题。叙事段落可以不遵循 PEEL，过渡段也不需要。但只要你的段落要<b>说服</b>读者接受一个判断，PEEL 就是一个可靠的检查表：缺 P 就没有方向，缺 E 就没有根据，缺 E 就没有推理，缺 L 就没有推进。写完后逐段标四个字母，缺哪个补哪个。' },

    { t: 'quiz', qid: 'ch06-q3' },

    { t: 'h', lvl: 2, text: '五、四种论证方式与让步反驳', id: 'ch06-5' },

    { t: 'p', html: '第一种<b>举例论证</b>：用一个具体案例支持一般判断。关键是例子要典型，且要解释「这个例子为什么能代表一类情况」，否则读者会说「只是个例」。第二种<b>对比论证</b>：把两个相似情境放在一起，凸显差异造成的后果。对比的说服力来自「控制变量」——除了你讨论的因素，其他条件尽量相似。' },

    { t: 'p', html: '第三种<b>因果论证</b>：说明 A 导致 B。难点在于排除其他原因，所以要给出机制（A 通过什么路径影响 B），而不只是相关性。第四种<b>让步—反驳</b>：先承认对方最强的一点，再说明为什么它不足以推翻你的主张。句式是 <code>Critics are right that ___. However, ___ because ___.</code> 让步不是示弱，而是显示你读过反方、且你的立场经得起最强反驳。' },

    { t: 'table', caption: '四种论证方式：什么时候用、最容易出什么错', head: ['方式', '适合', '常见错误'], rows: [
      ['举例', '证明某类现象确实存在', '只给个例，不说明代表性'],
      ['对比', '凸显某个因素的影响', '两组条件差异太多，无法归因'],
      ['因果', '解释机制、预测后果', '把相关当因果，缺少中间路径'],
      ['让步—反驳', '处理反方最强观点', '让步后没有反驳，变成自我否定']
    ] },

    { t: 'p', html: '一篇 1000 词的回应文章，通常需要两到三条支持理由加一处让步反驳。让步段放在哪里？常见有两种：放在主体倒数第二段，先立后破；或放在开头第二段，先破后立。前者更稳，后者更有攻击性。无论哪种，让步段都必须<b>真的给出对方最强的版本</b>，而不是挑一个软柿子。挑软柿子，读者一眼就能看出来，反而削弱你的可信度。' },

    { t: 'p', html: '一个让步段的完整例子：<code>Supporters of unrestricted AI use are right that banning the technology would be difficult to enforce, and that students will encounter these tools in almost any workplace. However, difficulty of enforcement does not justify the absence of rules. A course can require disclosure without policing every keystroke, and disclosure preserves the one thing a grade is supposed to measure: whether the student can do the work.</code> 四句话：承认对方最强的一点、指出它不足以推出结论、给出替代方案、回到自己的核心主张。让步没有变成退让，反而让立场更稳。' },

    { t: 'h', lvl: 2, text: '六、开头三动作与结尾三不做', id: 'ch06-6' },

    { t: 'p', html: '开头做三件事：<b>给钩子</b>（一个具体场景、一组数据、一个反常识的判断）、<b>给背景</b>（这个问题为什么值得讨论，一到两句）、<b>给 thesis</b>（你的立场与理由）。三件事的顺序可以调，但三件都要有。最常见的开头毛病是「大背景开场」：从「随着全球化的发展」写到第五句还没进入题目。读者在前三句决定要不要认真读，不要把黄金位置浪费在套话上。' },

    { t: 'p', html: '结尾有三不做。<b>不引入新证据</b>：结尾出现新论据，读者会觉得文章没写完。<b>不喊口号</b>：「让我们共同努力」不提供任何信息。<b>不重复全文</b>：把每段第一句抄一遍，读者会直接跳过。结尾该做的是：重述 thesis（换措辞）、说明它的意义（对读者、对某个群体、对未来的实践）、给一个具体的落点（一个建议、一个仍需回答的问题、一个回到开头的场景）。' },

    { t: 'p', html: '一个实用的检查：把开头与结尾单独拿出来读，能不能看出是同一篇文章？如果结尾突然出现开头没提过的概念，说明结构散了；如果开头和结尾几乎一样，说明文章没有推进。好的开头与结尾应该<b>呼应但不重复</b>：同一个意象、同一个问题，但在结尾有了新的答案。' },

    { t: 'h', lvl: 2, text: '七、写作过程、同伴互评与评分表', id: 'ch06-7' },

    { t: 'p', html: '写作不是「想好再写」，而是「写着发现」。一个可执行的过程是：<b>列提纲</b>（15 分钟，只写每段一句主张）→ <b>快写初稿</b>（60 分钟，不停下来改词）→ <b>冷却</b>（至少两小时，最好过夜）→ <b>结构修改</b>（看每段是否服务 thesis）→ <b>语言修改</b>（见 ch03）→ <b>引用核对</b>（见 ch04、ch05）。初稿写得快，是因为修改时你会有更好的判断；一边写一边改，会把思路打断。' },

    { t: 'p', html: '<b>同伴互评</b>（peer review）不是互相夸。有效的互评只回答四个问题：作者想让我相信什么？哪一段最有说服力，为什么？哪一段我最想反驳，为什么？如果只能改一处，改哪里？四个问题都是描述性的，不评价「写得好不好」。被评的人不要辩解，先记下来，回头再判断哪些意见该采纳。' },

    { t: 'p', html: '最后是<b>评分表</b>（rubric）。写作课的 rubric 通常分四到五个维度：内容与论点、组织与衔接、语言与语法、引用与格式，可能再加「任务完成度」。交稿前用 rubric 给自己逐项打分，每一项写一句理由。这一步的价值不在于分数，而在于让你知道<b>失分发生在哪一层</b>：是 thesis 不够清楚，还是段落缺解释，还是引用格式错。知道层级，才知道下一步练什么。' },

    { t: 'terms', items: [
      { en: 'personal essay', zh: '个人文章', html: '以个人经历为材料、但必须有一个可讨论判断的文章，不是流水账。' },
      { en: 'response essay', zh: '回应文章', html: '在准确概括他人观点后表明立场并给出理由的文章，允许部分同意。' },
      { en: 'thesis', zh: '中心论点', html: '可争论、可限定、可检验的核心判断，通常在引言末尾，预告理由。' },
      { en: 'PEEL', zh: '段落结构', html: 'Point、Evidence、Explanation、Link 四步，解释部分应占段落一半。' },
      { en: 'straw man', zh: '稻草人', html: '反驳对方并未主张的观点，是回应文章最常见的逻辑错误。' },
      { en: 'concession', zh: '让步', html: '先承认对方最强的一点，再说明它不足以推翻自己的主张。' },
      { en: 'rubric', zh: '评分表', html: '按内容、组织、语言、引用等维度分项打分的标准，可用于交稿前自评。' }
    ] },

    { t: 'keypoint', items: [
      { title: '个人文章也要有论点', html: '选一个转折点，问「原来以为什么、后来发现什么」，把发现写成可争论的一句话。' },
      { title: '回应文章三步：读懂、限定、表态', html: '先能用三句话概括对方主张与让步，再给部分同意的立场，最后给两条理由。' },
      { title: 'Thesis 过三关：可争论、可限定、可检验', html: '加「谁、在什么条件下、到什么程度」三个限定词，避免「沟通很重要」式空话。' },
      { title: 'PEEL 里解释最重要', html: '解释应占段落一半；缺解释的段落只是「有人研究过」，没有推进。' },
      { title: '让步要挑对方最强的版本', html: 'Critics are right that ___. However, ___ because ___.；挑软柿子会削弱可信度。' },
      { title: '用 rubric 定位失分层级', html: '交稿前逐项自评并写理由，判断问题在论点、段落、语言还是引用。' }
    ] },

    { t: 'checklist', id: 'ch06', items: [
      '我的个人文章有一个可争论的判断，而不是只按时间顺序讲完一件事',
      '我选了三到四个具体细节来支撑判断，而不是把所有经历都写进去',
      '我的回应文章能准确概括对方主张、两条理由与一处让步',
      '我的 thesis 可争论、可限定、可检验，并预告了两条以上理由',
      '我用了「部分同意」的立场，而不是全盘肯定或全盘否定',
      '我的每个主体段都能标出 P、E、E、L 四个部分，解释占一半左右',
      '我至少用了一种让步—反驳，且让步的是对方最强的观点',
      '我的开头三件事齐全：钩子、背景、thesis，没有大而空的铺垫',
      '我的结尾没有引入新证据、没有喊口号、没有逐段重复',
      '我用 rubric 逐项自评过，并能说出自己最可能失分的是哪一层'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章覆盖个人文章的论点化与细节选择、回应文章的三步法、thesis 的三道测试、PEEL 段落与解释比例、四种论证方式与让步反驳、开头三动作与结尾三不做、写作过程与同伴互评、rubric 自评。依据是 ENG1001 的 Personal Essay 与 Response Essay 专题课件，以及写作评分标准（Understanding the Writing Rubric、Personal Essay Rubric）中的维度划分。文中的 1000 词、两到三条理由、解释占一半是教学建议，具体字数与分值以当学期作业说明为准；Chen (2023)、Ruiz (2022) 等为示例来源，不对应真实文献。不同课程的 rubric 维度名称可能不同，但「内容—组织—语言—引用」四层大体通用。' }
  ]
});
