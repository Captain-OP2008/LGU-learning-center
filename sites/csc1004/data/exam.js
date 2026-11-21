/* =====================================================================
 * data/exam.js · CSC1004 期末模拟卷（3 套，各 100 分 / 100 分钟）
 * F1 Mock Final 1：全范围（Java 继承/多态 · I/O · Socket · 线程 · JavaFX
 *                   + Python 类与 Tkinter + PyTorch 训练流程）
 * F2 Mock Final 2：Java 侧重（约 77 分 Java / 23 分 Python）
 * F3 Mock Final 3：Python 侧重（约 70 分 Python + PyTorch 项目流程 / 30 分 Java）
 * 结构：严格按 Final Examination Guideline 四部分
 *       Part I 选择 10×3=30 · Part II 判断 5×4=20 · Part III 填空 5×5=25
 *       Part IV 简答 & 编程 10+15=25
 * 判分：parts[].kind = choice | tf | fill | keywords（引擎见 assets/exam.js）
 * 注入：CSC.registerExam({...})；另挂 CSC._exams 供引擎先于数据加载时读取
 * 作者：exam 成员（写作用域仅 data/exam.js）
 * ===================================================================== */
(function () {
  'use strict';

  /* ================================================================
   * F1 · Mock Final 1（全范围）
   * ================================================================ */
  var F1 = {
    id: 'F1',
    title: 'Mock Final 1',
    style: 'CSC1004 style',
    subtitle: 'Computational Laboratory Using Java · Full syllabus',
    date: 'Term 2, 2026',
    minutes: 100,
    totalScore: 100,
    summary: '全范围模拟卷：Part I 10 道选择（30 分）、Part II 5 道判断（20 分）、Part III 5 道填空（25 分）、Part IV 简答 + 编程（25 分）。覆盖 Java 继承与多态、字节流/字符流、Socket、多线程、JavaFX 三层结构，以及 Python 列表与类、Tkinter 几何管理、PyTorch 训练循环。适合先按章节刷完题库后，做一次完整的限时训练。',
    instructions: [
      'This is a closed-book examination. No notes, textbooks, calculators or electronic devices are allowed.',
      'Total time: 100 minutes, plus 10 minutes reading time. Total marks: 100.',
      'Part I 30 marks · Part II 20 marks · Part III 25 marks · Part IV 25 marks.',
      'For multiple-choice questions, choose ONE best answer. There is no penalty for guessing.',
      'For Part IV, marks are given for the key points; write concisely and clearly.',
      '假定代码忽略未给出的 <code>import</code>；Java 按课程材料（JDK 17+ / JavaFX 21）理解。',
      '建议时间：Part I &amp; II 35 分钟，Part III 25 分钟，Part IV 30 分钟。'
    ],
    questions: [
      /* ---------------------------------------------------------- Part I */
      {
        no: 1,
        points: 30,
        type: 'mcq',
        intro: 'Part I · Multiple Choice (10 × 3 = 30 marks)',
        parts: [
          {
            label: '1',
            points: 3,
            kind: 'choice',
            prompt: 'What is printed by the following program?',
            code:
`class Animal {
    Animal() { System.out.print("Animal "); }
}

class Dog extends Animal {
    Dog() { System.out.print("Dog "); }
}

public class Main {
    public static void main(String[] args) {
        new Dog();
    }
}`,
            options: [
              { text: '<code>Dog Animal </code>' },
              { text: '<code>Animal Dog </code>', correct: true },
              { text: '<code>Animal </code>' },
              { text: 'Compile error: the <code>Dog</code> constructor must call <code>super()</code> explicitly' }
            ],
            answer: 'B',
            explain: '<code>new Dog()</code> 先进入 <code>Dog</code> 的构造器，而它的第一条语句是编译器自动插入的 <code>super();</code>，因此父类 <code>Animal</code> 的构造器先执行（打印 Animal），返回值后再执行 <code>Dog</code> 自己的构造器体（打印 Dog）。D 是最常见的误解：只有当父类<strong>没有无参构造器</strong>时才必须显式写 <code>super(...)</code>；这里有隐式的无参 <code>super()</code>，可以编译。C 忘了子类构造器体也会执行。'
          },
          {
            label: '2',
            points: 3,
            kind: 'choice',
            prompt: 'What is the result of compiling and running the following program?',
            code:
`class Animal {
    void sound() { System.out.print("animal"); }
}

class Dog extends Animal {
    void sound() { System.out.print("dog"); }
    void fetch() { System.out.print("fetch"); }
}

public class Main {
    public static void main(String[] args) {
        Animal a = new Dog();
        a.sound();
        a.fetch();
    }
}`,
            options: [
              { text: 'It prints <code>dogfetch</code>' },
              { text: 'It prints <code>dog</code>, then throws a <code>ClassCastException</code>' },
              { text: 'Compile error: <code>fetch()</code> is not a member of <code>Animal</code>', correct: true },
              { text: 'It prints <code>animalfetch</code>' }
            ],
            answer: 'C',
            explain: '方法调用在<strong>编译期</strong>按引用类型 <code>Animal</code> 检查成员：<code>Animal</code> 里只有 <code>sound()</code>，没有 <code>fetch()</code>，所以 <code>a.fetch()</code> 报 “cannot find symbol”，整段代码根本无法编译。B 混淆了“方法不存在”和“强制转型失败”：<code>ClassCastException</code> 只在显式向下转型 <code>(Dog) a</code> 失败时出现。注意 <code>a.sound()</code> 本身确实是动态绑定到 <code>Dog</code> 版本，但因为编译失败，不会输出任何东西。'
          },
          {
            label: '3',
            points: 3,
            kind: 'choice',
            prompt: 'A server reads from a client socket as follows. When the client closes the connection, what does <code>readLine()</code> return so that the loop can stop?',
            code:
`BufferedReader reader = new BufferedReader(
        new InputStreamReader(socket.getInputStream()));
String line;
while ((line = reader.readLine()) != null) {
    System.out.println(line);
}`,
            options: [
              { text: 'An empty string <code>""</code>' },
              { text: '<code>null</code>', correct: true },
              { text: '<code>-1</code>' },
              { text: 'It throws an <code>EOFException</code>' }
            ],
            answer: 'B',
            explain: '<code>readLine()</code> 读到流的末尾（对端关闭连接）时返回 <code>null</code>，循环用 <code>(line = reader.readLine()) != null</code> 退出。空行返回的是 <code>""</code>（长度 0 的字符串），所以 A 是陷阱——它表示“这一行是空的”，不是“没有下一行了”。<code>-1</code> 是 <code>InputStream.read()</code> 的 EOF 约定，不是 <code>readLine()</code> 的。<code>EOFException</code> 是 <code>DataInputStream.readUTF/readInt</code> 等“必须读够字节”的方法在数据不足时抛的异常，<code>readLine()</code> 不抛它。'
          },
          {
            label: '4',
            points: 3,
            kind: 'choice',
            prompt: 'Which statement about <code>serverSocket.accept()</code> is correct?',
            code:
`ServerSocket serverSocket = new ServerSocket(1004);
while (!serverSocket.isClosed()) {
    Socket socket = serverSocket.accept();
    // ...
}`,
            options: [
              { text: 'It returns <code>null</code> while no client is connected, so the loop keeps spinning.' },
              { text: 'It blocks until a client&rsquo;s connection is established, then returns a <code>Socket</code> for that connection.', correct: true },
              { text: 'It blocks until the connected client sends its first message.' },
              { text: 'It returns a new <code>ServerSocket</code> bound to a free port for each client.' }
            ],
            answer: 'B',
            explain: '<code>accept()</code> 阻塞在“连接建立”（三次握手完成）那一刻，随后返回一个代表该连接的 <code>Socket</code>；客户端还没来得及发消息，它也会返回。A 把阻塞当成了非阻塞轮询——要非阻塞得用 <code>setSoTimeout</code> 或 NIO。C 混淆了“建立连接”和“收到数据”：等待数据的是 <code>readLine()</code>。D：<code>ServerSocket</code> 只负责在固定端口监听，每个客户端连接用 <code>accept()</code> 返回的 <code>Socket</code> 表示，不会再造一个 <code>ServerSocket</code>。'
          },
          {
            label: '5',
            points: 3,
            kind: 'choice',
            prompt: 'Assume <code>task</code> is a <code>Runnable</code> whose <code>run()</code> prints <code>task </code>. What is printed?',
            code:
`Thread t = new Thread(task);
t.run();
System.out.print("main ");`,
            options: [
              { text: '<code>task main </code>', correct: true },
              { text: '<code>main task </code>, always' },
              { text: '<code>task main </code> or <code>main task </code>, the order is unpredictable' },
              { text: '<code>task main </code>, then <code>IllegalThreadStateException</code>' }
            ],
            answer: 'A',
            explain: '直接调用 <code>t.run()</code> 只是<strong>普通方法调用</strong>，在当前（main）线程里同步执行：先跑完 <code>run()</code> 打印 <code>task</code>，回到下一行再打印 <code>main</code>，所以顺序确定是 <code>task main</code>。C 描述的是 <code>t.start()</code> 的行为：<code>start()</code> 只是把线程变到 runnable，具体谁先获得 CPU 由调度器决定。D：<code>IllegalThreadStateException</code> 只在同一个线程对象上第二次调用 <code>start()</code> 时抛。'
          },
          {
            label: '6',
            points: 3,
            kind: 'choice',
            prompt: 'What is printed by the following Python program?',
            code:
`fruits = ["apple", "banana", "cherry", "orange", "kiwi", "melon", "mango"]
print(fruits[2:5])`,
            codeTitle: 'Python',
            options: [
              { text: "<code>['banana', 'cherry', 'orange']</code>" },
              { text: "<code>['cherry', 'orange', 'kiwi']</code>", correct: true },
              { text: "<code>['cherry', 'orange', 'kiwi', 'melon']</code>" },
              { text: "<code>['cherry', 'orange']</code>" }
            ],
            answer: 'B',
            explain: '切片 <code>[start:stop]</code> 含 <code>start</code>、<strong>不含</strong> <code>stop</code>：下标 2、3、4 分别是 cherry、orange、kiwi。A 忘了下标从 0 开始（2 是第三个元素）。C 把 <code>stop</code> 也算进去了（那相当于 <code>[2:6]</code>）。D 少取了 <code>stop-1</code> 那一项。'
          },
          {
            label: '7',
            points: 3,
            kind: 'choice',
            prompt: 'What happens when this Python program runs?',
            code:
`class Account:
    def __init__(self):
        self.__balance = 100

a = Account()
print(a.__balance)`,
            codeTitle: 'Python',
            options: [
              { text: 'It prints <code>100</code>' },
              { text: 'It raises <code>AttributeError</code>', correct: true },
              { text: 'It prints <code>None</code>' },
              { text: 'It is a <code>SyntaxError</code> at the class definition' }
            ],
            answer: 'B',
            explain: '以两个下划线开头（且不以两个下划线结尾）的属性会被“名称改写”（name mangling）成 <code>_Account__balance</code>，类外写 <code>a.__balance</code> 找不到这个名字，于是抛 <code>AttributeError</code>。这正是 Python 表示“私有”的方式：类内部 <code>self.__balance</code> 仍可正常访问，通常再提供一个公有方法（如 <code>print_balance</code>）对外暴露。C：属性确实存在，只是名字被改了，不是 <code>None</code>。D：语法本身完全合法。'
          },
          {
            label: '8',
            points: 3,
            kind: 'choice',
            prompt: 'In one <code>Frame</code>, the first <code>Label</code> is placed with <code>pack()</code>, and then a <code>Button</code> is placed with <code>grid(row=1, column=0)</code>. What happens?',
            options: [
              { text: 'Both widgets appear; <code>grid</code> takes priority over <code>pack</code>.' },
              { text: 'Tkinter raises a <code>TclError</code> saying that <code>grid</code> cannot be used inside a container that already has slaves managed by <code>pack</code>.', correct: true },
              { text: 'The <code>grid()</code> call is silently ignored.' },
              { text: 'Both calls are ignored and the frame stays empty until <code>mainloop()</code> is called.' }
            ],
            answer: 'B',
            explain: '同一个父容器<strong>只能使用一种几何管理器</strong>，混用会在运行时直接抛 <code>TclError</code>（不是语法/编译错误，所以程序能启动，但界面立刻报错）。C 是最常见的误解：不是悄悄忽略，而是报错。不同容器可以各用各的：例如 root 用 <code>pack()</code> 放两个 Frame，<code>frame1</code> 内部用 <code>grid()</code> 排按钮，完全合法。'
          },
          {
            label: '9',
            points: 3,
            kind: 'choice',
            prompt: 'What is printed?',
            code:
`english = 78
maths = 56
hindi = 85
print(f"Ram got total marks {english + maths + hindi} out of 300")`,
            codeTitle: 'Python',
            options: [
              { text: '<code>Ram got total marks 219 out of 300</code>', correct: true },
              { text: '<code>Ram got total marks {english + maths + hindi} out of 300</code>' },
              { text: '<code>Ram got total marks 78 56 85 out of 300</code>' },
              { text: '<code>TypeError: can only concatenate str (not &quot;int&quot;) to str</code>' }
            ],
            answer: 'A',
            explain: 'f-string 的 <code>{}</code> 里可以放<strong>表达式</strong>：先算出 78 + 56 + 85 = 219，再插入字符串。B 是漏写前缀 <code>f</code> 的结果（那就是普通字符串，花括号原样输出）。C 以为花括号里只能放变量、而且会逐个打印。D 混淆了 f-string 与 <code>"marks " + 219</code>——后者才会因 str 与 int 相加而 <code>TypeError</code>。'
          },
          {
            label: '10',
            points: 3,
            kind: 'choice',
            prompt: 'In the PyTorch training loop, which order is correct for one mini-batch?',
            options: [
              { text: '<code>optimizer.step()</code> → <code>loss.backward()</code> → <code>optimizer.zero_grad()</code>' },
              { text: '<code>output = model(data)</code> → <code>loss = F.nll_loss(output, target)</code> → <code>loss.backward()</code> → <code>optimizer.step()</code>', correct: true },
              { text: '<code>loss.backward()</code> → <code>output = model(data)</code> → <code>optimizer.step()</code>' },
              { text: '<code>model.eval()</code> → <code>loss.backward()</code> → <code>output = model(data)</code>' }
            ],
            answer: 'B',
            explain: '一轮训练固定四步：前向 <code>output = model(data)</code> 得到预测 → 用 <code>F.nll_loss</code> 算损失 → <code>loss.backward()</code> 反向传播求每个参数的梯度 → <code>optimizer.step()</code> 按梯度更新参数；下一轮开始前用 <code>optimizer.zero_grad()</code> 清零（否则梯度会累加）。A 顺序反了：还没有梯度就 <code>step()</code>。C 先 <code>backward</code> 再前向根本不可能——<code>loss</code> 还不存在。D 训练阶段用 <code>model.eval()</code> 会关掉 dropout/BN 的训练行为，且顺序错乱；<code>eval()</code> 是测试阶段用的。'
          }
        ]
      },

      /* --------------------------------------------------------- Part II */
      {
        no: 2,
        points: 20,
        type: 'tf',
        intro: 'Part II · True / False (5 × 4 = 20 marks) · Choose True (T) or False (F) for each statement.',
        parts: [
          {
            label: '1',
            points: 4,
            kind: 'tf',
            prompt: 'In Java, a <code>finally</code> block is still executed if the <code>try</code> block executes a <code>return</code> statement.',
            options: [{ text: 'True (T)', correct: true }, { text: 'False (F)' }],
            answer: 'true',
            explain: '对。<code>finally</code> 在 <code>try</code> 块以任何方式离开时都会执行：正常结束、<code>return</code>、抛出异常、<code>break</code>/<code>continue</code> 跳出。典型用法就是“无论成功失败都要关流/关 socket”。唯一的例外是 JVM 被强制终止（如 <code>System.exit(0)</code> 或断电），那时进程直接结束，<code>finally</code> 也来不及跑。'
          },
          {
            label: '2',
            points: 4,
            kind: 'tf',
            prompt: 'Java supports multiple inheritance of classes, so <code>class C extends A, B</code> is legal.',
            options: [{ text: 'True (T)' }, { text: 'False (F)', correct: true }],
            answer: 'false',
            explain: '错。Java 的类只支持<strong>单继承</strong>（一个类只能有一个直接父类），<code>class C extends A, B</code> 是编译错误。原因就是课程材料里提到的歧义：若 A、B 有同名方法，C 调用时无法确定用哪个版本。作为补偿，Java 允许<strong>一个类实现多个接口</strong>（<code>implements A, B</code>），接口只规定“能做什么”，冲突时由实现类自己解决。'
          },
          {
            label: '3',
            points: 4,
            kind: 'tf',
            prompt: 'In a JavaFX application, <code>start(Stage primaryStage)</code> is called automatically by the JavaFX runtime (through <code>launch()</code>), and the programmer must call <code>primaryStage.show()</code> to make the window visible.',
            options: [{ text: 'True (T)', correct: true }, { text: 'False (F)' }],
            answer: 'true',
            explain: '对。带 <code>main()</code> 的启动类调用 <code>Application.launch(args)</code> 后，JavaFX 运行时创建 <code>Stage</code> 并<strong>自动</strong>在 JavaFX Application Thread 上调用 <code>start(primaryStage)</code>，不需要（也不应该）手动 <code>new</code> 一个 Application 再调 <code>start()</code>。窗口默认是隐藏的：必须在 <code>start()</code> 里把 <code>Scene</code> 设到 <code>primaryStage</code> 上，并调用 <code>primaryStage.show()</code>，界面才会出现。'
          },
          {
            label: '4',
            points: 4,
            kind: 'tf',
            prompt: 'In a Tkinter program, <code>root.after(100, update)</code> can be replaced by <code>while True: time.sleep(0.1); update()</code> without changing the behaviour.',
            options: [{ text: 'True (T)' }, { text: 'False (F)', correct: true }],
            answer: 'false',
            explain: '错。Tkinter 的界面在<strong>单线程</strong>的事件循环 <code>mainloop()</code> 里运行。写成 <code>while True</code> + <code>time.sleep()</code> 会一直占住主线程：事件循环得不到执行，窗口无法重绘、按钮点了没反应（“未响应”）。<code>after(ms, callback)</code> 只是把回调<strong>排进事件队列</strong>，时间到了由事件循环调用，两次调用之间界面仍然可交互。贪吃蛇的 <code>run_game()</code> 用 <code>self.after(100, self.run_game)</code> 自排下一次，正是这个原因。'
          },
          {
            label: '5',
            points: 4,
            kind: 'tf',
            prompt: 'In Python, after <code>p = Person("John", 36)</code>, you must explicitly call <code>p.__init__()</code> again to initialize the object.',
            options: [{ text: 'True (T)' }, { text: 'False (F)', correct: true }],
            answer: 'false',
            explain: '错。<code>__init__</code> 是构造过程的一部分：执行 <code>Person("John", 36)</code> 时 Python 先创建实例（<code>__new__</code>），再<strong>自动</strong>调用 <code>__init__(self, "John", 36)</code>，不需要、也不应该手动再调一次。手动调用只会把字段再赋一遍，还可能因为参数个数不对报错。需要显式调用父类构造器时写 <code>super().__init__(...)</code>，那是另一回事。'
          }
        ]
      },

      /* -------------------------------------------------------- Part III */
      {
        no: 3,
        points: 25,
        type: 'fill',
        intro: 'Part III · Fill in the Blanks (5 × 5 = 25 marks) · Write the missing keyword / expression in the blank. Spelling and order matter; the grader ignores extra spaces.',
        parts: [
          {
            label: '1',
            points: 5,
            kind: 'fill',
            prompt: 'Complete the keyword so that <code>Dog</code> inherits from <code>Animal</code>. (Write only what belongs in the blank.)',
            code:
`class Animal {
    void eat() { System.out.println("eating..."); }
}

class Dog ______ Animal {
    void bark() { System.out.println("barking..."); }
}`,
            answer: 'extends',
            accept: ['extends'],
            explain: '继承用关键字 <code>extends</code>：<code>class Dog extends Animal</code>，含义是 “Dog IS-A Animal”，Dog 直接复用 Animal 的 <code>eat()</code>，还能新增 <code>bark()</code>。接口用 <code>implements</code>（<code>class Dog implements Runnable</code>）；<code>super</code> 是调用父类构造器/方法时用的，不是继承声明关键字。'
          },
          {
            label: '2',
            points: 5,
            kind: 'fill',
            prompt: 'Complete the argument so that the new thread executes the <code>ClientHandler</code> that was just created for this client. (Write only what belongs in the blank.)',
            code:
`Socket socket = serverSocket.accept();
ClientHandler handler = new ClientHandler(socket);
Thread thread = new Thread(______);
thread.start();`,
            answer: 'handler',
            accept: ['handler'],
            explain: '<code>Thread</code> 的构造器接收一个 <code>Runnable</code>（或一个 <code>Runnable</code> 加线程名）。<code>ClientHandler</code> 实现了 <code>Runnable</code>，所以把 <code>handler</code> 传进去，<code>start()</code> 之后就会在新线程里执行它的 <code>run()</code>。注意不能写 <code>handler.run()</code>——那只是普通方法调用，仍会在当前线程同步执行，相当于没开线程。'
          },
          {
            label: '3',
            points: 5,
            kind: 'fill',
            prompt: 'Complete the stream so that the socket&rsquo;s <strong>bytes</strong> are converted into <strong>characters</strong> before buffering. (Write only the class name.)',
            code:
`BufferedReader reader = new BufferedReader(
        new ______(socket.getInputStream()));`,
            answer: 'InputStreamReader',
            accept: ['InputStreamReader'],
            explain: '三层各司其职：<code>socket.getInputStream()</code> 给字节流，<code>InputStreamReader</code> 是字节流到字符流的“桥”（按默认编码把字节解码成字符），<code>BufferedReader</code> 再加缓冲并提供 <code>readLine()</code>。注意不能直接 <code>new BufferedReader(socket.getInputStream())</code>：<code>BufferedReader</code> 的构造器只接受 <code>Reader</code>，<code>InputStream</code> 不是 <code>Reader</code>，编译不通过。'
          },
          {
            label: '4',
            points: 5,
            kind: 'fill',
            prompt: 'This is the frame callback of the Snake game. Complete the argument that schedules the <strong>next</strong> frame 100 ms later. (Write only what belongs in the blank.)',
            code:
`def run_game(self):
    self.move_snake()
    self.after(100, ______)`,
            codeTitle: 'Python',
            answer: 'self.run_game',
            accept: ['self.run_game'],
            explain: '<code>after(ms, callback)</code> 把回调排进 Tk 事件队列，100 ms 后由 <code>mainloop()</code> 调用。要形成“每 100 ms 一帧”的循环，回调必须再排自己一次，所以写 <code>self.run_game</code>（传函数对象，不能加括号——<code>self.run_game()</code> 会立刻递归调用，直接把栈打爆）。写成 <code>run_game</code>（不带 self）会找不到名字。'
          },
          {
            label: '5',
            points: 5,
            kind: 'fill',
            prompt: 'Complete the call that runs the <strong>parent</strong> constructor before adding the child&rsquo;s own field. (Write only what belongs in the blank.)',
            code:
`class Person:
    def __init__(self, fname, lname):
        self.firstname = fname
        self.lastname = lname

class Student(Person):
    def __init__(self, fname, lname):
        ______(fname, lname)
        self.graduationyear = 2026`,
            codeTitle: 'Python',
            answer: 'super().__init__',
            accept: ['super().__init__'],
            explain: 'Python 3 里 <code>super()</code> 返回父类的代理对象，<code>super().__init__(fname, lname)</code> 就是调用 <code>Person.__init__</code>，把 <code>firstname</code>/<code>lastname</code> 设好。子类一旦定义了自己的 <code>__init__</code>，就<strong>必须显式</strong>调用父类的，否则父类那段初始化被完全跳过（访问 <code>self.firstname</code> 会 <code>AttributeError</code>）。课程材料的旧写法 <code>people.__init__(self, n, a, w)</code> 等价，但 <code>super()</code> 更通用。'
          }
        ]
      },

      /* --------------------------------------------------------- Part IV */
      {
        no: 4,
        points: 25,
        type: 'short',
        intro: 'Part IV · Short Answer &amp; Programming (25 marks) · Write your answers in the spaces below.',
        parts: [
          {
            label: '4(a)',
            points: 10,
            kind: 'keywords',
            prompt: 'In Project 1 (Java Chat Zoom), a message typed by <strong>Client A</strong> must reach Client B and Client C. Describe the complete path of this message: name the classes involved on both the client and the server side, say which thread executes each step, and explain what would go wrong if the server handled all clients on a single thread. A short flow diagram (text or arrows) is welcome. (10 marks)',
            keywords: [
              ['client'],
              ['bufferedwriter', 'printwriter', 'writer.write', 'flush'],
              ['serversocket', 'accept'],
              ['clienthandler'],
              ['clienthandlers', 'arraylist', 'broadcast'],
              ['thread', 'runnable', 'start()'],
              ['readline', '阻塞', 'block'],
              ['main thread', 'main()', '主线程', 'accept loop', 'single thread', '单线程']
            ],
            answer:
`Client A（主线程）：sendMessage() 在 while (socket.isConnected()) 里从键盘读一行，
  bufferedWriter.write(username + ": " + msg); bufferedWriter.flush();
  → 字节经 Socket 的输出流发到服务器。

Server（主线程）：startServer() 的 while (!serverSocket.isClosed()) 里
  Socket socket = serverSocket.accept();          // 为 A 建立连接
  ClientHandler handler = new ClientHandler(socket);
  clientHandlers.add(handler);                    // 共享的 ArrayList
  new Thread(handler).start();                    // 每个客户端一个子线程

Server（A 的子线程）：ClientHandler.run()
  while (socket.isConnected()) {
      msg = bufferedReader.readLine();            // 阻塞等待 A 的消息
      broadcastMessage(msg);                      // 遍历 clientHandlers
  }
  broadcastMessage()：for (ClientHandler h : clientHandlers) {
      h.writer.write(msg); h.writer.newLine(); h.writer.flush();
  }

Client B / C：各自的 listenForMessage() 运行在 new Thread(...) 里，
  readLine() 读到服务器广播的消息并打印。`,
            explain: '这条链上有三层“阻塞点”，每一层都必须靠线程解决：①服务器主线程若直接在 <code>accept()</code> 返回的 socket 上 <code>readLine()</code>，它就被这个客户端占住，无法再 <code>accept()</code> 第二个客户端——所以要把每个 <code>ClientHandler</code> 放进新线程；②客户端若在主线程里循环 <code>readLine()</code> 等服务器消息，就无法同时从键盘读输入——所以 <code>listenForMessage()</code> 另开线程；③广播发生在 A 的 handler 子线程里，遍历共享的 <code>clientHandlers</code> 逐个写。给分点：客户端写入并 flush（2 分）、服务器 accept 并为每个客户端建 ClientHandler（2 分）、每个 handler 由独立线程执行 run（2 分）、readLine 阻塞 + broadcast 遍历所有 handler（2 分）、单线程会导致 accept/其他客户端被阻塞（2 分）。'
          },
          {
            label: '4(b)',
            points: 15,
            kind: 'keywords',
            prompt: 'Write the <code>ClientHandler</code> class of Project 1. Requirements: (1) it <strong>implements Runnable</strong>; (2) it keeps a <code>BufferedReader</code> built from the client&rsquo;s input stream; (3) it adds itself to the shared <code>public static ArrayList&lt;ClientHandler&gt; clientHandlers</code>; (4) its <code>run()</code> reads lines from the client until the connection ends and broadcasts each line to every connected client. Assume a <code>BufferedWriter writer</code> field for writing to this client already exists and is initialized. Include the necessary exception handling. (15 marks)',
            keywords: [
              'implements runnable',
              'bufferedreader',
              'inputstreamreader',
              'readline',
              'null',
              ['clienthandlers.add', 'add(this)'],
              ['for (clienthandler', 'for(clienthandler', 'for each', 'foreach'],
              ['writer.write', 'out.write', 'write('],
              'flush',
              ['catch', 'try']
            ],
            answer:
`public class ClientHandler implements Runnable {
    private Socket socket;
    private BufferedReader bufferedReader;
    private BufferedWriter writer;      // already initialized for this client
    private String clientUsername;

    public ClientHandler(Socket socket) throws IOException {
        this.socket = socket;
        this.bufferedReader = new BufferedReader(
                new InputStreamReader(socket.getInputStream()));
        this.clientUsername = bufferedReader.readLine();
        clientHandlers.add(this);
        broadcastMessage(clientUsername + " has joined the chat");
    }

    @Override
    public void run() {
        String messageFromClient;
        try {
            while (socket.isConnected()) {
                messageFromClient = bufferedReader.readLine();
                if (messageFromClient == null) break;     // peer closed
                broadcastMessage(clientUsername + ": " + messageFromClient);
            }
        } catch (IOException e) {
            // client disconnected: remove from the list and close resources
        }
    }

    public static void broadcastMessage(String messageToSend) {
        for (ClientHandler handler : clientHandlers) {
            try {
                handler.writer.write(messageToSend);
                handler.writer.newLine();
                handler.writer.flush();
            } catch (IOException e) {
                // one broken client must not kill the broadcast
            }
        }
    }
}`,
            explain: '给分点（15 分）：<code>implements Runnable</code> 与 <code>@Override run()</code>（2）；构造器用 <code>InputStreamReader</code> 桥接 <code>getInputStream()</code> 再包 <code>BufferedReader</code>（2）；读第一行作为用户名并 <code>clientHandlers.add(this)</code>（2）；<code>run()</code> 里 <code>while (socket.isConnected())</code> + <code>readLine()</code>，并用 <code>null</code> 判断对端关闭（3）；<code>broadcastMessage</code> 用 for 遍历所有 handler 逐个 <code>write</code> + <code>newLine</code> + <code>flush</code>（3）；<code>run()</code> 里 try/catch <code>IOException</code>（方法签名不能抛受检异常），单个客户端断开不能中断广播（3）。常见扣分：把 <code>run()</code> 写成 <code>while (true)</code> 且不判 <code>null</code>（断开后空转、CPU 飙高）；忘记 <code>flush()</code>（消息卡在缓冲区，别人收不到）；<code>broadcastMessage</code> 里没有 try/catch（一个断线客户端让整个广播中断）。'
          }
        ]
      }
    ]
  };

  /* ================================================================
   * F2 · Mock Final 2（Java 侧重：约 77 分 Java / 23 分 Python）
   * ================================================================ */
  var F2 = {
    id: 'F2',
    title: 'Mock Final 2',
    style: 'CSC1004 style',
    subtitle: 'Java-focused · OOP · I/O · Socket · Threads · JavaFX',
    date: 'Term 2, 2026',
    minutes: 100,
    totalScore: 100,
    summary: 'Java 侧重卷（Java ≈ 77 分 / Python ≈ 23 分）：Part I 7 道 Java + 3 道 Python 选择，Part II 4 道 Java + 1 道 Python 判断，Part III 3 道 Java + 2 道 Python 填空，Part IV 全部是 Java（JavaFX 事件机制 + 五子棋胜负判定）。适合在复习完 ch03–ch14 后检验 Java 主线的掌握程度。',
    instructions: [
      'This is a closed-book examination. No notes, textbooks, calculators or electronic devices are allowed.',
      'Total time: 100 minutes, plus 10 minutes reading time. Total marks: 100.',
      'Part I 30 marks · Part II 20 marks · Part III 25 marks · Part IV 25 marks.',
      'For multiple-choice questions, choose ONE best answer. There is no penalty for guessing.',
      'For Part IV, marks are given for the key points; write concisely and clearly.',
      '假定代码忽略未给出的 <code>import</code>；Java 按课程材料（JDK 17+ / JavaFX 21）理解。'
    ],
    questions: [
      /* ---------------------------------------------------------- Part I */
      {
        no: 1,
        points: 30,
        type: 'mcq',
        intro: 'Part I · Multiple Choice (10 × 3 = 30 marks)',
        parts: [
          {
            label: '1',
            points: 3,
            kind: 'choice',
            prompt: 'Which statement about a subclass constructor is correct?',
            options: [
              { text: 'A call to <code>super(...)</code> must be the first statement in the constructor.', correct: true },
              { text: 'A subclass constructor must always write <code>super(...)</code> explicitly.' },
              { text: '<code>this(...)</code> and <code>super(...)</code> may both appear in the same constructor, in any order.' },
              { text: 'A subclass constructor cannot call a superclass constructor that takes parameters.' }
            ],
            answer: 'A',
            explain: '显式 <code>super(...)</code> 必须是构造器的<strong>第一条语句</strong>（和 <code>this(...)</code> 一样），因为父类部分必须先初始化完，子类字段才能依赖它。B 错：只有当父类<strong>没有无参构造器</strong>时才必须显式写，否则编译器自动插入无参 <code>super()</code>。C 错：两者都只能出现在第一句，且互斥（一个构造器不能既调父类构造器又调本类另一个构造器）。D 错：<code>super(name, age)</code> 正是调用带参父类构造器的标准写法。'
          },
          {
            label: '2',
            points: 3,
            kind: 'choice',
            prompt: 'Which method of a superclass can <strong>NOT</strong> be overridden by a subclass?',
            options: [
              { text: 'a <code>public</code> instance method' },
              { text: 'a <code>protected</code> instance method' },
              { text: 'a <code>private</code> instance method', correct: true },
              { text: 'an <code>abstract</code> method' }
            ],
            answer: 'C',
            explain: '<code>private</code> 方法对子类<strong>不可见</strong>，不参与继承；子类里写一个同名同参的方法只是“碰巧同名的新方法”，不是重写，加 <code>@Override</code> 会编译报错。<code>public</code>/<code>protected</code> 方法可以重写（重写时访问权限不能收窄）。<code>abstract</code> 方法不但能重写，非抽象子类还<strong>必须</strong>实现它。补充：<code>static</code> 方法是“隐藏”（hiding）而非重写，<code>final</code> 方法则禁止重写。'
          },
          {
            label: '3',
            points: 3,
            kind: 'choice',
            prompt: 'What is printed?',
            code:
`class Animal { public void speak() { System.out.print("... "); } }
class Dog extends Animal { public void speak() { System.out.print("Woof "); } }
class Cat extends Animal { public void speak() { System.out.print("Meow "); } }

public class Main {
    public static void main(String[] args) {
        Animal[] zoo = { new Dog(), new Cat() };
        for (Animal a : zoo) a.speak();
    }
}`,
            options: [
              { text: '<code>... ... </code>' },
              { text: '<code>Woof Meow </code>', correct: true },
              { text: '<code>Woof Woof </code>' },
              { text: 'Compile error: an <code>Animal[]</code> cannot hold <code>Dog</code> objects' }
            ],
            answer: 'B',
            explain: '数组元素的<strong>静态类型</strong>是 <code>Animal</code>，但实际对象是 <code>Dog</code> 和 <code>Cat</code>；<code>a.speak()</code> 是虚方法调用，JVM 在运行时按对象的<strong>真实类型</strong>选择版本，于是输出 <code>Woof Meow</code>。A 是“按引用类型调用”的误解，忽略了动态绑定。C 只看了第一个元素。D 错：<code>Dog</code> IS-A <code>Animal</code>，向上转型放进 <code>Animal[]</code> 完全合法，这也正是多态的用处。'
          },
          {
            label: '4',
            points: 3,
            kind: 'choice',
            prompt: 'Which statement about Java interfaces is correct?',
            options: [
              { text: 'An interface can declare instance fields that every implementing object owns.' },
              { text: 'A class can implement several interfaces in one <code>implements</code> list.', correct: true },
              { text: 'All methods in an interface must be <code>static</code>.' },
              { text: 'You can create an object directly with <code>new Comparable();</code>.' }
            ],
            answer: 'B',
            explain: '<code>class C implements A, B, C2</code> 合法，这正是 Java 用来弥补“类只能单继承”的手段：一个类只能有一个父类，但可以实现任意多个接口。A 错：接口里的字段隐式是 <code>public static final</code>（常量），不存在“每个对象各自一份”的实例字段。C 错：接口方法默认是 <code>public abstract</code>；Java 8+ 还允许 <code>default</code> 和 <code>static</code> 方法，但不是“必须 static”。D 错：接口不能实例化，<code>new Comparable()</code> 编译错误；必须写成匿名类 <code>new Comparable&lt;...&gt;() { ... }</code> 或 lambda（函数式接口）。'
          },
          {
            label: '5',
            points: 3,
            kind: 'choice',
            prompt: 'The client builds its writer as <code>new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()))</code>. Why is the <code>BufferedWriter</code> layer useful?',
            options: [
              { text: 'It converts bytes into characters.' },
              { text: 'It adds a buffer that reduces the number of physical writes, and it provides <code>newLine()</code>.', correct: true },
              { text: 'It flushes the stream automatically after every <code>write()</code>.' },
              { text: 'It compresses the text before sending it over the network.' }
            ],
            answer: 'B',
            explain: '三层各司其职：<code>getOutputStream()</code> 给字节流；<code>OutputStreamWriter</code> 把字符按编码转成字节（A 描述的是它，不是 <code>BufferedWriter</code>）；<code>BufferedWriter</code> 加缓冲、减少系统调用，并提供 <code>newLine()</code> 写平台换行符。C 错：<code>BufferedWriter</code> <strong>不会</strong>自动 flush，必须显式 <code>flush()</code> 或 <code>close()</code>，否则消息可能一直卡在缓冲区里。D 错：Java 标准流不做压缩。'
          },
          {
            label: '6',
            points: 3,
            kind: 'choice',
            prompt: 'A running thread executes <code>Thread.sleep(1000);</code>. Which state is it in during that second?',
            options: [
              { text: '<code>NEW</code>' },
              { text: '<code>RUNNABLE</code>' },
              { text: '<code>TIMED_WAITING</code>', correct: true },
              { text: '<code>TERMINATED</code>' }
            ],
            answer: 'C',
            explain: '<code>sleep(ms)</code> 让线程进入<strong>限时等待</strong>（<code>TIMED_WAITING</code>），时间到或被 <code>interrupt()</code> 后回到 <code>RUNNABLE</code>。A：<code>NEW</code> 是创建了但还没 <code>start()</code>。B：<code>RUNNABLE</code> 是“可运行/正在运行”，睡了就不在运行队列里。D：<code>TERMINATED</code> 是 <code>run()</code> 结束或异常终止。对比记忆：<code>wait()</code>（无超时）→ <code>WAITING</code>，等锁 → <code>BLOCKED</code>，<code>sleep(n)</code>/<code>join(n)</code> → <code>TIMED_WAITING</code>。'
          },
          {
            label: '7',
            points: 3,
            kind: 'choice',
            prompt: 'In Project 1, <code>startServer()</code> does <code>Socket socket = serverSocket.accept(); ClientHandler h = new ClientHandler(socket); new Thread(h).start();</code>. Why is a new thread needed for every client?',
            options: [
              { text: 'Because <code>accept()</code> can only be called once per <code>ServerSocket</code>.' },
              { text: 'Because the main thread must go back to <code>accept()</code> and keep serving new clients while existing clients are handled concurrently.', correct: true },
              { text: 'Because a <code>Socket</code> can only be read from a thread other than the one that created it.' },
              { text: 'Because each thread gives its client a different port number.' }
            ],
            answer: 'B',
            explain: '<code>accept()</code> 返回后，如果主线程直接在这个 socket 上 <code>readLine()</code>，它就被这个客户端<strong>阻塞</strong>住，无法回到 <code>accept()</code> 接下一个连接——聊天室就只能有一个用户。把每个 <code>ClientHandler</code> 交给新线程，主线程继续 <code>accept()</code>，多个客户端就能同时收发。A 错：<code>ServerSocket</code> 可以在 <code>while</code> 里反复 <code>accept()</code>。C 错：没有这种限制，任何线程都能读写 socket。D 错：端口在连接建立时就定了，线程不会改变端口。'
          },
          {
            label: '8',
            points: 3,
            kind: 'choice',
            prompt: 'What is printed by the following Python program?',
            code:
`class Dog:
    kind = "canine"

    def __init__(self, name):
        self.name = name

d = Dog("Rex")
print(d.kind, d.name)`,
            codeTitle: 'Python',
            options: [
              { text: '<code>canine Rex</code>', correct: true },
              { text: "<code>AttributeError: 'Dog' object has no attribute 'kind'</code>" },
              { text: '<code>Rex canine</code>' },
              { text: '<code>canine</code> only — <code>name</code> is private' }
            ],
            answer: 'A',
            explain: '<code>kind</code> 是<strong>类属性</strong>，通过实例读取时会先在实例字典里找，找不到再找类，所以 <code>d.kind</code> 得到 <code>canine</code>；<code>name</code> 是构造器里创建的<strong>实例属性</strong>，值为 <code>Rex</code>。B 是“类属性不能被实例访问”的误解。C 顺序反了（<code>print</code> 按参数顺序输出）。D 错：<code>self.name</code> 是普通公有属性；带两个下划线的才是“私有”。'
          },
          {
            label: '9',
            points: 3,
            kind: 'choice',
            prompt: 'What happens when this Tkinter program runs?',
            code:
`from tkinter import Tk, mainloop

root = Tk()
root.after(5000, root.destroy)
mainloop()`,
            codeTitle: 'Python',
            options: [
              { text: 'The window is destroyed immediately, before it is even shown.' },
              { text: 'The window closes about 5 seconds after <code>after()</code> is called.', correct: true },
              { text: '<code>root.destroy</code> is called once every 5 seconds, forever.' },
              { text: 'The program sleeps for 5 seconds, blocking the event loop, and then exits.' }
            ],
            answer: 'B',
            explain: '<code>after(ms, callback)</code> 把回调<strong>排进事件队列</strong>，由 <code>mainloop()</code> 在约 5000 ms 后调用 <code>root.destroy</code>，窗口关闭、<code>mainloop()</code> 返回，程序结束。C 混淆了 <code>after</code> 与“定时器重复触发”：要重复必须在回调里再调用一次 <code>after</code>（贪吃蛇的 <code>run_game</code> 就是这么写的）。D 混淆了 <code>after</code> 与 <code>time.sleep</code>：<code>after</code> 不阻塞，等待期间界面仍然可交互。A 错：<code>after</code> 是“5 秒后”，不是立即。'
          },
          {
            label: '10',
            points: 3,
            kind: 'choice',
            prompt: 'What is printed?',
            code:
`class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __str__(self):
        return f"{self.name}({self.age})"

p1 = Person("John", 36)
print(p1)`,
            codeTitle: 'Python',
            options: [
              { text: '<code>&lt;__main__.Person object at 0x...&gt;</code>' },
              { text: '<code>John(36)</code>', correct: true },
              { text: "<code>{'name': 'John', 'age': 36}</code>" },
              { text: '<code>None</code>' }
            ],
            answer: 'B',
            explain: '<code>print(obj)</code> 会调用 <code>str(obj)</code>；类里定义了 <code>__str__</code>，就返回它给的字符串，所以打印 <code>John(36)</code>。A 是<strong>没有</strong>定义 <code>__str__</code> 时的默认输出（类名 + 地址）。C 是字典的打印格式，Python 不会自动把对象转成字典。D 错：<code>__str__</code> 必须返回字符串，返回 <code>None</code> 会抛 <code>TypeError</code>。'
          }
        ]
      },

      /* --------------------------------------------------------- Part II */
      {
        no: 2,
        points: 20,
        type: 'tf',
        intro: 'Part II · True / False (5 × 4 = 20 marks) · Choose True (T) or False (F) for each statement.',
        parts: [
          {
            label: '1',
            points: 4,
            kind: 'tf',
            prompt: 'When the peer closes the connection, <code>BufferedReader.readLine()</code> returns an empty string <code>""</code>.',
            options: [{ text: 'True (T)' }, { text: 'False (F)', correct: true }],
            answer: 'false',
            explain: '错。流结束（对端关闭）时 <code>readLine()</code> 返回 <code>null</code>，不是 <code>""</code>。<code>""</code> 表示“读到了一个空行”，即输入里确实有一个换行符。所以标准循环是 <code>while ((line = reader.readLine()) != null)</code>；若写成 <code>while (!line.isEmpty())</code> 会先把 <code>null</code> 拿去调方法，抛 <code>NullPointerException</code>。'
          },
          {
            label: '2',
            points: 4,
            kind: 'tf',
            prompt: 'A subclass constructor always calls a superclass constructor, either explicitly or implicitly.',
            options: [{ text: 'True (T)', correct: true }, { text: 'False (F)' }],
            answer: 'true',
            explain: '对。子类构造器的第一条语句要么是显式 <code>super(...)</code>，要么是 <code>this(...)</code>（转调本类另一个构造器，而那一个最终会走到 <code>super(...)</code>）；两者都没写时，编译器自动插入无参 <code>super();</code>。只有父类没有无参构造器且子类没显式调用时，才会编译报错——报的正是“父类构造器无法调用”。'
          },
          {
            label: '3',
            points: 4,
            kind: 'tf',
            prompt: 'In Java, calling <code>run()</code> on a <code>Thread</code> object starts a new thread, just like calling <code>start()</code>.',
            options: [{ text: 'True (T)' }, { text: 'False (F)', correct: true }],
            answer: 'false',
            explain: '错。<code>run()</code> 只是一个普通方法，直接调用会在<strong>当前线程</strong>同步执行，没有任何新线程被创建；<code>start()</code> 才会让 JVM 创建新线程并在其中调用 <code>run()</code>。两者都能“跑起来”，但并发语义完全不同：聊天室客户端里把 <code>listenForMessage()</code> 写成 <code>new Thread(r).run()</code> 会让界面直接卡死（读取阻塞主线程），只有 <code>start()</code> 才对。'
          },
          {
            label: '4',
            points: 4,
            kind: 'tf',
            prompt: '<code>equals()</code> compares the characters of two <code>String</code> objects, while <code>==</code> compares whether the two references point to the same object.',
            options: [{ text: 'True (T)', correct: true }, { text: 'False (F)' }],
            answer: 'true',
            explain: '对。<code>String</code> 重写了 <code>equals()</code>，逐字符比较内容；<code>==</code> 比较引用（是否同一个对象）。所以 <code>new String("a").equals("a")</code> 为 true，而 <code>new String("a") == "a"</code> 为 false（后者在堆上，前者在字符串常量池）。聊天室里比较用户名、比较命令关键字，一律用 <code>equals()</code>，不要用 <code>==</code>。'
          },
          {
            label: '5',
            points: 4,
            kind: 'tf',
            prompt: 'In Python, if a subclass defines its own <code>__init__</code> without calling <code>super().__init__(...)</code>, the parent&rsquo;s <code>__init__</code> is still executed automatically.',
            options: [{ text: 'True (T)' }, { text: 'False (F)', correct: true }],
            answer: 'false',
            explain: '错。子类一旦定义了自己的 <code>__init__</code>，它就<strong>覆盖</strong>了父类的版本；父类构造器不会自动执行，必须显式 <code>super().__init__(...)</code>（或旧写法 <code>Person.__init__(self, ...)</code>）。漏掉这一步时，父类里设置的字段根本不存在，后面访问就 <code>AttributeError</code>。这与 Java 的“构造器链自动向上调用”正好相反，是很爱考的对比点。'
          }
        ]
      },

      /* -------------------------------------------------------- Part III */
      {
        no: 3,
        points: 25,
        type: 'fill',
        intro: 'Part III · Fill in the Blanks (5 × 5 = 25 marks) · Write the missing keyword / expression in the blank. Spelling and order matter; the grader ignores extra spaces.',
        parts: [
          {
            label: '1',
            points: 5,
            kind: 'fill',
            prompt: 'Complete the keyword so that a <code>ClientHandler</code> object can be passed to <code>new Thread(...)</code>. (Write only what belongs in the blank.)',
            code:
`public class ClientHandler ______ Runnable {
    @Override
    public void run() {
        // read messages from this client and broadcast them
    }
}`,
            answer: 'implements',
            accept: ['implements'],
            explain: '<code>Thread</code> 的构造器只接受 <code>Runnable</code>，所以让 <code>ClientHandler</code> “是一个 Runnable”用 <code>implements Runnable</code>。注意区分类与接口：继承类用 <code>extends</code>（<code>class Dog extends Animal</code>），实现接口用 <code>implements</code>；而且一个类可以 <code>implements A, B</code>，但只能 <code>extends</code> 一个类。'
          },
          {
            label: '2',
            points: 5,
            kind: 'fill',
            prompt: 'Complete the call that makes the JavaFX window visible. (Write only the method name.)',
            code:
`Scene scene = new Scene(root, 800, 600);
primaryStage.setScene(scene);
primaryStage.______();`,
            answer: 'show',
            accept: ['show'],
            explain: 'JavaFX 的六步里，最后一步是 <code>primaryStage.show();</code>——不调用它，场景已经装好但窗口仍然是隐藏的，什么都看不到。注意顺序：先 <code>setScene(scene)</code> 再 <code>show()</code>；<code>start()</code> 不是“显示窗口”的方法，它是 <code>Application</code> 的生命周期入口，由 <code>launch()</code> 在 JavaFX Application Thread 上调用。'
          },
          {
            label: '3',
            points: 5,
            kind: 'fill',
            prompt: 'Complete the call that actually pushes the buffered characters out to the client. (Write only the method name.)',
            code:
`for (ClientHandler handler : clientHandlers) {
    handler.writer.write(messageToSend);
    handler.writer.newLine();
    handler.writer.______();      // send it now
}`,
            answer: 'flush',
            accept: ['flush'],
            explain: '<code>BufferedWriter</code> 把字符攒在缓冲区里，<code>write()</code> 只是写进内存缓冲区；必须 <code>flush()</code> 才会真正写到底层 socket。少了它，消息会在缓冲区里“憋着”，直到缓冲区满或流关闭（<code>close()</code> 也会 flush）才发出去，聊天室里表现为“对方半天收不到消息，退出程序才一起收到”。'
          },
          {
            label: '4',
            points: 5,
            kind: 'fill',
            prompt: 'Complete the name of the constructor in the Python class. (Write only what belongs in the blank.)',
            code:
`class Person:
    def ______(self, name, age):
        self.name = name
        self.age = age

p1 = Person("John", 36)`,
            codeTitle: 'Python',
            answer: '__init__',
            accept: ['__init__'],
            explain: '构造器固定叫 <code>__init__</code>（前后各两个下划线），创建对象 <code>Person("John", 36)</code> 时自动调用：<code>self</code> 是新建的实例，后面是实参。<code>self</code> 只是约定俗成的名字（写 <code>this</code> 也能跑，但不推荐），且必须是第一个参数。注意不要写成 <code>__int__</code> 或 <code>_init_</code>，那样它只是普通方法，创建对象时不会执行。'
          },
          {
            label: '5',
            points: 5,
            kind: 'fill',
            prompt: 'Complete the Tkinter geometry method that adds the button to the window. (Write only the method name.)',
            code:
`import tkinter as tk

root = tk.Tk()
root.geometry("200x100")
button = tk.Button(root, text="Hello")
button.______()
root.mainloop()`,
            codeTitle: 'Python',
            answer: 'pack',
            accept: ['pack'],
            explain: '创建 widget 不会自动显示，必须调用几何管理器：<code>pack()</code>（按行/列堆叠）、<code>grid()</code>（二维表格，用 <code>row=</code>/<code>column=</code>）或 <code>place()</code>（绝对/相对坐标）。这里只有一个按钮，用最简单的 <code>pack()</code>。注意：同一个容器里只能选一种，混用会抛 <code>TclError</code>。'
          }
        ]
      },

      /* --------------------------------------------------------- Part IV */
      {
        no: 4,
        points: 25,
        type: 'short',
        intro: 'Part IV · Short Answer &amp; Programming (25 marks) · Write your answers in the spaces below.',
        parts: [
          {
            label: '4(a)',
            points: 10,
            kind: 'keywords',
            prompt: 'Explain how JavaFX delivers a mouse click from the window down to a <code>Button</code> and back. Your answer must mention <strong>EventFilter</strong> (capturing) and <strong>EventHandler</strong> (bubbling), the roles of <strong>Event Source</strong> / <strong>Event Target</strong>, and where <code>button.setOnAction(...)</code> fits in. Draw the sequence in words or ASCII if it helps. (10 marks)',
            keywords: [
              ['captur'],
              ['bubbl'],
              ['eventfilter', 'addeventfilter', 'filter'],
              ['eventhandler', 'addeventhandler', 'handler'],
              ['root', 'parent', 'scene'],
              ['target', 'source'],
              ['setonaction', 'actionevent'],
              ['consume']
            ],
            answer:
`一次点击的事件分发走两遍 scene graph：

① 捕获（capturing）：从根节点（Scene 的 root，例如 StackPane）
   → 一层层向下 → 到目标节点（被点击的 Button）。
   这条路径上通过 addEventFilter(...) 注册的 EventFilter 按
   “根 → 目标”的顺序执行。

② 冒泡（bubbling）：从目标节点 → 一层层向上 → 回到根节点。
   这条路径上通过 addEventHandler(...) 注册的 EventHandler 按
   “目标 → 根”的顺序执行。

事件对象（MouseEvent）携带 source（最初产生事件的节点）、
target（事件最终送达的节点）与事件类型。

button.setOnAction(e -> ...) 本质上是给这个 Button 注册一个
ActionEvent 的 EventHandler，所以它在目标节点处（冒泡阶段）执行。
若要在父容器里“先”看到事件，用 addEventFilter；
在任意一个回调里调用 e.consume() 可以终止后续传递。`,
            explain: 'JavaFX 事件模型的关键是“两遍遍历”：先捕获（自上而下，Filter 先看到），再冒泡（自下而上，Handler 后看到）。给分点：说清捕获方向（根→目标）与 Filter（2 分）；说清冒泡方向（目标→根）与 Handler（2 分）；指明 <code>setOnAction</code> 注册的是 ActionEvent 的 handler、在目标处执行（2 分）；区分 source 与 target（2 分）；提到 <code>consume()</code> 能截断后续传递（2 分）。常见错误：把 Filter 说成“冒泡阶段执行”，或以为 <code>setOnAction</code> 是过滤器；实际上同一个事件会先经过所有 Filter（捕获），再经过所有 Handler（冒泡）。'
          },
          {
            label: '4(b)',
            points: 15,
            kind: 'keywords',
            prompt: 'Gomoku (Five in a Row). The board is <code>int[][] board</code> of size 15 × 15, where 0 = empty, 1 = black and 2 = white. A stone has just been placed at <code>(row, col)</code>. Write a Java method <code>checkWin(int row, int col, int player)</code> that returns <code>true</code> if this move completes <strong>five or more</strong> stones in a row horizontally, vertically, or diagonally. You may write a helper method. (15 marks)',
            keywords: [
              ['board.length', 'bounds', 'board[0].length', '越界'],
              ['{{0,1}', '{{0, 1}', 'dirs', 'directions', '四个方向'],
              ['count', 'streak', 'consecutive', '连续'],
              ['while', 'for'],
              ['both direction', '两个方向', 'opposite', '-dr', '-d[0]', '反向'],
              ['>=5', '>= 5', '==5', '五颗', '5 in a row'],
              ['return true'],
              ['return false']
            ],
            answer:
`private boolean checkWin(int row, int col, int player) {
    // 4 条线：横、竖、主对角线、副对角线；每条线向正反两个方向数
    int[][] dirs = {{0, 1}, {1, 0}, {1, 1}, {1, -1}};
    for (int[] d : dirs) {
        int count = 1;                                    // 刚放下的这颗
        count += countDirection(row, col, d[0], d[1], player);
        count += countDirection(row, col, -d[0], -d[1], player);
        if (count >= 5) return true;
    }
    return false;
}

private int countDirection(int row, int col, int dr, int dc, int player) {
    int count = 0;
    int r = row + dr;
    int c = col + dc;
    while (r >= 0 && r < board.length && c >= 0 && c < board[0].length
           && board[r][c] == player) {
        count++;
        r += dr;
        c += dc;
    }
    return count;
}`,
            explain: '给分点（15 分）：只在刚落子的位置附近检查而不是遍历整个棋盘（2）；四条方向线（横、竖、两条对角线）用循环统一处理（3）；从该点沿正、反两个方向分别计数（3）；每一步先做边界检查 <code>r &gt;= 0 &amp;&amp; r &lt; board.length &amp;&amp; c &gt;= 0 &amp;&amp; c &lt; board[0].length</code>（2）；只统计 <code>board[r][c] == player</code> 的连续棋子（2）；<code>count &gt;= 5</code> 即返回 true，循环结束返回 false（3）。常见扣分：只往一个方向数（漏掉“落子补齐中间空档”的经典反例）；把方向写成 8 个却只累加单方向，导致长连被漏判；<code>count</code> 初始为 0 而不是 1；忘了副对角线方向是 <code>{1, -1}</code>。写成不用 helper 的单方法版本同样满分。'
          }
        ]
      }
    ]
  };

  /* ================================================================
   * F3 · Mock Final 3（Python 侧重：约 70 分 Python + PyTorch / 30 分 Java）
   * ================================================================ */
  var F3 = {
    id: 'F3',
    title: 'Mock Final 3',
    style: 'CSC1004 style',
    subtitle: 'Python-focused · Tkinter · Snake · PyTorch pipeline',
    date: 'Term 2, 2026',
    minutes: 100,
    totalScore: 100,
    summary: 'Python 侧重卷（Python ≈ 70 分 / Java ≈ 30 分）：Part I 6 道 Python + 4 道 Java 选择，Part II 3 道 Python + 2 道 Java 判断，Part III 3 道 Python + 2 道 Java 填空，Part IV 是 PyTorch 训练流程简答 + 贪吃蛇 move_snake 编程。适合在写完 Python 项目、复习完 ch15–ch19 后做。',
    instructions: [
      'This is a closed-book examination. No notes, textbooks, calculators or electronic devices are allowed.',
      'Total time: 100 minutes, plus 10 minutes reading time. Total marks: 100.',
      'Part I 30 marks · Part II 20 marks · Part III 25 marks · Part IV 25 marks.',
      'For multiple-choice questions, choose ONE best answer. There is no penalty for guessing.',
      'For Part IV, marks are given for the key points; write concisely and clearly.',
      '假定代码忽略未给出的 <code>import</code>；Python 按课程材料（Python 3 / Tkinter / PyTorch）理解。'
    ],
    questions: [
      /* ---------------------------------------------------------- Part I */
      {
        no: 1,
        points: 30,
        type: 'mcq',
        intro: 'Part I · Multiple Choice (10 × 3 = 30 marks)',
        parts: [
          {
            label: '1',
            points: 3,
            kind: 'choice',
            prompt: 'What is printed by the following Python program?',
            code: 'print(bool(0), bool(""), bool([]), bool("False"))',
            codeTitle: 'Python',
            options: [
              { text: '<code>False False False True</code>', correct: true },
              { text: '<code>False False False False</code>' },
              { text: '<code>True True True True</code>' },
              { text: '<code>False False False &quot;False&quot;</code>' }
            ],
            answer: 'A',
            explain: 'Python 里 <code>0</code>、空字符串 <code>""</code>、空列表 <code>[]</code> 都是假值；而<strong>非空字符串</strong> <code>"False"</code> 是真值——内容写着 “False” 完全不影响真假判断，只要长度不为 0 就为 True。B 错在把字符串 "False" 当成了布尔 False；C 错在以为有内容的东西都是 True（0 和空容器不是）；D 错：<code>bool()</code> 只返回 <code>True</code>/<code>False</code>，不会原样返回参数。'
          },
          {
            label: '2',
            points: 3,
            kind: 'choice',
            prompt: 'What is printed?',
            code:
`thislist = ["apple", "banana", "cherry"]
thislist.insert(1, "orange")
thislist.remove("banana")
print(thislist)`,
            codeTitle: 'Python',
            options: [
              { text: "<code>['orange', 'apple', 'cherry']</code>" },
              { text: "<code>['apple', 'orange', 'cherry']</code>", correct: true },
              { text: "<code>['apple', 'banana', 'orange']</code>" },
              { text: "<code>['apple', 'cherry']</code>" }
            ],
            answer: 'B',
            explain: '<code>insert(1, "orange")</code> 把 orange 插到下标 1，原来的元素后移：<code>["apple", "orange", "banana", "cherry"]</code>；<code>remove("banana")</code> 按<strong>值</strong>删掉 banana：<code>["apple", "orange", "cherry"]</code>。A 以为 <code>insert</code> 会顶掉原位置元素（那是赋值 <code>thislist[1] = ...</code>）。C 把 <code>insert</code> 当成了追加（追加是 <code>append</code>）。D 以为 <code>remove</code> 删掉两个元素。'
          },
          {
            label: '3',
            points: 3,
            kind: 'choice',
            prompt: 'What is printed?',
            code:
`class A {
    public void f() { System.out.print("A"); }
}

class B extends A {
    public void f() {
        super.f();
        System.out.print("B");
    }
}

public class Main {
    public static void main(String[] args) { new B().f(); }
}`,
            options: [
              { text: '<code>A</code>' },
              { text: '<code>B</code>' },
              { text: '<code>AB</code>', correct: true },
              { text: '<code>BA</code>' }
            ],
            answer: 'C',
            explain: '<code>super.f()</code> 显式调用父类版本，打印 <code>A</code>；返回后继续执行子类 <code>f()</code> 的下一句，打印 <code>B</code> → 输出 <code>AB</code>。A 忽略了子类方法体还会继续执行。B 忽略了 <code>super.f()</code> 的调用。D 顺序反了：<code>super.f()</code> 在第一句。补充：如果子类 <code>f()</code> 里不写 <code>super.f()</code>，输出就只有 <code>B</code>，父类实现被完全覆盖。'
          },
          {
            label: '4',
            points: 3,
            kind: 'choice',
            prompt: 'What is printed by the following Python program?',
            code:
`class Person:
    def __init__(self, fname, lname):
        self.firstname = fname
        self.lastname = lname

class Student(Person):
    def __init__(self, fname, lname):
        super().__init__(fname, lname)
        self.graduationyear = 2019

x = Student("Mike", "Olsen")
print(x.firstname, x.lastname, x.graduationyear)`,
            codeTitle: 'Python',
            options: [
              { text: '<code>Mike Olsen 2019</code>', correct: true },
              { text: "<code>AttributeError: 'Student' object has no attribute 'firstname'</code>" },
              { text: '<code>Mike Olsen None</code>' },
              { text: '<code>TypeError: super() takes no arguments</code>' }
            ],
            answer: 'A',
            explain: '<code>super().__init__(fname, lname)</code> 调用父类 <code>Person.__init__</code>，把 <code>firstname</code>/<code>lastname</code> 设好；随后子类设置 <code>graduationyear</code>，三个字段都存在 → <code>Mike Olsen 2019</code>。B 是<strong>漏掉</strong> <code>super().__init__</code> 时的结果（父类字段没有被创建）。C 错：父类构造器确实执行了，不是 None。D 错：Python 3 里 <code>super()</code> 不带参数，但后面紧接方法调用 <code>super().__init__(...)</code> 是标准写法，参数传给的是 <code>__init__</code>。'
          },
          {
            label: '5',
            points: 3,
            kind: 'choice',
            prompt: 'In Tkinter, which binding fires on a double click with <strong>either</strong> the left or the right mouse button?',
            options: [
              { text: '<code>&lt;Double 1&gt;</code>' },
              { text: '<code>&lt;Double-Button-1&gt;</code>' },
              { text: '<code>&lt;Double-Button&gt;</code>', correct: true },
              { text: '<code>&lt;Button-1&gt;</code>' }
            ],
            answer: 'C',
            explain: '课程材料明确区分：<code>&lt;Double 1&gt;</code> 与 <code>&lt;Double-Button-1&gt;</code> 只捕获<strong>左键</strong>双击；<code>&lt;Double-Button&gt;</code> 捕获<strong>左右键</strong>的双击。D 是单击（左键），连“双击”都不是。绑定写法：<code>frame.bind("&lt;Double-Button&gt;", double_click)</code>，回调的 <code>event.x</code>/<code>event.y</code> 给出点击坐标。'
          },
          {
            label: '6',
            points: 3,
            kind: 'choice',
            prompt: 'What is printed?',
            code:
`String a = "hi";
String b = new String("hi");
System.out.println(a == b);
System.out.println(a.equals(b));`,
            options: [
              { text: '<code>true</code> then <code>true</code>' },
              { text: '<code>false</code> then <code>true</code>', correct: true },
              { text: '<code>false</code> then <code>false</code>' },
              { text: '<code>true</code> then <code>false</code>' }
            ],
            answer: 'B',
            explain: '<code>==</code> 比较<strong>引用</strong>：字面量 <code>"hi"</code> 来自字符串常量池，<code>new String("hi")</code> 在堆上新建了一个对象，两者不是同一个对象 → false。<code>equals()</code> 被 <code>String</code> 重写为逐字符比较内容 → true。C 以为 <code>equals()</code> 也比较引用。D 完全反了。聊天室里比较用户名、判断命令，必须用 <code>equals()</code>。'
          },
          {
            label: '7',
            points: 3,
            kind: 'choice',
            prompt: 'Inside the Snake game, what does this code do to <code>self.snake</code> (a list of <code>(x, y)</code> tuples)?',
            code:
`new_head = (head_x, head_y)
self.snake = [new_head] + self.snake[:-1]`,
            codeTitle: 'Python',
            options: [
              { text: 'The snake grows by one segment.' },
              { text: 'The snake moves one cell forward and keeps its length unchanged.', correct: true },
              { text: "The snake's head and tail are swapped." },
              { text: 'The snake loses its head and the body is reversed.' }
            ],
            answer: 'B',
            explain: '<code>[new_head] + self.snake[:-1]</code>：把新头放在列表最前，<code>self.snake[:-1]</code> 是除最后一段外的整个身体（舍弃尾巴）→ 长度不变，整体前移一格，这正是贪吃蛇“正常移动”的写法。A 是吃到食物时的写法：<code>[new_head] + self.snake</code>（保留尾巴，长度 +1）。C 错：<code>[:-1]</code> 只是去掉最后一项，不是交换。D 错：新头是<strong>加在</strong>最前面，头没有丢，身体顺序也没反转。'
          },
          {
            label: '8',
            points: 3,
            kind: 'choice',
            prompt: 'A lambda expression can be used wherever a <strong>functional interface</strong> is expected. What must a functional interface have?',
            options: [
              { text: 'Exactly one abstract method.', correct: true },
              { text: 'At least one <code>default</code> method.' },
              { text: 'Only <code>static</code> methods.' },
              { text: 'Two or more abstract methods, so that the compiler can choose one.' }
            ],
            answer: 'A',
            explain: 'lambda 是“<strong>唯一抽象方法</strong>的实现”的语法糖：编译器需要能唯一确定 lambda 实现的是哪个方法，所以函数式接口必须恰好有一个抽象方法（可以另外带 <code>default</code>/<code>static</code> 方法，它们不算抽象方法）。B 错：<code>default</code> 方法可有可无，不是必要条件。C 错：全是 <code>static</code> 方法就没有待实现的抽象方法，lambda 无处可落。D 错：两个抽象方法时编译器无法判断 lambda 实现哪一个，直接编译错误。课程里 <code>EventHandler</code>（只有 <code>handle</code>）就是典型函数式接口。'
          },
          {
            label: '9',
            points: 3,
            kind: 'choice',
            prompt: 'Why does the <code>test()</code> function use <code>model.eval()</code> and <code>with torch.no_grad():</code>?',
            options: [
              { text: 'To train faster by skipping the optimizer.' },
              { text: '<code>eval()</code> switches layers such as dropout / batch-norm to inference behaviour, and <code>no_grad()</code> stops building the autograd graph so no gradients are computed or stored.', correct: true },
              { text: '<code>eval()</code> freezes all weights permanently, and <code>no_grad()</code> deletes the optimizer.' },
              { text: 'Both are only needed on GPU; on CPU they change nothing.' }
            ],
            answer: 'B',
            explain: '测试只做前向推理：<code>model.eval()</code> 让 dropout 关闭、BatchNorm 使用运行统计量（而不是当前 batch 的统计量）；<code>with torch.no_grad():</code> 关闭自动求导，不再构建计算图、不保存中间张量，省显存也更快。A 错：测试阶段根本不更新参数，也就不用优化器。C 错：<code>eval()</code> 只是切换模式，切回 <code>model.train()</code> 就恢复；它不会删除优化器。D 错：CPU 上 <code>no_grad()</code> 同样省内存和计算，<code>eval()</code> 同样影响 dropout/BN 的行为。'
          },
          {
            label: '10',
            points: 3,
            kind: 'choice',
            prompt: 'The client writes a line with <code>bufferedWriter.write(msg);</code>, but the other clients never receive it until the program exits. What is missing?',
            options: [
              { text: '<code>bufferedWriter.newLine();</code> only' },
              { text: '<code>bufferedWriter.flush();</code>', correct: true },
              { text: '<code>socket.close();</code> before every message' },
              { text: '<code>bufferedReader.readLine();</code>' }
            ],
            answer: 'B',
            explain: '<code>BufferedWriter</code> 把字符攒在缓冲区里，<code>write()</code> 只写进内存；必须 <code>flush()</code> 才会真正推到底层 socket。程序退出时 <code>close()</code> 顺带 flush，所以表现为“退出后对方才收到”。A 错：<code>newLine()</code> 只是补一个换行，同样留在缓冲区，不 flush 依然发不出去（不过 <code>readLine()</code> 需要它，通常两者都要）。C 错：每发一条就关连接，连接直接废掉。D 错：那是读取，不是发送。'
          }
        ]
      },

      /* --------------------------------------------------------- Part II */
      {
        no: 2,
        points: 20,
        type: 'tf',
        intro: 'Part II · True / False (5 × 4 = 20 marks) · Choose True (T) or False (F) for each statement.',
        parts: [
          {
            label: '1',
            points: 4,
            kind: 'tf',
            prompt: 'In Python, <code>random.randint(0, 10)</code> returns an integer in the range 0 to 10 <strong>inclusive</strong>, so there are 11 possible values.',
            options: [{ text: 'True (T)', correct: true }, { text: 'False (F)' }],
            answer: 'true',
            explain: '对。Python 的 <code>random.randint(a, b)</code> <strong>两端都包含</strong>，所以 0 到 10 共 11 个整数值。对比：<code>range(0, 10)</code> 和切片一样“含头不含尾”，只有 10 个值。贪吃蛇里生成食物坐标时经常写成 <code>random.randint(0, (self.width // self.cell_size) - 1) * self.cell_size</code>，正是为了不越界。'
          },
          {
            label: '2',
            points: 4,
            kind: 'tf',
            prompt: 'For a normal instance method in Python, <code>self</code> must be declared as the first parameter, and Python passes the instance automatically when the method is called.',
            options: [{ text: 'True (T)', correct: true }, { text: 'False (F)' }],
            answer: 'true',
            explain: '对。<code>def speak(self):</code> 里的 <code>self</code> 就是“当前实例”，调用 <code>p.speak()</code> 时 Python 自动等价于 <code>Person.speak(p)</code>，不需要手动传。<code>self</code> 只是惯例名（写 <code>this</code> 语法上也合法），但必须是第一个参数，否则调用时参数个数对不上。Java 里对应的东西是隐式的 <code>this</code>，不写在参数表里——这是两种语言常考的差异。'
          },
          {
            label: '3',
            points: 4,
            kind: 'tf',
            prompt: 'In Java, <code>Runnable r = new Runnable();</code> creates a usable <code>Runnable</code> object that can be passed to <code>new Thread(r)</code>.',
            options: [{ text: 'True (T)' }, { text: 'False (F)', correct: true }],
            answer: 'false',
            explain: '错。<code>Runnable</code> 是<strong>接口</strong>，接口不能直接实例化，<code>new Runnable()</code> 是编译错误。合法写法有三种：①写一个类 <code>class Task implements Runnable { public void run() {...} }</code> 再 <code>new Task()</code>；②匿名内部类 <code>new Runnable() { public void run() {...} }</code>；③lambda <code>Runnable r = () -&gt; System.out.println("run");</code>（<code>Runnable</code> 是函数式接口）。项目里的 <code>ClientHandler</code> 用的就是第 ① 种。'
          },
          {
            label: '4',
            points: 4,
            kind: 'tf',
            prompt: 'In Tkinter, calling <code>root.mainloop()</code> is optional: the window will still be displayed and respond to events without it.',
            options: [{ text: 'True (T)' }, { text: 'False (F)', correct: true }],
            answer: 'false',
            explain: '错。<code>mainloop()</code> 是 Tkinter 的<strong>事件循环</strong>：它负责绘制窗口、分发鼠标/键盘事件、执行 <code>after()</code> 排队的回调。没有它，程序创建完控件就立刻执行下一条语句（通常直接结束），窗口一闪而过或根本不出现。所有 Tkinter 程序结尾都要 <code>root.mainloop()</code>；<code>after</code> 的回调也只有在 <code>mainloop()</code> 运行时才会被调用。'
          },
          {
            label: '5',
            points: 4,
            kind: 'tf',
            prompt: 'A Java thread that has already finished its <code>run()</code> method can be started again by calling <code>start()</code>.',
            options: [{ text: 'True (T)' }, { text: 'False (F)', correct: true }],
            answer: 'false',
            explain: '错。一个 <code>Thread</code> 对象只能 <code>start()</code> <strong>一次</strong>：结束后处于 <code>TERMINATED</code>，再次调用 <code>start()</code> 会抛 <code>IllegalThreadStateException</code>。想再跑一遍，必须新建一个 <code>Thread</code> 对象（<code>new Thread(task).start()</code>）。<code>Runnable</code> 本身可以复用，但承载它的 <code>Thread</code> 不能。'
          }
        ]
      },

      /* -------------------------------------------------------- Part III */
      {
        no: 3,
        points: 25,
        type: 'fill',
        intro: 'Part III · Fill in the Blanks (5 × 5 = 25 marks) · Write the missing keyword / expression in the blank. Spelling and order matter; the grader ignores extra spaces.',
        parts: [
          {
            label: '1',
            points: 5,
            kind: 'fill',
            prompt: 'Complete the first parameter of the instance method. (Write only what belongs in the blank.)',
            code:
`class Person:
    def __init__(______, name, age):
        self.name = name
        self.age = age

p1 = Person("John", 36)`,
            codeTitle: 'Python',
            answer: 'self',
            accept: ['self'],
            explain: '实例方法的第一个参数约定叫 <code>self</code>，代表“当前对象”；<code>p1 = Person("John", 36)</code> 时 Python 自动把 <code>p1</code> 作为第一个实参传进去，所以参数表里写 <code>self</code>、函数体里用 <code>self.name</code>。不写 <code>self</code> 会变成普通函数（或参数个数错乱），访问不到实例字段。'
          },
          {
            label: '2',
            points: 5,
            kind: 'fill',
            prompt: 'Complete the Canvas method that draws one snake segment (the cell is a square). (Write only the method name.)',
            code:
`for x, y in self.snake:
    self.canvas.create______(x, y, x + self.cell_size, y + self.cell_size, fill='green')`,
            codeTitle: 'Python',
            answer: 'rectangle',
            accept: ['rectangle'],
            explain: 'Tkinter Canvas 的常用绘制方法：<code>create_line</code>（线）、<code>create_rectangle</code>（矩形）、<code>create_oval</code>（椭圆/圆）、<code>create_arc</code>（弧）、<code>create_text</code>（文字）。贪吃蛇每一节都是方块，用 <code>create_rectangle(x1, y1, x2, y2, fill=...)</code>；四个坐标是左上角和右下角。注意是 <code>create_rectangle</code>，不是 <code>create_rect</code>。'
          },
          {
            label: '3',
            points: 5,
            kind: 'fill',
            prompt: 'Complete the call that actually starts the new thread. (Write only the method name.)',
            code:
`ClientHandler handler = new ClientHandler(socket);
Thread thread = new Thread(handler);
thread.______();`,
            answer: 'start',
            accept: ['start'],
            explain: '只有 <code>start()</code> 才会让 JVM 创建新线程并在其中调用 <code>run()</code>。<code>thread.run()</code> 只是普通方法调用，仍在本线程同步执行——服务器会被这个客户端阻塞，无法再 <code>accept()</code>。另外，同一个 <code>Thread</code> 对象只能 <code>start()</code> 一次，重复调用抛 <code>IllegalThreadStateException</code>。'
          },
          {
            label: '4',
            points: 5,
            kind: 'fill',
            prompt: 'Complete the call that computes the gradients of all parameters. (Write only the method name.)',
            code:
`output = model(data)
loss = F.nll_loss(output, target)
loss.______()          # back-propagation: compute the gradients
optimizer.step()`,
            codeTitle: 'Python',
            answer: 'backward',
            accept: ['backward'],
            explain: 'PyTorch 的训练三步曲：<code>loss.backward()</code> 从 loss 出发反向传播，把梯度累加到每个参数的 <code>.grad</code> 上；<code>optimizer.step()</code> 再按这些梯度更新参数；下一轮前 <code>optimizer.zero_grad()</code> 清零（否则梯度会累加）。少了 <code>backward()</code>，<code>.grad</code> 为空，<code>step()</code> 实际上什么都没更新。'
          },
          {
            label: '5',
            points: 5,
            kind: 'fill',
            prompt: 'Complete the socket method that returns the input stream to be wrapped by the character-stream bridge. (Write only the method name.)',
            code:
`BufferedReader reader = new BufferedReader(
        new InputStreamReader(socket.______()));`,
            answer: 'getInputStream',
            accept: ['getInputStream'],
            explain: '<code>socket.getInputStream()</code> 返回字节输入流，<code>socket.getOutputStream()</code> 返回字节输出流——这是 Socket 读写数据的唯一入口。<code>InputStreamReader</code> 把字节流“桥接”成字符流，<code>BufferedReader</code> 再加缓冲并提供 <code>readLine()</code>。反过来写 <code>getOutputStream()</code> 会因为类型不匹配编译失败（<code>InputStreamReader</code> 只接受 <code>InputStream</code>）。'
          }
        ]
      },

      /* --------------------------------------------------------- Part IV */
      {
        no: 4,
        points: 25,
        type: 'short',
        intro: 'Part IV · Short Answer &amp; Programming (25 marks) · Write your answers in the spaces below.',
        parts: [
          {
            label: '4(a)',
            points: 10,
            kind: 'keywords',
            prompt: 'Describe the training and testing pipeline of the MNIST PyTorch project. Write, in order, what happens inside <code>train()</code> for one epoch, explain what <code>loss.backward()</code> and <code>optimizer.step()</code> each do, and explain why <code>test()</code> uses <code>model.eval()</code> together with <code>with torch.no_grad():</code>. (10 marks)',
            keywords: [
              ['model(data)', 'forward', '前向'],
              ['loss', 'nll_loss', '损失'],
              ['backward'],
              ['optimizer.step', 'step()'],
              ['zero_grad'],
              ['model.train', 'train()', '训练模式'],
              ['eval'],
              ['no_grad']
            ],
            answer:
`run(config) 里每个 epoch：
  for (data, target) in train_loader:
      model.train()                       # 训练模式
      optimizer.zero_grad()               # 清空上一轮累积的梯度
      output = model(data)                # ① 前向传播：输入 → 网络 → 输出
      loss = F.nll_loss(output, target)   # ② 用损失函数衡量预测与标签的差距
      loss.backward()                     # ③ 反向传播：求每个参数的梯度
      optimizer.step()                    # ④ 按梯度更新参数
  test(model, test_loader)                # 每个 epoch 结束后评估

test() 里：
  model.eval()                            # 关闭 dropout，BN 用运行统计量
  with torch.no_grad():                   # 不构建计算图
      for (data, target) in test_loader:
          output = model(data)            # 只做前向，算准确率
          ...
  model.train()                           # 评估完切回训练模式

backward()：从 loss 出发，按链式法则反向计算每个参数的梯度，
            累加到 param.grad。
step()：    优化器读取 param.grad，按学习率更新参数（梯度下降）。
zero_grad()：把 grad 清零，避免下一轮梯度累加到旧值上。`,
            explain: '给分点：前向 <code>output = model(data)</code>（1）；损失 <code>F.nll_loss</code>（1）；<code>loss.backward()</code> 求梯度（2）；<code>optimizer.step()</code> 更新参数（2）；<code>zero_grad()</code> 的必要性（1）；解释 <code>eval()</code> 关闭 dropout/BN 训练行为（2）；解释 <code>no_grad()</code> 不建图、不算梯度（1）。常见错误：把 <code>step()</code> 写在 <code>backward()</code> 之前；以为 <code>backward()</code> 会更新参数（它只算梯度）；把 <code>model.eval()</code> 用在训练循环里；忘了 <code>zero_grad()</code> 导致梯度跨 batch 累加、训练发散。'
          },
          {
            label: '4(b)',
            points: 15,
            kind: 'keywords',
            prompt: 'Write the <code>move_snake(self)</code> method of the Tkinter Snake game. It must: (1) move the head one <code>cell_size</code> according to <code>self.snake_direction</code> (<code>Left</code> / <code>Right</code> / <code>Up</code> / <code>Down</code>); (2) end the game if the new head hits a wall or the snake&rsquo;s own body; (3) grow the snake when <code>new_head == self.food</code> and create a new food; (4) otherwise keep the same length; (5) redraw. Assume <code>game_over()</code>, <code>create_food()</code> and <code>update_ui()</code> already exist. (15 marks)',
            keywords: [
              ['self.snake[0]', 'head_x, head_y'],
              ['self.cell_size', 'cell_size'],
              ['self.snake_direction', 'direction'],
              ['new_head'],
              ['self.width', 'self.height'],
              ['self.game_over', 'game_over'],
              ['self.snake[1:]', 'self.snake[:-1]', 'in self.snake'],
              ['self.food'],
              ['self.create_food', 'create_food'],
              ['self.update_ui', 'update_ui']
            ],
            answer:
`def move_snake(self):
    head_x, head_y = self.snake[0]
    if self.snake_direction == 'Left':
        head_x -= self.cell_size
    elif self.snake_direction == 'Right':
        head_x += self.cell_size
    elif self.snake_direction == 'Up':
        head_y -= self.cell_size
    elif self.snake_direction == 'Down':
        head_y += self.cell_size

    new_head = (head_x, head_y)

    # 1) 撞墙
    if (new_head[0] < 0 or new_head[0] >= self.width or
            new_head[1] < 0 or new_head[1] >= self.height):
        self.game_over()
        return

    # 2) 撞到自己（new_head 不可能是当前的蛇头，所以从 snake[1:] 开始查）
    if new_head in self.snake[1:]:
        self.game_over()
        return

    # 3) 吃到食物：长度 +1，并重新生成食物
    if new_head == self.food:
        self.snake = [new_head] + self.snake
        self.food = self.create_food()
    else:
        # 4) 正常移动：加新头、去尾巴，长度不变
        self.snake = [new_head] + self.snake[:-1]

    # 5) 重绘
    self.update_ui()`,
            explain: '给分点（15 分）：从 <code>self.snake[0]</code> 取蛇头（2）；按四个方向加减 <code>cell_size</code>（3）；构造 <code>new_head</code>（1）；撞墙判断用 <code>0 &lt;= x &lt; self.width</code>、<code>0 &lt;= y &lt; self.height</code>（3）；撞自己用 <code>in self.snake</code> 判断（2）；吃到食物时长度 +1 并调用 <code>create_food()</code>（2）；正常移动 <code>[new_head] + self.snake[:-1]</code>（1）；最后 <code>update_ui()</code>（1）。细节：课程示例用 <code>self.snake[1:]</code> 排除当前蛇头，写成 <code>self.snake[:-1]</code>（排除马上要空出来的尾巴）也能接受——两者都比 <code>in self.snake</code> 更准确，后者会把“头不动”误判成撞自己。撞墙/撞自己后要 <code>return</code>，否则会继续移动并重绘，游戏结束后蛇还在动。'
          }
        ]
      }
    ]
  };

  /* ------------------------------------------------------------ 注册 */
  var LIST = [F1, F2, F3];
  var G = (typeof globalThis !== 'undefined') ? globalThis
        : (typeof window !== 'undefined') ? window : this;
  var C = G && G.CSC;
  if (C && typeof C.registerExam === 'function') {
    try { C._exams = LIST; } catch (e) { /* 只读环境忽略 */ }
    LIST.forEach(function (exam) { C.registerExam(exam); });
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { exams: LIST };
})();
