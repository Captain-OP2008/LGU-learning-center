/* =====================================================================
 * data/adv-java.js · 进阶轨道 · Java 深度（课程之外的深入学习）
 *
 * 4 个小节：异常处理与自定义异常 / 泛型与集合 / 现代 Java / 反射与注解
 * 说明：这些主题都超出站内 Java 子集引擎的范围，所有 code 块统一 run:false，
 *       caption 标注「本站引擎不支持，以下为真实 JDK 代码/输出」。
 * 注册：CSC.registerAdvanced([...])，独立数组，不进入 21 章主课程与进度。
 * 作者模块：adv
 * ===================================================================== */

CSC.registerAdvanced([
{
  id: 'java-deep',
  order: 1,
  title: 'Java 深度',
  en: 'JAVA IN DEPTH',
  part: 'ADVANCED',
  icon: 'layers',
  level: '进阶',
  minutes: 96,
  blurb: '把课程里的 Java 子集补成工程里能用的 Java：异常、泛型与集合、现代语法、反射与注解。',
  tagline: '课程教了「能写出正确程序」的那部分 Java；这一篇补上真实项目里绕不开的四块。',
  prereq: ['ch04', 'ch06', 'ch07'],
  intro: '<p>主课程为了让你专注算法与项目，只保留了 Java 的一个子集：异常基本靠 <code>throws</code> 甩给 main，'
    + '集合只用到 <code>ArrayList</code>，注解只见过 <code>@Override</code>，更没碰过反射。'
    + '可一旦你打开真实项目、LeetCode 题解或开源框架的源码，这些「课程之外」的语法会立刻扑面而来。</p>'
    + '<p>这一篇按四块补齐：<b>异常</b>（错误怎么传递和收尾）、<b>泛型与集合</b>（容器为什么既通用又类型安全）、'
    + '<b>现代 Java</b>（var / record / switch 表达式 / Stream）、<b>反射与注解</b>（框架到底在背后做了什么）。'
    + '每一节都从课程里你已经写过的那一行代码出发，再往前走一步。</p>',
  goals: [
    '能区分 checked / unchecked 异常，并为聊天室的 ClientHandler 设计一套「断开—清理—广播」的收尾流程',
    '能解释泛型擦除，说清 ArrayList / LinkedList / HashMap 的取舍与 equals / hashCode 契约',
    '能读懂并改写 var、record、switch 表达式、Stream 链，知道什么时候不该用',
    '能解释 @Override 到底做了什么，并用 Class + 自定义注解写一个 20 行的迷你测试运行器'
  ],
  sections: [

    /* ---------------------------------------------------------------- S1 异常 */
    {
      id: 'adv-java-1',
      title: '异常处理与自定义异常',
      en: 'EXCEPTIONS',
      minutes: 24,
      html: '课程里第一次见 <code>IOException</code>，是在 Socket 代码的 <code>throws IOException</code> 上；'
        + '本节把「把异常甩给 main」补成真正的错误处理。',
      blocks: [
        { t: 'p', lead: true, html: '课程里你写 Socket 时，几乎每个 <code>main</code> 后面都跟着 '
            + '<code>throws IOException</code>（Tutorial 3 的 Server / Client 都是这样）。'
            + '这行代码的意思是：<b>本方法不处理，谁调用谁负责</b>。可 <code>main</code> 已经是最后一站，'
            + '所以它实际上等于「出错就打印栈、结束程序」。单机 demo 没问题；聊天室里有几十个客户端时，'
            + '一个 <code>readLine()</code> 失败就会让一个服务端线程死掉，而其他客户端还在等广播。' },
        { t: 'p', html: 'Java 把「出错」分成两支：<b>Error</b>（JVM 级灾难，如 <code>OutOfMemoryError</code>，'
            + '不该 catch）和 <b>Exception</b>。Exception 又分<b>受检异常（checked exception）</b>与'
            + '<b>非受检异常（unchecked exception，即 RuntimeException 及其子类）</b>。'
            + '区别只有一条：编译器是否强制你处理。' },
        { t: 'table', caption: 'checked vs unchecked：一句话记住「谁该负责」',
          head: ['对比维度', 'checked（受检）', 'unchecked（非受检）'],
          rows: [
            ['代表类型', '<code>IOException</code>、<code>SQLException</code>', '<code>NullPointerException</code>、<code>ArrayIndexOutOfBoundsException</code>、<code>NumberFormatException</code>'],
            ['编译器', '不 try/catch 或不 throws 就编译失败', '不强制，编译器不管'],
            ['含义', '外部世界不配合：文件、网络、数据库', '代码写错了：空指针、越界、类型转换'],
            ['策略', '就地恢复，或包装后上报，必须给调用方一个交代', '修 bug，而不是 catch 后继续跑']
          ] },
        { t: 'p', html: '<code>try</code> 包住可能出错的代码，<code>catch</code> 按类型分别处理，'
            + '<code>finally</code> 无论是否异常都会执行。两个硬规则：<b>子类 catch 必须写在父类前面</b>'
            + '（否则父类先截胡，编译器直接报错）；<b>finally 里不要写 return</b>，它会吞掉 try 里的返回值。' },
        { t: 'code', run: false, caption: '本站引擎不支持 try/catch，以下为真实 JDK 代码',
          code: `import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

public class ParsePort {
    public static void main(String[] args) {
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader("server.properties"));
            String port = reader.readLine();
            int p = Integer.parseInt(port.trim());       // 可能 NumberFormatException
            System.out.println("port = " + p);
        } catch (FileNotFoundException e) {              // 子类在前
            System.out.println("配置文件不存在：" + e.getMessage());
        } catch (IOException e) {                        // 父类在后
            System.out.println("读取配置失败：" + e.getMessage());
        } catch (NumberFormatException e) {              // unchecked 也可以接
            System.out.println("端口不是数字：" + e.getMessage());
        } finally {
            System.out.println("finally 一定执行：这里做清理");
            if (reader != null) {
                try { reader.close(); } catch (IOException ignored) { }
            }
        }
    }
}` },
        { t: 'p', html: '手动 close 的样板代码又长又容易漏：<code>reader</code> 可能为 null，close 本身也可能抛异常。'
            + '<b>try-with-resources</b>（Java 7）把「声明资源」写进 try 的圆括号，离开作用域时按<b>声明的逆序</b>'
            + '自动调用 <code>close()</code>，前提是资源实现 <code>AutoCloseable</code>。'
            + '如果 try 体和 close 都抛异常，close 的异常会被<b>抑制（suppressed）</b>，挂在主异常上，不丢信息。' },
        { t: 'code', run: false, caption: '本站引擎不支持 try-with-resources，以下为真实 JDK 代码',
          code: `import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.Closeable;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;

public class Client implements Closeable {
    private final Socket socket;
    private final BufferedReader in;
    private final BufferedWriter out;

    public Client(String host, int port) throws IOException {
        this.socket = new Socket(host, port);
        this.in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.out = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
    }

    public void send(String msg) throws IOException {
        out.write(msg);
        out.newLine();
        out.flush();                 // 不 flush，消息可能留在缓冲区里
    }

    @Override
    public void close() throws IOException {
        socket.close();              // 关闭 socket 会连带关闭两条流
    }

    public static void main(String[] args) {
        try (Client c = new Client("localhost", 1004)) {   // 离开 try 自动 close()
            c.send("hello");
        } catch (IOException e) {
            System.out.println("连接失败：" + e.getMessage());
        }
    }
}` },
        { t: 'p', html: '自定义异常只要继承 <code>Exception</code>（checked）或 <code>RuntimeException</code>（unchecked）。'
            + '工程上更常用 checked 的业务异常，强迫调用方处理；构造器里 <code>super(message)</code> 保留消息，'
            + '<code>super(message, cause)</code> 保留根因。捕获底层异常后<b>包装再抛</b>，'
            + '也就是异常转换（exception translation），'
            + '能让上层只认识自己的业务类型，排查时再用 <code>getCause()</code> 追根。' },        { t: 'code', run: false, caption: '本站引擎不支持自定义异常与多线程，以下为真实 JDK 代码',
          code: `import java.io.BufferedReader;
import java.io.IOException;
import java.net.Socket;

class ChatException extends Exception {
    ChatException(String message) { super(message); }
    ChatException(String message, Throwable cause) { super(message, cause); }
}

public class ClientHandler implements Runnable {
    private final Socket socket;
    private final String username;
    private final BufferedReader in;

    // 构造器省略：in = new BufferedReader(new InputStreamReader(socket.getInputStream()))

    @Override
    public void run() {
        try {
            String line;
            while ((line = in.readLine()) != null) {   // 对端正常关闭时返回 null
                Server.broadcast(username + ": " + line);
            }
        } catch (IOException e) {
            // 连接被重置 / 客户端强制退出：这是业务事件，不是程序 bug
            System.out.println(username + " 断开：" + e.getMessage());
        } finally {
            Server.remove(this);                       // 必须移除，否则广播会写到死 socket
            Server.broadcast(username + " 离开了聊天室");
            try { socket.close(); } catch (IOException ignored) { }
        }
    }
}` },
        { t: 'p', html: '回到聊天室：为什么每个 <code>ClientHandler.run()</code> 都必须处理 <code>IOException</code>？'
            + '三个具体原因。① <code>readLine()</code> 在客户端正常关闭时返回 <code>null</code>，'
            + '在网络中断时抛 <code>SocketException</code>，两者都意味着「这个连接结束了」；'
            + '② 不 catch 的话线程直接终止，但 <code>clientHandlers</code> 里还留着这个对象，'
            + '下一次广播会往已关闭的 socket 写数据，再抛一次异常，可能把广播逻辑一起带崩；'
            + '③ 不 close 会泄漏文件描述符，连接越积越多。正确做法是 <code>finally</code> 里移除自己、'
            + '广播「离开」、关闭 socket。' },
        { t: 'callout', kind: 'warn', html: '最坏的写法是 <code>catch (IOException e) { }</code>：连接断了、消息没发出去，'
            + '日志里却什么都没有。至少打印「谁、在做什么、失败原因」，否则线上排查只能靠猜。' },
        { t: 'callout', kind: 'tip', html: '判断要不要 catch 的标准不是「编译器让不让」，而是「这个错误我能不能在这里做点有意义的事」。'
            + '能恢复就恢复；不能就带上上下文往上抛，或转成业务异常。' }
      ]
    },

    /* ---------------------------------------------------------------- S2 泛型与集合 */
    {
      id: 'adv-java-2',
      title: '泛型与集合',
      en: 'GENERICS & COLLECTIONS',
      minutes: 26,
      html: '课程里唯一的泛型集合是聊天室的 <code>ArrayList&lt;ClientHandler&gt;</code>；本节补上类型擦除、'
        + 'ArrayList / LinkedList 的取舍，以及 HashMap 的原理与坑。',
      blocks: [
        { t: 'p', lead: true, html: '课程里唯一大量出现的泛型是聊天室的 '
            + '<code>ArrayList&lt;ClientHandler&gt; clientHandlers</code>（Tutorial 4）：每个连接进来就 add，'
            + '广播时 for 循环遍历。课程没解释尖括号是什么，也没讲这个列表被多个线程同时改会怎样'
            + '（那是下一个模块的事）。这一节先把「容器」这一层补完整：'
            + '<b>泛型（generics）</b>让编译器替你检查类型，<b>集合（collections）</b>让你按操作特点选容器。' },
        { t: 'p', html: '没有泛型时，容器装的是 <code>Object</code>：<code>list.add("hello")</code> 能编译，'
            + '<code>String s = (String) list.get(0)</code> 要强转；一旦放错类型，'
            + '<code>ClassCastException</code> 要到运行时才炸。泛型把类型参数写在尖括号里，'
            + '<b>编译期</b>就检查，取值也不用强转。接口 <code>List&lt;T&gt;</code> 管「有序、可重复」，'
            + '<code>Map&lt;K,V&gt;</code> 管「键唯一、按键查找」；声明变量时面向接口'
            + '（<code>List&lt;String&gt; list = new ArrayList&lt;&gt;()</code>），换实现只改一行。' },
        { t: 'p', html: 'Java 的泛型是<b>编译期特性</b>：编译后 <code>ArrayList&lt;String&gt;</code> 与 '
            + '<code>ArrayList&lt;Integer&gt;</code> 都变成 <code>ArrayList</code>，类型参数被'
            + '<b>类型擦除（type erasure）</b>掉。这解释了几个「为什么不行」：不能 <code>new T()</code>、'
            + '不能 <code>new T[10]</code>、不能 <code>instanceof List&lt;String&gt;</code>、不能按泛型参数重载。'
            + '还有一个坑：<code>ArrayList&lt;int&gt;</code> 不合法，必须写 <code>ArrayList&lt;Integer&gt;</code>；'
            + '自动装箱后 <code>Integer</code> 在 -128~127 有缓存，比较值请用 <code>equals</code> 或先转 <code>int</code>。' },
        { t: 'p', html: '<b>ArrayList</b> 底层是数组：按下标 O(1)，中间插入/删除要搬元素 O(n)，'
            + '扩容时复制到 1.5 倍新数组。<b>LinkedList</b> 底层是双向链表：头尾插入 O(1)，'
            + '按下标取要逐个走 O(n)。很多教程说「插入多用 LinkedList」，但<b>先找到位置</b>就已经 O(n)；'
            + '除了队列式头尾操作或迭代器边遍历边删，ArrayList 几乎总是更快、更省内存。' },
        { t: 'table', caption: '常见操作复杂度（平均情况）',
          head: ['操作', 'ArrayList', 'LinkedList', 'HashMap / HashSet'],
          rows: [
            ['按下标访问', '<b>O(1)</b>', 'O(n)', '—（Map 用 key）'],
            ['尾部追加', 'O(1) 摊销', '<b>O(1)</b>', 'O(1) 摊销'],
            ['头部插入', 'O(n)', '<b>O(1)</b>', '—'],
            ['按值查找', 'O(n)', 'O(n)', '<b>O(1)</b>（用 key 查）'],
            ['删除已知节点', 'O(n)', '<b>O(1)</b>', 'O(1)']
          ] },
        { t: 'p', html: '<b>HashMap</b> 是「桶数组 + 哈希」：先对 <code>key.hashCode()</code> 做扰动'
            + '（<code>h ^ (h &gt;&gt;&gt; 16)</code>），再用 <code>(n - 1) &amp; hash</code> 定位桶；'
            + '冲突的键挂在链表上，链表长度到 8 且桶数组够大时转红黑树，降到 6 再退回链表。'
            + '元素数超过「容量 × 负载因子（默认 0.75）」就扩容为两倍并重新分配。'
            + '所以平均查找 O(1)，最坏 O(log n)。' },
        { t: 'p', html: '自定义类当 key 时，<code>equals</code> 与 <code>hashCode</code> 必须<b>同时</b>正确重写，'
            + '并遵守契约：<code>equals</code> 相等则 <code>hashCode</code> 必须相等。只重写 <code>equals</code>，'
            + '两个「相等」的对象会落进不同桶，<code>get</code> 永远返回 null。'
            + 'key 还必须是<b>不可变</b>对象——放进去后再改字段，哈希值变了，就再也找不回来。' },
        { t: 'callout', kind: 'tip', html: '预估元素数量时，给 <code>HashMap</code> 一个合适的初始容量'
            + '（要放 1000 个元素可以写 <code>new HashMap&lt;&gt;(2048)</code>），能少几次扩容和 rehash；'
            + '遍历时用 <code>entrySet()</code>，不要 <code>keySet()</code> 再逐个 <code>get</code>。' },
        { t: 'code', run: false, caption: '本站引擎不支持泛型通配与自定义 equals，以下为真实 JDK 代码',
          code: `import java.util.HashMap;

class User {
    private final String name;

    User(String name) { this.name = name; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        return name.equals(((User) o).name);
    }

    @Override
    public int hashCode() {
        return name.hashCode();       // 与 equals 使用同一组字段
    }
}

public class UserKey {
    public static void main(String[] args) {
        HashMap<User, Integer> scores = new HashMap<User, Integer>();
        scores.put(new User("alice"), 90);

        // 两个 new User("alice") 的 equals 为 true、hashCode 相同，所以能查到
        System.out.println(scores.get(new User("alice")));   // 90

        // 若删掉 hashCode()，上面这行返回 null：equals 相等，但散列到了不同桶
    }
}` },
        { t: 'code', run: false, caption: '本站引擎不支持 HashMap 的 getOrDefault，以下为真实 JDK 代码',
          code: `import java.util.HashMap;
import java.util.Map;

public class WordCount {
    public static void main(String[] args) {
        String[] messages = {"hi", "gomoku?", "hi", "snake", "hi"};
        Map<String, Integer> freq = new HashMap<String, Integer>();

        for (String m : messages) {
            // getOrDefault：key 不存在时返回默认值，省掉 containsKey 分支
            freq.put(m, freq.getOrDefault(m, 0) + 1);
        }

        System.out.println(freq);             // {snake=1, hi=3, gomoku?=1}
        System.out.println(freq.get("hi"));   // 3
        System.out.println(freq.get("nope")); // null：get 不存在的 key 不报错
    }
}` },
        { t: 'code', run: false, caption: '本站引擎不支持 System.nanoTime 与 LinkedList，以下为真实 JDK 代码',
          code: `import java.util.ArrayList;
import java.util.LinkedList;

public class ListBench {
    public static void main(String[] args) {
        int n = 100000;
        ArrayList<Integer> array = new ArrayList<Integer>();
        LinkedList<Integer> linked = new LinkedList<Integer>();

        long t0 = System.nanoTime();
        for (int i = 0; i < n; i++) array.add(0, i);      // 头插：每次搬整个数组
        long t1 = System.nanoTime();
        for (int i = 0; i < n; i++) linked.addFirst(i);   // 头插：只改两个指针
        long t2 = System.nanoTime();

        System.out.println("ArrayList 头插 " + (t1 - t0) / 1000000 + " ms");
        System.out.println("LinkedList 头插 " + (t2 - t1) / 1000000 + " ms");
    }
}` },
        { t: 'callout', kind: 'warn', html: '课程项目里如果想把 <code>ClientHandler</code> 放进 <code>HashSet</code> 去重，'
            + '先想清楚「两个 handler 什么时候算相等」：是同一个 socket，还是同一个用户名？'
            + '想不清就别用 Set，用 List + 显式判断。' }
      ]
    },

    /* ---------------------------------------------------------------- S3 现代 Java */
    {
      id: 'adv-java-3',
      title: '现代 Java：var、record、switch 表达式与 Stream',
      en: 'MODERN JAVA',
      minutes: 24,
      html: '课程代码还是 Java 8 之前的风格：显式类型、if-else 链、匿名类。本节看 Java 10–16 的四个新写法，'
        + '以及它们各自的边界。',
      blocks: [
        { t: 'p', lead: true, html: '课程里的代码是典型的「老派 Java」：<code>BufferedReader reader = new BufferedReader(...)</code> '
            + '写两遍类型，消息分类用 <code>if / else if</code>，事件处理器用匿名内部类（Tutorial 7 才把它改写成 lambda），'
            + 'JavaFX 示例里偶尔出现 <code>var canvas = new Canvas(300, 300)</code>（lecture 7）。'
            + '这一节把 Java 10–16 最常用的四个新写法讲清楚：它们不改变程序能力，只改变表达方式。' },
        { t: 'p', html: '<b>var</b>（Java 10）是<b>局部变量类型推断（local variable type inference）</b>：'
            + '编译器根据右边的表达式推断类型，推断结果仍然是静态类型，不是 JavaScript 那种动态变量。'
            + '它只能用于局部变量、必须初始化、不能用于字段/方法参数/返回值。'
            + '类型一眼可见时用 var 更清爽（<code>var reader = new BufferedReader(...)</code>）；'
            + '右边是 <code>get()</code>、<code>map()</code> 这类看不出类型时，写全类型更好读。' },
        { t: 'p', html: '<b>record</b>（Java 16）是「不可变数据载体」：一行声明字段，编译器自动生成构造器、'
            + '访问器（<code>x()</code> 而不是 <code>getX()</code>）、<code>equals</code>、<code>hashCode</code>、'
            + '<code>toString</code>。它适合坐标、消息、配置这类「只有数据、没有行为」的类；'
            + '字段天然 final，不能继承别的类。需要校验就写<b>紧凑构造器（compact constructor）</b>，'
            + '只写检查逻辑，赋值由编译器补。' },
        { t: 'p', html: '<b>switch 表达式</b>（Java 14）把 switch 从「语句」变成「有返回值的表达式」：'
            + '用 <code>-&gt;</code> 代替冒号，<b>不会穿透</b>，不需要 break；分支多行时用 <code>yield</code> 返回值。'
            + '它还能配合 enum 做穷尽性检查——少写一个分支编译器就报错。课程里那种「忘了 break 导致穿透」的 bug，'
            + '在新写法里从语法层面消失了。' },
        { t: 'p', html: '<b>Stream</b> 是「声明式的数据处理链」：<code>filter</code> 筛选、<code>map</code> 转换、'
            + '<code>collect</code> 收集，读起来像在描述「要什么」而不是「怎么循环」。'
            + '它惰性求值（没有终止操作就什么也不做）、只能消费一次、不修改原集合。'
            + '判断标准很朴素：<b>数据处理是一条链</b>时用 Stream 很清晰；需要提前 break、需要下标、'
            + '逻辑里有复杂分支时，for 循环更好读。' },
        { t: 'p', html: '<b>Optional</b> 一句话带过：它用类型表达「这里可能没有值」，'
            + '逼调用方显式处理缺失（<code>orElse</code> / <code>orElseThrow</code> / <code>map</code>）。'
            + '不要用 <code>get()</code> 裸取——缺失时抛 <code>NoSuchElementException</code>，'
            + '只是把 null 换了个壳；也不要把 Optional 当字段或方法参数用。' },
        { t: 'table', caption: '同一段逻辑的两种写法',
          head: ['场景', '课程里的写法', '现代写法'],
          rows: [
            ['声明变量', '<code>ArrayList&lt;String&gt; list = new ArrayList&lt;String&gt;()</code>', '<code>var list = new ArrayList&lt;String&gt;()</code>'],
            ['数据类', '字段 + 构造器 + getter + toString + equals', '<code>record Point(int x, int y) { }</code>'],
            ['多分支', '<code>switch</code> + <code>break</code>，怕穿透', '<code>return switch (x) { case 1 -&gt; "a"; ... }</code>'],
            ['筛选转换', 'for + if + 新建 List', '<code>list.stream().filter(...).map(...).collect(...)</code>'],
            ['可能缺失', '返回 null，调用方忘了判空', '<code>Optional&lt;T&gt;</code> + <code>orElse</code>']
          ] },
        { t: 'code', run: false, caption: '本站引擎不支持 switch 表达式与 var，以下为真实 JDK 代码',
          code: `public class Grade {
    // 旧写法：switch 语句 + break，忘了 break 就穿透
    static String oldLevel(int score) {
        String level;
        switch (score / 10) {
            case 10:
            case 9: level = "A"; break;
            case 8: level = "B"; break;
            default: level = "F";
        }
        return level;
    }

    // 新写法（Java 14+）：箭头不穿透，直接返回值
    static String newLevel(int score) {
        return switch (score / 10) {
            case 10, 9 -> "A";
            case 8 -> "B";
            case 7 -> "C";
            default -> "F";
        };
    }

    public static void main(String[] args) {
        var scores = new int[]{95, 85, 72, 50};   // var 推断为 int[]
        for (var s : scores) {                     // var 推断为 int
            System.out.println(s + " -> " + newLevel(s));
        }
    }
}` },
        { t: 'code', run: false, caption: '本站引擎不支持 record，以下为真实 JDK 代码',
          code: `// record：自动生成构造器、x()/y() 访问器、equals、hashCode、toString
record Point(int x, int y) {
    // 紧凑构造器：只写校验，不用写 this.x = x
    Point {
        if (x < 0 || y < 0) throw new IllegalArgumentException("坐标不能为负");
    }

    Point move(int dx, int dy) { return new Point(x + dx, y + dy); }
}

public class RecordDemo {
    public static void main(String[] args) {
        Point p = new Point(3, 4);
        System.out.println(p);                          // Point[x=3, y=4]
        System.out.println(p.move(1, 1));               // Point[x=4, y=5]
        System.out.println(p.equals(new Point(3, 4)));  // true
    }
}` },
        { t: 'code', run: false, caption: '本站引擎不支持 lambda 与 Stream，以下为真实 JDK 代码',
          code: `import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ChatStream {
    public static void main(String[] args) {
        List<String> messages = new ArrayList<String>();
        messages.add("alice: hi");
        messages.add("bob: hi");
        messages.add("alice: gomoku?");
        messages.add("cid: snake");

        // 筛选 alice 的消息 -> 取出正文 -> 收集成新 List
        List<String> fromAlice = messages.stream()
            .filter(m -> m.startsWith("alice:"))
            .map(m -> m.substring("alice:".length()).trim())
            .collect(Collectors.toList());
        System.out.println(fromAlice);        // [hi, gomoku?]

        long count = messages.stream().filter(m -> m.contains("hi")).count();
        System.out.println("含 hi 的消息数 = " + count);
    }
}` },
        { t: 'code', run: false, caption: '本站引擎不支持 Optional，以下为真实 JDK 代码',
          code: `import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class FindUser {
    private static final Map<String, String> USERS = new HashMap<String, String>();

    static {
        USERS.put("alice", "Alice Chen");
        USERS.put("bob", "Bob Li");
    }

    static Optional<String> findDisplayName(String id) {
        return Optional.ofNullable(USERS.get(id));
    }

    public static void main(String[] args) {
        System.out.println(findDisplayName("alice").orElse("未知用户"));
        System.out.println(findDisplayName("nobody").orElse("未知用户"));
        // 不要写 findDisplayName(id).get()：缺失时抛异常，等于 null 换了个壳
    }
}` },
        { t: 'callout', kind: 'warn', html: '新语法不是越多越好。团队项目里，<b>可读性优先于新语法</b>：'
            + '<code>var</code> 让类型更难看出时别用；Stream 链超过三行就拆回 for 循环；'
            + 'record 只用于真正的数据载体，不要把有状态的业务类硬改成 record。' }
      ]
    },

    /* ---------------------------------------------------------------- S4 反射与注解 */
    {
      id: 'adv-java-4',
      title: '反射与注解',
      en: 'REFLECTION & ANNOTATIONS',
      minutes: 22,
      html: '课程里每个 <code>@Override</code> 都只是「照着写」，没人解释谁在读它；本节把注解和反射连起来，'
        + '看框架到底在背后做了什么。',
      blocks: [
        { t: 'p', lead: true, html: '课程里你已经在用注解（annotation）了：JavaFX 的 <code>start(Stage)</code> 上写 '
            + '<code>@Override</code>，Tutorial 4 的匿名 <code>Runnable</code> 里也写 <code>@Override</code>。'
            + '但课程没讲它是什么、谁在读它、不写会怎样。更没讲<b>反射（reflection）</b>——'
            + '而反射正是「框架为什么能自动干活」的答案。这一节把这两件事连起来。' },
        { t: 'p', html: '每个类被 JVM 加载后，方法区里会有一个 <b>Class 对象</b>描述它：类名、字段、方法、构造器、注解。'
            + '拿到 Class 对象有三种方式：<code>String.class</code>（类字面量）、<code>obj.getClass()</code>（运行时类型）、'
            + '<code>Class.forName("java.lang.String")</code>（按全限定名加载）。'
            + '有了它，你就能在<b>运行时</b>查询甚至调用一个编译时并不知道的类。' },
        { t: 'p', html: '常用 API 分两组：查询用 <code>getMethods()</code>（含继承的 public 方法）、'
            + '<code>getDeclaredMethods()</code>（本类声明的全部方法，含 private）、<code>getDeclaredFields()</code>、'
            + '<code>getConstructor(...)</code>；调用用 <code>newInstance()</code> / <code>invoke(obj, args)</code>。'
            + '私有成员默认不可访问，需要 <code>setAccessible(true)</code> 绕过检查（模块系统下可能被拒绝）。'
            + '代价是：跳过编译期检查、性能低于直接调用、破坏封装，所以业务代码少用，框架代码才用。' },
        { t: 'p', html: '现在回答 <code>@Override</code> 到底做了什么：它什么代码都不生成，'
            + '只告诉<b>编译器</b>「这个方法应该重写父类或接口里的方法」。编译器据此检查签名；'
            + '如果方法名拼错（<code>tostring</code>）、参数列表不匹配，编译直接失败。'
            + '它的保留策略是 <code>SOURCE</code>，编译后就消失，所以运行时反射也看不到它。'
            + '换句话说，它是一张<b>给编译器的便条</b>，不是给 JVM 的指令。' },
        { t: 'p', html: '自定义注解则是「给框架的便条」。用 <code>@Retention(RUNTIME)</code> 让它保留到运行期，'
            + '用 <code>@Target</code> 限定能贴在哪，再用反射的 <code>getAnnotation</code> 读出来。'
            + 'JUnit 靠它找 <code>@Test</code> 方法，Spring 靠它扫描 <code>@Component</code> 并注入依赖，'
            + 'Jackson 靠它读字段名做 JSON 序列化，JavaFX 的 <code>FXMLLoader</code> 靠它把 FXML 里的 '
            + '<code>fx:id</code> 注入 controller 的 <code>@FXML</code> 字段（见 JavaFX 进阶那一篇）。'
            + '共同点：<b>框架在编译时不知道你的类</b>，只能在运行时读注解、找方法、造对象。'
            + '这也解释了为什么改一个注解的保留策略，框架会突然「看不见」你的类。' },
        { t: 'table', caption: '注解的三种保留策略：谁能看到它',
          head: ['策略', '保留到哪', '典型用途', '反射可见？'],
          rows: [
            ['<code>SOURCE</code>', '只在源码，编译后丢弃', '<code>@Override</code>、<code>@SuppressWarnings</code>', '否'],
            ['<code>CLASS</code>', '保留在 .class，但 JVM 加载时不读', '字节码工具、编译期处理', '否（默认）'],
            ['<code>RUNTIME</code>', '保留到运行期', '<code>@Test</code>、<code>@FXML</code>、<code>@Component</code>', '<b>是</b>']
          ] },
        { t: 'code', run: false, caption: '本站引擎不支持注解，以下为真实 JDK 的编译错误示意',
          code: `public class OverrideDemo {
    static class Base {
        public String toString() { return "Base"; }
    }

    static class Child extends Base {
        // 想重写 toString，却把方法名写成了 tostring
        // @Override
        public String tostring() { return "Child"; }
    }

    public static void main(String[] args) {
        Base b = new Child();
        System.out.println(b);        // 仍然输出 Base：tostring 不是重写

        // 如果打开上面那行 @Override，编译器会报：
        // method does not override or implement a method from a supertype
    }
}` },
        { t: 'code', run: false, caption: '本站引擎不支持反射，以下为真实 JDK 代码',
          code: `import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class ClassInfo {
    static class ClientHandler {
        private String username = "alice";
        public void send(String msg) { System.out.println(username + ": " + msg); }
        private void kick() { System.out.println("kick " + username); }
    }

    public static void main(String[] args) {
        Class<?> c = ClientHandler.class;              // 方式一：类字面量
        System.out.println(c.getName());               // ClassInfo$ClientHandler

        for (Method m : c.getDeclaredMethods()) {      // 本类声明的全部方法（含 private）
            System.out.println("method: " + m.getName()
                + " 参数数=" + m.getParameterCount());
        }
        for (Field f : c.getDeclaredFields()) {
            System.out.println("field: " + f.getName()
                + " 类型=" + f.getType().getSimpleName());
        }
    }
}` },
        { t: 'code', run: false, caption: '本站引擎不支持反射，以下为真实 JDK 代码',
          code: `import java.lang.reflect.Method;

public class InvokePrivate {
    public static void main(String[] args) throws Exception {
        Class<?> c = Class.forName("InvokePrivate$Secret");   // 方式三：按全限定名加载
        Object obj = c.getDeclaredConstructor().newInstance();

        Method m = c.getDeclaredMethod("hidden", String.class);
        m.setAccessible(true);            // 绕过 private 检查（模块系统下可能被拒绝）
        Object result = m.invoke(obj, "CSC1004");
        System.out.println(result);
    }

    static class Secret {
        private String hidden(String s) { return "secret:" + s; }
    }
}` },
        { t: 'code', run: false, caption: '本站引擎不支持注解与反射，以下为真实 JDK 代码',
          code: `import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Method;

@Retention(RetentionPolicy.RUNTIME)   // 保留到运行期，反射才读得到
@Target(ElementType.METHOD)
@interface Test { }

public class MiniRunner {
    static class Tests {
        @Test void addWorks() { if (1 + 1 != 2) throw new AssertionError("1+1"); }
        @Test void broken() { throw new AssertionError("故意失败"); }
        void helper() { System.out.println("没有 @Test，不会被调用"); }
    }

    public static void main(String[] args) throws Exception {
        Tests t = new Tests();
        int pass = 0, fail = 0;
        for (Method m : Tests.class.getDeclaredMethods()) {
            if (m.getAnnotation(Test.class) == null) continue;   // 只跑带注解的方法
            try {
                m.invoke(t);
                pass++;
                System.out.println("PASS " + m.getName());
            } catch (Exception e) {
                fail++;
                System.out.println("FAIL " + m.getName() + " -> " + e.getCause());
            }
        }
        System.out.println("pass=" + pass + " fail=" + fail);
    }
}` },
        { t: 'callout', kind: 'warn', html: '反射调用会跳过编译期类型检查，参数类型写错要到运行时才抛 '
            + '<code>IllegalArgumentException</code>；能用 <code>new</code> 和普通方法调用解决，就别用反射。' },
        { t: 'callout', kind: 'note', html: '反射是「框架的魔法棒」，也是「调试的噩梦」：一个方法明明没被调用，'
            + '却因为注解被框架反射执行了。看到 <code>NoSuchMethodException</code> 或注入的字段为 null 时，'
            + '先怀疑名字拼写、访问权限、注解保留策略这三件事。' }
      ]
    }
  ],
  finish: '<p><b>怎么继续：</b>把聊天室项目里所有 <code>throws IOException</code> 改成 try-with-resources；'
    + '给 <code>ClientHandler</code> 写一个 <code>equals</code> 再想想该不该放进 Set；'
    + '找一个开源小项目，用 <code>getDeclaredMethods</code> 把它的 controller 方法列一遍，'
    + '你会突然看懂框架的「自动」是怎么回事。</p>',
  checklist: {
    id: 'java-deep-check',
    items: [
      '能说出 checked / unchecked 的区别，并解释 catch 子类为什么必须写在父类前',
      '能用 try-with-resources 改写课程里的 Socket / BufferedReader 代码',
      '能解释泛型擦除，以及为什么不能 new T()、不能用泛型数组',
      '能说出 ArrayList / LinkedList / HashMap 的适用场景与复杂度',
      '能解释 equals / hashCode 契约，以及自定义 key 为什么必须不可变',
      '能读懂 var、record、switch 表达式、Stream 链，并说出各自的边界',
      '能解释 @Override 的保留策略，并用反射 + 自定义注解写一个迷你 runner'
    ]
  },
  keypoint: {
    items: [
      { title: '异常是带类型的早退信号', html: 'checked 是「世界不配合」，unchecked 是「你写错了」；catch 后不要吞掉，finally 负责收尾。' },
      { title: '泛型只活到编译期', html: '类型检查在编译期，运行时被擦除；容器声明面向接口，选实现看操作复杂度。' },
      { title: 'HashMap 靠 hashCode 找桶', html: 'equals 相等则 hashCode 必须相等；key 要不可变，扩容看负载因子 0.75。' },
      { title: '新语法为了表达力', html: 'var 省类型、record 省样板、switch 表达式防穿透、Stream 描述数据流；可读性优先。' },
      { title: '注解是给编译器和框架的便条', html: '@Override 只给编译器看（SOURCE）；RUNTIME 注解 + 反射才是框架自动化的基础。' }
    ]
  }
}
]);
