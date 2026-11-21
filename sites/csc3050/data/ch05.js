/* =====================================================================
 * ch05.js · 第 5 章「存储层次与 Cache：为什么程序会「看起来很快」」
 * 职责：存储层次、局部性、Cache 组织与地址拆分、AMAT、替换/写策略、
 *       虚拟内存与 TLB、分块优化。
 * 依据：Chapter 5 Memory Hierarchy、5.6/5.7 VM、Cache quiz 讲义
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch05',
  num: '05',
  title: '存储层次与 Cache：为什么程序会「看起来很快」',
  en: 'MEMORY HIERARCHY & CACHE',
  goals: [
    '用局部性解释存储层次为什么有效，并说出各级的容量/延迟数量级',
    '把 32 位地址拆成 tag/index/offset，算出一个 Cache 的组数、块数与标记位数',
    '区分直接映射、组相联、全相联，判断给定访问序列的命中与替换',
    '用 AMAT 公式比较多级 Cache 的配置，并解释 3C 失配模型',
    '说清虚拟内存、页表、TLB 与 Cache 的配合，以及分块（blocking）为什么能提速'
  ],
  kp: [
    { id: 'ch05-1', title: '存储层次与局部性' },
    { id: 'ch05-2', title: 'Cache 的基本结构与地址拆分' },
    { id: 'ch05-3', title: '直接映射、组相联与全相联' },
    { id: 'ch05-4', title: '替换策略与写策略' },
    { id: 'ch05-5', title: 'AMAT 与 3C 失配模型' },
    { id: 'ch05-6', title: '虚拟内存、页表与 TLB' },
    { id: 'ch05-7', title: '存储墙与分块优化' },
    { id: 'ch05-8', title: '测量、模拟与 Project #4' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么程序「看起来」比内存快', html: 'CPU 一条指令不到 1 纳秒，而一次 DRAM 访问要几十到上百纳秒。如果每条 load 都直接访问 DRAM，流水线会停成一条直线。程序之所以还能跑得快，是因为<b>大多数访问都在 Cache 里命中</b>。第 04 章的 load-use 停顿只有 1 拍，前提是「load 能在 L1 命中」；一旦 miss，代价是几十拍。Project #4 要你写一个 Cache 模拟器，考试里则常考地址拆分与 AMAT。' },

    { t: 'p', lead: true, html: '存储层次的核心思想只有一句话：<b>用少量快而贵的存储器，缓存大量慢而便宜的存储器里的热点数据</b>。它之所以有效，不是因为运气，而是因为程序有<b>局部性</b>——时间上刚用过的还会再用，空间上相邻的很可能接着用。这一章从局部性出发，讲到 Cache 的组织、地址拆分、替换与写策略，最后接到虚拟内存与分块优化。' },

    { t: 'h', lvl: 2, text: '一、存储层次与局部性', id: 'ch05-1' },

    { t: 'p', html: '<b>时间局部性</b>：刚访问过的指令或数据，很可能马上再被访问（循环变量、循环体指令）。<b>空间局部性</b>：访问了地址 x，很可能接着访问 x+4、x+8（数组、顺序执行的指令）。这两条经验规律让「把最近用过的块搬到快存储器」成为高命中率的策略。' },

    { t: 'table', head: ['层级', '典型容量', '典型延迟', '由谁管理'], rows: [
      ['寄存器', '几十到几百字节', '< 1 ns', '编译器'],
      ['L1 Cache', '32–64 KiB', '1–4 ns（约 4 拍）', '硬件'],
      ['L2 Cache', '256 KiB–2 MiB', '10–20 ns', '硬件'],
      ['L3 Cache', '几 MiB–几十 MiB', '30–50 ns', '硬件'],
      ['DRAM', '几 GiB–几百 GiB', '50–100 ns', '硬件 + OS'],
      ['SSD / 磁盘', '几百 GiB–几 TiB', '几十 µs–几 ms', 'OS + 程序']
    ], caption: '越往上越快越贵越小；层次存在的意义是「用上层的速度访问下层的数据」' },

    { t: 'p', html: '注意「延迟」与「带宽」是两件事：DRAM 的带宽可以很高（一次传一整行），但单次访问的延迟仍有几十纳秒。Cache 命中之所以关键，是因为它把<b>延迟</b>降下来了；而预取、突发传输优化的是<b>带宽</b>。考试里问「为什么多级 Cache 有效」，答的是「用 L2 的带宽/容量补 L1 的命中率，同时不让每次 miss 都付 DRAM 延迟」。' },

    { t: 'code', lang: 'c', title: '用步长实验感受 Cache：stride 越大越慢', code: [
      '#include <stdio.h>',
      '#include <stdlib.h>',
      '#include <time.h>',
      '',
      '#define N (64 * 1024 * 1024)   /* 64M 个 int，远超 LLC */',
      '',
      'static double run(int stride) {',
      '    int *a = malloc(N * sizeof(int));',
      '    if (!a) return -1;',
      '    for (int i = 0; i < N; i++) a[i] = i;',
      '',
      '    struct timespec t0, t1;',
      '    clock_gettime(CLOCK_MONOTONIC, &t0);',
      '    volatile long sum = 0;',
      '    for (int i = 0; i < N; i += stride) sum += a[i];',
      '    clock_gettime(CLOCK_MONOTONIC, &t1);',
      '',
      '    double ms = (t1.tv_sec - t0.tv_sec) * 1e3 +',
      '                (t1.tv_nsec - t0.tv_nsec) / 1e6;',
      '    free(a);',
      '    return ms / (N / stride);   /* 每次访问的平均毫秒 */',
      '}',
      '',
      'int main(void) {',
      '    for (int s = 1; s <= 32; s *= 2)',
      '        printf("stride %2d: %.6f ms/access\\n", s, run(s));',
      '    return 0;',
      '}'
    ] },

    { t: 'p', html: '你会看到 stride=1 时每次访问只要几纳秒（Cache 命中 + 预取），stride 增大到超过一个 Cache 块（通常 64 字节 = 16 个 int）后，每次访问都几乎是一次新的 miss，平均时间跳到几十纳秒。这个实验不能精确测出 Cache 参数，但足以让你「感觉到」块大小与空间局部性的存在。' },

    { t: 'h', lvl: 2, text: '二、Cache 的基本结构与地址拆分', id: 'ch05-2' },

    { t: 'p', html: 'Cache 把下层存储器划分成固定大小的<b>块（block/line）</b>，通常是 32 或 64 字节。每个 Cache 行包含三部分：<b>有效位 V</b>（这一行有没有被填过）、<b>标记 tag</b>（这一行装的是哪一块）、<b>数据 data</b>（整块内容）。访问时，用地址的一部分选出「可能在哪一行」，再用 tag 比较确认「是不是它」。' },

    { t: 'p', html: '32 位地址被拆成三段：<b>offset</b> 选块内字节（块大小 2ᵇ → b 位）；<b>index</b> 选组（组数 2ˢ → s 位）；剩下的高位是 <b>tag</b>。直接映射时「组」就是「行」，index 直接选行；组相联时一组有多行，index 选组、组内再并行比较多个 tag。' },

    { t: 'table', head: ['配置', '块大小', '组数', 'index 位', 'offset 位', 'tag 位'], rows: [
      ['16 KiB，直接映射，32 B 块', '32 B', '512', '9', '5', '18'],
      ['32 KiB，4 路组相联，64 B 块', '64 B', '128', '7', '6', '19'],
      ['64 KiB，8 路组相联，64 B 块', '64 B', '128', '7', '6', '19'],
      ['32 KiB，全相联，64 B 块', '64 B', '1', '0', '6', '26']
    ], caption: '先算块数 = 容量/块大小，再算组数 = 块数/相联度；tag = 32 − index − offset' },

    { t: 'p', html: '以「32 KiB、4 路、64 B 块」为例：块数 = 32768/64 = 512；组数 = 512/4 = 128 = 2⁷，所以 index 7 位；offset = log₂64 = 6 位；tag = 32−7−6 = 19 位。每个 Cache 行的存储开销是 <code>1（有效位）+ 19（tag）+ 512（数据位）</code>，不是只有数据。考试常问「总位数是多少」，别忘了有效位、tag、甚至 dirty 位与 LRU 位。' },

    { t: 'p', html: '命中判断的顺序是：用 index 找到组 → 并行比较组内所有行的 tag 与有效位 → 有一个相等且 V=1 就命中 → 用 offset 从块里取出字节。若都不匹配，就是 miss：从下一级取回整块，选一行替换（直接映射没得选，组相联要按策略挑）。' },

    { t: 'code', lang: 'c', title: '一个直接映射 Cache 的命中/替换模型', code: [
      '#include <stdio.h>',
      '#include <stdint.h>',
      '',
      '#define NUM_LINES 512          /* 16 KiB / 32 B */',
      '#define BLOCK_SIZE 32',
      '',
      'typedef struct {',
      '    int      valid;',
      '    uint32_t tag;',
      '    uint32_t lru;              /* 仅作演示，直接映射用不到 */',
      '} line_t;',
      '',
      'static line_t cache[NUM_LINES];',
      'static int hits, misses;',
      '',
      '/* 返回 1 表示命中，0 表示缺失 */',
      'static int access(uint32_t addr) {',
      '    uint32_t offset = addr & (BLOCK_SIZE - 1);',
      '    uint32_t index  = (addr >> 5) & (NUM_LINES - 1);',
      '    uint32_t tag    = addr >> 14;   /* 5 + 9 = 14 */',
      '    line_t *l = &cache[index];',
      '    (void)offset;',
      '',
      '    if (l->valid && l->tag == tag) {',
      '        hits++;',
      '        return 1;',
      '    }',
      '    misses++;',
      '    l->valid = 1;',
      '    l->tag = tag;',
      '    return 0;',
      '}',
      '',
      'int main(void) {',
      '    /* 同一块内不同字节：第一次 miss，之后 hit */',
      '    for (uint32_t a = 0; a < 32; a += 4) access(a);',
      '    printf("hits=%d misses=%d\\n", hits, misses);',
      '    return 0;',
      '}'
    ] },

    { t: 'callout', kind: 'tip', title: '地址拆分的快速自检', html: '① 容量 ÷ 块大小 = 总行数；② 总行数 ÷ 相联度 = 组数；③ index 位 = log₂(组数)；④ offset 位 = log₂(块大小)；⑤ tag 位 = 32 − index − offset。四步算完，再检查「tag + index + offset = 32」。' },

    { t: 'h', lvl: 2, text: '三、直接映射、组相联与全相联', id: 'ch05-3' },

    { t: 'p', html: '<b>直接映射</b>：每个块只能放到唯一一行（index 决定）。硬件最简单、查找最快，但<b>冲突 miss</b> 严重：两个频繁交替访问、index 相同的地址会互相踢出。极端例子是两个数组的起始地址相差正好是 Cache 容量的整数倍，访问 <code>a[i]</code> 与 <code>b[i]</code> 会不停替换。' },

    { t: 'p', html: '<b>全相联</b>：任何块可以放任何行，冲突 miss 为 0，但需要与所有行并行比较 tag，硬件昂贵，只适合小容量（如 TLB、小 L1）。<b>组相联</b>是折中：每组 K 行（K 路），块只能进特定组，但组内可选任意行。K 越大，冲突越少，比较器与替换逻辑越复杂。' },

    { t: 'table', head: ['组织', '块的放置', '查找', '冲突 miss', '典型用途'], rows: [
      ['直接映射', '唯一一行', '一个比较器', '高', '大容量、低成本 L1/L2'],
      ['组相联（K 路）', '特定组内任一行', 'K 个并行比较器', '中', '现代 L1/L2/L3 主流'],
      ['全相联', '任意一行', '全部行并行比较', '无', 'TLB、小容量全相联 Cache']
    ], caption: '相联度是「冲突 miss」与「硬件成本」之间的旋钮；现代处理器多在 4–16 路' },

    { t: 'steps', items: [
      { title: '例：2 路组相联，4 组，访问 A B A C', html: 'A 映射到组 0，放 way0；B 也映射组 0，放 way1；A 再访问，命中 way0；C 映射组 0，需替换——按 LRU 踢掉 B（A 刚用过），C 放 way1。' },
      { title: '若改成直接映射（4 行）', html: 'A→行 0，B→行 0 踢掉 A，A 再访问 miss 踢掉 B，C→行 0 再踢。同样的序列 4 次访问 4 次 miss，这就是冲突 miss。' },
      { title: '若改成全相联（4 行）', html: 'A、B、C 各占一行，A 第二次访问命中；只有容量满时才替换。冲突 miss 为 0，但比较器要同时比 4 个 tag。' }
    ] },

    { t: 'p', html: '这里的关键结论是：<b>相联度不能消除「冷启动」与「容量不足」，只能消除「冲突」</b>。一个循环的工作集（working set）如果大于 Cache 容量，再怎么组相联也会不停 miss——这叫容量 miss，下一节会用 3C 模型区分。' },

    { t: 'h', lvl: 2, text: '四、替换策略与写策略', id: 'ch05-4' },

    { t: 'p', html: '组相联与全相联需要<b>替换策略</b>：组满了该踢谁？最常用的是 <b>LRU（最近最少使用）</b>，基于时间局部性；但精确 LRU 需要为每行维护年龄，K 大时成本高，实际常用<b>伪 LRU</b>（二叉树近似）或随机替换。FIFO 实现简单，但可能踢掉即将使用的块。' },

    { t: 'table', head: ['策略', '依据', '优点', '缺点'], rows: [
      ['LRU', '最久未使用', '符合时间局部性，命中率高', '精确实现成本随相联度上升'],
      ['伪 LRU', '近似 LRU（如树形）', '成本低，接近 LRU', '极端序列下仍可能退化'],
      ['随机', '随机选一行', '实现最简单', '不可预测，命中率略低'],
      ['FIFO', '最早进入', '实现简单', '可能踢掉热点块（Belady 异常）']
    ], caption: '考试常考 2 路 LRU 的手工模拟：记住「命中也要更新年龄」' },

    { t: 'p', html: '<b>写策略</b>分两组维度：写命中时，<b>写直达（write-through）</b>同时写 Cache 与下一级，简单但流量大；<b>写回（write-back）</b>只写 Cache 并置 dirty 位，替换时才写回，流量小但需要 dirty 位与更复杂的控制。写缺失时，<b>写分配（write-allocate）</b>先把块取进 Cache 再写，适合写回；<b>不写分配（no-write-allocate）</b>直接写到下一级，适合写直达。' },

    { t: 'table', head: ['组合', '写命中', '写缺失', '典型场景'], rows: [
      ['写回 + 写分配', '只写 Cache，置 dirty', '取块进 Cache 再写', '现代 CPU 的 L1/L2 主流'],
      ['写直达 + 不写分配', '同时写 Cache 与下级', '直接写下级，不取块', '简单、易保持一致'],
      ['写回 + 不写分配', '只写 Cache', '直接写下级', '少见，语义较绕'],
      ['写直达 + 写分配', '同时写', '取块再写', '较少见，流量最大']
    ], caption: 'dirty 位记录「Cache 比下级新」；替换时必须先写回，否则数据丢失' },

    { t: 'p', html: '多核时代写策略还与<b>一致性（coherence）</b>有关：写直达让其他核更容易 snoop 到更新，写回则要额外的失效/更新协议。第 07 章会简单提到 MESI，但课程重点仍是单核 Cache 的命中率与 AMAT。' },

    { t: 'h', lvl: 2, text: '五、AMAT 与 3C 失配模型', id: 'ch05-5' },

    { t: 'p', html: '评价 Cache 的核心指标是<b>平均访存时间 AMAT</b>：<code>AMAT = 命中时间 + 缺失率 × 缺失代价</code>。命中时间是从 Cache 取数的时间（通常 1–4 拍）；缺失代价是从下一级取回整块并填入的时间。注意缺失率是「每次访问 miss 的概率」，不是「每条指令」。' },

    { t: 'table', head: ['配置', '命中时间', '缺失率', '缺失代价', 'AMAT'], rows: [
      ['L1 理想', '1 拍', '0%', '—', '1 拍'],
      ['L1 真实', '1 拍', '5%', '50 拍', '1 + 0.05×50 = 3.5 拍'],
      ['加 L2 后', '1 拍', 'L1 5%，L2 20%', 'L2 10 拍，DRAM 100 拍', '1 + 0.05×(10 + 0.2×100) = 2.5 拍'],
      ['L1 变大但更慢', '2 拍', '3%', '50 拍', '2 + 0.03×50 = 3.5 拍']
    ], caption: '最后一行说明：命中率变好不一定更快，命中时间也是成本；Cache 设计是平衡术' },

    { t: 'p', html: '把 miss 分成三类（<b>3C</b>）：<b>Compulsory（强制）</b>——第一次访问，冷启动，无法避免；<b>Capacity（容量）</b>——工作集大于 Cache，即使全相联也会 miss；<b>Conflict（冲突）</b>——组相联度不够，多个块争同一组。增大容量减少容量 miss，提高相联度减少冲突 miss，预取/增加块大小可缓解强制 miss（但块太大会增加缺失代价与污染）。' },

    { t: 'p', html: '块大小也是一个旋钮：块越大，空间局部性利用越好，强制 miss 相对减少；但块太大，取回时间长、Cache 行数变少（冲突增加），还可能把不用的数据拉进来（pollution）。现代 L1 多为 64 B，L2/L3 可能更大。考试里常给一串地址，让你算命中率并判断属于哪类 miss。' },

    { t: 'compare', left: { title: '提高命中率', html: '增大容量、提高相联度、优化块大小、预取、改善程序局部性（分块、重排循环）。' }, right: { title: '降低缺失代价', html: '多级 Cache、提前开始取数（early restart）、临界字优先、写回减少下级流量。' } },

    { t: 'h', lvl: 2, text: '六、虚拟内存、页表与 TLB', id: 'ch05-6' },

    { t: 'p', html: '虚拟内存给每个进程一个独立的地址空间：程序用<b>虚拟地址</b>，MMU 通过<b>页表</b>把它翻译成<b>物理地址</b>。页通常是 4 KiB，地址被拆成 VPN（虚拟页号）与 offset；页表项（PTE）存物理页号与权限位（可读/可写/可执行/用户）。翻译失败就是<b>缺页</b>，由 OS 把页从磁盘换入。' },

    { t: 'p', html: '页表本身可能很大，于是用多级页表（RV32 常见两级，Sv32）按需分配；翻译又要多读几次内存，于是用 <b>TLB</b> 缓存最近的翻译。TLB 是「页表项的 Cache」，通常全相联或高相联，命中则一次翻译完成；miss 才走页表遍历（page walk）。' },

    { t: 'table', head: ['对比', 'Cache', '虚拟内存'], rows: [
      ['管理单位', '块（32/64 B）', '页（4 KiB）'],
      ['管理者', '硬件', 'OS + 硬件（MMU）'],
      ['miss 代价', '几十拍', '缺页：毫秒级'],
      ['替换策略', 'LRU/伪 LRU/随机', '近似 LRU、工作集、clock'],
      ['地址', '物理地址或虚拟地址', '虚拟→物理翻译'],
      ['目标', '降低平均访存延迟', '隔离、保护、超额分配']
    ], caption: '两者思想同源（局部性 + 层次），但管理者与代价量级不同' },

    { t: 'p', html: '虚拟地址还带来一个设计选择：Cache 用虚拟地址还是物理地址索引？用虚拟地址可以在翻译完成前就开始查 Cache（快），但同名虚拟地址可能映射到不同物理页（别名问题）；用物理地址简单一致，但要等 TLB。实际处理器常用 VIPT（虚拟索引、物理标记），兼顾速度与正确性。' },

    { t: 'p', html: '页表项里的权限位是保护的基础：用户态访问内核页、写只读页、执行不可执行页，都会触发异常。这也是为什么缓冲区溢出能变成攻击——覆盖返回地址后跳到攻击者指定的代码，而 NX 位与 ASLR 正是针对这类攻击的缓解。第 06 章讲链接与加载时会再看到地址空间布局。' },

    { t: 'h', lvl: 2, text: '七、存储墙与分块优化', id: 'ch05-7' },

    { t: 'p', html: '处理器性能每年提升，DRAM 延迟却几乎不变，这个差距叫<b>存储墙（memory wall）</b>。它意味着：<b>算法复杂度相同，访存模式不同，性能可能差几倍</b>。矩阵乘法是经典例子：按行访问 A、按列访问 B 会导致 B 的每次访问都跨一个 Cache 块，命中率极低；分块后让子矩阵留在 Cache 里，命中率大幅提升。' },

    { t: 'code', lang: 'c', title: '矩阵乘法的分块（blocking）优化', code: [
      '#define N 512',
      '#define B 32',
      '',
      '/* 朴素版本：i-k-j 顺序，B 按列访问，空间局部性差 */',
      'void matmul_naive(double C[N][N], double A[N][N], double Bm[N][N]) {',
      '    for (int i = 0; i < N; i++)',
      '        for (int j = 0; j < N; j++) {',
      '            double s = 0;',
      '            for (int k = 0; k < N; k++)',
      '                s += A[i][k] * Bm[k][j];',
      '            C[i][j] = s;',
      '        }',
      '}',
      '',
      '/* 分块版本：每次处理一个 B×B 子块，让三个子矩阵留在 L1/L2 */',
      'void matmul_blocked(double C[N][N], double A[N][N], double Bm[N][N]) {',
      '    for (int ii = 0; ii < N; ii += B)',
      '        for (int kk = 0; kk < N; kk += B)',
      '            for (int jj = 0; jj < N; jj += B)',
      '                for (int i = ii; i < ii + B; i++)',
      '                    for (int k = kk; k < kk + B; k++) {',
      '                        double a = A[i][k];',
      '                        for (int j = jj; j < jj + B; j++)',
      '                            C[i][j] += a * Bm[k][j];',
      '                    }',
      '}'
    ] },

    { t: 'p', html: '分块的本质是<b>提高工作集的局部性</b>：把大矩阵切成能装进 Cache 的小块，让块内反复重用的数据不被踢出。块大小 B 要选得让「一个 A 子块 + 一个 B 子块 + 一个 C 子块」能放进目标 Cache；太大装不下，太小则循环开销高。这个技巧在 GPU 的 shared memory 优化里同样出现（第 07 章）。' },

    { t: 'p', html: '除了分块，还有几种常见优化：<b>循环交换</b>（把最内层换成步长为 1 的维度）、<b>数组合并</b>（把频繁一起访问的字段放同一 Cache 块，AoS vs SoA）、<b>对齐</b>（避免跨块访问）、<b>预取</b>（硬件或软件提前取下一块）。它们都围绕同一个目标：<b>让每次 miss 都值得，让每次命中都发生在热点上</b>。' },

    { t: 'h', lvl: 2, text: '八、测量、模拟与 Project #4', id: 'ch05-8' },

    { t: 'p', html: '真实处理器有性能计数器（如 <code>perf stat</code> 的 cache-misses、cache-references），可以直接测命中率；但没有计数器时，就用<b>模拟器</b>：给一串地址访问序列与 Cache 参数，模拟每次访问的命中/替换，统计命中率、AMAT 与总周期。Project #4 就是这样一个数据 Cache 模拟器。' },

    { t: 'p', html: '实现要点：① 正确拆分地址（tag/index/offset）；② 处理有效位与 tag 比较；③ 组相联的替换（LRU 或指定策略）；④ 写策略（写回要 dirty 位，写分配要决定 miss 时是否取块）；⑤ 统计口径（命中率按访问次数还是按指令数）。最容易错的是「块内不同地址只算一次 miss」与「写命中是否算访问」。' },

    { t: 'p', html: '把这一章收束：<b>存储层次用局部性把「慢而大」伪装成「快而小」；Cache 的每个参数（容量、块大小、相联度、替换、写策略）都是在命中率、命中时间与硬件成本之间做取舍。</b>下一章离开「运行时」，看一个程序从源代码到进程要经过编译、汇编、链接、加载四步——那时你会再次遇到地址：链接器如何重定位、加载器如何映射页、动态库如何共享。' },

    { t: 'terms', items: [
      { en: 'locality', zh: '局部性', html: '时间局部性（刚用过还会用）与空间局部性（相邻地址会被用），是层次存储有效的前提。' },
      { en: 'cache line', zh: 'Cache 行/块', html: 'Cache 与下级之间传输的最小单位，含有效位、tag 与数据。' },
      { en: 'direct-mapped', zh: '直接映射', html: '每个块只能放唯一一行，硬件简单但冲突 miss 高。' },
      { en: 'set-associative', zh: '组相联', html: '块映射到固定组、组内可选任意行；相联度是冲突与成本的折中。' },
      { en: 'LRU', zh: '最近最少使用', html: '替换最久未被访问的行；命中也要更新年龄。' },
      { en: 'write-back', zh: '写回', html: '写命中只改 Cache 并置 dirty，替换时才写回下级。' },
      { en: 'AMAT', zh: '平均访存时间', html: 'AMAT = 命中时间 + 缺失率 × 缺失代价；多级 Cache 可嵌套计算。' },
      { en: 'TLB', zh: '快表', html: '缓存虚拟页到物理页的翻译，命中则跳过页表遍历。' }
    ] },

    { t: 'quiz', qid: 'ch05-q1' },
    { t: 'quiz', qid: 'ch05-q2' },
    { t: 'quiz', qid: 'ch05-q3' },

    { t: 'keypoint', items: [
      { title: '局部性是一切的前提', html: '没有时间/空间局部性，Cache 只会增加开销；分块与循环顺序都是在制造局部性。' },
      { title: '地址拆成 tag/index/offset', html: '块数=容量/块大小，组数=块数/相联度，tag=32−index−offset。' },
      { title: '相联度只治冲突 miss', html: '冷启动与容量不足无法靠提高相联度解决；3C 模型用来定位瓶颈。' },
      { title: 'AMAT 是平衡术', html: '命中率变好不一定更快；命中时间、缺失代价、块大小都要一起算。' },
      { title: '虚拟内存是另一层 Cache', html: '页表/TLB 管翻译与保护，缺页代价比 Cache miss 高几个数量级。' }
    ] },

    { t: 'checklist', id: 'ch05', items: [
      '我能用时间/空间局部性解释为什么循环数组访问快、指针追逐慢',
      '我能把 32 位地址拆成 tag/index/offset，并算出总存储位数',
      '我能模拟 2 路组相联 + LRU 的一串访问，写出每次命中/替换',
      '我能区分 3C miss，并说出每种该用什么手段减少',
      '我能用 AMAT 公式比较单级与两级 Cache 的配置',
      '我能解释写回与写直达、写分配与不写分配的搭配',
      '我能说清虚拟地址翻译、页表、TLB 与缺页的流程',
      '我能写出矩阵乘法的分块版本，并解释 B 如何选'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 CUHKSZ CSC3050 Chapter 5《Memory Hierarchy》与《Section 5.6–5.7 Virtual Memory》讲义，并参考 Patterson & Hennessy《Computer Organization and Design》RISC-V Edition 第 5 章与 CS:APP 第 6 章。Cache 参数（32 KiB、64 B 块、4 路等）为教学示例，具体数值以题目给出为准；写策略组合在不同教材中命名略有差异，本章按「写命中/写缺失」两个维度讲解。虚拟内存以 RV32 Sv32 两级页表与 4 KiB 页为背景，TLB 组织与 VIPT 只作概念介绍。Project #4 的模拟器规格（替换策略、写策略、统计口径）以课程 PDF 为准，本章给出的是通用实现要点。' }
  ]
});
