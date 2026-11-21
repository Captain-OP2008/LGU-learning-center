/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'gea2000',
  short: 'GEA2000',
  name: '现代中国',
  en: 'Modern China',
  dept: '通识与国情',
  lang: 'text',
  langLabel: '历史',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'GEA2000 // ARCHIVE',
  bootLog: [
    '> mounting course partition ... GEA2000',
    '> loading 8 modules ...',
    '> indexing 48 source files ...',
    '> calibrating glossary & quiz bank ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '两百年不是一条年表，而是一场关于「谁定义现代」的争论。',
  missionEn: 'GEA2000 · 8 MODULES · 48 SOURCES',
  missionTitle: '从朝贡到崛起<br><em>现代中国 全掌握</em>',
  lede: '从 1793 年马戛尔尼使华讲到 2025 年的中国：帝制崩溃、革命建国、改革开放、全球崛起四次转型，每条线索都配史料、对照表、自检清单与题库。读完之后，你应当能对「现代中国从哪一年开始」给出一个有证据、可被反驳的回答。',
  searchPlaceholder: 'QUERY // 搜索章节、术语、年份与题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/GEA2000/',
  resources: {
    note: '以下 48 个文件均为 CUHKSZ GEA2000 的真实课程资料，按「大纲与写作—课堂讲义—晚清与民国研究—中共革命、共和国与当代」四组排列。建议先读课程大纲与写作指南确认要求，再按讲次跟讲义，最后用核心阅读写论文。',
    groups: [
      {
        name: '大纲、写作与考试',
        note: '先看课程大纲与评分标准，再读写作指南：论文题目、字数、注释格式、评分维度都在这里。',
        items: [
          { title: 'GEA2000 课程大纲（2025–26 导修 02）', path: '作业习题/GEA2000_Lecture_03_Syllabus_2025_26_Tutorial_02_(Dr_WANG_Chao).pdf', kind: 'pdf', note: '每周讲次、必读材料、导修安排与考核比例，开学第一份该读的文件。' },
          { title: '评分标准说明（Alec Wang）', path: '作业习题/GEA2000_Lecture_03_Assessment_Criteria_Explanation_Alec_Wang.pdf', kind: 'pdf', note: '论文与导修参与如何给分，直接决定你的写作重点。' },
          { title: '期末论文指引', path: '作业习题/GEA2000_Guidance_on_Term_Paper.pdf', kind: 'pdf', note: '题目范围、字数、引用规范与提交要求，写论文前必读。' },
          { title: '历史论文写作指南（英文）', path: '学习资料/GEA2000_How_to_write_a_historical_essay.pdf', kind: 'pdf', note: '从提问、论点、证据到反方的完整流程，配合 ch00 第 5 节使用。' },
          { title: '完全写作指南：历史论文（中文）', path: '作业习题/GEA2000_完全写作指南_历史论文.pdf', kind: 'pdf', note: '中文版写作指南，例子更贴近本课程的论文题。' },
          { title: '期末论文模板', path: '考试资料/GEA2000_Template_of_Final_Paper.docx', kind: 'docx', note: '直接套用的格式模板：标题、摘要、脚注与参考文献。' },
          { title: '现代中国大事年表（图片）', path: '考试资料/GEA2000_Modern_China_Timeline.jpg', kind: 'jpg', note: '一张图看完 1840–2020 的关键节点，适合复习时快速定位。' }
        ]
      },
      {
        name: '课堂讲义（Lecture 01–12）',
        note: '讲义按讲次编号，与本站 ch01–ch07 基本一一对应；复习时先看讲义标题，再回到对应章节。',
        items: [
          { title: 'Lecture 01：导论', path: '学习资料/GEA2000_Lecture_01_Introduction.pdf', kind: 'pdf', note: '课程问题意识、分期之争与阅读要求，对应 ch00。' },
          { title: 'Lecture 02：鸦片战争', path: '学习资料/GEA2000_Lecture_02_The_Opium_War.pdf', kind: 'pdf', note: '贸易、鸦片与战争，对应 ch01 前半。' },
          { title: 'Lecture 03：太平天国', path: '学习资料/GEA2000_Lecture_03_Taiping_Heavenly_Kingdom.pdf', kind: 'pdf', note: '拜上帝教、军事进程与地方权力变化，对应 ch01 中段。' },
          { title: 'Lecture 04：自强运动与清末新政', path: '学习资料/GEA2000_Lecture_04_Self_Strengthening_Movement_and_Late_Qing_Reforms.pdf', kind: 'pdf', note: '技术引进与制度改革的差距，对应 ch01 后半。' },
          { title: 'Lecture 05：辛亥革命', path: '学习资料/GEA2000_Lecture_05_1911_Revolution.pdf', kind: 'pdf', note: '保路运动、武昌起义与共和实验，对应 ch02 前半。' },
          { title: 'Lecture 06：五四运动', path: '学习资料/GEA2000_Lecture_06_May_Fourth_Movement.pdf', kind: 'pdf', note: '新文化运动、巴黎和会与群众政治，对应 ch02 后半。' },
          { title: 'Lecture 07：中共运动的兴起', path: '学习资料/GEA2000_Lecture_07_The_Rise_of_Communist_Movement_in_China.pdf', kind: 'pdf', note: '建党、国共合作与 1927 分裂，对应 ch03 前半。' },
          { title: 'Lecture 08：抗日战争', path: '学习资料/GEA2000_Lecture_08_The_War_of_Resistance_Against_Japan.pdf', kind: 'pdf', note: '统一战线、持久战与根据地扩张，对应 ch03 后半。' },
          { title: 'Lecture 09：国民党时代', path: '学习资料/GEA2000_Lecture_09_The_Nationalist_Era_in_China.pdf', kind: 'pdf', note: '南京十年、通胀与内战失败，配合 Eastman 阅读。' },
          { title: 'Lecture 10：中华人民共和国成立', path: '学习资料/GEA2000_Lecture_10_The_Founding_of_the_PRC.pdf', kind: 'pdf', note: '共同纲领、土改与建政，对应 ch04 前半。' },
          { title: 'Lecture 11：社会主义建设高潮', path: '学习资料/GEA2000_Lecture_11_The_High_Tide_of_Building_Socialism.pdf', kind: 'pdf', note: '一五计划、三大改造与反右，对应 ch04 后半。' },
          { title: 'Lecture 12：邓小平时代的改革开放', path: '学习资料/GEA2000_Lecture_12_Reform_and_Opening_up_in_Deng_Era.pdf', kind: 'pdf', note: '三中全会、农村改革与特区，对应 ch06。' }
        ]
      },
      {
        name: '晚清与民国研究（核心阅读）',
        note: '这一组是写论文时最常用的一手与二手材料：先读剑桥史章节建立框架，再用专著与论文深入某一争论。',
        items: [
          { title: '魏斐德：广州贸易与鸦片战争（剑桥史）', path: '学习资料/GEA2000_魏斐德_剑桥史_广州贸易与鸦片战争.pdf', kind: 'pdf', note: '从贸易制度解释战争，比「鸦片导致战争」的单一叙述更细致。' },
          { title: 'The Canton Trade and the Opium War', path: '学习资料/GEA2000_The_Canton_trade_and_the_opoim_war.pdf', kind: 'pdf', note: '英文版，可与魏斐德对读，注意两文对「危机起源」的不同侧重。' },
          { title: '孔飞力：太平军叛乱（剑桥史）', path: '学习资料/GEA2000_孔飞力_剑桥史_太平军叛乱.pdf', kind: 'pdf', note: '把太平天国放进清代地方社会与财政结构中理解，对应 ch01 第 4 节。' },
          { title: '核心阅读：太平天国', path: '学习资料/GEA2000_(Core_reading)_The_Taiping_rebellion.pdf', kind: 'pdf', note: '课程指定的核心阅读，配合 ch01 的 compare 块使用。' },
          { title: 'Platt：Autumn in the Heavenly Kingdom', path: '学习资料/GEA2000_Platt_Autumn_in_the_Heavenly_Kingdom.pdf', kind: 'pdf', note: '叙事性极强的太平天国研究，适合学习如何把史料写成故事。' },
          { title: '剑桥史第 9 章：复兴与改革', path: '学习资料/GEA2000_Chapter_09_Restoration_though_Reform.pdf', kind: 'pdf', note: '同治中兴与自强运动的制度背景。' },
          { title: '剑桥史第 10 章：清末的新张力', path: '学习资料/GEA2000_Chapter_10_New_Tension_in_the_Late_Qing.pdf', kind: 'pdf', note: '甲午后的瓜分危机与新政，对应 ch01 第 6–7 节。' },
          { title: '剑桥史第 11 章：王朝的终结', path: '学习资料/GEA2000_Chapter_11_The_End_of_the_Dynasty.pdf', kind: 'pdf', note: '清末新政、立宪与革命，衔接 ch02。' },
          { title: 'Mizoguchi：辛亥革命再评价', path: '学习资料/GEA2000_Yuzo_Mizoguchi_The_1911_Revolution_a_reassessment.pdf', kind: 'pdf', note: '挑战「革命党领导」的叙事，强调多种力量的汇合。' },
          { title: '周策纵：《五四运动》导言', path: '学习资料/GEA2000_周策纵_五四运动·导言.pdf', kind: 'pdf', note: '五四研究的经典框架：思想、文学与政治三条线索。' },
          { title: 'Chow Tse-tsung: The May Fourth Movement', path: '学习资料/GEA2000_Chow_Tse_tsung_The_May_Fourth_Movement_Intellectual_Revolution_In_Modern_China.pdf', kind: 'pdf', note: '英文原版导言，术语与中文版略有差异，引用时注意版本。' },
          { title: '剑桥史第 5–9 章合订', path: '学习资料/GEA2000_(Core)_Chapter_05_9.pdf', kind: 'pdf', note: '晚清到民初的长时段背景，适合写论文时补框架。' },
          { title: 'Wen Hsin Yeh: The Alienated Academy', path: '学习资料/GEA2000_Wen_Hsin_Yeh_The_Alienated_Academy.pdf', kind: 'pdf', note: '民国大学与知识分子的处境，衔接 ch02 与 ch07 的教育议题。' }
        ]
      },
      {
        name: '中共革命、共和国与当代',
        note: '从建党到当代，这一组既有经典文本（《宣言》《湖南农民运动考察报告》《论持久战》），也有研究专著与《邓小平时代》选章。',
        items: [
          { title: '核心阅读：中共的早年', path: '学习资料/GEA2000_(Core)_The_early_years_of_the_CCP.pdf', kind: 'pdf', note: '建党初期的组织与路线争论，对应 ch03 第 1–3 节。' },
          { title: '《共产党宣言》（选读）', path: '学习资料/GEA2000_(选读)Manifesto_of_the_Communist_party.pdf', kind: 'pdf', note: '读懂阶级、革命与国家的原初表述，再对照中国语境。' },
          { title: '《湖南农民运动考察报告》（选读）', path: '学习资料/GEA2000_(选读)Report_on_an_Investigation_of_the_Peasant_Movement_in_Hunan.pdf', kind: 'pdf', note: '「农村包围城市」的早期文本依据，注意它的宣传性与调查方法。' },
          { title: '《论持久战》', path: '学习资料/GEA2000_On_Protracted_War.pdf', kind: 'pdf', note: '三阶段划分与人民战争理论，对应 ch03 第 7 节。' },
          { title: 'Harrison：把革命带出政治', path: '学习资料/GEA2000_(Core)_Moving_the_Revolution_Beyond_Politics_Henrietta_Harrison.pdf', kind: 'pdf', note: '从社会史角度重看革命，挑战纯政治叙事。' },
          { title: 'Esherick：中国革命的十个论点', path: '学习资料/GEA2000_Esherick_Ten_Theses_on_the_Chinese_Revolution.pdf', kind: 'pdf', note: '十个可辩论的命题，最适合作为论文反方材料的来源。' },
          { title: 'Eastman 等：国民党时代 1927–1949', path: '学习资料/GEA2000_Lloyd_E_Eastman_Jerome_Chen_Suzanne_Pepper_Lyman_P_Van_Slyke_The_Nationalist_Era_in_China_1927_1949_Cambridg.pdf', kind: 'pdf', note: '理解国民党为何失败的关键研究，对应 ch03 第 8 节。' },
          { title: '剑桥史第 17 章：第二次世界大战', path: '学习资料/GEA2000_(Core)_Chapter_17_World_War_II.pdf', kind: 'pdf', note: '抗战的国际维度：租借、开罗会议与战后安排。' },
          { title: '剑桥史第 18 章：国民党政权的崩溃', path: '学习资料/GEA2000_(Core)_Chapter_18_The_Fall_of_the_Guomingdang_State.pdf', kind: 'pdf', note: '通胀、军事失败与政权瓦解的机制。' },
          { title: '剑桥史第 14–15 章合订', path: '学习资料/GEA2000_(Core)_Chapter_14_15.pdf', kind: 'pdf', note: '建国初期的政治与经济，对应 ch04。' },
          { title: '剑桥史第 17–20 章合订', path: '学习资料/GEA2000_(Core)_Chapter_17_20.pdf', kind: 'pdf', note: '抗战到文革的长时段，适合写跨章论文时使用。' },
          { title: '莫里斯：新秩序 1949–1955', path: '学习资料/GEA2000_莫里斯_新秩序_1949_1955.pdf', kind: 'pdf', note: '土改、镇反与城市改造的细节，对应 ch04 第 2–3 节。' },
          { title: '莫里斯：文化大革命及其后果', path: '学习资料/GEA2000_莫里斯_文化大革命及其后果.pdf', kind: 'pdf', note: '文革的基层经验与后续影响，对应 ch05 第 6–8 节。' },
          { title: '傅高义《邓小平时代》第 14 章：广东和福建的试验', path: '学习资料/GEA2000_傅高义_邓小平时代_十四_广东和福建的试验_1979_1984.pdf', kind: 'pdf', note: '特区决策的细节与地方试验，对应 ch06 第 4 节。' },
          { title: '傅高义《邓小平时代》第 15 章：经济调整和农村改革', path: '学习资料/GEA2000_傅高义_邓小平时代_十五_经济调整和农村改革_1978_1982.pdf', kind: 'pdf', note: '农村改革的决策过程与小岗村经验的推广。' },
          { title: 'Kirby：中国早期的国际化', path: '学习资料/GEA2000_Kirby_ChinasInternationalizationEarly_2006.pdf', kind: 'pdf', note: '把中国开放放进全球史，衔接 ch06 与 ch07。' }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '现代中国（Modern China，GEA2000），通识与国情课程'],
    ['来源', 'CUHKSZ GEA2000 课程资料：12 讲讲义、48 个文件（含剑桥史章节、研究专著与写作指南）'],
    ['结构', '8 章正文 · 56 题分章题库 · 模拟卷 A · 3 个实战项目 · 资料库'],
    ['建议', '先读第 0 章建立地图，再按 ch01→ch07 推进；每章结尾的自检清单与内嵌题不要跳过。']
  ],

  /* 速查表：4 页 */
  cheat: [
    {
      label: '时间线',
      blocks: [
        { t: 'p', html: '先记「转折」，再记年份：每个年份后面都要能接一句「它改变了什么」。这张表按本站七章排列，复习时遮住右列自测。' },
        { t: 'table', caption: '现代中国关键节点（1793–2025）', head: ['年份', '事件', '为什么是转折'], rows: [
          ['1793', '马戛尔尼使华', '朝贡体系与主权国家体系的第一次正面碰撞'],
          ['1842', '《南京条约》', '割地、赔款、五口通商、协定关税，条约体系开端'],
          ['1851–1864', '太平天国', '地方督抚掌厘金与军队，中央权力下移'],
          ['1860s–1890s', '洋务运动', '技术引进而不改制度，甲午一战暴露局限'],
          ['1895', '《马关条约》', '割台、赔二亿两、允许设厂，资本输出与瓜分狂潮'],
          ['1898', '戊戌变法', '制度改革的第一次尝试，一百零三天失败'],
          ['1900–1901', '义和团与《辛丑条约》', '赔款四亿五千万两，财政与主权被锁死'],
          ['1905', '废除科举', '精英再生产方式改变，新式知识分子登场'],
          ['1911', '辛亥革命', '帝制终结，共和实验开始'],
          ['1915–1921', '新文化运动', '民主与科学、白话文、反礼教'],
          ['1919', '五四运动', '巴黎和会与群众政治，拒签和约'],
          ['1921', '中共一大', '列宁式政党在中国出现'],
          ['1924–1927', '第一次国共合作与北伐', '群众动员与军事统一同时推进，1927 分裂'],
          ['1927–1934', '农村包围城市', '井冈山、瑞金，土地革命与根据地'],
          ['1934–1936', '长征', '遵义会议改组军事领导，落脚陕北'],
          ['1937–1945', '抗日战争', '国共二次合作，中共根据地扩张'],
          ['1945–1949', '内战', '土改、三大战役与国民党崩溃'],
          ['1949', '中华人民共和国成立', '共同纲领、新政权建立'],
          ['1950–1953', '土改、镇反、抗美援朝', '社会结构重组与国家安全动员'],
          ['1953–1957', '一五计划与三大改造', '计划经济体制基本建立'],
          ['1958', '三面红旗', '总路线、大跃进、人民公社'],
          ['1959–1961', '大饥荒', '浮夸、高征购与制度性因素叠加'],
          ['1966–1976', '文化大革命', '动员式政治的极端形态'],
          ['1978', '十一届三中全会', '改革开放起点，工作重心转移'],
          ['1980', '四个经济特区', '深圳、珠海、汕头、厦门'],
          ['1992', '南方谈话与十四大', '社会主义市场经济体制确立'],
          ['2001', '加入 WTO', '深度嵌入全球产业链'],
          ['2010', 'GDP 世界第二', '总量崛起，人均仍中等'],
          ['2013', '一带一路', '基础设施、产能与金融的对外延伸'],
          ['2020–2023', '双碳目标、人口负增长', '环境约束与人口结构转折']
        ] }
      ]
    },
    {
      label: '核心概念',
      blocks: [
        { t: 'p', html: '每个概念都要能回答三件事：<b>它是什么、它解决了什么问题、它的局限在哪里</b>。下表的一句话版本用于快速回忆，考试时仍需展开。' },
        { t: 'table', caption: '高频概念速查', head: ['概念', '一句话解释', '常考处'], rows: [
          ['朝贡体系', '以中国为中心的礼仪与贸易网络，重在等级而非主权平等', 'ch01 起点之争'],
          ['条约体系', '通过不平等条约开放口岸、限制关税与司法主权的制度安排', 'ch01 条约叠加'],
          ['半殖民地', '主权被部分限制但未完全丧失，需具体到关税、司法、驻兵', 'ch01、ch02'],
          ['自强运动', '引进西方军工与民用技术，不改皇权、科举与官制', 'ch01 与明治维新比较'],
          ['维新变法', '以立宪与官制改革为目标的制度变革，1898 年失败', 'ch01 第 6 节'],
          ['新政', '1901 年后清廷主导的改革，废科举、练新军、预备立宪', 'ch02 前夜'],
          ['共和', '主权在民、权力分立的政体，1912 年建立但未能巩固', 'ch02'],
          ['新文化运动', '以民主、科学、白话文与反礼教为核心的思想运动', 'ch02 第 5 节'],
          ['农村包围城市', '在敌弱我强的农村建根据地，以土地革命动员农民', 'ch03 第 4 节'],
          ['统一战线', '联合中间力量对付主要敌人的策略，随形势调整', 'ch03 第 2、7 节'],
          ['整风', '通过批评与自我批评统一思想、整顿组织', 'ch03 第 6 节'],
          ['共同纲领', '1949 年建政初期的临时宪法性文件', 'ch04 第 1 节'],
          ['一化三改', '社会主义工业化 + 对农业、手工业、资本主义工商业的改造', 'ch04 第 5 节'],
          ['三面红旗', '总路线、大跃进、人民公社', 'ch05 第 1 节'],
          ['八字方针', '调整、巩固、充实、提高，1961 年纠偏', 'ch05 第 4 节'],
          ['家庭联产承包', '土地承包到户，交够国家、留足集体、剩余归己', 'ch06 第 2 节'],
          ['价格双轨制', '计划内国家定价、计划外市场价并存', 'ch06 第 3 节'],
          ['经济特区', '以减免税、土地与外资政策试验开放的城市', 'ch06 第 4 节'],
          ['中国模式', '关于国家能力与市场、全球化关系的争论', 'ch07 第 9 节']
        ] }
      ]
    },
    {
      label: '史料与论证',
      blocks: [
        { t: 'p', html: '史料不是「真的就能用」，而是「作为什么被生产出来」。判断一份材料，先问三件事：<b>谁写的、写给谁看、在什么制度下写的</b>。' },
        { t: 'table', caption: '四类史料各自能证明什么', head: ['类型', '例子', '能证明', '不能证明'], rows: [
          ['档案与条约', '《南京条约》原文、三中全会公报', '制度安排、政策意图、法律约束', '执行效果、普通人感受'],
          ['报刊', '1958 年亩产三万斤报道', '宣传语言、政治压力、信息机制', '真实产量'],
          ['统计', '粮食产量、工业产值、人口数据', '趋势与规模（注意口径）', '个体经验、地方差异'],
          ['回忆与口述', '傅高义访谈、知青回忆', '主观经验、决策氛围', '客观数字、因果归属']
        ] },
        { t: 'table', caption: '历史论文的七段结构', head: ['段落', '任务', '常见问题'], rows: [
          ['1 问题', '提出一个可回答的因果或解释问题', '题目太大，无法在字数内完成'],
          ['2 论点', '一句话给出可被反驳的判断', '只写「很重要」「影响深远」'],
          ['3 背景', '只写与论点相关的制度与情境', '变成事件复述'],
          ['4 证据一', '档案/统计/文本，说明机制', '罗列材料，不做解释'],
          ['5 证据二', '另一类证据交叉验证', '两类证据其实是同一来源'],
          ['6 反方', '用最强版本陈述对方并回应', '稻草人、一句「也有人不同意」'],
          ['7 结论', '回到论点，说明边界与未解问题', '重复摘要、喊口号']
        ] }
      ]
    },
    {
      label: '数字与易错',
      blocks: [
        { t: 'p', html: '年代与数字是最容易失分、也最容易补的部分。建议按「条约—战争—运动—改革」四组记忆，每组只记三四个锚点。' },
        { t: 'table', caption: '必须记准的数字', head: ['数字', '含义', '常见混淆'], rows: [
          ['1842', '《南京条约》', '与 1858《天津条约》、1860《北京条约》混'],
          ['2100 万银元', '《南京条约》赔款', '与《马关条约》二亿两混'],
          ['1895', '《马关条约》', '与 1901《辛丑条约》混'],
          ['4.5 亿两', '《辛丑条约》赔款（本息近 10 亿两）', '写成 4500 万两'],
          ['1911 / 1919 / 1921', '辛亥 / 五四 / 中共一大', '把五四放在辛亥前'],
          ['1935.1 / 1935.10', '遵义会议 / 吴起镇会师', '把长征结束写成 1935'],
          ['1949.9.21 / 10.1', '政协开幕 / 开国大典', '把建国写成政协开幕'],
          ['1956', '三大改造基本完成', '与 1958 人民公社混'],
          ['1958 / 1961', '三面红旗 / 八字方针', '把八字方针放进三面红旗'],
          ['1966–1976', '文化大革命', '写成 1966–1978'],
          ['1978.12', '十一届三中全会', '与 1976 粉碎四人帮混'],
          ['1992', '南方谈话与十四大', '与 1984 十二届三中全会混'],
          ['2001', '加入 WTO', '与 1997 香港回归混'],
          ['2030 / 2060', '碳达峰 / 碳中和', '两个年份对调']
        ] },
        { t: 'p', html: '<b>三个高频错误</b>：① 把「洋务运动」说成建立议会制度；② 把「家庭联产承包」说成 1978 年前中央推广；③ 把「民心」当作 1949 年胜利的充分解释而不说明组织机制。写论述题时，每遇到一个绝对化表述，都停下来问：有没有例外？' }
      ]
    }
  ]
};
