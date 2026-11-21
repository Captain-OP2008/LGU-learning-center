/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；每章 q1–q3 与 chXX.js 内嵌题一致
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: 'MKT2010 学习站共安排几个学习单元（章）？',
        options: [
          { text: '6 个' },
          { text: '7 个' },
          { text: '8 个', correct: true },
          { text: '9 个' }
        ],
        explain: '本站按 ch00 到 ch07 共 8 个单元组织：ch00 是课程地图，ch01–ch07 覆盖营销基础、战略与环境、调研与购买行为、STP、产品与品牌、定价与渠道、传播与数字营销。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '每章正文中内嵌的小测题，其 qid 与题库中的哪几题对应？',
        options: [
          { text: '该章 q1–q3', correct: true },
          { text: '该章 q4–q6' },
          { text: '该章 q7' },
          { text: '全站随机抽取' }
        ],
        explain: '内嵌题只放 qid，题干与选项都在 quiz.js。每章 q1–q3 与正文内嵌题一一对应，q4–q7 是额外的自测题，覆盖同一组知识点。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '开始学习一章之前，最应该先看什么？',
        options: [
          { text: '直接背题库答案' },
          { text: '章节导航、学习目标与关键词', correct: true },
          { text: '先做模拟卷' },
          { text: '教材最后几页的索引' }
        ],
        explain: '先看导航、目标和关键词，能给正文建立「问题—概念—例子」的框架；带着目标阅读，比从第一行硬读更容易抓住考点。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '正文案例中的百分比与金额都来自企业公开财报，可以直接引用。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '案例中的数字多为教学示例，用于演示计算与推理，不代表真实企业数据。正式作业引用数据时，应查教材、年报或可靠数据库并注明出处。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '本站为 MKT2010 准备的模拟卷共____套。',
        answer: '1',
        accept: ['1', '一', '一套'],
        explain: '模拟卷只有 MKT2010-A 一套，共 12 题、满分 100 分。它的作用是暴露薄弱章节，而不是替代分章题库的日常练习。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'multi', difficulty: 1, tags: ['method'],
        stem: '下列哪些属于本站建议的复习闭环？（多选）',
        options: [
          { text: '读正文并动手做笔记', correct: true },
          { text: '做内嵌小测检查理解', correct: true },
          { text: '刷章节题库并读 explain', correct: true },
          { text: '只看答案，不读解析' }
        ],
        explain: '有效闭环是「读—测—改—再测」：正文建立概念，内嵌题检查局部理解，题库与解析补漏洞。只看答案会把错误思路固化。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: 'MKT2010 的教材在站内以什么形式提供？',
        options: [
          { text: '学习资料目录下的一本教材 PDF', correct: true },
          { text: '每章一个独立 PDF' },
          { text: '只有纸质书，站内没有文件' },
          { text: '只有 PPT，没有教材' }
        ],
        explain: '资源页指向学习资料目录中的《Principles of Marketing》教材 PDF；章节正文是学习导引，不替代教材原文，复习时应回到教材核对定义与案例。'
      },

      /* ---------------- ch01 营销的本质 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '一位同学说「我想要最新款旗舰手机，但预算只有 2000 元」。按需要—欲望—需求框架，这属于：',
        options: [
          { text: '需要（need）' },
          { text: '欲望（want）', correct: true },
          { text: '需求（demand）' },
          { text: '动机（motive）' }
        ],
        explain: '想要具体型号是欲望，它由需要衍生但受文化与社会影响；只有当购买力支持时，欲望才转化为需求。预算不足说明尚未形成有效需求。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '某厂认为「只要把产品做得更耐用、参数更好，顾客自然会买」，这最接近哪种营销管理观念？',
        options: [
          { text: '生产观念' },
          { text: '产品观念', correct: true },
          { text: '推销观念' },
          { text: '社会营销观念' }
        ],
        explain: '产品观念相信顾客偏爱质量与性能最好的产品，容易忽视顾客真正要解决的问题，典型风险是「营销近视症」。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['apply'],
        stem: '健身房记录会员训练进度、到期前提醒续费、邀请老会员转介绍，主要体现：',
        options: [
          { text: '交易营销' },
          { text: '关系营销', correct: true },
          { text: '大众营销' },
          { text: '绿色营销' }
        ],
        explain: '关系营销的目标不是一次性成交，而是通过持续服务、沟通与让渡价值，把顾客变成长期伙伴，并借转介绍降低获客成本。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '「营销近视症」（marketing myopia）指的是：',
        options: [
          { text: '只盯着现有产品，忽视顾客真正需要的利益', correct: true },
          { text: '广告预算太少' },
          { text: '只做低价促销' },
          { text: '只研究竞争对手' }
        ],
        explain: '营销近视症把业务定义成「卖产品」而不是「满足需要」。铁路公司若只把自己看成铁路，而不是运输服务，就会错过公路与航空的竞争。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '顾客满意与顾客忠诚是同一件事：只要满意，就一定会重复购买。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '满意是感知绩效与期望的比较，忠诚还受转换成本、替代品吸引力、情感联系与便利性影响。高满意顾客仍可能因搬家或更低价而流失。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'fill', difficulty: 2, tags: ['concept'],
        stem: '营销过程的第一步，是理解市场与顾客的____。',
        answer: '需要',
        accept: ['需要', '需求', '需要和欲望'],
        explain: '五步营销过程从理解市场与顾客需要出发，再设计顾客导向的营销战略、构建营销方案、建立关系并获取回报。起点错，后面全错。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些属于五种营销管理观念？（多选）',
        options: [
          { text: '生产观念', correct: true },
          { text: '产品观念', correct: true },
          { text: '推销观念', correct: true },
          { text: '营销观念', correct: true },
          { text: '财务观念' }
        ],
        explain: '五种观念是生产、产品、推销、营销与社会营销。前三种以企业为中心，营销观念转向顾客，社会营销再叠加社会与环境的长期利益。'
      },

      /* ---------------- ch02 营销战略与营销环境 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['apply'],
        stem: '奶茶品牌在现有市场推出新口味，按安索夫矩阵属于：',
        options: [
          { text: '市场渗透' },
          { text: '市场开发' },
          { text: '产品开发', correct: true },
          { text: '多元化' }
        ],
        explain: '现有顾客、新产品对应产品开发。市场渗透是现有产品现有市场，市场开发是现有产品新市场，多元化是新产品新市场，风险依次上升。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '限塑令收紧、最低工资上调，属于 PEST 分析中的哪一类力量？',
        options: [
          { text: '经济' },
          { text: '技术' },
          { text: '社会文化' },
          { text: '政治法律', correct: true }
        ],
        explain: '限塑令是法规，最低工资是劳动政策，二者都属于政治法律环境。它们会直接改变成本结构与产品规格，是环境扫描的高优先级信号。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['apply'],
        stem: '校园社团拥有大量志愿者，同时健康饮品需求上升。用 SWOT 配对，这属于：',
        options: [
          { text: 'SO：用优势抓住机会', correct: true },
          { text: 'WO：借机会补劣势' },
          { text: 'ST：用优势化解威胁' },
          { text: 'WT：收缩避险' }
        ],
        explain: '志愿者是内部优势，健康趋势是外部机会，二者配对为 SO 增长型策略。SWOT 的价值在配对，而不是把四类因素各列一张清单。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: 'BCG 矩阵中，市场增长率高、相对份额也高的业务单位属于：',
        options: [
          { text: '明星', correct: true },
          { text: '现金牛' },
          { text: '问题' },
          { text: '瘦狗' }
        ],
        explain: '明星业务高增长高份额，通常需要持续投入以维持份额；现金牛低增长高份额，用来输血；问题业务高增长低份额，需判断是否值得投入。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '使命陈述应尽量写清具体产品和价格，方便员工执行。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '使命陈述回答「我们为谁创造什么价值」，应市场导向、足够宽以容纳成长，又足够具体以指导决策。写死产品和价格会限制转型空间。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'fill', difficulty: 2, tags: ['concept'],
        stem: '安索夫矩阵中，把现有产品卖到新市场，称为市场____。',
        answer: '开发',
        accept: ['开发', '开发战略'],
        explain: '市场开发用现有产品进入新市场，例如把校园茶饮卖到周边写字楼。它比市场渗透多一层渠道与顾客教育成本，但不必重新研发产品。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些属于微观环境的参与者？（多选）',
        options: [
          { text: '供应商', correct: true },
          { text: '营销中介', correct: true },
          { text: '顾客', correct: true },
          { text: '竞争者', correct: true },
          { text: '利率水平' }
        ],
        explain: '微观环境由公司、供应商、营销中介、顾客、竞争者和公众组成；利率属于宏观环境的经济力量。区分层级，才能找对分析对象。'
      },

      /* ---------------- ch03 营销信息与购买行为 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '要验证「降价 10% 是否带来销量增长」，最合适的调研设计是：',
        options: [
          { text: '查二手行业报告' },
          { text: '开一场焦点小组' },
          { text: '做对照实验', correct: true },
          { text: '在门店做观察' }
        ],
        explain: '只有对照实验能通过随机分组与控制条件分离降价与季节、促销等混杂因素，支持因果判断。观察与访谈擅长发现「为什么」，不擅长证明因果。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '顾客购买后反复怀疑自己是不是选错了，这种不适感称为：',
        options: [
          { text: '选择性注意' },
          { text: '参照群体影响' },
          { text: '认知失调', correct: true },
          { text: '知觉防御' }
        ],
        explain: '认知失调来自购买后对替代方案的后悔与怀疑。营销者可通过售后说明、欢迎信、社区内容与快速响应来降低失调，提升复购与口碑。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['apply'],
        stem: '公司采购中，提出技术规格、影响选型的工程师属于购买中心的：',
        options: [
          { text: '使用者' },
          { text: '影响者', correct: true },
          { text: '采购者' },
          { text: '守门人' }
        ],
        explain: '影响者用技术标准、方案评估影响决策，但不一定拥有下单权。采购者负责合同与交易，使用者使用产品，守门人控制信息流入。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '营销调研流程的第一步是：',
        options: [
          { text: '设计问卷' },
          { text: '定义问题与研究目标', correct: true },
          { text: '收集数据' },
          { text: '撰写报告' }
        ],
        explain: '调研四步是定义问题与目标、设计方案、实施收集与分析、解释报告。问题定义错了，后面方法再精细也只是精确地回答错误的问题。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'tf', difficulty: 2, tags: ['method'],
        stem: '样本量越大，抽样误差一定越小，所以调研应尽量调查所有人。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '样本量增加会降低抽样误差，但不消除问卷设计、访问执行等非抽样误差，且成本急剧上升。调研的目标是「足够准」，不是「调查所有人」。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'fill', difficulty: 2, tags: ['method'],
        stem: '按性别、年级等总体结构比例抽取样本的方法，称为____抽样。',
        answer: '分层',
        accept: ['分层', '分层随机', '分层随机抽样'],
        explain: '分层抽样先把总体按重要特征分成互不重叠的层，再在各层内随机抽取。它能保证样本结构与总体一致，减少因某一群体被漏掉造成的偏差。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'multi', difficulty: 2, tags: ['method'],
        stem: '下列哪些属于一手数据收集方法？（多选）',
        options: [
          { text: '问卷', correct: true },
          { text: '深度访谈', correct: true },
          { text: '现场观察', correct: true },
          { text: '对照实验', correct: true },
          { text: '政府统计年鉴' }
        ],
        explain: '一手数据为当前问题专门收集，问卷、访谈、观察、实验都属此类；年鉴是他人已整理的二手数据。两者常结合：先用二手定方向，再用一手验证。'
      },

      /* ---------------- ch04 STP ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['apply'],
        stem: '某奶茶品牌把市场细分为「本栋宿舍的 30 名同学」，这主要违反有效细分的哪条标准？',
        options: [
          { text: '可测量' },
          { text: '足够大', correct: true },
          { text: '可接近' },
          { text: '可区分' }
        ],
        explain: '30 人规模太小，难以支撑产品开发与渠道成本。有效细分要足够大、可测量、可接近、可区分、可操作；太小众的细分只能做实验，不能做业务。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '资源有限的小公司选择一个细分市场深耕，属于哪种目标市场选择模式？',
        options: [
          { text: '无差异营销' },
          { text: '集中营销', correct: true },
          { text: '差异营销' },
          { text: '全面覆盖' }
        ],
        explain: '集中营销把有限资源压在一个细分市场，追求在该细分内的高份额与专业声誉；风险是细分市场萎缩或强敌进入，因此要预留退出与扩展路径。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['apply'],
        stem: '定位陈述「我们的奶茶很好喝，价格实惠，服务热情」的主要问题是：',
        options: [
          { text: '字数太多' },
          { text: '没有明确目标市场与差异点', correct: true },
          { text: '没有使用数字' },
          { text: '没有写品牌名' }
        ],
        explain: '定位陈述要写清「为谁、提供什么独特利益、凭什么相信」。这句话对所有人都适用，等于没有定位，也无法指导产品、价格与传播决策。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: 'STP 的正确顺序是：',
        options: [
          { text: '细分—定位—目标' },
          { text: '细分—目标—定位', correct: true },
          { text: '目标—细分—定位' },
          { text: '定位—细分—目标' }
        ],
        explain: '先按变量把市场分成可识别的细分（Segmentation），再评估并选择进入哪些细分（Targeting），最后在目标顾客心中建立差异位置（Positioning）。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '差异化的意思就是把价格定到全市场最低。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '低价是一种可能的定位，但差异化强调的是顾客感知到的独特价值，可以来自产品、服务、渠道、品牌形象或体验。只靠低价容易陷入价格战。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'fill', difficulty: 2, tags: ['method'],
        stem: '画定位图时，两条轴应选择顾客重视且品牌差异明显的____。',
        answer: '维度',
        accept: ['维度', '属性', '变量'],
        explain: '定位图的轴必须是顾客在做选择时真正在意的维度，例如价格与健康程度。若选了对顾客不重要或各品牌都差不多的维度，图上位置就没有解释力。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些属于有效细分市场的标准？（多选）',
        options: [
          { text: '可测量', correct: true },
          { text: '足够大', correct: true },
          { text: '可接近', correct: true },
          { text: '可区分', correct: true },
          { text: '必须覆盖全国' }
        ],
        explain: '有效细分要可测量、足够大、可接近、可区分、可操作。是否覆盖全国取决于商业模式，不是细分有效性的必要条件；小众市场也可以有利可图。'
      },

      /* ---------------- ch05 产品、服务与品牌 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '购买咖啡机时附带的保修、配送与安装，属于产品五层次中的：',
        options: [
          { text: '核心利益' },
          { text: '期望产品' },
          { text: '附加产品', correct: true },
          { text: '潜在产品' }
        ],
        explain: '核心利益是解决什么问题，期望产品是顾客默认要有的一组属性，附加产品是超出期望的额外服务。附加产品是差异化与溢价的重要来源。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '产品组合的「宽度」指的是：',
        options: [
          { text: '每条产品线中的产品项目数' },
          { text: '产品线的数量', correct: true },
          { text: '每种产品的变体数' },
          { text: '品牌的数量' }
        ],
        explain: '宽度是产品线数量，长度是所有产品线项目总数，深度是每个产品提供多少变体，一致性是各线在用途、渠道等方面的关联程度。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['apply'],
        stem: '把现有品牌用到新品类，例如运动品牌推出运动饮料，属于：',
        options: [
          { text: '多品牌' },
          { text: '新品牌' },
          { text: '品牌延伸', correct: true },
          { text: '联合品牌' }
        ],
        explain: '品牌延伸借现有品牌认知进入新品类，能降低导入成本，但若新品与品牌核心联想冲突，会稀释品牌资产。延伸的关键是「联想是否可迁移」。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '产品生命周期导入期，企业常采用「高价格、高促销」策略，这称为：',
        options: [
          { text: '快速撇脂', correct: true },
          { text: '缓慢撇脂' },
          { text: '快速渗透' },
          { text: '缓慢渗透' }
        ],
        explain: '快速撇脂用高价回收研发投入，用高促销快速建立认知，适合多数顾客尚不了解、但价格不敏感且竞争者将进入的市场。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '服务的「不可分离性」意味着服务不能先生产再储存。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '不可分离性指服务的生产与消费同时发生，顾客参与过程；不能储存是「易逝性」。两者常同时出现，但概念不同，答题时要看清问的是哪一条。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'fill', difficulty: 2, tags: ['concept'],
        stem: '服务四特性是无形性、不可分离性、易变性和____。',
        answer: '易逝性',
        accept: ['易逝性', '不可储存性', '易消失性'],
        explain: '易逝性指服务不能保存，空闲的座位与时段一旦过去就无法补卖。收益管理、预约制与动态定价，都是对易逝性的常见应对。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些属于品牌资产的来源？（多选）',
        options: [
          { text: '品牌认知', correct: true },
          { text: '品牌联想', correct: true },
          { text: '感知质量', correct: true },
          { text: '品牌忠诚', correct: true },
          { text: '厂房面积' }
        ],
        explain: '品牌资产来自顾客头脑中的认知、联想、感知质量与忠诚，以及专利、渠道等专有资产。厂房是生产能力，不直接构成品牌在顾客心中的价值。'
      },

      /* ---------------- ch06 定价、渠道与零售 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['calc'],
        stem: '固定成本 30 万元，单价 15 元，单位变动成本 9 元，保本销量是多少件？',
        options: [
          { text: '30000 件' },
          { text: '40000 件' },
          { text: '50000 件', correct: true },
          { text: '60000 件' }
        ],
        explain: '单位贡献 = 15 − 9 = 6 元，保本销量 = 300000 ÷ 6 = 50000 件。保本点是「不赚不亏」的销量，超过它每一件都开始贡献利润。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '当需求富有弹性时，降价通常会使总收益：',
        options: [
          { text: '减少' },
          { text: '增加', correct: true },
          { text: '不变' },
          { text: '无法判断' }
        ],
        explain: '富有弹性意味着销量增长比例大于价格下降比例，降价带来总收益上升；缺乏弹性时降价反而减少收益。定价前先判断弹性，再谈促销。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['apply'],
        stem: '品牌线上直营店低价销售，冲击线下经销商的生意，这属于：',
        options: [
          { text: '垂直渠道冲突' },
          { text: '水平渠道冲突' },
          { text: '多渠道冲突', correct: true },
          { text: '不属于渠道冲突' }
        ],
        explain: '多渠道冲突发生在同一制造商的不同渠道之间，例如线上直营与线下经销。垂直冲突是同一渠道上下游之间，水平冲突是同一层级渠道成员之间。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '成本加成定价法通常以什么为基数加上一个百分比？',
        options: [
          { text: '售价' },
          { text: '成本', correct: true },
          { text: '利润' },
          { text: '竞争对手价格' }
        ],
        explain: '成本加成以单位成本为基数加一定比例，计算简单、便于报价，但忽略需求与竞争。若以售价为基数倒推，那更接近目标利润定价或毛利率定价。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '撇脂定价适合价格敏感、竞争者容易进入的市场。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '撇脂定价适合价格不敏感、竞争者短期难以进入、产品有独特价值的情况。若顾客价格敏感且壁垒低，高价会迅速引来模仿者，更适合渗透定价。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'fill', difficulty: 2, tags: ['calc'],
        stem: '单位贡献等于单价减去单位____成本。',
        answer: '变动',
        accept: ['变动', '可变'],
        explain: '单位贡献 = 单价 − 单位变动成本，先用来覆盖固定成本，剩余部分才是利润。它是保本分析、目标利润定价与促销决策的核心中间量。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '渠道设计需要重点考虑哪些因素？（多选）',
        options: [
          { text: '顾客特征', correct: true },
          { text: '产品特性', correct: true },
          { text: '公司资源', correct: true },
          { text: '竞争者渠道', correct: true },
          { text: '老板的个人偏好' }
        ],
        explain: '渠道设计是顾客、产品、公司、竞争者与中介环境共同约束下的选择。个人偏好不是系统性因素，拍脑袋定渠道往往导致覆盖不足或冲突失控。'
      },

      /* ---------------- ch07 整合营销传播与数字营销 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '整合营销传播（IMC）的核心是：',
        options: [
          { text: '只投放电视广告' },
          { text: '所有触点传递一致的信息与定位', correct: true },
          { text: '每个部门各自做传播' },
          { text: '只做短期促销' }
        ],
        explain: 'IMC 把广告、公关、促销、人员销售、数字触点统一到同一策略下，确保顾客在每个环节接收到一致的价值主张，避免信息互相抵消。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['apply'],
        stem: '品牌发布教程视频，引导用户收藏与主动搜索，这主要属于：',
        options: [
          { text: '付费媒体' },
          { text: '自有媒体', correct: true },
          { text: '赢得媒体' },
          { text: '人员销售' }
        ],
        explain: '品牌自己运营的账号、网站与内容属于自有媒体；付费媒体是买来的曝光，赢得媒体是用户自发讨论与转发。三者应协同，而不是各自考核。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '产品核心部分标准化、传播与口味做本土化调整，这种策略称为：',
        options: [
          { text: '完全标准化' },
          { text: '完全本土化' },
          { text: '全球本土化', correct: true },
          { text: '直接出口' }
        ],
        explain: '全球本土化（glocalization）在规模经济与本地相关性之间取平衡：保留核心技术与品牌，调整口味、语言、渠道与促销以适应当地文化。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: 'AIDA 模型的正确顺序是：',
        options: [
          { text: '注意—兴趣—欲望—行动', correct: true },
          { text: '兴趣—注意—行动—欲望' },
          { text: '行动—欲望—兴趣—注意' },
          { text: '注意—欲望—兴趣—行动' }
        ],
        explain: 'AIDA 描述顾客从注意到行动的心理推进：先抓住注意，再激发兴趣，形成欲望，最后给出低摩擦的行动路径。每一步对应不同的传播任务与指标。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '公共关系与广告完全一样，都需要付费购买版面。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '广告是付费的、可控的；公关多通过新闻、事件与关系获得第三方报道，可信度较高但控制力较弱。两者在危机沟通中的角色尤其不同。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'fill', difficulty: 2, tags: ['calc'],
        stem: 'LTV/CAC 中的 CAC，指的是获取一位顾客的____成本。',
        answer: '获客',
        accept: ['获客', '平均获客', '客户获取'],
        explain: 'CAC 是 customer acquisition cost，即获得一位新顾客的平均成本；LTV 是顾客终身价值。LTV/CAC 用来判断增长是否健康，通常希望明显大于 1。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '可持续营销的「三重底线」包括哪些维度？（多选）',
        options: [
          { text: '经济', correct: true },
          { text: '社会', correct: true },
          { text: '环境', correct: true },
          { text: '只有利润' }
        ],
        explain: '三重底线要求企业在经济利润之外，同时考虑社会影响与环境影响。它不是额外做公益，而是把长期的外部性纳入产品、供应链与传播决策。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
