/* =====================================================================
 * quiz.js · ECO2011 分章题库
 * 结构：{ items:[{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options?, answer?, accept?, explain }] }
 * 题型：mcq / tf / fill / multi
 * 覆盖：ch00–ch07，每章 7 题，共 56 题
 * 说明：章内内嵌的 chXX-q1/q2/q3 即本文件对应条目，改动需同步。
 * ===================================================================== */
(function () {
  'use strict';
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图：经济学在研究什么 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '经济学被定义为「研究社会如何管理自己的稀缺资源」，其中「稀缺」的意思是：',
        options: [
          { text: '资源有限，而人的欲望相对无限，因此必须做选择', correct: true },
          { text: '某些商品暂时买不到，属于短期缺货', correct: false },
          { text: '只有穷国才面临的资源不足', correct: false },
          { text: '价格太高导致的需求不足', correct: false }
        ],
        explain: '稀缺是经济学的前提假设：相对于人的欲望，可用的资源（时间、收入、土地、劳动力）总是有限的，所以任何社会都必须回答「生产什么、怎样生产、为谁生产」。它与「缺货」不同，即使在物质极大丰富的社会，时间与注意力仍然稀缺。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'tf', difficulty: 2,
        tags: ['method'],
        stem: '「政府应当提高最低工资」是一个实证陈述。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '实证陈述描述世界「是什么」，可以用数据检验；规范陈述主张世界「应当怎样」，包含价值判断。「提高最低工资会增加失业」是实证命题，「应当提高」是规范主张。区分二者不是否定价值判断，而是先把可检验的部分说清楚。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['definition'],
        stem: '你放弃一份时薪 60 元的兼职，去看一场票价 40 元的电影，来回路上花 2 小时。这场电影的机会成本最接近：',
        options: [
          { text: '160 元：票价 40 元加上放弃的 120 元工资', correct: true },
          { text: '40 元：只算票价', correct: false },
          { text: '120 元：只算放弃的工资', correct: false },
          { text: '0 元：看电影是享受，不算成本', correct: false }
        ],
        explain: '机会成本是「为了得到某物而放弃的最有价值的东西」，包括显性支出与隐性时间价值。票价 40 元加 2 小时工资 120 元，合计 160 元。它提醒我们：决策时要算「全部代价」，而不只是账单上的数字。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'fill', difficulty: 1,
        tags: ['definition'],
        stem: '微观经济学研究家庭与企业如何做出决策、以及它们在特定市场上如何相互作用；与之相对，研究整体经济现象（通胀、失业、增长）的分支叫______经济学。',
        answer: '宏观',
        accept: ['宏观经济学', 'macro'],
        explain: '微观以单个家庭、企业、市场为分析单位，关注价格与产量如何决定；宏观以总量为对象，关注 GDP、通胀、失业率等。两者共用一套工具，边界并不绝对——宏观问题常常需要微观基础。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['modeling'],
        stem: '经济学家构建「模型」时故意省略许多细节，主要理由是：',
        options: [
          { text: '现实太复杂，简化才能抓住关键机制并做出可检验的预测', correct: true },
          { text: '细节无法观测，所以只能靠假设', correct: false },
          { text: '模型越简单，结论越正确', correct: false },
          { text: '为了避开数学推导', correct: false }
        ],
        explain: '模型是「有目的的简化」：像地图一样，只保留与问题相关的特征。判断模型好坏的标准不是「是否逼真」，而是「假设是否合理、预测是否经得起检验」。简化本身不是优点，能解释现象才是。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '已经花掉的、无法收回的成本，在理性决策中应当被忽略。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '这就是沉没成本（sunk cost）原则：无论下一步怎么选，已经花掉的钱都收不回来，它不改变「继续」与「停止」之间的相对收益。理性决策只比较未来的增量成本与增量收益。现实中「来都来了」的心态正是沉没成本谬误。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下列哪些属于经济学家分析问题时反复使用的核心思路？（多选）',
        options: [
          { text: '权衡取舍：得到一样东西通常要放弃另一样', correct: true },
          { text: '边际分析：比较「再多一单位」的成本与收益', correct: true },
          { text: '激励反应：人们会对奖惩做出行为调整', correct: true },
          { text: '只看总量：总量增加一定意味着人人变好', correct: false }
        ],
        explain: '前三条是曼昆「经济学十大原理」中的核心思维：权衡、边际、激励。第四条错在忽略分配——总量增长可能伴随某些群体受损，这正是后续讨论效率与公平的起点。'
      },

      /* ---------------- ch01 稀缺、选择与机会成本 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['definition'],
        stem: '机会成本之所以必须计入「放弃的次优选择」，是因为：',
        options: [
          { text: '资源有多种用途，选择一种就意味着放弃其他用途的收益', correct: true },
          { text: '会计制度要求记录所有支出', correct: false },
          { text: '只有货币支出才算成本', correct: false },
          { text: '为了让成本数字看起来更大', correct: false }
        ],
        explain: '机会成本衡量的是「选择的代价」，而代价来自被放弃的替代用途。同一笔钱、同一段时间只能用在一条路上，所以真正成本是「本来可以得到的最高回报」。会计成本只记录显性支出，会低估真实代价。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '生产可能性边界（PPF）上的点表示资源已被充分且有效地利用。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: 'PPF 上的点代表在给定资源与技术下「无法再多生产一种产品而不减少另一种」的状态，即生产有效。边界内部的点存在闲置或低效，边界外的点在当前条件下不可实现。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['graph'],
        stem: '生产可能性边界通常向外凸（凹向原点），其经济含义是：',
        options: [
          { text: '随着某种产品产量增加，多生产它的机会成本递增', correct: true },
          { text: '两种产品的产量可以同时无限增加', correct: false },
          { text: '资源可以完全自由地在两种产品间转换', correct: false },
          { text: '技术进步会使边界向内移动', correct: false }
        ],
        explain: '向外凸对应「机会成本递增」：资源并非完全通用，越把资源从更适合它的用途转移出去，每多生产一单位所放弃的另一产品就越多。若资源完全同质，PPF 会是一条直线。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'fill', difficulty: 2,
        tags: ['definition'],
        stem: '甲生产 1 单位 X 需 2 小时、乙需 4 小时，则甲在 X 上具有______优势；若甲生产 X 的机会成本是 0.5 单位 Y，乙是 1.5 单位 Y，则甲在 X 上还具有比较优势。',
        answer: '绝对',
        accept: ['绝对优势', 'absolute'],
        explain: '绝对优势看「用更少投入生产同样产量」，比较优势看「机会成本更低」。甲两个都占，所以贸易仍对双方有利——但即使一方两种产品都占绝对优势，只要机会成本不同，按比较优势分工仍能双赢。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['application'],
        stem: '「为什么水很便宜，钻石很贵？」用边际效用解释，正确答案是：',
        options: [
          { text: '水的总效用高但边际效用低，钻石总效用低但边际效用高', correct: true },
          { text: '水的生产成本一定比钻石高', correct: false },
          { text: '钻石的数量比水多', correct: false },
          { text: '人们对钻石的需求更缺乏理性', correct: false }
        ],
        explain: '价格由边际效用而非总效用决定。水总量大，多一杯带来的额外满足很小；钻石稀少，多一颗带来的额外满足很大。这也解释了「价值悖论」：总效用与边际效用不是一回事。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '如果一项活动的边际收益大于边际成本，理性决策者应当继续增加这项活动。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '边际决策的规则是：只要「再多一单位」带来的收益超过成本，就继续；直到两者相等为止。注意这是「边际」而非「平均」——平均收益高不代表下一单位仍划算。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-8', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下列哪些说法符合本章的「权衡取舍」思路？（多选）',
        options: [
          { text: '提高效率的政策可能牺牲一部分公平', correct: true },
          { text: '增加闲暇时间意味着放弃一部分收入', correct: true },
          { text: '任何选择都有代价，只是代价未必用钱衡量', correct: true },
          { text: '只要技术进步，就再也不需要做取舍', correct: false }
        ],
        explain: '权衡取舍是稀缺的直接推论：多要一样，就少要另一样。技术进步能扩大可行集（PPF 外移），但不消除稀缺，因此取舍依然存在。'
      },

      /* ---------------- ch02 供给、需求与市场均衡 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '其他条件不变，某商品价格下降，其需求量增加。这一关系被称为：',
        options: [
          { text: '需求定理，表现为沿需求曲线向下移动', correct: true },
          { text: '需求增加，表现为整条曲线右移', correct: false },
          { text: '供给定理，表现为沿供给曲线移动', correct: false },
          { text: '收入效应，与价格无关', correct: false }
        ],
        explain: '需求定理指价格与需求量反向变动。价格变化引起的是「需求量」变化，表现为沿同一条曲线移动；只有价格以外的因素（收入、偏好、相关品价格）变化才使整条曲线移动，称为「需求」变化。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '消费者收入上升会使某正常商品的需求曲线向右移动。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '收入是价格以外的需求移动因素。对正常商品，收入上升使每个价格下的需求量都增加，整条曲线右移；对低档商品则相反，收入上升时需求下降。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['graph'],
        stem: '某市场供给增加而需求不变，均衡结果是：',
        options: [
          { text: '均衡价格下降，均衡数量增加', correct: true },
          { text: '均衡价格上升，均衡数量增加', correct: false },
          { text: '均衡价格下降，均衡数量减少', correct: false },
          { text: '价格与数量都不变', correct: false }
        ],
        explain: '供给曲线右移，沿需求曲线向下移动：新交点价格更低、数量更多。反过来，供给减少会推高价格、减少数量。判断时先看哪条曲线移动，再沿着另一条曲线找新交点。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'fill', difficulty: 2,
        tags: ['application'],
        stem: '若某商品的需求与供给同时增加，则均衡数量一定______，而均衡价格的变化方向不确定。',
        answer: '增加',
        accept: ['上升', '变大'],
        explain: '两条曲线同向右移，数量在两股力量下同向叠加，所以一定增加；价格则取决于两条曲线移动幅度的大小，可能上升、下降或不变。这是「双移动」题的标准结论。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['application'],
        stem: '咖啡与茶是替代品。若咖啡价格上涨，茶市场会：',
        options: [
          { text: '需求增加，均衡价格与数量都上升', correct: true },
          { text: '需求减少，均衡价格下降', correct: false },
          { text: '供给增加，价格下降', correct: false },
          { text: '没有影响，因为两者不是同一种商品', correct: false }
        ],
        explain: '替代品价格上升，消费者转向另一种商品，使后者的需求曲线右移，均衡价格与数量同时上升。互补品则相反：咖啡涨价会减少奶精的需求。判断关键是「替代」还是「互补」。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'tf', difficulty: 2,
        tags: ['policy'],
        stem: '当价格上限低于均衡价格时，市场会出现短缺。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '价格上限压低价格，使需求量大于供给量，形成短缺。短缺会催生排队、配给、黑市等非价格配给方式。若上限高于均衡价，则没有约束力，市场结果不变。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-8', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下列哪些因素会使某商品的需求曲线整体移动？（多选）',
        options: [
          { text: '消费者收入变化', correct: true },
          { text: '相关商品价格变化', correct: true },
          { text: '消费者偏好或预期变化', correct: true },
          { text: '该商品自身价格变化', correct: false }
        ],
        explain: '自身价格变化只引起「沿曲线移动」（需求量变化）；收入、相关品价格、偏好、预期、买者数量变化才会让整条曲线移动。区分「沿线移动」与「曲线移动」是本章最重要的技能。'
      },

      /* ---------------- ch03 弹性及其应用 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '价格从 10 元降到 8 元，需求量从 100 增到 130。用中点法计算的需求价格弹性（绝对值）约为：',
        options: [
          { text: '1.17', correct: true },
          { text: '0.78', correct: false },
          { text: '1.50', correct: false },
          { text: '0.30', correct: false }
        ],
        explain: '中点法：数量变化率 = 30/115 ≈ 0.261，价格变化率 = 2/9 ≈ 0.222，弹性 ≈ 0.261/0.222 ≈ 1.17。无论价格上升还是下降，中点法结果相同，这正是它优于简单百分比法的原因；弹性大于 1 说明该区间需求富有弹性。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '若需求富有弹性，企业降价会使总收益增加。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '富有弹性（|E| > 1）时，数量增加的百分比大于价格下降的百分比，总收益上升。缺乏弹性时降价反而减少收益。这解释了为什么「薄利多销」只适用于弹性足够大的商品。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '下列哪种商品的需求价格弹性最可能较小？',
        options: [
          { text: '胰岛素：替代品少、必需、占预算比例低', correct: true },
          { text: '某品牌矿泉水：替代品很多', correct: false },
          { text: '豪华邮轮旅行：占预算比例高', correct: false },
          { text: '某款手机壳：可买可不买', correct: false }
        ],
        explain: '弹性大小的决定因素包括：替代品多少、是否必需品、占预算比例、时间长短、市场定义宽窄。替代品少、必需、占预算小的商品弹性小；定义越窄（某品牌）弹性越大。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'fill', difficulty: 1,
        tags: ['definition'],
        stem: '若两种商品的交叉价格弹性为正，说明它们互为______品。',
        answer: '替代',
        accept: ['替代品', 'substitute'],
        explain: '交叉弹性为正：A 涨价使 B 的需求增加，说明消费者在两者之间切换，即替代关系。交叉弹性为负则为互补品；接近零说明两者基本无关。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['graph'],
        stem: '消费者剩余是指：',
        options: [
          { text: '消费者愿意支付的最高价格与实际支付价格之间的差额', correct: true },
          { text: '消费者实际支付的总金额', correct: false },
          { text: '生产者卖出商品获得的利润', correct: false },
          { text: '政府从交易中征收的税收', correct: false }
        ],
        explain: '消费者剩余衡量「买得值多少」：需求曲线下方、价格上方的面积。它与生产者剩余相加得到总剩余，是评估政策效率的基本工具。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'tf', difficulty: 3,
        tags: ['policy'],
        stem: '对商品征税时，税收负担由法定纳税人承担，与供求弹性无关。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '税收归宿由弹性决定：弹性小的一方承担更多税负。法定纳税人只是「谁把钱交给政府」，实际负担会通过价格调整转嫁。这是本章最常考也最反直觉的结论。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-8', tier: 2, type: 'multi', difficulty: 3,
        tags: ['concept'],
        stem: '下列哪些情况会产生无谓损失？（多选）',
        options: [
          { text: '税收使部分交易不再发生', correct: true },
          { text: '价格上限造成短缺与配给', correct: true },
          { text: '垄断者把产量压到 MR = MC', correct: true },
          { text: '市场处于均衡且没有外部性', correct: false }
        ],
        explain: '无谓损失的本质是「本可让双方都受益的交易没有发生」。税收楔子、价格管制、垄断限产都会制造这种缺口；完全竞争且无外部性时，总剩余已达最大，没有无谓损失。'
      },

      /* ---------------- ch04 消费者选择与需求曲线 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '边际效用递减规律指的是：',
        options: [
          { text: '其他条件不变，连续消费同一种商品，每多一单位带来的额外满足递减', correct: true },
          { text: '消费越多，总效用一定下降', correct: false },
          { text: '商品价格越高，效用越大', correct: false },
          { text: '不同人对同一商品的评价必然相同', correct: false }
        ],
        explain: '递减的是「边际」效用，总效用通常仍在增加，只是增加得越来越慢。当边际效用降到零，总效用达到最大；继续消费会使边际效用转负。它是需求曲线向下倾斜的重要基础。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'tf', difficulty: 2,
        tags: ['graph'],
        stem: '同一条无差异曲线上的任意两点，给消费者带来的总效用相同。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '无差异曲线的定义就是「效用相同的商品组合轨迹」。不同曲线代表不同效用水平，曲线越靠右上效用越高。两条无差异曲线不能相交，否则会与「偏好一致性」矛盾。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['graph'],
        stem: '预算线 <code>Px·X + Py·Y = I</code> 的斜率（纵轴为 Y）是：',
        options: [
          { text: '−Px / Py', correct: true },
          { text: '−Py / Px', correct: false },
          { text: 'Px · Py', correct: false },
          { text: '−I / Px', correct: false }
        ],
        explain: '把预算约束写成 Y = I/Py − (Px/Py)·X，斜率即 −Px/Py，表示「多买一单位 X 要放弃多少 Y」。斜率的绝对值等于两种商品的相对价格，也是市场交换比率。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'fill', difficulty: 2,
        tags: ['condition'],
        stem: '消费者在预算约束下实现效用最大化的条件是：边际替代率等于两种商品的______之比。',
        answer: '价格',
        accept: ['价格比', '相对价格'],
        explain: '最优点处无差异曲线与预算线相切：<code>MRS = MUx/MUy = Px/Py</code>。含义是「主观愿意交换的比率」等于「市场允许交换的比率」；只要两者不等，消费者就能通过调整组合提高效用。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '某商品价格下降，消费者用其替代其他商品，这部分需求量变化称为：',
        options: [
          { text: '替代效应：相对价格变化引起的需求调整', correct: true },
          { text: '收入效应：实际购买力变化引起的需求调整', correct: false },
          { text: '外部效应：他人消费带来的影响', correct: false },
          { text: '规模效应：产量扩大带来的成本下降', correct: false }
        ],
        explain: '价格下降同时产生两股力量：替代效应（该商品相对变便宜，多买它、少买别的）与收入效应（实际购买力上升）。正常商品两者同向，所以需求增加；吉芬商品收入效应反向且更大，才会出现需求随价格下降而减少的例外。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'tf', difficulty: 3,
        tags: ['concept'],
        stem: '吉芬商品（Giffen good）是一种价格下降时需求量反而减少的商品。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '吉芬商品是需求曲线向上倾斜的极端情形：收入效应为负且强于替代效应，典型例子是贫困家庭的主食。它要求商品是「低档品」且占预算比例极高，现实中极为罕见，考试中主要用于检验对收入效应与替代效应的理解。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '关于「市场需求曲线」，下列说法正确的有：（多选）',
        options: [
          { text: '它是所有消费者个人需求曲线的横向加总', correct: true },
          { text: '价格下降时，原有消费者多买、新消费者进入，都使需求量增加', correct: true },
          { text: '它可以从个人效用最大化推导出来', correct: true },
          { text: '它一定比任何单个消费者的需求曲线更陡', correct: false }
        ],
        explain: '市场需求是个人需求的水平加总（同一价格下数量相加），通常比个人需求更平坦，因为价格下降会同时吸引更多消费者进入。它不是「更陡」，而是「更平」。'
      },

      /* ---------------- ch05 生产成本与企业决策 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '边际产量递减意味着，随着可变投入增加，边际成本最终会：',
        options: [
          { text: '上升，因为每多生产一单位需要更多投入', correct: true },
          { text: '下降，因为规模经济发挥作用', correct: false },
          { text: '保持不变，与产量无关', correct: false },
          { text: '先上升后下降', correct: false }
        ],
        explain: '边际产量与边际成本是「一枚硬币的两面」：<code>MC ≈ w / MPL</code>。MPL 递减意味着每多一单位产出需要更多劳动，边际成本因而上升。这也解释了短期成本曲线为什么是 U 形。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '边际成本曲线一定穿过平均总成本曲线的最低点。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '这是「边际穿过平均」的数学必然：MC 低于 ATC 时把平均拉低，高于时把平均拉高，相等时平均停止下降。同理，MC 也穿过 AVC 的最低点，且位置更靠左。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['decision'],
        stem: '短期中，企业在什么条件下应当停产？',
        options: [
          { text: '价格低于平均可变成本（P < AVC）', correct: true },
          { text: '价格低于平均总成本（P < ATC）', correct: false },
          { text: '只要亏损就应当停产', correct: false },
          { text: '价格低于边际成本（P < MC）', correct: false }
        ],
        explain: '短期固定成本已沉没，停产与否只比较「继续生产的现金收支」。P ≥ AVC 时，每单位还能贡献 P − AVC 分担固定成本，继续生产亏得更少；P < AVC 时越生产越亏，应停产。P < ATC 只是亏损，不等于该停。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'fill', difficulty: 1,
        tags: ['definition'],
        stem: '总成本 TC = FC + VC，其中不随产量变化的部分 FC 称为______成本。',
        answer: '固定',
        accept: ['固定成本', 'fixed'],
        explain: '固定成本在短期不随产量变化，如厂房租金、设备折旧；可变成本随产量变化，如原料、计件工资。长期里所有成本都可变，固定与可变的区分只在短期有意义。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '长期平均成本曲线下降的区段对应的现象是：',
        options: [
          { text: '规模经济：产量越大，单位成本越低', correct: true },
          { text: '边际产量递减', correct: false },
          { text: '规模不经济', correct: false },
          { text: '固定成本摊薄', correct: false }
        ],
        explain: '长期没有固定成本，LRATC 的 U 形来自规模经济与规模不经济：先因分工、专用设备、采购折扣而下降，后因管理协调成本上升而上升。固定成本摊薄解释的是短期 AFC 下降，不是长期规模经济。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '完全竞争企业利润最大化的产量满足价格等于边际成本。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '完全竞争企业是价格接受者，MR = P，所以 MR = MC 化为 P = MC。这条规则给出短期供给曲线（MC 在 AVC 以上的部分），也是长期均衡 P = min ATC 的基础。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'multi', difficulty: 3,
        tags: ['concept'],
        stem: '下列哪些变化会使企业的边际成本曲线移动？（多选）',
        options: [
          { text: '原料价格上涨', correct: true },
          { text: '按产量征收的消费税', correct: true },
          { text: '生产技术进步', correct: true },
          { text: '一次性缴纳的营业执照费', correct: false }
        ],
        explain: 'MC 只由可变成本决定，所以任何影响可变成本的因素（原料、计件工资、单位税、技术）都会移动 MC。一次性固定费用只改变 FC 与 ATC，不改变 MC，因而在完全竞争下不改变最优产量。'
      },

      /* ---------------- ch06 市场结构 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '判断一个市场是否属于寡头，最关键的维度是：',
        options: [
          { text: '少数几家企业占据大部分市场，彼此存在策略互动', correct: true },
          { text: '产品完全没有差异', correct: false },
          { text: '企业数量超过一百家', correct: false },
          { text: '政府规定了最高价格', correct: false }
        ],
        explain: '寡头的定义特征是「少数企业 + 相互依赖」：每家的定价与产量都会影响对手，因此必须用博弈论分析。企业数目多且产品有差异是垄断竞争；只有一家是垄断；数目多且同质是完全竞争。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '完全竞争行业的长期均衡中，每家企业的经济利润为零。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '自由进入与退出使价格趋向最低长期平均成本，经济利润归零。注意零经济利润不等于亏损：会计利润通常为正，只是恰好等于资源在别处能获得的回报。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '垄断者的边际收益小于价格，原因是：',
        options: [
          { text: '多卖一单位必须对所有单位降价，价格效应抵消部分数量效应', correct: true },
          { text: '垄断者的生产成本更高', correct: false },
          { text: '政府规定垄断者必须低价销售', correct: false },
          { text: '消费者对垄断商品没有需求', correct: false }
        ],
        explain: '<code>MR = P + Q·(ΔP/ΔQ)</code>，需求向下倾斜使第二项为负。弹性形式为 <code>MR = P(1 − 1/|E|)</code>，弹性越低，MR 与 P 的差距越大，垄断加价空间越大。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '垄断者把产量压到 MR = MC，而社会最优产量要求 P = MC，两者之间的总剩余损失称为______损失。',
        answer: '无谓',
        accept: ['无谓损失', 'deadweight'],
        explain: '无谓损失对应那些「消费者愿意付的价格高于边际成本、却因垄断定价未被生产」的单位，图形上是需求曲线、MC 曲线与垄断产量围成的三角形。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['application'],
        stem: '电影院对学生打折、对成人收全价，属于：',
        options: [
          { text: '三级价格歧视：按可观察的群体区分支付意愿', correct: true },
          { text: '一级价格歧视：向每人收取最高支付意愿', correct: false },
          { text: '二级价格歧视：按购买量分段定价', correct: false },
          { text: '不是价格歧视，因为成本不同', correct: false }
        ],
        explain: '三级价格歧视按可观察特征（身份、年龄、地区）分组定价；二级按购买量或版本自选择；一级向每个人收取其保留价格。学生票能成立，靠的是证件验证与转卖限制。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'tf', difficulty: 2,
        tags: ['game'],
        stem: '在囚徒困境中，纳什均衡的结果一定是双方共同最优的结果。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '囚徒困境的核心正是「纳什均衡 ≠ 集体最优」：双方都选占优策略（低价/背叛），结果比合作更差。这也是卡特尔不稳定的原因——每个成员都有偷偷背叛的激励。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-2', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下列哪些属于进入壁垒？（多选）',
        options: [
          { text: '政府发放的稀缺牌照', correct: true },
          { text: '专利保护', correct: true },
          { text: '自然垄断下的规模经济', correct: true },
          { text: '消费者收入上升', correct: false }
        ],
        explain: '进入壁垒是阻止新企业进入的结构性因素：资源垄断、政府管制（牌照、专利）、规模经济、网络效应。消费者收入上升属于需求侧变化，会吸引进入而不是阻止进入。'
      },

      /* ---------------- ch07 市场失灵与政府角色 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '工厂排污对下游居民造成损害，但工厂不为此付费。这种情形属于：',
        options: [
          { text: '负外部性：私人成本低于社会成本，产量高于社会最优', correct: true },
          { text: '正外部性：社会收益高于私人收益', correct: false },
          { text: '公共品：非排他且非竞争', correct: false },
          { text: '信息不对称：一方知道得更多', correct: false }
        ],
        explain: '负外部性使私人成本低于社会成本，企业按私人成本决策，产量超过社会最优，多出的部分造成无谓损失。政策工具包括庇古税、管制与可交易许可证。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '科斯定理表明，只要产权清晰且交易成本为零，无论产权初始分配给谁，都能达到有效率的结果。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '这是科斯定理的标准表述。要注意两点：效率相同但分配不同（谁付钱给谁）；现实交易成本很少为零，所以政府的作用是界定产权、降低交易成本，而不是简单「不管」。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['definition'],
        stem: '公共品与共有资源的关键区别是：',
        options: [
          { text: '公共品非竞争，共有资源有竞争性', correct: true },
          { text: '公共品可排他，共有资源不可排他', correct: false },
          { text: '公共品由私人提供，共有资源由政府提供', correct: false },
          { text: '两者没有区别，只是叫法不同', correct: false }
        ],
        explain: '两者都不可排他。公共品多一个人享用不减少他人可用量（非竞争），所以易搭便车、供给不足；共有资源多一个人使用会减少他人可用量（有竞争性），所以易过度使用、公地悲剧。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-6', tier: 1, type: 'fill', difficulty: 1,
        tags: ['definition'],
        stem: '公海渔业被过度捕捞、公共牧场被过度放牧，这类现象被称为______悲剧。',
        answer: '公地',
        accept: ['公地悲剧', 'commons'],
        explain: '公地悲剧的根源是成本外部化：使用者获得全部收益，只承担一部分成本。解法包括界定产权、配额与许可证、使用者付费、社区自治。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '投保全险后司机开车更不小心，这属于：',
        options: [
          { text: '道德风险：交易后行为不可观察，保障改变了激励', correct: true },
          { text: '逆向选择：交易前类型不可观察', correct: false },
          { text: '外部性：行为影响旁观者', correct: false },
          { text: '规模经济：保险池越大成本越低', correct: false }
        ],
        explain: '道德风险发生在交易之后，是「行为变形」；逆向选择发生在交易之前，是「类型混杂」。保险市场两者都有：高风险者更愿投保（逆向选择），投保后更敢冒险（道德风险）。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'tf', difficulty: 2,
        tags: ['policy'],
        stem: '按单位外部成本征收庇古税，可以让企业在「减排」与「缴税」之间自行选择，从而以较低总成本实现减排。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '庇古税让私人成本等于社会成本：减排成本低于税额的企业选择减排，高于税额的企业选择缴税。这种「成本有效」是税与许可证相对「一刀切」管制的核心优势。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-8', tier: 2, type: 'multi', difficulty: 3,
        tags: ['policy'],
        stem: '评估一项环境政策时，下列哪些因素应当被纳入考虑？（多选）',
        options: [
          { text: '减排的总成本与成本在企业间的分布', correct: true },
          { text: '监测与执法的可行性', correct: true },
          { text: '对低收入家庭的分配影响', correct: true },
          { text: '政策是否「听起来」环保', correct: false }
        ],
        explain: '政策评估要同时看效率（总成本与总收益）、可行性（监测、执法）、分配（谁承担成本）。「听起来环保」不是可检验的标准；透明的成本收益分析与敏感性分析才是。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
