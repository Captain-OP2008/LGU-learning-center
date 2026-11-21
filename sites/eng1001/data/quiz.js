/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；每章 q1–q7，q1–q3 与 chXX.js 内嵌题一致
 * 字段：id / ch / kp / tier / type / difficulty / tags / stem / options / answer / explain
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: 'ENG1001 的七个模块是按什么逻辑串起来的？',
        options: [
          { text: '从读到写、从段到篇、从书面到口头，后一个模块用前一个模块的产出', correct: true },
          { text: '按语法点难度从易到难排列' },
          { text: '按考试题型分类，彼此独立' },
          { text: '按教材章节顺序，与任务类型无关' }
        ],
        explain: '课程主线是「阅读输入—摘要—语言—引用—来源—文章—汇报」，每一环都消费上一环的成果；所以跳过阅读直接练写作，会在证据与改写上反复卡住。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '「一篇好文章的五个动作」中，下列哪一项不属于这五个动作？',
        options: [
          { text: '先背三套万能模板，考试时套用', correct: true },
          { text: '读懂原文，找出主旨与分论点' },
          { text: '提出一个可争论、可限定的论点' },
          { text: '用证据支撑，并标注来源' }
        ],
        explain: '五个动作是读、想、写、改、引：读懂、形成论点、组织段落、反复修改、标注来源。模板不产生论点，也无法替代证据与修改。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '这门课的分数主要来自哪里？',
        options: [
          { text: '摘要、文章、口头汇报等过程性任务，按 rubric 分项评分', correct: true },
          { text: '一次期末笔试，其余不算分' },
          { text: '出勤与课堂发言' },
          { text: '教材课后练习的对错' }
        ],
        explain: 'ENG1001 以写作与口头任务为主线，评分看内容、组织、语言、引用等维度；具体权重每学期在 syllabus 里不同，不要把某年的比例当成固定值。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '学术英语与高中英语的主要差别，是句子要写得更长、更华丽。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '差别在任务与读者：学术写作要求论点清楚、证据可查、来源可追溯，语言反而追求准确与简洁。长句和生僻词不会加分，只会增加歧义。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'multi', difficulty: 1, tags: ['concept'],
        stem: '这门课要训练的能力包括下列哪些？（多选）',
        options: [
          { text: '从学术文章中定位主旨与证据', correct: true },
          { text: '把长文压缩成一段有出处的摘要', correct: true },
          { text: '用 APA 标注来源、区分引用与改写', correct: true },
          { text: '用英语做结构清楚的口头汇报', correct: true },
          { text: '背诵学术词汇表并默写定义' }
        ],
        explain: '阅读、摘要、引用、写作、汇报是课程的五条能力线；词汇是工具，不是考核目标，背词表不能替代在任务中使用词汇。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '本站把 8 章内容安排在约多少周内？只填数字。',
        answer: '14',
        accept: ['14', '十四', '14周'],
        explain: '课程按两周一个模块推进，第 14 周左右做口头汇报；期中的文章与期末的汇报是两个主要节点，节奏紧，靠平时积累而不是考前突击。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '使用本站与课程资料库，最有效的顺序是？',
        options: [
          { text: '先看本章讲解建立框架，再读对应课件与文章，最后用题库自测', correct: true },
          { text: '先刷完所有题，再回头看讲解' },
          { text: '只看课件，不看讲解与练习' },
          { text: '把资料全部下载后从第一页读到最后一页' }
        ],
        explain: '讲解给框架，课件与文章给真实语料，题库检验是否真的会用。先做题会变成背答案，先读全部资料则容易迷失在没有任务目标的阅读里。'
      },

      /* ---------------- ch01 学术阅读 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '三遍读法中，第二遍 scan 的主要目的是什么？',
        options: [
          { text: '带着具体问题快速定位人名、数据、定义等目标信息', correct: true },
          { text: '逐字翻译全文，查清每个生词' },
          { text: '记住作者使用的所有例子' },
          { text: '判断文章是否值得引用' }
        ],
        explain: '三遍读法各司其职：skim 抓结构与主旨，scan 定位具体信息，close read 拆论证与措辞。把 scan 做成逐字翻译，会拖慢速度且失去目的。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '学术段落的主旨句最常出现在哪里？',
        options: [
          { text: '段首第一句，但第二句或段末也可能承担主旨', correct: true },
          { text: '一定在段末最后一句' },
          { text: '只出现在标题里' },
          { text: '没有规律，只能靠感觉' }
        ],
        explain: '段首主旨句最常见，因为读者需要预告；但作者有时先给例子或对比，再在第二句、段末给出主旨。判断依据是句子是否统摄整段，而不是位置。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '建立一套固定的批注符号（如主旨在双线、证据标 E、疑问标？），最大的好处是？',
        options: [
          { text: '第二次阅读或写摘要时能快速定位，不必重读全文', correct: true },
          { text: '让页面看起来更整洁' },
          { text: '可以替代写阅读笔记' },
          { text: '能保证引用格式正确' }
        ],
        explain: '符号系统是给未来的自己留索引：写摘要时按符号找主旨与证据，比重新通读快得多。它不能替代笔记，也不解决引用格式问题。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '学术论文的摘要（abstract）就是整篇文章的主旨句。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '摘要是对全文（目的、方法、结果、结论）的压缩，通常包含多个信息单元；主旨句是其中一个判断。把摘要当主旨句，会漏掉论证过程与限制条件。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'multi', difficulty: 1, tags: ['method'],
        stem: '读懂一段论证，需要识别下列哪些成分？（多选）',
        options: [
          { text: '作者的主张（claim）', correct: true },
          { text: '支撑主张的证据（evidence）', correct: true },
          { text: '从证据到主张的推理（reasoning）', correct: true },
          { text: '作者使用的形容词数量' }
        ],
        explain: '论证由主张、证据、推理构成，有时还有反例与限定。只划出主张而不看证据如何连接，就无法判断论证是否成立，也无法在写作中回应它。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'fill', difficulty: 1, tags: ['method'],
        stem: '遇到不影响理解主旨的生词，第一步应该先做什么？填一个动词。',
        answer: '跳过',
        accept: ['跳过', '略过', '猜', '猜测'],
        explain: '阅读的首要目标是理解论证，不是认全单词。先跳过或根据上下文猜，读完再回头查真正影响理解的词；逢词必查会打断思路，也会让你误以为读懂了。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '一份可用的阅读笔记，至少应包含哪组信息？',
        options: [
          { text: '完整出处、主旨、关键证据与页码、自己的反应与疑问', correct: true },
          { text: '全文翻译与生词表' },
          { text: '只抄作者的原句，越完整越好' },
          { text: '读后感想，不需要出处' }
        ],
        explain: '笔记是写作的原料库：出处让引用可追溯，主旨与证据让论证有支撑，反应与疑问让回应文章有切入点。没有出处的笔记，几周后基本作废。'
      },

      /* ---------------- ch02 摘要写作 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '写摘要前，对原文做的第一件事是什么？',
        options: [
          { text: '找出主旨与分论点，标出哪些句子承担核心信息', correct: true },
          { text: '把每个生词查一遍并抄下来' },
          { text: '先写自己的评价，再找原文对应' },
          { text: '把全文逐句翻译成中文' }
        ],
        explain: '摘要只保留原文的核心信息，所以先要判断哪些是主旨、哪些是支撑。分不清主次就动笔，结果往往是把例子和细节抄进去，却漏掉论点。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['citation'],
        stem: '下列哪一句对来源的归属最清楚？',
        options: [
          { text: 'According to Lee (2021), remote work raises the risk of blurred boundaries.', correct: true },
          { text: 'It is well known that remote work blurs boundaries.' },
          { text: 'Lee talks about remote work and boundaries.' },
          { text: 'Remote work blurs boundaries, as everyone knows.' }
        ],
        explain: '归属句要给作者与年份，并把观点明确放在原作者名下。B 和 D 把观点写成常识，C 没有年份也没有具体主张，都无法让读者追溯。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['method'],
        stem: '下面哪一句不应该出现在一篇「只陈述原文」的摘要里？',
        options: [
          { text: 'This argument is convincing because the author cites three studies.', correct: true },
          { text: 'The author argues that disclosure rules should be standardized.' },
          { text: 'The article first defines restoration, then discusses three cases.' },
          { text: 'The author concludes that the benefits outweigh the risks.' }
        ],
        explain: '摘要是转述，不是评价。「convincing」是读者判断，属于评论（response）。其余三句都在陈述原文内容与结构，可以进摘要。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '摘要必须覆盖原文的每一个例子和每一组数据。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '摘要保留的是主旨与关键分论点，例子与数据只在支撑核心信息时保留一个代表。逐个覆盖会使摘要与原文等长，失去压缩的意义。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'multi', difficulty: 1, tags: ['structure'],
        stem: '一段式摘要通常包含下列哪些成分？（多选）',
        options: [
          { text: '出处与作者', correct: true },
          { text: '原文的主旨', correct: true },
          { text: '两到三个关键分点', correct: true },
          { text: '收束句，点明作者的结论或立场', correct: true },
          { text: '你对作者观点的三点批评' }
        ],
        explain: '一段式摘要是「出处—主旨—分点—收束」的压缩结构。批评属于评论，不是摘要；把评价混进去，会让读者分不清哪些是作者说的。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'fill', difficulty: 1, tags: ['language'],
        stem: '把 due to the fact that 压缩成一个词，应写成什么？',
        answer: 'because',
        accept: ['because', 'since', 'as'],
        explain: 'due to the fact that 是典型的冗余表达，直接换成 because 或 since 即可，意思不变、字数减半。压缩摘要时优先删这类结构，而不是删信息。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '摘要与评论最关键的区别是？',
        options: [
          { text: '摘要只呈现原文说了什么，评论要加入自己的判断与理由', correct: true },
          { text: '摘要更长，评论更短' },
          { text: '摘要不需要出处，评论需要' },
          { text: '摘要可以编造例子，评论不行' }
        ],
        explain: '两者都要引用来源，长度也不固定。区别在立场：摘要把他人的观点如实转述，评论则在理解之后表态，并用理由与证据支撑自己的判断。'
      },

      /* ---------------- ch03 学术语言 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['language'],
        stem: '下列哪一句的 hedging 使用得最恰当？',
        options: [
          { text: 'The data suggest that disclosure rules may reduce disputes.', correct: true },
          { text: 'The data prove that disclosure rules eliminate all disputes.' },
          { text: 'The data obviously show that everyone wants disclosure.' },
          { text: 'The data are definitely the most important ever collected.' }
        ],
        explain: '学术写作对结论保持适度限定：suggest 与 may 承认证据的边界，prove、eliminate、everyone 则把有限数据推成绝对结论，容易被一个反例推翻。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['language'],
        stem: '下列哪种做法最能保证段落衔接清楚？',
        options: [
          { text: '用代词指代前句的明确名词，并复现关键术语', correct: true },
          { text: '每句都换一个同义词，避免重复' },
          { text: '每句开头都加 Moreover' },
          { text: '把连接词全部删掉，让读者自己推断' }
        ],
        explain: '衔接靠三条线：指代有明确先行词、连接词标明关系、关键词复现维持主题。频繁换同义词会让读者以为是新概念，堆连接词则显得机械。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '三遍改稿中，第一遍应该重点看什么？',
        options: [
          { text: '整体结构与论点是否成立，段落顺序是否合理', correct: true },
          { text: '拼写与标点' },
          { text: '每个介词的搭配' },
          { text: '字体与行距' }
        ],
        explain: '改稿从大到小：先确认论点站得住、段落顺序能推进论证，再改句子与用词，最后校对拼写标点。先抠字词，可能白改一遍被删掉的段落。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'tf', difficulty: 1, tags: ['language'],
        stem: '学术写作应尽量避免缩略形式（don’t、can’t）与口语化表达。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '学术语域偏正式，缩略形式与俚语会显得随意；但「避免口语」不等于堆砌大词，准确、清楚的正式表达才是目标。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'multi', difficulty: 1, tags: ['language'],
        stem: '下列哪些是有效的简洁化改法？（多选）',
        options: [
          { text: '把名词化结构还原成动词，如 make a decision → decide', correct: true },
          { text: '删掉空洞的修饰语，如 very、really、basically', correct: true },
          { text: '合并重复表达，如 each and every → every', correct: true },
          { text: '把每个短句都扩成长句，显得正式' }
        ],
        explain: '简洁的反面是冗余：名词化、空洞副词、同义重复都会稀释信息。扩长句只会增加阅读负担，不会提升学术性。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'fill', difficulty: 1, tags: ['language'],
        stem: '英语句子的信息焦点通常放在句子的哪个位置？填两个字。',
        answer: '末尾',
        accept: ['末尾', '句末', '结尾', '尾部'],
        explain: '英语倾向把新信息、重点信息放在句末（end weight / end focus），因为读者读到句尾时记忆最新。调整语序可以把重要内容推到焦点的位置。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['grammar'],
        stem: '下列哪一句存在悬垂修饰（dangling modifier）？',
        options: [
          { text: 'After reading the article, the conclusion seemed convincing to me.', correct: true },
          { text: 'After I read the article, the conclusion seemed convincing.' },
          { text: 'The article, which I read yesterday, draws a clear conclusion.' },
          { text: 'Reading the article carefully, I found the conclusion convincing.' }
        ],
        explain: 'A 中 After reading 的逻辑主语应是「我」，但主句主语是 the conclusion，修饰语悬空。改成 After I read... 或 Reading..., I... 即可。'
      },

      /* ---------------- ch04 引用与改写 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['citation'],
        stem: '下列哪种情况属于抄袭？',
        options: [
          { text: '保留原句结构与关键词，只替换几个同义词，且未标注来源', correct: true },
          { text: '用自己的话重写观点并标注作者与年份' },
          { text: '直接引用原句并加引号与页码' },
          { text: '概括全文主旨并给出处' }
        ],
        explain: '抄袭不只看是否逐字复制，还看结构与观点是否被当作自己的。换词不换结构且不标注，属于拼接式改写，仍然违规。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '改写的四步顺序是？',
        options: [
          { text: '读懂原意 → 合上原文 → 用自己的话重写 → 对照原文检查', correct: true },
          { text: '打开原文 → 逐句换词 → 调换语序 → 提交' },
          { text: '先写自己的观点 → 再找原文支持 → 加引号' },
          { text: '翻译成中文 → 再翻回英文 → 不加出处' }
        ],
        explain: '合上原文是关键一步：只有离开原句，才会被迫用自己的句法重组信息。对照阶段检查是否漏掉限定、是否意外保留了原句结构。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['citation'],
        stem: '「马赛克式改写」（patchwriting）的典型特征是？',
        options: [
          { text: '保留原句的顺序与短语，只替换零散词语，句法仍是原作者的', correct: true },
          { text: '完全用自己的例子替换原文例子' },
          { text: '把原文压缩成一句主旨并标注来源' },
          { text: '引用原文并加引号与页码' }
        ],
        explain: '拼接式改写看似换了词，实则沿用了原句的骨架与短语顺序，属于未授权的借用。判断标准是：遮住原文后，你的句子是否独立成立。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'tf', difficulty: 1, tags: ['citation'],
        stem: '直接引用越多，文章越显得有依据。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '直接引用只适合原文措辞本身是证据、定义或权威表述的场合。大量引用会挤掉你的分析，文章变成引文串联，反而显示不出理解。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'multi', difficulty: 1, tags: ['citation'],
        stem: '下列哪些情况适合使用直接引用？（多选）',
        options: [
          { text: '原文的措辞本身是分析对象，如定义或关键判断', correct: true },
          { text: '你需要保留作者的语气与精确表述', correct: true },
          { text: '法律条文、政策原文等不能改动的内容', correct: true },
          { text: '你不想花时间改写' }
        ],
        explain: '直接引用的理由是「措辞不可替代」：定义、关键判断、法规原文。因为懒而引用，会让文章缺少自己的语言与分析，也容易超出引用比例。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'fill', difficulty: 1, tags: ['citation'],
        stem: 'APA 文内引用中，三位及以上作者从第一次引用起就使用哪个缩写？',
        answer: 'et al.',
        accept: ['et al.', 'et al', 'etal'],
        explain: 'APA 第 7 版规定三位及以上作者在文内一律用第一作者加 et al.；参考文献表中则列出前 19 位作者（超过 19 位时列前 19 位加省略号与最后一位）。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['integrity'],
        stem: '关于 AI 工具与自我抄袭，下列哪项做法符合学术规范？',
        options: [
          { text: '按课程规定声明 AI 的使用范围，且不把 AI 生成内容当作自己的论证提交', correct: true },
          { text: '把上学期的文章改个标题直接交，因为作者是自己' },
          { text: '用 AI 生成整篇文章，再换几个词' },
          { text: '只要标注了来源，就可以把别人的整段结构照搬' }
        ],
        explain: '自我抄袭同样违规：旧文需要引用或说明。AI 的边界由课程规定决定，通常要求声明用途与范围，且核心论证必须自己完成。标注来源不能豁免结构照搬。'
      },

      /* ---------------- ch05 来源与 APA ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['research'],
        stem: '下列哪一项属于一手来源（primary source）？',
        options: [
          { text: '研究者发表的原始实验报告或档案原件', correct: true },
          { text: '教科书对某项研究的综述' },
          { text: '维基百科条目' },
          { text: '一篇评论另一篇论文的社论' }
        ],
        explain: '一手来源是证据的直接来源：原始研究、档案、数据、当事人文本。教科书、百科、评论都是二手或三手，可以帮你入门，但引用时应回到一手材料。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['research'],
        stem: 'CRAAP 测试中的两个 A 分别指什么？',
        options: [
          { text: 'Authority（权威性）与 Accuracy（准确性）', correct: true },
          { text: 'Argument（论证）与 Audience（读者）' },
          { text: 'Abstract（摘要）与 Appendix（附录）' },
          { text: 'Access（获取）与 Analysis（分析）' }
        ],
        explain: 'CRAAP 是 Currency、Relevance、Authority、Accuracy、Purpose 五个首字母。两个 A 检查作者与出版方的资质，以及信息是否有证据、可核对。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['citation'],
        stem: 'APA 参考文献表中，期刊文章条目的正确顺序是？',
        options: [
          { text: '作者. (年份). 文章标题. 期刊名, 卷(期), 页码. DOI', correct: true },
          { text: '文章标题. 作者. 期刊名. 年份. 页码' },
          { text: '期刊名. 作者. 年份. 文章标题. 页码' },
          { text: '作者. 文章标题. 年份. 页码. 期刊名' }
        ],
        explain: 'APA 期刊条目遵循「作者—年份—标题—期刊—卷(期)—页码—DOI」；作者姓在前、名缩写，文章标题只用句首大写，期刊名与卷号斜体。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'tf', difficulty: 1, tags: ['research'],
        stem: '在检索中使用 AND 会扩大结果范围，OR 会缩小结果范围。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'AND 要求两个词同时出现，结果更少更准；OR 允许任一出现，结果更多更全。NOT 用来排除。用反了会导致要么查不到，要么淹没在无关结果里。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'multi', difficulty: 1, tags: ['citation'],
        stem: '下列哪些符合 APA 文内引用的做法？（多选）',
        options: [
          { text: '转述观点时给作者与年份', correct: true },
          { text: '直接引用时加引号并给页码', correct: true },
          { text: '三位以上作者用第一作者加 et al.', correct: true },
          { text: '文内给出来源后，参考文献表可以省略' }
        ],
        explain: '文内引用与参考文献表是一对：文内定位到具体位置，文末给出完整条目。少任何一边，读者都无法核实来源。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'fill', difficulty: 1, tags: ['citation'],
        stem: '引用管理软件自动生成的条目，提交前仍必须做的一件事是什么？填两个字。',
        answer: '核对',
        accept: ['核对', '检查', '校对', '核查'],
        explain: '软件会继承数据库里的错误：作者名大小写、卷期缺失、DOI 失效、标题大小写。自动生成只是起点，逐条核对作者、年份、卷期与页码才算完成。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['writing'],
        stem: '把来源证据写进段落时，「三明治」结构指的是？',
        options: [
          { text: '先引入来源与观点，再给引用或数据，最后解释它如何支持你的主张', correct: true },
          { text: '开头、正文、结尾各放一条引用' },
          { text: '引用前加引号，引用后加页码' },
          { text: '把三条引用并排放在段首' }
        ],
        explain: '三明治=引入（谁说的、为什么提）+ 证据（引用/数据）+ 解释（这如何支持本段主张）。缺了解释，引用就只是堆材料，不构成论证。'
      },

      /* ---------------- ch06 个人文章与回应文章 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['writing'],
        stem: '个人文章（personal essay）中的故事应该服务于什么？',
        options: [
          { text: '一个可争论、可限定的论点，故事是证据而不是装饰', correct: true },
          { text: '尽可能多的细节，论点可以最后再补' },
          { text: '让读者觉得作者经历丰富' },
          { text: '替代引用，因为个人经验不需要来源' }
        ],
        explain: '个人文章不是流水账：故事要承担论证功能，说明一个判断如何形成。细节的选择标准是「是否推进论点」，不是「是否感人」。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['writing'],
        stem: '写回应文章（response essay）的第一步是什么？',
        options: [
          { text: '准确复述对方的观点，包括其限定与依据', correct: true },
          { text: '先表明自己同意还是反对' },
          { text: '找三个专家支持自己的立场' },
          { text: '把原文的每个例子都反驳一遍' }
        ],
        explain: '回应的前提是准确理解：先复述对方主张与理由，才能找到可回应的点。先表态再读，容易树一个对方没说的稻草人。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['structure'],
        stem: 'PEEL 段落中，E（Explanation）的作用是？',
        options: [
          { text: '解释证据如何支持本段主张，占段落约一半篇幅', correct: true },
          { text: '再补一个例子，越多越好' },
          { text: '重复一遍主题句' },
          { text: '引出下一位作者' }
        ],
        explain: 'PEEL 是 Point、Evidence、Explanation、Link。解释是论证发生的地方：说明证据与主张之间的推理，缺了它，段落就只是「观点+例子」。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'tf', difficulty: 1, tags: ['writing'],
        stem: '论文的 thesis 越宽泛越好写，因为可以容纳更多材料。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '宽泛的 thesis 无法被证据检验，也组织不了段落。好的 thesis 要可争论、可限定、有依据：范围越具体，论证越能落地。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'multi', difficulty: 1, tags: ['writing'],
        stem: '下列哪些是有效的论证展开方式？（多选）',
        options: [
          { text: '举例：用具体案例说明主张', correct: true },
          { text: '对比：把两种立场或两种情况并置', correct: true },
          { text: '因果：解释一个现象如何导致另一个', correct: true },
          { text: '让步反驳：先承认对方合理处，再指出局限', correct: true },
          { text: '重复：把同一句话换三种说法' }
        ],
        explain: '举例、对比、因果、让步反驳都是推进论证的方式，各有适用场合。重复不是论证，只会让段落原地踏步。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 1, type: 'fill', difficulty: 1, tags: ['structure'],
        stem: 'PEEL 中的 L 指哪个英文词？',
        answer: 'link',
        accept: ['link', 'linking', 'Link'],
        explain: 'L 是 Link：段末把本段结论回扣主题句或全文 thesis。没有这一步，段落会像孤岛，读者不知道它为什么出现在这里。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['assessment'],
        stem: '写作 rubric 通常从哪四个维度评分？',
        options: [
          { text: '内容、组织、语言、引用与格式', correct: true },
          { text: '字数、字体、页边距、封面' },
          { text: '创意、幽默、情感、文采' },
          { text: '速度、长度、难度、数量' }
        ],
        explain: 'rubric 把评分拆成可观察的维度：内容（论点与证据）、组织（结构与衔接）、语言（准确与句式）、引用与格式（来源与 APA）。按维度自评，修改才有方向。'
      },

      /* ---------------- ch07 口头汇报 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['speaking'],
        stem: '五分钟汇报的时间分配，下列哪组最合理？',
        options: [
          { text: '开场 15%、主体 70%、收束 15%', correct: true },
          { text: '开场 40%、主体 40%、收束 20%' },
          { text: '开场 5%、主体 90%、收束 5%' },
          { text: '开场 25%、主体 25%、收束 50%' }
        ],
        explain: '开场要给钩子、背景与路线图，主体三点要展开证据，收束要重述与落点。开场过长会挤掉论证，收束过长则显得没有内容。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['speaking'],
        stem: '演讲时与单个听众的眼神接触，每次宜保持多久？',
        options: [
          { text: '三到五秒，说完一个短句再换人', correct: true },
          { text: '一直盯着一个人，显得真诚' },
          { text: '半秒扫过全场，越快越自然' },
          { text: '只看最后一排的评委' }
        ],
        explain: '三到五秒足以建立连接，又不会让人不适。半秒扫视等于谁都没看到；只盯一个人会让其余听众退出；只看评委则放弃了大半听众。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['speaking'],
        stem: '幻灯片设计的第一原则是？',
        options: [
          { text: '一页一个观点，标题写成完整判断句', correct: true },
          { text: '一页尽量多放字，避免翻页' },
          { text: '标题用「背景」「分析」「结论」等分类词' },
          { text: '每页都加动画，吸引注意' }
        ],
        explain: '一页一个观点降低听众的处理成本；标题写判断句，听众一眼就知道这页要证明什么。分类词不传递信息，堆字与动画只会分散注意。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'tf', difficulty: 1, tags: ['speaking'],
        stem: '汇报的核心信息可以是一个话题，比如「AI 修复」。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '话题只说明讲什么，核心信息要给出判断，例如「AI 修复的争议不在技术，而在谁有权决定」。没有判断，听众听完仍不知道你的立场。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'multi', difficulty: 1, tags: ['speaking'],
        stem: '下列哪些方法有助于控制声音与填充词？（多选）',
        options: [
          { text: '在开场、要点之间、核心信息前各停顿一秒', correct: true },
          { text: '录音回听，数一数三分钟内的填充词次数', correct: true },
          { text: '紧张时放慢语速，句号处换气', correct: true },
          { text: '为了不冷场，用「呃」填满每个空隙' }
        ],
        explain: '停顿替代填充词、录音建立觉察、放慢换气稳定节奏，三者都直接作用于可观察的行为。用「呃」填满空隙，只会让紧张更明显。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 1, type: 'fill', difficulty: 1, tags: ['speaking'],
        stem: '三轮排练依次是对稿、对时、对什么？填两个字。',
        answer: '对场',
        accept: ['对场', '场地', '对场地'],
        explain: '第一轮对稿改口语，第二轮对时控节奏，第三轮对场（空教室或镜头）完整走一遍，包括站定、翻页、收束与鞠躬，模拟真实压力。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['speaking'],
        stem: '问答环节遇到完全不会的问题，最合适的做法是？',
        options: [
          { text: '承认没有这个数据，说明可以如何查证，并给出一个可继续的方向', correct: true },
          { text: '编一个听起来合理的数字' },
          { text: '反问听众，把问题推回去' },
          { text: '沉默到主持人换下一个问题' }
        ],
        explain: '诚实加方向，比硬答更能保住可信度：承认边界、说明查证路径，再把问题接到你熟悉的相关点上。编数据一旦被追问，整场汇报的可信度都会受损。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
