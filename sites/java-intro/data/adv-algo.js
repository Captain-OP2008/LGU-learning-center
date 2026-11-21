/* =====================================================================
 * data/adv-algo.js · 进阶轨道 · 算法进阶（课程之外的深入学习）
 *
 * 4 个小节：树与遍历 / 图与 BFS·DFS / 哈希表的冲突处理 / 动态规划入门
 * 说明：全部示例都用数组实现（本站引擎完整支持），不依赖对象指针魔法；
 *       文中给出的复杂度与推荐做法以真实 JDK 语义为准。
 * 注册：CSC.registerAdvanced(...)（独立数组，不进入主课程（ch00–ch13））
 * 作者模块：feature-builder
 * ===================================================================== */

CSC.registerAdvanced({
  id: 'adv-algo',
  order: 2,
  title: '算法进阶',
  en: 'ADVANCED ALGORITHMS',
  tagline: '树、图、哈希、动态规划：把课程里的数组和递归用出真正的威力',
  level: '进阶',
  minutes: 110,
  prereq: ['ch04', 'ch11', 'ch12', 'ch13'],
  intro: '<p>本课程教到排序、查找、递归和 Big-O 就结束了。这一篇往前再走一步：'
    + '<b>树</b>（很多 O(log n) 结构的基础）、<b>图</b>（关系型数据的通用模型）、'
    + '<b>哈希</b>（O(1) 查找背后的冲突处理）、<b>动态规划</b>（把指数级暴力变成多项式）。</p>'
    + '<p>所有示例都用「数组 + 下标」实现，不依赖复杂对象——这既是本站引擎的限制，'
    + '也是理解数据结构的好方式：<b>当你只能用数组时，才会真正想清楚指针/引用到底在做什么</b>。</p>',
  goals: [
    '能写出二叉树的前/中/后序与层序遍历，并说出各自的应用',
    '能用 BFS/DFS 遍历图，并知道什么时候该用哪一个',
    '能解释哈希冲突的两种主流处理方式，并手写链地址法的核心逻辑',
    '掌握动态规划的四步思考法，能独立推导爬楼梯与最长递增子序列'
  ],
  sections: [
    /* ---------------------------------------------------------------- S1 树 */
    {
      id: 'adv-algo-s1',
      title: '树与遍历：递归的最佳舞台',
      en: 'TREES & TRAVERSAL',
      minutes: 28,
      blocks: [
        { t: 'p', html: '树是<b>没有环的连通图</b>。它比数组多一层「层级」结构，比链表多一个「分叉」能力。'
            + '计算机里到处都是树：文件目录、HTML/DOM、数据库索引（B+ 树）、编译器语法树、决策树……'
            + '而二叉树是其中最基础的一种：每个节点最多两个子节点。' },
        { t: 'p', html: '二叉树的节点通常定义成「值 + 左孩子 + 右孩子」。'
            + '在本站引擎里没有对象指针，我们用三个平行数组来模拟：'
            + '<code>val[i]</code> 是节点 i 的值，<code>left[i]</code>、<code>right[i]</code> 存孩子的下标，'
            + '<code>-1</code> 表示空。这种「数组表示法」和堆排序里的堆是完全一样的思路，'
            + '只不过堆要求树是「完全二叉树」，所以可以用 <code>2i+1 / 2i+2</code> 直接算孩子下标。' },
        { t: 'code', caption: '可运行：二叉树的三种深度优先遍历（本站引擎支持）',
          code: `public class TreeDfs {
    // 一棵小树：
    //        0
    //       / \\
    //      1   2
    //     / \\
    //    3   4
    static int[] val   = {10, 20, 30, 40, 50, -1, -1};
    static int[] left  = {1, 3, 4, -1, -1, -1, -1};
    static int[] right = {2, -1, -1, -1, -1, -1, -1};

    static void pre(int i) {
        if (i < 0) return;
        System.out.print(val[i] + " ");
        pre(left[i]);
        pre(right[i]);
    }

    static void in(int i) {
        if (i < 0) return;
        in(left[i]);
        System.out.print(val[i] + " ");
        in(right[i]);
    }

    static void post(int i) {
        if (i < 0) return;
        post(left[i]);
        post(right[i]);
        System.out.print(val[i] + " ");
    }

    public static void main(String[] args) {
        System.out.print("前序: "); pre(0);  System.out.println();
        System.out.print("中序: "); in(0);   System.out.println();
        System.out.print("后序: "); post(0); System.out.println();
    }
}` },
        { t: 'p', html: '三种遍历的区别只在「访问根节点的时机」：前序先访问根再递归左右；'
            + '中序先左、再根、再右；后序最后访问根。记住一句话：<b>名字说的是根在第几个被访问</b>。' },
        { t: 'p', html: '为什么树的遍历几乎都用递归写？因为树本身就是递归定义的：一棵树 = 根 + 两棵子树。'
            + '递归函数只需要处理「当前节点」，剩下的交给同样的函数去处理左右孩子，边界条件是「空节点直接返回」。'
            + '这比用显式栈模拟迭代要短得多、也更容易写对。代价是递归有栈深度限制：'
            + '一条 10 万节点的链状树（退化 BST）会把调用栈压爆（StackOverflowError）。'
            + '工程里遇到深树时，要么改成显式栈迭代，要么用 Morris 遍历把空间降到 O(1)。' },
        { t: 'p', html: '另一个值得记住的对应关系是「完全二叉树 ↔ 数组」。'
            + '如果一棵二叉树每一层都填满、最后一层靠左对齐，它就可以直接存进数组：'
            + '节点 i 的左孩子是 2i+1、右孩子是 2i+2、父节点是 (i-1)/2。'
            + '堆（优先队列）正是利用这条性质，才能只用数组就实现 O(log n) 的插入与取极值。' },
        { t: 'table', caption: '三种深度优先遍历的典型用途',
          head: ['遍历', '顺序', '典型用途'],
          rows: [
            ['前序 preorder', '根 → 左 → 右', '复制一棵树、序列化、目录树打印'],
            ['中序 inorder', '左 → 根 → 右', '<b>二叉搜索树</b>输出有序序列'],
            ['后序 postorder', '左 → 右 → 根', '释放内存、计算表达式树、统计子问题'],
            ['层序 level-order', '一层一层从左到右', '按层处理、最短步数（本质是 BFS）']
          ] },
        { t: 'p', html: '层序遍历不能用递归——它是<b>广度优先</b>的，需要队列。'
            + '本站引擎没有现成的 Queue，用 int[] 数组模拟：head 指向队首，tail 指向队尾下一个空位，'
            + '入队 tail++，出队 head++。这是算法题里非常实用的技巧，值得背下来。' },
        { t: 'code', caption: '可运行：层序遍历（数组队列）（本站引擎支持）',
          code: `public class TreeBfs {
    static int[] val   = {10, 20, 30, 40, 50, -1, -1};
    static int[] left  = {1, 3, 4, -1, -1, -1, -1};
    static int[] right = {2, -1, -1, -1, -1, -1, -1};

    public static void main(String[] args) {
        int[] queue = new int[32];
        int head = 0, tail = 0;
        queue[tail++] = 0;                       // 根节点入队
        while (head < tail) {
            int cur = queue[head++];
            System.out.print(val[cur] + " ");
            if (left[cur] >= 0)  queue[tail++] = left[cur];
            if (right[cur] >= 0) queue[tail++] = right[cur];
        }
        System.out.println();
    }
}` },
        { t: 'p', html: '二叉搜索树（BST）给二叉树加了一条规则：<b>左子树所有值 &lt; 根 &lt; 右子树所有值</b>。'
            + '这让查找变成「每次排除一半」——平均 O(log n)，和中序输出天然有序。'
            + '但 BST 有致命弱点：按顺序插入 1,2,3,4,5 会退化成一条链表，查找退化为 O(n)。'
            + '平衡树（AVL、红黑树）之所以存在，就是为了解决这个问题。' },
        { t: 'code', caption: '可运行：BST 的插入与查找（本站引擎支持）',
          code: `public class BstDemo {
    static int[] val = new int[16];
    static int[] left = new int[16];
    static int[] right = new int[16];
    static int size = 0;

    static int insert(int root, int v) {
        if (root < 0) {
            val[size] = v;
            left[size] = -1;
            right[size] = -1;
            return size++;
        }
        if (v < val[root]) left[root] = insert(left[root], v);
        else if (v > val[root]) right[root] = insert(right[root], v);
        return root;
    }

    static boolean find(int root, int v) {
        if (root < 0) return false;
        if (v == val[root]) return true;
        return v < val[root] ? find(left[root], v) : find(right[root], v);
    }

    static void inorder(int root) {
        if (root < 0) return;
        inorder(left[root]);
        System.out.print(val[root] + " ");
        inorder(right[root]);
    }

    public static void main(String[] args) {
        int root = -1;
        int[] data = {50, 30, 70, 20, 40, 60, 80};
        for (int i = 0; i < data.length; i++) root = insert(root, data[i]);
        System.out.print("中序（有序）: ");
        inorder(root);
        System.out.println();
        System.out.println("find 60 = " + find(root, 60));
        System.out.println("find 65 = " + find(root, 65));
    }
}` },
        { t: 'callout', kind: 'tip', html: '树类问题的通用四问：<b>能不能用递归</b>（子树结果能否组合成父结果）？'
            + '<b>需不需要辅助结构</b>（队列做层序、栈做迭代遍历）？'
            + '<b>复杂度是多少</b>（每个节点访问几次）？<b>什么时候退出</b>（空节点、叶子）？'
            + '四问答完，代码基本就出来了。' },
        { t: 'callout', kind: 'note', html: '课程 ch12 的递归调用树和这里讲的「树」是同一个东西：'
            + '递归的执行过程本身就是在一棵隐形树上做 DFS。理解递归调用树，就理解了 DFS。' }
      ]
    },

    /* ---------------------------------------------------------------- S2 图 */
    {
      id: 'adv-algo-s2',
      title: '图与 BFS / DFS：关系型数据的通用模型',
      en: 'GRAPHS',
      minutes: 28,
      blocks: [
        { t: 'p', html: '图由<b>顶点（vertex）</b>和<b>边（edge）</b>组成，用来表示「谁和谁有关系」：'
            + '社交网络的朋友、地图上的道路、课程的先修依赖、网页链接……'
            + '树其实是图的一种特例（无环、连通）。'
            + '图分有向/无向、带权/无权；本课程只接触到「无权图」，但面试与大作业里带权图很常见（最短路径）。' },
        { t: 'p', html: '图的存储主要有两种。①<b>邻接矩阵</b>：<code>g[i][j]</code> 表示 i 到 j 有没有边（或权重）。'
            + '优点是可以 O(1) 判断两点是否相邻；缺点是空间固定 O(V²)，稀疏图（边很少）浪费巨大。'
            + '②<b>邻接表</b>：每个顶点存一个邻居列表。空间 O(V+E)，遍历邻居效率高，是绝大多数场景的首选。'
            + '本站引擎没有链表容器，我们用「每个顶点一行」的 int[][] 来模拟邻接表。' },
        { t: 'table', caption: '两种存储方式的取舍',
          head: ['对比项', '邻接矩阵', '邻接表'],
          rows: [
            ['空间', 'O(V²)', '<b>O(V + E)</b>'],
            ['判断 u 与 v 是否相邻', '<b>O(1)</b>', 'O(deg(u))'],
            ['遍历 u 的所有邻居', 'O(V)', '<b>O(deg(u))</b>'],
            ['适合', '稠密图、需要频繁查边', '<b>稀疏图、遍历为主</b>']
          ] },
        { t: 'p', html: 'BFS（广度优先搜索）用队列一层层扩展，天然适合求「无权图最短路径」——'
            + '第一次访问到某个顶点时，路径长度一定是最短的。'
            + 'DFS（深度优先搜索）用递归（或栈）一条路走到黑，适合判断连通性、拓扑排序、找环。' },
        { t: 'p', html: '建图时有两个细节容易错：第一，<b>无向图的每条边要存两次</b>（u 的邻居里有 v，v 的邻居里也要有 u），'
            + '只存一次会导致「从另一侧搜不到」；第二，<b>顶点编号要从 0 开始且连续</b>，否则数组下标对不上，'
            + '需要先用一次遍历把编号压缩（离散化）。做题时先把这两件事检查一遍，能省掉一半调试时间。' },
        { t: 'p', html: '选 BFS 还是 DFS，除了「最短路 vs 连通性」，还要看数据规模：'
            + 'DFS 的递归深度等于最长路径，在 10⁵ 个顶点的链式图上会栈溢出；'
            + 'BFS 的队列大小等于一层的最大宽度，在稠密图可能很大。'
            + '两种遍历都是 O(V+E)，真正的差距在常数与内存分布上——所以大作业里通常用 BFS 求最短路、用迭代 DFS 做大图遍历。' },
        { t: 'code', caption: '可运行：邻接表 + BFS + DFS（本站引擎支持）',
          code: `public class GraphDemo {
    // 0-1, 0-2, 1-3, 2-4（无向图，每条边存两次）
    static int[][] adj = {
        {1, 2},
        {0, 3},
        {0, 4},
        {1},
        {2}
    };
    static boolean[] seen;

    static void bfs(int start) {
        int n = adj.length;
        int[] queue = new int[n];
        int head = 0, tail = 0;
        seen = new boolean[n];
        queue[tail++] = start;
        seen[start] = true;
        while (head < tail) {
            int u = queue[head++];
            System.out.print(u + " ");
            for (int i = 0; i < adj[u].length; i++) {
                int v = adj[u][i];
                if (!seen[v]) {
                    seen[v] = true;
                    queue[tail++] = v;
                }
            }
        }
        System.out.println();
    }

    static void dfs(int u) {
        seen[u] = true;
        System.out.print(u + " ");
        for (int i = 0; i < adj[u].length; i++) {
            int v = adj[u][i];
            if (!seen[v]) dfs(v);
        }
    }

    public static void main(String[] args) {
        System.out.print("BFS: "); bfs(0);
        seen = new boolean[adj.length];
        System.out.print("DFS: "); dfs(0); System.out.println();
    }
}` },
        { t: 'p', html: '注意 BFS 里 <code>seen[v] = true</code> 必须发生在<b>入队时</b>，而不是出队时。'
            + '如果出队才标记，同一个顶点可能被重复入队，队列爆炸、访问顺序也会错乱。'
            + '这是 BFS 最常见的一个 bug，建议动手把这一行移到出队处，观察输出变化。' },
        { t: 'steps', items: [
          { title: 'BFS 什么时候用', html: '无权图最短路、层序处理、连通块计数、迷宫最短步数。' },
          { title: 'DFS 什么时候用', html: '判断连通性、找环、拓扑排序、枚举所有路径（回溯）。' },
          { title: '复杂度', html: '邻接表下两种遍历都是 O(V + E)；邻接矩阵下是 O(V²)。' },
          { title: '空间', html: 'BFS 队列最坏 O(V)；DFS 递归栈最坏 O(V)。' }
        ] },
        { t: 'callout', kind: 'warn', html: '图不保证连通！从某个顶点出发只能访问到它所在的连通块。'
            + '要遍历整张图，需要在外层写一个循环：对每个未访问的顶点再启动一次 BFS/DFS。'
            + '很多题目的「连通块数量」就是在这里漏掉外层循环而做错的。' },
        { t: 'callout', kind: 'exam', html: '本节的图算法超出 本课程考纲，但它是大作业、算法课、面试的高频题。'
            + '如果只想抓重点：<b>BFS 求最短路</b>与<b>DFS 判连通</b>这两个模板背到能默写，就够用了。' }
      ]
    },

    /* ---------------------------------------------------------------- S3 哈希 */
    {
      id: 'adv-algo-s3',
      title: '哈希表的冲突处理：O(1) 背后的代价',
      en: 'HASHING',
      minutes: 26,
      blocks: [
        { t: 'p', html: '课程里用 HashMap 时你只关心 put/get。这一节拆开看：<b>哈希表到底是怎么把任意 key 变成数组下标的</b>。'
            + '核心只有两步：用 key 的 hashCode 算出一个整数 → 对桶数取模得到下标。'
            + '理想情况下每个 key 落在不同桶，查找 O(1)。但不同 key 可能算出同一个下标——这就是<b>冲突（collision）</b>。'
            + '冲突处理方式决定了一个哈希表的性能上限。' },
        { t: 'p', html: '真实世界冲突必然发生（鸽巢原理：键无限多、桶有限）。'
            + '两种主流处理策略：①<b>链地址法</b>：每个桶存一个链表，冲突的键串在链上；②<b>开放寻址法</b>：'
            + '桶被占了就按规则找下一个空桶（线性探测、二次探测、双重哈希）。'
            + 'Java 的 HashMap 用链地址法（并在链过长时树化）。' },
        { t: 'code', caption: '可运行：链地址法（数组 + next 链表）（本站引擎支持）',
          code: `public class ChainHash {
    static int N = 7;                    // 桶数
    static int[] head = new int[N];      // 每个桶的链表头节点下标
    static int[] next = new int[64];     // 链表：next 指针
    static int[] keys = new int[64];     // 节点存 key
    static int cnt = 0;

    static int hash(int key) {
        int h = key % N;
        return h < 0 ? h + N : h;
    }

    static void put(int key) {
        int b = hash(key);
        for (int p = head[b]; p != -1; p = next[p]) {
            if (keys[p] == key) return;  // 已存在，不重复插入
        }
        keys[cnt] = key;
        next[cnt] = head[b];
        head[b] = cnt;
        cnt++;
    }

    static boolean contains(int key) {
        int b = hash(key);
        for (int p = head[b]; p != -1; p = next[p]) {
            if (keys[p] == key) return true;
        }
        return false;
    }

    public static void main(String[] args) {
        for (int i = 0; i < N; i++) head[i] = -1;
        int[] data = {10, 3, 17, 24, 31, 45, 52};
        for (int i = 0; i < data.length; i++) put(data[i]);
        System.out.println("contains 24 = " + contains(24));
        System.out.println("contains 99 = " + contains(99));
        // 打印每个桶里挂了多少个节点
        int[] size = new int[N];
        for (int p = 0; p < cnt; p++) size[hash(keys[p])]++;
        for (int b = 0; b < N; b++) System.out.println("bucket " + b + ": " + size[b]);
    }
}` },
        { t: 'p', html: '链地址法的查找时间 = 算哈希（O(1)）+ 走链（O(链长)）。'
            + '所以控制链长就是控制性能：链平均长度 = 元素数 / 桶数，这个比值叫<b>负载因子（load factor）</b>。'
            + 'Java HashMap 默认负载因子 0.75 —— 当元素数超过「容量 × 0.75」时扩容为两倍并 rehash。'
            + '为什么是 0.75？太小浪费空间，太大冲突变多；0.75 是空间/时间的折中（泊松分布算出来的经验值）。' },
        { t: 'p', html: '哈希函数的质量直接决定冲突率。一个「好」的哈希函数应该让 key 均匀分布到桶里，'
            + '并且计算足够快。反例是把所有 key 都映射到同一个桶（冲突爆炸，退化成链表）；'
            + '反例二是哈希值只用 key 的低位（比如 key 都是 10 的倍数时取模 10 会全挤在一起）。'
            + 'Java 的 String.hashCode 用 31 作为乘数逐字符累积（h = 31h + c），31 是奇素数、计算可优化成移位减法，'
            + '这是「够快且分布尚可」的经典折中。' },
        { t: 'code', caption: '可运行：开放寻址法（线性探测）（本站引擎支持）',
          code: `public class OpenHash {
    static int N = 11;
    static int[] table = new int[N];   // 0 表示空桶（key 只用正数）
    static int count = 0;

    static int hash(int key) {
        int h = key % N;
        return h < 0 ? h + N : h;
    }

    static void put(int key) {
        int h = hash(key);
        int probes = 0;
        while (table[h] != 0) {
            if (table[h] == key) return;
            h = (h + 1) % N;       // 线性探测：下一个桶
            probes++;
            if (probes >= N) { System.out.println("表满了"); return; }
        }
        table[h] = key;
        count++;
    }

    static boolean contains(int key) {
        int h = hash(key);
        for (int i = 0; i < N; i++) {
            if (table[h] == 0) return false;   // 遇到空桶 → 不存在
            if (table[h] == key) return true;
            h = (h + 1) % N;
        }
        return false;
    }

    public static void main(String[] args) {
        int[] data = {22, 33, 11, 44, 55};
        for (int i = 0; i < data.length; i++) put(data[i]);
        for (int i = 0; i < N; i++) System.out.print(table[i] + " ");
        System.out.println();
        System.out.println("contains 33 = " + contains(33));
        System.out.println("contains 77 = " + contains(77));
    }
}` },
        { t: 'p', html: '开放寻址法不需要链表，缓存友好（数组连续访问快），但删除很麻烦：'
            + '不能直接把桶清空，否则会截断其他 key 的探测链，需要「墓碑标记」。'
            + '另外它要求负载因子更低（一般 &lt; 0.7），否则探测长度会迅速上升。'
            + '所以绝大多数语言的标准库都选链地址法。' },
        { t: 'table', caption: '两种冲突处理对比',
          head: ['对比项', '链地址法', '开放寻址法'],
          rows: [
            ['冲突时', '挂到桶的链上', '按规则找下一个空桶'],
            ['删除', '简单（从链上摘除）', '复杂（需要墓碑）'],
            ['负载因子', '可以较高（0.75+）', '需要较低（&lt; 0.7）'],
            ['缓存友好度', '差（链表跳转）', '<b>好（连续数组）</b>'],
            ['代表实现', 'Java HashMap', 'Python dict（开放寻址变体）']
          ] },
        { t: 'callout', kind: 'warn', html: '用自定义类当 HashMap 的 key 时，必须<b>同时正确重写 equals 和 hashCode</b>，'
            + '并且保证「equals 相等的两个对象 hashCode 一定相等」。'
            + '只重写一个是最常见的 bug：你会遇到「明明放进去了却 get 不到」。' },
        { t: 'callout', kind: 'tip', html: '面试常问「为什么 HashMap 容量是 2 的幂」。'
            + '因为取模可以用 <code>hash &amp; (n-1)</code> 位运算替代，比 <code>%</code> 快；'
            + '同时扩容时元素要么留在原桶、要么移到「原下标 + 旧容量」，rehash 很高效。' }
      ]
    },

    /* ---------------------------------------------------------------- S4 DP */
    {
      id: 'adv-algo-s4',
      title: '动态规划入门：把指数级暴力变成多项式',
      en: 'DYNAMIC PROGRAMMING',
      minutes: 28,
      blocks: [
        { t: 'p', html: '递归很美，但会重复计算。斐波那契的朴素递归 <code>fib(n) = fib(n-1) + fib(n-2)</code> '
            + '时间复杂度是 O(2ⁿ)：算 fib(40) 要把 40 层调用树走一遍，几乎卡死。'
            + '<b>动态规划（Dynamic Programming, DP）</b>的核心思想只有一句话：'
            + '<b>把子问题的答案存下来，用空间换时间</b>。' },
        { t: 'p', html: 'DP 能用的前提是问题具有两个性质：'
            + '①<b>最优子结构</b>：大问题的最优解能由子问题的最优解组合出来；'
            + '②<b>重叠子问题</b>：递归过程中同一个子问题会被算很多次。'
            + '满足这两条，就可以「从最小的子问题开始递推，把答案存进表里」。' },
        { t: 'steps', items: [
          { title: '定义状态', html: '用一个变量/数组说清「dp[i] 表示什么」。这是最难也最关键的一步。' },
          { title: '写转移方程', html: 'dp[i] 怎么由更小的 dp 推出来？例如 dp[i] = dp[i-1] + dp[i-2]。' },
          { title: '确定初始条件', html: '最小的那些子问题答案是什么？dp[0]、dp[1] 要手工填。' },
          { title: '确定遍历顺序', html: '保证算 dp[i] 时它依赖的 dp 值已经算好（通常从小到大）。' }
        ] },
        { t: 'code', caption: '可运行：爬楼梯（等价斐波那契，从 O(2ⁿ) 到 O(n)）（本站引擎支持）',
          code: `public class ClimbingStairs {
    // 每次可以爬 1 级或 2 级，问爬到第 n 级有多少种走法
    // 朴素递归版：时间 O(2^n)
    static int slow(int n) {
        if (n <= 2) return n;
        return slow(n - 1) + slow(n - 2);
    }

    // 记忆化递归：把算过的答案存进 memo（仍是自顶向下）
    static int[] memo;
    static int memoized(int n) {
        if (n <= 2) return n;
        if (memo[n] != 0) return memo[n];
        memo[n] = memoized(n - 1) + memoized(n - 2);
        return memo[n];
    }

    // 递推（自底向上）：时间 O(n)，空间 O(n)
    static int dp(int n) {
        if (n <= 2) return n;
        int[] dp = new int[n + 1];
        dp[1] = 1;
        dp[2] = 2;
        for (int i = 3; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
        return dp[n];
    }

    public static void main(String[] args) {
        int n = 20;
        memo = new int[n + 1];
        System.out.println("slow(20)     = " + slow(20));
        System.out.println("memoized(20) = " + memoized(20));
        System.out.println("dp(20)       = " + dp(20));
    }
}` },
        { t: 'p', html: '把「自顶向下的递归 + 缓存（记忆化）」理解成同一件事，你就理解了 DP 的全貌。'
            + '上面三种写法答案完全一样，但时间复杂度从 O(2ⁿ) 降到 O(n)。'
            + '顺带提一个工程细节：dp 数组其实只依赖前两个状态，可以压缩成两个变量，空间从 O(n) 降到 O(1) —— '
            + '面试里常追问这个优化。' },
        { t: 'code', caption: '可运行：最长递增子序列（LIS，经典 DP）（本站引擎支持）',
          code: `public class Lis {
    // dp[i] = 以 a[i] 结尾的最长递增子序列长度
    // dp[i] = 1 + max{ dp[j] | j < i 且 a[j] < a[i] }
    static int lis(int[] a) {
        int n = a.length;
        int[] dp = new int[n];
        int best = 0;
        for (int i = 0; i < n; i++) {
            dp[i] = 1;
            for (int j = 0; j < i; j++) {
                if (a[j] < a[i] && dp[j] + 1 > dp[i]) {
                    dp[i] = dp[j] + 1;
                }
            }
            if (dp[i] > best) best = dp[i];
        }
        return best;
    }

    public static void main(String[] args) {
        int[] a = {10, 9, 2, 5, 3, 7, 101, 18};
        System.out.println("LIS = " + lis(a));   // 2, 3, 7, 101 → 4
        int[] b = {5, 4, 3, 2, 1};
        System.out.println("LIS(decreasing) = " + lis(b));   // 1
    }
}` },
        { t: 'p', html: 'LIS 的 DP 是 O(n²)。它还有一个 O(n log n) 的妙解：维护一个「每个长度对应的最小结尾值」数组，'
            + '用二分查找更新。这类优化（DP + 二分）是算法竞赛的常见套路，但初学阶段掌握 O(n²) 版本更重要——'
            + '<b>先保证能正确写出状态与转移，再谈优化</b>。' },
        { t: 'table', caption: '什么时候该想到 DP',
          head: ['题目特征', '例子', '提示'],
          rows: [
            ['求最值/计数', '最大收益、最短路径、最多方案数', '问「最优解是什么」多半是 DP'],
            ['能拆成相同结构的子问题', '爬楼梯、背包、编辑距离', '看 n 变大时暴力是否指数级'],
            ['选择之间有依赖', '打家劫舍、股票买卖', '需要「前一个状态」的约束']
          ] },
        { t: 'p', html: '最后区分三个容易混的概念：<b>分治</b>把问题拆成互不重叠的子问题（归并排序）；'
            + '<b>贪心</b>每一步都选当前看起来最好的，不回头看（找零钱、区间调度），只在能证明「局部最优 = 全局最优」时成立；'
            + '<b>动态规划</b>则要求子问题重叠，并把答案缓存下来。三者不是互斥的：很多算法是「分治框架 + 记忆化」，'
            + '而 DP 的转移方程往往就是从贪心思路试出来的。判断该用哪种，先问「子问题会不会重复」。' },
        { t: 'callout', kind: 'exam', html: '本课程期末只考 Big-O 分析与简单递归，不考 DP。'
            + '但递归那章的「斐波那契递归树」就是 DP 的动机：'
            + '你能不能用一句话解释「为什么 fib(40) 慢」？——重复子问题被反复计算。答对这句，这一节就入门了。' }
      ]
    }
  ],
  finish: '<p><b>怎么继续练：</b>按「树的遍历 → BFS/DFS → 哈希 → DP」的顺序，每类在纸上手写模板三遍；'
    + '然后去 LeetCode 按 tag 刷简单题：树的遍历、岛屿数量（BFS/DFS）、两数之和（哈希）、爬楼梯（DP）。'
    + '每道题先写暴力解，再想「哪里重复计算了」，DP 的直觉就是这样长出来的。</p>',
  checklist: {
    id: 'adv-algo-check',
    items: [
      '能默写二叉树前/中/后序递归模板，并解释「名字代表根的访问顺序」',
      '能写出数组模拟的 BFS 队列与 DFS 递归，并知道 seen 标记要在入队时设',
      '能说清邻接矩阵与邻接表的空间/时间取舍',
      '能解释链地址法与开放寻址法的区别，以及负载因子的作用',
      '能用「状态-转移-初始值-顺序」四步法推导爬楼梯与 LIS'
    ]
  },
  keypoint: {
    items: [
      { title: '树 = 递归 + 分治', html: '遍历四种方式覆盖 90% 的树题；层序用队列，其余用递归。' },
      { title: 'BFS 求最短路，DFS 判连通', html: '无权图最短路用 BFS；连通块/环/拓扑用 DFS；都要处理「不连通」的外层循环。' },
      { title: '哈希冲突决定性能', html: '链地址法 + 负载因子 0.75 是工业标准；equals/hashCode 必须成对正确重写。' },
      { title: 'DP = 递归 + 记忆化', html: '先写暴力递归，再找重叠子问题，最后补一张表；复杂度通常从指数级降到多项式级。' }
    ]
  }
});
