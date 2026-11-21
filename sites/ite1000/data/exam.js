/* =====================================================================
 * exam.js · 模拟卷（CSC.registerExam）
 * ITE1000 模拟卷 A：12 题，满分 100，建议用时 100 分钟。
 * 覆盖 ch01–ch07 的核心概念、Excel 公式、安全常识、检索与引用、IP 与视频规格。
 * ===================================================================== */
CSC.registerExam({
  id: 'ITE1000-A',
  title: '模拟卷 A',
  style: 'MIDTERM',
  subtitle: '覆盖第 1–7 章：现代 IT、电子表格、信息安全、信息素养、新兴技术、知识产权与视频项目',
  date: '',
  minutes: 100,
  totalScore: 100,
  summary: '全卷 12 题，满分 100 分。选择题与判断题各 2 分，填空题 4 分，公式与简答按小问计分；重点考查「能否把概念用在一个具体场景里」，而不是背术语。',
  instructions: [
    '闭卷限时 100 分钟，可携带一张 A4 手写公式纸，不得使用联网设备。',
    '选择题只有一个正确选项；多选题漏选不得分，判断题只需写「对」或「错」。',
    'Excel 公式题请写出完整公式（含等号），引用区域用 A:A 或 A2:A100 均可，只要语义正确。',
    '简答与关键词题按要点给分，答出关键动作即可，不要求逐字复述讲义。'
  ],
  questions: [
    {
      no: 1, points: 8, type: '选择题组',
      intro: '信息技术的历史与基本概念。每小题 2 分。',
      parts: [
        {
          label: '1-1', points: 2, kind: 'choice',
          prompt: 'ENIAC 诞生于哪一年？',
          options: [
            { text: '1946 年', correct: true },
            { text: '1956 年' },
            { text: '1965 年' },
            { text: '1971 年' }
          ],
          explain: 'ENIAC 1946 年公开，使用 17,468 只电子管，占地约 170 平方米、重 30 吨，每秒约 5,000 次运算。'
        },
        {
          label: '1-2', points: 2, kind: 'choice',
          prompt: '下列存储介质中，随机读写速度最快的是？',
          options: [
            { text: 'M.2 NVMe 固态硬盘', correct: true },
            { text: '2.5 英寸 SATA 固态硬盘' },
            { text: '7200 转机械硬盘' },
            { text: '蓝光光盘' }
          ],
          explain: 'NVMe 走 PCIe 通道，顺序读写可达每秒数 GB；SATA 接口约 550 MB/s；机械硬盘随机读写还要再慢一个数量级。'
        },
        {
          label: '1-3', points: 2, kind: 'choice',
          prompt: 'TCP/IP 四层模型自上而下正确的顺序是？',
          options: [
            { text: '应用层 → 传输层 → 网际层 → 网络接口层', correct: true },
            { text: '应用层 → 网际层 → 传输层 → 网络接口层' },
            { text: '传输层 → 应用层 → 网际层 → 网络接口层' },
            { text: '网络接口层 → 网际层 → 传输层 → 应用层' }
          ],
          explain: '自上而下是应用层、传输层、网际层、网络接口层；HTTP、DNS 在应用层，TCP/UDP 在传输层，IP 在网际层。'
        },
        {
          label: '1-4', points: 2, kind: 'choice',
          prompt: '关于「互联网」与「万维网」的关系，正确的是？',
          options: [
            { text: '万维网是运行在互联网之上的一种 HTTP 服务', correct: true },
            { text: '互联网就是万维网，两者是同一件事' },
            { text: '万维网是底层设施，互联网是它的一种应用' },
            { text: '没有浏览器就没有互联网' }
          ],
          explain: '互联网是用 TCP/IP 互连的基础设施；万维网只是其上的 HTTP 服务，邮件、SSH、DNS 都不依赖浏览器。'
        }
      ]
    },
    {
      no: 2, points: 8, type: '判断题组',
      intro: '判断下列说法是否正确，每小题 2 分。',
      parts: [
        {
          label: '2-1', points: 2, kind: 'tf',
          prompt: '机械硬盘的随机读写速度通常比固态硬盘快。',
          options: [
            { text: '对' },
            { text: '错', correct: true }
          ],
          explain: '机械硬盘需要磁头寻道与盘片旋转，随机读写毫秒级；固态硬盘没有机械结构，随机读写微秒级。'
        },
        {
          label: '2-2', points: 2, kind: 'tf',
          prompt: '3-2-1 备份原则要求至少有 3 份数据、存放在 2 种不同介质上、其中 1 份在异地。',
          options: [
            { text: '对', correct: true },
            { text: '错' }
          ],
          explain: '这是 3-2-1 的标准表述；云盘同步会跟着误删同步，不能替代离线备份或带版本历史的备份。'
        },
        {
          label: '2-3', points: 2, kind: 'tf',
          prompt: '光纤通信的关键论文由高锟与 George Hockham 在 1965 年发表，高锟后来获得诺贝尔物理学奖。',
          options: [
            { text: '对', correct: true },
            { text: '错' }
          ],
          explain: '1965 年两人论证了用玻璃纤维长距离传输光信号的可行性；高锟 2009 年获诺贝尔物理学奖，1987–1996 年任香港中文大学校长。'
        },
        {
          label: '2-4', points: 2, kind: 'tf',
          prompt: '摩尔定律最初观察到晶体管数量约每 18 个月翻一倍。',
          options: [
            { text: '对' },
            { text: '错', correct: true }
          ],
          explain: '1965 年的原始观察是约每两年翻一倍（后来业界常引用 18–24 个月的说法），近年已放缓到约两年半。'
        }
      ]
    },
    {
      no: 3, points: 8, type: '填空题组',
      intro: '每空 4 分，只填关键数字或词语。',
      parts: [
        {
          label: '3-1', points: 4, kind: 'fill',
          prompt: '摩尔定律最初描述的晶体管数量翻倍周期约为 ____ 年。',
          answer: '2',
          explain: '原始观察约两年翻倍；周期放慢意味着不能只靠缩小晶体管来提升性能，产业转向封装、专用加速器与并行架构。'
        },
        {
          label: '3-2', points: 4, kind: 'fill',
          prompt: '3-2-1 备份原则中的「1」指至少有一份备份存放在 ____。',
          answer: '异地',
          explain: '异地存放用于抵御火灾、水灾、盗窃与勒索软件同时毁掉本机与本地备份的情况。'
        }
      ]
    },
    {
      no: 4, points: 10, type: '综合题（引用与函数）',
      intro: 'Excel 引用与查找，前两小题各 3 分，第三小题 4 分。',
      parts: [
        {
          label: '4-1', points: 3, kind: 'choice',
          prompt: '税率在 B1 单元格，公式向下填充时始终引用 B1，应写成？',
          options: [
            { text: '=$B$1', correct: true },
            { text: '=B1' },
            { text: '=B$1' },
            { text: '=$B1' }
          ],
          explain: '行列都锁的绝对引用 $B$1 不会随填充改变；只锁行或只锁列在向下填充时仍可能偏移。'
        },
        {
          label: '4-2', points: 3, kind: 'choice',
          prompt: 'VLOOKUP 要做精确匹配，第四个参数应填？',
          options: [
            { text: 'FALSE 或 0', correct: true },
            { text: 'TRUE 或 1' },
            { text: '留空即可' },
            { text: '2' }
          ],
          explain: '第四参数写 FALSE/0 才是精确匹配；省略或写 TRUE 会做近似匹配，在未排序的表上返回错误结果。'
        },
        {
          label: '4-3', points: 4, kind: 'fill',
          prompt: '要按 D 列的产品名统计 E 列金额合计，公式 =SUMIF(D:D,"笔记本",____) 的第三参数应填什么？（填区域引用）',
          answer: 'E:E',
          explain: 'SUMIF 的参数顺序是条件区域、条件、求和区域；D 列只负责判断，真正相加的是 E 列。'
        }
      ]
    },
    {
      no: 5, points: 10, type: '公式题',
      intro: '写出完整公式，每小题 5 分。',
      parts: [
        {
          label: '5-1', points: 5, kind: 'output',
          prompt: 'E2 是原价，F2 要显示打八折后的价格，请写出 F2 的公式。',
          answer: '=E2*0.8',
          explain: '八折就是原价乘 0.8；若写成 =E2*80% 结果相同。注意不要写死数字，否则向下填充会全部一样。'
        },
        {
          label: '5-2', points: 5, kind: 'output',
          prompt: 'A 列是产品名、B 列是金额，请写出统计「笔记本」总金额的公式（区域用整列）。',
          answer: '=SUMIF(A:A,"笔记本",B:B)',
          explain: '条件区域 A:A、条件 "笔记本"、求和区域 B:B；文本条件要加英文双引号。'
        }
      ]
    },
    {
      no: 6, points: 8, type: '选择题组（信息安全）',
      intro: '每小题 2 分。',
      parts: [
        {
          label: '6-1', points: 2, kind: 'choice',
          prompt: '勒索软件把文件加密导致无法打开，主要破坏了 CIA 中的哪一项？',
          options: [
            { text: '可用性 availability', correct: true },
            { text: '机密性 confidentiality' },
            { text: '完整性 integrity' },
            { text: '不可否认性 non-repudiation' }
          ],
          explain: '文件无法使用即可用性受损；若攻击者同时外传数据，还会伤及机密性。'
        },
        {
          label: '6-2', points: 2, kind: 'choice',
          prompt: '收到「教务处」要求 24 小时内点链接核对信息的邮件，最可靠的识别依据是？',
          options: [
            { text: '发件人域名与学校官方域名不一致，链接指向陌生站点', correct: true },
            { text: '邮件使用了学校 Logo' },
            { text: '邮件语气正式' },
            { text: '手机上看排版正常' }
          ],
          explain: 'Logo、语气、排版都能伪造；域名与链接真实地址才是可核查的证据。'
        },
        {
          label: '6-3', points: 2, kind: 'choice',
          prompt: '关于哈希（hash），正确的说法是？',
          options: [
            { text: '单向不可逆，适合校验完整性与存储口令', correct: true },
            { text: '可逆，用密钥能还原原文' },
            { text: '只能处理数字' },
            { text: '与对称加密是同一件事' }
          ],
          explain: '哈希不可逆；可逆的是加密。口令存储用加盐哈希，文件校验用摘要比对。'
        },
        {
          label: '6-4', points: 2, kind: 'choice',
          prompt: '下列哪一项属于「你知道的东西」这一类认证因素？',
          options: [
            { text: '口令或 PIN', correct: true },
            { text: '指纹' },
            { text: '手机短信验证码' },
            { text: '硬件安全密钥' }
          ],
          explain: '认证三因素是知道的东西、拥有的东西、生物特征；口令属于知道，指纹属于生物特征，短信与硬件密钥属于拥有。'
        }
      ]
    },
    {
      no: 7, points: 8, type: '判断题与简答',
      intro: '前两小题各 2 分，简答 4 分。',
      parts: [
        {
          label: '7-1', points: 2, kind: 'tf',
          prompt: '浏览器出现 HTTPS 锁标，就说明该网站内容可信。',
          options: [
            { text: '对' },
            { text: '错', correct: true }
          ],
          explain: '锁标只说明 TLS 连接与证书链有效，钓鱼站也能申请免费证书；可信度仍要看域名、主办方与内容。'
        },
        {
          label: '7-2', points: 2, kind: 'tf',
          prompt: '操作系统与浏览器发布安全补丁后，应尽快安装而不是长期推迟。',
          options: [
            { text: '对', correct: true },
            { text: '错' }
          ],
          explain: '公开的漏洞细节会被迅速利用，补丁延迟等于把已知入口留在机器上；应先小范围验证再批量推送。'
        },
        {
          label: '7-3', points: 4, kind: 'keywords',
          prompt: '写出 3-2-1 备份原则的三项内容。',
          keywords: ['3 份数据', '2 种介质', '1 份异地'],
          answer: '至少 3 份数据副本，存放在 2 种不同介质上，其中 1 份放在异地。',
          explain: '三项分别防误删、防介质同时损坏、防场地级灾害；缺任何一项都不算完整。'
        }
      ]
    },
    {
      no: 8, points: 8, type: '选择题组（信息素养）',
      intro: '每小题 2 分。',
      parts: [
        {
          label: '8-1', points: 2, kind: 'choice',
          prompt: 'ALA 对信息素养的定义包含四个环节，下列哪项不在其中？',
          options: [
            { text: '出版发表', correct: true },
            { text: '识别何时需要信息' },
            { text: '定位信息' },
            { text: '评价并有效使用信息' }
          ],
          explain: '定义的四环节是识别需求、定位、评价、有效使用；出版属于创作与传播。'
        },
        {
          label: '8-2', points: 2, kind: 'choice',
          prompt: '只想搜政府网站上的 PDF，检索式应写成？',
          options: [
            { text: 'site:gov.cn filetype:pdf 关键词', correct: true },
            { text: 'gov.cn pdf 关键词' },
            { text: '关键词 OR gov.cn' },
            { text: '"gov.cn pdf" -关键词' }
          ],
          explain: 'site: 限定域名、filetype: 限定格式；普通空格只是 AND，不能限定站点或文件类型。'
        },
        {
          label: '8-3', points: 2, kind: 'choice',
          prompt: '下列哪一项属于一手来源？',
          options: [
            { text: '政府统计部门发布的原始统计表', correct: true },
            { text: '教科书对统计结果的解读' },
            { text: '新闻网站的综合报道' },
            { text: '百科条目' }
          ],
          explain: '一手来源是事件的直接记录或原始数据；教材、综述与百科都是二次整理。'
        },
        {
          label: '8-4', points: 2, kind: 'choice',
          prompt: '在搜索引擎中表示「或者」、用于扩大范围的运算符是？',
          options: [
            { text: 'OR（必须大写）', correct: true },
            { text: 'AND' },
            { text: 'NOT' },
            { text: '引号' }
          ],
          explain: 'OR 要大写才被识别为运算符，用于并列同义词；空格默认表示 AND，引号表示精确短语。'
        }
      ]
    },
    {
      no: 9, points: 8, type: '填空与简答',
      intro: '填空 4 分，简答 4 分。',
      parts: [
        {
          label: '9-1', points: 4, kind: 'fill',
          prompt: '引用网页时，除作者、时间、标题、来源外，还必须补充 ____ 以说明你看到的是哪一版。',
          answer: '访问日期',
          explain: '网页会改会删，访问日期让读者判断版本；缺作者写机构名，缺发布日期写 n.d. 并说明。'
        },
        {
          label: '9-2', points: 4, kind: 'keywords',
          prompt: '写出评价网络来源的四条准则。',
          keywords: ['权威性', '时效性', '准确性', '客观性'],
          answer: '权威性 authority、时效性 currency、准确性 accuracy、客观性 objectivity。',
          explain: '四准则分别问作者是谁、信息多新、有无证据、有无利益偏向；域名后缀只是线索，不能替代这四项。'
        }
      ]
    },
    {
      no: 10, points: 8, type: '选择题组（新兴技术）',
      intro: '每小题 2 分。',
      parts: [
        {
          label: '10-1', points: 2, kind: 'choice',
          prompt: '用户只写应用代码与数据，运行时、数据库与扩缩容由厂商负责，属于哪种云服务模型？',
          options: [
            { text: 'PaaS 平台即服务', correct: true },
            { text: 'IaaS 基础设施即服务' },
            { text: 'SaaS 软件即服务' },
            { text: 'DaaS 桌面即服务' }
          ],
          explain: 'PaaS 把运行时与中间件交给厂商；IaaS 用户还要管操作系统，SaaS 用户只管配置与数据。'
        },
        {
          label: '10-2', points: 2, kind: 'choice',
          prompt: '大数据的 4V 不包括下列哪一项？',
          options: [
            { text: 'Visibility 可见性', correct: true },
            { text: 'Volume 体量' },
            { text: 'Velocity 速度' },
            { text: 'Variety 多样性' }
          ],
          explain: '4V 是体量、速度、多样性、真实性（veracity）；可见性不是大数据的特征维度。'
        },
        {
          label: '10-3', points: 2, kind: 'choice',
          prompt: '大语言模型产生「幻觉」的根本原因是？',
          options: [
            { text: '它优化的是下一个词的概率，而不是事实为真', correct: true },
            { text: '训练数据只有几百条' },
            { text: '模型没有联网' },
            { text: '用户语法不正确' }
          ],
          explain: '模型按概率生成连贯文本，不为真实性负责；生成结果应作为草稿并用可核查来源校验。'
        },
        {
          label: '10-4', points: 2, kind: 'choice',
          prompt: '5G 中面向「低延迟、高可靠」场景的技术指标是？',
          options: [
            { text: 'URLLC', correct: true },
            { text: 'eMBB' },
            { text: 'mMTC' },
            { text: 'NFC' }
          ],
          explain: '5G 三场景是 eMBB（大带宽）、URLLC（低延迟高可靠）、mMTC（海量连接）；NFC 是短距通信。'
        }
      ]
    },
    {
      no: 11, points: 8, type: '选择题组（知识产权）',
      intro: '每小题 2 分。',
      parts: [
        {
          label: '11-1', points: 2, kind: 'choice',
          prompt: '保护作品表达形式（文字、音乐、代码）的是哪一类知识产权？',
          options: [
            { text: '版权（著作权）', correct: true },
            { text: '专利' },
            { text: '商标' },
            { text: '商业秘密' }
          ],
          explain: '版权保护表达不保护思想；专利保护技术方案，商标保护来源标志。'
        },
        {
          label: '11-2', points: 2, kind: 'choice',
          prompt: '关于专利权，正确的说法是？',
          options: [
            { text: '它是排他权，拥有专利不等于可以自由实施', correct: true },
            { text: '它是使用权，拥有专利就能随意生产销售' },
            { text: '一项专利在全世界受保护' },
            { text: '申请前公开发表不影响授权' }
          ],
          explain: '专利是禁止他人未经许可实施的排他权；实施可能落入他人专利范围，且申请前公开会破坏新颖性。'
        },
        {
          label: '11-3', points: 2, kind: 'choice',
          prompt: '注册商标的保护期与续展规则是？',
          options: [
            { text: '10 年，可无限次续展', correct: true },
            { text: '20 年，不可续展' },
            { text: '作者终生加 50 年' },
            { text: '5 年，只能续展一次' }
          ],
          explain: '注册商标每次 10 年，可以不断续展；发明专利 20 年、实用新型 10 年、外观设计 15 年，版权为作者终生加 50 年。'
        },
        {
          label: '11-4', points: 2, kind: 'choice',
          prompt: '判断合理使用时，下列哪一项不是四要素之一？',
          options: [
            { text: '使用时长是否少于 10 秒', correct: true },
            { text: '使用的目的与性质' },
            { text: '作品的性质' },
            { text: '对原作品市场的影响' }
          ],
          explain: '四要素是目的、作品性质、使用数量与实质性、市场影响；时长不是独立标准，核心片段几秒也可能越界。'
        }
      ]
    },
    {
      no: 12, points: 8, type: '简答（视频项目）',
      intro: '按要点给分，每点 2 分。',
      parts: [
        {
          label: '12-1', points: 8, kind: 'keywords',
          prompt: '写出视频项目提交时必须满足的至少四项硬性规格。',
          keywords: ['不超过 5 分钟', '不超过 1GB', 'mp4 格式', '片头含题目与姓名学号'],
          answer: '时长不超过 5 分钟；文件不超过 1 GB；格式为 mp4；片头 splash 含题目与全体组员姓名学号（此外还需英文、片尾引用、本人配音、他人素材不超过 30%）。',
          explain: '规格是硬门槛，任何一项不满足都可能被判不合格；片头信息还关系到组内互评能否对应到人。'
        }
      ]
    }
  ]
});
