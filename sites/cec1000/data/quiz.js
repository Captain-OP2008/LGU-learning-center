/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；每章 q1–q3 与 chXX.js 内嵌题对应，q4–q7 为补充
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: 'CEC1000 的总评由哪两部分构成？',
        options: [
          { text: '平时参与 60% + 期末考试 40%', correct: true },
          { text: '平时参与 40% + 期末考试 60%' },
          { text: '作业 50% + 期末考试 50%' },
          { text: '期末考试 100%' }
        ],
        explain: '课程大纲给出的比例是 Participation 60% 与 Final exam 40%。平时分占比更高，意味着课堂讨论、小组项目与出勤都不是「可选项」，临时突击期末很难拿高分。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '本站与课程指定的主教材是哪一本？',
        options: [
          { text: '《思想道德与法治》（2023 年版，高等教育出版社）', correct: true },
          { text: '《思想道德修养与法律基础》（2018 年版）' },
          { text: '罗国杰《伦理学》' },
          { text: '张文显《法理学》' }
        ],
        explain: '2023 年版教材是本章内容的主依据，章节顺序与「领悟人生真谛—追求远大理想—弘扬中国精神—践行核心价值观—遵守道德规范—提升法治素养」六章结构一致；旧版教材的章名与表述已有调整。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'tf', difficulty: 1, tags: ['method'],
        stem: '案例分析的四步「事实—规范—价值—行动」可以按方便随意调换顺序。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '顺序不能调换：事实没对齐就找规范，会把传言当依据；规范没理清就谈价值，容易变成情绪表态；前两步没做完就给行动方案，往往不可执行。四步是层层递进的关系，不是四个并列的写作板块。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '本课程把内容组织为「思想—道德—法治」三个层次，这样安排的理由是：',
        options: [
          { text: '三个层次由内到外支撑同一个人格与行为结构，缺一层都会塌', correct: true },
          { text: '三个层次各自独立，考试时分开复习即可' },
          { text: '先讲法治再讲道德更符合认知顺序' },
          { text: '只是为了把教材平均分成三部分' }
        ],
        explain: '思想解决「为什么活、往哪走」，道德解决「与人相处守什么规矩」，法治解决「社会运行的底线规则」。三者从内在信念到外在规范逐层外化，所以案例题常常需要同时动用三层判断。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'multi', difficulty: 1, tags: ['method'],
        stem: '本站每一章通常包含下列哪些结构？（多选）',
        options: [
          { text: '学习目标与知识点索引', correct: true },
          { text: '若干正文小节与对比表格', correct: true },
          { text: '内嵌自测题与章末自检清单', correct: true },
          { text: '覆盖全章的课堂直播回放', correct: false }
        ],
        explain: '本站是阅读型课程站：目标、知识点、正文、表格、内嵌 quiz、自检清单与「覆盖范围」说明构成每章骨架；不提供直播回放，视频类资源需回到课程平台查看。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '本站主教材的全称是《____》（2023 年版）。',
        answer: '思想道德与法治',
        accept: ['思想道德与法治', '《思想道德与法治》', '思想道德与法治（2023年版）'],
        explain: '教材全称《思想道德与法治》，2023 年版，高等教育出版社。注意不要写成旧版书名《思想道德修养与法律基础》，两者章节结构不同。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '七章主线之所以从「人生」排到「法治」，最合理的解释是：',
        options: [
          { text: '从个人意义出发，经理想、精神、价值、道德，最后落到社会规则的底线', correct: true },
          { text: '按教材页码多少排序' },
          { text: '因为法治部分最难，放最后便于集中复习' },
          { text: '各章彼此独立，顺序没有含义' }
        ],
        explain: '这条主线是「由己及人、由内而外」：先回答为什么活（人生），再回答往哪走（理想）、靠什么支撑（精神）、按什么标准判断（价值）、与人相处守什么（道德），最后到社会运行的强制规则（法治）。'
      },

      /* ---------------- ch01 人生观与价值观 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '马克思主义关于人的本质的基本观点是：',
        options: [
          { text: '人的本质是一切社会关系的总和', correct: true },
          { text: '人的本质是自私自利的生物本能' },
          { text: '人的本质是理性与感性的相加' },
          { text: '人的本质由基因单独决定' }
        ],
        explain: '这一判断有三个限定：人处在社会关系之中、从事社会实践、社会属性是人的本质属性。它否定了把人的本质归结为先天本能的说法，也说明人的改变要在关系与实践里发生。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '人生观的三要素中，处于核心地位的是：',
        options: [
          { text: '人生目的', correct: true },
          { text: '人生态度' },
          { text: '人生价值' },
          { text: '人生境遇' }
        ],
        explain: '人生目的回答「为什么活着」，决定人生态度的方向与人生价值的评价标准，因而处于核心；人生态度是外在表现，人生价值是结果与尺度，三者相互影响但核心只有一个。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '人生价值只包括自我价值，不包括社会价值。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '人生价值包含自我价值与社会价值两方面：自我价值是个人对自身需要的满足，社会价值是个人对社会与他人的贡献。二者互为条件，割裂开来就会走向极端个人主义或空谈奉献。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '评价人生价值的根本尺度是：',
        options: [
          { text: '是否顺应社会发展客观规律、是否促进历史进步', correct: true },
          { text: '收入高低与职位大小' },
          { text: '个人感受是否快乐' },
          { text: '他人评价是否正面' }
        ],
        explain: '根本尺度看的是个人活动与历史进步方向的关系，而不是名望、财富或一时情绪。在这个根本尺度下，再具体看贡献大小与尽力程度、物质与精神贡献、社会贡献与自身完善的统一。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些属于教材指出的错误人生观？（多选）',
        options: [
          { text: '拜金主义', correct: true },
          { text: '享乐主义', correct: true },
          { text: '极端个人主义', correct: true },
          { text: '集体主义', correct: false }
        ],
        explain: '拜金主义把金钱当目的，享乐主义把感官满足当唯一标准，极端个人主义把个人利益置于一切之上。三者共同病根是把人降低为单一维度的存在，看不到人的社会关系本质。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '个人与社会最根本的关系，是个人利益与____利益的关系。',
        answer: '社会',
        accept: ['社会', '社会利益', '社会整体'],
        explain: '在社会主义条件下，个人利益与社会利益根本一致：社会利益是个人利益的集中体现与保障，个人利益的实现也依赖社会发展。但一致不等于没有差别，处理时仍需具体分析。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '下列哪一组属于教材讲到的五对人生矛盾？',
        options: [
          { text: '得与失、苦与乐、顺与逆、生与死、荣与辱', correct: true },
          { text: '理想与现实、个人与集体、自由与纪律、权利与义务、民主与集中' },
          { text: '物质与精神、传统与现代、中国与世界、城市与乡村、效率与公平' },
          { text: '知与行、学与思、言与行、名与实、义与利' }
        ],
        explain: '五对矛盾是得与失、苦与乐、顺与逆、生与死、荣与辱。它们的共同要求是辩证对待：既不回避痛苦与失败，也不把一时得失当作全部意义，而是在矛盾中保持方向感。'
      },

      /* ---------------- ch02 理想信念 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '理想的三个基本特征是：',
        options: [
          { text: '实践性、超越性、时代性', correct: true },
          { text: '客观性、必然性、偶然性' },
          { text: '普遍性、特殊性、多样性' },
          { text: '民族性、阶级性、历史性' }
        ],
        explain: '理想源于现实又高于现实（超越性），要经由实践才能实现（实践性），并受所处时代条件制约（时代性）。把理想当成空想，通常就是抽掉了其中「实践性」这一条。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '信念体系中的最高层次是：',
        options: [
          { text: '信仰', correct: true },
          { text: '兴趣' },
          { text: '习惯' },
          { text: '好感' }
        ],
        explain: '信念有层次之分，信仰是最高层次，是对某种主张、主义或价值的极度信服与尊崇，并以此作为行动准则。它比一般信念更稳定、更整体，也更能在困境中支撑人。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '理想是信念所指的对象，信念是理想实现的保障。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '二者相互依存：理想回答「要到哪里去」，信念回答「凭什么坚持去」。没有信念的理想容易半途而废，没有理想的信念容易变成盲目执着。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '下列哪一项不属于理想信念作为「精神之钙」的作用？',
        options: [
          { text: '直接提供物质报酬', correct: true },
          { text: '昭示奋斗目标' },
          { text: '催生前进动力' },
          { text: '提供精神支柱' }
        ],
        explain: '理想信念的四种作用是昭示目标、催生动力、提供支柱、提高境界，全部属于精神层面，不直接带来物质收益。所谓「补钙」，补的是方向感与抗压能力。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '信仰马克思主义的理由包括：（多选）',
        options: [
          { text: '它是科学的理论，揭示了社会发展规律', correct: true },
          { text: '它是人民的理论，为绝大多数人谋利益', correct: true },
          { text: '它是实践的理论，在改造世界中接受检验', correct: true },
          { text: '它是封闭的理论，不需要再发展', correct: false }
        ],
        explain: '科学性、人民性、实践性、开放性四条并列：它来自对现实的科学分析，站在人民立场，在实践中检验并发展，同时保持开放。把马克思主义当成封闭教条，恰恰违背它的基本品格。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'fill', difficulty: 2, tags: ['concept'],
        stem: '个人理想与社会理想的关系中，社会理想是个人理想的____与升华。',
        answer: '凝练',
        accept: ['凝练', '凝聚', '提炼'],
        explain: '社会理想不是个人理想的简单相加，而是对众多个体追求的凝练与升华，因而能为个人理想提供方向指引；个人理想则要以社会理想为指引，在服务社会中获得实现条件。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '教材对大学生提出的三条行动路线是：',
        options: [
          { text: '立鸿鹄志做奋斗者、心怀「国之大者」敢于担当、躬身实践知行合一', correct: true },
          { text: '多读书、多考证、多实习' },
          { text: '先就业、再择业、后创业' },
          { text: '独立思考、自由选择、自我实现' }
        ],
        explain: '三条路线分别对应立志、担当与践行：志向解决方向，担当解决动力，践行解决落地。缺了任何一条，理想都会停留在口号或情绪层面。'
      },

      /* ---------------- ch03 中国精神 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '中国精神被概括为「四个伟大」，它们分别是：',
        options: [
          { text: '伟大创造精神、伟大奋斗精神、伟大团结精神、伟大梦想精神', correct: true },
          { text: '伟大斗争精神、伟大工程精神、伟大事业精神、伟大梦想精神' },
          { text: '伟大爱国精神、伟大创新精神、伟大奉献精神、伟大奋斗精神' },
          { text: '伟大民族精神、伟大时代精神、伟大革命精神、伟大开放精神' }
        ],
        explain: '四个伟大是创造、奋斗、团结、梦想，它们既是对中华民族历史实践的概括，也构成今天中国精神的内容骨架。注意与「四个伟大」在政治话语中的另一组表述区分。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '民族精神的核心是：',
        options: [
          { text: '爱国主义', correct: true },
          { text: '改革创新' },
          { text: '艰苦奋斗' },
          { text: '团结统一' }
        ],
        explain: '民族精神以爱国主义为核心，时代精神以改革创新为核心。爱国主义的具体内容包含大好河山、骨肉同胞、灿烂文化和自己的国家四个方面，不只是情感表达。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-6', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '时代精神的核心是改革创新。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '改革开放是当代中国最鲜明的特色，改革创新因此成为时代精神的核心。它既包括制度与技术的突破，也包括观念与方法的更新，落到个人就是不安于现状、敢于尝试。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '当代中国爱国主义的本质是：',
        options: [
          { text: '爱国、爱党、爱社会主义的高度统一', correct: true },
          { text: '只爱本国文化，不关心制度' },
          { text: '对外国一切事物保持排斥' },
          { text: '在国际比较中坚持本国永远正确' }
        ],
        explain: '三者统一是由近代以来的历史进程与当代中国的制度现实决定的：国家的独立发展、党的领导与社会主义制度是同一进程的三个面向。把它拆开，爱国主义就容易变成抽象情绪或狭隘排外。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '新时代弘扬爱国主义，教材提出的着力点包括：（多选）',
        options: [
          { text: '坚持爱国、爱党、爱社会主义相统一', correct: true },
          { text: '维护祖国统一和民族团结', correct: true },
          { text: '尊重和传承中华民族历史文化，反对历史虚无主义', correct: true },
          { text: '坚持立足中国又面向世界', correct: true },
          { text: '用情绪强度衡量爱国主义', correct: false }
        ],
        explain: '四个着力点分别对应制度认同、国家统一、文化根脉与开放视野。它们共同说明爱国主义是理性的、具体的、有边界的，而不是比谁的言辞更激烈。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-7', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '在当代中国，创新是引领发展的第一____。',
        answer: '动力',
        accept: ['动力', '第一动力', '生产力'],
        explain: '「创新是引领发展的第一动力」是教材的标准表述，与「创新驱动发展战略」相连。它强调增长方式要从要素投入转向创新驱动，而不是把创新仅仅理解为技术发明。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['method'],
        stem: '大学生做改革创新的生力军，教材给出的三条路径是：',
        options: [
          { text: '夯实知识基础、培养创新思维、投身创新实践', correct: true },
          { text: '多参加比赛、多拿证书、多写论文' },
          { text: '先创业、再学习、后总结' },
          { text: '等待条件成熟再行动' }
        ],
        explain: '基础、思维、实践三者构成闭环：没有基础，创新变成空想；没有思维训练，基础只能重复；没有实践，思维无法被检验。三条路径对应「学—想—做」的完整链条。'
      },

      /* ---------------- ch04 社会主义核心价值观 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '二十四字核心价值观的三个层面依次是：',
        options: [
          { text: '国家层面、社会层面、公民个人层面', correct: true },
          { text: '个人层面、家庭层面、国家层面' },
          { text: '经济层面、政治层面、文化层面' },
          { text: '理想层面、现实层面、制度层面' }
        ],
        explain: '富强民主文明和谐是国家层面的价值目标，自由平等公正法治是社会层面的价值取向，爱国敬业诚信友善是公民个人层面的价值准则。三个层面由宏观到微观，彼此支撑。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '社会主义核心价值观是在哪次会议上明确提出的？',
        options: [
          { text: '党的十八大', correct: true },
          { text: '党的十七大' },
          { text: '党的十九大' },
          { text: '党的二十大' }
        ],
        explain: '党的十八大首次以「三个倡导」的形式提出二十四字，之后逐步凝练为社会主义核心价值观。考试常考「提出时间」与「三个层面」的对应，不要与后续会议的论述混淆。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '社会主义核心价值观与社会主义核心价值体系是彼此无关的两套东西。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '二者紧密联系、互为依存、相辅相成：核心价值体系是内核与基础，核心价值观是其集中表达与凝练概括。把它们当成两套并列口号，就无法理解为什么价值观能起到引领作用。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '社会主义核心价值观的三个显著特征是：',
        options: [
          { text: '反映人类社会发展进步、彰显人民至上、真实可信', correct: true },
          { text: '普遍适用、永恒不变、超越阶级' },
          { text: '民族性、开放性、斗争性' },
          { text: '理论性、政策性、宣传性' }
        ],
        explain: '三个特征分别回应「是否先进」「为了谁」「是否可行」：它吸收社会主义本质、中华优秀传统文化与世界文明成果，坚持人民立场，并在实践中被检验，因此与西方所谓「普世价值」有本质区别。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些属于社会层面的价值取向？（多选）',
        options: [
          { text: '自由', correct: true },
          { text: '平等', correct: true },
          { text: '公正', correct: true },
          { text: '法治', correct: true },
          { text: '敬业', correct: false }
        ],
        explain: '自由、平等、公正、法治属于社会层面；敬业属于公民个人层面，富强属于国家层面。记忆时可按「国家—社会—个人」三列依次排开，避免混层。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 1, type: 'fill', difficulty: 1, tags: ['method'],
        stem: '培育和践行核心价值观要做到「落细、落小、____」。',
        answer: '落实',
        accept: ['落实', '落实处'],
        explain: '落细是细化到具体情境，落小是从身边小事做起，落实是转化为可检查的行动。三个词针对的正是「口号化」这一常见毛病。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['method'],
        stem: '「勤学、修德、明辨、笃实」四者中，「明辨」主要解决的是：',
        options: [
          { text: '在多元信息中辨明是非、做出价值判断', correct: true },
          { text: '积累专业知识与技能' },
          { text: '锻炼身体、保持健康' },
          { text: '遵守校纪校规、不迟到' }
        ],
        explain: '四者各有侧重：勤学解决知识基础，修德解决品格，明辨解决判断力，笃实解决行动。信息过载的环境里，明辨往往是最稀缺的一环——它决定你把学到的东西用在哪里。'
      },

      /* ---------------- ch05 道德 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '道德起源的首要前提是：',
        options: [
          { text: '劳动', correct: true },
          { text: '社会关系' },
          { text: '自我意识' },
          { text: '宗教信仰' }
        ],
        explain: '三条件是劳动（首要前提）、社会关系（客观条件）、自我意识（主观条件）。劳动使人与人必须协作，社会关系提供调节对象，自我意识使规范被内化为善恶观念。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '社会主义道德的核心是：',
        options: [
          { text: '为人民服务', correct: true },
          { text: '集体主义' },
          { text: '诚实守信' },
          { text: '爱国主义' }
        ],
        explain: '为人民服务是核心，集体主义是原则。核心回答「道德为了谁」，原则回答「处理利益关系时按什么标准」。二者的层次不同，不能互换。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '集体主义只强调社会利益，不重视个人正当利益。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '集体主义包含三者辩证统一、社会利益高于个人利益、重视和保障个人正当利益三层内容。把集体主义理解为「只要集体、不要个人」，是把原则简化成了口号，也容易导致对个人权利的漠视。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '集体主义的最高层次是：',
        options: [
          { text: '无私奉献、一心为公', correct: true },
          { text: '先公后私、先人后己' },
          { text: '顾全大局、遵纪守法、热爱祖国、诚实劳动' },
          { text: '各人自扫门前雪' }
        ],
        explain: '三个层次由高到低：无私奉献、一心为公；先公后私、先人后己；顾全大局、遵纪守法、热爱祖国、诚实劳动。第三层是对公民的普遍要求，第一层是先进分子的境界。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些属于社会公德的基本要求？（多选）',
        options: [
          { text: '文明礼貌', correct: true },
          { text: '助人为乐', correct: true },
          { text: '爱护公物', correct: true },
          { text: '保护环境', correct: true },
          { text: '爱岗敬业', correct: false }
        ],
        explain: '社会公德五项是文明礼貌、助人为乐、爱护公物、保护环境、遵纪守法；爱岗敬业属于职业道德五项之一。四大领域（社会公德、职业道德、家庭美德、个人品德）各有自己的清单，容易混考。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '社会主义道德的原则是____。',
        answer: '集体主义',
        accept: ['集体主义', '社会主义集体主义'],
        explain: '集体主义是社会主义道德的原则，核心是为人民服务。它要求把社会整体利益放在首位，同时保障个人正当利益，反对把二者对立起来的两种极端。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '职业道德五项要求中，与「办事公道」最相关的是：',
        options: [
          { text: '在处理事务时不偏私、按同一标准对待服务对象', correct: true },
          { text: '对领导与客户保持同样的热情' },
          { text: '尽量满足所有人的所有要求' },
          { text: '把效率放在公平之前' }
        ],
        explain: '办事公道强调的是标准的一致性与不偏私，不是「对谁都好」或「满足一切要求」。它与公正这一价值取向直接相连，也是职业场景中最容易被投诉的一环。'
      },

      /* ---------------- ch06 法治 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '关于法律的本质，下列表述最准确的是：',
        options: [
          { text: '由国家制定或认可、以强制力保证实施、反映统治阶级意志的规范体系', correct: true },
          { text: '由道德观念自然演化而成的行为习惯' },
          { text: '由社会舆论维持的软性约束' },
          { text: '由行政机关内部执行的办事流程' }
        ],
        explain: '三个要点缺一不可：国家意志性（制定或认可）、强制性（强制力保证实施）、阶级性（反映统治阶级意志）。同时它还是规范体系，具有普遍性、稳定性与可预测性。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '法律运行的四个环节是：',
        options: [
          { text: '法律制定、法律执行、法律适用、法律遵守', correct: true },
          { text: '立法、司法、普法、监督' },
          { text: '起草、审议、表决、公布' },
          { text: '起诉、受理、审理、执行' }
        ],
        explain: '四环节是制定、执行、适用、遵守：制定产生规则，执行是行政机关实施，适用是司法机关裁判，遵守是全体社会成员守法。第四个环节最容易被忽略，却决定了前三个环节的效果。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '宪法与普通法律的效力相同，发生冲突时按「新法优于旧法」处理。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '宪法是根本法，具有最高法律效力，一切法律、行政法规、地方性法规都不得同宪法相抵触。冲突时不是比新旧，而是下位法不得违反上位法，违宪的法律条款可被依法纠正。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '全面依法治国的总目标是：',
        options: [
          { text: '建设中国特色社会主义法治体系、建设社会主义法治国家', correct: true },
          { text: '实现司法独立与三权分立' },
          { text: '把全部社会关系纳入刑法调整' },
          { text: '提高全民法律考试的通过率' }
        ],
        explain: '总目标包含「体系」与「国家」两个层面：前者是制度骨架（完备的法律规范体系、高效的法治实施体系等），后者是治理状态。总目标之下还有党的领导、人民当家作主、依法治国有机统一等原则。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '法治思维的基本要求包括：（多选）',
        options: [
          { text: '法律至上', correct: true },
          { text: '权力制约', correct: true },
          { text: '公平正义', correct: true },
          { text: '正当程序', correct: true },
          { text: '人情优先', correct: false }
        ],
        explain: '五项要求是法律至上、权力制约、公平正义、权利保障、正当程序。它们共同构成「按规则办事」的思维习惯，其中正当程序最容易被忽视——结果正确不能替代过程合法。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '我国的根本政治制度是____。',
        answer: '人民代表大会制度',
        accept: ['人民代表大会制度', '人民代表大会', '人大制度'],
        explain: '人民代表大会制度是根本政治制度，中国共产党领导的多党合作和政治协商制度、民族区域自治制度、基层群众自治制度是基本政治制度。二者层级不同，答题时要区分「根本」与「基本」。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '宪法区别于普通法律的三个特征不包括：',
        options: [
          { text: '条文数量最多、规定最细', correct: true },
          { text: '在规定内容上，规定国家最根本最重要的问题' },
          { text: '在法律效力上，具有最高法律效力' },
          { text: '在制定和修改程序上，比普通法律更严格' }
        ],
        explain: '三者是内容根本性、效力最高性、程序严格性。宪法并不追求条文最多最细——恰恰相反，它规定的是根本原则与制度框架，具体规则由下位法展开。'
      },

      /* ---------------- ch07 综合实践 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '案例分析四步法中，第二步「规范」要产出的东西是：',
        options: [
          { text: '一张「规则—要求—依据」的清单', correct: true },
          { text: '一段带个人情绪的评价' },
          { text: '一份媒体报道的截图汇总' },
          { text: '一个最终的处理结论' }
        ],
        explain: '规范这一步要把可适用的法律、校规、合同、行业规范与道德准则逐条列出，并注明依据。常见错误是只凭直觉说「这不合法」，却说不出违反哪一条——那样的论证无法被检验。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '网络发帖指认同学「偷东西」的案例中，判断发帖是否过界的核心是：',
        options: [
          { text: '手段是否必要、对他人权利的损害是否与目的成比例', correct: true },
          { text: '发帖人是否真的丢了东西' },
          { text: '帖子有没有被很多人转发' },
          { text: '发帖人后来有没有道歉' }
        ],
        explain: '表达与求助的自由要与他人不受诬告辱骂的权利平衡，判断标准是比例原则：先内部询问、报告宿管、报警等损害更小的手段是否可用。丢东西的事实只说明目的正当，不能自动证明手段正当。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '兼职没有签书面合同，就不存在任何法律关系，报酬要不回来。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '口头约定同样可以成立合同关系，关键在于能否证明约定内容与实际工作量。聊天记录、工作证、排班表、同伴证言、转账记录都可以作为证据。「没合同」不等于「没关系」，只意味着举证更难。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '关于科研诚信的层级，下列划分正确的是：',
        options: [
          { text: '不规范（格式、引用）—不诚信（改数据、抄袭）—违法（侵权）', correct: true },
          { text: '不规范就是违法，三者没有区别' },
          { text: '只要不是抄袭，都不算问题' },
          { text: '是否诚信只看最终结论是否正确' }
        ],
        explain: '三层对应的处理方式不同：规范问题靠训练与提醒，诚信问题靠认定与处分，违法问题靠法律程序。把三层混为一谈，会导致要么过度惩罚，要么轻描淡写。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'multi', difficulty: 2, tags: ['method'],
        stem: '校园兼职发生欠薪争议时，应当优先保留哪些证据？（多选）',
        options: [
          { text: '含约定内容与对方身份的聊天记录', correct: true },
          { text: '排班表、打卡或现场工作照片', correct: true },
          { text: '转账记录与工资支付凭证', correct: true },
          { text: '用工主体的名称、工作证或店铺页面', correct: true },
          { text: '同学的转述与听说的情况', correct: false }
        ],
        explain: '四类证据分别证明「约定了什么」「做了多少」「付了多少」「向谁主张」。传闻与转述证明力弱，只能作为寻找直接证据的线索，不能替代原始记录。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'fill', difficulty: 1, tags: ['method'],
        stem: '设计问卷之前，教材建议先做三次____，用来修正假设。',
        answer: '预访谈',
        accept: ['预访谈', '访谈', '预调查'],
        explain: '预访谈用二十分钟和三个符合条件的人聊，能发现你没想到的情境，避免问卷问了一堆没人关心的问题。它是把「大而空的题目」改小的第一步。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['method'],
        stem: '读书报告的第三段（评估）主要回答的问题是：',
        options: [
          { text: '作者的关键前提是否成立、有没有反例或补充', correct: true },
          { text: '这本书一共有多少页、作者是谁' },
          { text: '读完之后我有多感动' },
          { text: '书中的观点是否符合我的既有看法' }
        ],
        explain: '评估段要找出作者论证依赖的假设，再检验它：前提有问题、材料有偏差、推理有跳跃，都是可下手的点。写不出评估，通常是没找到假设，或者不敢不同意。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
