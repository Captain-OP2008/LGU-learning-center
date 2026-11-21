/* =====================================================================
 * data/ch08.js · 第 08 章：多线程与并发
 * 职责：进程 vs 线程、多线程优点、线程生命周期五态、Runnable 与 Thread 两种创建方式、
 *       start() 与 run() 的区别、Thread.sleep、聊天室的线程模型、共享状态与竞态、
 *       synchronized 与死锁直觉。
 * 对外 API：CSC.registerChapter({...})（block schema 见 _dev/CONTRACT.md §4–§5）
 * 注意：本站引擎不支持 Thread，本章代码一律 run:false；机制由 lab「threads」演示。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch08',
  num: '08',
  title: '多线程与并发',
  en: 'Multithreading',
  goals: [
    '能说出进程与线程的区别：是否共享内存、创建切换的开销谁大',
    '能画出线程的五种状态，并说出 start、调度、sleep、等锁、run 结束各自的转换',
    '能用 implements Runnable 与 extends Thread 两种方式创建线程并启动',
    '能解释 start() 与 run() 的区别，并预测两种调用方式的输出',
    '能解释聊天室为什么为每个 ClientHandler 开一个线程，并说出共享列表的竞态风险'
  ],
  kp: [
    { id: 'ch08-1', title: '进程 vs 线程：重与轻' },
    { id: 'ch08-2', title: '多线程的三条优点' },
    { id: 'ch08-3', title: '线程的生命周期与五种状态' },
    { id: 'ch08-4', title: '创建方式一：implements Runnable' },
    { id: 'ch08-5', title: '创建方式二：extends Thread' },
    { id: 'ch08-6', title: 'start() 与 run() 的区别' },
    { id: 'ch08-7', title: 'Thread.sleep 与 Timed Waiting' },
    { id: 'ch08-8', title: '聊天室线程模型与共享状态' }
  ],
  blocks: [

    /* ------------------------------------------------------------------ 开篇 */
    { t: 'callout', kind: 'why', html:
      '聊天室写到多客户端时，几乎一定会遇到三种「灵异现象」：第一个客户端一切正常，第二个客户端一连上，' +
      '服务器就再也不回应任何人；消息偶尔凭空少一条；广播时控制台突然抛一个 ' +
      '<code>ConcurrentModificationException</code>。<br>' +
      '它们的根子是同一个：程序只有一个执行流，而聊天室天生要「同时做很多件事」——' +
      '一边等新连接、一边读每个客户端的话、一边把消息转发给所有人。本章的主角<b>线程（thread）</b>' +
      '就是 Java 提供的「同时做多件事」的机制：先讲清它和进程的区别、它的一生有哪几个状态、' +
      '怎么创建和启动，最后回到聊天室，解释 Tutorial 2/4 里那几行 <code>new Thread(...).start()</code> 到底在解决什么问题。'
    },

    { t: 'p', lead: true, html:
      '一句话先记住：<b>进程是「一间独立房子」，线程是「同一间房子里的几个工人」</b>。'
    },

    /* ------------------------------------------------------------------ 一、进程 vs 线程 */
    { t: 'h', text: '一、进程 vs 线程：重与轻', id: 'ch08-1' },

    { t: 'p', html:
      '<b>多任务（multitasking）</b>是「同时执行多个任务」。讲义说它有两种实现方式，第一种是' +
      '<b>基于进程的多任务（multiprocessing）</b>：每个<b>进程（process）</b>在内存里有自己的地址、' +
      '独占一块内存区域，所以进程是<b>重量级（heavy-weight）</b>的；进程之间通信成本高，' +
      '从一个进程切到另一个，还要保存和加载寄存器、内存映射、更新各种列表，比较慢。'
    },

    { t: 'p', html:
      '第二种是<b>基于线程的多任务（multithreading）</b>。<b>线程（thread）</b>是轻量级子进程、' +
      '是处理的最小单位：它<b>共享内存区域</b>，不单独分配内存，所以省内存，切换也比进程快得多。' +
      '讲义还强调：线程彼此独立——某个线程里抛了异常，不会影响其他线程继续跑。'
    },

    { t: 'compare', left: {
      title: '进程（process）',
      html: '有独立内存区，互不干扰；通信和切换都要跨边界，<b>重</b>。',
      code: '// 两个进程：各自有堆、栈、代码\n// 一个崩了，另一个通常还活着'
    }, right: {
      title: '线程（thread）',
      html: '同一进程内共享内存，通信便宜、切换快，但共享数据也因此容易打架，<b>轻</b>。',
      code: '// 同一进程内的两个线程\n// 共享堆上的对象：快，但要注意竞态'
    } },

    { t: 'p', html:
      '一句话总结：<b>进程靠隔离换安全，线程靠共享换效率</b>。Java 程序启动时，' +
      '<code>main</code> 方法就跑在一个线程里（主线程）；之后再创建的都是它的「同事」，' +
      '一起在同一个 JVM 里、共享同一堆内存。'
    },

    /* ------------------------------------------------------------------ 二、优点 */
    { t: 'h', text: '二、多线程的三条优点', id: 'ch08-2' },

    { t: 'p', html:
      '讲义列了三条优点，每一条都能在聊天室里找到对应：' +
      '① <b>不阻塞用户</b>——线程彼此独立，可以同时做多个操作，服务器等客户端 A 的时候不影响服务 B；' +
      '② <b>省时间</b>——多件事并行推进，而不是一件做完再做下一件；' +
      '③ <b>异常隔离</b>——某个线程出错不会拖垮其他线程，一个客户端崩了，服务器和别的会话还能继续。'
    },

    { t: 'p', html:
      '但优点是有代价的：多个线程<b>共享同一块内存</b>，就可能同时读写同一个对象。' +
      '这不是本章前面的内容，而是第八节要面对的<b>并发（concurrency）</b>问题：' +
      '程序跑得快了，但「谁先谁后」变得不确定。'
    },

    /* ------------------------------------------------------------------ 三、生命周期 */
    { t: 'h', text: '三、线程的一生：五种状态', id: 'ch08-3' },

    { t: 'p', html:
      '讲义说：一个线程永远处在下列状态之一。<b>New（新建）</b>：刚 <code>new</code> 出来、还没开始执行；' +
      '调 <code>start()</code> 之后进入 Active，Active 内部又分 <b>Runnable（就绪）</b>与 <b>Running（运行）</b>；' +
      '此外还有 <b>Blocked / Waiting（阻塞/等待）</b>、<b>Timed Waiting（计时等待）</b>与 ' +
      '<b>Terminated（终止）</b>。把 Runnable 与 Running 合成 Active 来看，正好是五种状态。'
    },

    { t: 'table',
      head: ['状态', '什么时候进入', '怎么离开'],
      rows: [
        ['New（新建）', '<code>new Thread(...)</code> 之后，还没调用 <code>start()</code>', '调用 <code>start()</code> 进入 Runnable'],
        ['Runnable（就绪）', '已 <code>start()</code>，在等 CPU 时间片', '被调度器选中进入 Running'],
        ['Running（运行）', '抢到 CPU，正在执行 <code>run()</code>', '时间片用完回 Runnable；调用 <code>sleep</code> 进 Timed Waiting'],
        ['Blocked / Waiting', '等锁、等另一个线程通知（如 <code>join</code>、<code>wait</code>）', '锁释放或被通知后回 Runnable'],
        ['Timed Waiting', '调用 <code>Thread.sleep(ms)</code> 等带时限的等待', '时间到或被中断后回 Runnable'],
        ['Terminated（终止）', '<code>run()</code> 正常结束，或线程抛出未捕获异常', '生命周期结束，不能再 <code>start()</code>']
      ],
      caption: '讲义把 Runnable 与 Running 合称 Active；分开看更容易理解调度。' },

    { t: 'svg', maxW: 660, caption: '线程状态转换：start 只是入场券，能不能跑由调度器决定。', html:
`<svg viewBox="0 0 660 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="线程状态转换图">
  <defs>
    <marker id="ch08-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent2)"/>
    </marker>
  </defs>
  <rect x="16" y="24" width="130" height="56" rx="4" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="81" y="48" font-size="12" text-anchor="middle" fill="var(--text)">New</text>
  <text x="81" y="66" font-size="10" text-anchor="middle" fill="var(--text3)">new Thread()</text>
  <rect x="190" y="24" width="140" height="56" rx="4" fill="var(--bg2)" stroke="var(--accent)"/>
  <text x="260" y="48" font-size="12" text-anchor="middle" fill="var(--accent)">Runnable</text>
  <text x="260" y="66" font-size="10" text-anchor="middle" fill="var(--text3)">start() 之后等 CPU</text>
  <rect x="374" y="24" width="130" height="56" rx="4" fill="var(--bg2)" stroke="var(--accent)"/>
  <text x="439" y="48" font-size="12" text-anchor="middle" fill="var(--accent)">Running</text>
  <text x="439" y="66" font-size="10" text-anchor="middle" fill="var(--text3)">抢到 CPU，跑 run()</text>
  <rect x="548" y="24" width="96" height="56" rx="4" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="596" y="48" font-size="12" text-anchor="middle" fill="var(--text)">Terminated</text>
  <text x="596" y="66" font-size="10" text-anchor="middle" fill="var(--text3)">run() 结束</text>
  <rect x="190" y="168" width="170" height="56" rx="4" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="275" y="192" font-size="12" text-anchor="middle" fill="var(--text)">Blocked / Waiting</text>
  <text x="275" y="210" font-size="10" text-anchor="middle" fill="var(--text3)">等锁、等 join/notify</text>
  <rect x="400" y="168" width="160" height="56" rx="4" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="480" y="192" font-size="12" text-anchor="middle" fill="var(--text)">Timed Waiting</text>
  <text x="480" y="210" font-size="10" text-anchor="middle" fill="var(--text3)">sleep(ms)</text>
  <line x1="148" y1="52" x2="186" y2="52" stroke="var(--accent2)" stroke-width="1.4" marker-end="url(#ch08-arw)"/>
  <text x="167" y="44" font-size="10" text-anchor="middle" fill="var(--text3)">start</text>
  <line x1="332" y1="52" x2="370" y2="52" stroke="var(--accent2)" stroke-width="1.4" marker-end="url(#ch08-arw)"/>
  <text x="351" y="44" font-size="10" text-anchor="middle" fill="var(--text3)">调度</text>
  <line x1="374" y1="74" x2="336" y2="74" stroke="var(--text3)" stroke-width="1.2" marker-end="url(#ch08-arw)"/>
  <text x="352" y="90" font-size="9" text-anchor="middle" fill="var(--text3)">时间片用完</text>
  <line x1="506" y1="52" x2="544" y2="52" stroke="var(--accent2)" stroke-width="1.4" marker-end="url(#ch08-arw)"/>
  <text x="525" y="44" font-size="10" text-anchor="middle" fill="var(--text3)">结束</text>
  <line x1="260" y1="82" x2="270" y2="164" stroke="var(--text3)" stroke-width="1.2" marker-end="url(#ch08-arw)"/>
  <text x="286" y="130" font-size="10" fill="var(--text3)">等锁</text>
  <line x1="360" y1="164" x2="330" y2="86" stroke="var(--text3)" stroke-width="1.2" marker-end="url(#ch08-arw)"/>
  <text x="360" y="132" font-size="10" fill="var(--text3)">被唤醒</text>
  <line x1="440" y1="82" x2="462" y2="164" stroke="var(--text3)" stroke-width="1.2" marker-end="url(#ch08-arw)"/>
  <text x="470" y="126" font-size="10" fill="var(--text3)">sleep</text>
  <text x="16" y="240" font-size="10" fill="var(--text3)">Terminated 之后线程不能复活；同一个 Thread 对象只能 start() 一次。</text>
</svg>` },

    { t: 'p', html:
      '最容易考错的是两处：① <code>start()</code> 之后线程<b>不一定马上运行</b>，它先进 Runnable 排队，' +
      '由<b>调度器（thread scheduler）</b>决定何时给 CPU；② 一个 <code>Thread</code> 对象只能 ' +
      '<code>start()</code> 一次，第二次调用会抛 <code>IllegalStateException</code>，' +
      '因为线程终止后不能复活。'
    },

    /* ------------------------------------------------------------------ 四、Runnable */
    { t: 'h', text: '四、创建方式一：implements Runnable', id: 'ch08-4' },

    { t: 'p', html:
      '讲义的方法 1：写一个类 <b>implements Runnable</b>，重写 <code>run()</code> 方法，' +
      '然后在 <code>main</code> 里创建任务对象、把它交给 <code>Thread</code>、再调用 <code>start()</code>。' +
      '注意 <code>run()</code> 里写的才是「这个线程要干的活」。'
    },

    { t: 'code', run: false, caption: 'RunnableDemo.java · 实现 Runnable 接口，交给 Thread 启动（讲义方法 1）', code:
`public class RunnableDemo implements Runnable {
    @Override
    public void run() {
        System.out.println("thread is running ...");
    }

    public static void main(String[] args) {
        RunnableDemo task = new RunnableDemo();   // 只是任务对象，还不是线程
        Thread thread = new Thread(task);         // 把任务交给 Thread
        thread.start();                           // start() 才真正开线程
    }
}
` },

    { t: 'p', html:
      '为什么推荐这种方式？① Java 类只能 <b>单继承</b>，<code>implements</code> 不占用唯一的继承名额，' +
      '你的类还可以去继承别的父类；② <b>任务与线程分离</b>：同一个 <code>Runnable</code> 对象可以交给' +
      '多个 <code>Thread</code> 去跑，而 <code>extends Thread</code> 做不到这种复用。'
    },

    /* ------------------------------------------------------------------ 五、Thread */
    { t: 'h', text: '五、创建方式二：extends Thread', id: 'ch08-5' },

    { t: 'p', html:
      '讲义的方法 2：写一个类 <b>extends Thread</b>，重写 <code>run()</code>；' +
      '<code>new</code> 出来的对象本身就是线程，直接调 <code>start()</code>。' +
      '另外讲义还提到构造器 <code>Thread(Runnable r, String name)</code>：把任务和一个<b>线程名</b>一起传进去，' +
      '调试时用 <code>getName()</code> 就能分清是哪个线程在打印。'
    },

    { t: 'code', run: false, caption: 'ThreadDemo.java · 继承 Thread 类，用构造器给线程起名（讲义方法 2）', code:
`public class ThreadDemo extends Thread {
    ThreadDemo(String name) {
        super(name);                              // 线程名交给 Thread 保存
    }

    @Override
    public void run() {
        System.out.println(getName() + " is running ...");
    }

    public static void main(String[] args) {
        ThreadDemo t1 = new ThreadDemo("worker-1");
        ThreadDemo t2 = new ThreadDemo("worker-2");
        t1.start();
        t2.start();
    }
}
` },

    { t: 'p', html:
      '两种方式的取舍：<code>extends Thread</code> 代码更短、线程就是对象本身；' +
      '<code>implements Runnable</code> 更灵活、更推荐。项目里的 <code>ClientHandler implements Runnable</code> ' +
      '用的就是第一种——因为它已经是一个「处理客户端」的类，再让它继承 <code>Thread</code> 就浪费了继承机会。'
    },

    /* ------------------------------------------------------------------ 六、start vs run */
    { t: 'h', text: '六、start() 与 run()：本章必考', id: 'ch08-6' },

    { t: 'p', html:
      '这是多线程最经典的一道题：<code>start()</code> 和 <code>run()</code> 都能让 <code>run()</code> ' +
      '里的代码被执行，但方式完全不同。<code>start()</code> 会让 JVM <b>新开一个线程</b>，' +
      '新线程进入 Runnable，等调度器安排执行；<code>run()</code> 只是一个<b>普通方法调用</b>，' +
      '在当前线程（通常是 main）里直接执行，完全不会创建新线程。'
    },

    { t: 'compare', left: {
      title: '调用 <code>start()</code>',
      html: '新开一个线程，<code>run()</code> 在新线程里跑；主线程继续往下走。这才是「多线程」。',
      code: 'Thread t = new Thread(task, "worker");\nt.start();   // 新线程执行 run()'
    }, right: {
      title: '直接调用 <code>run()</code>',
      html: '只是普通方法调用，<code>run()</code> 在<b>当前线程</b>里执行，没有新线程，也没有并发。',
      code: 'task.run(); // 仍在 main 线程里跑；不会开新线程'
    } },

    { t: 'code', run: false, caption: 'StartVsRun.java · 用 currentThread().getName() 看清 run() 在哪个线程执行', code:
`public class StartVsRun implements Runnable {
    @Override
    public void run() {
        System.out.println("running in: " + Thread.currentThread().getName());
    }

    public static void main(String[] args) {
        StartVsRun task = new StartVsRun();
        Thread thread = new Thread(task, "worker");

        task.run();        // 普通方法调用：仍在 main 线程里，输出 main
        thread.start();    // 新线程：输出 worker
    }
}
` },

    { t: 'p', html:
      '输出两行：<code>running in: main</code> 与 <code>running in: worker</code>（顺序可能互换，' +
      '因为新线程何时拿到 CPU 由调度器决定）。如果两行都是 <code>main</code>，说明你把 ' +
      '<code>start()</code> 写成了 <code>run()</code>——这是作业里最常见的 bug，也是最常考的判断题。'
    },

    /* ------------------------------------------------------------------ 七、sleep */
    { t: 'h', text: '七、Thread.sleep：主动进入 Timed Waiting', id: 'ch08-7' },

    { t: 'p', html:
      '<code>Thread.sleep(ms)</code> 让<b>当前线程</b>暂停指定的毫秒数，期间进入 <b>Timed Waiting</b> 状态，' +
      '时间到了再回到 Runnable 排队。它不会释放锁（锁是 <code>synchronized</code> 的事），' +
      '也不能保证「醒来马上运行」——只是从计时等待回到就绪队列而已。' +
      '另外 <code>sleep</code> 声明了 <code>throws InterruptedException</code>：' +
      '线程在睡的时候被别人打断，会抛这个受检异常。'
    },

    { t: 'code', run: false, caption: 'SleepDemo.java · 主线程睡眠 1 秒，观察状态变化', code:
`public class SleepDemo {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("start");
        Thread.sleep(1000);                     // 主线程进入 Timed Waiting，约 1 秒
        System.out.println("one second later");
    }
}
` },

    { t: 'code', run: false, caption: 'SleepInThread.java · 线程里 sleep 的惯用写法（示意代码，本站引擎不支持 try-catch）', code:
`// 在 run() 里睡眠，必须处理受检异常
try {
    Thread.sleep(500);
} catch (InterruptedException e) {
    System.out.println("interrupted");
}
` },

    { t: 'p', html:
      '为什么在 <code>main</code> 里可以只写 <code>throws InterruptedException</code>，' +
      '在 <code>run()</code> 里却必须 <code>try-catch</code>？因为 <code>Runnable.run()</code> ' +
      '没有声明任何受检异常，重写时不能擅自加 <code>throws</code>——这正好也是本站引擎不支持 ' +
      '<code>try-catch</code> 的原因之一，所以第二段只作示意。'
    },

    /* ------------------------------------------------------------------ 八、聊天室 */
    { t: 'h', text: '八、聊天室：每个客户端一个线程', id: 'ch08-8' },

    { t: 'p', html:
      '现在回到 Tutorial 2/4 的服务器结构。主线程在 <code>startServer()</code> 里循环 ' +
      '<code>accept()</code>；每接到一个客户端，就 <code>new</code> 一个 <code>ClientHandler</code>，' +
      '把它交给一个 <code>Thread</code> 并 <code>start()</code>。' +
      '主线程立刻回到 <code>accept()</code> 继续接待，读消息这种「会阻塞的活」全部交给子线程。'
    },

    { t: 'code', run: false, caption: 'Server.java（节选）· 主线程只负责接待，每个 ClientHandler 一个线程', code:
`while (!serverSocket.isClosed()) {
    Socket socket = serverSocket.accept();          // 主线程：接待
    ClientHandler clientHandler = new ClientHandler(socket);
    Thread thread = new Thread(clientHandler);      // 一个客户端一个线程
    thread.start();                                 // 立刻返回，继续 accept
}
` },

    { t: 'p', html:
      '如果不开线程会怎样？把读写客户端的代码直接写进 <code>accept()</code> 的循环体，' +
      '主线程就会卡在 <code>readLine()</code> 上等第一个客户端发消息，' +
      '第二个客户端连上来也没人 <code>accept()</code>——这正是「第二个客户端连上后服务器没反应」的原因。' +
      '客户端的 <code>listenForMessage()</code> 同理：它要开一个子线程专门监听服务器，' +
      '主线程才能继续用 <code>sendMessage()</code> 从键盘读输入并发送。'
    },

    { t: 'code', run: false, caption: 'ClientHandler.java（节选）· run() 里循环读消息并广播给所有客户端', code:
`import java.util.ArrayList;

public class ClientHandler implements Runnable {
    private Socket socket;
    private BufferedReader bufferedReader;
    private static ArrayList<ClientHandler> clientHandlers = new ArrayList<>();

    public ClientHandler(Socket socket) {
        this.socket = socket;
    }

    @Override
    public void run() {
        String messageFromClient;
        while (socket.isConnected()) {
            messageFromClient = bufferedReader.readLine();   // 阻塞读
            broadcastMessage(messageFromClient);
        }
    }

    public void broadcastMessage(String message) {
        for (ClientHandler handler : clientHandlers) {
            handler.send(message);                           // 共享列表
        }
    }
}
` },

    { t: 'p', html:
      '线程一多，问题就从「能不能跑」变成「会不会打架」。<code>clientHandlers</code> 是一个被所有 ' +
      '<code>ClientHandler</code> 线程共享的列表：A 线程正在 <code>for</code> 循环里遍历它广播消息，' +
      'B 线程此时恰好 <code>add</code> 或 <code>remove</code> 了一个元素——遍历就会抛 ' +
      '<code>ConcurrentModificationException</code>。这类「多个线程同时读写共享数据、结果取决于谁先谁后」' +
      '的问题叫<b>竞态条件（race condition）</b>。'
    },

    { t: 'code', run: false, caption: 'RaceDemo.java（示意）· 一边遍历一边被别的线程修改，遍历会崩', code:
`// A 线程在这里遍历
for (ClientHandler handler : clientHandlers) {
    handler.send(message);        // 此刻 B 线程 add / remove 了列表
}
// → java.util.ConcurrentModificationException
` },

    { t: 'p', html:
      'Java 的第一道防线是 <b>synchronized</b>：给共享方法加上它，同一时刻只允许一个线程进入，' +
      '其他线程排队。用一句话说就是「把这段代码变成单线程执行」。代价是并行度下降，' +
      '用多了还可能引出<b>死锁（deadlock）</b>：两个线程各持一把锁，又都在等对方的锁，谁都不肯先放，' +
      '程序就永远停在那里。聊天室里还有一种形似死锁的经典卡住：两端都先 <code>readLine()</code> 等对方发话。'
    },

    { t: 'code', run: false, caption: 'Broadcast.java（示意）· 给共享方法加 synchronized，同一时刻只允许一个线程进入', code:
`public synchronized void broadcastMessage(String message) {   // 排队进入
    for (ClientHandler handler : clientHandlers) {
        handler.send(message);
    }
}
` },

    { t: 'callout', kind: 'warn', title: '多线程 bug 的三个特点', html:
      '① <b>不一定每次复现</b>：竞态取决于调度顺序，跑十次可能只错一次，所以要反复运行、别只测一遍；' +
      '② <b>断点会改变行为</b>：单步调试会拖慢某个线程，bug 可能就藏起来了，此时要看日志时间戳而不是暂停；' +
      '③ <b>症状离原因很远</b>：抛异常的地方往往不是写错的地方。' +
      '实践原则：能不让线程共享可变状态就不共享；必须共享就加锁；不要在遍历共享集合的过程中增删元素。'
    },

    { t: 'lab', id: 'threads' },

    /* ------------------------------------------------------------------ 练习 */
    { t: 'h', text: '即时练习' },
    { t: 'quiz', qid: 'ch08-q1' },
    { t: 'quiz', qid: 'ch08-q2' },
    { t: 'quiz', qid: 'ch08-q3' },

    /* ------------------------------------------------------------------ 收尾 */
    { t: 'keypoint', items: [
      { title: '进程 vs 线程', html: '进程有独立内存、重、切换慢；线程共享内存、轻、切换快；进程隔离、线程共享。' },
      { title: '优点', html: '不阻塞用户、省时间、异常隔离；代价是共享数据带来的竞态。' },
      { title: '五态', html: 'New → Runnable → Running → Blocked/Waiting 或 Timed Waiting → Terminated；start 后不保证立刻运行。' },
      { title: 'Runnable', html: '<code>implements Runnable</code> + 重写 <code>run()</code>，再交给 <code>new Thread(task)</code> 启动；不占继承名额。' },
      { title: 'Thread', html: '<code>extends Thread</code> + 重写 <code>run()</code>，对象本身就是线程；<code>Thread(r, "name")</code> 可命名。' },
      { title: 'start vs run', html: '<code>start()</code> 开新线程，<code>run()</code> 只是普通方法调用；一个 Thread 只能 start 一次。' },
      { title: 'sleep', html: '<code>Thread.sleep(ms)</code> 让当前线程进入 Timed Waiting，需处理 <code>InterruptedException</code>。' },
      { title: '聊天室与并发', html: '主线程只 accept，每个 ClientHandler 一个线程；共享列表要防竞态，<code>synchronized</code> 是一把锁，滥用会死锁。' }
    ] },

    { t: 'checklist', id: 'ch08', items: [
      '我能说出进程与线程在内存、开销、通信上的三点区别',
      '我能说出多线程的三条优点，以及「共享内存」带来的代价',
      '我能画出线程的五种状态并说出各自进入与离开的条件',
      '我知道 start() 之后线程不一定立刻运行，同一个 Thread 只能 start 一次',
      '我能用 implements Runnable 写出一个可启动的线程',
      '我能用 extends Thread 写出一个带名字的线程，并说出 <code>Thread(r, "name")</code> 的用途',
      '我能解释 start() 与 run() 的区别，并预测「两行都输出 main」是哪种写法',
      '我能说出 Thread.sleep 会让线程进入什么状态、为什么要处理 InterruptedException',
      '我能解释聊天室为什么每个 ClientHandler 一个线程，不开线程会怎样',
      '我能说出共享 ArrayList 的竞态风险，以及 synchronized 与死锁的直觉'
    ] },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      '按 CSC1004 期末考纲的四部分，本章几乎每年都有题：' +
      '① <b>选择题</b>：线程与进程的区别、线程状态的判断、<code>new Thread(r, "name")</code> 的含义、' +
      '哪种方式创建线程「更好」。' +
      '② <b>判断题</b>：「调用 <code>run()</code> 会启动一个新线程」（错）、' +
      '「一个 Thread 对象可以多次 <code>start()</code>」（错）、「sleep 会释放锁」（错，sleep 不释放锁）。' +
      '③ <b>填空题</b>：补 <code>implements Runnable</code>、补 <code>thread.start()</code>、' +
      '补 <code>Thread.sleep(1000)</code>、补 <code>synchronized</code>。' +
      '④ <b>简答/编程</b>：写一个两种方式创建的线程；或解释「聊天室服务器为什么要为每个客户端开线程」。<br>' +
      '<b>复习动作</b>：把 start/run 的输出题练到条件反射（看到 <code>currentThread().getName()</code> 就要想「在哪个线程执行」），' +
      '再默写一遍 Runnable 与 Thread 两个版本的线程代码——这两块是简答题的稳定得分点。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '多线程是 AI 最容易「说得对、写错」的题目，正好用来练判断：' +
      '① 让它写一个线程，检查它用的是 <code>start()</code> 还是 <code>run()</code>，' +
      '再追问「如果改成 run() 输出有什么变化」；② 让它解释 <code>sleep</code> 会不会释放锁，' +
      '答错就说明它把 sleep 与 wait 混了；③ 让它给聊天室「多客户端」方案，看它有没有把 ' +
      '<code>ClientHandler</code> 放进 <code>Thread</code>；④ 让它审查共享 <code>ArrayList</code> 的代码，' +
      '看它能不能指出遍历时增删的风险。<br>' +
      '验证方式：本章代码无法在站内运行（引擎不支持 Thread），要自己在 IntelliJ 里跑，' +
      '并故意把 <code>start()</code> 改成 <code>run()</code>，亲眼看线程名从 worker 变回 main。'
    }

  ]
});
