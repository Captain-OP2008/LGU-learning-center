/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 覆盖 ch00–ch07，每章 7 题，共 56 题；每章第 1–3 题为章内嵌题。
 * 字段：{ id, ch, kp, tier, type, difficulty, tags, stem, options|answer, explain }
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['assessment', 'course-map'],
        stem: '按课程介绍的权重，下列哪一项在总评中占比最大？',
        options: [
          { text: '小组视频项目（含组间互评，合计 40%）', correct: true },
          { text: '期末闭卷考试（40%）' },
          { text: 'Excel 作业（25%）' },
          { text: '出勤与课堂参与（10%）' }
        ],
        explain: '本课没有期末考试。视频 30% 加组间互评 10% 合计 40%，是最大的一块；Excel 作业与在线测各 25%，出勤 10%。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['dependencies'],
        stem: '如果要读懂安全日志并用表格算出云服务账单，最合理的章节依赖链是？',
        options: [
          { text: '先 ch02 表格，再 ch03 安全与 ch05 云', correct: true },
          { text: '先 ch06 伦理，再 ch07 视频' },
          { text: '先 ch01 硬件，再 ch07 剪辑' },
          { text: '先 ch04 检索，再 ch02 公式' }
        ],
        explain: '安全日志与云账单都要落到可筛选、可求和的表上，所以 ch02 是前置；ch03 与 ch05 提供解读这些数据的框架。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'fill', difficulty: 2,
        tags: ['assessment'],
        stem: '视频项目本体占 30%，组间互评占 10%。两者合计占总评的百分之多少？（只填数字，如 25）',
        answer: '40',
        accept: ['40', '40%', '百分之四十'],
        explain: '30% + 10% = 40%，这是本课权重最大的一块，排期时应优先保障它的时间。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下列哪些属于讲义对信息技术定义中的动作？（多选）',
        options: [
          { text: '创建 create', correct: true },
          { text: '处理 process', correct: true },
          { text: '交换 exchange', correct: true },
          { text: '编程 program' },
          { text: '维修 repair' }
        ],
        explain: '讲义的定义是用计算机创建、处理、存储与检索、交换数据与信息；编程与维修都属于实现手段，不是定义里的动作。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'tf', difficulty: 1,
        tags: ['assessment'],
        stem: '本课设有期末考试，卷面成绩占总评的一半。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '本课没有期末考试，成绩来自两次作业、小组视频项目与出勤参与，评分记为 DPF 且不计入 GPA。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['rules'],
        stem: '视频迟交 2 天及以上，按规则该次视频作业得分为多少分？（填数字）',
        answer: '0',
        accept: ['0', '零', '0分'],
        explain: '规则是迟交 1 天扣 40%，2 天及以上直接 0 分；这条没有弹性，排期时必须留出提前量。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['study-method'],
        stem: '关于每周两小时的学习节奏，下列做法最符合本章建议的是？',
        options: [
          { text: '读一节就合上页面重算一个例子，再做对应题目', correct: true },
          { text: '先刷完七章正文，最后一周集中做题' },
          { text: '只背术语表，跳过所有带数字的例子' },
          { text: '把时间全部投在剪辑，表格与检索考前再看' }
        ],
        explain: '带数字与公式的例子看一遍都会、动手就错，重算是最有效的动作；连续读完再做题会把问题积压到最后。'
      },

      /* ---------------- ch01 现代信息技术全景 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['storage'],
        stem: '下列存储介质按随机读写速度从快到慢排列，正确的是？',
        options: [
          { text: 'NVMe SSD > SATA SSD > 机械硬盘', correct: true },
          { text: '机械硬盘 > SATA SSD > NVMe SSD' },
          { text: 'SATA SSD > NVMe SSD > 机械硬盘' },
          { text: '三者速度相当，只差容量' }
        ],
        explain: 'NVMe 走 PCIe，顺序读写可达 3–7 GB/s；SATA SSD 受接口限制约 550 MB/s；机械硬盘顺序 100–200 MB/s，随机读写更差一个数量级以上。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['protocol'],
        stem: '浏览器把域名解析成 IP 地址（DNS 查询）发生在 TCP/IP 四层模型的哪一层？',
        options: [
          { text: '应用层', correct: true },
          { text: '传输层' },
          { text: '网际层' },
          { text: '网络接口层' }
        ],
        explain: 'DNS 是应用层协议，它依赖传输层与网际层完成实际传输，但查询本身的语义属于应用层服务。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-6', tier: 1, type: 'tf', difficulty: 1,
        tags: ['internet'],
        stem: '万维网（World Wide Web）就是互联网（Internet），两者是同一件事。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '互联网是用 TCP/IP 互连的基础设施，万维网只是其上的 HTTP 服务；邮件、SSH、DNS、VoIP 都不依赖浏览器。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['internet'],
        stem: '下列哪些属于互联网服务但不属于万维网？（多选）',
        options: [
          { text: '电子邮件（SMTP/IMAP）', correct: true },
          { text: '远程登录（SSH）', correct: true },
          { text: '域名解析（DNS）', correct: true },
          { text: '在浏览器里打开网页' }
        ],
        explain: '邮件、SSH、DNS 都在互联网上运行，但不通过浏览器与 HTTP 呈现；浏览器打开网页才是万维网。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'fill', difficulty: 1,
        tags: ['moore'],
        stem: '摩尔定律最初观察到的晶体管数量翻倍周期约为多少年？（只填数字）',
        answer: '2',
        accept: ['2', '两', '二年', '两年'],
        explain: '1965 年的观察是约每两年翻一倍，近年放缓到约两年半，这也是芯片业转向封装与专用加速器的背景之一。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['network'],
        stem: '视频会议画面卡顿、声音断续，但测速显示带宽充足。最可能的原因是？',
        options: [
          { text: '延迟高或丢包严重', correct: true },
          { text: '硬盘容量不足' },
          { text: '屏幕分辨率太低' },
          { text: 'CPU 核心数太少' }
        ],
        explain: '实时音视频对延迟与丢包极敏感，带宽只决定能传多少；延迟从 20 ms 涨到 200 ms，体验会明显变差。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['backup'],
        stem: '3-2-1 备份原则中的「2」指至少把数据存放在几种不同的介质上？（填数字）',
        answer: '2',
        accept: ['2', '两', '两种', '二'],
        explain: '3 份数据、2 种不同介质、1 份异地；云盘同步会跟着误删，不能替代离线或带版本历史的备份。'
      },

      /* ---------------- ch02 电子表格 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['reference'],
        stem: '税率放在 B1，公式要向下填充到每一行都引用同一格 B1，应写成？',
        options: [
          { text: '=$B$1', correct: true },
          { text: '=B1' },
          { text: '=B$1' },
          { text: '=$B1' }
        ],
        explain: '行列都锁的绝对引用 $B$1 填充到任何位置都指向 B1；只写 B1 会在向下填充时变成 B2、B3，取到空值。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['vlookup'],
        stem: 'VLOOKUP 返回 #N/A，下列哪个原因最不可能？',
        options: [
          { text: '第四参数写了 FALSE', correct: true },
          { text: '查找值不在查找区域的第一列' },
          { text: '查找值与表中的数据类型不一致' },
          { text: '单元格里有多余空格' }
        ],
        explain: '写 FALSE 是精确匹配的正确做法，不会导致 #N/A；其余三项都会让函数找不到匹配值。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['filter'],
        stem: '筛选之后，合计单元格用 SUM 与 SUBTOTAL 的差别是？',
        options: [
          { text: 'SUBTOTAL 只算可见行，SUM 会把隐藏行也加上', correct: true },
          { text: 'SUM 只算可见行，SUBTOTAL 算全部' },
          { text: '两者结果永远相同' },
          { text: 'SUBTOTAL 不能用于求和' }
        ],
        explain: 'SUBTOTAL(9,区域) 会忽略被筛选隐藏的行，SUM 不会；这是「筛选后总计不对」的最常见原因。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['data-standard'],
        stem: '下列哪些是规范原始数据表应当满足的要求？（多选）',
        options: [
          { text: '一行一条记录', correct: true },
          { text: '一列一个字段', correct: true },
          { text: '首行是字段名且不重复', correct: true },
          { text: '区域内不留空行空列', correct: true },
          { text: '用合并单元格让表更好看' }
        ],
        explain: '合并单元格会让公式只读到左上角、排序报错，是原始数据区的禁忌；其余四条是规范表的基础。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['sumif'],
        stem: '公式 =SUMIF(D:D,"笔记本",E:E) 中，被求和的是哪一列？（填列字母）',
        answer: 'E',
        accept: ['E', 'E列', 'E:E'],
        explain: 'SUMIF 的参数顺序是条件区域、条件、求和区域，所以求和区域是 E 列，D 列只用来判断是否等于「笔记本」。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['error'],
        stem: '循环引用会让 Excel 直接显示 #REF! 错误值。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '循环引用会弹出警告并通常显示 0；#REF! 表示引用失效，比如被引用的行或列被删除。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['chart'],
        stem: '想展示某产品四个季度的销售额变化趋势，最合适的图是？',
        options: [
          { text: '折线图', correct: true },
          { text: '饼图' },
          { text: '3D 饼图' },
          { text: '雷达图' }
        ],
        explain: '折线图强调随时间的连续变化；饼图用于部分与整体的构成，类别多于四项时难以比较。'
      },

      /* ---------------- ch03 信息安全 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['cia'],
        stem: '勒索软件把文件加密导致无法打开，主要破坏了 CIA 中的哪一项？',
        options: [
          { text: '可用性 availability', correct: true },
          { text: '机密性 confidentiality' },
          { text: '完整性 integrity' },
          { text: '不可否认性 non-repudiation' }
        ],
        explain: '文件被加密后无法使用，损失的是可用性；如果攻击者同时把数据外传，还会伤及机密性。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['phishing'],
        stem: '收到一封「教务处」邮件要求 24 小时内点击链接核对学生信息，最可靠的识别依据是？',
        options: [
          { text: '发件人域名与学校官方域名不一致，且链接指向陌生站点', correct: true },
          { text: '邮件里用了学校 Logo' },
          { text: '邮件语气很正式' },
          { text: '邮件在手机上显示正常' }
        ],
        explain: 'Logo、语气、排版都能伪造；域名与链接真实地址才是可核查的硬证据，悬停看链接、核对发件域名最有效。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-6', tier: 1, type: 'tf', difficulty: 1,
        tags: ['tls'],
        stem: '浏览器地址栏出现 HTTPS 锁标，就说明这个网站是可信的。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '锁标只表示连接用了 TLS 且证书链校验通过，钓鱼站也能申请免费证书；网站是否可信仍要看域名、主办方与内容。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['password'],
        stem: '下列哪些做法能降低一次口令泄露带来的连锁风险？（多选）',
        options: [
          { text: '重要账号使用互不相同的长口令', correct: true },
          { text: '为重要账号开启验证器 App 或硬件密钥式 MFA', correct: true },
          { text: '用密码管理器生成并填充口令', correct: true },
          { text: '所有账号共用同一口令，方便记忆' }
        ],
        explain: '口令复用会让一次泄露变成全面失守；不同口令、MFA 与密码管理器分别从「不重复」「多一层」「不手输」三个角度降低风险。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'fill', difficulty: 2,
        tags: ['risk'],
        stem: '常用公式「风险 = 可能性 × ____」，空格处应填什么？',
        answer: '影响',
        accept: ['影响', 'impact'],
        explain: '风险由发生的可能性与造成的影两者相乘，降低脆弱性就是在压低可能性与影响。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['hash'],
        stem: '关于哈希（hash）的性质，下列说法正确的是？',
        options: [
          { text: '它是单向的，无法从摘要还原原文，适合校验完整性与存储口令', correct: true },
          { text: '它是可逆的，用密钥可以解密回原文' },
          { text: '它只能处理数字，不能处理文本' },
          { text: '它和对称加密是同一件事' }
        ],
        explain: '哈希不可逆，用于完整性校验与口令存储（加盐）；可逆的是加密，用于保密。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-8', tier: 2, type: 'fill', difficulty: 2,
        tags: ['backup'],
        stem: '3-2-1 备份原则要求至少一份备份存放在____，以防本机或机房整体损毁。（填两个字）',
        answer: '异地',
        accept: ['异地', '其他地方', '异地备份'],
        explain: '3 份数据、2 种介质、1 份异地；勒索软件与火灾水灾都可能同时毁掉本机与本地备份。'
      },

      /* ---------------- ch04 信息素养 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['definition'],
        stem: 'ALA 对信息素养的定义包含四个环节，下列哪一项不在其中？',
        options: [
          { text: '出版发表', correct: true },
          { text: '识别何时需要信息' },
          { text: '定位信息' },
          { text: '评价并有效使用信息' }
        ],
        explain: 'ALA 1989 年的定义是识别需求、定位、评价与有效使用；出版属于创作与传播，不是信息素养的环节。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['search'],
        stem: '想只搜政府网站上的 PDF 报告，检索式应写成？',
        options: [
          { text: 'site:gov.cn filetype:pdf 关键词', correct: true },
          { text: 'gov.cn pdf 关键词' },
          { text: '关键词 OR gov.cn' },
          { text: '"gov.cn pdf" -关键词' }
        ],
        explain: 'site: 限定域名、filetype: 限定文件类型，两个限定符叠加最直接；空格只是 AND，不能限定站点或格式。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['sources'],
        stem: '下列哪一项属于一手来源？',
        options: [
          { text: '政府统计部门发布的原始统计表', correct: true },
          { text: '教科书对统计结果的解读' },
          { text: '新闻网站的综合报道' },
          { text: '百科条目' }
        ],
        explain: '一手来源是事件的直接记录或原始数据；教材、新闻综述与百科都是对原始材料的整理与解释。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['evaluation'],
        stem: '评价一个网页来源时，课程给出的四条准则是哪些？（多选）',
        options: [
          { text: '权威性 authority', correct: true },
          { text: '时效性 currency', correct: true },
          { text: '准确性 accuracy', correct: true },
          { text: '客观性 objectivity', correct: true },
          { text: '页面配色是否美观' }
        ],
        explain: '四条准则是权威、时效、准确、客观；版式与配色与内容可信度无关，最多影响可读性。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['boolean'],
        stem: '在搜索引擎中表示「或者」、用于扩大范围的布尔运算符是哪个英文缩写？',
        answer: 'OR',
        accept: ['OR', 'or', 'Or'],
        explain: 'OR 必须大写才被识别为运算符，用于并列同义词或不同写法；空格默认表示 AND。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 1, type: 'tf', difficulty: 1,
        tags: ['domain'],
        stem: '域名后缀 .org 代表非营利机构，因此凡是 .org 网站的内容都可信。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '.org 任何人都能注册，后缀只是第一轮筛选的线索；可信度仍要看作者、机构、时效与出处。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'fill', difficulty: 2,
        tags: ['citation'],
        stem: '网页引用除作者、时间、标题、来源外，还需要补充哪一个日期要素？',
        answer: '访问日期',
        accept: ['访问日期', '访问时间', '引用日期'],
        explain: '网页会改会删，访问日期让读者判断你看到的是哪一版；缺作者写机构名，缺发布日写 n.d. 并说明。'
      },

      /* ---------------- ch05 新兴技术 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['cloud'],
        stem: '用户只写应用代码与数据，运行时、数据库、扩缩容由厂商管，这属于哪种云服务模型？',
        options: [
          { text: 'PaaS 平台即服务', correct: true },
          { text: 'IaaS 基础设施即服务' },
          { text: 'SaaS 软件即服务' },
          { text: 'DaaS 桌面即服务' }
        ],
        explain: 'PaaS 把运行时与中间件交给厂商，用户只管代码与数据；IaaS 用户还要管操作系统，SaaS 用户只管配置与数据。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['bigdata'],
        stem: '在批处理与流处理之间做选择，最关键的判断依据是？',
        options: [
          { text: '对结果延迟的要求', correct: true },
          { text: '数据文件用不用压缩' },
          { text: '服务器是不是品牌机' },
          { text: '数据表有多少列' }
        ],
        explain: '流处理面向毫秒到秒级的即时结果，批处理面向分钟到小时级的离线汇总；延迟要求决定架构，数据量本身不决定。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['ai'],
        stem: '大语言模型产生「幻觉」的根本原因是？',
        options: [
          { text: '它优化的是下一个词的概率，而不是事实为真', correct: true },
          { text: '训练数据太少，只有几百条' },
          { text: '模型没有联网功能' },
          { text: '用户提问的语法不正确' }
        ],
        explain: '模型按概率生成连贯文本，不为真实性负责；所以生成结果应当作草稿，用可核查来源校验。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['5g'],
        stem: '5G 的三个典型应用场景包括哪些？（多选）',
        options: [
          { text: '增强移动宽带 eMBB', correct: true },
          { text: '超可靠低延迟 URLLC', correct: true },
          { text: '海量机器通信 mMTC', correct: true },
          { text: '蓝牙近场支付' }
        ],
        explain: '5G 三场景是 eMBB、URLLC、mMTC；蓝牙与 NFC 属于短距通信，不是 5G 的场景划分。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'fill', difficulty: 2,
        tags: ['cloud'],
        stem: '云计算把一次性的资本支出（capex）变成持续性的____支出。（填两个字，可写 opex）',
        answer: '运营',
        accept: ['运营', 'opex', '运营支出', '营运'],
        explain: '按用量付费把买服务器的一次性投入变成每月账单，成本可预测性变差，也更容易因忘记关实例而超支。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-7', tier: 1, type: 'tf', difficulty: 1,
        tags: ['blockchain'],
        stem: '数据一旦写入区块链，就证明它一定是真实的。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '区块链只能证明记录在某时刻存在且难以篡改，不能证明上链前的数据真实；「上链即可信」是常见误解。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['edge'],
        stem: '把计算放到边缘而不是全部传回云，主要代价是？',
        options: [
          { text: '边缘节点难维护、算力有限', correct: true },
          { text: '延迟一定变高' },
          { text: '带宽消耗一定变大' },
          { text: '数据必须公开' }
        ],
        explain: '边缘计算降低延迟与回传带宽、便于本地处理隐私数据，但节点分散难维护、单点算力有限。'
      },

      /* ---------------- ch06 知识产权与伦理 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['ip'],
        stem: '保护作品表达形式（文字、音乐、代码）的是哪一类知识产权？',
        options: [
          { text: '版权（著作权）', correct: true },
          { text: '专利' },
          { text: '商标' },
          { text: '商业秘密' }
        ],
        explain: '版权保护表达不保护思想；专利保护技术方案，商标保护来源标志，商业秘密保护不为公众所知的信息。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['patent'],
        stem: '关于专利权，下列说法正确的是？',
        options: [
          { text: '它是排他权，拥有专利不等于可以自由实施', correct: true },
          { text: '它是使用权，拥有专利就能随意生产销售' },
          { text: '一项专利在全世界都受保护' },
          { text: '专利申请前公开发表不影响授权' }
        ],
        explain: '专利是禁止他人未经许可实施的排他权；实施可能落入他人专利范围，且专利有地域性，申请前公开会破坏新颖性。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-6', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['fair-use'],
        stem: '判断是否构成合理使用时，下列哪一项不是四要素之一？',
        options: [
          { text: '使用的时长是否少于 10 秒', correct: true },
          { text: '使用的目的与性质' },
          { text: '作品的性质' },
          { text: '对原作品市场的影响' }
        ],
        explain: '四要素是目的、作品性质、使用数量与实质性、市场影响；时长不是独立标准，用了核心片段哪怕几秒也可能越界。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['image'],
        stem: '使用他人图片的合法路径包括哪些？（多选）',
        options: [
          { text: '付费获得授权', correct: true },
          { text: '在合理使用范围内使用', correct: true },
          { text: '遵守 CC 许可条款使用', correct: true },
          { text: '使用已进入公有领域的作品', correct: true },
          { text: '从搜索引擎图片页直接下载' }
        ],
        explain: '四条路径是付费、合理使用、CC、公有领域；搜索引擎图片页只是索引，不提供授权。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'fill', difficulty: 2,
        tags: ['patent'],
        stem: '专利授权的实质条件除新颖性、创造性外，还有哪一项？（填三个字）',
        answer: '实用性',
        accept: ['实用性', '有用性'],
        explain: '三性是新颖性、创造性、实用性；说明书还要充分公开到本领域技术人员能实现。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['copyright'],
        stem: '作品必须先去版权局登记，才享有版权保护。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '作品创作完成并固定在有形载体上即受保护，登记只便于举证，不是权利产生的前提。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['trademark'],
        stem: 'New Balance 与新百伦商标案，2015 年一审判决的赔偿金额是多少万元？（只填数字）',
        answer: '9800',
        accept: ['9800', '9,800', '九千八百'],
        explain: '2015 年一审判决赔偿 9,800 万元，2016 年二审改判 500 万元，说明判赔取决于损失、获利与许可费的举证。'
      },

      /* ---------------- ch07 视频项目 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['assessment'],
        stem: '视频项目（视频本体加组间互评）合计占总评的比例是？',
        options: [
          { text: '40%', correct: true },
          { text: '30%' },
          { text: '25%' },
          { text: '10%' }
        ],
        explain: '视频本体 30%、组间互评 10%，合计 40%；组内互评属于视频交付的一部分，不单独加权。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['topic'],
        stem: '把一个过大的选题收窄，最有效的做法是？',
        options: [
          { text: '加上场景、对象与要回答的问题三个限定', correct: true },
          { text: '把标题改得更短' },
          { text: '增加更多专业术语' },
          { text: '把时长从五分钟缩短到三分钟' }
        ],
        explain: '「人工智能」是领域，「校园刷脸门禁采集了哪些数据、学生能否拒绝」才是题目；三个限定让范围与证据都具体。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-6', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['originality'],
        stem: '课程规定他人素材（片段、配音、图片等）合计不得超过视频总时长的多少？',
        options: [
          { text: '30%', correct: true },
          { text: '50%' },
          { text: '10%' },
          { text: '没有限制，标注来源即可' }
        ],
        explain: '上限是总时长的 30%，且必须本人配音、不得用合成语音；五分钟视频的外来素材最多一分半。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['submission'],
        stem: '提交前必须核对的项目包括哪些？（多选）',
        options: [
          { text: '时长不超过 5 分钟', correct: true },
          { text: '文件体积不超过 1 GB', correct: true },
          { text: '格式为 mp4', correct: true },
          { text: '片头有题目与全体组员姓名学号', correct: true },
          { text: '分辨率必须达到 4K' }
        ],
        explain: '规格是 mp4、≤5 分钟、≤1 GB、片头信息完整，4K 不是要求；1080p 足够且更省体积。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-7', tier: 1, type: 'fill', difficulty: 1,
        tags: ['late'],
        stem: '视频迟交 1 天，按规则扣掉该次视频作业分数的百分之多少？（只填数字）',
        answer: '40',
        accept: ['40', '40%', '四十'],
        explain: '迟交 1 天扣 40%，2 天及以上直接 0 分；组内互评迟交另扣视频分的 30%。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-7', tier: 1, type: 'tf', difficulty: 1,
        tags: ['evaluation'],
        stem: '组内互评只需要评价其他组员，不需要给自己打分。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '组内互评要求每位成员给包括自己在内的所有组员打分；信息填写错误还会按规则扣分。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['script'],
        stem: '按本章给的英文旁白语速估算，每分钟约多少词到 150 词？请填下限数字。',
        answer: '130',
        accept: ['130', '130词'],
        explain: '英文旁白舒适语速约每分钟 130–150 词，五分钟约 650–750 词，实际控制在 600 词左右更安全。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
