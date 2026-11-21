/* =====================================================================
 * data/ch11.js · 第 11 章：JavaFX 2D 图形与 Canvas
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5
 * 本章要点：javafx.scene.shape 四种图形 / setFill 与 setStroke / Canvas 与
 *           GraphicsContext / 路径绘图 / stroke 与 fill 系列 API / 重绘与绘制顺序 /
 *           IntelliJ 导入示例代码
 * 本章所有代码块 run:false，交互由 lab fxcanvas 承担。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch11',
  num: '11',
  title: 'JavaFX 2D 图形与 Canvas',
  en: '2D Shapes & Canvas',
  goals: [
    '能说出 javafx.scene.shape 里 Line / Rectangle / Circle / Polygon 的构造参数，并画出简单图形',
    '能用 setFill 与 setStroke 控制图形的填充色与描边，并解释两者的区别',
    '能创建 Canvas、取得 GraphicsContext，用 beginPath / moveTo / lineTo / stroke 画线',
    '能区分 stroke 系列与 fill 系列 API，并解释 Canvas 为什么要重绘、"先画线再画棋子"是什么策略',
    '能按讲义的四步把示例代码导入 IntelliJ，并说清 External Libraries 在其中的作用'
  ],
  kp: [
    { id: 'ch11-1', title: '2D Shape 与 javafx.scene.shape 包' },
    { id: 'ch11-2', title: 'Line / Rectangle / Circle / Polygon' },
    { id: 'ch11-3', title: '描边与填充：setStroke / setFill' },
    { id: 'ch11-4', title: 'Canvas 与 GraphicsContext' },
    { id: 'ch11-5', title: '路径绘图：beginPath / moveTo / lineTo / stroke' },
    { id: 'ch11-6', title: 'GraphicsContext 的绘制 API' },
    { id: 'ch11-7', title: '重绘与绘制顺序' },
    { id: 'ch11-8', title: '在 IntelliJ 里导入示例代码' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
`五子棋界面最核心的一步是"把棋盘画出来"：15×15 的交叉点、横竖各 14 条线、还有黑白棋子。这一章要回答的就是这类问题——<b>JavaFX 里怎么画图形？</b><br>课程给了两条路：<b>① 用 2D 图形类（2D shape）</b>，直接 new 一条 Line、一个 Circle，当成节点放进布局；<b>② 用 Canvas（画布）</b>，拿一支 GraphicsContext（图形上下文）当画笔，一笔一笔往画布上画。前者像"拼乐高"，后者像"在白纸上画"。两条路都能画出棋盘，但节点数量、事件处理、重绘方式完全不同——Gomoku 项目里你必须会选，期末简答题也爱问这个对比。` },

    { t: 'p', lead: true, html:
`这一章先学"零件"（Shape）再学"画布"（Canvas）：Shape 是场景图里的节点，适合少量、需要单独交互的图形；Canvas 是一张像素画布，适合大量线条和频繁重绘的图形。` },

    { t: 'h', text: '一、2D Shape 与 javafx.scene.shape 包', id: 'ch11-1' },

    { t: 'p', html:
`JavaFX 提供了画 2D 图形的能力，讲义原话：<i>Various classes can be used to implement 2D shapes in our application. All these classes reside in the javafx.scene.shape package.</i> 这句话有两个考点：<b>这些类全部在 <code>javafx.scene.shape</code> 包里</b>，以及<b>它们都是 Node</b>——所以 Shape 可以直接放进 HBox、Pane、StackPane，能被事件命中，也能用 CSS 改样式。<br>课程要求掌握四个：<code>Line</code>（线段）、<code>Rectangle</code>（矩形）、<code>Circle</code>（圆）、<code>Polygon</code>（多边形）。它们的共同父类是 <code>Shape</code>，所以"设置颜色""设置线宽"这些方法在四个类上写法一样。` },

    { t: 'h', text: '二、Line / Rectangle / Circle / Polygon', id: 'ch11-2' },

    { t: 'p', html:
`四种图形的构造参数必须记准，考试填空和编程都会用：<b>Line</b> 给两个端点 <code>(x1, y1, x2, y2)</code>；<b>Rectangle</b> 给左上角加宽高 <code>(x, y, width, height)</code>；<b>Circle</b> 给圆心加半径 <code>(centerX, centerY, radius)</code>；<b>Polygon</b> 给一串点 <code>(x1, y1, x2, y2, …)</code>——<b>x、y 交替出现</b>，个数必须是偶数。<br>坐标系要先明确：<b>原点 (0, 0) 在左上角，x 向右增大，y 向下增大</b>。这和数学课的坐标系 y 轴方向相反，画"向上"的图形时最容易翻车。` },

    { t: 'table',
      head: ['类', '构造参数', '举个例子'],
      rows: [
        ['<code>Line</code>', '<code>(x1, y1, x2, y2)</code>', '<code>new Line(20, 20, 220, 20)</code> 一条横线'],
        ['<code>Rectangle</code>', '<code>(x, y, width, height)</code>', '<code>new Rectangle(20, 50, 120, 60)</code>'],
        ['<code>Circle</code>', '<code>(centerX, centerY, radius)</code>', '<code>new Circle(180, 80, 40)</code>'],
        ['<code>Polygon</code>', '<code>(x1, y1, x2, y2, …)</code>', '<code>new Polygon(20, 140, 80, 140, 50, 200)</code>']
      ],
      caption: '四种图形的构造参数：坐标都是相对父容器左上角的像素值' },

    { t: 'code', run: false, caption: 'ShapesDemo.java　四种图形一次画全：线、矩形、圆、三角形', code:
`import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import javafx.scene.shape.Line;
import javafx.scene.shape.Polygon;
import javafx.scene.shape.Rectangle;
import javafx.stage.Stage;

public class ShapesDemo extends Application {
    @Override
    public void start(Stage stage) {
        Line line = new Line(20, 20, 240, 20);              // 两个端点
        line.setStroke(Color.BLACK);
        line.setStrokeWidth(3);

        Rectangle rect = new Rectangle(20, 50, 120, 60);    // 左上角 + 宽 + 高
        rect.setFill(Color.LIGHTGRAY);
        rect.setStroke(Color.DARKGRAY);

        Circle circle = new Circle(180, 80, 40);            // 圆心 + 半径
        circle.setFill(Color.TRANSPARENT);                  // 透明 = 只描边
        circle.setStroke(Color.FORESTGREEN);
        circle.setStrokeWidth(4);

        Polygon tri = new Polygon(20, 140, 80, 140, 50, 200); // x, y 交替
        tri.setFill(Color.CORNFLOWERBLUE);

        Pane root = new Pane(line, rect, circle, tri);   // Pane 不自动摆放，坐标即位置
        root.setPrefSize(280, 230);

        stage.setScene(new Scene(root));
        stage.setTitle("2D Shapes");
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'p', html:
`这段代码用 <code>Pane</code> 当根节点，因为 Pane 不会自动摆放子节点——图形的坐标就是它在窗口里的位置，所见即所得。如果换成 HBox / VBox / StackPane，位置会被布局规则接管（第 10 章的 layoutX 陷阱）。<br>颜色来自 <code>javafx.scene.paint.Color</code>：常用常量有 <code>Color.BLACK</code>、<code>Color.WHITE</code>、<code>Color.RED</code>、<code>Color.FORESTGREEN</code>、<code>Color.CORNFLOWERBLUE</code>；也能 <code>Color.web("#ff0000")</code> 或 <code>Color.rgb(0, 128, 0)</code>。讲义例子里的 <code>Color.FORESTGREEN.brighter()</code> 就是把颜色调亮一档——这类小方法考试不考，但读示例代码时会遇到。` },

    { t: 'h', text: '三、描边与填充：setStroke / setFill', id: 'ch11-3' },

    { t: 'p', html:
`讲义对这两个词的定义只有一句，但必须背准：<i>A stroke is used to draw outlines of shapes. A fill is used to paint interiors of shapes.</i> 翻成人话：<b>描边（stroke）画轮廓线，填充（fill）涂内部区域</b>。它们互相独立——一个图形可以只有填充、只有描边（把 fill 设成 <code>Color.TRANSPARENT</code>），或者既有填充又有描边。<br>两个默认值要记：<b>Shape 的 fill 默认是黑色，stroke 默认是 null（不描边）</b>。所以只 <code>new Rectangle(...)</code> 会得到一个黑色实心矩形；要轮廓就用 <code>setStroke</code> 并常把 fill 设透明。<code>setStrokeWidth(double)</code> 控制轮廓粗细，宽度以边界线为中心向两侧各画一半。` },

    { t: 'compare', left: {
      title: 'setFill：涂内部',
      html: '给形状内部上色。默认黑色。设为 <code>Color.TRANSPARENT</code> 可以不填充，只留轮廓。',
      code: 'rect.setFill(Color.LIGHTGRAY);\ncircle.setFill(Color.TRANSPARENT);'
    }, right: {
      title: 'setStroke：描轮廓',
      html: '只给边界线上色。默认 null（不描边）。常配 <code>setStrokeWidth</code> 控制粗细。',
      code: 'circle.setStroke(Color.FORESTGREEN);\ncircle.setStrokeWidth(4);'
    } },

    { t: 'h', text: '四、Canvas 与 GraphicsContext', id: 'ch11-4' },

    { t: 'p', html:
`<b>Canvas（画布）</b>是另一种思路：它创建一张<b>图像</b>，所有绘制都由一组图形命令完成。讲义三条定义全是要点：<b>① Canvas 有指定宽高</b>（构造时给，之后固定）；<b>② 所有绘制操作都被裁剪在画布边界内</b>（画出界也不会显示）；<b>③ 通过 <code>getGraphicsContext2D()</code> 拿到 GraphicsContext</b>。<br>打个比方：<b>Canvas 是纸，GraphicsContext 是笔</b>。纸只有一张，笔可以换颜色、换粗细，画上去的痕迹就留在纸上了。Canvas 本身也是 Node，要放进场景图（通常外面套一个 StackPane 或 Pane），但画在上面的线、圆、文字<b>不是</b>节点——它们只是像素。` },

    { t: 'code', run: false, caption: 'CanvasBasics.java　画布 + 画笔：先画一条折线，再描边椭圆、填充椭圆', code:
`import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

public class CanvasBasics extends Application {
    @Override
    public void start(Stage stage) {
        Canvas canvas = new Canvas(300, 300);                // 画布：宽 300、高 300
        GraphicsContext gc = canvas.getGraphicsContext2D();  // 拿到画笔

        gc.setStroke(Color.BLACK);      // 设置"当前描边颜色"
        gc.setLineWidth(2);             // 设置"当前线宽"

        gc.beginPath();                 // 开始一条新路径
        gc.moveTo(30.5, 30.5);          // 起点（0.5 让 1px 线落在像素中心）
        gc.lineTo(150.5, 30.5);         // 加一段横线
        gc.lineTo(150.5, 120.5);        // 再加一段竖线，连成折线
        gc.stroke();                    // 把这条路径描出来

        gc.strokeOval(180, 30, 80, 60); // 描边椭圆：左上角 + 宽 + 高
        gc.setFill(Color.FORESTGREEN);  // 换填充颜色
        gc.fillOval(30, 160, 80, 60);   // 填充椭圆

        Pane root = new Pane(canvas);
        stage.setScene(new Scene(root, 320, 320));
        stage.setTitle("Canvas Basics");
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'callout', kind: 'warn', title: 'Canvas 的四个新手坑', html:
`① <b>画完不调用 <code>stroke()</code> / <code>fill()</code>，画布上什么也没有</b>：moveTo / lineTo 只是在描述路径，最后那一下才真正落笔。② <b>尺寸固定</b>：Canvas 的宽高在构造时定死，布局不会帮你缩放或拉伸；要适配窗口得自己算尺寸再重建。③ <b>画笔状态会延续</b>：setStroke / setFill / setLineWidth 设的是"当前状态"，会一直生效到下一次修改——忘记改回去是颜色错乱的常见原因。④ <b>坐标原点是左上角，y 向下</b>，别用数学坐标的直觉。` },

    { t: 'h', text: '五、路径绘图：beginPath / moveTo / lineTo / stroke', id: 'ch11-5' },

    { t: 'p', html:
`讲义用四行代码讲完了画线的全过程，这四行要能默写：<code>beginPath()</code> 开始一条新路径（path，相当于换一张草稿）；<code>moveTo(x, y)</code> 把笔<b>抬起来</b>移到起点；<code>lineTo(x, y)</code> 从当前位置画一段直线到新点（可以连续调用，连成折线）；<code>stroke()</code> 按当前描边颜色和线宽把整条路径画出来。<br>为什么坐标常有 <code>.5</code>？因为 1 像素宽的线如果要落在像素中心，坐标就得是 x.5；落在整数边界上会被抗锯齿摊成 2 像素的灰线。讲义的 <code>moveTo(30.5, 30.5)</code> 就是这个原因——棋盘线要清晰，这个细节很有用。` },

    { t: 'h', text: '六、GraphicsContext 的绘制 API', id: 'ch11-6' },

    { t: 'p', html:
`GraphicsContext 的 API 分两组，命名规则很清楚：<b><code>strokeXxx</code> 系列画轮廓，<code>fillXxx</code> 系列涂内部</b>。它们大多接收"左上角坐标 + 宽 + 高"四个参数（椭圆、矩形都一样），文字用 <code>fillText(text, x, y)</code> 给左下角基准点。<code>setFill</code> 和 <code>setStroke</code> 设置的是<b>当前画笔</b>的颜色，对之后所有 fill / stroke 调用生效，讲义特别强调两者默认都是黑色。` },

    { t: 'table',
      head: ['方法', '作用', '参数'],
      rows: [
        ['<code>setStroke(Color)</code>', '设置描边颜色', '颜色对象'],
        ['<code>setFill(Color)</code>', '设置填充颜色', '颜色对象'],
        ['<code>setLineWidth(double)</code>', '设置线宽', '像素值'],
        ['<code>beginPath()</code>', '开始一条新路径', '无'],
        ['<code>moveTo(x, y)</code>', '移动路径起点', '坐标'],
        ['<code>lineTo(x, y)</code>', '从当前点连线到目标点', '坐标'],
        ['<code>stroke()</code>', '描出当前路径', '无'],
        ['<code>strokeOval(x, y, w, h)</code>', '描边椭圆', '左上角 + 宽高'],
        ['<code>fillOval(x, y, w, h)</code>', '填充椭圆', '左上角 + 宽高'],
        ['<code>strokeRect(x, y, w, h)</code>', '描边矩形', '左上角 + 宽高'],
        ['<code>fillRect(x, y, w, h)</code>', '填充矩形', '左上角 + 宽高'],
        ['<code>fillText(text, x, y)</code>', '写文字', '内容 + 基准点'],
        ['<code>clearRect(x, y, w, h)</code>', '擦掉一块（重绘用）', '左上角 + 宽高']
      ],
      caption: 'stroke 系列画轮廓，fill 系列涂内部；参数顺序都是（x, y, 宽, 高）' },

    { t: 'code', run: false, caption: 'GcApisDemo.java　描边、填充、文字各来一遍：注意每一笔用的是"当前状态"', code:
`import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.stage.Stage;

public class GcApisDemo extends Application {
    @Override
    public void start(Stage stage) {
        Canvas canvas = new Canvas(320, 220);
        GraphicsContext gc = canvas.getGraphicsContext2D();

        // 描边组：只画轮廓
        gc.setStroke(Color.DARKRED);
        gc.setLineWidth(4);
        gc.strokeRect(20, 20, 120, 60);
        gc.strokeOval(180, 20, 120, 60);

        // 填充组：涂满内部
        gc.setFill(Color.LIGHTSEAGREEN);
        gc.fillRect(20, 110, 120, 60);
        gc.fillOval(180, 110, 120, 60);

        // 文字
        gc.setFill(Color.BLACK);
        gc.setFont(Font.font(16));
        gc.fillText("stroke = outline, fill = interior", 20, 205);

        // 重绘前用 clearRect(0, 0, 宽, 高) 把整块画布擦干净
        // gc.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());

        Pane root = new Pane(canvas);
        stage.setScene(new Scene(root, 340, 240));
        stage.setTitle("GraphicsContext APIs");
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'h', text: '七、重绘与绘制顺序', id: 'ch11-7' },

    { t: 'p', html:
`Canvas 是像素，画上去就擦不掉（除非 <code>clearRect</code> 或重画），所以先想清楚<b>什么画一次、什么每次画</b>。Tutorial 的结论很有用：<b>棋盘线可以先画一次；每落一子，只把那一颗棋子补画上去，而不是整块重画</b>——因为线不会变，重画一遍纯属浪费。但<b>重置整局时整体重绘最方便</b>：<code>clearRect</code> 擦干净，再画线、再画棋子。讲义把这两点都点了出来，也说明"要不要重绘"取决于场景，没有唯一答案。<br>另一条铁律是<b>绘制顺序 = 图层顺序</b>：后画的盖在先画的上面。所以必须<b>先画线、再画棋子</b>；反过来棋子会被线穿过，看着像破碎的。` },

    { t: 'compare', left: {
      title: 'Layout 版：用 Line 节点拼棋盘',
      html: '每格一个 StackPane，里面用 Pane 装"中心→右、中心→下"两条 Line；棋子可以做成 Circle 节点塞进对应格子。优点：棋子是节点，能单独挂事件、改样式，判断某格有没有棋子就看该格 <code>getChildren().size()</code> 是否大于 1。缺点：格子一多节点数暴涨（9×9 就是 81 个格子、162 条线），而且 Line 的坐标是相对自己的局部坐标系，容易被布局的重排弄偏。',
      code: 'Line h = new Line(CELL / 2, CELL / 2, CELL, CELL / 2);\nLine v = new Line(CELL / 2, CELL / 2, CELL / 2, CELL);\nPane lines = new Pane(h, v);\nStackPane cell = new StackPane(lines);'
    }, right: {
      title: 'Canvas 版：GraphicsContext 直接画',
      html: '一张 Canvas 上用循环 strokeLine 画满横竖线，棋子用 fillOval 叠画。优点：整个棋盘只占 1 个节点，画多少条线都不增加节点；<code>clearRect</code> 一行就能清屏重绘。缺点：画上去的东西不是节点，不能单独挂事件，只能靠鼠标坐标反算行和列。',
      code: 'for (int i = 0; i < N; i++) {\n    double p = MARGIN + i * CELL;\n    gc.strokeLine(MARGIN, p, size - MARGIN, p);\n    gc.strokeLine(p, MARGIN, p, size - MARGIN);\n}'
    } },

    { t: 'p', html:
`两条路都能画出 Gomoku 的棋盘，怎么选？<b>要"每个棋子能单独响应、单独改样式"</b>，就用 Line + StackPane 的节点方案；<b>要"线多、重绘频繁、节点数要少"</b>，就用 Canvas。Tutorial 的做法是两种都演示一遍，让你理解差异；项目里通常选 Canvas，因为棋盘格线是典型的大量静态图形。<br>注意 Layout 版里还有个细节：两条线是放进一个 <code>Pane</code>，再把 Pane 放进 <code>StackPane</code>，而不是把 Line 直接塞进 StackPane。因为 StackPane 默认居中、会重排子节点，Line 的起点坐标会被"整体平移"；套一个 Pane 后，线的坐标就从格子左上角算起，行为稳定。` },

    { t: 'codegroup', tabs: [
      { label: 'Layout 版：StackPane + Line', run: false, code:
`import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.ColumnConstraints;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.Pane;
import javafx.scene.layout.RowConstraints;
import javafx.scene.layout.StackPane;
import javafx.scene.shape.Line;
import javafx.stage.Stage;

public class BoardByLayout extends Application {
    private static final int N = 9;
    private static final double CELL = 30;

    @Override
    public void start(Stage stage) {
        GridPane board = new GridPane();
        for (int i = 0; i < N; i++) {          // 先定好 9×9 的格子尺寸
            board.getColumnConstraints().add(new ColumnConstraints(CELL));
            board.getRowConstraints().add(new RowConstraints(CELL));
        }
        for (int r = 0; r < N; r++) {
            for (int c = 0; c < N; c++) {
                board.add(makeCell(), c, r);
            }
        }

        stage.setScene(new Scene(board));
        stage.setTitle("Board by Layout");
        stage.show();
    }

    // 每格：StackPane 套 Pane，Pane 里两条线（中心→右、中心→下）
    private StackPane makeCell() {
        Pane lines = new Pane();
        Line h = new Line(CELL / 2, CELL / 2, CELL, CELL / 2);
        Line v = new Line(CELL / 2, CELL / 2, CELL / 2, CELL);
        lines.getChildren().addAll(h, v);

        StackPane cell = new StackPane(lines);
        cell.setMinSize(CELL, CELL);
        return cell;
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },
      { label: 'Canvas 版：GraphicsContext 画线', run: false, code:
`import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.layout.StackPane;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

public class BoardByCanvas extends Application {
    private static final int N = 9;
    private static final double CELL = 30;
    private static final double MARGIN = 20;

    @Override
    public void start(Stage stage) {
        double size = MARGIN * 2 + CELL * (N - 1);
        Canvas canvas = new Canvas(size, size);
        GraphicsContext gc = canvas.getGraphicsContext2D();

        gc.setStroke(Color.BLACK);
        gc.setLineWidth(1);
        for (int i = 0; i < N; i++) {
            double p = MARGIN + i * CELL;
            gc.strokeLine(MARGIN, p, size - MARGIN, p);   // 横线
            gc.strokeLine(p, MARGIN, p, size - MARGIN);   // 竖线
        }

        StackPane root = new StackPane(canvas);
        stage.setScene(new Scene(root, size + 20, size + 20));
        stage.setTitle("Board by Canvas");
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` }
    ] },

    { t: 'code', run: false, caption: 'BoardRedraw.java　先画线、再落子：每点一次，只在棋盘上叠一颗棋子', code:
`import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.layout.StackPane;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

public class BoardRedraw extends Application {
    private static final int N = 9;
    private static final double CELL = 30;
    private static final double MARGIN = 20;

    private Canvas canvas;
    private GraphicsContext gc;

    @Override
    public void start(Stage stage) {
        double size = MARGIN * 2 + CELL * (N - 1);
        canvas = new Canvas(size, size);
        gc = canvas.getGraphicsContext2D();
        drawBoard();                               // 棋盘只画这一次

        canvas.setOnMouseClicked(e -> {
            double col = Math.round((e.getX() - MARGIN) / CELL);
            double row = Math.round((e.getY() - MARGIN) / CELL);
            drawStone(row * CELL + MARGIN, col * CELL + MARGIN, Color.BLACK);
        });

        StackPane root = new StackPane(canvas);
        stage.setScene(new Scene(root, size + 20, size + 20));
        stage.setTitle("Board + Stones");
        stage.show();
    }

    // 重置棋局时可以调用：先擦净，再重画棋盘
    private void redrawAll() {
        gc.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());
        drawBoard();
    }

    private void drawBoard() {
        gc.setLineWidth(1);
        gc.setStroke(Color.BLACK);
        for (int i = 0; i < N; i++) {
            double p = MARGIN + i * CELL;
            gc.strokeLine(MARGIN, p, canvas.getWidth() - MARGIN, p);
            gc.strokeLine(p, MARGIN, p, canvas.getHeight() - MARGIN);
        }
    }

    private void drawStone(double cx, double cy, Color color) {
        double r = CELL * 0.4;
        gc.setFill(color);
        gc.fillOval(cx - r, cy - r, 2 * r, 2 * r);  // 后画的棋子盖在线上
    }

    public static void main(String[] args) {
        launch(args);
    }
}
` },

    { t: 'h', text: '八、在 IntelliJ 里导入示例代码', id: 'ch11-8' },

    { t: 'p', html:
`讲义给的示例代码是单个 <code>.java</code> 文件，直接双击打开是跑不起来的，要按四步导进项目：` },

    { t: 'steps', items: [
      { title: '第 1 步 · 新建 JavaFX 项目', html: 'IntelliJ：File → New → Project，选 JavaFX 模板（或普通 Java 项目再按第 9 章的方法配 JavaFX SDK），确认 JDK 版本。' },
      { title: '第 2 步 · 复制目标 .java 文件', html: '从课程示例的文件夹里，把要跑的 <code>.java</code> 文件复制下来。' },
      { title: '第 3 步 · 粘贴到正确的包目录', html: '在 IntelliJ 里粘贴到 <code>src/java/com/example/YourFolderName</code>（或模板给你的包路径）。<b>必须用 IntelliJ 粘贴</b>，它才会自动改 <code>package</code> 声明。' },
      { title: '第 4 步 · 右键 Run / Debug', html: '右键该文件 → Run。若报错，先看 JDK 配置，再确认 <b>External Libraries</b> 里已有 JavaFX 包。<code>package javafx.*</code> 找不到时，问题几乎总在环境。' }
    ] },

    { t: 'p', html:
`下面是这一章的绘图实验台：左侧选 API（画线、描边椭圆、填充矩形、写文字……），右侧画布立刻按参数画出来，状态条会显示"当前画笔"的颜色、线宽和路径点数。把本章表格里的方法逐个试一遍，再刻意制造两个错误——不调 <code>stroke()</code>、把 fill 和 stroke 顺序颠倒——看看画布上会发生什么。` },

    { t: 'lab', id: 'fxcanvas' },

    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch11-q1' },
    { t: 'quiz', qid: 'ch11-q2' },
    { t: 'quiz', qid: 'ch11-q3' },

    { t: 'keypoint', items: [
      { title: 'Shape 是节点', html: '<code>javafx.scene.shape</code> 里的 Line / Rectangle / Circle / Polygon 都是 Node，能放进布局、能挂事件、能用 CSS。' },
      { title: '构造参数', html: 'Line(x1,y1,x2,y2)、Rectangle(x,y,w,h)、Circle(cx,cy,r)、Polygon(x1,y1,x2,y2,…)；坐标原点在左上角，y 向下。' },
      { title: '描边与填充', html: 'stroke 画轮廓、fill 涂内部；Shape 默认 fill 黑色、stroke 为 null；<code>setStrokeWidth</code> 控制线宽。' },
      { title: 'Canvas', html: '构造时定宽高，绘制被裁剪在边界内；<code>getGraphicsContext2D()</code> 取画笔；Canvas 是 Node，但画上去的内容不是节点。' },
      { title: '路径绘图', html: '<code>beginPath</code> → <code>moveTo</code> → <code>lineTo</code>… → <code>stroke</code>；不 stroke / fill 就什么也画不出来。' },
      { title: 'API 两组', html: '<code>strokeOval</code> / <code>fillOval</code> / <code>strokeRect</code> / <code>fillRect</code> / <code>fillText</code>；参数是左上角 + 宽高。' },
      { title: '重绘与顺序', html: '棋盘线画一次、棋子每步补画；重置时 <code>clearRect</code> + 整体重画；后画的图形盖在先画的上面，所以先线后子。' }
    ] },

    { t: 'checklist', id: 'ch11', items: [
      '我能写出四种 2D Shape 的构造参数，并说清坐标原点在哪',
      '我能用 setFill / setStroke 让一个图形只显示轮廓或只显示填充',
      '我能解释 Shape 的 fill 与 stroke 默认值',
      '我能创建 Canvas、拿到 GraphicsContext，并画出三条连起来的线',
      '我能说出 beginPath / moveTo / lineTo / stroke 各自的作用',
      '我能列出 stroke 系列与 fill 系列的至少六个方法',
      '我能解释为什么画完路径必须调用 stroke()',
      '我能说出 Canvas 重绘的两种策略，并写出 clearRect 的用法',
      '我能解释为什么绘制顺序决定了棋子和线的遮挡关系',
      '我能按四步把讲义示例代码导入 IntelliJ 并运行'
    ] },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
`2D 图形是"看代码写结果"和"补代码"的好素材：<br>① <b>读代码 / 填空</b>：给一段画图代码问"画了几个图形、什么颜色、谁盖住谁"。要点是<b>后画的盖住先画的</b>，以及 fill 与 stroke 互不影响。也可能让你补全 <code>gc.beginPath(); gc.____(30, 30); gc.____(200, 30); gc.____();</code>（moveTo / lineTo / stroke）。<br>② <b>选择 / 判断</b>：Canvas 的绘制是否被裁剪（是）、Canvas 上的图形能不能单独挂事件（不能）、Shape 是 Node（是）、fill 默认黑色（是）。<br>③ <b>简答</b>：Canvas 与 Shape 两种画法的对比、stroke 与 fill 的区别、为什么要重绘。答题模板：先给定义，再给各自适用场景，最后举 Gomoku 棋盘为例。<br>④ <b>编程</b>：用 Canvas 画一个 N×N 棋盘（双重循环 + strokeLine），或用 Circle / Line 拼简单图形。<b>先写坐标公式，再写循环</b>，老师看的就是这一步。` },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
`图形代码最适合"先预测、再验证"：让 AI 画 5 个互相重叠的图形，<b>先自己写下谁盖住谁、每个位置大概在哪</b>，再对照运行结果。错的那一处，往往就是你对"绘制顺序 / 坐标原点"的误解。<br>让 AI 生成棋盘代码时，要求它写<b>两种版本</b>（Canvas 版和 Shape 版），然后你回答三个问题：节点数差多少？事件怎么接？重置时各要做什么？答不出来就说明还没读懂本章的对比表。<br>还有一个高价值练习：把你写的绘图代码发给 AI，让它只做"代码审查"，指出有没有忘记 stroke、颜色状态有没有正确切换、坐标是否越界。这类审查比让它重写更有用。` }

  ]
});
