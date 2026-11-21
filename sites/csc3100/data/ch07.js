/* =====================================================================
 * ch07.js · 第 7 章「图：遍历、最短路与最小生成树」
 * 职责：把前六章的结构全部用上——队列做 BFS、栈做 DFS、堆做 Dijkstra、
 *       并查集做 Kruskal。这是整门课的收束章。
 * 依据：Lecture 12（graph I / II）、Tutorial 11（Graph, BFS, DFS）；
 *       Tutorial on Dijkstra and Floyd；CLRS 第 22、23、24、25 章。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch07',
  num: '07',
  title: '图：遍历、最短路与最小生成树',
  en: 'GRAPHS: TRAVERSAL & SHORTEST PATHS',
  goals: [
    '按稀疏/稠密与是否需要枚举邻居，正确选择邻接矩阵或邻接表',
    '写出 BFS 与 DFS 的迭代模板，并说出各自能回答什么问题',
    '用 Kahn 算法做拓扑排序并在同一趟里判断有向图是否有环',
    '写出 Dijkstra 并用优先队列把复杂度降到 O((V+E) log V)，说清它为什么不能处理负权',
    '用 Kruskal（并查集）与 Prim（优先队列）各求一次最小生成树，并比较适用场景'
  ],
  kp: [
    { id: 'ch07-1', title: '图的表示：矩阵、邻接表与边集' },
    { id: 'ch07-2', title: 'BFS：层序扩展与无权最短路' },
    { id: 'ch07-3', title: 'DFS：时间戳与边的分类' },
    { id: 'ch07-4', title: '拓扑排序与有向环检测' },
    { id: 'ch07-5', title: '并查集：近乎 O(1) 的合并与查询' },
    { id: 'ch07-6', title: 'Dijkstra：贪心 + 优先队列' },
    { id: 'ch07-7', title: 'Bellman-Ford 与 Floyd-Warshall' },
    { id: 'ch07-8', title: '最小生成树：Kruskal 与 Prim' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么读这一章', html: '图是数据结构课的最后一块拼图，也是<b>唯一一个能把前六章全部串起来</b>的结构：BFS 用队列（第 02 章），DFS 用栈与递归（第 02、04 章），Dijkstra 用优先队列（第 06 章），Kruskal 用并查集，拓扑排序用入度数组。现实中的地图导航、社交网络、编译器的依赖分析、网络路由、任务调度，本质都是图上的问题。这一章的重点不是背四五个算法，而是学会<b>把一个自然语言描述的问题翻译成「图 + 选哪个算法」</b>——翻译对了，代码只有二十行。' },

    { t: 'p', lead: true, html: '图 G = (V, E) 由顶点集和边集组成。相比树，它多了两个自由度：<b>可以有环</b>、<b>可以不连通</b>；边还可以带方向、带权重。这四个维度组合出八种图，每种上能问的问题都不一样。这一章按「先能走遍（遍历）→ 再问最短（最短路）→ 最后问最省（最小生成树）」的顺序推进，每个算法都配一句「它到底在贪心什么」。' },

    { t: 'h', lvl: 2, text: '一、图的表示：矩阵、邻接表与边集', id: 'ch07-1' },

    { t: 'p', html: '图的存储有三种主流方式，选择依据是<b>稀疏还是稠密</b>。<b>邻接矩阵</b>开一个 V×V 的二维数组，<code>m[u][v]</code> 存边的权重（无边用 ∞ 或 0），查询一条边 O(1)，但空间 O(V²)。<b>邻接表</b>给每个顶点挂一条链表（Java 里常用 <code>List&lt;List&lt;int[]&gt;&gt;</code>），空间 O(V+E)，枚举邻居 O(deg(u))。<b>边集</b>只存 (u, v, w) 三元组，适合 Kruskal 这种「按边权排序」的算法。' },

    { t: 'table', head: ['维度', '邻接矩阵', '邻接表', '边集数组'], rows: [
      ['空间', 'O(V²)', 'O(V + E)', 'O(E)'],
      ['查一条边', 'O(1)', 'O(deg(u))', 'O(E)'],
      ['枚举某点邻居', 'O(V)', 'O(deg(u))', 'O(E)'],
      ['适合', '稠密图（E ≈ V²）、Floyd', '稀疏图（E ≈ V）、绝大多数算法', 'Kruskal、按边处理'],
      ['额外好处', '矩阵乘法可算路径数、传递闭包', '省空间、迭代快', '排序方便']
    ], caption: 'E ≈ V² 时用矩阵，E ≈ V 时用表；现实中绝大多数图都是稀疏的' },

    { t: 'p', html: '无向图的邻接矩阵是对称的，可以只存一半；邻接表里一条无向边要存两条有向边（u→v 和 v→u），<b>忘记存反向边是初学图论最常见的 bug</b>。带权图把「是否有边」换成「权重」，用 <code>Integer.MAX_VALUE / 2</code> 表示无穷——除以 2 是为了防止两条边相加时溢出。' },

    { t: 'h', lvl: 2, text: '二、BFS：层序扩展与无权最短路', id: 'ch07-2' },

    { t: 'p', html: '广度优先搜索（BFS）从一个起点出发，先访问所有距离为 1 的点，再访问距离为 2 的点，像水波一样层层扩散。实现只需要一个<b>队列</b>和一个 <code>visited</code> 数组：出队一个点，把它的未访问邻居全部入队并标记。' },

    { t: 'code', lang: 'java', caption: 'BFS 模板：队列 + 距离数组', code: `int[] bfs(List<List<Integer>> adj, int s) {
    int n = adj.size();
    int[] dist = new int[n];
    Arrays.fill(dist, -1);           // -1 表示未访问
    dist[s] = 0;
    Queue<Integer> q = new ArrayDeque<>();
    q.offer(s);
    while (!q.isEmpty()) {
        int u = q.poll();
        for (int v : adj.get(u)) {
            if (dist[v] != -1) continue;   // 已访问，跳过（防重复入队）
            dist[v] = dist[u] + 1;         // 第一到达即最短（跳数）
            q.offer(v);
        }
    }
    return dist;
}` },

    { t: 'p', html: 'BFS 最重要的性质是：<b>在无权图（或所有边权相同）上，第一次到达某个点时的距离就是最短距离</b>。原因在于队列的先进先出保证了「按距离非降序」处理，所以当 v 第一次被访问时，不可能存在更短的路径。这条性质让 BFS 成为「最少步数」「最少换乘」「社交网络几度人脉」这类问题的标准解法。' },

    { t: 'p', html: '两个实现细节。<b>第一，标记时机</b>：必须在<b>入队时</b>标记 visited，而不是出队时。否则同一个点可能被多个邻居重复入队，队列膨胀甚至超时。<b>第二，多源 BFS</b>：把多个起点同时入队、dist 都置 0，就能一次性算出「每个点到最近起点的距离」——地图上「离我最近的医院」这类问题就是这么做的。' },

    { t: 'p', html: 'BFS 的复杂度是 O(V + E)：每个点入队一次，每条边被检查一次（有向图）或两次（无向图）。<b>写复杂度时别只写 O(V+E) 的 V+E 部分，要说清「每条边只在枚举邻居时看一次」</b>，这是考试爱考的解释题。' },

    { t: 'quiz', qid: 'ch07-q1' },

    { t: 'h', lvl: 2, text: '三、DFS：时间戳与边的分类', id: 'ch07-3' },

    { t: 'p', html: '深度优先搜索（DFS）沿一条路走到底，走不动了再退回上一个分叉。递归写法只有五行，但它能回答的问题比 BFS 更多——<b>因为它天然记录了「进入」和「离开」两个时刻</b>。' },

    { t: 'code', lang: 'java', caption: 'DFS：时间戳是后续所有高级算法的基础', code: `int timer = 0;
int[] disc, fin;                 // discovery / finish 时间
boolean[] visited;

void dfs(List<List<Integer>> adj, int u) {
    visited[u] = true;
    disc[u] = ++timer;           // 进入时刻
    for (int v : adj.get(u)) {
        if (!visited[v]) dfs(adj, v);
    }
    fin[u] = ++timer;            // 离开时刻
}` },

    { t: 'p', html: '有了 <code>disc</code> 和 <code>fin</code>，就能把有向图的边分成四类：<b>树边</b>（DFS 树里的边）、<b>前向边</b>（祖先指向后代，非树边）、<b>后向边</b>（后代指向祖先）、<b>横叉边</b>（不同子树之间）。判据是：若 v 未访问，是树边；若 v 已访问但未结束（<code>disc[v] &lt; disc[u]</code> 且 <code>fin[v] == 0</code>），是后向边；否则看时间戳大小定前向或横叉。' },

    { t: 'p', html: '<b>「有后向边 ⟺ 有环」</b>是这一节最实用的结论：DFS 过程中如果遇到一条指向「正在递归栈里」的祖先的边，就说明存在环。拓扑排序的 DFS 版本、强连通分量的 Tarjan 算法，都是在这个观察上做文章。另一个常用性质是<b>括号化定理</b>：任意两个区间 <code>[disc, fin]</code> 要么完全不相交，要么一个包含另一个——DFS 的递归结构在时间轴上就是一对对括号。' },

    { t: 'p', html: 'DFS 的复杂度也是 O(V + E)，但常数比 BFS 小，且<b>空间是 O(V) 的递归栈</b>——图很深时（比如 10 万节点的链）会 StackOverflow，工程上要改写成显式栈的迭代版。迭代版要注意「入栈顺序反过来」才能保持与递归相同的访问次序，这个细节在需要匹配递归结果时很关键。' },

    { t: 'h', lvl: 2, text: '四、拓扑排序与有向环检测', id: 'ch07-4' },

    { t: 'p', html: '拓扑排序只对<b>有向无环图</b>（DAG）有意义：把所有点排成一条线，使得每条边都从前往后指。典型场景是<b>依赖关系</b>——课程先修、构建系统的任务顺序、包管理器的安装顺序、电子表格的公式求值。' },

    { t: 'p', html: 'Kahn 算法是最直观的实现：<b>统计每个点的入度，把入度为 0 的点放进队列，每次取出一个点输出，并把它所有邻居的入度减 1，减到 0 就入队</b>。如果最后输出的点数少于 V，说明剩下的点互相依赖成环——<b>判环和排序在同一趟里完成，这是 Kahn 相对 DFS 版的优势</b>。' },

    { t: 'steps', items: [
      { title: '第一步 · 算入度', html: '遍历所有边，对每条 u→v 让 indeg[v]++。O(V+E)。' },
      { title: '第二步 · 起点入队', html: '所有 indeg 为 0 的点入队。它们没有任何前置依赖，可以立刻执行。' },
      { title: '第三步 · 逐个出队', html: '取出 u 加入结果序列，对 u 的每个邻居 v 做 indeg[v]--，减到 0 就入队。' },
      { title: '第四步 · 判环', html: '若结果序列长度 &lt; V，说明有环，返回失败。否则返回序列。' }
    ] },

    { t: 'p', html: 'DFS 版的做法相反：对每个点跑 DFS，<b>在离开时（后序位置）把点压入结果</b>，最后把结果反转，就得到拓扑序。它同样能判环（靠后向边），但代码更容易写错，且不能像 Kahn 那样「输出到一半就发现环」。<b>两者复杂度都是 O(V+E)，选哪个看要不要顺便判环</b>。' },

    { t: 'p', html: '还有一个常被忽略的点：<b>拓扑序通常不唯一</b>。当同时有多个入度为 0 的点时，谁先谁后都合法。如果题目要求「字典序最小的拓扑序」，把队列换成优先队列（小顶堆）即可，复杂度变成 O((V+E) log V)——这正是第 06 章的堆在起作用。' },

    { t: 'h', lvl: 2, text: '五、并查集：近乎 O(1) 的合并与查询', id: 'ch07-5' },

    { t: 'p', html: '并查集（union-find / disjoint set）维护若干<b>不相交集合</b>，只支持两个操作：<code>find(x)</code> 查 x 属于哪个集合（返回代表元），<code>union(a, b)</code> 把两个集合合并。听起来简单，但它是 Kruskal 求最小生成树、判断无向图连通性、检测冗余边的核心工具。' },

    { t: 'p', html: '实现是一棵「父指针森林」：每个点存自己的父节点，根节点的父是自己。<code>find</code> 一路往上走到根；<code>union</code> 把一棵树的根挂到另一棵的根上。裸写会退化成链表（O(n)），两个优化把它压到近乎常数：' },

    { t: 'code', lang: 'java', caption: '并查集：路径压缩 + 按秩合并', code: `int[] parent, rank;

void init(int n) {
    parent = new int[n]; rank = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;   // 各自为根
}

int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);  // 路径压缩
    return parent[x];
}

boolean union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false;              // 已在同一集合 → 这条边会成环
    if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
    parent[rb] = ra;                         // 矮树挂到高树下
    if (rank[ra] == rank[rb]) rank[ra]++;
    return true;
}` },

    { t: 'p', html: '<b>路径压缩</b>让 find 过程中经过的所有节点直接指向根，把树压扁；<b>按秩合并</b>（或按大小）保证树高不会失控。两者合用的摊还复杂度是 <b>O(α(n))</b>，α 是反阿克曼函数，在实际能遇到的任何 n 下都 ≤ 5——<b>可以直接当成 O(1)</b>。这个结论来自 Tarjan 1975 年的分析，是数据结构里最漂亮的摊还结果之一。' },

    { t: 'p', html: '一个极常用的配套技巧：<code>union</code> 返回 false 表示 a 和 b 已经连通，<b>再加这条边就会形成环</b>。无向图判环、Kruskal 跳过成环边，靠的都是这个返回值。此外并查集只能合并、不能拆分（不支持删除），需要拆分时要用更复杂的结构。' },

    { t: 'h', lvl: 2, text: '六、Dijkstra：贪心 + 优先队列', id: 'ch07-6' },

    { t: 'p', html: '带权图的最短路是这一章的核心问题。Dijkstra 的思路是<b>贪心</b>：维护一个距离数组 <code>dist</code>（起点到各点的当前最短估计），每次从「未确定的点」里挑 <code>dist</code> 最小的那个，宣布它的距离已确定，然后用它去<b>松弛</b>（relax）邻居——如果 <code>dist[u] + w(u,v) &lt; dist[v]</code>，就更新 v。' },

    { t: 'p', html: '为什么这个贪心是对的？因为所有边权非负，<b>当前 dist 最小的点不可能再被其他路径改小</b>——任何绕路都要经过一个 dist 更大的点，再加上非负的边权只会更大。这条论证依赖「非负」这个前提，一旦有负权边，绕路反而可能更短，贪心当场失效。' },

    { t: 'code', lang: 'java', caption: 'Dijkstra：优先队列 + 懒惰删除', code: `long[] dijkstra(List<List<int[]>> adj, int s) {   // int[]{v, w}
    int n = adj.size();
    long[] dist = new long[n];
    Arrays.fill(dist, Long.MAX_VALUE);
    dist[s] = 0;

    PriorityQueue<long[]> pq = new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0]));
    pq.offer(new long[]{0, s});                      // {距离, 点}

    while (!pq.isEmpty()) {
        long[] top = pq.poll();
        long d = top[0];
        int u = (int) top[1];
        if (d > dist[u]) continue;                   // 懒惰删除：过期条目跳过

        for (int[] e : adj.get(u)) {
            int v = e[0], w = e[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.offer(new long[]{dist[v], v});    // 直接塞新的，不删旧的
            }
        }
    }
    return dist;
}` },

    { t: 'p', html: '这段代码里 <code>if (d &gt; dist[u]) continue;</code> 就是<b>懒惰删除</b>：同一个点可能被多次入队，每次距离都更小，弹出时发现手里的 d 已经不是最新的就跳过。<b>它替代了「decrease-key」这个操作</b>，让实现简单很多，代价是队列里最多有 O(E) 个条目。<b>复杂度因此是 O((V+E) log E) = O((V+E) log V)</b>。' },

    { t: 'callout', kind: 'warn', title: 'Dijkstra 的三个陷阱', html: '<b>陷阱一：负权边。</b>Dijkstra 直接给出错误答案，不是「慢一点」而是「错」。有负权必须换 Bellman-Ford。<br><b>陷阱二：用 <code>int</code> 存距离。</b>多段边权相加很容易溢出，用 <code>long</code>，并把「无穷」写成 <code>Long.MAX_VALUE</code> 且判断时避免加它。<br><b>陷阱三：稠密图还用堆。</b>E ≈ V² 时，朴素 O(V²) 的「每轮线性扫最小值」反而更快（无堆开销），这是考试常问的选型题。' },

    { t: 'p', html: '还有两个值得一提的变体。<b>0-1 BFS</b>：边权只有 0 和 1 时，把队列换成双端队列（权 0 压队头、权 1 压队尾），复杂度降到 O(V+E)——这是第 02 章双端队列的漂亮应用。<b>A* 搜索</b>：在 Dijkstra 的优先级里加上一个启发式估计（如欧氏距离），让搜索朝目标方向倾斜，地图导航用的就是它。' },

    { t: 'quiz', qid: 'ch07-q2' },

    { t: 'h', lvl: 2, text: '七、Bellman-Ford 与 Floyd-Warshall', id: 'ch07-7' },

    { t: 'p', html: '有负权边时 Dijkstra 就废了，需要 <b>Bellman-Ford</b>：把所有边松弛 V−1 轮。为什么是 V−1？因为一条最短路径最多包含 V−1 条边，每轮至少能确定「跳数 ≤ 轮数」的最短路，所以 V−1 轮足以覆盖全部情况。复杂度 O(VE)。' },

    { t: 'p', html: 'Bellman-Ford 还有一个 Dijkstra 没有的能力：<b>检测负环</b>。如果第 V 轮还能松弛成功，说明存在一个可以无限降低距离的环——此时「最短路」不存在（可以负无穷）。这个性质让它在路由协议（RIP）、套利检测、差分约束系统里不可替代。' },

    { t: 'p', html: '如果要求<b>所有点对</b>之间的最短路，用 <b>Floyd-Warshall</b>：三重循环，<code>d[i][j] = min(d[i][j], d[i][k] + d[k][j])</code>，k 必须在最外层。它的本质是<b>动态规划</b>——第 k 轮之后，<code>d[i][j]</code> 表示「只允许经过前 k 个点作为中转」的最短路。复杂度 O(V³)，但代码只有四行，V ≤ 400 时非常实用。' },

    { t: 'table', head: ['算法', '解决的问题', '复杂度', '负权', '负环', '适用'], rows: [
      ['BFS', '无权最短路（跳数）', 'O(V + E)', '不适用', '—', '边权全为 1 或只数步数'],
      ['Dijkstra', '单源最短路', 'O((V+E) log V)', '不支持', '不支持', '非负权、最常用'],
      ['Bellman-Ford', '单源最短路', 'O(VE)', '支持', '可检测', '有负权、需要判负环'],
      ['Floyd-Warshall', '全源最短路', 'O(V³)', '支持', '可检测（d[i][i]&lt;0）', '点数不大、要全源'],
      ['拓扑 + DP', 'DAG 上单源最短路', 'O(V + E)', '支持', '无环天然安全', '依赖图、关键路径']
    ], caption: '选算法的顺序：先看有没有负权，再看要单源还是全源' },

    { t: 'h', lvl: 2, text: '八、最小生成树：Kruskal 与 Prim', id: 'ch07-8' },

    { t: 'p', html: '最小生成树（MST）是另一个经典问题：在<b>连通无向带权图</b>上选出一组边，把所有点连起来且总权重最小。n 个点恰好选 n−1 条边，且不能有环。它的现实对应是「用最少的线缆把所有城市连起来」——注意它和最短路的区别：<b>最短路关心「两点之间怎么走最快」，MST 关心「全网怎么连最便宜」，两者答案通常不同</b>。' },

    { t: 'p', html: '<b>Kruskal</b> 从边出发：把所有边按权重升序排好，依次尝试加入，<b>如果两端已经连通（并查集判定）就跳过</b>，否则加入并合并。选够 n−1 条就停。复杂度 O(E log E)，瓶颈在排序，适合<b>稀疏图</b>。' },

    { t: 'code', lang: 'java', caption: 'Kruskal：排序 + 并查集，判断成环全靠 union 的返回值', code: `int kruskal(int n, int[][] edges) {       // edges: {u, v, w}
    Arrays.sort(edges, (a, b) -> a[2] - b[2]);   // 按权重升序
    init(n);                                     // 并查集初始化
    int total = 0, used = 0;
    for (int[] e : edges) {
        if (!union(e[0], e[1])) continue;        // 已成环，跳过这条边
        total += e[2];
        if (++used == n - 1) break;              // 选够 n−1 条就可以停
    }
    return used == n - 1 ? total : -1;           // 不足说明图不连通
}` },

    { t: 'p', html: '<b>Prim</b> 从点出发：任选一个起点放进「已选集合」，每次挑<b>连接已选集合与未选集合的最小边</b>，把对面的点拉进来，然后更新它的邻居到集合的距离。用优先队列实现是 O(E log V)，用邻接矩阵朴素实现是 O(V²)。<b>适合稠密图</b>，因为它的代价跟点数关系更大。' },

    { t: 'p', html: '两者都基于<b>贪心</b>，正确性都来自同一条定理（割性质）：<b>对任意一种把点分成两半的割，横跨这个割的最小边一定属于某棵最小生成树</b>。Kruskal 相当于每次取「全局最小且不成环」的边，Prim 相当于每次取「跨当前割的最小边」，两者都是这条定理的不同应用。理解了这个共同根源，就不用分别记忆两个正确性证明。' },

    { t: 'compare', left: { title: 'Kruskal', items: ['按边贪心 + 并查集', 'O(E log E)，瓶颈是排序', '适合稀疏图（E ≈ V）', '不需要邻接结构，边集即可', '天然支持「森林」（不连通图求最小生成森林）'] }, right: { title: 'Prim', items: ['按点贪心 + 优先队列', 'O(E log V) 或 O(V²)', '适合稠密图（E ≈ V²）', '需要邻接表或矩阵', '从单点长出去，天然是连通的'] }, caption: 'E 小用 Kruskal、E 大用 Prim；两者结果的总权重相同（MST 可能不唯一）' },

    { t: 'quiz', qid: 'ch07-q3' },

    { t: 'terms', items: [
      { en: 'adjacency list', zh: '邻接表', html: '每个顶点挂一条邻居列表，空间 O(V+E)，枚举邻居 O(deg)，适合稀疏图。' },
      { en: 'BFS', zh: '广度优先搜索', html: '用队列逐层扩展，时间 O(V+E)，在无权图上第一次到达即最短路。' },
      { en: 'DFS', zh: '深度优先搜索', html: '递归或显式栈走到底再回溯，记录进入/离开时间戳可判环与做拓扑排序。' },
      { en: 'topological sort', zh: '拓扑排序', html: '把 DAG 排成线性序使所有边同向；Kahn 算法同时可判环，O(V+E)。' },
      { en: 'union-find', zh: '并查集', html: '支持集合合并与代表元查询，路径压缩 + 按秩合并后摊还 O(α(n))。' },
      { en: 'relaxation', zh: '松弛', html: '若 dist[u]+w(u,v) < dist[v] 则更新 dist[v]，是所有最短路算法的核心动作。' },
      { en: 'MST', zh: '最小生成树', html: '连通无向带权图中总权重最小的 n−1 条边，Kruskal 与 Prim 都基于割性质。' },
      { en: 'negative cycle', zh: '负环', html: '总权重为负的环，使最短路不存在（可无限降低）；Bellman-Ford 第 V 轮仍松弛即可检出。' }
    ] },

    { t: 'keypoint', items: [
      { title: '稀疏用表、稠密用矩阵', html: '邻接表 O(V+E) 空间但查边慢；矩阵 O(1) 查边但 O(V²) 空间。' },
      { title: 'BFS 的第一次到达就是最短', html: '队列保证按距离非降序处理；visited 必须在入队时标记。' },
      { title: 'DFS 的时间戳能分四类边', html: '有后向边即有环；Kahn 则在同一趟里完成排序与判环。' },
      { title: '并查集近乎 O(1)', html: '路径压缩 + 按秩合并摊还 O(α(n))；union 返回 false 表示成环。' },
      { title: 'Dijkstra 靠非负权成立', html: '优先队列 + 懒惰删除 O((V+E)logV)；有负权换 Bellman-Ford。' },
      { title: 'MST 与最短路不是一回事', html: 'Kruskal 按边 + 并查集适合稀疏图，Prim 按点 + 堆适合稠密图。' }
    ] },

    { t: 'checklist', id: 'ch07', items: [
      '我能按稀疏/稠密为一道题选择邻接表或邻接矩阵，并说出空间代价',
      '我能不看书写出 BFS 与 DFS，并说明 visited 该在什么时刻标记',
      '我能用 BFS 求无权图最短路与多源最近距离',
      '我能用时间戳判断 DFS 中的后向边，并据此说明有向图有环',
      '我能用 Kahn 算法做拓扑排序并在同一趟判断是否有环',
      '我能写出路径压缩 + 按秩合并的并查集，并说明 union 返回 false 的含义',
      '我能写出 Dijkstra 并用懒惰删除优化，说清它为什么不能有负权',
      '我能说出 Bellman-Ford 与 Floyd-Warshall 各自的适用场景与复杂度',
      '我能用 Kruskal 与 Prim 各求一次 MST，并说出各自适合的图密度'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 CSC3100 Lecture 12（graph I / II，含表示法、BFS/DFS、拓扑排序、最短路与 MST）组织，并配合 Tutorial 11（Graph, BFS &amp; DFS）与 Tutorial on Dijkstra and Floyd 的例题口径；Dijkstra 的贪心正确性、Bellman-Ford 的负环判定、Floyd 的动态规划解释、并查集 O(α(n)) 的摊还分析均对照 CLRS《算法导论》第 22、23、24、25 章。0-1 BFS 与 A* 为工程补充，分别对应第 02 章的双端队列与启发式搜索。' }
  ]
});
