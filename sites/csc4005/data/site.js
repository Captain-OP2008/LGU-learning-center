/* =====================================================================
 * site.js · CSC4005 并行计算 站点配置（window.CSC_SITE）
 * ===================================================================== */
window.CSC_SITE = {
  id: 'csc4005',
  short: 'CSC4005',
  name: '并行计算',
  en: 'Parallel Computing',
  dept: '计算机科学',
  lang: 'c',
  langLabel: 'C · CUDA',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读 + 自测',
  bootHead: 'CSC4005 // PARALLEL RUNTIME',
  bootLog: [
    '> mounting course partition ... CSC4005',
    '> probing topology: 8 cores, 1 GPU, 1 interconnect ...',
    '> loading 8 modules: metrics, patterns, threads, simd, mpi, cuda ...',
    '> speedup limited by serial fraction. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '把一秒拆成八个核，再把八个核拼回一秒。',
  missionEn: 'CSC4005 · 8 MODULES',
  missionTitle: '从摩尔定律失效<br><em>到十万线程并行</em>',
  lede: '八章沿一条主线推进：为什么必须并行、怎么测量收益、怎么拆分问题、怎么在共享内存里同步、怎么让编译器向量化、怎么跨机器发消息、怎么把工作交给 GPU、最后怎么把模型用在排序与搜索上。每章配真实代码、对比表、常见错误与自检清单，读完能独立写出可测量、可解释、可复现的并行程序。',
  searchPlaceholder: 'QUERY // 搜索：Amdahl · roofline · OpenMP · MPI · warp · 归约 · 扩展性',

  /* 资料库（path 相对 resBase，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/CSC4005/',
  resources: {
    note: '收录 CSC4005 的全部讲义、习题课与考试资料；文件名即原始文件，点击后用系统默认程序打开。',
    groups: [
      { name: '讲义与课件', note: '按课程进度排列，从「为什么并行」到 GPU 算子优化，共 17 份。', items: [
        { title: '课程组织与安排', path: '学习资料/CSC4005_Lecture_slides_Course_Organization.pptx', kind: 'pptx', note: '评分构成、项目安排与环境说明' },
        { title: 'Part I · 为什么并行与体系结构', path: '学习资料/CSC4005_Lecture_slides_Part_I_Why_Parallel_Computing_and_Parallel_Computer_Architectures_Chapter_1_in_textbook_and_Chapter_1_in_ref_book.pptx', kind: 'pptx', note: '本站 ch00–ch01 的主要依据' },
        { title: 'Part II · 易并行计算 EPC', path: '学习资料/CSC4005_Lecture_slides_Part_2_EPC_Embarrassing_Parallel_Computing_Chapter_3_reference_book.pptx', kind: 'pptx', note: 'ch02 的 EPC 与分解模式' },
        { title: '性能极限与剖析', path: '学习资料/CSC4005_Lecture_slides_Performance_Limits_and_Profiling_Chapter_3.pptx', kind: 'pptx', note: 'roofline、Amdahl 与 perf 使用' },
        { title: 'Pthread 编程', path: '学习资料/CSC4005_Lecture_slides_Pthread_Programming.pptx', kind: 'pptx', note: 'ch03 的线程创建、锁与条件变量' },
        { title: '共享内存同步', path: '学习资料/CSC4005_Lecture_slides_Programming_with_Shared_Memory_Synchronization.pptx', kind: 'pptx', note: '屏障、原子与竞态案例' },
        { title: '缓存一致性', path: '学习资料/CSC4005_Lecture_slides_Cache_Coherence.pptx', kind: 'pptx', note: '伪共享与一致性协议' },
        { title: '内存一致性模型', path: '学习资料/CSC4005_Lecture_slides_Memory_Consistency.pptx', kind: 'pptx', note: 'TSO、内存序与屏障' },
        { title: 'OpenMP（第 7 章）', path: '学习资料/CSC4005_Lecture_slides_OpenMP_Chapter_7.pptx', kind: 'pptx', note: 'ch04 的 fork-join、作用域与调度' },
        { title: 'SIMD 与 FLOPs for Free（第 6 章）', path: '学习资料/CSC4005_Lecture_slides_Vector_SIMD_Instructions_FLOPs_for_Free_Chapter_6.pptx', kind: 'pptx', note: '向量化、intrinsics 与三障碍' },
        { title: 'MPI（第 8 章）', path: '学习资料/CSC4005_Lecture_slides_MPI_Chapter_8.pptx', kind: 'pptx', note: 'ch05 的点对点与集合通信' },
        { title: '分布式共享内存机器', path: '学习资料/CSC4005_Lecture_slides_Distributed_Shared_Memory_Machines.pptx', kind: 'pptx', note: 'NUMA 与集群上的共享内存抽象' },
        { title: 'GPU 与 CUDA（第 9–11 章）', path: '学习资料/CSC4005_Lecture_slides_GPU_and_CUDA_Programming_Chapter_9_11.pptx', kind: 'pptx', note: 'ch06 的主讲义' },
        { title: 'OpenACC 与 Triton（第 11 章）', path: '学习资料/CSC4005_Lecture_slides_OpenACC_Chapter_11_and_Triton.pptx', kind: 'pptx', note: '指令式 GPU 编程与算子 DSL' },
        { title: '自动水平融合', path: '学习资料/CSC4005_Lecture_slides_Automatic_Horizontal_Fusion_for_GPU_Kernels.pptx', kind: 'pptx', note: '算子融合与访存优化进阶' },
        { title: '并行排序', path: '学习资料/CSC4005_Lecture_slides_Parallel_Sorting.pptx', kind: 'pptx', note: 'ch07 的归并、双调、基数与样本排序' },
        { title: '并行搜索与空间哈希', path: '学习资料/CSC4005_Lecture_slides_Parallel_Searching_and_Spatial_Hashing.pptx', kind: 'pptx', note: 'BFS 前沿、空间哈希与邻居查询' }
      ] },
      { name: '习题课与项目', note: '每次 Tutorial 对应一组上机练习，Project 3/4 是课程大作业。', items: [
        { title: 'Tutorial 1 · 环境与热身', path: '作业习题/CSC4005_Tutorials_tutoria1_1.pptx', kind: 'pptx', note: '服务器登录、编译命令与第一个 OpenMP 程序' },
        { title: 'Tutorial 2 · 线程与同步', path: '作业习题/CSC4005_Tutorials_tutorial2.pptx', kind: 'pptx', note: 'Pthreads 练习与竞态调试' },
        { title: 'Tutorial 3 · 性能测量', path: '作业习题/CSC4005_Tutorials_tutorial3.pptx', kind: 'pptx', note: '计时、绑核与扩展曲线' },
        { title: 'Tutorial 5 · 向量化', path: '作业习题/CSC4005_Tutorials_tutorial5.pdf', kind: 'pdf', note: 'SIMD 与自动向量化的课堂练习' },
        { title: 'Tutorial 7 · Project 3 说明', path: '作业习题/CSC4005_Tutorials_Tutorial_7_Introduction_to_Project_3.pptx', kind: 'pptx', note: '项目要求、评分点与提交格式' },
        { title: 'Tutorial 8 · 并行搜索', path: '作业习题/CSC4005_Tutorials_Tutorial_8_Parallel_Searching.pptx', kind: 'pptx', note: '空间哈希实现与调试' },
        { title: 'Tutorial 10 · FlashAttention 的 MAC 计算', path: '作业习题/CSC4005_Tutorials_Tutorial_10_MAC_computation_of_flash_attention.pptx', kind: 'pptx', note: '算子分析：算术强度与访存估算' },
        { title: 'Project 4 说明', path: '作业习题/CSC4005_Tutorials_Project4.pptx', kind: 'pptx', note: 'GPU 项目要求与性能目标' }
      ] },
      { name: '考试与复习', note: 'Quiz 与期末的往年题、答案与复习讲义；模拟卷请配合本站 exam.js 使用。', items: [
        { title: '期末复习讲义', path: '考试资料/CSC4005_Lecture_slides_Final_Review.pptx', kind: 'pptx', note: '全课程知识点串讲与典型题' },
        { title: '期末答案（25 Fall）', path: '考试资料/CSC4005_Final_Key_25Fall.docx', kind: 'docx', note: '上学年期末评分参考' },
        { title: '往年期末（2024）', path: '考试资料/CSC4005_Past_Exams_Final_2024.docx', kind: 'docx', note: '完整期末卷，含计算与简答' },
        { title: 'Midterm 题型说明', path: '考试资料/CSC4005_Lecture_slides_Midterm_Exam#1.docx', kind: 'docx', note: '期中范围与题型分布' },
        { title: 'Quiz 复习讲义', path: '考试资料/CSC4005_Lecture_slides_Review_Quiz.pptx', kind: 'pptx', note: '第一次 Quiz 的重点与例题' },
        { title: 'Quiz 2 复习讲义', path: '考试资料/CSC4005_Lecture_slides_Review_Quiz#2.pptx', kind: 'pptx', note: '第二次 Quiz 的重点与例题' },
        { title: 'Quiz 2 答案（2025）', path: '考试资料/CSC4005_Lecture_slides_Quiz2_4005_2025key.docx', kind: 'docx', note: 'Quiz 2 评分要点' },
        { title: '往年 Quiz 1（2023）', path: '考试资料/CSC4005_Past_Exams_Quiz1_2023.docx', kind: 'docx', note: '早期 Quiz 题型参考' },
        { title: '往年 Quiz 1（2024）', path: '考试资料/CSC4005_Past_Exams_Quiz1_2024.docx', kind: 'docx', note: '最近一次 Quiz 1 原卷' },
        { title: '往年 Quiz 2', path: '考试资料/CSC4005_Past_Exams_Quiz_2.docx', kind: 'docx', note: '线程、OpenMP 与性能模型' },
        { title: '往年 Quiz 3', path: '考试资料/CSC4005_Past_Exams_Quiz_3.docx', kind: 'docx', note: 'MPI 与 GPU 部分' }
      ] }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '并行计算（Parallel Computing），CUHKSZ CSC4005'],
    ['来源', 'CUHKSZ CSC4005 课程讲义、Tutorial 与考试资料'],
    ['结构', '8 章正文 · 56 题题库 · 模拟卷 · 3 个实战项目 · 36 份资料'],
    ['建议', 'ch01 的标尺与 ch07 的剖析决定你能不能解释数字；三个项目务必动手跑，性能只看书看不出来。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    { label: '性能模型', blocks: [
      { t: 'table', head: ['量', '公式', '说明'], rows: [
        ['加速比 speedup', 'S(p) = T(1) / T(p)', '必须与 p、问题规模一起报告'],
        ['效率 efficiency', 'E(p) = S(p) / p', '低于 0.6 通常说明开销过大'],
        ['Amdahl 上界', 'S ≤ 1 / (s + (1−s)/p)', 'p→∞ 时上限为 1/s'],
        ['算术强度', 'AI = FLOPs / Bytes', '单位 FLOP/Byte，决定 roofline 位置'],
        ['roofline', 'min(峰值算力, 带宽 × AI)', '脊点 = 峰值算力 / 带宽'],
        ['弱扩展效率', 'E = T(1, n) / T(p, p·n)', '理想值为 1，时间持平']
      ], caption: '所有数字都要带「规模 + 线程数 + 计时方法」，否则无法比较' },
      { t: 'code', lang: 'c', caption: '便携计时骨架：只在主线程计时，排除初始化', code: `#include <omp.h>
double t0 = omp_get_wtime();
/* 只放需要计时的核心循环，不要包含 malloc 与首次触碰 */
double t1 = omp_get_wtime();
printf("time %.3f s\\n", t1 - t0);` },
      { t: 'callout', kind: 'tip', title: '先算上界，再优化', html: '拿到 5 倍加速比先别高兴：用 Amdahl 与 roofline 各算一个上界，若已到 90%，剩下的时间该花在减少工作量或换算法上，而不是继续调线程数。' }
    ] },
    { label: 'OpenMP', blocks: [
      { t: 'table', head: ['构造 / 子句', '作用', '常见坑'], rows: [
        ['<code>#pragma omp parallel for</code>', '并行化循环，末尾隐式 barrier', '循环内写共享变量会丢更新'],
        ['<code>reduction(+:s)</code>', '私有副本 + 末尾合并', '不能用于任意自定义类型（除声明过）'],
        ['<code>schedule(static/dynamic/guided)</code>', '迭代分配策略', 'dynamic 块太小则调度开销占主导'],
        ['<code>collapse(2)</code>', '把多层循环合并成一层并行', '只有内层无依赖时才安全'],
        ['<code>private(x)</code> / <code>firstprivate(x)</code>', '每线程私有 / 私有且继承初值', 'private 不初始化，读到的是垃圾值'],
        ['<code>critical</code> / <code>atomic</code>', '互斥 / 单条原子更新', 'critical 保护整块，能小则小'],
        ['<code>#pragma omp barrier</code>', '显式全员同步', '只能在 parallel 区内使用']
      ], caption: '默认规则：循环变量 private，其余变量 shared——大部分 bug 都来自这条' },
      { t: 'code', lang: 'c', caption: '安全模板：reduction + 静态调度 + 局部指针', code: `#pragma omp parallel for schedule(static) reduction(+:sum)
for (int i = 0; i < n; i++) {
    const double *row = &a[(size_t)i * n];   /* 帮助编译器消别名 */
    double acc = 0.0;
    for (int j = 0; j < n; j++) acc += row[j] * b[j];
    sum += acc;
}` },
      { t: 'callout', kind: 'warn', title: '别在循环里加 critical', html: '每次迭代都进临界区等于把并行退化成串行，还多出锁开销。先试 reduction，实在不行就每线程局部累加，最后一次合并。' }
    ] },
    { label: 'MPI', blocks: [
      { t: 'table', head: ['调用', '语义', '注意'], rows: [
        ['<code>MPI_Init / MPI_Finalize</code>', '初始化和收尾', '所有进程都必须调用'],
        ['<code>MPI_Comm_rank / size</code>', '取编号与进程数', 'rank 是通信域内的逻辑编号'],
        ['<code>MPI_Send / Recv</code>', '点对点，阻塞', 'Send 返回即可复用缓冲区'],
        ['<code>MPI_Isend / Irecv</code>', '非阻塞，需 Wait', 'Wait 之前不能改缓冲区'],
        ['<code>MPI_Reduce</code>', '归约到 root', '所有进程都要调用'],
        ['<code>MPI_Allreduce</code>', '归约并广播结果', '等于 Reduce + Bcast'],
        ['<code>MPI_Bcast / Scatterv / Gatherv</code>', '一对多 / 分发 / 收集', '不等长数据要用 v 版本'],
        ['<code>MPI_Sendrecv</code>', '一次完成收发', '避免环形死锁的常用解']
      ], caption: '集合通信是「全员参与」的约定：少一个进程调用就会挂起' },
      { t: 'code', lang: 'c', caption: '非阻塞重叠骨架', code: `MPI_Request req[2];
MPI_Irecv(buf, cnt, MPI_DOUBLE, src, 1, MPI_COMM_WORLD, &req[0]);
MPI_Isend(out, cnt, MPI_DOUBLE, dst, 2, MPI_COMM_WORLD, &req[1]);
compute_other_part();                 /* 与传输重叠 */
MPI_Waitall(2, req, MPI_STATUSES_IGNORE);` },
      { t: 'callout', kind: 'warn', title: '死锁的典型写法', html: '所有进程都先 <code>MPI_Send</code> 再 <code>MPI_Recv</code>：人人都等对方先收，消息大到装不进内部缓冲时必然卡死。用交错方向、非阻塞或 Sendrecv 打破它。' }
    ] },
    { label: 'CUDA', blocks: [
      { t: 'table', head: ['概念 / API', '含义', '实践要点'], rows: [
        ['grid / block / thread', '三层索引，决定并行粒度', 'block 取 128–256，且为 32 的倍数'],
        ['warp', '32 个线程的调度单位', '分支发散以 warp 为单位惩罚'],
        ['<code>__shared__</code>', '块内共享的片上内存', '几十 KB，注意 bank 冲突'],
        ['<code>__syncthreads()</code>', '块内屏障', '只能在 block 内同步，不能跨 block'],
        ['合并访存', '同一 warp 访问连续地址', '跨步访问会让事务数翻 32 倍'],
        ['<code>__shfl_down_sync</code>', 'warp 内寄存器交换', '做 warp 归约，省去共享内存'],
        ['占用率 occupancy', '每 SM 驻留的 warp 数', '受寄存器、共享内存、block 上限约束']
      ], caption: '写 kernel 的第一原则：以 warp 为单位想访存与分支' },
      { t: 'code', lang: 'cuda', caption: '边界安全 + 合并访存的逐元素 kernel', code: `__global__ void scale(float *a, float k, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < n) a[i] *= k;          /* 边界检查 + 连续地址 */
}
/* 启动：int grid = (n + 255) / 256; scale<<<grid, 256>>>(d_a, 2.0f, n); */` },
      { t: 'callout', kind: 'tip', title: '先用 ncu 再改代码', html: '看三个数：achieved occupancy、global load/store efficiency、stall 原因。若 memory throughput 已接近峰值，继续加线程没有意义，该减少搬运或融合算子。' }
    ] },
    { label: '调试与剖析', blocks: [
      { t: 'table', head: ['场景', '命令', '看什么'], rows: [
        ['编译 OpenMP', '<code>gcc -O3 -fopenmp -march=native</code>', '先 -O2 调试，再 -O3 测性能'],
        ['编译 MPI', '<code>mpicc -O3 -Wall</code>', '运行用 <code>mpirun -np N</code>'],
        ['编译 CUDA', '<code>nvcc -O3 -arch=sm_80</code>', '架构要与显卡匹配'],
        ['热点函数', '<code>perf record -g ./a.out</code>', 'perf report 看占比'],
        ['硬件计数器', '<code>perf stat -e cycles,cache-misses</code>', 'IPC 与缺失率'],
        ['数据竞争', '<code>gcc -fsanitize=thread</code>', 'TSan 报告的具体地址'],
        ['越界访问', '<code>cuda-memcheck ./a.out</code>', 'kernel 的越界读写'],
        ['GPU 指标', '<code>ncu --set full ./a.out</code>', '占用率、访存效率、stall']
      ], caption: '工具只回答「哪里慢」，为什么慢要靠模型（带宽、依赖、同步）解释' },
      { t: 'code', lang: 'bash', caption: '一次干净的测量：绑核、重复、取中位数', code: `for t in 1 2 4 8; do
  for r in 1 2 3; do
    OMP_NUM_THREADS=$t OMP_PROC_BIND=close OMP_PLACES=cores \\
      ./prog | grep time
  done
done` },
      { t: 'callout', kind: 'note', title: '数字异常的三种常见原因', html: '① 没绑核，线程在 NUMA 节点间迁移；② 首次触碰导致页分配在远端；③ 只跑一次，把冷启动与抖动当成稳态。三者都能让加速比凭空少 20%。' }
    ] }
  ]
};
