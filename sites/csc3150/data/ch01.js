/* =====================================================================
 * ch01.js · 第 1 章「进程与系统调用：程序怎么跑起来」
 * 职责：建立「进程」这个全课载体，讲清 fork/exec/wait 的语义与代价。
 * 依据：xv6 教材第 1–2 章（interfaces / organization）+ 课程 Tutorial 1–2
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch01',
  num: '01',
  title: '进程与系统调用：程序怎么跑起来',
  en: 'PROCESSES & SYSTEM CALLS',
  goals: [
    '说清「程序」与「进程」的差别，并指出 <code>proc</code> 结构里至少四个必要字段',
    '手写一段 <code>fork</code> 嵌套代码，正确推演出输出行数与每行内容',
    '解释 <code>exec</code> 为什么成功时不返回，以及它保留了哪些东西',
    '画出进程六种状态之间的迁移，并说明 <code>wait</code> 与 <code>exit</code> 各自触发哪条边',
    '区分「父子进程共享打开文件偏移」与「父子进程各自拥有变量」这两件相反的事'
  ],
  kp: [
    { id: 'ch01-1', title: '从开机到第一条用户指令' },
    { id: 'ch01-2', title: '进程：地址空间加执行现场' },
    { id: 'ch01-3', title: '系统调用与陷阱帧' },
    { id: 'ch01-4', title: 'fork、exec、wait 的语义' },
    { id: 'ch01-5', title: '进程状态与上下文切换' },
    { id: 'ch01-6', title: '进程间通信：管道与退出码' },
    { id: 'ch01-7', title: '一个完整例子：shell 执行一条命令' },
    { id: 'ch01-8', title: '六个高频错误' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么从进程开始', html: '后面所有章节都在讨论「某个东西被谁拥有、在什么时候被改」。这个「谁」就是进程。调度器调度的对象是进程（线程），锁保护的是进程之间共享的数据，页表属于进程，打开的文件挂在进程上。<b>进程搞不清，后面每一章都会悬空</b>。这一章先把进程的创建、替换、结束、切换四件事讲透。' },

    { t: 'p', lead: true, html: '一个程序躺在磁盘上时只是一堆字节。把它读进内存、给它一个独立的地址空间、让 CPU 从入口开始执行，它才变成进程。这个「变身」过程由内核完成，而用户程序唯一能请求内核的入口是系统调用。本章沿着「开机 → 创建进程 → 请求服务 → 结束」这条线，把 xv6 的最小实现读一遍。' },

    { t: 'h', lvl: 2, text: '一、从开机到第一条用户指令', id: 'ch01-1' },

    { t: 'p', html: '按下电源后，CPU 从厂商写死的地址取第一条指令，执行固件（BIOS/UEFI），固件找到启动盘、把引导程序读进内存，引导程序再把内核映像装到内存的固定位置。在 qemu 里跑 xv6 时，这一步被简化成：qemu 把 <code>kernel.elf</code> 加载到物理地址 <code>0x80000000</code>，然后把 PC 指向 <code>entry</code>。' },

    { t: 'p', html: '此时的 CPU 还没有页表、没有内核栈、没有任何 C 运行环境。所以 <code>entry.S</code> 只能用汇编做三件事：<b>设置一个临时栈</b>、<b>把 <code>main</code> 的地址装进寄存器</b>、<b>跳过去</b>。<code>main</code> 才开始建页表、初始化内存分配器、初始化进程表，最后调用 <code>userinit</code> 造出第一个进程。' },

    { t: 'code', lang: 'c', caption: 'xv6 的 main 里与进程相关的初始化顺序（简化）', code: 'void main(void) {\n  consoleinit();   // 串口，printf 才能用\n  kinit();         // 物理页分配器\n  kvminit();       // 内核页表\n  procinit();      // 进程表、每个进程的内核栈\n  trapinit();      // 陷阱向量\n  userinit();      // 造出 1 号进程，执行 /init\n  scheduler();     // 永不返回：不断挑一个 RUNNABLE 进程去跑\n}' },

    { t: 'p', html: '注意 <code>userinit</code> 造出的第一个进程并不执行你的程序，而是执行一段只有十几条指令的 <code>initcode</code>：它调用 <code>exec("/init")</code>，把用户态的 init 程序装进来。init 再去打开控制台、启动 shell。所以你在屏幕上看到提示符时，内核已经完成了「建页表 → 建进程 → 装程序 → 进用户态」的完整一圈。' },

    { t: 'h', lvl: 2, text: '二、进程：地址空间加执行现场', id: 'ch01-2' },

    { t: 'p', html: '进程（process）是一个正在执行的程序的实例。要让它能被暂停、恢复、隔离，内核必须记住两类东西：<b>它能看到的内存</b>（地址空间、页表）和<b>它此刻的执行位置</b>（寄存器、栈、程序计数器）。只保存代码不够——同一份代码可以被两个进程同时执行，各自的变量值不同。' },

    { t: 'table', head: ['对比项', '程序（program）', '进程（process）'], rows: [
      ['存在形式', '磁盘上的可执行文件', '内存中的运行实例'],
      ['数量关系', '一份可以对应多个进程', '每个进程有自己的地址空间'],
      ['状态', '静态，不会自己变化', '有运行、就绪、睡眠、僵尸等状态'],
      ['生命周期', '一直在磁盘上', '从 fork 创建到 wait 回收'],
      ['共享方式', '多个进程可以读同一个文件', '变量、栈、页表默认彼此隔离']
    ], caption: '把程序想成菜谱，进程就是某个厨师正照着它做菜；同一个菜谱可以有两个厨师同时做' },

    { t: 'p', html: 'xv6 用 <code>struct proc</code> 描述一个进程。字段很多，但可以归成四组：<b>身份</b>（<code>pid</code>、<code>parent</code>）、<b>内存</b>（<code>pagetable</code>、<code>sz</code>）、<b>执行现场</b>（<code>trapframe</code>、<code>context</code>、<code>kstack</code>）、<b>资源与状态</b>（<code>state</code>、<code>ofile[]</code>、<code>cwd</code>、<code>chan</code>、<code>killed</code>）。读内核代码时先认出这四组，就不会被几十个字段淹掉。' },

    { t: 'p', html: '其中最容易混的是两套「保存寄存器」的结构。<code>trapframe</code> 保存的是<b>用户态</b>的完整寄存器现场，发生在每次陷入内核时；<code>context</code> 只保存<b>内核态</b>的 <code>ra</code>、<code>sp</code> 与 <code>s0</code>–<code>s11</code>，发生在进程切换时。前者让你能从内核返回用户程序，后者让你能从另一个进程的内核栈切回来。' },

    { t: 'h', lvl: 2, text: '三、系统调用与陷阱帧', id: 'ch01-3' },

    { t: 'p', html: '用户程序要读文件，不能直接碰磁盘，只能发系统调用。RISC-V 上的约定是：系统调用编号放 <code>a7</code>，参数依次放 <code>a0</code>–<code>a5</code>，然后执行 <code>ecall</code>。<b>这条指令是用户态能主动进入内核的唯一合法方式</b>，硬件保证它会同时做三件事：切到内核态、跳到预先登记的陷阱入口、把 PC 存进 <code>sepc</code>。' },

    { t: 'p', html: '入口处的汇编先把用户寄存器全部压进当前进程的 trapframe，再调用 C 函数 <code>usertrap</code>。后者读 <code>scause</code> 判断原因：如果是系统调用，就把 <code>sepc</code> 加 4（跳过 <code>ecall</code> 本身），调用 <code>syscall()</code>；如果是缺页或非法指令，就走异常处理。返回时从 trapframe 恢复寄存器，执行 <code>sret</code> 回到用户态。' },

    { t: 'code', lang: 'c', caption: 'syscall 分发：编号决定调用哪个实现（xv6 风格）', code: 'void syscall(void) {\n  int num = p->trapframe->a7;\n  if (num > 0 && num < NELEM(syscalls) && syscalls[num]) {\n    p->trapframe->a0 = syscalls[num]();  // 返回值写回 a0\n  } else {\n    printf("unknown syscall %d\\n", num);\n    p->killed = 1;                       // 杀掉乱发调用的进程\n  }\n}' },

    { t: 'p', html: '内核从 trapframe 取参数，而不是直接相信用户传来的指针。原因很实际：用户可以把 <code>a1</code> 设成任意值，甚至指向内核地址。所以 xv6 提供 <code>argint</code>、<code>argaddr</code>、<code>argfd</code> 来取值，再用 <code>copyin</code>/<code>copyout</code> 在用户缓冲区与内核缓冲区之间搬运。<b>「内核不信任用户」不是一句口号，而是体现为每一次取值都要检查</b>。' },

    { t: 'callout', kind: 'exam', title: '考点：为什么返回值要写回 trapframe', html: '因为内核返回用户态时，恢复寄存器的动作发生在 <code>usertrapret</code> 里，它从 trapframe 里取值。系统调用实现只要把结果放进 <code>p->trapframe->a0</code>，用户程序醒来时就会在 <code>a0</code> 里看到返回值——这正是 C 调用约定里「返回值放 a0」的延续。' },

    { t: 'h', lvl: 2, text: '四、fork、exec、wait 的语义', id: 'ch01-4' },

    { t: 'p', html: 'Unix 用三个调用完成「造进程、换程序、收尸」三件事。<b>它们的语义必须精确记住，考试里的进程题全部由它们组合而成。</b>' },

    { t: 'table', head: ['调用', '做什么', '返回值', '容易记错的地方'], rows: [
      ['<code>fork()</code>', '复制当前进程：地址空间、寄存器、打开的文件表', '父进程得到子进程 pid，子进程得到 0，失败返回 -1', '它返回两次，父子从同一行继续执行'],
      ['<code>exec(path, argv)</code>', '用新程序替换当前进程的地址空间与寄存器', '成功不返回；失败返回 -1', '成功不返回，pid 不变，打开的文件保留'],
      ['<code>wait(&amp;status)</code>', '等待任意一个子进程结束，回收其资源', '返回子进程 pid，没有子进程返回 -1', '只能收自己的直接子进程，不能收孙子'],
      ['<code>exit(status)</code>', '结束当前进程，释放内存，留下退出码', '不返回', '进程变成僵尸，等父进程 wait 才真正消失']
    ], caption: '背这张表时重点记「返回几次」和「成功是否返回」，这两点决定代码怎么写' },

    { t: 'p', html: 'fork 的细节值得多说一句。xv6 的 fork 会为子进程新建页表，并把父进程的每一页内容复制一份（<code>uvmcopy</code>），所以<b>父子进程的变量互不影响</b>。但文件描述符表也被复制，表里的每一项指向同一个 <code>struct file</code>，引用计数加一，所以<b>父子共享文件偏移</b>。这两件事方向相反，是本章最容易混的地方。' },

    { t: 'p', html: '真实系统不会立刻复制所有页，而是用写时复制（copy-on-write）：父子先共享物理页并标成只读，谁写谁触发缺页，内核这时才复制。xv6 为了代码简单没这么做，所以 <code>fork</code> 一个大进程会明显变慢——这也是 shell 里 <code>fork</code> 之后马上 <code>exec</code> 显得浪费的原因（复制了马上又被丢掉）。' },

    { t: 'code', lang: 'c', caption: 'fork 的返回值决定了两条不同的执行路径', code: 'int pid = fork();\nif (pid < 0) {\n  // 失败：通常是进程数或内存不够\n} else if (pid == 0) {\n  // 子进程：换一个程序去跑\n  exec("/bin/ls", argv);\n  exit(1);            // exec 失败才会到这里\n} else {\n  // 父进程：pid 是子进程号，等它结束\n  int st;\n  wait(&amp;st);\n}' },

    { t: 'p', html: '注意最后那行 <code>exit(1)</code>。它只在 <code>exec</code> 失败时执行，因为成功的 <code>exec</code> 不会返回。初学者常写成「exec 之后打印一句 child done」，结果子进程永远打印不出来，原因就在这里。' },

    { t: 'h', lvl: 2, text: '五、进程状态与上下文切换', id: 'ch01-5' },

    { t: 'p', html: 'xv6 的进程有六个状态：<code>UNUSED</code>（表项空闲）、<code>USED</code>（已分配但还没准备好）、<code>RUNNABLE</code>（就绪，等 CPU）、<code>RUNNING</code>（正在跑）、<code>SLEEPING</code>（等某个事件）、<code>ZOMBIE</code>（已退出，等父进程回收）。状态不是装饰，它决定了调度器会不会挑中这个进程。' },

    { t: 'table', head: ['状态迁移', '触发动作', '谁执行'], rows: [
      ['UNUSED → USED', '分配 <code>proc</code> 结构、建内核栈', '<code>allocproc</code>'],
      ['USED → RUNNABLE', '装载程序或 fork 完成，可以跑了', '<code>userinit</code> / <code>fork</code>'],
      ['RUNNABLE → RUNNING', '调度器选中它，切换过去', '<code>scheduler</code> / <code>swtch</code>'],
      ['RUNNING → RUNNABLE', '时间片用完或被更高优先级抢占', '定时器中断 + <code>yield</code>'],
      ['RUNNING → SLEEPING', '等磁盘、等管道、等子进程', '<code>sleep</code>'],
      ['SLEEPING → RUNNABLE', '等待的事件发生', '<code>wakeup</code>'],
      ['RUNNING → ZOMBIE', '调用 <code>exit</code>', '<code>exit</code>'],
      ['ZOMBIE → UNUSED', '父进程 <code>wait</code> 回收', '<code>wait</code>']
    ], caption: '把这张表画在纸上，任何进程题都能顺着边推' },

    { t: 'p', html: '上下文切换（context switch）发生在内核里。当进程 A 要让出 CPU，它调用 <code>sched</code>，把内核寄存器保存进 A 的 <code>context</code>，再 <code>swtch</code> 到 CPU 的调度器上下文；调度器挑出进程 B，<code>swtch</code> 到 B 的 <code>context</code>，B 从它上次停下的地方继续。<b>整个过程不保存用户寄存器</b>——那些早在陷入内核时已经进了 trapframe。' },

    { t: 'p', html: '这也解释了为什么 <code>swtch</code> 只保存 14 个寄存器：切换发生在一次函数调用内部，调用者保存寄存器（caller-saved）已经按 C 调用约定压在自己的栈上了，只需要保存被调用者保存的那些（<code>s0</code>–<code>s11</code>）加上返回地址和栈指针。<b>看懂这一点，你就看懂了「切换为什么这么便宜」</b>：一次切换是几十条指令，真正的开销在缓存和 TLB 变冷。' },

    { t: 'h', lvl: 2, text: '六、进程间通信：管道与退出码', id: 'ch01-6' },

    { t: 'p', html: '进程之间地址空间隔离，想交换数据必须经过内核。最小的机制是管道（pipe）：<code>pipe(fd)</code> 返回两个文件描述符，<code>fd[0]</code> 读、<code>fd[1]</code> 写，内核里是一个 512 字节的环形缓冲区。写满则写者睡眠，读空则读者睡眠，这就是第 3 章「睡眠与唤醒」的第一个真实案例。' },

    { t: 'p', html: '管道最有用的性质是：<b>所有写端都关闭后，读端会读到 0（EOF）而不是永远阻塞</b>。所以 <code>cat file | grep x</code> 这样的命令才能正常结束——grep 读到 EOF 就退出。写程序时如果忘了关掉不用的那一端，就会看到「命令卡住不返回」，这是 shell 实验里最常见的 bug。' },

    { t: 'p', html: '另一个通信通道是退出码。<code>exit(3)</code> 把 3 留在 <code>proc</code> 里变成僵尸，父进程 <code>wait(&amp;st)</code> 取回它，用 <code>WEXITSTATUS(st)</code> 取出低 8 位。所以 shell 里 <code>echo $?</code> 能看到上一条命令的返回值。如果父进程先死了，子进程会被 init 收养，由 init 负责回收——这就是「孤儿进程」不会变成永久僵尸的原因。' },

    { t: 'h', lvl: 2, text: '七、一个完整例子：shell 执行一条命令', id: 'ch01-7' },

    { t: 'p', html: '把上面所有零件拼起来，就是 shell 的主循环。假设你输入 <code>echo hi</code>，xv6 的 sh 做了这些事：' },

    { t: 'steps', items: [
      { title: '第一步 · 读一行', html: '<code>getcmd</code> 从标准输入读一行到缓冲区。若读到 EOF（Ctrl-D），直接退出 shell。' },
      { title: '第二步 · 解析', html: '把命令行按空格切开，识别重定向 <code>&gt;</code> 与管道 <code>|</code>。这一步只是字符串处理，不碰内核。' },
      { title: '第三步 · fork', html: '调用 <code>fork</code>，子进程得到 0。父进程记住返回的 pid，准备稍后 <code>wait</code>。' },
      { title: '第四步 · 子进程处理重定向并 exec', html: '若有 <code>&gt; out</code>，子进程先 <code>close(1)</code> 再 <code>open("out", O_CREATE|O_WRONLY)</code>，新 fd 正好是 1；然后 <code>exec("echo", argv)</code>。成功则 shell 的代码在子进程里消失，换成 echo 的代码。' },
      { title: '第五步 · 父进程 wait', html: '父进程阻塞在 <code>wait</code>，直到子进程 <code>exit</code>。回收后打印下一个提示符。' }
    ] },

    { t: 'p', html: '这段流程把本章所有概念都用上了：fork 复制地址空间、exec 替换程序、文件描述符在 exec 后保留（所以重定向有效）、wait 回收僵尸、管道连接两个进程。<b>如果你能不看笔记复述这五步，本章就过关了。</b>' },

    { t: 'h', lvl: 2, text: '八、六个高频错误', id: 'ch01-8' },

    { t: 'table', head: ['错误说法', '为什么错', '正确说法'], rows: [
      ['「fork 之后父子共享变量」', '地址空间被复制，各写各的', '变量各一份；共享的是打开文件的偏移'],
      ['「exec 成功后会返回」', '地址空间被替换，原代码不存在了', '成功不返回；只有失败才返回 -1'],
      ['「wait 可以回收任何进程」', '只能回收直接子进程', '孙子进程由它的父进程或 init 回收'],
      ['「僵尸进程还占内存」', '内存已释放，只剩表项与退出码', '僵尸只占一个进程表项，多了会耗尽 pid'],
      ['「exit 之后进程立刻消失」', '要等父进程 wait', '先变 ZOMBIE，被 wait 后才 UNUSED'],
      ['「printf 调用一次却输出两次是 bug」', '用户态缓冲区被复制了一份', 'fork 前 flush，或改用 write']
    ], caption: '前四条是概念错误，后两条是真实调试现场' },

    { t: 'p', html: '最后一条值得展开。C 标准库的 <code>stdout</code> 默认是行缓冲（终端）或全缓冲（重定向到文件）。如果缓冲区里还有没刷出去的字符，fork 会把这块用户态内存也复制一份，父子各自 <code>exit</code> 时都会 flush，于是同一行输出出现两次。<b>这不是内核的 bug，是缓冲区的语义</b>，用 <code>write</code> 或提前 flush 都能避免。' },

    { t: 'compare', left: { title: '父子进程之间：不共享', html: '变量、堆、栈、页表都是复制出来的。子进程改一个全局变量，父进程看不到；父进程改一个指针，子进程也不受影响。这是隔离性的直接后果。' }, right: { title: '父子进程之间：共享', html: '打开的文件偏移、管道、终端都通过描述符表共享。两个进程往同一个 fd 写，输出会交错；一个读走的数据，另一个再也读不到。想避免就要 dup 出独立描述符。' } },

    { t: 'terms', items: [
      { en: 'process', zh: '进程', html: '运行中的程序实例，拥有独立地址空间与执行现场。' },
      { en: 'PCB / proc', zh: '进程控制块', html: '内核里描述进程的结构，记录 pid、页表、寄存器现场与打开的文件。' },
      { en: 'fork', zh: '创建进程', html: '复制调用者得到子进程；父返回子 pid，子返回 0。' },
      { en: 'exec', zh: '替换映像', html: '用新程序替换当前地址空间；成功不返回，pid 与打开的文件保留。' },
      { en: 'zombie', zh: '僵尸进程', html: '已退出但父进程尚未 wait 的进程，只剩表项与退出码。' },
      { en: 'trapframe', zh: '陷阱帧', html: '陷入内核时保存用户寄存器的那块内存，返回用户态时据此恢复。' },
      { en: 'context switch', zh: '上下文切换', html: '保存当前执行流的内核现场并恢复另一个执行流的过程。' }
    ] },

    { t: 'quiz', qid: 'ch01-q1' },
    { t: 'quiz', qid: 'ch01-q2' },
    { t: 'quiz', qid: 'ch01-q3' },

    { t: 'keypoint', items: [
      { title: '进程 = 地址空间 + 现场', html: '程序是静态文件，进程是运行实例；隔离靠页表，恢复靠 trapframe。' },
      { title: 'fork 返回两次', html: '父得 pid、子得 0；地址空间各一份，文件偏移共享。' },
      { title: 'exec 成功不返回', html: '它替换整个用户映像，pid 与已打开的 fd 保留，所以重定向有效。' },
      { title: 'exit 留僵尸，wait 收尸', html: '僵尸只占表项；孤儿由 init 收养并回收。' },
      { title: '切换只保存 14 个寄存器', html: '用户现场已在 trapframe；切换开销主要在缓存与 TLB。' }
    ] },

    { t: 'checklist', id: 'ch01', items: [
      '我能说清程序与进程的三点差别，并指出 <code>proc</code> 结构里至少四个字段',
      '我能手写两次 fork 的代码，算出创建了几个进程、输出几行',
      '我能解释 <code>exec</code> 为什么成功时不返回，以及它保留了哪些资源',
      '我能画出六种进程状态之间的全部迁移边，并说出每条边的触发函数',
      '我能区分「变量各一份」与「文件偏移共享」，并各举一个例子',
      '我能解释 <code>swtch</code> 为什么只保存 <code>s0</code>–<code>s11</code>',
      '我能复述 shell 执行一条命令的五步，并说清重定向为什么在子进程里做',
      '我能说出僵尸与孤儿的区别，以及各自由谁回收',
      '我知道 <code>printf</code> 在 fork 后重复输出的原因和两种修法'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 xv6 教材第 1 章（Operating system interfaces）与第 2 章（Operating system organization）组织，代码取自 xv6-riscv 的 <code>proc.c</code>、<code>syscall.c</code>、<code>trap.c</code>、<code>user/sh.c</code> 的简化版本；开机的物理地址布局与 <code>entry.S</code> 流程参考课程材料里「编译并运行 xv6」的说明。真实系统的 <code>fork</code> 普遍采用写时复制，本章在正文中单独标注了这处简化，考试若问「Linux 与 xv6 的差别」需按写时复制回答。' }
  ]
});
