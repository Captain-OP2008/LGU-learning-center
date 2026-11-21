/* =====================================================================
 * data/ch05.js · 第 05 章：Lambda 与函数式接口（Lambda & Functional Interfaces）
 * 职责：从「为了传一段行为要写一个类」讲到 lambda：函数式接口（有且仅有一个抽象方法）、
 *       匿名内部类 → 语句 lambda → 表达式 lambda 的改写、参数类型推断、方法引用、
 *       JavaFX 事件里的 lambda 用法、变量捕获与使用边界。
 * 依据：CSC1004 Tutorial 7 的 Lambda Expression 部分 + lecture8 事件处理中的 lambda。
 * 注意：站内 Java 子集引擎不支持 lambda / 匿名内部类，本章所有代码 run:false，仅作展示。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch05',
  num: '05',
  title: 'Lambda 与函数式接口',
  en: 'Lambda & Functional Interfaces',
  goals: [
    '能说出函数式接口的定义（有且仅有一个抽象方法），并判断一个接口是不是函数式接口',
    '能把匿名内部类改写成语句 lambda 与表达式 lambda',
    '能解释 lambda 的参数类型与目标类型为什么可以省略（类型推断）',
    '能用方法引用 <code>类名::方法名</code> 简化「只是转调已有方法」的场景',
    '能在 JavaFX 事件处理里写 <code>setOnAction(e -&gt; ...)</code> 并说清 e 是什么'
  ],
  kp: [
    { id: 'ch05-1', title: '函数式接口：只有一个抽象方法' },
    { id: 'ch05-2', title: '匿名内部类：lambda 之前的写法' },
    { id: 'ch05-3', title: '语句 lambda' },
    { id: 'ch05-4', title: '表达式 lambda 与类型推断' },
    { id: 'ch05-5', title: '方法引用 ::' },
    { id: 'ch05-6', title: 'JavaFX 事件里的 lambda' },
    { id: 'ch05-7', title: '变量捕获与使用边界' },
    { id: 'ch05-8', title: '项目里的 lambda' }
  ],
  blocks: [

    /* ------------------------------------------------------------------ 开篇 */
    { t: 'callout', kind: 'why', html:
      '给按钮加一个点击动作，JavaFX 要求你传一个 <code>EventHandler</code> 对象；这个对象只有一个方法 <code>handle(e)</code>，' +
      '方法体也只有一行 <code>System.out.println("clicked")</code>。为了这一行，传统写法要写一个完整的匿名内部类，五六行——' +
      '代码量比真正想表达的意思大十倍。<br>' +
      'Tutorial 7 把它称为「语法糖」：<b>Lambda expression is some syntactic sugar for anonymous initialization of some functional interface implementation</b>。' +
      '这一章讲清 lambda 与它背后的<b>函数式接口（functional interface）</b>，以及它在 JavaFX 事件与项目里的真实用法。' +
      '注意：站内引擎不支持 lambda，本章代码只展示、不能运行，请在 IntelliJ 里练。'
    },

    { t: 'p', lead: true, html: '先看清问题：只为「传一段行为」，传统写法要绕几道弯。' },

    { t: 'code', caption: 'HandlerDemo.java · 先定义接口，再写实现类（示意：请在本机 IDE 运行）', run: false, code:
`// 1. 定义一个接口：只有一个抽象方法，用来表示「点击后做什么」
interface ClickHandler {
    void handle(String name);
}

// 2. 写一个实现类，把行为装进去
class PrintHandler implements ClickHandler {
    public void handle(String name) {
        System.out.println("Hello, " + name);
    }
}

public class HandlerDemo {
    public static void main(String[] args) {
        ClickHandler h = new PrintHandler();
        h.handle("Lin");
    }
}
` },

    { t: 'p', html:
      '这段代码完全合法，问题在「比例」：<code>PrintHandler</code> 整个类只为一句话存在。' +
      '如果程序里有十个按钮、十种动作，就要写十个这样的类。' +
      'Java 的解法是：<b>如果接口只有一个抽象方法</b>，那这个接口的实例可以用一个「函数」直接表示——这就是<b>函数式接口</b>与 lambda 的出发点。'
    },

    { t: 'terms', cols: 2, items: [
      { en: 'functional interface', zh: '函数式接口', html: '有且仅有一个抽象方法的接口，如 <code>Runnable</code>、<code>EventHandler</code>。' },
      { en: 'lambda expression', zh: 'Lambda 表达式', html: '用 <code>(参数) -&gt; 表达式</code> 表示函数式接口实例的写法。' },
      { en: 'anonymous class', zh: '匿名内部类', html: '在 <code>new</code> 的同时写出类体的对象，lambda 的前身。' },
      { en: 'type inference', zh: '类型推断', html: '参数类型与目标类型从上下文推断，不必显式写。' },
      { en: 'method reference', zh: '方法引用', html: '<code>类名::方法名</code>，当 lambda 只是转调已有方法时使用。' },
      { en: 'effectively final', zh: '事实上的 final', html: 'lambda 只能捕获没有再被赋值的局部变量。' }
    ] },

    /* ------------------------------------------------------------------ 一、函数式接口 */
    { t: 'h', text: '一、函数式接口：只有一个抽象方法', id: 'ch05-1' },

    { t: 'p', html:
      'Tutorial 7 的定义只有一句：<b>A functional interface should be of one and only one abstract method</b>——' +
      '有且<b>仅有一个</b>抽象方法。注意「抽象方法」四个字：接口里的方法默认都是抽象的（没有方法体）；' +
      '如果接口里有<b>两个</b>方法，它就不是函数式接口，不能写 lambda。' +
      'Java 标准库里大量接口是函数式接口：<code>Runnable</code> 只有 <code>run()</code>，' +
      'JavaFX 的 <code>EventHandler</code> 只有 <code>handle()</code>，<code>Comparator</code> 只有 <code>compare()</code>。' +
      '我们自己定义的 <code>ClickHandler</code> 也只有一个 <code>handle()</code>，所以同样可以。'
    },

    { t: 'table',
      head: ['接口', '唯一的抽象方法', '是不是函数式接口'],
      rows: [
        ['<code>Runnable</code>', '<code>void run()</code>', '是'],
        ['<code>EventHandler&lt;T&gt;</code>', '<code>void handle(T event)</code>', '是'],
        ['<code>Comparator&lt;T&gt;</code>', '<code>int compare(T a, T b)</code>', '是'],
        ['自定义 <code>ClickHandler</code>', '<code>void handle(String name)</code>', '是'],
        ['自定义 <code>TwoAction</code>', '<code>void start()</code> 与 <code>void stop()</code>', '<b>不是</b>：有两个抽象方法']
      ],
      caption: '判断方法：数一数接口里有几个抽象方法，恰好一个才是函数式接口' },

    { t: 'callout', kind: 'warn', title: '「有且仅有一个」的两个坑', html:
      '① <b>两个方法就不是</b>：哪怕两个方法签名完全不同，只要都抽象，就不能用 lambda，必须老实用实现类或匿名内部类。' +
      '② <b>默认方法不算</b>：Java 8 之后接口可以有带方法体的 <code>default</code> 方法，它们不是抽象的，不影响「函数式接口」的判定。' +
      '课程讲义按「接口只有抽象方法」讲，考试判断时也按这个口径。'
    },

    /* ------------------------------------------------------------------ 二、匿名内部类 */
    { t: 'h', text: '二、匿名内部类：lambda 之前的写法', id: 'ch05-2' },

    { t: 'p', html:
      '在没有 lambda 的年代，标准做法是<b>匿名内部类（anonymous class）</b>：在 <code>new 接口名()</code> 后面直接跟 <code>{ ... }</code>，' +
      '当场把方法实现写出来，连类名都省了。Tutorial 7 的代码演进就是四步：显式局部类 <code>MyEventHandler</code> → 匿名类 → 语句 lambda → 表达式 lambda。' +
      '匿名类解决了「不想为一次性行为专门写一个类」的问题，但它仍然啰嗦：类型名、括号、方法签名、<code>new</code> 关键字全都要写。'
    },

    { t: 'code', caption: 'AnonymousDemo.java · 匿名内部类：new 接口 + 当场实现（示意）', run: false, code:
`public class AnonymousDemo {
    public static void main(String[] args) {
        // 不用单独写类，直接 new 一个「实现了 ClickHandler 的对象」
        ClickHandler h = new ClickHandler() {
            public void handle(String name) {
                System.out.println("Hello, " + name);
            }
        };

        h.handle("Lin");
    }
}

interface ClickHandler {
    void handle(String name);
}
` },

    { t: 'p', html:
      '匿名内部类里的 <code>handle(String name)</code> 必须写全：访问修饰符、参数类型、方法名一个不能少。' +
      '而编译器其实早就知道：你是在给 <code>ClickHandler</code> 类型的变量赋值，接口里只有一个方法，签名是 <code>void handle(String)</code>——' +
      '这些信息全都重复了。lambda 就是来删掉这些重复的。'
    },

    /* ------------------------------------------------------------------ 三、语句 lambda */
    { t: 'h', text: '三、语句 lambda', id: 'ch05-3' },

    { t: 'p', html:
      '<b>语句 lambda（statement lambda）</b>是最直接的改写：保留参数列表，把方法体放进 <code>{ }</code> 里，可以写多行、可以写 <code>return</code>。' +
      'Tutorial 7 的描述是「Write lines (and return statement) inside <code>{}</code>」。' +
      '匿名类里的 <code>new 接口名() { public void handle(String name) { ... } }</code> 被压缩成 ' +
      '<code>(String name) -&gt; { ... }</code>：接口名没了（从目标类型推断），方法名没了（接口只有一个方法），<code>public</code> 也没了。'
    },

    { t: 'code', caption: 'StatementLambda.java · 语句 lambda：多行方法体放在 {} 里（示意）', run: false, code:
`public class StatementLambda {
    public static void main(String[] args) {
        ClickHandler h = (String name) -> {
            System.out.println("Hello, " + name);
            System.out.println("welcome to CSC1004");
        };

        h.handle("Lin");
    }
}

interface ClickHandler {
    void handle(String name);
}
` },

    { t: 'p', html:
      '对比匿名类的版本：代码从 8 行缩到 4 行，信息一点没少。' +
      '语句 lambda 适合方法体需要多行、或者有 <code>if</code>、循环、<code>return</code> 的场景——' +
      '项目里的鼠标点击处理通常就是这种：算坐标、校验、落子、重绘，好几行。'
    },

    /* ------------------------------------------------------------------ 四、表达式 lambda */
    { t: 'h', text: '四、表达式 lambda 与类型推断', id: 'ch05-4' },

    { t: 'p', html:
      '<b>表达式 lambda（expression lambda）</b>更短：当方法体只有一个表达式时，可以省略 <code>{ }</code> 和 <code>return</code>，直接写箭头后面的表达式。' +
      'Tutorial 7 的说明是「Only an expression is allowed, without <code>;</code>」——只能是一个表达式，而且<b>不能带分号</b>。' +
      '另外，参数类型可以省略：既然目标类型是 <code>ClickHandler</code>，参数只能是 <code>String</code>，编译器不用你重复。' +
      '只有一个参数时连括号都能省，于是最终写成 <code>name -&gt; System.out.println(...)</code>。'
    },

    { t: 'code', caption: 'ExpressionLambda.java · 表达式 lambda：一行搞定，参数类型可省略（示意）', run: false, code:
`public class ExpressionLambda {
    public static void main(String[] args) {
        // 写法一：保留参数类型
        ClickHandler a = (String name) -> System.out.println("Hello, " + name);

        // 写法二：省略参数类型（从目标类型推断）
        ClickHandler b = name -> System.out.println("Hello, " + name);

        a.handle("Lin");
        b.handle("Wang");
    }
}

interface ClickHandler {
    void handle(String name);
}
` },

    { t: 'p', html:
      'Tutorial 7 专门讲了「类型从哪来」：<b>The type of the target class and the type(s) of the argument(s) for the only overridden function is inferred from the context</b>。' +
      '上下文可以是赋值号左边（<code>ClickHandler h = ...</code>），也可以是方法调用的实参位置（<code>button.setOnAction(...)</code>）——' +
      '「Such context could be the lvalue or the function call, without ambiguity」。' +
      '只有一个参数时可省括号；<b>零个参数</b>要写空括号 <code>() -&gt; ...</code>；<b>两个及以上参数</b>括号不能省，类型可省：' +
      '<code>(a, b) -&gt; a + b</code>。'
    },

    { t: 'callout', kind: 'warn', title: '表达式 lambda 的三种编译错误', html:
      '① <b>语句 lambda 漏 return</b>：目标方法有返回值时，<code>(a, b) -&gt; { a + b; }</code> 缺 <code>return</code>，编译失败；应写 <code>(a, b) -&gt; a + b</code> 或 <code>{ return a + b; }</code>；<br>' +
      '② <b>把语句塞进表达式 lambda</b>：箭头后只能是一个表达式；要写 <code>if</code>、多条 <code>println</code>、循环，必须用 <code>{ }</code> 变成语句 lambda；<br>' +
      '③ <b>推断不出目标类型</b>：把 lambda 直接赋给 <code>Object</code> 或当作 <code>null</code> 使用，编译器不知道目标接口是哪个，报「无法推断 lambda 的目标类型」。'
    },

    /* ------------------------------------------------------------------ 五、方法引用 */
    { t: 'h', text: '五、方法引用 ::', id: 'ch05-5' },

    { t: 'p', html:
      '<b>方法引用（method reference）</b>是 lambda 的进一步简写：当 lambda 只是「原样转调一个已有方法」时，' +
      '把 <code>x -&gt; f(x)</code> 写成 <code>f</code> 的方法引用。语法是 <code>类名::方法名</code> 或 <code>对象::方法名</code>。' +
      '常见三种：<b>静态方法引用</b> <code>Integer::parseInt</code>、<b>实例方法引用</b> <code>System.out::println</code>、' +
      '<b>构造器引用</b> <code>String::new</code>。' +
      '判断标准很简单：lambda 的参数是不是<b>原封不动</b>传给那个方法？是，就能换成方法引用；还要加工（比如拼字符串），就老老实实写 lambda。'
    },

    { t: 'code', caption: 'MethodRef.java · 方法引用：lambda 只是转调已有方法时（示意）', run: false, code:
`public class MethodRef {
    public static void main(String[] args) {
        // 目标接口：接收一个字符串，返回一个字符串
        Formatter upper1 = s -> s.toUpperCase();   // lambda
        Formatter upper2 = String::toUpperCase;    // 方法引用：同一件事

        // 目标接口：接收一个字符串，打印它
        Printer p1 = s -> System.out.println(s);   // lambda
        Printer p2 = System.out::println;          // 实例方法引用

        System.out.println(upper1.format("java"));
        System.out.println(upper2.format("lambda"));
        p1.print("hello");
        p2.print("method reference");
    }
}

interface Formatter {
    String format(String s);
}

interface Printer {
    void print(String s);
}
` },

    { t: 'p', html:
      '方法引用的好处是「读起来像一句话」：<code>System.out::println</code> 一眼就知道是把参数打印出来。' +
      '但别为了短而用：<code>s -&gt; helper(s, 2)</code> 这种带第二个参数的，方法引用表达不了，必须留 lambda。' +
      '项目里最常用的两个是 <code>System.out::println</code>（遍历集合时打印）和 <code>String::toUpperCase</code>（字符串转换）。'
    },

    /* ------------------------------------------------------------------ 六、JavaFX 事件 */
    { t: 'h', text: '六、JavaFX 事件里的 lambda', id: 'ch05-6' },

    { t: 'p', html:
      'Tutorial 7 明确说，项目 1 可以用 lambda 重写——因为 JavaFX 的事件监听器全是函数式接口。' +
      '按钮的 <code>setOnAction</code> 接收一个 <code>EventHandler&lt;ActionEvent&gt;</code>，它只有一个 <code>handle(ActionEvent e)</code>，' +
      '于是可以写成 <code>btn.setOnAction(e -&gt; ...)</code>。这里的 <code>e</code> 就是事件对象，' +
      '关闭窗口、读取输入框内容、切换场景都从它身上拿。鼠标事件同理：<code>setOnMouseClicked</code> 的参数是 <code>MouseEvent</code>，' +
      '<code>e.getX()</code> / <code>e.getY()</code> 给出点击坐标。'
    },

    { t: 'code', caption: 'FxLambda.java · JavaFX 按钮与棋盘点击：事件监听器用 lambda 写（示意）', run: false, code:
`// 需要 import javafx.scene.control.Button;
//      import javafx.event.ActionEvent;
//      import javafx.event.EventHandler;

Button start = new Button("Start");
start.setOnAction(e -> System.out.println("game started"));

// 鼠标点击棋盘：把像素坐标换算成行列，再落子
board.setOnMouseClicked(e -> {
    int r = (int) (e.getY() / CELL_SIZE);
    int c = (int) (e.getX() / CELL_SIZE);
    if (game.move(r, c, currentStone)) {
        draw();
    }
});

// 对比：不用 lambda 的匿名内部类写法（Tutorial 7 的 MyEventHandler）
start.setOnAction(new EventHandler<ActionEvent>() {
    public void handle(ActionEvent e) {
        System.out.println("game started");
    }
});
` },

    { t: 'p', html:
      '这段代码来自 Gomoku 的交互层：<code>game.move(r, c, currentStone)</code> 是第 03 章写好的规则方法，' +
      'lambda 在这里只是「把事件和规则连起来」的胶水，没有任何游戏逻辑。' +
      '讲义说 JavaFX 版是把控制台的「读输入」换成「鼠标事件」——<b>隐式 while 循环</b>没了，' +
      '每点一次鼠标，事件监听器就被调用一次，相当于循环体执行一次。' +
      'Chat Zoom 的发送按钮也一样：<code>sendBtn.setOnAction(e -&gt; server.broadcast(input.getText()))</code>。'
    },

    { t: 'callout', kind: 'tip', title: 'lambda 里少写复杂逻辑', html:
      '事件回调里只做「转发」：读取控件状态、调用业务方法、刷新界面。' +
      '胜负判定、消息拼接这类逻辑放回 <code>GomokuGame</code> / <code>ChatServer</code> 里，' +
      '否则 lambda 会越写越长，最后变成一坨无法测试的代码。'
    },

    /* ------------------------------------------------------------------ 七、变量捕获 */
    { t: 'h', text: '七、变量捕获与使用边界', id: 'ch05-7' },

    { t: 'p', html:
      'lambda（和匿名内部类）可以读取外层方法的局部变量，这叫<b>捕获（capture）</b>；' +
      '但有一个硬规则：被捕获的局部变量必须是 <b>effectively final</b>——声明后<b>没有再被赋值</b>。' +
      '原因很实际：lambda 可能在方法返回后才执行，如果变量还能改，它该看哪个值就说不清了。' +
      '想「修改」外层变量，只能改对象的字段（如 <code>game</code> 的字段），或者用数组、<code>AtomicInteger</code> 这类容器间接改。' +
      '另外 lambda 不能用在「需要完整类」的地方：多个抽象方法的接口、需要重写多个方法的父类，仍然要写匿名内部类或具名类。'
    },

    { t: 'code', caption: 'CaptureDemo.java · 捕获的局部变量必须 effectively final（示意）', run: false, code:
`public class CaptureDemo {
    public static void main(String[] args) {
        int size = 15;          // 声明后不再赋值 → effectively final
        ClickHandler show = name -> System.out.println(name + " on " + size + "x" + size);
        show.handle("Lin");

        // 下面两行会编译失败：lambda 捕获的变量不能改
        // size = 20;
        // ClickHandler bad = name -> System.out.println(size);
    }
}

interface ClickHandler {
    void handle(String name);
}
` },

    { t: 'callout', kind: 'warn', title: 'lambda 的三个边界', html:
      '① <b>不是所有接口都能写成 lambda</b>：接口必须恰好一个抽象方法，<code>Comparable</code> 是，但有两方法的自定义接口不是；<br>' +
      '② <b>不能捕获会被修改的局部变量</b>：<code>for</code> 循环里的 <code>i</code> 在 lambda 里用不了（会被改），先把值复制给一个临时变量；<br>' +
      '③ <b>调试信息变少</b>：lambda 在异常栈里显示为 <code>lambda$main$0</code> 之类的名字，比具名方法难定位；逻辑复杂就抽成方法再引用它。'
    },

    /* ------------------------------------------------------------------ 八、项目里的 lambda */
    { t: 'h', text: '八、项目里的 lambda', id: 'ch05-8' },

    { t: 'p', html:
      '三个项目里 lambda 出现的场景高度集中：<b>事件处理</b>（按钮、鼠标）、<b>集合遍历</b>（<code>list.forEach(...)</code>）、' +
      '<b>线程任务</b>（<code>new Thread(() -&gt; ...)</code>，Chat Zoom 里给每个客户端开线程）。' +
      '共同点是「把一个行为交给别人以后调用」——lambda 让这件事不用再写一个类。' +
      '期末考不考「lambda 语法细节」，但会考「这个接口能不能用 lambda」「这一段改写后等价吗」这类判断题，本质还是函数式接口的定义与类型推断。'
    },

    { t: 'compare', left: {
      title: '匿名内部类',
      html: '能实现多方法接口、能访问外部类的 <code>this</code>、调试栈有类名；但模板代码多。'
    }, right: {
      title: 'Lambda',
      html: '只用于函数式接口，写法短、读起来像函数；<code>this</code> 指外层对象，调试栈较难读。'
    } },

    { t: 'p', html:
      '选择标准：<b>函数式接口 + 逻辑一两行 → lambda；需要多个方法、或逻辑复杂 → 具名类</b>。' +
      'Tutorial 7 给的任务是「用 lambda 重写项目 1」，实际做一遍你会发现：真正变短的是事件绑定部分，' +
      '而业务逻辑（广播、校验、胜负）还是留在原来的类里——这正说明了 lambda 的定位：<b>连接行为的胶水</b>，不是万能的缩写工具。'
    },

    /* ------------------------------------------------------------------ 交互 */
    { t: 'p', html: '下面这个实验台把「匿名内部类 ↔ Lambda ↔ 方法引用」三种写法放在一起改写，亲手对照一遍：' },

    { t: 'lab', id: 'lambda' },

    { t: 'p', html: '再用三道题检验函数式接口与 lambda 的规则：' },

    { t: 'quiz', qid: 'ch05-q1' },

    { t: 'quiz', qid: 'ch05-q2' },

    { t: 'quiz', qid: 'ch05-q3' },

    /* ------------------------------------------------------------------ 章末 */
    { t: 'keypoint', items: [
      { title: '函数式接口', html: '有且仅有一个抽象方法的接口；两个抽象方法就不能用 lambda。' },
      { title: '匿名内部类', html: '<code>new 接口名() { ... }</code> 当场实现，是 lambda 的前身。' },
      { title: '语句 lambda', html: '<code>(参数) -&gt; { 多行; return ...; }</code>，方法体多行时用。' },
      { title: '表达式 lambda', html: '<code>参数 -&gt; 表达式</code>，只能一个表达式、不带分号；参数类型可推断省略。' },
      { title: '方法引用', html: '<code>类名::方法名</code> / <code>对象::方法名</code>，lambda 只是原样转调时使用。' },
      { title: 'JavaFX', html: '<code>btn.setOnAction(e -&gt; ...)</code>、<code>setOnMouseClicked(e -&gt; ...)</code>，e 是事件对象。' },
      { title: '捕获', html: 'lambda 捕获的局部变量必须 effectively final；多方法接口仍要写类。' }
    ] },

    { t: 'checklist', id: 'ch05', items: [
      '我能说出函数式接口的定义，并判断给定接口能不能用 lambda',
      '我能把匿名内部类改写成语句 lambda，再改写成表达式 lambda',
      '我能解释 lambda 的参数类型与目标类型为什么能省略',
      '我能写出零参、一参、两参的 lambda，并说出括号什么时候能省',
      '我能把「只是转调方法」的 lambda 换成方法引用',
      '我能写出 <code>btn.setOnAction(e -&gt; ...)</code> 与鼠标点击的 lambda，并说出 e 是什么',
      '我能解释 effectively final 规则，并说出被违反时会怎样',
      '我能说出 lambda 相对于匿名内部类的三个边界'
    ] },

    { t: 'callout', kind: 'exam', title: '考试怎么考这一章', html:
      'lambda 在期末属于 Part I 选择与 Part II 判断的「概念题」，不要求手写复杂 lambda：' +
      '① <b>函数式接口判定</b>——给一个接口问「能否用 lambda 表示」，答案取决于抽象方法个数（一个才行）。' +
      '② <b>等价改写</b>——给匿名内部类问「改写成 lambda 是哪一项」，注意参数、箭头、去掉 <code>new</code> 与接口名。' +
      '③ <b>语法对错</b>——「表达式 lambda 后面可以带分号」错；「语句 lambda 可以写 return」对。' +
      '④ <b>类型推断</b>——「lambda 的参数类型必须写出来」错，可从上下文推断。' +
      '⑤ <b>方法引用</b>——<code>System.out::println</code> 等价于哪个 lambda（<code>s -&gt; System.out.println(s)</code>）。' +
      '⑥ <b>事件</b>——<code>setOnAction</code> 的参数类型是什么（<code>EventHandler&lt;ActionEvent&gt;</code>）。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      'lambda 是 AI 最容易「写对但解释错」的语法。练习方式：① 让 AI 把一段匿名内部类改写成 lambda，你自己逐字核对少掉了什么；' +
      '② 反过来，把 lambda 还原成匿名内部类，检查你是否真的理解目标类型与参数推断；' +
      '③ 让它出「下面哪个接口不能用 lambda 表示」的题，并追问理由（抽象方法个数）；' +
      '④ 把 JavaFX 的事件代码贴给它，问「<code>e</code> 的类型是什么、从哪来」，答不上来就让它查 <code>EventHandler</code> 的定义。' +
      '自己验证的唯一方式是：在 IntelliJ 里真跑一遍，看编译器和运行结果是否和你说的一致——站内引擎跑不了 lambda，这一章必须动手。'
    }

  ]
});
