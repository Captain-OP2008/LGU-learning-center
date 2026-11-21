/* =====================================================================
 * ch07.js · 第 7 章「xv6 综合：把内核读成一台机器」
 * 职责：把前六章的知识接到同一份代码上，训练「给场景、找代码」的能力。
 * 依据：xv6 教材第 1–8 章 + 课程 Tutorial 材料 + 历年期末题型
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch07',
  num: '07',
  title: 'xv6 综合：把内核读成一台机器',
  en: 'XV6 SYNTHESIS',
  goals: [
    '按启动顺序说出 <code>entry → start → main</code> 各做了什么，并解释为什么要从机器模式降到监管模式',
    '画出一次系统调用从用户态到返回的完整路径，指出每一步在哪个文件',
    '给出一个内核 bug 现象，能在 xv6 源码里定位到大概率的文件与函数',
    '说出 xv6 的三条锁纪律，并用它们解释一个死锁场景',
    '把前六章的概念（进程、调度、同步、页表、文件）对应到具体代码位置'
  ],
  kp: [
    { id: 'ch07-1', title: '启动链：entry、start 与 main' },
    { id: 'ch07-2', title: '内核文件地图' },
    { id: 'ch07-3', title: '一次系统调用的完整旅程' },
    { id: 'ch07-4', title: '一次时钟中断的完整旅程' },
    { id: 'ch07-5', title: '锁的层次与死锁避免' },
    { id: 'ch07-6', title: '从现象到代码：定位 bug 的方法' },
    { id: 'ch07-7', title: '综合题型：给场景找代码' },
    { id: 'ch07-8', title: '复习路线与自检' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么最后一章要「读代码」而不是「再讲一遍概念」', html: '前六章各自独立时，考卷上的题往往是「给一个现象，问哪里出问题」。这类题考的不是背诵，而是<b>能否把现象映射到代码位置</b>：看到「进程卡住不退出」想到 <code>wait</code> 与僵尸链，看到「读到旧数据」想到缓存与 <code>sfence.vma</code>，看到「文件系统变成只读」想到日志空间耗尽。这一章就是把概念、代码、症状三者接起来。' },

    { t: 'p', lead: true, html: 'xv6 只有大约九千行，但麻雀虽小：它有进程、调度、锁、页表、陷阱、文件系统、日志、设备驱动。读它的正确方式不是从头到尾，而是<b>沿着一条路径走完一次</b>——比如从「用户调用 <code>write</code>」一路追到磁盘。这一章给你四条路径和一张地图，剩下的是你自己动手。' },

    { t: 'h', lvl: 2, text: '一、启动链：entry、start 与 main', id: 'ch07-1' },

    { t: 'p', html: 'QEMU 把内核加载到 <code>0x80000000</code>，从 <code>entry</code> 开始执行。此时还在<b>机器模式</b>（M-mode），没有页表、没有栈、只有一个 hart 在跑。<code>entry.S</code> 做的第一件事是设置栈指针：把 <code>stack0 + 4096</code> 装进 <code>sp</code>，然后跳到 <code>start()</code>。' },

    { t: 'p', html: '<code>start()</code> 还在 M-mode，它做四件事：把 <code>mstatus</code> 的 MPP 位设成 S（表示 <code>mret</code> 之后进入监管模式）、把 <code>mepc</code> 设成 <code>main</code> 的地址、把 <code>satp</code> 清零（先关页表）、把异常与中断委托给 S-mode（<code>medeleg</code>/<code>mideleg</code>），最后 <code>mret</code>。<b>这一条 <code>mret</code> 就是「从机器模式掉到监管模式」的开关</b>，之后内核再也回不到 M-mode。' },

    { t: 'code', lang: 'c', caption: 'start()：把返回地址设成 main，然后 mret 下去', code: 'void start() {\n  // 设置 MPP = S，mret 后进入监管模式\n  unsigned long x = r_mstatus();\n  x &amp;= ~MSTATUS_MPP_MASK;\n  x |= MSTATUS_MPP_S;\n  w_mstatus(x);\n\n  w_mepc((uint64)main);      // mret 之后从这里继续\n  w_satp(0);                 // 先关页表，main 里再开\n  w_medeleg(0xffff);         // 异常委托给 S-mode\n  w_mideleg(0xffff);         // 中断委托给 S-mode\n  asm volatile("mret");\n}' },

    { t: 'p', html: '<code>main()</code> 是一张初始化清单，顺序不能乱：<code>consoleinit</code> 让 printf 能用；<code>kinit</code> 建立物理页分配器（之后才能分配页表）；<code>kvminit</code> + <code>kvminithart</code> 建立内核页表并写 <code>satp</code>；<code>procinit</code> 分配进程表与内核栈；<code>trapinit</code>/<code>trapinithart</code> 设置 <code>stvec</code>；然后是 PLIC、buffer cache、inode、file、virtio 磁盘；最后 <code>userinit()</code> 造出第一个进程，<code>scheduler()</code> 开始调度。<b>顺序错一步就会在初始化阶段空指针</b>，因为后面的子系统依赖前面的。' },

    { t: 'h', lvl: 2, text: '二、内核文件地图', id: 'ch07-2' },

    { t: 'p', html: '读代码前先记住「哪个文件管什么」。这张表是整门课的地图，考试里问「XXX 在哪实现」直接查它。' },

    { t: 'table', head: ['文件', '职责', '关键符号'], rows: [
      ['entry.S / start.c', '机器模式初始化，降到 S-mode', '<code>entry</code>、<code>start</code>、<code>mret</code>'],
      ['main.c', '按序初始化各子系统，启动调度', '<code>main</code>、<code>userinit</code>'],
      ['proc.c', '进程表、调度、fork/exit/wait、sleep/wakeup', '<code>struct proc</code>、<code>scheduler</code>'],
      ['trap.c', '陷阱入口与返回，分派到 syscall 或设备', '<code>usertrap</code>、<code>usertrapret</code>'],
      ['syscall.c', '系统调用编号表与参数取出', '<code>syscalls[]</code>、<code>argint</code>'],
      ['vm.c', '页表遍历、映射、跨空间拷贝', '<code>walk</code>、<code>mappages</code>、<code>copyout</code>'],
      ['kalloc.c', '物理页分配与空闲链表', '<code>kalloc</code>、<code>kfree</code>'],
      ['fs.c / log.c', 'inode、目录、路径解析与日志事务', '<code>namex</code>、<code>commit</code>'],
      ['bio.c / file.c', '块缓存、fd 与打开文件表', '<code>bread</code>、<code>filewrite</code>'],
      ['spinlock.c / sleeplock.c', '自旋锁与睡眠锁', '<code>acquire</code>、<code>sleep</code>']
    ], caption: '十个文件覆盖了考卷上九成的「这在哪实现」' },

    { t: 'p', html: '读的时候抓住三条主线：<b>控制流</b>（谁调用谁）、<b>数据流</b>（参数从用户地址怎么变成内核地址）、<b>锁流</b>（进入某个函数时持有哪些锁）。三条线里最容易忽略的是锁流，而它恰恰是 bug 的高发区。' },

    { t: 'h', lvl: 2, text: '三、一次系统调用的完整旅程', id: 'ch07-3' },

    { t: 'p', html: '以 <code>write(fd, buf, n)</code> 为例，从用户态走一遍。用户代码把编号 16 放进 <code>a7</code>，参数放进 <code>a0/a1/a2</code>，执行 <code>ecall</code>。硬件切换到 S-mode，跳 <code>stvec</code> 指向的 <code>usertrap</code>。<b>记住：<code>ecall</code> 不是函数调用，它不保存返回地址到 ra，而是把现场存进 <code>trapframe</code></b>。' },

    { t: 'steps', items: [
      { title: '① usertrap 判断来源', html: '读 <code>scause</code>，等于 8 表示「用户态 ecall」，于是把 <code>epc</code> 加 4（跳过 ecall 指令），调用 <code>syscall()</code>。' },
      { title: '② syscall 查表', html: '从 <code>p->trapframe->a7</code> 取编号，查 <code>syscalls[num]</code> 得到函数指针并调用，返回值写回 <code>a0</code>。编号越界就 <code>kill</code> 进程。' },
      { title: '③ sys_write 取参数', html: '<code>argint(0, &amp;fd)</code>、<code>argaddr(1, &amp;p)</code> 从 trapframe 里取参数；<code>argfd</code> 把 fd 换成 <code>struct file*</code>。' },
      { title: '④ filewrite 分派', html: '按 <code>f->type</code> 分流：管道走 <code>pipewrite</code>，inode 走 <code>writei</code>；后者按逻辑块号算真实块，再交给 <code>bread</code>/<code>bwrite</code>。' },
      { title: '⑤ 回到 usertrapret', html: '<code>usertrapret</code> 设置 <code>sstatus</code> 的 SPP、<code>sepc = epc</code>、<code>stvec</code>，最后 <code>sret</code> 回到用户态，<code>a0</code> 里就是返回值。' }
    ] },

    { t: 'p', html: '两个细节常被考到。第一，<b>用户指针不能直接解引用</b>：内核要通过 <code>copyout</code>/<code>copyin</code> 在「当前进程的页表」下访问，这会触发 <code>walk</code>，参数非法时返回 -1 而不是让内核崩溃。<b>第二，<code>epc + 4</code> 是必须的</b>，否则返回后会重新执行 <code>ecall</code>，变成死循环。' },

    { t: 'h', lvl: 2, text: '四、一次时钟中断的完整旅程', id: 'ch07-4' },

    { t: 'p', html: '时钟中断是「抢占」的物理来源。定时器触发后，硬件跳 <code>stvec</code>；<b>因为此刻在用户态，用的还是 <code>usertrap</code></b>。<code>usertrap</code> 看到 <code>scause</code> 的最高位为 1，说明是中断，于是调用 <code>devintr()</code>；它识别出是机器定时器（<code>scause == 0x8000000000000001</code>），调用 <code>clockintr()</code>，后者把 <code>ticks</code> 加一并唤醒 <code>ticksleep</code> 上的进程。' },

    { t: 'p', html: '关键在下一步：<code>usertrap</code> 检查 <code>which_dev == 2</code>（定时器），于是<b>把 <code>p->killed</code> 不动，却设置 <code>yield()</code> 的条件</b>——xv6 在这里直接调用 <code>yield()</code>，让当前进程主动让出 CPU。这解释了为什么一个死循环的进程不会独占机器：<b>它每 1/10 秒被打断一次并让出 CPU</b>。' },

    { t: 'code', lang: 'c', caption: 'usertrap：ecall 走系统调用，其它中断走设备，都不是就杀掉', code: 'void usertrap(void) {\n  intr_on();\n  w_stvec((uint64)kernelvec);\n  struct proc *p = myproc();\n  p->trapframe->epc = r_sepc();\n\n  if (r_scause() == 8) {              // 用户态 ecall\n    if (p->killed) exit(-1);\n    p->trapframe->epc += 4;           // 跳过 ecall，否则死循环\n    intr_on();\n    syscall();\n  } else if ((which_dev = devintr()) != 0) {\n    if (which_dev == 2) yield();      // 定时器：让出 CPU\n  } else {\n    printf("usertrap: unexpected scause %p\\n", r_scause());\n    setkilled(p);                     // 段错误等：杀掉\n  }\n  if (killed(p)) exit(-1);\n  usertrapret();\n}' },

    { t: 'p', html: '如果中断发生在<b>内核态</b>，硬件跳的是 <code>kernelvec</code>（<code>stvec</code> 在进入内核后被改成它），走 <code>kerneltrap</code>，此时<b>不能 <code>yield</code></b>——内核正持有可能的锁，切换出去会死锁。所以内核态的中断只处理设备、不改调度。这个不对称是理解「为什么 <code>acquire</code> 要关中断」的关键：如果在持锁时被定时器打断并让出，另一个进程来抢同一把锁就会自旋到永远。' },

    { t: 'h', lvl: 2, text: '五、锁的层次与死锁避免', id: 'ch07-5' },

    { t: 'p', html: 'xv6 的锁纪律可以浓缩成三条：<b>① 持自旋锁时不能睡眠</b>（不能调用 <code>sleep</code>、不能等 I/O、不能 <code>sbrk</code>）；<b>② <code>acquire</code> 要关中断</b>，防止同一 CPU 上被中断后重入；<b>③ 加锁顺序要一致</b>，任何两条路径都不能以相反顺序拿同一对锁。' },

    { t: 'compare', left: { title: '自旋锁 spinlock', html: '忙等不睡眠，可用于中断上下文；持锁期间必须极短；xv6 里保护进程表、块缓存、日志。' }, right: { title: '睡眠锁 sleeplock', html: '拿不到就让出 CPU，内部用自旋锁加 <code>sleep</code> 实现；可用于长时间操作；xv6 里保护 inode。' } },

    { t: 'p', html: '一个典型死锁：进程 A 持有 <code>wait_lock</code> 时调用 <code>wakeup</code>，而 <code>wakeup</code> 内部要拿每个进程的 <code>lock</code>；同时进程 B 持有某个 <code>p->lock</code> 又在等 <code>wait_lock</code>。两边都进不去。<b>xv6 的规矩是：<code>wait_lock</code> 只用来保护 <code>p->parent</code> 与 <code>p->state</code> 的读写，拿到之后立刻放掉再做别的事</b>。这条「锁的持有范围尽量小」的纪律比任何具体顺序都重要。' },

    { t: 'p', html: '另一个常考的点：<b>为什么 <code>acquire</code> 要 <code>push_off</code> 而不是只 <code>intr_off</code></b>？因为可能嵌套加锁，直接开中断会把外层锁的保护也打开。<code>push_off</code> 用 <code>noff</code> 计数，只有最外层 <code>pop_off</code> 到 0 才真正开中断。这是「嵌套安全」的标准做法。' },

    { t: 'h', lvl: 2, text: '六、从现象到代码：定位 bug 的方法', id: 'ch07-6' },

    { t: 'p', html: '给一个症状，先在脑子里过「哪一层最可能」：<b>panic 带 <code>scause</code></b> 通常是用户指针没走 <code>copyout</code> 或页表没映射；<b>卡死但 CPU 不忙</b>说明在睡眠且没人唤醒；<b>卡死且 CPU 100%</b> 说明自旋锁死锁或不关中断；<b>数据不对但没崩</b>说明缺内存屏障或少了 <code>sfence.vma</code>；<b>文件系统变只读</b>通常是日志区写满或 <code>begin_op</code> 没配对的 <code>end_op</code>。' },

    { t: 'table', head: ['现象', '最可能的位置', '第一件事查什么'], rows: [
      ['内核 panic，scause=13/15', 'vm.c 的 copyout、用户指针直接解引用', '是否走 copyin/copyout'],
      ['进程永久卡住，CPU 空闲', 'sleep/wakeup 配对、wait 的唤醒', '谁该 wakeup 却没调'],
      ['CPU 占满但无进展', 'spinlock 死锁、或持锁时没关中断', 'acquire 是否 push_off'],
      ['新映射不生效，读到旧页', 'vm.c 改页表后没刷 TLB', '有没有 sfence.vma'],
      ['文件系统报 no space', 'log.c 的日志空间、位图耗尽', 'outstanding 与 log 大小'],
      ['fork 后子进程跑飞', 'proc.c 的 trapframe 复制', '是否逐字段拷贝'],
      ['调度后寄存器错乱', 'swtch.S 的 callee-saved 约定', 's0–s11 是否都存了']
    ], caption: '这张表的作用是「缩小范围」，不是直接给答案' },

    { t: 'p', html: '定位之后再读代码，顺序建议：<b>先看它拿了什么锁、再看它访问了什么共享数据、最后看它的调用者持有什么锁</b>。绝大多数并发 bug 都能在「锁与被保护数据的对应关系」这一步暴露。如果还看不出来，就在可疑位置加 <code>printf</code>（xv6 里 <code>printf</code> 是安全的），或者用 <code>gdb</code> 连 QEMU 单步。' },

    { t: 'h', lvl: 2, text: '七、综合题型：给场景找代码', id: 'ch07-7' },

    { t: 'p', html: '期末的综合性大题通常长这样：给一段场景描述或一段代码，问「会发生什么」「哪里错了」「怎么改」。下面三个是典型模板，练的是同一套推理。' },

    { t: 'p', html: '<b>模板一：加法与锁。</b>给两个进程各自执行 <code>x++</code> 一千次，问最终值。答案不是 2000，因为 <code>x++</code> 是读—改—写三步，中间可能被抢占。要正确必须让整个读改写处于同一临界区（锁或原子指令）。<b>考点在「临界区要覆盖整个操作，而不是只覆盖写」</b>。' },

    { t: 'p', html: '<b>模板二：缺 <code>sfence.vma</code>。</b>给了改 PTE 的代码但没刷 TLB，问「新映射什么时候生效」。答案是「不确定，取决于 TLB 何时被替换」，在 xv6 里必须在改完页表后执行 <code>sfence.vma zero, zero</code>。<b>考点是「页表在内存里，MMU 用的是缓存」</b>。' },

    { t: 'p', html: '<b>模板三：在持锁时 sleep。</b>给了 <code>acquire(&amp;lk); sleep(&amp;chan, &amp;lk);</code> 的变体但锁传错，问后果。答案是别的进程永远拿不到锁，或者唤醒后带着错误的锁继续跑，两种都会死锁。<b>考点是 <code>sleep</code> 的语义：它原子地放锁并睡眠，醒来时重新拿锁</b>。' },

    { t: 'p', html: '解这类题的通用步骤：① 标出所有共享数据；② 标出每段访问是否在临界区内；③ 检查临界区边界是否覆盖完整的读改写；④ 检查锁顺序与睡眠点；⑤ 检查页表/TLB 与内存屏障这类「看不见的状态」。五步走完，答案基本就出来了。' },

    { t: 'h', lvl: 2, text: '八、复习路线与自检', id: 'ch07-8' },

    { t: 'p', html: '如果只剩一天，按这个顺序复习：<b>进程与系统调用</b>（ch01，手写 fork/exec/wait 的输出判断）→ <b>调度</b>（ch02，会算 FCFS/SJF/SRTF/RR 的平均等待时间）→ <b>同步</b>（ch03，会写信号量解法、会判死锁）→ <b>页表</b>（ch04，会把虚拟地址拆成三段、会算页表大小）→ <b>页面替换</b>（ch05，会数缺页次数、知道 Belady 异常）→ <b>文件系统</b>（ch06，会算文件上限、会讲日志四步）。' },

    { t: 'p', html: '最后提醒两个易混点。<b>第一，虚拟内存与物理内存不是一回事</b>：<code>malloc</code> 成功只代表虚拟地址空间有了，物理页要等第一次访问才分配（按需调页）。<b>第二，线程与进程的差别不在「有没有地址空间」这句话本身</b>，而在切换开销与共享粒度：同进程线程共享页表与 fd 表，切换不用换 <code>satp</code>，所以快。' },

    { t: 'quiz', qid: 'ch07-q1' },
    { t: 'quiz', qid: 'ch07-q2' },
    { t: 'quiz', qid: 'ch07-q3' },

    { t: 'terms', items: [
      { en: 'M-mode / S-mode', zh: '机器模式 / 监管模式', html: 'RISC-V 的两级特权，启动时在 M-mode，<code>mret</code> 后进入 S-mode 跑内核。' },
      { en: 'trapframe', zh: '陷阱帧', html: '每进程一页，保存用户寄存器现场，系统调用参数从这里取。' },
      { en: 'stvec', zh: '陷阱向量', html: '指向陷阱入口，用户态时为 <code>usertrap</code>，内核态时换成 <code>kernelvec</code>。' },
      { en: 'ecall', zh: '环境调用', html: '用户态主动进内核的指令，不保存 ra，靠 trapframe 保存现场。' },
      { en: 'yield', zh: '让出 CPU', html: '把进程状态改成 RUNNABLE 并调用调度器，定时器中断里触发。' },
      { en: 'push_off / pop_off', zh: '中断计数', html: '嵌套安全的关中断方式，计数归零才真正开中断。' }
    ] },

    { t: 'keypoint', items: [
      { title: 'boot 三跳：entry → start → main', html: '<code>mret</code> 是 M-mode 到 S-mode 的唯一开关。' },
      { title: '系统调用五步', html: 'ecall → usertrap（epc+4）→ syscall 查表 → sys_xxx 取参 → sret 返回。' },
      { title: '用户态与内核态的陷阱不对称', html: '用户态可 yield，内核态不可，因为可能持锁。' },
      { title: '锁纪律三条', html: '持锁不睡眠、加锁关中断、顺序一致且范围尽量小。' },
      { title: '症状 → 文件', html: 'panic 查 vm.c，卡死查 proc.c 与锁，旧数据查 TLB。' }
    ] },

    { t: 'checklist', id: 'ch07', items: [
      '我能按顺序说出 <code>entry → start → main</code> 各做了什么',
      '我能解释 <code>mret</code> 前后特权级与页表状态的变化',
      '我能说出至少八个内核文件各自的职责',
      '我能完整走一遍 <code>write</code> 的系统调用路径，并指出 <code>epc + 4</code> 的作用',
      '我能解释时钟中断为什么会导致 <code>yield</code>，以及内核态为什么不行',
      '我能说出三条锁纪律并举一个违反它们的死锁例子',
      '我能把「进程卡住」「读到旧页」「文件系统只读」三类症状对应到文件',
      '我能用五步法解「给场景找 bug」的题',
      '我能不看笔记列出六个易混点并各说一句区别'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章是全课的收束，依据 xv6 教材第 1 章（Operating system interfaces）与第 2–8 章的实现说明组织；启动链与 <code>usertrap</code> 代码取自 xv6-riscv 的 <code>entry.S</code>、<code>start.c</code>、<code>main.c</code>、<code>trap.c</code> 并做了注释化简化；文件职责表按课程提供的源码目录整理。症状定位表是经验总结，用于缩小排查范围，不构成严格诊断。本章不涉及多核一致性协议的硬件细节、RISC-V 特权规范全文与真实硬件的中断控制器编程，需要时请查规范原文。' }
  ]
});
