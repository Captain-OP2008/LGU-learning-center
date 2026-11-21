/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * title 必须与各章 chXX.js 的 title 逐字一致。
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：算法分析在解决什么问题', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：这门课回答什么问题、七章之间怎么衔接、怎样用分析而非背模板的眼光看算法。' },
  { id: 'ch01', num: '01', title: '渐进分析与分治：从 O 记号到 FFT', en: 'ASYMPTOTICS & DIVIDE-AND-CONQUER', part: 'Part II · 基础', week: 3, minutes: 100, icon: 'function', labs: 1,
    blurb: '把 Θ/Ω/O 的定义、递推式与主定理练成肌肉记忆，再用 peak finding、归并、凸包、选择与 FFT 走通分治范式。' },
  { id: 'ch02', num: '02', title: '排序下界、堆与平衡树', en: 'SORTING BOUNDS, HEAPS & BALANCED TREES', part: 'Part II · 基础', week: 5, minutes: 100, icon: 'layers', labs: 1,
    blurb: '从决策树下界到计数/基数排序，再到堆、BST、AVL、区间树与 vEB，建立「有序结构」的完整工具箱。' },
  { id: 'ch03', num: '03', title: '散列与摊销：平均 O(1) 从哪来', en: 'HASHING & AMORTIZED ANALYSIS', part: 'Part III · 深入', week: 6, minutes: 100, icon: 'grid', labs: 1,
    blurb: '链接法与开放寻址、全域散列、动态扩容的摊销分析、球与箱、完美散列与 Bloom 过滤器。' },
  { id: 'ch04', num: '04', title: '图搜索与最短路：从 BFS 到 A*', en: 'GRAPH SEARCH & SHORTEST PATHS', part: 'Part III · 深入', week: 8, minutes: 110, icon: 'chart', labs: 1,
    blurb: 'BFS/DFS、拓扑排序、强连通分量，再到 Dijkstra、Bellman-Ford、DAG 最短路与 A* 启发式搜索。' },
  { id: 'ch05', num: '05', title: '贪心：局部最优何时等于全局最优', en: 'GREEDY ALGORITHMS', part: 'Part III · 深入', week: 9, minutes: 100, icon: 'target', labs: 1,
    blurb: '用交换论证判断贪心是否安全：区间调度、MST 的割/环性质、Prim/Kruskal、并查集与 Huffman。' },
  { id: 'ch06', num: '06', title: '动态规划：把指数搜索压成多项式', en: 'DYNAMIC PROGRAMMING', part: 'Part IV · 综合', week: 11, minutes: 110, icon: 'repeat', labs: 1,
    blurb: '从记忆化到状态设计：切钢条、LCS、编辑距离、背包族、区间 DP、树形/状压 DP 与 MDP 的 Bellman 方程。' },
  { id: 'ch07', num: '07', title: '网络流、NP 完全性与近似算法', en: 'FLOWS, NP-COMPLETENESS & APPROXIMATION', part: 'Part IV · 综合', week: 13, minutes: 110, icon: 'zap', labs: 1,
    blurb: '最大流最小割、Edmonds-Karp/Dinic、二分图匹配，以及 P/NP、归约套路与顶点覆盖、TSP、Christofides 近似。' }
]);
