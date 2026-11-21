/* =====================================================================
 * ch04.js · 第 4 章「循环并行与向量化：OpenMP 与 SIMD」
 * 职责：OpenMP 的 fork-join 模型、数据作用域、调度策略、同步构造，
 *       以及 SIMD 向量化的条件、intrinsics 与常见障碍。
 * 依据：OpenMP（Ch.7）、Vector SIMD Instructions（Ch.6）、
 *       OpenACC 与 Triton 讲义。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch04',
  num: '04',
  title: '循环并行与向量化：OpenMP 与 SIMD',
  en: 'OPENMP & SIMD VECTORIZATION',
  goals: [
    '解释 OpenMP 的 fork-join 执行模型，说出 parallel、for、sections 的语义差别',
    '正确设置 shared、private、firstprivate、reduction，避免作用域错误导致的结果错误',
    '按负载特征选择 static、dynamic、guided 调度，并用 collapse 处理嵌套循环',
    '写出可被编译器向量化的循环，说明别名、分支、非连续访存为什么阻止向量化',
    '用 intrinsics 手写 AVX2 点积，并解释 FMA 与对齐要求',
    '用分块与循环变换提升缓存复用，并用向量化报告验证优化是否生效'
  ],
  kp: [
    { id: 'ch04-1', title: 'OpenMP 执行模型：fork-join 与编译制导' },
    { id: 'ch04-2', title: '数据作用域：shared、private、reduction' },
    { id: 'ch04-3', title: '调度策略、collapse 与循环变换' },
    { id: 'ch04-4', title: '同步构造：critical、atomic、barrier 与 nowait' },
    { id: 'ch04-5', title: 'SIMD：向量化条件与 intrinsics' },
    { id: 'ch04-6', title: '向量化的三个障碍：别名、分支、跨步访存' },
    { id: 'ch04-7', title: '调优：分块、循环交换与验证向量化' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '一条 pragma 能带来 6 倍，也能带来错误答案', html: 'OpenMP 的门槛极低：在 <code>for</code> 前加一行 <code>#pragma omp parallel for</code> 就能用上多核。但它的默认规则是「变量共享」，于是两个线程可能同时写同一个临时变量；它也不会检查循环是否可并行，于是「上一次迭代的结果影响下一次」的循环会被静默地并行化，跑出错误结果。这一章的目标不是背语法，而是让你能<b>判断哪些循环能并行、哪些变量必须私有、以及为什么加了两行 pragma 只快了 1.2 倍</b>。' },

    { t: 'p', lead: true, html: '本章讲同一台多核 CPU 上的两种并行：<b>线程级</b>（OpenMP 把一个循环的迭代分给多个线程）与<b>数据级</b>（SIMD 让一条指令同时处理 8 个 float）。它们常常叠加使用——每个线程内部再做向量化，理论峰值就是这样凑出来的。理解这两种并行的边界，是判断「这个循环还能不能更快」的基础。' },

    { t: 'h', lvl: 2, text: '一、OpenMP 执行模型：fork-join 与编译制导', id: 'ch04-1' },

    { t: 'p', html: 'OpenMP 是<b>编译制导（compiler directive）</b>式的并行：你在源码里写 <code>#pragma omp ...</code>，编译器据此生成线程创建、任务分配与同步代码。程序启动时只有一个<b>主线程</b>；遇到 <code>parallel</code> 区域时它 fork 出一组线程（team），区域结束时汇合并继续单线程执行——这个模式叫 <b>fork-join</b>。' },

    { t: 'p', html: '三个最常用的构造：<code>#pragma omp parallel</code> 创建一个线程组，区域内每行代码都被所有线程执行（所以通常只放一个 for）；<code>#pragma omp parallel for</code> 是二者的简写，把紧随其后的 for 循环的迭代分给线程；<code>#pragma omp sections</code> 把不同的代码块分给不同线程，适合任务分解。' },

    { t: 'table', head: ['构造', '作用', '隐式同步', '适用'], rows: [
      ['parallel', '创建线程组，区域内代码每个线程都执行', '区域结束有 barrier', '需要手工分配工作时'],
      ['parallel for', '把 for 的迭代分配给线程', '循环结束有 barrier', '规则的数组/矩阵循环'],
      ['sections', '不同代码块分给不同线程', '区域结束有 barrier', '任务分解、阶段并行'],
      ['single / master', '只让一个线程执行', 'single 结束有 barrier', '初始化、I/O、汇总'],
      ['task', '动态生成任务，由空闲线程领取', '需显式 taskwait', '不规则递归、链表遍历']
    ], caption: 'OpenMP 的 barrier 默认是隐式的；用 nowait 可以去掉，但要自己保证依赖' },

    { t: 'p', html: '编译时要加 <code>-fopenmp</code>（GCC/Clang）或 <code>/openmp</code>（MSVC），否则所有 pragma 被当成注释静默忽略——程序能跑、结果正确、但只有单线程。这是排查「为什么没变快」时的第一个检查点。<b>用 <code>omp_get_num_threads()</code> 打印实际线程数</b>，比看代码可靠。' },

    { t: 'h', lvl: 2, text: '二、数据作用域：shared、private、reduction', id: 'ch04-2' },

    { t: 'p', html: 'OpenMP 的默认规则是：<b>在并行区域外声明的变量是共享的（shared），循环的迭代变量是私有的（private）</b>。这个默认值对「读共享输入、写共享输出的不同位置」是对的，但对「每个线程都要一个临时累加器」就是灾难——所有线程写同一个变量，结果随机。' },

    { t: 'table', head: ['子句', '含义', '初始值', '典型用途'], rows: [
      ['shared', '所有线程共用一份', '已有值', '输入数组、只读参数'],
      ['private', '每线程一份副本', '未初始化', '循环内临时变量、下标'],
      ['firstprivate', '每线程一份，初始化为进入前的值', '进入前的值', '需要初值的累加器'],
      ['lastprivate', '每线程一份，退出时把最后一次迭代的值带出', '进入前的值', '循环结束后的结果变量'],
      ['reduction(op:var)', '每线程一份，退出时按 op 合并', 'op 的单位元', '求和、求最大值、点积'],
      ['default(none)', '强制显式声明每个变量的作用域', '无', '教学与排查作用域错误']
    ], caption: 'reduction 的单位元：求和为 0，乘积为 1，最大值为最小可表示数' },

    { t: 'p', html: '一个具体例子说明 private 的必要性：循环里写 <code>double tmp = a[i] * b[i];</code>，<code>tmp</code> 在循环外声明就成了共享变量，两个线程会互相覆盖。把它写进循环体（或在 pragma 上加 <code>private(tmp)</code>）才正确。反过来，数组 <code>a</code>、<code>b</code> 必须共享，否则每个线程复制一份 1 GB 的数组，内存立刻爆掉。' },

    { t: 'code', lang: 'c', caption: '三种写法对比：共享累加（错）、私有累加（对但慢）、reduction（对且快）', code: `#include <omp.h>
#include <stdio.h>

#define N (1 << 24)
static double a[N], b[N];

int main(void) {
    for (int i = 0; i < N; ++i) { a[i] = 1.0; b[i] = 2.0; }

    /* 错：sum 默认共享，所有线程读—改—写同一个变量，结果随机偏小 */
    double bad = 0.0;
    #pragma omp parallel for
    for (int i = 0; i < N; ++i) bad += a[i] * b[i];

    /* 对但慢：每个线程私有副本，最后串行合并（p 次，可接受） */
    double good = 0.0;
    #pragma omp parallel
    {
        double local = 0.0;
        #pragma omp for
        for (int i = 0; i < N; ++i) local += a[i] * b[i];
        #pragma omp critical
        good += local;
    }

    /* 对且快：reduction 由编译器生成高效合并（通常是线程本地 + 最终归约） */
    double fast = 0.0;
    #pragma omp parallel for reduction(+:fast)
    for (int i = 0; i < N; ++i) fast += a[i] * b[i];

    printf("%.1f %.1f %.1f\\n", bad, good, fast);
    return 0;
}` },

    { t: 'p', html: '注意 <code>reduction</code> 不是「加锁的累加」。编译器为每个线程建私有副本，循环结束后按线程编号做一次树形合并，<b>同步次数是 O(p) 而不是 O(N)</b>。这就是为什么它比在循环里放 <code>critical</code> 快几十倍：后者把每次迭代都变成串行。判断标准很直接——<b>循环体内出现同步构造，基本等于宣布放弃并行</b>。' },

    { t: 'quiz', qid: 'ch04-q1' },

    { t: 'h', lvl: 2, text: '三、调度策略、collapse 与循环变换', id: 'ch04-3' },

    { t: 'p', html: '把 N 次迭代分给 p 个线程有不同分法，OpenMP 用 <code>schedule</code> 子句暴露这个选择。<b>static</b> 预先切好、零运行时开销，适合每次迭代耗时相同的情况；<b>dynamic</b> 用共享计数器按块领取，均衡但不规则任务的开销；<b>guided</b> 的块大小递减，兼顾两者；<b>auto/runtime</b> 交给编译器或环境变量。' },

    { t: 'table', head: ['schedule', '分配方式', '开销', '负载均衡', '适用场景'], rows: [
      ['static', '预先切成 p 块（或指定 chunk）', '几乎为零', '差（迭代耗时不均时）', '规则循环、矩阵运算'],
      ['static, chunk', '轮流发 chunk 个迭代', '几乎为零', '较好', '轻微不均，且需保持局部性'],
      ['dynamic, chunk', '运行时空闲线程领取 chunk 个', '每次领取有原子操作', '最好', '不规则任务、分支密集'],
      ['guided', '块大小从大到小递减', '中等', '好', '大循环 + 不均匀尾部'],
      ['auto', '编译器决定', '不定', '不定', '不想调参时']
    ], caption: 'chunk 太小会放大调度开销，太大会退化成静态；经验值 8–64 次迭代' },

    { t: 'p', html: '嵌套循环要小心：<code>#pragma omp parallel for</code> 只作用于<b>紧随其后的最外层循环</b>。如果外层只有 4 次迭代而线程有 16 个，一半线程闲置。解决办法是 <code>collapse(2)</code> 把两层循环合并成一个 4×N 的迭代空间再切分；或者把外层写成 <code>parallel for</code>、内层交给向量化。选择哪一种，取决于哪一层的迭代数更多、访存更连续。' },

    { t: 'p', html: '循环变换是另一类杠杆。<b>循环交换（loop interchange）</b>把内层换成访存连续的那一维，避免跨步访问；<b>循环分块（blocking/tiling）</b>把大矩阵切成能放进 L2 的小块，让数据在被换出前被反复使用；<b>循环展开（unrolling）</b>减少分支与下标计算，给向量化制造机会。这三者在矩阵乘上叠加，常能把性能从峰值的 5% 提到 60% 以上。' },

    { t: 'h', lvl: 2, text: '四、同步构造：critical、atomic、barrier 与 nowait', id: 'ch04-4' },

    { t: 'p', html: 'OpenMP 提供四种同步粒度。<code>critical</code> 是命名临界区，同一名字的临界区互斥，适合保护一段多行代码；<code>atomic</code> 只保护一条简单赋值或更新（如 <code>x += y</code>），编译成硬件原子指令，比 critical 快一个数量级；<code>barrier</code> 让所有线程会合；<code>nowait</code> 则相反——去掉隐式屏障，让线程提前进入下一段。' },

    { t: 'p', html: '去掉屏障是有风险的优化。并行 for 结束后的隐式 barrier 保证了「所有线程都写完输出」，如果下一段代码要读这些输出，去掉就会读到未完成的数据。经验是：<b>只在下一段完全不依赖前一段结果时才用 nowait</b>，并且写注释说明理由——否则半年后没人敢改这段代码。' },

    { t: 'p', html: '还有一种隐蔽的同步开销：<b>伪共享</b>。并行 for 里让每个线程写 <code>sum[tid]</code>，如果这些 <code>double</code> 挤在同一缓存行，写操作会让缓存行在核间弹跳。OpenMP 场景下的修法是每个线程用局部变量 + reduction，或把数组按 64 字节填充。这个坑在 ch03 已详细分析，这里只需记住：<b>它不会被编译器警告，只能靠 <code>perf c2c</code> 或对比不同线程数下的性能发现</b>。' },

    { t: 'quiz', qid: 'ch04-q2' },

    { t: 'h', lvl: 2, text: '五、SIMD：向量化条件与 intrinsics', id: 'ch04-5' },

    { t: 'p', html: 'SIMD 是「一条指令处理多个数据」。AVX2 的向量寄存器宽 256 位，一次能装 8 个 <code>float</code> 或 4 个 <code>double</code>；AVX-512 翻倍到 16 个 <code>float</code>。理论上 8 路并行意味着 8 倍吞吐，实际受限于访存带宽与指令混合，常见收益是 3–6 倍。' },

    { t: 'p', html: '写向量化代码有两条路。<b>自动向量化</b>：把循环写成最朴素的形式，加 <code>-O3 -march=native</code>，让编译器生成向量指令；<b>手写 intrinsics</b>：用 <code>_mm256_load_ps</code>、<code>_mm256_fmadd_ps</code> 等内建函数直接控制指令。前者可移植、维护成本低，后者能处理编译器不敢做的情况（如需要精确控制归约顺序）。现代实践是<b>先让编译器做，看报告，再对手写</b>。' },

    { t: 'code', lang: 'c', caption: 'AVX2 手写点积：一次取 8 个 float，用 FMA 累加到向量寄存器', code: `#include <immintrin.h>
#include <stdio.h>

/* 计算 a·b，要求 n 是 8 的倍数，且 a、b 32 字节对齐 */
float dot_avx2(const float *a, const float *b, int n) {
    __m256 acc = _mm256_setzero_ps();              /* 8 路累加器 */
    for (int i = 0; i < n; i += 8) {
        __m256 va = _mm256_load_ps(a + i);         /* 对齐加载 */
        __m256 vb = _mm256_load_ps(b + i);
        acc = _mm256_fmadd_ps(va, vb, acc);        /* acc += va * vb，一条指令 */
    }
    /* 水平归约：把 8 个 lane 加起来 */
    __m128 lo = _mm256_castps256_ps128(acc);
    __m128 hi = _mm256_extractf128_ps(acc, 1);
    __m128 s  = _mm_add_ps(lo, hi);
    s = _mm_hadd_ps(s, s);
    s = _mm_hadd_ps(s, s);
    return _mm_cvtss_f32(s);
}

int main(void) {
    static float a[1024] __attribute__((aligned(32)));
    static float b[1024] __attribute__((aligned(32)));
    for (int i = 0; i < 1024; ++i) { a[i] = 1.0f; b[i] = 2.0f; }
    printf("%.1f\\n", dot_avx2(a, b, 1024));       /* 期望 2048.0 */
    return 0;
}` },

    { t: 'p', html: '三个细节值得注意。<b>对齐</b>：<code>_mm256_load_ps</code> 要求 32 字节对齐，否则触发通用保护错误；不确定时用 <code>_mm256_loadu_ps</code>（稍慢，但在现代 CPU 上差距很小）。<b>FMA</b>：<code>fmadd</code> 把乘加合成一条指令，既快又少一次舍入，但需要 CPU 支持（<code>-mfma</code>）。<b>尾部</b>：n 不是 8 的倍数时要用标量循环收尾，真实代码里这个「尾巴」常是 bug 来源。' },

    { t: 'h', lvl: 2, text: '六、向量化的三个障碍：别名、分支、跨步访存', id: 'ch04-6' },

    { t: 'p', html: '编译器比你想的保守：只要不能证明「这样变换结果不变」，它就不向量化。三个最常见的拦路虎：<b>指针别名</b>（编译器不知道 <code>a</code> 与 <code>b</code> 是否指向同一块内存，怕写 <code>a[i]</code> 改变 <code>b[i]</code>）、<b>分支</b>（不同元素走不同路径，只能退化成掩码或标量）、<b>非连续访存</b>（跨步访问无法打包进向量寄存器）。' },

    { t: 'table', head: ['障碍', '表现', '修法'], rows: [
      ['指针别名', '循环体内同时读写多个指针，编译器不敢重排', '加 restrict 限定符，或用局部变量承接'],
      ['数据依赖', 'a[i] 依赖 a[i-1]（循环携带依赖）', '改写为前缀和算法，或拆成两趟'],
      ['分支', 'if 条件随 i 变化，各 lane 路径不同', '用无分支写法（select/掩码），或按条件分桶'],
      ['非连续访存', '按列访问二维数组、AoS 结构体', '循环交换、改成 SoA 布局、预打包'],
      ['函数调用', '循环里调用了无内联的外部函数', '加 inline，或用向量数学库（如 SLEEF）']
    ], caption: 'GCC 用 -fopt-info-vec-optimized / -vec-missed 报告哪些循环被向量化、为什么没' },

    { t: 'compare', left: { title: '自动向量化', html: '写朴素循环，编译选项 -O3 -march=native -ffast-math（慎用，会改变浮点语义）。优点是跨平台、可读；缺点是对别名和分支无能为力，且优化随编译器版本漂移。' }, right: { title: '手写 intrinsics', html: '用 _mm256_* 显式控制。优点是能处理复杂场景、性能可预测；缺点是绑定指令集、可读性差、需要自己处理对齐与尾部。' } },

    { t: 'p', html: '还有一个容易被忽略的限制：<b><code>-ffast-math</code> 会允许编译器重排浮点加法</b>，从而让归约循环可向量化。代价是结果不再严格符合 IEEE 754（可能改变最后几位），对科学计算可能不可接受。正确做法是只在确认数值容差允许时启用，并在文档里写明；不要全局打开。' },

    { t: 'h', lvl: 2, text: '七、调优：分块、循环交换与验证向量化', id: 'ch04-7' },

    { t: 'p', html: '一个实用的调优顺序是：<b>先确认并行生效（线程数、加速比），再确认向量化生效（报告、反汇编），最后调数据布局</b>。跳过前两步直接改算法，往往在错误的层面上优化。下面这段编译命令把三件事一次做完：开优化、开原生指令集、把向量化决策打印出来。' },

    { t: 'code', lang: 'bash', caption: '编译、看向量化报告、对比不同线程数的加速比', code: `# 1) 编译：-O3 开优化，-march=native 用本机指令集，-fopenmp 开线程
gcc -O3 -march=native -fopenmp -o dot dot.c

# 2) 向量化报告：哪些循环成功、哪些因为什么失败
gcc -O3 -march=native -fopt-info-vec-optimized -fopt-info-vec-missed -c dot.c

# 3) 扩展性：固定 N，扫描线程数
for t in 1 2 4 8 16; do
  OMP_NUM_THREADS=$t OMP_PROC_BIND=close ./dot 1<<24
done

# 4) 确认真的用了 AVX：反汇编里应出现 vfmadd / vmulps
objdump -d dot | grep -E "vfmadd|vmulps|vaddps" | head` },

    { t: 'p', html: '分块（blocking）是这个顺序里收益最大的一步，尤其对矩阵乘。朴素三重循环的访存模式会让 B 的每一列都被反复从主存拉取；按 64×64 分块后，一块 A、一块 B 能常驻 L2，复用次数从 O(N) 提到 O(N/64)，<b>实测常能带来 3–10 倍提升，且与线程数无关</b>。分块大小要选得让「三块数据」刚好放进 L2（通常 256 KB–1 MB），太大反而溢出。' },

    { t: 'p', html: '最后是验证。两个数字能说明问题：<b>向量化率</b>（被向量化的循环占比）与<b>相对峰值的百分比</b>（实测 FLOP/s ÷ 理论峰值）。如果线程数增加但性能不动，先怀疑内存带宽饱和（ch01 的 roofline）；如果单线程就远低于峰值，先怀疑向量化没生效。把这两个数字写进实验报告，比「我用了 OpenMP」有说服力得多。' },

    { t: 'quiz', qid: 'ch04-q3' },

    { t: 'terms', items: [
      { en: 'fork-join', zh: '分叉-汇合', html: 'OpenMP 的执行模型：主线程在 parallel 区域分叉出线程组，区域结束汇合。' },
      { en: 'reduction', zh: '归约', html: '每个线程维护私有副本，退出时按运算符合并，避免在循环内加锁。' },
      { en: 'schedule', zh: '调度', html: '把循环迭代分配给线程的策略：static、dynamic、guided 等。' },
      { en: 'collapse', zh: '折叠', html: '把多层嵌套循环合并成一个迭代空间再划分，提高并行粒度。' },
      { en: 'loop tiling', zh: '循环分块', html: '把大循环切成能放进缓存的小块，提高数据复用、降低带宽压力。' },
      { en: 'intrinsics', zh: '内建函数', html: '直接映射到 SIMD 指令的 C 函数，如 _mm256_fmadd_ps。' },
      { en: 'pointer aliasing', zh: '指针别名', html: '多个指针可能指向同一内存，编译器因此不敢重排或向量化。' }
    ] },

    { t: 'keypoint', items: [
      { title: '默认共享是最大的坑', html: '循环内临时变量必须 private；累加用 reduction，不要用 critical。' },
      { title: 'reduction 的同步是 O(p) 不是 O(N)', html: '私有副本 + 树形合并，比每次迭代加锁快几十倍。' },
      { title: '调度要匹配负载分布', html: '规则循环用 static，不规则用 dynamic/guided，chunk 取 8–64。' },
      { title: '向量化需要编译器能证明等价', html: '别名用 restrict、分支改无分支、跨步改布局，并用 -fopt-info-vec 验证。' },
      { title: '分块是最大的单点收益', html: '矩阵乘按缓存大小分块，常带来 3–10 倍，且不依赖线程数。' }
    ] },

    { t: 'checklist', id: 'ch04', items: [
      '我能解释 fork-join 模型，并说出 parallel 与 parallel for 的区别',
      '我知道编译时忘了 -fopenmp 会发生什么，以及怎样确认线程数',
      '我能判断一个循环里哪些变量必须 private、哪些必须 shared',
      '我能写出 reduction 版本的点积，并解释它为什么比 critical 快',
      '我能按负载特征选择 static/dynamic/guided，并说出 chunk 的影响',
      '我能用 collapse(2) 解决外层迭代数不足的问题',
      '我能说出向量化的三个主要障碍，并各给一个修法',
      '我能读懂 -fopt-info-vec-missed 的输出，定位未向量化的原因',
      '我能解释分块为什么能提升矩阵乘性能，以及块大小怎么选',
      '我知道 -ffast-math 的代价，不会在未确认数值容差时全局启用'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 OpenMP（Ch.7）与 Vector SIMD Instructions（Ch.6）两份讲义组织，并参考了 OpenACC 与 Triton 讲义中「把循环交给编译器/加速器」的思路：OpenMP 是 CPU 侧的线程制导，OpenACC 把同样的制导思想扩展到加速器，Triton 则在 Python 层生成 GPU kernel。本章只覆盖 CPU 侧的 OpenMP 与 x86 SIMD，GPU 的线程层次与共享内存在 ch06 讲。文中「3–6 倍」「3–10 倍」为典型实测区间，具体取决于 CPU 型号、数据规模与访存模式，作业请以自己机器上的测量为准。' }
  ]
});
