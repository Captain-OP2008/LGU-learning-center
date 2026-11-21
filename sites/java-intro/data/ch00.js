/* =====================================================================
 * data/ch00.js · 第 00 章：序章——计算机科学与你
 * 职责：在写第一行代码之前，建立"计算"的世界观、课程地图与学习方式；
 *       并给出第一次运行、三类错误、站内五个工具的使用方法。
 * 本章代码块以"预览 + 第一次单步 + 看真实报错"为主，不要求掌握语法。
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5；示例输出均用 JDK 25 核对。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch00',
  num: '00',
  title: '序章：计算机科学与你',
  en: 'Prologue',
  goals: [
    '能说清计算机科学研究的到底是什么',
    '能解释"程序 = 算法 + 数据结构"并各举一例',
    '能说出 Java 为什么先编译成字节码',
    '能区分编译期错误、运行时错误与逻辑错误',
    '能在课程地图上定位 26 章的八个部分（前四部分主课、后四部分继续学习），并说出本站五个工具各自的用途',
    '能说明 AI 时代为什么仍要亲手写代码、亲手验证'
  ],
  kp: [
    { id: 'ch00-1', title: '计算机科学研究的不是电脑' },
    { id: 'ch00-2', title: '程序 = 算法 + 数据结构' },
    { id: 'ch00-3', title: '编译、解释与字节码' },
    { id: 'ch00-6', title: '三类错误与第一次运行' },
    { id: 'ch00-4', title: '课程地图' },
    { id: 'ch00-8', title: '教材七章与本书 26 章的对应' },
    { id: 'ch00-7', title: '在站内怎么学：五个工具' },
    { id: 'ch00-5', title: 'AI 时代为什么还要学' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '这门课叫「计算机科学与程序设计导论」。多数人一开学只盯住"程序设计"，急着学语法、赶作业，' +
      '一学期后能照着样例写代码，却说不出自己在解决什么问题。' +
      '本章不写复杂代码，只搭四样东西：<b>世界观</b>（我们在研究什么）、' +
      '<b>地图</b>（26 章怎么排）、<b>工具</b>（本站怎么用）、<b>验证习惯</b>（怎么知道自己写对了）。' +
      '这四样比记住任何一条语法都耐用。'
    },

    { t: 'p', lead: true, html:
      '「计算机科学（computer science）」这个名字起得很糟糕。它研究的不是电脑——电脑只是执行者，' +
      '就像望远镜不研究天文学。它研究的是<b>过程</b>：如何把一件事拆成精确、无歧义、有限步的动作。'
    },

    { t: 'h', text: '一、计算机科学研究的不是电脑', id: 'ch00-1' },

    { t: 'p', html:
      '你让朋友「炒个番茄鸡蛋」，他不会追问油温几度——人类会自己补全常识。' +
      '计算机没有常识：它只做你<b>明确写下来</b>的事，写错的部分也照做。' +
      '初学编程最常见的挫败感"我明明想清楚了"，多半是某个细节被丢给了常识：' +
      '数组从 0 开始还是从 1 开始？空输入怎么办？数字多大算溢出？这些在人类对话里可以含糊，在代码里不行。'
    },

    { t: 'p', html:
      '所以这门课真正训练的是<b>把模糊需求翻译成精确步骤</b>的能力。判断一段步骤算不算算法（algorithm），' +
      '看四条性质：<b>有限</b>（步骤有穷，能结束）、<b>确定</b>（每步无歧义）、<b>可执行</b>（每步都做得到）、' +
      '<b>有输入输出</b>（零个或多个输入，至少一个输出）。' +
      '"随便写几行代码"之所以不算算法，通常死在"有限"和"确定"上：死循环不有限，含糊描述不确定。'
    },

    { t: 'terms', cols: 2, items: [
      { en: 'algorithm', zh: '算法', html: '解决一类问题的<b>有限</b>步骤序列：有限、确定、可执行、有输入输出。' },
      { en: 'program', zh: '程序', html: '用编程语言写成的算法。同一算法可用不同语言实现。' },
      { en: 'abstraction', zh: '抽象', html: '忽略无关细节、只留关键特征。用 <code>System.out</code> 不必懂显示器原理。' },
      { en: 'computation', zh: '计算', html: '按规则对符号做变换的过程；它不一定要用电脑完成。' }
    ] },

    { t: 'p', html:
      '下面这段程序把"算法四性质"落成代码：阶乘是有限步骤，判断偶数也是有限步骤，两者都确定、可执行、有输入输出。' +
      '注意 <code>factorial(10)</code> 的结果 3628800 已经接近 int 的量级，再大就要换 <code>long</code>——' +
      '这类"边界"从第一章就会开始出现。'
    },

    { t: 'code', caption: 'AlgorithmProps.java —— 两个满足四性质的算法', code:
`public class AlgorithmProps {
    static long factorial(int n) {
        long r = 1;
        for (int i = 2; i <= n; i++) {
            r = r * i;
        }
        return r;
    }

    static boolean isEven(int n) {
        return n % 2 == 0;
    }

    public static void main(String[] args) {
        System.out.println("factorial(5)  = " + factorial(5));    // 120
        System.out.println("factorial(10) = " + factorial(10));   // 3628800
        System.out.println("isEven(7)     = " + isEven(7));       // false
        System.out.println("isEven(8)     = " + isEven(8));       // true
    }
}
` },

    { t: 'h', text: '二、程序 = 算法 + 数据结构', id: 'ch00-2' },

    { t: 'p', html:
      '1976 年 Niklaus Wirth 用书名给出了编程界最著名的一句话：' +
      '<b>Algorithms + Data Structures = Programs</b>。它把"写程序"拆成两个必须同时考虑的问题：' +
      '数据怎么被处理（算法），数据怎么被组织（数据结构）。缺任一半，另一半都白搭。'
    },

    { t: 'steps', items: [
      { title: '算法：数据怎么被处理', html: '先做什么、后做什么、遇到岔路怎么走。它回答"<b>怎么做</b>"。' },
      { title: '数据结构：数据怎么被组织', html: '存在哪里、彼此什么关系、怎么快速找到。它回答"<b>东西放哪</b>"。' },
      { title: '程序：两者合起来才跑得动', html: '换个算法或换个数据结构，效率可能差好几个数量级。' }
    ] },

    { t: 'p', html:
      '换个算法或换个数据结构，效率可以差出好几个数量级。同样是查一个名字，下面三种做法的代价完全不同——' +
      '而它们用到的语法几乎一样。'
    },

    { t: 'table',
      head: ['做法', '算法 + 数据结构', '最坏要比较多少次'],
      rows: [
        ['A · 逐行翻', '线性查找（linear search），名字存在无序列表里', '<b>1,000,000</b> 次'],
        ['B · 按字母跳', '二分查找（binary search），名字先按字母排好', '<b>约 20</b> 次'],
        ['C · 直接查表', '哈希查找（hashing），名字存在哈希表里', '<b>接近 1</b> 次']
      ],
      caption: '数据量相同，只是组织方式与查找方式不同，代价差了五个数量级' },

    { t: 'code', caption: 'SearchCompare.java —— 同样的查找，1 次 vs 100 次', code:
`public class SearchCompare {
    static int linear(int[] a, int target) {
        int ops = 0;
        for (int i = 0; i < a.length; i++) {
            ops++;
            if (a[i] == target) {
                return ops;
            }
        }
        return ops;
    }

    public static void main(String[] args) {
        int[] a = new int[100];
        for (int i = 0; i < a.length; i++) {
            a[i] = i;
        }
        System.out.println("find 0  -> " + linear(a, 0) + " ops");   // 1
        System.out.println("find 50 -> " + linear(a, 50) + " ops");  // 51
        System.out.println("find 99 -> " + linear(a, 99) + " ops");  // 100
        System.out.println("a[50]   -> 1 op");                       // 直接按下标取
    }
}
` },

    { t: 'p', html:
      '输出 1、51、100、1。前三行是线性查找：要找的元素越靠后，比较次数越多；最后一行是"按下标直接取"，' +
      '一步到位——因为<b>数组这种数据结构支持 O(1) 随机访问</b>，前提是你知道下标。' +
      '这就把本章的核心说完了：<b>程序快慢由算法和数据结构决定，而不由代码行数决定</b>。' +
      '所以这门课不是语法速成：第 04 章学数组，第 11 章学排序查找，第 13 章学 Big-O。'
    },

    { t: 'p', html:
      '下面这段代码算 1 + 2 + … + 100，两种做法结果都是 5050，但一个加 100 次、一个用公式一次算完。' +
      'n = 100 时你感觉不到差别；换成 10 亿，做法 A 要加 10 亿次，做法 B 依然眨眼之间。'
    },

    { t: 'code', caption: 'SumTwoWays.java —— 结果一样，代价差很远', code:
`public class SumTwoWays {
    public static void main(String[] args) {
        int n = 100;

        // 做法 A：循环，逐项累加（执行 n 次加法）
        int sumA = 0;
        for (int i = 1; i <= n; i++) {
            sumA = sumA + i;
        }

        // 做法 B：公式 n(n+1)/2（固定几步，与 n 无关）
        int sumB = n * (n + 1) / 2;

        System.out.println("A = " + sumA);   // 5050
        System.out.println("B = " + sumB);   // 5050
    }
}
` },

    { t: 'lab', id: 'bigo' },

    { t: 'h', text: '三、你的代码是怎么跑起来的', id: 'ch00-3' },

    { t: 'p', html:
      'CPU 只认识<b>机器指令（machine instruction）</b>——一串二进制编码。你写的 <code>System.out.println</code> ' +
      '它一个字都不认识。传统上有两条路线：<b>编译型</b>（C/C++）运行前把源文件翻译成目标平台的机器码，快，但换系统要重编译；' +
      '<b>解释型</b>（Python）不生成机器码，由解释器边读边执行，跨平台、改完立刻跑，但通常更慢。'
    },

    { t: 'compare', left: {
      title: '编译型（compiled）：C / C++',
      html: '运行前把源文件翻译成目标平台的机器码，产出可执行文件。快，但换系统要重编译。'
    }, right: {
      title: '解释型（interpreted）：Python',
      html: '不生成机器码，由解释器边读边执行。跨平台、改完立刻跑，但通常更慢。'
    } },

    { t: 'p', html:
      'Java 走第三条路：<b>先编译，但编译成字节码（bytecode）而不是机器码</b>。' +
      '字节码是一种虚构 CPU 的指令集，这个虚构 CPU 就叫 <b>JVM（Java Virtual Machine）</b>；' +
      '机器码由 JVM 在运行时翻译，热点代码还会被 JIT（just-in-time）即时编译优化。' +
      '所以严格说 Java 既不是纯编译型也不是纯解释型，而是"编译 + 运行时翻译"的混合模型。'
    },

    { t: 'flow', nodes: [
      { title: 'HelloWorld.java', desc: '你写的源码', kind: 'start' },
      { title: 'javac 编译器', desc: '查语法，生成字节码', kind: 'proc' },
      { title: 'HelloWorld.class', desc: '字节码，平台无关', kind: 'proc' },
      { title: 'JVM', desc: '加载类，执行 main', kind: 'proc' },
      { title: '屏幕输出', kind: 'end' }
    ] },

    { t: 'p', html:
      '下面这段程序专门用来"看见"这一层：字符串 <code>"Hi"</code> 在源码里是两个字符，' +
      '在内存里是字符序列，取第一个字符转成整数得到 72——那是字母 H 的 Unicode 编码。' +
      '<b>源码是文本，程序处理的是数值</b>，这中间的翻译由编译器和 JVM 完成。'
    },

    { t: 'code', caption: 'BytecodeView.java —— 字符在内存里是数字', code:
`public class BytecodeView {
    public static void main(String[] args) {
        String s = "Hi";
        System.out.println("length = " + s.length());       // 2
        System.out.println("first  = " + s.charAt(0));      // H
        System.out.println("code   = " + (int) s.charAt(0)); // 72
        System.out.println("concat = " + s + "!");          // Hi!
    }
}
` },

    { t: 'callout', kind: 'tip', title: '为什么 Java 要多绕这一层', html:
      'Sun 在 1995 年的目标是 <b>Write Once, Run Anywhere</b>：同一份 <code>.class</code> 有 JVM 就能跑。' +
      '代价是多一层间接，收益是可移植性加<b>运行时安全</b>——越界、类型错误会被检查并抛出明确的异常，' +
      '而不是变成随机的内存破坏（C 语言里这类 bug 极难查）。'
    },

    { t: 'callout', kind: 'warn', title: '两个命令，别记反', html:
      '<code>javac HelloWorld.java</code> 是<b>编译</b>，产出 <code>HelloWorld.class</code>；' +
      '<code>java HelloWorld</code> 是<b>运行</b>，参数是类名，<b>不带</b>后缀。' +
      '两个最常见的错：<code>javac HelloWorld</code>（找不到源文件）、<code>java HelloWorld.class</code>（类名写错）。'
    },

    { t: 'h', text: '四、三类错误与第一次运行', id: 'ch00-6' },

    { t: 'p', html:
      '写程序的过程中会反复遇到三种错误，它们的"发现时机"和"修复方式"完全不同。' +
      '分清类型是第一步：<b>编译期错误</b>在 <code>javac</code> 阶段就被拦下，程序根本没跑；' +
      '<b>运行时错误</b>能编译通过，跑到某一行才抛异常；<b>逻辑错误</b>既不打编译错误也不抛异常，' +
      '但结果不对——这一类最难查，也是本站单步面板最有用的地方。'
    },

    { t: 'table',
      head: ['类型', '什么时候发现', '典型例子', '怎么查'],
      rows: [
        ['编译期错误（compile-time）', 'javac 阶段，程序没跑', '少分号、括号不配对、中文标点', '读第一行报错的行号与"期望什么"'],
        ['运行时错误（runtime）', '跑到那一行才抛异常', '数组越界、空指针、除以 0', '看异常名 + 行号，本站编辑器会高亮出错行'],
        ['逻辑错误（logic）', '程序正常结束但结果错', '差一错误、条件写反、初始值取错', '单步 + 打印中间变量，对照预期']
      ],
      caption: '三类错误的排查成本依次升高：编译期最便宜，逻辑错误最贵' },

    { t: 'p', html:
      '先看编译期错误。下面这段代码有三个错：第一行少了分号、第二行也少了分号、最后用了中文全角分号。' +
      '它<b>不能运行</b>，只能读——练习的是"看代码找错"。真实编译器会一次报出多条，' +
      '但你要<b>从第一条开始改</b>，因为后面的报错常常是前面连带的。'
    },

    { t: 'code', caption: 'CompileErrorDemo.java · 三个编译错误（故意）', run: false, code:
`public class CompileErrorDemo {
    public static void main(String[] args) {
        int x = 5                       // 错误 1：少了分号
        System.out.println("x = " + x)  // 错误 2：也少了分号
        System.out.println("done")；    // 错误 3：中文全角分号
    }
}
` },

    { t: 'p', html:
      '再看运行时错误。下面这段代码能编译通过，但第 6 行访问 <code>data[3]</code> 时数组只有 3 个元素，' +
      '于是抛出 <code>ArrayIndexOutOfBoundsException</code>。点「运行」你会看到真实的异常信息：' +
      '异常类型 + 具体下标 + 出错行。这类错误不可怕，<b>它明确告诉你去哪一行找问题</b>；' +
      '真正麻烦的是逻辑错误——它什么都不说。'
    },

    { t: 'code', caption: 'ThreeErrors.java —— 故意越界：看真实异常长什么样', code:
`public class ThreeErrors {
    public static void main(String[] args) {
        int[] data = {10, 20, 30};
        System.out.println("length = " + data.length);   // 3
        // 下面这行故意越界：运行时抛 ArrayIndexOutOfBoundsException
        System.out.println(data[3]);
    }
}
` },

    { t: 'p', html:
      '输出先是 <code>length = 3</code>，然后异常：<code>Index 3 out of bounds for length 3</code>，' +
      '并指出出错行。读这类信息的顺序是：<b>先看异常名</b>（决定了问题类别）→ <b>再看行号</b>' +
      '（哪一行）→ <b>最后看具体值</b>（下标 3、长度 3，说明合法的最大下标是 2）。' +
      '记住这份"读报错"的顺序，比记住某个 API 更值钱。'
    },

    { t: 'h', lvl: 3, text: '逻辑错误：不报错，但答案是错的' },

    { t: 'p', html:
      '第三类错误最麻烦：程序能编译、能运行、正常结束，但结果不对。它不给任何提示，只能靠"预期 vs 实际"的差值发现。' +
      '下面这段求平均分，编译器不会拦、运行时不会抛异常，可 <code>avg</code> 打印出 85，而正确答案是 85.33——' +
      '因为 <code>int / int</code> 是整数除法，小数被截断了（第 02 章细讲）。' +
      '这类 bug 的排查工具就是本站的单步面板：一行行执行，看每个变量在哪一步偏离预期。'
    },

    { t: 'code', caption: 'LogicalError.java —— 能跑、不报错，但答案错了', code:
`public class LogicalError {
    public static void main(String[] args) {
        int[] scores = {80, 91, 85};
        int sum = 0;
        for (int i = 0; i < scores.length; i++) {
            sum = sum + scores[i];
        }
        int avg = sum / scores.length;              // 整数除法丢了小数
        double avg2 = (double) sum / scores.length;
        System.out.println("sum  = " + sum);        // 256
        System.out.println("avg  = " + avg);        // 85（应为 85.33）
        System.out.println("avg2 = " + avg2);       // 85.33333333333333
    }
}
` },

    { t: 'h', text: '五、这门课的地图', id: 'ch00-4' },

    { t: 'p', html:
      '26 章分成八个部分：前四部分（00–13）是主课，按一学期排课；后四部分（14–25）是<b>继续学习</b>，' +
      '把教材后半本的计算理论、机器与硬件补完，学有余力或想读研深造时再展开。期中主要考 Part I–II，期末主要考 Part III–IV；' +
      '本站的首页星图就是按这八部分排的，点行星可以直接进章节。'
    },

    { t: 'table',
      head: ['部分', '章节', '核心问题'],
      rows: [
        ['<b>Part I · 起点</b>', '00–02', '程序怎么跑起来？数据怎么存、怎么算？'],
        ['<b>Part II · 控制与数据</b>', '03–05', '怎么判断、重复？怎么一次处理很多数据？'],
        ['<b>Part III · 抽象与对象</b>', '06–10', '怎么复用代码？怎么建模？内存里发生了什么？'],
        ['<b>Part IV · 算法与效率</b>', '11–13', '不同解法差多少？怎么用数学语言衡量？'],
        ['<b>Part V · 继续学习 · 案例研究</b>', '14–16', '真实问题怎么建模：随机冲浪、渗流、N 体模拟'],
        ['<b>Part VI · 继续学习 · 算法与数据结构</b>', '17–19', '栈队列、符号表、图：算法课的核心工具'],
        ['<b>Part VII · 继续学习 · 计算理论</b>', '20–22', '什么是可计算？有些问题为什么天生算不动？'],
        ['<b>Part VIII · 继续学习 · 机器与硬件</b>', '23–25', '数据在机器里长什么样？一台计算机怎么用逻辑门搭出来？']
      ],
      caption: '一个细节值得早点接受：这门课不是"Java 课"，而是用 Java 讲计算机科学——换 Python 讲，内容九成不变' },

    { t: 'p', html:
      '还有两件事越早知道越好。第一，考试是<b>英文卷面</b>：术语要能认出来、写出来（本章的 <code>algorithm</code>、' +
      '<code>bytecode</code>、<code>compile</code> 都会在卷面上出现）。' +
      '第二，四大部分不是孤立的：第 04 章的数组会在第 11 章排序里被反复使用，' +
      '第 12 章的递归会在第 13 章变成 O(2ⁿ) 的例子——<b>越往后，前面的内容被调用得越多</b>。'
    },

    { t: 'p', html:
      '按学期节奏看：Part I（00–02）建立"程序怎么跑、数据怎么存"的直觉，通常在前四周；' +
      'Part II（03–05）的控制流与数组是期中重点，第五到八周；Part III（06–10）的类、继承、内存是期末前半；' +
      'Part IV（11–13）的排序、递归、Big-O 是期末后半。Part V–VIII（14–25）不占主课课时，' +
      '但期中期末的压轴题常从那里借背景（随机模拟、图、图灵机）。<b>如果你只有一天复习</b>，' +
      '先刷 Part II 的读程序题，再补 Part III 的概念辨析，最后看 Part IV 的复杂度模板，' +
      '继续学习部分留到考完再读。'
    },

    { t: 'h', text: '六、在站内怎么学：五个工具', id: 'ch00-7' },

    { t: 'p', html:
      '本站不是电子书，而是五个可以动手的工具。知道每个工具解决什么问题，能省掉大量时间：' +
      '① <b>代码运行</b>（每段代码右上角「▶ 运行」）：改代码、看输出；' +
      '② <b>单步面板</b>（标「单步」的代码）：逐行执行，看变量、调用栈、堆内存；' +
      '③ <b>交互实验室</b>：把抽象概念做成能拖能点的动画（排序、递归树、内存图、Big-O 曲线）；' +
      '④ <b>题库</b>：按章节筛题、即时判分、每题带解析；' +
      '⑤ <b>模拟卷</b>：四套卷子（A/B/M2/F），计时作答、交卷判分。'
    },

    { t: 'steps', items: [
      { title: '先预测，再运行', html: '用笔写出你猜的输出，再点运行。不一致处就是你的盲区。' },
      { title: '报错先读行号', html: '先看那一行，再看"期望什么/遇到什么"，从第一条报错开始改。' },
      { title: '用单步代替发呆', html: '点「单步」，看循环变量第几轮开始偏，比盯着代码想有效得多。' },
      { title: '每章收尾做 checklist', html: '打不了勾就回去补，别用"好像看懂了"骗自己。' }
    ] },

    { t: 'p', html:
      '题库和模拟卷的用法不一样，别混着用。题库适合<b>学完一节就刷</b>：按章节筛选、即时判分、每题带解析，' +
      '错了立刻回到对应小节；错题会被记下来，可以专门刷"错题本"。' +
      '模拟卷适合<b>阶段性自测</b>：计时、一次做完、交卷后看逐题解析，用来暴露"知道但做不对"的题型。' +
      '顺序建议：先题库分章练，再模拟卷限时练——一开始就用模拟卷，只会被陌生题型打击信心。'
    },

    { t: 'p', html:
      '把三个控制结构（顺序、选择、重复）放进一个程序里走一遍，就是最好的第一次练习。' +
      '下面这段只有 9 行，但已经是"完整程序"的骨架：先声明、再循环、循环里判断、最后输出。' +
      '点「运行」看结果，再用单步看 i 与 total 每一轮怎么变。'
    },

    { t: 'code', caption: 'FirstStep.java —— 顺序 + 选择 + 重复，第一次完整单步', trace: true, code:
`public class FirstStep {
    public static void main(String[] args) {
        int total = 0;                  // 顺序：先声明，再循环
        for (int i = 1; i <= 3; i++) {  // 重复
            if (i % 2 == 1) {           // 选择
                total = total + i;
            }
        }
        System.out.println("total = " + total);   // 1 + 3 = 4
    }
}
` },

    { t: 'callout', kind: 'warn', title: '三个最常见的学习坑', html:
      '① <b>只看不写</b>：看一遍就以为会了，一动手全是问题。' +
      '② <b>复制粘贴</b>：跑通就跳过，考试时连变量写在哪都不确定。' +
      '③ <b>害怕报错</b>：报错是编译器在帮你；真正难查的是"能跑但结果错"。' +
      '对应的解法只有一条：<b>每次运行前先写下预测</b>，让"预测"和"实际"的差值来暴露理解漏洞。'
    },

    { t: 'lab', id: 'trace' },

    { t: 'code', caption: 'HelloPlanet.java —— 第一次改代码：三行输出换成你自己的', code:
`public class HelloPlanet {
    public static void main(String[] args) {
        System.out.println("计算机科学与 Java 编程导论 · Observatory");
        System.out.println("I am learning Java.");
        System.out.println("Today: compile, run, read the output.");
    }
}
` },

    { t: 'p', html:
      '改代码练习：把三行字符串换成你自己的话，再加一行 <code>System.out.println("---")</code> 当分隔线，' +
      '然后故意删掉一个分号看报错、再补回来。这套动作看起来幼稚，但它同时练了三件事——' +
      '编辑、编译、读报错；三件事合起来才叫"会运行一个程序"。'
    },

    { t: 'h', text: '七、AI 时代为什么还要学', id: 'ch00-5' },

    { t: 'p', html:
      '2023 年以来，ChatGPT、Copilot 能在几秒内写出能跑的程序。还需要学吗？需要，但<b>方向变了</b>：' +
      '会写代码在贬值，判断力在升值。AI 的代码可能编译通过但逻辑错，没有心智模型的人看不出来；' +
      '把模糊需求翻译成精确规格、在几万行代码里定位 bug，是 AI 目前最弱的环节。' +
      '它们都建立在"真的知道程序在干什么"之上。'
    },

    { t: 'p', html:
      '下面是一个真实会发生的例子：需求是"求数组最大值"，AI 给的代码把初始值写成 0。' +
      '输入里有正数时它工作得很好，可一旦全是负数，它返回 0——而 0 根本不在数组里。' +
      '这类 bug 不会报错，需要有人<b>想到"全负数"这个边界</b>。' +
      '这正是本站每章都强调"先写边界再写代码"的原因。'
    },

    { t: 'code', caption: 'AIReview.java —— 同一个"找最大值"，初始值决定对错', code:
`public class AIReview {
    // AI 版：初始值取 0，全负数输入时返回 0，错了
    static int maxBuggy(int[] a) {
        int max = 0;
        for (int i = 0; i < a.length; i++) {
            if (a[i] > max) {
                max = a[i];
            }
        }
        return max;
    }

    // 修正版：用第一个元素当初始值
    static int maxFixed(int[] a) {
        int max = a[0];
        for (int i = 1; i < a.length; i++) {
            if (a[i] > max) {
                max = a[i];
            }
        }
        return max;
    }

    public static void main(String[] args) {
        int[] a = {-5, -2, -9};
        System.out.println("buggy = " + maxBuggy(a));   // 0（错）
        System.out.println("fixed = " + maxFixed(a));   // -2（对）
    }
}
` },

    { t: 'p', html:
      '输出 <code>buggy = 0</code> 与 <code>fixed = -2</code>。两段代码只差一行初始值，' +
      '但一个是错的。你能看出差别，是因为知道"循环 + 比较"在干什么、知道"数组里的最小值可能是负数"。' +
      '<b>AI 的能力上限，取决于你给它的规格有多精确；而写规格的能力，只能靠理解程序行为来练。</b>'
    },

    { t: 'p', html:
      '总结一下 AI 最容易犯的三类错误，正好对应本章的三类错误：① <b>编译不过</b>（拼错 API、' +
      '用了不存在的类）——这类最好发现，编译器会拦；② <b>能跑但抛异常</b>（忘了处理空输入、越界）——' +
      '靠读异常信息能定位；③ <b>能跑但结果错</b>（初始值取错、边界漏了）——最难，必须自己算一遍预期。' +
      '所以"会读报错 + 会算预期"这两件事，是 AI 时代最值钱的基本功。'
    },

    { t: 'h', text: '教材对照：教材七章与本书地图', id: 'ch00-9' },

    { t: 'p', html:
      '本站的骨架来自 Sedgewick 与 Wayne 的《计算机科学：跨学科方法》。原书正文只有 <b>7 章</b>，' +
      '但每一章覆盖的是"一层"：从写第一个程序、把代码拆成函数，到造出新的数据类型，再到算法、计算理论，' +
      '最后落到"一台计算机怎么用逻辑门搭出来"。理解这 7 章的层次，才能明白本站 26 章为什么这样排。'
    },

    { t: 'table',
      head: ['教材章', '主题', '本站对应'],
      rows: [
        ['<b>1</b> Fundamentals', '内置类型、条件与循环、数组、输入输出、递归', 'ch01–ch05（这章被拆成五章细讲）'],
        ['<b>2</b> Functions and Modules', '静态方法、库与客户端、模块化', 'ch06'],
        ['<b>3</b> Object-Oriented Programming', '数据类型、继承、封装与设计', 'ch07–ch09'],
        ['<b>4</b> Algorithms and Data Structures', '性能分析、排序查找、栈队列、符号表、图、递归', 'ch10、ch11、ch12、ch13，以及 ch17–ch19'],
        ['<b>5</b> Theory of Computing', '形式语言、图灵机、可计算性', 'ch20–ch22'],
        ['<b>6</b> A Computing Machine', '信息表示、TOY 机器指令', 'ch23–ch24'],
        ['<b>7</b> Building a Computer', '布尔逻辑、逻辑门、数字电路', 'ch25']
      ],
      caption: '章号不是一一对应：教材第 1 章包含递归（§2.3），本站把递归挪到 ch12 与"模块化"一起讲，因为它本质是"方法调用自己"' },

    { t: 'p', html:
      '这条主线值得提前看清：第 1–2 章管"<b>把程序写对</b>"，第 3 章管"<b>把程序组织成类型</b>"，' +
      '第 4 章才是"<b>计算机科学</b>"的正题——同一个问题，不同算法能差出成千上万倍；第 5–7 章则离开"写程序"，' +
      '回答"哪些问题根本算不了"和"机器如何执行计算"。本站把这条线保持完整：主课停在 Part IV，继续学习从案例研究补到硬件。<br><br>教材副标题里的"跨学科"也不是装饰。它的例子大量来自物理（N 体问题）、生物（渗流、基因序列）、' +
      '金融（随机游走、期权定价），并且坚持用同一个流程处理：建模 → 写模拟 → 用图和数据说话。' +
      '本站 ch14–ch16 的继续学习部分就是这三类案例；主课里你也会反复看到"先画图再下结论"的习惯。'
    },

    { t: 'p', html:
      '两个常被问到的问题，先在这里答掉。① <b>为什么教材先用命令行，不直接上 IDE？</b>' +
      '因为 <code>javac</code> 编译、<code>java</code> 执行这两步是"编译—运行"的最小模型；IDE 只是把它藏在一颗按钮后面，' +
      '出错时你反而不知道哪一步失败。② <b>为什么教材自造 StdIn、StdOut、StdDraw 这些库？</b>' +
      '它们把输入输出抽象成统一的 API，后续算法例子就能只关心算法本身。Java 标准库当然也能做，只是写法分散；' +
      '本站凡是用到这些教材库的代码块都标了 <code>run:false</code>，需要在本地装 JDK 与 <code>algs4.jar</code> 才能跑。<br><br>最后记住教材的用法：它是<b>参考书</b>，不是小说。每节末尾的习题（exercises）和书站的配套代码才是它的主体，' +
      '本站的「即时练习」和题库就是这些习题的中文改写版。读到不懂的 § 编号时，先回本站对应章节看中文讲解，' +
      '再对照书里的英文例子与习题，这是两个人一起学最省力的分工：本站负责"讲明白"，教材负责"练到位"。<br><br>本站与原书还有三处不同：① 例子重写：教材的英文场景换成了中文可运行片段，输出都是真实推演过的；' +
      '② 顺序重排：数组、递归、排序被拆成独立章节，便于期中和期末分段复习；' +
      '③ 工具不同：原书书站提供 StdIn/StdDraw 交互，本站浏览器只支持一个 Java 子集，' +
      '所以"演示型"代码在本站能跑，"教材库型"代码只做阅读材料。'
    },

    { t: 'quiz', qid: 'ch00-q1' },
    { t: 'quiz', qid: 'ch00-q2' },
    { t: 'quiz', qid: 'ch00-q3' },

    { t: 'p', html:
      '最后给一个"遇到问题怎么办"的顺序：① 读报错的第一条与行号；② 把出错行前后三行贴进搜索框；' +
      '③ 用<b>最小复现</b>缩小范围——把无关代码删到只剩能复现的十来行；④ 用单步确认变量在哪一行偏离预期。' +
      '这个顺序能解决大部分问题；直接问 AI 却不给报错原文，通常只会得到泛泛的答案。'
    },

    { t: 'terms', cols: 2, items: [
      { en: 'bytecode', zh: '字节码', html: 'javac 产出的中间指令（.class），由 JVM 执行；不是机器码。' },
      { en: 'compiler', zh: '编译器', html: '把源码翻译成字节码并检查语法的程序（javac）。' },
      { en: 'runtime error', zh: '运行时错误', html: '能编译，跑到某一行才抛出的异常，如数组越界。' },
      { en: 'logic error', zh: '逻辑错误', html: '不报错但结果错；只能靠预期与实际的差值发现。' },
      { en: 'IDE', zh: '集成开发环境', html: '把编辑、编译、运行、调试打包的工具，底层仍是 javac/java。' },
      { en: 'debug', zh: '调试', html: '定位并修复错误的过程；本站的单步面板就是调试工具。' }
    ] },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      '序章很少直接出题，但它是<b>概念题的语料库</b>：' +
      '① 问"<code>javac</code> 生成什么"（字节码 <code>.class</code>，不是机器码）；' +
      '② 问"Java 是解释型语言吗"（不是纯解释：先编译成字节码，再由 JVM 解释/JIT 执行）；' +
      '③ 问"算法与程序的区别"（程序 = 算法 + 数据结构，且程序是具体语言的实现）；' +
      '④ 给一段代码问"这是编译期错误还是运行时错误"（看它能不能编译通过）。' +
      '注意拼写：<code>bytecode</code>、<code>compiler</code>、<code>algorithm</code>。'
    },

    { t: 'keypoint', items: [
      { title: '研究对象', html: '计算机科学研究的是<b>计算过程</b>，不是电脑；算法要有限、确定、可执行、有输入输出。' },
      { title: '核心公式', html: '<b>程序 = 算法 + 数据结构</b>：算法管"怎么做"，数据结构管"数据放哪"。' },
      { title: '执行链路', html: '源码 → javac → 字节码 <code>.class</code> → JVM 执行；<code>java X</code> 不带后缀。' },
      { title: '三类错误', html: '编译期（javac 拦下）、运行时（抛异常+行号）、逻辑（无报错但结果错，最难查）。' },
      { title: '五个工具', html: '运行、单步、实验室、题库、模拟卷；核心习惯是"先预测、再运行"。' }
    ] },

    { t: 'checklist', id: 'ch00', items: [
      '我能说明计算机科学研究和"电脑"无关的那部分是什么',
      '我能说出算法的四条性质，并解释"随便写几行代码"为什么不算算法',
      '我能解释"程序 = 算法 + 数据结构"，并各举一例',
      '我知道 javac 和 java 各自做什么、产出什么',
      '我能说出 Java 为什么先编译成字节码，以及它和纯解释型语言的区别',
      '我能区分编译期错误、运行时错误、逻辑错误，并说出各自的排查顺序',
      '我知道 26 章分成哪八个部分（前四部分主课、后四部分继续学习），以及本站五个工具分别解决什么问题',
      '我看过至少一次单步执行，并对照过自己预测的输出'
    ] },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '这一章不需要 AI 写代码，但三件事值得做：' +
      '① 让它用<b>你熟悉的领域</b>解释"算法"，再对照本章定义看它有没有漏掉"有限性"；' +
      '② 让它解释"为什么 Java 要编译成字节码"，然后<b>自己在本站验证</b>（运行 <code>BytecodeView</code> 看字符编码）；' +
      '③ 让它出 3 道"编译期错误还是运行时错误"的小题。<br>' +
      '警惕：AI 对这类问题常给模糊的教科书答案，考试要的是<b>精确机制</b>——' +
      '比如"字节码不是机器码""<code>java</code> 命令的参数是类名不带后缀"，这些细节它经常说错。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：课程导论：计算机科学研究什么、程序是什么、编译与运行链路、三类错误、学习路径与站内工具、AI 时代的编程。<br>依据：CUHK-Shenzhen 计算机科学与 Java 编程导论 Course Outline v5（2026-07-09）的 Prologue 部分；Sedgewick & Wayne《Computer Science: An Interdisciplinary Approach》§1.1。本站为个人整理的学习材料，与课程要求冲突时以老师和课程大纲为准；代码均在真实 JDK 上校验过。' }

  ]
});