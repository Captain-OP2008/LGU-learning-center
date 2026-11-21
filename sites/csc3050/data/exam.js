/* =====================================================================
 * exam.js · CSC3050 模拟卷 A（CSC.registerExam）
 * 范围：ch00–ch07 综合；12 题、满分 100、限时 90 分钟。
 * 题型：choice / tf / fill / output / keywords。
 * 判分：choice 与 tf 精确匹配；fill 归一化文本；output 逐行/去空白比对；
 *       keywords 按关键词命中比例给分，交卷后可对照参考答案人工复核。
 * ===================================================================== */
(function () {
  'use strict';

  var EXAM = {
    id: 'CSC3050-A',
    title: '计算机组成与系统编程 模拟卷 A',
    style: '期末风格',
    subtitle: 'CSC3050 · 覆盖 ch00–ch07 的综合模拟（开卷风格，但请先闭卷做一遍）',
    date: '2026-11-21',
    minutes: 90,
    totalScore: 100,
    summary: '本卷覆盖数据表示、RISC-V 指令与调用约定、数据通路、流水线与冒险、存储层次与 Cache、链接加载、性能与并行。' +
      '题型为选择 2 题、判断 2 题、填空 2 题、计算/写结果 4 题、简答 2 题，共 12 题 100 分。' +
      '建议限时 90 分钟独立完成：计算题写出中间步骤，简答题先给结论再给理由，交卷后逐题对照解析。',
    instructions: [
      '时间 90 分钟，满分 100 分。开始后计时不暂停，刷新或离开页面仍按真实时间计算。',
      '题型分布：单项选择 2 题（16 分）、判断 2 题（16 分）、填空 2 题（16 分）、计算与写结果 4 题（36 分）、简答 2 题（16 分）。',
      '计算题只写最终结果时，若结果正确也给满分；但建议保留步骤，便于复盘时定位错在哪一步。',
      '简答题按关键词命中比例给分，答出要点即可；表述不同但意思正确同样算命中。',
      '本卷为开卷风格：允许查教材与笔记，但不允许使用电子设备。开卷不等于能直接翻到答案，重点在「换一组参数也能算」。',
      '建议先做选择、判断、填空（约 30 分钟），再攻计算（约 40 分钟），最后留 20 分钟写简答与检查。'
    ],
    questions: [

      /* ---------------------------------------------------------- Q1 */
      { no: 1, points: 8, type: 'single choice',
        intro: '本题考察补码与符号扩展。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '32 位补码 <code>0xFFFFFFF0</code> 解释为有符号整数时等于：',
            options: [
              { text: '−16', correct: true },
              { text: '−15' },
              { text: '16' },
              { text: '4294967280' }
            ],
            explain: '0xFFFFFFF0 的最高位为 1，是负数。取反加一：0x0000000F + 1 = 0x00000010 = 16，所以原数是 −16。' +
              '若按无符号解释才是 4294967280；−15 的位模式是 0xFFFFFFF1。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '把 8 位补码 <code>0xF0</code> 符号扩展到 32 位，结果是：',
            options: [
              { text: '0x000000F0' },
              { text: '0xFFFFFFF0', correct: true },
              { text: '0xFFFFFF0F' },
              { text: '0x0000000F' }
            ],
            explain: '0xF0 的最高位是 1，符号扩展时高位全补 1，得到 0xFFFFFFF0。零扩展才会得到 0x000000F0。' +
              'RISC-V 的 lb/lh 做符号扩展，lbu/lhu 做零扩展，区别就在这里。' }
        ] },

      /* ---------------------------------------------------------- Q2 */
      { no: 2, points: 8, type: 'true / false',
        intro: '判断下列陈述的真假，并想清楚反例。',
        parts: [
          { label: '(a)', points: 4, kind: 'tf',
            prompt: '五级流水线使单条指令的执行延迟降低为原来的 1/5。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '流水线提高的是吞吐（稳态下每拍完成一条），单条指令仍要经过五个阶段，延迟不降反因流水寄存器略增。' +
              '理想加速比 5 是「一批指令的总时间」之比，不是单条延迟之比。' },
          { label: '(b)', points: 4, kind: 'tf',
            prompt: '直接映射 Cache 中，每个组（set）只有一行。',
            options: [
              { text: '正确', correct: true },
              { text: '错误' }
            ],
            explain: '直接映射是「1 路组相联」：index 直接选一行，每组恰好一行，替换没有选择余地。' +
              '组相联每组有 K 行，全相联只有一个组、包含所有行。' }
        ] },

      /* ---------------------------------------------------------- Q3 */
      { no: 3, points: 8, type: 'fill in the blank',
        intro: '把答案写在横线处；数值只写数字，十六进制保留 0x 前缀。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '某程序执行 4×10⁹ 条指令，平均 CPI 为 2，处理器主频 2 GHz，则 CPU 时间为 ____ 秒。',
            answer: '4',
            explain: 'CPU 时间 = IC × CPI / f = 4×10⁹ × 2 / 2×10⁹ = 4 秒。' +
              '注意 2 GHz = 2×10⁹ Hz；若把 GHz 当成 10⁹ 而漏掉 2，会算成 8 秒。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '指令 <code>addi x5, x0, -1</code> 的 32 位机器码是 ____（写成 0x 开头的 8 位十六进制）。',
            answer: '0xFFF00293',
            explain: 'I 型：imm=−1 的 12 位补码是 0xFFF，放在 [31:20]；rs1=x0、funct3=000、rd=x5、opcode=0010011。' +
              '拼起来 0xFFF00000 + 0x280 + 0x13 = 0xFFF00293。这也说明 addi 的立即数只有 12 位，范围 −2048…2047。' }
        ] },

      /* ---------------------------------------------------------- Q4 */
      { no: 4, points: 10, type: 'calculation · data representation',
        intro: '写出结果即可；第二小题要写清三个字段的位数。',
        parts: [
          { label: '(a)', points: 5, kind: 'output',
            prompt: '单精度 IEEE 754 下，−6.5 的位模式是什么？（写成 0x 开头的 8 位十六进制）',
            answer: '0xC0D00000',
            explain: '6.5 = 1.101₂ × 2²，符号位 0、指数 127+2=129、尾数 101。正数 6.5 是 0x40D00000；' +
              '取负只改最高位，所以 −6.5 = 0xC0D00000。注意不是对全部位取反。' },
          { label: '(b)', points: 5, kind: 'output',
            prompt: '一个 16 KiB、直接映射、块大小 32 B 的 Cache，32 位地址如何划分？写出「index=? 位, offset=? 位, tag=? 位」。',
            answer: 'index=9, offset=5, tag=18',
            accept: ['index=9,offset=5,tag=18', 'index 9, offset 5, tag 18', '9,5,18'],
            explain: '行数 = 16KiB / 32B = 512，直接映射下行数就是组数，index = log₂512 = 9；offset = log₂32 = 5；' +
              'tag = 32 − 9 − 5 = 18。若把 16KiB 当成 16×1000 字节，索引会算错。' }
        ] },

      /* ---------------------------------------------------------- Q5 */
      { no: 5, points: 10, type: 'calculation · performance',
        intro: '两小题都要写公式或中间值；只写答案但正确也给分。',
        parts: [
          { label: '(a)', points: 5, kind: 'output',
            prompt: '某程序 80% 的时间可并行，用 8 核加速。按 Amdahl 定律，整体加速比约为多少？（保留两位小数）',
            answer: '3.33',
            accept: ['3.33', '3.33x', '3.33×', '10/3'],
            explain: 'S = 1/((1−0.8) + 0.8/8) = 1/(0.2 + 0.1) = 1/0.3 ≈ 3.33。' +
              '即使核数无限，上限也只有 1/0.2 = 5×；8 核已经拿到上限的 2/3。' },
          { label: '(b)', points: 5, kind: 'output',
            prompt: '某程序执行 2×10⁹ 条指令，平均 CPI 为 1.5，主频 3 GHz，CPU 时间是多少秒？',
            answer: '1',
            accept: ['1', '1s', '1 秒', '1.0'],
            explain: '2×10⁹ × 1.5 / 3×10⁹ = 1 秒。也可以先算总周期数 3×10⁹，再除以 3×10⁹ Hz。' }
        ] },

      /* ---------------------------------------------------------- Q6 */
      { no: 6, points: 8, type: 'calculation · cache',
        intro: '写出数值；AMAT 用拍（cycle）作单位。',
        parts: [
          { label: '(a)', points: 4, kind: 'output',
            prompt: '某 Cache 命中时间为 2 拍，缺失率 4%，每次缺失代价 100 拍，则 AMAT 是 ____ 拍。',
            answer: '6',
            explain: 'AMAT = 命中时间 + 缺失率 × 缺失代价 = 2 + 0.04 × 100 = 6 拍。' +
              '若误用命中率 96% 去乘，会得到 2 + 96 = 98，量纲完全错了。' },
          { label: '(b)', points: 4, kind: 'output',
            prompt: '32 KiB、4 路组相联、块大小 64 B 的 Cache 共有多少组？（只写数字）',
            answer: '128',
            explain: '行数 = 32KiB/64B = 512；组数 = 行数/路数 = 512/4 = 128。' +
              '对应 index 7 位、offset 6 位、tag 19 位（32 位地址）。' }
        ] },

      /* ---------------------------------------------------------- Q7 */
      { no: 7, points: 8, type: 'short answer · calling convention & hazards',
        intro: '每题用两三句话说清「谁负责、为什么」，不需要背完整寄存器表。',
        parts: [
          { label: '(a)', points: 4, kind: 'keywords',
            prompt: '解释 caller-saved 与 callee-saved 的分工：为什么调用者保存的寄存器由调用者负责？',
            keywords: [
              ['caller', '调用者', 'caller-saved', 'a0', 't0'],
              ['callee', '被调用者', 'callee-saved', 's0', 'sp'],
              ['临时', '跨调用', '不保存', '责任']
            ],
            explain: '调用者保存（a0–a7、t0–t6、ra）是「调用前后可能被破坏」的寄存器：调用者若在调用后还要用，就自己先存到栈上。' +
              '被调用者保存（s0–s11、sp）则由 callee 在开头压栈、返回前恢复，保证调用前后值不变。' +
              '分工的原则是「谁知道这个值还要用，谁负责保存」：临时值调用者最清楚，长期变量 callee 最清楚。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: 'forwarding 能解决大多数 RAW 冒险，为什么 load-use 仍必须停一拍？',
            keywords: [
              ['转发', 'forwarding', '旁路', 'bypass'],
              ['load', 'MEM', '数据', '存储器'],
              ['停', 'stall', '气泡', '一拍']
            ],
            explain: 'load 的数据要到 MEM 阶段末尾才从数据存储器取出，而紧跟的指令在 EX 阶段开始就要用；' +
              '转发只能搬「已经算出来」的值，不能搬「还没读出来」的值，所以必须让使用者停一拍，等数据可用后再从 MEM/WB 转发。' }
        ] },

      /* ---------------------------------------------------------- Q8 */
      { no: 8, points: 8, type: 'single choice · datapath',
        intro: '本题考察控制信号与数据通路。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '<code>sw x5, 8(x6)</code> 执行时，下列哪组控制信号正确？',
            options: [
              { text: 'RegWrite=1, MemWrite=1, ALUSrc=1' },
              { text: 'RegWrite=0, MemWrite=1, ALUSrc=1', correct: true },
              { text: 'RegWrite=0, MemWrite=0, ALUSrc=0' },
              { text: 'RegWrite=1, MemWrite=0, ALUSrc=0' }
            ],
            explain: 'sw 要把 rs2 写到内存：MemWrite=1；地址由 rs1+imm 算出，所以 ALUSrc=1；它不写寄存器堆，RegWrite=0。' +
              '若 RegWrite 误置 1，会破坏 rd 字段指向的寄存器（sw 的该字段其实是 rs2）。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '单周期数据通路中，<code>beq</code> 判断「两数相等」依据的是：',
            options: [
              { text: 'ALU 的 zero 输出为 1', correct: true },
              { text: '寄存器堆的写使能为 0' },
              { text: 'MemRead 为 1' },
              { text: 'PC 的最低位为 0' }
            ],
            explain: 'beq 让 ALU 做减法，若结果为零则 zero=1，与 Branch 控制信号相与后选择分支目标地址。' +
              '这样复用 ALU 的比较能力，不必额外造一个比较器。' }
        ] },

      /* ---------------------------------------------------------- Q9 */
      { no: 9, points: 8, type: 'calculation · pipeline',
        intro: '按标准五级流水（IF/ID/EX/MEM/WB）回答。',
        parts: [
          { label: '(a)', points: 4, kind: 'output',
            prompt: '序列 <code>lw x5, 0(x6)</code> 后紧跟 <code>add x7, x5, x5</code>，在只有 forwarding、没有乱序的情况下需要插入几个气泡？',
            answer: '1',
            explain: 'load 的数据在 MEM 末才可用，add 的 EX 紧随其后，差一拍，必须停 1 拍；之后经 MEM/WB→EX 转发即可。' +
              '若有编译器调度，可把一条无关指令填进这一拍，把停顿降为 0。' },
          { label: '(b)', points: 4, kind: 'output',
            prompt: '若分支在 MEM 阶段才判定，预测失败时要冲刷几条已取入的指令？',
            answer: '3',
            explain: '分支在 MEM 判定时，它后面已有 3 条指令进入流水线（EX、ID、IF 各一条），全都要冲刷。' +
              '把判定提前到 EX 只需冲 2 条，提前到 ID 只需冲 1 条——这就是「尽早解析分支」的动机。' }
        ] },

      /* ---------------------------------------------------------- Q10 */
      { no: 10, points: 8, type: 'short answer · linking',
        intro: '用关键词作答，能说清机制即可，不要求背命令参数。',
        parts: [
          { label: '(a)', points: 4, kind: 'keywords',
            prompt: '静态库与动态库在「何时被并入程序、何时解析符号」上有什么不同？',
            keywords: [
              ['静态', '.a', '复制', '链接时'],
              ['动态', '.so', '加载', '运行时', '共享'],
              ['符号', '重定位', '地址']
            ],
            explain: '静态库（.a）在链接时按需抽取成员 .o，复制进可执行文件，符号在链接期全部解析；' +
              '动态库（.so）不复制，只在可执行文件里留下依赖与重定位信息，加载或首次调用时才由动态链接器映射并解析（PLT/GOT）。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '链接时出现 <code>undefined reference</code>，常见原因有哪些？给出至少两个。',
            keywords: [
              ['没有定义', '未定义', '缺少', '漏'],
              ['库', '顺序', '.o', '目标文件'],
              ['声明', '名字', '改编', 'mangle', 'extern']
            ],
            explain: '常见原因：只声明未定义（漏写实现或漏加 .o）；库的顺序不对（依赖者在前、被依赖者在后）；' +
              'C/C++ 名字改编不一致（忘记 extern "C"）；静态库成员没有被任何未定义符号引用，因而不被抽取。' }
        ] },

      /* ---------------------------------------------------------- Q11 */
      { no: 11, points: 8, type: 'fill in the blank',
        intro: '只写答案；进制转换题写十进制数字。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '十六进制数 <code>0x2A</code> 的十进制值是 ____。',
            answer: '42',
            explain: '0x2A = 2×16 + 10 = 42。反过来 42/16 = 2 余 10，10 记作 A，所以是 0x2A。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: 'RISC-V 中保存返回地址的寄存器 ra 的编号是 x____。',
            answer: '1',
            explain: 'ra = x1。x0 恒零，x2 是 sp，x8 是 s0/fp；ra 由 call（auipc+jalr）写入，非叶子函数要在栈帧里保存它。' }
        ] },

      /* ---------------------------------------------------------- Q12 */
      { no: 12, points: 8, type: 'calculation · C to machine',
        intro: '下面这段 C 代码在 RV32 上编译，回答两个与地址和访存有关的问题。',
        code: 'int a[4] = {1, 2, 3, 4};\nint s = 0;\nfor (int i = 0; i < 4; i++)\n    s += a[i];',
        codeTitle: 'sum.c（RV32，int 为 4 字节）',
        parts: [
          { label: '(a)', points: 4, kind: 'output',
            prompt: '若 &a[0] = 0x1000，则 &a[2] 的地址是 ____（写成 0x 开头）。',
            answer: '0x1008',
            explain: 'int 占 4 字节，a[2] 相对 a[0] 偏移 2×4 = 8 字节，所以地址是 0x1000 + 8 = 0x1008。' +
              '汇编里对应 slli t, i, 2 再与基址相加——左移 2 位就是乘 4。' },
          { label: '(b)', points: 4, kind: 'output',
            prompt: '按 -O0 的直译（每轮一次 load），这个循环共执行多少次 <code>lw</code>？',
            answer: '4',
            explain: 'i = 0,1,2,3 共四轮，每轮读一个 a[i]，所以 4 次 lw。若编译器展开（unroll）或向量化，lw 次数可能变化，' +
              '但语义上的访存仍是 4 个元素；这也说明「指令数」依赖编译选项，比较性能时要固定优化级别。' }
        ] }
    ]
  };

  var EXAM_B = {
    id: 'CSC3050-B',
    title: '计算机组成与系统编程 模拟卷 B',
    style: '后半程 + 综合',
    subtitle: 'CSC3050 · 偏重流水线、Cache、链接与性能的限时模拟',
    date: '2026-11-21',
    minutes: 90,
    totalScore: 100,
    summary: '本卷偏重后半程：数据通路与流水线冒险、存储层次与 Cache 定量计算、链接与加载、性能与并行。' +
      '共 10 题 100 分，其中选择、判断、填空各 1 题，计算与写结果 5 题，简答 2 题。',
    instructions: [
      '时间 90 分钟，满分 100 分；每题 10 分，小题各 5 分。',
      '计算题写出关键中间量（周期数、缺失代价、加速比），只写结果也判对，但复盘时更容易定位错误。',
      '简答题按关键词命中比例给分，同义表达也算命中；先给结论，再补一句理由。',
      '开卷风格：可查教材与笔记，不可使用电子设备。',
      '建议顺序：选择/判断/填空 20 分钟，计算 50 分钟，简答与检查 20 分钟。'
    ],
    questions: [

      /* ---------------------------------------------------------- Q1 */
      { no: 1, points: 10, type: 'single choice',
        intro: '本题考察流水线冒险与控制信号。',
        parts: [
          { label: '(a)', points: 5, kind: 'choice',
            prompt: '五级流水线中，<code>lw x5, 0(x6)</code> 紧接 <code>add x7, x5, x8</code>，即使有完整转发，仍必须插入几个气泡？',
            options: [
              { text: '0 个' },
              { text: '1 个', correct: true },
              { text: '2 个' },
              { text: '3 个' }
            ],
            explain: 'load 的数据在 MEM 末尾才可用，而 add 在 EX 开头就要用 x5。EX/MEM 转发只能把 MEM 的结果送回同拍的 EX，' +
              '时间上仍差一拍，所以必须停 1 拍；停 2 拍是保守实现，不是必需。' },
          { label: '(b)', points: 5, kind: 'choice',
            prompt: '下列控制信号中，在 <code>sw</code> 指令里为 0、在 <code>lw</code> 指令里为 1 的是：',
            options: [
              { text: 'RegWrite', correct: true },
              { text: 'MemWrite' },
              { text: 'ALUSrc' },
              { text: 'Branch' }
            ],
            explain: 'lw 要把读出的数据写回寄存器，RegWrite=1；sw 只写存储器，RegWrite=0。' +
              'MemWrite 恰好相反（lw=0、sw=1），ALUSrc 两者都为 1，Branch 两者都为 0。' }
        ] },

      /* ---------------------------------------------------------- Q2 */
      { no: 2, points: 10, type: 'true / false',
        intro: '判断正误；错的要能说出反例。',
        parts: [
          { label: '(a)', points: 5, kind: 'tf',
            prompt: '分支在 EX 阶段判定，比在 MEM 阶段判定少冲刷 1 条指令。',
            options: [
              { text: '正确', correct: true },
              { text: '错误' }
            ],
            explain: 'EX 阶段判定时，后面已有 2 条指令进入流水线，需冲刷 2 条；MEM 阶段判定时已有 3 条，需冲刷 3 条。' +
              '越早判定，浪费的取指工作越少。' },
          { label: '(b)', points: 5, kind: 'tf',
            prompt: '写回 Cache 采用 write-allocate 时，写缺失会先把整个块调入 Cache，再修改其中一部分。',
            options: [
              { text: '正确', correct: true },
              { text: '错误' }
            ],
            explain: 'write-allocate 的典型流程是「取块 → 合并写入 → 标 dirty」，为后续访问保留整块；' +
              'write-no-allocate 则直接写下一级，不占 Cache 行，适合只写一次的数据。' }
        ] },

      /* ---------------------------------------------------------- Q3 */
      { no: 3, points: 10, type: 'fill in the blank',
        intro: '只填数值；小数保留至少两位。',
        parts: [
          { label: '(a)', points: 5, kind: 'fill',
            prompt: '五级流水线每级耗时 200 ps，执行 100 条指令且无任何冒险，总时间约为 ____ ns。',
            answer: '20.8',
            accept: ['20.8ns', '20.8 ns', '20.8纳秒'],
            explain: '填满流水线需 5 拍，之后每拍完成一条：总拍数 = 100 + 4 = 104，104 × 0.2 ns = 20.8 ns。' +
              '若直接用 100×5 拍会算成 100 ns，那是把流水线当成串行。' },
          { label: '(b)', points: 5, kind: 'fill',
            prompt: '一个 32 KiB、2 路组相联、块大小 64 B 的 Cache，共有 ____ 个组（set）。',
            answer: '256',
            explain: '行数 = 32KiB / 64B = 512；2 路组相联下组数 = 行数 / 2 = 256。' +
              'index 位数 = log₂256 = 8，offset = log₂64 = 6，tag = 32 − 8 − 6 = 18。' }
        ] },

      /* ---------------------------------------------------------- Q4 */
      { no: 4, points: 10, type: 'calculation · pipeline timing',
        intro: '按五级流水线（IF/ID/EX/MEM/WB）计算总周期数，忽略其他冒险。',
        parts: [
          { label: '(a)', points: 5, kind: 'output',
            prompt: '执行 5 条指令，其中只有一处 load-use 冒险并插入 1 个气泡，总共需要多少周期？',
            answer: '10',
            explain: '无冒险时 5 条指令需 5 + 4 = 9 拍；load-use 再插入 1 个气泡，共 10 拍。' +
              '也可逐条数：第 1 条 5 拍完成，之后每拍一条，加 1 拍停顿。' },
          { label: '(b)', points: 5, kind: 'output',
            prompt: '执行 10 条指令，其中 2 条 taken 分支都在 EX 阶段判定，其他冒险忽略，总共需要多少周期？',
            answer: '18',
            explain: '基准 10 + 4 = 14 拍；每次 EX 判定 taken 冲刷 2 条已取指令，相当于多 2 拍，两次共 +4，得 18 拍。' +
              '若在 MEM 判定则是 14 + 6 = 20 拍。' }
        ] },

      /* ---------------------------------------------------------- Q5 */
      { no: 5, points: 10, type: 'calculation · cache',
        intro: '写清三个字段的位数；AMAT 保留两位小数。',
        parts: [
          { label: '(a)', points: 5, kind: 'output',
            prompt: '一个 64 KiB、8 路组相联、块大小 64 B 的 Cache，32 位地址如何划分？写成「index=? 位, offset=? 位, tag=? 位」。',
            answer: 'index=7, offset=6, tag=19',
            accept: ['index=7,offset=6,tag=19', 'index 7, offset 6, tag 19', '7,6,19'],
            explain: '行数 = 64KiB / 64B = 1024，组数 = 1024 / 8 = 128；index = log₂128 = 7，offset = log₂64 = 6，' +
              'tag = 32 − 7 − 6 = 19。8 路只影响组数，不影响 offset。' },
          { label: '(b)', points: 5, kind: 'output',
            prompt: '命中时间 2 ns，缺失率 10%，缺失代价 60 ns，则平均访存时间 AMAT = ____ ns。',
            answer: '8',
            accept: ['8ns', '8 ns'],
            explain: 'AMAT = 命中时间 + 缺失率 × 缺失代价 = 2 + 0.1 × 60 = 8 ns。' +
              '注意缺失代价已包含访问下一级的全部时间，不要重复加命中时间。' }
        ] },

      /* ---------------------------------------------------------- Q6 */
      { no: 6, points: 10, type: 'calculation · memory & CPI',
        intro: '两小题彼此独立。',
        parts: [
          { label: '(a)', points: 5, kind: 'fill',
            prompt: 'L1 命中 1 ns、缺失率 8%；L2 命中 5 ns、本地缺失率 25%；内存访问 80 ns。AMAT = ____ ns。',
            answer: '3',
            explain: 'L2 的缺失代价 = 0.25 × 80 = 20 ns，所以 L2 平均访问 = 5 + 20 = 25 ns；' +
              'L1 的缺失代价即 25 ns，AMAT = 1 + 0.08 × 25 = 3 ns。' },
          { label: '(b)', points: 5, kind: 'fill',
            prompt: '基准 CPI 为 1.2，其中访存指令占 20%，数据 Cache 缺失率 5%，每次缺失代价 40 拍，则实际 CPI = ____。',
            answer: '1.6',
            explain: '每条指令平均停顿 = 20% × 5% × 40 = 0.4 拍，实际 CPI = 1.2 + 0.4 = 1.6。' +
              '若把 20% 当成小数 0.2 再乘一次，会得到 0.04，量级就错了。' }
        ] },

      /* ---------------------------------------------------------- Q7 */
      { no: 7, points: 10, type: 'calculation · performance',
        intro: '两台机器执行同一程序，指令数相同。',
        parts: [
          { label: '(a)', points: 5, kind: 'fill',
            prompt: '机器 A：2 GHz、CPI 1.5，执行 10⁹ 条指令，CPU 时间为 ____ 秒（保留三位小数）。',
            answer: '0.750',
            accept: ['0.75', '0.750s', '0.75s'],
            explain: 'T = IC × CPI / f = 10⁹ × 1.5 / (2×10⁹) = 0.75 s。' },
          { label: '(b)', points: 5, kind: 'choice',
            prompt: '机器 B：3 GHz、CPI 2.0，同样执行 10⁹ 条指令。哪台更快？',
            options: [
              { text: 'A 更快' },
              { text: 'B 更快', correct: true },
              { text: '一样快' },
              { text: '无法比较，缺少指令类型分布' }
            ],
            explain: 'B 的时间 = 10⁹ × 2 / (3×10⁹) ≈ 0.667 s，比 A 的 0.75 s 短，所以 B 更快，加速比约 1.125。' +
              '主频高但 CPI 也高，必须用 CPU 时间公式比较，不能只看 GHz。' }
        ] },

      /* ---------------------------------------------------------- Q8 */
      { no: 8, points: 10, type: 'output · ISA & datapath',
        intro: '按 RV32I 编码与 jal 语义作答。',
        parts: [
          { label: '(a)', points: 5, kind: 'fill',
            prompt: '<code>sw x6, 8(x5)</code> 的 32 位机器码是 ____（0x 开头 8 位十六进制）。',
            answer: '0x0062A423',
            explain: 'S 型：imm=8 拆成 imm[11:5]=0000000、imm[4:0]=01000；rs2=x6=00110、rs1=x5=00101、funct3=010、opcode=0100011。' +
              '拼得 0x0062A423。与 lw 的 opcode=0000011 只差最低几位。' },
          { label: '(b)', points: 5, kind: 'fill',
            prompt: '执行 <code>jal x1, func</code> 后，x1 中保存的是 ____。',
            answer: 'PC+4',
            accept: ['pc+4', 'PC + 4', 'pc + 4', '返回地址'],
            explain: 'jal 先把下一条指令地址 PC+4 写入 rd（这里是 x1/ra），再跳到目标；函数返回时 <code>jalr x0, 0(x1)</code> 即可回到调用点。' }
        ] },

      /* ---------------------------------------------------------- Q9 */
      { no: 9, points: 10, type: 'short answer · linking',
        intro: '用自己的话回答，覆盖关键差异即可。',
        parts: [
          { label: '(a)', points: 10, kind: 'keywords',
            prompt: '简述静态库与动态库在链接/加载方式、磁盘与内存占用、升级维护上的区别。',
            keywords: [
              ['静态库', '静态链接'],
              ['复制', '拷贝', '嵌入', '打包进'],
              ['动态库', '共享库', 'so'],
              ['加载时', '运行时', '装载'],
              ['共享', '一份', '多个进程']
            ],
            answer: '静态库在链接时把用到的目标模块复制进可执行文件，程序自带代码、不依赖外部库，但体积大、多个进程各存一份，库升级需重新链接。' +
              '动态库在加载或运行时由动态链接器映射，多个进程共享同一份代码，可独立升级，但需要正确的搜索路径与版本兼容。',
            explain: '关键词分别对应：静态链接方式、复制进可执行文件、动态库概念、加载/运行时绑定、内存共享。答出三点以上即可得大部分分数。' }
        ] },

      /* ---------------------------------------------------------- Q10 */
      { no: 10, points: 10, type: 'short answer · parallel performance',
        intro: '先定义现象，再给避免办法。',
        parts: [
          { label: '(a)', points: 10, kind: 'keywords',
            prompt: '什么是伪共享（false sharing）？它为什么会让多线程程序变慢？可以怎样避免？',
            keywords: [
              ['不同变量', '不同数据', '独立的变量'],
              ['同一', '相同'],
              ['cache line', '缓存行', '缓存块'],
              ['失效', '来回', '乒乓', '争用'],
              ['padding', '填充', '对齐', '分开', '独立缓存行']
            ],
            answer: '伪共享指多个线程修改各自独立的变量，但这些变量落在同一条 Cache line 上。' +
              '一个线程写入会使其他核的副本失效，缓存行在核间来回传递，形成乒乓，串行化了本可并行的写操作。' +
              '避免方法是让热点变量各自占一条缓存行（padding/对齐），或按线程分块、减少跨线程共享写。',
            explain: '关键词覆盖：独立变量、同一条缓存行、失效/乒乓、padding 或对齐。' }
        ] }
    ]
  };

  /* 桥接：数据脚本可能先于 assets/exam.js 加载，引擎启动时从 CSC._exams 取卷。 */
  CSC._exams = [EXAM, EXAM_B];
  CSC.registerExam(EXAM);
  CSC.registerExam(EXAM_B);
})();
