/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'bio1008',
  short: 'BIO1008',
  name: '生物化学基础',
  en: 'Biochemistry Basics',
  dept: '生命科学',
  lang: 'text',
  langLabel: '生物',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'BIO1008 // FROM CARBON TO HEARTBEAT',
  bootLog: [
    '> mounting course partition ... BIO1008',
    '> loading 8 modules ... bonds → water → pH → carbon → protein → nucleic acid → metabolism',
    '> calibrating pKa table, 56-question bank & mock paper A ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '一颗碳原子怎样长成一次心跳。',
  missionEn: 'BIO1008 · 8 MODULES · 56 QUESTIONS',
  missionTitle: '从化学键开始<br><em>读懂生命这台机器</em>',
  lede: '八章连成一条链：电子如何成键决定分子形状，形状决定弱作用与折叠，折叠决定蛋白与核酸的功能，功能叠加成代谢与器官系统。每章配对比表、常见错误、自检清单与分章题库。',
  searchPlaceholder: 'QUERY // 搜索章节、术语、题目与速查表',

  /* 资料库（path 相对 resBase，逐字对应 _data/course-files.json 的记录） */
  resBase: '../../resources/BIO1008/',
  resources: {
    note: '本站资料均来自 CUHKSZ BIO1008 课程包：0–7 号是化学与分子部分的核心讲义，B1–B9 号是生理与系统部分，' +
      '另有 Lehninger 与 Campbell 两本教材可查推导细节。读正文遇到数值（键能、pKa、Km、ATP 产量）时，回到对应讲义核对一遍最稳。',
    groups: [
      { name: '核心讲义 0–7 · 分子与化学', note: '与本站第 1–7 章一一对应，建议按章配套阅读。', items: [
        { title: 'Lecture 0 · Chemical Bonding', path: '学习资料/BIO1008_0_Chemical_Bonding.pdf', kind: 'pdf',
          note: '电子排布、离子键与共价键、电负性、路易斯结构——对应第 1 章前半。' },
        { title: 'Lecture 1 · Molecular Geometries', path: '学习资料/BIO1008_1_Molecular_Geometries.pdf', kind: 'pdf',
          note: 'VSEPR、杂化轨道、键角与分子极性——对应第 1 章后半。' },
        { title: 'Lecture 2 · Liquids and Intermolecular Forces', path: '学习资料/BIO1008_2_Liquids_and_IM_forces.pdf', kind: 'pdf',
          note: '氢键、色散力、水的异常性质、渗透与胶束——对应第 2 章。' },
        { title: 'Lecture 3 · Acid–Base Equilibrium', path: '学习资料/BIO1008_3_Acid_Base_Equilibrium.pdf', kind: 'pdf',
          note: 'Kw、Ka、pH、Henderson–Hasselbalch、滴定曲线与缓冲——对应第 3 章。' },
        { title: 'Lecture 4 · Organic and Biological Molecules', path: '学习资料/BIO1008_4_Organic_and_Biological.pdf', kind: 'pdf',
          note: '碳骨架、官能团、立体化学、反应类型与 ATP 能量耦合——对应第 4 章。' },
        { title: 'Lecture 5 · Protein', path: '学习资料/BIO1008_5_Protein.pdf', kind: 'pdf',
          note: '氨基酸、肽键、二级结构、折叠、血红蛋白与酶动力学——对应第 5 章。' },
        { title: 'Lecture 6 · Sugar', path: '学习资料/BIO1008_6_Sugar.pdf', kind: 'pdf',
          note: '单糖环化、糖苷键、多糖与糖的生物学功能——对应第 6 章前半。' },
        { title: 'Lecture 7 · Nucleic Acids', path: '学习资料/BIO1008_7_Nucleic_Acids.pdf', kind: 'pdf',
          note: '核苷酸、DNA 双螺旋、RNA 类型与中心法则——对应第 6 章后半。' }
      ] },

      { name: '生理与系统讲义 B1–B9', note: '第 7 章「从葡萄糖到心跳」的器官层面依据，也是把分子机制接到生理现象的桥梁。', items: [
        { title: 'B1 · A Tour of the Cell', path: '学习资料/BIO1008_B1_A_Tour_of_the_Cell.pdf', kind: 'pdf',
          note: '细胞器与膜系统总览，读代谢前先确认「哪个反应发生在哪个区室」。' },
        { title: 'B2 · Cellular Respiration', path: '学习资料/BIO1008_B2_Cellular_Respiration.pdf', kind: 'pdf',
          note: '糖酵解、三羧酸循环、氧化磷酸化的完整通路图；同名的 pptx 适合快速复习。' },
        { title: 'B2 · Cellular Respiration（幻灯片）', path: '学习资料/BIO1008_B2_Cellular_Respiration.pptx', kind: 'pptx',
          note: '课堂用幻灯片版，图表更直观，适合考前过一遍流程。' },
        { title: 'B3 · DNA', path: '学习资料/BIO1008_B3_DNA.pdf', kind: 'pdf',
          note: 'DNA 复制、修复与包装，补充第 6 章的分子细节。' },
        { title: 'B7 · Circulation and Respiration', path: '学习资料/BIO1008_B7_Circulation_and_Respiration.pdf', kind: 'pdf',
          note: '心输出量、气体交换与 V/Q 比——第 7 章第七节的主要依据。' },
        { title: 'B9 · Hormones', path: '学习资料/BIO1008_B9_Hormones.pdf', kind: 'pdf',
          note: '胰岛素、胰高血糖素与血糖负反馈；同名 pptx 有激素调节的流程图。' }
      ] },

      { name: '教材与参考书', note: '不需要通读；查某个推导或数值时按索引翻阅即可。', items: [
        { title: 'Lehninger · Principles of Biochemistry', path: '学习资料/BIO1008_Lehninger_Principles_of_Biochemistry.pdf', kind: 'pdf',
          note: '生化主教材：蛋白结构、酶动力学、糖代谢与氧化磷酸化的权威推导都在这里。' },
        { title: 'Campbell · Essential Biology with Physiology', path: '学习资料/BIO1008_Textbook_CampbellEssentialBiologywithPhysiology.pdf', kind: 'pdf',
          note: '生理部分的主教材：循环、呼吸、激素与免疫的器官层面描述。' },
        { title: 'Chemistry: The Central Science', path: '学习资料/BIO1008_Chemistry_The_Central_Science.pdf', kind: 'pdf',
          note: '普通化学参考：键能、电负性、酸碱与热力学的标准表述，适合补第 1–4 章的基础。' }
      ] },

      { name: '作业、大纲与复习材料', note: '作业带解答，建议先自己做再对答案；大纲可用来核对考试范围。', items: [
        { title: 'Assignment 1（含解答）', path: 'BIO1008_Assignment1_with_solution.pdf', kind: 'pdf',
          note: '覆盖化学键、分子间作用力与酸碱部分，题型与本站题库相近。' },
        { title: 'Assignment 2（含解答）', path: 'BIO1008_Assignment2_with_solution.pdf', kind: 'pdf',
          note: '覆盖蛋白、糖、核酸与代谢部分，含计算题与简答题。' },
        { title: 'Course Outline', path: '学习资料/BIO1008_Course_Outline.pdf', kind: 'pdf',
          note: '课程大纲：章节顺序、考核方式与参考书清单。' },
        { title: '课堂笔记（扫描件）', path: 'BIO1008_Notebook_scanned.pdf', kind: 'pdf',
          note: '手写笔记扫描，推导步骤较细，适合作讲义之外的第二种讲法。' }
      ] }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '生物化学基础（Biochemistry Basics），CUHKSZ BIO1008'],
    ['来源', 'CUHKSZ BIO1008 课程资料：讲义 0–7 与 B1–B9、Lehninger 与 Campbell 教材、两份带解答的作业'],
    ['结构', '8 章正文 · 56 题分章题库 · 模拟卷 A（100 分）· 3 个实战项目 · 4 页速查表 · 资料库'],
    ['建议', '第 0 章先建地图；ch01→ch02→ch03 是硬前置，ch04 之后再进 ch05/ch06，最后用 ch07 收束。每章结尾的自检清单请逐条动手算一遍。']
  ],

  /* 速查表 */
  cheat: [
    { label: '键与形状', blocks: [
      { t: 'table', head: ['键型', '典型能量 (kJ·mol<sup>−1</sup>)', '特征', '在生物分子中'], rows: [
        ['离子键', '400–4000', '电子完全转移，静电吸引', '盐桥、磷酸基与 Lys/Arg 的配对'],
        ['共价键 C–C', '347', '共享电子对，键长 154 pm', '碳骨架、脂肪酸链'],
        ['共价键 C=C', '611', '双键更短更强，不能自由旋转', '不饱和脂肪酸、苯环'],
        ['C–O / C=O', '358 / 745', '极性强，氧带 δ−', '醇、羧酸、酰胺'],
        ['氢键', '10–40', '定向、可逆、需 O–H 或 N–H', '蛋白二级结构、碱基配对、水'],
        ['色散力', '0.05–40', '瞬时偶极，随极化率与接触面积增大', '疏水核心的堆积']
      ], caption: '共价键比弱作用强一个数量级以上——这是「结构稳定但可逆调节」的化学基础' },
      { t: 'table', head: ['分子', '电子对数', '孤对', '键角'], rows: [
        ['CH<sub>4</sub>', '4', '0', '109.5°'],
        ['NH<sub>3</sub>', '4', '1', '107.3°'],
        ['H<sub>2</sub>O', '4', '2', '104.5°'],
        ['CO<sub>2</sub>', '2', '0', '180°（直线）'],
        ['苯环碳', '3', '0', '120°（sp<sup>2</sup>）']
      ], caption: '孤对电子越多，键角被压得越小；判断杂化看 σ 键数 + 孤对数' },
      { t: 'callout', kind: 'tip', title: '三步判断极性', html: '一，查电负性差（&lt;0.4 非极性，0.4–1.7 极性共价，&gt;1.7 近离子）；二，看形状是否对称（CO<sub>2</sub> 有极性键但分子非极性）；三，找孤对与氢键供体/受体。三步都过一遍，分子间作用力就基本能预测了。' }
    ] },

    { label: '水、弱作用与 pH', blocks: [
      { t: 'table', head: ['作用力', '强度 (kJ·mol<sup>−1</sup>)', '方向性', '典型场景'], rows: [
        ['离子–偶极', '40–600', '有', 'Na<sup>+</sup> 的水化层'],
        ['氢键', '10–40', '强方向性', '水、蛋白、DNA'],
        ['偶极–偶极', '5–25', '较弱', '极性小分子溶解'],
        ['色散力', '0.05–40', '无', '疏水核心、脂双层内部'],
        ['疏水效应', '熵驱动', '—', '蛋白折叠、胶束、膜形成']
      ], caption: '疏水效应不是「作用力」，而是水为释放有序壳层而产生的熵驱动力' },
      { t: 'table', head: ['体系', 'pKa（25 ℃）', '生理相关点'], rows: [
        ['羧基（乙酸 / Glu / Asp）', '4.76 / 4.3 / 3.9', 'pH 7.4 时全部去质子化，带负电'],
        ['碳酸（H<sub>2</sub>CO<sub>3</sub>）', '6.1（表观）', '血液主缓冲对，靠肺与肾维持 20:1'],
        ['磷酸二氢（H<sub>2</sub>PO<sub>4</sub><sup>−</sup>）', '6.86', '细胞内与尿液中的主要缓冲'],
        ['组氨酸咪唑', '6.0', '酶活性位点的质子开关'],
        ['HEPES', '7.48', '细胞实验常用，37 ℃ 时略降'],
        ['铵（NH<sub>4</sub><sup>+</sup>）', '9.25', 'pH 7.4 时几乎全为 NH<sub>3</sub>'],
        ['半胱氨酸 —SH', '8.3', 'pH 7.4 时多数仍带氢']
      ], caption: 'pKa ± 1 是缓冲有效区间；超出这个区间，该基团基本只以一侧形式存在' },
      { t: 'callout', kind: 'exam', title: 'Henderson–Hasselbalch 的三个用法', html: '① 已知 pH 与 pKa 求比例：<code>[A⁻]/[HA] = 10<sup>pH−pKa</sup></code>；② 已知比例求 pH：<code>pH = pKa + log(比例)</code>；③ 半当量点 pH = pKa、缓冲能力最大。血液题的标准代入：<code>pH = 6.1 + log(24/1.2) = 7.40</code>。' },
      { t: 'keypoint', items: [
        { title: '渗透压看粒子数', html: '0.9% NaCl ≈ 154 mM，i ≈ 1.8，渗透浓度约 290 mOsm/L，与血浆等渗。' },
        { title: '冰浮于水', html: '四面体氢键网络产生空腔，密度 0.917 &lt; 1.000，湖面结冰成为隔热层。' }
      ] }
    ] },

    { label: '蛋白与酶', blocks: [
      { t: 'table', head: ['层级', '定义', '关键作用力', '典型数值'], rows: [
        ['一级', '氨基酸序列', '肽键（共价）', '肽键 132 pm，ω ≈ 180°'],
        ['二级', '主链局部规整折叠', '主链 N–H···O=C 氢键', 'α-螺旋 3.6 残基/圈、0.54 nm'],
        ['三级', '整条链的三维折叠', '疏水作用、氢键、盐桥、二硫键', '疏水核心是主要驱动力'],
        ['四级', '多亚基组装', '同上 + 亚基界面', '血红蛋白 α<sub>2</sub>β<sub>2</sub>，n<sub>H</sub> ≈ 3']
      ], caption: '变性破坏二级以上结构，肽键与一级结构不变——所以煮熟的蛋白仍可被消化' },
      { t: 'table', head: ['抑制类型', '结合位置', 'V<sub>max</sub>', 'K<sub>m</sub>', '双倒数图'], rows: [
        ['竞争性', '活性位点', '不变', '增大', '交于纵轴'],
        ['非竞争性', '别处（不影响底物结合）', '下降', '不变', '交于横轴'],
        ['反竞争性', '仅结合 ES 复合物', '下降', '下降', '平行线']
      ], caption: '判断口诀：谁能被「加大底物」挤掉，谁就是竞争性' },
      { t: 'callout', kind: 'tip', title: 'Km 与 kcat/Km 各自说明什么', html: '<b>K<sub>m</sub></b> 是达到半最大速率所需的底物浓度，反映亲和力（K<sub>m</sub> 越小越亲和）；<b>k<sub>cat</sub></b> 是每秒钟每个酶分子转化的底物数（转换数）；<b>k<sub>cat</sub>/K<sub>m</sub></b> 是催化效率，扩散极限约 10<sup>8</sup>–10<sup>9</sup> M<sup>−1</sup>s<sup>−1</sup>，碳酸酐酶（约 10<sup>6</sup> s<sup>−1</sup>）接近这个上限。' },
      { t: 'terms', items: [
        { en: 'allosteric effect', zh: '别构效应', html: '效应物结合在活性位点之外，改变蛋白构象与活性；血红蛋白的氧结合就是正别构。' },
        { en: 'denaturation', zh: '变性', html: '弱作用网络被破坏导致去折叠，一级结构完好；可复性取决于是否发生聚集。' }
      ] }
    ] },

    { label: '糖、核酸与代谢账', blocks: [
      { t: 'table', head: ['来源（每分子葡萄糖）', 'ATP/GTP', 'NADH', 'FADH<sub>2</sub>', 'CO<sub>2</sub>', '位置'], rows: [
        ['糖酵解', '2', '2', '0', '0', '胞质'],
        ['丙酮酸氧化（×2）', '0', '2', '0', '2', '线粒体基质'],
        ['三羧酸循环（×2 圈）', '2', '6', '2', '4', '线粒体基质'],
        ['电子传递链 + 氧化磷酸化', '—', '−10', '−2', '—', '线粒体内膜'],
        ['合计', '4 + 25 + 3 = 32', '—', '—', '6', '—']
      ], caption: '按 NADH 2.5、FADH<sub>2</sub> 1.5 计算；旧系数 3 与 2 得 36–38，答题注明所用系数' },
      { t: 'table', head: ['数字', '含义'], rows: [
        ['2.0 nm / 3.4 nm / 0.34 nm', 'DNA 直径 / 每圈螺距 / 每个碱基对上升距离'],
        ['10 bp', 'B 型 DNA 每圈碱基对数'],
        ['3 × 10<sup>9</sup> bp', '人类单倍体基因组大小，拉直约 1 m'],
        ['8.0 kJ·g<sup>−1</sup>', '糖类平均产能，葡萄糖约 16 kJ·g<sup>−1</sup>'],
        ['32 ATP', '一分子葡萄糖完全氧化的净产量，效率约 34%'],
        ['4.0–6.1 mM', '空腹血糖参考范围，靠胰岛素/胰高血糖素双向调节']
      ], caption: '这些数字在选择题与计算题中反复出现，建议直接记到能默写' },
      { t: 'compare',
        left: { title: '有氧：32 ATP', html: '丙酮酸进线粒体 → 乙酰辅酶 A → 三羧酸循环 → NADH/FADH<sub>2</sub> 交给呼吸链 → 质子梯度 → ATP 合酶。终端电子受体是 O<sub>2</sub>，产物是 H<sub>2</sub>O。' },
        right: { title: '无氧：2 ATP', html: '糖酵解本身照常进行，但 NADH 不能交给呼吸链，只能把丙酮酸还原成乳酸（或乙醛还原成乙醇）以再生 NAD<sup>+</sup>。发酵不产生 ATP，只是让糖酵解继续。' } },
      { t: 'callout', kind: 'warn', title: '三个容易被生活经验带偏的说法', html: '①「乳酸导致运动后酸痛」——乳酸 1 小时内清除，酸痛 24–72 小时后才出现，机制是肌纤维微损伤与炎症；②「无氧呼吸产 36 个 ATP」——无氧只有糖酵解的 2 个；③「脂肪酸能变葡萄糖」——乙酰辅酶 A 的两个碳在循环中以 CO<sub>2</sub> 丢失，不能净生糖（甘油可以）。' }
    ] }
  ]
};
