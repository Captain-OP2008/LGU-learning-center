/* =====================================================================
 * data/ch07.js · 第 07 章：类与对象
 * 职责：从平行数组的痛点讲到类/对象、字段与方法、构造器与 this、封装、
 *       static、对象数组、不可变对象，并用设计取舍讨论与完整案例收束。
 * 对外 API：CSC.registerChapter({...})（block schema 见 _dev/CONTRACT.md §4–§5）
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch07',
  num: '07',
  title: '类与对象',
  en: 'Objects & Classes',
  goals: [
    '能说出平行数组管理实体的三个具体问题，以及类如何一次性解决',
    '能定义类（字段、构造器、方法）并用 new 创建对象、通过引用访问成员',
    '能用 private 封装字段，说清 getter/setter 与不变量（invariant）的关系',
    '能区分 static 成员与实例成员，解释 main 为什么必须是 static',
    '能用对象数组管理一组对象，重写 toString 让输出可读',
    '能判断一个字段该不该开放、一个类该不该拆，并按"先状态后行为"设计类'
  ],
  kp: [
    { id: 'ch07-1', title: '从平行数组到实体' },
    { id: 'ch07-2', title: '类与对象、new 与引用' },
    { id: 'ch07-3', title: '字段、方法与构造器' },
    { id: 'ch07-4', title: 'this 与构造器重载' },
    { id: 'ch07-5', title: '封装：private 与 getter/setter' },
    { id: 'ch07-6', title: 'static 与实例成员' },
    { id: 'ch07-7', title: '对象数组与 toString' },
    { id: 'ch07-8', title: '不可变对象' },
    { id: 'ch07-9', title: '设计取舍：类该多大、状态该多开放' }
  ],
  blocks: [

    /* ---------------------------------------------------------------- 开篇 */
    { t: 'callout', kind: 'why', html:
      '先运行下面这段程序：三个数组 <code>names</code>、<code>ages</code>、<code>scores</code> 一起表示一个班，' +
      '删除下标 1 的学生。代码跑得通，输出却有一行不对——<code>Carol, 18, 92</code>：92 分是 Bob 的分数。' +
      '原因很简单：删除时 <code>names</code> 和 <code>ages</code> 都平移了，<code>scores</code> 忘了。' +
      '三个数组靠"同下标"关联，这个约定只存在程序员脑子里，编译器完全不知道。<br>' +
      '这不是粗心，而是结构问题：每加一个字段就要多维护一个数组，每个操作都要手工保持同步。' +
      '这一章引入<b>类（class）</b>，把"一个实体的数据"和"它能做的事"打包在一起——从此程序操作的是"一个学生"，' +
      '而不是三个下标。'
    },

    { t: 'p', lead: true, html:
      '数据和行为分居两处，程序就永远在玩"对号入座"的游戏。类让它们住在一起。'
    },

    { t: 'code', caption: 'ParallelArrays.java —— 三个数组靠"同下标"关联，漏同步一个就错位', code: `public class ParallelArrays {
    public static void main(String[] args) {
        String[] names = {"Alice", "Bob", "Carol"};
        int[] ages = {19, 20, 18};
        int[] scores = {85, 92, 78};

        // 删除下标 1 的学生：三个数组本应一起往前平移
        for (int i = 1; i < names.length - 1; i++) {
            names[i] = names[i + 1];
            ages[i] = ages[i + 1];
            // 漏写了：scores[i] = scores[i + 1];
        }
        names[names.length - 1] = null;
        ages[ages.length - 1] = 0;

        System.out.println(names[0] + ", " + ages[0] + ", " + scores[0]);
        System.out.println(names[1] + ", " + ages[1] + ", " + scores[1]);
    }
}
` },

    { t: 'p', html:
      '第二行 <code>Carol, 18, 92</code> 就是错位现场：姓名和年龄换成了 Carol 的，分数还停在 Bob 的位置。' +
      '程序不会报错，也不会崩溃，只是安静地给出错误答案——这类 bug 在期末项目里最耗时间。' +
      '把同样的逻辑写成「一个学生一个对象」之后，删除就是把数组元素前移一位，姓名、年龄、分数一起搬，' +
      '再也不可能出现"只搬了一半"的情况。'
    },

    { t: 'p', html:
      '本章路线：先建立"类 = 图纸、对象 = 房子"的模型（一、二），再拆开类的三段结构——字段、构造器、方法（三），' +
      '接着讲 this 与构造器重载（四）；然后把字段藏起来，讨论封装与不变量（五）；分清 static 与实例成员（六）；' +
      '用对象数组和 toString 管理一组对象（七）；最后谈不可变对象（八）与设计取舍（九），' +
      '并用三个调试实录和一份成绩册完整案例收束。'
    },

    /* ---------------------------------------------------------------- 一 */
    { t: 'h', text: '一、从平行数组到实体', id: 'ch07-1' },

    { t: 'p', html:
      '真实世界里的"一个学生"是一组绑在一起的事实：姓名、年龄、分数、学号。' +
      '平行数组把这个整体拆成三条独立的线，用"第几个"隐式地绑在一起。' +
      '只要有一次操作没同步，绑定就断了，而且断在哪里往往要翻很久才找到。'
    },

    { t: 'p', html:
      '这种做法有三个结构性毛病。① <b>加字段成本高</b>：加一个电话字段，就要新增一个数组，所有增删改查都要多写一行；' +
      '② <b>同步靠自觉</b>：排序、删除、插入都必须手工保持多个数组一致，编译器帮不上忙；' +
      '③ <b>下标没有语义</b>：<code>scores[1]</code> 是"1 号学生的分数"这件事，只存在于注释和你的记忆里。' +
      '类把这三条一次解决：一个对象的全部字段是同一个整体，行为也写在同一个类里。'
    },

    { t: 'terms', cols: 2, items: [
      { en: 'class', zh: '类', html: '字段 + 方法 + 构造器的模板，定义一类对象长什么样、能做什么。' },
      { en: 'object', zh: '对象', html: '由 <code>new</code> 造出来的具体实例，占一块堆内存。' },
      { en: 'instance', zh: '实例', html: '与"对象"同义，强调它属于某个类。' },
      { en: 'field', zh: '字段', html: '类里声明的变量，属于对象，用来保存状态。' },
      { en: 'method', zh: '方法', html: '类里声明的行为，能访问自己的字段。' },
      { en: 'constructor', zh: '构造器', html: '名字与类名相同、没有返回类型的特殊方法，<code>new</code> 时自动执行。' }
    ] },

    { t: 'keypoint', items: [
      { title: '检查点 · 三个毛病', html: '能说出平行数组"加字段贵、同步靠自觉、下标无语义"三个问题。' },
      { title: '检查点 · 实体', html: '能把"一个学生"的字段与行为列出来，说清它们为什么应该住在一起。' }
    ] },

    /* ---------------------------------------------------------------- 二 */
    { t: 'h', text: '二、类与对象：图纸与房子', id: 'ch07-2' },

    { t: 'p', html:
      '<b>类（class）</b>是图纸，<b>对象（object）</b>是按图纸造出来的房子；同一个类可以 <code>new</code> 出无数个对象，' +
      '每个对象有自己的字段值。造房子的动作由 <code>new</code> 完成：它在<b>堆（heap）</b>上分配内存、调用构造器初始化，' +
      '然后把<b>引用（reference）</b>交给变量——变量里存的是"对象的地址"，不是对象本身。' +
      '点号 <code>a.name</code> 的意思是"顺着 a 的箭头，找到那个对象，访问它的 name"。'
    },

    { t: 'svg', maxW: 660, caption: '类只是图纸；每次 new 都在堆上造一个新对象，变量里存的是指向它的箭头。', html:
`<svg viewBox="0 0 680 300" role="img" aria-label="类与对象、引用示意图">
  <defs>
    <marker id="ch07-arw1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent2)"/>
    </marker>
  </defs>
  <rect x="20" y="60" width="200" height="180" rx="10" fill="var(--surface2)" stroke="var(--line2)" stroke-width="1.4"/>
  <text x="36" y="86" font-size="13" font-weight="700" fill="var(--accent)">class Student（图纸）</text>
  <text x="36" y="114" font-size="12" fill="var(--text2)">String name</text>
  <text x="36" y="138" font-size="12" fill="var(--text2)">int score</text>
  <text x="36" y="162" font-size="12" fill="var(--text2)">Student(name, score)</text>
  <text x="36" y="186" font-size="12" fill="var(--text2)">isPass()</text>
  <text x="36" y="210" font-size="12" fill="var(--text2)">toString()</text>
  <text x="36" y="230" font-size="11" fill="var(--text3)">不占对象内存，只定义布局</text>

  <rect x="300" y="24" width="200" height="52" rx="6" fill="var(--bg2)" stroke="var(--accent2)"/>
  <text x="316" y="46" font-size="12" fill="var(--accent2)">a → #1</text>
  <text x="316" y="66" font-size="11" fill="var(--text3)">栈里的引用</text>
  <rect x="300" y="92" width="200" height="52" rx="6" fill="var(--bg2)" stroke="var(--accent2)"/>
  <text x="316" y="114" font-size="12" fill="var(--accent2)">b → #2</text>
  <text x="316" y="134" font-size="11" fill="var(--text3)">另一个引用</text>

  <rect x="540" y="16" width="130" height="70" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="554" y="38" font-size="12" font-weight="700" fill="var(--accent)">#1</text>
  <text x="554" y="58" font-size="11" fill="var(--text2)">Alice / 85</text>

  <rect x="540" y="100" width="130" height="70" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="554" y="122" font-size="12" font-weight="700" fill="var(--accent)">#2</text>
  <text x="554" y="142" font-size="11" fill="var(--text2)">Bob / 52</text>

  <line x1="500" y1="50" x2="532" y2="50" stroke="var(--accent2)" stroke-width="1.5" marker-end="url(#ch07-arw1)"/>
  <line x1="500" y1="118" x2="532" y2="134" stroke="var(--accent2)" stroke-width="1.5" marker-end="url(#ch07-arw1)"/>

  <text x="20" y="282" font-size="12" fill="var(--text2)">两张图纸造出两个对象：a 和 b 各自指向不同的堆对象。</text>
</svg>`
    },

    { t: 'code', caption: 'StudentDemo.java —— 一个文件里放两个类（只有 public 那个与文件名同名）', code: `class Student {
    String name;
    int score;

    Student(String name, int score) {
        this.name = name;
        this.score = score;
    }

    boolean isPass() {
        return score >= 60;
    }

    public String toString() {
        return name + "(" + score + ")";
    }
}

public class StudentDemo {
    public static void main(String[] args) {
        Student a = new Student("Alice", 85);
        Student b = new Student("Bob", 52);
        System.out.println(a);                 // println 自动调用 toString
        System.out.println(a.name + " pass? " + a.isPass());
        System.out.println(b.name + " pass? " + b.isPass());
        b.score = 61;                          // 字段能被外面直接改——下一节管住它
        System.out.println(b + " pass? " + b.isPass());
    }
}
` },

    { t: 'p', html:
      '<code>Student a = new Student("Alice", 85);</code> 拆开看三步：<code>new Student(...)</code> 在堆上造对象并执行构造器；' +
      '返回一个引用；把这个引用存进变量 <code>a</code>。' +
      '之后 <code>a.name</code> 访问字段、<code>a.isPass()</code> 调用方法，都是"顺着箭头找对象"。' +
      '注意 <code>Student</code> 类里没有 <code>main</code>——类不一定要能单独运行，它可以只是被别的类使用。'
    },

    { t: 'callout', kind: 'note', title: 'toString 是"打印对象"的钥匙', html:
      '<code>println(a)</code> 和 <code>"x" + a</code> 都会自动调用 <code>a.toString()</code>。' +
      '不写它，你看到的是 <code>Student@1b6d3586</code> 这种"类名 + 哈希"，调试时毫无信息量。' +
      '所有类都默认继承 <code>Object</code>，<code>toString</code> 就来自那里——第 08 章会讲继承。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 图纸与房子', html: '能解释"一个类可以 new 出多个对象"以及每个对象的字段互不影响。' },
      { title: '检查点 · 引用', html: '能说出 <code>a.name</code> 里的点号在做什么，以及 <code>new</code> 的三步。' }
    ] },

    /* ---------------------------------------------------------------- 三 */
    { t: 'h', text: '三、字段、方法与构造器', id: 'ch07-3' },

    { t: 'p', html:
      '一个类通常分三段：<b>字段（field）</b>声明对象要记住什么，<b>构造器（constructor）</b>规定对象出生时怎么初始化，' +
      '<b>方法（method）</b>提供对象能做的事。三者都写在类的大括号里，方法可以读写本对象的字段，不需要把字段当参数传来传去。' +
      '<b>封装</b>（下一节）之前，字段和方法的访问修饰符都是默认的，同包可见；本课程代码都放在同一个默认包里。'
    },

    { t: 'code', caption: 'FieldDefaults.java —— 字段有默认值，对象数组的槽位默认是 null', code: `class Counter {
    int count;          // 字段有默认值 0
    String label;       // 引用类型字段默认 null
    boolean flag;       // 默认 false
    double rate;        // 默认 0.0
}

public class FieldDefaults {
    public static void main(String[] args) {
        Counter c = new Counter();          // 没写构造器，编译器提供默认无参构造器
        System.out.println(c.count);        // 0
        System.out.println(c.label);        // null
        System.out.println(c.flag);         // false
        System.out.println(c.rate);         // 0.0

        Counter[] box = new Counter[2];     // 只造了两个空位，里面是 null
        System.out.println(box[0]);         // null
        System.out.println(box[1] == null); // true
        box[0] = new Counter();
        box[0].count = 7;
        System.out.println(box[0].count);   // 7
    }
}
` },

    { t: 'p', html:
      '输出揭示了两个固定考点。① <b>字段有默认值</b>：int 是 0、double 是 0.0、boolean 是 false、引用类型是 <code>null</code>；' +
      '② <b>局部变量没有默认值</b>，方法里声明 <code>int x;</code> 不赋值就读取会编译报错。' +
      '另外 <code>new Counter[2]</code> 只造了两个空槽位，槽位里是 <code>null</code>，' +
      '在给槽位赋值之前调用它的方法会抛 <code>NullPointerException</code>。'
    },

    { t: 'callout', kind: 'warn', title: '构造器前别写返回类型', html:
      '构造器的名字必须和类名相同，<b>不能写返回类型</b>（连 void 都不行）。写成 <code>void Student(...)</code> 就不再是构造器，' +
      '而是一个普通方法——<code>new Student("x", 1)</code> 会因为找不到匹配的构造器而编译报错。' +
      '一个类<b>一个构造器都不写</b>时，编译器自动提供一个无参默认构造器；一旦自己写了带参构造器，默认那个就没了，' +
      '再写 <code>new Student()</code> 会报错（这是 ch07-q4 考的点）。'
    },

    { t: 'p', html:
      '方法的返回类型要么写具体类型（<code>int</code>、<code>String</code>、<code>boolean</code>），要么写 <code>void</code> 表示"不返回东西"。' +
      '<code>isPass()</code> 返回 <code>boolean</code>，所以能直接放进 <code>if</code> 条件；<code>deposit</code> 是 void，调用方只能观察它的副作用。' +
      '方法里可以提前 <code>return</code> 结束——"校验失败就退出"的写法全靠它，比套一整个 if / else 更清楚。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 三段结构', html: '能说出字段、构造器、方法各自负责什么，并能手写一个完整的小类。' },
      { title: '检查点 · 默认值', html: '能列出四种常见字段的默认值，并解释为什么局部变量必须先赋值。' }
    ] },

    /* ---------------------------------------------------------------- 四 */
    { t: 'h', text: '四、this 与构造器重载', id: 'ch07-4' },

    { t: 'p', html:
      '<b>this</b> 指"当前这个对象"，最常见的用途是区分同名的字段与参数：<code>this.name = name</code> 左边是字段，右边是参数。' +
      '如果写成 <code>name = name</code>，两边都是参数，字段始终保持默认值——这是本章第 1 个调试实录。' +
      '另一个用途是构造器链：<code>this(...)</code> 调用同一个类的另一个构造器，减少重复的初始化代码。'
    },

    { t: 'code', caption: 'BookDemo.java —— 构造器重载：同名方法、不同参数', code: `class Book {
    String title;
    double price;

    Book(String title) {
        this.title = title;
        this.price = 0.0;
    }

    Book(String title, double price) {
        this.title = title;
        this.price = price;
    }

    void discount(double rate) {
        this.price = this.price * (1 - rate);
    }
}

public class BookDemo {
    public static void main(String[] args) {
        Book a = new Book("Java 101");
        Book b = new Book("Algorithms", 120.0);
        b.discount(0.25);
        System.out.printf("%s: %.2f%n", a.title, a.price);
        System.out.printf("%s: %.2f%n", b.title, b.price);
    }
}
` },

    { t: 'p', html:
      '两个 <code>Book</code> 构造器名字相同、参数列表不同，这叫<b>构造器重载（constructor overloading）</b>。' +
      '<code>new Book("Java 101")</code> 只有一个实参，编译器挑单参数版本；<code>new Book("Algorithms", 120.0)</code> 挑双参数版本。' +
      '挑哪个版本在<b>编译期</b>由实参的类型和个数决定，与运行时无关。'
    },

    { t: 'code', caption: 'BoxDemo.java —— this(...) 构造器链：一个构造器调用另一个', code: `class Box {
    private int w;
    private int h;

    Box() {
        this(1, 1);             // 构造器链：调用同一个类的另一个构造器，必须是第一句
    }

    Box(int side) {
        this(side, side);       // 正方形：宽高相同
    }

    Box(int w, int h) {
        this.w = w;
        this.h = h;
    }

    int area() { return w * h; }

    public String toString() {
        return w + "x" + h + " area=" + area();
    }
}

public class BoxDemo {
    public static void main(String[] args) {
        Box a = new Box();          // 无参：1x1
        Box b = new Box(3);         // 一个参数：3x3
        Box c = new Box(2, 5);      // 两个参数：2x5
        System.out.println(a);
        System.out.println(b);
        System.out.println(c);
    }
}
` },

    { t: 'callout', kind: 'warn', title: '构造器链的三条硬规则', html:
      '① <code>this(...)</code> 必须是构造器的<b>第一条语句</b>；② 不能同时写 <code>this(...)</code> 和 <code>super(...)</code>——' +
      '它们都要求是第一句，只能选一个；③ 链不能成环，<code>A()</code> 调 <code>B()</code>、<code>B()</code> 又调 <code>A()</code> ' +
      '会导致编译错误。' +
      '如果构造器里既没写 <code>this(...)</code> 也没写 <code>super(...)</code>，编译器会自动插入无参的 <code>super()</code>。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · this', html: '能解释 <code>this.name = name</code> 两边分别是谁，以及漏写 this 的后果。' },
      { title: '检查点 · 重载与链', html: '能写出多个构造器，并用 <code>this(...)</code> 复用初始化逻辑。' }
    ] },

    /* ---------------------------------------------------------------- 五 */
    { t: 'h', text: '五、封装：把状态管住', id: 'ch07-5' },

    { t: 'p', html:
      '上一节的 <code>Student.score</code> 可以直接改：<code>b.score = -50;</code> 编译器不会拦。' +
      '错误分数会一路流向统计、排名、报表，最后在一个完全想不到的地方爆炸。' +
      '"大家小心一点"不是工程方案。<b>封装（encapsulation）</b>的做法是：字段用 <code>private</code> 藏进类里，' +
      '只暴露受控的读写方法（getter / setter），把所有校验集中在入口。' +
      '它保护的不是秘密，而是<b>对象的合法状态</b>：对象一旦创建成功，就始终满足不变量（invariant）——' +
      '比如"余额永远不小于 0"。'
    },

    { t: 'compare', left: {
      title: 'public 字段：谁都能改',
      html: '任何一行代码都能把 <code>balance</code> 改成负数，错误当场不报、之后处处报。',
      code: 'acc.balance = -999;   // 编译通过\nacc.balance = 1e9;    // 也没有人拦'
    }, right: {
      title: 'private + 方法：唯一入口',
      html: '修改必须走 <code>deposit</code> / <code>withdraw</code>，校验集中在方法里，坏数据进不来。',
      code: 'acc.deposit(-20);      // 被拒绝并提示\nacc.withdraw(500);     // 余额不足，返回 false'
    } },

    { t: 'code', caption: 'BankDemo.java —— 点「单步」，看 private 字段在堆里怎么变', trace: true, code: `class BankAccount {
    private String owner;
    private double balance;

    BankAccount(String owner, double initial) {
        this.owner = owner;
        this.balance = initial;
    }

    String getOwner() { return owner; }
    double getBalance() { return balance; }

    void deposit(double amount) {
        if (amount <= 0) {
            System.out.println("deposit rejected: " + amount);
            return;
        }
        balance = balance + amount;
    }

    boolean withdraw(double amount) {
        if (amount <= 0 || amount > balance) return false;
        balance = balance - amount;
        return true;
    }
}

public class BankDemo {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount("Alice", 100.0);
        acc.deposit(50.0);
        acc.deposit(-20.0);
        boolean ok = acc.withdraw(500.0);
        System.out.println("withdraw 500 -> " + ok);
        System.out.println(acc.getOwner() + " balance = " + acc.getBalance());
    }
}
` },

    { t: 'p', html:
      '输出三行：<code>deposit rejected: -20.0</code>、<code>withdraw 500 -&gt; false</code>、余额 150.0。' +
      '<code>deposit</code> 挡住负数，<code>withdraw</code> 挡住超额，两个入口共同维护"余额不小于 0"这条不变量。' +
      '注意 <code>deposit(-20)</code> 没有抛异常，而是打印一行提示后 <code>return</code>——对本课程来说，' +
      '"拒绝并把原因告诉调用方"比崩掉更合适；真正严重的非法参数才用异常。'
    },

    { t: 'callout', kind: 'tip', title: 'getter / setter 的分寸', html:
      '命名习惯：<code>getBalance()</code>、<code>setScore()</code>，boolean 的 getter 叫 <code>isPass()</code>。' +
      '但不要给每个字段都无脑配 setter：能不给写权限就不给。像下一节的 <code>Song</code>，干脆做成' +
      '<b>不可变（immutable）</b>——创建后谁也不能改，最安全。封装的目标是"让非法状态无法出现"，不是"给每个字段配一对方法"。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 封装', html: '能解释封装保护的是对象的合法状态，而不只是"藏起字段"。' },
      { title: '检查点 · 不变量', html: '能写出带校验的 <code>deposit</code> / <code>withdraw</code>，并说出它们共同维护哪条不变量。' }
    ] },

    /* ---------------------------------------------------------------- 六 */
    { t: 'h', text: '六、static 与实例', id: 'ch07-6' },

    { t: 'p', html:
      '<b>实例成员（instance member）</b>每个对象各有一份：每个账户有自己的 <code>balance</code>。' +
      '<b>静态成员（static member）</b>属于类本身、全类共享一份：比如用来发号的计数器。' +
      '判断标准只有一句：<b>这个值和"某一个对象"绑定吗？</b>绑定就是实例成员，是"全类共同的事实"就是 static。' +
      '<code>Math.abs</code> 之所以能直接调用，就是因为它是 static——不需要先 <code>new</code> 一个 Math。'
    },

    { t: 'code', caption: 'TicketDemo.java —— static 字段在所有对象间共享', code: `class Ticket {
    private static int nextId = 1;   // 类变量：所有 Ticket 共享
    private int id;                  // 实例变量：每个对象一份
    private String owner;

    Ticket(String owner) {
        this.id = nextId;
        nextId++;
        this.owner = owner;
    }

    static int totalIssued() {
        return nextId - 1;
    }

    public String toString() {
        return "#" + id + " " + owner;
    }
}

public class TicketDemo {
    public static void main(String[] args) {
        Ticket a = new Ticket("Alice");
        Ticket b = new Ticket("Bob");
        System.out.println(a);
        System.out.println(b);
        System.out.println("issued = " + Ticket.totalIssued());
        System.out.println("Math.abs(-7) = " + Math.abs(-7));
    }
}
` },

    { t: 'svg', maxW: 640, caption: 'static 字段只有一份，挂在类上；实例字段每个对象各一份。', html:
`<svg viewBox="0 0 660 280" role="img" aria-label="static 与实例字段">
  <rect x="20" y="50" width="180" height="150" rx="10" fill="var(--surface2)" stroke="var(--accent)" stroke-width="1.4"/>
  <text x="34" y="76" font-size="13" font-weight="700" fill="var(--accent)">class Ticket</text>
  <text x="34" y="104" font-size="12" fill="var(--text2)">static nextId</text>
  <rect x="120" y="90" width="60" height="26" rx="4" fill="var(--bg2)" stroke="var(--accent)"/>
  <text x="150" y="108" font-size="12" text-anchor="middle" fill="var(--text)">3</text>
  <text x="34" y="136" font-size="11" fill="var(--text3)">全类共享一份</text>
  <text x="34" y="164" font-size="11" fill="var(--text3)">所有 Ticket 都读它</text>
  <text x="34" y="186" font-size="11" fill="var(--text3)">随类加载，不随对象</text>

  <rect x="250" y="30" width="170" height="84" rx="8" fill="var(--bg2)" stroke="var(--line2)"/>
  <text x="264" y="52" font-size="12" font-weight="700" fill="var(--accent2)">#1 Ticket</text>
  <text x="264" y="74" font-size="12" fill="var(--text2)">id = 1</text>
  <text x="264" y="94" font-size="12" fill="var(--text2)">owner = Alice</text>

  <rect x="250" y="130" width="170" height="84" rx="8" fill="var(--bg2)" stroke="var(--line2)"/>
  <text x="264" y="152" font-size="12" font-weight="700" fill="var(--accent2)">#2 Ticket</text>
  <text x="264" y="174" font-size="12" fill="var(--text2)">id = 2</text>
  <text x="264" y="194" font-size="12" fill="var(--text2)">owner = Bob</text>

  <rect x="470" y="30" width="170" height="84" rx="8" fill="var(--bg2)" stroke="var(--line2)"/>
  <text x="484" y="52" font-size="12" font-weight="700" fill="var(--accent2)">#3 Ticket</text>
  <text x="484" y="74" font-size="12" fill="var(--text2)">id = 3</text>
  <text x="484" y="94" font-size="12" fill="var(--text2)">owner = Carol</text>

  <line x1="190" y1="108" x2="240" y2="70" stroke="var(--accent)" stroke-width="1.5"/>
  <line x1="190" y1="108" x2="240" y2="170" stroke="var(--accent)" stroke-width="1.5"/>
  <line x1="190" y1="108" x2="460" y2="70" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="20" y="248" font-size="12" fill="var(--text2)">每次 new：读共享的 nextId 写进自己的 id，再让 nextId 加一。</text>
</svg>`
    },

    { t: 'code', caption: 'StaticTrap.java —— 两处故意的编译错误（静态方法里碰实例成员）', code: `class Counter {
    int count;                 // 实例字段：每个对象各有一份
    static int total = 0;      // 静态字段：全类共享一份

    static void reset() {
        count = 0;             // 编译错误：静态方法里没有对象，访问不到实例字段
        this.total = 0;        // 编译错误：静态方法没有 this
    }
}

public class StaticTrap {
    public static void main(String[] args) {
        Counter.reset();
    }
}
` },

    { t: 'callout', kind: 'warn', title: 'static 方法里没有 this', html:
      '静态方法属于类、不属于任何对象，所以<b>不能直接使用实例字段，也不能写 this</b>——那时可能一个对象都还没创建。' +
      '这正是 <code>main</code> 必须声明为 static 的原因：JVM 启动时只加载了类，还没有对象可用来调用它（呼应第 01 章）。' +
      '反过来，实例方法可以访问静态成员（因为类一定已经加载），所以 <code>deposit</code> 里能读 <code>nextId</code>。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 一份还是每个一份', html: '能判断一个字段该 static 还是实例，并解释 <code>Ticket.totalIssued()</code> 为什么能统计全部对象。' },
      { title: '检查点 · 编译错误', html: '看到静态方法里写 <code>this</code> 或实例字段，能立刻指出编译不过。' }
    ] },

    /* ---------------------------------------------------------------- 七 */
    { t: 'h', text: '七、对象数组与 toString', id: 'ch07-7' },

    { t: 'p', html:
      '对象数组本质是"引用的数组"：<code>new Student[3]</code> 只造出 3 个空位（都是 <code>null</code>），' +
      '每个位置还要自己 <code>new</code> 一个对象放进去。' +
      '遍历对象数组用增强 for 最简洁：<code>for (Student s : roster)</code> 里的 <code>s</code> 依次是每个对象的引用。' +
      '这也是"一组对象"的标准写法：先声明数组，再逐个创建元素，最后统一遍历。'
    },

    { t: 'code', caption: 'Roster.java —— 对象数组 + 增强 for', code: `class Student {
    private String name;
    private int score;

    Student(String name, int score) {
        this.name = name;
        this.score = score;
    }

    int getScore() { return score; }
    public String toString() { return name + ":" + score; }
}

public class Roster {
    public static void main(String[] args) {
        Student[] roster = new Student[3];
        roster[0] = new Student("Alice", 85);
        roster[1] = new Student("Bob", 92);
        roster[2] = new Student("Carol", 78);

        int sum = 0;
        for (Student s : roster) {
            System.out.println(s);
            sum += s.getScore();
        }
        System.out.printf("average = %.2f%n", sum / 3.0);
    }
}
` },

    { t: 'p', html:
      '<code>System.out.println(s)</code> 打印出 <code>Alice:85</code> 而不是 <code>Student@hash</code>，' +
      '是因为 <code>Roster</code> 里的 <code>Student</code> 重写了 <code>toString()</code>。' +
      '这是"对象数组 + 打印"的固定组合：没有 <code>toString</code>，你只能看到一串无意义的地址；有了它，一行就能看清每个对象的状态。' +
      '边界同样要留意：<code>roster[3]</code> 会抛 <code>ArrayIndexOutOfBoundsException</code>，访问前先看 <code>roster.length</code>；' +
      '数组本身是 <code>new Student[3]</code> 造出来的，元素却可能还是 <code>null</code>。' +
      '考试里常把这两个考点拼在一起：先问数组元素指向哪里，再问打印输出是什么。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 引用数组', html: '能解释 <code>new Point[3]</code> 之后为什么 <code>ps[0]</code> 是 null，以及怎样避免空指针。' },
      { title: '检查点 · toString', html: '能写出让 <code>println(obj)</code> 可读的 <code>toString</code>。' }
    ] },

    /* ---------------------------------------------------------------- 八 */
    { t: 'h', text: '八、不可变对象', id: 'ch07-8' },

    { t: 'p', html:
      '把字段都声明成 <code>private final</code>、构造器里一次赋值、不提供 setter，对象就变成<b>不可变（immutable）</b>：' +
      '创建之后状态永远不变。需要"变化"时，方法返回一个<b>新对象</b>，而不是修改自己——' +
      '<code>String</code>、<code>Integer</code>、<code>LocalDate</code> 都是这个套路。' +
      '好处很直接：不可变对象可以随便共享、随便传给别的方法，不用担心被偷偷改掉；多线程下也天然安全。'
    },

    { t: 'code', caption: 'SongDemo.java —— final 字段 + 构造器校验 + 格式化输出', code: `class Song {
    private final String title;     // final：创建后不能改，天然的不可变对象
    private final int seconds;

    Song(String title, int seconds) {
        this.title = title;
        this.seconds = Math.max(0, seconds);   // 构造器里就把非法值挡掉
    }

    String getTitle() { return title; }
    int getSeconds() { return seconds; }

    String clock() {
        return (seconds / 60) + ":" + String.format("%02d", seconds % 60);
    }

    public String toString() {
        return title + " (" + clock() + ")";
    }
}

public class SongDemo {
    public static void main(String[] args) {
        Song a = new Song("Hey Jude", 431);
        Song b = new Song("Bad Input", -5);     // 负秒数被钳到 0

        System.out.println(a);                  // Hey Jude (7:11)
        System.out.println(b);                  // Bad Input (0:00)
        System.out.println(a.getSeconds());     // 431
        System.out.println(b.getSeconds());     // 0
    }
}
` },

    { t: 'p', html:
      '<code>Song</code> 的字段都是 <code>final</code>，构造器里就把负数时长钳成 0——非法状态在对象出生那一刻就被挡住，' +
      '之后再也改不了。代价是每次"修改"都要造新对象；对频繁变化的数据（比如计数器），' +
      '还是用可变对象加受控的 setter 更合适。这正是下一节要展开的设计取舍。'
    },

    { t: 'callout', kind: 'tip', title: '不可变的两个实用好处', html:
      '① <b>可以安全当键</b>：第 10 章的 <code>HashMap</code> 用对象的哈希值找值，对象可变的话键会"消失"；' +
      '② <b>方法签名自带承诺</b>：参数类型是不可变类，调用者就不必担心方法偷偷改你的数据。' +
      '代价是频繁创建新对象——所以选择不可变要看数据"变得多不多"。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 怎么造', html: '能写出一个所有字段 final、构造器校验、无 setter 的类。' },
      { title: '检查点 · 什么时候别用', html: '能说出不可变适合"值"（坐标、金额、日期），不适合频繁变化的累加器。' }
    ] },

    /* ---------------------------------------------------------------- 九 */
    { t: 'h', text: '九、设计取舍：类该多大、状态该多开放', id: 'ch07-9' },

    { t: 'p', html:
      '<b>取舍一：字段开放到什么程度。</b>全部 public 写起来最快，但对象状态随时可能被改坏；全部 private + 全套 getter/setter ' +
      '最保险，却可能写出"只是把字段藏起来、校验仍没做"的假封装。工程上的默认是：<b>字段一律 private，' +
      '只暴露真正需要的方法</b>，能只读就不给写，能给"业务动作"（<code>deposit</code>）就不给"裸赋值"（<code>setBalance</code>）。' +
      '一个方法名如果叫 set 开头，就该问一句：这个赋值真的需要允许外部随便调吗？'
    },

    { t: 'p', html:
      '<b>取舍二：可变还是不可变。</b>不可变对象安全、可共享，但每次修改都要造新对象；可变对象省内存、适合原地更新，' +
      '代价是别名（两个引用指向同一对象）会带来"改一个另一个也变"的惊喜。' +
      '判断标准：这个类型表示的是"值"（坐标、颜色、金额）还是"实体"（账户、玩家）？值适合不可变，实体通常可变但必须封装。' +
      '第 09 章会把这条取舍和引用语义一起讲透。'
    },

    { t: 'p', html:
      '<b>取舍三：类该多大。</b>新手常把所有东西塞进一个 <code>Manager</code> 类，字段几十个、方法上百行——这叫"上帝类"，' +
      '改一处可能碰坏另一处。判断依据是<b>单一职责</b>：这个类能不能用一句话说清"它负责什么"？' +
      '如果一句话里出现了"和"，通常就该拆。拆类的顺序也有讲究：先想它要记住哪些状态（字段），再想它对外提供哪些动作（方法），' +
      '最后才写构造器——这就是"先状态、后行为"的 UML 式思考。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 三个取舍', html: '能说出字段开放性、可变性、类大小三组取舍各自的代价与默认选择。' },
      { title: '检查点 · 设计四问', html: '拿到需求能先列出：要存什么、要提供什么操作、创建时必须给什么、哪些只读。' }
    ] },

    { t: 'p', html:
      '最后要提醒的是别走另一个极端：不是为了"用类"就必须拆类。几十行的课程作业里，一个职责清楚的类就够；' +
      '真正的判断标准是"改一个需求要动几个地方"。动的地方越多，说明边界画错了，这时再拆也不迟。' +
      '设计是迭代出来的，不是一次想明白的——先写能跑的最小版本，再按职责重构，比一开始硬套设计模式靠谱得多。'
    },

    /* ---------------------------------------------------------------- 调试 */
    { t: 'h', text: '十、调试实录：三个真实 bug' },

    { t: 'p', html:
      '对象相关的 bug 有个共同点：<b>程序能编译、能跑，输出就是不对</b>。它们不会抛异常，只能靠固定流程定位：' +
      '<b>① 写下期望值与实际值；② 找第一个"该变而没变"的字段；③ 只改一处再验证</b>。'
    },

    { t: 'steps', items: [
      { title: '症状：字段值不对', html: '先确认是"没赋值"、"赋错值"还是"被别处覆盖"，不要笼统说"数据错了"。' },
      { title: '定位：从构造器开始查', html: '字段的初始值只可能来自三处：默认值、字段初始化器、构造器。先用 <code>System.out.println</code> 打印出来。' },
      { title: '修复：改成唯一入口', html: '参数与字段同名就用 <code>this.x = x</code>；共享计数器别在构造器里重置；对象数组记得逐个 <code>new</code>。' }
    ] },

    { t: 'h', lvl: 3, text: '案例 1：构造器里写成 x = x，字段永远是 0' },

    { t: 'p', html:
      '需求是"<code>new BadPoint(5)</code> 之后 x 等于 5"，实际打印 0。构造器里写的是 <code>x = x;</code>：' +
      '两个 x 都是参数，字段一次都没被赋值。修复只有两个字符：<code>this.x = x;</code>。' +
      '定位方法：在构造器里打印字段，发现从对象出生起就是默认值 0。'
    },

    { t: 'h', lvl: 3, text: '案例 2：static 计数器被每次重置，所有对象 id 相同' },

    { t: 'p', html:
      '发号器本该让每张票拿到不同编号，实际两张票都是 1。原因是构造器里先写了 <code>nextId = 1;</code>：' +
      '共享计数器每创建一次对象就被重置回 1。<b>static 字段的生命周期跟着类，不跟着对象</b>——' +
      '正确写法是只读它、创建后自增，绝不能在里面重置。'
    },

    { t: 'h', lvl: 3, text: '案例 3：对象数组只 new 了数组，没 new 元素' },

    { t: 'p', html:
      '<code>String[] names = new String[2];</code> 之后直接调 <code>names[0].length()</code>，' +
      '运行时会抛 <code>Exception in thread "main" java.lang.NullPointerException</code>，并指出出错行。' +
      '原因：数组只造了外壳，两个槽位都是 <code>null</code>。修复：先 <code>names[0] = "Alice";</code>，' +
      '或者先判 <code>if (names[0] != null)</code> 再调用。'
    },

    { t: 'code', caption: 'ObjectDebug.java —— 前两个 bug 的修复前后对照（第三个见上面的报错说明）', code: `// 三个 bug 的修复前后对照：都能编译，输出不对
class BadPoint {
    private int x;

    BadPoint(int x) {
        x = x;                  // bug 1：参数遮住了字段，字段仍是 0
    }

    int getX() { return x; }
}

class GoodPoint {
    private int x;

    GoodPoint(int x) {
        this.x = x;             // 修复：用 this 指向字段
    }

    int getX() { return x; }
}

class BadTicket {
    private static int nextId = 1;
    private int id;

    BadTicket() {
        nextId = 1;             // bug 2：每次创建都把共享计数器重置
        id = nextId;
        nextId++;
    }

    int getId() { return id; }
}

class GoodTicket {
    private static int nextId = 1;
    private int id;

    GoodTicket() {
        id = nextId;            // 修复：只读计数器，创建时自增
        nextId++;
    }

    int getId() { return id; }
}

public class ObjectDebug {
    public static void main(String[] args) {
        System.out.println("bug1 bad  = " + new BadPoint(5).getX());    // 0，期望 5
        System.out.println("bug1 good = " + new GoodPoint(5).getX());   // 5

        System.out.println("bug2 bad  = " + new BadTicket().getId());  // 1
        System.out.println("bug2 bad  = " + new BadTicket().getId());  // 1，期望 2
        System.out.println("bug2 good = " + new GoodTicket().getId()); // 1
        System.out.println("bug2 good = " + new GoodTicket().getId()); // 2
    }
}
` },

    { t: 'keypoint', items: [
      { title: '检查点 · 三个 bug', html: '能说出每个 bug 是"遮蔽漏 this"、"static 被重置"还是"数组元素未创建"。' },
      { title: '检查点 · 流程', html: '遇到"能跑但字段值不对"，会先打印字段值，而不是直接改代码。' }
    ] },

    /* ---------------------------------------------------------------- 案例 */
    { t: 'h', text: '十一、完整案例：成绩册', id: 'ch07-10' },

    { t: 'p', html:
      '下面这份成绩册把本章知识点串成一个程序：多个对象（数组）、封装（private 字段 + 校验 setter）、' +
      'static 计数器（自动编号）、重写 <code>toString</code>（格式化输出），以及不可变字段（<code>name</code> 与 <code>id</code> 创建后不改）。' +
      '读之前先预测：<code>new Course("English", -5)</code> 之后它的分数是多少？最后一行打印的编号是几？'
    },

    { t: 'code', caption: 'Gradebook.java —— 对象数组 + 封装 + static 编号 + toString + 边界', code: `class Course {
    private static int nextId = 1;          // 共享：所有 Course 共用一个计数器
    private final int id;
    private final String name;              // 名字创建后不改
    private int score;

    Course(String name, int score) {
        this.id = nextId;                   // 先取号
        nextId++;
        this.name = name;
        setScore(score);                    // 统一走校验入口
    }

    int getId() { return id; }
    String getName() { return name; }
    int getScore() { return score; }
    boolean isPass() { return score >= 60; }

    void setScore(int score) {
        if (score < 0 || score > 100) {
            System.out.println("  rejected score: " + score);
            return;                         // 非法值不写入，对象状态始终合法
        }
        this.score = score;
    }

    String grade() {
        return score >= 90 ? "A"
             : score >= 80 ? "B"
             : score >= 70 ? "C"
             : score >= 60 ? "D"
             : "F";
    }

    static int totalCreated() { return nextId - 1; }

    public String toString() {
        return String.format("#%d %-8s %3d %s", id, name, score, grade());
    }
}

public class Gradebook {
    public static void main(String[] args) {
        Course[] list = new Course[4];
        list[0] = new Course("Java", 92);
        list[1] = new Course("Math", 78);
        list[2] = new Course("English", -5);    // 被拒绝，保持 0 分
        list[3] = new Course("Physics", 61);

        int total = 0;
        int pass = 0;
        for (Course c : list) {
            System.out.println(c);
            total += c.getScore();
            if (c.isPass()) pass++;
        }
        System.out.printf("avg = %.2f, pass = %d/%d%n", total / (double) list.length, pass, list.length);

        list[1].setScore(85);                   // 改分走 setter，输出自动更新
        System.out.println("after fix: " + list[1]);
        System.out.println("created = " + Course.totalCreated());
    }
}
` },

    { t: 'p', html:
      '三处值得细看。① 第三个对象传入 -5，setter 打印 <code>rejected score: -5</code> 后直接返回，分数保持默认 0——' +
      '对象状态没有被写坏，这就是封装的价值。② <code>id</code> 由 static 的 <code>nextId</code> 发放，创建到第 4 个时 ' +
      '<code>totalCreated()</code> 返回 4，说明计数器全类共享。③ <code>setScore(85)</code> 改分后，同一个对象的 ' +
      '<code>toString</code> 立刻反映新等级，数组里存的引用没变，变的是它指向的对象。' +
      '注意 <code>pass = 3/4</code>：0 分不通过，另外三个通过——边界值（0、60、100）是这类题最常挖的地方。'
    },

    /* ---------------------------------------------------------------- 收尾 */
    { t: 'h', text: '教材对照：§3.1–3.2 使用类型与创建类型', id: 'ch07-book' },

{ t: 'table',
      head: ['教材 §3.1 的客户端类型', '值是什么', '常用操作', '站内对应'],
      rows: [
        ['<code>String</code>', '字符序列', '<code>length()</code>、<code>charAt(i)</code>、<code>substring(a, b)</code>、<code>indexOf(s)</code>、<code>compareTo(t)</code>', '本章 <code>toString</code>；第 09 章的 <code>==</code> 与 <code>equals</code>'],
        ['<code>Color</code>', '红、绿、蓝三个 0–255 整数', '<code>getRed()</code>、<code>getGreen()</code>、<code>getBlue()</code>；教材 Luminance 库用它转灰度、判断前景背景是否兼容', '第 05 章的 <code>printf</code> 与画布实验台'],
        ['<code>Picture</code>', '二维像素数组', '<code>width()</code>、<code>height()</code>、<code>get(x, y)</code>、<code>set(x, y, c)</code>', '第 05 章「画布与分形」实验台']
      ],
      caption: '教材的原话：这些类型的内部表示对客户端不可见，你只需要知道它们提供哪些操作'
    },

{ t: 'code', caption: 'Charge.java —— 教材 §3.2：private final 字段 + 实例方法 + toString，新建类型的三件套', code:
`class Charge {
    private final double rx, ry, q;
    Charge(double x0, double y0, double q0) { rx = x0; ry = y0; q = q0; }
    double potentialAt(double x, double y) {
        double dx = x - rx, dy = y - ry;
        return 8.99e9 * q / Math.sqrt(dx * dx + dy * dy);
    }
    public String toString() { return q + " at (" + rx + ", " + ry + ")"; }
}

public class Q {
    public static void main(String[] args) {
        Charge c = new Charge(0.4, 0.6, 1e-9);
        System.out.println(c);
        System.out.printf("%.2f%n", c.potentialAt(0.5, 0.5));
    }
}
` },

    { t: 'p', html:
      "教材第 3 章把「数据类型」定义成两句话：<b>一组值 + 定义在这些值上的操作</b>。写客户端代码时只关心 API，不关心内部怎么存——这正是本章「图纸与房子」的上游视角。教材先用 <code>String</code>、<code>Color</code> 演示「使用别人造好的类型」，再让你亲手写 <code>Charge</code>、<code>Stopwatch</code>，走一遍「创建类型」的完整流程。<br><br>三条来自教材的客户端规则，读代码时可以直接拿来判断「这一行在做什么」：① <code>String s;</code> 只声明一个变量，<b>不创建对象</b>；<code>new String(\"hi\")</code> 才在堆上创建。② 实例方法用「对象名.方法名(...)」调用，静态方法用「类名.方法名(...)」调用——教材特意把 <code>s.length()</code> 和 <code>Math.sqrt(x)</code> 并排比较，区别就在有没有绑定对象。③ String 的两个语法糖（字面量、<code>+</code> 拼接）是语言特例，其他类型都必须显式 <code>new</code>。<br><br>输出两行：<code>1.0E-9 at (0.4, 0.6)</code> 和 <code>63.57</code>。<code>potentialAt</code> 没有写 <code>static</code>，因为势能取决于「哪个电荷在算」，必须绑定对象；而教材 Luminance 库里的 <code>intensity(Color)</code> 只依赖参数，就适合做成静态方法。判断标准——<b>方法需不需要读对象自己的状态</b>——比背语法有用得多。<br><br>把教材这两节和本章对照着读，会发现站内讲的是「怎么造」，教材还多讲了一层「怎么用」：先作为客户端把 String、Color 用熟，再自己设计 API。下一节 §3.3 会把「设计」这一层展开成封装、不可变与继承三条原则。<br><br>教材还给了「数据类型 = 值集合 + 操作集合」的两个推论：① 同一个值集合可以配不同的操作集合——「整数」既可以只有加减，也可以带取模；设计类型时要先问「客户端到底需要哪些操作」。② 操作集合反过来决定实现：客户端只需要「读」，就不必提供 setter；只需要「判断相等」，就不必暴露内部数组。站内 <code>Student</code> 只给 getter、不给 setter，就是这条原则的落地。<br><br>最后提醒：教材的「使用类型」不只指调用 API，还包括读懂它的契约——比如 <code>String</code> 不可变，任何「修改」都返回新对象；<code>Color</code> 的每个分量都在 0–255 之间。契约读错，代码逻辑就会跟着错。"
    },

    { t: 'callout', kind: 'note', title: '教材 Q&A 两条', html:
      "① <b>为什么 String 能写 <code>\"hi\"</code>，Color 不能？</b>因为 Java 只给 String 开了字面量语法和 <code>+</code> 运算符，其余引用类型一律 <code>new</code>。教材用「longhand 写法」<code>new String(\"hi\")</code> 提醒你：字面量背后同样是一次对象创建。<br>② <b>实例方法能声明成 static 吗？</b>能编译，但方法里就再用不了 <code>this</code> 和实例字段，调用也失去对象绑定。教材的原则是：需要对象状态就用实例方法，纯函数才放进静态库。<br><br>教材把「创建类型」拆成三步：先在客户端代码里写出想要的 API（use case），再写类声明与构造器，最后才写方法体。顺序反过来——先想字段再补方法——容易设计出「以数据为中心」而不是「以客户端为中心」的类，接口会随着实现细节越改越宽。"
    },

    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch07-q1' },
    { t: 'quiz', qid: 'ch07-q2' },
    { t: 'quiz', qid: 'ch07-q3' },

    { t: 'p', html: '让实验台动起来：在「对象与类」里拖动参数看字段怎么变，在「执行流程」里逐句看对象数组的构造顺序。' },

    { t: 'lab', id: 'oop' },
    { t: 'lab', id: 'trace' },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      'M2 卷面上这一章主要出三类题：<br>' +
      '① <b>读程序问输出（M2 Q3，8 分）</b>：给一个含构造器、<code>toString</code>、对象数组的程序，问四行输出；' +
      '第二小问常改成 <code>shelf[1] = shelf[0];</code> 这样的别名赋值，问输出怎么变——考的是"数组里存引用"。<br>' +
      '② <b>填空（M2 Q7，每空 3 分）</b>：<code>private</code> 关键字、static 计数器在构造器里的自增、' +
      '用循环给对象数组每个位置 <code>new Point(i, 0)</code>。<br>' +
      '③ <b>判断（M2 Q2）</b>：static 方法能否访问实例字段、子类没写构造器时编译器是否插入无参构造器、对象参数是不是"引用传递"。<br>' +
      '<b>看到题先做什么</b>：先圈出所有 <code>new</code>，在草稿纸上给每个对象编号（#1、#2…），' +
      '标出每个变量指向哪个编号；再逐行更新字段值。对象题只要图对了，输出几乎不会错。'
    },

    { t: 'keypoint', items: [
      { title: '类与对象', html: '类是模板，对象是实例；<code>new</code> 在堆上创建对象并返回引用，变量存的是箭头。' },
      { title: '字段与方法', html: '字段有默认值、局部变量没有；方法能直接读写本对象的字段。' },
      { title: '构造器', html: '名字 = 类名、无返回类型、可重载；<code>this(...)</code> 链必须是第一句；不写则用默认无参构造器。' },
      { title: 'this', html: '指当前对象，用来区分同名字段与参数；静态方法里没有 this。' },
      { title: '封装', html: '<code>private</code> 字段 + 受控方法把校验收到一处，保证对象始终满足不变量。' },
      { title: 'static', html: '静态成员全类共享一份，随类加载；实例成员每个对象各一份。' },
      { title: '对象数组', html: '数组里存的是引用，默认全为 null，每个位置都要自己 <code>new</code>。' },
      { title: '不可变对象', html: '<code>final</code> 字段 + 构造器校验 + 无 setter；修改返回新对象。' }
    ] },

    { t: 'checklist', id: 'ch07', items: [
      '我能说出平行数组管理实体的三个具体问题',
      '我能从零写出一个带字段、构造器和方法的类，并 new 出两个对象',
      '我能解释 this.name = name 左右两边分别是什么，以及漏写 this 的后果',
      '我能写出多个构造器重载，并用 this(...) 复用初始化逻辑',
      '我能解释封装保护了什么，并写出带校验的 deposit/withdraw',
      '我能维护一条不变量（如余额不小于 0），并说明校验放在哪',
      '我能判断一个成员该声明为 static 还是实例成员，并解释 main 为什么必须 static',
      '我能用对象数组存多个对象、遍历并重写 toString',
      '我能写出一个不可变类，并说出什么时候不该用它',
      '我能按"先状态、后行为"的四问设计一个新的类'
    ] },

    { t: 'p', html:
      '<b>延伸阅读</b>：教材 Sedgewick 第 3.1 节（Using Data Types）与第 3.3 节（Designing Data Types）讲如何从需求抽象出类；' +
      '站内第 08 章会把本章的类放进继承体系，第 09 章的「内存与引用」会画出对象与引用的箭头，' +
      '第 10 章的集合大量使用 <code>toString</code> 与 <code>equals</code>。' +
      '想练手可以到 <a href="#/quiz/ch07">题库 · ch07</a> 按章节筛选，或用首页的随机挑战抽题。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '让 AI「写一个学生管理系统」很容易，但对你没帮助。更值得做的三件事：' +
      '① 把你写的类（比如 BankAccount）发给 AI，问"哪些字段应该 private、哪些校验我漏了"，然后自己改并运行验证；' +
      '② 让 AI 出"这段代码能否编译"的选择题——类外访问 private、static 里用 this、构造器写返回类型，正是考试挖的坑；' +
      '③ 让它解释"为什么字段要有默认值、局部变量没有"，再追问"那成员变量什么时候被初始化"——答不完整说明它只背了结论。' +
      'AI 生成的类经常"能跑但不封装"，凡是它的设计都要用本章的取舍标准过一遍。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：类与对象：字段与方法、构造器与重载、this、封装、static vs 实例、对象数组、toString、不可变对象、设计取舍。<br>依据：Course Outline v5 的 Class vs Object / Constructors / Encapsulation 部分；Sedgewick §3.1。本站为个人整理的学习材料，与课程要求冲突时以老师和课程大纲为准；代码均在真实 JDK 上校验过。' }

  ]
});