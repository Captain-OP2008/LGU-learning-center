/* =====================================================================
 * data/ch09.js · 第 09 章：JavaFX 基础：Stage·Scene·Node
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5
 * 本章要点：JavaFX 是什么 / Stage-Scene-Node 三层结构 / Application 六步 /
 *           launch(args) 与程序入口 / 多 Scene 切换 / 模块化与 IntelliJ 配置
 * 本章所有代码块 run:false（浏览器内无法执行 JavaFX），交互由 lab fxstage 承担。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch09',
  num: '09',
  title: 'JavaFX 基础：Stage·Scene·Node',
  en: 'JavaFX Fundamentals',
  goals: [
    '能画出 Stage → Scene → 场景图 的三层包含关系，并说清每层各自负责什么',
    '能不看资料写出 extends Application + start(Stage) + launch(args) 的完整骨架',
    '能解释 start() 是谁调用的、忘了 show() 会发生什么、@Override 为什么必须写',
    '能用两个 Scene 在一个 Stage 里完成登录页与注册页的切换',
    '能在 IntelliJ 里给项目加上 JavaFX SDK 与 module-path，并判断"包找不到"是配置问题还是代码问题'
  ],
  kp: [
    { id: 'ch09-1', title: 'JavaFX 是什么：桌面应用与 RIA' },
    { id: 'ch09-2', title: 'Stage / Scene / Node 三层结构' },
    { id: 'ch09-3', title: 'Application 子类与 start(Stage)' },
    { id: 'ch09-4', title: '六步：从按钮到窗口' },
    { id: 'ch09-5', title: 'launch(args) 与程序入口' },
    { id: 'ch09-6', title: '多 Scene 切换（登录 / 注册）' },
    { id: 'ch09-7', title: '模块化与 IntelliJ 配置' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
`控制台版的五子棋能下：轮到你时在终端敲一行 <code>8 8</code>，程序打印一张字符棋盘。可玩家得自己数格子，棋盘一长就看不出形状，胜负也只能靠一行行 <code>X</code> 去数。真实游戏是什么样？窗口里有一块棋盘，你拿鼠标点在交叉点上，棋子立刻落下去——这就是 <b>GUI（Graphical User Interface，图形用户界面）</b>，也是课程第 5 讲到第 8 讲的主题。<br>Gomoku 项目的界面部分、期末 Part IV 的编程题，都建立在这四章上。这一章先解决最底层的问题：<b>一个窗口是怎么被搭起来的</b>。搞懂舞台（Stage）、场景（Scene）、节点（Node）三层，以及 <code>Application</code> 子类的六步启动流程，后面三章（控件与布局、图形与画布、事件）才有地方安放。` },

    { t: 'p', lead: true, html:
`一句话概括：<b>JavaFX 是 Java 的 GUI 库；一个窗口 = 一个 Stage 装一个 Scene，Scene 里挂一棵 Node 树；程序入口是 <code>extends Application</code> 的类，<code>start(Stage)</code> 里完成"控件 → 布局 → 场景 → 舞台 → 显示 → 事件"六步。</b>` },

    { t: 'h', text: '一、JavaFX 是什么：桌面应用与 RIA', id: 'ch09-1' },

    { t: 'p', html:
`<b>JavaFX</b> 是 Java 的一个库（library），用来开发<b>桌面应用（desktop application）</b>和<b>富互联网应用（Rich Internet Application，RIA）</b>。RIA 不用背定义：它指"界面像桌面软件一样丰富、又能像网页一样分发"的应用。同一份 JavaFX 代码可以运行在桌面、移动端和浏览器里，这就是它跨平台的卖点。<br>讲义列了三个特性：<b>① 一套图形与媒体包</b>——自带 2D/3D 图形引擎，能画图形、放媒体；<b>② Scene Builder</b>——可视化拖拽界面，拖完能生成对应代码；<b>③ 丰富的 UI 组件</b>——按钮、文本框、表格、树、标签页、图表，拿来即用。课程举的三个例子（聊天室 Chatroom、SuperMario、Gomoku）都是 JavaFX 应用，和你要写的项目是同一类东西。` },

    { t: 'callout', kind: 'warn', title: '先别急着写代码：JavaFX 不在 JDK 里', html:
`从 <b>JDK 11</b> 开始，JavaFX 被移出了标准 JDK，不再随 JDK 一起安装。所以在 IntelliJ 里新建一个普通 Java 项目，写 <code>import javafx.application.Application;</code> 会立刻飘红：<code>package javafx.application does not exist</code>。这不是代码写错了，是<b>项目里根本没有 JavaFX 的包</b>。<br>判断方法只有一个：看 <b>External Libraries</b> 里有没有 <code>javafx</code>（或 <code>org.openjfx</code>）这一项。没有就是环境没配好，编译不会通过；配置步骤在本章第七节。` },

    { t: 'h', text: '二、三层结构：Stage、Scene、Node', id: 'ch09-2' },

    { t: 'p', html:
`讲义原文：<i>JavaFX application is divided into Stages, Scenes and nodes.</i> 用剧院打比方最直观：<b>Stage 是舞台</b>——整个窗口，带标题栏和边框；<b>Scene 是这一幕的布景</b>——窗口里能看到的全部内容；<b>Node 是布景里的每件道具</b>——一个按钮、一行文字、一个布局、一条线。<br>三者是层层包含的关系：一个 Stage 同时只显示<b>一个</b> Scene；一个 Scene 挂<b>一个根节点（root）</b>；根节点往下长出整棵<b>场景图（scene graph）</b>。所以"改界面"就是改这棵树上的节点，"换页面"就是换 Scene。` },

    { t: 'table',
      head: ['层次', '是什么', '负责什么', '常用 API'],
      rows: [
        ['<code>Stage</code>（舞台）', '窗口', '标题、图标、显示与关闭；同一时刻显示一个 Scene', '<code>setTitle</code> / <code>setScene</code> / <code>show</code> / <code>close</code>'],
        ['<code>Scene</code>（场景）', '内容容器', '挂一个根节点，决定内容区尺寸', '<code>new Scene(root, w, h)</code> / <code>getRoot</code>'],
        ['<code>Node</code>（节点）', '界面元素', '按钮、标签、布局、图形都算；由父节点摆放', '<code>setOnAction</code> / <code>setLayoutX</code>']
      ],
      caption: '三层各管一件事：窗口 → 内容 → 元素' },

    { t: 'terms', cols: 2, items: [
      { en: 'Stage', zh: '舞台', html: '顶层容器，代表一个窗口；管标题、尺寸和显示。一个程序只有一个 primary Stage。' },
      { en: 'Scene', zh: '场景', html: '窗口内容的容器，用 <code>new Scene(root, w, h)</code> 创建；一个 Stage 同时显示一个 Scene。' },
      { en: 'Node', zh: '节点', html: '场景图里的一个可视元素：按钮、标签、布局、图形……能被布局摆放，也能被事件命中。' },
      { en: 'Scene Graph', zh: '场景图', html: '从根节点开始的一棵树；父节点负责摆放子节点，渲染时从根往下遍历整棵树。' }
    ] },

    { t: 'compare', left: {
      title: 'Stage：窗口本身',
      html: '负责"外壳"：标题、图标、显示与关闭。切换页面时 Stage 不变，只是换掉里面的 Scene。',
      code: 'stage.setTitle("Gomoku");\nstage.setScene(scene);\nstage.show();'
    }, right: {
      title: 'Scene：窗口里的内容',
      html: '负责"内容"：挂一个根节点，决定内容区多大。登录页和注册页是两个 Scene，切换就是换 Scene。',
      code: 'Scene login = new Scene(loginRoot, 320, 240);\nstage.setScene(login);   // 换页面'
    } },

    { t: 'svg', maxW: 640, html:
`<svg viewBox="0 0 640 260" role="img" aria-label="Stage 包含 Scene，Scene 包含场景图">
  <rect x="6" y="6" width="628" height="248" fill="none" stroke="currentColor" stroke-opacity=".35"/>
  <text x="20" y="30" fill="currentColor" font-size="13">Stage（窗口）· setTitle / show()</text>
  <rect x="30" y="42" width="580" height="196" fill="none" stroke="currentColor" stroke-opacity=".6"/>
  <text x="44" y="64" fill="currentColor" font-size="13">Scene（内容边界）· new Scene(root, 320, 240)</text>
  <rect x="60" y="78" width="520" height="144" fill="none" stroke="currentColor" stroke-opacity=".85"/>
  <text x="74" y="100" fill="currentColor" font-size="13">root（VBox，布局也是 Node）</text>
  <rect x="88" y="116" width="140" height="42" fill="none" stroke="currentColor"/>
  <text x="128" y="142" fill="currentColor" font-size="12">Button</text>
  <rect x="248" y="116" width="140" height="42" fill="none" stroke="currentColor"/>
  <text x="292" y="142" fill="currentColor" font-size="12">Label</text>
  <rect x="408" y="116" width="140" height="42" fill="none" stroke="currentColor"/>
  <text x="428" y="142" fill="currentColor" font-size="12">Canvas（ch11）</text>
  <text x="88" y="196" fill="currentColor" font-size="12" opacity=".8">子节点按顺序放进父节点的 children</text>
</svg>`,
      caption: '三层嵌套：窗口 → 内容 → 场景图' },

    { t: 'p', html:
`看图记三层：外层窗口、中层内容、内层元素。两个细节：<b>① 布局容器本身也是 Node</b>，VBox 和按钮在场景图里没有本质区别，只是布局会把子节点摆好位置；<b>② Scene 的宽高指的是内容区</b>，窗口还要加上标题栏和边框，所以实际窗口总比 Scene 大一圈。` },

    { t: 'h', text: '三、Application 子类与 start(Stage)', id: 'ch09-3' },

    { t: 'p', html:
`写 JavaFX 程序 = 写一个继承 <code>javafx.application.Application</code> 的类，然后重写（override）它的 <code>start(Stage)</code> 方法。这个方法是<b>框架回调</b>：程序启动后，JavaFX runtime 会创建 Application 对象、初始化图形系统、新建一个 primary Stage，再在 JavaFX 应用线程上调用你写的 <code>start</code>，把那个 Stage 交给你。所以 <code>start</code> 里只做一件事：<b>把界面装到这个 Stage 上，然后 <code>show()</code></b>。` },

    { t: 'code', run: false, caption: 'MinimalWindow.java　最小可运行窗口：start 里三行就出窗口', code:
`import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

public class MinimalWindow extends Application {
    @Override
    public void start(Stage stage) {
        stage.setScene(new Scene(new StackPane(), 320, 240));  // 场景 + 空布局
        stage.setTitle("Minimal Window");
        stage.show();                                          // 不 show 就不显示
    }

    public static void main(String[] args) {
        launch(args);                                          // 启动 JavaFX runtime
    }
}
` },

    { t: 'p', html:
`这段代码值得逐行读：<code>@Override</code> 是必须的保险——父类里 <code>start(Stage)</code> 是抽象方法，签名写错（比如参数写成 <code>Scene</code>）编译器会直接告诉你"没有覆盖到"。不写 <code>show()</code> 的话，窗口对象确实建好了，但屏幕上一片空白，这是新手最常见的问题之一。` },

    { t: 'h', lvl: 3, text: '场景图：Scene 里长出的那棵树' },

    { t: 'p', html:
`Scene 构造器的第一个参数叫 root（根节点），它几乎总是某个布局容器。布局用 <code>getChildren()</code> 拿到子节点列表，再用 <code>add()</code> / <code>addAll()</code> 把控件塞进去。场景图是一条"能查"的链：每个节点知道自己的父节点，渲染和事件都沿这棵树走。` },

    { t: 'code', run: false, caption: 'SceneGraphDemo.java　布局是根，控件是子节点；getChildren() 是场景图入口', code:
`import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class SceneGraphDemo extends Application {
    @Override
    public void start(Stage stage) {
        Label title = new Label("Score: 0");
        Button plus = new Button("+1");
        Button minus = new Button("-1");

        VBox root = new VBox(8);                  // 根节点：布局容器（垂直排列）
        root.getChildren().addAll(title, plus, minus);
        System.out.println("children = " + root.getChildren().size());  // 3

        stage.setScene(new Scene(root, 260, 180));
        stage.setTitle("Scene Graph");
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'h', text: '四、六步：从按钮到窗口', id: 'ch09-4' },

    { t: 'p', html:
`讲义的 Hello World 例子定义了 JavaFX 程序的固定节奏，也就是"六步"：先继承 Application，再依次造控件、造布局、造 Scene、准备 Stage，最后挂事件。顺序背后的逻辑是<b>从里往外、从静态到动态</b>：先把最小的零件造好，再一层层包起来，最后才让窗口响应操作。` },

    { t: 'steps', items: [
      { title: '第 1 步 · extends Application 并重写 start()', html: '这是 JavaFX 程序的外壳。类必须 public，方法必须 <code>public void start(Stage primaryStage)</code>。' },
      { title: '第 2 步 · 创建控件', html: '例如 <code>Button btn = new Button("Say Hello");</code>。控件创建出来还看不见，它得先进场景图。' },
      { title: '第 3 步 · 创建布局，把按钮加进去', html: '例如 <code>StackPane root = new StackPane(btn);</code> 或 <code>root.getChildren().add(btn);</code>。布局负责摆放。' },
      { title: '第 4 步 · 创建 Scene', html: '<code>Scene scene = new Scene(root, 300, 200);</code>——把根节点交给场景，并指定内容区大小。' },
      { title: '第 5 步 · 准备 Stage', html: '<code>primaryStage.setTitle(...)</code>、<code>primaryStage.setScene(scene)</code>，最后 <code>primaryStage.show()</code>。' },
      { title: '第 6 步 · 给按钮注册事件', html: '<code>btn.setOnAction(e -> System.out.println("Hello"));</code>——第 12 章专门拆事件，这一章先会用。' }
    ] },

    { t: 'code', run: false, caption: 'HelloFX.java　六步完整版：点按钮，控制台打印 Hello', code:
`import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

// 第 1 步：继承 Application，重写 start()
public class HelloFX extends Application {
    @Override
    public void start(Stage primaryStage) {
        // 第 2 步：创建控件
        Button btn = new Button("Say Hello");

        // 第 3 步：创建布局并加入按钮
        StackPane root = new StackPane();
        root.getChildren().add(btn);

        // 第 4 步：创建 Scene
        Scene scene = new Scene(root, 300, 200);

        // 第 5 步：准备 Stage
        primaryStage.setTitle("Hello JavaFX");
        primaryStage.setScene(scene);
        primaryStage.show();

        // 第 6 步：注册事件处理器（点击后往控制台打印）
        btn.setOnAction(e -> System.out.println("Hello, JavaFX!"));
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'p', html:
`运行后是一个 300×200 的窗口，中间一个按钮；点一下，IntelliJ 的 Run 窗口打印一行 <code>Hello, JavaFX!</code>。按钮的位置由 StackPane 决定（默认居中），你只负责把它加进去——这就是"布局管位置"的含义。<br>三个常见疏漏：<b>① 忘了 <code>show()</code></b>，窗口不出现；<b>② 忘了把控件加进布局</b>，控件不显示（它还在内存里，但不在场景图上）；<b>③ <code>start</code> 里抛异常</b>，窗口一闪而过甚至根本不出现——去看 IntelliJ 控制台的异常栈，通常是 import 少了或 SDK 没配。` },

    { t: 'p', html:
`动手之前先看一眼实验台：它把三层结构与六步代码对上号，点左边任一步，右边定位到对应行；再点"运行"，看这个小程序的执行顺序。` },

    { t: 'lab', id: 'fxstage' },

    { t: 'h', text: '五、launch(args) 与程序入口', id: 'ch09-5' },

    { t: 'p', html:
`main 里那句 <code>launch(args);</code> 是 JavaFX 的启动器（launcher）。它做四件事：启动 JavaFX runtime、实例化你的 Application 子类、创建 primary Stage、在 <b>JavaFX 应用线程（JavaFX Application Thread）</b>上调用 <code>start</code>。之后所有界面更新都发生在这一条线程上——第 12 章讲事件时会再遇到它。<br><code>args</code> 就是 main 收到的命令行参数，<code>launch</code> 会把它转交给 Application（可用 <code>getParameters()</code> 读取）。课程示例基本用不到，但签名不能省。` },

    { t: 'p', html:
`两条纪律：<b>① <code>launch()</code> 在一个 JVM 里只能调用一次</b>，第二次会抛 <code>IllegalStateException</code>；<b>② 不要自己 new Application 子类再调 start</b>——图形系统没初始化，会抛异常。JavaFX 8 之后允许省略 main（launcher 自己找 Application 子类），但 IntelliJ 的 Run 按钮会去找 main，所以<b>保留 <code>main</code> + <code>launch(args)</code> 是课程里最稳的写法</b>。` },

    { t: 'h', text: '六、多 Scene：登录页与注册页', id: 'ch09-6' },

    { t: 'p', html:
`真实程序很少只有一个页面。登录页要用户名、密码、登录按钮和"去注册"；注册页则相反。做法不是开两个窗口，而是<b>一个 Stage 装两个 Scene，切换时只改 <code>setScene</code></b>：窗口位置和大小不动，里面的内容整体替换，效果上就是"页面跳转"。` },

    { t: 'code', run: false, caption: 'LoginRegisterApp.java　一个 Stage、两个 Scene：登录页 ⇄ 注册页', code:
`import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class LoginRegisterApp extends Application {
    private Stage stage;
    private Scene loginScene;
    private Scene registerScene;

    @Override
    public void start(Stage primaryStage) {
        stage = primaryStage;

        // ---------- 登录页 ----------
        Label loginTitle = new Label("Login");
        TextField user = new TextField();
        user.setPromptText("username");
        PasswordField pass = new PasswordField();
        Button loginBtn = new Button("Login");
        Button toRegister = new Button("Go to Register");

        VBox loginRoot = new VBox(10, loginTitle, user, pass, loginBtn, toRegister);
        loginRoot.setPadding(new Insets(20));
        loginScene = new Scene(loginRoot, 320, 260);

        // ---------- 注册页 ----------
        Label regTitle = new Label("Register");
        TextField newUser = new TextField();
        newUser.setPromptText("new username");
        PasswordField newPass = new PasswordField();
        Button registerBtn = new Button("Register");
        Button backToLogin = new Button("Back to Login");

        VBox regRoot = new VBox(10, regTitle, newUser, newPass, registerBtn, backToLogin);
        regRoot.setPadding(new Insets(20));
        registerScene = new Scene(regRoot, 320, 300);

        // ---------- 页面切换 ----------
        toRegister.setOnAction(e -> stage.setScene(registerScene));
        backToLogin.setOnAction(e -> stage.setScene(loginScene));

        stage.setTitle("Account");
        stage.setScene(loginScene);
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'p', html:
`三个 Scene 引用为什么做成字段？因为 lambda 里要用。Java 的 lambda 只能捕获 <b>effectively final</b> 的局部变量，字段没有这个限制；而且页面切换本来就需要把 loginScene / registerScene 存下来复用。另一种写法是放进 <code>showLogin()</code> / <code>showRegister()</code> 两个方法，每次切换重新 new Scene，代价是输入框里的字会丢。<br>注意 <code>stage.setScene(...)</code> 之后<b>不需要再 <code>show()</code></b>：Stage 已经在显示中，换 Scene 会立刻刷新。` },

    { t: 'callout', kind: 'warn', title: 'Scene 的尺寸不是窗口尺寸', html:
`<code>new Scene(root, 320, 260)</code> 里的 320×260 是<b>内容区</b>大小，窗口实际还要加上标题栏与边框；如果给 Stage 写 <code>setWidth(320)</code>，show 之后会发现内容区比 320 窄。想让窗口正好包住内容，可以在 show 之后调 <code>stage.sizeToScene()</code>，或者干脆只给 Scene 定尺寸。` },

    { t: 'h', text: '七、模块化：让 IntelliJ 认识 JavaFX', id: 'ch09-7' },

    { t: 'p', html:
`配置的核心思想：<b>先让编译器能找到 JavaFX 的 jar 包，再让运行时通过模块路径（module path）加载 JavaFX 的模块</b>。课程示例通常用"下载 SDK + 手工配置"的方式，四步搞定：` },

    { t: 'steps', items: [
      { title: '下载 JavaFX SDK', html: '到 openjfx.io 下载与 JDK 版本匹配的 SDK（例如 JDK 21 配 JavaFX 21），解压到本地，记住 <code>lib</code> 目录路径。' },
      { title: '把 SDK 加进项目库', html: 'IntelliJ：<b>File → Project Structure → Libraries → + → Java</b>，选中 SDK 的 <code>lib</code> 目录。加完 External Libraries 里应能看到一堆 <code>javafx.*</code> 的 jar。' },
      { title: '配置 VM options', html: '<b>Run → Edit Configurations</b>，VM options 填 <code>--module-path "C:\\javafx-sdk-21\\lib" --add-modules javafx.controls,javafx.fxml</code>。路径按你的解压位置改，引号不能省。' },
      { title: '验证', html: '先看 External Libraries 有没有 javafx，再 Run。若提示 <code>JavaFX runtime components are missing</code>，九成是 VM options 的路径或模块名写错——不是代码错。' }
    ] },

    { t: 'code', run: false, caption: 'module-info.java　模块化项目的模块声明示意（配置文件，不是普通 Java 类）', code:
`module com.example.fxdemo {
    requires javafx.controls;   // 控件、布局、Scene、Stage 都在这个模块里
    requires javafx.fxml;       // 只有用 FXML 才需要
    exports com.example.fxdemo; // 让 JavaFX runtime 能实例化应用类
}
` },

    { t: 'p', html:
`什么时候需要 <code>module-info.java</code>？只有项目<b>开启模块化</b>时。课程示例和 IntelliJ 的普通 Java 项目大多不是模块化项目，靠 SDK + <code>--module-path</code> 就够了，不用写 module-info。<br>三样东西别混：<b>SDK 放在哪</b>（Libraries）、<b>编译/运行时去哪找模块</b>（VM options）、<b>项目自己声明依赖谁</b>（module-info）——缺一样都可能编译或启动失败。另一个坑：<code>--module-path</code> 要指到 <code>lib</code> 目录，不是 SDK 根目录也不是 <code>bin</code>，否则报 <code>Module javafx.controls not found</code>。` },

    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch09-q1' },
    { t: 'quiz', qid: 'ch09-q2' },
    { t: 'quiz', qid: 'ch09-q3' },

    { t: 'keypoint', items: [
      { title: '三层结构', html: 'Stage 是窗口、Scene 是内容、Node 是元素；一个 Stage 一个 Scene，一个 Scene 一棵场景图。' },
      { title: '六步', html: '<code>extends Application</code> → Button → 布局 → Scene → Stage（setScene / show）→ setOnAction。' },
      { title: 'start 是回调', html: '<code>start(Stage)</code> 由 <code>launch(args)</code> 触发，跑在 JavaFX 应用线程上；不 <code>show()</code> 窗口不出现。' },
      { title: '多 Scene', html: '一个 Stage 可以换多个 Scene：<code>stage.setScene(other)</code>；切换后不必重新 show。' },
      { title: '模块化', html: 'JDK 11+ 要单独引入 JavaFX：External Libraries 有 javafx 包，VM options 有 <code>--module-path</code> 与 <code>--add-modules</code>。' },
      { title: '布局也是节点', html: 'VBox / StackPane 都是 Node，可以嵌套；控件必须进场景图才显示。' }
    ] },

    { t: 'checklist', id: 'ch09', items: [
      '我能画出 Stage → Scene → 场景图 的三层包含关系',
      '我能默写 extends Application + start(Stage) + launch(args) 的骨架',
      '我能说出六步里每一步分别创建或设置了什么',
      '我知道忘了 show() 会怎样，也知道 start 为什么要写 @Override',
      '我能解释 launch(args) 与 start(Stage) 的调用关系',
      '我能用一个 Stage + 两个 Scene 做出登录 / 注册切换',
      '我知道 stage.setScene() 之后为什么不用再 show()',
      '我能说出"包找不到"时先查 External Libraries 和 VM options',
      '我知道 --module-path 要指向 SDK 的 lib 目录',
      '我能解释为什么控件不加进布局就不显示'
    ] },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
`期末四部分都可能碰到 JavaFX，最可能是 <b>Part III 填空</b>和 <b>Part IV 简答 / 编程</b>：<br>① <b>填空</b>：补全六步里的关键 API，例如 <code>primaryStage.____(scene)</code>（setScene）、<code>primaryStage.____()</code>（show）、类声明 <code>extends ____</code>（Application）。背 API 名字和参数顺序，比背整段代码划算。<br>② <b>简答</b>：解释 Stage / Scene / Node 三层结构，或问"窗口为什么不显示"。答题模板：先给包含关系，再每层举一个例子，最后点 API。<br>③ <b>编程</b>：给简单需求（一个按钮 + 点击计数），要求写完整的 Application 子类。评分点通常是类声明、start 签名、Scene 构造、setScene / show、事件注册。<br>④ <b>判断</b>：常见错误说法——"一个 Stage 可以同时显示多个 Scene"（错）、"JavaFX 随 JDK 一起发布"（JDK 11+ 错）、"start 由 main 直接调用"（错，是 launch 调的）。` },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
`让 AI 生成 JavaFX 代码，最容易错的是<b>环境相关部分</b>：它给的 Maven 依赖可能和你的 JDK 版本不匹配，它默认模块化可能塞给你一个编译不过的 module-info。正确姿势：<br>① 让 AI 只生成 <code>Application</code> 子类的类体（import 自己补），你对照六步检查每一步在不在；<br>② 把报错原文（尤其是 <code>JavaFX runtime components are missing</code>、<code>module not found</code>）连同你的 VM options 一起发给它，问"是代码问题还是配置问题"，并要求它先说判断依据；<br>③ 让它解释每一行为什么必须在这个位置（例如 show 与 setOnAction 的先后），你能复述出来才算学会。<br>期末闭卷，AI 帮不了你；这里练的是"读懂 + 会验证"，不是"复制粘贴"。` }

  ]
});
