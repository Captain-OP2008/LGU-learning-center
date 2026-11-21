/* =====================================================================
 * data/ch08.js · 第 08 章：汇编与函数调用
 * 职责：把 C 的抽象落到寄存器与指令上：寄存器、常用指令、调用约定、
 *       call/ret、栈帧、参数传递、局部变量、递归与 -O2 优化。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch08',
  num: '08',
  title: '汇编与函数调用',
  en: 'Assembly & Function Calls',
  goals: [
    '能用 gcc -S 把一段 C 编译成汇编，并找到函数入口',
    '能说出 x86-64 六个整数参数寄存器与返回值寄存器',
    '能解释 call / ret 与 rsp / rbp 如何构成一次函数调用',
    '能读懂 mov / lea / add / cmp / jcc 的 AT&T 写法',
    '能解释递归在机器层如何展开，以及为什么深度过大会栈溢出'
  ],
  kp: [
    { id: 'ch08-1', title: '为什么要读汇编，以及怎么看' },
    { id: 'ch08-2', title: 'x86-64 的寄存器' },
    { id: 'ch08-3', title: '常用指令与操作数' },
    { id: 'ch08-4', title: '一个函数的完整汇编：call / ret 与栈帧' },
    { id: 'ch08-5', title: '参数传递、返回值与对齐' },
    { id: 'ch08-6', title: '局部变量、递归与优化' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '"函数调用""局部变量""栈溢出"这些词，在 C 的层面只能含糊地描述。' +
      '把同一段 C 编译成汇编读一遍，你会突然看清三件事：' +
      '<b>参数到底放在哪里</b>、<b>局部变量为什么随函数返回消失</b>、' +
      '<b>为什么"未定义行为"能让编译器做出看起来离谱的优化</b>。' +
      '这一章不要求你会写汇编，只要求你能读懂编译器为你的 C 生成的那几十行。'
    },

    { t: 'p', lead: true, html:
      '先建立一个最小模型：<b>CPU 只有寄存器、内存和一组指令。</b>' +
      '函数调用在机器层就是"把参数放进约定的寄存器 → <code>call</code> 到一个地址 → ' +
      '从 <code>rax</code> 取返回值"。寄存器够不够用、栈怎么长、返回值放哪，' +
      '统统由一套叫<b>调用约定</b>的规则规定。剩下的都是这个模型的派生。'
    },

    { t: 'h', text: '一、为什么要读汇编，以及怎么看', id: 'ch08-1' },

    { t: 'p', html:
      '编译 C 时加 <code>-S</code> 就能得到汇编文本：' +
      '<code>gcc -S -O0 demo.c -o demo.s</code>。' +
      '想直接看已经编译好的可执行文件，用 <code>objdump -d prog</code>；' +
      '在 <code>gdb</code> 里可以用 <code>disassemble /m</code> 把源码和汇编混排出来。' +
      '本课统一使用 GNU 工具链的默认语法——<b>AT&amp;T 语法</b>。'
    },

    { t: 'p', html:
      'AT&amp;T 语法有三条与 Intel 语法相反的约定，第一次读会不习惯：' +
      '<b>源操作数在前、目的操作数在后</b>（<code>mov src, dst</code>）；' +
      '<b>立即数带 <code>$</code></b>（<code>$3</code>）；' +
      '<b>寄存器带 <code>%</code></b>（<code>%rdi</code>）。' +
      '指令后面的后缀 <code>b / w / l / q</code> 表示操作数大小：1 / 2 / 4 / 8 字节，' +
      '例如 <code>movl</code> 是搬 4 字节，<code>movq</code> 是搬 8 字节。'
    },

    { t: 'callout', kind: 'note', html:
      '同一段 C 在不同编译器、不同优化等级下生成的汇编可能差别很大，' +
      '指令顺序、使用的寄存器都可能不同，连"有没有 <code>subq $N, %rsp</code> 这一步"都可能不同：' +
      '叶子函数可以直接使用栈指针下方的红区（red zone），从而省掉这条指令。' +
      '<b>这一章展示的是"典型输出"，重点是对应关系，不是死记某一份清单。</b>' +
      '判断语义是否一致，看的是"数据从哪来到哪去"，而不是行号。'
    },

    { t: 'h', text: '二、x86-64 的寄存器', id: 'ch08-2' },

    { t: 'p', html:
      'x86-64 有 16 个通用寄存器，每个 64 位。它们的低 32 位、16 位、8 位各有自己的名字：' +
      '<code>rax</code> 的低 32 位叫 <code>eax</code>，再低是 <code>ax</code>，最低字节是 <code>al</code>。' +
      '写 32 位寄存器（如 <code>movl $0, %eax</code>）会<b>把高 32 位自动清零</b>，' +
      '但写 8 位或 16 位只改对应的那几位。' +
      '<code>rsp</code> 指向栈顶，<code>rbp</code> 通常指向当前栈帧的底部。'
    },

    { t: 'table', head: ['64 位', '32 位', '常见用途', '调用后谁保存'], rows: [
      ['<code>%rax</code>', '<code>%eax</code>', '返回值、临时计算', '调用者'],
      ['<code>%rbx</code>', '<code>%ebx</code>', '通用；被调用者要保存', '被调用者'],
      ['<code>%rcx</code>', '<code>%ecx</code>', '第 4 个参数', '调用者'],
      ['<code>%rdx</code>', '<code>%edx</code>', '第 3 个参数；除法辅助', '调用者'],
      ['<code>%rsi</code>', '<code>%esi</code>', '第 2 个参数', '调用者'],
      ['<code>%rdi</code>', '<code>%edi</code>', '第 1 个参数', '调用者'],
      ['<code>%rbp</code>', '<code>%ebp</code>', '帧指针（可省略）', '被调用者'],
      ['<code>%rsp</code>', '<code>%esp</code>', '栈指针，始终指向栈顶', '特殊'],
      ['<code>%r8</code> / <code>%r9</code>', '<code>%r8d</code> / <code>%r9d</code>', '第 5、6 个参数', '调用者'],
      ['<code>%r10</code> / <code>%r11</code>', '<code>%r10d</code> / <code>%r11d</code>', '临时计算', '调用者'],
      ['<code>%r12</code>–<code>%r15</code>', '<code>%r12d</code>–<code>%r15d</code>', '通用；被调用者要保存', '被调用者']
    ] },

    { t: 'p', html:
      '"调用者保存"与"被调用者保存"是理解函数调用的关键：' +
      '如果一段代码要跨过 <code>call</code> 继续使用某个寄存器里的值，而那个寄存器是<b>调用者保存</b>的，' +
      '它就必须自己先存起来；反过来，函数如果要使用 <b>被调用者保存</b>的寄存器，' +
      '必须保证返回时把它们恢复原样。编译器就是按这张表来分配寄存器、决定要不要 push 的。'
    },

    { t: 'callout', kind: 'tip', html:
      '寄存器名字来自历史：<code>rax</code> 是累加器（accumulator），<code>rbx</code> 是基址（base），' +
      '<code>rcx</code> 是计数（counter），<code>rdx</code> 是数据（data），' +
      '<code>rsi</code> 是源下标（source index），<code>rdi</code> 是目的下标（destination index）。' +
      '现在它们的用途早已泛化，但名字留了下来——这也是为什么参数寄存器看起来"没规律"。'
    },

    { t: 'h', text: '三、常用指令与操作数', id: 'ch08-3' },

    { t: 'p', html:
      '操作数只有三类：<b>立即数</b> <code>$8</code>、<b>寄存器</b> <code>%rdi</code>、' +
      '<b>内存</b> <code>8(%rbp)</code>。内存操作数的一般形式是 ' +
      '<code>disp(base, index, scale)</code>，地址 = <code>base + index × scale + disp</code>，' +
      '所以 <code>(%rdi,%rsi,8)</code> 正好表示"以 rdi 为数组基址、rsi 为下标、每个元素 8 字节"。' +
      '读汇编时，算地址的公式比指令名更重要。'
    },

    { t: 'table', head: ['指令（AT&amp;T）', '含义', '例子'], rows: [
      ['<code>mov src, dst</code>', '把数据从 src 复制到 dst', '<code>movq %rdi, -8(%rbp)</code>'],
      ['<code>lea disp(base,index,scale), dst</code>', '只计算地址，<b>不读取内存</b>', '<code>leaq (%rdi,%rdi,2), %rax</code>'],
      ['<code>add</code> / <code>sub</code> / <code>imul</code>', '加 / 减 / 乘', '<code>addq $1, %rax</code>'],
      ['<code>cmp a, b</code> / <code>test a, b</code>', '比较 / 按位与，只设置标志位', '<code>cmpq $1, -8(%rbp)</code>'],
      ['<code>jmp</code> / <code>jcc</code>', '无条件 / 条件跳转', '<code>jg .L2</code>、<code>je .L5</code>'],
      ['<code>setcc</code>', '按标志位写 1 个字节（0 或 1）', '<code>sete %al</code>'],
      ['<code>push</code> / <code>pop</code>', '压栈 / 弹栈，同时移动 <code>rsp</code>', '<code>pushq %rbp</code>'],
      ['<code>call</code> / <code>ret</code>', '调用函数 / 从函数返回', '<code>call fact</code>、<code>ret</code>'],
      ['<code>xor %eax, %eax</code>', '快速把寄存器清零（比自己 mov 0 短）', '<code>xorl %eax, %eax</code>']
    ] },

    { t: 'p', html:
      '<code>lea</code> 是读汇编时最容易被忽略、又最有信息量的指令。它本来是"加载有效地址"，' +
      '但因为地址计算公式 <code>base + index × scale + disp</code> 本身就是一个算术表达式，' +
      '编译器常拿它做<b>不访问内存的加法和小常数乘法</b>。' +
      '下面两段 C 在 <code>-O2</code> 下的汇编几乎是这个样子的：'
    },

    { t: 'code', lang: 'c', caption: 'arith.s —— lea 既算地址，也算算术（-O2 生成）', code:
`# 对应的 C 源：
#   long mul3(long x)        { return x * 3; }
#   long load_at(long *p, long i) { return p[i]; }

mul3:
        leaq    (%rdi,%rdi,2), %rax     # rax = rdi + rdi*2 = 3*x，没有访存
        ret

load_at:
        movq    (%rdi,%rsi,8), %rax     # 地址 = p + i*8，再读 8 个字节
        ret
` },

    { t: 'callout', kind: 'note', html:
      '<code>3 * x</code> 编译器不会生成 <code>imul</code>；它用一条 <code>lea</code> 同时完成' +
      '"乘 2 再加原值"。这就是为什么读汇编能帮你理解"一行 C 到底要花几条指令"，' +
      '也是为什么微优化必须建立在看懂生成代码的基础上，而不是靠猜。'
    },

    { t: 'h', text: '四、一个函数的完整汇编：call / ret 与栈帧', id: 'ch08-4' },

    { t: 'p', html:
      '看一个最小的完整例子。这段 C 里 <code>main</code> 调用 <code>add</code>，' +
      '两个参数、一个返回值；用 <code>-O0</code> 编译，便于看清每一步。' +
      '汇编里以 <code>#</code> 开头的是注释（下面是为了讲解后加的）。'
    },

    { t: 'code', lang: 'c', caption: 'add.c —— 本章的主角', code:
`long add(long a, long b) {
    return a + b;
}

int main(void) {
    return (int)add(1, 2);
}
` },

    { t: 'code', lang: 'c', caption: 'add.s —— gcc -S -O0 生成的汇编（AT&T 语法，注释为讲解添加）', code:
`        .globl  add
add:
        pushq   %rbp                    # 保存调用者的帧指针
        movq    %rsp, %rbp              # 建立新帧：rbp 指向当前栈顶
        movq    %rdi, -8(%rbp)          # 第 1 个参数 a 存到栈上
        movq    %rsi, -16(%rbp)         # 第 2 个参数 b
        movq    -8(%rbp), %rdx
        movq    -16(%rbp), %rax
        addq    %rdx, %rax              # rax = a + b，返回值放 rax
        popq    %rbp                    # 恢复调用者的帧指针
        ret                             # 弹出返回地址，跳回 main

        .globl  main
main:
        pushq   %rbp
        movq    %rsp, %rbp
        movl    $2, %esi                # 第 2 个参数走 esi
        movl    $1, %edi                # 第 1 个参数走 edi
        call    add                     # 压入返回地址，跳到 add
        popq    %rbp
        ret
` },

    { t: 'p', html:
      '这段汇编里有三个动作构成了"函数调用"的全部骨架：' +
      '<b>1)</b> 调用方把参数放进约定的寄存器（<code>edi</code>、<code>esi</code>）；' +
      '<b>2)</b> <code>call</code> 把<b>下一条指令的地址</b>压到栈上，然后跳到目标函数；' +
      '<b>3)</b> 被调用方用 <code>push rbp</code> / <code>mov rsp, rbp</code> 建立自己的栈帧，' +
      '返回前恢复，最后用 <code>ret</code> 把返回地址弹回 <code>rip</code>。'
    },

    { t: 'flow', dir: 'v', nodes: [
      { title: '调用方准备参数', desc: '按约定放入 rdi、rsi、rdx……', kind: 'proc' },
      { title: 'call 目标函数', desc: '压入返回地址（下一条指令的地址），跳转', kind: 'proc' },
      { title: '被调用方建立栈帧', desc: 'push rbp；mov rsp, rbp；sub rsp, N', kind: 'proc' },
      { title: '执行函数体', desc: '局部变量位于 -8(%rbp)、-16(%rbp)…', kind: 'proc' },
      { title: '恢复并 ret', desc: 'mov rbp, rsp；pop rbp；弹出返回地址', kind: 'decide' }
    ] },

    { t: 'table', head: ['位置（从高到低）', '内容', '谁放的'], rows: [
      ['高地址', '调用者的栈帧', '调用者'],
      ['返回地址', '<code>call</code> 之后那条指令的地址', '<code>call</code> 指令自动压入'],
      ['旧 <code>rbp</code>', '调用者的帧指针', '<code>pushq %rbp</code>'],
      ['<code>-8(%rbp)</code>、<code>-16(%rbp)</code> …', '局部变量、参数副本', '函数体'],
      ['低地址（<code>%rsp</code>）', '当前栈顶', '随 <code>push</code> / <code>sub</code> 变化']
    ] },

    { t: 'p', html:
      '注意栈的生长方向：<b>栈向下长</b>。每次 <code>push</code> 或 <code>sub $N, %rsp</code>，' +
      '<code>rsp</code> 都变小。所以"更深的调用"地址更低，"调用者的帧"在更高地址。' +
      '这也解释了什么函数返回后局部变量就失效：<code>rsp</code> 一移动，那块区域就交还给了调用者，' +
      '下一次调用立刻会覆盖它。'
    },

    { t: 'callout', kind: 'warn', html:
      '"返回局部变量地址"在 C 层面的说法是"悬垂指针"，在机器层面的原因就是：' +
      '那个地址位于<b>已经被回收的栈帧</b>里。函数一 <code>ret</code>，' +
      '<code>rsp</code> 就回到了调用者那边，那块内存随时会被下一次调用重写。' +
      '编译器不会拦你，因为从它的角度看这只是"返回一个整数"。'
    },

    { t: 'h', text: '五、参数传递、返回值与对齐', id: 'ch08-5' },

    { t: 'p', html:
      'x86-64 Linux 使用 <b>System V AMD64 调用约定</b>。整数和指针参数依次放进 ' +
      '<code>rdi</code>、<code>rsi</code>、<code>rdx</code>、<code>rcx</code>、<code>r8</code>、<code>r9</code>，' +
      '浮点参数放进 <code>xmm0</code>–<code>xmm7</code>；返回值方面，整数和指针用 <code>rax</code>，' +
      '浮点用 <code>xmm0</code>。第 7 个及之后的参数放在栈上。' +
      '另一个硬性要求是：<b>在 <code>call</code> 之前，<code>rsp</code> 必须 16 字节对齐</b>' +
      '（<code>call</code> 压入 8 字节返回地址，所以刚进入函数时 <code>rsp % 16 == 8</code>）。'
    },

    { t: 'table', head: ['参数序号', '整数 / 指针寄存器', '浮点寄存器'], rows: [
      ['第 1 个', '<code>%rdi</code>', '<code>%xmm0</code>'],
      ['第 2 个', '<code>%rsi</code>', '<code>%xmm1</code>'],
      ['第 3 个', '<code>%rdx</code>', '<code>%xmm2</code>'],
      ['第 4 个', '<code>%rcx</code>', '<code>%xmm3</code>'],
      ['第 5 个', '<code>%r8</code>', '<code>%xmm4</code>'],
      ['第 6 个', '<code>%r9</code>', '<code>%xmm5</code>'],
      ['第 7 个及以后', '放在栈上（进入函数后位于 <code>8(%rsp)</code> 起）', '同左']
    ] },

    { t: 'code', lang: 'c', caption: 'sum6.c —— 六个参数全部走寄存器', code:
`// 编译：gcc -S -O2 sum6.c
long sum6(long a, long b, long c, long d, long e, long f) {
    return a + b + c + d + e + f;
}
` },

    { t: 'code', lang: 'c', caption: 'sum6.s —— 参数从 rdi、rsi、rdx、rcx、r8、r9 依次取（-O2）', code:
`sum6:
        leaq    (%rdi,%rsi), %rax       # rax = a + b
        addq    %rdx, %rax              # + c
        addq    %rcx, %rax              # + d
        addq    %r8,  %rax              # + e
        addq    %r9,  %rax              # + f
        ret                             # 返回值留在 rax
` },

    { t: 'p', html:
      '第 7 个参数开始走栈。调用方把参数压到栈上，被调用方在进入函数后从 ' +
      '<code>8(%rsp)</code> 开始读——因为 <code>(%rsp)</code> 处正是 <code>call</code> 压入的返回地址，' +
      '再往高地址才是第一个栈参数。'
    },

    { t: 'code', lang: 'c', caption: 'sum7.s —— 第 7 个参数在栈上（-O2）', code:
`# long sum7(long a, long b, long c, long d, long e, long f, long g)
sum7:
        movq    8(%rsp), %rax           # 跳过返回地址，取第 7 个参数
        addq    %rdi, %rax
        addq    %rsi, %rax
        addq    %rdx, %rax
        addq    %rcx, %rax
        addq    %r8,  %rax
        addq    %r9,  %rax
        ret
` },

    { t: 'callout', kind: 'tip', html:
      'C 的"传值"在汇编里就是这么直白：<b>把值复制进寄存器或栈</b>。' +
      '传指针也是传值——复制的是地址本身。这解释了为什么函数改不了调用者的 <code>int</code>，' +
      '却能改调用者的数组元素：数组传进去的是首元素地址，函数照样"值传递"了那个地址。' +
      '结构体按值传递时，小结构可能被拆成几个寄存器，大结构通常由调用方复制一份、传指针过去。'
    },

    { t: 'h', text: '六、局部变量、递归与优化', id: 'ch08-6' },

    { t: 'p', html:
      '在 <code>-O0</code> 下，局部变量几乎都会被放在栈上，位于 <code>rbp - 8</code>、' +
      '<code>rbp - 16</code> 这些位置；这正是第 06 章"栈帧"的机器层来源。' +
      '开了 <code>-O2</code> 之后，编译器会尽量把局部变量放进寄存器，栈上只剩那些"必须占地"的对象。' +
      '下面这一段是 <code>-O0</code> 的输出：'
    },

    { t: 'code', lang: 'c', caption: 'calc.s —— 局部变量 a 住在 -16(%rbp)（-O0）', code:
`# 对应的 C：
#   long calc(long x) {
#       long a = x + 1;
#       return a * 2;
#   }

calc:
        pushq   %rbp
        movq    %rsp, %rbp
        subq    $16, %rsp               # 给参数副本和局部变量腾出空间
        movq    %rdi, -8(%rbp)          # 参数 x
        movq    -8(%rbp), %rax
        addq    $1, %rax
        movq    %rax, -16(%rbp)         # 局部变量 a
        movq    -16(%rbp), %rax
        addq    %rax, %rax              # 自己加自己 = 乘 2
        leave                           # 等价于 movq %rbp,%rsp; popq %rbp
        ret
` },

    { t: 'p', html:
      '递归在机器层没有任何"魔法"：<b>每递归一层，就多一个独立的栈帧</b>。' +
      '下面用阶乘演示。注意 <code>call fact</code> 处，<code>rdi</code> 要重新装成 ' +
      '<code>n - 1</code>；返回后 <code>rax</code> 里是下层的结果，再乘上本层的 <code>n</code>。'
    },

    { t: 'code', lang: 'c', caption: 'fact.c —— 递归函数', code:
`long fact(long n) {
    if (n <= 1) return 1;
    return n * fact(n - 1);
}
` },

    { t: 'code', lang: 'c', caption: 'fact.s —— 每次 call 都压出新的一帧（-O0）', code:
`fact:
        pushq   %rbp
        movq    %rsp, %rbp
        subq    $16, %rsp
        movq    %rdi, -8(%rbp)          # 保存本层的 n
        cmpq    $1, -8(%rbp)
        jg      .L2                     # n > 1 时去递归分支
        movl    $1, %eax                # n <= 1：返回 1
        jmp     .L3
.L2:
        movq    -8(%rbp), %rax
        subq    $1, %rax
        movq    %rax, %rdi              # 准备调用 fact(n - 1)
        call    fact                    # 新的一帧：本层的 n 还留在 -8(%rbp)
        imulq   -8(%rbp), %rax          # rax = fact(n-1) * n
.L3:
        leave
        ret
` },

    { t: 'p', html:
      '递归的代价因此非常具体：<code>fact(100000)</code> 需要大约 10 万层栈帧，' +
      '按每帧几十字节算就是几 MB，很可能直接撞上栈上限。' +
      '优化编译器有时能把<b>尾递归</b>改写成循环（复用同一帧），' +
      '但 C 标准并不保证这种优化，所以"深递归"仍然应该改写成显式循环。'
    },

    { t: 'p', html:
      '<code>-O2</code> 带来的变化可以归成四类：<b>寄存器分配</b>（局部变量不上栈）、' +
      '<b>常量折叠与强度削弱</b>（乘法变 <code>lea</code>）、<b>内联</b>（小函数直接展开、不再有 <code>call</code>）、' +
      '<b>基于未定义行为的推理</b>。最后一类最危险：编译器可以假设 UB 永不发生，' +
      '于是把"看起来有判断"的代码直接优化成常量。'
    },

    { t: 'code', lang: 'c', caption: 'ub.c —— 有符号溢出是未定义行为', code:
`// 编译：gcc -S -O2 ub.c
int always_true(int x) {
    return x + 1 > x;      // 若 x 是 INT_MAX，x + 1 溢出，行为未定义
}
` },

    { t: 'code', lang: 'c', caption: 'ub.s —— 编译器假定"溢出不会发生"，于是整个比较恒为真（-O2）', code:
`always_true:
        movl    $1, %eax        # 直接返回 1，没有任何比较
        ret
` },

    { t: 'callout', kind: 'warn', html:
      '这就是"未定义行为"的真实含义：不是"结果随机"，而是<b>编译器可以假设它不会发生，并据此优化</b>。' +
      '所以"在我机器上跑得对"从来不能证明有 UB 的代码是对的。' +
      '验证 UB 要靠工具：<code>-fsanitize=undefined</code> 在运行时抓有符号溢出、越界移位等问题，' +
      '而 <code>-fsanitize=address</code> 抓内存错误（第 09 章会系统讲）。' +
      '至于对齐：<code>struct</code> 里的填充、栈的 16 字节对齐，都遵循同一条思路——' +
      '硬件有对齐要求，编译器负责把布局补齐，C 语言只承诺"成员按声明顺序排列"。'
    },

    { t: 'p', html:
      '读汇编最实用的两个动作：一是对照源码找<b>数据流</b>——参数从哪个寄存器来、结果放到哪里去；' +
      '二是找<b>控制流</b>——<code>cmp</code>/<code>test</code> 设标志，<code>jcc</code> 按标志跳转。' +
      '只要这两条线能对上，剩下的指令细节可以慢慢查表。'
    },

    { t: 'keypoint', items: [
      { title: '工具链', html:
        '<code>gcc -S</code> 产出汇编，<code>objdump -d</code> 看可执行文件；GNU 默认是 AT&amp;T 语法（源在前、<code>$</code> 立即数、<code>%</code> 寄存器）。' },
      { title: '16 个通用寄存器', html:
        '参数依次走 <code>rdi</code>、<code>rsi</code>、<code>rdx</code>、<code>rcx</code>、<code>r8</code>、<code>r9</code>，返回值在 <code>rax</code>。' },
      { title: 'call / ret 是栈操作', html:
        '<code>call</code> 压返回地址并跳转，<code>ret</code> 弹出返回地址；<code>push rbp</code> + <code>mov rsp, rbp</code> 建立栈帧。' },
      { title: '栈向下生长', html:
        '<code>rsp</code> 减小即压栈；函数返回后帧失效，这是"局部变量地址不能带出去"的机器层解释。' },
      { title: '对齐与约定', html:
        '<code>call</code> 前 <code>rsp</code> 要 16 字节对齐；调用者保存 / 被调用者保存决定跨调用时哪些寄存器必须自己备份。' },
      { title: '优化的边界', html:
        '<code>-O2</code> 会做内联、<code>lea</code> 优化、寄存器分配；UB 会让编译器"证明"代码恒真，因此绝不能靠运气写代码。' }
    ] },

    { t: 'checklist', id: 'ch08', items: [
      '我能用 gcc -S 或 objdump 看到一段 C 对应的汇编',
      '我能说出六个整数参数寄存器和一个返回值寄存器',
      '我能解释 call 与 ret 对栈做了什么',
      '我能画出一次函数调用时栈帧里的内容顺序',
      '我能读懂 mov、lea、cmp、jcc 在示例里的作用',
      '我能解释递归为什么消耗栈、为什么会栈溢出',
      '我能举例说明"未定义行为"如何让编译器做出激进优化'
    ] }
  ]
});
