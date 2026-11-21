/* =====================================================================
 * data/ch09.js · 第 09 章：内存安全与并发
 * 职责：前半讲单线程内存安全（缓冲区溢出、越界、未初始化、sanitizer），
 *       后半讲多线程安全（pthread、竞态、互斥锁、信号量、死锁）。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch09',
  num: '09',
  title: '内存安全与并发',
  en: 'Memory Safety & Concurrency',
  goals: [
    '能解释缓冲区溢出、越界写、未初始化读取分别会造成什么后果',
    '能写出带边界检查的字符串与数组代码，并知道危险函数的替代',
    '能用 -fsanitize=address 和 -fsanitize=undefined 定位内存与未定义行为错误',
    '能用 pthread_create / pthread_join 写出一个真正的多线程程序',
    '能解释竞态条件，并用互斥锁或信号量修复，同时识别死锁'
  ],
  kp: [
    { id: 'ch09-1', title: '缓冲区溢出与越界' },
    { id: 'ch09-2', title: '未初始化内存与防御性写法' },
    { id: 'ch09-3', title: '用 sanitizer 抓错误' },
    { id: 'ch09-4', title: '线程与 pthread' },
    { id: 'ch09-5', title: '竞态条件与互斥锁' },
    { id: 'ch09-6', title: '信号量、死锁与原子操作' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      'C 把内存安全的检查交给程序员：编译器信任你的每个下标、每次指针运算。' +
      '这换来了速度，也换来一类最难查的 bug——它们可能不崩、不报错，只是悄悄改坏数据；' +
      '一旦程序里出现多个线程，这类问题还会叠加成"跑一百次只错一次"的竞态。' +
      '这一章做两件事：先学会发现和避免内存错误，再学会用锁把并发写对。'
    },

    { t: 'p', lead: true, html:
      '这一章分两半：前半是<b>单线程的内存安全</b>——越界、未初始化、悬垂指针；' +
      '后半是<b>多线程的并发安全</b>——线程、竞态、锁、死锁。' +
      '两块看起来不相关，其实是同一个主题的两面：<b>C 把"保证正确"的责任交给了你</b>。' +
      '好消息是，这两类问题都有成熟的工具和固定的防法。'
    },

    { t: 'h', text: '一、缓冲区溢出与越界', id: 'ch09-1' },

    { t: 'p', html:
      '<b>缓冲区</b>就是一块装数据的固定大小内存（一个数组、一个 <code>char</code> 数组）。' +
      '<b>溢出</b>是往里面写了超过容量的数据。最经典的错误是用不检查长度的函数复制字符串：' +
      '<code>strcpy</code> 只管闷头复制，直到看见源字符串结尾的 <code>\\0</code>，' +
      '至于目标装不装得下，它不知道也不关心。'
    },

    { t: 'code', lang: 'c', caption: 'overflow.c —— 17 个字节塞进 8 字节的数组（错误示范）', code:
`#include <stdio.h>
#include <string.h>

int main(void) {
    char name[8];

    // 危险：strcpy 不检查目标容量。源字符串长 16 个字符，
    // 加上结尾的 '\\0' 一共 17 个字节，全部写进 8 字节的数组。
    strcpy(name, "0123456789abcdef");

    printf("name = %s\\n", name);
    return 0;
}
` },

    { t: 'p', html:
      '栈上的数组后面紧挨着什么？可能是别的局部变量，可能是保存的 <code>rbp</code>，' +
      '也可能是<b>返回地址</b>。所以越界写有三种后果，一种比一种糟：' +
      '立刻崩溃（最幸运）、悄悄改坏相邻变量（最难查）、覆盖返回地址从而劫持执行流' +
      '（这就是经典的缓冲区溢出漏洞）。现代编译器会用栈保护（canary）检测一部分情况，' +
      '但那是缓解措施，不是许可证。'
    },

    { t: 'callout', kind: 'warn', html:
      '越界是<b>未定义行为</b>，这意味着"程序没崩"不代表代码正确。' +
      '反过来，看到"某次运行结果正常"就放心，是内存安全里最常见、也最致命的误判。' +
      '正确做法只有一条：<b>永远不要写超过容量的数据</b>，让长度计算在代码里显式出现。'
    },

    { t: 'p', html:
      'C 标准库里有几组"危险但常用"的函数，问题都出在"没有长度参数"或"返回时不保证结尾"。' +
      '把它们换成带边界的版本，是最低成本的加固。'
    },

    { t: 'table', head: ['危险写法', '风险', '安全替代'], rows: [
      ['<code>strcpy(dst, src)</code>', '目标容量未知，直接溢出', '<code>snprintf(dst, sizeof dst, "%s", src)</code>'],
      ['<code>strcat(dst, src)</code>', '不看剩余空间', '用 <code>snprintf</code> 从 <code>dst + strlen(dst)</code> 处续写'],
      ['<code>sprintf(buf, ...)</code>', '格式化输出不设上限', '<code>snprintf(buf, sizeof buf, ...)</code>'],
      ['<code>gets(buf)</code>', '完全不知道边界，已从标准移除', '<code>fgets(buf, sizeof buf, stdin)</code>'],
      ['<code>scanf("%s", buf)</code>', '不限制读入宽度', '<code>scanf("%7s", buf)</code>（宽度 = 容量 − 1）'],
      ['<code>memcpy(dst, src, n)</code>', '<code>n</code> 由你保证，写错就溢出', '复制前检查 <code>n &lt;= sizeof dst</code>']
    ] },

    { t: 'code', lang: 'c', caption: 'safe_str.c —— 有界写入与有界读取', code:
`#include <stdio.h>

int main(void) {
    char name[8];

    int n = snprintf(name, sizeof name, "%s", "0123456789abcdef");
    // 最多写 sizeof name 个字节（含结尾 '\\0'），返回"本来想写的长度"
    printf("name = %s，返回值 = %d\\n", name, n);

    char line[16];
    if (fgets(line, sizeof line, stdin) != NULL) {
        printf("读到：%s", line);
    }
    return 0;
}
` },

    { t: 'p', html:
      '另一个高频错误叫 <b>off-by-one</b>：循环条件写成了 <code>&lt;=</code>。' +
      '数组下标是 <code>0</code> 到 <code>n - 1</code>，共 <code>n</code> 个；' +
      '<code>i &lt;= n</code> 会多访问一个，而且多出来的这个位置经常"碰巧"是另一个变量，' +
      '于是程序看起来还能跑。'
    },

    { t: 'code', lang: 'c', caption: 'offbyone.c —— i == 5 时已经越界', code:
`#include <stdio.h>

int main(void) {
    int a[5] = {0};

    for (int i = 0; i <= 5; i++) {     // 错：合法下标是 0..4
        a[i] = i;                      // i == 5 时写到了数组外面
    }

    // 越界写是 UB：可能没事，也可能改坏相邻变量，甚至破坏返回地址
    printf("a[0] = %d\\n", a[0]);
    return 0;
}
` },

    { t: 'h', text: '二、未初始化内存与防御性写法', id: 'ch09-2' },

    { t: 'p', html:
      '第二类错误是<b>读未初始化的内存</b>。第 06 章说过 <code>malloc</code> 不清零，' +
      '栈上的局部数组同样不会自动初始化。这些字节里可能是上一次调用留下的数据，' +
      '也可能是完全无关的垃圾；读它们属于未定义行为。' +
      '麻烦的是它经常"看起来有个合理数字"，于是错误被带到很远的地方才暴露。'
    },

    { t: 'code', lang: 'c', caption: 'uninit.c —— 直接对未初始化的堆内存求和（错误示范）', code:
`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *a = malloc(10 * sizeof(int));
    if (a == NULL) return 1;

    // 错：malloc 不初始化。这里读到的 10 个 int 都是不确定值，
    // 读取未初始化内存是未定义行为。
    int sum = 0;
    for (int i = 0; i < 10; i++) {
        sum += a[i];
    }

    printf("sum = %d\\n", sum);
    free(a);
    return 0;
}
` },

    { t: 'p', html:
      '防御性写法不是"多写检查"，而是把边界信息放在类型和数据流里，让它不容易写错。' +
      '下面这几条习惯基本能消灭大部分低级内存错误。'
    },

    { t: 'steps', items: [
      { title: '分配后立刻初始化', html: '需要全 0 就用 <code>calloc</code>；<code>malloc</code> 之后立刻 <code>memset</code> 或循环赋值，别让"未初始化"状态存在太久。' },
      { title: '长度用 size_t 并与容量比较', html: '下标、容量统一用 <code>size_t</code>；比较时避免有符号/无符号混用，<code>-Wall -Wextra</code> 会提示可疑比较。' },
      { title: '写之前先算"还剩多少"', html: '拼接字符串时随时维护剩余容量，而不是先写再祈祷；<code>snprintf</code> 的返回值能告诉你"本应写多长"。' },
      { title: '边界用常量或 sizeof 表达', html: '不要到处硬编码 <code>8</code>；用 <code>sizeof arr / sizeof arr[0]</code> 或具名常量，改容量时只改一处。' },
      { title: '关键位置加 assert', html: '<code>assert(0 &lt;= i &amp;&amp; i &lt; n)</code> 在调试期免费检查，发布时加 <code>-DNDEBUG</code> 即可消除。' }
    ] },

    { t: 'callout', kind: 'tip', html:
      '编译选项本身就是第一道检查：<code>-Wall -Wextra -Werror</code> 把可疑写法变成编译错误，' +
      '<code>-fstack-protector-strong</code> 增加栈溢出检测，' +
      '<code>-D_FORTIFY_SOURCE=2</code> 让常见字符串函数在编译期做容量检查。' +
      '把这些写进 Makefile，比靠记性可靠。'
    },

    { t: 'h', text: '三、用 sanitizer 抓错误', id: 'ch09-3' },

    { t: 'p', html:
      '<b>AddressSanitizer</b>（ASan）是 GCC / Clang 内置的内存错误检测器：' +
      '它在每块内存周围放"红区"，用影子内存记录每个字节是否可访问，' +
      '一旦越界、使用已释放内存或双重释放，<b>当场报错并打印源码行号</b>。' +
      '用法很简单：编译时加 <code>-fsanitize=address -g</code>，然后正常运行程序。'
    },

    { t: 'code', lang: 'c', caption: 'asan.c —— 编译：gcc -fsanitize=address -g asan.c', code:
`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *a = malloc(4 * sizeof(int));
    if (a == NULL) return 1;
    for (int i = 0; i < 4; i++) {
        a[i] = i;
    }

    a[4] = 99;      // 越界写：ASan 会报 heap-buffer-overflow 并指出这一行

    free(a);
    return 0;
}
` },

    { t: 'p', html:
      'ASan 的报告会写明错误类型（<code>heap-buffer-overflow</code>、' +
      '<code>heap-use-after-free</code>、<code>attempting double-free</code>）、' +
      '出错地址、以及完整的函数调用栈。看到这类报告，直接去看它标出的最上面那一行源码。' +
      '另外两类工具也值得知道：<b>UBSan</b> 管未定义行为（有符号溢出、非法移位、未对齐访问），' +
      '<b>TSan</b> 管数据竞争——后者正是这一章后半的主题。'
    },

    { t: 'table', head: ['工具', '主要抓什么', '编译选项'], rows: [
      ['AddressSanitizer', '堆/栈越界、使用后释放、双重释放、泄漏', '<code>-fsanitize=address -g</code>'],
      ['UndefinedBehaviorSanitizer', '有符号溢出、非法移位、未对齐访问、类型双关', '<code>-fsanitize=undefined -g</code>'],
      ['ThreadSanitizer', '多线程数据竞争', '<code>-fsanitize=thread -g</code>'],
      ['valgrind --tool=memcheck', '未初始化读、越界、泄漏（不需重编译）', '外部工具，直接跑可执行文件']
    ] },

    { t: 'callout', kind: 'tip', html:
      '养成习惯：<b>开发期默认开 ASan + UBSan</b>，一套程序跑一遍，再关掉它们测性能。' +
      'ASan 会让程序慢 2 倍左右、占用更多内存，所以不要带进生产环境；' +
      '但它抓到的错误，本来会让程序在客户那里随机崩溃。'
    },

    { t: 'h', text: '四、线程与 pthread', id: 'ch09-4' },

    { t: 'p', html:
      '<b>线程</b>是操作系统调度的基本单位。同一个进程里的多个线程共享代码、全局变量和堆，' +
      '但每个线程有自己独立的栈和寄存器。这带来两个直接后果：' +
      '线程间传数据非常便宜（指向同一块内存即可），但<b>同时写共享数据就会出问题</b>。' +
      'C 标准本身不定义线程，POSIX 的 <code>pthread</code> 是 Linux / macOS 上的通用接口。'
    },

    { t: 'flow', dir: 'v', nodes: [
      { title: '主线程开始', desc: 'main 本身就是一个线程', kind: 'proc' },
      { title: 'pthread_create 创建子线程', desc: '每个线程获得独立栈，共享全局区与堆', kind: 'proc' },
      { title: '多个线程并发执行', desc: '操作系统随时可能切换，执行顺序不确定', kind: 'proc' },
      { title: 'pthread_join 等待', desc: '回收子线程；不 join 可能泄漏线程资源', kind: 'proc' },
      { title: '主线程退出', desc: '进程结束，所有线程一起消失', kind: 'decide' }
    ] },

    { t: 'code', lang: 'c', caption: 'hello_thread.c —— 编译：gcc -pthread hello_thread.c', code:
`#include <stdio.h>
#include <pthread.h>

// 线程入口函数必须是 void *(*)(void *)，与第 07 章的函数指针类型一致
static void *hello(void *arg) {
    const char *name = arg;            // 把 void * 还原成具体类型
    printf("你好，%s（来自子线程）\\n", name);
    return NULL;
}

int main(void) {
    pthread_t tid;

    int rc = pthread_create(&tid, NULL, hello, "worker");
    if (rc != 0) {                     // pthread 系列成功返回 0，失败返回错误码
        fprintf(stderr, "创建线程失败：%d\\n", rc);
        return 1;
    }

    pthread_join(tid, NULL);           // 等子线程结束再继续
    printf("主线程结束\\n");
    return 0;
}
` },

    { t: 'p', html:
      '<code>pthread_create</code> 的四个参数：线程 id 的输出位置、线程属性（<code>NULL</code> 表示默认）、' +
      '入口函数、传给入口函数的 <code>void *</code> 参数。' +
      '入口函数的签名就是第 07 章那种函数指针类型：<code>void *(*)(void *)</code>。' +
      '需要传多个值时，把参数打包成结构体，传结构体地址即可；' +
      '要拿子线程的返回值，就传 <code>pthread_join</code> 的第二个参数（类型是 <code>void **</code>）。'
    },

    { t: 'callout', kind: 'note', html:
      '<code>pthread_create</code> 返回 <code>0</code> 表示成功，否则返回错误码（不是设置 <code>errno</code>）。' +
      '<code>pthread_join</code> 一定要调用：它负责回收线程资源，并保证子线程确实已经结束。' +
      '如果 <code>main</code> 直接 <code>return</code>，整个进程退出，子线程会被直接掐断。'
    },

    { t: 'h', text: '五、竞态条件与互斥锁', id: 'ch09-5' },

    { t: 'p', html:
      '多个线程同时读写同一个变量，且至少一个在写，就叫<b>数据竞争</b>；' +
      '由此产生的错误叫<b>竞态条件</b>。它难查的原因是<b>结果取决于调度时序</b>：' +
      '同样一份程序，可能一万次都跑对，也可能第一万零一次算错。' +
      '根源在于 <code>counter++</code> 不是一条指令，而是"读 → 加 → 写回"三步。'
    },

    { t: 'table', head: ['时刻', '线程 A', '线程 B', '内存里的 counter'], rows: [
      ['t1', '读到 0', '', '0'],
      ['t2', '', '读到 0', '0'],
      ['t3', '计算 0 + 1 = 1', '', '0'],
      ['t4', '', '计算 0 + 1 = 1', '0'],
      ['t5', '写回 1', '', '1'],
      ['t6', '', '写回 1', '1']
    ], caption: '两次自增交错执行，最终只加了 1：这就是"丢失更新"' },

    { t: 'code', lang: 'c', caption: 'race.c —— 两个线程各加 100 万次，结果通常小于 200 万', code:
`#include <stdio.h>
#include <pthread.h>

static long counter = 0;               // 两个线程共享同一个变量

static void *worker(void *arg) {
    long n = *(const long *)arg;
    for (long i = 0; i < n; i++) {
        counter++;                     // 读-改-写三步，可能被另一个线程打断
    }
    return NULL;
}

int main(void) {
    long n = 1000000;
    pthread_t t1, t2;

    pthread_create(&t1, NULL, worker, &n);
    pthread_create(&t2, NULL, worker, &n);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    printf("counter = %ld（期望 %ld）\\n", counter, 2 * n);
    return 0;
}
` },

    { t: 'p', html:
      '修复办法是<b>互斥锁</b>：在修改共享数据的那几条语句前后加锁，保证同一时刻只有一个线程在"临界区"里。' +
      '<code>pthread_mutex_t</code> 可以直接用 <code>PTHREAD_MUTEX_INITIALIZER</code> 静态初始化，' +
      '不需要手动 <code>init</code> 和 <code>destroy</code>。'
    },

    { t: 'code', lang: 'c', caption: 'mutex.c —— 临界区里只有一条自增，结果一定是 200 万', code:
`#include <stdio.h>
#include <pthread.h>

static long counter = 0;
static pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

static void *worker(void *arg) {
    long n = *(const long *)arg;
    for (long i = 0; i < n; i++) {
        pthread_mutex_lock(&lock);
        counter++;                     // 临界区：同一时刻只有一个线程能进来
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

int main(void) {
    long n = 1000000;
    pthread_t t1, t2;

    if (pthread_create(&t1, NULL, worker, &n) != 0) return 1;
    if (pthread_create(&t2, NULL, worker, &n) != 0) return 1;
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    printf("counter = %ld（一定是 %ld）\\n", counter, 2 * n);
    return 0;
}
` },

    { t: 'p', html:
      '锁的规则比锁的语法更重要，至少有四条：' +
      '<b>1)</b> 保护的是<b>数据</b>，不是某段代码——所有访问这条数据的路径都必须加同一把锁；' +
      '<b>2)</b> 临界区越小越好，锁里不要做 IO、<code>printf</code>、睡眠这类慢操作；' +
      '<b>3)</b> 加锁顺序必须固定，否则会死锁（下一节见）；' +
      '<b>4)</b> 能不用锁就不用——只读共享数据完全不需要锁。'
    },

    { t: 'callout', kind: 'tip', html:
      '锁的代价是"串行化"。上面的例子每加一次锁才做一次加法，1 亿次循环会明显变慢。' +
      '实际做法是<b>线程本地累加，最后合并</b>：每个线程用局部变量加自己的部分，' +
      '只在最后取一次锁把结果加到共享变量上。正确性和性能可以同时拿到。'
    },

    { t: 'h', text: '六、信号量、死锁与原子操作', id: 'ch09-6' },

    { t: 'p', html:
      '<b>信号量</b>是一个带计数的同步原语：<code>sem_wait</code> 把计数减 1，' +
      '减到 0 就阻塞；<code>sem_post</code> 把计数加 1 并唤醒等待者。' +
      '初值设为 1 时，它等价于互斥锁；初值设为 N 时，它限制"最多 N 个线程同时进入"，' +
      '适合做连接池、限流、生产者—消费者队列。'
    },

    { t: 'code', lang: 'c', caption: 'sem.c —— 初值为 1 的信号量就是互斥锁', code:
`#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

static long counter = 0;
static sem_t gate;                     // 计数信号量

static void *worker(void *arg) {
    long n = *(const long *)arg;
    for (long i = 0; i < n; i++) {
        sem_wait(&gate);               // P：计数减 1；为 0 时阻塞
        counter++;
        sem_post(&gate);               // V：计数加 1；唤醒一个等待者
    }
    return NULL;
}

int main(void) {
    long n = 200000;
    pthread_t t1, t2;

    sem_init(&gate, 0, 1);             // 第二个参数 0：线程间共享；初值 1
    pthread_create(&t1, NULL, worker, &n);
    pthread_create(&t2, NULL, worker, &n);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    sem_destroy(&gate);

    printf("counter = %ld\\n", counter);
    return 0;
}
` },

    { t: 'p', html:
      '锁的经典事故是<b>死锁</b>：两个线程各自拿着一把锁，又都在等对方手里的那把，' +
      '于是永远卡住。最典型的形状是两个线程以<b>相反的顺序</b>获取相同的两把锁。' +
      '死锁的四个必要条件（互斥、占有并等待、不可抢占、循环等待）里，' +
      '最容易在代码里打破的是"循环等待"：<b>给所有锁定义全局固定顺序，只允许按顺序加锁</b>。'
    },

    { t: 'code', lang: 'c', caption: 'deadlock.c —— 两个线程以相反顺序加锁（错误示范）', code:
`#include <stdio.h>
#include <pthread.h>

static pthread_mutex_t a = PTHREAD_MUTEX_INITIALIZER;
static pthread_mutex_t b = PTHREAD_MUTEX_INITIALIZER;

static void *th1(void *arg) {
    (void)arg;
    pthread_mutex_lock(&a);
    pthread_mutex_lock(&b);            // 等 b：但 b 可能正被 th2 拿着
    printf("th1 拿到两把锁\\n");
    pthread_mutex_unlock(&b);
    pthread_mutex_unlock(&a);
    return NULL;
}

static void *th2(void *arg) {
    (void)arg;
    pthread_mutex_lock(&b);
    pthread_mutex_lock(&a);            // 反向顺序：死锁的经典形状
    printf("th2 拿到两把锁\\n");
    pthread_mutex_unlock(&a);
    pthread_mutex_unlock(&b);
    return NULL;
}

int main(void) {
    pthread_t t1, t2;
    pthread_create(&t1, NULL, th1, NULL);
    pthread_create(&t2, NULL, th2, NULL);

    pthread_join(t1, NULL);            // 可能永远卡在这里
    pthread_join(t2, NULL);
    printf("结束\\n");
    return 0;
}
` },

    { t: 'callout', kind: 'warn', html:
      '死锁最大的特点是<b>难复现</b>：两台机器、两次运行，可能一次卡死一次正常。' +
      '所以不能靠"跑一遍没问题"来证明安全。设计时就把"锁 → 锁"的获取关系画出来，' +
      '只要图里有环就有死锁风险。另外 <code>pthread_mutex_trylock</code> 可以"拿不到就返回"，' +
      '配合重试或超时能避免无限等待，但会让代码复杂很多，优先还是用固定顺序。'
    },

    { t: 'p', html:
      '最后是<b>原子操作</b>。对"单个变量的简单读改写"，C11 在 ' +
      '<code>&lt;stdatomic.h&gt;</code> 里提供了原子类型，不需要加锁就能保证不被中断。' +
      '它适合计数器、标志位这类小状态；但一旦要维护"多个变量之间的不变量"，还是老实加锁。'
    },

    { t: 'code', lang: 'c', caption: 'atomic.c —— 编译：gcc -std=c11 atomic.c', code:
`#include <stdio.h>
#include <stdatomic.h>

static atomic_long counter = 0;        // 原子变量：读-改-写不可分割

int main(void) {
    counter += 1;                      // 原子加法
    counter++;

    long v = atomic_load(&counter);
    printf("counter = %ld\\n", v);
    return 0;
}
` },

    { t: 'compare', left: {
      title: '靠运气验证（错）', html:
        '"我跑了二十遍都是对的""这次没崩，应该没问题"。' +
        '内存越界和竞态都是<b>概率性</b>的，没触发不等于不存在；' +
        '而且它们往往在换机器、加负载、上线之后才出现。'
    }, right: {
      title: '靠工具与规则验证（对）', html:
        '开发时开 ASan / UBSan 跑一遍，并发代码用 TSan 跑一遍；' +
        '共享数据全部走锁或原子变量；代码评审时专门检查"所有访问路径是否都加了同一把锁"。'
    } },

    { t: 'keypoint', items: [
      { title: '越界就是 UB', html:
        '写超过数组或缓冲区容量会破坏相邻内存；<code>strcpy</code> / <code>gets</code> / <code>sprintf</code> 要换成带边界的版本。' },
      { title: '未初始化不等于 0', html:
        '栈变量和 <code>malloc</code> 的内存都不初始化；先写再用，需要清零就 <code>calloc</code>。' },
      { title: '先用工具再谈经验', html:
        '<code>-fsanitize=address</code> 抓内存错误，<code>-fsanitize=undefined</code> 抓未定义行为，<code>-fsanitize=thread</code> 抓数据竞争。' },
      { title: '线程共享地址空间', html:
        '每个线程有自己的栈，但共享全局区和堆；<code>pthread_create</code> 的入口是 <code>void *(*)(void *)</code>，用 <code>join</code> 回收。' },
      { title: '竞态来自"非原子"', html:
        '<code>counter++</code> 是读-改-写三步；临界区加互斥锁，所有访问路径都要加同一把锁。' },
      { title: '死锁靠顺序预防', html:
        '多个锁要定义全局固定顺序；信号量用计数控制并发；单个变量的简单计数可用 C11 原子类型。' }
    ] },

    { t: 'checklist', id: 'ch09', items: [
      '我能解释缓冲区溢出为什么会破坏相邻变量甚至返回地址',
      '我能把 strcpy / sprintf / gets 换成带边界的写法',
      '我能说出 off-by-one 是怎么发生的，并写出正确的循环边界',
      '我能用 ASan 复现并定位一次越界或 use-after-free',
      '我能用 pthread_create / pthread_join 写一个双线程程序',
      '我能解释 counter++ 为什么会有竞态，并用互斥锁修复它',
      '我能说出死锁的典型形状和一种预防办法'
    ] }
  ]
});
