/* =====================================================================
 * data/index.js · 课程章节清单
 * 职责：定义 26 章的元数据与顺序（14 章主课 + 12 章继续学习），供导航、总览、搜索使用。
 * 章节正文在 data/chXX.js 中按需加载。
 * ===================================================================== */
CSC.registerMeta([

  /* ------------------------------ Part I · 起点 ------------------------------ */
  {
    id: 'ch00', num: '00', title: '序章：计算机科学与你', en: 'Prologue',
    part: 'Part I · 起点', week: 0, minutes: 22, icon: 'compass',
    labs: 2,
    blurb: '这门课到底在学什么？为什么 2025 年还要学写程序，而不是把一切交给 AI？'
  },
  {
    id: 'ch01', num: '01', title: '第一个 Java 程序', en: 'Hello World & Program Anatomy',
    part: 'Part I · 起点', week: 1, minutes: 28, icon: 'rocket',
    labs: 0,
    blurb: '把一段文本变成能跑的程序：class、main、语句、编译与执行，一次讲透。'
  },
  {
    id: 'ch02', num: '02', title: '变量、类型与字符串', en: 'Variables, Types & Strings',
    part: 'Part I · 起点', week: 1, minutes: 75, icon: 'box',
    labs: 2,
    blurb: '给数据起名字、选类型、做运算：int 会溢出、整数除法会截断、字符串能拼接。'
  },

  /* ---------------------------- Part II · 控制与数据 ---------------------------- */
  {
    id: 'ch03', num: '03', title: '条件与循环', en: 'Conditionals & Loops',
    part: 'Part II · 控制与数据', week: 2, minutes: 80, icon: 'branch',
    labs: 2,
    blurb: '让程序会判断、会重复：if/else、while、for、嵌套。控制流是所有逻辑的骨架。'
  },
  {
    id: 'ch04', num: '04', title: '数组', en: 'Arrays',
    part: 'Part II · 控制与数据', week: 3, minutes: 75, icon: 'array',
    labs: 3,
    blurb: '一次性存很多数据：下标从 0 开始、length 是属性、越界会抛异常。'
  },
  {
    id: 'ch05', num: '05', title: '输入输出与绘图', en: 'Input, Output & Drawing',
    part: 'Part II · 控制与数据', week: 4, minutes: 36, icon: 'keyboard',
    labs: 2,
    blurb: '让程序与外界交换数据：Scanner 读输入、printf 格式化、用画布画出分形。'
  },

  /* --------------------------- Part III · 抽象与对象 --------------------------- */
  {
    id: 'ch06', num: '06', title: '方法与函数库', en: 'Functions & Libraries',
    part: 'Part III · 抽象与对象', week: 5, minutes: 42, icon: 'function',
    labs: 3,
    blurb: '把一段逻辑打包成可复用的方法：参数、返回值、作用域、调用栈。'
  },
  {
    id: 'ch07', num: '07', title: '类与对象', en: 'Objects & Classes',
    part: 'Part III · 抽象与对象', week: 7, minutes: 46, icon: 'box',
    labs: 2,
    blurb: '从"操作数据"到"设计实体"：类、构造器、封装、static 与实例之分。'
  },
  {
    id: 'ch08', num: '08', title: '继承、多态与抽象类', en: 'Inheritance, Polymorphism & Abstract Classes',
    part: 'Part III · 抽象与对象', week: 8, minutes: 46, icon: 'layers',
    labs: 2,
    blurb: '用 extends 复用代码、用多态统一调用、用抽象类规定契约。'
  },
  {
    id: 'ch09', num: '09', title: '内存与引用', en: 'Memory Management & References',
    part: 'Part III · 抽象与对象', week: 9, minutes: 75, icon: 'memory',
    labs: 2,
    blurb: '栈与堆、值传递与引用传递、== 与 equals、别名与深拷贝——最容易考也最容易错。'
  },
  {
    id: 'ch10', num: '10', title: '抽象数据类型与集合', en: 'ADTs & Java Collections',
    part: 'Part III · 抽象与对象', week: 10, minutes: 44, icon: 'grid',
    labs: 2,
    blurb: '先想"能做什么"，再想"怎么实现"：ADT、ArrayList、HashMap，以及如何建模真实需求。'
  },

  /* --------------------------- Part IV · 算法与效率 --------------------------- */
  {
    id: 'ch11', num: '11', title: '算法：排序与查找', en: 'Algorithms: Sorting & Searching',
    part: 'Part IV · 算法与效率', week: 12, minutes: 78, icon: 'sort',
    labs: 2,
    blurb: '同一个问题有很多解法：选择/插入/归并/快排、线性/二分查找，以及怎么选。'
  },
  {
    id: 'ch12', num: '12', title: '递归', en: 'Recursion',
    part: 'Part IV · 算法与效率', week: 13, minutes: 46, icon: 'repeat',
    labs: 2,
    blurb: '自己调用自己：基线条件、递归步骤、调用树，以及为什么朴素斐波那契会爆炸。'
  },
  {
    id: 'ch13', num: '13', title: '复杂度分析与 Big-O', en: 'Complexity Analysis & Big-O',
    part: 'Part IV · 算法与效率', week: 14, minutes: 44, icon: 'chart',
    labs: 2,
    blurb: '为什么 n 从 10 万涨到 20 万，程序慢了 4 倍？用 Big-O 和倍增法量化效率。'
  },

  /* ------------------------- Part V · 继续学习 · 案例研究 ------------------------- */
  {
    id: 'ch14', num: '14', title: '案例研究：随机网络冲浪者', en: 'Case Study: Random Web Surfer',
    part: 'Part V · 继续学习 · 案例研究', week: 15, minutes: 40, icon: 'grid',
    labs: 1,
    blurb: '用随机冲浪模型给网页排序：从"随机跳转的概率"推出 PageRank 的核心思想。'
  },
  {
    id: 'ch15', num: '15', title: '案例研究：渗流模拟', en: 'Case Study: Percolation',
    part: 'Part V · 继续学习 · 案例研究', week: 16, minutes: 45, icon: 'grid',
    labs: 1,
    blurb: '用蒙特卡洛模拟判断格子是否连通：并查集、渗流阈值与临界现象。'
  },
  {
    id: 'ch16', num: '16', title: '案例研究：N 体模拟', en: 'Case Study: N-Body Simulation',
    part: 'Part V · 继续学习 · 案例研究', week: 17, minutes: 45, icon: 'chart',
    labs: 1,
    blurb: '用牛顿定律模拟行星互绕：数组并行更新、能量守恒与仿真稳定性。'
  },

  /* -------------------- Part VI · 继续学习 · 算法与数据结构 -------------------- */
  {
    id: 'ch17', num: '17', title: '栈与队列', en: 'Stacks and Queues',
    part: 'Part VI · 继续学习 · 算法与数据结构', week: 18, minutes: 60, icon: 'layers',
    labs: 1,
    blurb: '后进先出与先进先出：如何用数组实现，以及它们在表达式求值与 BFS 里起什么作用。'
  },
  {
    id: 'ch18', num: '18', title: '符号表', en: 'Symbol Tables',
    part: 'Part VI · 继续学习 · 算法与数据结构', week: 19, minutes: 60, icon: 'grid',
    labs: 1,
    blurb: '把键映射到值：哈希表与二叉查找树两条实现路线，以及"该选哪个"的判据。'
  },
  {
    id: 'ch19', num: '19', title: '小世界现象与图', en: 'Small-World Phenomenon',
    part: 'Part VI · 继续学习 · 算法与数据结构', week: 20, minutes: 50, icon: 'search',
    labs: 1,
    blurb: '六度分隔从哪来：用图表示关系，用 BFS 度量最短路径与网络直径。'
  },

  /* ----------------------- Part VII · 继续学习 · 计算理论 ----------------------- */
  {
    id: 'ch20', num: '20', title: '形式语言与自动机', en: 'Formal Languages',
    part: 'Part VII · 继续学习 · 计算理论', week: 21, minutes: 55, icon: 'branch',
    labs: 1,
    blurb: '正则表达式背后的 DFA：语言如何被"机器"识别，以及它的描述能力边界在哪。'
  },
  {
    id: 'ch21', num: '21', title: '图灵机与通用性', en: 'Turing Machines & Universality',
    part: 'Part VII · 继续学习 · 计算理论', week: 22, minutes: 55, icon: 'cpu',
    labs: 1,
    blurb: '一台机器怎么模拟所有机器：图灵机的形式定义、通用性与"程序即数据"。'
  },
  {
    id: 'ch22', num: '22', title: '可计算性与难解性', en: 'Computability & Intractability',
    part: 'Part VII · 继续学习 · 计算理论', week: 23, minutes: 50, icon: 'cpu',
    labs: 1,
    blurb: '哪些问题根本没有算法，哪些只是暂时算不动：停机问题与 NP 完全性。'
  },

  /* --------------------- Part VIII · 继续学习 · 机器与硬件 --------------------- */
  {
    id: 'ch23', num: '23', title: '信息表示与 TOY 机器', en: 'Representing Information & the TOY Machine',
    part: 'Part VIII · 继续学习 · 机器与硬件', week: 24, minutes: 60, icon: 'cpu',
    labs: 1,
    blurb: '二进制、补码、浮点与一台 16 位教学机：数据在机器里到底长什么样。'
  },
  {
    id: 'ch24', num: '24', title: '机器语言与 TOY 虚拟机', en: 'Machine-Language Programming & the TOY VM',
    part: 'Part VIII · 继续学习 · 机器与硬件', week: 25, minutes: 55, icon: 'cpu',
    labs: 1,
    blurb: '把汇编翻译成机器码，再用软件模拟一台机器：指令、寻址与虚拟机。'
  },
  {
    id: 'ch25', num: '25', title: '布尔逻辑与数字电路', en: 'Boolean Logic & Digital Circuits',
    part: 'Part VIII · 继续学习 · 机器与硬件', week: 26, minutes: 60, icon: 'cpu',
    labs: 1,
    blurb: '从真值表到逻辑门，用门电路搭出加法器：计算机的物理基础。'
  }

]);
