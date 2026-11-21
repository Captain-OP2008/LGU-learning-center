/* =====================================================================
 * data/ch15.js · 第 15 章：案例研究：渗流模拟
 * 职责：相变问题 → 布尔矩阵建模 → 垂直渗流 → 蒙特卡洛估计 →
 *       递归 DFS 完整渗流 → 自适应绘图与阈值 → 效率与排坑。
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5；可运行代码均用站内 Java
 * 引擎执行核对（确定性 LCG 随机数，输出可复现）。
 * 教材依据：Sedgewick §2.4（Percolation）。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch15',
  num: '15',
  title: '案例研究：渗流模拟',
  en: 'Case Study: Percolation',
  goals: [
    '能用 n×n 布尔矩阵表示「阻塞/开放」网格，并说清 full 与 percolates 的定义',
    '能写出垂直渗流算法，并说明它为什么只是一个「更容易的替代问题」',
    '能用蒙特卡洛方法估计渗流概率，并解释样本量与误差的关系',
    '能用递归 DFS 实现完整的上下左右连通判定，并对照垂直版本的结果',
    '能描述渗流阈值约 0.593、n 增大时曲线趋于阶跃的相变现象'
  ],
  kp: [
    { id: 'ch15-1', title: '渗流模型与相变问题' },
    { id: 'ch15-2', title: '布尔矩阵与数据表示' },
    { id: 'ch15-3', title: '垂直渗流：先解一个容易的版本' },
    { id: 'ch15-4', title: '蒙特卡洛估计与误差' },
    { id: 'ch15-5', title: '完整渗流：递归 DFS' },
    { id: 'ch15-6', title: '自适应绘图与阈值 0.593' },
    { id: 'ch15-7', title: '效率：n²T 与数十亿次操作' },
    { id: 'ch15-8', title: '常见错误与调试' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '把两种材料混在一起：一种导电、一种绝缘。金属颗粒占多大比例时，整块材料才会导电？' +
      '把咖啡倒进多孔岩石，水能不能渗到底部？森林火灾会烧掉多大一片？' +
      '这些问题看起来毫不相干，却共用同一个数学模型——<b>渗流</b>（percolation）：' +
      '一个 n×n 的网格，每格以概率 p 开放，从上到下有没有一条连通的开放路径？' +
      '奇怪的是，这个问题<b>没有简单的公式解</b>；但它可以用几十行程序模拟出来。' +
      '更神奇的是，随着 p 增大，系统会从「几乎不可能渗流」突然变成「几乎一定渗流」——这就是<b>相变</b>。' +
      '本章用「垂直渗流 → 蒙特卡洛 → 递归 DFS → 自适应绘图」四步，把这个现象算清楚。'
    },

    { t: 'p', lead: true, html:
      '这一章是「二维数组 + 递归 + 随机模拟」的综合案例。建议按顺序读：先接受一个粗糙的近似（垂直渗流），' +
      '再用随机试验估计概率，最后补上真正的上下左右连通判定。每一步都比上一步更接近真相，' +
      '而每一步都能独立运行、独立验证——这也是实际写程序的常见方式。'
    },

    { t: 'h', text: '一、模型：网格、开放、连通', id: 'ch15-1' },

    { t: 'p', html:
      '取一个 n×n 的网格。每格有两种状态：<b>blocked（阻塞）</b>或 <b>open（开放）</b>。' +
      '我们关心的是「水从顶部渗到底部」：把顶行的每个 open 格想象成进水口，' +
      '水只能沿着<b>上下左右相邻</b>的 open 格流动，不能斜着走。' +
      '一个 open 格如果与顶行通过这样的路径连通，就叫 <b>full</b>；' +
      '如果底行出现了 full 格，就说这个系统 <b>percolates</b>（渗流成功）。'
    },

    { t: 'table',
      head: ['领域', 'blocked 格', 'open 格', 'percolates 的含义'],
      rows: [
        ['材料科学', '绝缘颗粒', '金属颗粒', '整块材料导电'],
        ['多孔介质', '岩石', '空隙', '水/油渗到井底'],
        ['森林火灾', '未着火树木', '已燃树木', '火势蔓延到对岸'],
        ['疾病传播', '未感染', '已感染', '疫情跨区域扩散'],
        ['互联网', '断开的链路', '连通的链路', '任意两台主机可通信']
      ],
      caption: '同一个抽象，五种完全不同的应用。建模的价值就在于「换掉故事，算法不变」。'
    },

    { t: 'p', html:
      '问题的核心是一个「临界概率」：独立地让每格以概率 p 开放，p 多大时系统才会渗流？' +
      '注意是<b>独立</b>：每格是否开放互不影响。这样整个网格就是一个随机对象，' +
      '「是否渗流」也是一个随机事件。我们想问的是它的概率 <code>P(percolates)</code> 随 p 怎么变。' +
      '理论上没有闭式解，所以只能<b>数值实验</b>：生成很多张随机网格，数一数有多少张渗流了。'
    },

    { t: 'h', text: '二、数据表示：为什么用布尔矩阵', id: 'ch15-2' },

    { t: 'p', html:
      '教材先把网格编码成 int：0 表示空、1 表示 blocked、2 表示 full。这样能省一点内存，也能直接打印数字图。' +
      '但更清晰的写法是三个独立的布尔矩阵：<code>isOpen[i][j]</code> 表示是否开放，' +
      '<code>isFull[i][j]</code> 表示是否与顶部连通，<code>flow</code> 负责计算，三者职责分明。' +
      '本章的可运行代码用 <code>int[][]</code> 的 0/1 表示（0 = blocked，1 = open），只是为了让输入矩阵能直接写在代码里、打印也直观；' +
      '算法本身与布尔矩阵完全等价。'
    },

    { t: 'callout', kind: 'note', title: '专业提示：接口比表示更重要', html:
      '教材的脚手架 Percolation 定义了三个函数：<code>flow(isOpen)</code>（返回 isFull）、' +
      '<code>percolates(isOpen)</code>（flow 后检查底行）、<code>show(isOpen)</code>（画图）。' +
      '只要这个接口不变，把垂直渗流换成递归 DFS 时，调用方一行都不用改。' +
      '这就是「模块化」的实际好处：<b>先定接口，再换实现</b>。'
    },

    { t: 'h', text: '三、先解一个容易的版本：垂直渗流', id: 'ch15-3' },

    { t: 'p', html:
      '完整的「上下左右连通」要处理四个方向，容易写错。教材的建议是：<b>先解一个更简单的问题</b>。' +
      '垂直渗流只允许水往<b>下</b>流（不许左右、不许向上），于是有递推：' +
      '第一行 full 当且仅当 open；第 i 行第 j 列 full 当且仅当「它自己 open」并且「正上方 full」。' +
      '两个嵌套循环就能算完，没有递归、没有方向判断。下面这段代码把教材 <code>test5.txt</code> 的 5×5 矩阵写在数组里。'
    },

    { t: 'code', caption: 'VerticalPercolation.java —— 5×5 网格的垂直渗流（可直接运行）', code:
`public class VerticalPercolation {
    public static void main(String[] args) {
        int n = 5;
        int[][] isOpen = {
            {0, 1, 1, 0, 1},
            {0, 0, 1, 1, 1},
            {1, 1, 0, 1, 1},
            {1, 0, 0, 0, 1},
            {0, 1, 1, 1, 1}
        };
        int[][] isFull = new int[n][n];
        for (int j = 0; j < n; j++) {
            isFull[0][j] = isOpen[0][j];
        }
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (isOpen[i][j] == 1 && isFull[i - 1][j] == 1) {
                    isFull[i][j] = 1;
                }
            }
        }
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (j > 0) System.out.print(" ");
                System.out.print(isFull[i][j]);
            }
            System.out.println();
        }
        boolean percolates = false;
        for (int j = 0; j < n; j++) {
            if (isFull[n - 1][j] == 1) percolates = true;
        }
        System.out.println(percolates);
    }
}
` },

    { t: 'p', html:
      '输出前 5 行是 isFull 矩阵：<code>0 1 1 0 1</code> / <code>0 0 1 0 1</code> / <code>0 0 0 0 1</code> / ' +
      '<code>0 0 0 0 1</code> / <code>0 0 0 0 1</code>，最后一行 <code>true</code>——底行第 4 列是 full，所以渗流成功。' +
      '教材用同样的数据得到同样结果。注意第 3 行第 0 列明明是 open（值 1），但它上方第 2 行第 0 列是 0，' +
      '所以它永远接不到水；垂直版本会这样「漏判」，因为它不允许从侧面绕过去。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 递推方向', html: '垂直渗流是从上往下<b>逐行</b>递推，所以外层循环必须是行、内层是列；顺序反了会用到还没算好的值。' },
      { title: '检查点 · 底行判定', html: '判断 percolates 只能看<b>最后一行</b>有没有 full，不能看中间任何一行。' }
    ] },

    { t: 'h', text: '四、蒙特卡洛：用随机试验估计概率', id: 'ch15-4' },

    { t: 'p', html:
      '现在让每格独立地以概率 p 开放：生成一个 [0,1) 随机数，小于 p 就开放。' +
      '于是每张网格都是一个随机样本；把「这张网格是否渗流」看成一个 0/1 结果，' +
      '重复 <code>trials</code> 次，渗流次数除以 trials 就是概率的估计。' +
      '这就是<b>蒙特卡洛方法</b>：用大量随机试验逼近一个算不出来的量。' +
      '注意 p 恰好是每格开放的概率，所以 p 越大，网格越「通透」，渗流概率越高。'
    },

    { t: 'code', caption: 'PercolationEstimate.java —— 固定种子，估计 p=0.55/0.65/0.75 的渗流概率', code:
`public class PercolationEstimate {
    static long seed = 20261112L;

    static double random() {
        seed = (seed * 1103515245L + 12345L) % 2147483648L;
        return seed / 2147483648.0;
    }

    static boolean percolates(int n, double p) {
        int[][] isOpen = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (random() < p) isOpen[i][j] = 1;
            }
        }
        int[][] isFull = new int[n][n];
        for (int j = 0; j < n; j++) isFull[0][j] = isOpen[0][j];
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (isOpen[i][j] == 1 && isFull[i - 1][j] == 1) isFull[i][j] = 1;
            }
        }
        for (int j = 0; j < n; j++) {
            if (isFull[n - 1][j] == 1) return true;
        }
        return false;
    }

    static double estimate(int n, double p, int trials) {
        int count = 0;
        for (int t = 0; t < trials; t++) {
            if (percolates(n, p)) count++;
        }
        return (double) count / trials;
    }

    public static void main(String[] args) {
        int n = 10;
        int trials = 100;
        double[] ps = {0.55, 0.65, 0.75};
        for (int k = 0; k < ps.length; k++) {
            System.out.printf("p = %.2f  estimate = %.3f%n", ps[k], estimate(n, ps[k], trials));
        }
    }
}
` },

    { t: 'p', html:
      '输出（固定种子，可复现）：<code>p = 0.55  estimate = 0.020</code> / <code>p = 0.65  estimate = 0.170</code> / ' +
      '<code>p = 0.75  estimate = 0.410</code>。三行结果单调上升，但数值比直觉小得多：' +
      '垂直渗流只认「同一列从上到下全部 open」，概率约等于 <code>n·pⁿ</code>——' +
      'p=0.55 时约 0.025，p=0.75 时才约 0.56，所以即使 75% 的格子开放，也只有约四成网格能渗流。' +
      '另外 n=10、trials=100 的样本很小，0.170 与理论值 0.135 的差距主要来自抽样波动；' +
      '想稳定到两位小数，trials 要上万，这也是教材用 <code>trials = 10000</code> 的原因。'
    },

    { t: 'callout', kind: 'warn', title: '别把「估计」当「精确值」', html:
      '蒙特卡洛结果是<b>带误差的</b>。trials 越大，误差越小，但代价线性增长；' +
      '更要紧的是，垂直渗流会<b>系统性低估</b>：它要求同一列一路开放，忽略了水从侧面绕行的可能。' +
      '把 p=0.75 时 0.410 的结果和下一节的完整 DFS 一比，差距立刻显现——这也正是要补上四向连通的原因。'
    },

    { t: 'h', text: '五、完整渗流：递归 DFS', id: 'ch15-5' },

    { t: 'p', html:
      '上一节那组 0.02 / 0.17 / 0.41 明显偏低，缺的就是「左右」两个方向。' +
      '要把四个方向都算进去，最自然的办法是<b>深度优先搜索</b>（DFS）：从顶行每个 open 格出发，' +
      '标记它 full，然后递归地访问它上、下、左、右的邻居。递归的关键是「先判断能不能进」：' +
      '越界、blocked、已经 full，这三种情况立刻返回，否则标记后再向四个方向扩散。' +
      '下面的程序把教材的 <code>test8.txt</code> 8×8 矩阵写在代码里，用一条递归函数算出完整渗流。'
    },

    { t: 'code', caption: 'PercolationDFS.java —— 8×8 网格的四向连通（递归，可直接运行）', code:
`public class PercolationDFS {
    static int n = 8;
    static int[][] isOpen;
    static int[][] isFull;

    static void flow(int i, int j) {
        if (i < 0 || i >= n) return;
        if (j < 0 || j >= n) return;
        if (isOpen[i][j] == 0) return;
        if (isFull[i][j] == 1) return;
        isFull[i][j] = 1;
        flow(i + 1, j);
        flow(i, j + 1);
        flow(i, j - 1);
        flow(i - 1, j);
    }

    public static void main(String[] args) {
        int[][] grid = {
            {0, 0, 1, 1, 1, 0, 0, 0},
            {1, 0, 0, 1, 1, 1, 1, 1},
            {1, 1, 1, 0, 0, 1, 1, 0},
            {0, 0, 1, 1, 0, 1, 1, 1},
            {0, 1, 1, 1, 0, 1, 1, 0},
            {0, 1, 0, 0, 0, 0, 1, 1},
            {1, 0, 1, 0, 1, 1, 1, 1},
            {1, 1, 1, 1, 0, 1, 0, 0}
        };
        isOpen = grid;
        isFull = new int[n][n];
        for (int j = 0; j < n; j++) {
            flow(0, j);
        }
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (j > 0) System.out.print(" ");
                System.out.print(isFull[i][j]);
            }
            System.out.println();
        }
        boolean percolates = false;
        for (int j = 0; j < n; j++) {
            if (isFull[n - 1][j] == 1) percolates = true;
        }
        System.out.println(percolates);
    }
}
` },

    { t: 'p', html:
      '输出（8 行 isFull + true）：<code>0 0 1 1 1 0 0 0</code> / <code>0 0 0 1 1 1 1 1</code> / ' +
      '<code>0 0 0 0 0 1 1 0</code> / <code>0 0 0 0 0 1 1 1</code> / <code>0 0 0 0 0 1 1 0</code> / ' +
      '<code>0 0 0 0 0 0 1 1</code> / <code>0 0 0 0 1 1 1 1</code> / <code>0 0 0 0 0 1 0 0</code>，' +
      '最后 <code>true</code>。把它和垂直版本对比：第 6 行开头有几个 open 格，垂直版本接不到水，' +
      '而 DFS 让水从右侧绕过来，把它们也点成了 full。<b>这就是「完整渗流」多出来的那部分连通性。</b>'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 三个早退条件', html: '越界、blocked、已访问——缺一个就会栈溢出或死循环；顺序无所谓，但必须都有。' },
      { title: '检查点 · 顶行入口', html: 'DFS 的起点必须是顶行（<code>flow(0, j)</code>），不是左上角一个点。' }
    ] },

    { t: 'h', text: '六、把阈值画出来：自适应绘图', id: 'ch15-6' },

    { t: 'p', html:
      '一个个 p 手算太慢。教材的 <code>PercolationPlot</code> 用<b>递归二分</b>自动决定在哪里多取点：' +
      '对区间 [x0,x1] 取中点 xm，估计 P(xm)，如果曲线在这一段「不够陡」，就直接用直线连接两端；' +
      '如果变化还很大（|ym − fxm| 超过误差限度），就把区间一分为二继续细化。' +
      '由于阈值附近曲线最陡，递归会在那里自动加密采样点——这正是「自适应」的含义。' +
      '下面这段教材原程序依赖 StdDraw 绘图库，站内不执行，只作静态阅读。'
    },

    { t: 'code', run: false, caption: 'PercolationPlot.java —— 自适应采样并画曲线（教材库 · 需本地 JDK + algs4.jar）', code:
`public class PercolationPlot {
    public static void curve(int n, double x0, double y0,
                             double x1, double y1) {
        double gap = 0.01;
        double err = 0.0025;
        int trials = 10000;
        double xm = (x0 + x1) / 2;
        double ym = (y0 + y1) / 2;
        double fxm = PercolationProbability.estimate(n, xm, trials);
        if (x1 - x0 < gap || Math.abs(ym - fxm) < err) {
            StdDraw.line(x0, y0, x1, y1);
            return;
        }
        curve(n, x0, y0, xm, fxm);
        StdDraw.filledCircle(xm, fxm, 0.005);
        curve(n, xm, fxm, x1, y1);
    }
}
` },

    { t: 'p', html:
      '运行 <code>curve(100, 0.4, 0, 0.6, 1)</code> 会得到一条 S 形曲线：p 小于 0.5 时几乎为 0，' +
      'p 大于 0.65 时几乎为 1，急剧上升的区间集中在 <b>0.593 附近</b>。' +
      '这个数随网格类型略有不同（正方形格点、独立开放），但「存在一个尖锐的阈值」是普遍现象。' +
      'n 越大，曲线越像一级台阶：小网格里还有不少「侥幸连通」，大网格里概率几乎非 0 即 1。'
    },

    { t: 'svg', maxW: 760, caption: '渗流概率随 p 的变化（示意）：n=10 时曲线平缓，n=100 时在 0.593 附近几乎垂直——这就是相变。', html:
`<svg viewBox="0 0 760 320" role="img" aria-label="渗流概率随开放概率 p 变化的 S 形曲线">
  <text x="24" y="26" font-size="13" font-weight="700" fill="var(--accent)">P(percolates) 随 p 的变化</text>
  <line x1="80" y1="260" x2="720" y2="260" stroke="var(--line2)" stroke-width="1.2"/>
  <line x1="80" y1="60" x2="80" y2="260" stroke="var(--line2)" stroke-width="1.2"/>
  <text x="72" y="264" font-size="11" text-anchor="end" fill="var(--text3)">0</text>
  <text x="72" y="164" font-size="11" text-anchor="end" fill="var(--text3)">0.5</text>
  <text x="72" y="64" font-size="11" text-anchor="end" fill="var(--text3)">1</text>
  <text x="400" y="292" font-size="11" text-anchor="middle" fill="var(--text3)">开放概率 p →</text>
  <line x1="378" y1="60" x2="378" y2="260" stroke="var(--warn)" stroke-width="1" stroke-dasharray="5 4"/>
  <text x="386" y="76" font-size="11" fill="var(--warn)">阈值 ≈ 0.593</text>

  <path d="M 90 256 C 240 252, 320 240, 360 210 C 390 180, 400 120, 440 92 C 500 70, 600 62, 710 60"
        fill="none" stroke="var(--text3)" stroke-width="2.5" stroke-dasharray="6 5"/>
  <path d="M 90 258 C 300 258, 350 255, 372 200 C 380 150, 384 120, 390 90 C 400 68, 430 62, 710 60"
        fill="none" stroke="var(--accent)" stroke-width="3"/>
  <circle cx="372" cy="200" r="3.5" fill="var(--accent)"/>
  <circle cx="390" cy="90" r="3.5" fill="var(--accent)"/>

  <text x="150" y="236" font-size="11" fill="var(--text3)">n = 10（平缓）</text>
  <text x="470" y="120" font-size="11" fill="var(--accent)">n = 100（陡峭）</text>
  <text x="100" y="60" font-size="11" fill="var(--text3)">p &lt; 阈值：几乎不渗流</text>
  <text x="560" y="250" font-size="11" fill="var(--text3)">p &gt; 阈值：几乎必渗流</text>
</svg>`
    },

    { t: 'callout', kind: 'note', title: '为什么叫「相变」', html:
      '物理里的相变（冰→水）也是某个参数越过临界值后整体性质突变。渗流模型里，' +
      'p 越过阈值时「存在贯穿路径」这一宏观性质突然出现，所以被称为<b>几何相变</b>。' +
      '蒙特卡洛模拟是研究这类问题的标准工具——当解析公式不存在时，数值实验就是显微镜。'
    },

    { t: 'h', text: '七、效率：为什么教材反复强调 n² 和 trials', id: 'ch15-7' },

    { t: 'p', html:
      '一次 <code>estimate</code> 的代价是：生成网格 O(n²)，渗流检测 O(n²)（DFS 每格最多访问一次），' +
      '重复 trials 次，总计 <b>O(n²·trials)</b>。这个式子直接决定了你能算多大的问题：'
    },

    { t: 'table',
      head: ['n', 'trials', '网格格数', '总操作量级'],
      rows: [
        ['10', '100', '100', '约 1 万'],
        ['100', '10000', '10,000', '约 1 亿'],
        ['1000', '10000', '1,000,000', '约 100 亿']
      ],
      caption: 'n 增大 10 倍，总操作量 ×100；trials 增大 10 倍，总操作量 ×10。自适应绘图在 n=100 时就要跑几十亿次操作，所以教材说「这段代码会被执行数十亿次」。'
    },

    { t: 'p', html:
      '看到 10⁹ 量级就要警惕：普通电脑每秒约 10⁸–10⁹ 次简单操作，这意味着几分钟到几十分钟。' +
      '教材借此讲两条工程经验：① <b>先写清楚，再优化</b>——垂直渗流的 20 行代码让你先看到趋势；' +
      '② <b>复杂度决定可行性</b>——如果算法是 O(n³) 而不是 O(n²)，n=1000 时根本无法运行。' +
      '真正的高性能版本会用并查集（union-find）把每次检测降到接近 O(n²)，但那是数据结构课程的内容，本章只需要知道「复杂度会卡住你」。'
    },

    { t: 'h', text: '八、常见错误与调试', id: 'ch15-8' },

    { t: 'steps', items: [
      '把「open」和「full」混成一个矩阵：一边生成一边标记，会破坏「原始网格」这个输入；分开两个矩阵（或两份布尔数组）最稳。',
      'DFS 忘写「已访问」判断：同一个格子被反复进入，轻则重复计算，重则无限递归、栈溢出。',
      '越界判断写在访问数组之后：<code>if (isFull[i][j] == 1)</code> 在 i = -1 或 n 时会直接抛数组越界异常；必须先判范围。',
      '随机数种子固定后反复调用 <code>estimate</code>：多个估计之间的样本其实是连续的随机序列，调试时没问题，但别因此断言「两个 p 的结果完全独立」。',
      '把蒙特卡洛结果当成阈值：垂直渗流低估、n=10 时格子太少，得到的 0.36/0.64/0.79 只能说明趋势；真正的阈值要用完整渗流 + 大 n + 大 trials 逼近。',
      '递归 DFS 栈深度：n 很大时递归调用层数可达 n²，可能栈溢出；工程上常改成显式栈的迭代版本。'
    ] },

    { t: 'p', html:
      '最值得记住的一条：<b>先解一个更容易的问题</b>。垂直渗流只允许向下，虽然会低估渗流，' +
      '但它只用 20 行就验证了「矩阵、full 标记、底行判定」这整套骨架；' +
      '骨架对了，再把「向下」换成「上下左右递归」，问题就只剩一个递归函数。' +
      '这也是教材反复示范的增量开发方式：<b>每步都保持可运行、可验证</b>。'
    },

    { t: 'p', html: '把开格概率 p 从低往高推，盯住渗流发生的那一下突变：少数几条连通路径就足以贯通整个网格。' },
    { t: 'lab', id: 'percolation' },

    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch15-q1' },
    { t: 'quiz', qid: 'ch15-q2' },
    { t: 'quiz', qid: 'ch15-q3' },

    { t: 'keypoint', items: [
      { title: '渗流', html: '每格独立以概率 p 开放；顶端进、底端出现 full 则 percolates。' },
      { title: 'full', html: '与顶行通过上下左右 open 格连通的格；判定顺序是「越界 → blocked → 已访问」。' },
      { title: '垂直渗流', html: '只允许向下，递推 <code>isFull[i][j] = isOpen[i][j] &amp;&amp; isFull[i-1][j]</code>；会低估渗流。' },
      { title: '蒙特卡洛', html: '随机生成 trials 张网格，数渗流比例；误差随 trials 增大而减小，代价线性增长。' },
      { title: '完整渗流', html: '顶行每个 open 格启动 DFS，四向递归标记 full；结果不少于垂直版本。' },
      { title: '相变', html: '阈值约 0.593；n 越大曲线越陡，从「几乎不渗」突变为「几乎必渗」。' },
      { title: '复杂度', html: 'estimate 为 O(n²·trials)；n=100、trials=10000 就是 10⁸ 量级。' }
    ] },

    { t: 'checklist', id: 'ch15', items: [
      '我能用 n×n 布尔矩阵表示渗流网格，并写出 full 与 percolates 的定义',
      '我能从上往下逐行递推，写出垂直渗流的实现',
      '我能说明垂直渗流为什么只是一个近似、它在哪类网格上会低估结果',
      '我能在代码里用随机数按概率 p 生成一张网格',
      '我能实现蒙特卡洛估计，并解释 trials 增大时误差和代价如何变化',
      '我能写出四向递归 DFS，并说清三个早退条件',
      '我能对比垂直版本与 DFS 版本的 isFull 矩阵，指出差异来自哪里',
      '我能描述阈值约 0.593 与「n 增大曲线趋于阶跃」的相变现象',
      '我能估算 estimate(n, p, trials) 的复杂度，并判断 10⁹ 量级是否可行'
    ] },

    { t: 'p', html:
      '<b>延伸阅读</b>：Sedgewick《Computer Science: An Interdisciplinary Approach》§2.4（Percolation）' +
      '完整给出脚手架、垂直渗流、概率估计、递归 DFS 与自适应绘图五个程序，以及 <code>test5.txt</code>/<code>test8.txt</code> 数据；' +
      '算法教材《Algorithms》第 1 章则用并查集把渗流检测做到接近线性。' +
      '站内第 8 章「数组与二维数组」、第 9 章「递归」是本章的语法基础，第 13 章「复杂度分析」解释了为什么 10⁹ 是分水岭。' +
      '想练手到 <a href="#/quiz/ch15">题库 · ch15</a> 按章筛选。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：渗流案例——网格模型与相变问题、布尔矩阵表示与脚手架接口、垂直渗流、蒙特卡洛估计、递归 DFS 完整渗流、自适应绘图与阈值 0.593、O(n²·trials) 复杂度、常见错误。<br>依据：Course Outline v5「Beyond the Basics」案例研究；Sedgewick §2.4（Percolation）与 §4.1（性能分析）。本站为个人整理的学习材料，与课程要求冲突时以老师和课程大纲为准；所有可运行代码均由站内 Java 子集引擎执行核对，随机结果为固定种子下的真实输出。' }

  ]
});
