/* =====================================================================
 * data/ch03.js · 第 03 章：位运算
 * 职责：把 & | ^ ~ << >> 用到能用——真值表、移位规则、掩码取位、
 *       置位/清位/翻转、有符号移位陷阱、字节序与典型用途。
 * 内容块 schema 见 学习中心/.work/AUTHORING.md；示例均按 C17 书写。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch03',
  num: '03',
  title: '位运算',
  en: 'Bitwise Operators',
  goals: [
    '能说清 <code>&amp;</code>、<code>|</code>、<code>^</code>、<code>~</code> 与逻辑运算符的区别，不混用',
    '能正确使用左移右移，并说清无符号逻辑右移与有符号算术右移的差别',
    '能用掩码取出任意一位或任意一段连续位，并写出通用的位段公式',
    '能用置位、清位、翻转三种模式维护一组标志位',
    '能说出位运算的典型用途，并避开移位量越界、有符号左移溢出这类未定义行为'
  ],
  kp: [
    { id: 'ch03-1', title: '位运算在解决什么问题' },
    { id: 'ch03-2', title: '与、或、异或、取反' },
    { id: 'ch03-3', title: '左移与右移' },
    { id: 'ch03-4', title: '掩码与取位' },
    { id: 'ch03-5', title: '置位、清位与翻转' },
    { id: 'ch03-6', title: '移位细节与典型用途' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '位运算看起来像"考试才用的奇技淫巧"，但它其实是 C 的日常工具：' +
      '一个 32 位整数可以当 32 个开关用；权限、状态、图像通道、网络包头、' +
      '哈希函数、内存分配器，全都在直接操作位。' +
      '更重要的是，位运算逼你<b>直面数据的二进制形态</b>——' +
      '上一章讲的补码与位模式，在这一章会变成可以动手操作的东西。'
    },

    { t: 'p', lead: true, html:
      '位运算的规则只有一句话：<b>对操作数的每一位分别做布尔运算，位与位之间互不影响</b>。' +
      '没有进位（那才有），没有短路（那是逻辑运算）。' +
      '下面先给最常用的场景，再逐个拆开五个运算符。'
    },

    { t: 'h', text: '一、位运算在解决什么问题', id: 'ch03-1' },

    { t: 'p', html:
      '假设你要记录一个文件能不能读、写、执行，还要记录它是不是隐藏的。' +
      '用四个 <code>int</code> 太浪费，用四个 <code>bool</code> 也不省。' +
      '但如果用一个 <code>unsigned int</code>，<b>每一位就是一个开关</b>：' +
      '<code>0001</code> 表示可读，<code>0010</code> 表示可写，<code>0100</code> 表示可执行。' +
      '这就是位运算最核心的用途：<b>把一组布尔状态压进一个整数</b>。'
    },

    { t: 'table', caption: '位运算的典型战场', head: ['场景', '用什么', '例子'], rows: [
      ['权限/标志位', '<code>|</code> 组合、<code>&amp;</code> 测试、<code>&amp; ~</code> 清除', '文件权限、窗口样式、状态机'],
      ['位图 / 集合', '<code>&amp;</code> 与移位定位', '10 亿个整数去重、布隆过滤器'],
      ['哈希与压缩', '<code>^</code>、<code>&lt;&lt;</code>、<code>&gt;&gt;</code> 混合', '哈希函数、校验和'],
      ['底层数据解析', '<code>&amp;</code> 加移位拼接', 'RGB 像素、IP 头部、协议字段'],
      ['快速运算', '<code>&lt;&lt;</code> 当乘 2 的幂', '图形与音频的定点运算'],
      ['硬件寄存器', '读改写某几位', '嵌入式、驱动代码']
    ] },

    { t: 'h', text: '二、与、或、异或、取反', id: 'ch03-2' },

    { t: 'p', html:
      '四个按位运算符的真值表和逻辑运算一模一样，区别只在于<b>它们不短路、不把整个值当真假</b>：' +
      '<code>&amp;</code> 是把两边的每一位对齐了逐位算，结果是一个整数，不是一个布尔值。'
    },

    { t: 'table', caption: '按位运算真值表', head: ['a', 'b', '<code>a &amp; b</code>（与）', '<code>a | b</code>（或）', '<code>a ^ b</code>（异或）'], rows: [
      ['0', '0', '0', '0', '0'],
      ['0', '1', '0', '1', '1'],
      ['1', '0', '0', '1', '1'],
      ['1', '1', '1', '1', '0']
    ] },

    { t: 'code', lang: 'c', caption: 'bitops.c —— 四个运算符的位模式级效果', code:
`#include <stdio.h>
#include <stdint.h>

/* 打印 32 位位模式，每 4 位加一个空格，便于肉眼比对 */
static void print_bits(uint32_t x)
{
    for (int i = 31; i >= 0; i--) {
        putchar(((x >> i) & 1u) ? '1' : '0');
        if (i % 4 == 0 && i != 0) {
            putchar(' ');
        }
    }
    putchar('\\n');
}

int main(void)
{
    uint32_t a = 0x0F0F0F0Fu;   /* 0000 1111 重复四次 */
    uint32_t b = 0x00FF00FFu;   /* 0000 0000 1111 1111 重复两次 */

    printf("a      = "); print_bits(a);
    printf("b      = "); print_bits(b);

    printf("a & b  = "); print_bits(a & b);   /* 同时为 1 的位才留下 */
    printf("a | b  = "); print_bits(a | b);   /* 任一个为 1 就留下 */
    printf("a ^ b  = "); print_bits(a ^ b);   /* 不同的位留下 */
    printf("~a     = "); print_bits(~a);      /* 每一位都翻转 */

    printf("\\n用十进制看一眼：\\n");
    printf("0xF0 ^ 0x0F = 0x%02X\\n", 0xF0u ^ 0x0Fu);   /* 0xFF */
    printf("0xFF & 0x0F = 0x%02X\\n", 0xFFu & 0x0Fu);   /* 0x0F */
    return 0;
}
` },

    { t: 'callout', kind: 'warn', title: '别把 &amp;&amp; 写成 &amp;', html:
      '<code>if (a &amp;&amp; b)</code> 判断"两者都为真"；<code>if (a &amp; b)</code> 是"按位与后非零"。' +
      '大多数时候两者结果恰好相同，但在<b>边界情况下会完全不同</b>：' +
      '<code>2 &amp; 1</code> 是 0（假），而 <code>2 &amp;&amp; 1</code> 是真。' +
      '还有更隐蔽的：<code>&amp;&amp;</code> 会短路，右边可能根本不执行；' +
      '<code>&amp;</code> 两边一定都执行。涉及副作用（比如 <code>i++</code>）时，这不是等价替换。'
    },

    { t: 'callout', kind: 'tip', title: '异或的两条好用性质', html:
      '<code>a ^ a == 0</code>：任何数异或自己都清零。' +
      '<code>a ^ 0 == a</code>：异或 0 保持原值。' +
      '合起来就是"翻转两次等于没翻转"，所以异或天然适合做<b>可逆加密</b>与' +
      '"找出唯一出现奇数次的元素"这类问题。'
    },

    { t: 'h', text: '三、左移与右移', id: 'ch03-3' },

    { t: 'p', html:
      '移位就是"把整串位往一个方向平移 n 位，空出来的位置补东西"。' +
      '左移 <code>&lt;&lt;</code> 低位补 0，效果是乘以 <code>2^n</code>；' +
      '右移 <code>&gt;&gt;</code> 补什么，取决于左边是不是有符号数。' +
      '这是 C 里少数"同一行代码在有无符号时行为不同"的地方，必须分清。'
    },

    { t: 'code', lang: 'c', caption: 'shift.c —— 左移与右移的实际结果', code:
`#include <stdio.h>
#include <stdint.h>

int main(void)
{
    /* 无符号：右移是逻辑右移，高位一律补 0 */
    uint32_t u = 0x80000000u;
    printf("u        = 0x%08X\\n", u);
    printf("u >> 1   = 0x%08X\\n", u >> 1);
    printf("u >> 4   = 0x%08X\\n", u >> 4);

    /* 有符号负数：右移是算术右移，高位补符号位（实现定义，平台普遍如此） */
    int32_t s = -8;
    printf("s        = %d\\n", s);
    printf("s >> 1   = %d\\n", s >> 1);
    printf("s >> 2   = %d\\n", s >> 2);

    /* 关键差别：右移是向下取整，整数除法是向零取整 */
    int32_t neg = -7;
    printf("-7 >> 1  = %d（向下取整）\\n", neg >> 1);
    printf("-7 / 2   = %d（向零取整）\\n", neg / 2);

    /* 左移当乘法用 */
    uint32_t x = 3;
    printf("3 << 4   = %u\\n", x << 4);
    printf("3 * 16   = %u\\n", x * 16u);

    /* 用无符号字面量保证 1u << 31 不溢出 */
    printf("1u << 31 = 0x%08X\\n", 1u << 31);
    return 0;
}
` },

    { t: 'table', caption: '两种右移的区别', head: ['被移的数', '运算符', '高位补什么', '标准地位'], rows: [
      ['<code>unsigned</code>', '<code>&gt;&gt;</code>', '补 0（逻辑右移）', '良定义'],
      ['非负的 <code>signed</code>', '<code>&gt;&gt;</code>', '补 0，等价于向下整除 <code>2^n</code>', '良定义'],
      ['负的 <code>signed</code>', '<code>&gt;&gt;</code>', '通常补 1（算术右移）', '<b>实现定义</b>'],
      ['任何整型', '<code>&lt;&lt;</code>', '低位补 0', '结果可表示时良定义，否则 UB']
    ] },

    { t: 'callout', kind: 'warn', title: '三类移位未定义行为', html:
      '<b>一、移位量越界</b>：对 32 位类型，<code>n &gt;= 32</code> 或 <code>n &lt; 0</code> 是 UB。' +
      '<code>1u &lt;&lt; 32</code> 在 x86 上可能被硬件解释成 <code>1u &lt;&lt; 0</code>，' +
      '但那是机器的巧合，不是语言保证。<br>' +
      '<b>二、有符号左移溢出</b>：<code>1 &lt;&lt; 31</code> 是 UB，因为结果 <code>2147483648</code> ' +
      '超出 <code>int</code>。要写 <code>1u &lt;&lt; 31</code>。<br>' +
      '<b>三、左移负数</b>：<code>-1 &lt;&lt; 1</code> 是 UB。' +
      '所以凡是做位运算，<b>优先用无符号类型</b>：<code>uint32_t</code> 和 <code>1u</code>，' +
      '规则最简单，也最不容易踩坑。'
    },

    { t: 'h', text: '四、掩码与取位', id: 'ch03-4' },

    { t: 'p', html:
      '<b>掩码</b>（mask）就是一块"只留某些位、其余清零"的模板。' +
      '取某一位用 <code>(x &gt;&gt; n) &amp; 1</code>；取连续一段用' +
      '<code>(x &gt;&gt; offset) &amp; ((1u &lt;&lt; width) - 1)</code>。' +
      '后一个公式要理解它怎么来的：<code>1u &lt;&lt; width</code> 是"1 后面跟 width 个 0"，' +
      '减 1 之后变成 width 个 1。'
    },

    { t: 'code', lang: 'c', caption: 'mask.c —— 从一位到一段', code:
`#include <stdio.h>
#include <stdint.h>

int main(void)
{
    uint32_t value = 0xABCD1234u;

    /* 取第 n 位（n 从 0 开始，最低位是第 0 位） */
    printf("value       = 0x%08X\\n", value);
    printf("第 2 位     = %u\\n", (value >> 2) & 1u);
    printf("第 20 位    = %u\\n", (value >> 20) & 1u);

    /* 取低 8 位：0xFF 是一块 8 个 1 的掩码 */
    printf("低 8 位     = 0x%02X\\n", value & 0xFFu);

    /* 取位段 [4..7]：先右移到位段起点，再与上 4 个 1 */
    uint32_t width  = 4;
    uint32_t offset = 4;
    uint32_t mask   = (1u << width) - 1u;      /* 0xF */
    uint32_t field  = (value >> offset) & mask;
    printf("位段[4..7]  = 0x%X\\n", field);

    /* width 等于类型位宽时，1u << 32 是 UB，要特判 */
    uint32_t all = ~0u;                        /* 32 个 1，安全写法 */
    printf("全 1 掩码   = 0x%08X\\n", all);
    return 0;
}
` },

    { t: 'callout', kind: 'tip', title: '掩码公式的三种写法', html:
      '取第 <code>n</code> 位：<code>(x &gt;&gt; n) &amp; 1u</code>，或 <code>(x &amp; (1u &lt;&lt; n)) != 0</code>。' +
      '取 <code>width</code> 位的掩码：<code>(1u &lt;&lt; width) - 1u</code>。' +
      '如果 <code>width</code> 恰好等于类型位宽，用 <code>~(uint32_t)0</code> 或 <code>UINT32_MAX</code>。' +
      '这三个写法记住，后面读任何底层代码都不会卡住。'
    },

    { t: 'h', text: '五、置位、清位与翻转', id: 'ch03-5' },

    { t: 'p', html:
      '有了位掩码，对单个位的三种写操作就有了固定模式：' +
      '<b>置位</b>用 <code>|=</code>（或上 1），<b>清位</b>用 <code>&amp;= ~</code>（与上 0），' +
      '<b>翻转</b>用 <code>^=</code>（异或 1）。' +
      '这三种模式在嵌入式、图形、权限代码里出现频率极高，值得背下来。'
    },

    { t: 'table', caption: '单个位的四种操作', head: ['目的', '运算符', '写法', '效果'], rows: [
      ['测试某位是否为 1', '<code>&amp;</code>', '<code>if (x &amp; (1u &lt;&lt; n))</code>', '不清除其他位，只判断'],
      ['置位（设为 1）', '<code>|=</code>', '<code>x |= (1u &lt;&lt; n);</code>', '该位变 1，其余不变'],
      ['清位（设为 0）', '<code>&amp;= ~</code>', '<code>x &amp;= ~(1u &lt;&lt; n);</code>', '该位变 0，其余不变'],
      ['翻转', '<code>^=</code>', '<code>x ^= (1u &lt;&lt; n);</code>', '该位取反，其余不变']
    ] },

    { t: 'code', lang: 'c', caption: 'flags.c —— 用一组位表示权限', code:
`#include <stdio.h>
#include <stdint.h>

/* 每种权限独占一位，一个 uint32_t 最多能装 32 种 */
enum {
    PERM_READ   = 1u << 0,   /* 0x01 */
    PERM_WRITE  = 1u << 1,   /* 0x02 */
    PERM_EXEC   = 1u << 2,   /* 0x04 */
    PERM_DELETE = 1u << 3    /* 0x08 */
};

int main(void)
{
    uint32_t perm = PERM_READ | PERM_WRITE;   /* 组合：0x03 */

    printf("初始 perm = 0x%02X\\n", perm);
    printf("有读权限？   %s\\n", (perm & PERM_READ)  ? "是" : "否");
    printf("有执行权限？ %s\\n", (perm & PERM_EXEC)  ? "是" : "否");

    perm |= PERM_EXEC;        /* 加上执行权限 */
    printf("加执行后 = 0x%02X\\n", perm);

    perm &= ~PERM_WRITE;      /* 去掉写权限：与上"除该位以外全 1" */
    printf("去写后   = 0x%02X\\n", perm);

    perm ^= PERM_READ;        /* 翻转读权限 */
    printf("翻转读后 = 0x%02X\\n", perm);

    /* 判断"是否同时具备读和执行" */
    uint32_t need = PERM_READ | PERM_EXEC;
    if ((perm & need) == need) {
        printf("读和执行都有\\n");
    } else {
        printf("至少缺一种权限\\n");
    }
    return 0;
}
` },

    { t: 'callout', kind: 'exam', title: '判断"包含全部位"为什么要再比较一次', html:
      '<code>if (perm &amp; need)</code> 只说明"至少有一位重合"；' +
      '<code>if ((perm &amp; need) == need)</code> 才说明"need 的每一位都有"。' +
      '这是位运算里最容易被忽略的一处：<b>按位与的结果是一个整数，不是布尔值</b>，' +
      '必须再和期望的掩码比一次。' +
      '同理，判断"包含任意一位"才用 <code>!= 0</code>。'
    },

    { t: 'h', text: '用位运算看内存：字节序', lvl: 3 },

    { t: 'p', html:
      '一个多字节整数在内存里占连续几个字节，但<b>哪个字节放在低地址，标准没有规定</b>。' +
      'x86-64 是<b>小端</b>：低位字节放低地址；大部分网络协议与部分 CPU 用<b>大端</b>。' +
      '这个差异可以用移位和按位与直接观察出来。'
    },

    { t: 'code', lang: 'c', caption: 'endian.c —— 一个字节一个字节地看', code:
`#include <stdio.h>
#include <stdint.h>

int main(void)
{
    uint32_t word = 0x01020304u;   /* 字节依次是 01 02 03 04 */

    /* 用 unsigned char 指针逐字节访问同一块内存 */
    unsigned char *p = (unsigned char *)&word;

    printf("内存里的四个字节（从低地址到高地址）：\\n");
    for (int i = 0; i < 4; i++) {
        printf("  地址 +%d 处 = 0x%02X\\n", i, (unsigned)p[i]);
    }

    if (p[0] == 0x04) {
        printf("结论：小端（低位字节在低地址）\\n");
    } else if (p[0] == 0x01) {
        printf("结论：大端（高位字节在低地址）\\n");
    }

    /* 把内存里的字节按"第一个字节是最高位"的顺序拼回一个整数：
       小端机器上得到 0x04030201，大端机器上才得到 0x01020304 */
    uint32_t assembled = ((uint32_t)p[0] << 24) |
                         ((uint32_t)p[1] << 16) |
                         ((uint32_t)p[2] << 8)  |
                         ((uint32_t)p[3]);
    printf("按内存顺序拼成大端 = 0x%08X\\n", assembled);
    return 0;
}
` },

    { t: 'callout', kind: 'note', title: '为什么字节序必须弄清', html:
      '写文件、发网络包、读二进制格式时，字节序错了，数据就整体错乱。' +
      '网络字节序规定为<b>大端</b>，所以有 <code>htons</code> / <code>htonl</code> 这类转换函数。' +
      '更根本的一点：<b>字节序是"多字节对象在内存里的排列规则"</b>，' +
      '只影响你按字节观察、或跨机器交换数据的时候；在同一个进程里用整数运算，完全感知不到它。'
    },

    { t: 'h', text: '六、移位细节与典型用途', id: 'ch03-6' },

    { t: 'p', html:
      '位运算的经典技巧很多，但真正需要记牢的只有几个：<b>判断奇偶</b>用 <code>x &amp; 1</code>；' +
      '<b>清掉最低位的 1</b> 用 <code>x &amp; (x - 1)</code>；' +
      '<b>取出最低位的 1</b> 用 <code>x &amp; (~x + 1)</code>（对无符号也可以写 <code>x &amp; -x</code>）；' +
      '<b>判断 2 的幂</b>用 <code>x != 0 &amp;&amp; (x &amp; (x - 1)) == 0</code>。' +
      '这些不是魔法，都能用真值表推出来。'
    },

    { t: 'code', lang: 'c', caption: 'tricks.c —— 四个真正值得记的技巧', code:
`#include <stdio.h>
#include <stdint.h>

/* 2 的幂的位模式里恰好只有一个 1，减 1 后它变成 0、后面的位变 1，相与为 0 */
static int is_power_of_two(uint32_t x)
{
    return x != 0 && (x & (x - 1)) == 0;
}

/* 清掉最低位的 1，可以顺便数 1 的个数 */
static int count_ones(uint32_t x)
{
    int n = 0;
    while (x != 0) {
        x &= x - 1;
        n++;
    }
    return n;
}

int main(void)
{
    for (uint32_t n = 1; n <= 8; n++) {
        printf("%u 是 2 的幂？ %s\\n", n, is_power_of_two(n) ? "是" : "否");
    }

    printf("0xFF 里 1 的个数 = %d\\n", count_ones(0xFFu));
    printf("0x80000000 里 1 的个数 = %d\\n", count_ones(0x80000000u));

    /* 奇偶判断 */
    printf("7 是奇数？ %s\\n", (7 & 1) ? "是" : "否");
    printf("8 是奇数？ %s\\n", (8 & 1) ? "是" : "否");

    /* 用异或交换两个整数：不需要临时变量 */
    int a = 3, b = 5;
    a ^= b;
    b ^= a;
    a ^= b;
    printf("交换后 a = %d, b = %d\\n", a, b);
    return 0;
}
` },

    { t: 'table', caption: '位运算技巧速查', head: ['目的', '写法', '说明'], rows: [
      ['判断奇偶', '<code>x &amp; 1</code>', '最低位是 1 就是奇数'],
      ['乘 / 除 <code>2^n</code>', '<code>x &lt;&lt; n</code> / <code>x &gt;&gt; n</code>', '仅对无符号或非负数可靠'],
      ['清最低位的 1', '<code>x &amp; (x - 1)</code>', '常用于计数 1 的个数'],
      ['取最低位的 1', '<code>x &amp; (~x + 1)</code>', '无符号下等价于 <code>x &amp; -x</code>'],
      ['判断 2 的幂', '<code>x != 0 &amp;&amp; !(x &amp; (x - 1))</code>', '只有一个 1'],
      ['交换两数', '<code>a ^= b; b ^= a; a ^= b;</code>', '可读性差，现代代码不推荐'],
      ['字节拼接', '<code>(a &lt;&lt; 24) | (b &lt;&lt; 16) | (c &lt;&lt; 8) | d</code>', '构造大端整数']
    ] },

    { t: 'callout', kind: 'warn', title: '技巧要用在值得的地方', html:
      '用异或交换两个变量的写法在上古时代能省一个寄存器，<b>今天只会让代码更难懂，' +
      '而且当 a 和 b 是同一个变量时会把它清零</b>（<code>a ^= a</code> 得 0）。' +
      '<code>x * 2</code> 和 <code>x &lt;&lt; 1</code> 在现代编译器下生成的指令通常完全一样，' +
      '所以<b>可读性优先</b>：只有当你真的在处理位、掩码、协议字段时，才用位运算。'
    },

    { t: 'h', text: '更省事的写法：编译器内置函数', lvl: 3 },

    { t: 'p', html:
      '手写位运算有时不必。GCC 与 Clang 提供了一组 <code>__builtin_*</code> 函数，' +
      '会被编译成单条指令（例如 x86 的 <code>popcnt</code>）。它们不是标准 C，' +
      '但在这两个平台上随处可用，读底层代码时会遇到。' +
      '注意 <code>__builtin_clz(0)</code> 没有定义，调用前必须先排除 0。'
    },

    { t: 'code', lang: 'c', caption: 'builtins.c —— GCC / Clang 的常用内置位函数', code:
`#include <stdio.h>

int main(void)
{
    unsigned int x = 0xF0F0F0F0u;

    /* 数一数有多少个 1 */
    printf("popcount(0xF0F0F0F0) = %d\\n", __builtin_popcount(x));

    /* 前导零个数：参数不能是 0 */
    printf("clz(0x00000001)     = %d\\n", __builtin_clz(1u));

    /* 尾部零个数：参数不能是 0 */
    printf("ctz(0x00000008)     = %d\\n", __builtin_ctz(8u));

    /* 1 的个数是奇数还是偶数 */
    printf("parity(0x7)         = %d\\n", __builtin_parity(7u));
    return 0;
}
` },

    { t: 'compare', lang: 'c', left: {
      title: '有符号位运算的坑', html: '用 <code>int</code> 和 <code>1</code> 做移位，' +
        '第 31 位会触发 UB，负值右移结果依赖实现。', code:
`int flags = 0;
flags |= (1 << 31);      /* UB：1 << 31 超出 int 范围 */
int s = -8;
int h = s >> 1;          /* 实现定义，不一定到处都等于 -4 */`
    }, right: {
      title: '无符号位运算最稳', html: '用 <code>uint32_t</code> 与 <code>1u</code>，' +
        '所有移位规则都是确定的。', code:
`uint32_t flags = 0;
flags |= (1u << 31);     /* 良定义：0x80000000 */
uint32_t s = (uint32_t)-8;
uint32_t h = s >> 1;     /* 逻辑右移，高位补 0，结果确定 */`
    } },

    { t: 'terms', items: [
      { en: 'bitwise operator', zh: '位运算符', html: '<code>&amp;</code>、<code>|</code>、<code>^</code>、<code>~</code>、<code>&lt;&lt;</code>、<code>&gt;&gt;</code>，逐位运算。' },
      { en: 'mask', zh: '掩码', html: '只保留某些位、其余清零的位模式，例如 <code>0xFF</code>。' },
      { en: 'set / clear / toggle', zh: '置位 / 清位 / 翻转', html: '<code>|=</code> 置 1，<code>&amp;= ~</code> 清 0，<code>^=</code> 取反。' },
      { en: 'logical shift', zh: '逻辑右移', html: '无符号数右移，高位一律补 0。' },
      { en: 'arithmetic shift', zh: '算术右移', html: '有符号负数右移，高位补符号位；C 标准规定为实现定义。' },
      { en: 'endianness', zh: '字节序', html: '多字节对象在内存中的字节排列顺序，小端低位字节在前，大端高位字节在前。' }
    ] },

    { t: 'keypoint', items: [
      { title: '逐位运算，不短路', html: '<code>&amp;</code> 与 <code>&amp;&amp;</code> 不是一回事；位运算结果是一个整数。' },
      { title: '五个运算符', html: '<code>&amp;</code> 交集、<code>|</code> 并集、<code>^</code> 差异、<code>~</code> 翻转、移位平移。' },
      { title: '移位规则看符号', html: '无符号右移补 0；有符号负数右移实现定义，实践中补 1。' },
      { title: '掩码公式', html: '<code>(1u &lt;&lt; width) - 1u</code> 造 width 个 1；<code>(x &gt;&gt; off) &amp; mask</code> 取位段。' },
      { title: '三种写位模式', html: '<code>|=</code> 置位、<code>&amp;= ~</code> 清位、<code>^=</code> 翻转，其余位不动。' },
      { title: '优先无符号', html: '移位量越界、有符号左移溢出、左移负数都是 UB；<code>uint32_t</code> 最省心。' },
      { title: '字节序是排列规则', html: 'x86-64 小端；网络协议大端；只有跨机器或按字节观察时才需要关心。' }
    ] },

    { t: 'checklist', id: 'ch03', items: [
      '我能说出 <code>&amp;</code> 与 <code>&amp;&amp;</code> 的区别，并举一个结果不同的例子',
      '我能用 <code>~</code> 和掩码写出"清掉第 n 位"',
      '我能写出取位段的通用公式，并说明 <code>(1u &lt;&lt; width) - 1</code> 为什么得到 width 个 1',
      '我能解释无符号逻辑右移与有符号算术右移的区别，并知道后者是实现定义',
      '我能举出三种移位未定义行为，并知道用 <code>uint32_t</code> 规避',
      '我能用一组标志位实现权限的判断、添加与删除',
      '我能写程序判断本机字节序，并解释小端与大端的区别'
    ] }
  ]
});
