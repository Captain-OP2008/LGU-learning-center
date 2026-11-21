/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 每项字段：{ id:'ch01-q1', ch:'ch01', kp:'ch01-1', tier:1, type:'mcq'|'tf'|'fill'|'multi'|'predict',
 *            difficulty:1, tags:['concept'], stem, options:[{text, correct:true?}], explain }
 * fill 类型另有 answer / accept；predict 类型另有 code / answer。
 * 结构：每章 7 题（q1–q3 与正文内嵌题对应），全站 56 题，每题都写 explain。
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '中级微观经济学的核心问题可以概括为下面哪一句？',
        options: [
          { text: '在资源稀缺的条件下，人们如何在相互竞争的目标之间做选择', correct: true },
          { text: '如何预测股票市场的短期涨跌', correct: false },
          { text: '如何用数学证明所有市场都会自动出清', correct: false },
          { text: '如何统计一个国家的 GDP 增长率', correct: false }
        ],
        explain: '微观经济学的起点是稀缺性与选择：给定预算与技术约束，消费者和厂商如何取舍。价格只是这种取舍的信号，而不是研究对象本身；预测股价与核算 GDP 分别是金融学与宏观统计的任务。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['map'],
        stem: '本站八章的推进顺序，下列哪一条是正确的？',
        options: [
          { text: '预算与偏好 → 消费者选择 → 不确定性与跨期 → 技术与成本 → 竞争均衡 → 垄断与寡头 → 一般均衡与失灵', correct: true },
          { text: '一般均衡 → 垄断 → 竞争 → 成本 → 偏好 → 需求 → 失灵', correct: false },
          { text: '技术与成本 → 预算与偏好 → 竞争均衡 → 消费者选择 → 寡头 → 失灵', correct: false },
          { text: '垄断与寡头 → 竞争均衡 → 成本 → 需求 → 偏好 → 一般均衡', correct: false }
        ],
        explain: '顺序遵循「先建立消费者语言、再建立厂商语言、然后加总成市场、最后引入市场势力与失灵」的逻辑。每一章都在前一章的基础上放松一个假设，倒过来学会缺少必要的工具。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['method'],
        stem: '经济模型的假设越贴近现实越好，假设越少模型就越可靠。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '模型的价值在于「用最少的假设得到可检验的结论」。假设越贴近现实，模型往往越复杂、越难推出明确结论；判断模型好坏的标准是它能否解释现象、能否给出可反驳的预测，而不是假设的数量。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'fill', difficulty: 1,
        tags: ['method'],
        stem: '边际分析的核心，是比较多一单位行为带来的边际收益与______。',
        answer: '边际成本',
        accept: ['边际成本', 'marginal cost', 'MC'],
        explain: '只要边际收益大于边际成本，增加一单位行为就能改善结果；两者相等时达到最优。这一条几乎贯穿全书：消费者比较 MU 与价格，厂商比较 MR 与 MC。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['map'],
        stem: '下列哪些属于本站贯穿全课的「主线」？（多选）',
        options: [
          { text: '最优化：给定约束求最优选择', correct: true },
          { text: '均衡：所有人的选择相互抵消', correct: true },
          { text: '福利：比较不同配置的效率', correct: true },
          { text: '会计：按复式记账核对每一笔交易', correct: false }
        ],
        explain: '三条主线（最优化、均衡、福利）加上比较静态，构成本书的分析框架。会计记账是实务技能，不是微观经济学的分析主线；它处理的是记录，而不是选择与均衡。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['example'],
        stem: '课程用「校园咖啡店」作贯穿案例，主要目的是什么？',
        options: [
          { text: '让同一组数字在预算、需求、成本、定价各章反复出现，看清模型的连续性', correct: true },
          { text: '证明咖啡行业是完全竞争市场', correct: false },
          { text: '说明经济学只研究餐饮业', correct: false },
          { text: '用它替代教材中的全部理论推导', correct: false }
        ],
        explain: '贯穿案例的作用是「同一组数字、不同章节反复使用」，让抽象条件落在具体数字上。它既不能证明某个市场结构，也不能替代推导；案例是理解的脚手架，不是结论本身。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'fill', difficulty: 1,
        tags: ['assessment'],
        stem: '本站模拟卷 A 的满分是______分。',
        answer: '100',
        accept: ['100', '一百分'],
        explain: '模拟卷按 100 分设计，题型与分值分布对应期末考核；做完后应按分值分配时间自评，而不是只对答案。'
      },

      /* ---------------- ch01 预算、偏好与效用 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['calc'],
        stem: '预算线 <code>p1x1 + p2x2 = m</code> 的斜率（以 <code>x1</code> 为横轴）等于下列哪一项？',
        options: [
          { text: '<code>−p1/p2</code>', correct: true },
          { text: '<code>−p2/p1</code>', correct: false },
          { text: '<code>p1/p2</code>', correct: false },
          { text: '<code>−m/p1</code>', correct: false }
        ],
        explain: '把预算线改写成 <code>x2 = m/p2 − (p1/p2)x1</code>，斜率就是 <code>−p1/p2</code>。它的含义是多买一单位商品 1 必须放弃多少单位商品 2，即用商品 2 计价的机会成本。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '给定效用函数 <code>u(x1, x2)</code>，边际替代率 MRS 等于下列哪一项？',
        options: [
          { text: '<code>MU1/MU2</code>', correct: true },
          { text: '<code>MU2/MU1</code>', correct: false },
          { text: '<code>p1/p2</code>', correct: false },
          { text: '<code>p2/p1</code>', correct: false }
        ],
        explain: '对 <code>u</code> 全微分并令 <code>du = 0</code>，得 <code>MU1dx1 + MU2dx2 = 0</code>，移项即 <code>MRS = −dx2/dx1 = MU1/MU2</code>。价格比是最优解处才成立的相切条件，不是 MRS 的定义。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '下列哪一个变换会改变消费者在两种商品之间的偏好顺序？',
        options: [
          { text: '<code>u → −u</code>', correct: true },
          { text: '<code>u → 2u</code>', correct: false },
          { text: '<code>u → u + 7</code>', correct: false },
          { text: '<code>u → √u</code>（<code>u &gt; 0</code>）', correct: false }
        ],
        explain: '偏好顺序不变要求变换严格递增。<code>2u</code>、<code>u+7</code>、<code>√u</code> 都是严格递增的，只有乘负数（或加负号）会翻转顺序，使「更好」变成「更差」，因此会改变选择。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '同一消费者的两条无差异曲线在图上可以相交。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '若两条曲线相交，交点同时属于两个不同的效用水平；沿曲线各取一点再比较，会推出「A 好于 A」的矛盾，违反传递性。因此无差异曲线互不相交，这是传递性公理的几何后果。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: 'Cobb-Douglas 效用 <code>u = x1<sup>a</sup>x2<sup>1−a</sup></code> 的边际替代率 MRS 等于______（用 <code>a, x1, x2</code> 表示）。',
        answer: 'a x2/((1−a)x1)',
        accept: ['a x2/((1-a)x1)', 'a x2 / ((1−a) x1)', 'a/(1−a)·x2/x1', 'ax2/((1-a)x1)'],
        explain: '两个偏导分别是 <code>a x1<sup>a−1</sup>x2<sup>1−a</sup></code> 与 <code>(1−a)x1<sup>a</sup>x2<sup>−a</sup></code>，相除并约去公因子，得到 <code>a x2/((1−a)x1)</code>。它随 <code>x1</code> 增加而递减，对应无差异曲线凸向原点。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-2', tier: 2, type: 'multi', difficulty: 2,
        tags: ['graph'],
        stem: '关于预算线的移动，下列哪些说法正确？（多选）',
        options: [
          { text: '收入上升使预算线平行外移，斜率不变', correct: true },
          { text: '<code>p1</code> 上升使预算线绕纵截距向内旋转，变得更陡', correct: true },
          { text: '两种价格与收入同比例上升时，预算集不变', correct: true },
          { text: '收入上升会改变预算线的斜率', correct: false }
        ],
        explain: '收入只决定截距，不改变价格比，所以斜率不变；单一价格上升改变横截距与斜率；三者同比例上升时不等式两边同除该比例，集合不变（齐次性）。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '「序数效用」的含义是下列哪一项？',
        options: [
          { text: '效用数值只表示偏好顺序，不表示幸福的大小或倍数', correct: true },
          { text: '效用可以用具体数字精确测量并加总', correct: false },
          { text: '效用必须按整数排列，不能取小数', correct: false },
          { text: '不同人的效用可以直接比较大小', correct: false }
        ],
        explain: '序数效用只要求「更好的消费束编号更大」，所以严格递增变换不改变选择。基数效用才要求数值可比，它在不确定性下的期望效用与福利加总中才需要。'
      },

      /* ---------------- ch02 消费者选择与需求 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '拉格朗日乘子 <code>λ</code> 的经济含义是什么？',
        options: [
          { text: '放松一单位预算约束带来的最优效用增量，即收入的边际效用', correct: true },
          { text: '消费者购买第一种商品的数量', correct: false },
          { text: '预算线的斜率', correct: false },
          { text: '无差异曲线的曲率', correct: false }
        ],
        explain: '由包络定理，<code>λ = ∂u*/∂m</code>，即收入增加一元带来的效用增量。它的数值依赖效用函数的具体形式，所以不能跨消费者比较大小，也不能把它当成「幸福总量」。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['graph'],
        stem: '若 <code>u = 2x1 + x2</code>，且 <code>p1/p2 = 2</code>，最优消费束是什么？',
        options: [
          { text: '整条预算线上的任何一点都最优', correct: true },
          { text: '只买商品 1', correct: false },
          { text: '只买商品 2', correct: false },
          { text: '两种商品各买一半', correct: false }
        ],
        explain: '完全替代品的无差异曲线斜率恒为 <code>MRS = 2/1 = 2</code>，恰好等于价格比 <code>p1/p2 = 2</code>，两条线重合，预算线上每一点都带来相同效用，都是最优解。若价格比大于 2 就全买商品 2，小于 2 就全买商品 1——这正是角点解。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '价格上升时，替代效应对该商品需求量的影响方向是？',
        options: [
          { text: '一定为负，即需求量下降', correct: true },
          { text: '一定为正，即需求量上升', correct: false },
          { text: '取决于商品是正常品还是劣等品', correct: false },
          { text: '恒等于零', correct: false }
        ],
        explain: '替代效应是在保持原效用（或原购买力）的前提下，沿无差异曲线移动的结果。价格上升使该商品相对变贵，消费者必然用其他商品替代它，所以替代效应恒为负；符号不确定的是收入效应。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '需求函数对价格与收入是零次齐次的：把 <code>p1、p2、m</code> 同时乘以 2，需求量不变。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '三者同比例变化时预算集完全不变，最优消费束也不变，所以需求函数是零次齐次的。这正是「只有相对价格与实际收入重要」的形式化表达，也叫没有货币幻觉。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'fill', difficulty: 1,
        tags: ['definition'],
        stem: '收入弹性大于 1 的商品称为______。',
        answer: '奢侈品',
        accept: ['奢侈品', 'luxury', 'luxury good'],
        explain: '收入弹性大于 1 意味着收入增加时该商品支出占比上升，是奢侈品；介于 0 与 1 之间是必需品；小于 0 是劣等品。分类依据是收入弹性，不是价格高低。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-8', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下列关于消费者选择的说法，哪些是错误的？（多选）',
        options: [
          { text: '所有题都可以令 MRS 等于价格比来求解', correct: true },
          { text: '解出负的消费量时应取绝对值', correct: true },
          { text: '收入效应就是名义收入发生了变化', correct: true },
          { text: '完全互补品的最优解在折点上', correct: false }
        ],
        explain: '前三条都是典型错误：角点解与折点解不满足相切条件；负解说明最优在边界；收入效应是价格变化引起的实际购买力变化，不是名义收入变化。只有第四条正确。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['welfare'],
        stem: '用需求曲线下方的面积衡量消费者剩余，在什么条件下严格成立？',
        options: [
          { text: '拟线性效用，或价格变化足够小', correct: true },
          { text: '任何凸偏好下都严格成立', correct: false },
          { text: '只有完全互补品才成立', correct: false },
          { text: '只有垄断市场才成立', correct: false }
        ],
        explain: '一般效用下价格变化会改变货币的边际效用，面积只是近似。拟线性效用下 <code>λ</code> 为常数，面积才严格等于效用变化；否则应使用补偿变化或等价变化。'
      },

      /* ---------------- ch03 不确定性与跨期选择 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '期望效用的正确计算顺序是下列哪一项？',
        options: [
          { text: '先对每个结果取效用，再按概率加权', correct: true },
          { text: '先按概率加权算出期望金额，再取效用', correct: false },
          { text: '先取效用的平方，再按概率加权', correct: false },
          { text: '两种顺序完全等价，结果相同', correct: false }
        ],
        explain: '期望效用是 <code>Σπs·u(cs)</code>。若先算期望金额再取效用，得到的是 <code>u(EV)</code>，只有在 <code>u</code> 为线性时才与前者相等；两者之差恰好反映风险态度。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '风险厌恶者的风险溢价应如何表示？',
        options: [
          { text: '<code>EV − CE &gt; 0</code>', correct: true },
          { text: '<code>CE − EV &gt; 0</code>', correct: false },
          { text: '恒等于零', correct: false },
          { text: '恒等于方差', correct: false }
        ],
        explain: '确定性等价 <code>CE</code> 是带来与彩票相同效用的确定金额，风险厌恶时 <code>CE &lt; EV</code>，所以风险溢价 <code>RP = EV − CE</code> 为正，表示愿意为消除风险放弃的金额。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '两期消费的跨期预算约束可以写成下列哪一项？',
        options: [
          { text: '<code>c1 + c2/(1+r) = m1 + m2/(1+r)</code>', correct: true },
          { text: '<code>c1 + c2 = m1 + m2</code>', correct: false },
          { text: '<code>c1(1+r) + c2 = m1(1+r) + m2</code>', correct: false },
          { text: '<code>c1 − c2/(1+r) = m1 − m2/(1+r)</code>', correct: false }
        ],
        explain: '第一期储蓄 <code>s = m1 − c1</code>，第二期消费 <code>c2 = m2 + (1+r)s</code>，消去 <code>s</code> 即得。等式两边都是现值；第二期消费的价格是 <code>1/(1+r)</code>，利率越高未来消费越便宜。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '期望效用函数是凹函数时，消费者是风险厌恶的。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '凹性意味着 <code>u(EV) &gt; E[u]</code>（詹森不等式），确定金额的效用高于同期望值彩票的期望效用，所以偏好确定结果，即风险厌恶。线性为风险中性，凸为风险偏好。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'fill', difficulty: 2,
        tags: ['insurance'],
        stem: '保费为精算公平时，风险厌恶者的最优投保额等于______。',
        answer: '全部损失',
        accept: ['全部损失', '损失全额', 'L', '全额投保'],
        explain: '精算公平指保费率等于损失概率。此时每元保额的期望成本等于期望赔付，风险厌恶者会把保额买到等于可能损失，使两种状态下的财富相等，从而完全消除风险。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下列哪些说法正确？（多选）',
        options: [
          { text: '利率上升对储蓄的影响不确定，取决于替代效应与收入效应的相对大小', correct: true },
          { text: '费雪分离定理要求所有人面对同一利率且可以自由借贷', correct: true },
          { text: '把资金分散到相关性低的资产可以降低非系统性风险', correct: true },
          { text: '利率上升一定使储蓄增加', correct: false }
        ],
        explain: '利率上升使未来消费更便宜（替代效应鼓励储蓄），同时提高未来财富（收入效应鼓励当期消费），净效应不确定。费雪分离依赖统一利率与自由借贷；分散只能消除非系统性风险。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['definition'],
        stem: '「彩票」在不确定性理论中指的是什么？',
        options: [
          { text: '一组「结果 + 概率」的列表', correct: true },
          { text: '一张可以兑奖的纸质凭证', correct: false },
          { text: '任何有风险的投资项目', correct: false },
          { text: '消费者对未来价格的预期', correct: false }
        ],
        explain: '彩票是形式化的对象：<code>(p1,…,pn; x1,…,xn)</code>，表示以概率 <code>pi</code> 得到结果 <code>xi</code>。把风险写成彩票，才能定义期望值与期望效用，并与状态依存消费一一对应。'
      },

      /* ---------------- ch04 技术、成本与利润 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['calc'],
        stem: '边际技术替代率 MRTS 等于下列哪一项？',
        options: [
          { text: '<code>MP_L/MP_K</code>', correct: true },
          { text: '<code>MP_K/MP_L</code>', correct: false },
          { text: '<code>w/r</code>', correct: false },
          { text: '<code>r/w</code>', correct: false }
        ],
        explain: '沿等产量线全微分得 <code>MP_L·dL + MP_K·dK = 0</code>，所以 <code>MRTS = −dK/dL = MP_L/MP_K</code>。它衡量多用一单位劳动可少用多少资本；<code>w/r</code> 是等成本线斜率，两者在成本最小化处相等。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['graph'],
        stem: '边际成本 <code>MC</code> 曲线与平均成本 <code>AC</code> 曲线的关系是？',
        options: [
          { text: '<code>MC</code> 穿过 <code>AC</code> 的最低点', correct: true },
          { text: '<code>MC</code> 穿过 <code>AC</code> 的最高点', correct: false },
          { text: '两者永不相交', correct: false },
          { text: '<code>MC</code> 恒等于 <code>AC</code>', correct: false }
        ],
        explain: '由 <code>d(AC)/dq = (MC − AC)/q</code>，当 <code>MC &lt; AC</code> 时 <code>AC</code> 下降，<code>MC &gt; AC</code> 时 <code>AC</code> 上升，所以交点必为 <code>AC</code> 的最低点。同一逻辑适用于 <code>AVC</code> 与 <code>MC</code>。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['supply'],
        stem: '短期内厂商决定是否停产，临界点是下列哪一个？',
        options: [
          { text: '价格低于平均可变成本 <code>AVC</code> 的最低点', correct: true },
          { text: '价格低于平均成本 <code>AC</code> 的最低点', correct: false },
          { text: '价格低于零', correct: false },
          { text: '利润等于零', correct: false }
        ],
        explain: '短期固定成本已经沉没，只要价格能覆盖平均可变成本，继续生产就比停产少亏。价格低于 <code>min AVC</code> 时，生产越多亏越多，应停产；<code>min AC</code> 是长期退出点。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '一个生产函数不可能同时具有边际报酬递减与规模报酬递增。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '两者比较的对象不同：边际报酬递减是固定其他要素、只增加一种要素；规模报酬递增是所有要素同比例增加。Cobb-Douglas 在 <code>α &lt; 1</code> 且 <code>α+β &gt; 1</code> 时两者同时成立。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'fill', difficulty: 1,
        tags: ['calc'],
        stem: 'Cobb-Douglas 生产函数 <code>q = AL<sup>α</sup>K<sup>β</sup></code> 具有规模报酬不变时，指数和 <code>α + β</code> 等于______。',
        answer: '1',
        accept: ['1', '一'],
        explain: '把 <code>L、K</code> 同乘 <code>t</code> 得 <code>t<sup>α+β</sup>q</code>。规模报酬不变要求 <code>t<sup>α+β</sup> = t</code>，即 <code>α + β = 1</code>；大于 1 为递增，小于 1 为递减。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '关于短期与长期，下列哪些说法正确？（多选）',
        options: [
          { text: '短期的区分标准是「至少有一种要素不可调整」，与日历时间长短无关', correct: true },
          { text: '长期没有固定成本，所有要素都可变', correct: true },
          { text: '短期平均成本曲线是 U 形，与固定成本摊薄和边际报酬递减有关', correct: true },
          { text: '长期平均成本曲线也是 U 形，原因与短期完全相同', correct: false }
        ],
        explain: '短期与长期由要素可调整性定义。短期 U 形来自固定成本摊薄与边际报酬递减；长期没有固定成本，<code>AC</code> 形状由规模报酬决定，可能下降、水平或上升，原因不同。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '成本最小化的内点解满足下列哪个条件？',
        options: [
          { text: '<code>MP_L/w = MP_K/r</code>', correct: true },
          { text: '<code>MP_L/MP_K = r/w</code>', correct: false },
          { text: '<code>wL = rK</code> 恒成立', correct: false },
          { text: '<code>MP_L = MP_K</code>', correct: false }
        ],
        explain: '相切条件是 <code>MRTS = w/r</code>，即 <code>MP_L/MP_K = w/r</code>，交叉相乘得 <code>MP_L/w = MP_K/r</code>：每一元钱花在两种要素上的边际产量相等，否则把钱挪到效率高的一边还能降成本。'
      },

      /* ---------------- ch05 完全竞争与市场均衡 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['supply'],
        stem: '私人物品的市场供给曲线如何由单个厂商的供给曲线得到？',
        options: [
          { text: '在每一价格上把各厂商的供给量相加（水平加总）', correct: true },
          { text: '在每一数量上把各厂商的价格相加（垂直加总）', correct: false },
          { text: '取各厂商供给量的算术平均', correct: false },
          { text: '取各厂商供给曲线的最大斜率', correct: false }
        ],
        explain: '市场供给是「同一价格下所有厂商愿意卖出的数量之和」，所以是水平加总。垂直加总适用于公共品——所有人消费同一数量，社会边际支付意愿才相加。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['elasticity'],
        stem: '若某商品需求富有弹性（<code>|ε| &gt; 1</code>），降价会对总收益产生什么影响？',
        options: [
          { text: '总收益增加', correct: true },
          { text: '总收益减少', correct: false },
          { text: '总收益不变', correct: false },
          { text: '无法判断，取决于成本', correct: false }
        ],
        explain: '富有弹性时销量增加的比例大于价格下降的比例，所以 <code>P·Q</code> 上升。由 <code>dTR/dP = Q(1+ε)</code>，<code>ε &lt; −1</code> 时导数为负，降价（<code>dP &lt; 0</code>）使收益增加。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['tax'],
        stem: '对某商品征收从量税，税负主要由谁承担？',
        options: [
          { text: '供给与需求中弹性较小的一方', correct: true },
          { text: '法律上负责缴税的一方', correct: false },
          { text: '总是消费者', correct: false },
          { text: '总是生产者', correct: false }
        ],
        explain: '归宿由相对弹性决定：弹性小意味着替代选项少、逃不掉，税负容易转嫁到这一方。法律规定谁缴税不影响经济归宿，只影响征管流程。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'tf', difficulty: 2,
        tags: ['comparative-statics'],
        stem: '需求与供给同时向右移动时，均衡数量一定增加，但均衡价格的变化方向不确定。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '需求右移推高价格与数量，供给右移压低价格、推高数量，数量方向一致所以确定；价格受两股相反力量拉扯，净效应取决于两者移动幅度，不能仅凭图形判断。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'fill', difficulty: 2,
        tags: ['elasticity'],
        stem: '总收益在需求价格弹性等于______时达到最大。',
        answer: '-1',
        accept: ['-1', '−1', '负一'],
        explain: '由 <code>dTR/dP = Q(1+ε)</code>，当 <code>ε = −1</code> 时导数为零，总收益取极值（最大）。这一点把线性需求曲线分成富有弹性与缺乏弹性两段。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['policy'],
        stem: '最高限价低于均衡价格时，可能出现下列哪些后果？（多选）',
        options: [
          { text: '短缺与排队', correct: true },
          { text: '黑市交易，价格高于限价', correct: true },
          { text: '厂商降低质量以变相涨价', correct: true },
          { text: '过剩与滞销', correct: false }
        ],
        explain: '限价压低价格，需求量大于供给量，出现短缺；短缺会催生排队、配给、黑市与质量下降。过剩是「最低限价」高于均衡价时的后果，方向相反。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['welfare'],
        stem: '在供需曲线给定的条件下，总剩余在什么时候最大？',
        options: [
          { text: '竞争均衡的数量上', correct: true },
          { text: '垄断产量上', correct: false },
          { text: '产量为零时', correct: false },
          { text: '价格最高时', correct: false }
        ],
        explain: '只要买方支付意愿高于卖方边际成本，多交易一单位就增加剩余；均衡处两者相等，再增加或减少交易都会减少总剩余。偏离均衡的数量都会产生无谓损失。'
      },

      /* ---------------- ch06 垄断、定价与寡头 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['monopoly'],
        stem: '垄断厂商的边际收益与价格的关系是？',
        options: [
          { text: '<code>MR = p(1 + 1/ε) &lt; p</code>', correct: true },
          { text: '<code>MR = p</code>', correct: false },
          { text: '<code>MR = p(1 − ε) &gt; p</code>', correct: false },
          { text: '<code>MR = 0</code> 恒成立', correct: false }
        ],
        explain: '需求向下倾斜时多卖一单位必须降价，降价损失由全部销量承担，所以 <code>MR &lt; p</code>。用弹性表示即 <code>MR = p(1 + 1/ε)</code>，<code>ε</code> 取负值，括号小于 1。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['pricing'],
        stem: '学生票、老人票这类按群体定价属于哪种价格歧视？',
        options: [
          { text: '三级价格歧视', correct: true },
          { text: '一级价格歧视', correct: false },
          { text: '二级价格歧视', correct: false },
          { text: '不属于价格歧视', correct: false }
        ],
        explain: '三级歧视按可观测的群体特征定价，要求群体可识别且转售困难（查学生证）。一级是按每个人的保留价格定价，二级是按购买量分段定价，三者条件不同。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['oligopoly'],
        stem: '线性需求、相同常数边际成本的双寡头古诺均衡，总产量是竞争产量的多少？',
        options: [
          { text: '<code>2/3</code>', correct: true },
          { text: '<code>1/2</code>', correct: false },
          { text: '<code>3/4</code>', correct: false },
          { text: '<code>1</code>', correct: false }
        ],
        explain: '设竞争产量 <code>D = (a−c)/b</code>，古诺两家各产 <code>(a−c)/(3b)</code>，合计 <code>2D/3</code>。垄断是 <code>D/2</code>，斯塔克尔伯格是 <code>3D/4</code>，三者构成常用的产量排序。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'tf', difficulty: 2,
        tags: ['regulation'],
        stem: '对自然垄断按边际成本定价，厂商会出现亏损，需要政府补贴。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '自然垄断的平均成本在相关产量范围内递减，所以 <code>MC &lt; AC</code>。按 <code>p = MC</code> 定价会使价格低于平均成本，厂商亏损；这正是「边际成本定价」需要补贴的原因。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '需求 <code>p = a − b(q1+q2)</code>、边际成本均为 <code>c</code> 时，古诺均衡中每家厂商的产量是______。',
        answer: '(a−c)/(3b)',
        accept: ['(a-c)/(3b)', '(a−c)/(3b)', '(a-c)/3b'],
        explain: '由反应函数 <code>qi = (a−c−bqj)/(2b)</code> 联立，代入对称条件 <code>q1 = q2</code>，解得 <code>q = (a−c)/(3b)</code>。总产量是它的两倍，价格为 <code>(a+2c)/3</code>。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['game'],
        stem: '下列哪些机制有助于维持卡特尔式的串谋？（多选）',
        options: [
          { text: '博弈无限期重复，且厂商足够有耐心', correct: true },
          { text: '价格与销量公开可观测，背叛容易被发现', correct: true },
          { text: '存在行业协会等降低协调成本的制度', correct: true },
          { text: '厂商数量很多且成本差异很大', correct: false }
        ],
        explain: '重复博弈让「背叛的短期收益」被「未来利润损失」抵消；可观测性使惩罚可信；制度降低协调成本。厂商数量多、成本差异大反而使协调困难、串谋不稳定。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['oligopoly'],
        stem: '同质产品、相同常数边际成本的两家厂商进行伯特兰价格竞争，均衡价格是？',
        options: [
          { text: '等于边际成本', correct: true },
          { text: '等于垄断价格', correct: false },
          { text: '等于古诺价格', correct: false },
          { text: '高于边际成本但低于垄断价格', correct: false }
        ],
        explain: '只要价格高于边际成本，任一家降价一点就能独占市场并获利，所以任何高于 <code>c</code> 的价格都不是均衡；<code>p1 = p2 = c</code> 时无人愿意偏离。这就是伯特兰悖论。'
      },

      /* ---------------- ch07 一般均衡、福利与失灵 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['efficiency'],
        stem: '埃奇沃思盒中，交换的帕累托效率要求满足什么条件？',
        options: [
          { text: '<code>MRS<sup>A</sup> = MRS<sup>B</sup></code>', correct: true },
          { text: '<code>MRS<sup>A</sup> + MRS<sup>B</sup> = 1</code>', correct: false },
          { text: '两人消费量相等', correct: false },
          { text: '<code>MRS<sup>A</sup> = p1/p2</code> 即可', correct: false }
        ],
        explain: '若两人 MRS 不等，就存在一个双方都接受的交换比率，可实现互惠交易；相等时交易空间耗尽，配置落在契约曲线上。注意效率不要求两人消费量相等，分配是另一个问题。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['externality'],
        stem: '庇古税治理负外部性的基本思路是？',
        options: [
          { text: '按边际外部成本征税，使私人成本等于社会成本', correct: true },
          { text: '禁止产生外部性的全部生产活动', correct: false },
          { text: '把产权无偿分配给受害者', correct: false },
          { text: '对受害者发放等额补贴', correct: false }
        ],
        explain: '负外部性使私人边际成本低于社会边际成本，产量过高。庇古税把差额 <code>MEC</code> 加进私人成本，使厂商自行选择有效产量。产权界定是科斯思路，两者工具不同。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['information'],
        stem: '「逆向选择」与「道德风险」的区别是什么？',
        options: [
          { text: '前者发生在交易之前、涉及类型不可观测；后者发生在交易之后、涉及行为不可观测', correct: true },
          { text: '前者只存在于保险市场，后者只存在于劳动市场', correct: false },
          { text: '两者是同一现象的不同叫法', correct: false },
          { text: '前者由政府造成，后者由企业造成', correct: false }
        ],
        explain: '逆向选择是「选错了人」：信息劣势方按平均质量定价，把高质量者挤出市场（柠檬市场）。道德风险是「人变了」：交易后一方因后果由对方承担而改变行为（全险司机更不小心）。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'tf', difficulty: 2,
        tags: ['public-good'],
        stem: '公共品的最优供给条件要求把每个人的边际支付意愿垂直相加，再等于边际成本。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '公共品是非竞争的：所有人消费同一数量，所以社会边际收益是个人边际支付意愿之和（垂直加总），这就是萨缪尔森条件 <code>ΣMBi = MC</code>。私人物品才是水平加总。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'fill', difficulty: 1,
        tags: ['welfare'],
        stem: '福利经济学第一定理说：在完全竞争、无外部性、信息完全的条件下，竞争均衡是______有效的。',
        answer: '帕累托',
        accept: ['帕累托', 'Pareto', '帕累托（Pareto）'],
        explain: '帕累托有效指不存在「让某人更好而不使任何人变差」的可行配置。第一定理说明价格机制在理想条件下不会浪费资源；它不保证公平，也不保证在存在外部性或信息不对称时成立。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['market-failure'],
        stem: '下列哪些属于本站归纳的市场失灵类型？（多选）',
        options: [
          { text: '市场势力（垄断与寡头）', correct: true },
          { text: '外部性', correct: true },
          { text: '公共品', correct: true },
          { text: '消费者偏好不同', correct: false }
        ],
        explain: '四类市场失灵是市场势力、外部性、公共品、信息不对称。偏好不同本身不是失灵——市场恰恰通过价格把不同偏好协调起来；只有当前三类或信息问题使价格无法反映真实成本与收益时，才构成失灵。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-1', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['general-equilibrium'],
        stem: '瓦尔拉斯定律在一般均衡分析中的实用价值是什么？',
        options: [
          { text: '若有 <code>n−1</code> 个市场出清，第 <code>n</code> 个市场必然出清，可少解一个方程', correct: true },
          { text: '说明所有市场一定同时达到均衡', correct: false },
          { text: '说明价格水平可以被唯一确定', correct: false },
          { text: '说明每个消费者都花完了收入', correct: false }
        ],
        explain: '由预算约束加总，超额需求的价值总和恒为零，所以 <code>n−1</code> 个市场出清就推出第 <code>n</code> 个也出清。它不保证均衡存在或唯一，也不解决价格水平的决定（需计价物）。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
