/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'csc3150',
  short: 'CSC3150',
  name: '操作系统',
  en: 'Operating Systems',
  dept: '计算机科学',
  lang: 'c',
  langLabel: 'C / xv6',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'CSC3150 // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... CSC3150',
    '> loading 8 modules ... proc / sched / sync / vm / pmm / fs / xv6',
    '> calibrating glossary, quiz bank & mock exam ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '把内核拆成可以手算的小块，再装回去。',
  missionEn: 'CSC3150 · 8 MODULES',
  missionTitle: '从一条指令<br><em>读到一台机器</em>',
  lede: '这门课不背定义：从开机第一条指令走到 shell，从页表走到文件系统，每一步都给出可手算的例子、可对照的表格、常见错误与自检清单。每章配题库，全站配模拟卷与三个实战项目。',
  searchPlaceholder: 'QUERY // 搜索本站章节、术语与题目',

  /* 资料库（path 相对 "CUHKSZ course/CSC3150" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/CSC3150/',
  resources: {
    note: '收录 CSC3150 的作业说明、习题课讲义、环境配置文档与样例代码；文件名为原始文件名，点击后用系统默认程序打开。',
    groups: [
      { name: '作业与项目', note: '按作业编号排列；zip 是配套源码或模板，pdf 是题目说明与评分点。', items: [
        { title: 'AS1 · 进程与系统调用', path: '作业习题/CSC3150_Assignment_CSC3150_OS_AS1_2025_1.pdf', kind: 'pdf', note: '第 1 次作业说明，配合本站 ch01 阅读' },
        { title: 'AS2 · 调度与同步（说明）', path: '作业习题/CSC3150_Assignment_CSC3150_OS_AS2_25fall.pdf', kind: 'pdf', note: '第 2 次作业题目与评分构成' },
        { title: 'AS2 · 配套源码包', path: '作业习题/CSC3150_Assignment_CSC3150_OS_AS2.zip', kind: 'zip', note: '解压后含骨架代码与测试脚本' },
        { title: 'AS3 · 内存管理', path: '作业习题/CSC3150_Assignment_assignment3.pdf', kind: 'pdf', note: '页表 / 缺页相关题目，配合 ch04、ch05' },
        { title: 'AS4 · 文件系统', path: '作业习题/CSC3150_Assignment_CSC3150_OS_AS4_25fall.pdf', kind: 'pdf', note: '第 4 次作业说明，配合 ch06' },
        { title: 'Project 4 · 源码包', path: '作业习题/CSC3150_Assignment_csc3150_project4.zip', kind: 'zip', note: '课程项目 4 的代码与运行脚本' },
        { title: 'xv6 实验手册', path: '作业习题/CSC3150_Assignment_xv6.pdf', kind: 'pdf', note: 'xv6 的编译、运行与调试流程总览' },
        { title: '作业模板源码', path: '作业习题/CSC3150_Assignment_template_source.zip', kind: 'zip', note: '写报告与提交代码时可直接套用的骨架' }
      ] },

      { name: '习题课讲义', note: 'Tutorial 与作业一一对应；讲 PowerPoint 的几次都带课堂练习与答案。', items: [
        { title: 'Tutorial 2 · 讲义', path: '作业习题/CSC3150_Tutorial_Materials_Tutorial_2.pptx', kind: 'pptx', note: '系统调用与进程创建的第一组练习' },
        { title: 'Tutorial 3 · 讲义', path: '作业习题/CSC3150_Tutorial_Materials_Tutorial_3.pptx', kind: 'pptx', note: 'fork/exec/wait 的输出分析与管道' },
        { title: 'Tutorial 4 · 讲义', path: '作业习题/CSC3150_Tutorial_Materials_Tutorial_4.pptx', kind: 'pptx', note: '线程、竞争条件与加锁' },
        { title: 'Tutorial 5 · 讲义', path: '作业习题/CSC3150_Tutorial_Materials_Tutorial_5.pptx', kind: 'pptx', note: '调度算法的手算演练' },
        { title: 'Tutorial 6 · 讲义', path: '作业习题/CSC3150_Tutorial_Materials_Tutorial_6.pdf', kind: 'pdf', note: '文件系统与日志的课堂推导' },
        { title: '虚拟内存专题（讲义）', path: '作业习题/CSC3150_Tutorial_Materials_Virtual_Memory_Management_tutorial.pptx', kind: 'pptx', note: '三级页表、TLB 与缺页处理' },
        { title: '虚拟内存专题（文字版）', path: '作业习题/CSC3150_Tutorial_Materials_Virtual_Memory_Management_tutorial.pdf', kind: 'pdf', note: '上面这份讲义的可打印版本' },
        { title: 'Assignment 4 提示', path: '作业习题/CSC3150_Tutorial_Materials_Tutorial_Assignment4_Hints.pdf', kind: 'pdf', note: '日志与崩溃恢复的常见卡点' }
      ] },

      { name: '环境与内核编译', note: '第一次跑 xv6 之前按这里的顺序读：装系统 → 装工具链 → 编内核 → 换虚拟盘。', items: [
        { title: 'Ubuntu 20.04 安装指引', path: '作业习题/CSC3150_Tutorial_Materials_Ubuntu_20_04.pdf', kind: 'pdf', note: '虚拟机安装、分区与常用软件' },
        { title: '编译内核的步骤', path: '作业习题/CSC3150_Tutorial_Materials_compile_kernel_instructions.pdf', kind: 'pdf', note: 'make qemu 之前要装的全部依赖' },
        { title: 'Ubuntu 20.04 证书问题', path: '作业习题/CSC3150_Tutorial_Materials_certificate_problem_for_ubuntu20_04.pdf', kind: 'pdf', note: 'apt 报证书错误时的处理办法' },
        { title: '扩展虚拟磁盘', path: '作业习题/CSC3150_Tutorial_Materials_Extend_virtual_disk.pdf', kind: 'pdf', note: '镜像不够大时如何扩容' },
        { title: '先修知识清单', path: '作业习题/CSC3150_Assignment_Prerequisite_Knowledge.pdf', kind: 'pdf', note: 'C 指针、汇编与 RISC-V 的最小集合' }
      ] },

      { name: '样例代码与复习提纲', note: '代码可以直接编译，提纲适合考前 20 分钟扫一遍。', items: [
        { title: 'Q3 测试程序（C 源码）', path: '考试资料/CSC3150_Assignment_Q3_test.c', kind: 'code', note: '用来观察进程创建顺序的小程序' },
        { title: '课堂示例代码包', path: '考试资料/CSC3150_Tutorial_Materials_example_codes.zip', kind: 'zip', note: 'Tutorial 上演示的全部 .c 示例' },
        { title: 'Tutorial 汇总（一）', path: '作业习题/CSC3150_Tutorial_Materials_summary_of_tut.pdf', kind: 'pdf', note: '各次习题课的知识点串讲' },
        { title: 'Tutorial 汇总（二、三）', path: '作业习题/CSC3150_Tutorial_Materials_summaryOfTut2_3.pdf', kind: 'pdf', note: '进程与调度部分的浓缩笔记' },
        { title: '实验报告模板', path: '作业习题/CSC3150_Assignment_report_template.zip', kind: 'zip', note: '含封面、章节结构与评分表' }
      ] }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '操作系统（Operating Systems）'],
    ['来源', 'CUHKSZ CSC3150 课程资料 · 以 xv6 为教学内核'],
    ['结构', '8 章正文 · 56 道分章题库 · 12 题模拟卷 · 3 个实战项目 · 资料库'],
    ['建议', '先读第 0 章建立地图，再按顺序推进；每章结尾的自检清单与内嵌小测不要跳过。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    { label: '系统调用', blocks: [
      { t: 'table', head: ['调用', '签名要点', '返回', '最容易错的地方'], rows: [
        ['<code>fork</code>', '无参数，复制调用者', '子进程返回 0，父进程返回子 pid，失败 -1', '父子都从 fork 之后继续执行，不是从头'],
        ['<code>exec</code>', '<code>exec(path, argv[])</code>', '成功不返回，失败返回 -1', '成功后代码段被整个换掉，原程序的变量全没了'],
        ['<code>wait</code>', '<code>wait(&amp;status)</code>', '回收到的子 pid，没有子进程 -1', '只能回收自己的直接子进程；不 wait 会留下僵尸'],
        ['<code>exit</code>', '<code>exit(status)</code>', '不返回', '退出码只有低 8 位有效'],
        ['<code>pipe</code>', '<code>pipe(fd[2])</code>', '0 / -1', '<code>fd[0]</code> 读、<code>fd[1]</code> 写，别写反'],
        ['<code>dup</code>', '<code>dup(fd)</code>', '新的最小可用 fd', '共享同一个打开文件偏移'],
        ['<code>read/write</code>', '<code>read(fd, buf, n)</code>', '实际字节数，0 表示 EOF', '可能短读，循环里要累计'],
        ['<code>sbrk</code>', '<code>sbrk(n)</code>', '旧堆顶，失败 -1', '只按页增长，n 为负是缩堆']
      ], caption: '系统调用是「用户态唯一能进内核的合法入口」；库函数只是它们的包装' },
      { t: 'code', lang: 'c', caption: 'fork + exec + wait 的标准骨架', code: 'pid_t pid = fork();\nif (pid &lt; 0) { perror("fork"); exit(1); }\nif (pid == 0) {            /* 子进程 */\n    char *argv[] = { "ls", "-l", 0 };\n    execv("/bin/ls", argv);\n    perror("execv");       /* 走到这里说明 exec 失败 */\n    exit(127);\n}\nint st;\nwait(&amp;st);                /* 父进程回收，st 里是子进程退出信息 */\nif (WIFEXITED(st)) printf("exit code = %d\\n", WEXITSTATUS(st));' },
      { t: 'callout', kind: 'tip', title: '三个数字要记住', html: '退出码 <code>127</code> 约定为「命令没找到」，<code>126</code> 为「找到了但不可执行」；<code>fork</code> 失败返回 <code>-1</code> 且不创建进程，此时<strong>不能</strong>调 <code>wait</code>。' }
    ] },

    { label: '调度与同步', blocks: [
      { t: 'table', head: ['算法', '抢占', '饥饿', '开销', '适合'], rows: [
        ['FCFS', '否', '长作业后面的短作业倒霉（护航效应）', '极低', '批处理、作业长度相近'],
        ['SJF', '否', '长作业可能永远等不到', '需要预知运行时间', '理论下界，用来对比'],
        ['SRTF', '是', '同上', '上下文切换多', '响应要求高的短任务'],
        ['RR（时间片 q）', '是', '否', 'q 太小切换多、q 太大退化成 FCFS', '分时系统、交互负载'],
        ['MLFQ', '是', '需定期提升优先级防饿死', '多级队列维护', '通用操作系统']
      ], caption: '比较指标固定四个：周转时间、等待时间、响应时间、吞吐量' },
      { t: 'table', head: ['原语', '拿不到锁时', '能用在中断上下文吗', '典型场景'], rows: [
        ['自旋锁 spinlock', '原地忙等烧 CPU', '能（关中断后）', '极短的临界区、内核数据结构'],
        ['睡眠锁 sleeplock', '睡眠让出 CPU', '不能（睡眠需调度）', '磁盘 I/O 这类长临界区'],
        ['信号量 semaphore', 'P 阻塞、V 唤醒', 'V 可以，P 不行', '计数资源、生产者消费者'],
        ['条件变量 condvar', 'wait 释放锁并睡眠', '不能', '等待某个谓词成立'],
        ['互斥量 mutex', '阻塞', '视实现', '用户态临界区，通常是 futex']
      ], caption: 'xv6 的规则：持自旋锁时不许 sleep，也不许再拿第二把锁' },
      { t: 'code', lang: 'c', caption: '条件变量必须用 while 而不是 if', code: 'pthread_mutex_lock(&amp;m);\nwhile (q-&gt;count == 0 &amp;&amp; !q-&gt;closed)\n    pthread_cond_wait(&amp;not_empty, &amp;m);   /* 原子地放锁 + 睡眠 */\nif (q-&gt;count == 0 &amp;&amp; q-&gt;closed) { pthread_mutex_unlock(&amp;m); return -1; }\nint v = q-&gt;buf[q-&gt;head++];\npthread_mutex_unlock(&amp;m);' },
      { t: 'callout', kind: 'warn', title: '死锁四条件（缺一不可）', html: '互斥、占有并等待、不可抢占、循环等待。工程上最常用的一招是<strong>给所有锁编号，永远按升序加锁</strong>，直接破坏循环等待；银行家算法只是理论上判断安全序列，实际系统很少用。' }
    ] },

    { label: '内存与页表', blocks: [
      { t: 'table', head: ['Sv39 位段', '位', '宽度', '含义'], rows: [
        ['VPN[2]', '38:30', '9', '顶级页表（每进程一个根）'],
        ['VPN[1]', '29:21', '9', '中间级'],
        ['VPN[0]', '20:12', '9', '最低级'],
        ['offset', '11:0', '12', '页内偏移，页大小 4 KiB'],
        ['——', '63:39', '25', '必须与第 38 位相同（符号扩展），否则缺页']
      ], caption: '每级页表 512 项 × 8 字节 = 4 KiB，正好一页；39 位虚拟地址 = 512 GiB' },
      { t: 'table', head: ['PTE 位', '名字', '作用', '坑'], rows: [
        ['V', 'Valid', '1 才表示这一项有效', '全 0 的页表项被当作「未映射」'],
        ['R/W/X', '权限', '读 / 写 / 执行', 'R=0 而 W=1 是非法组合（保留给指针标记）'],
        ['U', 'User', '1 表示用户态可访问', '内核页表项 U=0，用户态碰了就缺页'],
        ['G', 'Global', '不随 CR3/satp 切换失效', '内核全局映射才用'],
        ['A/D', 'Accessed/Dirty', '硬件或软件标记访问/写过', 'xv6 不依赖它做替换决策'],
        ['PPN', '物理页号', '右移 12 位得到物理地址', 'PPN=0 表示这一项没指向任何页']
      ], caption: '翻译流程：satp → 根页表物理地址 → 三级索引 → PPN 拼 offset' },
      { t: 'table', head: ['替换算法', '同一引用串 3 帧的缺页数', '是否会出现 Belady 异常', '实现代价'], rows: [
        ['OPT（最佳）', '7', '不会（它已是下界）', '需要预知未来，无法实现'],
        ['FIFO', '9', '会（4 帧反而 10 次）', '一个队列即可'],
        ['LRU', '10', '不会（栈式算法）', '需要精确时间戳或硬件支持'],
        ['Clock（二次机会）', '介于两者之间', '不会（LRU 近似）', '一个使用位 + 环形扫描']
      ], caption: '引用串 1 2 3 4 1 2 5 1 2 3 4 5 —— 手算三遍比背结论有用' },
      { t: 'code', lang: 'c', caption: 'xv6 walk()：三级页表逐级下钻', code: 'pte_t *\nwalk(pagetable_t pagetable, uint64 va, int alloc)\n{\n  if (va &gt;= MAXVA) panic("walk");\n  for (int level = 2; level &gt; 0; level--) {\n    pte_t *pte = &amp;pagetable[PX(level, va)];\n    if (*pte &amp; PTE_V) {\n      pagetable = (pagetable_t)PTE2PA(*pte);\n    } else {\n      if (!alloc || (pagetable = kalloc()) == 0) return 0;\n      memset(pagetable, 0, PGSIZE);\n      *pte = PA2PTE(pagetable) | PTE_V;\n    }\n  }\n  return &amp;pagetable[PX(0, va)];\n}' }
    ] },

    { label: '文件与调试', blocks: [
      { t: 'table', head: ['xv6 磁盘布局', '内容', '由谁管理'], rows: [
        ['block 0', 'boot sector（引导代码）', '不在文件系统内'],
        ['block 1', 'superblock：大小、数据块数、日志块数、inode 数', 'fs.c'],
        ['block 2..', 'log header + log blocks（日志区）', 'log.c'],
        ['随后', 'inode 区（每个 dinode 64 字节）', 'fs.c / itable'],
        ['随后', 'bitmap 区：每个数据块一位', 'balloc / bfree'],
        ['最后', 'data 区：文件内容与目录块', 'bmap / readi / writei']
      ], caption: '超块里的四个数字决定了整个布局，改它们之前先算一遍总块数' },
      { t: 'table', head: ['常量', '值', '含义'], rows: [
        ['<code>PGSIZE</code>', '4096', '页大小，也是块大小'],
        ['<code>NDIRECT</code>', '12', 'dinode 里的直接块指针数'],
        ['<code>NINDIRECT</code>', '256', '一个间接块能装的块号数 = BSIZE / sizeof(uint) = 1024 / 4'],
        ['<code>MAXFILE</code>', '(12+256)×1024 字节', 'xv6 单文件上限 268 KiB'],
        ['<code>LOGSIZE</code>', '30', '日志区可容纳的块数'],
        ['<code>NPROC</code>', '64', '进程表大小'],
        ['<code>NCPU</code>', '8', '最大 CPU 数']
      ], caption: '这些数字在作业里经常被直接问到，记不住就从 param.h 里推' },
      { t: 'table', head: ['命令', '用途', '备注'], rows: [
        ['<code>make qemu</code>', '编译并启动 xv6', '加 <code>CPUS=3</code> 可测多核'],
        ['<code>make qemu-gdb</code>', '带 gdb stub 启动', '另开终端 <code>gdb-multiarch kernel/kernel</code>'],
        ['<code>riscv64-unknown-elf-objdump -d kernel/kernel</code>', '反汇编内核', '定位崩溃地址对应的函数'],
        ['<code>riscv64-unknown-elf-gdb kernel/kernel</code>', '看符号与行号', '配合 <code>layout src</code>'],
        ['<code>xxd fs.img | less</code>', '看磁盘原始字节', '验证 inode 与日志头'],
        ['<code>grep -rn "panic" kernel/</code>', '找所有崩溃点', '读内核时的高效入口']
      ], caption: '调试 xv6 的第一原则：先让它 panic 出可读信息，再谈修 bug' },
      { t: 'code', lang: 'bash', caption: '一次完整的「改内核 → 验证」循环', code: 'make clean\nmake qemu CPUS=2\n# 在 xv6 shell 里：\n$ echo hello\n$ test1\n# 退出 qemu：Ctrl-A 然后 X\n\n# 若 panic，反汇编定位：\nriscv64-unknown-elf-objdump -d kernel/kernel | grep -A30 "&lt;sys_getvmstats&gt;:"' },
      { t: 'callout', kind: 'note', title: '这份速查表覆盖范围', html: '只收高频结论与手算模板：系统调用语义、调度与同步对照、Sv39 位段、替换算法算例、磁盘布局与调试命令。推导过程与算例见各章正文，考前建议先扫这四页再看 ch07 的复习路线。' }
    ] }
  ]
};
