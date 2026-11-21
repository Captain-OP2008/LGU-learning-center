/* =====================================================================
 * projects.js · CSC4303 实战项目
 * 结构：{ id, title, en, tagline, level, minutes, chapters, goals, intro,
 *         milestones:[{ n, title, tasks, starter, hints, solution }] }
 * 三个项目由易到难：抓包诊断 → 并发服务器 → 小型分布式键值存储。
 * 全部可在 Linux（或 WSL2）上完成，只依赖 gcc / python3 / tcpdump。
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerProjects([

    /* ================================================================ P1 */
    {
      id: 'P1',
      title: '抓包诊断：一次 HTTP 请求的 200 毫秒',
      en: 'PACKET AUTOPSY',
      tagline: '用 tcpdump 抓一次真实请求，把 DNS、TCP、HTTP 的每个 RTT 标在时间轴上。',
      level: '入门',
      minutes: 120,
      chapters: ['ch01', 'ch02', 'ch04', 'ch05'],
      goals: [
        '能用 tcpdump 过滤出一次完整请求的 DNS、TCP、HTTP 报文，并导出为可读文本',
        '能从抓包里读出三次握手的序号变化、MSS、窗口大小与 RTT',
        '能画出时间轴，指出时间花在 DNS、握手、传输还是服务器处理上',
        '能解释「为什么首访比二次访问慢」，并给出至少两条优化建议'
      ],
      intro: '这个项目不写服务器，只做一件事：把你在 ch01 学的时延分解、ch02 学的握手与窗口、ch05 学的 DNS 与 HTTP，' +
        '落到一份真实的抓包文件上。做完你会有一个习惯——遇到「网站慢」，先抓包，再猜原因。' +
        '注意：只抓自己发起的流量，不要在公共网络抓别人的包。',
      milestones: [
        {
          n: 1,
          title: '抓一次干净的请求',
          tasks: [
            '清空本地 DNS 缓存（或用一个没访问过的域名），确保能抓到完整的递归查询。',
            '开两个终端：一个运行 <code>sudo tcpdump -i any -n -s 0 -w visit.pcap "port 53 or port 80 or port 443"</code>，另一个执行 <code>curl -v http://example.com/</code>。',
            '请求结束后用 Ctrl+C 停止抓包，再用 <code>tcpdump -r visit.pcap -nn -tttt</code> 读出文本。',
            '确认抓到了：至少一条 DNS 查询与响应、SYN / SYN-ACK / ACK、一个 HTTP GET 与响应。缺哪类就调整过滤条件重抓。'
          ],
          hints: [
            '用 <code>-i any</code> 可以同时抓到回环与物理网卡；只写 <code>-i eth0</code> 可能漏掉本机 DNS 缓存命中的流量。',
            '如果 DNS 走的是 systemd-resolved 的本地缓存，53 端口可能没有出网流量；改用 <code>dig +trace example.com</code> 强制走完整解析。',
            'HTTPS 的报文内容是加密的，但握手与证书里的域名仍可见；想看清 HTTP 报文就用 <code>http://</code> 的站点。'
          ],
          solution: '可用的抓包命令：<code>sudo tcpdump -i any -n -s 0 -w visit.pcap "udp port 53 or tcp port 80"</code>。' +
            '读包时先看时间戳差：第一条 DNS 查询与响应之间通常是 1–20 ms（本地解析器），' +
            '若解析器要递归，差距会到一个 RTT 以上。再找 <code>Flags [S]</code> 的包，它到 <code>[S.]</code> 的间隔就是一次 RTT。'
        },
        {
          n: 2,
          title: '把时间轴画出来',
          tasks: [
            '以第一个 SYN 的时刻为 0，列出每个关键事件的相对时间：DNS 查询、DNS 响应、SYN、SYN-ACK、ACK、GET、响应首字节、响应结束。',
            '标出三次握手的三个序号（client_isn、server_isn、两者 +1），并验证 ACK 号等于对方序号 +1。',
            '找出 SYN 报文里的 MSS 选项值，解释它与 1500 字节 MTU 的关系。',
            '统计整条请求的总字节数与总耗时，算出平均吞吐（KB/s），并与链路带宽对比。'
          ],
          hints: [
            'Wireshark 的「Statistics → Flow Graph」能直接画时序图；命令行可用 <code>tshark -r visit.pcap -T fields -e frame.time_relative -e ip.src -e tcp.flags</code>。',
            'MSS 通常等于 MTU 减去 IP 头 20 与 TCP 头 20，即 1460；若看到 1440，说明用了 IP 选项或隧道封装。',
            '响应首字节时间减去 GET 发出时间，大致等于服务器处理时间加半个 RTT，不要把它当成纯网络时延。'
          ],
          solution: '典型时间轴（本地到同城服务器）：DNS 0–15 ms、TCP 握手 15–35 ms、GET 35–36 ms、首字节 36–60 ms。' +
            '如果 DNS 段特别长，说明解析器在递归；如果握手后很久才发 GET，多半是客户端在等用户态或 TLS。' +
            '把每段标注成「传播 / 传输 / 排队 / 处理」，就得到一张可解释的分解图。'
        },
        {
          n: 3,
          title: '给出诊断与优化',
          tasks: [
            '写 300 字诊断：这次请求的主要耗时在哪一段，证据是哪几个包的哪几个时间戳。',
            '提出两条优化：一条针对 DNS（如预解析、延长 TTL），一条针对连接（如 keep-alive、HTTP/2、CDN）。',
            '估算优化后能省几个 RTT、多少毫秒，写明假设。',
            '对比同一站点第二次访问的抓包，验证 keep-alive 与缓存是否生效。'
          ],
          hints: [
            '第二次访问若没有 DNS 查询、也没有 SYN，说明缓存与连接复用都生效了，省下的正是 2 个 RTT 左右。',
            '估算时把 RTT 当作已知量（从握手间隔读出），不要凭感觉写「快很多」。',
            '优化建议要能落到协议机制上：预解析对应 DNS 缓存，keep-alive 对应省掉握手，CDN 对应缩短传播时延。'
          ],
          solution: '一份合格诊断的骨架：「本次请求总耗时 180 ms，其中 DNS 72 ms（占 40%），证据是 0.000 与 0.072 两条 53 端口报文；' +
            'TCP 握手 1 个 RTT 约 24 ms；服务器首字节 60 ms，偏大，怀疑后端查询。建议：① 把域名加入 dns-prefetch 并提高 TTL，' +
            '预计省 50 ms；② 启用 keep-alive 与 HTTP/2，二次访问省去握手与队头阻塞，预计再省 24 ms。」'
        }
      ]
    },

    /* ================================================================ P2 */
    {
      id: 'P2',
      title: '并发 echo 服务器：从 fork 到 epoll',
      en: 'CONCURRENT ECHO',
      tagline: '先用 fork 写对，再用 epoll 撑到 1000 个连接，中间踩完粘包与短读的坑。',
      level: '进阶',
      minutes: 240,
      chapters: ['ch02', 'ch03'],
      goals: [
        '能写出正确的 TCP 服务器调用序列，并解释每个系统调用的返回值与失败分支',
        '能实现长度前缀的消息定界，处理短读、短写与半包',
        '能用 fork、线程池、epoll 三种方式实现并发，并比较它们的开销与适用场景',
        '能用 ss、strace、tcpdump 定位 CLOSE_WAIT 堆积与 fd 泄漏'
      ],
      intro: 'echo 服务器是最小但完整的网络程序：它要处理连接建立、字节流定界、并发、异常关闭与资源回收。' +
        '把它写对，ch03 的每个 API 才真正属于你；把它压测到 1000 连接，你才会理解为什么 epoll 取代了 select。' +
        '本项目要求 Linux 环境（WSL2 亦可），编译用 <code>gcc -Wall -Wextra -O2</code>。',
      milestones: [
        {
          n: 1,
          title: '单连接版本：先跑通，再定界',
          tasks: [
            '写服务器：socket → setsockopt(SO_REUSEADDR) → bind → listen → accept → 循环 read/write → close。',
            '写客户端：连接后发送 3 条消息，每条格式为「4 字节大端长度 + 内容」，验证服务器原样回显。',
            '服务器必须循环读直到凑够 4 字节头、再读满 length 字节；禁止假设一次 read 就是一条消息。',
            '处理 read 返回 0（对端关闭）、返回 -1 且 errno == EINTR（重试）、短写（循环写完）。'
          ],
          starter: 'int listen_fd = socket(AF_INET, SOCK_STREAM, 0);\n' +
            'int on = 1;\n' +
            'setsockopt(listen_fd, SOL_SOCKET, SO_REUSEADDR, &on, sizeof(on));\n' +
            'struct sockaddr_in addr = {0};\n' +
            'addr.sin_family = AF_INET;\n' +
            'addr.sin_addr.s_addr = htonl(INADDR_ANY);\n' +
            'addr.sin_port = htons(9000);\n' +
            'bind(listen_fd, (struct sockaddr *)&addr, sizeof(addr));\n' +
            'listen(listen_fd, 128);\n' +
            'for (;;) {\n' +
            '    int fd = accept(listen_fd, NULL, NULL);\n' +
            '    if (fd < 0) { if (errno == EINTR) continue; perror("accept"); break; }\n' +
            '    /* 在这里处理连接 */\n' +
            '}',
          hints: [
            '长度前缀要用 <code>htonl</code> 转成网络序再写，读的时候先 <code>ntohl</code> 再分配缓冲。',
            '写一个 <code>read_full(fd, buf, n)</code>：循环 read，累计已读字节，遇到 0 或错误就返回已读量。',
            '用 <code>nc 127.0.0.1 9000</code> 手动测：发 5 个字节，看服务器是否在等剩下的长度头，避免「收到就回」的错觉。'
          ],
          solution: '核心是 <code>read_full</code> 与 <code>write_full</code> 两个辅助函数：前者循环读到 n 字节或 EOF，' +
            '后者循环写到 n 字节或错误（处理 EINTR 与部分写）。消息循环写成：读 4 字节头 → ntohl 得 len → ' +
            '校验 len ≤ 1 MB → 读 len 字节 → 回写 4 字节头 + 内容。任何一步返回 0 都表示对端关闭，直接收尾。'
        },
        {
          n: 2,
          title: '并发：fork、线程池与 epoll 三选一',
          tasks: [
            'fork 版：accept 后 fork 子进程处理，父进程关闭新 fd，子进程关闭 listen fd，父进程用 waitpid 回收避免僵尸。',
            '线程池版：固定 8 个 worker，主线程 accept 后把 fd 放入队列，worker 取任务处理；注意队列加锁与条件变量。',
            'epoll 版：非阻塞 fd + epoll_wait，LT 模式即可；为每个连接维护读缓冲与「还差多少字节」的状态。',
            '三种版本都要能通过同一套客户端测试：100 个并发连接各发 10 条消息，全部正确回显。'
          ],
          hints: [
            'fork 版最容易漏的是信号：子进程退出会变成僵尸，父进程要么 waitpid，要么 <code>signal(SIGCHLD, SIG_IGN)</code>。',
            'epoll 的 LT 模式不必一次读到 EAGAIN，但必须把没读完的数据留在缓冲里，下次事件继续拼。',
            '压测用 <code>for i in $(seq 100); do (printf ... | nc 127.0.0.1 9000 &) ; done</code>，或写一个多线程 Python 客户端。'
          ],
          solution: 'epoll 版的状态机：每个连接一个 <code>struct conn { int fd; char buf[65536]; size_t have; size_t need; }</code>。' +
            '事件到来时循环 read 追加到 buf；当 have ≥ 4 且 need == 0 时解析头得到 need；当 have ≥ 4+need 时回写并前移缓冲。' +
            '注意 <code>epoll_ctl</code> 用 EPOLLIN | EPOLLRDHUP，对端关闭时清理并 close，避免 fd 泄漏。'
        },
        {
          n: 3,
          title: '压测与排错',
          tasks: [
            '用 <code>ss -tan state established | wc -l</code> 观察连接数，压到 1000 并发并记录 CPU 与内存。',
            '人为制造两种故障：客户端不发完长度头就断开、服务器不回写直接 close，用 <code>ss -tan</code> 找出 CLOSE_WAIT 堆积。',
            '用 <code>strace -f -e trace=network</code> 跟踪一个连接的系统调用，确认 accept/read/write 的顺序与返回值。',
            '写 200 字对比：fork、线程池、epoll 在 1000 连接下的内存、上下文切换与代码复杂度。'
          ],
          hints: [
            'CLOSE_WAIT 堆积说明应用没有 close：对端已发 FIN，本端读到了 EOF 却忘了关 fd。',
            '1000 连接用 fork 会创建 1000 个进程，内存与调度开销都高；线程池默认 8 个 worker 时，慢连接会占住 worker，需要非阻塞或超时。',
            '<code>ulimit -n</code> 默认可能是 1024，压测前先 <code>ulimit -n 65535</code>，否则 accept 会报 EMFILE。'
          ],
          solution: '一份可用的结论：fork 版 1000 连接常驻内存约 3–8 MB/进程，上下文切换随连接数线性上升；' +
            '线程池版内存低一个量级，但慢客户端会耗尽 worker，需要配合非阻塞 IO 或每连接超时；' +
            'epoll 版单线程即可维持 1000 连接，内存主要是每连接 64 KB 缓冲，CPU 花在事件分发上。' +
            '真实服务器常把 epoll 与线程池结合：IO 线程收发包，工作线程处理业务。'
        }
      ]
    },

    /* ================================================================ P3 */
    {
      id: 'P3',
      title: '小型分布式键值存储：一致性哈希 + quorum',
      en: 'MINI DYNAMO',
      tagline: '三台「节点」进程，用 socket 做 RPC，把 Dynamo 的一致性哈希与读写 quorum 跑起来。',
      level: '挑战',
      minutes: 360,
      chapters: ['ch03', 'ch06', 'ch07'],
      goals: [
        '能用 socket 定义一套最小的 RPC 协议（长度前缀 + JSON），并处理超时与重试',
        '能实现一致性哈希环与虚拟节点，观察增删节点时的数据迁移量',
        '能实现 N=3、W=2、R=2 的读写 quorum，并验证 R+W&gt;N 时的读一致性',
        '能注入节点故障，验证 hinted handoff 或至少能说清没有它时的行为'
      ],
      intro: '这是把 ch06 的论文变成代码的项目：不需要真正的磁盘存储，把数据放在内存里即可，' +
        '重点是分布式部分——分片、副本、quorum、冲突与故障。用 Python 写最省事（标准库 socket + json + hashlib 就够），' +
        '三台节点在同一台机器上用不同端口模拟。做完你就能回答「加一台机器要搬多少数据」「两台副本挂了还能写吗」。',
      milestones: [
        {
          n: 1,
          title: 'RPC 与单节点存储',
          tasks: [
            '定义协议：请求为 4 字节大端长度 + JSON <code>{"op":"put","key":...,"value":...}</code>，响应同格式带 <code>ok</code> 与 <code>err</code>。',
            '实现单节点服务器：内存 dict，支持 put/get/delete，用线程处理并发连接。',
            '实现客户端：连接、发送、读满响应、超时 1 秒后重试一次（幂等 put 可安全重试）。',
            '写测试：1000 次随机 put/get，验证读到的值与写入一致，统计 P50/P99 延迟。'
          ],
          starter: 'import json, socket, struct\n\n' +
            'def send_msg(sock, obj):\n' +
            '    body = json.dumps(obj).encode()\n' +
            '    sock.sendall(struct.pack("!I", len(body)) + body)\n\n' +
            'def recv_msg(sock):\n' +
            '    head = recv_exact(sock, 4)\n' +
            '    if not head:\n' +
            '        return None\n' +
            '    (n,) = struct.unpack("!I", head)\n' +
            '    return json.loads(recv_exact(sock, n).decode())',
          hints: [
            'JSON 里不能直接放 bytes，value 用 base64 或直接限制为字符串，省掉序列化麻烦。',
            '服务端每个连接一个线程即可；注意 <code>recv</code> 返回空表示对端关闭，要退出循环而不是继续解析。',
            '超时用 <code>sock.settimeout(1.0)</code>，捕获 <code>socket.timeout</code> 后重连重试，不要复用半死的连接。'
          ],
          solution: '关键是把「消息边界」和「超时重试」处理干净：<code>recv_exact</code> 循环读满 n 字节，' +
            '任何一次返回空就抛异常；客户端每次重试新建连接，避免旧连接上的残留数据污染下一次响应。' +
            'put 是幂等的（同 key 同 value 覆盖），所以 at-least-once 重试安全；delete 也幂等；' +
            '若实现「追加」类操作就必须带请求 ID 去重。'
        },
        {
          n: 2,
          title: '一致性哈希与复制',
          tasks: [
            '把 key 哈希到 0–2<sup>32</sup>−1 的环上，节点也用同样哈希；每个物理节点放 100 个虚拟节点减少倾斜。',
            '实现 <code>owner(key)</code>：顺时针找到第一个虚拟节点对应的物理节点，再取其后两个节点作为副本（N=3）。',
            '客户端把写请求发给三个副本，收到 2 个成功即返回（W=2）；读时向三个副本取，取版本号最大的值（R=2 可先返回）。',
            '统计 10 万条 key 在 3 个节点上的分布，再增加第 4 个节点，统计需要迁移的 key 比例。'
          ],
          hints: [
            '虚拟节点数太少会倾斜严重：3 个物理节点各 100 个虚拟节点时，负载偏差通常能压到 ±10% 以内。',
            '加节点时只应迁移「原本属于后继、现在归新节点」的那一段，比例约为 1/(N+1)，不是全部重新取模。',
            '版本号用单调递增的整数即可；若要多客户端并发写，需要向量时钟或至少 last-write-wins 加时间戳。'
          ],
          solution: '一致性哈希的核心代码不到 20 行：<code>ring = sorted((hash(vnode), node) for node in nodes for vnode in ...)</code>，' +
            '查找用 <code>bisect</code> 找第一个 ≥ key_hash 的位置，越界则回到 0。' +
            '加第 4 个节点时，只有落在「新节点插入位置到其后继之间」的 key 会迁移，理论比例 1/4；' +
            '若用 <code>hash(key) % N</code>，同一实验会迁移约 3/4，这个对比就是项目最有说服力的结果。'
        },
        {
          n: 3,
          title: '故障注入与一致性验证',
          tasks: [
            '写一个 chaos 脚本：随机杀掉一个节点 10 秒再重启，期间持续读写，统计成功率与错误类型。',
            '验证 R+W&gt;N：写入后立即从两个副本读，检查是否至少有一个返回最新版本；再把 W 改为 1 做对照。',
            '实现最简单的 hinted handoff：目标副本不可达时，把写暂存到下一个节点并记下「原目标」，恢复后回放。',
            '写 300 字报告：系统在什么故障下仍可写、什么情况下会丢数据、CAP 里你实际选了哪两个。'
          ],
          hints: [
            '杀进程用 <code>kill -9</code> 才像真故障；<code>kill</code> 默认的 SIGTERM 会让服务端优雅关闭，掩盖问题。',
            '统计成功率时要区分「超时」与「连接被拒」：前者可能是慢，后者是明确不可达，处理策略不同。',
            'hinted handoff 的暂存记录要有 TTL，否则原节点长时间不回来会撑爆内存。'
          ],
          solution: '一个可复现的结论：N=3、W=2 时挂 1 个节点仍可写（另外两个副本成功），挂 2 个则写失败；' +
            'R=2 时挂 1 个仍可读到最新值，因为读集合与写集合仍有交集。把 W 改成 1 后，写入成功率上升但读到旧值的比例明显增加——' +
            '这就是「可用性 vs 一致性」的定量体现。报告里应写明：本系统在分区时偏向可用性（AP），' +
            '通过向量时钟或版本号解决冲突，属于最终一致。'
        }
      ]
    }
  ]);
})();
