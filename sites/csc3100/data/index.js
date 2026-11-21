/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：数据结构在算什么', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：这门课回答什么问题、八章之间怎么衔接、怎样用本站的资源把每一章走通。' },
  { id: 'ch01', num: '01', title: '复杂度、数组与抽象数据类型', en: 'COMPLEXITY, ARRAYS & ADT', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'box', labs: 2,
    blurb: '用渐进记号把「快慢」变成可以比较的量级，再看数组与动态数组如何在连续内存上做到 O(1) 随机访问与摊还 O(1) 追加。' },
  { id: 'ch02', num: '02', title: '链表、栈与队列', en: 'LISTS, STACKS & QUEUES', part: 'Part II · 基础', week: 3, minutes: 90, icon: 'layers', labs: 2,
    blurb: '链表用引用换掉连续内存，栈与队列用受限接口换掉出错可能；这一章的重点是「已知什么引用」决定了复杂度。' },
  { id: 'ch03', num: '03', title: '排序：从平方到线性对数', en: 'SORTING ALGORITHMS', part: 'Part III · 深入', week: 4, minutes: 110, icon: 'chart', labs: 2,
    blurb: '从插入排序的逆序对，到归并与快排的分治，再到决策树下界与非比较排序，把 O(n log n) 这条线彻底走一遍。' },
  { id: 'ch04', num: '04', title: '树与二叉搜索树', en: 'TREES & BINARY SEARCH TREES', part: 'Part III · 深入', week: 5, minutes: 100, icon: 'grid', labs: 2,
    blurb: '四种遍历决定你能从树里取出什么信息；BST 用中序有序换来对数查找，但它的代价完全取决于树的高度。' },
  { id: 'ch05', num: '05', title: '平衡树：AVL 与红黑树', en: 'BALANCED TREES: AVL & RED-BLACK', part: 'Part III · 深入', week: 6, minutes: 110, icon: 'repeat', labs: 2,
    blurb: '旋转保持中序不变却能压低高度；AVL 用严格平衡换查找速度，红黑树用更松的约束换更少的旋转。' },
  { id: 'ch06', num: '06', title: '堆、优先队列与哈希', en: 'HEAPS, PRIORITY QUEUES & HASHING', part: 'Part IV · 综合', week: 7, minutes: 110, icon: 'cpu', labs: 2,
    blurb: '堆只维护「谁最大」，哈希只回答「在不在」，两种放弃全序的结构分别把取最值与等值查找压到 O(log n) 与期望 O(1)。' },
  { id: 'ch07', num: '07', title: '图：遍历、最短路与最小生成树', en: 'GRAPHS: TRAVERSAL & SHORTEST PATHS', part: 'Part IV · 综合', week: 8, minutes: 120, icon: 'zap', labs: 3,
    blurb: 'BFS 与 DFS 给出两种探索顺序，拓扑排序处理依赖，Dijkstra 与 Bellman-Ford 处理路径，Kruskal 与 Prim 处理连通的最小代价。' }
]);
