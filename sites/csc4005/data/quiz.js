/* =====================================================================
 * quiz.js · CSC4005 分章题库
 * 结构：{ items:[{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options?, answer?, accept?, code?, explain }] }
 * 题型：mcq / tf / fill / multi / predict
 * 覆盖：ch00–ch07，每章 7 题，共 56 题
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '2005 年前后，通用处理器的主频停止快速提升，转而增加核数。最直接的技术原因是什么？',
        options: [
          { text: '编译器已经无法再优化单线程代码' },
          { text: 'Dennard 缩放失效，功耗密度随频率上升而失控（功耗墙）', correct: true },
          { text: '程序员的代码里并行循环太多' },
          { text: '内存容量停止增长' }
        ],
        explain: 'Dennard 缩放指晶体管变小后电压与电流同比下降、功耗密度保持不变。到了 90nm 左右漏电流使这条规律失效，继续提频率会让芯片过热，于是厂商转向「同一频率下放更多核」，这就是多核时代的起点。编译器与内存都不是直接原因。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '并行程序只要把线程数从 4 加到 8，加速比就一定翻倍。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '加速比受 Amdahl 定律约束：串行部分与并行开销（同步、通信、负载不均）不会随核数减少。当并行部分只占 90% 时，无限核也只能到 10 倍；8 核时约 4.7 倍。此外还要有足够大的问题规模，否则线程管理开销会吃掉收益。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '用 p 个处理器运行同一程序，单处理器时间 T(1) 与 p 处理器时间 T(p) 之比 T(1)/T(p) 称为 ______。',
        answer: '加速比',
        accept: ['speedup', '加速比（speedup）', '加速倍数'],
        explain: '加速比（speedup）衡量「多花 p 倍资源换来几倍速度」，效率则是加速比除以 p。二者必须与问题规模、线程数一起报告，否则数字没有意义。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '本站八章的组织主线，下面哪条最接近？',
        options: [
          { text: '语法 → 算法 → 数据结构 → 操作系统' },
          { text: '为什么并行（架构与标尺）→ 怎么拆（分解与模式）→ 怎么同步（共享内存）→ 怎么向量化 → 怎么跨机器（MPI）→ 怎么上 GPU → 综合实战', correct: true },
          { text: 'C 语言 → Java → Python → 项目' },
          { text: '历史 → 厂商 → 产品 → 采购' }
        ],
        explain: '课程按「动机 → 分解 → 同步 → 数据并行 → 消息传递 → 加速器 → 综合」递进：先建立性能标尺（ch01），再学拆分问题的语言（ch02），然后依次处理共享内存、向量化、分布式、GPU 四类执行环境，最后用排序与搜索把模型串起来。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['tool'],
        stem: '本课程会用到下面哪些工具？（多选）',
        options: [
          { text: '<code>gcc -fopenmp</code> 编译共享内存程序', correct: true },
          { text: '<code>mpicc / mpirun</code> 编译与运行消息传递程序', correct: true },
          { text: '<code>nvcc</code> 编译 CUDA 程序', correct: true },
          { text: '<code>perf</code> 与 <code>ncu</code> 做性能剖析', correct: true },
          { text: '<code>javac</code> 编译多线程 Java' }
        ],
        explain: '四类执行环境各有一套工具链：OpenMP 用 GCC/Clang 的 -fopenmp，MPI 用 mpicc/mpirun，CUDA 用 nvcc，剖析用 Linux 的 perf 与 NVIDIA 的 ncu/nsys。Java 多线程不在本课程范围内，虽然它们的并发概念相通。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        stem: '下面程序用 OpenMP 归约求和，运行后 <code>s</code> 的值是多少？',
        code: `#include <stdio.h>
#include <omp.h>
int main(void) {
    int s = 0;
    #pragma omp parallel for reduction(+:s)
    for (int i = 0; i < 100; i++) s += i;
    printf("%d\\n", s);
    return 0;
}`,
        answer: '4950',
        accept: ['4950'],
        explain: 'reduction(+:s) 让每个线程先对局部副本累加，最后按加法结合律合并，结果与串行一致。0+1+…+99 = 99×100/2 = 4950。若误写成 shared 而无同步，结果会小于 4950 且每次不同。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-8', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['method'],
        stem: '一份并行实验报告里，下面哪组信息最能让读者复现你的数字？',
        options: [
          { text: '「加速比 6.3，效果很好」' },
          { text: 'CPU 型号与物理核数、问题规模 N、线程数与绑核方式、计时方法与重复次数、串行基线版本、理论上界', correct: true },
          { text: '只写编译器版本和 -O3' },
          { text: '只写最终代码，让读者自己跑' }
        ],
        explain: '性能数字离开上下文就没有意义：同样的 6.3 倍，在 8 核上和在 64 核上评价完全相反。环境、规模、配置、计时、对照、上界六要素缺一不可，这也是本章 checklist 的核心。'
      },

      /* ---------------- ch01 架构与标尺 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '按 Flynn 分类，一台 8 核、每核独立取指执行不同线程的服务器属于哪一类？',
        options: [
          { text: 'SISD' },
          { text: 'SIMD' },
          { text: 'MIMD', correct: true },
          { text: 'MISD' }
        ],
        explain: 'MIMD（多指令流多数据流）指多个处理器各自取自己的指令、处理各自的数据，多核 CPU 与多机集群都是 MIMD。SIMD 是「一条指令同时作用于多个数据」，对应向量单元与 GPU 的 warp 执行；SISD 是单核串行。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'tf', difficulty: 2,
        tags: ['gpu'],
        stem: 'GPU 是严格的 SIMD 机器，同一个 warp 内的 32 个线程在任何情况下都执行完全相同的指令。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'GPU 常被描述为 SIMT（单指令多线程）：硬件以 warp 为单位取指，但允许分支发散——不同线程走不同分支时，两条路径被串行执行，各有一部分线程被屏蔽。所以说「严格 SIMD、绝无发散」是错的，发散正是 GPU 性能损失的主要来源之一。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['model'],
        stem: '某程序 95% 的时间可完美并行、5% 必须串行。按 Amdahl 定律，即使核数趋于无穷，加速比的上限是 ______ 倍。',
        answer: '20',
        accept: ['20', '20倍', '二十'],
        explain: 'S = 1 / (s + (1-s)/p)，令 p→∞ 得 1/s = 1/0.05 = 20。这条上限与实现质量无关，只由串行比例决定，因此「消除串行瓶颈」往往比「增加核数」更值钱。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-1', tier: 2, type: 'multi', difficulty: 2,
        tags: ['arch'],
        stem: '下面哪些技术能提高<b>单线程</b>的 IPC？（多选）',
        options: [
          { text: '超标量发射（一个周期发射多条指令）', correct: true },
          { text: '乱序执行与寄存器重命名', correct: true },
          { text: '同时多线程 SMT（超线程）', correct: true },
          { text: '把核数从 4 增加到 8' },
          { text: '提高主频' }
        ],
        explain: 'IPC 是「每周期完成的指令数」，超标量、乱序、SMT 都是让同一周期塞进更多有效工作：SMT 用另一条线程填满流水线空闲槽。加核提升的是吞吐而非单线程 IPC；提频提升的是周期数而非 IPC，二者相乘才是性能。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-6', tier: 3, type: 'predict', difficulty: 3,
        tags: ['model'],
        stem: '某机器峰值算力 100 GFLOP/s、可持续带宽 20 GB/s。一个 kernel 的算术强度为 2 FLOP/Byte，按 roofline 模型它的可达性能是多少 GFLOP/s？（输出保留整数）',
        code: `double peak = 100.0;   /* GFLOP/s */
double bw   = 20.0;    /* GB/s   */
double ai   = 2.0;     /* FLOP/Byte */
double perf = fmin(peak, bw * ai);
printf("%.0f\\n", perf);`,
        answer: '40',
        accept: ['40', '40.0'],
        explain: '带宽上限 = 带宽 × 算术强度 = 20 × 2 = 40 GFLOP/s，低于峰值 100，所以该 kernel 落在 roofline 的斜坡上，是带宽受限。脊点（ridge point）是 100/20 = 5 FLOP/Byte，只有算术强度超过 5 才可能碰到算力上限。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['arch'],
        stem: '「内存墙（memory wall）」指的是什么？',
        options: [
          { text: '内存容量太小，装不下大数据' },
          { text: '处理器算力的增长速度长期快于内存带宽与延迟的改善，导致访存成为瓶颈', correct: true },
          { text: '内存条价格逐年上涨' },
          { text: '缓存比内存慢' }
        ],
        explain: '几十年里每芯片算力增长约每年 50%+，而 DRAM 带宽与延迟改善慢得多，结果是「每 FLOP 可用的字节数」持续下降，越来越多 kernel 变成带宽受限。这正是 roofline 模型与分块优化的现实背景。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'tf', difficulty: 2,
        tags: ['model'],
        stem: '强扩展（strong scaling）固定总问题规模、增加处理器数；弱扩展（weak scaling）则保持每个处理器上的问题规模不变。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '强扩展看「同一个问题更快多少」，受 Amdahl 限制；弱扩展看「同样时间能算多大问题」，理想情况下时间不变。两者回答的是不同问题，报告里必须说明用的是哪一种，否则效率数字无法比较。'
      },

      /* ---------------- ch02 分解与模式 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['pattern'],
        stem: '把 1000 张图片分给 8 个线程、每个线程处理其中 125 张，属于哪种分解？',
        options: [
          { text: '任务分解（按功能拆）' },
          { text: '数据分解 / 域分解', correct: true },
          { text: '流水线分解' },
          { text: '递归分解' }
        ],
        explain: '每个线程执行相同的操作、只是作用在不同数据子集上，这是数据分解（域分解）。任务分解是把不同功能（如读入、计算、写盘）分给不同线程；流水线分解则让数据依次经过各阶段。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['pattern'],
        stem: '判断一个问题是否属于易并行计算（EPC），最关键的一条标准是？',
        options: [
          { text: '任务数量是否大于核数' },
          { text: '任务之间是否没有数据依赖、且结果合并的开销可以忽略', correct: true },
          { text: '是否使用了 GPU' },
          { text: '单个任务是否能在一个时钟周期内完成' }
        ],
        explain: 'EPC 的本质是「零通信的独立任务 + 便宜的归并」。蒙特卡洛、参数扫描、逐像素处理都是 EPC，几乎线性扩展。任务数少于核数只是并行度不足，与是否 EPC 无关。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'tf', difficulty: 2,
        tags: ['pattern'],
        stem: '粒度越细，并行度越高，所以总性能一定越好。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '粒度变细会提高并行度，但同时抬高调度、同步与通信的次数。当每个任务的工作量接近开销（例如只有几十次运算），总时间反而上升。正确做法是让「每任务工作量 ≫ 开销」，并用 α-β 模型或实测确定拐点。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['model'],
        stem: '在任务依赖图（DAG）中，从入口到出口的最长路径决定程序的最短完成时间，这条路径称为 ______。',
        answer: '关键路径',
        accept: ['critical path', '关键路径（critical path）'],
        explain: '关键路径上的任务必须串行执行，因此它给出时间下界；总工作量除以关键路径长度则是平均可用并行度。DAG 一旦画出，这两个数就能判断「值不值得并行」以及「该往哪里加资源」。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['pattern'],
        stem: '下面哪些手段能缓解负载不均衡？（多选）',
        options: [
          { text: '动态调度：线程做完就取下一个任务', correct: true },
          { text: '工作窃取（work stealing）', correct: true },
          { text: '把任务切得比线程数多很多，让统计波动被摊平', correct: true },
          { text: '把任务数正好设成线程数' },
          { text: '让所有线程忙等同一个自旋锁' }
        ],
        explain: '负载均衡的核心是「让空闲的核有活干」：动态调度、工作窃取、超额划分都属于此。任务数恰好等于线程数时，一旦某个任务偏慢就没有补救余地；自旋锁只会浪费周期，不解决不均衡。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 3, type: 'predict', difficulty: 3,
        tags: ['model'],
        stem: '某 DAG 的总工作量为 48 个单位，关键路径长 12 个单位。它的平均并行度是多少？（保留两位小数）',
        code: `double work = 48.0, cp = 12.0;
printf("%.2f\\n", work / cp);   /* 平均并行度 */`,
        answer: '4.00',
        accept: ['4', '4.00', '4.0'],
        explain: '平均并行度 = 总工作量 / 关键路径 = 48/12 = 4。它表示在关键路径被完全利用时，平均有 4 个任务可同时进行，因此 8 核机器上这个 DAG 最多只能发挥一半的核；要提高并行度必须缩短关键路径。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['method'],
        stem: '拿到一个陌生问题准备并行化，第一步应该做什么？',
        options: [
          { text: '直接套用 OpenMP 的 parallel for' },
          { text: '先找出数据依赖与可并行的结构，再决定分解方式与粒度', correct: true },
          { text: '先买更多核' },
          { text: '先把代码改成多进程' }
        ],
        explain: '分解方式由依赖结构决定：有独立数据块用数据分解，有功能阶段用流水线，有不规则递归用任务分解。先写并行代码再找依赖，通常会撞上数据竞争或被迫串行化，返工成本更高。'
      },

      /* ---------------- ch03 共享内存与同步 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'tf', difficulty: 1,
        tags: ['thread'],
        stem: '同一进程内的 Pthreads 线程共享全局变量与堆，但各自拥有独立的栈与寄存器上下文。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '线程是「共享地址空间的执行流」：全局区、堆、文件描述符共享，栈与寄存器（含程序计数器）私有。这既是线程轻量的原因，也是数据竞争的根源——任何共享可写变量都必须同步。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['thread'],
        stem: '两个线程各执行 <code>counter++</code> 十万次，结果小于二十万。根本原因是什么？',
        options: [
          { text: '编译器把循环优化掉了' },
          { text: '<code>counter++</code> 由「读-改-写」三条指令组成，两个线程的读改写可能交错，丢失更新', correct: true },
          { text: '线程数太少' },
          { text: 'CPU 主频不够' }
        ],
        explain: '自增不是原子操作：读到旧值、加一、写回，中间可能被抢占。两个线程都读到 5，都写回 6，就丢了一次更新。修法是加互斥锁、用原子类型（atomic_int）或改用归约。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['thread'],
        stem: '生产者-消费者模型中，消费者用 <code>while (!ready) pthread_cond_wait(&amp;cond, &amp;mutex);</code> 等待条件成立，其中 <code>pthread_cond_wait</code> 在阻塞前会自动 ______ 互斥锁。',
        answer: '释放',
        accept: ['释放', 'unlock', '解锁', '释放（unlock）'],
        explain: 'pthread_cond_wait 必须「原子地释放锁并睡眠」，否则生产者无法进入临界区修改条件、也就永远不会 signal。被唤醒后它会重新加锁再返回，所以条件必须用 while 而不是 if——虚假唤醒与抢跑都会发生。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-7', tier: 3, type: 'multi', difficulty: 3,
        tags: ['bug'],
        stem: '死锁的四个必要条件包括哪些？（多选）',
        options: [
          { text: '互斥：资源一次只能被一个线程占用', correct: true },
          { text: '持有并等待：占着一个资源再等另一个', correct: true },
          { text: '不可剥夺：不能被强行抢走', correct: true },
          { text: '循环等待：形成等待环', correct: true },
          { text: '伪共享：两个线程写同一缓存行的不同变量' }
        ],
        explain: '四个条件同时成立才可能死锁，破坏任一条即可避免：统一加锁顺序破坏循环等待，trylock 破坏不可剥夺，一次性申请全部资源破坏持有并等待。伪共享是性能问题，不会造成死锁。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        stem: '下面程序用互斥锁保护计数器，4 个线程各加 100000 次。输出的值是多少？',
        code: `static long counter = 0;
static pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;

void *worker(void *arg) {
    for (int i = 0; i < 100000; i++) {
        pthread_mutex_lock(&m);
        counter++;
        pthread_mutex_unlock(&m);
    }
    return NULL;
}
/* main: 创建 4 个线程，join 后 printf("%ld\\n", counter); */`,
        answer: '400000',
        accept: ['400000'],
        explain: '锁把「读-改-写」变成临界区，同一时刻只有一个线程进入，因此不会丢更新，结果必然是 4 × 100000 = 400000。代价是 40 万次加解锁，吞吐远低于用原子操作或每线程局部累加再汇总。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['memory'],
        stem: '无锁栈用 CAS 实现 push 时，如果 CAS 失败通常应该怎么办？',
        options: [
          { text: '直接放弃这次 push' },
          { text: '重新读取栈顶指针，重算新结点，再试一次 CAS（自旋重试）', correct: true },
          { text: '加一把全局互斥锁' },
          { text: '让线程睡眠一秒' }
        ],
        explain: 'CAS（compare-and-swap）只在「当前值仍等于预期值」时写入，失败说明别的线程抢先改了栈顶。正确做法是循环：重读、重算、重试。加锁就退化成阻塞算法，放弃会丢数据，睡眠会浪费 CPU。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['thread'],
        stem: '一个 8 线程程序在每轮迭代末尾调用 <code>pthread_barrier_wait</code>，突然在 4 核机器上变慢很多，最可能的原因是？',
        options: [
          { text: '屏障把线程数限制成了 4' },
          { text: '线程数超过核数，屏障让所有线程互相等待，被换出的线程无法推进，产生调度抖动', correct: true },
          { text: '屏障会自动关闭超线程' },
          { text: '4 核机器不支持多线程' }
        ],
        explain: '屏障要求「全员到齐」，若线程数大于物理核数，部分线程被换出、无法到达屏障，其余线程只能空等，形成「屏障 + 过度订阅」的抖动。修法是让线程数 ≤ 物理核数，或改用任务队列而非固定屏障。'
      },

      /* ---------------- ch04 OpenMP 与 SIMD ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['openmp'],
        stem: 'OpenMP 的 fork-join 模型中，<code>#pragma omp parallel for</code> 循环结束时隐含了什么？',
        options: [
          { text: '没有任何同步，线程各自继续' },
          { text: '一个隐式屏障：所有线程都完成后主线程才继续', correct: true },
          { text: '自动释放所有共享内存' },
          { text: '自动把结果写回磁盘' }
        ],
        explain: 'parallel for 末尾有隐式 barrier（可用 nowait 去掉），保证循环体全部完成后再继续，因此循环后的结果对所有线程可见。代价是每轮都要同步一次，在很短的循环里这个开销可能占主导。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['openmp'],
        stem: '在 <code>parallel for</code> 中，循环下标变量默认是 private 的，而在区域外声明的变量默认是 shared 的。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'OpenMP 的默认规则：循环迭代变量私有，其余变量共享。这解释了为什么把累加变量直接写在循环里会出错（多个线程抢写同一变量），必须用 reduction 或 private + 汇总。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['openmp'],
        stem: '各次迭代耗时差异很大时，应使用 <code>schedule(______)</code>，让线程每完成一块就动态领取下一块。',
        answer: 'dynamic',
        accept: ['dynamic', 'dynamic,1', 'guided'],
        explain: 'static 在编译期把迭代平均分给线程，遇到不规则负载就会有人闲着；dynamic 由运行时按块发放，guided 则块大小递减，二者都能自适应不均。代价是调度开销与可能的缓存局部性下降。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-6', tier: 3, type: 'multi', difficulty: 3,
        tags: ['simd'],
        stem: '下面哪些因素会阻碍编译器自动向量化一个内层循环？（多选）',
        options: [
          { text: '指针可能存在别名，编译器无法证明两段内存不重叠', correct: true },
          { text: '循环迭代之间存在真实数据依赖（后一次读前一次的结果）', correct: true },
          { text: '循环体内调用了无法内联的函数', correct: true },
          { text: '循环次数是编译期常量', correct: false },
          { text: '数组元素是 float 而不是 double' }
        ],
        explain: '向量化要求「各次迭代互不影响、访存连续、无未知调用」。别名（可用 restrict 缓解）、真实依赖、不可内联调用都会打断它。常量次数反而有利（可展开），float 比 double 更容易（寄存器更宽）。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        stem: '下面程序用 OpenMP 归约求平方和，输出是多少？',
        code: `long s = 0;
#pragma omp parallel for reduction(+:s)
for (int i = 1; i <= 100; i++) s += (long)i * i;
printf("%ld\\n", s);`,
        answer: '338350',
        accept: ['338350'],
        explain: '平方和公式 n(n+1)(2n+1)/6，n = 100 时 100×101×201/6 = 338350。reduction 保证结果与串行相加一致（整数加法满足结合律），这也是它能安全并行的原因。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['openmp'],
        stem: '多个线程要累加同一个总和，下面哪种写法通常最快且正确？',
        options: [
          { text: '每次累加都包在 <code>#pragma omp critical</code> 里' },
          { text: '用 <code>reduction(+:sum)</code>，各线程先在寄存器里累加局部副本', correct: true },
          { text: '用 <code>#pragma omp atomic</code> 逐个累加' },
          { text: '用 <code>#pragma omp single</code> 让一个线程算完' }
        ],
        explain: 'reduction 让每个线程在本地寄存器累加，循环结束才合并一次，几乎没有同步开销。critical 与 atomic 都是每次迭代同步一次，在百万级迭代下慢一个数量级；single 则完全放弃了并行。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'tf', difficulty: 2,
        tags: ['optimize'],
        stem: '循环分块（blocking / tiling）通过把大循环拆成小块，让数据在被换出缓存前被多次复用。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '分块把工作集缩小到能装进 L1/L2，使同一份数据在被驱逐前服务多次计算，从而把「带宽受限」变成「算力受限」。分块尺寸要按缓存容量与相联度选，过大过小都会失效。'
      },

      /* ---------------- ch05 MPI ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['mpi'],
        stem: 'MPI 程序采用 SPMD 模型，它的含义是？',
        options: [
          { text: '每个进程编译出不同的可执行文件' },
          { text: '所有进程运行同一个程序，通过 rank 区分角色、处理不同数据', correct: true },
          { text: '只有一个进程真正工作' },
          { text: '进程之间共享内存' }
        ],
        explain: 'SPMD（单程序多数据）是 MPI 的基本形态：同一份二进制被启动 p 次，进程用 MPI_Comm_rank 拿到编号，用 if (rank == 0) 之类的分支承担不同角色。MPI 进程之间不共享地址空间，只能显式收发消息。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['mpi'],
        stem: '阻塞式 <code>MPI_Send</code> 正常返回后，发送缓冲区就可以被安全复用。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '标准模式 Send 返回意味着「数据已被系统接管」（可能已拷入内部缓冲，也可能已被接收），因此调用者可以改写缓冲区。若要确保不占内部缓冲、与接收方严格同步，可用 MPI_Ssend；与之相对，MPI_Isend 返回时缓冲区仍不可改，必须 Wait 之后再动。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'fill', difficulty: 2,
        tags: ['mpi'],
        stem: '把所有进程的数据按同一种操作归约，并把结果发给所有进程的集合通信是 <code>MPI_______</code>。',
        answer: 'Allreduce',
        accept: ['allreduce', 'MPI_Allreduce', 'Allreduce'],
        explain: 'MPI_Reduce 只把结果给 root，MPI_Allreduce 相当于 Reduce + Bcast，结果人人有份。它常被用来做全局求和、求最大值与同步，实现上多采用树形或递归倍增，避免 root 成为瓶颈。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 3, type: 'multi', difficulty: 3,
        tags: ['mpi'],
        stem: '下面哪些做法能避免「所有进程先 Send 再 Recv」造成的死锁？（多选）',
        options: [
          { text: '奇数 rank 先发后收、偶数 rank 先收后发，让通信方向交错', correct: true },
          { text: '使用非阻塞的 MPI_Isend / MPI_Irecv 再统一 Wait', correct: true },
          { text: '使用 MPI_Sendrecv 把收发合并成一次调用', correct: true },
          { text: '在 Send 之前加一个 MPI_Barrier' },
          { text: '把消息拆分得很小，让内部缓冲装得下' }
        ],
        explain: '死锁来自环形等待：人人都在等对方先收。交错方向、非阻塞、Sendrecv 都是破坏「持有并等待」。Barrier 不能解决问题（它同步的是到达屏障，不是消息）；小消息依赖内部缓冲只是碰运气，规模一大就失效。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-6', tier: 3, type: 'predict', difficulty: 3,
        tags: ['mpi'],
        stem: '某程序每轮通信 2 ms、计算 5 ms。若用非阻塞通信把二者完全重叠，相对「先通信再计算」的加速比是多少？（保留一位小数）',
        code: `double comm = 2.0, comp = 5.0;
double serial = comm + comp;
double overlap = comm > comp ? comm : comp;   /* 完全重叠取较大者 */
printf("%.1f\\n", serial / overlap);`,
        answer: '1.4',
        accept: ['1.4', '1.40', '1.400000'],
        explain: '串行 7 ms，重叠后 5 ms，加速比 7/5 = 1.4。收益上限由「慢的那一段」决定：计算若只有 1 ms，重叠通信 2 ms 也救不回来，这时该减少通信量而不是优化重叠。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['mpi'],
        stem: '关于通信域（communicator），下面哪句正确？',
        options: [
          { text: '<code>MPI_COMM_WORLD</code> 包含程序启动的全部进程', correct: true },
          { text: '通信域只是给进程起的名字，不影响能否通信' },
          { text: '每个进程有自己的 MPI_COMM_WORLD，互不相通' },
          { text: '通信域必须在编译期确定' }
        ],
        explain: '通信域定义「谁和谁能通信」以及 rank 的编号空间。MPI_COMM_WORLD 覆盖全部进程；用 MPI_Comm_split 可派生只含部分进程的子通信域，实现按行/按列分组。只有同一通信域内的进程才能互相收发与做集合操作。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'tf', difficulty: 2,
        tags: ['model'],
        stem: '弱扩展效率的算法是：保持每核问题规模不变，比较 p 个进程算 p 倍规模的时间与 1 个进程算 1 倍规模的时间是否接近。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '弱扩展问「算力增加时能不能算更大的问题而不变慢」，理想值是时间持平、效率 100%；强扩展问「同一个问题能否更快」，受 Amdahl 限制必然下降。两类曲线回答不同问题，报告必须标明。'
      },

      /* ---------------- ch06 GPU 与 CUDA ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['gpu'],
        stem: '在 NVIDIA GPU 上，一个 warp 包含多少线程？',
        options: [
          { text: '8' },
          { text: '16' },
          { text: '32', correct: true },
          { text: '256' }
        ],
        explain: 'warp 是 GPU 的基本调度单位，固定为 32 个线程，共享一个程序计数器。若 block 大小不是 32 的倍数，最后一个 warp 会有线程闲置，因此 block 尺寸通常取 128、256 这类 32 的倍数。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'tf', difficulty: 2,
        tags: ['gpu'],
        stem: '同一个 warp 内的线程访问全局内存时，地址越连续，访存效率越高。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'warp 的 32 个访问会被合并成尽可能少的 128 字节事务：连续地址（如 a[threadIdx.x]）只需 1 次事务，而跨步为 32 的访问需要 32 次，可用带宽差 32 倍。这就是「合并访存」为什么是 CUDA 优化的第一课。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'fill', difficulty: 1,
        tags: ['gpu'],
        stem: 'CUDA 中位于每个 SM 片上、被同一 block 的所有线程共享、访问延迟接近寄存器但容量只有几十 KB 的内存是 ______。',
        answer: '共享内存',
        accept: ['shared memory', '共享内存（shared memory）', 'shared'],
        explain: '共享内存（shared memory）由程序员显式管理，用 __shared__ 声明，读写延迟约几十周期（全局内存几百周期），常用于分块复用与 warp 内归约。它的容量有限，且需注意 bank 冲突。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-6', tier: 3, type: 'multi', difficulty: 3,
        tags: ['gpu'],
        stem: '下面哪些做法可能提高 SM 的占用率（occupancy）？（多选）',
        options: [
          { text: '减少每个线程使用的寄存器数量', correct: true },
          { text: '减小每个 block 的共享内存用量', correct: true },
          { text: '把 block 大小调整为 32 的倍数并避开资源上限', correct: true },
          { text: '把 block 大小设为 2048 以提高并行度' },
          { text: '在每个循环里多加 __syncthreads' }
        ],
        explain: '占用率受限于每 SM 的寄存器、共享内存、线程/block 数上限。降低单个线程/block 的资源消耗，就能同时驻留更多 warp。block 上限是 1024 线程，2048 无法启动；多余的同步只会增加停顿，不会提高驻留数。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-2', tier: 2, type: 'predict', difficulty: 2,
        tags: ['gpu'],
        stem: '要处理 N = 1000 个元素，每个 block 256 个线程、每线程处理一个元素。按常见写法启动，grid 里应有多少个 block？',
        code: `int N = 1000, block = 256;
int grid = (N + block - 1) / block;   /* 向上取整 */
printf("%d\\n", grid);`,
        answer: '4',
        accept: ['4'],
        explain: '(1000+255)/256 = 4（向上取整），最后一个 block 只有 232 个有效线程，其余线程必须靠 <code>if (i &lt; N)</code> 提前返回，否则会越界写。凡是「N 不是 block 整数倍」都必须加这个边界检查。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-5', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['gpu'],
        stem: '用 warp shuffle（<code>__shfl_down_sync</code>）做归约，相比共享内存归约的主要优势是？',
        options: [
          { text: '不需要 <code>__syncthreads</code>，直接在寄存器间交换，省去共享内存往返与块内同步', correct: true },
          { text: '可以突破 32 线程的限制' },
          { text: '能自动处理 bank 冲突' },
          { text: '让全局内存带宽翻倍' }
        ],
        explain: 'warp 内线程同步执行，shuffle 直接在寄存器之间搬数据，无需 __shared__ 与 __syncthreads，延迟更低。它只能解决 warp 内（32 个）归约；跨 warp 仍需共享内存或合作组，最后再由一个 warp 汇总。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'tf', difficulty: 2,
        tags: ['gpu'],
        stem: 'ncu 报告里 achieved occupancy 低，就一定说明 kernel 写得有问题、必须提高它。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '占用率只是「能驻留多少 warp」，它服务于延迟隐藏。若 kernel 已经带宽饱和，或每个线程的 ILP 很高，低占用率仍可能达到峰值性能。是否要改，要看它是否与「停滞原因」（如 long scoreboard、barrier）同时出现。'
      },

      /* ---------------- ch07 综合 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['algorithm'],
        stem: '在 GPU 上对百万级浮点数排序，工业库（如 CUB）通常以哪种算法为主？',
        options: [
          { text: '双调排序，因为它是固定比较网络' },
          { text: '基数排序，因为访存规整、O(k·n)，配合前缀和与散射', correct: true },
          { text: '冒泡排序，因为实现简单' },
          { text: '快速排序，因为平均复杂度最低' }
        ],
        explain: '双调排序虽然无分支，但 O(log²n) 轮全局同步代价太高。基数排序只需 k 趟（k 为位数/桶数），每趟是计数、前缀和、散射三步规整操作，在 GPU 上通常快 3–10 倍。快排的递归与不规则分区在 GPU 上反而难做。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['algorithm'],
        stem: '双调排序的比较顺序与输入数据的具体取值无关，因此执行时间是可预测的。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '双调排序是数据无关（data-oblivious）的网络：无论数据如何，都执行相同的 log²n 轮比较交换，没有分支、没有输入相关的访存模式。这让它适合 GPU 与硬件实现，代价是比较次数比快排多。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['algorithm'],
        stem: '并行分桶的通用三步是：统计每个桶的元素数、对计数做前缀和、按前缀和位置把元素 ______ 到桶中。',
        answer: '散射',
        accept: ['scatter', '散射（scatter）', '写入'],
        explain: '计数用原子加、前缀和给出每桶区间、散射按 offset + atomicAdd(cursor) 定位。三步都是规整操作，能把「每个元素邻居数不同」的不规则问题转成可大规模并行的形式。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['method'],
        stem: '性能剖析的正确顺序包含下面哪些步骤？（多选）',
        options: [
          { text: '先测端到端时间与扩展曲线，确认差距有多大', correct: true },
          { text: '用 profiler 找热点函数，看时间占比', correct: true },
          { text: '对热点看硬件计数器（IPC、缓存缺失、访存吞吐）', correct: true },
          { text: '先改代码，改完再看是否变快' },
          { text: '只看最终加速比，不看中间数据' }
        ],
        explain: '由粗到细：端到端 → 函数 → 硬件计数器 → 具体代码行。先改代码是盲改，可能优化了只占 5% 的部分；只看最终数字则无法归因，下次遇到同样问题仍旧不会。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-5', tier: 3, type: 'predict', difficulty: 3,
        tags: ['model'],
        stem: '某 kernel 在 8 核上从 1.0 秒优化到 0.135 秒（约 7.4 倍）。它相对 8 核理想线性的效率是多少百分比？（保留一位小数）',
        code: `double p = 8.0, speedup = 1.0 / 0.135;
printf("%.1f\\n", speedup / p * 100.0);`,
        answer: '92.5',
        accept: ['92.5', '92.6', '92.59'],
        explain: '加速比 7.407，效率 = 7.407/8 = 92.6%（按 7.4 算是 92.5%）。剩下 7% 的差距来自串行部分与同步，用 roofline 判断已接近带宽上限，此时继续调线程数的收益很小，应转向减少数据搬运。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['gpu'],
        stem: '一个数据量只有几千元素、分支复杂的解析函数，应该放在哪里执行？',
        options: [
          { text: 'GPU，因为 GPU 核多' },
          { text: 'CPU，因为规模太小、分支多，启动与搬运开销会盖过并行收益', correct: true },
          { text: 'GPU，因为 GPU 主频高' },
          { text: '必须用 MPI 分发到多台机器' }
        ],
        explain: 'GPU 的优势在大规模、规则、数据并行的计算。几千个元素的分支密集代码，一次 kernel 启动（数微秒）加 PCIe 往返就超过 CPU 直接算的时间，而且分支发散会进一步浪费 warp。判断依据是 roofline 与「计算/搬运比」。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-7', tier: 1, type: 'tf', difficulty: 1,
        tags: ['method'],
        stem: '一份合格的并行实验报告应当记录「试过但没有收益的优化」，因为它能说明瓶颈在哪里。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '失败的尝试同样提供信息：例如「线程加到 16 反而变慢」说明已超出物理核，「向量化无提升」说明本来就带宽受限。能解释「为什么 7.4 倍是上限」的报告，比只报一个漂亮数字的报告更能证明你掌握了模型。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
