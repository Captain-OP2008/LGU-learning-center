/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；每章 q1–q3 与 chXX.js 内嵌题一致
 * 字段：{ id, ch, kp, tier, type, difficulty, tags, stem, options, explain }
 *      fill 题以 answer 代替 options
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '「大学国文」这门课主要训练什么？',
        options: [
          { text: '细读文本、组织论证、口头表达与学术规范的综合能力', correct: true },
          { text: '背诵文学史的年代与作家生平', correct: false },
          { text: '只练文言文翻译', correct: false },
          { text: '只写小说创作', correct: false }
        ],
        explain: '课程以经典文本为材料，训练读、写、说、查四种动作，文学史知识是背景而不是目的。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '课程八个单元中，与「描写文」并列的散文专题是哪一个？',
        options: [
          { text: '饮食散文', correct: true },
          { text: '新闻特写', correct: false },
          { text: '话剧剧本', correct: false },
          { text: '甲骨卜辞', correct: false }
        ],
        explain: '课程散文部分分为描写文与饮食散文两条线，前者练观察与状物，后者练趣味与议论。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'tf', difficulty: 1, tags: ['method'],
        stem: '读一篇作品，只要弄清「写了什么」就够了，「怎么写」与「为什么这样写」属于过度解读。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '三层读法是有顺序的：先读懂字面，再看结构，最后还原语境。只停在字面，会把文学读成情节提要。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '关于导修（tutorial），下列哪项说法符合课程安排？',
        options: [
          { text: '导修是小班讨论，须提前读完指定文本并准备发言', correct: true },
          { text: '导修是补课，去不去都可以', correct: false },
          { text: '导修只收作业，不进行讨论', correct: false },
          { text: '导修由助教另讲一套新内容，与讲授无关', correct: false }
        ],
        explain: '导修的价值在讨论：先读文本、带着问题进课堂，才能把讲授内容变成自己的理解。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['citation'],
        stem: '引用课程讲义中的观点写论文，最规范的做法是：',
        options: [
          { text: '注明作者、篇名、课程名称与页码或日期', correct: true },
          { text: '直接写入正文，不必注明', correct: false },
          { text: '改写措辞后就可以不注明', correct: false },
          { text: '只在文末参考文献列课程名即可', correct: false }
        ],
        explain: '讲义也是他人的著作。直接引用与转述都须注明出处，否则即构成抄袭。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-7', tier: 2, type: 'multi', difficulty: 2, tags: ['method'],
        stem: '本站的章节安排体现下列哪些思路？（多选）',
        options: [
          { text: '先建立课程地图，再进入具体文体', correct: true },
          { text: '小说按五四、乡土、都市三个单元推进', correct: true },
          { text: '散文分为描写文与饮食散文两条线', correct: true },
          { text: '每章只讲结论，不给文本细读', correct: false }
        ],
        explain: '地图在前、文体在后，小说三单元、散文两线、议论与应用收束，是本站的总体路线。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '课程把小说分成三个单元：五四小说、乡土叙事和＿＿＿＿。',
        answer: '都市小说', accept: ['都市与心理', '都市小说'],
        explain: '第三单元处理上海新感觉派与张爱玲、白先勇等作家，关注都市经验与心理描写。'
      },

      /* ---------------- ch01 五四小说 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['close-reading'],
        stem: '《在酒楼上》的叙述者是谁？',
        options: [
          { text: '「我」，一个与吕纬甫偶然重逢的旧友', correct: true },
          { text: '吕纬甫本人', correct: false },
          { text: '吕纬甫的母亲', correct: false },
          { text: '全知全能的叙述者', correct: false }
        ],
        explain: '小说以第一人称「我」的视角展开，吕纬甫的故事是被「我」听见、看见并转述的。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'tf', difficulty: 1, tags: ['close-reading'],
        stem: '吕纬甫把自己比作「绕了一个小圈子，便又回来停在原地点」的蜂子或蝇子。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '这个比喻是小说的核心意象：青年时代的理想飞出去，又被现实吓回原处，反抗归于原地。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['form'],
        stem: '《莎菲女士的日记》采用什么叙述形式？',
        options: [
          { text: '日记体第一人称', correct: true },
          { text: '书信体第三人称', correct: false },
          { text: '全知视角的编年体', correct: false },
          { text: '多人物轮流的独白', correct: false }
        ],
        explain: '日记体让读者直接进入莎菲的内心，欲望、犹疑与自我辩解都不经转述，因而格外锋利。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['symbol'],
        stem: '《绣枕》中那对精心绣成的靠枕，主要象征什么？',
        options: [
          { text: '女性被观赏、被挑选的才情与命运', correct: true },
          { text: '家族的经济实力', correct: false },
          { text: '新式教育的成果', correct: false },
          { text: '母女之间的冲突', correct: false }
        ],
        explain: '靠枕被送去白总长家，又被践踏、捡回；绣者的心血无人珍视，正对应女性在婚姻市场中的位置。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['theme'],
        stem: '冯沅君《旅行》写一对青年男女以「旅行」为名同行，其意义主要在于：',
        options: [
          { text: '以有限的空间争取爱情与身体自主', correct: true },
          { text: '记录沿途的风景名胜', correct: false },
          { text: '宣传新的交通方式', correct: false },
          { text: '描写家庭内部的财产纠纷', correct: false }
        ],
        explain: '「旅行」是一次短暂的越界：离开家庭与熟人社会，两人得以按自己的意愿相处。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['close-reading'],
        stem: '《封锁》中，封锁期间发生的一切被比作什么？',
        options: [
          { text: '整个上海打了个盹，做了个不近情理的梦', correct: true },
          { text: '一场真实的婚礼', correct: false },
          { text: '一次正式的谈判', correct: false },
          { text: '一段童年回忆', correct: false }
        ],
        explain: '封锁隔离出临时空间，梦一醒，秩序恢复，电车上的相遇便不再有下文。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'multi', difficulty: 2, tags: ['form'],
        stem: '五四小说常见的叙述方式包括哪些？（多选）',
        options: [
          { text: '第一人称自叙', correct: true },
          { text: '日记、书信等私人文体', correct: true },
          { text: '回忆框架中的双重时间', correct: true },
          { text: '严格遵循三一律的舞台结构', correct: false }
        ],
        explain: '五四小说借私人文体与回忆框架，把「我」的觉醒与困惑直接推到读者面前。'
      },

      /* ---------------- ch02 乡土叙事 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['close-reading'],
        stem: '《断魂枪》中，沙子龙夜里关起门来练枪，表明什么？',
        options: [
          { text: '枪法只余自我凭吊，不再对外传授', correct: true },
          { text: '他准备收王三胜为徒', correct: false },
          { text: '他要与孙老者比武', correct: false },
          { text: '他靠教拳维持生计', correct: false }
        ],
        explain: '「不传」不是赌气，而是他清楚镖局时代已经过去，枪法失去了存在的土壤。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'tf', difficulty: 1, tags: ['theme'],
        stem: '《断魂枪》的「不传」既是对他人的拒绝，也是对自身时代的告别。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '沙子龙把枪法留给夜晚和自己，等于承认它已无处可用，这是清醒的悲哀。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['close-reading'],
        stem: '《萧萧》的结局是萧萧生下男孩后被留下。这一处理主要揭示：',
        options: [
          { text: '制度以「添丁」收编越轨者，循环照旧', correct: true },
          { text: '乡村社会已经彻底现代化', correct: false },
          { text: '萧萧获得了完全的自由', correct: false },
          { text: '花狗承担了全部责任', correct: false }
        ],
        explain: '生下男孩使萧萧从「罪人」变成「有功者」，制度并未被挑战，反而被延续。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['form'],
        stem: '《呼兰河传》主要采用什么视角？',
        options: [
          { text: '回忆中的儿童视角', correct: true },
          { text: '全知视角的史书笔法', correct: false },
          { text: '书信体', correct: false },
          { text: '多个人物的第一人称轮叙', correct: false }
        ],
        explain: '儿童视角使残忍的习俗显得「平常」，反而更令人不安；回忆又给一切蒙上温情与距离。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['symbol'],
        stem: '《嫁妆一牛车》中，牛车对万发意味着什么？',
        options: [
          { text: '以屈辱换来的生计，也是他仅剩的体面', correct: true },
          { text: '一笔意外之财，带来彻底翻身', correct: false },
          { text: '一件与情节无关的道具', correct: false },
          { text: '现代运输工具取代旧物的象征', correct: false }
        ],
        explain: '牛车是活命的工具，也是交易的凭证；得到它的代价，正是他作为丈夫的尊严。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'multi', difficulty: 2, tags: ['theme'],
        stem: '黄春明《呷鬼的来了》所写的乡村反应，包含哪些层面？（多选）',
        options: [
          { text: '关于「鬼」的传言不断变形', correct: true },
          { text: '集体的恐慌与相互感染', correct: true },
          { text: '外来者引发的猜疑与排斥', correct: true },
          { text: '村民冷静地完成了科学考证', correct: false }
        ],
        explain: '小说写的是恐惧如何被讲述、被传播、被利用，重点不在鬼是否真实存在。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'tf', difficulty: 2, tags: ['method'],
        stem: '读乡土小说，只要识别方言词汇就够了，不必分析叙述者的位置。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '方言是材料，视角才决定态度：谁在看乡村、带着什么距离看，往往比方言更关键。'
      },

      /* ---------------- ch03 都市与心理 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'multi', difficulty: 1, tags: ['concept'],
        stem: '新感觉派小说的常见标志包括哪些？（多选）',
        options: [
          { text: '以都市空间为主要舞台', correct: true },
          { text: '大量书写感官与心理', correct: true },
          { text: '蒙太奇式的跳跃结构', correct: true },
          { text: '严格按时间顺序的乡村编年', correct: false }
        ],
        explain: '都市、感官、跳跃结构三者互相配合，构成新感觉派区别于乡土叙事的写法。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['close-reading'],
        stem: '《梅雨之夕》中，「我」与那位少女之间实际发生了什么？',
        options: [
          { text: '几乎没有交往，全部故事发生在心理层面', correct: true },
          { text: '两人相约次日再见', correct: false },
          { text: '两人发生了激烈争吵', correct: false },
          { text: '两人原来是旧识', correct: false }
        ],
        explain: '小说的张力来自「我」的想象、犹疑与自我辩解，现实中的交往极少。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['form'],
        stem: '《上海的狐步舞》在结构上最突出的特点是：',
        options: [
          { text: '场景并置与蒙太奇式切换', correct: true },
          { text: '单一场景的古典三一律', correct: false },
          { text: '日记体的逐日记录', correct: false },
          { text: '书信往来的双向叙述', correct: false }
        ],
        explain: '小说把舞场、旅馆、街头等场景直接拼接，让都市的繁华与罪恶同时呈现。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['form'],
        stem: '刘以鬯《对倒》的「对倒」主要指：',
        options: [
          { text: '一老一少两条线索平行展开、交错而过', correct: true },
          { text: '两个人互相写信', correct: false },
          { text: '上下两卷讲同一个人的一生', correct: false },
          { text: '正反两面的辩论体', correct: false }
        ],
        explain: '两条视线在街头短暂相接又分开，都市的拥挤与孤独同时被写出。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['close-reading'],
        stem: '《倾城之恋》结尾，白流苏与范柳原的结合主要因为：',
        options: [
          { text: '香港的陷落意外成全了他们', correct: true },
          { text: '两人长期的深情终于感动对方', correct: false },
          { text: '家族的安排与媒妁之言', correct: false },
          { text: '一场官司的判决', correct: false }
        ],
        explain: '城市的毁灭让一切算计失效，两人才卸下防备；张爱玲的写法是反讽，而非浪漫。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['close-reading'],
        stem: '《游园惊梦》中，钱夫人在窦公馆的宴会上的处境可以概括为：',
        options: [
          { text: '今昔叠印，昔日名伶在今日的繁华中显得落寞', correct: true },
          { text: '重返舞台，赢得满堂喝彩', correct: false },
          { text: '与旧友决裂，愤然离席', correct: false },
          { text: '初次进城，对一切充满好奇', correct: false }
        ],
        explain: '宴会上的戏曲、人物与记忆不断重叠，过去的辉煌衬出今日的衰败。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'tf', difficulty: 2, tags: ['method'],
        stem: '都市小说只写外部景观，不处理人物的内心。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '恰恰相反：新感觉派与张爱玲都把都市写进人物的感官与心理，外部景观是内心的投影。'
      },

      /* ---------------- ch04 描写文 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '写一段描写文，最先要确定的通常是：',
        options: [
          { text: '观察的位置与顺序', correct: true },
          { text: '用多少形容词', correct: false },
          { text: '引多少古诗', correct: false },
          { text: '写多长', correct: false }
        ],
        explain: '位置决定看见什么，顺序决定读者怎么跟上；没有位置，描写就会变成词语的堆叠。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['close-reading'],
        stem: '《史记·项羽本纪》刻画项羽，最见力的手段是：',
        options: [
          { text: '以动作与细节写人，让性格在事件中显现', correct: true },
          { text: '大段静态的外貌描写', correct: false },
          { text: '作者直接下道德评语', correct: false },
          { text: '引用大量民间歌谣', correct: false }
        ],
        explain: '鸿门宴的座次、垓下的悲歌，都是靠动作与场景让人物自己站出来。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['style'],
        stem: '张岱《陶庵梦忆》《西湖梦寻》的白描，主要特点是：',
        options: [
          { text: '少用形容词，靠量词、动作与次序见景', correct: true },
          { text: '铺排典故，句句用典', correct: false },
          { text: '以议论代替描写', correct: false },
          { text: '大量使用现代白话', correct: false }
        ],
        explain: '白描不是简单，而是把可有可无的词删掉，让物象自己显形。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['comparison'],
        stem: '朱自清与俞平伯同题写《桨声灯影里的秦淮河》，两人的差异大致是：',
        options: [
          { text: '朱偏重情感与想象，俞偏重哲思与议论', correct: true },
          { text: '朱写白天，俞写夜晚', correct: false },
          { text: '朱用文言，俞用白话', correct: false },
          { text: '两人文字完全相同，只是署名不同', correct: false }
        ],
        explain: '同题同游，取材相近而气质不同，正好用来比较「观察」与「性情」的关系。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['theme'],
        stem: '郁达夫《北平的四季》写四季，真正的着眼点是：',
        options: [
          { text: '借四季写城市的性格与个人的感受', correct: true },
          { text: '精确记录气温与物候数据', correct: false },
          { text: '介绍北平的旅游路线', correct: false },
          { text: '考证四季名称的来历', correct: false }
        ],
        explain: '景物是入口，落点在人：写的是「我」在北平四季里的安适、寂寞与留恋。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['close-reading'],
        stem: '徐志摩《我所知道的康桥》反复强调「单独」，用意是：',
        options: [
          { text: '只有独处时才能看见风景、遇见自己', correct: true },
          { text: '强调他不喜欢与人交往', correct: false },
          { text: '说明康桥偏僻无人', correct: false },
          { text: '劝读者不要去康桥', correct: false }
        ],
        explain: '「单独」是一种观看条件：摆脱同伴与日程，感官才打开，景物才成为「我的」风景。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['style'],
        stem: '余光中《沙田山居》的语言特点，常被概括为：',
        options: [
          { text: '文白相济，句式讲究而富于节奏', correct: true },
          { text: '全用方言口语', correct: false },
          { text: '通篇不加标点', correct: false },
          { text: '以数据与图表为主', correct: false }
        ],
        explain: '他把文言的凝练与白话的流动糅在一起，写景因此既有密度又有速度。'
      },

      /* ---------------- ch05 饮食散文 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'multi', difficulty: 1, tags: ['concept'],
        stem: '一篇好的饮食散文通常包含哪些要素？（多选）',
        options: [
          { text: '关于食物与做法的知识', correct: true },
          { text: '与吃有关的记忆与人事', correct: true },
          { text: '趣味与议论', correct: true },
          { text: '只列菜名与价格', correct: false }
        ],
        explain: '知识让文章可信，记忆让它有情，趣味与议论让它有见解，三者缺一则单薄。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['close-reading'],
        stem: '汪曾祺《泡茶馆》的「泡」字，最传神地写出：',
        options: [
          { text: '在茶馆里长时间消磨、观察与交往的状态', correct: true },
          { text: '泡茶的工序步骤', correct: false },
          { text: '茶馆的装修风格', correct: false },
          { text: '茶叶的买卖行情', correct: false }
        ],
        explain: '「泡」既是时间，也是姿态：无所事事地待着，才看得见茶客们的世态与趣味。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['style'],
        stem: '梁实秋《蟹》一类谈吃文字的突出之处是：',
        options: [
          { text: '考据与回味并重，带一点老派文人的幽默', correct: true },
          { text: '只写烹饪步骤，不作联想', correct: false },
          { text: '通篇使用方言，拒绝通用语', correct: false },
          { text: '以数据统计为主', correct: false }
        ],
        explain: '他引经据典而不炫学，写的是吃，落点常在人情与世风。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['comparison'],
        stem: '林语堂谈饮食，常用的手法是：',
        options: [
          { text: '中西比较，以幽默化解文化偏见', correct: true },
          { text: '严格的营养学计算', correct: false },
          { text: '逐条反驳前人食谱', correct: false },
          { text: '只记录宫廷宴席', correct: false }
        ],
        explain: '他把吃当成文化观的入口，比较之中带笑，笑里又有主张。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['argument'],
        stem: '钱钟书《吃饭》的主旨，可以概括为：',
        options: [
          { text: '借吃饭讽刺名与实、手段与目的之间的错位', correct: true },
          { text: '介绍各地菜肴的做法', correct: false },
          { text: '倡导素食主义', correct: false },
          { text: '记录一次家宴的过程', correct: false }
        ],
        explain: '他写的不是饭，而是借「吃」发挥的社会观察：名义上的目的，常常只是手段的遮羞布。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['style'],
        stem: '周作人《喝茶》的基调是：',
        options: [
          { text: '清淡的闲适，带一点苦涩的自知', correct: true },
          { text: '热烈的抒情', correct: false },
          { text: '激烈的社会批判', correct: false },
          { text: '紧张的悬疑', correct: false }
        ],
        explain: '「苦茶」既是味觉，也是人生态度：不夸张、不热闹，于平淡处见分寸。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'tf', difficulty: 2, tags: ['method'],
        stem: '饮食散文只要把味道写得逼真就够了，不必有知识、记忆或议论。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '味觉只是入口。没有知识与人事的支撑，再逼真的味道也留不住读者。'
      },

      /* ---------------- ch06 议论与驳论 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '议论文的基本推进顺序，通常是：',
        options: [
          { text: '提出问题—分析原因—提出方案—说明效果—得出结论', correct: true },
          { text: '先下结论—再重复结论—最后呼吁', correct: false },
          { text: '先抒情—再叙事—最后写景', correct: false },
          { text: '按时间顺序罗列材料即可', correct: false }
        ],
        explain: '五步结构保证论证有起点、有推进、有落点；缺了分析与效果，主张就只是口号。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['argument'],
        stem: '孟子回应「外人皆称夫子好辩」，采用的关键策略是：',
        options: [
          { text: '把「好辩」重新界定为「不得已」的卫道之举', correct: true },
          { text: '否认自己曾经辩论', correct: false },
          { text: '承认好辩是个人爱好', correct: false },
          { text: '转而攻击对方的人品', correct: false }
        ],
        explain: '他不辩解事实，而改动评价的框架：不是爱辩，是世道逼人不得不辩。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['argument'],
        stem: '柳宗元《驳复仇议》反驳陈子昂，核心在于：',
        options: [
          { text: '礼与法不应二元并行，赏罚必须一致', correct: true },
          { text: '复仇在任何情况下都应当鼓励', correct: false },
          { text: '陈子昂的文章写得不够典雅', correct: false },
          { text: '案件的事实无法查清', correct: false }
        ],
        explain: '陈子昂主张「诛而后旌」，柳宗元指出既杀又赏会让国法自相矛盾。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['argument'],
        stem: '晁错《论贵粟疏》提出的核心办法是：',
        options: [
          { text: '以粟为赏罚，入粟可以拜爵、除罪', correct: true },
          { text: '全面免除农民赋税', correct: false },
          { text: '禁止商人买卖粮食', correct: false },
          { text: '把土地收归国有', correct: false }
        ],
        explain: '他不空谈重农，而是用爵位与刑罚作杠杆，让粮食真正流向国家需要的地方。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['comparison'],
        stem: '苏轼《贾谊论》对贾谊的批评，大意是：',
        options: [
          { text: '志大而量小，有才而不能自用其才', correct: true },
          { text: '学问不足，读书太少', correct: false },
          { text: '过于圆滑，不肯直言', correct: false },
          { text: '出身寒微，不通政务', correct: false }
        ],
        explain: '苏轼把问题从「君主不用」转到「自己不能待时」，这是典型的换角度翻案。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'multi', difficulty: 2, tags: ['method'],
        stem: '史论翻案常用的手法包括哪些？（多选）',
        options: [
          { text: '换前提：重新界定讨论的条件', correct: true },
          { text: '换标准：改用另一套评价尺度', correct: true },
          { text: '换对象：把责任从一方移到另一方', correct: true },
          { text: '换事实：编造史料来支持结论', correct: false }
        ],
        explain: '翻案靠的是重新组织论证，不是改动事实；编造史料是学术不端，不属方法。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'tf', difficulty: 2, tags: ['method'],
        stem: '驳论只需指出对方错在哪里，不必提出自己的主张。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '只破不立，读者仍不知道该怎么办；好的驳论在拆掉旧说之后，要给出替代方案。'
      },

      /* ---------------- ch07 文学革命与学术写作 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '梁启超所说的「熏、浸、刺、提」，指的是：',
        options: [
          { text: '小说感染读者的四种力量', correct: true },
          { text: '写小说的四个步骤', correct: false },
          { text: '四种小说体裁', correct: false },
          { text: '翻译小说的四种方法', correct: false }
        ],
        explain: '四字都在讲「感染力」：潜移默化、长久沉浸、突然刺激、提升境界。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '胡适「八事」的核心主张是：',
        options: [
          { text: '言之有物：要有自己的情感与思想', correct: true },
          { text: '严守格律，多用典故', correct: false },
          { text: '恢复科举文体', correct: false },
          { text: '只写文言，不写白话', correct: false }
        ],
        explain: '其余各条都在拆掉让人「不用自己想」的格式，为「有物」腾出位置。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '陈独秀「三大主义」的三组对立是：',
        options: [
          { text: '贵族／国民、古典／写实、山林／社会', correct: true },
          { text: '诗歌／散文、文言／白话、中／西', correct: false },
          { text: '长篇／短篇、城市／乡村、男／女', correct: false },
          { text: '写实／浪漫、悲剧／喜剧、雅／俗', correct: false }
        ],
        explain: '三组分别对应「谁在写」「写得真不真」「有没有用」，合起来是国民的、写实的、社会的文学。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '周作人《人的文学》所说的「人」，强调的是：',
        options: [
          { text: '灵肉一致的具体的人', correct: true },
          { text: '抽象的「人类」概念', correct: false },
          { text: '只讲理性的道德主体', correct: false },
          { text: '只讲欲望的肉体', correct: false }
        ],
        explain: '他要恢复被旧文学删掉的肉体、欲望与情感，同时不放弃理性与精神。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'tf', difficulty: 2, tags: ['close-reading'],
        stem: '鲁迅说觉醒的人应当「肩住黑暗的闸门」，意思是父辈应替下一代承担因袭的重担。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '这句话把「解放子女」落到父辈的责任上：不是命令子女反抗，而是自己先扛住压力。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '演讲稿的「凤头、猪肚、豹尾」分别指：',
        options: [
          { text: '开头短而抓人、中间充实、结尾利落', correct: true },
          { text: '开头华丽、中间空洞、结尾冗长', correct: false },
          { text: '三段都要押韵', correct: false },
          { text: '只讲一个故事，不作结构安排', correct: false }
        ],
        explain: '演讲是一次性的：开头决定听众是否听下去，中间决定有没有收获，结尾决定记住什么。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-8', tier: 2, type: 'mcq', difficulty: 2, tags: ['citation'],
        stem: '写学期论文时，下列哪种做法符合学术规范？',
        options: [
          { text: '直接引用加引号并注明作者、篇名、版本与页码', correct: true },
          { text: '把别人的观点改写几句，即可不加注', correct: false },
          { text: '只在文末列参考文献，正文不必注', correct: false },
          { text: '网络资料无须注明检索日期', correct: false }
        ],
        explain: '直接引用与转述都须注明；注释不是形式，而是区分「你的」与「别人的」的界线。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
