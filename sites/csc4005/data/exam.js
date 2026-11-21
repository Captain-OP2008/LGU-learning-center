/* =====================================================================
 * exam.js · CSC4005 模拟卷 A
 * 范围：ch00–ch07（体系结构与性能标尺 / 分解与模式 / 共享内存同步 /
 *       OpenMP 与 SIMD / MPI / GPU 与 CUDA / 排序搜索与剖析）
 * 规格：12 题、满分 100、限时 120 分钟
 * 题型：choice / tf / fill / output / keywords
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerExam({
    id: 'CSC4005-A',
    title: '并行计算 模拟卷 A',
    style: '期末风格',
    subtitle: 'CSC4005 · 覆盖 ch00–ch07 的综合模拟',
    date: '2026-11-21',
    minutes: 120,
    totalScore: 100,
    summary: '本卷覆盖八章全部内容：并行化的动机与体系结构、性能标尺（Amdahl、roofline）、' +
      '分解与并行模式、共享内存与同步、OpenMP 与 SIMD 向量化、MPI 消息传递、GPU 与 CUDA、' +
      '并行排序搜索与性能剖析。卷面 12 题：选择 3 题共 32 分、判断 2 题共 16 分、' +
      '填空 2 题共 17 分、计算与读代码 3 题共 23 分、简答 2 题共 12 分。建议闭卷限时完成，' +
      '计算类题目务必写出公式与中间值，只写结果不给分。',
    instructions: [
      '时间 120 分钟，满分 100 分。计时开始后不会暂停，刷新页面也按真实时间计算。',
      '题型：单项选择 3 题、判断 2 题、填空 2 题、计算与读代码 3 题、简答 2 题。',
      '计算题必须写出所用公式（Amdahl、roofline、效率、加速比）与代入过程，只给数字按半分计。',
      '读代码题假设 8 个物理核、GCC 13、-O2；OpenMP 使用默认调度，除非题面另行说明。',
      '简答题按关键词命中给分，答出要点即可；代码题只需写关键片段，但 API 与参数必须完整。'
    ],
    questions: [

      /* ---------------------------------------------------------- Q1 */
      { no: 1, points: 12, type: 'single choice',
        intro: '本题考察性能模型：Amdahl 定律与 roofline 的用法。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '某程序 80% 的时间可并行、20% 必须串行。用 16 核运行，加速比约为多少？',
            options: [
              { text: '4.0', correct: true },
              { text: '5.0' },
              { text: '16.0' },
              { text: '1.25' }
            ],
            explain: 'S = 1 / (0.2 + 0.8/16) = 1 / 0.25 = 4.0。注意上限是 1/0.2 = 5 倍，16 核已经几乎吃满；再加核也到不了 5 倍。若算出 16 倍，说明忽略了串行部分。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: 'roofline 模型中，一个算术强度为 1 FLOP/Byte 的 kernel 落在斜坡上。要提速，最该做的是：',
            options: [
              { text: '减少数据搬运、提高复用（分块），把算术强度推高', correct: true },
              { text: '把线程数翻倍' },
              { text: '把 double 全部改成 int' },
              { text: '改用更多 MPI 进程' }
            ],
            explain: '斜坡区受带宽限制，性能 = 带宽 × 算术强度。加线程只会更快撞上带宽墙；减少搬运（分块、融合循环、降低精度）才能把工作点推过脊点。这是「先算法后并行」的典型场景。' },
          { label: '(c)', points: 4, kind: 'choice',
            prompt: '强扩展（strong scaling）与弱扩展（weak scaling）的区别是：',
            options: [
              { text: '强扩展固定总规模、增加处理器；弱扩展固定每处理器规模、让总规模随处理器增长', correct: true },
              { text: '强扩展用 GPU，弱扩展用 CPU' },
              { text: '强扩展只测时间，弱扩展只测内存' },
              { text: '两者只是叫法不同，测法一样' }
            ],
            explain: '强扩展回答「同一个问题能不能更快」，受 Amdahl 约束；弱扩展回答「算力涨了能不能算更大的问题而不变慢」。报告里必须标明是哪种，否则效率数字无法横向比较。' }
        ] },

      /* ---------------------------------------------------------- Q2 */
      { no: 2, points: 12, type: 'single choice',
        intro: '本题考察共享内存与同步的细节。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '两个线程分别写 <code>struct { long a; long b; }</code> 中相邻的两个字段，程序正确但很慢。最可能的原因是：',
            options: [
              { text: '伪共享：两个字段落在同一缓存行，写操作让缓存行在核间反复弹跳', correct: true },
              { text: '数据竞争：写入结果会丢', correct: false },
              { text: '死锁：两线程互相等待' },
              { text: '内存泄漏：缓存行未释放' }
            ],
            explain: '缓存一致性以缓存行为单位（通常 64 字节），两个核各写同一行的不同字节仍会触发所有权转移，性能可下降数倍。修法是用 alignas(64) 把字段分开，或让每个线程写独立的行块。程序结果正确，所以不是数据竞争。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '下面哪种做法<b>不能</b>消除「所有进程先 Send 再 Recv」造成的死锁？',
            options: [
              { text: '在 Send 之前插入 MPI_Barrier', correct: true },
              { text: '奇数 rank 先发后收，偶数 rank 先收后发' },
              { text: '改用 MPI_Isend / MPI_Irecv 再统一 Wait' },
              { text: '改用 MPI_Sendrecv 一次完成收发' }
            ],
            explain: 'Barrier 只保证大家「同时到达」，不能保证「有人已在接收」；屏障之后所有进程仍然同时 Send，环形等待依旧。破坏死锁要么打破循环等待（交错方向），要么打破持有并等待（非阻塞或 Sendrecv）。' },
          { label: '(c)', points: 4, kind: 'choice',
            prompt: 'OpenMP 中把 <code>sum += a[i]</code> 写在 <code>parallel for</code> 里而不加 reduction，会发生什么？',
            options: [
              { text: '结果通常小于正确值，因为多线程的读-改-写互相覆盖', correct: true },
              { text: '编译器自动加锁，结果正确' },
              { text: '编译报错' },
              { text: '结果偏大，因为重复累加' }
            ],
            explain: '区域外声明的变量默认 shared，自增不是原子操作，更新会丢失，结果偏小而且每次运行不同。修法：reduction(+:sum)，或 private 局部累加后 critical 合并。编译器不会替你加锁，也不会报错。' }
        ] },

      /* ---------------------------------------------------------- Q3 */
      { no: 3, points: 8, type: 'true / false',
        intro: '判断下列陈述的真假。',
        parts: [
          { label: '(a)', points: 4, kind: 'tf',
            prompt: 'GPU 的 warp 内线程可以走不同分支，但两条路径会被串行执行，各有一部分线程被屏蔽。',
            options: [
              { text: '正确', correct: true },
              { text: '错误' }
            ],
            explain: '这正是 SIMT 与严格 SIMD 的差别：硬件以 warp 为单位取指，遇分支发散时分路径串行化，用掩码屏蔽不参与的线程。发散越严重，有效并行度越低，所以 GPU 代码要尽量避免 warp 内分支。' },
          { label: '(b)', points: 4, kind: 'tf',
            prompt: '一个 kernel 的算术强度高于 roofline 脊点，说明它受算力限制；此时增加带宽不会提升性能。',
            options: [
              { text: '正确', correct: true },
              { text: '错误' }
            ],
            explain: '脊点右侧是算力平台区，性能被峰值 FLOP/s 卡住，带宽再高也用不上。此时该做的是减少运算量、提高向量化效率或用更快的算法，而不是继续优化访存。' }
        ] },

      /* ---------------------------------------------------------- Q4 */
      { no: 4, points: 9, type: 'fill in the blank',
        intro: '填写术语或数值。',
        parts: [
          { label: '(a)', points: 3, kind: 'fill',
            prompt: '用 p 个处理器时，T(1)/T(p) 称为 ______，它除以 p 称为 ______。',
            answer: '加速比；效率',
            explain: '加速比（speedup）衡量「多花资源换来几倍速度」，效率（efficiency）= 加速比 / p 衡量资源利用程度。二者必须与问题规模、线程数一起报告才有意义。' },
          { label: '(b)', points: 3, kind: 'fill',
            prompt: 'OpenMP 中让各次迭代按「做完就领下一块」动态分配的调度子句是 <code>schedule(______)</code>。',
            answer: 'dynamic',
            explain: 'static 在编译期均分，适合规则负载且缓存友好；dynamic 由运行时发放，适合不规则负载；guided 是两者的折中，块大小递减。动态调度有开销，块太小时开销会盖过收益。' },
          { label: '(c)', points: 3, kind: 'fill',
            prompt: 'CUDA 中同一 block 内所有线程可见、位于 SM 片上、需用 <code>__syncthreads()</code> 保护的内存是 ______。',
            answer: '共享内存',
            explain: '共享内存（shared memory）用 __shared__ 声明，延迟远低于全局内存，常用于分块复用与块内归约。容量有限（几十 KB/SM），且不同线程访问同一 bank 的不同地址会产生 bank 冲突。' }
        ] },

      /* ---------------------------------------------------------- Q5 */
      { no: 5, points: 8, type: 'code output',
        intro: '写出下面程序的标准输出。',
        parts: [
          { label: '(a)', points: 4, kind: 'output',
            prompt: '下面 OpenMP 程序的输出是什么？（一行一个值）',
            code: `long s = 0;
#pragma omp parallel for reduction(+:s)
for (int i = 1; i <= 1000; i++) s += i;
printf("%ld\\n", s);`,
            answer: '500500',
            explain: '等差数列求和 1000×1001/2 = 500500。reduction 让每个线程在本地累加，再按加法结合律合并，结果与串行一致；整数加法满足结合律是它能安全并行的前提。' },
          { label: '(b)', points: 4, kind: 'output',
            prompt: 'N = 4096，block 大小 256，每线程处理一个元素。按 <code>(N + block - 1) / block</code> 启动，grid 是多少个 block？',
            code: `int N = 4096, block = 256;
int grid = (N + block - 1) / block;
printf("%d\\n", grid);`,
            answer: '16',
            explain: '(4096+255)/256 = 16，且恰好整除，没有边界空闲线程。若 N = 4000 则得 16 个 block、最后一个 block 只有 160 个有效线程，必须加 <code>if (i &lt; N) return;</code>。' }
        ] },

      /* ---------------------------------------------------------- Q6 */
      { no: 6, points: 9, type: 'code output',
        intro: '按给定参数计算并写出结果。',
        parts: [
          { label: '(a)', points: 3, kind: 'output',
            prompt: '每轮通信 3 ms、计算 7 ms，用非阻塞通信完全重叠。相对「先通信再计算」，加速比是多少？（保留两位小数）',
            answer: '1.43',
            explain: '串行 10 ms，重叠后 7 ms，10/7 ≈ 1.43。上限由较慢的一段决定；若计算只有 1 ms，重叠也救不回来，此时应减少通信量而不是优化重叠。' },
          { label: '(b)', points: 3, kind: 'output',
            prompt: '某 DAG 总工作量 96、关键路径 24。平均并行度是多少？（保留整数）',
            answer: '4',
            explain: '96/24 = 4。它表示关键路径被完全利用时平均只有 4 个任务可并行，8 核机器上最多发挥一半资源；要提高必须先缩短关键路径。' },
          { label: '(c)', points: 3, kind: 'output',
            prompt: '某 kernel 在 16 核上取得 12.8 倍加速比，效率是多少百分比？（保留一位小数）',
            answer: '80.0',
            explain: '12.8/16 = 80%。效率低于 0.6 通常说明并行开销过大（同步、通信、负载不均）；80% 属于可接受范围，剩余差距应结合 roofline 判断是带宽还是同步造成。' }
        ] },

      /* ---------------------------------------------------------- Q7 */
      { no: 7, points: 8, type: 'true / false',
        intro: '判断下列关于内存与并发的陈述。',
        parts: [
          { label: '(a)', points: 4, kind: 'tf',
            prompt: 'x86 的 TSO 内存模型允许 Store 后 Load 重排，因此 Dekker 式互斥需要内存屏障或原子操作。',
            options: [
              { text: '正确', correct: true },
              { text: '错误' }
            ],
            explain: 'TSO 只保证 StoreLoad 之外的大部分顺序；两个线程各自「先写标志再读对方标志」时，读可能先于自己的写被观察到，导致都进临界区。用 seq_cst 原子或 mfence 才能排除这种重排。' },
          { label: '(b)', points: 4, kind: 'tf',
            prompt: '用 <code>static</code> 局部数组给每个线程做私有累加，不需要任何锁也不会产生数据竞争。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '函数内的 static 变量是全局唯一的，所有线程共享同一份，反而更容易竞争。线程私有应使用 OpenMP 的 private 变量、栈上数组，或 thread_local（C11 的 _Thread_local）。' }
        ] },

      /* ---------------------------------------------------------- Q8 */
      { no: 8, points: 8, type: 'single choice',
        intro: '本题考察 MPI 集合通信与程序结构。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '要把每个进程的局部和汇总成全局和，并让<b>所有</b>进程都拿到结果，应该用：',
            options: [
              { text: 'MPI_Allreduce', correct: true },
              { text: 'MPI_Reduce' },
              { text: 'MPI_Bcast' },
              { text: 'MPI_Gather' }
            ],
            explain: 'Allreduce = Reduce + Bcast，结果人人有份；Reduce 只给 root；Bcast 是「一份发给大家」；Gather 是把数据收集到 root 但不做运算。选错会导致非 root 进程拿到未初始化值。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: 'MPI 程序里用 <code>MPI_Comm_rank</code> 得到的 rank，其作用是：',
            options: [
              { text: '在本通信域内唯一标识进程，用来决定它处理哪份数据', correct: true },
              { text: '表示进程所在物理机的编号' },
              { text: '等于进程的 PID' },
              { text: '由用户在命令行任意指定，与 MPI 无关' }
            ],
            explain: 'rank 是通信域内的逻辑编号（0..p-1），是 SPMD 分工的依据：按 rank 切分数据、决定谁是 root。它不等于 PID，也不保证与物理位置对应（除非用 MPI_Comm_split_type 按节点分组）。' }
        ] },

      /* ---------------------------------------------------------- Q9 */
      { no: 9, points: 8, type: 'fill in the blank',
        intro: '填写术语。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '双调排序的轮次复杂度是 O(______)，它的比较顺序与数据无关，因此适合 GPU。',
            answer: 'log²n',
            explain: '外层 k 倍增 log n 次、内层 j 减半 log k 次，合计 O(log²n) 轮，总比较 O(n log²n)。真正的成本往往不是比较而是每轮的全局同步。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '把空间划分成网格、为每个格子建桶，从而把邻居查询从 O(n²) 降到局部搜索的技术叫 ______。',
            answer: '空间哈希',
            explain: '空间哈希（spatial hashing）用「计数-前缀和-填充」三步建桶，每个粒子只查相邻 3×3 格。它是「不规则 → 规整」转换的典型，收益是数量级的，远大于单纯并行化。' }
        ] },

      /* ---------------------------------------------------------- Q10 */
      { no: 10, points: 6, type: 'code output',
        intro: '读代码，写出结果。',
        parts: [
          { label: '(a)', points: 3, kind: 'output',
            prompt: '下面程序的输出是什么？',
            code: `int a[8] = {1,2,3,4,5,6,7,8};
int s = 0;
#pragma omp parallel for schedule(static) reduction(+:s)
for (int i = 0; i < 8; i++) s += a[i];
printf("%d\\n", s);`,
            answer: '36',
            explain: '1+2+…+8 = 36。schedule(static) 只影响谁算哪些迭代，不影响归约结果的正确性；reduction 保证各线程的局部和最终合并。' },
          { label: '(b)', points: 3, kind: 'output',
            prompt: '按 Amdahl 定律，串行比例 10%、核数 8，加速比是多少？（保留两位小数）',
            code: `double s = 0.10, p = 8.0;
printf("%.2f\\n", 1.0 / (s + (1.0 - s) / p));`,
            answer: '4.71',
            explain: '1/(0.1 + 0.9/8) = 1/0.2125 ≈ 4.71。上界 1/0.1 = 10，8 核只拿到 4.71，说明串行部分是主要瓶颈；把串行 10% 降到 5%，同样 8 核可到 5.93。' }
        ] },

      /* ---------------------------------------------------------- Q11 */
      { no: 11, points: 6, type: 'short answer',
        intro: '简答，按关键词给分。',
        parts: [
          { label: '(a)', points: 3, kind: 'keywords',
            prompt: '什么是伪共享（false sharing）？它对性能有什么影响，如何消除？',
            answer: '多个线程写同一缓存行中的不同变量；缓存行在核间反复失效与转移（cache line ping-pong），导致大量一致性流量与停顿；用 alignas(64) 填充、每线程独立行块或局部累加后合并消除。',
            explain: '关键词：同一缓存行 / 不同变量 / 缓存行弹跳 / 一致性流量 / alignas 或填充 / 局部累加。它不影响正确性，只影响性能，因此编译器不会报错，只能靠剖析发现。' },
          { label: '(b)', points: 3, kind: 'keywords',
            prompt: '写出 roofline 模型的两个上界，并说明「脊点」的含义。',
            answer: '带宽上界 = 可持续带宽 × 算术强度；算力上界 = 峰值 FLOP/s；实际性能取两者较小值；脊点是两条线的交点，算术强度等于峰值算力/带宽，其右侧受算力限制、左侧受带宽限制。',
            explain: '关键词：带宽×算术强度 / 峰值算力 / 取较小值 / 交点 / 左侧带宽受限 / 右侧算力受限。用它可快速判断「该优化访存还是优化计算」。' }
        ] },

      /* ---------------------------------------------------------- Q12 */
      { no: 12, points: 6, type: 'short answer',
        intro: '综合设计题。',
        parts: [
          { label: '(a)', points: 3, kind: 'keywords',
            prompt: '一个 stencil kernel 在 8 核上只加速 2.1 倍。给出你的排查顺序（至少三步）。',
            answer: '先测端到端与扩展曲线确认差距；用 profiler 找热点函数；看硬件计数器（IPC、缓存缺失、带宽）判断是带宽、同步还是负载不均；再针对性改（消除伪共享、分块、向量化、绑核）。',
            explain: '关键词：端到端计时 / 热点 / 硬件计数器 / 判断瓶颈类型 / 针对性修改。切忌先改代码，否则可能优化了只占 5% 的部分。' },
          { label: '(b)', points: 3, kind: 'keywords',
            prompt: '什么情况下应该把一段计算放到 GPU，什么情况下应留在 CPU？各举一个判据。',
            answer: '放 GPU：数据并行度高、算术强度中等以上、分支少、数据量大，如稠密矩阵乘、卷积；留 CPU：规模小、分支密集、串行依赖强、需要低延迟，如解析与小规模图遍历；还要比较搬运与启动开销。',
            explain: '关键词：数据并行 / 算术强度 / 分支发散 / 规模与启动开销 / 搬运成本。判断核心是「计算/搬运比」，小 kernel 上 GPU 常因启动与 PCIe 往返而更慢。' }
        ] }
    ]
  });
})();
