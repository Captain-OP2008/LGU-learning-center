/* =====================================================================
 * data/ch24.js · 第 24 章：机器语言与 TOY 虚拟机
 * 职责：函数调用约定、参数与返回值、标准输入输出与纸带、数组与间接寻址、
 *       TOY 虚拟机的 Java 实现、汇编器/解释器/编译器、存储程序与自修改代码、
 *       TOY 家族与规模、机器语言为什么还值得学。
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5；示例输出均按 Java 语义推演核对。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch24',
  num: '24',
  title: '机器语言与 TOY 虚拟机',
  en: 'Machine-Language Programming & the TOY VM',
  goals: [
    '能说出函数调用要完成的四个动作，并解释 R[F] 返回地址的作用',
    '能读懂带 FFxx 调用、EF00 返回的 TOY 程序，说明参数与返回值放在哪里',
    '能解释 TOY 标准输入输出为什么用内存地址 FF，以及 0000 作为结束标记的含义',
    '能用 Java 实现一个 TOY 虚拟机，按取指—译码—执行循环跑通一个小程序',
    '能区分汇编器、解释器、编译器和虚拟机，并说明 JVM 的 bytecode 属于哪一类',
    '能说清存储程序、自修改代码与病毒的关系，并用 TOY-8/64、Apollo 等规模数字建立「机器大小」的直觉'
  ],
  kp: [
    { id: 'ch24-1', title: '函数调用的四个动作' },
    { id: 'ch24-2', title: '参数、返回值与寄存器约定' },
    { id: 'ch24-3', title: '标准输入输出与纸带' },
    { id: 'ch24-4', title: '数组、链表与间接寻址' },
    { id: 'ch24-5', title: '虚拟机的状态与执行循环' },
    { id: 'ch24-6', title: '汇编器、解释器与编译器' },
    { id: 'ch24-7', title: '存储程序与自修改代码' },
    { id: 'ch24-8', title: '从 TOY 到真实机器' },
    { id: 'ch24-9', title: '机器语言为什么还值得学' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '上一章我们把 bit 拼成了数字，又用 16 条指令拼出了一台 256 字的 TOY 机器。' +
      '但真正的程序不会只有「8 + 5」这么短：它要调用函数、读输入、存数组、做循环，' +
      '最后还要能把自己装进内存跑起来。这一章就补上这几块拼图：' +
      '<b>调用约定</b>让函数能借出控制权再还回来，<b>纸带 I/O</b>让机器能和外界交换数据，' +
      '<b>数组与间接寻址</b>让程序能处理一批数据，而<b>虚拟机</b>则把这些规则写成一段 Java 代码——' +
      '当你能用 Java 模拟一台机器时，「机器」就不再是黑盒了。' +
      '<br>本章路线：函数调用 → 寄存器约定 → 纸带 I/O → 数组 → 虚拟机 → 汇编器/解释器/编译器 → 存储程序 → 规模。' +
      '读的时候记住一句话：<b>机器语言里没有「调用函数」这种高级动作，只有「把返回地址存起来、跳过去、再跳回来」</b>——' +
      '所有高级语言的控制流，最后都翻译成这几步。'
    },

    { t: 'h', text: '一、函数调用：把控制权借出去', id: 'ch24-1' },

    { t: 'p', html:
      '高级语言里写 <code>gcd(195, 273)</code>，编译器要替你做四件事：' +
      '<b>①</b> 把控制权转移到函数入口；<b>②</b> 把参数传进去；<b>③</b> 把返回值带回来；' +
      '<b>④</b> 回到调用点之后继续执行。TOY 只有 16 条指令，没有 <code>call</code>，' +
      '所以它用两条指令配合完成：<code>FFxx</code>（jump and link）先把<b>下一条指令的地址</b>存进 ' +
      '<code>R[F]</code>，再跳到 <code>xx</code>；函数结束时用 <code>EF00</code>（jump register）' +
      '跳到 <code>R[F]</code> 保存的地址，控制权就还回去了。'
    },

    { t: 'code', run: false, caption: '素数测试程序（TOY 汇编，30–3C）——调用子程序求余，返回地址存在 R[F]（非 Java · 静态阅读）', code:
`30: 7101   R1 <- 0001       // 默认结果：是素数
31: 75FF   R5 <- 00FF       // 输出通道地址
32: 7901   R9 <- 0001       // 调用者保存的除数
33: 2C59   R[C] <- R[5] - R[9]
34: CC3B   if R[C] == 0 goto 3B
35: 1991   R[9] <- R[9] + R[1]   // 除数 +1
36: 1A09   R[A] <- R[0] + R[9]
37: 8B3D   R[B] <- M[3D]          // 取 n
38: FF22   call 22               // 求余子程序，返回地址写入 R[F]
39: 2AA1   R[A] <- R[A] - R[1]
3A: CA33   if R[A] == 0 goto 33   // 余数为 0：不是素数
3B: 9B3E   M[3E] <- R[B]          // 把结果写到输出字
3C: 0000   halt
3D: 005B   n = 91` },

    { t: 'p', html:
      '注意 <code>FF22</code> 执行时，<code>R[F]</code> 里存的是 <code>0039</code>——不是 38，' +
      '因为 PC 在取指后已经自增了。子程序最后的 <code>EF00</code> 把 PC 设成 <code>R[F]</code>，' +
      '于是从 39 继续。这个「先存返回地址、再跳」的模式，在真实 CPU 上叫 <b>call/return</b>，' +
      '在 RISC-V 里是 <code>jal</code>/<code>jalr</code>，在 x86 里是 <code>call</code>/<code>ret</code>——' +
      '换汤不换药。'
    },

    { t: 'keypoint', items: [
      { title: '调用 = 存返回地址 + 跳转', html: '<code>FFxx</code> 把 PC 存入 <code>R[F]</code> 再跳到 <code>xx</code>；<code>EF00</code> 跳回 <code>R[F]</code>。返回地址是「下一条指令」，不是调用指令本身。' },
      { title: '返回地址是唯一的', html: 'TOY 只有 16 个寄存器，<code>R[F]</code> 只存一层返回地址；嵌套调用必须自己把旧地址压到内存里——这就是栈的雏形。' }
    ] },

    { t: 'h', text: '二、参数、返回值与寄存器约定', id: 'ch24-2' },

    { t: 'p', html:
      '寄存器是稀缺资源，所以调用双方要约定好谁负责什么。TOY 教材里的约定是：' +
      '<code>R[A]</code> 和 <code>R[B]</code> 传参数、<code>R[C]</code> 放中间结果、' +
      '<code>R[F]</code> 存返回地址，其余寄存器由<b>调用者自己保存</b>（caller-saved）——' +
      '如果调用者还需要 <code>R[9]</code> 的值，就在调用前把它挪到内存里。' +
      '真实机器把这条约定写进 ABI（application binary interface）：x86-64 用 rdi、rsi、rdx… 传参，' +
      '返回值放 rax；ARM 用 x0–x7 传参、x0 放返回值。'
    },

    { t: 'table',
      head: ['寄存器', 'TOY 约定用途', '谁负责保存'],
      rows: [
        ['R[0]', '恒为 0000（不是普通寄存器）', '硬件固定'],
        ['R[A] / R[B]', '函数参数、返回值', '调用者与被调用者协商'],
        ['R[C]', '中间结果（如求余的余数）', '被调用者'],
        ['R[F]', '返回地址', '调用指令自动写入'],
        ['R[1]–R[9]', '普通计算', '调用者（caller-saved）']
      ],
      caption: 'TOY 的寄存器约定。R[0] 恒为 0 让「无条件跳转」「与 0 比较」都能用同一条指令完成。' },

    { t: 'p', html:
      '为什么 <code>R[0]</code> 必须恒为 0？因为这样 <code>C0xx</code> 就是无条件跳转' +
      '（<code>R[0] == 0</code> 永远成立），<code>1A00</code> 就是把 <code>R[A]</code> 原样复制到别处。' +
      '少一个专用指令，就能把 16 条指令的编码空间省下来——这是指令集设计里典型的「用数据换指令」。' +
      '下面这段斐波那契程序把参数放在 <code>R[A]</code>、<code>R[B]</code>，把输出交给 <code>R[9]</code>，' +
      '你能看出它用了哪些约定吗？'
    },

    { t: 'code', run: false, caption: '斐波那契（TOY 汇编，40–4C）——循环 12 次，每次把 F(i) 打到纸带（非 Java · 静态阅读）', code:
`40: 7101   R1 <- 0001
41: 7A00   R[A] <- 0000       // a = 0
42: 7B01   R[B] <- 0001       // b = 1
43: 894C   R[9] <- M[4C]      // 循环次数 = 12
44: C94B   if R[9] == 0 goto 4B
45: 9AFF   M[FF] <- R[A]      // 输出 a
46: 1CAB   R[C] <- R[A] + R[B]
47: 1AB0   R[A] <- R[B]
48: 1BC0   R[B] <- R[C]
49: 2991   R[9] <- R[9] - R[1]
4A: C044   if R[0] == 0 goto 44
4B: 0000   halt
4C: 000C   count = 12` },

    { t: 'h', text: '三、标准输入输出：内存里的纸带', id: 'ch24-3' },

    { t: 'p', html:
      'TOY 没有键盘、没有屏幕，它的 I/O 是一条纸带（paper tape）：程序从纸带读数字，' +
      '把结果打到纸带上。模拟器用一个特殊约定实现它——<b>内存地址 FF 就是 I/O 端口</b>：' +
      '执行 <code>9AFF</code>（store 到 FF）时，<code>R[A]</code> 的值被打印出来；' +
      '执行 <code>8AFF</code>（load 自 FF）时，从纸带读下一个数放进 <code>R[A]</code>。' +
      '读输入时约定 <code>0000</code> 表示「没有更多数据」，所以循环可以写成「读一个、是 0 就退出」。'
    },

    { t: 'code', caption: 'HexEcho.java —— 模拟纸带 I/O：把十六进制数逐个回显，遇到 0000 停止', code:
`public class HexEcho {
    public static void main(String[] args) {
        for (int i = 0; i < args.length; i++) {
            int v = Integer.parseInt(args[i], 16);
            if (v == 0) {
                break;
            }
            System.out.printf("%04X%n", v);
        }
    }
}
`, args: ['0008', '0005', '0000'] },

    { t: 'p', html:
      '运行参数 <code>0008 0005 0000</code> 时输出两行 <code>0008</code>、<code>0005</code>：' +
      '前两个数被回显，第三个 0 触发结束。注意这里和 TOY 的对应关系——' +
      '数组 <code>args</code> 扮演纸带，<code>printf("%04X")</code> 扮演「往 FF 写一个字」，' +
      '而 <code>0000</code> 是双方约定的终止符。真实系统里这个终止符可能是 EOF、换行或长度前缀，' +
      '本质都是「用某个特殊值表示数据结束」。'
    },

    { t: 'h', text: '四、数组、链表与间接寻址', id: 'ch24-4' },

    { t: 'p', html:
      'TOY 的一条指令只有 8 位地址，所以数组不能用「基址 + 下标」直接寻址，而要分两步：' +
      '先用 <code>7d</code>（load address）把数组地址装进寄存器，再用 <code>A</code>（load indirect）' +
      '或 <code>B</code>（store indirect）通过寄存器里的地址读写。教材还给数组定了一个标准格式：' +
      '<b>长度存在数组末尾</b>，数组地址指向「长度字」；这样 <code>a[0]</code> 在 <code>M[addr]</code>、' +
      '<code>a[n-1]</code> 在 <code>M[addr+n-1]</code>，长度在 <code>M[addr+n]</code>。' +
      '链表和二叉树也照这个思路：节点用连续几个字表示，指针就是「另一个节点的地址」，' +
      '<code>0000</code> 当 null。'
    },

    { t: 'svg', maxW: 760, caption: 'TOY 的 256 字内存布局：00–0F 留给 boot/dump，10–5F 放程序，60–FE 放数据，FF 是 I/O 端口。', html:
`<svg viewBox="0 0 760 330" role="img" aria-label="TOY 256 字内存布局">
  <rect x="40" y="24" width="300" height="44" fill="var(--surface2)" stroke="var(--line)" />
  <text x="52" y="52" fill="var(--text2)" font-size="13">00 – 0F</text>
  <text x="150" y="52" fill="var(--text3)" font-size="12">boot / dump 保留区</text>
  <rect x="40" y="76" width="300" height="44" fill="var(--surface2)" stroke="var(--line)" />
  <text x="52" y="104" fill="var(--text2)" font-size="13">10 – 5F</text>
  <text x="150" y="104" fill="var(--text3)" font-size="12">程序与函数（80 字）</text>
  <rect x="40" y="128" width="300" height="44" fill="var(--surface2)" stroke="var(--line)" />
  <text x="52" y="156" fill="var(--text2)" font-size="13">60 – FE</text>
  <text x="150" y="156" fill="var(--text3)" font-size="12">数据、数组、链表、栈</text>
  <rect x="40" y="180" width="300" height="44" fill="var(--accentSoft)" stroke="var(--accent)" />
  <text x="52" y="208" fill="var(--accent)" font-size="13">FF</text>
  <text x="150" y="208" fill="var(--text2)" font-size="12">标准输入 / 输出端口</text>
  <line x1="370" y1="40" x2="370" y2="250" stroke="var(--line2)" stroke-dasharray="4 4" />
  <text x="400" y="60" fill="var(--text2)" font-size="13">每个地址 = 16 bit</text>
  <rect x="400" y="76" width="320" height="34" fill="none" stroke="var(--line)" />
  <text x="410" y="98" fill="var(--text3)" font-size="12">bit 15 … bit 12 | bit 11 … 8 | bit 7 … 4 | bit 3 … 0</text>
  <text x="400" y="150" fill="var(--text2)" font-size="13">一条指令 = 4 个 hex 位</text>
  <text x="400" y="176" fill="var(--text3)" font-size="12">RR 格式：op | d | s | t</text>
  <text x="400" y="200" fill="var(--text3)" font-size="12">A  格式：op | d | addr（8 bit）</text>
  <text x="400" y="236" fill="var(--text3)" font-size="12">地址 00 起是代码，60 起是数据——同一块内存，两种用法。</text>
  <text x="40" y="280" fill="var(--text3)" font-size="12">地址只有 8 位 ⇒ 最多 256 字；程序和数据必须挤在一起。</text>
  <text x="40" y="302" fill="var(--text3)" font-size="12">这也是后来机器把地址位加宽、把「代码段/数据段」分开的原因。</text>
</svg>` },

    { t: 'code', run: false, caption: '读数组程序（TOY 汇编，60–6D）——用 8CFF 读长度、A 格式间接访问元素（非 Java · 静态阅读）', code:
`60: 8AFF   R[A] <- stdin      // 读数组长度 n
61: 8BFF   R[B] <- stdin      // 读第一个元素
62: 7101   R1 <- 0001
63: 7900   R9 <- 0000        // 下标 i = 0
64: 22B9   R[2] <- R[B] - R[9]
65: C26B   if R[2] == 0 goto 6B
66: 1CA9   R[C] <- R[A] + R[9]
67: 8DFF   R[D] <- stdin      // 读下一个元素
68: BD0C   M[R[C]] <- R[D]    // 间接 store：a[i] = 值
69: 1991   R[9] <- R[9] + R[1]
6A: C064   if R[0] == 0 goto 64
6B: 1AA9   R[A] <- R[A] + R[9]
6C: BB0A   M[R[B]] <- R[A]    // 末尾写入长度字
6D: EF00   return` },

    { t: 'h', text: '五、虚拟机：用软件造一台机器', id: 'ch24-5' },

    { t: 'p', html:
      '虚拟机（virtual machine）不是什么玄学：它就是一个「有内存数组、寄存器数组、PC 变量，' +
      '循环执行取指—译码—执行」的普通程序。TOY 的状态只有三样：' +
      '<code>int[] M = new int[256]</code>、<code>int[] R = new int[16]</code>、<code>int PC</code>。' +
      '每轮循环做四步：取 <code>IR = M[PC]</code>、<code>PC++</code>、把 IR 拆成 op/d/s/t/addr、' +
      '按 op 执行；执行完把结果截回 16 位、把 <code>R[0]</code> 清零。就这么几十行，' +
      '一台图灵机式的机器就活了。'
    },

    { t: 'code', caption: 'MiniVM.java —— 50 行的 TOY 虚拟机：装载程序、跑完、打印结果', code:
`public class MiniVM {
    static int[] M = new int[256];
    static int[] R = new int[16];
    static int PC;

    static void run() {
        while (true) {
            int IR = M[PC];
            PC = (PC + 1) & 0xFF;
            int op = (IR >> 12) & 0xF;
            int d = (IR >> 8) & 0xF;
            int s = (IR >> 4) & 0xF;
            int t = IR & 0xF;
            int addr = IR & 0xFF;
            if (op == 0) return;
            if (op == 1) R[d] = R[s] + R[t];
            else if (op == 2) R[d] = R[s] - R[t];
            else if (op == 3) R[d] = R[s] & R[t];
            else if (op == 4) R[d] = R[s] ^ R[t];
            else if (op == 7) R[d] = addr;
            else if (op == 8) R[d] = M[addr];
            else if (op == 9) M[addr] = R[d];
            else if (op == 10) R[d] = M[R[t] & 0xFF];
            else if (op == 11) M[R[t] & 0xFF] = R[d];
            else if (op == 12) { if ((short) R[d] == 0) PC = addr; }
            else if (op == 13) { if ((short) R[d] > 0) PC = addr; }
            else if (op == 14) PC = R[d] & 0xFF;
            else if (op == 15) { R[d] = PC; PC = addr; }
            R[d] = R[d] & 0xFFFF;
            R[0] = 0;
        }
    }

    public static void main(String[] args) {
        String[] prog = {"10:8A15", "11:8B16", "12:1CAB", "13:9C17", "14:0000", "15:0008", "16:0005"};
        for (int i = 0; i < prog.length; i++) {
            String[] p = prog[i].split(":");
            M[Integer.parseInt(p[0], 16)] = Integer.parseInt(p[1], 16);
        }
        PC = 0x10;
        run();
        System.out.printf("M[17] = %04X%n", M[0x17]);
    }
}
` },

    { t: 'p', html:
      '程序 10:8A15 是「R[A] ← M[15]」，11:8B16 是「R[B] ← M[16]」，12:1CAB 做加法，' +
      '13:9C17 把结果存到 17，14 停机。输出 <code>M[17] = 000D</code>，也就是 8 + 5 = 13。' +
      '注意虚拟机里 <code>(short) R[d]</code> 的强制转换：Java 的 int 是 32 位，' +
      '而 TOY 的分支要按 16 位补码判断正负，不转成 short 就会把 <code>FFFF</code> 当成 65535。' +
      '这个细节说明：<b>模拟一台机器，本质是精确复刻它的类型宽度和边界行为</b>。'
    },

    { t: 'keypoint', items: [
      { title: '虚拟机 = 状态 + 循环', html: 'TOY 的状态只有 <code>M[256]</code>、<code>R[16]</code>、<code>PC</code>；执行循环是「取指 → PC++ → 译码 → 执行 → 掩码」。' },
      { title: '宽度决定语义', html: '每一步运算后都要 <code>& 0xFFFF</code>，分支比较前要转 <code>(short)</code>；宽度错了，<code>FFFF</code> 就会从 −1 变成 65535。' }
    ] },

    { t: 'h', text: '六、汇编器、解释器与编译器', id: 'ch24-6' },

    { t: 'p', html:
      '手写四位十六进制太痛苦，于是有了<b>汇编器（assembler）</b>：它把助记符翻译成机器码。' +
      '<code>lda R2 15</code> → <code>7215</code>，<code>add R2 R2 R3</code> → <code>1223</code>。' +
      '汇编器和编译器只差一个层次：汇编是「一条助记符 ↔ 一条机器指令」的一一对应，' +
      '编译是「一条高级语句 → 若干条机器指令」。而<b>解释器（interpreter）</b>不生成机器码，' +
      '它直接读源码或字节码，边读边执行——慢一些，但能交互、能跨平台。' +
      '<b>虚拟机</b>则把「机器」本身用软件实现：JVM 执行的是 javac 生成的 bytecode，' +
      '同一份 bytecode 在 Windows、macOS、Linux 上都能跑，靠的就是各平台的 JVM 各写一遍。'
    },

    { t: 'code', caption: 'Assemble.java —— 极简汇编器：把 5 条助记符翻成 TOY 机器码', code:
`public class Assemble {
    static String op(String m) {
        if (m.equals("halt")) return "0";
        if (m.equals("add")) return "1";
        if (m.equals("sub")) return "2";
        if (m.equals("and")) return "3";
        if (m.equals("xor")) return "4";
        if (m.equals("lda")) return "7";
        if (m.equals("ld")) return "8";
        if (m.equals("st")) return "9";
        return "?";
    }

    public static void main(String[] args) {
        String[] src = {"lda R2 15", "ld R3 15", "add R2 R2 R3", "st R2 17", "halt"};
        int addr = 0x10;
        for (int i = 0; i < src.length; i++) {
            String[] p = src[i].split(" ");
            String code = op(p[0]);
            if (p.length == 4) {
                code = code + p[1].substring(1) + p[2].substring(1) + p[3].substring(1);
            } else if (p.length == 3) {
                code = code + p[1].substring(1) + p[2];
            } else {
                code = code + "000";
            }
            System.out.println(Integer.toHexString(addr).toUpperCase() + ": " + code.toUpperCase());
            addr++;
        }
    }
}
` },

    { t: 'table',
      head: ['工具', '输入', '输出', '执行方式', '典型代表'],
      rows: [
        ['汇编器', '汇编源码', '机器码', '离线翻译，逐条对应', 'nasm、gas'],
        ['编译器', '高级语言源码', '机器码 / 字节码', '离线翻译，可优化', 'javac、gcc'],
        ['解释器', '源码 / 字节码', '不生成目标文件', '边读边执行', 'Python 解释器、JVM 解释模式'],
        ['虚拟机', '字节码 / 中间码', '由 VM 解释或 JIT 执行', '软件模拟一台机器', 'JVM、.NET CLR']
      ],
      caption: '四类工具的分工。JVM 同时具备解释器和 JIT 编译器：热点代码会被编译成本地机器码。' },

    { t: 'quiz', qid: 'ch24-q1' },

    { t: 'h', text: '七、存储程序：代码即数据', id: 'ch24-7' },

    { t: 'p', html:
      'TOY 最深刻的一点是：<b>指令和数据存在同一块内存里，长得一模一样</b>。' +
      '冯·诺依曼 1945 年的 EDVAC 报告把这个想法写成了现代计算机的默认架构。' +
      '它带来两个后果。好处是程序可以像数据一样被读取、搬运、修改——' +
      '下面的 boot 程序从纸带读入一段程序放进内存，最后一条 <code>EA00</code> 把控制权交给它：' +
      '刚装进来的「数据」立刻变成「指令」。坏处是：既然程序能修改自己，' +
      '它也能被恶意数据修改。'
    },

    { t: 'code', run: false, caption: 'boot 程序（TOY 汇编，02–0D）——读纸带装入内存，EA00 把控制权交给刚装入的程序（非 Java · 静态阅读）', code:
`02: 8AFF   R[A] <- stdin       // 读程序起始地址
03: 8BFF   R[B] <- stdin       // 读程序长度
04: 7101   R1 <- 0001
05: 7900   R9 <- 0000
06: 22B9   R[2] <- R[B] - R[9]
07: C20D   if R[2] == 0 goto 0D
08: 1CA9   R[C] <- R[A] + R[9]
09: 8DFF   R[D] <- stdin       // 读一条指令
0A: BD0C   M[R[C]] <- R[D]     // 存进内存
0B: 1991   R[9] <- R[9] + R[1]
0C: C006   if R[0] == 0 goto 06
0D: EA00   jump R[A]           // 数据变指令：开始执行刚装入的程序` },

    { t: 'p', html:
      '教材里有一个著名的反面例子：把 21 个字的数组装到地址 50 开始的地方，' +
      '它会覆盖 60–6D 处的读数组程序；程序跑到最后开始执行被写入的数据，' +
      '陷入一个永远输出 8888 的死循环。这就是 C 语言缓冲区溢出（buffer overflow）的原型：' +
      '输入长度没检查，数据越界写进了代码区。更麻烦的是，' +
      '停机问题（halting problem）不可判定，所以<b>不存在一个能判定任意程序是不是病毒的通用程序</b>——' +
      '杀毒软件只能靠特征、行为、沙箱去猜。'
    },

    { t: 'callout', kind: 'warn', title: '只读教材示例，不要运行未知纸带', html:
      '本章的 boot/dump、自修改程序都是教材里的<b>静态示例</b>，用来理解原理。' +
      '现实中不要执行来源不明的机器码或脚本：它可能覆盖内存、写文件、联网。' +
      'TOY 的模拟器只影响一个数组，但真实机器的「数组」是你的整个系统。' +
      '沙箱、权限最小化、输入校验，都是从这个教训里长出来的工程实践。'
    },

    { t: 'quiz', qid: 'ch24-q2' },

    { t: 'h', text: '八、从 TOY 到真实机器：规模与兼容', id: 'ch24-8' },

    { t: 'p', html:
      'TOY 只有 256 字内存、16 个寄存器、16 条指令。把它放大是什么样？' +
      '教材给了一个思维实验：<b>TOY-64</b> 用 64 位字，其中 40 位当地址、20 位当寄存器编号，' +
      '于是能寻址超过 68 亿个字、拥有超过 25 万个寄存器，一条指令要写成 16 个 hex 位。' +
      '同一个 64 位字 <code>40544F592D363421</code>，可以解释成一个巨大的整数、' +
      '一串字符 <code>@TOY-64!</code>，也可以解释成一条「把两个寄存器异或后存回」的指令——' +
      '这再次说明：<b>位的含义由解释方式决定</b>。另一个方向是 <b>TOY-8</b>：' +
      '8 位字、32 字内存、1 个寄存器，小到可以在纸上画出每一个开关，' +
      '正好用来在下一章展示「一台完整的 CPU 是怎么连出来的」。'
    },

    { t: 'table',
      head: ['机器', '字长', '内存', '寄存器', '状态规模', '用途'],
      rows: [
        ['TOY', '16 位', '256 字', '16 个', '约 4 千 bit', '教学：指令集与机器语言'],
        ['TOY-8', '8 位', '32 字', '1 个', '2²⁵⁶ 种', '教学：用门电路画出完整 CPU'],
        ['TOY-64', '64 位', '>68 亿字', '>25 万个', '极大', '思维实验：规模放大'],
        ['Apollo 导航计算机', '16 位', '1024 字', '少量', '—', '真实历史：登月舱计算机'],
        ['现代 CPU', '64 位', 'GB 级', '数百个', '—', '通用计算']
      ],
      caption: '规模对比。阿波罗导航计算机的内存只有 1,024 个 16 位字，约等于 4 台 TOY。' },

    { t: 'code', caption: 'Toy64.java —— 同一个 64 位字的三种解释（本站引擎不支持 64 位十六进制字面量 · 静态阅读）', run: false, code:
`public class Toy64 {
    public static void main(String[] args) {
        long word = 0x40544F592D363421L;
        System.out.println("hex   = " + Long.toHexString(word).toUpperCase());
        System.out.println("dec   = " + word);
        StringBuilder sb = new StringBuilder();
        for (int i = 7; i >= 0; i--) {
            sb.append((char) ((word >> (8 * i)) & 0xFF));
        }
        System.out.println("chars = " + sb);
    }
}
` },

    { t: 'p', html:
      '现代机器还加了几个 TOY 没有的机制：<b>虚拟内存</b>让每个程序都以为自己独占一大片地址空间，' +
      '操作系统在背后把虚拟地址翻译成物理地址；<b>缓存</b>把常用的数据放在离 CPU 更近的地方；' +
      '<b>流水线</b>让多条指令重叠执行。但抽象层次没变：门 → 模块 → CPU → 指令集 → 程序。' +
      '你在这三章学的「从开关到虚拟机」，就是这条链的完整缩影。'
    },

    { t: 'h', text: '九、机器语言为什么还值得学', id: 'ch24-9' },

    { t: 'p', html:
      '日常写 Java 当然不用机器语言，但理解它至少有三份回报。' +
      '<b>第一，性能直觉</b>：知道一次数组越界检查、一次装箱、一次虚方法调用最后变成多少条指令，' +
      '才能判断热点在哪里。<b>第二，调试能力</b>：空指针、栈溢出、整数溢出、并发可见性，' +
      '这些问题的根都在「内存和寄存器的行为」里，看懂字节码和汇编能少猜很多。' +
      '<b>第三，迁移能力</b>：新语言、新虚拟机层出不穷（JVM、CLR、WASM、Lua VM），' +
      '它们的设计思想高度相似——状态、指令、栈、调用约定。学会一台，其余都能快速上手。' +
      '更重要的是，当你亲手用 Java 写出 MiniVM，你就完成了从「使用计算机」到「理解计算机」的一步。'
    },

    { t: 'p', html:
      '读懂了 MiniVM，不如亲手走一遍。这台实验台把本章的两段 TOY 程序装进 256 格内存，' +
      '单步执行「取指—译码—执行」，PC、寄存器和内存会同时亮起来。'
    },

    { t: 'lab', id: 'toyvm' },

    { t: 'keypoint', items: [
      { title: '调用约定', html: '<code>FFxx</code> 存返回地址、<code>EF00</code> 返回；参数放 <code>R[A]</code>/<code>R[B]</code>，返回地址放 <code>R[F]</code>，其余由调用者保存。' },
      { title: 'I/O 是约定', html: '内存 FF 是输入输出端口，<code>9AFF</code> 输出、<code>8CFF</code> 输入，<code>0000</code> 表示结束。' },
      { title: '虚拟机三件套', html: '内存数组 + 寄存器数组 + PC，循环执行「取指—译码—执行—掩码」即可模拟一台机器。' },
      { title: '工具链层次', html: '汇编器一一对应翻译；编译器一对多翻译并可优化；解释器边读边执行；虚拟机用软件实现指令集。' },
      { title: '存储程序的两面', html: '代码即数据带来灵活（boot、dump、JIT），也带来风险（自修改、缓冲区溢出、病毒）。' }
    ] },

    { t: 'quiz', qid: 'ch24-q3' },

    { t: 'checklist', id: 'ch24', items: [
      '我能说出函数调用要完成的四个动作，并解释 <code>R[F]</code> 为什么存的是「下一条指令」的地址',
      '我能读懂一段带 <code>FFxx</code>/<code>EF00</code> 的 TOY 汇编，指出参数和返回值在哪里',
      '我能解释 TOY 为什么用内存地址 FF 做 I/O，以及 0000 结束标记的作用',
      '我能说明 TOY 数组「长度在末尾、地址指向长度字」的格式，并用间接指令访问元素',
      '我能用 Java 写出 TOY 虚拟机的取指—译码—执行循环，并说清为什么要掩码到 16 位',
      '我能区分汇编器、解释器、编译器和虚拟机，并说出 JVM bytecode 的位置',
      '我能解释 boot 程序的 <code>EA00</code> 为什么体现了「数据变指令」',
      '我能说明自修改代码与缓冲区溢出、停机问题、病毒检测之间的关系',
      '我能用 TOY-8/TOY-64/Apollo 的数字描述「机器规模」的差异',
      '我能说出至少三个「学机器语言对写 Java 有帮助」的具体场景'
    ] },

    { t: 'p', html:
      '延伸阅读：教材《Computer Science: An Interdisciplinary Approach》第 6 章 §6.3–§6.4 的完整程序清单与练习；' +
      '配套站点 booksite 上的 TOY 模拟器可以直接装载 <code>.toy</code> 文件单步执行；' +
      '想继续深入可以读 Patterson &amp; Hennessy 的《Computer Organization and Design》前四章。' +
      '本章的测验入口：<a href="#/quiz/ch24">ch24 题库</a>。'
    },

    { t: 'h', text: '下一章：布尔逻辑与数字电路', id: 'ch24-next' },

    { t: 'p', html:
      '到目前为止，我们一直把「机器」当成一个会执行指令的黑盒。下一章要打开它：' +
      '用开关搭出 NOT/OR/AND 门，用门搭出 decoder、mux、加法器，' +
      '再用触发器、寄存器、内存和时钟搭出一个能跑的 TOY-8 处理器。' +
      '到那时你会发现，<b>这台机器里没有一行「代码」，只有电线和开关——而它依然能执行程序</b>。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '让 AI 帮你做三件事：① 让它把一段 TOY 汇编逐行翻译成 Java，你再用 MiniVM 对照运行结果；' +
      '② 给它一段自修改程序，问它「这段程序会覆盖哪几条指令」，看它能不能算清楚地址；' +
      '③ 让它解释 JVM 的字节码和 TOY 指令的异同，然后你自己判断哪些说法站得住。' +
      '注意 AI 很容易在「地址算错一位」「把 FF 当普通数据」这类细节上出错——正好用本章的规则去检查它。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：机器语言编程（函数调用、参数与返回值、纸带 I/O、数组与间接寻址）、TOY 虚拟机的 Java 实现、汇编器/解释器/编译器、存储程序与自修改代码、TOY 家族与规模。<br>依据：教材第 6 章 §6.3（Machine-Language Programming）与 §6.4（TOY Virtual Machine）；Sedgewick &amp; Wayne 配套站点。本站为个人整理的学习材料，与课程要求冲突时以老师和课程大纲为准；代码示例按 Java 语义推演核对，未依赖教材库。' }

  ]
});
