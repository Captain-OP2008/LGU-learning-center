/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；每章 q1–q7，其中 q1–q3 与各章内嵌 quiz 一致
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '认知心理学主要研究什么？',
        options: [
          { text: '心智怎样接收、表征、存储和使用信息', correct: true },
          { text: '只研究可观察的外显行为，不推断内部过程' },
          { text: '只研究大脑的解剖结构' },
          { text: '只研究情绪与人格差异' }
        ],
        explain: '认知心理学把心智看作信息加工系统，研究知觉、注意、记忆、语言、思维等过程；行为主义只研究外显行为，是它历史上的对照面。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '认知心理学完全拒绝研究内部心理过程，只承认行为数据。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '认知心理学恰恰以推断内部过程为核心，只是要求用可检验的行为、脑与计算证据来约束这些推断，而不是凭内省随意断言。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '下列哪一项不属于本课程反复使用的三类证据？',
        options: [
          { text: '行为数据（反应时、正确率）' },
          { text: '脑与生理数据（ERP、fMRI）' },
          { text: '计算模型与模拟' },
          { text: '星座与性格测试结果', correct: true }
        ],
        explain: '课程强调行为、脑、计算三类证据互相约束；星座与性格测试不满足可检验性，不属于科学证据。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'fill', difficulty: 1, tags: ['history'],
        stem: '提出「减法法」、用反应时分解加工阶段的心理学家是谁？（填中文或英文姓氏）',
        answer: '唐德斯',
        accept: ['唐德斯', 'Donders', 'donders', 'F. C. Donders'],
        explain: '荷兰生理学家唐德斯（Donders）在 1868 年提出减法法：用含更多阶段的任务减去含较少阶段的任务，差值即该阶段的耗时。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'fill', difficulty: 1, tags: ['calc'],
        stem: '某实验简单任务平均反应时 450 ms，选择任务平均 620 ms。按减法法，选择阶段约需多少毫秒？（只填数字）',
        answer: '170',
        accept: ['170', '170ms', '170 ms'],
        explain: '620 − 450 = 170 ms。减法法的关键是两任务只差一个阶段，其余阶段保持相同，差值才能归给该阶段。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'multi', difficulty: 2, tags: ['method'],
        stem: '一个合格的认知实验通常需要具备哪些要素？（多选）',
        options: [
          { text: '可操作化的自变量与因变量', correct: true },
          { text: '对照组或基线条件', correct: true },
          { text: '对混淆变量做控制或随机化', correct: true },
          { text: '先得出想要的结论，再挑数据支持它' }
        ],
        explain: '实验的逻辑是「操纵—比较—排除替代解释」。先定结论再挑数据是确认偏差，正是课程反复提醒要避免的做法。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['textbook'],
        stem: '本课程的主教材是哪一本？',
        options: [
          { text: 'Sternberg《Cognitive Psychology》第 6 版', correct: true },
          { text: 'Eysenck & Keane《Cognitive Psychology》第 8 版' },
          { text: 'Gazzaniga《Cognitive Neuroscience》' },
          { text: 'Anderson《Cognitive Psychology and Its Implications》' }
        ],
        explain: '课程资料栏给出的主教材是 Sternberg 与 Sternberg 的《Cognitive Psychology》第 6 版；其余几本是同领域的常见参考书。'
      },

      /* ---------------- ch01 方法 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '减法法的核心逻辑是什么？',
        options: [
          { text: '两个任务只差一个加工阶段，反应时之差就是该阶段的耗时', correct: true },
          { text: '把一个大任务拆成许多小任务分别计时，再求平均' },
          { text: '用脑成像直接读出每个阶段的时间' },
          { text: '让被试自己报告每一阶段花了多久' }
        ],
        explain: '减法法要求两任务在其他阶段上完全相同，只有目标阶段不同，差值才能归因于该阶段；这也是它最容易被批评的地方——「纯插入」很难保证。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'tf', difficulty: 2, tags: ['method'],
        stem: '在加因素法中，如果两个因素对反应时的效应可以相加，就支持它们分别影响不同的加工阶段。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '加因素法用「可加性」推断阶段独立性：效应可加说明两因素作用于不同阶段；若存在交互，则提示它们共享同一阶段或资源。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['stats'],
        stem: '反应时数据通常呈右偏分布，描述其集中趋势时更稳妥的做法是：',
        options: [
          { text: '报告中位数，并同时给出分布形态或分位数', correct: true },
          { text: '只报告算术平均数，因为它是无偏估计' },
          { text: '删掉所有慢反应，只保留最快的 10%' },
          { text: '把单位从毫秒改成秒，偏态就会消失' }
        ],
        explain: '右偏分布下平均数会被长尾拉高，中位数更稳健；规范做法是中位数加分布信息，异常值处理要预先规定并说明理由。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'fill', difficulty: 2, tags: ['imaging'],
        stem: 'fMRI 的空间分辨率较高但时间分辨率较低，主要因为它测量的是血氧水平依赖信号，即 ______ 信号。（填英文缩写）',
        answer: 'BOLD',
        accept: ['BOLD', 'bold', 'BOLD 信号'],
        explain: 'BOLD（blood-oxygen-level-dependent）反映血氧变化，峰值滞后数秒，因此时间分辨率远低于 ERP；EEG/MEG 则相反，时间精确但空间定位模糊。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'fill', difficulty: 2, tags: ['calc'],
        stem: '某任务含「编码 + 搜索 + 反应」三阶段，总反应时 800 ms；若把搜索集从 1 项增到 4 项、每项多花 40 ms，总时间变为多少毫秒？（只填数字）',
        answer: '920',
        accept: ['920', '920ms', '920 ms'],
        explain: '搜索阶段增加 (4−1)×40 = 120 ms，其余阶段不变，故 800 + 120 = 920 ms。这正是 Sternberg 加因素法/系列扫描的算法。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'multi', difficulty: 2, tags: ['imaging'],
        stem: '关于脑成像方法，下列说法正确的有：（多选）',
        options: [
          { text: 'ERP 的时间分辨率可达毫秒级', correct: true },
          { text: 'fMRI 的空间分辨率通常优于 ERP', correct: true },
          { text: 'TMS 可以暂时扰动某脑区，提供因果性证据', correct: true },
          { text: 'PET 不需要注射放射性示踪剂' }
        ],
        explain: 'ERP 强在时间、fMRI 强在空间，TMS 通过暂时抑制或激活某区域检验因果关系；PET 需要放射性示踪剂，成本与侵入性都较高。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 3, type: 'mcq', difficulty: 3, tags: ['inference'],
        stem: '所谓「反转推理」（reverse inference）指的是：',
        options: [
          { text: '从某脑区被激活反推某个心理过程一定发生了', correct: true },
          { text: '从行为结果反推脑区结构' },
          { text: '把实验顺序倒过来再做一遍' },
          { text: '用统计检验反推样本量' }
        ],
        explain: '反转推理的问题在于脑区与功能是多对多的：某区激活只能说明它参与了任务，不能唯一确定是哪种心理过程，需结合实验设计与其他证据。'
      },

      /* ---------------- ch02 知觉与注意 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['gestalt'],
        stem: '格式塔的「接近性原则」指的是：',
        options: [
          { text: '空间上靠近的元素更容易被看成一组', correct: true },
          { text: '颜色相同的元素一定被看成一组' },
          { text: '被遮挡的物体一定被补全成完整形状' },
          { text: '运动方向一致的元素才被分组' }
        ],
        explain: '接近性按空间距离分组；相似性按颜色/形状分组；良好延续按线条走向分组；共同命运按运动方向分组。四条原则常同时竞争。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'tf', difficulty: 1, tags: ['search'],
        stem: '按照特征整合理论，当目标由一个独特特征定义时（如在一堆竖线中找横线），搜索近似平行、几乎不随项目数增加而变慢。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '特征搜索可平行进行，斜率接近 0；而结合搜索需要逐个绑定特征，呈串行、斜率明显大于 0，这正是特征整合理论的经典预测。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-7', tier: 1, type: 'mcq', difficulty: 2, tags: ['attention'],
        stem: '「变化盲视」（change blindness）最直接地说明：',
        options: [
          { text: '没有注意到的变化可以完全不进入意识', correct: true },
          { text: '人的视觉记忆容量是无限的' },
          { text: '眼睛每秒钟只能处理一个画面' },
          { text: '颜色变化比位置变化更容易被察觉' }
        ],
        explain: '变化盲视表明知觉并非对场景的完整复制：未被注意的物体或变化不会被表征，因此「看见」与「意识到」不是一回事。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-6', tier: 1, type: 'fill', difficulty: 1, tags: ['search'],
        stem: '在视觉搜索实验中，若反应时几乎不随干扰项数量增加而变化，说明搜索是 ______ 的。（填「平行」或「串行」）',
        answer: '平行',
        accept: ['平行', 'parallel', 'Parallel', '平行加工'],
        explain: '斜率接近零意味着所有项目被同时处理，即平行搜索；斜率明显为正则支持串行（逐项）搜索。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'fill', difficulty: 2, tags: ['stroop'],
        stem: '在斯特鲁普任务中，当字的颜色与字义不一致时，被试命名颜色会变慢。这种干扰说明阅读（词义）加工是 ______ 的。（填「自动化」或「受控」）',
        answer: '自动化',
        accept: ['自动化', '自动', 'automatic'],
        explain: '熟练读者的词义通达高度自动化，无法按任务要求「关掉」，因此会与颜色命名竞争资源，产生斯特鲁普干扰。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'multi', difficulty: 2, tags: ['networks'],
        stem: 'Posner 与 Fan 提出的三个注意网络包括：（多选）',
        options: [
          { text: '警觉（alerting）', correct: true },
          { text: '定向（orienting）', correct: true },
          { text: '执行控制（executive control）', correct: true },
          { text: '语音环路（phonological loop）' }
        ],
        explain: '注意网络分警觉、定向、执行控制三类，各有不同的神经基础与测验（如 ANT）；语音环路是工作记忆的成分，属于记忆章节。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-3', tier: 3, type: 'mcq', difficulty: 2, tags: ['recognition'],
        stem: '与「模板匹配」相比，「特征分析」理论更能解释下列哪种现象？',
        options: [
          { text: '人能在字体、大小、视角变化时仍认出同一个字母', correct: true },
          { text: '人对熟悉面孔的识别速度极快' },
          { text: '人在噪声中仍能听清句子' },
          { text: '人会把相邻的点连成一条线' }
        ],
        explain: '特征分析把字母分解为线段、交点等特征，因此对字体与大小变化不敏感；模板匹配要求与存储模板逐像素对齐，难以解释这种恒常性。'
      },

      /* ---------------- ch03 记忆的结构 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['sperling'],
        stem: 'Sperling 的部分报告法为什么能证明感觉记忆容量大于整体报告的结果？',
        options: [
          { text: '线索只在刺激消失后短暂延迟出现，被试仍能报告出指定行的多数项目', correct: true },
          { text: '被试在刺激呈现时就可以慢慢看，所以记得更多' },
          { text: '部分报告法让被试有更多时间复述' },
          { text: '它测量的是长时记忆而不是感觉记忆' }
        ],
        explain: '整体报告只能说出 4–5 项，是因为报告过程本身耗时、内容衰退；部分报告用音调线索只要求一行，仍能报出约 3 项，推算总容量约 9 项。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'tf', difficulty: 1, tags: ['capacity'],
        stem: '短时记忆的容量通常被估计为 7±2 个组块，而 Cowan 认为若不使用复述等策略，纯容量约为 4 个组块。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'Miller 的 7±2 包含了组块与复述的贡献；Cowan 回顾大量研究后主张核心容量约 4，两者差异来自测量条件与策略使用。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['wm'],
        stem: '下列哪一项是 Baddeley 工作记忆模型中「语音环路」的典型功能？',
        options: [
          { text: '暂存并复述言语信息，如默读电话号码', correct: true },
          { text: '暂存视觉空间信息，如记住路线' },
          { text: '整合来自各子系统的信息并分配注意' },
          { text: '把短时记忆永久转入长时记忆' }
        ],
        explain: '语音环路负责言语材料的短时保持与复述；视空间画板处理视觉空间信息；中央执行负责注意分配与协调；情景缓冲器负责多模态整合。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-1', tier: 2, type: 'fill', difficulty: 2, tags: ['iconic'],
        stem: '图像记忆（iconic memory）的持续时间通常估计为多少毫秒？填区间下限即可（如 250）。',
        answer: '250',
        accept: ['250', '250ms', '250 ms', '200'],
        explain: '图像记忆约在 250–500 ms 内迅速衰退；回声记忆稍长，约 2–4 秒。Sperling 的延迟线索范式正是利用这段短暂窗口。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'fill', difficulty: 1, tags: ['ltm'],
        stem: '把长时记忆区分为「情景记忆」与「语义记忆」的心理学家是谁？（填姓氏）',
        answer: 'Tulving',
        accept: ['Tulving', 'tulving', '图尔文', '塔尔文'],
        explain: 'Tulving 区分情景记忆（带时间地点背景的个人经历）与语义记忆（去背景化的事实知识），二者在脑损伤与成像中可分离。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'multi', difficulty: 2, tags: ['wm'],
        stem: 'Baddeley 工作记忆模型的成分包括：（多选）',
        options: [
          { text: '中央执行', correct: true },
          { text: '语音环路', correct: true },
          { text: '视空间画板', correct: true },
          { text: '程序性记忆', correct: true }
        ],
        explain: '四成分是中央执行、语音环路、视空间画板与情景缓冲器；程序性记忆属于长时记忆的非陈述性子系统，不在工作记忆模型内。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-6', tier: 3, type: 'mcq', difficulty: 3, tags: ['amnesia'],
        stem: '遗忘症病人 HM 能学会镜描任务却记不得自己练过，这一分离说明：',
        options: [
          { text: '内隐记忆与外显记忆依赖不同系统，可分离', correct: true },
          { text: '短时记忆的容量比长时记忆大' },
          { text: '所有记忆都依赖海马' },
          { text: '程序性学习必须依赖情景记忆' }
        ],
        explain: 'HM 的海马损伤破坏了外显的情景记忆，但基底节等系统支持的程序性学习保留，这是内隐/外显双系统分离的经典证据。'
      },

      /* ---------------- ch04 记忆的过程 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['encoding'],
        stem: '「编码特异性原则」（encoding specificity）的核心主张是：',
        options: [
          { text: '提取效果取决于编码时与提取时的情境线索是否匹配', correct: true },
          { text: '编码越深，任何情境下都记得越牢' },
          { text: '记忆一旦编码就固定不变' },
          { text: '情绪只影响编码，不影响提取' }
        ],
        explain: 'Tulving 与 Thomson 发现，与编码情境匹配的线索最有效，即使它与目标词的语义关联较弱；这解释了「当时记得、现在想不起」的现象。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'tf', difficulty: 1, tags: ['levels'],
        stem: '总体而言，对材料做语义层面的深加工比只做字形或语音层面的浅加工，回忆成绩更好。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '加工水平效应在多数实验中成立，但要注意迁移适当加工：如果测验考的是押韵，浅加工组反而可能更好。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['testing'],
        stem: 'Roediger 与 Karpicke 的「测验效应」实验说明：',
        options: [
          { text: '与反复阅读相比，提取练习在延迟测验中带来更好的保持', correct: true },
          { text: '反复阅读总能带来最好的长期记忆' },
          { text: '测验只测量记忆，不改变记忆' },
          { text: '学习时间越长，记忆一定越好' }
        ],
        explain: '提取练习（retrieval practice）在即时测验中优势不明显，但在延迟测验中显著优于重复阅读，因为它强化了提取路径而非熟悉感。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'fill', difficulty: 1, tags: ['forgetting'],
        stem: 'Ebbinghaus 的遗忘曲线显示，学习后最初一段时间遗忘最快；到一天后大约只记得多少比例？填分数（如 1/3）。',
        answer: '1/3',
        accept: ['1/3', '三分之一', '33%', '约1/3'],
        explain: '艾宾浩斯用无意义音节自测，发现 20 分钟后约保持六成、一天后约剩三分之一，之后曲线趋于平缓——先快后慢是遗忘的典型形态。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'fill', difficulty: 1, tags: ['eyewitness'],
        stem: '通过改变提问措辞（smashed vs hit）研究错误记忆与目击者证词的心理学家是谁？（填姓氏）',
        answer: 'Loftus',
        accept: ['Loftus', 'loftus', '洛夫特斯', '伊丽莎白·洛夫特斯'],
        explain: 'Loftus 与 Palmer 发现动词暗示会影响速度估计与后续的「碎玻璃」虚假记忆，说明记忆是可重构的，会被事后信息污染。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'multi', difficulty: 2, tags: ['study'],
        stem: '根据记忆研究，下列哪些做法有助于长期保持？（多选）',
        options: [
          { text: '把复习分散到多天，而不是一次学完', correct: true },
          { text: '用自测代替反复阅读', correct: true },
          { text: '在不同情境中练习，增加可提取的线索', correct: true },
          { text: '只在自己习惯的固定座位上学习，绝不换环境' }
        ],
        explain: '间隔、提取练习、多情境编码都能提升长期保持；固定单一线索会让记忆高度依赖环境，换考场就容易失效。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-5', tier: 3, type: 'mcq', difficulty: 2, tags: ['drm'],
        stem: 'DRM 范式（如「床、休息、醒来、做梦……」后回忆「睡觉」）主要用来研究：',
        options: [
          { text: '基于语义关联的虚假记忆与错误再认', correct: true },
          { text: '感觉记忆的容量' },
          { text: '程序性技能的学习曲线' },
          { text: '工作记忆的语音相似性效应' }
        ],
        explain: 'DRM 利用词表的语义关联诱发关键词的虚假回忆/再认，说明提取依赖语义网络，激活扩散会把未呈现的词「填」进记忆。'
      },

      /* ---------------- ch05 知识表征 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['imagery'],
        stem: 'Shepard 与 Metzler 的心理旋转实验中，判断两个图形是否相同所需时间：',
        options: [
          { text: '随旋转角度增大而线性增加', correct: true },
          { text: '与旋转角度无关' },
          { text: '随旋转角度增大而减少' },
          { text: '只在 180 度时突然变长' }
        ],
        explain: '反应时随角度线性上升（约每 60 度数十毫秒），被解释为「在脑中连续转动」的类比表征证据；但也有批评认为被试可能在使用策略。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'tf', difficulty: 2, tags: ['debate'],
        stem: '表象是「图画式」还是「命题式」的争论，目前已经由脑成像研究彻底解决。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '成像显示早期视区在表象时激活，支持「图画式」成分；但命题式支持者指出模拟结果可被命题网络复现，争论至今未彻底解决。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concepts'],
        stem: 'Rosch 的原型理论认为，概念的表征核心是：',
        options: [
          { text: '该范畴中最典型、最具代表性的成员或抽象原型', correct: true },
          { text: '一组充要的定义特征' },
          { text: '所有曾见过的样例的完整清单' },
          { text: '与该概念相关的所有情绪反应' }
        ],
        explain: '原型理论用典型性梯度解释「麻雀比企鹅更像鸟」；定义观要求充要特征，难以解释边界模糊；样例观则主张存储具体实例。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'fill', difficulty: 2, tags: ['semantic'],
        stem: 'Collins 与 Quillian 的层级语义网络模型预测：两个概念在层级中的距离越远，判断「是/否」的反应时越长。这一现象称为 ______ 效应。（填「距离」或「层级距离」）',
        answer: '距离',
        accept: ['距离', '层级距离', 'distance', '层级'],
        explain: '层级距离效应支持「沿网络搜索」的模型：经过的节点越多，验证越慢；但典型性、联想强度等因素也会影响判断，后续模型因此加入扩散激活。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'fill', difficulty: 2, tags: ['embodied'],
        stem: '有些人完全无法在脑中「看见」画面，这种状况的英文术语是 ______。',
        answer: 'aphantasia',
        accept: ['aphantasia', 'Aphantasia', '心盲症'],
        explain: '心盲症者缺乏自主视觉表象，但视觉知觉、再认与空间能力可以正常，说明表象与知觉既共享又部分分离。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'multi', difficulty: 2, tags: ['concepts'],
        stem: '关于概念结构的理论，下列说法正确的有：（多选）',
        options: [
          { text: '定义观主张概念由充要特征界定', correct: true },
          { text: '原型观能解释典型性梯度', correct: true },
          { text: '样例观主张概念由具体实例的记忆构成', correct: true },
          { text: '理论说认为概念与背景知识完全无关' }
        ],
        explain: '理论说恰恰强调概念嵌入直觉理论（如「为什么会飞」），与背景知识密不可分；前三项分别是定义观、原型观、样例观的核心主张。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-5', tier: 3, type: 'mcq', difficulty: 2, tags: ['schema'],
        stem: '图式（schema）对认知的主要好处与风险分别是：',
        options: [
          { text: '加快理解与补全缺失信息；但会系统性地扭曲与图式不符的细节', correct: true },
          { text: '增加记忆容量；但会降低阅读速度' },
          { text: '提高创造力；但会削弱语言能力' },
          { text: '只带来好处，没有可测的代价' }
        ],
        explain: '图式让加工变快、允许自上而下补全，但 Bartlett 的「幽灵之战」显示它会平化、锐化、同化细节，产生可预测的系统性错误。'
      },

      /* ---------------- ch06 语言 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'mcq', difficulty: 2, tags: ['parsing'],
        stem: '「The horse raced past the barn fell」为什么是花园路径句？',
        options: [
          { text: '读者先把 raced 解析为主动词，读到 fell 才发现它其实是修饰 horse 的分词', correct: true },
          { text: '句子语法错误，无法解析' },
          { text: '句中每个词都是生僻词' },
          { text: '它缺少主语，必须靠语境补全' }
        ],
        explain: '花园路径句的特点是初始解析被后文推翻、需要重分析；重分析带来阅读时间上升与回视，是研究解析策略的经典材料。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'tf', difficulty: 1, tags: ['erp'],
        stem: 'N400 主要对句法违反敏感，P600 主要对语义违反敏感。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '恰好相反：N400 对语义违反/低预期词更敏感，P600 对句法违反与重分析更敏感。两者也并非绝对分离，可同时出现。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['learning'],
        stem: 'Saffran 等人的婴儿统计学习实验说明：',
        options: [
          { text: '婴儿能从音节间的转移概率切分出「词」的边界', correct: true },
          { text: '婴儿天生掌握全部句法规则' },
          { text: '语言习得完全依赖成人 explicit 教学' },
          { text: '婴儿只能记住出现过的整句，不能抽取结构' }
        ],
        explain: '在连续音节流中，词内转移概率高、词间低；婴儿听后对「词」与「非词」反应不同，说明他们利用了概率结构，无需语义提示。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'fill', difficulty: 1, tags: ['phoneme'],
        stem: '英语大约有多少个音素？（填数字）',
        answer: '44',
        accept: ['44', '约44', '四十四个'],
        explain: '英语常被估计为约 44 个音素（不同口音略有差异）；音素是最小的能区别意义的语音单位，如 /p/ 与 /b/。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'fill', difficulty: 2, tags: ['erp'],
        stem: 'P600 成分大约在刺激呈现后多少毫秒达到峰值？（只填数字）',
        answer: '600',
        accept: ['600', '600ms', '600 ms', '约600'],
        explain: 'P600 在约 600 ms 达到正波峰值，常被解释为句法重分析或修复的成本；N400 则约在 400 ms 达峰。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-1', tier: 2, type: 'multi', difficulty: 2, tags: ['levels'],
        stem: '语言的层级包括下列哪些？（多选）',
        options: [
          { text: '音素', correct: true },
          { text: '词素', correct: true },
          { text: '句法', correct: true },
          { text: '视网膜拓扑映射' }
        ],
        explain: '语言层级为音素→词素→词/短语→句法→语义→语用；视网膜拓扑映射是视觉系统的空间组织，与语言层级无关。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-2', tier: 3, type: 'mcq', difficulty: 2, tags: ['mcgurk'],
        stem: 'McGurk 效应说明：',
        options: [
          { text: '言语知觉会把视觉（唇形）与听觉信息整合，产生第三个音', correct: true },
          { text: '人只听声音，不看口型' },
          { text: '视觉信息只在噪声中起作用' },
          { text: '语音识别完全由字形决定' }
        ],
        explain: '给 /ba/ 的唇形配 /ga/ 的声音，被试报告听到 /da/；这说明言语知觉是多通道整合，而不是单纯的听觉转录。'
      },

      /* ---------------- ch07 思维与决策 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['problem'],
        stem: 'Duncker 的蜡烛问题中，被试难以想到把图钉盒当作烛台，这体现了：',
        options: [
          { text: '功能固着', correct: true },
          { text: '手段—目的分析' },
          { text: '基础比率忽视' },
          { text: '结构启动' }
        ],
        explain: '功能固着指只看到物体的常规用途，难以把它重新归类为「可用的支架」；破解常需要重新表征物体属性。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'tf', difficulty: 2, tags: ['heuristic'],
        stem: '合取谬误主要来自可得性启发式，因为「银行出纳员且女权主义者」更容易被想起来。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '合取谬误来自代表性启发式：合取描述「更像」Linda 的典型形象，于是被误判为概率更高；可得性解释的是频率估计偏差。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'mcq', difficulty: 3, tags: ['wason'],
        stem: 'Wason 选择任务中，规则为「若卡片一面是元音，则另一面是偶数」。要检验这条规则，必须翻哪两张？',
        options: [
          { text: '元音卡与非偶数卡', correct: true },
          { text: '元音卡与偶数卡' },
          { text: '辅音卡与偶数卡' },
          { text: '四张都要翻' }
        ],
        explain: '规则的形式是 P→Q，唯一能推翻它的是 P 且非 Q，所以查「元音」与「非偶数」；翻偶数卡只能找到支持证据，无法证伪。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'fill', difficulty: 2, tags: ['probability'],
        stem: '某病患病率 1%，检测对病人全部阳性，对健康人有 5% 假阳性。某人检测阳性，他真正患病的概率约为多少？（填百分数，如 17%）',
        answer: '17%',
        accept: ['17%', '17', '约17%', '16.7%', '1/6'],
        explain: '1000 人中约 10 人患病且全为阳性，另有约 50 名健康人假阳性；10/(10+50)≈17%。忽略基础比率就会错答成「95%」。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'fill', difficulty: 1, tags: ['expertise'],
        stem: 'Ericsson 提出的「十年法则」常被通俗表述为需要多少小时的刻意练习？（填数字，以小时计）',
        answer: '10000',
        accept: ['10000', '一万', '1万', '10,000'],
        explain: '约一万小时是达到国际级水平的粗略估算，强调刻意练习的必要性，但不是「练够就一定成大师」的保证。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'multi', difficulty: 2, tags: ['heuristic'],
        stem: 'Tversky 与 Kahneman 研究的三类代表性启发式包括：（多选）',
        options: [
          { text: '可得性', correct: true },
          { text: '代表性', correct: true },
          { text: '锚定与调整', correct: true },
          { text: '语音环路' }
        ],
        explain: '三类启发式分别是可得性（用提取难易代替频率）、代表性（用相似度代替概率）、锚定与调整（起点决定估计）；语音环路属于工作记忆。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-7', tier: 3, type: 'mcq', difficulty: 3, tags: ['rationality'],
        stem: '「生态理性」（ecological rationality）的核心主张是：',
        options: [
          { text: '启发式的好坏取决于它与环境结构的匹配程度', correct: true },
          { text: '所有启发式都是非理性的，应当完全弃用' },
          { text: '理性就是逻辑考试得满分' },
          { text: '人永远不会犯系统性错误' }
        ],
        explain: '生态理性认为简单规则在匹配的环境中可以是高效的（如再认启发式）；偏差研究与生态理性互补，一个说何时会错，一个说为何通常够用。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
