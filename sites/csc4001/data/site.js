/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'csc4001',
  short: 'CSC4001',
  name: '编译原理',
  en: 'Compiler Construction',
  dept: '计算机科学',
  lang: 'text',
  langLabel: '编译',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读 + 自测',
  bootHead: 'CSC4001 // ANALYSIS OBSERVATORY',
  bootLog: [
    '> mounting course partition ... CSC4001',
    '> loading 8 modules: cfg, dataflow, lattices, symbolic ...',
    '> calibrating quiz bank, mock exam & projects ...',
    '> fixpoint reached. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '从一段源码出发，看懂程序分析怎样逼近真相。',
  missionEn: 'CSC4001 · 8 MODULES',
  missionTitle: '从控制流到修复<br><em>把程序看懂，也把 bug 讲清</em>',
  lede: '八章沿一条主线推进：源码降解成三地址码与 CFG，数据流在图上传播抽象事实，格与不动点解释迭代为何收敛，符号执行逐路径求精确解，最后落到测试、约简、定位与修复。每章配手算例子、对比表、内嵌练习与自检清单。',
  searchPlaceholder: 'QUERY // 搜索：控制流图 · 到达定值 · 格 · 符号执行 · 覆盖 · Ochiai',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/CSC4001/',
  resources: {
    note: '收录 CSC4001 的课程导览、七份数据流讲义、符号执行与程序修复讲义，以及测试与作业材料；文件名即原始文件，点击后用系统默认程序打开。',
    groups: [
      { name: '课程导览与考核', note: '先读 Introduction 了解教学计划与评分构成，再用 Review 对着重点复习。', items: [
        { title: '课程介绍与教学计划', path: '学习资料/CSC4001_Lecture_Notes_Introduction.pdf', kind: 'pdf', note: '13 讲安排、考核构成与课程政策' },
        { title: '作业 1 评分方案', path: '学习资料/CSC4001_Assessment_Scheme_Assign1.pdf', kind: 'pdf', note: '作业 1 的评分点与提交要求' },
        { title: '复习课讲义', path: '学习资料/CSC4001_Lecture_Notes_Review.pdf', kind: 'pdf', note: '题型、范围与重点串讲' }
      ] },
      { name: '数据流分析（七讲）', note: '从静态分析的定义一路讲到格、不动点与 worklist；本站 ch02–ch04 的主要依据。', items: [
        { title: '数据流 1 · 静态分析是什么', path: '学习资料/CSC4001_Lecture_Notes_DataflowAnalysis1.pdf', kind: 'pdf', note: '不运行程序推理行为、抽象与过近似' },
        { title: '数据流 2 · 可靠性与符号分析', path: '学习资料/CSC4001_Lecture_Notes_DataflowAnalysis2.pdf', kind: 'pdf', note: 'sound/complete、误报漏报、sign analysis' },
        { title: '数据流 3 · 活跃变量', path: '学习资料/CSC4001_Lecture_Notes_DataflowAnalysis3.pdf', kind: 'pdf', note: '后向分析、use/def 与寄存器分配' },
        { title: '数据流 4 · 可用表达式', path: '学习资料/CSC4001_Lecture_Notes_DataflowAnalysis4.pdf', kind: 'pdf', note: '前向 must、交集与公共子表达式消除' },
        { title: '数据流 5 · 格与单调性', path: '学习资料/CSC4001_Lecture_Notes_DataflowAnalysis5.pdf', kind: 'pdf', note: '偏序、上下界、完整格、积格' },
        { title: '数据流 6 · 迭代与不动点', path: '学习资料/CSC4001_Lecture_Notes_DataflowAnalysis6.pdf', kind: 'pdf', note: '终止性、唯一性与最精确解' },
        { title: '数据流 7 · may/must 与 worklist', path: '学习资料/CSC4001_Lecture_Notes_DataflowAnalysis7.pdf', kind: 'pdf', note: '格的视角与 worklist 优化' }
      ] },
      { name: '符号执行、修复与根因', note: '精确分析的一端：路径条件、约束求解、concolic，以及从修复到微服务 RCA。', items: [
        { title: '符号执行', path: '学习资料/CSC4001_Lecture_Notes_Symbolic.pdf', kind: 'pdf', note: '命题公式、符号执行、concolic 与 hybrid concolic' },
        { title: '程序修复', path: '学习资料/CSC4001_Lecture_Notes_ProgramRepair.pdf', kind: 'pdf', note: 'APR 定义、工作流、方法与未来' },
        { title: '根因分析', path: '学习资料/CSC4001_Lecture_Notes_RCA.pdf', kind: 'pdf', note: 'RCA 定义、微服务案例与工具' }
      ] },
      { name: '测试与作业材料', note: '测试基础、约简、变异/差分/蜕变，以及作业与参考答案。', items: [
        { title: '测试基础（上）', path: '考试资料/CSC4001_Lecture_Notes_TestingBasics.pdf', kind: 'pdf', note: '测试定义、bug 生命周期与覆盖准则' },
        { title: '测试基础（下）', path: '考试资料/CSC4001_Lecture_Notes_TestingBasicsCont.pdf', kind: 'pdf', note: '覆盖准则的补充与练习' },
        { title: '测试约简', path: '考试资料/CSC4001_Lecture_Notes_TestReduction.pdf', kind: 'pdf', note: '简化、delta debugging 与 ddmin' },
        { title: '变异、差分与蜕变（Meta）', path: '考试资料/CSC4001_Lecture_Notes_MetaExample.pdf', kind: 'pdf', note: 'oracle 问题与三类测试方法' },
        { title: '变异、差分与蜕变（补充）', path: '学习资料/CSC4001_Lecture_Notes_MutDiffMeta.pdf', kind: 'pdf', note: 'mutation/differential/metamorphic 的对比' },
        { title: '作业 1 与参考答案', path: '学习资料/CSC4001_Assign1_with_answer.pdf', kind: 'pdf', note: '作业 1 原题与参考解答' },
        { title: '作业 2 评分方案', path: '作业习题/CSC4001_Assessment_Scheme_Assignment_2.pdf', kind: 'pdf', note: '作业 2 的评分点与提交要求' },
        { title: '作业 2 参考答案', path: '作业习题/CSC4001_Reference_answer_of_assignment2.pdf', kind: 'pdf', note: '作业 2 的参考解答' },
        { title: '作业 3 评分方案', path: '作业习题/CSC4001_Assessment_Scheme_CSC4001_HW3.pdf', kind: 'pdf', note: '作业 3 的评分点与提交要求' },
        { title: '作业 3 参考答案', path: '考试资料/CSC4001_HW3_2025_Reference_Final.pdf', kind: 'pdf', note: '作业 3 的参考解答' },
        { title: '课程项目说明', path: '作业习题/CSC4001_Assessment_Scheme_CSC4001_Project.zip', kind: 'zip', note: '项目要求、评分与提交材料' }
      ] }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '编译原理（Compiler Construction）'],
    ['来源', 'CUHKSZ CSC4001 课程资料'],
    ['结构', '8 章正文 · 56 题题库 · 模拟卷 A · 3 个实战项目 · 资料库'],
    ['主线', '源码 → CFG → 数据流 → 格与不动点 → 符号执行 → 测试 → 定位与修复'],
    ['建议', '先读第 0 章建立地图，再按顺序推进；每章的计算例子与自检清单不要跳过。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    {
      label: '数据流四问',
      blocks: [
        { t: 'p', lead: true, html: '所有经典数据流问题都落在四个坐标上：<b>方向</b>（前向/后向）、<b>汇合</b>（并/交）、<b>传递函数</b>（gen/kill）、<b>初值</b>（空集/全集）。换问题只需换这四样，迭代算法不变。' },
        { t: 'table', head: ['问题', '方向', '汇合', '传递函数', '初值'], rows: [
          ['到达定值', '前向', '并（may）', 'OUT = gen ∪ (IN − kill)', 'OUT = gen'],
          ['活跃变量', '后向', '并（may）', 'IN = use ∪ (OUT − def)', '出口 IN = ∅'],
          ['可用表达式', '前向', '交（must）', 'OUT = gen ∪ (IN − kill)', '入口 OUT = ∅，其余全集'],
          ['非常忙表达式', '后向', '交（must）', 'IN = use ∪ (OUT − def)', '出口 IN = 全集']
        ], caption: '四张卡：方向决定从哪端开始，汇合决定 may 还是 must' },
        { t: 'callout', kind: 'tip', title: 'may / must 一句话判定', html: '问「是否存在一条路径」就是 may，汇合取并集；问「是否所有路径都」就是 must，汇合取交集。除零、空指针这类「有一次就坏」的性质用 may；公共子表达式、冗余消除这类「处处成立才能优化」的性质用 must。' }
      ]
    },
    {
      label: '公式与手算',
      blocks: [
        { t: 'code', lang: 'text', caption: '三个最常考的传递函数', code: `到达定值（前向 may）
  IN[B]  = ∪ OUT[P]        P 是 B 的前驱
  OUT[B] = gen[B] ∪ (IN[B] − kill[B])

活跃变量（后向 may）
  OUT[B] = ∪ IN[S]         S 是 B 的后继
  IN[B]  = use[B] ∪ (OUT[B] − def[B])

可用表达式（前向 must）
  IN[B]  = ∩ OUT[P]
  OUT[B] = gen[B] ∪ (IN[B] − kill[B])` },
        { t: 'table', head: ['符号', '含义', '手算要点'], rows: [
          ['gen', '本块新产生、且未被块内后续语句杀死的定值/表达式', '先并后删：块内先 x=1 后 x=2，gen 只留 x=2'],
          ['kill', '本块使之失效的旧事实', '按变量杀：任何对 x 的定值都 kill 全程序所有 x 的旧定值'],
          ['use', '本块使用、且在定值前读取的变量', '先读后写：x = x + 1 中 x 既 use 又 def'],
          ['def', '本块定值的变量', '与 use 一起决定活跃集合的增减']
        ], caption: 'gen/kill 与 use/def 的常见错法' },
        { t: 'callout', kind: 'warn', title: 'must 分析初值别全取空集', html: '可用表达式若把入口 OUT 也设成空集，交集会永远是空集，得不到任何可用表达式。正确做法：入口 OUT = ∅（入口没有前驱，边界条件），其余块 OUT = 全集，让迭代向下收缩到最大不动点。' }
      ]
    },
    {
      label: '格与不动点',
      blocks: [
        { t: 'table', head: ['概念', '定义', '直觉'], rows: [
          ['偏序', '自反、反对称、传递', '「更精确」或「包含于」'],
          ['格', '任意两元素有 lub 与 glb', '任意两个状态能合并'],
          ['完整格', '任意子集有上确界与下确界', '迭代的极限一定存在'],
          ['单调', 'x ⊑ y ⇒ f(x) ⊑ f(y)', '迭代不会回头'],
          ['lfp', '从 ⊥ 迭代得到的最小不动点', 'may 分析的目标'],
          ['gfp', '从 ⊤ 迭代得到的最大不动点', 'must 分析的目标']
        ], caption: '六个词撑起「迭代为什么一定停」' },
        { t: 'compare', left: { title: 'may 分析', html: '从 ⊥（空集/无信息）出发，并集让事实变多，收敛到最小不动点。它只包含真正可能的事实，最精确且可靠。' }, right: { title: 'must 分析', html: '从 ⊤（全集/过度乐观）出发，交集让事实变少，收敛到最大不动点。它保留所有路径都成立的事实，可靠且最精确。' } },
        { t: 'p', html: 'MOP 对每条路径分别算再汇合，是最精确的路径级解；MFP 是迭代实际算出的不动点。传递函数对汇合<b>可分配</b>时两者相等；只单调不分配时，MFP 可能不如 MOP 精确，但仍可靠。' }
      ]
    },
    {
      label: '符号执行与测试',
      blocks: [
        { t: 'table', head: ['概念', '关键式/三态', '用途'], rows: [
          ['路径条件 PC', '分支选择的合取', '满足 PC 的输入会走这条路径'],
          ['断言检查', 'PC ∧ ¬e 可满足？', 'sat 给反例，unsat 证明安全'],
          ['SMT 三态', 'sat / unsat / unknown', 'unknown 不能当任何一种'],
          ['concolic', '具体执行 + 分支取反 + 求解', '生成新输入，覆盖受搜索限制'],
          ['Ochiai', 'ef / sqrt(totalFailed × (ef+ep))', '失败覆盖多、通过覆盖少的语句更可疑']
        ], caption: '从路径条件到可疑度：一条链上的关键公式' },
        { t: 'code', lang: 'text', caption: 'concolic 的一轮', code: `输入 x = 3
执行 if (x > 0) -> true，记录 x > 0
执行 if (x == 3) -> true，记录 x == 3
PC = x > 0 ∧ x == 3

取反第二个分支：x > 0 ∧ x != 3
求解：x = 5
用 5 再跑，走到新路径` },
        { t: 'callout', kind: 'note', title: '覆盖率高不等于测试强', html: '覆盖率只说明代码被执行，不说明结果被验证。没有断言、断言恒真、只走主路径都能刷高覆盖。变异测试用「注入人造 bug 能否被抓」补上这一课；变异得分 = 杀死的变异体 / 非等价变异体。' }
      ]
    },
    {
      label: '定位与修复',
      blocks: [
        { t: 'table', head: ['方法', '输入', '输出/指标', '局限'], rows: [
          ['SBFL', '测试通过/失败 + 覆盖', '可疑语句排序、Exam score', '覆盖采集误差、失败测试少'],
          ['ddmin', '失败输入 + 判定函数', '1-minimal 输入', '依赖失败单调性，非全局最小'],
          ['APR', 'buggy 程序 + 测试', '通过测试的补丁', '过拟合、补丁不自然'],
          ['RCA', '日志/指标/调用链', '可疑根因排序 + 证据链', '因果与相关混淆、观测不全']
        ], caption: '定位、缩小、修复、根因：四种输出，四种坑' },
        { t: 'code', lang: 'text', caption: 'Ochiai 手算模板', code: `ef = 覆盖该语句的失败测试数
ep = 覆盖该语句的通过测试数
totalFailed = 失败测试总数

Ochiai = ef / sqrt(totalFailed × (ef + ep))

例：ef=3, ep=1, totalFailed=4
  = 3 / sqrt(4 × 4) = 3/4 = 0.75` },
        { t: 'callout', kind: 'warn', title: '补丁过拟合的典型信号', html: '加空指针检查让崩溃消失、吞掉异常让测试变绿、删掉断言、只针对失败用例加特判。这些补丁通过了现有测试，却没有修根因。用留出测试、变异测试或符号执行做二次验证，别让「全绿」骗过你。' }
      ]
    }
  ]
};
