/* =====================================================================
 * projects.js · CSC4005 实战项目
 * 结构：{ id, title, en, tagline, level, minutes, chapters, goals, intro,
 *         milestones:[{ n, title, tasks, starter, hints, solution }] }
 * 三个项目由易到难：OpenMP 共享内存 → MPI 分布式 → GPU/CUDA。
 * 全部可在课程服务器（GCC + OpenMPI + CUDA）上完成。
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerProjects([

    /* ================================================================ P1 */
    {
      id: 'P1',
      title: '热传导求解器 HeatWave',
      en: 'HEAT DIFFUSION WITH OPENMP',
      tagline: '用一个 stencil 把「正确性 → 并行 → 向量化 → 剖析」四步走完，最后一条曲线对上 roofline。',
      level: '进阶',
      minutes: 240,
      chapters: ['ch01', 'ch03', 'ch04'],
      goals: [
        '能把串行 Jacobi 迭代写成正确的并行版本，并用解析解或串行结果验证',
        '能用缓存行对齐、分块与向量化把带宽受限的 kernel 推到接近 roofline',
        '能用 perf 找到真正的瓶颈，并写出带环境、规模、配置的扩展曲线'
      ],
      intro: '二维热传导是并行计算里最好的「显微镜」：它足够简单，两小时能写完；又足够真实，' +
        '朴素并行只能拿到 2 倍，优化到位能到 7 倍以上。你会依次撞上伪共享、冗余屏障、缓存不命中与' +
        '向量化失败四个坑——它们分别对应第 3、4 章的知识点。项目最终交付一个可复现的加速比表格，' +
        '并解释「为什么 7.4 倍就是这台机器的上限」。',
      milestones: [
        {
          n: 1,
          title: '串行基线 + 第一次并行（并修好它）',
          tasks: [
            '实现 N×N 网格上的 Jacobi 迭代：每次用上下左右四点平均更新，边界固定为 0，迭代 T 步。',
            '用 -O2 编译，N = 4096、T = 200，记录串行时间作为基线；把结果写进二进制文件，供后续版本逐字节比对。',
            '加 #pragma omp parallel for 并行化内层循环，8 线程运行，记录时间与加速比。',
            '如果加速比低于 3 倍，找出至少两个原因（提示：伪共享、每步两次 barrier、数组边界检查）。',
            '把「并行结果与串行结果最大绝对误差 < 1e-6」写成断言，任何版本都必须通过。'
          ],
          starter: `/* 串行骨架：只需补并行化与验证 */
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <omp.h>

#define N 4096
#define T 200

static double A[N][N], B[N][N];

int main(void) {
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            A[i][j] = (i == 0 || j == 0) ? 1.0 : 0.0;   /* 上/左边界加热 */

    double t0 = omp_get_wtime();
    for (int t = 0; t < T; t++) {
        for (int i = 1; i < N - 1; i++)
            for (int j = 1; j < N - 1; j++)
                B[i][j] = 0.25 * (A[i-1][j] + A[i+1][j] + A[i][j-1] + A[i][j+1]);
        for (int i = 1; i < N - 1; i++)
            for (int j = 1; j < N - 1; j++)
                A[i][j] = B[i][j];                      /* 双缓冲交换 */
    }
    printf("time %.3f s, center %.6f\\n", omp_get_wtime() - t0, A[N/2][N/2]);
    return 0;
}`,
          hints: [
            '先用 1 线程跑一遍带 parallel for 的版本，确认结果与串行完全一致——并行化之前先保证正确。',
            '朴素版本每步有两个循环，若只并行第一个循环、第二个串行，等于每步都多一次全局同步。',
            '数组按行优先存储，内层循环沿 j 连续访问，所以应该并行化外层 i、向量化内层 j，别搞反。'
          ],
          solution: `#pragma omp parallel for schedule(static)
for (int i = 1; i < N - 1; i++)
    for (int j = 1; j < N - 1; j++)
        B[i][j] = 0.25 * (A[i-1][j] + A[i+1][j] + A[i][j-1] + A[i][j+1]);

/* 第二步不要单独开一个 parallel for：把交换合并进同一个并行区，
   或用指针交换 A/B（O(1)），避免整块 memcpy 与额外的 barrier。 */`
        },
        {
          n: 2,
          title: '消除伪共享与冗余同步',
          tasks: [
            '把工作按行块分给线程（每线程一段连续的 i），而不是让线程交错地取行。',
            '检查每个线程写的 B 块是否与别的线程共享缓存行；必要时用 alignas(64) 把块边界对齐。',
            '把「更新」与「交换」合并到一个并行区，保证每步只有一次 barrier。',
            '用 OMP_PROC_BIND=close 绑核，比较绑定前后的时间波动（跑 5 次取中位数）。',
            '记录第二版加速比，并解释相对第一版提升来自哪两个机制。'
          ],
          starter: `/* 行块划分：每线程负责 [r0, r1) 这一段行 */
#pragma omp parallel
{
    int tid = omp_get_thread_num();
    int nt  = omp_get_num_threads();
    int rows = (N - 2 + nt - 1) / nt;
    int r0 = 1 + tid * rows;
    int r1 = r0 + rows; if (r1 > N - 1) r1 = N - 1;

    for (int t = 0; t < T; t++) {
        for (int i = r0; i < r1; i++)
            for (int j = 1; j < N - 1; j++)
                B[i][j] = 0.25 * (A[i-1][j] + A[i+1][j] + A[i][j-1] + A[i][j+1]);
        #pragma omp barrier                   /* 一步一次同步 */
        for (int i = r0; i < r1; i++)
            for (int j = 1; j < N - 1; j++)
                A[i][j] = B[i][j];
        #pragma omp barrier
    }
}`,
          hints: [
            '「交错取行」会让相邻线程写相邻行，而相邻行往往落在同一缓存行，写操作互相使对方失效。',
            '行块划分后，每个线程写的是一整段，块与块之间只共享边界那一行，冲突大幅减少。',
            '若仍慢，检查编译器是否把内层循环向量化了：-fopt-info-vec 会告诉你 missed 的原因。'
          ],
          solution: `/* 关键改动：行块 + 每步一次 barrier + 指针交换代替拷贝 */
static double (*cur)[N] = A, (*nxt)[N] = B;
for (int t = 0; t < T; t++) {
    #pragma omp parallel for schedule(static)
    for (int i = 1; i < N - 1; i++)
        for (int j = 1; j < N - 1; j++)
            nxt[i][j] = 0.25 * (cur[i-1][j] + cur[i+1][j] + cur[i][j-1] + cur[i][j+1]);
    double (*tmp)[N] = cur; cur = nxt; nxt = tmp;   /* O(1) 交换，无拷贝 */
}
/* 注意：parallel for 末尾已有隐式 barrier，无需再加 */`
        },
        {
          n: 3,
          title: '向量化、扩展曲线与 roofline 对照',
          tasks: [
            '用 -O3 -march=native 并检查 -fopt-info-vec-optimized，确认内层循环被向量化。',
            '若有「可能别名」的提示，用 restrict 修饰指针或改成局部指针变量再编译。',
            '测 1/2/4/8 线程的时间，算加速比与效率，画成表；标出效率跌破 80% 的点并解释。',
            '估算该 kernel 的算术强度（每格点 5 次浮点运算、读写多少字节），判断它落在 roofline 的哪一侧。',
            '算理论上界，并与实测最好成绩比较；写一段 200 字的结论，说明「还能不能更快、为什么」。'
          ],
          starter: `# 一次完整的测量：固定绑核、每个配置跑 5 次、取中位数
for t in 1 2 4 8; do
  OMP_NUM_THREADS=$t OMP_PROC_BIND=close OMP_PLACES=cores \\
    ./heat -n 4096 -t 200 2>/dev/null
done

# 检查向量化是否成功
gcc -O3 -march=native -fopt-info-vec-optimized -fopenmp heat.c -o heat 2>&1 | head`,
          hints: [
            '算术强度 = 浮点运算次数 / 访存字节数。每格点读 4 个 double、写 1 个 double = 40 字节，算 5 次操作，强度约 0.125 FLOP/Byte，远在斜坡区。',
            '带宽受限的 kernel，加速比上限接近「核数」，但要打一点折扣（NUMA、边界行、同步）。',
            '如果效率在 4 线程后就崩，先看是不是每线程的行块太小、同步占比变高，而不是盲目加核。'
          ],
          solution: `/* 结论模板（示例数字，按实测替换）
   N=4096, T=200, 8 核：
     1 线程 2.41 s，2 线程 1.26 s（1.91x），4 线程 0.68 s（3.54x），8 线程 0.42 s（5.74x）
   效率：95% / 89% / 72%
   算术强度约 0.125 FLOP/Byte，带宽上界 8x → 实测 5.74x，达 72%
   瓶颈：边界行重复计算、每步一次 barrier、NUMA 远端访存
   下一步：把 T 步分块，让多步迭代在缓存内完成（时间分块），减少 40 字节/格点的搬运 */`
        }
      ]
    },

    /* ================================================================ P2 */
    {
      id: 'P2',
      title: '分布式 π 与词频统计',
      en: 'MPI PARALLEL PI & WORD COUNT',
      tagline: '从梯形法求 π 出发，走完 SPMD、集合通信、非阻塞重叠与扩展性测量。',
      level: '进阶',
      minutes: 180,
      chapters: ['ch02', 'ch05'],
      goals: [
        '能写出正确的 SPMD 程序：所有进程跑同一份代码，用 rank 分工',
        '能区分 Reduce、Allreduce、Bcast、Gather 的语义与代价，选对集合操作',
        '能用非阻塞通信把计算与通信重叠，并用强/弱扩展曲线评价效果'
      ],
      intro: '这个项目有两个任务，难度递增。π 的梯形法规则、易并行，用来把 MPI 的骨架与集合通信练熟；' +
        '词频统计则引入「数据分发 + 结果合并」的真实问题，你会看到 gather 与 allreduce 的差别，' +
        '也会第一次遇到「进程数超过文件块数」的边界情况。最后的扩展性表格是本项目的评分重点。',
      milestones: [
        {
          n: 1,
          title: 'SPMD 骨架与梯形法求 π',
          tasks: [
            '初始化 MPI，取 rank 与 size，只在 rank 0 打印最终结果。',
            '把 [0,1] 区间按 size 等分，每个进程用自己的子区间做梯形法，局部和用 MPI_Reduce 汇总。',
            '运行 mpirun -np 1/2/4/8，与串行结果比较，误差应小于 1e-12。',
            '故意写一个「只有 rank 0 调用 MPI_Reduce」的版本，观察会发生什么（挂起或报错），记录现象。',
            '把局部区间边界打印出来，确认每个进程负责的区间不重叠、并集覆盖 [0,1]。'
          ],
          starter: `#include <math.h>
#include <mpi.h>
#include <stdio.h>

static double f(double x) { return 4.0 / (1.0 + x * x); }

int main(int argc, char **argv) {
    MPI_Init(&argc, &argv);
    int rank, size;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    long n = 100000000L;              /* 梯形总数 */
    double h = 1.0 / n;
    long local_n = n / size;
    double a = rank * local_n * h;

    double local = 0.0;
    for (long i = 0; i < local_n; i++) {
        double x0 = a + i * h, x1 = x0 + h;
        local += 0.5 * (f(x0) + f(x1)) * h;
    }

    double total = 0.0;
    MPI_Reduce(&local, &total, 1, MPI_DOUBLE, MPI_SUM, 0, MPI_COMM_WORLD);

    if (rank == 0) printf("pi = %.15f\\n", total);
    MPI_Finalize();
    return 0;
}`,
          hints: [
            '所有进程都必须调用集合通信，collective 是「全员参与」的约定，只有 root 调用会挂起。',
            'n 不一定被 size 整除：用 n/size 向下取整，把余数交给最后一个进程，否则会丢区间。',
            'π 的结果与进程数无关（加法结合律），所以可以用它验证并行是否正确。'
          ],
          solution: `/* 余数处理，避免丢区间 */
long base = n / size, rem = n % size;
long local_n = base + (rank == size - 1 ? rem : 0);
long start = rank * base;               /* 最后一个进程从 base*(size-1) 开始 */

/* 陷阱版：if (rank == 0) MPI_Reduce(...) —— 非 root 不参与，程序挂起 */
/* 正确版：所有进程都调用 MPI_Reduce，root 参数只决定结果给谁 */`
        },
        {
          n: 2,
          title: '词频统计：分发、合并与非阻塞重叠',
          tasks: [
            'rank 0 读入文本并按行/字节块切分，用 MPI_Scatterv 把不等长的块发给各进程（真实文件很少能整除）。',
            '各进程统计局部词频，用 MPI_Gatherv 把结果汇总到 rank 0；比较 Gatherv 与 Allreduce 的适用场景。',
            '把「分发下一块」与「统计当前块」用 MPI_Isend/Irecv 重叠，测量重叠前后的总时间。',
            '处理两个边界：块边界把一个单词切断（用重叠一字节或按行边界切），以及进程数大于块数。',
            '输出总词数、不同词数、Top-10 与耗时；与串行版本逐项比对。'
          ],
          starter: `/* 分发：用 counts/displs 描述不等长块，Scatterv 只发数据不平均 */
int *counts = NULL, *displs = NULL;   /* 仅 rank 0 有效 */
if (rank == 0) {
    counts = malloc(size * sizeof(int));
    displs = malloc(size * sizeof(int));
    int off = 0;
    for (int r = 0; r < size; r++) {
        counts[r] = (r == size - 1) ? (len - off) : (len / size);
        displs[r] = off;
        off += counts[r];
    }
}
int mine = 0;
MPI_Scatterv(buf, counts, displs, MPI_CHAR,
             local, cap, MPI_CHAR, 0, MPI_COMM_WORLD);
/* Scatterv 会把「我这块有多少字节」写进 recvcount 吗？不会，需要再 Bcast 一次 counts */`,
          hints: [
            'Scatterv 的 recvcount 是「我最多能收多少」，实际收到多少要用 MPI_Get_count 或再广播一次 counts。',
            '块边界切断单词是最常见的 bug：简单做法是让 rank r 的块从前一个换行符之后开始。',
            'Gatherv 需要所有进程都知道各段的 counts，通常由 rank 0 计算后 Bcast 出去。',
            '重叠的关键是「先发下一块，再算当前块」，最后统一 Wait，而不是发完立刻等。'
          ],
          solution: `/* 边界安全的分块：按换行符对齐，每块从行首开始 */
if (rank == 0) {
    int off = 0;
    for (int r = 0; r < size && off < len; r++) {
        int end = (r == size - 1) ? len : off + len / size;
        while (end < len && buf[end] != '\\n') end++;   /* 推到行尾 */
        counts[r] = end - off;
        displs[r] = off;
        off = end;
    }
}
MPI_Bcast(counts, size, MPI_INT, 0, MPI_COMM_WORLD);

/* 重叠骨架 */
MPI_Request req[2];
MPI_Irecv(local, cap, MPI_CHAR, 0, 1, MPI_COMM_WORLD, &req[0]);
MPI_Isend(buf + displs[rank], counts[rank], MPI_CHAR, 0, 2, MPI_COMM_WORLD, &req[1]);
/* ... 统计上一块 ... */
MPI_Waitall(2, req, MPI_STATUSES_IGNORE);`
        },
        {
          n: 3,
          title: '扩展性测量与报告',
          tasks: [
            '在 1/2/4/8 进程下测 π 与词频两个任务的时间，各跑 5 次取中位数。',
            '画强扩展曲线（固定总规模）与弱扩展曲线（固定每进程规模），算出各自的效率。',
            '解释两条曲线形状的差异：为什么强扩展必然下降，而弱扩展可以保持平坦？',
            '找出效率下降的主因（启动开销、通信、负载不均、文件 I/O），给出至少两条改进措施。',
            '写一页报告：环境、规模、命令、表格、结论，并包含一次失败尝试的记录。'
          ],
          starter: `# 强扩展：固定 n，增加进程数
for p in 1 2 4 8; do
  mpirun --allow-run-as-root -np $p ./pi 100000000
done

# 弱扩展：每进程固定 1e7 个梯形，总规模随 p 增长
for p in 1 2 4 8; do
  n=$((p * 10000000))
  mpirun --allow-run-as-root -np $p ./pi $n
done

# 建议同时记录：mpirun 启动开销（空程序跑一次的时间）`,
          hints: [
            '强扩展效率 = T(1)/(p·T(p))；弱扩展效率 = T(1, n)/T(p, p·n)，后者理想值为 1。',
            '进程数少时启动开销占比大，效率曲线前段往往偏低；进程数多时通信与 I/O 占比上升。',
            '词频任务在 8 进程时如果变慢，先看是不是所有人都去读同一个文件——让 rank 0 读、再分发。'
          ],
          solution: `/* 报告结构（一页）
1. 环境：8 核 / 32 GB / GCC 13 / OpenMPI 4.1 / 千兆网络（同机 mpirun）
2. 命令：mpirun -np {1,2,4,8} ./pi 1e8，重复 5 次取中位数
3. 强扩展：1.00 / 1.96 / 3.72 / 6.41 s 的倒数 → 效率 100/98/93/80%
4. 弱扩展：每进程 1e7，时间 0.21 / 0.22 / 0.23 / 0.26 s → 效率 100/95/91/81%
5. 归因：8 进程时归约的 log p 层通信 + 内存带宽争用；改进：用 Allreduce 的递归倍增实现、
   把 I/O 全部集中到 rank 0、让进程绑定到不同 NUMA 节点
6. 失败尝试：试过让每个进程各自读文件，时间反而增加 40%（页缓存争用） */`
        }
      ]
    },

    /* ================================================================ P3 */
    {
      id: 'P3',
      title: 'CUDA 归约与双调排序',
      en: 'CUDA REDUCTION & BITONIC SORT',
      tagline: '从 512 线程的块内归约写到十万级元素的双调排序，用 ncu 把每一个瓶颈看清楚。',
      level: '挑战',
      minutes: 300,
      chapters: ['ch06', 'ch07'],
      goals: [
        '能写出边界安全、合并访存的 CUDA kernel，并用 CPU 结果逐项验证',
        '能用共享内存与 warp shuffle 两级归约，解释 bank 冲突与同步开销',
        '能用 ncu 读懂 achieved occupancy、访存效率与停滞原因，并据此改进'
      ],
      intro: 'GPU 编程的难点不在语法，而在「以 warp 为单位思考」。这个项目先做最经典的归约——' +
        '它短小但把合并访存、共享内存、bank 冲突、warp shuffle、占用率全串了一遍；再做双调排序，' +
        '让你体会「同步次数」如何成为主要成本。最后一个 milestone 要求你用 ncu 的数据证明改动的收益，' +
        '而不是凭感觉说「变快了」。',
      milestones: [
        {
          n: 1,
          title: '正确性优先：向量加与块内归约',
          tasks: [
            '写一个向量加 kernel，用 (N + block - 1) / block 计算 grid，边界线程提前返回。',
            '写块内归约：先用共享内存两两相加，再用 __syncthreads 分阶段同步，输出每个 block 的部分和。',
            '主机端用 rand() 生成数据，跑完后与 CPU 结果比较，要求最大误差 < 1e-5。',
            '故意去掉边界检查，用 N = 1000、block = 256 运行，记录 cuda-memcheck 的报错。',
            '测 N = 1e6 / 1e7 / 1e8 的时间，算有效带宽（GB/s），与显卡标称带宽比较。'
          ],
          starter: `__global__ void vadd(const float *a, const float *b, float *c, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < n) c[i] = a[i] + b[i];        /* 边界检查必须有 */
}

__global__ void reduce_shared(const float *in, float *out, int n) {
    extern __shared__ float s[];           /* 动态共享内存 */
    int tid = threadIdx.x;
    int i = blockIdx.x * blockDim.x + tid;
    s[tid] = (i < n) ? in[i] : 0.0f;
    __syncthreads();

    for (int stride = blockDim.x / 2; stride > 0; stride >>= 1) {
        if (tid < stride) s[tid] += s[tid + stride];
        __syncthreads();                   /* 每轮都要同步 */
    }
    if (tid == 0) out[blockIdx.x] = s[0];
}`,
          hints: [
            'block 大小取 256：既能填满 SM，又不会因寄存器压力降低占用率。',
            '共享内存归约的每轮都要 __syncthreads，轮数是 log2(blockDim)，别漏。',
            '有效带宽 = (读字节 + 写字节) / 时间。向量加读 2 写 1，共 12 字节/元素。'
          ],
          solution: `/* 验证与带宽 */
size_t bytes = (size_t)n * 3 * sizeof(float);
double gbps = bytes / (ms * 1e6);
printf("N=%d time=%.3f ms, %.1f GB/s\\n", n, ms, gbps);
/* 若远低于标称带宽（如 300 vs 900 GB/s），先查访存是否合并、block 是否够多 */`
        },
        {
          n: 2,
          title: '两级归约：共享内存 + warp shuffle',
          tasks: [
            '把块内归约的后 5 轮（stride ≤ 16）改成 __shfl_down_sync，去掉对应的 __syncthreads。',
            '比较改动前后的时间与 ncu 里的 barrier 停滞比例。',
            '分析共享内存版本的 bank 冲突：当 stride 是 32 的倍数时会发生什么？给出一种避免方法。',
            '用原子操作把各 block 的部分和累加到全局变量，比较「原子累加」与「第二段 kernel 再归约」的差异。',
            '把最终结果与 CPU 求和比较，要求相对误差 < 1e-4（float 累加 1e8 个数的正常量级）。'
          ],
          starter: `/* warp 内归约：直接在寄存器间 shuffle，无需共享内存 */
__device__ float warp_reduce(float v) {
    for (int off = 16; off > 0; off >>= 1)
        v += __shfl_down_sync(0xffffffff, v, off);
    return v;
}

__global__ void reduce_two_stage(const float *in, float *out, int n) {
    __shared__ float warps[32];
    int tid = threadIdx.x;
    int i = blockIdx.x * blockDim.x + tid;

    float v = (i < n) ? in[i] : 0.0f;
    v = warp_reduce(v);                        /* 32 线程 → 1 */
    if ((tid & 31) == 0) warps[tid >> 5] = v;  /* 每个 warp 的队长写入 */
    __syncthreads();

    if (tid < 32) {                            /* 第一个 warp 汇总 */
        v = (tid < (blockDim.x >> 5)) ? warps[tid] : 0.0f;
        v = warp_reduce(v);
        if (tid == 0) out[blockIdx.x] = v;
    }
}`,
          hints: [
            'shfl_down_sync 的 mask 必须是参与线程的全 1 掩码，否则行为未定义。',
            '共享内存按 32 个 bank 交织，stride = 32 时所有访问落到同一 bank，形成 32 路冲突。',
            '原子累加 float 到同一地址会在高并发下串行化，通常比第二段 kernel 慢。'
          ],
          solution: `/* bank 冲突的经典解法：让相邻线程访问相邻 bank（stride 取 1..16 时天然错开），
   不要把 stride 写成 32 的倍数；若必须跨大步长，加 padding：s[tid] 改为 s[tid + tid/32] */

/* 原子 vs 两段式：块数多时优先两段式；块数少（< SM 数）时原子更简单 */
__global__ void reduce_atomic(const float *in, float *out, int n) {
    /* ... warp_reduce 之后由队长 atomicAdd(out, v); ... */
}`
        },
        {
          n: 3,
          title: '双调排序与 ncu 剖析',
          tasks: [
            '实现双调排序 kernel：用 i ^ j 找配对元素，(i & k) 决定升序/降序。',
            '当 j 大于 blockDim 时，拆成多次 kernel 启动（每次隐式全局同步），保证跨 block 正确。',
            '对 n = 2^16 与 2^20 测时间，并与 thrust::sort（或 CUB）比较，记录倍数差距。',
            '用 ncu 采集 achieved occupancy、global load/store efficiency、stall 原因三项，解释差距来源。',
            '写结论：双调排序的瓶颈是同步还是访存？给出一个具体的改进方向并验证它。'
          ],
          starter: `__global__ void bitonic(float *v, int n, int k, int j) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i >= n) return;
    int partner = i ^ j;
    if (partner <= i) return;                 /* 每对只处理一次 */

    bool asc = ((i & k) == 0);
    float a = v[i], b = v[partner];
    if (asc ? (a > b) : (a < b)) { v[i] = b; v[partner] = a; }
}

/* 主机端：k 从 2 到 n 倍增；j 从 k/2 减半到 1；
   当 j >= blockDim.x 时每次启动一个 kernel（隐式全局同步）。 */`,
          hints: [
            '每个 (k, j) 组合就是一次 kernel 启动；n = 2^20 时共有 210 次启动，启动开销不可忽略。',
            '把「j < blockDim」的连续几步合并进同一个 kernel，用 __syncthreads 代替全局同步，能显著减少启动次数。',
            'ncu 里若 stall 主要是 barrier，就减少同步；若主要是 long scoreboard，就是访存没合并。'
          ],
          solution: `/* 减少启动次数：把 j 的若干轮打包进一个 kernel */
for (int k = 2; k <= n; k <<= 1) {
    for (int j = k >> 1; j >= 32; j >>= 1)
        bitonic<<<grid, 256>>>(v, n, k, j);      /* 跨 block，必须全局同步 */
    for (int j = 16; j > 0; j >>= 1)
        bitonic_block<<<grid, 256>>>(v, n, k, j); /* 块内，可用 __syncthreads 合并 */
}
/* 结论示例：2^20 时双调 12.4 ms，CUB 1.8 ms；差距主要来自 210 次启动与访存，
   而非比较次数——把 j 打包后降到 7.9 ms，证实同步是主因。 */`
        }
      ]
    }
  ]);
})();
