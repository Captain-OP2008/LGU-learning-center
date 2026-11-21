/* =====================================================================
 * data/adv-fx.js · 进阶轨道 · JavaFX 进阶（课程之外的深入学习）
 *
 * 3 个小节：FXML 与 Scene Builder / CSS 与动画 / 自定义控件与绑定
 * 说明：JavaFX 无法在站内 Java 子集引擎运行，所有 code 块统一 run:false，
 *       caption 标注「本站引擎不支持，以下为真实 JavaFX 代码」。
 * 注册：CSC.registerAdvanced([...])，独立数组，不进入 21 章主课程与进度。
 * 作者模块：adv
 * ===================================================================== */

CSC.registerAdvanced([
{
  id: 'fx-deep',
  order: 3,
  title: 'JavaFX 进阶',
  en: 'JAVAFX IN DEPTH',
  part: 'ADVANCED',
  icon: 'grid',
  level: '进阶',
  minutes: 72,
  blurb: '课程用代码一步步搭界面；这一篇讲 FXML 声明式布局、CSS 与动画，以及自定义控件和 Canvas 的取舍。',
  tagline: '从「六步 new 出界面」到「可维护的界面工程」：FXML、样式、动画、绑定与重绘策略。',
  prereq: ['ch09', 'ch10', 'ch11', 'ch12'],
  intro: '<p>课程里的 JavaFX 是「命令式」的：lecture 5 的六步——继承 <code>Application</code>、'
    + '<code>new Button</code>、放进 layout、<code>new Scene</code>、<code>stage.show()</code>、'
    + '<code>setOnAction</code>——界面结构全写在 Java 代码里。这对小 demo 很直观，'
    + '但界面一复杂（聊天窗口、设置面板、棋盘），代码会变成几百行 new 和 add，'
    + '改一个布局要翻半天。</p>'
    + '<p>这一篇补三块工程化能力：<b>FXML + Scene Builder</b>（界面结构与逻辑分离）、'
    + '<b>CSS + 动画</b>（样式统一、动效不手写循环）、<b>Property 绑定与自定义控件</b>'
    + '（数据变化自动反映到界面，复杂组件可复用），最后讨论 Canvas 与场景图在游戏渲染上的取舍。</p>',
  goals: [
    '能读懂 FXML 的 fx:controller / fx:id / onAction，并用 FXMLLoader 加载、取到 controller',
    '能解释 @FXML 注入发生在 load() 期间，以及为什么不能在构造器里用注入字段',
    '能用 JavaFX CSS 统一界面样式，用 Timeline / Transition 做动效',
    '能用 AnimationTimer 写游戏循环，并说清它和 Tkinter after() 的区别',
    '能用 Property 绑定同步数据与界面，并在 Node 场景图与 Canvas 之间做出合理选择'
  ],
  sections: [

    /* ---------------------------------------------------------------- S1 FXML */
    {
      id: 'adv-fx-1',
      title: 'FXML 与 Scene Builder：把界面从代码里拿出来',
      en: 'FXML & SCENE BUILDER',
      minutes: 24,
      html: '课程六步把界面写死在 Java 里；本节讲声明式的 FXML、FXMLLoader，以及 controller 与 @FXML 注入。',
      blocks: [
        { t: 'p', lead: true, html: '课程 lecture 5 的 JavaFX 六步，界面结构全在 <code>start()</code> 里：'
            + '<code>new Button</code>、<code>new VBox</code>、<code>new Scene</code>。'
            + 'lecture 5 的特性列表里提过一句 <b>Scene Builder</b>（可视化布局工具），'
            + 'Tutorial 6 也明确说「我们还没用 FXML」。这一节就补上这个缺口：'
            + '<b>FXML</b> 用 XML 描述界面结构，Java 只写逻辑；Scene Builder 是拖拽生成 FXML 的工具。' },
        { t: 'p', html: '这就是<b>声明式（declarative）</b>与命令式（imperative）的区别：'
            + '命令式说「先 new 一个 VBox，再 new 一个 Label，把 Label 加进去」；'
            + '声明式说「界面长这样」，由加载器去创建对象。好处是结构与逻辑分离——'
            + '改布局只动 XML，不碰业务代码；设计师/队友也能用 Scene Builder 调界面。'
            + '代价是多一层文件、多一次加载、路径和注入出错时错误信息不如代码直观。' },
        { t: 'p', html: '<b>FXMLLoader</b> 负责把 FXML 变成对象树：<code>new FXMLLoader(url)</code>，'
            + '<code>load()</code> 返回根节点，同时创建 controller、注入 <code>@FXML</code> 字段、'
            + '调用 <code>initialize()</code>。FXML 里三个关键属性：'
            + '<code>fx:controller</code> 指定 controller 类，<code>fx:id</code> 对应字段名，'
            + '<code>onAction="#handleSend"</code> 对应 controller 里的方法。'
            + '<code>fx:id</code> 拼错不会报错，只会让字段保持 <code>null</code>，然后在第一次使用时 NPE。' },
        { t: 'p', html: '注入的顺序很重要：<b>先 new controller，再注入字段，最后调用 initialize()</b>。'
            + '所以构造器执行时 <code>@FXML</code> 字段还是 <code>null</code>，'
            + '初始化逻辑必须写在 <code>initialize()</code> 里。'
            + '另一个常见坑是资源路径：<code>getResource("chat.fxml")</code> 相对当前类所在包，'
            + '<code>getResource("/chat.fxml")</code> 从 classpath 根开始；'
            + '打包成 jar 后路径大小写敏感，本地能跑、jar 里找不到，多半是这里。' },
        { t: 'p', html: '用 Scene Builder 的流程是「新建 FXML → 拖控件 → 设 <code>fx:id</code> → '
            + '在 controller 里写同名字段 → 保存」。IDE 里右键 FXML 选 Open in Scene Builder，改完保存，'
            + 'Java 端不用重新生成代码。模块化项目（有 <code>module-info.java</code>）还要记得写 '
            + '<code>opens chat to javafx.fxml;</code>，否则 FXMLLoader 反射注入私有字段会被模块系统拒绝——'
            + '这是「本地能跑、打包就崩」的另一个经典原因。Scene Builder 只负责生成 XML，'
            + 'fx:id 和事件方法名仍要手动与 controller 对齐，工具不会替你写 Java。' },
        { t: 'table', caption: '纯代码 vs FXML：不是谁更高级，而是场景不同',
          head: ['维度', '纯 Java 代码', 'FXML + Scene Builder'],
          rows: [
            ['界面结构', '散落在 start() 与各个方法里', '集中在一个 XML 文件，可整体预览'],
            ['改布局', '改代码、重编译、重新跑', '改 FXML，甚至可视化拖拽'],
            ['逻辑耦合', '结构与事件处理混在一起', 'controller 只管逻辑，结构在 XML'],
            ['调试', '断点、栈信息直接', '路径/注入错误信息较绕'],
            ['适合', '小 demo、动态生成的界面', '复杂表单、多人协作、界面频繁调整']
          ] },
        { t: 'code', run: false, caption: '本站引擎不支持 JavaFX，以下为真实 FXML 文件',
          code: `<?xml version="1.0" encoding="UTF-8"?>
<?import javafx.scene.control.*?>
<?import javafx.scene.layout.*?>

<VBox xmlns:fx="http://javafx.com/fxml" fx:controller="chat.ChatController"
      spacing="8" prefWidth="360" prefHeight="480">
    <Label text="CSC1004 Chat" styleClass="title"/>
    <ListView fx:id="messageList" VBox.vgrow="ALWAYS"/>
    <HBox spacing="6">
        <TextField fx:id="inputField" HBox.hgrow="ALWAYS" promptText="输入消息…"/>
        <Button fx:id="sendButton" text="发送" onAction="#handleSend"/>
    </HBox>
</VBox>` },
        { t: 'code', run: false, caption: '本站引擎不支持 JavaFX 与注解，以下为真实 JavaFX 代码',
          code: `package chat;

import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.ListView;
import javafx.scene.control.TextField;

public class ChatController {
    @FXML private ListView<String> messageList;   // fx:id 必须与字段名一致
    @FXML private TextField inputField;
    @FXML private Button sendButton;

    @FXML
    private void initialize() {
        // load() 完成注入后调用：这里字段一定不为 null
        sendButton.setDisable(true);
        inputField.textProperty().addListener((obs, oldV, newV) ->
            sendButton.setDisable(newV.trim().isEmpty()));
    }

    @FXML
    private void handleSend() {                   // onAction="#handleSend"
        String text = inputField.getText().trim();
        if (text.isEmpty()) return;
        messageList.getItems().add("me: " + text);
        inputField.clear();
    }
}` },
        { t: 'code', run: false, caption: '本站引擎不支持 JavaFX，以下为真实 JavaFX 代码',
          code: `package chat;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class ChatApp extends Application {
    @Override
    public void start(Stage stage) throws Exception {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/chat.fxml"));
        Parent root = loader.load();                 // 解析 FXML、创建节点、注入 @FXML
        ChatController controller = loader.getController();

        stage.setScene(new Scene(root, 360, 480));
        stage.setTitle("CSC1004 Chat");
        stage.show();
    }

    public static void main(String[] args) { launch(args); }
}` },
        { t: 'code', run: false, caption: '三个最常见的 FXML 翻车现场',
          code: `// 反例 1：构造器里用 @FXML 字段 —— 此时 load() 还没注入，字段是 null
public class BadController {
    @FXML private Label status;
    public BadController() {
        status.setText("ready");     // NullPointerException
    }
}

// 反例 2：字段名与 fx:id 不一致 —— 不报错，只是字段保持 null
// chat.fxml: <TextField fx:id="input" .../>
@FXML private TextField inputField;  // 名字不同 -> 注入失败

// 反例 3：onAction 方法签名不匹配
// <Button onAction="#handleSend"/> 需要 void handleSend() 或 void handleSend(ActionEvent)`,
          },
        { t: 'callout', kind: 'warn', html: 'FXML 不是「必须用」。课程项目里界面简单、又只有你一个人写，'
            + '纯代码反而更快；只有当界面复杂到「new 和 add 淹没逻辑」时，FXML 的分离才值得那层复杂度。'
            + '建议先用纯代码把功能跑通，再决定要不要迁移到 FXML。' }
      ]
    },

    /* ---------------------------------------------------------------- S2 CSS 与动画 */
    {
      id: 'adv-fx-2',
      title: 'CSS 与动画：样式和动效不写死在代码里',
      en: 'CSS & ANIMATION',
      minutes: 24,
      html: '课程里颜色写死在 <code>Color.FORESTGREEN</code> 和 <code>setStyle</code> 里；本节讲 JavaFX CSS、'
        + 'Timeline / Transition，以及和 Tkinter <code>after()</code> 的游戏循环对比。',
      blocks: [
        { t: 'p', lead: true, html: '课程里所有外观都写在 Java 代码里：<code>gc.setFill(Color.FORESTGREEN)</code>、'
            + '按钮的样式偶尔用 <code>setStyle("-fx-...")</code> 内联。界面只有几屏时没问题，'
            + '一旦要统一深色主题、hover 效果、字号层级，就会变成到处复制粘贴字符串。'
            + 'JavaFX 提供了和 Web 类似的<b>样式表（stylesheet）</b>机制，'
            + '以及 Timeline / Transition / AnimationTimer 三种动效工具。' },
        { t: 'p', html: '<b>JavaFX CSS</b> 用 <code>-fx-</code> 前缀的属性描述外观：'
            + '<code>-fx-background-color</code>、<code>-fx-text-fill</code>、<code>-fx-font-size</code>、'
            + '<code>-fx-padding</code>、<code>-fx-border-color</code>。选择器和 Web CSS 类似：'
            + '<code>.button</code> 按 styleClass、<code>#sendButton</code> 按 id、<code>.button:hover</code> 伪类。'
            + '把样式表挂到 Scene 上：<code>scene.getStylesheets().add(url)</code>，'
            + '所有子节点都会继承。和 Web 的区别是：属性名带前缀、没有 <code>margin</code> 这类盒模型属性'
            + '（用 <code>-fx-padding</code> 和 layout 的 spacing）、不支持所有 Web 选择器。' },
        { t: 'p', html: '<b>Timeline</b> 是「按时间轴排关键帧」：每个 <code>KeyFrame(Duration, action)</code> '
            + '到点执行一次，可以设循环次数和自动反向。<b>Transition</b> 是常用动画的封装：'
            + '<code>FadeTransition</code>、<code>TranslateTransition</code>、<code>ScaleTransition</code>、'
            + '<code>RotateTransition</code>，设好起止值和时长就能 <code>play()</code>。'
            + '它们都跑在 JavaFX 的动画线程上，不会阻塞 UI 线程，适合按钮反馈、棋子落位、面板滑入。' },
        { t: 'p', html: '<b>AnimationTimer</b> 是「每帧回调」：<code>handle(long now)</code> 在 JavaFX 的'
            + '渲染脉冲（pulse）里被调用，<code>now</code> 是纳秒时间戳。它适合游戏循环——'
            + '每帧算 delta time、更新状态、重绘。和 Tkinter 的 <code>after(ms, callback)</code> 对比：'
            + '<code>after</code> 是「手动递归调度」，回调里要再调一次 <code>after</code> 才能继续，'
            + '精度是毫秒、由 Tkinter 单线程 mainloop 驱动；<code>AnimationTimer</code> 由 JavaFX 的脉冲驱动，'
            + '与渲染同步、给的是纳秒时间，不用自己续期，也不该在里面做耗时操作。' },
        { t: 'p', html: '两个实用细节。第一，<b>样式表 vs 内联</b>：CSS 文件里的颜色改动立即生效，适合统一主题；'
            + '<code>setStyle</code> 内联优先级更高，适合临时覆盖单个节点，但大量拼接字符串会拖慢渲染。'
            + '第二，<b>动画对象要留引用</b>：把 Timeline / Transition 存成字段，才能在切换界面或重复触发时 '
            + '<code>stop()</code> 掉上一次动画；否则多个动画叠加，节点位置会越跑越偏。'
            + '界面销毁时也主动 <code>stop()</code>，避免动画继续持有节点。' },
        { t: 'table', caption: '三种动效工具怎么选',
          head: ['工具', '驱动方式', '适合', '注意'],
          rows: [
            ['<code>Timeline</code>', '时间轴关键帧', '倒计时、闪烁、分段动画', '循环次数、自动反向要显式设置'],
            ['<code>Transition</code>', '内置插值动画', '淡入淡出、位移、缩放、旋转', '一个 Transition 只动一个属性'],
            ['<code>AnimationTimer</code>', '每帧回调（pulse）', '游戏循环、物理更新、Canvas 重绘', '按 delta time 更新，别做重活']
          ] },
        { t: 'code', run: false, caption: '本站引擎不支持 JavaFX，以下为真实的 JavaFX CSS 文件',
          code: `/* src/main/resources/app.css */
.root {
    -fx-background-color: #0b1220;
    -fx-font-family: "Jura", "Microsoft YaHei", sans-serif;
}
.title {
    -fx-text-fill: #e8eef7;
    -fx-font-size: 18px;
}
.button {
    -fx-background-color: #1b2a44;
    -fx-text-fill: #d7e3f4;
    -fx-border-color: #2f4a6d;
    -fx-border-width: 1px;
}
.button:hover { -fx-background-color: #24395c; }
#sendButton { -fx-font-weight: bold; }` },
        { t: 'code', run: false, caption: '本站引擎不支持 JavaFX，以下为真实 JavaFX 代码',
          code: `Scene scene = new Scene(root, 800, 600);
scene.getStylesheets().add(
    getClass().getResource("/app.css").toExternalForm());   // 挂到 Scene，整棵树生效
stage.setScene(scene);` },
        { t: 'code', run: false, caption: '本站引擎不支持 JavaFX，以下为真实 JavaFX 代码',
          code: `import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.scene.control.Label;
import javafx.util.Duration;

public class Countdown {
    private int seconds = 10;

    public void start(Label label) {
        Timeline timeline = new Timeline(
            new KeyFrame(Duration.seconds(1), e -> {
                seconds--;
                label.setText("倒计时 " + seconds + " 秒");
                if (seconds <= 0) label.setText("开始！");
            })
        );
        timeline.setCycleCount(10);     // 只跑 10 次；INDEFINITE 表示无限循环
        timeline.play();
    }
}` },
        { t: 'code', run: false, caption: '本站引擎不支持 JavaFX，以下为真实 JavaFX 代码',
          code: `import javafx.animation.Interpolator;
import javafx.animation.TranslateTransition;
import javafx.scene.shape.Circle;
import javafx.util.Duration;

public class MoveStone {
    public static void animate(Circle stone, double targetX, double targetY) {
        TranslateTransition move =
            new TranslateTransition(Duration.millis(250), stone);
        move.setToX(targetX);
        move.setToY(targetY);
        move.setInterpolator(Interpolator.EASE_BOTH);
        move.play();                 // 异步播放，不阻塞调用线程
    }
}` },
        { t: 'code', run: false, caption: '本站引擎不支持 JavaFX，以下为真实 JavaFX 代码',
          code: `import javafx.animation.AnimationTimer;

public class GameLoop extends AnimationTimer {
    private long last = 0;

    @Override
    public void handle(long now) {          // 每帧调用，now 是纳秒时间戳
        if (last == 0) { last = now; return; }
        double dt = (now - last) / 1_000_000_000.0;   // 秒
        last = now;
        update(dt);                         // 按真实时间推进，而不是假设固定 60 FPS
        render();
    }

    private void update(double dt) { /* 移动蛇、检查碰撞 */ }
    private void render() { /* 重绘 Canvas */ }

    public static void main(String[] args) {
        new GameLoop().start();             // start() 后每帧回调 handle
    }
}` },
        { t: 'callout', kind: 'tip', html: '游戏循环里最忌讳「每帧 new 对象」：JavaFX 每帧都在跑，'
            + '在 <code>handle</code> 里创建 <code>Color</code>、<code>Label</code> 或大量临时对象，'
            + 'GC 压力会让帧率忽高忽低，卡顿感非常明显。颜色、字体、画笔这些能复用就复用；'
            + 'Timeline 的 KeyFrame 处理器里同理，别顺手刷新整个列表。' }
      ]
    },

    /* ---------------------------------------------------------------- S3 绑定与控件 */
    {
      id: 'adv-fx-3',
      title: '自定义控件与绑定：让界面跟着数据走',
      en: 'BINDINGS & CUSTOM CONTROLS',
      minutes: 24,
      html: '课程用固定布局和手动 <code>setText</code>；本节讲 Property 绑定、组合式自定义控件，'
        + '以及五子棋/贪吃蛇在场景图与 Canvas 之间的渲染取舍。',
      blocks: [
        { t: 'p', lead: true, html: '课程项目里，界面更新靠手动 <code>label.setText(...)</code>：'
            + '数据一变就调一次，忘了调就显示旧值。五子棋用 15×15 个 <code>StackPane</code> 当格子，'
            + '每格往里加 <code>Circle</code>（Tutorial 7）；贪吃蛇在 Tkinter 里用 Canvas，'
            + '每帧 <code>delete(\'all\')</code> 再全部重画（lecture 11）。'
            + '两种渲染方式各有代价，这一节把「数据怎么驱动界面」讲清楚。' },
        { t: 'p', html: '<b>Property</b> 是 JavaFX 的可观察值：<code>StringProperty</code>、'
            + '<code>IntegerProperty</code>、<code>DoubleProperty</code>、<code>BooleanProperty</code>。'
            + '控件的大多数状态都是 Property（<code>textProperty()</code>、<code>valueProperty()</code>、'
            + '<code>selectedProperty()</code>），所以可以<b>绑定（binding）</b>：'
            + '<code>label.textProperty().bind(model.nameProperty())</code> 之后，'
            + 'model 改名，label 自动更新；<code>bindBidirectional</code> 则是双向同步。'
            + '复杂表达式用 <code>Bindings.createStringBinding(() -&gt; ..., 依赖属性)</code>。'
            + '绑定是「懒」的：只有依赖变化才重算。注意解绑——长生命周期的属性持有界面引用会泄漏。' },
        { t: 'p', html: '自定义控件有两种做法：<b>组合（composite）</b>——继承 <code>HBox</code>/<code>VBox</code>，'
            + '把现成控件拼起来；<b>继承 Control + 自定义 Skin</b>——从零定义外观与行为。'
            + '课程项目里 99% 的场景用组合就够了：写一个 <code>ChatBubble extends HBox</code>，'
            + '构造器接收用户名、正文、是否自己发的，内部摆好 Label、加好 styleClass，'
            + '用的时候 <code>new ChatBubble(...)</code> 一行。组合的优点是复用、可测试、样式集中；'
            + '缺点是节点多时性能不如一个自绘节点。' },
        { t: 'p', html: '渲染上，<b>场景图（scene graph）</b>与 <b>Canvas</b> 是两条路。'
            + '场景图里每个图元都是 Node：能接鼠标事件、能用 CSS、能做 Transition、布局由容器管；'
            + '但节点数量多、每帧增删时开销大。Canvas 是一张位图 + <code>GraphicsContext</code> 画笔：'
            + '每帧 <code>clearRect</code> 后重画，节点数不影响渲染成本，适合大量动态图元；'
            + '代价是「画上去的东西不是对象」——点击要自己算坐标，样式要自己设，动画要自己写。'
            + '经验法则：<b>需要交互/样式/布局 → Node；高频重绘/大量图元 → Canvas</b>。'
            + '五子棋 225 个格子用 StackPane 完全撑得住，还能直接给每格绑点击；'
            + '贪吃蛇蛇身每帧都在变，用 Canvas 更合适。' },
        { t: 'table', caption: '场景图 Node vs Canvas',
          head: ['维度', '场景图（Node）', 'Canvas'],
          rows: [
            ['图元身份', '每个都是对象，可查询、可绑定', '像素，画完就没了'],
            ['事件', '自动命中测试，setOnMouseClicked', '自己根据坐标判断'],
            ['样式', 'CSS / styleClass 生效', '只能用 GraphicsContext 设置'],
            ['动画', 'Transition 直接作用于节点', '每帧自己重画'],
            ['大量图元', '节点多时布局/渲染变慢', '<b>更合适</b>'],
            ['适合', '按钮、列表、棋盘格、表单', '贪吃蛇、粒子、实时曲线']
          ] },
        { t: 'code', run: false, caption: '本站引擎不支持 JavaFX，以下为真实 JavaFX 代码',
          code: `import javafx.beans.binding.Bindings;
import javafx.scene.control.Label;
import javafx.scene.control.Slider;

public class BindDemo {
    public static void main(String[] args) {
        Slider slider = new Slider(0, 100, 50);
        Label label = new Label();

        // 单向绑定：label 的 text 随 slider.value 自动变化
        label.textProperty().bind(
            Bindings.format("音量：%.0f", slider.valueProperty()));

        // 双向绑定：任意一边改，另一边跟着变
        // slider.valueProperty().bindBidirectional(otherSlider.valueProperty());
    }
}` },
        { t: 'code', run: false, caption: '本站引擎不支持 JavaFX，以下为真实 JavaFX 代码',
          code: `import javafx.geometry.Pos;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;

public class ChatBubble extends HBox {
    public ChatBubble(String user, String text, boolean mine) {
        Label name = new Label(user + "：");
        Label body = new Label(text);
        body.setWrapText(true);
        body.getStyleClass().add("bubble");

        getChildren().addAll(name, body);
        setAlignment(mine ? Pos.CENTER_RIGHT : Pos.CENTER_LEFT);
        getStyleClass().add(mine ? "bubble-mine" : "bubble-other");
        setSpacing(6);
    }
}

// 使用：把 new ChatBubble("alice", "hi", false) 加进消息列表的 VBox 即可` },
        { t: 'code', run: false, caption: '本站引擎不支持 JavaFX，以下为真实 JavaFX 代码',
          code: `import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.paint.Color;

public class SnakeCanvas {
    private static final int CELL = 20;
    private final Canvas canvas = new Canvas(400, 400);
    private final GraphicsContext gc = canvas.getGraphicsContext2D();

    public void render(int[][] snake, int[] food) {
        gc.setFill(Color.web("#0b1220"));
        gc.fillRect(0, 0, canvas.getWidth(), canvas.getHeight());   // 整屏重绘

        gc.setFill(Color.web("#3ddc97"));
        for (int[] cell : snake) {
            gc.fillRect(cell[0] * CELL, cell[1] * CELL, CELL - 1, CELL - 1);
        }

        gc.setFill(Color.web("#ff6b6b"));
        gc.fillOval(food[0] * CELL, food[1] * CELL, CELL - 2, CELL - 2);
    }
}` },
        { t: 'code', run: false, caption: '本站引擎不支持 JavaFX，以下为真实 JavaFX 代码',
          code: `import javafx.scene.layout.StackPane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;

public class GomokuBoard {
    private static final int CELL = 40;

    // 课程 Tutorial 7 的思路：每格一个 StackPane，落子就是往里加一个 Circle
    private StackPane createCell() {
        StackPane cell = new StackPane();
        cell.setMinSize(CELL, CELL);
        cell.setPrefSize(CELL, CELL);
        cell.setOnMouseClicked(e -> {
            if (cell.getChildren().size() > 1) return;   // 已有棋子
            Circle stone = new Circle(CELL * 0.4, Color.BLACK);
            cell.getChildren().add(stone);               // 场景图自动渲染，不用手动重绘
        });
        return cell;
    }
}` },
        { t: 'callout', kind: 'warn', html: '绑定的反模式：把 <code>Property</code> 当普通字段用，'
            + '却忘了它会在 UI 线程上触发监听器；在监听器里做耗时操作（读文件、发网络请求）会卡住界面。'
            + '重活丢给后台线程，回到 UI 线程再用 <code>Platform.runLater</code> 更新 Property。' }
      ]
    }
  ],
  finish: '<p><b>怎么继续：</b>把聊天室的界面从「六步代码」改成 FXML + controller；给按钮加一套 CSS 主题；'
    + '用 Timeline 做一个「对方正在输入」的闪烁提示；最后把贪吃蛇的 Tkinter 版本翻译成 JavaFX Canvas + AnimationTimer，'
    + '你会同时理解两门课的 GUI 模型。</p>',
  checklist: {
    id: 'fx-deep-check',
    items: [
      '能读懂 FXML 的 fx:controller / fx:id / onAction，并用 FXMLLoader 加载',
      '能解释 @FXML 注入顺序，知道为什么初始化要写在 initialize()',
      '能用 JavaFX CSS 统一主题，并说清它和 Web CSS 的差异',
      '能用 Timeline / Transition 做动效，用 AnimationTimer 写游戏循环',
      '能说出 AnimationTimer 与 Tkinter after() 的驱动方式区别',
      '能用 Property 绑定同步数据与界面，并判断何时该用 Canvas'
    ]
  },
  keypoint: {
    items: [
      { title: 'FXML 把结构从代码里拿出来', html: 'FXMLLoader 负责创建节点、注入 @FXML、调用 initialize()；fx:id 拼错只会得到 null。' },
      { title: '样式集中到 CSS', html: 'Scene 挂样式表，.class / #id / :hover 选择器；颜色字号不要再散落在 Java 里。' },
      { title: '动画三件套各司其职', html: 'Timeline 排关键帧、Transition 动单个属性、AnimationTimer 每帧跑游戏循环。' },
      { title: '绑定让数据驱动界面', html: 'Property + bind 省掉手动 setText；注意解绑与 UI 线程。' },
      { title: 'Node 还是 Canvas 看需求', html: '要交互/样式/布局用 Node；大量动态图元、每帧重绘用 Canvas。' }
    ]
  }
}
]);
