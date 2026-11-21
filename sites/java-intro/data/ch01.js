/* =====================================================================
 * data/ch01.js · 第 01 章：第一个 Java 程序
 * 职责：逐行解剖 Hello World、类名与文件名、语句与代码块、
 *       编译运行链路、输出与转义、注释与命名、读懂报错、
 *       两个完整案例（命令行参数工具 / 控制台表格）。
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5；示例输出均用 JDK 25 核对。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch01',
  num: '01',
  title: '第一个 Java 程序',
  en: 'Hello World & Program Anatomy',
  goals: [
    '能说出一个 Java 程序由哪几部分组成，并解释每个关键字的作用',
    '能自己写出、编译、运行一个输出文本的程序',
    '能区分 print 与 println，正确使用转义字符',
    '能解释类名与文件名的对应关系，以及 main 方法签名为什么不能改',
    '看到报错信息时，知道先看第几条、行号、错误类型'
  ],
  kp: [
    { id: 'ch01-1', title: '程序的结构：class 与 main' },
    { id: 'ch01-2', title: '语句、分号与代码块' },
    { id: 'ch01-3', title: '从源码到运行：编译与执行' },
    { id: 'ch01-4', title: 'print / println 与转义字符' },
    { id: 'ch01-5', title: '注释与命名风格' },
    { id: 'ch01-6', title: '读懂报错信息' },
    { id: 'ch01-7', title: '完整案例 A：命令行参数工具' },
    { id: 'ch01-8', title: '完整案例 B：控制台表格' },
    { id: 'ch01-10', title: '教材 §1.1：create / compile / execute 三步骤' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '学编程的第一个障碍不是语法，而是<b>看不见程序在干什么</b>。这一章只做一件事：' +
      '让你亲眼看到一段文本如何经过"编译"变成能执行的东西，并让屏幕吐出第一行字。' +
      '别急着写复杂代码——把 Hello World 的每一个字符都搞明白，后面 12 章都会轻松很多。' +
      '本章末尾还会把 <code>main</code> 里的 <code>String[] args</code> 用起来，' +
      '做出你第一个"能接收输入"的小工具。'
    },

    { t: 'p', lead: true, html:
      '1978 年，Brian Kernighan 在《The C Programming Language》里写下了第一个 "Hello, World!" 程序。' +
      '此后近 50 年，它成了每个人学编程的第一课。它短得可笑，却包含了一个程序能运行所需的<b>全部要素</b>：' +
      '一个容器、一个入口、一条指令。'
    },

    { t: 'h', text: '一、一段文本怎么就成了程序', id: 'ch01-1' },

    { t: 'p', html:
      '下面就是 Java 版的 Hello World。先别管那些眼花缭乱的关键字——点右上角「▶ 运行」，' +
      '让屏幕上出现 <code>Hello, World!</code>，再回来逐行拆解它。你也可以直接改掉引号里的内容，再跑一次。'
    },

    { t: 'code', caption: 'HelloWorld.java —— 5 行，真正干活的只有第 3 行', code:
`public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
` },

    { t: 'p', html:
      '这段代码一共 5 行，真正"干活"的只有第 3 行。其余四行是<b>脚手架</b>：' +
      '告诉 Java 这段代码属于谁（类）、从哪里开始执行（main）、以及代码块的边界（花括号）。' +
      '我们按"类声明 → 入口方法 → 语句"的顺序看。'
    },

    { t: 'h', lvl: 3, text: '1. 类声明：public class HelloWorld' },

    { t: 'p', html:
      'Java 是<b>面向对象（object-oriented）</b>语言：所有代码都必须住在一个<b>类（class）</b>里面，' +
      '没有"游离在类外面的函数"。<code>public class HelloWorld</code> 的意思是：' +
      '声明一个叫 <code>HelloWorld</code> 的类，并且它是公开的（其他代码可以使用它）。' +
      '注意 <code>class</code> 这个词只出现在声明处一次，创建对象时用 <code>new</code>（第 07 章讲）。'
    },

    { t: 'callout', kind: 'warn', title: '文件名必须和类名一致', html:
      '如果类叫 <code>HelloWorld</code>，文件就必须叫 <code>HelloWorld.java</code>（大小写完全一致）。' +
      '这是 Java 的硬性规定：<b>public 类</b>的名字必须与文件名相同。' +
      '初学者最常见的第一个报错就来自这里：' +
      '<code>class HelloWorld is public, should be declared in a file named HelloWorld.java</code>。' +
      '一个文件里可以有多个类，但只能有一个 public 类，且文件名跟它走。'
    },

    { t: 'p', html:
      '顺便建立<b>类与对象</b>的直觉：类（class）是模板，对象（object）是按模板造出来的实例。' +
      '<code>HelloWorld</code> 是一个类，但程序运行时 JVM 并不需要造出它的对象——main 是 static 的，' +
      '直接属于类本身。等你写到第 07 章"类与对象"，会看到 <code>new Student("Alice")</code> 这种' +
      '"按模板造实例"的写法；现在只要记住：<b>类是代码的容器，文件跟着 public 类走</b>。'
    },

    { t: 'code', caption: 'NameAndFile.java —— 类名、文件名、后缀三者的关系', code:
`public class NameAndFile {
    public static void main(String[] args) {
        // 类名必须与文件名一致（去掉 .java），大小写完全一致
        System.out.println("class name : NameAndFile");
        System.out.println("file name  : NameAndFile.java");
        System.out.println("only the public class must match the file name");
    }
}
` },

    { t: 'h', lvl: 3, text: '2. 入口方法：public static void main(String[] args)' },

    { t: 'p', html:
      '一个类可以有很多方法，但 JVM 只会从 <b><code>main</code></b> 方法开始执行。' +
      '这行是 Java 规定的<b>入口签名（signature）</b>，五个部分各有原因，一个都不能随便改。' +
      '注意"签名"这个词在考试里也会出现：它指方法名 + 参数类型列表，不包括返回值类型。'
    },

    { t: 'terms', items: [
      { en: 'public', zh: '公开的', html: '访问修饰符（access modifier）。JVM 需要从类外面调用 main，所以必须是 public。' },
      { en: 'static', zh: '静态的', html: '方法属于<b>类本身</b>，不需要先创建对象就能调用。JVM 启动时还没有任何对象。' },
      { en: 'void', zh: '无返回值', html: '返回类型（return type）。main 执行完不交回任何值。' },
      { en: 'main', zh: '主方法名', html: '这个名字是 JVM 写死要找的。改成 Main 就找不到入口。' },
      { en: 'String[] args', zh: '字符串数组参数', html: '命令行参数（command-line arguments），运行时追加的参数会装进这个数组。' }
    ] },

    { t: 'p', html:
      '现在你能回答一个常见问题：<b>为什么 main 方法必须是 static 的？</b>' +
      '因为 JVM 启动时只加载了类，还没有创建任何对象；static 方法属于类本身，可以在没有对象的情况下直接调用。' +
      '（第 07 章讲 static 与实例的区别时，你会再遇到这个问题。）' +
      '同理，<code>void</code> 是因为 JVM 不接收返回值，<code>public</code> 是因为它必须能被外部调用。'
    },

    { t: 'h', lvl: 3, text: '如果 main 写错会怎样' },

    { t: 'p', html:
      '把 <code>public static void main(String[] args)</code> 改动任何一处，程序都会启动失败，但报错方式不同：' +
      '去掉 <code>static</code>，JVM 找不到可调用的入口（<code>Main method not found in class ...</code>）；' +
      '把 <code>String[]</code> 改成 <code>String</code>，签名不匹配，同样报错；' +
      '把 <code>public</code> 去掉，JVM 无法从类外调用；改成 <code>int main</code> 则返回类型不合法。' +
      '唯一能"活着"的变体是 <code>String args[]</code>（C 风格的数组写法）——Java 允许它，' +
      '但课程与规范都推荐 <code>String[] args</code>，因为"类型[] 名字"更好读。'
    },

    { t: 'code', caption: 'Anatomy.java —— 同一个程序，每行标上作用', code:
`public class Anatomy {
    // 类声明：所有代码都住在类里；public 表示可被外部使用
    public static void main(String[] args) {
        // 入口方法：JVM 从这里开始执行
        System.out.println("Hello, World!");
    }
}
` },

    { t: 'h', lvl: 3, text: '3. 真正干活的那一行' },

    { t: 'p', html:
      '<code>System.out.println("Hello, World!");</code> 是一个<b>语句（statement）</b>，' +
      'Java 里每条语句都以<b>分号 <code>;</code></b> 结束。它的意思可以拆成三跳：' +
      '<code>System</code> 是 Java 自带的类（代表运行环境）；<code>System.out</code> 是它里面的静态字段，' +
      '代表<b>标准输出（standard output）</b>，通常就是终端屏幕；<code>println</code> 是 print line 的缩写，' +
      '把括号里的内容打印出来<b>然后换行</b>。这个"三跳"的读法（类 → 字段 → 方法）会在后面所有章节反复出现。'
    },

    { t: 'h', text: '二、语句、分号与代码块', id: 'ch01-2' },

    { t: 'p', html:
      'Java 用花括号 <code>{ }</code> 划<b>代码块（block）</b>，用分号 <code>;</code> 结束<b>语句（statement）</b>。' +
      '这两条规则解释了三件事：① 语句可以跨行写，只要分号在；② 花括号必须成对；' +
      '③ 花括号还决定<b>作用域（scope）</b>——块内声明的变量出了块就不可见。' +
      '注意：<code>class</code> 和 <code>if / for</code> 后面的花括号后面<b>不加分号</b>，' +
      '而 <code>do-while</code> 的结尾必须加（第 03 章会专门讲这个例外）。'
    },

    { t: 'code', caption: 'Statements.java —— 语句、块、作用域与空语句（可单步）', trace: true, code:
`public class Statements {
    public static void main(String[] args) {
        int a = 1;
        int b = 2;

        {
            int inner = a + b;          // 块内变量，只在这个 { } 里可见
            System.out.println("inner = " + inner);   // 3
        }

        System.out.println("a + b = " + (a + b));     // 3
        ;                               // 空语句：合法但什么也不做
        System.out.println("end");
    }
}
` },

    { t: 'p', html:
      '输出 <code>inner = 3</code>、<code>a + b = 3</code>、<code>end</code>。' +
      '注意 <code>inner</code> 在块外不能再用——如果试着在最后一行打印它，编译会报 ' +
      '<code>cannot find symbol</code>。这类"找不到符号"的报错，八成是作用域或拼写问题。' +
      '空语句 <code>;</code> 单独一行虽然合法，但它是 bug 的温床（第 03 章会看到 <code>for (...);</code> 把循环体变空）。'
    },

    { t: 'h', text: '三、从源码到运行：编译与执行', id: 'ch01-3' },

    { t: 'p', html:
      '你写的 <code>.java</code> 文件不是机器能直接执行的。中间有两道工序：先<b>编译（compile）</b>成' +
      '字节码 <code>.class</code>，再由 <b>JVM</b> 解释执行。字节码不属于任何特定操作系统，' +
      '这正是 "Write Once, Run Anywhere" 的由来。'
    },

    { t: 'flow', nodes: [
      { title: 'HelloWorld.java', desc: '你写的源代码（人类可读）', kind: 'start' },
      { title: 'javac 编译器', desc: '检查语法、生成字节码', kind: 'proc' },
      { title: 'HelloWorld.class', desc: '字节码（JVM 可读）', kind: 'proc' },
      { title: 'JVM 执行', desc: 'JVM 找到 main 开始执行', kind: 'proc' },
      { title: 'Hello, World!', desc: '输出到终端', kind: 'end' }
    ] },

    { t: 'table',
      head: ['命令', '做什么', '产物'],
      rows: [
        ['<code>javac HelloWorld.java</code>', '编译：把源码翻译成字节码，同时检查语法', '<code>HelloWorld.class</code>'],
        ['<code>java HelloWorld</code>', '运行：启动 JVM，执行 HelloWorld 的 main 方法', '终端输出'],
        ['<code>java HelloWorld Alice Bob</code>', '运行并传入命令行参数，它们进入 <code>args</code> 数组', '可被程序读取'],
        ['<code>javac -d out *.java</code>', '把多个源文件的字节码统一输出到 <code>out/</code> 目录', '<code>out/</code> 下的 .class']
      ],
      caption: '注意：运行时不带 <code>.class</code> 后缀，也不写 <code>javac</code>' },

    { t: 'callout', kind: 'tip', title: '为什么要先编译，不能直接跑？', html:
      '编译阶段能抓出大量错误：拼写错误、类型不匹配、括号不配对、缺少分号。' +
      '<b>错误发现得越早，修复成本越低</b>：编译期发现的问题不用真的跑起来才知道。' +
      '这也是静态类型语言（Java、C++、TypeScript）和动态类型语言（Python、JavaScript）的核心区别之一。' +
      '本站的代码编辑器把这两步合在一起：点「运行」时先在浏览器里编译（检查语法），再解释执行。'
    },

    { t: 'h', lvl: 3, text: 'IDE 帮你做了什么' },

    { t: 'p', html:
      '真实的开发环境（IDE，如 IntelliJ IDEA、VS Code）把"编译 + 运行 + 调试"打包成按钮，看起来跳过了命令行。' +
      '但底层流程一点没变：点绿色的 Run 时，IDE 在后台替你执行了 <code>javac</code> 和 <code>java</code>，' +
      '只是把 <code>.class</code> 放到 <code>out/</code> 或 <code>target/</code> 目录里。' +
      '理解这条链路的意义在于：报错信息、类名与文件名规则、字节码的位置，全都没有变——' +
      '考试与作业里让你手写编译命令时，你照样要会。'
    },

    { t: 'p', html:
      '另一个实际影响是<b>源文件的位置</b>。命令行下你在哪个目录执行 <code>javac</code>，就在哪里找 <code>.java</code>；' +
      'IDE 则按"源码根目录（src）+ 包名"去找。初学者常见的 <code>cannot find symbol</code>，' +
      '有一类就是文件放错目录或类名拼错造成的。所以本章先建立"文件 → 编译 → 字节码 → 运行"这条清楚的链条，' +
      '以后用 IDE 也不会被按钮挡住视线。'
    },

    { t: 'h', text: '四、print / println 与转义字符', id: 'ch01-4' },

    { t: 'p', html:
      '<code>print</code> 打印后<b>不换行</b>，<code>println</code> 打印后<b>换行</b>。' +
      '混用它们可以拼出进度条、表格等排版。下面这段先预测输出，再运行对照——' +
      '前三行 <code>print</code> 不换行，所以 <code>Loading</code> 和三个点会连成一片；' +
      '最后一个 <code>println</code> 补上换行，于是 <code>Done!</code> 落到第二行。'
    },

    { t: 'code', caption: 'Mix.java —— 混用 print 与 println', code:
`public class Mix {
    public static void main(String[] args) {
        System.out.print("Loading");
        System.out.print(".");
        System.out.print(".");
        System.out.println(".");
        System.out.println("Done!");
    }
}
` },

    { t: 'p', html:
      '输出是 <code>Loading...</code> 然后 <code>Done!</code> 两行。' +
      '<b>先预测、再运行</b>，是学编程最重要的肌肉记忆——预测错了才知道自己哪块理解有偏差。'
    },

    { t: 'h', lvl: 3, text: '第三种输出：printf' },

    { t: 'p', html:
      '除了 print / println，Java 还有 <code>printf</code>（print formatted）：它不换行，但支持<b>格式符</b>，' +
      '用来对齐、补零、控制小数位。三种输出的差别可以这样记：<code>print</code> 只管打印，' +
      '<code>println</code> 打印后换行，<code>printf</code> 打印前先按格式排版。' +
      '第 02 章会系统讲格式符；这里先建立印象——当你需要"对齐的表格"或"两位小数"时，就该想到 printf。'
    },

    { t: 'p', html:
      '另外注意：<code>printf</code> 的第一个参数永远是<b>格式字符串</b>，后面的参数按顺序填进格式符里。' +
      '格式符与参数的数量、类型必须匹配，否则运行时可能抛异常或输出 <code>?</code>——' +
      '这也是"能编译但跑出来不对"的常见来源之一。'
    },

    { t: 'p', html:
      '如果我想打印一对双引号，直接写 <code>"He said "hi""</code> 会怎样？编译器会以为字符串在第一个引号处结束了，' +
      '语法直接崩掉。解决办法是用<b>反斜杠转义（escape）</b>：<code>\\"</code> 表示"一个字面上的双引号"。' +
      '下面这张表是课程范围内会用到的全部转义；注意反斜杠本身也要转义，所以要写两个。'
    },

    { t: 'table',
      head: ['写法', '含义', '例子'],
      rows: [
        ['<code>\\n</code>', '换行（newline）', '<code>"a\\nb"</code> → 输出两行'],
        ['<code>\\t</code>', '制表符（tab）', '<code>"a\\tb"</code> → a 和 b 之间空开'],
        ['<code>\\"</code>', '双引号', '<code>"say \\"hi\\""</code>'],
        ['<code>\\\\</code>', '反斜杠本身', '<code>"C:\\\\Users"</code> → <code>C:\\Users</code>'],
        ['<code>\\u4e2d</code>', 'Unicode 字符（十六进制）', '中文、emoji 都能这么写']
      ],
      caption: '考试常考：<code>\\n</code> 与 <code>\\t</code> 的输出效果；反斜杠要写两个' },

    { t: 'code', caption: 'Escapes.java —— 四种转义实战', code:
`public class Escapes {
    public static void main(String[] args) {
        System.out.println("Name:\\tAlice");
        System.out.println("Path:\\tC:\\\\temp\\\\data");
        System.out.println("Quote:\\t\\"Java is fun\\"");
        System.out.println("Line1\\nLine2");
    }
}
` },

    { t: 'callout', kind: 'warn', title: '一个反斜杠不够', html:
      '想打印一个反斜杠，要写<b>两个</b>：<code>\\\\</code>。因为源码里单个 <code>\\</code> 是转义引导符，' +
      '只有 <code>\\\\</code> 才表示"真正的反斜杠字符"。Windows 路径最容易在这里翻车。' +
      '另外中文全角引号 <code>“ ”</code> 不是字符串定界符——从网页复制代码时最常踩这个坑。'
    },

    { t: 'h', text: '五、注释与命名风格', id: 'ch01-5' },

    { t: 'p', html:
      '注释是写给人看的，编译器会全部忽略。Java 有三种：<code>//</code> 单行注释、<code>/* ... */</code> 多行注释、' +
      '<code>/** ... */</code> 文档注释（可被工具提取成 API 文档）。' +
      '初学者最容易犯的错是<b>注释写"是什么"而不是"为什么"</b>：<code>i++ // i 加一</code> 毫无信息量，' +
      '而 <code>i++ // 跳过表头行</code> 才解释了意图。'
    },

    { t: 'p', html:
      '命名有约定俗成的规范：类名用<b>大驼峰（UpperCamelCase）</b>，如 <code>HelloWorld</code>；' +
      '变量与方法用小驼峰，如 <code>studentAge</code>、<code>printTotal</code>；' +
      '常量全大写加下划线，如 <code>MAX_SCORE</code>。这些不是语法强制，但<b>不遵守会扣"风格分"</b>，' +
      '而且 Java 编译器对少数情况（如全角字符）会直接报错。'
    },

    { t: 'code', caption: 'CommentStyles.java —— 三种注释 + 三类命名', code:
`/**
 * 演示三种注释与命名规范。
 * 类名用大驼峰（UpperCamelCase）。
 */
public class CommentStyles {
    // 单行注释：变量名用小驼峰（lowerCamelCase）
    static final int MAX_SCORE = 100;   // 常量全大写 + 下划线

    /* 多行注释：
       可以跨多行说明 */
    public static void main(String[] args) {
        int studentAge = 18;
        System.out.println("MAX_SCORE  = " + MAX_SCORE);    // 100
        System.out.println("studentAge = " + studentAge);   // 18
    }
}
` },

    { t: 'h', text: '六、读懂报错信息', id: 'ch01-6' },

    { t: 'p', html:
      '报错不是惩罚，是编译器在告诉你哪里不对。读报错有固定顺序：' +
      '<b>① 从第一条开始看</b>（后面的常是连带错误）；<b>② 找行号</b>；' +
      '<b>③ 看错误类型与"期望什么/遇到什么"</b>；<b>④ 回到那一行及其上一行</b>（少分号的错误常指向下一行）。' +
      '下面这段代码少了一个分号，先读一遍，猜猜编译器会报在哪一行——答案通常不是你直觉的那一行。'
    },

    { t: 'code', caption: 'BrokenSyntax.java · 少一个分号（故意）', run: false, code:
`public class BrokenSyntax {
    public static void main(String[] args) {
        System.out.println("missing semicolon")
        int x = 5;
        System.out.println("x = " + x);
    }
}
` },

    { t: 'p', html:
      '编译器会报 <code>&#39;;&#39; expected</code>，行号通常指在 <code>int x = 5;</code> 那一行——' +
      '因为它在读完上一行后才发现"语句还没结束"。第一次见会很困惑，记住这个规律就够了：' +
      '看到 <code>&#39;;&#39; expected</code>，先看报错行的<b>上一行</b>有没有漏分号。' +
      '其他三个高频报错：<code>cannot find symbol</code>（拼写/作用域/没 import）、' +
      '<code>incompatible types</code>（类型不匹配）、<code>reached end of file while parsing</code>（少一个右花括号）。' +
      '下面这张表把第一章可能遇到的报错集中列出来，遇到时先对号入座：'
    },

    { t: 'table',
      head: ['报错（英文原文）', '典型原因', '先查哪里'],
      rows: [
        ['<code>&#39;;&#39; expected</code>', '上一行少分号，或用了中文分号', '报错行的上一行'],
        ['<code>cannot find symbol</code>', '变量/方法名拼错、作用域之外、缺 import', '拼写与花括号范围'],
        ['<code>incompatible types</code>', '把 <code>String</code> 赋给 <code>int</code> 等', '赋值两边类型'],
        ['<code>class X is public, should be declared in a file named X.java</code>', '类名与文件名不一致', '文件名（含大小写）'],
        ['<code>reached end of file while parsing</code>', '少一个 <code>}</code>', '文件末尾的括号配对'],
        ['<code>illegal character: &#39;\\uXXXX&#39;</code>', '混入中文标点或全角空格', '报错行的符号']
      ],
      caption: '读到报错先分类：分号/括号类属于"结构"，symbol 类属于"名字"，types 类属于"类型"' },

    { t: 'p', html:
      '最后一个实用提醒：<b>报错会互相掩盖</b>。一个少写的右花括号能让后面几十行都报错，' +
      '一个类型错误能让编译器把整段方法的解析都放弃。所以永远从<b>第一条</b>报错改起，改完重新编译，' +
      '不要试图一次看懂全部。如果第一条看不懂，先把它的行号前后的代码读三遍——大多数报错的信息量都在那三行里。'
    },

    { t: 'h', text: '完整案例 A：main 的 args 能做什么', id: 'ch01-7' },

    { t: 'p', html:
      '入口签名里的 <code>String[] args</code> 不是装饰：运行程序时写在类名后面的词，会按顺序装进这个数组。' +
      '<code>java ArgsDemo Alice Bob Cara</code> 会得到 <code>args.length = 3</code>。' +
      '本站的代码块支持配置"运行参数"，所以这里也能直接体验：点「运行」看看数组里装了什么。' +
      '这个机制是所有命令行工具的基础（<code>git commit -m "msg"</code> 的 <code>-m</code> 和 <code>msg</code> 就是这样传进去的）。'
    },

    { t: 'code', caption: 'ArgsDemo.java · 读取命令行参数', args: ['Alice', 'Bob', 'Cara'], code:
`public class ArgsDemo {
    public static void main(String[] args) {
        System.out.println("args.length = " + args.length);
        for (int i = 0; i < args.length; i++) {
            System.out.println("args[" + i + "] = " + args[i]);
        }
    }
}
` },

    { t: 'p', html:
      '输出四行：<code>args.length = 3</code>，然后是三个参数。注意 <code>args</code> 是<b>字符串数组</b>，' +
      '所以拿来做算术要先用 <code>Integer.parseInt</code> 转成整数——这正好是下面这个完整案例要做的事。' +
      '它把你第一周会用到的东西（main、数组、循环、字符串转数字、printf）全串起来了：'
    },

    { t: 'code', caption: 'FirstTool.java —— 30 行的小工具：求和与平均值', args: ['3', '5', '8'], code:
`public class FirstTool {
    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("usage: java FirstTool <num1> <num2> ...");
            return;
        }
        int sum = 0;
        for (int i = 0; i < args.length; i++) {
            sum = sum + Integer.parseInt(args[i]);
        }
        System.out.println("count = " + args.length);
        System.out.println("sum   = " + sum);
        System.out.printf("avg   = %.2f%n", (double) sum / args.length);
    }
}
` },

    { t: 'p', html:
      '输出 <code>count = 3</code>、<code>sum = 16</code>、<code>avg = 5.33</code>。' +
      '三个值得记住的细节：① <code>args.length == 0</code> 的提前返回是<b>边界处理</b>——不处理的话后面除零会崩；' +
      '② <code>Integer.parseInt</code> 把字符串转成整数，传进来的是 "3" 而不是 3；' +
      '③ <code>%.2f</code> 保留两位小数，<code>%n</code> 是跨平台换行（第 02 章细讲 printf）。' +
      '这就是一个"能用的程序"：有输入、有处理、有输出、有错误分支。'
    },

    { t: 'h', text: '完整案例 B：控制台表格', id: 'ch01-8' },

    { t: 'p', html:
      '第二个案例只做一件事：把三行数据对齐打印。看起来简单，但它同时用到了字符串、循环、格式化——' +
      '而且对齐规则是考试里"读程序写输出"的常见素材：<code>%-8s</code> 表示左对齐占 8 列，' +
      '<code>%6d</code> 表示右对齐占 6 列。数错空格，输出就对不上。'
    },

    { t: 'code', caption: 'TableOutput.java —— 用 printf 排版一张成绩表', code:
`public class TableOutput {
    public static void main(String[] args) {
        System.out.printf("%-8s %6s %6s%n", "name", "score", "grade");
        System.out.printf("%-8s %6d %6s%n", "Alice", 92, "A");
        System.out.printf("%-8s %6d %6s%n", "Bob", 78, "B");
        System.out.printf("%-8s %6d %6s%n", "Cara", 85, "A-");
    }
}
` },

    { t: 'p', html:
      '输出四行，列宽固定：<code>name</code> 左对齐占 8 列，<code>score</code> 与 <code>grade</code> 右对齐占 6 列。' +
      '数输出空格的方法：第一行 <code>name</code> 后补 4 个空格到 8 列，再输出一个空格分隔，' +
      '然后 <code>score</code> 右对齐补 1 个空格到 6 列……考试不会让你数这么多空格，' +
      '但会考"<code>%-5d</code> 和 <code>%5d</code> 的区别"，记住"负号=左对齐"就够了。' +
      '下一章会把 printf 的所有格式符系统讲一遍。'
    },

    { t: 'h', text: '程序开发流程：从需求到能跑' },

    { t: 'p', html:
      '真实写程序不是"一次写完就完事"，而是一个固定循环：<b>想清楚要什么 → 写最小版本 → 编译 → 运行 → 对答案 → 改</b>。' +
      '初学者常跳过第一步（直接写代码）和最后一步（跑通就交），于是"能跑但结果错"的 bug 留到最后爆发。' +
      '本章的两个完整案例都可以按这个循环练：先改一个数字、再改输出格式，看结果怎么变。'
    },

    { t: 'steps', items: [
      { title: '写清楚输入与输出', html: '在纸上写"输入什么、输出什么、边界情况有哪些"，这一步不写代码。' },
      { title: '写最小可运行版本', html: '先让 main 打印一行字，确认编译运行链路通，再往上加逻辑。' },
      { title: '编译：先把语法错误清干净', html: '<code>javac</code> 的报错从第一条改起，不要一次改十处。' },
      { title: '运行并对比预期', html: '把输出和纸上写的对一遍；不一致就回到①检查需求理解。' },
      { title: '小步修改，每改一处跑一次', html: '一次改太多，出错时分不清是哪一处引起的。' }
    ] },

    { t: 'h', text: '教材对照：§1.1 第一个程序与命令行参数', id: 'ch01-9' },

    { t: 'p', html:
      '教材 §1.1 一上来只有两个程序：HelloWorld 与 UseArgument。它刻意不先讲语法，而是先讲一件事：' +
      '一段文本是怎么变成运行结果的。整节的核心就是三个动作——<b>create、compile、execute</b>。' +
      '本站第一章做的其实是同一件事，只是把"敲命令行"换成了"点运行"，把 javac 的输出藏在了后面。'
    },

    { t: 'table',
      head: ['步骤', '教材说法', '命令行里实际发生什么'],
      rows: [
        ['写代码', 'create', '把类存成 <code>X.java</code>；文件名必须与 public 类名一致'],
        ['编译', 'compile', '<code>javac X.java</code> 检查语法并生成字节码 <code>X.class</code>'],
        ['执行', 'execute', '<code>java X</code> 让 JVM 载入 <code>X.class</code> 并从 main 开始跑']
      ],
      caption: '注意第三行：java 后面跟的是类名，不是文件名；写成 java X.class 反而会报错' },

    { t: 'code', caption: '教材 Program 1.1.2：原书用 java UseArgument Alice 运行，输出 Hi, Alice. How are you?', args: ['Alice'], code:
`public class UseArgument {
    public static void main(String[] args) {
        System.out.print("Hi, ");
        System.out.print(args[0]);
        System.out.println(". How are you?");
    }
}
` },

    { t: 'p', html:
      '教材在这一节末尾用问答形式埋了三个伏笔，每个都值得现在就知道。' +
      '① <b>少给一个参数会怎样？</b>——<code>args</code> 的长度是 0，访问 <code>args[0]</code> 就是数组越界，' +
      '报错原文是 <code>Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: 0</code>；' +
      '学到 ch04 的数组越界时，回来看这条会格外亲切。' +
      '② <b>public、static、void 是什么？</b>——教材的说法是"先照抄，后面再解释"：static 留到第 2 章（方法），' +
      'public 与类留到第 3 章；本站对应 ch06 与 ch07，你现在只要会写。' +
      '③ <b>多打几个空格、换个换行有关系吗？</b>——Java 在词与词之间忽略多余空白，' +
      '所以 <code>System.out.println( "Hi" );</code> 和紧凑写法等价；但<b>字符串内部的空格一个都不能少</b>，' +
      '<code>"Hi, "</code> 里的逗号和空格都是输出的一部分。<br><br>' +
      'IDE 把"编译"和"执行"折叠成一颗绿色按钮，方便，但也遮住了出错时到底是哪一步失败。' +
      '教材让你先用 <code>javac</code> / <code>java</code> 手动跑几遍，是为了建立"源码 → 字节码 → JVM 执行"的直觉。' +
      '考试里常考这三个产物的名字，排错时也靠它判断问题在编译期还是运行期。<br><br>' +
      '教材还用同一个程序演示了一个小对比：三个 <code>print</code> 和一次 <code>println</code> 能拼出完整一句，' +
      '而把各部分用 <code>+</code> 连起来，一行 <code>println</code> 也能做到同样的输出。' +
      '两种写法没有对错，区别在于<b>谁负责拼接</b>：前者靠调用顺序，后者靠字符串拼接运算符。' +
      '自己跑一遍、对两个输出，比记住结论有用；如果输出有一个字符不一样，比如多余的空格，' +
      '多半是引号里的内容抄错了——这也是教材反复强调"先预测、再运行"的原因。' +
      '把上面三个 <code>print</code> 换成一次 <code>System.out.println("Hi, " + args[0] + ". How are you?");</code>，' +
      '输出一模一样，区别只是 <code>+</code> 在这里做字符串连接而不是加法。顺手记住 <code>print</code> 不换行、' +
      '<code>println</code> 换行：以后要把输出拼成一行还是分行，就是在这两个之间选。'
    },

    { t: 'quiz', qid: 'ch01-q1' },
    { t: 'quiz', qid: 'ch01-q2' },
    { t: 'quiz', qid: 'ch01-q3' },

    { t: 'terms', cols: 2, items: [
      { en: 'class', zh: '类', html: '代码的容器；文件名与 public 类名必须一致。' },
      { en: 'method', zh: '方法', html: '类里的函数；main 是 JVM 唯一认识的入口。' },
      { en: 'statement', zh: '语句', html: '以分号结尾的一条指令。' },
      { en: 'block', zh: '代码块', html: '花括号 { } 圈起来的一段代码，同时定义作用域。' },
      { en: 'signature', zh: '方法签名', html: '方法名 + 参数类型列表；main 的签名固定不能改。' },
      { en: 'escape sequence', zh: '转义序列', html: '反斜杠开头的特殊字符，如 \\n、\\t、\\"。' },
      { en: 'compile', zh: '编译', html: 'javac 把 .java 翻译成 .class 字节码并检查语法。' },
      { en: 'argument', zh: '实参', html: '运行时传给程序的值；main 的 args 装命令行参数。' }
    ] },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      '第一章的直接考点不多，但它是所有读程序题的地基，三种问法：' +
      '① <b>问输出</b>：给一段用 <code>print / println</code> 与 <code>\\n</code>、<code>\\t</code> 的程序，' +
      '让你写出屏幕上的结果——注意换行位置与制表符对齐。<br>' +
      '② <b>找错</b>：少分号、类名与文件名不一致、中文标点、<code>main</code> 签名写错' +
      '（如 <code>public void main</code> 少了 static）。<br>' +
      '③ <b>概念题</b>：<code>javac</code> 与 <code>java</code> 的区别、字节码是什么、' +
      '为什么 main 必须 public static void、<code>args</code> 里装的是什么。<br>' +
      '<b>答题提醒</b>：写输出题一定要标出第一行从哪里开始、第二行从哪里开始；' +
      '改错题要写出"哪一行、错什么、改成什么"，只圈出来通常拿不到满分。'
    },

    { t: 'keypoint', items: [
      { title: '结构', html: '所有代码住在类里；JVM 从 <code>public static void main(String[] args)</code> 进入。' },
      { title: '类名与文件名', html: 'public 类的名字必须与文件名一致（含大小写），否则编译报错。' },
      { title: '语句与块', html: '语句以分号结束；花括号划分代码块与作用域，块内变量出块不可见。' },
      { title: '编译运行', html: '<code>javac X.java</code> 产出 <code>X.class</code> 字节码；<code>java X</code> 运行，不带后缀。' },
      { title: '输出', html: '<code>print</code> 不换行、<code>println</code> 换行；<code>\\n \\t \\" \\\\</code> 是常用转义。' },
      { title: '报错', html: '从第一条看起，先看行号与错误类型；<code>&#39;;&#39; expected</code> 先查上一行。' },
      { title: 'args', html: '<code>String[] args</code> 装命令行参数，是字符串，做算术要先 <code>Integer.parseInt</code>。' }
    ] },

    { t: 'checklist', id: 'ch01', items: [
      '我能不看资料写出 Hello World 并说出每一行的作用',
      '我能解释 main 签名里 public / static / void / String[] args 各自为什么必须有',
      '我知道类名与文件名的对应规则，以及违反了会报什么错',
      '我能用 javac 和 java 两个命令完成编译与运行，并说出产物是什么',
      '我能区分 print 与 println，并用 \\n、\\t 排出预期格式',
      '我能看出少分号、中文标点、括号不配对这三类语法错误',
      '我知道三种注释的写法，以及类名/变量/常量的命名规范',
      '我能写一个接收命令行参数、做简单计算并格式化输出的小程序',
      '我能说出教材 §1.1 的 create / compile / execute 三个步骤，并解释 java 后面为什么跟类名'
    ] },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '第一章的代码 AI 一秒就能写出来，所以更该练"验证"：' +
      '① 让 AI 生成 Hello World 的 5 种变体（改输出、加参数、加注释），你逐行判断哪些会编译失败、为什么；' +
      '② 把本站 <code>BrokenSyntax</code> 那段发给它，问"编译器报哪一行"，看它是否知道"少分号报在下一行"；' +
      '③ 让它解释 <code>public static void main</code> 每个关键字，再对照本章的 terms 卡片抓它漏讲的点。<br>' +
      '记住：AI 常把 <code>java X</code> 说成 <code>java X.class</code>，也会忘记"public 类名必须与文件名一致"——' +
      '这类细节正好用来检验你有没有真读进去。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：第一个 Java 程序：类声明、main 入口签名、语句、编译与运行命令、print/println/printf、注释与命名、读懂编译错误。<br>依据：Course Outline v5 的 Basic Programming Concepts 部分；Sedgewick §1.1。本站为个人整理的学习材料，与课程要求冲突时以老师和课程大纲为准；代码均在真实 JDK 上校验过。' }

  ]
});