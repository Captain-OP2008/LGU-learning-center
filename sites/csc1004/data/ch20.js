/* =====================================================================
 * data/ch20.js · 第 20 章：期末备考与全站速查
 * 职责：把 Final Examination Guideline 的四部分结构、21 章高频考点、
 *       简答/编程题的拿分模板、8 个常见失分点、考前 7 天计划与考场策略
 *       收成一章，作为全站的复习出口。
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch20',
  num: '20',
  title: '期末备考与全站速查',
  en: 'Final Exam Prep',
  goals: [
    '能按四部分结构（选择 30% / 判断 20% / 填空 25% / 简答编程 25%）安排复习与答题时间',
    '能列出三个项目牵出的全部高频考点，并判断每个考点会以哪种题型出现',
    '会写简答题的四句式模板，也说得清编程题的给分点在哪',
    '能背出 8 个最常见失分点，并在考前自查一遍',
    '能按考前 7 天计划把 21 章过一遍，而不是只翻 PPT'
  ],
  kp: [
    { id: 'ch20-1', title: '卷面结构：四部分与时间分配' },
    { id: 'ch20-2', title: '高频考点清单（按 Part）' },
    { id: 'ch20-3', title: '简答题拿分模板' },
    { id: 'ch20-4', title: '编程题给分点与写法' },
    { id: 'ch20-5', title: '8 个最常见失分点' },
    { id: 'ch20-6', title: '考前 7 天计划与考场策略' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '这门课的期末考有一个非常特殊的性质：<b>它只考与项目紧密相关的知识</b>，而且是<b>闭卷</b>。' +
      '这两条合起来意味着，复习时最大的浪费不是漏看，而是「看了不考的东西」。' +
      '本章不给鸡汤，只做四件事：把卷子结构摊开、把考点按可能性排序、把答题模板写好、把最常见的失分点列出来。' +
      '读完这一章，你应该能用一句话回答：「我明天该复习哪三块，为什么是这三块。」'
    },

    { t: 'p', lead: true, html:
      '备考的本质是<b>资源分配</b>：100 分钟要拿满四个 Part 的分，考前一周要把 21 章过完。' +
      '与其问「还有什么没看」，不如问「哪一块的边际分数最高」。'
    },

    /* ---------------------------------------------------------------- §1 */
    { t: 'h', text: '一、卷面结构：四部分与时间分配', id: 'ch20-1' },

    { t: 'p', html:
      '考试时长 100 分钟，另有 10 分钟阅读时间，总分 100。四部分的题型与分值如下。' +
      '注意 Part I 和 Part II 共用 35 分钟：30% + 20% = 50 分在 35 分钟内拿到，' +
      '平均每题 2 分钟出头——这意味着<b>这两部分必须靠条件反射，不能靠现场推演</b>。'
    },

    { t: 'table', caption: '四部分结构与建议用时', head:
      ['Part', '题型', '题数 × 分值', '总分', '建议用时', '性质'], rows: [
      ['I', 'Multiple Choice', '10 × 3', '30', '与 II 合计 35 分钟', '概念 + 小代码，速度快'],
      ['II', 'True / False', '5 × 4', '20', '同上', '考陷阱，判断要果断'],
      ['III', 'Fill in the Blanks', '5 × 5', '25', '25 分钟', '拼记忆细节，写错即零分'],
      ['IV', 'Short Answer & Programming', '2 题', '25', '30 分钟', '按关键词与结构给分']
    ]},

    { t: 'lab', id: 'examclock' },

    { t: 'p', html:
      '阅读时间（前 10 分钟）不要拿来做第一题。用它做三件事：' +
      '① 翻到最后看编程题考什么（这决定你后面的心态）；' +
      '② 把会做的选择题在心里标一遍；' +
      '③ 估算哪一部分会超时。真正开始后，PART I/II 一旦超过 40 分钟就必须收手往前赶。'
    },

    /* ---------------------------------------------------------------- §2 */
    { t: 'h', text: '二、高频考点清单（按 Part）', id: 'ch20-2' },

    { t: 'p', html:
      '下面这份清单按「考点 → 常考题型的可能性」组织。<b>★★★</b> 基本必考，<b>★★</b> 高频，' +
      '<b>★</b> 偶尔出现。复习时按星级从高到低，不要按章节顺序。'
    },

    { t: 'table', caption: 'Part II · Java 面向对象（ch03–ch05）', head:
      ['考点', '星级', '最常见的考法'], rows: [
      ['<code>extends</code> / IS-A / <code>super(...)</code> / <code>super.m()</code>', '★★★', '填空补 <code>extends</code>；判断某代码能否编译'],
      ['方法重写 vs 重载（@Override）', '★★★', '给两段代码问哪个是重写；选择「哪个语句会动态派发」'],
      ['多态：父类引用指向子类对象', '★★★', '读程序写输出（走子类还是父类方法）'],
      ['构造器链：子类构造器先调父类', '★★★', '判断输出顺序；填空 <code>super(...)</code>'],
      ['Java 不支持多继承（为什么）', '★★★', '判断题；选择正确答案（接口可以有多个）'],
      ['interface 与 abstract class 的区别', '★★', '选择/判断'],
      ['HAS-A 聚合 vs IS-A 继承', '★★', '给场景问用哪个'],
      ['static 与实例成员的区别', '★★', '判断「static 方法能否访问实例字段」'],
      ['封装与访问修饰符', '★', '填空/选择'],
      ['Lambda 与函数式接口', '★★', '填空 <code>(e) -> ...</code>；判断 lambda 能否替换匿名内部类']
    ]},

    { t: 'table', caption: 'Part III · 网络与并发（ch06–ch08）', head:
      ['考点', '星级', '最常见的考法'], rows: [
      ['流包装链：<code>Socket → OutputStreamWriter → BufferedWriter</code>', '★★★', '填空补包装顺序；选择哪一层提供 <code>readLine()</code>'],
      ['<code>ServerSocket.accept()</code> 的阻塞语义', '★★★', '选择「accept 什么时候返回」；判断题'],
      ['<code>Socket</code> vs <code>ServerSocket</code> 的职责', '★★★', '选择/判断'],
      ['客户端必须知道 IP + 端口', '★★', '填空'],
      ['线程五态与状态转换', '★★★', '选择「调用 <code>start()</code> 后进入哪个状态」'],
      ['<code>start()</code> 与 <code>run()</code> 的区别', '★★★', '判断题（最常见陷阱）'],
      ['两种创建线程的方式', '★★★', '填空 <code>implements Runnable</code> / <code>extends Thread</code>'],
      ['<code>Thread.sleep</code> 与 <code>InterruptedException</code>', '★★', '判断/填空'],
      ['为什么聊天室要为每个客户端开线程', '★★★', '简答题（Part IV 常客）'],
      ['共享状态与竞态（<code>ArrayList</code> 并发修改）', '★★', '简答/选择'],
      ['I/O 流：字节流 vs 字符流', '★★', '选择/判断']
    ]},

    { t: 'table', caption: 'Part IV · JavaFX（ch09–ch12）', head:
      ['考点', '星级', '最常见的考法'], rows: [
      ['Stage / Scene / Node 三层结构', '★★★', '填空「Scene 装 Node、Stage 装 Scene」'],
      ['<code>Application</code> + <code>start(Stage)</code> + <code>launch(args)</code> 骨架', '★★★', '编程题写骨架；填空'],
      ['<code>primaryStage.show()</code>', '★★', '填空'],
      ['布局：HBox / VBox / GridPane / StackPane / FlowPane', '★★★', '选择「哪个布局会重叠」；给需求选布局'],
      ['常用控件与用途（PasswordField / RadioButton / CheckBox…）', '★★', '选择/填空'],
      ['布局可嵌套', '★★', '判断'],
      ['2D 图形类：Line / Rectangle / Circle / Polygon', '★★', '填空构造参数'],
      ['Canvas + GraphicsContext 绘图流程', '★★★', '填空 <code>getGraphicsContext2D()</code>、<code>beginPath/moveTo/lineTo/stroke</code>'],
      ['stroke 与 fill 的区别', '★★', '判断'],
      ['事件四要素：Source / Object / Target / Handler', '★★★', '选择/填空'],
      ['<code>setOnAction</code> / <code>setOnMouseClicked</code> / <code>setOnKeyPressed</code>', '★★★', '填空'],
      ['EventHandler vs EventFilter（冒泡 vs 捕获）', '★★', '判断/选择'],
      ['用 lambda 注册事件处理器', '★★', '填空/编程']
    ]},

    { t: 'table', caption: 'Part VI · Python（ch15–ch19）', head:
      ['考点', '星级', '最常见的考法'], rows: [
      ['缩进即语法；不需要分号与类型声明', '★★★', '判断/选择'],
      ['list 常用方法：<code>append/insert/remove/len/切片/in</code>', '★★★', '填空/预测输出'],
      ['<code>range()</code> 与 <code>len()</code> 组合遍历', '★★★', '预测输出'],
      ['<code>if/elif/else</code>、<code>and/or/not</code>', '★★', '预测输出'],
      ['f-string 表达式插值', '★★', '填空/预测输出'],
      ['<code>class</code> / <code>__init__</code> / <code>self</code> / 私有 <code>__</code> 属性', '★★★', '填空/简答'],
      ['<code>__str__</code> 与 <code>print(obj)</code>', '★★', '预测输出'],
      ['继承与 <code>super().__init__(...)</code>', '★★★', '填空/编程'],
      ['<code>try/except/else/finally</code>', '★★', '判断执行顺序'],
      ['Tkinter 四步骨架与 <code>mainloop()</code>', '★★★', '填空/简答'],
      ['<code>pack()</code> / <code>grid()</code> / <code>place()</code> 的区别', '★★★', '选择/简答'],
      ['Canvas 绘图方法 <code>create_rectangle/create_text/delete</code>', '★★', '填空'],
      ['事件绑定 <code>bind(&#39;&lt;KeyPress&gt;&#39;, fn)</code> 与 <code>event.keysym</code>', '★★', '填空'],
      ['<code>after()</code> 循环与「为什么不能用 while + sleep」', '★★★', '简答题（高频）'],
      ['PyTorch 流程：<code>model.train()/eval()</code>、<code>loss.backward()</code>、<code>optimizer.step()</code>、<code>no_grad()</code>', '★', '选择/填空']
    ]},

    { t: 'callout', kind: 'tip', title: '资料这么多，怎么用', html:
      '本站已经把同一批考点铺成了三条路径：<b>章节正文</b>（理解）、<b>题库</b>（自测）、<b>速查表</b>（考前扫）。' +
      '考前一周的正确用法是：题库按章节刷错题 → 回到章节正文只看错题对应的知识点 → ' +
      '最后两天只看速查表与本章的失分点清单。不要重新从头读正文。'
    },

    /* ---------------------------------------------------------------- §3 */
    { t: 'h', text: '三、简答题拿分模板', id: 'ch20-3' },

    { t: 'p', html:
      'Part IV 的简答题是「按关键词给分」，阅卷人手上是一张给分点表。' +
      '所以你要做的不是写一段漂亮的散文，而是<b>把给分点一个个写出来</b>。最稳的结构是四句话：'
    },

    { t: 'steps', items: [
      { title: '定义（一句）', html: '用一句话说出这个概念是什么。<br><i>例：多态是指同一个父类引用在运行时可以指向不同子类对象，并调用到各自重写后的方法。</i>' },
      { title: '机制（一到两句）', html: '说清它是怎么实现的。<br><i>例：Java 通过动态绑定实现——方法调用在运行时根据对象的实际类型决定，而不是编译时声明的类型。</i>' },
      { title: '例子（一句代码或一句话）', html: '给一个最小例子，证明你懂。<br><i>例：<code>Animal a = new Dog(); a.speak();</code> 调用的是 Dog 的 speak。</i>' },
      { title: '用途 / 代价（一句）', html: '说清为什么要有它、有什么代价。<br><i>例：它让「统一调用、分别实现」成为可能；代价是运行时才能确定调用目标。</i>' }
    ]},

    { t: 'compare', left: { title: '低分写法（常见）', html:
      '「多态就是父类和子类。子类继承父类，然后可以重写方法。」<br>' +
      '<span class="dim">问题：只说了继承，没说「运行时决定」这个关键机制，给分点缺一半。</span>' },
      right: { title: '高分写法', html:
      '「多态是同一父类引用在运行时指向不同子类对象、调用到各自重写方法的能力。Java 通过动态绑定实现，' +
      '调用目标由对象实际类型决定。例：<code>Animal a = new Dog(); a.speak()</code> 执行 Dog 的重写版本。' +
      '它支撑了统一接口、分别实现，代价是运行时才确定目标。」' },
      vs: '同一个知识点，给分点是否写全' },

    { t: 'callout', kind: 'exam', title: '简答题三个不要', html:
      '<b>不要只举例不解释</b>（阅卷人看不出你懂机制）；' +
      '<b>不要写一长段没有术语的话</b>（没有关键词就没有分）；' +
      '<b>不要空着</b>（写出定义句就有分，空着一定 0 分）。' +
      '如果实在想不起来，就写「这个概念在 XX 项目里用来解决 XX 问题」，至少拿到语境分。'
    },

    /* ---------------------------------------------------------------- §4 */
    { t: 'h', text: '四、编程题给分点与写法', id: 'ch20-4' },

    { t: 'p', html:
      '编程题按「结构完整 + 语法正确」给分，不是按「能不能跑」给分——因为卷面上无法运行。' +
      '所以你要写的是「让阅卷人一眼看到结构完整」的代码。优先顺序是：'
    },

    { t: 'steps', items: [
      { title: '先写骨架，再填逻辑', html:
        '类声明 → 方法签名 → 方法体。哪怕方法体只写了 <code>// TODO</code>，骨架本身也是分。' +
        'Java 题记得写 <code>import</code>（<code>java.io.*</code>、<code>java.net.*</code>、<code>java.util.*</code>）。' },
      { title: '关键字一个都不能错', html:
        '<code>extends</code> 不是 <code>extend</code>；<code>implements</code> 不是 <code>implement</code>；<code>public static void main(String[] args)</code> 少一个空格都不影响但少一个 <code>String</code> 就废。' },
      { title: '异常声明要写', html:
        'Socket / I/O 相关的方法几乎都要 <code>throws IOException</code>，或者 <code>try-catch</code> 包住。写漏了是明确的扣分点。' },
      { title: '边界条件写出来', html:
        '数组越界、空输入、除零 —— 哪怕只加一句 <code>if (x == null) return;</code>，也是「考虑过」的证据。' },
      { title: '最后补注释', html:
        '时间够就加一两行中文注释说明思路；不够就不加，不要为了注释少写逻辑。' }
    ]},

    { t: 'code', caption: '典型编程题：写一个线程安全的计数器（示例答案结构）', run: false, code:
`public class SafeCounter {
    private int count = 0;                 // 临界资源

    // synchronized 保证同一时刻只有一个线程能进入
    public synchronized void increment() {
        count++;
    }

    public synchronized int get() {
        return count;
    }
}

// 使用：
// SafeCounter c = new SafeCounter();
// new Thread(() -> { for (int i = 0; i < 1000; i++) c.increment(); }).start();` },

    { t: 'p', html:
      '注意这段答案的「给分点」都在明面上：类声明、私有字段、<code>synchronized</code> 关键字、两个方法、注释。' +
      '哪怕 <code>count++</code> 写成 <code>count += 1</code>，分数也不受影响；但漏掉 <code>synchronized</code>，这道题基本就没分了。'
    },

    { t: 'code', lang: 'python', caption: '典型编程题：写一个 Python 贪吃蛇的类骨架（示例答案结构）', run: false, code:
`import tkinter as tk          # ① 只用标准库
import random

class SnakeGame(tk.Tk):       # ② 继承 tk.Tk，游戏即窗口
    def __init__(self):
        super().__init__()                      # ③ 先初始化父类
        self.title("Snake Game")
        self.geometry("800x800")
        self.cell_size = 20
        self.snake_direction = "Right"
        self.snake = [(100, 100), (80, 100), (60, 100)]
        self.food = self.create_food()          # ④ 调用自己的方法
        self.canvas = tk.Canvas(self, width=800, height=800, bg="black")
        self.canvas.pack()
        self.bind("<KeyPress>", self.change_direction)
        self.after(100, self.run_game)          # ⑤ 用 after 起游戏循环

    def run_game(self):
        self.move_snake()
        self.update_ui()
        self.after(100, self.run_game)          # ⑥ 递归调度，不阻塞 mainloop

    def move_snake(self):    pass
    def update_ui(self):     pass
    def create_food(self):   pass
    def change_direction(self, event): pass` },

    { t: 'p', html:
      '这道题即使你不会写具体逻辑，只要把这五样写出来就很可观：<b>import、类声明与继承、' +
      '<code>__init__</code> 里的字段初始化、<code>bind</code> 事件绑定、<code>after</code> 循环</b>。' +
      '阅卷人扫一眼就知道你懂 Tkinter 的结构——这正是编程题「按结构给分」的含义。'
    },

    { t: 'quiz', qid: 'ch20-q1' },

    /* ---------------------------------------------------------------- §5 */
    { t: 'h', text: '五、8 个最常见失分点', id: 'ch20-5' },

    { t: 'p', html:
      '下面这 8 条，每一条都是「明明会，但丢了分」。考前把它们抄在一张纸上，进考场前看一遍。'
    },

    { t: 'steps', items: [
      { title: '<code>start()</code> 和 <code>run()</code> 混为一谈', html: '<code>run()</code> 直接在调用线程里执行，不会开新线程。判断题与选择题的高频陷阱。' },
      { title: '以为 Java 支持多继承', html: '类只能单继承；接口可以多实现。菱形的歧义问题就是原因。' },
      { title: '<code>readLine()</code> 在流结束/无数据时返回 <code>null</code>', html: '不是空字符串，是 <code>null</code>。用它做循环条件很常见，但忘了判空会 NPE。' },
      { title: '忘了 <code>super(...)</code> 必须是构造器第一句', html: 'Java 要求子类构造器的第一行是 <code>super(...)</code> 或 <code>this(...)</code>，写晚了编译不过。' },
      { title: '<code>accept()</code> 是阻塞的', html: '没有客户端连接时它停在那里等，不会返回 null。判断题常考。' },
      { title: '<code>pack()</code> 与 <code>grid()</code> 在同一容器里混用', html: 'Tkinter 会直接报错。这是 Python GUI 题最常见的坑。' },
      { title: '把 <code>after()</code> 换成 <code>while</code> + <code>time.sleep()</code>', html: '会阻塞 Tkinter 的 <code>mainloop()</code>，界面卡死。这是简答题的高频考点。' },
      { title: '简答题只写例子不写机制', html: '没有机制句就没有关键词，没有关键词就没有分。' }
    ]},

    /* ---------------------------------------------------------------- §6 */
    { t: 'h', text: '六、考前 7 天计划与考场策略', id: 'ch20-6' },

    { t: 'p', html:
      '如果你是 7 天前才开始复习，不要试图重读 21 章。下面这个顺序是按「边际分数」排的：' +
      '先拿分最多的 Part I/II 概念，再补 Part III 细节，最后练 Part IV 的答题结构。'
    },

    { t: 'table', caption: '考前 7 天计划', head: ['天', '做什么', '用站内什么'], rows: [
      ['D-7', '刷 21 章题库的「概念 / 陷阱」标签题，记录错题', '#/quiz（标签筛选）'],
      ['D-6', '重看错题对应的章节知识点（只看错题那块）', '章节正文 + 术语表'],
      ['D-5', '把 Java 部分（ch03–ch14）的填空型细节默写一遍', '#/cheatsheet + 各章关键代码块'],
      ['D-4', '做 F2（Java 侧重）模拟卷，100 分钟限时', '#/exam → F2'],
      ['D-3', '做 F3（Python 侧重）模拟卷，订正', '#/exam → F3'],
      ['D-2', '做 F1（全范围）模拟卷，三套错题合并复习', '#/exam → F1'],
      ['D-1', '只做三件事：看速查表、看本章失分点、读三个项目的架构图', '#/cheatsheet + 本章 + #/projects']
    ]},

    { t: 'callout', kind: 'exam', title: '考场上的时间纪律', html:
      '<b>0–10 分钟（阅读）</b>：扫全卷，确认编程题考什么，心里给每部分标时间。' +
      '<b>10–45 分钟</b>：Part I/II 全部做完，卡住的题先猜一个并标记。' +
      '<b>45–70 分钟</b>：Part III 填空，写不准也要写最有把握的候选。' +
      '<b>70–95 分钟</b>：Part IV，先写简答（有模板，稳拿），再写编程（先骨架）。' +
      '<b>最后 5 分钟</b>：检查学号姓名、检查是否有整题空白。'
    },

    { t: 'keypoint', items: [
      { title: '100 分在 4 个口袋', html: '选择 30 / 判断 20 / 填空 25 / 简答编程 25。Part I+II 只给 35 分钟，必须条件反射。' },
      { title: '只考项目相关的', html: '凡是三个项目里没出现过的冷门语法，优先级下调；凡是出现过的机制，必须能讲清。' },
      { title: '简答四句式', html: '定义 → 机制 → 例子 → 用途/代价。一个给分点一句，别写成散文。' },
      { title: '编程先骨架', html: '类声明、方法签名、import、throws、边界判断——这五样比把逻辑写全更容易拿分。' },
      { title: '8 个失分点', html: 'start/run、多继承、readLine 返回 null、super 第一句、accept 阻塞、pack/grid、after 循环、只举例不解释。' },
      { title: '考前 7 天按分数排', html: '题库错题 → 细节默写 → 三套模拟卷 → 速查表与失分点。不要重读 21 章。' }
    ]},

    { t: 'checklist', id: 'ch20', items: [
      '我能说出四部分的分值与建议用时，并背出「I+II 只有 35 分钟」',
      '我能按星级说出三个项目牵出的高频考点（至少各 5 条）',
      '我能用四句式模板写出「多态」「为什么聊天室要多线程」「after 循环」三道简答',
      '我能写出 JavaFX Application 的六行骨架与 Python SnakeGame 的类骨架',
      '我能背出 8 个常见失分点',
      '我已经做完至少两套模拟卷并订正',
      '我知道考场上 0–10 / 10–45 / 45–70 / 70–95 / 95–100 分钟分别做什么'
    ]},

    { t: 'callout', kind: 'ai', html:
      '考前用 AI 只有一个正确姿势：<b>让它出题考你</b>，而不是让它给你答案。' +
      '把某章的 <code>kp</code> 清单贴给它，说「按 CSC1004 期末考的四部分题型，各出一道题，先别给答案」；' +
      '你答完再让它批改并指出漏掉的给分点。' +
      '这个用法既符合课程规则（考试期间不用 AI 是指考场内），也真的能查出你的盲区——' +
      '因为它会逼你把话说完整，而「说完整」正是简答题的训练目标。'
    }
  ]
});
