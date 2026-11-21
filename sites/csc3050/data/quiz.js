/* =====================================================================
 * quiz.js · CSC3050 分章题库（PACK.items）
 * 每项字段：{ id:'ch01-q1', ch:'ch01', kp:'ch01-1', tier:1,
 *            type:'mcq'|'tf'|'fill'|'multi'|'predict',
 *            difficulty:1, tags:['concept'], stem, options?, answer?,
 *            accept?, code?, codeTitle?, explain }
 * 目标：每章 7 题，全站 56 题；每题必须写 explain。
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = {
    items: [
      /* ================= ch00 课程地图 ================= */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '在「问题 → 程序 → 指令集 → 微体系结构 → 电路」这条抽象链里，指令集（ISA）处在哪两层之间？',
        options: [
          { text: '问题与算法之间' },
          { text: '程序/语言与微体系结构之间', correct: true },
          { text: '微体系结构与电路之间' },
          { text: '电路与晶体管之间' }
        ],
        explain: 'ISA 是软硬件的契约：往上是编译器与操作系统看到的指令、寄存器、地址空间；往下是微体系结构要用数据通路、流水线去实现的东西。所以它是「程序/语言」与「微体系结构」之间的分界线。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '第 03 章的数据通路可以直接阅读，不必先学第 02 章的指令格式与寄存器约定。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '数据通路是「为哪条指令搭哪些部件」的答案，控制信号也直接来自 opcode/funct3/funct7。不先掌握指令格式与寄存器约定，就看不懂为什么这里要一个多路选择器、那里要一条写回通路。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '按 RISC-V 调用约定，函数返回值放在 ______ 寄存器里（写寄存器名）。',
        answer: 'a0',
        accept: ['x10', 'a0(x10)', '$a0'],
        explain: 'RV32I 的 ABI 规定：整型/指针返回值放在 a0（x10），第二个返回值才用 a1。参数也从前八个整型寄存器 a0–a7 传入。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '按课程大纲，四个 Project 合计占总评的多少？',
        options: [
          { text: '25%' },
          { text: '35%' },
          { text: '45%', correct: true },
          { text: '55%' }
        ],
        explain: '出勤 5% + 随堂测验 25% + 四个 Project 45% + 期末 25%。项目单项为 10%、10%、12.5%、12.5%，合计 45%，比期末还高，所以「只刷题不做项目」拿不到高分。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['tool'],
        stem: '要查看一个 ELF 可执行文件的节表（.text/.data/.bss 各多大）与重定位条目，最直接的工具是？',
        options: [
          { text: 'gcc' },
          { text: 'readelf', correct: true },
          { text: 'make' },
          { text: 'gdb' }
        ],
        explain: 'readelf -S 看节表，readelf -r 看重定位，readelf -h 看 ELF 头；objdump 更偏向反汇编与段内容。gcc 负责编译，gdb 负责调试，make 负责组织构建。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '本站建议的学习动作中，哪些是真正能暴露「以为懂了」的？（多选）',
        options: [
          { text: '合上正文，手算一个最小例子', correct: true },
          { text: '自己画一遍数据通路或拆一次 Cache 地址', correct: true },
          { text: '用章末自检清单逐条自问，答不出就回读', correct: true },
          { text: '把结论页抄一遍，考前背下来' },
          { text: '只看视频，不做题也不写代码' }
        ],
        explain: '主动回忆、手算、动手画、按清单自检都会迫使你从「输入」转为「输出」，从而暴露漏洞；抄结论与被动观看会带来「熟悉感」，但不产生可调用的知识。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪一项不是本站所说「硬件视角与软件视角交汇」的三处之一？',
        options: [
          { text: '函数调用约定' },
          { text: '流水线冒险与指令调度' },
          { text: 'Cache 与链接布局' },
          { text: '浮点舍入模式的默认值', correct: true }
        ],
        explain: '三处交汇是调用约定（谁保存哪些寄存器）、流水线冒险（软件调度 vs 硬件 forwarding/stall）、Cache 与链接布局（地址决定冲突与 TLB）。浮点舍入模式属于数值格式的细节，不是软硬件分工的交汇点。'
      },

      /* ================= ch01 数制与数据表示 ================= */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '32 位补码中，整数 −1 的机器码是？',
        options: [
          { text: '0x80000001' },
          { text: '0xFFFFFFFF', correct: true },
          { text: '0x00000001' },
          { text: '0x7FFFFFFF' }
        ],
        explain: '−1 的补码是全 1：按位取反 0…01 得 1…10，再加 1 得 1…11，即 0xFFFFFFFF。0x80000001 是 −(2³¹−1)，0x7FFFFFFF 是 INT_MAX。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-7', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '单精度 IEEE 754 下，6.5 的位模式是？',
        options: [
          { text: '0x40D00000', correct: true },
          { text: '0x40C00000' },
          { text: '0x40E00000' },
          { text: '0x3FC00000' }
        ],
        explain: '6.5 = 110.1₂ = 1.101×2²。符号 0，指数 127+2=129=1000_0001，尾数 101 后补 0。拼起来 0 10000001 1010000… = 0x40D00000。0x40C00000 是 6.0，0x40E00000 是 7.0。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '两个正数相加，若结果的符号位变成 1，就说明发生了有符号溢出。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '同号相加结果异号即溢出：正+正得负、负+负得正。硬件用「最高位进位与次高位进位异或」判断，C 语言里有符号溢出是未定义行为，不能依赖回绕结果。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '十六进制数 0xBA 对应的十进制是 ______。',
        answer: '186',
        accept: ['186', '一百八十六'],
        explain: '0xBA = 11×16 + 10 = 176 + 10 = 186。反过来 186 = 0xBA：186/16=11 余 10，11=B，10=A。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '对负数做「算术右移」与「逻辑右移」，区别是？',
        options: [
          { text: '算术右移补 0，逻辑右移补 1' },
          { text: '算术右移补符号位，逻辑右移补 0', correct: true },
          { text: '两者完全一样，只是写法不同' },
          { text: '算术右移只能移 1 位' }
        ],
        explain: '算术右移保持符号：负数右移高位补 1，相当于除以 2 向下取整；逻辑右移高位补 0，会把负数变成很大的正数。C 中有符号右移的实现定义（通常算术），无符号一定逻辑。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'RV32 上，结构体 <code>struct { char c; int i; }</code> 的 sizeof 最可能是？',
        options: [
          { text: '5' },
          { text: '6' },
          { text: '8', correct: true },
          { text: '12' }
        ],
        explain: 'int 要求 4 字节对齐，c 占 1 字节后要补 3 字节，i 放偏移 4，总大小 8；结构体整体还要按最大成员对齐，8 已是 4 的倍数。把 int 换成 double 常见结果是 16。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-8', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些在 C 语言里属于未定义行为（UB）？（多选）',
        options: [
          { text: '对 INT_MIN 取负', correct: true },
          { text: '有符号整数加法溢出', correct: true },
          { text: '无符号整数加法溢出' },
          { text: '读取未初始化的局部变量', correct: true },
          { text: '把 int 赋给 long' }
        ],
        explain: '有符号溢出、INT_MIN 取负、读未初始化变量都是 UB，编译器可以做任意假设；无符号溢出是良定义的模 2ⁿ 回绕；int→long 是保值转换（RV32 的 long 与 int 同宽则另说，但仍是良定义）。'
      },

      /* ================= ch02 RISC-V 指令系统 ================= */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['encoding'],
        stem: '<code>addi x5, x0, 10</code> 的 32 位机器码是？',
        options: [
          { text: '0x00A00293', correct: true },
          { text: '0x00A00213' },
          { text: '0x00A28293' },
          { text: '0x00A00313' }
        ],
        explain: 'I 型：imm=10 在 [31:20]，rs1=x0 在 [19:15]，funct3=000 在 [14:12]，rd=x5 在 [11:7]，opcode=0010011。拼得 000000001010 00000 000 00101 0010011 = 0x00A00293。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: 'RV32I 中寄存器 x0 的特殊之处是？',
        options: [
          { text: '它保存返回地址' },
          { text: '它恒为 0，写入被丢弃', correct: true },
          { text: '它只能由内核读写' },
          { text: '它是栈指针' }
        ],
        explain: 'x0/zero 硬连线为 0：读它得 0，写它无效。这让「把某寄存器清 0」「比较后取反」等操作有统一写法，例如 addi x5, x0, 10 就是给 x5 赋常数 10。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['encoding'],
        stem: 'B 型分支指令里的 12 位立即数，在计算目标地址时怎样使用？',
        options: [
          { text: '直接作为绝对地址' },
          { text: '左移 1 位（×2）后与 PC 相加', correct: true },
          { text: '左移 2 位（×4）后与 PC 相加' },
          { text: '与 rs1 的值相加' }
        ],
        explain: 'RISC-V 指令按 2 字节对齐，B 型立即数省略最低位，编码时是 13 位有符号偏移的低 12 位；硬件先符号扩展再左移 1 位，加到 PC 上。JAL 的 20 位立即数同理左移 1 位。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-6', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: 'RISC-V 中保存函数返回地址的寄存器别名是 ______。',
        answer: 'ra',
        accept: ['ra', 'x1', 'ra(x1)'],
        explain: 'ra（x1）由 call 伪指令（auipc + jalr）写入返回地址；叶子函数可以不保存它，非叶子函数在 prologue 把它压栈、epilogue 恢复。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '按 RISC-V ABI，下面哪些寄存器必须由被调用者（callee）负责保存与恢复？（多选）',
        options: [
          { text: 's0（fp）', correct: true },
          { text: 'sp', correct: true },
          { text: 't0' },
          { text: 'a0' },
          { text: 's11', correct: true }
        ],
        explain: 'callee-saved 包括 s0–s11 与 sp（以及 gp/tp 的约定用法）；t0–t6、a0–a7、ra 都是 caller-saved。被调用者若要用 s 系列，必须先存旧值、返回前恢复。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '指令 <code>sub x5, x6, x7</code> 计算的是？',
        options: [
          { text: 'x5 = x6 − x7', correct: true },
          { text: 'x5 = x7 − x6' },
          { text: 'x6 = x5 − x7' },
          { text: 'x7 = x6 − x5' }
        ],
        explain: 'R 型格式是 op rd, rs1, rs2，语义为 rd = rs1 op rs2。所以 sub x5, x6, x7 即 x5 = x6 − x7；减法没有立即数形式，减常数要先 li 或用 addi 加负数。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: 'li   t0, 5\nli   t1, 3\nadd  t2, t0, t1\nsub  t3, t0, t1',
        codeTitle: 'RV32I 汇编片段',
        stem: '执行完这段汇编后，t2 与 t3 的值分别是多少？（写成「t2=? t3=?」）',
        answer: 't2=8 t3=2',
        accept: ['8 2', 't2=8, t3=2', 't2 = 8, t3 = 2', 't2 8 t3 2'],
        explain: 'li 把常数装入寄存器（伪指令，通常展开为 addi 或 lui+addi）；add t2,t0,t1 得 5+3=8；sub t3,t0,t1 得 5−3=2。注意 sub 的顺序是 rs1−rs2，写反会得到 −2。'
      },

      /* ================= ch03 处理器数据通路 ================= */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '执行 <code>lw x6, 4(x5)</code> 时，控制信号 MemtoReg 应为？',
        options: [
          { text: '0，因为写回数据来自 ALU' },
          { text: '1，因为写回数据来自数据存储器', correct: true },
          { text: 'x（无关项）' },
          { text: '1，因为要写存储器' }
        ],
        explain: 'MemtoReg 选择写回寄存器的数据来源：0 选 ALU 结果（R 型、addi），1 选 DMEM 读出的数据（lw）。lw 的 MemRead=1、MemWrite=0、RegWrite=1、ALUSrc=1。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '单周期数据通路中，若当前指令不是跳转/分支，下一条指令的 PC 通常来自？',
        options: [
          { text: 'PC + 4', correct: true },
          { text: 'PC + 立即数' },
          { text: 'ALU 结果' },
          { text: 'ra 寄存器' }
        ],
        explain: 'RV32I 指令 4 字节对齐，顺序执行时 PC ← PC+4，由一个专用加法器在取指阶段算出；分支/跳转时再由另一个加法器算目标地址，通过多路选择器切换。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-7', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '单周期实现里，决定时钟周期长短的关键路径通常属于哪条指令？',
        options: [
          { text: 'add' },
          { text: 'beq' },
          { text: 'lw', correct: true },
          { text: 'jal' }
        ],
        explain: 'lw 要走完 PC→IMEM→寄存器堆读→ALU 算地址→DMEM 读→写回寄存器堆，比 R 型多一段 DMEM 延迟；sw 虽然也访存但不写回，beq 不写回，所以 lw 的关键路径最长。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: 'jal 指令除了跳转，还会把 PC+4 写入 rd 寄存器。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'jal rd, offset 的语义是 rd ← PC+4（返回地址），PC ← PC+offset。所以数据通路要为 jal 增加一条「PC+4 → 写回」的路径，并把写回选择器扩成三选一。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: 'R 型指令的 ALU 第二个操作数来自寄存器 rs2，因此 ALUSrc 应取 ______。',
        answer: '0',
        accept: ['0', '零'],
        explain: 'ALUSrc=0 选 rs2 的值（R 型），ALUSrc=1 选立即数（I/S 型）。R 型没有立即数，所以必须为 0；若误设为 1，add 会变成「加一个无关的立即数」。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下列指令中，哪些会把 RegWrite 置 1？（多选）',
        options: [
          { text: 'add x5, x6, x7', correct: true },
          { text: 'lw x5, 0(x6)', correct: true },
          { text: 'sw x5, 0(x6)' },
          { text: 'beq x5, x6, label' }
        ],
        explain: 'RegWrite=1 表示「本周期要写寄存器堆」。R 型与 lw 都写 rd；sw 只写内存，beq 只改 PC，都不写寄存器。若把 sw 的 RegWrite 置 1，会破坏 rd 指向的寄存器（sw 的 rd 字段其实存的是 rs2）。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '单周期数据通路中，分支目标地址为什么要用独立的加法器？',
        options: [
          { text: '因为 ALU 不能做加法' },
          { text: '因为分支需要同时算 ALU 结果与目标地址，共用一个加法器会多一拍', correct: true },
          { text: '因为 PC 不能参与运算' },
          { text: '因为立即数必须左移 2 位' }
        ],
        explain: 'beq 需要 ALU 比较两操作数，同时还要算 PC+offset 作为目标地址；若共用一个加法器就得串行两拍，破坏单周期「一拍一条」的约定。多一个加法器换来并行，是典型的面积换时间。'
      },

      /* ================= ch04 流水线与冒险 ================= */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '五级流水线在理想情况（无冒险、各级等长）下的加速比约为？',
        options: [
          { text: '1（流水不加速）' },
          { text: '2' },
          { text: '5', correct: true },
          { text: '25' }
        ],
        explain: '理想加速比等于流水级数：单周期一条指令用 5 个时间单位，流水线稳态下每个时间单位完成一条，吞吐提升 5 倍。但单条指令的延迟没有下降（甚至因流水寄存器略增）。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'EX/MEM 流水寄存器里通常不保存下面哪一项？',
        options: [
          { text: 'ALU 计算结果' },
          { text: '目的寄存器号 rd' },
          { text: '下一条指令的 PC 值', correct: true },
          { text: '部分控制信号（MemRead/MemWrite/RegWrite）' }
        ],
        explain: 'EX/MEM 把 EX 的结果送到 MEM：ALU 结果（既是地址也是写回候选）、rs2 的值（给 sw 写数据）、rd 号与控制信号。下一条 PC 由 IF 阶段维护，不需要放进 EX/MEM。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '有了完整的 forwarding（旁路）之后，load-use 数据冒险也可以完全不用停顿。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'load 的数据在 MEM 阶段末尾才从存储器取出，而下一条指令在 EX 阶段一开始就要用。时间上赶不上，必须停 1 拍再转发。这是 forwarding 无法消除的唯一常见 RAW 冒险。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '紧跟在 load 之后使用其结果的指令，在五级流水中通常需要插入 ______ 个气泡（stall）。',
        answer: '1',
        accept: ['1', '一', '一个'],
        explain: 'load-use 只需停 1 拍：第 1 拍让使用者在 ID 阶段等待，load 进入 MEM；下一拍数据可用，经 MEM/WB→EX 转发即可。编译器也可通过调度把无关指令填进这一拍。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-6', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '若分支在 EX 阶段判定，预测失败时需要冲刷（flush）几条已经取入的指令？',
        options: [
          { text: '0' },
          { text: '1' },
          { text: '2', correct: true },
          { text: '3' }
        ],
        explain: '分支在 EX 判定时，IF 与 ID 里各有 1 条年轻指令，共 2 条要冲刷；若把判定提前到 ID，只需冲 1 条；若拖到 MEM，则要冲 3 条。判定越早，惩罚越小，但硬件越复杂。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '两位饱和计数器初值为 10（弱不跳），连续两次「跳转」后状态变为？',
        options: [
          { text: '00' },
          { text: '01' },
          { text: '10' },
          { text: '11', correct: true }
        ],
        explain: '10 是「弱不跳」，第一次跳转 →11（强跳转），第二次跳转仍停在 11。饱和计数器不会越过边界；连续两次不跳才会从 11 退回 10。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下列哪些情况会造成结构冒险？（多选）',
        options: [
          { text: '指令存储器与数据存储器共用一个单端口存储器', correct: true },
          { text: '乘法器需要多拍才能算完，而流水线每拍都想发射一条新指令', correct: true },
          { text: '后一条指令要读前一条 load 的结果' },
          { text: '分支指令改变了 PC' }
        ],
        explain: '结构冒险是「两条指令抢同一个硬件资源」：单端口存储器无法同拍取指与访存，未流水的多拍乘法器会让后一条指令等待。load-use 是数据冒险，分支改 PC 是控制冒险。'
      },

      /* ================= ch05 存储层次与 Cache ================= */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '一个 32 KiB、4 路组相联、块大小 64 B 的 Cache，index 占多少位？',
        options: [
          { text: '6' },
          { text: '7', correct: true },
          { text: '8' },
          { text: '9' }
        ],
        explain: '行数 = 32KiB / 64B = 512；组数 = 512 / 4 = 128；index = log₂128 = 7 位，offset = log₂64 = 6 位，32 位地址下 tag = 32−7−6 = 19 位。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '平均访存时间 AMAT 的正确公式是？',
        options: [
          { text: 'hit time + miss rate × miss penalty', correct: true },
          { text: 'hit time × miss rate + miss penalty' },
          { text: 'miss rate × miss penalty' },
          { text: 'hit time / hit rate' }
        ],
        explain: '每次访问都先付命中时间，再以 miss rate 的概率付一次缺失代价。例：命中 1 拍、miss 率 5%、缺失代价 50 拍，AMAT = 1 + 0.05×50 = 3.5 拍。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '全相联 Cache 的冲突缺失最少，但每次访问要并行比较所有行的 tag。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '全相联允许任意块放任意行，没有 index 引起的冲突缺失；代价是比较器数量与延迟随行数增长，所以真实 Cache 多用组相联折中。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '写命中时只更新 Cache、不立即写内存，等该行被替换时才写回的策略叫 ______（写回 / write-back）。',
        answer: '写回',
        accept: ['写回', 'write-back', 'write back', '回写'],
        explain: '写回策略每行需要 dirty 位，减少内存流量，但一致性维护更复杂；写直达（write-through）每次写都到内存，简单但流量大，常配写缓冲。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下列哪些是时间局部性的例子？（多选）',
        options: [
          { text: '循环里反复访问同一个变量', correct: true },
          { text: '反复执行同一段循环指令', correct: true },
          { text: '顺序遍历一个数组' },
          { text: '随机访问哈希表中的键' }
        ],
        explain: '时间局部性指「刚用过的还会再用」：同一变量、同一段指令在短时间内被重复使用。顺序遍历数组是空间局部性（相邻地址会被一起取入），不是时间局部性；随机访问哈希表两者都不明显。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'TLB 中缓存的内容是？',
        options: [
          { text: '最近访问的 Cache 数据块' },
          { text: '虚拟页号到物理页号的页表项', correct: true },
          { text: '分支目标地址' },
          { text: '函数的返回地址' }
        ],
        explain: 'TLB 是页表的 Cache：把 VPN→PFN 的映射与权限位放在小而快的相联存储器里，避免每次访存都查内存中的多级页表。TLB miss 由硬件页表遍历或软件处理。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '矩阵乘法做分块（blocking）最主要的收益是？',
        options: [
          { text: '减少指令数' },
          { text: '提高数据复用，减少容量缺失与内存流量', correct: true },
          { text: '消除 compulsory miss' },
          { text: '让 Cache 容量变大' }
        ],
        explain: '分块把大矩阵切成能放进 Cache 的小块，使每个块在被替换前被多次复用，主要减少 capacity miss（也减少 conflict），从而降低 miss rate 与带宽压力；它不改变 Cache 容量，也消不掉首次访问的 compulsory miss。'
      },

      /* ================= ch06 链接与加载 ================= */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '从 .c 源文件到可执行文件，正确的四步顺序是？',
        options: [
          { text: '预处理 → 编译 → 汇编 → 链接', correct: true },
          { text: '编译 → 预处理 → 链接 → 汇编' },
          { text: '汇编 → 编译 → 预处理 → 链接' },
          { text: '链接 → 汇编 → 编译 → 预处理' }
        ],
        explain: 'cpp 展开宏与头文件得到 .i；cc1 生成汇编 .s；as 汇编成可重定位目标文件 .o；ld 合并节、解析符号、重定位，得到可执行文件。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: 'ELF 中哪个节在文件里不占实际空间（只记录大小）？',
        options: [
          { text: '.text' },
          { text: '.rodata' },
          { text: '.data' },
          { text: '.bss', correct: true }
        ],
        explain: '.bss 存放未初始化或清零的全局/静态变量，加载时由内核映射为零页，文件里只需记录大小；.data 存放有初值的变量，要真占文件空间。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '强符号与弱符号同名时，链接器一定会报 multiple definition 错误。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '规则是：强+弱 → 选强；弱+弱 → 任选一个；强+强 → 才报错。所以「一定报错」是错的。C 里未初始化的全局变量是 COMMON（弱），有初值的是强符号。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'fill', difficulty: 1,
        tags: ['tool'],
        stem: '静态库在 Linux 上的常见文件后缀是 ______。',
        answer: '.a',
        accept: ['a', '.a', '.lib'],
        explain: '静态库是 .a（archive，ar 打包的一堆 .o），链接时按需抽取成员复制进可执行文件；动态库是 .so（shared object），运行时由动态链接器映射。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '动态链接中 PLT 的主要作用是？',
        options: [
          { text: '保存全局变量' },
          { text: '作为跳板，首次调用触发解析、之后跳到 GOT 中的实际地址', correct: true },
          { text: '存放调试符号' },
          { text: '压缩可执行文件' }
        ],
        explain: 'PLT 里每个外部函数有一小段跳板代码：首次调用跳到动态链接器解析符号并填 GOT，之后 GOT 已指向真实函数，PLT 直接间接跳转。延迟绑定让未调用的函数不付解析成本。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '一个重定位条目通常需要包含哪些信息？（多选）',
        options: [
          { text: '要修改的位置（节内偏移）', correct: true },
          { text: '引用的符号', correct: true },
          { text: '重定位类型（如 R_RISCV_HI20/LO12）', correct: true },
          { text: '整个程序的源代码行号' }
        ],
        explain: '链接器要知道「改哪里、按哪个符号改、怎么改」：offset、symbol、type，有时还有加数 addend。源代码行号属于调试信息，与重定位计算无关。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-8', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['tool'],
        stem: '编译时看到 <code>undefined reference to foo</code>，这个问题最可能发生在哪个阶段？',
        options: [
          { text: '预处理' },
          { text: '编译（生成汇编）' },
          { text: '汇编' },
          { text: '链接', correct: true }
        ],
        explain: '编译阶段只检查声明，未定义的函数只要声明了就能过；链接器合并所有目标文件后仍找不到 foo 的定义，才报 undefined reference。常见原因：漏了 .o、库顺序不对、C++ 名字改编不匹配。'
      },

      /* ================= ch07 性能与并行 ================= */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: 'CPU 时间的正确分解是？',
        options: [
          { text: '指令数 × CPI × 时钟周期', correct: true },
          { text: '指令数 / (CPI × 频率)' },
          { text: 'CPI × 频率' },
          { text: '指令数 × 频率 / CPI' }
        ],
        explain: 'CPU 时间 = IC × CPI × T = IC × CPI / f。三项分别由编译器/算法、微架构、工艺决定；优化一项常会影响另外两项，所以要整体估算。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calculation'],
        stem: '某程序 90% 的时间可并行，用 4 核加速，按 Amdahl 定律整体加速比约为？',
        options: [
          { text: '2.5×' },
          { text: '3.08×', correct: true },
          { text: '4.00×' },
          { text: '10×' }
        ],
        explain: 'S = 1/((1−0.9) + 0.9/4) = 1/(0.1+0.225) = 1/0.325 ≈ 3.08。即使核数无限，上限也只有 1/0.1 = 10×。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'fill', difficulty: 1,
        tags: ['calculation'],
        stem: '可并行比例 p=0.9 时，无论加多少核，Amdahl 加速比的上限是 ______ 倍。',
        answer: '10',
        accept: ['10', '10×', '十倍'],
        explain: 'N→∞ 时 S → 1/(1−p) = 1/0.1 = 10。串行部分 10% 决定了天花板；想超过 10× 必须先减少串行部分，而不是继续加核。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '自动向量化（SIMD）对循环的最基本要求是？',
        options: [
          { text: '循环次数必须是 2 的幂' },
          { text: '各次迭代的数据彼此独立、无跨迭代依赖', correct: true },
          { text: '循环里不能有数组访问' },
          { text: '必须使用递归' }
        ],
        explain: 'SIMD 同时对多个 lane 做同一操作，前提是 lane 之间没有依赖；前缀和、递归、指针可能别名都会阻止向量化。次数不必是 2 的幂，编译器会生成余数循环（epilogue）。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '伪共享（false sharing）是指两个线程同时读写同一个变量。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '伪共享是「逻辑上不同的变量落在同一 Cache 行」，两个线程各写各的变量，却因共享同一行而互相让副本失效。真正的同一变量竞争是数据竞争，需要锁或原子操作解决。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下列哪些属于提升指令级并行（ILP）的硬件技术？（多选）',
        options: [
          { text: '超标量发射', correct: true },
          { text: '乱序执行', correct: true },
          { text: '寄存器重命名', correct: true },
          { text: '分支预测与推测执行', correct: true },
          { text: 'SIMD 向量指令' }
        ],
        explain: '前四项都在「一条指令流里找独立指令并重叠」；SIMD 是数据级并行（一条指令处理多个数据），不属于 ILP。GPU 的 SIMT 也属于数据级/线程级并行。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-8', tier: 3, type: 'mcq', difficulty: 2,
        tags: ['method'],
        stem: '接手一个「感觉慢」的程序，第一步最应该做什么？',
        options: [
          { text: '先把最内层循环改成指针写法' },
          { text: '建立可重复的基线并用 profiler 找出热点', correct: true },
          { text: '直接开 -O3 并相信编译器' },
          { text: '把所有变量都加 volatile' }
        ],
        explain: '没有基线就无法证明优化有效，没有热点就可能优化了只占 2% 的代码。正确顺序是定义指标、测基线、剖析、只改瓶颈、回归验证；盲目改写常引入 bug 且收益不可测。'
      }
    ]
  };

  /* 桥接：数据脚本先于 assets/quiz.js 加载，引擎启动时从这里取同一份 pack。 */
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
