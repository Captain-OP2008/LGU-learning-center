/* =====================================================================
 * data/index.js · CSC1004 学习站 · 章节清单（21 章 / 7 个 Part）
 * 依据 CUHK-Shenzhen《CSC1004 Computational Laboratory Using Java》
 *   （LIU Guiliang，Term 2 2026）12 讲 Lecture + 11 个 Tutorial + 期末考纲整理。
 * 职责：定义 21 章的元数据与顺序，供导航、总览、进度、搜索、首页星图使用。
 * 章节正文在 data/chXX.js 中按需加载。
 * ===================================================================== */
CSC.registerMeta([

  /* ------------------------------ Part I · 课程与工具 ------------------------------ */
  {
    id: 'ch00', num: '00', title: '总览与学习路线', en: 'Course Map & Study Routes',
    part: 'Part I · 课程与工具', week: 0, minutes: 24, icon: 'compass', labs: 1,
    blurb: '这门「计算实验室」到底怎么上：三个项目、评分构成、期末考什么、21 章该怎么读。'
  },
  {
    id: 'ch01', num: '01', title: '实验环境与项目结构', en: 'IDE, JDK & Project Layout',
    part: 'Part I · 课程与工具', week: 1, minutes: 34, icon: 'keyboard', labs: 1,
    blurb: 'IntelliJ IDEA、JDK、Maven、PyCharm：把环境装对，再用调试器第一次看清变量怎么变。'
  },
  {
    id: 'ch02', num: '02', title: 'AI 辅助编程：Vibe Coding', en: 'AI-Assisted Programming',
    part: 'Part I · 课程与工具', week: 1, minutes: 32, icon: 'sparkle', labs: 1,
    blurb: '课程允许项目用 AI，但期末考禁止。学会让 AI 写、自己验——这章讲怎么提问、怎么审查。'
  },

  /* ---------------------------- Part II · Java 面向对象 ---------------------------- */
  {
    id: 'ch03', num: '03', title: '类、对象与类设计', en: 'Classes, Objects & Class Design',
    part: 'Part II · Java 面向对象', week: 2, minutes: 48, icon: 'box', labs: 1,
    blurb: '写项目第一步是设计类：字段、构造器、封装、static，以及把一个游戏拆成几个对象。'
  },
  {
    id: 'ch04', num: '04', title: '继承、多态与接口', en: 'Inheritance, Polymorphism & Interfaces',
    part: 'Part II · Java 面向对象', week: 3, minutes: 54, icon: 'layers', labs: 2,
    blurb: 'extends、IS-A、单/多级/层次继承、HAS-A 聚合、interface——项目里到处都在用。'
  },
  {
    id: 'ch05', num: '05', title: 'Lambda 与函数式接口', en: 'Lambda & Functional Interfaces',
    part: 'Part II · Java 面向对象', week: 4, minutes: 32, icon: 'function', labs: 1,
    blurb: '把匿名内部类写成一行：函数式接口、箭头函数、方法引用，GUI 事件全靠它。'
  },

  /* ---------------------------- Part III · 网络与并发 ---------------------------- */
  {
    id: 'ch06', num: '06', title: 'Java I/O 与流', en: 'Java I/O & Streams',
    part: 'Part III · 网络与并发', week: 5, minutes: 46, icon: 'repeat', labs: 1,
    blurb: '字节流、字符流、缓冲流、数据流：一层层包装成能读写一行文本的管道。'
  },
  {
    id: 'ch07', num: '07', title: 'Socket 网络编程', en: 'Socket Programming',
    part: 'Part III · 网络与并发', week: 6, minutes: 52, icon: 'cpu', labs: 1,
    blurb: 'Socket 与 ServerSocket：accept 阻塞、端口、IP，客户端和服务器怎么第一次握手。'
  },
  {
    id: 'ch08', num: '08', title: '多线程与并发', en: 'Multithreading',
    part: 'Part III · 网络与并发', week: 7, minutes: 50, icon: 'memory', labs: 1,
    blurb: '线程五态、Runnable 与 Thread、start 与 run 的区别，聊天室为什么必须多线程。'
  },

  /* --------------------------- Part IV · JavaFX 界面 --------------------------- */
  {
    id: 'ch09', num: '09', title: 'JavaFX 基础：Stage·Scene·Node', en: 'JavaFX Fundamentals',
    part: 'Part IV · JavaFX 界面', week: 8, minutes: 44, icon: 'star', labs: 1,
    blurb: '一个窗口的三层结构：舞台 Stage、场景 Scene、节点 Node，以及 start() 的六步。'
  },
  {
    id: 'ch10', num: '10', title: 'JavaFX 控件与布局', en: 'Controls & Layouts',
    part: 'Part IV · JavaFX 界面', week: 9, minutes: 48, icon: 'grid', labs: 1,
    blurb: 'Label/Button/TextField/RadioButton… 放进 HBox/VBox/GridPane/StackPane/FlowPane。'
  },
  {
    id: 'ch11', num: '11', title: 'JavaFX 2D 图形与 Canvas', en: '2D Shapes & Canvas',
    part: 'Part IV · JavaFX 界面', week: 10, minutes: 46, icon: 'chart', labs: 1,
    blurb: 'Line/Circle/Rectangle/Polygon 与 Canvas：用 GraphicsContext 一笔一笔画出棋盘。'
  },
  {
    id: 'ch12', num: '12', title: 'JavaFX 事件处理', en: 'Event Handling',
    part: 'Part IV · JavaFX 界面', week: 11, minutes: 42, icon: 'zap', labs: 1,
    blurb: 'Event Source/Target/Handler，setOnAction 与 setOnMouseClicked，EventFilter 的区别。'
  },

  /* ----------------------------- Part V · 项目实战 ----------------------------- */
  {
    id: 'ch13', num: '13', title: '项目一：聊天室 Chat Zoom', en: 'Project I · Chat Room',
    part: 'Part V · 项目实战', week: 12, minutes: 56, icon: 'rocket', labs: 1,
    blurb: 'Server + ClientHandler + Client 三件套：把 Socket、多线程、广播拼成能多人聊天的程序。'
  },
  {
    id: 'ch14', num: '14', title: '项目二：Gomoku 五子棋', en: 'Project II · Gomoku',
    part: 'Part V · 项目实战', week: 13, minutes: 58, icon: 'target', labs: 1,
    blurb: '从控制台到 JavaFX：GomokuGame 的类设计、四方向胜负判定、平局与棋盘绘制。'
  },

  /* ------------------------------ Part VI · Python ------------------------------ */
  {
    id: 'ch15', num: '15', title: 'Python 基础', en: 'Python Basics',
    part: 'Part VI · Python', week: 14, minutes: 48, icon: 'code', labs: 1,
    blurb: '缩进即语法、动态类型、list 一组方法、if/elif、f-string——和 Java 逐条对照着学。'
  },
  {
    id: 'ch16', num: '16', title: 'Python 类与继承', en: 'Python Classes & Inheritance',
    part: 'Part VI · Python', week: 15, minutes: 44, icon: 'box', labs: 1,
    blurb: 'class、__init__、self、私有属性、__str__、super()、try/except、random。'
  },
  {
    id: 'ch17', num: '17', title: 'Python GUI：Tkinter', en: 'Python GUI · Tkinter',
    part: 'Part VI · Python', week: 16, minutes: 50, icon: 'grid', labs: 1,
    blurb: 'root + mainloop + 控件 + 三种几何管理 + Canvas + 事件绑定 + after()。'
  },
  {
    id: 'ch18', num: '18', title: '项目三：Snake 贪吃蛇', en: 'Project III · Snake',
    part: 'Part VI · Python', week: 17, minutes: 54, icon: 'play', labs: 1,
    blurb: 'SnakeGame(tk.Tk)：__init__ 建对象、run_game 用 after 循环、撞墙撞自己判负。'
  },
  {
    id: 'ch19', num: '19', title: 'Python 项目与机器学习入门', en: 'ML Project with PyTorch',
    part: 'Part VI · Python', week: 18, minutes: 38, icon: 'flask', labs: 1,
    blurb: '课程最后一个项目长什么样：读 config、定义网络、train/test 循环是怎么转起来的。'
  },

  /* ------------------------------ Part VII · 备考 ------------------------------ */
  {
    id: 'ch20', num: '20', title: '期末备考与全站速查', en: 'Final Exam Prep',
    part: 'Part VII · 备考', week: 19, minutes: 32, icon: 'trophy', labs: 1,
    blurb: '按考纲四部分（选择/判断/填空/简答编程）整理考点，配 3 套模拟卷的作答策略。'
  }
]);
