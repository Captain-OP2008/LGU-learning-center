/* =====================================================================
 * projects.js · CSC3150 实战项目
 * 结构：{ id, title, en, tagline, level, minutes, chapters, goals, intro,
 *         milestones:[{ n, title, tasks, starter, hints, solution }] }
 * 三个项目由易到难：用户态 shell → 线程安全队列 → xv6 新系统调用。
 * 前两个在普通 Linux + gcc 下即可完成，第三个需要 QEMU 跑 xv6-riscv。
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerProjects([

    /* ================================================================ P1 */
    {
      id: 'P1',
      title: 'Mini Shell：从 fork 到管道',
      en: 'MINI SHELL',
      tagline: '用 200 行 C 写出一个能跑 <code>ls | grep c</code> 的 shell，把 ch01 的四个系统调用用透。',
      level: '入门',
      minutes: 150,
      chapters: ['ch01'],
      goals: [
        '能写对 fork / exec / wait 的配对，说清每个返回值在父子两侧的含义',
        '能用 pipe + dup2 把两个进程连起来，并解释为什么要关闭不用的那一端',
        '能处理前台进程的退出码、Ctrl-C 信号与命令不存在这三类边界'
      ],
      intro: 'shell 是操作系统给用户的第一张脸，也是 fork/exec/wait 最好的练习题：它是一个循环，读一行、' +
        '创建子进程、让子进程 exec、父进程 wait。加上管道之后，你要开始考虑 fd 的复制与关闭顺序——' +
        '这是「文件描述符是进程的资源」这句话最具体的体现。做完这个项目，ch01 的系统调用不再是名词，' +
        '而是你亲手拼过的积木。',
      milestones: [
        {
          n: 1,
          title: '解析命令行并跑通单条命令',
          tasks: [
            '打印提示符，用 <code>getline</code> 读一整行，按空格切成 argv 数组（自己写切分，不要用 <code>strtok</code> 直接改原串，便于后续支持引号）。',
            '实现内建命令 <code>cd</code> 与 <code>exit</code>：前者调 <code>chdir</code>，后者直接退出循环，两者都<b>不能</b> fork。',
            '对其它命令 fork，子进程调 <code>execvp(argv[0], argv)</code>，失败时打印 <code>exec failed</code> 并用 <code>_exit(127)</code> 退出。',
            '父进程 <code>waitpid</code> 拿到退出状态，用 <code>WIFEXITED</code>/<code>WEXITSTATUS</code> 打印退出码。',
            '输入空行或只有空白时不要 fork，直接重新读。'
          ],
          starter: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

#define MAXARGS 32

int main(void) {
    char *line = NULL;
    size_t cap = 0;

    while (1) {
        printf("mish> ");
        fflush(stdout);
        if (getline(&line, &cap, stdin) < 0) break;   /* Ctrl-D */
        line[strcspn(line, "\\n")] = 0;               /* 去掉换行 */

        char *argv[MAXARGS];
        int argc = 0;
        char *p = strtok(line, " \\t");
        while (p && argc < MAXARGS - 1) {
            argv[argc++] = p;
            p = strtok(NULL, " \\t");
        }
        argv[argc] = NULL;
        if (argc == 0) continue;

        pid_t pid = fork();
        if (pid == 0) {
            execvp(argv[0], argv);
            perror("exec");
            _exit(127);
        } else if (pid > 0) {
            int st;
            waitpid(pid, &st, 0);
            if (WIFEXITED(st)) printf("[exit %d]\\n", WEXITSTATUS(st));
        } else {
            perror("fork");
        }
    }
    free(line);
    return 0;
}`,
          hints: [
            '<code>strtok</code> 会就地修改缓冲区，所以不能直接拿 <code>line</code> 当 argv[0] 的原始存储而不备份；本项目允许就地切分，但要意识到它不支持引号。',
            '子进程 exec 失败后必须用 <code>_exit</code> 而不是 <code>exit</code>，因为 <code>exit</code> 会 flush 父进程继承来的 stdio 缓冲区，导致输出重复。',
            '内建命令若不 fork，就省掉了一次进程创建；如果做了 fork，<code>cd</code> 只会改变子进程的目录，父进程（shell 自己）仍在原地——这是最常见的「cd 不生效」bug。'
          ],
          solution: `/* 关键点：三条返回值分支 + 内建命令不 fork */
if (is_builtin(argv[0])) { do_builtin(argc, argv); continue; }

pid_t pid = fork();
if (pid == 0) {
    execvp(argv[0], argv);
    perror(argv[0]);
    _exit(127);              /* 必须 _exit，避免重复 flush */
}
int st;
waitpid(pid, &st, 0);
printf("[exit %d]\\n", WIFEXITED(st) ? WEXITSTATUS(st) : -1);`
        },
        {
          n: 2,
          title: '加上管道与重定向',
          tasks: [
            '解析一个 <code>|</code>，把命令切成左右两段。用 <code>pipe(fd)</code> 创建管道，<code>fd[0]</code> 读、<code>fd[1]</code> 写。',
            '左子进程：<code>dup2(fd[1], STDOUT_FILENO)</code> 后执行左命令；右子进程：<code>dup2(fd[0], STDIN_FILENO)</code> 后执行右命令。',
            '<b>两侧都要关闭不用的那一端</b>：左关 fd[0]，右关 fd[1]，父进程两端的副本也都要关；少关一个就会让读端永远等不到 EOF。',
            '支持 <code>&gt;</code> 与 <code>&lt;</code>：用 <code>open</code> + <code>dup2</code> 把 fd 1 或 fd 0 换成文件。',
            '父进程用两次 waitpid 回收两个子进程，缺一个就留下僵尸。'
          ],
          starter: `/* 管道骨架：注意每一处 close */
int fd[2];
if (pipe(fd) < 0) { perror("pipe"); continue; }

pid_t left = fork();
if (left == 0) {
    close(fd[0]);                       /* 左不用读端 */
    dup2(fd[1], STDOUT_FILENO);
    close(fd[1]);                       /* dup2 之后原 fd 可关 */
    execvp(largv[0], largv);
    _exit(127);
}

pid_t right = fork();
if (right == 0) {
    close(fd[1]);                       /* 右不用写端 */
    dup2(fd[0], STDIN_FILENO);
    close(fd[0]);
    execvp(rargv[0], rargv);
    _exit(127);
}

close(fd[0]);
close(fd[1]);                           /* 父进程不参与传输 */
waitpid(left, NULL, 0);
waitpid(right, NULL, 0);`,
          hints: [
            '为什么父进程也要关掉两端？fd 是引用计数：只要还有任何一个进程持有写端，读端就收不到 EOF，<code>grep</code> 会一直挂着不退出。',
            '<code>dup2(old, new)</code> 会先关掉 new 再复制，所以 <code>dup2(fd[1], 1)</code> 之后标准输出就指向管道了，此后 <code>printf</code> 也进管道。',
            '重定向的打开顺序有讲究：<code>O_TRUNC</code> 要在 fork 之后、exec 之前打开，否则父进程会提前清空文件。',
            '如果命令写错导致阻塞，用 <code>ps</code> 看是否有残留进程持有管道写端，这是排查「卡住」的第一招。'
          ],
          solution: `/* 三个必须关闭的位置：左关读端、右关写端、父关两端 */
close(fd[0]); dup2(fd[1], 1); close(fd[1]);   /* 左 */
close(fd[1]); dup2(fd[0], 0); close(fd[0]);   /* 右 */
close(fd[0]); close(fd[1]);                    /* 父 */`
        },
        {
          n: 3,
          title: '信号、退出码与自检',
          tasks: [
            '在父进程里忽略 <code>SIGINT</code>，让 Ctrl-C 只杀掉前台子进程而不是 shell 自己；用 <code>signal(SIGINT, handler)</code> 或 <code>sigaction</code> 实现。',
            '子进程被信号杀死时，打印 <code>killed by signal N</code>（用 <code>WIFSIGNALED</code> + <code>WTERMSIG</code>）。',
            '命令不存在时退出码应为 127，权限不足为 126，写一个小脚本验证这两个值。',
            '写一个自检清单：<code>ls</code>、<code>ls | grep c</code>、<code>echo hi &gt; /tmp/x</code>、<code>cat &lt; /tmp/x</code>、<code>nosuchcmd</code>、Ctrl-C 六种情况全部符合预期。',
            '用 <code>valgrind --leak-check=full</code> 跑一遍，确认没有 fd 泄漏（<code>ls /proc/self/fd</code> 也可辅助）。'
          ],
          starter: `/* 让 shell 自己不被 Ctrl-C 打死 */
struct sigaction sa;
sa.sa_handler = SIG_IGN;
sigemptyset(&sa.sa_mask);
sa.sa_flags = 0;
sigaction(SIGINT, &sa, NULL);

/* 回收时区分正常退出与信号终止 */
int st;
waitpid(pid, &st, 0);
if (WIFEXITED(st))        printf("[exit %d]\\n", WEXITSTATUS(st));
else if (WIFSIGNALED(st))  printf("[killed by signal %d]\\n", WTERMSIG(st));`,
          hints: [
            '父进程忽略 SIGINT 后，子进程默认仍会收到（因为 fork 继承 disposition，忽略也会被继承）——若希望子进程可被 Ctrl-C 杀死，要在子进程里恢复默认处理。',
            '127 与 126 是 shell 的约定：127 表示命令不存在，126 表示找到了但不可执行。脚本里用 <code>echo $?</code> 检查。',
            'fd 泄漏在长跑时才会暴露：写一个循环执行 1000 次 <code>ls</code>，观察 <code>/proc/$$/fd</code> 数量是否增长。'
          ],
          solution: `/* 子进程里恢复默认，父进程忽略：前台可被 Ctrl-C，shell 不死 */
if (pid == 0) { signal(SIGINT, SIG_DFL); execvp(...); _exit(127); }
/* 父进程 */ signal(SIGINT, SIG_IGN);`
        }
      ]
    },

    /* ================================================================ P2 */
    {
      id: 'P2',
      title: '线程安全的有界队列',
      en: 'BOUNDED QUEUE',
      tagline: '用互斥锁与条件变量实现生产者—消费者队列，再用压力测试证明它真的没有丢数据。',
      level: '中等',
      minutes: 180,
      chapters: ['ch02', 'ch03'],
      goals: [
        '能写出满足「互斥 + 前进 + 有限等待」三个条件的临界区',
        '能用 while 重查条件避免虚假唤醒与丢失唤醒，并解释为什么不能用 if',
        '能用压测与 ThreadSanitizer 证明实现正确，而不是「跑了几次没出错」'
      ],
      intro: '生产者—消费者是并发编程的「Hello World」，也是最容易写错的地方：少一个循环就偶发丢数据，' +
        '少一次唤醒就永久卡死，锁的范围大一点吞吐就掉一半。这个项目要求你先写出能跑的版本，再用工具把它' +
        '逼到出错——ThreadSanitizer 与 helgrind 会告诉你哪里没锁好，而压力测试会告诉你哪里唤醒了却没人理。',
      milestones: [
        {
          n: 1,
          title: '单生产者—单消费者版本',
          tasks: [
            '写一个固定容量的环形队列 <code>queue_t</code>，含 <code>buf</code>、<code>cap</code>、<code>head</code>、<code>tail</code>、<code>count</code>、一把 <code>pthread_mutex_t</code>、两个条件变量 <code>not_full</code>/<code>not_empty</code>。',
            '实现 <code>q_push</code>：加锁；<code>while (count == cap) cond_wait(&amp;not_full, &amp;mtx)</code>；写入并 <code>count++</code>；<code>signal(not_empty)</code>；解锁。',
            '实现 <code>q_pop</code>：加锁；<code>while (count == 0) cond_wait(&amp;not_empty, &amp;mtx)</code>；取出并 <code>count--</code>；<code>signal(not_full)</code>；解锁。',
            '生产者放 1..N，消费者累加求和，验证总和等于 <code>N*(N+1)/2</code>。用 N = 1000000 跑。',
            '把两处 <code>while</code> 改成 <code>if</code>，观察是否出现丢失或死锁，记下现象——这是本里程碑最重要的实验。'
          ],
          starter: `#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *buf;
    int cap, head, tail, count;
    pthread_mutex_t mtx;
    pthread_cond_t not_full, not_empty;
} queue_t;

void q_init(queue_t *q, int cap) {
    q->buf = malloc(sizeof(int) * cap);
    q->cap = cap; q->head = q->tail = q->count = 0;
    pthread_mutex_init(&q->mtx, NULL);
    pthread_cond_init(&q->not_full, NULL);
    pthread_cond_init(&q->not_empty, NULL);
}

void q_push(queue_t *q, int v) {
    pthread_mutex_lock(&q->mtx);
    while (q->count == q->cap)                 /* 必须是 while */
        pthread_cond_wait(&q->not_full, &q->mtx);
    q->buf[q->tail] = v;
    q->tail = (q->tail + 1) % q->cap;
    q->count++;
    pthread_cond_signal(&q->not_empty);
    pthread_mutex_unlock(&q->mtx);
}

int q_pop(queue_t *q) {
    pthread_mutex_lock(&q->mtx);
    while (q->count == 0)                      /* 必须是 while */
        pthread_cond_wait(&q->not_empty, &q->mtx);
    int v = q->buf[q->head];
    q->head = (q->head + 1) % q->cap;
    q->count--;
    pthread_cond_signal(&q->not_full);
    pthread_mutex_unlock(&q->mtx);
    return v;
}`,
          hints: [
            '<code>pthread_cond_wait</code> 会原子地放锁并睡眠，醒来时重新加锁——所以它必须在 while 里，醒来第一件事是重查条件。',
            '条件变量必须配一把互斥锁使用，且「改条件」与「发信号」要在同一把锁的保护下，否则会出现「刚判断完条件为假、还没睡下去就被唤醒」的窗口。',
            '用 <code>signal</code> 还是 <code>broadcast</code>？只有一个等待者会被满足时用 signal 更高效；但若有「两种原因都能被满足」的情况（比如同时等容量与等元素），broadcast 更安全。',
            '环形队列的下标取模别写成 <code>head++ % cap</code>，要对整个表达式取模。'
          ],
          solution: `/* 正确性的三个支点：一把锁、两个 while、两处 signal */
while (q->count == q->cap) pthread_cond_wait(&q->not_full, &q->mtx);
/* ... 临界区内读写共享字段 ... */
pthread_cond_signal(&q->not_empty);
pthread_mutex_unlock(&q->mtx);`
        },
        {
          n: 2,
          title: '多生产者多消费者与优雅关闭',
          tasks: [
            '启动 P 个生产者线程与 C 个消费者线程（P、C 由命令行给出），队列容量取 8，压测 100 万个元素。',
            '加一个 <code>closed</code> 标志与 <code>q_close()</code>：关闭后 push 返回 -1，pop 在队列空时返回 -1 而不是永远等待。',
            '<code>q_close</code> 要 <code>broadcast</code> 两个条件变量，把所有等待者唤醒，让它们各自判断退出条件。',
            '用 <code>pthread_barrier_t</code> 让所有线程同时起跑，避免「第一个线程跑完了别的还没开始」的假并发。',
            '统计每个消费者的处理条数，确认总数恰好等于生产者写入数（多一条少一条都是 bug）。'
          ],
          starter: `/* 关闭：先置标志，再唤醒所有人 */
void q_close(queue_t *q) {
    pthread_mutex_lock(&q->mtx);
    q->closed = 1;
    pthread_cond_broadcast(&q->not_full);
    pthread_cond_broadcast(&q->not_empty);
    pthread_mutex_unlock(&q->mtx);
}

/* pop 的退出路径：空且已关闭 -> 返回 -1 */
while (q->count == 0 && !q->closed)
    pthread_cond_wait(&q->not_empty, &q->mtx);
if (q->count == 0) { pthread_mutex_unlock(&q->mtx); return -1; }`,
          hints: [
            '关闭顺序会决定是否丢数据：先 <code>closed = 1</code> 再 broadcast，消费者醒来后先看队列是否还有残余元素，取完才退出。',
            '线程数与队列容量要搭配：容量太小会让生产者频繁阻塞、测不出并发 bug；太大则缓冲区几乎不空，条件变量很少生效。容量 8 是个好起点。',
            '把总数校验放在 <code>join</code> 之后，用全局计数器；计数器本身也要么用原子变量，要么在锁内更新。',
            '用 <code>time ./a.out 4 4 1000000</code> 比较不同 P/C 组合的吞吐，观察锁竞争随核数增加的变化。'
          ],
          solution: `/* 消费循环的终止条件：队列空 && closed */
for (;;) {
    int v = q_pop(q);
    if (v < 0) break;          /* 已关闭且取空 */
    sum += v;
}`
        },
        {
          n: 3,
          title: '用工具证明正确性',
          tasks: [
            '用 <code>gcc -fsanitize=thread -g</code> 编译，跑 <code>4 4 100000</code>，确认 TSan 不报 data race。',
            '故意删掉一处解锁、或把 <code>while</code> 改回 <code>if</code>，看 TSan 或死锁是否暴露问题，记录现象。',
            '用 <code>valgrind --tool=helgrind</code> 再跑一遍小规模（<code>2 2 1000</code>），比较两类工具的报警差异。',
            '用 <code>perf stat -e context-switches</code> 观察容量 1 与容量 1024 时上下文切换次数的差别，解释原因。',
            '写一份 200 字的结论：你的实现为什么正确，哪些地方最容易错，工具帮你抓到了什么。'
          ],
          starter: `# gcc 编译并开启 ThreadSanitizer
gcc -std=c11 -g -fsanitize=thread -pthread queue.c -o queue_tsan
./queue_tsan 4 4 100000

# 观察上下文切换随容量的变化
perf stat -e context-switches ./queue_tsan 4 4 1000000`,
          hints: [
            'TSan 只看「有没有同时访问且至少一个写」；它不会告诉你逻辑错误（比如丢了一条数据），所以总和校验仍然必要。',
            'helgrind 更慢但对锁顺序问题更敏感，适合小规模验证；TSan 更快，适合大规模压测。',
            '容量为 1 时生产与消费几乎完全串行，上下文切换暴增；容量变大后批量化，切换变少但延迟变大。这就是「缓冲」的经典权衡。',
            '如果 TSan 报的是标准库内部，先确认你是不是在没有锁的情况下读了 <code>count</code>——这是最常见的漏网。'
          ],
          solution: `/* 结论模板：正确性 = 互斥（一把锁）+ 前进（signal 配对）+ 有限等待（while 重查） */
/* 工具分工：TSan 抓数据竞争，helgrind 抓锁顺序，总和校验抓逻辑错误 */`
        }
      ]
    },

    /* ================================================================ P3 */
    {
      id: 'P3',
      title: '给 xv6 加一个系统调用',
      en: 'XV6 SYSCALL',
      tagline: '从用户库到内核分派表，端到端加一个 <code>getvmstats</code>，让进程能读到自己的页表统计。',
      level: '进阶',
      minutes: 240,
      chapters: ['ch04', 'ch07'],
      goals: [
        '能把「用户态调用 → 陷阱 → 分派表 → 内核实现 → 返回」这条链完整改一遍',
        '能用 <code>copyout</code> 把内核数据安全地交给用户，理解为什么不能直接解引用用户指针',
        '能在 QEMU 里用 gdb 单步验证新系统调用，并写出可复现的测试脚本'
      ],
      intro: '这是最接近真实 OS 作业的项目：你要同时修改用户库、内核分派表、内核实现与 Makefile，任何一处漏改' +
        '都会表现为「返回 -1」或「panic」。做完之后，ch07 那张「系统调用五步」的表就不再是背诵材料，' +
        '而是你亲手接过的线。建议先跑通最简版本（返回常量），再逐步加功能。',
      milestones: [
        {
          n: 1,
          title: '端到端打通一个空系统调用',
          tasks: [
            '在 <code>kernel/syscall.h</code> 里加 <code>#define SYS_getvmstats 22</code>（取当前最大编号 +1）。',
            '在 <code>kernel/syscall.c</code> 的 <code>syscalls[]</code> 表里登记 <code>[SYS_getvmstats] sys_getvmstats</code>，并加 <code>extern uint64 sys_getvmstats(void);</code> 声明。',
            '在 <code>kernel/sysproc.c</code> 里实现它，先只做 <code>return 42;</code>，验证链路通。',
            '在 <code>user/user.h</code> 声明 <code>int getvmstats(void);</code>，在 <code>user/usys.pl</code> 加 <code>entry("getvmstats");</code>，让用户库生成对应的汇编桩。',
            '写 <code>user/stats.c</code> 调用它并打印返回值，把 <code>$U/_stats</code> 加进 Makefile 的 UPROGS，<code>make qemu</code> 里运行 <code>stats</code>，应看到 42。'
          ],
          starter: `// kernel/sysproc.c
#include "types.h"
#include "riscv.h"
#include "defs.h"
#include "param.h"
#include "memlayout.h"
#include "spinlock.h"
#include "proc.h"

uint64
sys_getvmstats(void)
{
  return 42;                 /* 先验证链路，再填内容 */
}

// user/usys.pl 里加一行
// entry("getvmstats");

// user/user.h 里加声明
// int getvmstats(void);`,
          hints: [
            '编号必须与 <code>syscalls[]</code> 的下标一致，且不能与已有编号冲突；最大编号在 <code>syscall.h</code> 末尾，加一即可。',
            '忘记在 <code>syscall.c</code> 加 extern 声明会得到隐式声明警告，返回值被截断成 int，表现为「返回值不对」而不是编译失败。',
            '<code>usys.pl</code> 生成的是汇编桩：把系统调用号放进 a7，执行 <code>ecall</code>，返回后把 a0 当返回值。漏掉这一步，用户程序根本调不到内核。',
            'UPROGS 里加错格式（少一个反斜杠续行）会让 make 直接失败，先看 Makefile 里相邻行的写法照抄。'
          ],
          solution: `uint64
sys_getvmstats(void)
{
  return 42;
}
/* 验证：make qemu 后运行 stats，输出 42 即链路打通 */`
        },
        {
          n: 2,
          title: '统计页表并 copyout 给用户',
          tasks: [
            '定义结构 <code>struct vmstats { uint64 pgtbl_pages; uint64 mapped_pages; uint64 sz; };</code>，放在一个用户与内核都能 include 的头文件里（或复制定义，注意保持一致）。',
            '在 <code>sys_getvmstats</code> 里用 <code>argaddr(0, &amp;addr)</code> 取用户缓冲区地址，用 <code>myproc()-&gt;pagetable</code> 与 <code>walk</code> 遍历有效映射，统计已映射页数。',
            '用 <code>copyout(p-&gt;pagetable, addr, (char *)&amp;st, sizeof(st))</code> 把结构写回用户空间；失败返回 -1。',
            '故意传一个非法地址（如 <code>(void *)0xdeadbeef</code>）测试：应返回 -1 而不是让内核 panic。',
            '在用户程序里打印三个字段，并与 <code>sbrk</code> 前后的变化对照，确认统计合理。'
          ],
          starter: `uint64
sys_getvmstats(void)
{
  uint64 addr;
  if(argaddr(0, &addr) < 0)
    return -1;

  struct proc *p = myproc();
  struct vmstats st;
  st.pgtbl_pages = 1;          /* 根页表本身占一页 */
  st.mapped_pages = 0;
  st.sz = p->sz;

  for(uint64 va = 0; va < p->sz; va += PGSIZE){
    pte_t *pte = walk(p->pagetable, va, 0);   /* 0 = 不分配 */
    if(pte && (*pte & PTE_V))
      st.mapped_pages++;
  }

  if(copyout(p->pagetable, addr, (char *)&st, sizeof(st)) < 0)
    return -1;
  return 0;
}`,
          hints: [
            '<code>walk</code> 的第三个参数是「不存在时是否分配」，统计时必须传 0，否则会把页表撑大，测出来的数字自己就变了。',
            '直接 <code>*(struct vmstats *)addr = st</code> 是典型错误：用户地址可能未映射或属于别的进程，必须走 copyout。',
            '统计要跨过 <code>p->sz</code> 里未映射的空洞（比如 guard page），所以逐页 walk 并检查 PTE_V，而不是简单除 PGSIZE。',
            '把结构体在用户与内核各定义一份时，字段顺序与对齐必须完全一致，否则 copyout 出来的值会错位。'
          ],
          solution: `/* 三件事：argaddr 取址 -> walk 统计 -> copyout 回写 */
if(argaddr(0, &addr) < 0) return -1;
pte_t *pte = walk(p->pagetable, va, 0);
if(pte && (*pte & PTE_V)) st.mapped_pages++;
if(copyout(p->pagetable, addr, (char *)&st, sizeof(st)) < 0) return -1;`
        },
        {
          n: 3,
          title: '调试、压测与文档',
          tasks: [
            '用 <code>make qemu-gdb</code> 与另一个终端的 <code>gdb-multiarch</code> 连上，在 <code>sys_getvmstats</code> 下断点，单步看 <code>argaddr</code> 如何从 trapframe 取参。',
            '写一个循环分配内存再查询的程序，验证 <code>mapped_pages</code> 随 <code>sbrk</code> 增长而增长；释放后（<code>sbrk(-n)</code>）应回落到原值。',
            '故意在内核里加 <code>printf</code> 打印 <code>p->sz</code> 与页数，确认与用户侧一致；注意 xv6 的 printf 没有浮点。',
            '把测试脚本写成 <code>stats_test.sh</code>：编译、启动 QEMU、跑测试、抓输出、与期望值比对，退出码非 0 即失败。',
            '写一份 300 字说明：改了哪五个文件、每个文件的作用、最容易漏的一步是什么、如何用 gdb 验证。'
          ],
          starter: `# 两个终端
# 终端 A
make qemu-gdb
# 终端 B
gdb-multiarch kernel/kernel
(gdb) target remote :26000
(gdb) b sys_getvmstats
(gdb) c
(gdb) info registers a0
(gdb) p *(struct trapframe *)myproc()->trapframe`,
          hints: [
            '断点打在 <code>sys_getvmstats</code> 上若不停，先确认 <code>syscalls[]</code> 的编号没写错——分派不到自然不会进来。',
            '<code>sbrk(-n)</code> 只减少 <code>p->sz</code> 并释放页，不保证立刻回收所有物理页，统计时以 PTE_V 为准而不是以 sz 为准。',
            '脚本里等 QEMU 启动要轮询输出里的提示符，不要 <code>sleep</code> 固定秒数，否则在不同机器上会偶发失败。',
            'xv6 没有 <code>errno</code>，失败统一返回 -1；用户侧要自己约定含义，别指望内核传回错误码。'
          ],
          solution: `/* 五个文件：syscall.h（编号）、syscall.c（分派+声明）、sysproc.c（实现）、
   user/user.h（声明）、user/usys.pl（桩），外加 Makefile 的 UPROGS */
/* 最容易漏：usys.pl 的 entry，漏了就是链接期或运行期找不到符号 */`
        }
      ]
    }
  ]);
})();
