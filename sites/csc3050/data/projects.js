/* =====================================================================
 * data/projects.js · CSC3050 计算机组成与系统编程 · 实战项目
 * 职责：给 assets/projects.js 提供四个由易到难的项目。
 * 结构：{ id, title, en, tagline, level, minutes, chapters, goals, intro,
 *         milestones:[{ n, title, tasks, starter, hints, solution }] }
 * 说明：四个项目对应课程真实的 Project 1–4：汇编、Bomb Lab、流水线模拟器、
 *       Cache 模拟器。代码以 RV32 汇编与 C99 为主，不依赖第三方库。
 * ===================================================================== */
(function () {
  'use strict';

  /* 把多行代码拼成一个字符串，避免模板字符串里的反引号与 ${} 干扰。 */
  function code(lines) { return lines.join('\n'); }

  CSC.registerProjects([

    /* ================================================================ P1 */
    {
      id: 'P1',
      title: 'RISC-V 汇编：从递归到字符串',
      en: 'RV32 ASSEMBLY WORKOUT',
      tagline: '不用一条 C 语句，只用 32 个寄存器和栈帧，把斐波那契、字符串与数组写完。',
      level: '入门',
      minutes: 150,
      chapters: ['ch02'],
      goals: [
        '能独立把一个小型 C 函数翻译成 RV32I 汇编，并手工维护栈帧与返回地址。',
        '理解 caller-saved 与 callee-saved 的实际后果：递归函数为什么必须保存 ra。',
        '会用 ecall 完成输入输出，能用 gdb 单步检查寄存器与内存。'
      ],
      intro: 'Project 1 的要求是「用汇编写程序」，很多人卡住不是因为指令不熟，而是因为不知道栈帧该长什么样。' +
        '这个项目把任务拆成三步：先写不调用别人的叶子函数，再写会递归的函数，最后处理字符串与数组。' +
        '每一步都要求你在纸上先画出栈的变化，再写代码——这是本课程后续所有实验的共同方法。',
      milestones: [
        {
          n: 1,
          title: '叶子函数与系统调用',
          tasks: [
            '写一个 abs(x) 函数：输入 a0，输出 a0，不调用任何其他函数，不使用栈。',
            '写一个 max3(a, b, c) 函数：三个参数在 a0/a1/a2，返回最大值，同样不使用栈。',
            '写 main：从标准输入读两个整数（ecall 5），调用 max3，把结果用 ecall 1 打印，最后 ecall 10 退出。',
            '用 gdb 在 main 与 max3 下断点，单步执行并记录每次 a0 的变化；确认返回时 a0 就是结果。',
            '回答：这两个函数为什么可以不保存 ra？如果把 max3 改成调用 abs，ra 会出什么问题？'
          ],
          starter: code([
            '# leaf.S —— 里程碑 1 骨架',
            '    .text',
            '    .globl main',
            'main:',
            '    # TODO: 读两个数到 t0、t1',
            '    # TODO: 调用 max3',
            '    # TODO: 打印结果并退出',
            '',
            'max3:',
            '    # a0 = max(a0, a1, a2)',
            '    # TODO: 用 bge 比较，返回时结果放在 a0',
            '    ret'
          ]),
          hints: [
            '叶子函数不调用别人，ra 不会被覆盖，所以不需要 sw ra, 0(sp)。这也是「叶子函数可以不开栈帧」的原因。',
            'ecall 的编号放在 a7：读整数是 5，打印整数是 1，退出是 10。ecall 5 的结果在 a0。',
            'max3 可以先比较 a0 与 a1，把较大者留在 a0；再与 a2 比较。用 bge 跳过一个 mv。'
          ],
          solution: code([
            '    .text',
            '    .globl main',
            'main:',
            '    li a7, 5          # read_int',
            '    ecall',
            '    mv t0, a0',
            '    li a7, 5',
            '    ecall',
            '    mv a1, a0',
            '    mv a0, t0',
            '    li a2, 0          # 第三个数用 0 简化演示',
            '    call max3',
            '    li a7, 1          # print_int',
            '    ecall',
            '    li a7, 10         # exit',
            '    ecall',
            '',
            'max3:',
            '    bge a0, a1, 1f',
            '    mv a0, a1',
            '1:  bge a0, a2, 2f',
            '    mv a0, a2',
            '2:  ret'
          ])
        },
        {
          n: 2,
          title: '递归与栈帧',
          tasks: [
            '写递归 fib(n)：fib(0)=0，fib(1)=1，其余 fib(n)=fib(n-1)+fib(n-2)。',
            '必须保存 ra 与 n：画出每次调用时栈的内容，标出 sp 与 fp 的位置。',
            '在 fib 入口让栈保持 16 字节对齐（RV32 的 ABI 要求），退出前恢复 sp。',
            '测试 fib(0)…fib(10)，与 C 版本对比；再用 gdb 在递归深度 3 时打印栈上的 ra。',
            '思考：把 fib 改成尾递归能否减少栈帧？RISC-V 有没有专门的尾调用指令？'
          ],
          starter: code([
            'fib:',
            '    # if (n < 2) return n;',
            '    # return fib(n-1) + fib(n-2);',
            '    # TODO: 开栈帧，保存 ra 与 n',
            '    # TODO: 两次调用，注意第一次结果要先存起来',
            '    # TODO: 恢复并返回'
          ]),
          hints: [
            '栈帧至少 16 字节：sp -= 16；sw ra, 12(sp)；sw s0, 8(sp)；sw n, 4(sp)。用 s0 保存 n 就不怕调用破坏。',
            '第一次 call fib 的返回值在 a0，要先用 sw a0, 0(sp) 存起来，再准备第二次调用的参数。',
            '恢复顺序与保存相反：先 lw 再 addi sp。忘记恢复 ra 会在 ret 时跳到错误地址，这是最常见的崩溃原因。'
          ],
          solution: code([
            'fib:',
            '    li t0, 2',
            '    blt a0, t0, .Lbase      # n < 2 直接返回 n',
            '    addi sp, sp, -16',
            '    sw ra, 12(sp)',
            '    sw s0, 8(sp)',
            '    sw a0, 4(sp)',
            '    mv s0, a0',
            '    addi a0, s0, -1',
            '    call fib',
            '    sw a0, 0(sp)            # 存 fib(n-1)',
            '    addi a0, s0, -2',
            '    call fib',
            '    lw t0, 0(sp)',
            '    add a0, a0, t0',
            '    lw s0, 8(sp)',
            '    lw ra, 12(sp)',
            '    addi sp, sp, 16',
            '    ret',
            '.Lbase:',
            '    ret'
          ])
        },
        {
          n: 3,
          title: '字符串与数组',
          tasks: [
            '写 strlen：输入 a0 指向以 0 结尾的字符串，返回长度；只用 lbu、beq、addi。',
            '写 reverse：原地反转字符串，用两个指针向中间走；不允许申请新内存。',
            '写 sum_array(int *a, int n)：用循环累加，注意元素是 4 字节，用 slli 计算偏移。',
            '写 main 把三个函数串起来：读一行字符串（ecall 8），反转后打印（ecall 4），再对数组求和。',
            '用 valgrind 式的自查代替工具：确认没有读写缓冲区之外的一个字节。'
          ],
          starter: code([
            'strlen:',
            '    # TODO: t0 = 0',
            'loop:',
            '    # TODO: lbu t1, 0(a0)',
            '    # TODO: 为 0 则结束，否则 a0++、t0++',
            '    ret',
            '',
            'reverse:',
            '    # TODO: i=0, j=len-1，交换直到 i>=j',
            '    ret'
          ]),
          hints: [
            '字符串指针就是字节地址，每次 a0 += 1；数组元素是 int，每次地址 += 4，或把下标左移 2 位。',
            'reverse 可以先用 strlen 求长度，但要注意保存原指针；用 s0 存起点、s1 存终点最清楚。',
            '交换两个字节需要一个临时寄存器：lbu t0,0(s0)；lbu t1,0(s1)；sb t1,0(s0)；sb t0,0(s1)。'
          ],
          solution: code([
            'strlen:',
            '    li t0, 0',
            '.Llen:',
            '    lbu t1, 0(a0)',
            '    beq t1, zero, .Ldone',
            '    addi a0, a0, 1',
            '    addi t0, t0, 1',
            '    j .Llen',
            '.Ldone:',
            '    mv a0, t0',
            '    ret',
            '',
            'reverse:',
            '    mv t0, a0              # 起点',
            '    mv t1, a0',
            '.Lfind_end:',
            '    lbu t2, 0(t1)',
            '    beq t2, zero, .Lrev',
            '    addi t1, t1, 1',
            '    j .Lfind_end',
            '.Lrev:',
            '    addi t1, t1, -1        # 指向最后一个字符',
            '.Lswap:',
            '    bge t0, t1, .Lrdone',
            '    lbu t2, 0(t0)',
            '    lbu t3, 0(t1)',
            '    sb t3, 0(t0)',
            '    sb t2, 0(t1)',
            '    addi t0, t0, 1',
            '    addi t1, t1, -1',
            '    j .Lswap',
            '.Lrdone:',
            '    ret'
          ])
        }
      ]
    },

    /* ================================================================ P2 */
    {
      id: 'P2',
      title: 'Bomb Lab：读懂别人的汇编',
      en: 'BOMB LAB REVERSE ENGINEERING',
      tagline: '六个 phase、没有源码，只有 objdump 与 gdb：把每个字符串从二进制里「问」出来。',
      level: '进阶',
      minutes: 180,
      chapters: ['ch02', 'ch03'],
      goals: [
        '能从 objdump 的反汇编中识别函数边界、参数传递与循环结构。',
        '会用 gdb 的条件断点、x/ 命令与寄存器观察，逐步缩小输入空间。',
        '理解「编译器把 switch 变成跳转表」「递归函数如何用栈」这些模式在机器码里的样子。'
      ],
      intro: 'Bomb Lab 的内核是一个二进制炸弹：每输入错一个 phase 就爆炸。它考的不是汇编语法，而是「读代码」的能力。' +
        '这个项目用自制的四个小 phase 复现同样的训练：字符串比较、循环校验、跳转表、递归。' +
        '关键习惯是：先看函数调用关系，再看比较与跳转，最后才逐条翻译指令。',
      milestones: [
        {
          n: 1,
          title: '工具链与第一个 phase',
          tasks: [
            '用 gcc -Og -S 生成 .s，再用 objdump -d 反汇编；对比两者，指出编译器插入了哪些伪指令。',
            '在 phase_1 下断点，用 x/s 0x... 查看它比较的字符串，写出正确输入。',
            '用 info registers 观察调用 phase_1 前 a0 的值，确认参数就是你的输入缓冲区。',
            '把 phase_1 的汇编逐行翻译回 C，要求语义等价而不是逐字对应。',
            '记录：哪些指令是「框架」（prologue/epilogue），哪些才是「逻辑」。'
          ],
          starter: code([
            'phase_1:',
            '    addi sp, sp, -16',
            '    sw ra, 12(sp)',
            '    sw a0, 8(sp)',
            '    lui a1, 0x00000        # TODO: 补全字符串地址',
            '    addi a1, a1, 0',
            '    lw a0, 8(sp)',
            '    call strcmp',
            '    beq a0, zero, .Lok',
            '    call explode_bomb',
            '.Lok:',
            '    lw ra, 12(sp)',
            '    addi sp, sp, 16',
            '    ret'
          ]),
          hints: [
            'lui + addi 是在拼一个 32 位地址：lui 给高 20 位，addi 给低 12 位（有符号，注意进位）。',
            'gdb 里 x/s 0x400000 直接按字符串打印；x/8x 按十六进制看 8 个字。',
            'strcmp 返回 0 表示相等，所以 beq a0, zero 才是「通过」；别把 bne 写成通过。'
          ],
          solution: code([
            'phase_1:',
            '    addi sp, sp, -16',
            '    sw ra, 12(sp)',
            '    sw a0, 8(sp)',
            '    lui a1, 0x00041',
            '    addi a1, a1, 0x2a0     # 假设字符串在 0x000412a0',
            '    lw a0, 8(sp)',
            '    call strcmp',
            '    beq a0, zero, .Lok',
            '    call explode_bomb',
            '.Lok:',
            '    lw ra, 12(sp)',
            '    addi sp, sp, 16',
            '    ret',
            '',
            '# 等价 C：',
            '# if (strcmp(input, "Bravo seven delta")) explode_bomb();'
          ])
        },
        {
          n: 2,
          title: '循环与跳转表',
          tasks: [
            '读 phase_2：它把输入读进数组，用循环检查前缀和或相邻关系；写出循环不变式。',
            '读 phase_3：认出 switch 被编译成跳转表（.rodata 里的地址数组），列出每个 case 的入口。',
            '用 gdb 在循环体内设条件断点（如 i==3），观察数组元素如何变化。',
            '构造一组满足条件的输入，并用脚本自动生成多组候选，减少手工试错。',
            '总结：编译器在什么条件下把 switch 编译成跳转表而不是比较链？'
          ],
          starter: code([
            'phase_2:',
            '    # for (i = 1; i < 6; i++)',
            '    #     if (a[i] != a[i-1] + i) explode();',
            '    # TODO: 补全循环体',
            '    ret',
            '',
            'phase_3:',
            '    # switch (x) { case 0: ... case 7: ... }',
            '    # TODO: 找到跳转表并写出每个 case 的返回值'
          ]),
          hints: [
            '循环三要素：初始化、条件、步进。先在汇编里标出这三段，再把中间段翻译成 C。',
            '跳转表的典型形态：slli t0, a0, 2；lui t1, %hi(table)；add t1, t1, t0；lw t1, %lo(table)(t1)；jalr zero, 0(t1)。',
            'phase_3 的每个 case 往往只是给一个寄存器赋常数，最后比较这个常数与你输入的第二个数。'
          ],
          solution: code([
            '# phase_2 等价 C',
            '# int a[6]; read_six_numbers(a);',
            '# if (a[0] != 1) explode();',
            '# for (int i = 1; i < 6; i++)',
            '#     if (a[i] != a[i-1] + i) explode();',
            '# 答案：1 2 4 7 11 16',
            '',
            '# phase_3 跳转表结构',
            '# .rodata:',
            '#   .word .Lcase0, .Lcase1, ..., .Lcase7',
            '# 每个 .LcaseN 设置一个结果值，最后与输入比较',
            '# 答案形如：3 42（第一个数选 case，第二个数等于该 case 的常数）'
          ])
        },
        {
          n: 3,
          title: '递归与链表',
          tasks: [
            '读 phase_4：递归计算某个函数值，要求输入 n 使返回值等于目标；写出递归式。',
            '读 phase_5：遍历一个静态链表（节点含 value 与 next），要求节点顺序满足排序关系。',
            '用 gdb 打印链表节点的内存（x/2wx），画出链表结构。',
            '写一个 Python 脚本模拟递归函数，反推所有可行输入。',
            '回答：为什么递归函数的栈帧里通常同时保存 ra 与参数？'
          ],
          starter: code([
            'phase_4:',
            '    # func4(n) = n<=1 ? n : func4(n-1) + func4(n-2)',
            '    # TODO: 反推 n 使 func4(n) == 目标值',
            '    ret',
            '',
            'phase_5:',
            '    # node = head; while (node) { check(node->value); node = node->next; }',
            '    # TODO: 打印 6 个节点并排序'
          ]),
          hints: [
            'phase_4 先在 gdb 里 call func4(0..20)，把返回值列成表，再找目标值对应的 n，比读汇编快得多。',
            '链表节点通常是 8 字节：偏移 0 存 value，偏移 4 存 next 指针。x/12wx 0x... 可以一次看三个节点。',
            '递归展开时，每层都要保存自己的 n（或中间结果），否则回溯时参数已经变了。'
          ],
          solution: code([
            '# phase_4：目标 55，func4 是斐波那契式递归',
            '# func4(0)=0, func4(1)=1, func4(10)=55 -> 答案 10',
            '',
            '# phase_5：链表按 value 升序排列后的节点下标',
            '# 假设节点值：0x0a, 0x02, 0x1e, 0x07, 0x19, 0x0c',
            '# 升序：2, 7, 10, 12, 25, 30',
            '# 对应输入：1 3 0 5 4 2'
          ])
        }
      ]
    },

    /* ================================================================ P3 */
    {
      id: 'P3',
      title: '五级流水线模拟器',
      en: 'PIPELINED RV32 SIMULATOR',
      tagline: '用 500 行 C 把 IF/ID/EX/MEM/WB 跑起来，数清每一条指令停了几拍。',
      level: '挑战',
      minutes: 240,
      chapters: ['ch03', 'ch04'],
      goals: [
        '能把单周期数据通路改造成五级流水，理解流水寄存器到底存了什么。',
        '实现 forwarding 与 load-use 检测，并用周期数验证冒险代价。',
        '会用「指令序列 → 时空图 → 周期数」三件套解释性能差异。'
      ],
      intro: 'Project 3 要求写一个流水线 RISC-V 模拟器：给定机器码，输出每条指令的结果与总周期数。' +
        '这个项目先让你写一个能跑通的功能核心，再把它拆成五级，最后加转发与停顿。' +
        '判断自己是否真的理解，标准只有一个：换一段有 load-use 与分支的程序，你能手算出周期数，且模拟器结果一致。',
      milestones: [
        {
          n: 1,
          title: '功能核心：先跑对，再跑快',
          tasks: [
            '定义 CPU 结构体：32 个寄存器、PC、64 KiB 内存、周期计数。',
            '实现取指、译码、执行、访存、写回五个函数，先按「一条执行完再取下一条」的方式跑。',
            '支持 add/sub/and/or/addi/lw/sw/beq/jal 八条指令，其余指令报 illegal。',
            '写一个汇编测试程序（求和 1..10），确认 a0 最终为 55。',
            '把每条指令的执行次数统计出来，作为后续流水线版本的对照。'
          ],
          starter: code([
            'typedef struct {',
            '    uint32_t x[32];',
            '    uint32_t pc;',
            '    uint8_t  mem[1 << 16];',
            '    uint64_t cycles;',
            '} CPU;',
            '',
            'static void step(CPU *c) {',
            '    uint32_t insn = fetch(c);',
            '    Decoded d = decode(insn);',
            '    uint32_t alu = execute(c, &d);',
            '    uint32_t val = memory(c, &d, alu);',
            '    writeback(c, &d, val);',
            '    c->cycles++;',
            '}'
          ]),
          hints: [
            'x0 永远为 0：写回时 if (rd != 0) 才写；读的时候直接返回 0。',
            'beq 的目标地址是 PC + 立即数（B 型偏移），不是绝对地址；先把 imm 正确符号扩展再相加。',
            '内存按小端存放：mem[addr] 是最低字节，读 32 位要拼四次。'
          ],
          solution: code([
            'static uint32_t fetch(CPU *c) {',
            '    uint32_t v = c->mem[c->pc] | (c->mem[c->pc+1] << 8) |',
            '                 (c->mem[c->pc+2] << 16) | (c->mem[c->pc+3] << 24);',
            '    c->pc += 4;',
            '    return v;',
            '}',
            '',
            'static void writeback(CPU *c, Decoded *d, uint32_t v) {',
            '    if (d->regwrite && d->rd != 0) c->x[d->rd] = v;',
            '}',
            '',
            'static void run(CPU *c) {',
            '    while (c->pc < CODE_END) step(c);',
            '}'
          ])
        },
        {
          n: 2,
          title: '拆成五级：流水寄存器',
          tasks: [
            '定义四个流水寄存器结构：IF_ID、ID_EX、EX_MEM、MEM_WB，字段按阶段需要裁剪。',
            '把 step 改成「所有阶段同时工作」：每个周期先算 next_*，再整体提交。',
            '实现结构冒险处理：统一存储器或分开 IMEM/DMEM（二选一，并说明代价）。',
            '暂时不加转发，用 nop 填充 RAW 依赖，验证程序结果仍正确。',
            '打印时空图：每个周期输出当前处于各阶段的指令 PC。'
          ],
          starter: code([
            'typedef struct { uint32_t pc, insn; } IF_ID_t;',
            'typedef struct { uint32_t pc, rs1v, rs2v, imm; uint8_t rd, rs1, rs2;',
            '                 uint8_t alusrc, regwrite, memread, memwrite, branch; } ID_EX_t;',
            '/* TODO: EX_MEM_t 与 MEM_WB_t */',
            '',
            'static void tick(CPU *c) {',
            '    /* 顺序：WB -> MEM -> EX -> ID -> IF，后写覆盖先写 */',
            '}'
          ]),
          hints: [
            '流水寄存器的本质是「这一拍结束时锁存、下一拍开始时可见」。先在纸上画四个竖条，再决定每个字段属于哪一级。',
            'ID_EX 需要已经读出的寄存器值，而不是寄存器编号——因为下一拍寄存器堆可能被写。',
            '分支在 EX 判定时，IF_ID 与当前取指都要冲刷；先把 flush 写成「把有效位清零」，比清空所有字段简单。'
          ],
          solution: code([
            'typedef struct { uint32_t pc, alu, rs2v, rd; uint8_t regwrite, memread, memwrite; } EX_MEM_t;',
            'typedef struct { uint32_t val, rd; uint8_t regwrite; } MEM_WB_t;',
            '',
            'static void tick(CPU *c) {',
            '    /* WB */',
            '    if (c->mem_wb.regwrite && c->mem_wb.rd)',
            '        c->x[c->mem_wb.rd] = c->mem_wb.val;',
            '    /* MEM */',
            '    c->mem_wb.val = c->ex_mem.memread ? load32(c, c->ex_mem.alu) : c->ex_mem.alu;',
            '    c->mem_wb.rd = c->ex_mem.rd;',
            '    c->mem_wb.regwrite = c->ex_mem.regwrite;',
            '    /* EX / ID / IF 省略：按同样方式把 next 值搬进寄存器 */',
            '    c->cycles++;',
            '}'
          ])
        },
        {
          n: 3,
          title: '转发、停顿与分支',
          tasks: [
            '实现 EX/MEM→EX 与 MEM/WB→EX 两条转发路径，优先级：EX/MEM 更新。',
            '实现 load-use 检测：ID/EX.MemRead 且 rd 等于当前 IF/ID 的 rs1/rs2 时停一拍。',
            '实现分支冲刷：分支在 EX 判定，失败时清空 IF/ID 与 ID/EX 的有效位。',
            '对「lw; add; add; beq」序列手算周期数，与模拟器输出对比。',
            '加一个 -v 选项，打印每拍的转发选择与停顿原因。'
          ],
          starter: code([
            '/* 转发选择：0=寄存器堆, 1=EX/MEM, 2=MEM/WB */',
            'static int forward_a(CPU *c) {',
            '    if (c->ex_mem.regwrite && c->ex_mem.rd == c->id_ex.rs1) return 1;',
            '    /* TODO: MEM/WB 路径与 rs2 */',
            '    return 0;',
            '}',
            '',
            'static int load_use_hazard(CPU *c) {',
            '    /* TODO: ID/EX.MemRead && (rd == rs1 || rd == rs2) */',
            '    return 0;',
            '}'
          ]),
          hints: [
            '转发比较的是「目的寄存器编号」，且 regwrite 必须为 1、rd 不能为 0。',
            'load-use 只需停一拍：下一拍 load 进入 MEM，数据可从 MEM/WB 转发；这也是为什么编译器喜欢把无关指令排在 load 后。',
            '分支在 EX 判定时，已经取了两条后续指令（IF、ID），所以冲刷 2 条；若在 MEM 判定则冲 3 条。'
          ],
          solution: code([
            'static int forward_a(CPU *c) {',
            '    if (c->ex_mem.regwrite && c->ex_mem.rd != 0 && c->ex_mem.rd == c->id_ex.rs1) return 1;',
            '    if (c->mem_wb.regwrite && c->mem_wb.rd != 0 && c->mem_wb.rd == c->id_ex.rs1 &&',
            '        !(c->ex_mem.regwrite && c->ex_mem.rd == c->id_ex.rs1)) return 2;',
            '    return 0;',
            '}',
            '',
            'static int load_use_hazard(CPU *c) {',
            '    return c->id_ex.memread &&',
            '           (c->id_ex.rd == c->if_id.rs1 || c->id_ex.rd == c->if_id.rs2);',
            '}',
            '',
            '/* 结果：lw; add; add; beq 共 8 拍（含 1 个 load-use 气泡） */'
          ])
        }
      ]
    },

    /* ================================================================ P4 */
    {
      id: 'P4',
      title: 'Cache 模拟器与矩阵分块',
      en: 'CACHE SIMULATOR & BLOCKING',
      tagline: '读一条访存 trace，算命中率与 AMAT；再用同一套模型把矩阵乘法加速 3 倍。',
      level: '挑战',
      minutes: 240,
      chapters: ['ch05', 'ch07'],
      goals: [
        '能实现直接映射、组相联与全相联 Cache，并正确拆分 tag/index/offset。',
        '理解 LRU 与写策略对命中率的影响，会用 AMAT 把命中率翻译成时间。',
        '能用分块（blocking）把一个 cache 不友好的循环改成 cache 友好，并用实测验证。'
      ],
      intro: 'Project 4 要求写一个数据 Cache 模拟器：输入是访存 trace（地址 + 读/写），输出命中、缺失与替换统计。' +
        '这个项目分两半：前半写模拟器，后半拿它指导优化。最有说服力的结果是：同一个矩阵乘法，分块前后' +
        '模拟器预测的缺失率下降，真实运行时间也同比例下降。',
      milestones: [
        {
          n: 1,
          title: 'trace 解析与直接映射',
          tasks: [
            '定义 trace 格式并写解析器：每行「R/W 0x地址」，跳过注释与空行。',
            '实现直接映射 Cache：参数为容量与块大小，计算行数、index 位、offset 位、tag 位。',
            '每次访问先查有效位与 tag，命中则更新统计；缺失则装入并可能替换。',
            '对 16 KiB / 32 B 的配置，用 trace 验证：容量、组数、tag 位与手算一致。',
            '输出 hits、misses、hit rate，并与「假设全命中」的时间对比算 AMAT。'
          ],
          starter: code([
            'typedef struct {',
            '    int      valid;',
            '    uint32_t tag;',
            '    uint32_t lru;',
            '} Line;',
            '',
            'typedef struct {',
            '    Line    *lines;',
            '    uint32_t  n_lines, n_sets, ways;',
            '    uint32_t  offset_bits, index_bits;',
            '    uint64_t  hits, misses;',
            '} Cache;',
            '',
            'static int access_cache(Cache *c, uint32_t addr, int is_write) {',
            '    /* TODO: 拆分 tag/index/offset，查表 */',
            '    return 0;',
            '}'
          ]),
          hints: [
            'offset_bits = log2(block_size)；index_bits = log2(n_sets)；tag = addr >> (offset_bits + index_bits)。',
            '直接映射的 index 就是 (addr / block_size) % n_lines，可以用位运算代替除法。',
            '有效位为 0 时一律算 miss（冷启动），装入后置 1；不要拿 tag=0 当「空」。'
          ],
          solution: code([
            'static int access_cache(Cache *c, uint32_t addr, int is_write) {',
            '    uint32_t offset = addr & ((1u << c->offset_bits) - 1);',
            '    uint32_t index  = (addr >> c->offset_bits) & (c->n_sets - 1);',
            '    uint32_t tag    = addr >> (c->offset_bits + c->index_bits);',
            '    Line *line = &c->lines[index];',
            '    if (line->valid && line->tag == tag) {',
            '        c->hits++;',
            '        return 1;',
            '    }',
            '    c->misses++;',
            '    line->valid = 1;',
            '    line->tag = tag;',
            '    return 0;',
            '}',
            '',
            '/* 16 KiB / 32 B -> 512 行, index 9 位, offset 5 位, tag 18 位 */'
          ])
        },
        {
          n: 2,
          title: '组相联、LRU 与写策略',
          tasks: [
            '把 Cache 改成 K 路组相联：每组 K 行，index 选组，组内按 tag 查找。',
            '实现 LRU：每次命中或替换都更新计数器；替换时选最久未用的那一行。',
            '实现写直达与写回两种策略，写回需要 dirty 位；统计写回造成的额外访存。',
            '对比 1/2/4/8 路在同一个 trace 上的缺失率，画出曲线并解释趋势。',
            '用 AMAT 公式把三种配置换算成时间，指出「缺失率最低」是否等于「最快」。'
          ],
          starter: code([
            'static Line *find_victim(Cache *c, uint32_t set) {',
            '    Line *base = &c->lines[set * c->ways];',
            '    /* TODO: 先找 invalid，否则找 LRU 最大者 */',
            '    return base;',
            '}',
            '',
            'static void touch(Cache *c, uint32_t set, int way) {',
            '    /* TODO: 更新该组的 LRU 时间戳 */',
            '}'
          ]),
          hints: [
            '组相联的 index 位数 = log2(n_sets)，不是 log2(n_lines)；这是最常见的错误。',
            'LRU 可以用一个全局递增计数器，每次访问把当前值写进该行；替换时选最小值。',
            '写回策略下，被替换且 dirty=1 的行要先写回下一级，这笔开销要计入 miss penalty。'
          ],
          solution: code([
            'static Line *find_victim(Cache *c, uint32_t set) {',
            '    Line *base = &c->lines[set * c->ways];',
            '    for (uint32_t i = 0; i < c->ways; i++)',
            '        if (!base[i].valid) return &base[i];',
            '    Line *victim = &base[0];',
            '    for (uint32_t i = 1; i < c->ways; i++)',
            '        if (base[i].lru < victim->lru) victim = &base[i];',
            '    return victim;',
            '}',
            '',
            'static void touch(Cache *c, uint32_t set, int way) {',
            '    c->lines[set * c->ways + way].lru = ++c->clock;',
            '}'
          ])
        },
        {
          n: 3,
          title: '用模拟器指导矩阵分块',
          tasks: [
            '写朴素矩阵乘法 C = A×B（N=512，double），用 perf stat 记录 cache-misses。',
            '给模拟器加一个「生成矩阵乘法 trace」的模式，不必真跑程序也能预测缺失率。',
            '实现分块版本：按 B×B 的块遍历，块大小从 8 试到 128，记录缺失率与运行时间。',
            '解释为什么分块有效：把「跨行跳跃」变成「块内连续」，提高空间与时间局部性。',
            '写一页报告：配置、缺失率、AMAT、实测时间，四条曲线放在一张图里。'
          ],
          starter: code([
            '#define N 512',
            'void matmul(double A[N][N], double B[N][N], double C[N][N]) {',
            '    for (int i = 0; i < N; i++)',
            '        for (int j = 0; j < N; j++) {',
            '            double s = 0;',
            '            for (int k = 0; k < N; k++)',
            '                s += A[i][k] * B[k][j];   /* B 的访问步长 N */',
            '            C[i][j] = s;',
            '        }',
            '}'
          ]),
          hints: [
            '朴素版本对 B 是按列访问，步长 N×8 字节，几乎每次都是新行，空间局部性极差。',
            '分块后内层只碰 B×B 的子矩阵，工作集约为 3×B²×8 字节；让这个值小于 L1 或 L2 容量。',
            '交换循环顺序（i-k-j）也能改善，但会改变浮点累加顺序；分块不改变顺序，数值结果完全一致。'
          ],
          solution: code([
            '#define B 32',
            'void matmul_blocked(double A[N][N], double B[N][N], double C[N][N]) {',
            '    for (int ii = 0; ii < N; ii += B)',
            '      for (int jj = 0; jj < N; jj += B)',
            '        for (int kk = 0; kk < N; kk += B)',
            '          for (int i = ii; i < ii + B; i++)',
            '            for (int j = jj; j < jj + B; j++) {',
            '              double s = C[i][j];',
            '              for (int k = kk; k < kk + B; k++)',
            '                s += A[i][k] * B[k][j];',
            '              C[i][j] = s;',
            '            }',
            '}',
            '',
            '/* 典型结果（N=512, B=32）：',
            ' * 朴素：缺失率 ~12%，时间 1.00x',
            ' * 分块：缺失率 ~2%，时间 0.35x（约 2.8 倍加速） */'
          ])
        }
      ]
    }
  ]);
})();
