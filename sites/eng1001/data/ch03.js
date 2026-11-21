/* =====================================================================
 * ch03.js · 第 3 章「学术语言：准确、简洁、有衔接」
 * 职责：把「语法没错但读起来不像学术英语」的句子改到合格；
 *       训练语域、搭配、hedging、简洁、衔接、句式变化与改稿流程。
 * 依据：ENG1001 Module II: Writing Language 课件与写作评分标准中的语言维度。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch03',
  num: '03',
  title: '学术语言：准确、简洁、有衔接',
  en: 'ACADEMIC LANGUAGE',
  goals: [
    '判断一个句子是否属于学术语域，并把口语化表达改成书面表达',
    '用 hedging 语言控制主张的强度，避免过度概括与绝对化',
    '把 30 词以上的冗长句压缩到 20 词以内，且不丢信息',
    '用指代、连接词与关键词复现三种手段让段落读起来连贯',
    '识别并修正主谓一致、悬垂修饰、逗号拼接、时态四类高频错误'
  ],
  kp: [
    { id: 'ch03-1', title: '学术语域：从「说出来」到「写下来」' },
    { id: 'ch03-2', title: '准确：搭配、用词与 hedging' },
    { id: 'ch03-3', title: '简洁：删冗余、去名词化、砍空话' },
    { id: 'ch03-4', title: '衔接：指代、连接词与关键词复现' },
    { id: 'ch03-5', title: '句式：长度变化与信息焦点' },
    { id: 'ch03-6', title: '四类高频语法错误与修法' },
    { id: 'ch03-7', title: '改稿流程：三遍法与检查表' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么语言要单独练一章', html: '很多同学的作文「语法没错、意思也懂，但读起来不像学术英语」。问题通常不在时态，而在三处：<b>语域</b>（把口语搬进论文）、<b>密度</b>（一句话塞三件事，读者要读两遍）、<b>衔接</b>（句子各自成立，段与段之间没有关系）。这三处恰好是评分表里「语言」一栏的主要扣分点，也是最容易通过刻意练习在四周内明显改善的部分。' },

    { t: 'p', lead: true, html: '这一章不教新的语法规则，而是教<b>改</b>。你会拿到三类典型病句：口语化的、臃肿的、断裂的，然后按固定动作把它们改成合格句子。学完的标准不是「知道什么叫 hedging」，而是「给你一段自己上周写的话，你能在 15 分钟内改出三个具体问题并修好」。' },

    { t: 'h', lvl: 2, text: '一、学术语域：从「说出来」到「写下来」', id: 'ch03-1' },

    { t: 'p', html: '语域（register）指语言随场合变化的正式程度。同一件事，在宿舍说 <code>I got a ton of stuff to do</code>，在论文里要写 <code>I have a substantial amount of work to complete</code>。学术语域有四个可观察的特征：<b>少用缩写</b>（写 does not 而不是 don’t）、<b>少用短语动词</b>（用 investigate 代替 look into）、<b>少用第一人称的情绪表达</b>（用 this essay argues 而不是 I feel like）、<b>名词短语更密</b>（the rapid adoption of remote work 而不是 people quickly started working from home）。' },

    { t: 'p', html: '但「正式」不等于「堆大词」。把 <code>use</code> 全换成 <code>utilize</code>、把 <code>show</code> 全换成 <code>demonstrate</code>，读起来反而僵硬，而且容易用错搭配。学术语域的核心是<b>精确与克制</b>：能用一个准确的常用词，就不要用三个似是而非的大词。评分老师更在意你是否说清楚了，而不是你的词汇表有多长。' },

    { t: 'table', caption: '口语与学术书面语的六组对照（不是绝对禁忌，但论文里应尽量避免）', head: ['口语表达', '学术表达', '说明'], rows: [
      ['a lot of / tons of', 'many / a great deal of', '数量表达要能接可数或不可数名词'],
      ['get / got', 'obtain / receive / become', 'get 义项太杂，学术写作要具体'],
      ['look into', 'investigate / examine', '短语动词偏口语，单个动词更正式'],
      ['and so on / etc.', 'such as A, B and C', '避免让读者猜你省略了什么'],
      ['I think / I feel', 'this essay argues / the evidence suggests', '减少主观感受，增加可检验的主张'],
      ['Nowadays / In modern society', 'In recent years / Since 2020', '空泛的时间状语换成具体时间']
    ] },

    { t: 'h', lvl: 2, text: '二、准确：搭配、用词与 hedging', id: 'ch03-2' },

    { t: 'p', html: '搭配（collocation）是词的固定伙伴关系。<code>conduct research</code>、<code>make a decision</code>、<code>raise a question</code>、<code>play a role</code>、<code>pose a threat</code> 都是固定搭配，换成同义词就错。中国学生的高频搭配错误有一批固定名单：<code>learn knowledge</code> 应为 <code>acquire knowledge</code>；<code>discuss about</code> 应为 <code>discuss</code>；<code>open the light</code> 应为 <code>turn on the light</code>；<code>solve the pollution</code> 应为 <code>solve the pollution problem</code>。' },

    { t: 'p', html: 'hedging（模糊限制）是学术写作的礼貌与诚实：<code>may</code>、<code>might</code>、<code>appears to</code>、<code>suggests</code>、<code>tends to</code>、<code>in most cases</code>、<code>the evidence indicates</code>。它的作用不是让你显得不确定，而是让你的主张<b>与证据强度匹配</b>。一份 30 人的问卷只能支持「tends to」，不能支持「always」。反过来，如果证据很强，你却通篇 <code>might possibly</code>，读者会觉得你不敢下结论。' },

    { t: 'p', html: '绝对化表达是最常见的失分点：<code>all</code>、<code>every</code>、<code>never</code>、<code>completely</code>、<code>proves</code>、<code>obviously</code>。学术写作里几乎没有「证明」，只有「支持」「表明」「与……一致」。把 <code>This proves that social media harms teenagers.</code> 改成 <code>This suggests that heavy social media use is associated with poorer well-being among teenagers.</code> 信息更准确，也更难被一个反例推翻。' },

    { t: 'quiz', qid: 'ch03-q1' },

    { t: 'h', lvl: 2, text: '三、简洁：删冗余、去名词化、砍空话', id: 'ch03-3' },

    { t: 'p', html: '学术句子的理想长度是 15–25 词。超过 30 词，读者就需要回读；低于 8 词连续出现，又显得碎片化。把长句压短有三个固定动作。<b>删冗余</b>：<code>due to the fact that</code> → <code>because</code>，<code>in the event that</code> → <code>if</code>，<code>at this point in time</code> → <code>now</code>，<code>a large number of</code> → <code>many</code>。<b>去名词化</b>：<code>the implementation of the policy</code> → <code>implementing the policy</code>，<code>there is a need for</code> → <code>we need</code>。<b>砍空话</b>：<code>It is important to note that</code>、<code>As we all know</code>、<code>In my personal opinion</code> 直接删，句子意思不变。' },

    { t: 'table', caption: '冗长表达与简洁表达的对照；左边每句至少能省 3 个词', head: ['冗长', '简洁', '省下'], rows: [
      ['due to the fact that', 'because', '4 词'],
      ['in spite of the fact that', 'although', '4 词'],
      ['has the ability to', 'can', '3 词'],
      ['make an assumption that', 'assume that', '3 词'],
      ['a significant number of', 'many', '3 词'],
      ['in the near future', 'soon', '3 词'],
      ['the reason why is that', 'because', '4 词']
    ] },

    { t: 'p', html: '还有一种隐形的冗长：<b>同义反复</b>。<code>basic fundamentals</code>、<code>past history</code>、<code>future plans</code>、<code>completely eliminate</code>、<code>very unique</code> 都是把一个意思说了两遍。改法是删掉其中一个词，而不是换一个更花的词。另一个隐形冗长是<b>过度铺垫</b>：用两句话交代「随着社会发展、人们生活水平提高」，第三句才进入主题。学术写作允许一句背景，第二句就该出现你的主张。' },

    { t: 'h', lvl: 2, text: '四、衔接：指代、连接词与关键词复现', id: 'ch03-4' },

    { t: 'p', html: '衔接（cohesion）让读者不用回头就知道「这句和上句什么关系」。三种手段各有分工。<b>指代</b>：用 <code>this</code>、<code>these</code>、<code>such</code>、<code>it</code> 回指前文，但 <code>this</code> 后面要跟名词（<code>this shift</code>、<code>this assumption</code>），否则读者不知道 this 指什么。<b>连接词</b>：however 表转折，therefore 表因果，in contrast 表对比，moreover 表递进，for instance 表举例。<b>关键词复现</b>：同一概念在几句里反复出现，可以用同一个词，也可以用同义词，但不要每句换一个花样，读者会以为是新概念。' },

    { t: 'p', html: '连接词最常见的误用是<b>逻辑错配</b>：句子之间是并列关系，却用了 however；是因果关系，却用了 moreover。检查方法很笨但有效：把连接词遮住，读前后两句，问自己「这两句真实的关系是什么」，再回来选词。另一个问题是<b>连接词过密</b>：每句开头都加一个 Furthermore、Moreover、Additionally，读起来像清单。一段里出现两到三个就够，其余靠指代与重复来衔接。' },

    { t: 'compare', left: { title: '断裂的段落', html: 'AI can help restore paintings. Many people worry about authenticity. Museums have used the technology. The rules are unclear. 四句话各自成立，但读者不知道它们之间的关系，也不知道哪句是重点。' }, right: { title: '有衔接的段落', html: 'AI can help restore paintings, and many museums have adopted the technology. <b>This shift</b>, <b>however</b>, raises concerns about authenticity. <b>Because</b> the rules remain unclear, <b>several critics</b> argue that disclosure should be mandatory. 指代、连接词、关键词复现三种手段都用上了。' } },

    { t: 'quiz', qid: 'ch03-q2' },

    { t: 'h', lvl: 2, text: '五、句式：长度变化与信息焦点', id: 'ch03-5' },

    { t: 'p', html: '一段话如果每句都是「主语 + 谓语 + 宾语」的 15 词句，读起来会像节拍器。好的学术段落有<b>长度变化</b>：一个长句展开论证，一个短句收束强调。比如三句 25 词之后来一句 <code>This matters.</code> 短句本身就是强调。反过来，连续五个 8 词短句会显得思路零碎，适合用 <code>while</code>、<code>although</code>、<code>which</code> 合并成复合句。' },

    { t: 'p', html: '信息焦点（information focus）指一句话最重要的信息放在<b>句末</b>，因为读者读到句末时注意力最高。比较 <code>Although the sample was small, the study found a clear trend.</code> 和 <code>Although the study found a clear trend, the sample was small.</code> 前者强调趋势，后者强调样本小。写反驳时把对方的弱点放句末，写支持时把自己的结论放句末。<b>句末位置是你最贵的资源</b>，不要用来放 <code>etc.</code> 或 <code>and so on</code>。' },

    { t: 'p', html: '另一个实用技巧是<b>主位一致</b>：一段话里的句子尽量以同一个话题开头，读者的注意力就不用反复重置。如果一段的主题是「博物馆」，就让博物馆、它们、这些机构轮流做主语，而不是突然换成「批评者」「技术」「成本」。主语跳来跳去，读者会觉得这段没有中心——其实中心是有的，只是被句法藏起来了。' },

    { t: 'h', lvl: 2, text: '六、四类高频语法错误与修法', id: 'ch03-6' },

    { t: 'p', html: '第一类是<b>主谓一致</b>，难在主语和谓语之间隔了修饰语：<code>The number of students who use AI tools have increased.</code> 主语是 <code>the number</code>，谓语应为 <code>has</code>。同理 <code>the quality of the sources</code> 用单数，<code>a range of studies</code> 用单数或复数取决于你想强调整体还是个体，但全文要一致。' },

    { t: 'p', html: '第二类是<b>悬垂修饰</b>（dangling modifier）：分词短语的逻辑主语必须与主句主语一致。<code>Walking through the museum, the paintings seemed to glow.</code> 走的是人，不是画。改成 <code>Walking through the museum, visitors found that the paintings seemed to glow.</code> 第三类是<b>逗号拼接</b>（comma splice）：两个完整句不能用逗号连接。<code>The rules are unclear, museums should disclose more.</code> 要么改成句号，要么加 <code>so</code> 或分号。' },

    { t: 'p', html: '第四类是<b>时态与冠词</b>。时态方面，同一段里描述研究用过去时、陈述结论用现在时，混用会让读者以为你在讲两件事。冠词方面，中国学生常漏 <code>the</code> 或乱加 <code>a</code>：<code>the government</code> 指特定政府，<code>a government</code> 指任意一个；<code>research</code> 不可数，不能说 <code>a research</code>，要说 <code>a study</code> 或 <code>some research</code>。这两类错误不影响理解，但密度高了会明显拉低语言分。' },

    { t: 'h', lvl: 2, text: '七、改稿流程：三遍法与检查表', id: 'ch03-7' },

    { t: 'p', html: '改稿不要「从头读到尾，看到什么改什么」，那样每次只注意到最显眼的错误。用三遍法，每遍只盯一个维度。<b>第一遍读结构</b>：每段第一句是不是主旨句，段与段之间有没有连接词，有没有一段塞了两个主题。<b>第二遍读句子</b>：超过 30 词的句子拆开，连续三个短句合并，每句的主语是不是清楚。<b>第三遍读词</b>：搭配、hedging、绝对化词、缩写、重复。' },

    { t: 'p', html: '三遍法有一个物理技巧：<b>打印出来，用不同颜色标</b>。第一遍用蓝笔在段首写一句「这段在干什么」，写不出来就是结构问题；第二遍用红笔在长句旁画竖线；第三遍用绿笔圈出 very、really、a lot、always。颜色分开，你就不会在改句子的时候被单词问题打断。电子稿也可以用批注颜色实现同样效果。' },

    { t: 'p', html: '最后一招是<b>朗读</b>。默读会跳过错误，朗读不会：读不顺的地方通常就是句子结构有问题，读起来喘不过气的地方通常就是句子太长，读起来重复的地方通常就是关键词复现没做好。如果不好意思出声，用系统自带的朗读功能把文章念出来，听一遍也能发现大半问题。' },

    { t: 'quiz', qid: 'ch03-q3' },

    { t: 'terms', items: [
      { en: 'register', zh: '语域', html: '语言随场合变化的正式程度；学术写作要求书面、精确、克制的语域。' },
      { en: 'collocation', zh: '搭配', html: '词的固定伙伴关系，如 conduct research、pose a threat，换词即错。' },
      { en: 'hedging', zh: '模糊限制', html: 'may、suggests、tends to 等让主张强度与证据强度匹配的表达。' },
      { en: 'nominalization', zh: '名词化', html: '把动词或形容词变成名词，如 implement → implementation；过度使用会让句子臃肿。' },
      { en: 'cohesion', zh: '衔接', html: '通过指代、连接词、关键词复现让句子之间关系清楚。' },
      { en: 'dangling modifier', zh: '悬垂修饰', html: '分词短语的逻辑主语与主句主语不一致，造成语义错乱。' },
      { en: 'comma splice', zh: '逗号拼接', html: '用逗号连接两个完整句，是学术写作中的硬错误。' }
    ] },

    { t: 'keypoint', items: [
      { title: '正式不等于堆大词', html: '准确、克制、具体优先；能用一个常用词说清，就不要用三个大词。' },
      { title: 'hedging 让主张与证据匹配', html: '30 人问卷只能支持 tends to；证据强时也不要通篇 might possibly。' },
      { title: '删冗余、去名词化、砍空话', html: 'due to the fact that → because；the implementation of → implementing。' },
      { title: '衔接靠三种手段配合', html: 'this + 名词回指、连接词表逻辑、关键词复现维持话题；一段两三个连接词足够。' },
      { title: '句末是最贵的位置', html: '把要强调的信息放句末；长句展开，短句收束。' },
      { title: '三遍改稿，每遍只盯一个维度', html: '结构 → 句子 → 词；用不同颜色标记，最后朗读一遍。' }
    ] },

    { t: 'checklist', id: 'ch03', items: [
      '我删掉了所有缩写、短语动词和 I think / I feel 式表达',
      '我检查过每个动词的搭配，没有出现 learn knowledge、discuss about 这类错误',
      '我的每个强主张都有 hedging 或具体限定，没有 all、never、proves',
      '我把超过 30 词的句子都拆开或重组，平均句长在 15–25 词',
      '我删掉了 due to the fact that、It is important to note that 这类冗余',
      '我每段都有清楚的主旨句，段与段之间有连接词或指代衔接',
      '我没有连续三句用同一个主语开头，也没有连续五个短句',
      '我检查了主谓一致、悬垂修饰、逗号拼接、时态四类错误',
      '我按结构、句子、词三遍改稿，并朗读过全文'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章覆盖学术语域的四个特征、口语与书面语对照、搭配与 hedging、三种简洁化动作、三种衔接手段、句长与信息焦点、四类高频语法错误、三遍改稿流程。依据是 ENG1001 的 Module II: Writing Language 课件与写作评分标准中的语言维度。文中的 15–25 词、30 词是编辑建议而非硬性规定；判断「连续多少词相同算抄袭」属于学术诚信规则，不在本章范围，见 ch04。例句中的百分比与调查规模仅用于说明证据强度，不代表真实研究。' }
  ]
});
