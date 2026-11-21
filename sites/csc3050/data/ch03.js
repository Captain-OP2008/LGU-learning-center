/* =====================================================================
 * ch03.js · 第 3 章「处理器数据通路：一条指令如何走完」
 * 职责：单周期 RV32I 子集的数据通路、控制信号、关键路径与多周期对比。
 * 依据：Chapter 4 Data Path part 1、Chapter 4 Control
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch03',
  num: '03',
  title: '处理器数据通路：一条指令如何走完',
  en: 'THE DATAPATH',
  goals: [
    '画出单周期 RV32I 子集（lw/sw/R 型/beq/jal）的数据通路，标出每个多路选择器',
    '由指令的六位 opcode 与 funct 字段推出 RegWrite、ALUSrc、MemtoReg 等控制信号',
    '解释为什么单周期处理器 CPI=1 却不一定更快，并估算 load 的关键路径',
    '说清多周期与流水线各自如何复用硬件、代价是什么',
    '把一条机器码手工「走」过数据通路，写出每一步的中间值'
  ],
  kp: [
    { id: 'ch03-1', title: '从指令到硬件：数据通路的角色' },
    { id: 'ch03-2', title: '取指：PC 与指令存储器' },
    { id: 'ch03-3', title: '译码：寄存器堆与立即数生成' },
    { id: 'ch03-4', title: '执行：ALU 与控制信号' },
    { id: 'ch03-5', title: '三类指令的数据通路' },
    { id: 'ch03-6', title: '分支与跳转的通路' },
    { id: 'ch03-7', title: '单周期的瓶颈：关键路径' },
    { id: 'ch03-8', title: '多周期与流水线的动机' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么要把「一条指令」拆开看', html: '第 02 章你学会了读指令，但指令在硬件里到底怎么变成电信号？考试里最常出现的一类题是：<b>「给这条 lw，写出 RegWrite、ALUSrc、MemtoReg 的值」</b>，或者「这条 beq 的下一条 PC 由哪个信号决定」。不会画数据通路，第 04 章的流水线寄存器、冒险检测、forwarding 就全都只能背结论。' },

    { t: 'p', lead: true, html: '处理器 = <b>数据通路</b>（做运算、搬数据）+ <b>控制逻辑</b>（决定每个多路选择器往哪边走、每个写使能开不开）。这一章先建一条能执行 RV32I 子集的单周期通路，再算它的关键路径，最后说明为什么真实处理器不这么做——从而自然引出第 04 章的流水线。' },

    { t: 'h', lvl: 2, text: '一、从指令到硬件：数据通路的角色', id: 'ch03-1' },

    { t: 'p', html: '数据通路由两类元件组成：<b>组合逻辑</b>（ALU、加法器、多路选择器、符号扩展单元）没有时钟，输入变输出就变；<b>状态元件</b>（PC、寄存器堆、数据存储器）只在时钟边沿更新。一条指令的执行，就是让数据在一个时钟周期内穿过组合逻辑，最后把结果写回状态元件。' },

    { t: 'p', html: '本章只实现 RV32I 的一个子集：<code>lw</code>、<code>sw</code>、<code>add/sub/and/or</code>、<code>beq</code>、<code>jal</code>。这不是偷懒——这个子集已经覆盖了所有关键路径类型：寄存器—寄存器运算、load、store、条件分支、写返回地址。扩展到完整的 RV32I，只是增加指令译码分支与多几个 mux，结构不变。' },

    { t: 'table', head: ['实现方式', 'CPI', '时钟周期', '硬件复用', '关键问题'], rows: [
      ['单周期', '1', '取最长指令路径', '不复用，多套加法器/存储器', '时钟被最慢指令拖长'],
      ['多周期', '3–5（视指令）', '取最长「一步」', '同一套硬件分时复用', '需要有限状态机与更多寄存器'],
      ['流水线', '理想 1', '取最长一级', '按级复用', '冒险、转发、冲刷']
    ], caption: '三种实现执行同样的指令，区别只在「一个周期做多少事」与「硬件怎么复用」' },

    { t: 'callout', kind: 'tip', title: '画数据通路的三条规则', html: '① 从「谁写、写什么」倒推：写 PC、写寄存器堆、写存储器各需要什么输入？② 每个「可能有多个来源」的输入都画一个 mux，并由控制信号选择；③ 分支与跳转一定有一条「计算目标地址」的通路，通常与 ALU 分开。' },

    { t: 'h', lvl: 2, text: '二、取指：PC 与指令存储器', id: 'ch03-2' },

    { t: 'p', html: '取指阶段做两件事：把 <b>PC</b> 送给指令存储器（IMEM），取出 32 位指令；同时用加法器算出 <b>PC+4</b>，作为顺序执行的下一条地址。IMEM 是只读的组合逻辑（或带寄存输出的 ROM），地址一变，指令在一个存取时间后出现在输出端。' },

    { t: 'p', html: '下一条 PC 有多个来源：顺序执行是 <code>PC+4</code>；<code>beq</code> 成立时是 <code>PC + imm<<1</code>；<code>jal</code> 是 <code>PC + imm</code>；<code>jalr</code> 是 <code>rs1 + imm</code>。这些来源通过一个多路选择器（常标为 <b>PCsrc</b>）汇入 PC 寄存器。分支目标用<b>独立的加法器</b>计算，因为要和 ALU 并行，不能等 ALU 算完再算地址。' },

    { t: 'p', html: '注意分支偏移在 B 型指令里是「打散」的，取出后要先拼回一个 13 位有符号数，再左移一位（最低位隐含 0）。<code>jal</code> 的 J 型偏移是 21 位，范围 ±1 MiB；<code>beq</code> 是 13 位，范围 ±4 KiB。这也是第 02 章格式表的硬件理由：<b>偏移的位被放在固定位置，是为了让拼接只需要改线，不需要额外的移位器</b>。' },

    { t: 'code', lang: 'asm', title: '一段用来「走通路」的测试程序', code: [
      '# 假设代码从 0x1000 开始，s0=0x2000，s1=0x2004',
      '0x1000:  lw   t0, 0(s0)      # t0 = MEM[0x2000]',
      '0x1004:  lw   t1, 4(s0)      # t1 = MEM[0x2004]',
      '0x1008:  add  t2, t0, t1     # t2 = t0 + t1',
      '0x100c:  sw   t2, 8(s0)      # MEM[0x2008] = t2',
      '0x1010:  beq  t2, x0, done   # t2 == 0 则跳转',
      '0x1014:  addi t2, t2, -1',
      '0x1018:  jal  ra, 0x1000     # 回到开头（示例，注意会覆盖 ra）',
      '0x101c: done:',
      '',
      '# 手工走一遍 lw t0, 0(s0)：',
      '#   PC=0x1000 → IMEM 输出 0x00042403',
      '#   rs1=s0=0x2000, imm=0 → ALU 算地址 0x2000',
      '#   DMEM[0x2000] → 写回 t0'
    ] },

    { t: 'h', lvl: 2, text: '三、译码：寄存器堆与立即数生成', id: 'ch03-3' },

    { t: 'p', html: '译码阶段从指令里拆出 <code>rs1</code>、<code>rs2</code>、<code>rd</code>、<code>funct3</code>、<code>funct7</code> 与立即数。寄存器堆有<b>两个读端口、一个写端口</b>：两个读端口组合输出 rs1/rs2 的值，写端口在时钟下降沿（或上升沿，取决于约定）把结果写入 rd。写使能 <b>RegWrite</b> 为 0 时，任何写操作都被忽略——这保证 <code>sw</code>、<code>beq</code> 不会误写寄存器。' },

    { t: 'p', html: '立即数生成单元把六种格式的立即数统一成 32 位：I 型符号扩展 12 位；S 型把两段拼起来再符号扩展；B 型拼 13 位并左移一位；U 型把 20 位放高、低 12 位清零；J 型拼 21 位并左移一位。这个单元是纯组合逻辑，和读寄存器堆并行发生，不占额外周期。' },

    { t: 'table', head: ['端口/信号', '方向', '作用'], rows: [
      ['rs1 地址', '输入', '选第一个读寄存器（19:15）'],
      ['rs2 地址', '输入', '选第二个读寄存器（24:20）'],
      ['rd 地址', '输入', '选写寄存器（11:7）'],
      ['read data 1/2', '输出', '两个读端口的 32 位数据'],
      ['write data', '输入', '要写回的 32 位结果'],
      ['RegWrite', '输入', '写使能；0 时写入被忽略'],
      ['clk', '输入', '写操作在时钟边沿发生']
    ], caption: 'x0 不需要特殊存储：读 x0 恒返回 0，写 x0 被硬件丢弃' },

    { t: 'p', html: '一个常被忽略的细节：<b>同一个周期内先读后写</b>。如果一条指令要写 rd，而下一条指令要读同一个寄存器，在单周期里这不是问题（两条指令在不同周期）。但在流水线里，这就变成第 04 章的 RAW 冒险——写回发生在 WB 级，而读寄存器在 ID 级，中间隔了两级，必须靠 forwarding 或 stall 解决。' },

    { t: 'h', lvl: 2, text: '四、执行：ALU 与控制信号', id: 'ch03-4' },

    { t: 'p', html: 'ALU 的两个输入来自寄存器堆（rs1、rs2）或立即数，由 <b>ALUSrc</b> 选择。ALU 根据 <b>ALUctr</b> 执行 add、sub、and、or、xor、slt、sll、srl、sra，并输出 <b>Zero</b> 标志（结果是否全 0）。<code>beq</code> 用 Zero 判断是否相等：把两个操作数相减，Zero=1 即相等。' },

    { t: 'table', head: ['指令', 'RegWrite', 'ALUSrc', 'MemRead', 'MemWrite', 'MemtoReg', 'Branch', 'ALUctr'], rows: [
      ['add/sub/and/or', '1', '0（rs2）', '0', '0', '0（ALU）', '0', '按 funct'],
      ['addi', '1', '1（imm）', '0', '0', '0（ALU）', '0', 'add'],
      ['lw', '1', '1（imm）', '1', '0', '1（MEM）', '0', 'add'],
      ['sw', '0', '1（imm）', '0', '1', 'X', '0', 'add'],
      ['beq', '0', '0（rs2）', '0', '0', 'X', '1', 'sub'],
      ['jal', '1', 'X', '0', '0', '2（PC+4）', '0', 'X']
    ], caption: 'X 表示 don\'t care；考试里写 X 或 0 都可，但要能解释为什么不影响结果' },

    { t: 'p', html: '控制单元分两级：<b>主译码器</b>看 opcode，产生 RegWrite、ALUSrc、MemRead、MemWrite、MemtoReg、Branch、ALUOp；<b>ALU 译码器</b>看 ALUOp 与 funct3/funct7，产生具体的 ALUctr。这样分工是因为 opcode 决定「指令大类」，funct 决定「大类里的哪个操作」。R 型指令的 ALUOp 是 10，具体做什么由 funct 字段决定。' },

    { t: 'table', head: ['ALUOp', '含义', 'ALUctr 来源'], rows: [
      ['00', '地址计算（lw/sw）', '强制 add'],
      ['01', '分支比较（beq）', '强制 sub'],
      ['10', 'R 型', '由 funct3/funct7 决定'],
      ['11', '立即数运算（addi 等）', '由 funct3 决定（示例简化）']
    ], caption: '两级译码让「加一条 R 型指令」只需改 ALU 译码器，不必动主译码器' },

    { t: 'p', html: '写回阶段有一个 <b>MemtoReg</b> 多路选择器：ALU 结果、DMEM 读出的数据、PC+4 三选一。R 型与 addi 选 ALU；lw 选 DMEM；jal/jalr 选 PC+4（返回地址）。这个 mux 是第 02 章「jal 把 PC+4 写进 rd」的硬件实现，也是为什么 <code>jal</code> 需要一条额外的写回通路。' },

    { t: 'code', lang: 'c', title: '用 60 行 C 模拟这条单周期数据通路', code: [
      '#include <stdio.h>',
      '#include <stdint.h>',
      '',
      'static int32_t regs[32];',
      'static int32_t mem[1024];',
      'static uint32_t pc = 0;',
      '',
      'static int32_t alu(int32_t a, int32_t b, int ctrl) {',
      '    switch (ctrl) {',
      '    case 0: return a + b;',
      '    case 1: return a - b;',
      '    case 2: return a & b;',
      '    case 3: return a | b;',
      '    default: return 0;',
      '    }',
      '}',
      '',
      '/* 只演示 add/sub/and/or/lw/sw/beq 的字段与数据流 */',
      'static void step(uint32_t instr) {',
      '    uint32_t op  = instr & 0x7F;',
      '    uint32_t rd  = (instr >> 7) & 0x1F;',
      '    uint32_t f3  = (instr >> 12) & 0x7;',
      '    uint32_t rs1 = (instr >> 15) & 0x1F;',
      '    uint32_t rs2 = (instr >> 20) & 0x1F;',
      '    int32_t  imm = ((int32_t)instr) >> 20;   /* I 型 */',
      '',
      '    if (op == 0x33) {              /* R 型 */',
      '        int ctrl = (f3 == 0 && (instr >> 30)) ? 1 : 0;',
      '        regs[rd] = alu(regs[rs1], regs[rs2], ctrl);',
      '        pc += 4;',
      '    } else if (op == 0x03) {       /* lw */',
      '        int32_t addr = regs[rs1] + imm;',
      '        regs[rd] = mem[addr / 4];',
      '        pc += 4;',
      '    } else if (op == 0x23) {       /* sw */',
      '        int32_t addr = regs[rs1] + imm;',
      '        mem[addr / 4] = regs[rs2];',
      '        pc += 4;',
      '    } else if (op == 0x63) {       /* beq */',
      '        int32_t off = ((int32_t)(instr & 0xFE000000) >> 19) |',
      '                      ((instr >> 20) & 0x1E);',
      '        if (regs[rs1] == regs[rs2]) pc += off;',
      '        else pc += 4;',
      '    } else {',
      '        pc += 4;                   /* 其它先跳过 */',
      '    }',
      '    regs[0] = 0;',
      '}',
      '',
      'int main(void) {',
      '    regs[8] = 0; regs[9] = 4;',
      '    step(0x00812023);              /* sw x8, 0(x2) 示例编码 */',
      '    step(0x00012403);              /* lw x8, 0(x2) */',
      '    step(0x00940433);              /* add x8, x8, x9 */',
      '    printf("x8=%d pc=0x%X\\n", regs[8], pc);',
      '    return 0;',
      '}'
    ] },

    { t: 'callout', kind: 'warn', title: '示意代码不是完整模拟器', html: '上面的 <code>imm</code> 只演示了 I 型（算术右移 20 位），B 型的偏移拼接也是简化版；真实编码还要处理 <code>imm[11]</code> 与 <code>imm[4:1]</code> 的位置。它的用途是让你看清「字段 → 控制 → 数据流」的对应关系，而不是替代 Project #3 的流水线模拟器。Project #3 要求你按周期推进五级流水，处理 forwarding 与 stall，复杂度高一个量级。' },

    { t: 'h', lvl: 2, text: '五、三类指令的数据通路', id: 'ch03-5' },

    { t: 'steps', items: [
      { title: 'R 型：add t2, t0, t1', html: 'PC→IMEM 取指；读 t0/t1；ALUSrc=0 选 rs2；ALU 做 add；MemtoReg=0 选 ALU；RegWrite=1 写入 t2；PC←PC+4。' },
      { title: 'lw：lw t0, 4(s0)', html: '读 s0；ALUSrc=1 选 imm=4；ALU 算地址；MemRead=1 读 DMEM；MemtoReg=1 选 DMEM；RegWrite=1 写入 t0；PC←PC+4。' },
      { title: 'sw：sw t2, 8(s0)', html: '读 s0 与 t2；ALUSrc=1 选 imm=8；ALU 算地址；MemWrite=1 把 t2 写进 DMEM；RegWrite=0；PC←PC+4。' },
      { title: 'beq：beq t2, x0, done', html: '读 t2 与 x0；ALUSrc=0；ALU 做 sub；Zero=1 且 Branch=1 时 PCsrc 选分支目标，否则 PC←PC+4。' }
    ] },

    { t: 'p', html: '把四条路径叠在一起，会发现它们<b>共享</b> PC、IMEM、寄存器堆、ALU，但<b>各自需要</b>不同的 mux 与写使能。单周期的做法是：所有路径同时画出来，用 mux 选择，用写使能屏蔽。代价是硬件变多（独立的指令/数据存储器、独立的 branch 加法器），但控制简单——每条指令一个周期，CPI=1。' },

    { t: 'compare', left: { title: 'R 型与 lw 的共同点', html: '都要读 rs1；都要经过 ALU；都要写 rd。区别只在 ALU 的第二个操作数（rs2 vs imm）与写回来源（ALU vs DMEM）。' }, right: { title: 'lw 与 sw 的共同点', html: '都用 rs1+imm 算地址；区别在数据方向：lw 读存储器并写寄存器，sw 读寄存器并写存储器。' } },

    { t: 'h', lvl: 2, text: '六、分支与跳转的通路', id: 'ch03-6' },

    { t: 'p', html: '<code>beq</code> 的通路多两条：一条是<b>分支目标加法器</b>，把 PC 与 <code>imm<<1</code> 相加；另一条是 <b>PCsrc</b> 控制，决定下一条 PC 是 PC+4 还是分支目标。判断条件来自 ALU 的 Zero 输出与 Branch 控制信号的与门：只有「这是分支指令」且「比较相等」时才改 PC。' },

    { t: 'p', html: '<code>jal</code> 不需要 ALU 比较，它直接把 <code>PC+imm</code> 作为目标，同时把 <code>PC+4</code> 写进 rd。所以它需要一条额外的写回路径（MemtoReg=2），并且 PCsrc 选择跳转目标。<code>jalr</code> 的目标来自 <code>rs1+imm</code>，要经过 ALU，再把最低位清零。' },

    { t: 'table', head: ['指令', '目标地址', '写回值', 'PCsrc'], rows: [
      ['顺序执行', 'PC+4', '—', '00'],
      ['beq（成立）', 'PC + imm<<1', '—', '01'],
      ['jal', 'PC + imm', 'PC+4', '10'],
      ['jalr', '(rs1 + imm) & ~1', 'PC+4', '11']
    ], caption: 'PCsrc 位宽取决于实现；关键是「分支目标用独立加法器，与 ALU 并行」' },

    { t: 'p', html: '为什么分支目标不直接用 ALU 算？因为 ALU 此刻正在做比较（sub），若再让它算地址，就得串行两步，拉长关键路径。加一个专用加法器，面积换时间——这是数据通路设计里最常见的 trade-off，第 04 章流水线也是同一个思路的延伸。' },

    { t: 'h', lvl: 2, text: '七、单周期的瓶颈：关键路径', id: 'ch03-7' },

    { t: 'p', html: '单周期的时钟周期必须容纳<b>最慢的那条指令</b>。哪条最慢？<code>lw</code>：取指 → 读寄存器 → ALU 算地址 → 读 DMEM → 写回。它比 R 型多了「读 DMEM」这一大块，比 beq 多了写回。所以时钟周期由 load 决定，R 型与分支都必须「陪跑」等满一个周期。' },

    { t: 'table', head: ['组成', '典型延迟', '说明'], rows: [
      ['PC 寄存器 Clk-to-Q', '30 ps', '时钟边沿到输出稳定'],
      ['指令存储器', '200 ps', '取指'],
      ['寄存器堆读', '50 ps', '译码后读两个操作数'],
      ['ALU', '100 ps', '地址计算或运算'],
      ['数据存储器读', '200 ps', 'lw 独有'],
      ['写回 mux + 建立时间', '40 ps', '选择与采样'],
      ['合计（lw）', '约 620 ps', '这就是时钟周期下限']
    ], caption: '数字仅用于说明数量级；真实工艺下各部件延迟不同，但「load 最长」的结论不变' },

    { t: 'p', html: '于是单周期的效率问题很清楚：R 型只用约 390 ps 的逻辑，却要等 620 ps；<code>beq</code> 更短。CPI 虽然是最理想的 1，但<b>时钟频率被最慢指令拖低</b>，整体性能反而不如「周期更短、CPI 略高」的多周期或流水线。这就是「CPI 不是全部」的第一个例子，第 07 章会用 CPU 时间公式把它量化。' },

    { t: 'p', html: '另一个浪费是<b>硬件不能复用</b>：IMEM 与 DMEM 分开（因为同周期既要取指又要访存），branch 加法器与 ALU 分开，寄存器堆的读写端口也要同时可用。单周期用面积换简单；多周期则反过来，用更复杂的控制换更少的硬件。' },

    { t: 'h', lvl: 2, text: '八、多周期与流水线的动机', id: 'ch03-8' },

    { t: 'p', html: '多周期把一条指令拆成 3–5 个步骤（取指、译码/读寄存器、执行、访存、写回），每步一个周期，用有限状态机控制。好处是：<b>同一套 IMEM/DMEM/ALU 可以分时复用</b>，时钟周期只需容纳最长的一步（而不是整条指令）；坏处是：CPI 变成 3–5，且需要额外的中间寄存器保存跨步骤的数据。' },

    { t: 'p', html: '流水线则更进一步：<b>每个周期都让五条指令分别处于五个阶段</b>，硬件按级复用，理想情况下每个周期完成一条指令（CPI≈1），而时钟周期只需容纳最长的一级。它把「多周期的串行」变成「装配线」，代价是冒险——第 04 章的主题。' },

    { t: 'table', head: ['指标', '单周期', '多周期', '五级流水'], rows: [
      ['CPI', '1', '3–5', '理想 1，实际 1.2–1.5'],
      ['时钟周期', '最长指令', '最长一步', '最长一级'],
      ['硬件复用', '低', '高', '高（按级）'],
      ['控制复杂度', '低', '中（FSM）', '高（冒险/转发/冲刷）'],
      ['典型教学顺序', '先讲', '过渡', '本章之后']
    ], caption: '流水线不是「更快的单周期」，而是「用并发换吞吐」的另一条路' },

    { t: 'p', html: '把这一章收束：<b>数据通路是「指令的物理投影」</b>——每条指令的语义，都能在图上找到一条从 PC 到写回的通路；每个控制信号，都是「这条指令要不要走这条路」的开关。下一章会给这条通路加上流水寄存器，让五条指令同时在图上跑，然后处理它们争用资源、互相等待的问题。' },

    { t: 'terms', items: [
      { en: 'datapath', zh: '数据通路', html: '执行指令的硬件部件与连线：PC、IMEM、寄存器堆、ALU、DMEM、mux。' },
      { en: 'control unit', zh: '控制单元', html: '根据 opcode/funct 产生写使能与 mux 选择信号，分主译码与 ALU 译码两级。' },
      { en: 'ALU', zh: '算术逻辑单元', html: '执行加减、逻辑、移位、比较，并输出 Zero 标志供分支使用。' },
      { en: 'register file', zh: '寄存器堆', html: '32 个 32 位寄存器，两读一写；写使能 RegWrite 控制是否真正写入。' },
      { en: 'critical path', zh: '关键路径', html: '组合逻辑中最长的延迟路径；单周期的时钟周期由 load 的关键路径决定。' },
      { en: 'single-cycle', zh: '单周期', html: '每条指令一个时钟周期完成，CPI=1，但周期被最慢指令拖长。' },
      { en: 'multicycle', zh: '多周期', html: '一条指令分多个周期、复用同一套硬件，用 FSM 控制步骤切换。' },
      { en: 'PCsrc', zh: '下一条 PC 选择', html: '在 PC+4、分支目标、jal/jalr 目标之间选择的多路选择器控制信号。' }
    ] },

    { t: 'quiz', qid: 'ch03-q1' },
    { t: 'quiz', qid: 'ch03-q2' },
    { t: 'quiz', qid: 'ch03-q3' },

    { t: 'keypoint', items: [
      { title: '数据通路 = 组合逻辑 + 状态元件', html: 'PC、寄存器堆、存储器在时钟边沿更新；ALU、mux、加法器是组合逻辑。' },
      { title: '控制信号由 opcode/funct 决定', html: '主译码器产生大类控制，ALU 译码器产生具体运算；X 表示 don\'t care。' },
      { title: 'load 决定单周期时钟', html: '取指→读寄存器→ALU→读 DMEM→写回，是最长路径；R 型与分支都在陪跑。' },
      { title: '分支目标用独立加法器', html: '与 ALU 比较并行，避免串行拉长关键路径；PCsrc 在多个目标间选择。' },
      { title: '流水线是下一站的答案', html: '多周期用复用换短周期，流水线用并发换吞吐；两者都把 CPI 与周期解耦。' }
    ] },

    { t: 'checklist', id: 'ch03', items: [
      '我能不看书画出 lw 的完整数据通路，并标出每个 mux 的选择信号',
      '我能填出 add/lw/sw/beq 的 RegWrite、ALUSrc、MemRead、MemWrite、MemtoReg、Branch',
      '我能解释为什么 beq 用 sub 的 Zero 标志，而不是单独的相等比较器',
      '我能说出 jal 为什么需要一条额外的写回通路',
      '我能算出 load 的关键路径，并解释为什么 R 型要等同样长的周期',
      '我能对比单周期、多周期、流水线的 CPI、周期与硬件复用',
      '我能把一条机器码拆成字段，并说出它经过的每个部件',
      '我能解释 PCsrc 的四个来源分别对应哪类指令'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 CUHKSZ CSC3050 Chapter 4《Data Path part 1》与《Control》组织，并参考 Patterson & Hennessy《Computer Organization and Design》RISC-V Edition 第 4 章。数据通路限定在 RV32I 子集（lw/sw/R 型/beq/jal），控制信号命名采用课程讲义常见写法（RegWrite、ALUSrc、MemtoReg、MemRead、MemWrite、Branch、ALUOp、PCsrc）；不同教材对 MemtoReg 的位宽与编码可能不同，答题时以题目给出的图为准。关键路径的皮秒数值仅用于说明「load 最长」的数量级，不代表任何具体工艺；Project #3 的流水线模拟器要求按周期推进并处理冒险，超出本章的单周期范围，将在第 04 章展开。' }
  ]
});
