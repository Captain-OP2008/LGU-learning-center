/* =====================================================================
 * data/quiz.js · 题库数据（791 题，覆盖 ch00–ch25 全部 26 章）
 * 四档梯度：tier1 模仿（学完本节即可）· tier2 变式（换情境/组合）· tier3 独立实现（写方法）· tier4 综合（长程序/跨章）
 * 题型分布：mcq 353 / predict 149 / fill 140 / multi 9 / tf 68 / code 72（findbug 49 含在 fill 内；findbug = type:fill + mode:findbug，按关键点命中判分）
 * 题号：chXX-qN 章节保底题（正文引用 q1–q3）· chXX-kN 知识点补充 · chXX-fN 找 bug · chXX-cN 编程判分 · chXX-pN 长程序读输出 · chXX-tN 梯度训练
 * 标签：exam（对应 4 套模拟卷考点）· bigo（复杂度专项）· bug / code / output / trap / concept / syntax
 * 注入：CSC.registerQuizPack({ items:[…] })；另挂 CSC._quizPack 供引擎先读后加载
 * 说明：predict / findbug / code 题的答案与期望输出均经真实 JDK 25 编译运行核对（2026-10）
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = { items: [

    /* ============================================================ ch00 序章：计算机科学与你 */
    { id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '下面哪句话最准确地描述了“编写程序”这件事？',
      options: [
        { text: '把英文句子翻译成中文，让计算机能读懂' },
        { text: '把解决问题的步骤，拆成计算机能逐条执行的精确指令', correct: true },
        { text: '记住 Java 的所有关键字和语法规则' },
        { text: '让 AI 生成代码，人只负责复制粘贴' }
      ],
      explain: '程序 = 数据结构（数据怎么组织）+ 算法（处理数据的步骤）。编程的核心是把人脑中模糊的解决办法翻译成“每一步都无歧义”的指令序列，语法只是表达工具。AI 能生成代码，但判断它为什么对、错在哪里，仍然要能自己逐行推演。' },

    { id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'predict', difficulty: 1, tags: ['concept', 'output'],
      stem: '下面是一段<b>伪代码</b>（不是 Java，只是描述步骤）。按顺序执行，写出最后打印出来的值。',
      code: 'x ← 10\nrepeat 3 times:\n    x ← x + 5\nprint x',
      answer: '25',
      engineNote: '这是伪代码，不是 Java：站内引擎不执行它，按步骤手推即可。',
      explain: '把人脑当成执行器：x 初始是 10；循环体重复 3 次，每次 x 加 5 → 15、20、25；最后 print 输出 25。这种“拿张纸把变量值一路写下来”的能力，就是后面所有读程序题的全部要求。' },

    { id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept', 'exam'],
      stem: '关于 Java 程序的“编译”和“运行”，下列说法正确的是？',
      options: [
        { text: '源代码由 JVM 直接解释执行，不需要编译' },
        { text: 'javac 把 .java 编译成 .class 字节码，再由 JVM 执行', correct: true },
        { text: '.class 文件是纯文本，可以用记事本打开并编辑' },
        { text: '只要语法没写错，程序就一定能得到正确结果' }
      ],
      explain: 'javac（Java Compiler）负责编译期翻译：.java → .class 字节码；JVM 负责运行期执行字节码。.class 是二进制文件，用记事本打开是乱码。语法正确只代表能编译，逻辑错误（如把 + 写成 -）要等运行结果才能发现。' },

    { id: 'ch00-q4', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'fill', difficulty: 1, tags: ['concept', 'exam'],
      stem: '把源文件 `Hello.java` 编译成字节码的命令是：`_____ Hello.java`（只填命令名）',
      answer: 'javac',
      explain: 'javac = Java Compiler，后面跟**带扩展名**的源文件名；java = 运行器，后面跟**不带扩展名**的类名。对比记忆：`javac Hello.java` 生成 Hello.class，再 `java Hello` 运行。' },

    { id: 'ch00-q5', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '程序里把 `+` 误写成了 `-`，结果算出来的数不对，但程序能正常编译、正常跑完。这属于哪类错误？',
      options: [
        { text: '编译错误 compile-time error' },
        { text: '运行时错误 runtime error' },
        { text: '逻辑错误 logic error', correct: true },
        { text: '语法错误 syntax error' }
      ],
      explain: '三类错误要分清：编译错误——语法或类型不合法，javac 拒绝生成 .class；运行时错误——编译通过但执行到某条语句崩溃（除零、数组越界、空指针）；逻辑错误——能编译、能跑完，但结果不是想要的。+ 写成 - 是典型逻辑错误，最麻烦，因为机器不会提醒你。' },

    { id: 'ch00-q6', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
      stem: 'Java 程序总是从 `public static void ____(String[] args)` 这个方法开始执行。（填写方法名）',
      answer: 'main',
      explain: 'main 方法是 JVM 寻找的入口，签名必须严格是 public static void main(String[] args)。拼成 Main（大小写错）、漏掉 static、写成 int main，JVM 都会报“找不到 main 方法”而无法启动。' },

    { id: 'ch00-q7', ch: 'ch00', kp: 'ch00-2', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
      stem: '关于“计算机能做什么”，下列哪些说法是正确的？（多选）',
      options: [
        { text: '计算机能执行算法，但算法本身要由人来设计', correct: true },
        { text: '计算机可以自己决定要解决什么问题' },
        { text: '计算机擅长重复、精确、高速的机械操作', correct: true },
        { text: '程序的每一步都必须被明确定义，不能留下“你自己看着办”', correct: true }
      ],
      explain: '计算机是执行器而不是决策者：它会不知疲倦地精确执行你写的每一步，但不会替你理解需求、补全没说清的边界。所以程序里少写一个边界判断，它也会一丝不苟地照错执行。' },

    { id: 'ch00-q8', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: 'AI 已经能写出能跑的代码，为什么这门课还要亲手写、亲手读程序？',
      options: [
        { text: '因为 AI 写出来的代码一定是错的' },
        { text: '因为要能判断 AI 的输出对不对、错在哪、怎么改', correct: true },
        { text: '因为考试规定不许用电脑' },
        { text: '因为手写代码比用 AI 更快' }
      ],
      explain: 'AI 生成的代码往往“看起来很像对的”，最容易在边界情况出错（空数组、负数、除零、下标差一）。只有当你能逐行推演、能预测输出，才有能力验收和修改它。读程序写输出正是训练这种能力最直接的方式。' },

    { id: 'ch00-q9', ch: 'ch00', kp: 'ch00-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '“程序 = 数据结构 + 算法”这句话中，数据结构与算法分别指什么？',
      options: [
        { text: '数据结构 = 变量名，算法 = 语法规则' },
        { text: '数据结构 = 数据怎么组织存放，算法 = 处理数据的步骤', correct: true },
        { text: '数据结构 = 硬盘容量，算法 = CPU 主频' },
        { text: '数据结构 = 类，算法 = 方法名' }
      ],
      explain: '数据结构回答“数据放在哪儿、怎么组织”（数组、ArrayList、HashMap）；算法回答“用哪些步骤加工它”（排序、查找、递归、遍历）。这门课后面的每一章，基本都在往这两个筐里添东西。' },

    { id: 'ch00-f1', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'fill', mode: 'findbug', difficulty: 1, tags: ['bug'],
      stem: '下面程序无法编译。指出<b>哪一行</b>出错、错在哪里，并写出修改后的那一行。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int a = 5;\n        system.out.println("a = " + a);\n    }\n}',
      answer: '第 4 行：`system` 应为 `System`（Java 严格区分大小写）',
      accept: [
        { hint: '指出行号（第 4 行）', any: ['第4行', '第 4 行', '4行', '行4', 'line4'] },
        { hint: '把 `system` 改成大写开头的 `System`', any: ['system改System', 'System', '改成大写', '大小写', '首字母大写'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int a = 5;\n        System.out.println("a = " + a);\n    }\n}',
      explain: 'javac 报 `error: cannot find symbol` + `symbol: variable system`。Java 是大小写敏感的语言，`System` 是标准库的类名，写成小写 `system` 编译器就不认识。这类错误的读法：先看报错行号，再看 symbol 提示里的名字，对照自己写的拼写。' },

    { id: 'ch00-f2', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'fill', mode: 'findbug', difficulty: 1, tags: ['bug'],
      stem: '程序能编译、能运行，但结果不对：本意是求 a 与 b 的<b>和</b>。指出哪一行有逻辑错误，并写出改正后的代码。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int a = 10;\n        int b = 4;\n        int sum = a - b;\n        System.out.println("sum=" + sum);\n    }\n}',
      answer: '第 5 行：`int sum = a - b;` 的减号应为加号 `int sum = a + b;`',
      accept: [
        { hint: '指出行号（第 5 行）', any: ['第5行', '第 5 行', '5行', '行5', 'line5'] },
        { hint: '把 `-` 改成 `+`', any: ['减号改加号', '改成加号', 'a+b', 'a + b', '把-改成+'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int a = 10;\n        int b = 4;\n        int sum = a + b;\n        System.out.println("sum=" + sum);\n    }\n}',
      explain: '编译器和 JVM 都不会替你判断“这里的减号是不是笔误”，程序会老老实实输出 `sum=6`。这就是**逻辑错误**：语法正确、能运行，但结果与需求不符，只能靠对照预期、手算检验来发现。读程序找 bug 时，先问“这段代码想做什么”，再问“它实际做了什么”。' },

    { id: 'ch00-p1', ch: 'ch00', kp: 'ch00-2', tier: 4, type: 'predict', difficulty: 1, tags: ['output'],
      stem: '读下面的程序，<b>写出完整输出（逐行）</b>。读完再回答解析里的三个追问：① 哪些行会换行？② 为什么最后两个表达式结果不同？③ `-a % b` 的符号由谁决定？',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int a = 7;\n        int b = 3;\n        System.out.println(a + b);\n        System.out.println(a - b);\n        System.out.println(a * b);\n        System.out.println(a / b);\n        System.out.println(a % b);\n        System.out.println(a + b + "!");\n        System.out.println("!" + a + b);\n        System.out.println((a + b) + "!");\n        double d = a / b;\n        System.out.println(d);\n        System.out.println(a / (double) b);\n        System.out.println(a + b * 2);\n        System.out.println((a + b) * 2);\n        System.out.println(-a % b);\n    }\n}',
      answer: '10\n4\n21\n2\n1\n10!\n!73\n10!\n2.0\n2.3333333333333335\n13\n20\n-1',
      explain: '逐行推演：① a+b=10、a-b=4、a*b=21；② a/b 是 int 除法 7/3=2（截断）；③ a%b=1；④ `a + b + "!"` 先算 10 再拼接 → `10!`；⑤ `"!" + a + b` 字符串在左，后面全是拼接 → `!73`；⑥ `(a + b) + "!"` → `10!`；⑦ d = 7/3 = 2，再转 double → `2.0`（不是 2.33）；⑧ `a / (double) b` 先提升为 double → `2.3333333333333335`；⑨ a + b*2 = 7+6 = 13；⑩ (a+b)*2 = 20；⑪ -7 % 3 = -1（Java 取余结果的符号与被除数相同）。' },

    { id: 'ch00-t1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '下面哪一项最接近“计算机科学”的研究对象？',
      options: [
        { text: '计算机硬件的制造与维修' },
        { text: '算法与计算过程：怎么把问题变成可执行的步骤', correct: true },
        { text: '打字速度与办公软件操作' },
        { text: '网络带宽与硬盘容量' }
      ],
      explain: '计算机科学研究的不是“电脑”这个物件，而是**计算过程**：问题怎么形式化、用什么算法求解、复杂度如何。硬件、软件只是实现计算过程的载体。这门课从变量、循环一路讲到递归与 Big-O，都是在训练“把问题变成步骤”的能力。' },

    { id: 'ch00-t2', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
      stem: '填空：本站课程共 26 章（14 章主课 + 12 章继续学习），按学习阶段分成几个 Part？（填阿拉伯数字）',
      answer: ['8', '八'],
      explain: '26 章分成 8 个 Part：Part I 起步（ch00–ch02）、Part II 控制流与数组（ch03–ch04）、Part III 方法与对象（ch05–ch10，含内存与集合）、Part IV 算法与递归（ch11–ch13），这四部分是主课；Part V 案例研究（ch14–ch16）、Part VI 算法与数据结构（ch17–ch19）、Part VII 计算理论（ch20–ch22）、Part VIII 机器与硬件（ch23–ch25），这四部分按教材继续学习。这个结构对应课程大纲里“编程元素 → 函数 → OOP → CS 基础”的主线，再往后延伸到算法、理论与硬件。' },

    { id: 'ch00-t3', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
      stem: '判断：计算机科学主要研究如何修理和组装电脑硬件。',
      options: [
        { text: '正确（True）' },
        { text: '错误（False）', correct: true }
      ],
      explain: '修电脑、装硬件属于计算机工程/运维，不是计算机科学的核心。计算机科学（CS）研究**计算与信息处理**：算法、数据结构、编程语言、复杂度、系统原理。硬件是它运行的平台，但不是研究对象本身。' },

    { id: 'ch00-t4', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: 'AI 已经能一键生成可运行的代码，这个前提下**最该练**的能力是？',
      options: [
        { text: '记住更多 Java 语法细节' },
        { text: '读懂代码、判断它对不对、错在哪、怎么改', correct: true },
        { text: '背下所有标准库方法签名' },
        { text: '完全不用学编程，交给 AI 就行' }
      ],
      explain: 'AI 生成的代码常常“看起来对”，却在边界处出错（空数组、负数、差一）。能否**逐行推演、预测输出、定位 bug**，决定了你能不能验收 AI 的成果。这也是本站安排“读程序写输出”“找 bug”“写方法”三类训练的原因：考卷和作业考的正是这些能力。' },

    { id: 'ch00-t5', ch: 'ch00', kp: 'ch00-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '“程序 = 数据结构 + 算法”。下面哪一项属于**算法**而不是数据结构？',
      options: [
        { text: '把学生成绩存在一个 int 数组中' },
        { text: '用 HashMap 保存“学号 → 成绩”的映射' },
        { text: '把数组按成绩从高到低排序的步骤', correct: true },
        { text: '用二维数组表示一张棋盘' }
      ],
      explain: '数据结构回答“数据怎么组织存放”（数组、二维数组、HashMap）；算法回答“用哪些步骤处理数据”（排序步骤、查找步骤、递归求和的展开方式）。A、B、D 都在描述数据的组织方式，只有 C 描述的是处理步骤。' },

    { id: 'ch00-t6', ch: 'ch00', kp: 'ch00-3', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int x = 3;\n        x = x * 2 + 1;\n        System.out.println(x);\n        System.out.println("x=" + x);\n    }\n}',
      answer: '7\nx=7',
      explain: '① `x = x * 2 + 1` 先算乘除后算加减：x*2=6，+1=7，x 变成 7；② 第一个 println 直接打印 7；③ 第二个 println 里 `"x=" + x` 是字符串拼接 → `x=7`。注意赋值号右边先用**旧的** x 计算，算完才写回 x。' },

    { id: 'ch00-t7', ch: 'ch00', kp: 'ch00-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['syntax'],
      stem: '把 `Hello.java` 里的 `public class Hello` 改名为 `public class Hi`，其他不变，然后执行 `javac Hello.java`。会发生什么？',
      options: [
        { text: '正常编译，生成 Hi.class' },
        { text: '编译错误：public 类名必须与文件名一致', correct: true },
        { text: '正常编译，但运行 `java Hello` 会找不到类' },
        { text: 'javac 会自动把文件重命名为 Hi.java' }
      ],
      explain: 'Java 规定：一个文件里的 **public 类名必须与文件名完全相同**（含大小写）。文件名 Hello.java 却声明 public class Hi，javac 直接报错 “class Hi is public, should be declared in a file named Hi.java”。修法：要么把类名改回 Hello，要么把文件重命名为 Hi.java。' },

    { id: 'ch00-f3', ch: 'ch00', kp: 'ch00-1', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '下面程序无法编译。指出<b>哪一行</b>出错、错在哪里，并写出修改方法。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int total = 10;\n        total = total + 5;\n        System.out.println(totl);\n    }\n}',
      answer: '第 5 行：`totl` 拼写错误（未声明），应改为 `total`',
      accept: [
        { hint: '指出行号（第 5 行）', any: ['第5行', '第 5 行', '5行', '行5', 'line5'] },
        { hint: '把 `totl` 改回已声明的变量名 `total`', any: ['totl改total', '改成total', '拼写', '拼错', '变量名写错'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int total = 10;\n        total = total + 5;\n        System.out.println(total);\n    }\n}',
      explain: 'javac 报 `error: cannot find symbol` + `symbol: variable totl`：编译器找不到名为 totl 的变量，因为上面声明的是 total。这类“拼写错一个字母”的编译错误在初学者中极常见，读报错时先看 symbol 提示里的名字，再对照自己写的那一行。' },

    { id: 'ch00-t9', ch: 'ch00', kp: 'ch00-4', tier: 3, type: 'code', difficulty: 1, tags: ['code'],
      stem: '补全方法 <code>triple</code>：返回参数 n 的三倍（不要用 print，直接返回结果）。<br>已给出测试入口，不要修改 <code>main</code>。',
      starter: 'public class Q {\n    static int triple(int n) {\n        // TODO: 返回 n 的三倍（不要用 print）\n        return 0;\n    }\n    public static void main(String[] args) {\n        for (int i = 0; i < args.length; i++) {\n            int n = Integer.parseInt(args[i]);\n            System.out.println(triple(n));\n        }\n    }\n}',
      solution: 'public class Q {\n    static int triple(int n) {\n        return n * 3;\n    }\n    public static void main(String[] args) {\n        for (int i = 0; i < args.length; i++) {\n            int n = Integer.parseInt(args[i]);\n            System.out.println(triple(n));\n        }\n    }\n}',
      tests: [
        { args: ['2'], expect: '6' },
        { args: ['-4', '0'], expect: '-12\n0' }
      ],
      explain: '方法题的第一步是看清**返回类型**（int）与参数（一个 int）。实现只需 `return n * 3;`。`main` 会把每个命令行参数转成 int 再调用 triple 并打印，所以你只要保证返回值正确即可。测试用例包含负数和 0，注意不要写成 `n + n + n` 之外的奇怪逻辑。' },

    { id: 'ch00-t10', ch: 'ch00', kp: 'ch00-2', tier: 4, type: 'predict', difficulty: 2, tags: ['output', 'trap'],
      stem: '读下面这个“小票计算”程序，<b>写出完整输出（逐行）</b>。追问：① total 是多少？② discount 与 pay 各是多少？③ 为什么 `pay=324.0` 而不是 `324`？',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int price = 120;\n        int count = 3;\n        int total = price * count;\n        System.out.println("total=" + total);\n        double discount = total >= 300 ? 0.9 : 1.0;\n        double pay = total * discount;\n        System.out.println("pay=" + pay);\n        int rounded = (int) (pay + 0.5);\n        System.out.println("rounded=" + rounded);\n        String level = total >= 500 ? "A" : (total >= 300 ? "B" : "C");\n        System.out.println("level=" + level);\n        System.out.println("items=" + count + ", unit=" + price);\n    }\n}',
      answer: 'total=360\npay=324.0\nrounded=324\nlevel=B\nitems=3, unit=120',
      explain: '① `price * count` = 120×3 = 360 → `total=360`；② 三元运算符：total >= 300 为真 → discount = 0.9；pay = 360×0.9 = 324.0。因为 discount 是 double，`total * discount` 结果是 double，打印带 `.0` → `pay=324.0`；③ `(int)(pay + 0.5)` = (int)324.5 = 324（截断），这是“四舍五入”的手写技巧；④ total=360 不 >= 500，但 >= 300 → level = "B"；⑤ 最后一行把数字拼进字符串 → `items=3, unit=120`。' },

    { id: 'ch00-c1', ch: 'ch00', kp: 'ch00-1', tier: 3, type: 'code', difficulty: 1, tags: ['code'],
      stem: '补全方法 <code>max2</code>：返回两个整数中较大的那个（相等时返回任意一个）。',
      starter: 'public class Q {\n    static int max2(int a, int b) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        int a = Integer.parseInt(args[0]);\n        int b = Integer.parseInt(args[1]);\n        System.out.println(max2(a, b));\n    }\n}',
      solution: 'public class Q {\n    static int max2(int a, int b) {\n        return a > b ? a : b;\n    }\n    public static void main(String[] args) {\n        int a = Integer.parseInt(args[0]);\n        int b = Integer.parseInt(args[1]);\n        System.out.println(max2(a, b));\n    }\n}',
      tests: [
        { args: ['3', '7'], expect: '7' },
        { args: ['-1', '-5'], expect: '-1' },
        { args: ['4', '4'], expect: '4' }
      ],
      explain: '一行三元表达式即可：条件 a > b 为真取 a，否则取 b。方法题的关键是看清返回类型（int）与参数（两个 int），不要写 print。' },

    { id: 'ch00-c2', ch: 'ch00', kp: 'ch00-2', tier: 3, type: 'code', difficulty: 1, tags: ['code'],
      stem: '补全方法 <code>abs</code>：返回整数 n 的绝对值（不要用 Math.abs）。',
      starter: 'public class Q {\n    static int abs(int n) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(abs(n));\n    }\n}',
      solution: 'public class Q {\n    static int abs(int n) {\n        if (n < 0) {\n            return -n;\n        }\n        return n;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(abs(n));\n    }\n}',
      tests: [
        { args: ['-5'], expect: '5' },
        { args: ['3'], expect: '3' },
        { args: ['0'], expect: '0' }
      ],
      explain: '负数返回 -n（取反），否则原样返回。注意 int 最小值 -2147483648 取反会溢出，这里按常规范围处理即可。' },

    { id: 'ch00-n1', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '三类错误中，哪一类**在程序真正运行之前**就会被发现？',
      options: [
        { text: '编译期错误（语法/类型不合法，javac 直接拒绝）', correct: true },
        { text: '运行时错误（数组越界、除零）' },
        { text: '逻辑错误（结果不对但不报错）' },
        { text: '三类都不会在运行前发现' }
      ],
      explain: '编译期错误在 javac 阶段就被拦下，程序根本没跑（如少了分号、类型不匹配）；运行时错误能编译通过，跑到某行才抛异常（越界、除零）；逻辑错误既不报编译错也不抛异常，只是结果不对——最难查，所以本站提供单步面板帮你逐行看变量。' },

    { id: 'ch00-n2', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '程序能编译、能运行、正常结束，但算出来的结果不对。这属于哪类错误？',
      options: [
        { text: '逻辑错误', correct: true },
        { text: '编译错误' },
        { text: '运行时错误' },
        { text: '语法错误' }
      ],
      explain: '逻辑错误：能编译、能跑完，但结果与需求不符（比如把 + 写成 -）。机器不会提醒你，只能靠“先写下预测、再对照实际输出”来发现。编译错误和语法错误在 javac 阶段拦下；运行时错误会抛异常并指出行号。' },

    { id: 'ch00-n3', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
      stem: '判断：访问数组时下标越界抛出的 ArrayIndexOutOfBoundsException 属于**运行时错误**。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: 'javac 不检查具体下标值，所以越界能编译通过；真正执行到那一行才抛 ArrayIndexOutOfBoundsException，并给出 `Index 3 out of bounds for length 3` 这样的信息——异常名决定类别、行号决定位置、具体值帮你判断边界。' },

    { id: 'ch00-n4', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '下面程序无法编译。指出**有几处**语句缺少分号、分别在哪两行，并说明修改方法。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int x = 5\n        System.out.println("x = " + x)\n    }\n}',
      answer: '第 3 行与第 4 行都缺少分号：`int x = 5` 应为 `int x = 5;`，`System.out.println(...)` 后也要补分号',
      accept: [
        { hint: '指出第 3 行和第 4 行（共两处）缺少分号', any: ['3行', '第3行', '4行', '第4行', '两处', '2处', '缺少分号', '漏分号'] },
        { hint: '给两条语句末尾各补一个分号', any: ['补分号', '加分号', '末尾加分号', ';'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int x = 5;\n        System.out.println("x = " + x);\n    }\n}',
      explain: 'javac 报 `\';\' expected`。两条语句末尾都少了分号，程序无法生成 .class，属于编译期错误。注意报错行号可能指向下一条语句——所以要同时看报错行和它的前一行。修好后程序输出 `x = 5`。' },

    { id: 'ch00-n5', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '运行程序后看到异常信息 `Index 3 out of bounds for length 3`。下面理解正确的是？',
      options: [
        { text: '访问了下标 3，而合法下标是 0、1、2（数组长度 3）', correct: true },
        { text: '数组长度是 3，所以下标 3 合法' },
        { text: '这是编译错误，需要改语法' },
        { text: '程序会继续正常运行，只是打印警告' }
      ],
      explain: '读异常信息的顺序：异常名（越界）→ 具体值（下标 3、长度 3）→ 结论（合法下标 0~length-1，即 0、1、2）。长度 3 的数组最后一个下标是 2，访问 3 就抛异常。这类错误在运行时抛出并指出行号，比逻辑错误好查。' },

    { id: 'ch00-n6', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '本站的“单步面板”主要解决什么问题？',
      options: [
        { text: '逐行执行代码，实时看变量、调用栈和堆内存怎么变化', correct: true },
        { text: '自动帮你把代码改成正确版本' },
        { text: '检查代码的拼写错误' },
        { text: '给代码计时' }
      ],
      explain: '五个工具各司其职：运行看输出、单步看过程（变量/调用栈/堆）、实验台做交互动画、题库按章刷题、模拟卷限时自测。单步面板的价值在于把“程序执行过程”变可见——这正是排查逻辑错误和理解递归/循环的利器。' },

    { id: 'ch00-n7', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '关于“题库”和“模拟卷”的用法，下列建议正确的是？',
      options: [
        { text: '先按章节刷题库（即时判分、看解析），再限时做模拟卷暴露“知道但做不对”的题型', correct: true },
        { text: '一开始就只做模拟卷，效果最好' },
        { text: '题库和模拟卷完全等价，随便用哪个' },
        { text: '模拟卷不用看解析，对答案即可' }
      ],
      explain: '题库适合学完一节就刷：即时判分、逐题解析、错题本；模拟卷适合阶段性自测：计时、一次做完、交卷看逐题解析。顺序上应先题库分章练、再模拟卷限时练——一上来做模拟卷容易被陌生题型打击信心。' },

    { id: 'ch00-n8', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
      stem: '填空：“只看不写、复制粘贴、害怕报错”是三个坏习惯，对应的唯一解法是：每次运行前先写下自己的 `_____`，用它与实际输出的差值暴露理解漏洞。',
      answer: ['预测', '预测结果', '预期', '预期结果'],
      explain: '“先预测、再运行”是把被动看代码变成主动思考的关键动作：预测对了说明真懂；预测错了，差值就精确指出你理解偏差在哪。这也是本站“读程序写输出题”想训练的能力。' },

    { id: 'ch00-n9', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '第一次练习应该选哪种代码？',
      options: [
        { text: '把顺序、选择、重复三种控制结构放进一个约 10 行的完整小程序，跑通后再用单步看变量变化', correct: true },
        { text: '直接写一个 500 行的大项目' },
        { text: '只抄示例，不运行' },
        { text: '只学语法，先不写程序' }
      ],
      explain: '入门练习的最小完整程序 = 声明 + 循环 + 判断 + 输出。它足够短（能逐行看懂），又包含“完整程序”的骨架。跑通后用单步观察 i、total 每一轮的变化，能把“代码”和“执行过程”对应起来。' },

    { id: 'ch00-n10', ch: 'ch00', kp: 'ch00-7', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '下面这个“第一次练习”程序把循环与输出放在一起。写出完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int total = 0;\n        for (int i = 1; i <= 3; i++) {\n            total += i;\n            System.out.println("i=" + i + " total=" + total);\n        }\n        System.out.println("done");\n    }\n}',
      answer: 'i=1 total=1\ni=2 total=3\ni=3 total=6\ndone',
      explain: '逐轮推演：i=1 → total=1，打印 `i=1 total=1`；i=2 → total=3，打印 `i=2 total=3`；i=3 → total=6，打印 `i=3 total=6`；i=4 时条件 i&lt;=3 不成立退出，最后打印 `done`。先写预测再运行，是理解循环最有效的方法。' },

    { id: 'ch00-d1', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '本站 26 章分成 8 个 Part，下面哪一项的分组是对的？',
      options: [
        { text: 'Part I 起步（ch00–ch02）· Part II 控制流与数组（ch03–ch04）· Part III 方法与对象（ch05–ch10）· Part IV 算法与递归（ch11–ch13）· Part V 案例研究（ch14–ch16）· Part VI 算法与数据结构（ch17–ch19）· Part VII 计算理论（ch20–ch22）· Part VIII 机器与硬件（ch23–ch25）', correct: true },
        { text: 'Part I 算法 · Part II 对象 · Part III 数组 · Part IV 递归 · Part V 硬件 · Part VI 网络 · Part VII 数据库 · Part VIII 人工智能' },
        { text: '按难度随机分成 8 组' },
        { text: '每章一个 Part，共 26 个 Part' }
      ],
      explain: '课程结构：先学基础（变量/类型/字符串）→ 控制流与数组 → 方法与 OOP（含内存、ADT）→ 算法、递归与复杂度，这四部分是主课；之后按教材继续学案例研究（随机冲浪者/渗流/N 体）、算法与数据结构（栈队列/符号表/图）、计算理论（形式语言/图灵机/可计算性）与机器硬件（信息表示/TOY/电路）。这个八块划分也是复习时的天然模块。' },

    { id: 'ch00-d2', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
      stem: '填空：本站课程共 26 章（14 章主课 + 12 章继续学习），其中“算法：排序与查找”是第 `_____` 章（填两位数字）。',
      answer: ['11', '十一'],
      explain: '章节顺序：ch00 序章、ch01 第一个程序、ch02 变量类型字符串、ch03 条件与循环、ch04 数组、ch05 输入输出、ch06 方法、ch07 类与对象、ch08 继承多态、ch09 内存引用、ch10 ADT 与集合、ch11 排序与查找、ch12 递归、ch13 复杂度，之后是 ch14–ch25 的继续学习章节。' },

    { id: 'ch00-d3', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: 'AI 时代学习编程，最有价值的转变是？',
      options: [
        { text: '从“自己敲出每一行”转向“能提需求、读懂输出、验证正确性、定位与修复错误”', correct: true },
        { text: '完全不再需要读代码' },
        { text: '只需要学会写提示词' },
        { text: '编程已经没用，不用学' }
      ],
      explain: 'AI 能生成代码，但判断“它是否解决了问题、边界是否正确、哪里错了怎么改”仍然依赖人的程序素养。本站的读程序、找 bug、写方法训练，正是培养这种“验收能力”——这是 AI 时代比手速更值钱的技能。' },

    { id: 'ch00-d4', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
      stem: '判断：AI 生成的代码必须经过人工逐行推演或运行验证才能确认正确。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: 'AI 代码常“看起来对”，却在边界处出错（空数组、负数、差一、类型溢出）。验收方法：先预测输出再运行对比、构造边界用例、逐行检查关键逻辑。能验收的人才能真正安全地使用 AI。' },

    /* ============================================================ ch01 第一个 Java 程序 */
    { id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax', 'exam'],
      stem: '下面关于 Java 源文件与 public 类的关系，正确的是？',
      options: [
        { text: '文件名可以随便取，与类名无关' },
        { text: '文件名必须与 public 类名完全一致，扩展名为 .java', correct: true },
        { text: '一个 .java 文件里最多只能有一个类' },
        { text: '类名首字母必须大写，否则编译不过' }
      ],
      explain: 'public 类名必须与文件名完全相同（含大小写），否则 javac 报 “class X is public, should be declared in a file named X.java”。一个文件可以放多个类，但只能有一个 public 类。类名首字母大写只是**约定**，编译器不强制。' },

    { id: 'ch01-q2', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'predict', difficulty: 1, tags: ['output', 'exam'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Hello {\n    public static void main(String[] args) {\n        System.out.print("CSC");\n        System.out.println("1003");\n        System.out.println("!");\n    }\n}',
      answer: 'CSC1003\n!',
      explain: 'print 输出后**不换行**，println 输出后换行。所以 "CSC" 和 "1003" 拼在同一行变成 CSC1003；接着 println("!") 另起一行输出 !。最终两行：第一行 CSC1003，第二行 !。' },

    { id: 'ch01-q3', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: '已成功编译 `Demo.java`（其中 public class Demo）。要运行它，正确的命令是？',
      options: [
        { text: 'java Demo.java' },
        { text: 'javac Demo' },
        { text: 'java Demo', correct: true },
        { text: 'java Demo.class' }
      ],
      explain: '编译：javac Demo.java（带 .java 扩展名）；运行：java Demo（写类名，不带 .class）。写成 java Demo.class 时 JVM 会把 Demo.class 当成类名去找，报 ClassNotFoundException。' },

    { id: 'ch01-q4', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'tf', difficulty: 1, tags: ['syntax', 'exam'],
      stem: '判断：`System.out.println("Hello")` 少写了分号，程序仍能编译，只是运行时不会输出。',
      options: [
        { text: '正确（True）' },
        { text: '错误（False）', correct: true }
      ],
      explain: '分号是语句结束标志，漏掉它是**编译期**错误（javac 会直接报缺少分号），根本不会生成 .class 文件，也就谈不上运行。这是初学者最高频的编译错误之一。' },

    { id: 'ch01-q5', ch: 'ch01', kp: 'ch01-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['syntax', 'trap', 'exam'],
      stem: '下面这段代码编译会报错，最可能的原因是什么？',
      code: 'public class Test {\n    public static void main(String[] args) {\n        system.out.println("hi");\n    }\n}',
      options: [
        { text: '字符串必须用单引号' },
        { text: 'System 首字母写成了小写，而 Java 严格区分大小写', correct: true },
        { text: 'main 方法必须是 private' },
        { text: '类名 Test 不合法' }
      ],
      explain: 'Java 严格区分大小写：system 不是 System，javac 报 “cannot find symbol: variable system”。同理 string、System.Out、Println 这些大小写错误都是初学者常踩的坑。' },

    { id: 'ch01-q6', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'fill', difficulty: 1, tags: ['syntax'],
      stem: '填空：要让输出**留在同一行**（不换行），应调用 `System.out._____(…)`；要换行则用 println。',
      answer: 'print',
      explain: 'print 不换行，println 换行——ln 就是 line 的缩写，println = print + new line。这也是“循环里用 print 拼图案、最后用 println 收尾”这类写法的来源。' },

    { id: 'ch01-q7', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['syntax', 'exam'],
      stem: '下列关于 main 方法签名的说法，哪一项是正确的？',
      options: [
        { text: '`public static void main(String args[])` 与 `public static void main(String[] args)` 等价', correct: true },
        { text: 'main 必须返回 int，用来表示退出码' },
        { text: '一个类如果不写 main 方法就无法编译' },
        { text: 'main 方法前面不能加 public' }
      ],
      explain: '`String[] args` 和 `String args[]` 是同一类型的两种写法（Java 继承自 C 的数组声明语法）。main 必须返回 void；没有 main 的类照样能编译，只是不能作为程序入口运行（工具类常见）。' },

    { id: 'ch01-q8', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: '关于 Java 注释，下列哪项正确？',
      options: [
        { text: '`//` 能注释多行，`/* */` 只能注释一行' },
        { text: '`//` 注释到本行末尾，`/* … */` 可以跨多行', correct: true },
        { text: '注释会被编译进 .class 文件里，影响程序速度' },
        { text: '注释里不能写中文' }
      ],
      explain: '`//` 是单行注释，从 // 到行尾；`/* … */` 是块注释，可跨多行。注释在编译时被丢弃，不进入 .class。注释里写中文没问题（源文件按 UTF-8 保存即可）。' },

    { id: 'ch01-q9', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '下面程序会怎样？',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int x = 1 / 0;\n        System.out.println(x);\n    }\n}',
      options: [
        { text: '编译错误，javac 直接报错' },
        { text: '编译通过，运行时抛 ArithmeticException', correct: true },
        { text: '编译通过，输出 0' },
        { text: '编译通过，输出 Infinity' }
      ],
      explain: 'javac 不会检查“除数为常量 0”这种运行时问题，所以能编译通过；真正执行到该行时抛 ArithmeticException: / by zero。注意区分：整数除零抛异常，而 double 的 0.0 除法才会得到 Infinity / NaN。' },

    { id: 'ch01-k1', ch: 'ch01', kp: 'ch01-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: 'javac 报错 `error: cannot find symbol`。下面哪种情况最可能产生这个错误？',
      options: [
        { text: '把 `System` 写成了 `system`，或变量/方法名拼错、忘记声明', correct: true },
        { text: '程序运行到一半除以 0' },
        { text: '数组下标超出长度' },
        { text: '输出的字符串太长' }
      ],
      explain: 'cannot find symbol 是**编译期**错误：编译器在符号表里找不到你写的名字。常见原因就是大小写拼错（system/System、string/String）、变量没声明、方法名拼错。除零和越界都是**运行时**错误，编译期发现不了；字符串长度更是与编译无关。读报错先看三件事：错误类型、行号、提示里的“symbol: …”。' },

    { id: 'ch01-k2', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'fill', difficulty: 2, tags: ['syntax'],
      stem: '执行 `javac Q.java` 后报 `error: \';\' expected`。这说明源代码里最可能缺少什么？（一个词）',
      answer: ['分号', '缺少分号', '漏写分号', '少写分号', 'missing semicolon'],
      explain: '`error: \';\' expected` 的意思是“这里期望一个分号”。Java 用分号结束语句，漏写它是最常见的编译错误之一。注意报错行号有时指向**下一条**语句（因为编译器是在读到下一个 token 时才发现上一句没结束），所以要到报错行的前一两行去找。' },

    { id: 'ch01-f1', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'fill', mode: 'findbug', difficulty: 1, tags: ['bug'],
      stem: '下面程序编译时报错。指出哪一行缺了什么，并写出修改方法。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        System.out.println("Hello")\n    }\n}',
      answer: '第 3 行：`System.out.println("Hello")` 末尾缺少分号，应改为 `System.out.println("Hello");`',
      accept: [
        { hint: '指出行号（第 3 行）', any: ['第3行', '第 3 行', '3行', '行3', 'line3'] },
        { hint: '指出缺少分号（补在 println 语句末尾）', any: ['缺少分号', '少了个分号', '少写分号', '加分号', '补分号', '缺分号', 'missing semicolon', ';'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        System.out.println("Hello");\n    }\n}',
      explain: 'javac 报 `error: \';\' expected`。Java 用分号结束语句，`println(...)` 调用后必须加分号。注意报错行号有时指向**下一行**（编译器读到下一个 token 才发现上一句没结束），所以要同时看报错行和前一行。' },

    { id: 'ch01-f2', ch: 'ch01', kp: 'ch01-1', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '下面程序编译通过，但运行时报错。指出哪一行有问题，并写出修改方法。',
      code: 'public class Q {\n    public static void Main(String[] args) {\n        System.out.println("start");\n    }\n}',
      answer: '第 2 行：入口方法名写成了 `Main`，JVM 只认全小写的 `main`，应改为 `public static void main(String[] args)`',
      accept: [
        { hint: '指出行号（第 2 行）', any: ['第2行', '第 2 行', '2行', '行2', 'line2'] },
        { hint: '把 `Main` 改成小写 `main`', any: ['Main改main', '改成main', 'main', '方法名大小写', '小写main'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        System.out.println("start");\n    }\n}',
      explain: 'javac 能编译通过（`Main` 只是一个普通方法），但运行时 JVM 找的是签名严格为 `public static void main(String[] args)` 的入口方法，找不到就报 `Error: Main method not found in class Q`。这是“编译通过 ≠ 能运行”的典型例子：方法名、参数列表必须一字不差。' },

    { id: 'ch01-p1', ch: 'ch01', kp: 'ch01-4', tier: 4, type: 'predict', difficulty: 1, tags: ['output'],
      stem: '读下面的程序，<b>写出完整输出（逐行，注意空格与换行）</b>。追问：① 哪几行在同一行输出？② `1 + 2 + "3"` 与 `"1" + 2 + 3` 的差别从哪来？③ char 参与加法时发生了什么？',
      code: 'public class Q {\n    public static void main(String[] args) {\n        System.out.print("A");\n        System.out.print(\'B\');\n        System.out.println("C");\n        System.out.println("tab\\there");\n        System.out.println("quote\\"inside");\n        System.out.println("back\\\\slash");\n        System.out.print("no newline");\n        System.out.println();\n        System.out.println(1 + 2 + "3" + 4 + 5);\n        System.out.println("1" + 2 + 3 + 4);\n        System.out.println(1 + 2 + 3 + "4" + 5);\n        char c = \'A\' + 2;\n        System.out.println(c);\n        System.out.println((int) \'A\');\n    }\n}',
      answer: 'ABC\ntab	here\nquote"inside\nback\\slash\nno newline\n3345\n1234\n645\nC\n65',
      explain: '① print 不换行：`A`、`B` 连在一起，再到 println("C") 才换行 → 第一行 `ABC`；② `\\t` 输出制表符、`\\"` 输出引号、`\\\\` 输出反斜杠 → 第二、三、四行分别是 `tab\\there`、`quote"inside`、`back\\\\slash`（逐字对应源码里的转义）；③ `print("no newline")` 后跟空 println() 只换行 → 第五行 `no newline`；④ `1 + 2 + "3" + 4 + 5`：先算 1+2=3，再与 "3" 拼接得 "33"，之后 4、5 都按拼接 → `3345`；⑤ `"1" + 2 + 3 + 4` 从字符串开始 → `1234`；⑥ `1 + 2 + 3 + "4" + 5` 先算 1+2+3=6，再拼 "4" 得 "64"，再拼 5 → `645`；⑦ char 参与加法会提升为 int：字符 A 的编码是 65，+2 = 67 → 强转回 char 打印 `C`；⑧ `(int)` 强转字符 A 打印 65。' },

    { id: 'ch01-t1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: '文件 `Hello.java` 中有 `public class Hello` 与 `class Helper`，编译后会产生哪些 .class 文件？',
      options: [
        { text: '只有 Hello.class' },
        { text: 'Hello.class 和 Helper.class', correct: true },
        { text: '只有 Helper.class' },
        { text: '编译错误：一个文件只能有一个类' }
      ],
      explain: 'Java 一个 .java 文件可以放**多个类**，但只能有一个 public 类，且 public 类名必须与文件名一致。javac 会为每个类各生成一个 .class 文件：Hello.class（public）和 Helper.class（包私有）。运行入口仍然只能是 `java Hello`。' },

    { id: 'ch01-t2', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'fill', difficulty: 1, tags: ['syntax'],
      stem: '填空：已编译出 `Demo.class`，运行程序的命令是 `java _____`（只填类名，不带扩展名）。',
      answer: ['Demo', 'demo'],
      explain: '`javac Demo.java` 负责编译（参数是**带 .java 的文件名**）；`java Demo` 负责运行（参数是**类名**，不带 .class）。写成 `java Demo.class` 时 JVM 会把 “Demo.class” 当成类名去找，报 ClassNotFoundException。' },

    { id: 'ch01-t3', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'tf', difficulty: 1, tags: ['syntax'],
      stem: '判断：Java 的每条**表达式语句**（如赋值、方法调用）都必须以分号结尾。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: 'Java 用分号结束语句：`int x = 1;`、`System.out.println(x);`、`x++;` 都要加分号。不用分号的是**声明与块**：类声明、方法声明、if/while/for 的语句头、代码块 `{}`。漏分号是最高频的编译错误之一。' },

    { id: 'ch01-t4', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: '下面哪种注释写法是**合法**的？',
      options: [
        { text: '`/* 单行 */` 只能注释一行，`//` 可以跨多行' },
        { text: '`// 单行` 从 // 到行尾；`/* 多行 */` 可以跨行', correct: true },
        { text: '嵌套 `/* /* */ */` 是合法的' },
        { text: '注释会保留到 .class 文件里，影响运行速度' }
      ],
      explain: '`//` 注释到本行末尾；`/* ... */` 块注释可跨多行，但**不能嵌套**（第一个 `*/` 就把注释结束掉）。注释在编译时被丢弃，不进入 .class、不影响运行速度。' },

    { id: 'ch01-t5', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        System.out.print("A");\n        System.out.print("B");\n        System.out.println("C");\n        System.out.print(1);\n        System.out.print(2);\n        System.out.println(3);\n        System.out.println("done");\n    }\n}',
      answer: 'ABC\n123\ndone',
      explain: '① 两次 print 把 A、B 连在同一行，println("C") 换行 → `ABC`；② 数字同理：print(1)、print(2) 连成 `12`，println(3) 后是 `123` 换行；③ 最后 println("done") → `done`。print 不换行、println 换行是唯一区别；循环里画图案就靠这个区别拼行。' },

    { id: 'ch01-t6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['syntax'],
      stem: 'javac 报错 `error: reached end of file while parsing`。最可能的原因是什么？',
      options: [
        { text: '某个地方括号 {} 没有配对（少写了一个右括号）', correct: true },
        { text: '程序运行到文件末尾时崩溃' },
        { text: '主方法名拼错了' },
        { text: '文件编码不是 UTF-8' }
      ],
      explain: '“解析到文件末尾还没结束”说明编译器在找某个块的收尾 `}`，但一直没找到——通常是少写了一两个右括号，导致后面的代码都被算进未闭合的块里。修法：从报错位置往上找最近的 `{`，检查每个块的配对（编辑器自动缩进能帮你看出层次）。' },

    { id: 'ch01-f3', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '下面程序无法编译。指出<b>缺少什么</b>、在哪补，并写出修改方法。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int n = 3;\n        if (n > 0) {\n            System.out.println("positive");\n    }\n}',
      answer: '第 5 行后：`if` 块缺少右花括号 `}`，应在 println 那一行之后补一个 `}` 闭合 if 块',
      accept: [
        { hint: '指出缺少右花括号（第 5 行之后补 `}`）', any: ['缺少}', '少一个}', '补}', '缺少右花括号', '少个右括号', '括号不配对'] },
        { hint: '说明补在 if 块结束处（println 之后）', any: ['println之后', '第五行之后', '第5行之后', 'if块结束', 'if 块'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int n = 3;\n        if (n > 0) {\n            System.out.println("positive");\n        }\n    }\n}',
      explain: 'javac 报 `reached end of file while parsing` / `\';\' expected`：if 块少了右花括号，编译器认为 main 方法还没结束。补上 if 的 `}` 后，main 的 `}` 才能正确闭合。技巧：写代码时先把 `{}` 成对打好再填内容，能避免一大半这类错误。' },

    { id: 'ch01-t8', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: 'javac 报 `error: \';\' expected`，行号指向第 7 行，但第 7 行看起来完全正确。最可能的真实错误位置是？',
      options: [
        { text: '第 7 行确实有错，只是不明显' },
        { text: '第 6 行（报错行的上一行）末尾漏了分号', correct: true },
        { text: '第 8 行' },
        { text: '与行号无关，一定是类名错了' }
      ],
      explain: '编译器是在读到**下一个 token** 时才发现“上一条语句没结束”，所以报错行号常常指向问题的**下一行**。看到 `; expected` 时，先检查报错行的前一两行是否漏分号。修法：把第 6 行末尾补上分号。' },

    { id: 'ch01-t9', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '按 Java 命名约定，下面哪一组写法是**规范**的？',
      options: [
        { text: '类名 `studentScore`、变量 `StudentScore`、常量 `max_score`' },
        { text: '类名 `StudentScore`、变量 `studentScore`、常量 `MAX_SCORE`', correct: true },
        { text: '类名 `STUDENT_SCORE`、变量 `student_score`、常量 `MaxScore`' },
        { text: '类名 `student_score`、变量 `SCORE`、常量 `maxScore`' }
      ],
      explain: 'Java 约定：**类名用大驼峰**（StudentScore）；**变量/方法用小驼峰**（studentScore）；**常量全大写下划线分隔**（MAX_SCORE）。这些约定编译器不强制，但团队代码、老师的评分都会看。注意变量不能含连字符、不能以数字开头。' },

    { id: 'ch01-t10', ch: 'ch01', kp: 'ch01-4', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>printLine</code>：打印 n 个减号 `-`，<b>不换行</b>（用 while 循环）。<br>已给出测试入口，不要修改 <code>main</code>。',
      starter: 'public class Q {\n    static void printLine(int n) {\n        // TODO: 打印 n 个减号，不换行（用 while 循环，不要用 String.repeat）\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        printLine(n);\n        System.out.println();\n        printLine(n + 2);\n        System.out.println();\n    }\n}',
      solution: 'public class Q {\n    static void printLine(int n) {\n        int i = 0;\n        while (i < n) {\n            System.out.print("-");\n            i++;\n        }\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        printLine(n);\n        System.out.println();\n        printLine(n + 2);\n        System.out.println();\n    }\n}',
      tests: [
        { args: ['3'], expect: '---\n-----' },
        { args: ['0'], expect: '\n--' }
      ],
      explain: '循环 n 次、每次 `System.out.print("-")` 即可；循环变量从 0 到 n-1 用 `while (i &lt; n)`。n=0 时一次都不打印、只输出空行，这是边界情况。注意方法返回类型是 void，不需要 return 值。' },

    { id: 'ch01-t11', ch: 'ch01', kp: 'ch01-4', tier: 4, type: 'predict', difficulty: 2, tags: ['output', 'trap'],
      stem: '读下面的程序，<b>写出完整输出（逐行）</b>。追问：① `"a/b = " + a / b` 与 `"a/b = " + (a / b)` 结果一样吗？② `c + 1` 与 `(char)(c + 1)` 分别输出什么？③ `"done: " + a + b` 为什么是 `done: 52`？',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int a = 5;\n        int b = 2;\n        System.out.println(a / b);\n        System.out.println(a % b);\n        System.out.println("a/b = " + a / b);\n        System.out.println("a/b = " + (a / b));\n        char c = \'A\';\n        System.out.println(c);\n        System.out.println(c + 1);\n        System.out.println((char) (c + 1));\n        String s = "line1\\nline2";\n        System.out.println(s);\n        System.out.println("tab\\tend");\n        boolean ok = a > b;\n        System.out.println(ok);\n        System.out.println("done: " + a + b);\n    }\n}',
      answer: '2\n1\na/b = 2\na/b = 2\nA\n66\nB\nline1\nline2\ntab	end\ntrue\ndone: 52',
      explain: '① `a / b` 是 int 除法 5/2=2；`"a/b = " + a / b` 中 `/` 的优先级高于 `+`，先算 2 再拼接 → "a/b = 2"；加括号 `(a / b)` 结果相同。② 字符 A 的编码是 65，`c + 1` 提升为 int 66，`(char) (c + 1)` 强转回字符 B。③ 字符串拼接：`"done: " + 5` = "done: 5"，再 + 2 = "done: 52"（不是 7）。' },

    { id: 'ch01-c1', ch: 'ch01', kp: 'ch01-4', tier: 3, type: 'code', difficulty: 1, tags: ['code'],
      stem: '补全方法 <code>printStars</code>：打印 n 个星号 <code>*</code>，<b>不换行</b>（用循环，不要用 String.repeat）。',
      starter: 'public class Q {\n    static void printStars(int n) {\n        // TODO: 用循环打印 n 个星号\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        printStars(n);\n        System.out.println();\n    }\n}',
      solution: 'public class Q {\n    static void printStars(int n) {\n        for (int i = 0; i < n; i++) {\n            System.out.print("*");\n        }\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        printStars(n);\n        System.out.println();\n    }\n}',
      tests: [
        { args: ['3'], expect: '***' },
        { args: ['0'], expect: '' },
        { args: ['1'], expect: '*' }
      ],
      explain: '循环 n 次、每次 print("*")，注意用 print 而不是 println（不换行），换行由 main 的 println 负责。n=0 时一次都不打印，输出空行。' },

    { id: 'ch01-c2', ch: 'ch01', kp: 'ch01-5', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>repeat</code>：返回字符串 s 重复 n 次拼接的结果（n≥0，不要用 String.repeat）。',
      starter: 'public class Q {\n    static String repeat(String s, int n) {\n        return "";\n    }\n    public static void main(String[] args) {\n        String s = args[0];\n        int n = Integer.parseInt(args[1]);\n        System.out.println("[" + repeat(s, n) + "]");\n    }\n}',
      solution: 'public class Q {\n    static String repeat(String s, int n) {\n        String out = "";\n        for (int i = 0; i < n; i++) {\n            out = out + s;\n        }\n        return out;\n    }\n    public static void main(String[] args) {\n        String s = args[0];\n        int n = Integer.parseInt(args[1]);\n        System.out.println("[" + repeat(s, n) + "]");\n    }\n}',
      tests: [
        { args: ['ab', '3'], expect: '[ababab]' },
        { args: ['x', '0'], expect: '[]' },
        { args: ['-', '2'], expect: '[--]' }
      ],
      explain: '累加字符串：每轮 out = out + s。n=0 时返回空串。注意用 println("[...]") 让输出边界可见，判断空串时不会被空格干扰。' },

    { id: 'ch01-n1', ch: 'ch01', kp: 'ch01-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '运行 `java ArgsDemo Alice Bob Cara` 时，`args` 里有什么？',
      options: [
        { text: 'length 为 3 的 String 数组：args[0]="Alice"、args[1]="Bob"、args[2]="Cara"', correct: true },
        { text: '一个字符串 "Alice Bob Cara"' },
        { text: 'length 为 3 的 int 数组' },
        { text: '空数组' }
      ],
      explain: '命令行参数按空格拆开、依次装进 String[] args。所以 args.length=3，且每个元素都是字符串。注意 `java` 和类名本身不算参数；带空格的参数要用引号包住（如 `"hello world"` 算一个）。' },

    { id: 'ch01-n2', ch: 'ch01', kp: 'ch01-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['trap'],
      stem: '程序里 `System.out.println(args[0] + args[1]);` 运行 `java Q 3 4`，输出什么？',
      options: [
        { text: '`34`（字符串拼接）', correct: true },
        { text: '`7`' },
        { text: '`3 4`' },
        { text: '编译错误' }
      ],
      explain: 'args 的元素是 String，"3" + "4" 是字符串拼接 → "34"。要做加法必须先转 int：`Integer.parseInt(args[0]) + Integer.parseInt(args[1])` → 7。这是命令行参数题最核心的陷阱。' },

    { id: 'ch01-n3', ch: 'ch01', kp: 'ch01-7', tier: 1, type: 'fill', difficulty: 2, tags: ['concept'],
      stem: '程序用命令行参数算平均值。为了避免没传参数时**除以 0** 崩溃，应先判断什么条件并提前 return？（写出条件表达式）',
      answer: ['args.length == 0', 'args.length==0', 'args.length < 1', 'args.length<1'],
      explain: '没有参数时 args.length 为 0，做 `sum / args.length` 会除零（int 除零抛 ArithmeticException）。标准写法：`if (args.length == 0) { 打印用法; return; }` 提前返回。这就是正文强调的“边界处理”——一个能用的程序必须有输入校验。' },

    { id: 'ch01-n4', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '运行命令 `java Q 3 5 8`，写出程序的完整输出（逐行）。',
      args: ['3', '5', '8'],
      code: 'public class Q {\n    public static void main(String[] args) {\n        if (args.length == 0) {\n            System.out.println("usage: java Q <numbers...>");\n            return;\n        }\n        int sum = 0;\n        for (int i = 0; i < args.length; i++) {\n            sum += Integer.parseInt(args[i]);\n        }\n        System.out.println("count = " + args.length);\n        System.out.println("sum = " + sum);\n        System.out.printf("avg = %.2f%n", sum / (double) args.length);\n    }\n}',
      answer: 'count = 3\nsum = 16\navg = 5.33',
      explain: '① args.length=3 → count=3；② parseInt 后 3+5+8=16 → sum=16；③ `sum / (double) args.length` = 16/3.0 = 5.333…，`%.2f` 四舍五入 → avg = 5.33。三个细节：args 是字符串、要 parseInt、除之前转 double。' },

    { id: 'ch01-n5', ch: 'ch01', kp: 'ch01-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: 'printf 格式串里的 `%n` 表示什么？',
      options: [
        { text: '换行（跨平台，Windows 上等价于 \\r\\n）', correct: true },
        { text: '输出百分号' },
        { text: '输出数字 n' },
        { text: '制表符' }
      ],
      explain: '`%n` 是 printf 的跨平台换行符（比 "\\n" 更规范）；要输出百分号写 `%%`。注意 printf 不会自动换行，必须自己加 `%n` 或 "\\n"。' },

    { id: 'ch01-n6', ch: 'ch01', kp: 'ch01-8', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: 'printf 格式串 `%-8s` 中，负号与数字 8 分别表示什么？',
      options: [
        { text: '负号表示左对齐，8 表示最小宽度（不够补空格）', correct: true },
        { text: '负号表示输出负数，8 表示小数位数' },
        { text: '负号表示右对齐，8 表示最大宽度' },
        { text: '负号表示换行，8 表示制表位' }
      ],
      explain: '`%[-][宽度][.精度]转换符`：负号 = 左对齐（默认右对齐），数字 = 最小宽度（内容短则补空格、内容长则不截断）。所以 `%-8s` 输出内容后补空格到 8 列，`%8s` 则是前面补空格。表格对齐就靠这个。' },

    { id: 'ch01-n7', ch: 'ch01', kp: 'ch01-8', tier: 1, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '`System.out.printf("%-5d|%5d", 42, 42);` 的输出是？',
      options: [
        { text: '`42   |   42`', correct: true },
        { text: '`   42|42   `' },
        { text: '`42|42`' },
        { text: '`42   |42   `' }
      ],
      explain: '%-5d 左对齐：42 后补 3 个空格 → "42   "；%5d 右对齐：42 前补 3 个空格 → "   42"；中间用 `|` 分隔。所以是 `42   |   42`。数空格对不齐是控制台表格题最常见的丢分点。' },

    { id: 'ch01-n8', ch: 'ch01', kp: 'ch01-8', tier: 1, type: 'fill', difficulty: 1, tags: ['syntax'],
      stem: '填空：要让整数 42 在宽度 6 的格子里**左对齐**，printf 格式串应写成 `%_____d`（填符号+数字）。',
      answer: ['-6', '-6 '],
      explain: '左对齐 = 负号：`%-6d` → "42    "（42 后 4 个空格）；`%6d` 是右对齐 → "    42"。记住“负号=左对齐”，表格题里的字符串通常左对齐、数字右对齐。' },

    { id: 'ch01-n9', ch: 'ch01', kp: 'ch01-8', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面 printf 程序的完整输出（逐行，注意空格）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        System.out.printf("%-6s %5d%n", "ab", 12);\n        System.out.printf("%6s %5d%n", "ab", 345);\n        System.out.printf("%-4d|%n", 7);\n    }\n}',
      answer: 'ab        12\n    ab   345\n7   |',
      explain: '第一行：%-6s "ab" → "ab    "（补 4 空格），空格，%5d 12 → "   12" → `ab        12`（ab 后 4+1+3=8 个空格再 12）；第二行：%6s "ab" → "    ab"，空格，%5d 345 → "  345" → `    ab   345`；第三行：%-4d 7 → "7   "，再输出 `|` → `7   |`。' },

    { id: 'ch01-n10', ch: 'ch01', kp: 'ch01-8', tier: 4, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '<b>综合</b>：读这个成绩表格程序，<b>写出完整输出（逐行，空格必须数对）</b>。追问：① 表头三个字段的对齐方式？② 每行 grade 是怎么算的？③ avg 为什么打印 85.0？',
      code: 'public class Q {\n    public static void main(String[] args) {\n        String[] names = {"Ann", "Bob", "Cid"};\n        int[] scores = {92, 78, 85};\n        System.out.printf("%-8s %6s %6s%n", "name", "score", "grade");\n        for (int i = 0; i < names.length; i++) {\n            String grade;\n            if (scores[i] >= 90) {\n                grade = "A";\n            } else if (scores[i] >= 80) {\n                grade = "B";\n            } else {\n                grade = "C";\n            }\n            System.out.printf("%-8s %6d %6s%n", names[i], scores[i], grade);\n        }\n        int sum = 0;\n        for (int i = 0; i < scores.length; i++) {\n            sum += scores[i];\n        }\n        System.out.printf("avg = %.1f%n", sum / (double) scores.length);\n        System.out.println("rows = " + (names.length + 2));\n    }\n}',
      answer: 'name      score  grade\nAnn          92      A\nBob          78      C\nCid          85      B\navg = 85.0\nrows = 5',
      explain: '① 表头 `%-8s %6s %6s`：name 左对齐 8 列、score/grade 右对齐 6 列；② 分数 ≥90 为 A、≥80 为 B、其余 C：Ann(92→A)、Bob(78→C)、Cid(85→B)；③ avg = (92+78+85)/3.0 = 85.0，`%.1f` 打印 85.0；④ rows = 3+2 = 5。控制台表格题的关键是逐个格式符数宽度——考试常以“读程序写输出”形式考。' },

    { id: 'ch01-d1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: '一个 Java 程序的 main 方法签名，下列哪一个是 JVM 认可的入口？',
      options: [
        { text: '`public static void main(String[] args)`', correct: true },
        { text: '`public void main(String[] args)`' },
        { text: '`public static int main(String[] args)`' },
        { text: '`static void main()`' }
      ],
      explain: '入口签名必须严格是 `public static void main(String[] args)`：public（JVM 能访问）、static（不需要对象就能调用）、void（无返回值）、参数是 String 数组。少了 static、返回 int、参数不对都会导致运行时“找不到 main 方法”。' },

    { id: 'ch01-d2', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'tf', difficulty: 1, tags: ['syntax'],
      stem: '判断：一个类即使没有 main 方法，也能被 javac 正常编译。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: 'javac 只管语法/类型，不要求有 main；没有 main 的类可以编译（常作为工具类/实体类），只是不能作为程序入口运行（`java X` 会报找不到 main 方法）。' },

    { id: 'ch01-d3', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'fill', difficulty: 1, tags: ['syntax'],
      stem: '填空：Java 用一对 `{ }` 把多条语句组织成代码块，方法体、if 体、循环体都靠它界定 `_____`（两字）。',
      answer: ['作用域', '范围'],
      explain: '花括号 `{}` 既表示“代码块”，也决定变量的作用域：块内声明的变量出了块就失效。所以“变量在哪声明”直接影响它在哪里可见——这也是后续局部变量、字段、静态初始化块的基础。' },

    { id: 'ch01-d4', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: '`javac` 与 `java` 两个命令的分工是？',
      options: [
        { text: 'javac 编译 .java → .class；java 启动 JVM 运行 .class', correct: true },
        { text: 'javac 运行程序；java 编译程序' },
        { text: '两者等价，随便用哪个' },
        { text: 'javac 用于 Windows，java 用于 Mac' }
      ],
      explain: 'javac（Java Compiler）负责编译：把源码翻译成字节码 .class；java 负责运行：启动 JVM 加载并执行 .class。所以“改代码后忘记重新 javac”会导致运行的是旧版本——这是新手常见困惑。' },

    { id: 'ch01-d5', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '修改了 `Demo.java` 后直接运行 `java Demo`，看到的却是旧结果。最可能的原因是？',
      options: [
        { text: '没有重新执行 javac，运行的还是旧的 Demo.class', correct: true },
        { text: 'JVM 缓存了结果' },
        { text: 'java 命令坏了' },
        { text: '修改的代码没有保存' }
      ],
      explain: '`java Demo` 运行的是 .class 字节码，不是 .java 源码。改了源码必须重新 `javac Demo.java` 生成新的 .class 再运行。（IDE 会自动编译，命令行下需要手动执行。）' },

    /* ============================================================ ch02 变量、类型与字符串 */
    { id: 'ch02-q1', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['trap', 'exam'],
      stem: '已知 `int a = 7, b = 2;`，下面哪一项正确描述了 `a / b` 的值和类型？',
      options: [
        { text: '3.5，double' },
        { text: '3，int', correct: true },
        { text: '4，int（四舍五入）' },
        { text: '3.0，double' }
      ],
      explain: 'int / int 是**整数除法**：结果直接截断小数部分，不是四舍五入，7/2 = 3。想得到 3.5，必须让至少一边是浮点数：`7 / 2.0`、`(double) 7 / 2` 或 `7.0 / 2`。' },

    { id: 'ch02-q2', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'predict', difficulty: 2, tags: ['output', 'trap', 'exam'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int a = 7, b = 2;\n        System.out.println(a / b);\n        System.out.println(a / 2.0);\n        System.out.println("sum=" + a + b);\n    }\n}',
      answer: '3\n3.5\nsum=72',
      explain: '逐行推演：① a/b 是 int/int → 3；② 2.0 是 double，a 自动提升为 double → 7.0/2.0 = 3.5；③ `+` 从左到右结合，先算 "sum=" + a 得到字符串 "sum=7"，再拼 b 得到 "sum=72"。字符串一旦出现在 + 的左边，后面的数字就只是拼接，不做加法（要得到 9 得写 "sum=" + (a + b)）。' },

    { id: 'ch02-q3', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap', 'exam'],
      stem: '下面程序输出什么？',
      code: 'String s1 = "abc";\nString s2 = new String("abc");\nSystem.out.println(s1 == s2);\nSystem.out.println(s1.equals(s2));',
      options: [
        { text: 'true 然后 true' },
        { text: 'false 然后 true', correct: true },
        { text: 'true 然后 false' },
        { text: 'false 然后 false' }
      ],
      explain: '`==` 比较的是**引用**（是否指向同一个对象）。s2 用 new 显式创建，是堆里另一个 String 对象，所以 s1 == s2 为 false。`equals` 被 String 覆盖成比较字符内容，所以为 true。比较字符串内容永远用 equals，不要用 ==。' },

    { id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'tf', difficulty: 2, tags: ['trap'],
      stem: '判断：`int x = 3.9;` 能编译通过，且 x 的值是 3。',
      options: [
        { text: '正确（True）' },
        { text: '错误（False）', correct: true }
      ],
      explain: 'double 不能自动收窄成 int（会丢精度），javac 报 “incompatible types: possible lossy conversion from double to int”。必须显式强转：`int x = (int) 3.9;`，此时 x 才是 3（截断，不是四舍五入）。' },

    { id: 'ch02-q5', ch: 'ch02', kp: 'ch02-2', tier: 2, type: 'mcq', difficulty: 3, tags: ['trap', 'exam'],
      stem: '执行下面两行后，x 的值是多少？',
      code: 'int x = 2147483647;\nx = x + 1;',
      options: [
        { text: '2147483648' },
        { text: '-2147483648', correct: true },
        { text: '0' },
        { text: '编译错误' }
      ],
      explain: 'int 是 32 位有符号整数，范围 -2^31 ~ 2^31-1（-2147483648 ~ 2147483647）。最大值加 1 会**溢出回绕**到最小值 -2147483648（补码进位）。Java 对 int 溢出不报错、不提示，是典型的无声 bug。' },

    { id: 'ch02-q6', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'fill', difficulty: 1, tags: ['trap'],
      stem: '填空：执行 `double d = 3.99; int n = (int) d;` 之后，n 的值是 _____。',
      answer: '3',
      explain: '`(int)` 强转对浮点数做**截断**（向零取整），不是四舍五入：3.99 → 3，-3.99 → -3。要四舍五入请用 Math.round(3.99) 得到 4（long 类型）。' },

    { id: 'ch02-q7', ch: 'ch02', kp: 'ch02-1', tier: 2, type: 'multi', difficulty: 2, tags: ['syntax', 'exam'],
      stem: '下列哪些是**合法**的 Java 标识符？（多选）',
      options: [
        { text: '`_count`', correct: true },
        { text: '`2ndValue`' },
        { text: '`total$`', correct: true },
        { text: '`my-name`' },
        { text: '`class`' },
        { text: '`MAX_SIZE`', correct: true }
      ],
      explain: '标识符规则：首字符可以是字母、下划线 _ 或美元符 $；后续可以再加数字；不能是关键字；不能含 - 或空格。所以 _count、total$、MAX_SIZE 合法；2ndValue（数字开头）、my-name（连字符）、class（关键字）非法。' },

    { id: 'ch02-q8', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'predict', difficulty: 2, tags: ['output', 'trap'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        double d = 10 / 4;\n        System.out.println(d);\n        System.out.println(10 / 4.0);\n    }\n}',
      answer: '2.0\n2.5',
      explain: '① `10 / 4` 两边都是 int，先做整数除法得 2，**然后**才把 2 存进 double 变成 2.0——类型提升发生在运算之后，救不回来；② `10 / 4.0` 中 4.0 是 double，10 先提升为 double 再除，得 2.5。这是“把结果存成 double 就会自动精确”的典型误区。' },

    { id: 'ch02-q9', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['output'],
      stem: '执行 `String s = "Programming"; System.out.println(s.substring(3, 7));` 输出什么？',
      options: [
        { text: 'gram', correct: true },
        { text: 'gra' },
        { text: 'ogra' },
        { text: 'ramm' }
      ],
      explain: 'substring(begin, end) 取 [begin, end) 半开区间：下标 3、4、5、6。P(0) r(1) o(2) g(3) r(4) a(5) m(6) m(7)… → "gram"。第二个参数是**结束下标**（不含），不是长度，这是最常见的差一错误来源。' },

    { id: 'ch02-k1', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '已知 `String a = "hi"; String b = new String("hi");`，下面哪组输出是对的？',
      options: [
        { text: '`a == b` 为 true，`a.equals(b)` 为 true' },
        { text: '`a == b` 为 false，`a.equals(b)` 为 true', correct: true },
        { text: '`a == b` 为 true，`a.equals(b)` 为 false' },
        { text: '两者都为 false' }
      ],
      explain: '`==` 对引用类型比较的是**是否指向同一个对象**；`new String("hi")` 一定在堆里产生新对象，所以 a == b 为 false。`equals` 被 String 覆盖成比较字符内容，"hi" 与 "hi" 相同 → true。`new String("hi")` 与字面量 "hi" 是两个不同的对象，字符串池的复用只发生在字面量之间。' },

    { id: 'ch02-k2', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'predict', difficulty: 2, tags: ['output', 'trap'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        String a = "hello";\n        String b = "hel" + "lo";\n        String c = new String("hello");\n        System.out.println(a == b);\n        System.out.println(a == c);\n        System.out.println(a.equals(c));\n        System.out.println(a.equals(b.toUpperCase()));\n    }\n}',
      answer: 'true\nfalse\ntrue\nfalse',
      explain: '① `"hel" + "lo"` 是编译期常量拼接，结果仍进字符串池，与字面量 "hello" 是**同一个对象** → true；② `new String("hello")` 在堆里新建对象 → false；③ equals 比较内容 → true；④ `b.toUpperCase()` 返回 "HELLO"，与 "hello" 内容不同 → false。记法：`==` 问“是不是同一个”，`equals` 问“长得一样吗”。' },

    { id: 'ch02-f1', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '程序本意是求 7 除以 2 的平均值 3.5，但输出 3.0。指出哪一行有问题并改正。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int total = 7;\n        int count = 2;\n        double avg = total / count;\n        System.out.println(avg);\n    }\n}',
      answer: '第 5 行：`total / count` 两边都是 int，先做整数除法得 3 再转 double。应改为 `double avg = (double) total / count;`',
      accept: [
        { hint: '指出行号（第 5 行）', any: ['第5行', '第 5 行', '5行', '行5', 'line5'] },
        { hint: '在除法前把 total 强转成 double（或写 7.0 / 2.0）', any: ['(double)total', '(double) total', '强转', '转成double', '7.0', '2.0', 'double'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int total = 7;\n        int count = 2;\n        double avg = (double) total / count;\n        System.out.println(avg);\n    }\n}',
      explain: '`int / int` 的结果**先**按整数除法算出 3，之后赋给 double 才变成 3.0——类型提升发生在运算之后，救不回来。要得到 3.5，必须让运算时至少一边是浮点数：`(double) total / count`、`total / (double) count` 或 `total / 2.0`。' },

    { id: 'ch02-f2', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '程序本意是判断两个字符串内容是否相同，但输出了 `not equal`。指出哪一行有问题并改正。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        String a = "hello";\n        String b = new String("hello");\n        if (a == b) {\n            System.out.println("equal");\n        } else {\n            System.out.println("not equal");\n        }\n    }\n}',
      answer: '第 5 行：比较字符串内容不能用 `a == b`（比的是引用），应改为 `if (a.equals(b))`',
      accept: [
        { hint: '指出行号（第 5 行）', any: ['第5行', '第 5 行', '5行', '行5', 'line5'] },
        { hint: '把 `==` 改成 `equals`（`a.equals(b)`）', any: ['equals', '用equals', '改成equals'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        String a = "hello";\n        String b = new String("hello");\n        if (a.equals(b)) {\n            System.out.println("equal");\n        } else {\n            System.out.println("not equal");\n        }\n    }\n}',
      explain: '`==` 对引用类型比较的是“是否指向同一个对象”：`new String("hello")` 一定创建新对象，所以 a == b 为 false。`equals` 被 String 覆盖成比较字符内容，才是我们想要的判断。注意方向：`a.equals(b)` 更安全（a 为 null 时会 NPE 但 b 不会）。' },

    { id: 'ch02-p1', ch: 'ch02', kp: 'ch02-4', tier: 4, type: 'predict', difficulty: 2, tags: ['output', 'trap'],
      stem: '读下面的程序，<b>写出完整输出（逐行）</b>。追问：① 第 2 行的 int 溢出后是多少？② `s1 == s2` 为什么是 true，而 `s1 == s3` 是 false？③ 字符 a 参与加法时输出什么，强转回 char 后又输出什么？',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int x = 2147483647;\n        x = x + 1;\n        System.out.println(x);\n        double d = 10 / 4;\n        System.out.println(d);\n        System.out.println(10 / 4.0);\n        System.out.println(10 % 3);\n        System.out.println(-10 % 3);\n        System.out.println(10 % -3);\n        String s1 = "abc";\n        String s2 = "ab" + "c";\n        String s3 = new String("abc");\n        System.out.println(s1 == s2);\n        System.out.println(s1 == s3);\n        System.out.println(s1.equals(s3));\n        System.out.println(1 + 2 + "" + 3);\n        System.out.println("" + 1 + 2 + 3);\n        System.out.println(\'a\' + 1);\n        System.out.println((char) (\'a\' + 1));\n    }\n}',
      answer: '-2147483648\n2.0\n2.5\n1\n-1\n1\ntrue\nfalse\ntrue\n33\n123\n98\nb',
      explain: '① int 最大值 +1 溢出回绕到 -2147483648；② `10 / 4` 是 int 除法得 2，存进 double 后是 2.0；`10 / 4.0` 才是 2.5；③ 取余符号随被除数：10%3=1、-10%3=-1、10%-3=1；④ `"ab" + "c"` 是编译期常量拼接，结果在字符串池里，与字面量 "abc" 是同一对象 → true；`new String("abc")` 在堆里新对象 → false；equals 比内容 → true；⑤ `1 + 2 + "" + 3`：1+2=3，遇到 "" 变字符串 "3"，再拼 3 → `33`；⑥ `"" + 1 + 2 + 3` 全是拼接 → `123`；⑦ 字符 a 参与加法时提升为 int → 97+1 = 98；⑧ 强转回 char 后 → 字符 b。' },

    { id: 'ch02-k3', ch: 'ch02', kp: 'ch02-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: '执行 `int x = 5; String s = x % 2 == 0 ? "even" : "odd";` 之后，s 的值是？',
      options: [
        { text: '`"even"`' },
        { text: '`"odd"`', correct: true },
        { text: '`true`' },
        { text: '编译错误：三元运算符不能赋给 String' }
      ],
      explain: '三元运算符的形式是 `条件 ? 值1 : 值2`：条件为 true 得到值1，false 得到值2。x%2==0 就是 5%2==0，结果为 false → 取 "odd"。三元表达式本身是一个**值**，可以直接赋给变量、作为方法实参或 return；它适合替代“只有两分支且都返回同类型值”的 if/else。' },

    { id: 'ch02-k4', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int a = 7;\n        int b = 3;\n        int max = a > b ? a : b;\n        System.out.println(max);\n        String s = a % 2 == 0 ? "even" : "odd";\n        System.out.println(s);\n        int c = a > 5 ? (b > 5 ? 1 : 2) : 3;\n        System.out.println(c);\n        char grade = 85 >= 60 ? \'P\' : \'F\';\n        System.out.println(grade);\n        System.out.println(a > b ? "yes" : "no");\n    }\n}',
      answer: '7\nodd\n2\nP\nyes',
      explain: '① `a > b ? a : b` → 7>3 为真 → 7；② `a % 2 == 0 ? "even" : "odd"` → 7%2=1 不等于 0 → false → "odd"；③ 嵌套三元 `a > 5 ? (b > 5 ? 1 : 2) : 3`：a=7>5 为真，再看 b=3>5 为假 → 取 2；④ `85 >= 60 ? P : F` → 真 → 字符 P；⑤ `a > b ? "yes" : "no"` → 真 → "yes"。读三元表达式的口诀：先定条件真假，再取对应的那个分支，嵌套时从外往里一层层取。' },

    { id: 'ch02-t1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: 'Java 的变量声明 `int score = 90;` 中，三部分分别是什么？',
      options: [
        { text: '类型 int、变量名 score、初始值 90', correct: true },
        { text: '变量名 int、类型 score、初始值 90' },
        { text: '类型 int、方法名 score、返回值 90' },
        { text: '关键字 int、常量 score、类型 90' }
      ],
      explain: '变量三要素：**类型**决定能存什么、占多少位（int）；**名字**是引用这个格子的标签（score）；**值**是存进去的数据（90）。声明后，赋值 `score = 95;` 只改值不改变量名/类型。' },

    { id: 'ch02-t2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
      stem: '判断：`boolean` 类型只有 `true` 和 `false` 两个值，不能赋 1 或 0。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: 'Java 是强类型语言，boolean 只有 true/false 两个字面量，不能像 C 那样用 1/0 代替（`boolean b = 1;` 会编译错误）。关系运算（`a > b`）、逻辑运算（`&& || !`）的结果都是 boolean，正好作为 if/while 的条件。' },

    { id: 'ch02-t3', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: '下面字面量中，哪一个的**类型是 long**？',
      options: [
        { text: '`10`' },
        { text: '`10L`', correct: true },
        { text: '`10.0`' },
        { text: '`10.0f`' }
      ],
      explain: 'Java 字面量的默认类型：整数字面量默认 int（10），加后缀 L 表示 long（10L）；小数字面量默认 double（10.0），加 f 表示 float（10.0f）、加 d 可显式 double。long 与 int 参与运算会自动提升，但把超过 int 范围的值赋给 int 会编译错误。' },

    { id: 'ch02-t4', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'tf', difficulty: 2, tags: ['trap'],
      stem: '判断：`(int) -3.9` 的结果是 -4，因为强转会四舍五入。',
      options: [
        { text: '正确（True）' },
        { text: '错误（False）', correct: true }
      ],
      explain: '`(int)` 强转对浮点数做**截断**（向零取整）：-3.9 → -3（不是 -4），3.9 → 3。四舍五入要用 Math.round（返回 long）：Math.round(-3.9) = -4。这个区别在“平均分取整”“金额计算”题里经常设陷阱。' },

    { id: 'ch02-t5', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'fill', difficulty: 1, tags: ['syntax'],
      stem: '填空：局部变量 `int x;` 声明后没有赋值就直接 `System.out.println(x);`，会发生什么？（用两个汉字回答）',
      answer: ['编译错误', '编译报错', '编译不通过'],
      explain: '局部变量**没有默认值**，使用前必须显式赋值，否则 javac 报 `variable x might not have been initialized`（编译错误，不是运行时 0）。对比：**字段**（类成员）有默认值，int 字段默认 0、boolean 默认 false、引用默认 null。' },

    { id: 'ch02-t6', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int a = 2 + 3 * 4;\n        int b = (2 + 3) * 4;\n        int c = 10 - 4 - 3;\n        int d = 100 / 10 / 2;\n        System.out.println(a);\n        System.out.println(b);\n        System.out.println(c);\n        System.out.println(d);\n        System.out.println(1 + 2 + 3 * 2);\n    }\n}',
      answer: '14\n20\n3\n5\n9',
      explain: '① 乘除优先于加减：2 + 3*4 = 14；② 括号改变优先级：(2+3)*4 = 20；③ 减号与除号都是**同级左结合**：10-4-3 = (10-4)-3 = 3；④ 100/10/2 = (100/10)/2 = 5；⑤ 1 + 2 + 3*2 = 1+2+6 = 9。优先级口诀：括号 → 单目 → 乘除模 → 加减 → 关系 → 逻辑 → 赋值。' },

    { id: 'ch02-t7', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '执行 `int a = 7; int b = 3;` 后，`-a % b` 的值是？',
      options: [
        { text: '1' },
        { text: '-1', correct: true },
        { text: '2' },
        { text: '0' }
      ],
      explain: 'Java 取余结果的符号与**被除数**相同：-7 % 3 = -1（7 % 3 = 1，负数被除数带负号）。而 7 % -3 = 1（被除数为正）。若想得到“数学意义上的非负余数”，要用 `((a % b) + b) % b`。' },

    { id: 'ch02-f3', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '程序本意是求 7 和 2 的平均值 3.5，实际输出 3.0。指出哪一行有问题并改正。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int total = 7;\n        int count = 2;\n        double avg = total / count * 1.0;\n        System.out.println(avg);\n    }\n}',
      answer: '第 5 行：`total / count * 1.0` 先做整数除法得 3，再乘 1.0 变 3.0。应改为 `total * 1.0 / count`（或 `(double) total / count`）',
      accept: [
        { hint: '指出行号（第 5 行）', any: ['第5行', '第 5 行', '5行', '行5', 'line5'] },
        { hint: '把乘法 1.0 提到除法之前（或强转 total）', any: ['*1.0先', '先乘', 'total*1.0', '(double)total', '(double) total', '强转', '乘在除前面'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int total = 7;\n        int count = 2;\n        double avg = total * 1.0 / count;\n        System.out.println(avg);\n    }\n}',
      explain: '表达式的求值顺序是**从左到右**：`total / count` 两边都是 int，先算出整数 3，再 `3 * 1.0` 得 3.0——精度已经丢了。要得到 3.5，必须让除法发生前至少一边是 double：`total * 1.0 / count`、`(double) total / count` 或 `total / 2.0`。' },

    { id: 'ch02-t9', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'multi', difficulty: 2, tags: ['trap'],
      stem: '已知 `int a = 5; int b = 2;`，下列哪些表达式的值等于 2.5？（多选）',
      options: [
        { text: '`a / b + 0.5`', correct: true },
        { text: '`(double) a / b`', correct: true },
        { text: '`a / (double) b`', correct: true },
        { text: '`(double) (a / b)`' },
        { text: '`a / b * 1.0`' }
      ],
      explain: 'A：a/b=2，+0.5=2.5 ✓；B、C 让除法在 double 上进行 → 2.5 ✓；D 先算整数除法得 2 再强转 → 2.0；E 先整除得 2 再乘 1.0 → 2.0。判断这类题只看“除法发生那一刻，两边的类型”。' },

    { id: 'ch02-t10', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int x = 5;\n        int y = 2;\n        System.out.println(x / y);\n        System.out.println(x / (double) y);\n        System.out.println(x % y);\n        System.out.println(-x % y);\n        System.out.println((x + y) * (x - y));\n    }\n}',
      answer: '2\n2.5\n1\n-1\n21',
      explain: '① `5/2` 整数除法 → 2；② `5/(double)2` → 2.5；③ `5%2` → 1；④ `-5%2` → -1（余数符号随被除数）；⑤ `(5+2)*(5-2)` = 7*3 = 21。注意第 2 行输出 `2.5`（double 打印时若值为整数会带 .0，这里非整数）。' },

    { id: 'ch02-t11', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '`int score = 85; String grade = score >= 90 ? "A" : score >= 60 ? "P" : "F";` 执行后 grade 是？',
      options: [
        { text: '"A"' },
        { text: '"P"', correct: true },
        { text: '"F"' },
        { text: '编译错误：三元运算符不能嵌套' }
      ],
      explain: '三元运算符可以嵌套，执行顺序是“从外到内、命中即停”：先判 score>=90（85 不满足）→ 进入 else 分支的 `score >= 60 ? "P" : "F"` → 85>=60 为真 → "P"。等价于 if/else if/else 链，只是写成一个表达式。' },

    { id: 'ch02-t12', ch: 'ch02', kp: 'ch02-5', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>average</code>：返回 a、b 的平均值（<b>返回类型是 double</b>，不能用整数除法把小数弄丢）。<br>已给出测试入口，不要修改 <code>main</code>。',
      starter: 'public class Q {\n    static double average(int a, int b) {\n        // TODO: 返回 a、b 的平均值（必须返回 double，不能只除成 int）\n        return 0;\n    }\n    public static void main(String[] args) {\n        int a = Integer.parseInt(args[0]);\n        int b = Integer.parseInt(args[1]);\n        System.out.println(average(a, b));\n    }\n}',
      solution: 'public class Q {\n    static double average(int a, int b) {\n        return (a + b) / 2.0;\n    }\n    public static void main(String[] args) {\n        int a = Integer.parseInt(args[0]);\n        int b = Integer.parseInt(args[1]);\n        System.out.println(average(a, b));\n    }\n}',
      tests: [
        { args: ['7', '2'], expect: '4.5' },
        { args: ['-4', '0'], expect: '-2.0' }
      ],
      explain: '关键点是“先转 double 再除”：`(a + b) / 2.0`。如果写 `(a + b) / 2`，int 除法先把 9/2 算成 4，再返回 double 变成 4.0，平均值就错了。测试里 7、2 的答案是 4.5，负数 -4、0 的答案是 -2.0（double 打印整数时带 .0）。' },

    { id: 'ch02-t13', ch: 'ch02', kp: 'ch02-3', tier: 4, type: 'predict', difficulty: 3, tags: ['output', 'trap'],
      stem: '读下面的程序，<b>写出完整输出（逐行）</b>。追问：① 为什么 `d1` 是 2.0 而 `d2` 是 2.5？② `s + a + b` 与 `s + (a + b)` 差在哪？③ `c + b` 与 `(char)(c + b)` 分别是什么？',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int a = 10;\n        int b = 4;\n        System.out.println(a + b);\n        System.out.println(a - b);\n        System.out.println(a * b);\n        System.out.println(a / b);\n        System.out.println(a % b);\n        double d1 = a / b;\n        double d2 = a / (double) b;\n        System.out.println(d1);\n        System.out.println(d2);\n        String s = "sum=";\n        System.out.println(s + a + b);\n        System.out.println(s + (a + b));\n        int max = a > b ? a : b;\n        int min = a < b ? a : b;\n        System.out.println(max + "," + min);\n        char c = \'a\';\n        System.out.println(c + b);\n        System.out.println((char) (c + b));\n    }\n}',
      answer: '14\n6\n40\n2\n2\n2.0\n2.5\nsum=104\nsum=14\n10,4\n101\ne',
      explain: '① `a / b` 是 int 除法得 2，再赋给 double → 2.0；`a / (double) b` 在 double 上除 → 2.5。② `s + a + b` 从左到右：先拼 "sum=10"，再拼 4 → "sum=104"；`s + (a + b)` 先算括号 14 再拼 → "sum=14"。③ 字符 a 参与加法提升为 int 97+4 = 101；强转回 char → 字符 e（a 往后数 4 个字母）。' },

    { id: 'ch02-c1', ch: 'ch02', kp: 'ch02-2', tier: 3, type: 'code', difficulty: 1, tags: ['code'],
      stem: '补全方法 <code>isEven</code>：n 是偶数返回 true，否则返回 false。',
      starter: 'public class Q {\n    static boolean isEven(int n) {\n        return false;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(isEven(n));\n    }\n}',
      solution: 'public class Q {\n    static boolean isEven(int n) {\n        return n % 2 == 0;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(isEven(n));\n    }\n}',
      tests: [
        { args: ['4'], expect: 'true' },
        { args: ['7'], expect: 'false' },
        { args: ['0'], expect: 'true' },
        { args: ['-2'], expect: 'true' }
      ],
      explain: '偶数即 n % 2 == 0，直接返回 boolean 表达式。注意 0 是偶数、负数 -2 也是偶数（Java 取余 -2%2 = 0）。' },

    { id: 'ch02-c2', ch: 'ch02', kp: 'ch02-3', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>circleArea</code>：返回半径 r 的圆面积（π 取 3.14，返回 double）。',
      starter: 'public class Q {\n    static double circleArea(double r) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        double r = Double.parseDouble(args[0]);\n        System.out.println(circleArea(r));\n    }\n}',
      solution: 'public class Q {\n    static double circleArea(double r) {\n        return 3.14 * r * r;\n    }\n    public static void main(String[] args) {\n        double r = Double.parseDouble(args[0]);\n        System.out.println(circleArea(r));\n    }\n}',
      tests: [
        { args: ['2'], expect: '12.56' },
        { args: ['0'], expect: '0.0' },
        { args: ['1'], expect: '3.14' }
      ],
      explain: '面积 = πr²，写 3.14 * r * r。注意返回类型是 double，r 是 double，运算结果自然为 double；整数 0 会打印成 0.0（double 的整数打印格式）。' },

    { id: 'ch02-c3', ch: 'ch02', kp: 'ch02-4', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>lastDigit</code>：返回非负整数 n 的个位数字。',
      starter: 'public class Q {\n    static int lastDigit(int n) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(lastDigit(n));\n    }\n}',
      solution: 'public class Q {\n    static int lastDigit(int n) {\n        return n % 10;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(lastDigit(n));\n    }\n}',
      tests: [
        { args: ['123'], expect: '3' },
        { args: ['10'], expect: '0' },
        { args: ['7'], expect: '7' }
      ],
      explain: '对 10 取余就得到个位：123 % 10 = 3、10 % 10 = 0。配合 n / 10 可以逐位处理（数位和、反转、进制转换都靠它）。' },

    { id: 'ch02-n1', ch: 'ch02', kp: 'ch02-8', tier: 1, type: 'mcq', difficulty: 1, tags: ['trap'],
      stem: '在 Java 中执行 `System.out.println(0.1 + 0.2);`，输出什么？',
      options: [
        { text: '`0.30000000000000004`', correct: true },
        { text: '`0.3`' },
        { text: '`0.30`' },
        { text: '编译错误' }
      ],
      explain: '0.1 与 0.2 都不能用二进制有限位精确表示（就像十进制写不出 1/3），double 只保留约 15~16 位有效数字，相加后误差暴露：0.1+0.2 = 0.30000000000000004。这是浮点数存储机制决定的，不是 Java 的 bug。' },

    { id: 'ch02-n2', ch: 'ch02', kp: 'ch02-8', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '为什么 0.1 在 double 里不是一个精确值？',
      options: [
        { text: '0.1 的二进制是无限循环小数，double 只能截取有限位尾数', correct: true },
        { text: '因为 Java 把小数当成字符串存储' },
        { text: '因为 double 只能存整数' },
        { text: '因为输出时自动四舍五入了' }
      ],
      explain: '0.1 = 0.0001100110011…（二进制无限循环），64 位 double 只有 52 位尾数，超出部分被截断，所以存进去的是“极接近但不等于 0.1”的数。误差很小但会累积，也会在 == 比较时暴露。float 更短（约 7 位有效数字），误差更大。' },

    { id: 'ch02-n3', ch: 'ch02', kp: 'ch02-8', tier: 1, type: 'tf', difficulty: 1, tags: ['trap'],
      stem: '判断：比较两个 double 是否相等时，可以直接用 `==`，结果一定可靠。',
      options: [
        { text: '正确（True）' },
        { text: '错误（False）', correct: true }
      ],
      explain: '浮点运算有误差，`0.1 + 0.2 == 0.3` 结果是 false！正确做法是容差比较：`Math.abs(a - b) &lt; 1e-9`。如果只是显示，用 printf("%.2f") 四舍五入即可，但不要为了显示去改存储值。' },

    { id: 'ch02-n4', ch: 'ch02', kp: 'ch02-8', tier: 2, type: 'predict', difficulty: 2, tags: ['output', 'trap'],
      stem: '写出下面浮点数程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        System.out.println(0.1 + 0.2);\n        System.out.println(0.1 + 0.2 == 0.3);\n        System.out.println(Math.abs(0.1 + 0.2 - 0.3) < 1e-9);\n        System.out.println(1.0 / 3.0);\n        System.out.printf("%.2f%n", 0.1 + 0.2);\n    }\n}',
      answer: '0.30000000000000004\nfalse\ntrue\n0.3333333333333333\n0.30',
      explain: '① 0.1+0.2 = 0.30000000000000004（二进制误差）；② 与 0.3 用 == 比较 → false；③ 容差比较 Math.abs(差) &lt; 1e-9 → true；④ 1.0/3.0 = 0.3333333333333333（double 最多约 17 位有效数字）；⑤ printf %.2f 显示时四舍五入 → 0.30（变量本身没变）。' },

    { id: 'ch02-n5', ch: 'ch02', kp: 'ch02-8', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '做金额计算（分、元）时，为什么不建议直接用 double？',
      options: [
        { text: '浮点误差会累积，可能出现 0.01 元的偏差；应改用整数分或 BigDecimal', correct: true },
        { text: 'double 不能存小数' },
        { text: 'double 运算比 int 慢 1000 倍' },
        { text: 'double 不支持加减乘除' }
      ],
      explain: '金额对精度敏感：double 的 0.1 本身就有误差，反复累加/乘除后可能得到 99.99999999999999 这样的值。工程做法：以“分”为单位用 int/long 存，或用 BigDecimal。这是浮点误差最典型的现实影响。' },

    { id: 'ch02-n6', ch: 'ch02', kp: 'ch02-9', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: '`"Programming".substring(3, 7)` 返回什么？',
      options: [
        { text: '`"gram"`', correct: true },
        { text: '`"gramm"`' },
        { text: '`"rogr"`' },
        { text: '`"ogra"`' }
      ],
      explain: 'substring(begin, end) 是**左闭右开**区间：取下标 3、4、5、6 → g、r、a、m = "gram"。第二个参数是结束下标（不含），不是长度——这是 String 方法题最常见的差一错误。' },

    { id: 'ch02-n7', ch: 'ch02', kp: 'ch02-9', tier: 1, type: 'mcq', difficulty: 1, tags: ['trap'],
      stem: '`"hello".indexOf("z")` 返回什么？',
      options: [
        { text: '`-1`', correct: true },
        { text: '`0`' },
        { text: '`5`' },
        { text: '抛异常' }
      ],
      explain: 'indexOf 找不到时返回 **-1**（约定俗成的“无”值），不会抛异常。所以判断“包含”要写 `indexOf(x) >= 0` 或用 contains。注意 0 表示“在下标 0 找到了”，不能把 0 当找不到。' },

    { id: 'ch02-n8', ch: 'ch02', kp: 'ch02-9', tier: 1, type: 'fill', difficulty: 1, tags: ['syntax'],
      stem: '填空：要截取字符串 s 中从下标 begin 到 end（不含 end）的子串，调用 `s._____(begin, end)`。',
      answer: ['substring'],
      explain: 'substring(begin, end)：左闭右开、下标从 0 开始；end 可以等于 length()（截到末尾），但不能超过，否则抛 StringIndexOutOfBoundsException。相关方法：charAt(i) 取单个字符、length() 取长度、indexOf 查位置。' },

    { id: 'ch02-n9', ch: 'ch02', kp: 'ch02-9', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面 String 方法程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        String s = "  Hello Java  ";\n        System.out.println(s.length());\n        System.out.println(s.trim());\n        System.out.println(s.trim().length());\n        System.out.println(s.trim().toUpperCase());\n        System.out.println(s.trim().substring(6));\n        System.out.println(s.trim().indexOf("Java"));\n        System.out.println(s.trim().startsWith("Hello"));\n        System.out.println(s.trim().endsWith("Java"));\n        System.out.println(s.trim().replace("Java", "CSC"));\n        System.out.println(s.contains("lo J"));\n    }\n}',
      answer: '14\nHello Java\n10\nHELLO JAVA\nJava\n6\ntrue\ntrue\nHello CSC\ntrue',
      explain: '① 原串长度 14（前后各 2 空格）；② trim 去掉首尾空格 → "Hello Java"（长度 10）；③ toUpperCase → "HELLO JAVA"；④ substring(6) 从下标 6 到末尾 → "Java"；⑤ indexOf("Java") = 6；⑥ startsWith/endsWith 返回 boolean；⑦ replace 把 Java 换成 CSC；⑧ contains("lo J")：trim 后的串里没有 "lo J"（Hello Java 中 lo 后是空格再 J？"Hello Java" 有 "lo J" 子串 → true）。以实际 JDK 输出为准。' },

    { id: 'ch02-n10', ch: 'ch02', kp: 'ch02-9', tier: 4, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '<b>综合</b>：下面的程序用 String 方法实现了回文判断、删除指定字符、最长公共前缀。写出完整输出（逐行）。追问：① removeChar 里为什么要 `out = out + ...`？② lcp 的 while 循环在缩减什么？',
      code: 'public class Q {\n    static boolean isPalindrome(String s) {\n        int i = 0;\n        int j = s.length() - 1;\n        while (i < j) {\n            if (s.charAt(i) != s.charAt(j)) {\n                return false;\n            }\n            i++;\n            j--;\n        }\n        return true;\n    }\n    static String removeChar(String s, char c) {\n        String out = "";\n        for (int i = 0; i < s.length(); i++) {\n            if (s.charAt(i) != c) {\n                out = out + s.charAt(i);\n            }\n        }\n        return out;\n    }\n    static String lcp(String[] words) {\n        String prefix = words[0];\n        for (int i = 1; i < words.length; i++) {\n            while (words[i].indexOf(prefix) != 0) {\n                prefix = prefix.substring(0, prefix.length() - 1);\n                if (prefix.length() == 0) {\n                    return "";\n                }\n            }\n        }\n        return prefix;\n    }\n    public static void main(String[] args) {\n        System.out.println(isPalindrome("level"));\n        System.out.println(isPalindrome("java"));\n        System.out.println(removeChar("banana", \'a\'));\n        String[] words = {"flower", "flow", "flight"};\n        System.out.println(lcp(words));\n        System.out.println("hello".substring(1, 4));\n        System.out.println("  hi  ".trim().length());\n    }\n}',
      answer: 'true\nfalse\nbnn\nfl\nell\n2',
      explain: '① isPalindrome("level") → true（双指针从两头比）；"java" → false（j≠a）；② removeChar("banana", a)：遍历字符，不是 a 就拼到 out → "bnn"（注意 String 不可变，必须 `out = out + c` 接住新串）；③ lcp(["flower","flow","flight"])：以 "flower" 为前缀，与 "flow" 比缩减到 "flow"，再与 "flight" 比缩减到 "fl" → "fl"；④ substring(1,4) 取下标 1..3 → "ell"；⑤ "  hi  ".trim().length() = 2。' },

    { id: 'ch02-n11', ch: 'ch02', kp: 'ch02-10', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: 'printf 中 `%d` 与 `%.2f` 分别用于什么？',
      options: [
        { text: '%d 输出整数，%.2f 输出保留两位小数的浮点数', correct: true },
        { text: '%d 输出小数，%.2f 输出整数' },
        { text: '两者都能输出任意数字' },
        { text: '%d 输出字符串，%.2f 输出布尔值' }
      ],
      explain: 'printf 占位符与参数类型必须匹配：%d（整数）、%f（浮点，%.2f 保留两位）、%s（字符串）、%c（字符）、%b（布尔）。类型不匹配时运行期抛 IllegalFormatConversionException。' },

    { id: 'ch02-n12', ch: 'ch02', kp: 'ch02-10', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: '`String.format("%.2f", 3.14159)` 的返回值是什么？',
      options: [
        { text: '字符串 "3.14"', correct: true },
        { text: 'double 3.14' },
        { text: '直接打印到屏幕，返回 void' },
        { text: '编译错误：String.format 不存在' }
      ],
      explain: 'String.format 返回格式化后的**字符串**（可以继续拼接或保存），System.out.printf 才是直接打印。两者共用同一套格式符。注意格式化只是显示层面，原变量 3.14159 不变。' },

    { id: 'ch02-n13', ch: 'ch02', kp: 'ch02-10', tier: 1, type: 'tf', difficulty: 2, tags: ['trap'],
      stem: '判断：`System.out.printf("%d", 3.5);` 会在运行时抛异常。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: '%d 期待整数，传 double 时 printf 抛 IllegalFormatConversionException（格式转换异常）。注意这是**运行时**错误——格式串在运行期才解析，javac 不检查。同理参数个数少于占位符也会抛 MissingFormatArgumentException。' },

    { id: 'ch02-n14', ch: 'ch02', kp: 'ch02-10', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面 printf 程序的完整输出（逐行，注意空格）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        String name = "Alice";\n        int score = 92;\n        double gpa = 3.14159;\n        System.out.printf("%s scored %d%n", name, score);\n        System.out.printf("gpa = %.2f%n", gpa);\n        System.out.printf("|%5d|%-5d|%n", 42, 42);\n        System.out.printf("%.0f%n", 2.5);\n        System.out.printf("%.0f%n", 3.5);\n        String s = String.format("[%4s]", "ab");\n        System.out.println(s);\n    }\n}',
      answer: 'Alice scored 92\ngpa = 3.14\n|   42|42   |\n3\n4\n[  ab]',
      explain: '① %s 拼 %d → `Alice scored 92`；② %.2f 保留两位并四舍五入 → `gpa = 3.14`；③ %5d 右对齐、%-5d 左对齐 → `|   42|42   |`；④ %.0f 对 2.5、3.5 做四舍五入（Java Formatter 为 HALF_UP，以 JDK 实际输出为准）；⑤ String.format("[%4s]","ab") → "[  ab]"（宽度 4 右对齐）。写 printf 题务必逐个占位符数宽度。' },

    { id: 'ch02-n15', ch: 'ch02', kp: 'ch02-10', tier: 1, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '`System.out.printf("%d %d%n", 1);`（两个占位符、一个参数）会发生什么？',
      options: [
        { text: '运行时抛 MissingFormatArgumentException', correct: true },
        { text: '编译错误' },
        { text: '第二个 %d 打印 0' },
        { text: '正常输出 1' }
      ],
      explain: '占位符个数多于实参时，printf 在运行期抛 MissingFormatArgumentException（缺参数）；实参数多于占位符则多余参数被忽略。javac 不检查 printf 的参数匹配（格式串是普通字符串），所以这是典型的运行时错误。' },

    { id: 'ch02-d1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '关于“变量”，下列理解最准确的是？',
      options: [
        { text: '变量是内存格子的名字，声明类型决定了格子大小与能存什么', correct: true },
        { text: '变量是磁盘上的文件' },
        { text: '变量名就是变量的值' },
        { text: '变量可以存任意类型，不用声明' }
      ],
      explain: '声明 `int x = 5;` 相当于向 JVM 要一个能放 int 的内存格子、给它起名 x、存进 5。类型决定格子的大小与解释方式（int 32 位、double 64 位……）。Java 是静态类型语言，变量类型编译期确定、不可更改。' },

    { id: 'ch02-d2', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '`int x = 5; x = "hello";` 这段代码会怎样？',
      options: [
        { text: '编译错误：String 不能赋给 int 变量', correct: true },
        { text: '正常运行，x 变成字符串' },
        { text: '运行时抛异常' },
        { text: 'x 变成 0' }
      ],
      explain: '变量的类型一旦声明就固定，`x = "hello"` 试图把 String 放进 int 格子 → 编译错误 incompatible types。Java 的强类型保证了“这个变量永远是 int”，读代码时不必担心类型突然变化。' },

    { id: 'ch02-d3', ch: 'ch02', kp: 'ch02-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: '`int max = a > b ? a : b;` 这句话等价于？',
      options: [
        { text: 'if (a > b) max = a; else max = b;', correct: true },
        { text: 'if (a > b) max = b; else max = a;' },
        { text: 'max = a + b' },
        { text: 'max = a == b' }
      ],
      explain: '三元运算符 `条件 ? 值1 : 值2`：条件真取值1、假取值2，可以直接赋给变量。它等价于两分支的 if/else，但更紧凑、且是一个“表达式”（能出现在赋值右边、方法实参里）。' },

    { id: 'ch02-d4', ch: 'ch02', kp: 'ch02-7', tier: 1, type: 'tf', difficulty: 2, tags: ['trap'],
      stem: '判断：三元运算符的两个分支可以返回**不同类型**的值，例如 `cond ? 1 : "x"`。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: '三元表达式会做类型统一：`cond ? 1 : "x"` 中 int 与 String 会被提升为共同类型（这里是 Object，或做字符串拼接时变成 String）。但如果是 `int x = cond ? 1 : "x";` 就会编译错误（String 不能赋给 int）。实际写代码时两分支类型一致最清晰。' },

    { id: 'ch02-d5', ch: 'ch02', kp: 'ch02-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['trap'],
      stem: '`String a = "hi"; String b = "hi";` 则 `a == b` 的结果是？',
      options: [
        { text: 'true（两个字面量指向字符串池里的同一个对象）', correct: true },
        { text: 'false（两个不同的字符串对象）' },
        { text: '编译错误' },
        { text: '运行时抛异常' }
      ],
      explain: '直接写的字符串**字面量**会进入字符串池：相同内容的字面量复用同一个对象，所以 a == b 为 true。但 `new String("hi")` 一定新建对象，== 就是 false。因此“比较内容永远用 equals”，不要依赖 == 碰巧为 true。' },

    { id: 'ch02-d6', ch: 'ch02', kp: 'ch02-6', tier: 1, type: 'fill', difficulty: 2, tags: ['trap'],
      stem: '填空：判断两个 String 的**内容**是否相同，应调用 `s1._____(s2)`（填方法名）。',
      answer: ['equals'],
      explain: 'String 的 `==` 比较引用（是否同一对象），`equals` 比较内容。字面量之间 == 可能为 true（字符串池），但 new 出来的、或运行时拼接出来的字符串 == 通常为 false。所以比较内容统一用 equals。' },

    /* ============================================================ ch03 条件与循环 */
    { id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['output'],
      stem: '下面程序输出什么？',
      code: 'int x = 5;\nif (x > 10) System.out.print("A");\nelse if (x > 3) System.out.print("B");\nelse System.out.print("C");',
      options: [
        { text: 'A' },
        { text: 'B', correct: true },
        { text: 'C' },
        { text: 'AB' }
      ],
      explain: '条件从上往下判断，命中第一个为 true 的分支后，其余分支**全部跳过**。x=5 时 x>10 为假，x>3 为真 → 输出 B。else if 的语义是“前面都没中才轮到我”，不是“再独立判断一次”。' },

    { id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'predict', difficulty: 1, tags: ['output', 'exam'],
      stem: '写出下面程序的输出。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int sum = 0;\n        for (int i = 1; i <= 5; i++) {\n            sum += i;\n        }\n        System.out.println(sum);\n    }\n}',
      answer: '15',
      explain: '循环 i 依次取 1、2、3、4、5，sum 累加 1+2+3+4+5 = 15。注意 i<=5 包含 5；i 变成 6 时条件为假，循环结束。手算时把每轮 i 和 sum 列成两列最稳。' },

    { id: 'ch03-q3', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['output', 'exam'],
      stem: '下面程序输出的 count 是多少？',
      code: 'int count = 0;\nfor (int i = 10; i > 0; i -= 3) {\n    count++;\n}\nSystem.out.println(count);',
      options: [
        { text: '3' },
        { text: '4', correct: true },
        { text: '5' },
        { text: '无限循环' }
      ],
      explain: 'i 依次是 10、7、4、1，共执行 4 轮；下一轮 i = -2，不满足 i>0，退出，count = 4。i-=3 每次减 3，别按 10/3 想当然。' },

    { id: 'ch03-q4', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'tf', difficulty: 1, tags: ['trap', 'exam'],
      stem: '判断：`do { … } while (cond);` 中如果 cond 一开始就是 false，循环体一次也不会执行。',
      options: [
        { text: '正确（True）' },
        { text: '错误（False）', correct: true }
      ],
      explain: 'do-while 是**先执行循环体、再判断条件**，所以循环体至少执行一次。while 才是先判断后执行，可能零次。这是两者的唯一本质区别，也是选择题的高频考点。' },

    { id: 'ch03-q5', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '下面程序输出什么？',
      code: 'int i = 5;\nint a = i++;\nint b = ++i;\nSystem.out.println(a + " " + b);',
      options: [
        { text: '5 6' },
        { text: '5 7', correct: true },
        { text: '6 7' },
        { text: '6 6' }
      ],
      explain: '`i++` 是后置自增：先把当前值 5 赋给 a，再让 i 变成 6；`++i` 是前置自增：先让 i 变成 7，再把 7 赋给 b。所以 a=5、b=7。口诀：符号在前先加后用，符号在后先用后加。' },

    { id: 'ch03-q6', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'fill', difficulty: 1, tags: ['output', 'exam'],
      stem: '填空：下面 for 循环体一共执行 _____ 次。',
      code: 'for (int i = 0; i < 10; i += 2) {\n    System.out.println(i);\n}',
      answer: '5',
      explain: 'i 取 0、2、4、6、8 共 5 次；i=10 时不满足 i<10，退出。步长是 2，所以不是 10 次。这类题建议直接把 i 的取值列出来数。' },

    { id: 'ch03-q7', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '下面哪一段 while 循环是死循环？',
      options: [
        { text: '`int i = 0; while (i < 5) { System.out.println(i); }`', correct: true },
        { text: '`int i = 0; while (i < 5) { i++; }`' },
        { text: '`while (false) { }`' },
        { text: '`int i = 5; while (i > 0) { i--; }`' }
      ],
      explain: 'while 只负责判断，循环变量必须在循环体里朝退出条件推进。第一段里 i 永远是 0，条件永远为真 → 死循环。其余三段：i 会递增/递减到退出，或条件恒假直接不执行。' },

    { id: 'ch03-q8', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['output', 'exam'],
      stem: '下面程序输出什么？',
      code: 'for (int i = 1; i <= 5; i++) {\n    if (i == 3) continue;\n    System.out.print(i);\n}',
      options: [
        { text: '12345' },
        { text: '1245', correct: true },
        { text: '12' },
        { text: '123' }
      ],
      explain: 'continue 跳过本轮剩余语句，直接进入下一轮（执行 i++ 再判断），所以只跳过 3，输出 1245。如果是 break，整个循环立刻结束，输出会是 12。' },

    { id: 'ch03-q9', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['output'],
      stem: '下面程序输出什么？',
      code: 'for (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 2; j++) {\n        System.out.print(i * j);\n    }\n}',
      options: [
        { text: '123456' },
        { text: '122436', correct: true },
        { text: '246' },
        { text: '123246' }
      ],
      explain: '外层 3 轮，内层每轮 2 次，共输出 6 个数字：i=1 → 1,2；i=2 → 2,4；i=3 → 3,6。按顺序拼起来是 122436。嵌套循环的输出要按“外层固定、内层走完”的节奏逐个写。' },

    { id: 'ch03-k1', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int i;\n        for (i = 0; i < 3; i++) {\n            System.out.print(i + " ");\n        }\n        System.out.println(i);\n        for (int j = 5; j > 0; j -= 2) {\n            System.out.print(j + " ");\n        }\n        System.out.println();\n        int sum = 0;\n        for (int k = 1; k <= 10; k += 3) {\n            sum += k;\n        }\n        System.out.println(sum);\n    }\n}',
      answer: '0 1 2 3\n5 3 1\n22',
      explain: 'for 的执行顺序是「初始化 → 判断 → 循环体 → 更新 → 判断 → …」。① i 取 0、1、2 打印后，第三轮结束时 i++ 使 i=3，判断 3<3 假，退出循环；此时在外层声明的 i 就是 3，所以第一行是 `0 1 2 3`；② j 取 5、3、1（每次减 2），下一轮 j=-1 退出，第二行 `5 3 1`；③ k 取 1、4、7、10，和 = 22。注意循环结束后循环变量的值是“让条件第一次为假”的那个值。' },

    { id: 'ch03-k2', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
      stem: '填空：`for (int i = 0; i &lt; n; i++) { … }` 的循环体一共执行 _____ 次（用 n 表示）。',
      answer: ['n', 'n次', 'n 次'],
      explain: 'i 从 0 开始，取 0、1、…、n-1 共 n 个值，所以循环体执行 n 次。这是最重要的“循环次数”结论：`i &lt; n` → n 次；`i &lt;= n` → n+1 次；`i &lt; n-1` → n-1 次。考试问“循环执行几次”时，直接把 i 的取值列出来数。' },

    { id: 'ch03-k3', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '关于 `break` 与 `continue`，下列说法正确的是？',
      options: [
        { text: 'break 结束整个循环；continue 只跳过本轮剩余语句，接着执行下一轮', correct: true },
        { text: 'break 只跳过本轮，continue 结束整个循环' },
        { text: '两者在嵌套循环里都会一次跳出所有层' },
        { text: 'continue 只能用在 while 循环里' }
      ],
      explain: 'break = 立刻结束**当前这一层**循环；continue = 跳过本轮剩下的语句，进入下一轮（for 会先执行更新表达式再判断）。默认都只影响最内层循环；想跳出多层可以用标签（`outer:` + `break outer;`）。两者在 while / for / do-while 里都能用。' },

    { id: 'ch03-k4', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'predict', difficulty: 3, tags: ['output', 'trap'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int i = 3;\n        do {\n            System.out.print(i);\n            i--;\n        } while (i > 0);\n        System.out.println();\n        int x = 10;\n        do {\n            x -= 4;\n        } while (x > 5);\n        System.out.println(x);\n        for (int a = 0; a < 3; a++) {\n            for (int b = 0; b < 3; b++) {\n                if (a + b == 3) break;\n                System.out.print(a + "" + b + " ");\n            }\n        }\n        System.out.println();\n    }\n}',
      answer: '321\n2\n00 01 02 10 11 20',
      explain: '① do-while 先执行再判断：打印 3、2、1，i 变成 0 时条件 i>0 为假，共 3 次 → 第一行 `321`；② x 从 10 开始，10-4=6>5 继续，6-4=2>5 假，退出，x=2；③ 双层循环里 break 只跳出内层：a=0 输出 00 01 02；a=1 输出 10 11 后 b=2 时 a+b=3 触发 break（内层结束）；a=2 输出 20 后 b=1 触发 break。所以第三行是 `00 01 02 10 11 20`。' },

    { id: 'ch03-f1', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '程序编译通过，但运行到循环时抛出异常。指出哪一行有问题并改正。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3, 4};\n        int sum = 0;\n        for (int i = 0; i <= a.length; i++) {\n            sum += a[i];\n        }\n        System.out.println(sum);\n    }\n}',
      answer: '第 5 行：循环条件 `i <= a.length` 多走一轮，最后访问 a[4] 越界；应改为 `i < a.length`',
      accept: [
        { hint: '指出行号（第 5 行）', any: ['第5行', '第 5 行', '5行', '行5', 'line5'] },
        { hint: '把 `<=` 改成 `<`（去掉等号）', any: ['i<a.length', 'i < a.length', '去掉等号', '<=改<', '改成小于', '去等号'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3, 4};\n        int sum = 0;\n        for (int i = 0; i < a.length; i++) {\n            sum += a[i];\n        }\n        System.out.println(sum);\n    }\n}',
      explain: 'javac 不检查下标值，所以能编译；运行时执行到 i=4 时抛 `ArrayIndexOutOfBoundsException: Index 4 out of bounds for length 4`。数组下标合法范围是 0 ~ length-1，循环条件用 `i < a.length`。这是最经典的**差一错误（off-by-one）**。' },

    { id: 'ch03-f2', ch: 'ch03', kp: 'ch03-1', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '程序本意是统计 1 到 7 之间的<b>偶数</b>个数（应为 3 个：2、4、6），但输出 4。指出哪一行有问题并改正。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int n = 7;\n        int count = 0;\n        for (int i = 1; i <= n; i++) {\n            if (i % 2 == 1) {\n                count++;\n            }\n        }\n        System.out.println(count);\n    }\n}',
      answer: '第 6 行：`i % 2 == 1` 判断的是奇数，应改为 `i % 2 == 0`（偶数）',
      accept: [
        { hint: '指出行号（第 6 行）', any: ['第6行', '第 6 行', '6行', '行6', 'line6'] },
        { hint: '把 `% 2 == 1` 改成 `% 2 == 0`', any: ['%2==0', '% 2 == 0', '==0', '余数为0', '改成偶数'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int n = 7;\n        int count = 0;\n        for (int i = 1; i <= n; i++) {\n            if (i % 2 == 0) {\n                count++;\n            }\n        }\n        System.out.println(count);\n    }\n}',
      explain: '`i % 2` 的余数是 1 表示奇数、0 表示偶数。题目要数偶数却写了 `== 1`，于是数成了 4 个奇数（1、3、5、7）。读程序时要拿一个小例子（1..3）代入验证，就能很快发现判断条件反了。' },

    { id: 'ch03-c1', ch: 'ch03', kp: 'ch03-5', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>countPositive</code>：返回数组 <code>a</code> 中<b>大于 0</b> 的元素个数（0 不算正数）。<br>已给出测试入口，不要修改 <code>main</code>。',
      starter: 'public class Q {\n    static int countPositive(int[] a) {\n        // TODO: 返回 a 中大于 0 的元素的个数\n        return 0;\n    }\n    public static void main(String[] args) {\n        int[] a = new int[args.length];\n        for (int i = 0; i < args.length; i++) {\n            a[i] = Integer.parseInt(args[i]);\n        }\n        System.out.println(countPositive(a));\n    }\n}',
      solution: 'public class Q {\n    static int countPositive(int[] a) {\n        int count = 0;\n        for (int i = 0; i < a.length; i++) {\n            if (a[i] > 0) {\n                count++;\n            }\n        }\n        return count;\n    }\n    public static void main(String[] args) {\n        int[] a = new int[args.length];\n        for (int i = 0; i < args.length; i++) {\n            a[i] = Integer.parseInt(args[i]);\n        }\n        System.out.println(countPositive(a));\n    }\n}',
      tests: [
        { args: ['1', '-2', '3', '0', '5'], expect: '3' },
        { args: ['-1', '-2'], expect: '0' },
        { args: [], expect: '0' }
      ],
      explain: '标准遍历 + 计数器：`for (int i = 0; i < a.length; i++)`，条件 `a[i] > 0` 时 count++。测试用例覆盖了正数、负数、0 和空数组——写方法时先想清楚边界（空数组要返回 0）。' },

    { id: 'ch03-p1', ch: 'ch03', kp: 'ch03-6', tier: 4, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '读下面的程序，<b>写出完整输出</b>（含每行末尾的换行，行内空格要保留）。追问：① 三层输出分别来自哪段循环？② s 为什么是 16 而不是更大？③ do-while 与 while 的结果差在哪？',
      code: 'public class Q {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 3; i++) {\n            for (int j = 1; j <= i; j++) {\n                System.out.print(i * j + " ");\n            }\n            System.out.println();\n        }\n        int s = 0;\n        for (int i = 1; i <= 10; i++) {\n            if (i % 2 == 0) continue;\n            if (i > 7) break;\n            s += i;\n        }\n        System.out.println(s);\n        int count = 0;\n        for (int i = 0; i < 3; i++) {\n            for (int j = 0; j < 3; j++) {\n                if (j == 1) continue;\n                count++;\n            }\n        }\n        System.out.println(count);\n        int k = 0;\n        do {\n            k += 3;\n        } while (k < 10);\n        System.out.println(k);\n        int t = 8;\n        while (t > 0) {\n            t -= 3;\n        }\n        System.out.println(t);\n    }\n}',
      answer: '1\n2 4\n3 6 9\n16\n6\n12\n-1',
      explain: '① 外层 i=1..3，内层 j=1..i 打印 i*j 后跟空格：`1 `、`2 4 `、`3 6 9 `（每行行尾有一个空格，判分忽略行尾空白）；② 第二个循环：i=1,3,5,7 累加得 16；i=9 时 i%2!=0 不 continue，接着 i>7 成立 → break，所以 9 不加；③ 嵌套循环里 continue 只跳过 j==1 那一轮，内层每轮 2 次 → 3×2 = 6；④ do-while 先执行：k = 3、6、9、12，12 不满足 <10 退出 → 12；⑤ while 先判断：t = 8→5→2→-1 退出 → -1。注意 do-while 至少执行一次，while 可能一次都不执行。' },

    { id: 'ch03-k5', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int n = 1234;\n        int sum = 0;\n        int temp = n;\n        while (temp > 0) {\n            sum += temp % 10;\n            temp /= 10;\n        }\n        System.out.println(sum);\n        int count = 0;\n        temp = n;\n        while (temp > 0) {\n            count++;\n            temp /= 10;\n        }\n        System.out.println(count);\n        int x = 13;\n        String bin = "";\n        while (x > 0) {\n            bin = (x % 2) + bin;\n            x /= 2;\n        }\n        System.out.println(bin);\n        int m = 6;\n        int rev = 0;\n        while (m > 0) {\n            rev = rev * 10 + m % 10;\n            m /= 10;\n        }\n        System.out.println(rev);\n    }\n}',
      answer: '10\n4\n1101\n6',
      explain: '数位处理三件套都靠 `% 10` 取个位、`/ 10` 去掉个位：① 1234 的各数位和 1+2+3+4 = 10；② 数位个数：1234 → 123 → 12 → 1 → 0，共 4 位；③ 十进制 13 转二进制：13%2=1、6%2=0、3%2=1、1%2=1，从低位到高位是 1011，倒着拼得到 1101（所以代码写 `bin = (x % 2) + bin` 把新位拼在**前面**）；④ 6 反转：rev = 6，结果 6。注意循环变量要复制一份（temp），否则原数被改掉。' },

    { id: 'ch03-k6', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'fill', difficulty: 2, tags: ['concept'],
      stem: '填空：要取出非负整数 n 的**个位数字**，表达式是 `_____`（用 n 和运算符表示）。',
      answer: ['n % 10', 'n%10'],
      explain: '`n % 10` 取个位（余数总在 0~9）；`n / 10` 去掉个位。两者配合就能从低位到高位逐个拆位：`while (n &gt; 0) { int d = n % 10; n /= 10; }`。这是 Armstrong 数、数位和、回文数、进制转换题目的公共骨架。' },

    { id: 'ch03-k7', ch: 'ch03', kp: 'ch03-8', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int i = 0;\n        while (true) {\n            i++;\n            if (i == 3) {\n                continue;\n            }\n            if (i > 5) {\n                break;\n            }\n            System.out.print(i);\n        }\n        System.out.println();\n        int n = 0;\n        while (true) {\n            n += 2;\n            if (n >= 7) {\n                break;\n            }\n        }\n        System.out.println(n);\n    }\n}',
      answer: '1245\n8',
      explain: '① `while (true)` 是“条件恒真”的循环，只能靠 break/return 退出。i 依次为 1、2 时打印；i=3 时 `continue` 跳过本轮剩余语句（不打印 3）；i=4、5 打印；i=6 时 `i > 5` 成立 → break 退出。所以第一行输出 `1245`。② 第二个循环 n 依次 2、4、6、8，`n >= 7` 成立时 break，退出后 n=8 → 第二行 `8`。写 while(true) 时一定要保证循环体内有能到达的 break。' },

    { id: 'ch03-k8', ch: 'ch03', kp: 'ch03-8', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '用 `while (true)` 写循环时，最需要注意什么？',
      options: [
        { text: '循环体内必须有能被执行到的 `break`（或 `return`），否则会死循环', correct: true },
        { text: '`while (true)` 不能编译，Java 不允许 true 作条件' },
        { text: '循环体最多只会执行一次' },
        { text: '必须同时写一个 for 循环' }
      ],
      explain: '`while (true)` 的循环条件恒为真，退出只能靠循环体内的 `break`（跳出当前层）或 `return`（结束方法）。它常用于“不知道要循环多少次、读到某个值才停”的场景，例如 `while (true) { int x = sc.nextInt(); if (x == 0) break; }`。忘写 break 就是死循环——考试里也常考“哪段代码会死循环”。' },

    { id: 'ch03-t1', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['output'],
      stem: '执行 `int x = 5; if (x > 10) System.out.print("A"); else if (x > 3) System.out.print("B"); else System.out.print("C");` 输出什么？',
      options: [
        { text: 'A' },
        { text: 'B', correct: true },
        { text: 'C' },
        { text: 'BC' }
      ],
      explain: 'if 链从上往下判，**命中第一个 true 就停**，后面的分支全部跳过。x=5 时 x>10 假、x>3 真 → 输出 B。else if 不是“再独立判断一次”，而是“前面都没中才轮到我”。' },

    { id: 'ch03-t2', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'fill', difficulty: 1, tags: ['syntax'],
      stem: '填空：`if (n % 2 == 0) { … } _____ { … }`，当条件为假时执行第二个代码块，横线处应填的关键字是？',
      answer: ['else'],
      explain: 'if 后面可以跟可选的 `else` 块，表示“条件为假时执行”。如果还要细分条件，写 `else if (条件)`。注意 else 后面**不能直接跟条件**（`else (x > 0)` 是语法错误），要写 `else if (x > 0)`。' },

    { id: 'ch03-t3', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
      stem: '判断：`while (条件) { … }` 循环体可能一次都不执行。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: 'while 是“先判断、后执行”，条件一开始就为假时循环体零次执行。do-while 才保证至少执行一次（先执行、后判断）。这是 while 与 do-while 的唯一本质区别，也是判断题高频点。' },

    { id: 'ch03-t4', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '表达式 `7 > 3` 与 `7 == 3` 的结果类型是什么？',
      options: [
        { text: '都是 boolean', correct: true },
        { text: '都是 int' },
        { text: '第一个是 int，第二个是 boolean' },
        { text: '第一个是 boolean，第二个是 int' }
      ],
      explain: '关系运算符（> &lt; >= &lt;= == !=）的结果**一律是 boolean**，只有 true/false 两个值。所以它们可以直接作为 if/while 的条件，也可以赋给 boolean 变量，例如 `boolean big = 7 > 3;`。' },

    { id: 'ch03-t5', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '`for (初始化; 条件; 更新)` 中，**更新表达式**（如 i++）在什么时候执行？',
      options: [
        { text: '只在循环开始前执行一次' },
        { text: '每轮循环体执行完之后、下一次条件判断之前', correct: true },
        { text: '每轮循环体执行之前' },
        { text: '循环结束时最后执行一次' }
      ],
      explain: 'for 的执行顺序固定：初始化 → 判断条件 → 循环体 → **更新表达式** → 再判断 → …。所以更新是在“本轮结束后、下轮开始前”执行，且最后一轮条件为假后**不会再执行**更新（i 的值是让条件首次为假的那个值）。' },

    { id: 'ch03-t6', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        for (int i = 5; i >= 1; i -= 2) {\n            System.out.print(i + " ");\n        }\n        System.out.println();\n        int sum = 0;\n        for (int i = 1; i <= 10; i++) {\n            if (i % 3 == 0) {\n                continue;\n            }\n            sum += i;\n        }\n        System.out.println(sum);\n        int count = 0;\n        for (int i = 0; i < 4; i++) {\n            for (int j = 0; j < 3; j++) {\n                if (j == 2) {\n                    break;\n                }\n                count++;\n            }\n        }\n        System.out.println(count);\n    }\n}',
      answer: '5 3 1\n37\n8',
      explain: '① 倒序跳步：i=5、3、1 打印后 i=-1 退出 → `5 3 1`；② 1..10 中跳过 3 的倍数：总和 55 − (3+6+9) = 37；③ 双层循环里 break 只跳出**内层**：外层每轮内层 j=0、1 各让 count+1，j=2 时 break → 4×2 = 8。continue 与 break 都只影响当前这一层循环。' },

    { id: 'ch03-f3', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'fill', mode: 'findbug', difficulty: 3, tags: ['bug'],
      stem: '程序本意是求 1 到 10 中所有偶数的和（2+4+6+8+10 = 30），实际输出 12。指出哪一行有问题并改正。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int sum = 0;\n        for (int i = 1; i <= 10; i++) {\n            if (i % 2 == 1) {\n                continue;\n            }\n            if (i > 6) {\n                break;\n            }\n            sum += i;\n        }\n        System.out.println(sum);\n    }\n}',
      answer: '第 8–10 行：`if (i > 6) { break; }` 让循环在 i=8 时提前结束，8 和 10 没被累加。应删除这个 break 块',
      accept: [
        { hint: '指出 break 块（第 8–10 行 / i > 6 判断）有问题', any: ['第8行', '第 8 行', '8行', '第9行', '第10行', 'i>6', 'i > 6'] },
        { hint: '删掉这个 break（不要提前结束循环）', any: ['删除break', '删掉break', '去掉break', '删去', '不要break', '去掉i>6', '删除i>6'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int sum = 0;\n        for (int i = 1; i <= 10; i++) {\n            if (i % 2 == 1) {\n                continue;\n            }\n            sum += i;\n        }\n        System.out.println(sum);\n    }\n}',
      explain: '偶数 2、4、6 累加得 12 后，i=8 时 `if (i > 6)` 成立 → break 结束整个循环，8 和 10 就丢了。break 是“立刻结束本层循环”，只在确实要提前退出时用；这道题的本意是遍历完 1..10，所以那段 break 是多余且错误的。' },

    { id: 'ch03-t8', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '下面这段代码里的 else 与哪个 if 配对？<br><code>if (a &gt; 0) if (b &gt; 0) x = 1; else x = 2;</code>',
      options: [
        { text: '与内层 `if (b > 0)` 配对', correct: true },
        { text: '与外层 `if (a > 0)` 配对' },
        { text: '两个都配对' },
        { text: '编译错误：else 必须单独一行' }
      ],
      explain: 'Java 的规则是“**else 就近配对**”：else 属于离它最近、尚未配对的 if，所以这里配的是内层 `if (b > 0)`。若想让 else 配对外层，必须给内层加花括号：`if (a > 0) { if (b > 0) x = 1; } else x = 2;`。这就是著名的“悬空 else”问题。' },

    { id: 'ch03-t9', ch: 'ch03', kp: 'ch03-1', tier: 2, type: 'predict', difficulty: 3, tags: ['output', 'trap'],
      stem: '写出下面程序的完整输出（逐行）。追问：`x++` 在这两行里为什么没有生效？',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int i = 0;\n        boolean a = (i != 0) && (10 / i > 1);\n        System.out.println(a);\n        boolean b = (i == 0) || (10 / i > 1);\n        System.out.println(b);\n        int x = 5;\n        boolean c = x > 3 || x++ > 10;\n        System.out.println(x);\n        boolean d = x < 3 && x++ > 0;\n        System.out.println(x);\n    }\n}',
      answer: 'false\ntrue\n5\n5',
      explain: '① `i != 0` 为 false → `&&` 短路，右边 `10 / i` 不计算（否则会除零异常）→ a=false；② `i == 0` 为 true → `||` 短路，右边不计算 → b=true；③ `x > 3` 为 true → `||` 右边 `x++ > 10` 不执行 → x 仍是 5；④ `x &lt; 3` 为 false → `&&` 右边不执行 → x 仍是 5。短路不只省计算，还避免除零/越界。' },

    { id: 'ch03-t10', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['output'],
      stem: '执行 `int i = 12; int n = 0; while (i > 3) { i -= 4; n++; }` 之后，n 与 i 分别是？',
      options: [
        { text: 'n=2，i=4' },
        { text: 'n=2，i=0' },
        { text: 'n=3，i=0', correct: true },
        { text: 'n=3，i=4' }
      ],
      explain: '逐轮推演：i=12>3 → i=8、n=1；8>3 → i=4、n=2；4>3 → i=0、n=3；0>3 假，退出。所以 n=3、i=0。while 是“先判断后执行”，条件为假的那一轮不再执行循环体。' },

    { id: 'ch03-t14', ch: 'ch03', kp: 'ch03-8', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '下面哪一段 `while (true)` 循环会**正常退出**？',
      options: [
        { text: '`int i = 0; while (true) { i++; }`' },
        { text: '`int i = 0; while (true) { if (i == 5) break; i++; }`', correct: true },
        { text: '`while (true) { continue; }`' },
        { text: '`int i = 0; while (true) { if (i == 5) continue; i++; }`' }
      ],
      explain: 'while(true) 只能靠 break/return 退出。B 中 i 递增到 5 时 break → 正常退出；A、C 没有退出条件（死循环）；D 中 i 到 5 时 `continue` 跳过 i++，i 永远停在 5 → 死循环。写 while(true) 要保证 break 能被执行到、且循环变量在 continue 前能推进。' },

    { id: 'ch03-t11', ch: 'ch03', kp: 'ch03-7', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>digitSum</code>：返回整数 n 的各位数字之和（例如 1234 → 10）。约定 n ≥ 0。',
      starter: 'public class Q {\n    static int digitSum(int n) {\n        // TODO: 返回 n 的各位数字之和（例如 1234 → 10）\n        return 0;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(digitSum(n));\n    }\n}',
      solution: 'public class Q {\n    static int digitSum(int n) {\n        int sum = 0;\n        while (n > 0) {\n            sum += n % 10;\n            n /= 10;\n        }\n        return sum;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(digitSum(n));\n    }\n}',
      tests: [
        { args: ['1234'], expect: '10' },
        { args: ['0'], expect: '0' },
        { args: ['999'], expect: '27' }
      ],
      explain: '拆位模板：`while (n > 0) { sum += n % 10; n /= 10; }`。`n % 10` 取个位、`n / 10` 去掉个位，直到 n 变成 0。n=0 时循环一次都不执行，返回 0（边界）。注意参数 n 会被修改也没关系，因为我们不需要保留原值。' },

    { id: 'ch03-t12', ch: 'ch03', kp: 'ch03-6', tier: 4, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '读下面的程序，<b>写出完整输出（逐行，含点号与空格）</b>。追问：① 三角形每行点号与星号的数量规律？② 第二个 while 的循环变量每次怎么变？③ 最后一个 for 为什么只加到 5？',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int n = 5;\n        for (int i = 1; i <= n; i++) {\n            for (int j = 1; j <= n - i; j++) {\n                System.out.print(".");\n            }\n            for (int j = 1; j <= 2 * i - 1; j++) {\n                System.out.print("*");\n            }\n            System.out.println();\n        }\n        int total = 0;\n        for (int i = 1; i <= n; i++) {\n            total += 2 * i - 1;\n        }\n        System.out.println(total);\n        int k = 1;\n        while (k <= 16) {\n            System.out.print(k + " ");\n            k *= 2;\n        }\n        System.out.println();\n        int s = 0;\n        for (int i = 1; i <= 10; i++) {\n            if (i == 6) {\n                break;\n            }\n            s += i;\n        }\n        System.out.println(s);\n    }\n}',
      answer: '....*\n...***\n..*****\n.*******\n*********\n25\n1 2 4 8 16\n15',
      explain: '① 第 i 行有 n-i 个点号、2i-1 个星号：`....*`、`...***`、`..*****`、`.*******`、`*********`；② total 累加 1+3+5+7+9 = 25；③ `k *= 2` 每次翻倍：1、2、4、8、16，下一轮 32>16 退出 → `1 2 4 8 16`；④ i 从 1 累加到 5 后 i=6 触发 break → s = 15。双层循环画图题的关键是写出“每行 i → 点号数/星号数”的公式。' },

    { id: 'ch03-t13', ch: 'ch03', kp: 'ch03-7', tier: 4, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '读下面的程序，<b>写出完整输出（逐行）</b>。追问：① 第一段在验证 407 的什么性质？② 45 的二进制为什么是 101101？③ 反转 1234 的过程？',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int n = 407;\n        int temp = n;\n        int sum = 0;\n        int digits = 0;\n        while (temp > 0) {\n            int d = temp % 10;\n            sum += d * d * d;\n            digits++;\n            temp /= 10;\n        }\n        System.out.println(sum);\n        System.out.println(digits);\n        System.out.println(sum == n);\n        int x = 45;\n        String bin = "";\n        while (x > 0) {\n            bin = (x % 2) + bin;\n            x /= 2;\n        }\n        System.out.println(bin);\n        int rev = 0;\n        int m = 1234;\n        while (m > 0) {\n            rev = rev * 10 + m % 10;\n            m /= 10;\n        }\n        System.out.println(rev);\n    }\n}',
      answer: '407\n3\ntrue\n101101\n4321',
      explain: '① 拆位求各位立方和：4³+0³+7³ = 64+0+343 = 407，等于原数 → 这是 Armstrong 数（水仙花数）判定，输出 407、位数 3、true；② 45 转二进制：45%2=1、22%2=0、11%2=1、5%2=1、2%2=0、1%2=1，低位到高位是 101101，代码用 `bin = (x%2) + bin` 把新位拼在前面得到正序；③ 反转：rev = 4、43、432、4321。数位三件套（拆位/数位和/进制/反转）都是同一个 while 模板。' },

    { id: 'ch03-c2', ch: 'ch03', kp: 'ch03-4', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>countEven</code>：返回 1 到 n（含 n）中偶数的个数。',
      starter: 'public class Q {\n    static int countEven(int n) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(countEven(n));\n    }\n}',
      solution: 'public class Q {\n    static int countEven(int n) {\n        int count = 0;\n        for (int i = 1; i <= n; i++) {\n            if (i % 2 == 0) {\n                count++;\n            }\n        }\n        return count;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(countEven(n));\n    }\n}',
      tests: [
        { args: ['10'], expect: '5' },
        { args: ['1'], expect: '0' },
        { args: ['6'], expect: '3' }
      ],
      explain: '循环 1..n，用 i % 2 == 0 判断并计数。也可以直接用 n / 2（整除），但循环写法更通用，适合考试写。' },

    { id: 'ch03-c3', ch: 'ch03', kp: 'ch03-1', tier: 3, type: 'code', difficulty: 1, tags: ['code'],
      stem: '补全方法 <code>sign</code>：n 为正返回 "pos"、为 0 返回 "zero"、为负返回 "neg"。',
      starter: 'public class Q {\n    static String sign(int n) {\n        return "";\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(sign(n));\n    }\n}',
      solution: 'public class Q {\n    static String sign(int n) {\n        if (n > 0) {\n            return "pos";\n        }\n        if (n < 0) {\n            return "neg";\n        }\n        return "zero";\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(sign(n));\n    }\n}',
      tests: [
        { args: ['5'], expect: 'pos' },
        { args: ['0'], expect: 'zero' },
        { args: ['-3'], expect: 'neg' }
      ],
      explain: '三条分支：>0、&lt;0、其余（=0）。注意不要写成两个 if 后遗漏 0 的情况；返回 String 的方法每条路径都要 return。' },

    { id: 'ch03-c4', ch: 'ch03', kp: 'ch03-7', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>reverseInt</code>：返回整数 n 反转后的值（如 123 → 321，n ≥ 0，末尾的 0 会消失）。',
      starter: 'public class Q {\n    static int reverseInt(int n) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(reverseInt(n));\n    }\n}',
      solution: 'public class Q {\n    static int reverseInt(int n) {\n        int rev = 0;\n        while (n > 0) {\n            rev = rev * 10 + n % 10;\n            n = n / 10;\n        }\n        return rev;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(reverseInt(n));\n    }\n}',
      tests: [
        { args: ['123'], expect: '321' },
        { args: ['10'], expect: '1' },
        { args: ['7'], expect: '7' },
        { args: ['0'], expect: '0' }
      ],
      explain: '拆位模板的变体：每次取 n%10 追加到 rev 末尾（rev = rev*10 + 个位），再 n /= 10。10 → rev=0*10+0=0，n=1 → rev=0*10+1=1，得到 1（前导零消失）。' },

    { id: 'ch03-n1', ch: 'ch03', kp: 'ch03-9', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '`for (int i = 0; i &lt; 5; i++) { … }` 的循环体执行几次？',
      options: [
        { text: '5 次', correct: true },
        { text: '4 次' },
        { text: '6 次' },
        { text: '无限次' }
      ],
      explain: 'i 取 0、1、2、3、4 共 5 个值；i=5 时条件 5&lt;5 为假退出。数次数的四步法：找初值（0）→ 列前三个值和最后一个值 → 确认条件在哪一步变假 → 反算次数。' },

    { id: 'ch03-n2', ch: 'ch03', kp: 'ch03-9', tier: 1, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '`int n = 5; for (int i = 0; i &lt; n; i += 2) { c++; }` 执行几次？',
      options: [
        { text: '3 次（i = 0、2、4）', correct: true },
        { text: '2 次' },
        { text: '5 次' },
        { text: '6 次' }
      ],
      explain: 'i 取 0、2、4，下一个 6 不满足 6&lt;5 退出 → 3 次 = ceil(5/2)。别按 n/步长想当然（5/2=2 是错的）。步长为 2 时把 i 的取值逐个列出来最稳。' },

    { id: 'ch03-n3', ch: 'ch03', kp: 'ch03-9', tier: 1, type: 'fill', difficulty: 3, tags: ['trap'],
      stem: '填空：`int m = 3; while (m-- > 0) { … }` 循环结束后，m 的值是 _____。',
      answer: ['-1', '－1'],
      explain: '`m--` 是“先用后减”：比较时用 m 的当前值，比较完 m 再减 1。m=3 比 3>0 成立、m 变 2；2>0、变 1；1>0、变 0；0>0 不成立退出——但这次比较后 m 仍减了 1，变成 -1。所以执行 3 次、结束后 m=-1（“多减的一次”）。' },

    { id: 'ch03-n4', ch: 'ch03', kp: 'ch03-9', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序四个计数器输出的完整结果（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int n = 6;\n        int c1 = 0;\n        for (int i = 0; i < n; i++) {\n            c1++;\n        }\n        System.out.println(c1);\n        int c2 = 0;\n        for (int i = 0; i <= n; i += 2) {\n            c2++;\n        }\n        System.out.println(c2);\n        int c3 = 0;\n        for (int i = n; i > 0; i -= 2) {\n            c3++;\n        }\n        System.out.println(c3);\n        int c4 = 0;\n        for (int i = 1; i < n; i *= 2) {\n            c4++;\n        }\n        System.out.println(c4);\n    }\n}',
      answer: '6\n4\n3\n3',
      explain: '① i=0..5 → 6 次；② i=0,2,4,6（&lt;=6）→ 4 次；③ i=6,4,2 → 3 次（下一个 0 不满足 >0）；④ i=1,2,4 → 3 次（下一个 8 不满足 &lt;6）。四个循环覆盖了正序、含端点、倒序、倍增四种形态。' },

    { id: 'ch03-n5', ch: 'ch03', kp: 'ch03-9', tier: 4, type: 'predict', difficulty: 3, tags: ['output', 'trap'],
      stem: '<b>综合</b>：读下面五个循环计数程序，<b>写出完整输出（逐行）</b>。追问：① `while (m-- > 0)` 结束后 m 为什么是 -1？② 最后一个 for 的更新格为什么不是 k++？',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int n = 5;\n        int c = 0;\n        for (int i = 0; i < n; i++) {\n            c++;\n        }\n        System.out.println(c);\n        int c2 = 0;\n        for (int i = 0; i <= n; i += 2) {\n            c2++;\n        }\n        System.out.println(c2);\n        int m = 3;\n        int c3 = 0;\n        while (m-- > 0) {\n            c3++;\n        }\n        System.out.println(c3 + " " + m);\n        int c4 = 0;\n        for (int i = 10; i > 0; i /= 2) {\n            c4++;\n        }\n        System.out.println(c4);\n        int c5 = 0;\n        for (int k = 0; k < 10; c5++) {\n            k += 3;\n        }\n        System.out.println(c5);\n    }\n}',
      answer: '5\n3\n3 -1\n4\n4',
      explain: '① i=0..4 → 5；② i&lt;=5 且步长 2：0、2、4 → 3；③ m-- 先用后减：3、2、1 各执行一次，最后比较 0>0 不成立但 m 又减成 -1 → `3 -1`；④ i=10、5、2、1 → 4 次；⑤ 更新格写的是 c5++（计数），真正的推进在循环体 `k += 3`：k=0、3、6、9 四轮后 k=12 退出，c5=4。数循环题要同时看“条件”和“更新到底在哪”。' },

    { id: 'ch03-n6', ch: 'ch03', kp: 'ch03-10', tier: 1, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '在 for 循环体里手动修改循环变量（如 `if (i == 2) i = 3;`）最可能导致什么？',
      options: [
        { text: '某些值被跳过、循环提前结束，结果难以预测', correct: true },
        { text: '编译错误：循环变量不能被修改' },
        { text: '自动恢复原值，没有影响' },
        { text: '循环变成无限循环' }
      ],
      explain: '循环变量最好只由 for 的第三格修改。体里改 i 会与 for 的 i++ 叠加：i=2 时设为 3，循环结束再 ++ 变 4 → 跳过了 3。这类 bug 不报错、结果就是不对，是边界反例的典型。' },

    { id: 'ch03-n7', ch: 'ch03', kp: 'ch03-10', tier: 1, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '`double sum = 0.0; int count = 0; while (sum &lt; 1.0) { sum += 0.1; count++; }` 执行后 count 是多少？',
      options: [
        { text: '11', correct: true },
        { text: '10' },
        { text: '9' },
        { text: '无限循环' }
      ],
      explain: '0.1 在二进制里是无限循环小数，累加 10 次得到的 sum 是 0.9999999999999999（小于 1），于是多跑一轮变成 11。这是“浮点循环边界”经典陷阱：涉及小数累加的循环条件可能比预期多一次。' },

    { id: 'ch03-n8', ch: 'ch03', kp: 'ch03-10', tier: 1, type: 'tf', difficulty: 2, tags: ['trap'],
      stem: '判断：`for (int i = 0; i &lt; 3; i++);` 末尾的分号会让循环体变成空语句。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: 'for 语句头后面的分号是“空语句”，循环体会空转 3 次，后面的语句只执行一次。这是“隐形 bug”：写代码时多打一个分号，逻辑就全错了。看到 `for (...);` 要警觉。' },

    { id: 'ch03-n9', ch: 'ch03', kp: 'ch03-10', tier: 2, type: 'predict', difficulty: 2, tags: ['output', 'trap'],
      stem: '写出下面程序演示三个边界反例后的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int max = Integer.MAX_VALUE;\n        max = max + 1;\n        System.out.println(max);\n        int count = 0;\n        double sum = 0.0;\n        while (sum < 1.0) {\n            sum += 0.1;\n            count++;\n        }\n        System.out.println(count);\n        int x = 0;\n        for (int i = 0; i < 5; i++) {\n            System.out.print(i + " ");\n            if (i == 2) {\n                i = 3;\n            }\n        }\n        System.out.println();\n    }\n}',
      answer: '-2147483648\n11\n0 1 2 4',
      explain: '① int 最大值 +1 溢出回绕到 -2147483648；② 0.1 累加 11 次才 ≥ 1（浮点误差）；③ 循环体里 i=2 时改成 3，for 更新再加 1 变 4 → 打印 0 1 2 4（跳过 3）。三个反例分别对应溢出、浮点边界、循环变量被篡改。' },

    { id: 'ch03-n10', ch: 'ch03', kp: 'ch03-10', tier: 4, type: 'predict', difficulty: 3, tags: ['output', 'trap'],
      stem: '<b>综合</b>：读下面的“六条边界规律”演示程序，<b>写出完整输出（逐行）</b>。追问：① 第一行为什么跳过 3？② count 为什么是 11？③ k 为什么是 1？',
      code: 'public class Q {\n    public static void main(String[] args) {\n        for (int i = 0; i < 5; i++) {\n            System.out.print(i + " ");\n            if (i == 2) {\n                i = 3;\n            }\n        }\n        System.out.println();\n        int count = 0;\n        double sum = 0.0;\n        while (sum < 1.0) {\n            sum += 0.1;\n            count++;\n        }\n        System.out.println("count=" + count);\n        int max = Integer.MAX_VALUE;\n        max = max + 1;\n        System.out.println(max);\n        int k = 0;\n        for (int i = 0; i < 3; i++) {\n            ;\n        }\n        k++;\n        System.out.println("k=" + k);\n        int[] a = {10, 20, 30};\n        System.out.println("last=" + a[a.length - 1]);\n    }\n}',
      answer: '0 1 2 4\ncount=11\n-2147483648\nk=1\nlast=30',
      explain: '① 循环体里 i=2 改成 3，for 更新 i++ 变 4 → 打印 0 1 2 4；② 0.1 累加有浮点误差，10 次后 sum 仍 &lt;1，第 11 次才 ≥1 → count=11；③ int 溢出 → -2147483648；④ `for (...)` 后多一个分号，循环体是空语句，k++ 只在循环后执行一次 → k=1；⑤ 最后一个元素是 a[a.length-1]，不是 a[a.length] → last=30。这些都是期中改错题的高频素材。' },

    { id: 'ch03-n11', ch: 'ch03', kp: 'ch03-11', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '调试一个“能运行但结果不对”的循环时，第一步应该做什么？',
      options: [
        { text: '先明确预期：把“应该输出什么”写在纸上，再和实际输出对照', correct: true },
        { text: '把循环全部改写成 while' },
        { text: '把变量名全部重命名' },
        { text: '直接删掉循环重新写' }
      ],
      explain: '调试四步：① 确认预期（写下应该输出什么）；② 缩小范围（最小复现）；③ 逐轮列表（列出每轮的 i、sum、count）；④ 一次只改一处。没有预期就无法判断对错——这是新手最常跳过的一步。' },

    { id: 'ch03-n12', ch: 'ch03', kp: 'ch03-11', tier: 1, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '数组长度 3，循环写成 `for (int i = 0; i &lt;= a.length; i++)` 会怎样？',
      options: [
        { text: 'i=3 时访问 a[3] 越界，抛 ArrayIndexOutOfBoundsException', correct: true },
        { text: '正常遍历 3 个元素' },
        { text: '编译错误' },
        { text: '少遍历一个元素' }
      ],
      explain: '合法下标是 0~length-1（0、1、2），`i &lt;= 3` 会走到 i=3 → a[3] 越界。正确条件 `i &lt; a.length`。这是最经典的差一错误（off-by-one），考试改错题固定考点。' },

    { id: 'ch03-n13', ch: 'ch03', kp: 'ch03-11', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
      stem: '填空：while 循环写成死循环，最常见的原因是循环变量没有在循环体里被 `_____`（两个字）。',
      answer: ['更新', '修改', '改变'],
      explain: 'while 只负责判断条件，循环变量必须在循环体里朝退出条件推进（i++、i--、读取新值等）。忘了更新 → 条件永远为真 → 死循环。写 while 时先问：哪个变量让循环结束？它在体里变了吗？' },

    { id: 'ch03-n14', ch: 'ch03', kp: 'ch03-11', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '程序本意是求数组元素之和，但运行时报错。指出哪一行有问题并改正。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {5, 8, 2};\n        int sum = 0;\n        for (int i = 0; i <= a.length; i++) {\n            sum += a[i];\n        }\n        System.out.println(sum);\n    }\n}',
      answer: '第 5 行：`i <= a.length` 多走一轮，i=3 时 a[3] 越界。应改为 `i < a.length`',
      accept: [
        { hint: '指出行号（第 5 行）', any: ['第5行', '第 5 行', '5行', '行5', 'line5'] },
        { hint: '把 `<=` 改成 `<`（去掉等号）', any: ['i<a.length', 'i < a.length', '去掉等号', '<=改<', '去等号', '改成小于'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {5, 8, 2};\n        int sum = 0;\n        for (int i = 0; i < a.length; i++) {\n            sum += a[i];\n        }\n        System.out.println(sum);\n    }\n}',
      explain: 'javac 不检查下标值，运行时 i=3 访问 a[3] 抛 `ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3`。循环边界必须是 `i &lt; a.length`。修好后 sum = 5+8+2 = 15。' },

    { id: 'ch03-n15', ch: 'ch03', kp: 'ch03-11', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '“最小复现（minimal reproduction）”在调试中的意思是？',
      options: [
        { text: '把 200 行程序删到只剩“造数据、调方法、打印结果”，让 bug 在最小代码里复现', correct: true },
        { text: '把程序改到最短，不管 bug 是否还在' },
        { text: '复制一份代码再改' },
        { text: '把 bug 记录到文档里' }
      ],
      explain: '最小复现 = 删掉与 bug 无关的代码，只留下能触发问题的最少几行。好处：每行都必须为结果负责，问题往往一眼可见；也方便问人/搜索。数组、集合、递归 bug 都适合用这招。' },

    { id: 'ch03-d1', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'fill', difficulty: 1, tags: ['syntax'],
      stem: '填空：`if (a > b) { … } else if (a == b) { … } ` 中，else if 表示“前面的条件都不成立时，再判断这个条件”，它依赖的是 `_____` 分支的否定。',
      answer: ['if', '第一个', '上方'],
      explain: 'else if 不是“独立再判断一次”，而是“上面 if/else if 都不成立时才轮到我”。这决定了“分支顺序”会影响结果：把范围大的条件写在前面，后面的分支就永远进不去。' },

    { id: 'ch03-d2', ch: 'ch03', kp: 'ch03-8', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: '写 `while (true) { … }` 时，退出循环最常用的语句是？',
      options: [
        { text: 'break（满足某个条件时跳出循环）', correct: true },
        { text: 'continue' },
        { text: 'return 0' },
        { text: 'exit' }
      ],
      explain: 'while(true) 条件恒真，只能靠循环体内的 break（跳出本层循环）或 return（结束方法）退出。continue 只是跳过本轮、仍会继续循环。写 while(true) 必须保证 break 能被执行到，否则死循环。' },

    { id: 'ch03-d3', ch: 'ch03', kp: 'ch03-8', tier: 1, type: 'tf', difficulty: 2, tags: ['trap'],
      stem: '判断：`while (true)` 循环体中如果 `continue` 写在 `break` 之前且总会执行，break 可能永远轮不到。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: 'continue 会跳过本轮剩余语句（包括后面的 break），直接进入下一轮。如果 continue 的条件总是成立、且循环变量在 continue 之后才更新，就可能永远到不了 break → 死循环。写 while(true) 要保证退出路径可达。' },

    /* ============================================================ ch04 数组 */
    { id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '执行 `int[] a = new int[5];` 之后，下面哪一项正确？',
      options: [
        { text: '5 个元素都是 0，a.length 是 5', correct: true },
        { text: '元素未初始化，访问 a[0] 会编译错误' },
        { text: 'a.length 是 5，最后一个元素是 a[5]' },
        { text: '5 个元素都是 null' }
      ],
      explain: 'new int[5] 创建后每个元素自动初始化为 **0**（int 的默认值）；length 是 5，合法下标是 0 ~ 4，a[5] 越界。基本类型数组元素默认 0/false，对象数组元素默认 null。' },

    { id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序的输出。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {3, 1, 4, 1, 5};\n        int s = 0;\n        for (int i = 0; i < a.length; i++) {\n            if (a[i] % 2 == 1) s += a[i];\n        }\n        System.out.println(s);\n    }\n}',
      answer: '10',
      explain: '逐个元素判断奇偶并累加奇数：3（+3）、1（+1）、4（偶数跳过）、1（+1）、5（+5），s = 10。注意循环条件是 i < a.length（不是 <=），最后访问的下标是 a.length-1。' },

    { id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['trap', 'exam'],
      stem: '下面程序会发生什么？',
      code: 'int[] a = new int[3];\na[0] = 1; a[1] = 2; a[2] = 3;\nSystem.out.println(a[3]);',
      options: [
        { text: '输出 0' },
        { text: '输出 3' },
        { text: '运行时抛 ArrayIndexOutOfBoundsException', correct: true },
        { text: '编译错误' }
      ],
      explain: '长度为 3 的数组合法下标只有 0、1、2。a[3] 越界，运行时抛 ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3。编译期 javac 不检查具体下标值，所以不会是编译错误。' },

    { id: 'ch04-q4', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'tf', difficulty: 1, tags: ['trap', 'exam'],
      stem: '判断：获取数组长度用 `a.length()`，和 String 一样带括号。',
      options: [
        { text: '正确（True）' },
        { text: '错误（False）', correct: true }
      ],
      explain: '三者不要混：数组用 **length 属性**（无括号）`a.length`；String 用 **length() 方法**（有括号）`s.length()`；ArrayList 用 `list.size()`。数组 length 是创建时固定的字段，不是方法调用。' },

    { id: 'ch04-q5', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '下面程序输出什么？',
      code: 'int[] a = {1, 2, 3};\nint[] b = a;\nb[0] = 99;\nSystem.out.println(a[0]);',
      options: [
        { text: '1' },
        { text: '99', correct: true },
        { text: '0' },
        { text: '编译错误' }
      ],
      explain: '`int[] b = a;` **不会复制数组**，只是把 b 也指向同一个数组对象（别名 alias）。通过 b 改元素，a 看到的当然也变了。要真正复制得用 `a.clone()`、`Arrays.copyOf(a, a.length)` 或逐元素拷贝。' },

    { id: 'ch04-q6', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'fill', difficulty: 2, tags: ['trap', 'exam'],
      stem: '填空：数组 `arr` 有若干个元素，访问它**最后一个元素**的表达式是 `arr[_____]`。',
      answer: 'arr.length - 1',
      accept: [
        'arr.length-1',
        'arr.length -1',
        'arr.length- 1',
        'length - 1',
        'length-1'
      ],
      explain: '下标从 0 开始，最后一个元素的下标是 length - 1。写 arr[arr.length] 是最常见的越界错误（差一错误 off-by-one）。' },

    { id: 'ch04-q7', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'multi', difficulty: 3, tags: ['trap', 'exam'],
      stem: '下面哪些代码片段在运行时会抛异常，或根本编译不过？（多选）',
      options: [
        { text: '`int[] a = new int[3]; System.out.println(a[3]);`', correct: true },
        { text: '`int[] a = {1, 2, 3}; System.out.println(a.length);`' },
        { text: '`int[] a = new int[3]; a[0] = 1.5;`', correct: true },
        { text: '`int[] a = new int[-1];`', correct: true }
      ],
      explain: 'A：a[3] 越界抛 ArrayIndexOutOfBoundsException；C：double 不能直接赋给 int 元素（可能丢失精度），编译错误；D：负数长度抛 NegativeArraySizeException。B 完全正常，输出 3。' },

    { id: 'ch04-q8', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '执行下面代码，输出是什么？',
      code: 'int[][] m = new int[2][3];\nSystem.out.println(m.length + " " + m[0].length);',
      options: [
        { text: '2 3', correct: true },
        { text: '3 2' },
        { text: '2 2' },
        { text: '6 3' }
      ],
      explain: '`new int[2][3]` 是 2 行 3 列：m.length 是行数 2，m[0].length 是第 0 行的列数 3。二维数组是“数组的数组”，每一行本身是一个 int[] 对象，所以行可以不等长（锯齿数组）。' },

    { id: 'ch04-q9', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '下面程序输出什么？',
      code: 'int[] a = {1, 2, 3};\nfor (int x : a) {\n    x = x * 2;\n}\nSystem.out.println(a[0] + " " + a[2]);',
      options: [
        { text: '2 6' },
        { text: '1 3', correct: true },
        { text: '0 0' },
        { text: '编译错误' }
      ],
      explain: '增强 for（for-each）里的 x 是**元素的副本**，给 x 赋值不会改到数组元素，所以数组仍是 {1,2,3}。要修改数组必须用带下标的普通 for 循环：`a[i] = a[i] * 2;`。' },

    { id: 'ch04-k1', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'predict', difficulty: 2, tags: ['output', 'trap'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        int[] b = a;\n        b[1] = 9;\n        System.out.println(a[1]);\n        int[] c = a.clone();\n        c[0] = 7;\n        System.out.println(a[0] + " " + c[0]);\n        int[] d = new int[3];\n        for (int i = 0; i < a.length; i++) {\n            d[i] = a[i];\n        }\n        d[2] = 0;\n        System.out.println(a[2] + " " + d[2]);\n    }\n}',
      answer: '9\n1 7\n3 0',
      explain: '① `int[] b = a;` 只是复制引用（别名），b[1]=9 改的就是 a 的数组 → a[1] 是 9；② `a.clone()` 复制整个一维数组（新对象），c[0]=7 不影响 a → `1 7`；③ `new int[3]` + 逐元素赋值是手动复制，d[2]=0 不影响 a → `3 0`。一维基本类型数组的 clone 是深拷贝，但二维数组的 clone 只是浅拷贝（内层行仍共享）。' },

    { id: 'ch04-k2', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '关于 Java 数组的“对象”身份，下列说法正确的是？',
      options: [
        { text: '数组是对象，变量里保存的是指向数组的引用，`==` 比较的是否为同一个数组', correct: true },
        { text: '数组是基本类型，和 int 一样直接存值' },
        { text: '`int[] b = a;` 会把数组内容复制一份给 b' },
        { text: '数组没有 toString 方法，所以不能打印' }
      ],
      explain: '数组是**对象**（由 JVM 创建，带 length 属性），数组变量保存的是引用。`int[] b = a;` 只复制引用 → 两个变量指向同一个数组，改一个另一个也变。`a == b` 比较引用是否相同；`Arrays.toString(a)` 可以把数组打印成 `[1, 2, 3]`（直接 println 数组只会得到类似 `[I@1b6d3586` 的地址串）。' },

    { id: 'ch04-f1', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'fill', mode: 'findbug', difficulty: 1, tags: ['bug'],
      stem: '下面程序编译报错。指出哪一行有问题并改正。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        for (int i = 0; i < a.length(); i++) {\n            System.out.print(a[i]);\n        }\n        System.out.println();\n    }\n}',
      answer: '第 4 行：数组的 length 是**属性**不是方法，`a.length()` 应改为 `a.length`（去掉括号）',
      accept: [
        { hint: '指出行号（第 4 行）', any: ['第4行', '第 4 行', '4行', '行4', 'line4'] },
        { hint: '把 `a.length()` 改成 `a.length`（去掉括号）', any: ['去括号', '去掉括号', 'a.length', 'length属性', '不是方法'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        for (int i = 0; i < a.length; i++) {\n            System.out.print(a[i]);\n        }\n        System.out.println();\n    }\n}',
      explain: '三个“长度”要分清：数组 `a.length`（属性，**无括号**）；字符串 `s.length()`（方法，有括号）；集合 `list.size()`（方法）。javac 对 `a.length()` 报 `cannot find symbol: method length()`。' },

    { id: 'ch04-f2', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'fill', mode: 'findbug', difficulty: 3, tags: ['bug'],
      stem: '程序本意是“复制一份数组再修改副本，原数组保持不变”，但输出 15。指出哪一行有问题并改正。',
      code: 'public class Q {\n    static int sum(int[] a) {\n        int s = 0;\n        for (int i = 0; i < a.length; i++) {\n            s += a[i];\n        }\n        return s;\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        int[] b = a;\n        b[0] = 10;\n        System.out.println(sum(a));\n    }\n}',
      answer: '第 11 行：`int[] b = a;` 只是别名，改 b 会改到同一数组；应改为 `int[] b = a.clone();`（或 Arrays.copyOf）',
      accept: [
        { hint: '指出行号（第 11 行）', any: ['第11行', '第 11 行', '11行', '行11', 'line11'] },
        { hint: '改成复制数组：`a.clone()` / `Arrays.copyOf(a, a.length)`', any: ['clone', 'copyOf', '复制', '深拷贝', '新数组'] }
      ],
      fix: 'public class Q {\n    static int sum(int[] a) {\n        int s = 0;\n        for (int i = 0; i < a.length; i++) {\n            s += a[i];\n        }\n        return s;\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        int[] b = a.clone();\n        b[0] = 10;\n        System.out.println(sum(a));\n    }\n}',
      explain: '`int[] b = a;` 只复制了**引用**，b 和 a 指向同一个数组对象，b[0]=10 当然改到 a。要真正复制一维基本类型数组用 `a.clone()` 或 `Arrays.copyOf(a, a.length)`。这就是“别名（aliasing）”陷阱：赋值不会复制对象。' },

    { id: 'ch04-c1', ch: 'ch04', kp: 'ch04-3', tier: 3, type: 'code', difficulty: 1, tags: ['code'],
      stem: '补全方法 <code>sumArray</code>：返回 int 数组所有元素之和（空数组返回 0）。<br>已给出测试入口，不要修改 <code>main</code>。',
      starter: 'public class Q {\n    static int sumArray(int[] a) {\n        // TODO: 返回所有元素之和\n        return 0;\n    }\n    public static void main(String[] args) {\n        int[] a = new int[args.length];\n        for (int i = 0; i < args.length; i++) {\n            a[i] = Integer.parseInt(args[i]);\n        }\n        System.out.println(sumArray(a));\n    }\n}',
      solution: 'public class Q {\n    static int sumArray(int[] a) {\n        int sum = 0;\n        for (int i = 0; i < a.length; i++) {\n            sum += a[i];\n        }\n        return sum;\n    }\n    public static void main(String[] args) {\n        int[] a = new int[args.length];\n        for (int i = 0; i < args.length; i++) {\n            a[i] = Integer.parseInt(args[i]);\n        }\n        System.out.println(sumArray(a));\n    }\n}',
      tests: [
        { args: ['1', '2', '3'], expect: '6' },
        { args: ['-1', '5', '2'], expect: '6' },
        { args: [], expect: '0' }
      ],
      explain: '累加器模式：`int sum = 0;` 然后遍历 `sum += a[i];`，最后返回 sum。循环条件必须是 `i < a.length`（不是 <=，否则越界）。负数、空数组都是必须想到的边界。' },

    { id: 'ch04-c2', ch: 'ch04', kp: 'ch04-3', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>maxIndex</code>：返回数组中<b>最大元素的下标</b>（有并列时返回最先出现的那个；空数组返回 -1）。<br>已给出测试入口，不要修改 <code>main</code>。',
      starter: 'public class Q {\n    static int maxIndex(int[] a) {\n        // TODO: 返回最大元素的下标（空数组返回 -1）\n        return -1;\n    }\n    public static void main(String[] args) {\n        int[] a = new int[args.length];\n        for (int i = 0; i < args.length; i++) {\n            a[i] = Integer.parseInt(args[i]);\n        }\n        System.out.println(maxIndex(a));\n    }\n}',
      solution: 'public class Q {\n    static int maxIndex(int[] a) {\n        if (a.length == 0) {\n            return -1;\n        }\n        int best = 0;\n        for (int i = 1; i < a.length; i++) {\n            if (a[i] > a[best]) {\n                best = i;\n            }\n        }\n        return best;\n    }\n    public static void main(String[] args) {\n        int[] a = new int[args.length];\n        for (int i = 0; i < args.length; i++) {\n            a[i] = Integer.parseInt(args[i]);\n        }\n        System.out.println(maxIndex(a));\n    }\n}',
      tests: [
        { args: ['3', '9', '2', '9'], expect: '1' },
        { args: ['1'], expect: '0' },
        { args: [], expect: '-1' },
        { args: ['-5', '-2', '-9'], expect: '1' }
      ],
      explain: '求最大值的“下标版”是一个必须练熟的套路：用 best 记住当前最大元素的位置，从 i=1 开始比较，`a[i] > a[best]` 时更新 best（用 > 而不是 >=，并列时保留最先出现的下标）。空数组要单独返回 -1，否则 `a[0]` 会越界。' },

    { id: 'ch04-c3', ch: 'ch04', kp: 'ch04-2', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>isSorted</code>：如果数组是<b>非降序</b>（每个元素都不小于前一个，允许相等）返回 true，否则返回 false；空数组和单元素数组都返回 true。<br>已给出测试入口，不要修改 <code>main</code>。',
      starter: 'public class Q {\n    static boolean isSorted(int[] a) {\n        // TODO: 非降序返回 true，否则 false\n        return false;\n    }\n    public static void main(String[] args) {\n        int[] a = new int[args.length];\n        for (int i = 0; i < args.length; i++) {\n            a[i] = Integer.parseInt(args[i]);\n        }\n        System.out.println(isSorted(a));\n    }\n}',
      solution: 'public class Q {\n    static boolean isSorted(int[] a) {\n        for (int i = 0; i + 1 < a.length; i++) {\n            if (a[i] > a[i + 1]) {\n                return false;\n            }\n        }\n        return true;\n    }\n    public static void main(String[] args) {\n        int[] a = new int[args.length];\n        for (int i = 0; i < args.length; i++) {\n            a[i] = Integer.parseInt(args[i]);\n        }\n        System.out.println(isSorted(a));\n    }\n}',
      tests: [
        { args: ['1', '2', '3'], expect: 'true' },
        { args: ['1', '3', '2'], expect: 'false' },
        { args: ['2', '2', '2'], expect: 'true' },
        { args: [], expect: 'true' }
      ],
      explain: '相邻比较：只要发现 `a[i] > a[i + 1]` 就立刻 return false，全部扫完没发现才 return true。循环条件用 `i + 1 < a.length`（等价于 i < a.length - 1），避免 a[i+1] 越界。注意“非降序”允许相等，所以判断用 > 而不是 >=。' },

    { id: 'ch04-c4', ch: 'ch04', kp: 'ch04-3', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>reverse</code>：<b>原地</b>把数组反转（不能新建数组返回）。<code>main</code> 会打印反转后的元素。',
      starter: 'public class Q {\n    static void reverse(int[] a) {\n        // TODO: 原地反转（用左右两个指针交换）\n    }\n    public static void main(String[] args) {\n        int[] a = new int[args.length];\n        for (int i = 0; i < args.length; i++) {\n            a[i] = Integer.parseInt(args[i]);\n        }\n        reverse(a);\n        for (int i = 0; i < a.length; i++) {\n            System.out.print(a[i] + (i == a.length - 1 ? "" : " "));\n        }\n        System.out.println();\n    }\n}',
      solution: 'public class Q {\n    static void reverse(int[] a) {\n        int i = 0;\n        int j = a.length - 1;\n        while (i < j) {\n            int t = a[i];\n            a[i] = a[j];\n            a[j] = t;\n            i++;\n            j--;\n        }\n    }\n    public static void main(String[] args) {\n        int[] a = new int[args.length];\n        for (int i = 0; i < args.length; i++) {\n            a[i] = Integer.parseInt(args[i]);\n        }\n        reverse(a);\n        for (int i = 0; i < a.length; i++) {\n            System.out.print(a[i] + (i == a.length - 1 ? "" : " "));\n        }\n        System.out.println();\n    }\n}',
      tests: [
        { args: ['1', '2', '3', '4', '5'], expect: '5 4 3 2 1' },
        { args: ['7'], expect: '7' },
        { args: [], expect: '' }
      ],
      explain: '双指针交换：i 从左往右、j 从右往左，交换 a[i] 与 a[j]，直到 i >= j 停止。交换必须借助临时变量 t（`a[i] = a[j]; a[j] = t;` 会丢值）。因为 Java 只有值传递，swap(int a, int b) 这种写法换不了，必须在数组上按下标操作。' },

    { id: 'ch04-c5', ch: 'ch04', kp: 'ch04-2', tier: 3, type: 'code', difficulty: 3, tags: ['code'],
      stem: '补全方法 <code>countChar</code>：返回字符串 <code>s</code> 中字符 <code>c</code> 出现的次数。<code>main</code> 用命令行参数 <code>args[0]</code> 作字符串、<code>args[1]</code> 的首字符作 c。',
      starter: 'public class Q {\n    static int countChar(String s, char c) {\n        // TODO: 返回 s 中 c 出现的次数\n        return 0;\n    }\n    public static void main(String[] args) {\n        System.out.println(countChar(args[0], args[1].charAt(0)));\n    }\n}',
      solution: 'public class Q {\n    static int countChar(String s, char c) {\n        int count = 0;\n        for (int i = 0; i < s.length(); i++) {\n            if (s.charAt(i) == c) {\n                count++;\n            }\n        }\n        return count;\n    }\n    public static void main(String[] args) {\n        System.out.println(countChar(args[0], args[1].charAt(0)));\n    }\n}',
      tests: [
        { args: ['banana', 'a'], expect: '3' },
        { args: ['hello', 'z'], expect: '0' },
        { args: ['aaa', 'a'], expect: '3' }
      ],
      explain: '字符串用 `s.length()`（方法，带括号）和 `s.charAt(i)` 取字符；char 用 `==` 比较即可（基本类型）。注意数组是 `a.length`（无括号），两者容易混。遍历时 i 从 0 到 length()-1。' },

    { id: 'ch04-p1', ch: 'ch04', kp: 'ch04-3', tier: 4, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '读下面的程序，<b>写出完整输出（逐行）</b>。追问：① 前缀和数组 b 的作用是什么？② 反转后数组的 a[0] + a[5] 是多少？③ 增强 for 遍历时 i 与元素的对应关系？',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {4, 1, 7, 3, 8, 2};\n        int sum = 0;\n        int max = a[0];\n        for (int i = 0; i < a.length; i++) {\n            sum += a[i];\n            if (a[i] > max) {\n                max = a[i];\n            }\n        }\n        System.out.println(sum + " " + max);\n        int[] b = new int[a.length];\n        int acc = 0;\n        for (int i = 0; i < a.length; i++) {\n            acc += a[i];\n            b[i] = acc;\n        }\n        for (int i = 0; i < b.length; i++) {\n            System.out.print(b[i] + (i == b.length - 1 ? "" : ","));\n        }\n        System.out.println();\n        int i = 0;\n        int j = a.length - 1;\n        while (i < j) {\n            int t = a[i];\n            a[i] = a[j];\n            a[j] = t;\n            i++;\n            j--;\n        }\n        for (int x : a) {\n            System.out.print(x + " ");\n        }\n        System.out.println();\n        System.out.println(a[0] + a[a.length - 1]);\n    }\n}',
      answer: '25 8\n4,5,12,15,23,25\n2 8 3 7 1 4\n6',
      explain: '① 遍历求和得 25，最大值 8 → `25 8`；② 前缀和：acc 依次累加 4、5、12、15、23、25，b = {4,5,12,15,23,25}，按逗号拼接 → `4,5,12,15,23,25`；③ 双指针反转 {4,1,7,3,8,2} → {2,8,3,7,1,4}，增强 for 打印每个元素加空格 → `2 8 3 7 1 4 `；④ a[0] + a[5] = 2 + 4 = 6。注意 b 是**新数组**，不影响 a。' },

    { id: 'ch04-t1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: '`int[] a = new int[5];` 与 `int a[];` 的区别是？',
      options: [
        { text: '前者创建了一个长度 5 的数组，后者只声明了引用、还没创建数组', correct: true },
        { text: '两者完全等价，都创建了长度 5 的数组' },
        { text: '前者是错误写法，Java 只能写 int a[]' },
        { text: '后者创建了长度 5 的数组' }
      ],
      explain: '`int[] a;` 只声明一个 int 数组引用（此时 a 是 null），`new int[5]` 才真正在堆上创建数组。`int a[]` 与 `int[] a` 是同一类型的两种写法（C 风格）。声明后必须 new 或用 `{...}` 初始化，才能访问元素。' },

    { id: 'ch04-t2', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'fill', difficulty: 1, tags: ['syntax'],
      stem: '填空：访问数组越界时，JVM 抛出的异常名是 `_____Exception`（只填类名主体，不含 Exception）。',
      answer: ['ArrayIndexOutOfBounds', 'IndexOutOfBounds', 'ArrayIndexOutOfBoundsException'],
      explain: '越界抛 `ArrayIndexOutOfBoundsException`，消息形如 `Index 5 out of bounds for length 5`；字符串越界抛 `StringIndexOutOfBoundsException`。注意：负下标也属于越界，且编译期不检查具体下标值（运行时才抛）。' },

    { id: 'ch04-t3', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'tf', difficulty: 1, tags: ['trap'],
      stem: '判断：`int[] a = new int[5];` 之后，合法下标是 0、1、2、3、4、5。',
      options: [
        { text: '正确（True）' },
        { text: '错误（False）', correct: true }
      ],
      explain: '长度 5 的数组合法下标是 **0 到 4**（length-1），a[5] 越界。下标从 0 开始，所以“最后一个元素”是 a[a.length - 1]。差一错误（off-by-one）是数组题最常见的 bug。' },

    { id: 'ch04-t4', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '执行 `int[] a = new int[-1];` 会发生什么？',
      options: [
        { text: '编译错误：数组长度必须是常量' },
        { text: '运行时抛 NegativeArraySizeException', correct: true },
        { text: '正常创建空数组，length 为 0' },
        { text: '运行时抛 ArrayIndexOutOfBoundsException' }
      ],
      explain: '数组长度可以是变量（运行时确定），但**不能是负数**：负数长度会在运行时抛 `NegativeArraySizeException`。编译期 javac 不检查这个值（它不知道变量运行时是多少），所以不是编译错误。合法的空数组是 `new int[0]`，length 为 0。' },

    { id: 'ch04-t5', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {4, -2, 7, 0, -5, 3};\n        int pos = 0;\n        int neg = 0;\n        int sum = 0;\n        for (int i = 0; i < a.length; i++) {\n            if (a[i] > 0) {\n                pos++;\n            } else if (a[i] < 0) {\n                neg++;\n            }\n            sum += a[i];\n        }\n        System.out.println(pos + " " + neg);\n        System.out.println(sum);\n        int max = a[0];\n        int idx = 0;\n        for (int i = 1; i < a.length; i++) {\n            if (a[i] > max) {\n                max = a[i];\n                idx = i;\n            }\n        }\n        System.out.println(max + "@" + idx);\n    }\n}',
      answer: '3 2\n7\n7@2',
      explain: '① 遍历统计：正数 4、7、3 共 3 个，负数 -2、-5 共 2 个 → `3 2`；② 求和 4-2+7+0-5+3 = 7；③ 找最大值同时记下标：max 从 a[0]=4 开始，7 > 4 更新为 7（下标 2）→ `7@2`。找最大值/最小值时用第一个元素作初值最稳（用 0 作初值在全负数组上会出错）。' },

    { id: 'ch04-f3', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '程序本意是求数组最大值，但一运行就崩溃。指出哪一行有问题并改正。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {3, 8, 2, 9};\n        int max = a[0];\n        for (int i = 0; i <= a.length; i++) {\n            if (a[i] > max) {\n                max = a[i];\n            }\n        }\n        System.out.println(max);\n    }\n}',
      answer: '第 5 行：`i <= a.length` 会走到 a[4]，越界。应改为 `i < a.length`（且从 i=1 开始更自然）',
      accept: [
        { hint: '指出行号（第 5 行）', any: ['第5行', '第 5 行', '5行', '行5', 'line5'] },
        { hint: '把 `<=` 改成 `<`（去掉等号）', any: ['i<a.length', 'i < a.length', '去掉等号', '<=改<', '改成小于', '去等号'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {3, 8, 2, 9};\n        int max = a[0];\n        for (int i = 1; i < a.length; i++) {\n            if (a[i] > max) {\n                max = a[i];\n            }\n        }\n        System.out.println(max);\n    }\n}',
      explain: 'javac 不检查下标值，运行时 i=4 时访问 a[4] 抛 `ArrayIndexOutOfBoundsException: Index 4 out of bounds for length 4`。循环边界必须是 `i &lt; a.length`；另外找最大值从 i=1 开始即可（a[0] 已作为初值）。' },

    { id: 'ch04-t7', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '关于二维数组 `int[][] m = new int[3][];`，下列说法正确的是？',
      options: [
        { text: '这是合法的：创建了 3 行的“数组的数组”，但每行还是 null，需要再 new', correct: true },
        { text: '编译错误：二维数组必须同时指定列数' },
        { text: '创建了 3×3 的数组，元素都是 0' },
        { text: '创建了 3 个长度为 0 的数组' }
      ],
      explain: '二维数组是“数组的数组”：`new int[3][]` 只创建外层 3 个引用槽（每行暂时是 null），之后可以 `m[0] = new int[4];` 逐行指定长度——这就是**锯齿数组**。`new int[3][4]` 才是 3 行 4 列全 0。访问未初始化的行（m[0][0]）会 NullPointerException。' },

    { id: 'ch04-t8', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int[][] m = {{1, 2, 3}, {4, 5, 6}};\n        int sum = 0;\n        for (int i = 0; i < m.length; i++) {\n            for (int j = 0; j < m[i].length; j++) {\n                sum += m[i][j];\n            }\n        }\n        System.out.println(sum);\n        System.out.println(m.length + " " + m[0].length);\n        int diag = 0;\n        int[][] g = {{1, 2}, {3, 4}};\n        for (int i = 0; i < g.length; i++) {\n            diag += g[i][i];\n        }\n        System.out.println(diag);\n    }\n}',
      answer: '21\n2 3\n5',
      explain: '① 遍历所有元素求和 1+2+3+4+5+6 = 21；② `m.length` 是行数 2，`m[0].length` 是第 0 行的列数 3 → `2 3`；③ 主对角线 `g[i][i]`：1+4 = 5。注意每行的长度可能不同，遍历内层要用 `m[i].length` 而不是 `m[0].length`。' },

    { id: 'ch04-t9', ch: 'ch04', kp: 'ch04-1', tier: 2, type: 'mcq', difficulty: 2, tags: ['syntax'],
      stem: '下面哪种数组创建写法是**非法**的？',
      options: [
        { text: '`int[] a = {1, 2, 3};`' },
        { text: '`int[] a = new int[]{1, 2, 3};`' },
        { text: '`int[] a; a = {1, 2, 3};`', correct: true },
        { text: '`int[] a = new int[3];`' }
      ],
      explain: '花括号初始化器 `{1,2,3}` 只能出现在**声明的同时**，不能脱离声明单独赋值。分开写必须用 `a = new int[]{1, 2, 3};`（注意 new 时方括号里不能写长度）。C 写法 `a = {1,2,3}` 会编译错误。' },

    { id: 'ch04-t10', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['output'],
      stem: '`int[] a = {1, 2, 3, 4, 5};` 执行下面哪段代码后 `a[0]` 变成 5？',
      options: [
        { text: '`for (int x : a) { x = x * 2; }`' },
        { text: '`int t = a[0]; a[0] = a[4]; a[4] = t;`', correct: true },
        { text: '`a = new int[5];`' },
        { text: '`System.out.println(a[4]);`' }
      ],
      explain: 'B 用临时变量交换 a[0] 与 a[4] → [5,2,3,4,1] ✓。增强 for 里的 x 是元素副本，改 x 不影响数组（A 无效）；new int[5] 会让 a 指向新全零数组（C 后 a[0]=0）；打印不改变数组（D）。修改数组元素必须用**下标**。' },

    { id: 'ch04-t11', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '`int[] a = {1, 2, 3}; int[] b = a; b[0] = 100;` 之后，`a[0]` 的值是？',
      options: [
        { text: '1' },
        { text: '100', correct: true },
        { text: '0' },
        { text: '编译错误' }
      ],
      explain: '`int[] b = a;` 只把**引用**复制一份，a、b 指向同一个数组对象（别名），通过 b 改元素，a 看到的当然变了 → 100。要真正复制一维基本类型数组：`int[] b = a.clone();` 或 `Arrays.copyOf(a, a.length)`。' },

    { id: 'ch04-t12', ch: 'ch04', kp: 'ch04-5', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>rowSum</code>：返回二维数组 m 第 r 行所有元素之和（约定 r 合法）。',
      starter: 'public class Q {\n    static int rowSum(int[][] m, int r) {\n        // TODO: 返回二维数组 m 第 r 行的元素之和\n        return 0;\n    }\n    public static void main(String[] args) {\n        int[][] m = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};\n        int r = Integer.parseInt(args[0]);\n        System.out.println(rowSum(m, r));\n    }\n}',
      solution: 'public class Q {\n    static int rowSum(int[][] m, int r) {\n        int sum = 0;\n        for (int j = 0; j < m[r].length; j++) {\n            sum += m[r][j];\n        }\n        return sum;\n    }\n    public static void main(String[] args) {\n        int[][] m = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};\n        int r = Integer.parseInt(args[0]);\n        System.out.println(rowSum(m, r));\n    }\n}',
      tests: [
        { args: ['0'], expect: '6' },
        { args: ['2'], expect: '24' }
      ],
      explain: '二维数组的行就是 `m[r]`，把它当作一维数组遍历即可：`for (int j = 0; j &lt; m[r].length; j++) sum += m[r][j];`。注意内层上界用 `m[r].length`（每行长度），不要写死 3。' },

    { id: 'ch04-t13', ch: 'ch04', kp: 'ch04-3', tier: 4, type: 'predict', difficulty: 3, tags: ['output', 'trap'],
      stem: '读下面的“数组综合”程序，<b>写出完整输出（逐行）</b>。追问：① 平均值为什么打印 4.50？② 反转后的数组是什么？③ inversions 统计的是什么？',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {5, 2, 9, 1, 7, 3};\n        int n = a.length;\n        int sum = 0;\n        for (int i = 0; i < n; i++) {\n            sum += a[i];\n        }\n        double avg = (double) sum / n;\n        System.out.println(sum);\n        System.out.printf("%.2f%n", avg);\n        int maxIdx = 0;\n        for (int i = 1; i < n; i++) {\n            if (a[i] > a[maxIdx]) {\n                maxIdx = i;\n            }\n        }\n        System.out.println("max=" + a[maxIdx] + " at " + maxIdx);\n        int evens = 0;\n        for (int x : a) {\n            if (x % 2 == 0) {\n                evens++;\n            }\n        }\n        System.out.println("evens=" + evens);\n        int[] b = new int[n];\n        for (int i = 0; i < n; i++) {\n            b[i] = a[n - 1 - i];\n        }\n        for (int i = 0; i < n; i++) {\n            System.out.print(b[i] + (i == n - 1 ? "" : " "));\n        }\n        System.out.println();\n        int count = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                if (a[i] > a[j]) {\n                    count++;\n                }\n            }\n        }\n        System.out.println("inversions=" + count);\n    }\n}',
      answer: '27\n4.50\nmax=9 at 2\nevens=1\n3 7 1 9 2 5\ninversions=8',
      explain: '① sum=5+2+9+1+7+3=27，avg=(double)27/6=4.5，`%.2f` 打印 4.50；② 找最大值：maxIdx 从 0 开始，9 在下标 2 → `max=9 at 2`；③ 偶数只有 2 → evens=1；④ 反转 b[i]=a[n-1-i] → 3 7 1 9 2 5；⑤ inversions 统计“前面的数比后面大”的数对：(5,2)(5,1)(5,3)(2,1)(9,1)(9,7)(9,3)(7,3) = 8 对。' },

    { id: 'ch04-c6', ch: 'ch04', kp: 'ch04-3', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>count</code>：返回数组 a 中等于 target 的元素个数。',
      starter: 'public class Q {\n    static int count(int[] a, int target) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 2, 2, 3, 2};\n        int target = Integer.parseInt(args[0]);\n        System.out.println(count(a, target));\n    }\n}',
      solution: 'public class Q {\n    static int count(int[] a, int target) {\n        int n = 0;\n        for (int i = 0; i < a.length; i++) {\n            if (a[i] == target) {\n                n++;\n            }\n        }\n        return n;\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 2, 2, 3, 2};\n        int target = Integer.parseInt(args[0]);\n        System.out.println(count(a, target));\n    }\n}',
      tests: [
        { args: ['2'], expect: '3' },
        { args: ['3'], expect: '1' },
        { args: ['9'], expect: '0' }
      ],
      explain: '遍历 + 计数：命中 a[i] == target 就 n++。空数组/不存在时返回 0，这是必须想到的边界。' },

    { id: 'ch04-c7', ch: 'ch04', kp: 'ch04-6', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>copy</code>：返回一个与 a 内容相同、但<b>互不共享</b>的新数组。',
      starter: 'public class Q {\n    static int[] copy(int[] a) {\n        return a;\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        int[] b = copy(a);\n        b[0] = 99;\n        System.out.println(java.util.Arrays.toString(a));\n        System.out.println(java.util.Arrays.toString(b));\n    }\n}',
      solution: 'public class Q {\n    static int[] copy(int[] a) {\n        int[] b = new int[a.length];\n        for (int i = 0; i < a.length; i++) {\n            b[i] = a[i];\n        }\n        return b;\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        int[] b = copy(a);\n        b[0] = 99;\n        System.out.println(java.util.Arrays.toString(a));\n        System.out.println(java.util.Arrays.toString(b));\n    }\n}',
      tests: [
        { args: [], expect: '[1, 2, 3]\n[99, 2, 3]' }
      ],
      explain: '新建数组 + 逐元素复制。测试把副本 b[0] 改成 99，原数组 a 必须保持 [1, 2, 3]；如果直接 `return a`（TODO 写法），两个输出都会是 [99, 2, 3]，说明只是别名。' },

    { id: 'ch04-c8', ch: 'ch04', kp: 'ch04-3', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>secondMax</code>：返回数组中<b>第二大</b>的元素（约定长度≥2 且元素互不相同）。',
      starter: 'public class Q {\n    static int secondMax(int[] a) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        int[] a = {3, 9, 2, 7};\n        int[] b = {10, 4, 8, 6};\n        System.out.println(secondMax(a));\n        System.out.println(secondMax(b));\n    }\n}',
      solution: 'public class Q {\n    static int secondMax(int[] a) {\n        int max = a[0];\n        int second = a[1];\n        if (second > max) {\n            int t = max;\n            max = second;\n            second = t;\n        }\n        for (int i = 2; i < a.length; i++) {\n            if (a[i] > max) {\n                second = max;\n                max = a[i];\n            } else if (a[i] > second) {\n                second = a[i];\n            }\n        }\n        return second;\n    }\n    public static void main(String[] args) {\n        int[] a = {3, 9, 2, 7};\n        int[] b = {10, 4, 8, 6};\n        System.out.println(secondMax(a));\n        System.out.println(secondMax(b));\n    }\n}',
      tests: [
        { args: [], expect: '7\n8' }
      ],
      explain: '维护“最大”和“第二大”两个变量：新元素比 max 大则 second 继承旧 max；否则若比 second 大就更新 second。初始化时先比较 a[0]、a[1] 保证 max ≥ second。' },

    { id: 'ch04-c9', ch: 'ch04', kp: 'ch04-5', tier: 4, type: 'code', difficulty: 3, tags: ['code'],
      stem: '<b>跨章综合</b>：补全方法 <code>transpose</code>，返回矩阵的转置（把第 i 行第 j 列变成第 j 行第 i 列），并在 main 里逐行打印。',
      starter: 'public class Q {\n    static int[][] transpose(int[][] m) {\n        return new int[0][0];\n    }\n    public static void main(String[] args) {\n        int[][] m = {{1, 2, 3}, {4, 5, 6}};\n        int[][] t = transpose(m);\n        System.out.println(t.length + "x" + t[0].length);\n        for (int i = 0; i < t.length; i++) {\n            for (int j = 0; j < t[i].length; j++) {\n                System.out.print(t[i][j] + (j == t[i].length - 1 ? "" : " "));\n            }\n            System.out.println();\n        }\n    }\n}',
      solution: 'public class Q {\n    static int[][] transpose(int[][] m) {\n        int[][] t = new int[m[0].length][m.length];\n        for (int i = 0; i < m.length; i++) {\n            for (int j = 0; j < m[i].length; j++) {\n                t[j][i] = m[i][j];\n            }\n        }\n        return t;\n    }\n    public static void main(String[] args) {\n        int[][] m = {{1, 2, 3}, {4, 5, 6}};\n        int[][] t = transpose(m);\n        System.out.println(t.length + "x" + t[0].length);\n        for (int i = 0; i < t.length; i++) {\n            for (int j = 0; j < t[i].length; j++) {\n                System.out.print(t[i][j] + (j == t[i].length - 1 ? "" : " "));\n            }\n            System.out.println();\n        }\n    }\n}',
      tests: [
        { args: [], expect: '3x2\n1 4\n2 5\n3 6' }
      ],
      explain: '2×3 矩阵转置后是 3×2：新数组行列互换 `new int[m[0].length][m.length]`，然后 `t[j][i] = m[i][j]`。打印时每行用空格分隔、行末换行。这是数组 + 二维 + 方法 + 循环的综合练习。' },

    { id: 'ch04-n1', ch: 'ch04', kp: 'ch04-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: '`int[] a = {3, 1, 4}; Arrays.sort(a);` 之后，关于 a 的说法正确的是？',
      options: [
        { text: 'a 被原地升序排序为 {1, 3, 4}，没有返回新数组', correct: true },
        { text: '返回一个新数组，a 不变' },
        { text: 'a 变成降序' },
        { text: '编译错误：Arrays 不能排序基本类型' }
      ],
      explain: 'Arrays.sort 原地排序（会修改原数组），返回 void。所以调用后 a 变成升序。要保留原数组需先 copyOf。降序需要 Integer[] + Collections.reverseOrder 或自己倒排。' },

    { id: 'ch04-n2', ch: 'ch04', kp: 'ch04-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['trap'],
      stem: '直接 `System.out.println(a)`（a 是 int 数组）会输出什么？',
      options: [
        { text: '形如 `[I@1a2b3c` 的地址信息，不是数组内容', correct: true },
        { text: '数组内容 `[3, 1, 4]`' },
        { text: '编译错误' },
        { text: '数组长度' }
      ],
      explain: '数组的 toString 没有按内容重写，println(a) 打印的是 `类型@哈希码`（如 [I@1a2b3c）。要看内容必须 `Arrays.toString(a)`；二维数组用 `Arrays.deepToString(m)`。这是“打印数组”题最常见的坑。' },

    { id: 'ch04-n3', ch: 'ch04', kp: 'ch04-7', tier: 1, type: 'fill', difficulty: 1, tags: ['syntax'],
      stem: '填空：要打印二维数组 `int[][] m` 的内容（形如 [[1, 2], [3]]），应调用 `Arrays._____(m)`。',
      answer: ['deepToString'],
      explain: 'Arrays.toString 对二维数组只会打印每行的地址（因为元素是数组对象）；Arrays.deepToString 会递归展开，输出 [[1, 2], [3]]。这是多维/对象数组打印的固定写法。' },

    { id: 'ch04-n4', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面 Arrays 工具类程序的完整输出（逐行）。',
      code: 'import java.util.Arrays;\n\npublic class Q {\n    public static void main(String[] args) {\n        int[] a = {3, 1, 4, 1, 5};\n        System.out.println(Arrays.toString(a));\n        Arrays.sort(a);\n        System.out.println(Arrays.toString(a));\n        int[] b = Arrays.copyOf(a, 3);\n        System.out.println(Arrays.toString(b));\n        int[] c = new int[4];\n        Arrays.fill(c, 7);\n        System.out.println(Arrays.toString(c));\n        int[] d = {1, 2, 3};\n        int[] e = {1, 2, 3};\n        System.out.println(Arrays.equals(d, e));\n        int[][] m = {{1, 2}, {3}};\n        System.out.println(Arrays.deepToString(m));\n        System.out.println(Arrays.binarySearch(a, 4));\n    }\n}',
      answer: '[3, 1, 4, 1, 5]\n[1, 1, 3, 4, 5]\n[1, 1, 3]\n[7, 7, 7, 7]\ntrue\n[[1, 2], [3]]\n3',
      explain: '① toString 打印原数组；② sort 原地升序；③ copyOf(a, 3) 取前 3 个 → [1, 1, 3]；④ fill 全填 7；⑤ equals 比较内容 → true；⑥ deepToString 打印二维 → [[1, 2], [3]]；⑦ binarySearch 在已排序数组中找 4 → 下标 3（二分查找前数组必须有序）。' },

    { id: 'ch04-n5', ch: 'ch04', kp: 'ch04-7', tier: 4, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '<b>综合</b>：读下面的成绩处理程序（全部用 Arrays 工具类），<b>写出完整输出（逐行）</b>。追问：① copyOfRange 的参数含义？② 为什么 equals(scores, top3) 是 false？',
      code: 'import java.util.Arrays;\n\npublic class Q {\n    public static void main(String[] args) {\n        int[] scores = {72, 95, 60, 88, 95};\n        System.out.println("len=" + scores.length);\n        System.out.println(Arrays.toString(scores));\n        Arrays.sort(scores);\n        System.out.println(Arrays.toString(scores));\n        System.out.println("max=" + scores[scores.length - 1]);\n        System.out.println("min=" + scores[0]);\n        int[] top3 = Arrays.copyOfRange(scores, scores.length - 3, scores.length);\n        System.out.println(Arrays.toString(top3));\n        int[] zeros = new int[3];\n        System.out.println(Arrays.toString(zeros));\n        System.out.println(Arrays.equals(scores, top3));\n        int[] copy = Arrays.copyOf(scores, scores.length);\n        System.out.println(Arrays.equals(scores, copy));\n    }\n}',
      answer: 'len=5\n[72, 95, 60, 88, 95]\n[60, 72, 88, 95, 95]\nmax=95\nmin=60\n[88, 95, 95]\n[0, 0, 0]\nfalse\ntrue',
      explain: '① 原数组 [72, 95, 60, 88, 95]；② sort 后 [60, 72, 88, 95, 95]；③ max = 最后一个 = 95、min = 第一个 = 60；④ copyOfRange(a, from, to) 是左闭右开：取下标 2..4 → [88, 95, 95]；⑤ new int[3] 默认全 0；⑥ equals(scores, top3) 长度都 5 vs 3？top3 长度 3、scores 长度 5 → false；⑦ copyOf 复制同长 → equals true。' },

    { id: 'ch04-n6', ch: 'ch04', kp: 'ch04-8', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '数组 bug 大致分两类，下面哪项分类正确？',
      options: [
        { text: '一类会抛异常（越界、空指针）容易定位；另一类不报错但结果错（差一、别名、初值错）更危险', correct: true },
        { text: '一类是编译错误，一类是拼写错误' },
        { text: '一类在数组里，一类在字符串里' },
        { text: '数组不会出现不报错的 bug' }
      ],
      explain: '抛异常的 bug 有行号可查；不报错的 bug（循环边界差一、别名共享、初值用 0 导致全负数组出错）只能靠预期与实际对照、画下标轴、最小复现来定位。后者才是调试训练的重点。' },

    { id: 'ch04-n7', ch: 'ch04', kp: 'ch04-8', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '调试数组下标问题时，最有效的手工方法是？',
      options: [
        { text: '在纸上画下标轴 0~length-1，写出循环变量每一步的值，检查每次访问是否在范围内', correct: true },
        { text: '把数组长度改成 0 再试' },
        { text: '把 for 全部改成 while' },
        { text: '加一堆无关的 println 分散注意力' }
      ],
      explain: '数组 bug 的核心是“某一步的下标出界/差一”。画下标轴 + 列出每轮 i 的取值，能一眼看出第一次和最后一次访问是否越界。配合最小复现（只留造数组、循环、打印）效果最好。' },

    { id: 'ch04-n8', ch: 'ch04', kp: 'ch04-8', tier: 1, type: 'tf', difficulty: 2, tags: ['concept'],
      stem: '判断：把出错程序删到只剩“造数组、调方法、打印结果”三块再复现，是定位数组 bug 的有效技巧。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: '这就是最小复现：最小程序里每行都必须为结果负责，问题往往一眼可见；也便于对比正确/错误版本。数组、集合、递归 bug 都适用。删代码时一次只删一块，确认 bug 仍在，否则可能删掉了触发条件。' },

    { id: 'ch04-n9', ch: 'ch04', kp: 'ch04-8', tier: 2, type: 'fill', mode: 'findbug', difficulty: 3, tags: ['bug'],
      stem: '程序本意是求数组最大值，但数组全是负数时输出 0（错误）。指出哪一行有问题并改正。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {-5, -2, -9};\n        int max = 0;\n        for (int i = 0; i < a.length; i++) {\n            if (a[i] > max) {\n                max = a[i];\n            }\n        }\n        System.out.println(max);\n    }\n}',
      answer: '第 4 行：`int max = 0;` 初值错了，全负数组时 0 比所有元素都大。应改为 `int max = a[0];`（循环从 i=1 开始）',
      accept: [
        { hint: '指出初值行（第 4 行 `max = 0`）', any: ['第4行', '第 4 行', '4行', '行4', 'max=0', '初值'] },
        { hint: '用数组第一个元素作初值：`int max = a[0];`（循环从 i=1 起）', any: ['a[0]', 'max=a[0]', '第一个元素', '首元素'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {-5, -2, -9};\n        int max = a[0];\n        for (int i = 1; i < a.length; i++) {\n            if (a[i] > max) {\n                max = a[i];\n            }\n        }\n        System.out.println(max);\n    }\n}',
      explain: '用 0 作最大值初值，只有在数组含正数时才碰巧正确；全负数组（如 {-5,-2,-9}）时 0 比所有元素大，输出 0。正确写法：`int max = a[0];` 然后从 i=1 开始比较。同理最小值初值用 a[0] 而不是 0。' },

    { id: 'ch04-n10', ch: 'ch04', kp: 'ch04-8', tier: 2, type: 'predict', difficulty: 2, tags: ['output', 'trap'],
      stem: '下面程序对比了“正确初值”与“错误初值”两种写法，写出完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {-5, -2, -9};\n        int max = a[0];\n        for (int i = 1; i < a.length; i++) {\n            if (a[i] > max) {\n                max = a[i];\n            }\n        }\n        System.out.println(max);\n        int[] b = {-5, -2, -9};\n        int wrong = 0;\n        for (int i = 0; i < b.length; i++) {\n            if (b[i] > wrong) {\n                wrong = b[i];\n            }\n        }\n        System.out.println(wrong);\n    }\n}',
      answer: '-2\n0',
      explain: '① 正确版 max=a[0]=-5，依次比较 -2>-5 → max=-2、-9>-2 否 → -2；② 错误版 wrong=0，所有元素都小于 0 → 条件 b[i]>0 都不成立 → 输出 0。同一份数据、只差初值，结果就从 -2 变成 0——这就是“初值 bug”的隐蔽性。' },

    { id: 'ch04-d1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '`int[] a = new int[4];` 创建后，各元素的默认值是？',
      options: [
        { text: '都是 0（基本类型数组的默认值）', correct: true },
        { text: '都是 null' },
        { text: '未初始化，访问会编译错误' },
        { text: '随机值' }
      ],
      explain: '`new int[4]` 在堆上创建数组并自动把每个元素初始化为默认值：int 是 0、double 是 0.0、boolean 是 false、引用类型（如 String、对象）是 null。所以基本类型数组创建后可以直接用，对象数组则要逐个 new。' },

    { id: 'ch04-d2', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '执行 `int[] a = new int[3]; a[-1] = 5;` 会怎样？',
      options: [
        { text: '运行时抛 ArrayIndexOutOfBoundsException（负下标也越界）', correct: true },
        { text: '把 5 存到数组末尾' },
        { text: '编译错误' },
        { text: '正常执行，什么都不发生' }
      ],
      explain: '合法下标是 0 ~ length-1，负数同样越界，抛 ArrayIndexOutOfBoundsException（消息会显示 Index -1 out of bounds for length 3）。javac 不检查具体下标值，所以是运行时错误。' },

    /* ============================================================ ch05 输入输出与绘图 */
    { id: 'ch05-q1', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序的完整输出（逐行，注意空格）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        System.out.printf("%d %.2f %s%n", 7, 3.14159, "ok");\n        System.out.printf("%5d|%-4s|%n", 42, "ab");\n    }\n}',
      answer: '7 3.14 ok\n   42|ab  |',
      explain: '第一行：%d → 7，空格，%.2f → 3.14（保留两位小数并四舍五入），空格，%s → ok，%n 换行。第二行：%5d 表示最小宽度 5、右对齐，42 占 2 位所以前面补 3 个空格 → `   42`；`|`；%-4s 表示宽度 4、左对齐，ab 后面补 2 个空格 → `ab  `；`|` 换行。判分时行首空格会被忽略，但你应该知道它们从哪来。' },

    { id: 'ch05-q2', ch: 'ch05', kp: 'ch05-1', tier: 2, type: 'mcq', difficulty: 3, tags: ['trap', 'exam'],
      stem: '运行下面程序，输入两行：第一行 `42`，第二行 `hello`。输出是什么？',
      code: 'Scanner sc = new Scanner(System.in);\nint n = sc.nextInt();\nString line = sc.nextLine();\nSystem.out.println("[" + line + "]");',
      options: [
        { text: '[hello]' },
        { text: '[]', correct: true },
        { text: '[42]' },
        { text: '抛 InputMismatchException' }
      ],
      explain: 'nextInt() 只从缓冲区读走数字 42，**行尾的换行符仍然留在缓冲区**；紧接着 nextLine() 一上来就读到那个换行，于是返回空字符串。修法：读完 nextInt 后再调一次 nextLine() 吃掉换行，或统一用 nextLine() 读入再 Integer.parseInt。' },

    { id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['output', 'exam'],
      stem: '运行命令 `java Q 12 34`，下面程序输出什么？',
      code: 'public class Q {\n    public static void main(String[] args) {\n        System.out.println(args.length);\n        System.out.println(args[0] + args[1]);\n    }\n}',
      options: [
        { text: '2 然后 1234', correct: true },
        { text: '2 然后 46' },
        { text: '2 然后 12 34（分两行）' },
        { text: '1 然后 12' }
      ],
      explain: 'args 是 **String[]**：args[0]="12"、args[1]="34" 都是字符串，`+` 执行的是拼接 → "1234"。要相加必须先转换：`Integer.parseInt(args[0]) + Integer.parseInt(args[1])`。length 是 2（两个参数）。' },

    { id: 'ch05-q4', ch: 'ch05', kp: 'ch05-1', tier: 2, type: 'tf', difficulty: 2, tags: ['trap', 'exam'],
      stem: '判断：调用 `nextInt()` 之后紧接着调用 `nextLine()`，`nextLine()` 会返回用户输入那一行里剩下的内容。',
      options: [
        { text: '正确（True）' },
        { text: '错误（False）', correct: true }
      ],
      explain: 'nextInt() 只消费数字，不消费行尾换行符；nextLine() 立即读到那个换行，返回空字符串。这是 Scanner 最经典的坑，几乎每次期中都会以某种形式考到。' },

    { id: 'ch05-q5', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['syntax'],
      stem: '要把 double 变量 d 保留两位小数输出，正确写法是？',
      options: [
        { text: '`System.out.printf("%.2f", d);`', correct: true },
        { text: '`System.out.printf("%2f", d);`' },
        { text: '`System.out.println("%.2f", d);`' },
        { text: '`System.out.printf("%d.2", d);`' }
      ],
      explain: '格式化占位符语法是 `%[宽度][.精度]转换符`：`%.2f` 表示保留 2 位小数（会四舍五入）；`%2f` 里的 2 是**最小宽度**；`%d` 只接受整数；println 不支持格式化参数，多参数 println 编译不过。' },

    { id: 'ch05-q6', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'fill', difficulty: 1, tags: ['syntax'],
      stem: '填空：要读取用户输入的**一整行文本**（允许中间有空格），应调用 `sc._____()`。',
      answer: 'nextLine',
      explain: 'next() 读到空白（空格/制表/换行）就停，只能读一个“单词”；nextLine() 一直读到换行为止，返回不含换行的整行内容。' },

    { id: 'ch05-q7', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '`Math.random()` 返回值的范围是？',
      options: [
        { text: '[0.0, 1.0) 的 double，左闭右开', correct: true },
        { text: '(0.0, 1.0) 的 double，两端都不含' },
        { text: '[0.0, 1.0] 的 double，两端都含' },
        { text: '0 到 100 之间的 int' }
      ],
      explain: 'Math.random() 返回 [0.0, 1.0) 的 double：可能正好是 0.0，但永远小于 1.0。生成 [a, b) 的随机整数写成 `(int)(Math.random() * (b - a)) + a`，例如 [1, 7) 就是 `(int)(Math.random() * 6) + 1`。' },

    { id: 'ch05-q8', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'predict', difficulty: 2, tags: ['output', 'exam'],
      stem: '运行命令 `java Q 5 7`，写出下面程序的完整输出（逐行）。',
      args: ['5', '7'],
      code: 'public class Q {\n    public static void main(String[] args) {\n        int a = Integer.parseInt(args[0]);\n        int b = Integer.parseInt(args[1]);\n        System.out.println(a + b);\n        System.out.println("" + a + b);\n    }\n}',
      answer: '12\n57',
      explain: '第一行 a、b 已 parse 成 int，int + int 做算术 → 12。第二行开头是空字符串 ""，`+` 变成字符串拼接："" + 5 → "5"，再 + 7 → "57"。注意 args 是 String，parseInt 之后才是数字。' },

    { id: 'ch05-q9', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '课程使用的绘图库 StdDraw 以左下角为原点、y 轴向上（数学坐标）。而 Java 自带的屏幕像素坐标（AWT）以左上角为原点、y 轴向下。这个差异会导致什么？',
      options: [
        { text: '同一个图形在两种坐标系里看起来是上下颠倒（镜像）的', correct: true },
        { text: '两种坐标系的 (0,0) 在同一个位置' },
        { text: '像素坐标里 y 越大越靠上' },
        { text: '没有区别，只是名字不同' }
      ],
      explain: '数学坐标原点在左下、y 向上；屏幕像素坐标原点在左上、y 向下。所以同一组坐标在两种系统里画出来的图形会上下镜像。写绘图程序时先确认用的是哪套坐标，否则“图形飞出去”或“倒过来”都很常见。' },

    { id: 'ch05-k1', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '下面程序用一个递归函数统计「每层画 1 条主干、分左右 2 支」的递归树一共画多少条线。写出完整输出。',
      code: 'public class Q {\n    static int lines(int depth) {\n        if (depth == 0) return 0;\n        return 1 + lines(depth - 1) + lines(depth - 1);\n    }\n    public static void main(String[] args) {\n        System.out.println(lines(1));\n        System.out.println(lines(3));\n        System.out.println(lines(5));\n        int n = 0;\n        for (int i = 0; i < 4; i++) {\n            n += (int) Math.pow(2, i);\n        }\n        System.out.println(n);\n    }\n}',
      answer: '1\n7\n31\n15',
      explain: '设画 depth 层要画 L(depth) 条线：L(0)=0，L(d)=1+2·L(d-1)。展开：L(1)=1、L(3)=1+2+4=7、L(5)=1+2+4+8+16=31，所以前三个输出是 1、7、31。最后一个循环把 2^0+2^1+2^2+2^3 = 15 累加起来。这正是递归画树/科赫雪花的核心：基线条件决定递归在哪停下，每层分支数决定总工作量（2^d-1）。' },

    { id: 'ch05-k2', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '用递归画一棵分形树：每层先画主干，再向左、向右各递归画一棵更小的树。若 depth=4（从 depth=1 开始画），一共画多少条线？',
      options: [
        { text: '15', correct: true },
        { text: '16' },
        { text: '8' },
        { text: '4' }
      ],
      explain: '每层画 1 条主干并分成 2 支：depth=1 → 1 条；depth=2 → 1+2=3；depth=3 → 1+2+4=7；depth=4 → 1+2+4+8=15。通式 2^depth - 1。递归分形的考点就是：先写基线条件（depth==0 直接 return），再写“画一步 + 递归两次”，并数清总工作量。' },

    { id: 'ch05-k3', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '要生成 **1 到 6 之间（含 1 和 6）** 的随机整数（模拟掷骰子），正确写法是？',
      options: [
        { text: '`(int) (Math.random() * 6) + 1`', correct: true },
        { text: '`(int) (Math.random() * 6)`' },
        { text: '`(int) (Math.random() * 7)`' },
        { text: '`(int) (Math.random() * 7) + 1`' }
      ],
      explain: 'Math.random() 返回 [0.0, 1.0)：乘 6 得到 [0.0, 6.0)，强转 int 得 0~5，再加 1 得 1~6。通式：要 [a, b] 的整数（含两端），写成 `(int)(Math.random() * (b - a + 1)) + a`。乘 6 不加 1 得到 0~5；乘 7 会取到 7。' },

    { id: 'ch05-k4', ch: 'ch05', kp: 'ch05-7', tier: 1, type: 'fill', difficulty: 1, tags: ['trap'],
      stem: '模拟掷骰子 6000 次并统计 6 出现的次数，其中 `int die = (int)(Math.random() * _____) + 1;`。空白处应填：',
      answer: '6',
      explain: '要得到 1~6，随机数乘 6：`(int)(Math.random() * 6)` 产生 0~5，再加 1 就是 1~6。这是**模拟（simulation）**类题的固定套路：先想清楚取值区间，再用乘法缩放、加法平移；统计次数就用 `if (die == 6) count++;` 累加。' },

    { id: 'ch05-f1', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'fill', mode: 'findbug', difficulty: 3, tags: ['bug'],
      stem: '运行程序并在第一行输入 `5`、第二行输入 `Tom`。本意是输出 `n=5 name=[Tom]`，实际输出 `name=[]`。指出哪一行有问题并改正（写出修改后的那一行/两行）。',
      code: 'import java.util.Scanner;\n\npublic class Q {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        String name = sc.nextLine();\n        System.out.println("n=" + n + " name=[" + name + "]");\n    }\n}',
      stdin: '5\nTom\n',
      answer: '第 6 行：`nextInt()` 不消费行尾换行，紧接着的 `nextLine()` 读到空串。应在读完 n 后补一次 `sc.nextLine();` 吃掉换行，再读 `String name = sc.nextLine();`',
      accept: [
        { hint: '指出问题出在 nextInt 与 nextLine 的混用（第 6 行）', any: ['第6行', '第 6 行', '6行', '行6', 'line6'] },
        { hint: '补一次 `sc.nextLine()` 吃掉换行（或用 `sc.next()`）', any: ['多一次nextLine', '补nextLine', '再加一次nextLine', '吃掉换行', '读取换行', 'sc.next()', 'next()'] }
      ],
      fix: 'import java.util.Scanner;\n\npublic class Q {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        sc.nextLine();\n        String name = sc.nextLine();\n        System.out.println("n=" + n + " name=[" + name + "]");\n    }\n}',
      explain: '`nextInt()` 只从缓冲区取走数字 5，行尾的 `\\n` 仍留在缓冲区；下一次 `nextLine()` 一上来就读到这个换行，于是返回空字符串。这是 Scanner 最经典的坑。修法：读完数值后再调一次 `nextLine()` 吃掉换行，或统一用 `nextLine()` + `Integer.parseInt`。' },

    { id: 'ch05-f2', ch: 'ch05', kp: 'ch05-1', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '程序编译通过，但运行时抛出异常。指出哪一行有问题并改正。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        double pi = 3.14159;\n        System.out.printf("pi = %d%n", pi);\n    }\n}',
      answer: '第 4 行：`%d` 只接受整数，传 double 会抛 IllegalFormatConversionException；应改为 `%.2f`（或 `%f`）',
      accept: [
        { hint: '指出行号（第 4 行）', any: ['第4行', '第 4 行', '4行', '行4', 'line4'] },
        { hint: '把 `%d` 改成浮点格式 `%f` / `%.2f`', any: ['%f', '%.2f', '改成%f', '格式符'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        double pi = 3.14159;\n        System.out.printf("pi = %.2f%n", pi);\n    }\n}',
      explain: '`printf` 的格式符与参数类型必须匹配：`%d` 是整数，`%f` 是浮点数（`%.2f` 表示保留两位小数）。类型不匹配时 printf 抛 `IllegalFormatConversionException: d != java.lang.Double`。注意这与编译无关——格式字符串是运行期解析的。' },

    { id: 'ch05-p1', ch: 'ch05', kp: 'ch05-2', tier: 4, type: 'predict', difficulty: 3, tags: ['output', 'trap'],
      stem: '程序从标准输入读数据，输入如下（第一行 4 表示后面有 4 个整数，最后一行是名字）：<br><code>4\\n3 9 2 6\\nHello</code><br><b>写出完整输出（逐行，注意 printf 的宽度与空格）</b>。追问：① 为什么代码里连续调用了两次 `nextLine()`？② `%5s` 与 `%-5s` 的差别？③ 平均值为什么能打印两位小数？',
      code: 'import java.util.Scanner;\n\npublic class Q {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int total = 0;\n        int max = Integer.MIN_VALUE;\n        for (int i = 0; i < n; i++) {\n            int v = sc.nextInt();\n            total += v;\n            if (v > max) {\n                max = v;\n            }\n        }\n        String name = sc.nextLine();\n        name = sc.nextLine();\n        System.out.printf("n=%d total=%d max=%d%n", n, total, max);\n        System.out.printf("avg=%.2f%n", total / (double) n);\n        System.out.printf("[%5s] [%-5s]%n", name, name);\n        System.out.println("name.length=" + name.length());\n    }\n}',
      stdin: '4\n3 9 2 6\nHello',
      answer: 'n=4 total=20 max=9\navg=5.00\n[Hello] [Hello]\nname.length=5',
      explain: '① 读入 4 个整数后缓冲区里还剩换行，第一次 `nextLine()` 读到的是空串（吃掉换行），第二次才读到 Hello——这就是 nextInt 与 nextLine 混用的坑；② total=3+9+2+6=20，max=9；③ `total / (double) n` = 20/4.0 = 5.0，`%.2f` 保留两位小数 → `avg=5.00`；④ `%5s` 最小宽度 5 右对齐："Hello" 正好 5 个字符，所以没有补空格；`%-5s` 左对齐，同样正好 5 个字符 → 两处都显示 `[Hello]`；⑤ name.length() = 5。若名字是 "Tom"，会看到 `[  Tom] [Tom  ]` 的对齐差别。' },

    { id: 'ch05-k5', ch: 'ch05', kp: 'ch05-8', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '教材（Sedgewick）里的 `while (!StdIn.isEmpty())` 与 Java 标准库的 `while (sc.hasNext())` 在语义上是什么关系？',
      options: [
        { text: '两者都是“只要还有输入就继续读”，只是用的输入库不同', correct: true },
        { text: '`!StdIn.isEmpty()` 表示输入数组为空' },
        { text: 'Scanner 没有“判断还有没有输入”的写法' },
        { text: '两者语义相反：一个读到空就停，一个读到空才继续' }
      ],
      explain: '`StdIn`/`StdOut` 是教材配套库（Sedgewick 的 standard input/output），`StdIn.isEmpty()` 判断“还有没有下一个值”；Scanner 里对应 `sc.hasNext()`（还有下一个 token）/`sc.hasNextInt()`（下一个是整数）。两者语义一致：**先判断再读**的读输入循环。本站为了能直接运行，统一用 `Scanner` + `System.out`；考试若出现 `StdIn` 代码，把它读成“有输入就继续读”即可。' },

    { id: 'ch05-t1', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '运行 `java Q 10 20` 时，`main(String[] args)` 里的 args 是什么？',
      options: [
        { text: '长度为 2 的 String 数组，args[0] 是 "10"、args[1] 是 "20"', correct: true },
        { text: '长度为 2 的 int 数组，元素是 10 和 20' },
        { text: '一个字符串 "10 20"' },
        { text: '长度 0 的空数组' }
      ],
      explain: '命令行参数以**字符串数组**传入：args[0]="10"、args[1]="20"，args.length=2。要用数字必须先 `Integer.parseInt(args[0])` 转换；`args[0] + args[1]` 做的是字符串拼接 "1020"。' },

    { id: 'ch05-t2', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
      stem: '填空：课程绘图库 StdDraw 的坐标原点在画布**左下角**，y 轴方向朝____（上/下）。',
      answer: ['上', '向上', '上方'],
      explain: 'StdDraw 用数学坐标：原点在左下角，x 向右、y **向上**。而屏幕像素坐标原点在左上角、y 向下。同一组坐标在两种系统里画出来会上下镜像——写绘图程序前先确认用的是哪套坐标。' },

    { id: 'ch05-t3', ch: 'ch05', kp: 'ch05-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '要模拟掷骰子（1~6 等概率），应该用哪个表达式？',
      options: [
        { text: '`(int) (Math.random() * 6) + 1`', correct: true },
        { text: '`(int) (Math.random() * 6)`' },
        { text: '`(int) (Math.random() * 7) + 1`' },
        { text: '`Math.random(6)`' }
      ],
      explain: 'Math.random() ∈ [0.0, 1.0)，乘 6 得 [0.0, 6.0)，强转 int 得 0~5，再加 1 得 1~6。通式：要 [a, b] 整数写 `(int)(Math.random() * (b - a + 1)) + a`。Math.random 不接受参数。' },

    { id: 'ch05-t4', ch: 'ch05', kp: 'ch05-8', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
      stem: '判断：教材里的 `StdIn`/`StdOut` 与 Java 标准库的 `Scanner`/`System.out` 都是在读写标准输入输出，语义可以对照理解。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: '`StdIn`/`StdOut` 是教材配套库，`Scanner`/`System.out` 是 JDK 标准库，两者都在做“读标准输入、写标准输出”。对照关系：`StdIn.isEmpty()` ↔ `sc.hasNext()`、`StdIn.readInt()` ↔ `sc.nextInt()`、`StdOut.println` ↔ `System.out.println`。本站为了能直接运行，统一用 Scanner。' },

    { id: 'ch05-t5', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '运行命令 `java Q 12 34`，写出程序的完整输出（逐行）。',
      args: ['12', '34'],
      code: 'public class Q {\n    public static void main(String[] args) {\n        System.out.println(args.length);\n        System.out.println(args[0] + args[1]);\n        int a = Integer.parseInt(args[0]);\n        int b = Integer.parseInt(args[1]);\n        System.out.println(a + b);\n    }\n}',
      answer: '2\n1234\n46',
      explain: '① args.length = 2；② `args[0] + args[1]` 两边都是 String，`+` 是拼接 → "1234"；③ parseInt 后得到 int 12、34，a+b 才是算术加法 46。同一个 `+` 在 String 和 int 上语义完全不同，这是命令行参数题的核心陷阱。' },

    { id: 'ch05-t6', ch: 'ch05', kp: 'ch05-1', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '`System.out.printf("%5.1f|%-6d|%s%n", 3.14159, 42, "ok");` 的输出是？',
      options: [
        { text: '`  3.1|42    |ok`', correct: true },
        { text: '`3.1|42|ok`' },
        { text: '`  3.1|    42|ok`' },
        { text: '`3.14159|42|ok`' }
      ],
      explain: '格式符 `%[宽度][.精度]转换符`：`%5.1f` = 最小宽度 5、保留 1 位小数 → "  3.1"（3.1 占 3 位，前面补 2 个空格）；`%-6d` = 宽度 6、左对齐 → "42    "；`%s` → "ok"。注意宽度是**最小**宽度，内容更长时不截断。' },

    { id: 'ch05-f3', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '运行 `java Q 3 4`，本意是输出 `sum=7`，实际输出 `sum=34`。指出哪一行有问题并改正。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int a = Integer.parseInt(args[0]);\n        int b = Integer.parseInt(args[1]);\n        String sum = a + b;\n        System.out.println("sum=" + sum);\n    }\n}',
      answer: '第 4 行：`String sum = a + b;` 把 int 加法结果存成了 String（“34”），应改成 `int sum = a + b;`',
      accept: [
        { hint: '指出行号（第 4 行）', any: ['第4行', '第 4 行', '4行', '行4', 'line4'] },
        { hint: '把 String 改成 int（用整数类型接住 a + b）', any: ['String改int', '改成int', '用int', 'int sum', '应该用int'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int a = Integer.parseInt(args[0]);\n        int b = Integer.parseInt(args[1]);\n        int sum = a + b;\n        System.out.println("sum=" + sum);\n    }\n}',
      explain: 'a、b 已经是 int，`a + b` 的结果是 int 7。但声明成 String 时，`+` 会做字符串拼接 → "34"，再打印 `sum=34`。修法：声明 `int sum`。这提醒我们：**变量的类型会影响 + 的语义**。' },

    { id: 'ch05-t8', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '下面程序用递归统计“每层 1 条主干、分左右 2 支”的递归树线条数。写出完整输出（逐行）。',
      code: 'public class Q {\n    static int branches(int depth) {\n        if (depth == 0) return 0;\n        return 1 + branches(depth - 1) + branches(depth - 1);\n    }\n    public static void main(String[] args) {\n        System.out.println(branches(1));\n        System.out.println(branches(2));\n        System.out.println(branches(4));\n        int total = 0;\n        for (int i = 1; i <= 3; i++) {\n            total += branches(i);\n        }\n        System.out.println(total);\n    }\n}',
      answer: '1\n3\n15\n11',
      explain: 'L(d) = 1 + 2·L(d-1)，L(0)=0 → L(1)=1、L(2)=3、L(4)=15；最后循环把 L(1)+L(2)+L(3) = 1+3+7 = 11。递归分形题先看基线条件（depth==0 停），再看每层工作量，最后用递推式算总数（2^d - 1）。' },

    { id: 'ch05-t9', ch: 'ch05', kp: 'ch05-8', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '把教材写法 `while (!StdIn.isEmpty()) { int x = StdIn.readInt(); }` 改成 Scanner 版本，最接近的是？',
      options: [
        { text: '`while (sc.hasNextInt()) { int x = sc.nextInt(); }`', correct: true },
        { text: '`while (sc.nextInt() != 0) { }`' },
        { text: '`while (sc.hasNext()) { int x = sc.nextInt(); }` 在任何输入下都安全' },
        { text: 'Scanner 无法实现这种循环' }
      ],
      explain: 'StdIn.isEmpty 判断“还有没有下一个值”，Scanner 对应 `hasNextInt()`（还有整数）/`hasNext()`（还有 token）。D 的问题：hasNext 只保证有 token，不保证是整数，若下一个是单词则 nextInt 抛 InputMismatchException，所以读整数时用 hasNextInt 更稳。' },

    { id: 'ch05-t10', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '用递归画一棵“每层分 2 支、画到 depth 层”的分形树，depth=3 时一共画多少条线（每层 1 条主干）？',
      options: [
        { text: '7', correct: true },
        { text: '6' },
        { text: '8' },
        { text: '15' }
      ],
      explain: '总线条数 1+2+4 = 7 = 2³ - 1。递归分形的“画”发生在递归调用**之前**（每进入一层画一条主干），所以层数 d 的总线条是 2^d - 1。考试常问“这段递归画了多少条线/多少个圆”，先写出递推式再算。' },

    { id: 'ch05-c1', ch: 'ch05', kp: 'ch05-5', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>screenY</code>：把数学坐标 y（左下角原点、上为正）转换成屏幕坐标 y（左上角原点、下为正，画布高度 height）。例如高度 10 时，数学坐标 2 对应屏幕坐标 7。',
      starter: 'public class Q {\n    static int screenY(int mathY, int height) {\n        // TODO: 把数学坐标 y（左下角为原点、上为正）转成屏幕坐标（左上角为原点、下为正）\n        return 0;\n    }\n    public static void main(String[] args) {\n        int y = Integer.parseInt(args[0]);\n        int h = Integer.parseInt(args[1]);\n        System.out.println(screenY(y, h));\n    }\n}',
      solution: 'public class Q {\n    static int screenY(int mathY, int height) {\n        return height - 1 - mathY;\n    }\n    public static void main(String[] args) {\n        int y = Integer.parseInt(args[0]);\n        int h = Integer.parseInt(args[1]);\n        System.out.println(screenY(y, h));\n    }\n}',
      tests: [
        { args: ['2', '10'], expect: '7' },
        { args: ['9', '10'], expect: '0' }
      ],
      explain: '两套坐标的换算：屏幕 y = height - 1 - 数学 y。数学 y=2、height=10 → 7；数学 y=9（最上面）→ 0（屏幕第一行）。绘图题里坐标不换算会出现“图形上下颠倒”或“飞出去”。' },

    { id: 'ch05-p2', ch: 'ch05', kp: 'ch05-6', tier: 4, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '读下面的递归分形程序，<b>写出完整输出（逐行）</b>。追问：① drawTree(4) 为什么是 15？② printLevel 的减号数量与层数是什么关系？③ 最后的 26 怎么来的？',
      code: 'public class Q {\n    static int drawTree(int depth) {\n        if (depth == 0) {\n            return 0;\n        }\n        int lines = 1;\n        lines += drawTree(depth - 1);\n        lines += drawTree(depth - 1);\n        return lines;\n    }\n    static void printLevel(int depth) {\n        for (int i = 0; i < depth; i++) {\n            System.out.print("-");\n        }\n        System.out.println("*");\n    }\n    public static void main(String[] args) {\n        int depth = 4;\n        System.out.println(drawTree(depth));\n        printLevel(1);\n        printLevel(2);\n        printLevel(3);\n        int total = 0;\n        for (int d = 1; d <= depth; d++) {\n            total += drawTree(d);\n        }\n        System.out.println(total);\n        System.out.println(drawTree(0));\n    }\n}',
      answer: '15\n-*\n--*\n---*\n26\n0',
      explain: '① 递推 L(d)=1+2L(d-1)：L(1)=1、L(2)=3、L(3)=7、L(4)=15；② printLevel(d) 打印 d-1 个减号再打印星号：`-*`、`--*`、`---*`；③ 循环把 L(1)+L(2)+L(3)+L(4) = 1+3+7+15 = 26；④ drawTree(0) 命中基线直接返回 0。递归画图题的两个必考点：基线条件与每层工作量。' },

    { id: 'ch05-c2', ch: 'ch05', kp: 'ch05-1', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>format</code>：返回形如 <code>n=7 d=2.50</code> 的字符串（d 保留两位小数），使用 String.format。',
      starter: 'public class Q {\n    static String format(int n, double d) {\n        return "";\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        double d = Double.parseDouble(args[1]);\n        System.out.println(format(n, d));\n    }\n}',
      solution: 'public class Q {\n    static String format(int n, double d) {\n        return String.format("n=%d d=%.2f", n, d);\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        double d = Double.parseDouble(args[1]);\n        System.out.println(format(n, d));\n    }\n}',
      tests: [
        { args: ['7', '2.5'], expect: 'n=7 d=2.50' },
        { args: ['0', '0'], expect: 'n=0 d=0.00' }
      ],
      explain: 'String.format 的格式符与 printf 相同：%d 整数、%.2f 保留两位小数。注意返回值可以直接 println，不要再加换行符。' },

    { id: 'ch05-c3', ch: 'ch05', kp: 'ch05-7', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>clampDouble</code>：把 double v 限制在 [lo, hi] 内（返回 double）。',
      starter: 'public class Q {\n    static double clampDouble(double v, double lo, double hi) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        double v = Double.parseDouble(args[0]);\n        System.out.println(clampDouble(v, 0.0, 10.0));\n    }\n}',
      solution: 'public class Q {\n    static double clampDouble(double v, double lo, double hi) {\n        if (v < lo) {\n            return lo;\n        }\n        if (v > hi) {\n            return hi;\n        }\n        return v;\n    }\n    public static void main(String[] args) {\n        double v = Double.parseDouble(args[0]);\n        System.out.println(clampDouble(v, 0.0, 10.0));\n    }\n}',
      tests: [
        { args: ['-1'], expect: '0.0' },
        { args: ['20'], expect: '10.0' },
        { args: ['5.5'], expect: '5.5' }
      ],
      explain: '与 int 版 clamp 逻辑相同，只是类型换成 double；返回 0.0/10.0 时打印带 .0。先判下界再判上界，区间内原样返回。' },

    { id: 'ch05-c4', ch: 'ch05', kp: 'ch05-4', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>parseSum</code>：把两个数字字符串转成 int 后返回它们的和。',
      starter: 'public class Q {\n    static int parseSum(String a, String b) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        System.out.println(parseSum(args[0], args[1]));\n    }\n}',
      solution: 'public class Q {\n    static int parseSum(String a, String b) {\n        return Integer.parseInt(a) + Integer.parseInt(b);\n    }\n    public static void main(String[] args) {\n        System.out.println(parseSum(args[0], args[1]));\n    }\n}',
      tests: [
        { args: ['3', '4'], expect: '7' },
        { args: ['-1', '10'], expect: '9' },
        { args: ['0', '0'], expect: '0' }
      ],
      explain: '命令行参数/字符串数字必须先 Integer.parseInt 转成 int，否则 a + b 是字符串拼接（"3"+"4" = "34"）。这是 ch05 命令行参数题的核心陷阱。' },

    { id: 'ch05-c5', ch: 'ch05', kp: 'ch05-1', tier: 4, type: 'code', difficulty: 3, tags: ['code'],
      stem: '<b>跨章综合</b>：补全方法 <code>report</code>，把成绩数组汇总成一行报告：<code>count=3,sum=240,avg=80.00,max=90</code>（平均分保留两位小数）。',
      starter: 'public class Q {\n    static String report(int[] scores) {\n        return "";\n    }\n    public static void main(String[] args) {\n        int[] scores = {70, 80, 90};\n        System.out.println(report(scores));\n    }\n}',
      solution: 'public class Q {\n    static String report(int[] scores) {\n        int sum = 0;\n        int max = scores[0];\n        for (int i = 0; i < scores.length; i++) {\n            sum += scores[i];\n            if (scores[i] > max) {\n                max = scores[i];\n            }\n        }\n        double avg = (double) sum / scores.length;\n        return String.format("count=%d,sum=%d,avg=%.2f,max=%d", scores.length, sum, avg, max);\n    }\n    public static void main(String[] args) {\n        int[] scores = {70, 80, 90};\n        System.out.println(report(scores));\n    }\n}',
      tests: [
        { args: [], expect: 'count=3,sum=240,avg=80.00,max=90' }
      ],
      explain: '一次遍历同时算 sum 与 max，再算平均值（注意 `(double) sum / length` 否则整数除法丢小数），最后用 String.format 拼报告。数组遍历 + 方法 + 格式化输出的综合。' },

    { id: 'ch05-n1', ch: 'ch05', kp: 'ch05-9', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '输入类 bug 调试时，第一步为什么要“把读到的值打印出来，并用方括号包住”？',
      options: [
        { text: '方括号能一眼看出空串、前导空格、换行等看不见的字符', correct: true },
        { text: '方括号能让输出变快' },
        { text: '方括号会自动去掉空白' },
        { text: '没有原因，只是习惯' }
      ],
      explain: '输入 bug 的根源常是“读到了什么和你想的不一样”：nextLine 读到空串（换行被吃）、行尾有空格、next 只读到一个单词。用 `System.out.println("[" + s + "]")` 能把空串、空格、换行暴露出来（[] 说明空串），比直接打印可见得多。' },

    { id: 'ch05-n2', ch: 'ch05', kp: 'ch05-9', tier: 1, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '`int n = sc.nextInt(); String s = sc.nextLine();` 输入 `42` 换行 `hello` 换行，s 是什么？',
      options: [
        { text: '空字符串（nextInt 不消费行尾换行，nextLine 读到换行）', correct: true },
        { text: '"hello"' },
        { text: '"42"' },
        { text: '抛 InputMismatchException' }
      ],
      explain: 'nextInt 只取走数字 42，行尾的换行符留在缓冲区；下一次 nextLine 一上来就遇到换行，返回空串。修法：读完数值后再调用一次 nextLine() 吃掉换行，或统一用 nextLine + Integer.parseInt。' },

    { id: 'ch05-n3', ch: 'ch05', kp: 'ch05-9', tier: 1, type: 'fill', difficulty: 1, tags: ['syntax'],
      stem: '填空：要读取用户输入的**一整行**（允许含空格），应调用 `sc._____()`。',
      answer: ['nextLine'],
      explain: 'next() 遇到空白就停（只读一个单词）；nextLine() 读到换行为止，返回整行（不含换行）。输入调试时优先用 nextLine 读整行，需要数字时再 Integer.parseInt 转换，可以避开 nextInt/nextLine 混用的坑。' },

    { id: 'ch05-n4', ch: 'ch05', kp: 'ch05-9', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '程序先读一个整数、吃掉换行、再读一整行。输入为 `3` 换行 `Alice` 换行，写出完整输出（逐行）。',
      code: 'import java.util.Scanner;\n\npublic class Q {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        sc.nextLine();\n        String name = sc.nextLine();\n        System.out.println("n=" + n);\n        System.out.println("name=[" + name + "]");\n        System.out.println("len=" + name.length());\n    }\n}',
      stdin: '3\nAlice\n',
      answer: 'n=3\nname=[Alice]\nlen=5',
      explain: '① nextInt 读到 3；② 手动 nextLine() 吃掉行尾换行；③ 第二次 nextLine 读到 "Alice" → name=[Alice]；④ len=5。对比不写那个 nextLine 的版本：name 会是空串 []。用方括号包住输出正是为了看清这一点。' },

    { id: 'ch05-n5', ch: 'ch05', kp: 'ch05-9', tier: 4, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '<b>综合</b>：程序从标准输入读一个整数 n、n 个整数、再读一行标签。输入为 `4` 换行 `5 9 2 6` 换行 `Week1` 换行，<b>写出完整输出（逐行）</b>。追问：① 为什么读完 n 个整数后要再调一次 nextLine()？② tokens 为什么是 n+1？',
      code: 'import java.util.Scanner;\n\npublic class Q {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int sum = 0;\n        int max = Integer.MIN_VALUE;\n        for (int i = 0; i < n; i++) {\n            int v = sc.nextInt();\n            sum += v;\n            if (v > max) {\n                max = v;\n            }\n        }\n        sc.nextLine();\n        String label = sc.nextLine();\n        System.out.printf("label=[%s] n=%d sum=%d max=%d%n", label, n, sum, max);\n        System.out.printf("avg=%.2f%n", sum / (double) n);\n        System.out.println("tokens=" + (n + 1));\n    }\n}',
      stdin: '4\n5 9 2 6\nWeek1\n',
      answer: 'label=[Week1] n=4 sum=22 max=9\navg=5.50\ntokens=5',
      explain: '① nextInt 循环只消费数字，缓冲区里还剩换行；不先 nextLine 吃掉，后面的 label 会读到空串 → 所以要先 `sc.nextLine()`；② sum=5+9+2+6=22、max=9、avg=22/4.0=5.50；③ tokens = 第一行的 n 加 n 个数字 = n+1 = 5（标签行不算）。I/O 调试的核心：先确认每个读操作到底读到了什么。' },

    { id: 'ch05-d1', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: '创建 Scanner 读取标准输入，正确的语句是？',
      options: [
        { text: '`Scanner sc = new Scanner(System.in);`', correct: true },
        { text: '`Scanner sc = new Scanner();`' },
        { text: '`Scanner sc = System.in;`' },
        { text: '`Scanner sc = new Scanner(System.out);`' }
      ],
      explain: 'Scanner 要绑定一个输入源：`new Scanner(System.in)` 表示从标准输入读。`new Scanner()` 无参构造不存在（编译错误）；`Scanner sc = System.in` 类型不匹配。记得 `import java.util.Scanner;`。' },

    { id: 'ch05-d2', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'fill', difficulty: 1, tags: ['syntax'],
      stem: '填空：要读取用户输入的一个整数，调用 `sc._____()`（填方法名）。',
      answer: ['nextInt'],
      explain: 'nextInt() 读一个整数 token；nextDouble() 读小数；next() 读一个单词；nextLine() 读一整行。注意 nextInt 不会消费行尾换行——紧接着 nextLine 会读到空串（经典坑）。' },

    { id: 'ch05-d3', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '`int n = sc.nextInt(); String s = sc.nextLine();` 输入 `42` 换行 `hello`。s 的值是？',
      options: [
        { text: '空字符串', correct: true },
        { text: 'hello' },
        { text: '42' },
        { text: '编译错误' }
      ],
      explain: 'nextInt 只取走 42，行尾换行留在缓冲区；nextLine 立即读到该换行、返回空串。修法：读完 nextInt 后再调一次 nextLine() 吃掉换行，或统一用 nextLine + Integer.parseInt。' },

    { id: 'ch05-d4', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'fill', difficulty: 1, tags: ['trap'],
      stem: '填空：为避开 nextInt/nextLine 混用陷阱，可以在读完 nextInt 后再调用一次 `sc._____()` 把行尾换行吃掉。',
      answer: ['nextLine'],
      explain: '先 nextLine() 读走残留的换行（返回空串），下一次 nextLine() 才能读到真正的下一行。这是处理 Scanner 输入时最常见的两行代码：`int n = sc.nextInt(); sc.nextLine(); String s = sc.nextLine();`。' },

    { id: 'ch05-d5', ch: 'ch05', kp: 'ch05-8', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '教材库 `StdIn.readInt()` 对应 Java 标准库 Scanner 的哪个方法？',
      options: [
        { text: '`sc.nextInt()`', correct: true },
        { text: '`sc.nextLine()`' },
        { text: '`sc.next()`' },
        { text: '`sc.hasNext()`' }
      ],
      explain: '对照关系：StdIn.readInt() ↔ sc.nextInt()、StdIn.readLine() ↔ sc.nextLine()、StdIn.readString() ↔ sc.next()、StdIn.isEmpty() ↔ sc.hasNext()/hasNextInt()、StdOut.println ↔ System.out.println。语义相同，只是库不同。' },

    { id: 'ch05-d6', ch: 'ch05', kp: 'ch05-8', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '把 `while (!StdIn.isEmpty())` 改成 Scanner 写法，最直接的是？',
      options: [
        { text: '`while (sc.hasNext())`', correct: true },
        { text: '`while (true)`（不写退出条件）' },
        { text: '`while (sc.nextInt() != 0)`' },
        { text: '`if (sc.hasNext())`' }
      ],
      explain: '`!StdIn.isEmpty()` = “还有输入就继续读”，Scanner 用 `sc.hasNext()`（或 hasNextInt 更精确）。C 会在读入 0 时提前停止（语义不同）；D 是 if 不是循环。' },

    { id: 'ch05-d7', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: 'StdDraw 画布上，(0, 0) 位于？',
      options: [
        { text: '左下角', correct: true },
        { text: '左上角' },
        { text: '中心' },
        { text: '右下角' }
      ],
      explain: 'StdDraw 使用数学坐标系：原点 (0,0) 在左下角，x 向右、y 向上，坐标范围默认 [0,1]（可 setScale 调整）。屏幕像素坐标相反：原点左上、y 向下——写绘图程序时两者不能混。' },

    { id: 'ch05-d8', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'tf', difficulty: 2, tags: ['trap'],
      stem: '判断：同一组坐标在 StdDraw（左下原点、y 向上）与屏幕像素坐标（左上原点、y 向下）中画出来，图形会上下镜像。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: '两套坐标的 y 轴方向相反，所以同一个 y 值在两种系统里位置上下颠倒。写绘图程序先确认坐标系；如需换算，屏幕 y = 高度 - 1 - 数学 y。' },

    { id: 'ch05-d9', ch: 'ch05', kp: 'ch05-7', tier: 1, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '要生成 [1, 10]（含 1 和 10）的随机整数，正确表达式是？',
      options: [
        { text: '`(int) (Math.random() * 10) + 1`', correct: true },
        { text: '`(int) (Math.random() * 10)`' },
        { text: '`(int) (Math.random() * 11)`' },
        { text: '`(int) (Math.random() * 9) + 1`' }
      ],
      explain: 'Math.random() ∈ [0,1)，乘 10 得 [0,10)，强转得 0~9，再加 1 得 1~10。通式：要 [a,b] 的整数 → `(int)(Math.random() * (b - a + 1)) + a`。B 得 0~9、C 得 0~10（含 0）、D 得 1~9。' },

    /* ============================================================ ch06 方法与函数库 */
    { id: 'ch06-q1', ch: 'ch06', kp: 'ch06-2', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序的输出。',
      code: 'public class Q {\n    static int f(int n) {\n        return n * 2 + 1;\n    }\n    public static void main(String[] args) {\n        int x = f(3);\n        int y = f(x);\n        System.out.println(x + " " + y);\n    }\n}',
      answer: '7 15',
      explain: '第一次 f(3)：3*2+1 = 7，x=7；第二次 f(7)：7*2+1 = 15，y=15。方法调用就是“把参数代入方法体，算出返回值再回来”，可以像数学函数一样一层层代入。' },

    { id: 'ch06-q2', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap', 'exam'],
      stem: '下面程序输出什么？',
      code: 'static void change(int x) {\n    x = 100;\n}\npublic static void main(String[] args) {\n    int a = 5;\n    change(a);\n    System.out.println(a);\n}',
      options: [
        { text: '100' },
        { text: '5', correct: true },
        { text: '0' },
        { text: '编译错误' }
      ],
      explain: 'Java 方法参数是**值传递**：基本类型传的是值的副本，方法内把 x 改成 100 只改副本，调用方的 a 仍是 5。这也是为什么 swap(int a, int b) 这种写法在 Java 里交换不了。' },

    { id: 'ch06-q3', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept', 'exam'],
      stem: '下列哪一对方法构成合法的**重载（overload）**？',
      options: [
        { text: '`int f(int a)` 与 `int f(int b)`' },
        { text: '`int f(int a)` 与 `double f(int a)`' },
        { text: '`int f(int a)` 与 `int f(double a)`', correct: true },
        { text: '`int f(int a)` 与 `static int f(int a)`' }
      ],
      explain: '重载要求**方法名相同、参数列表不同**（参数的类型/个数/顺序）。参数名不同（A）签名一样，属于重复定义；只有返回类型不同（B）或只有 static 不同（D）也不算重载，javac 都报 duplicate method。' },

    { id: 'ch06-q4', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'tf', difficulty: 1, tags: ['syntax'],
      stem: '判断：void 方法里可以写 `return;` 用来提前结束方法。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: 'void 方法可以写 `return;`（不带值），作用是立刻结束方法、返回到调用处，常用于参数校验后提前退出。但不能写 `return 值;`，void 方法不返回值。' },

    { id: 'ch06-q5', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'mcq', difficulty: 3, tags: ['trap', 'exam'],
      stem: '下面程序输出什么？',
      code: 'static int x = 1;\npublic static void main(String[] args) {\n    int x = 2;\n    {\n        int x = 3;\n        System.out.print(x + " ");\n    }\n    System.out.println(x);\n}',
      options: [
        { text: '3 3' },
        { text: '3 2', correct: true },
        { text: '1 2' },
        { text: '编译错误' }
      ],
      explain: '内层块里声明的 x 遮蔽（shadow）外层同名的局部变量，作用域只到 `}` 为止，所以块内输出 3；出了块回到 main 的局部变量 x=2，输出 2。字段 x=1 被 main 的局部变量遮蔽，全程用不到。作用域从声明处到所在块结束。' },

    { id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 1, type: 'fill', difficulty: 1, tags: ['syntax'],
      stem: '填空：`Math.max(3, 7)` 的值是 _____。',
      answer: '7',
      explain: 'Math.max(a, b) 返回较大者 → 7。Math 是 Java 内置工具类，abs/min/max/pow/sqrt/round 都是 static 方法，直接 Math.xxx() 调用，不需要 new。' },

    { id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '递归方法如果忘了写基线条件（base case），会发生什么？',
      options: [
        { text: '编译错误：缺少 return 语句' },
        { text: '无限递归，最终抛 StackOverflowError', correct: true },
        { text: '自动返回 0' },
        { text: '死循环，但程序不会报错' }
      ],
      explain: '每次方法调用都会在调用栈上压一帧；没有基线条件就永远不返回，栈越压越深，最后栈空间耗尽抛 StackOverflowError。编译期检查不到这个错误（javac 不知道你少写了基线条件）。' },

    { id: 'ch06-q8', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '`Math.pow(2, 3)` 的返回值是什么？',
      options: [
        { text: 'int 类型的 8' },
        { text: 'double 类型的 8.0', correct: true },
        { text: 'long 类型的 8' },
        { text: 'double 类型的 6.0' }
      ],
      explain: 'Math.pow 的签名是 `public static double pow(double a, double b)`，所以返回值是 double：2^3 = 8.0，不是 8。要整数结果必须强转 `(int) Math.pow(2, 3)`。pow 是乘方，不是乘。' },

    { id: 'ch06-q9', ch: 'ch06', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '关于 static 方法，下列说法正确的是？',
      options: [
        { text: 'static 方法可以直接调用同一个类里的实例方法' },
        { text: 'static 方法属于类，用类名就能调用，不依赖对象', correct: true },
        { text: 'main 方法不是 static 方法' },
        { text: 'static 方法里可以使用 this 关键字' }
      ],
      explain: 'static 成员属于类而不是某个对象，用 `类名.方法()` 就能调用。因为没有绑定的对象，static 方法里**没有 this**，也不能直接访问实例字段/实例方法（必须先有对象）。' },

    { id: 'ch06-k1', ch: 'ch06', kp: 'ch06-1', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Q {\n    static int add(int a, int b) {\n        return a + b;\n    }\n    static double half(int x) {\n        return x / 2;\n    }\n    static void print(String s) {\n        System.out.print("[" + s + "]");\n    }\n    public static void main(String[] args) {\n        System.out.println(add(3, 4));\n        System.out.println(half(7));\n        print("a");\n        print("b");\n        System.out.println();\n        int r = add(add(1, 2), 3);\n        System.out.println(r);\n    }\n}',
      answer: '7\n3.0\n[a][b]\n6',
      explain: '① add(3,4) 返回 7；② half(7) 里 `7 / 2` 是 int 除法得 3，返回类型 double 只是把 3 提升成 3.0 → 打印 3.0（不是 3.5！）；③ print 里用 print 不换行，两次输出拼成 [a][b]；④ add(add(1,2),3) 先算内层得 3，再 add(3,3)=6。读方法调用题：先代入参数算返回值，再回到调用处继续。' },

    { id: 'ch06-k2', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'tf', difficulty: 1, tags: ['syntax'],
      stem: '判断：一个方法如果声明了返回类型 `int`，那么它的每条执行路径都必须在返回前给出一个 int 值（不能中途没有 return 就结束）。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: '返回类型不是 void 的方法，编译器要求**所有可能的执行路径**都能返回一个值。如果写了 if 分支只在其中一条里 return，另一条走到方法末尾，javac 报 `missing return statement`（编译错误）。修法：在分支外补一个 return，或让 else 分支也 return，或抛异常。这也是“读懂报错”常考的一条。' },

    { id: 'ch06-f1', ch: 'ch06', kp: 'ch06-1', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '下面程序编译报错。指出哪一行有问题并改正。',
      code: 'public class Q {\n    static int max(int a, int b) {\n        if (a > b) {\n            return a;\n        }\n    }\n    public static void main(String[] args) {\n        System.out.println(max(3, 5));\n    }\n}',
      answer: '第 6 行（方法末尾）：不是所有执行路径都有返回值，`if` 条件为假时方法会“掉到结尾”。应在方法末尾补 `return b;`（或写成 `else return b;`）',
      accept: [
        { hint: '指出缺少返回值的位置（第 6 行 / 方法末尾）', any: ['第6行', '第 6 行', '6行', '行6', 'line6', '方法末尾', '缺少return', '缺return'] },
        { hint: '补上 `return b;`（或 else 分支返回 b）', any: ['return b', '返回b', 'else return', '补return'] }
      ],
      fix: 'public class Q {\n    static int max(int a, int b) {\n        if (a > b) {\n            return a;\n        }\n        return b;\n    }\n    public static void main(String[] args) {\n        System.out.println(max(3, 5));\n    }\n}',
      explain: '返回类型不是 void 的方法，javac 要求**所有可能的路径**都返回一个值。这里 a>b 为真时 return a，否则会一路走到方法结尾，javac 报 `error: missing return statement`。修法：末尾补 `return b;`，或把 if 改成 if/else 两个分支都 return。' },

    { id: 'ch06-f2', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '下面程序编译报错。指出哪一行有问题并改正。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int sum = 0;\n        for (int i = 0; i < 3; i++) {\n            int sum = sum + i;\n        }\n        System.out.println(sum);\n    }\n}',
      answer: '第 5 行：循环体里重复声明了 `int sum`，与外层 local 变量冲突（且初始化时引用自己还没定义）。应去掉第二处 `int`，写成 `sum = sum + i;`',
      accept: [
        { hint: '指出行号（第 5 行）', any: ['第5行', '第 5 行', '5行', '行5', 'line5'] },
        { hint: '去掉循环体里重复的 `int`（直接给外层 sum 赋值）', any: ['去掉int', '删除int', '不要重复声明', '去掉第二个int', '去掉变量声明'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int sum = 0;\n        for (int i = 0; i < 3; i++) {\n            sum = sum + i;\n        }\n        System.out.println(sum);\n    }\n}',
      explain: 'javac 报 `variable sum is already defined in method main`：同一个作用域（方法体）里不能重复声明同名局部变量。而且 `int sum = sum + i;` 右侧的 sum 指的是正在声明的新变量（尚未初始化），即使名字不冲突也是错的。正确做法：外层声明一次 `int sum = 0;`，循环体里只赋值 `sum = sum + i;`。' },

    { id: 'ch06-c1', ch: 'ch06', kp: 'ch06-1', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>isPrime</code>：判断 n 是否为素数（<b>n < 2 时返回 false</b>）。<code>main</code> 从命令行参数读入 n 并打印结果。',
      starter: 'public class Q {\n    static boolean isPrime(int n) {\n        // TODO: 素数返回 true，否则 false\n        return false;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(isPrime(n));\n    }\n}',
      solution: 'public class Q {\n    static boolean isPrime(int n) {\n        if (n < 2) {\n            return false;\n        }\n        for (int i = 2; i * i <= n; i++) {\n            if (n % i == 0) {\n                return false;\n            }\n        }\n        return true;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(isPrime(n));\n    }\n}',
      tests: [
        { args: ['2'], expect: 'true' },
        { args: ['9'], expect: 'false' },
        { args: ['1'], expect: 'false' },
        { args: ['97'], expect: 'true' }
      ],
      explain: '素数定义：大于 1 且只能被 1 和自身整除。只需试除到 √n（写 `i * i <= n`，比 `i <= Math.sqrt(n)` 少一次类型转换），因为若 n = a×b 且 a ≤ b，则 a ≤ √n。发现能整除就立刻 return false，全部试完没发现才 return true。' },

    { id: 'ch06-c2', ch: 'ch06', kp: 'ch06-1', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>gcd</code>：用欧几里得算法（辗转相除）返回 a 与 b 的最大公约数（约定 a、b ≥ 0，且不同时为 0）。',
      starter: 'public class Q {\n    static int gcd(int a, int b) {\n        // TODO: 辗转相除求最大公约数\n        return 0;\n    }\n    public static void main(String[] args) {\n        int a = Integer.parseInt(args[0]);\n        int b = Integer.parseInt(args[1]);\n        System.out.println(gcd(a, b));\n    }\n}',
      solution: 'public class Q {\n    static int gcd(int a, int b) {\n        while (b != 0) {\n            int t = a % b;\n            a = b;\n            b = t;\n        }\n        return a;\n    }\n    public static void main(String[] args) {\n        int a = Integer.parseInt(args[0]);\n        int b = Integer.parseInt(args[1]);\n        System.out.println(gcd(a, b));\n    }\n}',
      tests: [
        { args: ['12', '18'], expect: '6' },
        { args: ['7', '13'], expect: '1' },
        { args: ['100', '0'], expect: '100' }
      ],
      explain: '辗转相除：`gcd(a, b) = gcd(b, a % b)`，直到 b == 0，此时 a 就是答案。循环里必须用临时变量 t 保存 a % b，再依次赋值——直接写 `a = b; b = a % b;` 会因为 a 已被覆盖而算错。gcd(100, 0) 直接返回 100（任何数与 0 的最大公约数是它自己）。' },

    { id: 'ch06-c3', ch: 'ch06', kp: 'ch06-7', tier: 3, type: 'code', difficulty: 3, tags: ['code'],
      stem: '用<b>递归</b>补全方法 <code>power</code>：返回 base 的 exp 次方（约定 exp ≥ 0，且 exp=0 时返回 1；不许用 Math.pow）。',
      starter: 'public class Q {\n    static int power(int base, int exp) {\n        // TODO: 用递归实现（不要用 Math.pow）\n        return 1;\n    }\n    public static void main(String[] args) {\n        int base = Integer.parseInt(args[0]);\n        int exp = Integer.parseInt(args[1]);\n        System.out.println(power(base, exp));\n    }\n}',
      solution: 'public class Q {\n    static int power(int base, int exp) {\n        if (exp == 0) {\n            return 1;\n        }\n        return base * power(base, exp - 1);\n    }\n    public static void main(String[] args) {\n        int base = Integer.parseInt(args[0]);\n        int exp = Integer.parseInt(args[1]);\n        System.out.println(power(base, exp));\n    }\n}',
      tests: [
        { args: ['2', '10'], expect: '1024' },
        { args: ['3', '0'], expect: '1' },
        { args: ['5', '3'], expect: '125' }
      ],
      explain: '递归三要素：① 基线条件 exp==0 返回 1（任何数的 0 次方）；② 递归步骤 `base * power(base, exp - 1)` 把规模减 1；③ 每次递归都在向基线条件靠近，所以一定会停。注意 exp 为负数时这个实现会无限递归——题目约定 exp ≥ 0。' },

    { id: 'ch06-p1', ch: 'ch06', kp: 'ch06-5', tier: 4, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '读下面的程序，<b>写出完整输出（逐行）</b>。追问：① `swap(int, int)` 为什么没交换成功？② `swap(int[], int, int)` 为什么成功了？③ `f(3,4)` 调用的是哪个方法（重载解析）？',
      code: 'public class Q {\n    static void swap(int a, int b) {\n        int t = a;\n        a = b;\n        b = t;\n    }\n    static void swap(int[] a, int i, int j) {\n        int t = a[i];\n        a[i] = a[j];\n        a[j] = t;\n    }\n    static int f(int n) {\n        if (n <= 1) {\n            return 1;\n        }\n        return n * f(n - 1);\n    }\n    static int f(int a, int b) {\n        return a + b;\n    }\n    public static void main(String[] args) {\n        int x = 1;\n        int y = 2;\n        swap(x, y);\n        System.out.println(x + " " + y);\n        int[] arr = {1, 2, 3};\n        swap(arr, 0, 2);\n        System.out.println(arr[0] + " " + arr[2]);\n        System.out.println(f(4));\n        System.out.println(f(3, 4));\n        System.out.println(f(0));\n    }\n}',
      answer: '1 2\n3 1\n24\n7\n1',
      explain: '① 基本类型参数传的是**值的副本**：swap 里交换的只是副本 a、b，main 的 x、y 不受影响 → `1 2`；② 数组参数传的是**引用的副本**，swap(arr,0,2) 交换的是同一个数组的元素 → `3 1`；③ f(4) 是单参数版本，递归 4×3×2×f(1)=24；④ f(3,4) 参数有两个，匹配 `f(int a, int b)` → 7；⑤ f(0)：n<=1 直接返回 1。重载解析看**参数的个数与类型**，与返回类型无关。' },

    { id: 'ch06-t1', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '方法调用时，调用栈（call stack）的行为是？',
      options: [
        { text: '后调用的方法先返回：每次调用压入一帧，返回时弹出该帧', correct: true },
        { text: '先调用的方法先返回（先进先出）' },
        { text: '所有方法的栈帧同时保留到程序结束' },
        { text: '栈帧里只存方法名，不存局部变量' }
      ],
      explain: '调用栈是 LIFO（后进先出）：调用方法时压入一帧（保存参数、局部变量、返回地址），方法返回时弹出。所以递归里“最内层先算完、再一层层返回”，这也是理解递归去程/回程的关键。' },

    { id: 'ch06-t2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
      stem: '判断：Java 方法参数是值传递，方法内修改**基本类型**形参的值不会影响调用方的实参。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: '基本类型参数传的是数值的**副本**，方法内 `x = 100` 只改副本，调用方的变量不变。对象参数传的是引用的副本：能通过副本改对象内部状态，但让副本改指新对象不影响调用方。总之 Java 只有值传递。' },

    { id: 'ch06-t3', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: '下列哪两个方法构成**重载（overload）**？',
      options: [
        { text: '`int f(int a)` 与 `int f(double a)`', correct: true },
        { text: '`int f(int a)` 与 `double f(int a)`' },
        { text: '`int f(int a)` 与 `int f(int b)`' },
        { text: '`static int f(int a)` 与 `int f(int a)`' }
      ],
      explain: '重载要求方法名相同、**参数列表不同**（类型/个数/顺序）。A 的参数类型不同 ✓。B 只有返回类型不同、C 只有参数名不同、D 只有 static 不同，都不算重载，javac 报 duplicate method。' },

    { id: 'ch06-t4', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Q {\n    static int depth(int n) {\n        if (n <= 1) {\n            return 1;\n        }\n        return 1 + depth(n / 2);\n    }\n    public static void main(String[] args) {\n        System.out.println(depth(1));\n        System.out.println(depth(8));\n        System.out.println(depth(9));\n    }\n}',
      answer: '1\n4\n4',
      explain: '① depth(1)：n&lt;=1 命中基线 → 1；② depth(8)：8→4→2→1，共 4 层递归调用 → 4；③ depth(9)：9→4（整数除法 9/2=4）→2→1，也是 4 层。这其实在计算 ⌊log₂n⌋+1，是二分查找比较次数的来源。' },

    { id: 'ch06-t5', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '`Math.round(-2.5)` 与 `Math.round(2.5)` 的结果分别是？',
      options: [
        { text: '-2 和 3', correct: true },
        { text: '-3 和 3' },
        { text: '-2 和 2' },
        { text: '-3 和 2' }
      ],
      explain: 'Math.round 的规则是“**加 0.5 后向下取整**”（floor(x+0.5)）：round(2.5) = floor(3.0) = 3；round(-2.5) = floor(-2.0) = -2。所以负数的 .5 会向**大**（靠近零）取，不是四舍五入的“远离零”。返回值类型是 long。' },

    { id: 'ch06-f3', ch: 'ch06', kp: 'ch06-2', tier: 2, type: 'fill', mode: 'findbug', difficulty: 3, tags: ['bug'],
      stem: '程序本意是交换 x、y 的值，实际输出 `1 2`。指出哪一行有问题并说明为什么，以及如何改。',
      code: 'public class Q {\n    static void swap(int a, int b) {\n        int t = a;\n        a = b;\n        b = t;\n    }\n    public static void main(String[] args) {\n        int x = 1;\n        int y = 2;\n        swap(x, y);\n        System.out.println(x + " " + y);\n    }\n}',
      answer: '问题在 swap 方法（第 3–7 行）：Java 是值传递，交换的只是形参 a、b 的副本，调用方的 x、y 不变。应改为传递数组（或返回新值），例如 `swap(int[] arr)` 交换 arr[0]、arr[1]',
      accept: [
        { hint: '指出 swap 方法内交换的是副本（第 3–7 行 / 值传递）', any: ['值传递', '副本', '形参', '第3行', '第4行', 'swap'] },
        { hint: '改成用数组/返回两个值：交换 arr[0] 与 arr[1]', any: ['数组', 'arr[0]', 'int[]', '返回值', '包一层'] }
      ],
      fix: 'public class Q {\n    static void swap(int[] arr) {\n        int t = arr[0];\n        arr[0] = arr[1];\n        arr[1] = t;\n    }\n    public static void main(String[] args) {\n        int[] pair = {1, 2};\n        swap(pair);\n        System.out.println(pair[0] + " " + pair[1]);\n    }\n}',
      explain: '方法内 `a = b; b = t;` 只交换了形参副本，main 的 x、y 从不被触碰，所以输出 1 2。Java 无法写一个真正交换两个 int 的方法；常见替代：把两个数放进数组（引用副本能改元素）、返回一个含两个元素的新数组、或把交换逻辑直接写回调用处。' },

    { id: 'ch06-t7', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'predict', difficulty: 3, tags: ['output', 'trap'],
      stem: '写出下面程序的完整输出（逐行）。追问：输出 20 的那两行分别用的是哪个 x？',
      code: 'public class Q {\n    static int x = 10;\n    public static void main(String[] args) {\n        int x = 20;\n        System.out.println(x);\n        {\n            int y = x + 5;\n            System.out.println(y);\n        }\n        for (int i = 0; i < 1; i++) {\n            int x2 = 30;\n        }\n        System.out.println(x);\n        System.out.println(Q.x);\n    }\n}',
      answer: '20\n25\n20\n10',
      explain: '① main 里声明局部变量 x=20，它**遮蔽**了同名的 static 字段 x（10）→ 打印 20；② 内层块里 y = x + 5 = 25，块结束 y 失效；③ 第二个 println(x) 仍是 main 的局部 x=20；④ `Q.x` 显式用类名访问 static 字段 → 10。作用域规则：内层同名变量遮蔽外层，出了块就恢复；用“类名.字段”可以绕过遮蔽。' },

    { id: 'ch06-t8', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '“递归可以避免重复代码（DRY）”在这里的含义是？',
      options: [
        { text: '把重复的处理步骤抽成方法，在方法内部用更小规模的问题调用自己，而不是把同样的代码复制很多遍', correct: true },
        { text: '递归代码的长度一定比循环短' },
        { text: '递归不需要写基线条件' },
        { text: '递归只能用来算阶乘' }
      ],
      explain: 'DRY（Don’t Repeat Yourself）指同一逻辑只写一次。递归的价值：把“处理规模 n”与“处理规模 n-1”统一成同一段代码，靠参数缩小规模。比如汉诺塔只需 3 行递归就能表达 2ⁿ-1 步的流程，而迭代写法要手动模拟三个柱子。' },

    { id: 'ch06-t9', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['syntax'],
      stem: '要把字符串 "42" 转成 int，正确写法是？',
      options: [
        { text: '`Integer.parseInt("42")`', correct: true },
        { text: '`(int) "42"`' },
        { text: '`Integer.toString("42")`' },
        { text: '`String.toInt("42")`' }
      ],
      explain: '字符串 → 整数用 `Integer.parseInt(s)`（返回 int）；反过来整数 → 字符串用 `Integer.toString(n)` 或 `"" + n`。`(int)` 强转只能用于数值类型之间，不能把 String 转成 int（编译错误）。若字符串内容不是合法整数，parseInt 抛 NumberFormatException。' },

    { id: 'ch06-t10', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '关于局部变量的作用域，下列说法正确的是？',
      options: [
        { text: '从声明处开始，到它所在的最内层代码块结束为止', correct: true },
        { text: '从方法开始到方法结束（无论声明在哪）' },
        { text: '整个类内部都能访问' },
        { text: '程序运行期间一直存在（和 static 字段一样）' }
      ],
      explain: '局部变量的作用域是**声明处到所在块结束**：在 for 里声明的 i 出了循环就不能用；在 if 块里声明的变量出了块也失效。出了作用域还引用会编译错误（cannot find symbol）。字段的作用域才是整个类。' },

    { id: 'ch06-c4', ch: 'ch06', kp: 'ch06-7', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '用<b>递归</b>补全方法 <code>sumRec</code>：返回 1+2+…+n（n=0 时返回 0，不要用循环）。',
      starter: 'public class Q {\n    static int sumRec(int n) {\n        // TODO: 用递归求 1+2+…+n（n=0 时返回 0，不要用循环）\n        return 0;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(sumRec(n));\n    }\n}',
      solution: 'public class Q {\n    static int sumRec(int n) {\n        if (n == 0) {\n            return 0;\n        }\n        return n + sumRec(n - 1);\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(sumRec(n));\n    }\n}',
      tests: [
        { args: ['4'], expect: '10' },
        { args: ['0'], expect: '0' }
      ],
      explain: '递归三要素：基线 `if (n == 0) return 0;`、递归步骤 `return n + sumRec(n - 1);`、每次 n 减 1 逼近基线。测试用例覆盖 n=4（10）与 n=0（0，防止基线写错）。' },

    { id: 'ch06-p2', ch: 'ch06', kp: 'ch06-4', tier: 4, type: 'predict', difficulty: 3, tags: ['output', 'trap'],
      stem: '下面的程序同时用递归和迭代算斐波那契，并统计递归调用次数。写出完整输出（逐行）。追问：① 为什么递归只算 fib(6) 却调用了 25 次？② 迭代版为什么不需要这 25 次？',
      code: 'public class Q {\n    static int step = 0;\n    static int fib(int n) {\n        step++;\n        if (n < 2) {\n            return n;\n        }\n        return fib(n - 1) + fib(n - 2);\n    }\n    static int fibIter(int n) {\n        if (n < 2) {\n            return n;\n        }\n        int a = 0;\n        int b = 1;\n        for (int i = 2; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        return b;\n    }\n    public static void main(String[] args) {\n        System.out.println(fib(6));\n        System.out.println(step);\n        System.out.println(fibIter(6));\n        System.out.println(step);\n        System.out.println(fib(0) + " " + fib(1));\n        System.out.println(step);\n    }\n}',
      answer: '8\n25\n8\n25\n0 1\n27',
      explain: '① fib(6) = 8；② 朴素递归的调用次数 C(n)=1+C(n-1)+C(n-2)，C(0)=C(1)=1，得 C(6)=25——同一个子问题被反复计算；③ fibIter(6) 用两个变量滚动（a、b），循环 5 次，不需要栈，结果同样是 8；④ 调 fib(0)、fib(1) 又各增加调用，step 从 25 变 27。这解释了为什么递归斐波那契是 O(2ⁿ)、迭代是 O(n)。' },

    { id: 'ch06-c5', ch: 'ch06', kp: 'ch06-1', tier: 3, type: 'code', difficulty: 1, tags: ['code'],
      stem: '补全方法 <code>min</code>：返回数组中的最小元素（约定数组非空）。',
      starter: 'public class Q {\n    static int min(int[] a) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        int[] a = {3, 1, 4, 1, 5};\n        int[] b = {-2, 8, -7};\n        System.out.println(min(a));\n        System.out.println(min(b));\n    }\n}',
      solution: 'public class Q {\n    static int min(int[] a) {\n        int m = a[0];\n        for (int i = 1; i < a.length; i++) {\n            if (a[i] < m) {\n                m = a[i];\n            }\n        }\n        return m;\n    }\n    public static void main(String[] args) {\n        int[] a = {3, 1, 4, 1, 5};\n        int[] b = {-2, 8, -7};\n        System.out.println(min(a));\n        System.out.println(min(b));\n    }\n}',
      tests: [
        { args: [], expect: '1\n-7' }
      ],
      explain: '用 a[0] 作为当前最小值初值，从 i=1 开始比较（用 0 作初值在全正数组上会错）。遍历完返回 m。' },

    { id: 'ch06-c6', ch: 'ch06', kp: 'ch06-7', tier: 3, type: 'code', difficulty: 3, tags: ['code'],
      stem: '用<b>递归</b>补全方法 <code>gcdRec</code>：返回 a 与 b 的最大公约数（欧几里得算法，约定不同时为 0）。',
      starter: 'public class Q {\n    static int gcdRec(int a, int b) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        int a = Integer.parseInt(args[0]);\n        int b = Integer.parseInt(args[1]);\n        System.out.println(gcdRec(a, b));\n    }\n}',
      solution: 'public class Q {\n    static int gcdRec(int a, int b) {\n        if (b == 0) {\n            return a;\n        }\n        return gcdRec(b, a % b);\n    }\n    public static void main(String[] args) {\n        int a = Integer.parseInt(args[0]);\n        int b = Integer.parseInt(args[1]);\n        System.out.println(gcdRec(a, b));\n    }\n}',
      tests: [
        { args: ['12', '18'], expect: '6' },
        { args: ['7', '13'], expect: '1' },
        { args: ['100', '0'], expect: '100' }
      ],
      explain: '递归版辗转相除：基线 b==0 返回 a，否则 gcdRec(b, a % b)。与迭代版相比代码更短，但每次调用压栈；gcd(100,0) 直接命中基线返回 100。' },

    { id: 'ch06-c7', ch: 'ch06', kp: 'ch06-6', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>countVowels</code>：统计字符串 s 中元音字母（a e i o u，区分大小写小写）的个数。',
      starter: 'public class Q {\n    static int countVowels(String s) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        System.out.println(countVowels(args[0]));\n    }\n}',
      solution: 'public class Q {\n    static int countVowels(String s) {\n        int n = 0;\n        for (int i = 0; i < s.length(); i++) {\n            char c = s.charAt(i);\n            if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n                n++;\n            }\n        }\n        return n;\n    }\n    public static void main(String[] args) {\n        System.out.println(countVowels(args[0]));\n    }\n}',
      tests: [
        { args: ['hello'], expect: '2' },
        { args: ['AEIOU'], expect: '0' },
        { args: ['xyz'], expect: '0' }
      ],
      explain: '遍历 s.charAt(i)，用 == 比较 char（基本类型）。注意题目限定小写，所以 AEIOU 返回 0；若要忽略大小写需先 toLowerCase。' },

    { id: 'ch06-n1', ch: 'ch06', kp: 'ch06-8', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '调试一个“能编译、能运行、结果不对”的方法时，第一步应该做什么？',
      options: [
        { text: '在调用点打印方法实际返回了什么，再和“我以为它应该返回什么”对照', correct: true },
        { text: '把方法改写成递归' },
        { text: '给方法加更多参数' },
        { text: '把方法名改成小写' }
      ],
      explain: '方法 bug 调试三步：① 先确认方法到底返回了什么（调用点打印返回值）；② 对照预期；③ 回到方法体检查三处：返回路径（是否每条路径都 return 正确值）、运算类型（整数除法/括号）、参数语义（传进来的是副本还是引用）。' },

    { id: 'ch06-n2', ch: 'ch06', kp: 'ch06-8', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '方法体里最常出 bug 的三处是？',
      options: [
        { text: '返回路径（漏 return）、运算类型（整数除法/括号）、参数语义（值/引用副本）', correct: true },
        { text: '方法名、注释、缩进' },
        { text: '变量名长度、空格、换行' },
        { text: 'import 顺序' }
      ],
      explain: '三类高频错误：① 某些分支没 return（编译错）或 return 了错误变量；② `a + b / 2` 少了括号、`int / int` 丢小数；③ 以为方法能改实参（Java 值传递，基本类型改不了；对象改内容可以、重新绑定不行）。' },

    { id: 'ch06-n3', ch: 'ch06', kp: 'ch06-8', tier: 1, type: 'tf', difficulty: 2, tags: ['trap'],
      stem: '判断：调用有返回值的方法时，如果只写 `methodName(...)` 而不接收返回值，返回值就被丢弃、方法等于白算。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: '有返回值的方法必须用变量接住或作为参数/输出使用：`int r = f(x);` 或 `System.out.println(f(x));`。只写 `f(x);` 时返回值被丢弃（编译允许，但没有任何效果），是递归/方法题常见的“结果错”来源。' },

    { id: 'ch06-n4', ch: 'ch06', kp: 'ch06-8', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '程序本意是求 (4+6)/2 = 5.0，实际输出 7.0。指出哪一行有问题并改正。',
      code: 'public class Q {\n    static double average(int a, int b) {\n        return a + b / 2;\n    }\n    public static void main(String[] args) {\n        System.out.println(average(4, 6));\n    }\n}',
      answer: '第 3 行：`return a + b / 2;` 先算 b/2=3 再 +a=7，且整数除法丢小数。应改为 `return (a + b) / 2.0;`',
      accept: [
        { hint: '指出行号（第 3 行 / return 表达式）', any: ['第3行', '第 3 行', '3行', '行3', 'return'] },
        { hint: '加括号并改用 2.0：`(a + b) / 2.0`', any: ['(a + b) / 2.0', '(a+b)/2.0', '加括号', '2.0', '括号'] }
      ],
      fix: 'public class Q {\n    static double average(int a, int b) {\n        return (a + b) / 2.0;\n    }\n    public static void main(String[] args) {\n        System.out.println(average(4, 6));\n    }\n}',
      explain: '两个错误叠加：① 运算符优先级 → a + b/2 = 4 + 3 = 7；② `/ 2` 是整数除法 → 即使 a+b=10，10/2 也是 int 5 再转 double 5.0。修法：`(a + b) / 2.0`——括号改结合顺序、2.0 让除法在 double 上做。' },

    { id: 'ch06-n5', ch: 'ch06', kp: 'ch06-8', tier: 4, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '<b>综合</b>：读下面由四个小方法组成的程序，<b>写出完整输出（逐行）</b>。追问：① sumOfSquares 依赖哪个方法？② allPositive 里 return false 与最后的 return true 各表示什么？',
      code: 'public class Q {\n    static int square(int x) {\n        return x * x;\n    }\n    static int sumOfSquares(int[] a) {\n        int s = 0;\n        for (int i = 0; i < a.length; i++) {\n            s += square(a[i]);\n        }\n        return s;\n    }\n    static boolean allPositive(int[] a) {\n        for (int i = 0; i < a.length; i++) {\n            if (a[i] <= 0) {\n                return false;\n            }\n        }\n        return true;\n    }\n    static int countAbove(int[] a, int t) {\n        int c = 0;\n        for (int i = 0; i < a.length; i++) {\n            if (a[i] > t) {\n                c++;\n            }\n        }\n        return c;\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        System.out.println(sumOfSquares(a));\n        System.out.println(allPositive(a));\n        int[] b = {1, 0, 3};\n        System.out.println(allPositive(b));\n        System.out.println(countAbove(a, 1));\n        System.out.println(square(5) + square(2));\n    }\n}',
      answer: '14\ntrue\nfalse\n2\n29',
      explain: '① square(1)+square(2)+square(3) = 1+4+9 = 14；② allPositive({1,2,3}) → true；③ allPositive({1,0,3})：遇到 0 不满足 >0 → 立即 false（提前返回）；④ countAbove({1,2,3},1)：2、3 大于 1 → 2；⑤ square(5)+square(2) = 25+4 = 29。方法题的读法：先看每个方法做什么，再按调用顺序代入。' },

    { id: 'ch06-d1', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
      stem: '判断：在方法内修改对象参数的**字段**，会影响到调用方看到的对象。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: '对象参数传的是引用的副本，但副本与原引用指向同一个对象，所以改对象内部状态（`obj.field = x`）调用方能看到。但在方法内 `obj = new X()` 只改副本指向，不影响调用方。这是“值传递，传的值是引用”的准确含义。' },

    { id: 'ch06-d2', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '下面哪一句关于局部变量作用域的说法正确？',
      options: [
        { text: '在 for 初始化部分声明的变量，循环结束后就不能再使用', correct: true },
        { text: '在 for 里声明的变量在方法任何位置都能用' },
        { text: '局部变量的作用域是整个类' },
        { text: '局部变量没有作用域限制' }
      ],
      explain: 'for 的初始化变量作用域限于循环本身，出了循环就不可见（编译错误 cannot find symbol）。若要在循环外使用循环变量，应在循环前声明：`int i; for (i = 0; ...)`。' },

    { id: 'ch06-d3', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '递归调用时，每次调用都会在调用栈上压入新的栈帧，栈帧里存的是？',
      options: [
        { text: '该次调用的参数、局部变量与返回地址', correct: true },
        { text: '整个程序的所有变量' },
        { text: '只有方法名' },
        { text: '类的静态字段' }
      ],
      explain: '每次方法调用创建一个栈帧：保存本次调用的参数、局部变量、返回地址（以及中间结果）。递归深度 = 同时存活的栈帧数，所以递归太深会 StackOverflowError。静态字段属于类，不在栈帧里。' },

    { id: 'ch06-d4', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: '下列哪两个方法可以构成重载？',
      options: [
        { text: '`double area(double r)` 与 `double area(double r, double h)`', correct: true },
        { text: '`double area(double r)` 与 `int area(double r)`' },
        { text: '`double area(double r)` 与 `double area(double radius)`' },
        { text: '`static double area(double r)` 与 `double area(double r)`' }
      ],
      explain: '重载要求方法名相同、**参数列表不同**（个数/类型/顺序）。A 参数个数不同 ✓。B 只有返回类型不同、C 只有参数名不同、D 只有 static 不同，都不构成重载（javac 报 duplicate method）。' },

    { id: 'ch06-d5', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'fill', difficulty: 2, tags: ['syntax'],
      stem: '填空：`max(int a, int b)` 与 `max(double a, double b)` 构成重载；调用 `max(3, 4)` 时，编译器会选择参数类型精确匹配的 `_____` 版本。',
      answer: ['int', 'Int'],
      explain: '重载解析：编译器优先选参数类型精确匹配的版本，找不到才做宽化提升。`max(3,4)` 两个实参都是 int → 选 int 版；`max(3.0,4)` 选 double 版（int 提升为 double）。' },

    /* ============================================================ ch07 类与对象 */
    { id: 'ch07-q1', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept', 'exam'],
      stem: '执行下面代码后输出什么？',
      code: 'class Point {\n    int x;\n    int y;\n}\nPoint p = new Point();\nSystem.out.println(p.x + " " + p.y);',
      options: [
        { text: '0 0', correct: true },
        { text: 'null null' },
        { text: '编译错误：字段未初始化' },
        { text: '随机值' }
      ],
      explain: '字段（field）有默认值：int 是 0，double 是 0.0，boolean 是 false，对象引用是 null。所以 p.x、p.y 都是 0。注意：**局部变量**没有默认值，必须先赋值才能使用（否则编译错误）。' },

    { id: 'ch07-q2', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '把字段声明为 `private` 的主要目的是什么？',
      options: [
        { text: '把字段藏起来，外部只能通过公开方法访问，从而保护数据', correct: true },
        { text: '让字段变成常量，不能被修改' },
        { text: '让字段自动初始化' },
        { text: '提高程序的运行速度' }
      ],
      explain: 'private 是封装（encapsulation）的手段：外部不能直接改字段，只能通过 getter/setter 访问，于是可以在 setter 里做校验（比如年龄不能为负），也可以在不破坏外部调用的情况下修改内部实现。常量用 final，和 private 是两回事。' },

    { id: 'ch07-q3', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'mcq', difficulty: 3, tags: ['trap', 'exam'],
      stem: '下面程序输出什么？',
      code: 'class Counter {\n    static int total = 0;\n    int id;\n    Counter() {\n        total++;\n        id = total;\n    }\n}\nCounter a = new Counter();\nCounter b = new Counter();\nSystem.out.println(a.id + " " + b.id + " " + Counter.total);',
      options: [
        { text: '1 1 1' },
        { text: '1 2 2', correct: true },
        { text: '1 2 1' },
        { text: '2 2 2' }
      ],
      explain: 'static 字段 total 属于类，被所有对象**共享**：第一次 new 后 total=1、a.id=1；第二次 new 后 total=2、b.id=2。实例字段 id 每个对象各有一份。所以输出 1 2 2。' },

    { id: 'ch07-q4', ch: 'ch07', kp: 'ch07-1', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
      stem: '判断：如果一个类没有写任何构造器，Java 会自动提供一个无参的默认构造器。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: '不写构造器时，编译器自动生成一个 public 的无参构造器，所以 `new Point()` 可以工作。但**一旦自己写了带参构造器**，编译器就不再提供无参构造器，此时 `new Point()` 会编译错误——需要自己补一个无参构造器。' },

    { id: 'ch07-q5', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'predict', difficulty: 2, tags: ['output', 'trap'],
      stem: '写出下面程序的输出。',
      code: 'class Box {\n    int w;\n    Box(int w) {\n        this.w = w;\n    }\n    void grow() {\n        w = w * 2;\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Box b = new Box(3);\n        b.grow();\n        Box c = b;\n        c.grow();\n        System.out.println(b.w);\n    }\n}',
      answer: '12',
      explain: '构造器里 `this.w = w` 区分字段与参数，b.w 初始为 3。b.grow() → 3*2 = 6。`Box c = b;` 只是让 c 指向同一个对象（引用别名），c.grow() 把**同一个** w 变成 12，所以 b.w 也是 12。' },

    { id: 'ch07-q6', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'fill', difficulty: 1, tags: ['syntax', 'exam'],
      stem: '填空：构造器的参数名与字段同名时，要用 `_____` 关键字引用当前对象的字段，例如 `this.name = name;`。',
      answer: 'this',
      explain: 'this 指向“当前对象”。`this.name` 是字段，右边的 name 是参数；不写 this 时两边都是参数，字段根本没被赋值——这是构造器最经典的 bug。' },

    { id: 'ch07-q7', ch: 'ch07', kp: 'ch07-1', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
      stem: '关于构造器（constructor），下列哪些说法是正确的？（多选）',
      options: [
        { text: '构造器的名字必须与类名完全相同', correct: true },
        { text: '构造器可以声明返回类型 void' },
        { text: '一个类可以有多个参数列表不同的构造器（重载）', correct: true },
        { text: '用 new 关键字创建对象时会调用构造器', correct: true }
      ],
      explain: '构造器名必须与类名相同，且**没有返回类型**（连 void 都不能写）——写了 void 它就是普通方法，不再在 new 时自动调用。一个类可以有多个重载构造器。new 分配对象后调用对应构造器。' },

    { id: 'ch07-q8', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '下面哪种写法正确体现了“封装”？',
      options: [
        { text: '`public int x;`（字段直接公开给外部）' },
        { text: '`private int x;` 加 `public int getX()` 和 `public void setX(int x)`', correct: true },
        { text: '`static int x;`' },
        { text: '`final int x;`' }
      ],
      explain: '封装的做法是：字段 private（藏起来）+ 公开的 getter/setter（受控访问）。这样外部不能绕过 setter 直接改数据，类的内部实现改动也不会影响调用方。public 字段、static 字段、final 字段本身都不等于封装。' },

    { id: 'ch07-q9', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap', 'exam'],
      stem: '下面程序输出什么？',
      code: 'class P { int v = 1; }\nP[] arr = new P[2];\nSystem.out.println(arr[0]);',
      options: [
        { text: 'null', correct: true },
        { text: '0' },
        { text: '1' },
        { text: '编译错误' }
      ],
      explain: '`new P[2]` 只创建了**数组本身**（两个引用槽位），并没有创建 P 对象；引用类型元素的默认值是 null。所以 arr[0] 打印 null，此时访问 arr[0].v 会抛 NullPointerException。对象数组要自己逐个 new。' },

    { id: 'ch07-k1', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'predict', difficulty: 2, tags: ['output', 'trap'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'class C {\n    static int s = 0;\n    int v = 0;\n    C() {\n        s++;\n        v++;\n    }\n    static int getS() {\n        return s;\n    }\n    int getV() {\n        return v;\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        C a = new C();\n        C b = new C();\n        System.out.println(a.getV() + " " + b.getV());\n        System.out.println(a.getS() + " " + C.getS());\n        a.s = 10;\n        System.out.println(b.s);\n        b.v = 5;\n        System.out.println(a.v);\n    }\n}',
      answer: '1 1\n2 2\n10\n1',
      explain: '① v 是实例字段，每个对象各有一份：a、b 构造后都是 1 → `1 1`；② s 是 static，属于类、被所有对象共享：两次 new 后 s=2，所以 `2 2`；③ 通过 a.s=10 改的是**类字段**，b.s 读到的也是 10；④ b.v=5 只改 b 的实例字段，a.v 仍是 1。口诀：static 属于类（只有一份），实例字段属于对象（每个对象一份）。' },

    { id: 'ch07-k2', ch: 'ch07', kp: 'ch07-6', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
      stem: '判断：在 static 方法里可以直接使用 `this` 关键字，也可以直接访问同一个类的实例字段。',
      options: [
        { text: '正确（True）' },
        { text: '错误（False）', correct: true }
      ],
      explain: 'static 方法属于**类**，调用它时可能根本没创建对象，因此没有“当前对象”this。所以在 static 方法里：不能用 this，也不能直接访问实例字段/实例方法；只能访问 static 成员，或先 new 一个对象再通过对象访问。main 方法就是 static 的，这也是为什么 main 里要 new 对象才能调用实例方法。' },

    { id: 'ch07-k3', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'predict', difficulty: 3, tags: ['output', 'trap'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'class Point {\n    int x, y;\n    Point(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n    public String toString() {\n        return "(" + x + "," + y + ")";\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Point[] ps = new Point[3];\n        System.out.println(ps[0]);\n        ps[0] = new Point(1, 2);\n        ps[1] = ps[0];\n        ps[1].x = 5;\n        System.out.println(ps[0]);\n        System.out.println("" + ps[2]);\n        for (int i = 0; i < ps.length; i++) {\n            System.out.print(ps[i] + " ");\n        }\n        System.out.println();\n    }\n}',
      answer: 'null\n(5,2)\nnull\n(5,2) (5,2) null',
      explain: '① `new Point[3]` 只创建数组，3 个槽位默认 null → 打印 null；② ps[1] = ps[0] 是别名，改 ps[1].x=5 后 ps[0] 也是 (5,2)；③ ps[2] 仍是 null，`"" + null` 得到字符串 "null"；④ 打印对象时自动调用 toString，所以循环输出 `(5,2) (5,2) null`。对象数组要逐个 new，否则访问元素字段会 NullPointerException。' },

    { id: 'ch07-k4', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '执行 `Point[] ps = new Point[3];` 之后，下面哪句话正确？',
      options: [
        { text: '数组里 3 个元素都是 null，需要再逐个 `ps[i] = new Point(…)` 才能使用', correct: true },
        { text: '数组里 3 个元素都是自动 new 好的 Point 对象' },
        { text: '编译错误，对象数组必须同时初始化' },
        { text: '数组里 3 个元素都是默认值 0' }
      ],
      explain: '`new Point[3]` 只创建**数组对象本身**（3 个引用槽），不会创建 Point 对象；引用类型元素的默认值是 null。所以此时 `ps[0].x` 会抛 NullPointerException。对象数组的正确用法是：先 new 数组，再对每个下标 new 一个对象。对比 `new int[3]`：基本类型数组的元素默认是 0/false，可以直接用。' },

    { id: 'ch07-f1', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '程序本意是构造 `Point(5)` 后输出 `(5)`，实际输出 `(0)`。指出哪一行有问题并改正。',
      code: 'class Point {\n    int x;\n    Point(int x) {\n        x = x;\n    }\n    public String toString() {\n        return "(" + x + ")";\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Point p = new Point(5);\n        System.out.println(p);\n    }\n}',
      answer: '第 4 行：`x = x;` 两边都是参数，字段没有被赋值。应改为 `this.x = x;`',
      accept: [
        { hint: '指出行号（第 4 行）', any: ['第4行', '第 4 行', '4行', '行4', 'line4'] },
        { hint: '加上 `this.`：`this.x = x;`', any: ['this.x', 'this.x=x', '加this', '用this'] }
      ],
      fix: 'class Point {\n    int x;\n    Point(int x) {\n        this.x = x;\n    }\n    public String toString() {\n        return "(" + x + ")";\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Point p = new Point(5);\n        System.out.println(p);\n    }\n}',
      explain: '构造器的参数名与字段同名时，构造器体内 `x` 指的是**参数**（参数遮蔽字段），所以 `x = x;` 只是把参数赋给它自己，字段仍是默认值 0。必须写 `this.x = x;`：`this.x` 是当前对象的字段。这是构造器最经典的 bug。' },

    { id: 'ch07-f2', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '下面程序编译报错。指出哪一行有问题并改正。',
      code: 'class Counter {\n    int count = 0;\n    static void inc() {\n        count++;\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Counter c = new Counter();\n        Counter.inc();\n        System.out.println(c.count);\n    }\n}',
      answer: '第 4 行：`static void inc()` 是静态方法，不能直接访问实例字段 count。应去掉 `static` 改成实例方法 `void inc()`，并用 `c.inc()` 调用',
      accept: [
        { hint: '指出行号（第 4 行）', any: ['第4行', '第 4 行', '4行', '行4', 'line4'] },
        { hint: '去掉 `static`（改成实例方法），并通过对象调用', any: ['去掉static', '删除static', '实例方法', '非静态', 'c.inc()', '改成实例'] }
      ],
      fix: 'class Counter {\n    int count = 0;\n    void inc() {\n        count++;\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Counter c = new Counter();\n        c.inc();\n        System.out.println(c.count);\n    }\n}',
      explain: 'javac 报 `non-static variable count cannot be referenced from a static context`。`static` 方法属于类、没有 this，不能直接访问实例字段；count 属于每个对象。修法二选一：把 inc 改成实例方法（推荐，然后用 `c.inc()`），或把 count 也声明为 static（那样所有对象共享一个计数）。' },

    { id: 'ch07-p1', ch: 'ch07', kp: 'ch07-6', tier: 4, type: 'predict', difficulty: 3, tags: ['output', 'trap'],
      stem: '读下面的程序，<b>写出完整输出（逐行）</b>。追问：① static 字段 created 依次变成多少？② `System.out.println(b)` 为什么能直接打印对象？③ 对象数组 `new Counter[2]` 之后 arr[0] 是什么？',
      code: 'class Counter {\n    static int created = 0;\n    int id;\n    Counter() {\n        created++;\n        id = created;\n    }\n    Counter(int id) {\n        this.id = id;\n        created++;\n    }\n    public String toString() {\n        return "C" + id;\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Counter a = new Counter();\n        Counter b = new Counter(7);\n        Counter c = new Counter();\n        System.out.println(a.id + " " + b.id + " " + c.id);\n        System.out.println(Counter.created);\n        System.out.println(b);\n        System.out.println("" + b);\n        Counter[] arr = new Counter[2];\n        System.out.println(arr[0]);\n        arr[0] = a;\n        arr[1] = b;\n        for (int i = 0; i < arr.length; i++) {\n            System.out.print(arr[i] + " ");\n        }\n        System.out.println();\n    }\n}',
      answer: '1 7 3\n3\nC7\nC7\nnull\nC1 C7',
      explain: '① `new Counter()`：created=1、id=1；`new Counter(7)`：created=2、id=7（构造器没有用 created 赋值）；`new Counter()`：created=3、id=3 → 第一行 `1 7 3`；② created 是 static，属于类，被 3 次构造累计 → 3；③ println(对象) 会自动调用该对象的 toString() → `C7`；`"" + b` 同样是字符串拼接 → `C7`；④ `new Counter[2]` 只创建数组，元素默认 null → `null`；⑤ arr[0]=a、arr[1]=b 后循环打印 `C1 C7 `（行尾空格，判分忽略）。' },

    { id: 'ch07-t1', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '把字段声明为 `private` 并提供 `getX()/setX()`，最主要的好处是？',
      options: [
        { text: '外部不能直接改字段，只能在 setter 里统一做校验，保护对象状态', correct: true },
        { text: '让程序运行更快' },
        { text: '让字段变成只读常量' },
        { text: '省掉构造器' }
      ],
      explain: '封装 = 字段 private（藏起来）+ 公开 getter/setter（受控访问）。好处：① 可以在 setter 里做校验（年龄非负、余额不能越取）；② 内部实现改了不影响外部调用；③ 外部不能绕过规则直接改数据。final 才是“只读常量”，与 private 不同。' },

    { id: 'ch07-t2', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
      stem: '填空：用三个平行数组分别存学生姓名、学号、成绩不好维护，应该把它们合并成一个 `_____`（填 Java 概念，两个字）。',
      answer: ['对象', '类对象', 'class'],
      explain: '平行数组的问题：增删学生要同时改三个数组、下标一不小心就错位。正确做法是设计一个 Student 类（字段 name、id、score），用**对象**把相关数据绑在一起，再用 `Student[]` 或 ArrayList&lt;Student> 管理——这就是从“平行数组”到“实体”的进化（ch07 开头讲的核心动机）。' },

    { id: 'ch07-t3', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '执行 `Point p = new Point();` 时，`new` 做了什么？',
      options: [
        { text: '在堆上分配对象内存、调用构造器初始化，再把引用赋给 p', correct: true },
        { text: '在栈上分配整块对象内存' },
        { text: '只声明变量 p，不创建对象' },
        { text: '把 Point 类复制一份给 p' }
      ],
      explain: '`new Point()` 分三步：① 在**堆**上分配对象内存（字段取默认值）；② 调用构造器初始化；③ 把对象的引用赋给变量 p。p 本身在栈帧里，只存一个地址。所以“变量是引用、对象在堆里”是内存图的基本规则。' },

    { id: 'ch07-t4', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序的完整输出（逐行）。追问：为什么 a 的 title 打印成 [null]？',
      code: 'class Book {\n    String title;\n    int pages;\n    boolean hardcover;\n    Book() {\n    }\n    Book(String title) {\n        this.title = title;\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Book a = new Book();\n        Book b = new Book("Java");\n        System.out.println("[" + a.title + "]");\n        System.out.println(a.pages);\n        System.out.println(a.hardcover);\n        System.out.println(b.title + " " + b.pages + " " + b.hardcover);\n    }\n}',
      answer: '[null]\n0\nfalse\nJava 0 false',
      explain: '① a 用无参构造器创建：title 是引用类型字段，默认 null，`"[" + null + "]"` → `[]`；② pages 默认 0、hardcover 默认 false；③ b 用带参构造器，title="Java"，其余字段仍是默认值 → `Java 0 false`。结论：**字段**有默认值（0/false/null），**局部变量**没有。' },

    { id: 'ch07-t5', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '构造器里写 `name = name;`（参数与字段同名），会发生什么？',
      options: [
        { text: '字段没有被赋值，仍是默认值 null', correct: true },
        { text: '字段被正确赋值为参数值' },
        { text: '编译错误：变量重复定义' },
        { text: '运行时抛 NullPointerException' }
      ],
      explain: '构造器体内 `name` 指的是**参数**（参数遮蔽字段），`name = name` 只是把参数赋给它自己，字段仍是默认值。必须写 `this.name = name;`：this.name 是当前对象的字段。这是构造器最经典的 bug，考试常以“输出 null”的形式出现。' },

    { id: 'ch07-f3', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'fill', mode: 'findbug', difficulty: 3, tags: ['bug'],
      stem: '程序本意是“余额不足时不允许取款”，但输出 -50。指出哪一行有问题并改正。',
      code: 'class Account {\n    private int balance;\n    Account(int balance) {\n        this.balance = balance;\n    }\n    void withdraw(int amount) {\n        balance = balance - amount;\n    }\n    int getBalance() {\n        return balance;\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Account a = new Account(100);\n        a.withdraw(150);\n        System.out.println(a.getBalance());\n    }\n}',
      answer: '第 8 行的 withdraw 方法缺少校验：应先判断 `if (amount > balance) return;` 再扣款，否则余额会被扣成负数',
      accept: [
        { hint: '指出 withdraw 方法（第 8–10 行）缺少余额校验', any: ['withdraw', '第8行', '第 8 行', '8行', '没有校验', '缺少校验'] },
        { hint: '加上 `if (amount > balance) return;`（或抛异常/返回 false）', any: ['amount>balance', 'amount > balance', '余额不足', '判断余额', 'if (amount'] }
      ],
      fix: 'class Account {\n    private int balance;\n    Account(int balance) {\n        this.balance = balance;\n    }\n    void withdraw(int amount) {\n        if (amount > balance) {\n            return;\n        }\n        balance = balance - amount;\n    }\n    int getBalance() {\n        return balance;\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Account a = new Account(100);\n        a.withdraw(150);\n        System.out.println(a.getBalance());\n    }\n}',
      explain: '封装的意义就是“通过方法修改字段，在方法里守住规则”。withdraw 没有判断 amount 是否超过 balance，于是 100-150 = -50，账户出现负数余额。修法：方法开头加 `if (amount > balance) { return; }`（或抛 IllegalArgumentException / 返回 boolean）。这种“业务规则漏校验”是找 bug 题的常见类型。' },

    { id: 'ch07-t7', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'predict', difficulty: 3, tags: ['output', 'trap'],
      stem: '写出下面程序的完整输出（逐行）。追问：① ps[1] 指向哪里？② 为什么 ps[2] 打印 null？③ toString 在这里被谁调用？',
      code: 'class Point {\n    int x, y;\n    Point(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n    public String toString() {\n        return "(" + x + "," + y + ")";\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Point[] ps = new Point[3];\n        ps[0] = new Point(1, 2);\n        ps[1] = ps[0];\n        ps[1].x = 9;\n        System.out.println(ps[0]);\n        System.out.println(ps[2]);\n        int count = 0;\n        for (int i = 0; i < ps.length; i++) {\n            if (ps[i] != null) {\n                count++;\n            }\n        }\n        System.out.println(count);\n        for (Point p : ps) {\n            System.out.println(p == null ? "null" : p.toString());\n        }\n    }\n}',
      answer: '(9,2)\nnull\n2\n(9,2)\n(9,2)\nnull',
      explain: '① `new Point[3]` 只创建数组，三个槽默认 null；给 ps[0] 赋对象后 ps[2] 仍是 null → 打印 null；② `ps[1] = ps[0]` 是别名，改 ps[1].x=9 后 ps[0] 的 x 也变 9 → (9,2)；③ 遍历打印对象时自动调用 toString()；④ 非 null 元素统计为 2（ps[0]、ps[1] 指向同一个对象，但数组里占两个槽）；⑤ 循环打印时 ps[0]、ps[1] 都输出 (9,2)，ps[2] 仍是 null。' },

    { id: 'ch07-t8', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '为什么直接 `System.out.println(obj)` 有时打印 `Point@1b6d3586` 这样的字符串？',
      options: [
        { text: '类没有重写 toString()，用了 Object 的默认实现（类名@哈希码）', correct: true },
        { text: '对象是 null' },
        { text: 'println 不认识对象，输出的是内存地址' },
        { text: '编译错误' }
      ],
      explain: 'println 打印对象时会调用它的 `toString()`。如果类没有重写，就用 Object 的默认实现，输出 `类名@十六进制哈希码`（看起来像地址，其实不是真实地址）。重写 `public String toString()` 返回有意义的字段描述，调试和试卷读输出都靠它。' },

    { id: 'ch07-t9', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '类 `Point` 只写了 `Point(int x, int y)` 一个构造器，执行 `new Point();` 会怎样？',
      options: [
        { text: '编译错误：class Point 没有无参构造器', correct: true },
        { text: '正常创建对象，字段取默认值' },
        { text: '运行时抛 NullPointerException' },
        { text: '自动调用带参构造器并传 0' }
      ],
      explain: '编译器只在**没有写任何构造器**时自动补一个无参构造器；一旦写了带参构造器，就不再自动生成无参版本。所以 `new Point()` 编译错误。修法：补写 `Point() {}`，或改成 `new Point(0, 0)`。' },

    { id: 'ch07-t10', ch: 'ch07', kp: 'ch07-1', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '把一组相关数据和行为封装成类，最直接的好处是？',
      options: [
        { text: '数据与操作放在一起，改内部实现时只需改类内部，外部调用不变', correct: true },
        { text: '程序一定运行得更快' },
        { text: '不再需要数组' },
        { text: '可以省略 main 方法' }
      ],
      explain: '类的价值是**把数据和操作它的方法绑在一起**：Student 自己知道怎么算加权成绩，外部只调 `s.weightedScore()`，不用关心内部用了几个字段。以后改计算规则只改类内部，调用方不受影响。这就是“从平行数组到实体”（ch07-1）想表达的封装思想。' },

    { id: 'ch07-c1', ch: 'ch07', kp: 'ch07-5', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>clamp</code>：把 v 限制在 [lo, hi] 内（小于 lo 返回 lo、大于 hi 返回 hi、否则原样返回）。',
      starter: 'public class Q {\n    static int clamp(int v, int lo, int hi) {\n        // TODO: 把 v 限制在 [lo, hi] 范围内（小于 lo 返回 lo，大于 hi 返回 hi，否则原样返回）\n        return 0;\n    }\n    public static void main(String[] args) {\n        int v = Integer.parseInt(args[0]);\n        int lo = Integer.parseInt(args[1]);\n        int hi = Integer.parseInt(args[2]);\n        System.out.println(clamp(v, lo, hi));\n    }\n}',
      solution: 'public class Q {\n    static int clamp(int v, int lo, int hi) {\n        if (v < lo) {\n            return lo;\n        }\n        if (v > hi) {\n            return hi;\n        }\n        return v;\n    }\n    public static void main(String[] args) {\n        int v = Integer.parseInt(args[0]);\n        int lo = Integer.parseInt(args[1]);\n        int hi = Integer.parseInt(args[2]);\n        System.out.println(clamp(v, lo, hi));\n    }\n}',
      tests: [
        { args: ['-5', '0', '10'], expect: '0' },
        { args: ['20', '0', '10'], expect: '10' },
        { args: ['5', '0', '10'], expect: '5' }
      ],
      explain: 'setter 校验的经典形态：越下界返回 lo、越上界返回 hi、否则 v。顺序很重要——先判 v &lt; lo 再判 v > hi。测试覆盖三种情况（低于、高于、区间内），也是写方法题时应该自己想的边界。' },

    { id: 'ch07-p2', ch: 'ch07', kp: 'ch07-2', tier: 4, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '读下面的类与对象程序，<b>写出完整输出（逐行）</b>。追问：① 三个对象的 id 分别是多少？② Counter.total 为什么是 3？③ 对象数组求和得到 11 是怎么算的？',
      code: 'class Counter {\n    static int total = 0;\n    int id;\n    Counter() {\n        total++;\n        id = total;\n    }\n    Counter(int id) {\n        this.id = id;\n        total++;\n    }\n    String label() {\n        return "C" + id;\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Counter a = new Counter();\n        Counter b = new Counter(7);\n        Counter c = new Counter();\n        System.out.println(a.label() + " " + b.label() + " " + c.label());\n        System.out.println(Counter.total);\n        Counter[] arr = {a, b, c};\n        int sum = 0;\n        for (int i = 0; i < arr.length; i++) {\n            sum += arr[i].id;\n        }\n        System.out.println(sum);\n        for (Counter x : arr) {\n            System.out.print(x.label() + " ");\n        }\n        System.out.println();\n    }\n}',
      answer: 'C1 C7 C3\n3\n11\nC1 C7 C3',
      explain: '① 第一个 `new Counter()` 让 total=1、id=1；第二个 `new Counter(7)` 不改 id（id=7）但 total=2；第三个 `new Counter()` 让 total=3、id=3 → 标签 C1 C7 C3；② total 是 static 字段，被 3 次构造累计 → 3；③ 对象数组中 id 求和 1+7+3 = 11；④ 增强 for 遍历对象数组打印标签 `C1 C7 C3`。static 属于类、实例字段属于对象，这是期末读程序题的高频形态。' },

    { id: 'ch07-c2', ch: 'ch07', kp: 'ch07-3', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>describe</code>：返回形如 <code>len=3,sum=6</code> 的字符串（长度与元素和）。',
      starter: 'public class Q {\n    static String describe(int[] a) {\n        return "";\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        int[] b = {5};\n        System.out.println(describe(a));\n        System.out.println(describe(b));\n    }\n}',
      solution: 'public class Q {\n    static String describe(int[] a) {\n        int sum = 0;\n        for (int i = 0; i < a.length; i++) {\n            sum += a[i];\n        }\n        return "len=" + a.length + ",sum=" + sum;\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        int[] b = {5};\n        System.out.println(describe(a));\n        System.out.println(describe(b));\n    }\n}',
      tests: [
        { args: [], expect: 'len=3,sum=6\nlen=1,sum=5' }
      ],
      explain: '字符串拼接 + 数组遍历：a.length 是属性（无括号），sum 累加。注意拼接时数字会自动转字符串，不需要 Integer.toString。' },

    { id: 'ch07-c3', ch: 'ch07', kp: 'ch07-2', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>same</code>：判断两个 int 数组的<b>内容</b>是否完全相同（长度相同且每个元素相等）。',
      starter: 'public class Q {\n    static boolean same(int[] a, int[] b) {\n        return false;\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        int[] b = {1, 2, 3};\n        int[] c = {1, 2};\n        System.out.println(same(a, b));\n        System.out.println(same(a, c));\n    }\n}',
      solution: 'public class Q {\n    static boolean same(int[] a, int[] b) {\n        if (a.length != b.length) {\n            return false;\n        }\n        for (int i = 0; i < a.length; i++) {\n            if (a[i] != b[i]) {\n                return false;\n            }\n        }\n        return true;\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        int[] b = {1, 2, 3};\n        int[] c = {1, 2};\n        System.out.println(same(a, b));\n        System.out.println(same(a, c));\n    }\n}',
      tests: [
        { args: [], expect: 'true\nfalse' }
      ],
      explain: '先比长度（长度不同直接 false，还能防止后面的越界），再逐元素比较。注意数组的 == 只比引用，不能用 a == b 判断内容相等；真实项目用 Arrays.equals。' },

    { id: 'ch07-c4', ch: 'ch07', kp: 'ch07-7', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>sumPositive</code>：返回数组中所有正数之和（0 不算）。',
      starter: 'public class Q {\n    static int sumPositive(int[] a) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        int[] a = {1, -2, 3, 0, 5};\n        System.out.println(sumPositive(a));\n    }\n}',
      solution: 'public class Q {\n    static int sumPositive(int[] a) {\n        int sum = 0;\n        for (int i = 0; i < a.length; i++) {\n            if (a[i] > 0) {\n                sum += a[i];\n            }\n        }\n        return sum;\n    }\n    public static void main(String[] args) {\n        int[] a = {1, -2, 3, 0, 5};\n        System.out.println(sumPositive(a));\n    }\n}',
      tests: [
        { args: [], expect: '9' }
      ],
      explain: '遍历 + 条件累加：只有 a[i] > 0 才累加（0 和负数跳过）。测试数组里 1+3+5 = 9。' },

    { id: 'ch07-c5', ch: 'ch07', kp: 'ch07-7', tier: 4, type: 'code', difficulty: 3, tags: ['code'],
      stem: '<b>跨章综合</b>：已有 <code>Student</code> 类（name、score），补全方法 <code>topName</code> 返回分数最高学生的姓名（分数相同取先出现的）。',
      starter: 'class Student {\n    String name;\n    int score;\n    Student(String name, int score) {\n        this.name = name;\n        this.score = score;\n    }\n}\n\npublic class Q {\n    static String topName(Student[] ss) {\n        return "";\n    }\n    public static void main(String[] args) {\n        Student[] ss = {new Student("Ann", 82), new Student("Bob", 95), new Student("Cid", 95)};\n        System.out.println(topName(ss));\n    }\n}',
      solution: 'class Student {\n    String name;\n    int score;\n    Student(String name, int score) {\n        this.name = name;\n        this.score = score;\n    }\n}\n\npublic class Q {\n    static String topName(Student[] ss) {\n        int best = 0;\n        for (int i = 1; i < ss.length; i++) {\n            if (ss[i].score > ss[best].score) {\n                best = i;\n            }\n        }\n        return ss[best].name;\n    }\n    public static void main(String[] args) {\n        Student[] ss = {new Student("Ann", 82), new Student("Bob", 95), new Student("Cid", 95)};\n        System.out.println(topName(ss));\n    }\n}',
      tests: [
        { args: [], expect: 'Bob' }
      ],
      explain: '对象数组 + 字段访问：用 best 记住当前最高分学生的下标，从 i=1 开始比较 ss[i].score > ss[best].score（严格大于，保证并列取先出现的）。返回 ss[best].name。考查类、对象数组、遍历与方法返回值的组合。' },

    { id: 'ch07-n1', ch: 'ch07', kp: 'ch07-8', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '把一个类设计成“不可变对象（immutable）”，通常怎么做？',
      options: [
        { text: '字段全部 private final、构造器里一次赋值、不提供 setter；需要变化时返回新对象', correct: true },
        { text: '把所有字段改成 public static' },
        { text: '每个字段都提供 setter，但加上注释说明不要修改' },
        { text: '把类声明为 abstract' }
      ],
      explain: '不可变对象：所有字段 private final（构造器内一次赋值）、不暴露 setter、类不提供修改自身状态的方法。需要“变化”时方法返回一个**新对象**（如 String 的 toUpperCase）。好处：可安全共享/传参、可当 HashMap 键、多线程天然安全。' },

    { id: 'ch07-n2', ch: 'ch07', kp: 'ch07-8', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '不可变对象最主要的好处是？',
      options: [
        { text: '创建后状态永不改变，可以安全地共享与传参，不怕被偷偷改掉', correct: true },
        { text: '占用内存一定更少' },
        { text: '运行速度一定更快' },
        { text: '可以省略构造器' }
      ],
      explain: '可变对象最大的麻烦是别名：两个引用指向同一对象，一个地方改了，另一个地方“莫名其妙”变了。不可变对象没有这个问题，所以可以放心共享、当常量、当 HashMap 的键。代价是每次“修改”都要创建新对象。' },

    { id: 'ch07-n3', ch: 'ch07', kp: 'ch07-8', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
      stem: '判断：Java 的 String 是不可变类，所以 `s.toUpperCase()` 不会修改 s 本身。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: 'String 不可变：toUpperCase、substring、replace 等操作都**返回新字符串**，原对象不变。所以 `s.toUpperCase();`（不接返回值）等于白做，必须 `s = s.toUpperCase();`。Integer、LocalDate 也是不可变类。' },

    { id: 'ch07-n4', ch: 'ch07', kp: 'ch07-8', tier: 4, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '<b>综合</b>：读下面的不可变类程序，<b>写出完整输出（逐行）</b>。追问：① 为什么 negative 的 seconds 变成 0？② withSeconds 有没有改原对象？③ 最后一行为什么是 false？',
      code: 'final class Song {\n    private final String title;\n    private final int seconds;\n    Song(String title, int seconds) {\n        this.title = title;\n        this.seconds = seconds < 0 ? 0 : seconds;\n    }\n    String getTitle() {\n        return title;\n    }\n    int getSeconds() {\n        return seconds;\n    }\n    Song withSeconds(int s) {\n        return new Song(title, s);\n    }\n    public String toString() {\n        return title + ":" + seconds;\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Song a = new Song("Intro", 30);\n        Song b = new Song("Bad", -5);\n        System.out.println(a);\n        System.out.println(b);\n        Song c = a.withSeconds(45);\n        System.out.println(a);\n        System.out.println(c);\n        System.out.println(a == c);\n    }\n}',
      answer: 'Intro:30\nBad:0\nIntro:30\nIntro:45\nfalse',
      explain: '① 构造器里 `seconds &lt; 0 ? 0 : seconds` 把非法值钳成 0（非法状态在出生时被挡住）→ Bad:0；② withSeconds 返回 `new Song(...)` 新对象，原 a 不变 → 第二次打印 a 仍是 Intro:30；③ c 是长度 45 的新对象 → Intro:45；④ a 与 c 是两个不同对象 → `a == c` 为 false。不可变类的核心：字段 final、修改靠“造新对象”。' },

    { id: 'ch07-n5', ch: 'ch07', kp: 'ch07-9', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '什么叫“假封装”？',
      options: [
        { text: '字段写成了 private + setter，但 setter 里没有任何校验，外部仍能随便改坏对象状态', correct: true },
        { text: '字段是 public 的，但方法很多' },
        { text: '类里同时有 private 和 final 字段' },
        { text: '类没有构造器' }
      ],
      explain: '封装的目的是“守住规则”（年龄非负、余额不透支），不是“把字段藏起来”本身。如果 `setAge(int a) { this.age = a; }` 不校验，外部照样能设成 -5，等于把 public 字段换了个名字。真封装：只暴露必要方法、在方法里校验、能给业务动作（deposit）就不给裸赋值（setBalance）。' },

    { id: 'ch07-n6', ch: 'ch07', kp: 'ch07-9', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '按课程建议，下面哪种类型更适合做成**不可变**对象？',
      options: [
        { text: '表示“值”的类型，如坐标、颜色、金额', correct: true },
        { text: '表示“实体”的类型，如账户、玩家' },
        { text: '需要频繁自增的计数器' },
        { text: '需要保存大量可变状态的游戏角色' }
      ],
      explain: '判断标准：表示“值”（坐标、颜色、金额）→ 不可变更安全（可以随便共享、相等判断直观）；表示“实体”（账户、玩家，有生命周期、会持续变化）→ 通常可变，但必须封装。不可变对象每次“修改”都造新对象，对频繁变化的计数器不合适。' },

    { id: 'ch07-n7', ch: 'ch07', kp: 'ch07-9', tier: 1, type: 'fill', difficulty: 2, tags: ['concept'],
      stem: '填空：判断一个类是不是“太大了”，工程上的依据是单一职责——看能不能用一句话说清它负责什么；如果这句话里出现了“和”，通常就该 `_____`（两个字）。',
      answer: ['拆分', '拆', '分拆'],
      explain: '单一职责原则：一个类只负责一件事。判断句里出现“和”（如“负责学生信息和成绩计算和导出”）就说明职责过多，应该拆分。反例是“上帝类”（Manager 类）：字段几十个、方法上百行，改一处可能碰坏另一处。' },

    { id: 'ch07-n8', ch: 'ch07', kp: 'ch07-9', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '关于“类该多大”，下列做法最符合工程实践的是？',
      options: [
        { text: '先写能跑的最小版本，再按职责重构；不为了“用类”而过度拆分', correct: true },
        { text: '一开始就把每个方法都拆成一个类' },
        { text: '所有功能都放进一个 Manager 类，方便查找' },
        { text: '类越少越好，最好整个程序只有一个类' }
      ],
      explain: '设计是迭代出来的：先写职责清楚的最小版本，发现“改一个需求要动很多地方”时再按职责拆。过度设计（每个方法一个类）和上帝类都是极端。判断标准：改一个需求要动几个地方。' },

    { id: 'ch07-n9', ch: 'ch07', kp: 'ch07-9', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '为什么说“给业务动作（deposit）比给裸赋值（setBalance）更好”？',
      options: [
        { text: '业务动作内部能完成校验与账务逻辑，裸赋值把规则暴露给外部、容易被绕过', correct: true },
        { text: '因为 deposit 这个单词更短' },
        { text: '因为 setBalance 不能编译' },
        { text: '两者完全等价' }
      ],
      explain: '`deposit(amount)` 可以在方法里检查金额正负、更新余额、记录流水；而 `setBalance(x)` 允许外部跳过所有规则直接改状态。封装的价值在于“只暴露有语义的业务动作”，让对象自己守规则。看到 set 开头的方法应该问：这个赋值真的需要公开吗？' },

    { id: 'ch07-n10', ch: 'ch07', kp: 'ch07-9', tier: 1, type: 'tf', difficulty: 2, tags: ['concept'],
      stem: '判断：为了“用类”就必须把每个功能都拆成单独的类，类越多越好。',
      options: [
        { text: '正确（True）' },
        { text: '错误（False）', correct: true }
      ],
      explain: '不是类越多越好。几十行的课程作业里，一个职责清楚的类就够；真正的判断标准是“改一个需求要动几个地方”。动的地方越多说明边界画错，这时再拆。设计是迭代出来的，先写最小可运行版本，再按职责重构。' },

    { id: 'ch07-d1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '用“平行数组”存学生信息（names[]、ids[]、scores[]）的主要缺点是？',
      options: [
        { text: '增删学生要同时改三个数组，下标容易错位；数据与操作分离、难以维护', correct: true },
        { text: '平行数组不能存字符串' },
        { text: '平行数组占用内存是普通数组的三倍' },
        { text: 'Java 不允许声明多个数组' }
      ],
      explain: '平行数组靠“相同下标对应同一个人”来关联数据：一旦某个数组增删元素，其他数组必须同步，极易错位；而且“学生”这个整体没有对应的类型，无法封装行为。改成 Student 类对象数组后，数据和操作都在一处。' },

    { id: 'ch07-d2', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '构造器重载 `Point()` 与 `Point(int x, int y)` 同时存在时，`new Point(3)` 会怎样？',
      options: [
        { text: '编译错误：没有匹配 Point(int) 的构造器', correct: true },
        { text: '自动调用 Point()' },
        { text: '自动调用 Point(3, 0)' },
        { text: '运行时抛异常' }
      ],
      explain: '重载构造器按参数个数/类型匹配：`new Point(3)` 只给一个 int，没有 `Point(int)` 构造器 → 编译错误（cannot find symbol / no suitable constructor）。要么写 `new Point(3, 0)`，要么补一个 `Point(int x)` 构造器。' },

    { id: 'ch07-d3', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '以下哪种写法**没有**真正实现封装？',
      options: [
        { text: '字段 private，但 setter 直接赋值、不做任何校验', correct: true },
        { text: '字段 private + getter，外部只读' },
        { text: '字段 private + setter 里校验范围后再赋值' },
        { text: '外部修改走 deposit 这类业务方法，方法内部更新字段' }
      ],
      explain: '封装的目的是“守住规则”。如果 setter 只是 `this.field = v;`，外部照样能设非法值，等于把 public 字段换了个名字（假封装）。真封装：只暴露必要方法、在方法内校验、能用业务动作就不用裸赋值。注意本题正确选项是 A。' },

    { id: 'ch07-d4', ch: 'ch07', kp: 'ch07-8', tier: 1, type: 'fill', difficulty: 2, tags: ['concept'],
      stem: '填空：不可变对象的字段通常声明为 `private final`，其中 `_____` 关键字保证字段只在构造器里赋值一次、之后不能修改。',
      answer: ['final'],
      explain: 'final 修饰字段：必须在声明处或构造器里赋值一次，之后不能被重新赋值（编译错误）。配合 private（外部看不到）与不提供 setter，对象创建后状态就固定了——这就是不可变对象的实现基础。' },

    /* ============================================================ ch08 继承、多态与抽象类 */
    { id: 'ch08-q1', ch: 'ch08', kp: 'ch08-2', tier: 2, type: 'predict', difficulty: 2, tags: ['output', 'trap', 'exam'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'class Animal {\n    String name() { return "animal"; }\n}\nclass Dog extends Animal {\n    String name() { return "dog"; }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Animal a = new Dog();\n        System.out.println(a.name());\n        System.out.println(a instanceof Dog);\n    }\n}',
      answer: 'dog\ntrue',
      explain: '`Animal a = new Dog();` 编译期类型是 Animal，运行期实际对象是 Dog。调用 a.name() 时按**对象实际类型**动态派发，执行 Dog 的 name() → dog。instanceof 在运行时判断对象真实类型，a 确实是 Dog → true。' },

    { id: 'ch08-q2', ch: 'ch08', kp: 'ch08-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept', 'exam'],
      stem: '关于抽象类（abstract class），下列说法正确的是？',
      options: [
        { text: '抽象类不能有构造器' },
        { text: '抽象类不能直接 new，但可以有构造器供子类通过 super() 调用', correct: true },
        { text: '抽象类里的所有方法都必须是抽象方法' },
        { text: '抽象类必须用 final 修饰' }
      ],
      explain: '抽象类不能被实例化（不能直接 new），但可以有构造器——子类构造时通过 super() 调用它初始化父类部分。抽象类里可以同时有已实现方法和抽象方法。另外 final 和 abstract 互斥：final 类不允许被继承，抽象类本来就是为了被继承。' },

    { id: 'ch08-q3', ch: 'ch08', kp: 'ch08-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '“一个 Car is-a Vehicle”与“一个 Car has-a Engine”分别对应面向对象里的什么关系？',
      options: [
        { text: '两者都用继承' },
        { text: 'is-a 用继承（extends），has-a 用组合（字段引用另一个对象）', correct: true },
        { text: 'is-a 用组合，has-a 用继承' },
        { text: '两者都用组合' }
      ],
      explain: 'is-a（是一种）→ 继承：Car extends Vehicle；has-a（有一个）→ 组合：Car 里放一个 Engine 类型的字段。把 has-a 写成 extends 是常见设计错误（“车继承发动机”显然不对），会让继承层次混乱、耦合过强。' },

    { id: 'ch08-q4', ch: 'ch08', kp: 'ch08-3', tier: 2, type: 'tf', difficulty: 2, tags: ['trap'],
      stem: '判断：子类重写（override）父类方法时，方法名和参数列表必须相同，返回类型可以随便改成任何类型。',
      options: [
        { text: '正确（True）' },
        { text: '错误（False）', correct: true }
      ],
      explain: '重写要求方法名 + 参数列表完全相同，返回类型必须**兼容**（相同，或是父类返回类型的子类型），访问权限不能比父类更严格。如果返回类型随意改（比如改成 int），那就不是重写，而是另一个方法；父类引用调用时根本用不到它。' },

    { id: 'ch08-q5', ch: 'ch08', kp: 'ch08-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['output', 'exam'],
      stem: '下面程序输出什么？',
      code: 'class A {\n    void f() { System.out.print("A"); }\n}\nclass B extends A {\n    void f() { System.out.print("B"); }\n}\nA x = new B();\nx.f();',
      options: [
        { text: 'A' },
        { text: 'B', correct: true },
        { text: 'AB' },
        { text: '编译错误' }
      ],
      explain: '多态的两步：编译期看引用类型 A——A 里有 f()，所以能通过编译；运行期看对象实际类型 B——动态派发到 B.f()，输出 B。如果 B 里没有重写 f，才会执行继承来的 A.f。' },

    { id: 'ch08-q6', ch: 'ch08', kp: 'ch08-1', tier: 1, type: 'fill', difficulty: 1, tags: ['syntax'],
      stem: '填空：Java 中用 `class Dog _____ Animal` 表示 Dog 继承 Animal。',
      answer: 'extends',
      explain: '继承用 extends（“扩展”）：子类获得父类的字段和方法（private 的不能直接访问）。Java 只支持单继承——一个类只能 extends 一个父类，多继承用接口实现。' },

    { id: 'ch08-q7', ch: 'ch08', kp: 'ch08-3', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
      stem: '关于方法重写（override），下列哪些说法是正确的？（多选）',
      options: [
        { text: '子类重写方法的访问权限不能比父类更严格', correct: true },
        { text: '父类的 static 方法在子类里写一个同名方法，就构成重写' },
        { text: '加上 @Override 注解可以让编译器检查是否真的构成重写', correct: true },
        { text: '子类可以用 super.method() 调用父类被重写的方法', correct: true }
      ],
      explain: '重写规则：签名相同、返回类型兼容、访问权限不能更窄。@Override 是好习惯——拼错方法名或参数类型时编译器会立刻报错。static 方法属于类、不参与动态派发，子类写同名 static 方法是“隐藏（hiding）”而不是重写。' },

    { id: 'ch08-q8', ch: 'ch08', kp: 'ch08-1', tier: 2, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '写出下面程序输出的一行字符（不要空格）。',
      code: 'class A {\n    A() { System.out.print("A"); }\n}\nclass B extends A {\n    B() {\n        super();\n        System.out.print("B");\n    }\n}\nclass C extends B {\n    C() { System.out.print("C"); }\n}\npublic class Q {\n    public static void main(String[] args) {\n        new C();\n    }\n}',
      answer: 'ABC',
      explain: 'new C() 时，构造器链自顶向下执行：C 的构造器第一件事是调用 super()（B 的构造器）→ B 又先调用 super()（A 的构造器）→ A 打印 A → 回到 B 打印 B → 回到 C 打印 C。所以输出 ABC。注意：即使不写 super()，编译器也会自动插入对父类无参构造器的调用。' },

    { id: 'ch08-q9', ch: 'ch08', kp: 'ch08-2', tier: 2, type: 'mcq', difficulty: 3, tags: ['trap', 'exam'],
      stem: '已知 `class Dog extends Animal`、`Animal a = new Dog();`，执行 `Dog d = (Dog) a;` 会怎样？',
      options: [
        { text: '编译错误：父类引用不能转成子类引用' },
        { text: '运行期转换成功，因为 a 实际指向一个 Dog 对象', correct: true },
        { text: '一定抛 ClassCastException' },
        { text: '编译通过但 d 是 null' }
      ],
      explain: '把父类引用赋给子类变量叫向下转型（downcast），必须显式写 (Dog) 强转，编译通过。运行时 JVM 检查对象的**实际类型**：a 确实指向 Dog，转换成功。若 a 实际指向 Cat，则抛 ClassCastException——所以转型前通常先用 instanceof 判断。' },

    { id: 'ch08-k1', ch: 'ch08', kp: 'ch08-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '关于 Java 接口（interface），下列说法正确的是？',
      options: [
        { text: '接口定义一组方法签名；类用 implements 实现接口，且一个类可以实现多个接口', correct: true },
        { text: '接口和类一样用 extends 实现，一个类只能实现一个接口' },
        { text: '接口里的方法必须有方法体' },
        { text: '接口可以直接用 new 创建实例' }
      ],
      explain: '接口只描述“能做什么”（方法签名），不关心怎么做；类用 `implements` 实现接口，并且**可以同时实现多个接口**，弥补 Java 单继承的限制。接口不能 new（没有构造器）；接口里的方法默认是 public abstract（没有方法体）。接口常用来定义 ADT：例如 `List` 接口可以有 ArrayList、LinkedList 两种实现。' },

    { id: 'ch08-k2', ch: 'ch08', kp: 'ch08-6', tier: 1, type: 'fill', difficulty: 1, tags: ['syntax'],
      stem: '填空：Java 中类实现接口用关键字 `extends` / `implements` / `abstract` 中的哪一个？（填关键字）',
      answer: 'implements',
      explain: '类**继承**类用 extends（单继承），类**实现**接口用 implements（可多个），抽象类用 abstract 声明。可以说：extends 是“是不是一种”，implements 是“能不能做这件事”。' },

    { id: 'ch08-k3', ch: 'ch08', kp: 'ch08-7', tier: 2, type: 'mcq', difficulty: 3, tags: ['concept'],
      stem: '“模板方法（template method）”模式最典型的写法是？',
      options: [
        { text: '父类把算法骨架写在一个 final 方法里，中间步骤调用抽象方法，由子类实现这些步骤', correct: true },
        { text: '子类直接复制父类的方法体，再改几行' },
        { text: '每个子类各自写一个 main 方法' },
        { text: '把父类所有方法都声明为 static' }
      ],
      explain: '模板方法把“不变的流程”放在父类（如 `run()` 里依次调用 setup → execute → cleanup），把“可变的步骤”声明为 abstract 交给子类。这样流程只写一次，子类只填变化的部分，体现继承的价值。它与组合的取舍是：流程骨架稳定、子类关系明确 → 继承/模板方法；只是“有一个”部件、关系可能变化 → 组合（字段引用另一个对象）。' },

    { id: 'ch08-k4', ch: 'ch08', kp: 'ch08-7', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
      stem: '关于“继承 vs 组合”，下列哪些说法是正确的？（多选）',
      options: [
        { text: '“Car is-a Vehicle”适合用继承（extends）', correct: true },
        { text: '“Car has-a Engine”适合用组合（把 Engine 作为字段）', correct: true },
        { text: '只要两个类有重复代码，就一定要用继承消除' },
        { text: '组合让对象之间的关系能在运行时替换，耦合通常比继承弱', correct: true }
      ],
      explain: 'is-a → 继承，has-a → 组合。看到重复代码不一定用继承：如果两个类只是“共用一段实现”，更该抽成工具方法或组合；滥用继承会让子类被迫接受父类的全部接口、层次难改。组合通过字段持有对象，可以在运行时换实现（比如换 Engine 型号），耦合更低。设计原则：优先组合，继承只在确实“是一种”时用。' },

    { id: 'ch08-f1', ch: 'ch08', kp: 'ch08-2', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '下面程序编译报错（@Override 检查不通过）。指出哪一行有问题并改正。',
      code: 'class Animal {\n    String sound() {\n        return "...";\n    }\n}\nclass Dog extends Animal {\n    @Override\n    String sound(int n) {\n        return "woof";\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Animal a = new Dog();\n        System.out.println(a.sound());\n    }\n}',
      answer: '第 7 行：`String sound(int n)` 的参数列表与父类 `sound()` 不同，不构成重写（只是重载）；应去掉参数 `int n`，写成 `String sound()`',
      accept: [
        { hint: '指出行号（第 7 行）', any: ['第7行', '第 7 行', '7行', '行7', 'line7'] },
        { hint: '去掉参数，让签名与父类一致（`sound()`）', any: ['去掉参数', '删除参数', 'sound()', '参数列表一致', '没有参数'] }
      ],
      fix: 'class Animal {\n    String sound() {\n        return "...";\n    }\n}\nclass Dog extends Animal {\n    @Override\n    String sound() {\n        return "woof";\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Animal a = new Dog();\n        System.out.println(a.sound());\n    }\n}',
      explain: 'javac 报 `method does not override or implement a method from a supertype`。重写（override）要求方法名**和参数列表**都相同；加了 `int n` 就是另一个方法（重载），父类引用 `a.sound()` 根本调不到它。@Override 注解的价值就在这：签名写错时编译期立刻报错，而不是运行时“怎么没生效”。' },

    { id: 'ch08-f2', ch: 'ch08', kp: 'ch08-1', tier: 2, type: 'fill', mode: 'findbug', difficulty: 3, tags: ['bug'],
      stem: '下面程序编译报错。指出哪一行有问题并改正。',
      code: 'class Animal {\n    Animal(String name) {\n        System.out.println("animal " + name);\n    }\n}\nclass Dog extends Animal {\n    Dog() {\n        System.out.println("dog");\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        new Dog();\n    }\n}',
      answer: '第 7 行：Dog 的构造器会隐式调用父类无参构造器，但 Animal 只定义了带参构造器；应在 Dog() 第一行写 `super("dog");`',
      accept: [
        { hint: '指出行号（第 7 行）', any: ['第7行', '第 7 行', '7行', '行7', 'line7'] },
        { hint: '在子类构造器第一行显式调用 `super(...)`（带参数）', any: ['super("dog")', 'super(', '调用super', '显式super', 'super带参数'] }
      ],
      fix: 'class Animal {\n    Animal(String name) {\n        System.out.println("animal " + name);\n    }\n}\nclass Dog extends Animal {\n    Dog() {\n        super("dog");\n        System.out.println("dog");\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        new Dog();\n    }\n}',
      explain: 'javac 报 `constructor Animal in class Animal cannot be applied to given types`。子类构造器的第一条语句默认是 `super()`（父类无参构造器）；一旦父类只写了带参构造器，默认无参构造器就**不再自动生成**，子类必须显式调用 `super(...)`。这是“写了带参构造器就失去了无参构造器”的连锁反应。' },

    { id: 'ch08-p1', ch: 'ch08', kp: 'ch08-3', tier: 4, type: 'predict', difficulty: 3, tags: ['output', 'trap'],
      stem: '读下面的程序，<b>写出完整输出（逐行，注意构造器的打印顺序）</b>。追问：① `new Animal()` 为什么先打印 A1 再打印 A0？② `d.toString()` 里调用的 sound() 是哪个类的方法？③ 数组初始化时那两次 new 的打印出现在哪一行？',
      code: 'class Animal {\n    String name;\n    Animal() {\n        this("animal");\n        System.out.print("A0 ");\n    }\n    Animal(String name) {\n        this.name = name;\n        System.out.print("A1 ");\n    }\n    String sound() {\n        return "...";\n    }\n    public String toString() {\n        return name + ":" + sound();\n    }\n}\nclass Dog extends Animal {\n    int legs;\n    Dog() {\n        super("dog");\n        legs = 4;\n        System.out.print("D0 ");\n    }\n    String sound() {\n        return "woof";\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Animal a = new Animal();\n        System.out.println();\n        Dog d = new Dog();\n        System.out.println();\n        System.out.println(d.toString());\n        Animal x = d;\n        System.out.println(x.sound());\n        System.out.println(x instanceof Dog);\n        Animal[] zoo = {new Animal("cat"), new Dog()};\n        for (Animal an : zoo) {\n            System.out.print(an + " | ");\n        }\n        System.out.println();\n    }\n}',
      answer: 'A1 A0\nA1 D0\ndog:woof\nwoof\ntrue\nA1 A1 D0 cat:... | dog:woof |',
      explain: '① `new Animal()` 的构造器第一行 `this("animal")` 先调用另一个构造器（打印 A1），返回后再打印 A0 → 第 1 行 `A1 A0 `；② `new Dog()` 的构造器先 `super("dog")` 调父类带参构造器（打印 A1），再执行 Dog 自己的语句（打印 D0）→ 第 2 行 `A1 D0 `；③ d.toString() 中 name="dog"，sound() 动态派发到 Dog.sound()="woof" → `dog:woof`；④ x 声明类型 Animal、实际对象 Dog → x.sound() 走多态 → `woof`；⑤ instanceof 判断实际类型 → `true`；⑥ `Animal[] zoo = {new Animal("cat"), new Dog()}` 在初始化数组时先执行两个构造器，打印 `A1 ` 和 `A1 D0 `（共 `A1 A1 D0 `），然后循环打印每个元素：`cat:... | dog:woof | `。所以最后一行是 `A1 A1 D0 cat:... | dog:woof | `。' },

    { id: 'ch08-t1', ch: 'ch08', kp: 'ch08-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '关于抽象类，下列说法正确的是？',
      options: [
        { text: '抽象类不能直接 new，但可以有构造器供子类调用', correct: true },
        { text: '抽象类里的所有方法都必须是抽象方法' },
        { text: '抽象类不能有字段' },
        { text: '抽象类必须声明为 final' }
      ],
      explain: '抽象类用 abstract 声明，**不能直接实例化**（不能 new），但可以有构造器（供子类 super() 调用）、字段、已实现方法，也可以有抽象方法。抽象类与 final 互斥：final 类不能被继承，而抽象类天生是为了被继承。' },

    { id: 'ch08-t2', ch: 'ch08', kp: 'ch08-4', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
      stem: '填空：`Animal a = new Dog();` 中，变量 a 的**声明类型**是 Animal，而**实际类型**是_____（填类名）。',
      answer: ['Dog', 'dog'],
      explain: '`Animal a = new Dog();` 是向上转型：声明类型 Animal（编译期看它），实际类型 Dog（运行期看它）。调用被重写的方法时按**实际类型**动态派发；调用字段/未重写方法时按声明类型。instanceof 判断的也是实际类型。' },

    { id: 'ch08-t3', ch: 'ch08', kp: 'ch08-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: '类 `Square` 要实现接口 `Shape`，正确的写法是？',
      options: [
        { text: '`class Square implements Shape`', correct: true },
        { text: '`class Square extends Shape`' },
        { text: '`class Square implements Shape, Object`' },
        { text: '`interface Square implements Shape`' }
      ],
      explain: '类实现接口用 `implements`（可以同时实现多个，逗号分隔）；类继承类才用 extends（单继承）。接口只能 extends 其他接口（接口多继承）。所以 `class Square implements Shape` 正确。实现接口后必须提供接口中所有抽象方法的方法体。' },

    { id: 'ch08-t4', ch: 'ch08', kp: 'ch08-7', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
      stem: '判断：“Car has-a Engine”（车有一个发动机）适合用组合实现：在 Car 里放一个 Engine 类型的字段。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: 'has-a（有一个部件）用**组合**：`class Car { Engine engine; }`。is-a（是一种）才用继承：`class Car extends Vehicle`。把 has-a 写成 extends（车继承发动机）是典型的设计错误，会让继承层次混乱、耦合过强。设计原则：优先组合，确实“是一种”时才继承。' },

    { id: 'ch08-t5', ch: 'ch08', kp: 'ch08-4', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序的完整输出（逐行）。追问：为什么 `b instanceof Cat` 是 false？',
      code: 'class Animal {\n    String name() {\n        return "animal";\n    }\n}\nclass Cat extends Animal {\n    String name() {\n        return "cat";\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Animal a = new Cat();\n        System.out.println(a.name());\n        System.out.println(a instanceof Cat);\n        System.out.println(a instanceof Animal);\n        Animal b = new Animal();\n        System.out.println(b instanceof Cat);\n        if (a instanceof Cat) {\n            Cat c = (Cat) a;\n            System.out.println(c.name());\n        }\n    }\n}',
      answer: 'cat\ntrue\ntrue\nfalse\ncat',
      explain: '① a 的实际类型是 Cat → a.name() 动态派发到 Cat → cat；② instanceof 判断**实际类型**：a 是 Cat → true、也是 Animal → true；③ b 是纯 Animal 对象，不是 Cat → false；④ `(Cat) a` 向下转型成功（a 实际是 Cat），转完调 name 仍是 cat。若 a 实际是 Animal 却强转 Cat，会抛 ClassCastException，所以转型前先用 instanceof 判断。' },

    { id: 'ch08-t6', ch: 'ch08', kp: 'ch08-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '一个类声明为 `abstract class A` 且含 `abstract void f();`，下面哪句话正确？',
      options: [
        { text: 'A 不能直接 new；子类必须实现 f()（除非子类也是抽象类）', correct: true },
        { text: 'A 可以直接 new，但 f() 不能被调用' },
        { text: 'A 的子类可以不实现 f() 也能 new' },
        { text: '抽象方法 f() 必须有方法体' }
      ],
      explain: '抽象方法只有签名没有方法体（`abstract void f();`），所在类必须声明为 abstract。抽象类不能被实例化；普通子类继承它必须实现所有抽象方法，否则子类也得声明为 abstract。这就是“抽象类定义规范、子类补实现”的模板。' },

    { id: 'ch08-f3', ch: 'ch08', kp: 'ch08-6', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '下面程序无法编译。指出缺少什么、在哪补，使 Square 正确实现接口 Shape。',
      code: 'interface Shape {\n    double area();\n}\nclass Square implements Shape {\n    double side;\n    Square(double side) {\n        this.side = side;\n    }\n    double perimeter() {\n        return 4 * side;\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Square s = new Square(3);\n        System.out.println(s.area());\n        System.out.println(s.perimeter());\n    }\n}',
      answer: 'Square 实现了 Shape，但没有实现接口里的 `double area()`。应在 Square 类里补 `double area() { return side * side; }`',
      accept: [
        { hint: '指出 Square 缺少对接口方法 area() 的实现', any: ['area', '接口方法', '未实现', '没有实现', '缺少实现'] },
        { hint: '补上 `double area() { return side * side; }`（返回边长的平方）', any: ['side*side', 'side * side', '返回边长平方', '补area', '实现area'] }
      ],
      fix: 'interface Shape {\n    double area();\n}\nclass Square implements Shape {\n    double side;\n    Square(double side) {\n        this.side = side;\n    }\n    public double area() {\n        return side * side;\n    }\n    double perimeter() {\n        return 4 * side;\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Square s = new Square(3);\n        System.out.println(s.area());\n        System.out.println(s.perimeter());\n    }\n}',
      explain: 'javac 报 `Square is not abstract and does not override abstract method area() in Shape`。类 implements 接口后，必须提供接口中所有方法的实现；否则该类也必须声明为 abstract。修法：在 Square 里补 `double area() { return side * side; }`（注意接口方法隐式 public，实现时访问权限不能更小）。' },

    { id: 'ch08-t8', ch: 'ch08', kp: 'ch08-3', tier: 2, type: 'predict', difficulty: 3, tags: ['output', 'trap'],
      stem: '写出下面程序的完整输出（逐行）。追问：为什么 b.v 打印 1 而 b.getV() 打印 2？',
      code: 'class Base {\n    int v = 1;\n    String who() {\n        return "base";\n    }\n    int getV() {\n        return v;\n    }\n}\nclass Child extends Base {\n    int v = 2;\n    String who() {\n        return "child";\n    }\n    int getV() {\n        return v;\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Base b = new Child();\n        System.out.println(b.who());\n        System.out.println(b.v);\n        System.out.println(b.getV());\n        System.out.println(((Child) b).v);\n    }\n}',
      answer: 'child\n1\n2\n2',
      explain: '① `b.who()` 是方法调用，按对象**实际类型** Child 动态派发 → child；② `b.v` 是字段访问，按变量**声明类型** Base 解析 → 1；③ `b.getV()` 是方法调用，Child 重写了它，返回 Child 的 v=2；④ 强转成 Child 后访问字段 → 2。结论：**方法看实际类型，字段看声明类型**——这是期末读程序的高频陷阱。' },

    { id: 'ch08-t9', ch: 'ch08', kp: 'ch08-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '“模板方法”模式中，父类通常怎么写？',
      options: [
        { text: '父类在普通方法里写算法骨架（固定流程），把可变步骤声明为抽象方法交给子类', correct: true },
        { text: '父类把所有方法都写成 abstract，子类各写各的' },
        { text: '父类用 static 方法包办一切' },
        { text: '父类不写任何方法，只声明字段' }
      ],
      explain: '模板方法把“不变的流程”放父类（如 run() 依次调用 setup→execute→cleanup），把“会变的步骤”声明为 abstract 让子类实现。这样流程只写一次，子类只填差异部分——这正是继承的最大价值。若父类全抽象就退化成接口，没有复用。' },

    { id: 'ch08-t10', ch: 'ch08', kp: 'ch08-1', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '`new Dog()` 且 Dog 继承 Animal、Animal 与 Dog 都有构造器时，构造器的执行顺序是？',
      options: [
        { text: '先 Animal 构造器（子类构造器里隐式 super()），再 Dog 构造器', correct: true },
        { text: '先 Dog 构造器，再 Animal 构造器' },
        { text: '只执行 Dog 构造器' },
        { text: '两者随机顺序' }
      ],
      explain: '子类构造器的第一条语句默认是 `super()`（调用父类无参构造器），所以顺序是“父类先初始化完，再执行子类自己的构造器语句”。如果父类没有无参构造器，子类必须显式写 `super(参数)`。构造器链自顶向下、逐层执行。' },

    { id: 'ch08-c1', ch: 'ch08', kp: 'ch08-4', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>countCats</code>：统计 Animal 数组里 Cat 对象的个数（用 instanceof 判断）。<br>已给出类定义与测试入口，不要修改 <code>main</code>。',
      starter: 'class Animal {\n}\nclass Cat extends Animal {\n}\nclass Dog extends Animal {\n}\npublic class Q {\n    static int countCats(Animal[] zoo) {\n        // TODO: 统计数组里 Cat 对象的个数（用 instanceof 判断）\n        return 0;\n    }\n    public static void main(String[] args) {\n        String pattern = args[0];\n        Animal[] zoo = new Animal[pattern.length()];\n        for (int i = 0; i < pattern.length(); i++) {\n            if (pattern.charAt(i) == \'C\') {\n                zoo[i] = new Cat();\n            } else {\n                zoo[i] = new Dog();\n            }\n        }\n        System.out.println(countCats(zoo));\n    }\n}',
      solution: 'class Animal {\n}\nclass Cat extends Animal {\n}\nclass Dog extends Animal {\n}\npublic class Q {\n    static int countCats(Animal[] zoo) {\n        int count = 0;\n        for (int i = 0; i < zoo.length; i++) {\n            if (zoo[i] instanceof Cat) {\n                count++;\n            }\n        }\n        return count;\n    }\n    public static void main(String[] args) {\n        String pattern = args[0];\n        Animal[] zoo = new Animal[pattern.length()];\n        for (int i = 0; i < pattern.length(); i++) {\n            if (pattern.charAt(i) == \'C\') {\n                zoo[i] = new Cat();\n            } else {\n                zoo[i] = new Dog();\n            }\n        }\n        System.out.println(countCats(zoo));\n    }\n}',
      tests: [
        { args: ['CDCC'], expect: '3' },
        { args: ['DDD'], expect: '0' }
      ],
      explain: '遍历数组，`zoo[i] instanceof Cat` 为真就 count++。instanceof 判断的是**运行时实际类型**：Cat 对象也 instanceof Animal，所以判断 Cat 一定要写 Cat。测试用 "CDCC"（3 只 Cat）与 "DDD"（0 只）验证。' },

    { id: 'ch08-p2', ch: 'ch08', kp: 'ch08-5', tier: 4, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '读下面的抽象类与多态程序，<b>写出完整输出（逐行）</b>。追问：① 两个形状的面积分别是多少？② `shapes[0]` 打印时调用了什么方法？③ area2() 为什么能复用 area()？',
      code: 'abstract class Shape {\n    String name;\n    Shape(String name) {\n        this.name = name;\n    }\n    abstract double area();\n    double area2() {\n        return area() * 2;\n    }\n    public String toString() {\n        return name + ":" + area();\n    }\n}\nclass Rect extends Shape {\n    double w, h;\n    Rect(double w, double h) {\n        super("rect");\n        this.w = w;\n        this.h = h;\n    }\n    double area() {\n        return w * h;\n    }\n}\nclass Circle extends Shape {\n    double r;\n    Circle(double r) {\n        super("circle");\n        this.r = r;\n    }\n    double area() {\n        return 3 * r * r;\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Shape[] shapes = {new Rect(2, 3), new Circle(2)};\n        double total = 0;\n        for (int i = 0; i < shapes.length; i++) {\n            total += shapes[i].area();\n        }\n        System.out.println(total);\n        System.out.println(shapes[0]);\n        System.out.println(shapes[1].area2());\n        for (Shape s : shapes) {\n            System.out.print(s.name + " ");\n        }\n        System.out.println();\n    }\n}',
      answer: '18.0\nrect:6.0\n24.0\nrect circle',
      explain: '① Rect.area() = 2×3 = 6.0，Circle.area() = 3×2×2 = 12.0，total = 18.0；② println(shapes[0]) 自动调用 toString()，其中 area() 动态派发到 Rect → `rect:6.0`；③ area2() 是父类的普通方法，内部调用抽象方法 area()，运行期按实际类型派发 → Circle 的 area2() = 12×2 = 24.0；④ 遍历打印 name 字段：rect、circle。抽象类 + 多态 + 模板方法的综合体。' },

    { id: 'ch08-c2', ch: 'ch08', kp: 'ch08-1', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>countAbove</code>：返回数组中大于 t 的元素个数。',
      starter: 'public class Q {\n    static int countAbove(int[] a, int t) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 5, 3, 8};\n        int t = Integer.parseInt(args[0]);\n        System.out.println(countAbove(a, t));\n    }\n}',
      solution: 'public class Q {\n    static int countAbove(int[] a, int t) {\n        int n = 0;\n        for (int i = 0; i < a.length; i++) {\n            if (a[i] > t) {\n                n++;\n            }\n        }\n        return n;\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 5, 3, 8};\n        int t = Integer.parseInt(args[0]);\n        System.out.println(countAbove(a, t));\n    }\n}',
      tests: [
        { args: ['2'], expect: '3' },
        { args: ['8'], expect: '0' },
        { args: ['0'], expect: '4' }
      ],
      explain: '遍历 + 计数：a[i] > t 时 n++。注意 t=8 时没有元素大于 8 → 0；t=0 时所有元素都大于 0 → 4。边界值要能正确判断。' },

    { id: 'ch08-c3', ch: 'ch08', kp: 'ch08-3', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>runningSum</code>：返回一个新数组，其中第 i 个元素是原数组前 i+1 个元素之和（前缀和）。',
      starter: 'public class Q {\n    static int[] runningSum(int[] a) {\n        return new int[0];\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        System.out.println(java.util.Arrays.toString(runningSum(a)));\n    }\n}',
      solution: 'public class Q {\n    static int[] runningSum(int[] a) {\n        int[] out = new int[a.length];\n        int acc = 0;\n        for (int i = 0; i < a.length; i++) {\n            acc += a[i];\n            out[i] = acc;\n        }\n        return out;\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        System.out.println(java.util.Arrays.toString(runningSum(a)));\n    }\n}',
      tests: [
        { args: [], expect: '[1, 3, 6]' }
      ],
      explain: '前缀和：维护累加器 acc，每轮加入 a[i] 后写入 out[i]。输出用 Arrays.toString 显示 `[1, 3, 6]`。返回新数组而不是修改原数组，是更干净的写法。' },

    { id: 'ch08-c4', ch: 'ch08', kp: 'ch08-4', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>findMax</code>：返回二维数组中的最大元素（约定数组非空）。',
      starter: 'public class Q {\n    static int findMax(int[][] m) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        int[][] m = {{3, 8}, {1, 0, 5}};\n        System.out.println(findMax(m));\n    }\n}',
      solution: 'public class Q {\n    static int findMax(int[][] m) {\n        int max = m[0][0];\n        for (int i = 0; i < m.length; i++) {\n            for (int j = 0; j < m[i].length; j++) {\n                if (m[i][j] > max) {\n                    max = m[i][j];\n                }\n            }\n        }\n        return max;\n    }\n    public static void main(String[] args) {\n        int[][] m = {{3, 8}, {1, 0, 5}};\n        System.out.println(findMax(m));\n    }\n}',
      tests: [
        { args: [], expect: '8' }
      ],
      explain: '二维遍历：外层 m.length 行、内层 m[i].length 列。最大值初值取 m[0][0] 而不是 0（全负矩阵时 0 会错）。注意每行长度可以不同（锯齿数组），所以内层用 m[i].length。' },

    { id: 'ch08-n1', ch: 'ch08', kp: 'ch08-8', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '“Dog is-a Animal”与“Car has-a Engine”分别应该用什么实现？',
      options: [
        { text: 'is-a 用继承（extends），has-a 用组合（字段引用另一个对象）', correct: true },
        { text: '两者都用继承' },
        { text: 'is-a 用组合，has-a 用继承' },
        { text: '两者都用接口' }
      ],
      explain: 'is-a（是一种）→ 继承：Dog extends Animal；has-a（有一个）→ 组合：Car 里放一个 Engine 字段。判断依据是“依赖的是‘是一种’还是‘有一个’”。把 has-a 写成 extends 是经典设计错误（车继承发动机）。' },

    { id: 'ch08-n2', ch: 'ch08', kp: 'ch08-8', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '为什么“让 Stack 继承 ArrayList”是不好的设计？',
      options: [
        { text: 'Stack 会白得 add/remove 等方法，栈“只能从顶进出”的语义被破坏', correct: true },
        { text: '因为 ArrayList 不是 abstract 类' },
        { text: '因为 Java 不允许继承集合类' },
        { text: '因为 Stack 应该是 interface' }
      ],
      explain: '继承是强耦合：子类会继承父类的全部公开接口。Stack 继承 ArrayList 后，外部可以直接 `stack.add(0, x)` 从底部插入，栈的语义就失效了。正确做法是**组合**：内部持有一个 list，只暴露 push/pop/peek。' },

    { id: 'ch08-n3', ch: 'ch08', kp: 'ch08-8', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
      stem: '填空：设计原则 “Favor composition over _____” 的意思是优先用组合而不是继承。',
      answer: ['inheritance', 'Inheritance'],
      explain: '“组合优先于继承”（favor composition over inheritance）：先问 has-a 能不能解决，确实需要 is-a 且父类是为继承设计的（有文档、有钩子方法），再考虑 extends。组合让对象关系能在运行时替换、耦合更低。' },

    { id: 'ch08-n4', ch: 'ch08', kp: 'ch08-8', tier: 4, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '<b>综合</b>：读下面的组合（has-a）程序，<b>写出完整输出（逐行）</b>。追问：① Car 与 Engine 是什么关系？② 为什么两辆车的输出不同？',
      code: 'class Engine {\n    String type;\n    Engine(String type) {\n        this.type = type;\n    }\n    String start() {\n        return type + " starts";\n    }\n}\nclass Car {\n    private Engine engine;\n    private String name;\n    Car(String name, Engine engine) {\n        this.name = name;\n        this.engine = engine;\n    }\n    String drive() {\n        return name + ": " + engine.start();\n    }\n}\npublic class Q {\n    public static void main(String[] args) {\n        Engine e = new Engine("V8");\n        Car c = new Car("Race", e);\n        System.out.println(c.drive());\n        Engine e2 = new Engine("EV");\n        Car c2 = new Car("City", e2);\n        System.out.println(c2.drive());\n    }\n}',
      answer: 'Race: V8 starts\nCity: EV starts',
      explain: '① Car 不 extends Engine，而是持有一个 Engine 字段：`Car has-a Engine`（组合）；② drive() 里调用 `engine.start()`，不同 Engine 对象的 type 不同 → "V8 starts" / "EV starts"；③ 同一套 Car 代码可以配不同引擎，说明组合让“部件”可替换——这是继承做不到的（运行期换父类）。' },

    { id: 'ch08-n5', ch: 'ch08', kp: 'ch08-8', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '下面哪种情况**不该**用继承？',
      options: [
        { text: '只是想复用父类的代码，但两者并不是同一种东西', correct: true },
        { text: '子类确实是父类的一个特例（Dog is-a Animal）' },
        { text: '父类为继承设计过，提供了可覆盖的钩子方法' },
        { text: '需要表达“形状”这类层次（Rect/Circle is-a Shape）' }
      ],
      explain: '不该用继承的四种典型：① 只想复用代码但不是同一种东西；② 依赖了父类实现细节（脆弱的基类）；③ 需要运行期切换行为（继承做不到，组合可以）；④ 需要多种能力（单继承不够，用接口）。其余三项都是继承的合理场景。' },

    { id: 'ch08-d1', ch: 'ch08', kp: 'ch08-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['syntax'],
      stem: '在重写父类方法时加上 `@Override` 注解的作用是？',
      options: [
        { text: '让编译器检查是否真的构成重写（签名写错立刻报错）', correct: true },
        { text: '强制方法变成 static' },
        { text: '提升运行速度' },
        { text: '把方法变成抽象方法' }
      ],
      explain: '@Override 是给编译器的“检查指令”：如果方法名/参数/返回类型与父类不一致，javac 报 `method does not override or implement a method from a supertype`。没有它的话，签名写错就变成了“另一个方法”，运行时多态不生效，还难查。' },

    { id: 'ch08-d2', ch: 'ch08', kp: 'ch08-5', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '抽象类里可以包含哪些成员？',
      options: [
        { text: '字段、构造器、已实现方法、抽象方法都可以有', correct: true },
        { text: '只能有抽象方法' },
        { text: '只能有字段' },
        { text: '只能有 static 方法' }
      ],
      explain: '抽象类 = 不能实例化的普通类：可以有字段、构造器（供子类 super 调用）、已实现的普通方法，以及没有方法体的抽象方法。它的价值是“把不变的实现留给父类、把可变的规范留给子类”。' },

    { id: 'ch08-d3', ch: 'ch08', kp: 'ch08-6', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '接口中的方法默认的访问修饰符是？',
      options: [
        { text: 'public abstract（公共且抽象）', correct: true },
        { text: 'private' },
        { text: 'protected' },
        { text: '不写就是包私有' }
      ],
      explain: '接口里声明的方法默认是 `public abstract`（Java 8 起还允许 default/static 方法有方法体）。实现类必须用 public 实现（不能缩小访问权限），否则编译报错“正在尝试分配更低的访问权限”。' },

    { id: 'ch08-d4', ch: 'ch08', kp: 'ch08-7', tier: 1, type: 'mcq', difficulty: 3, tags: ['concept'],
      stem: '模板方法模式中，父类的“骨架方法”通常声明成什么，防止子类改变流程？',
      options: [
        { text: 'final（子类不能重写流程本身，只能实现其中的抽象步骤）', correct: true },
        { text: 'abstract（强制子类重写整个流程）' },
        { text: 'private static' },
        { text: 'synchronized' }
      ],
      explain: '模板方法把流程写在父类的 final 方法里：`final void run() { setup(); execute(); cleanup(); }`，其中 execute 是抽象方法由子类实现。final 保证流程不被子类改写，子类只能填“可变步骤”。这就是“继承复用骨架 + 子类补差异”。' },

    /* ============================================================ ch09 内存与引用 */
    { id: 'ch09-q1', ch: 'ch09', kp: 'ch09-1', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '关于栈（stack）和堆（heap），下列说法正确的是？',
      options: [
        { text: '局部变量和 new 出来的对象都存放在栈里' },
        { text: '局部变量存在栈帧中；new 出来的对象存在堆里，栈里保存指向它的引用', correct: true },
        { text: '堆的空间总是比栈小' },
        { text: '基本类型一律存放在堆里' }
      ],
      explain: '方法调用时每个方法一个栈帧，存放局部变量（基本类型的值、对象引用）；对象本身（new 出来的实例、数组）放在堆里。栈里的引用只是一张“地址条”，堆里的对象才是真正的数据。' },

    { id: 'ch09-q2', ch: 'ch09', kp: 'ch09-2', tier: 2, type: 'predict', difficulty: 3, tags: ['output', 'trap', 'exam'],
      stem: '写出下面程序的输出。',
      code: 'public class Q {\n    static void f(int[] a) {\n        a[0] = 10;\n        a = new int[]{99};\n        a[0] = 20;\n    }\n    public static void main(String[] args) {\n        int[] arr = {1, 2, 3};\n        f(arr);\n        System.out.println(arr[0] + " " + arr.length);\n    }\n}',
      answer: '10 3',
      explain: '数组参数传的是**引用的副本**，一开始 a 和 arr 指向同一个数组，a[0]=10 改到原数组。接着 `a = new int[]{99}` 让参数 a 改指向一个全新的数组，后面的 a[0]=20 只改新数组——与 arr 无关。arr[0] 保持 10，arr.length 仍是 3。这就是“方法内重新赋值引用不影响调用方”。' },

    { id: 'ch09-q3', ch: 'ch09', kp: 'ch09-3', tier: 2, type: 'mcq', difficulty: 3, tags: ['trap', 'exam'],
      stem: '下面程序输出什么？',
      code: 'class Point {\n    int x;\n    Point(int x) { this.x = x; }\n}\nPoint p1 = new Point(1);\nPoint p2 = new Point(1);\nSystem.out.println(p1 == p2);\nSystem.out.println(p1.equals(p2));',
      options: [
        { text: 'true 然后 true' },
        { text: 'false 然后 false', correct: true },
        { text: 'false 然后 true' },
        { text: 'true 然后 false' }
      ],
      explain: 'p1、p2 是两个不同的对象，`==` 比较引用 → false。Point 类**没有重写 equals**，用的还是 Object 的默认实现，而 Object.equals 内部就是 == → 也是 false。想让“内容相同”算相等，必须自己重写 equals（通常还要一起重写 hashCode）。' },

    { id: 'ch09-q4', ch: 'ch09', kp: 'ch09-2', tier: 2, type: 'tf', difficulty: 2, tags: ['concept', 'exam'],
      stem: '判断：对象参数传递的是引用的副本——方法内可以修改对象的状态，但让参数指向另一个新对象不会影响调用方。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: '这就是 Java 常被误称为“引用传递”的真相：本质是值传递，只不过传的值是引用。所以方法内 `obj.field = x` 会影响调用方（同一个对象），但 `obj = new X()` 只改局部副本的指向，不影响调用方。' },

    { id: 'ch09-q5', ch: 'ch09', kp: 'ch09-4', tier: 2, type: 'mcq', difficulty: 3, tags: ['trap'],
      stem: '要把二维数组 `int[][] grid` 真正复制一份，使修改副本不影响原数组，正确做法是？',
      options: [
        { text: '`int[][] copy = grid;`' },
        { text: '`int[][] copy = grid.clone();`' },
        { text: '逐行复制：`copy[i] = grid[i].clone();`', correct: true },
        { text: '`int[][] copy = (int[][]) grid;`' }
      ],
      explain: '二维数组是“数组的数组”：外层 clone 只复制外层数组的引用槽，内层的每一行 int[] 仍与原数组共享，改 copy[0][0] 会同时改 grid[0][0]。真正的深拷贝必须逐行 clone（或嵌套循环复制每个元素）。一维基本类型数组的 clone 就是深拷贝。' },

    { id: 'ch09-q6', ch: 'ch09', kp: 'ch09-5', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
      stem: '填空：当引用变量的值为 null，却去调用它的方法或访问字段时，会抛出 `_____Exception`。',
      answer: 'NullPointerException',
      accept: [
        'NullPointer'
      ],
      explain: 'null 表示“不指向任何对象”，对它做 . 操作时 JVM 抛 NullPointerException（简称 NPE）。Java 里最高频的运行时异常之一，常见来源：对象数组没逐个 new、方法返回 null 没检查。' },

    { id: 'ch09-q7', ch: 'ch09', kp: 'ch09-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '执行 `int[] a = {1, 2, 3}; a = null;` 之后，原来那个数组会怎样？',
      options: [
        { text: '立刻被销毁，内存马上释放' },
        { text: '不再被任何引用指向，成为垃圾，由垃圾回收器在合适时机回收', correct: true },
        { text: '抛 NullPointerException' },
        { text: '数组元素全部变成 0' }
      ],
      explain: 'Java 没有手动 free/delete。`a = null` 只是让 a 这张“地址条”不再指向数组；当对象没有任何引用可达时成为垃圾，JVM 的 GC 会在合适时机自动回收，具体时间不确定。' },

    { id: 'ch09-q8', ch: 'ch09', kp: 'ch09-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['output', 'exam'],
      stem: '下面程序输出什么？',
      code: 'class Node { int v; }\nstatic void change(Node n) {\n    n.v = 7;\n    n = new Node();\n    n.v = 9;\n}\npublic static void main(String[] args) {\n    Node x = new Node();\n    x.v = 1;\n    change(x);\n    System.out.println(x.v);\n}',
      options: [
        { text: '1' },
        { text: '7', correct: true },
        { text: '9' },
        { text: '编译错误' }
      ],
      explain: '进入 change 时 n 和 x 指向同一个 Node，`n.v = 7` 改的是这个对象 → x.v 变成 7。随后 `n = new Node()` 让 n 改指向新对象，`n.v = 9` 只改新对象，与 x 无关。所以输出 7。' },

    { id: 'ch09-q9', ch: 'ch09', kp: 'ch09-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '执行 `String s = "ab"; s = s + "c";` 之后，原来的 "ab" 对象会怎样？',
      options: [
        { text: '被就地修改成 "abc"' },
        { text: '仍然存在，只是 s 改为指向新的 "abc" 字符串对象', correct: true },
        { text: '编译错误' },
        { text: '抛出异常' }
      ],
      explain: 'String 是**不可变（immutable）**对象：任何看似修改的操作（+、substring、toUpperCase…）都会创建新字符串。所以 s + "c" 产生新对象 "abc"，s 改指向它，原 "ab" 变成垃圾。这也是循环里反复 `s += x` 很慢、应该用 StringBuilder 的原因。' },

    { id: 'ch09-k1', ch: 'ch09', kp: 'ch09-6', tier: 2, type: 'predict', difficulty: 2, tags: ['output', 'trap'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Q {\n    static void changeX(int x) {\n        x = 99;\n    }\n    static void changeArr(int[] a) {\n        a[0] = 7;\n    }\n    static void changeObj(int[] a) {\n        a = new int[]{1, 2};\n        a[0] = 99;\n    }\n    public static void main(String[] args) {\n        int n = 5;\n        changeX(n);\n        System.out.println(n);\n        int[] arr = {1, 2, 3};\n        changeArr(arr);\n        System.out.println(arr[0] + " " + arr[1]);\n        changeObj(arr);\n        System.out.println(arr[0]);\n        String s = "hi";\n        s.toUpperCase();\n        System.out.println(s);\n        s = s.toUpperCase();\n        System.out.println(s);\n    }\n}',
      answer: '5\n7 2\n7\nhi\nHI',
      explain: 'Java **只有值传递**，传的是“值”的副本：① 基本类型 int 传的是数值副本，changeX 里 x=99 只改副本 → n 仍是 5；② 数组传的是**引用**的副本，副本和 arr 指向同一个数组，changeArr 里 a[0]=7 改到原数组 → `7 2`；③ changeObj 里 `a = new int[]{1,2}` 让副本改指新数组，后面的 99 只改新数组 → arr[0] 仍是 7；④ String 不可变，`s.toUpperCase()` 返回新串但没接住 → s 仍是 "hi"；重新赋值后才变成 "HI"。' },

    { id: 'ch09-k2', ch: 'ch09', kp: 'ch09-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '“Java 只有值传递”最准确的理解是？',
      options: [
        { text: '方法参数拿到的是实参值的副本：基本类型是数值副本，对象类型是引用的副本', correct: true },
        { text: '基本类型传值，对象类型传引用（引用传递）' },
        { text: 'Java 既有值传递也有引用传递，由参数类型决定' },
        { text: '方法内修改参数一定影响调用方' }
      ],
      explain: '“引用传递”指方法内让参数指向别的对象时调用方也跟着变——Java 做不到。Java 传对象时传的是**引用的副本**：两者指向同一对象，所以改对象状态（a[0]=7、obj.x=1）会生效；但在方法内 `a = new …` 只改了副本的指向，调用方不受影响。所以准确说法是“值传递，传的值可能是引用”。这也是 A 卷数组别名题的考点。' },

    { id: 'ch09-k3', ch: 'ch09', kp: 'ch09-6', tier: 2, type: 'predict', difficulty: 3, tags: ['output', 'trap'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'public class Q {\n    static void f(int[] a) {\n        a[0] = 1;\n        a = new int[]{2, 3};\n        a[0] = 99;\n        System.out.println(a[0] + " " + a[1]);\n    }\n    public static void main(String[] args) {\n        int[] arr = {0, 0};\n        f(arr);\n        System.out.println(arr[0] + " " + arr[1]);\n        int[] b = arr;\n        b[1] = 7;\n        System.out.println(arr[1]);\n    }\n}',
      answer: '99 3\n1 0\n7',
      explain: '① f 里 `a[0]=1` 通过副本引用改到 arr → 但随后 `a = new int[]{2,3}` 让参数 a 改指新数组，`a[0]=99` 只改新数组，打印 `99 3`；return 后 arr 还是 [1,0]（a[0] 在重新绑定**之前**改成了 1）→ `1 0`；② `int[] b = arr;` 别名，b[1]=7 改到 arr → 7。这道题把“改元素”和“重新绑定引用”两个动作放在同一个方法里，是区分值传递/引用传递的经典陷阱。' },

    { id: 'ch09-f1', ch: 'ch09', kp: 'ch09-6', tier: 2, type: 'fill', mode: 'findbug', difficulty: 3, tags: ['bug'],
      stem: '程序本意是让 fill 把传入的数组第一个元素改成 7，实际输出 0。指出哪一行有问题并改正。',
      code: 'public class Q {\n    static void fill(int[] a) {\n        a = new int[3];\n        a[0] = 7;\n    }\n    public static void main(String[] args) {\n        int[] arr = new int[3];\n        fill(arr);\n        System.out.println(arr[0]);\n    }\n}',
      answer: '第 3 行：`a = new int[3];` 让参数改指向新数组，后面的赋值只改新数组。应删掉这一行，直接 `a[0] = 7;`',
      accept: [
        { hint: '指出行号（第 3 行）', any: ['第3行', '第 3 行', '3行', '行3', 'line3'] },
        { hint: '删除 `a = new int[3];`（不要重新绑定参数）', any: ['删除', '删掉', '去掉', '重新绑定', 'new int[3]', '重新分配'] }
      ],
      fix: 'public class Q {\n    static void fill(int[] a) {\n        a[0] = 7;\n    }\n    public static void main(String[] args) {\n        int[] arr = new int[3];\n        fill(arr);\n        System.out.println(arr[0]);\n    }\n}',
      explain: 'Java 只有值传递，数组参数拿到的是**引用的副本**。`a[0] = 7` 会改到原数组（副本和 arr 指向同一对象）；但 `a = new int[3]` 只是让副本改指向一个新数组，与调用方的 arr 脱钩，之后 `a[0] = 7` 改的是新数组。所以 arr[0] 仍是 0。修法：删掉重新绑定那行，直接改元素。' },

    { id: 'ch09-f2', ch: 'ch09', kp: 'ch09-1', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '程序编译通过，但运行时报错。指出哪一行有问题并改正。',
      code: 'class Node {\n    int v = 1;\n}\npublic class Q {\n    public static void main(String[] args) {\n        Node[] ns = new Node[2];\n        ns[0].v = 5;\n        System.out.println(ns[0].v);\n    }\n}',
      answer: '第 6 行：`new Node[2]` 只创建数组，元素默认是 null；`ns[0].v` 对 null 访问字段抛 NullPointerException。应在访问前先 `ns[0] = new Node();`',
      accept: [
        { hint: '指出行号（第 6 行）', any: ['第6行', '第 6 行', '6行', '行6', 'line6'] },
        { hint: '先创建对象：`ns[0] = new Node();` 再访问字段', any: ['new Node()', 'ns[0]=new', '先new', '创建对象', '逐个new', 'new Node'] }
      ],
      fix: 'class Node {\n    int v = 1;\n}\npublic class Q {\n    public static void main(String[] args) {\n        Node[] ns = new Node[2];\n        ns[0] = new Node();\n        ns[0].v = 5;\n        System.out.println(ns[0].v);\n    }\n}',
      explain: '`new Node[2]` 只创建**数组本身**（2 个引用槽），不会创建 Node 对象；引用类型元素默认值是 null，对 null 访问 `.v` 就抛 NullPointerException。对象数组的标准写法：先 new 数组，再对每个下标 `ns[i] = new Node();`。对比 `new int[2]`：基本类型元素默认 0，可以直接用。' },

    { id: 'ch09-p1', ch: 'ch09', kp: 'ch09-6', tier: 4, type: 'predict', difficulty: 3, tags: ['output', 'trap'],
      stem: '读下面的程序，<b>写出完整输出（逐行）</b>。追问：① f(arr) 里 `a = new int[]{7, 8}` 之后，后面的 a[1]=200 改到了哪个数组？② 为什么 copy 改了 arr 不变？③ `java.util.Arrays.toString` 输出格式是什么？',
      code: 'public class Q {\n    static void f(int[] a) {\n        a[0] = 100;\n        a = new int[]{7, 8};\n        a[1] = 200;\n        System.out.println(a[0] + " " + a[1]);\n    }\n    static void g(int[] b) {\n        b[1] = 50;\n    }\n    static void h(int x) {\n        x = 99;\n    }\n    public static void main(String[] args) {\n        int[] arr = {1, 2, 3};\n        int[] alias = arr;\n        alias[0] = 9;\n        System.out.println(arr[0]);\n        f(arr);\n        System.out.println(arr[0] + " " + arr[1]);\n        g(arr);\n        System.out.println(arr[1]);\n        int n = 5;\n        h(n);\n        System.out.println(n);\n        int[] copy = new int[arr.length];\n        for (int i = 0; i < arr.length; i++) {\n            copy[i] = arr[i];\n        }\n        copy[0] = -1;\n        System.out.println(arr[0] + " " + copy[0]);\n        System.out.println(java.util.Arrays.toString(arr));\n    }\n}',
      answer: '9\n7 200\n100 2\n50\n5\n100 -1\n[100, 50, 3]',
      explain: '① alias 是别名，alias[0]=9 改到 arr → arr[0]=9；② 进入 f 时 a 是 arr 引用的副本，`a[0] = 100` 改到原数组；`a = new int[]{7,8}` 让副本改指新数组，`a[1]=200` 只改新数组，打印 `7 200`；返回 main 后 arr 还是 [100,2,3] → 打印 `100 2`；③ g(arr) 里 `b[1]=50` 改到原数组 → 50；④ h(n) 传的是 int 副本，n 不变 → 5；⑤ 逐元素复制得到独立的 copy，copy[0]=-1 不影响 arr → `100 -1`；⑥ Arrays.toString 输出 `[100, 50, 3]`（逗号+空格）。这段程序把“改元素 / 重新绑定引用 / 复制数组”三个概念放在一起，是值传递题的典型结构。' },

    { id: 'ch09-t1', ch: 'ch09', kp: 'ch09-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '关于栈（stack）与堆（heap），下列说法正确的是？',
      options: [
        { text: '局部变量（含引用）在栈帧里；new 出来的对象和数组在堆里', correct: true },
        { text: '对象在栈里，局部变量在堆里' },
        { text: '基本类型在堆里，引用类型在栈里' },
        { text: '栈和堆是同一块内存的两种叫法' }
      ],
      explain: '每次方法调用创建一个**栈帧**，存放参数、局部变量（基本类型的值、对象引用）；`new` 出来的对象/数组放在**堆**里，栈帧中只保存指向它的引用。所以“变量在栈、对象在堆”是画内存图的第一原则。' },

    { id: 'ch09-t2', ch: 'ch09', kp: 'ch09-3', tier: 1, type: 'fill', difficulty: 1, tags: ['syntax'],
      stem: '填空：比较两个字符串的**内容**是否相同，应调用 `a._____(b)`（填方法名，不要用 ==）。',
      answer: ['equals'],
      explain: '`==` 对引用类型比较“是否指向同一个对象”，`equals` 才比较内容。字符串字面量之间 == 可能碰巧为 true（字符串池），`new String(...)` 则一定为 false，所以比较内容永远用 equals。对象要支持内容比较，必须自己重写 equals（通常连 hashCode 一起）。' },

    { id: 'ch09-t3', ch: 'ch09', kp: 'ch09-2', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
      stem: '判断：引用类型变量里保存的是对象的“地址”（引用），对象本身在堆里。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: '引用变量（如 `Point p`、`int[] a`）在栈帧里，存的是对象在堆中的引用（地址纸条）；对象本身在堆里。所以 `p = q` 只是复制地址（别名），`p == q` 比较地址；想比较内容要重写 equals。' },

    { id: 'ch09-t4', ch: 'ch09', kp: 'ch09-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '执行 `int[] a = {1,2,3}; int[] b = a; b[0] = 9;` 后，a[0] 是？',
      options: [
        { text: '9', correct: true },
        { text: '1' },
        { text: '0' },
        { text: '编译错误' }
      ],
      explain: '`int[] b = a;` 让 b 和 a 指向同一个数组（别名 aliasing），通过 b 改元素，a 看到的也变了。要独立副本用 `a.clone()` 或 `Arrays.copyOf`。别名是很多“改了副本原数据也变”的 bug 根源。' },

    { id: 'ch09-t5', ch: 'ch09', kp: 'ch09-5', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '关于浅拷贝与深拷贝，下列说法正确的是？',
      options: [
        { text: '浅拷贝只复制外层引用，内部对象仍共享；深拷贝逐层复制出独立对象', correct: true },
        { text: '浅拷贝一定比深拷贝慢' },
        { text: '一维基本类型数组的 clone 是浅拷贝，会共享元素' },
        { text: 'Java 的 clone 默认就是深拷贝' }
      ],
      explain: '浅拷贝（shallow copy）：复制对象/数组本身，但内部的引用仍指向原来那些对象；深拷贝（deep copy）：递归复制内部对象，得到完全独立的副本。一维基本类型数组没有内部对象，clone 就是“深”的；二维数组 clone 是浅拷贝（内层行共享），需要逐行 clone。' },

    { id: 'ch09-t6', ch: 'ch09', kp: 'ch09-5', tier: 2, type: 'predict', difficulty: 3, tags: ['output', 'trap'],
      stem: '写出下面程序的完整输出（逐行）。追问：为什么改了 b 的元素 a 也变，但 b[1] 换新数组后 a 不受影响？',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int[][] a = {{1, 2}, {3, 4}};\n        int[][] b = a.clone();\n        b[0][0] = 99;\n        System.out.println(a[0][0]);\n        b[1] = new int[]{7, 8};\n        System.out.println(a[1][0]);\n        int[] c = a[0].clone();\n        c[0] = -1;\n        System.out.println(a[0][0]);\n        int[][] d = new int[a.length][a[0].length];\n        for (int i = 0; i < a.length; i++) {\n            for (int j = 0; j < a[i].length; j++) {\n                d[i][j] = a[i][j];\n            }\n        }\n        d[0][0] = 0;\n        System.out.println(a[0][0]);\n    }\n}',
      answer: '99\n3\n99\n99',
      explain: '① `a.clone()` 对二维数组是**浅拷贝**：外层新数组，但内层两行仍与 a 共享 → b[0][0]=99 改到 a → 99；② `b[1] = new int[]{7,8}` 让 b 的第 1 行改指新数组，a[1] 仍是原来的行 → 3；③ 单独 clone 一行 a[0] 得到独立一维数组，改 c 不影响 a → 99；④ 双重循环逐元素复制才是真正的深拷贝，d[0][0]=0 不影响 a → 99。' },

    { id: 'ch09-f3', ch: 'ch09', kp: 'ch09-2', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '程序本意是“复制一份数组，改副本不影响原数组”，但输出 100。指出哪一行有问题并改正。',
      code: 'public class Q {\n    static int[] copy(int[] a) {\n        int[] b = a;\n        return b;\n    }\n    public static void main(String[] args) {\n        int[] src = {1, 2, 3};\n        int[] dst = copy(src);\n        dst[0] = 100;\n        System.out.println(src[0]);\n    }\n}',
      answer: '第 3 行：`int[] b = a;` 只是让 b 成为 a 的别名，没有复制。应改为 `int[] b = a.clone();`（或 Arrays.copyOf）',
      accept: [
        { hint: '指出行号（第 3 行）', any: ['第3行', '第 3 行', '3行', '行3', 'line3'] },
        { hint: '用 clone / Arrays.copyOf 真正复制数组', any: ['clone', 'copyOf', '深拷贝', '复制数组', 'new int[a.length]'] }
      ],
      fix: 'public class Q {\n    static int[] copy(int[] a) {\n        int[] b = a.clone();\n        return b;\n    }\n    public static void main(String[] args) {\n        int[] src = {1, 2, 3};\n        int[] dst = copy(src);\n        dst[0] = 100;\n        System.out.println(src[0]);\n    }\n}',
      explain: '方法返回 `b`，但 b 与 a 指向同一个数组（别名），dst[0]=100 当然改到 src。修法：`int[] b = a.clone();` 或 `Arrays.copyOf(a, a.length)`。这个 bug 和“方法内修改参数”的值传递陷阱是同一类：赋值引用 ≠ 复制对象。' },

    { id: 'ch09-t8', ch: 'ch09', kp: 'ch09-1', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '一个方法执行完毕返回时，它的栈帧会怎样？',
      options: [
        { text: '栈帧被弹出销毁，其中的局部变量随之失效（对象若无引用则成为垃圾）', correct: true },
        { text: '栈帧保留在栈中，供下次调用复用' },
        { text: '栈帧里的对象会立即被删除' },
        { text: '栈帧被移动到堆里继续存在' }
      ],
      explain: '方法返回 → 栈帧弹出 → 局部变量（含引用）消失。堆里的对象不会立刻删除：只要没有任何引用指向它，就成为垃圾，由 GC 在合适时机回收。若方法把对象引用返回/存到字段，对象仍可达，就不会被回收。' },

    { id: 'ch09-t9', ch: 'ch09', kp: 'ch09-3', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序的完整输出（逐行）。追问：a == b 为什么是 true？a == d 为什么是 false？',
      code: 'public class Q {\n    public static void main(String[] args) {\n        String a = "hi";\n        String b = "h" + "i";\n        String c = new String("hi");\n        System.out.println(a == b);\n        System.out.println(a == c);\n        System.out.println(a.equals(c));\n        String d = c;\n        System.out.println(a == d);\n        System.out.println(d.equals(c));\n    }\n}',
      answer: 'true\nfalse\ntrue\nfalse\ntrue',
      explain: '① `"h" + "i"` 是编译期常量拼接，结果进字符串池，与字面量 "hi" 是同一个对象 → a == b 为 true；② `new String("hi")` 在堆里新建对象 → a == c 为 false；③ equals 比内容 → true；④ `d = c` 只是复制引用（别名），d 与 c 同一对象，但 a 与 d 不同对象 → a == d 为 false；⑤ d.equals(c) 同一对象当然 true。' },

    { id: 'ch09-t10', ch: 'ch09', kp: 'ch09-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '“Java 只有值传递”最准确的理解是？',
      options: [
        { text: '方法拿到的是实参值的副本：基本类型是数值副本，对象是引用的副本', correct: true },
        { text: '基本类型传值，对象传引用（引用传递）' },
        { text: 'Java 按参数类型自动选择值传递或引用传递' },
        { text: '方法内对参数的修改一定影响调用方' }
      ],
      explain: 'Java 把实参的值复制一份给形参：基本类型复制数值，对象复制引用。“引用传递”指方法内让参数改指新对象时调用方也跟着变——Java 做不到。所以：改对象内容会生效（同一个对象），改参数指向不影响调用方。准确说法是“值传递，传的值可能是引用”。' },

    { id: 'ch09-t11', ch: 'ch09', kp: 'ch09-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '两个变量指向同一个对象（别名）时，通过其中一个修改对象状态，另一个看到的是？',
      options: [
        { text: '也变了：它们指向同一块堆内存', correct: true },
        { text: '不变：每个变量有独立的副本' },
        { text: '取决于变量的声明类型' },
        { text: '编译错误' }
      ],
      explain: '别名意味着“两张地址纸条指向同一间房”：改房间里的东西，两张纸条都指向新状态。只有赋值 `b = a.clone()` 或重新 new 才能让 b 独立。防别名 bug 的原则：需要独立副本时显式复制，不要直接赋值引用。' },

    { id: 'ch09-c1', ch: 'ch09', kp: 'ch09-5', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>copyOf</code>：返回一个与参数数组内容相同、但**互不共享**的新数组（修改副本不能影响原数组）。',
      starter: 'public class Q {\n    static int[] copyOf(int[] a) {\n        // TODO: 返回一个内容相同但彼此独立的数组（修改副本不能影响原数组）\n        return a;\n    }\n    public static void main(String[] args) {\n        int[] src = new int[args.length];\n        for (int i = 0; i < args.length; i++) {\n            src[i] = Integer.parseInt(args[i]);\n        }\n        int[] dst = copyOf(src);\n        dst[0] = 0;\n        System.out.println(src[0] + " " + dst[0]);\n        System.out.println(src.length == dst.length);\n    }\n}',
      solution: 'public class Q {\n    static int[] copyOf(int[] a) {\n        int[] b = new int[a.length];\n        for (int i = 0; i < a.length; i++) {\n            b[i] = a[i];\n        }\n        return b;\n    }\n    public static void main(String[] args) {\n        int[] src = new int[args.length];\n        for (int i = 0; i < args.length; i++) {\n            src[i] = Integer.parseInt(args[i]);\n        }\n        int[] dst = copyOf(src);\n        dst[0] = 0;\n        System.out.println(src[0] + " " + dst[0]);\n        System.out.println(src.length == dst.length);\n    }\n}',
      tests: [
        { args: ['5', '2', '9'], expect: '5 0\ntrue' },
        { args: ['-3', '7'], expect: '-3 0\ntrue' }
      ],
      explain: '深拷贝手工版：`new int[a.length]` 新数组 + 逐元素赋值。测试里把 dst[0] 改成 0，原数组 src[0] 应保持 5（第一个输出 `5 0`），长度相等（true）。直接 `return a;` 是别名，会让 src[0] 变成 0——正是要避免的 bug。' },

    { id: 'ch09-p2', ch: 'ch09', kp: 'ch09-6', tier: 4, type: 'predict', difficulty: 3, tags: ['output', 'trap'],
      stem: '读下面的“值传递综合”程序，<b>写出完整输出（逐行）</b>。追问：① fill 里 a[0]=100 与 a=new int[]{7,8} 分别影响谁？② change(int) 与 change(String) 为什么都没改动实参？③ copy 为什么没被 arr 影响？',
      code: 'public class Q {\n    static void fill(int[] a) {\n        a[0] = 100;\n        a = new int[]{7, 8};\n        a[1] = 200;\n    }\n    static void change(int x) {\n        x = 99;\n    }\n    static void change(String s) {\n        s = s + "!";\n    }\n    public static void main(String[] args) {\n        int[] arr = {1, 2, 3};\n        fill(arr);\n        System.out.println(arr[0] + " " + arr[1]);\n        change(arr[0]);\n        System.out.println(arr[0]);\n        String s = "hi";\n        change(s);\n        System.out.println(s);\n        int[] alias = arr;\n        alias[2] = 50;\n        System.out.println(arr[2]);\n        int[] copy = new int[arr.length];\n        for (int i = 0; i < arr.length; i++) {\n            copy[i] = arr[i];\n        }\n        copy[0] = -1;\n        System.out.println(arr[0] + " " + copy[0]);\n    }\n}',
      answer: '100 2\n100\nhi\n50\n100 -1',
      explain: '① fill 的 a 是 arr 引用的副本：`a[0]=100` 改到原数组；`a = new int[]{7,8}` 让副本改指新数组，`a[1]=200` 只改新数组 → arr 仍是 [100,2,3] → `100 2`；② change(int) 改的是数值副本；String 不可变，`s = s + "!"` 只是让副本改指新串 → s 仍是 hi；③ alias 是别名，alias[2]=50 改到 arr → 50；④ copy 是逐元素复制的独立数组，copy[0]=-1 不影响 arr → `100 -1`。' },

    { id: 'ch09-t12', ch: 'ch09', kp: 'ch09-7', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '程序运行时报 NullPointerException。指出哪一行出错、原因是什么，并给出修改方法。',
      code: 'class Node {\n    int v;\n    Node(int v) {\n        this.v = v;\n    }\n}\npublic class Q {\n    static Node find(Node[] arr, int target) {\n        for (int i = 0; i < arr.length; i++) {\n            if (arr[i] != null && arr[i].v == target) {\n                return arr[i];\n            }\n        }\n        return null;\n    }\n    public static void main(String[] args) {\n        Node[] arr = {new Node(1), new Node(2)};\n        Node x = find(arr, 5);\n        System.out.println(x.v);\n    }\n}',
      answer: '第 19 行：`x.v` 中 x 是 null（find 没找到返回 null），访问字段抛 NullPointerException。应在使用前判断 `if (x == null) { … }`',
      accept: [
        { hint: '指出第 19 行（x.v）出错', any: ['第19行', '第 19 行', '19行', '行19', 'x.v', 'line19'] },
        { hint: '原因是 find 返回 null，使用前要判空', any: ['null', '判空', '检查null', '返回null', 'npe'] }
      ],
      fix: 'class Node {\n    int v;\n    Node(int v) {\n        this.v = v;\n    }\n}\npublic class Q {\n    static Node find(Node[] arr, int target) {\n        for (int i = 0; i < arr.length; i++) {\n            if (arr[i] != null && arr[i].v == target) {\n                return arr[i];\n            }\n        }\n        return null;\n    }\n    public static void main(String[] args) {\n        Node[] arr = {new Node(1), new Node(2)};\n        Node x = find(arr, 5);\n        if (x == null) {\n            System.out.println("not found");\n        } else {\n            System.out.println(x.v);\n        }\n    }\n}',
      explain: 'find 找不到时返回 null，main 直接 `x.v` 就对 null 解引用 → NullPointerException。调试引用类 bug 的口诀：① 看异常类型与行号（NPE 会指出具体行，Java 不会告诉你哪个变量是 null，要自己看这一行用了哪些引用）；② 逆着找“这个引用最后一次被赋值的地方”（这里是 find 的返回值）；③ 判空或改用 Optional。修法：使用前 `if (x == null)` 分支处理。' },

    { id: 'ch09-t13', ch: 'ch09', kp: 'ch09-7', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '调试“引用类 bug”（对象状态莫名被改、NPE）时，最有效的第一步是？',
      options: [
        { text: '画出/写出相关变量的内存图：谁和谁是别名、每个引用最后指向哪个对象', correct: true },
        { text: '把所有变量都改成 static' },
        { text: '给每一行都加 system.out' },
        { text: '删掉所有对象，改写成基本类型' }
      ],
      explain: '引用 bug 的本质是“别名/重新绑定/null”与预期不符。先用内存图（栈帧变量 → 堆对象）标出每个引用的指向，再定位“哪一行让某个引用指向了意外的对象”或“哪个引用是 null”。这比盲目加打印高效得多——这正是 ch09 反复练内存图的原因。' },

    { id: 'ch09-t14', ch: 'ch09', kp: 'ch09-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '执行 `String s = null; System.out.println(s.length());` 会发生什么？',
      options: [
        { text: '运行时抛 NullPointerException，行号指向 println 这一行', correct: true },
        { text: '输出 0，因为 null 长度是 0' },
        { text: '编译错误：null 不能赋给 String' },
        { text: '输出 null' }
      ],
      explain: '`s` 是 null（不指向任何对象），调用方法 `s.length()` 就是“对空引用解引用” → 运行时抛 NullPointerException，异常栈指向 `s.length()` 所在行。注意 NPE 是**运行时**错误，javac 不检查（它不知道这个变量运行时会不会是 null）。修法：判空、或用 `"..."` 初始化。' },

    { id: 'ch09-c2', ch: 'ch09', kp: 'ch09-2', tier: 3, type: 'code', difficulty: 1, tags: ['code'],
      stem: '补全方法 <code>swapFirstTwo</code>：交换数组 a 的 a[0] 与 a[1]（要求调用方能看见交换后的结果）。',
      starter: 'public class Q {\n    static void swapFirstTwo(int[] a) {\n        // TODO: 交换 a[0] 与 a[1]\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        swapFirstTwo(a);\n        System.out.println(a[0] + " " + a[1]);\n    }\n}',
      solution: 'public class Q {\n    static void swapFirstTwo(int[] a) {\n        int t = a[0];\n        a[0] = a[1];\n        a[1] = t;\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        swapFirstTwo(a);\n        System.out.println(a[0] + " " + a[1]);\n    }\n}',
      tests: [
        { args: [], expect: '2 1' }
      ],
      explain: '数组参数传的是引用的副本，但副本与原数组指向同一个数组对象 → 通过 a[0]/a[1] 修改会被调用方看到。交换需要临时变量。对比 swap(int, int) 无法交换基本类型。' },

    { id: 'ch09-c3', ch: 'ch09', kp: 'ch09-1', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>fill</code>：把数组 a 的每个元素都设为 v。',
      starter: 'public class Q {\n    static void fill(int[] a, int v) {\n        // TODO: 把每个元素设为 v\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        int v = Integer.parseInt(args[0]);\n        fill(a, v);\n        System.out.println(java.util.Arrays.toString(a));\n    }\n}',
      solution: 'public class Q {\n    static void fill(int[] a, int v) {\n        for (int i = 0; i < a.length; i++) {\n            a[i] = v;\n        }\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        int v = Integer.parseInt(args[0]);\n        fill(a, v);\n        System.out.println(java.util.Arrays.toString(a));\n    }\n}',
      tests: [
        { args: ['9'], expect: '[9, 9, 9]' },
        { args: ['0'], expect: '[0, 0, 0]' }
      ],
      explain: '遍历并赋值即可。数组是对象，方法内改元素会反映到调用方；这正是在数组上“有副作用”的合法用法。' },

    { id: 'ch09-c4', ch: 'ch09', kp: 'ch09-3', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>sameText</code>：比较两个字符串的<b>内容</b>是否相同（用 equals，不要用 ==）。',
      starter: 'public class Q {\n    static boolean sameText(String a, String b) {\n        return a == b;\n    }\n    public static void main(String[] args) {\n        System.out.println(sameText(args[0], new String(args[0])));\n        System.out.println(sameText(args[0], args[1]));\n    }\n}',
      solution: 'public class Q {\n    static boolean sameText(String a, String b) {\n        return a.equals(b);\n    }\n    public static void main(String[] args) {\n        System.out.println(sameText(args[0], new String(args[0])));\n        System.out.println(sameText(args[0], args[1]));\n    }\n}',
      tests: [
        { args: ['hi', 'hi'], expect: 'true\ntrue' },
        { args: ['hi', 'bye'], expect: 'true\nfalse' }
      ],
      explain: '字符串内容比较必须用 equals：`new String("hi")` 与字面量 "hi" 是不同对象，== 会得到 false，equals 才是 true。TODO 写法（return a == b）会让第一个输出变成 false。' },

    { id: 'ch09-c5', ch: 'ch09', kp: 'ch09-5', tier: 4, type: 'code', difficulty: 3, tags: ['code'],
      stem: '<b>跨章综合</b>：补全方法 <code>rotateLeft</code>，把数组**原地**左旋 k 位（k 可能大于数组长度，约定数组非空、k ≥ 0）。例如 [1,2,3,4,5] 左旋 2 位 → [3,4,5,1,2]。',
      starter: 'public class Q {\n    static void rotateLeft(int[] a, int k) {\n        // TODO: 原地左旋 k 位\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3, 4, 5};\n        rotateLeft(a, 2);\n        System.out.println(java.util.Arrays.toString(a));\n        int[] b = {1, 2, 3};\n        rotateLeft(b, 4);\n        System.out.println(java.util.Arrays.toString(b));\n    }\n}',
      solution: 'public class Q {\n    static void rotateLeft(int[] a, int k) {\n        int n = a.length;\n        k = k % n;\n        int[] tmp = new int[n];\n        for (int i = 0; i < n; i++) {\n            tmp[i] = a[(i + k) % n];\n        }\n        for (int i = 0; i < n; i++) {\n            a[i] = tmp[i];\n        }\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3, 4, 5};\n        rotateLeft(a, 2);\n        System.out.println(java.util.Arrays.toString(a));\n        int[] b = {1, 2, 3};\n        rotateLeft(b, 4);\n        System.out.println(java.util.Arrays.toString(b));\n    }\n}',
      tests: [
        { args: [], expect: '[3, 4, 5, 1, 2]\n[2, 3, 1]' }
      ],
      explain: '先 `k = k % n` 处理 k ≥ n 的情况，再用辅助数组把 `a[(i+k)%n]` 搬到位置 i，最后写回原数组（“原地”指调用方看到原数组变了）。数组 + 取模 + 方法副作用的综合；[1,2,3] 左旋 4 位等价于左旋 1 位 → [2,3,1]。' },

    { id: 'ch09-d1', ch: 'ch09', kp: 'ch09-4', tier: 1, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '两个引用指向同一个对象时，通过其中一个修改对象状态，另一个看到的是？',
      options: [
        { text: '也变了：它们指向堆里的同一个对象', correct: true },
        { text: '不变：每个引用有独立副本' },
        { text: '取决于声明类型' },
        { text: '编译错误' }
      ],
      explain: '别名（aliasing）：两个引用保存同一个地址，改“那间房”里的东西，两张地址条都指向新状态。要独立副本必须显式复制（clone/拷贝构造/逐元素复制）。防别名 bug 的原则：需要独立副本时不要直接赋值引用。' },

    { id: 'ch09-d2', ch: 'ch09', kp: 'ch09-7', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: 'Java 程序抛 NullPointerException 时，异常信息能直接告诉你什么？',
      options: [
        { text: '出错的代码行号（但不告诉你是哪个变量为 null）', correct: true },
        { text: '哪个变量是 null' },
        { text: '谁把变量设成了 null' },
        { text: '如何自动修复' }
      ],
      explain: 'NPE 的栈信息给出出错行（`at Q.main(Q.java:12)`），但不指明哪个引用为 null。调试要看这一行用了哪些引用，再逆着找“这个引用最后一次被赋值的位置”（如方法返回值、数组元素、字段），判断它为什么是 null。' },

    { id: 'ch09-d3', ch: 'ch09', kp: 'ch09-7', tier: 1, type: 'tf', difficulty: 2, tags: ['concept'],
      stem: '判断：把引用变量先判空（`if (x != null)`）再使用，是避免 NullPointerException 的常见手段。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: '对可能为 null 的引用（方法返回值、对象数组元素、未初始化字段）先判空再解引用，是最直接的防御。更彻底的做法：方法尽量不返回 null（返回空集合/空数组）、用 Optional、或在源头保证对象已创建（对象数组逐个 new）。' },

    /* ============================================================ ch10 抽象数据类型与集合 */
    { id: 'ch10-q1', ch: 'ch10', kp: 'ch10-1', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '“抽象数据类型（ADT）”描述的是什么？',
      options: [
        { text: '数据在内存中的具体布局' },
        { text: '一组数据加上允许在其上执行的操作，不关心内部怎么实现', correct: true },
        { text: '一种 Java 关键字' },
        { text: '只有 class 才能实现 ADT，接口不行' }
      ],
      explain: 'ADT 从**使用者视角**定义“能做什么”：有哪些数据、支持哪些操作、这些操作的语义是什么。内部是数组还是链表由实现决定，可以随时替换（ArrayList ↔ LinkedList）。Java 里用接口或类来体现 ADT。' },

    { id: 'ch10-q2', ch: 'ch10', kp: 'ch10-2', tier: 2, type: 'predict', difficulty: 3, tags: ['output', 'trap', 'exam'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'import java.util.ArrayList;\npublic class Q {\n    public static void main(String[] args) {\n        ArrayList<Integer> list = new ArrayList<>();\n        list.add(3);\n        list.add(1);\n        list.add(2);\n        list.remove(1);\n        list.add(list.get(0) + 10);\n        System.out.println(list);\n        System.out.println(list.size());\n    }\n}',
      answer: '[3, 2, 13]\n3',
      explain: 'add 后是 [3, 1, 2]。`list.remove(1)` 的参数 1 是 int 字面量，匹配 **remove(int index)**，删掉的是下标 1 的元素 1（不是元素值 1）→ [3, 2]。接着 list.get(0) = 3，add(13) → [3, 2, 13]。ArrayList 的 toString 输出 [3, 2, 13]，size 为 3。想按值删要写 `list.remove(Integer.valueOf(1))`。' },

    { id: 'ch10-q3', ch: 'ch10', kp: 'ch10-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept', 'exam'],
      stem: '关于 ArrayList 与普通数组的区别，正确的是？',
      options: [
        { text: 'ArrayList 长度固定，数组长度可变' },
        { text: 'ArrayList 长度可变，并提供 add/remove 等操作', correct: true },
        { text: 'ArrayList 可以直接存放 int 等基本类型' },
        { text: '数组下标越界会抛 NullPointerException' }
      ],
      explain: '数组创建后长度固定；ArrayList 能自动扩容、提供 add/get/set/remove/size 等操作。泛型不能是基本类型，必须用包装类：`ArrayList&lt;Integer&gt;`，不能写 `ArrayList&lt;int&gt;`。数组越界抛的是 ArrayIndexOutOfBoundsException，不是 NPE。' },

    { id: 'ch10-q4', ch: 'ch10', kp: 'ch10-3', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
      stem: '判断：HashMap 中同一个 key 不能重复；对已存在的 key 再次 put，会用新值覆盖旧值。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: 'key 唯一、value 可重复。`map.put(k, newV)` 在 k 已存在时返回旧值并替换成 newV，size 不变。HashMap 不保证键值对的遍历顺序（需要顺序用 LinkedHashMap/TreeMap）。' },

    { id: 'ch10-q5', ch: 'ch10', kp: 'ch10-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['output'],
      stem: '下面程序输出什么？',
      code: 'ArrayList<String> list = new ArrayList<>();\nlist.add("a");\nlist.add("b");\nSystem.out.print(list.size() + " ");\nlist.remove(0);\nSystem.out.println(list.get(0));',
      options: [
        { text: '2 b', correct: true },
        { text: '2 a' },
        { text: '1 b' },
        { text: '2 0' }
      ],
      explain: 'add 两个元素后 size 是 2；remove(0) 删除下标 0 的 "a"，剩下的列表是 ["b"]，于是 get(0) 得到 "b"。输出 `2 b`。' },

    { id: 'ch10-q6', ch: 'ch10', kp: 'ch10-2', tier: 1, type: 'fill', difficulty: 1, tags: ['syntax'],
      stem: '填空：获取 ArrayList 对象 `list` 中元素个数的方法是 `list._____()`。（方法名）',
      answer: 'size',
      explain: 'ArrayList 用 size()；数组用 length（属性，无括号）；String 用 length()（方法）。这三个“长度”的写法是选择题常客。' },

    { id: 'ch10-q7', ch: 'ch10', kp: 'ch10-3', tier: 2, type: 'multi', difficulty: 2, tags: ['syntax', 'exam'],
      stem: '关于 Java 集合，下列哪些说法是正确的？（多选）',
      options: [
        { text: '`ArrayList&lt;Integer&gt; list = new ArrayList&lt;&gt;();` 合法', correct: true },
        { text: '`ArrayList&lt;int&gt; list = new ArrayList&lt;&gt;();` 合法' },
        { text: '`HashMap&lt;String, Integer&gt; map` 可以调用 `map.put("a", 1)`', correct: true },
        { text: '`list.get(i)` 的下标从 0 开始', correct: true }
      ],
      explain: '泛型的类型参数必须是引用类型，`ArrayList&lt;int&gt;` 非法，要用 `ArrayList&lt;Integer&gt;`（基本类型自动装箱）。HashMap 的 put 放入键值对，get 按下标（key）取值。List 与数组一样从 0 开始编号。' },

    { id: 'ch10-q8', ch: 'ch10', kp: 'ch10-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['output'],
      stem: '下面程序输出什么？',
      code: 'HashMap<String, Integer> m = new HashMap<>();\nm.put("a", 1);\nm.put("b", 2);\nm.put("a", 3);\nSystem.out.println(m.size() + " " + m.get("a"));',
      options: [
        { text: '3 1' },
        { text: '2 3', correct: true },
        { text: '2 1' },
        { text: '3 3' }
      ],
      explain: '两次 put("a", …) 用的是同一个 key，第二次覆盖第一次的值，size 仍是 2（a、b 两个键），m.get("a") 得到最新值 3。' },

    { id: 'ch10-q9', ch: 'ch10', kp: 'ch10-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept', 'exam'],
      stem: '要频繁根据“学号”查找“成绩”，数据量很大，最适合用哪种结构？',
      options: [
        { text: 'ArrayList，逐个遍历比较' },
        { text: 'HashMap，用学号作 key、成绩作 value', correct: true },
        { text: '普通数组，按学号当 index' },
        { text: 'String 拼接后查找' }
      ],
      explain: 'HashMap 按 key 查找平均 O(1)，非常适合“键 → 值”的映射需求。ArrayList 查找需要 O(n) 遍历；用学号当数组下标则要求学号连续且从 0 开始，现实中不成立；字符串拼接查找更慢且难维护。' },

    { id: 'ch10-k1', ch: 'ch10', kp: 'ch10-5', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面程序的完整输出（逐行）。',
      code: 'import java.util.ArrayList;\npublic class Q {\n    public static void main(String[] args) {\n        ArrayList<String> words = new ArrayList<>();\n        words.add("java");\n        words.add("is");\n        words.add("fun");\n        for (String w : words) {\n            System.out.print(w.length() + " ");\n        }\n        System.out.println();\n        int total = 0;\n        for (int i = 0; i < words.size(); i++) {\n            total += words.get(i).length();\n        }\n        System.out.println(total);\n        ArrayList<Integer> nums = new ArrayList<>();\n        for (int i = 1; i <= 3; i++) {\n            nums.add(i * i);\n        }\n        System.out.println(nums);\n    }\n}',
      answer: '4 2 3\n9\n[1, 4, 9]',
      explain: '① 增强 for `for (String w : words)` 依次取出 "java"、"is"、"fun"，打印长度 4、2、3 → `4 2 3`；② 下标 for 用 get(i).length() 累加，总和 9；③ `ArrayList&lt;Integer&gt;` 的泛型参数必须是包装类 Integer；循环加入 1、4、9 后，ArrayList 的 toString 输出 `[1, 4, 9]`（带方括号和逗号）。增强 for 只能读、不能通过它修改集合/数组元素。' },

    { id: 'ch10-k2', ch: 'ch10', kp: 'ch10-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: '下面哪一个声明是**合法**的？',
      options: [
        { text: '`ArrayList&lt;Integer&gt; list = new ArrayList&lt;&gt;();`', correct: true },
        { text: '`ArrayList&lt;int&gt; list = new ArrayList&lt;&gt;();`' },
        { text: '`ArrayList list = new ArrayList&lt;int&gt;();`' },
        { text: '`ArrayList&lt;Integer&gt; list = new ArrayList&lt;int&gt;();`' }
      ],
      explain: '泛型的类型参数**必须是引用类型**，不能是基本类型：`ArrayList&lt;int&gt;` 编译错误，必须写 `ArrayList&lt;Integer&gt;`（自动装箱把 int 变成 Integer）。另外泛型的尖括号只在类型位置使用，`new ArrayList&lt;int&gt;()` 同样非法。这也是为什么取出的元素是 Integer，参与运算时会自动拆箱。' },

    { id: 'ch10-k3', ch: 'ch10', kp: 'ch10-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '要按“学号 → 成绩”频繁查找，学号不连续、数据量大，最合适的容器是？',
      options: [
        { text: 'HashMap，学号作 key、成绩作 value', correct: true },
        { text: 'ArrayList，每次查找遍历全部元素' },
        { text: 'int 数组，用学号当下标' },
        { text: '普通 String，把学号和成绩拼在一起' }
      ],
      explain: '选容器看“主要操作”：按键查找 → HashMap（平均 O(1)）；按下标随机访问、频繁尾部追加 → ArrayList（O(1)）；频繁在头部插入/删除 → LinkedList。本题学号不连续，不能当数组下标；ArrayList 查找是 O(n)；拼字符串既慢又难维护。' },

    { id: 'ch10-k4', ch: 'ch10', kp: 'ch10-6', tier: 2, type: 'multi', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '选择用哪种容器（数组 / ArrayList / LinkedList / HashMap / HashSet）时，应该考虑哪些因素？（多选）',
      options: [
        { text: '最主要的操作是按下标访问、按 key 查找，还是头尾增删', correct: true },
        { text: '是否需要保持元素顺序、是否允许重复', correct: true },
        { text: '数据规模大概多大，操作频率有多高', correct: true },
        { text: '容器的类名是否比较短、比较好拼写' }
      ],
      explain: '选容器是工程判断：① 操作画像（随机访问 / 查找 / 插入删除的位置）；② 语义要求（有序？去重？键值映射？）；③ 规模与频率（决定常数因子是否重要）。类名拼写长度显然不是因素。课本结论：数组固定长度；ArrayList 尾部快、查找 O(n)；LinkedList 头尾插入删除 O(1)、随机访问 O(n)；HashMap 键值查找平均 O(1)；HashSet 去重。' },

    { id: 'ch10-f1', ch: 'ch10', kp: 'ch10-2', tier: 2, type: 'fill', mode: 'findbug', difficulty: 3, tags: ['bug'],
      stem: '程序本意是删除 list 中的元素 20，但运行时报错。指出哪一行有问题并改正。',
      code: 'import java.util.ArrayList;\n\npublic class Q {\n    public static void main(String[] args) {\n        ArrayList<Integer> list = new ArrayList<>();\n        list.add(10);\n        list.add(20);\n        list.add(30);\n        list.remove(20);\n        System.out.println(list);\n    }\n}',
      answer: '第 9 行：`remove(20)` 匹配的是 `remove(int index)`，按下标 20 删除会越界。要按值删除应写 `list.remove(Integer.valueOf(20))`',
      accept: [
        { hint: '指出行号（第 9 行）', any: ['第9行', '第 9 行', '9行', '行9', 'line9'] },
        { hint: '改用按值删除：`remove(Integer.valueOf(20))`（或 remove(Object)）', any: ['Integer.valueOf', 'valueOf', '按值删除', 'remove(Object', '装箱', '强转成Object'] }
      ],
      fix: 'import java.util.ArrayList;\n\npublic class Q {\n    public static void main(String[] args) {\n        ArrayList<Integer> list = new ArrayList<>();\n        list.add(10);\n        list.add(20);\n        list.add(30);\n        list.remove(Integer.valueOf(20));\n        System.out.println(list);\n    }\n}',
      explain: 'ArrayList 有两个 remove：`remove(int index)` 按下标删、`remove(Object o)` 按值删。传 `20` 是 int 字面量，编译器选 `remove(int)`，于是删下标 20 → 抛 IndexOutOfBoundsException。要按值删，必须让参数是对象：`list.remove(Integer.valueOf(20))`。这是重载解析的经典陷阱。' },

    { id: 'ch10-f2', ch: 'ch10', kp: 'ch10-5', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '下面程序编译报错。指出哪一行有问题并改正。',
      code: 'import java.util.ArrayList;\n\npublic class Q {\n    public static void main(String[] args) {\n        ArrayList<int> nums = new ArrayList<>();\n        nums.add(1);\n        nums.add(2);\n        System.out.println(nums);\n    }\n}',
      answer: '第 5 行：泛型的类型参数必须是引用类型，`ArrayList<int>` 非法，应改为 `ArrayList<Integer>`',
      accept: [
        { hint: '指出行号（第 5 行）', any: ['第5行', '第 5 行', '5行', '行5', 'line5'] },
        { hint: '把 `ArrayList<int>` 改成 `ArrayList<Integer>`（包装类）', any: ['ArrayList<Integer>', 'Integer', '包装类', '不能用基本类型', 'Integer>'] }
      ],
      fix: 'import java.util.ArrayList;\n\npublic class Q {\n    public static void main(String[] args) {\n        ArrayList<Integer> nums = new ArrayList<>();\n        nums.add(1);\n        nums.add(2);\n        System.out.println(nums);\n    }\n}',
      explain: '泛型参数只能是引用类型，不能是 int、double 等基本类型；`ArrayList&lt;int&gt;` 报 `unexpected type`。要用包装类 `ArrayList&lt;Integer&gt;`（int 会自动装箱成 Integer，取出时自动拆箱）。Java 为此给每个基本类型都配了包装类：int→Integer、double→Double、char→Character…' },

    { id: 'ch10-c1', ch: 'ch10', kp: 'ch10-2', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>evens</code>：返回一个新 <code>ArrayList&lt;Integer&gt;</code>，包含数组 <code>a</code> 中所有偶数（保持原顺序）。',
      starter: 'import java.util.ArrayList;\n\npublic class Q {\n    static ArrayList<Integer> evens(int[] a) {\n        // TODO: 把所有偶数放进新列表并返回\n        return new ArrayList<>();\n    }\n    public static void main(String[] args) {\n        int[] a = new int[args.length];\n        for (int i = 0; i < args.length; i++) {\n            a[i] = Integer.parseInt(args[i]);\n        }\n        System.out.println(evens(a));\n    }\n}',
      solution: 'import java.util.ArrayList;\n\npublic class Q {\n    static ArrayList<Integer> evens(int[] a) {\n        ArrayList<Integer> out = new ArrayList<>();\n        for (int i = 0; i < a.length; i++) {\n            if (a[i] % 2 == 0) {\n                out.add(a[i]);\n            }\n        }\n        return out;\n    }\n    public static void main(String[] args) {\n        int[] a = new int[args.length];\n        for (int i = 0; i < args.length; i++) {\n            a[i] = Integer.parseInt(args[i]);\n        }\n        System.out.println(evens(a));\n    }\n}',
      tests: [
        { args: ['1', '2', '3', '4'], expect: '[2, 4]' },
        { args: ['1', '3'], expect: '[]' },
        { args: [], expect: '[]' }
      ],
      explain: 'ArrayList 用法：`import java.util.ArrayList;` → `new ArrayList<>()` → `add(x)` 追加。泛型必须写包装类 `ArrayList&lt;Integer&gt;`（不能写 int）。注意负数取模：-4 % 2 == 0，也属于偶数，所以 `a[i] % 2 == 0` 对负数同样正确。' },

    { id: 'ch10-p1', ch: 'ch10', kp: 'ch10-2', tier: 4, type: 'predict', difficulty: 2, tags: ['output', 'trap', 'bigo'],
      stem: '读下面的程序，<b>写出完整输出（逐行）</b>。追问：① `list.remove(1)` 删的是下标还是值？② `list.get(0) + list.get(1)` 为什么能相加？③ HashMap 第二次 `put("a", 3)` 之后 size 为什么仍是 2？',
      code: 'import java.util.ArrayList;\nimport java.util.HashMap;\n\npublic class Q {\n    public static void main(String[] args) {\n        ArrayList<Integer> list = new ArrayList<>();\n        list.add(5);\n        list.add(2);\n        list.add(8);\n        list.add(2);\n        System.out.println(list);\n        System.out.println(list.size());\n        System.out.println(list.get(1));\n        list.remove(1);\n        System.out.println(list);\n        list.add(list.get(0) + list.get(1));\n        System.out.println(list);\n        list.set(0, 0);\n        System.out.println(list);\n        System.out.println(list.contains(8));\n        System.out.println(list.indexOf(2));\n        HashMap<String, Integer> map = new HashMap<>();\n        map.put("a", 1);\n        map.put("b", 2);\n        map.put("a", 3);\n        System.out.println(map.size());\n        System.out.println(map.get("a"));\n        System.out.println(map.get("c"));\n        System.out.println(map.containsKey("b"));\n    }\n}',
      answer: '[5, 2, 8, 2]\n4\n2\n[5, 8, 2]\n[5, 8, 2, 13]\n[0, 8, 2, 13]\ntrue\n2\n2\n3\nnull\ntrue',
      explain: '① add 四个元素后 `[5, 2, 8, 2]`，size=4，get(1)=2；② `list.remove(1)` 的参数 1 是 int 字面量 → 匹配 `remove(int index)`，删下标 1 的元素 2 → `[5, 8, 2]`（按值删要写 `remove(Integer.valueOf(2))`）；③ get(0)=5、get(1)=8，5+8=13 自动装箱后 add → `[5, 8, 2, 13]`；④ set(0,0) 把下标 0 改成 0 → `[0, 8, 2, 13]`；contains(8)=true；indexOf(2)=2（第一个 2 在下标 2）；⑤ HashMap 第二次 put 同一个 key 是覆盖，size 仍为 2（a、b）；get("a")=3；get("c") 不存在返回 null；containsKey("b")=true。' },

    { id: 'ch10-t1', ch: 'ch10', kp: 'ch10-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '“抽象数据类型（ADT）”描述的核心是？',
      options: [
        { text: '对外提供哪些操作、这些操作的语义是什么，而把内部实现隐藏起来', correct: true },
        { text: '数据在内存里按几个字节排列' },
        { text: '必须是 Java 的 class，不能是接口' },
        { text: '一种编译期优化技术' }
      ],
      explain: 'ADT 从**使用者视角**定义“能做什么”：有哪些数据、支持哪些操作、语义如何；内部用数组还是链表由实现决定。Java 用接口描述 ADT、用类给出实现（List 接口 ← ArrayList/LinkedList）。这样换实现时调用方代码不用改。' },

    { id: 'ch10-t2', ch: 'ch10', kp: 'ch10-4', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
      stem: '填空：需要存放“不重复”的元素集合、并快速判断某元素是否存在，应使用 `Hash_____`（补全类名，三个字母）。',
      answer: ['Set', 'set'],
      explain: 'HashSet 存**不重复**元素、contains 平均 O(1)，适合去重与存在性判断（如“判断单词是否出现过”）。需要“键 → 值”映射用 HashMap；需要保持插入顺序用 LinkedHashSet；需要排序用 TreeSet。' },

    { id: 'ch10-t3', ch: 'ch10', kp: 'ch10-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '需要“频繁按下标随机访问、主要在尾部追加”的容器，最合适的是？',
      options: [
        { text: 'ArrayList', correct: true },
        { text: 'LinkedList' },
        { text: 'HashSet' },
        { text: 'HashMap' }
      ],
      explain: 'ArrayList 底层是数组：按下标 get 是 O(1)、尾部 add 摊还 O(1)，最适合“随机访问 + 尾部追加”。LinkedList 按下标访问要逐个走（O(n)）；HashSet/HashMap 不按下标访问。反过来，频繁在头部/中间插入删除时 LinkedList 更合适。' },

    { id: 'ch10-t4', ch: 'ch10', kp: 'ch10-4', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '下面的程序用 HashMap 统计单词出现次数。写出完整输出（逐行）。',
      code: 'import java.util.HashMap;\n\npublic class Q {\n    public static void main(String[] args) {\n        String[] words = {"apple", "banana", "apple", "cherry", "banana", "apple"};\n        HashMap<String, Integer> count = new HashMap<>();\n        for (int i = 0; i < words.length; i++) {\n            String w = words[i];\n            if (count.containsKey(w)) {\n                count.put(w, count.get(w) + 1);\n            } else {\n                count.put(w, 1);\n            }\n        }\n        System.out.println(count.size());\n        System.out.println(count.get("apple"));\n        System.out.println(count.get("durian"));\n        System.out.println(count.containsKey("cherry"));\n        System.out.println(count.get("banana"));\n    }\n}',
      answer: '3\n3\nnull\ntrue\n2',
      explain: '遍历 words，已存在就 get+1 再 put，不存在就 put(w,1)。① 三个不同单词 apple/banana/cherry → size=3；② apple 出现 3 次；③ get 不存在的 key 返回 **null**；④ containsKey("cherry") 为 true；⑤ banana 出现 2 次。HashMap 的 get 返回包装类型 Integer，不存在时是 null。' },

    { id: 'ch10-t5', ch: 'ch10', kp: 'ch10-1', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '如果把方法的参数类型写成接口 `List&lt;String>` 而不是 `ArrayList&lt;String>`，好处是？',
      options: [
        { text: '调用方可以传 ArrayList、LinkedList 等任意实现，方法不必改', correct: true },
        { text: '运行速度一定更快' },
        { text: '可以绕过泛型检查' },
        { text: 'Java 不允许这么写' }
      ],
      explain: '面向接口编程：参数声明为 `List&lt;String>`，所有实现了 List 的类（ArrayList、LinkedList…）都能传入，方法内部只调用接口操作（add/get/size）。以后换实现类，方法代码完全不用动。这正是 ADT“接口与实现分离”的落地方式。' },

    { id: 'ch10-t6', ch: 'ch10', kp: 'ch10-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '`ArrayList&lt;Integer> list = new ArrayList&lt;>(); list.add(10); list.add(20); list.remove(20);` 会发生什么？',
      options: [
        { text: '运行时抛 IndexOutOfBoundsException（删下标 20 越界）', correct: true },
        { text: '正常删除元素 20，list 变成 [10]' },
        { text: '编译错误：remove 不能接受 int' },
        { text: '正常删除元素 10' }
      ],
      explain: 'remove 有两个重载：`remove(int index)` 与 `remove(Object o)`。传 int 字面量 20 时编译器选 `remove(int)`，按**下标** 20 删除 → 越界。要按值删元素必须写 `list.remove(Integer.valueOf(20))`（或 `list.remove((Object) 20)`）。' },

    { id: 'ch10-f3', ch: 'ch10', kp: 'ch10-2', tier: 2, type: 'fill', mode: 'findbug', difficulty: 3, tags: ['bug'],
      stem: '程序本意是删除列表中所有值为 2 的元素（结果应为 [1, 3]），实际输出 [1, 2, 3]。指出哪一行有问题并改正。',
      code: 'import java.util.ArrayList;\n\npublic class Q {\n    public static void main(String[] args) {\n        ArrayList<Integer> nums = new ArrayList<>();\n        nums.add(1);\n        nums.add(2);\n        nums.add(2);\n        nums.add(3);\n        for (int i = 0; i < nums.size(); i++) {\n            if (nums.get(i) == 2) {\n                nums.remove(i);\n            }\n        }\n        System.out.println(nums);\n    }\n}',
      answer: '第 12–14 行：在 for 循环里 remove(i) 后，后面的元素左移，i 继续 ++ 会跳过下一个元素。应在 remove(i) 后加 `i--;`（或改为从后往前遍历）',
      accept: [
        { hint: '指出循环中删除导致下标错位（第 13/14 行 remove 处）', any: ['i--', '下标', '错位', '跳过', 'remove(i)', '第13行', '第14行'] },
        { hint: '删除后回退下标 i--（或倒序遍历）', any: ['i--', 'i - -', '倒序', '从后往前', '往回退'] }
      ],
      fix: 'import java.util.ArrayList;\n\npublic class Q {\n    public static void main(String[] args) {\n        ArrayList<Integer> nums = new ArrayList<>();\n        nums.add(1);\n        nums.add(2);\n        nums.add(2);\n        nums.add(3);\n        for (int i = 0; i < nums.size(); i++) {\n            if (nums.get(i) == 2) {\n                nums.remove(i);\n                i--;\n            }\n        }\n        System.out.println(nums);\n    }\n}',
      explain: 'i=1 时 remove(1) 删掉第一个 2，后面的 2 左移到下标 1；循环 i++ 变 2，正好跳过了它 → 只删了一个 2。修法：remove 后 `i--` 让下一轮重新检查同一位置；或者用倒序 for、或用迭代器 remove。这是集合遍历中删除元素的经典坑。' },

    { id: 'ch10-t8', ch: 'ch10', kp: 'ch10-2', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面 ArrayList 操作程序的完整输出（逐行）。',
      code: 'import java.util.ArrayList;\n\npublic class Q {\n    public static void main(String[] args) {\n        ArrayList<String> list = new ArrayList<>();\n        list.add("b");\n        list.add("a");\n        list.add("c");\n        list.add(1, "x");\n        System.out.println(list);\n        System.out.println(list.size());\n        System.out.println(list.indexOf("c"));\n        list.remove("a");\n        System.out.println(list);\n        list.set(0, "z");\n        System.out.println(list);\n        System.out.println(list.contains("x"));\n    }\n}',
      answer: '[b, x, a, c]\n4\n3\n[b, x, c]\n[z, x, c]\ntrue',
      explain: '① add 三个后 [b, a, c]，`add(1, "x")` 在下标 1 插入 → [b, x, a, c]；② size=4，indexOf("c")=3；③ `remove("a")` 传的是对象 → 按值删除 → [b, x, c]；④ set(0,"z") 替换下标 0 → [z, x, c]；⑤ contains("x") 为 true。注意 remove(int) 与 remove(Object) 的区别。' },

    { id: 'ch10-t9', ch: 'ch10', kp: 'ch10-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '统计一篇英文文章中每个单词出现的次数，最合适的容器是？',
      options: [
        { text: 'HashMap&lt;String, Integer>：单词作 key、次数作 value', correct: true },
        { text: 'ArrayList&lt;String>：把单词依次存进去' },
        { text: 'HashSet&lt;String>：只存不重复的单词' },
        { text: '二维 int 数组' }
      ],
      explain: '“单词 → 次数”是键值映射：HashMap 的 put/get 平均 O(1)，遍历一遍文本即可完成计数（get 到 null 说明首次出现）。ArrayList 查找单词要 O(n)；HashSet 能去重但存不了次数；二维数组无法把字符串当下标。' },

    { id: 'ch10-t10', ch: 'ch10', kp: 'ch10-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '关于增强 for（for-each）与泛型，下列说法正确的是？',
      options: [
        { text: '增强 for 只能读元素，不能通过它修改数组/集合元素；泛型必须用包装类', correct: true },
        { text: '增强 for 里的循环变量是元素的引用，改它就能改集合' },
        { text: '`ArrayList&lt;int>` 是合法写法' },
        { text: '增强 for 可以同时遍历两个集合' }
      ],
      explain: '增强 for 的循环变量是**元素副本**（数组）或迭代器取出的值（集合），给变量赋值不会改原容器。要修改必须用下标或迭代器。泛型参数不能是基本类型：`ArrayList&lt;int>` 非法，必须 `ArrayList&lt;Integer>`（自动装箱）。' },

    { id: 'ch10-c2', ch: 'ch10', kp: 'ch10-1', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>sumList</code>：返回 ArrayList&lt;Integer&gt; 中所有元素之和（空列表返回 0）。',
      starter: 'import java.util.ArrayList;\n\npublic class Q {\n    static int sumList(ArrayList<Integer> list) {\n        // TODO: 返回列表中所有元素之和（空列表返回 0）\n        return 0;\n    }\n    public static void main(String[] args) {\n        ArrayList<Integer> list = new ArrayList<>();\n        for (int i = 0; i < args.length; i++) {\n            list.add(Integer.parseInt(args[i]));\n        }\n        System.out.println(sumList(list));\n    }\n}',
      solution: 'import java.util.ArrayList;\n\npublic class Q {\n    static int sumList(ArrayList<Integer> list) {\n        int sum = 0;\n        for (int i = 0; i < list.size(); i++) {\n            sum += list.get(i);\n        }\n        return sum;\n    }\n    public static void main(String[] args) {\n        ArrayList<Integer> list = new ArrayList<>();\n        for (int i = 0; i < args.length; i++) {\n            list.add(Integer.parseInt(args[i]));\n        }\n        System.out.println(sumList(list));\n    }\n}',
      tests: [
        { args: ['1', '2', '3'], expect: '6' },
        { args: [], expect: '0' }
      ],
      explain: 'ArrayList 的遍历：`for (int i = 0; i &lt; list.size(); i++) sum += list.get(i);`。注意集合用 size()（方法、带括号），数组用 length（属性）。元素是 Integer，`sum += list.get(i)` 会自动拆箱。空列表 size=0，循环不执行，返回 0。' },

    { id: 'ch10-p2', ch: 'ch10', kp: 'ch10-4', tier: 4, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '读下面的“词频 + 首次出现顺序”程序，<b>写出完整输出（逐行）</b>。追问：① order 里为什么是 [go, java, c]？② HashMap 的 size 为什么是 3？③ get 不存在的 key 返回什么？',
      code: 'import java.util.ArrayList;\nimport java.util.HashMap;\n\npublic class Q {\n    public static void main(String[] args) {\n        String[] words = {"go", "java", "go", "c", "java", "go"};\n        HashMap<String, Integer> freq = new HashMap<>();\n        ArrayList<String> order = new ArrayList<>();\n        for (int i = 0; i < words.length; i++) {\n            String w = words[i];\n            if (!freq.containsKey(w)) {\n                order.add(w);\n                freq.put(w, 1);\n            } else {\n                freq.put(w, freq.get(w) + 1);\n            }\n        }\n        System.out.println(order);\n        System.out.println(freq.size());\n        int total = 0;\n        for (int i = 0; i < order.size(); i++) {\n            String w = order.get(i);\n            System.out.println(w + ":" + freq.get(w));\n            total += freq.get(w);\n        }\n        System.out.println(total);\n        System.out.println(freq.get("c"));\n        System.out.println(freq.get("python"));\n    }\n}',
      answer: '[go, java, c]\n3\ngo:3\njava:2\nc:1\n6\n1\nnull',
      explain: '① 遍历 words：go 首次 → 加入 order；java 首次 → 加入；第二个 go 只累加次数；c 首次 → 加入；所以 order=[go, java, c]；② 三个不同单词 → freq.size()=3；③ 依次打印 go:3、java:2、c:1，total 累加 6；④ get("c")=1，get("python") 不存在 → **null**。这个程序用 ArrayList 记顺序、HashMap 记次数，是集合选型的常见组合。' },

    { id: 'ch10-c3', ch: 'ch10', kp: 'ch10-2', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>maxList</code>：返回 ArrayList&lt;Integer&gt; 中的最大元素（约定非空）。',
      starter: 'import java.util.ArrayList;\n\npublic class Q {\n    static int maxList(ArrayList<Integer> list) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        ArrayList<Integer> list = new ArrayList<>();\n        for (int i = 0; i < args.length; i++) {\n            list.add(Integer.parseInt(args[i]));\n        }\n        System.out.println(maxList(list));\n    }\n}',
      solution: 'import java.util.ArrayList;\n\npublic class Q {\n    static int maxList(ArrayList<Integer> list) {\n        int max = list.get(0);\n        for (int i = 1; i < list.size(); i++) {\n            if (list.get(i) > max) {\n                max = list.get(i);\n            }\n        }\n        return max;\n    }\n    public static void main(String[] args) {\n        ArrayList<Integer> list = new ArrayList<>();\n        for (int i = 0; i < args.length; i++) {\n            list.add(Integer.parseInt(args[i]));\n        }\n        System.out.println(maxList(list));\n    }\n}',
      tests: [
        { args: ['1', '5', '2'], expect: '5' },
        { args: ['-3', '-9'], expect: '-3' }
      ],
      explain: '集合用 size() 取长度、get(i) 取元素（不能用 a.length 或 a[i]）。最大值初值取 list.get(0)，从下标 1 开始比较。' },

    { id: 'ch10-c4', ch: 'ch10', kp: 'ch10-3', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>reverseList</code>：返回一个新 ArrayList，内容与参数相反（不修改原列表）。',
      starter: 'import java.util.ArrayList;\n\npublic class Q {\n    static ArrayList<Integer> reverseList(ArrayList<Integer> list) {\n        return new ArrayList<>();\n    }\n    public static void main(String[] args) {\n        ArrayList<Integer> list = new ArrayList<>();\n        for (int i = 0; i < args.length; i++) {\n            list.add(Integer.parseInt(args[i]));\n        }\n        System.out.println(reverseList(list));\n        System.out.println(list);\n    }\n}',
      solution: 'import java.util.ArrayList;\n\npublic class Q {\n    static ArrayList<Integer> reverseList(ArrayList<Integer> list) {\n        ArrayList<Integer> out = new ArrayList<>();\n        for (int i = list.size() - 1; i >= 0; i--) {\n            out.add(list.get(i));\n        }\n        return out;\n    }\n    public static void main(String[] args) {\n        ArrayList<Integer> list = new ArrayList<>();\n        for (int i = 0; i < args.length; i++) {\n            list.add(Integer.parseInt(args[i]));\n        }\n        System.out.println(reverseList(list));\n        System.out.println(list);\n    }\n}',
      tests: [
        { args: ['1', '2', '3'], expect: '[3, 2, 1]\n[1, 2, 3]' },
        { args: [], expect: '[]\n[]' }
      ],
      explain: '从 size()-1 倒着遍历、add 到新列表即可。第二个输出验证原列表没被修改（如果直接 list 反转就会变）。ArrayList 的 println 输出 [a, b, c] 格式。' },

    { id: 'ch10-c5', ch: 'ch10', kp: 'ch10-4', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>indexOfList</code>：返回元素 v 在列表中的下标，找不到返回 -1。',
      starter: 'import java.util.ArrayList;\n\npublic class Q {\n    static int indexOfList(ArrayList<Integer> list, int v) {\n        return -1;\n    }\n    public static void main(String[] args) {\n        ArrayList<Integer> list = new ArrayList<>();\n        for (int i = 0; i < args.length - 1; i++) {\n            list.add(Integer.parseInt(args[i]));\n        }\n        int v = Integer.parseInt(args[args.length - 1]);\n        System.out.println(indexOfList(list, v));\n    }\n}',
      solution: 'import java.util.ArrayList;\n\npublic class Q {\n    static int indexOfList(ArrayList<Integer> list, int v) {\n        for (int i = 0; i < list.size(); i++) {\n            if (list.get(i) == v) {\n                return i;\n            }\n        }\n        return -1;\n    }\n    public static void main(String[] args) {\n        ArrayList<Integer> list = new ArrayList<>();\n        for (int i = 0; i < args.length - 1; i++) {\n            list.add(Integer.parseInt(args[i]));\n        }\n        int v = Integer.parseInt(args[args.length - 1]);\n        System.out.println(indexOfList(list, v));\n    }\n}',
      tests: [
        { args: ['10', '20', '30', '20'], expect: '1' },
        { args: ['1', '2', '9'], expect: '-1' }
      ],
      explain: '线性查找：遍历列表，`list.get(i) == v` 时返回 i（Integer 与 int 比较会自动拆箱，比的是值）；循环结束返回 -1。也可以直接用 list.indexOf(v)，但手写版本能体现“查找”的过程。' },

    { id: 'ch10-c6', ch: 'ch10', kp: 'ch10-6', tier: 4, type: 'code', difficulty: 3, tags: ['code'],
      stem: '<b>跨章综合</b>：已有 <code>Book</code> 类（title、pages），补全方法 <code>longestTitle</code> 返回页数最多那本书的标题（并列取先出现的）。',
      starter: 'class Book {\n    String title;\n    int pages;\n    Book(String title, int pages) {\n        this.title = title;\n        this.pages = pages;\n    }\n}\n\npublic class Q {\n    static String longestTitle(Book[] books) {\n        return "";\n    }\n    public static void main(String[] args) {\n        Book[] books = {new Book("A", 100), new Book("B", 320), new Book("C", 320)};\n        System.out.println(longestTitle(books));\n    }\n}',
      solution: 'class Book {\n    String title;\n    int pages;\n    Book(String title, int pages) {\n        this.title = title;\n        this.pages = pages;\n    }\n}\n\npublic class Q {\n    static String longestTitle(Book[] books) {\n        int best = 0;\n        for (int i = 1; i < books.length; i++) {\n            if (books[i].pages > books[best].pages) {\n                best = i;\n            }\n        }\n        return books[best].title;\n    }\n    public static void main(String[] args) {\n        Book[] books = {new Book("A", 100), new Book("B", 320), new Book("C", 320)};\n        System.out.println(longestTitle(books));\n    }\n}',
      tests: [
        { args: [], expect: 'B' }
      ],
      explain: '与 ch07-c5 同型（对象数组找极值），但换成 Book 类，是 ch07 类 + ch10 集合思想的衔接。实际工程里可用 ArrayList&lt;Book>，这里用数组是为了让引擎能直接运行。' },

    { id: 'ch10-n1', ch: 'ch10', kp: 'ch10-7', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '为什么“边遍历集合边删除元素”特别容易出错？',
      options: [
        { text: '删除后后面的元素前移，下标/迭代器状态变化，容易跳过元素或越界', correct: true },
        { text: '因为集合不允许删除元素' },
        { text: '因为 Java 的 for 循环不支持集合' },
        { text: '因为删除操作总是抛异常' }
      ],
      explain: '数组长度固定，删掉“元素”要自己移动，所以没这个问题；集合删除后后面的元素会前移，下标 i 继续 ++ 就会跳过一个元素。用增强 for / 迭代器时直接 remove 还会触发 ConcurrentModificationException。' },

    { id: 'ch10-n2', ch: 'ch10', kp: 'ch10-7', tier: 1, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '用增强 for 遍历 ArrayList 时直接调用 `list.remove(x)`，会怎样？',
      options: [
        { text: '抛 ConcurrentModificationException（并发修改异常）', correct: true },
        { text: '正常删除，没有任何影响' },
        { text: '编译错误' },
        { text: '静默删除一半元素' }
      ],
      explain: '增强 for 底层用迭代器。迭代过程中通过 list.remove 修改集合，迭代器检测到“集合被修改了”就抛 ConcurrentModificationException。正确做法：倒序下标删除、迭代器自己的 it.remove()、或先收集再统一删。' },

    { id: 'ch10-n3', ch: 'ch10', kp: 'ch10-7', tier: 2, type: 'predict', difficulty: 3, tags: ['output', 'trap'],
      stem: '程序本意是删除列表中所有 2，写出它的**实际输出**，并想想为什么少删了一个。（追问：应该怎么改？）',
      code: 'import java.util.ArrayList;\n\npublic class Q {\n    public static void main(String[] args) {\n        ArrayList<Integer> list = new ArrayList<>();\n        list.add(1);\n        list.add(2);\n        list.add(2);\n        list.add(3);\n        list.add(2);\n        for (int i = 0; i < list.size(); i++) {\n            if (list.get(i) == 2) {\n                list.remove(i);\n            }\n        }\n        System.out.println(list);\n    }\n}',
      answer: '[1, 2, 3]',
      explain: '原列表 [1, 2, 2, 3, 2]。i=1 删掉第一个 2 → [1, 2, 3, 2]，后面的 2 前移到下标 1；i++ 变 2（跳过它）→ 检查 3；i=3 删最后一个 2 → [1, 2, 3]；size=3 时 i=3 退出。结果 [1, 2, 3]——漏删了一个 2。修法：remove 后 i--，或倒序删除，或先收集再删。' },

    { id: 'ch10-n4', ch: 'ch10', kp: 'ch10-7', tier: 4, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '<b>综合</b>：下面程序对比了三种“删除所有 2”的写法，<b>写出完整输出（逐行）</b>。追问：① 为什么 removeBad 少删了一个？② 后两种为什么正确？',
      code: 'import java.util.ArrayList;\n\npublic class Q {\n    static ArrayList<Integer> copyList(ArrayList<Integer> src) {\n        ArrayList<Integer> out = new ArrayList<>();\n        for (int i = 0; i < src.size(); i++) {\n            out.add(src.get(i));\n        }\n        return out;\n    }\n    static ArrayList<Integer> removeBad(ArrayList<Integer> src) {\n        ArrayList<Integer> list = copyList(src);\n        for (int i = 0; i < list.size(); i++) {\n            if (list.get(i) == 2) {\n                list.remove(i);\n            }\n        }\n        return list;\n    }\n    static ArrayList<Integer> removeBack(ArrayList<Integer> src) {\n        ArrayList<Integer> list = copyList(src);\n        for (int i = list.size() - 1; i >= 0; i--) {\n            if (list.get(i) == 2) {\n                list.remove(i);\n            }\n        }\n        return list;\n    }\n    static ArrayList<Integer> removeCollect(ArrayList<Integer> src) {\n        ArrayList<Integer> keep = new ArrayList<>();\n        for (int i = 0; i < src.size(); i++) {\n            if (src.get(i) != 2) {\n                keep.add(src.get(i));\n            }\n        }\n        return keep;\n    }\n    public static void main(String[] args) {\n        ArrayList<Integer> src = new ArrayList<>();\n        src.add(1);\n        src.add(2);\n        src.add(2);\n        src.add(3);\n        src.add(2);\n        System.out.println(removeBad(src));\n        System.out.println(removeBack(src));\n        System.out.println(removeCollect(src));\n        System.out.println(src);\n    }\n}',
      answer: '[1, 2, 3]\n[1, 3]\n[1, 3]\n[1, 2, 2, 3, 2]',
      explain: '① 正序删除 + 下标前移 → 跳过元素 → removeBad 得到 [1, 2, 3]（少删一个 2）；② 倒序删除：从后往前删，删除元素不会影响未遍历部分的下标 → [1, 3]；③ 先收集再删（把不需要删的留下）→ [1, 3]；④ 原列表 src 一直没被修改 → [1, 2, 2, 3, 2]。三种安全写法：倒序、迭代器 remove、先收集再统一删。' },

    { id: 'ch10-n5', ch: 'ch10', kp: 'ch10-8', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '集合类 bug 大致分两类，哪项描述正确？',
      options: [
        { text: '编译错误（泛型类型不对）容易发现；不报错但结果错（删错元素、边遍历边删、计数覆盖）是重灾区', correct: true },
        { text: '集合不会出现编译错误' },
        { text: '所有集合 bug 都会抛异常' },
        { text: '集合 bug 只可能出现在 HashMap 上' }
      ],
      explain: '泛型类型不匹配会在编译期报错（容易发现）；真正难的是运行期“结果不对”：remove 重载误用（删下标 vs 删值）、遍历中删除、HashMap 同 key 覆盖导致计数错。这类 bug 要靠打印集合内容与 size、检查每个修改操作来定位。' },

    { id: 'ch10-n6', ch: 'ch10', kp: 'ch10-8', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '调试集合 bug 时，以下哪一步最该先做？',
      options: [
        { text: '打印集合当前内容与 size，确认“你以为的集合”和实际是否一致', correct: true },
        { text: '把 ArrayList 换成数组' },
        { text: '把泛型去掉' },
        { text: '重写整个程序' }
      ],
      explain: '集合 bug 调试三步：① 打印集合内容与 size（用 [] 包住更清楚）；② 检查每个改变集合的操作调用的是哪个重载（remove(int) 还是 remove(Object)）；③ 一次只改一处再验证。先看“实际状态”比猜代码快得多。' },

    { id: 'ch10-n7', ch: 'ch10', kp: 'ch10-8', tier: 1, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '`list.remove(1)`（list 是 ArrayList&lt;Integer>）执行的是哪个操作？',
      options: [
        { text: '删除下标 1 的元素（remove(int index)）', correct: true },
        { text: '删除值为 1 的元素（remove(Object)）' },
        { text: '编译错误' },
        { text: '随机删一个' }
      ],
      explain: '参数是 int 字面量时编译器选 `remove(int index)`（按下标）；要按值删元素必须传对象：`list.remove(Integer.valueOf(1))`。这是集合题最高频的陷阱——同一个方法名两个重载，语义完全不同。' },

    { id: 'ch10-n8', ch: 'ch10', kp: 'ch10-8', tier: 2, type: 'fill', mode: 'findbug', difficulty: 3, tags: ['bug'],
      stem: '程序本意是删除列表中的元素 10，实际却删掉了 20（下标 1）。指出哪一行有问题并改正。',
      code: 'import java.util.ArrayList;\n\npublic class Q {\n    public static void main(String[] args) {\n        ArrayList<Integer> list = new ArrayList<>();\n        list.add(10);\n        list.add(20);\n        list.add(30);\n        list.remove(1);\n        System.out.println(list);\n    }\n}',
      answer: '第 9 行：`list.remove(1)` 匹配 remove(int index)，删的是下标 1 的元素 20。要按值删除应写 `list.remove(Integer.valueOf(10))`',
      accept: [
        { hint: '指出行号（第 9 行 remove 处）', any: ['第9行', '第 9 行', '9行', '行9', 'remove'] },
        { hint: '改用按值删除：`remove(Integer.valueOf(10))`（传对象）', any: ['Integer.valueOf', 'valueOf', '按值删除', '装箱', '传对象'] }
      ],
      fix: 'import java.util.ArrayList;\n\npublic class Q {\n    public static void main(String[] args) {\n        ArrayList<Integer> list = new ArrayList<>();\n        list.add(10);\n        list.add(20);\n        list.add(30);\n        list.remove(Integer.valueOf(10));\n        System.out.println(list);\n    }\n}',
      explain: 'ArrayList 的两个 remove：`remove(int index)` 按下标删、`remove(Object o)` 按值删。传 int 字面量 1 会命中按下标删除 → 删掉 20。改为 `list.remove(Integer.valueOf(10))` 后按值删 10 → [20, 30]。' },

    { id: 'ch10-n9', ch: 'ch10', kp: 'ch10-8', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '`HashMap&lt;String,Integer> m` 中先 `put("a", 1)` 再 `put("a", 2)`，size 和 get("a") 分别是？',
      options: [
        { text: 'size=1，get("a")=2', correct: true },
        { text: 'size=2，get("a")=1' },
        { text: 'size=2，get("a")=2' },
        { text: '抛异常' }
      ],
      explain: 'HashMap 的 key 唯一：对已存在的 key 再次 put 会用新值覆盖旧值，size 不变。这常导致“计数覆盖”bug——想累加次数必须 `put(k, map.get(k) + 1)`，直接 `put(k, 1)` 会把之前的计数抹掉。' },

    { id: 'ch10-n10', ch: 'ch10', kp: 'ch10-8', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '`ArrayList&lt;Integer>` 的 `get(i)` 与数组的 `a[i]` 相比，下列说法正确的是？',
      options: [
        { text: '两者都从 0 开始、按下标访问，但集合用 size() 而数组用 length', correct: true },
        { text: '集合下标从 1 开始' },
        { text: '集合的 get 越界不会报错' },
        { text: '数组和集合都不能按下标访问' }
      ],
      explain: 'ArrayList 的 get(i)/set(i,v) 与数组 a[i] 语义相同：下标从 0 开始、越界抛 IndexOutOfBoundsException（数组是 ArrayIndexOutOfBoundsException）。区别：集合用 size()（方法）、数组用 length（属性）；集合能自动扩容。' },

    { id: 'ch10-n11', ch: 'ch10', kp: 'ch10-7', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
      stem: '填空：要删除列表里所有满足条件的元素，“三种安全写法”之一是**倒序**遍历：`for (int i = list.size() - 1; i >= 0; i--)`，这样删除元素不会影响还没遍历到的 `_____`（两个字）。',
      answer: ['下标', '索引'],
      explain: '倒序删除之所以安全：删除第 i 个元素只会影响 i 后面的元素，而倒序遍历时 i 后面的元素已经处理过了，所以不会跳过或越界。这是“删除某类元素”题最常用、最不容易错的写法。' },

    { id: 'ch10-d1', ch: 'ch10', kp: 'ch10-1', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '把方法参数声明为接口类型 `List&lt;String>` 而不是 `ArrayList&lt;String>`，主要好处是？',
      options: [
        { text: '调用方可以传任何实现（ArrayList/LinkedList），方法代码不用改', correct: true },
        { text: '运行速度更快' },
        { text: '可以存基本类型' },
        { text: '可以绕过泛型检查' }
      ],
      explain: '面向接口编程：方法只需要 List 提供的能力（add/get/size）。声明成接口后，任何实现类都能传入；以后换实现（如 LinkedList）方法一行不用改。这就是 ADT“接口与实现分离”的落地方式。' },

    { id: 'ch10-d2', ch: 'ch10', kp: 'ch10-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: 'ArrayList 与 LinkedList 的关键区别是？',
      options: [
        { text: 'ArrayList 按下标访问 O(1)、中间插入删除 O(n)；LinkedList 按下标访问 O(n)、已知节点处插入删除 O(1)', correct: true },
        { text: 'ArrayList 不能自动扩容' },
        { text: 'LinkedList 能按下标访问，ArrayList 不能' },
        { text: '两者完全一样' }
      ],
      explain: 'ArrayList 底层数组：随机访问快（O(1)）、尾部追加摊还 O(1)、中间增删要移动元素（O(n)）。LinkedList 底层双向链表：按索引访问要逐个走（O(n)），但在已有节点附近增删只需改指针（O(1)）。选择看主要操作。' },

    { id: 'ch10-d3', ch: 'ch10', kp: 'ch10-5', tier: 1, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '关于泛型与增强 for，下列说法正确的是？',
      options: [
        { text: '泛型参数必须是引用类型；增强 for 只能读元素，不能通过循环变量修改容器', correct: true },
        { text: '`ArrayList&lt;int>` 合法' },
        { text: '增强 for 的循环变量是元素的引用，改它就能改集合' },
        { text: '增强 for 可以同时遍历两个集合' }
      ],
      explain: '泛型参数不能是基本类型（`ArrayList&lt;int>` 非法，必须 `ArrayList&lt;Integer>`，自动装箱）；增强 for 的循环变量是元素副本，赋值不影响容器，修改容器要用下标/迭代器。' },

    /* ============================================================ ch11 算法：排序与查找 */
    { id: 'ch11-q1', ch: 'ch11', kp: 'ch11-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept', 'bigo'],
      stem: '选择排序（selection sort）每一轮的核心动作是什么？',
      options: [
        { text: '相邻两个元素比较，逆序就交换' },
        { text: '在未排序部分找出最小元素，与未排序部分的第一个元素交换', correct: true },
        { text: '把数组切成两半分别排序再合并' },
        { text: '随机挑一个元素当基准，把小的放左边' }
      ],
      explain: '选择排序：第 i 轮在 [i, n-1] 里找最小值的下标，与 a[i] 交换，于是前 i+1 个元素有序。它的比较次数固定为 n(n-1)/2，与数据初始顺序无关。A 是冒泡，C 是归并，D 是快排。' },

    { id: 'ch11-q2', ch: 'ch11', kp: 'ch11-1', tier: 2, type: 'predict', difficulty: 2, tags: ['output', 'exam'],
      stem: '写出下面程序的输出（数字之间用空格分隔）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {7, 2, 9, 4};\n        for (int i = 0; i < a.length - 1; i++) {\n            int min = i;\n            for (int j = i + 1; j < a.length; j++)\n                if (a[j] < a[min]) min = j;\n            int t = a[i];\n            a[i] = a[min];\n            a[min] = t;\n        }\n        for (int i = 0; i < a.length; i++)\n            System.out.print(a[i] + " ");\n    }\n}',
      answer: '2 4 7 9',
      explain: '这是标准的选择排序（升序）：{7,2,9,4} → 第 1 轮找最小值 2 与 7 交换 → {2,7,9,4}；第 2 轮在 [7,9,4] 找最小值 4 与 7 交换 → {2,4,9,7}；第 3 轮 9 与 7 交换 → {2,4,7,9}。输出 `2 4 7 9 `（末尾有一个空格，判分忽略行尾空白）。' },

    { id: 'ch11-q3', ch: 'ch11', kp: 'ch11-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept', 'exam', 'bigo'],
      stem: '二分查找（binary search）能正确工作的前提是什么？',
      options: [
        { text: '数组元素必须互不相同' },
        { text: '数组必须已经排好序', correct: true },
        { text: '数组长度必须是 2 的幂' },
        { text: '数组必须是有序的 double 数组' }
      ],
      explain: '二分查找每次拿中间元素与目标比较，据此**排除一半区间**——这个推理只有在数组有序时才成立。元素可以重复，长度任意，类型任意（只要能比较大小）。' },

    { id: 'ch11-q4', ch: 'ch11', kp: 'ch11-2', tier: 2, type: 'tf', difficulty: 2, tags: ['concept', 'exam', 'bigo'],
      stem: '判断：在 n 个元素的有序数组上做二分查找，最多大约比较 log₂n + 1 次。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: '每比较一次，搜索区间缩小一半：n → n/2 → n/4 → … → 1，最多约 log₂n 次。1000 个元素最多约 10 次，而线性查找最坏要 1000 次——这就是 O(log n) 与 O(n) 的差距。' },

    { id: 'ch11-q5', ch: 'ch11', kp: 'ch11-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '插入排序（insertion sort）在哪种情况下最接近 O(n)？',
      options: [
        { text: '数组完全逆序时' },
        { text: '数组已经有序（或接近有序）时', correct: true },
        { text: '数组元素全部相同且顺序混乱时' },
        { text: '数组长度是 2 的幂时' }
      ],
      explain: '插入排序把当前元素插入前面已排好序的部分：若数组已有序，每个元素只需比较 1 次就发现位置正确，总代价 O(n)；完全逆序时每次都要移动到头，最差 O(n²)。这也是“小规模/基本有序数据用插入排序很划算”的原因。' },

    { id: 'ch11-q6', ch: 'ch11', kp: 'ch11-2', tier: 2, type: 'fill', difficulty: 2, tags: ['trap'],
      stem: '填空：二分查找取区间中点，`int mid = (lo + hi) / 2;` 也可以写成 `int mid = lo + (hi - lo) / _____;`。',
      answer: '2',
      explain: '两种写法等价：(lo + hi) / 2 == lo + (hi - lo) / 2（int 除法向下取整时也成立）。后一种写法在 lo+hi 可能溢出的语言/场景中更安全。注意整数除法的取整方向会影响 mid 落在偏左还是偏右。' },

    { id: 'ch11-q7', ch: 'ch11', kp: 'ch11-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept', 'exam', 'bigo'],
      stem: '下列哪种排序算法的平均时间复杂度是 O(n log n)，并且是稳定排序？',
      options: [
        { text: '选择排序' },
        { text: '插入排序' },
        { text: '归并排序', correct: true },
        { text: '快速排序' }
      ],
      explain: '归并排序：稳定、O(n log n)、需要 O(n) 额外空间。快速排序平均 O(n log n) 但不稳定、最坏 O(n²)、空间 O(log n)。选择排序和插入排序都是 O(n²)。考试里“稳定 + O(n log n)”基本就指向归并排序。' },

    { id: 'ch11-q8', ch: 'ch11', kp: 'ch11-2', tier: 2, type: 'mcq', difficulty: 3, tags: ['trap', 'exam'],
      stem: '在有序数组 `{1, 3, 5, 7, 9, 11, 13, 15}` 中用二分查找找 13，依次被比较的元素是？',
      options: [
        { text: '7, 11, 13', correct: true },
        { text: '7, 15, 13' },
        { text: '1, 3, 5, 7' },
        { text: '13' }
      ],
      explain: '下标 0~7，lo=0 hi=7：mid=(0+7)/2=3 → a[3]=7 < 13，lo=4；mid=(4+7)/2=5 → a[5]=11 < 13，lo=6；mid=(6+7)/2=6 → a[6]=13，找到。比较序列 7 → 11 → 13，共 3 次。手写 lo/hi/mid 三列最不容易错。' },

    { id: 'ch11-q9', ch: 'ch11', kp: 'ch11-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['syntax'],
      stem: '要直接用 Java 标准库把 `int[] a` 升序排序，正确写法是？',
      options: [
        { text: '`Arrays.sort(a);`', correct: true },
        { text: '`a.sort();`' },
        { text: '`Math.sort(a);`' },
        { text: '`a = sort(a);`' }
      ],
      explain: 'java.util.Arrays.sort(a) 对基本类型数组做升序排序（双轴快排）；需要 `import java.util.Arrays;`。数组本身没有 sort 方法，Math 也不提供排序。降序要转成 Integer[] 再配合 Collections.reverseOrder()。' },

    { id: 'ch11-k1', ch: 'ch11', kp: 'ch11-5', tier: 2, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '下面程序用“取最后一个元素作基准”的 partition 实现快速排序。写出完整输出（逐行）。',
      code: 'public class Q {\n    static int partition(int[] a, int lo, int hi) {\n        int pivot = a[hi];\n        int i = lo;\n        for (int j = lo; j < hi; j++) {\n            if (a[j] < pivot) {\n                int t = a[i];\n                a[i] = a[j];\n                a[j] = t;\n                i++;\n            }\n        }\n        int t = a[i];\n        a[i] = a[hi];\n        a[hi] = t;\n        return i;\n    }\n    static void quickSort(int[] a, int lo, int hi) {\n        if (lo >= hi) return;\n        int p = partition(a, lo, hi);\n        quickSort(a, lo, p - 1);\n        quickSort(a, p + 1, hi);\n    }\n    public static void main(String[] args) {\n        int[] a = {5, 2, 8, 1, 9};\n        quickSort(a, 0, a.length - 1);\n        for (int x : a) {\n            System.out.print(x + " ");\n        }\n        System.out.println();\n        int[] b = {3, 1, 2};\n        System.out.println(partition(b, 0, 2));\n        for (int x : b) {\n            System.out.print(x + " ");\n        }\n        System.out.println();\n    }\n}',
      answer: '1 2 5 8 9\n1\n1 2 3',
      explain: '① quickSort 把 {5,2,8,1,9} 排成升序，输出 `1 2 5 8 9`；② 第二次调用 partition({3,1,2}, 0, 2)：pivot=a[2]=2，j 从 0 扫到 1：a[0]=3 不小于 2 不动，a[1]=1<2 与 a[0] 交换 → {1,3,2}，i=1；循环后把 a[1] 与 a[2] 交换 → {1,2,3}，返回基准最终位置 1。所以输出 `1` 和 `1 2 3`。partition 返回的是基准元素排序后的最终下标，左边都比它小、右边都比它大。' },

    { id: 'ch11-k2', ch: 'ch11', kp: 'ch11-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap', 'bigo'],
      stem: '快速排序在什么情况下会退化到最坏时间复杂度 O(n²)？',
      options: [
        { text: '每次选到的基准都是当前区间的最大或最小元素（例如对已排序数组总取最后一个元素作基准）', correct: true },
        { text: '数组元素全部相同时' },
        { text: '数组元素随机排列时' },
        { text: '数组长度是奇数时' }
      ],
      explain: '快排的效率取决于基准是否把区间**大致对半分**。如果每次都取到极值（对已排序数组取最后一个作基准就是这种情况），每次只减少 1 个元素，递归深度变成 n，代价 1+2+…+n = O(n²)。随机化基准或三数取中可以避免；全相同元素若用双指针分区其实能对半分（但某些实现会退化，视实现而定）。' },

    { id: 'ch11-k3', ch: 'ch11', kp: 'ch11-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '“稳定排序（stable sort）”指什么？',
      options: [
        { text: '相等元素的相对先后顺序在排序后保持不变', correct: true },
        { text: '排序结果一定正确，不会崩溃' },
        { text: '排序过程中数组长度不变' },
        { text: '时间复杂度一定是 O(n log n)' }
      ],
      explain: '稳定性说的是**相等元素的相对次序**：若原来 A 在 B 前面且 A.equals(B)，稳定排序后 A 仍在 B 前面。比如按分数排序的学生名单，分数相同的学生应保持原顺序。插入排序、归并排序稳定；选择排序、快速排序、堆排序不稳定。稳定 + O(n log n) 同时满足的常见答案就是归并排序。' },

    { id: 'ch11-k4', ch: 'ch11', kp: 'ch11-6', tier: 1, type: 'tf', difficulty: 1, tags: ['trap'],
      stem: '判断：选择排序（selection sort）是稳定排序。',
      options: [
        { text: '正确（True）' },
        { text: '错误（False）', correct: true }
      ],
      explain: '选择排序**不稳定**：每轮把最小元素与未排序部分第一个元素交换，这个长距离交换可能把相等元素的相对顺序打乱。例如 [5a, 3, 5b] 第一轮把 3 与 5a 交换 → [3, 5a, 5b] 看似没乱，但 [3, 5a, 2, 5b] 第一轮把 2 换到最前，会让 5a 越过 5b。稳定的是插入排序、归并排序；选择、快排、堆排都不稳定。' },

    { id: 'ch11-k5', ch: 'ch11', kp: 'ch11-7', tier: 2, type: 'predict', difficulty: 3, tags: ['output', 'trap', 'bigo'],
      stem: '下面程序在**降序**数组上做二分查找（每轮打印被比较的元素）。写出完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {20, 17, 13, 9, 6, 3};\n        int target = 9;\n        int lo = 0, hi = a.length - 1, steps = 0;\n        while (lo <= hi) {\n            steps++;\n            int mid = (lo + hi) / 2;\n            System.out.print(a[mid] + " ");\n            if (a[mid] == target) {\n                break;\n            } else if (a[mid] > target) {\n                lo = mid + 1;\n            } else {\n                hi = mid - 1;\n            }\n        }\n        System.out.println();\n        System.out.println(steps);\n    }\n}',
      answer: '13 6 9\n3',
      explain: '降序数组 [20,17,13,9,6,3]，找 9：lo=0、hi=5，mid=2 → a[2]=13 > 9，说明目标在**右半边**，lo=mid+1=3；mid=(3+5)/2=4 → a[4]=6 < 9，目标在左半边，hi=mid-1=3；mid=(3+3)/2=3 → a[3]=9，找到。比较序列 `13 6 9`，共 3 次。降序时比较方向要反过来：`a[mid] > target` 才往右走。这也对应 A 卷 Q9 的降序二分题型。' },

    { id: 'ch11-k6', ch: 'ch11', kp: 'ch11-7', tier: 2, type: 'fill', difficulty: 2, tags: ['syntax'],
      stem: '填空：标准二分查找的循环条件应写成 `while (lo _____ hi)`，这样当区间只剩一个元素（lo == hi）时仍会检查它。',
      answer: ['<=', '≤'],
      explain: '二分查找用闭区间 [lo, hi] 表示搜索范围，循环条件必须是 `lo &lt;= hi`：只要区间里还有元素就继续。如果写 `lo &lt; hi`，当 lo == hi 时循环提前结束，可能漏掉最后一个候选元素（差一错误）。区间更新时：目标在右边就 lo = mid + 1，在左边就 hi = mid - 1。' },

    { id: 'ch11-f1', ch: 'ch11', kp: 'ch11-2', tier: 2, type: 'fill', mode: 'findbug', difficulty: 3, tags: ['bug'],
      stem: '程序本意是把 {5, 2, 8, 1} 升序排序，实际输出 `8 5 2 1`。指出哪一行有问题并改正。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {5, 2, 8, 1};\n        for (int i = 0; i < a.length - 1; i++) {\n            int min = i;\n            for (int j = i + 1; j < a.length; j++) {\n                if (a[j] > a[min]) {\n                    min = j;\n                }\n            }\n            int t = a[i];\n            a[i] = a[min];\n            a[min] = t;\n        }\n        for (int x : a) {\n            System.out.print(x + " ");\n        }\n        System.out.println();\n    }\n}',
      answer: '第 7 行：找最小值却用了 `a[j] > a[min]`，实际是在找最大值（于是排成降序）；应改为 `a[j] < a[min]`',
      accept: [
        { hint: '指出行号（第 7 行）', any: ['第7行', '第 7 行', '7行', '行7', 'line7'] },
        { hint: '把比较方向改成 `<`（找最小值）', any: ['a[j]<a[min]', 'a[j] < a[min]', '改成小于', '改成<', '大于改小于', '>改正'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {5, 2, 8, 1};\n        for (int i = 0; i < a.length - 1; i++) {\n            int min = i;\n            for (int j = i + 1; j < a.length; j++) {\n                if (a[j] < a[min]) {\n                    min = j;\n                }\n            }\n            int t = a[i];\n            a[i] = a[min];\n            a[min] = t;\n        }\n        for (int x : a) {\n            System.out.print(x + " ");\n        }\n        System.out.println();\n    }\n}',
      explain: '选择排序每轮要“在未排序部分找**最小**元素”，所以比较必须是 `a[j] < a[min]`。写成 `>` 就变成每轮找最大值放到前面，得到降序 `8 5 2 1`。这类 bug 的结果仍然是“有序的”，只是方向反了，必须拿预期输出（升序）对照才能发现。' },

    { id: 'ch11-f2', ch: 'ch11', kp: 'ch11-7', tier: 2, type: 'fill', mode: 'findbug', difficulty: 3, tags: ['bug'],
      stem: '程序本意是在有序数组 {1, 3, 5, 7, 9, 11} 中二分查找 9，实际输出 `not found`。指出哪一行有问题并改正。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {1, 3, 5, 7, 9, 11};\n        int target = 9;\n        int lo = 0, hi = a.length - 1;\n        boolean found = false;\n        while (lo <= hi) {\n            int mid = (lo + hi) / 2;\n            if (a[mid] == target) {\n                found = true;\n                break;\n            } else if (a[mid] < target) {\n                hi = mid - 1;\n            } else {\n                lo = mid + 1;\n            }\n        }\n        System.out.println(found ? "found" : "not found");\n    }\n}',
      answer: '第 13–16 行：区间更新方向反了。`a[mid] < target` 说明目标在**右半边**，应 `lo = mid + 1`；`a[mid] > target` 才 `hi = mid - 1`',
      accept: [
        { hint: '指出区间更新写反（第 13/15 行）', any: ['第13行', '第 13 行', '13行', '第15行', '15行', 'lo=mid+1', 'hi=mid-1', '方向反'] },
        { hint: '`a[mid] < target` 时 `lo = mid + 1`，否则 `hi = mid - 1`', any: ['lo=mid+1', 'lo = mid + 1', 'hi=mid-1', 'hi = mid - 1', '交换', '反过来'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {1, 3, 5, 7, 9, 11};\n        int target = 9;\n        int lo = 0, hi = a.length - 1;\n        boolean found = false;\n        while (lo <= hi) {\n            int mid = (lo + hi) / 2;\n            if (a[mid] == target) {\n                found = true;\n                break;\n            } else if (a[mid] < target) {\n                lo = mid + 1;\n            } else {\n                hi = mid - 1;\n            }\n        }\n        System.out.println(found ? "found" : "not found");\n    }\n}',
      explain: '二分的核心是“排除一半”：`a[mid] &lt; target` 时目标只可能在**右半**，所以把 lo 移到 mid+1；`a[mid] > target` 时目标在左半，把 hi 移到 mid-1。本题两个分支正好写反，于是区间朝着远离目标的方向缩，最后 lo>hi 退出，输出 not found。写二分时建议手算一轮 lo/hi/mid。' },

    { id: 'ch11-c1', ch: 'ch11', kp: 'ch11-7', tier: 4, type: 'code', difficulty: 3, tags: ['code'],
      stem: '补全方法 <code>binarySearch</code>：在<b>升序</b>数组 a 中查找 target，找到返回其下标，找不到返回 -1。<code>main</code> 约定：命令行参数最后一个数是 target，前面是数组元素。',
      starter: 'public class Q {\n    static int binarySearch(int[] a, int target) {\n        // TODO: 二分查找（不要用线性遍历）\n        return -1;\n    }\n    public static void main(String[] args) {\n        int target = Integer.parseInt(args[args.length - 1]);\n        int[] a = new int[args.length - 1];\n        for (int i = 0; i < a.length; i++) {\n            a[i] = Integer.parseInt(args[i]);\n        }\n        System.out.println(binarySearch(a, target));\n    }\n}',
      solution: 'public class Q {\n    static int binarySearch(int[] a, int target) {\n        int lo = 0;\n        int hi = a.length - 1;\n        while (lo <= hi) {\n            int mid = lo + (hi - lo) / 2;\n            if (a[mid] == target) {\n                return mid;\n            } else if (a[mid] < target) {\n                lo = mid + 1;\n            } else {\n                hi = mid - 1;\n            }\n        }\n        return -1;\n    }\n    public static void main(String[] args) {\n        int target = Integer.parseInt(args[args.length - 1]);\n        int[] a = new int[args.length - 1];\n        for (int i = 0; i < a.length; i++) {\n            a[i] = Integer.parseInt(args[i]);\n        }\n        System.out.println(binarySearch(a, target));\n    }\n}',
      tests: [
        { args: ['1', '3', '5', '7', '9', '11', '7'], expect: '3' },
        { args: ['1', '3', '5', '7', '9', '11', '4'], expect: '-1' },
        { args: ['1', '3', '5', '7', '9', '11', '1'], expect: '0' },
        { args: ['1', '3', '5', '7', '9', '11', '11'], expect: '5' }
      ],
      explain: '闭区间二分：lo=0、hi=length-1，`while (lo <= hi)` 保证区间只剩一个元素时仍会检查。mid 用 `lo + (hi - lo) / 2` 防止 lo+hi 溢出；比较后 `a[mid] &lt; target` 说明目标在右边 → lo = mid + 1，否则 hi = mid - 1。找不到时循环以 lo > hi 结束，返回 -1。' },

    { id: 'ch11-c2', ch: 'ch11', kp: 'ch11-3', tier: 3, type: 'code', difficulty: 3, tags: ['code'],
      stem: '补全方法 <code>insertionSort</code>：把数组<b>原地</b>升序排序（实现插入排序，不要用 Arrays.sort）。<code>main</code> 会打印排序后的元素。',
      starter: 'public class Q {\n    static void insertionSort(int[] a) {\n        // TODO: 插入排序（原地升序）\n    }\n    public static void main(String[] args) {\n        int[] a = new int[args.length];\n        for (int i = 0; i < args.length; i++) {\n            a[i] = Integer.parseInt(args[i]);\n        }\n        insertionSort(a);\n        for (int i = 0; i < a.length; i++) {\n            System.out.print(a[i] + (i == a.length - 1 ? "" : " "));\n        }\n        System.out.println();\n    }\n}',
      solution: 'public class Q {\n    static void insertionSort(int[] a) {\n        for (int i = 1; i < a.length; i++) {\n            int key = a[i];\n            int j = i - 1;\n            while (j >= 0 && a[j] > key) {\n                a[j + 1] = a[j];\n                j--;\n            }\n            a[j + 1] = key;\n        }\n    }\n    public static void main(String[] args) {\n        int[] a = new int[args.length];\n        for (int i = 0; i < args.length; i++) {\n            a[i] = Integer.parseInt(args[i]);\n        }\n        insertionSort(a);\n        for (int i = 0; i < a.length; i++) {\n            System.out.print(a[i] + (i == a.length - 1 ? "" : " "));\n        }\n        System.out.println();\n    }\n}',
      tests: [
        { args: ['5', '2', '9', '1'], expect: '1 2 5 9' },
        { args: ['1'], expect: '1' },
        { args: [], expect: '' },
        { args: ['3', '3', '1', '2'], expect: '1 2 3 3' }
      ],
      explain: '插入排序思路：把 a[1..n-1] 依次“插入”前面已排好序的部分。取出 key = a[i]，从 j = i-1 往前比较，比 key 大的元素右移一位（a[j+1] = a[j]），直到找到不大于 key 的位置，把 key 放进 a[j+1]。注意 while 条件里的 `j >= 0` 必须在前面（短路），否则 a[-1] 会越界。' },

    { id: 'ch11-p1', ch: 'ch11', kp: 'ch11-2', tier: 4, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '读下面的程序，<b>写出完整输出（逐行）</b>。追问：① 选择排序的比较次数为什么是 10？② search(a,7) 返回的 201 是怎么构造出来的（每一步 mid 是多少）？③ search(a,3) 为什么返回 -3？',
      code: 'public class Q {\n    static int comparisons = 0;\n    static void selectionSort(int[] a) {\n        for (int i = 0; i < a.length - 1; i++) {\n            int min = i;\n            for (int j = i + 1; j < a.length; j++) {\n                comparisons++;\n                if (a[j] < a[min]) {\n                    min = j;\n                }\n            }\n            int t = a[i];\n            a[i] = a[min];\n            a[min] = t;\n        }\n    }\n    static int search(int[] a, int target) {\n        int lo = 0;\n        int hi = a.length - 1;\n        int steps = 0;\n        while (lo <= hi) {\n            steps++;\n            int mid = (lo + hi) / 2;\n            if (a[mid] == target) {\n                return mid * 100 + steps;\n            }\n            if (a[mid] < target) {\n                lo = mid + 1;\n            } else {\n                hi = mid - 1;\n            }\n        }\n        return -steps;\n    }\n    public static void main(String[] args) {\n        int[] a = {9, 4, 7, 1, 8};\n        selectionSort(a);\n        for (int x : a) {\n            System.out.print(x + " ");\n        }\n        System.out.println();\n        System.out.println(comparisons);\n        System.out.println(search(a, 7));\n        System.out.println(search(a, 3));\n    }\n}',
      answer: '1 4 7 8 9\n10\n201\n-3',
      explain: '① 选择排序后数组升序 `1 4 7 8 9 `；② 比较次数：第 1 轮比较 4 次、第 2 轮 3 次、第 3 轮 2 次、第 4 轮 1 次，共 10 = n(n-1)/2；③ search(a,7)：lo=0,hi=4,mid=2 → a[2]=7 命中，返回 2*100+1 = 201（steps=1）；④ search(a,3)：mid=2 → a[2]=7>3 → hi=1；mid=(0+1)/2=0 → a[0]=1<3 → lo=1；mid=1 → a[1]=4>3 → hi=0；此时 lo=1>hi=0 退出，steps=3 → 返回 -3。这个程序把“排序 + 比较次数 + 二分查找”串在一起，正是 A 卷 Q6/Q9 的组合形态。' },

    { id: 'ch11-t1', ch: 'ch11', kp: 'ch11-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '“算法”与“实现”的关系是？',
      options: [
        { text: '同一个算法可以有多种实现（写法），正确性与复杂度是算法的属性', correct: true },
        { text: '算法就是代码，代码就是算法' },
        { text: '一种算法只能有一种实现' },
        { text: '实现的快慢与算法无关' }
      ],
      explain: '算法描述“步骤与策略”（如选择排序：每轮找最小值交换），实现是具体代码（数组版/链表版、Java/Python）。同一算法不同实现常数因子可能不同，但增长量级由算法决定。分析题常问“这段代码实现了什么算法、复杂度是多少”。' },

    { id: 'ch11-t2', ch: 'ch11', kp: 'ch11-4', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
      stem: '填空：归并排序的时间复杂度是 O(n log n)，它每层合并需要 O(n)，一共分 log n 层。那么归并排序需要的额外空间复杂度是 O(____)。',
      answer: ['n', 'N'],
      explain: '归并排序合并时要一个长度 n 的辅助数组来暂存，所以额外空间 O(n)；递归调用栈深度 O(log n)，相比 O(n) 可忽略。对比：选择排序原地交换 O(1)、快排平均 O(log n) 栈空间。' },

    { id: 'ch11-t3', ch: 'ch11', kp: 'ch11-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '“稳定排序”指的是？',
      options: [
        { text: '排序后相等元素的相对先后顺序保持不变', correct: true },
        { text: '排序一定不会出错' },
        { text: '排序过程中数组长度不变' },
        { text: '时间复杂度一定是 O(n log n)' }
      ],
      explain: '稳定性看**相等元素的相对次序**：原序列里 A 在 B 前且 A、B 相等，稳定排序后 A 仍在 B 前。常用于多关键字排序（先按成绩、再按姓名）。插入/归并稳定；选择/快排/堆排不稳定。' },

    { id: 'ch11-t4', ch: 'ch11', kp: 'ch11-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '算法 A 做 10n 次操作，算法 B 做 n² 次操作。当 n 很大时，哪个更快？',
      options: [
        { text: 'A 更快（O(n) 的增长远慢于 O(n²)）', correct: true },
        { text: 'B 更快，因为 n² 更大' },
        { text: '一样快' },
        { text: '取决于 n 的奇偶性' }
      ],
      explain: '比较大 O 时看**增长量级**：n=1000 时 A 约 10⁴ 次、B 约 10⁶ 次，差两个数量级；n 越大差距越大。常数系数（10）在 n 很大时会被低阶项淹没，这正是 Big-O 忽略常数与低阶项的原因。' },

    { id: 'ch11-t5', ch: 'ch11', kp: 'ch11-4', tier: 2, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '下面程序实现归并排序。写出排序结果的完整输出（一行）。',
      code: 'public class Q {\n    static void merge(int[] a, int[] aux, int lo, int mid, int hi) {\n        for (int k = lo; k <= hi; k++) {\n            aux[k] = a[k];\n        }\n        int i = lo;\n        int j = mid + 1;\n        for (int k = lo; k <= hi; k++) {\n            if (i > mid) {\n                a[k] = aux[j++];\n            } else if (j > hi) {\n                a[k] = aux[i++];\n            } else if (aux[j] < aux[i]) {\n                a[k] = aux[j++];\n            } else {\n                a[k] = aux[i++];\n            }\n        }\n    }\n    static void sort(int[] a, int[] aux, int lo, int hi) {\n        if (hi <= lo) {\n            return;\n        }\n        int mid = (lo + hi) / 2;\n        sort(a, aux, lo, mid);\n        sort(a, aux, mid + 1, hi);\n        merge(a, aux, lo, mid, hi);\n    }\n    public static void main(String[] args) {\n        int[] a = {5, 2, 8, 1, 9, 3};\n        int[] aux = new int[a.length];\n        sort(a, aux, 0, a.length - 1);\n        for (int x : a) {\n            System.out.print(x + " ");\n        }\n        System.out.println();\n    }\n}',
      answer: '1 2 3 5 8 9',
      explain: '归并排序：先递归把左右两半各自排好，再把两个有序段合并（合并时用 aux 暂存，双指针 i/j 逐个取较小值）。{5,2,8,1,9,3} 最终升序 → `1 2 3 5 8 9`。合并时 `aux[j] &lt; aux[i]` 用严格小于，保证相等时取左边元素 → 归并是稳定排序。' },

    { id: 'ch11-t6', ch: 'ch11', kp: 'ch11-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '快排中 partition 返回的基准下标 p 有什么性质？',
      options: [
        { text: 'a[p] 已在最终位置：左边元素都 ≤ 它、右边都 ≥ 它', correct: true },
        { text: 'p 一定是数组中间的下标' },
        { text: 'a[p] 是数组最大值' },
        { text: 'p 是本次划分的元素个数' }
      ],
      explain: 'partition 把区间分成三块：小于基准的、基准（放到 i 位置，即 p）、大于等于基准的。所以基准元素已落到排序后的最终位置，接下来递归排序左右两段即可。后续递归不再包含 p。' },

    { id: 'ch11-t7', ch: 'ch11', kp: 'ch11-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '二分查找中，若 `a[mid] &lt; target`，接下来应该怎么更新区间？',
      options: [
        { text: '`lo = mid + 1`（目标在右半边）', correct: true },
        { text: '`hi = mid - 1`（目标在左半边）' },
        { text: '`lo = mid`（保留 mid 再查一次）' },
        { text: '`hi = mid`（保留 mid 再查一次）' }
      ],
      explain: '升序数组中 a[mid] &lt; target 说明目标只可能在 mid 右边，所以 lo 移到 mid+1。写 `lo = mid` 会在区间只剩两个元素时死循环（mid 永远等于 lo）。同理 a[mid] > target 时 hi = mid - 1。' },

    { id: 'ch11-t8', ch: 'ch11', kp: 'ch11-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '在 100 万个元素的有序数组中二分查找，最多大约需要比较多少次？',
      options: [
        { text: '约 20 次', correct: true },
        { text: '约 100 次' },
        { text: '约 1000 次' },
        { text: '约 100 万次' }
      ],
      explain: '二分每轮区间减半：10⁶ → 5×10⁵ → … → 1，次数约为 ⌈log₂10⁶⌉ = 20。线性查找最坏要 100 万次——这就是 O(log n) 与 O(n) 的差距，也是“先排序再二分”值得的原因。' },

    { id: 'ch11-t9', ch: 'ch11', kp: 'ch11-6', tier: 2, type: 'mcq', difficulty: 3, tags: ['trap'],
      stem: '对数组 `{4a, 4b, 2}`（a、b 标记两个相等的 4 的先后）做**选择排序**（升序），相等元素的相对顺序会怎样？',
      options: [
        { text: '可能被打乱：交换最小值时把 4a 换到后面，4b 相对提前 → 不稳定', correct: true },
        { text: '一定保持 4a 在 4b 前，因为相等元素不会被交换' },
        { text: '无法比较，因为 4a 与 4b 不相等' },
        { text: '选择排序是稳定排序' }
      ],
      explain: '选择排序每轮把最小值与未排序区间第一个元素**长距离交换**。本例第一轮把 2 与 4a 交换 → `{2, 4b, 4a}`，4a、4b 的先后被打乱 → 不稳定。稳定排序（插入/归并）只做相邻移动，不会跨过相等元素。' },

    { id: 'ch11-f3', ch: 'ch11', kp: 'ch11-7', tier: 2, type: 'fill', mode: 'findbug', difficulty: 3, tags: ['bug'],
      stem: '程序本意是在有序数组里二分查找 9，实际输出 false。指出哪一行有问题并改正。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {1, 3, 5, 7, 9, 11};\n        int target = 9;\n        int lo = 0;\n        int hi = a.length - 1;\n        boolean found = false;\n        while (lo <= hi) {\n            int mid = (lo + hi) / 2;\n            if (a[mid] == target) {\n                found = true;\n                break;\n            } else if (a[mid] < target) {\n                hi = mid - 1;\n            } else {\n                lo = mid + 1;\n            }\n        }\n        System.out.println(found);\n    }\n}',
      answer: '第 14–17 行：区间更新方向反了。a[mid] < target 时目标在右半边，应 `lo = mid + 1`；否则 `hi = mid - 1`',
      accept: [
        { hint: '指出区间更新写反（第 14/16 行）', any: ['第14行', '第 14 行', '14行', '第16行', '16行', '方向反', '写反'] },
        { hint: 'a[mid] < target 时应 `lo = mid + 1`，否则 `hi = mid - 1`', any: ['lo=mid+1', 'lo = mid + 1', 'hi=mid-1', 'hi = mid - 1', '交换', '反过来'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {1, 3, 5, 7, 9, 11};\n        int target = 9;\n        int lo = 0;\n        int hi = a.length - 1;\n        boolean found = false;\n        while (lo <= hi) {\n            int mid = (lo + hi) / 2;\n            if (a[mid] == target) {\n                found = true;\n                break;\n            } else if (a[mid] < target) {\n                lo = mid + 1;\n            } else {\n                hi = mid - 1;\n            }\n        }\n        System.out.println(found);\n    }\n}',
      explain: '二分靠“a[mid] 与 target 的大小关系”决定丢哪一半。本题 a[mid] &lt; target 时却把 hi 往左移（丢弃右半），区间朝错误方向收缩，最后 lo>hi 退出 → false。正确：小于目标 → lo=mid+1；大于目标 → hi=mid-1。手算一轮 lo/hi/mid 就能发现方向错。' },

    { id: 'ch11-t11', ch: 'ch11', kp: 'ch11-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap'],
      stem: '快速排序在什么情况下退化到 O(n²)？',
      options: [
        { text: '每次选到的基准都是当前区间的最大/最小值（如对已排序数组固定取最后一个元素）', correct: true },
        { text: '数组元素互不相同时' },
        { text: '数组长度是 2 的幂时' },
        { text: '任何情况下快排都是 O(n log n)' }
      ],
      explain: '快排的效率取决于基准能否把区间大致对半。若每次基准都是极值，每轮只减少 1 个元素，递归深度 n，代价 1+2+…+n = O(n²)。随机化基准、三数取中可以避免。对已排序数组固定取最后一个元素就是典型退化场景。' },

    { id: 'ch11-p2', ch: 'ch11', kp: 'ch11-4', tier: 4, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '读下面的归并排序程序（带比较次数统计），<b>写出完整输出（逐行）</b>。追问：① 排序结果是什么？② 比较次数为什么是 5？③ 为什么归并排序是稳定排序？',
      code: 'public class Q {\n    static int comparisons = 0;\n    static void merge(int[] a, int[] aux, int lo, int mid, int hi) {\n        for (int k = lo; k <= hi; k++) {\n            aux[k] = a[k];\n        }\n        int i = lo;\n        int j = mid + 1;\n        for (int k = lo; k <= hi; k++) {\n            if (i > mid) {\n                a[k] = aux[j++];\n            } else if (j > hi) {\n                a[k] = aux[i++];\n            } else if (aux[j] < aux[i]) {\n                comparisons++;\n                a[k] = aux[j++];\n            } else {\n                comparisons++;\n                a[k] = aux[i++];\n            }\n        }\n    }\n    static void sort(int[] a, int[] aux, int lo, int hi) {\n        if (hi <= lo) {\n            return;\n        }\n        int mid = (lo + hi) / 2;\n        sort(a, aux, lo, mid);\n        sort(a, aux, mid + 1, hi);\n        merge(a, aux, lo, mid, hi);\n    }\n    public static void main(String[] args) {\n        int[] a = {4, 1, 3, 2};\n        int[] aux = new int[a.length];\n        sort(a, aux, 0, a.length - 1);\n        for (int x : a) {\n            System.out.print(x + " ");\n        }\n        System.out.println();\n        System.out.println(comparisons);\n    }\n}',
      answer: '1 2 3 4\n5',
      explain: '① 归并排序 {4,1,3,2} → `1 2 3 4`；② 比较过程：合并 (4,1) 比较 1 次、合并 (3,2) 比较 1 次、合并 (1,4) 与 (2,3) 比较 3 次 → 共 5 次；③ 合并时 `aux[j] &lt; aux[i]` 用严格小于，相等时取左边元素，所以相等元素的相对顺序不变 → 稳定。归并排序时间 O(n log n)、空间 O(n)。' },

    { id: 'ch11-p3', ch: 'ch11', kp: 'ch11-5', tier: 4, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '读下面的 partition 程序，<b>写出完整输出（逐行）</b>。追问：① 第一次 partition 的基准 3 最后落在哪个下标？② 第一次 partition 后数组长什么样？③ 第二次 partition 返回的 0 表示什么？',
      code: 'public class Q {\n    static int partition(int[] a, int lo, int hi) {\n        int pivot = a[hi];\n        int i = lo;\n        for (int j = lo; j < hi; j++) {\n            if (a[j] < pivot) {\n                int t = a[i];\n                a[i] = a[j];\n                a[j] = t;\n                i++;\n            }\n        }\n        int t = a[i];\n        a[i] = a[hi];\n        a[hi] = t;\n        return i;\n    }\n    public static void main(String[] args) {\n        int[] a = {5, 2, 8, 1, 9, 3};\n        int p = partition(a, 0, a.length - 1);\n        System.out.println(p);\n        for (int x : a) {\n            System.out.print(x + " ");\n        }\n        System.out.println();\n        int p2 = partition(a, 0, p - 1);\n        System.out.println(p2);\n        for (int x : a) {\n            System.out.print(x + " ");\n        }\n        System.out.println();\n    }\n}',
      answer: '2\n2 1 3 5 9 8\n0\n1 2 3 5 9 8',
      explain: '① 第一次 partition：pivot=a[5]=3，i 从 0 扫 j：2&lt;3、1&lt;3 被换到前面，最后把 3 与本该放的位置交换 → 返回 2（基准下标）；② 数组变为 `2 1 3 5 9 8`：3 左边都小于它、右边都不小于它；③ 第二次 partition(a, 0, 1)：pivot=1，返回 0（1 落到下标 0）→ `1 2 3 5 9 8`。partition 的返回值就是基准的最终位置，也是下一轮递归的分界。' },

    { id: 'ch11-c3', ch: 'ch11', kp: 'ch11-2', tier: 3, type: 'code', difficulty: 2, tags: ['code', 'bigo'],
      stem: '补全方法 <code>countComparisons</code>：返回对 n 个元素做<b>选择排序</b>时一共进行多少次元素比较。',
      starter: 'public class Q {\n    static int countComparisons(int n) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(countComparisons(n));\n    }\n}',
      solution: 'public class Q {\n    static int countComparisons(int n) {\n        int count = 0;\n        for (int i = 0; i < n - 1; i++) {\n            count += n - 1 - i;\n        }\n        return count;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(countComparisons(n));\n    }\n}',
      tests: [
        { args: ['4'], expect: '6' },
        { args: ['1'], expect: '0' },
        { args: ['10'], expect: '45' }
      ],
      explain: '选择排序第 i 轮在 [i, n-1] 中找最小值，需要 n-1-i 次比较；总次数 (n-1)+(n-2)+…+1 = n(n-1)/2。n=4 → 6、n=10 → 45。这个公式与数据初始顺序无关。' },

    { id: 'ch11-c4', ch: 'ch11', kp: 'ch11-7', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>linearSearch</code>：在数组中线性查找 target，找到返回下标，找不到返回 -1。',
      starter: 'public class Q {\n    static int linearSearch(int[] a, int t) {\n        return -1;\n    }\n    public static void main(String[] args) {\n        int[] a = {4, 2, 7, 9};\n        int t = Integer.parseInt(args[0]);\n        System.out.println(linearSearch(a, t));\n    }\n}',
      solution: 'public class Q {\n    static int linearSearch(int[] a, int t) {\n        for (int i = 0; i < a.length; i++) {\n            if (a[i] == t) {\n                return i;\n            }\n        }\n        return -1;\n    }\n    public static void main(String[] args) {\n        int[] a = {4, 2, 7, 9};\n        int t = Integer.parseInt(args[0]);\n        System.out.println(linearSearch(a, t));\n    }\n}',
      tests: [
        { args: ['7'], expect: '2' },
        { args: ['4'], expect: '0' },
        { args: ['5'], expect: '-1' }
      ],
      explain: '线性查找就是从头到尾逐个比较，最坏 O(n)。数组无需有序（这是它与二分查找的关键区别）。' },

    { id: 'ch11-c5', ch: 'ch11', kp: 'ch11-4', tier: 3, type: 'code', difficulty: 3, tags: ['code', 'bigo'],
      stem: '补全方法 <code>bsearchSteps</code>：在<b>升序</b>数组 a 中二分查找 target，返回比较次数；找不到返回 -1。',
      starter: 'public class Q {\n    static int bsearchSteps(int[] a, int target) {\n        return -1;\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 3, 5, 7, 9, 11};\n        int t = Integer.parseInt(args[0]);\n        System.out.println(bsearchSteps(a, t));\n    }\n}',
      solution: 'public class Q {\n    static int bsearchSteps(int[] a, int target) {\n        int lo = 0;\n        int hi = a.length - 1;\n        int steps = 0;\n        while (lo <= hi) {\n            steps++;\n            int mid = (lo + hi) / 2;\n            if (a[mid] == target) {\n                return steps;\n            } else if (a[mid] < target) {\n                lo = mid + 1;\n            } else {\n                hi = mid - 1;\n            }\n        }\n        return -1;\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 3, 5, 7, 9, 11};\n        int t = Integer.parseInt(args[0]);\n        System.out.println(bsearchSteps(a, t));\n    }\n}',
      tests: [
        { args: ['7'], expect: '3' },
        { args: ['1'], expect: '2' },
        { args: ['4'], expect: '-1' }
      ],
      explain: '二分查找 + 计数器：每轮比较前 steps++。6 个元素找 7：mid=2（a[2]=5&lt;7）→ lo=3；mid=4（a[4]=9>7）→ hi=3；mid=3 命中 → 3 次。找 1：mid=2（5>1）→ hi=1；mid=0（1 命中）→ 2 次。找 4：3 次比较后 lo>hi 退出 → -1。' },

    { id: 'ch11-c6', ch: 'ch11', kp: 'ch11-2', tier: 4, type: 'code', difficulty: 3, tags: ['code', 'bigo'],
      stem: '<b>跨章综合</b>：已有两个方法骨架——<code>selectionSort</code>（选择排序）与 <code>binarySearch</code>（二分查找），补全 <code>analyze</code>：先排序，再二分查找 target，返回 <code>sorted=[...],idx=...</code> 字符串。',
      starter: 'public class Q {\n    static void selectionSort(int[] a) {\n        // TODO: 选择排序\n    }\n    static int binarySearch(int[] a, int t) {\n        return -1;\n    }\n    static String analyze(int[] a, int target) {\n        return "";\n    }\n    public static void main(String[] args) {\n        int[] a = {7, 2, 9, 4};\n        System.out.println(analyze(a, 7));\n        System.out.println(analyze(a, 5));\n    }\n}',
      solution: 'public class Q {\n    static void selectionSort(int[] a) {\n        for (int i = 0; i < a.length - 1; i++) {\n            int min = i;\n            for (int j = i + 1; j < a.length; j++) {\n                if (a[j] < a[min]) {\n                    min = j;\n                }\n            }\n            int t = a[i];\n            a[i] = a[min];\n            a[min] = t;\n        }\n    }\n    static int binarySearch(int[] a, int t) {\n        int lo = 0;\n        int hi = a.length - 1;\n        while (lo <= hi) {\n            int mid = (lo + hi) / 2;\n            if (a[mid] == t) {\n                return mid;\n            } else if (a[mid] < t) {\n                lo = mid + 1;\n            } else {\n                hi = mid - 1;\n            }\n        }\n        return -1;\n    }\n    static String analyze(int[] a, int target) {\n        selectionSort(a);\n        int idx = binarySearch(a, target);\n        return "sorted=" + java.util.Arrays.toString(a) + ",idx=" + idx;\n    }\n    public static void main(String[] args) {\n        int[] a = {7, 2, 9, 4};\n        System.out.println(analyze(a, 7));\n        System.out.println(analyze(a, 5));\n    }\n}',
      tests: [
        { args: [], expect: 'sorted=[2, 4, 7, 9],idx=2\nsorted=[2, 4, 7, 9],idx=-1' }
      ],
      explain: '三个方法协作：selectionSort 原地排序 → binarySearch 必须有序才能用 → analyze 组合并格式化输出。第一次 target=7：排序后下标 2；第二次 target=5 不存在返回 -1。这是“排序 + 查找 + 字符串拼接”的跨章综合题。' },

    { id: 'ch11-n1', ch: 'ch11', kp: 'ch11-8', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '调试排序/查找算法时，最有效的做法是？',
      options: [
        { text: '用 5–6 个元素的小数组，手写“轮次 / lo / hi / mid / 数组状态”追踪表，逐行对照程序输出', correct: true },
        { text: '盯着代码看，直到看出问题' },
        { text: '把数组长度改成 1000 再试' },
        { text: '把排序改成 Arrays.sort' }
      ],
      explain: '排序/查找 bug 要么不报错但结果错、要么死循环。最有效的调试是手写追踪表：用 5–6 个元素的小数组，列出每轮的 i、j、lo、hi、mid 与数组状态，和程序输出对照，找到第一个不一致的位置。' },

    { id: 'ch11-n2', ch: 'ch11', kp: 'ch11-8', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '排序/查找 bug 常见的两种症状是？',
      options: [
        { text: '不报错但结果错（比较方向错、边界差一）；或直接死循环（区间不推进）', correct: true },
        { text: '一定是编译错误' },
        { text: '一定是数组越界' },
        { text: '只可能出现在字符串排序中' }
      ],
      explain: '排序 bug：比较符号写反（> 写成 &lt;）→ 排成降序但“看起来有序”；循环边界多/少一轮 → 漏元素。二分 bug：`lo = mid`（不 +1）→ 区间不收缩 → 死循环；方向写反 → 找不到。两者都不报异常，要靠追踪表。' },

    { id: 'ch11-n3', ch: 'ch11', kp: 'ch11-8', tier: 1, type: 'fill', difficulty: 2, tags: ['trap'],
      stem: '填空：二分查找若写成 `if (a[mid] &lt; target) lo = mid;`（而不是 lo = mid + 1），在区间只剩两个元素时可能陷入 `_____`（三个字）。',
      answer: ['死循环', '无限循环'],
      explain: '当区间为 [lo, hi] 且 mid == lo 时，`lo = mid` 不会让 lo 前进，区间永远不收缩 → 死循环。正确写法 lo = mid + 1（目标在右半，mid 已比较过可以排除）。这是二分查找最经典的 bug。' },

    { id: 'ch11-n4', ch: 'ch11', kp: 'ch11-8', tier: 2, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '写出下面“选择排序 + 二分查找”程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int[] a = {5, 2, 8, 1};\n        for (int i = 0; i < a.length; i++) {\n            int min = i;\n            for (int j = i + 1; j < a.length; j++) {\n                if (a[j] < a[min]) {\n                    min = j;\n                }\n            }\n            int t = a[i];\n            a[i] = a[min];\n            a[min] = t;\n        }\n        for (int x : a) {\n            System.out.print(x + " ");\n        }\n        System.out.println();\n        int target = 8;\n        int lo = 0;\n        int hi = a.length - 1;\n        int steps = 0;\n        boolean found = false;\n        while (lo <= hi) {\n            steps++;\n            int mid = (lo + hi) / 2;\n            if (a[mid] == target) {\n                found = true;\n                break;\n            } else if (a[mid] < target) {\n                lo = mid + 1;\n            } else {\n                hi = mid - 1;\n            }\n        }\n        System.out.println(found + " steps=" + steps);\n    }\n}',
      answer: '1 2 5 8\ntrue steps=3',
      explain: '① 选择排序 {5,2,8,1} → 升序 1 2 5 8；② 二分查找 8：lo=0,hi=3 → mid=1（2&lt;8）→ lo=2；mid=(2+3)/2=2（5&lt;8）→ lo=3；mid=3 → a[3]=8 命中，steps=3 → `true steps=3`。用追踪表把每轮 lo/hi/mid 写下来，就不会数错。' },

    { id: 'ch11-n5', ch: 'ch11', kp: 'ch11-8', tier: 4, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '<b>综合</b>：读下面的插入排序（带比较计数）+ 二分查找（带步数）程序，<b>写出完整输出（逐行）</b>。追问：① 排序后数组是什么？② comparisons 为什么是 6？③ steps(9) 为什么是 -1？',
      code: 'public class Q {\n    static int comparisons = 0;\n    static void insertionSort(int[] a) {\n        for (int i = 1; i < a.length; i++) {\n            int key = a[i];\n            int j = i - 1;\n            while (j >= 0 && a[j] > key) {\n                comparisons++;\n                a[j + 1] = a[j];\n                j--;\n            }\n            if (j >= 0) {\n                comparisons++;\n            }\n            a[j + 1] = key;\n        }\n    }\n    static int binarySearchSteps(int[] a, int t) {\n        int lo = 0;\n        int hi = a.length - 1;\n        int steps = 0;\n        while (lo <= hi) {\n            steps++;\n            int mid = (lo + hi) / 2;\n            if (a[mid] == t) {\n                return steps;\n            }\n            if (a[mid] < t) {\n                lo = mid + 1;\n            } else {\n                hi = mid - 1;\n            }\n        }\n        return -1;\n    }\n    public static void main(String[] args) {\n        int[] a = {4, 1, 3, 2};\n        insertionSort(a);\n        System.out.println(java.util.Arrays.toString(a));\n        System.out.println("comparisons=" + comparisons);\n        System.out.println("steps(3)=" + binarySearchSteps(a, 3));\n        System.out.println("steps(9)=" + binarySearchSteps(a, 9));\n    }\n}',
      answer: '[1, 2, 3, 4]\ncomparisons=6\nsteps(3)=2\nsteps(9)=-1',
      explain: '① 插入排序 {4,1,3,2} → [1, 2, 3, 4]；② 比较计数：i=1 时 while 比较 1 次；i=2 时 while 比较 1 次（4>3）+ 退出后 1 次；i=3 时 while 比较 2 次（4>2、3>2）+ 退出后 1 次 → 共 6 次；③ binarySearchSteps(3)：mid=1(2&lt;3)→lo=2；mid=2 命中 steps=2；④ steps(9)：依次 mid=1、2、3 都不等，lo=4>hi=3 退出 → 返回 -1。追踪表是这类题唯一可靠的解法。' },

    { id: 'ch11-d1', ch: 'ch11', kp: 'ch11-1', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '“同一个算法可以有不同实现”，下面哪项最能体现这句话？',
      options: [
        { text: '选择排序既可以写数组版，也可以写 ArrayList 版，比较次数与复杂度不变', correct: true },
        { text: '排序算法只能用一种语言写' },
        { text: '算法和实现是同一个东西' },
        { text: '同一算法的所有实现运行速度完全一样' }
      ],
      explain: '算法是“步骤与策略”（每轮找最小值交换），实现是具体代码（数组/ArrayList、Java/Python）。实现影响常数因子，但不改变算法的增长量级。分析题要能说出“这段代码实现的是什么算法、复杂度多少”。' },

    { id: 'ch11-d2', ch: 'ch11', kp: 'ch11-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '插入排序在处理“已经基本有序”的数组时表现如何？',
      options: [
        { text: '接近 O(n)：每个元素只需少量比较就能找到位置', correct: true },
        { text: '仍然是最差 O(n²)' },
        { text: '比在逆序数组上更慢' },
        { text: '无法处理已排序的数组' }
      ],
      explain: '插入排序把当前元素插入前面已排好序的部分：若数组已基本有序，每个元素只需比较一两次就停止，总代价接近 O(n)；完全逆序时每个元素都要移动到头部，最差 O(n²)。这也是“小规模/基本有序数据用插入排序很划算”的原因。' },

    { id: 'ch11-d3', ch: 'ch11', kp: 'ch11-3', tier: 1, type: 'fill', difficulty: 2, tags: ['concept'],
      stem: '填空：插入排序的循环体先保存 `key = a[i]`，然后从 `j = i - 1` 往前比较，把比 key 大的元素向右移动，最后把 key 放到 `a[j + _____]`。',
      answer: ['1', '一'],
      explain: '移动结束时 j 指向“第一个不大于 key 的位置”，key 应放在它右边一格，即 `a[j + 1] = key`。这个 +1 是插入排序最容易写错的地方（差一错误）；同时 while 条件 `j >= 0 && a[j] > key` 的短路顺序也重要（先判 j 防越界）。' },

    { id: 'ch11-d4', ch: 'ch11', kp: 'ch11-6', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '把“按成绩降序、成绩相同按姓名升序”排序，为什么要求排序算法稳定（或需要多关键字比较）？',
      options: [
        { text: '稳定排序能保留第一关键字相等时第二关键字的原有顺序', correct: true },
        { text: '稳定排序一定更快' },
        { text: '不稳定排序无法处理字符串' },
        { text: '稳定性与多关键字排序无关' }
      ],
      explain: '多关键字排序常用“先按次要关键字排、再稳定地按主要关键字排”：第二次排序时，相等的主要关键字元素保持第一次的顺序。若排序不稳定，第二关键字顺序会被打乱。这就是稳定排序的实际价值。' },

    /* ============================================================ ch12 递归 */
    { id: 'ch12-q1', ch: 'ch12', kp: 'ch12-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept', 'exam'],
      stem: '一个正确的递归方法必须包含哪两个部分？',
      options: [
        { text: '循环和 break' },
        { text: '基线条件（base case）和递归步骤（recursive step）', correct: true },
        { text: '构造器和 main 方法' },
        { text: '静态变量和 this' }
      ],
      explain: '基线条件：最小规模时直接返回、不再递归（否则无限递归直到 StackOverflowError）；递归步骤：把问题缩小成规模更小的同类子问题并调用自己。写递归先想“最小情况是什么”，再想“怎么变小”。' },

    { id: 'ch12-q2', ch: 'ch12', kp: 'ch12-2', tier: 2, type: 'predict', difficulty: 3, tags: ['output', 'exam'],
      stem: '写出下面程序输出的一行字符（不要空格）。',
      code: 'public class Q {\n    static void f(int n) {\n        if (n == 0) return;\n        System.out.print(n);\n        f(n - 1);\n        System.out.print(n);\n    }\n    public static void main(String[] args) {\n        f(3);\n    }\n}',
      answer: '321123',
      explain: '递归分“去程”和“回程”：去程依次打印 3、2、1（每次先 print 再递归）；f(0) 直接 return；回程从最内层开始依次打印 1、2、3。合起来 321 + 123 = 321123。递归调用后面的语句要等子调用返回后才执行，这是理解递归的关键。' },

    { id: 'ch12-q3', ch: 'ch12', kp: 'ch12-3', tier: 2, type: 'mcq', difficulty: 3, tags: ['trap'],
      stem: '下面方法被 `f(5)` 调用时，一共会执行多少次 f（含最外层 f(5)）？',
      code: 'static int f(int n) {\n    if (n <= 1) return 1;\n    return f(n - 1) + f(n - 1);\n}',
      options: [
        { text: '16' },
        { text: '31', correct: true },
        { text: '32' },
        { text: '5' }
      ],
      explain: '画出调用树：f(5) 调用 2 次 f(4)，f(4) 调用 2 次 f(3)……到 f(1) 停止。第 k 层有 2^k 个节点：1 + 2 + 4 + 8 + 16 = 31 次。这也是为什么“每次分两支”的递归是指数级 O(2^n)——两个 f 调用完全相同，重复计算了整棵子树。' },

    { id: 'ch12-q4', ch: 'ch12', kp: 'ch12-4', tier: 2, type: 'tf', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '判断：朴素的递归斐波那契 `fib(n) = fib(n-1) + fib(n-2)` 会重复计算大量子问题，时间复杂度是指数级的。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: 'fib(n) 的调用树里 fib(n-2) 被算了很多次，节点数随 n 指数增长（约 O(1.618^n)）。n=40 就要几亿次调用。用记忆化（把算过的值存起来）或改写成迭代，可以降到 O(n)。' },

    { id: 'ch12-q5', ch: 'ch12', kp: 'ch12-2', tier: 2, type: 'predict', difficulty: 2, tags: ['output', 'exam'],
      stem: '写出下面程序的输出。',
      code: 'public class Q {\n    static int g(int n) {\n        if (n == 0) return 0;\n        return n + g(n - 1);\n    }\n    public static void main(String[] args) {\n        System.out.println(g(4));\n    }\n}',
      answer: '10',
      explain: '展开：g(4) = 4 + g(3) = 4 + 3 + g(2) = 4 + 3 + 2 + g(1) = 4 + 3 + 2 + 1 + g(0) = 10。这是用递归求 1+2+…+n，基线条件 g(0)=0 让递归停下来，返回值一层层加回去。' },

    { id: 'ch12-q6', ch: 'ch12', kp: 'ch12-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: 'n 个盘子的汉诺塔，最少需要移动多少次？',
      options: [
        { text: '2n' },
        { text: 'n²' },
        { text: '2ⁿ - 1', correct: true },
        { text: 'n!' }
      ],
      explain: '递推：T(1)=1，T(n)=2·T(n-1)+1。把它展开得 T(n)=2^n-1。思路：先把上面 n-1 个盘子移到辅助柱，把最大盘移到目标柱，再把 n-1 个移过去——正好两次子问题加一步。' },

    { id: 'ch12-q7', ch: 'ch12', kp: 'ch12-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '关于递归与迭代，下列说法正确的是？',
      options: [
        { text: '递归一定比迭代快' },
        { text: '递归通常更简洁，但有调用栈开销，深度过大会栈溢出', correct: true },
        { text: '递归不需要终止条件' },
        { text: '迭代无法实现斐波那契数列' }
      ],
      explain: '递归代码贴近数学定义、可读性好，但每次调用都有栈帧开销，深度大时可能 StackOverflowError；迭代用循环，没有调用开销，但代码有时更啰嗦。两者可以互相转换。' },

    { id: 'ch12-q8', ch: 'ch12', kp: 'ch12-3', tier: 2, type: 'mcq', difficulty: 3, tags: ['trap', 'bigo'],
      stem: '用朴素递归计算 `fib(6)`（fib(0)=0，fib(1)=1，其余 fib(n)=fib(n-1)+fib(n-2)），一共调用 fib 函数多少次（含最外层 fib(6)）？',
      options: [
        { text: '13' },
        { text: '25', correct: true },
        { text: '32' },
        { text: '7' }
      ],
      explain: '记 C(n) 为调用次数：C(0)=C(1)=1，C(n)=1+C(n-1)+C(n-2)。依次得 C(2)=3、C(3)=5、C(4)=9、C(5)=15、C(6)=25。只有 fib(0)~fib(6) 共 7 个不同结果，却被调用了 25 次——这就是重复计算。' },

    { id: 'ch12-q9', ch: 'ch12', kp: 'ch12-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '递归算法的额外空间复杂度主要由什么决定？',
      options: [
        { text: '递归调用栈的最大深度', correct: true },
        { text: '输入数组的长度，与递归无关' },
        { text: '循环嵌套的层数' },
        { text: '程序中变量的总个数' }
      ],
      explain: '每次递归调用都会压入一个栈帧，同时存活的栈帧数 = 递归深度，所以空间复杂度 = O(最大深度)。例如朴素斐波那契 O(n)，快速排序平均 O(log n)，归并排序的栈是 O(log n) 但合并需要额外 O(n) 数组。' },

    { id: 'ch12-k1', ch: 'ch12', kp: 'ch12-7', tier: 2, type: 'predict', difficulty: 2, tags: ['output', 'bigo'],
      stem: '下面同时用迭代和递归求和，并统计递归幂函数的调用次数。写出完整输出（逐行）。',
      code: 'public class Q {\n    static int iterSum(int n) {\n        int s = 0;\n        for (int i = 1; i <= n; i++) {\n            s += i;\n        }\n        return s;\n    }\n    static int recSum(int n) {\n        if (n == 0) return 0;\n        return n + recSum(n - 1);\n    }\n    static int recCount = 0;\n    static int recPower(int b, int e) {\n        recCount++;\n        if (e == 0) return 1;\n        return b * recPower(b, e - 1);\n    }\n    public static void main(String[] args) {\n        System.out.println(iterSum(10) + " " + recSum(10));\n        System.out.println(recPower(2, 5));\n        System.out.println(recCount);\n    }\n}',
      answer: '55 55\n32\n6',
      explain: '① iterSum(10) 与 recSum(10) 都得到 55，说明递归和迭代可以互相转换；② recPower(2,5) 递归计算 2×2×2×2×2 = 32；③ recCount 统计 recPower 被调用了几次：e=5、4、3、2、1、0 共 6 次（含 e==0 的基线调用）。递归的每一次调用都压栈，所以深度 = 调用层数；迭代用循环变量保存状态，没有栈开销。' },

    { id: 'ch12-k2', ch: 'ch12', kp: 'ch12-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '关于递归与迭代的取舍，下列说法最准确的是？',
      options: [
        { text: '递归代码更贴近定义、可读性好，但有调用栈开销、深度过大会栈溢出；迭代没有这些开销但代码可能更啰嗦', correct: true },
        { text: '递归一定比迭代快，因为不用循环' },
        { text: '迭代一定比递归省内存，所以应该永远用迭代' },
        { text: 'Java 会自动把递归优化成迭代' }
      ],
      explain: '两者各有代价：递归每次调用都建栈帧（时间 + 空间 O(深度)），但把“怎么缩小问题”表达得很清楚；迭代用循环变量保存状态，常数更小、不怕深度。Java **没有**自动尾递归优化，深度大时递归会 StackOverflowError。实践：递归树类问题（汉诺塔、分治）用递归更自然；线性累加、深度可能很大时用迭代。' },

    { id: 'ch12-f1', ch: 'ch12', kp: 'ch12-1', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '程序编译通过，但运行时崩溃。指出哪一行有问题并改正。',
      code: 'public class Q {\n    static int sum(int n) {\n        if (n == 0) {\n            return 0;\n        }\n        return n + sum(n);\n    }\n    public static void main(String[] args) {\n        System.out.println(sum(3));\n    }\n}',
      answer: '第 6 行：递归调用没有把问题缩小，`sum(n)` 永远调用自己；应改为 `return n + sum(n - 1);`',
      accept: [
        { hint: '指出行号（第 6 行）', any: ['第6行', '第 6 行', '6行', '行6', 'line6'] },
        { hint: '递归参数要缩小：改成 `sum(n - 1)`', any: ['sum(n-1)', 'sum(n - 1)', 'n-1', '参数减1', '缩小问题'] }
      ],
      fix: 'public class Q {\n    static int sum(int n) {\n        if (n == 0) {\n            return 0;\n        }\n        return n + sum(n - 1);\n    }\n    public static void main(String[] args) {\n        System.out.println(sum(3));\n    }\n}',
      explain: '递归步骤必须把问题**缩小**：`sum(n)` 调用 `sum(n)` 永远到不了基线条件 n==0，栈帧越压越深，最后抛 StackOverflowError。正确写法是 `return n + sum(n - 1);`——每次参数减 1，最终命中 n==0 的基线条件。' },

    { id: 'ch12-f2', ch: 'ch12', kp: 'ch12-3', tier: 2, type: 'fill', mode: 'findbug', difficulty: 3, tags: ['bug'],
      stem: '程序编译通过，但调用 fact(0) 时崩溃。指出哪一行有问题并改正。',
      code: 'public class Q {\n    static int fact(int n) {\n        if (n == 1) {\n            return 1;\n        }\n        return n * fact(n - 1);\n    }\n    public static void main(String[] args) {\n        System.out.println(fact(0));\n    }\n}',
      answer: '第 3 行：基线条件 `n == 1` 覆盖不到 0，`fact(0)` 会一路递归到负数。应改为 `if (n <= 1) return 1;`',
      accept: [
        { hint: '指出行号（第 3 行）', any: ['第3行', '第 3 行', '3行', '行3', 'line3'] },
        { hint: '基线条件改成 `n <= 1`（或处理 n == 0）', any: ['n<=1', 'n <= 1', 'n==0', '小于等于1', '基线条件'] }
      ],
      fix: 'public class Q {\n    static int fact(int n) {\n        if (n <= 1) {\n            return 1;\n        }\n        return n * fact(n - 1);\n    }\n    public static void main(String[] args) {\n        System.out.println(fact(0));\n    }\n}',
      explain: '基线条件必须覆盖所有“最小规模”的情况。0! 定义为 1，但这里 `n == 1` 管不到 0：fact(0) → 0 * fact(-1) → -1 * fact(-2) → … 永远不会命中 n==1，最终 StackOverflowError。改成 `if (n <= 1) return 1;` 同时覆盖 0 和 1。' },

    { id: 'ch12-c1', ch: 'ch12', kp: 'ch12-2', tier: 3, type: 'code', difficulty: 3, tags: ['code'],
      stem: '用<b>递归</b>补全方法 <code>sumRec</code>：返回数组 <code>a</code> 前 n 个元素之和（约定 0 ≤ n ≤ a.length；sumRec(a, 0) 返回 0）。',
      starter: 'public class Q {\n    static int sumRec(int[] a, int n) {\n        // TODO: 用递归实现：前 n 个元素之和\n        return 0;\n    }\n    public static void main(String[] args) {\n        int[] a = new int[args.length];\n        for (int i = 0; i < args.length; i++) {\n            a[i] = Integer.parseInt(args[i]);\n        }\n        System.out.println(sumRec(a, a.length));\n    }\n}',
      solution: 'public class Q {\n    static int sumRec(int[] a, int n) {\n        if (n == 0) {\n            return 0;\n        }\n        return a[n - 1] + sumRec(a, n - 1);\n    }\n    public static void main(String[] args) {\n        int[] a = new int[args.length];\n        for (int i = 0; i < args.length; i++) {\n            a[i] = Integer.parseInt(args[i]);\n        }\n        System.out.println(sumRec(a, a.length));\n    }\n}',
      tests: [
        { args: ['1', '2', '3', '4'], expect: '10' },
        { args: [], expect: '0' },
        { args: ['-1', '-2'], expect: '-3' }
      ],
      explain: '递归地拆：前 n 个元素之和 = 第 n 个元素 a[n-1] + 前 n-1 个元素之和；基线 n==0 时返回 0。每次递归 n 减 1，最终落到 n==0。循环写法用 i 从头累加，递归写法从尾部拆——两者结果相同，但递归有 O(n) 的栈空间开销。' },

    { id: 'ch12-c2', ch: 'ch12', kp: 'ch12-5', tier: 4, type: 'code', difficulty: 2, tags: ['code'],
      stem: '补全方法 <code>hanoiMoves</code>：返回 n 个盘子的汉诺塔最少移动次数（要求用递推/递归，n=0 时返回 0）。',
      starter: 'public class Q {\n    static int hanoiMoves(int n) {\n        // TODO: T(n) = 2*T(n-1) + 1，T(0) = 0\n        return 0;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(hanoiMoves(n));\n    }\n}',
      solution: 'public class Q {\n    static int hanoiMoves(int n) {\n        if (n == 0) {\n            return 0;\n        }\n        return 2 * hanoiMoves(n - 1) + 1;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(hanoiMoves(n));\n    }\n}',
      tests: [
        { args: ['1'], expect: '1' },
        { args: ['3'], expect: '7' },
        { args: ['10'], expect: '1023' },
        { args: ['0'], expect: '0' }
      ],
      explain: '汉诺塔的递推：T(0)=0，T(n)=2·T(n-1)+1（先把 n-1 个移到辅助柱，把最大盘移到目标柱，再把 n-1 个移过去）。展开得 T(n)=2ⁿ-1：T(1)=1、T(3)=7、T(10)=1023。这个例子说明递归不仅写起来短，还能直接翻译成递推公式。' },

    { id: 'ch12-p1', ch: 'ch12', kp: 'ch12-2', tier: 4, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '读下面的程序，<b>写出完整输出（逐行）</b>。追问：① calls 为什么是 5？② fib(7) 的值是多少（能写出前几项吗）？③ sum(arr,0) 的递归展开过程？',
      code: 'public class Q {\n    static int calls = 0;\n    static int fact(int n) {\n        calls++;\n        if (n <= 1) {\n            return 1;\n        }\n        return n * fact(n - 1);\n    }\n    static int fib(int n) {\n        if (n < 2) {\n            return n;\n        }\n        return fib(n - 1) + fib(n - 2);\n    }\n    static int sum(int[] a, int i) {\n        if (i == a.length) {\n            return 0;\n        }\n        return a[i] + sum(a, i + 1);\n    }\n    public static void main(String[] args) {\n        System.out.println(fact(5));\n        System.out.println(calls);\n        System.out.println(fib(7));\n        int[] arr = {3, 1, 4};\n        System.out.println(sum(arr, 0));\n        System.out.println(fact(0));\n    }\n}',
      answer: '120\n5\n13\n8\n1',
      explain: '① fact(5) = 5×4×3×2×1 = 120；② calls 统计 fact 被调用次数：fact(5)、fact(4)、fact(3)、fact(2)、fact(1) → 5 次（fact(0) 那行调用不计入，但 fact(0) 返回 1 时 calls 已 +1，不影响之前打印的 5）；③ fib：0,1,1,2,3,5,8,13 → fib(7)=13；④ sum(arr,0) = 3 + sum(arr,1) = 3 + 1 + sum(arr,2) = 3+1+4+0 = 8（基线是 i == a.length）；⑤ 最后再调一次 fact(0)：calls++ 后 n<=1 返回 1 → 打印 1。注意递归的“去程压栈、回程计算”与调用次数统计的时机。' },

    { id: 'ch12-t1', ch: 'ch12', kp: 'ch12-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '朴素递归斐波那契为什么慢？',
      options: [
        { text: '同一个子问题被重复计算很多次，调用树呈指数增长', correct: true },
        { text: '因为 Java 的递归比循环慢 10 倍' },
        { text: '因为没有基线条件' },
        { text: '因为 int 会溢出' }
      ],
      explain: 'fib(n) 的递归树里 fib(n-2) 会被算很多次（每个父节点都重算一遍），节点数随 n 指数增长（约 O(1.618ⁿ)）。这就是“重复子问题”。解决：记忆化（把算过的存起来）或改迭代（滚动两个变量）。' },

    { id: 'ch12-t2', ch: 'ch12', kp: 'ch12-1', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
      stem: '填空：递归方法必须有一个不再调用自己的结束条件，这个条件叫 `_____ case`（填一个英文单词）。',
      answer: ['base', 'Base'],
      explain: '基线条件（base case）是最小规模、可以直接返回的情况（如 `if (n == 0) return 1;`）；递归步骤（recursive step）把问题缩小后调用自己。缺了基线条件或参数没有逼近基线，就会无限递归直到 StackOverflowError。' },

    { id: 'ch12-t3', ch: 'ch12', kp: 'ch12-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '“记忆化（memoization）”的核心做法是？',
      options: [
        { text: '把已经算过的子问题结果存起来（数组/哈希表），再次需要时直接取', correct: true },
        { text: '把递归改成循环变量' },
        { text: '把方法声明为 static' },
        { text: '增加更多的递归调用' }
      ],
      explain: '记忆化 = 递归 + 缓存：用数组/Map 存每个子问题的答案，进入函数先查缓存，算完写回。斐波那契记忆化后从 O(2ⁿ) 降到 O(n)；空间换时间。它与“动态规划”的迭代写法本质相同。' },

    { id: 'ch12-t4', ch: 'ch12', kp: 'ch12-1', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '下面哪种情况更适合用递归，而不是迭代？',
      options: [
        { text: '问题本身是自相似的（汉诺塔、分治、树的遍历），递归能直接表达“缩小问题”', correct: true },
        { text: '要处理 100 万层的线性累加' },
        { text: '只要能写成循环，就永远别用递归' },
        { text: '需要在循环里用 break 时' }
      ],
      explain: '递归适合“自相似/分治”结构：汉诺塔、归并/快排、树与图遍历，递归代码几乎就是定义式。反过来，线性累加、深度可能达到 10⁵ 以上的场景用迭代更稳（避免栈溢出）。选择标准：问题结构 + 栈深度代价。' },

    { id: 'ch12-t5', ch: 'ch12', kp: 'ch12-6', tier: 1, type: 'tf', difficulty: 2, tags: ['concept'],
      stem: '判断：n 个盘子的汉诺塔最少需要移动 2ⁿ - 1 次。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: '递推 T(0)=0，T(n)=2·T(n-1)+1：先移 n-1 个到辅助柱、移最大盘、再把 n-1 个移过去。展开得 T(n)=2ⁿ-1：T(1)=1、T(3)=7、T(10)=1023。递归代码只有三行，却蕴含着指数级的步数。' },

    { id: 'ch12-t6', ch: 'ch12', kp: 'ch12-4', tier: 2, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '下面程序统计朴素递归斐波那契的调用次数。写出完整输出（逐行）。',
      code: 'public class Q {\n    static int calls = 0;\n    static int fib(int n) {\n        calls++;\n        if (n < 2) {\n            return n;\n        }\n        return fib(n - 1) + fib(n - 2);\n    }\n    public static void main(String[] args) {\n        System.out.println(fib(5));\n        System.out.println(calls);\n        calls = 0;\n        System.out.println(fib(7));\n        System.out.println(calls);\n    }\n}',
      answer: '5\n15\n13\n41',
      explain: '① fib(5) = 5；② 调用次数 C(n)=1+C(n-1)+C(n-2)，C(0)=C(1)=1 → C(5)=15；③ 重置后 fib(7)=13、C(7)=41。注意 C(n) 与 fib(n) 是两个不同的量：结果只有 7 个不同值，却被调用了 41 次——重复计算正是指数复杂度的来源。' },

    { id: 'ch12-t7', ch: 'ch12', kp: 'ch12-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '把递归求 1+2+…+n 改写成迭代，最少需要哪些变量？',
      options: [
        { text: '一个循环变量 i 和一个累加器 sum', correct: true },
        { text: '两个累加器和三个循环变量' },
        { text: '一个数组' },
        { text: '需要保留递归调用栈' }
      ],
      explain: '迭代版：`int sum = 0; for (int i = 1; i &lt;= n; i++) sum += i;`，只需要循环变量和累加器。递归版的“状态”压在调用栈上，迭代版把它显式放到变量里——这就是递归与迭代可以互相转换的原因。' },

    { id: 'ch12-t8', ch: 'ch12', kp: 'ch12-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '用数组实现斐波那契记忆化时，`memo[n]` 里存的是什么？',
      options: [
        { text: 'fib(n) 已经算出的结果（后续再需要时直接返回）', correct: true },
        { text: '递归调用的次数' },
        { text: 'n 的二进制位' },
        { text: '数组下标' }
      ],
      explain: 'memo[n] 缓存 fib(n) 的答案。进入函数：若 `memo[n] != 0` 说明算过，直接返回；否则递归算出后写回 memo[n]。典型的时间换空间：空间 O(n)、时间从指数降到 O(n)。' },

    { id: 'ch12-t9', ch: 'ch12', kp: 'ch12-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '汉诺塔递归中，`hanoi(n, from, aux, to)` 的第一步应该是？',
      options: [
        { text: '把 n-1 个盘子从 from 移到 aux（借助 to）', correct: true },
        { text: '把最大盘从 from 移到 to' },
        { text: '把 n-1 个盘子从 aux 移到 to' },
        { text: '把最大盘从 to 移到 from' }
      ],
      explain: '三步走：① hanoi(n-1, from, to, aux)：把上面 n-1 个移到辅助柱；② 把最大盘 from→to；③ hanoi(n-1, aux, from, to)：把 n-1 个从辅助柱移到目标柱。参数顺序（from/aux/to）在递归中交换，是最容易写错的地方。' },

    { id: 'ch12-f3', ch: 'ch12', kp: 'ch12-1', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '程序本意是计算 count(n) = n（对 1..n 累加计数），但调用 count(0) 时崩溃。指出哪一行有问题并改正。',
      code: 'public class Q {\n    static int count(int n) {\n        if (n == 1) {\n            return 1;\n        }\n        return 1 + count(n - 1);\n    }\n    public static void main(String[] args) {\n        System.out.println(count(0));\n    }\n}',
      answer: '第 3 行：基线条件 `n == 1` 覆盖不到 0，count(0) 会一路递归到负数。应改为 `if (n <= 0) return 0;`',
      accept: [
        { hint: '指出行号（第 3 行）', any: ['第3行', '第 3 行', '3行', '行3', 'line3'] },
        { hint: '基线条件改成 `n <= 0`（覆盖 0 与负数）', any: ['n<=0', 'n <= 0', 'n==0', '小于等于0', '基线条件'] }
      ],
      fix: 'public class Q {\n    static int count(int n) {\n        if (n <= 0) {\n            return 0;\n        }\n        return 1 + count(n - 1);\n    }\n    public static void main(String[] args) {\n        System.out.println(count(0));\n    }\n}',
      explain: '基线条件必须覆盖所有“最小规模”。这里只处理 n==1，传入 0 时 n-1 变 -1、-2… 永远到不了 1，最终 StackOverflowError。改成 `if (n &lt;= 0) return 0;` 后，count(0)=0、count(5)=5。写递归时先问：最小情况有几种？都要覆盖吗？' },

    { id: 'ch12-c3', ch: 'ch12', kp: 'ch12-5', tier: 3, type: 'code', difficulty: 3, tags: ['code'],
      stem: '补全方法 <code>fibMemo</code>：用 memo 数组做记忆化，返回第 n 个斐波那契数（fib(0)=0、fib(1)=1）。约定 memo 长度足够且已初始化。',
      starter: 'public class Q {\n    static int fibMemo(int n, int[] memo) {\n        // TODO: 用 memo 保存已算过的结果（memo[n] 非 0 说明算过），避免重复递归\n        return 0;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        int[] memo = new int[n + 2];\n        memo[0] = 0;\n        memo[1] = 1;\n        System.out.println(fibMemo(n, memo));\n    }\n}',
      solution: 'public class Q {\n    static int fibMemo(int n, int[] memo) {\n        if (n < 2) {\n            return n;\n        }\n        if (memo[n] != 0) {\n            return memo[n];\n        }\n        memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);\n        return memo[n];\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        int[] memo = new int[n + 2];\n        memo[0] = 0;\n        memo[1] = 1;\n        System.out.println(fibMemo(n, memo));\n    }\n}',
      tests: [
        { args: ['10'], expect: '55' },
        { args: ['0'], expect: '0' },
        { args: ['1'], expect: '1' }
      ],
      explain: '三段式：① `if (n &lt; 2) return n;` 基线；② `if (memo[n] != 0) return memo[n];` 查缓存；③ 递归计算后写回 `memo[n]` 再返回。参数 n=10 时答案 55；n=0、1 走基线。没有 memo 的话 fib(10) 也要上百次调用，加了 memo 后每个 n 只算一次。' },

    { id: 'ch12-p2', ch: 'ch12', kp: 'ch12-4', tier: 4, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '读下面的程序，对比朴素递归与记忆化的调用次数。<b>写出完整输出（逐行）</b>。追问：① calls1 为什么是 177？② calls2 为什么只有 27？③ 最后一行为什么是 true？',
      code: 'public class Q {\n    static int calls1 = 0;\n    static int naive(int n) {\n        calls1++;\n        if (n < 2) {\n            return n;\n        }\n        return naive(n - 1) + naive(n - 2);\n    }\n    static int calls2 = 0;\n    static int memo(int n, int[] m) {\n        calls2++;\n        if (n < 2) {\n            return n;\n        }\n        if (m[n] != 0) {\n            return m[n];\n        }\n        m[n] = memo(n - 1, m) + memo(n - 2, m);\n        return m[n];\n    }\n    public static void main(String[] args) {\n        System.out.println(naive(10));\n        System.out.println(calls1);\n        int[] m = new int[12];\n        m[1] = 1;\n        System.out.println(memo(10, m));\n        System.out.println(calls2);\n        System.out.println(naive(10) == memo(10, new int[12]));\n    }\n}',
      answer: '55\n177\n55\n19\ntrue',
      explain: '① naive(10)=55，调用次数 C(10) 按 C(n)=1+C(n-1)+C(n-2) 推得 177；② memo(10) 有缓存，每个 n 最多真正计算一次，但每次进入函数仍会 calls2++（包括命中缓存的调用），共 19 次——远小于 177；③ 两种实现结果都是 55，所以相等为 true。记忆化把“指数级重复计算”降为“线性次数的递归调用”。' },

    { id: 'ch12-c4', ch: 'ch12', kp: 'ch12-3', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '用<b>递归</b>补全方法 <code>factRec</code>：返回 n 的阶乘（约定 n ≥ 0，0! = 1）。',
      starter: 'public class Q {\n    static int factRec(int n) {\n        return 1;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(factRec(n));\n    }\n}',
      solution: 'public class Q {\n    static int factRec(int n) {\n        if (n <= 1) {\n            return 1;\n        }\n        return n * factRec(n - 1);\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(factRec(n));\n    }\n}',
      tests: [
        { args: ['5'], expect: '120' },
        { args: ['0'], expect: '1' },
        { args: ['1'], expect: '1' }
      ],
      explain: '基线 n&lt;=1 返回 1（覆盖 0 和 1），递归步骤 n * factRec(n-1)。注意 int 阶乘到 12! 就接近上限、13! 会溢出。' },

    { id: 'ch12-c5', ch: 'ch12', kp: 'ch12-2', tier: 3, type: 'code', difficulty: 2, tags: ['code'],
      stem: '用<b>递归</b>补全方法 <code>sumRange</code>：返回 a + (a+1) + … + b（约定 a ≤ b）。',
      starter: 'public class Q {\n    static int sumRange(int a, int b) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        int a = Integer.parseInt(args[0]);\n        int b = Integer.parseInt(args[1]);\n        System.out.println(sumRange(a, b));\n    }\n}',
      solution: 'public class Q {\n    static int sumRange(int a, int b) {\n        if (a > b) {\n            return 0;\n        }\n        return a + sumRange(a + 1, b);\n    }\n    public static void main(String[] args) {\n        int a = Integer.parseInt(args[0]);\n        int b = Integer.parseInt(args[1]);\n        System.out.println(sumRange(a, b));\n    }\n}',
      tests: [
        { args: ['1', '5'], expect: '15' },
        { args: ['3', '3'], expect: '3' },
        { args: ['5', '1'], expect: '0' }
      ],
      explain: '递归方向是“从 a 往上加”：基线 a > b 返回 0，否则 a + sumRange(a+1, b)。这样每次 a 递增逼近 b。测试包含单元素（3..3=3）与空区间（5..1=0）。' },

    { id: 'ch12-c6', ch: 'ch12', kp: 'ch12-4', tier: 4, type: 'code', difficulty: 3, tags: ['code'],
      stem: '<b>跨章综合</b>：用<b>递归</b>补全两个方法：<code>maxRec(a, n)</code> 返回数组前 n 个元素的最大值；<code>countEvenRec(a, n)</code> 返回前 n 个元素中偶数的个数。',
      starter: 'public class Q {\n    static int maxRec(int[] a, int n) {\n        return 0;\n    }\n    static int countEvenRec(int[] a, int n) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        int[] a = {3, 8, 2, 7};\n        System.out.println(maxRec(a, a.length));\n        System.out.println(countEvenRec(a, a.length));\n    }\n}',
      solution: 'public class Q {\n    static int maxRec(int[] a, int n) {\n        if (n == 1) {\n            return a[0];\n        }\n        int m = maxRec(a, n - 1);\n        if (a[n - 1] > m) {\n            return a[n - 1];\n        }\n        return m;\n    }\n    static int countEvenRec(int[] a, int n) {\n        if (n == 0) {\n            return 0;\n        }\n        int c = countEvenRec(a, n - 1);\n        if (a[n - 1] % 2 == 0) {\n            c++;\n        }\n        return c;\n    }\n    public static void main(String[] args) {\n        int[] a = {3, 8, 2, 7};\n        System.out.println(maxRec(a, a.length));\n        System.out.println(countEvenRec(a, a.length));\n    }\n}',
      tests: [
        { args: [], expect: '8\n2' }
      ],
      explain: '两个递归都是“拆尾部”模式：maxRec(n) = max(a[n-1], maxRec(n-1))，countEvenRec(n) = countEvenRec(n-1) + (a[n-1] 是偶数 ? 1 : 0)。递归 + 数组 + 方法的综合，注意基线与下标 a[n-1]。' },

    { id: 'ch12-n1', ch: 'ch12', kp: 'ch12-8', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '递归 bug 的典型症状有三类，下面哪项完整？',
      options: [
        { text: 'StackOverflowError（基线不可达/参数不推进）；不报错但结果错（返回值被丢弃、顺序反）；重复计算但答案碰巧对', correct: true },
        { text: '只有编译错误一种' },
        { text: '只有数组越界一种' },
        { text: '递归不会出错' }
      ],
      explain: '递归 bug 三症状：① 栈溢出——基线不存在/不可达、参数没有向基线推进；② 结果错——递归调用的返回值没被使用、语句顺序（去程/回程）搞反；③ 重复计算——朴素递归（斐波那契）答案对但慢。调试顺序：基线 → 参数推进 → 返回值使用。' },

    { id: 'ch12-n2', ch: 'ch12', kp: 'ch12-8', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '递归方法抛出 StackOverflowError，第一个要检查的是？',
      options: [
        { text: '基线条件是否存在且可达；每次递归的参数是否向基线推进', correct: true },
        { text: '方法名是否拼错' },
        { text: '是否有足够的栈内存' },
        { text: '是否用了 int 类型' }
      ],
      explain: '栈溢出 = 递归永远到不了基线。检查两点：① 基线条件写了吗、覆盖所有最小情况吗（n==0 还是 n&lt;=0）；② 递归参数有没有真的缩小（sum(n) 调 sum(n) 是经典错误，应 sum(n-1)）。两者修好，栈就不会无限增长。' },

    { id: 'ch12-n3', ch: 'ch12', kp: 'ch12-8', tier: 1, type: 'tf', difficulty: 2, tags: ['trap'],
      stem: '判断：递归调用写成 `sum(n - 1);` 而不把返回值用起来，方法结果会错。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: '递归调用的返回值必须参与计算或返回：`return n + sum(n - 1);`。只写 `sum(n - 1);` 时返回值被丢弃，方法最后 return 的是 n 本身（不是累加和）——能跑、不报错，但结果错。这是递归“结果错”类 bug 的头号原因。' },

    { id: 'ch12-n4', ch: 'ch12', kp: 'ch12-8', tier: 2, type: 'fill', mode: 'findbug', difficulty: 3, tags: ['bug'],
      stem: '程序本意是求 1+2+…+n（sum(4) 应为 10），实际输出 4。指出哪一行有问题并改正。',
      code: 'public class Q {\n    static int sum(int n) {\n        if (n == 0) {\n            return 0;\n        }\n        sum(n - 1);\n        return n;\n    }\n    public static void main(String[] args) {\n        System.out.println(sum(4));\n    }\n}',
      answer: '第 6 行：`sum(n - 1);` 的返回值被丢弃，方法只返回了 n。应改为 `return n + sum(n - 1);`',
      accept: [
        { hint: '指出递归调用返回值被丢弃（第 6 行）', any: ['第6行', '第 6 行', '6行', '行6', 'sum(n - 1)', '返回值'] },
        { hint: '改成 `return n + sum(n - 1);`', any: ['return n + sum', 'n + sum(n-1)', 'n+sum', '把返回值加起来'] }
      ],
      fix: 'public class Q {\n    static int sum(int n) {\n        if (n == 0) {\n            return 0;\n        }\n        return n + sum(n - 1);\n    }\n    public static void main(String[] args) {\n        System.out.println(sum(4));\n    }\n}',
      explain: '`sum(n - 1);` 只是调用了一次递归，返回值没人接；方法最终 `return n`，所以 sum(4)=4。修法：`return n + sum(n - 1);`——递归的“回程”要把子问题的答案加回来。这是“递归能跑但结果错”的典型代表。' },

    { id: 'ch12-n5', ch: 'ch12', kp: 'ch12-8', tier: 4, type: 'predict', difficulty: 3, tags: ['output'],
      stem: '<b>综合</b>：读下面的“朴素递归 vs 记忆化”程序，<b>写出完整输出（逐行）</b>。追问：① 两种实现的 fib(8) 都是 21，调用次数为什么差这么多？② 记忆化为什么能降复杂度？',
      code: 'public class Q {\n    static int calls1 = 0;\n    static int naive(int n) {\n        calls1++;\n        if (n < 2) {\n            return n;\n        }\n        return naive(n - 1) + naive(n - 2);\n    }\n    static int calls2 = 0;\n    static int memo(int n, int[] m) {\n        calls2++;\n        if (n < 2) {\n            return n;\n        }\n        if (m[n] != 0) {\n            return m[n];\n        }\n        m[n] = memo(n - 1, m) + memo(n - 2, m);\n        return m[n];\n    }\n    public static void main(String[] args) {\n        System.out.println(naive(8));\n        System.out.println(calls1);\n        int[] m = new int[10];\n        System.out.println(memo(8, m));\n        System.out.println(calls2);\n    }\n}',
      answer: '21\n67\n21\n15',
      explain: '① naive(8)=21，调用次数 C(8)=67（C(n)=1+C(n-1)+C(n-2)）；② memo(8)=21，调用次数只有 15——因为它把算过的结果存在 m[n] 里，再需要时直接返回；③ 朴素递归重复计算同一子问题，复杂度约 O(2ⁿ)；记忆化每个 n 只算一次 → O(n)。这是“递归 bug 之重复计算”的标准解法。' },

    { id: 'ch12-d1', ch: 'ch12', kp: 'ch12-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
      stem: '斐波那契数列 fib(0)=0、fib(1)=1，则 fib(6) 的值是？',
      options: [
        { text: '8', correct: true },
        { text: '13' },
        { text: '5' },
        { text: '21' }
      ],
      explain: '依次列：0、1、1、2、3、5、8、13 —— fib(0)=0、fib(1)=1、fib(2)=1、fib(3)=2、fib(4)=3、fib(5)=5、fib(6)=8。递归定义是 fib(n)=fib(n-1)+fib(n-2)。' },

    { id: 'ch12-d2', ch: 'ch12', kp: 'ch12-6', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '汉诺塔递归中，把 n 个盘子从 from 移到 to，第一步递归调用的参数应该是？',
      options: [
        { text: 'hanoi(n-1, from, to, aux)：把上面 n-1 个移到辅助柱', correct: true },
        { text: 'hanoi(n-1, aux, from, to)：先把 n-1 个移到目标柱' },
        { text: 'hanoi(n, from, aux, to)：直接递归 n' },
        { text: 'hanoi(1, from, aux, to)：只移一个' }
      ],
      explain: '三步：① 把 n-1 个从 from 移到 aux（借助 to）→ `hanoi(n-1, from, to, aux)`；② 把最大盘从 from 移到 to；③ 把 n-1 个从 aux 移到 to（借助 from）→ `hanoi(n-1, aux, from, to)`。参数顺序（from/aux/to）的交换是本题最容易写错的地方。' },

    { id: 'ch12-d3', ch: 'ch12', kp: 'ch12-7', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept'],
      stem: '把递归改成迭代，通常需要额外做什么？',
      options: [
        { text: '用变量显式保存原本由调用栈保存的中间状态', correct: true },
        { text: '什么都不用做，直接删掉递归调用' },
        { text: '把方法改成 static' },
        { text: '递归不能改写成迭代' }
      ],
      explain: '递归的“状态”压在调用栈上（每层的参数、局部变量、返回位置）；改迭代时要把这些状态显式放进变量/数组/显式栈。例如递归求和改成一个循环 + 累加器，递归斐波那契改成滚动两个变量。' },

    { id: 'ch12-d4', ch: 'ch12', kp: 'ch12-7', tier: 1, type: 'fill', difficulty: 2, tags: ['concept'],
      stem: '填空：Java 不会自动把递归优化成迭代（没有尾递归优化），所以深度过大会抛 `_____Error`。',
      answer: ['StackOverflow', 'StackOverflowError', '栈溢出'],
      explain: 'Java 没有尾递归优化：每次调用都真实压栈，深度超过栈容量就抛 StackOverflowError。所以线性累加、深度可能很大（如 10 万层）的场景应改写迭代；分治类问题要注意递归深度是否可控。' },

    /* ============================================================ ch13 复杂度分析与 Big-O */
    { id: 'ch13-q1', ch: 'ch13', kp: 'ch13-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept', 'bigo'],
      stem: '时间复杂度 O(n) 的准确含义是什么？',
      options: [
        { text: '程序正好执行 n 条语句' },
        { text: '当 n 增大时，操作次数的增长量级与 n 成正比（忽略常数和低阶项）', correct: true },
        { text: '程序运行 n 秒' },
        { text: 'n 越大程序跑得越快' }
      ],
      explain: 'Big-O 描述的是**增长趋势**（上界），不是精确次数。3n+5、n/2、100n 都是 O(n)：系数和低阶项都忽略，因为 n 很大时决定增长的是 n 这个量级。' },

    { id: 'ch13-q2', ch: 'ch13', kp: 'ch13-2', tier: 2, type: 'predict', difficulty: 2, tags: ['output', 'bigo'],
      stem: '写出下面程序的输出。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int n = 5, c = 0;\n        for (int i = 0; i < n; i++)\n            for (int j = 0; j < i; j++)\n                c++;\n        System.out.println(c);\n    }\n}',
      answer: '10',
      explain: '内层循环次数取决于 i：i=0 时 0 次，i=1 时 1 次，i=2 时 2 次，i=3 时 3 次，i=4 时 4 次。总次数 0+1+2+3+4 = 10 = n(n-1)/2。这是 O(n²) 的典型形状（三角形状，不是正方形）。' },

    { id: 'ch13-q3', ch: 'ch13', kp: 'ch13-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['trap', 'exam', 'bigo'],
      stem: '下面代码的时间复杂度（用 n 表示）是什么？',
      code: 'for (int i = 0; i < n; i++) {\n    for (int j = 0; j < 10; j++) {\n        sum += i * j;\n    }\n}',
      options: [
        { text: 'O(n²)' },
        { text: 'O(n)', correct: true },
        { text: 'O(10)' },
        { text: 'O(n log n)' }
      ],
      explain: '内层固定跑 10 次，是**常数**，总操作数 10n → 忽略常数系数 → O(n)。不要看到两层 for 就条件反射写 O(n²)：必须看内层的循环上界是否随 n 增长。' },

    { id: 'ch13-q4', ch: 'ch13', kp: 'ch13-1', tier: 1, type: 'tf', difficulty: 1, tags: ['concept', 'bigo'],
      stem: '判断：如果一个算法对任意规模的输入都只执行固定数量的基本操作，它的时间复杂度是 O(1)。',
      options: [
        { text: '正确（True）', correct: true },
        { text: '错误（False）' }
      ],
      explain: 'O(1) 叫常数时间：不论 n 多大，操作次数都不变。典型例子：数组按下标访问 a[i]、算术运算、HashMap 的平均查找（理想情况下）。注意并不要求只执行 1 次，执行 100 次常量操作仍是 O(1)。' },

    { id: 'ch13-q5', ch: 'ch13', kp: 'ch13-3', tier: 2, type: 'predict', difficulty: 2, tags: ['output', 'bigo'],
      stem: '写出下面程序的输出。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int n = 16, c = 0;\n        for (int i = 1; i < n; i *= 2) {\n            c++;\n        }\n        System.out.println(c);\n    }\n}',
      answer: '4',
      explain: 'i 依次为 1、2、4、8，共 4 轮；下一个 i=16 不满足 i<16，循环结束。每轮 i 翻倍，所以循环次数是 log₂n（这里 log₂16 = 4）。这种“每次乘/除常数”的循环就是 O(log n) 的来源，二分查找也是同样的形状。' },

    { id: 'ch13-q6', ch: 'ch13', kp: 'ch13-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '选择排序、插入排序、归并排序、快速排序（平均情况）的时间复杂度依次是？',
      options: [
        { text: 'O(n²)、O(n²)、O(n log n)、O(n log n)', correct: true },
        { text: '全是 O(n log n)' },
        { text: 'O(n)、O(n²)、O(n log n)、O(n²)' },
        { text: 'O(n log n)、O(n²)、O(n²)、O(n)' }
      ],
      explain: '选择/插入排序是两层循环 → O(n²)；归并排序每次对半分再合并 → O(n log n)；快速排序平均 O(n log n)，但最坏（每次基准都取到极值）退化到 O(n²)。这张表是期中选择题的高频考点。' },

    { id: 'ch13-q7', ch: 'ch13', kp: 'ch13-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept', 'bigo'],
      stem: '下列操作中，时间复杂度是 O(log n) 的是？',
      options: [
        { text: '数组按下标访问 a[5]' },
        { text: '在有序数组上做二分查找', correct: true },
        { text: '遍历打印整个数组' },
        { text: '两层嵌套循环遍历 n×n 矩阵' }
      ],
      explain: '二分查找每轮把搜索区间缩小一半 → O(log n)。下标访问是 O(1)，遍历是 O(n)，嵌套遍历 n×n 是 O(n²)。' },

    { id: 'ch13-q8', ch: 'ch13', kp: 'ch13-5', tier: 2, type: 'mcq', difficulty: 3, tags: ['trap', 'exam', 'bigo'],
      stem: '实测：输入规模 n 从 1000 增加到 2000（翻倍），运行时间从 0.02s 增加到 0.08s（约 4 倍）。用倍增法推断，最可能的复杂度是？',
      options: [
        { text: 'O(n)' },
        { text: 'O(n²)', correct: true },
        { text: 'O(log n)' },
        { text: 'O(1)' }
      ],
      explain: '倍增法看“输入翻倍时时间怎么变”：时间×2 → O(n)；时间×4 → O(n²)（2²）；时间不变 → O(1)；时间只增加一个常数级 → O(log n)。这里时间变成 4 倍，正好是 2²，所以是 O(n²)。' },

    { id: 'ch13-q9', ch: 'ch13', kp: 'ch13-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept', 'exam', 'bigo'],
      stem: '说“归并排序需要 O(n) 额外空间、选择排序是 O(1)”，这里的空间复杂度指什么？',
      options: [
        { text: '程序文件占用的磁盘大小' },
        { text: '算法运行过程中额外需要的辅助内存随输入规模的增长趋势', correct: true },
        { text: '源码里声明变量的行数' },
        { text: 'CPU 缓存的大小' }
      ],
      explain: '空间复杂度衡量**额外**申请的辅助内存（不含输入本身）随 n 的增长。选择排序原地交换 → O(1)；归并排序合并时要复制数组 → O(n)；递归算法的调用栈也要算进去（快排平均 O(log n)）。' },

    { id: 'ch13-k1', ch: 'ch13', kp: 'ch13-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '下列算法中，**额外空间复杂度为 O(1)** 的是？',
      options: [
        { text: '选择排序（原地交换）', correct: true },
        { text: '归并排序（合并时需要临时数组）' },
        { text: '递归版阶乘（递归深度 n）' },
        { text: '把数组反转后存进一个新数组' }
      ],
      explain: 'O(1) 额外空间 = 只用常数个临时变量。选择排序只用一个临时变量做交换，所以 O(1)；归并排序合并时要复制 O(n) 的临时数组；递归阶乘同时存活 n 个栈帧 → O(n)；新建一个数组装反转结果 → O(n)。注意空间复杂度只算**额外**辅助空间，不把输入本身算进去。' },

    { id: 'ch13-k2', ch: 'ch13', kp: 'ch13-6', tier: 2, type: 'fill', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '填空：一个递归算法的最大递归深度为 n，每个栈帧占常数空间，那么它的额外空间复杂度是 _____（用 Big-O 表示，如 O(n)）。',
      answer: ['O(n)', 'o(n)'],
      explain: '递归的空间复杂度 = 同时存活的栈帧数 × 每帧大小。最大深度为 n、每帧 O(1)，所以总额外空间 O(n)。对比：二分查找递归版 O(log n)；快排平均 O(log n)、最坏 O(n)；归并排序栈深 O(log n) 但合并数组 O(n)，总额外空间仍是 O(n)。' },

    { id: 'ch13-f1', ch: 'ch13', kp: 'ch13-4', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug'],
      stem: '程序本意是统计 1 到 5（含 5）一共执行多少次循环，实际输出 4。指出哪一行有问题并改正。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int n = 5;\n        int count = 0;\n        for (int i = 1; i < n; i++) {\n            count++;\n        }\n        System.out.println(count);\n    }\n}',
      answer: '第 5 行：循环条件 `i < n` 只到 4，应改成 `i <= n` 才能包含 5',
      accept: [
        { hint: '指出行号（第 5 行）', any: ['第5行', '第 5 行', '5行', '行5', 'line5'] },
        { hint: '把 `i < n` 改成 `i <= n`（补等号）', any: ['i<=n', 'i <= n', '加上等号', '补等号', '<=', '小于改小于等于'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int n = 5;\n        int count = 0;\n        for (int i = 1; i <= n; i++) {\n            count++;\n        }\n        System.out.println(count);\n    }\n}',
      explain: '`for (int i = 1; i &lt; n; i++)` 在 n=5 时 i 取 1、2、3、4，只执行 4 次；要包含 5 必须写 `i &lt;= n`。分析循环时先看“i 从哪开始、到哪结束、步长多少”，再数次数——这就是复杂度分析的第一步。' },

    { id: 'ch13-f2', ch: 'ch13', kp: 'ch13-4', tier: 2, type: 'fill', mode: 'findbug', difficulty: 3, tags: ['bug'],
      stem: '程序本意是统计 n×n 矩阵遍历的操作次数（n=4 时应为 16），实际输出 20。指出哪一行有问题并改正。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int n = 4;\n        int ops = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j <= n; j++) {\n                ops++;\n            }\n        }\n        System.out.println(ops);\n    }\n}',
      answer: '第 5 行：内层 `j <= n` 每行多跑一次（j 取 0..n 共 n+1 次），应改成 `j < n`',
      accept: [
        { hint: '指出行号（第 5 行）', any: ['第5行', '第 5 行', '5行', '行5', 'line5'] },
        { hint: '把 `j <= n` 改成 `j < n`（去掉等号）', any: ['j<n', 'j < n', '去掉等号', '<=改<', '去等号'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int n = 4;\n        int ops = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < n; j++) {\n                ops++;\n            }\n        }\n        System.out.println(ops);\n    }\n}',
      explain: '内层 `j <= n` 让 j 取 0、1、2、3、4 共 n+1 次，所以总共 n(n+1)=20 次；正确应是 n×n=16 次（外层 n 次 × 内层 n 次）。这个 bug 会让人把 O(n²) 的错误实现当成“多点常数没关系”——但边界写错时复杂度阶可能都变了。' },

    { id: 'ch13-p1', ch: 'ch13', kp: 'ch13-4', tier: 4, type: 'predict', difficulty: 2, tags: ['output'],
      stem: '读下面的程序，<b>写出完整输出（逐行）</b>。追问：① 六个计数器分别对应什么复杂度（n=8）？② 为什么 c3 是 28 而 c6 是 36？③ 若 n 翻倍到 16，哪几个数会变成 2 倍，哪几个变成 4 倍？',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int n = 8;\n        int c1 = 0;\n        for (int i = 0; i < n; i++) {\n            c1++;\n        }\n        System.out.println(c1);\n        int c2 = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < n; j++) {\n                c2++;\n            }\n        }\n        System.out.println(c2);\n        int c3 = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < i; j++) {\n                c3++;\n            }\n        }\n        System.out.println(c3);\n        int c4 = 0;\n        for (int i = 1; i < n; i *= 2) {\n            c4++;\n        }\n        System.out.println(c4);\n        int c5 = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < 10; j++) {\n                c5++;\n            }\n        }\n        System.out.println(c5);\n        int c6 = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = i; j < n; j++) {\n                c6++;\n            }\n        }\n        System.out.println(c6);\n    }\n}',
      answer: '8\n64\n28\n3\n80\n36',
      explain: '① c1：单层循环 n 次 → 8（O(n)）；② c2：双层各 n 次 → 64（O(n²)）；③ c3：内层 j<i，次数 0+1+…+7 = 28（O(n²)，n(n-1)/2）；④ c4：i=1,2,4 共 3 次（O(log n)）；⑤ c5：内层固定 10 次 → 80（O(n)，常数不算阶）；⑥ c6：内层 j 从 i 到 n-1，次数 8+7+…+1 = 36（O(n²)，(n+1)n/2）。n 翻倍时：c1、c5 变 2 倍，c2、c3、c6 变 4 倍，c4 只增加 1。' },

    { id: 'ch13-t1', ch: 'ch13', kp: 'ch13-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept', 'bigo'],
      stem: '用倍增法测复杂度：输入规模 n 翻倍时运行时间大约**不变**，说明复杂度是？',
      options: [
        { text: 'O(1)（规模翻倍、时间不变）', correct: true },
        { text: 'O(n)' },
        { text: 'O(n²)' },
        { text: 'O(log n)' }
      ],
      explain: '倍增法的判据：n 翻倍后时间 ×1 → O(1)；×2 → O(n)；×4 → O(n²)；只增加一个固定量（时间几乎不变）→ O(log n)。注意“时间几乎不变”要区分：真正不变是 O(1)，而 O(log n) 会有一个小的固定增量（多一两轮）。' },

    { id: 'ch13-t2', ch: 'ch13', kp: 'ch13-6', tier: 1, type: 'fill', difficulty: 1, tags: ['concept', 'bigo'],
      stem: '填空：空间复杂度衡量的是算法运行过程中**额外**需要的辅助内存随输入规模的增长趋势，归并排序的额外空间复杂度是 O(____)。',
      answer: ['n', 'N'],
      explain: '空间复杂度只算**额外**辅助空间（不含输入本身）。归并排序合并时要一个长度 n 的临时数组 → O(n)；选择排序原地交换 → O(1)；递归算法的调用栈深度也要算（快排平均 O(log n)）。' },

    { id: 'ch13-t3', ch: 'ch13', kp: 'ch13-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept', 'bigo'],
      stem: '为什么分析算法时要“数基本操作次数”，而不是直接看运行时间？',
      options: [
        { text: '运行时间受机器、编译器、输入等影响；操作次数能反映算法本身的增长趋势', correct: true },
        { text: '因为数操作比计时更简单' },
        { text: '因为运行时间无法测量' },
        { text: '因为操作次数就等于毫秒数' }
      ],
      explain: '同一段代码在不同机器/负载上耗时差异很大，但“执行了多少次基本操作（比较、赋值、循环体）”是算法自身的性质，与机器无关。Big-O 分析的就是操作次数随 n 的增长趋势，所以能跨机器比较算法优劣。' },

    { id: 'ch13-t4', ch: 'ch13', kp: 'ch13-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '“3n² + 100n + 7 是 O(n²)”的准确含义是？',
      options: [
        { text: 'n 足够大时，它的增长量级由 n² 主导，常数系数与低阶项可忽略', correct: true },
        { text: '它的操作次数正好是 n²' },
        { text: '当 n 很小时它等于 n²' },
        { text: '它比 3n² 慢' }
      ],
      explain: 'Big-O 描述的是**增长趋势的上界**：n 很大时 3n² 项主导（100n 与 7 变得微不足道），所以记 O(n²)，忽略系数 3。注意：n 很小的时候低阶项反而可能有影响，但 Big-O 只关心 n → ∞ 的趋势。' },

    { id: 'ch13-t5', ch: 'ch13', kp: 'ch13-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '把下列复杂度按增长速度**从慢到快**排列：O(1)、O(log n)、O(n)、O(n log n)、O(n²)、O(2ⁿ)。正确的是？',
      options: [
        { text: 'O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(2ⁿ)', correct: true },
        { text: 'O(1) &lt; O(n) &lt; O(log n) &lt; O(n²) &lt; O(n log n) &lt; O(2ⁿ)' },
        { text: 'O(2ⁿ) &lt; O(n²) &lt; O(n log n) &lt; O(n) &lt; O(log n) &lt; O(1)' },
        { text: '全都一样' }
      ],
      explain: '增长速度排序（慢 → 快）：O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(n³) &lt; O(2ⁿ) &lt; O(n!)。记法：对数 &lt; 线性 &lt; 线性对数 &lt; 平方 &lt; 指数。n=1000 时 log n≈10、n=1000、n log n≈10⁴、n²=10⁶、2ⁿ 天文数字。' },

    { id: 'ch13-t6', ch: 'ch13', kp: 'ch13-5', tier: 2, type: 'predict', difficulty: 2, tags: ['output', 'bigo'],
      stem: '写出下面“数操作次数”程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int n = 1000;\n        int ops = 0;\n        for (int i = 0; i < n; i++) {\n            ops++;\n        }\n        System.out.println(ops);\n        int n2 = 2000;\n        int ops2 = 0;\n        for (int i = 0; i < n2; i++) {\n            ops2++;\n        }\n        System.out.println(ops2);\n        int logOps = 0;\n        for (int i = 1; i < n2; i *= 2) {\n            logOps++;\n        }\n        System.out.println(logOps);\n        int quad = 0;\n        for (int i = 0; i < 100; i++) {\n            for (int j = 0; j < 100; j++) {\n                quad++;\n            }\n        }\n        System.out.println(quad);\n    }\n}',
      answer: '1000\n2000\n11\n10000',
      explain: '① 单层循环 n=1000 → 1000，n=2000 → 2000（线性）；② 倍增循环 i=1,2,4,…,1024 共 11 次（i&lt;2000）→ log 级；③ 双层各 100 次 → 10000（平方级，但 n 固定为 100）。把 n 翻倍看结果怎么变，就能反推复杂度：1000→2000 是 ×2（O(n)），log 只 +1。' },

    { id: 'ch13-t7', ch: 'ch13', kp: 'ch13-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '关于递归算法的空间复杂度，下列说法正确的是？',
      options: [
        { text: '主要取决于递归调用栈的最大深度（每层一个栈帧）', correct: true },
        { text: '递归算法空间复杂度都是 O(1)' },
        { text: '取决于方法里写了多少行代码' },
        { text: '空间复杂度与递归无关' }
      ],
      explain: '递归每层调用压一个栈帧，同时存活的帧数 = 递归深度。所以递归阶乘 O(n)、二分递归 O(log n)、快排平均 O(log n) 最坏 O(n)；归并排序栈深度 O(log n) 但合并数组 O(n)，总额外空间 O(n)。' },

    { id: 'ch13-f3', ch: 'ch13', kp: 'ch13-1', tier: 2, type: 'fill', mode: 'findbug', difficulty: 2, tags: ['bug', 'bigo'],
      stem: '程序本意是计算 2⁵（用循环连乘 5 次），实际输出 0。指出哪一行有问题并改正。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int result = 0;\n        for (int i = 0; i < 5; i++) {\n            result = result * 2;\n        }\n        System.out.println(result);\n        int sum = 0;\n        for (int i = 1; i <= 5; i++) {\n            sum += i;\n        }\n        System.out.println(sum);\n    }\n}',
      answer: '第 3 行：`int result = 0;` 初值应为 1，否则 0 乘任何数仍是 0',
      accept: [
        { hint: '指出初值错误（第 3 行 `result = 0`）', any: ['第3行', '第 3 行', '3行', '行3', '初值', 'result=0'] },
        { hint: '把初值改成 1', any: ['改成1', '初始值1', 'result=1', '等于1', '初值应为1'] }
      ],
      fix: 'public class Q {\n    public static void main(String[] args) {\n        int result = 1;\n        for (int i = 0; i < 5; i++) {\n            result = result * 2;\n        }\n        System.out.println(result);\n        int sum = 0;\n        for (int i = 1; i <= 5; i++) {\n            sum += i;\n        }\n        System.out.println(sum);\n    }\n}',
      explain: '连乘的**单位元是 1**（类似连加的单位元是 0）：result 从 0 开始，`0 * 2` 永远是 0。修成 `int result = 1;` 后循环 5 次得到 32。找 bug 时看“累加/累乘的初值”是经典检查点——找最小值初值用 a[0]、累加用 0、累乘用 1。' },

    { id: 'ch13-t9', ch: 'ch13', kp: 'ch13-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '下面哪段代码的时间复杂度是 O(log n)？',
      options: [
        { text: '`for (int i = 1; i &lt; n; i *= 3) { c++; }`', correct: true },
        { text: '`for (int i = 0; i &lt; n; i++) { c++; }`' },
        { text: '`for (int i = 0; i &lt; n; i++) for (int j = 0; j &lt; n; j++) { c++; }`' },
        { text: '`for (int i = 0; i &lt; 100; i++) { c++; }`' }
      ],
      explain: '循环变量**每次乘/除以常数**（i *= 3、i /= 2）时，循环次数是 log 级：i 取 1、3、9、27…直到 ≥n，共约 log₃n 次 → O(log n)（底数不影响大 O）。A 是 O(1)（固定 100 次）、B 是 O(n)、C 是 O(n²)。' },

    { id: 'ch13-c1', ch: 'ch13', kp: 'ch13-5', tier: 3, type: 'code', difficulty: 2, tags: ['code', 'bigo'],
      stem: '补全方法 <code>log2</code>：返回 ⌊log₂n⌋ + 1（n ≥ 1），用“反复除以 2 并计数”的倍增思路实现。例如 n=8 返回 4、n=1000 返回 10。',
      starter: 'public class Q {\n    static int log2(int n) {\n        // TODO: 返回 floor(log2(n)) + 1（n >= 1），用“反复除以 2 并计数”的方式实现\n        return 0;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(log2(n));\n    }\n}',
      solution: 'public class Q {\n    static int log2(int n) {\n        int count = 0;\n        while (n > 1) {\n            n = n / 2;\n            count++;\n        }\n        return count + 1;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(log2(n));\n    }\n}',
      tests: [
        { args: ['1'], expect: '1' },
        { args: ['8'], expect: '4' },
        { args: ['1000'], expect: '10' }
      ],
      explain: '`while (n > 1) { n = n / 2; count++; }` 数出“除以 2 到 1”需要几步，再加 1。n=1 不循环直接返回 1；n=8 → 8→4→2→1 三步 → 4；n=1000 → 九步 → 10。这个计数正是二分查找的轮数上界，也是“指数增长的反函数是 log”的直观体现。' },

    { id: 'ch13-p2', ch: 'ch13', kp: 'ch13-5', tier: 4, type: 'predict', difficulty: 3, tags: ['output', 'bigo'],
      stem: '读下面的“操作计数”程序，<b>写出完整输出（逐行）</b>。追问：① 4 个计数器分别对应什么复杂度？② n 从 8 变 16 时，哪几个数变成 2 倍、哪几个变成 4 倍、哪个只 +1？',
      code: 'public class Q {\n    static int linear(int n) {\n        int c = 0;\n        for (int i = 0; i < n; i++) {\n            c++;\n        }\n        return c;\n    }\n    static int quadratic(int n) {\n        int c = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < n; j++) {\n                c++;\n            }\n        }\n        return c;\n    }\n    static int triangle(int n) {\n        int c = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < i; j++) {\n                c++;\n            }\n        }\n        return c;\n    }\n    static int logarithmic(int n) {\n        int c = 0;\n        for (int i = 1; i < n; i *= 2) {\n            c++;\n        }\n        return c;\n    }\n    public static void main(String[] args) {\n        System.out.println(linear(8));\n        System.out.println(quadratic(8));\n        System.out.println(triangle(8));\n        System.out.println(logarithmic(8));\n        System.out.println(linear(16));\n        System.out.println(quadratic(16));\n        System.out.println(triangle(16));\n        System.out.println(logarithmic(16));\n    }\n}',
      answer: '8\n64\n28\n3\n16\n256\n120\n4',
      explain: '① linear：n → O(n)；quadratic：n² → O(n²)；triangle：n(n-1)/2 → O(n²)；logarithmic：log₂n → O(log n)；② n=8 时分别是 8、64、28、3；n=16 时 16、256、120、4。翻倍时：linear ×2、quadratic/triangle ×4、log 只 +1。这就是“倍增法”判断复杂度的实测方法。' },

    { id: 'ch13-c2', ch: 'ch13', kp: 'ch13-4', tier: 3, type: 'code', difficulty: 2, tags: ['code', 'bigo'],
      stem: '补全方法 <code>triangleOps</code>：返回双层循环 <code>for (i=0;i&lt;n;i++) for (j=0;j&lt;i;j++)</code> 的总操作次数。',
      starter: 'public class Q {\n    static int triangleOps(int n) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(triangleOps(n));\n    }\n}',
      solution: 'public class Q {\n    static int triangleOps(int n) {\n        int c = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < i; j++) {\n                c++;\n            }\n        }\n        return c;\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(triangleOps(n));\n    }\n}',
      tests: [
        { args: ['5'], expect: '10' },
        { args: ['1'], expect: '0' },
        { args: ['8'], expect: '28' }
      ],
      explain: '内层执行 i 次：0+1+2+…+(n-1) = n(n-1)/2。n=5 → 10、n=8 → 28。这是 O(n²) 的“三角形”形态（次数是正方形的一半），复杂度分析题常考。' },

    { id: 'ch13-c4', ch: 'ch13', kp: 'ch13-4', tier: 4, type: 'code', difficulty: 3, tags: ['code', 'bigo'],
      stem: '<b>跨章综合</b>：补全方法 <code>complexity</code>，返回长度 4 的 int 数组：分别统计 n 次线性循环、n×n 双层循环、三角形双层循环、以及“每次除 2”循环（n≥1）的操作次数。main 用 Arrays.toString 打印。',
      starter: 'public class Q {\n    static int[] complexity(int n) {\n        return new int[4];\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(java.util.Arrays.toString(complexity(n)));\n    }\n}',
      solution: 'public class Q {\n    static int[] complexity(int n) {\n        int linear = 0;\n        for (int i = 0; i < n; i++) {\n            linear++;\n        }\n        int quad = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < n; j++) {\n                quad++;\n            }\n        }\n        int tri = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < i; j++) {\n                tri++;\n            }\n        }\n        int log = 0;\n        int x = n;\n        while (x > 1) {\n            x = x / 2;\n            log++;\n        }\n        return new int[]{linear, quad, tri, log};\n    }\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(java.util.Arrays.toString(complexity(n)));\n    }\n}',
      tests: [
        { args: ['8'], expect: '[8, 64, 28, 3]' },
        { args: ['1'], expect: '[1, 1, 0, 0]' }
      ],
      explain: '四种循环形态各数一次：O(n)=n、O(n²)=n²、三角形=n(n-1)/2、O(log n)=⌊log₂n⌋。n=8 → [8, 64, 28, 3]；n=1 → [1, 1, 0, 0]。返回值用 `new int[]{…}` 数组字面量，main 用 Arrays.toString 打印。复杂度分析 + 数组 + 方法的综合。' },

    { id: 'ch13-n1', ch: 'ch13', kp: 'ch13-7', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '`for (i = 0; i &lt; n; i++) for (j = 0; j &lt; 3; j++) c++;` 的复杂度是？',
      options: [
        { text: 'O(n)（内层固定 3 次，总 3n）', correct: true },
        { text: 'O(n²)' },
        { text: 'O(3)' },
        { text: 'O(n log n)' }
      ],
      explain: '内层循环上界是常数 3（不随 n 增长）→ 总次数 3n → 忽略系数是 O(n)。误区：看到两层 for 就写 O(n²)。数复杂度要看总次数，不看括号层数。' },

    { id: 'ch13-n2', ch: 'ch13', kp: 'ch13-7', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '`for (i = 0; i &lt; n; i++) for (j = 0; j &lt; i; j++) c++;` 的复杂度是？',
      options: [
        { text: 'O(n²)（总次数 n(n-1)/2）', correct: true },
        { text: 'O(n)（只有“一层半”循环）' },
        { text: 'O(n log n)' },
        { text: 'O(1)' }
      ],
      explain: '内层次数随 i 变化：0+1+2+…+(n-1) = n(n-1)/2，是 n² 量级（虽然有 1/2 系数）→ O(n²)。反过来，“看起来只有一层半”也可能是指数级——必须写出总次数再化简。' },

    { id: 'ch13-n3', ch: 'ch13', kp: 'ch13-7', tier: 1, type: 'tf', difficulty: 1, tags: ['trap', 'bigo'],
      stem: '判断：只要代码里有两层嵌套 for 循环，时间复杂度就一定是 O(n²)。',
      options: [
        { text: '正确（True）' },
        { text: '错误（False）', correct: true }
      ],
      explain: '不一定！内层循环次数是常数（如 j&lt;3）时是 O(n)；两层都跑 log 级时是 O(log²n)；内层调用二分查找时是 O(n log n)。正确做法：数**总操作次数**（每层循环次数相乘/相加），再化简，不能只看嵌套层数。' },

    { id: 'ch13-n4', ch: 'ch13', kp: 'ch13-7', tier: 2, type: 'predict', difficulty: 2, tags: ['output', 'bigo'],
      stem: '写出下面“复杂度误区”程序的完整输出（逐行）。',
      code: 'public class Q {\n    public static void main(String[] args) {\n        int n = 50;\n        int c1 = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < 3; j++) {\n                c1++;\n            }\n        }\n        System.out.println(c1);\n        int c2 = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < i; j++) {\n                c2++;\n            }\n        }\n        System.out.println(c2);\n    }\n}',
      answer: '150\n1225',
      explain: '① 外层 50 次、内层固定 3 次 → 150 = 3n → O(n)；② 外层 50 次、内层 i 次 → 0+1+…+49 = 1225 = n(n-1)/2 → O(n²)。两个都是两层 for，复杂度却不同——结论：数总次数，不要数括号层数。' },

    { id: 'ch13-n5', ch: 'ch13', kp: 'ch13-7', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '避免复杂度误判的正确做法是？',
      options: [
        { text: '先写出总操作次数 T(n) 的表达式，再取最高阶、去系数化简', correct: true },
        { text: '看代码有几个 for' },
        { text: '看代码行数' },
        { text: '看变量个数' }
      ],
      explain: '三步模板：① 找循环（每层循环次数是 n 的什么函数）；② 乘每步代价（循环体里有 O(n) 操作要乘上去）；③ 加总再化简（并列相加取最大阶、去系数、丢低阶）。先写式子再化简，比直接猜“看起来像 n²”可靠。' },

    { id: 'ch13-n6', ch: 'ch13', kp: 'ch13-8', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept', 'bigo'],
      stem: '排查一个程序的复杂度是否被写错，第一步应该做什么？',
      options: [
        { text: '做规模实验：把 n 翻倍两次，看耗时或操作数怎么变', correct: true },
        { text: '把代码里的循环删掉' },
        { text: '把变量名改短' },
        { text: '直接重写整个程序' }
      ],
      explain: '复杂度排查流程：① 测规模（n 翻倍，观察代价变化倍数）；② 找热点（哪个循环/操作占大头）；③ 算阶（写出 T(n)）。只测两个点无法区分“收敛到 4”还是“偶然 4”——至少三个点并看比值是否收敛。' },

    { id: 'ch13-n7', ch: 'ch13', kp: 'ch13-8', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '用倍增法观测到：n 翻倍时运行时间变为约 2.2 倍。最可能的复杂度是？',
      options: [
        { text: 'O(n log n)（比值约 2.2，不是整数不代表不是那个阶）', correct: true },
        { text: 'O(n²)（应该是 4 倍）' },
        { text: 'O(log n)' },
        { text: 'O(1)' }
      ],
      explain: 'O(n) 的比值约 2、O(n²) 约 4、O(log n) 接近 1；n log n 的比值 = (2n·(log n+1))/(n·log n) ≈ 2.2。比值不是整数不代表不是那个阶——要看三个点后比值是否稳定在某个值附近。' },

    { id: 'ch13-n8', ch: 'ch13', kp: 'ch13-8', tier: 1, type: 'fill', difficulty: 1, tags: ['concept', 'bigo'],
      stem: '填空：用倍增法判断复杂度，至少测 `_____`（填数字）个数据点，并看后两个比值是否收敛。',
      answer: ['3', '三', '三个'],
      explain: '只测两个点得到的就是一个比值，无法区分“收敛到 4”还是“偶然 4”。至少三个点：25→50→100，看后两个比值是否稳定（如 4.08、4.04 收敛到 4 → O(n²)）。另外教学/自测最好数操作次数而不是计时（时间噪声大）。' },

    { id: 'ch13-n9', ch: 'ch13', kp: 'ch13-8', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '观测复杂度时，为什么建议“数操作次数”而不是“计时”？',
      options: [
        { text: '计时受机器、负载、JIT 等噪声影响；操作次数只取决于算法本身', correct: true },
        { text: '因为计时函数不存在' },
        { text: '因为操作次数一定更小' },
        { text: '因为计时会改变程序结果' }
      ],
      explain: '同一程序在不同机器/负载下耗时差异很大，教学与自测里用计时测复杂度会让比值抖动；数操作次数（在每个基本操作处计数器 +1）能精确反映算法的增长趋势。工程上两者结合：先数操作确认阶，再看实际耗时。' },

    { id: 'ch13-n10', ch: 'ch13', kp: 'ch13-8', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '一个 O(n²) 的程序在 n=100 时很快，为什么不能说明它是 O(n)？',
      options: [
        { text: '小规模时低阶项/常数占主导，增长趋势要到 n 足够大才显现', correct: true },
        { text: '因为 Java 会缓存结果' },
        { text: '因为 n=100 太小，程序会报错' },
        { text: '因为 O(n²) 程序在 n=100 时一定很慢' }
      ],
      explain: 'Big-O 描述的是 n → ∞ 的增长趋势。n=100 时 n²=10⁴ 与 n=100 只差两个数量级，常数项可能掩盖差异；n=10000 时 n²=10⁸、n=10⁴，差距才会明显。判断复杂度必须测多个规模（倍增），不能凭单点快慢。' },

    { id: 'ch13-n11', ch: 'ch13', kp: 'ch13-9', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '“数组去重”的三种实现：双层循环查重、先排序再单趟、哈希集合。它们的复杂度分别是？',
      options: [
        { text: 'O(n²)、O(n log n)、平均 O(n)', correct: true },
        { text: 'O(n)、O(n)、O(n)' },
        { text: 'O(n²)、O(n²)、O(n²)' },
        { text: 'O(n log n)、O(n)、O(n²)' }
      ],
      explain: '① 双层循环：每来一个新元素回头扫已保留元素 → O(n²)；② 先排序（O(n log n)）再单趟（O(n)）→ 总 O(n log n)；③ 哈希集合：插入/查找平均 O(1) → O(n)，代价是 O(n) 额外空间。三种方法体现“用空间换时间”和“排序预处理”。' },

    { id: 'ch13-n12', ch: 'ch13', kp: 'ch13-9', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '哈希集合去重为什么能到平均 O(n)？',
      options: [
        { text: '每个元素插入/查找平均 O(1)，总代价 O(n)，代价是 O(n) 额外空间', correct: true },
        { text: '因为哈希集合会自动排序' },
        { text: '因为哈希集合不存储元素' },
        { text: '因为哈希集合的复杂度是 O(1)' }
      ],
      explain: 'HashSet 用哈希表：add/contains 平均 O(1)。遍历 n 个元素各做一次插入 → 平均 O(n)。代价是额外 O(n) 空间（哈希表本身）。这是典型的“用空间换时间”，也是第 10 章选容器时要能说出的取舍。' },

    { id: 'ch13-n13', ch: 'ch13', kp: 'ch13-9', tier: 1, type: 'tf', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '判断：先排序再单趟扫描去重，总代价不会优于“双层循环查重”的 O(n²)。',
      options: [
        { text: '正确（True）' },
        { text: '错误（False）', correct: true }
      ],
      explain: '排序 O(n log n) + 单趟 O(n) = O(n log n)，在 n 较大时明显优于 O(n²)（n=10⁶ 时 n log n≈2×10⁷，n²=10¹²）。注意前提是“排序本身 O(n log n)”；如果输入已经有序，去重只要 O(n)。' },

    { id: 'ch13-n14', ch: 'ch13', kp: 'ch13-9', tier: 2, type: 'predict', difficulty: 3, tags: ['output', 'bigo'],
      stem: '下面程序统计两种去重写法的比较操作次数。写出完整输出（逐行）。',
      code: 'public class Q {\n    static int dedupeQuadraticOps(int[] a) {\n        int[] keep = new int[a.length];\n        int size = 0;\n        int ops = 0;\n        for (int i = 0; i < a.length; i++) {\n            boolean dup = false;\n            for (int j = 0; j < size; j++) {\n                ops++;\n                if (keep[j] == a[i]) {\n                    dup = true;\n                    break;\n                }\n            }\n            if (!dup) {\n                keep[size] = a[i];\n                size++;\n            }\n        }\n        return ops;\n    }\n    static int dedupeSortedOps(int[] a) {\n        int[] b = new int[a.length];\n        for (int i = 0; i < a.length; i++) {\n            b[i] = a[i];\n        }\n        java.util.Arrays.sort(b);\n        int ops = 0;\n        for (int i = 1; i < b.length; i++) {\n            ops++;\n        }\n        return ops;\n    }\n    public static void main(String[] args) {\n        int[] a = {3, 1, 3, 2, 1, 3, 2, 1, 3, 2};\n        System.out.println(dedupeQuadraticOps(a));\n        System.out.println(dedupeSortedOps(a));\n    }\n}',
      answer: '16\n9',
      explain: '① 双层循环查重：每来一个新元素与已保留元素比较。数组 {3,1,3,2,1,3,2,1,3,2}：保留 3（0 次）、1（1 次）、再遇 3（2 次命中）、2（3 次）... 总计 16 次 → O(n²)；② 排序后单趟：相邻比较 n-1 = 9 次 → O(n)（再加排序的 O(n log n)）。数据规模只有 10，但 16 : 9 的比例已能看出增长趋势差异。' },

    { id: 'ch13-n15', ch: 'ch13', kp: 'ch13-9', tier: 4, type: 'predict', difficulty: 3, tags: ['output', 'bigo'],
      stem: '<b>综合</b>：读下面的“三种去重写法”对比程序，<b>写出完整输出（逐行）</b>。追问：① 为什么 quadratic 版保留的是 [3, 1, 2]、sorted 版是 [1, 2, 3]？② 原数组为什么没变？',
      code: 'public class Q {\n    static int[] dedupeQuadratic(int[] a) {\n        int[] out = new int[a.length];\n        int size = 0;\n        for (int i = 0; i < a.length; i++) {\n            boolean dup = false;\n            for (int j = 0; j < size; j++) {\n                if (out[j] == a[i]) {\n                    dup = true;\n                    break;\n                }\n            }\n            if (!dup) {\n                out[size] = a[i];\n                size++;\n            }\n        }\n        int[] r = new int[size];\n        for (int i = 0; i < size; i++) {\n            r[i] = out[i];\n        }\n        return r;\n    }\n    static int[] dedupeSorted(int[] a) {\n        int[] sorted = new int[a.length];\n        for (int i = 0; i < a.length; i++) {\n            sorted[i] = a[i];\n        }\n        java.util.Arrays.sort(sorted);\n        int[] out = new int[a.length];\n        int size = 0;\n        for (int i = 0; i < sorted.length; i++) {\n            if (i == 0 || sorted[i] != sorted[i - 1]) {\n                out[size] = sorted[i];\n                size++;\n            }\n        }\n        int[] r = new int[size];\n        for (int i = 0; i < size; i++) {\n            r[i] = out[i];\n        }\n        return r;\n    }\n    public static void main(String[] args) {\n        int[] a = {3, 1, 3, 2, 1, 2, 3};\n        System.out.println(java.util.Arrays.toString(dedupeQuadratic(a)));\n        System.out.println(java.util.Arrays.toString(dedupeSorted(a)));\n        System.out.println(a.length);\n    }\n}',
      answer: '[3, 1, 2]\n[1, 2, 3]\n7',
      explain: '① 双层循环按**首次出现的顺序**保留：3、1、2 → [3, 1, 2]；② 排序版先去重排序、再按升序保留 → [1, 2, 3]；③ 两个方法都新建了数组、没有修改入参 → 原数组长度仍是 7；④ 三种复杂度对比：O(n²) / O(n log n) / 平均 O(n)——这正是 ch13 案例课的核心：同一需求、不同实现、不同复杂度。' },

    { id: 'ch13-n16', ch: 'ch13', kp: 'ch13-10', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept', 'bigo'],
      stem: '倍增法测得 n 翻倍时操作数变为约 4 倍，说明复杂度是？',
      options: [
        { text: 'O(n²)（平方级）', correct: true },
        { text: 'O(n)' },
        { text: 'O(log n)' },
        { text: 'O(2ⁿ)' }
      ],
      explain: '倍增判据：n 翻倍 → 代价 ×2 → O(n)；×4 = 2² → O(n²)；几乎不变 → O(1)；只增加一个固定量 → O(log n)。注意 4 倍对应平方，不是“4 次方”。' },

    { id: 'ch13-n17', ch: 'ch13', kp: 'ch13-10', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '用倍增法得到比值 2.1、2.05、2.02（三个点），最可能是哪种复杂度？',
      options: [
        { text: 'O(n)（常数因子导致略高于 2）', correct: true },
        { text: 'O(n²)' },
        { text: 'O(log n)' },
        { text: '无法判断' }
      ],
      explain: '理论比值：O(n) 是 2、O(n²) 是 4、O(log n) 接近 1、O(n log n) 约 2.2。实测 2.1、2.05、2.02 收敛到 2 → O(n)；略高于 2 是低阶项/常数噪声（n 小时明显）。比值不是精确整数很正常，要看收敛趋势。' },

    { id: 'ch13-n18', ch: 'ch13', kp: 'ch13-10', tier: 1, type: 'fill', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '填空：倍增法拟合曲线时，若后两个比值稳定在 4.08、4.04，可判断为平方级；若稳定在 2 附近，可判断为 `_____`（用 Big-O 表示，如 O(n)）。',
      answer: ['O(n)', 'o(n)'],
      explain: '比值 ≈2 → O(n)；≈4 → O(n²)；≈2.2 → O(n log n)；≈1（只增加常数） → O(log n)。倍增法的价值：不需要看源码，只要能把 n 翻倍、观察代价，就能判断黑盒的复杂度阶（代价用操作计数器而不是计时更稳）。' },

    { id: 'ch13-n19', ch: 'ch13', kp: 'ch13-10', tier: 2, type: 'predict', difficulty: 3, tags: ['output', 'bigo'],
      stem: '下面程序用 work(n) = n(n-1)/2 模拟一个平方级算法，并打印三个规模与两个比值。写出完整输出（逐行）。',
      code: 'public class Q {\n    static long work(int n) {\n        long ops = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < i; j++) {\n                ops++;\n            }\n        }\n        return ops;\n    }\n    public static void main(String[] args) {\n        int[] ns = {25, 50, 100};\n        for (int i = 0; i < ns.length; i++) {\n            System.out.println(ns[i] + " -> " + work(ns[i]));\n        }\n        System.out.println("ratio2 = " + (double) work(50) / work(25));\n        System.out.println("ratio4 = " + (double) work(100) / work(50));\n    }\n}',
      answer: '25 -> 300\n50 -> 1225\n100 -> 4950\nratio2 = 4.083333333333333\nratio4 = 4.040816326530612',
      explain: '① work(25)=300、work(50)=1225、work(100)=4950（都是 n(n-1)/2）；② ratio2 = 1225/300 ≈ 4.083、ratio4 = 4950/1225 ≈ 4.041，收敛到 4 → 平方级；③ 首次比值偏高是因为 n 小时低阶项还有影响。倍增拟合要看后两个比值是否收敛，至少三个点。' },

    { id: 'ch13-n20', ch: 'ch13', kp: 'ch13-10', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '对陌生代码做复杂度分析，推荐的三步模板是？',
      options: [
        { text: '找循环（每层次数是 n 的什么函数）→ 乘每步代价 → 加总再化简', correct: true },
        { text: '数代码行数 → 数变量个数 → 求平均' },
        { text: '运行一次记下耗时 → 除以 n' },
        { text: '看方法名里有没有 sort' }
      ],
      explain: '三步模板：① 找循环，写出每层循环次数关于 n 的表达式；② 乘每步代价（循环体里有 O(n) 操作要乘上去，如内层调用二分查找 → O(n log n)）；③ 并列部分相加取最大阶、去系数、丢低阶。先写式子再化简，比凭感觉可靠。' },

    { id: 'ch13-d1', ch: 'ch13', kp: 'ch13-1', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '分析算法时“数基本操作次数”而不是“看代码行数”，主要原因是？',
      options: [
        { text: '操作次数反映算法本身的增长趋势，与机器/语言/编译器无关', correct: true },
        { text: '代码行数无法数清' },
        { text: '操作次数一定等于运行毫秒数' },
        { text: '行数少的代码一定快' }
      ],
      explain: '同一段代码在不同机器上耗时差异很大，但“执行了多少次比较/赋值/循环体”是算法自身的性质。Big-O 分析操作次数随 n 的增长趋势，因此能跨机器比较算法优劣。' },

    { id: 'ch13-d2', ch: 'ch13', kp: 'ch13-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept', 'bigo'],
      stem: '下列说法中，哪一个是 Big-O 的正确理解？',
      options: [
        { text: '描述操作次数随输入规模增长的**上界**（忽略常数与低阶项）', correct: true },
        { text: '精确的秒数' },
        { text: '代码行数' },
        { text: '程序占用的内存大小' }
      ],
      explain: 'Big-O 描述增长趋势的上界：O(n) 表示“操作次数最多与 n 成正比（差一个常数）”。它不精确到具体次数、也不是时间。空间复杂度则是另一套指标（O(1)、O(n) 等）。' },

    { id: 'ch13-d3', ch: 'ch13', kp: 'ch13-2', tier: 1, type: 'fill', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '填空：化简 Big-O 时，`2n² + 3n + 1` 记作 O(_____)。',
      answer: ['n²', 'n^2', 'n2', 'n的平方'],
      explain: '化简三步：去系数（2n² → n²）、丢低阶项（3n、1 在 n 很大时忽略）、取最高阶 → O(n²)。Big-O 只关心 n → ∞ 时的主导项，所以常数与低阶项都被省略。' },

    { id: 'ch13-d4', ch: 'ch13', kp: 'ch13-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: 'n=1000 时，下列复杂度对应操作量级从大到小的排序，正确的是？',
      options: [
        { text: 'O(2ⁿ) > O(n²) > O(n log n) > O(n) > O(log n) > O(1)', correct: true },
        { text: 'O(1) > O(log n) > O(n) > O(n log n) > O(n²) > O(2ⁿ)' },
        { text: 'O(n²) > O(2ⁿ) > O(n log n)' },
        { text: '全都一样' }
      ],
      explain: '增长速度排序：O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(2ⁿ)。反过来就是从大到小。n=1000 时：log n≈10、n=10³、n log n≈10⁴、n²=10⁶、2ⁿ 天文数字。' },

    { id: 'ch13-d5', ch: 'ch13', kp: 'ch13-6', tier: 1, type: 'mcq', difficulty: 2, tags: ['concept', 'bigo'],
      stem: '关于空间复杂度，下列说法正确的是？',
      options: [
        { text: '只统计算法额外申请的辅助空间随 n 的增长趋势，不含输入本身', correct: true },
        { text: '包含输入数组占用的空间' },
        { text: '等于程序文件的字节数' },
        { text: '所有算法空间复杂度都是 O(1)' }
      ],
      explain: '空间复杂度衡量**额外**辅助内存：选择排序原地交换 → O(1)；归并排序合并需要临时数组 → O(n)；递归算法的调用栈深度也要算（快排平均 O(log n)）。输入数据本身不计入。' },


    /* ===== 教材对照补题（2026-11-12 合并，来自 _build/quiz/*.json） ===== */
    {"id":"ch00-k1","ch":"ch00","kp":"ch00-8","tier":1,"type":"mcq","difficulty":1,"tags":["concept"],"stem":"教材《计算机科学：跨学科方法》正文只有 7 章，本站把它展开成 26 章。下列对应关系正确的是？","options":[{"text":"教材第 1 章讲面向对象，本站对应 ch07–ch09"},{"text":"教材第 2 章讲函数与模块，本站对应 ch06","correct":true},{"text":"教材第 5 章讲排序与查找，本站对应 ch11"},{"text":"教材第 7 章讲计算理论，本站对应 ch20–ch22"}],"explain":"教材 7 章的层次依次是：第 1 章基础（本站 ch01–ch05）、第 2 章函数与模块（ch06）、第 3 章面向对象（ch07–ch09）、第 4 章算法与数据结构（ch10–ch19）、第 5 章计算理论（ch20–ch22）、第 6 章计算机器（ch23–ch24）、第 7 章造一台计算机（ch25）。"},
    {"id":"ch00-k2","ch":"ch00","kp":"ch00-4","tier":1,"type":"fill","difficulty":1,"tags":["concept"],"stem":"本站把 26 章分成 ____ 个部分：前四部分是主课，后四部分属于继续学习。（填阿拉伯数字）","answer":"8","accept":["八","8 个"],"explain":"八个部分：Part I 起点（00–02）、Part II 控制与数据（03–05）、Part III 抽象与对象（06–10）、Part IV 算法与效率（11–13）是主课；Part V 案例研究（14–16）、Part VI 算法与数据结构（17–19）、Part VII 计算理论（20–22）、Part VIII 机器与硬件（23–25）是继续学习。"},
    {"id":"ch00-k3","ch":"ch00","kp":"ch00-3","tier":2,"type":"tf","difficulty":2,"tags":["concept"],"stem":"判断：教材第 5–7 章（计算理论、计算机器、造一台计算机）不再以“写程序”为主线，而是讨论计算的边界与机器的实现。","options":[{"text":"正确（True）","correct":true},{"text":"错误（False）"}],"explain":"教材后半本换了问题：第 5 章问“什么可计算、什么不可计算”，第 6 章拆开一台机器看数据与指令如何表示，第 7 章用逻辑门搭出计算器。它们不要求你写更多程序，而是理解程序跑在什么样的机器上、边界在哪里。"},
    {"id":"ch01-k3","ch":"ch01","kp":"ch01-3","tier":1,"type":"mcq","difficulty":1,"tags":["commandline"],"stem":"Hello.class 已经编译好，在命令行执行 <code>java Hello</code>。这条命令里的 <code>Hello</code> 指的是？","options":[{"text":"文件名，必须写成 Hello.java"},{"text":"类名，不带 .class 后缀","correct":true},{"text":"方法名，对应 main 方法"},{"text":"包名"}],"explain":"两条命令的分工：<code>javac</code> 吃源文件名（javac Hello.java），<code>java</code> 吃类名（java Hello），类名后面不加 .class。程序入口 main 由 JVM 自动找到，不需要在命令行里写。"},
    {"id":"ch01-k4","ch":"ch01","kp":"ch01-10","tier":2,"type":"predict","difficulty":2,"tags":["output"],"stem":"写出下面程序的完整输出。","code":"public class Q { public static void main(String[] args) { System.out.print(\"Hi, \"); System.out.print(\"Alice\"); System.out.println(\". How are you?\"); } }","answer":"Hi, Alice. How are you?","explain":"<code>print</code> 输出后不换行，前两次输出留在同一行，第三次 <code>println</code> 接着写并补一个换行。所以三段文字拼成一句：Hi, Alice. How are you? 注意逗号后的空格来自第一个字符串的结尾。"},
    {"id":"ch01-k5","ch":"ch01","kp":"ch01-10","tier":1,"type":"mcq","difficulty":1,"tags":["concept"],"stem":"教材 §1.1 把运行一个程序拆成 create / compile / execute 三步。其中 <code>javac UseArgument.java</code> 属于哪一步、留下什么文件？","options":[{"text":"compile（编译），留下 UseArgument.class","correct":true},{"text":"execute（执行），留下 UseArgument.class"},{"text":"compile（编译），留下 UseArgument.java"},{"text":"execute（执行），在屏幕上打印结果"}],"explain":"<code>javac</code> 是编译器：把人类读的 .java 翻译成 JVM 读的 .class（字节码），这一步只检查语法和类型，不运行程序。<code>java UseArgument</code> 才是 execute，JVM 加载 .class 并执行 main。"},
    {"id":"ch02-k5","ch":"ch02","kp":"ch02-12","tier":1,"type":"mcq","difficulty":1,"tags":["concept"],"stem":"教材把 int、double、boolean、char、String 并列为“五种内置类型”。按 Java 的类型系统，其中哪一个不是原始类型（primitive type）？","options":[{"text":"int"},{"text":"double"},{"text":"char"},{"text":"String","correct":true}],"explain":"Java 的原始类型只有 8 种：byte、short、int、long、float、double、boolean、char。String 是类（对象），只是用起来太频繁、编译器给了字面量写法，教材才把它和四种原始类型放在一起讲。"},
    {"id":"ch02-k6","ch":"ch02","kp":"ch02-12","tier":2,"type":"predict","difficulty":2,"tags":["output"],"stem":"写出下面程序的输出。","code":"public class Q { public static void main(String[] args) { int year = 2004; boolean isLeapYear = (year % 4 == 0); isLeapYear = isLeapYear && (year % 100 != 0); isLeapYear = isLeapYear || (year % 400 == 0); System.out.println(isLeapYear); } }","answer":"true","explain":"2004 % 4 == 0 → true；2004 % 100 != 0 → true，true && true 仍为 true；2004 % 400 == 0 为 false，true || false 还是 true。这个写法把闰年规则拆成“能被 4 整除”“不是整百年”“或是整四百年”三步，每步只改一个条件。"},
    {"id":"ch02-k7","ch":"ch02","kp":"ch02-5","tier":1,"type":"fill","difficulty":1,"tags":["conversion"],"stem":"把 double 强制转换成 int：<code>(int) 3.9</code> 的结果是 ____。（填数字）","answer":"3","explain":"强制类型转换是“截断”，直接丢掉小数部分，不是四舍五入：3.9 → 3，-3.9 → -3。要四舍五入得用 <code>Math.round(3.9)</code>。"},
    {"id":"ch03-k9","ch":"ch03","kp":"ch03-13","tier":2,"type":"mcq","difficulty":2,"tags":["concept"],"stem":"教材 §1.3 的五个程序里，牛顿迭代法求平方根用 while 而不是 for。最合适的理由是？","options":[{"text":"while 比 for 运行得快"},{"text":"循环次数事先不知道，只知道“误差小于阈值就停”","correct":true},{"text":"教材到第 4 章才讲 for"},{"text":"while 可以省略循环变量"}],"explain":"for 适合“跑固定次数”（1 到 n 遍历、数组下标扫描）；while 适合“跑到条件不满足为止”。牛顿法每轮的误差取决于输入，事先算不出要几轮，所以只能写成 <code>while (Math.abs(t - c / t) &gt; 1e-15)</code> 这种形式。"},
    {"id":"ch03-k10","ch":"ch03","kp":"ch03-13","tier":2,"type":"predict","difficulty":2,"tags":["output"],"stem":"写出下面程序的输出。","code":"public class Q { public static void main(String[] args) { int n = 2; double sum = 0.0; for (int i = 1; i <= n; i++) { sum += 1.0 / i; } System.out.println(sum); } }","answer":"1.5","explain":"n = 2 时循环累加 1.0/1 + 1.0/2 = 1.0 + 0.5 = 1.5。写 <code>1.0 / i</code> 而不是 <code>1 / i</code> 是关键：整数除法 1/2 会得到 0。"},
    {"id":"ch03-k11","ch":"ch03","kp":"ch03-4","tier":1,"type":"fill","difficulty":1,"tags":["loop"],"stem":"do-while 与 while 的关键区别：do-while 的循环体至少执行 ____ 次，而 while 可能一次都不执行。（填阿拉伯数字）","answer":"1","explain":"do-while 先执行循环体、再判断条件，所以哪怕条件一开始就是 false，循环体也跑过一次；while 先判断后执行，条件为 false 时直接跳过。do-while 适合“至少要做一次”的输入校验、菜单循环。"},
    {"id":"ch04-k3","ch":"ch04","kp":"ch04-12","tier":2,"type":"mcq","difficulty":2,"tags":["algorithm"],"stem":"洗牌算法里的 <code>int r = i + (int) (Math.random() * (n - i));</code> 在做什么？","options":[{"text":"在 0 到 n-1 里随便挑一个位置"},{"text":"在 i 到 n-1 里等概率挑一个位置，与 i 交换后保证每种排列概率相同","correct":true},{"text":"挑一个比 i 小的位置，往前交换"},{"text":"随机生成 0 或 1"}],"explain":"<code>Math.random()</code> 给 [0,1) 的 double，乘 (n-i) 后取整得到 0 到 n-i-1，加 i 就落在 i..n-1。每轮把“还没固定的部分”里随机一张换到第 i 位，i 从 0 扫到 n-1 时每种排列出现的概率都是 1/n!，这正是 Fisher–Yates 洗牌的等概率性。"},
    {"id":"ch04-k4","ch":"ch04","kp":"ch04-12","tier":2,"type":"predict","difficulty":2,"tags":["output"],"stem":"写出下面程序打印的数字。","code":"public class Q { public static void main(String[] args) { int n = 10; boolean[] isPrime = new boolean[n + 1]; for (int i = 2; i <= n; i++) { isPrime[i] = true; } for (int i = 2; i <= n / i; i++) { if (isPrime[i]) { for (int j = i; j <= n / i; j++) { isPrime[i * j] = false; } } } int count = 0; for (int i = 2; i <= n; i++) { if (isPrime[i]) { count++; } } System.out.println(count); } }","answer":"4","explain":"这是教材 Program 1.4.3 的素数筛：先把 2..10 全标成候选，再用 2、3 的倍数筛掉 4、6、8、9、10，剩下 2、3、5、7 共 4 个。注意循环条件是 <code>i &lt;= n / i</code>（等价于 i² ≤ n），比 <code>i &lt;= n</code> 少做很多无用工作。"},
    {"id":"ch04-k5","ch":"ch04","kp":"ch04-1","tier":1,"type":"fill","difficulty":1,"tags":["array"],"stem":"执行 <code>int[] a = new int[4];</code> 之后，还没有赋值的 a[2] 的值是 ____。（填数字）","answer":"0","explain":"Java 用 <code>new</code> 创建数组时会自动做默认初始化：int 数组全是 0，double 是 0.0，boolean 是 false，String 等对象引用是 null。所以“没赋值”不等于“未定义”，读取 a[2] 不会报错。"},
    {"id":"ch05-k6","ch":"ch05","kp":"ch05-12","tier":1,"type":"mcq","difficulty":1,"tags":["io"],"stem":"在命令行执行 <code>java Average &lt; data.txt</code>，其中的 <code>&lt;</code> 做了什么？","options":[{"text":"把 data.txt 的内容接到程序的标准输入","correct":true},{"text":"把程序的输出写进 data.txt"},{"text":"比较两个文件是否相同"},{"text":"把 data.txt 编译成类文件"}],"explain":"<code>&lt;</code> 是输入重定向：shell 打开 data.txt，把它的内容当作程序的“键盘输入”。反过来 <code>&gt;</code> 是输出重定向（把屏幕输出写进文件）。教材用这个技巧避免每次手动敲一长串数字来测试程序。"},
    {"id":"ch05-k7","ch":"ch05","kp":"ch05-5","tier":2,"type":"tf","difficulty":2,"tags":["graphics"],"stem":"判断：教材的 StdDraw 默认把画布看成 [0,1]×[0,1]，左下角是 (0,0)，y 轴朝上。","options":[{"text":"正确（True）","correct":true},{"text":"错误（False）"}],"explain":"StdDraw 默认坐标范围是 0 到 1，x 向右、y 向上，和数学习惯一致（屏幕像素的 y 轴则是朝下的，StdDraw 帮你翻了过来）。超出范围的点会被裁掉，所以画图前常先用 <code>setXscale</code>、<code>setYscale</code> 设好真实范围。"},
    {"id":"ch05-k8","ch":"ch05","kp":"ch05-12","tier":1,"type":"mcq","difficulty":1,"tags":["concept"],"stem":"教材说的“过滤器（filter）”指的是哪一类程序？","options":[{"text":"必须带图形界面的程序"},{"text":"从标准输入读数据、变换后写到标准输出，可以用管道串起来","correct":true},{"text":"只能处理音频的程序"},{"text":"专门过滤数组里重复元素的方法"}],"explain":"过滤器的固定骨架是“读一行/一个数 → 按规则变换 → 写出去”，不关心数据从哪来、到哪去。正因为只认标准输入输出，才能用 <code>|</code> 把多个小程序串成流水线：前一个的输出就是后一个的输入。"},
    {"id":"ch06-k3","ch":"ch06","kp":"ch06-12","tier":1,"type":"mcq","difficulty":1,"tags":["concept"],"stem":"教材把函数写成 <code>static</code> 方法，主要原因是什么？","options":[{"text":"static 方法运行更快"},{"text":"Java 没有独立存在的函数，方法必须属于某个类；static 表示不需要创建对象就能调用","correct":true},{"text":"static 方法不允许有参数"},{"text":"只有 main 方法能调用 static 方法"}],"explain":"在 Java 里，一切方法都写在类中：<code>harmonic</code> 属于某个类，用 <code>static</code> 修饰就不再依赖具体对象，可以直接写 <code>harmonic(4)</code> 调用——这正是数学意义上“函数”的用法。等到学面向对象（本站 ch07 起），你会看到不加 static 的实例方法。"},
    {"id":"ch06-k4","ch":"ch06","kp":"ch06-12","tier":2,"type":"predict","difficulty":2,"tags":["output"],"stem":"写出下面程序的输出。","code":"public class Q { static double harmonic(int n) { double sum = 0.0; for (int i = 1; i <= n; i++) { sum += 1.0 / i; } return sum; } public static void main(String[] args) { System.out.println(harmonic(3)); } }","answer":"1.8333333333333333","explain":"harmonic(3) = 1.0/1 + 1.0/2 + 1.0/3 = 1 + 0.5 + 0.3333333333333333 = 1.8333333333333333。教材 Program 2.1.1 的 main 用循环对命令行参数逐个调用它，这里直接硬编码参数 3。"},
    {"id":"ch06-k5","ch":"ch06","kp":"ch06-12","tier":1,"type":"fill","difficulty":1,"tags":["concept"],"stem":"教材主张：每个库都应该自带一个 ____ 方法，用几组输入验证输出是否与预期一致（即单元测试）。","answer":"main","explain":"库的代码以后会被别人反复调用，最便宜的测试办法就是在同一个文件里写 <code>public static void main</code>，塞几组已知答案的输入。这样不用另建测试工程，命令行直接 <code>java StdRandom</code> 就能自测。"},
    {"id":"ch07-k5","ch":"ch07","kp":"ch07-8","tier":2,"type":"mcq","difficulty":2,"tags":["concept","exam"],"stem":"关于 String 的创建方式，下面哪句话正确？","options":[{"text":"字面量 `\"hi\"` 每次都会在堆上新建一个对象"},{"text":"`new String(\"hi\")` 与字面量 `\"hi\"` 引用同一个对象"},{"text":"字面量复用字符串常量池，`new String(\"hi\")` 一定新建对象","correct":true},{"text":"`==` 比较两个 String 时会自动比较内容"}],"explain":"字面量 `\"hi\"` 会进入字符串常量池并被复用；`new String(\"hi\")` 是显式构造，一定在堆上新建对象。所以两者 `==` 为 false、`equals` 为 true。`==` 对引用类型比较的是引用（地址），不是内容。"},
    {"id":"ch07-k6","ch":"ch07","kp":"ch07-8","tier":2,"type":"fill","difficulty":2,"tags":["concept"],"stem":"要让一个字段在构造完成后不能再被修改，应在字段声明前加哪个修饰符？（只填关键字）","answer":"final","explain":"`private final` 组合是写不可变值类型的标准做法：`final` 保证字段只能赋值一次（通常在构造器里），`private` 阻止外部直接访问。注意 `final` 只锁引用/值本身，字段若是数组或对象，内部内容仍可能被改。"},
    {"id":"ch07-k7","ch":"ch07","kp":"ch07-2","tier":2,"type":"predict","difficulty":2,"tags":["output"],"stem":"写出下面程序的输出。","code":"class Box {\n    int v;\n    Box(int v) { this.v = v; }\n    int twice() { return v * 2; }\n}\n\npublic class Q {\n    public static void main(String[] args) {\n        Box a = new Box(3);\n        Box b = a;\n        b.v = 7;\n        System.out.println(a.v + \" \" + a.twice());\n    }\n}","answer":"7 14","explain":"`Box b = a;` 复制的是引用，a 和 b 指向同一个对象。通过 b 改 `v`，a 看到的也是 7；`a.twice()` 自然是 14。这是第 09 章「别名」的前置知识。"},
    {"id":"ch08-k5","ch":"ch08","kp":"ch08-3","tier":2,"type":"mcq","difficulty":3,"tags":["concept","exam"],"stem":"Base 和 Child 都定义了字段 `v`，Child 重写了 `show()`。执行 `Base b = new Child();` 后，`b.v` 和 `b.show()` 分别取哪个？","options":[{"text":"`b.v` 取 Child.v，`b.show()` 调 Child.show"},{"text":"`b.v` 取 Base.v，`b.show()` 调 Child.show","correct":true},{"text":"`b.v` 和 `b.show()` 都取 Base 的版本"},{"text":"`b.v` 和 `b.show()` 都取 Child 的版本"}],"explain":"字段访问看**声明类型**（编译期决定）：`b` 声明为 Base，所以 `b.v` 读的是 Base 里那一份；方法调用看**运行时类型**（动态派发）：对象实际是 Child，所以 `b.show()` 执行 Child 的重写版本。字段不能被重写，方法才能。"},
    {"id":"ch08-k6","ch":"ch08","kp":"ch08-1","tier":2,"type":"fill","difficulty":2,"tags":["concept"],"stem":"子类构造器要显式调用父类的带参构造器，第一行应写什么关键字开头的语句？（只填关键字）","answer":"super","explain":"`super(...)` 必须写在子类构造器的第一条语句，用来把参数交给父类构造器；不写时编译器会自动插入无参的 `super()`。若父类没有无参构造器、子类又没显式调用，就会编译报错。"},
    {"id":"ch08-k7","ch":"ch08","kp":"ch08-5","tier":2,"type":"predict","difficulty":2,"tags":["output"],"stem":"写出下面程序的输出。","code":"abstract class Shape {\n    abstract double area();\n}\n\nclass Sq extends Shape {\n    double s;\n    Sq(double s) { this.s = s; }\n    double area() { return s * s; }\n}\n\npublic class Q {\n    public static void main(String[] args) {\n        Shape x = new Sq(3);\n        System.out.println(x.area());\n    }\n}","answer":"9.0","explain":"`Shape x = new Sq(3);` 是向上转型，声明类型是抽象类 Shape，实际对象是 Sq。调用 `x.area()` 时动态派发到 Sq 的实现，返回 3.0 * 3.0 = 9.0（double 参与运算，所以打印 `9.0` 而不是 `9`）。"},
    {"id":"ch09-k4","ch":"ch09","kp":"ch09-4","tier":2,"type":"mcq","difficulty":2,"tags":["concept","output"],"stem":"执行 `int[] a = {1, 2, 3}; int[] b = a; b[0] = 9;` 之后，`a[0]` 是多少？","options":[{"text":"9","correct":true},{"text":"1"},{"text":"编译错误，数组不能赋值给另一个数组变量"},{"text":"0，因为 b 改了会新建数组"}],"explain":"数组是对象，`int[] b = a;` 只复制引用，a 和 b 指向同一个数组对象。通过 b 改元素，a 看到的也变。这就是别名（aliasing）：两个名字，一块内存。"},
    {"id":"ch09-k5","ch":"ch09","kp":"ch09-3","tier":2,"type":"fill","difficulty":2,"tags":["concept","exam"],"stem":"比较两个 String 的**内容**是否相同，应调用哪个方法？（只填方法名）","answer":"equals","explain":"`==` 对引用类型比较的是引用（是否指向同一对象），`equals` 才比较内容。教材里 `new String(\"hi\") == \"hi\"` 为 false、`equals` 为 true，就是这条规则的经典例子。"},
    {"id":"ch09-k6","ch":"ch09","kp":"ch09-2","tier":2,"type":"predict","difficulty":3,"tags":["output"],"stem":"写出下面程序的输出。","code":"class Node {\n    int v;\n    Node next;\n    Node(int v, Node n) { this.v = v; next = n; }\n}\n\npublic class Q {\n    public static void main(String[] args) {\n        Node p = new Node(1, null);\n        Node q = new Node(2, p);\n        p.next = q;\n        System.out.println(p.next.v + \" \" + q.next.v);\n    }\n}","answer":"2 1","explain":"p 的值是 1、next 先为 null；q 的值是 2、next 指向 p。再执行 `p.next = q`，p 和 q 互相指向（一个环）。所以 `p.next.v` 是 q 的值 2，`q.next.v` 是 p 的值 1。引用可以互相指，画箭头图最清楚。"},
    {"id":"ch10-k5","ch":"ch10","kp":"ch10-4","tier":2,"type":"mcq","difficulty":2,"tags":["concept","exam"],"stem":"`HashMap` 的 `get(key)` 在键不存在时返回什么？","options":[{"text":"0"},{"text":"null","correct":true},{"text":"抛出 `NoSuchElementException`"},{"text":"-1"}],"explain":"Map 的约定是「未命中返回 null」。这也是教材强调 `containsKey` 与 `get` 的区别：键存在但值恰好是 null 时，`get` 也返回 null，所以判断「有没有这个键」要用 `containsKey`，不能只看 `get` 是否为 null。"},
    {"id":"ch10-k6","ch":"ch10","kp":"ch10-7","tier":2,"type":"fill","difficulty":3,"tags":["concept","exam"],"stem":"用增强 for 循环遍历 `ArrayList` 的过程中调用 `list.remove(...)`，会抛出哪个运行时异常？（填异常类名）","answer":"ConcurrentModificationException","accept":["java.util.ConcurrentModificationException"],"explain":"增强 for 底层用迭代器遍历。直接调 `list.remove` 修改了集合结构，迭代器的「修改计数」对不上，下一次 `next()` 就抛 `ConcurrentModificationException`。正确做法是用 `Iterator` 的 `remove()`，或先收集要删的元素、循环结束后再统一删。"},
    {"id":"ch10-k7","ch":"ch10","kp":"ch10-1","tier":2,"type":"predict","difficulty":3,"tags":["output"],"stem":"写出下面程序的输出。","code":"class ST {\n    String[] k = new String[10];\n    int[] v = new int[10];\n    int n = 0;\n    void put(String key, int val) {\n        for (int i = 0; i < n; i++) if (k[i].equals(key)) { v[i] = val; return; }\n        k[n] = key; v[n] = val; n++;\n    }\n    int get(String key) {\n        for (int i = 0; i < n; i++) if (k[i].equals(key)) return v[i];\n        return -1;\n    }\n}\n\npublic class Q {\n    public static void main(String[] args) {\n        ST st = new ST();\n        st.put(\"a\", 1); st.put(\"b\", 2); st.put(\"a\", 3);\n        System.out.println(st.get(\"a\") + \" \" + st.get(\"c\") + \" \" + st.n);\n    }\n}","answer":"3 -1 2","explain":"第二次 `put(\"a\", 3)` 命中已有键，覆盖旧值而不增加元素个数，所以 `get(\"a\")` 是 3、n 仍是 2；`get(\"c\")` 未命中返回 -1。这正是符号表「键唯一、put 覆盖」的语义。"},
    {"id":"ch11-k7","ch":"ch11","kp":"ch11-7","tier":2,"type":"mcq","difficulty":2,"tags":["concept","exam"],"stem":"二分查找能正确工作的前提是什么？","options":[{"text":"数组已经按查找键排好序","correct":true},{"text":"数组长度必须是偶数"},{"text":"所有元素都是正数"},{"text":"数组里不能有重复元素"}],"explain":"二分查找每一步都靠「mid 左边全小、右边全大」排除一半候选，所以数组必须有序。元素是负数、有重复值都不影响；但顺序错了，排除的方向就是错的，结果不可靠。"},
    {"id":"ch11-k8","ch":"ch11","kp":"ch11-3","tier":2,"type":"fill","difficulty":2,"tags":["concept","exam"],"stem":"插入排序在最坏情况下的时间复杂度是多少？（写成 `O(...)` 形式）","answer":"O(n²)","accept":["O(n^2)","n²","n^2"],"explain":"最坏情况是逆序数组：第 i 个元素要一路比较、右移 i 次，总比较次数 1 + 2 + … + (n-1) = n(n-1)/2，化简后是 O(n²)。最好情况是已经有序，每次只比较一次，退化成 O(n)。"},
    {"id":"ch11-k9","ch":"ch11","kp":"ch11-7","tier":2,"type":"predict","difficulty":2,"tags":["output"],"stem":"写出下面程序打印的数字。","code":"public class Q {\n    static int search(int[] a, int key) {\n        int lo = 0, hi = a.length;\n        while (lo < hi) {\n            int mid = lo + (hi - lo) / 2;\n            if (a[mid] < key) lo = mid + 1;\n            else if (a[mid] > key) hi = mid;\n            else return mid;\n        }\n        return -1;\n    }\n    public static void main(String[] args) {\n        int[] a = {1, 3, 5, 7, 9};\n        System.out.println(search(a, 7));\n    }\n}","answer":"3","explain":"数组已有序，7 在下标 3（从 0 数起：1、3、5、7）。二分过程：lo=0、hi=5 → mid=2 是 5 < 7，lo=3；mid=4 是 9 > 7，hi=4；mid=3 命中，返回 3。"},
    {"id":"ch12-k3","ch":"ch12","kp":"ch12-1","tier":2,"type":"mcq","difficulty":2,"tags":["concept","exam"],"stem":"下面哪一项**不属于**递归三要素？","options":[{"text":"基线条件：什么时候直接返回"},{"text":"递推关系：把问题缩小后调用自身"},{"text":"每次递归都朝基线收敛"},{"text":"一个显式的循环变量","correct":true}],"explain":"递归三要素是基线、递推、朝基线收敛；循环变量是迭代写法的概念，递归不需要它（递归用参数表示「当前规模」）。缺少任何一条，递归要么算错，要么栈溢出。"},
    {"id":"ch12-k4","ch":"ch12","kp":"ch12-6","tier":2,"type":"fill","difficulty":2,"tags":["concept","exam"],"stem":"汉诺塔移动次数满足 `T(n) = 2T(n-1) + 1`、`T(0) = 0`，则 `T(3)` 等于多少？（填数字）","answer":"7","explain":"T(1) = 2×0 + 1 = 1，T(2) = 2×1 + 1 = 3，T(3) = 2×3 + 1 = 7。通项是 2ⁿ - 1，所以 n 层要 2ⁿ - 1 步——增长阶是指数级，这也是汉诺塔不能靠加层数硬算的原因。"},
    {"id":"ch12-k5","ch":"ch12","kp":"ch12-3","tier":2,"type":"predict","difficulty":2,"tags":["output"],"stem":"写出下面程序的输出。","code":"public class Q {\n    static int gcd(int p, int q) {\n        if (q == 0) return p;\n        return gcd(q, p % q);\n    }\n    static int hanoi(int n) {\n        if (n == 0) return 0;\n        return 2 * hanoi(n - 1) + 1;\n    }\n    public static void main(String[] args) {\n        System.out.println(gcd(48, 18) + \" \" + hanoi(3));\n    }\n}","answer":"6 7","explain":"gcd(48, 18) → gcd(18, 12) → gcd(12, 6) → gcd(6, 0) = 6。hanoi(3) = 2×hanoi(2) + 1 = 2×3 + 1 = 7。两个递归都满足「基线 + 递推 + 朝基线收敛」。"},
    {"id":"ch13-k3","ch":"ch13","kp":"ch13-4","tier":2,"type":"mcq","difficulty":2,"tags":["concept","exam"],"stem":"三层嵌套循环，每层都从 0 到 n-1，循环体只做常数次操作，总操作数的增长阶是？","options":[{"text":"O(n³)","correct":true},{"text":"O(n²)"},{"text":"O(n log n)"},{"text":"O(2ⁿ)"}],"explain":"每层循环 n 次、三层嵌套就是 n × n × n = n³ 次，循环体是常数代价，所以总代价 O(n³)。这就是 3-sum 三重循环的复杂度；用倍增法验证时，规模翻倍耗时约乘 8，与 n³ 一致。"},
    {"id":"ch13-k4","ch":"ch13","kp":"ch13-5","tier":2,"type":"fill","difficulty":2,"tags":["concept","exam"],"stem":"某算法在数据规模翻倍时，耗时大约变为原来的 4 倍。它的增长阶最可能是多少？（写成 `O(...)` 形式）","answer":"O(n²)","accept":["O(n^2)","n²","n^2"],"explain":"倍增法：规模 ×2，平方算法耗时 ×4，线性 ×2，立方 ×8，n log n 约 ×2.2。比值稳定在 4 附近就指向 O(n²)。注意这是「最可能」，常数项和低阶项会让小规模数据略有偏差。"},
    {"id":"ch13-k5","ch":"ch13","kp":"ch13-4","tier":2,"type":"predict","difficulty":3,"tags":["output"],"stem":"写出下面程序打印的数字。","code":"public class Q {\n    static int count(int[] a) {\n        int n = a.length, count = 0;\n        for (int i = 0; i < n; i++)\n            for (int j = i + 1; j < n; j++)\n                for (int k = j + 1; k < n; k++)\n                    if (a[i] + a[j] + a[k] == 0) count++;\n        return count;\n    }\n    public static void main(String[] args) {\n        int[] a = {-1, 0, 1, 2, -2};\n        System.out.println(count(a));\n    }\n}","answer":"2","explain":"枚举所有 i < j < k 的三元组，和为 0 的有两组：-1 + 0 + 1 = 0、0 + 2 + (-2) = 0。三重循环一共检查 C(5,3) = 10 组，增长阶 O(n³)——这正是教材用倍增法测出斜率 3 的那段程序。"},
    {"id":"ch14-q1","ch":"ch14","kp":"ch14-2","tier":1,"type":"mcq","difficulty":1,"tags":["concept","probability"],"stem":"随机冲浪者模型中，网页 <code>i</code> 有 <code>out</code> 条链接，其中指向网页 <code>j</code> 的有 <code>c</code> 条，全站共 <code>n</code> 个网页。一步从 <code>i</code> 转到 <code>j</code> 的概率是？","options":[{"text":"<code>0.9 × c / out + 0.1 / n</code>","correct":true},{"text":"<code>0.9 × c / out</code>"},{"text":"<code>c / out</code>"},{"text":"<code>0.1 / n</code>"}],"explain":"90% 的时间从当前页的链接里等概率选一条，贡献 0.9·c/out；剩下 10% 的时间在全部 n 个网页里等概率跳，贡献 0.1/n。两者相加才是完整的转移概率。"},
    {"id":"ch14-q2","ch":"ch14","kp":"ch14-3","tier":1,"type":"mcq","difficulty":1,"tags":["concept","matrix"],"stem":"在 <code>tinyG</code> 的转移矩阵中，<code>p[3][0] = 0.92</code>。下列解释哪一条是正确的？","options":[{"text":"网页 3 只有一条出链、指向网页 0，所以 0.9 的链接概率全部给它，再加 0.02 的随机跳转底噪","correct":true},{"text":"网页 3 有 92 条链接指向网页 0"},{"text":"网页 0 有 92% 的概率链接回网页 3"},{"text":"网页 3 的排名是 0.92，所以它是第一名"}],"explain":"p[i][j] 是「从 i 一步到 j」的概率。网页 3 的出度为 1 且指向 0，于是 0.9×1/1 = 0.9，再加 0.1/5 = 0.02，得到 0.92。"},
    {"id":"ch14-q3","ch":"ch14","kp":"ch14-5","tier":2,"type":"mcq","difficulty":2,"tags":["concept","markov"],"stem":"教材把「不管从哪个网页出发，走足够多步后分布都几乎一样」称为混合（mixing）。它对 PageRank 的意义是？","options":[{"text":"长期停留比例只由网页图和 90–10 规则决定，与起始页无关，所以排名是网页图本身的性质","correct":true},{"text":"说明随机冲浪者的起点必须选首页，否则排名不准"},{"text":"说明网页越多，排名越不稳定"},{"text":"说明模拟必须在 100 步内结束，否则结果会变"}],"explain":"混合意味着极限分布唯一，起始状态只影响前若干步。这正是 PageRank 可以作为「网页重要性」定义的前提。"},
    {"id":"ch14-q4","ch":"ch14","kp":"ch14-6","tier":1,"type":"fill","difficulty":1,"tags":["concept"],"stem":"幂法每一轮迭代所做的核心运算是：把当前的排名向量与转移矩阵做一次 ____。","answer":"矩阵乘向量","accept":["矩阵×向量","矩阵和向量相乘","矩阵与向量相乘","matrix-vector multiplication","矩阵-向量乘法"],"explain":"ranks 是长度 n 的向量，p 是 n×n 矩阵；next[j] = Σ ranks[i]·p[i][j]，正是矩阵乘向量，一轮 O(n²)。"},
    {"id":"ch14-q5","ch":"ch14","kp":"ch14-7","tier":2,"type":"tf","difficulty":1,"tags":["concept","tradeoff"],"stem":"随机模拟和幂法计算的是同一个长期停留比例，只是前者带抽样噪声、后者确定但需要矩阵迭代。","options":[{"text":"正确","correct":true},{"text":"错误"}],"explain":"两者都逼近马尔可夫链的极限分布；模拟用大量随机步数估计，幂法用矩阵迭代直接逼近，精度与代价不同。"},
    {"id":"ch14-q6","ch":"ch14","kp":"ch14-4","tier":1,"type":"fill","difficulty":1,"tags":["output","algorithm"],"stem":"轮盘赌选择中，按列从左到右累加转移概率，第一次使累加和大于随机数 <code>r</code> 的那一列就是下一页。这样做的依据是：累加和恰好落在每一列对应的概率区间里，而全部概率之和为 ____。","answer":"1","accept":["1.0","一"],"explain":"每行概率之和等于 1，所以累加和从 0 单调升到 1，随机数 r∈[0,1) 必然落在某个区间内，对应唯一一列。"},
    {"id":"ch14-q7","ch":"ch14","kp":"ch14-4","tier":2,"type":"predict","difficulty":1,"tags":["output"],"stem":"下面程序按轮盘赌规则选择下一页。它的输出是什么？","code":"public class Q {\n    public static void main(String[] args) {\n        double[] row = {0.1, 0.2, 0.3, 0.4};\n        double r = 0.35;\n        double sum = 0.0;\n        int page = -1;\n        for (int j = 0; j < row.length; j++) {\n            sum += row[j];\n            if (r < sum) { page = j; break; }\n        }\n        System.out.println(page);\n    }\n}","answer":"2","explain":"累加和依次为 0.1、0.3、0.6、1.0；r = 0.35 在 j=2 时第一次满足 0.35 < 0.6，所以选中第 2 列（下标 2）。"},
    {"id":"ch14-q8","ch":"ch14","kp":"ch14-8","tier":2,"type":"mcq","difficulty":2,"tags":["concept","debug"],"stem":"构建转移矩阵时，某个网页的出度 <code>out[i]</code> 为 0（没有任何出链）。正确做法是？","options":[{"text":"跳过「90% 点链接」那一项，该行每个元素都取 <code>0.1/n</code>","correct":true},{"text":"直接除以 <code>out[i]</code>，让程序抛出除零异常以便发现问题"},{"text":"把该行全部置 0，表示永远离不开这个网页"},{"text":"把 <code>out[i]</code> 强行改成 1，再把 0.9 给第一个网页"}],"explain":"出度为 0 时没有链接可选，只能走 10% 的随机跳转，因此该行每个格子都是 0.1/n（行和仍为 1）。若置 0，行和就不是 1，概率模型被破坏。"},
    {"id":"ch14-q9","ch":"ch14","kp":"ch14-3","tier":2,"type":"predict","difficulty":2,"tags":["output","matrix"],"stem":"程序用 0.9/0.1 规则计算两个网页之间的转移概率。输出是什么？","code":"public class Q {\n    public static void main(String[] args) {\n        int n = 2;\n        int[][] counts = {{0, 1}, {1, 0}};\n        int[] out = {1, 1};\n        double p = 0.1 / n;\n        p += 0.9 * counts[0][1] / out[0];\n        System.out.printf(\"%.2f%n\", p);\n    }\n}","answer":"0.95","explain":"n=2，底噪 0.1/2 = 0.05；网页 0 唯一出链指向 1，贡献 0.9×1/1 = 0.9；合计 0.95。"},
    {"id":"ch15-q1","ch":"ch15","kp":"ch15-1","tier":1,"type":"mcq","difficulty":1,"tags":["concept"],"stem":"在渗流模型中，说一个 n×n 系统 <b>percolates</b>（渗流成功），准确的含义是？","options":[{"text":"底行至少存在一个与顶行通过上下左右相邻的开放格连通的 full 格","correct":true},{"text":"网格中开放格的数量超过一半"},{"text":"第一行至少有一个开放格"},{"text":"每一行都至少有一个开放格"}],"explain":"水从顶行进入，只能沿上下左右相邻的开放格流动；底行出现 full 格才说明有一条从上到下的连通路径。开放格多不一定连通。"},
    {"id":"ch15-q2","ch":"ch15","kp":"ch15-3","tier":1,"type":"mcq","difficulty":1,"tags":["concept","algorithm"],"stem":"垂直渗流只允许水向下流。它相对于完整渗流（上下左右四向连通）的结果会怎样？","options":[{"text":"系统性低估渗流概率，因为水不能从侧面绕过障碍","correct":true},{"text":"系统性高估，因为垂直路径更容易连到底部"},{"text":"两者结果完全相同，只是实现方式不同"},{"text":"无法比较，取决于网格大小"}],"explain":"垂直版本要求同一列一路开放（概率约 pⁿ），忽略了水可以左右绕行；因此它算出的 full 格更少，渗流概率更低，只能作为「更容易的替代问题」。"},
    {"id":"ch15-q3","ch":"ch15","kp":"ch15-5","tier":1,"type":"mcq","difficulty":1,"tags":["concept","recursion"],"stem":"递归 DFS 的 <code>flow(i, j)</code> 在什么情况下应该立即返回（不继续扩散）？","options":[{"text":"下标越界、该格 blocked、该格已经是 full，三种情况任意一种就返回","correct":true},{"text":"只有该格是 blocked 时返回"},{"text":"只有下标越界时返回"},{"text":"只有该格是 open 时返回"}],"explain":"三个早退条件缺一不可：越界会数组异常，blocked 不能通行，已 full 再访问会重复计算甚至无限递归。"},
    {"id":"ch15-q4","ch":"ch15","kp":"ch15-6","tier":1,"type":"mcq","difficulty":1,"tags":["concept","montecarlo"],"stem":"教材用自适应绘图得到：p 小于阈值时几乎不渗流，p 大于阈值时几乎必渗流。下列说法正确的是？","options":[{"text":"阈值约 0.593；n 越大，曲线越陡，越接近一级台阶","correct":true},{"text":"阈值是 0.9，因为 90% 的时间随机跳转"},{"text":"n 越大，阈值越接近 0.5，曲线越平缓"},{"text":"阈值与 n 无关，且小网格的曲线比大网格更陡"}],"explain":"正方形格点的渗流阈值约 0.593。n 增大时有限尺寸效应减弱，曲线从平缓的 S 形趋向阶跃——这就是相变。"},
    {"id":"ch15-q5","ch":"ch15","kp":"ch15-4","tier":1,"type":"tf","difficulty":1,"tags":["concept","montecarlo"],"stem":"蒙特卡洛估计中，trials 增大时误差会减小，但计算代价线性增长。","options":[{"text":"正确","correct":true},{"text":"错误"}],"explain":"估计的波动大约按 1/√trials 缩小，而计算量按 trials 线性增长；所以样本量不是越大越好，够用即可。"},
    {"id":"ch15-q6","ch":"ch15","kp":"ch15-1","tier":1,"type":"fill","difficulty":1,"tags":["concept"],"stem":"渗流模型中，与顶行通过上下左右开放格连通的格子称为 ____ 格；底行出现它，系统才渗流。","answer":"full","accept":["full 格","full格","满格"],"explain":"full 表示「已经接到水」；它是相对顶行连通性而言的，与格子自身是否 open 不是一回事。"},
    {"id":"ch15-q7","ch":"ch15","kp":"ch15-2","tier":2,"type":"fill","difficulty":1,"tags":["concept"],"stem":"垂直渗流的简化在于只允许水向 ____ 流，不允许左右或向上，因此可以用两个嵌套循环逐行递推。","answer":"下","accept":["下方","向下"],"explain":"只允许向下时，第 i 行的 full 只依赖第 i−1 行：isFull[i][j] = isOpen[i][j] && isFull[i-1][j]。"},
    {"id":"ch15-q8","ch":"ch15","kp":"ch15-3","tier":2,"type":"predict","difficulty":1,"tags":["output"],"stem":"下面程序计算 3×3 网格垂直渗流后 full 格的总数。输出是什么？","code":"public class Q {\n    public static void main(String[] args) {\n        int n = 3;\n        int[][] open = {{1, 0, 0}, {1, 0, 0}, {1, 0, 1}};\n        int[][] full = new int[n][n];\n        for (int j = 0; j < n; j++) full[0][j] = open[0][j];\n        for (int i = 1; i < n; i++) {\n            for (int j = 0; j < n; j++) {\n                if (open[i][j] == 1 && full[i - 1][j] == 1) full[i][j] = 1;\n            }\n        }\n        int count = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < n; j++) count += full[i][j];\n        }\n        System.out.println(count);\n    }\n}","answer":"3","explain":"第 0 行只有第 0 列 open，所以 full[0][0]=1；往下同一列一路开放，full[1][0]、full[2][0] 也为 1。第 2 行第 2 列虽然 open，但上方第 1 行第 2 列 blocked，垂直版本接不到水。共 3 个。"},
    {"id":"ch15-q9","ch":"ch15","kp":"ch15-5","tier":2,"type":"predict","difficulty":2,"tags":["output","recursion"],"stem":"下面程序用递归 DFS 计算 3×3 网格的 full 格总数。输出是什么？","code":"public class Q {\n    static int n = 3;\n    static int[][] open = {{1, 0, 0}, {1, 1, 0}, {0, 1, 1}};\n    static int[][] full = new int[n][n];\n\n    static void flow(int i, int j) {\n        if (i < 0 || i >= n) return;\n        if (j < 0 || j >= n) return;\n        if (open[i][j] == 0) return;\n        if (full[i][j] == 1) return;\n        full[i][j] = 1;\n        flow(i + 1, j);\n        flow(i, j + 1);\n        flow(i, j - 1);\n        flow(i - 1, j);\n    }\n\n    public static void main(String[] args) {\n        for (int j = 0; j < n; j++) flow(0, j);\n        int count = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < n; j++) count += full[i][j];\n        }\n        System.out.println(count);\n    }\n}","answer":"5","explain":"从顶行 (0,0) 进入：(0,0) → (1,0) → (1,1) → (2,1) → (2,2)，共 5 个格被标记；其余 open 格没有被连到顶行的路径。"},
    {"id":"ch16-q1","ch":"ch16","kp":"ch16-1","tier":1,"type":"mcq","difficulty":1,"tags":["concept","physics"],"stem":"两个质量分别为 <code>m₁</code>、<code>m₂</code>、相距 <code>r</code> 的天体，万有引力的大小是？","options":[{"text":"<code>G · m₁ · m₂ / r²</code>","correct":true},{"text":"<code>G · m₁ · m₂ / r</code>"},{"text":"<code>G · (m₁ + m₂) / r²</code>"},{"text":"<code>G · m₁ · m₂ · r²</code>"}],"explain":"牛顿万有引力定律：力与两质量乘积成正比、与距离的平方成反比，G = 6.67×10⁻¹¹。少一个平方或写成距离成正比都是常见错误。"},
    {"id":"ch16-q2","ch":"ch16","kp":"ch16-3","tier":1,"type":"mcq","difficulty":1,"tags":["concept","vector"],"stem":"<code>Body.forceFrom(b)</code> 里先用 <code>delta = b.r.minus(r)</code> 求位移，再取单位方向、乘上引力大小。这样得到的力方向是？","options":[{"text":"从当前天体指向 <code>b</code>，即吸引力","correct":true},{"text":"从 <code>b</code> 指向当前天体，即排斥力"},{"text":"垂直于两天体连线"},{"text":"方向取决于两者质量谁大"}],"explain":"b.r − r 是从自己指向对方的位移，所以力的方向沿连线指向对方；如果写成 r − b.r，就会变成排斥力，轨道会迅速飞散。"},
    {"id":"ch16-q3","ch":"ch16","kp":"ch16-4","tier":1,"type":"mcq","difficulty":2,"tags":["concept","integration"],"stem":"教材 <code>Body.move(force, dt)</code> 先更新速度、再用<b>新速度</b>更新位置。这样做的直接效果是？","options":[{"text":"相当于半隐式欧拉法，在轨道模拟中通常比「先动位置再更新速度」更稳定","correct":true},{"text":"把误差完全消除，得到精确轨道"},{"text":"让引力大小随位置变化，计算更准确"},{"text":"没有任何区别，两种写法的结果永远一样"}],"explain":"先用新速度走位置属于半隐式欧拉（symplectic Euler 的常见形式），比显式欧拉更不容易持续注入能量；但两种顺序结果会随时间分开，代码中不能混用。"},
    {"id":"ch16-q4","ch":"ch16","kp":"ch16-5","tier":1,"type":"mcq","difficulty":1,"tags":["concept","complexity"],"stem":"n 个天体、每步用双重循环两两求力，每步大约要做多少次力计算？","options":[{"text":"<code>n(n−1)</code> 次，即 O(n²)","correct":true},{"text":"<code>n</code> 次，即 O(n)"},{"text":"<code>n²/2</code> 次，即 O(n²/2)，与 O(n²) 不同阶"},{"text":"<code>2n</code> 次，即 O(n)"}],"explain":"每个天体 i 要对其它 n−1 个天体各算一次力，共 n(n−1) 次；n=1000 时约 10⁶ 次，每走一步都要付这个代价。"},
    {"id":"ch16-q5","ch":"ch16","kp":"ch16-7","tier":2,"type":"tf","difficulty":1,"tags":["concept","chaos"],"stem":"三体及以上的引力系统一般没有初等函数解，而且对初始条件敏感，所以只能用数值方法逐步模拟。","options":[{"text":"正确","correct":true},{"text":"错误"}],"explain":"二体问题有解析解（椭圆轨道）；三体起一般无初等函数解，且常呈混沌。数值模拟是研究这类系统的标准方法，但要注意误差累积。"},
    {"id":"ch16-q6","ch":"ch16","kp":"ch16-2","tier":1,"type":"fill","difficulty":1,"tags":["concept"],"stem":"为了让 <code>Body</code> 里的位置、速度、力都能用加、减、数乘、取长度来运算，教材把它们封装成 ____ 对象。","answer":"向量","accept":["Vector","vector","向量类"],"explain":"用向量类型代替散落的 double 变量，公式可以写成 v.plus(a.scale(dt)) 这样接近数学表达式的形式，减少 x/y 弄混的错误。"},
    {"id":"ch16-q7","ch":"ch16","kp":"ch16-7","tier":2,"type":"fill","difficulty":2,"tags":["concept","debug"],"stem":"没有外力时，数值模拟的____应当守恒；如果它单调上升或下降，通常说明步长太大或积分方法不稳定。","answer":"总能量","accept":["能量","机械能","总机械能"],"explain":"动能加引力势能在物理上守恒，是检验数值积分质量最实用的指标；能量漂移比轨道偏差更早暴露问题。"},
    {"id":"ch16-q8","ch":"ch16","kp":"ch16-2","tier":2,"type":"predict","difficulty":1,"tags":["output"],"stem":"下面程序用向量类求两点之间的位移长度。输出是什么？","code":"class Vec2 {\n    double x, y;\n    Vec2(double x0, double y0) { x = x0; y = y0; }\n    Vec2 minus(Vec2 o) { return new Vec2(x - o.x, y - o.y); }\n    double length() { return Math.sqrt(x * x + y * y); }\n}\n\npublic class Q {\n    public static void main(String[] args) {\n        Vec2 p = new Vec2(1.0, 2.0);\n        Vec2 q = new Vec2(4.0, 6.0);\n        System.out.println((int) q.minus(p).length());\n    }\n}","answer":"5","explain":"q − p = (3, 4)，长度 √(3² + 4²) = 5；这是 3-4-5 直角三角形，适合手算核对。"},
    {"id":"ch16-q9","ch":"ch16","kp":"ch16-3","tier":2,"type":"predict","difficulty":2,"tags":["output","physics"],"stem":"两个质量均为 2.0×10³⁰ kg 的天体相距 2.0×10¹⁰ m。下面程序按万有引力公式输出引力大小，结果是什么？","code":"public class Q {\n    public static void main(String[] args) {\n        double G = 6.67e-11;\n        double m = 2.0e30;\n        double d = 2.0e10;\n        double f = G * m * m / (d * d);\n        System.out.printf(\"%.2e%n\", f);\n    }\n}","answer":"6.67e+29","explain":"m² = 4.0×10⁶⁰，d² = 4.0×10²⁰，商为 1.0×10⁴⁰；乘 G = 6.67×10⁻¹¹，得 6.67×10²⁹，即 6.67e+29。"},
    {"id":"ch17-q1","ch":"ch17","kp":"ch17-1","tier":1,"type":"mcq","difficulty":1,"tags":["concept","lifo"],"stem":"浏览器「后退」按钮按访问顺序倒着退回页面：最近访问的最先退回。这种顺序最适合用哪种数据结构实现？","options":[{"text":"栈：后进先出","correct":true},{"text":"队列：先进先出"},{"text":"数组：按他的下标随机访问"},{"text":"二叉查找树：按键有序"}],"explain":"后退需要「最近的先回」，正好是 LIFO。栈在同一端进出，push 入栈、pop 弹栈，于是最近访问的页面最后入栈、最先弹出。用队列会得到「先进先出」，那会变成最早访问的页面最先退回，与浏览器行为相反。"},
    {"id":"ch17-q2","ch":"ch17","kp":"ch17-2","tier":1,"type":"mcq","difficulty":1,"tags":["concept","stack"],"stem":"一个用数组实现的栈，初始为空。依次执行 <code>push(1)</code>、<code>push(2)</code>、<code>push(3)</code>，再连续执行两次 <code>pop()</code>。第二次 pop 返回的值是？","options":[{"text":"3"},{"text":"2","correct":true},{"text":"1"},{"text":"抛出异常，因为栈已空"}],"explain":"后进先出：push 顺序是 1、2、3，第一次 pop 弹出 3，第二次 pop 弹出 2，此时栈里只剩 1。注意 pop 是「先让 n 减一、再读 a[n]」，所以第二次读的是下标 1 的位置，值为 2。"},
    {"id":"ch17-q3","ch":"ch17","kp":"ch17-5","tier":2,"type":"predict","difficulty":2,"tags":["output","stack"],"stem":"下面的程序用栈检查括号是否配对。写出它的输出。","code":"public class Q {\n    static boolean check(String s) {\n        char[] st = new char[10];\n        int n = 0;\n        for (int i = 0; i < s.length(); i++) {\n            char c = s.charAt(i);\n            if (c == '(' || c == '[' || c == '{') {\n                st[n] = c;\n                n++;\n            } else {\n                if (n == 0) return false;\n                n--;\n                char open = st[n];\n                if (c == ')' && open != '(') return false;\n                if (c == ']' && open != '[') return false;\n                if (c == '}' && open != '{') return false;\n            }\n        }\n        return n == 0;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(\"([{}]) -> \" + check(\"([{}])\"));\n        System.out.println(\"([)] -> \" + check(\"([)]\"));\n    }\n}","answer":"([{}]) -> true\n([)] -> false","explain":"第一个串完全配对：左括号依次入栈，右括号依次弹出比对，最后栈空。第二个串在读到 ']' 时，栈顶弹出的是 '('，与 ']' 不匹配，函数中途返回 false。注意两类错误：这类「弹出不匹配」与「扫完栈非空」分别对应右括号错位和左括号多余。"},
    {"id":"ch17-q4","ch":"ch17","kp":"ch17-4","tier":2,"type":"mcq","difficulty":2,"tags":["concept","queue"],"stem":"在环形数组实现的队列中，<code>head == tail</code> 时，能否据此判断队列是空还是满？","options":[{"text":"能：相等就是空"},{"text":"能：相等就是满"},{"text":"不能：空和满都可能使 head == tail，必须另用计数器 n 判断","correct":true},{"text":"不能：环形数组队列无法判断空满，只能抛异常"}],"explain":"容量为 cap 的环里，head 与 tail 都取模回绕，走到同一个下标既可能是「刚全部出队（空）」也可能是「刚好转满一圈（满）」。区分方法是维护计数器 n：n == 0 为空，n == cap 为满。另一种做法是故意留一个空位（最多存 cap-1 个），也能用下标区分。"},
    {"id":"ch17-q5","ch":"ch17","kp":"ch17-3","tier":1,"type":"tf","difficulty":1,"tags":["concept","linkedlist"],"stem":"链表实现的栈在 <code>push</code> 时要把新节点插到链表尾部，因此 push 的代价是 O(n)。","answer":false,"explain":"链表栈把「栈顶」放在链表的头节点：push 只需在头部插入（保存旧 first、新建节点、指向旧 first），pop 只需删除头节点，都是 O(1)。插到尾部才需要遍历，那正好是应该避免的写法。"},
    {"id":"ch17-q6","ch":"ch17","kp":"ch17-4","tier":2,"type":"fill","difficulty":2,"tags":["calc","queue"],"stem":"一个容量为 4 的环形数组队列中，<code>tail = 3</code>。执行一次 <code>enqueue</code> 后，<code>tail</code> 的新值是 ____（填一个整数）。","answer":"0","accept":["0 "],"explain":"入队后 tail = (tail + 1) % cap = (3 + 1) % 4 = 0。取模让下标在到达数组末尾后回到 0，从而复用前面被出队空出来的位置，这就是「环」的含义。"},
    {"id":"ch17-q7","ch":"ch17","kp":"ch17-6","tier":2,"type":"mcq","difficulty":2,"tags":["concept","expression"],"stem":"用 Dijkstra 双栈算法求值完全括号化的表达式时，遇到一个右括号 <code>)</code>，正确操作是？","options":[{"text":"把右括号压入运算符栈"},{"text":"弹出一个运算符和两个值，算出结果后压回值栈","correct":true},{"text":"弹出值栈里的全部数字求和"},{"text":"清空运算符栈，从头重新扫描"}],"explain":"右括号意味着「最内层的括号结束了」，此时运算符栈顶一定是最内层那次运算的运算符，值栈顶是它的两个操作数：先弹出的值是右操作数，后弹出的是左操作数（顺序不能反），算出结果压回值栈。左括号不必入栈，直接跳过。"},
    {"id":"ch17-q8","ch":"ch17","kp":"ch17-3","tier":2,"type":"predict","difficulty":2,"tags":["output","linkedlist"],"stem":"下面的程序用链表头插法把三个字符串压入栈，再依次弹出打印。写出它的输出（每行一个）。","code":"class Node {\n    String item;\n    Node next;\n    Node(String item) { this.item = item; }\n}\n\npublic class Q {\n    public static void main(String[] args) {\n        Node first = null;\n        String[] words = {\"a\", \"b\", \"c\"};\n        for (String w : words) {\n            Node old = first;\n            first = new Node(w);\n            first.next = old;\n        }\n        while (first != null) {\n            System.out.println(first.item);\n            first = first.next;\n        }\n    }\n}","answer":"c\nb\na","explain":"每次头插都把新节点放在最前面，所以链表的顺序是 c → b → a；从 first 开始沿 next 打印，就是 c、b、a。这正是栈的后进先出：最后压入的 c 最先被访问。"},
    {"id":"ch17-q9","ch":"ch17","kp":"ch17-7","tier":3,"type":"tf","difficulty":2,"tags":["concept","simulation"],"stem":"在单窗口队列模拟中，平均等待时间只由顾客到达的间隔决定，与每位顾客的服务时长无关。","answer":false,"explain":"等待时间取决于到达速度与服务速度的相对大小：到达间隔平均 1 分钟（每分钟 1 人）、服务时长 2 分钟（每分钟 0.5 人）时，到达快于服务，队伍会持续积压，平均等待越来越长；把服务时长改成 1 分钟，平均等待立刻下降。所以两个因素都决定等待时间。"},
    {"id":"ch17-q10","ch":"ch17","kp":"ch17-8","tier":1,"type":"fill","difficulty":1,"tags":["concept","selection"],"stem":"需要按「先到达先处理」的顺序处理一批消息，应该选择 ____（填「栈」或「队列」）。","answer":"队列","accept":["queue","队列（queue）"],"explain":"先到先处理是 FIFO，对应队列：enqueue 在尾部加入，dequeue 从头部取出。栈是 LIFO（后进先出），适合撤销、后退、括号匹配这类「最近优先」的场景。"},
    {"id":"ch18-q1","ch":"ch18","kp":"ch18-1","tier":1,"type":"mcq","difficulty":1,"tags":["concept"],"stem":"下列哪一项<strong>不</strong>适合用符号表（键值映射）来建模？","options":[{"text":"学号 → 学生成绩"},{"text":"单词 → 释义"},{"text":"一组数按从小到大排列，求第 k 小的数","correct":true},{"text":"URL → 缓存的网页内容"}],"explain":"符号表解决的是「给一个键，找到对应的值」，前提是键本身能唯一标识一条记录。求第 k 小的数是排序/选择问题，没有「键 → 值」的映射关系，应该用排序或选择算法。虽然可以用键值对模拟（值连键一起存），但那不是它的典型用途。"},
    {"id":"ch18-q2","ch":"ch18","kp":"ch18-2","tier":1,"type":"mcq","difficulty":1,"tags":["concept","complexity"],"stem":"无序数组实现的符号表里存了 <code>n</code> 个键，查找一个不存在的键，最坏要比较多少次？","options":[{"text":"1 次"},{"text":"log₂n 次"},{"text":"n 次","correct":true},{"text":"n² 次"}],"explain":"顺序查找从头到尾逐个比较，不存在的键必须把 n 个都看完才能确定「没有」，所以最坏 n 次；平均约 n/2 次。这就是为什么数据量大时顺序查找会明显变慢。"},
    {"id":"ch18-q3","ch":"ch18","kp":"ch18-3","tier":2,"type":"mcq","difficulty":2,"tags":["concept","binarysearch"],"stem":"二分查找能把查找代价降到 O(log n)，但它有一个必须满足的前提。下列哪项是正确的？","options":[{"text":"数组必须按关键字有序","correct":true},{"text":"数组长度必须是 2 的幂"},{"text":"数组里不能有重复元素"},{"text":"必须用递归而不能用循环实现"}],"explain":"二分的前提是「有序」：每次用中间元素与目标比较，靠大小关系排除掉一半。数组无序时二分会给出错误结果（不是慢，是错）。长度、重复、递归或循环都不是前提。"},
    {"id":"ch18-q4","ch":"ch18","kp":"ch18-4","tier":2,"type":"mcq","difficulty":1,"tags":["concept","hash"],"stem":"哈希函数算出的整数再对桶数 <code>m</code> 取模，目的是什么？","options":[{"text":"让哈希值变小，节省内存"},{"text":"把任意整数映射到 0..m-1 的桶下标范围内","correct":true},{"text":"保证不同的键一定得到不同的下标"},{"text":"把键转换成字符串方便比较"}],"explain":"哈希函数可能算出一个很大的整数，而桶只有 m 个，取模把它压到 0..m-1 才合法。注意取模不能消除冲突：键比桶多时必然有多个键落到同一个下标，这正是下一节「分离链接」要处理的问题。"},
    {"id":"ch18-q5","ch":"ch18","kp":"ch18-5","tier":2,"type":"tf","difficulty":2,"tags":["concept","hash"],"stem":"在分离链接的哈希表中，所有落在同一个桶里的键一定相等。","answer":false,"explain":"同一个桶里的键只是「哈希到同一下标」，它们的键值通常完全不同（这正是哈希冲突的定义）。查找时必须在链上逐个比较键才能确认是哪个元素，所以桶里挂的是整条链表而不是相同键的集合。"},
    {"id":"ch18-q6","ch":"ch18","kp":"ch18-5","tier":3,"type":"predict","difficulty":2,"tags":["output","hash"],"stem":"下面的程序把四个字符串按首字母哈希到 3 个桶里，用头插法挂链，然后打印每个桶的内容。写出它的输出。","code":"class Node {\n    String key;\n    Node next;\n    Node(String key) { this.key = key; }\n}\n\npublic class Q {\n    public static void main(String[] args) {\n        String[] words = {\"a\", \"b\", \"c\", \"d\"};\n        Node[] buckets = new Node[3];\n        for (String w : words) {\n            int h = w.charAt(0) % 3;\n            Node n = new Node(w);\n            n.next = buckets[h];\n            buckets[h] = n;\n        }\n        for (int i = 0; i < 3; i++) {\n            System.out.print(\"bucket \" + i + \":\");\n            for (Node x = buckets[i]; x != null; x = x.next) {\n                System.out.print(\" \" + x.key);\n            }\n            System.out.println();\n        }\n    }\n}","answer":"bucket 0: c\nbucket 1: d a\nbucket 2: b","explain":"字符编码按 ASCII：a=97、b=98、c=99、d=100，分别对 3 取模得 1、2、0、1。所以 c 进 0 号桶，a 和 d 都进 1 号桶（这是冲突），b 进 2 号桶。头插法让后进的 d 在链头，因此 1 号桶打印顺序是 d a。这也说明同桶元素的顺序由插入方式决定、并不稳定。"},
    {"id":"ch18-q7","ch":"ch18","kp":"ch18-6","tier":2,"type":"mcq","difficulty":2,"tags":["concept","bst"],"stem":"对一棵二叉查找树做中序遍历（左 → 根 → 右），输出的键序列有什么特点？","options":[{"text":"按插入顺序输出"},{"text":"按关键字的升序输出","correct":true},{"text":"按关键字的降序输出"},{"text":"先输出叶子再输出内部节点"}],"explain":"BST 保证左子树所有键小于根、右子树所有键大于根，所以按「左 → 根 → 右」递归遍历时，总是先输出更小的键，结果是升序。这正是 BST 相比哈希表多出来的能力：不仅能查，还能有序遍历。"},
    {"id":"ch18-q8","ch":"ch18","kp":"ch18-7","tier":2,"type":"fill","difficulty":2,"tags":["complexity"],"stem":"哈希表在哈希函数均匀、桶数足够的前提下，查找的平均时间复杂度是 O(____)（填一个关于 n 的表达式）。","answer":"1","accept":["O(1)","(1)"],"explain":"哈希表用哈希值直接定位桶，平均链长是常数，所以平均查找是 O(1)。注意两个前提：哈希函数均匀、桶数与元素数同量级；若所有键都撞到同一个桶，最坏仍是 O(n)。"},
    {"id":"ch18-q9","ch":"ch18","kp":"ch18-6","tier":2,"type":"tf","difficulty":2,"tags":["concept","bst"],"stem":"把一组已经按升序排好的键依次插入一棵普通二叉查找树，树会退化成链表，查找的最坏代价变成 O(n)。","answer":true,"explain":"升序插入时每个新键都比根大，全部落到右子树，树长成一条向右的单链，高度 n-1，查找要依次数过 n 个节点。所以「BST 查找 O(log n)」是平均结论，最坏是 O(n)；红黑树、AVL 树就是通过旋转把高度压在 O(log n) 来避免这种退化。"},
    {"id":"ch18-q10","ch":"ch18","kp":"ch18-9","tier":2,"type":"fill","difficulty":1,"tags":["concept","selection"],"stem":"如果需求是「存一批键值对，之后要能按字母序输出全部键」，最合适的结构是____（填「哈希表」或「二叉查找树」）。","answer":"二叉查找树","accept":["BST","平衡树"],"explain":"哈希表查找虽快，但遍历顺序由桶下标决定、与键的大小无关，无法有序输出。二叉查找树的中序遍历天然是升序，正好满足「按序输出」这个需求；代价是平均查找 O(log n)，略慢于哈希表的 O(1)。"},
    {"id":"ch19-q1","ch":"ch19","kp":"ch19-1","tier":1,"type":"mcq","difficulty":1,"tags":["concept","graph"],"stem":"一个无向图有 5 个顶点、7 条边，所有顶点的度数之和是多少？","options":[{"text":"7"},{"text":"12"},{"text":"14","correct":true},{"text":"无法确定，取决于边怎么连"}],"explain":"无向图中每条边有两个端点，会给两端的度数各贡献 1，所以所有度数之和 = 2E = 2×7 = 14（握手引理）。这与边怎么连无关，只与边数有关；平均度数则是 2E/V = 14/5 = 2.8。"},
    {"id":"ch19-q2","ch":"ch19","kp":"ch19-2","tier":1,"type":"mcq","difficulty":1,"tags":["concept","graph"],"stem":"用邻接表实现无向图时，<code>addEdge(v, w)</code> 只把 w 加进 v 的邻居表、没有把 v 加进 w 的邻居表。后果是什么？","options":[{"text":"没有影响，查找时自然会对称"},{"text":"图变成「单行道」：v 能到 w，w 却到不了 v","correct":true},{"text":"边数会少算一条"},{"text":"程序会抛出数组越界异常"}],"explain":"邻接表是有方向地记录邻居的。无向图要求 v 与 w 互为邻居，所以加边时必须两边都写。只写一边就变成有向图，从 w 出发的搜索到不了 v，连通性、BFS 距离都会出错。这也是手写图结构最常见的 bug。"},
    {"id":"ch19-q3","ch":"ch19","kp":"ch19-4","tier":3,"type":"predict","difficulty":2,"tags":["output","bfs"],"stem":"下面的程序用 BFS 求 0 号顶点到其他各点的最短距离。写出它的输出。","code":"public class Q {\n    public static void main(String[] args) {\n        int[][] adj = new int[5][5];\n        int[] len = new int[5];\n        adj[0][0] = 1; adj[0][1] = 2; len[0] = 2;\n        adj[1][0] = 0; len[1] = 1;\n        adj[2][0] = 0; adj[2][1] = 3; len[2] = 2;\n        adj[3][0] = 2; adj[3][1] = 4; len[3] = 2;\n        adj[4][0] = 3; len[4] = 1;\n        boolean[] marked = new boolean[5];\n        int[] dist = new int[5];\n        int[] queue = new int[5];\n        for (int i = 0; i < 5; i++) dist[i] = -1;\n        int head = 0;\n        int tail = 0;\n        queue[tail] = 0;\n        tail++;\n        marked[0] = true;\n        dist[0] = 0;\n        while (head < tail) {\n            int v = queue[head];\n            head++;\n            for (int i = 0; i < len[v]; i++) {\n                int w = adj[v][i];\n                if (!marked[w]) {\n                    marked[w] = true;\n                    dist[w] = dist[v] + 1;\n                    queue[tail] = w;\n                    tail++;\n                }\n            }\n        }\n        for (int v = 0; v < 5; v++) {\n            System.out.println(\"dist(\" + v + \") = \" + dist[v]);\n        }\n    }\n}","answer":"dist(0) = 0\ndist(1) = 1\ndist(2) = 1\ndist(3) = 2\ndist(4) = 3","explain":"图是链 0-1、0-2、2-3、3-4。BFS 从 0 出发：距离 1 的是 1 和 2，距离 2 的是 3，距离 3 的是 4。队列保证按距离递增处理，所以第一次给某点赋距离时它就是最短的。若用 DFS 得到的是访问顺序 0 1 2 3 4，但那个顺序不代表距离。"},
    {"id":"ch19-q4","ch":"ch19","kp":"ch19-3","tier":1,"type":"mcq","difficulty":1,"tags":["concept","dfs"],"stem":"关于深度优先搜索（DFS），下列哪项描述是正确的？","options":[{"text":"它保证找到两点间步数最少的路径"},{"text":"它沿一条路一直深入、走不通再回退，代价 O(V+E)","correct":true},{"text":"它必须用队列实现"},{"text":"它的代价是 O(V²)，比 BFS 慢"}],"explain":"DFS 用递归（或显式栈）一路深入，标记已访问后继续走邻居，走不通就回溯，每个顶点访问一次、每条边检查两次，所以是 O(V+E)。它只保证「能到达」，不保证最短路径；需要最短路径时要用 BFS 的队列。"},
    {"id":"ch19-q5","ch":"ch19","kp":"ch19-4","tier":1,"type":"tf","difficulty":1,"tags":["concept","bfs"],"stem":"在 BFS 中，第一次访问到某个顶点时记录的距离，就是起点到它的最短距离。","answer":true,"explain":"BFS 用队列按距离递增的顺序处理顶点：距离 1 的全部处理完才轮到距离 2 的。所以一个点第一次被访问时，一定是从「离起点最近的那一层」发现的，此时的距离必然是最小值。这也是 BFS 能求无权图最短路径的根本原因。"},
    {"id":"ch19-q6","ch":"ch19","kp":"ch19-6","tier":2,"type":"fill","difficulty":2,"tags":["concept","metric"],"stem":"一个顶点的度数为 d，它的邻居之间最多可能有 ____ 对边（填表达式，如 d*(d-1)/2 的形式）。","answer":"d*(d-1)/2","accept":["d(d-1)/2","d * (d - 1) / 2","d*(d-1)/2 "],"explain":"聚类系数衡量「邻居之间互相认识的程度」。d 个邻居两两之间最多有 C(d,2) = d(d-1)/2 条边；实际存在的边数除以这个最大值就是该顶点的聚类系数。d < 2 时无法形成三角形，通常记为 0 或不参与平均。"},
    {"id":"ch19-q7","ch":"ch19","kp":"ch19-6","tier":3,"type":"tf","difficulty":2,"tags":["concept","metric"],"stem":"聚类系数高的网络，平均路径长度一定也短。","answer":false,"explain":"两者没有必然的正向关系。规则网格（每个人都只认识左右邻居）聚类系数可以很高，但平均路径长度会随规模增长而变长；随机图路径极短但聚类系数接近 0。小世界网络之所以特殊，正是因为它同时做到了「高聚类」和「短路径」——靠的是少量随机的长程边。"},
    {"id":"ch19-q8","ch":"ch19","kp":"ch19-8","tier":2,"type":"mcq","difficulty":2,"tags":["concept","selection"],"stem":"要在地铁线路图里找「从 A 站到 B 站最少换乘几次」，每段区间算一步，最合适的算法是？","options":[{"text":"对整张图做一次 DFS，记录访问顺序"},{"text":"从 A 出发做 BFS，第一次到达 B 时的层数就是最少换乘数","correct":true},{"text":"把站点按编号排序后二分查找"},{"text":"对所有站点两两计算度数"}],"explain":"「最少几步到达」是典型的无权图最短路径问题，BFS 按距离逐层扩展，第一次访问 B 时的距离就是最少步数。DFS 只保证能到、不保证最少；排序与度数完全解决不了路径问题。若每段区间还带乘车时间，就该用带权的 Dijkstra 算法。"},
    {"id":"ch19-q9","ch":"ch19","kp":"ch19-7","tier":2,"type":"fill","difficulty":2,"tags":["concept","smallworld"],"stem":"与随机图相比，小世界网络的区别主要是聚类系数更____（填「高」或「低」）。","answer":"高","accept":["高 ","更高"],"explain":"随机图任意两点几乎等概率相连，路径很短但邻居之间几乎不互连，聚类系数接近 0；小世界网络在规则局部连接（高聚类）的基础上加入少量随机长程边，路径也变短了，于是同时具备「聚类高」和「路径短」。真实社交网络、互联网都呈现这种特征。"},
    {"id":"ch19-q10","ch":"ch19","kp":"ch19-5","tier":1,"type":"mcq","difficulty":1,"tags":["concept","smallworld"],"stem":"「Kevin Bacon 六度分隔」的游戏把演员和电影建成什么图？","options":[{"text":"顶点是电影、边是演员"},{"text":"顶点是演员、边是「在同一部电影里合作过」","correct":true},{"text":"顶点是导演、边是票房"},{"text":"顶点是年份、边是电影数量"}],"explain":"把每个演员当顶点，如果两位演员在同一部电影中出现过就连一条边，那么「某演员到 Kevin Bacon 隔几层」就是图上两点的最短距离。用 BFS 一算就能得到每个人的「Bacon 数」；这张图有几十万顶点，平均距离却只有 3 左右，正是小世界的典型例子。"},
    {"id":"ch20-q1","ch":"ch20","kp":"ch20-1","tier":1,"type":"mcq","difficulty":1,"tags":["concept"],"stem":"按本章定义，下面哪一项是<strong>形式语言</strong>？","options":[{"text":"一个有限的符号集合，比如 {a, b}"},{"text":"一些字符串组成的集合，比如所有以 a 开头的二进制串","correct":true},{"text":"一个长度有限的字符串，比如 abba"},{"text":"一台读字符串并给出 Yes/No 的机器"}],"explain":"解析：形式语言是字符串的<strong>集合</strong>，可以有限也可以无限。A 是字母表，C 是单个串，D 是识别语言的机器，都不是语言本身。"},
    {"id":"ch20-q2","ch":"ch20","kp":"ch20-2","tier":2,"type":"mcq","difficulty":2,"tags":["concept"],"stem":"正则表达式 <code>(ab)*</code> 描述的语言是？","options":[{"text":"一个 a 后面跟任意多个 b"},{"text":"ab 重复零次或多次，包括空串","correct":true},{"text":"a 和 b 交替出现且必须以 b 结尾"},{"text":"所有包含 ab 的二进制串"}],"explain":"解析：<code>(ab)*</code> 把 ab 当作一个整体重复 0 次或多次，因此包含空串 ε、ab、abab……。A 是 <code>ab*</code> 的含义，D 需要两边加通配。"},
    {"id":"ch20-q3","ch":"ch20","kp":"ch20-5","tier":2,"type":"mcq","difficulty":2,"tags":["concept"],"stem":"关于 DFA 的转移，下面哪条说法是<strong>正确</strong>的？","options":[{"text":"每个状态对每个输入符号恰好有一条出边","correct":true},{"text":"每个状态对每个输入符号可以有零条或多条出边"},{"text":"DFA 的读写头可以左右移动，也可以改写纸带"},{"text":"DFA 读完输入后可能永远不停机"}],"explain":"解析：DFA 的确定性就体现在“每状态每符号恰好一条出边”，且只读、只右移、输入有限所以一定停机。B、C、D 描述的是 NFA 或图灵机。"},
    {"id":"ch20-q4","ch":"ch20","kp":"ch20-8","tier":2,"type":"mcq","difficulty":2,"tags":["concept"],"stem":"Kleene 定理说明正则表达式、DFA、NFA 三者之间是什么关系？","options":[{"text":"三者描述的语言集合完全相同，都是正则语言","correct":true},{"text":"NFA 严格强于 DFA，DFA 严格强于正则表达式"},{"text":"正则表达式只能描述有限语言"},{"text":"DFA 能识别所有形式语言，NFA 只能识别正则语言"}],"explain":"解析：Kleene 定理证明三种模型等价，都恰好刻画正则语言。NFA 看起来更自由，但子集构造可以把任意 NFA 转成 DFA，所以能力相同。"},
    {"id":"ch20-q5","ch":"ch20","kp":"ch20-9","tier":3,"type":"mcq","difficulty":3,"tags":["concept"],"stem":"下面哪个语言<strong>不是</strong>正则语言？","options":[{"text":"b 的个数是 3 的倍数的所有二进制串"},{"text":"倒数第二个符号是 a 的所有二进制串"},{"text":"a 的个数与 b 的个数相等的所有二进制串","correct":true},{"text":"以 01 结尾的所有二进制串"}],"explain":"解析：C 需要无界计数，有限状态记不住，可用鸽巢原理证明它不是正则的；A 只需记除以 3 的余数，B、D 只需记住固定长度的后缀。"},
    {"id":"ch20-q6","ch":"ch20","kp":"ch20-7","tier":1,"type":"tf","difficulty":1,"tags":["concept"],"stem":"NFA 只要存在一条读完整个输入并到达接受态的路径，就接受该串。","answer":true,"explain":"解析：对。NFA 的接受规则是“存在一条路径”，不是“所有路径都到接受态”；模拟时正是靠维护可能状态集合来处理这种非确定性。"},
    {"id":"ch20-q7","ch":"ch20","kp":"ch20-6","tier":2,"type":"tf","difficulty":2,"tags":["concept"],"stem":"DFA 每读一个输入符号，当前状态最多改变一次。","answer":true,"explain":"解析：对。DFA 读一个符号只查一次转移表、只走一步；改变零次（自环）或一次。这与 NFA 一步可以同时到达多个状态不同。"},
    {"id":"ch20-q8","ch":"ch20","kp":"ch20-3","tier":1,"type":"fill","difficulty":1,"tags":["concept"],"stem":"正则表达式的闭包运算 <code>R*</code> 表示把 R 的串连接 0 次或多次，因此它一定包含 ___。","answer":"空串","accept":["空串 ε","ε","空字符串","empty string"],"explain":"解析：连接 0 次得到空串 ε，所以 <code>R*</code> 一定包含空串；这是闭包最常见的失分点。"},
    {"id":"ch20-q9","ch":"ch20","kp":"ch20-4","tier":2,"type":"predict","difficulty":2,"tags":["output"],"stem":"下面程序用 <code>charAt</code> 判断一个串是否属于正则表达式 <code>(a|b)*a(a|b)</code> 描述的语言（倒数第二个符号是 a），依次输出三行。请写出完整输出。","code":"public class Q {\n    public static void main(String[] args) {\n        String[] s = { \"abab\", \"abb\", \"aab\" };\n        for (int i = 0; i < s.length; i++) {\n            int n = s[i].length();\n            boolean ok = n >= 2 && s[i].charAt(n - 2) == 'a';\n            System.out.println(s[i] + \" \" + ok);\n        }\n    }\n}","answer":"abab true\nabb false\naab true","explain":"解析：<code>(a|b)*a(a|b)</code> 要求倒数第二个符号是 a。abab 的倒数第二个是 a（真）；abb 的倒数第二个是 b（假）；aab 的倒数第二个是 a（真）。"},
    {"id":"ch21-q1","ch":"ch21","kp":"ch21-1","tier":1,"type":"mcq","difficulty":1,"tags":["concept"],"stem":"图灵机与 DFA 最根本的区别是？","options":[{"text":"图灵机的状态数必须是有限的，DFA 可以无限"},{"text":"图灵机有可写的纸带，读写头可以左右移动","correct":true},{"text":"图灵机只能读写 0 和 1，DFA 能读任意字母"},{"text":"图灵机一定会停机，DFA 可能死循环"}],"explain":"解析：DFA 只读、只右移、不能改写；图灵机把“读”升级成“读—写—移动”，正是这个可写纸带让它可以模拟其他机器。两者状态数都有限，DFA 也一定停机。"},
    {"id":"ch21-q2","ch":"ch21","kp":"ch21-2","tier":2,"type":"mcq","difficulty":2,"tags":["trace"],"stem":"本章的二进制加一图灵机从输入 <code>10111</code> 出发，最终纸带上的结果是？","options":[{"text":"11000","correct":true},{"text":"11001"},{"text":"10110"},{"text":"10000"}],"explain":"解析：10111 是十进制的 23，加一得 24，即 11000。机器从右端 # 向左扫，把末尾连续的 1 改写成 0，再把遇到的第一个 0 改写成 1。"},
    {"id":"ch21-q3","ch":"ch21","kp":"ch21-5","tier":2,"type":"mcq","difficulty":2,"tags":["concept"],"stem":"关于图灵机的 recognizes（识别）与 decides（判定），下面哪条说法正确？","options":[{"text":"能识别一个语言，就一定能判定它"},{"text":"判定要求对每个输入都停机，并正确回答 Yes 或 No","correct":true},{"text":"识别要求对每个输入都停机"},{"text":"DFA 也需要区分识别与判定"}],"explain":"解析：识别只要求“属于语言的串最终接受”，不保证不属于的串会停机；判定还要求对所有输入都停机并给出 Yes/No。DFA 一定停机，所以两者对 DFA 没有区别。"},
    {"id":"ch21-q4","ch":"ch21","kp":"ch21-6","tier":2,"type":"mcq","difficulty":2,"tags":["concept"],"stem":"通用图灵机（UTM）的核心思想是？","options":[{"text":"用一台固定机器读入“另一台机器的描述 + 输入”，模拟它的运行","correct":true},{"text":"把所有图灵机合并成一台状态数更多的机器"},{"text":"证明图灵机比 DFA 更强"},{"text":"让图灵机可以处理无限长的输入"}],"explain":"解析：UTM 把“程序”和“数据”都放在同一条纸带上，先解释程序描述、再按规则执行，这就是“程序即数据”和现代通用计算机的思想来源。"},
    {"id":"ch21-q5","ch":"ch21","kp":"ch21-7","tier":3,"type":"mcq","difficulty":3,"tags":["concept"],"stem":"关于 Church–Turing 论题，下面哪条说法最准确？","options":[{"text":"它是一条已经被严格证明的数学定理"},{"text":"它断言图灵机能完成任何物理可实现计算设备能完成的计算，本身不是可证明的数学定理","correct":true},{"text":"它断言所有形式语言都是可判定的"},{"text":"它断言量子计算机不能被图灵机模拟"}],"explain":"解析：论题把“可计算”这个直观概念等同于“图灵可计算”，它无法被数学证明（因为“任何物理设备”没有形式定义），但可以被反例推翻。"},
    {"id":"ch21-q6","ch":"ch21","kp":"ch21-1","tier":2,"type":"tf","difficulty":2,"tags":["concept"],"stem":"图灵机读写头向哪边移动，由转移前的“当前状态”决定。","answer":false,"explain":"解析：错。移动方向由转移后到达的<strong>新状态</strong>的标记（L/R/H）决定，所以在模拟器里要先更新状态、再按新状态移动读写头。"},
    {"id":"ch21-q7","ch":"ch21","kp":"ch21-8","tier":2,"type":"tf","difficulty":2,"tags":["concept"],"stem":"带两个栈的下推自动机与图灵机能力等价。","answer":true,"explain":"解析：对。两个栈可以模拟一条无限纸带的左右两侧；而一个栈只能识别上下文无关语言，严格弱于图灵机。"},
    {"id":"ch21-q8","ch":"ch21","kp":"ch21-3","tier":2,"type":"fill","difficulty":2,"tags":["trace"],"stem":"用教材的状态表格式运行加法器 <code>addTM.txt</code>，输入 <code>101+11</code> 时最终输出是 ___（形如 <code>Halt 结果</code>）。","answer":"Halt 1000","accept":["halt 1000"],"explain":"解析：101 是 5、11 是 3，和为 8，即二进制 1000。机器反复“递减 + 右边的数、递增 + 左边的数”，直到右边归零。"},
    {"id":"ch21-q9","ch":"ch21","kp":"ch21-4","tier":3,"type":"predict","difficulty":3,"tags":["output"],"stem":"下面程序用三个状态模拟“二进制加一”图灵机（纸带第 0 格是左端哨兵 #，状态 2 为 Halt）。请写出输出。","code":"public class Q {\n    public static void main(String[] args) {\n        char[] t = { '#', '1', '0', '1', '1', '#', '#', '#' };\n        int[] act = { 1, -1, 0 };\n        int[][] next = { { 1, 0, 0 }, { 2, 2, 1 }, { 0, 0, 0 } };\n        char[][] w = { { '#', '0', '1' }, { '1', '1', '0' }, { '#', '0', '1' } };\n        int s = 0, h = 1;\n        while (act[s] != 0) {\n            char c = t[h];\n            int sym = (c == '#') ? 0 : (c == '0') ? 1 : 2;\n            t[h] = w[s][sym];\n            s = next[s][sym];\n            h += act[s];\n        }\n        String out = \"\";\n        for (int i = 1; t[i] != '#'; i++) out = out + t[i];\n        System.out.println(out);\n    }\n}","answer":"1100","explain":"解析：纸带上是 1011（11），加一得 1100（12）。状态 0 向右扫到 #，状态 1 向左把末尾的 1 改 0、遇到 0 改 1 后进入状态 2 停机。注意 h += act[s] 用的是新状态的动作。"},
    {"id":"ch22-q1","ch":"ch22","kp":"ch22-1","tier":1,"type":"mcq","difficulty":1,"tags":["concept"],"stem":"一个问题是“不可解（unsolvable）”的，准确含义是？","options":[{"text":"目前还没有人找到能解决它的算法"},{"text":"不存在能对所有实例都正确判定的图灵机","correct":true},{"text":"这个问题需要指数时间才能解决"},{"text":"这个问题没有实际应用价值"}],"explain":"解析：不可解是“逻辑上不可能”，不是“暂时没找到”；它比难解更强——难解问题至少有一个（指数时间的）算法，不可解问题连算法都不存在。"},
    {"id":"ch22-q2","ch":"ch22","kp":"ch22-4","tier":2,"type":"mcq","difficulty":2,"tags":["concept"],"stem":"停机问题不可解的证明中，strange 构造的关键作用是？","options":[{"text":"它直接算出了停机问题的一个反例输入"},{"text":"假设 halts 存在后，它推出 strange(strange) 停与不停同时成立，从而矛盾","correct":true},{"text":"它证明了所有程序都会停机"},{"text":"它把停机问题归约到 SAT"}],"explain":"解析：这是典型反证法：假设 halts 能判定一切，再构造一个“专门跟 halts 唱反调”的程序 strange，代入自身得到矛盾，所以 halts 不存在。"},
    {"id":"ch22-q3","ch":"ch22","kp":"ch22-5","tier":2,"type":"mcq","difficulty":2,"tags":["concept"],"stem":"若问题 A 不可解，且 A 可以多项式归约到 B，那么可以推出？","options":[{"text":"B 一定可解"},{"text":"B 一定不可解","correct":true},{"text":"B 一定 NP 完全"},{"text":"什么都推不出来"}],"explain":"解析：如果 B 可解，就用 B 的解法加上归约构造出 A 的解法，与 A 不可解矛盾，所以 B 也不可解。这正是用归约传递不可解性的方向。"},
    {"id":"ch22-q4","ch":"ch22","kp":"ch22-7","tier":2,"type":"mcq","difficulty":2,"tags":["concept"],"stem":"NP 的正确定义是？","options":[{"text":"所有无法在多项式时间内求解的问题"},{"text":"所有解可以在多项式时间内验证的搜索问题","correct":true},{"text":"所有需要指数时间才能验证的问题"},{"text":"所有 NP 完全问题的集合"}],"explain":"解析：NP 的 N 指非确定性，不是 not polynomial。它包含所有“给定候选解能快速验证”的搜索问题；P 是 NP 的子集，NP 完全只是 NP 中最难的那一类。"},
    {"id":"ch22-q5","ch":"ch22","kp":"ch22-7","tier":3,"type":"mcq","difficulty":3,"tags":["concept"],"stem":"如果某一天有人为某个 NP 完全问题找到了多项式时间算法，那么？","options":[{"text":"只说明这一个问题变简单了，与其他问题无关"},{"text":"由 NP 完全的定义，所有 NP 问题都能多项式求解，即 P = NP","correct":true},{"text":"说明 P ≠ NP 被证明"},{"text":"说明该问题其实不属于 NP"}],"explain":"解析：NP 完全问题 B 的定义是所有 NP 问题都归约到 B；若 B 有多项式算法，则每个 NP 问题都能多项式求解，于是 P = NP。"},
    {"id":"ch22-q6","ch":"ch22","kp":"ch22-6","tier":2,"type":"tf","difficulty":2,"tags":["concept"],"stem":"P ≠ NP 目前已经被严格证明。","answer":false,"explain":"解析：错。P 是否等于 NP 至今是开放问题（Cook 1971 提出），多数研究者相信 P ≠ NP，但这只是信念，不是定理。"},
    {"id":"ch22-q7","ch":"ch22","kp":"ch22-5","tier":3,"type":"tf","difficulty":3,"tags":["concept"],"stem":"Rice 定理说：判定程序是否具有任意给定性质都是不可解的。","answer":false,"explain":"解析：错。Rice 定理只适用于<strong>非平凡的功能性质</strong>（由程序的输入/输出行为决定）；像“程序文本是否超过 100 行”这种语法性质是可判定的。"},
    {"id":"ch22-q8","ch":"ch22","kp":"ch22-3","tier":2,"type":"fill","difficulty":2,"tags":["concept"],"stem":"停机问题问的是给定程序在给定输入上是否停机；把它加强为“程序对<strong>所有</strong>输入都停机”，得到的问题称为 ___ 问题。","answer":"全体性","accept":["全体性问题","totality","totality problem","全停机"],"explain":"解析：全体性（totality）问题比停机问题更强：若能用 alwaysHalts(f) 判定全体性，就能用它构造出停机问题的判定器，因此全体性也不可解。"},
    {"id":"ch22-q9","ch":"ch22","kp":"ch22-6","tier":2,"type":"predict","difficulty":2,"tags":["output"],"stem":"下面程序对 Collatz 序列做实验，请写出输出。","code":"public class Q {\n    public static void main(String[] args) {\n        int x = 7, steps = 0;\n        while (x != 1) {\n            if (x % 2 == 0) x = x / 2;\n            else x = 3 * x + 1;\n            steps++;\n        }\n        System.out.println(x + \" \" + steps);\n    }\n}","answer":"1 16","explain":"解析：从 7 出发的 Collatz 序列为 7,22,11,34,17,52,26,13,40,20,10,5,16,8,4,2,1，共 16 步到达 1；目前没有人能证明它对所有正整数都停机。"},
    {"id":"ch23-q1","ch":"ch23","kp":"ch23-2","tier":1,"type":"mcq","difficulty":1,"tags":["concept","hex"],"stem":"十六进制数 <code>1CAB</code> 的十进制值是多少？","options":[{"text":"7339","correct":true},{"text":"7340"},{"text":"64206"},{"text":"7168"}],"explain":"按 16 的幂展开：1×16³ + 12×16² + 10×16 + 11 = 4096 + 3072 + 160 + 11 = 7339。十六进制每位正好对应 4 个二进制位，所以 1CAB 也等于 0001 1100 1010 1011。"},
    {"id":"ch23-q2","ch":"ch23","kp":"ch23-5","tier":1,"type":"mcq","difficulty":2,"tags":["concept","twos-complement"],"stem":"用 5 位补码表示 −5，结果是什么？","options":[{"text":"10101"},{"text":"11011","correct":true},{"text":"01011"},{"text":"11101"}],"explain":"5 位补码的模是 2⁵ = 32，−5 存成 32 − 5 = 27，即 11011。也可以按「5 的二进制 00101 取反得 11010，再加 1 得 11011」来算。注意 5 位补码范围是 −16…15。"},
    {"id":"ch23-q3","ch":"ch23","kp":"ch23-6","tier":2,"type":"mcq","difficulty":2,"tags":["concept","floating-point"],"stem":"IEEE 754 单精度（binary32）浮点数中，指数域占多少位、偏置值（bias）是多少？","options":[{"text":"8 位，偏置 127","correct":true},{"text":"8 位，偏置 128"},{"text":"11 位，偏置 1023"},{"text":"5 位，偏置 15"}],"explain":"binary32 共 32 位：1 位符号 + 8 位指数 + 23 位尾数，指数偏置为 127；binary64 是 1 + 11 + 52、偏置 1023；binary16 是 1 + 5 + 10、偏置 15。实际指数 = 存储的指数值 − bias。"},
    {"id":"ch23-q4","ch":"ch23","kp":"ch23-8","tier":1,"type":"mcq","difficulty":1,"tags":["concept","toy"],"stem":"TOY 机器的内存规格是什么？","options":[{"text":"256 个 16 位字，地址用 8 位（00–FF）","correct":true},{"text":"16 个 16 位字，地址用 4 位"},{"text":"256 个 8 位字节，地址用 8 位"},{"text":"1024 个 16 位字，地址用 10 位"}],"explain":"TOY 内存是 256 个 16 位字，地址 00–FF；另有 16 个 16 位寄存器 R[0]–R[F]（R[0] 恒为 0000）、8 位 PC 和 16 位指令寄存器。地址 FF 专门留给标准输入输出。"},
    {"id":"ch23-q5","ch":"ch23","kp":"ch23-4","tier":1,"type":"tf","difficulty":1,"tags":["concept","range"],"stem":"16 位补码整数能表示的范围是 −32768 到 32767。","answer":true,"explain":"n 位补码范围是 −2^(n−1) 到 2^(n−1)−1，n = 16 时即 −32768 到 32767，共 65536 个值。Java 的 short 正是这个范围，0 只有一种表示。"},
    {"id":"ch23-q6","ch":"ch23","kp":"ch23-3","tier":1,"type":"tf","difficulty":1,"tags":["concept","java"],"stem":"Java 表达式 <code>Integer.parseInt(\"FACE\", 16)</code> 的值是 64206。","answer":true,"explain":"parseInt 的第二个参数是进制：F×16³ + A×16² + C×16 + E = 61440 + 2560 + 192 + 14 = 64206。反向的 <code>Integer.toHexString(64206)</code> 得到 \"face\"（小写）。"},
    {"id":"ch23-q7","ch":"ch23","kp":"ch23-9","tier":1,"type":"fill","difficulty":1,"tags":["concept","toy"],"stem":"TOY 指令长 16 位，其中操作码（opcode）占 ____ 位。","answer":"4","accept":["4","四","4 位","四位"],"explain":"TOY 指令用 4 个十六进制数字表示：RR 格式是 op(4) + d(4) + s(4) + t(4)，A 格式是 op(4) + d(4) + addr(8)。所以操作码 4 位，最多 16 条指令。"},
    {"id":"ch23-q8","ch":"ch23","kp":"ch23-1","tier":1,"type":"fill","difficulty":1,"tags":["concept","bits"],"stem":"8 位无符号整数能表示的最大值是 ____。","answer":"255","accept":["255","0xff","0XFF","FF"],"explain":"n 位无符号数范围是 0 到 2^n − 1，8 位即 0…255（二进制 11111111，十六进制 FF）。若要表示负数，就得让出一半范围给补码。"},
    {"id":"ch23-q9","ch":"ch23","kp":"ch23-3","tier":2,"type":"predict","difficulty":2,"tags":["code","hex"],"stem":"下面程序的输出是什么？","code":"public class Q {\n    public static void main(String[] args) {\n        int x = 0x1CAB;\n        System.out.println(x);\n        System.out.println(Integer.toHexString(64206).toUpperCase());\n    }\n}","answer":"7339\nFACE","explain":"0x1CAB 按 16 的幂展开是 7339，所以第一行打印 7339；toHexString(64206) 得到 \"face\"，toUpperCase 后是 \"FACE\"，第二行打印 FACE。"},
    {"id":"ch23-q10","ch":"ch23","kp":"ch23-7","tier":2,"type":"predict","difficulty":2,"tags":["code","bitwise"],"stem":"下面程序用掩码拆出一个 int 的低字节与次低字节，输出是什么？","code":"public class Q {\n    public static void main(String[] args) {\n        int x = 0x1234;\n        System.out.println(x & 0xFF);\n        System.out.println((x >> 8) & 0xFF);\n    }\n}","answer":"52\n18","explain":"0x1234 的低字节是 0x34 = 52，所以第一行打印 52；右移 8 位后 0x12 落到低字节，再用 0xFF 掩掉高位，得到 0x12 = 18。掩码保证只保留关心的位。"},
    {"id":"ch24-q1","ch":"ch24","kp":"ch24-1","tier":1,"type":"mcq","difficulty":1,"tags":["concept","toy","call"],"stem":"TOY 用 <code>F</code> 指令实现函数调用时，返回地址被保存在哪个寄存器？","options":[{"text":"R[F]","correct":true},{"text":"R[0]"},{"text":"R[A]"},{"text":"R[E]"}],"explain":"F 指令（jump and link）先做 R[d] ← PC，再把 PC 设为地址；调用约定用 R[F] 存返回地址，被调函数最后用 <code>EF00</code>（jump register R[F]）返回。R[A]、R[B] 用于传参和返回值。"},
    {"id":"ch24-q2","ch":"ch24","kp":"ch24-2","tier":1,"type":"mcq","difficulty":1,"tags":["concept","toy","convention"],"stem":"TOY 的函数调用约定中，调用者与被调函数主要用哪两个寄存器传递参数和返回值？","options":[{"text":"R[A] 与 R[B]","correct":true},{"text":"R[0] 与 R[1]"},{"text":"R[E] 与 R[F]"},{"text":"R[8] 与 R[9]"}],"explain":"约定是：参数放 R[A]、R[B]，返回值也放 R[A]（或 R[B]）；R[F] 存返回地址，R[C] 及以上的寄存器由被调函数自由使用。调用者若要保留 R[9] 这类寄存器，得自己先保存。"},
    {"id":"ch24-q3","ch":"ch24","kp":"ch24-5","tier":2,"type":"mcq","difficulty":2,"tags":["concept","vm"],"stem":"TOY 虚拟机的执行循环里，取指（fetch）阶段做了哪两件事？","options":[{"text":"IR ← M[PC]，然后 PC ← (PC+1) & 0xFF","correct":true},{"text":"PC ← M[IR]，然后 IR ← (IR+1) & 0xFF"},{"text":"M[PC] ← IR，然后 PC ← PC + 2"},{"text":"R[0] ← M[PC]，然后 PC ← R[0]"}],"explain":"取指就是把 PC 指向的字装进指令寄存器 IR，然后 PC 加 1（用 & 0xFF 保持在 8 位地址范围内）。之后 decode 出 op、d、s、t、addr，再 execute；这正是「fetch–increment–execute」循环。"},
    {"id":"ch24-q4","ch":"ch24","kp":"ch24-6","tier":1,"type":"mcq","difficulty":1,"tags":["concept","toolchain"],"stem":"汇编器（assembler）的工作是什么？","options":[{"text":"把 <code>lda R2 15</code> 这样的助记符翻译成 16 位机器码","correct":true},{"text":"直接逐条执行源程序，不生成机器码"},{"text":"把 Java 源码编译成 JVM 字节码"},{"text":"把机器码反汇编成 C 语言"}],"explain":"汇编器负责「符号 → 机器码」的翻译，例如把 lda R2 15 翻成 7215；解释器不生成机器码、直接执行；编译器把高级语言翻成机器码或字节码；反汇编是相反方向。"},
    {"id":"ch24-q5","ch":"ch24","kp":"ch24-7","tier":1,"type":"tf","difficulty":1,"tags":["concept","stored-program"],"stem":"存储程序（stored program）意味着指令和数据放在同一块内存里，程序因此可以修改自己。","answer":true,"explain":"TOY 的内存既存指令也存数据，两者都是 16 位字，机器无法从形式上区分——所以程序可以把自己当数据处理、修改指令（自修改代码）。这既是灵活性的来源，也是病毒和缓冲区溢出的根源。"},
    {"id":"ch24-q6","ch":"ch24","kp":"ch24-8","tier":1,"type":"tf","difficulty":1,"tags":["concept","scale"],"stem":"TOY-64 用 64 位字长，其中 40 位作地址、20 位作寄存器地址。","answer":true,"explain":"教材用它说明「加宽字长能换来多大空间」：40 位地址可寻址超过 68 亿个字，20 位寄存器地址意味着超过 25 万个寄存器。同样 64 位，既能表示巨大的整数，也能表示 8 个字符的字符串。"},
    {"id":"ch24-q7","ch":"ch24","kp":"ch24-3","tier":1,"type":"fill","difficulty":1,"tags":["concept","io"],"stem":"TOY 把内存地址 ____（十六进制）保留给标准输入输出。","answer":"FF","accept":["FF","ff","0xFF","255"],"explain":"地址 FF 是纸带 I/O 的专用地址：store 到 FF（opcode 9）表示输出一个 16 位值，load 自 FF（opcode 8）表示读入一个 16 位值。boot 程序正是用 8AFF/8BFF 从纸带读程序。"},
    {"id":"ch24-q8","ch":"ch24","kp":"ch24-4","tier":2,"type":"fill","difficulty":2,"tags":["concept","array"],"stem":"TOY 的标准数组格式里，数组地址指向的那个字存放的是数组的 ____。","answer":"长度","accept":["长度","数组长度","元素个数","length"],"explain":"TOY 数组把长度放在最后一个字，数组地址指向它；访问 a[i] 要先用 load indirect 取出长度，再按偏移访问。这样循环才能知道边界，也是「数据布局决定算法写法」的典型例子。"},
    {"id":"ch24-q9","ch":"ch24","kp":"ch24-5","tier":2,"type":"predict","difficulty":2,"tags":["code","decode"],"stem":"下面的程序按 TOY 的规则解码一条 16 位指令，输出是什么？","code":"public class Q {\n    public static void main(String[] args) {\n        int IR = 0x1CAB;\n        int op = (IR >> 12) & 0xF;\n        int d = (IR >> 8) & 0xF;\n        int s = (IR >> 4) & 0xF;\n        int t = IR & 0xF;\n        System.out.println(op + \" \" + d + \" \" + s + \" \" + t);\n    }\n}","answer":"1 12 10 11","explain":"0x1CAB 的 4 个十六进制位分别是 1、C、A、B，依次是 op=1、d=12、s=10、t=11，所以输出「1 12 10 11」。op=1 是 add，这条指令表示 R[C] ← R[A] + R[B]。"},
    {"id":"ch24-q10","ch":"ch24","kp":"ch24-2","tier":2,"type":"predict","difficulty":2,"tags":["code","gcd"],"stem":"下面的程序用与 TOY 的 Euclid 程序相同的算法求最大公约数，输出是什么？","code":"public class Q {\n    public static void main(String[] args) {\n        int a = 195, b = 273;\n        while (b != 0) {\n            int t = a % b;\n            a = b;\n            b = t;\n        }\n        System.out.println(a);\n    }\n}","answer":"39","explain":"欧几里得算法反复做 (a, b) ← (b, a mod b)：273 mod 195 = 78，195 mod 78 = 39，78 mod 39 = 0，此时 a = 39。教材的 TOY 程序 6.2.2 用 195 和 273 得到的就是 0027（十六进制）= 39。"},
    {"id":"ch25-q1","ch":"ch25","kp":"ch25-1","tier":1,"type":"mcq","difficulty":1,"tags":["concept","boolean"],"stem":"两个输入变量的布尔函数一共有多少个？","options":[{"text":"4"},{"text":"8"},{"text":"16","correct":true},{"text":"256"}],"explain":"两个变量有 4 种输入组合，真值表的每一行输出可以是 0 或 1，所以共有 2⁴ = 16 个不同的布尔函数。3 变量有 2⁸ = 256 个，6 变量则多达 2⁶⁴ 个——这正是真值表法只适合小规模函数的原因。"},
    {"id":"ch25-q2","ch":"ch25","kp":"ch25-2","tier":1,"type":"mcq","difficulty":1,"tags":["concept","demorgan"],"stem":"根据 DeMorgan 律，<code>(x + y)′</code> 等于什么？（<code>+</code> 表示 OR，<code>′</code> 表示 NOT）","options":[{"text":"x′ + y′"},{"text":"x′ · y′","correct":true},{"text":"x · y"},{"text":"x′ · y"}],"explain":"DeMorgan 律：<code>(x + y)′ = x′ · y′</code>，<code>(x · y)′ = x′ + y′</code>。直观理解：「不是（x 或 y）」等价于「既不是 x 也不是 y」。它是化简电路、把 OR 改写成 NAND 结构的关键工具。"},
    {"id":"ch25-q3","ch":"ch25","kp":"ch25-3","tier":2,"type":"mcq","difficulty":2,"tags":["concept","gates"],"stem":"下面哪个门集单独使用就能实现任意布尔函数（即「通用」）？","options":[{"text":"{AND, OR}"},{"text":"{AND, XOR}"},{"text":"{NAND}","correct":true},{"text":"{XOR}"}],"explain":"NAND 单独通用：用 NAND 可以搭出 NOT、AND、OR，因此能实现任意布尔函数；NOR 同理。{AND, OR} 做不出取反，{AND, XOR} 在全 0 输入时只能得 0、造不出常量 1，都不通用。"},
    {"id":"ch25-q4","ch":"ch25","kp":"ch25-5","tier":2,"type":"mcq","difficulty":2,"tags":["concept","decoder"],"stem":"一个 n 输入、带使能端的 decoder（译码器）有多少条输出线？同一时刻有几条输出为 1？","options":[{"text":"2ⁿ 条输出，同一时刻恰好 1 条为 1","correct":true},{"text":"n 条输出，同一时刻恰好 1 条为 1"},{"text":"2ⁿ 条输出，同一时刻 n 条为 1"},{"text":"2n 条输出，同一时刻 2 条为 1"}],"explain":"n 位地址有 2ⁿ 种取值，decoder 把它们一一映射成 2ⁿ 条输出线，任一时刻只有被选中的那条为 1（one-hot）。它常和 mux/demux 配合：demux 用 decoder 选通路，mux 则把所有输入 AND 后竖直 OR 起来。"},
    {"id":"ch25-q5","ch":"ch25","kp":"ch25-4","tier":1,"type":"tf","difficulty":1,"tags":["concept","switch"],"stem":"在教材的开关模型里，on/off 开关的控制端为 0 时输出 1、控制端为 1 时输出 0，它的行为正好是一个 NOT 门。","answer":true,"explain":"on/off 开关只有两种状态：控制 0 时导通、输出接电源（1）；控制 1 时断开、输出 0。这就是取反。用开关搭出 NOT/AND/OR，再往上搭 decoder、加法器、CPU，正是本章的抽象路线。"},
    {"id":"ch25-q6","ch":"ch25","kp":"ch25-8","tier":1,"type":"tf","difficulty":1,"tags":["concept","latch"],"stem":"SR 锁存（SR latch）允许 S 和 R 同时为 1，此时输出是确定且稳定的。","answer":false,"explain":"S 和 R 同时为 1 是非法输入，会让两个交叉耦合的 NOR 门互相竞争，输出不确定（race condition）。正常使用时 S、R 不能同时为 1；正是这个限制促使人们设计出带 write 控制的寄存器位。"},
    {"id":"ch25-q7","ch":"ch25","kp":"ch25-7","tier":2,"type":"fill","difficulty":2,"tags":["concept","adder"],"stem":"一位全加器中，向高位的进位 <code>c′</code> 等于三个输入 <code>x、y、c</code> 的 ____ 函数。","answer":"MAJ","accept":["MAJ","maj","多数","多数表决","majority"],"explain":"全加器的两个输出是 <code>z = ODD(x, y, c)</code>、<code>c′ = MAJ(x, y, c)</code>：三个输入里至少两个 1 才进位，所以进位是多数函数；和是奇校验函数。把 n 个全加器串联就是 ripple-carry adder。"},
    {"id":"ch25-q8","ch":"ch25","kp":"ch25-9","tier":2,"type":"fill","difficulty":2,"tags":["concept","toy8"],"stem":"TOY-8 的每条指令长 8 位：3 位 opcode + 1 位恒为 0 + ____ 位地址。","answer":"4","accept":["4","四","4 位","四位"],"explain":"TOY-8 用 3 位 opcode 区分 8 条指令，1 位保留恒 0，剩下 4 位作地址，所以指令的十六进制表示总是偶数（如 A5、26、C7）。16 字内存正好用 4 位地址寻址。"},
    {"id":"ch25-q9","ch":"ch25","kp":"ch25-6","tier":2,"type":"predict","difficulty":2,"tags":["code","truth-table"],"stem":"下面程序统计三变量 ODD 函数（奇数个 1 时输出 1）在真值表中有多少行为 1，输出是什么？","code":"public class Q {\n    public static void main(String[] args) {\n        int count = 0;\n        for (int x = 0; x < 2; x++)\n            for (int y = 0; y < 2; y++)\n                for (int z = 0; z < 2; z++)\n                    if ((x + y + z) % 2 == 1) count++;\n        System.out.println(count);\n    }\n}","answer":"4","explain":"三变量共 8 种组合，其中 1 的个数为奇数的有 001、010、100、111 四种，所以 count = 4。ODD 的积之和正好有 4 个 minterm，和 MAJ 的 4 个 minterm 互补。"},
    {"id":"ch25-q10","ch":"ch25","kp":"ch25-7","tier":3,"type":"predict","difficulty":2,"tags":["code","adder"],"stem":"下面程序用位运算实现 MAJ 与 ODD，输出是什么？","code":"public class Q {\n    static int maj(int x, int y, int c) { return (x & y) | (x & c) | (y & c); }\n    static int odd(int x, int y, int c) { return x ^ y ^ c; }\n    public static void main(String[] args) {\n        System.out.println(maj(1, 1, 0) + \" \" + odd(1, 1, 0));\n        System.out.println(maj(1, 0, 1) + \" \" + odd(1, 0, 1));\n    }\n}","answer":"1 0\n1 0","explain":"第一组输入 1、1、0：至少两个 1，MAJ = 1；1 的个数是偶数，ODD = 0，输出「1 0」。第二组 1、0、1：同样两个 1，MAJ = 1、ODD = 0，输出「1 0」。这两组都表示 1 + 1 = 10₂：本位 0、进位 1。"},
  ] };

  /* 数据先于引擎加载（app.js 的 loadQuizPack 先 data/quiz.js 再 assets/quiz.js），
     因此把同一份 pack 挂到 CSC._quizPack 上，引擎启动时从这里读取。 */
  var G = (typeof globalThis !== 'undefined') ? globalThis
        : (typeof window !== 'undefined') ? window : this;
  var C = G && G.CSC;
  if (C && typeof C.registerQuizPack === 'function') {
    try { C._quizPack = PACK; } catch (e) {}
    C.registerQuizPack(PACK);
  }
})();
