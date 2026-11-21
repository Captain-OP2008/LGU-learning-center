/* =====================================================================
 * data/ch03.js · 第 03 章：类、对象与类设计（Classes, Objects & Class Design）
 * 职责：从「一个 Main 写到底」过渡到「用类组织程序」：类=模板、对象=实例、
 *       字段/方法/构造器、this、封装与访问修饰符、static vs 实例、重载与 toString，
 *       最后用 GomokuGame 的 render/play/move/checkWin 讲怎么把一个游戏拆成类。
 * 依据：CSC1004 lecture2 前半（类/对象/术语）+ Tutorial 5（Gomoku 控制台版类设计）。
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5；代码均可在站内引擎运行。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch03',
  num: '03',
  title: '类、对象与类设计',
  en: 'Classes, Objects & Class Design',
  goals: [
    '能写出带字段、构造器、方法与 getter 的类，并 new 出多个互不影响的对象',
    '能解释 this 的作用，并用 this(...) 在构造器之间复用初始化逻辑',
    '能用 private + 受控方法封装字段，说清封装保护了什么',
    '能区分 static 成员与实例成员，判断一个成员该属于类还是对象',
    '能把一个游戏按职责拆成类，写出 render/move/checkWin 的骨架'
  ],
  kp: [
    { id: 'ch03-1', title: '类与对象：模板与实例' },
    { id: 'ch03-2', title: '字段、方法与构造器' },
    { id: 'ch03-3', title: 'this 与构造器重载' },
    { id: 'ch03-4', title: '封装与访问修饰符' },
    { id: 'ch03-5', title: 'static 与实例成员' },
    { id: 'ch03-6', title: '方法重载与 toString' },
    { id: 'ch03-7', title: '把游戏拆成类：GomokuGame' },
    { id: 'ch03-8', title: '类设计的四个问题' }
  ],
  blocks: [

    /* ------------------------------------------------------------------ 开篇 */
    { t: 'callout', kind: 'why', html:
      '小项目最常见的写法是：所有代码塞进 <code>main</code>，棋盘用 <code>char[][]</code>，玩家用几个平行变量，落子记录再开一个数组。' +
      '三天后加「悔棋」，你发现要同时改七八处，改漏一处就对不上号。<br>' +
      '讲义用五子棋举例：控制台版只要求 <code>GomokuGame</code> 一个类，却已包含构造器、棋盘状态、玩家切换、落子校验、胜负判定五件事。' +
      '这一章讲清 <b>类（class）</b>、<b>对象（object）</b>、字段、构造器、this、封装与 static，再把游戏拆成有职责的类。'
    },

    { t: 'p', lead: true, html: '先看一个最小但完整的类：它把「一个学生」的数据和行为装在一起。' },

    { t: 'code', caption: 'StudentDemo.java · 类=模板，new 出来的对象才是具体的学生', run: true, code:
`public class StudentDemo {
    public static void main(String[] args) {
        Student s = new Student("Lin", 92);
        System.out.println(s.getName() + " " + s.getScore());
        System.out.println(s);              // 自动调用 toString()
        s.addScore(5);
        System.out.println(s);
    }
}

class Student {
    private String name;
    private int score;

    public Student(String name, int score) {   // 构造器：与类同名、无返回类型
        this.name = name;
        this.score = score;
    }

    public String getName() { return name; }
    public int getScore() { return score; }
    public void addScore(int bonus) { this.score = this.score + bonus; }

    public String toString() {
        return "Student(" + name + ", " + score + ")";
    }
}
` },

    { t: 'p', html:
      '<code>Student</code> 是<b>模板</b>，规定每个学生都有 <code>name</code> 与 <code>score</code>；<code>new Student("Lin", 92)</code> 才是<b>实例</b>，在堆（heap）上占一块内存。' +
      '变量 <code>s</code> 里装的是指向对象的<b>引用（reference）</b>；<code>s.getName()</code> 就是「顺着引用找到对象，调用它的方法」。同一份模板能 <code>new</code> 出无数对象。'
    },

    { t: 'terms', cols: 2, items: [
      { en: 'class', zh: '类', html: '模板：定义一类对象有哪些字段、哪些方法。' },
      { en: 'object', zh: '对象', html: '由 <code>new</code> 造出来的实例，占一块堆内存。' },
      { en: 'field', zh: '字段', html: '类里声明的变量，属于对象，保存状态。' },
      { en: 'method', zh: '方法', html: '类里声明的行为，能读写本对象的字段。' },
      { en: 'constructor', zh: '构造器', html: '名字与类名相同、没有返回类型，<code>new</code> 时自动执行。' },
      { en: 'reference', zh: '引用', html: '变量里存的是对象的地址；<code>null</code> 表示不指向任何对象。' }
    ] },

    /* ------------------------------------------------------------------ 一、类与对象 */
    { t: 'h', text: '一、类与对象：模板与实例', id: 'ch03-1' },

    { t: 'p', html:
      '类与对象像图纸与房子：图纸一份，房子可盖很多栋。写 <code>class Student { ... }</code> 只是画图纸，不产生任何数据；只有 <code>new</code> 之后内存里才出现对象。两个字段值相同的对象也是两块独立内存。'
    },

    { t: 'code', caption: 'RefDemo.java · 引用赋值是别名，不是复制；想独立就再 new 一个', run: true, code:
`public class RefDemo {
    public static void main(String[] args) {
        Point a = new Point(1, 2);
        Point alias = a;            // 别名：两个变量指向同一个对象
        alias.x = 99;
        System.out.println(a.x);    // 99：a 看到的也变了

        Point copy = new Point(a.x, a.y);   // 真正的新对象
        copy.x = 7;
        System.out.println(a.x);    // 99：copy 改不到 a

        System.out.println(a == alias);   // true：同一个对象
        System.out.println(a == copy);    // false：不同对象
        Point empty = null;
        System.out.println(empty == null);   // true
    }
}

class Point {
    int x;
    int y;
    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
}
` },

    { t: 'p', html:
      '<code>Point alias = a;</code> 复制的是箭头，不是对象，所以改 <code>alias.x</code> 等于改 <code>a.x</code>。' +
      '这类<b>别名（aliasing）</b>问题在项目里非常致命：两个地方同时持有一个 <code>GomokuGame</code>，一处改棋盘，另一处以为是旧状态。' +
      '想要独立对象，必须重新 <code>new</code>，或写一个复制构造器。'
    },

    { t: 'callout', kind: 'warn', title: 'null 是最常见的事故源', html:
      '声明 <code>Point p = null;</code> 后调用 <code>p.x</code> 或 <code>p.move()</code> 会抛 <code>NullPointerException</code>。' +
      '对象字段未初始化时默认 <code>null</code>（数组元素同理），项目里最常见的是「数组开了但每个位置还没 new」。'
    },

    /* ------------------------------------------------------------------ 二、字段、方法与构造器 */
    { t: 'h', text: '二、字段、方法与构造器', id: 'ch03-2' },

    { t: 'p', html:
      '一个类通常分三部分：<b>字段（field）</b>保存状态，<b>构造器（constructor）</b>负责初始化，<b>方法（method）</b>定义行为。' +
      '构造器规则很死：<b>名字与类名完全相同、没有返回类型</b>（连 <code>void</code> 都不写），<code>new</code> 时自动调用。' +
      '一个构造器都没写时编译器送默认无参构造器；一旦写了带参构造器，这个赠送的就没了。' +
      '字段有默认值（int 0、boolean false、对象 null），局部变量没有，必须先赋值。'
    },

    { t: 'code', caption: 'CtorDemo.java · 三个构造器重载，用 this(...) 复用初始化', run: true, code:
`public class CtorDemo {
    public static void main(String[] args) {
        Point p = new Point();        // 调用 Point()
        Point q = new Point(3);       // 调用 Point(int)
        Point r = new Point(3, 4);    // 调用 Point(int, int)
        System.out.println(p.x + "," + p.y);
        System.out.println(q.x + "," + q.y);
        System.out.println(r.x + "," + r.y);
    }
}

class Point {
    int x;
    int y;

    Point() {
        this(0, 0);     // 调用下面的两参构造器；必须是构造器第一句
    }

    Point(int x) {
        this(x, 0);
    }

    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
}
` },

    { t: 'p', html:
      '三个构造器<b>名字相同、参数不同</b>，这叫<b>重载（overload）</b>。编译器根据你传的参数个数与类型决定调用哪个。' +
      '<code>this(0, 0)</code> 是「调用本类的另一个构造器」，可以避免重复写初始化逻辑；规则只有一条：<b>它必须是构造器里的第一句</b>。' +
      '讲义里的 Gomoku 构造器就承担四件事：初始化棋盘、初始化 <code>currentPlayer</code> / <code>gameOver</code> / <code>winner</code>、' +
      '（可选）初始化输入用的 Scanner。'
    },

    /* ------------------------------------------------------------------ 三、this */
    { t: 'h', text: '三、this 与构造器重载', id: 'ch03-3' },

    { t: 'p', html:
      '<b>this</b> 是「当前对象」的引用，最常用来区分同名字段与参数：<code>this.name = name;</code> 左边是字段，右边是参数。' +
      '漏写 <code>this</code> 写成 <code>name = name;</code>，两边都指参数，字段永远是默认值——不报错，对象却一直是空的。' +
      '静态方法里没有 <code>this</code>（不属于任何对象），所以 <code>main</code> 里不能直接写 <code>this.name</code>。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · this 的两个用法', html: '① <code>this.字段</code> 区分同名参数；② <code>this(...)</code> 调用本类另一个构造器，必须在第一句。' },
      { title: '检查点 · 构造器规则', html: '名字 = 类名、无返回类型、可重载；不写任何构造器才有默认无参构造器。' }
    ] },

    /* ------------------------------------------------------------------ 四、封装 */
    { t: 'h', text: '四、封装与访问修饰符', id: 'ch03-4' },

    { t: 'p', html:
      '<b>封装（encapsulation）</b>就是把字段藏起来、只通过方法改：字段写 <code>private</code>，对外提供 <code>getBalance()</code>、<code>deposit()</code>、<code>withdraw()</code>。' +
      '好处是把校验收在一处：所有修改都经过 <code>withdraw</code>，余额不会变成负数；字段若是 <code>public</code>，任何地方都能写 <code>acc.balance = -999</code>，你永远不知道哪行写坏的。' +
      '访问修饰符四档：<code>private</code>（本类）、默认/包私有（同包）、<code>protected</code>（同包 + 子类）、<code>public</code>（到处）；惯例字段一律 private。'
    },

    { t: 'code', caption: 'BankDemo.java · private 字段 + 受控方法：非法操作被挡在方法里', run: true, code:
`public class BankDemo {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount(100);

        acc.deposit(50);
        System.out.println(acc.getBalance());      // 150

        System.out.println(acc.withdraw(200));     // false：余额不足
        System.out.println(acc.getBalance());      // 150

        System.out.println(acc.withdraw(30));      // true
        System.out.println(acc.getBalance());      // 120
    }
}

class BankAccount {
    private int balance;    // 外面拿不到、也改不了

    BankAccount(int balance) {
        this.balance = balance;
    }

    int getBalance() { return balance; }

    void deposit(int amount) {
        if (amount > 0) {
            balance = balance + amount;
        }
    }

    boolean withdraw(int amount) {
        if (amount <= 0 || amount > balance) {
            return false;       // 校验只写一次，所有调用都受保护
        }
        balance = balance - amount;
        return true;
    }
}
` },

    { t: 'p', html:
      '<code>withdraw</code> 返回 <code>boolean</code>：失败时告诉调用者，而不是悄悄不做事。项目里 <code>move(r, c, stone)</code> 同理——越界、已占、游戏结束都返回 <code>false</code>，界面层拿到就提示「无效落子」。封装让棋盘规则由 <code>GomokuGame</code> 自己保证。'
    },

    { t: 'callout', kind: 'warn', title: 'getter/setter 不是封装的全部', html:
      '把字段改 private、再生成 <code>getX()</code> / <code>setX()</code>，若 setter 什么都不检查，只是「加了两个方法」，没封装住规则。判断标准是：<b>对象能不能进入非法状态</b>。余额不能为负、棋盘不能越界——规则必须写在方法里。'
    },

    /* ------------------------------------------------------------------ 五、static */
    { t: 'h', text: '五、static 与实例成员', id: 'ch03-5' },

    { t: 'p', html:
      '<b>static</b> 成员属于类本身，全类只有一份；<b>实例成员</b>属于每个对象，各有一份。判断口诀：<b>这个数据每个对象都要一份吗？</b>' +
      '要就是实例字段，全类共享就是 <code>static</code>。棋盘、当前玩家、胜负状态每个对局一份，是实例字段；' +
      '「共有多少个 <code>GomokuGame</code> 实例」这种计数才是静态的。工具方法不需要对象状态，写 <code>static</code>；' +
      '<code>move()</code> 必须操作具体棋盘，不能静态。'
    },

    { t: 'code', caption: 'StaticDemo.java · 静态计数器全类共享，id 每个对象各一份', run: true, code:
`public class StaticDemo {
    public static void main(String[] args) {
        Player p1 = new Player("A");
        Player p2 = new Player("B");

        System.out.println(Player.getCount());   // 2：全类共享一份
        System.out.println(p1.getId() + " " + p2.getId());   // 1 2：各自一份
    }
}

class Player {
    private static int count = 0;   // 类变量：所有 Player 共享
    private int id;                 // 实例变量：每个对象一份
    private String name;

    Player(String name) {
        this.name = name;
        count++;
        this.id = count;
    }

    static int getCount() { return count; }
    int getId() { return id; }
}
` },

    { t: 'p', html:
      '两个 <code>Player</code> 的 <code>id</code> 是 1 和 2，因为构造器每执行一次 <code>count</code> 就加一；<code>count</code> 只有一份，所以 <code>Player.getCount()</code> 看到总数。' +
      '静态成员可用类名访问，也可用对象访问（不推荐）。<code>main</code> 必须 <code>static</code>，因为 JVM 启动时还没有对象，只能调用类上的方法。'
    },

    /* ------------------------------------------------------------------ 六、重载与 toString */
    { t: 'h', text: '六、方法重载与 toString', id: 'ch03-6' },

    { t: 'p', html:
      '<b>重载（overload）</b>指同一个类里方法名相同、参数列表不同；<b>重写（override）</b>是子类改父类方法，下一章讲。' +
      '区分只看参数（类型、个数、顺序），返回值不同<b>不算</b>重载，只改返回值会编译报「方法重复定义」。' +
      '<b>toString()</b> 默认输出「类名@哈希」，几乎没用；重写后 <code>println</code> 与字符串拼接会自动调用它，' +
      '调试时能直接看出对象状态——模型类都值得写一个。'
    },

    { t: 'code', caption: 'ToStringDemo.java · 不重写 toString，打印出来全是「类名@数字」', run: true, code:
`public class ToStringDemo {
    public static void main(String[] args) {
        Player p = new Player("Lin", 3);
        System.out.println(p);            // 重写后输出 Lin(3)
        System.out.println("score=" + p); // 字符串拼接也会调用 toString()
    }
}

class Player {
    private String name;
    private int score;

    Player(String name, int score) {
        this.name = name;
        this.score = score;
    }

    public String toString() {
        return name + "(" + score + ")";
    }
}
` },

    { t: 'callout', kind: 'tip', title: '重载 vs 重写的快速区分', html:
      '<b>重载</b>在同一个类里，看参数区分；<b>重写</b>发生在子类，签名必须与父类完全相同。<b>常见错误</b>：以为改了参数就算重写——那是重载，父类方法没被覆盖，多态时会调到父类版本。'
    },

    /* ------------------------------------------------------------------ 七、把游戏拆成类 */
    { t: 'h', text: '七、把游戏拆成类：GomokuGame 的职责', id: 'ch03-7' },

    { t: 'p', html:
      'Tutorial 5 的问题很直接：<b>要实现最简单的五子棋，你会怎么实现？</b>讲义的答案一句话——用控制台输入输出作界面，把规则封装进一个 <code>GomokuGame</code> 类。' +
      '它只干四件事：<b>render()</b> 打印棋盘（行号、列号、<code>+</code> 空位、<code>X</code> 黑、<code>O</code> 白）；' +
      '<b>play()</b> 主循环，重复「判断结束 → 渲染 → 读输入 → 落子」；' +
      '<b>move(x, y)</b> 落子并校验（越界、已占、已结束都拒绝）；<b>checkWin()</b> 从刚落的子出发查四个方向。' +
      '构造器初始化棋盘、<code>currentPlayer</code>、<code>gameOver</code>、<code>winner</code>。'
    },

    { t: 'steps', items: [
      { title: '构造器：把状态摆好', html: '建 <code>char[size][size]</code> 并填满 <code>+</code>；设当前玩家、<code>gameOver</code>、<code>winner</code>。' },
      { title: 'render()：只负责显示', html: '双层循环打印行号、列号与格子；对齐要用 <code>printf</code>，否则 15×15 会歪。' },
      { title: 'play()：只负责循环', html: '<code>while (!gameOver)</code>：render → 读入 x,y → move → 无效输入提示后重来。' },
      { title: 'move()：规则守门人', html: '依次检查：游戏是否结束、是否越界、是否已占；通过后落子、检查胜负、切换玩家。' },
      { title: 'checkWin()：从落点查四个方向', html: '横、竖、两条斜线；每个方向向正反两侧数同色棋子，合计 ≥5 即胜。不要每次全盘扫描。' }
    ] },

    { t: 'code', caption: 'GomokuGame.java · 控制台版核心（5×5 演示，真实项目是 15×15）', run: true, code:
`public class GomokuDemo {
    public static void main(String[] args) {
        GomokuGame game = new GomokuGame(5);          // 真实项目用 15
        System.out.println(game.move(2, 2, 'X'));     // true
        System.out.println(game.move(2, 2, 'O'));     // false：已占
        System.out.println(game.move(9, 9, 'O'));     // false：越界

        game.move(2, 0, 'X');
        game.move(1, 0, 'O');
        game.move(2, 1, 'X');
        game.move(1, 1, 'O');
        game.move(2, 3, 'X');
        game.move(1, 2, 'O');
        game.move(2, 4, 'X');        // X 在第二行连成五子

        System.out.println(game.isOver());   // true
        System.out.println(game.getWinner()); // X
        System.out.print(game.render());
    }
}

class GomokuGame {
    private char[][] board;
    private int size;
    private boolean over;
    private char winner;

    GomokuGame(int size) {                 // 构造器：初始化全部状态
        this.size = size;
        this.board = new char[size][size];
        for (int r = 0; r < size; r++) {
            for (int c = 0; c < size; c++) {
                board[r][c] = '+';
            }
        }
        this.over = false;
        this.winner = '+';
    }

    boolean move(int r, int c, char stone) {   // 落子 + 校验 + 判胜
        if (over) return false;
        if (r < 0 || r >= size || c < 0 || c >= size) return false;
        if (board[r][c] != '+') return false;

        board[r][c] = stone;
        if (checkWin(r, c, stone)) {
            over = true;
            winner = stone;
        }
        return true;
    }

    boolean checkWin(int r, int c, char stone) {
        int[][] dirs = {{0, 1}, {1, 0}, {1, 1}, {1, -1}};
        for (int i = 0; i < dirs.length; i++) {
            int count = 1;
            count = count + line(r, c, dirs[i][0], dirs[i][1], stone);
            count = count + line(r, c, -dirs[i][0], -dirs[i][1], stone);
            if (count >= 5) return true;
        }
        return false;
    }

    int line(int r, int c, int dr, int dc, char stone) {
        int n = 0;
        int rr = r + dr;
        int cc = c + dc;
        while (rr >= 0 && rr < size && cc >= 0 && cc < size && board[rr][cc] == stone) {
            n++;
            rr = rr + dr;
            cc = cc + dc;
        }
        return n;
    }

    boolean isOver() { return over; }
    char getWinner() { return winner; }

    String render() {
        String out = "";
        for (int r = 0; r < size; r++) {
            out = out + r + " ";
            for (int c = 0; c < size; c++) {
                out = out + board[r][c] + " ";
            }
            out = out + "\\n";
        }
        return out;
    }
}
` },

    { t: 'p', html:
      '<code>checkWin</code> 只从<b>刚落下的棋子</b>出发，四个方向各向正反两侧数同色棋子，合计 ≥5 即胜。' +
      'Tutorial 5 特别指出：只查「落点周围八格」不够——五子中间有一子时，后来的落子可能补上缺口，所以要向<b>两个相反方向</b>延伸再相加。' +
      '<code>move</code> 返回 <code>boolean</code>，胜负由 <code>isOver()</code> / <code>getWinner()</code> 查询，界面层不需要碰内部字段。'
    },

    { t: 'callout', kind: 'warn', title: '平局被漏掉，游戏会卡死', html:
      'Tutorial 5 的第三个问题：<code>move()</code> 里漏了什么？答案是<b>平局（draw）</b>。' +
      '棋盘下满仍无人连五时 <code>gameOver</code> 永远 <code>false</code>，循环停不下来。正确做法是维护 <code>moveCount</code>，' +
      '每成功落子加一，当它等于 <code>size * size</code> 且没人赢时判平局——比每次遍历全盘数空格便宜得多。'
    },

    /* ------------------------------------------------------------------ 八、类设计 */
    { t: 'h', text: '八、类设计的四个问题', id: 'ch03-8' },

    { t: 'p', html:
      '拆类按四个问题走：① 它有哪些状态？（字段）② 它能做什么？（方法）③ 它必须保证什么规则？（构造器与校验）④ 谁需要访问它？（访问修饰符）。' +
      '以 Gomoku 为例：状态是棋盘、大小、当前玩家、是否结束、赢家；行为是 render、play、move、checkWin；规则是「不越界、不重复落子、五连即胜、下满即平」；对外只暴露 move、isOver、render。'
    },

    { t: 'compare', left: {
      title: '一个 Main 写到底',
      html: '棋盘、玩家、循环、判胜全在 <code>main</code> 里，变量十几个。加功能要改多处，无法单独测试。'
    }, right: {
      title: '按职责拆类',
      html: '<code>GomokuGame</code> 管规则，界面层只管显示与读输入。前期慢一点，但可以直接替换成 JavaFX。'
    } },

    { t: 'p', html:
      '讲义称控制台版为「最简版本」，并说明 <code>render()</code> 以后会被 JavaFX 取代，但保留它能让程序先「完整」，方便测试核心逻辑，避免过早陷入 GUI 细节。项目里的做法就是<b>先让规则跑通，再换皮</b>：JavaFX 版只是在 <code>GomokuGame</code> 外加一层绘制与鼠标事件。'
    },

    /* ------------------------------------------------------------------ 交互 */
    { t: 'p', html: '下面这个类设计器把「字段/方法/构造器」拼成类骨架，并显示对象在内存里的样子，先动手试一遍：' },

    { t: 'lab', id: 'classdesign' },

    { t: 'p', html: '再用三道题检查这一章的概念：' },

    { t: 'quiz', qid: 'ch03-q1' },

    { t: 'quiz', qid: 'ch03-q2' },

    { t: 'quiz', qid: 'ch03-q3' },

    /* ------------------------------------------------------------------ 章末 */
    { t: 'keypoint', items: [
      { title: '类与对象', html: '类是模板，对象是实例；<code>new</code> 在堆上创建对象并返回引用。' },
      { title: '三段结构', html: '字段存状态、构造器做初始化（名字=类名、无返回类型）、方法定行为。' },
      { title: 'this', html: '指当前对象；<code>this.字段</code> 区分同名参数，<code>this(...)</code> 复用构造器且必须在第一句。' },
      { title: '封装', html: '<code>private</code> 字段 + 受控方法，把校验收在一处，保证对象不进入非法状态。' },
      { title: 'static', html: '静态成员全类共享一份（计数器、工具方法），实例成员每个对象一份；<code>main</code> 必须 static。' },
      { title: '重载与 toString', html: '重载看参数列表；toString 让打印对象可读，模型类都该写。' },
      { title: 'Gomoku 拆类', html: '构造器初始化、render 显示、play 循环、move 校验落子、checkWin 从落点查四方向。' },
      { title: '类设计四问', html: '状态、行为、必须保证的规则、谁能访问——按这四问拆出来的类才有职责。' }
    ] },

    { t: 'checklist', id: 'ch03', items: [
      '我能从零写出一个带字段、构造器、方法和 getter 的类，并 new 出两个对象',
      '我能解释「引用赋值是别名」，并写出真正复制对象的方法',
      '我能写出多个构造器重载，并用 this(...) 复用初始化逻辑',
      '我能解释 this.name = name 两边分别是什么，以及漏写 this 的后果',
      '我能为类设计一条不变量（如余额不小于 0），并说明校验放在哪',
      '我能判断一个成员该 static 还是实例，并解释 main 为什么必须 static',
      '我能重写 toString，并说清默认输出为什么没用',
      '我能把五子棋拆成 GomokuGame 的字段与方法，说出 checkWin 为何只查落点',
      '我能用四个问题（状态/行为/规则/访问）设计一个新类'
    ] },

    { t: 'callout', kind: 'exam', title: '考试怎么考这一章', html:
      '这一章是选择、判断与填空题的富矿：' +
      '① <b>构造器规则</b>——「构造器可以有返回类型」错；「不写构造器就没有构造器」错，编译器会送默认无参构造器。' +
      '② <b>this</b>——「静态方法里可以用 this」错；「<code>this(...)</code> 可放构造器任意位置」错，必须第一句。' +
      '③ <b>访问修饰符</b>——给一段类外访问 <code>private</code> 字段的代码，问能否编译（不能）。' +
      '④ <b>static</b>——「静态方法能直接访问实例字段」错；「静态变量每个对象一份」错。' +
      '⑤ <b>重载 vs 重写</b>——只改返回值算不算重载（不算，编译错误）。' +
      '⑥ <b>项目相关</b>——「<code>checkWin</code> 为什么从落点查」「平局怎么判」常作为简答题出现。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '让 AI 生成类很容易，难的是判断它设计得对不对。正确用法：① 先自己列字段与方法，再让 AI 补构造器与 getter，对比谁漏了校验；' +
      '② 把 <code>GomokuGame</code> 贴给 AI，问「哪些字段该 private、哪些方法该 static」，逐条判断它的理由；' +
      '③ 让它出「这段代码能否编译」的题（类外访问 private、static 里用 this、构造器写返回类型），这些正是考试挖的坑；' +
      '④ 让它解释「<code>checkWin</code> 为什么从落点查」，答不完整说明它只背了结论。AI 生成的类常「能跑但不封装」，要用四问过一遍。'
    }

  ]
});
