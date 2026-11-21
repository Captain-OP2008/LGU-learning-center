/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；每章 q1–q3 与 chXX.js 内嵌题一致，q4–q7 覆盖其余知识点
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '下列哪一项<b>不是</b>毕生发展视角的特征？',
        options: [
          { text: '发展贯穿从出生到死亡的整个过程' },
          { text: '发展研究整合生理、认知与社会情绪多个层面' },
          { text: '发展受遗传与环境多种因素共同影响' },
          { text: '发展在成年早期基本停止，之后只是衰退', correct: true }
        ],
        explain: '毕生发展视角的核心主张之一，是发展贯穿一生、没有哪个年龄阶段「不再发展」。成年期与老年期仍有同一性、关系、认知与意义的重新建构，只是变化的速度与形式不同。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '研究者从 1990 年起，每年测量同一批人的智力水平，持续 30 年。这属于哪种研究设计？',
        options: [
          { text: '纵向研究', correct: true },
          { text: '横断研究' },
          { text: '个案研究' },
          { text: '相关研究' }
        ],
        explain: '纵向研究在同一批被试身上重复测量，能追踪个体随时间的变化；横断研究则在同一时间比较不同年龄组。纵向研究更耗时长、易有被试流失，但对「变化」的推断更强。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'tf', difficulty: 1, tags: ['method'],
        stem: '两个变量呈负相关，就说明前者导致后者下降。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '相关不等于因果。负相关只说明两个变量同向变动的关系为负，可能由第三变量造成，也可能是后者导致前者。要推断因果，需要实验设计或更强的因果推断方法。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '毕生发展研究通常把发展分为哪三类过程？',
        options: [
          { text: '生理、认知、社会情绪', correct: true },
          { text: '遗传、环境、文化' },
          { text: '感知、记忆、思维' },
          { text: '婴儿、成年、老年' }
        ],
        explain: '教材把发展过程分为生理（身体、脑、运动）、认知（注意、记忆、语言、思维）与社会情绪（关系、人格、情绪）三类。三者相互作用，而不是各自独立发展。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '同一世代的人共同经历战争、经济危机或技术变革，这类影响在毕生发展研究中称为什么影响？（填五个字）',
        answer: '历史性影响',
        accept: ['历史性影响', '历史影响', '历史性事件'],
        explain: '这是「历史性影响」（history-graded influences）：同一出生世代共同经历的事件，会塑造该世代的价值观、机会与适应方式。它与年龄性影响、非规范性影响并列。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'multi', difficulty: 2, tags: ['theory'],
        stem: '布朗芬布伦纳生态系统理论中的系统包括下列哪些？（多选）',
        options: [
          { text: '微观系统', correct: true },
          { text: '中间系统', correct: true },
          { text: '外层系统', correct: true },
          { text: '宏观系统', correct: true },
          { text: '内分泌系统' }
        ],
        explain: '生态系统理论包括微观系统（直接环境）、中间系统（微系统之间的联系）、外层系统（不直接参与但影响个体的环境）与宏观系统（文化、制度）。后来加入计时系统（chronosystem）。内分泌系统是生理概念，不属于该理论。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['theory'],
        stem: '下列哪种视角更强调发展是连续、渐进的量变过程，而非一串离散阶段？',
        options: [
          { text: '信息加工视角', correct: true },
          { text: '皮亚杰阶段论' },
          { text: '埃里克森心理社会阶段论' },
          { text: '科尔伯格道德阶段论' }
        ],
        explain: '信息加工视角把认知发展看成注意、记忆、加工速度等成分的连续累积，强调量与机制的渐变；皮亚杰、埃里克森、科尔伯格则用离散阶段描述质变。连续与阶段之争是发展心理学的核心争论之一。'
      },

      /* ---------------- ch01 毕生发展观 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '下列哪项说法最不符合毕生发展视角？',
        options: [
          { text: '发展是贯穿一生的多维度、多方向过程' },
          { text: '发展同时受遗传与环境影响' },
          { text: '成年后发展基本停止，只剩衰退', correct: true },
          { text: '发展研究需要多学科的合作' }
        ],
        explain: '毕生发展视角明确反对「成年后停止发展」。老年期仍有认知、情绪与关系的适应与成长；把后半生简化为衰退，既不符合证据，也会误导干预与政策。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '追踪同一批被试 30 年、反复测量其执行功能，这种设计是：',
        options: [
          { text: '纵向研究', correct: true },
          { text: '横断研究' },
          { text: '实验研究' },
          { text: '跨文化研究' }
        ],
        explain: '在同一批人身上跨时间重复测量，是纵向研究。它能直接观察个体内变化，但耗时、昂贵，且面临被试流失与重复测量练习效应。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'tf', difficulty: 1, tags: ['method'],
        stem: '发现「看电视时间」与「学业成绩」负相关，就可以断定看电视导致成绩下降。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '负相关只说明两者一起变化，不能排除第三变量（如家庭监管、睡眠不足）或反向因果。要检验因果，需要控制混淆变量的实验或纵向追踪。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '毕生发展常被概括为三个维度的过程，下列哪组最准确？',
        options: [
          { text: '生理、认知、社会情绪', correct: true },
          { text: '感觉、知觉、记忆' },
          { text: '遗传、环境、进化' },
          { text: '家庭、学校、社区' }
        ],
        explain: '生理过程涉及身体与脑的变化，认知过程涉及注意、记忆、语言与思维，社会情绪过程涉及关系、人格与情绪。三者交互作用，构成发展的整体图景。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '同一出生世代因共同经历重大历史事件而受到的塑造，称为什么影响？（填五个字）',
        answer: '历史性影响',
        accept: ['历史性影响', '历史影响'],
        explain: '历史性影响（history-graded influences）与年龄性影响、非规范性影响共同构成毕生发展的影响分类。它解释了为什么不同世代对同一事件有不同反应。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'multi', difficulty: 2, tags: ['theory'],
        stem: '关于布朗芬布伦纳的生态系统理论，下列哪些说法正确？（多选）',
        options: [
          { text: '微观系统指个体直接参与的环境，如家庭与学校', correct: true },
          { text: '中间系统指两个或多个微观系统之间的联系', correct: true },
          { text: '外层系统指个体不直接参与但会受影响的环境', correct: true },
          { text: '宏观系统指文化、制度与意识形态', correct: true },
          { text: '该理论认为遗传因素完全决定发展' }
        ],
        explain: '生态系统理论强调环境的多层嵌套：微观、中间、外层、宏观，加上时间维度的计时系统。它并不否认遗传，而是把遗传放在「个体—环境—时间」的互动中理解。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['theory'],
        stem: '把认知发展描述为注意、记忆、加工速度等成分逐步提高的连续过程，最接近哪种视角？',
        options: [
          { text: '信息加工视角', correct: true },
          { text: '皮亚杰阶段论' },
          { text: '精神分析阶段论' },
          { text: '行为主义' }
        ],
        explain: '信息加工视角用容量、速度、策略等连续变量解释发展，不依赖离散阶段。它与阶段论的分歧，是「连续还是阶段」这一核心争论的典型体现。'
      },

      /* ---------------- ch02 生物基础 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '人体体细胞分裂产生两个遗传物质相同的细胞，这种分裂方式叫：',
        options: [
          { text: '有丝分裂', correct: true },
          { text: '减数分裂' },
          { text: '受精作用' },
          { text: '细胞凋亡' }
        ],
        explain: '有丝分裂产生与母细胞遗传物质相同的两个子细胞，用于生长与修复；减数分裂产生染色体数目减半的配子（精子、卵子），用于有性生殖。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '下列哪种物质是已被明确认定的致畸因子（teratogen）？',
        options: [
          { text: '酒精', correct: true },
          { text: '叶酸' },
          { text: '钙' },
          { text: '氧气' }
        ],
        explain: '酒精可通过胎盘影响胎儿，导致胎儿酒精谱系障碍，包括面部特征、生长迟缓与认知行为问题。叶酸、钙、氧气是孕期需要的营养或气体，不是致畸因子。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: 'Apgar 评分在出生后 1 分钟和 5 分钟进行，评估心率、呼吸、肌张力、反射与肤色五项。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'Apgar 用五项指标快速评估新生儿出生时的身体状况，每项 0–2 分，总分 10 分。1 分钟评分反映即时适应，5 分钟评分更能预测后续状况。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '产前发展中，主要器官系统开始形成、对致畸因子最敏感的时期是：',
        options: [
          { text: '胚胎期（约第 2–8 周）', correct: true },
          { text: '胚芽期（约第 1–2 周）' },
          { text: '胎儿期（约第 9 周至出生）' },
          { text: '围产期（出生前后）' }
        ],
        explain: '胚胎期是器官形成的关键期，心脏、神经系统、四肢等快速分化，对致畸因子最敏感。胎儿期器官继续生长成熟，敏感度相对下降，但神经系统仍易受影响。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'fill', difficulty: 1, tags: ['method'],
        stem: '通过比较被收养儿童与亲生父母、养父母的相似程度，来估计遗传与环境贡献的研究设计叫：',
        answer: '收养研究',
        accept: ['收养研究', '领养研究', 'adoption study'],
        explain: '收养研究把「遗传」与「环境」分离：孩子与亲生父母共享基因但不共享环境，与养父母共享环境但不共享基因。若某特征与亲生父母更相似，提示遗传贡献更大。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些因素与低出生体重风险升高有关？（多选）',
        options: [
          { text: '孕期营养不良', correct: true },
          { text: '孕期吸烟', correct: true },
          { text: '孕期酗酒', correct: true },
          { text: '多胎妊娠', correct: true },
          { text: '孕期规律产检' }
        ],
        explain: '低出生体重的风险因素包括孕期营养不良、吸烟、酗酒、多胎、感染、高血压与贫困等。规律产检是保护因素，有助于早期发现并处理风险。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['theory'],
        stem: '进化心理学对许多心理机制的解释是：它们是：',
        options: [
          { text: '对祖先适应性问题形成的解决方案', correct: true },
          { text: '后天文化灌输的产物，与遗传无关' },
          { text: '个体随机学习的偶然结果' },
          { text: '只在现代社会中才出现的现象' }
        ],
        explain: '进化心理学主张，自然选择塑造了应对祖先环境问题的心理机制，如对威胁的警觉、对亲属的偏爱。它提供的是「远端解释」，需要与近端机制（生理、学习）结合，不能单独解释具体行为。'
      },

      /* ---------------- ch03 婴儿期 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['theory'],
        stem: '按皮亚杰的感知运动阶段，客体永久性最初出现在哪个亚阶段？',
        options: [
          { text: '次级循环反应及其协调（约 8–12 个月）', correct: true },
          { text: '反射图式（出生至 1 个月）' },
          { text: '初级循环反应（约 1–4 个月）' },
          { text: '三级循环反应（约 12–18 个月）' }
        ],
        explain: '在「次级循环反应及其协调」阶段，婴儿开始寻找被部分藏起来的物体，说明客体永久性初步出现；到「三级循环反应」与「内部表征」阶段，才能完成更复杂的藏找任务。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['theory'],
        stem: '在陌生情境中，婴儿在母亲离开时极度痛苦，母亲回来时既寻求接触又推开她。这最符合哪种依恋类型？',
        options: [
          { text: '矛盾型（抵抗型）', correct: true },
          { text: '安全型' },
          { text: '回避型' },
          { text: '混乱型' }
        ],
        explain: '矛盾型婴儿在分离时高度痛苦，重聚时既想靠近又生气推开，难以被安抚。安全型能主动寻求安慰并较快平静；回避型看似不在意；混乱型表现出矛盾、冻结或恐惧。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'tf', difficulty: 1, tags: ['theory'],
        stem: 'Chess 与 Thomas 把婴儿气质分为容易型、困难型与慢热型三类。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'Chess 与 Thomas 的纽约纵向研究区分容易型、困难型与慢热型（slow-to-warm-up）。后来 Rothbart 等人用努力控制、负情绪等维度细化气质研究。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['theory'],
        stem: '乔姆斯基认为儿童能快速习得语言，是因为人类具有：',
        options: [
          { text: '普遍语法与语言习得装置', correct: true },
          { text: '完全靠模仿成人句子的能力' },
          { text: '仅靠强化与惩罚的机制' },
          { text: '统计学习能力，且无需任何先天基础' }
        ],
        explain: '乔姆斯基主张人类天生具有语言习得装置与普遍语法，使儿童能在有限输入下生成无限句子。行为主义强调模仿与强化，互动观强调社会交往，统计学习则强调从输入中提取规律。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '婴儿身体发育先从头部控制开始，再到躯干、四肢，同时从中心到外周；这两个原则合称什么？（填「X原则与Y原则」）',
        answer: '头尾原则与近远原则',
        accept: ['头尾原则与近远原则', '头尾和近远原则', '头尾原则、近远原则'],
        explain: '头尾原则（cephalocaudal）指发展从头到脚，近远原则（proximodistal）指从身体中心到外周。它们解释了婴儿先会抬头、再会坐、最后会走，以及先控制肩臂、再控制手指的顺序。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些是新生儿已具备的能力？（多选）',
        options: [
          { text: '偏好母亲的声音', correct: true },
          { text: '辨别气味', correct: true },
          { text: '对高对比图案的注视偏好', correct: true },
          { text: '抓握反射', correct: true },
          { text: '理解抽象语法规则' }
        ],
        explain: '新生儿已具备多种感知与反射能力：听觉偏好母亲声音、嗅觉辨别、视觉偏好高对比与面孔-like 图案、抓握与觅食反射。抽象语法规则的理解远未成熟。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['theory'],
        stem: '按埃里克森的理论，婴儿期的核心危机是：',
        options: [
          { text: '信任对不信任', correct: true },
          { text: '自主对羞怯', correct: false },
          { text: '主动对内疚' },
          { text: '勤奋对自卑' }
        ],
        explain: '婴儿期的危机是信任对不信任，照料者的稳定回应让婴儿形成「世界是可靠的」的基本感受。自主对羞怯属于幼儿期，主动对内疚属于学前期，勤奋对自卑属于学龄期。'
      },

      /* ---------------- ch04 童年期 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['theory'],
        stem: '幼儿说「月亮跟着我走，因为它想和我玩」，这最能说明：',
        options: [
          { text: '自我中心', correct: true },
          { text: '守恒' },
          { text: '传递性' },
          { text: '客体永久性' }
        ],
        explain: '自我中心（egocentrism）指难以区分自己的视角与他人的视角，把主观体验当成世界的规律。前运算期儿童常把自然现象拟人化、以自己的位置解释运动。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['parenting'],
        stem: '父母既提出明确要求，又给予温暖回应、允许讨论，这种教养方式属于：',
        options: [
          { text: '权威型', correct: true },
          { text: '专制型' },
          { text: '放任型' },
          { text: '忽视型' }
        ],
        explain: '权威型（authoritative）是高要求、高回应：规则清晰但可讨论，温暖而有边界。它与较好的学业、社会能力与自我调节相关。专制型高要求低回应，放任型高回应低要求，忽视型两者都低。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'tf', difficulty: 1, tags: ['theory'],
        stem: '具体运算阶段的儿童能完成守恒任务，但推理仍主要依赖具体事物，尚难处理纯抽象假设。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '具体运算儿童获得了守恒、分类、排序、传递性等能力，但思维仍绑定在具体情境上；纯假设、命题逻辑要到形式运算阶段才较稳定出现。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['theory'],
        stem: '维果茨基的「最近发展区」（ZPD）指的是：',
        options: [
          { text: '儿童独立能达到的水平与在指导下能达到的水平之间的差距', correct: true },
          { text: '儿童当前已经完全掌握的所有技能' },
          { text: '儿童未来一年内会自然达到的年龄常模' },
          { text: '儿童在标准化测验中的得分区间' }
        ],
        explain: 'ZPD 强调「教学应走在发展前面」：在成人或更有能力的同伴支持下，儿童能完成独立时做不到的任务。支架（scaffolding）就是在 ZPD 内提供的临时支持。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '知道 A 比 B 长、B 比 C 长，就能推出 A 比 C 长。这种推理能力叫什么？',
        answer: '传递性',
        accept: ['传递性', 'transitivity'],
        explain: '传递性（transitivity）是具体运算期的标志能力之一：能把两个关系串起来推出第三个关系，而不必实际比较 A 与 C。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'multi', difficulty: 2, tags: ['theory'],
        stem: '加德纳的多元智能理论包括下列哪些智能？（多选）',
        options: [
          { text: '语言智能', correct: true },
          { text: '逻辑—数学智能', correct: true },
          { text: '空间智能', correct: true },
          { text: '人际智能', correct: true },
          { text: '一般智力 g 因素' }
        ],
        explain: '加德纳最初提出七种智能（语言、逻辑数学、空间、音乐、身体动觉、人际、内省），后加入自然观察等。他反对把智力化约为单一的 g 因素，主张智能是相对独立的领域。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['parenting'],
        stem: '父母要求孩子绝对服从、很少回应孩子的情感需要，这种教养方式属于：',
        options: [
          { text: '专制型', correct: true },
          { text: '权威型' },
          { text: '放任型' },
          { text: '忽视型' }
        ],
        explain: '专制型（authoritarian）是高要求、低回应：强调服从与惩罚，缺少温暖与解释。它与较低的自我调节、较多的焦虑或对抗相关，但具体效果受文化情境调节。'
      },

      /* ---------------- ch05 青少年期 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['theory'],
        stem: '按埃里克森的理论，青少年期的核心危机是：',
        options: [
          { text: '同一性对角色混乱', correct: true },
          { text: '亲密对孤立' },
          { text: '勤奋对自卑' },
          { text: '自主对羞怯' }
        ],
        explain: '青少年期的危机是同一性对角色混乱：整合能力、关系与价值，形成相对连贯的自我。成功品质是忠诚；亲密对孤立属于成年早期，勤奋对自卑属于学龄期。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['theory'],
        stem: '按马西亚的同一性状态，经历过主动探索、并形成稳定承诺的人属于：',
        options: [
          { text: '同一性达成', correct: true },
          { text: '同一性延缓' },
          { text: '过早封闭' },
          { text: '同一性扩散' }
        ],
        explain: '马西亚用探索与承诺两维划分四态：达成＝有探索有承诺；延缓＝有探索未承诺；过早封闭＝无探索有承诺；扩散＝无探索无承诺。状态随领域与时间变化，不是固定人格类型。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '「假想观众」指青少年觉得别人都在注意自己，这本质上是一种妄想。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '假想观众不是妄想，而是把对自己的高度关注误当成他人的关注。它在青少年中相当普遍，随年龄增长下降；临床妄想则固定、系统且影响功能，二者不同。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['theory'],
        stem: '皮亚杰的钟摆任务要求被试判断影响摆动周期的因素，它主要考察：',
        options: [
          { text: '假设演绎推理与控制变量', correct: true },
          { text: '守恒与可逆性' },
          { text: '客体永久性' },
          { text: '传递性推理' }
        ],
        explain: '钟摆任务要求先提出可能因素，再逐一改变一个变量、控制其余变量。形式运算者能系统检验假设；具体运算者常同时改变多个变量，难以分离因果。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-8', tier: 1, type: 'fill', difficulty: 1, tags: ['theory'],
        stem: '科尔伯格习俗水平的第三阶段，以「获得他人认可、维持良好关系」为判断依据，通常被称为什么取向？',
        answer: '好孩子',
        accept: ['好孩子', '好孩子取向', '好男孩好女孩', '人际和谐'],
        explain: '第三阶段常称「好孩子/好女孩」取向：判断对错看是否被重要他人认可、是否维持关系。第四阶段转向法律与秩序，第五、六阶段才进入后习俗水平。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-1', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些属于青春期的典型变化？（多选）',
        options: [
          { text: '生长突增', correct: true },
          { text: '第二性征出现', correct: true },
          { text: '女孩初潮、男孩首次射精', correct: true },
          { text: '前额叶皮层在青春期早期完全成熟' },
          { text: '边缘系统与奖赏回路的反应性升高', correct: true }
        ],
        explain: '青春期带来生长突增、第二性征、生殖成熟与奖赏系统反应性升高；前额叶要到 20 多岁才完全成熟。正是这种「奖赏早熟、控制晚熟」的时间差，解释了青少年在同伴在场时更冒险。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '执行功能（抑制、计划、认知灵活性）主要依赖哪个脑区的成熟？',
        options: [
          { text: '前额叶皮层', correct: true },
          { text: '小脑' },
          { text: '杏仁核' },
          { text: '枕叶' }
        ],
        explain: '执行功能主要由前额叶网络支持，在青春期到成年早期持续成熟。杏仁核更多参与情绪与威胁检测，小脑参与运动协调，枕叶负责视觉加工。'
      },

      /* ---------------- ch06 成年期 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['theory'],
        stem: '按埃里克森的理论，成年早期的核心危机是：',
        options: [
          { text: '亲密对孤立', correct: true },
          { text: '同一性对角色混乱' },
          { text: '生成对停滞' },
          { text: '完整对绝望' }
        ],
        explain: '成年早期的危机是亲密对孤立：建立深度、互惠、愿意暴露脆弱的联结，成功品质是爱。埃里克森强调亲密以同一性为前提，但两者实际上交织发展。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['theory'],
        stem: '佩里（Perry）关于大学生思维发展的研究，描述的主要进展是：',
        options: [
          { text: '从二元论走向相对主义，再到有承诺的立场', correct: true },
          { text: '从具体运算走向形式运算' },
          { text: '从感觉运动走向前运算' },
          { text: '从流体智力走向晶体智力' }
        ],
        explain: '佩里发现学生常从「非对即错、权威有答案」的二元论，经多元论，走向承认情境与证据的相对主义，最终在不确定中形成自己的承诺。这与皮亚杰的阶段不是同一套框架。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '阿内特所说的「新兴成年期」包括同一性探索、不稳定、自我聚焦、介于之间与可能性五个特征。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '这五个特征是阿内特对 18–29 岁过渡阶段的概括。它描述的是工业化社会中的一种典型张力，并非所有人都经历，也不适用于所有文化。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['theory'],
        stem: '按斯滕伯格的爱情三角，有亲密、有激情、但尚无承诺的关系属于：',
        options: [
          { text: '浪漫之爱', correct: true },
          { text: '伴侣之爱' },
          { text: '愚昧之爱' },
          { text: '空洞之爱' }
        ],
        explain: '浪漫之爱＝亲密＋激情；伴侣之爱＝亲密＋承诺；愚昧之爱＝激情＋承诺（缺少亲密）；空洞之爱只有承诺。三者兼具是圆满之爱，也是最难长期维持的。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-6', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '面对新问题时的推理能力，依赖加工速度与工作记忆，通常在成年后逐渐下降。这种智力叫什么？',
        answer: '流体智力',
        accept: ['流体智力', 'fluid intelligence', 'Gf'],
        explain: '流体智力（Gf）负责新异问题的推理；晶体智力（Gc）是积累的知识与技能，中年期仍可保持或增长。专长与元认知能部分补偿流体的下降。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'multi', difficulty: 2, tags: ['theory'],
        stem: '「大五」人格模型包括下列哪些维度？（多选）',
        options: [
          { text: '开放性', correct: true },
          { text: '尽责性', correct: true },
          { text: '外向性', correct: true },
          { text: '神经质', correct: true },
          { text: '道德推理' }
        ],
        explain: '大五是开放性、尽责性、外向性、宜人性、神经质五个维度。道德推理属于认知—道德发展研究，不是人格特质维度。纵向研究显示尽责与宜人性随年龄上升、神经质下降。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['theory'],
        stem: '埃里克森所说的「生成」（generativity）最核心的含义是：',
        options: [
          { text: '关心并引导下一代，把经验传下去', correct: true },
          { text: '追求个人成就与财富积累' },
          { text: '维持现状、避免改变' },
          { text: '只关注自己的身体健康' }
        ],
        explain: '生成是关心下一代与未来：养育、指导、创作、社区参与都算。它的对立面是停滞——觉得没有留下什么、与未来失去联结。生成不限于亲生子女。'
      },

      /* ---------------- ch07 老年期与生命终点 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['theory'],
        stem: '细胞时钟理论认为衰老与下列哪项关系最直接？',
        options: [
          { text: '端粒随细胞分裂而缩短', correct: true },
          { text: '自由基完全无法被清除' },
          { text: '皮质醇水平始终偏低' },
          { text: '免疫系统永不衰退' }
        ],
        explain: '细胞时钟理论强调端粒（染色体末端保护帽）随分裂缩短，短到临界时细胞停止分裂或衰老。自由基与激素应激是另外两种互补的解释。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['theory'],
        stem: '按埃里克森的理论，老年期的核心危机是：',
        options: [
          { text: '完整对绝望', correct: true },
          { text: '生成对停滞' },
          { text: '亲密对孤立' },
          { text: '同一性对角色混乱' }
        ],
        explain: '老年期的危机是完整对绝望：接纳自己一生的选择与局限，与死亡和解，成功品质是智慧。完整不等于满意或没有遗憾，而是对有限性的承认。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'tf', difficulty: 1, tags: ['theory'],
        stem: '社会情绪选择理论认为，老年人社交圈缩小往往是主动选择的结果，而不一定是社交能力衰退。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '该理论认为，感知到的未来时间变短时，人会更优先高情感价值、熟悉的关系，减少泛泛社交。圈子变小但满意度可能更高；若缩小源于行动不便或缺乏交通，则需要干预。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-8', tier: 1, type: 'mcq', difficulty: 1, tags: ['theory'],
        stem: '库伯勒-罗斯提出的临终反应五阶段中，第一阶段通常是：',
        options: [
          { text: '否认与隔离', correct: true },
          { text: '愤怒' },
          { text: '讨价还价' },
          { text: '接受' }
        ],
        explain: '五阶段为否认与隔离、愤怒、讨价还价、抑郁、接受。它们不是必经的线性顺序，也不是「走到接受才算好」；更稳妥的用法是把它当成可能的反应清单。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-6', tier: 1, type: 'fill', difficulty: 1, tags: ['theory'],
        stem: '巴尔特斯成功老龄化模型的三成分是选择、优化与什么？（填两个字）',
        answer: '补偿',
        accept: ['补偿', 'compensation'],
        explain: 'SOC 模型：选择（聚焦有限目标）、优化（投入练习与策略）、补偿（用替代方式弥补损失）。资源下降不必然导致功能下降，因为人可以调整目标与策略。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '关于老年期认知变化，下列哪些说法正确？（多选）',
        options: [
          { text: '加工速度通常变慢', correct: true },
          { text: '情节记忆的编码与提取下降', correct: true },
          { text: '晶体智力相对保持甚至增长', correct: true },
          { text: '语义记忆通常会全面丧失' },
          { text: '专长与元认知可以补偿部分下降', correct: true }
        ],
        explain: '正常老化伴随加工速度与工作记忆下降、情节记忆变差；晶体智力、语义记忆与专长相对保持。语义记忆全面丧失不是正常老化，而是需要评估的病理信号。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '老年性听力损失（presbycusis）最典型的表现是：',
        options: [
          { text: '高频声音先听不清，嘈杂环境中尤其困难', correct: true },
          { text: '低频声音先完全丧失' },
          { text: '听力突然全部消失' },
          { text: '只在安静环境中听不清' }
        ],
        explain: '老年性听力损失通常从高频开始，辅音（s、f、th）先听不清，嘈杂环境更明显，常被误认为不专心。助听器、面对面说话、减少背景噪音能显著改善沟通。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
