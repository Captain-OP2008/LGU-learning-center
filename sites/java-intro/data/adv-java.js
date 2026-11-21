/* =====================================================================
 * data/adv-java.js · 进阶轨道 · Java 进阶（课程之外的深入学习）
 *
 * 4 个小节：异常处理 / 泛型深入 / 集合框架进阶 / 现代 Java（字符串、内部类、lambda）
 * 说明：本站引擎是 Java 子集。try/catch、自定义泛型类、lambda、StringBuilder、
 *       Iterator、enum 等语法不支持，这些代码块用 run:false 并标注
 *       「本站引擎不支持，以下为真实 JDK 运行结果」；能跑的代码保持 run:true。
 * 注册：CSC.registerAdvanced(...)（独立数组，不进入主课程（ch00–ch13））
 * 作者模块：feature-builder
 * ===================================================================== */

CSC.registerAdvanced({
  id: 'adv-java',
  order: 1,
  title: 'Java 进阶',
  en: 'ADVANCED JAVA',
  tagline: '把课程里的 Java 补成「工程里能用的 Java」：异常、泛型、集合原理与现代语法',
  level: '进阶',
  minutes: 100,
  prereq: ['ch07', 'ch08', 'ch10'],
  intro: '<p>主课程教了你能写出正确程序的 Java 子集；这一篇补上「真实 Java 工程」里绕不开的四块：'
    + '<b>异常处理</b>（错误怎么传递）、<b>泛型</b>（为什么集合能既通用又类型安全）、'
    + '<b>集合框架</b>（ArrayList 和 LinkedList 到底差在哪、HashMap 为什么平均 O(1)）、'
    + '<b>现代 Java</b>（StringBuilder、内部类、lambda 与 Stream）。</p>'
    + '<p>读完这篇，你再看 本课程之外的 Java 代码（比如大作业、LeetCode 题解、开源项目）就不会被语法吓到。</p>',
  goals: [
    '说清 checked / unchecked 异常的区别，能给自己的方法设计合理的错误处理策略',
    '理解泛型是「编译期检查 + 运行期擦除」，能看懂 List<? extends Number> 这类写法',
    '能根据操作选对集合：什么时候用 ArrayList、什么时候用 LinkedList、什么时候用 HashMap',
    '认识 StringBuilder、内部类、lambda、Stream 的用途与代价'
  ],
  sections: [
    /* ---------------------------------------------------------------- S1 异常 */
    {
      id: 'adv-java-s1',
      title: '异常处理：让错误有路可走',
      en: 'EXCEPTIONS',
      minutes: 24,
      blocks: [
        { t: 'p', html: '程序出错是常态：用户输入了非数字、文件不存在、数组下标越界、网络断了。'
            + '没有异常机制时，错误只能通过返回值一层层往上传（C 语言就是这么干的），'
            + '调用者稍一疏忽就会把错误当成正常结果继续算下去。'
            + 'Java 的异常，本质是<b>把「出错了」变成一种可以被打断、被捕获、被类型区分的控制流</b>。' },
        { t: 'p', html: '先看一个没有 try/catch 的世界：异常一旦抛出，当前方法立即终止，'
            + '如果一路都没人捕获，程序就会在 main 处崩溃，并打印一份<b>异常栈（stack trace）</b>。'
            + '读懂这份栈，是调试 Java 程序的第一项基本功。' },
        { t: 'code', run: false, caption: '本站引擎不支持 try/catch，以下为真实 JDK 运行结果',
          code: `public class Crash {
    public static void main(String[] args) {
        int[] a = {1, 2, 3};
        System.out.println(a[5]);
        System.out.println("这一行永远不会执行");
    }
}

// 真实 JDK 输出：
// Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException:
//     Index 5 out of bounds for length 3
//     at Crash.main(Crash.java:4)` },
        { t: 'p', html: '异常栈要从<b>最上面一行</b>读起：异常类型 + 消息告诉你「发生了什么」，'
            + '下面的 at 行告诉你「在哪个类的哪一行、被谁调用」。'
            + '真实项目里栈可能有几十行，练熟后可以一眼找到「第一行属于你自己代码的 at」。' },
        { t: 'h', text: 'try / catch / finally 的结构' },
        { t: 'p', html: 'try 块里放「可能出错的代码」，catch 块按异常类型分别处理，'
            + 'finally 块无论是否异常都会执行（通常放关闭文件、释放连接这类清理）。'
            + '注意 catch 的顺序：<b>子类异常必须写在父类异常前面</b>，否则编译器直接报错——'
            + '因为父类 catch 会把子类异常先截胡。' },
        { t: 'code', run: false, caption: '本站引擎不支持 try/catch，以下为真实 JDK 运行结果',
          code: `public class Divide {
    public static void main(String[] args) {
        try {
            int a = Integer.parseInt("12");
            int b = Integer.parseInt("0");
            System.out.println(a / b);
        } catch (NumberFormatException e) {
            System.out.println("输入不是整数：" + e.getMessage());
        } catch (ArithmeticException e) {
            System.out.println("除数不能为 0");
        } finally {
            System.out.println("finally 一定会执行");
        }
        System.out.println("程序继续往下走");
    }
}

// 真实 JDK 输出：
// 除数不能为 0
// finally 一定会执行
// 程序继续往下走` },
        { t: 'table', caption: 'Java 异常的三大类',
          head: ['类型', '例子', '必须处理吗', '典型场景'],
          rows: [
            ['<code>Error</code>', '<code>OutOfMemoryError</code> / <code>StackOverflowError</code>', '不处理', 'JVM 级别的严重问题，程序基本无法恢复'],
            ['<code>RuntimeException</code>（unchecked）', '<code>NullPointerException</code> / <code>ArrayIndexOutOfBoundsException</code> / <code>ArithmeticException</code>', '编译器不强制', '编程错误：空指针、越界、除零'],
            ['其他 <code>Exception</code>（checked）', '<code>IOException</code> / <code>FileNotFoundException</code>', '<b>必须</b> try-catch 或 throws', '外部环境问题：文件、网络、数据库']
          ] },
        { t: 'p', html: 'checked 异常是 Java 里争议最大的设计之一：它强迫调用者面对「文件可能读不到」这种现实，'
            + '但也导致大量样板代码。理解它的方式不是背规则，而是记住一句话：'
            + '<b>unchecked 是「你写错了」，checked 是「世界不配合」</b>。前者应该改代码，后者应该设计兜底方案。' },
        { t: 'h', text: 'throw / throws 与自定义异常' },
        { t: 'p', html: '当你写的方法检测到无法处理的错误时，可以主动 <code>throw</code> 一个异常对象；'
            + '方法签名上的 <code>throws</code> 则是提前告诉调用者「我可能抛出这些异常」。'
            + '自定义异常只要继承 <code>Exception</code>（checked）或 <code>RuntimeException</code>（unchecked）即可，'
            + '好处是调用方可以用类型精确区分不同的业务错误。' },
        { t: 'code', run: false, caption: '本站引擎不支持 try/catch 与自定义异常类，以下为真实 JDK 运行结果',
          code: `class BalanceException extends Exception {
    BalanceException(String msg) { super(msg); }
}

public class Account {
    private int balance = 100;

    void withdraw(int amount) throws BalanceException {
        if (amount > balance) {
            throw new BalanceException("余额不足：" + balance + " < " + amount);
        }
        balance -= amount;
        System.out.println("取款成功，余额 " + balance);
    }

    public static void main(String[] args) {
        Account acc = new Account();
        try {
            acc.withdraw(150);
        } catch (BalanceException e) {
            System.out.println("业务异常：" + e.getMessage());
        }
    }
}

// 真实 JDK 输出：业务异常：余额不足：100 < 150` },
        { t: 'p', html: '这一篇不要求你现在就能写 try/catch（本站引擎还不支持），'
            + '但你要能<b>看懂</b>：异常是一种「带类型和消息的早退信号」。'
            + '本站引擎里遇到越界、除零，返回的 error 对象（stage/type/message/line）就是同一套思想的简化版。' },
        { t: 'p', html: '还有一个工程上常用的技巧：<b>捕获后包装再抛出</b>。'
            + '当底层异常（比如 SQLException）对上层没有意义时，可以把它包成业务异常并保留原因：'
            + '<code>throw new OrderException("下单失败", e)</code>。'
            + '这样上层只需要处理 OrderException，而排查时通过 <code>e.getCause()</code> 仍能追到根因。'
            + '这正是「异常转换（exception translation）」模式，框架代码里随处可见。' },
        { t: 'callout', kind: 'tip', html: '设计错误处理时问自己三个问题：这个错误<b>能不能在这里恢复</b>？'
            + '如果恢复不了，<b>该向谁报告</b>？报告时<b>需要带什么上下文</b>（哪一行、哪个输入、哪个资源）？'
            + '三个问题答清楚，异常才不会变成「到处 catch 然后吞掉」的摆设。' },
        { t: 'callout', kind: 'warn', html: '最常见的坏味道：<code>catch (Exception e) { }</code>——捕获后什么都不做。'
            + '这会让错误彻底消失，排查时只能靠猜。至少要打印日志或返回明确的失败状态。' }
      ]
    },

    /* ---------------------------------------------------------------- S2 泛型 */
    {
      id: 'adv-java-s2',
      title: '泛型深入：编译期的类型安全',
      en: 'GENERICS',
      minutes: 24,
      blocks: [
        { t: 'p', html: '集合的原始版本（Java 5 之前）用 <code>Object</code> 装一切：'
            + '<code>ArrayList list = new ArrayList();</code>。问题是编译器不知道你往里放了什么，'
            + '取出来时全要强制转换，一旦放错类型，错误要到<b>运行时</b>才炸。'
            + '泛型的出现，就是为了把「类型错误」从运行时提前到<b>编译期</b>。' },
        { t: 'table', caption: '有泛型 vs 没泛型',
          head: ['对比项', '没有泛型（Object[] 风格）', '泛型（ArrayList<String>）'],
          rows: [
            ['类型检查', '运行时 ClassCastException', '<b>编译期</b>直接报错'],
            ['取值', '需要 (String) 强制转换', '不需要转换，返回值已是 String'],
            ['代码可读性', '看不出容器里装什么', '签名即文档：装 String'],
            ['性能', '每次强制转换有一次检查开销', '无转换开销（擦除后就是 Object）']
          ] },
        { t: 'p', html: '泛型的写法你已经见过很多：<code>ArrayList&lt;Integer&gt;</code>、<code>HashMap&lt;String, Integer&gt;</code>。'
            + '<code>&lt;...&gt;</code> 里的东西叫<b>类型参数（type parameter）</b>，'
            + '它让你在使用类的时候「填一个类型」。注意 Java 泛型只接受<b>引用类型</b>：'
            + '<code>ArrayList&lt;int&gt;</code> 不合法，必须写 <code>ArrayList&lt;Integer&gt;</code>（自动装箱）。' },
        { t: 'code', run: false, caption: '本站引擎不支持自定义泛型类，以下为真实 JDK 运行结果',
          code: `class Box<T> {
    private T value;

    Box(T value) { this.value = value; }

    T get() { return value; }

    void set(T value) { this.value = value; }
}

public class BoxDemo {
    public static void main(String[] args) {
        Box<String> s = new Box<String>("hello");
        Box<Integer> n = new Box<Integer>(42);
        System.out.println(s.get().toUpperCase());   // 不用强转，直接调 String 方法
        System.out.println(n.get() + 1);              // 不用强转，直接当 Integer 用
        // Box<String> bad = new Box<Integer>(1);     // 编译期就报错
    }
}

// 真实 JDK 输出：
// HELLO
// 43` },
        { t: 'p', html: '泛型方法把类型参数写在返回值前面，例如 <code>static &lt;T&gt; T pick(T a, T b)</code>。'
            + '它常用于工具类：调用时编译器根据实参自动推断 T，不用你手写尖括号。'
            + '初学时最容易忽略的一点：<b>泛型是给编译器看的</b>，运行时这些信息会被擦掉。' },
        { t: 'h', text: '类型擦除：泛型只活到编译期' },
        { t: 'p', html: 'Java 的泛型是<b>编译期特性</b>：编译完成后，<code>ArrayList&lt;String&gt;</code> 和 '
            + '<code>ArrayList&lt;Integer&gt;</code> 在字节码里都是 <code>ArrayList</code>，'
            + '类型参数被擦除（erasure）成上界（默认 Object）。'
            + '这解释了三个常见疑问：为什么不能 <code>new T()</code>、为什么不能 <code>new T[10]</code>、'
            + '为什么 <code>list instanceof ArrayList&lt;String&gt;</code> 不合法——运行时根本没有这个信息。' },
        { t: 'code', run: false, caption: '本站引擎不支持泛型反射，以下为真实 JDK 运行结果',
          code: `import java.util.ArrayList;

public class Erasure {
    public static void main(String[] args) {
        ArrayList<String> a = new ArrayList<String>();
        ArrayList<Integer> b = new ArrayList<Integer>();
        System.out.println(a.getClass() == b.getClass());   // true：运行时类型相同
        System.out.println(a.getClass().getName());         // java.util.ArrayList
    }
}

// 真实 JDK 输出：
// true
// java.util.ArrayList` },
        { t: 'p', html: '擦除带来了两个后果。好的一面：泛型代码可以和旧代码兼容（迁移成本低）。'
            + '坏的一面：运行时拿不到类型，泛型因此不能用于数组创建、不能重载（<code>f(List&lt;String&gt;)</code> 与 '
            + '<code>f(List&lt;Integer&gt;)</code> 会被认为同一个方法）。' },
        { t: 'h', text: '通配符与 PECS 原则' },
        { t: 'p', html: '当你写的方法参数是「一筐某种东西」而不是「一筐具体类型」时，用通配符：'
            + '<code>List&lt;?&gt;</code> 表示任意类型；<code>List&lt;? extends Number&gt;</code> 表示 Number 或其子类；'
            + '<code>List&lt;? super Integer&gt;</code> 表示 Integer 或其父类。'
            + 'PECS 原则（Producer Extends, Consumer Super）帮助你选：'
            + '<b>你从集合里读（生产）就用 extends，往集合里写（消费）就用 super</b>。' },
        { t: 'code', run: false, caption: '本站引擎不支持通配符泛型，以下为真实 JDK 运行结果',
          code: `import java.util.ArrayList;
import java.util.List;

public class Wildcard {
    static double sum(List<? extends Number> nums) {   // 只读：Producer
        double s = 0;
        for (Number n : nums) s += n.doubleValue();
        return s;
    }

    static void fill(List<? super Integer> list) {    // 只写：Consumer
        for (int i = 1; i <= 3; i++) list.add(i);
    }

    public static void main(String[] args) {
        List<Integer> ints = new ArrayList<Integer>();
        fill(ints);
        System.out.println(sum(ints));
    }
}

// 真实 JDK 输出：6.0` },
        { t: 'p', html: '现在你至少要有两件事能看懂：第一，<code>ArrayList&lt;String&gt;</code> 的尖括号是什么意思；'
            + '第二，泛型不是「运行时的容器」，而是一层<b>编译期契约</b>。'
            + '本站引擎虽然不支持自定义泛型，但 <code>ArrayList&lt;Integer&gt;</code>、'
            + '<code>HashMap&lt;String, Integer&gt;</code> 这类内置泛型用法是支持的——去下面的可运行代码里感受「不用强转」的便利。' },
        { t: 'p', html: '最后提醒一个容易混淆的点：<b>泛型类不能接受基本类型</b>。'
            + '<code>ArrayList&lt;int&gt;</code> 编译不过，必须写 <code>ArrayList&lt;Integer&gt;</code>；'
            + '数组 <code>int[]</code> 与泛型容器 <code>ArrayList&lt;Integer&gt;</code> 是两种不同的东西：'
            + '前者是连续内存的原始类型数组，后者是包装着对象的容器。'
            + '做算法题时，能用 int[] 就用 int[]（没有装箱开销），需要动态扩容时再用 ArrayList。' },
        { t: 'code', caption: '可运行：内置泛型容器（本站引擎支持）',
          code: `import java.util.ArrayList;
import java.util.HashMap;

public class GenericUse {
    public static void main(String[] args) {
        ArrayList<Integer> nums = new ArrayList<Integer>();
        for (int i = 1; i <= 5; i++) nums.add(i * i);
        int sum = 0;
        for (int v : nums) sum += v;               // 不用 (Integer) 强转
        System.out.println("sum=" + sum);

        HashMap<String, Integer> freq = new HashMap<String, Integer>();
        String[] words = {"a", "b", "a", "c", "a"};
        for (int i = 0; i < words.length; i++) {
            String w = words[i];
            if (freq.containsKey(w)) freq.put(w, freq.get(w) + 1);
            else freq.put(w, 1);
        }
        System.out.println("a=" + freq.get("a") + " size=" + freq.size());
    }
}` },
        { t: 'callout', kind: 'warn', html: '自动装箱有坑：<code>Integer a = 127, b = 127; a == b</code> 为 true，'
            + '但 <code>128</code> 时可能为 false——因为 -128~127 的 Integer 有缓存。'
            + '比较包装类型请始终用 <code>equals</code>，或先转成 int 再比。' }
      ]
    },

    /* ---------------------------------------------------------------- S3 集合 */
    {
      id: 'adv-java-s3',
      title: '集合框架：选对容器，性能差一个数量级',
      en: 'COLLECTIONS',
      minutes: 26,
      blocks: [
        { t: 'p', html: '课程里你用过数组和 ArrayList。真实 Java 的集合框架是一个三层结构：'
            + '<b>接口</b>（List / Set / Map）定义行为，<b>抽象类</b>提供通用实现，'
            + '<b>具体类</b>（ArrayList / LinkedList / HashSet / HashMap…）提供不同取舍的实现。'
            + '写业务代码时应该<b>面向接口编程</b>：变量声明成 <code>List&lt;String&gt;</code>，'
            + '需要换实现时只改一行。' },
        { t: 'table', caption: '三大接口的语义',
          head: ['接口', '有序？', '允许重复？', '核心操作', '典型实现'],
          rows: [
            ['<code>List</code>', '有（按插入顺序，带下标）', '允许', 'get(i) / add / remove(i)', 'ArrayList、LinkedList'],
            ['<code>Set</code>', '不保证（LinkedHashSet 例外）', '<b>不允许</b>', 'add / contains', 'HashSet、LinkedHashSet、TreeSet'],
            ['<code>Map</code>', '键无序（LinkedHashMap 例外）', '键唯一、值可重复', 'put / get / containsKey', 'HashMap、LinkedHashMap、TreeMap']
          ] },
        { t: 'h', text: 'ArrayList vs LinkedList：随机访问 vs 头尾增删' },
        { t: 'p', html: 'ArrayList 底层是<b>数组</b>：按下标取元素 O(1)，但在中间插入/删除要搬动后面所有元素，O(n)。'
            + 'LinkedList 底层是<b>双向链表</b>：按下标取元素要一个个走，O(n)，但已知节点时插入/删除 O(1)。'
            + '很多同学以为「插入快就用 LinkedList」，其实<b>先找位置</b>就已经是 O(n) 了，'
            + '所以除了「频繁在头尾操作」或「用迭代器边遍历边删」的场景，ArrayList 几乎总是更好的选择。' },
        { t: 'table', caption: '常见操作复杂度（平均情况）',
          head: ['操作', 'ArrayList', 'LinkedList', 'HashMap / HashSet'],
          rows: [
            ['按下标访问', '<b>O(1)</b>', 'O(n)', '—（Map 用 key）'],
            ['尾部追加', 'O(1) 摊销', '<b>O(1)</b>', 'O(1) 摊销'],
            ['头部插入', 'O(n)', '<b>O(1)</b>', '—'],
            ['按值查找', 'O(n)', 'O(n)', '<b>O(1)</b>（用 key 查）'],
            ['删除已知节点', 'O(n)', '<b>O(1)</b>', 'O(1)']
          ] },
        { t: 'p', html: 'HashMap 是课程里最重要的容器。它的原理是<b>桶数组 + 哈希函数</b>：'
            + '把 key 的 <code>hashCode()</code> 做扰动后对桶数取模，落到某个桶；'
            + '桶里通常是一个链表，冲突太多时（Java 8+，链表长度 ≥ 8）会树化成红黑树。'
            + '当元素数超过「容量 × 负载因子（默认 0.75）」时扩容为两倍并重新分配（rehash）。'
            + '这就是它能做到平均 O(1) 的原因，也解释了为什么自定义类当 key 时必须正确重写 '
            + '<code>equals</code> 和 <code>hashCode</code>。' },
        { t: 'code', caption: '可运行：手写一个「哈希桶」感受 HashMap 原理（本站引擎支持）',
          code: `public class HashBuckets {
    public static void main(String[] args) {
        String[] words = {"apple", "banana", "cherry", "avocado", "blueberry"};
        int bucketCount = 4;
        // 桶：每个桶记录落进来的词个数（简单演示，不做真实链表）
        int[] counts = new int[bucketCount];
        for (int i = 0; i < words.length; i++) {
            int h = words[i].hashCode();
            int idx = h % bucketCount;
            if (idx < 0) idx += bucketCount;
            counts[idx]++;
        }
        for (int i = 0; i < bucketCount; i++) {
            System.out.println("bucket " + i + " → " + counts[i]);
        }
    }
}` },
        { t: 'p', html: '运行上面这段代码，你会看到 5 个词被分到 4 个桶里，有的桶 2 个、有的 1 个——'
            + '这就是「冲突」。HashMap 用链表/红黑树把冲突的键串起来。'
            + '注意 <code>hashCode()</code> 可能是负数，取模后要修正到 [0, 桶数) 范围，'
            + '这是一个非常经典的实现细节。' },
        { t: 'h', text: 'Collections 工具类与遍历方式' },
        { t: 'p', html: '<code>java.util.Collections</code> 是操作集合的静态工具类：'
            + 'sort / reverse / shuffle / max / min / swap / binarySearch / unmodifiableList。'
            + '注意是 Collections（复数，工具类），不是 Collection（接口）。'
            + '排序要求元素实现 Comparable，或用 Comparator 指定规则——本站引擎支持基本类型和字符串的排序，'
            + '对象排序建议手写比较函数（课程项目 grades 里就是这么做的）。' },
        { t: 'code', caption: '可运行：Collections 工具类（本站引擎支持）',
          code: `import java.util.ArrayList;
import java.util.Collections;

public class CollectionsDemo {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<Integer>();
        list.add(7); list.add(3); list.add(9); list.add(1);
        Collections.sort(list);
        System.out.println("sorted: " + list);
        Collections.reverse(list);
        System.out.println("reversed: " + list);
        System.out.println("max=" + Collections.max(list) + " min=" + Collections.min(list));

        ArrayList<String> names = new ArrayList<String>();
        names.add("Bob"); names.add("Alice"); names.add("Cid");
        Collections.sort(names);
        System.out.println("names: " + names);

        // 手写二分查找（等价于 Collections.binarySearch，本站引擎不内置该方法）
        int target = -1;
        int lo = 0, hi = names.size() - 1;
        while (lo <= hi) {
            int mid = (lo + hi) / 2;
            if (names.get(mid).equals("Alice")) { target = mid; break; }
            else if (names.get(mid).compareTo("Alice") < 0) lo = mid + 1;
            else hi = mid - 1;
        }
        System.out.println("binarySearch Alice = " + target);
    }
}` },
        { t: 'p', html: '遍历集合有三种主流写法：①下标 for（只有 List 能这么干，效率取决于实现）；'
            + '②增强 for（编译器会转成迭代器，最常用）；③Iterator（可以在遍历中安全删除元素）。'
            + '本站引擎支持前两种；<code>Iterator</code> 和 <code>Map.Entry</code> 暂不支持，'
            + '在真实 JDK 里它们的标准写法如下。' },
        { t: 'code', run: false, caption: '本站引擎不支持 Iterator / entrySet，以下为真实 JDK 运行结果',
          code: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class IterateDemo {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<String>();
        list.add("a"); list.add("b"); list.add("c");

        // Iterator：遍历中删除元素的唯一安全方式
        Iterator<String> it = list.iterator();
        while (it.hasNext()) {
            String s = it.next();
            if (s.equals("b")) it.remove();
        }
        System.out.println(list);          // [a, c]

        HashMap<String, Integer> map = new HashMap<String, Integer>();
        map.put("x", 1); map.put("y", 2);
        for (Map.Entry<String, Integer> e : map.entrySet()) {
            System.out.println(e.getKey() + "=" + e.getValue());
        }
    }
}

// 真实 JDK 输出：
// [a, c]
// x=1
// y=2` },
        { t: 'callout', kind: 'exam', html: '本节是 本课程课程 ch10 的延伸。'
            + '考试会问你某个操作的时间复杂度、给定场景该选哪种集合；'
            + '面试/大作业会追问 HashMap 原理与 equals/hashCode 契约。'
            + '两件事都记住：<b>面向接口编程</b>、<b>用数据量决定复杂度是否重要</b>。' }
      ]
    },

    /* ---------------------------------------------------------------- S4 现代 Java */
    {
      id: 'adv-java-s4',
      title: '现代 Java：字符串、内部类、lambda 与 Stream',
      en: 'MODERN JAVA',
      minutes: 26,
      blocks: [
        { t: 'p', html: '课程代码常用 <code>String s = ""; s += x;</code> 在循环里拼字符串。'
            + '这在小数据量下没问题，但 String 是<b>不可变</b>的：每次 <code>+=</code> 都会新建一个 String 对象并复制旧内容，'
            + '循环 n 次的时间复杂度是 O(n²)。Java 提供 <code>StringBuilder</code> 解决这个问题，'
            + '它内部维护可扩容的字符数组，append 平均 O(1)。' },
        { t: 'table', caption: 'String / StringBuilder / StringBuffer',
          head: ['类', '可变？', '线程安全？', '适用场景'],
          rows: [
            ['<code>String</code>', '不可变', '天然安全（不可变对象可共享）', '少量拼接、键值、常量'],
            ['<code>StringBuilder</code>', '可变', '否（快）', '单线程循环拼接、构造输出'],
            ['<code>StringBuffer</code>', '可变', '是（synchronized，慢）', '老的并发场景，新代码基本不用']
          ] },
        { t: 'code', run: false, caption: '本站引擎不支持 StringBuilder，以下为真实 JDK 运行结果',
          code: `public class BuildDemo {
    public static void main(String[] args) {
        // 循环拼接：String 版本（每次 += 都新建对象）
        String s = "";
        for (int i = 0; i < 5; i++) s += i;

        // StringBuilder 版本（同一个可变缓冲区）
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 5; i++) sb.append(i).append('-');
        sb.deleteCharAt(sb.length() - 1);
        sb.reverse();

        System.out.println(s);
        System.out.println(sb.toString());
    }
}

// 真实 JDK 输出：
// 01234
// 4-3-2-1-0` },
        { t: 'p', html: '本站引擎没有 StringBuilder，但你可以用「字符数组 + 自己维护长度」达到同样效果，'
            + '下面这段可运行代码就是 StringBuilder 的迷你版——理解它，你就理解了「为什么可变缓冲区更快」。' },
        { t: 'code', caption: '可运行：用 char[] 手写一个简易 StringBuilder（本站引擎支持）',
          code: `public class MiniBuilder {
    static char[] buf = new char[16];
    static int len = 0;

    static void append(String s) {
        for (int i = 0; i < s.length(); i++) {
            if (len == buf.length) grow();
            buf[len++] = s.charAt(i);
        }
    }

    static void grow() {
        char[] bigger = new char[buf.length * 2];
        for (int i = 0; i < len; i++) bigger[i] = buf[i];
        buf = bigger;
    }

    static String value() {
        String out = "";
        for (int i = 0; i < len; i++) out += buf[i];
        return out;
    }

    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) append("item" + i + ";");
        System.out.println(value());
        System.out.println("len=" + len + " capacity=" + buf.length);
    }
}` },
        { t: 'h', text: '内部类：把助手类藏进使用者内部' },
        { t: 'p', html: '内部类是定义在另一个类里面的类，常见四种：成员内部类、静态嵌套类、局部类、匿名类。'
            + '它的价值是<b>逻辑归属</b>：一个类只服务于外部类时，写在里面比另起一个文件更清晰；'
            + '内部类还能直接访问外部类的私有成员。本站引擎不支持自定义内部类，'
            + '但真实工程里到处是它的身影。' },
        { t: 'code', run: false, caption: '本站引擎不支持内部类，以下为真实 JDK 运行结果',
          code: `public class Outer {
    private int base = 10;

    // 静态嵌套类：不依赖外部实例
    static class Helper {
        static int add(int a, int b) { return a + b; }
    }

    // 成员内部类：可以直接用外部类的字段
    class Inner {
        int plus(int x) { return base + x; }
    }

    public static void main(String[] args) {
        System.out.println(Helper.add(1, 2));
        Outer o = new Outer();
        Outer.Inner in = o.new Inner();
        System.out.println(in.plus(5));
    }
}

// 真实 JDK 输出：
// 3
// 15` },
        { t: 'h', text: 'lambda 与 Stream：把「操作」当参数传' },
        { t: 'p', html: 'Java 8 引入 lambda 表达式，让「行为」可以像值一样传递。'
            + '例如 <code>list.forEach(x -&gt; System.out.println(x))</code> 把「打印」这个动作传给 forEach。'
            + '配合 <code>stream()</code> 可以写出声明式的数据处理链：'
            + '筛选 filter、转换 map、排序 sorted、收集 collect。'
            + '代价是可读性与调试难度：链式调用出错时，栈信息不如 for 循环直观。' },
        { t: 'code', run: false, caption: '本站引擎不支持 lambda 与 Stream，以下为真实 JDK 运行结果',
          code: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class LambdaDemo {
    public static void main(String[] args) {
        List<Integer> nums = Arrays.asList(5, 1, 4, 2, 3);

        // 传统写法
        List<Integer> evens = new ArrayList<Integer>();
        for (int n : nums) if (n % 2 == 0) evens.add(n);
        System.out.println(evens);

        // Stream 写法：filter → sorted → collect
        List<Integer> out = nums.stream()
            .filter(n -> n % 2 == 0)
            .sorted()
            .collect(Collectors.toList());
        System.out.println(out);

        int sum = nums.stream().mapToInt(n -> n).sum();
        System.out.println("sum=" + sum);
    }
}

// 真实 JDK 输出：
// [4, 2]
// [2, 4]
// sum=15` },
        { t: 'p', html: '什么时候该用 Stream？判断标准很朴素：<b>数据处理是一条链</b>（筛选→转换→收集）时用 Stream 很清晰；'
            + '需要复杂控制流、提前 break、需要索引时，老老实实写 for 循环。'
            + '初学者常见错误是为了用 lambda 而用 lambda，把简单逻辑写成天书。' },
        { t: 'code', caption: '可运行：用传统循环完成同样的「筛选 + 平方 + 求和」（本站引擎支持）',
          code: `public class Imperative {
    public static void main(String[] args) {
        int[] nums = {5, 1, 4, 2, 3};
        // 筛选偶数 → 平方 → 求和（等价于 stream().filter().map().sum()）
        int sum = 0;
        String sq = "";
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] % 2 != 0) continue;      // 只保留偶数
            int doubleIt = nums[i] * nums[i];
            sum += doubleIt;
            if (sq.length() > 0) sq += ",";
            sq += doubleIt;
        }
        System.out.println("平方: " + sq);
        System.out.println("sum=" + sum);
    }
}` },
        { t: 'callout', kind: 'tip', html: 'lambda 可以理解为「匿名函数的简写」。'
            + '它必须赋值给一个<b>函数式接口</b>（只有一个抽象方法的接口，如 Runnable、Comparator、Function）。'
            + '看到 <code>list.sort((a, b) -&gt; a - b)</code> 时，脑内翻译成「把比较逻辑传进去」即可。' },
        { t: 'callout', kind: 'note', html: '本站引擎是课程子集，故意的：它保证你专注于算法与数据结构，'
            + '不被工程语法分心。等你写大作业时再回来补这一篇，就会觉得这些语法都是「为了表达力」而生的。' },
        { t: 'p', html: '顺带认识几个更新的 Java 语法：<code>var</code>（局部变量类型推断，Java 10）、'
            + '<b>text block</b> 三引号多行字符串（Java 15）、<b>record</b> 一行定义不可变数据类（Java 16）、'
            + '<b>switch 表达式</b>（Java 14）。它们都不改变程序能力，只让代码更短更清楚。'
            + '遇到看不懂的新写法时，先问「它等价于哪段老代码」，再决定要不要用——'
            + '团队项目里，<b>可读性优先于新语法</b>。' }
      ]
    }
  ],
  finish: '<p><b>怎么继续学：</b>先把收藏的集合框架源码（比如 ArrayList 的 add/grow）挑一两个方法读一遍；'
    + '然后把自己写过的项目里所有「循环里拼字符串」改成 StringBuilder 思路；'
    + '最后找一个开源小项目，用今天学的接口/泛型视角去读它的类结构图。</p>',
  checklist: {
    id: 'adv-java-check',
    items: [
      '能说出 checked / unchecked 异常的区别，并解释 catch 子类必须写在父类前',
      '能解释泛型擦除，以及为什么不能 new T()、不能用泛型数组',
      '能说出 ArrayList / LinkedList / HashMap 各自适用场景与时间复杂度',
      '能解释 HashMap 的桶、哈希冲突、负载因子与扩容',
      '知道 StringBuilder 解决什么问题，lambda / Stream 的取舍是什么'
    ]
  },
  keypoint: {
    items: [
      { title: '异常是带类型的早退信号', html: 'unchecked 是「你写错了」，checked 是「世界不配合」；不要 catch 后吞掉。' },
      { title: '泛型是编译期契约', html: '类型检查在编译期，运行时被擦除；PECS：读 extends，写 super。' },
      { title: '集合先看接口再看实现', html: 'List 有序可重复，Set 去重，Map 键值；ArrayList 随机访问快，HashMap 用 key 查找 O(1)。' },
      { title: 'StringBuilder 是可变缓冲区', html: '循环拼接用 StringBuilder/char[]；Java 8 之后编译器会把简单拼接优化成 StringBuilder。' },
      { title: 'lambda 适合表达「做什么」', html: 'Stream 链式处理清晰，但复杂控制流仍用 for 循环更好读。' }
    ]
  }
});
