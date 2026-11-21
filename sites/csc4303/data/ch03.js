/* =====================================================================
 * ch03.js · 第 3 章「Socket 编程：从 echo 到并发服务器」
 * 职责：把 ch02 的 TCP 状态机落成可运行的系统调用序列，讲清并发、
 *       消息边界、I/O 多路复用与排错方法，最后给一个完整 echo 服务器。
 * 依据：CSC4303_06_socket.pdf（socket API、并发服务器、I/O 多路复用）
 *       与 Stevens《Unix Network Programming, Vol.1》第 4–6 章、第 14 章。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch03',
  num: '03',
  title: 'Socket 编程：从 echo 到并发服务器',
  en: 'SOCKET PROGRAMMING',
  goals: [
    '不看资料写出 TCP 服务器与客户端的完整调用序列，并说清 bind、listen、accept 各自把五元组里的哪一部分确定下来',
    '用 fork 或 pthread 把单连接 echo 服务器改成并发服务器，并处理僵尸进程、fd 继承与临界区',
    '给定一段收发代码，判断它会不会粘包或短写，并用长度前缀写出 send_all 与 read_all',
    '写出 UDP 回显程序，并解释它为什么不需要 listen，为什么一个 socket 能同时服务多个客户端',
    '在 select、poll、epoll 之间做出选择，说清 LT 与 ET 的差别，并用 strace、ss、tcpdump 定位一个真实故障'
  ],
  kp: [
    { id: 'ch03-1', title: 'Socket 是什么' },
    { id: 'ch03-2', title: 'TCP 客户端与服务器的调用序列' },
    { id: 'ch03-3', title: '阻塞、并发与 fork/thread' },
    { id: 'ch03-4', title: '字节序、粘包与消息边界' },
    { id: 'ch03-5', title: 'UDP socket' },
    { id: 'ch03-6', title: 'I/O 多路复用：select、poll、epoll' },
    { id: 'ch03-7', title: '常见错误与调试' },
    { id: 'ch03-8', title: '一个可运行的 echo 服务器' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么「能跑住」的服务器比「能跑通」的难', html: '写出一个能收发字符串的程序不难，写出一个能跑住的服务器很难。课上背过三次握手，动手时却会遇到一串没头没脑的现象：<code>bind</code> 报 <code>Address already in use</code>，程序重启不了；客户端发两条消息，服务器一次全读到了；服务跑一晚上，<code>ss</code> 里堆着两千个 <code>CLOSE_WAIT</code>；压测到三千连接，进程的 fd 用完了。这些都不是协议没学懂，而是<b>系统调用的语义没吃透</b>。这一章把协议变成代码：先写通三十行的 echo，再补上并发、消息边界与 I/O 多路复用，最后交给你一个能编译、能压测、能排错的服务器。' },

    { t: 'p', lead: true, html: '上一章讲 TCP 怎样用序号、确认与窗口把不可靠的 IP 变成可靠字节流；这一章讲<b>应用怎样把这条字节流接进自己的进程</b>。答案只有一组系统调用：<code>socket</code>、<code>bind</code>、<code>listen</code>、<code>accept</code>、<code>connect</code>、<code>read</code>/<code>write</code>、<code>close</code>。它们每一个都有明确的失败模式，参数顺序也不能记错——写反了不会报错，只会让服务器在某个深夜悄悄卡死。全章用 C 写例子（Linux 上 <code>gcc</code> 直接编译），因为讲义与作业都用 C，而且 C 把「哪个调用返回了哪个 fd」暴露得最清楚；换成 Python 只是把返回值包了一层，语义一模一样。' },

    { t: 'h', lvl: 2, text: '一、Socket 是什么', id: 'ch03-1' },

    { t: 'p', html: '先破除一个误解：<code>socket</code> 不是一个「连接」，而是一个<b>端点（endpoint）</b>。一条 TCP 连接有两个人，每人手里有一个 socket；连接由<b>五元组（five-tuple）</b>唯一确定：协议、源 IP、源端口、目的 IP、目的端口。服务器只监听一个 9000 端口，却可以同时服务一万个客户端，因为每条连接的源 IP 与源端口不同——五元组不同，就是不同的连接。这也解释了一个常见困惑：为什么 <code>accept</code> 每次返回一个新的 fd？因为新 fd 代表的是「这一条具体的连接」，而不是「9000 这个端口」。' },

    { t: 'p', html: '在 Linux 里 socket 就是一个<b>文件描述符（file descriptor，fd）</b>：一个小的非负整数，指向内核里的一个打开文件对象。所以 <code>read</code>/<code>write</code>/<code>close</code> 对 socket 与普通文件用法一样，<code>select</code>/<code>epoll</code> 能把 socket、管道、终端混在一起等。差别在语义：普通文件读到末尾返回 0 且永远如此，socket 返回 0 表示<b>对端关闭了写方向</b>；普通文件不会因为「对方慢」而阻塞，socket 的 <code>write</code> 会在发送缓冲区满时睡过去。记住这一点，后面所有「卡住」的现象都能解释。' },

    { t: 'table', head: ['五元组字段', '谁决定', '什么时候确定'], rows: [
      ['协议（TCP/UDP）', '<code>socket()</code> 的第二个参数', '创建 fd 时确定，之后不能改'],
      ['源 IP', '<code>bind()</code>，或 connect 时由路由选择', '服务器 bind 到 0.0.0.0 时由内核按出口网卡填'],
      ['源端口', '<code>bind()</code> 显式指定，或 connect 时内核临时分配', '服务器写死 9000；客户端通常交给内核（ephemeral port）'],
      ['目的 IP、目的端口', '客户端 <code>connect()</code> 的参数', '服务器侧由 <code>accept()</code> 从 SYN 里取出']
    ], caption: '五元组是「一条连接」的身份证；同一个端口上的不同连接，靠源 IP 与源端口区分' },

    { t: 'h', lvl: 2, text: '二、TCP 客户端与服务器的调用序列', id: 'ch03-2' },

    { t: 'p', html: '两条序列必须背下来，但更要理解每一步在做什么。<b>服务器</b>：<code>socket</code> 造一个端点 → <code>bind</code> 把它钉在「本机地址 + 端口」→ <code>listen</code> 把它变成<b>被动打开</b>的监听 socket，内核开始替它收 SYN → <code>accept</code> 从已完成连接队列取出一条，返回<b>新 fd</b> → 在新 fd 上 <code>read</code>/<code>write</code> → <code>close</code>。<b>客户端</b>：<code>socket</code> → <code>connect</code>（内部完成三次握手，返回时连接已建立）→ <code>write</code>/<code>read</code> → <code>close</code>。客户端<b>不需要 bind</b>：内核在 connect 时挑一个临时端口填进五元组。两个细节常被跳过。<b>backlog 不是「最大连接数」</b>：它是「已完成三次握手、等待 accept 取走」的队列长度上限（Linux 上还受 <code>somaxconn</code> 约束），队列满了新来的 SYN 会被丢掉，客户端表现为偶发连接超时。<b>监听 fd 永远不读数据</b>：它只负责收连接，数据在新 fd 上。还有一点反直觉：客户端 <code>connect</code> 成功并不代表服务器调用了 <code>accept</code>，三次握手由内核完成，只要队列有空位就能成功；所以「连上了却没反应」通常是应用层没 accept 或 accept 后没读，而不是网络坏了。' },

    { t: 'code', lang: 'c', caption: 'echo_server_tcp.c —— 最简 TCP 回显服务器：一次只服务一个连接，够验证协议，不够上线', code: `/* echo_server_tcp.c —— 一次只服务一个连接的最简 TCP 服务器
 * 编译：gcc -O2 -Wall -o echo_server echo_server_tcp.c
 * 运行：./echo_server        （监听 9000）
 */
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

int main(void) {
    int listen_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (listen_fd < 0) { perror("socket"); return 1; }

    int on = 1;                       /* 允许在 TIME_WAIT 期间重新 bind */
    setsockopt(listen_fd, SOL_SOCKET, SO_REUSEADDR, &on, sizeof on);

    struct sockaddr_in addr;
    memset(&addr, 0, sizeof addr);
    addr.sin_family      = AF_INET;
    addr.sin_addr.s_addr = htonl(INADDR_ANY);   /* 本机所有网卡 */
    addr.sin_port        = htons(9000);         /* 端口必须转网络序 */
    if (bind(listen_fd, (struct sockaddr *)&addr, sizeof addr) < 0) {
        perror("bind");
        return 1;
    }
    if (listen(listen_fd, 128) < 0) { perror("listen"); return 1; }

    for (;;) {
        struct sockaddr_in peer;
        socklen_t plen = sizeof peer;
        int conn_fd = accept(listen_fd, (struct sockaddr *)&peer, &plen);
        if (conn_fd < 0) { perror("accept"); continue; }

        char ip[INET_ADDRSTRLEN];
        inet_ntop(AF_INET, &peer.sin_addr, ip, sizeof ip);
        printf("connect from %s:%d\\n", ip, ntohs(peer.sin_port));

        char buf[4096];
        ssize_t n;
        while ((n = read(conn_fd, buf, sizeof buf)) > 0)
            if (write(conn_fd, buf, (size_t)n) != n) break;

        close(conn_fd);               /* 不关就是这个连接的 fd 泄漏 */
    }
}` },

    { t: 'code', lang: 'c', caption: 'echo_client_tcp.c —— 对应的客户端：读标准输入的一行发出去，再把回显打印出来', code: `/* echo_client_tcp.c —— 连接服务器，逐行发送并打印回显
 * 编译：gcc -O2 -Wall -o echo_client echo_client_tcp.c
 * 运行：./echo_client 127.0.0.1 9000
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

int main(int argc, char **argv) {
    const char *host = argc > 1 ? argv[1] : "127.0.0.1";
    int port = argc > 2 ? atoi(argv[2]) : 9000;

    int fd = socket(AF_INET, SOCK_STREAM, 0);
    if (fd < 0) { perror("socket"); return 1; }

    struct sockaddr_in addr;
    memset(&addr, 0, sizeof addr);
    addr.sin_family = AF_INET;
    addr.sin_port   = htons((unsigned short)port);
    if (inet_pton(AF_INET, host, &addr.sin_addr) != 1) {
        fprintf(stderr, "bad address: %s\\n", host);
        return 1;
    }
    if (connect(fd, (struct sockaddr *)&addr, sizeof addr) < 0) {
        perror("connect");            /* 常见：ECONNREFUSED，端口没人监听 */
        return 1;
    }

    char line[1024], buf[1024];
    while (fgets(line, sizeof line, stdin)) {
        size_t len = strlen(line);
        if (write(fd, line, len) != (ssize_t)len) { perror("write"); break; }
        ssize_t n = read(fd, buf, sizeof buf);   /* 小报文一次通常读得完 */
        if (n <= 0) break;
        fwrite(buf, 1, (size_t)n, stdout);
    }
    close(fd);
    return 0;
}` },

    { t: 'table', head: ['调用', '服务器侧的作用', '典型失败与 errno'], rows: [
      ['<code>socket</code>', '创建端点，返回 fd', '<code>EMFILE</code>：进程的 fd 用完了'],
      ['<code>bind</code>', '绑定本地地址与端口', '<code>EADDRINUSE</code>：端口被占，或旧连接留在 TIME_WAIT'],
      ['<code>listen</code>', '转为被动打开，设置 backlog', '<code>EADDRINUSE</code>：同一端口已有监听 socket'],
      ['<code>accept</code>', '取出已完成连接，返回新 fd', '<code>EINTR</code>：被信号打断；<code>EMFILE</code>：fd 耗尽'],
      ['<code>connect</code>', '发起三次握手', '<code>ECONNREFUSED</code>：端口没人监听；<code>ETIMEDOUT</code>：被防火墙丢包']
    ], caption: '五个调用的失败模式；<code>perror</code> 打印出来的第一个词，就是这张表里的 errno' },

    { t: 'h', lvl: 2, text: '三、阻塞、并发与 fork/thread', id: 'ch03-3' },

    { t: 'p', html: '默认所有 socket 都是<b>阻塞（blocking）</b>的：<code>accept</code> 没有新连接时让进程睡眠，<code>read</code> 没有数据时睡眠，<code>write</code> 在发送缓冲区满时睡眠。单线程的最简服务器因此有一个致命问题：<b>只要一个客户端连上却不发数据，整个进程就卡在 <code>read</code> 上</b>，第二个客户端连 SYN 都处理不了。并发模型就是用来消灭这个阻塞点的。最古老的做法是 <code>fork</code>：父进程只负责 <code>accept</code>，每来一个连接就克隆一个子进程，子进程在自己的地址空间里阻塞，互不影响。' },

    { t: 'code', lang: 'c', caption: 'echo_server_fork.c —— 每连接一进程：父进程 accept 后 fork，子进程处理完就退出，父进程回收', code: `/* echo_server_fork.c —— 每来一个连接 fork 一个子进程
 * 编译：gcc -O2 -Wall -o echo_server_fork echo_server_fork.c
 */
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <errno.h>
#include <signal.h>
#include <arpa/inet.h>
#include <sys/wait.h>
#include <sys/socket.h>

static void on_sigchld(int sig) {
    (void)sig;
    while (waitpid(-1, NULL, WNOHANG) > 0)   /* 一次信号可能对应多个子进程 */
        ;
}

int main(void) {
    signal(SIGCHLD, on_sigchld);             /* 不回收就会攒出僵尸进程 */

    int lfd = socket(AF_INET, SOCK_STREAM, 0);
    if (lfd < 0) { perror("socket"); return 1; }
    int on = 1;
    setsockopt(lfd, SOL_SOCKET, SO_REUSEADDR, &on, sizeof on);

    struct sockaddr_in addr;
    memset(&addr, 0, sizeof addr);
    addr.sin_family      = AF_INET;
    addr.sin_addr.s_addr = htonl(INADDR_ANY);
    addr.sin_port        = htons(9000);
    if (bind(lfd, (struct sockaddr *)&addr, sizeof addr) < 0) { perror("bind"); return 1; }
    if (listen(lfd, 128) < 0) { perror("listen"); return 1; }

    for (;;) {
        int cfd = accept(lfd, NULL, NULL);
        if (cfd < 0) {
            if (errno == EINTR) continue;     /* 被信号打断，重试 */
            perror("accept");
            break;
        }

        pid_t pid = fork();
        if (pid < 0) { perror("fork"); close(cfd); continue; }

        if (pid == 0) {                       /* 子进程：只处理这一条连接 */
            close(lfd);                       /* 子进程不要留着监听 fd */
            char buf[4096];
            ssize_t n;
            while ((n = read(cfd, buf, sizeof buf)) > 0)
                if (write(cfd, buf, (size_t)n) != n) break;
            close(cfd);
            _exit(0);                         /* 用 _exit，别刷新父进程的 stdio 缓冲 */
        }

        close(cfd);                           /* 父进程必须关掉自己的副本 */
    }
    close(lfd);
    return 0;
}` },

    { t: 'compare', left: { title: '进程模型（fork）', html: '每条连接一个独立地址空间：一条连接崩了不会带走别人，共享变量天然不冲突，不用加锁。代价是 fork 要复制页表、切换要换地址空间；一万连接就是一万个进程，内存与调度都吃不消。fd 会被子进程继承，所以子进程必须关掉监听 fd、父进程必须关掉连接 fd，漏一个就是 fd 泄漏，连接也永远关不掉。' }, right: { title: '线程模型（pthread）', html: '同一进程内的多个执行流共享地址空间：创建比 fork 便宜一个数量级，共享缓存与统计量很方便。代价是共享即风险——两个线程同时 <code>count++</code> 就会丢更新，必须加锁或原子操作；一个线程段错误会带走整个进程。没有僵尸进程，但线程栈默认 8 MB 虚拟内存，一万线程同样不现实。' } },

    { t: 'p', html: 'fork 之后有两件事必须做，否则程序会在几小时后崩。<b>第一，子进程退出会变成僵尸（zombie）</b>：它已经死了，父进程还没 <code>wait</code>，内核保留退出状态，进程表项不释放。短连接服务器每秒几十个连接，一天几百万个僵尸，最后 <code>fork</code> 返回 <code>EAGAIN</code>。修法是装 <code>SIGCHLD</code> 处理函数，在里面循环 <code>waitpid(-1, NULL, WNOHANG)</code> 直到返回 0——必须循环，一次信号可能对应多个子进程退出。<b>第二，fd 是继承的</b>：子进程不关监听 fd，连接就永远不真正关闭（引用计数不为 0），客户端看到的是「服务器不回应也不断开」。线程模型没有僵尸问题，但要自己管锁。规模再大就上<b>预 fork（prefork）</b>或<b>线程池（thread pool）</b>：启动时先造 N 个工作者，由它们抢 <code>accept</code>，省掉每连接一次创建成本。' },

    { t: 'h', lvl: 2, text: '四、字节序、粘包与消息边界', id: 'ch03-4' },

    { t: 'p', html: '有两个坑，几乎每个初学者都会踩一次。<b>第一个是字节序（byte order）</b>：x86 是小端（little-endian），网络协议规定用大端（big-endian），所以任何<b>多字节整数</b>进出网络都要转换。端口用 <code>htons</code>（host to network short，16 位），地址与长度字段用 <code>htonl</code>（32 位），收方向用 <code>ntohs</code>/<code>ntohl</code>。只发一个字节的字符不用转。地址别再用 <code>inet_addr</code>，它无法表示 255.255.255.255 也不支持 IPv6；用 <code>inet_pton</code>/<code>inet_ntop</code>。' },

    { t: 'table', head: ['函数', '方向与宽度', '用在哪'], rows: [
      ['<code>htons</code>', '主机 → 网络，16 位', '<code>sin_port</code>'],
      ['<code>htonl</code>', '主机 → 网络，32 位', '<code>sin_addr.s_addr</code>、长度前缀、magic number'],
      ['<code>ntohs</code>、<code>ntohl</code>', '网络 → 主机', '解析对端端口、解析消息长度'],
      ['<code>inet_pton</code>', '点分十进制字符串 → 二进制地址', '客户端把 127.0.0.1 填进 <code>sockaddr_in</code>'],
      ['<code>inet_ntop</code>', '二进制地址 → 字符串', '日志里打印对端 IP']
    ], caption: '记忆法：s 是 short 即 16 位（端口），l 是 long 即 32 位（地址、长度），n 永远代表 network' },

    { t: 'p', html: '<b>第二个是消息边界（message boundary）</b>。TCP 只承诺「字节按序到达」，不承诺「你写几次，对方就读几次」。发送方两次 <code>write</code> 各 100 字节，可能被合并成一个 200 字节的段；一次 5000 字节的 <code>write</code>，也可能被拆成 1460 + 1460 + 2080 三次到达。这不是 bug，是 Nagle 算法、MSS 与接收缓冲区共同作用的结果，统称<b>粘包/拆包</b>。所以 <code>read</code> 的返回值<b>只能是「这次读到多少」，不是「一条消息有多长」</b>。三种解法：<b>长度前缀</b>（先发 4 字节长度再发正文，最通用，推荐）、<b>定长</b>（每条固定 N 字节，简单但浪费）、<b>分隔符</b>（如 <code>\\r\\n</code>，适合文本，正文里出现分隔符就要转义）。前两种必须配「循环读写」，因为 <code>read</code> 与 <code>write</code> 都可能只完成一部分。' },

    { t: 'code', lang: 'c', caption: 'framing.c —— 长度前缀的两个原语：send_all 处理短写，read_all 处理半包，长度用 htonl 转网络序', code: `/* framing.c —— 长度前缀：先发 4 字节大端长度，再发正文
 * 依赖 Linux/POSIX；MSG_NOSIGNAL 可避免对端先关时收到 SIGPIPE
 */
#include <stdint.h>
#include <errno.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

/* 短写要循环：write 可能只写进去一部分 */
static int send_all(int fd, const void *buf, size_t len) {
    const char *p = buf;
    while (len > 0) {
        ssize_t n = send(fd, p, len, MSG_NOSIGNAL);
        if (n < 0) { if (errno == EINTR) continue; return -1; }
        if (n == 0) return -1;            /* 正常不会发生，防死循环 */
        p += n;
        len -= (size_t)n;
    }
    return 0;
}

/* 半包要循环：只有读满 len 字节才算收到一条完整消息 */
static int read_all(int fd, void *buf, size_t len) {
    char *p = buf;
    while (len > 0) {
        ssize_t n = read(fd, p, len);
        if (n < 0) { if (errno == EINTR) continue; return -1; }
        if (n == 0) return -1;            /* 对端关闭，消息不完整 */
        p += n;
        len -= (size_t)n;
    }
    return 0;
}

int send_msg(int fd, const void *body, uint32_t len) {
    uint32_t be = htonl(len);             /* 长度本身也要统一字节序 */
    if (send_all(fd, &be, sizeof be) < 0) return -1;
    return send_all(fd, body, len);
}

int recv_msg(int fd, void *body, size_t cap, uint32_t *out_len) {
    uint32_t be, len;
    if (read_all(fd, &be, sizeof be) < 0) return -1;
    len = ntohl(be);
    if (len > cap) return -1;             /* 防御：别让对端撑爆缓冲区 */
    if (read_all(fd, body, len) < 0) return -1;
    *out_len = len;
    return 0;
}` },

    { t: 'h', lvl: 2, text: '五、UDP socket', id: 'ch03-5' },

    { t: 'p', html: 'UDP 的编程模型短得多：<code>socket(AF_INET, SOCK_DGRAM, 0)</code> → <code>bind</code>（服务器）→ <code>recvfrom</code> / <code>sendto</code> → <code>close</code>。没有 <code>listen</code>，没有 <code>accept</code>，没有连接。关键差别是<b>数据报（datagram）保留边界</b>：发一次 <code>sendto</code>，对方就 <code>recvfrom</code> 到一次，长度与发送时一致；不存在粘包，但也拿不到字节流的方便——丢包、乱序、重复都要自己处理。<code>recvfrom</code> 的后两个参数是输出参数：内核把<b>发送方地址</b>填进 <code>peer</code>，回包时把它原样传给 <code>sendto</code>。一个 UDP socket 因此天然服务任意多个客户端。' },

    { t: 'p', html: '两个边界要记住。单个数据报最大 65507 字节（65535 减 20 字节 IP 头、再减 8 字节 UDP 头），超了 <code>sendto</code> 返回 <code>EMSGSIZE</code>；实际还受 MTU 限制，超过约 1472 字节就会被 IP 分片，丢一片整个报文就废了，所以应用层通常把消息控制在 1200 字节以内。另外，想让 UDP socket 只收某个对端的数据，可以调 <code>connect</code>：它不发包，只在内核里记下默认目的地址并过滤来源，之后能用 <code>send</code>/<code>read</code>，出错时还能收到 ICMP 端口不可达的通知。' },

    { t: 'code', lang: 'c', caption: 'echo_server_udp.c —— 无连接的 echo：recvfrom 拿到对端地址，sendto 原路送回，不用 fork 也能并发', code: `/* echo_server_udp.c —— 一个 socket 服务所有客户端
 * 编译：gcc -O2 -Wall -o echo_server_udp echo_server_udp.c
 */
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

int main(void) {
    int fd = socket(AF_INET, SOCK_DGRAM, 0);   /* SOCK_DGRAM，不是 STREAM */
    if (fd < 0) { perror("socket"); return 1; }

    struct sockaddr_in addr;
    memset(&addr, 0, sizeof addr);
    addr.sin_family      = AF_INET;
    addr.sin_addr.s_addr = htonl(INADDR_ANY);
    addr.sin_port        = htons(9001);
    if (bind(fd, (struct sockaddr *)&addr, sizeof addr) < 0) { perror("bind"); return 1; }

    for (;;) {
        char buf[2048];
        struct sockaddr_in peer;
        socklen_t plen = sizeof peer;
        ssize_t n = recvfrom(fd, buf, sizeof buf, 0,
                             (struct sockaddr *)&peer, &plen);
        if (n < 0) { perror("recvfrom"); continue; }
        /* n 就是这条消息的边界；回包把 peer 原样传回去 */
        if (sendto(fd, buf, (size_t)n, 0,
                   (struct sockaddr *)&peer, plen) < 0)
            perror("sendto");
    }
}` },

    { t: 'compare', left: { title: 'TCP：先建连接，再传字节流', html: '三次握手后才能发数据；内核保证有序、不丢、不重复；没有消息边界，协议要自己定；每条连接占一个 fd 与一份收发缓冲区；适合文件、HTTP、数据库这类「一个字节都不能错」的传输。' }, right: { title: 'UDP：直接发数据报', html: '不用握手，第一个包就能带数据；内核只保证尽力而为，可能丢、可能乱序、可能重复；保留消息边界，一条就是一条；没有连接状态，一个 socket 服务所有客户端；适合 DNS、音视频、游戏这类「晚了就没用」的场景。' } },

    { t: 'h', lvl: 2, text: '六、I/O 多路复用：select、poll、epoll', id: 'ch03-6' },

    { t: 'p', html: '线程模型的成本随连接数线性上涨：每个线程要一份栈、一次上下文切换，而其中 99% 的线程都在睡眠等数据。<b>I/O 多路复用（I/O multiplexing）</b>换个思路：把「等」交给内核，一个线程同时监视 N 个 fd，谁就绪就处理谁。<code>select</code> 用 <code>fd_set</code> 位图，上限 <code>FD_SETSIZE</code>（通常 1024），每次调用都要把集合从用户态拷进内核，返回后还要 O(n) 扫描哪一位变了；<code>poll</code> 换成数组，去掉了 1024 上限，但仍是每次全量拷贝加 O(n) 扫描；<code>epoll</code> 把 fd 注册进内核的红黑树，只把就绪的 fd 放进链表返回，复杂度 O(就绪数)，注册只需一次。' },

    { t: 'table', head: ['维度', '<code>select</code>', '<code>poll</code>', '<code>epoll</code>'], rows: [
      ['数据结构', '<code>fd_set</code> 位图', '<code>pollfd</code> 数组', '内核红黑树 + 就绪链表'],
      ['fd 上限', '<code>FD_SETSIZE</code>，通常 1024', '无硬上限，受内存限制', '无硬上限'],
      ['每次调用', '全量拷贝 + O(n) 扫描', '全量拷贝 + O(n) 扫描', '只返回就绪项，O(就绪数)'],
      ['触发方式', '水平触发', '水平触发', '水平触发（LT）或边缘触发（ET）'],
      ['适合', '连接少、要跨平台', '连接中等、要可移植', 'Linux 上的高并发服务']
    ], caption: '三个接口解决同一个问题；epoll 快在「不用每次重新告诉内核你关心哪些 fd」' },

    { t: 'p', html: '<code>epoll</code> 有两种触发模式，选错会丢事件。<b>水平触发（level-triggered，LT，默认）</b>：只要缓冲区里还有数据，<code>epoll_wait</code> 每次都会返回这个 fd，你读一半也没关系，下次还会通知——写起来简单，适合绝大多数服务。<b>边缘触发（edge-triggered，ET）</b>：只在「状态变化」的那一下通知一次，之后即使还有数据也不再提醒。所以 ET 必须配<b>非阻塞 fd</b>，并在一个循环里 <code>read</code> 到返回 -1 且 <code>errno == EAGAIN</code> 为止；漏了这个循环，剩下的数据就永远卡在缓冲区里。ET 少一些系统调用，代价是代码复杂、错了很难查。初学一律用 LT。' },

    { t: 'h', lvl: 2, text: '七、常见错误与调试', id: 'ch03-7' },

    { t: 'p', html: 'socket 的 bug 常有个共同特征：<b>不报错，只是行为不对</b>。下面按「现象 → 原因 → 修法」列出最高频的七类。特别注意 <code>read</code> 返回 0 与返回 -1 的区别：0 是对端<b>正常关闭</b>（发了 FIN），-1 才是出错，而 <code>EINTR</code> 这种「错」应重试而非放弃。' },

    { t: 'table', head: ['现象', '原因', '修法'], rows: [
      ['<code>bind: Address already in use</code>', '旧进程还在，或连接处于 TIME_WAIT（主动关闭方要等 2 倍 MSL）', '在 <code>bind</code> 之前调 <code>setsockopt(SO_REUSEADDR)</code>；先确认没有残留进程'],
      ['<code>accept</code> 或 <code>read</code> 返回 -1，程序异常退出', '<code>errno == EINTR</code>，慢系统调用被信号处理函数打断', '<code>if (errno == EINTR) continue;</code> 重试，别当致命错误'],
      ['服务器写数据时进程直接被杀', '对端已关闭，内核发 <code>SIGPIPE</code>，默认动作是终止进程', '<code>signal(SIGPIPE, SIG_IGN)</code>，或 <code>send(..., MSG_NOSIGNAL)</code>'],
      ['客户端只收到半条消息', '<code>read</code> 只读到一部分，代码却当成完整消息', '循环读到凑满长度，或改用长度前缀协议'],
      ['大块数据只发出去一部分', '<code>write</code> 返回值小于请求长度（短写），代码忽略了返回值', '循环 <code>write</code> 直到写完，每次检查返回值'],
      ['跑几小时后 <code>fork</code> 或 <code>accept</code> 失败', 'fd 泄漏（忘了 <code>close</code>）或僵尸进程堆积', '<code>ss -s</code> 看 fd 数；装 <code>SIGCHLD</code> 处理函数回收子进程'],
      ['一万连接时 CPU 打满', '每连接一个线程，上下文切换把 CPU 吃光', '换 <code>epoll</code> 或线程池，把「等」交给内核']
    ], caption: '七类高频故障，前三条几乎每个作业都会遇到' },

    { t: 'p', html: '调试顺序固定成四步。<b>① <code>strace -f -e trace=network ./server</code></b>：看每个系统调用的返回值与 errno，能区分「没调用」与「调用了但失败」。<b>② <code>ss -tanp</code></b>：看连接停在哪个 TCP 状态、收发队列积压多少；大量 <code>CLOSE_WAIT</code> 说明你的程序没 <code>close</code>，大量 <code>TIME_WAIT</code> 说明是你在主动关闭。<b>③ <code>tcpdump -i lo -nn port 9000 -X</code></b>：看线上发了哪些字节，验证长度前缀写对没有。<b>④ <code>gdb -p &lt;pid&gt;</code> 再 <code>thread apply all bt</code></b>：程序卡死时看所有线程停在哪，比加日志快得多。' },

    { t: 'h', lvl: 2, text: '八、一个可运行的 echo 服务器', id: 'ch03-8' },

    { t: 'p', html: '最后把零件拼起来。需求：单进程、单线程、支持上万并发连接、原样回显、能干净处理半关闭与错误。选择 <code>epoll</code> 水平触发加非阻塞 fd：LT 让代码保持简单（读一半不会丢事件），非阻塞保证 <code>accept</code>/<code>read</code> 不会把事件循环卡住。三个设计决定值得说清楚：<b>① 监听 fd 也设非阻塞</b>，这样 <code>accept</code> 在队列空时返回 <code>EAGAIN</code>，可以安全地一次取完所有排队连接；<b>② 新连接必须 <code>set_nonblock</code></b>，否则某个客户端只连不发时，<code>read</code> 会把整个循环拖死；<b>③ 关闭统一走 <code>EPOLL_CTL_DEL</code> 再 <code>close</code></b>，避免 fd 号被复用时旧事件误触发。' },

    { t: 'code', lang: 'c', caption: 'echo_server_epoll.c —— 完整可运行的 epoll 回显服务器：gcc -O2 -Wall -o echo_server echo_server_epoll.c', code: `/* echo_server_epoll.c —— 单线程 epoll(LT) 回显服务器
 * 编译：gcc -O2 -Wall -o echo_server echo_server_epoll.c
 * 运行：./echo_server 9000
 * 验证：printf 'hello\\n' | nc 127.0.0.1 9000
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <errno.h>
#include <signal.h>
#include <fcntl.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <sys/epoll.h>

#define MAX_EVENTS 1024
#define BUF_SIZE   4096

static int set_nonblock(int fd) {
    int fl = fcntl(fd, F_GETFL, 0);
    return fl < 0 ? -1 : fcntl(fd, F_SETFL, fl | O_NONBLOCK);
}

int main(int argc, char **argv) {
    int port = argc > 1 ? atoi(argv[1]) : 9000;
    signal(SIGPIPE, SIG_IGN);              /* 对端先关时不要被内核杀掉 */

    int lfd = socket(AF_INET, SOCK_STREAM, 0);
    if (lfd < 0) { perror("socket"); return 1; }
    int on = 1;
    setsockopt(lfd, SOL_SOCKET, SO_REUSEADDR, &on, sizeof on);

    struct sockaddr_in addr;
    memset(&addr, 0, sizeof addr);
    addr.sin_family      = AF_INET;
    addr.sin_addr.s_addr = htonl(INADDR_ANY);
    addr.sin_port        = htons((unsigned short)port);
    if (bind(lfd, (struct sockaddr *)&addr, sizeof addr) < 0) { perror("bind"); return 1; }
    if (listen(lfd, 128) < 0) { perror("listen"); return 1; }
    set_nonblock(lfd);

    int epfd = epoll_create1(0);
    if (epfd < 0) { perror("epoll_create1"); return 1; }

    struct epoll_event ev, events[MAX_EVENTS];
    ev.events = EPOLLIN;                   /* LT：还有数据就继续通知 */
    ev.data.fd = lfd;
    epoll_ctl(epfd, EPOLL_CTL_ADD, lfd, &ev);
    printf("echo server listening on :%d\\n", port);

    for (;;) {
        int n = epoll_wait(epfd, events, MAX_EVENTS, -1);
        if (n < 0) {
            if (errno == EINTR) continue;
            perror("epoll_wait");
            break;
        }

        for (int i = 0; i < n; i++) {
            int fd = events[i].data.fd;

            if (fd == lfd) {                       /* 监听 fd：取走所有排队连接 */
                for (;;) {
                    int cfd = accept(lfd, NULL, NULL);
                    if (cfd < 0) {
                        if (errno == EAGAIN || errno == EWOULDBLOCK) break;
                        if (errno == EINTR) continue;
                        perror("accept");
                        break;
                    }
                    if (set_nonblock(cfd) < 0) { close(cfd); continue; }
                    ev.events = EPOLLIN;
                    ev.data.fd = cfd;
                    if (epoll_ctl(epfd, EPOLL_CTL_ADD, cfd, &ev) < 0) close(cfd);
                }
                continue;
            }

            char buf[BUF_SIZE];
            ssize_t r = read(fd, buf, sizeof buf);
            if (r > 0) {                           /* 读到数据：循环写回去 */
                ssize_t off = 0;
                while (off < r) {
                    ssize_t w = write(fd, buf + off, (size_t)(r - off));
                    if (w < 0) {
                        if (errno == EINTR) continue;
                        break;
                    }
                    off += w;
                }
            } else if (r == 0) {                   /* 0：对端关闭 */
                epoll_ctl(epfd, EPOLL_CTL_DEL, fd, NULL);
                close(fd);
            } else {                               /* -1 */
                if (errno != EAGAIN && errno != EWOULDBLOCK) {
                    epoll_ctl(epfd, EPOLL_CTL_DEL, fd, NULL);
                    close(fd);
                }
            }
        }
    }
    close(epfd);
    close(lfd);
    return 0;
}` },

    { t: 'steps', items: [
      { title: '第一步 · 编译并启动', html: '执行 <code>gcc -O2 -Wall -o echo_server echo_server_epoll.c</code>，再跑 <code>./echo_server 9000</code>。看到 <code>listening on :9000</code> 才算起来了；编译期有 warning 先解决，socket 代码里的隐式声明往往意味着漏了头文件。' },
      { title: '第二步 · 手动回显', html: '另开一个终端：<code>printf hello | nc 127.0.0.1 9000</code>，应原样打印回来。再用 <code>nc 127.0.0.1 9000</code> 交互式敲几行，确认每行都能立刻回显。' },
      { title: '第三步 · 看内核里的状态', html: '执行 <code>ss -tanp | grep 9000</code>：LISTEN 是监听 fd，ESTAB 是已建立连接，客户端主动关闭后会出现 TIME_WAIT。再执行 <code>ss -s</code> 看总 fd 数，多连几次确认它没有一直涨。' },
      { title: '第四步 · 压一下并观察', html: '用 <code>for i in $(seq 1 500); do nc -z 127.0.0.1 9000; done</code> 制造短连接，同时用 <code>strace -c -p &lt;pid&gt;</code> 看系统调用分布：如果 <code>epoll_wait</code> 占大头说明在空转，如果 <code>read</code> 占大头说明数据量真的上来了。' },
      { title: '第五步 · 故意制造故障', html: '先 <code>kill -9</code> 再立刻重启，观察是否报 <code>EADDRINUSE</code>（有 <code>SO_REUSEADDR</code> 就不会）；再开一个 <code>nc</code> 连上但不发数据，确认其它客户端仍然正常——这一步没通过，说明某个 fd 还是阻塞的。' }
    ] },

    { t: 'callout', kind: 'warn', title: '这段代码为了短，省掉了什么', html: '它没有<b>输出缓冲区</b>：连接 fd 是非阻塞的，<code>write</code> 遇到 <code>EAGAIN</code> 时直接放弃，剩下的回包就丢了；正确做法是给每条连接挂一个发送队列，把没写完的字节存起来并监听 <code>EPOLLOUT</code>。它也<b>没处理 <code>EMFILE</code></b>（fd 用尽时 <code>accept</code> 返回 -1）和<b>空闲超时</b>。这些正是把 echo 服务器变成正经服务器的下一步，但骨架已经对了：非阻塞 fd、LT 事件循环、统一的关闭路径。' },

    { t: 'terms', items: [
      { en: 'socket', zh: '套接字', html: '操作系统提供的通信端点，本质是一个文件描述符；一条连接由五元组唯一确定，两端各持一个 socket。' },
      { en: 'five-tuple', zh: '五元组', html: '协议、源 IP、源端口、目的 IP、目的端口；五个字段全相同才算同一条连接，这是「一个端口服务上万客户端」的原理。' },
      { en: 'backlog', zh: '连接队列长度', html: '<code>listen</code> 的第二个参数，限制「已完成握手、等待 accept」的队列长度，不是最大连接数；队列满时新 SYN 被丢弃。' },
      { en: 'zombie process', zh: '僵尸进程', html: '已退出但父进程尚未 <code>wait</code> 的子进程，内核保留其退出状态占用进程表项；短连接服务器必须用 <code>SIGCHLD</code> 加 <code>waitpid</code> 回收。' },
      { en: 'message boundary', zh: '消息边界', html: 'TCP 是字节流，不保留发送方的 write 边界；应用层必须用长度前缀、定长或分隔符自己划出每条消息的范围。' },
      { en: 'short write', zh: '短写', html: '<code>write</code> 返回值小于请求长度，只写进去一部分；必须循环写剩余字节，否则对端收到的是残缺数据。' },
      { en: 'level-triggered / edge-triggered', zh: '水平触发 / 边缘触发', html: 'LT 只要缓冲区有数据就反复通知；ET 只在状态变化时通知一次，因此必须非阻塞并循环读到 <code>EAGAIN</code>。' }
    ] },

    { t: 'quiz', qid: 'ch03-q1' },
    { t: 'quiz', qid: 'ch03-q2' },
    { t: 'quiz', qid: 'ch03-q3' },

    { t: 'keypoint', items: [
      { title: 'socket 是端点，不是端口', html: '连接由五元组唯一确定；<code>accept</code> 返回新 fd，是因为新 fd 代表「这一条连接」，监听 fd 只负责收连接、不读数据。' },
      { title: '两条序列要背到条件反射', html: '服务器 socket→bind→listen→accept→read/write→close；客户端 socket→connect→write/read→close。客户端不 bind，临时端口由内核分配。' },
      { title: '阻塞点决定并发模型', html: '单线程服务器会被一个不发数据的客户端卡死；fork 换来隔离但要回收僵尸、关掉继承的 fd；thread 便宜但要加锁。' },
      { title: 'TCP 没有消息边界', html: '粘包与拆包是正常现象，不是 bug；长度前缀最通用，且必须配 send_all/read_all 处理短写与半包。' },
      { title: 'UDP 保留边界但不保证送达', html: '没有 listen/accept，一个 socket 服务所有客户端；单报最大 65507 字节，实际应控制在 MTU 以内避免分片。' },
      { title: 'epoll 用 LT 起步，ET 要读到 EAGAIN', html: 'select 有 1024 上限且每次 O(n) 扫描；epoll 只返回就绪项。ET 必须非阻塞并循环读空，否则会永久丢事件。' }
    ] },

    { t: 'checklist', id: 'ch03', items: [
      '我能不看资料写出 TCP 服务器的五个调用，并说清每个调用把五元组的哪部分确定下来',
      '我能解释为什么 accept 返回新 fd，以及监听 fd 为什么不读数据',
      '我能说出 backlog 限制的是哪个队列，队列满了客户端会看到什么现象',
      '我能把单连接服务器改成 fork 版，并说清为什么子进程要 close 监听 fd、父进程要 close 连接 fd',
      '我能解释僵尸进程怎么产生，并写出带 waitpid 循环的 SIGCHLD 处理函数',
      '我能判断一段收发代码会不会粘包或短写，并用长度前缀 + send_all/read_all 修好它',
      '我能写出 UDP 回显程序，并说明它为什么不需要 listen、为什么一个 socket 能服务多个客户端',
      '我能对比 select、poll、epoll 的数据结构与复杂度，并说清 LT 与 ET 的适用场景',
      '我能按「现象→原因→修法」处理 EADDRINUSE、EINTR、SIGPIPE、read 返回 0、短写、fd 泄漏',
      '我能在自己的机器上编译并跑通本章的 echo 服务器，用 nc 验证、用 ss 与 strace 观察它的行为'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章覆盖 <code>CSC4303_06_socket.pdf</code> 的全部主线：socket 抽象与五元组、TCP 客户端/服务器的调用序列、<code>listen</code> 与 backlog、<code>accept</code> 返回新 fd、阻塞语义与并发服务器（fork、thread、prefork/线程池）、字节序转换与 <code>inet_pton</code>/<code>inet_ntop</code>、TCP 字节流与粘包、UDP 的 <code>recvfrom</code>/<code>sendto</code>、I/O 多路复用（select、poll、epoll 与 LT/ET）、常见 errno 与调试手段。API 细节与更多边界情况对照 Stevens《Unix Network Programming, Vol.1》第 4–6 章（基本 TCP socket、I/O 多路复用）与第 14 章（非阻塞 I/O 与高级收发）。文中的 C 代码面向 Linux/POSIX，用 <code>gcc -O2 -Wall</code> 可直接编译；Windows 需 WSL 或改用 Winsock，<code>epoll</code>、<code>MSG_NOSIGNAL</code>、<code>SOCK_NONBLOCK</code> 均为 Linux 专有。课程要求与作业细节以当学期讲义和 Blackboard 通知为准。' }
  ]
});
