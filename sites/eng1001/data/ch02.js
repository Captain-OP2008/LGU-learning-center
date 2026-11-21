/* =====================================================================
 * ch02.js · 第 2 章「摘要写作：把一篇文章压成一段」
 * 职责：把 ch01 的结构阅读转成 150–200 词的客观摘要；
 *       训练「准确、完整、自己的话」三条底线，为 ch04 改写打底。
 * 依据：ENG1001 Summary 专题课件（How to Write a Summary）与课程阅读文章。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch02',
  num: '02',
  title: '摘要写作：把一篇文章压成一段',
  en: 'WRITING A SUMMARY',
  goals: [
    '在 20 分钟内为一篇 800–1000 词的文章写出 150–200 词的英文摘要',
    '用「出处句 + 三条分点 + 收束句」的骨架组织摘要，不按原文顺序复述',
    '用上位词、删例证、合并同类三种技巧把篇幅压到原文的四分之一',
    '在摘要中使用准确的归属句式，让读者始终知道观点属于原作者',
    '区分摘要与评论，删掉所有评价性语言，只保留作者说了什么'
  ],
  kp: [
    { id: 'ch02-1', title: '摘要是什么：准确、完整、自己的话' },
    { id: 'ch02-2', title: '读原文：只划能进摘要的单元' },
    { id: 'ch02-3', title: '摘要骨架：出处句、三条分点、收束句' },
    { id: 'ch02-4', title: '压缩技巧：上位词、删例证、合并同类' },
    { id: 'ch02-5', title: '归属句式：让观点始终属于原作者' },
    { id: 'ch02-6', title: '摘要与评论：一条界线三种越界' },
    { id: 'ch02-7', title: '一段式摘要：坏例、好例与逐句修改' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么先练摘要', html: '摘要看起来是最「笨」的作业：不用自己的观点，不能评价，只是把别人的文章说一遍。但它同时训练四种能力，而且这四种能力在后续每一项作业里都会再用一次：<b>读懂结构</b>（ch01）、<b>判断什么重要</b>、<b>用自己的话重述</b>（ch04 的改写基础）、<b>标注观点归属</b>（ch05 的引用基础）。所以摘要写不好的人，回应文章多半会写成「原文观点 + 我的感想」的拼接，而引用也容易变成抄袭。' },

    { t: 'p', lead: true, html: '这一章的产出很具体：给你一篇 800–1000 词的课程文章，20 分钟内交出 150–200 词的英文摘要。评分只看三件事——有没有抓住主旨与主要分论点、有没有歪曲原意、有没有用你自己的句子。听起来简单，但大部分失分不是因为英语差，而是因为把摘要写成了「缩写版原文」或「读后感」。' },

    { t: 'h', lvl: 2, text: '一、摘要是什么：准确、完整、自己的话', id: 'ch02-1' },

    { t: 'p', html: '摘要（summary）是对一篇来源文本的<b>客观压缩</b>：保留主旨与主要分论点，删掉例证、重复、修辞与细节，不加入任何新的信息或评价。它的长度通常是原文的四分之一到三分之一；一门课要求 150–200 词时，对应的原文大约 800–1000 词。摘要里出现的每一个观点都必须能在原文找到出处，这一条叫<b>可追溯</b>。' },

    { t: 'p', html: '三条底线可以当成三个检查问题。<b>准确</b>：我的摘要有没有把作者的主张说得更强、更弱或更绝对？比如原文说 <code>may reduce</code>，我写成 <code>reduces</code>，就是歪曲。<b>完整</b>：主要分论点是不是都在？只写了第一段和最后一段，通常漏掉中间两条理由。<b>自己的话</b>：有没有整句照搬原文？连续 7 个词与原文相同而没加引号，在多数学校的判定里已经算抄袭。' },

    { t: 'p', html: '还有一条常被忽略：摘要<b>没有立场</b>。你不能写 <code>I agree</code>、<code>this is convincing</code>、<code>the author fails to</code>。这些是评论（response）的语言。摘要的任务是让没读过原文的人准确知道作者说了什么，而不是知道你怎么想。判断方法：把摘要给一个同学看，如果他问「所以你觉得呢」，说明你写的是摘要；如果他说「我大概知道那篇文章讲什么了」，说明成功。' },

    { t: 'h', lvl: 2, text: '二、读原文：只划能进摘要的单元', id: 'ch02-2' },

    { t: 'p', html: '为摘要而读，与 ch01 的批注读法有一处关键差别：ch01 要你标出所有值得注意的地方，为摘要而读则要<b>主动丢弃</b>。具体做法是拿两种标记：一种标「主张」，一种标「分论点」，例证、数据、故事、引语一律不标。读完一遍，你的页面上应该只有五到七个标记，而不是满页荧光笔。' },

    { t: 'p', html: '判断一个句子能不能进摘要，问三个问题。第一，它是<b>主张</b>还是<b>支撑</b>？主张进，支撑不进（除非这个数据本身就是分论点）。第二，删掉它，读者会不会误解全文？不会就删。第三，它是否只是<b>同一意思的第二次表达</b>？是就合并。三个问题过完还留下的，才是摘要的骨架。' },

    { t: 'table', caption: '原文里的六类内容，哪些进摘要、哪些必须删', head: ['原文内容', '进不进摘要', '处理方式'], rows: [
      ['主旨句 / 作者的核心主张', '进', '改写后放在摘要第一句或第二句'],
      ['2–4 条主要分论点', '进', '每条一句，按原文逻辑顺序排列'],
      ['关键数据（如「68% 的教师」）', '选一个', '最多保留一个最有代表性的数字，其余删'],
      ['具体案例、人物故事、场景描写', '删', '用一句概括替代，或不提'],
      ['作者的修辞、反问、讽刺', '删', '转成中性陈述，不保留语气'],
      ['作者引用的他人观点', '看情况', '若构成分论点则保留，并注明「据某某」']
    ] },

    { t: 'quiz', qid: 'ch02-q1' },

    { t: 'h', lvl: 2, text: '三、摘要骨架：出处句、三条分点、收束句', id: 'ch02-3' },

    { t: 'p', html: '一段合格的摘要通常五到七句，结构固定。第一句是<b>出处句</b>：作者、年份（若已知）、标题、发表处、核心主张。它同时完成两件事——告诉读者这是谁的文章，以及这篇文章的结论是什么。第二到第四句是<b>三条分点</b>，每条一句，用 <code>First</code>、<code>In addition</code>、<code>Finally</code> 之类的路标串起来。最后一句是<b>收束句</b>：作者的目的、警告或建议，仍然属于作者，不是你的评价。' },

    { t: 'p', html: '出处句有一个常见毛病：只报到标题，不报主张。比如 <code>In the article "Privacy in a Digital World," the author discusses privacy.</code> 这句话没有信息量——读者不知道作者对隐私做了什么判断。改成 <code>In "Privacy in a Digital World," Chen (2023) argues that users have traded meaningful privacy for convenience they rarely question.</code> 一句就把话题、立场、语气强度都交代了。' },

    { t: 'p', html: '三条分点的顺序应当<b>跟原文的逻辑走</b>，而不是跟你划线的顺序走。如果原文是「问题—原因—方案」，摘要也按这个顺序；如果原文先给反方再反驳，摘要要写出「作者先承认……随后指出……」，否则读者会以为那是作者的主张。收束句不要写成 <code>In conclusion, the author talks about privacy.</code> 这是把标题又说了一遍；应该写作者要读者接受什么或做什么。' },

    { t: 'steps', items: [
      { title: '第 1 句 · 出处句（约 30 词）', html: '句式：In "标题," 作者（年份）argues that + 核心主张。主张要用一个完整的 that 从句，不要用名词短语敷衍。' },
      { title: '第 2–4 句 · 三条分点（每句约 25 词）', html: '每条一个分论点，用 First / In addition / Finally 起头。不复述例证，只写「作者用什么理由支持主张」。' },
      { title: '第 5 句 · 收束句（约 25 词）', html: '写作者的目的、警告或建议，例如 The author concludes that... / warns that...。不写自己的看法。' },
      { title: '复查 · 三遍', html: '第一遍查准确（有没有加强或减弱原文），第二遍查完整（分点够不够），第三遍查语言（有没有连续 7 个词照搬）。' }
    ] },

    { t: 'h', lvl: 2, text: '四、压缩技巧：上位词、删例证、合并同类', id: 'ch02-4' },

    { t: 'p', html: '压缩不是「把每句缩短」，而是<b>换层级</b>。第一种技巧是<b>上位词</b>（superordinate）：把一串具体事物换成一个更概括的词。原文列举「混合动力车、电动车、氢燃料车」，摘要写 <code>alternative-fuel vehicles</code>；原文说「博物馆、画廊、私人收藏」，摘要写 <code>cultural institutions</code>。一个上位词能替掉十几个词，而且不丢信息。' },

    { t: 'p', html: '第二种是<b>删例证</b>。原文用三段讲一个博物馆馆长的故事，摘要只需要「作者以一家博物馆为例」六个词，甚至可以不提。判断标准：删掉这个例子，分论点还成立吗？成立就删。第三种是<b>合并同类</b>：原文把「成本高」「维护贵」「需要专门人员」分三段写，其实是同一条理由的三个面向，摘要合并成 <code>the high cost of maintenance and staffing</code> 一句。' },

    { t: 'p', html: '还有两个微观动作。<b>去修饰</b>：<code>very</code>、<code>extremely</code>、<code>in my opinion</code>、<code>it is important to note that</code> 全部删掉，它们不承载信息。<b>动词化</b>：<code>the implementation of the policy</code> 改成 <code>implementing the policy</code>，<code>there is a tendency for users to</code> 改成 <code>users tend to</code>。每改一处省三到五个词，一篇摘要改十处就省下四五十词。' },

    { t: 'p', html: '压缩的反面是<b>拼接式改写</b>（patchwriting）：保留原文句子骨架，只替换几个同义词。比如原文 <code>Museums have increasingly turned to AI to restore damaged works.</code> 改成 <code>Museums have more and more used AI to repair broken pieces.</code> 这不叫自己的话，叫换词。真正的重述要改变<b>句法结构</b>：<code>AI-assisted restoration has become a common practice in museums.</code> 主语、动词、信息顺序都变了，才安全。' },

    { t: 'h', lvl: 2, text: '五、归属句式：让观点始终属于原作者', id: 'ch02-5' },

    { t: 'p', html: '摘要里每一句都在报告别人的观点，所以必须有<b>归属标记</b>（attribution）。最常用的两种句式：<code>According to Chen (2023), ...</code> 和 <code>Chen (2023) argues that ...</code>。前者把来源放在句首状语位置，后者把作者当主语。整段摘要至少出现两次作者名或 <code>the author</code>，否则读者会分不清哪句是原文观点、哪句是你的转述。' },

    { t: 'p', html: '报告动词（reporting verbs）要选得准，因为它们携带态度。<code>argues</code> 中性偏强，<code>claims</code> 暗示可能有争议，<code>contends</code> 正式，<code>notes</code> 偏弱（只是指出事实），<code>warns</code> 带警告意味，<code>suggests</code> 表示不确定。如果原文只是谨慎地提出可能性，你写 <code>argues</code> 就把语气加强了；反之原文是强烈主张，你写 <code>mentions</code> 就削弱了。选动词前回原文看一眼作者的措辞强度。' },

    { t: 'p', html: '时态有一条简单规则：报告<b>文章内容</b>用一般现在时（<code>The author argues</code>、<code>She notes that</code>），因为文本是永远存在的；提到<b>研究发生的时间</b>用过去时（<code>The study found</code>）。中国学生常全篇用过去时，读起来像在讲一件已经结束的事，而不是在陈述一篇文章的论点。另外，<code>the author says</code> 不算错，但一段里出现四次会显得词汇贫乏。' },

    { t: 'quiz', qid: 'ch02-q2' },

    { t: 'h', lvl: 2, text: '六、摘要与评论：一条界线三种越界', id: 'ch02-6' },

    { t: 'p', html: '摘要与评论（response）的分界只有一句话：<b>摘要报告作者说了什么，评论说你认为作者说得对不对</b>。这条线在写作时很容易被跨过去，常见三种越界。第一种是<b>加评价词</b>：<code>convincing</code>、<code>weak</code>、<code>interesting</code>、<code>unfortunately</code>。第二种是<b>加个人经验</b>：<code>In my country, we also...</code>。第三种是<b>加建议</b>：<code>The author should have discussed...</code>。这三种都是评论的内容，出现在摘要里就扣分。' },

    { t: 'p', html: '有些句子看起来像摘要，其实是评论。比如 <code>The author successfully proves that AI threatens authenticity.</code> 里的 <code>successfully</code> 已经是在评判论证质量。<code>Although the author makes a strong case, ...</code> 里的 <code>although</code> 预告了反驳。改法是删掉评价副词，把「成功证明」改回「主张」：<code>The author argues that AI threatens authenticity.</code> 语气中性，信息不变。' },

    { t: 'compare', left: { title: '摘要该做的', html: '报告主旨与主要分论点；用 <code>argues</code>、<code>notes</code> 等中性动词；保留原文的限定词（may、some、in certain cases）；标注作者与年份；用一般现在时。' }, right: { title: '评论才做的', html: '判断论证强弱；指出证据不足；联系个人经历；提出作者应补充什么；使用 <code>convincing</code>、<code>flawed</code>、<code>I agree</code>；给出改进建议。' } },

    { t: 'p', html: '课程作业里两者常常连着写：先摘要后评论。这时更要注意分段与信号词。摘要部分结束时可以用一句 <code>The article thus presents a case for ...</code> 收住，然后另起一段用 <code>This argument is partly convincing because ...</code> 转入评论。读者一眼就能看出界线在哪里。混在一段里写，评分时会被判为「摘要不纯」。' },

    { t: 'h', lvl: 2, text: '七、一段式摘要：坏例、好例与逐句修改', id: 'ch02-7' },

    { t: 'p', html: '下面是一段失败的摘要（原文是一篇讨论 AI 修复名画的文章）：<code>This article is about AI and art. Museums use AI to fix old paintings. Some people think this is bad. The author talks about Klimt and Picasso. In conclusion, AI is a controversial topic.</code> 四句话，四个问题：没有出处与主张、没有分论点、把反方当成作者、最后一句是空话。它复述了标题，却没有报告任何论证。' },

    { t: 'p', html: '修改后的版本：<code>In "Restoring the Unrestorable," Ruiz (2022) argues that AI-assisted restoration gives museums access to works that would otherwise remain damaged, but that the practice raises unresolved questions about authenticity. Ruiz first explains that machine-learning models can reconstruct missing regions from surviving fragments. He then notes that several major museums have adopted the technique for high-profile collections. Finally, he acknowledges critics who warn that a reconstructed surface is no longer the work of the original artist, and concludes that museums need clear disclosure rules rather than a ban.</code>' },

    { t: 'p', html: '对照看，好版本做了五件事：第一句给出标题、作者、年份与核心主张（含 <code>but</code> 保留了两面性）；第二、三句各报一条分论点；第四句处理让步与收束，用 <code>acknowledges</code> 标明那是作者承认的反对意见，用 <code>concludes</code> 标明结论归属。全文没有一句评价，也没有一个数据，但读者能准确说出这篇文章的论证走向。这就是 150 词该达到的信息密度。' },

    { t: 'p', html: '自己练的时候，建议按这个顺序改三遍：第一遍只改<b>结构</b>（有没有出处句、分点够不够、收束有没有），第二遍只改<b>准确</b>（对照原文查限定词与动词强度），第三遍只改<b>语言</b>（连续七词重复、拼写、时态）。三遍分开改，比一遍同时改五项效率高得多，因为每一次只需要盯一个维度。' },

    { t: 'quiz', qid: 'ch02-q3' },

    { t: 'terms', items: [
      { en: 'summary', zh: '摘要', html: '对来源文本的客观压缩，保留主旨与主要分论点，不含评价与新信息。' },
      { en: 'attribution', zh: '归属', html: '明确标出某个观点属于哪位作者、哪一年、哪篇文章的写作动作。' },
      { en: 'reporting verb', zh: '报告动词', html: 'argues、claims、notes、warns 等引出他人观点的动词，其强度暗示作者语气。' },
      { en: 'superordinate', zh: '上位词', html: '比原文具体词更概括的词，如用 alternative-fuel vehicles 代替三种车型。' },
      { en: 'patchwriting', zh: '拼接式改写', html: '保留原句骨架只换同义词的伪重述，属于学术不端的一种。' },
      { en: 'response', zh: '评论', html: '在读懂原文后表明自己立场并给出理由的写作，与摘要的分界是「评价」。' },
      { en: 'disclosure', zh: '披露', html: '公开说明作品或数据经过何种处理，常用于 AI 修复、图像编辑等伦理讨论。' }
    ] },

    { t: 'keypoint', items: [
      { title: '三条底线：准确、完整、自己的话', html: '不加强也不减弱原文语气；主要分论点都在；不出现连续七个词照搬。' },
      { title: '为摘要而读要主动丢弃', html: '只标主张与分论点，例证、数据、故事不标；五到七个标记就够。' },
      { title: '五到七句的固定骨架', html: '出处句（作者+年份+标题+主张）→ 三条分点 → 收束句（作者的目的或警告）。' },
      { title: '压缩靠换层级，不靠删字', html: '上位词替具体列举，删例证，合并同类理由，去修饰，动词化。' },
      { title: '归属句至少出现两次', html: 'According to X (年) 或 X argues that；报告动词的强弱要与原文语气匹配。' },
      { title: '摘要没有立场', html: 'convincing、weak、I agree、should have 都是评论语言；出现即越界。' }
    ] },

    { t: 'checklist', id: 'ch02', items: [
      '我的摘要第一句包含作者、年份、标题与核心主张，且主张是完整从句',
      '我写出了三条主要分论点，而不是只复述开头与结尾',
      '我没有加入任何评价词、个人经历或对作者的建议',
      '我保留了原文的限定词（may、some、often），没有把可能说成必然',
      '我至少用了两次归属标记，读者能分清哪句属于原作者',
      '我用了上位词、删例证、合并同类中的至少两种压缩技巧',
      '我检查过连续七个词与原文相同的片段，并全部改写或加引号',
      '我的摘要长度在 150–200 词之间，没有超出一段',
      '我把摘要与评论分开写，并用信号句标出两者的界线'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章覆盖摘要的定义与三条底线、为摘要而读的取舍标准、五到七句骨架、三种压缩技巧、归属句式与报告动词、摘要与评论的界线、一段式摘要的坏例与好例。依据是 ENG1001 的 Summary 专题课件（How to Write a Summary）与课程阅读文章（AI 修复名画、隐私与数字世界等）。文中的 150–200 词、800–1000 词、四分之一到三分之一是常见作业区间，具体字数与篇数以当学期作业说明为准；Ruiz (2022) 与文中摘要例句是为讲解构造的示例，不对应资料库中的真实文献，引用时请勿照抄。改写与引用的判定规则（含连续多少词算抄袭）各校规定不同，ch04 会给出通用做法。' }
  ]
});
