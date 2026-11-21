/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * title 必须与各章 chXX.js 里的 title 逐字一致。
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：操作系统在管什么', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：操作系统管什么、八章怎么衔接、内核态与用户态为何存在，以及本站的用法。' },

  { id: 'ch01', num: '01', title: '进程与系统调用：程序怎么跑起来', en: 'PROCESSES & SYSTEM CALLS', part: 'Part II · 基础', week: 2, minutes: 100, icon: 'cpu', labs: 2,
    blurb: '从开机第一条指令走到 shell：进程是什么、fork/exec/wait 的语义、陷阱帧与上下文切换。' },

  { id: 'ch02', num: '02', title: '线程与 CPU 调度：谁在决定下一个', en: 'THREADS & SCHEDULING', part: 'Part II · 基础', week: 3, minutes: 110, icon: 'repeat', labs: 2,
    blurb: '线程共享什么、切换要付多少代价、FCFS/SJF/SRTF/RR 怎么手算，以及多核队列与优先级反转。' },

  { id: 'ch03', num: '03', title: '同步与死锁：共享数据的秩序', en: 'SYNCHRONIZATION & DEADLOCK', part: 'Part III · 深入', week: 4, minutes: 120, icon: 'layers', labs: 2,
    blurb: '竞争条件从哪来、临界区三条件、自旋锁与睡眠锁的分工、条件变量、死锁四条件与银行家算法。' },

  { id: 'ch04', num: '04', title: '虚拟内存与页表：每个进程一个假世界', en: 'VIRTUAL MEMORY & PAGE TABLES', part: 'Part III · 深入', week: 5, minutes: 120, icon: 'memory', labs: 2,
    blurb: '虚拟地址怎么翻译、Sv39 三级页表怎么拆、TLB 与 sfence.vma、缺页与写时复制、内核空间与 trampoline。' },

  { id: 'ch05', num: '05', title: '物理内存与页面替换：帧不够用怎么办', en: 'PHYSICAL MEMORY & REPLACEMENT', part: 'Part III · 深入', week: 6, minutes: 110, icon: 'grid', labs: 1,
    blurb: '空闲链表与伙伴系统、kalloc/kfree、FIFO/LRU/Clock 的缺页手算、Belady 异常、抖动与工作集。' },

  { id: 'ch06', num: '06', title: '文件系统与持久化：从 inode 到崩溃一致', en: 'FILE SYSTEMS & CRASH CONSISTENCY', part: 'Part IV · 综合', week: 7, minutes: 120, icon: 'box', labs: 2,
    blurb: 'inode 与目录项、路径解析、fd 三层结构、磁盘布局、日志四步提交，以及 write 与 fsync 的区别。' },

  { id: 'ch07', num: '07', title: 'xv6 综合：把内核读成一台机器', en: 'XV6 SYNTHESIS', part: 'Part IV · 综合', week: 8, minutes: 130, icon: 'target', labs: 2,
    blurb: '启动链 entry→start→main、内核文件地图、一次系统调用与一次时钟中断的完整旅程、锁纪律与症状定位。' }
]);
