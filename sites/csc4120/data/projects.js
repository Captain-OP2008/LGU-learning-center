/* =====================================================================
 * projects.js · 实战项目（CSC.registerProjects）
 * 结构：{ id, title, en, tagline, level, minutes, chapters, goals, intro,
 *         milestones:[{ n, title, tasks, starter, hints, solution }] }
 * 三个项目由易到难，分别落在排序/选择、图与最短路、网络流与调度上。
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerProjects([

    /* ================================================================ */
    {
      id: 'proj-sorting-lab',
      title: '排序与选择实验台',
      en: 'Sorting & Selection Lab',
      tagline: '亲手数一数比较次数，看 n log n 下界如何出现',
      level: '入门',
      minutes: 180,
      chapters: ['ch01', 'ch02'],
      goals: [
        '实现归并排序、快速排序、堆排序与计数排序，统一接口',
        '用计数器统计比较次数与交换次数，绘制 n 与 n log n 的对照曲线',
        '实现 quickselect 与 median of medians，比较最坏情况',
        '用实验数据解释：为什么比较排序不可能突破 Ω(n log n)'
      ],
      intro: '这一章的理论都在讲「代价」：归并排序 Θ(n log n)、建堆 O(n)、选择问题最坏 O(n)。' +
        '本项目把这些结论变成可测量的实验：同一组输入喂给不同算法，统计比较次数，' +
        '再和理论曲线对照。你会看到随机快排的平均表现、计数排序在窄值域上的碾压，' +
        '以及 median of medians 用常数倍时间换来的最坏情况保证。',

      milestones: [
        {
          n: 1,
          title: '四种排序的统一实现与计数器',
          tasks: [
            '定义 sort(arr, key) 风格的四套实现：merge_sort、quick_sort（随机 pivot）、heap_sort、counting_sort。',
            '在比较处插入计数器 cmp，在赋值处插入计数器 mov，返回 (结果, cmp, mov) 三元组。',
            '生成 n = 10³、10⁴、10⁵ 的随机整数、升序、降序、全相等四类输入，各跑 5 次取中位数。',
            '把 (n, cmp) 记录成 CSV，用任意绘图工具画出散点，并与 n log₂n 参考线对比。'
          ],
          starter: [
            'def merge_sort(a):',
            '    # 返回 (sorted_list, cmp_count, move_count)',
            '    ...',
            '',
            'def quick_sort(a):',
            '    # 随机选 pivot，原地或复制均可',
            '    ...',
            '',
            'def heap_sort(a):',
            '    # 先 build_heap 再反复 extract_min',
            '    ...',
            '',
            'def counting_sort(a, k):',
            '    # 值域 0..k-1',
            '    ...'
          ].join('\n'),
          hints: [
            '计数排序的计数器要单独算：它不做元素间比较，cmp 恒为 0，比较的是「访问数组次数」。',
            '升序输入对归并排序几乎没影响，但对固定选首元素为 pivot 的快排是灾难——这正是要随机化的原因。',
            '全相等输入会让朴素二路快排退化成 O(n²)，可以用三路划分或随机 pivot 缓解。'
          ],
          solution: '关键是把「比较」抽象成一个函数调用而不是 Python 的 <，否则内建排序会绕过计数。' +
            '实验结论应显示：归并排序的比较次数稳定在 n log₂n 附近（约 1.0–1.1 倍）；' +
            '随机快排平均约 1.39 n log₂n；堆排序约 2 n log₂n；计数排序与 n 成正比。' +
            '四类输入中，快排在已排序输入上若不随机化会出现平方级比较。'
        },
        {
          n: 2,
          title: '选择问题：quickselect 与 median of medians',
          tasks: [
            '实现 quickselect(a, k)：随机 pivot 分区，只递归包含第 k 小元素的一侧。',
            '实现 median of medians：每 5 个一组取中位数，递归求中位数的中位数作 pivot，保证最坏 O(n)。',
            '构造能击穿随机 quickselect 的输入（如 adversarial 序列），对比两种算法的最坏比较次数。',
            '统计 k 取 1、n/4、n/2、3n/4 时的比较次数，解释为什么 k 的位置影响常数。'
          ],
          starter: [
            'def quickselect(a, k):',
            '    # 返回第 k 小（1-based）',
            '    ...',
            '',
            'def median_of_medians(a, k):',
            '    # 每 5 个一组，取中位数，再递归选 pivot',
            '    ...'
          ].join('\n'),
          hints: [
            'randomized quickselect 的期望比较次数约 3.4n，但最坏仍是 O(n²)；median of medians 的最坏是 20n 量级。',
            '实现 median of medians 时，小组内排序可以直接用插入排序，规模小不影响渐进界。',
            '「击穿」随机化的方法是构造输入使每次 pivot 都落在极端位置——需要知道随机种子，实际中难以做到，这正是随机化的价值。'
          ],
          solution: '两种算法的对比应落在「期望 vs 最坏」：随机 quickselect 在随机输入上更快（常数小），' +
            'median of medians 慢但最坏线性。工程上常用「随机化 + 小规模转插入排序 + 三路划分」的组合。' +
            '若实验只能观察到随机 quickselect 的平方级退化，说明构造的输入确实让 pivot 反复取到极端值。'
        },
        {
          n: 3,
          title: '写一份实验报告',
          tasks: [
            '用一页纸总结四类排序在四类输入上的比较次数与运行时间。',
            '画出「比较次数 / (n log₂n)」的比值随 n 变化的曲线，说明它趋于常数。',
            '解释决策树下界：为什么 n! 个叶子推出至少 log₂(n!) = Ω(n log n)。',
            '给出一个「比较排序不可能更快」的边界讨论，并说明计数排序为何绕过了它。'
          ],
          starter: '# 报告模板\n## 1. 实验设置\n## 2. 结果表\n## 3. 曲线与解释\n## 4. 下界讨论\n## 5. 结论',
          hints: [
            '比值曲线要收敛，样本点至少取 6–8 个 n，并在每个 n 上重复实验取中位数。',
            'log₂(n!) 用 Stirling 近似约 n log₂n − 1.44n，所以下界前面的常数是 1。',
            '计数排序绕过下界的方式是「不做比较」，把代价转移到值域大小 k 上。'
          ],
          solution: '合格报告应包含：可复现的实验脚本、原始数据表、至少两张图、' +
            '对「归并排序接近下界、快排常数更大、堆排更大」的定量解释，' +
            '以及对「下界只约束比较模型」的清楚说明。'
        }
      ]
    },

    /* ================================================================ */
    {
      id: 'proj-route-planner',
      title: '校园导航：最短路与启发式搜索',
      en: 'Campus Route Planner',
      tagline: '从 BFS 到 A*，给一张真实地图装上大脑',
      level: '进阶',
      minutes: 240,
      chapters: ['ch04'],
      goals: [
        '把校园地图抽象成带权有向图，支持邻接表与邻接矩阵两种表示',
        '实现 BFS、DFS、拓扑排序、Dijkstra、Bellman-Ford 与 A*',
        '处理负权边与负环检测，解释各算法的适用边界',
        '在真实规模图上测量运行时间，验证理论复杂度'
      ],
      intro: '本项目的输入是一张校园地图：路口是顶点，道路是带权边（步行时间），' +
        '部分道路单行、部分有坡度导致「下坡快上坡慢」，因此边权不对称甚至可以为负。' +
        '你要在同一张图上实现五种算法，回答不同的问题：最少经过几个路口、最短时间、' +
        '是否存在负环、带启发式的 A* 能省多少扩展节点。',

      milestones: [
        {
          n: 1,
          title: '图表示与基础遍历',
          tasks: [
            '设计 Graph 类：add_edge(u, v, w)、neighbors(u)，内部用邻接表；另提供 to_matrix()。',
            '实现 BFS，返回从源点到各点的边数距离与一棵 BFS 树。',
            '实现 DFS 与拓扑排序（Kahn 入度法），在含环的图上报告环。',
            '构造一张 20 个顶点的小图，手工验证 BFS 距离与拓扑序。'
          ],
          starter: [
            'class Graph:',
            '    def __init__(self, n):',
            '        self.n = n',
            '        self.adj = [[] for _ in range(n)]',
            '',
            '    def add_edge(self, u, v, w=1):',
            '        self.adj[u].append((v, w))',
            '',
            '    def bfs(self, s):',
            '        ...',
            '',
            '    def topo_sort(self):',
            '        ...'
          ].join('\n'),
          hints: [
            'BFS 的 dist 数组初始化为 −1 或 ∞，入队时置值；不要出队时才置，否则会重复入队。',
            '拓扑排序的环检测：若输出顶点数小于 n，剩下的顶点就在环上。',
            '边权为 1 时 BFS 就是最短路；这是「无权图最短路」的专门结论。'
          ],
          solution: '基础遍历的正确性靠「访问标记」保证：每个顶点至多入队/入栈一次，总代价 O(V+E)。' +
            '拓扑排序只对 DAG 有定义；Kahn 法同时给出环检测。' +
            '小图手工验证应确认 BFS 距离是最少边数而不是最少时间。'
        },
        {
          n: 2,
          title: 'Dijkstra、Bellman-Ford 与 A*',
          tasks: [
            '用二叉堆实现 Dijkstra，返回 dist 与 prev，并能重建路径。',
            '实现 Bellman-Ford：|V|−1 轮松弛，第 |V| 轮若仍可松弛则报告负环。',
            '实现 A*：给定 admissible 的启发式（如直线距离 / 最大速度），比较扩展节点数。',
            '在含负权边的图上验证 Dijkstra 出错、Bellman-Ford 正确，并说明原因。'
          ],
          starter: [
            'import heapq',
            '',
            'def dijkstra(g, s):',
            '    dist = [float("inf")] * g.n',
            '    dist[s] = 0',
            '    pq = [(0, s)]',
            '    while pq:',
            '        d, u = heapq.heappop(pq)',
            '        if d > dist[u]:',
            '            continue',
            '        # 在这里对 u 的每条出边做松弛',
            '    return dist',
            '',
            'def bellman_ford(g, s):',
            '    ...',
            '',
            'def astar(g, s, t, h):',
            '    ...'
          ].join('\n'),
          hints: [
            'Dijkstra 的「if d > dist[u]: continue」是惰性删除，缺了它复杂度会退化。',
            'Bellman-Ford 第 |V| 轮还能松弛 ⇔ 存在从源点可达的负环；不可达的负环不影响结果。',
            'A* 的启发式必须满足 h(u) ≤ 真实代价(u→t) 才保证最优；h 越接近真实值，扩展节点越少。'
          ],
          solution: 'Dijkstra 的正确性依赖非负权：每次取出最小 dist 的顶点后，它不会被更短路径改进。' +
            '负权边会破坏这个不变量，所以要用 Bellman-Ford（O(VE)）。' +
            'A* 在网格地图上通常能比 Dijkstra 少扩展 5–10 倍节点；若 h 不可采纳（overestimate），' +
            '可能返回次优路径。'
        },
        {
          n: 3,
          title: '性能对比与结论',
          tasks: [
            '生成 10³、10⁴、10⁵ 个顶点的随机图（平均度 4–8），测量各算法运行时间。',
            '画出时间随 V 增长的曲线，与 O(V+E)、O((V+E) log V)、O(VE) 对照。',
            '构造稀疏图与稠密图各一组，说明为什么稠密图上 Dijkstra 用数组实现反而更快。',
            '给出「什么场景选什么算法」的一页决策表。'
          ],
          starter: '# 决策表模板\n| 场景 | 建议算法 | 复杂度 | 理由 |\n|---|---|---|---|\n| 无权图 | BFS | O(V+E) | 边数即代价 |\n| 非负权 | Dijkstra | O((V+E)logV) | 贪心+堆 |\n| 负权 | Bellman-Ford | O(VE) | 允许负边 |\n| 有启发式 | A* | 取决于 h | 减少扩展 |',
          hints: [
            '随机图要保证连通性，否则 dist 里有大量 ∞，影响平均运行时间。',
            'Dijkstra 用数组实现是 O(V²)，稠密图 E≈V² 时优于堆实现的 O(E log V)。',
            'Bellman-Ford 在 V=10⁵ 时基本不可用（10¹⁰ 级操作），这正是需要 SPFA/Johnson 等改进的原因。'
          ],
          solution: '决策表应覆盖：无权/非负/负权/有启发式/全源最短路（Floyd-Warshall O(V³) 或 Johnson）。' +
            '性能曲线应显示 BFS 与 E 成正比、Dijkstra 比 BFS 多一个 log 因子、Bellman-Ford 明显更陡。'
        }
      ]
    },

    /* ================================================================ */
    {
      id: 'proj-flow-scheduler',
      title: '排期、匹配与最大流',
      en: 'Flow, Matching & Scheduling',
      tagline: '用一张流网络解决课程项目分配与工期压缩',
      level: '挑战',
      minutes: 300,
      chapters: ['ch04', 'ch05', 'ch06', 'ch07'],
      goals: [
        '实现 Ford-Fulkerson、Edmonds-Karp 与 Dinic，比较三者行为',
        '用最大流建模二分图匹配，验证 König 定理',
        '用拓扑排序 + DAG 最长路做项目排期，找关键路径',
        '对 NP 难的并行机调度实现 LPT 近似并分析近似比'
      ],
      intro: '最后一个项目把整门课串起来：课程项目有任务、依赖、人员和机器，' +
        '你要回答「最多能同时安排多少个项目」「最少需要几周」「哪些任务在关键路径上」。' +
        '前两问是流与匹配，第三问是 DAG 上的 DP，最后一问是 NP 难问题的近似。' +
        '这是最接近真实工程的一题，也是期末综合题的放大版。',

      milestones: [
        {
          n: 1,
          title: '最大流三件套',
          tasks: [
            '实现残量网络与 augment 操作，先用 DFS 版 Ford-Fulkerson。',
            '改成 Edmonds-Karp（BFS 找最短增广路），对比同一张图上的增广次数。',
            '实现 Dinic（分层图 + 当前弧优化），在 10³ 顶点、10⁴ 边的图上测时间。',
            '构造一个 Ford-Fulkerson 会退化的图（容量为 1 与 10⁹ 的边交替），展示增广次数差异。'
          ],
          starter: [
            'class MaxFlow:',
            '    def __init__(self, n):',
            '        self.n = n',
            '        self.to = []',
            '        self.cap = []',
            '        self.g = [[] for _ in range(n)]',
            '',
            '    def add_edge(self, u, v, c):',
            '        self.g[u].append(len(self.to)); self.to.append(v); self.cap.append(c)',
            '        self.g[v].append(len(self.to)); self.to.append(u); self.cap.append(0)',
            '',
            '    def bfs(self, s, t):',
            '        ...',
            '',
            '    def max_flow(self, s, t):',
            '        ...'
          ].join('\n'),
          hints: [
            '残量边成对存储：正向容量 c、反向容量 0；增广时正向减 f、反向加 f。',
            'EK 的复杂度 O(VE²) 来自「每条边饱和次数 O(V)」；Dinic 的 O(V²E) 在单位容量图上更好。',
            '退化例子：s→a 容量 10⁹、a→t 容量 10⁹、s→b→t 容量 1，DFS 可能每次只推 1 单位。'
          ],
          solution: '三者的核心都是「沿残量路径增广」，差别在找路策略与分层。' +
            'EK 用 BFS 保证最短增广路，避免 Ford-Fulkerson 的指数级最坏情况；' +
            'Dinic 用分层图一次推多条，实际性能最好。' +
            '退化图应显示 FF 增广上万次、EK 只需几次。'
        },
        {
          n: 2,
          title: '二分图匹配与项目分配',
          tasks: [
            '把「学生选项目」建模成二分图，源点连学生、学生连可选项目、项目连汇点，容量全为 1。',
            '用最大流求最大匹配，输出具体的匹配方案。',
            '验证 König 定理：最大匹配数 = 最小顶点覆盖数，构造一个例子并给出覆盖集。',
            '加入「每个项目最多 2 人」的容量，观察匹配数如何变化。'
          ],
          starter: [
            'def build_bipartite(students, projects, choices):',
            '    # 返回 (flow_network, s, t)',
            '    ...',
            '',
            'def min_vertex_cover(matching, n_left, n_right):',
            '    # 从最大匹配构造最小覆盖',
            '    ...'
          ].join('\n'),
          hints: [
            '容量全为 1 时，最大流就是最大匹配；整数流保证匹配是 0/1 的。',
            'König 定理的构造：从左侧未匹配点出发走交替路，取「左侧未访问 + 右侧已访问」。',
            '把项目到汇点的容量改成 2，就是「带容量下界」的 b-matching，仍然是流问题。'
          ],
          solution: '建模要点是「源→左→右→汇」四层，所有边容量 1（或项目容量 k）。' +
            '最大流值即最大匹配数；残量网络里从源点可达的顶点集给出最小割，' +
            '对应 König 定理的最小顶点覆盖。' +
            '当项目容量为 2 时，最大匹配数可能增加，但受左侧人数限制。'
        },
        {
          n: 3,
          title: '排期、关键路径与近似调度',
          tasks: [
            '给定任务依赖与工期，建 DAG，用拓扑排序 + 最长路求最早开始时间与总工期。',
            '找出关键路径（浮动时间为 0 的任务链），说明压缩哪个任务能缩短工期。',
            '把「k 台机器、任务可并行」建模为 P||Cmax，实现 LPT 贪心并计算近似比。',
            '构造一个 LPT 达到 4/3 近似比上界的例子，验证分析是紧的。'
          ],
          starter: [
            'def earliest_start(tasks, deps):',
            '    # 返回 (est, eft, total)',
            '    ...',
            '',
            'def critical_path(est, eft, deps):',
            '    ...',
            '',
            'def lpt(tasks, k):',
            '    # 按工期降序，放到当前负载最小的机器',
            '    ...'
          ].join('\n'),
          hints: [
            'DAG 最长路按拓扑序 DP：est[v] = max(est[u] + w(u,v))，不要用 Dijkstra 求最长路。',
            '关键路径是「总工期 = 某条路径长度」的路径；压缩非关键任务不会缩短总工期。',
            'LPT 的近似比是 4/3 − 1/(3k)；构造上界例子需要 2k+1 个任务，其中 2k 个小任务、1 个大任务。'
          ],
          solution: '排期部分：拓扑序保证依赖先算，最长路给出最早开始时间，' +
            '总工期 = max(eft)；关键路径用「eft[u] = est[v] 且 est[v]−est[u]=w」回溯。' +
            'LPT 部分：按降序贪心，每个任务放到当前负载最小的机器，' +
            '证明用「最大任务」与「平均负载」两个下界夹出 4/3 界。'
        }
      ]
    }
  ]);
})();
