/* =====================================================================
 * data/adv-concur.js · 进阶轨道 · 并发编程进阶（课程之外的深入学习）
 *
 * 3 个小节：线程安全与锁 / 线程池与并发工具 / 并发调试
 * 说明：Thread、synchronized、线程池、jstack 都超出站内 Java 子集引擎范围，
 *       所有 code 块统一 run:false，caption 标注「本站引擎不支持，以下为真实 JDK 代码/输出」。
 * 注册：CSC.registerAdvanced([...])，独立数组，不进入 21 章主课程与进度。
 * 作者模块：adv
 * ===================================================================== */

CSC.registerAdvanced([
{
  id: 'concur-deep',
  order: 2,
  title: '并发编程进阶',
  en: 'CONCURRENCY IN DEPTH',
  part: 'ADVANCED',
  icon: 'cpu',
  level: '进阶',
  minutes: 72,
  blurb: '课程教了「怎么开线程」；这一篇讲「多个线程碰同一份数据时怎么不出错」，以及出错后怎么查。',
  tagline: '从 Thread/Runnable 到锁、线程池、阻塞队列与线程 dump：把聊天室的并发真正写对。',
  prereq: ['ch07', 'ch08', 'ch13'],
  intro: '<p>课程讲并发只到「会开线程」：<code>new Thread(clientHandler).start()</code>，每个客户端一个线程，'
    + '线程五态背一遍，聊天室就能跑起来。可真实项目里，bug 往往不在「开线程」，而在'
    + '<b>多个线程同时读写同一份数据</b>：两个客户端同时上线，<code>clientHandlers</code> 的 <code>add</code> 撞在一起；'
    + '一个线程正在遍历广播，另一个线程刚好把某个 handler 移除——轻则丢消息，重则 '
    + '<code>ConcurrentModificationException</code> 或死锁。</p>'
    + '<p>这一篇补三块：<b>线程安全与锁</b>（怎么让共享状态不出错）、<b>线程池与并发工具</b>'
    + '（怎么管理大量线程、怎么让线程协作）、<b>并发调试</b>（程序卡住时怎么找到卡在哪）。</p>',
  goals: [
    '能说清竞态条件、原子性、可见性分别是什么，并判断一段代码是否线程安全',
    '能用 synchronized / volatile / 原子类分别解决互斥、可见性、计数三类问题',
    '能说出死锁的四个必要条件，并用统一锁顺序避免它',
    '能把聊天室的「每连接一线程」改成线程池 + 阻塞队列广播，并解释这样做的收益',
    '能用 jstack 读线程 dump，定位 BLOCKED / WAITING 线程与死锁'
  ],
  sections: [

    /* ---------------------------------------------------------------- S1 锁 */
    {
      id: 'adv-concur-1',
      title: '线程安全与锁',
      en: 'THREAD SAFETY & LOCKS',
      minutes: 26,
      html: '课程里每个 <code>ClientHandler</code> 是一个线程，它们共享同一个 <code>clientHandlers</code> 列表；'
        + '本节讲这份共享状态为什么危险，以及 synchronized / volatile / 原子类各自解决什么。',
      blocks: [
        { t: 'p', lead: true, html: '课程 lecture 4 讲了线程五态，Tutorial 4 的聊天室给每个连接开一个线程：'
            + '主线程 <code>accept()</code>，子线程跑 <code>ClientHandler.run()</code>，'
            + '所有 handler 塞进同一个 <code>ArrayList</code>。课程没讲的是：这个列表是<b>共享可变状态</b>。'
            + '两个客户端同时上线，两个线程同时 <code>add</code>；一个线程正在 for 循环广播，'
            + '另一个线程刚好 <code>remove</code>——这就是并发 bug 的温床。' },
        { t: 'p', html: '<b>竞态条件（race condition）</b>指程序的正确性依赖线程执行的先后顺序。'
            + '最典型的例子是 <code>count++</code>：它其实是「读 count → 加一 → 写回」三步，'
            + '两个线程可能都读到 0，各自加一写回 1，两次自增只生效一次。'
            + '并发正确性要同时满足三点：<b>原子性（atomicity）</b>——操作不可分割；'
            + '<b>可见性（visibility）</b>——一个线程的修改另一个线程能看见；'
            + '<b>有序性（ordering）</b>——编译器和 CPU 不会把有依赖的指令重排到出错。' },
        { t: 'p', html: '<b>synchronized</b> 同时解决互斥与可见性：进入同步块要先拿到对象的<b>监视器锁（monitor lock）</b>，'
            + '同一把锁同一时刻只允许一个线程进入；退出时把修改刷回主内存，并建立'
            + '<b>happens-before</b> 关系。三种写法：修饰实例方法（锁 <code>this</code>）、'
            + '修饰静态方法（锁 <code>Class</code> 对象）、同步块（锁指定对象，粒度更细）。'
            + '锁是可重入的：同一个线程可以重复拿同一把锁。' },
        { t: 'p', html: '<b>volatile</b> 只保证可见性与禁止重排，<b>不保证原子性</b>：'
            + '适合「一个线程写、多个线程读」的状态标志（如 <code>running</code>），'
            + '但 <code>volatile int count; count++</code> 仍然会丢更新。'
            + '<b>原子类（atomic class）</b>如 <code>AtomicInteger</code> 用 <b>CAS（compare-and-swap）</b>'
            + '在硬件层面完成「比较并交换」，无锁且原子；高并发计数还可以用 <code>LongAdder</code>。'
            + 'CAS 的经典坑是 <b>ABA 问题</b>：值从 A 变 B 又变回 A，CAS 察觉不到中间变化。' },
        { t: 'table', caption: '三种手段各保证什么',
          head: ['手段', '互斥', '可见性', '原子性', '典型场景'],
          rows: [
            ['<code>synchronized</code>', '<b>是</b>', '<b>是</b>', '<b>是</b>（临界区整体）', '复合操作、多个字段要一起改'],
            ['<code>volatile</code>', '否', '<b>是</b>', '否', '停止标志、状态开关、一次性发布'],
            ['<code>AtomicInteger</code>', '否（无锁）', '<b>是</b>', '<b>是</b>（单个变量）', '计数器、序号生成']
          ] },
        { t: 'code', run: false, caption: '本站引擎不支持 Thread，以下为真实 JDK 代码（结果每次不同）',
          code: `public class Race {
    static int count = 0;

    public static void main(String[] args) throws InterruptedException {
        Runnable task = () -> {
            for (int i = 0; i < 100000; i++) count++;   // 读-改-写，三步不是原子操作
        };
        Thread t1 = new Thread(task, "t1");
        Thread t2 = new Thread(task, "t2");
        t1.start();
        t2.start();
        t1.join();      // 等两个线程都结束
        t2.join();
        System.out.println(count);   // 通常小于 200000，且每次运行都不一样
    }
}` },
        { t: 'code', run: false, caption: '本站引擎不支持 synchronized，以下为真实 JDK 代码',
          code: `public class SyncCounter {
    private int count = 0;

    // 锁是 this：同一个实例的 synchronized 方法互斥
    public synchronized void inc() { count++; }

    public int get() {
        synchronized (this) {     // 同步块：只锁真正需要保护的那几行
            return count;
        }
    }

    public static void main(String[] args) throws InterruptedException {
        SyncCounter c = new SyncCounter();
        Runnable task = () -> { for (int i = 0; i < 100000; i++) c.inc(); };
        Thread t1 = new Thread(task);
        Thread t2 = new Thread(task);
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println(c.get());   // 200000
    }
}` },
        { t: 'code', run: false, caption: '本站引擎不支持 volatile，以下为真实 JDK 代码',
          code: `public class VolatileFlag {
    // volatile 保证：一个线程写了，另一个线程立刻能看到；但不保证 count++ 原子
    private static volatile boolean running = true;

    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            while (running) {
                // 干活
            }
            System.out.println("worker 收到停止信号");
        }, "worker");
        worker.start();
        Thread.sleep(100);
        running = false;      // 没有 volatile 时，worker 可能永远读缓存里的 true
        worker.join();
    }
}` },
        { t: 'code', run: false, caption: '本站引擎不支持原子类，以下为真实 JDK 代码',
          code: `import java.util.concurrent.atomic.AtomicInteger;

public class AtomicCounter {
    private static final AtomicInteger count = new AtomicInteger(0);

    public static void main(String[] args) throws InterruptedException {
        Runnable task = () -> {
            for (int i = 0; i < 100000; i++) count.incrementAndGet();   // CAS，原子
        };
        Thread t1 = new Thread(task);
        Thread t2 = new Thread(task);
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println(count.get());   // 200000
    }
}` },
        { t: 'p', html: '<b>死锁（deadlock）</b>是「互相等对方手里的锁」，四个必要条件缺一不可：'
            + '① <b>互斥</b>——资源一次只能一个线程用；② <b>持有并等待</b>——拿着 A 等 B；'
            + '③ <b>不可剥夺</b>——不能强行抢走；④ <b>循环等待</b>——A 等 B，B 等 A。'
            + '破坏任意一个即可：最实用的是<b>统一锁顺序</b>（所有线程都先拿 A 再拿 B），'
            + '其次是 <code>tryLock</code> 带超时、减少锁粒度、避免嵌套锁。' },
        { t: 'code', run: false, caption: '本站引擎不支持 Thread，以下为真实 JDK 代码（会永久卡住）',
          code: `public class Deadlock {
    private static final Object LOCK_A = new Object();
    private static final Object LOCK_B = new Object();

    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            synchronized (LOCK_A) {
                sleep(100);
                synchronized (LOCK_B) { System.out.println("t1 拿到两把锁"); }
            }
        }, "t1");

        Thread t2 = new Thread(() -> {
            synchronized (LOCK_B) {          // 顺序相反：t1 等 B，t2 等 A
                sleep(100);
                synchronized (LOCK_A) { System.out.println("t2 拿到两把锁"); }
            }
        }, "t2");

        t1.start();
        t2.start();
    }

    static void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}` },
        { t: 'callout', kind: 'warn', html: '三个锁的坑：锁对象不能是 <code>null</code>（<code>synchronized (null)</code> 直接 NPE）；'
            + '不要锁 <code>String</code> 字面量或 <code>Integer</code> 缓存对象——它们可能被全局共享，'
            + '你以为锁的是自己的资源，实际锁住了别人的代码；锁的粒度要覆盖「读—改—写」整段，只锁一半等于没锁。' }
      ]
    },

    /* ---------------------------------------------------------------- S2 线程池 */
    {
      id: 'adv-concur-2',
      title: '线程池与并发工具',
      en: 'THREAD POOLS & UTILITIES',
      minutes: 24,
      html: '课程用 <code>new Thread(clientHandler).start()</code> 一个连接一个线程；本节讲线程池、'
        + 'Future、CountDownLatch、BlockingQueue 分别替我们解决了什么。',
      blocks: [
        { t: 'p', lead: true, html: '课程聊天室给每个连接 <code>new Thread(...).start()</code>。10 个客户端没问题，'
            + '1000 个呢？每个线程默认要 512KB–1MB 栈空间，1000 个就是 1GB 级别；再加上创建/销毁线程的系统调用、'
            + 'CPU 在 1000 个线程之间切换的开销，服务器还没处理消息就先被线程拖垮了。'
            + '这一节讲四个工具，都是围绕「别乱开线程、让线程协作」展开的。' },
        { t: 'p', html: '<b>线程池（thread pool）</b><code>ExecutorService</code> 预先创建一批线程，'
            + '任务提交后由空闲线程领取，用完归还。最常用 <code>Executors.newFixedThreadPool(n)</code>'
            + '（固定 n 个线程 + 无界队列）和 <code>newCachedThreadPool()</code>（按需创建、空闲回收）。'
            + '提交用 <code>execute</code>（无返回值）或 <code>submit</code>（返回 Future）；'
            + '关闭用 <code>shutdown()</code>（等已提交任务跑完）或 <code>shutdownNow()</code>（尝试中断）。'
            + '生产环境更推荐直接 <code>new ThreadPoolExecutor(...)</code> 显式指定核心线程数、最大线程数、'
            + '队列容量和拒绝策略，避免无界队列把内存吃满。' },
        { t: 'p', html: '<b>Future / Callable</b> 解决「任务有返回值」：<code>Callable&lt;T&gt;</code> 的 <code>call()</code> '
            + '可以返回结果、抛异常；提交后立刻拿到 <code>Future&lt;T&gt;</code>，'
            + '<code>get()</code> 阻塞等结果，<code>get(timeout, unit)</code> 限时等待，'
            + '<code>cancel(true)</code> 尝试中断。任务里抛的异常会被包成 <code>ExecutionException</code>，'
            + '用 <code>getCause()</code> 取原始异常。' },
        { t: 'p', html: '<b>CountDownLatch</b> 是一个「一次性门闩」：构造时给计数 N，'
            + '<code>countDown()</code> 减一，<code>await()</code> 阻塞到计数归零。'
            + '典型用法是「等所有客户端连上再开局」：主线程 <code>await()</code>，每个客户端线程连上后 '
            + '<code>countDown()</code>。它<b>不能重用</b>，要反复使用得用 <code>CyclicBarrier</code>。' },
        { t: 'p', html: '<b>BlockingQueue</b> 是线程安全的阻塞队列：<code>put()</code> 在满时阻塞，'
            + '<code>take()</code> 在空时阻塞。聊天室广播特别适合用它：每个 <code>ClientHandler</code> 收到消息后'
            + '只负责 <code>put</code> 进队列，另一个<b>广播线程</b>不断 <code>take</code> 出来、遍历所有客户端发送。'
            + '好处有三：接收线程不会被慢客户端拖住；广播顺序由队列保证；队列本身线程安全，不用自己加锁。'
            + '队列要设容量，满了用 <code>offer</code> 超时或丢弃并记日志，绝不能让接收线程无限阻塞。' },
        { t: 'table', caption: '四个工具各管什么',
          head: ['工具', '解决的问题', '关键方法', '聊天室里的用法'],
          rows: [
            ['<code>ExecutorService</code>', '线程复用与数量控制', '<code>submit</code> / <code>shutdown</code>', '每个 ClientHandler 交给固定大小线程池'],
            ['<code>Future</code>', '异步任务取结果 / 取消', '<code>get</code> / <code>cancel</code>', '查询在线人数、导出聊天记录'],
            ['<code>CountDownLatch</code>', '等 N 个事件都发生', '<code>await</code> / <code>countDown</code>', '等所有客户端就绪再开始广播'],
            ['<code>BlockingQueue</code>', '生产者—消费者解耦', '<code>put</code> / <code>take</code>', '接收线程入队，广播线程出队发送']
          ] },
        { t: 'code', run: false, caption: '本站引擎不支持线程池，以下为真实 JDK 代码',
          code: `import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ServerPool {
    private static final ExecutorService POOL = Executors.newFixedThreadPool(8);

    public static void main(String[] args) throws Exception {
        ServerSocket server = new ServerSocket(1004);
        while (!server.isClosed()) {
            Socket socket = server.accept();
            // 课程写法：new Thread(new ClientHandler(socket)).start();
            // 线程池写法：任务交给池，最多 8 个同时跑，其余排队
            POOL.submit(new ClientHandler(socket));
        }
    }
}` },
        { t: 'code', run: false, caption: '本站引擎不支持 Future，以下为真实 JDK 代码',
          code: `import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

public class FutureDemo {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newSingleThreadExecutor();
        Callable<Integer> task = () -> {
            Thread.sleep(300);          // 模拟耗时计算
            return 42;
        };
        Future<Integer> future = pool.submit(task);   // 立刻返回，不等结果

        System.out.println("先干别的");
        try {
            Integer value = future.get(1, TimeUnit.SECONDS);   // 最多等 1 秒
            System.out.println("结果 = " + value);
        } catch (ExecutionException e) {
            System.out.println("任务抛异常：" + e.getCause());
        }
        pool.shutdown();
    }
}` },
        { t: 'code', run: false, caption: '本站引擎不支持 CountDownLatch，以下为真实 JDK 代码',
          code: `import java.util.concurrent.CountDownLatch;

public class StartGate {
    public static void main(String[] args) throws InterruptedException {
        int players = 3;
        CountDownLatch ready = new CountDownLatch(players);   // 计数只能减到 0 一次

        for (int i = 1; i <= players; i++) {
            final String name = "client-" + i;
            new Thread(() -> {
                System.out.println(name + " 已连接");
                ready.countDown();
            }, name).start();
        }

        ready.await();                    // 主线程阻塞，直到 3 个都 countDown
        System.out.println("所有客户端就绪，开始广播");
    }
}` },
        { t: 'code', run: false, caption: '本站引擎不支持 BlockingQueue，以下为真实 JDK 代码',
          code: `import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class BroadcastQueue {
    // 有界队列：防止慢客户端把内存撑爆
    private static final BlockingQueue<String> QUEUE = new LinkedBlockingQueue<String>(1000);

    public static void main(String[] args) {
        // 广播线程：唯一消费者，串行地把消息写给所有客户端
        Thread broadcaster = new Thread(() -> {
            try {
                while (true) {
                    String msg = QUEUE.take();       // 队列空时阻塞，不空转
                    for (ClientHandler h : Server.clientHandlers) {
                        h.sendQuietly(msg);          // 单个客户端失败不能中断整个广播
                    }
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }, "broadcaster");
        broadcaster.setDaemon(true);
        broadcaster.start();
    }

    // 任何 ClientHandler 收到消息后只做一件事：入队
    static void onMessage(String msg) {
        if (!QUEUE.offer(msg)) {                     // 队列满：丢弃并记日志，绝不阻塞接收线程
            System.out.println("广播队列已满，丢弃消息：" + msg);
        }
    }
}` },
        { t: 'callout', kind: 'tip', html: '改造聊天室时按这个顺序：先把 <code>new Thread</code> 换成线程池，'
            + '再把 <code>broadcastMessage</code> 里直接写 socket 改成「入队」，最后加一个广播线程消费队列。'
            + '每改一步都跑一遍多客户端测试，出问题容易定位。队列容量按峰值消息速率估，宁可丢弃并记日志，'
            + '也不要让接收线程无限期阻塞。' }
      ]
    },

    /* ---------------------------------------------------------------- S3 调试 */
    {
      id: 'adv-concur-3',
      title: '并发调试：从卡住的聊天室说起',
      en: 'DEBUGGING CONCURRENCY',
      minutes: 22,
      html: '课程调试靠 IDE 断点；多线程下断点会改变时序，bug 可能当场消失。本节讲 jstack、线程 dump、'
        + '死锁复现，以及给线程起名打日志的习惯。',
      blocks: [
        { t: 'p', lead: true, html: '课程里调试靠 IDE 断点：停住、看变量、单步。这在单线程下很好用，'
            + '多线程下却常常帮倒忙——断点会挂起所有线程，你停下来看变量的那一刻，'
            + '另外两个线程的时序已经被你改掉了，bug 自然「复现不了」。'
            + '聊天室最典型的故障是「整个服务端卡住、不报错、CPU 也不高」：'
            + '这时需要的不是断点，而是把 JVM 里所有线程此刻在干什么拍一张快照。' },
        { t: 'p', html: '<b>jstack</b> 是 JDK 自带的线程栈打印工具：<code>jstack &lt;pid&gt;</code>，'
            + '或者 <code>jcmd &lt;pid&gt; Thread.print</code>；IntelliJ 的 Run 面板也有 “Dump Threads”。'
            + '它输出每个线程的名字、状态、调用栈，以及正在等/持有的锁。'
            + '死锁时 JVM 会直接给出 <code>Found one Java-level deadlock</code> 段落，'
            + '把互相等待的线程和锁地址列出来，基本等于答案。' },
        { t: 'p', html: '读 dump 先看<b>线程状态</b>：<code>RUNNABLE</code> 可能真在跑，也可能卡在 socket 读、'
            + '文件读写这类本地方法上；<code>BLOCKED (on object monitor)</code> 是在等 <code>synchronized</code> 锁，'
            + '后面会跟 <code>- waiting to lock &lt;0x...&gt;</code>，再往下找谁 <code>- locked</code> 了同一地址；'
            + '<code>WAITING</code> 是 <code>wait()</code> / <code>join()</code> / <code>park()</code>，'
            + '<code>TIMED_WAITING</code> 是带超时的等待（<code>sleep</code>、<code>await</code>、<code>take</code>）。'
            + '聊天室里大量线程停在 <code>SocketInputStream.read</code> 是正常的——它们在等客户端发消息。' },
        { t: 'p', html: '复现死锁的套路：写两个线程、两把锁、<b>相反顺序</b>加锁，中间 <code>sleep</code> 一下放大时间窗口，'
            + '循环跑几十次；然后在卡住时抓 jstack。修复不是「加个 sleep 错开」，而是统一锁顺序，'
            + '或者用 <code>tryLock(timeout)</code> 在拿不到第二把锁时放弃并释放第一把。' },
        { t: 'p', html: '最后是一个便宜但极有效的习惯：<b>给线程起名，并在日志里带上线程名</b>。'
            + '<code>new Thread(task, "client-alice")</code> 比默认的 <code>Thread-7</code> 有用得多；'
            + '日志统一打成 <code>[client-alice] send failed: ...</code>，'
            + '出问题时一眼能看出是哪个客户端、哪个线程、在做什么。'
            + '<code>Thread.currentThread().getName()</code> 就是取这个名字的 API。' },
        { t: 'table', caption: '线程状态速查（dump 里最常见的前五种）',
          head: ['状态', '含义', '常见原因', '要不要慌'],
          rows: [
            ['<code>RUNNABLE</code>', '正在运行或等 I/O', 'CPU 计算、<code>socketRead0</code>、文件读写', '多数正常'],
            ['<code>BLOCKED</code>', '等 monitor 锁', '另一个线程占着 <code>synchronized</code>', '<b>要查</b>：谁持有锁'],
            ['<code>WAITING</code>', '无限期等待通知', '<code>wait()</code>、<code>join()</code>、<code>park()</code>', '看是否有人唤醒'],
            ['<code>TIMED_WAITING</code>', '带超时的等待', '<code>sleep</code>、<code>await</code>、<code>take</code>', '多数正常'],
            ['<code>TERMINATED</code>', '已结束', 'run() 正常返回或抛异常退出', '正常']
          ] },
        { t: 'code', run: false, caption: '本站引擎不支持 Thread，以下为真实 JDK 代码（会永久卡住）',
          code: `public class DeadlockRepro {
    private static final Object A = new Object();
    private static final Object B = new Object();

    public static void main(String[] args) {
        new Thread(() -> hold(A, B), "worker-A-first").start();
        new Thread(() -> hold(B, A), "worker-B-first").start();
    }

    static void hold(Object first, Object second) {
        synchronized (first) {
            log("拿到第一把锁");
            sleep(200);                       // 放大时间窗口，让另一个线程拿到第二把
            synchronized (second) {
                log("拿到第二把锁");
            }
        }
    }

    static void log(String msg) {
        System.out.println("[" + Thread.currentThread().getName() + "] " + msg);
    }

    static void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}` },
        { t: 'code', run: false, caption: 'jstack 输出片段：JVM 已经替你找到了死锁',
          code: `"worker-B-first" #12 prio=5 os_prio=0 tid=0x0000000002b8 nid=0x1c64 waiting for monitor entry
   java.lang.Thread.State: BLOCKED (on object monitor)
        at DeadlockRepro.hold(DeadlockRepro.java:13)
        - waiting to lock <0x000000076ab2f0a8> (a java.lang.Object)
        - locked <0x000000076ab2f0d8> (a java.lang.Object)

Found one Java-level deadlock:
=============================
"worker-A-first":
  waiting to lock monitor 0x0000000002c8 (object 0x000000076ab2f0d8),
  which is held by "worker-B-first"
"worker-B-first":
  waiting to lock monitor 0x0000000002d4 (object 0x000000076ab2f0a8),
  which is held by "worker-A-first"` },
        { t: 'code', run: false, caption: '聊天室卡住时的 dump：先分清「正常等待」和「异常阻塞」',
          code: `"client-alice" #21 prio=5 ... java.lang.Thread.State: RUNNABLE
    at java.net.SocketInputStream.socketRead0(Native Method)
    at java.net.SocketInputStream.read(SocketInputStream.java:150)
    at java.io.BufferedReader.readLine(BufferedReader.java:389)
    at ClientHandler.run(ClientHandler.java:31)
    - locked <0x000000076ab310a0> (a java.io.InputStreamReader)

"broadcaster" #20 prio=5 ... java.lang.Thread.State: WAITING (parking)
    at java.util.concurrent.locks.LockSupport.park(LockSupport.java:304)
    at java.util.concurrent.LinkedBlockingQueue.take(LinkedBlockingQueue.java:433)
    at BroadcastQueue.lambda$main$0(BroadcastQueue.java:14)`,
          },
        { t: 'code', run: false, caption: '本站引擎不支持 Thread，以下为真实 JDK 代码',
          code: `public class ChatLog {
    // 统一日志格式：线程名 + 消息。线程名是定位并发问题的第一线索
    static void log(String msg) {
        System.out.println("[" + Thread.currentThread().getName() + "] " + msg);
    }

    public static void main(String[] args) {
        Thread alice = new Thread(() -> {
            log("connected");
            log("send: hi");
        }, "client-alice");

        Thread bob = new Thread(() -> {
            log("connected");
            log("send: gomoku?");
        }, "client-bob");

        alice.start();
        bob.start();
    }
}` },
        { t: 'callout', kind: 'note', html: '并发 bug 的调试顺序：<b>先抓 dump 看状态，再缩小到锁/队列，最后才加日志复现</b>。'
            + '不要一上来就 <code>System.out.println</code> 满屏打印——I/O 本身会改变时序，'
            + '而且多线程输出会交错，读起来比 dump 更痛苦。' },
        { t: 'callout', kind: 'tip', html: 'dump 抓一次是照片，抓两次是电影：间隔几秒抓两次，'
            + '对比同一线程是否一直停在同一个栈顶，就能区分「卡死」和「只是慢」。' }
      ]
    }
  ],
  finish: '<p><b>怎么继续：</b>给聊天室加一个 <code>AtomicInteger</code> 在线人数；把广播改成阻塞队列；'
    + '故意写一个死锁，用 jstack 抓一次，再改锁顺序验证它消失。三件事做完，并发这一层就真正落地了。</p>',
  checklist: {
    id: 'concur-deep-check',
    items: [
      '能说清竞态条件、原子性、可见性、有序性分别是什么',
      '能判断一段代码该用 synchronized、volatile 还是 AtomicInteger',
      '能背出死锁的四个必要条件，并说出至少两种破坏方法',
      '能把聊天室从「每连接一线程」改成线程池 + BlockingQueue 广播',
      '能用 jstack 抓 dump，读懂 BLOCKED 线程的 waiting to lock / locked',
      '养成了给线程起名、日志带线程名的习惯'
    ]
  },
  keypoint: {
    items: [
      { title: '共享可变状态是万恶之源', html: 'count++ 不是原子操作；能不用共享状态就不用，非用不可才加锁。' },
      { title: 'synchronized 管互斥和可见性', html: '锁对象要私有、稳定、非 null；锁的范围要覆盖完整的读—改—写。' },
      { title: 'volatile 只管可见性', html: '适合状态标志，不适合计数；计数用 AtomicInteger / LongAdder。' },
      { title: '死锁靠统一锁顺序预防', html: '互斥、持有并等待、不可剥夺、循环等待，破坏任意一个即可。' },
      { title: 'dump 比断点更适合并发', html: 'jstack 看线程状态与锁地址；线程名 + 日志让问题从「偶发」变成「可定位」。' }
    ]
  }
}
]);
