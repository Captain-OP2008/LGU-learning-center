/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'csc3100',
  short: 'CSC3100',
  name: '数据结构',
  en: 'Data Structures',
  dept: '计算机科学',
  lang: 'java',
  langLabel: 'Java',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'CSC3100 // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... CSC3100',
    '> indexing 8 modules: array → list → sort → tree → heap → hash → graph',
    '> checking java samples with javac 17 ... ok',
    '> loading 56 drills, 1 mock paper, 3 projects ...',
    '> calibration complete. 建议从第 0 章开始。'
  ],

  /* 首页主视觉文案 */
  tagline: '先把数据放对位置，再让算法跑得更快。',
  missionEn: 'CSC3100 · 8 MODULES · JAVA',
  missionTitle: '从复杂度记号<br><em>走到图算法</em>',
  lede: '八章依次覆盖数组、链表、排序、树、平衡树、堆与哈希、图：每章给出可运行的 Java 片段、对照表、常见错误与自检清单，并配分章练习、一份模拟卷和三个实战项目。',
  searchPlaceholder: 'QUERY // 搜索章节、术语、Java 片段与题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/CSC3100/',
  resources: {
    note: '以下文件均取自 CUHKSZ CSC3100 课程资料目录，按讲义、作业、习题课与考试分组；点击条目直接打开原文件。',
    groups: [
      {
        name: '讲义与课件',
        note: '按周次排列，读正文卡住时回到对应讲义看原始推导。',
        items: [
          { title: 'L01 课程导论', path: '学习资料/CSC3100_Lecture_01_intro.pdf', kind: 'pdf', note: '课程目标、考核方式与数据结构全景图。' },
          { title: 'L02 Java 速成', path: '学习资料/CSC3100_Lecture_02_java.pdf', kind: 'pdf', note: '类、引用、泛型与内存模型，读示例代码前先过一遍。' },
          { title: 'L03 数组与 ADT', path: '学习资料/CSC3100_Lecture_03_array.pdf', kind: 'pdf', note: '连续内存、动态数组扩容与抽象数据类型。' },
          { title: 'L04 排序算法', path: '学习资料/CSC3100_Lecture_04_alg_sort.pdf', kind: 'pdf', note: '插入、归并、快排与比较排序下界。' }
        ]
      },
      {
        name: '作业与样例代码',
        note: '先自己写，卡住再看样例；对照时重点看边界条件。',
        items: [
          { title: 'HW2（2024 秋）', path: '作业习题/CSC3100_Data_Structures_HW2_Fall_2024.pdf', kind: 'pdf', note: '链表、栈与队列的编程题。' },
          { title: 'HW3（2024 秋）', path: '作业习题/CSC3100_Data_Structures_HW3_Fall_2024.pdf', kind: 'pdf', note: '树与哈希相关的分析与实现题。' },
          { title: 'Java 提交模板', path: '作业习题/CSC3100_java_template.zip', kind: 'zip', note: '类名、包名与输入输出的规范写法。' },
          { title: '参考解答 Solution.java', path: '作业习题/CSC3100_Solution.java', kind: 'java', note: '一份可直接编译的完整解答，用来看结构而非抄代码。' }
        ]
      },
      {
        name: '习题课与专题',
        note: '习题课把当周知识点压成几道典型题，考前过一遍最快。',
        items: [
          { title: 'Tutorial 01', path: '作业习题/CSC3100_Tutorial_01.pdf', kind: 'pdf', note: '复杂度分析与 Java 基础练习。' },
          { title: 'Tutorial 08 · AVL 树', path: '作业习题/CSC3100_Tutorial_08_AVL_Trees(updated).pptx', kind: 'pptx', note: '四种失衡的旋转演示。' },
          { title: 'Tutorial 09 · 堆', path: '作业习题/CSC3100_Tutorial_09_Heap.pptx', kind: 'pptx', note: '建堆、下沉与堆排序逐步图解。' },
          { title: 'Dijkstra 与 Floyd 专题', path: '作业习题/CSC3100_Tutorial_on_Dijkstra_and_Floyd.pdf', kind: 'pdf', note: '两套最短路的手算流程与对照。' }
        ]
      },
      {
        name: '考试与复习',
        note: '真题先限时做，再对答案；注意题量与分值分布。',
        items: [
          { title: '2022 期末卷', path: '考试资料/CSC3100_2022_Final.pdf', kind: 'pdf', note: '覆盖全书的期末真题。' },
          { title: '2023 暑期期中卷', path: '考试资料/CSC3100_2023_Summer_Midterm.pdf', kind: 'pdf', note: '前半学期的期中题型。' },
          { title: '2024 秋期中卷（含解答）', path: '考试资料/CSC3100_24fall_Midterm_exam_paper_With_Solution.pdf', kind: 'pdf', note: '最新一期期中，附评分要点。' },
          { title: '期中样卷（含解答）', path: '考试资料/CSC3100_Midterm_exam_paper_With_Solution.pdf', kind: 'pdf', note: '另一套带解答的期中样卷。' }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '数据结构（Data Structures）· CSC3100'],
    ['语言', 'Java 17：正文示例均可在 JDK 17 及以上编译运行'],
    ['结构', '8 章正文 · 56 道分章练习 · 模拟卷 A · 3 个实战项目 · 资料库'],
    ['建议', '先读第 0 章建立地图，再按章推进；每章按「概念 → 代码 → 对照表 → 自检」四步走，做完题再看解析。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    { label: '复杂度与容器', blocks: [
      { t: 'table', head: ['操作', '数组', '单链表', '哈希表', '平衡 BST'], rows: [
        ['按下标访问', 'O(1)', 'O(n)', '不支持', '不支持'],
        ['按值查找', 'O(n)', 'O(n)', '期望 O(1)', 'O(log n)'],
        ['头部插入', 'O(n)', 'O(1)', '期望 O(1)', 'O(log n)'],
        ['尾部插入', '摊还 O(1)', 'O(1)（有 tail 引用）', '期望 O(1)', 'O(log n)'],
        ['删除已知节点', 'O(n)（要搬移）', 'O(1)（双向链表）', '期望 O(1)', 'O(log n)'],
        ['有序遍历', '需先排序', '需先排序', '无序', '中序即有序']
      ], caption: '先问「我手上有什么」：知道下标、知道节点引用、还是只知道值' },
      { t: 'keypoint', items: [
        { title: '摊还不是平均', html: '动态数组扩容那一次是 O(n)，但把 n 次追加摊开，每次仍是常数；摊还是对一串操作的保证，不需要概率假设。' },
        { title: '期望 O(1) 有前提', html: '哈希表的常数时间依赖哈希函数均匀、负载因子受控；最坏情况下所有键冲突，退化为 O(n)。' },
        { title: '空间换时间要算总账', html: '用哈希表把查找降到 O(1)，代价是额外存储与扩容搬移；规模小的时候，数组遍历往往更快。' }
      ] }
    ] },
    { label: '排序对照', blocks: [
      { t: 'table', head: ['算法', '平均', '最坏', '额外空间', '稳定'], rows: [
        ['插入排序', 'O(n²)', 'O(n²)', 'O(1)', '稳定'],
        ['归并排序', 'O(n log n)', 'O(n log n)', 'O(n)', '稳定'],
        ['快速排序', 'O(n log n)', 'O(n²)', 'O(log n) 栈', '不稳定'],
        ['堆排序', 'O(n log n)', 'O(n log n)', 'O(1)', '不稳定'],
        ['计数排序', 'O(n + k)', 'O(n + k)', 'O(k)', '稳定'],
        ['基数排序', 'O(d(n + k))', 'O(d(n + k))', 'O(n + k)', '稳定']
      ], caption: '「最坏」一列决定能不能用在实时系统；「稳定」一列决定能不能按多关键字排序' },
      { t: 'callout', kind: 'warn', title: '快排的两个坑', html: '有序输入加固定选轴会退化成 O(n²)，要随机化或三数取中；大量重复键时用三路划分，否则分区极不均衡。' },
      { t: 'keypoint', items: [
        { title: '比较排序的下界', html: 'n 个元素有 n! 种排列，决策树至少要有 n! 个叶子，高度即比较次数，故下界是 Ω(n log n)。' },
        { title: '非比较排序的条件', html: '计数与基数排序绕开比较，但要求键是范围有限的整数；排序对象不是整数时，先映射再还原。' }
      ] }
    ] },
    { label: '树与堆', blocks: [
      { t: 'table', head: ['遍历', '访问顺序', '典型用途'], rows: [
        ['前序', '根 → 左 → 右', '复制树、序列化、打印目录结构'],
        ['中序', '左 → 根 → 右', 'BST 升序输出、验证 BST'],
        ['后序', '左 → 右 → 根', '释放内存、计算子树规模或高度'],
        ['层序', '按层从左到右（队列）', '求宽度、按层打印、最短边数路径']
      ], caption: '前序加中序可唯一重建二叉树；只知道前序与后序则不行' },
      { t: 'table', head: ['结构', '平衡条件', '查找', '插入修复代价'], rows: [
        ['普通 BST', '无', '最坏 O(n)', '无'],
        ['AVL 树', '左右子树高度差 ≤ 1', 'O(log n)', '最多 O(log n) 次旋转'],
        ['红黑树', '黑高一致、红节点不相邻', 'O(log n)', '插入最多 2 次旋转'],
        ['二叉堆', '父节点不小于（或不大于）子节点', '取极值 O(1)', '上浮或下沉 O(log n)']
      ], caption: '堆只保证偏序，中序遍历不有序；要按序输出仍得用 BST' },
      { t: 'keypoint', items: [
        { title: '旋转不改中序', html: '左旋、右旋只改变父子关系，节点的中序序列不变，所以 BST 性质自动保持。' },
        { title: '建堆是 O(n) 不是 O(n log n)', html: '从最后一个非叶节点往前下沉，绝大多数节点高度很小，求和后是线性；逐个插入才是 O(n log n)。' }
      ] }
    ] },
    { label: '图算法模板', blocks: [
      { t: 'table', head: ['问题', '算法', '复杂度', '前提'], rows: [
        ['无权最短路', 'BFS', 'O(V + E)', '边权相等'],
        ['非负权最短路', 'Dijkstra（堆优化）', 'O((V + E) log V)', '边权非负'],
        ['含负权最短路', 'Bellman-Ford', 'O(VE)', '无负环，或用于检测负环'],
        ['全源最短路', 'Floyd-Warshall', 'O(V³)', '可含负权，无负环'],
        ['最小生成树', 'Kruskal', 'O(E log E)', '无向连通图'],
        ['最小生成树', 'Prim（堆优化）', 'O(E log V)', '无向连通图'],
        ['依赖排序', '拓扑排序（Kahn）', 'O(V + E)', '有向无环图']
      ], caption: '先看边权符号，再看是单源还是全源，最后看要不要连通所有点' },
      { t: 'steps', items: [
        { title: '第一步：建模', html: '把对象写成顶点，把关系写成边，确认有向还是无向、带权还是无权、是否可能出现负权或环。' },
        { title: '第二步：选表示', html: '稠密图用邻接矩阵，稀疏图用邻接表；需要频繁判断两点是否相邻时，矩阵更直接。' },
        { title: '第三步：选算法', html: '先排除前提不满足的算法：Dijkstra 不能处理负权，Kruskal 需要无向图，拓扑排序要求无环。' },
        { title: '第四步：验算', html: '用小图手算一遍距离数组与并查集的变化；检查不可达点是否保留无穷大，负环是否被检测出来。' }
      ] },
      { t: 'callout', kind: 'warn', title: '三个高频错误', html: '把 MST 当成最短路树；在负权图上用 Dijkstra；BFS 求最短路却忘了每条边权为 1 的前提。' }
    ] }
  ]
};
