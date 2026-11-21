/* =====================================================================
 * ch06.js · 第 6 章「GPU 与 CUDA：十万线程的调度与访存」
 * 职责：GPU 架构（SM/warp/占用率）、CUDA 编程模型、内存层次、合并访存、
 *       bank 冲突、同步与归约、分支发散、ncu 剖析。
 * 依据：GPU and CUDA Programming（Ch.9–11）、Automatic Horizontal Fusion for
 *       GPU Kernels、OpenACC 与 Triton、Tutorial 10（flash attention MAC）。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch06',
  num: '06',
  title: 'GPU 与 CUDA：十万线程的调度与访存',
  en: 'GPU & CUDA PROGRAMMING',
  goals: [
    '描述 GPU 的 SM / warp / 线程层次，解释为什么它靠海量线程而不是高主频取胜',
    '写出完整的 CUDA 程序：分配显存、启动 kernel、拷回结果、检查错误',
    '按访问模式区分合并访存与跨步访存，说明共享内存如何消除 bank 冲突',
    '用 __syncthreads 与 warp shuffle 实现高效归约，并解释树形结构的作用',
    '判断分支发散与占用率的取舍，说明寄存器与共享内存如何限制并发块数',
    '用 ncu 的关键指标（占用率、访存吞吐、stall 原因）定位 kernel 瓶颈'
  ],
  kp: [
    { id: 'ch06-1', title: 'GPU 架构：SM、warp 与占用率' },
    { id: 'ch06-2', title: 'CUDA 编程模型：grid、block 与 kernel 启动' },
    { id: 'ch06-3', title: '内存层次：寄存器、共享内存、全局内存' },
    { id: 'ch06-4', title: '合并访存与 bank 冲突' },
    { id: 'ch06-5', title: '同步与归约：__syncthreads 与 warp shuffle' },
    { id: 'ch06-6', title: '分支发散、占用率与延迟隐藏' },
    { id: 'ch06-7', title: '性能剖析：ncu 指标与 roofline 对照' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: 'GPU 不是「更快的 CPU」', html: '很多人第一次写 CUDA 会失望：把 CPU 上的循环改成 kernel，结果只快了两倍，甚至更慢。原因是 GPU 的设计目标完全不同——它把绝大部分晶体管用在<b>并行执行单元</b>上，只留很少的缓存与控制逻辑，因此单线程性能很弱（一个线程可能比 CPU 慢 10 倍），但能同时跑几十万个线程。这意味着：<b>GPU 代码的快慢几乎完全取决于「访存是否合并」与「有没有足够线程隐藏延迟」</b>，而不是算法本身有多精巧。这一章就讲这两件事。' },

    { t: 'p', lead: true, html: '本章先从硬件结构讲起（SM、warp、占用率），再进入 CUDA 的编程模型与内存层次，然后用归约与矩阵乘两个例子把「合并访存、共享内存、同步」串起来。<b>贯穿全章的问题是：一个线程要等 400 个周期才能从全局内存拿到数据，GPU 靠什么把这 400 个周期填满？</b>答案就是「同时有足够多的 warp 在跑」，而这个数字由占用率决定。' },

    { t: 'h', lvl: 2, text: '一、GPU 架构：SM、warp 与占用率', id: 'ch06-1' },

    { t: 'p', html: '一块 GPU 由若干 <b>SM（streaming multiprocessor，流式多处理器）</b>组成，每个 SM 里有几十到上百个 CUDA 核心、一个寄存器文件、一块可配置的共享内存/L1，以及若干 <b>warp 调度器</b>。A100 有 108 个 SM，每个 SM 最多驻留 2048 个线程；H100 有 132 个 SM。这些数字决定了「一块卡能同时跑多少线程」。' },

    { t: 'p', html: '线程以 <b>warp（32 个线程）</b>为单位调度：warp 内 32 个线程执行同一条指令，只是数据不同——这就是 <b>SIMT（single instruction, multiple threads）</b>。SM 的调度器每次从就绪的 warp 里挑一个发射指令，所以<b>只要还有 warp 能跑，延迟就被隐藏了</b>。这就是 GPU 不需要大缓存的原因：它用线程数换延迟容忍度。' },

    { t: 'p', html: '<b>占用率（occupancy）</b>是「实际驻留的 warp 数 ÷ 硬件允许的最大 warp 数」。它受三个因素限制：每线程寄存器数、每 block 共享内存、每 block 线程数。举例：一个 SM 有 65536 个寄存器，若每个线程用 64 个寄存器，则最多 1024 个线程（50% 占用率）；若每个线程用 32 个，就能到 2048（100%）。<b>占用率不是越高越好</b>——为了降寄存器而把变量反复塞回内存，可能反而更慢。' },

    { t: 'table', head: ['资源', '典型容量（每 SM）', '限制了什么', '调优手段'], rows: [
      ['寄存器', '65536 个 32 位寄存器', '每线程寄存器数 × 线程数', '减少局部变量、避免大数组、用 __launch_bounds__'],
      ['共享内存', '48–228 KB（随架构）', '每 block 的共享内存 × 块数', '减小 tile、改用 warp shuffle'],
      ['线程槽', '2048 个线程（64 warp）', '每 block 线程数 × 块数', 'block 取 128–512，避免过小或过大'],
      ['block 槽', '32 个 block', 'block 数上限', 'block 太小会被这个上限卡住']
    ], caption: '占用率 = min(寄存器限制, 共享内存限制, 线程限制) ÷ 最大值' },

    { t: 'h', lvl: 2, text: '二、CUDA 编程模型：grid、block 与 kernel 启动', id: 'ch06-2' },

    { t: 'p', html: 'CUDA 把线程组织成三层：<b>grid → block → thread</b>。一个 kernel 启动时指定 grid 有多少 block、每个 block 多少线程；每个线程用 <code>blockIdx.x</code>、<code>threadIdx.x</code>、<code>blockDim.x</code> 算出自己的全局编号。习惯上把 block 大小取为 32 的倍数（128、256、512），因为 warp 是 32，不是整数倍会浪费最后一个 warp 的 lane。' },

    { t: 'p', html: '主机代码负责分配显存（<code>cudaMalloc</code>）、拷贝数据（<code>cudaMemcpy</code>）、启动 kernel（<code>kernel&lt;&lt;&lt;grid, block&gt;&gt;&gt;(args)</code>）、拷回结果。kernel 启动是<b>异步</b>的：CPU 发起后立刻返回，直到需要结果时才同步（<code>cudaDeviceSynchronize</code> 或 <code>cudaMemcpy</code> 隐式同步）。这既是性能来源（CPU 可以继续准备下一批数据），也是错误来源（改了主机缓冲区却发现 GPU 还在读）。' },

    { t: 'code', lang: 'cuda', caption: '完整 CUDA 程序：向量加法，含错误检查与尺寸计算', code: `#include <cuda_runtime.h>
#include <stdio.h>

__global__ void vec_add(const float *a, const float *b, float *c, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;   /* 全局线程编号 */
    if (i < n) c[i] = a[i] + b[i];                   /* 边界检查：n 未必整除 */
}

#define CK(call) do { \\
    cudaError_t e = (call); \\
    if (e != cudaSuccess) { \\
        printf("CUDA error %s at line %d\\n", cudaGetErrorString(e), __LINE__); \\
        return 1; \\
    } \\
} while (0)

int main(void) {
    const int n = 1 << 20;                 /* 约 100 万个元素 */
    size_t bytes = n * sizeof(float);
    float *ha = (float *)malloc(bytes), *hb = (float *)malloc(bytes);
    float *hc = (float *)malloc(bytes);
    for (int i = 0; i < n; ++i) { ha[i] = 1.0f; hb[i] = 2.0f; }

    float *da, *db, *dc;
    CK(cudaMalloc(&da, bytes));            /* 显存分配 */
    CK(cudaMalloc(&db, bytes));
    CK(cudaMalloc(&dc, bytes));
    CK(cudaMemcpy(da, ha, bytes, cudaMemcpyHostToDevice));

    int threads = 256;
    int blocks  = (n + threads - 1) / threads;   /* 向上取整 */
    vec_add<<<blocks, threads>>>(da, db, dc, n); /* 异步启动 */

    CK(cudaGetLastError());                /* 捕获启动参数错误 */
    CK(cudaMemcpy(hc, dc, bytes, cudaMemcpyDeviceToHost));  /* 隐式同步 */
    printf("c[0] = %.1f\\n", hc[0]);
    cudaFree(da); cudaFree(db); cudaFree(dc);
    return 0;
}` },

    { t: 'p', html: '这段代码里 <code>n = 2²⁰</code>、256 线程/block，所以是 4096 个 block、约 100 万个线程——远多于 GPU 能同时驻留的数量（A100 约 108×2048 ≈ 22 万）。多出来的 block 排队等待，由硬件调度器在 SM 空出资源时派发。<b>这就是「十万线程」的真实含义：不是同时执行，而是同时驻留一批、其余排队</b>，程序员不需要管理这个队列。' },

    { t: 'quiz', qid: 'ch06-q1' },

    { t: 'h', lvl: 2, text: '三、内存层次：寄存器、共享内存、全局内存', id: 'ch06-3' },

    { t: 'p', html: 'CUDA 的内存层次是性能的核心。最上面是<b>寄存器</b>（每线程私有，访问约 1 个周期），往下是<b>共享内存（shared memory）</b>（每 block 共享，约 20–30 个周期），再往下是 L1/L2 缓存，最底层是<b>全局内存（global memory）</b>（约 400–800 个周期）。一个 kernel 的性能，八成取决于「有多少数据从全局内存搬了、搬得整不整齐」。' },

    { t: 'table', head: ['内存空间', '作用域', '生命周期', '典型延迟', '用途'], rows: [
      ['寄存器', '线程私有', '线程', '约 1 周期', '局部变量、循环计数器'],
      ['共享内存 __shared__', 'block 内共享', 'block', '约 20–30 周期', 'tile 缓存、归约中间结果'],
      ['全局内存', '所有线程', '应用', '约 400–800 周期', '输入输出、大数组'],
      ['常量内存 __constant__', '所有线程，只读', '应用', '广播时约 1 周期', '卷积核、配置参数'],
      ['局部内存', '线程私有', '线程', '等同全局（可能被缓存）', '寄存器溢出、大数组'],
      ['纹理内存', '所有线程，只读', '应用', '有缓存', '二维空间局部性访问']
    ], caption: '寄存器溢出到 local memory 是性能杀手：编译时加 -Xptxas -v 看用了多少寄存器' },

    { t: 'p', html: '共享内存的价值在于<b>把重复访问变成一次全局读 + 多次共享读</b>。矩阵乘是最典型的例子：朴素实现里每个线程算 C 的一个元素，要读 A 的一整行和 B 的一整列，B 的每个元素被读了 N 次；<b>分块实现让一个 block 协作把 32×32 的 A、B 块读进共享内存，之后的 32×32 次乘加都从共享内存取数，全局访存量降为 1/32</b>——这正是 ch04 的「分块」在 GPU 上的版本，只是这里的缓存由程序员手动管理。' },

    { t: 'p', html: '一个 32×32 的 float tile 占 4 KB，两个就是 8 KB。A100 每 SM 有 164 KB 共享内存可配置，所以理论上能放很多块——但每 block 的共享内存越多，能同时驻留的 block 越少，占用率下降。<b>分块大小是在「数据复用」与「占用率」之间取平衡</b>，不是越大越好。' },

    { t: 'h', lvl: 2, text: '四、合并访存与 bank 冲突', id: 'ch06-4' },

    { t: 'p', html: '<b>合并访存（coalesced access）</b>是 GPU 性能的第一原则：一个 warp 的 32 个线程访问<b>连续的</b> 32 个 4 字节元素时，硬件把它们合并成一次 128 字节的事务；如果访问的地址跨步（每个线程隔 32 个元素取一个），就会变成 32 次独立事务，<b>带宽利用率掉到 1/32</b>。' },

    { t: 'code', lang: 'cuda', caption: '同一个 warp：连续访问合并成 1 次事务，跨步访问拆成 32 次', code: `__global__ void stride_bad(const float *in, float *out, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    /* 每个线程隔 32 个元素取一个：warp 内地址跨度 128 字节 × 32 */
    out[i] = in[i * 32];
}

__global__ void coalesced_good(const float *in, float *out, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    /* warp 内 32 个线程访问连续 32 个元素 → 一次 128B 事务 */
    out[i] = in[i];
}

/* 结构体数组 AoS 改成数组结构体 SoA，也是为了让同一字段连续存放 */
struct AoS { float x, y, z; };          /* 跨步访问：x 与 x 之间隔 12 字节 */
struct SoA { float *x, *y, *z; };       /* 各字段连续：可合并 */` },

    { t: 'p', html: '共享内存有自己的「合并」问题，叫 <b>bank 冲突（bank conflict）</b>。共享内存被分成 32 个 bank，每个 bank 每周期服务一个 4 字节字；如果同一个 warp 的 32 个线程访问<b>不同 bank</b>，一次完成；如果多个线程访问<b>同一 bank 的不同地址</b>，就要串行化，最坏 32 倍慢。' },

    { t: 'p', html: '经典场景是按列访问二维共享数组 <code>s[32][32]</code>：同一列的元素地址相差 32 个 float，正好落在同一个 bank。<b>修法是加一列填充，声明成 <code>s[32][33]</code></b>，让列方向的地址偏移一个元素，错开 bank。代价是多用 128 字节共享内存，收益是消除 32 路冲突。' },

    { t: 'p', html: '还有一种「广播」是免费的：如果一个 warp 的所有线程读<b>同一个地址</b>，硬件会广播，不产生冲突。所以「所有线程读同一个系数」不需要优化，「32 个线程读同一列的 32 个不同元素」才需要。这个区别在第 32 路和 33 路填充的对比里体现得很清楚。' },

    { t: 'h', lvl: 2, text: '五、同步与归约：__syncthreads 与 warp shuffle', id: 'ch06-5' },

    { t: 'p', html: '<code>__syncthreads()</code> 是 block 内的屏障：所有线程到达后才继续。它保证共享内存的写对 block 内所有线程可见。三条纪律：<b>不能放在分支里让部分线程跳过</b>（会挂住或未定义），<b>不能跨 block 同步</b>（block 之间只能用全局内存 + 多次 kernel 启动），<b>不要滥用</b>（每次都有开销，且会打断延迟隐藏）。' },

    { t: 'code', lang: 'cuda', caption: 'block 内归约：共享内存树形对折 + warp shuffle 收尾', code: `__global__ void reduce_sum(const float *in, float *out, int n) {
    __shared__ float s[256];
    int tid = threadIdx.x;
    int i   = blockIdx.x * blockDim.x + tid;
    s[tid]  = (i < n) ? in[i] : 0.0f;
    __syncthreads();                       /* 等所有线程写完共享内存 */

    /* 树形对折：步长 128 → 64 → ... → 1，共 log2(256) = 8 轮 */
    for (int stride = blockDim.x / 2; stride > 0; stride >>= 1) {
        if (tid < stride) s[tid] += s[tid + stride];
        __syncthreads();                   /* 每轮都要同步，否则读到旧值 */
    }

    if (tid == 0) out[blockIdx.x] = s[0];
}

/* 更快：前 5 轮用 warp shuffle，省掉 5 次 __syncthreads */
__device__ float warp_reduce(float v) {
    for (int off = 16; off > 0; off >>= 1)
        v += __shfl_down_sync(0xffffffff, v, off);   /* 寄存器内交换，无需共享内存 */
    return v;
}` },

    { t: 'p', html: '为什么树形？<b>朴素累加需要 255 次串行加法、255 次同步；树形只需 8 轮，每轮一次同步</b>。这又是 ch02 的 reduce 模式：深度从 O(n) 降到 O(log n)。而 warp shuffle 更进一步——同一 warp 内的 32 个线程可以直接交换寄存器，<b>不需要共享内存、不需要 __syncthreads</b>，所以高性能归约都是「block 内先 shuffle 降到 32 个、再写共享内存、再一次同步、最后 shuffle」的混合结构。' },

    { t: 'quiz', qid: 'ch06-q2' },

    { t: 'h', lvl: 2, text: '六、分支发散、占用率与延迟隐藏', id: 'ch06-6' },

    { t: 'p', html: '<b>分支发散（branch divergence）</b>：warp 内 32 个线程如果走不同分支，硬件只能把两条路径都执行一遍，用掩码关掉不参与的 lane。<b>最坏情况是一个 warp 串行执行 32 条路径，吞吐掉到 1/32</b>。所以 GPU 代码要尽量避免「以线程为单位的 if」，改成「以 warp 为单位」或用无分支写法。' },

    { t: 'p', html: '一个具体例子：处理三角形网格时按 <code>if (i &lt; j)</code> 决定是否计算。相邻线程的 i、j 往往交错，导致 warp 内一半走 then、一半走 else，两条路径都执行。改成「把所有满足条件的任务压缩成一个列表，再按列表下标并行」（流压缩，ch02 的 scan），就能消除发散——代价是多一趟压缩。' },

    { t: 'p', html: '占用率与延迟隐藏的关系可以量化。<b>全局内存延迟约 400 周期，一条指令发射间隔约 4 周期</b>，所以每个 SM 需要约 100 个可发射的 warp 才能把延迟填满。若一个 SM 最多 64 个 warp（2048 线程），则需要在 50% 以上占用率时才有较好的隐藏效果——这解释了「为什么占用率低到 25% 时性能常常腰斩」。但若 kernel 是计算密集型（如大矩阵乘），算术指令本身就多，对占用率的要求可以低一些。' },

    { t: 'compare', left: { title: '延迟受限（latency-bound）', html: '访存多、算术少，如逐元素操作、归约。需要高占用率来切换 warp，或提高每次访存的字节数（向量化 float4）。' }, right: { title: '吞吐受限（throughput-bound）', html: '算术密集，如矩阵乘、卷积。占用率中等即可，重点是减少访存、提高 FMA 比例，让每个 SM 的算力跑满。' } },

    { t: 'h', lvl: 2, text: '七、性能剖析：ncu 指标与 roofline 对照', id: 'ch06-7' },

    { t: 'p', html: 'NVIDIA Nsight Compute（<code>ncu</code>）是定位 kernel 瓶颈的标准工具。它给出四组关键指标：<b>占用率</b>（理论/实际）、<b>访存吞吐</b>（DRAM 与 L2 的利用率）、<b>计算吞吐</b>（SM 的 pipe 利用率）、<b>stall 原因</b>（warp 在等什么：内存、屏障、指令发射）。<b>先看 stall 原因，再看吞吐</b>——前者告诉你「卡在哪」，后者告诉你「离峰值多远」。' },

    { t: 'table', head: ['指标', '含义', '偏低说明', '优化方向'], rows: [
      ['Achieved Occupancy', '实际驻留 warp ÷ 最大 warp', '寄存器/共享内存限制，或 block 太小', '减寄存器、调 block 大小'],
      ['Memory Throughput', 'DRAM 带宽利用率', '访存不合并、复用不足', '合并访存、加 tile、用 float4'],
      ['Compute (SM) Throughput', '计算管线利用率', '指令混合差、分支发散', '减少非 FMA 指令、消除发散'],
      ['Warp Stall: Long Scoreboard', 'warp 在等全局内存', '延迟未隐藏', '提高占用率、预取'],
      ['Warp Stall: Barrier', 'warp 在等 __syncthreads', '负载不均或同步过多', '减少同步轮数、用 shuffle'],
      ['L1/L2 Hit Rate', '缓存命中率', '数据布局差、tile 太大', '调 tile、改访问顺序']
    ], caption: 'ncu 的报告很长；先看「Speed of Light」面板的两个百分比，再看 stall 分解' },

    { t: 'p', html: '把 ncu 的数字和 ch01 的 roofline 对上，判断会变得很直接。<b>若 DRAM 吞吐接近峰值、SM 吞吐很低</b> → 带宽受限，去减少访存（融合、分块、降低精度）。<b>若 SM 吞吐接近峰值</b> → 算力受限，去提高 FMA 比例或换 Tensor Core。<b>若两者都低</b> → 延迟没藏住或有同步瓶颈，去看占用率与 stall。<b>若两者都高但性能仍不理想</b> → 可能受指令发射或特殊功能单元限制。' },

    { t: 'p', html: '最后一个值得知道的优化叫<b>算子融合（kernel fusion）</b>：把「加偏置 → 激活 → 归一化」三个逐元素 kernel 合成一个，<b>避免三次全局内存往返</b>。逐元素操作的算术强度只有 O(1)（ch01 的 roofline 里远低于脊点），所以性能完全由访存决定，融合直接减少 2/3 的流量。近年研究（如 automatic horizontal fusion）在编译器层面自动做这种合并，思路与 ch04 的循环融合一致——<b>能少搬一次就少搬一次</b>。' },

    { t: 'quiz', qid: 'ch06-q3' },

    { t: 'terms', items: [
      { en: 'SM', zh: '流式多处理器', html: 'GPU 的基本计算单元，内含 CUDA 核心、寄存器文件、共享内存与 warp 调度器。' },
      { en: 'warp', zh: '线程束', html: '32 个线程组成的调度单位，同一 warp 执行同一条指令（SIMT）。' },
      { en: 'occupancy', zh: '占用率', html: '实际驻留 warp 数与硬件上限之比，受寄存器、共享内存、线程数限制。' },
      { en: 'coalesced access', zh: '合并访存', html: 'warp 内线程访问连续地址，被合并成少量大事务，带宽利用率高。' },
      { en: 'bank conflict', zh: 'bank 冲突', html: '多个线程访问共享内存同一 bank 的不同地址，被迫串行化。' },
      { en: 'divergence', zh: '分支发散', html: 'warp 内线程走不同分支，硬件需串行执行各路径，吞吐下降。' },
      { en: 'kernel fusion', zh: '算子融合', html: '把多个逐元素 kernel 合成一个，减少全局内存往返，提升有效带宽。' }
    ] },

    { t: 'keypoint', items: [
      { title: 'GPU 用线程换延迟', html: '单线程慢但吞吐高，靠大量 warp 轮转隐藏 400 周期的访存延迟。' },
      { title: '合并访存是第一原则', html: 'warp 内连续地址合成 128B 事务；跨步访问带宽掉到 1/32。' },
      { title: '共享内存靠填充消除 bank 冲突', html: 's[32][33] 比 s[32][32] 多 128 字节，却避免 32 路串行。' },
      { title: '归约用树形 + shuffle', html: '深度从 O(n) 降到 O(log n)，warp 内用 __shfl_down_sync 免同步。' },
      { title: '占用率是手段不是目标', html: '延迟受限要高高占用率，吞吐受限中等即可；别为降寄存器牺牲性能。' }
    ] },

    { t: 'checklist', id: 'ch06', items: [
      '我能说出 SM、warp、block、grid 的层次关系，并解释 SIMT 的含义',
      '我能算出给定线程数与 block 大小时需要多少 block，并处理不整除的边界',
      '我能写出完整的 CUDA 程序，并说明每步为什么要检查错误',
      '我能解释为什么 cuMalloc 与 cudaMemcpy 的顺序会影响正确性',
      '我能判断一段访存是否合并，并给出改成合并的方法',
      '我能解释 s[32][33] 为什么能消除 bank 冲突',
      '我能写出共享内存树形归约，并说明每轮为什么必须同步',
      '我能说出 warp shuffle 省掉了什么开销',
      '我能用占用率公式估算一个 kernel 最多驻留多少 block',
      '我能读懂 ncu 的 stall 分解，并据此判断是延迟受限还是带宽受限',
      '我能解释 kernel fusion 为什么对逐元素算子收益巨大'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 GPU and CUDA Programming（Ch.9–11）讲义组织，并吸收了 Automatic Horizontal Fusion for GPU Kernels 的融合思想、OpenACC 与 Triton 讲义中「高层抽象生成 GPU 代码」的路线，以及 Tutorial 10 用 flash attention 的 MAC 计算讲算术强度与访存的例子。文中 SM 数量（A100 108、H100 132）、每 SM 线程上限（2048）、共享内存容量与延迟数字为公开架构资料的典型值，具体随型号与 CUDA 版本变化。本章不涉及 Tensor Core 的 MMA 指令细节、CUDA Graph、多卡通信（NCCL）与 Triton 语法，这些属于进阶内容；作业只要求能手写并调优一个归约或矩阵乘 kernel。' }
  ]
});
