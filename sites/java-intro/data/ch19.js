/* =====================================================================
 * data/ch19.js · 第 19 章：小世界现象与图
 * 职责：顶点与边、图的 API 与邻接表表示、深度优先搜索、广度优先搜索与最短路径、
 *       小世界现象（六度分隔）、平均路径长度与聚类系数、图的常见应用。
 * 内容块 schema 见 data/ 各文件注释；示例输出均在本站 Java 引擎里实跑核对。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch19',
  num: '19',
  title: '小世界现象与图',
  en: 'Small-World Phenomenon',

  goals: [
    '能把一个真实关系网络抽象成顶点与边，并说清无向图和有向图的区别',
    '能用邻接表表示图，实现 addEdge、degree、adj 这些基本操作',
    '能用深度优先搜索（DFS）判断两点是否连通',
    '能用广度优先搜索（BFS）求出两点间的最短路径长度',
    '能计算平均路径长度与聚类系数，解释小世界现象从哪来',
    '能说出 BFS、DFS 在真实系统里的典型用途'
  ],

  kp: [
    { id: 'ch19-1', title: '用图表示关系：顶点与边' },
    { id: 'ch19-2', title: '图的 API 与邻接表' },
    { id: 'ch19-3', title: '深度优先搜索：一条路走到黑' },
    { id: 'ch19-4', title: '广度优先搜索：最短路径' },
    { id: 'ch19-5', title: '小世界现象与 Kevin Bacon' },
    { id: 'ch19-6', title: '度量图：平均路径与聚类系数' },
    { id: 'ch19-7', title: '小世界从哪来' },
    { id: 'ch19-8', title: '图的更多应用' }
  ],

  blocks: [

    { t: 'callout', kind: 'why', html:
      '1967 年，社会心理学家米尔格拉姆做了个实验：把一封信交给美国中西部的一些人，' +
      '请他们转交给波士顿的一个陌生人，规则是<b>只能交给认识的熟人</b>。' +
      '结果大多数信只经过五六个中间人就到了——这就是「六度分隔」<br>' +
      '（six degrees of separation）的由来。' +
      '更反直觉的是：世界有几十亿人、每个人又只认识几百人，' +
      '这种"稀疏"的连接竟然能产生这么短的路径。<b>为什么？</b><br>' +
      '回答这个问题需要一个新工具：把人和人之间的关系画成<b>点与线</b>，' +
      '然后用"从一点走到另一点要几步"来度量它。这就是<b>图（graph）</b>，' +
      '也是本章要学的东西——它是数据结构里的"关系表示法"。'
    },

    { t: 'p', lead: true, html:
      '这一章按"把关系画成图 → 用计算机存图 → 两种搜索方式 → 量一量小世界"的顺序走。' +
      '你会先写出一个能存图的小类，再用深度优先搜索和广度优先搜索走一遍，' +
      '最后亲手算出一个小网络的平均路径长度与聚类系数——' +
      '这两个数字正是"小世界"的量化定义。'
    },

    { t: 'p', html:
      '图由<b>顶点（vertex）</b>和<b>边（edge）</b>组成：顶点是对象，边是对象之间的关系。' +
      '社交网络里，顶点是人、边是朋友；地铁图里，顶点是站、边是相邻两站；' +
      '网页图里，顶点是页面、边是链接。<b>一条边连接两个顶点</b>，' +
      '如果边有方向（A 关注 B，B 未必关注 A），就叫<b>有向图</b>；' +
      '如果关系对称（A 是 B 的朋友 ⇔ B 是 A 的朋友），就叫<b>无向图</b>。' +
      '本章只处理无向图，有向图只是多存一条反向边，搜索方法完全一样。'
    },

    { t: 'table',
      head: ['场景', '顶点', '边'],
      rows: [
        ['社交网络', '用户', '互为好友'],
        ['地铁线路', '车站', '相邻两站之间的一段'],
        ['网页链接', '网页', '一个页面指向另一个'],
        ['论文引用', '论文', '一篇引用另一篇'],
        ['课程先修关系', '课程', 'A 是 B 的先修课'],
        ['电影演员图', '演员', '同一部电影里合作过']
      ],
      caption: '把"关系"画成图的唯一方法：先定什么是点，再定什么算一条边' },

    { t: 'h', text: '一、用图表示关系：顶点与边', id: 'ch19-1' },

    { t: 'p', html:
      '图里最重要的概念只有几个：<b>路径（path）</b>是从一个顶点沿边走到另一个顶点的序列；' +
      '<b>连通（connected）</b>是说两点之间存在至少一条路径；' +
      '<b>连通分量</b>是把图拆成互不相通的一块块；<b>度数（degree）</b>是一个顶点连着几条边。' +
      '本章反复用的两个量是<b>最短路径</b>（两点之间边数最少的路径，叫距离）与<b>平均路径长度</b>' +
      '（所有点对距离的平均值）。<b>小世界</b>说的就是：平均路径长度非常小。'
    },

    { t: 'p', html:
      '还有一类关系是"有方向"的：A 关注 B，不等于 B 关注 A；课程 A 是 B 的先修课，反过来不成立。' +
      '这种图叫<b>有向图（digraph）</b>，每条边要记录方向，路径只能顺着箭头走。' +
      '有向图里"能到达"不再对称，所以连通要区分<b>强连通</b>（互相都能到达）与<b>单向可达</b>。' +
      '实现上无向图就是"每次加边同时加两个方向"，其余不变。'
    },

    { t: 'h', text: '二、图的 API 与邻接表', id: 'ch19-2' },

    { t: 'p', html:
      '存图有两种常见方式：<b>邻接矩阵</b>（V×V 的 0/1 表格，判断两点是否相邻 O(1)，但空间 V²）' +
      '与<b>邻接表</b>（每个顶点存一条邻居列表，空间只有 2E，遍历邻居很快）。' +
      '图通常是<b>稀疏</b>的——V 个点、边数远小于 V²，所以邻接表是标准选择。' +
      '下面用"每个顶点一个数组 + 计数器"来模拟链表：<code>adj[v][0..deg[v]-1]</code> 是 v 的邻居。'
    },

    { t: 'p', html:
      '这个 Graph 类的接口就是教材 §4.5 定义的四个操作：<code>vertices()</code>、<code>edges()</code>、' +
      '<code>degree(v)</code>、<code>adj(v)</code>，外加构造时给顶点数、<code>addEdge(v, w)</code> 加边。' +
      '注意 <code>addEdge</code> 里<b>两个方向都要加</b>：<code>adj[v]</code> 里记 w，<code>adj[w]</code> 里记 v——' +
      '这是无向图的定义方式，忘记一边就会出现"单行道"。'
    },

    { t: 'code', caption: 'GraphDemo.java —— 5 个顶点、7 条边：度数 4/3/3/3/1，判断两点是否相邻', code:
`class Graph {
    private int nv;
    private int ne;
    private int[][] adj;
    private int[] deg;

    Graph(int nv) {
        this.nv = nv;
        this.ne = 0;
        this.adj = new int[nv][nv];
        this.deg = new int[nv];
    }

    void addEdge(int v, int w) {
        adj[v][deg[v]] = w;
        deg[v]++;
        adj[w][deg[w]] = v;
        deg[w]++;
        ne++;
    }

    int vertices() { return nv; }
    int edges() { return ne; }
    int degree(int v) { return deg[v]; }
    int adjAt(int v, int i) { return adj[v][i]; }

    boolean hasEdge(int v, int w) {
        for (int i = 0; i < deg[v]; i++) {
            if (adj[v][i] == w) return true;
        }
        return false;
    }
}

public class GraphDemo {
    public static void main(String[] args) {
        Graph g = new Graph(5);
        g.addEdge(0, 1);
        g.addEdge(0, 2);
        g.addEdge(0, 3);
        g.addEdge(0, 4);
        g.addEdge(1, 2);
        g.addEdge(1, 3);
        g.addEdge(2, 3);
        System.out.println("V = " + g.vertices() + ", E = " + g.edges());
        for (int v = 0; v < g.vertices(); v++) {
            System.out.println("degree(" + v + ") = " + g.degree(v));
        }
        System.out.println("hasEdge(0, 4) = " + g.hasEdge(0, 4));
        System.out.println("hasEdge(2, 4) = " + g.hasEdge(2, 4));
    }
}
` },

    { t: 'p', html:
      '输出：<code>V = 5, E = 7</code>、<code>degree(0) = 4</code>、<code>degree(1) = 3</code>、' +
      '<code>degree(2) = 3</code>、<code>degree(3) = 3</code>、<code>degree(4) = 1</code>、' +
      '<code>hasEdge(0, 4) = true</code>、<code>hasEdge(2, 4) = false</code>。' +
      '核对一下：<b>所有度数之和 = 4+3+3+3+1 = 14 = 2E</b>——每条边给两个端点各贡献 1，' +
      '所以"度数和等于边数的两倍"永远成立（叫握手引理）。' +
      '平均度数 = 2E/V = 14/5 = 2.8，是后面度量的第一个指标。' +
      '顶点 4 只连 0 号，所以它到 2 号要绕 4 → 0 → 2，两跳——这就是"最短路径"要算的东西。'
    },

    { t: 'h', text: '三、深度优先搜索：一条路走到黑', id: 'ch19-3' },

    { t: 'p', html:
      '怎么判断两个点是否连通？从起点出发，沿边一直走，走不通就退回来换一条——' +
      '这就是<b>深度优先搜索（depth-first search, DFS）</b>。' +
      '递归写法只有三行：标记当前点已访问，对每个还没访问的邻居递归，其余交给递归回溯。' +
      '它的特点是<b>一路深入</b>：先走到底，再回退，所以访问顺序看起来"绕着圈走"。'
    },

    { t: 'p', html:
      '下面的图是一条"链子"：0 连 1 和 2，2 连 3，3 连 4。从 0 出发，DFS 先走 1（死路，回退），' +
      '再走 2 → 3 → 4。访问顺序 <code>0 1 2 3 4</code>——注意它<b>先钻到最深处</b>，' +
      '而不是像按距离排队那样逐层展开。'
    },

    { t: 'code', caption: 'DFSDemo.java —— 从 0 出发一路深入：访问顺序 0 1 2 3 4，5 个点全部可达', code:
`class Graph {
    private int nv;
    private int ne;
    private int[][] adj;
    private int[] deg;

    Graph(int nv) {
        this.nv = nv;
        this.ne = 0;
        this.adj = new int[nv][nv];
        this.deg = new int[nv];
    }

    void addEdge(int v, int w) {
        adj[v][deg[v]] = w;
        deg[v]++;
        adj[w][deg[w]] = v;
        deg[w]++;
        ne++;
    }

    int vertices() { return nv; }
    int edges() { return ne; }
    int degree(int v) { return deg[v]; }
    int adjAt(int v, int i) { return adj[v][i]; }
}

class DepthFirstPaths {
    private boolean[] marked;
    private int[] order;
    private int n;

    DepthFirstPaths(Graph g, int s) {
        marked = new boolean[g.vertices()];
        order = new int[g.vertices()];
        n = 0;
        dfs(g, s);
    }

    private void dfs(Graph g, int v) {
        marked[v] = true;
        order[n] = v;
        n++;
        for (int i = 0; i < g.degree(v); i++) {
            int w = g.adjAt(v, i);
            if (!marked[w]) dfs(g, w);
        }
    }

    boolean hasPathTo(int v) { return marked[v]; }
    int count() { return n; }
    int[] order() { return order; }
}

public class DFSDemo {
    public static void main(String[] args) {
        Graph g = new Graph(5);
        g.addEdge(0, 1);
        g.addEdge(0, 2);
        g.addEdge(2, 3);
        g.addEdge(3, 4);
        DepthFirstPaths p = new DepthFirstPaths(g, 0);
        System.out.print("dfs order: ");
        for (int i = 0; i < p.count(); i++) {
            System.out.print(p.order()[i] + " ");
        }
        System.out.println();
        System.out.println("reaches 4 = " + p.hasPathTo(4));
        System.out.println("visited = " + p.count());
    }
}
` },

    { t: 'p', html:
      '输出三行：<code>dfs order: 0 1 2 3 4</code>、<code>reaches 4 = true</code>、<code>visited = 5</code>。' +
      '<code>marked[4]</code> 为 true，说明 0 能到 4；<code>count</code> 是本次搜索访问到的顶点数，' +
      '如果图不连通，count 会小于 V，那些没被访问的点就属于另一个连通分量。' +
      'DFS 的代价：每个顶点访问一次、每条边检查两次，所以是 <b>O(V + E)</b>——' +
      '对稀疏图（E 远小于 V²）几乎就是线性的。'
    },

    { t: 'callout', kind: 'warn', title: 'DFS 的三个坑', html:
      '① <b>递归深度</b>：路径很长时递归会爆栈，真实实现遇到几十万顶点的图要改成显式栈。' +
      '② <b>DFS 找到的不是最短路径</b>：它只保证"能到"，不保证步数最少——' +
      '上面 0 到 4 的 DFS 路径是 0-2-3-4，3 步；恰好最短，但换一张图就不一定了。' +
      '要最短路径必须用下一节的 BFS。③ <b>必须标记已访问</b>：图有环，不标记会无限递归。' +
      '标记要放在"入栈时"而不是"出栈时"，否则同一个点可能被重复入栈。'
    },

    { t: 'h', text: '四、广度优先搜索：最短路径', id: 'ch19-4' },

    { t: 'p', html:
      '如果问题从"能不能到"变成"最少几步到"，DFS 就不够用了：它可能绕远路。' +
      '正确的做法是<b>按距离排队</b>：先处理离起点 1 步的所有点，再处理 2 步的，再 3 步的……' +
      '这就是<b>广度优先搜索（breadth-first search, BFS）</b>。' +
      '用什么结构维护"排队"？<b>队列</b>——第 17 章学过的 FIFO 结构在这里正好用上：' +
      '起点入队，每次取出队首、把它的未访问邻居入队。因为队列保证"先入先出"，' +
      '所以顶点一定是按距离递增的顺序被处理的。'
    },

    { t: 'p', html:
      '下面这段代码和 DFS 只差一处：把递归换成"队列 + while"。' +
      '距离记录在 <code>dist[]</code> 里：起点的距离是 0，每发现一个新邻居就记成"当前点的距离 + 1"。' +
      '因为 BFS 先处理近的点，所以第一次给某个点赋距离时，这个距离<b>一定是最短的</b>。'
    },

    { t: 'code', caption: 'BFSDemo.java —— 同一张链图：距离依次是 0、1、1、2、3', code:
`class Graph {
    private int nv;
    private int ne;
    private int[][] adj;
    private int[] deg;

    Graph(int nv) {
        this.nv = nv;
        this.ne = 0;
        this.adj = new int[nv][nv];
        this.deg = new int[nv];
    }

    void addEdge(int v, int w) {
        adj[v][deg[v]] = w;
        deg[v]++;
        adj[w][deg[w]] = v;
        deg[w]++;
        ne++;
    }

    int vertices() { return nv; }
    int edges() { return ne; }
    int degree(int v) { return deg[v]; }
    int adjAt(int v, int i) { return adj[v][i]; }
}

class BreadthFirstPaths {
    private boolean[] marked;
    private int[] dist;
    private int[] queue;

    BreadthFirstPaths(Graph g, int s) {
        marked = new boolean[g.vertices()];
        dist = new int[g.vertices()];
        queue = new int[g.vertices()];
        for (int v = 0; v < g.vertices(); v++) dist[v] = -1;
        int head = 0;
        int tail = 0;
        queue[tail] = s;
        tail++;
        marked[s] = true;
        dist[s] = 0;
        while (head < tail) {
            int v = queue[head];
            head++;
            for (int i = 0; i < g.degree(v); i++) {
                int w = g.adjAt(v, i);
                if (!marked[w]) {
                    marked[w] = true;
                    dist[w] = dist[v] + 1;
                    queue[tail] = w;
                    tail++;
                }
            }
        }
    }

    int distanceTo(int v) { return dist[v]; }
    boolean hasPathTo(int v) { return marked[v]; }
}

public class BFSDemo {
    public static void main(String[] args) {
        Graph g = new Graph(5);
        g.addEdge(0, 1);
        g.addEdge(0, 2);
        g.addEdge(2, 3);
        g.addEdge(3, 4);
        BreadthFirstPaths p = new BreadthFirstPaths(g, 0);
        for (int v = 0; v < g.vertices(); v++) {
            System.out.println("dist(0, " + v + ") = " + p.distanceTo(v));
        }
    }
}
` },

    { t: 'p', html:
      '输出五行：<code>dist(0, 0) = 0</code>、<code>dist(0, 1) = 1</code>、<code>dist(0, 2) = 1</code>、' +
      '<code>dist(0, 3) = 2</code>、<code>dist(0, 4) = 3</code>。' +
      '把它和上一节的 DFS 对照：同样是这张图，DFS 的访问顺序是 0 1 2 3 4，' +
      '但它并不知道 2 比 1 远——它只是碰巧最后才回到 2。BFS 则<b>直接给出距离</b>：' +
      '4 在 3 跳之外，这是最短距离。' +
      '如果要把"最短路径"完整打印出来，只需在发现新点的时候记一个 <code>edgeTo[]</code>（从哪个点来的），' +
      '最后从终点沿 <code>edgeTo</code> 往回走就是路径。<b>BFS 的代价同样是 O(V + E)</b>，' +
      '但每个点都只入队一次，所以它比 DFS 多花一个队列的空间。'
    },

    { t: 'h', text: '五、小世界现象与 Kevin Bacon', id: 'ch19-5' },

    { t: 'p', html:
      '现在回到开头的实验。把演员和电影建成一张图：<b>顶点是演员，同一部电影里合作过就连一条边</b>。' +
      '于是"两个演员隔几层关系"就是图上两点的距离。' +
      '这个游戏叫 <b>Kevin Bacon 六度分隔</b>（Six Degrees of Kevin Bacon）：' +
      '看任一演员到 Kevin Bacon 隔多少部电影。有人真的算过这张包含几十万演员的图，' +
      '结果平均距离只有 3 左右——大多数演员和 Bacon 之间只隔两三个熟人。'
    },

    { t: 'p', html:
      '教材的 <code>SmallWorld</code> 程序做的正是这件事：读入图数据，算出三个数——' +
      '<b>平均度数</b>（每个点平均连几条边）、<b>平均路径长度</b>（所有点对距离的平均）、' +
      '<b>聚类系数</b>（"我朋友的朋友也是我朋友"的程度）。' +
      '前两个数回答"网络有多紧密"，第三个数回答"局部有多抱团"。' +
      '小世界网络的特殊之处在于：<b>它们同时具有很小的平均路径和很高的聚类系数</b>。'
    },

    { t: 'h', text: '六、度量图：平均路径与聚类系数', id: 'ch19-6' },

    { t: 'p', html:
      '<b>平均路径长度</b>：对每一对不同的顶点，算它们的最短距离，再取平均。' +
      '实现就是"对每个点跑一次 BFS，把距离累加"——所以代价是 V 次 BFS，约 O(V(V+E))。' +
      '<b>聚类系数</b>：对顶点 v，看它的 d 个邻居之间有多少对互相认识（即存在边）。' +
      '最多可能有 <code>d(d-1)/2</code> 对，实际存在 a 对，比值 a/(d(d-1)/2) 就是 v 的聚类系数；' +
      '度数小于 2 的点不参与平均（没法形成"三角形"）。<br>' +
      '下面用同一个小网络算给你看：5 个顶点、7 条边，也就是前面 GraphDemo 用的那张图。'
    },

    { t: 'code', caption: 'MetricsDemo.java —— 5 个顶点 7 条边：平均度数 2.8、平均路径 1.3、聚类系数 0.875', code:
`class Graph {
    private int nv;
    private int ne;
    private int[][] adj;
    private int[] deg;

    Graph(int nv) {
        this.nv = nv;
        this.ne = 0;
        this.adj = new int[nv][nv];
        this.deg = new int[nv];
    }

    void addEdge(int v, int w) {
        adj[v][deg[v]] = w;
        deg[v]++;
        adj[w][deg[w]] = v;
        deg[w]++;
        ne++;
    }

    int vertices() { return nv; }
    int edges() { return ne; }
    int degree(int v) { return deg[v]; }
    int adjAt(int v, int i) { return adj[v][i]; }

    boolean hasEdge(int v, int w) {
        for (int i = 0; i < deg[v]; i++) {
            if (adj[v][i] == w) return true;
        }
        return false;
    }
}

class BreadthFirstDist {
    static int[] bfs(Graph g, int s) {
        int[] dist = new int[g.vertices()];
        int[] queue = new int[g.vertices()];
        boolean[] marked = new boolean[g.vertices()];
        for (int v = 0; v < g.vertices(); v++) dist[v] = -1;
        int head = 0;
        int tail = 0;
        queue[tail] = s;
        tail++;
        marked[s] = true;
        dist[s] = 0;
        while (head < tail) {
            int v = queue[head];
            head++;
            for (int i = 0; i < g.degree(v); i++) {
                int w = g.adjAt(v, i);
                if (!marked[w]) {
                    marked[w] = true;
                    dist[w] = dist[v] + 1;
                    queue[tail] = w;
                    tail++;
                }
            }
        }
        return dist;
    }
}

public class MetricsDemo {
    static double averagePathLength(Graph g) {
        int total = 0;
        int pairs = 0;
        for (int s = 0; s < g.vertices(); s++) {
            int[] dist = BreadthFirstDist.bfs(g, s);
            for (int w = 0; w < g.vertices(); w++) {
                if (w != s && dist[w] > 0) {
                    total = total + dist[w];
                    pairs++;
                }
            }
        }
        return 1.0 * total / pairs;
    }

    static double clustering(Graph g) {
        double sum = 0;
        int counted = 0;
        for (int v = 0; v < g.vertices(); v++) {
            int d = g.degree(v);
            if (d < 2) continue;
            int possible = d * (d - 1) / 2;
            int actual = 0;
            for (int i = 0; i < d; i++) {
                for (int j = i + 1; j < d; j++) {
                    if (g.hasEdge(g.adjAt(v, i), g.adjAt(v, j))) actual++;
                }
            }
            sum = sum + 1.0 * actual / possible;
            counted++;
        }
        return sum / counted;
    }

    public static void main(String[] args) {
        Graph g = new Graph(5);
        g.addEdge(0, 1);
        g.addEdge(0, 2);
        g.addEdge(0, 3);
        g.addEdge(0, 4);
        g.addEdge(1, 2);
        g.addEdge(1, 3);
        g.addEdge(2, 3);
        System.out.println("V = " + g.vertices() + ", E = " + g.edges());
        System.out.println("average degree = " + (2.0 * g.edges() / g.vertices()));
        System.out.println("average path length = " + averagePathLength(g));
        System.out.println("clustering coefficient = " + clustering(g));
    }
}
` },

    { t: 'p', html:
      '输出四行：<code>V = 5, E = 7</code>、<code>average degree = 2.8</code>、' +
      '<code>average path length = 1.3</code>、<code>clustering coefficient = 0.875</code>。' +
      '平均路径为什么这么小？因为顶点 0 和所有其他点直接相连：20 个有序点对的距离总和只有 26，' +
      '平均 26/20 = 1.3——这个网络"直径小、四通八达"。' +
      '聚类系数 0.875 的意思是：邻居之间几乎都互相认识（0 的 4 个邻居里有 3 对相连，系数 0.5；' +
      '其余三个点的邻居两两相连，系数都是 1；顶点 4 度数只有 1，不参与平均）。' +
      '<b>小路径 + 高聚类 = 小世界</b>：这正是真实社交网络的样子。'
    },

    { t: 'callout', kind: 'note', title: '教材的 SmallWorld 程序', html:
      '教材 §4.5 最后给了一个 <code>SmallWorld</code> 程序，对 <code>tinyGraph.txt</code> 跑出：' +
      '<code>5 vertices, 7 edges</code>、<code>average degree = 2.800</code>、' +
      '<code>average path length = 1.300</code>、<code>clustering coefficient = 0.767</code>。' +
      '前三个数字与上面的程序一致；第四个数字不同，是因为教材的聚类系数用了"百分比取整"的写法，' +
      '而且对度数小于 2 的顶点按 0 计入平均——<b>同一个定义换个实现细节，结果就可能不同</b>。' +
      '这也是做数据分析时常踩的坑：看到数字之前，先看定义和公式。'
    },

    { t: 'h', text: '七、小世界从哪来', id: 'ch19-7' },

    { t: 'p', html:
      '一个高聚类的网络（邻居彼此都认识）通常意味着"局部很稠密"，但稠密也意味着路径长：' +
      '如果所有人都只在邻居圈里认识人，那从村东头到村西头要绕很多圈。' +
      '反过来，一个随机连边的网络路径很短，但几乎没有聚类（谁跟谁都不认识）。' +
      '<b>真实网络两者都有</b>：既抱团，又短。'
    },

    { t: 'p', html:
      'Watts 与 Strogatz 在 1998 年给出了解释：从"规则网格"出发，每个点连左右最近的几个邻居（高聚类、长路径），' +
      '然后<b>随机重连一小部分边</b>——哪怕只有 1% 的长程边，平均路径长度也会骤降，' +
      '而聚类系数几乎不变。这种"局部规则 + 少量捷径"的结构后来被称为<b>小世界网络</b>。' +
      '社交网络里的"很少几个跨圈朋友"、互联网里的"少数几条骨干链路"，扮演的都是这种捷径角色。'
    },

    { t: 'table',
      head: ['网络类型', '平均路径', '聚类系数', '直观图景'],
      rows: [
        ['规则网格（只连邻居）', '长（随规模增长）', '高', '村里人只认识邻居，去外地要一层层问'],
        ['随机图（边随便连）', '很短（几跳）', '几乎为 0', '谁跟谁都不挨着，但处处能跳到'],
        ['小世界网络', '很短', '高', '邻居抱团，但有少数跨圈的朋友'],
        ['真实社交网络', '很短（3~6 跳）', '中高', 'Facebook 约 3.6，MSN 约 6.6']
      ],
      caption: '聚类和短路径通常互相矛盾，小世界网络是两者的"甜蜜点"' },

    { t: 'h', text: '八、图的更多应用', id: 'ch19-8' },

    { t: 'p', html:
      '图的用途远不止社交网络。地图导航找最短路线，本质是带权重的图搜索（Dijkstra 算法，' +
      '把 BFS 的"层数"换成"距离"，用优先队列代替普通队列）；编译器分析代码依赖、' +
      '构建系统判断谁先编译，用的是有向图与拓扑排序；网页排名（PageRank）是带权图上的迭代；' +
      '推荐系统用二分图（用户—物品）找相似邻居。<b>只要问题是"对象之间有关系"，图就是候选模型</b>。'
    },

    { t: 'table',
      head: ['问题', '模型', '算法'],
      rows: [
        ['两点是否连通', '无向图', 'DFS / BFS，O(V+E)'],
        ['两点最短跳数', '无权图', 'BFS，O(V+E)'],
        ['带距离的最短路径', '加权图', 'Dijkstra，O(E log V)'],
        ['是否有环', '有向图', 'DFS，回边检测'],
        ['任务执行顺序', '有向无环图', '拓扑排序'],
        ['网络有多"小"', '无向图', '平均路径长度 + 聚类系数'],
        ['哪些点最"中心"', '任意图', '中心性 / PageRank']
      ],
      caption: '把问题翻译成图之后，算法选择就变成了"图有没有权重、有没有方向"的判断' },

    { t: 'p', html: '换 BFS / DFS、换源点，看访问顺序与搜索树边怎么变——同一张图，两种走法。' },
    { t: 'lab', id: 'graph' },

    { t: 'keypoint', items: [
      { title: '图 = 顶点 + 边', html: '顶点是对象，边是关系；无向图对称，有向图带箭头；路径、连通、度数是最基本的概念。' },
      { title: '邻接表', html: '每个顶点存一条邻居表，空间 2E；注意无向图加边时两个方向都要加。' },
      { title: '度数性质', html: '所有顶点度数之和等于 2E（握手引理）；平均度数是网络紧密度最粗的指标。' },
      { title: 'DFS', html: '递归一路深入，标记已访问，代价 O(V+E)；能判断连通，但不保证最短路径。' },
      { title: 'BFS', html: '用队列按距离逐层扩展，第一次访问即最短距离；代价 O(V+E)，要额外 O(V) 队列空间。' },
      { title: '小世界', html: '平均路径长度很小（几跳）且聚类系数较高；社交网络、互联网都呈现这种结构。' },
      { title: '两个度量', html: '平均路径 = 所有点对最短距离的平均；聚类系数 = 邻居间实际边数 / 可能的边数。' },
      { title: '为什么短', html: '少量"捷径边"（随机长程连接）就能把平均路径大幅拉低，而聚类几乎不变。' }
    ] },

    { t: 'quiz', qid: 'ch19-q1' },
    { t: 'quiz', qid: 'ch19-q2' },
    { t: 'quiz', qid: 'ch19-q3' },

    { t: 'checklist', id: 'ch19', items: [
      '我能把一个真实场景抽象成顶点与边，并说明关系为什么对称',
      '我能用邻接表实现无向图，并解释 addEdge 为什么要加两次',
      '我能用 DFS 判断两个点是否连通，并说出它的代价',
      '我能用 BFS 求出两点最短距离，并解释为什么第一次访问就是最短',
      '我能说清 DFS 与 BFS 在访问顺序上的区别',
      '我能手算一个小网络的平均度数、平均路径长度与聚类系数',
      '我能解释小世界现象为什么会出现（规则 + 少量捷径）',
      '我能说出 BFS 与 DFS 在导航、依赖分析、推荐系统里的用途',
      '我能区分"无权图最短跳数"与"带权图最短距离"的算法'
    ] },

    { t: 'p', html:
      '<b>延伸阅读</b>：Sedgewick《Computer Science: An Interdisciplinary Approach》§4.5（Small-World Phenomenon），' +
      '从 Kevin Bacon 的游戏讲到图的数据类型、BFS、逆索引与小世界度量；' +
      '站内第 17 章「栈与队列」的队列是 BFS 的核心，第 18 章「符号表」把顶点映射到距离/访问标记；' +
      '想动手可以到实验台试试图与搜索的小实验，或在题库里按 ch19 筛选练习。'
    },

    { t: 'h', text: '下一站：更多算法', id: 'ch19-next' },

    { t: 'p', html:
      '图之后，算法世界还有几块大主题：<b>带权图的最短路径</b>（Dijkstra）、<b>最小生成树</b>（Prim/Kruskal）、' +
      '<b>字符串匹配</b>（KMP / 正则）、<b>动态规划</b>（把大问题拆成重叠子问题）。' +
      '这些内容在后续的数据结构课程里会继续展开。本章留下的两个工具——' +
      '<b>BFS 的距离数组</b>与<b>邻接表</b>——是它们的共同基础。' +
      '如果你现在能自己写出"从一个人到另一个人隔几层朋友"的程序，就已经掌握了图搜索的核心。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '图搜索是检查 AI 是否真懂的好题材：① 让 AI 写 BFS，看它是否用队列、是否在入队时标记' +
      '（很多实现会漏标记导致重复入队）；② 问它"DFS 能不能求最短路径"，如果答"能"就要追问反例；' +
      '③ 给它一张图让它算平均路径长度，看它是否对每个点都跑一次 BFS 而不是"猜"；' +
      '④ 问"为什么加 1% 的随机边就能让平均路径骤降"，让它说清捷径如何缩短长路径。' +
      '反过来，你可以把 Kevin Bacon 的图问题写给 AI，让它和你的手算结果对照。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：顶点与边、无向图与有向图、邻接表表示与图 API、深度优先搜索、' +
      '广度优先搜索与最短路径、小世界现象（六度分隔 / Kevin Bacon）、' +
      '平均路径长度与聚类系数、小世界网络的形成原因、图的常见应用。<br>' +
      '依据：Sedgewick《Computer Science: An Interdisciplinary Approach》§4.5（Small-World Phenomenon）；' +
      'Course Outline v5 中数据结构部分的图与小世界。本站为个人整理的学习材料，' +
      '与课程要求冲突时以老师和课程大纲为准；所有示例输出均在本站 Java 引擎里实跑核对。'
    }
  ]
});
