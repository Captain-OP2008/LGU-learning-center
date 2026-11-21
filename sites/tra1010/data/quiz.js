/* =====================================================================
 * quiz.js · TRA1010 分章题库
 * 每章 7 题：q1–q3 与正文内嵌题对应，q4–q7 为延伸练习。
 * 字段：id / ch / kp / tier / type / difficulty / tags / stem / options / answer / accept / explain
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'], stem: '本课程把翻译研究分成理论、描写、应用三个层面。下列哪一项属于应用层面？',
        options: [
          { text: '提出一套新的翻译转换分类' },
          { text: '统计某译本中显化处理的分布' },
          { text: '编写术语库并制定译名规范', correct: true },
          { text: '讨论可译性的哲学条件' }
        ],
        explain: '应用层面处理的是「拿研究去做什么」：培训、工具、批评、政策。编写术语库与译名规范属于工具与政策，故为应用。前两项分别是理论与描写，第四项属于理论中的可译性讨论。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['method'], stem: '课程介绍的「读译文三步法」，第一步是什么？',
        options: [
          { text: '对照原文，标出可比单位', correct: true },
          { text: '直接判断译文好不好' },
          { text: '查译者的生平与流派' },
          { text: '统计译文比原文多了多少字' }
        ],
        explain: '三步法是「对照—归类—评价」：先建立可比单位并逐处对照，再用概念给现象归类，最后才评价。跳过对照直接判断，只能写成读后感。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'], stem: '判断：翻译研究（Translation Studies）主要是训练学生把外语译成母语。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '翻译研究是研究翻译的产品、过程与功能的学科，不是语言训练课。练习翻译是技能训练，研究翻译要回答「为什么这样译、产生了什么效果」。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'], stem: '下列哪一组按「产品—过程—功能」的顺序排列？',
        options: [
          { text: '译文文本—译者的认知决策—译文在目标文化中的作用', correct: true },
          { text: '译者的认知决策—译文文本—译文在目标文化中的作用' },
          { text: '译文在目标文化中的作用—译文文本—译者的认知决策' },
          { text: '译文文本—译文在目标文化中的作用—译者的认知决策' }
        ],
        explain: '产品取向研究成品译文，过程取向研究译者如何决策，功能取向研究译文在目标文化里起了什么作用。三者是 Holmes 地图中描写研究的三条线。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'], stem: '判断：同一原文在同一个时代只可能有一个合格译文。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '同一原文可以因读者、目的、媒介不同而产生多个合格译文。判断合格与否，要先说明依据的是哪套规范、服务的是哪类读者。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'], stem: '本课程把翻译研究分为理论、描写与____三个层面。',
        answer: '应用', accept: ['应用层面', 'applied'],
        explain: '三个层面是理论、描写、应用。理论提出概念与框架，描写观察实际现象，应用把研究用于培训、工具、批评与政策。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-3', tier: 2, type: 'multi', difficulty: 2,
        tags: ['method'], stem: '下列哪些属于描写层面的问题？（多选）',
        options: [
          { text: '某译本如何处理文化专有项', correct: true },
          { text: '某时期译者更倾向拆句还是保留长句', correct: true },
          { text: '译者应该采用归化还是异化' },
          { text: '某出版社为什么选择重译这本小说', correct: true }
        ],
        explain: '描写层面问「实际上是什么样」，前三项中的第一、二、四项都可观察、可统计、可解释。第三项问「应该」，属于规定性讨论，不是描写。'
      },

      /* ---------------- ch01 翻译是什么 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'], stem: '把《红楼梦》改编成电视剧，按 Jakobson 的分类属于哪种翻译？',
        options: [
          { text: '语内翻译' },
          { text: '语际翻译' },
          { text: '符际翻译', correct: true },
          { text: '机器翻译' }
        ],
        explain: '符际翻译是不同符号系统之间的转换：小说用文字，电视剧用影像与声音，媒介变了。语内翻译是同一种语言内部的改写，如把古文译成白话。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'], stem: '下列文本中，哪一类最难在翻译中保留全部信息？',
        options: [
          { text: '产品说明书' },
          { text: '法律合同' },
          { text: '诗歌的双关与韵律', correct: true },
          { text: '新闻报道' }
        ],
        explain: '双关依赖特定语言的音形巧合，韵律依赖音节结构，两者在另一种语言里很难同时保留。说明书与合同以指称信息为主，可译性较高。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-6', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'], stem: '判断：直译与意译是二元对立，一篇译文只能属于其中一种。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '直译与意译是连续谱，同一篇译文里不同句子可以落在不同位置。判断要看词序、词性、喻体等指标，而不是给整篇贴一个标签。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['theory'], stem: 'Jakobson 说语言的差别「不在于能表达什么，而在于必须表达什么」，这句话最直接解释了什么？',
        options: [
          { text: '为什么有些意义在翻译中必须显化', correct: true },
          { text: '为什么诗歌完全不可译' },
          { text: '为什么机器翻译一定会出错' },
          { text: '为什么译者要加注' }
        ],
        explain: '「必须表达」指语法强制项：英语必须标时体与数，中文必须标量词与语气。译文因此常要补出原文没有明说的信息，这就是显化的语法根源。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-1', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'], stem: '判断：口译和手语翻译都属于符际翻译。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '口译与手语翻译都是语言与语言之间的转换，属于语际翻译；符际翻译是语言与非语言符号系统之间的转换，如小说改编成电影。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-7', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'], stem: 'Venuti 把消除异域感、让译文读起来像目标语原创的策略称为____（中文两字）。',
        answer: '归化', accept: ['domestication', '归化翻译'],
        explain: '归化（domestication）让译文尽量不留翻译痕迹；异化（foreignization）则保留原文的异域感，让读者意识到自己在读译本。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-2', tier: 2, type: 'multi', difficulty: 2,
        tags: ['method'], stem: '下列哪些因素会影响同一原文的译法？（多选）',
        options: [
          { text: '目标读者的知识背景', correct: true },
          { text: '翻译的目的与用途', correct: true },
          { text: '出版篇幅或时长限制', correct: true },
          { text: '原文作者的国籍' }
        ],
        explain: '读者、目的、媒介限制都会改变译者的取舍。作者国籍本身不是变量，除非它影响到文本的文化预设或语言特征。'
      },

      /* ---------------- ch02 学科地图 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['theory'], stem: '按 Holmes 的学科地图，「局部理论」（partial theory）属于哪一支？',
        options: [
          { text: '纯研究中的理论研究', correct: true },
          { text: '纯研究中的描写研究' },
          { text: '应用研究' },
          { text: '翻译培训' }
        ],
        explain: 'Holmes 把纯研究分为理论分支与描写分支；理论分支再分总体理论与局部理论。局部理论按媒介、地域、层级、文本类型、时期或问题限定范围。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['method'], stem: '研究译者在翻译过程中如何做决策，属于 Holmes 地图的哪一类？',
        options: [
          { text: '产品取向描写研究' },
          { text: '过程取向描写研究', correct: true },
          { text: '功能取向描写研究' },
          { text: '翻译批评' }
        ],
        explain: '过程取向研究译者的认知与决策，常用有声思维、眼动、键盘记录等方法；产品取向研究成品译文，功能取向研究译文在目标文化中的作用。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'], stem: '判断：Holmes 地图的应用分支包括翻译培训、翻译工具、翻译批评与翻译政策。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '应用分支的四项是培训、工具（含术语库与翻译技术）、批评、政策。它们把纯研究的成果用于实践，也反过来给研究提供问题。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-6', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['theory'], stem: 'van Doorslaer 对 Holmes 地图的主要修订是什么？',
        options: [
          { text: '取消应用分支' },
          { text: '以翻译为中心、把视角放在外围', correct: true },
          { text: '增加机器翻译分支' },
          { text: '把描写研究并入理论研究' }
        ],
        explain: 'van Doorslaer 认为原图把「翻译」与「研究」混在一起，修订版以翻译活动为中心，把语言、文化、社会等视角放在外围，更清楚但更难记。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'tf', difficulty: 2,
        tags: ['theory'], stem: '判断：总体理论（general theory）可以直接指导具体的翻译决策。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '总体理论给的是最一般的条件句，一落到具体文本就要靠局部理论或描写研究补充变量。直接拿总体理论指导决策，容易变成空话。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'fill', difficulty: 1,
        tags: ['theory'], stem: 'Holmes 1972 年的论文把翻译研究分为纯研究与____研究两大支。',
        answer: '应用', accept: ['applied', '应用研究'],
        explain: '纯研究追求知识，分理论与描写两支；应用研究解决实践问题，分培训、工具、批评、政策四支。两支互相供料，不是上下级关系。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['method'], stem: '下列哪些可以作为描写翻译研究的合法数据？（多选）',
        options: [
          { text: '平行语料库中的原文与译文', correct: true },
          { text: '译者的访谈记录', correct: true },
          { text: '出版社的选题档案', correct: true },
          { text: '译者应该遵守的规范清单' }
        ],
        explain: '语料、访谈、档案都是可观察的经验材料。规范清单是规定性文件，只能说明「要求是什么」，不能直接证明译者实际怎么做。'
      },

      /* ---------------- ch03 七种技法 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'], stem: 'skyscraper 译成法语 gratte-ciel（刮天者），属于七种技法中的哪一种？',
        options: [
          { text: '借词' },
          { text: '仿译', correct: true },
          { text: '直译' },
          { text: '调制' }
        ],
        explain: '仿译（calque）是逐语素仿造：skyscraper 的 sky 与 scrape 被分别译成 ciel 与 gratte，构成新的目标语词。借词是原样搬用，直译是整句照搬。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'], stem: 'I do not think so 译成法语 Je pense que non（我认为不是），属于哪种技法？',
        options: [
          { text: '词性转换' },
          { text: '调制', correct: true },
          { text: '等值' },
          { text: '改编' }
        ],
        explain: '调制（modulation）是视角或语义焦点的改变：英语否定主句，法语否定从句。等值是固定套语的替换，改编是情境的整体替换。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'tf', difficulty: 1,
        tags: ['theory'], stem: '判断：Vinay 与 Darbelnet 认为直译在任何情况下都不可接受，应优先意译。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '两人的立场相反：直译是首选，只有在意思走样、无意义、结构不可能或文化无对应经验时，才转用间接法。他们的方法论是「能直译就直译」。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-6', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['concept'], stem: '下列哪一项属于 servitude（强制），而不是 option（选择）？',
        options: [
          { text: 'His eyes are blue 译成中文时补出「的」', correct: true },
          { text: '把「蓝眼睛」译成 blue eyes' },
          { text: '把双关改译成另一个双关' },
          { text: '把板球换成自行车赛' }
        ],
        explain: 'servitude 是目标语语法强制的调整，译者没有选择余地；补「的」是中文定语结构的强制要求。其余三项都是译者可选的处理，属于 option。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'], stem: '判断：改编（adaptation）适用于两种文化中某一情境完全不存在的情况。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '改编是七种技法里走得最远的一种：当原文的情境在目标文化里不存在，只能换成一个功能相当的情境。若情境存在而只是表达习惯不同，用调制或等值即可。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'], stem: '把 announced his resignation 译成「宣布辞职」，名词转动词，属于七种技法中的____（中文四字）。',
        answer: '词性转换', accept: ['transposition', '转性'],
        explain: '词性转换（transposition）指翻译时改变词类而不改变命题内容。英文名词化结构在中文里常要转成动词，这是英译汉最常见的技法之一。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'], stem: '下列哪些属于「直接法」？（多选）',
        options: [
          { text: '借词', correct: true },
          { text: '仿译', correct: true },
          { text: '直译', correct: true },
          { text: '调制' }
        ],
        explain: '直接法包括借词、仿译、直译三种；间接法包括词性转换、调制、等值、改编四种。直接法不等于更忠实，只是保留原文形式的程度更高。'
      },

      /* ---------------- ch04 翻译转换 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'], stem: 'He has left 译成「他已经走了」，属于 Catford 的哪一类转换？',
        options: [
          { text: '层次转换', correct: true },
          { text: '结构转换' },
          { text: '类别转换' },
          { text: '单位转换' }
        ],
        explain: '英文用现在完成体这一语法形式表达完成义，中文用「已经」「了」这类词汇手段承担，属于语法层与词汇层之间的层次转换。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'], stem: 'the man who came yesterday 译成「昨天来的那个人」，属于哪一类转换？',
        options: [
          { text: '层次转换' },
          { text: '结构转换', correct: true },
          { text: '类别转换' },
          { text: '内部系统转换' }
        ],
        explain: '关系从句从名词后置移到名词前置，句法结构变了，属于结构转换。此处没有词类改变，也不是语法与词汇手段的互换。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'tf', difficulty: 1,
        tags: ['theory'], stem: '判断：Catford 的翻译转换指译文对原文意义不忠实。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '转换是译文对形式对应的偏离，是描写性概念，不是价值判断。绝大多数转换是目标语语法强制的，与忠实与否无关。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'], stem: '下列哪一项是「单位转换」？',
        options: [
          { text: '从句降为短语', correct: true },
          { text: '名词转动词' },
          { text: '被动转主动' },
          { text: '单数变复数' }
        ],
        explain: '单位转换指对应单位大小改变：从句降为短语、词升为短语、两句并一句。名词转动词属类别转换，被动转主动属结构转换，单复数属内部系统转换。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'], stem: '判断：内部系统转换指在目标语系统内部换用另一个成员，如把 you 译成「您」。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '内部系统转换的前提是两种语言都有这个子系统（如敬称系统），译文只是在系统内换了成员。若目标语根本没有该子系统，则属于层次转换或省略。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'], stem: 'Catford 把译文对形式对应的偏离称为翻译____。',
        answer: '转换', accept: ['shift', '翻译转换'],
        explain: '转换（shift）是 Catford 的核心概念，分层次转换与范畴转换两大类，范畴转换再分结构、类别、单位、内部系统四种。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'], stem: '下列哪些属于范畴转换？（多选）',
        options: [
          { text: '结构转换', correct: true },
          { text: '类别转换', correct: true },
          { text: '层次转换' },
          { text: '单位转换', correct: true }
        ],
        explain: '范畴转换包括结构、类别、单位、内部系统四种；层次转换与范畴转换并列，是另一大类。多选题容易把层次转换混进范畴转换。'
      },

      /* ---------------- ch05 等值 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['theory'], stem: 'Nida 的动态对等主要以什么为标准？',
        options: [
          { text: '形式上的逐项对应' },
          { text: '目标读者与原文读者的反应相当', correct: true },
          { text: '术语前后一致' },
          { text: '译文与原文的字数相当' }
        ],
        explain: '动态对等（后称功能对等）看读者反应：译文应让目标读者以原文读者理解原文的方式理解译文。形式对应只是手段之一，不是标准。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'], stem: '合同里的 shall 译成「应」而不是「须」，按 Koller 的分类主要涉及哪一层？',
        options: [
          { text: '指称等值' },
          { text: '内涵等值' },
          { text: '文本规范等值', correct: true },
          { text: '形式等值' }
        ],
        explain: '「应」与「须」的命题内容相同，差别在合同体裁对义务强度的规范，属于文本规范等值。指称层没有错，错的是体裁惯例。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'], stem: '判断：等值意味着译文与原文在每个层面都完全相等。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '等值是关系而非同一性：译文只能在指定层面上与原文可核对地对应。要求每个层面都相等，等于要求译文就是原文，不可能也不需要。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['history'], stem: '严复的「雅」在原语境里主要指什么？',
        options: [
          { text: '文体得体' },
          { text: '古雅文言', correct: true },
          { text: '音韵和谐' },
          { text: '术语统一' }
        ],
        explain: '严复的「雅」指用汉以前的字法句法，服务于士大夫读者。今天把「雅」解释为文体得体，是后世的挪用，不是原意。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'tf', difficulty: 2,
        tags: ['theory'], stem: '判断：Nida 后来把「动态对等」改称「功能对等」，部分原因是避免被误解为只顾效果、不管形式。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'dynamic 一词容易被读成「只要读者反应、形式可以随便」，functional 的表述更谨慎，强调读者理解方式的相当，而非情感反应的复制。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'], stem: 'Koller 五类等值中，考察韵律、双关与版式的是____等值。',
        answer: '形式', accept: ['formal', '形式等值'],
        explain: '形式等值考察的是文本的形式特征：韵律、双关、排比、版式。它在诗歌与广告里常与指称等值冲突，需要说明取舍。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['theory'], stem: '下列哪些是等值理论受到的批评？（多选）',
        options: [
          { text: '概念含混，难以测量', correct: true },
          { text: '规定性太强，不解释实际现象', correct: true },
          { text: '以原文为中心，忽视译文的作用', correct: true },
          { text: '完全不关心读者' }
        ],
        explain: '前三条是常见批评：定义模糊、规范色彩重、原文中心。第四条不成立——等值理论恰恰很关心读者，Nida 的动态对等就以读者反应为标准。'
      },

      /* ---------------- ch06 目的论 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['theory'], stem: 'Skopos 三规则中，优先级最高的是哪一条？',
        options: [
          { text: '忠实规则' },
          { text: '连贯规则' },
          { text: '目的规则', correct: true },
          { text: '等值规则' }
        ],
        explain: '三条规则的层级是目的 > 连贯 > 忠实。目的决定译文要完成什么，连贯保证目标读者读得通，忠实规定译文与原文的对应程度。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'], stem: '按 Reiss 的文本类型学，诗歌主要属于哪一类？',
        options: [
          { text: '信息型' },
          { text: '表情型', correct: true },
          { text: '操作型' },
          { text: '视听型' }
        ],
        explain: '诗歌以表达情感与形式创造为主，属表情型，翻译时应优先保留形式与风格。信息型重事实，操作型重说服行动，视听型指配音字幕等媒介文本。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['theory'], stem: '判断：Nord 的忠诚（loyalty）要求译者对作者、读者与委托方负责。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '忠诚是人际与伦理层面的责任，约束「目的」不被滥用。它与 fidelity（忠实于原文）不同：fidelity 是文本关系，loyalty 是多方协商。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'], stem: 'House 所说的「隐性翻译」（covert translation）最典型的文本是哪一类？',
        options: [
          { text: '文学经典' },
          { text: '历史文献' },
          { text: '新闻与广告', correct: true },
          { text: '宗教经典' }
        ],
        explain: '隐性翻译让译文读起来像目标语原创，新闻与广告最典型；显性翻译保留原文的文化语境，读者知道自己在读译本，如文学经典与历史文献。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'tf', difficulty: 2,
        tags: ['ethics'], stem: '判断：功能主义认为只要目的正当，译者就可以删改药品说明书里的免责声明。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '功能主义有边界：法律与医学文本的底线不能碰，删改免责声明可能造成伤害。目的可以调整表达，不能取消关键信息。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'], stem: '说明读者、媒介、时间地点、功能与特殊要求的文件叫翻译____。',
        answer: '委托', accept: ['brief', '委托书', '翻译委托书'],
        explain: '翻译委托（translation brief）是目的论的操作起点。委托不清时，译者的第一动作是追问，而不是凭猜测动笔。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'], stem: '下列哪些属于 Halliday 语域理论的变量？（多选）',
        options: [
          { text: '语场', correct: true },
          { text: '语旨', correct: true },
          { text: '语式', correct: true },
          { text: '语序' }
        ],
        explain: '语域三变量是语场（谈什么）、语旨（谁对谁说）、语式（口头还是书面）。语序是句法概念，不属于语域。'
      },

      /* ---------------- ch07 规范与文化转向 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['theory'], stem: 'Toury 三类规范中，管「选什么文本、从什么语言译」的是哪一类？',
        options: [
          { text: '预备规范', correct: true },
          { text: '初始规范' },
          { text: '操作规范' },
          { text: '母体规范' }
        ],
        explain: '预备规范管翻译政策与直接性，即选材与是否转译；初始规范管整体倾向；操作规范管具体处理，其中母体规范管章节删增。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['theory'], stem: 'Lefevere 的「赞助人」（patronage）指什么？',
        options: [
          { text: '译者的个人风格' },
          { text: '影响翻译的外部力量', correct: true },
          { text: '原文作者' },
          { text: '目标读者' }
        ],
        explain: '赞助人是出版社、政府、宗教机构等外部力量，决定什么能译、什么不能译。它与诗学、意识形态共同构成改写的三个控制变量。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'tf', difficulty: 1,
        tags: ['ethics'], stem: '判断：Venuti 认为异化翻译在任何情况下都比归化翻译更道德。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'Venuti 主张异化以抵抗流畅归化的文化同化，但他也强调异化必须可读。把异化当成无条件更道德，是对他的简化，也不符合描写研究的立场。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['theory'], stem: '按 Even-Zohar 的多元系统理论，翻译文学处于中心位置时，译者通常怎样？',
        options: [
          { text: '更敢打破本土规范，引入新形式', correct: true },
          { text: '更保守，沿用本土形式' },
          { text: '更倾向大幅删减' },
          { text: '拒绝翻译' }
        ],
        explain: '翻译文学在中心时，往往承担革新本土文学的功能，译者敢用异化与新形式；在边缘时，读者不需要它来革新，归化更常见。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'tf', difficulty: 1,
        tags: ['method'], stem: '判断：描写翻译研究先描述译者实际怎么做，再谈评价。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '描写研究把评价悬置，先收集语料、重建规范、解释现象；评价仍可做，但必须说明依据的是哪套规范、哪个时代的读者。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'fill', difficulty: 2,
        tags: ['theory'], stem: 'Bourdieu 用来指译者在长期实践中形成的选择倾向的概念是____（中文两字）。',
        answer: '惯习', accept: ['habitus'],
        explain: '惯习（habitus）是译者在场域中养成的倾向：遇到文化词加注还是替换，遇到长句拆还是留，往往不假思索。它与场域、资本一起解释译者的差异。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['theory'], stem: '下列哪些属于文化转向的关键词？（多选）',
        options: [
          { text: '赞助人', correct: true },
          { text: '诗学', correct: true },
          { text: '意识形态', correct: true },
          { text: '音位系统' }
        ],
        explain: '赞助人、诗学、意识形态是 Lefevere 改写理论的三个控制变量，也是文化转向的核心概念。音位系统属于语言学层面，不是文化转向的关键词。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
