/* =====================================================================
 * data/ch23.js · 第 23 章：信息表示与 TOY 机器
 * 职责：bit 与字长、二进制/十六进制、Java 进制转换、无符号范围与溢出、
 *       补码、IEEE 754 浮点、位运算与掩码、TOY 的组成与指令格式、
 *       第一个 TOY 程序、自修改代码与存储程序思想。
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5；Java 示例输出均逐行核对。
 * 覆盖教材 §6.1–6.2（ch06.txt L26–1544）。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch23',
  num: '23',
  title: '信息表示与 TOY 机器',
  en: 'Representing Information & the TOY Machine',
  goals: [
    '能把二进制、十六进制、十进制互相转换，并解释「每 4 个 bit 一组」的来历',
    '能说清 n 位无符号整数与补码的范围，判断一次加法是否溢出',
    '会用 Java 的 parseInt/toString 与位运算完成进制转换、取位和符号扩展',
    '能拆开一个 32 位 float 的符号、指数、尾数，并手算一个小数的编码',
    '能读懂 TOY 的 16 位指令，写出「8 + 5」「欧几里得」这类小程序'
  ],
  kp: [
    { id: 'ch23-1', title: 'bit 与字长' },
    { id: 'ch23-2', title: '二进制与十六进制' },
    { id: 'ch23-3', title: 'Java 的进制转换' },
    { id: 'ch23-4', title: '无符号范围与溢出' },
    { id: 'ch23-5', title: '补码：负数怎么存' },
    { id: 'ch23-6', title: 'IEEE 754 浮点数' },
    { id: 'ch23-7', title: '位运算与掩码' },
    { id: 'ch23-8', title: 'TOY 的组成' },
    { id: 'ch23-9', title: 'TOY 指令格式' },
    { id: 'ch23-10', title: '第一个 TOY 程序' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '同一串 16 个 0/1，可以是一个整数、一个负数、一个浮点数、一条机器指令，甚至两个 ASCII 字符——' +
      '<b>位本身没有含义，含义来自解释方式</b>。这一章先解决「同一堆 bit 怎么解释成整数和小数」，' +
      '再把视角拉远：一台完整的计算机（教材虚构的 TOY 机器）如何用 16 位字、256 个内存字和 16 个寄存器' +
      '执行「读入、相加、存回、停机」这样一串指令。学完你会明白：Java 里的 <code>short</code> 为什么是 −32768 到 32767，' +
      '<code>0xFFFF</code> 为什么既可能是 65535 也可能是 −1，以及一条机器指令到底长什么样。'
    },

    { t: 'h', text: '一、bit 与字长：计算机的最小积木', id: 'ch23-1' },

    { t: 'p', html:
      '一个 <b>bit</b>（二进制位）只有 0 和 1 两种状态。一个 bit 能表达的信息很少，所以硬件把若干个 bit 组成一个' +
      '<b>字（word）</b>，一次读、写、运算一整字。字长（word size）是计算机的基本参数：' +
      '早期机器用过 12 位、16 位，后来的 PC 是 32 位，今天常见 64 位。字长决定了整数能表示多大、' +
      '地址能指向多少内存，也决定了一条指令能塞下多少信息。<br>' +
      'Java 把常用字长直接写进了类型：<code>byte</code> 8 位、<code>short</code> 16 位、<code>int</code> 32 位、' +
      '<code>long</code> 64 位。写 <code>int x = 5;</code> 时，内存里其实是一个 32 位的字，' +
      '内容是 <code>00000000 00000000 00000000 00000101</code>。后面所有「范围」「溢出」「补码」的规则，' +
      '都是从这个固定宽度推出来的。记住：<b>同一串 bit，按补码解释与按无符号解释会得到不同的数</b>。'
    },

    { t: 'table',
      head: ['Java 类型', '位数', '补码范围', '无符号视角的范围'],
      rows: [
        ['<code>byte</code>', '8', '−128 … 127', '0 … 255'],
        ['<code>short</code>', '16', '−32768 … 32767', '0 … 65535'],
        ['<code>int</code>', '32', '−2147483648 … 2147483647', '0 … 4294967295'],
        ['<code>long</code>', '64', '约 ±9.22×10¹⁸', '0 … 1.84×10¹⁹']
      ],
      caption: '同一串 bit，按补码解释得到左列，按无符号解释得到右列；Java 的整数类型都是有符号补码' },

    { t: 'h', text: '二、二进制与十六进制：位置记数法', id: 'ch23-2' },

    { t: 'p', html:
      '十进制里 <code>64206</code> 的意思是 6×10⁴ + 4×10³ + 2×10² + 0×10 + 6。二进制只是把底数换成 2：' +
      '<code>1100011</code> = 1×2⁶ + 1×2⁵ + 0 + 0 + 0 + 1×2 + 1 = 64 + 32 + 2 + 1 = 99。' +
      '这就是<b>位置记数法（positional notation）</b>：每一位的权重是底数的幂，从右往左依次升高。<br>' +
      '二进制写起来太长，所以用十六进制（hex）当缩写：<b>每 4 个 bit 正好对应 1 个 hex 位</b>（因为 2⁴ = 16）。' +
      '把 <code>1CAB</code> 展开就是 <code>0001 1100 1010 1011</code>；反过来把二进制从右往左每 4 位切一段，' +
      '每段换成 0–F 即可。<code>FACE</code> = 1111 1010 1100 1110 = 64206，这是教材里反复出现的例子。<br>' +
      '四个方向各记一个例子：<b>二进制 → hex</b> 把 <code>1100011</code> 补零切成 <code>0110 0011</code> 即 63；' +
      '<b>hex → 二进制</b> 把 <code>1CAB</code> 展开为 0001 1100 1010 1011；<b>hex → 十进制</b> <code>FACE</code> = 64206；' +
      '<b>十进制 → 二进制</b> 不断除 2、记录余数、倒着读，109 → <code>1101101</code>。'
    },

    { t: 'code', caption: 'Bases.java —— 三种进制互转：内置 API 与手写递归对照', code:
`public class Bases {
    static char digit(int d) {
        return (char) (d < 10 ? '0' + d : 'A' + d - 10);
    }

    // 递归版：先写出高位，再补当前最低位
    static String toBase(int n, int base) {
        if (n < base) {
            return String.valueOf(digit(n));
        }
        return toBase(n / base, base) + digit(n % base);
    }

    public static void main(String[] args) {
        System.out.println(Integer.parseInt("1100011", 2));   // 99
        System.out.println(Integer.parseInt("FACE", 16));     // 64206
        System.out.println(Integer.toHexString(64206));       // face
        System.out.println(Integer.toBinaryString(109));      // 1101101
        System.out.println(toBase(64206, 16));                // FACE
        System.out.println(toBase(109, 2));                   // 1101101
    }
}
` },

    { t: 'p', html:
      '注意两个细节：<code>Integer.toHexString</code> 输出<b>小写</b>（<code>face</code>），而手写版本用大写；' +
      '<code>toBase</code> 的递归顺序是「先除、后取余」，所以高位先写、低位后写——这正是位置记数法的自然写法。' +
      '如果写成「先取余再递归」，得到的会是反过来的字符串。'
    },

    { t: 'h', text: '三、Java 的进制转换：parseInt 与 toString', id: 'ch23-3' },

    { t: 'p', html:
      '<code>Integer.parseInt(s, radix)</code> 把任意进制的字符串读成 int；<code>Integer.toString(n, radix)</code>' +
      '把 int 写成任意进制的字符串。教材里还有一个三参数版本 <code>toString(n, radix, width)</code>，' +
      '用来补足前导 0（例如把 15 写成 4 位 hex 的 <code>000F</code>）。Java 标准库没有这个三参数版本，' +
      '自己补一个循环即可。'
    },

    { t: 'code', caption: 'Convert.java —— 补前导 0：000F、11111111、FACE、FFFFFFFB', code:
`public class Convert {
    static String toBase(int n, int base, int width) {
        String s = Integer.toString(n, base).toUpperCase();
        while (s.length() < width) {
            s = "0" + s;
        }
        return s;
    }

    public static void main(String[] args) {
        System.out.println(toBase(15, 16, 4));      // 000F
        System.out.println(toBase(255, 2, 8));      // 11111111
        System.out.println(toBase(64206, 16, 4));   // FACE
        System.out.println(Integer.toHexString(-5).toUpperCase()); // FFFFFFFB
    }
}
` },

    { t: 'p', html:
      '最后一行值得停一下：<code>-5</code> 按 32 位补码展开是 <code>FFFFFFFB</code>（8 个 hex 位），' +
      '宽度 4 补不了也截不了，所以原样输出。这说明 <b>进制转换不改变 bit，只改变写法</b>；' +
      '负数的「十六进制长相」由补码决定，而不是由进制本身决定。'
    },

    { t: 'h', text: '四、无符号范围与溢出', id: 'ch23-4' },

    { t: 'p', html:
      'n 位无符号整数能表示 0 到 2ⁿ − 1：8 位最大 255，16 位最大 65535。超出范围时不会报错，' +
      '而是<b>回绕（wrap around）</b>：最高位进位被丢掉，结果又从小数开始。这既是硬件省掉溢出检查的代价，' +
      '也是很多 bug 的来源——数组下标算错、循环条件写错，都会以「莫名其妙的负数」出现。'
    },

    { t: 'code', caption: 'Range.java —— 范围、回绕与 Math.abs 的例外', code:
`public class Range {
    public static void main(String[] args) {
        System.out.println("8-bit unsigned max = " + ((1 << 8) - 1));    // 255
        System.out.println("16-bit unsigned max = " + ((1 << 16) - 1));  // 65535
        System.out.println("16-bit signed max = " + 32767);              // 32767
        System.out.println("16-bit signed min = " + (-32768));           // -32768

        int s = 32767;
        s = s + 1;
        if (s > 32767) s -= 65536;              // 模拟 16 位回绕
        System.out.println("32767 + 1 = " + s); // -32768

        System.out.println(Math.abs(Integer.MIN_VALUE)); // -2147483648
    }
}
` },

    { t: 'p', html:
      '注意 <code>Math.abs(Integer.MIN_VALUE)</code> 仍是负数：<code>-2147483648</code> 的相反数' +
      '<code>2147483648</code> 超出了 int 的范围，取负后回绕回自己。这是「补码范围不对称」的直接后果：' +
      '负数比正数多一个（−32768 有，+32768 没有），所以对最小值取负永远没有正确的正数结果。'
    },

    { t: 'h', text: '五、补码：负数怎么存', id: 'ch23-5' },

    { t: 'p', html:
      '最朴素的想法是「最高位当符号位，其余位存绝对值」，但这样会带来 +0 和 −0 两个零，加法还要分情况。' +
      '<b>补码（two\u2019s complement）</b>换了个思路：n 位补码里，负数 x 存成 2ⁿ − |x|。' +
      '于是 −1 存成全 1（16 位是 <code>FFFF</code>），−32768 存成 <code>8000</code>。' +
      '好处是<b>减法可以当加法做</b>：a − b 就是 a + (−b)，硬件只需要一个加法器。<br>' +
      '求一个数的相反数只需两步：<b>按位取反，再加 1</b>。例如 5 = <code>0000…0101</code>，取反得' +
      '<code>1111…1010</code>，加 1 得 <code>1111…1011</code>，即 −5。反过来对 −5 做同样操作会回到 5，' +
      '而 0 取反加 1 仍是 0——所以零只有一种表示，这是补码最漂亮的性质。'
    },


    { t: 'code', caption: 'Twos.java —— 取反加一、16 位二进制长相、补码加法', code:
`public class Twos {
    static int negate(int x) {
        return ~x + 1;
    }

    static String bits16(int x) {
        String s = Integer.toBinaryString(x & 0xFFFF);
        while (s.length() < 16) {
            s = "0" + s;
        }
        return s;
    }

    public static void main(String[] args) {
        System.out.println(bits16(5));       // 0000000000000101
        System.out.println(bits16(-5));      // 1111111111111011
        System.out.println(negate(5));       // -5
        System.out.println(-5 + 5);          // 0
        System.out.println(bits16(32767));   // 0111111111111111
        System.out.println(bits16(-32768));  // 1000000000000000
        System.out.println((short) 0x8000);  // -32768
    }
}
` },

    { t: 'p', html:
      '三个结论可以直接背下来：<b>①</b> n 位补码范围是 −2ⁿ⁻¹ 到 2ⁿ⁻¹ − 1；<b>②</b> 加法直接按无符号加，' +
      '溢出丢掉最高进位，结果仍然正确（只要不越界）；<b>③</b> 取负 = 取反 + 1，0 只有一种表示。' +
      'Java 的 <code>short</code>/<code>int</code>/<code>long</code> 全部使用补码，' +
      '所以 <code>0xFFFF</code> 作为 short 是 −1，作为 int 是 65535——类型决定了怎么解释这串 bit。<br>' +
      '<b>检查点</b>：能手算 −5 的 16 位补码（<code>1111111111111011</code>），并解释为什么 ' +
      '<code>Math.abs(Integer.MIN_VALUE)</code> 还是负数。'
    },

    { t: 'h', text: '六、IEEE 754：小数怎么存', id: 'ch23-6' },

    { t: 'p', html:
      '整数用补码，小数则用<b>浮点数（floating point）</b>。IEEE 754 把一段 bit 分成三部分：' +
      '<b>符号位 s</b>（1 位）、<b>指数 e</b>（偏移二进制，存的是「真实指数 + bias」）、' +
      '<b>尾数 f</b>（隐藏了整数部分的首个 1）。真实值是 <code>(−1)ˢ × 1.f × 2^(e − bias)</code>。' +
      '三种常见格式：binary16（1+5+10，bias 15）、binary32（1+8+23，bias 127）、binary64（1+11+52，bias 1023）。'
    },

    { t: 'table',
      head: ['格式', '符号位', '指数位', '尾数位', 'bias', '指数范围'],
      rows: [
        ['binary16（half）', '1', '5', '10', '15', '−14 … 15'],
        ['binary32（float）', '1', '8', '23', '127', '−126 … 127'],
        ['binary64（double）', '1', '11', '52', '1023', '−1022 … 1023']
      ],
      caption: '指数全 0 与全 1 被保留给 0、次正规数与无穷大/NaN，所以可用的指数范围比位宽看起来少一点' },


    { t: 'code', caption: 'FloatBits.java —— 拆开 float 的符号/指数/尾数，并手算 binary16', code:
`public class FloatBits {
    public static void main(String[] args) {
        // -100.25f 的 IEEE 754 单精度位模式（JDK: Float.floatToIntBits(-100.25f)）
        int bits = 0xC2C88000;
        int sign = (bits >>> 31) & 1;
        int exp = ((bits >>> 23) & 0xFF) - 127;
        double mantissa = 1 + (bits & 0x7FFFFF) / (double) (1 << 23);

        System.out.println(Integer.toHexString(bits));   // c2c88000
        System.out.println(sign);                        // 1
        System.out.println(exp);                         // 6
        System.out.println(mantissa);                    // 1.56640625

        // 手算 binary16：1 位符号 + 5 位指数 + 10 位尾数，bias 15
        int b16 = 0b1010011010000000;
        int s = (b16 >>> 15) & 1;
        int e = (b16 >>> 10) & 0x1F;
        int f = b16 & 0x3FF;
        double v = (1 + f / 1024.0) * Math.pow(2, e - 15);
        System.out.println((s == 1 ? "-" : "") + v);     // -0.025390625
    }
}
` },

    { t: 'p', html:
      '−100.25 = −1.56640625 × 2⁶：先把它规格化成「1.xxx × 2 的幂」，指数 6 加上 bias 127 存成 133（<code>10000101</code>），' +
      '尾数去掉整数部分的 1，剩 <code>10010001</code> 补零到 23 位，最后符号位 1——拼起来就是 <code>0xC2C88000</code>。' +
      '浮点数因此有三个必须记住的事实：<b>它能表示的范围很大但精度有限</b>（0.1 + 0.2 不等于 0.3）、' +
      '<b>指数决定数量级、尾数决定有效数字</b>、<b>比较浮点数要用误差阈值而不是 ==</b>。'
    },

    { t: 'h', text: '七、位运算与掩码', id: 'ch23-7' },

    { t: 'p', html:
      'Java 提供 7 个整数位运算符：<code>~</code> 取反、<code>&amp;</code> 与、<code>|</code> 或、<code>^</code> 异或、' +
      '<code>&lt;&lt;</code> 左移、<code>&gt;&gt;</code> 算术右移（高位补符号位）、<code>&gt;&gt;&gt;</code> 逻辑右移（高位补 0）。' +
      '「取某几位」用<b>掩码（mask）</b>：与 <code>0xFF</code> 只留最低 8 位，与 <code>0x7FFFFF</code> 留 23 位尾数。' +
      '注意 <code>&amp;</code>、<code>|</code> 的优先级比 <code>==</code> 低，写表达式要加括号。'
    },

    { t: 'code', caption: 'BitOps.java —— 取位、移位、符号扩展', code:
`public class BitOps {
    public static void main(String[] args) {
        int x = 0b10110011;                     // 179
        System.out.println(x & 0x0F);           // 3
        System.out.println(x | 0x0F);           // 191
        System.out.println(x ^ 0xFF);           // 76
        System.out.println(~x & 0xFF);          // 76
        System.out.println(x << 2);             // 716
        System.out.println(x >> 2);             // 44
        System.out.println(-5 >> 1);            // -3
        System.out.println((-5 & 0xFFFF) >>> 1); // 32765
        System.out.println(1 << 31);            // -2147483648
    }
}
` },

    { t: 'p', html:
      '最后两行是重点：<code>-5 &gt;&gt; 1</code> 是算术右移，符号位补 1，结果 −3（相当于除以 2 向下取整）；' +
      '先与 <code>0xFFFF</code> 把 −5 变成「16 位无符号数」65531，再逻辑右移，就得到 32765。' +
      '教材里的 <code>ExtractFloat</code> 正是这个套路：先移位把目标段挪到最低位，再用掩码切出来。'
    },

    { t: 'h', text: '八、TOY 机器：一台能画进书页的计算机', id: 'ch23-8' },

    { t: 'p', html:
      '前面都在解释 bit，现在让 bit 动起来。教材虚构了一台叫 <b>TOY</b> 的计算机（名字来自「玩具」，' +
      '规模约等于 1970 年代的 PDP-8），它的全部部件能画在一页纸上：' +
      '<b>内存</b> 256 个字、每字 16 位（地址 00–FF，正好 2 个 hex 位）；' +
      '<b>16 个寄存器</b> R[0]–R[F]，每个 16 位，R[0] 恒为 0；' +
      '<b>ALU</b> 做加减与逻辑运算；<b>PC</b> 8 位存下一条指令地址；<b>IR</b> 16 位存当前指令。' +
      '它采用<b>存储程序（stored program）</b>结构：指令和数据存在同一个内存里，都是 16 位字。'
    },

    { t: 'svg', maxW: 760, caption: 'TOY 的数据通路：PC 指向内存取指令，IR 交给控制逻辑，寄存器与 ALU 完成运算，结果写回内存或寄存器。', html:
`<svg viewBox="0 0 780 330" role="img" aria-label="TOY 机器的数据通路">
  <defs>
    <marker id="arr23" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 z" fill="var(--accent2)"/>
    </marker>
  </defs>

  <rect x="470" y="50" width="200" height="150" rx="4" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="570" y="78" font-size="13" text-anchor="middle" fill="var(--text)">Memory</text>
  <text x="570" y="100" font-size="11" text-anchor="middle" fill="var(--text3)">256 字 × 16 位（00–FF）</text>
  <text x="570" y="122" font-size="11" text-anchor="middle" fill="var(--text3)">指令与数据同处一室</text>

  <rect x="60" y="50" width="120" height="50" rx="4" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="120" y="72" font-size="12" text-anchor="middle" fill="var(--text)">PC（8 位）</text>
  <text x="120" y="90" font-size="10" text-anchor="middle" fill="var(--text3)">下一条地址</text>

  <rect x="240" y="50" width="120" height="50" rx="4" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="300" y="72" font-size="12" text-anchor="middle" fill="var(--text)">IR（16 位）</text>
  <text x="300" y="90" font-size="10" text-anchor="middle" fill="var(--text3)">当前指令</text>

  <rect x="60" y="170" width="180" height="110" rx="4" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="150" y="195" font-size="12" text-anchor="middle" fill="var(--text)">寄存器堆</text>
  <text x="150" y="216" font-size="11" text-anchor="middle" fill="var(--text3)">R[0]–R[F] 共 16 个</text>
  <text x="150" y="238" font-size="11" text-anchor="middle" fill="var(--text3)">R[0] 恒为 0000</text>

  <rect x="300" y="185" width="120" height="70" rx="4" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="360" y="212" font-size="12" text-anchor="middle" fill="var(--text)">ALU</text>
  <text x="360" y="232" font-size="10" text-anchor="middle" fill="var(--text3)">加 / 减 / 与 / 异或 / 移位</text>

  <line x1="180" y1="75" x2="240" y2="75" stroke="var(--accent2)" stroke-width="1.4" marker-end="url(#arr23)"/>
  <line x1="180" y1="100" x2="470" y2="100" stroke="var(--accent2)" stroke-width="1.4" marker-end="url(#arr23)"/>
  <line x1="360" y1="100" x2="360" y2="50" stroke="var(--accent2)" stroke-width="1.4" marker-end="url(#arr23)"/>
  <line x1="240" y1="255" x2="240" y2="200" stroke="var(--accent2)" stroke-width="1.4" marker-end="url(#arr23)"/>
  <line x1="420" y1="220" x2="470" y2="180" stroke="var(--accent2)" stroke-width="1.4" marker-end="url(#arr23)"/>

  <text x="200" y="68" font-size="10" fill="var(--text3)">地址</text>
  <text x="300" y="118" font-size="10" fill="var(--text3)">取指令</text>
</svg>` },

    { t: 'table',
      head: ['部件', '规格', '作用'],
      rows: [
        ['内存 Memory', '256 × 16 位，地址 00–FF', '存指令和数据；FF 保留给标准输入输出'],
        ['寄存器 R', '16 个 × 16 位，R[0] 恒 0', '运算的临时存储；R[A]、R[B] 常作参数/返回值'],
        ['PC', '8 位', '存下一条要执行指令的地址'],
        ['IR', '16 位', '存当前正在执行的指令'],
        ['ALU', '16 位加减与逻辑', '执行 add/sub/and/xor/shift'],
        ['控制 Control', '由 op 字段驱动', '决定每条指令在 fetch/execute 阶段打开哪些通路']
      ],
      caption: 'TOY 的规模小到可以完整画出，但结构（存储程序、取指—执行、寄存器堆、ALU）与真实 CPU 一致' },

    { t: 'h', text: '九、TOY 指令格式：16 位 = 4 个 hex 位', id: 'ch23-9' },

    { t: 'p', html:
      'TOY 的每条指令都是 16 位，写成 4 个 hex 位，例如 <code>1234</code>。格式只有两种：' +
      '<b>RR 格式</b> <code>op d s t</code>（各 4 位），用于「寄存器 d ← 寄存器 s 与寄存器 t 运算」；' +
      '<b>A 格式</b> <code>op d addr</code>（4 + 4 + 8 位），用于访存和跳转，地址正好一个 hex 字节。' +
      '因此 <code>1234</code> 读作「add R[3] + R[4] → R[2]」，<code>7423</code> 读作「R[4] ← 地址 23」。'
    },

    { t: 'svg', maxW: 760, caption: '两种指令格式：RR 格式把 16 位切成 4+4+4+4，A 格式切成 4+4+8。', html:
`<svg viewBox="0 0 780 230" role="img" aria-label="TOY 的两种指令格式">
  <text x="30" y="35" font-size="12" fill="var(--text2)">RR 格式（寄存器—寄存器）</text>
  <g>
    <rect x="30" y="50" width="100" height="40" fill="var(--accentSoft)" stroke="var(--accent)"/>
    <rect x="130" y="50" width="100" height="40" fill="var(--bg2)" stroke="var(--accent2)"/>
    <rect x="230" y="50" width="100" height="40" fill="var(--bg2)" stroke="var(--accent2)"/>
    <rect x="330" y="50" width="100" height="40" fill="var(--bg2)" stroke="var(--accent2)"/>
    <text x="80" y="76" font-size="13" text-anchor="middle" fill="var(--accent)">op</text>
    <text x="180" y="76" font-size="13" text-anchor="middle" fill="var(--text)">d</text>
    <text x="280" y="76" font-size="13" text-anchor="middle" fill="var(--text)">s</text>
    <text x="380" y="76" font-size="13" text-anchor="middle" fill="var(--text)">t</text>
  </g>
  <text x="450" y="76" font-size="12" fill="var(--text3)">例 1234：add R[3] + R[4] → R[2]</text>

  <text x="30" y="130" font-size="12" fill="var(--text2)">A 格式（地址）</text>
  <g>
    <rect x="30" y="145" width="100" height="40" fill="var(--accentSoft)" stroke="var(--accent)"/>
    <rect x="130" y="145" width="100" height="40" fill="var(--bg2)" stroke="var(--accent2)"/>
    <rect x="230" y="145" width="200" height="40" fill="var(--bg2)" stroke="var(--ok)"/>
    <text x="80" y="171" font-size="13" text-anchor="middle" fill="var(--accent)">op</text>
    <text x="180" y="171" font-size="13" text-anchor="middle" fill="var(--text)">d</text>
    <text x="330" y="171" font-size="13" text-anchor="middle" fill="var(--text)">addr（8 位）</text>
  </g>
  <text x="450" y="171" font-size="12" fill="var(--text3)">例 7423：R[4] ← 地址 23</text>

  <text x="30" y="215" font-size="11" fill="var(--text3)">记忆法：先看 op（最高 4 位）判断是 RR 还是 A 格式，再按格式切后面的位。</text>
</svg>` },

    { t: 'table',
      head: ['op', '助记符', '动作（16 位补码）'],
      rows: [
        ['0', 'halt', '停机'],
        ['1', 'add', 'R[d] ← R[s] + R[t]'],
        ['2', 'subtract', 'R[d] ← R[s] − R[t]'],
        ['3', 'and', 'R[d] ← R[s] &amp; R[t]'],
        ['4', 'xor', 'R[d] ← R[s] ^ R[t]'],
        ['5', 'shift left', 'R[d] ← R[s] &lt;&lt; R[t]'],
        ['6', 'shift right', 'R[d] ← R[s] &gt;&gt; R[t]（算术）'],
        ['7', 'load address', 'R[d] ← addr'],
        ['8', 'load', 'R[d] ← M[addr]'],
        ['9', 'store', 'M[addr] ← R[d]'],
        ['A', 'load indirect', 'R[d] ← M[R[t]]'],
        ['B', 'store indirect', 'M[R[t]] ← R[d]'],
        ['C', 'branch zero', '若 R[d] == 0，PC ← addr'],
        ['D', 'branch positive', '若 R[d] &gt; 0，PC ← addr'],
        ['E', 'jump register', 'PC ← R[d]'],
        ['F', 'jump and link', 'R[d] ← PC；PC ← addr']
      ],
      caption: '只有 16 条指令，却足够写循环、条件、函数调用和数组访问；C0xx 是「无条件跳转」（R[0] 恒为 0）' },

    { t: 'h', text: '十、第一个 TOY 程序：8 + 5', id: 'ch23-10' },

    { t: 'p', html:
      '执行过程是一个固定循环：<b>fetch</b>（把 PC 指向的字读进 IR，PC 加 1）→ <b>execute</b>（按 IR 的 op 字段执行）→ 回到 fetch。' +
      '下面这段程序把地址 15、16 里的两个数相加，结果存到 17。注意地址 10–14 是指令，15–17 是数据——' +
      '它们在同一块内存里，只是被解释的方式不同。'
    },

    { t: 'code', caption: 'add.toy —— 8 + 5 = 13（十六进制 000D），非 Java · 静态阅读', run: false, code:
`10: 8A15    load   R[A] <- M[15]      // R[A] = 0008
11: 8B16    load   R[B] <- M[16]      // R[B] = 0005
12: 1CAB    add    R[C] <- R[A] + R[B] // R[C] = 000D
13: 9C17    store  M[17] <- R[C]      // 结果写回内存
14: 0000    halt                      // 停机

15: 0008
16: 0005
17: 0000    // 执行后变成 000D
` },

    { t: 'p', html:
      '逐条对照格式：<code>8A15</code> 的 op=8（load）、d=A（寄存器 A）、addr=15；<code>1CAB</code> 的 op=1（add）、' +
      'd=C、s=A、t=B。最后 <code>9C17</code> 把 R[C] 写进地址 17。整个过程没有任何「打印」指令——' +
      'TOY 的输入输出约定用地址 FF：<code>9AFF</code> 是「输出 R[A]」，<code>8AFF</code> 是「读入到 R[A]」。'
    },

    { t: 'code', caption: 'gcd.toy —— 欧几里得算法：gcd(195, 273) = 39（0027），非 Java · 静态阅读', run: false, code:
`20: 8A2B    load   R[A] <- M[2B]      // 195 = 00C3
21: 8B2C    load   R[B] <- M[2C]      // 273 = 0111
22: 2CAB    sub    R[C] <- R[A] - R[B] // 循环：大减小
23: CC29    branch zero R[C] -> 29     // 若相等则结束
24: DC27    branch positive R[C] -> 27 // 若仍为正，继续减
25: 2BBA    sub    R[B] <- R[B] - R[A] // 否则反过来减
26: C022    branch zero R[0] -> 22     // 无条件跳回循环
27: 2AAB    sub    R[A] <- R[A] - R[C] // 恢复较大的数
28: C022    branch zero R[0] -> 22
29: 9A2D    store  M[2D] <- R[A]      // 存 gcd
2A: 0000    halt

2B: 00C3    // 195
2C: 0111    // 273
2D: 0000    // 执行后变成 0027（39）
` },

    { t: 'p', html:
      '这段程序展示了机器语言里写循环与条件的全部套路：<b>用运算结果设置标志</b>（R[C] 的符号/是否为零），' +
      '<b>用 C/D 指令跳转</b>，<b>用 C0xx 无条件跳</b>。没有变量名、没有缩进、没有 for——只有地址和跳转，' +
      '但逻辑和 Java 里的 <code>while (a != b)</code> 完全一样。教材还给出一个更震撼的例子：' +
      '程序可以修改自己的指令（自修改代码），因为指令就是内存里的数据。'
    },

    { t: 'quiz', qid: 'ch23-q1' },
    { t: 'quiz', qid: 'ch23-q2' },

    { t: 'p', html:
      '补码的「取反加一」、浮点的三段式、掩码的位运算，光看公式容易记混。' +
      '下面这台实验台让你直接拨位：切换 8 位或 16 位整数、切到单精度浮点，改数值、换运算，十六进制和二进制同步跟着变。'
    },

    { t: 'lab', id: 'binary' },

    { t: 'keypoint', items: [
      { title: '检查点 · 解释 bit', html: '给定 16 位 <code>1111111111111011</code>，能说出它作为无符号数是 65531、作为补码是 −5。' },
      { title: '检查点 · 进制转换', html: '能说出 <code>Integer.parseInt("FACE", 16)</code> 得到 64206，<code>Integer.toHexString(64206)</code> 得到 "face"。' },
      { title: '检查点 · 范围与溢出', html: 'n 位无符号范围 0…2ⁿ−1；16 位补码 −32768…32767，<code>32767 + 1</code> 回绕成 −32768。' },
      { title: '检查点 · 补码', html: '能按「取反加一」写出 −5 的 16 位补码 <code>1111111111111011</code>，并说明 0 只有一种表示。' },
      { title: '检查点 · 浮点数', html: '能把 <code>0xC2C88000</code> 拆成符号 1、指数 6、尾数 1.56640625，认出它是 −100.25f。' },
      { title: '检查点 · 掩码', html: '能用 <code>&amp; 0xFF</code> 取低字节、用 <code>&gt;&gt;&gt;</code> 做无符号右移，并说明 <code>&gt;&gt;</code> 会带符号扩展。' },
      { title: '检查点 · TOY', html: '能把 <code>1234</code> 拆成 op=1、d=2、s=3、t=4，并说出它执行什么。' }
    ] },

    { t: 'checklist', id: 'ch23', items: [
      '我能解释 bit、字长与类型范围之间的关系',
      '我能把二进制、十六进制、十进制互相转换，并说明「每 4 bit 一组」',
      '我能用 parseInt/toString 和手写递归两种方式做进制转换',
      '我能写出 8 位/16 位无符号与补码的范围，并判断加法是否溢出',
      '我能手算一个负数的补码，并解释「取反加一」和 0 的唯一表示',
      '我能拆开 32 位 float 的符号、指数、尾数，并手算 binary16 的小数',
      '我能用掩码和移位取出任意一段 bit，并区分 &gt;&gt; 与 &gt;&gt;&gt;',
      '我能说出 TOY 的内存、寄存器、PC、IR、ALU 各是什么规格',
      '我能读懂 RR 与 A 两种指令格式，并手写一个「相加后存回」的程序',
      '我能解释「存储程序」为什么让自修改代码成为可能'
    ] },

    { t: 'p', html:
      '<b>延伸阅读</b>：Sedgewick《Computer Science: An Interdisciplinary Approach》§6.1–6.2（Representing Information、TOY Machine）' +
      '与本章逐节对应；书配套站点有可交互的 TOY 模拟器，可以逐条执行本章的程序。' +
      '站内可到 <a href="#/quiz/ch23">题库 · ch23</a> 按章筛选练习；下一章「机器语言与 TOY 虚拟机」会继续用这台机器写函数、数组，' +
      '并用 Java 实现一个能跑 TOY 程序的虚拟机。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：信息表示（bit/字长、二进制与十六进制、Java 进制转换、无符号与溢出、补码、IEEE 754、位运算与掩码）' +
      '与 TOY 机器（存储程序、内存/寄存器/PC/IR/ALU、指令格式与指令集、第一个程序与循环模式）。<br>' +
      '依据：Course Outline v5 的「Machine and Hardware」模块；Sedgewick §6.1–6.2（ch06.txt L26–1544）。' +
      'TOY 是教材虚构的教学机器，机器码与汇编均为静态阅读材料，不要求上机运行。' +
      '本站为个人整理学习材料，与课程要求冲突时以老师和课程大纲为准。' }

  ]
});
