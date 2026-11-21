/* =====================================================================
 * ch03.js · 第 3 章「文献综述：从罗列到综合」
 * 职责：区分 summary 与 synthesis，给出三种组织方式、三种使用文献的方式、
 *       转述四步、综述段落的 claim-evidence-comment 结构，以及 APA 7 的形制规则。
 * 依据：Week 3 Class 2（RQ 与含文献综述的引言）、Week 11（文献综述工作坊）；
 *       Research Project 的 rubric 中「文献与论点的衔接」维度。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch03',
  num: '03',
  title: '文献综述：从罗列到综合',
  en: 'LITERATURE REVIEW',
  goals: [
    '区分 summary 与 synthesis，判断自己的综述是在介绍文献还是在论证',
    '按主题、时间或方法三种方式组织文献，并为自己的 RQ 选一种',
    '正确使用直接引用、转述与总结，说清三者在篇幅与用途上的差别',
    '按转述四步改写一个句子，并判断改写后的版本是否仍属抄袭',
    '写出一个含 claim、evidence 与 comment 的综述段落，并用 APA 7 标注'
  ],
  kp: [
    { id: 'ch03-1', title: '综述不是读书笔记' },
    { id: 'ch03-2', title: '三种组织方式' },
    { id: 'ch03-3', title: '引用、转述、总结' },
    { id: 'ch03-4', title: '转述四步与抄袭边界' },
    { id: 'ch03-5', title: '综述段落的三段式' },
    { id: 'ch03-6', title: '在综述里定位 gap' },
    { id: 'ch03-7', title: 'APA 7：文内引用与参考文献表' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么综述最容易写成「文献列表」', html: '打开一篇学生综述，常看到这样的段落：某研究发现了 A。另一项研究发现了 B。还有一项研究认为 C。每句都对，每句都有引用，但读完你不知道作者想说什么。问题不在引用数量，而在<b>缺少一个统摄这些文献的主张</b>。综述的任务不是证明你读过书，而是用别人的研究<b>搭出你自己的论证台阶</b>：他们做到了哪一步，还差哪一步，而你正好要补那一步。' },

    { t: 'p', lead: true, html: '文献综述（literature review）在一篇论文里通常占引言的后半，或者独立成一节。它的功能有三个：<b>建立可信度</b>（你确实了解这个领域）、<b>划出边界</b>（哪些问题已被回答）、<b>制造必要性</b>（你的 RQ 为什么还值得问）。三个功能里，第三个决定综述的成败。一篇只完成前两个功能的综述，读者会觉得「背景介绍得不错」，但不会觉得「这项研究非做不可」。' },

    { t: 'h', lvl: 2, text: '一、综述不是读书笔记', id: 'ch03-1' },

    { t: 'p', html: '这里有一对关键区分：<b>summary（摘要式复述）</b>与 <b>synthesis（综合）</b>。Summary 以文献为单位，一篇一段，说清它做了什么；Synthesis 以<b>你的主张</b>为单位，把多篇文献按某个维度放在一起比较，指出它们共同支持什么、在何处分歧。前者按作者排列，后者按论点排列。评分量表里「literature is synthesised rather than listed」这一条，说的就是这件事。' },

    { t: 'compare', left: { title: '罗列式（summary）', html: '<code>Yu and Lee (2014) studied peer feedback. Wang (2018) studied international students. Another study examined teacher feedback.</code><br><br>三句话之间没有逻辑关系，只是三个并列的事实。读者无法从中推出任何结论，也无法看出你的研究要接在哪里。' }, right: { title: '综合式（synthesis）', html: '<code>Studies of feedback in L2 writing have consistently shown that learners prioritise teacher comments over peer comments (Yu &amp; Lee, 2014), yet little is known about how this preference shifts as learners gain experience abroad (Wang, 2018).</code><br><br>两篇文献被放进同一个比较维度（对反馈来源的偏好），并用 yet 制造出缺口。句子本身已经是一个论证。' } },

    { t: 'p', html: '从 summary 走向 synthesis，动作其实只有三个。<b>第一，给段落写一句主张</b>，放在段首，比如「二语写作研究普遍发现学习者更信任教师反馈」。<b>第二，把文献按它们对这个主张的态度分组</b>：支持的一组、提出条件的一组、反驳的一组。<b>第三，在组与组之间写连接</b>：一致的地方用 similarly、consistent with，冲突的地方用 however、in contrast。做完这三个动作，段落就会自己长出一个论点。' },

    { t: 'p', html: '还有一个判断标准：<b>把段落里的作者名全部删掉，看这段话还成不成立</b>。如果删掉之后只剩「有研究认为……有研究认为……」，说明你写的是列表；如果删掉之后仍然有一个可读的论断（「学习者对反馈来源的偏好随经验变化」），说明你写的是综合。作者名是证据的标签，不是句子的骨架。' },

    { t: 'h', lvl: 2, text: '二、三种组织方式', id: 'ch03-2' },

    { t: 'p', html: '综述的结构有三种常见组织方式，选哪种取决于你的 RQ 和文献的成熟度。<b>按主题（thematic）</b>最常见，把文献分成几个概念组；<b>按时间（chronological）</b>适合展示一个领域如何演变；<b>按方法（methodological）</b>适合比较不同研究设计的得失。三种可以嵌套，但一个二级小节里只用一种主组织方式，否则读者会迷路。' },

    { t: 'table', caption: '三种组织方式的适用条件与风险', head: ['方式', '什么时候用', '常见风险'], rows: [
      ['按主题', '文献已足够多，可以按概念分组；你的 RQ 有明确的关键变量', '分组维度不统一，同一篇文献在两个组里都出现'],
      ['按时间', '领域有明显的范式转变，或你要说明某个观点如何演化', '写成编年史，缺少评价，读者不知道哪一段最重要'],
      ['按方法', '你要论证「现有方法有局限」，为自己的设计做铺垫', '变成方法罗列，忘记回到研究问题']
    ] },

    { t: 'p', html: '主题式分组的关键是<b>分组维度必须一致</b>。如果你第一组按「研究对象」分（中学生、大学生），第二组按「研究方法」分（问卷、访谈），第三组按「理论框架」分，读者会觉得你的分类没有逻辑。选定一个维度后，所有组都沿用它；确实需要第二个维度时，把它做成嵌套层，而不是并列层。' },

    { t: 'p', html: '时间式最容易写成流水账。补救办法是<b>每个时间段都给出一个判断</b>，而不只是日期与作者：<code>Early work treated feedback as transmission, whereas studies from the past decade increasingly frame it as dialogue.</code> 这句话既交代了演变，也给出了你的评价。有了评价，编年史才变成论证。' },

    { t: 'p', html: '方法式适合在方法章之前使用。它不比较结论，而比较<b>哪种设计能回答哪类问题</b>：问卷擅长分布与相关，访谈擅长机制与意义，文本分析擅长语言特征，课堂观察擅长互动过程。写得好，读者会自然接受你的设计选择；写得差，就变成「有人用问卷，有人用访谈」的清单。' },

    { t: 'h', lvl: 2, text: '三、引用、转述、总结', id: 'ch03-3' },

    { t: 'p', html: '使用文献有三种方式，篇幅与用途都不同。<b>直接引用（quotation）</b>逐字照抄，加引号并给页码，只在你需要保留原话的措辞时才用——比如一个定义、一句关键论断、一个特别精准的表达。整篇论文的直接引用比例通常控制在很低，因为引多了会显得你没有自己的话。<b>转述（paraphrase）</b>用自己的句子重述一个观点，篇幅与原句相当，是最常用的方式。<b>总结（summary）</b>把一整段或一整篇压缩成两三句，用于交代背景或研究设计。' },

    { t: 'table', caption: '三种方式的形制要求与适用场景', head: ['方式', '形制要求', '什么时候用'], rows: [
      ['直接引用', '引号 + 作者 + 年份 + 页码，逐字不改', '定义、关键论断、需要保留原措辞的句子'],
      ['转述', '自己的句法与词序 + 作者 + 年份，不加引号', '绝大多数引用场景，尤其是支撑你的论点时'],
      ['总结', '压缩到两三句 + 作者 + 年份，概括整体而非细节', '交代一项研究的整体设计，或一个领域的背景']
    ] },

    { t: 'p', html: '三者共有一条底线：<b>读者必须能顺着标注找到原始出处</b>。文内引用（in-text citation）给作者与年份，参考文献表给完整信息，两者一一对应。缺一头，引用链就断了。常见错误是文内写了作者却没进参考文献表，或者参考文献表里堆了一堆正文没引过的条目——后者在评分时会被视为凑数。' },

    { t: 'p', html: '还有一个语用问题：<b>引用的密度</b>。一段话里连续出现四五个引用，读者会失去线索；一整段没有一个引用，读者会怀疑这是你的臆断。经验法则是每个主张配一到两个来源，段落内部留出你自己的解释句——那句解释才是你的贡献。' },

    { t: 'h', lvl: 2, text: '四、转述四步与抄袭边界', id: 'ch03-4' },

    { t: 'p', html: '转述之所以容易出问题，是因为它同时要求两件相反的事：<b>忠实于原意，又必须换成自己的语言</b>。只做前者，会变成逐字替换同义词的「拼贴式转述」（patchwriting）；只做后者，会歪曲原意。四步法可以把这两件事分开处理，降低同时失败的概率。' },

    { t: 'steps', items: [
      { title: '第 1 步 · 读懂再合上原文', html: '读完目标段落后把 PDF 关掉，试着用一句中文说出它的核心主张。说不出来，说明你还没读懂，此时动笔必然变成抄词。' },
      { title: '第 2 步 · 改变句法骨架', html: '把主动改被动、把两个短句合并、把名词化还原成动词、调整信息顺序。关键不是换词，而是换句子的骨架。' },
      { title: '第 3 步 · 换词但保留术语', html: '普通词可以替换（important → central），学科术语不要换（peer feedback 不能改成 friend comments），否则会失真。' },
      { title: '第 4 步 · 回原文核对并标注', html: '把自己的句子与原文逐点对照，确认没有添加原文没有的因果或程度，然后加上作者与年份。若保留了独特措辞，就必须加引号。' }
    ] },

    { t: 'p', html: '什么算抄袭？边界比多数人以为的宽。<b>逐字照抄不加引号</b>是抄袭；<b>只替换同义词而保留原句结构</b>也是抄袭（patchwriting）；<b>用了别人的观点但不标注</b>是抄袭，哪怕你完全用自己的话写；<b>把别人的论证顺序照搬过来只换例子</b>，同样有风险。反过来，<b>标注了来源但句子结构仍与原文高度相似</b>，在多数学校的判定里依然算不当使用。' },

    { t: 'p', html: '一个自检动作：把自己的转述句和原文并排放，遮住内容只看结构——主谓宾的顺序、从句的位置、连接词的选择是否几乎一致？如果一致，即使每个词都换了，也还是拼贴。另一个自检：这句话里有没有<b>你自己的判断</b>（例如指出该研究的样本限制）？有判断的句子天然不像原文，因为它带着你的视角。' },

    { t: 'h', lvl: 2, text: '五、综述段落的三段式', id: 'ch03-5' },

    { t: 'p', html: '一个成熟的综述段落通常由三部分组成：<b>claim（这一组文献共同支持什么）、evidence（哪些研究、怎么支持的）、comment（这意味着什么，或还缺什么）</b>。三段式的顺序可以微调，但三块缺一不可。缺 claim，段落没有方向；缺 evidence，claim 没有支撑；缺 comment，段落无法推进到你的研究。' },

    { t: 'p', html: '写 claim 的要领是<b>把它写成一句可被反驳的话</b>。「许多研究关注同伴反馈」几乎无法反驳，因为它太宽泛；「同伴反馈在提升修改意愿上效果稳定，但在提升文本质量上结论不一」就有立场，也有被质疑的可能。能被反驳的 claim 才是学术 claim，因为它把话说到了具体处。' },

    { t: 'p', html: '写 comment 的要领是<b>不要重复 claim</b>。很多段落最后一句只是把第一句换个说法，读者读完没有任何推进。好的 comment 做三件事之一：指出这组研究的方法局限、指出结论之间的冲突、或指出它们共同忽略的变量。第三种最直接地通向你的 gap，也是综述与引言衔接的地方。' },

    { t: 'p', html: '看一个完整的例子：<code>Research on written corrective feedback has largely focused on whether correction improves accuracy (claim). Studies using controlled writing tasks report consistent gains, whereas classroom-based studies find effects that vary with learner proficiency (evidence). This divergence suggests that the effect depends on conditions that task-based designs do not capture (comment).</code> 三句各司其职，第三句自然引出「那么需要什么设计」——也就是你的研究。' },

    { t: 'h', lvl: 2, text: '六、在综述里定位 gap', id: 'ch03-6' },

    { t: 'p', html: 'Gap 不是一个空位，而是<b>由文献之间的矛盾、局限或前提假设暴露出来的问题</b>。ch01 讲过四类形态（人口、情境、方法、时间），在综述里它们各自有对应的写法。要点是：gap 必须从你刚刚综述的那组文献里<b>长出来</b>，而不是突然宣布「很少有人研究 X」。' },

    { t: 'p', html: '三种可靠的 gap 写法。<b>矛盾式：</b>两组研究结论相反，原因未明——<code>These conflicting findings raise the question of whether ...</code>。<b>局限式：</b>多数研究依赖某一类样本或工具——<code>Because most evidence comes from self-report data, little is known about ...</code>。<b>前提式：</b>已有研究都默认了某个未经验证的假设——<code>These accounts assume that ..., an assumption that has not been tested in ...</code>。第三种最有分量，也最难写。' },

    { t: 'p', html: '写完 gap 之后一定要接一句「所以本研究做什么」。这句叫 <b>purpose statement</b>，是引言最后的落点：<code>This study therefore examines how ...</code>。gap 与 purpose 之间的逻辑必须是「因为有这个缺口，所以我来补」，而不是「因为别人没做，所以我也做」。区别在于前者有理由，后者只有动机。' },

    { t: 'h', lvl: 2, text: '七、APA 7：文内引用与参考文献表', id: 'ch03-7' },

    { t: 'p', html: 'APA 7 是这门课指定的引用格式。它的规则不多，但要一致。<b>文内引用</b>给作者与年份：<code>(Wang, 2018)</code>；叙述式引用把作者放进句子：<code>Wang (2018) argued that ...</code>；两位作者用 &amp; 连接：<code>(Yu &amp; Lee, 2014)</code>；三位及以上从第一次引用起就用 et al.：<code>(Chen et al., 2020)</code>。直接引用加页码：<code>(Wang, 2018, p. 45)</code>。' },

    { t: 'table', caption: 'APA 7 参考文献表的形制模板（占位符需替换为真实信息）', head: ['类型', '模板'], rows: [
      ['期刊论文', 'Author, A. A., &amp; Author, B. B. (Year). Title of article. <i>Title of Periodical, volume</i>(issue), pages. https://doi.org/xxxx'],
      ['专著', 'Author, A. A. (Year). <i>Title of work: Capital letter also for subtitle</i>. Publisher.'],
      ['编著中的一章', 'Author, A. A. (Year). Title of chapter. In E. Editor (Ed.), <i>Title of book</i> (pp. xx–xx). Publisher.'],
      ['网页或报告', 'Author or Organisation. (Year, Month Day). <i>Title of page</i>. Site Name. URL']
    ] },

    { t: 'p', html: '四条形制细节最常出错。<b>悬挂缩进</b>：每条参考文献的第一行顶格，其余行缩进。<b>字母顺序</b>：按第一作者姓氏排列，不分类型。<b>斜体范围</b>：期刊名与卷号斜体，文章标题不斜体；书名整体斜体。<b>DOI</b>：写成完整的 https 链接，不写 doi: 前缀。这些细节不影响思想，但影响「是否遵守规范」这一项评分。' },

    { t: 'p', html: '最后一条建议：<b>边写边录</b>。不要等全文写完再回头补参考文献表——那时你已经记不清哪句话出自哪一篇。每插入一个引用，就立刻把条目加进文献管理工具或表格里。到定稿时，你只需要统一格式与排序，而不是重新做一遍考古。' },

    { t: 'terms', items: [
      { en: 'synthesis', zh: '综合', html: '以作者自己的主张为单位，把多篇文献放在同一维度上比较、归类、评价，而不是逐篇介绍。' },
      { en: 'patchwriting', zh: '拼贴式写作', html: '保留原文句法结构、只替换部分词语的改写方式，在学术规范中仍被视为抄袭。' },
      { en: 'paraphrase', zh: '转述', html: '用不同句法重述他人观点并标注来源，篇幅与原句相当。须改变句子骨架，不只是换词。' },
      { en: 'in-text citation', zh: '文内引用', html: '正文中标注来源的简短形式，通常为（作者，年份），须与参考文献表条目一一对应。' },
      { en: 'purpose statement', zh: '研究目的陈述', html: '引言末尾说明本研究要做什么的句子，紧接在 gap 之后，构成「有缺口所以我来补」的逻辑。' },
      { en: 'hanging indent', zh: '悬挂缩进', html: '参考文献表排版规则：每条第一行顶格，后续行向右缩进。' },
      { en: 'et al.', zh: '等人', html: 'APA 7 中三位及以上作者从首次引用起即用第一作者加 et al.，参考文献表中则列出前 19 位作者。' }
    ] },

    { t: 'quiz', qid: 'ch03-q1' },
    { t: 'quiz', qid: 'ch03-q2' },
    { t: 'quiz', qid: 'ch03-q3' },

    { t: 'keypoint', items: [
      { title: '综述按论点排列，不按作者排列', html: '删掉作者名后段落仍成立，说明你写的是综合；只剩「有研究认为」的并列，说明还是列表。' },
      { title: '组织方式要单一', html: '主题、时间、方法三选一作为主结构，嵌套可以，并列混用会让读者迷路。' },
      { title: '引用三分法各有用处', html: '直接引用留原话，转述承载多数论证，总结交代背景。三者都必须能与参考文献表对上。' },
      { title: '转述的关键是换骨架', html: '读懂后合上原文、改句法、保留术语、回原文核对并标注。只换同义词仍属抄袭。' },
      { title: 'gap 从文献里长出来', html: '矛盾式、局限式、前提式三种写法，都必须紧接一句 purpose statement，才构成完整的引言逻辑。' }
    ] },

    { t: 'checklist', id: 'ch03', items: [
      '我能判断自己的一段综述是 summary 还是 synthesis，并说出依据',
      '我能把三段罗列式文献改写成一段有 claim 的综合段落',
      '我为自己的综述选定了主题、时间或方法中的一种主组织方式，并保持全节一致',
      '我能说清直接引用、转述、总结三者在形制与用途上的区别',
      '我按转述四步改写过一个句子，并确认它与原文的句法结构不同',
      '我能指出 patchwriting 与合格转述的差别，并识别出自己文稿里的风险句',
      '我写的综述段落包含 claim、evidence 与 comment，且 comment 没有重复 claim',
      '我能用矛盾式或局限式写出自己的 gap，并紧接着写一句 purpose statement',
      '我的文内引用与参考文献表一一对应，格式符合 APA 7 的悬挂缩进与斜体规则'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应 Week 3 Class 2 的「研究问题与含文献综述的引言」以及 Week 11 的文献综述写作工作坊，内容依据这两份讲义对综述功能的说明，并对照 Research Project 评分量表中「文献是否被综合而非罗列」的维度。APA 7 部分只给出形制模板（作者、年份、标题、来源、DOI 的位置与斜体范围），不提供任何具体条目，以免与真实文献混淆；实际提交时请以课程模板与教师要求为准。summary 与 synthesis 的区分、三种组织方式、claim-evidence-comment 三段式是为教学方便所做的归纳。文中 Yu 与 Lee（2014）、Wang（2018）仅作为比较维度与反向追踪的示例提及，未引用其具体数据；所有英文例句均为构造的教学示例，其中出现的作者名与年份不指向真实出版物，APA 模板中的占位符需要替换为真实信息后使用。' }
  ]
});
