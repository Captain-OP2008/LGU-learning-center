/* =====================================================================
 * data/ch10.js · 第 10 章：JavaFX 控件与布局
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5
 * 本章要点：常用控件（Label/Button/TextField/PasswordField/RadioButton/CheckBox/
 *           ScrollBar/Menu/ToolTip/ProgressBar/Slider）/ 五种布局的排列规则 /
 *           布局嵌套与常用配置 / layoutX·layoutY 陷阱
 * 本章所有代码块 run:false，交互由 lab fxlayout 承担。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch10',
  num: '10',
  title: 'JavaFX 控件与布局',
  en: 'Controls & Layouts',
  goals: [
    '看到界面需求能选出合适的控件：Label、Button、TextField、PasswordField、RadioButton、CheckBox、Slider、ProgressBar 等',
    '能说出 HBox / VBox / FlowPane / GridPane / StackPane 各自的排列规则，并针对场景选对布局',
    '能用 spacing、padding、alignment 与 ColumnConstraints 调出整齐的界面',
    '能把多种布局嵌套起来，搭出一个有顶部、主体与底部的表单页面',
    '能解释为什么直接 setLayoutX / setLayoutY 在 StackPane 或 VBox 里不生效，并知道怎么改'
  ],
  kp: [
    { id: 'ch10-1', title: '常用控件：文本、按钮与输入框' },
    { id: 'ch10-2', title: '选择类与其他控件：RadioButton / CheckBox / Slider' },
    { id: 'ch10-3', title: 'HBox 与 VBox：一行与一列' },
    { id: 'ch10-4', title: 'FlowPane：排不下就换行' },
    { id: 'ch10-5', title: 'GridPane：行列网格' },
    { id: 'ch10-6', title: 'StackPane：层叠' },
    { id: 'ch10-7', title: '布局嵌套：把大界面拆成小块' },
    { id: 'ch10-8', title: '间距、内边距、对齐与 layoutX 陷阱' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
`想一下聊天室窗口长什么样：顶部是标题，中间是一大片消息记录，底部是输入框和发送按钮。再想五子棋：中间棋盘，上面一行状态文字，下面几个按钮。这些"长什么样"的问题，拆开就是两个决定：<b>用什么控件</b>、<b>用什么布局摆</b>。<br>控件（control）是界面上的零件，布局（layout）是装配线。零件选错，用户不知道怎么用（Label 点不动）；装配线选错，界面会重叠或挤成一条线。这一章把课程要求认识的控件和五种布局过一遍，目标不是背 API，而是建立"需求 → 控件 → 布局"的条件反射。Gomoku 项目的界面骨架，靠的就是这一章。` },

    { t: 'p', lead: true, html:
`控件决定<b>界面上有什么</b>，布局决定<b>它们摆在哪</b>。所有控件都是 Node，所有布局也是 Node——所以布局可以装控件，也可以装布局。` },

    { t: 'h', text: '一、常用控件：文本、按钮与输入框', id: 'ch10-1' },

    { t: 'p', html:
`<b>控件（UI control）</b>是 JavaFX 预先做好的可视化组件：你不用自己画按钮，只需 new 一个、设置文字、挂上事件。讲义逐个介绍了课程涉及的全部控件，下面这张表先建立整体印象——<b>每个控件记住"用途"和"怎么创建"两件事就够了</b>，具体交互留到项目里查。` },

    { t: 'table',
      head: ['控件', '用途（一句话）', '创建代码'],
      rows: [
        ['<code>Label</code>', '显示一行只读文本', '<code>Label lb = new Label("Score:");</code>'],
        ['<code>Button</code>', '可点击的按钮', '<code>Button ok = new Button("OK");</code>'],
        ['<code>TextField</code>', '单行文本输入', '<code>TextField tf = new TextField();</code>'],
        ['<code>PasswordField</code>', '输入密码，字符被遮住', '<code>PasswordField pw = new PasswordField();</code>'],
        ['<code>RadioButton</code>', '单选按钮，一组里选一个', '<code>RadioButton easy = new RadioButton("Easy");</code>'],
        ['<code>CheckBox</code>', '复选框，可多选可取消', '<code>CheckBox sound = new CheckBox("Sound");</code>'],
        ['<code>ScrollBar</code>', '滚动条，值为 0–1', '<code>ScrollBar bar = new ScrollBar();</code>'],
        ['<code>Menu</code>', '菜单（挂在 MenuBar 上）', '<code>Menu file = new Menu("File");</code>'],
        ['<code>ToolTip</code>', '鼠标悬停提示', '<code>btn.setTooltip(new Tooltip("hint"));</code>'],
        ['<code>ProgressBar</code>', '显示进度，值为 0–1', '<code>ProgressBar pb = new ProgressBar(0.6);</code>'],
        ['<code>Slider</code>', '滑块，在范围内取值', '<code>Slider vol = new Slider(0, 100, 50);</code>']
      ],
      caption: '十一个课堂控件：用途 + 一行创建代码' },

    { t: 'p', html:
`使用控件有三条常识：<b>① 创建不等于显示</b>——new 出来的控件必须 add 进某个布局，才会出现在场景图里；<b>② 文本输入用 <code>getText()</code> 读回来</b>，<code>setPromptText()</code> 是灰色的提示文字；<b>③ 按钮要挂 <code>setOnAction</code></b> 才有反应。<br><code>PasswordField</code> 是 <code>TextField</code> 的子类，用法完全一样，只是显示成圆点——<b>它不加密、也不防止读取</b>，别把"看不见"当成"安全"。` },

    { t: 'code', run: false, caption: 'ControlGallery.java　把常用控件塞进一个 VBox：先看见，再学怎么摆', code:
`import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.CheckBox;
import javafx.scene.control.Label;
import javafx.scene.control.Menu;
import javafx.scene.control.MenuBar;
import javafx.scene.control.PasswordField;
import javafx.scene.control.ProgressBar;
import javafx.scene.control.RadioButton;
import javafx.scene.control.ScrollBar;
import javafx.scene.control.Slider;
import javafx.scene.control.TextField;
import javafx.scene.control.Tooltip;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class ControlGallery extends Application {
    @Override
    public void start(Stage stage) {
        MenuBar menuBar = new MenuBar(new Menu("File"));

        Label title = new Label("Controls");
        TextField name = new TextField();
        name.setPromptText("your name");
        PasswordField pwd = new PasswordField();
        Button login = new Button("Login");
        login.setTooltip(new Tooltip("click to login"));

        RadioButton easy = new RadioButton("Easy");
        RadioButton hard = new RadioButton("Hard");
        CheckBox sound = new CheckBox("Sound");
        Slider volume = new Slider(0, 100, 50);
        ProgressBar progress = new ProgressBar(0.3);
        ScrollBar bar = new ScrollBar();

        VBox root = new VBox(8, menuBar, title, name, pwd, login,
                             easy, hard, sound, volume, progress, bar);
        root.setPadding(new Insets(12));

        stage.setScene(new Scene(root, 320, 480));
        stage.setTitle("Control Gallery");
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'callout', kind: 'warn', title: '三个"控件没反应"的经典原因', html:
`① <b>没加进布局</b>：控件对象存在，但不在场景图上，界面什么都不显示。② <b>RadioButton 没有共用 ToggleGroup</b>：不设置的话每个单选按钮各自独立，能同时选中好几个。③ <b>MenuBar 没有放进布局</b>：<code>new MenuBar(...)</code> 只是造了个对象，它也得作为根节点的第一个孩子才显示在窗口顶部。` },

    { t: 'h', text: '二、选择类与其他控件：RadioButton / CheckBox / Slider', id: 'ch10-2' },

    { t: 'p', html:
`选择类控件的共同点：<b>状态存在控件里，要用时读出来</b>。<b>RadioButton</b> 的语义是"多选一"，但互斥不是自动的——必须先把几个 RadioButton 放进同一个 <code>ToggleGroup</code>；组里最多一个被选中，读法有两种：逐个 <code>isSelected()</code>，或 <code>group.getSelectedToggle()</code> 拿到当前选中的那个。<b>CheckBox</b> 的语义是"开关/多选"，每个都独立，<code>isSelected()</code> 返回 boolean。<br><b>Slider</b> 用 <code>getValue()</code> 读当前值，构造时给"最小值、最大值、初始值"；<b>ProgressBar</b> 用 <code>setProgress(0~1)</code> 显示进度，1.0 是满格；<b>ScrollBar</b> 也是 0–1 的值。三者的"值"都可以加监听器（第 12 章的事件监听），实现"拖动滑块 → 进度条同步"这类联动。` },

    { t: 'code', run: false, caption: 'SelectionDemo.java　单选、多选、滑块：点击 Confirm 把状态读出来', code:
`import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.CheckBox;
import javafx.scene.control.Label;
import javafx.scene.control.ProgressBar;
import javafx.scene.control.RadioButton;
import javafx.scene.control.Slider;
import javafx.scene.control.ToggleGroup;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class SelectionDemo extends Application {
    @Override
    public void start(Stage stage) {
        // 单选：两个 RadioButton 共享一个 ToggleGroup
        ToggleGroup level = new ToggleGroup();
        RadioButton easy = new RadioButton("Easy");
        RadioButton hard = new RadioButton("Hard");
        easy.setToggleGroup(level);
        hard.setToggleGroup(level);
        easy.setSelected(true);

        // 多选：CheckBox 各自独立
        CheckBox sound = new CheckBox("Sound");
        sound.setSelected(true);

        Slider volume = new Slider(0, 100, 50);
        ProgressBar progress = new ProgressBar(volume.getValue() / 100);

        Button confirm = new Button("Confirm");
        confirm.setOnAction(e -> {
            RadioButton picked = (RadioButton) level.getSelectedToggle();
            System.out.println("level  = " + (picked == null ? "none" : picked.getText()));
            System.out.println("sound  = " + sound.isSelected());
            System.out.println("volume = " + volume.getValue());
        });

        VBox root = new VBox(10, new Label("Level"), easy, hard,
                             sound, volume, progress, confirm);
        root.setPadding(new Insets(16));

        stage.setScene(new Scene(root, 300, 340));
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'p', html:
`注意 <code>(RadioButton) level.getSelectedToggle()</code> 这个强制转换：<code>getSelectedToggle()</code> 返回的是 <code>Toggle</code> 接口，要知道具体是哪个单选按钮，得转回 <code>RadioButton</code> 再 <code>getText()</code>。用户一个都没选时它返回 null，所以代码里先判空——<b>凡是"可能没有值"的读取，都该有兜底</b>。` },

    { t: 'h', text: '三、HBox 与 VBox：一行与一列', id: 'ch10-3' },

    { t: 'p', html:
`讲义两句话：<b>HBox</b> 把节点排成<b>一行</b>（single row），<b>VBox</b> 排成<b>一列</b>（single vertical column）。两者都是按<b>添加顺序</b>排列，构造参数里的数字是<b>间距（spacing）</b>：<code>new HBox(8)</code> 表示子节点之间留 8 像素。<br>它们是最常用的两种布局：工具栏、按钮排、聊天输入行用 HBox；登录表单、侧边栏、设置页用 VBox。<b>窗口变大时谁占多余空间</b>，由增长优先级决定：<code>HBox.setHgrow(node, Priority.ALWAYS)</code> 让某个子节点吃掉水平方向剩余宽度，<code>VBox.setVgrow</code> 同理管垂直方向。` },

    { t: 'code', run: false, caption: 'RowColumnDemo.java　同样三个按钮：HBox 排成一行，VBox 排成一列', code:
`import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class RowColumnDemo extends Application {
    @Override
    public void start(Stage stage) {
        HBox row = new HBox(8);          // 8 = 子节点之间的间距
        VBox col = new VBox(8);
        for (int i = 1; i <= 3; i++) {
            row.getChildren().add(new Button("Row " + i));
            col.getChildren().add(new Button("Col " + i));
        }

        VBox root = new VBox(14, new Label("HBox:"), row, new Label("VBox:"), col);
        stage.setScene(new Scene(root, 260, 260));
        stage.setTitle("HBox vs VBox");
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'compare', left: {
      title: 'HBox：水平一行',
      html: '按添加顺序从左到右。适合工具栏、按钮排、聊天输入行。需要某个子节点占满剩余宽度时用 <code>setHgrow</code>。',
      code: 'HBox bar = new HBox(8);\nbar.getChildren().addAll(openBtn, saveBtn);\nHBox.setHgrow(searchField, Priority.ALWAYS);'
    }, right: {
      title: 'VBox：垂直一列',
      html: '按添加顺序从上到下。适合侧边栏、设置页、登录表单。需要某个子节点占满剩余高度时用 <code>setVgrow</code>。',
      code: 'VBox form = new VBox(10);\nform.getChildren().addAll(userField, passField, loginBtn);\nVBox.setVgrow(msgList, Priority.ALWAYS);'
    } },

    { t: 'h', text: '四、FlowPane：排不下就换行', id: 'ch10-4' },

    { t: 'p', html:
`<b>FlowPane</b> 的规则一句话：<b>按添加顺序摆，一行摆不下就自动换到下一行</b>（讲义：wrapped at the FlowPane's boundary）。它不需要你告诉它有几列，所以特别适合<b>数量不固定</b>的内容：标签云、文件列表、一排工具按钮。<br>构造参数 <code>new FlowPane(hgap, vgap)</code> 分别控制水平、垂直间距；<code>setPrefWrapLength(220)</code> 设定"多宽开始换行"。竖排模式（<code>setOrientation(Orientation.VERTICAL)</code>）也存在，课程用得少。注意它和下一节的 GridPane 的区别：<b>FlowPane 的换行位置由宽度决定，GridPane 的行列由你指定</b>。` },

    { t: 'code', run: false, caption: 'FlowPaneDemo.java　20 个按钮：窗口一变窄，行数自动变多', code:
`import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.FlowPane;
import javafx.stage.Stage;

public class FlowPaneDemo extends Application {
    @Override
    public void start(Stage stage) {
        FlowPane flow = new FlowPane(8, 8);   // 水平间距、垂直间距
        flow.setPrefWrapLength(220);          // 达到这个宽度就开始换行
        for (int i = 1; i <= 20; i++) {
            flow.getChildren().add(new Button("Btn " + i));
        }

        stage.setScene(new Scene(flow, 280, 200));
        stage.setTitle("FlowPane");
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'h', text: '五、GridPane：行列网格', id: 'ch10-5' },

    { t: 'p', html:
`<b>GridPane</b> 提供"行 × 列"的网格，每个节点放进指定格子（讲义：nodes can be placed in any cell）。它是最适合<b>表单</b>的布局：第 0 列放标签、第 1 列放输入框，标签天然对齐。<br>核心 API 三个：<code>add(node, columnIndex, rowIndex)</code> 把节点放进格子；<code>setHgap / setVgap</code> 管格子间距；<code>getColumnConstraints().add(...)</code> 管列宽。还有跨列跨行版本 <code>add(node, col, row, colspan, rowspan)</code>。<b>最常出错的是 add 的参数顺序：先列后行</b>，<code>grid.add(label, 0, 2)</code> 是"第 0 列、第 2 行"，不是坐标 (x, y)。` },

    { t: 'code', run: false, caption: 'FormGridDemo.java　两列表单：第 0 列标签、第 1 列输入框，列宽靠 ColumnConstraints', code:
`import javafx.application.Application;
import javafx.geometry.HPos;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.ColumnConstraints;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.Priority;
import javafx.stage.Stage;

public class FormGridDemo extends Application {
    @Override
    public void start(Stage stage) {
        GridPane grid = new GridPane();
        grid.setHgap(10);
        grid.setVgap(10);
        grid.setPadding(new Insets(16));

        // 第 0 列固定 90px，标签才能对齐；第 1 列吃掉剩余宽度
        ColumnConstraints c0 = new ColumnConstraints();
        c0.setPrefWidth(90);
        ColumnConstraints c1 = new ColumnConstraints();
        c1.setHgrow(Priority.ALWAYS);
        grid.getColumnConstraints().addAll(c0, c1);

        grid.add(new Label("Name:"), 0, 0);    // (节点, 列, 行)
        grid.add(new TextField(), 1, 0);
        grid.add(new Label("Email:"), 0, 1);
        grid.add(new TextField(), 1, 1);

        Button submit = new Button("Submit");
        GridPane.setHalignment(submit, HPos.RIGHT);
        grid.add(submit, 1, 2);

        stage.setScene(new Scene(grid, 340, 190));
        stage.setTitle("GridPane");
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'callout', kind: 'warn', title: 'GridPane 的两个坑', html:
`① <b>add 的顺序是（列, 行）</b>：<code>grid.add(node, 1, 0)</code> 是第 1 列第 0 行；写反了控件会跑到别的位置，而且不报错。② <b>列宽默认由内容决定</b>：不放 <code>ColumnConstraints</code> 时，两列的宽度各自随内容变化，标签和输入框会对不齐——加一条 <code>c0.setPrefWidth(90)</code> 或给第二列设 hgrow，才能得到整齐的表单。` },

    { t: 'h', text: '六、StackPane：层叠', id: 'ch10-6' },

    { t: 'p', html:
`<b>StackPane</b> 把子节点<b>全部叠在同一个位置</b>：后加的盖在先加的上面（讲义：every new node gets placed on top of the previous node）。默认<b>居中对齐</b>，每个子节点都被摆到中心。<br>什么时候用？需要"图层"的时候：背景图 + 前景文字、棋盘 + 棋子层、内容 + 半透明加载遮罩。它也是 Gomoku 用 Line 画棋盘时的关键容器。要让子节点靠左上而不是居中，用 <code>setAlignment(Pos.TOP_LEFT)</code>；要指定谁在上层，就靠 add 的先后顺序。` },

    { t: 'code', run: false, caption: 'StackPaneDemo.java　矩形打底，文字盖在上面：后加的节点在上层', code:
`import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.StackPane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Rectangle;
import javafx.stage.Stage;

public class StackPaneDemo extends Application {
    @Override
    public void start(Stage stage) {
        Rectangle bg = new Rectangle(240, 140);
        bg.setFill(Color.LIGHTGRAY);
        Label hint = new Label("on top of the rectangle");

        StackPane stack = new StackPane();
        stack.getChildren().addAll(bg, hint);   // 先加的在底层，后加的在顶层

        stage.setScene(new Scene(stack, 300, 190));
        stage.setTitle("StackPane");
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'h', lvl: 3, text: '五种布局一览：什么时候用哪个' },

    { t: 'table',
      head: ['布局', '排列规则', '典型用途', '注意'],
      rows: [
        ['<code>HBox</code>', '一行，从左到右', '工具栏、按钮排、输入行', '用 <code>setHgrow</code> 分配剩余宽度'],
        ['<code>VBox</code>', '一列，从上到下', '表单、侧边栏、设置页', '用 <code>setVgrow</code> 分配剩余高度'],
        ['<code>FlowPane</code>', '按顺序排，排不下换行', '标签云、数量不定的按钮', '换行位置由宽度 / prefWrapLength 决定'],
        ['<code>GridPane</code>', '行列网格，节点进指定格子', '表单、仪表盘', '<code>add(node, col, row)</code> 先列后行'],
        ['<code>StackPane</code>', '全部叠在一起，后加在上', '背景 + 前景、棋盘 + 棋子层', '默认居中；靠 add 顺序决定层叠']
      ],
      caption: '选布局的顺序：先看"一行/一列/网格/层叠"哪个形状最接近，再考虑嵌套' },

    { t: 'p', html:
`选布局没有标准答案，但有稳定的判断顺序：<b>先看整体形状</b>（一维 → HBox/VBox；二维对齐 → GridPane；层叠 → StackPane；数量不定 → FlowPane），<b>再拆小块</b>——一块放不下就嵌一层布局。真正复杂的界面从来不是"一个布局搞定"，而是一棵布局树。` },

    { t: 'h', text: '七、布局嵌套：把大界面拆成小块', id: 'ch10-7' },

    { t: 'p', html:
`讲义里有一句问答：<i>"Can I put one layout inside / on the top of another layout?" — Yes, you can have a hierarchy of layouts!</i> 这句话是 GUI 编程的分水岭：<b>布局可以嵌套</b>，嵌套之后就能把"整体"拆成"区域"，再把每个区域拆成"控件"。<br>以聊天室为例：根节点是 VBox（上中下三段）；顶部是 HBox（标题 + 按钮）；底部是 HBox（输入框 + 发送按钮）；中间区域用 <code>VBox.setVgrow(msgArea, Priority.ALWAYS)</code> 让它随窗口拉伸。这样窗口变大时只有消息区变高，工具栏和输入行不变。` },

    { t: 'code', run: false, caption: 'NestedLayoutDemo.java　VBox 套 HBox、再套 GridPane：一个像样的聊天窗口骨架', code:
`import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class NestedLayoutDemo extends Application {
    @Override
    public void start(Stage stage) {
        // 顶部：一行 HBox
        Label title = new Label("Chat Room");
        HBox top = new HBox(title);
        top.setPadding(new Insets(8));

        // 中间：表单区（GridPane）与消息区（TextArea）
        GridPane form = new GridPane();
        form.setHgap(8);
        form.setVgap(8);
        form.add(new Label("Nickname:"), 0, 0);
        form.add(new TextField(), 1, 0);

        TextArea messages = new TextArea();
        messages.setEditable(false);

        // 底部：输入框 + 发送按钮
        TextField input = new TextField();
        HBox.setHgrow(input, Priority.ALWAYS);      // 输入框吃掉剩余宽度
        HBox bottom = new HBox(8, input, new Button("Send"));
        bottom.setPadding(new Insets(8));

        // 根：VBox 把三段竖着叠起来；消息区吃掉多余高度
        VBox root = new VBox(4, top, form, messages, bottom);
        VBox.setVgrow(messages, Priority.ALWAYS);
        root.setPadding(new Insets(4));

        stage.setScene(new Scene(root, 380, 300));
        stage.setTitle("Nested Layouts");
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'callout', kind: 'warn', title: '一个 Node 只能有一个父节点', html:
`节点不是"贴纸"，不能同时贴在两个容器里。把同一个 Button 先后 add 进两个布局，它只会出现在后一个布局里（JavaFX 会把它从原父节点移走）；在同一个容器的 children 里重复 add 同一个节点，则直接抛异常。<br>想在界面上出现两个一样的按钮，就 <b>new 两个</b>，或者写个方法每次返回新的。这个规则在嵌套布局时经常被忽略——"我明明加了两处，怎么只显示一个？"` },

    { t: 'p', html:
`看完五种布局和嵌套，最好的巩固方式是亲手拖一拖：下面的实验台可以在 HBox / VBox / FlowPane / GridPane / StackPane 之间切换同一组子节点，看同样的控件被不同排列规则摆成什么样；再改间距、对齐、内边距，观察数值和画面的对应关系。` },

    { t: 'lab', id: 'fxlayout' },

    { t: 'h', text: '八、间距、内边距、对齐与 layoutX 陷阱', id: 'ch10-8' },

    { t: 'p', html:
`布局的"手感"取决于四个参数，先分清它们：<b>间距（spacing）</b>是子节点<b>之间</b>的空隙；<b>内边距（padding）</b>是容器<b>边框到内容</b>的空隙，用 <code>new Insets(12)</code> 或 <code>new Insets(8, 16, 8, 16)</code>（上右下左）设置；<b>对齐（alignment）</b>是子节点整体靠向容器哪一边，用 <code>Pos</code> 的常量；<b>增长优先级（grow）</b>决定窗口变化时谁占多余空间。这四个词在考试里问"这行代码改变的是什么"时极容易混。` },

    { t: 'terms', cols: 2, items: [
      { en: 'spacing', zh: '间距', html: '相邻子节点之间的距离：<code>new HBox(8)</code> 或 <code>setSpacing(8)</code>。' },
      { en: 'padding', zh: '内边距', html: '容器边框到内容之间的距离：<code>setPadding(new Insets(12))</code>，四个参数是上右下左。' },
      { en: 'alignment', zh: '对齐', html: '子节点整体在容器里的位置：<code>setAlignment(Pos.CENTER)</code>，常量来自 <code>javafx.geometry.Pos</code>。' },
      { en: 'grow', zh: '增长优先级', html: '窗口变大时谁吃多余空间：<code>HBox.setHgrow(node, Priority.ALWAYS)</code> / <code>VBox.setVgrow</code>。' }
    ] },

    { t: 'p', html:
`现在说这一章最"反直觉"的知识点：<b>每个 Node 都有 <code>layoutX</code> / <code>layoutY</code>，但你通常改不动它们</b>。原因是布局容器会在每次布局（layout pass）时重新计算并覆盖子节点的 layoutX / layoutY——你设成 0，下一帧又被改回居中。<br>讲义在 Tutorial 里用 Gomoku 棋盘解释过同一件事：把 Line 直接放进 StackPane 时，StackPane 会把它<b>居中</b>，而且 Line 的 <code>startX/startY/endX/endY</code> 是相对<b>线自己的局部坐标系</b>的，不是相对 StackPane 左上角。所以"我明明写了 startX = 0，线怎么不在左边？"——因为你写的坐标不是你以为的那个坐标。` },

    { t: 'code', run: false, caption: 'LayoutTrapDemo.java　同样的 setLayoutX：放进 StackPane 无效，放进 Pane 有效', code:
`import javafx.application.Application;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.Pane;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class LayoutTrapDemo extends Application {
    @Override
    public void start(Stage stage) {
        // 陷阱：StackPane 每次布局都会重设子节点的 layoutX / layoutY
        Label a = new Label("inside StackPane");
        a.setLayoutX(0);
        a.setLayoutY(0);                 // 想放左上角，实际仍然居中
        StackPane stack = new StackPane(a);
        stack.setAlignment(Pos.CENTER);  // StackPane 的默认值就是 CENTER

        // 正解：Pane 不自动摆放子节点，layoutX / layoutY 由你决定
        Label b = new Label("inside Pane");
        b.setLayoutX(40);
        b.setLayoutY(24);
        Pane pane = new Pane(b);
        pane.setPrefHeight(80);

        VBox root = new VBox(10, new Label("StackPane:"), stack,
                             new Label("Pane:"), pane);
        stage.setScene(new Scene(root, 280, 220));
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'p', html:
`要"精确定位"时有三条路：<b>① 用 Pane</b>（不自动摆放子节点，setLayoutX / setLayoutY 才会生效）；<b>② 留在 StackPane 但把对齐设成 </b><code>Pos.TOP_LEFT</code> 配合 <code>setMinSize</code>，让坐标系从左上角开始算；<b>③ 干脆换思路</b>——用布局规则表达位置（GridPane 的格子、HBox 的顺序），而不是硬算像素。Gomoku 的两种棋盘实现正好对应两种哲学：Layout 版靠"每格一个 StackPane"，Canvas 版靠"自己算像素"（下一章）。` },

    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch10-q1' },
    { t: 'quiz', qid: 'ch10-q2' },
    { t: 'quiz', qid: 'ch10-q3' },

    { t: 'keypoint', items: [
      { title: '控件', html: 'Label / Button / TextField / PasswordField 是基础四件套；选择类用 RadioButton（要 ToggleGroup）与 CheckBox；数值类用 Slider / ProgressBar / ScrollBar。' },
      { title: 'HBox / VBox', html: '一行 / 一列，按添加顺序排；构造参数是 spacing；用 <code>setHgrow</code> / <code>setVgrow</code> 分配剩余空间。' },
      { title: 'FlowPane / GridPane', html: 'FlowPane 排不下自动换行；GridPane 用 <code>add(node, 列, 行)</code> 放格子，列宽用 ColumnConstraints 控制。' },
      { title: 'StackPane', html: '所有子节点叠在一起，后加在上，默认居中；适合背景 + 前景、棋盘 + 棋子层。' },
      { title: '嵌套', html: '布局可以装布局：根 VBox 分上中下，每段再用 HBox / GridPane 细分；一个 Node 只能有一个父节点。' },
      { title: '四个参数', html: 'spacing 是子节点之间、padding 是边框到内容、alignment 是整体对齐、grow 是窗口变大时谁占空间。' },
      { title: 'layoutX 陷阱', html: '布局容器会覆盖子节点的 layoutX / layoutY；要精确定位用 Pane，或用规则表达位置。' }
    ] },

    { t: 'checklist', id: 'ch10', items: [
      '我能为"登录表单"选出合适的控件，并各写一行创建代码',
      '我能说出 RadioButton 为什么需要 ToggleGroup，CheckBox 为什么不需要',
      '我能从 Slider 读出数值并把 ProgressBar 设成对应进度',
      '我能说出 HBox 与 VBox 的排列规则和各自典型用途',
      '我能解释 FlowPane 什么时候换行、GridPane 用什么决定行与列',
      '我能写出 GridPane 的 add(node, col, row) 并说清参数顺序',
      '我能解释 StackPane 的层叠顺序与默认对齐方式',
      '我能把 HBox / GridPane / VBox 嵌套成一个上中下的页面骨架',
      '我能区分 spacing 与 padding，并写出各自的设置代码',
      '我能解释为什么 setLayoutX 在 StackPane 里不生效，以及三种改法'
    ] },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
`控件与布局是 JavaFX 部分最"可考"的知识，因为答案短、判断明确：<br>① <b>选择 / 判断</b>：给需求选布局（"一排按钮用什么布局"→ HBox；"表单对齐"→ GridPane；"图片上盖文字"→ StackPane）；判断"RadioButton 自动互斥"（错，要 ToggleGroup）、"一个节点可以放进两个布局"（错）。<br>② <b>填空</b>：补 API，例如 <code>grid.____(label, 0, 1)</code>（add）、<code>HBox.set____(input, Priority.ALWAYS)</code>（Hgrow）、<code>root.set____(new Insets(12))</code>（Padding）。<br>③ <b>简答</b>：比较 HBox 与 VBox、GridPane 与 FlowPane；或问"为什么 StackPane 里 setLayoutX 没用"——答"布局容器在 layout pass 中重新计算并覆盖子节点位置"。<br>④ <b>编程</b>：给一张界面草图（顶部标题、中间表单、底部按钮），要求用嵌套布局搭出来。<b>先写根布局，再逐层拆</b>。` },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
`布局题最适合用 AI 做"反向工程"：让它生成一段嵌套布局代码，你<b>先自己画出布局树</b>（根是什么、每层有哪些孩子），再运行/对照，看画对没有。这比让 AI 解释 HBox 是什么有用得多。<br>让 AI 出题时可以这样说："给我一个 3 层嵌套的 JavaFX 布局代码，不要注释，让我判断根节点和每层用到的布局类型，并说明窗口变大时哪个区域会拉伸。" 拿到答案后提醒自己检查两个常见错误：<b>add 的参数顺序</b>（列、行）和<b>grow 设错对象</b>（应该设给要被拉伸的子节点）。<br>另外可以把 AI 生成的界面代码丢回给它，问"如果窗口从 300px 拉宽到 900px，每个区域各是什么反应"，答对说明它真的理解了布局规则，而不是拼 API。` }

  ]
});
