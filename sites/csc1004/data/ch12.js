/* =====================================================================
 * data/ch12.js · 第 12 章：JavaFX 事件处理
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5
 * 本章要点：事件与事件模型四要素 / setOnAction 与鼠标·键盘事件 /
 *           为什么用 lambda 注册处理器 / 一个 handler 服务多个节点 /
 *           EventFilter（捕获）与 EventHandler（冒泡）/ 把 while 循环改成事件驱动
 * 本章所有代码块 run:false，交互由 lab fxevents 承担。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch12',
  num: '12',
  title: 'JavaFX 事件处理',
  en: 'Event Handling',
  goals: [
    '能说出事件模型四要素（Event Source / Object / Target / Handler），并在一段代码里指出它们分别是谁',
    '能用 lambda 给按钮、画布和场景注册处理器：setOnAction / setOnMouseClicked / setOnKeyPressed',
    '能解释为什么 EventHandler 可以用 lambda 写，并说清匿名内部类、lambda、方法引用三种写法等价',
    '能用一个 handler 服务多个节点，并用 event.getSource() 区分是谁触发的',
    '能说出 EventFilter 与 EventHandler 的执行顺序差异，并把控制台版的输入循环改造成事件驱动'
  ],
  kp: [
    { id: 'ch12-1', title: '事件是什么：用户交互触发的动作' },
    { id: 'ch12-2', title: '事件模型四要素：Source / Object / Target / Handler' },
    { id: 'ch12-3', title: '用 setOnAction 注册处理器' },
    { id: 'ch12-4', title: '鼠标事件与按键事件' },
    { id: 'ch12-5', title: '为什么要用 lambda 注册处理器' },
    { id: 'ch12-6', title: '一个 handler 服务多个节点（getSource）' },
    { id: 'ch12-7', title: 'EventFilter 与 EventHandler：捕获 vs 冒泡' },
    { id: 'ch12-8', title: '实战：把 while 循环换成事件驱动' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
`控制台版的五子棋长这样：<code>while (!gameOver) { 打印棋盘; 读输入; 落子; 判胜负; }</code>——程序主动去"等"玩家输入，等不到就阻塞在 <code>Scanner.nextLine()</code>。这套逻辑搬到 JavaFX 里会立刻出问题：<b>界面线程一旦阻塞，窗口就会卡死</b>，按钮点不动、窗口拖不动，棋盘也不会重画。<br>所以 GUI 程序的写法是反过来的：<b>程序不主动等，而是把"玩家做了什么"变成事件（event），提前注册好处理器（event handler），等事件发生时由框架回调你</b>。Tutorial 7 把这件事说得很形象：控制台版的 while 循环，在 JavaFX 版里由<b>事件监听器隐式完成</b>——这就是事件驱动（event-driven）编程。这一章解决的就是"用户操作 → 代码执行"这条链路。` },

    { t: 'p', lead: true, html:
`界面搭好了只是躯壳，事件处理才是让它"活"起来的部分：按钮点了要有反应，棋子点了要落下去。<b>注册处理器的方式、事件对象里能拿到什么、事件按什么顺序传播</b>——这三件事决定了你能不能写出交互正常的程序。` },

    { t: 'h', text: '一、事件是什么：用户交互触发的动作', id: 'ch12-1' },

    { t: 'p', html:
`讲义的定义：<i>An event in JavaFX represents an action triggered by user interaction.</i> 课程列了五种典型情况：<b>点击按钮</b>、<b>按键</b>、<b>移动鼠标</b>、<b>改变窗口大小</b>、<b>拖拽对象</b>。凡是"用户做了什么"引起的动作，在 JavaFX 里都变成一个事件对象。<br>每个事件都是 <code>Event</code> 类或其子类的实例（讲义：<i>Each event is represented by an instance of the Event class or its subclasses</i>）。点按钮产生 <code>ActionEvent</code>，鼠标动作产生 <code>MouseEvent</code>，按键产生 <code>KeyEvent</code>——类型决定了你能从它身上读出什么信息。` },

    { t: 'h', text: '二、事件模型四要素：Source / Object / Target / Handler', id: 'ch12-2' },

    { t: 'p', html:
`讲义的 JavaFX 事件模型由四部分组成，这四个词必须能对上号：<b>Event Source（事件源）</b>是产生事件的组件，比如 Button、TextField；<b>Event Object（事件对象）</b>是携带事件信息的对象，比如 MouseEvent、KeyEvent；<b>Event Target（事件目标）</b>是接收事件的节点；<b>Event Handler（事件处理器）</b>是处理事件的方法/对象。<br>简单场景里 Source 和 Target 常常是同一个节点（点按钮，源和目标都是按钮）；事件在父子节点之间传播时两者才可能不同——第 7 节讲的正是这件事。` },

    { t: 'terms', cols: 2, items: [
      { en: 'Event Source', zh: '事件源', html: '产生事件的组件，例如被点击的 Button、被敲击的 TextField。' },
      { en: 'Event Object', zh: '事件对象', html: '携带事件信息的对象，如 <code>ActionEvent</code>、<code>MouseEvent</code>、<code>KeyEvent</code>。' },
      { en: 'Event Target', zh: '事件目标', html: '接收事件的节点；处理器注册在谁身上，事件就派发给谁。' },
      { en: 'Event Handler', zh: '事件处理器', html: '处理事件的方法，签名是 <code>void handle(T event)</code>，用 lambda 或方法引用来实现。' }
    ] },

    { t: 'p', html:
`拿 Gomoku 举例：玩家在 Canvas 上点了一下。<b>事件源</b>是那块 Canvas；<b>事件对象</b>是一个 <code>MouseEvent</code>，里面带着 <code>getX()</code> / <code>getY()</code> 以及按的是哪个键；<b>事件目标</b>是接收到事件的节点；<b>处理器</b>是你注册的那个 lambda——它从坐标反算出行列，然后落子。<br>注意"用户操作"不止点击：滚动鼠标滚轮、按方向键、拖拽窗口、窗口获得/失去焦点，都是事件。你要做的永远是同一件事：<b>想清楚要监听哪种事件 → 找对应的 setOnXxx 方法 → 在处理器里写逻辑</b>。` },

    { t: 'h', text: '三、用 setOnAction 注册处理器', id: 'ch12-3' },

    { t: 'p', html:
`讲义指出：<b>Node 类有一系列事件处理器属性（event handler properties）</b>，用 <code>setOnXxx()</code> 把 EventHandler 挂上去，该节点就能收到对应类型的事件。最常用的是 <code>setOnAction()</code>：按钮被点击时处理器被调用。<br>所以"让按钮有反应"只要两行：先有按钮，再给按钮设置 onAction，处理器参数是 <code>ActionEvent</code>。` },

    { t: 'code', run: false, caption: 'ClickCounter.java　点一次按钮，计数 +1 并更新标签', code:
`import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class ClickCounter extends Application {
    private int count = 0;               // 状态存在字段里，跨多次点击保留

    @Override
    public void start(Stage stage) {
        Label label = new Label("clicked: 0 times");
        Button btn = new Button("Click me");

        // 注册事件处理器：点击时执行 lambda 里的代码
        btn.setOnAction(e -> {
            count++;                                  // 修改状态
            label.setText("clicked: " + count + " times");  // 刷新界面
        });

        VBox root = new VBox(10, label, btn);
        root.setPadding(new Insets(16));
        stage.setScene(new Scene(root, 260, 120));
        stage.setTitle("Click Counter");
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'p', html:
`这段代码里有一个核心模式：<b>事件处理器负责"读状态 → 改状态 → 刷界面"</b>。<code>count</code> 必须写成字段而不是 lambda 里的局部变量——lambda 每次点击都要修改同一个计数器，而局部变量做不到（lambda 只能捕获 effectively final 的变量）。<code>e</code> 本身常常用不到，但参数不能省，第 6 节要靠它调 <code>getSource()</code>。` },

    { t: 'h', text: '四、鼠标事件与按键事件', id: 'ch12-4' },

    { t: 'p', html:
`按钮之外，最重要的两类事件是鼠标与键盘，方法名很规律：<b><code>setOnMouseClicked</code></b>（点击）、<code>setOnMouseMoved</code>（移动）、<code>setOnMouseDragged</code>（拖拽）；<b><code>setOnKeyPressed</code></b>（按下）、<code>setOnKeyReleased</code>（松开）。<br><code>MouseEvent</code> 提供 <code>getX()</code> / <code>getY()</code>（相对<b>事件源节点</b>的坐标）、<code>getButton()</code>（<code>MouseButton.PRIMARY</code> / <code>SECONDARY</code>）、<code>getClickCount()</code>；<code>KeyEvent</code> 用 <code>getCode()</code> 拿 <code>KeyCode</code>（如 <code>KeyCode.LEFT</code>），<code>getText()</code> 拿字符。<br><b>键盘事件的前提是节点有焦点（focus）</b>：按钮、输入框天然有，普通 Canvas / Pane 默认没有，所以按键监听常注册在 <b>Scene</b> 上——它总能收到。` },

    { t: 'code', run: false, caption: 'MouseKeyDemo.java　点一下画布移动标记，方向键微调：鼠标 + 键盘两个事件一起用', code:
`import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.input.KeyCode;
import javafx.scene.layout.StackPane;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

public class MouseKeyDemo extends Application {
    private double x = 100;
    private double y = 100;
    private Canvas canvas;
    private GraphicsContext gc;

    @Override
    public void start(Stage stage) {
        canvas = new Canvas(220, 220);
        gc = canvas.getGraphicsContext2D();
        paint();

        // 鼠标：点击哪里就把标记移到哪里
        canvas.setOnMouseClicked(e -> {
            x = e.getX();
            y = e.getY();
            paint();
        });

        Scene scene = new Scene(new StackPane(canvas), 240, 240);

        // 键盘：注册在 Scene 上，不依赖节点焦点
        scene.setOnKeyPressed(e -> {
            if (e.getCode() == KeyCode.LEFT)  x -= 10;
            if (e.getCode() == KeyCode.RIGHT) x += 10;
            if (e.getCode() == KeyCode.UP)    y -= 10;
            if (e.getCode() == KeyCode.DOWN)  y += 10;
            paint();
        });

        stage.setScene(scene);
        stage.setTitle("Mouse + Key");
        stage.show();
    }

    private void paint() {
        gc.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());
        gc.setFill(Color.CORNFLOWERBLUE);
        gc.fillOval(x - 8, y - 8, 16, 16);
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'table',
      head: ['事件类', '典型来源', '常用读取方法'],
      rows: [
        ['<code>ActionEvent</code>', '按钮点击、菜单项、回车', '<code>getSource()</code> / <code>getTarget()</code>'],
        ['<code>MouseEvent</code>', '点击、移动、拖拽、滚轮', '<code>getX()</code> / <code>getY()</code> / <code>getButton()</code>'],
        ['<code>KeyEvent</code>', '键盘按下 / 松开 / 输入', '<code>getCode()</code> / <code>getText()</code>'],
        ['<code>WindowEvent</code>', '窗口关闭、图标化、重新激活', '<code>getEventType()</code>'],
        ['<code>Event</code>', '所有事件的父类', '<code>getSource()</code> / <code>getTarget()</code> / <code>consume()</code>']
      ],
      caption: '事件类家族：越往下越通用；<code>Event</code> 是共同父类' },

    { t: 'h', text: '五、为什么要用 lambda 注册处理器', id: 'ch12-5' },

    { t: 'p', html:
`<code>EventHandler</code> 是一个<b>函数式接口（functional interface）</b>：它只有一个抽象方法 <code>void handle(T event)</code>。Java 的 lambda 本质就是"用更短的写法实现一个函数式接口"，所以 <code>btn.setOnAction(e -&gt; …)</code> 完全等价于 new 一个匿名内部类再重写 <code>handle</code>。<br>为什么 JavaFX 里几乎所有人都用 lambda？因为<b>事件处理器大多是"一次性、几行代码"的东西</b>：匿名内部类要写 5 行样板，lambda 一行就够。Tutorial 7 也专门用 JavaFX 的 handler 演示了从"内部类 → 匿名类 → 语句 lambda → 表达式 lambda"的演进。` },

    { t: 'codegroup', tabs: [
      { label: '① 匿名内部类', run: false, code:
`import javafx.application.Application;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

public class AnonymousHandler extends Application {
    @Override
    public void start(Stage stage) {
        Button btn = new Button("Click me");

        // 最啰嗦的写法：显式 new 一个 EventHandler 实现
        btn.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent e) {
                System.out.println("clicked by anonymous class");
            }
        });

        stage.setScene(new Scene(new StackPane(btn), 260, 120));
        stage.show();
    }

    public static void main(String[] args) { launch(args); }
}
` },
      { label: '② lambda', run: false, code:
`import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

public class LambdaHandler extends Application {
    @Override
    public void start(Stage stage) {
        Button btn = new Button("Click me");

        // 等价写法：参数类型由 setOnAction 的签名推断为 ActionEvent
        btn.setOnAction(e -> System.out.println("clicked by lambda"));

        stage.setScene(new Scene(new StackPane(btn), 260, 120));
        stage.show();
    }

    public static void main(String[] args) { launch(args); }
}
` },
      { label: '③ 方法引用', run: false, code:
`import javafx.application.Application;
import javafx.event.ActionEvent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

public class MethodRefHandler extends Application {
    @Override
    public void start(Stage stage) {
        Button btn = new Button("Click me");

        // 已有方法签名匹配 handle(ActionEvent) 时，可以直接引用
        btn.setOnAction(this::onClick);

        stage.setScene(new Scene(new StackPane(btn), 260, 120));
        stage.show();
    }

    public void onClick(ActionEvent e) {
        System.out.println("clicked by method reference");
    }

    public static void main(String[] args) { launch(args); }
}
` }
    ] },

    { t: 'p', html:
`三种写法编译后都是"一个实现了 EventHandler 的对象"，区别只在可读性：处理器很长时抽成普通方法更清楚，要挂到多个节点时也要先定义成变量或方法。<br>两个语法限制：<b>① 语句 lambda 用 <code>{ }</code> 包多行，表达式 lambda 只能一句、不写分号</b>；<b>② 捕获的局部变量必须 effectively final</b>——在循环里注册处理器时，变量要每轮重新声明。` },

    { t: 'h', text: '六、一个 handler 服务多个节点（getSource）', id: 'ch12-6' },

    { t: 'p', html:
`讲义强调：<b>一个节点可以有多个 EventHandler</b>，<b>一个 handler 也可以注册给多个节点</b>。后者在实战里很常见：对话框的 OK 和 Cancel 都要打印日志，没必要写两个一模一样的 lambda。<br>但 handler 怎么知道"现在是谁被点了"？<b><code>event.getSource()</code> 返回事件源（触发事件的那个组件）</b>，讲义原话是 <i>The event source is discriminated in the handle() method</i>；转型成 <code>Button</code> 再 <code>getText()</code> 就能判断。` },

    { t: 'code', run: false, caption: 'SharedHandlerDemo.java　一个 handler 挂两个按钮：用 getSource() 区分', code:
`import javafx.application.Application;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.HBox;
import javafx.stage.Stage;

public class SharedHandlerDemo extends Application {
    @Override
    public void start(Stage stage) {
        Button ok = new Button("OK");
        Button cancel = new Button("Cancel");

        // 同一个 handler 注册给两个按钮
        EventHandler<ActionEvent> handler = e -> {
            Button src = (Button) e.getSource();     // 谁触发的事件？
            System.out.println(src.getText() + " was clicked");
        };
        ok.setOnAction(handler);
        cancel.setOnAction(handler);

        HBox root = new HBox(10, ok, cancel);
        stage.setScene(new Scene(root, 260, 100));
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'callout', kind: 'warn', title: 'setOnAction 是"属性"，不是"追加"', html:
`<code>setOnAction(h)</code> 设置的是节点的 onAction 属性：<b>再设一次会覆盖上一次</b>，而不是追加两个处理器。所以"我给按钮设了两个 onAction，怎么只有一个生效"的答案是——本来就会覆盖。<br>要在一个节点上挂多个处理器，用 <code>addEventHandler(EventType, handler)</code>；要拦截并阻止事件继续传播，用 <code>consume()</code>。另外，<code>getSource()</code> 返回的是 <code>Object</code>，转型前最好确认类型（<code>if (src instanceof Button)</code>），免得一个 handler 挂到不同类型节点上时抛 <code>ClassCastException</code>。` },

    { t: 'h', text: '七、EventFilter 与 EventHandler：捕获 vs 冒泡', id: 'ch12-7' },

    { t: 'p', html:
`讲义最后一页专门对比 <b>EventHandler</b> 与 <b>EventFilter</b>。先看事件在场景图里怎么走：点击发生在某个节点上，事件先<b>从根向目标"捕获"下去</b>，到达目标后再<b>从目标向根"冒泡"上来</b>。<br><b>EventFilter 挂在捕获阶段</b>：父节点先看到事件，可以拦截、记录、取消；<b>EventHandler 挂在冒泡阶段</b>：从目标节点开始逐层向上通知。所以同一节点上 <b>filter 先于 handler</b>，跨节点时父节点的 filter 甚至早于目标节点的 handler。` },

    { t: 'flow', nodes: [
      { title: '捕获阶段', desc: 'Stage → Scene → root → … 由外向内，沿路执行 EventFilter', kind: 'start' },
      { title: '到达目标节点', desc: '目标的 filter 最后执行一次', kind: 'proc' },
      { title: '目标阶段', desc: '事件落在被点击的节点上', kind: 'decide' },
      { title: '冒泡阶段', desc: '目标 → root → Scene → Stage 由内向外，执行 EventHandler', kind: 'proc' },
      { title: '处理结束', desc: '中途 consume() 会终止后续传播', kind: 'end' }
    ] },

    { t: 'code', run: false, caption: 'FilterVsHandlerDemo.java　点一次按钮，看三行打印的顺序：filter 先，handler 后', code:
`import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

public class FilterVsHandlerDemo extends Application {
    @Override
    public void start(Stage stage) {
        Button btn = new Button("Click me");
        StackPane root = new StackPane(btn);

        // 捕获阶段：父节点的 filter 最先执行
        root.addEventFilter(MouseEvent.MOUSE_CLICKED,
                e -> System.out.println("1. filter on root"));

        // 冒泡阶段：父节点的 handler 最后执行
        root.addEventHandler(MouseEvent.MOUSE_CLICKED,
                e -> System.out.println("3. handler on root"));

        // 目标节点自己的处理器
        btn.setOnMouseClicked(
                e -> System.out.println("2. handler on button"));

        stage.setScene(new Scene(root, 260, 120));
        stage.setTitle("Filter vs Handler");
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'compare', left: {
      title: 'EventHandler：冒泡阶段',
      html: '事件从目标节点向父节点一层层"冒"上来时执行。<b>后执行</b>。用 <code>setOnXxx()</code> 或 <code>addEventHandler()</code> 注册。正常业务逻辑写在这里。',
      code: 'btn.setOnAction(e -> System.out.println("clicked"));\nroot.addEventHandler(MouseEvent.MOUSE_CLICKED, h);'
    }, right: {
      title: 'EventFilter：捕获阶段',
      html: '事件从根节点向目标"捕"下去时执行。<b>先执行</b>。用 <code>addEventFilter()</code> 注册。适合拦截、全局快捷键、统一拦截点击。',
      code: 'root.addEventFilter(MouseEvent.MOUSE_CLICKED, f);\nroot.addEventFilter(KeyEvent.KEY_PRESSED, f2);'
    } },

    { t: 'p', html:
`一句话记：<b>filter 是"下楼时"看一遍，handler 是"上楼时"看一遍</b>。两者拿的是同一个事件对象，都能调用 <code>consume()</code>——一旦被消费，之后的处理器不再收到它。<br>实战里九成代码只用 handler；filter 用在需要"比别人更早看到事件"的场合，比如窗口级 ESC 关闭、在棋盘外层统一拦截点击。<b>考试问顺序，答案永远是 filter 先、handler 后。</b>` },

    { t: 'p', html:
`动手验证一下事件传播：下面的实验台可以往 Stage / Scene / 节点三层分别挂 filter 和 handler，点一次节点，按执行顺序列出每一步走的是哪条路径；勾掉某一层或调用 consume，观察后续步骤如何被截断。` },

    { t: 'lab', id: 'fxevents' },

    { t: 'h', text: '八、实战：把 while 循环换成事件驱动', id: 'ch12-8' },

    { t: 'p', html:
`把整章拼起来：控制台版的 <code>while (!gameOver) { … }</code> 到了 JavaFX 里怎么变形？<b>循环体变成事件处理器，循环条件变成字段。</b><br>对应关系：<b>① 画棋盘</b> → <code>start()</code> 里画一次；<b>② 读输入</b> → <code>setOnMouseClicked</code> 里用 <code>getX()</code> / <code>getY()</code> 反算行列；<b>③ 落子与判胜负</b> → 处理器里调 move / checkWin 再刷新界面；<b>④ <code>gameOver</code></b> → 变成字段，处理器开头判断后 return。框架负责"什么时候调用"，你负责"调用时做什么"。` },

    { t: 'code', run: false, caption: 'GomokuEventLoop.java　事件驱动的五子棋骨架：一次点击 = 一步棋，没有 while', code:
`import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

public class GomokuEventLoop extends Application {
    private static final int N = 9;
    private static final double CELL = 30;
    private static final double MARGIN = 20;

    private Canvas canvas;
    private GraphicsContext gc;
    private Label status;
    private boolean gameOver = false;
    private boolean blackTurn = true;

    @Override
    public void start(Stage stage) {
        double size = MARGIN * 2 + CELL * (N - 1);
        canvas = new Canvas(size, size);
        gc = canvas.getGraphicsContext2D();
        status = new Label("Black's turn");
        drawBoard();

        // 事件处理器 = 原 while 循环的循环体：一次点击走一步
        canvas.setOnMouseClicked(e -> {
            if (gameOver) return;                       // 原循环条件
            int col = (int) Math.round((e.getX() - MARGIN) / CELL);
            int row = (int) Math.round((e.getY() - MARGIN) / CELL);
            if (row < 0 || row >= N || col < 0 || col >= N) return;

            double cx = MARGIN + col * CELL;
            double cy = MARGIN + row * CELL;
            drawStone(cx, cy, blackTurn ? Color.BLACK : Color.WHITE);
            blackTurn = !blackTurn;
            status.setText(blackTurn ? "Black's turn" : "White's turn");
            // 真实项目在这里调用 game.checkWin(row, col)，赢了就把 gameOver 置 true
        });

        VBox root = new VBox(8, status, canvas);
        stage.setScene(new Scene(root, size + 20, size + 50));
        stage.setTitle("Gomoku: event driven");
        stage.show();
    }

    private void drawBoard() {
        gc.setStroke(Color.BLACK);
        gc.setLineWidth(1);
        for (int i = 0; i < N; i++) {
            double p = MARGIN + i * CELL;
            gc.strokeLine(MARGIN, p, canvas.getWidth() - MARGIN, p);
            gc.strokeLine(p, MARGIN, p, canvas.getHeight() - MARGIN);
        }
    }

    private void drawStone(double cx, double cy, Color color) {
        double r = CELL * 0.4;
        gc.setFill(color);
        gc.fillOval(cx - r, cy - r, 2 * r, 2 * r);
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'p', html:
`这段骨架已经"能玩"：点哪里就在哪里落一颗棋子，黑先白后。但它还缺两样东西，正是 Gomoku 项目要补的：<b>① 合法性检查</b>——交叉点上有没有棋子、该不该黑棋走，需要 <code>GomokuGame</code> 里的二维数组和 <code>move()</code>；<b>② 胜负判定</b>——每落一子检查横、竖、两条斜线是否连成五子（第 14 章）。<br>事件处理器只在 <b>JavaFX 应用线程</b>上运行，处理器里不要做耗时操作，否则界面会卡住。` },

    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch12-q1' },
    { t: 'quiz', qid: 'ch12-q2' },
    { t: 'quiz', qid: 'ch12-q3' },

    { t: 'keypoint', items: [
      { title: '事件', html: '事件是用户交互触发的动作：点击、按键、移动鼠标、缩放窗口、拖拽；每个事件是 Event 或其子类的实例。' },
      { title: '四要素', html: 'Event Source 产生事件、Event Object 携带信息、Event Target 接收事件、Event Handler 处理事件。' },
      { title: 'setOnAction', html: 'Node 的 onXxx 属性用 setter 注册处理器；<code>btn.setOnAction(e -&gt; …)</code> 是按钮响应的标准写法。' },
      { title: '鼠标与键盘', html: '<code>setOnMouseClicked</code> 用 <code>getX/getY</code>；<code>setOnKeyPressed</code> 用 <code>getCode()</code>；键盘事件需要焦点，注册在 Scene 上最稳。' },
      { title: 'lambda', html: 'EventHandler 是只有一个抽象方法 <code>handle(T)</code> 的函数式接口，所以能写成 lambda；匿名内部类、lambda、方法引用三者等价。' },
      { title: '共享 handler', html: '一个 handler 可注册给多个节点，用 <code>event.getSource()</code> 转型判断是谁；<code>setOnAction</code> 重复设置会覆盖，多个处理器用 <code>addEventHandler</code>。' },
      { title: 'Filter vs Handler', html: 'Filter 在捕获阶段（根 → 目标）先执行，Handler 在冒泡阶段（目标 → 根）后执行；同一节点上 filter 先于 handler。' },
      { title: '事件驱动', html: '没有 while：循环体变成处理器，循环条件变成字段；框架负责触发，你负责响应。' }
    ] },

    { t: 'checklist', id: 'ch12', items: [
      '我能说出事件模型的四个要素，并把它们对应到"点击按钮"这个场景',
      '我能写出给按钮注册 setOnAction 的 lambda 版本',
      '我能用 setOnMouseClicked / setOnKeyPressed 分别处理鼠标与键盘',
      '我知道键盘事件为什么需要焦点，以及为什么常注册在 Scene 上',
      '我能解释 EventHandler 为什么可以用 lambda 写',
      '我能写出匿名内部类、lambda、方法引用三种等价写法',
      '我能用一个 handler 服务两个按钮，并用 getSource() 区分',
      '我知道 setOnAction 重复设置会覆盖，以及怎么挂多个处理器',
      '我能说出 filter 与 handler 的执行顺序，以及事件传播的两个阶段',
      '我能把控制台版的输入循环改写成事件驱动的处理器'
    ] },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
`事件是 JavaFX 部分最容易出简答的一章，因为概念清晰、对比明确：<br>① <b>简答 / 对比</b>：EventFilter 与 EventHandler 的区别（捕获 vs 冒泡、谁先执行、各自注册在哪个阶段）；或者解释事件模型的四要素并举例。答题模板：<b>给定义 → 说顺序 → 举一个 Gomoku 的例子</b>。<br>② <b>读代码写输出</b>：给一个"根节点 filter + 根节点 handler + 按钮 handler"的代码，问点一次按钮打印的顺序。答案规律：filter 先（父），目标 handler 次之，父 handler 最后。<br>③ <b>填空</b>：<code>btn.____(e -&gt; …)</code>（setOnAction）、<code>event.____()</code>（getSource）、<code>root.____(MouseEvent.MOUSE_CLICKED, f)</code>（addEventFilter）。<br>④ <b>编程</b>：给一个"点击按钮修改标签"的小题。评分点是<b>处理器注册对了、状态改对了、界面刷新了</b>。<br>判断题常考"setOnAction 可以给一个按钮设置多个处理器"——错，会覆盖。` },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
`事件代码是"能跑但容易错"的重灾区，用 AI 的正确方式是<b>让它当测试员</b>：把它生成的事件代码拿过来，自己先回答三个问题——点一次按钮会打印什么？顺序里 filter 和 handler 谁先？如果父节点 consume 了事件，子节点还会收到吗？然后再运行验证。<br>让 AI 出题时可以说："给我一段 JavaFX 代码，包含一个按钮、一个父容器的 filter 和一个父容器的 handler，让我写点击时控制台的输出顺序，再给解析。" 这种题做三道，事件传播就再也不会错。<br>另外要警惕 AI 的"想当然"：它常把 <code>setOnAction</code> 写成可以叠加、把键盘监听挂在 Canvas 上（没焦点收不到）、在处理器里写 <code>Thread.sleep</code>。每一条都要回讲义和运行结果核对——<b>能指出 AI 错在哪，才算真的学会。</b>` }

  ]
});
