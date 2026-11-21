/* =====================================================================
 * quiz.js · CSC4001 分章题库
 * 结构：{ items:[{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options?, answer?, accept?, code?, explain }] }
 * 题型：mcq / tf / fill / multi / predict
 * 覆盖：ch00–ch07，每章 7 题，共 56 题
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '本站把八章内容串成一条「从源码到修复」的主线，下面哪条顺序最准确？',
        options: [
          { text: '源码 → 中间表示与控制流图 → 数据流分析 → 格与不动点 → 符号执行 → 测试与约简 → 定位与修复', correct: true },
          { text: '源码 → 机器码 → 操作系统 → 数据库 → 网络 → 前端 → 修复' },
          { text: '测试 → 修复 → 源码 → 控制流图 → 数据流分析 → 符号执行 → 格' , correct: false },
          { text: '格与不动点 → 源码 → 控制流图 → 测试 → 修复 → 数据流分析 → 符号执行' }
        ],
        explain: '主线是递进的：先把源码转成三地址码并画出控制流图（ch01），再在 CFG 上传播抽象事实（ch02–ch03），用格与不动点解释迭代为什么收敛（ch04），换成逐路径精确推理（ch05），然后进入动态测试与约简（ch06），最后落到定位、修复与维护（ch07）。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '静态分析不需要真正运行程序，而是通过推理程序的所有可能行为来得出结论。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '静态分析在编译期或提交前工作，不执行程序，因此能覆盖测试到不了的路径（包括异常路径与极端输入）；代价是结论通常保守，可能误报。动态测试则选有限输入真实执行，结果可信但覆盖有限。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '一个典型的编译器前端通常包含下面哪些阶段？（多选）',
        options: [
          { text: '词法分析：把字符流切成 token', correct: true },
          { text: '语法分析：把 token 组织成抽象语法树', correct: true },
          { text: '语义分析：检查类型、作用域等约束', correct: true },
          { text: '寄存器分配：把虚拟寄存器映射到物理寄存器' },
          { text: '指令调度：重排指令以填满流水线' }
        ],
        explain: '前端负责「读懂源码」：词法、语法、语义分析，产出带类型信息的 AST 或中间表示。寄存器分配与指令调度属于后端优化与代码生成，发生在中间表示之后。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '把程序的基本块按控制流连起来的有向图叫 ______（英文缩写 CFG）。',
        answer: '控制流图',
        accept: ['控制流图（CFG）', 'CFG', 'control flow graph'],
        explain: '控制流图（control-flow graph）的节点是基本块，边表示可能的控制转移。它是数据流分析、支配关系、循环识别与符号执行的共同基础。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '「可能」分析与「一定」分析在汇合点上的区别，下面哪句正确？',
        options: [
          { text: 'may 分析取并集，只要有一条路径成立就成立；must 分析取交集，要求所有路径都成立', correct: true },
          { text: 'may 分析取交集，must 分析取并集' },
          { text: '两者都取并集，只是初始值不同' },
          { text: '两者都取交集，只是传递函数不同' }
        ],
        explain: 'may（可能性）在汇合点用并集：任一前驱带来事实就保留；must（必然性）用交集：所有前驱都带来才保留。这决定了到达定值/活跃变量用 may，可用表达式/非常忙表达式用 must。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-7', tier: 2, type: 'predict', difficulty: 2,
        tags: ['concept'],
        code: 'int f(int x) {\n    if (x > 0) return x;\n    return -x;\n}',
        codeTitle: '预测返回值',
        stem: '对任意整数 x，f(x) 的返回值满足什么性质？',
        answer: '非负',
        accept: ['非负', '>= 0', '大于等于 0', '绝对值'],
        explain: 'x > 0 时返回 x（正数），否则返回 -x（x ≤ 0 时 -x ≥ 0）。两条路径的返回值都非负，所以 f 等价于绝对值函数。这类「对所有输入成立」的结论正是符号执行要证明的性质。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-1', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '为什么说「保守」是静态分析的必要代价，而不是实现缺陷？',
        options: [
          { text: '因为程序行为不可判定，分析必须对不确定的情况给出安全近似，宁可多报也不漏报', correct: true },
          { text: '因为程序员写不出精确的规格' },
          { text: '因为编译器时间总是不够' },
          { text: '因为测试已经能覆盖所有路径，分析只需粗略' }
        ],
        explain: '精确判断「某条路径是否可达」「某断言是否恒真」一般不可判定，分析只能做安全近似：把不确定的情况算作「可能有问题」。这保证不漏报（sound），代价是可能误报（不 complete）。'
      },

      /* ---------------- ch01 从源码到控制流图 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '构造基本块时，下面哪条不是「leader（首指令）」的判定规则？',
        options: [
          { text: '函数的第一条指令是 leader' },
          { text: '任何跳转语句的目标指令是 leader' },
          { text: '任何跳转语句之后的指令是 leader' },
          { text: '任何带有函数调用的指令都是 leader', correct: true }
        ],
        explain: 'leader 的三条经典规则：函数入口、跳转目标、跳转语句的下一条。函数调用本身不切断基本块——调用返回后控制仍顺序继续，除非它后面紧跟跳转或它是跳转目标。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '基本块内部的指令一定顺序执行，且只有一个入口和一个出口。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '基本块的定义就是「顺序执行、无分支跳入跳出」的最大指令序列：入口是 leader，出口是最后一条指令，中间没有跳转目标。这让块内分析可以按顺序一次算完。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '在控制流图中，下面哪些情况会添加一条边？（多选）',
        options: [
          { text: '基本块末尾是无条件跳转，指向目标块', correct: true },
          { text: '基本块末尾是条件跳转，分别指向 then 与 else 的入口', correct: true },
          { text: '基本块顺序落到下一个基本块', correct: true },
          { text: '两个基本块使用了同一个变量' },
          { text: '两个基本块在源码中相邻，但中间隔着 return' }
        ],
        explain: 'CFG 的边表示控制转移：无条件跳转、条件跳转的两个出口、顺序落下。共享变量是数据依赖，不是控制流；return 之后的代码不可达，没有顺序边。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '若从入口到节点 n 的每条路径都经过节点 d，则称 d ______ n（dominates）。',
        answer: '支配',
        accept: ['支配', 'dominate', 'dominates'],
        explain: '支配关系是 CFG 上的偏序：d dom n 表示所有从入口到 n 的路径都经过 d。它是识别循环、构造 SSA、做切片的基础；直接支配点 idom 构成支配树。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'predict', difficulty: 2,
        tags: ['concept'],
        code: 'int s = 0;\nfor (int i = 0; i < n; i++)\n    s += i;\nreturn s;',
        codeTitle: '循环的 CFG',
        stem: '这段代码的 CFG 中，循环头（loop header）是哪一部分？',
        answer: '条件判断 i < n 所在的块',
        accept: ['条件判断块', 'i < n 所在块', '循环条件块', '判断 i<n 的块'],
        explain: '循环头是循环的入口，也是回边的目标。这里 for 的条件判断 i < n 既是进入循环体的入口，也是 i++ 之后回跳的目标，因此是循环头；循环体与 i++ 是循环内的块。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '给定 CFG 中的一条回边 n → h（h 支配 n），自然循环由哪些节点组成？',
        options: [
          { text: 'h 加上所有能到达 n 且不经过 h 的节点', correct: true },
          { text: 'h 与 n 两个节点' },
          { text: '从入口到 n 的所有节点' },
          { text: '所有从 h 出发可达的节点' }
        ],
        explain: '自然循环 = 循环头 h + 回边起点 n + 所有从 n 逆着走、不经过 h 能到达的节点。这个定义保证循环只有一个入口 h，便于分析；多个回边对应多个自然循环，可合并。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-8', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '下面哪一项是控制流图本身不建模、因而可能让分析结论失真的信息？',
        options: [
          { text: '函数调用的上下文与指针别名导致的间接跳转', correct: true },
          { text: '条件分支的两个出口' },
          { text: '循环的回边' },
          { text: '基本块内的顺序执行' }
        ],
        explain: 'CFG 只画「控制可能去哪」，不区分「在什么调用上下文」「通过哪个指针跳到哪」。上下文敏感分析与别名分析要在此之上补充信息；否则把不同调用混在一起，结论会过于保守。'
      },

      /* ---------------- ch02 数据流分析 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '一个数据流分析框架通常由哪四要素组成？',
        options: [
          { text: '方向、抽象域与汇合运算、传递函数、初始值', correct: true },
          { text: '词法、语法、语义、代码生成' },
          { text: '输入、输出、日志、异常' },
          { text: '变量、常量、表达式、语句' }
        ],
        explain: '数据流分析的四要素：分析方向（前向/后向）、值的集合与汇合运算（并/交）、每条语句的传递函数（gen/kill）、边界初始值。换一个问题只需换这四样，迭代算法不变。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '一个 sound（可靠）的分析可能产生误报，但不会漏报真实存在的缺陷。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'sound 的意思是「所有真实情况都被包含在分析结果里」，所以不会漏报（no false negative）；代价是把不确定的情况也算进来，于是可能误报（false positive）。complete 则相反：报出的都对，但可能漏。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些分析属于「may」分析（汇合取并集）？（多选）',
        options: [
          { text: '到达定值（reaching definitions）', correct: true },
          { text: '活跃变量（live variables）', correct: true },
          { text: '可用表达式（available expressions）' },
          { text: '非常忙表达式（very busy expressions）' }
        ],
        explain: '到达定值与活跃变量回答「是否存在一条路径」，用并集；可用表达式与非常忙表达式回答「是否所有路径都满足」，用交集。方向是另一个维度：前两者分别是前向、后向，后两者也是前向、后向。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '传递函数 OUT = gen ∪ (IN − kill) 中，kill 表示被本条语句「杀死」的旧事实集合，gen 表示 ______ 的新事实集合。',
        answer: '生成',
        accept: ['生成', '产生', 'gen', 'generated'],
        explain: 'gen 是本条语句新产生的事实（例如新定值、新求值的表达式），kill 是它使之失效的旧事实（例如对同一变量的重新赋值）。先杀后生，二者共同描述一条语句对数据流事实的转换。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'predict', difficulty: 2,
        tags: ['concept'],
        code: 'x = 1;\nif (p) x = 2;\ny = 3 / x;',
        codeTitle: '符号分析的汇合',
        stem: '用符号分析（+ / − / 0）在汇合点取并集，x 在除法处的可能取值集合是什么？',
        answer: '{1, 2}',
        accept: ['{1,2}', '1 和 2', '1或2', '{1, 2}'],
        explain: 'then 路径 x = 2，else 路径 x 保持 1；汇合点取并集得到 {1, 2}。两者都非零，所以除法安全。若某条路径能把 x 置 0，集合会包含 0，分析就应报告「可能除零」。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '符号分析把具体整数抽象成「正、负、零」，这种抽象带来的直接后果是什么？',
        options: [
          { text: '能有限地表示无限多具体值，但会丢失具体数值信息，结论可能不精确', correct: true },
          { text: '完全精确，不会误报' },
          { text: '只能分析常量，不能分析变量' },
          { text: '必须知道程序的所有输入才能开始' }
        ],
        explain: '抽象的目的是把无限的具体状态压成有限个抽象值，从而保证分析终止。代价是丢失信息：x = 5 与 x = 7 都抽象成「正」，无法区分，因此「x == 5」这类性质在这种抽象下不可判定。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-8', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '把「可能除零」分析做成 must 分析（只报告一定除零），会有什么后果？',
        options: [
          { text: '漏报真实缺陷：只在部分路径上发生的除零不会被报告', correct: true },
          { text: '误报增多，但不会漏报' },
          { text: '分析一定不终止' },
          { text: '没有任何影响，may 与 must 等价' }
        ],
        explain: '除零只要在「某条可达路径」上发生就是缺陷，本质是 may 性质。若用 must（所有路径都除零）才报告，大量真实缺陷会被漏掉。选择 may 还是 must 取决于性质本身，而不是实现方便。'
      },

      /* ---------------- ch03 经典数据流问题 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '到达定值分析的方向与汇合运算是什么？',
        options: [
          { text: '前向、并集（may）', correct: true },
          { text: '后向、并集（may）' },
          { text: '前向、交集（must）' },
          { text: '后向、交集（must）' }
        ],
        explain: '到达定值问「某个定值能否到达某点」，沿控制流前向传播，只要有一条路径能到达就算到达，所以汇合取并集。传递函数 OUT = gen ∪ (IN − kill)。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '活跃变量分析是后向分析：变量 v 在点 p 活跃，指存在一条从 p 出发的路径，在 v 被重新定值之前使用了 v。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '活跃性是「未来会不会被用」的性质，所以从出口往回算。IN = use ∪ (OUT − def)，OUT 取所有后继 IN 的并集。它与到达定值恰好方向相反，常一起用于寄存器分配与死代码消除。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '关于可用表达式分析，下面哪些说法正确？（多选）',
        options: [
          { text: '它是前向 must 分析，汇合取交集', correct: true },
          { text: '入口块的 OUT 取空集，其余块初值取全集', correct: true },
          { text: '表达式可用要求所有路径都求值过它，且之后相关变量未被重定义', correct: true },
          { text: '它用于全局公共子表达式消除', correct: true },
          { text: '它的初值应全部取空集，让交集从空集增长' }
        ],
        explain: '可用表达式是「所有路径都可用」，必须用交集；若初值取空集，交集永远为空，得不到任何可用表达式，所以入口 OUT 取空集、其余块取全集，让迭代向下收缩。它的经典用途是全局公共子表达式消除。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '活跃变量分析的传递函数是 IN = use ∪ (OUT − ______)。',
        answer: 'def',
        accept: ['def', '定义', '定值', 'def 集合'],
        explain: 'use 是本语句使用、且在定值前读取的变量；def 是本语句定值的变量。先把 OUT 中被本句定值的变量杀掉，再并上本句使用的变量，得到入口处的活跃集合。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-1', tier: 2, type: 'predict', difficulty: 3,
        tags: ['concept'],
        code: 'B1: d1: x = 1\nB2: d2: x = 2\nB3: y = x + 1',
        codeTitle: '到达定值',
        stem: 'B1、B2 都跳到 B3。在 B3 的入口，哪些定值到达？',
        answer: 'd1 与 d2 都到达',
        accept: ['d1 和 d2', 'd1,d2', '{d1,d2}', '两个都到达'],
        explain: '到达定值取并集：B1 的 d1 经 B1→B3 到达，B2 的 d2 经 B2→B3 到达，两条路径都可行，所以 {d1, d2} 都到达。注意 d1 在 B2 被 kill 只影响经过 B2 的路径，不影响 B1 直连 B3 的路径。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '要在 B3 处用可用表达式做公共子表达式消除，需要满足什么条件？',
        options: [
          { text: '表达式在 B3 入口可用：所有路径都求值过它，且之后相关变量未被重定义', correct: true },
          { text: '表达式在 B3 之前的某条路径上求值过即可' },
          { text: '表达式在 B3 中被求值过两次' },
          { text: '表达式只涉及常量' }
        ],
        explain: '可用表达式的定义就是「所有路径都求值过，且之后相关变量未被重定义」。只有满足它，才能安全地把 B3 的计算替换成之前保存的结果；只要有一条路径没算过或变量被改过，替换就可能改变语义。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-5', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '非常忙表达式（very busy expressions）与可用表达式的主要区别是什么？',
        options: [
          { text: '非常忙是后向 must：问「未来是否所有路径都会先求值它」；可用是前向 must：问「过去是否所有路径都求值过它」', correct: true },
          { text: '非常忙是前向 may，可用是后向 may' },
          { text: '两者方向相同，只是初值不同' },
          { text: '非常忙用于寄存器分配，可用用于死代码消除' }
        ],
        explain: '非常忙表达式从出口往回算，问「从这点出发，是否所有路径都会在重新定义相关变量之前求值该表达式」，是后向 must；可用表达式从入口往前算，问「到达这点前是否所有路径都求值过」，是前向 must。方向不同，用途也不同。'
      },

      /* ---------------- ch04 格、不动点与 worklist ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '一个格（lattice）必须满足下面哪组条件？',
        options: [
          { text: '偏序集，且任意两个元素都有最小上界与最大下界', correct: true },
          { text: '任意两个元素都可比的全序集' },
          { text: '有限集合加上并集运算' },
          { text: '带加法和乘法的代数结构' }
        ],
        explain: '格是偏序集，要求任意两个元素存在最小上界（join）与最大下界（meet）。全序是特殊的格；有限集合的幂集在包含关系下构成格。数据流分析要求的是「完整格」：任意子集都有上确界与下确界。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '在有限高度的完整格上，单调传递函数从 ⊥ 开始迭代，一定会在有限步内到达最小不动点。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '单调保证迭代序列沿链上升、不会回头；格的高度有限保证链长有限；两者合起来保证有限步稳定。稳定点就是不动点，且从 ⊥ 出发得到的是最小不动点（lfp），对应最精确的保守解。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['tool'],
        stem: 'worklist 算法相对朴素的「每轮扫描所有块」有哪些改进？（多选）',
        options: [
          { text: '只把「输出发生变化」的块的后继重新入队', correct: true },
          { text: '避免对未受影响的块重复计算传递函数', correct: true },
          { text: '通常能显著减少总计算次数', correct: true },
          { text: '保证得到比不动点更精确的解' },
          { text: '不再需要格与单调性假设' }
        ],
        explain: 'worklist 只是迭代的调度优化：值没变的块不必再算，只把受影响的后继入队。它不改变最终不动点，也不放宽理论前提；最坏复杂度仍可能较高，但实际快很多。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '从 ⊥ 开始迭代得到的不动点叫最小不动点，英文缩写是 ______。',
        answer: 'lfp',
        accept: ['lfp', 'least fixed point', '最小不动点'],
        explain: '最小不动点（least fixed point, lfp）是满足 f(x) = x 的最小元素，对应「从无信息出发、逐步累积」的迭代结果。数据流分析通常求 lfp，因为它给出最精确的保守解；从 ⊤ 出发则得到最大不动点（gfp）。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'predict', difficulty: 2,
        tags: ['concept'],
        code: '// 变量集合 {a, b}，幂集格按包含排序\n// 从 ∅ 开始，每轮把「当前集合」与 {a, b} 求并',
        codeTitle: '幂集格的迭代',
        stem: '这个迭代从 ∅ 出发，第 1 轮得到什么？之后还会变化吗？',
        answer: '第 1 轮得到 {a,b}，之后不变',
        accept: ['第一轮{a,b}，之后不变', '{a,b}，不再变化', '第一轮就是{a,b}'],
        explain: '传递函数是「与 {a, b} 求并」，从 ∅ 出发第一轮得到 {a, b}，第二轮仍是 {a, b}，达到不动点。这演示了「单调 + 有限高度 ⇒ 有限步收敛」：幂集格高度为 2，最多两步稳定。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-8', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '关于 MOP 与 MFP（迭代解）的关系，下面哪句正确？',
        options: [
          { text: 'MFP 一般不如 MOP 精确；当传递函数可分配时两者相等', correct: true },
          { text: 'MFP 总比 MOP 精确' },
          { text: '两者永远相等，与传递函数无关' },
          { text: 'MOP 是迭代算法，MFP 是格论定义' }
        ],
        explain: 'MOP 对每条路径分别算再汇合，是最精确的路径敏感解；MFP 是迭代到不动点的解。由于迭代在汇合点提前合并信息，MFP 可能不如 MOP 精确；当传递函数对汇合可分配（f(a∪b)=f(a)∪f(b)）时两者相等。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '在一个 must 分析（如可用表达式）中，值从全集开始、按交集向下收缩，最终稳定到的解是什么？',
        options: [
          { text: '最大不动点，它是 must 分析中最精确的可靠解', correct: true },
          { text: '最小不动点，它比最大不动点更精确' },
          { text: '一定不收敛' },
          { text: '空集，因为交集会不断缩小' }
        ],
        explain: 'must 分析的「真」要求所有路径都满足：从全集（过度乐观）出发，每轮用交集与 kill 修正，单调下降，稳定在最大不动点（gfp）。它保证「报为可用的一定可用」，且保留所有可证明的事实；若从空集出发得到最小不动点，交集永远为空，会把所有表达式都判为不可用——虽然不会误报，但极不精确。'
      },

      /* ---------------- ch05 符号执行 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '符号执行中，路径条件（path condition）指的是什么？',
        options: [
          { text: '一条路径上所有分支选择的合取，满足它的输入会走这条路径', correct: true },
          { text: '程序入口处所有变量的初始值' },
          { text: '当前程序点的行号' },
          { text: '断言失败时的错误信息' }
        ],
        explain: 'PC 是路径的「身份证明」：每做一个分支选择，就把该选择的条件合取进来。求解 PC 得到能走这条路径的具体输入；检查 PC ∧ ¬断言 是否可满足，就能判断这条路径上断言是否恒成立。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '符号执行遇到 n 个顺序的条件分支，最多可能产生 2ⁿ 条路径，这就是路径爆炸的来源之一。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '每个分支把当前状态一分为二，n 个独立分支最多 2ⁿ 条路径；循环还会让路径数随迭代次数增长甚至无限。缓解手段包括剪枝、状态合并、函数摘要、循环限界与搜索引导。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '关于 concolic testing，下面哪些说法正确？（多选）',
        options: [
          { text: '用具体输入真实执行，同时记录路径上的符号约束', correct: true },
          { text: '取反某个分支条件并求解，可得到走到新路径的输入', correct: true },
          { text: '能较好地处理外部调用与复杂库函数', correct: true },
          { text: '保证穷尽所有路径', correct: false },
          { text: '不需要约束求解器' }
        ],
        explain: 'concolic = 具体执行 + 符号记录 + 分支取反 + 求解新输入。具体执行让外部调用能真实发生，这是它相对纯符号执行的优势；但路径选择依赖搜索策略，不保证穷尽，也仍然需要求解器。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: 'SMT 求解器返回的三态是 sat、unsat 和 ______。',
        answer: 'unknown',
        accept: ['unknown', '未知', '不确定'],
        explain: 'sat 给出一组满足解（可作具体输入/反例）；unsat 证明不存在解（可完成证明）；unknown 表示超时或落在不可判定片段，既不能当 sat 也不能当 unsat，只能保守放弃这条路径或换更强求解器。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'predict', difficulty: 2,
        tags: ['concept'],
        code: 'int f(int x) {\n    int y;\n    if (x > 0) y = x;\n    else       y = -x;\n    assert(y >= 0);\n    return y;\n}',
        codeTitle: '符号执行两条路径',
        stem: '对 else 路径，路径条件与断言检查分别是什么？',
        answer: 'PC: x <= 0；检查 x <= 0 ⇒ -x >= 0，成立',
        accept: ['x<=0 且 -x>=0 成立', 'x小于等于0，断言成立', 'PC 为 x≤0，安全'],
        explain: 'else 路径的 PC 是 ¬(x > 0)，即 x ≤ 0；执行 y = -x 后符号状态 y ↦ -x。断言检查变成 x ≤ 0 ⇒ -x ≥ 0，恒真，所以这条路径安全。两条路径都安全，断言对所有输入成立。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '在路径条件为 PC 的程序点检查断言 assert(e)，要证明该断言恒成立，应验证什么？',
        options: [
          { text: 'PC ∧ ¬e 不可满足', correct: true },
          { text: 'PC ∧ e 可满足' },
          { text: 'PC 可满足' },
          { text: '¬e 不可满足' }
        ],
        explain: '「PC 蕴含 e」等价于「PC ∧ ¬e 没有模型」。若求解器返回 unsat，说明所有满足 PC 的输入都使 e 为真，断言安全；若 sat，则给出的模型就是一条反例。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-8', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '下面哪种情况最适合用符号执行而不是纯随机测试？',
        options: [
          { text: '需要覆盖一个条件极其苛刻的分支，例如 x == 0xDEADBEEF', correct: true },
          { text: '被测程序有大量网络调用与多线程竞争' },
          { text: '程序包含大量浮点非线性运算，且只需粗略测试' },
          { text: '只需要在几分钟内跑尽可能多的随机输入' }
        ],
        explain: '符号执行擅长「精确命中」：把到达分支的约束求解，能直接得到苛刻条件的输入，随机测试几乎不可能撞到。反之，外部调用、并发、浮点非线性正是它的弱项，此时模糊测试或 concolic 更实用。'
      },

      /* ---------------- ch06 测试、覆盖与约简 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '测试中的 oracle 指的是什么？',
        options: [
          { text: '判断一次执行结果是否正确的机制', correct: true },
          { text: '生成测试输入的工具' },
          { text: '被测程序的入口函数' },
          { text: '测试覆盖率报告' }
        ],
        explain: 'oracle 是「怎么知道对错」的答案：断言、参考实现、蜕变关系、人工检查都属于 oracle。很多系统测试的瓶颈不在生成输入，而在缺少可靠的 oracle。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '分支覆盖达标一定能推出语句覆盖达标。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '每个判断的真假都走到，意味着判断所在语句与其各分支内的语句都至少执行一次，因此语句覆盖必然达标。反之不成立：只走 then 也能让语句覆盖达标，但 else 方向没走。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些属于「覆盖率高但测试仍然弱」的表现？（多选）',
        options: [
          { text: '测试执行了代码，但没有断言检查结果', correct: true },
          { text: '测试只走主路径，异常路径没有断言', correct: true },
          { text: '断言写成恒真，永远不会失败', correct: true },
          { text: '测试覆盖了边界值与异常输入' },
          { text: '每个分支都有针对性的断言' }
        ],
        explain: '覆盖率只说明「代码被执行」，不说明「结果被验证」。没有断言、断言恒真、只走主路径都能刷高覆盖却不抓 bug。覆盖率应作为必要不充分条件，配合变异测试评估实际缺陷发现能力。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: 'ddmin 终止时得到的输入满足：删掉任何单个片段，失败都不再出现。这种性质叫 ______-minimal。',
        answer: '1',
        accept: ['1', '一', '1-minimal'],
        explain: '1-minimal 表示「不能再删掉任何一个片段而保持失败」，是局部最小而非全局最小。ddmin 不保证找到全局最小输入，但通常能把输入缩到很小，且代价可接受（最坏 O(n²)）。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-2', tier: 2, type: 'predict', difficulty: 3,
        tags: ['concept'],
        code: 'int f(int x, int y) {\n    if (x > 0 && y > 0) return 1;\n    if (x < 0 || y < 0) return -1;\n    return 0;\n}',
        codeTitle: '条件覆盖',
        stem: '测试 (1,1) 与 (-1,1) 是否达到条件覆盖（每个原子条件真假各一次）？',
        answer: '没有，y > 0 只取过真，未取过假',
        accept: ['没有，y>0 未取假', '未达到，y>0 缺少假', '不达标'],
        explain: 'x > 0 取过真（(1,1)）与假（(-1,1)）；x < 0 取过真（(-1,1)），但 y > 0 在两个用例中都是真，从未取假；y < 0 也从未取真。条件覆盖不达标，尽管分支覆盖可能已经达标。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '变异测试中，「杀死」一个变异体是什么意思？',
        options: [
          { text: '某个测试在变异体上失败，说明测试能区分正确代码与带缺陷代码', correct: true },
          { text: '变异体编译失败' },
          { text: '变异体被测试覆盖但结果正确' },
          { text: '变异体与正确答案语义等价' }
        ],
        explain: '杀死 = 测试集在变异体上出现失败，证明测试能发现这处人造缺陷。变异得分 = 杀死的变异体 / 非等价变异体；编译失败的变异体通常被丢弃，等价变异体杀不死且应排除。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '蜕变测试（metamorphic testing）主要解决什么问题？',
        options: [
          { text: '在没有可靠 oracle 时，利用输入变换与输出之间的必然关系判断对错', correct: true },
          { text: '自动生成覆盖率报告' },
          { text: '把测试集压缩到最小' },
          { text: '比较两个实现的输出差异' }
        ],
        explain: '蜕变测试不需要知道「正确答案」，只需要一条关系，例如 sin(π−x) = sin(x) 或「过滤后结果是原结果的子集」。关系被违反就说明实现有问题。比较两个实现的输出差异是差分测试，不是蜕变测试。'
      },

      /* ---------------- ch07 缺陷定位、修复与维护 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '基于频谱的缺陷定位（SBFL）主要利用什么信息？',
        options: [
          { text: '每个测试的通过/失败结果，以及测试对每条语句的覆盖情况', correct: true },
          { text: '程序的源代码行数与复杂度' },
          { text: '开发者的提交历史' },
          { text: '编译器的优化级别' }
        ],
        explain: 'SBFL 统计四个量：ef（覆盖该语句的失败测试数）、ep（覆盖的通过测试数）、nf、np，再用 Ochiai 等公式算可疑度。它不需要额外运行时开销，只要有覆盖与测试结果即可。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: 'Ochiai 公式中，一个语句被越多失败测试覆盖、被越少通过测试覆盖，可疑度越高。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'Ochiai = ef / sqrt(totalFailed × (ef + ep))：分子 ef 越大、分母中的 ef+ep 越小，值越大。直觉是「失败测试都走到它，通过测试很少走到它」，这样的语句最可能是缺陷所在。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '自动程序修复（APR）的典型工作流包含哪些步骤？（多选）',
        options: [
          { text: '定位：找出可疑代码位置', correct: true },
          { text: '生成：产生候选补丁', correct: true },
          { text: '验证：编译并运行测试', correct: true },
          { text: '排序与人工确认：从通过的候选中选择', correct: true },
          { text: '直接上线：不经测试自动部署' }
        ],
        explain: 'APR 四步：定位 → 生成 → 验证 → 排序/确认。验证通常要求完整测试集通过，有的系统还会用留出测试、变异测试或符号执行做更强检查；直接上线不是 APR 的步骤，也不是任何自动修复系统的合理默认。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '补丁让现有测试全部通过、却未真正修复缺陷的现象，称为补丁 ______。',
        answer: '过拟合',
        accept: ['过拟合', 'overfitting', '过拟合（overfitting）'],
        explain: '过拟合的典型表现是「绕开症状」而非「修根因」：加空指针检查、吞异常、删断言都能让测试变绿，但换个输入仍会错。检测手段包括留出测试、变异测试、符号执行验证与人工 review。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'predict', difficulty: 3,
        tags: ['concept'],
        code: '// 失败测试总数 4\n// 语句 s: ef = 3, ep = 1\n// 语句 t: ef = 1, ep = 5',
        codeTitle: 'Ochiai 可疑度',
        stem: '分别计算 s 与 t 的 Ochiai 值，哪个更可疑？',
        answer: 's = 0.75，t ≈ 0.204，s 更可疑',
        accept: ['s=0.75 t≈0.204', 's 0.75, t 0.204', 's 为 0.75 更可疑'],
        explain: 'Ochiai(s) = 3 / sqrt(4 × (3+1)) = 3/4 = 0.75；Ochiai(t) = 1 / sqrt(4 × (1+5)) = 1/√24 ≈ 0.204。s 被更多失败测试覆盖、被更少通过测试覆盖，因此排在前面。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '关于「缺陷位置」与「根因」，下面哪句最准确？',
        options: [
          { text: '缺陷位置是崩溃或错误发生的地方；根因是导致失效的因果链上游机制', correct: true },
          { text: '两者是同义词，只是叫法不同' },
          { text: '根因一定在缺陷位置的下一行' },
          { text: '找到缺陷位置就等于找到根因' }
        ],
        explain: '空指针异常的位置在 obj.f()，但根因可能是上游解析失败后返回了 null。只改崩溃点往往只是消除症状；RCA 要找的是「为什么会出现这个值/状态」的因果链，通常在上游。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '回归测试中看到测试失败，第一步应该判断什么？',
        options: [
          { text: '这是新引入的回归，还是本次改动有意改变的行为', correct: true },
          { text: '直接删除失败的测试' },
          { text: '直接把期望值改成实际输出' },
          { text: '忽略它，等上线后再说' }
        ],
        explain: '回归测试假设「旧行为应保持」，但修 bug 或改需求时行为本来就会变。先区分「回归」与「预期变更」：前者要修代码，后者要更新测试与规格。直接删测试或改期望值会掩盖真实问题。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
