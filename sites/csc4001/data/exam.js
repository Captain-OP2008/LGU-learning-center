/* =====================================================================
 * exam.js · CSC4001 模拟卷 A
 * 范围：ch00–ch07（编译器分析阶段、数据流、格与不动点、符号执行、
 *       测试与约简、定位与修复）
 * 规格：10 题、满分 100、限时 90 分钟
 * 题型：choice / tf / fill / output / keywords
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerExam({
    id: 'CSC4001-A',
    title: '编译原理 模拟卷 A',
    style: '期末风格',
    subtitle: 'CSC4001 · 覆盖 ch00–ch07 的综合模拟',
    date: '2026-11-21',
    minutes: 90,
    totalScore: 100,
    summary: '本卷覆盖八章核心内容：控制流图、数据流分析、格与不动点、符号执行、' +
      '测试与约简、缺陷定位与修复。卷面 10 题：选择 2 题共 16 分、判断 2 题共 16 分、' +
      '填空 2 题共 16 分、计算与读代码 2 题共 24 分、简答 1 题 12 分、综合 1 题 16 分。' +
      '建议闭卷限时完成；计算题写出中间步骤，简答题按关键词给分。',
    instructions: [
      '时间 90 分钟，满分 100 分。计时开始后不会暂停，刷新页面也按真实时间计算。',
      '题型：单项选择 4 小问、判断 4 小问、填空 4 小问、计算与读代码 4 小问、简答 2 小问、综合 2 小问。',
      '数据流题请写清方向（前向/后向）、汇合运算（并/交）与传递函数，只写答案不给步骤酌情扣分。',
      '简答题按关键词命中比例给分，答出要点即可；综合题要求给出可执行的验证方案，不只写结论。',
      '全卷默认以本章定义为准：may 分析取并集、must 分析取交集；Ochiai 使用 ef / sqrt(totalFailed × (ef+ep))。'
    ],
    questions: [
      /* ---------------------------------------------------------- Q1 */
      { no: 1, points: 8, type: 'single choice',
        intro: '本题考察控制流图与基本块。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '下面哪条指令一定是基本块的首指令（leader）？',
            options: [
              { text: '函数的第一条指令' , correct: true },
              { text: '任何一条赋值指令' },
              { text: '任何一条函数调用指令' },
              { text: '任何一条返回指令之后的那条指令' }
            ],
            explain: 'leader 的三条规则：函数入口、跳转目标、跳转语句的下一条。赋值本身不切断基本块；函数调用后控制通常顺序返回，除非它是跳转目标或后面紧跟跳转。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '给定 CFG 中的回边 n → h（h 支配 n），自然循环的节点集合是：',
            options: [
              { text: 'h 加上所有能到达 n 且不经过 h 的节点', correct: true },
              { text: '只有 h 与 n' },
              { text: '从入口到 n 的所有节点' },
              { text: '所有从 h 出发可达的节点' }
            ],
            explain: '自然循环 = 循环头 h + 回边起点 n + 从 n 逆走、不经过 h 能到达的所有节点。这个定义保证循环只有一个入口 h，便于分析；多个回边可产生多个自然循环。' }
        ] },

      /* ---------------------------------------------------------- Q2 */
      { no: 2, points: 8, type: 'true / false',
        intro: '判断下列陈述的真假。',
        parts: [
          { label: '(a)', points: 4, kind: 'tf',
            prompt: '一个 sound 的静态分析不会漏报真实缺陷，但可能产生误报。',
            options: [
              { text: '正确', correct: true },
              { text: '错误' }
            ],
            explain: 'sound 表示所有真实情况都被包含在分析结果中，因此不漏报（无 false negative）；代价是把不确定的情况也算进来，可能误报（false positive）。complete 相反：报出的都对，但可能漏。' },
          { label: '(b)', points: 4, kind: 'tf',
            prompt: '活跃变量分析是后向分析，汇合时对后继的 IN 取交集。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '活跃性是「未来是否存在一条路径使用该变量」，只要有一条路径使用就算活跃，所以汇合取并集（may），不是交集。方向确实是后向，但汇合运算不是交。' }
        ] },

      /* ---------------------------------------------------------- Q3 */
      { no: 3, points: 8, type: 'fill in the blank',
        intro: '把答案写在横线处。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: 'worklist 算法中，当一个块的 OUT 发生变化时，应把它的 ______ 重新加入工作列表。',
            answer: '后继块',
            accept: ['后继', '所有后继', 'successors', '后继节点'],
            explain: 'worklist 的核心是「只重算受影响的块」：本块 OUT 变化会影响后继的 IN，因此把后继入队；本块自身不必再入队，除非它也是自己的后继（循环）。这比每轮扫描所有块快得多。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: 'Ochiai 可疑度公式中，ef 表示覆盖该语句的失败测试数，ep 表示覆盖该语句的 ______ 测试数。',
            answer: '通过',
            accept: ['通过', 'pass', 'passed', '成功'],
            explain: 'ef（executed failed）是覆盖该语句的失败测试数，ep（executed passed）是覆盖该语句的通过测试数；nf、np 分别是未覆盖的失败/通过测试数。ef 大、ep 小的语句最可疑。' }
        ] },

      /* ---------------------------------------------------------- Q4 */
      { no: 4, points: 8, type: 'single choice',
        intro: '本题考察格、不动点与符号执行。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '在有限高度的完整格上，单调函数从 ⊥ 开始迭代，最终得到的是：',
            options: [
              { text: '最小不动点，且迭代一定在有限步内稳定', correct: true },
              { text: '最大不动点，且迭代一定在有限步内稳定' },
              { text: '最小不动点，但可能不收敛' },
              { text: '任意一个不动点，取决于迭代顺序' }
            ],
            explain: 'Kleene 定理：完整格 + 单调 f，从 ⊥ 出发的迭代链单调上升，有限高度保证有限步稳定，稳定点就是最小不动点（lfp）。从 ⊤ 出发则得到最大不动点（gfp）。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '在路径条件为 PC 处检查 assert(e)，要证明断言恒成立，应验证：',
            options: [
              { text: 'PC ∧ ¬e 不可满足', correct: true },
              { text: 'PC ∧ e 可满足' },
              { text: 'PC 可满足' },
              { text: '¬e 不可满足' }
            ],
            explain: '「PC 蕴含 e」等价于「PC ∧ ¬e 没有模型」。求解器返回 unsat 说明所有满足 PC 的输入都使 e 为真；返回 sat 时给出的模型就是一条反例。' }
        ] },

      /* ---------------------------------------------------------- Q5 */
      { no: 5, points: 8, type: 'true / false',
        intro: '判断下列陈述的真假。',
        parts: [
          { label: '(a)', points: 4, kind: 'tf',
            prompt: 'ddmin 终止时得到的输入一定是全局最小的失败输入。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: 'ddmin 得到的是 1-minimal：删掉任何单个片段失败都不再出现，但可能存在「同时删掉两个片段才更小」的情况，所以只是局部最小，不保证全局最小。' },
          { label: '(b)', points: 4, kind: 'tf',
            prompt: '自动程序修复生成的补丁只要让所有现有测试通过，就说明它已经正确修复了缺陷。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '测试通过只是「相对于测试集正确」，补丁可能绕开症状而没有修根因（过拟合）。需要留出测试、变异测试、符号执行或人工 review 进一步验证。' }
        ] },

      /* ---------------------------------------------------------- Q6 */
      { no: 6, points: 8, type: 'fill in the blank',
        intro: '把答案写在横线处。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: 'SMT 求解器返回的三种结果是 sat、unsat 和 ______。',
            answer: 'unknown',
            accept: ['unknown', '未知', '不确定'],
            explain: 'sat 给出一组满足解，unsat 证明不存在解，unknown 表示超时或落在不可判定片段。unknown 既不能当 sat 也不能当 unsat，只能保守放弃该路径或换更强的求解器。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '变异测试的得分等于被杀死的变异体数除以 ______ 变异体总数。',
            answer: '非等价',
            accept: ['非等价', 'non-equivalent', '不等价'],
            explain: '等价变异体改动后语义不变，任何测试都杀不死，若不排除会人为拉低得分。变异得分 = killed / (total − equivalent)，衡量测试集对「小缺陷」的敏感度。' }
        ] },

      /* ---------------------------------------------------------- Q7 */
      { no: 7, points: 12, type: 'calculation',
        intro: '本题考察数据流分析的手算，要求写出方向、汇合运算与中间结果。',
        code: 'B1: x = 1\nB2: if (p) x = 2\n    else   x = 3\nB3: y = x + 1',
        codeTitle: '到达定值',
        parts: [
          { label: '(a)', points: 6, kind: 'output',
            prompt: '在 B2 的入口，哪些定值到达？写出理由。',
            answer: 'B1 的 x = 1 到达',
            accept: ['x=1', 'B1 的定值', '只有 x=1 到达', 'd1'],
            explain: '到达定值前向、取并集。B2 只有 B1 一个前驱，B1 的 OUT 含 x=1，且 B2 入口之前没有 kill，所以 x=1 到达。' },
          { label: '(b)', points: 6, kind: 'output',
            prompt: '在 B3 的入口，哪些定值到达？为什么 B1 的定值不再到达？',
            answer: 'x=2 与 x=3 到达；x=1 被两条分支上的重新定值 kill',
            accept: ['x=2 和 x=3', 'B2 的两个定值', 'x=2、x=3，x=1 被 kill'],
            explain: 'B2 的两条路径分别把 x 重新定值为 2 或 3，都会 kill 掉 x=1。B3 的前驱是 B2，B2 的 OUT 是 {x=2, x=3}（两条路径的并集），所以 B3 入口只有这两个定值。' }
        ] },

      /* ---------------------------------------------------------- Q8 */
      { no: 8, points: 12, type: 'code reading',
        intro: '本题考察活跃变量与符号执行，按步骤作答。',
        code: '1: a = 1\n2: b = 2\n3: if (p) c = a + b\n4: else   c = a - b\n5: d = c * 2\n6: return d',
        codeTitle: '活跃变量与路径',
        parts: [
          { label: '(a)', points: 6, kind: 'output',
            prompt: '在程序点 5 的入口，哪些变量活跃？写出理由。',
            answer: 'c 活跃；a、b 不活跃',
            accept: ['c', '只有 c', 'c 活跃 a b 不活跃'],
            explain: '活跃变量后向、取并集：点 5 使用 c，所以 c 在入口活跃；a、b 在点 3/4 之后没有再被使用，且点 5 只读 c，所以 a、b 不活跃。注意「活跃」问的是未来是否会被使用，不是过去是否被定义。' },
          { label: '(b)', points: 6, kind: 'output',
            prompt: '若把第 3 行的 c = a + b 改成 c = a / b，在什么输入下会出错？请用符号条件表达。',
            answer: 'b == 0 且 p 为真时',
            accept: ['b==0', 'b 为 0 且 p 为真', 'p 真且 b 等于 0'],
            explain: '沿 then 路径，路径条件为 p ∧ b == 0 时除法 b 作除数且为零；else 路径是 a - b，不会除零。符号执行会求解 p ∧ b == 0，得到一组具体反例（如 p=true, b=0）。' }
        ] },

      /* ---------------------------------------------------------- Q9 */
      { no: 9, points: 12, type: 'short answer',
        intro: '简答题：先给要点，再展开一两句。',
        parts: [
          { label: '(a)', points: 6, kind: 'keywords',
            prompt: '列出至少三种缓解符号执行路径爆炸的手段，并各用一句话说明代价。',
            answer: '剪枝、状态合并、函数摘要、循环限界、搜索引导、concolic',
            accept: ['剪枝', '状态合并', '函数摘要', '循环限界', '搜索引导', 'concolic', '路径爆炸'],
            explain: '剪枝用求解器丢弃不可满足路径，代价是求解开销；状态合并用 ite 合并同程序点状态，代价是表达式变大；函数摘要不展开被调函数，代价是不精确；循环限界最多展开 k 次，代价是漏掉深循环 bug；搜索引导优先靠近目标的路径，代价是可能局部最优；concolic 每次只走一条具体路径，代价是覆盖不保证。' },
          { label: '(b)', points: 6, kind: 'keywords',
            prompt: '什么是测试的 oracle 问题？举两种不依赖人工期望值的 oracle。',
            answer: 'oracle 是判断执行对错的机制；差分测试与蜕变测试',
            accept: ['差分测试', '蜕变测试', 'metamorphic', 'differential', 'oracle'],
            explain: 'oracle 问题指「难以判断输出是否正确」，它常是测试的真正瓶颈。差分测试用多个实现的输出对比代替正确答案；蜕变测试用输入变换与输出之间的必然关系（如 sin(π−x)=sin(x)）判断。两者都不需要人工写出每个输入的期望值。' }
        ] },

      /* ---------------------------------------------------------- Q10 */
      { no: 10, points: 16, type: 'comprehensive',
        intro: '综合题：把一个失败测试走完「定位 → 修复 → 验证」的链路。',
        code: 'int bsearch(int[] a, int key) {\n    int lo = 0, hi = a.length - 1;\n    while (lo < hi) {\n        int mid = (lo + hi) / 2;\n        if (a[mid] < key) lo = mid;\n        else              hi = mid;\n    }\n    return a[lo] == key ? lo : -1;\n}',
        codeTitle: '有缺陷的二分查找',
        parts: [
          { label: '(a)', points: 8, kind: 'output',
            prompt: '测试 bsearch([1,3,5], 5) 返回 -1。请指出缺陷位置与根因，并给出修复后的关键行。',
            answer: 'lo = mid 改为 lo = mid + 1；区间未排除已比较的 mid，导致死循环或漏查',
            accept: ['lo = mid + 1', 'mid + 1', '区间不收缩', '死循环'],
            explain: '当 a[mid] < key 时，mid 已比较过且不可能是答案，lo 应改为 mid + 1；写成 lo = mid 会让区间在 lo 与 hi 相邻时不再收缩，陷入死循环或提前退出后漏查。修复：lo = mid + 1（并检查 hi = mid 的对称边界）。' },
          { label: '(b)', points: 8, kind: 'keywords',
            prompt: '给出三层验证方案：分别验证失败用例、边界与全量行为；并说明如何防止「只对测试过拟合」。',
            answer: '失败用例转绿；边界用例（空数组、单元素、key 不存在）；穷举小数组或符号执行；留出测试/变异测试',
            accept: ['失败用例', '边界', '穷举', '符号执行', '留出测试', '变异测试', '回归'],
            explain: '第一层跑原失败用例确认转绿；第二层补边界：空数组、单元素、key 小于最小/大于最大、重复元素；第三层用穷举小数组或符号执行验证所有输入。防过拟合：生成补丁时留出一部分测试不参与，补丁在留出集上仍需通过；再用变异测试检查测试能否抓住「lo = mid」这类改动。' }
        ] }
    ]
  });
})();
