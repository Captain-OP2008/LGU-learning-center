/* =====================================================================
 * ch06.js · 第 6 章「链接与加载：从 .c 到可执行进程」
 * 职责：编译四步、ELF、符号解析、重定位、静态/动态链接、GOT/PLT、加载。
 * 依据：CS:APP 第 7 章（课程参考书）；CSC3050 工具链与 Docker 环境
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch06',
  num: '06',
  title: '链接与加载：从 .c 到可执行进程',
  en: 'LINKING & LOADING',
  goals: [
    '说清预处理、编译、汇编、链接四步各自输入输出什么文件',
    '读出一个 ELF 目标文件的常见节（.text/.data/.bss/.symtab/.rel.*）与符号表',
    '解释符号解析的强/弱/局部规则，并诊断 undefined reference 与 multiple definition',
    '说明重定位在做什么，能看懂 R_RISCV_HI20 / LO12 / BRANCH 这类条目',
    '对比静态库与动态库，说清 GOT/PLT、延迟绑定与进程加载的地址空间布局'
  ],
  kp: [
    { id: 'ch06-1', title: '四个步骤：从 .c 到进程' },
    { id: 'ch06-2', title: '目标文件与 ELF 节' },
    { id: 'ch06-3', title: '符号解析：强、弱、局部' },
    { id: 'ch06-4', title: '重定位：链接器如何补地址' },
    { id: 'ch06-5', title: '静态库与动态库' },
    { id: 'ch06-6', title: '动态链接：GOT 与 PLT' },
    { id: 'ch06-7', title: '加载与进程地址空间' },
    { id: 'ch06-8', title: '完整走一遍与常见错误' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么 Bomb Lab 之前要懂链接', html: 'Bomb Lab 给你一个<b>已经链接好的可执行文件</b>，没有源码。你要用 <code>objdump -d</code> 找到每个阶段的函数、读出它比较的字符串或数字。如果你不知道 <code>.rodata</code> 里放的是只读常量、<code>call</code> 的目标是 PLT 桩、全局变量在 <code>.data</code>/<code>.bss</code>，就只能在几千行汇编里盲猜。链接与加载，是「程序如何变成进程」的最后一块拼图。' },

    { t: 'p', lead: true, html: '你写的是 <code>hello.c</code>，运行的是 <code>./hello</code>。中间发生了什么？预处理器展开宏与头文件，编译器生成汇编，汇编器生成目标文件，链接器把多个目标文件与库拼成一个可执行文件，加载器把它映射进内存、设置栈、跳到入口。这一章沿着这条流水线走一遍，重点讲<b>符号</b>与<b>地址</b>这两件链接器真正关心的事。' },

    { t: 'h', lvl: 2, text: '一、四个步骤：从 .c 到进程', id: 'ch06-1' },

    { t: 'p', html: '用 <code>gcc</code> 一条命令就能从 <code>.c</code> 得到 <code>a.out</code>，但它内部调用了四个程序：<b>cpp</b>（预处理）、<b>cc1</b>（编译）、<b>as</b>（汇编）、<b>ld</b>（链接）。对应四个可观察的中间文件：<code>.i</code>、<code>.s</code>、<code>.o</code>、可执行文件。把每一步拆开看，是理解「哪一步报什么错」的关键。' },

    { t: 'table', head: ['阶段', '命令', '输入', '输出', '典型错误'], rows: [
      ['预处理', 'gcc -E', '.c + 头文件', '.i（展开后的 C）', '#include 找不到、宏展开错'],
      ['编译', 'gcc -S', '.i', '.s（汇编）', '语法/类型错误'],
      ['汇编', 'gcc -c / as', '.s', '.o（可重定位目标）', '非法指令、立即数越界'],
      ['链接', 'ld / gcc', '.o + 库', '可执行文件 / .so', 'undefined reference、multiple definition']
    ], caption: '编译错误看源码行号；链接错误看符号名。分不清这两类，调试会绕远路' },

    { t: 'p', html: '注意「编译」只处理<b>单个翻译单元</b>：它不知道别的 <code>.c</code> 里定义了什么函数，只能留下一个「外部符号引用」的空位。把所有 <code>.o</code> 拼起来、把空位填上，是链接器的工作。这也是为什么 C 需要头文件声明：编译器需要知道函数的签名，才能生成正确的调用代码。' },

    { t: 'code', lang: 'c', title: '两个源文件：一个定义，一个引用', code: [
      '/* main.c */',
      '#include <stdio.h>',
      'int add(int a, int b);          /* 声明：告诉编译器签名 */',
      '',
      'int main(void) {',
      '    printf("add(2, 3) = %d\\n", add(2, 3));',
      '    return 0;',
      '}',
      '',
      '/* add.c */',
      'int add(int a, int b) {         /* 定义：真正生成代码 */',
      '    return a + b;',
      '}',
      '',
      '/* 分步构建：',
      ' *   gcc -E main.c -o main.i',
      ' *   gcc -S main.i -o main.s',
      ' *   gcc -c main.s -o main.o',
      ' *   gcc -c add.c  -o add.o',
      ' *   gcc main.o add.o -o app',
      ' * 用 nm 看符号：main.o 里 add 是 U（未定义），add.o 里 add 是 T（已定义）',
      ' */'
    ] },

    { t: 'h', lvl: 2, text: '二、目标文件与 ELF 节', id: 'ch06-2' },

    { t: 'p', html: 'Linux 上的目标文件是 <b>ELF</b>（Executable and Linkable Format）。它有三种形态：<b>可重定位</b>（.o，地址从 0 开始，等待链接）、<b>可执行</b>（固定入口与段地址）、<b>共享对象</b>（.so，可被加载到任意地址）。三者结构相同，只是用途不同。' },

    { t: 'table', head: ['节', '内容', '是否占文件空间', '运行时去向'], rows: [
      ['.text', '机器指令', '是', '代码段（只读、可执行）'],
      ['.rodata', '只读常量、字符串字面量', '是', '只读段'],
      ['.data', '已初始化的全局/静态变量', '是', '数据段（可读写）'],
      ['.bss', '未初始化或零初始化的全局/静态变量', '否（只记大小）', '数据段，加载时清零'],
      ['.symtab', '符号表：名字、地址、大小、类型', '是（可 strip）', '不加载'],
      ['.rel.text / .rel.data', '重定位条目', '是', '链接时消费'],
      ['.debug', '调试信息（-g）', '是', '不加载']
    ], caption: '.bss 不占文件空间，只记录「需要多少零」；这是它存在的唯一理由' },

    { t: 'p', html: '用 <code>readelf -S</code> 看节头，<code>readelf -s</code> 看符号表，<code>objdump -d</code> 看反汇编，<code>objdump -r</code> 看重定位。符号表里每个符号有类型：<b>T/t</b> 是代码（全局/局部），<b>D/d</b> 是已初始化数据，<b>B/b</b> 是 .bss，<b>U</b> 是未定义（只引用未定义），<b>R/r</b> 是只读数据。' },

    { t: 'p', html: '<code>.bss</code> 的名字来自早期汇编器的「block started by symbol」。它不存实际字节，只存「这个目标需要 N 字节零」。加载器把可执行文件的段映射进内存后，把 .bss 对应的区域清零——这也是为什么全局数组默认是 0，而局部数组不是（局部在栈上，内容是垃圾）。' },

    { t: 'code', lang: 'bash', title: '用工具链观察一个目标文件', code: [
      '# 编译出目标文件，保留调试信息',
      'riscv64-unknown-elf-gcc -O0 -g -c add.c -o add.o',
      '',
      '# 看节头：注意 .text/.data/.bss/.symtab/.rela.text',
      'riscv64-unknown-elf-readelf -S add.o',
      '',
      '# 看符号表：add 是 FUNC GLOBAL，属于 .text',
      'riscv64-unknown-elf-readelf -s add.o',
      '',
      '# 看反汇编与重定位',
      'riscv64-unknown-elf-objdump -d add.o',
      'riscv64-unknown-elf-objdump -r add.o',
      '',
      '# 看可执行文件的段与入口',
      'riscv64-unknown-elf-readelf -l app',
      'riscv64-unknown-elf-readelf -h app | grep Entry'
    ] },

    { t: 'h', lvl: 2, text: '三、符号解析：强、弱、局部', id: 'ch06-3' },

    { t: 'p', html: '链接器的第一件事是<b>符号解析</b>：把每个 <code>.o</code> 里的「引用」与所有 <code>.o</code>/库里的「定义」对上。符号分三种链接属性：<b>全局强符号</b>（函数、已初始化全局变量）、<b>全局弱符号</b>（未初始化全局变量、<code>__attribute__((weak))</code>）、<b>局部符号</b>（<code>static</code>，只在本文档可见）。' },

    { t: 'table', head: ['情形', '规则', '结果'], rows: [
      ['多个强符号同名', '不允许', 'multiple definition 链接错误'],
      ['一个强 + 多个弱', '选强符号', '弱符号被忽略'],
      ['多个弱符号同名', '任选一个（通常最大/先出现）', '可能静默出错，极危险'],
      ['只有声明没有定义', '无法解析', 'undefined reference'],
      ['static 同名', '各自本地，互不冲突', '各自独立'],
      ['弱引用未定义', '允许为 0', '运行时需判空']
    ], caption: '「多个弱符号」是 C 语言最隐蔽的坑之一：链接器不报错，运行时用错大小' },

    { t: 'p', html: '经典事故：<code>a.c</code> 里 <code>int x;</code>（弱/COMMON），<code>b.c</code> 里 <code>double x;</code>（强），链接器选强符号，但 <code>a.c</code> 仍按 <code>int</code> 写 4 字节，<code>b.c</code> 按 <code>double</code> 读 8 字节——越界读写，行为诡异。现代编译器默认 <code>-fno-common</code>，让未初始化全局也变成强符号，从而在链接期报错。这也是为什么「全局变量尽量加 static 或放匿名命名空间」。' },

    { t: 'p', html: '静态库的解析还有<b>顺序问题</b>：链接器从左到右扫描，遇到 <code>.a</code> 时只抽取「当前未解析符号」需要的成员。如果库 A 依赖库 B，A 必须写在 B 前面；循环依赖要用 <code>--start-group/--end-group</code> 包起来。这是 <code>undefined reference</code> 最常见的非代码原因。' },

    { t: 'callout', kind: 'tip', title: '诊断链接错误的三条命令', html: '<code>nm -C *.o | grep 符号</code> 看谁定义、谁引用；<code>ldd app</code> 看动态依赖；<code>readelf -d app</code> 看 NEEDED、RPATH、SONAME。先确认「符号到底存不存在」，再怀疑顺序与版本。' },

    { t: 'h', lvl: 2, text: '四、重定位：链接器如何补地址', id: 'ch06-4' },

    { t: 'p', html: '编译单个 <code>.o</code> 时，编译器不知道函数与全局变量最终会放在哪，于是先填 0 或占位，并生成一条<b>重定位条目</b>：<code>offset</code>（要补的位置）、<code>type</code>（怎么补）、<code>symbol</code>（补谁）、<code>addend</code>（加多少）。链接器合并所有节、分配虚拟地址后，再按条目逐条打补丁。' },

    { t: 'table', head: ['重定位类型', '修补对象', '典型指令', '算法'], rows: [
      ['R_RISCV_HI20', 'U 型高位', 'lui / auipc', 'S + A 的高 20 位'],
      ['R_RISCV_LO12_I', 'I 型低位', 'addi / lw / jalr', 'S + A 的低 12 位（符号扩展）'],
      ['R_RISCV_LO12_S', 'S 型低位', 'sw / sd', '低 12 位拆到 imm[11:5]/[4:0]'],
      ['R_RISCV_BRANCH', 'B 型偏移', 'beq / bne', '相对 PC 的 13 位偏移'],
      ['R_RISCV_JAL', 'J 型偏移', 'jal', '相对 PC 的 21 位偏移'],
      ['R_RISCV_CALL_PLT', '调用序列', 'call / tail', 'auipc+jalr 两条一起补']
    ], caption: 'S = 符号最终地址，A = addend，P = 被修补位置地址；PC 相对类型用 S+A−P' },

    { t: 'p', html: '为什么 RISCV 要用 <code>HI20 + LO12</code> 两条？因为 32 位地址装不进一条指令的立即数。链接器先补 <code>auipc</code>/<code>lui</code> 的高 20 位，再补 <code>addi</code>/<code>jalr</code> 的低 12 位。低 12 位是<b>符号扩展</b>的，所以当低 12 位 ≥ 0x800 时，高 20 位要加 1 补偿——这就是汇编器 <code>%hi/%lo</code> 与链接器 relaxation 要处理的事。' },

    { t: 'code', lang: 'asm', title: '一段会产生重定位的汇编', code: [
      '    .text',
      '    .globl main',
      'main:',
      '    addi sp, sp, -16',
      '    sw   ra, 12(sp)',
      '    la   a0, msg          # R_RISCV_PCREL_HI20 + LO12_I',
      '    call puts             # R_RISCV_CALL_PLT（auipc + jalr）',
      '    lui  t0, %hi(counter) # R_RISCV_HI20',
      '    lw   t1, %lo(counter)(t0)  # R_RISCV_LO12_I',
      '    addi t1, t1, 1',
      '    sw   t1, %lo(counter)(t0)  # R_RISCV_LO12_S',
      '    lw   ra, 12(sp)',
      '    addi sp, sp, 16',
      '    li   a0, 0',
      '    ret',
      '',
      '    .data',
      'counter: .word 0',
      'msg:     .asciz "hello"'
    ] },

    { t: 'p', html: '重定位是「链接器改写指令」的直接证据：<code>objdump -d</code> 看未链接的 <code>.o</code>，会看到 <code>auipc a0, 0</code>、<code>jalr ra, 0(ra)</code> 这种「半成品」；链接后再看，立即数已经被填上真实偏移。Bomb Lab 里你看到的已经是补好的最终代码，所以能直接顺着 <code>call</code> 与 <code>la</code> 追下去。' },

    { t: 'h', lvl: 2, text: '五、静态库与动态库', id: 'ch06-5' },

    { t: 'p', html: '<b>静态库</b>（<code>.a</code>）是一堆 <code>.o</code> 的归档（<code>ar</code> 打包）。链接时，链接器只把「被引用到」的成员复制进可执行文件，所以体积可控，但每个程序都带一份库代码，升级要重新链接。<b>动态库</b>（<code>.so</code>）在加载或运行时才映射，多个进程共享同一份物理页，升级库不用重编程序，但带来版本、路径与启动开销。' },

    { t: 'table', head: ['维度', '静态库 .a', '动态库 .so'], rows: [
      ['链接时机', '构建时复制进可执行文件', '构建时只记录依赖，加载时解析'],
      ['体积', '每个程序各带一份', '共享一份，程序更小'],
      ['升级', '需重新链接', '替换 .so 即可（ABI 兼容时）'],
      ['启动', '快，无加载器解析', '需动态加载器、符号解析'],
      ['地址', '固定（非 PIE）', '可加载到任意地址（PIC）'],
      ['典型命令', 'gcc main.o -lfoo（找 libfoo.a）', 'gcc main.o -lfoo（优先 .so）']
    ], caption: '同一个 -lfoo，链接器优先找 .so；要强制静态用 -static 或直接写 .a 路径' },

    { t: 'p', html: '动态库要求<b>位置无关代码（PIC）</b>：不能假设自己加载到某个固定地址，所以访问全局变量、调用外部函数都要经过表。<code>-fPIC</code> 让编译器生成这种代码；<code>-shared</code> 让链接器产出 <code>.so</code>。PIC 的代价是每次访问多一次间接寻址（GOT），但换来了共享与 ASLR。' },

    { t: 'p', html: '版本管理靠 <b>SONAME</b>：<code>libfoo.so.1</code> 是真实文件，<code>libfoo.so.1 → libfoo.so.1.2.3</code> 是符号链接，链接时记录 <code>NEEDED libfoo.so.1</code>。升级只要保证 ABI 兼容、换掉 <code>.1.2.3</code> 即可。如果 ABI 不兼容，就要升 SONAME 到 <code>.2</code>，让新旧版本共存。' },

    { t: 'h', lvl: 2, text: '六、动态链接：GOT 与 PLT', id: 'ch06-6' },

    { t: 'p', html: '动态库里的代码不知道自己会被加载到哪，也不知道外部函数的最终地址。解决办法是两张表：<b>GOT（全局偏移表）</b>存「变量的实际地址」，代码通过 <code>GOT[i]</code> 间接取；<b>PLT（过程链接表）</b>存「跳转到外部函数的小桩」，每个外部函数一个桩。' },

    { t: 'p', html: '调用 <code>puts</code> 时，代码先跳到 <code>puts@plt</code>；桩里第一条 <code>jalr</code> 通过 GOT 跳到真实地址。第一次调用时 GOT 里填的还是「解析器入口」，于是进入动态加载器，解析出 <code>puts</code> 的真实地址并写回 GOT；之后再调用就直接跳。这叫<b>延迟绑定（lazy binding）</b>，用首次调用的开销换启动速度。' },

    { t: 'table', head: ['表', '存什么', '谁填', '何时填'], rows: [
      ['GOT', '全局变量/函数的实际地址', '动态加载器', '加载时（数据）或首次调用（函数）'],
      ['PLT', '跳转到 GOT 的小桩', '链接器生成', '构建时'],
      ['.dynamic', 'NEEDED、SONAME、RPATH 等', '链接器', '构建时'],
      ['.rela.plt', '函数重定位条目', '链接器', '构建时，加载/首次调用时消费']
    ], caption: 'GOT 是数据，PLT 是代码；延迟绑定让「第一次调用」付解析成本' },

    { t: 'p', html: '安全加固通常关闭延迟绑定：<code>LD_BIND_NOW=1</code> 或链接时 <code>-Wl,-z,now</code>，让所有符号在启动时解析完，配合 <code>RELRO</code> 把 GOT 设为只读，防止攻击者改写 GOT 劫持控制流。这也是为什么 <code>checksec</code> 会看「Full RELRO」。' },

    { t: 'code', lang: 'c', title: '运行时加载：dlopen / dlsym', code: [
      '#include <stdio.h>',
      '#include <dlfcn.h>',
      '',
      'int main(void) {',
      '    void *h = dlopen("./libfoo.so", RTLD_NOW);',
      '    if (!h) { fprintf(stderr, "dlopen: %s\\n", dlerror()); return 1; }',
      '',
      '    /* dlsym 返回 void*，转函数指针是 POSIX 允许的用法 */',
      '    int (*foo)(int) = (int (*)(int))dlsym(h, "foo");',
      '    if (!foo) { fprintf(stderr, "dlsym: %s\\n", dlerror()); return 1; }',
      '',
      '    printf("foo(7) = %d\\n", foo(7));',
      '    dlclose(h);',
      '    return 0;',
      '}',
      '',
      '/* 编译：gcc main.c -ldl -o app',
      ' * 运行：LD_LIBRARY_PATH=. ./app',
      ' * 这条路径是插件系统、驱动加载、语言运行时的基础。',
      ' */'
    ] },

    { t: 'h', lvl: 2, text: '七、加载与进程地址空间', id: 'ch06-7' },

    { t: 'p', html: '在 shell 里敲 <code>./app</code>，shell 调用 <code>fork</code> + <code>execve</code>。内核读 ELF 头与<b>程序头（program header）</b>，把每个 <code>PT_LOAD</code> 段用 <code>mmap</code> 映射到进程地址空间（代码段只读可执行、数据段可读写），把 <code>.bss</code> 对应的匿名页清零，设置栈顶、压入 <code>argc/argv/envp/auxv</code>，最后跳到 ELF 入口 <code>_start</code>。' },

    { t: 'p', html: '<code>_start</code> 不是 <code>main</code>：它先初始化 libc（堆、stdio、环境），再调用 <code>main</code>，最后用 <code>exit</code> 收尾。动态链接的可执行文件还会先跳到 <code>ld-linux</code>（动态加载器），由它加载依赖的 <code>.so</code>、做重定位、填 GOT，再把控制权交给程序。' },

    { t: 'table', head: ['区域', '内容', '增长方向', '权限'], rows: [
      ['代码段', '.text、.rodata', '固定', 'r-x'],
      ['数据段', '.data、.bss、heap', '堆向高地址增长', 'rw-'],
      ['共享库/mmaps', '.so、文件映射、大块 malloc', '向低地址扩展', 'r-x / rw-'],
      ['栈', '局部变量、返回地址、argv/envp', '向低地址增长', 'rw-（含 guard page）'],
      ['内核', '内核空间', '固定', '仅内核态可访问']
    ], caption: '32 位 Linux 常见布局：0x00010000 起是代码，栈顶接近 0xBFFFFFFF；64 位布局不同' },

    { t: 'p', html: '<b>ASLR（地址空间布局随机化）</b>在每次运行时随机化栈基址、mmap 基址、PIE 可执行文件基址，让攻击者难以硬编码跳转地址。它不改变程序的逻辑，只改变地址——这也再次说明：<b>地址是链接与加载的产物，不是源码的属性</b>。' },

    { t: 'p', html: '栈溢出之所以危险，是因为返回地址就存在栈上；攻击者覆盖它，就能在 <code>ret</code> 时跳到任意位置。防御手段包括栈保护（canary）、NX（栈不可执行）、ASLR、CFI。Bomb Lab 里你不需要攻击，但理解「返回地址在栈上」对读汇编、设断点、看 <code>ra</code> 的值很有帮助。' },

    { t: 'h', lvl: 2, text: '八、完整走一遍与常见错误', id: 'ch06-8' },

    { t: 'p', html: '把前面的内容串起来：<code>main.c</code> 引用 <code>add</code>，编译后 <code>main.o</code> 的符号表里 <code>add</code> 是 <code>U</code>；<code>add.o</code> 里是 <code>T</code>。链接器解析成功，把 <code>call add</code> 的偏移补上；如果 <code>add</code> 在 <code>libmath.a</code> 里，链接器从归档中抽出 <code>add.o</code> 并复制进可执行文件；如果 <code>add</code> 在 <code>libmath.so</code> 里，则生成 PLT 桩，运行时由加载器解析。' },

    { t: 'code', lang: 'bash', title: '一个最小工程的 Makefile', code: [
      'CC      = riscv64-unknown-elf-gcc',
      'CFLAGS  = -O2 -g -Wall -Wextra -fPIC',
      'LDFLAGS = -Wl,-z,now -Wl,-z,relro',
      'OBJ     = main.o add.o',
      '',
      'app: $(OBJ)',
      '\t$(CC) $(LDFLAGS) -o $@ $^',
      '',
      '%.o: %.c',
      '\t$(CC) $(CFLAGS) -c $< -o $@',
      '',
      'clean:',
      '\trm -f $(OBJ) app',
      '',
      '# 注意：命令行前的缩进必须是 Tab，不是空格。',
      '# $@ 是目标，$^ 是所有依赖，$< 是第一个依赖。'
    ] },

    { t: 'table', head: ['错误信息', '常见原因', '排查'], rows: [
      ['undefined reference to `foo\'', '没链接实现、库顺序错、C++ 名字修饰', 'nm 看符号、调整 -l 顺序、extern "C"'],
      ['multiple definition of `x\'', '两个 .o 都定义了强符号', '加 static、改 extern、-fno-common'],
      ['cannot find -lfoo', '库不在搜索路径', '-L 指定目录、装开发包'],
      ['version `GLIBC_2.xx\' not found', '运行环境 glibc 比构建环境旧', '在目标环境构建、静态链接'],
      ['relocation R_RISCV_HI20 ... overflow', '代码/数据超出 ±2 GiB 模型', '-mcmodel=medany'],
      ['Segmentation fault（刚启动）', 'ABI 不匹配、栈未对齐、GOT 被破坏', 'gdb、readelf、检查 -mabi']
    ], caption: '先分类：编译错、链接错、加载错、运行错。每类的工具与线索完全不同' },

    { t: 'p', html: '最后提醒一个课程环境相关的点：CSC3050 的 Docker 镜像里工具链前缀是 <code>riscv64-unknown-elf-</code>，而有些同学本机装的是 <code>riscv64-linux-gnu-</code>。两者 ABI 与库不同，混用会出现「编译通过但链接失败」或「运行即崩」。Project #1/#2 的提交要求在 Docker 里能复现，所以<b>构建环境也是作业的一部分</b>。' },

    { t: 'p', html: '把这一章收束：<b>编译把「语义」变成「指令」，汇编把「指令」变成「带洞的字节」，链接把「洞」补成「地址」，加载把「地址」映射成「进程」。</b>下一章回到性能：当你知道了 CPI、Cache、流水线、链接之后，如何用一条公式判断「该优化哪里」，以及为什么多核与 SIMD 不是免费的午餐。' },

    { t: 'terms', items: [
      { en: 'ELF', zh: '可执行与可链接格式', html: 'Linux 目标文件格式，分可重定位、可执行、共享对象三种形态。' },
      { en: 'symbol table', zh: '符号表', html: '记录每个符号的名字、地址、大小、绑定与类型；链接器据此解析引用。' },
      { en: 'relocation', zh: '重定位', html: '链接器按条目改写指令/数据中的地址占位，分绝对与 PC 相对两类。' },
      { en: 'static library', zh: '静态库', html: '.o 的归档；链接时只抽取被引用的成员并复制进可执行文件。' },
      { en: 'shared object', zh: '共享对象', html: '可在加载/运行时映射的 .so，多个进程共享同一份物理页。' },
      { en: 'PIC', zh: '位置无关代码', html: '不假设加载地址，通过 GOT/PC 相对寻址访问全局符号。' },
      { en: 'GOT / PLT', zh: '全局偏移表 / 过程链接表', html: 'GOT 存实际地址，PLT 是跳转到 GOT 的桩；延迟绑定在首次调用时解析。' },
      { en: 'ASLR', zh: '地址空间布局随机化', html: '运行时随机化栈、mmap、PIE 基址，增加攻击者预测地址的难度。' }
    ] },

    { t: 'quiz', qid: 'ch06-q1' },
    { t: 'quiz', qid: 'ch06-q2' },
    { t: 'quiz', qid: 'ch06-q3' },

    { t: 'keypoint', items: [
      { title: '编译只看单个翻译单元', html: '外部符号留空位；链接器负责解析与补地址，所以链接错要看符号而非行号。' },
      { title: '.bss 不占文件空间', html: '只记录需要多少零，加载时清零；未初始化全局因此默认为 0。' },
      { title: '强/弱/局部决定冲突规则', html: '多个强符号报错；强+弱选强；多个弱可能静默出错，-fno-common 可提前暴露。' },
      { title: '重定位就是打补丁', html: 'HI20/LO12 拼 32 位地址，BRANCH/JAL 补 PC 相对偏移；看 .o 能看到未填的 0。' },
      { title: '动态链接靠表', html: 'PIC 通过 GOT 取地址、PLT 跳外部函数；延迟绑定把解析推迟到首次调用。' }
    ] },

    { t: 'checklist', id: 'ch06', items: [
      '我能说出 gcc 四个子程序与 .i/.s/.o/a.out 的对应关系',
      '我能用 readelf -S/-s 与 objdump -d/-r 读出节、符号与重定位',
      '我能解释为什么未初始化全局在 .bss，以及它为什么默认是 0',
      '我能诊断 undefined reference 的三种常见原因',
      '我能说明 R_RISCV_HI20 与 LO12 为什么要成对出现',
      '我能对比静态库与动态库的体积、升级、启动与地址差异',
      '我能画出 PLT → GOT → 真实函数 的调用链，并解释延迟绑定',
      '我能描述 execve 加载一个 ELF 时内核做了什么'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 CS:APP《Computer Systems: A Programmer\'s Perspective》第 7 章「链接」组织，并结合 CUHKSZ CSC3050 的 RISC-V 工具链（riscv64-unknown-elf）与 Docker 实验环境说明。ELF 节名、符号类型与 RISC-V 重定位名称以 GNU binutils 为准；不同教材对「弱符号/COMMON」的表述略有差异，本章按 C11 与 GCC 默认行为（-fno-common）讲解。动态链接的 GOT/PLT、延迟绑定与 RELRO 属系统编程常识，课程若未深入展开，以能读懂调用链为目标。加载部分以 32 位 RISC-V Linux 的典型布局为例，64 位与其它 OS 的地址数值不同，机制一致。' }
  ]
});
