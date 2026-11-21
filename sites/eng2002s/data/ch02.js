/* =====================================================================
 * ch02.js · 第 2 章「技术写作的语言：清晰、衔接与定义」
 * 职责：把「意思对」推进到「读得顺、查得到」——句子层面的信息结构、
 *       衔接手段、名词化与被动语态的取舍、技术定义的写法。
 * 依据：Week 2（technical prose clarity & cohesion、technical definitions）
 *       与 Markel 第 10 版关于 clear style 的章节。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch02',
  num: '02',
  title: '技术写作的语言：清晰、衔接与定义',
  en: 'CLARITY, COHESION & DEFINITION',
  goals: [
    '用准确、简洁、可核查三条底线逐句检查技术文本',
    '按已知—未知顺序安排句子，把重要信息放在句尾重心',
    '用重复、指代、连接词与平行结构四种手段把段落缝起来',
    '在名词化与动作化、主动与被动之间做出有理由的选择',
    '写出合格的括号式、句子式与扩展式技术定义，并避开循环定义'
  ],
  kp: [
    { id: 'ch02-1', title: '三条底线：准确、简洁、可核查' },
    { id: 'ch02-2', title: '信息结构：已知在前，新信息在句尾' },
    { id: 'ch02-3', title: '衔接的四种手段：重复、指代、连接、平行' },
    { id: 'ch02-4', title: '名词化：把动作还给动词' },
    { id: 'ch02-5', title: '被动语态：该用、不该用与逃避责任' },
    { id: 'ch02-6', title: '技术定义：三种写法与两个陷阱' },
    { id: 'ch02-7', title: '模糊限制与断言：把话说得刚刚好' },
    { id: 'ch02-8', title: '中式英语与冗余：十个高频替换' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么「没有语法错误」还不够', html: '很多人改英语写作，改的是时态、冠词、拼写——这些当然要改，但改完仍然可能读不懂。技术写作的读者不是来欣赏句子的，他是来<b>提取信息并做决定</b>的。一句话如果要多读一遍才知道主语是谁、结论在哪、数据指什么，那它在功能上就是错的。这一章讲的是句子层面的工程：怎样安排信息顺序、怎样把段落缝起来、怎样定义一个新术语、怎样把话说得与证据一样硬。' },

    { t: 'p', lead: true, html: '上一章解决「写给谁、为什么写」，这一章解决「怎么写清楚」。技术文本的清晰不是文采，而是<b>可预测</b>：读者知道每一段第一句会给结论，知道新术语出现时会被解释，知道数字后面跟着单位与条件。可预测带来速度，速度带来信任。以下八节按「句子内部 → 句子之间 → 术语 → 语气」的顺序展开，每一节都给可操作的检查动作。' },

    { t: 'h', lvl: 2, text: '一、三条底线：准确、简洁、可核查', id: 'ch02-1' },

    { t: 'p', html: '<b>准确（accurate）</b>是指陈述与事实、数据、条件一一对应。常见的不准确不是撒谎，而是<b>省略了限定条件</b>：写「该材料在高温下失效」，读者不知道高温是 80 °C 还是 800 °C，这句话在工程上无法使用。准确的做法是把条件写进句子：「该材料在 120 °C 以上持续 30 分钟后出现可见裂纹」。' },

    { t: 'p', html: '<b>简洁（concise）</b>不是字数少，而是<b>每个词都承担信息</b>。判断方法：删掉一个词，意思是否改变？不改变就是冗余。例如 <em>in order to</em> 可删成 <em>to</em>，<em>due to the fact that</em> 可换成 <em>because</em>，<em>a total of five samples</em> 可写成 <em>five samples</em>。<b>可核查（verifiable）</b>是指读者能顺着文本找到证据：数据来自哪次实验、哪个文件、哪一页。三者缺一，文本就从「技术写作」退化成「作文」。' },

    { t: 'table', caption: '三条底线的自查问题与典型反例', head: ['底线', '自查问题', '反例', '改法'], rows: [
      ['准确', '条件、单位、对象都写全了吗？', 'The device failed at high temperature.', 'The device failed after 30 min at 120 °C.'],
      ['简洁', '删掉这个词，意思变了吗？', 'It is important to note that the sample was small.', 'The sample was small (n = 3).'],
      ['可核查', '读者能顺着这句话找到原始数据吗？', 'Previous studies show this is common.', 'Zhang et al. (2021) report the same drift in 12 of 15 sites.']
    ] },

    { t: 'p', html: '还有一条隐含底线：<b>一致（consistent）</b>。同一个东西在全文中用同一个名字：不要第一段叫 <em>the sensor node</em>，第三段叫 <em>the device</em>，第五段又叫 <em>the unit</em>——读者会以为是三个东西。单位、符号、大小写、缩写也要一致：全文用 <em>kW·h</em> 就不要中途出现 <em>kWh</em> 和 <em>KWH</em>。一致性是最便宜的清晰。' },

    { t: 'h', lvl: 2, text: '二、信息结构：已知在前，新信息在句尾', id: 'ch02-2' },

    { t: 'p', html: '英语句子有一个天然的「承重墙」位置：<b>句尾</b>。读者读完一句，注意力停留在最后几个词上。因此技术写作有一条实用规则：<b>已知信息放句首，新信息与重点放句尾</b>。这条规则叫 given-new，配合「句尾重心（end weight）」使用，效果立竿见影。' },

    { t: 'compare', left: { title: '违反 given-new：读者两次踩空', html: '<em>A 23% reduction in idle time was observed after the firmware update, which was released in March.</em><br><br>句子开头就是一个全新的结论，读者不知道「谁的 idle time」「哪次更新」，读到句尾才拼出背景。' }, right: { title: '遵守 given-new：背景先落地', html: '<em>After the March firmware update, idle time fell by 23%.</em><br><br>先给读者已知的事件（三月更新），再把新结论（下降 23%）放在句尾承重位置。' } },

    { t: 'p', html: '中文母语者常犯的另一个方向是<b>主语太长</b>：把所有限定成分堆在主语里，谓语要等两行才出现。英语的解法是把长成分后移，或用形式主语撑住句首。例如把 <em>The possibility that the sensor drift is caused by temperature changes during the night cannot be excluded.</em> 改成 <em>Temperature changes at night may explain the sensor drift; we cannot exclude this yet.</em> 后者把「可能的原因」提前，句子短了一半。' },

    { t: 'p', html: '段落层面同理：<b>每段第一句给结论，后面给支撑</b>。这不是八股，而是为了方便跳读。管理者读第一句就知道这段在说什么，专家读后面判断证据够不够。如果一段的第一句是「如图 3 所示，我们进行了三组实验」，读者要先读完才知道结论，成本就高了。把结论句提到段首，等于给读者一个开关：需要细节就往下读，不需要就跳到下一段。' },

    { t: 'p', html: '还有一个细节：<b>避免「悬空代词」</b>。<em>This shows that the method is reliable.</em> 里的 this 指什么？上一句的方法、上一段的数据，还是整节？英语写作里 this 单独作主语最容易含糊，改成 <em>This 23% drop shows…</em> 或 <em>These results show…</em>，把指代对象钉住。' },

    { t: 'h', lvl: 2, text: '三、衔接的四种手段：重复、指代、连接、平行', id: 'ch02-3' },

    { t: 'p', html: '衔接（cohesion）是句子之间的缝。缝不好，每句都对，整段像散落的珠子。四种手段按可靠性排序：<b>关键词重复</b>最稳，<b>指代</b>最省字，<b>连接词</b>最明确，<b>平行结构</b>最有节奏。技术写作里，可靠比优雅重要，所以优先用重复，其次指代，连接词用来标逻辑，平行用来列清单。' },

    { t: 'table', caption: '四类衔接手段与使用要点', head: ['手段', '做法', '例子', '风险'], rows: [
      ['关键词重复', '同一概念用同一个词重复出现', 'budget … budget … budget', '重复过多显得笨；可用同义词但需保证指同一物'],
      ['指代', '用 this / these / it / they 回指', 'These three sites …', '指代对象不清时读者要回读；this 后加名词最稳'],
      ['连接词', '显性标出因果、转折、递进、举例', 'because, however, therefore, for example', '连接词成串（however, moreover, furthermore）反而糊'],
      ['平行结构', '并列项用同样的语法形式', 'collect data, clean data, and plot results', '形式不平行（collecting data, to clean, plots）会绊读者']
    ] },

    { t: 'p', html: '连接词不是越多越好。一段里出现三个 <em>moreover</em>，读者会怀疑作者在用连接词冒充逻辑。真正的关系要靠内容建立：如果两句之间是因果关系，把原因写成条件、把结果写成数据，连接词只是路标。反过来，该标的地方不能省：<b>转折</b>（however）、<b>让步</b>（although）、<b>因果</b>（therefore）这三类最容易读错，必须显性标出。' },

    { t: 'p', html: '平行结构在技术文本里出现频率极高：方法步骤、评价标准、简历条目、幻灯片要点，都是并列。检查方法很机械：把并列项竖着排，看每项的第一个词是否同一词性。如果一项是动词开头、一项是名词开头，读者会在第三项卡住。课程评分细则里「clear and logical organization」这一条，很多时候扣的就是平行结构不整齐。' },

    { t: 'p', html: '还有一个常被忽略的衔接资源：<b>标点与排版</b>。分号表示两句关系紧密，冒号表示后面是解释或清单，破折号表示插入。技术写作里冒号尤其有用：<em>The system has three components: a sensor, a gateway, and a dashboard.</em> 一句话就把结构交代清楚，比写三句「第一个是……第二个是……」高效得多。' },

    { t: 'h', lvl: 2, text: '四、名词化：把动作还给动词', id: 'ch02-4' },

    { t: 'p', html: '名词化（nominalization）是把动词或形容词变成名词：<em>decide → decision</em>、<em>fail → failure</em>、<em>accurate → accuracy</em>。它在学术写作里有正当用途——指称一个抽象概念、做标题、回指前文。但滥用名词化会让句子变成「僵尸名词」的仓库：动作被抽走，只剩一串抽象名词，读者不知道谁做了什么。' },

    { t: 'compare', left: { title: '名词化过重：动作消失', html: '<em>The implementation of the optimization of the scheduling algorithm resulted in a reduction of energy consumption.</em><br><br>三个动作（implement、optimize、reduce）全变成名词，读者要自己还原谁做了什么。' }, right: { title: '动作化：主语—动词—宾语', html: '<em>We optimized the scheduling algorithm, which cut energy use by 18%.</em><br><br>动词回到谓语位置，施动者明确，还顺手补了数字。' } },

    { t: 'p', html: '判断名词化是否过度，有个简单测试：<b>数一数句子里有几个表示动作的名词</b>。如果一句话里有三个以上（implementation、optimization、reduction、assessment、improvement），基本可以重写。重写步骤：找出核心动作 → 把它变回动词 → 找出谁做这个动作 → 把它放回主语。' },

    { t: 'p', html: '名词化也不是一无是处。当动作的执行者不重要、或前文已经交代过，用名词化可以让句子更紧凑：<em>After installation, the sensors were calibrated.</em> 这里 installation 指一个已完成的阶段，没必要写 <em>after we installed them</em>。关键区别在于：<b>名词化用来回指已知事件，不用来隐藏关键动作</b>。' },

    { t: 'p', html: '中文写作迁移过来的另一个习惯是「的的不休」：<em>the improvement of the efficiency of the system</em> 这类 of 链。英语里连续两个 of 就该警觉，三个 of 基本要重写。常见解法是用所有格、复合名词或直接改主谓：<em>the system efficiency improvement</em> 仍嫌重，不如写 <em>the system now runs 12% more efficiently</em>。' },

    { t: 'h', lvl: 2, text: '五、被动语态：该用、不该用与逃避责任', id: 'ch02-5' },

    { t: 'p', html: '被动语态在技术写作里被两种极端对待：有人被老师告诫「一律别用」，有人为了「客观」通篇被动。两种都不对。被动的功能是<b>把动作的承受者提到主语位置</b>，当施动者未知、不重要、或显而易见时，它是最自然的选择。方法章节写 <em>The samples were heated to 80 °C for 20 minutes</em>，比 <em>We heated…</em> 更常见，因为读者关心的是样品与条件，不是谁按的按钮。' },

    { t: 'p', html: '但被动有两个真实代价。<b>代价一：句子变长、变弱。</b><em>A decision was made to postpone the trial</em> 比 <em>We postponed the trial</em> 多三个词，还少了责任人。<b>代价二：可以藏责任。</b>技术报告里出现 <em>Mistakes were made</em>，读者立刻会问「谁做的」。在需要明确责任的场合（进度延误、预算超支、安全事故），主动语态是职业态度的一部分。' },

    { t: 'table', caption: '主动与被动的选择：看三个条件', head: ['情形', '推荐', '例子'], rows: [
      ['施动者未知或不重要', '被动', 'The cable was damaged during transport.'],
      ['读者关心对象与条件（方法、结果）', '被动', 'Samples were dried at 60 °C for 12 h.'],
      ['需要明确责任或推动行动', '主动', 'We will replace the faulty gateway by Friday.'],
      ['句尾需要承接新信息', '按 given-new 调整', 'The delay was caused by a customs hold.'],
      ['同一段连续被动超过三句', '至少改一句为主动', 'We then reran the test with a new batch.']
    ] },

    { t: 'p', html: '还有一个折中工具：<b>无施动者的主动句</b>。用 <em>the data show</em>、<em>the system logs</em>、<em>this section compares</em> 这类「物作主语」的主动句，既避免 <em>we</em> 的重复，又不陷入被动。技术写作里大量句子其实适合这种写法，例如 <em>Table 2 summarises the cost estimates</em>，比 <em>The cost estimates are summarised in Table 2</em> 更直接。' },

    { t: 'h', lvl: 2, text: '六、技术定义：三种写法与两个陷阱', id: 'ch02-6' },

    { t: 'p', html: '技术定义（technical definition）的目的是让一个没有该背景的读者准确理解一个术语，并且能把它与相邻概念区分开。三种写法按篇幅递进：<b>括号式</b>用于一眼能懂的术语，<b>句子式</b>用于需要一句解释的术语，<b>扩展式</b>用于核心概念（通常单独一段，含原理、组成、例子）。' },

    { t: 'steps', items: [
      { title: '括号式：术语（全称，缩写）', html: '第一次出现时补全称与缩写，例如 <em>mean time between failures (MTBF)</em>。适合读者只需知道「这是个指标」的场合，不展开原理。' },
      { title: '句子式：属 + 种差', html: '公式是「A is a B that C」。A 是被定义项，B 是上位概念（属），C 是区别于同类事物的特征（种差）。例如 <em>A gateway is a device that forwards sensor readings to the cloud.</em>' },
      { title: '扩展式：定义 + 原理 + 例子 + 反例', html: '先给一句正式定义，再解释它怎么工作、给一个具体例子、最后说它不是什么。核心术语（如「回本周期」「信噪比」）值得这样处理。' }
    ] },

    { t: 'p', html: '第一个陷阱是<b>循环定义</b>：用被定义词解释它自己。<em>Energy efficiency is the efficiency with which energy is used.</em> 这句话没有增加任何信息。第二个陷阱是<b>过宽或过窄</b>：<em>A sensor is a device that measures temperature</em> 过窄，漏掉了压力、湿度传感器；<em>A sensor is a thing used in engineering</em> 过宽，什么都算了。检验方法：找一个反例，看定义能不能把它排除掉。' },

    { t: 'table', caption: '定义的三种写法：同一术语的三种颗粒度', head: ['写法', '篇幅', '适用场合', '示例'], rows: [
      ['括号式', '3–6 词', '缩写、单位、常见指标', 'payback period (the time for savings to repay the investment)'],
      ['句子式', '1 句', '章节内首次出现的技术名词', 'A baseline is the measured condition before any change is made.'],
      ['扩展式', '1 段', '全篇核心概念、评分标准里的关键词', '回本周期：定义 → 计算式 → 例子 → 常见误用']
    ] },

    { t: 'p', html: '定义还要注意<b>受众匹配</b>：给专家写 <em>A transformer is a device that changes voltage</em> 会被视为废话；给业外读者写 <em>A transformer is a magnetically coupled device that exploits Faraday’s law to step voltage up or down</em>，如果不解释 Faraday，仍然读不懂。定义的最佳颗粒度，是「读者已有的概念 + 一个新特征」。' },

    { t: 'h', lvl: 2, text: '七、模糊限制与断言：把话说得刚刚好', id: 'ch02-7' },

    { t: 'p', html: '第一章从读者角度讲过 hedging，这一节从句子层面给出操作阶梯。英语的断言强度大致分四档：<b>证明级</b>（show, demonstrate, confirm）、<b>指示级</b>（suggest, indicate, point to）、<b>推测级</b>（may, might, appear to, it is likely that）、<b>假设级</b>（assume, suppose, if）。写作时先确定证据在哪一档，再选动词，不要反过来先选一个漂亮动词再找证据。' },

    { t: 'p', html: '两个常见毛病。<b>一是双重模糊</b>：<em>It might possibly be suggested that…</em> 一句话叠了三个弱化词，读者不知道你到底信不信。<b>二是该硬不硬</b>：提案里写 <em>We would perhaps like to request some funding</em>，评审读不出金额与决心。技术文本的礼貌靠格式与称呼，不靠把请求写成疑问句。' },

    { t: 'p', html: '还有一个语法层面的细节：<b>情态动词 + 完成式</b>表示对过去的推测，例如 <em>The drift may have come from the calibration error</em>（可能来自，尚未证实）。如果已经验证，就写 <em>The drift came from…</em>。很多中国学生把 may have 当成「可能」的万能说法，用在已经确认的事实上，反而显得不自信。' },

    { t: 'p', html: '断言强度也要<b>全篇一致</b>。摘要里写 <em>proves</em>，讨论里写 <em>may suggest</em>，审稿人会觉得作者在夸大。稳妥的做法是：摘要跟讨论用同一档动词；如果结论有边界条件，就在结论句里带上条件，例如 <em>Under steady load, the controller reduces overshoot by 30%</em>，而不是笼统的 <em>The controller reduces overshoot</em>。' },

    { t: 'h', lvl: 2, text: '八、中式英语与冗余：十个高频替换', id: 'ch02-8' },

    { t: 'p', html: '中式英语（Chinglish）不是「英语不好」，而是<b>把中文的搭配直接搬进英语</b>。它最常出现在动词与名词的搭配上：中文说「进行研究」，英语不说 <em>do a research</em>，而说 <em>conduct a study</em>；中文说「提高水平」，英语更常说 <em>improve performance</em> 而不是 <em>raise the level</em>。下面这张表是技术写作里出现频率最高的十组替换。' },

    { t: 'table', caption: '十个高频替换：从「能懂」到「地道」', head: ['中式 / 冗余写法', '推荐写法', '原因'], rows: [
      ['do a research', 'conduct a study / carry out research', 'research 不可数；搭配用 conduct'],
      ['make an improvement', 'improve / raise', '动词直接表达，少一个名词'],
      ['very important', 'critical / essential', '技术文本用程度明确的词'],
      ['in the modern society', 'today / in recent years', '套话，删'],
      ['according to my opinion', 'in my view / I argue', 'according to 不接 opinion'],
      ['solve the problem of pollution', 'reduce pollution', 'solve 太满，除非问题被消除'],
      ['the reason is because', 'because / the reason is that', '语法重复'],
      ['more and more', 'increasingly / a growing number of', '口语化'],
      ['pay attention to', 'consider / address / monitor', '按动作选词'],
      ['etc.', '（列出全部，或写 such as …）', 'etc. 等于承认没列完']
    ] },

    { t: 'p', html: '冗余（redundancy）与中式英语常常同时出现。三类最典型：<b>同义堆叠</b>（<em>small in size</em>、<em>blue in colour</em>、<em>advance planning</em>）、<b>空壳短语</b>（<em>in terms of</em>、<em>with regard to</em>、<em>the fact that</em>）、<b>重复限定</b>（<em>completely eliminate</em>、<em>very unique</em>）。删这些不损失信息，只提升速度。' },

    { t: 'p', html: '最后一组是<b>动词短语 vs 单词动词</b>：<em>make a decision</em> → <em>decide</em>，<em>give consideration to</em> → <em>consider</em>，<em>carry out an analysis of</em> → <em>analyse</em>。技术文本偏爱单词动词，因为它们短、硬、不容易藏动作。把这一条与第四节的名词化合起来看，就是同一件事的两面：<b>让动词回到它该在的位置</b>。' },

    { t: 'terms', items: [
      { en: 'clarity', zh: '清晰', html: '读者一次读懂、不必回读的性质。靠信息顺序、句子长度与术语控制实现，不靠文采。' },
      { en: 'cohesion', zh: '衔接', html: '句子之间的连接方式，主要靠关键词重复、指代、连接词与平行结构四种手段。' },
      { en: 'given-new', zh: '已知—未知', html: '句首放读者已知的信息，句尾放新信息与重点。符合这条规则的句子读起来省力。' },
      { en: 'end weight', zh: '句尾重心', html: '英语句子的重点通常落在末尾。把结论、数字、对比项放在句尾，读者记得住。' },
      { en: 'nominalization', zh: '名词化', html: '把动词或形容词变成名词。可用来回指已知事件，滥用则让动作消失、句子变重。' },
      { en: 'passive voice', zh: '被动语态', html: '把动作承受者提为主语。施动者未知或不重要时适用，需要明确责任时应改用主动。' },
      { en: 'technical definition', zh: '技术定义', html: '用「属 + 种差」让读者准确理解术语，并把它与相邻概念区分开，避免循环与过宽过窄。' }
    ] },

    { t: 'quiz', qid: 'ch02-q1' },
    { t: 'quiz', qid: 'ch02-q2' },
    { t: 'quiz', qid: 'ch02-q3' },

    { t: 'keypoint', items: [
      { title: '清晰是可预测', html: '准确写条件、简洁删冗余、可核查给来源，三条底线之外再加一条全篇一致。' },
      { title: '句子有承重墙', html: '已知信息在前，新信息与结论在句尾。主语别堆太长，悬空的 this 要补名词。' },
      { title: '衔接优先靠重复', html: '关键词重复最稳，指代最省字，连接词标逻辑，平行结构管并列。一段三个 moreover 是警报。' },
      { title: '名词化是工具不是风格', html: '回指已知事件可以用，藏关键动作不行。一句三个动作名词就该重写。' },
      { title: '被动看三个条件', html: '施动者未知、读者关心对象、句尾要接新信息时用被动；要追责、要推动行动时用主动。' },
      { title: '定义要有种差', html: '属 + 种差，能用反例检验。循环定义、过宽、过窄是三个必须避开的坑。' }
    ] },

    { t: 'checklist', id: 'ch02', items: [
      '我能用三条底线各改出一句更合格的版本，并说明改了什么',
      '我能在自己写的一段话里标出每句的已知信息与新信息，检查顺序是否颠倒',
      '我能说出四种衔接手段，并指出自己最常用与最不常用的那一种',
      '我能把一句含三个动作名词的句子改写成主谓宾结构',
      '我能判断一段连续被动是否该改主动，并给出理由',
      '我能为一个核心术语写出括号式、句子式、扩展式三种定义',
      '我能用反例检验自己的定义是否过宽或过窄',
      '我能把断言动词按证据强度分成四档，并检查全篇是否一致',
      '我能从自己的作文里找出至少五处中式搭配或冗余表达并替换'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应课程第 2 周的两个主题：technical prose 的 clarity and cohesion，以及 technical definitions；同时衔接第 1 周关于 register 与 hedging 的讨论。三条底线、given-new 与句尾重心、四种衔接手段、名词化与被动语态的取舍，参考了 Markel《Technical Communication》第 10 版第 9–10 章与 Pfeiffer & Adkins 第 8 版相应章节的框架；十组中式英语替换来自课堂讲义中反复出现的修改示例，例句为教学需要而改写，不指向任何具体学生的作业。' }
  ]
});
