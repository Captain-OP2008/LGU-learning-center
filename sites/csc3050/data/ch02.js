/* =====================================================================
 * ch02.js · 第 2 章「RISC-V 指令系统与调用约定」
 * 职责：六种指令格式、算术/访存/分支、函数调用的六步、栈帧与 ABI。
 * 依据：Chapter 2.2 RISC-V ISA、Calling Conventions 讲义
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch02',
  num: '02',
  title: 'RISC-V 指令系统与调用约定',
  en: 'RISC-V ISA & CALLING CONVENTION',
  goals: [
    '说出 RV32I 的 32 个通用寄存器与 x0 的特殊作用',
    '在 R/I/S/B/U/J 六种格式之间读写字段，并手工编码一条 addi 或 lw',
    '用 load/store、分支与跳转把一段 C 代码翻译成合法的 RISC-V 汇编',
    '按六步完成一次函数调用，画出含 ra、fp、s 寄存器的栈帧',
    '依据 ABI 说明 caller-saved 与 callee-saved 的责任划分，并写出符合约定的 prologue/epilogue'
  ],
  kp: [
    { id: 'ch02-1', title: '指令集与 RISC 的设计哲学' },
    { id: 'ch02-2', title: '六种指令格式与字段' },
    { id: 'ch02-3', title: '算术、逻辑与立即数指令' },
    { id: 'ch02-4', title: 'load/store 与寻址方式' },
    { id: 'ch02-5', title: '分支、跳转与循环' },
    { id: 'ch02-6', title: '函数调用的六个步骤与栈帧' },
    { id: 'ch02-7', title: 'ABI：caller-saved 与 callee-saved' },
    { id: 'ch02-8', title: '伪指令、汇编器与工具链' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么必须会读汇编', html: '第 06 章的 Bomb Lab 会给你一个二进制，没有源码，只有 <code>objdump -d</code> 的输出；第 03 章的数据通路要把每条指令拆成控制信号；第 04 章的冒险要判断「这条 <code>lw</code> 后面紧跟的那条 <code>add</code> 用到的是不是同一个寄存器」。<b>汇编不是历史遗迹，而是你与机器之间唯一没有歧义的语言。</b>' },

    { t: 'p', lead: true, html: 'C 编译器把 <code>a = b + c</code> 变成几条指令，把函数调用变成一套约定：参数放哪、返回值放哪、谁能改哪个寄存器、栈指针怎么动。这一章先讲指令长什么样（格式与语义），再讲函数之间如何「交接」（调用约定与 ABI）。掌握这两件事，你就能在没有任何源码的情况下，从机器码反推出程序在做什么。' },

    { t: 'h', lvl: 2, text: '一、指令集与 RISC 的设计哲学', id: 'ch02-1' },

    { t: 'p', html: '指令集架构（ISA）是软硬件之间的契约：它规定有哪些指令、什么格式、寄存器可见性如何，但<b>不规定</b>内部怎么实现。RISC 的核心信条是「简单、规整、让编译器干活」：指令长度固定、格式少、只有 load/store 能访存、运算都在寄存器之间进行。CISC（如 x86）则允许「内存操作数」「变长指令」「一条指令做很多事」。' },

    { t: 'table', head: ['维度', 'RISC（RISC-V）', 'CISC（x86）'], rows: [
      ['指令长度', '固定 4 字节（压缩扩展可 2 字节）', '1–15 字节变长'],
      ['运算操作数', '只在寄存器之间', '可与内存直接运算'],
      ['指令数量', '基础 RV32I 约 40 条', '数百到上千条'],
      ['寻址方式', '少而规整（基址 + 立即数）', '多而复杂'],
      ['译码难度', '低，字段位置固定', '高，需先解析前缀与长度']
    ], caption: 'RISC 把复杂度从硬件挪到编译器；CISC 把复杂度留给硬件换取代码密度' },

    { t: 'p', html: 'RISC-V 是<b>模块化</b>的：基础整数指令集 <b>RV32I</b> 是必选底座，其余用字母扩展——<b>M</b> 乘除、<b>A</b> 原子、<b>F/D</b> 单/双精度浮点、<b>C</b> 压缩指令、<b>V</b> 向量。课程实验以 RV32I 为主，偶尔用 M 扩展的 <code>mul</code>。' },

    { t: 'p', html: 'RV32I 有 <b>32 个通用寄存器 x0–x31</b>，每个 32 位。其中 <b>x0 恒为 0</b>：读它永远得 0，写它被丢弃。这不是浪费，而是让「把 0 当操作数」「丢弃结果」变得极其自然，例如 <code>addi x0, x0, 0</code> 就是空操作（nop），<code>jalr x0, 0(ra)</code> 就是返回（ret）。寄存器没有类型，整数、地址、指针都放在同一组寄存器里。' },

    { t: 'code', lang: 'c', title: '从 C 到汇编：先看编译器生成了什么', code: [
      '/* demo.c */',
      'int sum(const int *a, int n) {',
      '    int s = 0;',
      '    for (int i = 0; i < n; i++)',
      '        s += a[i];',
      '    return s;',
      '}',
      '',
      '/* 编译并反汇编：',
      ' *   riscv64-unknown-elf-gcc -O1 -S demo.c -o demo.s',
      ' *   riscv64-unknown-elf-gcc -O1 -c demo.c -o demo.o',
      ' *   riscv64-unknown-elf-objdump -d demo.o',
      ' * 你会看到类似下面的循环（-O1 可能已向量化/展开，先看 -O0）：',
      ' *   .L3:',
      ' *     slli t1, t0, 2',
      ' *     add  t1, a0, t1',
      ' *     lw   t2, 0(t1)',
      ' *     add  a5, a5, t2',
      ' *     addi t0, t0, 1',
      ' *     blt  t0, a1, .L3',
      ' */'
    ] },

    { t: 'callout', kind: 'tip', title: '读汇编的顺序', html: '先找<b>函数边界</b>（<code>ret</code>、<code>jr ra</code>），再找<b>循环</b>（向后跳的分支），最后看<b>访存</b>（lw/sw 的基址与偏移）与<b>调用</b>（jal/jalr 的目标）。不要逐行翻译，先建立控制流骨架，再填数据流。' },

    { t: 'h', lvl: 2, text: '二、六种指令格式与字段', id: 'ch02-2' },

    { t: 'p', html: 'RV32I 的每条指令都是 32 位，字段位置由格式决定。opcode 固定在低 7 位，rd 固定在 11:7，funct3 固定在 14:12，rs1 固定在 19:15，rs2 固定在 24:20——<b>固定位置让译码器可以并行提取所有字段</b>，这是 RISC 的关键设计。' },

    { t: 'table', head: ['格式', '用途', '字段布局（高位→低位）', '立即数范围'], rows: [
      ['R', '寄存器间运算', 'funct7 | rs2 | rs1 | funct3 | rd | opcode', '无'],
      ['I', '立即数运算、load、jalr', 'imm[11:0] | rs1 | funct3 | rd | opcode', '−2048…2047'],
      ['S', 'store', 'imm[11:5] | rs2 | rs1 | funct3 | imm[4:0] | opcode', '−2048…2047'],
      ['B', '条件分支', 'imm[12|10:5] | rs2 | rs1 | funct3 | imm[4:1|11] | opcode', '±4 KiB'],
      ['U', 'lui、auipc', 'imm[31:12] | rd | opcode', '高 20 位'],
      ['J', 'jal', 'imm[20|10:1|11|19:12] | rd | opcode', '±1 MiB']
    ], caption: 'B 与 J 的立即数被打散，是为了和 S/R 格式共用布线；这是「规整」与「编码密度」的折中' },

    { t: 'p', html: '注意 B 与 J 的立即数<b>没有最低位</b>：指令地址必须是 2 字节对齐（开启 C 扩展后仍是 2 字节粒度），所以偏移的最低位恒为 0，省下来的一位用来多表示一倍范围。另外，B 型与 J 型的偏移都是<b>相对当前 PC</b> 的，不是绝对地址——这让代码可以被加载到任意地址（位置无关）。' },

    { t: 'table', head: ['汇编', '字段拆解', '机器码'], rows: [
      ['addi x5, x0, 10', 'imm=10, rs1=0, f3=0, rd=5, op=0x13', '0x00A00293'],
      ['lw x6, 4(x5)', 'imm=4, rs1=5, f3=2, rd=6, op=0x03', '0x0042A303'],
      ['sw x6, 8(x5)', 'imm=8, rs2=6, rs1=5, f3=2, op=0x23', '0x0062A423'],
      ['beq x5, x6, +16', 'imm=16, rs2=6, rs1=5, f3=0, op=0x63', '0x00628863'],
      ['lui x5, 0x12345', 'imm[31:12]=0x12345, rd=5, op=0x37', '0x123452B7']
    ], caption: '手算时先写二进制字段再拼十六进制；考试常考 addi/lw/sw/beq 这四种' },

    { t: 'p', html: '以 <code>addi x5, x0, 10</code> 为例：opcode 是 <code>0010011</code>（0x13），rd=5 放在 11:7，funct3=000，rs1=0，imm=10 放在 31:20。拼起来 <code>000000001010 00000 000 00101 0010011</code>，即 <code>0x00A00293</code>。反过来，看到 <code>0x0042A303</code>，先取低 7 位得 0x03，查出是 load，再拆 funct3=2（lw）、rd=6、rs1=5、imm=4，还原成 <code>lw x6, 4(x5)</code>。' },

    { t: 'h', lvl: 2, text: '三、算术、逻辑与立即数指令', id: 'ch02-3' },

    { t: 'p', html: 'R 型运算包括 <code>add/sub</code>、<code>and/or/xor</code>、<code>sll/srl/sra</code>、<code>slt/sltu</code>。I 型对应立即数版本，但<b>没有 subi</b>——减去一个常数就是加负数，例如 <code>addi x5, x5, -1</code>。立即数只有 12 位且<b>符号扩展</b>，所以能表示 −2048…2047；更大的常数要先 <code>lui</code> 再 <code>addi</code>。' },

    { t: 'table', head: ['类别', '指令', '语义', '备注'], rows: [
      ['算术', 'add / sub', 'rd = rs1 ± rs2', '溢出静默回绕'],
      ['逻辑', 'and / or / xor', '按位运算', '掩码、置位、翻转'],
      ['移位', 'sll / srl / sra', 'rd = rs1 << / >> rs2[4:0]', '只取低 5 位，移位量 0–31'],
      ['比较', 'slt / sltu', 'rd = (rs1 < rs2) ? 1 : 0', '有符号 / 无符号'],
      ['立即数', 'addi / andi / ori / xori', 'rd = rs1 op imm', 'imm 符号扩展'],
      ['立即数移位', 'slli / srli / srai', '移位量在 imm[4:0]', '高位是 funct 编码'],
      ['上位立即数', 'lui / auipc', 'rd = imm<<12 / PC+imm<<12', '构造 32 位常数与地址']
    ], caption: 'RISC-V 没有取反指令，not 是 xori rd, rs, -1 的伪指令' },

    { t: 'p', html: '<code>lui</code> 把 20 位立即数放到高 20 位、低 12 位清零；<code>auipc</code> 则加上当前 PC。两者配合 <code>addi</code> 可以构造任意 32 位常数：<code>lui t0, 0x12345</code> 得 <code>0x12345000</code>，再 <code>addi t0, t0, 0x678</code> 得 <code>0x12345678</code>。注意 <code>addi</code> 的立即数会符号扩展：如果低 12 位 ≥ 0x800，<code>lui</code> 的值要加 1 补偿，汇编器用 <code>%hi/%lo</code> 自动处理。' },

    { t: 'p', html: '伪指令让汇编更好写：<code>li rd, imm</code> 展开成一条或两条真指令；<code>mv rd, rs</code> 是 <code>addi rd, rs, 0</code>；<code>neg rd, rs</code> 是 <code>sub rd, x0, rs</code>；<code>not rd, rs</code> 是 <code>xori rd, rs, -1</code>；<code>nop</code> 是 <code>addi x0, x0, 0</code>。伪指令不会被硬件执行，汇编器在生成机器码前就替换掉了。' },

    { t: 'code', lang: 'asm', title: '一段完整的算术与逻辑汇编', code: [
      '# 计算 f = (a + b) & ~(c << 2)，假设 a=x10, b=x11, c=x12',
      'add  x5, x10, x11     # x5 = a + b',
      'slli x6, x12, 2       # x6 = c << 2',
      'xori x6, x6, -1       # x6 = ~(c << 2)',
      'and  x5, x5, x6       # x5 = (a+b) & ~(c<<2)',
      '',
      '# 用 lui + addi 构造常数 0x12345678',
      'lui   x7, 0x12345',
      'addi  x7, x7, 0x678',
      '',
      '# 比较并取布尔值：x8 = (a < b)',
      'slt   x8, x10, x11'
    ] },

    { t: 'h', lvl: 2, text: '四、load/store 与寻址方式', id: 'ch02-4' },

    { t: 'p', html: 'RISC-V 只有 load/store 能访问内存，地址一律是 <b>rs1 + 符号扩展的 imm</b>。load 有 <code>lb/lbu/lh/lhu/lw</code>，store 有 <code>sb/sh/sw</code>。宽度小于 32 位时，load 要决定扩展方式：<code>lb</code> 符号扩展、<code>lbu</code> 零扩展，这是第 01 章「扩展」的直接应用。' },

    { t: 'table', head: ['指令', '宽度', '扩展/截断', '典型用途'], rows: [
      ['lb', '1 字节', '符号扩展到 32 位', '有符号 char、int8_t'],
      ['lbu', '1 字节', '零扩展到 32 位', 'unsigned char、UTF-8 字节流'],
      ['lh', '2 字节', '符号扩展到 32 位', 'short、int16_t'],
      ['lhu', '2 字节', '零扩展到 32 位', 'unsigned short'],
      ['lw', '4 字节', '整字', 'int、指针、结构体字段'],
      ['sb / sh / sw', '1 / 2 / 4 字节', '只写低若干字节', '写字符、半字、字']
    ], caption: 'load 的扩展由指令决定，store 只截断；写回时不做扩展' },

    { t: 'p', html: '访存必须<b>自然对齐</b>：<code>lw</code> 的地址要是 4 的倍数，<code>lh</code> 要是 2 的倍数。不对齐的访问在 RISC-V 上可能触发异常（取决于实现），而 x86 允许但会变慢。数组访问通常写成 <code>slli t1, i, 2</code> 再 <code>add t1, base, t1</code>，因为元素大小是 4 字节——这就是第 01 章「左移等于乘 4」的用途。' },

    { t: 'p', html: '一个重要限制：<b>没有内存到内存的指令</b>。C 里的 <code>*p += 1</code> 至少需要三条指令：<code>lw t0, 0(a0)</code>、<code>addi t0, t0, 1</code>、<code>sw t0, 0(a0)</code>。这也是 RISC 与 CISC 的直观差别：x86 的 <code>incl (%rax)</code> 一条就够。' },

    { t: 'code', lang: 'asm', title: '数组求和：load/store 与循环', code: [
      '# int sum(const int *a, int n)',
      '# a0 = a, a1 = n, 返回 a0',
      'sum:',
      '    li   t0, 0            # i = 0',
      '    li   t1, 0            # s = 0',
      'loop:',
      '    bge  t0, a1, done     # if (i >= n) break',
      '    slli t2, t0, 2        # t2 = i * 4',
      '    add  t2, a0, t2       # t2 = &a[i]',
      '    lw   t3, 0(t2)        # t3 = a[i]',
      '    add  t1, t1, t3       # s += a[i]',
      '    addi t0, t0, 1        # i++',
      '    j    loop',
      'done:',
      '    mv   a0, t1           # 返回值放 a0',
      '    ret'
    ] },

    { t: 'h', lvl: 2, text: '五、分支、跳转与循环', id: 'ch02-5' },

    { t: 'p', html: '条件分支有六条：<code>beq/bne</code> 判相等，<code>blt/bge</code> 是有符号比较，<code>bltu/bgeu</code> 是无符号比较。它们都是 <b>B 型</b>，偏移相对 PC，范围 ±4 KiB。没有「大于」指令：<code>a &gt; b</code> 写成 <code>blt b, a, label</code>，交换操作数即可。' },

    { t: 'p', html: '无条件跳转有两条：<code>jal rd, offset</code> 把返回地址（PC+4）写入 rd 并跳转，范围 ±1 MiB；<code>jalr rd, imm(rs1)</code> 跳到 <code>rs1+imm</code>，最低位清零。伪指令 <code>j label</code> 是 <code>jal x0, label</code>，<code>jr rs</code> 是 <code>jalr x0, 0(rs)</code>，<code>ret</code> 是 <code>jalr x0, 0(ra)</code>，<code>call func</code> 是 <code>auipc ra, ...; jalr ra, ...(ra)</code>。' },

    { t: 'table', head: ['C 写法', 'RISC-V 写法', '说明'], rows: [
      ['if (a == b) goto L', 'beq a, b, L', '相等跳转'],
      ['if (a != b) goto L', 'bne a, b, L', '不等跳转'],
      ['if (a < b) goto L', 'blt a, b, L', '有符号小于'],
      ['if (a > b) goto L', 'blt b, a, L', '交换操作数'],
      ['if (a <= b) goto L', 'bge b, a, L', '大于等于的反向'],
      ['if (u < v) goto L', 'bltu u, v, L', '无符号比较'],
      ['goto L', 'jal x0, L / j L', '丢弃返回地址'],
      ['return', 'jalr x0, 0(ra) / ret', '跳回 ra']
    ], caption: '编译器常把 if 反过来生成「条件不成立就跳过」；读汇编时注意分支方向' },

    { t: 'code', lang: 'asm', title: 'if/else 与 while 的两种控制流', code: [
      '# if (a > b) x = a - b; else x = b - a;  (a=x10, b=x11, x=x12)',
      '    blt  x11, x10, then      # b < a 即 a > b',
      '    sub  x12, x11, x10       # else: b - a',
      '    j    end',
      'then:',
      '    sub  x12, x10, x11       # a - b',
      'end:',
      '',
      '# while (i < n) { s += a[i]; i++; }  (i=t0, n=a1, a=a0, s=t1)',
      'loop:',
      '    bge  t0, a1, done',
      '    slli t2, t0, 2',
      '    add  t2, a0, t2',
      '    lw   t3, 0(t2)',
      '    add  t1, t1, t3',
      '    addi t0, t0, 1',
      '    j    loop',
      'done:'
    ] },

    { t: 'p', html: '分支范围不够时，汇编器会插入「跳板」：把远分支改成「相反条件跳过 + <code>jal</code> 跳到远处」。这也是为什么手写大型函数时不必担心 ±4 KiB，但要知道链接器可能做这种 relaxation。第 06 章讲链接时会再看到：<b>分支与跳转的重定位都发生在链接阶段</b>。' },

    { t: 'h', lvl: 2, text: '六、函数调用的六个步骤与栈帧', id: 'ch02-6' },

    { t: 'p', html: '一次函数调用在汇编层面要完成六件事：<b>①</b> 把参数放进 <code>a0–a7</code>；<b>②</b> 把返回地址保存好（<code>jal</code> 会覆盖 <code>ra</code>）；<b>③</b> 跳转到函数入口；<b>④</b> 被调函数建立栈帧、保存它要用的 callee-saved 寄存器；<b>⑤</b> 函数体执行，返回值放 <code>a0/a1</code>；<b>⑥</b> 恢复现场、<code>ret</code> 返回，调用者再清理参数区。' },

    { t: 'p', html: '栈从高地址向低地址增长，<code>sp</code> 指向栈顶（当前帧的最低地址）。按照 RISC-V ABI，<b>sp 在每次函数调用边界必须 16 字节对齐</b>。一个典型的栈帧从高到低是：调用者传入的溢出参数、保存的 <code>ra</code>、保存的 <code>s0/fp</code>、保存的其他 <code>s</code> 寄存器、局部变量、传给下一个函数的溢出参数。' },

    { t: 'table', head: ['地址方向', '内容', '谁来分配/释放'], rows: [
      ['高地址', '调用者的栈帧', '调用者'],
      ['↓', '传入的第 9 个及以后的参数', '调用者（outgoing args）'],
      ['↓', '保存的 ra', '被调者（若它还要调用别人）'],
      ['↓', '保存的 s0/fp 与其它 s 寄存器', '被调者（若使用）'],
      ['↓', '局部变量、临时溢出', '被调者'],
      ['低地址', 'sp → 当前栈顶', '被调者移动 sp']
    ], caption: '帧指针 fp（即 s0）可选；开启帧指针时它指向当前帧的高地址端，便于调试与回溯' },

    { t: 'p', html: '一个函数如果<b>不再调用别人</b>（叶子函数），且寄存器够用，可以完全不开栈帧——这是编译器常见的优化。反过来，只要函数里出现 <code>call</code>，它就必须保存 <code>ra</code>，因为 <code>jal</code> 会把返回地址覆盖掉；如果它还用了 <code>s0–s11</code>，也必须先保存再恢复，因为这些寄存器由被调者负责。' },

    { t: 'code', lang: 'asm', title: '非叶子函数的 prologue / epilogue', code: [
      '# int caller(int x) { return callee(x) + 1; }',
      'caller:',
      '    addi sp, sp, -16      # 分配 16 字节，保持对齐',
      '    sw   ra, 12(sp)       # 保存返回地址',
      '    sw   s0, 8(sp)        # 保存要用的 callee-saved',
      '    mv   s0, a0           # 保存 x（跨调用存活）',
      '    call callee           # a0 = callee(x)',
      '    addi a0, a0, 1',
      '    lw   s0, 8(sp)',
      '    lw   ra, 12(sp)',
      '    addi sp, sp, 16',
      '    ret'
    ] },

    { t: 'p', html: '注意 <code>call</code> 是伪指令，展开成 <code>auipc ra, %pcrel_hi(callee)</code> 加 <code>jalr ra, %pcrel_lo(...)(ra)</code>。因为偏移可能超过 ±1 MiB，不能只用 <code>jal</code>。这也是位置无关代码（PIC）的基础：用 PC 相对寻址，加载到哪都能跑。' },

    { t: 'h', lvl: 2, text: '七、ABI：caller-saved 与 callee-saved', id: 'ch02-7' },

    { t: 'p', html: 'ABI 把 32 个寄存器分成角色：<code>a0–a7</code> 传参、<code>a0–a1</code> 返回值；<code>ra</code> 返回地址；<code>sp</code> 栈指针；<code>s0–s11</code> 是 callee-saved；<code>t0–t6</code> 是 caller-saved。所谓「谁保存」，本质是<b>责任划分</b>：调用者如果需要某个值跨调用存活，而它放在 caller-saved 寄存器里，就必须自己先存到栈上；被调者如果用了 callee-saved 寄存器，就必须先保存、返回前恢复。' },

    { t: 'table', head: ['寄存器', 'ABI 名', '用途', '跨调用是否保留'], rows: [
      ['x0', 'zero', '常量 0', '—'],
      ['x1', 'ra', '返回地址', '否（caller-saved）'],
      ['x2', 'sp', '栈指针', '是（由约定维持）'],
      ['x8', 's0/fp', '保存寄存器 / 帧指针', '是（callee-saved）'],
      ['x10–x17', 'a0–a7', '参数、返回值', '否'],
      ['x5–x7, x28–x31', 't0–t6', '临时寄存器', '否'],
      ['x9, x18–x27', 's1–s11', '保存寄存器', '是'],
      ['x3', 'gp', '全局指针', '是（由运行时维持）'],
      ['x4', 'tp', '线程指针', '是']
    ], caption: '考试常问：调用者想保留 t0 怎么办？答：调用前自己 sw 到栈上，返回后 lw 恢复' },

    { t: 'compare', left: { title: 'Caller-saved（调用者负责）', html: '<code>ra、t0–t6、a0–a7</code>。被调者可以随意改写；调用者若需要这些值跨调用存活，必须自己保存。' }, right: { title: 'Callee-saved（被调者负责）', html: '<code>sp、s0–s11、gp、tp</code>。被调者若使用，必须在入口保存、出口恢复，保证调用者看到的值不变。' } },

    { t: 'p', html: '为什么不全用 callee-saved？因为叶子函数很多，若每个函数都保存一堆寄存器，代价太大。把「临时值」交给 caller-saved，把「长期变量」交给 callee-saved，是在<b>调用频率</b>与<b>保存成本</b>之间的折中。这也是编译器分配寄存器时的核心策略：活跃期跨越函数调用的变量优先放 s 寄存器。' },

    { t: 'code', lang: 'asm', title: '递归 fib：完整遵守调用约定', code: [
      '# int fib(int n)',
      'fib:',
      '    li   t0, 2',
      '    bge  a0, t0, .Lrec    # if (n >= 2) 递归',
      '    ret                   # n = 0/1 直接返回',
      '.Lrec:',
      '    addi sp, sp, -16',
      '    sw   ra, 12(sp)',
      '    sw   s0, 8(sp)',
      '    sw   s1, 4(sp)',
      '    mv   s0, a0           # 保存 n',
      '    addi a0, s0, -1',
      '    call fib',
      '    mv   s1, a0           # 保存 fib(n-1)',
      '    addi a0, s0, -2',
      '    call fib',
      '    add  a0, a0, s1       # fib(n-2) + fib(n-1)',
      '    lw   s1, 4(sp)',
      '    lw   s0, 8(sp)',
      '    lw   ra, 12(sp)',
      '    addi sp, sp, 16',
      '    ret'
    ] },

    { t: 'h', lvl: 2, text: '八、伪指令、汇编器与工具链', id: 'ch02-8' },

    { t: 'p', html: '汇编文件里除了指令，还有<b>伪指令</b>（li、mv、call、ret）与<b>汇编器指示</b>（.text、.data、.globl、.align、.word、.asciz）。汇编器负责把标签解析成偏移、把伪指令展开、把立即数拆成字段，最终产出目标文件 <code>.o</code>；链接器再把多个 <code>.o</code> 拼成可执行文件。第 06 章会详细讲这一过程。' },

    { t: 'code', lang: 'asm', title: '一个可汇编、可运行的最小程序', code: [
      '    .data',
      'msg:    .asciz "sum = %d\\n"',
      'arr:    .word 1, 2, 3, 4, 5',
      'n:      .word 5',
      '',
      '    .text',
      '    .globl main',
      'main:',
      '    addi sp, sp, -16',
      '    sw   ra, 12(sp)',
      '    la   a0, arr          # 伪指令：取地址',
      '    la   t0, n',
      '    lw   a1, 0(t0)',
      '    call sum',
      '    mv   a1, a0           # printf 的第二个参数',
      '    la   a0, msg',
      '    call printf',
      '    lw   ra, 12(sp)',
      '    addi sp, sp, 16',
      '    li   a0, 0',
      '    ret'
    ] },

    { t: 'p', html: '调试时最常用的三条命令是：<code>objdump -d</code> 看反汇编，<code>readelf -h/-S</code> 看文件结构，<code>nm</code> 看符号表。Bomb Lab 里你拿到的就是前者的输出。看到 <code>auipc</code>+<code>jalr</code> 组合，基本就是函数调用或取全局变量地址；看到 <code>lui</code>+<code>addi</code>，基本就是在构造常数。' },

    { t: 'terms', items: [
      { en: 'ISA', zh: '指令集架构', html: '软硬件契约：指令、寄存器、寻址方式与异常模型，不规定微架构实现。' },
      { en: 'opcode', zh: '操作码', html: '指令低 7 位，决定指令大类；配合 funct3/funct7 唯一确定操作。' },
      { en: 'PC-relative', zh: 'PC 相对寻址', html: '分支与跳转的偏移相对当前 PC，使代码可被加载到任意地址。' },
      { en: 'stack frame', zh: '栈帧', html: '函数在栈上的一段空间，存放返回地址、保存的寄存器、局部变量与溢出参数。' },
      { en: 'ABI', zh: '应用二进制接口', html: '规定寄存器用途、参数传递、栈对齐与数据布局，保证不同编译单元可互操作。' },
      { en: 'caller-saved', zh: '调用者保存', html: '被调者可随意改写的寄存器；调用者若需跨调用保留，必须自己保存。' },
      { en: 'callee-saved', zh: '被调者保存', html: '被调者若使用必须先保存、返回前恢复的寄存器，如 s0–s11。' },
      { en: 'pseudo-instruction', zh: '伪指令', html: '汇编器展开成一条或几条真指令的写法，如 li、mv、call、ret。' }
    ] },

    { t: 'quiz', qid: 'ch02-q1' },
    { t: 'quiz', qid: 'ch02-q2' },
    { t: 'quiz', qid: 'ch02-q3' },

    { t: 'keypoint', items: [
      { title: '32 个寄存器，x0 恒零', html: 'x0 让 nop、mv、丢弃结果都变成同一条 addi；寄存器无类型。' },
      { title: '六种格式，字段固定', html: 'opcode/rd/funct3/rs1/rs2 位置固定，译码可并行；B/J 立即数被打散且最低位隐含 0。' },
      { title: '只有 load/store 访存', html: '地址 = rs1 + 符号扩展 imm；lb/lbu 的区别就是符号扩展与零扩展。' },
      { title: '分支相对 PC', html: '没有「大于」指令，交换操作数即可；远跳转由汇编器/链接器插跳板。' },
      { title: '调用的本质是责任划分', html: 'caller-saved 自己存，callee-saved 被调者存；sp 在调用边界 16 字节对齐。' }
    ] },

    { t: 'checklist', id: 'ch02', items: [
      '我能说出 x0、ra、sp、a0–a7、s0–s11、t0–t6 的作用',
      '我能把 addi x5, x0, 10 手工编码成 0x00A00293，并反向拆一条 lw',
      '我能解释为什么 RISC-V 没有 subi，以及如何实现减常数',
      '我能把 if/else 与 while 循环翻译成带标签的汇编',
      '我能写出非叶子函数的 prologue/epilogue，并说明为什么必须保存 ra',
      '我能画出含 ra、s0、局部变量的栈帧，并指出 sp 与 fp 的位置',
      '我能判断一个寄存器是 caller-saved 还是 callee-saved，并说出保存责任',
      '我能解释 call 为什么展开成 auipc + jalr，而不是一条 jal'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 CUHKSZ CSC3050 Chapter 2.2《RISC-V ISA》与《Calling Conventions: RISC-V Calling Convention, Caller/Callee Saved Registers》讲义，并参考 Patterson & Hennessy《Computer Organization and Design》RISC-V Edition 第 2 章与 RISC-V 官方《The RISC-V Instruction Set Manual, Volume I: Unprivileged ISA》。指令编码以 RV32I 基础整数集为准；压缩指令（C）、原子（A）、浮点（F/D）与向量（V）仅作扩展提及。调用约定按标准 RISC-V psABI（ILP32），栈 16 字节对齐；课程实验若使用特定工具链（riscv64-unknown-elf 或 Docker 镜像），伪指令展开与寄存器分配可能随优化级别不同，读汇编时以实际 objdump 输出为准。' }
  ]
});
