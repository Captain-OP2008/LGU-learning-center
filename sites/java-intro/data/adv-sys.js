/* =====================================================================
 * data/adv-sys.js · 进阶轨道 · 计算机系统（课程之外的深入学习）
 *
 * 4 个小节：数据表示 / JVM 与内存 / 字节码与编译 / 并发与性能直觉
 * 说明：本站引擎是 Java 子集。Thread、System.nanoTime、Float.floatToIntBits、
 *       文件 IO 等不支持，这类代码用 run:false 并标注「本站引擎不支持，以下为真实 JDK 运行结果」。
 *       位运算、溢出、数组引用等用 run:true 的可运行代码演示。
 * 注册：CSC.registerAdvanced(...)（独立数组，不进入主课程（ch00–ch13））
 * 作者模块：feature-builder
 * ===================================================================== */

CSC.registerAdvanced({
  id: 'adv-sys',
  order: 4,
  title: '计算机系统',
  en: 'COMPUTER SYSTEMS',
  tagline: '程序之下的世界：二进制、JVM、字节码、线程与性能',
  level: '进阶',
  minutes: 100,
  prereq: ['ch01', 'ch02', 'ch09', 'ch13'],
  intro: '<p>写 Java 时你面对的是「变量、对象、方法」。但在这层抽象之下，还有一整套机制在奔跑：'
    + '整数用补码存储、对象住在堆里、字节码被 JVM 解释或编译成机器码、多个线程共享同一块内存……</p>'
    + '<p>这一篇就是往下看一层：<b>数据在内存里长什么样</b>、<b>JVM 怎么组织内存</b>、'
    + '<b>代码怎么变成机器能执行的东西</b>、<b>并发为什么会出 bug</b>。'
    + '不需要你写汇编，但理解这些会让你对「为什么程序会这样跑」有完全不同的感觉。</p>',
  goals: [
    '能把十进制、二进制、十六进制、补码互相转换，并解释 int 溢出为什么是「回绕」',
    '说得清 JVM 的栈、堆、方法区各自放什么，以及 GC 为什么能自动回收对象',
    '知道 .java → .class → 机器码的完整链路，以及「解释执行 vs 即时编译」的区别',
    '理解线程竞态的产生条件，能说出 synchronized 解决了什么',
    '对常见操作耗时有一个数量级直觉（CPU 周期、内存访问、磁盘、网络）'
  ],
  sections: [
    /* ---------------------------------------------------------------- S1 数据表示 */
    {
      id: 'adv-sys-s1',
      title: '数据表示：二进制、补码与溢出',
      en: 'NUMBER REPRESENTATION',
      minutes: 26,
      blocks: [
        { t: 'p', html: '计算机只认识 0 和 1。所有数据——整数、字符、图片、程序——最终都是二进制位串。'
            + '理解数据表示，你才能解释这些「诡异」现象：为什么 <code>0.1 + 0.2 != 0.3</code>、'
            + '为什么 <code>Integer.MAX_VALUE + 1</code> 会变成负数、为什么 <code>(char) 97</code> 等于 97。' },
        { t: 'p', html: '先看整数。<b>二进制</b>每位的权重是 2 的幂；<b>十六进制</b>每 4 位一组，'
            + '所以 1 个字节正好写成两位十六进制（方便人读）。Java 里十六进制字面量以 <code>0x</code> 开头，'
            + '二进制以 <code>0b</code> 开头。int 是 32 位、long 是 64 位、byte 是 8 位、'
            + 'char 是 16 位无符号（能表示 0~65535，因此 Java 的 char 可以直接放中文字符）。' },
        { t: 'code', caption: '可运行：进制转换与位运算（本站引擎支持）',
          code: `public class Bits {
    static String toBinary(int n) {
        if (n == 0) return "0";
        String out = "";
        int x = n;
        while (x > 0) {
            out = (x % 2) + out;
            x /= 2;
        }
        return out;
    }

    static String toHex(int n) {
        if (n == 0) return "0";
        String digits = "0123456789abcdef";
        String out = "";
        int x = n;
        while (x > 0) {
            out = digits.charAt(x % 16) + out;
            x /= 16;
        }
        return out;
    }

    public static void main(String[] args) {
        int v = 2026;
        System.out.println(v + " 二进制 = " + toBinary(v));
        System.out.println(v + " 十六进制 = 0x" + toHex(v));
        // 位运算：与、或、异或、左移、右移
        System.out.println("v & 0xF   = " + (v & 0xF));
        System.out.println("v | 1     = " + (v | 1));
        System.out.println("v ^ 0xFF  = " + (v ^ 0xFF));
        System.out.println("v << 3    = " + (v << 3));
        System.out.println("v >> 3    = " + (v >> 3));
        // 位运算的经典用途：判断奇偶、快速乘除 2 的幂
        System.out.println("v 是奇数? " + ((v & 1) == 1));
    }
}` },
        { t: 'p', html: '位运算不只是炫技：判断奇偶用 <code>x &amp; 1</code> 比 <code>x % 2</code> 快；'
            + '乘除 2 的幂用移位；状态压缩用位掩码；哈希函数、加密、图像处理全靠它。'
            + 'Java 还有无符号右移 <code>&gt;&gt;&gt;</code>：它在最高位补 0，而 <code>&gt;&gt;</code> 补符号位——'
            + '这是负数移位时最容易混淆的地方。' },
        { t: 'h', text: '补码：为什么负数要用「取反加一」表示' },
        { t: 'p', html: '如果最高位表示符号（原码），会有两个零（+0 和 -0），加减法还要单独判断符号，很麻烦。'
            + '<b>补码</b>（two\'s complement）解决了这两个问题：负数的表示是「正数取反再加一」。'
            + '比如 8 位下 -1 = 11111111，-2 = 11111110。这样加法和减法可以用同一个加法器完成，'
            + '而且只有一个 0。代价是表示范围不对称：8 位能表示 -128 到 127（负数比正数多一个）。' },
        { t: 'code', caption: '可运行：补码与整数溢出（本站引擎支持）',
          code: `public class TwosComplement {
    public static void main(String[] args) {
        // int 的取值范围
        System.out.println("MAX = " + Integer.MAX_VALUE);   // 2147483647
        System.out.println("MIN = " + Integer.MIN_VALUE);   // -2147483648

        // 溢出：最大值 + 1 会回绕到最小值（二进制进位把符号位翻成 1）
        int max = Integer.MAX_VALUE;
        System.out.println("MAX + 1 = " + (max + 1));

        // 用 long 避免溢出
        long big = (long) Integer.MAX_VALUE + 1;
        System.out.println("用 long 计算 = " + big);

        // byte 溢出：127 + 1 = -128
        byte b = 127;
        b++;
        System.out.println("byte 127 + 1 = " + b);

        // 补码的经典应用：用位运算取绝对值
        int x = -7;
        int mask = x >> 31;          // 负数得 -1（全 1），正数得 0
        int abs = (x + mask) ^ mask; // 负数时 (x - 1) 再取反
        System.out.println("abs(-7) = " + abs);
    }
}` },
        { t: 'p', html: '整数溢出是真实世界 bug 的重灾区：2014 年某航空公司系统因为「距离字段用 16 位有符号整数」溢出，'
            + '值超过 32767 就翻成负数，导致订票系统故障。'
            + 'Java 的 int 溢出不回绕报错，而是<b>静默回绕</b>——这就是为什么大数运算要用 long 或 BigInteger，'
            + '以及为什么 <code>Arrays.binarySearch</code> 的 <code>(lo + hi) / 2</code> 要写成 <code>lo + (hi - lo) / 2</code>。' },
        { t: 'p', html: '浮点数更微妙：<code>double</code> 遵循 IEEE 754 标准，用「符号位 + 指数 + 尾数」表示，'
            + '能表示的范围很大但<b>精度有限</b>。0.1 在二进制里是无限循环小数，只能存一个近似值，'
            + '所以 <code>0.1 + 0.2</code> 会得到 <code>0.30000000000000004</code>。'
            + '涉及钱的计算（要求精确）应该用 <code>BigDecimal</code> 或整数分。' },
        { t: 'code', run: false, caption: '本站引擎不支持浮点位级操作，以下为真实 JDK 运行结果',
          code: `public class FloatBits {
    public static void main(String[] args) {
        System.out.println(0.1 + 0.2);                       // 0.30000000000000004
        System.out.println(0.1 + 0.2 == 0.3);                // false

        // 用 floatToIntBits 看 double 的二进制表示（IEEE 754）
        double d = 0.1;
        long bits = Double.doubleToLongBits(d);
        System.out.println(Long.toHexString(bits));          // 3fb999999999999a

        // 特殊值
        System.out.println(1.0 / 0);                         // Infinity
        System.out.println(0.0 / 0);                         // NaN
        System.out.println(Double.NaN == Double.NaN);        // false（NaN 不等于自己！）
    }
}

// 真实 JDK 输出：
// 0.30000000000000004
// false
// 3fb999999999999a
// Infinity
// NaN
// false` },
        { t: 'callout', kind: 'warn', html: '比较浮点数不要用 <code>==</code>：要么用阈值 <code>Math.abs(a - b) &lt; 1e-9</code>，'
            + '要么把金额转成整数（分）。另外 NaN 不等于任何值（包括自己），判断要用 <code>Double.isNaN(x)</code>。' },
        { t: 'callout', kind: 'exam', html: '课程里 ch02 的「int 溢出」「整数除法截断」「char 与 int 互转」都是这一节的简化版。'
            + '考试会考「这段程序输出什么」，本质就是问你懂不懂补码与截断。' }
      ]
    },

    /* ---------------------------------------------------------------- S2 JVM */
    {
      id: 'adv-sys-s2',
      title: 'JVM 与内存：对象住在哪里',
      en: 'JVM & MEMORY',
      minutes: 26,
      blocks: [
        { t: 'p', html: 'Java 的「一次编写，到处运行」靠的是 JVM（Java Virtual Machine）：'
            + '你的程序编译成字节码，JVM 负责在具体机器上执行它。'
            + '理解 JVM 的内存布局，是理解「为什么会有 NullPointerException」「为什么对象要回收」的钥匙。' },
        { t: 'p', html: 'JVM 运行时数据区主要有五块：<b>程序计数器</b>（当前执行到哪条字节码）、'
            + '<b>虚拟机栈</b>（每个线程一个，存放方法调用的栈帧：局部变量表、操作数栈）、'
            + '<b>本地方法栈</b>（调用 native 方法用）、<b>堆</b>（所有线程共享，对象都在这里分配）、'
            + '<b>方法区 / 元空间</b>（类结构、静态变量、常量池）。'
            + '你写的每个 <code>new</code>、每个局部变量，都对应这些区域里的一小块内存。' },
        { t: 'table', caption: '栈 vs 堆（课程 ch09 的进阶版）',
          head: ['对比项', '栈（Stack）', '堆（Heap）'],
          rows: [
            ['存放内容', '局部变量、方法参数、返回地址', '所有对象实例与数组'],
            ['共享范围', '<b>线程私有</b>（每线程一个栈）', '线程共享'],
            ['分配/释放', '方法进出自动出入栈，极快', 'new 分配，GC 回收'],
            ['容量问题', '栈深度过大 → StackOverflowError', '堆满 → OutOfMemoryError'],
            ['典型错误', '无限递归', '对象一直不被释放（内存泄漏）']
          ] },
        { t: 'p', html: '「引用」是连接栈与堆的桥梁：栈里存的是「对象在堆里的地址」，不是对象本身。'
            + '这就是为什么两个数组变量可以指向<同一个>堆对象（别名），也是为什么把对象传给方法后，'
            + '方法内修改它的字段会影响调用方。下面这段可运行代码把这件事显式画了出来。' },
        { t: 'code', caption: '可运行：数组别名与对象数组（本站引擎支持）',
          code: `public class MemoryDemo {
    static void modify(int[] a) {
        a[0] = 999;      // 通过引用修改堆上的数组
    }

    static void reassign(int[] a) {
        a = new int[]{1, 2, 3};   // 只改了局部变量的引用，不影响调用方
    }

    public static void main(String[] args) {
        int[] x = {10, 20, 30};
        int[] y = x;              // y 与 x 指向同一个堆对象
        y[1] = 777;
        System.out.println("x[1] = " + x[1]);   // 777：别名可见

        modify(x);
        System.out.println("x[0] = " + x[0]);   // 999：方法内修改生效

        reassign(x);
        System.out.println("x[0] = " + x[0]);   // 999：重新赋值不影响外面
    }
}` },
        { t: 'p', html: '注意最后一段：<code>reassign</code> 里 <code>a = new int[]{...}</code> 只是让局部变量 a 指向新数组，'
            + '调用方的 x 完全不知道。这就是「Java 是<b>值传递</b>」的含义：传递的是引用的副本，'
            + '不是引用本身。所以「方法内能改对象内容，但不能改调用方的引用指向」。' },
        { t: 'h', text: '垃圾回收：Java 为什么不用手动 free' },
        { t: 'p', html: 'C 语言里 <code>malloc</code> 之后必须 <code>free</code>，忘了就内存泄漏，'
            + '释放早了就悬垂指针。Java 用 <b>GC（垃圾回收）</b>自动管理堆：'
            + '从一组「根」（栈上的引用、静态变量等）出发，能到达的对象就是「活的」，'
            + '到达不了的对象就是垃圾，可以被回收。这个算法叫<b>可达性分析</b>。' },
        { t: 'table', caption: '分代收集的基本思路',
          head: ['区域', '放什么', '回收策略', '特点'],
          rows: [
            ['新生代', '刚创建的对象', '复制算法（Minor GC）', '回收频繁、快；大部分对象很快死亡'],
            ['老年代', '活得久的对象', '标记-清除/整理（Major GC）', '回收少、慢；大对象可能直接进老年代'],
            ['元空间', '类元数据', '类卸载', 'Java 8 起移出堆，无上限但有本地内存约束']
          ] },
        { t: 'p', html: 'GC 不是万能的：它只回收「不可达」的对象。如果你把对象放进一个静态集合里一直不删，'
            + '它就永远可达，泄漏照样发生。常见的内存泄漏来源：监听器忘记注销、缓存无上限、'
            + 'ThreadLocal 用完不 remove。排查工具是堆转储（heap dump）+ 分析工具。' },
        { t: 'code', run: false, caption: '本站引擎不支持 System.gc 与内存统计，以下为真实 JDK 运行结果',
          code: `public class GcDemo {
    public static void main(String[] args) {
        Runtime rt = Runtime.getRuntime();
        System.out.println("总内存 MB = " + rt.totalMemory() / 1024 / 1024);

        // 制造大量短命对象，观察 GC
        for (int i = 0; i < 100000; i++) {
            int[] garbage = new int[1024];   // 每个约 4KB，很快变成垃圾
        }
        System.gc();                         // 建议 GC（不保证立即执行）
        System.out.println("释放后已用 MB = " + (rt.totalMemory() - rt.freeMemory()) / 1024 / 1024);
    }
}

// 真实 JDK 输出（数字与机器相关）：
// 总内存 MB = 256
// 释放后已用 MB = 3` },
        { t: 'callout', kind: 'tip', html: '把「栈 vs 堆」和课程 ch09 的内存图连起来看：'
            + 'ch09 教你画「栈帧 → 引用箭头 → 堆对象」，这一节解释那张图背后的 JVM 结构。'
            + '两者是同一个东西的「操作视角」与「系统视角」。' },
        { t: 'callout', kind: 'note', html: '方法区里的「常量池」是面试爱问的点：字符串字面量 <code>"abc"</code> 会进常量池，'
            + '用 <code>==</code> 比较两个同字面量字符串为 true；而 <code>new String("abc")</code> 会新建堆对象，'
            + '<code>==</code> 为 false。这就是「字符串比较要用 equals」的底层原因。' }
      ]
    },

    /* ---------------------------------------------------------------- S3 字节码 */
    {
      id: 'adv-sys-s3',
      title: '字节码与编译流程：代码是怎么跑起来的',
      en: 'BYTECODE & COMPILATION',
      minutes: 24,
      blocks: [
        { t: 'p', html: '从 .java 到机器执行，中间发生了很多事。把这条链路走一遍，你就能回答：'
            + '「为什么 Java 启动慢但跑起来快」「为什么改了代码必须重新编译」「为什么有些错误编译期能发现、有些要运行时才炸」。' },
        { t: 'steps', items: [
          { title: 'javac 编译', html: '.java 源码 → 词法分析（token）→ 语法分析（AST）→ 语义检查（类型、符号）→ 生成字节码 .class'},
          { title: '类加载', html: 'JVM 在运行时按需加载 .class：加载 → 链接（验证/准备/解析）→ 初始化（执行 static 块）'},
          { title: '解释执行', html: 'JVM 逐条解释字节码指令（类似「虚拟机的汇编」），启动快、执行慢'},
          { title: '即时编译（JIT）', html: '热点代码（反复执行的方法）被编译成机器码，之后直接运行，越来越快'},
          { title: '运行时', html: '方法调用、对象分配、GC、异常处理都由 JVM 托管'}
        ] },
        { t: 'p', html: '字节码是一套「与平台无关的指令集」，大约 200 条指令，比如 <code>iload</code>（把 int 局部变量压栈）、'
            + '<code>iadd</code>（两个 int 相加）、<code>invokevirtual</code>（虚方法调用）、<code>new</code>、<code>return</code>。'
            + 'JVM 本质上是一个「栈式计算机」：大多数指令从操作数栈取数、把结果压回栈。'
            + '你课程里用的那个 Java 子集解释器，思想与真实 JVM 完全一致，只是把字节码换成了 AST 遍历。' },
        { t: 'code', run: false, caption: '本站引擎不支持 javap，以下为真实 JDK 的 javap -c 输出',
          code: `// 源码 Add.java
public class Add {
    public static int add(int a, int b) {
        return a + b;
    }
}

// 命令：javac Add.java && javap -c Add
// 输出（节选）：
// public static int add(int, int);
//   Code:
//      0: iload_0        // 把第 0 个参数 a 压栈
//      1: iload_1        // 把第 1 个参数 b 压栈
//      2: iadd           // 弹出两个 int，相加，压回结果
//      3: ireturn        // 返回栈顶的 int` },
        { t: 'p', html: '看懂字节码不需要背指令表，只要建立两个直觉：① 栈式执行：操作数都先压栈；'
            + '② 局部变量用下标访问（iload_0 就是第一个参数）。'
            + '当你遇到「同样的源码在别的 JVM 上行为不同」这类问题时，字节码层面的知识就有用了。' },
        { t: 'p', html: 'JIT 是 Java 性能的关键。JVM 会统计每个方法的调用次数和循环回边次数，'
            + '超过阈值就交给编译器生成机器码，并做内联、逃逸分析、锁消除等优化。'
            + '所以「Java 比 C 慢」只在启动阶段成立：跑久了的 Java 程序经常和 C++ 处在同一量级。'
            + '这也是为什么微基准测试（benchmark）要「预热」，否则测到的是解释执行的速度。' },
        { t: 'table', caption: 'Java 程序从源码到运行的几个阶段',
          head: ['阶段', '谁在执行', '输入', '输出/效果'],
          rows: [
            ['编译', 'javac', '.java', '.class 字节码'],
            ['类加载', 'JVM 类加载器', '.class', '类元数据进入方法区'],
            ['解释执行', 'JVM 解释器', '字节码', '逐条执行，启动快'],
            ['JIT 编译', 'JVM 编译器', '热点字节码', '机器码，执行快'],
            ['GC', 'JVM 垃圾回收器', '堆对象', '回收不可达对象']
          ] },
        { t: 'callout', kind: 'tip', html: '回到你每天都在用的东西：本站「Java 子集解释器」对代码的处理是'
            + '词法分析 → 语法分析 → AST → 树遍历求值，和真实 JVM「词法/语法 → 字节码 → 解释/JIT」是同一套思想的两次实例化。'
            + '理解了其中一种，另一种也会自然理解。' },
        { t: 'callout', kind: 'note', html: '字节码指令是「面向对象但不认识具体机器」的中间语言：'
            + '它不知道 CPU 有几个寄存器、缓存多大，这些交给具体 JVM 实现去优化。'
            + '这就是「一次编译，到处运行」的代价与收益：牺牲一点理论性能，换来跨平台与安全（验证器可以检查字节码）。' }
      ]
    },

    /* ---------------------------------------------------------------- S4 并发与性能 */
    {
      id: 'adv-sys-s4',
      title: '并发入门与性能直觉',
      en: 'CONCURRENCY & PERFORMANCE',
      minutes: 24,
      blocks: [
        { t: 'p', html: '现代 CPU 有多个核心，想让程序跑得快，就要让多个任务同时执行（并发/并行）。'
            + '但并发是所有程序员公认最难的领域之一：因为<b>执行顺序不再固定</b>。'
            + '两个线程同时修改同一个变量时，结果取决于「谁先执行到哪一步」——这叫<b>竞态条件（race condition）</b>。' },
        { t: 'p', html: 'Java 里创建线程有两种方式：继承 Thread（重写 run）或实现 Runnable（更推荐，因为 Java 单继承限制）。'
            + '线程启动后与主线程并发运行，调度由操作系统决定。'
            + '本站引擎不支持线程（它是单线程解释器），下面这段是真实 JDK 代码与输出。' },
        { t: 'code', run: false, caption: '本站引擎不支持 Thread，以下为真实 JDK 运行结果',
          code: `public class RaceCondition {
    static int counter = 0;   // 多个线程共享的计数器

    public static void main(String[] args) throws InterruptedException {
        Runnable task = () -> {
            for (int i = 0; i < 100000; i++) counter++;   // 不是原子操作！
        };
        Thread t1 = new Thread(task);
        Thread t2 = new Thread(task);
        t1.start(); t2.start();
        t1.join(); t2.join();
        System.out.println("counter = " + counter);      // 期望 200000，实际常常更小
    }
}

// 真实 JDK 输出（每次运行不同）：
// counter = 137842` },
        { t: 'p', html: '为什么 <code>counter++</code> 会丢？因为它其实是三步：读 counter 到寄存器、加 1、写回内存。'
            + '两个线程可能同时读到 100，各自加 1 写回 101，结果只增加了 1 而不是 2。'
            + '这在单线程里永远不可能发生——并发把「不可分割」的假象打破了。' },
        { t: 'table', caption: '并发的三大问题与对策',
          head: ['问题', '现象', 'Java 的对策'],
          rows: [
            ['竞态条件', '计数丢更新、状态错乱', '<code>synchronized</code>、<code>AtomicInteger</code>、锁'],
            ['内存可见性', '一个线程改了，另一个看不到', '<code>volatile</code>、锁、<code>final</code>'],
            ['死锁', '两个线程互相等对方的锁，程序卡死', '固定加锁顺序、超时、尽量缩小锁范围']
          ] },
        { t: 'code', run: false, caption: '本站引擎不支持 synchronized，以下为真实 JDK 运行结果',
          code: `public class SyncFix {
    static int counter = 0;

    static synchronized void inc() { counter++; }   // 同一时刻只有一个线程能进

    public static void main(String[] args) throws InterruptedException {
        Runnable task = () -> { for (int i = 0; i < 100000; i++) inc(); };
        Thread t1 = new Thread(task);
        Thread t2 = new Thread(task);
        t1.start(); t2.start();
        t1.join(); t2.join();
        System.out.println("counter = " + counter);   // 稳定 200000
    }
}

// 真实 JDK 输出：
// counter = 200000` },
        { t: 'p', html: '加锁修好了正确性，但带来两个代价：①串行化（多线程优势被削弱）；②死锁风险。'
            + '所以现代并发编程更推荐「不可变对象 + 消息传递 + 高层工具」：'
            + '<code>java.util.concurrent</code> 包里的 AtomicInteger、ConcurrentHashMap、线程池、'
            + 'CompletableFuture，都是把易错细节封装好的工具。原则是：<b>能不共享就不共享，必须共享就用现成工具</b>。' },
        { t: 'h', text: '性能直觉：快慢差几个数量级' },
        { t: 'p', html: '性能优化最怕「凭感觉」。真实的数量级差距很大：'
            + 'CPU 执行一条指令约 0.3 纳秒，访问 L1 缓存约 1 纳秒，访问内存约 100 纳秒，'
            + '读写 SSD 约 0.1 毫秒，磁盘寻道约 10 毫秒，跨洋网络往返约 150 毫秒。'
            + '也就是说：一次内存访问 ≈ 300 条指令，一次磁盘寻道 ≈ 30 万条指令。'
            + '理解这个比例，你才知道为什么「减少内存访问」「批量 IO」比「指令级优化」收益大得多。' },
        { t: 'table', caption: '常见操作耗时数量级（近似值，用于建立直觉）',
          head: ['操作', '耗时', '相当于多少次 CPU 指令'],
          rows: [
            ['CPU 执行 1 条指令', '~0.3 ns', '1'],
            ['访问 L1 缓存', '~1 ns', '3'],
            ['访问主存', '~100 ns', '300'],
            ['SSD 随机读 4KB', '~0.1 ms', '300,000'],
            ['磁盘寻道', '~10 ms', '30,000,000'],
            ['同一数据中心网络往返', '~0.5 ms', '1,500,000'],
            ['跨洋网络往返', '~150 ms', '450,000,000']
          ] },
        { t: 'p', html: '用这个直觉回看课程 ch13 的 Big-O：O(n²) 算法在 n=10000 时是 1 亿次操作，'
            + '比 O(n log n) 的 14 万次慢三个数量级——这不是「稍微慢一点」，是「完全不可用」。'
            + '但反过来，O(n) 里如果每次操作都要访问磁盘，可能比 O(n log n) 全在内存里还慢。'
            + '<b>复杂度看趋势，常数看场景</b>，两者都不能忽略。' },
        { t: 'code', caption: '可运行：用操作计数直观感受 O(n) 与 O(n²) 的差距（本站引擎支持）',
          code: `public class ComplexityMeasure {
    public static void main(String[] args) {
        int n = 300;
        int linearCount = 0;
        int quadCount = 0;

        for (int i = 0; i < n; i++) linearCount++;              // O(n)
        for (int i = 0; i < n; i++) {                            // O(n²)
            for (int j = 0; j < n; j++) quadCount++;
        }

        System.out.println("n = " + n);
        System.out.println("线性操作次数 = " + linearCount);
        System.out.println("平方操作次数 = " + quadCount);
        System.out.println("倍数 = " + (quadCount / linearCount) + " 倍");
    }
}` },
        { t: 'p', html: '还有个常被引用的规律叫 <b>Amdahl 定律</b>：如果程序里只有 20% 的时间花在可并行的部分，'
            + '那么无论你加多少核，整体最多快 1 / (1 - 0.2) = 1.25 倍。'
            + '它提醒我们：优化前先确认「瓶颈到底在哪」，把力气花在占大头的那部分。'
            + '同样地，「换成更快的语言/机器」往往不如「换一个复杂度更低的算法」——'
            + '算法优化是少有的、在所有机器上都成立的提速手段。' },
        { t: 'callout', kind: 'warn', html: '不要过早优化。先保证正确、可读，再用 profiler 找到真正的热点（通常 20% 的代码占 80% 的时间），'
            + '只优化热点。凭感觉优化最常见的结果是：代码变复杂了，性能没变，还引入了 bug。' },
        { t: 'callout', kind: 'note', html: '并发、GC、字节码这些主题任何一个展开都是一门课。这一篇的目标不是让你成为专家，'
            + '而是让你在遇到「多线程结果不对」「内存涨了」「启动慢」时，知道该往哪个方向查。' }
      ]
    }
  ],
  finish: '<p><b>怎么继续学：</b>先做三件事——用 <code>javap -c</code> 反编译一个自己写过的小程序；'
    + '用 <code>jconsole</code> 或 <code>jps</code> 观察一个 Java 程序的内存；'
    + '写一个多线程计数器，亲眼看到丢更新，再把它修好。'
    + '之后想深入可以读《深入理解 Java 虚拟机》与《计算机组成与设计》，或者从 CSAPP 的实验开始。</p>',
  checklist: {
    id: 'adv-sys-check',
    items: [
      '能手算一个负数的补码，并解释 int 溢出为什么回绕',
      '能说出 JVM 的栈、堆、方法区各放什么，以及栈溢出与堆溢出的区别',
      '能解释 Java 值传递：为什么方法内能改对象内容，却不能改调用方的引用',
      '知道 .java → .class → 解释/JIT 的完整链路',
      '能说出竞态条件的成因，以及 synchronized / volatile / Atomic 各自解决什么',
      '对常见操作耗时数量级有直觉（内存 ~100ns、磁盘 ~10ms）'
    ]
  },
  keypoint: {
    items: [
      { title: '一切都是位', html: '整数用补码（回绕溢出）、浮点是 IEEE 754 近似值（0.1+0.2≠0.3）、金额用整数分。' },
      { title: '栈私有、堆共享', html: '局部变量在栈、对象在堆；引用是栈里的地址；值传递传的是引用副本。' },
      { title: 'GC 靠可达性分析', html: '从根出发到达不了就是垃圾；静态集合长期持有 = 内存泄漏。' },
      { title: '字节码 + JIT', html: 'javac 生成字节码、JVM 解释执行、热点代码 JIT 成机器码，所以 Java 越跑越快。' },
      { title: '并发问题来自共享可变状态', html: '竞态靠锁/原子类，可见性靠 volatile，最佳策略是少共享、用高层工具。' }
    ]
  }
});
