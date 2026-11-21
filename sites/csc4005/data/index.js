/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * 说明：title 必须与 data/chXX.js 里的 title 逐字一致。
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：从摩尔定律失效到千核并行', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先摊开整门课的地图：为什么主频停了、并行有哪几种硬件形态、八章依赖关系，以及四条学习线怎么配合。' },
  { id: 'ch01', num: '01', title: '并行计算为什么必要：体系结构与性能标尺', en: 'ARCHITECTURES & PERFORMANCE METRICS', part: 'Part II · 基础', week: 2, minutes: 100, icon: 'cpu', labs: 1,
    blurb: '从 Flynn 分类、存储层次与内存墙讲到 Amdahl、强/弱扩展与 roofline：建立一把能判断「该不该并行、上限在哪」的标尺。' },
  { id: 'ch02', num: '02', title: '把问题拆开：分解、并行模式与 EPC', en: 'DECOMPOSITION, PATTERNS & EPC', part: 'Part II · 基础', week: 3, minutes: 90, icon: 'grid', labs: 1,
    blurb: '四种分解方式、五种并行模式、粒度与 α-β 模型、DAG 关键路径：把「怎么拆」变成可以按步骤执行的方法。' },
  { id: 'ch03', num: '03', title: '共享内存与同步：线程、锁与内存模型', en: 'SHARED MEMORY & SYNCHRONIZATION', part: 'Part III · 深入', week: 4, minutes: 110, icon: 'memory', labs: 1,
    blurb: 'Pthreads 的读改写为何丢更新、条件变量怎么用、伪共享与死锁怎么破，以及 x86 TSO 与原子操作的实际含义。' },
  { id: 'ch04', num: '04', title: '循环并行与向量化：OpenMP 与 SIMD', en: 'OPENMP & SIMD VECTORIZATION', part: 'Part III · 深入', week: 5, minutes: 110, icon: 'layers', labs: 1,
    blurb: 'fork-join、数据作用域、调度与 collapse、reduction，再到 AVX2 intrinsics 与向量化的三大障碍：把循环推到峰值。' },
  { id: 'ch05', num: '05', title: '消息传递：MPI 与分布式内存', en: 'MESSAGE PASSING & MPI', part: 'Part III · 深入', week: 7, minutes: 110, icon: 'repeat', labs: 1,
    blurb: 'SPMD 骨架、点对点与集合通信、环形死锁的三种解法、非阻塞重叠与强弱扩展：写出能跨机器扩展的程序。' },
  { id: 'ch06', num: '06', title: 'GPU 与 CUDA：十万线程的调度与访存', en: 'GPU & CUDA PROGRAMMING', part: 'Part IV · 综合', week: 9, minutes: 120, icon: 'zap', labs: 1,
    blurb: 'SM 与 warp、grid/block 的映射、合并访存与 bank 冲突、warp shuffle 归约、占用率与 ncu 指标：以 warp 为单位思考。' },
  { id: 'ch07', num: '07', title: '综合：并行排序、搜索与性能剖析', en: 'SORTING, SEARCHING & PROFILING', part: 'Part IV · 综合', week: 11, minutes: 120, icon: 'chart', labs: 1,
    blurb: '双调与基数排序、空间哈希加速邻居搜索、从 2.1× 到 7.4× 的优化案例，以及一份能复现的实验报告该怎么写。' }
]);
