/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * ITE1000 信息技术基础：展示文案、资料库与速查表。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'ite1000',
  short: 'ITE1000',
  name: '信息技术基础',
  en: 'Information Technology Essentials',
  dept: '电子与信息工程',
  lang: 'text',
  langLabel: 'IT',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'ITE1000 // SIGNAL STATION',
  bootLog: [
    '> mounting course partition ... ITE1000',
    '> loading 8 modules: map · landscape · spreadsheet · security · literacy · frontier · ethics · video',
    '> linking glossary, 56-question bank and 15 source files ...',
    '> station online. 从一张地图开始，别急着背术语。'
  ],

  /* 首页主视觉文案 */
  tagline: '把技术讲成人话，把结论写成可复核的证据。',
  missionEn: 'ITE1000 · FROM ENIAC TO AI',
  missionTitle: '七十年信息技术<br><em>压缩成一张可走通的地图</em>',
  lede: '这门课不教你修电脑，也不教编程。它教你四件事：看懂技术结构、用表格算清问题、判断信息可不可信、把研究讲成五分钟。每一章都配例子、对比表、常见错误与自检清单。',
  searchPlaceholder: 'QUERY // 搜索章节、术语、函数或题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/ITE1000/',
  resources: {
    note: '全部文件来自 Blackboard 课程资料，按周次与用途分组；先读课程纲要与时间表，再按周取讲义。',
    groups: [
      {
        name: '课程纲要与导览',
        items: [
          { title: 'ITE1000 课程时间表（24Spring）', path: '学习资料/ITE1000_Course_Information_ITE1000_Timetable_24Spring.pdf', kind: 'PDF', note: '12 周讲课安排、作业截止与互评周次，开学第一周先看这张表。' },
          { title: '课程信息与评分说明 v022', path: '学习资料/ITE1000_Course_Information_ITE1000_v_022_20230807.pdf', kind: 'PDF', note: '课程目标、五主题、考核方式与 DPF 评分规则的完整说明。' },
          { title: '第 1 周课程导论讲义', path: '学习资料/ITE1000_Lecture_Content_IT_Course_Introduction_2023_2024_Term_2.pdf', kind: 'PDF', note: '这门课教什么、不教什么，以及 Netizen 的培养目标。' },
          { title: '教学大纲（Syllabus 24Spring）', path: '作业习题/ITE1000_Course_Information_ITE1000_Syllabus_24Spring.pdf', kind: 'PDF', note: '逐周主题与阅读材料，做作业前用来核对要求。' }
        ]
      },
      {
        name: '第 2 周 · 现代信息技术',
        items: [
          { title: '现代 IT 全景讲义', path: '学习资料/ITE1000_Week_02_Modern_Information_Technologies_Overview_Modern_IT_Overview.pdf', kind: 'PDF', note: '算力、存储、网络、接口四条主线的课堂讲义，配合 ch01 阅读。' },
          { title: '芯片为什么越做越小（Intel 案例）', path: '学习资料/ITE1000_Week_02_Modern_Information_Technologies_Overview_Chips_Arent_Getting_Much_Smaller_and_That_Stinks_for_Intel.pdf', kind: 'PDF', note: '摩尔定律放缓与 Intel 10nm 延期的产业分析，ch05 也会用到。' },
          { title: '高锟与光纤通信', path: '学习资料/ITE1000_Week_02_Modern_Information_Technologies_Overview_Prof_Charles_Kao.pdf', kind: 'PDF', note: '1965 年光纤论文、2009 年诺贝尔奖与中大校长的经历。' },
          { title: '美国叫停 3D 打印枪支发布', path: '学习资料/ITE1000_Week_02_Modern_Information_Technologies_Overview_US_release_of_3D_printed_gun_blocked.pdf', kind: 'PDF', note: '技术能力与法律边界冲突的案例，配合 ch06 伦理讨论。' }
        ]
      },
      {
        name: '信息素养、IP 与视频作业',
        items: [
          { title: '第 8 周 信息素养讲义', path: '学习资料/ITE1000_Week_08_Information_Literacy_Information_Literacy_24Spr.pdf', kind: 'PDF', note: 'ALA 定义、Big6、一手二手来源、四准则与引用格式。' },
          { title: '在 Word 中插入引用', path: '学习资料/ITE1000_Week_08_Information_Literacy_How_to_insert_citation_in_Microsoft_Word.pdf', kind: 'PDF', note: '用 Word 内置引用工具生成参考文献的逐步截图。' },
          { title: '信息检索练习单', path: '学习资料/ITE1000_Week_08_Information_Literacy_Info_Search_Practice_Handout.docx', kind: 'DOCX', note: '课堂检索练习，练 site:、filetype: 与布尔运算符。' },
          { title: '第 10 周 IP 与 IT 伦理讲义', path: '学习资料/ITE1000_Week_10_IP_&_IT_Ethics_IP_Ethics_24Spr.pdf', kind: 'PDF', note: '专利、商标、版权、合理使用与网络伦理案例。' },
          { title: '视频项目规格说明', path: '作业习题/ITE1000_Video_Project_Specifications_24Spr.pdf', kind: 'PDF', note: '时长、体积、格式、原创比例、迟交与互评规则的权威版本。' },
          { title: '视频提交操作说明', path: '作业习题/ITE1000_How_to_submit_video_presentation_project.pdf', kind: 'PDF', note: '上传入口、命名与回执确认，提交前逐条核对。' },
          { title: 'iMovie 参考手册', path: '作业习题/ITE1000_iMovie_References.pdf', kind: 'PDF', note: '用 iMovie 完成剪辑、字幕与导出的快捷参考。' }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '信息技术基础（Information Technology Essentials），全校必修核心课，1 学分，DPF 评分不计 GPA。'],
    ['结构', '8 章正文 → 56 题分章题库 → 100 分模拟卷 → 3 个实战项目 → 15 份原始资料。'],
    ['方法', '先读第 0 章建立依赖图；每章按「读一节 → 重算一个例子 → 做对应题目」推进，不囤到最后。'],
    ['提醒', '本站是学习辅助，不替代 Blackboard 通知；作业截止、视频规格与互评规则以课程官方文件为准。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    {
      label: '数量级与硬件',
      blocks: [
        {
          t: 'table',
          caption: '记这几个数就够了',
          head: ['事实', '数字', '为什么重要'],
          rows: [
            ['ENIAC（1946）', '17,468 只电子管 / 170 m² / 30 吨 / 5,000 次每秒', '今天一台手机的计算能力远超它，说明集成度的威力'],
            ['IBM RAMAC 305（1956）', '5 MB，约 5 万美元', '第一块硬盘；今天 5 MB 连一张照片都放不下'],
            ['摩尔定律（1965）', '晶体管数约每 2 年翻倍', '现放缓到约 2.5 年，靠封装与专用芯片继续提升'],
            ['Top500 第一（2022）', 'Frontier 约 1,102 Pflop/s', 'Pflop/s = 每秒一千万亿次浮点运算'],
            ['国产超算', '神威·太湖之光 93 Pflop/s（2016）', '曾连续四次登顶，采用申威众核处理器']
          ]
        },
        {
          t: 'table',
          caption: '存储介质速度与用途',
          head: ['介质', '随机读写量级', '适合放什么'],
          rows: [
            ['M.2 NVMe SSD', '微秒级，顺序 3–7 GB/s', '系统、常用软件、正在剪的视频'],
            ['SATA SSD', '微秒级，顺序约 550 MB/s', '常用资料、游戏库'],
            ['机械硬盘 HDD', '毫秒级，顺序 100–200 MB/s', '冷数据、备份、监控录像'],
            ['磁带 / 光盘', '秒级，需顺序读取', '归档与长期冷备份']
          ]
        },
        {
          t: 'callout', kind: 'tip', title: '买电脑只看三件事',
          html: '先看内存够不够同时开浏览器与 Excel，再看硬盘是不是 SSD，最后才看 CPU 型号。参数表上的「i7」不等于快，代际与散热同样关键。'
        }
      ]
    },
    {
      label: '网络与安全',
      blocks: [
        {
          t: 'table',
          caption: 'TCP/IP 四层与常见协议',
          head: ['层', '典型协议', '这一层在干什么'],
          rows: [
            ['应用层', 'HTTP、DNS、SMTP、SSH', '定义「请求什么内容」的语义'],
            ['传输层', 'TCP、UDP', '端到端可靠传输或低延迟传输，用端口区分应用'],
            ['网际层', 'IP、ICMP', '寻址与路由，把包从一台主机送到另一台'],
            ['网络接口层', '以太网、Wi-Fi', '在物理介质上收发帧']
          ]
        },
        {
          t: 'compare',
          left: { title: 'HTTP', html: '明文传输，内容可被中间人读取或篡改；默认端口 80。适合公开、无敏感信息的页面。' },
          right: { title: 'HTTPS', html: '在 HTTP 下加 TLS，提供加密、完整性与证书身份校验；默认端口 443。锁标只证明连接安全，不证明网站可信。' }
        },
        {
          t: 'callout', kind: 'warn', title: '钓鱼三看',
          html: '一看发件域名是否为官方域名，二看链接真实地址与文字是否一致，三看它是否催你立刻输入口令或验证码。三者占其一，就停下来走官方入口。'
        }
      ]
    },
    {
      label: 'Excel 公式',
      blocks: [
        {
          t: 'table',
          caption: '八个必会函数',
          head: ['函数', '作用', '易错点'],
          rows: [
            ['SUM / AVERAGE', '求和、平均', '区域里混入文本会被忽略，但计数会出错'],
            ['COUNT / COUNTA', '数数字 / 数非空', 'COUNTA 把空字符串也算作非空'],
            ['IF', '条件判断', '文本结果要加引号'],
            ['SUMIF', '按条件求和', '参数顺序是条件区域、条件、求和区域'],
            ['SUMIFS', '多条件求和', '求和区域在第一个参数'],
            ['COUNTIF', '按条件计数', '条件文本要加引号'],
            ['VLOOKUP', '按首列查找', '第四参数写 FALSE；查找值必须在区域第一列'],
            ['IFERROR', '包裹错误值', '先定位错误原因，再用它兜底']
          ]
        },
        {
          t: 'table',
          caption: '错误值速查',
          head: ['错误值', '含义', '常见原因'],
          rows: [
            ['#DIV/0!', '除以零', '分母为空或为 0'],
            ['#N/A', '找不到匹配', '查找值不在首列、类型不一致、有多余空格'],
            ['#VALUE!', '类型不对', '把文本当数字参与运算'],
            ['#REF!', '引用失效', '删除了被引用的行列，或跨工作簿断链'],
            ['#NAME?', '函数名拼错', '中文引号、拼写错误、缺少加载项'],
            ['#####', '列宽不够', '拉宽列或缩小字号，不是公式错']
          ]
        },
        {
          t: 'callout', kind: 'tip', title: '填充前先想引用',
          html: '要固定的格子写成 $B$1；只固定行写 B$1；只固定列写 $B1。按 F4 可以在四种引用间循环切换。'
        }
      ]
    },
    {
      label: '检索与引用',
      blocks: [
        {
          t: 'table',
          caption: '检索运算符',
          head: ['写法', '作用', '例子'],
          rows: [
            ['空格', 'AND，缩小范围', '5G 校园 门禁'],
            ['OR（大写）', '或者，扩大范围', 'AI OR 人工智能'],
            ['"短语"', '精确匹配顺序', '"information literacy"'],
            ['-关键词', '排除', '苹果 -手机'],
            ['site:', '限定站点或域名', 'site:cuhk.edu.cn 宿舍'],
            ['filetype:', '限定文件格式', 'filetype:pdf 报告']
          ]
        },
        {
          t: 'compare',
          left: { title: '一手来源', html: '原始数据、官方通知、当事人记录。离事件最近、细节最多，但可能需要自己整理，且同样可能有立场。' },
          right: { title: '二手来源', html: '教材、综述、百科、新闻报道。省时、有上下文，但细节被压缩，可能转述失真或断章取义。' }
        },
        {
          t: 'callout', kind: 'note', title: '引用五要素',
          html: '作者（或机构）、发布时间、标题、来源（网站/刊名/出版社）、URL 与访问日期。缺作者写机构名，缺日期写 n.d. 并说明。引用能避免抄袭，但不等于获得版权许可。'
        }
      ]
    }
  ]
};
