/* =====================================================================
 * data/ch05.js · 第 05 章：输入输出与绘图
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5
 * 本章要点：printf 格式化 / Scanner 读输入 / 重定向与命令行参数 /
 *           StdDraw 绘图（本站不加载绘图库，静态展示）/ 递归分形 / 随机数
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch05',
  num: '05',
  title: '输入输出与绘图',
  en: 'Input, Output & Drawing',
  goals: [
    '能用 System.out.printf 按给定格式输出整数、小数和字符串，并数清宽度与小数位',
    '能用 Scanner 从标准输入读取整数和整行文本，识破「nextInt 之后 nextLine 读到空串」的陷阱',
    '能解释标准输入重定向与命令行参数 args 的区别和用途',
    '能读懂 StdDraw 绘图代码，说清坐标系统，并解释递归分形的自相似结构与基线条件',
    '能用 Math.random() 生成指定范围的随机数，并用大量重复试验估计概率',
    '能诊断输入错位、格式符错配、空输入读取这三类 I/O bug'
  ],
  kp: [
    { id: 'ch05-1', title: 'printf 格式说明符' },
    { id: 'ch05-2', title: 'Scanner 读取标准输入' },
    { id: 'ch05-3', title: 'nextInt / nextLine 混用陷阱' },
    { id: 'ch05-8', title: 'StdIn/StdOut 与 Scanner 对照' },
    { id: 'ch05-4', title: '重定向与命令行参数' },
    { id: 'ch05-5', title: 'StdDraw 与坐标系统' },
    { id: 'ch05-6', title: '递归分形（树与科赫雪花）' },
    { id: 'ch05-7', title: '随机数与模拟' },
    { id: 'ch05-9', title: '输入输出 bug 的调试方法' },
    { id: 'ch05-12', title: '教材 §1.5：重定向、管道与过滤器' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '先看一个真实会发生的怪事：程序提示输入年龄、再输入姓名，你明明打了 <code>18</code> 和 <code>Alice</code>，' +
      '结果打印出来 <code>name=[]</code>——姓名是空的。以为输入没生效，其实第二行读到的只是"上一行剩下的换行符"。<br>' +
      '前四章的程序有个共同点：<b>输入是写死在代码里的，输出只是屏幕上的一行行字</b>。真实程序要跟外界交换数据——' +
      '从键盘或文件读入、按格式打印报表、把数字画成图形。这一章补上三块拼图：输入（input）、输出（output）、绘图（drawing）。' +
      '初学者最容易卡在四处：Scanner 的读取规则（空格和换行不是一回事）、printf 的格式符与参数必须一一对应、' +
      '绘图坐标系的 y 轴方向、以及随机数的范围公式。这四个坑，考试都爱考。'
    },

    { t: 'p', lead: true, html:
      '一个程序的能力，一半取决于它<b>算什么</b>，一半取决于它<b>怎么和外界说话</b>。' +
      'I/O 就是程序的嘴和耳朵：先让它能听见输入，再让它把结果说清楚。'
    },

    { t: 'code', caption: 'OpeningBug.java　stdin 已预置：18 换行 Alice——先看现象', stdin: '18\nAlice\n', trace: true, code:
`import java.util.Scanner;

public class OpeningBug {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        System.out.print("age: ");
        int age = in.nextInt();
        System.out.print("name: ");
        String name = in.nextLine();
        System.out.println("age=[" + age + "], name=[" + name + "]");
    }
}
` },

    { t: 'p', html:
      '输出是 <code>age=[18], name=[]</code>。第二行读到的不是 Alice，而是一个空串——因为 <code>nextInt()</code> ' +
      '只"吃掉"数字 <code>18</code>，行尾的换行符还留在输入缓冲区里；紧接着的 <code>nextLine()</code> 一看到换行符，' +
      '就认为"这一行结束了"，于是返回空串，而真正的 <code>Alice</code> 被推到了下一次读取。<br>' +
      '这个现象背后是 Scanner 的读取规则：<b>按"记号（token）"读时只看空白分隔，按"行"读时才把换行当终止符</b>。' +
      '本章第三节会给出完整的修复套路；在那之前，先记住一句话：<b>输入不是"你打了什么就读到什么"，而是"按规则切出来的下一个记号"</b>。'
    },

    { t: 'p', html:
      '本章路线：先学输出格式（一、printf）与输入读取（二、Scanner），再拆开最著名的输入陷阱（三）和教材口径的对照（四）；' +
      '接着是重定向与命令行参数（五）、StdDraw 绘图（六）、递归分形（七）、随机与模拟（八）；' +
      '第九节列边界与反例，第十节用三个真实 I/O bug 演示调试；最后用一个 60 行的完整案例（读入成绩单 → 统计 → 对齐输出）' +
      '把输入、输出、数组、方法串起来。'
    },

    { t: 'h', text: '一、printf：把输出排成表格', id: 'ch05-1' },

    { t: 'p', html:
      '用 <code>println</code> 打印，每个数字宽度不同，表格立刻歪掉。' +
      '<b>printf</b>（print formatted）把「格式」和「数据」分开：格式串里用 <code>%</code> 开头的' +
      '<b>格式说明符（format specifier）</b>当占位符，后面的参数按顺序填进去。' +
      '这样数字的对齐、小数位数只由格式串决定，跟数据本身多长无关。'
    },

    { t: 'table',
      head: ['格式符', '含义', '举例（参数 → 输出）'],
      rows: [
        ['<code>%d</code>', '十进制整数', '<code>42 → 42</code>'],
        ['<code>%6d</code>', '宽度 6、右对齐（不够补空格）', '<code>42 → "    42"</code>'],
        ['<code>%-6s</code>', '宽度 6、左对齐（负号）', '<code>"ab" → "ab    "</code>'],
        ['<code>%.2f</code>', '保留 2 位小数（会四舍五入）', '<code>3.14159 → 3.14</code>'],
        ['<code>%9.2f</code>', '总宽 9，其中 2 位小数', '<code>3.14159 → "     3.14"</code>'],
        ['<code>%n</code>', '换行（跨平台都正确）', '<code>printf("a%nb")</code> 输出两行'],
        ['<code>%%</code>', '输出一个字面上的 <code>%</code>', '<code>50%% → 50%</code>']
      ],
      caption: '格式串是「模板」，参数是「填充物」——个数和类型必须一一对应'
    },

    { t: 'p', html:
      '下面用一张价格表练手。注意 <code>%-10s</code> 让商品名左对齐，<code>%5d</code> 让数量右对齐，' +
      '<code>%10.2f</code> 给金额留出 10 格宽度——所以三行数据的小数点会整齐地排成一列。'
    },

    { t: 'code', caption: 'PriceTable.java　先预测每行输出，再点运行', code:
      'public class PriceTable {\n' +
      '    public static void main(String[] args) {\n' +
      '        String[] items = {"apple", "milk", "notebook"};\n' +
      '        int[] qty = {3, 1, 2};\n' +
      '        double[] price = {1.5, 12.0, 3.25};\n' +
      '        double total = 0;\n' +
      '\n' +
      '        System.out.printf("%-10s%5s%10s%n", "item", "qty", "subtotal");\n' +
      '        for (int i = 0; i < items.length; i++) {\n' +
      '            double sub = qty[i] * price[i];\n' +
      '            total += sub;\n' +
      '            System.out.printf("%-10s%5d%10.2f%n", items[i], qty[i], sub);\n' +
      '        }\n' +
      '        System.out.printf("%-10s%5s%10.2f%n", "TOTAL", "", total);\n' +
      '    }\n' +
      '}\n'
    },

    { t: 'callout', kind: 'warn', title: '格式符和参数对不上，运行时才崩', html:
      '<code>System.out.printf("%d", 3.5)</code> 会抛 <code>IllegalFormatConversionException</code>：' +
      '<code>%d</code> 只接受整数。参数个数少了也会报错。编译器<b>不检查</b>格式串里的内容，' +
      '所以这类错误要到运行时才暴露——考试给 printf 语句问输出时，第一件事就是把格式符和参数逐个配对。'
    },

    { t: 'code', caption: 'FormatLab.java　宽度、对齐、补零、精度一次看全', code:
`public class FormatLab {
    public static void main(String[] args) {
        String[] names = {"Alice", "Bob", "Christopher"};
        int[] scores = {92, 7, 100};
        double[] gpas = {3.5, 2.75, 4.0};

        System.out.printf("%-12s %5s %8s%n", "name", "score", "gpa");
        for (int i = 0; i < names.length; i++) {
            System.out.printf("%-12s %5d %8.2f%n", names[i], scores[i], gpas[i]);
        }
        System.out.printf("|%6d|%-6d|%06d|%n", 42, 42, 42);
        System.out.printf("|%8.3f|%-8.1f|%d|%n", 3.14159, 3.14159, 42);
        System.out.printf("percent: %d%%%n", 85);
        System.out.printf("sum = %.2f, avg = %.3f%n", 20.5, 6.8333);
    }
}
` },

    { t: 'p', html:
      '读这段程序的三个要点：① <b>宽度是"最小宽度"</b>——<code>%5d</code> 打印 7 会变成 <code>"    7"</code>，' +
      '但打印 100 就是 <code>"  100"</code>，超长数据会原样撑开、不会截断；② <b>负号表示左对齐</b>：' +
      '<code>%-12s</code> 让长名字也顶格写，所以三行的小数点能对齐；③ <b><code>%06d</code> 是补零</b>，' +
      '<code>%8.3f</code> 是"总宽 8、小数点后 3 位"。<br>' +
      '考试给 printf 语句问输出时，按"宽度 → 对齐 → 精度 → 换行"的顺序逐项数格子，比凭感觉快得多。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 格式符', html: '能给出一行 <code>printf</code> 的精确输出，包括空格数量与换行位置。' },
      { title: '检查点 · 类型匹配', html: '能说出 <code>%d</code> 配 int、<code>%f</code> 配 double、<code>%s</code> 配任意对象，配错会在运行时抛异常。' }
    ] },

    { t: 'h', text: '二、Scanner：从标准输入读数据', id: 'ch05-2' },

    { t: 'p', html:
      '<b>标准输入（standard input）</b>通常是键盘，程序用 <code>System.in</code> 表示它。' +
      '但 <code>System.in</code> 只能一个字节一个字节地读，太原始了。Java 用 <b>Scanner</b> 把它包装成一个' +
      '「能按类型读数据的对象」：先 <code>new Scanner(System.in)</code>，再用 <code>nextInt()</code> 读整数、' +
      '<code>nextDouble()</code> 读小数、<code>nextLine()</code> 读一整行。'
    },

    { t: 'code', caption: 'Average.java　stdin 已预置：70 80 91', stdin: '70 80 91\n', code:
      'import java.util.Scanner;\n' +
      '\n' +
      'public class Average {\n' +
      '    public static void main(String[] args) {\n' +
      '        Scanner in = new Scanner(System.in);\n' +
      '        int a = in.nextInt();\n' +
      '        int b = in.nextInt();\n' +
      '        int c = in.nextInt();\n' +
      '        double avg = (a + b + c) / 3.0;   // 3.0 而不是 3，避免整数除法\n' +
      '        System.out.printf("sum = %d, average = %.2f%n", a + b + c, avg);\n' +
      '    }\n' +
      '}\n'
    },

    { t: 'p', html:
      '<code>nextInt()</code> 的规则是：<b>跳过空白，读一个整数记号（token），读到非数字就停</b>。' +
      '它不会读走那个「停下来」的字符，更不会读走行尾的换行符。这个细节埋下了本课最著名的坑。'
    },

    { t: 'p', html:
      '如果不知道要读几个数，就不能写死 <code>nextInt()</code> 的次数。Scanner 提供了"还有没有下一个"的判断：' +
      '<code>hasNextInt()</code> / <code>hasNext()</code> 返回 boolean，配合 while 就能读到输入结束。' +
      '这也是 OJ（在线判题）里最常见的读法：题目给你一个数字列表，长度不固定，读完为止。'
    },

    { t: 'code', caption: 'ReadUntilSum.java　stdin 已预置：10 20 30 40（读到结束）', stdin: '10 20 30 40\n', code:
`import java.util.Scanner;

public class ReadUntilSum {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int sum = 0;
        int count = 0;
        while (in.hasNextInt()) {          // keep reading until there is no more input
            int x = in.nextInt();
            sum += x;
            count++;
        }
        System.out.println("count = " + count);
        System.out.println("sum   = " + sum);
        if (count > 0) {
            System.out.printf("avg   = %.2f%n", (double) sum / count);
        }
    }
}
` },

    { t: 'p', html:
      '两个细节：① <b>先判断再读</b>——<code>hasNextInt()</code> 只看不消费，判断为 true 才 <code>nextInt()</code>，' +
      '否则会抛 <code>NoSuchElementException</code>（没有更多输入）或 <code>InputMismatchException</code>（下一个不是整数）；' +
      '② <b>count 为 0 要单独处理</b>——没读到任何数时直接算平均会除零，所以先判 <code>count &gt; 0</code>。' +
      '这两条合起来，就是"健壮的输入循环"模板。'
    },

    { t: 'h', text: '三、最著名的坑：nextInt 之后 nextLine', id: 'ch05-3' },

    { t: 'p', html:
      '先读整数、再读一整行——很多人的第一反应是「这不就是两行代码吗」。运行下面这段程序，' +
      '你会看到 <code>name</code> 读到一个<b>空串</b>，而本来想读的名字被推到了下一次读取。'
    },

    { t: 'code', caption: 'Trap.java　stdin 已预置：18 换行 Alice', stdin: '18\nAlice\n', code:
      'import java.util.Scanner;\n' +
      '\n' +
      'public class Trap {\n' +
      '    public static void main(String[] args) {\n' +
      '        Scanner in = new Scanner(System.in);\n' +
      '        int age = in.nextInt();          // 只吃掉 18，行尾换行符还留在缓冲区\n' +
      '        String name = in.nextLine();     // 立刻返回空串（剩下的是换行）\n' +
      '        System.out.println("age = " + age + ", name = [" + name + "]");\n' +
      '        System.out.println("second read = [" + in.nextLine() + "]");\n' +
      '    }\n' +
      '}\n'
    },

    { t: 'compare', left: {
      title: '直接读：name 变成空串',
      html: '<code>nextInt()</code> 只消费数字，行尾换行还留在缓冲区，紧接着的 <code>nextLine()</code> 立刻返回空串。',
      code: 'int age = in.nextInt();\nString name = in.nextLine();   // name = ""'
    }, right: {
      title: '补一次 nextLine 吃掉换行',
      html: '先空读一行把残留的换行消费掉，再读到的才是真正的姓名。',
      code: 'int age = in.nextInt();\nin.nextLine();                // 吃掉换行\nString name = in.nextLine();   // name = "Alice"'
    } },

    { t: 'p', html:
      '修复办法是在 <code>nextInt()</code> 之后补一句 <code>in.nextLine()</code>，把残留的换行「吃掉」，' +
      '再读真正的那一行。下面的程序还顺便演示了「读入多行、拆出字段、存进数组」的完整套路：' +
      '每行格式是「姓名 分数」，用 <code>split(" ")</code> 切成两段，第一段当字符串、第二段用 ' +
      '<code>Integer.parseInt</code> 转成整数。'
    },

    { t: 'p', html:
      '上面这套"读 n → 吃掉换行 → 循环读 n 行 → 拆字段"的流程，是整门课最实用的输入模板。' +
      '它在下一节的完整案例里会被写成一个 60 行的成绩单程序（含表格输出与等级统计）；' +
      '现在只要记住两步：<b>读数字之后紧跟的一次 <code>nextLine()</code> 是"清缓冲"，不是"读数据"</b>；' +
      '<b>每行数据用 <code>split</code> 拆成字段再分别转换</b>。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · nextInt→nextLine', html: '能预测一段"先读整数再读整行"的程序输出，并写出修复代码。' },
      { title: '检查点 · 多行输入', html: '能写出"读 n 行、每行拆字段"的循环，并解释为什么要先 nextLine 清缓冲。' }
    ] },

    { t: 'h', text: '四、教材的 StdIn / StdOut 与 Scanner 对照', id: 'ch05-8' },

    { t: 'p', html:
      '课程推荐教材（Sedgewick《Computer Science: An Interdisciplinary Approach》）没有用 JDK 的 <code>Scanner</code>，' +
      '而是自带了一对更简单的类：<code>StdIn</code> 和 <code>StdOut</code>。' +
      '它们的方法都是 <code>static</code>，不需要 <code>new</code>：<code>StdOut.println(x)</code> 相当于 ' +
      '<code>System.out.println(x)</code>，<code>StdIn.readInt()</code> 相当于 <code>Scanner</code> 的 <code>nextInt()</code>。' +
      '教材里那句经典的 <code>while (!StdIn.isEmpty())</code>，意思就是"只要还有输入就读下去"——' +
      '和 <code>while (in.hasNextInt())</code> 是同一个想法。'
    },

    { t: 'compare', left: {
      title: 'Scanner + System.out（本站可运行）',
      html: 'JDK 标准库。先 <code>new Scanner(System.in)</code> 造读写器，再用 <code>nextInt()</code> 按类型读；' +
        '读整行用 <code>nextLine()</code>，判断还有没有输入用 <code>hasNextInt()</code>。',
      code: 'Scanner in = new Scanner(System.in);\nint n = in.nextInt();\nString line = in.nextLine();\nSystem.out.println(n + " " + line);'
    }, right: {
      title: 'StdIn + StdOut（教材写法）',
      html: '教材自带的静态类，不用 import 也不用 new；读到输入结束为止用 <code>StdIn.isEmpty()</code> 判断。' +
        '<b>本站解释器不加载这组库，所以不能直接运行</b>。',
      code: 'int n = StdIn.readInt();\nString line = StdIn.readLine();\nStdOut.println(n + " " + line);'
    } },

    { t: 'p', html:
      '判据：<b>看题面写的是哪套类名</b>。卷面出现 <code>StdIn</code> / <code>StdOut</code>，就按教材口径回答；' +
      '出现 <code>Scanner</code> / <code>System.out</code>，就按 JDK 口径回答。' +
      '两套考的其实是同一件事：按类型读输入、处理 <code>nextInt</code> 之后的空行陷阱、以及"读到输入结束"的循环条件。' +
      '本站正文与实验台统一使用 Scanner 版本，翻译时逐行替换类名与方法名即可。'
    },

    { t: 'lab', id: 'array' },

    { t: 'h', text: '五、重定向与命令行参数', id: 'ch05-4' },

    { t: 'p', html:
      '如果每次都靠键盘输入，程序就没法自动测试：同样的输入要手打一遍。' +
      '标准输入/输出本质是两条<b>流（stream）</b>，可以接到文件上：<br>' +
      '<code>java Average &lt; numbers.txt</code>　从文件读输入（重定向，redirection）<br>' +
      '<code>java PriceTable &gt; report.txt</code>　把输出写进文件<br>' +
      '<code>java Average &lt; in.txt &gt; out.txt</code>　两头都接文件<br>' +
      '同一份程序，接键盘就是交互式，接文件就是批量可复现。课程作业和在线判题（OJ）都靠这个机制喂数据。'
    },

    { t: 'p', html:
      '另一条入口是<b>命令行参数（command-line arguments）</b>：<code>java SumArgs 3 7 12</code> 里的 ' +
      '<code>3 7 12</code> 会被装进 <code>main</code> 的 <code>args</code> 数组。注意它们<b>全是字符串</b>，' +
      '想当数字用必须 <code>Integer.parseInt</code>。'
    },

    { t: 'code', caption: 'SumArgs.java　args 已预置：3 7 12（点「单步」逐行看）', args: ['3', '7', '12'], trace: true, code:
      'public class SumArgs {\n' +
      '    public static void main(String[] args) {\n' +
      '        int sum = 0;\n' +
      '        for (int i = 0; i < args.length; i++) {\n' +
      '            int value = Integer.parseInt(args[i]);\n' +
      '            sum = sum + value;\n' +
      '        }\n' +
      '        System.out.println("args.length = " + args.length);\n' +
      '        System.out.println("sum = " + sum);\n' +
      '    }\n' +
      '}\n'
    },

    { t: 'lab', id: 'trace' },

    { t: 'callout', kind: 'tip', title: '单步时盯这三个量', html:
      '点上面的「单步」，观察 <code>i</code>、<code>args[i]</code>、<code>sum</code> 三者怎么一起变：' +
      '<code>i</code> 从 0 走到 2，<code>args[i]</code> 依次是 <code>"3" "7" "12"</code>（字符串），' +
      '<code>sum</code> 依次是 3、10、22。<b>循环变量、数组元素、累加器</b>是读任何循环代码的固定三件套。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · args', html: '能说出 <code>args</code> 里装的全是字符串、用前必须 <code>Integer.parseInt</code>，且 <code>args.length</code> 可能为 0。' },
      { title: '检查点 · 重定向', html: '能区分"程序里写 Scanner 读输入"和"命令行用 <code>&lt;</code> 把文件接到标准输入"。' }
    ] },

    { t: 'h', text: '六、StdDraw 与坐标系：先定比例，再画图', id: 'ch05-5' },

    { t: 'p', html:
      '课程用 Princeton 的 <b>StdDraw</b> 库把数字变成图形。它的核心思想是<b>把「画什么」和「画在哪」分开</b>：' +
      '先设定坐标系，再调用点、线、圆。默认画布是 0.0–1.0 的正方形，用 <code>setScale(min, max)</code> 可以换成任意范围；' +
      '<b>y 轴朝上</b>（数学坐标系），这和屏幕像素坐标「y 轴朝下」正好相反，是初学者最常翻车的地方。'
    },

    { t: 'code', caption: 'DrawBasics.java　绘画基础（静态展示）', run: false, code:
      'import edu.princeton.cs.algs4.StdDraw;\n' +
      '\n' +
      'public class DrawBasics {\n' +
      '    public static void main(String[] args) {\n' +
      '        StdDraw.setScale(0, 10);              // 左下角 (0,0)，右上角 (10,10)\n' +
      '\n' +
      '        StdDraw.setPenRadius(0.01);           // 线宽（相对画布尺寸）\n' +
      '        StdDraw.line(0, 0, 10, 10);\n' +
      '        StdDraw.line(0, 10, 10, 0);\n' +
      '\n' +
      '        StdDraw.setPenColor(StdDraw.RED);\n' +
      '        StdDraw.filledCircle(5, 5, 2.5);     // 圆心 (5,5)，半径 2.5\n' +
      '\n' +
      '        StdDraw.setPenColor(StdDraw.BLUE);\n' +
      '        StdDraw.setPenRadius(0.02);\n' +
      '        StdDraw.point(2, 8);                  // 画一个点\n' +
      '        StdDraw.text(8, 2, "hello");          // 在指定位置写字\n' +
      '    }\n' +
      '}\n'
    },

    { t: 'callout', kind: 'note', title: '关于本站的绘图代码', html:
      '本站没有加载绘图库，所以绘图块<b>没有「运行」按钮，只有静态代码</b>。' +
      '但语法与逻辑和课程完全一致——绘图在 本课程里考的是<b>读代码推结果</b>和<b>补全递归条件</b>，' +
      '不需要真的把图画出来。读绘图代码时盯三件事：坐标系、每次调用的参数、递归的终止条件。'
    },

    { t: 'p', html:
      '本站已上线一个 <b>Canvas 版 StdDraw 实验台</b>：打开 <a href="#/labs/stddraw">实验台 · StdDraw</a> 可以按图元逐条查看坐标与效果，' +
      '虽然它不是真的 algs4 库，但坐标系方向、<code>line</code> / <code>circle</code> / <code>text</code> 的参数语义与课程一致。' +
      '正文里的绘图代码统一标 <b>静态展示（run:false）</b>，因为运行时需要 <code>edu.princeton.cs.algs4.StdDraw</code>；' +
      '考试也不要求你真的跑出图，只要求<b>读出坐标系与参数、推出画了几条线</b>。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 坐标', html: '能说出 StdDraw 原点在左下角、y 轴朝上，<code>setScale(0,10)</code> 后 (5,5) 在正中心。' },
      { title: '检查点 · 图元参数', html: '能按 <code>line(x1,y1,x2,y2)</code>、<code>circle(x,y,r)</code>、<code>text(x,y,s)</code> 说出每个参数的顺序。' }
    ] },

    { t: 'h', text: '七、递归分形：用很短的代码画很复杂的图', id: 'ch05-6' },

    { t: 'p', html:
      '<b>分形（fractal）</b>是「局部和整体相似」的图形：雪花的一角放大后还是雪花，树枝上再长树枝。' +
      '生成它的方式不是画一万条线段，而是定一条规则、反复作用在更小的尺度上——这正是' +
      '<b>递归（recursion）</b>的思想：方法调用自己，但每次处理的问题更小。'
    },

    { t: 'svg', html: "<svg viewBox=\"0 0 700 340\" role=\"img\" aria-label=\"递归树与科赫雪花示意图\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"0\" y=\"0\" width=\"700\" height=\"340\" fill=\"var(--bg2)\" rx=\"12\"/><line x1=\"350\" y1=\"20\" x2=\"350\" y2=\"310\" stroke=\"var(--line2)\" stroke-dasharray=\"4 6\"/><text x=\"170\" y=\"30\" text-anchor=\"middle\" fill=\"var(--text2)\" font-size=\"17\" font-weight=\"600\">递归树</text><path d=\"M170.0 296.0L170.0 222.0\" fill=\"none\" stroke=\"var(--accent)\" stroke-opacity=\"0.91\" stroke-width=\"2.23\" stroke-linecap=\"round\"/><path d=\"M170.0 222.0L146.5 171.7M170.0 222.0L193.5 171.7\" fill=\"none\" stroke=\"var(--accent)\" stroke-opacity=\"0.80\" stroke-width=\"1.95\" stroke-linecap=\"round\"/><path d=\"M146.5 171.7L114.7 144.9M146.5 171.7L146.5 130.1M193.5 171.7L193.5 130.1M193.5 171.7L225.3 144.9\" fill=\"none\" stroke=\"var(--accent)\" stroke-opacity=\"0.68\" stroke-width=\"1.67\" stroke-linecap=\"round\"/><path d=\"M114.7 144.9L84.5 136.9M114.7 144.9L101.5 116.7M146.5 130.1L133.4 101.8M146.5 130.1L159.7 101.8M193.5 130.1L180.3 101.8M193.5 130.1L206.6 101.8M225.3 144.9L238.5 116.7M225.3 144.9L255.5 136.9\" fill=\"none\" stroke=\"var(--accent)\" stroke-opacity=\"0.57\" stroke-width=\"1.39\" stroke-linecap=\"round\"/><path d=\"M84.5 136.9L61.4 140.9M84.5 136.9L66.6 121.8M101.5 116.7L83.5 101.6M101.5 116.7L101.5 93.2M133.4 101.8L115.4 86.7M133.4 101.8L133.4 78.4M159.7 101.8L159.7 78.4M159.7 101.8L177.7 86.7M180.3 101.8L162.3 86.7M180.3 101.8L180.3 78.4M206.6 101.8L206.6 78.4M206.6 101.8L224.6 86.7M238.5 116.7L238.5 93.2M238.5 116.7L256.5 101.6M255.5 136.9L273.4 121.8M255.5 136.9L278.6 140.9\" fill=\"none\" stroke=\"var(--accent)\" stroke-opacity=\"0.45\" stroke-width=\"1.11\" stroke-linecap=\"round\"/><path d=\"M61.4 140.9L47.1 151.0M61.4 140.9L44.5 136.4M66.6 121.8L49.6 117.3M66.6 121.8L59.1 105.9M83.5 101.6L66.6 97.1M83.5 101.6L76.1 85.7M101.5 93.2L94.0 77.3M101.5 93.2L108.9 77.3M115.4 86.7L98.5 82.2M115.4 86.7L108.0 70.8M133.4 78.4L125.9 62.5M133.4 78.4L140.8 62.5M159.7 78.4L152.3 62.5M159.7 78.4L167.2 62.5M177.7 86.7L185.1 70.8M177.7 86.7L194.6 82.2M162.3 86.7L145.4 82.2M162.3 86.7L154.9 70.8M180.3 78.4L172.8 62.5M180.3 78.4L187.7 62.5M206.6 78.4L199.2 62.5M206.6 78.4L214.1 62.5M224.6 86.7L232.0 70.8M224.6 86.7L241.5 82.2M238.5 93.2L231.1 77.3M238.5 93.2L246.0 77.3M256.5 101.6L263.9 85.7M256.5 101.6L273.4 97.1M273.4 121.8L280.9 105.9M273.4 121.8L290.4 117.3M278.6 140.9L295.5 136.4M278.6 140.9L292.9 151.0\" fill=\"none\" stroke=\"var(--accent)\" stroke-opacity=\"0.34\" stroke-width=\"0.83\" stroke-linecap=\"round\"/><text x=\"525\" y=\"30\" text-anchor=\"middle\" fill=\"var(--text2)\" font-size=\"17\" font-weight=\"600\">科赫雪花</text><path d=\"M525.0 62.0L528.5 68.0L535.4 68.0L531.9 74.0L535.4 80.0L542.3 80.0L545.8 74.0L549.2 80.0L556.2 80.0L552.7 86.0L556.2 92.0L549.2 92.0L545.8 98.0L549.2 104.0L556.2 104.0L552.7 110.0L556.2 116.0L563.1 116.0L566.6 110.0L570.0 116.0L577.0 116.0L580.4 110.0L577.0 104.0L583.9 104.0L587.4 98.0L590.8 104.0L597.7 104.0L594.3 110.0L597.7 116.0L604.7 116.0L608.1 110.0L611.6 116.0L618.5 116.0L615.1 122.0L618.5 128.0L611.6 128.0L608.1 134.0L611.6 140.0L618.5 140.0L615.1 146.0L618.5 152.0L611.6 152.0L608.1 158.0L604.7 152.0L597.7 152.0L594.3 158.0L597.7 164.0L590.8 164.0L587.4 170.0L590.8 176.0L597.7 176.0L594.3 182.0L597.7 188.0L604.7 188.0L608.1 182.0L611.6 188.0L618.5 188.0L615.1 194.0L618.5 200.0L611.6 200.0L608.1 206.0L611.6 212.0L618.5 212.0L615.1 218.0L618.5 224.0L611.6 224.0L608.1 230.0L604.7 224.0L597.7 224.0L594.3 230.0L597.7 236.0L590.8 236.0L587.4 242.0L583.9 236.0L577.0 236.0L580.4 230.0L577.0 224.0L570.0 224.0L566.6 230.0L563.1 224.0L556.2 224.0L552.7 230.0L556.2 236.0L549.2 236.0L545.8 242.0L549.2 248.0L556.2 248.0L552.7 254.0L556.2 260.0L549.2 260.0L545.8 266.0L542.3 260.0L535.4 260.0L531.9 266.0L535.4 272.0L528.5 272.0L525.0 278.0L521.5 272.0L514.6 272.0L518.1 266.0L514.6 260.0L507.7 260.0L504.2 266.0L500.8 260.0L493.8 260.0L497.3 254.0L493.8 248.0L500.8 248.0L504.2 242.0L500.8 236.0L493.8 236.0L497.3 230.0L493.8 224.0L486.9 224.0L483.4 230.0L480.0 224.0L473.0 224.0L469.6 230.0L473.0 236.0L466.1 236.0L462.6 242.0L459.2 236.0L452.3 236.0L455.7 230.0L452.3 224.0L445.3 224.0L441.9 230.0L438.4 224.0L431.5 224.0L434.9 218.0L431.5 212.0L438.4 212.0L441.9 206.0L438.4 200.0L431.5 200.0L434.9 194.0L431.5 188.0L438.4 188.0L441.9 182.0L445.3 188.0L452.3 188.0L455.7 182.0L452.3 176.0L459.2 176.0L462.6 170.0L459.2 164.0L452.3 164.0L455.7 158.0L452.3 152.0L445.3 152.0L441.9 158.0L438.4 152.0L431.5 152.0L434.9 146.0L431.5 140.0L438.4 140.0L441.9 134.0L438.4 128.0L431.5 128.0L434.9 122.0L431.5 116.0L438.4 116.0L441.9 110.0L445.3 116.0L452.3 116.0L455.7 110.0L452.3 104.0L459.2 104.0L462.6 98.0L466.1 104.0L473.0 104.0L469.6 110.0L473.0 116.0L480.0 116.0L483.4 110.0L486.9 116.0L493.8 116.0L497.3 110.0L493.8 104.0L500.8 104.0L504.2 98.0L500.8 92.0L493.8 92.0L497.3 86.0L493.8 80.0L500.8 80.0L504.2 74.0L507.7 80.0L514.6 80.0L518.1 74.0L514.6 68.0L521.5 68.0L525.0 62.0Z\" fill=\"var(--accentSoft)\" fill-opacity=\"0.5\" stroke=\"var(--accent2)\" stroke-width=\"1.1\" stroke-linejoin=\"round\"/></svg>", caption:
      '左：递归树（depth 6）——每一级把长度乘 0.75、分叉 ±25°；右：科赫雪花（depth 3）——每条线段折成 4 段，' +
      '共 3 × 4³ = 192 段。两幅图都只用了同一条规则反复递归。'
    },

    { t: 'p', html:
      '科赫曲线的规则可以用一句话说清：<b>把一条线段三等分，中间那段替换成等边三角形的两条边</b>。' +
      '一条边变 4 条边；重复 n 次就是 4<sup>n</sup> 条。递归树更简单：每根树枝长出新枝，长度变短、方向偏一点。' +
      '下面这棵树的代码只有十几行，却画出了上百条线。'
    },

    { t: 'code', caption: 'RecursiveTree.java　递归树（静态展示）', run: false, code:
      'import edu.princeton.cs.algs4.StdDraw;\n' +
      '\n' +
      'public class RecursiveTree {\n' +
      '    // 从 (x,y) 出发，朝 angle 方向画一棵 depth 层的树\n' +
      '    public static void branch(double x, double y, double angle, double len, int depth) {\n' +
      '        if (depth == 0) return;                  // 基线条件：不再分叉\n' +
      '\n' +
      '        double x2 = x + len * Math.cos(angle);\n' +
      '        double y2 = y + len * Math.sin(angle);\n' +
      '        StdDraw.line(x, y, x2, y2);              // 先画这一根树干\n' +
      '\n' +
      '        double len2 = len * 0.75;                // 问题缩小：更短\n' +
      '        branch(x2, y2, angle - Math.PI / 7, len2, depth - 1);   // 左枝\n' +
      '        branch(x2, y2, angle + Math.PI / 7, len2, depth - 1);   // 右枝\n' +
      '    }\n' +
      '\n' +
      '    public static void main(String[] args) {\n' +
      '        StdDraw.setScale(0, 1);\n' +
      '        StdDraw.setPenRadius(0.005);\n' +
      '        branch(0.5, 0.08, Math.PI / 2, 0.28, 7); // 从底部中心向上长\n' +
      '    }\n' +
      '}\n'
    },

    { t: 'p', html:
      '读递归代码只需看三个地方：<b>①基线条件</b>（<code>depth == 0</code> 就停止）、' +
      '<b>②问题怎么缩小</b>（长度 ×0.75，层数 −1）、<b>③递归调用几次</b>（这里两次 → 每层数量翻倍）。' +
      '深度 7 的树共有 2<sup>7</sup>−1 = 127 根树枝，不用画出来也能算清。'
    },

    { t: 'code', caption: 'Koch.java　科赫雪花（静态展示）', run: false, code:
`import edu.princeton.cs.algs4.StdDraw;

public class Koch {
    // draw line (x1,y1)-(x2,y2) using the Koch rule of level n
    static void koch(int n, double x1, double y1, double x2, double y2) {
        if (n == 0) {                            // base case: just a line
            StdDraw.line(x1, y1, x2, y2);
            return;
        }
        double dx = x2 - x1;
        double dy = y2 - y1;
        double xA = x1 + dx / 3.0;               // the two trisection points
        double yA = y1 + dy / 3.0;
        double xB = x1 + dx * 2.0 / 3.0;
        double yB = y1 + dy * 2.0 / 3.0;
        double xC = (x1 + x2) / 2.0 + dy * Math.sqrt(3) / 6.0;   // tip of the bump
        double yC = (y1 + y2) / 2.0 - dx * Math.sqrt(3) / 6.0;

        koch(n - 1, x1, y1, xA, yA);             // four smaller segments
        koch(n - 1, xA, yA, xC, yC);
        koch(n - 1, xC, yC, xB, yB);
        koch(n - 1, xB, yB, x2, y2);
    }

    public static void main(String[] args) {
        StdDraw.setScale(0, 1);
        koch(3, 0.1, 0.5, 0.9, 0.5);             // level 3 gives 4^3 = 64 segments
    }
}
` },

    { t: 'p', html:
      '对比两段代码，递归结构的"三件套"完全一样：<b>基线条件</b>（<code>n == 0</code> / <code>depth == 0</code>）、' +
      '<b>缩小方式</b>（<code>n - 1</code> / <code>depth - 1</code>，同时长度变短）、' +
      '<b>递归次数</b>（科赫 4 次、树 2 次）。科赫的段数是 <code>4<sup>n</sup></code>，树是 <code>2<sup>depth</sup>−1</code>——' +
      '这类"数量公式"正是考试读递归绘图题时最爱问的。<br>' +
      '注意 <code>xC / yC</code> 的推导：中间凸起的顶点在"中垂线"上，高度是边长的 <code>√3/6</code>。' +
      '不用背公式，只要知道它用到了 <code>Math.sqrt</code> 和坐标平移，考试通常会给注释。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 段数公式', html: '能说出递归树 d 层有 <code>2<sup>d</sup>−1</code> 条线、科赫 n 级有 <code>4<sup>n</sup></code> 段。' },
      { title: '检查点 · 找 bug', html: '给一段递归绘图代码，能指出"基线条件缺失"或"参数没变小"导致的栈溢出。' }
    ] },

    { t: 'callout', kind: 'warn', title: '递归不收敛 = 栈溢出', html:
      '如果忘了写 <code>if (depth == 0) return;</code>，或者递归调用时传的仍是 <code>depth</code> 而不是 ' +
      '<code>depth - 1</code>，方法会永远调用自己，JVM 的调用栈被撑爆，抛出 <code>StackOverflowError</code>。' +
      '「找出递归代码的 bug」是本章最典型的考试题，第一眼就看基线条件和参数有没有变小。'
    },

    { t: 'h', text: '八、随机数与模拟：让程序做实验', id: 'ch05-7' },

    { t: 'p', html:
      '<code>Math.random()</code> 返回一个 <code>[0.0, 1.0)</code> 之间的 double。要生成 <code>[min, max]</code> ' +
      '的随机整数，套这个公式：<b><code>(int)(Math.random() * (max - min + 1)) + min</code></b>。' +
      '为什么乘 <code>max - min + 1</code>：把 [0,1) 拉伸成 [0, max−min+1)，取整后正好覆盖 0 到 max−min 这 ' +
      'max−min+1 个整数，再加 min 就整体平移到位。'
    },

    { t: 'code', caption: 'Dice.java　掷 6000 次骰子，看频率是否接近 1/6', code:
      'public class Dice {\n' +
      '    public static void main(String[] args) {\n' +
      '        int[] count = new int[6];        // count[0] 记 1 点出现的次数\n' +
      '        int trials = 6000;\n' +
      '        for (int i = 0; i < trials; i++) {\n' +
      '            int face = (int) (Math.random() * 6) + 1;   // 1 ~ 6\n' +
      '            count[face - 1]++;\n' +
      '        }\n' +
      '        for (int face = 1; face <= 6; face++) {\n' +
      '            System.out.printf("%d: %6.2f%%%n", face, 100.0 * count[face - 1] / trials);\n' +
      '        }\n' +
      '    }\n' +
      '}\n'
    },

    { t: 'callout', kind: 'tip', title: '随机 ≠ 随便', html:
      '单次结果无法预测，但<b>大量重复后频率会稳定在概率附近</b>——这就是「模拟（simulation）」的基础，' +
      '也是后面用实验估算复杂度的思路。调试随机程序时先把 <code>trials</code> 调小（比如 20），' +
      '否则屏幕上几千行输出会让你找不到问题。'
    },

    { t: 'p', html:
      '再做一个更"有用"的实验：用随机点估算 π。在 1×1 的正方形里随机撒点，落在四分之一圆内的比例应该接近 π/4，' +
      '乘 4 就是 π 的估计。这个方法的误差随试验次数增加而减小（大约按 <code>1/√n</code> 缩小），' +
      '它演示了"模拟（simulation）"的核心：<b>用大量随机试验逼近一个确定的数</b>。'
    },

    { t: 'code', caption: 'MonteCarloPi.java　撒点估 π（输出随运行变化）', code:
`public class MonteCarloPi {
    public static void main(String[] args) {
        int trials = 100000;
        int inside = 0;
        for (int i = 0; i < trials; i++) {
            double x = Math.random();
            double y = Math.random();
            if (x * x + y * y <= 1.0) {      // inside the quarter circle
                inside++;
            }
        }
        double pi = 4.0 * inside / trials;
        System.out.printf("trials = %d%n", trials);
        System.out.printf("inside = %d%n", inside);
        System.out.printf("pi estimate = %.4f%n", pi);
        System.out.printf("error = %.4f%n", Math.abs(pi - Math.PI));
    }
}
` },

    { t: 'p', html:
      '每次运行输出都不一样（<code>inside</code> 会波动几十个），但 <code>pi estimate</code> 总是稳定在 3.14 附近。' +
      '这正是蒙特卡洛方法的特征：<b>单次结果随机，多次重复后收敛</b>。' +
      '调试这类程序时把 <code>trials</code> 调小（比如 1000），输出一眼就能看完；' +
      '要复现问题，可以先把 <code>Math.random()</code> 换成固定的测试数据。' +
      '另外注意 <code>Math.abs(pi - Math.PI)</code>：<code>Math.PI</code> 是 JDK 自带的高精度常量，用来算误差。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 随机范围', html: '能写出生成 <code>[1, 100]</code> 随机整数的表达式，并说明为什么要 <code>+1</code>。' },
      { title: '检查点 · 模拟', html: '能解释"单次随机、多次收敛"，并说出为什么模拟结果不能写死成常量。' }
    ] },

    { t: 'terms', cols: 2, items: [
      { en: 'standard input', zh: '标准输入', html: '程序默认的输入来源，通常是键盘；Java 里用 <code>System.in</code> 表示。' },
      { en: 'standard output', zh: '标准输出', html: '程序默认的输出目标，通常是终端屏幕；Java 里用 <code>System.out</code> 表示。' },
      { en: 'redirection', zh: '重定向', html: '把标准输入 / 输出接到文件上：<code>java Q &lt; in.txt</code>、<code>java Q &gt; out.txt</code>。' },
      { en: 'command-line arguments', zh: '命令行参数', html: '运行程序时写在类名后面的参数，全部以字符串装进 <code>args</code> 数组。' },
      { en: 'token', zh: '记号', html: '<code>Scanner</code> 按空白切分的读取单位，可以是一个单词或一个数字。' },
      { en: 'format specifier', zh: '格式说明符', html: '<code>%d %s %f %.2f %n</code> 这类占位符，决定 printf 怎么排版。' },
      { en: 'StdDraw', zh: '标准绘图库', html: '教材配套的绘图库，坐标原点在左下角、y 轴朝上。' }
    ] },

    { t: 'h', text: '九、边界与反例：六个常见误解' },

    { t: 'table',
      head: ['说法 / 场景', '真相', '怎么记'],
      rows: [
        ['<code>nextInt()</code> 之后直接 <code>nextLine()</code> 能读到下一行', '错，读到的是上一行残留的换行，返回空串', '先空读一次 nextLine 清缓冲'],
        ['<code>printf</code> 的宽度会把超长数据截断', '不会。宽度是<b>最小</b>宽度，超长数据原样撑开', '宽度是下限，不是上限'],
        ['<code>args[0]</code> 可以直接当整数用', '错。args 全是 String，必须 <code>Integer.parseInt</code>', '命令行参数永远是字符串'],
        ['<code>&lt;</code> 重定向要写在 Java 代码里', '错。重定向是命令行的事：<code>java Q &lt; in.txt</code>', '代码里只有 Scanner'],
        ['<code>Math.random()</code> 能返回 1.0', '不会，范围是 <code>[0.0, 1.0)</code>，右端取不到', '乘 6 后最大是 5.999…'],
        ['递归绘图忘了 <code>depth == 0</code> 只是少画几条', '<b>会无限递归</b>，最终抛 <code>StackOverflowError</code>', '基线条件是保命的']
      ],
      caption: '这六条覆盖了期中卷面上 I/O 与绘图类的判断题和找 bug 题'
    },

    { t: 'p', html:
      '再补两个边界：① <b>空输入</b>——判题系统可能给一个空文件，直接 <code>nextInt()</code> 会抛异常，' +
      '所以读之前先 <code>hasNextInt()</code> 判断；② <b>输入格式不符</b>——该给数字却给了字母，' +
      '<code>nextInt()</code> 抛 <code>InputMismatchException</code>，这个 token 不会被消费，程序如果继续读会一直卡在同一个 token 上。'
    },

    { t: 'h', text: '十、调试实录：三个输入输出 bug', id: 'ch05-9' },

    { t: 'p', html:
      'I/O bug 的共同特点是：<b>程序不崩，但读到的数据和你想的不一样</b>。调试它们有一套固定流程，' +
      '不要靠"再运行一次看看"：① 先确认"到底读到了什么"（把读到的值立刻打印出来，用方括号包住，空串与新行一目了然）；' +
      '② 再对照输入的实际字节（空格、制表符、换行都算分隔）；③ 最后只改一处并重跑。'
    },

    { t: 'steps', items: [
      { title: '先打印读到的值', html: '用 <code>"[" + s + "]"</code> 打印，空串会显示成 <code>[]</code>，末尾空格也看得见。' },
      { title: '再数输入里的空白', html: 'Scanner 按"记号"切分：空格、Tab、换行都算分隔符；<code>nextLine</code> 才把换行当终止。' },
      { title: '最后只改一处', html: '一次只加一个 <code>in.nextLine()</code> 或改一个格式符，跑一遍确认，避免越改越乱。' }
    ] },

    { t: 'h', lvl: 3, text: '案例 1：读数字之后直接读整行' },

    { t: 'p', html:
      '就是本章开头那个现象：<code>int age = in.nextInt(); String name = in.nextLine();</code>，' +
      '结果 <code>name</code> 是空串。定位过程：打印 <code>"[" + name + "]"</code> 看到 <code>[]</code>，' +
      '说明读到的确实是空串而不是 null；回看输入 <code>18</code> 后面紧跟换行，而 <code>nextInt</code> 只消费了数字；' +
      '于是结论是"换行符还在缓冲区"。修复：在 <code>nextInt()</code> 之后补一行 <code>in.nextLine();</code>。' +
      '这个修复是"清缓冲"，不是"读数据"——所以它不接收返回值。'
    },

    { t: 'p', html:
      '更稳的写法是<b>统一用 nextLine 读、再自己解析</b>：先 <code>String line = in.nextLine()</code>，' +
      '再 <code>Integer.parseInt(line.trim())</code>。这样完全绕开"记号 vs 行"的混合陷阱，' +
      '代价是要自己处理转换异常。两种风格都可以，但不要在同一个循环里混用。'
    },

    { t: 'h', lvl: 3, text: '案例 2：格式符与参数类型不匹配' },

    { t: 'p', html:
      '第二个 bug 会抛异常，好查一些：<code>System.out.printf("%d", 3.5)</code> 抛 ' +
      '<code>IllegalFormatConversionException</code>——<code>%d</code> 只接受整数，却给了 double。' +
      '编译器不检查格式串（它只是普通字符串），所以这类错误要到运行时才暴露。<br>' +
      '定位方法：把格式串和参数按顺序<b>逐个配对</b>，确认 <code>%d</code>↔int、<code>%f</code>↔double、' +
      '<code>%s</code>↔任意引用类型、<code>%c</code>↔char、<code>%b</code>↔boolean。' +
      '参数个数也要对齐：少了会抛 <code>MissingFormatArgumentException</code>，多了则多余参数被忽略。'
    },

    { t: 'h', lvl: 3, text: '案例 3：空输入直接读，抛 NoSuchElementException' },

    { t: 'p', html:
      '第三个 bug 在本地跑不出来、一交到 OJ 就崩：输入文件是空的，程序却直接 <code>nextInt()</code>，' +
      'Scanner 找不到任何记号，抛 <code>NoSuchElementException</code>。修复是在读之前判断：' +
      '<code>if (in.hasNextInt()) { ... } else { 打印提示或直接返回 }</code>。' +
      '这个习惯在真实项目里同样重要——<b>永远不要假设输入一定存在、一定合法</b>。'
    },

    { t: 'code', caption: 'DebugCase05.java　三个修复合起来看（stdin 预置 18 / Alice）', stdin: '18\nAlice\n', code:
`import java.util.Scanner;

public class DebugCase05 {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);

        int age = in.nextInt();
        in.nextLine();                       // fix 1: consume the leftover newline
        String name = in.nextLine();
        System.out.println("age=" + age + ", name=" + name);

        System.out.printf("%-6s %5d %8.2f%n", "score", 92, 3.75);   // fix 2: types match

        if (in.hasNextInt()) {               // fix 3: check before reading
            System.out.println("next int = " + in.nextInt());
        } else {
            System.out.println("no more input");
        }
    }
}
` },

    { t: 'keypoint', items: [
      { title: '检查点 · 三个 bug', html: '能说出"空串 / 格式符异常 / NoSuchElementException"各自的根因与修复。' },
      { title: '检查点 · 调试习惯', html: '读输入后先打印 <code>"[" + 值 + "]"</code> 确认到底读到了什么。' }
    ] },

    { t: 'h', text: '十一、完整案例 A：成绩单读取与统计', id: 'ch05-10' },

    { t: 'p', html:
      '把本章所有输入输出知识用在一个真实任务上：从标准输入读学生成绩单，统计平均分、最高分与等级分布，' +
      '再用 <code>printf</code> 排成对齐的表格。输入格式是：第一行一个整数 n，接下来 n 行每行"姓名 分数"。' +
      '这段程序同时用到了 <code>nextInt</code> + 清缓冲、<code>split</code> 拆字段、<code>Integer.parseInt</code>、' +
      '数组存储、方法拆分（<code>gradeOf</code>）和格式串对齐。'
    },

    { t: 'code', caption: 'GradeSheet.java　58 行：读入 → 统计 → 对齐输出', stdin: '3\nAlice 85\nBob 92\nCarol 78\n', code:
`import java.util.Scanner;

public class GradeSheet {
    static String gradeOf(int score) {
        if (score >= 90) return "A";
        if (score >= 80) return "B";
        if (score >= 70) return "C";
        if (score >= 60) return "D";
        return "F";
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        if (!in.hasNextInt()) {
            System.out.println("usage: n, then one 'name score' per line");
            return;
        }
        int n = in.nextInt();
        in.nextLine();                       // consume the newline after n

        String[] names = new String[n];
        int[] scores = new int[n];
        for (int i = 0; i < n; i++) {
            String line = in.nextLine();
            String[] parts = line.split(" ");
            names[i] = parts[0];
            scores[i] = Integer.parseInt(parts[1]);
        }

        int sum = 0;
        int best = 0;
        int bestIdx = 0;
        int[] levelCount = new int[5];       // A B C D F
        for (int i = 0; i < n; i++) {
            sum += scores[i];
            if (scores[i] > best) {
                best = scores[i];
                bestIdx = i;
            }
            String g = gradeOf(scores[i]);
            if (g.equals("A")) levelCount[0]++;
            else if (g.equals("B")) levelCount[1]++;
            else if (g.equals("C")) levelCount[2]++;
            else if (g.equals("D")) levelCount[3]++;
            else levelCount[4]++;
        }
        double avg = (double) sum / n;

        System.out.printf("%-10s %6s %6s %8s%n", "name", "score", "grade", "diff");
        for (int i = 0; i < n; i++) {
            System.out.printf("%-10s %6d %6s %8.1f%n",
                names[i], scores[i], gradeOf(scores[i]), scores[i] - avg);
        }
        System.out.printf("%-10s %6d %6s %8.1f%n", "TOTAL", sum, "-", 0.0);
        System.out.printf("average = %.2f%n", avg);
        System.out.println("best    = " + names[bestIdx] + " (" + best + ")");
        System.out.printf("A=%d B=%d C=%d D=%d F=%d%n",
            levelCount[0], levelCount[1], levelCount[2], levelCount[3], levelCount[4]);
    }
}
` },

    { t: 'p', html:
      '逐段看点：① 开头用 <code>hasNextInt()</code> 兜底，空输入时打印用法而不是崩掉；' +
      '② <code>in.nextLine()</code> 出现在 <code>nextInt()</code> 之后，专门吃掉 n 后面的换行——这一行漏了，' +
      '第一行数据就会读成空串；③ 循环里每次 <code>nextLine()</code> 读一整行，再 <code>split(" ")</code> 拆成姓名和分数；' +
      '④ 统计与等级判断放在同一个循环里，避免多遍历一次；⑤ 表格用 <code>%-10s %6d %6s %8.1f</code> 四列对齐，' +
      '<code>diff</code> 列显示与平均分之差，正负一目了然。'
    },

    { t: 'table',
      head: ['代码段', '做什么', '关键点'],
      rows: [
        ['<code>hasNextInt</code> 兜底', '没有输入时给提示', '避免 <code>NoSuchElementException</code>'],
        ['<code>nextInt</code> + <code>nextLine</code>', '读 n 并清掉换行', '这一行是整章最重要的修复'],
        ['<code>split(" ")</code> 循环', '逐行拆字段存数组', '姓名是 String、分数要 parseInt'],
        ['统计循环', '求和 / 最大值 / 等级计数', '一次遍历同时算多个指标'],
        ['printf 表格', '四列对齐输出', '<code>%-10s</code> 左对齐、<code>%8.1f</code> 一位小数']
      ],
      caption: '这五段合起来，就是一个可以直接交作业的输入输出骨架'
    },

    { t: 'p', html:
      '把输入换成文件也一样能跑：<code>java GradeSheet &lt; scores.txt</code>——这正是第五节讲的重定向。' +
      '同一份程序，接键盘就是交互式、接文件就是批量处理，这就是"标准输入"抽象的价值。' +
      '第 06 章会把这里的 <code>gradeOf</code>、统计逻辑进一步拆成更多方法，演示"模块化"怎么做。'
    },

    { t: 'h', text: '教材对照：§1.5 标准输入输出与过滤器', id: 'ch05-11' },

    { t: 'p', html:
      '教材 §1.5 的立场值得先摆正：输入输出不是"程序写完之后再加的壳"，而是<b>编程模型的一部分</b>。' +
      '它让所有程序统一从<b>标准输入</b>读、往<b>标准输出</b>写，于是键盘、文件、管道都能互换，' +
      '一个程序可以原封不动地接另一种数据源。本站第四节已经对照过 StdIn/StdOut 与 Scanner 的写法，' +
      '这里补上教材这一节的另外两个核心概念：<b>重定向与管道</b>、<b>过滤器（filter）</b>。'
    },

    { t: 'table',
      head: ['教材库', '本站对应', '差异'],
      rows: [
        ['<code>StdIn</code>', '<code>Scanner(System.in)</code>', 'readInt/readDouble/readLine ↔ nextInt/nextDouble/nextLine；isEmpty() ↔ 先判断 hasNextInt()'],
        ['<code>StdOut</code>', '<code>System.out</code>', '用法几乎一样，只是少了 printf 的风格化封装（本站直接用 printf）'],
        ['<code>StdDraw</code>', '站内 SVG / 实验台（静态）', '本站不加载绘图库，只展示静态图与坐标逻辑，不能逐帧动画'],
        ['<code>StdAudio</code>', '本站无', '需要本地 JDK + 音频文件，考试只考概念（采样、滤波）'],
        ['<code>StdRandom</code>', '<code>Math.random()</code> + 自封装', 'uniform/bernoulli/shuffle 要自己写；教材的库带 main() 做单元测试']
      ],
      caption: '一句总结：教材用库把 I/O 抽象成 API，本站用标准库做同样的事；能读懂两种写法，就不怕考试用哪一套' },

    { t: 'code', caption: '教材 Program 1.5.3 求平均：从标准输入读到 EOF，输入 1 2 3 4 时输出 2.5（教材库 · 需本地 JDK + algs4.jar）', run: false, code:
`public class Average {
    public static void main(String[] args) {
        double sum = 0.0;
        int n = 0;
        while (!StdIn.isEmpty()) {
            sum += StdIn.readDouble();
            n++;
        }
        double average = sum / n;
        StdOut.println(average);
    }
}
` },

    { t: 'p', html:
      '这段程序是"读到输入结束"的教材写法：<code>while (!StdIn.isEmpty())</code> 一直读到没有数据为止，' +
      '再用 <code>sum / n</code> 求平均。本站对应写法是 <code>while (in.hasNextDouble())</code>——' +
      '注意要先判断再读，否则空输入时读到 <code>0 / 0</code> 得到 <code>NaN</code>。' +
      '教材的运行方式靠<b>重定向</b>：<code>java Average &lt; data.txt</code>，把文件接到标准输入；' +
      '反过来 <code>java Program &gt; out.txt</code> 把输出存进文件。<br><br>教材随后讲了一个更有用的概念：<b>过滤器</b>。过滤器只做一件事——从标准输入读、变换、往标准输出写，' +
      '所以可以像水管一样串起来：<code>cat scores.txt | java Filter</code>，前一个程序的输出直接成为后一个的输入；' +
      '多个过滤器用 <code>|</code> 连起来，就得到一条处理流水线。教材的例子里，有把数字转成图形的过滤器，' +
      '也有对音频采样做数字信号处理的过滤器。<b>写作业时如果你会写过滤器，就说明你真的理解了"标准输入是流"</b>：' +
      '同一份代码，接键盘是交互、接文件是批处理、接另一个程序就是管道的一节。<br><br>最后是 <code>StdDraw</code> 的坐标系，教材 §1.5 与 §1.6 反复强调：默认画布是 <b>[0,1] × [0,1]</b>，' +
      '左下角是 (0, 0)、右上角是 (1, 1)，y 轴<b>朝上</b>；用 <code>setXscale</code> / <code>setYscale</code> 改成实际数据范围后，' +
      '你画的坐标就是数据本身，不需要手算缩放。动画则是"清屏 + 重画"的循环，教材的弹跳球就是这么做的。' +
      '本站没有逐帧动画，但第五节与第六节用 SVG 和递归分形展示了同一套坐标逻辑——把静态图读懂了，动画代码只是多一个循环。'
    },

    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch05-q1' },
    { t: 'quiz', qid: 'ch05-q2' },
    { t: 'quiz', qid: 'ch05-q3' },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      '五类题、三档分值：<br>' +
      '① <b>给 printf 语句问输出</b>（读代码写输出，5–10 分）：数清宽度、小数位、有没有 <code>%n</code>、' +
      '<code>%%</code> 是不是字面百分号。做法：把输出画成格子，从左往右一列一列填。<br>' +
      '② <b>给 Scanner 代码和输入问读到什么</b>（读代码写输出，5–10 分）：核心就是 <code>nextInt()</code> 后接 ' +
      '<code>nextLine()</code> 的空串陷阱；也可能给"读到输入结束"的循环。<br>' +
      '③ <b>命令行参数</b>（Mock A Q1 就考了 10 分）：<code>args.length</code>、<code>args[0]</code>、' +
      '<code>Integer.parseInt(args[i])</code>，以及"参数少了会越界"的边界。<br>' +
      '④ <b>绘图读代码 / 填空</b>（10 分档）：问画了多少条线（科赫 <code>4<sup>n</sup></code>、递归树 ' +
      '<code>2<sup>n</sup>−1</code>）、坐标怎么变、基线条件是什么。<br>' +
      '⑤ <b>随机数范围</b>（选择/填空，3–5 分）：给公式问能生成哪些数，或反过来给范围让写公式。<br>' +
      '<b>看到这类题先做什么</b>：printf 题先画格子；Scanner 题先把输入按空格和换行拆成记号序列、标出"谁被读走了"；' +
      '绘图题先写出基线条件和递归次数公式。三步都写在草稿纸上，再对选项。'
    },

    { t: 'keypoint', items: [
      { title: 'printf', html: '格式串是模板，参数按顺序填充；<code>%d</code> 整数、<code>%f</code> 小数、<code>%s</code> 字符串、<code>%n</code> 换行，宽度写在小数点前。' },
      { title: 'Scanner', html: '<code>new Scanner(System.in)</code> 后按类型读；<code>nextInt</code> 跳过空白读记号，<code>nextLine</code> 读整行。' },
      { title: '经典陷阱', html: '<code>nextInt()</code> 不会吃掉行尾换行，紧接着的 <code>nextLine()</code> 会读到空串；中间补一个 <code>nextLine()</code> 即可。' },
      { title: '输入循环', html: '不知道数量就 <code>while (in.hasNextInt())</code>；先判断再读，且要处理"读到 0 个"的边界。' },
      { title: '两条入口', html: '重定向 <code>&lt;</code> <code>&gt;</code> 把标准流接到文件；命令行参数进 <code>args</code>，是 String，要 parseInt。' },
      { title: '绘图', html: 'StdDraw 先设坐标系再画点/线/圆；y 轴朝上（数学坐标），与屏幕像素坐标相反。' },
      { title: '分形与随机', html: '分形 = 同一规则在更小尺度上递归；随机数用 <code>(int)(Math.random()*(max-min+1))+min</code>，大量试验看频率。' },
      { title: 'I/O 调试', html: '把读到的值用 <code>"[" + 值 + "]"</code> 打印出来，空串、尾随空格一眼可见。' }
    ] },

    { t: 'checklist', id: 'ch05', items: [
      '我能手写 printf 输出一列右对齐的整数和一列两位小数的金额',
      '我能说出 %d、%s、%f、%n 各自匹配什么类型的参数',
      '我能解释为什么 nextInt() 之后直接 nextLine() 会读到空串，并写出修复代码',
      '我能用 Scanner 读 n 行「姓名 分数」并存进两个数组',
      '我能用 hasNextInt 写"读到输入结束"的循环，并处理空输入',
      '我知道命令行参数是字符串数组，要转换才能参与算术',
      '我能读懂 StdDraw 代码画的是什么，并说出它的坐标系与 y 轴方向',
      '我能说出递归树和科赫雪花的基线条件与问题缩小方式',
      '我能写出生成 [1, 100] 随机整数的表达式',
      '我能诊断输入错位、格式符错配、空输入三类 I/O bug',
      '我能说出教材 §1.5 的五个库各自对应本站什么写法，并解释"过滤器 + 管道"为什么能串起来'
    ] },

    { t: 'p', html:
      '<b>延伸阅读</b>：教材 Sedgewick《Computer Science: An Interdisciplinary Approach》第 1.5 节（Input and Output）与 ' +
      '第 1.6 节（Standard Drawing）；站内第 04 章「数组」（本章的 split 与批量存储会用到）、' +
      '第 06 章「方法与函数库」（本章案例的方法拆分）、第 09 章「内存与引用」（数组参数传的是引用）。' +
      '动手可以打开 <a href="#/labs/stddraw">实验台 · StdDraw</a> 看坐标与图元，或到 <a href="#/quiz/ch05">题库 · ch05</a> 按章节练习。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '让 AI 给你一段 printf 代码，<b>先自己算出输出</b>（在纸上标出每一格宽度），再粘到本站跑一遍对照——' +
      '这种「先预测再验证」的循环，比让 AI 直接解释格式符有效十倍。' +
      '另外可以让 AI 出 3 道 Scanner 读输入的题，专门考 <code>nextInt/nextLine</code> 混用；' +
      '拿到答案后别急着信，自己构造输入跑一遍。<br>' +
      '更高阶的用法：把本章案例 GradeSheet 发给 AI，让它"只改输入格式"（比如改成逗号分隔），你再判断它有没有' +
      '同时改掉 <code>split</code> 和 <code>nextLine</code> 的清缓冲——AI 经常改一处漏一处，这种检查最能练读代码。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：输入输出与绘图：printf、Scanner 与 stdin 陷阱、StdIn/StdOut 对照、命令行参数与重定向、StdDraw 图元与坐标系、递归分形、随机模拟。<br>依据：Course Outline v5 的 Standard Input and Output / Standard Drawing / Fractal Drawings 部分；Sedgewick §1.5–1.6。本站为个人整理的学习材料，与课程要求冲突时以老师和课程大纲为准；代码均在真实 JDK 上校验过。' }

  ]
});