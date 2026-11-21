/* =====================================================================
 * quiz.js · CSC4120 分章题库
 * 结构：{ items:[{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options?, answer?, accept?, explain }] }
 * 题型：mcq / tf / fill / multi / predict
 * 覆盖：ch00–ch07，每章 7 题，共 56 题；每章 q1–q3 与正文内嵌题对应
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '下面哪一类问题最需要「算法设计与分析」而不是单纯的编程技巧来回答？',
        options: [
          { text: '把一段 Python 代码改写成 Java' },
          { text: '在给定时间与内存预算下，判断哪种调度方案能处理完所有任务', correct: true },
          { text: '为一个网页调整 CSS 让按钮居中' },
          { text: '给数据库表添加一个索引' }
        ],
        explain: '算法课关心的是「在资源约束下，问题的解能否被高效地求出，以及能求到多好」。判断调度方案是否可行、要花多少时间、有没有更快的做法，正是复杂度分析与算法设计的核心；改语言、调样式、加索引属于工程操作，不回答「可计算性」与「复杂度」层面的问题。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '渐进复杂度分析的主要目的是比较不同算法在 n 很大时的增长趋势，而不是精确预测某台机器上的运行毫秒数。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '渐进分析忽略常数因子与低阶项，只保留增长的量级，因此它跨机器、跨语言可比。预测具体毫秒数依赖硬件、编译器、缓存，属于性能工程；算法课要的是「n 翻倍时时间大概翻几倍」这类结构性结论。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '把问题划分成若干规模更小的同类子问题，分别递归求解，再把结果合并起来——这种算法设计范式叫 ______。',
        answer: '分治',
        accept: ['分治法', 'divide and conquer', 'divide-and-conquer'],
        explain: '分治的三步是「划分、递归求解、合并」，归并排序与最近点对都是典型例子。它与动态规划的区别在于子问题是否重叠：分治的子问题互不相交，动态规划的子问题会被反复用到。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '一个问题同时具有「最优子结构」和「重叠子问题」，最适合用哪种范式？',
        options: [
          { text: '分治' },
          { text: '动态规划', correct: true },
          { text: '贪心' },
          { text: '回溯' }
        ],
        explain: '最优子结构保证「大问题的最优解能由子问题的最优解拼出」，重叠子问题保证「缓存子问题的结果有收益」，两者同时成立正是动态规划的定义性特征。分治缺少重叠，贪心不保留多个候选，回溯不做缓存。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '只要每一步都选当前看起来最好的选项，贪心算法就一定得到全局最优解。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '贪心的正确性需要证明「每一步的选择都是安全的」，即存在一个包含该选择的最优解。0/1 背包按性价比贪心、硬币面值 {1,3,4} 找零都是反例。缺少交换论证或拟阵结构时，局部最优不等于全局最优。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-3', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '「算法分析」通常要回答下面哪些问题？（多选）',
        options: [
          { text: '算法是否对一切合法输入都给出正确答案', correct: true },
          { text: '算法在最好、最坏、平均情况下的时间与空间开销', correct: true },
          { text: '该问题的求解难度有没有下界，算法是否已经最优', correct: true },
          { text: '这段代码在某个 IDE 里能不能通过语法检查' }
        ],
        explain: '正确性、复杂度（三种情况）、最优性/下界是算法分析的三根支柱。语法检查是编译器的工作，与「问题有多难、算法有多快」无关。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '除作业、期中与期末之外，这门课通常还要求完成一个综合性的 ______，用来把多章内容串起来。',
        answer: '项目',
        accept: ['课程项目', 'project', '大作业'],
        explain: '课程项目要求把算法选型、复杂度分析、实现与实验报告结合起来，是检验「能否把课上的范式用到新问题上」的载体。它和笔试的区别在于没有标准答案，重点在论证与对比。'
      },

      /* ---------------- ch01 渐进分析与分治 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['complexity'],
        stem: '对 f(n) = 3n² + 2n + 1，下面哪个记号给出的界最准确？',
        options: [
          { text: 'f(n) = O(n)' },
          { text: 'f(n) = Θ(n²)', correct: true },
          { text: 'f(n) = Ω(n³)' },
          { text: 'f(n) = o(n)' }
        ],
        explain: '首项是 3n²，常数因子与低阶项在渐进意义下被忽略，所以 f(n) 与 n² 同阶，记 Θ(n²)。O(n) 是错误的上界（n² 增长更快），Ω(n³) 是错误的下界，o(n) 表示严格低阶，更不成立。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['complexity'],
        stem: 'O 记号给出的是运行时间的上界，Ω 记号给出的是下界。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'O(f) 表示「存在常数 c 与 n₀，使 n ≥ n₀ 时 T(n) ≤ c·f(n)」，是上界；Ω 把不等号反过来，是下界；Θ 同时成立，是同阶。说「算法是 O(n²)」只保证不会更慢，不保证真的那么慢。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'fill', difficulty: 2,
        tags: ['recurrence'],
        stem: '用主定理解 T(n) = 2T(n/2) + Θ(n)，得到 T(n) = ______。',
        answer: 'Θ(n log n)',
        accept: ['O(n log n)', 'n log n', 'Θ(nlogn)', 'O(nlogn)'],
        explain: '这里 a = 2、b = 2，n^(log_b a) = n¹ = n，与 f(n) = Θ(n) 同阶，属于主定理第二种情况，所以 T(n) = Θ(n log n)。这正是归并排序的递推式。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['recurrence'],
        stem: '对 T(n) = 2T(n/2) + Θ(n²)，主定理给出什么结果？',
        options: [
          { text: 'Θ(n²)', correct: true },
          { text: 'Θ(n log n)' },
          { text: 'Θ(n² log n)' },
          { text: '主定理不适用' }
        ],
        explain: 'a = 2、b = 2 时 n^(log_b a) = n，而 f(n) = Θ(n²) 比 n 高一个多项式因子，属于第三种情况；再检查正则条件 2·(n/2)² ≤ c·n²（取 c = 1/2 即成立），所以 T(n) = Θ(n²)。直观上合并的代价压倒了递归。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'tf', difficulty: 2,
        tags: ['divide-conquer'],
        stem: '最近点对的分治算法在合并阶段，只需检查跨中线、且纵坐标差小于当前最小距离的常数个点，因此合并是线性的。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '合并时把带内的点按 y 排序，每个点只需与后面最多 7 个点比较——因为一个 δ×2δ 的矩形内最多放 8 个互相距离 ≥ δ 的点。所以合并 O(n)，总递推 T(n) = 2T(n/2) + O(n) = O(n log n)。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['selection'],
        stem: '关于快速选择（quickselect）与 median of medians，下面哪句正确？',
        options: [
          { text: '两者最坏都是 O(n log n)' },
          { text: '快速选择期望 O(n)、最坏 O(n²)；median of medians 最坏 O(n)', correct: true },
          { text: '快速选择最坏 O(n)；median of medians 期望 O(n²)' },
          { text: '两者都依赖输入已排序' }
        ],
        explain: '快速选择随机选 pivot，期望每次把问题规模缩到一半，总期望 O(n)；但 pivot 总选到极端值时退化成 O(n²)。median of medians 用「五元组取中位数的中位数」保证 pivot 落在 30%–70% 之间，最坏也是 O(n)，代价是常数大。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-8', tier: 2, type: 'fill', difficulty: 2,
        tags: ['fft'],
        stem: 'FFT 把两个 n 次多项式的乘法从朴素 O(n²) 降到 ______。',
        answer: 'O(n log n)',
        accept: ['Θ(n log n)', 'nlogn', 'O(nlogn)'],
        explain: 'FFT 在 O(n log n) 内完成「系数表示 → 点值表示」，点值下乘法是 O(n) 的逐点相乘，再用逆 FFT 变回系数。三步合起来 O(n log n)，这也是大整数乘法与信号处理的基础。'
      },

      /* ---------------- ch02 排序下界、堆与平衡树 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['sorting'],
        stem: '比较排序 Ω(n log n) 下界的证明，核心依据是什么？',
        options: [
          { text: '每次比较最多排除一个元素' },
          { text: '决策树至少有 n! 个叶子，所以高度至少 log₂(n!)', correct: true },
          { text: '归并排序已经是 O(n log n)' },
          { text: '随机化算法无法突破下界' }
        ],
        explain: 'n 个元素有 n! 种排列，每种都必须对应一个叶子，否则算法会把两种排列混为一谈。二叉树叶子数 L 与高度 h 满足 L ≤ 2^h，所以 h ≥ log₂(n!)，再用 Stirling 公式得 Ω(n log n)。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['sorting'],
        stem: '计数排序是稳定排序，这一点是基数排序能够正确工作的前提。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '基数排序从低位到高位，每一轮都依赖上一轮的结果保持相对顺序。若某轮不稳定，低位已排好的顺序会被打乱，最终结果错误。计数排序「从后往前填输出数组」正是为了保持稳定性。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'fill', difficulty: 2,
        tags: ['heap'],
        stem: '自底向上建堆（从最后一个非叶节点往前逐个下沉）的时间复杂度是 ______。',
        answer: 'O(n)',
        accept: ['Θ(n)', '线性', 'O(n) 线性'],
        explain: '高度为 h 的节点最多 n/2^(h+1) 个，每个下沉 O(h)，求和 Σ h·n/2^(h+1) = O(n)，几何级数收敛。逐个插入建堆才是 O(n log n)，两者常被混淆。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['tree'],
        stem: 'AVL 树中，新节点插入到「左孩子的右子树」导致失衡（LR 型），应如何旋转？',
        options: [
          { text: '对失衡节点右旋一次' },
          { text: '对失衡节点左旋一次' },
          { text: '先对左孩子左旋，再对失衡节点右旋', correct: true },
          { text: '先对左孩子右旋，再对失衡节点左旋' }
        ],
        explain: 'LR 型是「异向」，单旋无法修复：先把左孩子左旋，把它变成 LL 型，再对失衡节点右旋。判断口诀是「从失衡节点往下走两步，同向单旋、异向双旋」。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'tf', difficulty: 2,
        tags: ['tree'],
        stem: '朴素二叉搜索树的查找最坏情况是 O(log n)。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '朴素 BST 没有平衡保证。若按升序插入 1..n，树退化成一条链，查找变成 O(n)。只有在「树大致平衡」或「随机插入」时才是期望 O(log n)。这正是 AVL、红黑树存在的理由。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['tree'],
        stem: '区间树的每个节点除了存区间本身，还必须额外维护什么？',
        options: [
          { text: '子树中所有左端点的最小值' },
          { text: '子树中所有右端点的最大值', correct: true },
          { text: '子树的大小' },
          { text: '节点的深度' }
        ],
        explain: '查询时用它剪枝：若左子树的 max 右端点小于查询左端点，左子树不可能有重叠，整棵跳过。这样每次最多走两条路径，查询代价 O(log n + k)。漏更新这个值是最常见的实现 bug。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-8', tier: 2, type: 'fill', difficulty: 2,
        tags: ['tree'],
        stem: 'van Emde Boas 树的所有操作复杂度是 O(log log u)，其中 u 表示 ______。',
        answer: '键的宇宙大小',
        accept: ['宇宙大小', '键的取值范围', 'universe 大小', '键值域大小'],
        explain: 'u 是键可能取值的个数（键取自 {0,…,u−1}）。结构把 u 位宇宙递归分成 √u 个簇，递推 T(u) = T(√u) + O(1)，解得 O(log log u)。u 越大优势越明显，但空间也是 O(u)。'
      },

      /* ---------------- ch03 散列与摊销 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['hashing'],
        stem: '链接法散列表中，装载因子 α = n/m = 2 时，一次不成功查找的期望代价是多少？',
        options: [
          { text: 'Θ(1)' },
          { text: 'Θ(1 + α) = Θ(3)', correct: true },
          { text: 'Θ(log n)' },
          { text: 'Θ(n²)' }
        ],
        explain: '不成功查找要遍历整条链，链的期望长度是 α，加上算散列值的常数开销，总期望 Θ(1 + α)。α 为常数时就是 Θ(1)，与 n 无关——这是「平均 O(1)」的准确表述。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['hashing'],
        stem: '开放寻址散列表中，删除元素时可以直接把该槽置为空。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '直接置空会切断后续的探测链：本来放在更后面、靠这条链才能找到的元素会查找失败。正确做法是放「墓碑」标记，查找时跳过、插入时可复用；墓碑过多时还要重建整张表。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'fill', difficulty: 2,
        tags: ['amortized'],
        stem: '动态表每次容量翻倍，连续 n 次插入的总代价是 Θ(n)，所以每次插入的摊销代价是 ______。',
        answer: 'O(1)',
        accept: ['Θ(1)', '常数', '常数时间'],
        explain: '扩容发生在 1、2、4、…、2^k 次插入时，搬移总代价 1+2+…+n < 2n，加上 n 次普通插入仍是 Θ(n)，除以 n 得 O(1)。关键是扩容代价按几何级数增长，而不是每次只加一个槽。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['hashing'],
        stem: '全域散列（universal hashing）主要解决什么问题？',
        options: [
          { text: '让散列函数计算得更快' },
          { text: '消除对手针对固定散列函数构造最坏输入的可能', correct: true },
          { text: '让散列表支持范围查询' },
          { text: '减少散列表的内存占用' }
        ],
        explain: '全域散列从一个函数族中随机选 h，使任意两个键冲突的概率 ≤ 1/m。期望界因此是对「随机选函数」取的，不依赖输入分布，对手即便知道函数族也无法预构造全冲突的键集。代价是需要随机种子与额外常数。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['hashing'],
        stem: '线性探测会产生「一次聚集」：连续被占用的槽越长，越容易被继续占用。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '线性探测的探测序列是连续的，一个长块的两端都更容易被新元素命中，块越长增长越快，平均探测次数随装载因子急剧上升。二次探测与双重散列就是为了打散这种聚集。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['bloom'],
        stem: '关于 Bloom 过滤器，下面哪些说法正确？（多选）',
        options: [
          { text: '查询「不在」时可能误判为「在」（假阳性）', correct: true },
          { text: '查询「在」时一定不会漏判（无假阴性）', correct: true },
          { text: '标准 Bloom 过滤器不能安全地删除元素', correct: true },
          { text: '它的误判率随元素增多而下降' }
        ],
        explain: '插入只置位、不区分是谁置的，所以不在的元素可能撞上别人的位（假阳性）；在的元素所有位必然被置过，不会漏（无假阴性）。删除会把共享位清零，破坏其他元素，需用计数版。元素越多位越满，误判率上升而非下降。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'fill', difficulty: 2,
        tags: ['hashing'],
        stem: '完美散列的两级结构中，第一级把 n 个键分到 n 个槽，第二级为每个槽建大小为 n_j² 的表，总空间是 ______。',
        answer: 'O(n)',
        accept: ['Θ(n)', '线性空间', 'O(n) 线性'],
        explain: 'E[Σ n_j²] = n + n(n−1)/m，取 m = n 时为 O(n)。第二级表虽大，但只有少数槽会落多个键，期望总空间仍是线性。查找是两次散列、两次数组访问，最坏 O(1)。'
      },

      /* ---------------- ch04 图搜索与最短路 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['graph'],
        stem: 'BFS 能给出「最短路径」，前提是什么？',
        options: [
          { text: '图必须是连通的' },
          { text: '所有边的权值相等（或图无权）', correct: true },
          { text: '图必须是有向无环图' },
          { text: '必须先用 Dijkstra 预处理' }
        ],
        explain: 'BFS 按「边数」分层，只有边权全相等时「边数最少」才等于「代价最小」。边权不等时应改用 Dijkstra；有负权则用 Bellman-Ford。连通性只影响能否到达，不影响最短性。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['graph'],
        stem: '对 DAG 做 DFS，按完成时间从大到小排列，就得到一个拓扑序。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '对任意边 u→v，DAG 中不可能出现 v 是 u 的祖先（否则成环），所以要么 v 先完成（逆序时 v 在 u 前），要么 v 是 u 的后代、u 后完成（逆序时 u 在前），两种都满足「u 在 v 前」。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['shortest-path'],
        stem: '用二叉堆实现优先队列时，Dijkstra 算法的时间复杂度是 ______。',
        answer: 'O((V+E) log V)',
        accept: ['O((V+E)logV)', 'O((E+V) log V)', '(V+E)logV', 'O(E log V)'],
        explain: '每条边最多触发一次松弛、每次压堆 O(log V)，共 O(E log V)；每个点取出一次，共 O(V log V)。合计 O((V+E) log V)。用 Fibonacci 堆可降到 O(E + V log V)。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['shortest-path'],
        stem: '如何检测一个带权有向图中是否存在负权环？',
        options: [
          { text: '跑一遍 BFS，看是否有环' },
          { text: '跑 Bellman-Ford，若第 V 轮仍有边能被松弛，则存在负环', correct: true },
          { text: '跑 Dijkstra，若某点被更新超过 V 次' },
          { text: '求所有点的度数，看是否有自环' }
        ],
        explain: '任何简单最短路径最多 V−1 条边，所以 V−1 轮后所有最短路都已确定。若第 V 轮还能松弛，说明存在一条「绕一圈更短」的路径，即负环。Dijkstra 本身不能处理负边，更无法检测负环。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'tf', difficulty: 2,
        tags: ['graph'],
        stem: '在 DAG 上求最长路径可以在 O(V+E) 时间内完成。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'DAG 无环，不存在「绕圈无限增长」的问题；按拓扑序扫一遍、把松弛改成取 max，每条边只处理一次，总 O(V+E)。一般图的最长路径因含环而 NP 难，差别来自环而不是「长」。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-8', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['astar'],
        stem: 'A* 算法中的启发函数 h 满足「可采纳性」（admissible），指的是什么？',
        options: [
          { text: 'h 必须等于真实剩余距离' },
          { text: 'h 从不高估从当前点到终点的真实代价', correct: true },
          { text: 'h 必须随深度单调递增' },
          { text: 'h 必须是常数' }
        ],
        explain: '可采纳性要求 h(v) ≤ 真实剩余距离，保证不会因为高估而提前排除最优路径，从而 A* 返回最优解。h ≡ 0 时退化成 Dijkstra；h 恰好等于真实距离时只扩展最短路上的点。单调性（一致性）是更强的条件。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'fill', difficulty: 2,
        tags: ['graph'],
        stem: 'Kosaraju 算法第一遍在原图上按完成时间排序，第二遍在 ______ 图上按完成时间从大到小做 DFS，每棵树是一个强连通分量。',
        answer: '转置（反向）',
        accept: ['转置', '反向', 'transpose', '逆图'],
        explain: '第二遍必须把边全部反向：这样从「源 SCC」出发只能走回自己所在的 SCC，不会串到别的分量。Tarjan 算法则用 dfn/low 一遍完成，不需要转置图。'
      },

      /* ---------------- ch05 贪心 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['greedy'],
        stem: '要从一组区间中选出最多互不重叠的区间，应按什么排序后贪心？',
        options: [
          { text: '按开始时间升序' },
          { text: '按结束时间升序', correct: true },
          { text: '按区间长度降序' },
          { text: '按开始时间降序' }
        ],
        explain: '结束越早，留给后面区间的空间越大。按开始时间排的反例：[0,100]、[1,2]、[3,4] 会先选长区间，只得到 1 个；按结束时间能得到 2 个。交换论证可以证明这个贪心每一步都安全。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'tf', difficulty: 2,
        tags: ['mst'],
        stem: 'MST 的割性质说：对任意割，横跨该割的权值最小的边一定属于某个最小生成树。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '若 MST 不含这条最小跨割边 e，把 e 加入会成环，环上必有另一条跨割边 e′，且 w(e) ≤ w(e′)；用 e 换 e′ 得到另一棵 MST。这就是 Prim 每步选最小跨割边的正确性依据。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['union-find'],
        stem: '并查集同时使用路径压缩与按秩合并后，单次操作的摊销复杂度是 ______。',
        answer: 'O(α(n))',
        accept: ['α(n)', '反阿克曼函数', 'O(alpha(n))', '近似 O(1)'],
        explain: 'α 是反阿克曼函数，在 n < 10^600 时不超过 4，实际就是常数。只用一个优化是 O(log n)，两个一起才降到 α(n)——这是「近似 O(1)」最著名的例子。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['mst'],
        stem: 'Kruskal 算法判断「加入一条边是否会成环」时，用什么数据结构？',
        options: [
          { text: '优先队列' },
          { text: '并查集', correct: true },
          { text: '线段树' },
          { text: '栈' }
        ],
        explain: 'Kruskal 按边权升序尝试加边，只需判断两端是否已在同一连通分量，这正是并查集的 find。若 find(u) == find(v) 则成环、跳过；否则 union 后加入。总代价 O(E log E + E α(V))。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-7', tier: 1, type: 'tf', difficulty: 2,
        tags: ['greedy'],
        stem: '0/1 背包问题可以按「单位重量价值」从高到低贪心选取，得到最优解。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '反例：容量 10，A（重 6，值 30）、B（重 5，值 25）、C（重 5，值 25）。A 性价比最高，选 A 后装不下 B/C，总价值 30；最优是 B+C = 50。可分割的分数背包才能这样贪心。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['huffman'],
        stem: 'Huffman 编码每次从待合并集合中取出哪两个节点合并？',
        options: [
          { text: '频率最大的两个' },
          { text: '频率最小的两个', correct: true },
          { text: '深度最大的两个' },
          { text: '任意两个' }
        ],
        explain: '频率小的字符应该离根更远（码字更长），所以先把它们合并到树的深处。交换论证保证：最优树中频率最小的两个字符一定在最深层且互为兄弟，因此合并它们不会破坏最优性。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'fill', difficulty: 2,
        tags: ['matroid'],
        stem: '拟阵的两条公理是遗传性与 ______，它们保证按权值贪心能得到最大权独立集。',
        answer: '交换性',
        accept: ['交换性质', 'exchange property', 'exchange'],
        explain: '交换性：若两个独立集 A、B 满足 |A| < |B|，则存在 x ∈ B−A 使 A∪{x} 仍独立。它保证贪心加入不会「堵死」更优的组合。MST 正是图拟阵上的贪心，所以 Prim/Kruskal 正确。'
      },

      /* ---------------- ch06 动态规划 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['dp'],
        stem: '给朴素递归的斐波那契加上记忆化之后，时间复杂度变成多少？',
        options: [
          { text: 'O(φⁿ)，没有变化' },
          { text: 'O(n)', correct: true },
          { text: 'O(n log n)' },
          { text: 'O(n²)' }
        ],
        explain: '朴素递归反复计算同一个 F(k)，代价指数级；记忆化让每个 F(k) 只算一次，共 n 个状态、每次 O(1) 转移，总 O(n)。这就是「用空间换时间」最纯粹的形态。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['dp'],
        stem: '归并排序是动态规划，因为它也把问题拆成子问题递归求解。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '归并排序的子问题互不重叠（每个子数组只出现一次），不需要缓存，属于分治。动态规划要求「最优子结构 + 重叠子问题」同时成立；有子结构但无重叠时，分治更合适。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['dp'],
        stem: '0/1 背包压成一维数组后，枚举容量时必须 ______ 枚举，否则同一物品会被重复选取。',
        answer: '逆序',
        accept: ['从大到小', '倒序', '递减'],
        explain: '正序时 dp[j−w] 可能已被本轮更新过，相当于允许同一物品再选一次，退化成完全背包。逆序保证 dp[j−w] 仍是上一轮的值，即「每件最多选一次」。完全背包则恰好要正序。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['dp'],
        stem: '矩阵链乘法 DP 的循环，最外层应该是什么？',
        options: [
          { text: '左端点 i' },
          { text: '右端点 j' },
          { text: '区间长度 len', correct: true },
          { text: '分割点 k' }
        ],
        explain: 'dp[i][j] 依赖比它短的区间（dp[i][k] 与 dp[k+1][j]），只有按长度从小到大计算，才能保证依赖已算好。最外层写 i 或 j 都会在长区间依赖短区间时取到未初始化的值。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'tf', difficulty: 2,
        tags: ['dp'],
        stem: '编辑距离的二维 DP 表可以压缩到 O(min(m,n)) 的空间，但压缩后无法直接回溯出具体的编辑操作。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '每行只依赖上一行，所以保留两行即可算长度；但回溯需要知道每个格子的来源方向，压缩后历史被覆盖。要方案就得存完整表，或用 Hirschberg 分治在 O(min(m,n)) 空间内重建。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-7', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['dp'],
        stem: '用状压 DP 解 TSP（n 个城市），时间复杂度是多少？',
        options: [
          { text: 'O(n²)' },
          { text: 'O(2ⁿ·n²)', correct: true },
          { text: 'O(n!)' },
          { text: 'O(n³)' }
        ],
        explain: '状态是 (已访问集合 S, 当前城市 i)，共 2ⁿ·n 个；每个状态枚举下一个城市，转移 O(n)，总计 O(2ⁿ·n²)。这是精确算法里最快的一类，但 n > 25 就不可行，所以大规模 TSP 只能用近似。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-8', tier: 3, type: 'fill', difficulty: 3,
        tags: ['mdp'],
        stem: 'MDP 的 Bellman 方程中，γ ∈ [0,1) 称为 ______，它保证值迭代是压缩映射从而收敛。',
        answer: '折扣因子',
        accept: ['折扣率', 'discount factor', 'discount'],
        explain: 'γ 让未来奖励按几何级数衰减，使无限期回报的总和有界。数学上带 γ 的 Bellman 算子是压缩映射（模 γ），由 Banach 不动点定理，值迭代必收敛到唯一不动点。γ = 1 且无终止时可能发散。'
      },

      /* ---------------- ch07 网络流、NP 完全性与近似 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['flow'],
        stem: '最大流最小割定理说的是什么？',
        options: [
          { text: '最大流的值等于最小割的容量', correct: true },
          { text: '最大流的值等于所有边容量之和' },
          { text: '最小割的容量等于图中最短路径长度' },
          { text: '最大流与最小割一般不相等，只有二分图才相等' }
        ],
        explain: '对任意流 f 与割 (S,T)，|f| = f(S,T) ≤ c(S,T)，所以 max flow ≤ min cut；反过来，最大流的残量网络里 s 到不了 t，把可达点集作为 S，跨割边全部饱和，得 |f| = c(S,T)。两个方向合起来即等号。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['flow'],
        stem: 'Edmonds-Karp 算法用 DFS 找增广路径，因此复杂度与容量无关。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'Edmonds-Karp 用 BFS 找边数最少的增广路径，正是这一点带来 O(VE²) 的与容量无关的界。用 DFS 的是 Ford-Fulkerson，其复杂度 O(C·E) 依赖容量，无理容量时甚至可能不终止。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'fill', difficulty: 2,
        tags: ['matching'],
        stem: 'König 定理指出：二分图中最大匹配数等于最小 ______ 数。',
        answer: '顶点覆盖',
        accept: ['点覆盖', 'vertex cover', '顶点覆盖'],
        explain: '最大匹配与最小顶点覆盖是二分图上的对偶问题，数量相等。它把「选边」与「选点」连起来，也是把一般图顶点覆盖（NP 难）与二分图匹配（多项式）区分开的关键。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['np'],
        stem: '一个判定问题被称为「NP 完全」，需要同时满足什么？',
        options: [
          { text: '它属于 NP，且所有 NP 问题都能多项式归约到它', correct: true },
          { text: '它不属于 P，且没有多项式算法' },
          { text: '它的解可以在指数时间内验证' },
          { text: '它能归约到某个 P 问题' }
        ],
        explain: 'NP 完全 = NP ∩ NP 难。第一项要求「解容易验证」（∈ NP），第二项要求「它是 NP 里最难的之一」（所有 NP 问题 ≤p 它）。只证其中一项都不够。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'tf', difficulty: 2,
        tags: ['np'],
        stem: '若 A ≤p B（A 多项式归约到 B），则 B 至少和 A 一样难。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'A ≤p B 意味着「有 B 的算法就能解 A」，所以 B 的能力不弱于 A。用它证 NP 难时，必须把已知 NP 难问题归约到新问题（A 难 → B 难），方向反了就只证明了「A 能解 B」。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-8', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['approx'],
        stem: '顶点覆盖的 2-近似算法，其正确性下界来自什么？',
        options: [
          { text: '图的边数' },
          { text: '一个极大匹配的大小', correct: true },
          { text: '图的最大度数' },
          { text: 'Dijkstra 的最短路' }
        ],
        explain: '极大匹配的边互不共享端点，任何顶点覆盖都必须为每条匹配边至少选一个端点，所以 OPT ≥ 匹配数；算法把匹配边两端都选上，解 = 2×匹配数 ≤ 2·OPT。这个界是紧的，完全二分图能达到。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-8', tier: 3, type: 'fill', difficulty: 3,
        tags: ['approx'],
        stem: 'Christofides 算法对度量 TSP 的近似比是 ______。',
        answer: '1.5',
        accept: ['3/2', '1.5 倍', '1.5-近似'],
        explain: '长度为 MST + 奇数点最小完美匹配 ≤ OPT + OPT/2 = 1.5·OPT。匹配 ≤ OPT/2 的理由是：最优巡回删掉匹配边后剩下两条路径，各是奇数点集上的匹配，取短的那条即得。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
