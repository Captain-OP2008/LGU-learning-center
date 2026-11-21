/* =====================================================================
 * data/ch25.js · 第 25 章：布尔逻辑与数字电路
 * 职责：布尔函数与真值表、布尔代数与 DeMorgan、通用门集、从开关到门、
 *       decoder/mux/demux、和之积与 XOR/MAJ/ODD、加法器与 ALU、
 *       时序电路（锁存、寄存器、内存、时钟）、TOY-8 处理器与 CONTROL。
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5；示例输出均按 Java 语义推演核对。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch25',
  num: '25',
  title: '布尔逻辑与数字电路',
  en: 'Boolean Logic & Digital Circuits',
  goals: [
    '能把一个布尔函数写成真值表和积之和表达式，并说明为什么二元函数只有 16 个',
    '能用布尔代数律（含 DeMorgan）化简表达式，并解释 XOR 密码为什么能还原',
    '能说出通用门集的含义，并用 NAND 搭出 NOT/AND/OR',
    '能解释组合电路与时序电路的区别，画出 decoder、mux、demux 的输入输出关系',
    '能用 MAJ 与 ODD 搭出全加器，说明 n 位加法器的门数与进位链',
    '能描述 SR 锁存、寄存器、内存、时钟如何组成有记忆的电路，并说出 TOY-8 的模块与 fetch/execute 分工'
  ],
  kp: [
    { id: 'ch25-1', title: '布尔函数与真值表' },
    { id: 'ch25-2', title: '布尔代数与 DeMorgan' },
    { id: 'ch25-3', title: '通用门集' },
    { id: 'ch25-4', title: '从开关到门' },
    { id: 'ch25-5', title: '组合电路：decoder 与 mux' },
    { id: 'ch25-6', title: '和之积与 XOR/MAJ/ODD' },
    { id: 'ch25-7', title: '加法器与 ALU' },
    { id: 'ch25-8', title: '时序电路：锁存、寄存器、内存、时钟' },
    { id: 'ch25-9', title: 'TOY-8 处理器' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '前面三章，我们一直在「用」机器：写 Java、读机器码、用 Java 模拟 TOY。' +
      '可机器本身是什么？打开 CPU 的外壳，里面没有一行代码，只有电线和开关——' +
      '而它居然能执行程序、存数据、做判断。这一章就回答这个问题：' +
      '先建立<b>布尔逻辑</b>这套「0/1 的算术」，再用开关搭出<b>门</b>，用门搭出<b>加法器和多路选择器</b>，' +
      '最后加上<b>记忆和时钟</b>，拼出一台完整的 TOY-8 处理器。' +
      '学完你会发现：程序和数据最终都落成电信号，而「计算」就是电流按规则流动。' +
      '<br>本章路线：布尔函数 → 布尔代数 → 通用门 → 开关与门 → 组合电路 → 加法器 → 时序电路 → TOY-8 CPU。'
    },

    { t: 'h', text: '一、布尔函数与真值表', id: 'ch25-1' },

    { t: 'p', html:
      '<b>布尔函数（boolean function）</b>是最简单的函数：参数和返回值都只有 0 和 1（true/false）。' +
      '虽然简单，它却是数字电路的全部语言。三个基本运算：<code>NOT(x) = x\u2032</code>（取反）、' +
      '<code>AND(x, y) = xy</code>（都为 1 才为 1）、<code>OR(x, y) = x + y</code>（有一个 1 就是 1，注意 1+1=1）。' +
      '第四个常用的是 <code>XOR(x, y) = xy\u2032 + x\u2032y</code>（不同为 1，也叫异或）。' +
      'n 个变量的真值表有 2ⁿ 行，把每种输入组合的输出列出来，函数就被完全确定了。'
    },

    { t: 'table',
      head: ['x', 'y', 'AND', 'OR', 'XOR', 'NAND'],
      rows: [
        ['0', '0', '0', '0', '0', '1'],
        ['0', '1', '0', '1', '1', '1'],
        ['1', '0', '0', '1', '1', '1'],
        ['1', '1', '1', '1', '0', '0']
      ],
      caption: '四个常用二元函数的真值表。NAND 是 AND 取反；NOR 是 OR 取反，同样常用。' },

    { t: 'code', caption: 'Truth.java —— 打印四个门的真值表，并数一数二元布尔函数有多少个', code:
`public class Truth {
    static boolean and(boolean a, boolean b) { return a && b; }
    static boolean or(boolean a, boolean b) { return a || b; }
    static boolean xor(boolean a, boolean b) { return a ^ b; }
    static boolean nand(boolean a, boolean b) { return !(a && b); }

    public static void main(String[] args) {
        boolean[] v = {false, true};
        System.out.println("a b | and or xor nand");
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 2; j++) {
                boolean a = v[i];
                boolean b = v[j];
                System.out.println((a ? 1 : 0) + " " + (b ? 1 : 0) + " |  "
                    + (and(a, b) ? 1 : 0) + "   " + (or(a, b) ? 1 : 0) + "   "
                    + (xor(a, b) ? 1 : 0) + "   " + (nand(a, b) ? 1 : 0));
            }
        }
        int count = 0;
        for (int m = 0; m < 16; m++) {
            count++;
        }
        System.out.println("二元布尔函数个数 = " + count);
    }
}
` },

    { t: 'p', html:
      '最后一行的 16 不是随便来的：两个变量有 4 种输入组合，每种输出可以是 0 或 1，' +
      '所以共有 2⁴ = 16 个二元布尔函数。同理 3 变量 2⁸ = 256 个、4 变量 2¹⁶ 个、6 变量 2⁶⁴ 个——' +
      '变量一多数量爆炸，所以「真值表直接变电路」只适合小规模函数。' +
      '另外注意 <code>&amp;&amp;</code> 是短路布尔运算、<code>&amp;</code> 是按位运算，0/1 上结果相同。'
    },

    { t: 'keypoint', items: [
      { title: '真值表定义函数', html: 'n 个变量有 2ⁿ 行；只要两列输出完全相同，两个表达式就是同一个函数。' },
      { title: '函数数量是 2^(2ⁿ)', html: '二元 16 个、三元 256 个、四元 65536 个；变量一多，真值表法就不可行了。' }
    ] },

    { t: 'h', text: '二、布尔代数与 DeMorgan 律', id: 'ch25-2' },

    { t: 'p', html:
      '布尔代数（boolean algebra）是 0/1 世界的运算律，作用相当于代数里的「移项、合并同类项」：' +
      '它让我们在<b>不改变函数</b>的前提下把表达式变短、变简单。最常用的几条：' +
      '交换律 <code>xy = yx</code>、结合律 <code>x(yz) = (xy)z</code>、分配律 ' +
      '<code>x(y + z) = xy + xz</code>、同一律 <code>x + 0 = x</code>、<code>x·1 = x</code>、' +
      '零律 <code>x + 1 = 1</code>、<code>x·0 = 0</code>、互补律 <code>x + x\u2032 = 1</code>、' +
      '<code>xx\u2032 = 0</code>。其中最重要的两条是 <b>DeMorgan 律</b>：' +
      '<code>(xy)\u2032 = x\u2032 + y\u2032</code>，<code>(x + y)\u2032 = x\u2032y\u2032</code>——' +
      '「与的取反」等于「各自取反再或」，反之亦然。'
    },

    { t: 'table',
      head: ['名称', '表达式', '直觉'],
      rows: [
        ['交换律', 'xy = yx，x + y = y + x', '顺序无关'],
        ['结合律', 'x(yz) = (xy)z', '分组无关'],
        ['分配律', 'x(y + z) = xy + xz', '与对或分配'],
        ['同一律', 'x + 0 = x，x·1 = x', '0/1 是单位元'],
        ['零律', 'x + 1 = 1，x·0 = 0', '1/0 吸收一切'],
        ['DeMorgan', '(xy)\u2032 = x\u2032 + y\u2032；(x + y)\u2032 = x\u2032y\u2032', '取反穿过括号要换运算']
      ],
      caption: '布尔代数常用律。DeMorgan 是把电路从「与或」形式改成「或与」形式的钥匙。' },

    { t: 'code', caption: 'BoolAlgebra.java —— 用穷举验证 DeMorgan 两式，再用 XOR 做一次一次性密码本', code:
`public class BoolAlgebra {
    public static void main(String[] args) {
        boolean[] v = {false, true};
        boolean ok = true;
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 2; j++) {
                boolean a = v[i];
                boolean b = v[j];
                if (!(a && b) != (!a || !b)) {
                    ok = false;
                }
                if (!(a || b) != (!a && !b)) {
                    ok = false;
                }
            }
        }
        System.out.println("DeMorgan 两式对所有输入成立: " + ok);

        String m = "1011";
        String k = "0110";
        String c = "";
        String d = "";
        for (int i = 0; i < m.length(); i++) {
            char mc = m.charAt(i);
            char kc = k.charAt(i);
            char cc = (mc == kc) ? '0' : '1';
            c = c + cc;
            char dc = (cc == kc) ? '0' : '1';
            d = d + dc;
        }
        System.out.println("密文 c = " + c);
        System.out.println("解密 = " + d);
    }
}
` },

    { t: 'p', html:
      '输出三行：DeMorgan 成立（<code>true</code>）、密文 <code>1101</code>、解密回 <code>1011</code>。' +
      '第二段是 XOR 密码：明文 m 与密钥 k 逐位异或得到密文 c，再与同一密钥异或就还原——' +
      '因为 <code>(m ⊕ k) ⊕ k = m ⊕ (k ⊕ k) = m ⊕ 0 = m</code>，用的正是结合律、互补律和同一律。' +
      '这个性质在工程里到处都是：奇偶校验、哈希、加密、甚至交换两个变量（<code>a ^= b; b ^= a; a ^= b;</code>）' +
      '都靠 XOR。'
    },

    { t: 'h', text: '三、通用门集：一种门就能搭出所有电路', id: 'ch25-3' },

    { t: 'p', html:
      '既然布尔函数可以用 AND/OR/NOT 写出来，那么用这三种门就能搭出任意电路——这样的集合叫' +
      '<b>通用门集（universal gate set）</b>。更神奇的是，只用 <b>NAND</b> 一种门也能做到：' +
      '<code>NOT(x) = NAND(x, x)</code>，<code>AND(x,y) = NOT(NAND(x,y))</code>，' +
      '<code>OR(x,y) = NAND(NOT x, NOT y)</code>。NOR 同理也是通用的。' +
      '反过来，<code>{AND, OR}</code> 不通用（做不出取反），<code>{AND, XOR}</code> 也不通用' +
      '（全 0 输入只能得 0，造不出常量 1）。芯片厂商偏爱 NAND：一种门反复用，工艺简单、成本低。'
    },

    { t: 'code', caption: 'Gates.java —— 只用 NAND 搭出 NOT、AND、OR，并打印真值表', code:
`public class Gates {
    static boolean nand(boolean a, boolean b) { return !(a && b); }
    static boolean not(boolean a) { return nand(a, a); }
    static boolean and(boolean a, boolean b) { return not(nand(a, b)); }
    static boolean or(boolean a, boolean b) { return nand(not(a), not(b)); }

    public static void main(String[] args) {
        boolean[] v = {false, true};
        System.out.println("a b | not(a) and or");
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 2; j++) {
                boolean a = v[i];
                boolean b = v[j];
                System.out.println((a ? 1 : 0) + " " + (b ? 1 : 0) + " |   "
                    + (not(a) ? 1 : 0) + "     " + (and(a, b) ? 1 : 0) + "   "
                    + (or(a, b) ? 1 : 0));
            }
        }
    }
}
` },

    { t: 'table',
      head: ['门集', '是否通用', '原因'],
      rows: [
        ['{AND, OR, NOT}', '是', '直接对应积之和'],
        ['{NAND}', '是', 'NAND 可搭出 NOT/AND/OR'],
        ['{NOR}', '是', 'NOR 可搭出 NOT/OR/AND'],
        ['{AND, OR}', '否', '无法取反'],
      ],
      caption: '通用门集对照。判断不通用通常用「守恒性质」：某个性质在门里保持，但目标函数不满足。' },

    { t: 'h', text: '四、从开关到门：电路的最底层', id: 'ch25-4' },

    { t: 'p', html:
      '门的下面是什么？是<b>受控开关（controlled switch）</b>。一根导线要么通电（1）要么不通（0）；' +
      '一个开关有三个端：输入、输出、控制端。把开关接成「控制端为 0 时导通、为 1 时断开」，' +
      '输出就正好是输入的取反——这就是 NOT 门。把两个这样的开关并联，只要有一个控制端为 0 就导通，' +
      '输出就是 OR；串联就是 AND。早期的继电器、真空管，后来的晶体管，扮演的都是这个「受控开关」。' +
      '1937 年 Shannon 的硕士论文指出：布尔代数可以直接描述开关电路——从此「逻辑设计」成了一门工程。'
    },

    { t: 'svg', maxW: 720, caption: '用三个开关搭出的 OR 门：A、B 任一为 0，就有一条通路给 C 的输入供电，输出 1。', html:
`<svg viewBox="0 0 720 300" role="img" aria-label="用三个开关搭出 OR 门">
  <line x1="40" y1="60" x2="680" y2="60" stroke="var(--line2)" stroke-width="2" />
  <text x="40" y="44" fill="var(--text3)" font-size="12">电源 1</text>
  <line x1="120" y1="60" x2="120" y2="120" stroke="var(--line2)" />
  <line x1="120" y1="120" x2="240" y2="120" stroke="var(--line)" stroke-dasharray="6 4" />
  <text x="128" y="112" fill="var(--text3)" font-size="12">A</text>
  <line x1="240" y1="120" x2="240" y2="60" stroke="var(--line2)" />
  <line x1="300" y1="60" x2="300" y2="120" stroke="var(--line2)" />
  <line x1="300" y1="120" x2="420" y2="120" stroke="var(--line)" stroke-dasharray="6 4" />
  <text x="308" y="112" fill="var(--text3)" font-size="12">B</text>
  <line x1="420" y1="120" x2="420" y2="60" stroke="var(--line2)" />
  <line x1="480" y1="60" x2="480" y2="170" stroke="var(--line2)" />
  <rect x="440" y="170" width="80" height="50" fill="var(--surface2)" stroke="var(--accent)" />
  <text x="452" y="200" fill="var(--accent)" font-size="13">C 开关</text>
  <line x1="480" y1="220" x2="480" y2="260" stroke="var(--line2)" />
  <circle cx="480" cy="264" r="6" fill="var(--accent)" />
  <text x="494" y="270" fill="var(--text2)" font-size="13">输出 = A\u2032 + B\u2032 = (AB)\u2032</text>
  <text x="40" y="290" fill="var(--text3)" font-size="12">A、B 都断开（=1）时，C 的控制端才没有电；否则总有一条通路。</text>
</svg>` },

    { t: 'h', text: '五、组合电路：decoder、mux 与 demux', id: 'ch25-5' },

    { t: 'p', html:
      '由门组成的网络叫<b>电路（circuit）</b>。如果网络里没有回路，输出只由当前输入决定，' +
      '就叫<b>组合电路（combinational circuit）</b>——加法器、比较器、多路选择器都属于这一类。' +
      '三个最常用的积木：<b>decoder</b>（n 个输入 → 2ⁿ 条输出，只有被选中的那条为 1，叫 one-hot）、' +
      '<b>demux</b>（1 路输入按地址分到 2ⁿ 条输出之一）、<b>mux</b>（2ⁿ 路输入按地址选 1 路输出）。' +
      'mux 的经典实现是「每个输入配一个广义 AND 门，再用一条竖直的 OR 收集」：' +
      '地址经 decoder 变成 one-hot，保证只有一个 AND 门被打开。'
    },

    { t: 'p', html:
      '这套「one-hot + AND + OR」的结构就是布尔函数的标准电路：<b>积之和（sum-of-products）</b>。' +
      '真值表每个输出为 1 的行对应一个「输入组合的 AND」项（minterm），全部或起来即得函数；' +
      'Boole 1847 年就证明任意布尔函数都能写成积之和，于是「真值表 → 电路」有机械步骤。' +
      '缺点是规模指数增长：64 输入 MAJ 要 2⁶³ 个门，4 位 demux 用真值表要 200 万行，而 17 个门就够。'
    },

    { t: 'h', text: '六、和之积实战：XOR、MAJ 与 ODD', id: 'ch25-6' },

    { t: 'p', html:
      '两个三变量函数特别有用。<b>MAJ(x, y, z)</b> 是「多数表决」：至少两个输入为 1 时输出 1，' +
      '表达式是 <code>x\u2032yz + xy\u2032z + xyz\u2032 + xyz</code>，恰好是 4 个 minterm。' +
      '<b>ODD(x, y, z)</b> 是「奇校验」：输入里 1 的个数为奇数时输出 1，' +
      '表达式是 <code>x\u2032y\u2032z + x\u2032yz\u2032 + xy\u2032z\u2032 + xyz</code>，也是 4 个 minterm。' +
      '两者结构对称，各用 4 个三输入 AND 加一个 OR，共 5 个门。' +
      '为什么它们重要？因为一个全加器的「进位」正好是 MAJ，「本位和」正好是 ODD——' +
      '把两个函数并排，就得到了加法器。'
    },

    { t: 'code', caption: 'SumOfProducts.java —— 用 minterm 实现 MAJ 与 ODD：输出 8 行，两者各有 4 行为 1', code:
`public class SumOfProducts {
    static boolean maj(boolean x, boolean y, boolean z) {
        boolean m0 = !x && y && z;
        boolean m1 = x && !y && z;
        boolean m2 = x && y && !z;
        boolean m3 = x && y && z;
        return m0 || m1 || m2 || m3;
    }

    static boolean odd(boolean x, boolean y, boolean z) {
        boolean m0 = !x && !y && z;
        boolean m1 = !x && y && !z;
        boolean m2 = x && !y && !z;
        boolean m3 = x && y && z;
        return m0 || m1 || m2 || m3;
    }

    public static void main(String[] args) {
        boolean[] v = {false, true};
        int majOnes = 0;
        int oddOnes = 0;
        System.out.println("x y z | maj odd");
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 2; j++) {
                for (int k = 0; k < 2; k++) {
                    boolean x = v[i];
                    boolean y = v[j];
                    boolean z = v[k];
                    boolean m = maj(x, y, z);
                    boolean o = odd(x, y, z);
                    if (m) majOnes++;
                    if (o) oddOnes++;
                    System.out.println((x ? 1 : 0) + " " + (y ? 1 : 0) + " " + (z ? 1 : 0)
                        + " |  " + (m ? 1 : 0) + "   " + (o ? 1 : 0));
                }
            }
        }
        System.out.println("MAJ 为 1 的行数 = " + majOnes + ", ODD 为 1 的行数 = " + oddOnes);
    }
}
` },

    { t: 'h', text: '七、加法器与 ALU：从一位到 n 位', id: 'ch25-7' },

    { t: 'p', html:
      '一位全加器（full adder）有三个输入：<code>x</code>、<code>y</code>、进位 <code>c</code>，' +
      '两个输出：和 <code>z</code> 与向高位的进位。公式很干净：' +
      '<code>z = ODD(x, y, c)</code>，<code>c′ = MAJ(x, y, c)</code>。' +
      '把 n 个全加器串起来（低位进位接高位）就是 <b>ripple-carry adder</b>：' +
      '2n+1 个输入、n+1 个输出、8n 个广义 AND 和 2n 个 OR——4 位 40 门，32 位 320 门。' +
      '缺点是进位逐位传、越宽越慢；现代 CPU 用<b>超前进位</b>并行算进位，把延迟压到 log 级。'
    },

    { t: 'svg', maxW: 720, caption: '一位全加器：MAJ 产生进位，ODD 产生本位和；两个门共享同一组输入。', html:
`<svg viewBox="0 0 720 300" role="img" aria-label="一位全加器结构">
  <rect x="30" y="40" width="90" height="40" fill="var(--surface2)" stroke="var(--line)" />
  <text x="46" y="65" fill="var(--text2)" font-size="13">x</text>
  <rect x="30" y="100" width="90" height="40" fill="var(--surface2)" stroke="var(--line)" />
  <text x="46" y="125" fill="var(--text2)" font-size="13">y</text>
  <rect x="30" y="160" width="90" height="40" fill="var(--surface2)" stroke="var(--line)" />
  <text x="46" y="185" fill="var(--text2)" font-size="13">c（进位入）</text>
  <line x1="120" y1="60" x2="220" y2="60" stroke="var(--line2)" />
  <line x1="120" y1="120" x2="220" y2="120" stroke="var(--line2)" />
  <line x1="120" y1="180" x2="220" y2="180" stroke="var(--line2)" />
  <rect x="220" y="40" width="120" height="60" fill="var(--accentSoft)" stroke="var(--accent)" />
  <text x="240" y="75" fill="var(--accent)" font-size="13">MAJ</text>
  <rect x="220" y="140" width="120" height="60" fill="var(--surface2)" stroke="var(--line)" />
  <text x="240" y="175" fill="var(--text2)" font-size="13">ODD</text>
  <line x1="340" y1="70" x2="480" y2="70" stroke="var(--line2)" />
  <line x1="340" y1="170" x2="480" y2="170" stroke="var(--line2)" />
  <text x="492" y="74" fill="var(--text2)" font-size="13">进位出 c\u2032</text>
  <text x="492" y="174" fill="var(--text2)" font-size="13">本位和 z</text>
  <text x="220" y="240" fill="var(--text3)" font-size="12">进位链：c\u2032 接下一个全加器的 c，n 个串起来就是 n 位加法器。</text>
  <text x="220" y="264" fill="var(--text3)" font-size="12">z = ODD(x,y,c) = x⊕y⊕c；c\u2032 = MAJ(x,y,c) = xy + xc + yc。</text>
</svg>` },

    { t: 'code', caption: 'Adder.java —— 用 MAJ 与 ODD 实现 4 位 ripple-carry 加法：0101 + 0110 = 1011', code:
`public class Adder {
    static int maj(int x, int y, int c) {
        return (x + y + c >= 2) ? 1 : 0;
    }

    static int odd(int x, int y, int c) {
        return (x + y + c) % 2;
    }

    public static void main(String[] args) {
        int[] x = {1, 0, 1, 0};
        int[] y = {0, 1, 1, 0};
        int[] z = new int[4];
        int c = 0;
        for (int i = 0; i < 4; i++) {
            z[i] = odd(x[i], y[i], c);
            c = maj(x[i], y[i], c);
        }
        System.out.print("和 = ");
        for (int i = 3; i >= 0; i--) {
            System.out.print(z[i]);
        }
        System.out.println(" 进位 c4 = " + c);
    }
}
` },

    { t: 'table',
      head: ['电路', '输入', '输出', '门数（广义 AND + OR）'],
      rows: [
        ['4 位加法器', '9 位（x、y、c0）', '5 位（z、c4）', '40'],
        ['32 位加法器', '65 位', '33 位', '320'],
        ['8 位 ALU（TOY-8）', '2 个 8 位 + 3 条控制线', '1 个 8 位', '每位 MAJ/ODD/XOR/AND + mux'],
        ['3-way 8 位 bus mux', '3 个 8 位 + 3 条选择线', '1 个 8 位', '8 个 3-way mux']
      ],
      caption: '加法器与 ALU 的规模。ALU 把加法、异或、与运算并排做出来，再用 mux 按控制线选一个结果。' },

    { t: 'h', text: '八、时序电路：让电路记住东西', id: 'ch25-8' },

    { t: 'p', html:
      '组合电路没有记忆：输入一变，输出立刻跟着变。要存数据，必须让输出<b>反过来影响输入</b>——' +
      '也就是引入反馈。最简单的是 <b>SR 锁存（SR latch）</b>：两个 NOR 门交叉耦合，' +
      'S 端置 1 把输出置 1，R 端置 1 把输出清 0，之后即使 S、R 都回到 0，输出也保持不变。' +
      '（S、R 不能同时为 1，否则进入竞争状态。）在锁存外面加一层控制，' +
      '就成了<b>寄存器位（register bit）</b>：<code>S = write AND input</code>、' +
      '<code>R = write AND (NOT input)</code>，write 脉冲一来就写入，之后一直保持。' +
      'n 个寄存器位并联，就是 n 位寄存器；m 位地址 + demux 选写、mux 选读，就是一块内存。' +
      '有反馈的电路统称<b>时序电路（sequential circuit）</b>，它的输出依赖输入的历史。'
    },

    { t: 'svg', maxW: 700, caption: 'SR 锁存：两个 NOR 门交叉耦合，Q 与 Q\u2032 互相维持，形成 1 bit 记忆。', html:
`<svg viewBox="0 0 700 300" role="img" aria-label="SR 锁存交叉耦合结构">
  <rect x="180" y="50" width="120" height="70" fill="var(--surface2)" stroke="var(--line)" />
  <text x="210" y="90" fill="var(--text2)" font-size="14">NOR</text>
  <rect x="180" y="170" width="120" height="70" fill="var(--surface2)" stroke="var(--line)" />
  <text x="210" y="210" fill="var(--text2)" font-size="14">NOR</text>
  <line x1="40" y1="70" x2="180" y2="70" stroke="var(--line2)" />
  <text x="40" y="58" fill="var(--text3)" font-size="12">R</text>
  <line x1="40" y1="210" x2="180" y2="210" stroke="var(--line2)" />
  <text x="40" y="198" fill="var(--text3)" font-size="12">S</text>
  <line x1="300" y1="85" x2="380" y2="85" stroke="var(--accent)" />
  <text x="392" y="90" fill="var(--accent)" font-size="13">Q</text>
  <line x1="300" y1="205" x2="380" y2="205" stroke="var(--accent)" />
  <text x="392" y="210" fill="var(--accent)" font-size="13">Q\u2032</text>
  <line x1="340" y1="85" x2="340" y2="150" stroke="var(--line)" stroke-dasharray="5 4" />
  <line x1="340" y1="150" x2="200" y2="150" stroke="var(--line)" stroke-dasharray="5 4" />
  <line x1="200" y1="150" x2="200" y2="205" stroke="var(--line)" stroke-dasharray="5 4" />
  <line x1="340" y1="205" x2="470" y2="205" stroke="var(--line)" stroke-dasharray="5 4" />
  <line x1="470" y1="205" x2="470" y2="120" stroke="var(--line)" stroke-dasharray="5 4" />
  <line x1="470" y1="120" x2="300" y2="120" stroke="var(--line)" stroke-dasharray="5 4" />
  <line x1="300" y1="120" x2="300" y2="85" stroke="var(--line)" stroke-dasharray="5 4" />
  <text x="180" y="270" fill="var(--text3)" font-size="12">虚线是反馈：Q 参与 Q\u2032 的输入，Q\u2032 又参与 Q 的输入，于是状态被锁住。</text>
</svg>` },

    { t: 'table',
      head: ['模块', '构成', '记忆能力'],
      rows: [
        ['SR 锁存', '2 个 NOR 交叉耦合', '1 bit，S/R 控制'],
        ['寄存器位', '锁存 + write 控制', '1 bit，写脉冲载入'],
        ['n 位寄存器', 'n 个寄存器位并联', 'n bit，共享 write'],
        ['内存（m×n）', 'demux 选写 + mux 选读', '2^m 个字 × n bit'],
        ['时钟', '寄存器位 + 反相输入', '产生 fetch/execute 节拍']
      ],
      caption: '时序模块一览。内存 = 寄存器阵列 + 地址选择，是「有记忆的组合电路」。' },

    { t: 'p', html:
      '最后是<b>时钟（clock）</b>：它周期性地输出「平时 0、短暂 1」的脉冲，给整个系统定节拍。' +
      '用一个寄存器位、把 clock 接到 write、输入取反，就得到一个每来一个脉冲翻转一次的触发器；' +
      '它的输出当 execute，反相当 fetch。于是每个时钟周期分两段：' +
      '<b>fetch</b> 阶段把 PC 指向的指令装入 IR，<b>execute</b> 阶段执行 IR。' +
      '教材对时钟做了两个理想假设：脉冲足够长能触发开关，周期长于最长开关链——' +
      '真实芯片靠「加速到出错再退一点」来标定主频，这就是超频的物理基础。'
    },

    { t: 'h', text: '九、TOY-8 处理器：把模块连成 CPU', id: 'ch25-9' },

    { t: 'p', html:
      '现在把积木拼起来。<b>TOY-8</b> 是教材设计的迷你 CPU：8 位字、16 字内存、1 个寄存器。' +
      '它由 <b>7 个模块</b>组成：ALU、寄存器 R（8 位）、指令寄存器 IR（8 位）、程序计数器 PC（4 位）、' +
      '内存（16×8）、时钟、纯组合逻辑的 <b>CONTROL</b>。模块之间用<b>总线（bus）</b>连，' +
      '两条 <b>bus mux</b> 决定数据流向：R mux 在「ALU 结果 / IR 地址位 / 内存输出」里选一个写回 R；' +
      'MA mux 在「PC / IR 地址位」里选一个作为内存地址。全机共 <b>10 条总线、16 条控制线</b>。' +
      'CONTROL 只用 2 个 demux + 5 个门，就能把 8 条指令翻译成各模块的控制信号。'
    },

    { t: 'table',
      head: ['机器码', '指令', '动作'],
      rows: [
        ['0x', 'halt', '停机'],
        ['2a', 'add', 'R = R + M[a]'],
        ['4a', 'xor', 'R = R xor M[a]'],
        ['6a', 'and', 'R = R and M[a]'],
        ['8a', 'load address', 'R = a（8 位地址）'],
        ['Aa', 'load', 'R = M[a]'],
        ['Ca', 'store', 'M[a] = R'],
        ['Ea', 'branch if zero', 'R == 0 时 PC = a']
      ],
      caption: 'TOY-8 指令集：3 位 opcode + 1 位恒 0 + 4 位地址，机器码恒为偶数。内存 F 接标准输入输出。' },

    { t: 'code', run: false, caption: 'TOY-8 求和程序（机器码，1–B）——R=0，循环读入并累加，最后输出（非 Java · 静态阅读）', code:
`1: A0   R <- M[0]        // R = 0
2: CE   M[E] <- R        // 累加器清零
3: AF   R <- stdin       // 读一个数
4: E9   if R == 0 goto 9 // 读到 0 结束
5: 2E   R <- R + M[E]    // 累加
6: CE   M[E] <- R
7: A0   R <- M[0]        // R 清零，准备判断
8: E3   if R == 0 goto 3 // 无条件跳回读入
9: AE   R <- M[E]        // 取累加结果
A: CF   stdout <- R      // 输出
B: 00   halt` },

    { t: 'svg', maxW: 760, caption: 'TOY-8 数据通路：7 个模块、2 个 bus mux、16 条控制线；CONTROL 是唯一的纯组合模块。', html:
`<svg viewBox="0 0 760 380" role="img" aria-label="TOY-8 处理器数据通路">
  <rect x="40" y="40" width="120" height="50" fill="var(--surface2)" stroke="var(--line)" />
  <text x="62" y="70" fill="var(--text2)" font-size="13">PC (4 位)</text>
  <rect x="40" y="120" width="120" height="50" fill="var(--surface2)" stroke="var(--line)" />
  <text x="62" y="150" fill="var(--text2)" font-size="13">IR (8 位)</text>
  <rect x="40" y="200" width="120" height="50" fill="var(--surface2)" stroke="var(--line)" />
  <text x="62" y="230" fill="var(--text2)" font-size="13">R (8 位)</text>
  <rect x="40" y="280" width="120" height="50" fill="var(--surface2)" stroke="var(--line)" />
  <text x="62" y="310" fill="var(--text2)" font-size="13">内存 16×8</text>
  <rect x="300" y="150" width="110" height="60" fill="var(--surface2)" stroke="var(--line)" />
  <text x="318" y="186" fill="var(--text2)" font-size="13">MA mux</text>
  <rect x="300" y="250" width="110" height="60" fill="var(--surface2)" stroke="var(--line)" />
  <text x="318" y="286" fill="var(--text2)" font-size="13">R mux</text>
  <rect x="520" y="40" width="130" height="60" fill="var(--surface2)" stroke="var(--line)" />
  <text x="548" y="76" fill="var(--text2)" font-size="13">ALU</text>
  <rect x="520" y="200" width="130" height="70" fill="var(--accentSoft)" stroke="var(--accent)" />
  <text x="536" y="228" fill="var(--accent)" font-size="13">CONTROL</text>
  <text x="536" y="250" fill="var(--text3)" font-size="11">2 demux + 5 门</text>
  <line x1="160" y1="65" x2="300" y2="65" stroke="var(--line2)" />
  <line x1="300" y1="65" x2="300" y2="150" stroke="var(--line2)" />
  <line x1="160" y1="145" x2="260" y2="145" stroke="var(--line2)" />
  <line x1="260" y1="145" x2="260" y2="120" stroke="var(--line2)" />
  <line x1="260" y1="120" x2="300" y2="120" stroke="var(--line2)" />
  <line x1="410" y1="180" x2="500" y2="180" stroke="var(--line2)" />
  <line x1="500" y1="180" x2="500" y2="300" stroke="var(--line2)" />
  <line x1="410" y1="280" x2="520" y2="280" stroke="var(--line2)" />
  <line x1="160" y1="225" x2="300" y2="225" stroke="var(--line2)" />
  <line x1="300" y1="225" x2="300" y2="250" stroke="var(--line2)" />
  <line x1="650" y1="70" x2="700" y2="70" stroke="var(--line2)" />
  <line x1="700" y1="70" x2="700" y2="310" stroke="var(--line2)" />
  <line x1="160" y1="305" x2="700" y2="305" stroke="var(--line2)" stroke-dasharray="5 4" />
  <text x="40" y="356" fill="var(--text3)" font-size="12">实线是数据总线，虚线是控制线；fetch 阶段 MA mux 选 PC，execute 阶段按 opcode 走不同通路。</text>
</svg>` },

    { t: 'p', html:
      '真值表只有几行，但门一旦连起来，行为就不是一眼能看穿的了。' +
      '这台实验台先给你一个逻辑门，再让你把两个门拼成半加器——拨动 A、B，看输出和真值表里的高亮行。'
    },

    { t: 'lab', id: 'logic' },

    { t: 'keypoint', items: [
      { title: '布尔函数与门', html: 'n 变量真值表 2ⁿ 行；AND/OR/NOT/XOR 是基本门，NAND/NOR 各自通用。' },
      { title: '积之和', html: '每个输出为 1 的行造一个 minterm（广义 AND），全部 OR 起来；MAJ 与 ODD 各 4 个 minterm。' },
      { title: '全加器', html: 'z = ODD(x,y,c)、c\u2032 = MAJ(x,y,c)；n 位 ripple-carry 需 8n 个 AND、2n 个 OR。' },
      { title: '时序 = 反馈', html: 'SR 锁存用交叉耦合 NOR 存 1 bit；寄存器位加 write；内存 = demux 选写 + mux 选读。' },
      { title: 'TOY-8 结构', html: '7 模块 + 2 bus mux + 10 条总线 + 16 条控制线；CONTROL 仅 2 demux + 5 门。' }
    ] },

    { t: 'quiz', qid: 'ch25-q1' },

    { t: 'quiz', qid: 'ch25-q2' },

    { t: 'checklist', id: 'ch25', items: [
      '我能写出任意二元布尔函数的真值表，并解释为什么只有 16 个二元函数',
      '我能用 DeMorgan 律把一个表达式改写成等价形式，并说明每一步用了哪条律',
      '我能用 NAND 搭出 NOT、AND、OR，并判断一个门集是否通用',
      '我能解释受控开关如何变成 NOT 门，以及 OR/AND 如何由开关串并联得到',
      '我能说出组合电路与时序电路的区别，并各举一个例子',
      '我能画出 decoder、mux、demux 的输入输出关系，说明 one-hot 的作用',
      '我能用 minterm 写出 MAJ 与 ODD，并解释它们为什么正好组成全加器',
      '我能说明 n 位 ripple-carry 加法器的门数与进位延迟，以及超前进位的动机',
      '我能描述 SR 锁存、寄存器位、内存、时钟如何组合出「记忆」',
      '我能说出 TOY-8 的 7 个模块、2 个 bus mux 和 fetch/execute 两阶段的分工'
    ] },

    { t: 'p', html:
      '延伸阅读：教材第 7 章 §7.1–§7.5 的电路图与练习（7.4 的锁存、计数器、LFSR 习题尤其值得做）；' +
      '想动手可用 Logisim、Digital 把本章的加法器和 TOY-8 画出来；' +
      '想深入可读 Patterson &amp; Hennessy《Computer Organization and Design》第 2–4 章。' +
      '本章测验入口：<a href="#/quiz/ch25">ch25 题库</a>。'
    },

    { t: 'h', text: '三章之后：从 bit 到完整的计算机', id: 'ch25-next' },

    { t: 'p', html:
      'ch23 把 bit 解释成数字，ch24 把数字组织成程序，ch25 把程序落成电路。' +
      '三章连起来，你已经走完了「信息 → 指令 → 机器」的完整链条：' +
      '同一串 16 个 0/1，可以是 8+5 的结果、可以是一条 add 指令、也可以是几个开关的导通状态。' +
      '继续往下走，就是操作系统、编译器、体系结构这些更专门的课程；' +
      '但无论走多远，<b>抽象层次</b>这个视角都会一直有用——每一层都只暴露必要的接口，把复杂性藏起来。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '数字电路特别适合让 AI 陪你练：① 给它真值表，你写积之和，再让它检查；' +
      '② 让它用 NAND 设计 3 输入 MAJ，你数门数并和本章的 4 个 AND + OR 比较；' +
      '③ 问它「为什么 S、R 不能同时为 1」，看它能否从 NOR 反馈结构讲清楚。' +
      'AI 很容易在门数、minterm 编号上出错，正好用真值表逐行核对。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：布尔函数与真值表、布尔代数与 DeMorgan、通用门集、受控开关与门、组合电路（decoder/mux/demux）、积之和、MAJ/ODD、全加器与 ALU、时序电路（SR 锁存、寄存器位、内存、时钟）、TOY-8 处理器与 CONTROL。<br>依据：教材第 7 章 §7.1（Boolean Logic）、§7.2（Basic Circuit Model）、§7.3（Combinational Circuits）、§7.4（Sequential Circuits）、§7.5（TOY-8 Processor）；本站为个人整理的学习材料，与课程要求冲突时以老师和课程大纲为准；代码示例按 Java 语义推演核对。' }

  ]
});
