/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；每章 q1–q7 与 chXX.js 内嵌题一致
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '本站建议的历史论文五步是下列哪一组？',
        options: [
          { text: '问题—论点—证据—反方—结论', correct: true },
          { text: '背景—经过—结果—意义—评价' },
          { text: '摘要—关键词—正文—注释—参考文献' },
          { text: '时间—地点—人物—事件—影响' }
        ],
        explain: '历史论文不是「介绍一个事件」，而是「用一个论点回答一个问题，并用证据说服怀疑者」。五步中最容易拉开差距的是第四步：主动处理对自己不利的证据。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['method'],
        stem: '下列哪种做法最符合「处理反方证据」的要求？',
        options: [
          { text: '在论文中专门用一节呈现与自己论点相反的证据，并解释它为什么不足以推翻自己的结论', correct: true },
          { text: '只引用支持自己论点的材料，反方材料一概不提' },
          { text: '把反方观点说成「显然错误」，不作具体回应' },
          { text: '在结论里加一句「当然，这个问题还有不同看法」' }
        ],
        explain: '处理反方不是礼貌性的免责声明，而是要把最强的反方证据摆出来，说明它成立的条件、它与自己论点的关系。回避反方，等于把论文的可信度交给读者去怀疑。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'tf', difficulty: 1, tags: ['source'],
        stem: '史料只要是真的，就能直接证明作者想证明的论点。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '史料的价值不在于「真不真」，而在于「它作为什么被生产出来」。1958 年亩产三万斤的报道是真的（报纸确实这么印），但它证明的是宣传语言与考核压力，不是真实产量。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'fill', difficulty: 1, tags: ['method'],
        stem: '历史论文不是介绍一个事件，而是用一个____回答一个问题，并用证据说服怀疑者。',
        answer: '论点',
        accept: ['论点', '论题', '主张'],
        explain: '论点是论文的核心。没有论点，材料再多也只是「资料汇编」；有了论点，材料才有取舍的标准，反方才有回应的对象。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['source'],
        stem: '1958 年《人民日报》报道某县水稻亩产「三万斤」。这条材料最能证明什么？',
        options: [
          { text: '当时的宣传语言、干部考核压力与「放卫星」的政治机制', correct: true },
          { text: '该县当年的粮食产量确实达到三万斤' },
          { text: '中国农业科技在 1958 年取得了突破' },
          { text: '《人民日报》的记者不懂农业常识' }
        ],
        explain: '这条报道不能证明产量，但能证明当时的政治语言与考核机制。把它与 1959 年粮食征购数、1960 年农村人口死亡率并置，才能看出浮夸风与饥荒之间的链条。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-8', tier: 1, type: 'multi', difficulty: 1, tags: ['resource'],
        stem: '下列哪些文件是课程提供的写作指南？（多选）',
        options: [
          { text: 'GEA2000_How_to_write_a_historical_essay.pdf', correct: true },
          { text: 'GEA2000_完全写作指南_历史论文.pdf', correct: true },
          { text: 'GEA2000_Guidance_on_Term_Paper.pdf', correct: true },
          { text: 'GEA2000_Lecture_12_Reform_and_Opening_up_in_Deng_Era.pdf' }
        ],
        explain: '前三份是写作指南，分别从英文写作、中文写作与课程具体要求三个角度讲同一件事：如何提出论点、组织证据、处理反方。第四份是邓小平时代的讲义，不是写作指南。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['course'],
        stem: '导修（tutorial）的讨论题通常来自哪里？',
        options: [
          { text: '当周指定的必读材料', correct: true },
          { text: '教材的每一页' },
          { text: '老师的个人研究兴趣，与阅读无关' },
          { text: '历年期末考试的真题' }
        ],
        explain: '导修讨论题通常来自必读材料，例如「Esherick 的十个论点里，哪一个最能解释 1949 年的结局」。课前读完材料、记下两三个可争论的判断，比临场发挥有效得多。'
      },

      /* ---------------- ch01 晚清与近代中国的危机 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['treaty'],
        stem: '下列哪一项不属于 1842 年《南京条约》的内容？',
        options: [
          { text: '允许日本在中国通商口岸开设工厂', correct: true },
          { text: '割让香港岛给英国' },
          { text: '赔款二千一百万银元' },
          { text: '开放广州、厦门、福州、宁波、上海五口通商' }
        ],
        explain: '《南京条约》的核心是割地、赔款、五口通商与协定关税；「允许日本设厂」是 1895 年《马关条约》的内容。把不同条约的条款混在一起，是本章最常见的失分点。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['institution'],
        stem: '太平天国之后，清朝中央与地方权力关系发生了什么变化？',
        options: [
          { text: '地方督抚掌握了厘金、军队与部分人事权，中央对地方的控制明显减弱', correct: true },
          { text: '中央收回了全部地方财政与军事权力' },
          { text: '地方督抚被全部撤换，由满族亲贵接任' },
          { text: '中央与地方的关系没有任何变化' }
        ],
        explain: '为镇压太平天国，清廷允许地方办团练、设厘金，曾国藩、李鸿章等汉族督抚由此掌握财权与兵权。这种「内轻外重」的格局一直延续到清末新政与北洋时期。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-6', tier: 1, type: 'tf', difficulty: 1, tags: ['reform'],
        stem: '洋务运动（自强运动）的核心是引进西方技术、创办军事与民用工业，并未建立议会制度。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '自强运动的口号是「师夷长技以制夷」「自强」「求富」，重点是军工、航运、铁路、电报、新式学堂与留学生，制度层面的议会改革要到 1898 年戊戌变法才被提出。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-7', tier: 1, type: 'fill', difficulty: 1, tags: ['treaty'],
        stem: '1895 年，清政府与日本签订《____》，割让台湾、澎湖与辽东半岛，赔款二亿两白银。',
        answer: '马关条约',
        accept: ['马关条约', '《马关条约》', '下关条约'],
        explain: '《马关条约》是甲午战争的结果，它把中国半殖民地化程度大大加深：割地、巨额赔款、允许日本设厂，列强随后掀起瓜分中国的狂潮。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['treaty'],
        stem: '1901 年《辛丑条约》规定的赔款总额是多少？',
        options: [
          { text: '四亿五千万两白银，分三十九年还清，本息合计约九亿八千万两', correct: true },
          { text: '二亿两白银，分十年还清' },
          { text: '二千一百万银元，一次性付清' },
          { text: '三千万两白银，分五年还清' }
        ],
        explain: '《辛丑条约》赔款按当时中国人口「一人一两」计算，共四亿五千万两，年息四厘，三十九年还清。加上利息，总额接近十亿两，成为清末财政崩溃的重要原因。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 1, type: 'multi', difficulty: 1, tags: ['reform'],
        stem: '下列哪些属于洋务运动期间创办的事业？（多选）',
        options: [
          { text: '江南制造总局', correct: true },
          { text: '轮船招商局', correct: true },
          { text: '同文馆与派遣留美幼童', correct: true },
          { text: '废除科举制度' }
        ],
        explain: '江南制造总局是军事工业，轮船招商局是民用企业，同文馆与留美幼童是教育举措。废除科举是 1905 年清末新政的内容，比洋务运动晚了三十多年。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['rebellion'],
        stem: '太平天国的意识形态主要来自什么？',
        options: [
          { text: '洪秀全对基督教教义的改造，结合「拜上帝教」与中国民间宗教元素', correct: true },
          { text: '儒家今文经学的「托古改制」' },
          { text: '日本明治维新的国家神道' },
          { text: '无政府主义与社会主义' }
        ],
        explain: '洪秀全读梁发《劝世良言》后创立拜上帝教，自称耶稣之弟，提出「天下男子皆兄弟、女子皆姊妹」。这套教义既动员了底层民众，也因其排他性与内部权力斗争限制了太平天国的政治整合。'
      },

      /* ---------------- ch02 革命与共和 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['revolution'],
        stem: '1911 年武昌起义能够爆发，直接契机是什么？',
        options: [
          { text: '四川保路运动导致湖北新军西调，武汉防务空虚', correct: true },
          { text: '孙中山亲自指挥武昌起义' },
          { text: '北洋军主动倒戈支持革命' },
          { text: '列强联合出兵干涉清朝内政' }
        ],
        explain: '清廷为镇压四川保路运动，从湖北调新军入川，武汉兵力空虚。湖北新军中的文学社与共进会趁计划暴露仓促举事，10 月 10 日晚攻占楚望台军械库，次日占领武昌。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['newculture'],
        stem: '新文化运动高举的两面旗帜是什么？',
        options: [
          { text: '民主与科学', correct: true },
          { text: '自由与平等' },
          { text: '民族与民权' },
          { text: '实业与军备' }
        ],
        explain: '陈独秀在《新青年》上提出「德先生」（Democracy）与「赛先生」（Science），即民主与科学。这两面旗帜针对的是专制政治与迷信思想，也针对支撑旧秩序的礼教与文言。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-6', tier: 1, type: 'tf', difficulty: 1, tags: ['mayfourth'],
        stem: '五四运动之后，中国代表在《凡尔赛和约》上签了字。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '1919 年 6 月 28 日，中国代表拒绝在《凡尔赛和约》上签字，这是五四运动最重要的直接成果之一。签字意味着承认日本继承德国在山东的权益，拒签则为后来的外交交涉保留了空间。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'fill', difficulty: 1, tags: ['republic'],
        stem: '1912 年颁布的《____》把总统制改为责任内阁制，试图以议会与内阁限制袁世凯的权力。',
        answer: '中华民国临时约法',
        accept: ['中华民国临时约法', '临时约法', '《临时约法》'],
        explain: '《临时约法》规定主权属于国民全体、三权分立、人民享有各项权利，并改总统制为责任内阁制。但它没有规定「总统不遵守怎么办」，当军队效忠个人而非宪法时，一纸约法拦不住任何人。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['mayfourth'],
        stem: '五四运动爆发的直接导火线是什么？',
        options: [
          { text: '巴黎和会决定把德国在山东的权益转交日本，而北洋政府准备签字', correct: true },
          { text: '日本提出「二十一条」' },
          { text: '袁世凯宣布称帝' },
          { text: '张勋拥清废帝复辟' }
        ],
        explain: '1919 年 4 月底，巴黎和会决定把德国在山东的权益转交日本，中国作为战胜国的诉求被无视。5 月 4 日，北京学生游行抗议，「外争主权、内除国贼」的口号由此而来。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'multi', difficulty: 1, tags: ['newculture'],
        stem: '下列哪些属于新文化运动的主张？（多选）',
        options: [
          { text: '提倡白话文，反对文言文', correct: true },
          { text: '批判旧礼教与家族制度', correct: true },
          { text: '引进民主与科学观念', correct: true },
          { text: '恢复科举取士制度' }
        ],
        explain: '新文化运动的三个战场是语言（白话文）、伦理（反礼教、个性解放）与政治（民主科学、社会主义论战）。恢复科举与运动的方向完全相反，科举早在 1905 年已被废除。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['party'],
        stem: '中国共产党第一次全国代表大会召开于哪一年？',
        options: [
          { text: '1921 年', correct: true },
          { text: '1919 年' },
          { text: '1924 年' },
          { text: '1927 年' }
        ],
        explain: '1921 年 7 月 23 日，中共一大在上海开幕，后转浙江嘉兴南湖，出席代表十三人，代表全国五十多名党员。1919 年是五四运动，1924 年是国民党一大，1927 年是国共分裂。'
      },

      /* ---------------- ch03 中共的兴起与革命道路 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['party'],
        stem: '1927 年八七会议确定的总方针是什么？',
        options: [
          { text: '实行土地革命和武装反抗国民党反动派', correct: true },
          { text: '与国民党继续党内合作' },
          { text: '以城市工人运动为唯一工作重心' },
          { text: '放弃武装斗争，转向议会活动' }
        ],
        explain: '八七会议在汉口召开，确定土地革命与武装反抗的总方针，毛泽东提出「枪杆子里面出政权」。会后发动秋收起义，成为从城市转向农村的起点。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['party'],
        stem: '1935 年遵义会议解决的核心问题是什么？',
        options: [
          { text: '批评博古、李德的军事指挥错误，改组军事领导，增选毛泽东为政治局常委', correct: true },
          { text: '决定与国民党进行第二次合作' },
          { text: '通过《中国土地法大纲》' },
          { text: '确立「农村包围城市」为唯一路线' }
        ],
        explain: '遵义会议的实际成果是：军事指挥权从共产国际顾问回到本土军事干部，恢复集体讨论，确立运动战方针。把它简化为「确立毛泽东的领袖地位」，会掩盖会议的具体决策内容。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'tf', difficulty: 1, tags: ['longmarch'],
        stem: '中央红军于 1935 年 10 月到达陕北吴起镇，与陕北红军会师。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '中央红军 1934 年 10 月从于都出发，1935 年 10 月到达陕北吴起镇。红二、四方面军与红一方面军的三大会师在 1936 年 10 月，标志长征全部结束。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'fill', difficulty: 1, tags: ['party'],
        stem: '1927 年 8 月 1 日的____起义，打响了武装反抗国民党反动派的第一枪。',
        answer: '南昌',
        accept: ['南昌', '南昌起义'],
        explain: '南昌起义由周恩来、贺龙、叶挺、朱德、刘伯承等领导，是中共独立领导武装斗争的开始。8 月 1 日后来成为中国人民解放军的建军节。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['war'],
        stem: '毛泽东在《论持久战》中把抗日战争划分为哪三个阶段？',
        options: [
          { text: '战略防御、战略相持、战略反攻', correct: true },
          { text: '战略进攻、战略僵持、战略决战' },
          { text: '游击战、运动战、阵地战' },
          { text: '局部抗战、全面抗战、国际抗战' }
        ],
        explain: '《论持久战》批评「亡国论」与「速胜论」，指出抗战将经历防御、相持、反攻三阶段，胜负的关键在于发动全国人民。这一划分既是军事分析，也是政治宣言。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 1, type: 'multi', difficulty: 1, tags: ['party'],
        stem: '延安整风运动的主要内容有哪些？（多选）',
        options: [
          { text: '反对主观主义以整顿学风', correct: true },
          { text: '反对宗派主义以整顿党风', correct: true },
          { text: '反对党八股以整顿文风', correct: true },
          { text: '反对「两个凡是」以整顿思想' }
        ],
        explain: '整风的三项内容是学风、党风、文风。「两个凡是」是 1977 年的提法，与 1942 年的整风无关；把不同时期的口号混在一起，是时间线题最常见的错误。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-8', tier: 1, type: 'mcq', difficulty: 1, tags: ['prc'],
        stem: '中华人民共和国成立于哪一天？',
        options: [
          { text: '1949 年 10 月 1 日', correct: true },
          { text: '1949 年 9 月 21 日' },
          { text: '1945 年 8 月 15 日' },
          { text: '1946 年 1 月 1 日' }
        ],
        explain: '1949 年 9 月 21 日政协第一届全体会议开幕，通过《共同纲领》；10 月 1 日开国大典，中华人民共和国中央人民政府成立。两个日期容易混淆，注意区分「会议开幕」与「开国大典」。'
      },

      /* ---------------- ch04 建国与社会主义改造 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['landreform'],
        stem: '1950 年《中华人民共和国土地改革法》的核心内容是什么？',
        options: [
          { text: '废除地主阶级封建剥削的土地所有制，实行农民的土地所有制', correct: true },
          { text: '把土地收归国家所有，由集体统一经营' },
          { text: '实行「耕者有其田」，但保留地主全部财产' },
          { text: '建立人民公社，实行「一大二公」' }
        ],
        explain: '土改法废除地主土地所有制，把土地分给无地少地农民，同时保护富农经济与中农利益。土地归农民私有，与 1956 年高级社的集体所有不同，也与 1958 年人民公社不同。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['plan'],
        stem: '第一个五年计划（1953–1957）的重点是什么？',
        options: [
          { text: '优先发展重工业，苏联援建 156 项重点工程', correct: true },
          { text: '优先发展轻工业与消费品生产' },
          { text: '优先发展农业，实现粮食自给' },
          { text: '优先发展服务业与对外贸易' }
        ],
        explain: '一五计划以重工业为核心，156 项工程分布在煤炭、钢铁、电力、机械、化工、军工等领域，形成鞍钢、长春一汽、洛阳拖拉机厂等骨干企业。代价是农业与轻工业投资不足。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-8', tier: 1, type: 'tf', difficulty: 1, tags: ['transformation'],
        stem: '到 1956 年底，中国基本完成了对农业、手工业和资本主义工商业的社会主义改造。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '1956 年底，96.3% 的农户入社，90% 以上的手工业者入社，99% 的私营工业、85% 的私营商业实行公私合营。原定十五年的任务三年多完成，计划经济体制由此基本建立。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'fill', difficulty: 1, tags: ['transformation'],
        stem: '过渡时期总路线简称「一化三改」，「三改」指对农业、手工业和____的社会主义改造。',
        answer: '资本主义工商业',
        accept: ['资本主义工商业', '资本主义工商业的社会主义改造'],
        explain: '「一化」是社会主义工业化，「三改」是对农业、手工业、资本主义工商业的改造。三者合称「一化三改」，1953 年提出，原估计需要十五年左右。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['war'],
        stem: '中国人民志愿军跨过鸭绿江、入朝作战是在哪一年？',
        options: [
          { text: '1950 年', correct: true },
          { text: '1949 年' },
          { text: '1953 年' },
          { text: '1958 年' }
        ],
        explain: '1950 年 10 月 19 日，志愿军跨过鸭绿江；1953 年 7 月 27 日《朝鲜停战协定》签字。战争把「美帝国主义」变成全民动员的符号，也加速了军工与重工业的投入。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-8', tier: 1, type: 'multi', difficulty: 1, tags: ['transformation'],
        stem: '「三大改造」的对象包括哪些？（多选）',
        options: [
          { text: '农业', correct: true },
          { text: '手工业', correct: true },
          { text: '资本主义工商业', correct: true },
          { text: '国家资本主义经济' }
        ],
        explain: '三大改造的对象是农业、手工业与资本主义工商业。国家资本主义（加工订货、公私合营）是改造资本主义工商业的形式，不是被改造的「对象」本身，这个区分在答题时很重要。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-9', tier: 2, type: 'mcq', difficulty: 2, tags: ['campaign'],
        stem: '1957 年反右运动中被划为「右派分子」的人数约为多少？',
        options: [
          { text: '五十五万人', correct: true },
          { text: '五万人' },
          { text: '五百万人' },
          { text: '五千人' }
        ],
        explain: '官方公布的数字是约五十五万人（另有研究认为更多），其中绝大多数是知识分子、民主人士与党内干部。1978 年之后绝大多数被「改正」，但伤害已经深刻改变了知识分子的行为方式。'
      },

      /* ---------------- ch05 大跃进与文革 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['leap'],
        stem: '下列哪一项不属于 1958 年的「三面红旗」？',
        options: [
          { text: '八字方针', correct: true },
          { text: '总路线' },
          { text: '大跃进' },
          { text: '人民公社' }
        ],
        explain: '三面红旗是总路线、大跃进、人民公社。八字方针（调整、巩固、充实、提高）是 1961 年为纠正大跃进错误而提出的，方向正好相反。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['commune'],
        stem: '人民公社的特点通常被概括为什么？',
        options: [
          { text: '一大二公', correct: true },
          { text: '一平二调' },
          { text: '三级所有、队为基础' },
          { text: '包产到户、自负盈亏' }
        ],
        explain: '「一大二公」指规模大、公有化程度高。公社实行统一经营、集体劳动、公共食堂，取消自留地。「一平二调」是公社运行中的平均主义与无偿调拨，是「一大二公」的后果；「三级所有、队为基础」是 1961 年调整后的体制。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'tf', difficulty: 1, tags: ['culturalrevolution'],
        stem: '「文化大革命」从 1966 年发动，到 1976 年粉碎「四人帮」结束，持续十年。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '1966 年 5 月《五一六通知》标志文革发动，1976 年 10 月粉碎四人帮标志结束，历时十年，因此常称「十年动乱」。1981 年历史决议将其定性为「内乱」。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'fill', difficulty: 1, tags: ['adjustment'],
        stem: '1961 年确立的八字方针是「调整、巩固、充实、____」。',
        answer: '提高',
        accept: ['提高'],
        explain: '八字方针的核心是「调整」：压缩重工业指标、缩短基建战线、精简城市人口、恢复农业。它使经济在 1962 年后逐步恢复，但政治路线并未同步调整。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['adjustment'],
        stem: '1962 年「七千人大会」上，刘少奇用哪句话概括困难的原因？',
        options: [
          { text: '三分天灾，七分人祸', correct: true },
          { text: '七分天灾，三分人祸' },
          { text: '全是自然灾害，与人无关' },
          { text: '全是苏联撤援造成的' }
        ],
        explain: '刘少奇在报告中提出「三分天灾、七分人祸」，把主要责任归于政策失误。毛泽东在会上作自我批评，但半年后的北戴河会议重提阶级斗争，调整就此中断。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-7', tier: 1, type: 'multi', difficulty: 1, tags: ['culturalrevolution'],
        stem: '下列哪些事件发生在文化大革命期间？（多选）',
        options: [
          { text: '红卫兵运动与「破四旧」', correct: true },
          { text: '上海「一月风暴」与全面夺权', correct: true },
          { text: '知识青年上山下乡', correct: true },
          { text: '「九一三事件」林彪坠机' },
          { text: '家庭联产承包责任制推广' }
        ],
        explain: '红卫兵、夺权、上山下乡、九一三都发生在 1966–1976 年。家庭联产承包是 1978 年之后农村改革的措施，与文革不在同一时期；本题有四个正确项，是多选题的典型设计。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-8', tier: 1, type: 'mcq', difficulty: 1, tags: ['culturalrevolution'],
        stem: '「四人帮」在哪一年被粉碎？',
        options: [
          { text: '1976 年', correct: true },
          { text: '1971 年' },
          { text: '1978 年' },
          { text: '1969 年' }
        ],
        explain: '1976 年 10 月 6 日，华国锋、叶剑英、李先念等采取行动，逮捕江青、张春桥、姚文元、王洪文，文化大革命结束。1978 年是十一届三中全会，改革开放的起点。'
      },

      /* ---------------- ch06 改革开放与邓小平时代 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['reform'],
        stem: '中共十一届三中全会召开于哪一年？',
        options: [
          { text: '1978 年', correct: true },
          { text: '1976 年' },
          { text: '1980 年' },
          { text: '1984 年' }
        ],
        explain: '1978 年 12 月 18–22 日，十一届三中全会在北京召开，决定把工作重心转移到社会主义现代化建设，实行改革开放，并平反一批重大冤假错案。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['rural'],
        stem: '农村改革中，农民创造并随后被中央肯定的是哪种制度？',
        options: [
          { text: '家庭联产承包责任制', correct: true },
          { text: '人民公社制' },
          { text: '统购统销制' },
          { text: '公私合营制' }
        ],
        explain: '1978 年 11 月，安徽凤阳小岗村十八户农民按下红手印，把土地分到户，实行「交够国家的、留足集体的、剩下都是自己的」。1982 年中央一号文件正式肯定家庭联产承包责任制。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'tf', difficulty: 1, tags: ['opening'],
        stem: '1980 年设立的经济特区包括深圳、珠海、汕头、厦门。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '1980 年 8 月，全国人大常委会批准在深圳、珠海、汕头、厦门设立经济特区；1988 年海南建省并设为最大的经济特区。上海浦东是 1990 年开发开放，不是 1980 年的特区。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-7', tier: 1, type: 'fill', difficulty: 1, tags: ['reform'],
        stem: '1992 年初，邓小平视察武昌、深圳、珠海、上海等地并发表____，推动确立社会主义市场经济体制。',
        answer: '南方谈话',
        accept: ['南方谈话', '南巡讲话', '南方谈话'],
        explain: '南方谈话提出「计划多一点还是市场多一点，不是社会主义与资本主义的本质区别」「发展才是硬道理」。同年 10 月，十四大正式确立「社会主义市场经济体制」的改革目标。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['price'],
        stem: '「价格双轨制」指的是什么？',
        options: [
          { text: '计划内产品按国家定价，计划外产品按市场价', correct: true },
          { text: '城市与农村实行两套不同的价格' },
          { text: '国内价格与国际价格完全脱钩' },
          { text: '必需品免费、奢侈品高价' }
        ],
        explain: '双轨制避免了价格一次性放开引发的震荡，也制造了计划价与市场价之间的套利空间，「官倒」与寻租由此滋生。1988 年价格闯关失败，证明双轨无法一步跨越。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'multi', difficulty: 1, tags: ['opening'],
        stem: '1980 年设立的第一批经济特区包括哪些？（多选）',
        options: [
          { text: '深圳', correct: true },
          { text: '珠海', correct: true },
          { text: '汕头', correct: true },
          { text: '厦门', correct: true },
          { text: '上海' }
        ],
        explain: '第一批四个特区是深圳、珠海、汕头、厦门。上海不是特区，1990 年才开发开放浦东；1988 年海南成为第五个、也是最大的经济特区。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['reform'],
        stem: '1992 年中共十四大确立的改革目标是什么？',
        options: [
          { text: '建立社会主义市场经济体制', correct: true },
          { text: '建立有计划的商品经济' },
          { text: '实行家庭联产承包责任制' },
          { text: '加入世界贸易组织' }
        ],
        explain: '十四大把「社会主义市场经济体制」确定为改革目标，取代了 1984 年十二届三中全会的「有计划的商品经济」。1993 年十四届三中全会进一步提出建立现代企业制度等五大支柱。'
      },

      /* ---------------- ch07 当代中国的挑战与全球角色 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['trade'],
        stem: '中国正式加入世界贸易组织（WTO）是在哪一年？',
        options: [
          { text: '2001 年', correct: true },
          { text: '1997 年' },
          { text: '2008 年' },
          { text: '2013 年' }
        ],
        explain: '2001 年 12 月 11 日，中国正式成为 WTO 成员。入世推动了中国出口扩张与法律修订，也使「中国制造」深度嵌入全球产业链；1997 年是香港回归，2008 年是奥运会与金融危机。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['urbanization'],
        stem: '2023 年中国的城镇化率大约是多少？',
        options: [
          { text: '66%', correct: true },
          { text: '36%' },
          { text: '50%' },
          { text: '80%' }
        ],
        explain: '1978 年城镇化率是 17.9%，2023 年达到 66.2%，四十多年间约七亿人进入城市。但由于户籍制度，其中很大一部分是「半城市化」的农民工。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'tf', difficulty: 1, tags: ['economy'],
        stem: '2010 年，中国的国内生产总值超过日本，成为世界第二大经济体。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '2010 年中国 GDP 超过日本，居世界第二；2013 年成为世界第一大货物贸易国。但人均 GDP 仍只有美国的六分之一左右，「总量大国、人均中等」的双重身份长期并存。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-6', tier: 1, type: 'fill', difficulty: 1, tags: ['foreign'],
        stem: '2013 年，中国提出「____」倡议，以基础设施投资与产能合作连接中亚、东南亚、非洲与欧洲。',
        answer: '一带一路',
        accept: ['一带一路', '丝绸之路经济带和21世纪海上丝绸之路', 'Belt and Road'],
        explain: '「一带一路」是「丝绸之路经济带」与「21 世纪海上丝绸之路」的合称。它与中国需要为产能寻找市场、为外汇储备寻找投资渠道、为能源资源寻找稳定来源的经济逻辑直接相关。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['environment'],
        stem: '中国提出的「双碳」目标中，碳中和的时间节点是哪一年？',
        options: [
          { text: '2060 年前', correct: true },
          { text: '2030 年前' },
          { text: '2050 年前' },
          { text: '2040 年前' }
        ],
        explain: '2020 年 9 月，中国宣布二氧化碳排放力争 2030 年前达到峰值、2060 年前实现碳中和。2030 年是「碳达峰」，2060 年是「碳中和」，两个年份不要混淆。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'multi', difficulty: 1, tags: ['society'],
        stem: '下列哪些属于当代中国面临的结构性挑战？（多选）',
        options: [
          { text: '人口老龄化与劳动年龄人口下降', correct: true },
          { text: '城乡与区域收入差距', correct: true },
          { text: '环境约束与能源转型', correct: true },
          { text: '地方政府债务与房地产风险' },
          { text: '殖民地地位与主权缺失' }
        ],
        explain: '老龄化、城乡区域差距、环境约束、地方债务都是当代中国的真实挑战。最后一项是近代史议题，1949 年之后中国已恢复主权，把它列为「当代挑战」属于时代错置。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-9', tier: 2, type: 'mcq', difficulty: 2, tags: ['model'],
        stem: '关于「中国模式」的争论，核心分歧主要是什么？',
        options: [
          { text: '国家能力与市场、全球化条件之间，究竟哪一方更能解释中国的增长', correct: true },
          { text: '中国是否应该恢复君主制' },
          { text: '中国的领土面积是否足够大' },
          { text: '中国是否应该放弃制造业' }
        ],
        explain: '支持论强调强国家能力（集中力量办大事、长期规划、基础设施先行）；批评论强调增长依赖全球化红利、廉价劳动力、环境容忍度与人口红利，这些条件正在消失。争论的实质是「效率」与「条件」的解释权重。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
