/* =====================================================================
 * quiz.js · 分章题库（CSC.registerQuizPack）
 * 8 章 × 7 题 = 56 题；每章 q1–q3 与 chXX.js 内嵌题对应
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '课程把消费分成「买、有、是」三层。其中「是」主要关心什么？',
        options: [
          { text: '消费者如何用消费表达身份、归属与生活方式', correct: true },
          { text: '一次交易的价格与支付方式' },
          { text: '商品的物流与库存周转' },
          { text: '商场的楼层布局' }
        ],
        explain: '「买」关注获取过程，「有」关注拥有与使用，「是」关注消费如何构成身份与意义。三者合起来才是完整的消费者行为，而不是只看付款那一刻。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '本站的主教材是哪一本？',
        options: [
          { text: 'Solomon《Consumer Behavior: Buying, Having, and Being》', correct: true },
          { text: 'Kotler & Keller《Marketing Management》' },
          { text: 'Schiffman《Consumer Behavior》' },
          { text: 'Hawkins《Consumer Behavior: Building Marketing Strategy》' }
        ],
        explain: '课程以 Solomon 的《Consumer Behavior: Buying, Having, and Being》（Pearson, 2019）为主线，本站七章覆盖其第 1–14 章；其他教材可作对照，但章节地图以 Solomon 为准。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '消费者行为只发生在付款的那一刻，付款之后的行为不属于研究范围。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '消费者行为包括购前的问题识别与搜索、购买时的情境与决策，以及购后的使用、评价与处置。只研究付款瞬间，会漏掉满意度、复购与口碑这些更关键的环节。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['method'],
        stem: '下列哪一组问题属于消费者研究的「宏观」层次？',
        options: [
          { text: '文化价值、社会阶层与群体规范如何塑造消费', correct: true },
          { text: '一个消费者看到价格标签时的 eye-tracking 数据' },
          { text: '某次促销的点击率与转化率' },
          { text: '包装颜色对单个被试反应时的影响' }
        ],
        explain: '微观关注个体认知与行为，中观关注群体互动，宏观关注文化、阶层、制度等结构性力量。eye-tracking、点击率、反应时都属于微观或中观层面。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-3', tier: 2, type: 'multi', difficulty: 2, tags: ['method'],
        stem: '消费者行为研究常用的方法包括下列哪些？（多选）',
        options: [
          { text: '实验与准实验', correct: true },
          { text: '问卷调查', correct: true },
          { text: '观察与民族志', correct: true },
          { text: '二手数据分析', correct: true },
          { text: '凭个人直觉下结论' }
        ],
        explain: '实验、调查、观察、二手数据是四类基本方法，各有适用场景与偏差。直觉可以作为提出假设的起点，但不能替代可检验的证据。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '本站七章正文对应 Solomon 教材第 1 至第 ____ 章。',
        answer: '14', accept: ['14', '第14章', '十四'],
        explain: 'ch01 对应第 1–2 章，ch02 第 3 章，ch03 第 4 章，ch04 第 5–6 章，ch05 第 7–8 章，ch06 第 9–10 章，ch07 第 11–14 章，合计第 1–14 章。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '使用本站最有效的顺序是：',
        options: [
          { text: '先读 ch00 建立地图，再按章读正文、做内嵌题与自检，最后用题库和模拟卷检验', correct: true },
          { text: '直接从题库开始刷题，正文不用看' },
          { text: '只背术语表，跳过所有例子' },
          { text: '只看模拟卷答案，不看解析' }
        ],
        explain: 'ch00 给出七章地图与教材对应关系；正文的例子与机制解释是理解的前提；内嵌题与自检用于即时反馈；题库与模拟卷用于间隔复习与限时检验。'
      },

      /* ---------------- ch01 导论 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '下列哪一门学科不直接构成消费者行为研究的五大学科基础？',
        options: [
          { text: '会计学', correct: true },
          { text: '心理学' },
          { text: '社会学' },
          { text: '经济学' }
        ],
        explain: '五大学科基础是心理学（个体认知与情感）、社会学（群体与互动）、社会心理学（他人影响）、人类学（文化与仪式）、经济学（选择与效用）。会计学处理账目，不解释消费行为。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '营销观念演变到「社会营销观念」阶段，最强调什么？',
        options: [
          { text: '在满足顾客需要的同时，兼顾长期社会福利与可持续', correct: true },
          { text: '把生产效率做到最高、成本压到最低' },
          { text: '把产品做得最好，顾客自然会来' },
          { text: '用最强的人员推销把货卖出去' }
        ],
        explain: '生产观念重效率、产品观念重品质、推销观念重推力、营销观念重顾客需要；社会营销观念再加一层：企业、顾客与社会三方长期利益都要考虑，绿色洗白正是对这一层的背离。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: 'STP 的标准顺序是「细分—目标—定位」。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '先按需要与行为把市场分成有意义的群（segmentation），再选择要服务的目标群（targeting），最后在目标群心中建立差异化位置（positioning）。顺序颠倒会把定位做成自说自话。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '下列哪一项最符合「价值共创」而不是传统的「企业创造、顾客消费」？',
        options: [
          { text: '品牌开放配方平台，让用户提交口味并参与票选，入选者署名分成', correct: true },
          { text: '企业关起门来研发三年，发布时请明星代言' },
          { text: '把广告投放到更多平台，提高曝光' },
          { text: '把价格降到竞争对手以下' }
        ],
        explain: '共创的核心是顾客参与价值创造过程，并有参与感、署名或回报、退出权与透明规则。只增加曝光、降价或请代言，仍然是企业单方面创造价值。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '消费者在一件产品上可能扮演哪些角色？（多选）',
        options: [
          { text: '购买者', correct: true },
          { text: '使用者', correct: true },
          { text: '传播者', correct: true },
          { text: '生产者（参与改进）', correct: true },
          { text: '企业股东' }
        ],
        explain: '消费者可以同时是购买者、使用者、传播者与生产者，不同角色关心的东西不同：确定性、好用、分享有面子、意见被采纳。只盯购买者，会在购后与传播环节掉链子。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-7', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '企业宣称环保、实际却只做表面文章，这种行为被称为「____」（填中文）。',
        answer: '绿色洗白', accept: ['绿色洗白', '漂绿', '洗绿', 'greenwashing'],
        explain: '绿色洗白（greenwashing）指环保声明与真实实践不符，常见手法是只强调一个无关痛痒的绿色标签，却回避主要的环境影响。它短期讨好消费者，长期损伤信任并带来监管风险。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['ethics'],
        stem: '把「取消订阅」按钮做成灰色小字、把「自动续费」默认勾选，这类设计属于：',
        options: [
          { text: '利用认知偏差的暗模式，属于消费者福利问题', correct: true },
          { text: '正常的产品体验优化' },
          { text: '提高客单价的定价策略' },
          { text: '细分市场的定位手段' }
        ],
        explain: '暗模式（dark patterns）利用注意与解释的偏差，让消费者做出并非本意的选择。它可能提升短期转化，但损害知情权与信任，是消费者福利章节的典型反面案例。'
      },

      /* ---------------- ch02 感知 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '感知过程的三个基本阶段依次是：',
        options: [
          { text: '暴露 → 注意 → 解释', correct: true },
          { text: '注意 → 暴露 → 记忆' },
          { text: '解释 → 注意 → 暴露' },
          { text: '暴露 → 记忆 → 态度' }
        ],
        explain: '先要接触到刺激（暴露），再把有限的认知资源分配给它（注意），最后赋予意义（解释）。三个阶段任一失败，信息都到不了记忆与态度。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '「刚能察觉两个刺激之间差异」的最小量，称为：',
        options: [
          { text: '差别阈（JND）', correct: true },
          { text: '绝对阈' },
          { text: '感觉适应' },
          { text: '知觉定势' }
        ],
        explain: '绝对阈是「能不能感觉到某个刺激存在」，差别阈是「能不能分辨两个刺激不同」。韦伯定律指出差别阈与原刺激强度成比例，这解释了为什么高价商品的微小降价不容易被察觉。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '绝对阈是指「能察觉两个刺激之间差异」的最小刺激量。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '绝对阈是能察觉到刺激存在的最低强度；能察觉两个刺激差异的是差别阈（JND）。两个概念常被混淆，但一个问「有没有」，一个问「变没变」。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '「横幅盲视」最准确的描述是：',
        options: [
          { text: '用户习惯性忽略页面边缘的广告位，即使内容就在视线里', correct: true },
          { text: '用户看不清横幅上的小字' },
          { text: '横幅颜色与背景太接近' },
          { text: '横幅加载速度太慢' }
        ],
        explain: '横幅盲视是注意层面的适应：用户学会把广告位当作噪声跳过。对抗它不能只把横幅做大，而要改变形式与位置，或把信息放进用户主动搜索的内容里。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些因素会提高一个刺激被注意到的概率？（多选）',
        options: [
          { text: '尺寸更大', correct: true },
          { text: '与背景对比更强', correct: true },
          { text: '出现在视线中心或货架黄金位置', correct: true },
          { text: '形式新颖、出乎意料', correct: true },
          { text: '与周围所有元素完全一致' }
        ],
        explain: '注意由刺激的显著性（大小、对比、位置、新颖性）与个体目标共同决定。完全融入背景的刺激反而更难被看到，这也是「独特资产」要适度突出的原因。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'fill', difficulty: 2, tags: ['concept'],
        stem: '消费者把「价格高」直接当作「质量好」的线索，这种判断称为价格—质量____。',
        answer: '推断', accept: ['推断', '推论', 'inference'],
        explain: '价格—质量推断是在信息不足时用价格替代质量信息。它成立的前提是消费者相信「贵有贵的道理」；一旦市场出现大量高价比低价质劣的产品，这个线索就会失效。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['ethics'],
        stem: '零售店用高频快音乐、刺眼灯光与拥挤动线让顾客「快点买完走人」，从感知角度看：',
        options: [
          { text: '这是在设计环境线索影响情绪与停留，但若隐瞒或误导就越过伦理边界', correct: true },
          { text: '这是纯粹的店面装修，与消费者感知无关' },
          { text: '只要销量上升就说明做法合理' },
          { text: '音乐和灯光不会影响购买行为' }
        ],
        explain: '环境心理学研究证实音乐节奏、灯光、气味会影响唤醒与停留时间。把它当作设计工具没问题，但用来制造压迫、隐瞒信息或诱导冲动，就属于利用感知偏差。'
      },

      /* ---------------- ch03 学习与记忆 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '经典条件反射的核心机制是：',
        options: [
          { text: '中性刺激与能引发反应的刺激反复配对，中性刺激也能引发反应', correct: true },
          { text: '行为之后给予奖励，行为频率增加' },
          { text: '观察他人的行为及其后果而学习' },
          { text: '通过推理与问题解决获得新知识' }
        ],
        explain: '经典条件反射（巴甫洛夫）是刺激—刺激的联结：铃声本来不引发唾液，与食物反复配对后也能引发。工具条件反射则是行为—后果的联结，二者常被混用。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-1', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '「试吃后觉得好吃，下次更愿意买」属于：',
        options: [
          { text: '工具条件反射中的正强化', correct: true },
          { text: '经典条件反射中的消退' },
          { text: '观察学习中的模仿' },
          { text: '认知学习中的洞察' }
        ],
        explain: '试吃是行为，好吃是后果，后果提高了行为再次发生的概率，这就是正强化。若试吃很难吃（惩罚），购买行为会减少；若不再给试吃（消退），行为也会逐渐减弱。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '记忆通常分为感觉记忆、工作记忆（短时记忆）与长时记忆三级。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '感觉记忆保留极短（不到几秒），工作记忆容量有限（约 4 个组块），长时记忆近乎无限。营销含义是：包装要在半秒内被认出，卖点要短到能进工作记忆，联想则靠长时记忆。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '「回到当年买它的那家店，就想起了这个品牌」最能说明：',
        options: [
          { text: '提取线索与编码环境匹配时，记忆更容易被唤起', correct: true },
          { text: '记忆会随时间自动增强' },
          { text: '品牌知名度等于购买意愿' },
          { text: '遗忘一定是衰退造成的' }
        ],
        explain: '编码特异性：信息在什么情境下被编码，回到相似情境就更容易提取。门店、气味、音乐、包装都可以成为提取线索，这也是「场景营销」有效的认知基础。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些是解释「遗忘」的常见机制？（多选）',
        options: [
          { text: '衰退：记忆痕迹随时间变弱', correct: true },
          { text: '干扰：新旧信息互相覆盖', correct: true },
          { text: '提取失败：信息还在，但找不到线索', correct: true },
          { text: '动机性遗忘：不愿想起不愉快的信息', correct: true },
          { text: '记忆容量无限，所以不存在遗忘' }
        ],
        explain: '遗忘不只有「衰退」一种解释。干扰（同品类广告互相覆盖）、提取失败（缺线索）、动机性遗忘（回避负面体验）都常见，对应不同的营销对策。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '同一广告反复出现，消费者仅因熟悉就产生好感，这种现象叫「____效应」。',
        answer: '曝光', accept: ['曝光', '单纯曝光', 'mere exposure'],
        explain: '单纯曝光效应（mere exposure）指重复接触会提高好感，前提是初始态度不负面。但重复过量会变成广告疲劳，好感转为厌烦，所以频率需要控制。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '怀旧营销最大的风险之一是：',
        options: [
          { text: '消费者怀念的是被美化的过去，复刻版稍有差异就会失望', correct: true },
          { text: '怀旧只对老年人有效，年轻人完全无感' },
          { text: '怀旧广告的制作成本一定高于普通广告' },
          { text: '怀旧产品不存在任何市场需求' }
        ],
        explain: '记忆是重构的，消费者比较的是记忆里的理想版本，不是真实旧版。复刻版在口味、手感、包装上若有差异，失望会被放大。更稳的做法是卖情绪与仪式，而不是承诺「一模一样」。'
      }
      ,

      /* ---------------- ch04 动机、情感与自我 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '「需要」与「欲望」的区别，最准确的说法是：',
        options: [
          { text: '需要是基本的人类要求，欲望是被文化与经验塑造的具体满足形式', correct: true },
          { text: '需要是心理的，欲望是生理的' },
          { text: '两者完全同义，可以互换' },
          { text: '欲望是天生的，需要是学来的' }
        ],
        explain: '需要（need）是普遍的基本要求，如充饥、安全、归属；欲望（want）是文化塑造的具体形式，如「想吃某家火锅」。营销通常作用于欲望，但不能把制造出来的欲望说成「基本需要」。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '同一目标既有吸引力又让人想回避，这种动机冲突是：',
        options: [
          { text: '趋避冲突（approach-avoidance）', correct: true },
          { text: '双趋冲突（approach-approach）' },
          { text: '双避冲突（avoidance-avoidance）' },
          { text: '认知失调' }
        ],
        explain: '趋避冲突是「既想要又怕」：想吃甜点又怕胖、想买又怕后悔。双趋是两个都想要只能选一个，双避是两个都不想要必须选一个。营销常用「降低风险」来化解趋避冲突。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '马斯洛需求层次必须严格逐级满足，低层未满足时高层需求完全不会出现。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '马斯洛模型是启发式排序，不是严格定律。现实中人会同时追求多个层次，也会为了尊严或归属牺牲生理与安全；跨文化研究还发现层次顺序因文化而异。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '消费者因为「今天心情好」而更愿意尝试新品牌，这最接近：',
        options: [
          { text: '情感启发式：用当下的情绪状态替代复杂的判断', correct: true },
          { text: '认知失调：购后为自己的选择找理由' },
          { text: '社会判断：把信息放进接受或拒绝区' },
          { text: '经典条件反射：刺激与反应配对' }
        ],
        explain: '情感启发式（affect heuristic）指人们把「我感觉如何」当成「这个东西如何」的快捷判断。心情好时风险感知降低、尝试意愿升高，所以试用装、试驾常安排在轻松愉悦的场景里。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '自我概念通常包括下列哪几个版本？（多选）',
        options: [
          { text: '实际自我：我现在是谁', correct: true },
          { text: '理想自我：我想成为谁', correct: true },
          { text: '社会自我：我希望别人怎么看我', correct: true },
          { text: '品牌自我：品牌希望我是谁' },
          { text: '他人自我：别人实际上是谁' }
        ],
        explain: '实际自我、理想自我、社会自我是三个常用维度。品牌可以对应其中任何一个：健身房卖理想自我，奢侈品卖社会自我，舒适家居卖实际自我。三者不一致时，消费者会产生改变消费或改变叙事的动力。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '生活方式测量常用 AIO 框架，其中 A、I、O 分别指活动、兴趣和____。',
        answer: '观点', accept: ['观点', '意见', 'opinion'],
        explain: 'AIO 是 activity、interest、opinion 的缩写。它把抽象的生活方式落到可问的题项上：每周做什么、关心什么、怎么看世界。单靠标签（如「精致妈妈」）不够，要绑定具体场景才有用。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['ethics'],
        stem: '美妆品牌在广告里大量使用滤镜、制造「不美就没机会」的焦虑，最应被质疑的是：',
        options: [
          { text: '它放大了身体不满，再把购买说成唯一解法', correct: true },
          { text: '它使用了女性模特' },
          { text: '它把价格定得太低' },
          { text: '它没有在电视上投放' }
        ],
        explain: '身体意象研究显示，经过修图的广告会提高外貌焦虑与身体不满。商业上有效，但伦理上要问：传播是在帮助消费者了解自己，还是在放大「你不够好」再卖解法。后者一旦被识破，反噬很快。'
      },

      /* ---------------- ch05 态度与说服 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '态度的 ABC 模型中，B 指的是：',
        options: [
          { text: '行为倾向（behavioral tendency）', correct: true },
          { text: '信念（belief）' },
          { text: '收益（benefit）' },
          { text: '品牌（brand）' }
        ],
        explain: 'ABC 是 affect（情感）、behavior（行为倾向）、cognition（认知）。三者可能不一致：喜欢一个品牌（A）、知道它性价比一般（C）、却还是继续买（B）。这种不一致正是说服研究的入口。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '多属性态度模型 A = Σ(b×e) 中，b 与 e 分别代表：',
        options: [
          { text: 'b 是属性上的信念强度，e 是该属性的评价（重要性）', correct: true },
          { text: 'b 是价格，e 是销量' },
          { text: 'b 是行为，e 是环境' },
          { text: 'b 是品牌，e 是代言人' }
        ],
        explain: 'b（belief）是「这个品牌在属性 X 上表现如何」的信念，e（evaluation）是「属性 X 对我多重要」的评价。总分高表示总体态度好。诊断时看「权重高、评分低」的属性，那才是改进优先级。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '精细加工可能性模型（ELM）认为，低卷入时消费者主要走中央路径。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'ELM 的对应关系是：高卷入、有时间与能力时走中央路径（看证据、比参数）；低卷入或无法深加工时走边缘路径（看代言人、包装、数量）。说反了。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '消费者刚买完一台贵价电脑，开始反复看评测确认「没买错」，这最符合：',
        options: [
          { text: '认知失调：购后为已做出的选择寻找支持理由', correct: true },
          { text: '社会判断：把信息放进接受区' },
          { text: '自我知觉：通过行为推断态度' },
          { text: '经典条件反射：刺激与反应联结' }
        ],
        explain: '认知失调发生在做出难以撤回的选择之后，消费者会主动寻找支持信息、回避反对信息来降低不适。感谢信、使用指南、宽松退货都能帮助降低失调，提高满意度。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '说服的四类基本要素包括下列哪些？（多选）',
        options: [
          { text: '信息来源（谁在说）', correct: true },
          { text: '信息本身（说什么、怎么说）', correct: true },
          { text: '传播渠道（在哪里说）', correct: true },
          { text: '接收者（对谁说）', correct: true },
          { text: '竞争对手的库存' }
        ],
        explain: '来源、信息、渠道、接收者构成说服的四要素。同一句话，专家说与路人说、放在测评里与放在广告里、对高卷入与低卷入的人说，效果都不同。分析说服失败时，先定位是哪一要素出了问题。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-7', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '消费者说「我很在意环保」，实际购买时却不看环保标签，这种不一致称为态度—____差距。',
        answer: '行为', accept: ['行为', 'behavior', 'behaviour'],
        explain: '态度—行为差距（attitude-behavior gap）指口头态度与实际行为不一致，原因包括价格、便利性、社会可见性、习惯。测量时把「购买意向」与「实际购买」对照，才知道态度有多强的预测力。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '关于电子口碑（eWOM）的可信度，下列哪项最准确？',
        options: [
          { text: '具体、包含缺点与使用条件的测评，通常比全是优点的软文更可信', correct: true },
          { text: '好评数量越多，可信度一定越高' },
          { text: '差评一定是竞争对手刷的，可以忽略' },
          { text: '只有明星代言的内容才算电子口碑' }
        ],
        explain: 'eWOM 的说服力取决于可信度与相关性，不是数量。愿意讲「什么情况下不推荐」的测评，说明作者真的用过；全是优点的内容容易被判为广告。品牌应让真实体验更容易被看见，而不是刷好评、删差评。'
      },

      /* ---------------- ch06 消费者决策 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '下列哪项最符合「名义型决策」？',
        options: [
          { text: '每周买同一款牛奶，几乎不比较，拿了就走', correct: true },
          { text: '花两周研究参数后买一台笔记本电脑' },
          { text: '在两家餐厅之间比较评价数后选一家' },
          { text: '为婚礼挑选场地，实地考察五家' }
        ],
        explain: '名义型决策是低卷入、低风险、习惯化的购买：问题识别后直接跳到「买老样子」，几乎不做外部搜索。营销任务是「被想起、被找到、防缺货」，而不是讲新卖点。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '消费者决策五阶段的正确顺序是：',
        options: [
          { text: '问题识别 → 信息搜索 → 方案评估 → 购买 → 购后', correct: true },
          { text: '信息搜索 → 问题识别 → 购买 → 方案评估 → 购后' },
          { text: '方案评估 → 问题识别 → 信息搜索 → 购后 → 购买' },
          { text: '购买 → 问题识别 → 信息搜索 → 方案评估 → 购后' }
        ],
        explain: '五阶段是逻辑顺序：先意识到差距（问题识别），再找信息，再比较（方案评估），再交易（购买），最后使用与评价（购后）。现实中会跳步与回退，但拆解时按这五段定位流失点最清楚。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '消费者的考虑集通常包含几十个品牌，所以进入考虑集并不难。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '考虑集通常只有 3–7 个品牌，甚至更少。考虑集之外的品牌不是「被否定」，而是根本没进入视野。营销的第一目标因此是「先进入考虑集」，入口（搜索、货架、推荐）比说服更靠前。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '「续航低于 8 小时的不考虑，其余再比」使用的是哪种评估规则？',
        options: [
          { text: '连接规则（conjunctive）：每项都要达到最低标准', correct: true },
          { text: '补偿性规则：高分可以补低分' },
          { text: '析取规则：一项突出即可' },
          { text: '词典规则：只看最重要的一项' }
        ],
        explain: '连接规则给每个属性设最低门槛，任一不达标就淘汰，不允许其他属性弥补。它对应风险厌恶、有硬性要求的消费者。营销上要先确保没有致命短板，再谈总分。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些属于非补偿性评估规则？（多选）',
        options: [
          { text: '连接规则（conjunctive）', correct: true },
          { text: '析取规则（disjunctive）', correct: true },
          { text: '词典规则（lexicographic）', correct: true },
          { text: '排除规则（elimination-by-aspects）', correct: true },
          { text: '加权加法规则' }
        ],
        explain: '加权加法是补偿性规则，允许一个属性的高分弥补另一个属性的低分。连接、析取、词典、排除都不允许弥补，只是筛选逻辑不同：全过线、一项突出、按首要属性排序、逐项淘汰。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '期望—不一致模型中，感知表现低于购前期望时，消费者通常会产生____。',
        answer: '不满意', accept: ['不满意', '不满', 'dissatisfaction'],
        explain: '满意度取决于期望与感知表现的比较：高于期望满意，等于期望中性，低于期望不满意。过度承诺会把期望拉高，即使产品不错也会「不如预期」，所以「低调发布、惊喜交付」常更有效。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '「以旧换新」在消费者决策过程中属于哪个环节？',
        options: [
          { text: '处置：处理旧产品，同时降低新产品的购买门槛', correct: true },
          { text: '问题识别：发现自己需要新产品' },
          { text: '信息搜索：比较不同品牌的参数' },
          { text: '方案评估：给候选品牌打分' }
        ],
        explain: '以旧换新同时发生在处置与购买两个环节：消费者把旧物交回（处置），用折价降低新品的实际支付（购买）。它既解决「旧物怎么处理」，又缩短「买新的」的心理距离。'
      },

      /* ---------------- ch07 社会与文化 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '朋友说「这家修车店不坑人」，你因此去了。这属于哪种参照群体影响？',
        options: [
          { text: '信息性影响：把别人的证据当作事实', correct: true },
          { text: '规范性影响：为了合群而顺从' },
          { text: '价值表达性影响：为了表达身份' },
          { text: '回避群体影响：不想成为某种人' }
        ],
        explain: '信息性影响发生在不确定、难验证的场合，消费者把「懂行的人」的判断当作证据。规范性影响是为了奖惩与合群，价值表达性影响是为了认同某个群体的价值。三种机制对应完全不同的营销做法。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '「两阶段流动」模型描述的是：',
        options: [
          { text: '信息先从媒体到意见领袖，再由意见领袖传给周围的人', correct: true },
          { text: '消费者先买便宜的，再买贵的' },
          { text: '广告先投电视，再投报纸' },
          { text: '产品先在一线城市卖，再到三线城市' }
        ],
        explain: '两阶段流动（two-step flow）强调意见领袖的中介作用：媒体信息不一定直接作用于大众，而是先被意见领袖接收、解释，再通过人际网络扩散。社交平台把这两个阶段压缩到同一条时间线里。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '社会阶层只由收入决定，收入相同的人消费方式一定相同。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '社会阶层通常由收入、教育、职业、居住地等组合决定，还包括文化资本与品味。收入相同的人，可能因教育与职业差异而有完全不同的消费风格。只按收入分层，容易把不同逻辑的人拍成同一群人。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '凡勃伦（Veblen）所说的「炫耀性消费」最接近下列哪项？',
        options: [
          { text: '买一件大 logo 的限量外套，主要为了让别人看见', correct: true },
          { text: '买一款小众专业装备，只有圈内人认得' },
          { text: '因为旧物坏了而买一件替换品' },
          { text: '为了省时间而买预制菜' }
        ],
        explain: '炫耀性消费是为显示地位而进行的显眼消费：贵、可见、容易被识别。小众专业装备属于更隐晦的地位信号，门槛在知识而非价格；替换旧物与省时间都不以「被看见」为目的。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '霍夫斯泰德的文化维度包括下列哪些？（多选）',
        options: [
          { text: '个人主义—集体主义', correct: true },
          { text: '权力距离', correct: true },
          { text: '不确定性规避', correct: true },
          { text: '长期—短期导向', correct: true },
          { text: '品牌忠诚度' }
        ],
        explain: '霍夫斯泰德常用维度包括个人主义—集体主义、权力距离、不确定性规避、长期—短期导向（以及男性化—女性化等）。它们是粗颗粒比较工具，能提示方向，不能替代本地调研；品牌忠诚度是消费者指标，不是文化维度。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '核心资产全球统一、表达层按当地文化适配的策略，称为全球____。',
        answer: '本土化', accept: ['本土化', '在地化', 'localization', 'glocalization'],
        explain: '全球本土化（glocalization）是标准化与本地化的折中：核心配方、设计、体验保持全球一致，菜单、价格、渠道、传播按市场调整。只改传播不改产品，容易被视为「换皮」。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '品牌想进入滑板亚文化，最稳妥的第一步是：',
        options: [
          { text: '赞助社区活动、提供场地或维修，先成为对圈内有用的角色', correct: true },
          { text: '直接拍一支「很酷」的广告，把滑板当拍照道具' },
          { text: '请流量明星穿滑板服代言' },
          { text: '把产品价格降到最低，靠便宜取胜' }
        ],
        explain: '亚文化有门槛与规矩，品牌应先提供价值、尊重术语与规则，再谈卖货。只借符号、用圈外人定义圈内事，容易被原住民识破并公开抵制。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
