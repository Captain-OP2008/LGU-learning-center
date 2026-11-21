/* =====================================================================
 * data/ch14.js · 第 14 章：项目二 · Gomoku 五子棋
 * 职责：从规则到控制台迭代 1（GomokuGame 的类设计、render、move、checkWin、
 *       平局判定），再迁移到 JavaFX（事件监听、StackPane+Line 与 Canvas 两种绘制）。
 * 对外 API：CSC.registerChapter({...})（block schema 见 _dev/CONTRACT.md §4–§5）
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch14',
  num: '14',
  title: '项目二：Gomoku 五子棋',
  en: 'Project II · Gomoku',
  goals: [
    '能写全五子棋规则：15×15、黑先、横竖斜五连、交叉点落子、不可重叠、满盘平局',
    '能设计 GomokuGame 类（字段、构造器、play 循环、render、humanInput、move、checkWin）并跑通控制台版',
    '能解释「8 个方向各自单向数」为什么漏判，并写出四条方向线双向延伸计数的 checkWin',
    '能用 totalMoves 判平局，说清它比每次扫棋盘省在哪里',
    '能把控制台版迁移到 JavaFX：事件监听替代 while 循环，StackPane+Line 与 Canvas 两种绘制各有什么代价'
  ],
  kp: [
    { id: 'ch14-1', title: '规则与棋盘：先定义什么叫赢' },
    { id: 'ch14-2', title: '控制台迭代 1：GomokuGame 的骨架' },
    { id: 'ch14-3', title: 'render：带行列号的棋盘' },
    { id: 'ch14-4', title: 'humanInput 与 move：四道校验' },
    { id: 'ch14-5', title: 'checkWin：从 8 方向到 4 条方向线' },
    { id: 'ch14-6', title: '平局：totalMoves 而不是扫棋盘' },
    { id: 'ch14-7', title: 'JavaFX：事件监听替代 while 循环' },
    { id: 'ch14-8', title: '两种画棋盘：StackPane+Line vs Canvas' },
    { id: 'ch14-9', title: '项目难点、评分与扩展' }
  ],
  blocks: [

    /* ---------------------------------------------------------------- 开篇 */
    { t: 'callout', kind: 'why', html:
      '项目二同样占 <b>20%</b>，官方要求是用 Java 写五子棋（Gomoku，「Five In A Row」），' +
      '技术点是 <b>Java Class and Inheritance</b> 与 <b>Java GUI</b>。规则一句话说得完：15×15 棋盘、黑先、' +
      '横竖斜先连成五子者胜。但它也是整个课程里边界最多的小项目：落点越界、重复落子、胜负漏判、' +
      '赢家已定还能继续下、棋盘下满谁也没赢……<br>' +
      '期末考只考与项目紧密相关的知识，而判胜负这段代码几乎每次都以简答或编程题出现。' +
      '这一章按 Tutorial 5/6/7 的路线：先用控制台版把游戏逻辑做对，再搬到 JavaFX——只换输入输出，不动规则。'
    },

    { t: 'p', lead: true, html:
      '先把规则做对，再谈界面。控制台版不是过渡产物，而是之后所有调试的基准。'
    },

    /* ---------------------------------------------------------------- 一 */
    { t: 'h', text: '一、规则与棋盘：先定义什么叫赢', id: 'ch14-1' },

    { t: 'p', html:
      '课程把规则拆成一张表：15×15 的<b>棋盘（board）</b>；黑棋（Player 1）先下；' +
      '横、竖、斜三个方向先连成五子者胜；棋子必须下在线的<b>交叉点（intersection）</b>上；' +
      '不能下在已有棋子的位置；游戏结束后不能继续落子；棋盘被占满且无人连成五子就是<b>平局（draw）</b>。' +
      '注意「五连」指<b>至少</b>五子——六连、七连同样算赢，课程不涉及禁手规则。'
    },

    { t: 'p', html:
      '数据建模只需一个二维数组：<code>char[][] board = new char[SIZE][SIZE]</code>。' +
      '内部状态建议用 0（空）、1（黑）、2（白），显示时才映射成 <code>+</code>、<code>X</code>、<code>O</code>；' +
      '把 <code>SIZE</code> 写成常量，你就得到免费的第二块棋盘：改成 5 就能在几十步内测出平局。'
    },

    { t: 'terms', cols: 2, items: [
      { en: 'board', zh: '棋盘', html: '15×15 的二维数组，<code>board[row][col]</code> 存一格的落子状态。' },
      { en: 'intersection', zh: '交叉点', html: '线交叉的位置，棋子只能下在这里，不是格子里。' },
      { en: 'draw', zh: '平局', html: '棋盘满且任何方向都不足五连；用总步数判断最快。' },
      { en: 'currentPlayer', zh: '当前执子方', html: '轮到谁下；每次合法落子后必须切换。' }
    ] },

    { t: 'callout', kind: 'warn', title: '用户输入 1..15，数组下标 0..14', html:
      '棋盘坐标是给人看的第 1 行到第 15 行，Java 数组是 0 到 14。换算只该在 <code>move()</code> 里做一次：' +
      '<code>board[row - 1][col - 1]</code>。如果 render 里再减一次、或者输入时减了 move 里又减，' +
      '棋子会整体错开一格——而棋盘看起来仍然「有棋子」，非常难发现。固定一条规则：<b>对外 1 起、对内 0 起，只在入口换算</b>。'
    },

    /* ---------------------------------------------------------------- 二 */
    { t: 'h', text: '二、控制台迭代 1：GomokuGame 的骨架', id: 'ch14-2' },

    { t: 'p', html:
      'Tutorial 5 的问题很直接：如果只做最简版，你怎么设计？答案是<i>一个类 + 一个循环</i>。' +
      '<code>GomokuGame</code> 的字段管状态：棋盘、当前执子方、游戏是否结束、赢家、总步数、输入用的 Scanner。' +
      '构造器初始化棋盘和这些状态，<code>play()</code> 是唯一的循环：<b>渲染 → 读坐标 → 落子</b>，' +
      '直到 <code>gameOver</code> 被 <code>checkWin</code> 改成 true 才退出。'
    },

    { t: 'code', run: false, caption: 'GomokuGame.java 骨架 —— 构造器初始化、play() 主循环、main 启动（其余方法见下两节）', code:
`import java.util.Scanner;

public class GomokuGame {
    private static final int SIZE = 15;
    private final char[][] board = new char[SIZE][SIZE];
    private int currentPlayer = 1;     // 1 = 黑（先手），2 = 白
    private int totalMoves = 0;
    private boolean gameOver = false;
    private int winner = 0;            // 0 表示无人获胜（含平局）
    private final Scanner scanner = new Scanner(System.in);

    public GomokuGame() {
        for (int r = 0; r < SIZE; r++) {
            for (int c = 0; c < SIZE; c++) {
                board[r][c] = '+';     // '+' 表示空位
            }
        }
    }

    public void play() {
        while (!gameOver) {
            render();
            int[] pos = humanInput();  // 读两个整数：行、列
            move(pos[0], pos[1]);      // 校验、落子、判胜负、切换执子方
        }
        render();                      // 结束时再画一次，让最后一步可见
        if (winner == 0) {
            System.out.println("Draw! No one wins.");
        } else {
            System.out.println("Player " + winner + " wins!");
        }
        scanner.close();               // 关闭输入流，程序干净退出
    }

    public static void main(String[] args) {
        new GomokuGame().play();
    }
}
` },

    { t: 'flow', nodes: [
      { title: '构造器初始化', desc: '棋盘全 +、currentPlayer = 1', kind: 'start' },
      { title: 'while (!gameOver)', desc: '进入或退出主循环', kind: 'decide' },
      { title: 'render()', desc: '打印带行列号的棋盘', kind: 'proc' },
      { title: 'humanInput()', desc: '读两个整数（行、列）', kind: 'proc' },
      { title: 'move(row, col)', desc: '四道校验 + 落子 + 判胜', kind: 'proc' },
      { title: 'checkWin() 改 gameOver', desc: '连五则结束；未连五则切换', kind: 'proc' },
      { title: '宣布结果并关闭输入', desc: 'winner 或平局', kind: 'end' }
    ] },

    { t: 'p', html:
      '<code>play()</code> 的三个职责写得很明确：渲染棋盘、读坐标、落子。<code>gameOver</code> 是唯一的循环条件——' +
      '不要在循环里另写 <code>break</code>，否则「谁改的状态」很快就会说不清。' +
      '循环退出后再调一次 <code>render()</code>，最后一步棋才会显示在终局棋盘上；' +
      '<code>scanner.close()</code> 放在末尾，对应 Tutorial 5 说的「游戏结束时关闭输入流」。'
    },

    /* ---------------------------------------------------------------- 三 */
    { t: 'h', text: '三、render：带行列号的棋盘', id: 'ch14-3' },

    { t: 'p', html:
      '输入是数字坐标，棋盘上就必须有数字。Tutorial 5 要求：显示行列号；未落子 <code>+</code>、黑子 <code>X</code>、' +
      '白子 <code>O</code>；遍历行列打印并注意对齐。15 列里有两位数（10–15），每列至少留 3 个字符宽，' +
      '否则列号错位、输入「看着对其实偏」——这是控制台最常见的假 bug。'
    },

    { t: 'code', run: false, caption: 'render() —— 列号一行、行号一列，每格固定 3 字符宽', code:
`public class GomokuGame {
    private static final int SIZE = 15;
    private final char[][] board = new char[SIZE][SIZE];

    public void render() {
        System.out.print("    ");                          // 空出左侧行号的位置
        for (int c = 1; c <= SIZE; c++) {
            System.out.printf("%3d", c);                   // 每列占 3 字符，两位数列号也对齐
        }
        System.out.println();
        for (int r = 0; r < SIZE; r++) {
            System.out.printf("%3d ", r + 1);              // 行号用 1 起
            for (int c = 0; c < SIZE; c++) {
                System.out.printf("%2c ", board[r][c]);    // 每格 "+  X  O" 占 3 字符
            }
            System.out.println();
        }
    }
}
` },

    { t: 'p', html:
      '<code>%3d</code> 与 <code>%2c</code> 是这段代码的全部技巧：给每个输出项固定宽度，列就不会因为数字位数变化而漂移。' +
      '用 <code>+</code> 而不是空格表示空位，是为了让交叉点显式可见——棋盘没有白纸，只有一串字符。'
    },

    { t: 'callout', kind: 'tip', title: 'render 是调试时的「可视化断点」', html:
      'GUI 版出问题时，最快的定位方式是把同一局棋回控制台版重放：控制台也对，问题在渲染；也错，问题在 move 或 checkWin。' +
      'Tutorial 5 强调：<code>render()</code> 在最终 GUI 版里可以不要，但为了让核心逻辑「完整、可测」，' +
      '控制台版必须保留它。'
    },

    /* ---------------------------------------------------------------- 四 */
    { t: 'h', text: '四、humanInput 与 move：四道校验', id: 'ch14-4' },

    { t: 'p', html:
      '<code>humanInput()</code> 只负责提示并用 <code>nextInt()</code> 读两个整数（空格分隔），返回 ' +
      '<code>{row, col}</code>。真正的逻辑在 <code>move()</code>，按顺序过四道关卡：' +
      '① 是否已结束；② 是否越界；③ 是否已有棋子；④ 落子并判胜负与平局。全部通过才写棋盘——' +
      '<b>校验必须在落子之前</b>，否则非法落子已经污染状态。'
    },

    { t: 'code', run: false, caption: 'humanInput() 与 move() —— 四道校验、落子、判胜、判平、切换执子方', code:
`import java.util.Scanner;

public class GomokuGame {
    private static final int SIZE = 15;
    private final char[][] board = new char[SIZE][SIZE];
    private int currentPlayer = 1;
    private int totalMoves = 0;
    private boolean gameOver = false;
    private int winner = 0;
    private final Scanner scanner = new Scanner(System.in);

    public int[] humanInput() {
        System.out.print("Player " + currentPlayer + ", input row col: ");
        int row = scanner.nextInt();       // 空白分隔的两个整数
        int col = scanner.nextInt();
        return new int[] {row, col};
    }

    public void move(int row, int col) {
        if (gameOver) {                                  // 校验 ①：已结束
            System.out.println("Game is over.");
            return;
        }
        if (row < 1 || row > SIZE || col < 1 || col > SIZE) {   // 校验 ②：越界
            System.out.println("Out of board! Enter 1.." + SIZE);
            return;
        }
        if (board[row - 1][col - 1] != '+') {            // 校验 ③：已占用
            System.out.println("This position is taken.");
            return;
        }
        board[row - 1][col - 1] = (currentPlayer == 1) ? 'X' : 'O';
        totalMoves++;                                    // 合法落子才计数

        if (checkWin(row - 1, col - 1)) {                // 胜负优先于平局
            winner = currentPlayer;
            gameOver = true;
            return;
        }
        if (totalMoves == SIZE * SIZE) {                 // 校验 ④：棋盘已满 → 平局
            gameOver = true;                             // winner 保持 0
            return;
        }
        currentPlayer = 3 - currentPlayer;               // 1 -> 2 -> 1
    }

    private boolean checkWin(int row, int col) {
        return false;                                    // 真正实现见下一节
    }
}
` },

    { t: 'p', html:
      '<code>currentPlayer = 3 - currentPlayer</code> 是切换执子方最省事的写法：1 变 2、2 变 1。' +
      '注意「先判胜负再判平局」的顺序：最后一步既连成五子又把棋盘填满时，应该判赢而不是平局。' +
      '落子后 <code>return</code> 是一个技巧——失败分支直接返回，主流程保持一条直线，读代码时不用记分支状态。'
    },

    { t: 'callout', kind: 'warn', title: '坐标顺序反了，程序不会报错', html:
      '用户习惯说「第 2 行第 3 列」，程序里却是 <code>board[row][col]</code>；一旦渲染和 move 用了不同的约定，' +
      '棋子会沿对角线镜像，看起来「有棋子、能玩」，但胜负全错。防御办法：写死提示语 <code>row col</code>，' +
      '并在第一次测试时只下 (1,2) 与 (2,1) 两个不同格子，肉眼确认它们落在正确位置。'
    },

    /* ---------------------------------------------------------------- 五 */
    { t: 'h', text: '五、checkWin：从 8 个方向到 4 条方向线', id: 'ch14-5' },

    { t: 'p', html:
      '判定胜负有两种策略。<b>全盘扫描</b>：每次落子后遍历棋盘找五连——正确但贵，还容易写漏斜线。' +
      '<b>从落点出发</b>：只有刚下的子可能造成新五连，只检查经过它的四条线。' +
      'Tutorial 5 选了后者：计算量固定，不必遍历棋盘。'
    },

    { t: 'p', html:
      '直觉的写法是「从落点出发，沿 8 个方向各数一遍同色棋子」。它看似覆盖了全部方向，' +
      '却漏掉一种情况：<b>落子补上中间空位，把左右两段接成五连</b>。' +
      '一行是 <code>X X . X X</code> 时黑棋落在中点：向右 2 颗、向左 2 颗，' +
      '每个方向含自己都只有 3 颗——但整条线已经是 5 颗。错误不在方向数量，而在于把「方向」当成了「线」。'
    },

    { t: 'code', run: false, caption: '错误示范 checkWinV1 —— 8 个方向各自单向数：中间补子时漏判', code:
`public class GomokuGame {
    private static final int SIZE = 15;
    private final char[][] board = new char[SIZE][SIZE];

    private boolean checkWinV1(int row, int col) {
        char stone = board[row][col];
        for (int dr = -1; dr <= 1; dr++) {
            for (int dc = -1; dc <= 1; dc++) {
                if (dr == 0 && dc == 0) {
                    continue;                       // 8 个方向 = {-1,0,1} x {-1,0,1} 去掉 (0,0)
                }
                int count = 1;                      // 只有单边，"补中间"时永远数不到 5
                int r = row + dr;
                int c = col + dc;
                while (r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r][c] == stone) {
                    count++;
                    r = r + dr;
                    c = c + dc;
                }
                if (count >= 5) {
                    return true;
                }
            }
        }
        return false;
    }
}
` },

    { t: 'p', html:
      '修法是把 8 个方向两两配对成 4 条线：横 <code>{0,1}</code>、竖 <code>{1,0}</code>、' +
      '主对角线 <code>{1,1}</code>、副对角线 <code>{1,-1}</code>。对每条线算三部分：' +
      '<b>自己 1 颗 + 正向连续数 + 反向连续数</b>，达到 5 就是五连。' +
      '这样「补中间」的情形正好把两边加起来，而「接在末端」的情形由单边贡献 4 颗，两种都覆盖。'
    },

    { t: 'code', run: false, caption: '正确的 checkWin() —— 4 条线、每条双向延伸计数', code:
`public class GomokuGame {
    private static final int SIZE = 15;
    private final char[][] board = new char[SIZE][SIZE];

    private boolean checkWin(int row, int col) {
        char stone = board[row][col];
        int[][] lines = {{0, 1}, {1, 0}, {1, 1}, {1, -1}};   // 横、竖、两条斜线
        for (int[] dir : lines) {
            int count = 1;                                   // 落点自己
            count += countOneWay(row, col, dir[0], dir[1], stone);
            count += countOneWay(row, col, -dir[0], -dir[1], stone);
            if (count >= 5) {
                return true;
            }
        }
        return false;
    }

    private int countOneWay(int row, int col, int dr, int dc, char stone) {
        int count = 0;
        int r = row + dr;
        int c = col + dc;
        while (r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r][c] == stone) {
            count++;
            r = r + dr;
            c = c + dc;
        }
        return count;
    }
}
` },

    { t: 'compare', left: {
      title: '8 个方向：各自单向数',
      html: '把方向当线，永远只看见落点的一侧。中间补子时左右各 2 颗，谁都不够 5——漏判。',
      code: 'int count = 1;\n// 只沿 (dr, dc) 单向前进，另一侧永远看不到\nint r = row + dr;\nint c = col + dc;\nwhile (board[r][c] == stone) { count++; r += dr; c += dc; }'
    }, right: {
      title: '4 条线：正反两向相加',
      html: '一条线 = 一对相反方向。落点 + 正向 + 反向，中间补子时 2 + 1 + 2 = 5，正确判定。',
      code: 'int count = 1;\ncount += countOneWay(row, col, dr, dc, stone);\ncount += countOneWay(row, col, -dr, -dc, stone);'
    } },

    { t: 'callout', kind: 'warn', title: '越界判断必须写在读数组之前', html:
      '<code>while (r &gt;= 0 &amp;&amp; r &lt; SIZE &amp;&amp; c &gt;= 0 &amp;&amp; c &lt; SIZE &amp;&amp; board[r][c] == stone)</code> ' +
      '的顺序不能换：<code>&amp;&amp;</code> 从左往右短路求值，前四个条件保证了 <code>board[r][c]</code> 不会越界。' +
      '如果先读 <code>board</code> 再判断范围，棋盘边缘和角落的落子会抛 ' +
      '<code>ArrayIndexOutOfBoundsException</code>——而边缘恰恰是最容易连成五子的地方。'
    },

    /* ---------------------------------------------------------------- 六 */
    { t: 'h', text: '六、平局：用 totalMoves 而不是扫棋盘', id: 'ch14-6' },

    { t: 'p', html:
      '还剩最容易漏的<b>平局</b>。笨办法是每次落子后扫全盘找空位；Tutorial 5 的做法更省：维护 ' +
      '<code>totalMoves</code>，每次<b>合法</b>落子加一，上限是 <code>SIZE * SIZE</code>' +
      '（15×15 = 225，缩成 5×5 只要 25 步）。先判胜、再判步数到上限，都不成立才切换执子方。' +
      '平局判断变成 O(1)，也不会因扫盘写错而漏判。'
    },

    { t: 'p', html:
      '注意 <code>totalMoves</code> 只在合法落子时自增：越界、重复落子的失败分支必须提前 ' +
      '<code>return</code>，否则步数会被虚增，平局提前出现。' +
      '把 <code>SIZE</code> 改成 5 再和同学互下几局，是验证平局逻辑最快的方式——225 步实在没人愿意下。'
    },

    /* ---------------------------------------------------------------- 七 */
    { t: 'h', text: '七、JavaFX：事件监听替代 while 循环', id: 'ch14-7' },

    { t: 'p', html:
      'JavaFX 版只换输入输出，<b>游戏规则一行都不用改</b>：<code>GomokuGameFX</code> 继承 <code>Application</code>，' +
      '内部持有一个 <code>GomokuGame</code> 对象。<code>start()</code> 只做三件事：搭界面、给每个格子挂事件监听、' +
      '把 Scene 塞进 Stage。while 循环被<b>事件监听（event listener）</b>——也就是隐式循环——取代：' +
      '程序不再「等你输入」，而是「你点一下它才动一下」，每次点击就是循环的一次迭代。'
    },

    { t: 'compare', left: {
      title: '控制台版：我等你输入',
      html: '程序主动循环：画棋盘 → 读键盘 → 落子。输入阻塞在主线程里，轮到谁由 <code>currentPlayer</code> 决定。',
      code: 'while (!gameOver) {\n    render();\n    int[] pos = humanInput();\n    move(pos[0], pos[1]);\n}'
    }, right: {
      title: 'JavaFX 版：你点我才动',
      html: '程序只挂一次监听器，然后进入事件循环。每次点击触发一次 <code>move</code>，控制权在用户手里。',
      code: 'cell.setOnMouseClicked(handler);   // 只挂一次\n// 点击一次 = 循环迭代一次\nmove(row + 1, col + 1);'
    } },

    { t: 'p', html:
      '一次点击的调用链是：用户点击格子 → JavaFX 生成 <code>MouseEvent</code> → 监听器' +
      '（lambda 或匿名内部类或具名类）收到事件 → 换算出行列 → <code>game.move(row, col)</code> → ' +
      '若 <code>gameOver</code> 就弹结果，否则把新棋子画到棋盘上。' +
      'Tutorial 7 还留了一个小任务：用 lambda 把项目一的监听器改写一遍——<code>setOnMouseClicked(e -&gt; ...)</code> ' +
      '就是 ch05 的「匿名内部类 → 箭头函数」，两种写法等价。'
    },

    { t: 'code', run: false, note: '本站引擎不支持匿名内部类与 lambda，解析会报错；本段仅阅读、不提供运行。',
      caption: 'GomokuGameFX.java —— 每个格子挂点击监听，点击即落子', code:
`import javafx.application.Application;
import javafx.event.*;
import javafx.scene.Scene;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.*;
import javafx.scene.shape.Line;
import javafx.stage.Stage;

public class GomokuGameFX extends Application {
    private static final int SIZE = 15;
    private static final double CELL = 32;
    private final GridPane grid = new GridPane();
    private final GomokuGame game = new GomokuGame();   // 规则仍然是同一个类

    @Override
    public void start(Stage stage) {
        for (int r = 0; r < SIZE; r++) {
            for (int c = 0; c < SIZE; c++) {
                StackPane cell = new StackPane();
                cell.setMinSize(CELL, CELL);

                Pane lines = new Pane();                 // Line 放在 Pane 里，避免被 StackPane 居中
                Line h = new Line(0, CELL / 2, CELL, CELL / 2);
                Line v = new Line(CELL / 2, 0, CELL / 2, CELL);
                lines.getChildren().addAll(h, v);
                cell.getChildren().add(lines);

                final int row = r;                        // lambda 只能捕获 effectively final
                final int col = c;
                cell.setOnMouseClicked(new EventHandler<MouseEvent>() {
                    @Override
                    public void handle(MouseEvent event) {
                        game.move(row + 1, col + 1);      // 对外 1 起，与 move 的约定一致
                    }
                });
                grid.add(cell, c, r);
            }
        }
        stage.setScene(new Scene(grid, SIZE * CELL, SIZE * CELL));
        stage.setTitle("Gomoku");
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'p', html:
      '注意 <code>final int row = r;</code> 这两行：匿名内部类只能捕获 effectively final 的局部变量，' +
      '把循环变量复制一份是 JavaFX 里最常见的写法。' +
      '把这段的 <code>new EventHandler&lt;MouseEvent&gt;() { ... }</code> 换成 ' +
      '<code>e -&gt; game.move(row + 1, col + 1)</code> 就得到 lambda 版——功能完全一样，行数少一半。'
    },

    /* ---------------------------------------------------------------- 八 */
    { t: 'h', text: '八、两种画棋盘：StackPane+Line vs Canvas', id: 'ch14-8' },

    { t: 'p', html:
      'Tutorial 7 给了两条画棋盘的路。<b>布局法</b>：每个交叉点是一个 <code>StackPane</code>，' +
      '用 <code>GridPane</code> 排列；格子里放一个 <code>Pane</code>，Pane 里放横线、竖线各一条拼出 <code>+</code>。' +
      '判断有没有棋子看 <code>cell.getChildren().size() &gt; 1</code>（第 0 个是线），删子从下标 1 开始 remove。' +
      '坑：<code>StackPane</code> 会替子节点布局，<code>Line</code> 的 <code>startX/startY</code> 是相对自身的局部坐标，' +
      '直接塞进去会被居中，所以线条要放在自己的 Pane 里再设坐标。'
    },

    { t: 'p', html:
      '<b>Canvas 法</b>：用 <code>GraphicsContext</code> 一笔一笔画线、画圆。优点是重绘极简单——' +
      '重置整局时清空画布再整盘重画即可；缺点是没有现成的「格子对象」，点击位置要自己换算成行列。' +
      'Tutorial 7 的建议是：可以「先画线，之后每步只补一颗子」省重绘，但一旦涉及重开/悔棋，' +
      '整盘重绘的代码更短、更不容易错。（JavaFX 的清屏是 <code>gc.clearRect(0, 0, w, h)</code>，' +
      '和 Tkinter 的 <code>canvas.delete("all")</code> 是同一个思路。）'
    },

    { t: 'table',
      head: ['', 'StackPane + Line（布局法）', 'Canvas（画布法）'],
      rows: [
        ['棋子怎么表示', '往格子里加一个 Circle/Text 节点', 'fillOval 画一个圆'],
        ['有没有子怎么判', '<code>getChildren().size() &gt; 1</code>', '自己读 <code>board[r][c]</code>'],
        ['点击换算', '每个格子自带监听，坐标天然对齐', '自己用 <code>event.getX() / CELL</code> 反算行列'],
        ['重开/悔棋', '要逐个 remove，状态分散在节点里', '清空后整盘重画，最省事'],
        ['适合', '简单对局、教学演示', '带重绘、动画、悔棋的完整版']
      ],
      caption: '两种渲染方案的真实取舍：Tutorial 7 两种都给了，选哪个取决于你要不要重绘。' },

    { t: 'code', run: false, caption: 'Canvas 绘制 —— 先画棋盘再画子，重绘时先 clearRect', code:
`import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.paint.Color;

public class BoardCanvas {
    private static final int SIZE = 15;
    private static final double CELL = 32;

    public void drawBoard(Canvas canvas) {
        GraphicsContext gc = canvas.getGraphicsContext2D();
        gc.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());   // 相当于 delete("all")
        gc.setStroke(Color.BLACK);
        for (int i = 0; i < SIZE; i++) {
            gc.strokeLine(0, i * CELL, (SIZE - 1) * CELL, i * CELL);   // 横线
            gc.strokeLine(i * CELL, 0, i * CELL, (SIZE - 1) * CELL);   // 竖线
        }
    }

    public void drawStone(Canvas canvas, int row, int col, Color color) {
        GraphicsContext gc = canvas.getGraphicsContext2D();
        gc.setFill(color);
        gc.fillOval(col * CELL - CELL / 2, row * CELL - CELL / 2, CELL, CELL);
    }
}
` },

    { t: 'callout', kind: 'warn', title: 'Canvas 的两个经典错位', html:
      '① <b>忘记清屏</b>：重开游戏时只重画不 clear，旧棋子会像幽灵一样留在画布上（Canvas 不会自动擦）。' +
      '② <b>用格子左上角当圆心</b>：交叉点在格子中心，所以 <code>fillOval</code> 的坐标要减半个格子；' +
      '同样，点击事件的 <code>event.getX()</code> 除以 <code>CELL</code> 之后要四舍五入才是最近的交叉点，' +
      '直接取整会整体偏半格。'
    },

    /* ---------------------------------------------------------------- 九 */
    { t: 'h', text: '九、项目难点、评分与扩展', id: 'ch14-9' },

    { t: 'p', html:
      '三个难点都在「状态」上：① <b>checkWin 的方向建模</b>——「线 = 两个相反方向」；' +
      '② <b>gameOver 后的重入</b>——GUI 的按钮不会自动禁用，必须在 <code>move</code> 第一行挡住；' +
      '③ <b>界面与状态同步</b>——控制台全量重画天然正确，GUI 很容易「逻辑改了画面没变」。' +
      '评分看「基础功能 + 视频」：完整对局、越界与重复落子提示、五连判定、平局、结束提示。' +
      '扩展：重新开始、悔棋、五连高亮、计时、简单 AI。'
    },

    { t: 'callout', kind: 'tip', title: '用「摆棋」代替「下棋」来测 checkWin', html:
      '手动下五步去验证胜负太慢。写一个临时 <code>main</code>：直接往 <code>board</code> 里赋值摆出 ' +
      '<code>X X . X X</code>，再把空位落上黑子，断言 <code>checkWin</code> 返回 true；再摆几种边缘与斜线情形。' +
      '十分钟能覆盖十几种情形，比在 GUI 里点一小时可靠。'
    },

    /* ---------------------------------------------------------------- 交互 */
    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch14-q1' },
    { t: 'quiz', qid: 'ch14-q2' },
    { t: 'quiz', qid: 'ch14-q3' },

    { t: 'p', html:
      '让实验台动起来：在「五子棋」里下一局，专试三个场景——中间空位补五连、摆满看平局、点已有棋子的格子。'
    },

    { t: 'lab', id: 'gomoku' },

    /* ---------------------------------------------------------------- 收束 */
    { t: 'keypoint', items: [
      { title: '规则', html: '15×15、黑先、横竖斜 ≥5 连；只能落在交叉点且不能重叠；结束后不能落子；满盘为平局。' },
      { title: '类设计', html: '<code>GomokuGame</code> 管状态与规则，<code>play()</code> 是唯一的循环；构造器负责初始化。' },
      { title: '坐标', html: '用户输入 1 起、数组 0 起，只在 <code>move()</code> 入口减 1 一次。' },
      { title: 'move 四道校验', html: '已结束 → 越界 → 已占用 → 落子后判胜负/平局并切换执子方；失败分支先 return。' },
      { title: 'checkWin', html: '4 条线 = 8 个方向两两配对；每条线 1 + 正向 + 反向 ≥ 5；越界判断写在读数组之前。' },
      { title: '平局', html: '合法落子才 <code>totalMoves++</code>；到 <code>SIZE*SIZE</code> 且无五连即平局。' },
      { title: 'JavaFX 迁移', html: '事件监听替代 while；规则类不动，只换输入输出；匿名内部类可改 lambda。' },
      { title: '两种绘制', html: 'StackPane+Line 靠节点管理、判子用 children.size()；Canvas 靠 clearRect 重绘、点击要自己换算。' }
    ] },

    { t: 'checklist', id: 'ch14', items: [
      '我能完整说出五子棋的规则与「五连」的定义',
      '我能设计 GomokuGame 的字段并写出初始化的构造器',
      '我能写出 play() 主循环，并解释 gameOver 为什么是唯一循环条件',
      '我能写出带行列号、对齐正确的 render()',
      '我能写出 move() 的四道校验，并说明为什么要先校验后落子',
      '我能解释「8 方向各自单向数」为什么会漏判，并举出反例',
      '我能写出四方向线双向延伸计数的 checkWin，并处理边界',
      '我能用 totalMoves 判平局，并说明它为什么比扫棋盘好',
      '我能把控制台版迁移到 JavaFX，并说清事件监听如何替代 while 循环',
      '我能对比 StackPane+Line 与 Canvas 两种绘制方案的取舍'
    ] },

    { t: 'callout', kind: 'exam', title: '这一章在期末考里怎么考', html:
      '五子棋是「项目二」的核心，考法集中在判胜负与状态管理。<br>' +
      '① <b>Part IV 编程</b>：手写 <code>checkWin</code>（四条线、双向计数、越界保护），或补全 <code>move</code> ' +
      '的校验与切换；也可能让你解释 8 方向版本的反例。<br>' +
      '② <b>Part II 判断</b>：「五连只算恰好 5 颗，六连不算赢」「游戏结束后仍然可以落子」' +
      '「平局要在棋盘满时扫描整个棋盘才能判断」——都是错误陈述。<br>' +
      '③ <b>Part III 填空</b>：<code>totalMoves == SIZE * SIZE</code>、<code>currentPlayer = 3 - currentPlayer</code>、' +
      '<code>board[row - 1][col - 1]</code>、四方向数组 <code>{{0,1},{1,0},{1,1},{1,-1}}</code>。<br>' +
      '④ <b>Part I 选择</b>：给一段落子代码问最终棋盘/赢家；或问哪个循环条件能正确退出。<br>' +
      '答题时先写「四条线」再逐个说明方向，比直接堆代码更容易拿步骤分。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      'AI 写五子棋几乎不会一次全对，这正好是它的教学价值。建议做三件事：' +
      '① 让 AI 分别生成「8 方向版」和「4 条线版」的 checkWin，然后自己构造 <code>X X . X X</code> 的反例' +
      '去验证哪个错——你会真正理解 Tutorial 5 为什么强调「方向不是线」；' +
      '② 让它把你的 <code>move</code> 改成 JavaFX 版，再对照本章的事件驱动结构，看它是否漏掉 ' +
      '<code>gameOver</code> 的重入保护；③ 让它出 3 道判断 + 1 道手写 checkWin 的模拟题，闭卷限时做。' +
      '项目允许用 AI，但期末考禁止——判断能力只能靠这种「用它、验它」的过程积累。'
    }

  ]
});
