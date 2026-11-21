/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；每章 q1–q7 与 chXX.js 内嵌题一致
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '心理学作为一门科学，其核心目标通常被概括为哪一组？',
        options: [
          { text: '描述、解释、预测与干预', correct: true },
          { text: '只描述现象，不作解释' },
          { text: '只做诊断与治疗' },
          { text: '只收集问卷数据' }
        ],
        explain: '现代心理学把目标分成四层：先<b>描述</b>现象（发生了什么），再<b>解释</b>机制（为什么发生），进而<b>预测</b>（在什么条件下会发生），最后<b>干预</b>（怎样改变它）。只描述不解释，就退回到哲学思辨。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '本站八个章节的排列，大致遵循哪条线索？',
        options: [
          { text: '从研究方法的底层，到生物基础，再到认知与社会应用', correct: true },
          { text: '按教材页码从后往前' },
          { text: '按作者姓氏字母顺序' },
          { text: '随机排列，没有先后关系' }
        ],
        explain: '先讲「怎样才算证据」（ch01），再讲硬件（ch02 生物基础），然后是感觉、学习、思维这些信息加工过程（ch03–ch05），最后是动机情绪人格与社会、异常（ch06–ch07）。前面的概念会在后面反复被调用。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'tf', difficulty: 1, tags: ['method'],
        stem: '只要有一个生动的个案，就足以证明某种干预具有因果效果。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '个案能提供线索与假设，但无法排除安慰剂效应、自然恢复与选择偏差。要证明因果，需要设置对照、随机分配并控制混淆变量——这正是 ch01 的核心内容。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '在四类常见证据中，哪一类最有力地支持「X 导致 Y」？',
        options: [
          { text: '随机对照实验', correct: true },
          { text: '横断相关研究' },
          { text: '单个临床个案' },
          { text: '专家个人意见' }
        ],
        explain: '随机分配让两组在已知与未知的第三变量上平均可比，因此结果的差异更可能来自操纵。相关研究只能说明共变，个案无法排除混淆，专家意见只是论证的一种，不是证据。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'fill', difficulty: 1, tags: ['statistics'],
        stem: '把多项独立研究的效应量合并起来、给出总体估计的统计方法叫____（填中文术语）。',
        answer: '元分析',
        accept: ['元分析', 'meta分析', 'meta-analysis', '荟萃分析'],
        explain: '元分析（meta-analysis）把同一问题的多项研究转成统一的效应量再加权合并，既能提高精度，也能检验调节变量。它是判断「某干预总体是否有效」的主要工具，但要警惕发表偏倚。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'multi', difficulty: 2, tags: ['method'],
        stem: '关于本站的用法，下列哪些做法是有效的？（多选）',
        options: [
          { text: '先读课程地图，再按周推进各章', correct: true },
          { text: '每读完一节，立刻做内嵌 quiz 检验理解', correct: true },
          { text: '只看术语表，跳过正文与表格' },
          { text: '用每章结尾的 checklist 逐条自查', correct: true }
        ],
        explain: '术语表是索引，不是内容——脱离正文背术语，遇到情境题仍然无从下手。有效顺序是：先建立地图，再按节读，读后立即检索（内嵌 quiz），最后用 checklist 查漏。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '本课程使用的主教材是？',
        options: [
          { text: 'Gleitman《Psychology》第 8 版', correct: true },
          { text: 'Myers《Psychology》第 12 版' },
          { text: 'Schacter《Psychology》第 4 版' },
          { text: 'Kandel《Principles of Neural Science》' }
        ],
        explain: '本站依据 Gleitman《Psychology》（第 8 版，Gross 与 Reisberg 合著）的主题顺序组织，资料库中提供该教材 PDF。其它几本都是优秀的心理学教材，但章节编号与本书不同，不要混用页码。'
      },

      /* ---------------- ch01 心理学作为科学 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['history'],
        stem: '心理学通常被认为在 1879 年成为独立学科，标志性事件是？',
        options: [
          { text: '冯特在莱比锡建立第一个心理学实验室', correct: true },
          { text: '弗洛伊德出版《梦的解析》' },
          { text: '华生发表行为主义宣言' },
          { text: '皮亚杰提出认知发展阶段' }
        ],
        explain: '1879 年冯特（Wilhelm Wundt）在莱比锡建立实验室，把心理现象放在可控条件下测量，这是「用实验研究心智」的制度起点。弗洛伊德与华生分别代表后来的精神分析与行为主义转向。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '下列哪种说法最符合「可证伪的假设」？',
        options: [
          { text: '若理论为真，则在 X 条件下应观察到 Y；观察不到 Y 就说明理论有问题', correct: true },
          { text: '无论结果如何，理论都能解释，所以理论总是成立' },
          { text: '只要多数专家同意，理论就不需要检验' },
          { text: '理论越难被理解，说明它越深刻' }
        ],
        explain: '可证伪性要求理论先给出「什么情况下我错了」的明确预期。一个能解释一切结果的理论，实际上排除了任何反例，因而没有经验内容——这是波普尔对精神分析式理论的经典批评。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'tf', difficulty: 1, tags: ['method'],
        stem: '随机分配的主要作用，是让实验组与对照组在已知和未知的第三变量上平均可比。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '随机分配不保证两组在某个具体变量上完全相等，但它在概率意义上让所有变量（包括研究者没想到的）趋于平衡。这是实验能支持因果推断的关键，也是它与准实验的分界线。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['statistics'],
        stem: '一项研究得到 r = −0.6 的相关，最恰当的解读是？',
        options: [
          { text: '两变量中等偏强的负相关，但不能据此断定因果方向', correct: true },
          { text: '两变量之间没有关系' },
          { text: '第一个变量导致第二个变量下降 60%' },
          { text: '相关为负说明数据算错了' }
        ],
        explain: 'r = −0.6 表示一个变量升高时另一个倾向下降，属于中等偏强。但相关无法排除反向因果与第三变量（例如「冰淇淋销量与溺水人数」由气温共同驱动）。要谈因果，仍须实验或更强的设计。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'fill', difficulty: 1, tags: ['measurement'],
        stem: '同一份量表在不同时间重复测量，结果保持一致，反映的是____（填两个字）。',
        answer: '信度',
        accept: ['信度', '可靠性', 'reliability'],
        explain: '信度（reliability）关心「测得稳不稳」，效度（validity）关心「测得准不准」。一把每次都读出同一数值但系统性偏大的体重秤，信度高而效度低——两者必须分开评估。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'multi', difficulty: 2, tags: ['statistics'],
        stem: '关于 p 值、置信区间与效应量，下列哪些说法正确？（多选）',
        options: [
          { text: 'p 值很小并不等于效应很大', correct: true },
          { text: '置信区间同时给出估计值与精度', correct: true },
          { text: 'p 值表示原假设为真的概率' },
          { text: '效应量受样本量的影响比 p 值小得多', correct: true }
        ],
        explain: 'p 值是在原假设为真时得到当前或更极端结果的概率，不是「原假设为真的概率」。样本足够大时，微不足道的差异也能得到很小的 p 值，所以必须同时报告效应量与置信区间。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['method'],
        stem: '「重复性危机」最直接指向下列哪种现象？',
        options: [
          { text: '多项已发表的重要结果在独立重复实验中效应缩小或不再显著', correct: true },
          { text: '所有心理学实验都无法重复' },
          { text: '统计软件存在系统性计算错误' },
          { text: '被试不愿意参加实验' }
        ],
        explain: '大规模重复项目发现，许多效应在重复后变小甚至消失，原因包括发表偏倚、p 值操纵、样本过小与研究者自由度。应对办法是预注册、开放数据与直接重复——而不是宣布「心理学不科学」。'
      },

      /* ---------------- ch02 生物基础 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['neuron'],
        stem: '动作电位发生时，轴突膜内电位变化的主要原因是？',
        options: [
          { text: '钠离子内流导致去极化', correct: true },
          { text: '钾离子内流导致超极化' },
          { text: '氯离子外流导致静息电位升高' },
          { text: '钙离子外流使膜电位归零' }
        ],
        explain: '静息时膜内约为 −70 mV；达到阈值后电压门控钠通道打开，Na<sup>+</sup> 大量内流使膜内变正（去极化），随后 K<sup>+</sup> 外流复极化。动作电位是「全或无」的，强度靠放电频率编码。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['pharmacology'],
        stem: '某种药物与多巴胺受体结合但不激活它，还阻止多巴胺结合。它属于？',
        options: [
          { text: '拮抗剂（antagonist）', correct: true },
          { text: '激动剂（agonist）' },
          { text: '再摄取抑制剂' },
          { text: '受体上调剂' }
        ],
        explain: '激动剂模拟递质、增强信号；拮抗剂占据受体但不激活，从而阻断递质作用。注意区分「阻断受体」与「阻断再摄取」：前者直接减少信号，后者通过延长递质在突触间隙的停留时间增强信号。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'tf', difficulty: 1, tags: ['nervous'],
        stem: '对多数内脏器官而言，交感神经与副交感神经的作用方向相反。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '交感负责「动员」（心率加快、瞳孔放大、消化抑制），副交感负责「休息与消化」（心率减慢、消化增强）。两者对同一器官常呈拮抗关系，这种双重支配让身体能快速在两个模式间切换。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['brain'],
        stem: '视觉信息首先投射到大脑皮层的哪个叶？',
        options: [
          { text: '枕叶', correct: true },
          { text: '颞叶' },
          { text: '顶叶' },
          { text: '额叶' }
        ],
        explain: '枕叶是初级视皮层所在；颞叶处理听觉与部分物体识别（「是什么」通路），顶叶处理空间与躯体感觉（「在哪里」通路），额叶负责运动、计划与执行控制。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'fill', difficulty: 1, tags: ['method'],
        stem: '通过测量血氧水平依赖信号间接反映脑活动的成像技术是____（填缩写）。',
        answer: 'fMRI',
        accept: ['fMRI', 'fmri', '功能性磁共振成像', '功能磁共振成像'],
        explain: 'fMRI 测量的是血氧水平依赖（BOLD）信号，时间分辨率约秒级、空间分辨率较高，但它是间接指标——「某区域激活」不等于「该区域负责该功能」，必须结合损伤研究、电生理与实验设计做反向推理。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'multi', difficulty: 2, tags: ['plasticity'],
        stem: '关于脑的可塑性与分裂脑研究，下列哪些说法正确？（多选）',
        options: [
          { text: '儿童期一侧半球切除后，语言功能可部分重组到另一侧', correct: true },
          { text: '胼胝体切断者可能表现出两半球各自独立加工', correct: true },
          { text: '「人只用了大脑的 10%」是流传已久的误传', correct: true },
          { text: '关键期之后，大脑完全不能再发生任何改变' }
        ],
        explain: '可塑性在发育期最强，但成年后仍持续存在（学习、康复都会改变连接）。分裂脑研究通过向一侧视野短暂呈现刺激，揭示了两半球在语言与空间任务上的分工，是「功能偏侧化」最干净的证据之一。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['genetics'],
        stem: '某特质在特定群体中的遗传率为 0.6，正确解读是？',
        options: [
          { text: '在该群体、该环境范围内，表型差异约 60% 与遗传差异相关', correct: true },
          { text: '每个个体的该特质有 60% 来自遗传' },
          { text: '该特质在人群中 60% 是天生、40% 是后天' },
          { text: '遗传率 0.6 说明环境几乎没有作用' }
        ],
        explain: '遗传率是群体层面的统计量，描述的是「变异中有多少可归因于遗传变异」，不能拆到个体身上，也依赖于所研究的环境范围。环境差异变大时，遗传率会下降——这正是它常被误读的地方。'
      },

      /* ---------------- ch03 感觉与知觉 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['sensation'],
        stem: '「转导」（transduction）指的是？',
        options: [
          { text: '把光、声、压力等物理能量转换为神经信号', correct: true },
          { text: '把神经信号转换为肌肉收缩' },
          { text: '大脑对感觉信息的意义解释' },
          { text: '感觉器官对刺激的适应' }
        ],
        explain: '转导发生在感受器：光感受器把光子转为电信号，毛细胞把机械振动转为电信号。这一步是「感觉」；而赋予意义、组织成对象属于「知觉」，两者是连续但可区分的阶段。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['vision'],
        stem: '在昏暗环境中主要起作用、对光高度敏感但没有颜色分辨能力的受体是？',
        options: [
          { text: '视杆细胞', correct: true },
          { text: '视锥细胞' },
          { text: '双极细胞' },
          { text: '水平细胞' }
        ],
        explain: '视杆细胞数量多、敏感度高、集中在视网膜周边，负责暗视；视锥细胞集中在中央凹，负责明视与颜色。这解释了为什么夜间看暗处的东西「用余光更清楚」。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'tf', difficulty: 1, tags: ['vision'],
        stem: '相对大小与纹理梯度属于双眼深度线索。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '相对大小、纹理梯度、遮挡、线性透视、空气透视都是<b>单眼</b>线索，一张照片就能提供。双眼线索只有两种：视网膜像差（立体视）与辐合。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['audition'],
        stem: '声音的音高（pitch）主要由什么物理量决定？',
        options: [
          { text: '频率', correct: true },
          { text: '振幅' },
          { text: '波形复杂度' },
          { text: '声源距离' }
        ],
        explain: '频率决定音高（人耳约 20–20000 Hz），振幅决定响度（以分贝表示），波形复杂度决定音色。基底膜不同位置对不同频率响应最强，这是「位置编码」的基础。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'fill', difficulty: 1, tags: ['organization'],
        stem: '把离散的感觉元素组织成整体对象的一组知觉原则，统称为____原则（填三个字）。',
        answer: '格式塔',
        accept: ['格式塔', '格式塔原则', 'Gestalt', 'gestalt'],
        explain: '格式塔原则包括接近、相似、连续、闭合、共同命运等，核心主张是「整体大于部分之和」：知觉不是把碎片加总，而是按规则主动组织。它也是自上而下加工的早期证据。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'multi', difficulty: 2, tags: ['attention'],
        stem: '下列哪些现象说明注意具有选择性？（多选）',
        options: [
          { text: '非注意盲视：专注计数时没看到穿过画面的大猩猩', correct: true },
          { text: '变化盲视：画面切换后未察觉明显变化', correct: true },
          { text: '鸡尾酒会效应：在嘈杂中听到自己的名字', correct: true },
          { text: '所有进入视野的刺激都被同等深度加工' }
        ],
        explain: '注意是有限资源，选择性意味着「加工一部分、放弃一部分」。非注意盲视与变化盲视说明未被注意的信息可能根本没进入意识；鸡尾酒会效应则说明未被注意的通道仍有浅层监控。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['illusion'],
        stem: '缪勒-莱尔错觉（两条等长线段因箭头方向显得不等）最能说明？',
        options: [
          { text: '知觉是对线索的主动推断，而不是对刺激的逐点复制', correct: true },
          { text: '人的视觉系统存在随机误差' },
          { text: '长度判断完全由文化决定' },
          { text: '错觉证明感觉信息不可靠，应被忽略' }
        ],
        explain: '这类错觉来自视觉系统对深度与透视线索的自动推断：箭头方向被当作「远离/靠近」的信号，长度因此被「校正」。错觉不是系统故障，而是正常推断机制在特定输入下的副产品。'
      },

      /* ---------------- ch04 学习与记忆 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['conditioning'],
        stem: '巴甫洛夫的狗在多次「铃声—食物」配对后，听到铃声就分泌唾液。此时铃声是？',
        options: [
          { text: '条件刺激（CS）', correct: true },
          { text: '无条件刺激（US）' },
          { text: '无条件反应（UR）' },
          { text: '条件反应（CR）' }
        ],
        explain: '食物是 US，唾液对食物的反应是 UR；铃声原本中性，与 US 反复配对后成为 CS，由它引发的唾液是 CR。经典条件作用的关键是「预测性」——CS 必须能预测 US 的出现。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['reinforcement'],
        stem: '「负强化」指的是？',
        options: [
          { text: '移除厌恶刺激，从而增加行为出现的概率', correct: true },
          { text: '施加厌恶刺激，从而减少行为', correct: false },
          { text: '撤销奖励，使行为消退' },
          { text: '给予惩罚，使行为减少' }
        ],
        explain: '强化一律<b>增加</b>行为：正强化是「给好东西」，负强化是「撤掉坏东西」（如服止痛药缓解头痛）。惩罚一律<b>减少</b>行为。日常语言里「负强化」常被误当惩罚，这是最常见的混淆点。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'tf', difficulty: 1, tags: ['memory'],
        stem: '感觉记忆的保持时间极短、容量很大，但若不注意就会迅速消退。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '感觉记忆（图像记忆约数百毫秒、声像记忆约数秒）容量近乎无限但极短暂，注意是把信息送入短时/工作记忆的门槛。工作记忆容量则很有限（约 4 个组块），两者常被混为一谈。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['encoding'],
        stem: '「加工水平效应」说明下列哪种编码方式通常记得最好？',
        options: [
          { text: '语义加工（关注意义）', correct: true },
          { text: '字形加工（关注字母形状）' },
          { text: '语音加工（关注读音）' },
          { text: '位置加工（关注词在页面上的位置）' }
        ],
        explain: '克雷克与洛克哈特发现，越深的意义加工留下越多的提取线索，回忆成绩越好。这直接支撑了「精细复述优于机械复述」的学习建议：把新知识与已有知识连起来，比反复念更有效。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'fill', difficulty: 1, tags: ['forgetting'],
        stem: '先学习的材料干扰后学习材料的回忆，这种干扰叫____（填四个字）。',
        answer: '前摄抑制',
        accept: ['前摄抑制', '前摄干扰', 'proactive interference', 'proactive inhibition'],
        explain: '前摄抑制是「旧干扰新」（学法语后学西班牙语，法语词总冒出来）；倒摄抑制是「新干扰旧」（学完新内容后回忆旧内容变差）。两者都说明遗忘常是提取竞争，而不是痕迹消失。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'multi', difficulty: 2, tags: ['memory'],
        stem: '关于记忆的重构性，下列哪些说法正确？（多选）',
        options: [
          { text: '事后诱导性提问可以改变目击者对细节的报告', correct: true },
          { text: '「闪光灯记忆」也会随时间失真，只是主观确信度高', correct: true },
          { text: '被压抑的童年记忆一旦恢复就必然准确' },
          { text: '实验室中可以通过暗示植入从未发生的记忆', correct: true }
        ],
        explain: '记忆是重建而非回放：提取时会用图式与事后信息填补空白。罗夫特斯的误导信息范式与「丢失在商场」植入研究都表明，主观生动与客观准确并不一致，这正是目击证词需要程序保障的原因。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['learning'],
        stem: '在同等时间内，下列哪种学习策略获得的证据支持最强？',
        options: [
          { text: '检索练习（自我测验）', correct: true },
          { text: '反复阅读教材划线' },
          { text: '集中突击（考前一夜）' },
          { text: '按教材顺序抄写笔记' }
        ],
        explain: '测试效应（retrieval practice）与间隔效应是学习科学中重复验证最稳的两条结论；反复阅读带来「熟悉感」，容易被误当成掌握。交错练习与生成也有支持，但效应大小依赖材料与实施方式。'
      },

      /* ---------------- ch05 思维、语言与智力 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '按照原型理论，判断「麻雀是不是鸟」最快，主要因为？',
        options: [
          { text: '麻雀与「鸟」的原型表征相似度高', correct: true },
          { text: '麻雀的定义特征比企鹅少' },
          { text: '麻雀的类别成员资格是随机的' },
          { text: '所有成员在类别中的地位完全相同' }
        ],
        explain: '原型理论认为类别以「最典型的样例」表征，判断依据是与原型的相似度，因此出现典型性梯度：麻雀比企鹅更快被认作鸟。这与「定义特征」模型（所有成员地位相等）形成对照。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['judgment'],
        stem: '球拍与球共 1.10 美元，球拍比球贵 1.00 美元。球多少钱？',
        options: [
          { text: '0.05 美元', correct: true },
          { text: '0.10 美元' },
          { text: '1.00 美元' },
          { text: '0.55 美元' }
        ],
        explain: '设球价为 x，则球拍为 x + 1，x + (x + 1) = 1.10，得 x = 0.05。多数人脱口而出 0.10，这是直觉系统给出了看似合理却未验算的答案——也是「双系统」理论最常用的演示。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'tf', difficulty: 1, tags: ['problem'],
        stem: '功能固着指人只能看到物体的常规用途，因而难以想到新解法。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '邓克蜡烛问题的经典结果：被试难以把图钉盒当作支架，因为「盒子装图钉」的常规功能压过了新用途。与之相关的是心理定势（先前的解法惯性），两者都阻碍创造性问题解决。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['language'],
        stem: '语言中最小的、能承载意义的单位是？',
        options: [
          { text: '语素（morpheme）', correct: true },
          { text: '音位（phoneme）' },
          { text: '词（word）' },
          { text: '句法（syntax）' }
        ],
        explain: '音位是最小的<b>区别意义</b>的声音单位（本身无意义），语素是最小的<b>音义结合</b>单位，词由一个或多个语素构成。语言层级因此是：音位 → 语素 → 词 → 短语 → 句子。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'fill', difficulty: 1, tags: ['development'],
        stem: '儿童在特定年龄窗口内学习语言更容易，错过窗口后语法学习明显更困难，这一现象支持语言获得的____假说（填三个字）。',
        answer: '关键期',
        accept: ['关键期', '关键期假说', 'critical period'],
        explain: '关键期证据包括：失聪者晚期才接触手语时语法掌握较差、童年期被剥夺语言接触的个案、以及第二语言的发音与语法习得随年龄下降。需要注意，词汇学习并不存在硬性关键期，语法更明显。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'multi', difficulty: 2, tags: ['intelligence'],
        stem: '关于智力测验，下列哪些说法正确？（多选）',
        options: [
          { text: '不同认知测验之间的正相关可概括为一般智力因素 g', correct: true },
          { text: '现代 IQ 分数经年龄常模标准化，均值定为 100', correct: true },
          { text: '弗林效应指 IQ 分数在代际间持续上升', correct: true },
          { text: '单一 IQ 分数能完全预测个人的职业成就' }
        ],
        explain: 'g 是因素分析的统计结果，解释各测验的共同变异；IQ 是常模化分数，100 为同龄均值、标准差约 15；弗林效应提示环境对智力表现有巨大影响。但 IQ 只解释成就变异的一部分，动机、机会与人格同样重要。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['intervention'],
        stem: '关于「成长型思维」干预的大规模重复研究，最准确的概括是？',
        options: [
          { text: '平均效应很小，且高度依赖实施情境与学生群体', correct: true },
          { text: '效应巨大，可替代所有教学改革' },
          { text: '完全没有效应，因此思维模式不重要' },
          { text: '效应只存在于实验室，无法在学校实施' }
        ],
        explain: '早期小样本研究给出的效应偏大，大规模预注册实验得到的效应明显更小，且集中在资源不足或风险较高的学生群体。稳妥结论是：信念有影响，但不是万能钥匙，更不能替代结构性支持。'
      },

      /* ---------------- ch06 动机、情绪与人格 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['motivation'],
        stem: '耶克斯-多德森定律描述的是？',
        options: [
          { text: '唤醒水平与作业成绩呈倒 U 形关系，中等唤醒通常最佳', correct: true },
          { text: '动机越强，成绩一定越好' },
          { text: '唤醒水平与成绩无关' },
          { text: '只有内在动机才能提升成绩' }
        ],
        explain: '倒 U 形曲线来自驱力理论：唤醒过低缺乏投入，过高则引入焦虑与分心。最优唤醒水平取决于任务难度——简单任务偏高的唤醒有利，复杂任务偏低的唤醒有利。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['motivation'],
        stem: '「过度理由效应」指的是？',
        options: [
          { text: '外在奖励可能削弱原本由内在兴趣驱动的行为', correct: true },
          { text: '奖励越多，任何行为的动机都越强' },
          { text: '人总会为行为寻找过多理由' },
          { text: '内在动机与外在动机永远不能共存' }
        ],
        explain: '德西等人的实验显示，给本来有趣的活动加上物质奖励，撤掉奖励后行为频率下降——因为归因从「我喜欢」变成了「我为钱做」。但奖励并非总是有害：对本来无兴趣的任务，适当奖励可以建立行为习惯。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'tf', difficulty: 1, tags: ['goals'],
        stem: '目标设置理论认为，具体且有适当难度的目标通常比「尽力而为」更能提升表现。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '洛克的目标设置理论强调三个条件：目标具体、有难度但可达、并有反馈。模糊的「尽力而为」缺少可比较的标准，难以调动持续努力。这也是「SMART 目标」背后的研究基础。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['emotion'],
        stem: '詹姆斯-兰格理论认为情绪体验主要来自？',
        options: [
          { text: '对身体反应（如心跳、肌肉紧张）的知觉', correct: true },
          { text: '对刺激的认知评价' },
          { text: '丘脑同时向皮层与身体发出信号' },
          { text: '面部肌肉的纯机械反馈' }
        ],
        explain: '詹姆斯-兰格：「我们因为发抖而害怕，因为流泪而悲伤」——身体反应在先，情绪体验是对它的知觉。坎农-巴德强调丘脑同时触发身体与体验，沙赫特-辛格则加入认知标签，三者构成经典的理论序列。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'fill', difficulty: 1, tags: ['emotion'],
        stem: '面部反馈假说认为，做出某种面部表情可以____相应的情绪体验（填两个字）。',
        answer: '调节',
        accept: ['调节', '影响', '改变', '增强', '引发'],
        explain: '经典实验让被试咬住笔（阻止微笑）或含住笔（促成微笑）评价漫画，后者评分更高。但 2016 年后的多项重复研究未能稳定复现效应，因此稳妥表述是「可能有小幅调节作用」，而非「表情决定情绪」。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'multi', difficulty: 2, tags: ['personality'],
        stem: '「大五」人格模型包含下列哪些维度？（多选）',
        options: [
          { text: '开放性（openness）', correct: true },
          { text: '尽责性（conscientiousness）', correct: true },
          { text: '外向性（extraversion）', correct: true },
          { text: '智力（intelligence）' }
        ],
        explain: '大五是开放性、尽责性、外向性、宜人性、神经质（OCEAN）。智力属于能力测验范畴，不是人格维度——尽管它与开放性有中等相关，混为一谈是常见错误。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['personality'],
        stem: '关于「人-情境之争」，当代人格心理学的共识更接近？',
        options: [
          { text: '行为由人格与情境交互决定，特质在聚合多个情境后预测力更好', correct: true },
          { text: '人格特质几乎不能预测任何行为' },
          { text: '情境完全决定行为，人格只是错觉' },
          { text: '人格决定一切，情境可以忽略' }
        ],
        explain: '米歇尔的批评指出单一情境中行为的跨情境一致性很低（约 0.3），但聚合多个情境或多次观察后，特质的预测力显著上升。当代观点是「交互作用」：特质描述行为的平均倾向，情境决定此刻的表现。'
      },

      /* ---------------- ch07 社会心理与心理健康 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['social'],
        stem: '费斯廷格与卡尔史密斯的「1 美元 / 20 美元」实验中，哪一组更认为枯燥任务有趣？',
        options: [
          { text: '拿 1 美元的组', correct: true },
          { text: '拿 20 美元的组' },
          { text: '两组完全相同' },
          { text: '没有撒谎的对照组' }
        ],
        explain: '20 美元足以解释「我为什么撒谎」，不产生失调；1 美元理由不足，被试只能通过改变态度（「任务其实挺有趣」）来消解冲突。这是认知失调最经典的演示，也是「小步承诺」技术的实验基础。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['conformity'],
        stem: '在阿希线段判断实验中，什么最能降低从众率？',
        options: [
          { text: '出现一个说出正确答案的「盟友」', correct: true },
          { text: '增加被试的人数' },
          { text: '把线段画得更短' },
          { text: '让被试先写下答案再公开回答' }
        ],
        explain: '从众的关键是「多数意见的一致性」。哪怕只有一个盟友给出正确答案，被试公开反对多数的心理成本就大幅下降，从众率随之显著降低。这说明异议的社会支持比说服个体更有用。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'tf', difficulty: 1, tags: ['group'],
        stem: '群体极化指群体讨论后，成员的平均立场往往比讨论前更极端。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '讨论并不会「中和」观点，反而通过信息影响（听到更多同向论据）与社会比较（想比同伴更符合群体价值）推动平均立场向原方向移动。社交媒体上的回音室效应是同一机制的技术放大版。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['attraction'],
        stem: '下列哪一项是预测两人成为朋友最稳定的因素之一？',
        options: [
          { text: '接近性（生活或工作空间的距离）', correct: true },
          { text: '性格完全互补' },
          { text: '外貌差异大' },
          { text: '初次见面时的第一印象' }
        ],
        explain: '接近性与曝光效应是实证支持最稳的预测因素：同一宿舍楼、同一班级的人更容易成为朋友。相似性（态度与价值观）紧随其后；「互补相吸」的证据远弱于「相似相吸」。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'fill', difficulty: 1, tags: ['diagnosis'],
        stem: '判定心理异常的四条常用标准中，最实用的一条是「功能____」（填两个字）。',
        answer: '损害',
        accept: ['损害', '受损', '障碍', '功能障碍'],
        explain: '统计偏离会把天才也算进去，主观痛苦在部分障碍中并不存在，文化不合容易被滥用；功能损害（工作、学习、关系上的明显障碍）最能区分「需要帮助」与「只是不同」。临床判断通常要求多条同时满足。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'multi', difficulty: 2, tags: ['disorder'],
        stem: '关于精神分裂症，下列哪些说法正确？（多选）',
        options: [
          { text: '阳性症状包括幻觉与妄想', correct: true },
          { text: '阴性症状包括情感平淡与动机缺乏', correct: true },
          { text: '人群患病率约为 1%', correct: true },
          { text: '它等同于「多重人格」' }
        ],
        explain: '阳性症状是正常功能的「多出来」，阴性症状是「缺失」，后者对长期功能影响更大。它与解离性身份障碍（多重人格）在病因、表现与治疗上完全不同，把两者混同是最常见的公众误解。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['treatment'],
        stem: '要判断某种心理治疗是否有效，最可靠的证据来源是？',
        options: [
          { text: '随机对照试验与多项研究的元分析', correct: true },
          { text: '治疗师的成功个案分享' },
          { text: '患者的个人感受与感谢信' },
          { text: '理论本身的精巧程度' }
        ],
        explain: '个案无法排除安慰剂效应、自然恢复与选择偏差；理论精巧不等于有效。随机对照试验控制这些混淆，元分析进一步合并证据并估计效应量。即便如此，还要看发表偏倚与实施质量——这是「循证」的完整含义。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
