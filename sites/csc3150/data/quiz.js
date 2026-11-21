/* =====================================================================
 * quiz.js · CSC3150 分章题库
 * 结构：{ items:[{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options?, answer?, accept?, code?, codeTitle?, explain }] }
 * 题型：mcq / tf / fill / multi / predict
 * 覆盖：ch00–ch07，每章 7 题，共 56 题
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '如果把操作系统看成一层「抽象 + 资源管理 + 隔离」的软件，下面哪一项最不属于它的核心职责？',
        options: [
          { text: '把磁盘块抽象成文件与目录' },
          { text: '在多个进程之间分配 CPU 与内存' },
          { text: '阻止用户程序直接改写别的进程的页表' },
          { text: '决定浏览器的网页渲染布局是否美观', correct: true }
        ],
        explain: '前三条分别对应抽象、资源管理与隔离，是内核存在的根本理由。网页排版属于应用层职责，操作系统只提供窗口、文件、网络等机制，不规定应用内部的呈现逻辑。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '用户态程序可以直接执行修改 <code>satp</code>、关中断这类特权指令，只要它知道寄存器地址。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '特权指令在用户态执行会触发非法指令异常，硬件把控制权交给内核的陷阱处理器。这正是「隔离」的硬件基础：不是靠约定，而是靠特权级检查。用户要改页表只能通过系统调用请求内核代做。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '用户程序从用户态进入内核态的唯一正常入口是 ______（一种由指令主动触发的异常）。',
        answer: '陷阱',
        accept: ['trap', '陷阱（trap）', 'trap 指令', '系统调用'],
        explain: '页面错误、除零、时钟中断也会进内核，但那些是「被动」发生的；用户主动请求服务只能靠 ecall 这类陷阱指令，进内核后由 syscall 分派表决定执行哪个系统调用。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '本站把八章内容压在三条主线上，下面哪一组最准确？',
        options: [
          { text: '编译、链接、加载' },
          { text: '进程（谁在跑）、内存（数据放哪）、持久化（断电后还在）', correct: true },
          { text: '输入、处理、输出' },
          { text: '前端、后端、数据库' }
        ],
        explain: '进程与调度回答「CPU 给谁用」，虚拟内存与页面替换回答「地址怎么翻译、帧不够怎么办」，文件系统与日志回答「怎么把数据留住」。xv6 综合章则是把三条线放进同一份代码里。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'multi', difficulty: 3,
        tags: ['method'],
        stem: '读一个陌生的内核函数时，下面哪些步骤属于本站推荐的「四步法」？（多选）',
        options: [
          { text: '先找入口：谁会调用它，从哪个陷阱或系统调用进来', correct: true },
          { text: '追控制流：它又调用了谁，在哪里可能睡眠或返回', correct: true },
          { text: '看数据流：参数是用户地址还是内核地址，怎么校验', correct: true },
          { text: '查锁：进入函数时持有哪些锁，函数内部又拿了什么锁', correct: true },
          { text: '先把整个文件的所有函数名背下来再读' }
        ],
        explain: '四步法的作用是缩小范围：入口决定上下文，控制流决定阻塞点，数据流决定安全性，锁决定并发正确性。背函数名既费力又帮不上定位 bug，属于典型的低效读法。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 3, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '一个 <code>printf</code> 最终把字符送到屏幕，中间的层次顺序最接近下面哪一个？',
        options: [
          { text: '用户库缓冲 → <code>write</code> 系统调用 → 内核 fd/file → 设备驱动 → 硬件', correct: true },
          { text: '用户库 → 直接写显存 → 屏幕' },
          { text: '硬件中断 → 内核 → 用户库' },
          { text: '编译器 → 汇编器 → 链接器 → 屏幕' }
        ],
        explain: 'libc 先把格式化结果放进自己的缓冲区，必要时调用 write；内核按 fd 找到 struct file 与设备，交给驱动把字节写进 UART 寄存器。用户态无法直接碰硬件，所以中间必须有系统调用与驱动两层。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-8', tier: 2, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '本课程用一个精简的类 Unix 教学内核来读真实代码，它的名字是 ______。',
        answer: 'xv6',
        accept: ['xv6-riscv', 'XV6'],
        explain: 'xv6 由 MIT 为教学重写，约九千行，包含进程、调度、页表、陷阱、文件系统与日志，足以把操作系统的主要机制完整走一遍，又小到可以在一个学期内读完。'
      },

      /* ---------------- ch01 进程与系统调用 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'RISC-V 上电后执行的第一条内核指令处于哪种特权级？',
        options: [
          { text: '用户态（U-mode）' },
          { text: '监管态（S-mode）' },
          { text: '机器态（M-mode）', correct: true },
          { text: '虚拟机监控态（HS-mode）' }
        ],
        explain: '复位后硬件处于 M-mode，拥有全部权限。<code>start()</code> 设置 <code>mstatus.MPP = S</code> 与 <code>mepc = main</code>，再用 <code>mret</code> 降到 S-mode 跑内核。此后内核不再回 M-mode，特权级只会更低。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '调用 <code>fork()</code> 之后，如果返回值是 0，说明当前代码正在哪个进程里执行？',
        options: [
          { text: '父进程' },
          { text: '子进程', correct: true },
          { text: '两者都可能，取决于调度顺序' },
          { text: 'fork 失败，返回 0 表示错误' }
        ],
        explain: 'fork 在父进程里返回子进程 pid（大于 0），在子进程里返回 0，失败返回 -1。所以 <code>if (fork() == 0)</code> 分支就是子进程代码。子进程拿到的是父进程地址空间的副本，但返回值不同。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-4', tier: 3, type: 'predict', difficulty: 3,
        tags: ['code'],
        stem: '下面程序输出什么？（父进程里的 <code>wait(0)</code> 等到子进程结束才返回）',
        codeTitle: 'fork 之后变量是副本',
        code: 'int x = 1;\nif (fork() == 0) {\n  x++;\n  printf("%d", x);\n} else {\n  wait(0);\n  printf("%d", x);\n}',
        answer: '21',
        accept: ['2 然后 1', '2,1', '先 2 后 1'],
        explain: '子进程把副本里的 x 加到 2 并输出 2；父进程的 x 仍是 1，等子进程结束后输出 1。两个 x 位于各自的地址空间，互不影响——这正是「fork 复制地址空间」最直观的后果。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '系统调用的参数通过寄存器传入，内核从 <code>trapframe</code> 中把参数取出来，因此内核不能直接解引用用户传进来的指针。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '前半句对：a0–a5 里的参数在进陷阱时被存进 trapframe，<code>argint/argaddr</code> 就从中读取。后半句也对：用户指针可能指向未映射或内核不该碰的地址，必须用 <code>copyin/copyout</code> 在当前进程页表下安全访问。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '一个正在运行的进程被强制让出 CPU、状态变为 RUNNABLE，通常是因为时间片用完，这个事件是 ______。',
        answer: '时钟中断',
        accept: ['定时器中断', 'clock interrupt', 'timer interrupt', '时间片中断'],
        explain: '定时器每隔固定时间触发一次中断，陷阱处理里调用 <code>yield()</code> 把进程放回就绪队列并触发调度。没有这个中断，一个死循环就能永久霸占 CPU，抢占式调度也就无从谈起。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '关于管道（pipe），下面哪些描述是正确的？（多选）',
        options: [
          { text: '是单向的字节流，读端与写端各占一个 fd', correct: true },
          { text: '有固定大小的内核缓冲区，写满后写者阻塞', correct: true },
          { text: '能保留消息边界，读取方可以按消息切分', correct: false },
          { text: '父进程创建后，子进程通过继承的 fd 与自己通信', correct: true },
          { text: '支持随机访问，可以 seek 到中间某个字节', correct: false }
        ],
        explain: '管道是典型的有界字节流：没有消息边界，也不能 seek。它靠 fork 继承 fd 实现父子通信，靠缓冲区满/空时的 sleep/wakeup 实现同步。需要消息边界就得自己加长度前缀或改用消息队列。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-8', tier: 3, type: 'mcq', difficulty: 2,
        tags: ['debug'],
        stem: '父进程调用 <code>fork()</code> 之后从不调用 <code>wait()</code>，子进程先结束。会发生什么？',
        options: [
          { text: '子进程立刻被彻底销毁，不占任何资源' },
          { text: '子进程变成僵尸，进程表项一直占着直到父进程 wait 或退出', correct: true },
          { text: '父进程会被内核杀掉' },
          { text: '子进程会重新变成 RUNNABLE 继续运行' }
        ],
        explain: '子进程 exit 后要把退出码交给父进程，所以只释放内存与打开的文件，进程表项（僵尸态）保留。<code>wait</code> 取走退出码后才真正回收。父进程长期不 wait 会造成僵尸堆积、进程表耗尽。'
      },

      /* ---------------- ch02 线程与 CPU 调度 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '同一进程内的两个线程，下面哪一项是不共享的？',
        options: [
          { text: '全局变量与堆' },
          { text: '打开文件描述符表' },
          { text: '各自的栈与寄存器现场', correct: true },
          { text: '页表与地址空间' }
        ],
        explain: '线程共享地址空间（代码、全局区、堆、页表、fd 表），但每个线程必须有自己的栈与寄存器上下文，否则函数调用会互相踩栈。也正因为共享页表，线程切换不用换 <code>satp</code>，比进程切换便宜得多。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '同一进程内两个线程之间切换时，不需要修改 <code>satp</code>，也不需要刷新 TLB。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '因为共享同一个页表，切换只需保存/恢复寄存器与栈指针，地址空间不变，TLB 里的翻译依旧有效。这是线程比进程轻的核心原因；进程切换则要换 satp，通常还要刷 TLB，缓存也会被污染。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '所有作业同时到达、只看平均等待时间时，非抢占策略里最优的算法是 ______（中文名或英文缩写）。',
        answer: 'SJF',
        accept: ['短作业优先', 'SJF（短作业优先）', '短进程优先', 'SPN'],
        explain: '按运行时间从短到长排序能让短作业尽快完成，从而把平均等待时间压到最小。代价是长作业可能饿死，而且真实系统无法预知运行时间，只能靠历史估计。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '调度器面对的两个目标经常互相冲突，下面哪一对最典型？',
        options: [
          { text: '吞吐量与响应时间', correct: true },
          { text: '页表大小与 TLB 命中率' },
          { text: 'inode 数量与磁盘容量' },
          { text: '信号量数量与互斥性' }
        ],
        explain: '频繁切换能让交互任务更快得到响应，但切换本身有开销，会降低整体吞吐。调度策略本质是在这对矛盾里选一个偏向：批处理偏吞吐，交互系统偏响应，实时系统偏截止时间。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 3, type: 'multi', difficulty: 3,
        tags: ['concept'],
        stem: '一次进程上下文切换的开销主要来自哪些方面？（多选）',
        options: [
          { text: '保存与恢复通用寄存器、栈指针', correct: true },
          { text: '切换页表基址后 TLB 中的翻译失效', correct: true },
          { text: '新进程的工作集不在缓存里，需要重新预热', correct: true },
          { text: '必须把整个地址空间的数据复制一份', correct: false },
          { text: '必须让磁盘重新分区', correct: false }
        ],
        explain: '直接开销是寄存器保存恢复（几十到几百周期），真正的代价来自间接效应：换 satp 让 TLB 失效、缓存被新工作集挤掉，导致之后一段时间频繁访存。复制地址空间只在 fork 时发生（而且现在多用 COW），不是切换的常规成本。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '优先级反转指的是什么？',
        options: [
          { text: '低优先级任务持锁，高优先级任务等锁，中优先级任务抢走 CPU，导致高优先级任务被无限拖延', correct: true },
          { text: '调度器把优先级数值算反了' },
          { text: '高优先级任务永远拿不到 CPU' },
          { text: '时间片太短导致频繁切换' }
        ],
        explain: '经典例子是火星探路者：低优先级的通信任务持有互斥锁，高优先级的控制任务等这把锁，而中优先级的普通任务不停抢占 CPU，于是高优先级任务被「间接」饿死。解法是优先级继承或优先级天花板。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 3, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '多核机器上，每个 CPU 各自维护一个运行队列，而不是所有 CPU 抢一个全局队列，主要好处是减少 ______。',
        answer: '锁竞争',
        accept: ['争用', '锁争用', 'contention', '锁的开销'],
        explain: '全局队列意味着每次取任务都要拿同一把锁，核数一多就变成串行瓶颈。每核一队列把锁的粒度降到核内，代价是要做负载均衡（work stealing 或周期性迁移），否则会出现一核闲着、一核排队的局面。'
      },

      /* ---------------- ch03 同步与死锁 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '两个进程各执行 1000 次 <code>x++</code>，最终 x 常常小于 2000，根本原因是什么？',
        options: [
          { text: '<code>x++</code> 被编译成读、加、写三条指令，中间可能被抢占', correct: true },
          { text: '编译器把 x 优化掉了' },
          { text: '内存条坏了' },
          { text: '两个进程用的是不同的地址空间所以无法相加' }
        ],
        explain: '若两个进程共享 x，读—改—写之间插入另一个进程的读，两次写会互相覆盖，产生丢失更新。注意：如果 x 是各自地址空间里的变量，它们本来就不共享，那是另一回事；题设的考点正是共享变量的非原子访问。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '只要保证「同一时刻最多一个进程在临界区内」，临界区方案就一定正确。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '互斥只是三个条件之一。还要满足前进性（没有进程在临界区时，想进的必须能进，不能互相礼让到死）与有限等待（不能无限期排在门外）。只有互斥可能导致两个进程互相谦让、谁都不进，或者某个进程被无限饿死。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'fill', difficulty: 2,
        tags: ['code'],
        stem: 'xv6 的 <code>acquire</code> 在拿不到锁时会关中断，目的是防止同一 CPU 上中断处理程序重入后去抢同一把锁，造成 ______。',
        answer: '死锁',
        accept: ['自旋死锁', 'deadlock', '永久自旋'],
        explain: '如果锁已被本 CPU 上的代码持有，中断到来后处理程序又尝试 <code>acquire</code> 同一把锁，它会一直自旋等待一个永远不会释放的锁——单核上就是永久死锁。所以自旋锁的临界区必须「关中断 + 极短」，且不能睡眠。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '使用条件变量时，等待方为什么必须在 <code>while</code> 循环里重新检查条件，而不能只写一个 <code>if</code>？',
        options: [
          { text: '因为唤醒可能是虚假的，或条件在唤醒前已被别的线程改变', correct: true },
          { text: '因为 <code>if</code> 在 C 语言里不能配 <code>wait</code> 使用' },
          { text: '因为循环能提高 CPU 利用率' },
          { text: '因为条件变量本身会记住历史条件' }
        ],
        explain: '被唤醒只说明「条件可能变了」，不保证现在为真：可能被伪唤醒，也可能在你拿回锁之前另一个线程先一步消费了资源。用 while 重新判定才是安全的模板，这也是「丢失唤醒」与「惊群」问题的通用防线。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '死锁的四个必要条件包括哪些？（多选）',
        options: [
          { text: '互斥：资源一次只能被一个进程使用', correct: true },
          { text: '占有并等待：持有资源的同时申请新资源', correct: true },
          { text: '非抢占：资源不能被强行夺走', correct: true },
          { text: '循环等待：存在一个进程的环形等待链', correct: true },
          { text: '饥饿：低优先级进程长期得不到资源', correct: false }
        ],
        explain: '四条同时成立才可能死锁，所以破坏任意一条即可预防：资源可共享、一次性申请全部资源、允许抢占、按全局顺序编号申请。饥饿是调度不公，可能无限期但系统仍在推进，不属于死锁。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-7', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['calc'],
        stem: '银行家算法判定「安全」的含义是什么？',
        options: [
          { text: '存在一个进程序列，按该顺序逐个满足其最大需求后都能完成，最终所有进程都能结束', correct: true },
          { text: '当前每个进程的需求都小于系统总量' },
          { text: '当前没有进程在等待资源' },
          { text: '每个进程的已分配资源都等于其最大需求' }
        ],
        explain: '安全性是「至少存在一条让所有进程跑完的路径」，检查方法是反复找「剩余需求 ≤ 当前可用」的进程，假设它跑完并归还资源，直到找不到为止；找得到全部就是安全。注意安全状态不等于不会死锁的充要条件——不安全只是「可能」死锁。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-3', tier: 3, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: 'xv6 的睡眠锁（sleeplock）内部依赖一把自旋锁加 ______ 机制来实现「拿不到就让出 CPU」。',
        answer: 'sleep/wakeup',
        accept: ['睡眠唤醒', 'sleep 与 wakeup', 'sleep、wakeup', 'sleep wakeup'],
        explain: '睡眠锁 = 一把短自旋锁保护状态 + 一个睡眠通道。拿不到时调用 <code>sleep(lk, chan)</code> 原子地放锁并睡眠，释放方调用 <code>wakeup(chan)</code>。这样长临界区不必忙等，代价是只能在进程上下文使用，不能在中断处理里用。'
      },

      /* ---------------- ch04 虚拟内存与页表 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '虚拟内存带来的好处不包括下面哪一条？',
        options: [
          { text: '每个进程看到独立、连续的地址空间，互不干扰' },
          { text: '物理内存不够时可以借助磁盘超额分配' },
          { text: '让程序访问内存的速度超过物理内存的带宽', correct: true },
          { text: '方便共享代码页与实现写时复制' }
        ],
        explain: '地址翻译要多查页表，通常比直接访问物理内存更慢（靠 TLB 弥补），所以「更快」是错的。虚拟内存换来的是隔离、超额分配、共享与简化链接布局，这些是空间与抽象上的收益。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: 'Sv39 把 39 位虚拟地址拆成 VPN2、VPN1、VPN0 与页内偏移，其中页内偏移占 ______ 位。',
        answer: '12',
        accept: ['12 位', '十二'],
        explain: '页大小 4 KiB = 2^12，所以偏移 12 位；剩下 27 位平均分给三级页表，每级 9 位，正好 512 个表项，与 4 KiB 页装 512 个 8 字节 PTE 严丝合缝。这种「自相似」的设计让三级结构非常规整。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '页表项里的 <code>U</code> 位为 0 表示什么？',
        options: [
          { text: '该页只能在内核态访问，用户态访问会触发页面错误', correct: true },
          { text: '该页未被使用，可以释放' },
          { text: '该页可写' },
          { text: '该页被写时复制' }
        ],
        explain: 'U（User）位控制特权级：为 0 时只有 S-mode 能访问，用户态碰它会陷入陷阱。内核靠这一位保护自己的代码与数据，也是「用户指针必须用 copyout 校验」的硬件依据。有效位 V 才表示是否映射。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '修改了某个页表项之后，如果不清空 TLB 中对应的旧翻译，程序可能继续读到旧页。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'MMU 查的是 TLB 缓存，不是每次都读内存里的页表。改完 PTE 必须执行 <code>sfence.vma</code> 让相关翻译失效，否则硬件仍按旧映射访问。这类「看不见的状态」是内核 bug 的常见来源。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-6', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '写时复制（COW）在写入一个共享页时，内核的第一步动作是什么？',
        options: [
          { text: '分配一个新物理页，把原页内容复制过去，再把写者的映射指向新页并设为可写', correct: true },
          { text: '直接把该页权限改成可写，让两个进程共享修改' },
          { text: '把该页换出到磁盘' },
          { text: '杀掉正在写的进程' }
        ],
        explain: 'COW 让 fork 后父子暂时共享只读页，一旦有人写就触发保护性页面错误，内核复制一份私有副本并改权限。它把「复制整个地址空间」的成本推迟到真正写入的页，所以 fork 后立刻 exec 的场景几乎不花复制开销。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-5', tier: 3, type: 'multi', difficulty: 3,
        tags: ['concept'],
        stem: '从用户态陷入内核、再返回用户态的过程中，下面哪些是必须的？（多选）',
        options: [
          { text: '保存用户寄存器到 trapframe，返回时恢复', correct: true },
          { text: '切换到内核页表（或确保内核映射在当前页表中可见）', correct: true },
          { text: 'trampoline 在用户页表与内核页表中映射到同一个虚拟地址', correct: true },
          { text: '把整个用户地址空间复制到内核空间', correct: false },
          { text: '重新格式化磁盘', correct: false }
        ],
        explain: '切换页表时 <code>satp</code> 一改，正在执行的代码必须仍被映射，所以 trampoline 要在两个页表里同址映射；trapframe 保存现场；内核映射常驻当前页表以便不换 satp 也能进内核。复制地址空间既昂贵又没必要，内核直接用 copyin/copyout 访问用户内存。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 3, type: 'fill', difficulty: 3,
        tags: ['calc'],
        stem: '虚拟地址 <code>0x401000</code> 在 Sv39 下拆解：VPN2 = 0，VPN1 = 2，则 VPN0 = ______。',
        answer: '1',
        accept: ['1（0x1）', '0x1'],
        explain: '先右移 12 位得页号 0x401 = 1025，取低 9 位：1025 − 512×2 = 1，所以 VPN0 = 1。再验证：VPN1 = (0x401000 &gt;&gt; 21) &amp; 0x1FF = 2，VPN2 = 0，拼回去正好是 0x401000。'
      },

      /* ---------------- ch05 物理内存与页面替换 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '伙伴系统（buddy system）相比简单的空闲链表，最大的优势是什么？',
        options: [
          { text: '释放时能把相邻的空闲块逐级合并，缓解外部碎片', correct: true },
          { text: '分配一定比链表快十倍' },
          { text: '完全消除内部碎片' },
          { text: '不需要任何元数据' }
        ],
        explain: '伙伴系统按 2 的幂分块，释放时若「伙伴」也空闲就合并成更大的块，从而抑制外部碎片；代价是只能按 2 的幂分配，产生内部碎片，且元数据（每级的位图或链表）随内存增大而增大。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['code'],
        stem: 'xv6 的 <code>kfree</code> 只把页挂回空闲链表、不清理页内容。这直接带来什么风险？',
        options: [
          { text: '新分配的页里可能残留上一个进程的数据，造成信息泄漏', correct: true },
          { text: '会导致空闲链表长度算错' },
          { text: '会让物理内存变少' },
          { text: '会让页表无法建立' }
        ],
        explain: '页被重新分配后，旧内容仍在。如果内核把这样的页交给用户（例如栈或缓冲区），用户可能读到别人的密码或密钥。安全实现会在 <code>kalloc</code> 里清零或做 poison，代价是一点 memset 开销。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '只要虚拟地址空间足够大，就不需要页面替换算法。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '虚拟地址空间再大，也要落到有限的物理帧上。当所有帧都被占用、又发生缺页时，必须选一页换出去腾位置。替换算法的好坏直接决定缺页率，选错就会出现「换进来马上又被换出去」的抖动。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '在所有替换算法中缺页次数最少、但需要预知未来访问序列因而无法真正实现的是 ______ 算法。',
        answer: 'OPT',
        accept: ['最佳置换', '最优置换', 'OPT（最佳置换）', 'Belady 最优算法'],
        explain: 'OPT（又称 Belady 最优）总是换出「将来最晚才会被访问」的页，是理论下界，用来给实际算法打分。LRU 用「过去最久未用」近似「将来最晚使用」，效果接近但实现成本高，于是有了 Clock 这类近似。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-5', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['calc'],
        stem: '引用串 1 2 3 4 1 2 5 1 2 3 4 5，三个物理帧，FIFO 的缺页次数是多少？',
        options: [
          { text: '7' },
          { text: '9', correct: true },
          { text: '10' },
          { text: '12' }
        ],
        explain: '依次装入 1、2、3 后帧满：4 换 1，1 换 2，2 换 3，5 换 4，3 换 5 —— 共 3 + 6 = 9 次。同一串下 OPT 是 7 次、LRU 是 10 次，说明 FIFO 既不如 OPT 也不如 LRU。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 3, type: 'multi', difficulty: 3,
        tags: ['concept'],
        stem: '下面哪些做法能缓解抖动（thrashing）？（多选）',
        options: [
          { text: '降低多道程序度，减少同时活跃的进程数', correct: true },
          { text: '增加物理内存或减少每个进程的帧数需求', correct: true },
          { text: '用工作集模型只在帧足够时才让新进程进入', correct: true },
          { text: '把时间片调得更短以加快切换', correct: false },
          { text: '关掉所有中断让 CPU 不被干扰', correct: false }
        ],
        explain: '抖动的根源是「所有进程的工作集之和超过物理帧总数」，于是刚换出的页立刻又被需要。缓解只能从「减少并发需求」或「增加供给」入手。缩短时间片只会增加切换开销，关中断更是把系统搞坏。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 3, type: 'fill', difficulty: 3,
        tags: ['concept'],
        stem: '回收一个「脏页」通常需要两次 I/O：先写回磁盘，之后被访问时还要再 ______。',
        answer: '读入',
        accept: ['换入', '调入', 'read in', '从磁盘读回'],
        explain: '脏页必须先写回才能释放帧，否则数据丢失；等它再次被访问时又得从磁盘读回。干净页可以只写回页表项而不写数据，所以「尽量晚写、尽量成批写」能减少 I/O——这也是写回（write-back）策略优于写穿的原因。'
      },

      /* ---------------- ch06 文件系统与持久化 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'inode 中不保存文件名，这个设计直接支持了下面哪一项？',
        options: [
          { text: '硬链接：多个目录项可以指向同一个 inode', correct: true },
          { text: '更大的单文件上限' },
          { text: '更快的磁盘转速' },
          { text: '更小的页表' }
        ],
        explain: '名字属于目录项，inode 只记 <code>nlink</code> 计数，因此多个名字指向同一份数据成为可能，重命名也只是改目录项。若把名字塞进 inode，一个文件就只能有一个名字，硬链接便无从谈起。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 2, type: 'fill', difficulty: 3,
        tags: ['calc'],
        stem: 'xv6 的块大小为 1024 字节，12 个直接块加 1 个间接块（可装 256 个块号），单个文件最大为 ______ KiB。',
        answer: '268',
        accept: ['268 KiB', '268KB', '268 KB'],
        explain: '(12 + 256) × 1024 字节 = 268 KiB。逻辑块 100 落在第 88 个间接项，逻辑块 300 已经超出上限，<code>bmap</code> 会返回错误。换成 4 KiB 块则 256 项能装更多，上限随之变大。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '在 xv6 的日志协议里，哪一步是真正的「提交点」？',
        options: [
          { text: '把修改的块写进日志区' },
          { text: '把日志头（记录块数与被改块号）写盘', correct: true },
          { text: '把日志内容写回文件系统的原位' },
          { text: '清除日志头的 n 字段' }
        ],
        explain: '日志头落盘前崩溃，等于什么都没发生；落盘后即使断电，重启也能凭头里的块号完整重放。所以提交点是「写头」。之后的安装步骤可以慢慢做，中途崩溃也只是重放一遍，因为重放是幂等的。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '<code>write()</code> 返回成功就说明数据已经写到了磁盘上，断电不会丢。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'write 只把数据放进内核的缓冲缓存，真正落盘是异步的。要等到稳定存储必须调用 <code>fsync</code>（或打开时用 O_SYNC）。日志保护的是元数据一致性，不等于你的数据一定不丢。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-4', tier: 3, type: 'multi', difficulty: 3,
        tags: ['concept'],
        stem: '关于文件偏移的共享，下面哪些说法正确？（多选）',
        options: [
          { text: '<code>dup(1)</code> 得到的两个 fd 共享同一个偏移', correct: true },
          { text: '<code>fork()</code> 之后父子进程共享同一份打开文件表项，因而共享偏移', correct: true },
          { text: '对同一路径 <code>open</code> 两次会得到各自独立的偏移', correct: true },
          { text: '每个 fd 一定对应自己独立的内核偏移', correct: false }
        ],
        explain: '偏移存在 struct file 里，所以共享的是 struct file，不是 fd。dup 与 fork 让两个 fd 指向同一个 struct file，共享偏移；open 两次创建两个 struct file，偏移独立。想不受当前位置影响就用 pread/pwrite。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-3', tier: 3, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '目录项 <code>..</code> 是怎么实现的？',
        options: [
          { text: '它是目录文件里真实存在的一条目录项，指向父目录的 inode', correct: true },
          { text: '由内核在解析路径时特判字符串处理' },
          { text: '存放在超级块的一张表里' },
          { text: '是 inode 里的一个字段' }
        ],
        explain: '创建目录时，<code>..</code> 与 <code>.</code> 被当作普通目录项写进目录数据，分别指向父目录与自己；根目录的 <code>..</code> 指向自己，从而避免越界。这让路径解析循环完全统一，不需要为特殊名写分支。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-5', tier: 3, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '文件系统用 ______ 来记录哪些块已被分配、哪些还空闲（一位代表一个块）。',
        answer: '位图',
        accept: ['bitmap', '位图（bitmap）', '空闲位图'],
        explain: '位图是分配器的记账本，<code>balloc</code> 找 0 置 1，<code>bfree</code> 反向操作。inode 与数据块各有一张。位图与 inode 内容必须同时正确，否则会出现「两块共用」或「块永远找不回」，所以日志必须把两者放进同一个事务。'
      },

      /* ---------------- ch07 xv6 综合 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '<code>start()</code> 里的 <code>mret</code> 指令起了什么作用？',
        options: [
          { text: '按 <code>mstatus.MPP</code> 与 <code>mepc</code> 切换到更低特权级并从 <code>main</code> 继续执行', correct: true },
          { text: '从内核返回用户进程' },
          { text: '关闭所有中断' },
          { text: '把页表基址写进 <code>satp</code>' }
        ],
        explain: '<code>mret</code> 读 <code>mepc</code> 作返回地址、读 <code>MPP</code> 决定目标特权级，然后跳过去。xv6 在 <code>start()</code> 里把它设成 S-mode + main，于是内核开始以监管态运行。从内核返回用户进程用的是 <code>sret</code>，不是 <code>mret</code>。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['code'],
        stem: '<code>usertrap</code> 处理用户态 <code>ecall</code> 时会把 <code>trapframe-&gt;epc</code> 加 4，目的是 ______。',
        answer: '跳过 ecall 指令',
        accept: ['跳过这条 ecall', '让返回后不重复执行 ecall', '越过 ecall 的长度'],
        explain: '<code>epc</code> 指向触发陷阱的那条指令，<code>sret</code> 会回到它。若不 +4，返回后会再次执行 <code>ecall</code>，陷入无限循环。ecall 是 4 字节指令，所以加 4 正好指向下一条。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '时钟中断发生在用户态与发生在内核态，陷阱入口分别是哪个？',
        options: [
          { text: '用户态走 <code>usertrap</code>，内核态走 <code>kernelvec</code>', correct: true },
          { text: '两者都走 <code>usertrap</code>' },
          { text: '两者都走 <code>kernelvec</code>' },
          { text: '用户态走 <code>kernelvec</code>，内核态走 <code>usertrap</code>' }
        ],
        explain: '进内核后 <code>stvec</code> 被改成 <code>kernelvec</code>，回用户态前再改回 <code>usertrap</code>。分成两个入口的关键区别是：内核态的中断里不能 <code>yield</code>，因为此时可能持有锁，切走会造成死锁。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '持有自旋锁期间可以调用 <code>sleep</code> 让出 CPU，只要之后会被唤醒就没问题。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'sleep 会切到别的进程，而锁还被你持有，别的进程想拿这把锁就会一直自旋；如果它恰好是唯一能唤醒你的进程，系统就永久卡死。xv6 的规矩是「持自旋锁不得睡眠」，需要睡眠就用睡眠锁或在放锁后再等。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-6', tier: 3, type: 'multi', difficulty: 3,
        tags: ['debug'],
        stem: '内核 panic，<code>scause</code> 是 13（load page fault），且发生在系统调用里。哪些位置最值得先查？（多选）',
        options: [
          { text: '是否直接解引用了用户传进来的指针，而没有走 <code>copyin/copyout</code>', correct: true },
          { text: '该用户的地址是否真的被映射、权限是否足够', correct: true },
          { text: '内核页表里是否有对应的内核映射（内核不能访问未映射地址）', correct: true },
          { text: '磁盘的分区表是否损坏', correct: false },
          { text: 'CPU 的主频是否被降频', correct: false }
        ],
        explain: 'load page fault 说明「这条 load 的地址没有有效映射或权限不足」。系统调用里最常见的原因就是忘了 copyin/copyout 而直接 <code>*p</code>，其次是漏了映射（例如忘了 <code>mappages</code>）或 U 位设置不对。分区表与主频与这条异常无关。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '<code>fork()</code>、<code>exit()</code>、<code>wait()</code> 的实现主要在哪个文件？',
        options: [
          { text: 'vm.c' },
          { text: 'proc.c', correct: true },
          { text: 'fs.c' },
          { text: 'trap.c' }
        ],
        explain: 'proc.c 管进程表、调度与进程生命周期，fork 复制地址空间与 trapframe、exit 释放资源并留下僵尸、wait 回收子进程，都在这里。vm.c 只负责页表与地址翻译，syscall.c 只做分派。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-5', tier: 3, type: 'fill', difficulty: 3,
        tags: ['code'],
        stem: 'xv6 用 ______ 与 ______ 这两个函数实现嵌套安全的关中断（计数归零才真正开中断）。',
        answer: 'push_off / pop_off',
        accept: ['push_off 和 pop_off', 'push_off、pop_off', 'pushoff / popoff'],
        explain: '每次加锁调用 <code>push_off</code> 把 <code>noff</code> 加一并在最外层关中断，解锁时 <code>pop_off</code> 减一，只有减到 0 才恢复中断。这样嵌套加锁不会因为内层解锁而提前开中断，避免外层临界区被中断打断。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
