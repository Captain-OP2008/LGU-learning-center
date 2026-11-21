/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；每章 q1–q3 与 chXX.js 内嵌题对应，q4–q7 为补充练习
 * 每项字段：{ id:'ch01-q1', ch:'ch01', kp:'ch01-1', tier:1, type:'mcq'|'tf'|'fill'|'multi',
 *            difficulty:1, tags:['concept'], stem, options:[{text, correct:true?}], explain }
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: 'ENG2001 这门课的核心产出是什么？',
        options: [
          { text: '一份以英文写成的学术研究项目：提案、文献综述、研究论文与口头报告', correct: true },
          { text: '一套英语语法与词汇练习册' },
          { text: '一份雅思或托福的应试训练计划' },
          { text: '一次以小组为单位的读书报告' }
        ],
        explain: '这门课（English for Academic Purposes II）把学术英语的四项核心能力串起来：选题与提案、文献综述、研究论文写作、口头与海报报告，四种产出互相支撑而不是各自独立。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '本课程七个主题的主线是什么？',
        options: [
          { text: '从读（阅读与综述）到写（研究方法与论证），再到讲（演讲与海报）', correct: true },
          { text: '从语法到词汇，再到句型' },
          { text: '从考试技巧到答题模板' },
          { text: '从小组讨论到课堂展示，不含写作' }
        ],
        explain: '这条主线决定了学习顺序：先读懂别人怎么写，再把自己的研究写出来，最后把它讲给别人听。缺了「读」的积累，写会变成空转；缺了「讲」，成果就只停在纸面上。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '研究项目的四份交付物是提案、文献综述、研究论文与口头报告（含海报）。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '四份交付物对应课程的四段进度：提案定方向，综述建语境，论文呈证据，口头报告做压缩与传播。它们共享同一个研究问题，不是四个互不相干的作业。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['register'],
        stem: '学术语域的「三层」指哪三层？',
        options: [
          { text: '词（术语与正式词汇）、句（名词化与 hedging）、篇（结构与会话）', correct: true },
          { text: '标题、正文、参考文献' },
          { text: '引言、方法、结论' },
          { text: '口语、书面语、网络用语' }
        ],
        explain: '语域是三个层次一起决定的：选词偏不偏学术，句子有没有名词化与恰当的模糊限制，整篇是否符合学科的文章结构。只改词汇而不改句子结构，仍会显得像口语记录。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'fill', difficulty: 2, tags: ['register'],
        stem: '学术语域的三层是词、句与____（填一个字）。',
        answer: '篇',
        accept: ['篇', '篇章', '段落'],
        explain: '三层是词、句、篇。从词汇选择到句子结构再到整篇文章的组织，越往上越影响读者的判断：一个词用错只是瑕疵，篇章结构错位会让论证不成立。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'multi', difficulty: 2, tags: ['integrity'],
        stem: '下列哪些属于课程要求的学术诚信内容？（多选）',
        options: [
          { text: '提交自己完成的作业，合作仅限于讨论', correct: true },
          { text: '所有引用与转述都标注来源', correct: true },
          { text: '按课程要求声明外部协助与 AI 工具的使用', correct: true },
          { text: '把同一篇论文同时提交给两门课' }
        ],
        explain: '学术诚信包含原创、标注引用、声明协助与不一稿多投四条。最后一项（一稿多投）常被误认为「节约时间」，实际上是没有得到两门课许可的重复提交，属于违规。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['usage'],
        stem: '本站「资料库」的正确用法是什么？',
        options: [
          { text: '先按模块找文件，再回到对应章节读讲解，把它当检索入口而不是阅读替代', correct: true },
          { text: '把 PDF 全部打印出来逐页抄写' },
          { text: '只看资料库，不看章节讲解' },
          { text: '资料库只有往届考题，没有其他文件' }
        ],
        explain: '资料库的价值是「知道有什么、去哪找」，真正的理解仍发生在章节讲解与自己的写作里。先建立地图再读文件，比一头扎进几十份 PDF 高效得多。'
      },

      /* ---------------- ch01 学术阅读与 IMRaD ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['register'],
        stem: '下列哪一句最符合学术语域？',
        options: [
          { text: 'The increase in enrolment was accompanied by a rise in tutoring demand.', correct: true },
          { text: 'Enrolment went up a lot and then loads of students wanted tutors.' },
          { text: 'Students got way more help after enrolment increased.' },
          { text: 'Enrolment increased, so tutoring demand exploded!' }
        ],
        explain: '学术句的三个记号在这里都能看到：名词化（increase、demand）、中性动词（accompanied by、rise）、以及克制的强度（没有 a lot、way more、exploded）。口语化的强度词与感叹号是最明显的语域信号。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['structure'],
        stem: 'IMRaD 四块的正确顺序是？',
        options: [
          { text: 'Introduction — Methods — Results — Discussion', correct: true },
          { text: 'Introduction — Results — Methods — Discussion' },
          { text: 'Abstract — Methods — Introduction — Conclusion' },
          { text: 'Methods — Introduction — Results — References' }
        ],
        explain: 'IMRaD 的顺序对应读者的提问链：为什么做（Introduction）、怎么做（Methods）、看到什么（Results）、意味着什么（Discussion）。顺序颠倒会让证据与解释错位。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'tf', difficulty: 2, tags: ['abstract'],
        stem: '摘要的五句式通常以「背景」开头，以「意义」收尾。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '五句式是背景、空白、做法、发现、意义。开头给读者坐标，结尾说明为什么值得关心。若把「意义」写成「本文将讨论」，就退化成了目录式开头。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['reading'],
        stem: '三遍读法的第一遍主要读什么？',
        options: [
          { text: '标题、摘要、图表与小标题，先判断这篇文章值不值得细读', correct: true },
          { text: '逐字读完全文并查清每个生词' },
          { text: '只读参考文献表' },
          { text: '直接抄下可引用的句子' }
        ],
        explain: '第一遍是筛选：用十分钟看标题、摘要、图表与小标题，判断相关性。第二遍读方法与结果，第三遍才逐段读论证。顺序反过来，时间会大量浪费在无关文献上。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'fill', difficulty: 1, tags: ['structure'],
        stem: 'IMRaD 中的 M 代表哪个英文单词？',
        answer: 'Methods',
        accept: ['Methods', 'Method', 'methods', 'method'],
        explain: 'M 是 Methods（方法）。这一块回答「你如何得到这些数据」，包括参与者、工具、程序与分析方式，是判断研究可信度的关键位置。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'multi', difficulty: 2, tags: ['critical'],
        stem: '批判性阅读时，下列哪些问题值得问？（多选）',
        options: [
          { text: '样本能否支撑作者做出的推广？', correct: true },
          { text: '证据是否来自与结论直接相关的那部分数据？', correct: true },
          { text: '作者有没有承认相反的证据？', correct: true },
          { text: '这篇文章的排版是否好看？' }
        ],
        explain: '批判性阅读关注的是证据与结论之间的连接：样本、数据、反例。排版属于编辑质量，不影响论证成立与否，把它当批判点会答偏。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['notes'],
        stem: '一张合格的阅读笔记卡最不该缺的是哪一项？',
        options: [
          { text: '你自己的评价：这条证据能支持什么、不能支持什么', correct: true },
          { text: '文章的页数' },
          { text: '作者的国籍' },
          { text: 'PDF 的文件大小' }
        ],
        explain: '笔记卡的价值在于留下「我当时怎么判断」的痕迹：能支持什么、不能支持什么、与我有什么关系。只抄原句的卡片，三个月后跟没记一样。'
      },

      /* ---------------- ch02 选题与研究问题 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['topic'],
        stem: '好选题的三个条件不包括下列哪一项？',
        options: [
          { text: '话题足够大，能写满字数', correct: true },
          { text: '可行：时间、资料与能力都够' },
          { text: '有意义：对某个读者群有价值' },
          { text: '可研究：能用证据回答' }
        ],
        explain: '「足够大」恰恰是坏选题的特征：范围越大，越只能写常识。好选题是可行、有意义、可研究三条同时成立，通常表现为「小切口、深一点」。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['topic'],
        stem: '漏斗法的收紧顺序是？',
        options: [
          { text: '兴趣领域 → 话题 → 具体问题 → 可回答的研究问题', correct: true },
          { text: '研究问题 → 兴趣领域 → 话题 → 结论' },
          { text: '结论 → 证据 → 话题 → 标题' },
          { text: '随机选一个话题 → 直接开写' }
        ],
        explain: '漏斗法每一步都在缩小范围并提高可操作性：领域给方向，话题给边界，具体问题给焦点，RQ 给可检验的形态。跳过中间步骤，常出现「题目很大但无从下手」。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'tf', difficulty: 1, tags: ['rq'],
        stem: '一个合格的研究问题应当是可以用资料回答的，而不是只能表达立场。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '研究问题要有可回答性：它指向可用问卷、访谈或文本回答的内容。只能表态的问题（如「应不应该」）适合议论文，不适合需要证据的研究设计。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['rq'],
        stem: '一个 RQ 的四个零件通常指？',
        options: [
          { text: '对象、变量或焦点、语境、可回答的提问方式', correct: true },
          { text: '标题、摘要、关键词、作者' },
          { text: '样本、工具、程序、分析' },
          { text: '背景、空白、方法、结论' }
        ],
        explain: '四零件让 RQ 具体化：研究谁（对象）、看什么（变量或焦点）、在什么范围（语境）、怎么问（提问方式）。缺一项，读者就会追问「你到底研究什么」。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'fill', difficulty: 1, tags: ['search'],
        stem: '布尔逻辑中，用来缩小检索范围、要求两个词同时出现的运算符是____（填英文）。',
        answer: 'AND',
        accept: ['AND', 'and', 'And'],
        explain: 'AND 要求两个条件同时满足，因而缩小结果；OR 扩大结果，用于同义词；NOT 排除。检索结果太少时加 OR，太多时加 AND 或限定字段。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'multi', difficulty: 2, tags: ['evaluation'],
        stem: 'CRAAP 五问包含下列哪些维度？（多选）',
        options: [
          { text: '时效性（Currency）', correct: true },
          { text: '相关性（Relevance）', correct: true },
          { text: '权威性与准确性（Authority, Accuracy）', correct: true },
          { text: '篇幅长度（Length）' }
        ],
        explain: 'CRAAP 是 Currency、Relevance、Authority、Accuracy、Purpose，没有「篇幅」这一项。长文未必可靠，短文也可能是高质量简报，长度不是评估维度。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['proposal'],
        stem: '一页提案最应该写清楚的是？',
        options: [
          { text: '问题、RQ、为何值得做、怎么做、预期贡献', correct: true },
          { text: '完整的文献综述与全部参考文献' },
          { text: '致谢与个人简历' },
          { text: '最终结论与数据表' }
        ],
        explain: '提案是承诺书：让读者在五分钟内判断这件事值不值得做、你做不做得成。完整综述属于正式论文，最终结论在提案阶段还不存在。'
      },

      /* ---------------- ch03 文献综述与引用 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['review'],
        stem: '文献综述与读书笔记的关键区别是？',
        options: [
          { text: '综述按论点组织文献并做出判断，笔记按文献逐条记录', correct: true },
          { text: '综述越长越好，笔记越短越好' },
          { text: '综述不需要引用，笔记需要' },
          { text: '两者没有区别，只是叫法不同' }
        ],
        explain: '综述的组织单位是「论点」而不是「文献」：它把多篇研究放进同一个问题下比较，最后给出你的判断。逐篇介绍再各自总结，是笔记的写法，不是综述。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['review'],
        stem: '下列哪一项不属于文献综述的常见组织方式？',
        options: [
          { text: '按作者的国籍排序', correct: true },
          { text: '按主题或议题分组' },
          { text: '按时间脉络呈现研究演进' },
          { text: '按研究方法或范式分组' }
        ],
        explain: '按主题、时间、方法是三种有论证功能的组织方式；按国籍排序既不说明观点差异，也无法形成比较，属于「有形式无逻辑」的分类。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'tf', difficulty: 1, tags: ['citation'],
        stem: '把别人的观点用自己的话改写之后，就不再需要标注引用。',
        options: [
          { text: '错误', correct: true },
          { text: '正确' }
        ],
        explain: '改写的只是表达，观点仍来自他人，必须标注来源。改写而不引用是最常见的抄袭形式之一，读者无法区分哪些思想是你自己的。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['paraphrase'],
        stem: '转述四步的正确顺序是？',
        options: [
          { text: '读懂原意 → 合上原文重写 → 对照检查是否漏改 → 标注来源', correct: true },
          { text: '打开原文逐句替换同义词 → 提交' },
          { text: '先写引用格式 → 再找句子填空' },
          { text: '复制原文 → 调整语序 → 删几个词' }
        ],
        explain: '合上原文重写是关键一步：它迫使你处理意义而不是词形。逐句替换同义词会产出 patchwriting——结构仍是原文的，只是换了皮，依然算抄袭。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-7', tier: 1, type: 'fill', difficulty: 1, tags: ['apa'],
        stem: 'APA 7 文内引用括号中的两项依次是作者与____（填中文）。',
        answer: '年份',
        accept: ['年份', '年代', '出版年', 'year'],
        explain: 'APA 文内引用是（Author, Year）或 Author（Year）。中文写作常漏年份，读者就无法判断这条证据的新旧，也无法与参考文献表对应。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'multi', difficulty: 2, tags: ['integrity'],
        stem: '下列哪些做法构成抄袭？（多选）',
        options: [
          { text: '整段复制他人文字但不加引号', correct: true },
          { text: '改写他人观点但不标注来源', correct: true },
          { text: '把三篇文章的句子拼接成一段而不注明', correct: true },
          { text: '引用自己上一门课的作业并注明' }
        ],
        explain: '复制不引、改写不标、拼接不注都属于抄袭。引用自己以前的作业并注明来源通常不算抄袭，但重复提交同一篇作品可能违反「一稿多投」的规定，需先征得许可。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['gap'],
        stem: '在综述里指出研究空白（gap）时，最有力的写法是？',
        options: [
          { text: '指出已有研究在某个具体维度上缺失，并说明为什么这会影响结论', correct: true },
          { text: '断言「此前无人研究过这个题目」' },
          { text: '说「相关研究较少」而不给范围' },
          { text: '批评所有前人研究水平不够' }
        ],
        explain: '有效的 gap 是具体的：缺哪个维度、缺了会怎样。笼统断言「无人研究」既难核实，也容易被一篇新文献推翻；贬低前人则暴露阅读不足。'
      },

      /* ---------------- ch04 研究方法 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '方法章要回答的四个问题不包括？',
        options: [
          { text: '研究结果是否显著', correct: true },
          { text: '研究了谁、怎么选的' },
          { text: '用了什么工具与程序' },
          { text: '数据怎么分析' }
        ],
        explain: '显著性属于结果章的内容。方法章只交代「怎么做」：参与者、工具、程序、分析方式。把结果写进方法章，会让读者提前知道结论而失去判断依据。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['survey'],
        stem: '李克特五点量表（Likert scale）的典型选项是？',
        options: [
          { text: '非常不同意 — 不同意 — 一般 — 同意 — 非常同意', correct: true },
          { text: '是 — 否' },
          { text: '0 — 10 — 20 — 30 — 40' },
          { text: '每天 — 每周 — 每月 — 每年' }
        ],
        explain: '李克特量表测量的是同意程度，五个选项构成有序等级。它适合态度类问题，不适合测量频次（那是频率量表）或二元事实（那是是非题）。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'tf', difficulty: 2, tags: ['validity'],
        stem: '信度指测量结果的一致与稳定，效度指工具是否测到了它声称要测的东西。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '信度与效度是两件事：一把总是偏两厘米的尺子信度高（每次读数一致）但效度低；一把每次读数都不同的尺子谈不上信度。好的工具两者都要有。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['interview'],
        stem: '结构式、半结构式与无结构式访谈的主要区别在于？',
        options: [
          { text: '问题与追问的预设程度，以及受访者自由展开的空间', correct: true },
          { text: '访谈进行的时长' },
          { text: '是否录音' },
          { text: '受访者的年龄' }
        ],
        explain: '三种结构的差别是控制程度：结构式按固定问题顺序，半结构式有提纲但可追问，无结构式只给话题。控制越少，资料越丰富但可比性越低。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'fill', difficulty: 1, tags: ['sampling'],
        stem: '按「谁方便找到就找谁」选择参与者的抽样方式叫____抽样（填中文两字）。',
        answer: '方便',
        accept: ['方便', '便利', 'convenience'],
        explain: '方便抽样（convenience sampling）成本低但代表性弱，结论推广要格外谨慎。写作时应说明这一点，而不是把它当成随机抽样来描述。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'multi', difficulty: 2, tags: ['ethics'],
        stem: '研究伦理通常要求做到哪些？（多选）',
        options: [
          { text: '事先取得知情同意', correct: true },
          { text: '允许参与者随时退出', correct: true },
          { text: '对资料去标识化并妥善保管', correct: true },
          { text: '把受访者的原话与真实姓名一起公开' }
        ],
        explain: '知情同意、自愿退出、匿名与资料安全是伦理的四项基本要求。公开真实姓名会让受访者处于风险中，通常要用编号或化名替代。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['tense'],
        stem: '方法章描述自己已完成的步骤时，主时态通常是？',
        options: [
          { text: '一般过去时', correct: true },
          { text: '一般现在时' },
          { text: '将来时' },
          { text: '现在完成进行时' }
        ],
        explain: '已完成的操作写过去时（participants were recruited），普遍事实与图表引用写现在时（Table 1 shows）。时态混乱会让读者分不清哪些是已做的事、哪些是通例。'
      },

      /* ---------------- ch05 论证结构 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['argument'],
        stem: '论证的最小单位「claim — data — warrant」中，warrant 的作用是？',
        options: [
          { text: '说明数据为何能支持主张，即连接两者的推理依据', correct: true },
          { text: '重复一遍主张以加强语气' },
          { text: '列出所有可能的反例' },
          { text: '提供参考文献格式' }
        ],
        explain: 'warrant 是被省略却必须成立的推理规则：数据 A 之所以能推出主张 B，是因为「A 类证据通常意味着 B」。论证被质疑时，多半是 warrant 没被说清。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['toulmin'],
        stem: 'Toulmin 模型六要素不包括下列哪一项？',
        options: [
          { text: '摘要（abstract）', correct: true },
          { text: '限定（qualifier）' },
          { text: '反驳（rebuttal）' },
          { text: '支撑（backing）' }
        ],
        explain: 'Toulmin 六要素是 claim、data、warrant、backing、qualifier、rebuttal。摘要属于文章体裁结构，不是论证成分。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'tf', difficulty: 2, tags: ['evidence'],
        stem: '就证据等级而言，系统综述与元分析通常高于单个案例研究。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '系统综述汇总多项研究并评估其质量，单个案例只提供一个情境的证据。等级高不等于一定适用：若你的问题是「这个班级发生了什么」，个案反而更贴切。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['fallacy'],
        stem: '把对方观点夸张成极端版本再加以攻击，属于哪种谬误？',
        options: [
          { text: '稻草人（straw man）', correct: true },
          { text: '滑坡（slippery slope）' },
          { text: '循环论证（circular reasoning）' },
          { text: '诉诸人身（ad hominem）' }
        ],
        explain: '稻草人是先歪曲再反驳：你攻击的不是对方的主张，而是一个更容易打倒的版本。识别它的方法是回到原始表述，问「对方真的这么说了吗」。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'fill', difficulty: 1, tags: ['paragraph'],
        stem: 'PEEL 段落结构的第一个字母 P 代表哪个英文词？',
        answer: 'Point',
        accept: ['Point', 'point'],
        explain: 'PEEL 是 Point、Evidence、Explanation、Link。段首给主张，中间给证据与解释，段尾回扣论点或过渡。缺了 Link，段落之间就会断裂。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'multi', difficulty: 2, tags: ['rebuttal'],
        stem: '有效的让步与反驳通常包含哪些动作？（多选）',
        options: [
          { text: '准确复述一种反对意见', correct: true },
          { text: '承认其中合理的部分', correct: true },
          { text: '指出该意见的适用边界或证据不足', correct: true },
          { text: '直接说反对者不懂行' }
        ],
        explain: '让步不是示弱，而是显示你读过反方：复述、承认、限定或反驳。直接贬低对手会让读者认为你没有能力处理不同意见。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['structure'],
        stem: '全文论证编排中，引言部分最应该完成的任务是？',
        options: [
          { text: '建立语境、指出空白、给出本文主张与研究问题', correct: true },
          { text: '列出全部数据与图表' },
          { text: '详细说明统计软件版本' },
          { text: '重复摘要的每一句话' }
        ],
        explain: '引言的三个动作是建语境、指空白、给主张，读者据此判断后文是否值得读。数据在结果章，软件版本在方法章，摘要更不是引言的内容。'
      },

      /* ---------------- ch06 公共演讲与海报 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['speech'],
        stem: '口头报告与论文阅读体验的最大差别是？',
        options: [
          { text: '听众只能线性接收、不能回看，因此结构必须被听见', correct: true },
          { text: '口头报告不需要证据' },
          { text: '口头报告可以随意跑题' },
          { text: '口头报告越长越显专业' }
        ],
        explain: '读者可以回看、跳读、暂停，听众不能。因此演讲要用路标语、重复与明确的段落标记，把结构「说」出来，而不是指望听众自己整理。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['rhetoric'],
        stem: 'ethos、pathos、logos 分别对应？',
        options: [
          { text: '可信度、情感、逻辑', correct: true },
          { text: '逻辑、可信度、情感' },
          { text: '情感、逻辑、可信度' },
          { text: '数据、故事、引用' }
        ],
        explain: 'ethos 是说话者的可信度（资质、公正、准备充分），pathos 是情感共鸣，logos 是论证逻辑。三者并用才稳：只有 logos 显冷，只有 pathos 显空。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'tf', difficulty: 2, tags: ['opening'],
        stem: '演讲的开场三十秒应当让听众知道你要解决的问题与你的一句话主张。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '开场三十秒决定听众是否继续投入。有效的开场给问题与主张，而不是自我介绍与致谢清单。先给「为什么值得听」，再给「我要说什么」。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['signpost'],
        stem: '路标语（signposting）的作用是？',
        options: [
          { text: '用明确的语言提示结构位置，如 first、by contrast、to sum up', correct: true },
          { text: '在幻灯片上放路标图案' },
          { text: '加快语速以节省时间' },
          { text: '替听众做结论' }
        ],
        explain: '路标语是听觉版的小标题：它告诉听众现在走到哪、接下来去哪。没有路标语的演讲，听众常在第三分钟就失去方位感。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'fill', difficulty: 1, tags: ['delivery'],
        stem: '面向非母语听众的英文学术演讲，建议语速上限约为每分钟 130–____ 词（填数字）。',
        answer: '150',
        accept: ['150', '140', '160'],
        explain: '每分钟 130–150 词是学术报告的舒适区间。超过 160 词，听众处理不过来；低于 110 词，容易显得不熟练或拖沓。语速之外，停顿比加速更能强调重点。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'multi', difficulty: 2, tags: ['slides'],
        stem: '幻灯片制作的常见错误包括哪些？（多选）',
        options: [
          { text: '一页塞进整段论文文字', correct: true },
          { text: '字号过小，后排看不清', correct: true },
          { text: '用动画逐字飞入代替讲解', correct: true },
          { text: '一页只放一个主张与一个图' }
        ],
        explain: '幻灯片是视觉支架，不是提词器。文字过多、字号过小、动画过度都会分散注意力；一页一个主张反而是推荐做法。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['qa'],
        stem: '问答环节遇到不确定的问题，最合适的做法是？',
        options: [
          { text: '承认不确定，说明你会如何查证，并给出目前的最佳判断', correct: true },
          { text: '编一个听起来合理的答案' },
          { text: '反问提问者「你觉得呢」以拖延' },
          { text: '直接说这个问题不重要' }
        ],
        explain: '坦诚加方法比编造更能建立可信度：承认边界、说明查证路径、给出当前判断，三步都在展示研究者的素养。编答案一旦被追问就会崩。'
      },

      /* ---------------- ch07 结果、讨论与定稿 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['results'],
        stem: '下列哪一句不该出现在结果章？',
        options: [
          { text: 'This suggests that students distrust AI feedback.', correct: true },
          { text: 'The mean rating for AI feedback was 2.9.' },
          { text: 'Sixty-eight per cent of respondents chose 4 or 5.' },
          { text: 'Table 2 reports the mean ratings for three sources.' }
        ],
        explain: 'suggests 是解释，属于讨论章。结果章只报告数字与事实性小结，把「意味着什么」留到讨论，读者才能先独立判断证据。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['figures'],
        stem: '图表叙述的三步是？',
        options: [
          { text: '指向、报告关键数字、提示值得注意之处', correct: true },
          { text: '截图、贴表、写结论' },
          { text: '描述坐标轴、念完所有数据、解释原因' },
          { text: '只放图不写正文' }
        ],
        explain: '三步的分工是：告诉读者看哪张图表、说出最关键的一两个数字、指出它与众不同之处。解释原因属于讨论章，念完所有数字则浪费篇幅。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'tf', difficulty: 2, tags: ['discussion'],
        stem: '讨论四步是解释、比较、限制、启示，其中限制要具体到它影响哪一条结论。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '写「样本量小」是套话；写「样本仅来自一门课，因此关于年级差异的结论不能推广」才有信息。限制不是自我否定，而是标出结论的适用范围。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['abstract'],
        stem: '摘要五句式的正确顺序是？',
        options: [
          { text: '背景、空白、做法、发现、意义', correct: true },
          { text: '意义、发现、做法、空白、背景' },
          { text: '做法、背景、发现、空白、意义' },
          { text: '空白、意义、做法、背景、发现' }
        ],
        explain: '五句式的顺序对应读者的理解路径：先有坐标（背景），再有问题（空白），然后是做法与发现，最后说明为什么值得关心。倒序会让摘要读起来像结论摘抄。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'fill', difficulty: 1, tags: ['discussion'],
        stem: '讨论四步中，最后一步「对谁有什么用」在英文里叫 implications，中文常译为____（填两个字）。',
        answer: '启示',
        accept: ['启示', '意义', '启示意义'],
        explain: 'implications 译为「启示」比「意义」更具体：它要求写明对哪个对象、在哪一环有用。空泛的「具有重要理论与实践意义」不算启示。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'multi', difficulty: 2, tags: ['apa'],
        stem: '定稿时的 APA 一致性检查通常包括哪些层面？（多选）',
        options: [
          { text: '文内引用格式', correct: true },
          { text: '参考文献表的字母顺序与悬挂缩进', correct: true },
          { text: '标题层级与斜体范围', correct: true },
          { text: '受访者真实姓名的公开' }
        ],
        explain: 'APA 检查集中在引用、参考文献表、标题层级、数字与缩写四层。公开受访者真实姓名属于伦理问题，不是格式问题，原则上也不应公开。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['integrity'],
        stem: '关于生成式 AI 的使用，下列哪种做法最符合学术诚信？',
        options: [
          { text: '用它检查语法与改写自己的句子，并按课程要求声明使用范围', correct: true },
          { text: '让它代写整段并当作自己的文字提交' },
          { text: '让它生成参考文献条目后直接使用' },
          { text: '用它分析数据并直接采用结论，不核对' }
        ],
        explain: '可接受的做法是辅助自己已有的表达，并保持透明。代写、伪造条目、不加核对地采用分析结论，都会让读者无法确认哪些工作是你做的。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
