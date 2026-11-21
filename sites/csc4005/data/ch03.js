/* =====================================================================
 * ch03.js · 第 3 章「共享内存与同步：线程、锁与内存模型」
 * 职责：Pthreads 编程模型、竞态与临界区、条件变量、屏障、内存一致性、
 *       原子操作，以及死锁/伪共享/数据竞争三类高频错误。
 * 依据：Pthread Programming、Programming with Shared Memory Synchronization、
 *       Cache Coherence、Memory Consistency 四份讲义。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch03',
  num: '03',
  title: '共享内存与同步：线程、锁与内存模型',
  en: 'SHARED MEMORY & SYNCHRONIZATION',
  goals: [
    '用 Pthreads 创建、连接线程并正确传递与回收参数，指出共享与私有的边界',
    '识别数据竞争，说明为什么 i++ 不是原子操作，并用互斥锁保护临界区',
    '用条件变量实现生产者-消费者，解释 while 循环与虚假唤醒的关系',
    '区分互斥锁、自旋锁、读写锁、屏障与原子操作的适用场景与代价',
    '解释 x86 TSO 与弱内存序的差别，说出 acquire/release 解决了什么问题',
    '定位并修复死锁、伪共享与数据竞争，给出可验证的修法'
  ],
  kp: [
    { id: 'ch03-1', title: 'Pthreads 编程模型与线程生命周期' },
    { id: 'ch03-2', title: '竞态、临界区与互斥锁' },
    { id: 'ch03-3', title: '条件变量与生产者-消费者' },
    { id: 'ch03-4', title: '屏障、任务划分与线程池' },
    { id: 'ch03-5', title: '内存一致性模型与内存序' },
    { id: 'ch03-6', title: '原子操作、CAS 与无锁编程的边界' },
    { id: 'ch03-7', title: '三类高频错误：死锁、伪共享、数据竞争' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '共享内存的方便是有代价的', html: '共享内存看起来最自然：所有线程读同一批变量，写完对方立刻能看见。正因为「不需要显式通信」，编译器与 CPU 有了大量重排与缓存的空间，于是出现两类问题：<b>结果随机错</b>（数据竞争，一千次里错一次，重跑就好）与<b>加锁之后没变快</b>（争用与伪共享，锁本身把并行变成串行）。这一章把这两种现象背后的机制讲清楚，并给出可以直接套用的写法。' },

    { t: 'p', lead: true, html: '本章从最基础的线程创建讲起，一路走到内存模型：<b>先学会让多个线程安全地改同一份数据，再理解为什么「看起来安全」的代码在弱内存序机器上会出错。</b>所有例子都用 POSIX 线程（Pthreads）写，因为它是 C 语言共享内存并行的通用底座——OpenMP 在它上面封装，CUDA 的 block 内同步与它有相似的语义。' },

    { t: 'h', lvl: 2, text: '一、Pthreads 编程模型与线程生命周期', id: 'ch03-1' },

    { t: 'p', html: '一个 Pthreads 程序由<b>主线程</b>与若干<b>工作线程</b>组成，它们共享代码段、数据段与堆，但各自有独立的栈与寄存器。线程的入口函数签名固定为 <code>void *f(void *arg)</code>：参数与返回值都靠 <code>void *</code> 传递，因此通常把参数打包进一个结构体再取地址。<b>不要传局部变量的地址</b>——那个变量可能在 <code>pthread_create</code> 返回后就失效了。' },

    { t: 'p', html: '线程有两种结束方式：函数返回（返回值可被 <code>pthread_join</code> 取回）或调用 <code>pthread_exit</code>。主线程若直接 <code>return</code> 或 <code>exit</code>，整个进程结束，其余线程被强行终止——这是新手最常见的「程序跑一半就没了」。正确做法是主线程对每个线程 <code>pthread_join</code>，或调用 <code>pthread_exit</code> 只结束自己。' },

    { t: 'table', head: ['API', '作用', '常见错误'], rows: [
      ['pthread_create', '创建线程并开始执行入口函数', '传栈上变量的地址；忘了检查返回值'],
      ['pthread_join', '等待线程结束并回收资源', '不 join 导致资源泄漏；对已 join 的线程再 join'],
      ['pthread_exit', '结束当前线程', '在主线程调用后误以为进程会等所有线程'],
      ['pthread_self', '取当前线程 id', '把 id 当稳定编号用于数组下标'],
      ['pthread_detach', '让线程结束后自动回收', 'detach 之后又 join（未定义行为）']
    ], caption: 'Pthreads 的返回值都要检查：创建失败通常返回 EAGAIN（线程数超限）' },

    { t: 'p', html: '线程数不是越多越好。<b>可运行线程数超过物理核数时，操作系统做上下文切换，每次切换要保存/恢复寄存器、污染缓存</b>，切换开销在微秒量级。对计算密集型任务，线程数取物理核数最合适；对 I/O 密集或频繁阻塞的任务，可以适当超配。判断依据是 <code>perf stat</code> 里的 context-switches 计数，而不是拍脑袋。' },

    { t: 'h', lvl: 2, text: '二、竞态、临界区与互斥锁', id: 'ch03-2' },

    { t: 'p', html: '先看一段「显然正确」的代码：两个线程各执行 100 万次 <code>counter++</code>，最后打印。串行结果是 2000000，并行结果常常是 1987xxx 之类。原因在于 <code>counter++</code> 在机器层面是<b>读—改—写三步</b>：线程 A 读到 100，线程 B 也读到 100，两者都写回 101，一次自增就丢了。这类「结果依赖执行时序」的缺陷叫<b>数据竞争（data race）</b>。' },

    { t: 'p', html: '修复的方式是把「读—改—写」包成一个<b>临界区（critical section）</b>，用互斥锁（mutex）保证同一时刻只有一个线程在里面。<code>pthread_mutex_lock</code> 在锁已被占用时阻塞，<code>pthread_mutex_unlock</code> 唤醒等待者。<b>临界区必须尽量短</b>：把整个循环包进锁里，程序会退化成串行，加速比接近 1。' },

    { t: 'code', lang: 'c', caption: '用互斥锁保护共享计数器：每次只锁住一次自增', code: `#include <pthread.h>
#include <stdio.h>

static long counter = 0;                 /* 共享变量 */
static pthread_mutex_t mu = PTHREAD_MUTEX_INITIALIZER;

static void *bump(void *arg) {
    long n = *(long *)arg;
    for (long i = 0; i < n; ++i) {
        pthread_mutex_lock(&mu);         /* 进入临界区 */
        counter = counter + 1;           /* 读—改—写 被保护 */
        pthread_mutex_unlock(&mu);       /* 离开临界区 */
    }
    return NULL;
}

int main(void) {
    const long PER = 1000000;
    pthread_t a, b;
    pthread_create(&a, NULL, bump, &PER);
    pthread_create(&b, NULL, bump, &PER);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("counter = %ld\\n", counter);  /* 期望 2000000 */
    return 0;
}` },

    { t: 'p', html: '这段代码结果正确，但性能很差：<b>200 万次加锁解锁，每次无争用时约 20–50 ns，有争用时可达数百纳秒到微秒</b>，光锁开销就上百毫秒。真实程序的做法是「每个线程先累加到私有变量，最后只加锁一次」（即 ch02 的分块归约）。这个模式叫<b>减少临界区次数</b>，比缩小临界区更有效。' },

    { t: 'p', html: '锁的粒度是另一个维度。<b>粗粒度锁</b>一把锁保护整个数据结构，实现简单但并发度低；<b>细粒度锁</b>每个桶/每行一把锁，并发度高但容易死锁、内存开销大。折中方案包括读写锁（读多写少时让多个读者并行）、分段锁（按哈希桶分段）、以及无锁结构（下一节）。选择依据是读写比例与临界区长度，而不是「越细越好」。' },

    { t: 'compare', left: { title: '粗粒度锁：简单但排队', html: '一把锁保护整张哈希表。所有操作串行，吞吐随线程数不增反降，因为锁争用导致缓存行弹跳与调度抖动。好处是几乎不会死锁。' }, right: { title: '细粒度锁：并发但易错', html: '每个桶一把锁，不同桶可并行。代价是要处理锁顺序（避免死锁）、锁数组的伪共享，以及扩容时的全局协调。' } },

    { t: 'quiz', qid: 'ch03-q1' },

    { t: 'h', lvl: 2, text: '三、条件变量与生产者-消费者', id: 'ch03-3' },

    { t: 'p', html: '互斥锁解决「不能同时改」，但解决不了「等某个条件成立」。如果消费者发现缓冲区为空，它不能拿着锁自旋（占着 CPU 还不让生产者进入），正确做法是<b>条件变量（condition variable）</b>：<code>pthread_cond_wait</code> 原子地释放锁并睡眠，被唤醒后重新获取锁再检查条件。' },

    { t: 'p', html: '这里有一个必须记住的细节：<b><code>pthread_cond_wait</code> 必须放在 <code>while</code> 循环里</b>，不能写成 <code>if</code>。原因有三：唤醒可能来自信号（spurious wakeup）、可能被其他消费者抢先消费、也可能 <code>pthread_cond_broadcast</code> 唤醒了多个线程但只有一个能继续。写成 <code>while (!ready) wait();</code> 才是标准写法。' },

    { t: 'code', lang: 'c', caption: '有界缓冲区：生产者放、消费者取，用条件变量睡眠等待', code: `#include <pthread.h>
#define CAP 8

static int buf[CAP], head = 0, tail = 0, count = 0;
static pthread_mutex_t mu = PTHREAD_MUTEX_INITIALIZER;
static pthread_cond_t not_full  = PTHREAD_COND_INITIALIZER;
static pthread_cond_t not_empty = PTHREAD_COND_INITIALIZER;

void put(int v) {
    pthread_mutex_lock(&mu);
    while (count == CAP)                       /* 必须用 while：可能被虚假唤醒 */
        pthread_cond_wait(&not_full, &mu);     /* 原子地放锁并睡眠 */
    buf[tail] = v;
    tail = (tail + 1) % CAP;
    ++count;
    pthread_cond_signal(&not_empty);           /* 唤醒一个消费者 */
    pthread_mutex_unlock(&mu);
}

int get(void) {
    pthread_mutex_lock(&mu);
    while (count == 0)
        pthread_cond_wait(&not_empty, &mu);
    int v = buf[head];
    head = (head + 1) % CAP;
    --count;
    pthread_cond_signal(&not_full);
    pthread_mutex_unlock(&mu);
    return v;
}` },

    { t: 'p', html: '注意 <code>signal</code> 与 <code>broadcast</code> 的区别：<b>signal 只唤醒一个等待者</b>，适合「一个元素只够一个消费者」的场景；<b>broadcast 唤醒全部</b>，适合状态变化影响所有线程（如「关闭」标志）。选错不会错但会慢，或者会漏唤醒导致永久阻塞——后者是调试中最难查的一类 bug，因为程序不报错，只是卡住。' },

    { t: 'p', html: '还有一个易错点：<b>条件判断必须由锁保护</b>。如果 <code>count</code> 在锁外读，读到旧值时可能错过唤醒；如果 <code>signal</code> 在锁外发，可能出现在 <code>wait</code> 之前，导致等待者永远睡下去（lost wakeup）。规则是：<b>改状态、检查条件、发信号，全部在持锁区间内完成。</b>' },

    { t: 'h', lvl: 2, text: '四、屏障、任务划分与线程池', id: 'ch03-4' },

    { t: 'p', html: '<b>屏障（barrier）</b>是另一种同步：它不保护数据，而是让所有线程在此处会合，等最后一个到达才一起继续。典型用法是时间步进仿真——每个线程算完自己那块区域后必须等别人也算完，才能交换边界数据进入下一步。<code>pthread_barrier_wait</code> 的语义是「调用次数达到阈值时全部放行」，因此<b>每个线程必须调用相同的次数</b>，否则会死锁。' },

    { t: 'p', html: '屏障的代价随线程数增长，因为最后一个到达的线程决定了所有人等待的时间。<b>如果各线程工作量不均，屏障会把「最慢者」的延迟累加到每个时间步</b>，这就是 ch02 负载均衡问题在同步层面的体现。上千线程时，一次全局屏障可能要几微秒，每秒只能做几十万步。' },

    { t: 'p', html: '实际工程里很少为每个任务创建一个线程，而是用<b>线程池（thread pool）</b>：预先创建固定数量的工作线程，任务放进队列，空闲线程取任务执行。它避免了频繁创建/销毁的开销（每次几十微秒），也让任务数可以远大于线程数，天然支持动态负载均衡（ch02）。OpenMP 的运行时、Java 的 ForkJoinPool、TBB 都是线程池的不同实现。' },

    { t: 'p', html: '把任务映射到线程时要注意<b>线程亲和性（affinity）</b>。默认调度器可能把线程在核之间来回迁移，导致缓存全部失效。用 <code>pthread_setaffinity_np</code> 或 <code>taskset</code> 把线程绑定到固定核，配合 NUMA 的本地内存分配（first touch），常能带来 10%–30% 的提升。' },

    { t: 'h', lvl: 2, text: '五、内存一致性模型与内存序', id: 'ch03-5' },

    { t: 'p', html: '到目前为止我们假设「线程 A 写 x=1，线程 B 随后读 x 就能看到 1」。在单核时代这基本成立，在多核与多级缓存下<b>这个假设是错的</b>。为了让编译器与 CPU 自由优化，硬件定义了<b>内存一致性模型（memory consistency model）</b>：它规定「哪些重排是允许的」。x86 采用较强的 <b>TSO（Total Store Order）</b>，只允许「写后读」重排；ARM 与 POWER 是弱序，允许更多重排。' },

    { t: 'table', head: ['内存序', '含义', '典型用法', '代价'], rows: [
      ['relaxed', '只保证原子性，不保证顺序', '计数器、统计量', '最低'],
      ['acquire', '之后的读写不能提到它前面', '读标志位后访问数据', '中（x86 几乎免费）'],
      ['release', '之前的读写不能拖到它后面', '写完数据后置标志位', '中'],
      ['acq_rel', '同时具备两者', 'CAS 循环中的读改写', '中'],
      ['seq_cst', '全局单一顺序，最强', '默认、跨线程握手', '高（弱序机器上需栅栏）']
    ], caption: 'C11 的 memory_order 与 C++ 一致；无脑用 seq_cst 正确但可能损失性能' },

    { t: 'p', html: '经典的 <b>store-buffer 例子</b>：线程 1 执行 <code>x=1; r1=y;</code>，线程 2 执行 <code>y=1; r2=x;</code>。在 TSO 下可能观察到 <code>r1==0 &amp;&amp; r2==0</code>——因为两次写都还停在 store buffer 里，读却先执行了。这不是硬件的 bug，而是模型允许的行为。要禁止它，需要把两次写变成 release、或插入完整的栅栏（<code>__sync_synchronize()</code> / <code>atomic_thread_fence(seq_cst)</code>）。' },

    { t: 'p', html: '这也解释了为什么「加了锁就安全」并不完全对：锁本身提供了 acquire/release 语义，所以临界区内的读写不会被重排到锁外；但<b>无锁代码里只写 <code>atomic</code> 而不指定内存序，默认是 seq_cst</b>（安全但慢），一旦为了性能改成 relaxed，就必须自己补上 acquire/release 配对。判断规则很简单：<b>凡是「先准备数据、再发布标志」的结构，发布用 release、读取用 acquire</b>。' },

    { t: 'quiz', qid: 'ch03-q2' },

    { t: 'h', lvl: 2, text: '六、原子操作、CAS 与无锁编程的边界', id: 'ch03-6' },

    { t: 'p', html: '如果临界区里只有一个变量、一次操作，用锁太重，可以用<b>原子操作（atomic operation）</b>。C11 的 <code>atomic_fetch_add</code> 在硬件上对应一条 <code>lock xadd</code>（x86）或 <code>ldadd</code>（ARM），保证「读—改—写」不可分割，且没有阻塞。它适合计数器、引用计数、统计量这类简单累加。' },

    { t: 'p', html: '<b>比较并交换（compare-and-swap，CAS）</b>是无锁数据结构的基石：<code>atomic_compare_exchange_weak(&p, &expected, desired)</code> 只有当 <code>p</code> 仍等于 <code>expected</code> 时才写入 <code>desired</code>。用它可以在循环里重试，实现无锁栈、无锁队列、无锁哈希表。但要注意两个陷阱：<b>ABA 问题</b>（值从 A 变 B 又变回 A，CAS 以为没变过）与<b>活锁</b>（高争用时所有线程都在重试，谁也无法前进）。' },

    { t: 'code', lang: 'c', caption: '原子计数器与 CAS 循环：比锁轻，但要注意内存序与争用', code: `#include <stdatomic.h>
#include <stdio.h>

static atomic_long hits = 0;

/* 1) 原子自增：无锁、单条指令，适合统计 */
void record(void) {
    atomic_fetch_add_explicit(&hits, 1, memory_order_relaxed);
}

/* 2) CAS 循环：把 p 指向的值从 old 换成 new，失败就重读重试 */
int replace(atomic_int *p, int oldv, int newv) {
    int expected = oldv;
    while (!atomic_compare_exchange_weak_explicit(
               p, &expected, newv,
               memory_order_acq_rel, memory_order_acquire)) {
        if (expected != oldv) return 0;   /* 被别人改过了，放弃 */
    }
    return 1;                             /* 成功替换 */
}

int main(void) {
    record();
    atomic_int v = 7;
    printf("replaced=%d, v=%d, hits=%ld\\n",
           replace(&v, 7, 9), atomic_load(&v), atomic_load(&hits));
    return 0;
}` },

    { t: 'p', html: '无锁不等于更快。原子操作会<b>锁住缓存行</b>（x86 的 lock 前缀要求独占该行），高争用时性能急剧下降，甚至比互斥锁更差——因为锁会让等待者睡眠，而 CAS 循环会让所有线程空转烧 CPU。经验是：<b>争用低、临界区极短时原子操作占优；争用高时应分段（每线程一个计数器，最后汇总）</b>。这也是为什么高性能计数器常用「per-CPU 计数 + 定期合并」。' },

    { t: 'h', lvl: 2, text: '七、三类高频错误：死锁、伪共享、数据竞争', id: 'ch03-7' },

    { t: 'p', html: '<b>死锁（deadlock）</b>需要四个条件同时成立：互斥、持有并等待、不可抢占、循环等待。工程上最容易破的是循环等待——<b>规定全局锁顺序</b>，所有线程按同一顺序加锁。另一个办法是用 <code>pthread_mutex_trylock</code> 失败就释放已有锁重试，或用带超时的锁。调试死锁时 <code>gdb -p &lt;pid&gt;</code> 后 <code>thread apply all bt</code> 能直接看到每个线程卡在哪把锁上。' },

    { t: 'p', html: '<b>伪共享（false sharing）</b>是「逻辑上不共享、物理上共享」：两个线程各自更新自己的变量，但两个变量落在同一个 64 字节缓存行里，硬件仍要保证一致性，于是缓存行在两个核之间来回失效。表现为：线程数增加，性能反而下降。<b>修法是把变量按缓存行对齐或填充</b>（<code>alignas(64)</code> 或手工 padding），或者让每个线程使用独立的局部数组。' },

    { t: 'code', lang: 'c', caption: '伪共享的修法：把每个线程的计数器放进独立的缓存行', code: `#include <stdalign.h>

#define CACHE_LINE 64

/* 错误写法：四个 long 挤在同一行，四线程写各自的下标仍互相拖累 */
static long bad[4];

/* 正确写法：每个槽位独占一个缓存行，写操作不再让对方缓存行失效 */
struct padded { alignas(CACHE_LINE) long v; char pad[CACHE_LINE - sizeof(long)]; };
static struct padded good[4];

void bump_bad(int tid) { bad[tid] += 1; }    /* 实测 4 线程常比单线程慢 2–4 倍 */
void bump_good(int tid) { good[tid].v += 1; }/* 接近线性 */` },

    { t: 'p', html: '<b>数据竞争</b>比前两者更隐蔽：程序大部分时候结果正确，压力大或换机器才出错。<b>检测工具</b>是必须用的：<code>gcc -fsanitize=thread</code>（TSan）在运行时记录每次访问与同步关系，能报出具体哪两行代码冲突，并给出调用栈；<code>valgrind --tool=helgrind</code> 是另一选择，慢但不需要重编译。规则是：<b>任何被两个以上线程访问、且至少一个在写的变量，要么加锁、要么用原子、要么保证只读</b>。' },

    { t: 'callout', kind: 'warn', title: '三种错误的症状对照', html: '<b>死锁</b>：程序卡住不动，CPU 占用为 0，栈显示都在等锁。<b>伪共享</b>：结果正确但加线程不变快甚至更慢，<code>perf c2c</code> 能定位到冲突的缓存行。<b>数据竞争</b>：结果偶尔错，TSan 一跑就报。遇到「并行后变慢」先怀疑伪共享与锁争用，遇到「结果随机」先怀疑竞争，遇到「卡住」先怀疑死锁。' },

    { t: 'quiz', qid: 'ch03-q3' },

    { t: 'terms', items: [
      { en: 'data race', zh: '数据竞争', html: '两个线程并发访问同一变量、至少一个写、且没有同步，结果依赖执行时序。' },
      { en: 'critical section', zh: '临界区', html: '需要互斥执行的代码段，同一时刻只能有一个线程在其中。' },
      { en: 'condition variable', zh: '条件变量', html: '让线程在条件不成立时原子地释放锁并睡眠，条件成立时被唤醒重试。' },
      { en: 'barrier', zh: '屏障', html: '所有线程到达后才一起继续的同步点，常用于时间步进与阶段边界。' },
      { en: 'memory consistency model', zh: '内存一致性模型', html: '规定多核间读写可见性与允许的重排，如 x86 TSO 与 ARM 弱序。' },
      { en: 'CAS', zh: '比较并交换', html: '仅当当前值等于期望值时才写入的原子指令，是无锁结构的基础。' },
      { en: 'false sharing', zh: '伪共享', html: '不同线程写同一缓存行内的不同变量，引发缓存行在核间反复失效。' }
    ] },

    { t: 'keypoint', items: [
      { title: 'i++ 不是原子操作', html: '读—改—写三步之间可被抢占；用锁、原子操作或「私有累加后汇总」。' },
      { title: '临界区要短，次数要少', html: '缩小锁范围不如减少加锁次数：先局部累加，最后合并一次。' },
      { title: '条件变量必须配 while', html: '虚假唤醒与抢先消费都会让 if 写法出错；改状态与发信号都要持锁。' },
      { title: '内存序决定可见性', html: '「先准备数据、再发布标志」用 release 发布、acquire 读取。' },
      { title: '无锁不一定更快', html: '高争用时 CAS 循环空转烧 CPU；分段计数往往更稳。' }
    ] },

    { t: 'checklist', id: 'ch03', items: [
      '我能写出一个正确的 Pthreads 程序，并说明参数为什么要用结构体传',
      '我能解释 counter++ 在汇编层面为什么会被打断，并给出三种修法',
      '我能说出为什么 pthread_cond_wait 必须放在 while 里',
      '我能区分 signal 与 broadcast 的适用场景，并说出漏唤醒的成因',
      '我能解释屏障为什么会放大负载不均，以及每个线程必须调用相同次数的原因',
      '我能说出 TSO 与弱序的差别，并用 store-buffer 例子解释 r1==r2==0',
      '我知道 acquire/release 各自阻止哪种重排，能说出一个配对使用的场景',
      '我能说出死锁的四个条件与至少两种破法',
      '我能解释伪共享的成因、症状，并用 alignas(64) 给出修法',
      '我知道用 TSan 检测数据竞争，并能读懂它报的冲突位置'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 Pthread Programming、Programming with Shared Memory Synchronization、Cache Coherence 与 Memory Consistency 四份讲义组织：Pthreads API 与生产者-消费者来自前两份，缓存一致性与伪共享来自 Cache Coherence，TSO/弱序与 acquire/release 来自 Memory Consistency。锁与原子操作的纳秒级数字为典型量级（无争用 mutex 约 20–50 ns，争用时可达数百纳秒以上），用于建立数量级直觉，具体随 CPU 与内核版本变化。C11 原子操作的完整语义与无锁数据结构的正确性证明超出本课范围，本章只要求会正确使用与识别陷阱；OpenMP 的同步构造（barrier/critical/atomic）在 ch04 展开。' }
  ]
});
