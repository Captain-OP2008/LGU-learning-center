/* =====================================================================
 * ch05.js · 第 5 章「消息传递：MPI 与分布式内存」
 * 职责：SPMD 模型、点对点通信、集体通信、死锁、数据分布、非阻塞通信
 *       与分布式内存程序的性能分析。
 * 依据：MPI（Ch.8）与 Distributed Shared Memory Machines 讲义。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch05',
  num: '05',
  title: '消息传递：MPI 与分布式内存',
  en: 'MESSAGE PASSING & MPI',
  goals: [
    '解释 SPMD 模型，写出 MPI 程序的初始化、排名查询与收尾骨架',
    '正确使用阻塞式 send/recv，说明为什么环形传输会死锁以及如何避免',
    '按通信模式选择 bcast、reduce、allreduce、gather、scatter，并估算其成本',
    '用非阻塞通信把计算与通信重叠，说明 wait 与 test 的区别',
    '设计一维/二维数据分布，估算通信量与计算通信比，判断能否扩展',
    '诊断 MPI 程序的常见错误：标签不匹配、死锁、缓冲区复用过早'
  ],
  kp: [
    { id: 'ch05-1', title: 'SPMD 模型与 MPI 程序骨架' },
    { id: 'ch05-2', title: '点对点通信：send、recv 与阻塞语义' },
    { id: 'ch05-3', title: '集体通信：bcast、reduce、allreduce、gather、scatter' },
    { id: 'ch05-4', title: '死锁：环形传输与通信顺序' },
    { id: 'ch05-5', title: '进程排名、通信域与数据分布' },
    { id: 'ch05-6', title: '非阻塞通信与计算通信重叠' },
    { id: 'ch05-7', title: '性能分析：延迟、带宽与扩展效率' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '没有共享内存时，一切都要说清楚', html: '在共享内存里，你把一个指针传给线程，它就看见了数据。在分布式内存里，<b>另一台机器的地址在你这里毫无意义</b>——你必须明确说出：发给谁、发多少、什么类型、用什么标签、对方如何接收。这种「显式」带来了两个后果：错误更容易发生（标签写错、缓冲区大小不匹配、忘记收尾），但性能也更可预测（你清楚每一次通信的字节数与次数）。MPI 是这门课乃至整个超算领域的通用语言，全球 Top500 机器上的并行程序大多建立在它之上。' },

    { t: 'p', lead: true, html: '本章从 SPMD 模型出发，先写通一个最小的 MPI 程序，再依次讲点对点、集体通信、死锁避免、数据分布与非阻塞通信。贯穿全章的一条主线是 ch02 的 α-β 模型：<b>每一次通信都有固定延迟 α 与随字节数增长的传输时间</b>，MPI 的所有技巧——合并消息、树形归约、重叠通信——都是在和这两个量打交道。' },

    { t: 'h', lvl: 2, text: '一、SPMD 模型与 MPI 程序骨架', id: 'ch05-1' },

    { t: 'p', html: 'MPI 程序采用 <b>SPMD（Single Program, Multiple Data）</b>模型：你写<b>一份</b>程序，启动 <code>mpirun -np 8 ./a.out</code> 后系统产生 8 个独立进程，每个进程执行同一份代码，靠 <code>MPI_Comm_rank</code> 得到的编号决定自己处理哪部分数据。注意「独立进程」——它们不共享地址空间，甚至可能在不同机器上。' },

    { t: 'p', html: '每个 MPI 程序都有固定的四段：<code>MPI_Init</code> 初始化环境、查询 <code>MPI_Comm_size</code> 与 <code>MPI_Comm_rank</code>、完成计算与通信、<code>MPI_Finalize</code> 收尾。漏掉 <code>MPI_Finalize</code> 不会立刻崩溃，但可能让 <code>mpirun</code> 挂住等待；在 <code>MPI_Init</code> 之前调用其它 MPI 函数则是未定义行为。' },

    { t: 'code', lang: 'c', caption: '最小 MPI 程序：每个进程报告自己的编号，并做一次全局求和', code: `#include <mpi.h>
#include <stdio.h>

int main(int argc, char **argv) {
    MPI_Init(&argc, &argv);                    /* 必须在任何 MPI 调用之前 */

    int rank, size;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);      /* 我是谁：0 .. size-1 */
    MPI_Comm_size(MPI_COMM_WORLD, &size);      /* 一共多少个进程 */

    /* 每个进程贡献自己的编号，所有进程都拿到总和 */
    int mine = rank, total = 0;
    MPI_Allreduce(&mine, &total, 1, MPI_INT, MPI_SUM, MPI_COMM_WORLD);

    printf("rank %d / %d: total = %d\\n", rank, size, total);

    MPI_Finalize();                            /* 释放 MPI 内部资源 */
    return 0;
}` },

    { t: 'p', html: '编译用 <code>mpicc -O2 hello.c -o hello</code>，运行用 <code>mpirun -np 4 ./hello</code>。输出顺序不保证，因为 4 个进程独立调度——<b>不要依赖打印顺序做同步</b>，这是初学阶段最常见的误解。若在集群上运行，还需要一个 hostfile 或由调度器（Slurm/PBS）分配节点。' },

    { t: 'h', lvl: 2, text: '二、点对点通信：send、recv 与阻塞语义', id: 'ch05-2' },

    { t: 'p', html: '点对点通信是 MPI 的基本操作：<code>MPI_Send(buf, count, dtype, dest, tag, comm)</code> 把数据发出去，<code>MPI_Recv(buf, count, dtype, src, tag, comm, &status)</code> 接收。<b>标签（tag）是应用层的分流机制</b>：同一个发送者可以发多条消息，接收者用标签区分「这是边界数据」还是「这是结果」。发送与接收的 count/dtype/tag 必须匹配，否则会挂住或截断。' },

    { t: 'p', html: '「阻塞」的语义常被误解。<code>MPI_Send</code> 返回不代表对方收到了，只代表<b>发送缓冲区可以被安全复用</b>。对小消息，MPI 通常采用 <b>eager 协议</b>：直接拷进内部缓冲就返回；对大消息用 <b>rendezvous 协议</b>：要等对方开始接收才返回。<code>MPI_Recv</code> 则是真阻塞，直到数据到达并拷入你的缓冲区。' },

    { t: 'table', head: ['操作', '返回时保证什么', '风险'], rows: [
      ['MPI_Send（标准）', '发送缓冲区可复用（小消息可能已拷贝）', '大消息时可能阻塞等待接收方'],
      ['MPI_Ssend（同步）', '对方已开始接收', '更容易死锁，但语义清晰'],
      ['MPI_Bsend（缓冲）', '数据已拷入用户提供的缓冲', '要自己管理缓冲区大小'],
      ['MPI_Recv', '数据已写入接收缓冲区', '永不匹配则永久阻塞'],
      ['MPI_Isend / MPI_Irecv', '立即返回，稍后用 Wait/Test 确认', '忘记 Wait 会泄漏请求对象']
    ], caption: 'eager 与 rendezvous 的切换阈值由实现决定（通常几十 KB），不要依赖具体数值' },

    { t: 'p', html: '一个必须遵守的规则：<b>发送缓冲区在 Send 返回前不能改，接收缓冲区在 Recv 返回前不能读</b>。这条规则在非阻塞通信里更严格——<code>MPI_Isend</code> 返回后缓冲区仍在使用，直到 <code>MPI_Wait</code> 确认完成。很多「结果偶尔错」的 MPI bug，都是因为提前复用了缓冲区。' },

    { t: 'quiz', qid: 'ch05-q1' },

    { t: 'h', lvl: 2, text: '三、集体通信：bcast、reduce、allreduce、gather、scatter', id: 'ch05-3' },

    { t: 'p', html: '集体通信（collective communication）让一组进程一起完成一次数据交换。它们必须被<b>通信域内所有进程</b>调用，参数（count、dtype、root）要一致，否则行为未定义——常见症状是程序挂住。<b>不要用点对点循环手写集体通信</b>：库里的实现用了树形、环形等算法，比「根进程循环发 N 次」快一个数量级。' },

    { t: 'table', head: ['函数', '语义', '参与进程', '典型复杂度'], rows: [
      ['MPI_Bcast', '根进程的数据发给所有进程', '全部', 'O(log p) 轮（树形）'],
      ['MPI_Reduce', '所有进程的数据归约到根进程', '全部', 'O(log p) 轮'],
      ['MPI_Allreduce', '归约结果发给所有进程', '全部', 'O(log p) 轮，通信量约为 Reduce 的 2 倍'],
      ['MPI_Gather', '各进程的数据收集到根进程', '全部', '根进程接收 O(p·n) 数据'],
      ['MPI_Scatter', '根进程把数据分发给各进程', '全部', '与 Gather 相反'],
      ['MPI_Alltoall', '每个进程给每个进程发一段', '全部', 'O(p) 轮，通信量 O(p·n)'],
      ['MPI_Barrier', '同步，不传数据', '全部', '一次往返延迟']
    ], caption: '选择原则：能 Reduce 就不要 Allreduce，能 Gather 就不要 Alltoall' },

    { t: 'p', html: '算一笔账说明「别手写」。8 个进程做广播，根进程循环发 7 次，每次延迟 α，总时间约 7α；树形广播只需 3 轮（1→2, 2→4, 4→8），总时间约 3α，而且每轮的带宽被 4 条链路分摊。<b>进程数越多，差距越大：1024 个进程时是 1023α 对 10α。</b>同理，Allreduce 的环形算法只需 2(p−1) 步、每步传输 n/p 数据，是超算上最常见的实现。' },

    { t: 'p', html: '一个常见错误是把 Allreduce 用在「只有根进程需要结果」的场景。Allreduce 要把结果发给每个进程，通信量是 Reduce 的两倍以上；正确做法是 Reduce 到 rank 0，再由 rank 0 广播（或干脆只让 rank 0 输出）。另一个错误是在循环里反复 Reduce：<b>能合并的归约要合并</b>——100 次 Reduce 的延迟是 100α，合并成一次大 Reduce 可能只要几 α 加上一点带宽。' },

    { t: 'h', lvl: 2, text: '四、死锁：环形传输与通信顺序', id: 'ch05-4' },

    { t: 'p', html: '最经典的 MPI 死锁是<b>环形传输</b>：每个进程先 <code>MPI_Send</code> 给右邻居，再 <code>MPI_Recv</code> 从左邻居收。小消息时 eager 协议让它「碰巧能跑」，一旦消息超过 eager 阈值（比如每个进程发 1 MB），所有 Send 都在等对方 Recv，所有 Recv 都在等 Send 完成，程序永久挂住。<b>更糟的是它在大规模下才复现</b>，本地 4 进程测试一切正常。' },

    { t: 'p', html: '三种修法各有取舍。<b>调换顺序</b>：偶数号进程先发后收、奇数号先收后发，打破循环等待，简单但只对环形结构有效。<b>用非阻塞通信</b>：先 <code>MPI_Irecv</code> 再 <code>MPI_Isend</code>，最后统一 Wait，这是最通用的写法。<b>用 <code>MPI_Sendrecv</code></b>：库保证不会死锁，适合成对交换，一行搞定。' },

    { t: 'code', lang: 'c', caption: '环形交换的三种写法：不安全、调换顺序、Sendrecv（推荐）', code: `#include <mpi.h>

void ring_unsafe(int rank, int size, double *out, double *in) {
    int left  = (rank - 1 + size) % size;
    int right = (rank + 1) % size;
    MPI_Send(out, 1024, MPI_DOUBLE, right, 0, MPI_COMM_WORLD);   /* 大消息会死锁 */
    MPI_Recv(in, 1024, MPI_DOUBLE, left, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
}

void ring_safe(int rank, int size, double *out, double *in) {
    int left  = (rank - 1 + size) % size;
    int right = (rank + 1) % size;
    if (rank % 2 == 0) {                       /* 偶数先发后收 */
        MPI_Send(out, 1024, MPI_DOUBLE, right, 0, MPI_COMM_WORLD);
        MPI_Recv(in, 1024, MPI_DOUBLE, left, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
    } else {                                   /* 奇数先收后发 */
        MPI_Recv(in, 1024, MPI_DOUBLE, left, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        MPI_Send(out, 1024, MPI_DOUBLE, right, 0, MPI_COMM_WORLD);
    }
}

void ring_best(int rank, int size, double *out, double *in) {
    int left  = (rank - 1 + size) % size;
    int right = (rank + 1) % size;
    MPI_Sendrecv(out, 1024, MPI_DOUBLE, right, 0,
                 in,  1024, MPI_DOUBLE, left,  0,
                 MPI_COMM_WORLD, MPI_STATUS_IGNORE);   /* 库内部保证不死锁 */
}` },

    { t: 'p', html: '除了死锁，还有一类「假死锁」来自<b>标签或类型不匹配</b>：接收方等 tag=1，发送方发的 tag=0，于是 Recv 永远等不到。这类问题用 <code>MPI_Comm_set_errhandler</code> 也未必报错，最好的办法是<b>用常量定义标签</b>、并在测试时用 <code>mpirun -np 2</code> 先跑通再扩规模。还有一类是「部分进程提前退出」——MPI 没有天然的容错，一个进程死掉整个作业通常就挂了。' },

    { t: 'quiz', qid: 'ch05-q2' },

    { t: 'h', lvl: 2, text: '五、进程排名、通信域与数据分布', id: 'ch05-5' },

    { t: 'p', html: '<b>通信域（communicator）</b>定义「谁和谁能通信」。<code>MPI_COMM_WORLD</code> 包含所有进程；用 <code>MPI_Comm_split</code> 可以按颜色切成若干子域，让每行进程单独归约（二维分解时非常有用）。<b>排名（rank）是通信域内的局部编号</b>，同一个进程在不同子域里排名不同——这是很多坐标计算出错的原因。' },

    { t: 'p', html: '数据分布决定了通信量，是设计 MPI 程序时最重要的决定。<b>一维块分布</b>：把 N 个元素切成 p 段，每进程负责连续一段，边界交换只需与左右邻居通信，通信量 O(1) 条消息。<b>二维块分布</b>：把 N×N 矩阵切成 p 个方块，每个进程与上下左右四个邻居通信，边界数据量 O(N/√p)，适合矩阵乘与 stencil。<b>循环分布</b>（round-robin）：按 i mod p 分配，负载更均匀但通信模式差。' },

    { t: 'p', html: '以二维 stencil 为例算通信量：N×N 网格、p 个进程排成 √p×√p，每步每个进程要交换 4 条长度为 N/√p 的边界。<b>计算量是 O(N²/p)，通信量是 O(N/√p)</b>，计算通信比随 N/√p 增长——所以问题规模越大、进程越多，stencil 越容易扩展。反过来，若网格只有 64×64 而进程有 256 个，每个进程只分到 4×4 个格点，通信量超过计算量，加速比会惨不忍睹。' },

    { t: 'table', head: ['分布方式', '每进程数据', '通信邻居', '每步通信量', '适用'], rows: [
      ['一维块', 'N/p 个连续元素', '2 个（左右）', 'O(1) 条消息', '一维数组、向量运算'],
      ['二维块', 'N²/p 的方块', '4 个（上下左右）', 'O(N/√p)', '矩阵乘、二维 stencil'],
      ['循环（cyclic）', 'N/p 个间隔元素', '全部（alltoall）', 'O(N)', '负载不均、转置'],
      ['副本（replicated）', '完整 N', '0', '0，但内存 p 倍', '小规模只读数据']
    ], caption: '「块分布 + 边界交换」是绝大多数科学计算程序的选择' },

    { t: 'h', lvl: 2, text: '六、非阻塞通信与计算通信重叠', id: 'ch05-6' },

    { t: 'p', html: '阻塞通信的问题是「等」。发出去要等对方收、收要等对方发，这段时间 CPU 闲着。<b>非阻塞通信</b>把「发起」与「完成」分开：<code>MPI_Isend</code>/<code>MPI_Irecv</code> 立即返回一个请求（request），你可以继续算别的东西，最后用 <code>MPI_Wait</code>（阻塞到完成）或 <code>MPI_Test</code>（非阻塞查询）确认。' },

    { t: 'p', html: '典型用法是<b>边界交换与内部计算重叠</b>：先 <code>Irecv</code> 收邻居边界、<code>Isend</code> 发自己的边界，然后计算内部区域（不依赖边界的那部分），最后 <code>Waitall</code> 再算边界。若内部区域够大，通信时间被完全藏住，<b>扩展性可能提升 20%–40%</b>。这个技巧在 stencil、矩阵乘、粒子模拟里都是标配。' },

    { t: 'code', lang: 'c', caption: '非阻塞边界交换：先发起通信，算内部区域，最后等待并算边界', code: `#include <mpi.h>

void step(int rank, int size, int n, double *grid, double *halo) {
    int left  = (rank - 1 + size) % size;
    int right = (rank + 1) % size;
    MPI_Request req[4];

    /* 1) 先发起：收左右边界，发自己的边界（此时不阻塞） */
    MPI_Irecv(halo,          n, MPI_DOUBLE, left,  0, MPI_COMM_WORLD, &req[0]);
    MPI_Irecv(halo + n,      n, MPI_DOUBLE, right, 1, MPI_COMM_WORLD, &req[1]);
    MPI_Isend(grid,          n, MPI_DOUBLE, left,  1, MPI_COMM_WORLD, &req[2]);
    MPI_Isend(grid + n - n,  n, MPI_DOUBLE, right, 0, MPI_COMM_WORLD, &req[3]);

    /* 2) 计算不依赖边界的内部区域，把通信时间藏起来 */
    for (int i = 2; i < n - 2; ++i)
        grid[i] = 0.5 * grid[i] + 0.25 * (grid[i - 1] + grid[i + 1]);

    /* 3) 通信完成后再算边界格点 */
    MPI_Waitall(4, req, MPI_STATUSES_IGNORE);
    for (int i = 1; i < n - 1; ++i)
        if (i == 1 || i == n - 2)
            grid[i] = 0.5 * grid[i] + 0.25 * (halo[i - 1] + halo[i + 1]);
}` },

    { t: 'p', html: '使用非阻塞通信有三条纪律。<b>一，请求数组要够大且每个请求都要 Wait/Test 到完成</b>，否则泄漏内部缓冲。<b>二，Wait 之前不要碰发送缓冲区</b>——<code>Isend</code> 返回时数据可能还没发出去。<b>三，不要发起过多未完成请求</b>：每个请求都有开销，几万个同时挂起会让 MPI 内部队列爆掉，通常控制在几十到几百个。' },

    { t: 'h', lvl: 2, text: '七、性能分析：延迟、带宽与扩展效率', id: 'ch05-7' },

    { t: 'p', html: 'MPI 程序的性能分析依旧是 α-β：<b>T = α + n/β</b>。典型的 InfiniBand 集群上 α 约 1–2 μs、β 约 10–25 GB/s（单端口），跨机架的 α 更大。这意味着「发 8 字节」和「发 4 KB」的时间几乎一样，都是 1–2 μs——<b>所以合并小消息永远是最有效的优化</b>。用 <code>MPI_Wtime</code> 测一次 ping-pong 就能标定你所在集群的 α 与 β。' },

    { t: 'table', head: ['现象', '可能原因', '验证方法'], rows: [
      ['加进程不变快', '通信占比高、问题规模太小', '测计算与通信时间比，画强扩展曲线'],
      ['进程越多越慢', '集体通信的 O(log p) 变成 O(p)，或 alltoall 爆炸', '用 MPI 工具（如 mpiP）统计各函数耗时占比'],
      ['大规模才挂住', '死锁（环形、标签不匹配、集体通信不同步）', '小规模先跑通，再用 -np 逐步放大并加超时'],
      ['性能抖动大', '负载不均 + 共享网络争用', '固定进程绑核，重复多次取中位数']
    ], caption: '先分清「算得慢」还是「等得久」：通信时间占比超过 30% 就该改结构了' },

    { t: 'p', html: '最后是扩展性的判断标准。用 ch01 的公式：<b>强扩展</b>看固定 N 时 S(p) 是否接近 p，<b>弱扩展</b>看每进程工作量固定时 T(p) 是否持平。MPI 程序在弱扩展上通常表现更好，因为通信量随 p 增长得比计算量慢（stencil 是 O(N/√p) 对 O(N²/p)）。如果强扩展在 p = 32 就只剩 50% 效率，而弱扩展到 p = 256 还接近 90%，那说明代码结构没问题，只是「问题规模不够大」——这是超算作业必须扩规模才能跑出好看数字的根本原因。' },

    { t: 'quiz', qid: 'ch05-q3' },

    { t: 'terms', items: [
      { en: 'SPMD', zh: '单程序多数据', html: '一份代码由多个独立进程执行，靠 rank 区分各自处理的数据。' },
      { en: 'communicator', zh: '通信域', html: '定义可互相通信的进程集合，MPI_COMM_WORLD 包含全部进程。' },
      { en: 'eager / rendezvous', zh: '急切 / 握手协议', html: '小消息直接拷贝返回，大消息需等待接收方就绪，由实现按阈值切换。' },
      { en: 'collective', zh: '集体通信', html: '通信域内所有进程共同参与的数据交换，如 Bcast、Reduce、Allreduce。' },
      { en: 'non-blocking', zh: '非阻塞通信', html: '发起后立即返回请求对象，用 Wait/Test 确认完成，可与计算重叠。' },
      { en: 'halo exchange', zh: '边界交换', html: '相邻进程互换边界层数据，是 stencil 类程序每步必做的通信。' },
      { en: 'MPI_Wtime', zh: 'MPI 墙钟计时', html: '返回秒级浮点时间的可移植计时函数，用于测量通信与计算耗时。' }
    ] },

    { t: 'keypoint', items: [
      { title: 'SPMD：一份代码，多个独立进程', html: '靠 rank 决定分工，靠 Init/Finalize 划定生命周期，进程间不共享地址空间。' },
      { title: '阻塞 Send 只保证缓冲区可复用', html: '大消息可能等接收方；环形传输因此死锁，用 Sendrecv 或非阻塞避免。' },
      { title: '集体通信用库实现，不要手写', html: '广播 1024 进程时树形 10 轮 vs 循环 1023 轮。' },
      { title: '数据分布决定通信量', html: '一维块 O(1) 条消息，二维块 O(N/√p) 数据，循环分布最差。' },
      { title: '非阻塞通信藏住延迟', html: '先 Irecv/Isend，算内部区域，最后 Waitall，可提升 20%–40% 扩展性。' }
    ] },

    { t: 'checklist', id: 'ch05', items: [
      '我能写出带 Init/Finalize 的 MPI 程序，并说明 SPMD 与共享内存线程的区别',
      '我能解释阻塞 Send 返回时到底保证了什么，以及 eager 与 rendezvous 的差异',
      '我能写出环形交换的三种写法，并说明为什么第一种会在大消息时死锁',
      '我能按场景选择 Bcast/Reduce/Allreduce/Gather/Scatter，并说出各自复杂度',
      '我能估算 1024 进程广播时树形与循环实现的延迟差距',
      '我能设计一维块分布与二维块分布，并算出每步的通信量',
      '我能用 Isend/Irecv + Waitall 把通信与计算重叠，并说出三条使用纪律',
      '我知道怎样用 MPI_Wtime 标定集群的 α 与 β',
      '我能区分「算得慢」与「等得久」，并说出通信占比超过多少该改结构'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 MPI（Ch.8）与 Distributed Shared Memory Machines 两份讲义组织：SPMD 骨架、点对点与集体通信来自 MPI 讲义，数据分布与 stencil 边界交换参考了分布式共享内存与并行算法部分。文中 α ≈ 1–2 μs、β ≈ 10–25 GB/s 为 InfiniBand 集群的典型量级，具体取决于网络与 MPI 实现（OpenMPI/MPICH/Intel MPI），实验请用 ping-pong 自行标定。MPI-3 的远程内存访问（RMA/one-sided）与 MPI-4 的持久请求不在本课要求内；GPU 感知的 MPI（CUDA-aware MPI）只作为扩展提及。分布式共享内存（DSM）的软件实现思路在讲义中有讨论，本章未展开，因为现代集群基本用消息传递而非软件 DSM。' }
  ]
});
