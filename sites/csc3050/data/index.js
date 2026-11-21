/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * 说明：title 必须与各章 chXX.js 中的 title 逐字一致。
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：从晶体管到并行程序', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：计算机抽象层次、七章如何咬合、这门课怎样评分与怎样学。' },
  { id: 'ch01', num: '01', title: '数制与数据表示：位、补码与浮点', en: 'BITS & NUMBER SYSTEMS', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'grid', labs: 1,
    blurb: '同样 32 个 0/1，为什么可以是 42、-42、3.14 或一条指令？从进位制到 IEEE 754 把「位」讲透。' },
  { id: 'ch02', num: '02', title: 'RISC-V 指令系统与调用约定', en: 'RISC-V ISA & ABI', part: 'Part II · 基础', week: 3, minutes: 90, icon: 'code', labs: 1,
    blurb: '把 C 语句翻译成 RV32I 汇编：六种指令格式、load/store、分支跳转、栈帧与 caller/callee 约定。' },
  { id: 'ch03', num: '03', title: '处理器数据通路：一条指令如何走完', en: 'DATAPATH & CONTROL', part: 'Part III · 深入', week: 4, minutes: 100, icon: 'cpu', labs: 1,
    blurb: '从 PC、寄存器堆、ALU 到数据存储器，逐个部件搭出单周期 RV32I，并读出每条控制信号的来历。' },
  { id: 'ch04', num: '04', title: '流水线与冒险：让指令重叠起来', en: 'PIPELINE & HAZARDS', part: 'Part III · 深入', week: 5, minutes: 100, icon: 'repeat', labs: 1,
    blurb: '五级流水、流水寄存器、forwarding、load-use 停顿与分支预测：把 CPI 从 1 压回接近 1。' },
  { id: 'ch05', num: '05', title: '存储层次与 Cache：为什么程序会「看起来很快」', en: 'MEMORY HIERARCHY', part: 'Part III · 深入', week: 6, minutes: 110, icon: 'memory', labs: 1,
    blurb: '局部性、直接映射与组相联、地址拆分、AMAT、写策略，再到虚拟内存、页表与 TLB。' },
  { id: 'ch06', num: '06', title: '链接与加载：从 .c 到可执行进程', en: 'LINKING & LOADING', part: 'Part IV · 综合', week: 7, minutes: 100, icon: 'layers', labs: 1,
    blurb: '预处理、编译、汇编、链接、加载五步走完：ELF 段、符号表、重定位、静态库、动态链接与进程地址空间。' },
  { id: 'ch07', num: '07', title: '性能与并行：从 CPI 到多核', en: 'PERFORMANCE & PARALLELISM', part: 'Part IV · 综合', week: 8, minutes: 110, icon: 'rocket', labs: 1,
    blurb: '用 CPU 时间公式与 Amdahl 定律判断优化上限，再理解 ILP、SIMD、多线程、GPU 与缓存一致性。' }
]);
