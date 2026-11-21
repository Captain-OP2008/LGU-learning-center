/* =====================================================================
 * data/ch02.js · 第 02 章：整数、位与字节
 * 职责：把"数据在内存里到底长什么样"讲精确——进制、位与字节、
 *       补码、sizeof、溢出与回绕、隐式转换与截断、struct 布局初识。
 * 内容块 schema 见 学习中心/.work/AUTHORING.md；示例均按 C17 书写。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch02',
  num: '02',
  title: '整数、位与字节',
  en: 'Integers, Bits & Bytes',
  goals: [
    '能在二进制、十六进制、八进制与十进制之间互转，说出位、字节与字长的关系，并用 sizeof 确认类型宽度',
    '能用补码解释负数在内存里的位模式，并说明为什么这种编码最好用',
    '能区分无符号回绕与有符号溢出的不同后果，知道前者良定义、后者是未定义行为',
    '能预判隐式转换与截断的结果，知道什么时候必须写显式强制转换',
    '能画出含填充的 struct 布局，用 offsetof 验证成员的偏移'
  ],
  kp: [
    { id: 'ch02-1', title: '进制：同一串位的不同读法' },
    { id: 'ch02-2', title: '位与字节' },
    { id: 'ch02-3', title: '补码：负数怎么存' },
    { id: 'ch02-4', title: 'sizeof 与类型宽度' },
    { id: 'ch02-5', title: '溢出与回绕' },
    { id: 'ch02-6', title: '隐式转换、截断与强制转换' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      'C 的很多"灵异现象"都源于同一件事：<b>内存里只有位，没有数</b>。' +
      '一个字节里的 8 个位，既可以读成 251，也可以读成 -5，还可以读成一个字符——' +
      '全看<b>类型</b>告诉编译器用哪种规则去解释。' +
      '这一章把这些规则一次讲准：进制、补码、sizeof、溢出、转换。' +
      '这里含糊一点，后面指针、数组、位运算会全面塌方。'
    },

    { t: 'p', lead: true, html:
      '你写的 <code>int x = -5;</code> 在内存里并不是"负号 + 5"这样的东西。' +
      '内存里只有一串位，比如 <code>11111011</code>。' +
      '为什么这串位代表 -5？为什么另一个类型读出来是 251？' +
      '这一章回答的就是这类问题，而且答案必须精确到"哪个规则、哪一步"。'
    },

    { t: 'h', text: '一、进制：同一串位的不同读法', id: 'ch02-1' },

    { t: 'p', html:
      '计算机用二进制，但人写 32 位二进制会疯。于是有了两种"压缩写法"：' +
      '<b>每 3 位压成一个八进制数字</b>，<b>每 4 位压成一个十六进制数字</b>。' +
      '十六进制最常用，因为一个字节正好是 8 位，写成两个十六进制数字，非常整齐。'
    },

    { t: 'table', caption: 'C 整数常量的进制前缀', head: ['写法', '进制', '例子', '十进制值'], rows: [
      ['<code>42</code>', '十进制', '<code>42</code>', '42'],
      ['<code>0x2A</code> / <code>0X2A</code>', '十六进制（前缀 <code>0x</code>）', '<code>0x2A</code>、<code>0xFF</code>', '42、255'],
      ['<code>052</code>', '八进制（前缀 <code>0</code>）', '<code>052</code>、<code>010</code>', '42、8'],
      ['<code>0b101010</code>', '二进制（前缀 <code>0b</code>）', '<code>0b101010</code>', '42（C23 才进标准，旧标准是编译器扩展）']
    ] },

    { t: 'code', lang: 'c', caption: 'radix.c —— 同一个数的三种写法与位模式', code:
`#include <stdio.h>

int main(void)
{
    int value = 0x2A;          /* 十六进制字面量，等于十进制 42 */

    printf("十进制   = %d\\n", value);
    printf("十六进制 = 0x%X\\n", value);
    printf("八进制   = 0%o\\n", value);

    /* 逐位输出低 8 位的位模式：从最高位到最低位 */
    printf("8 位位模式 = ");
    for (int i = 7; i >= 0; i--) {
        putchar(((value >> i) & 1) ? '1' : '0');
    }
    putchar('\\n');

    /* 不止一个字节时，用位宽和掩码来观察 */
    printf("0x1234 的低字节 = 0x%02X\\n", 0x1234 & 0xFF);
    printf("0x1234 的高字节 = 0x%02X\\n", (0x1234 >> 8) & 0xFF);
    return 0;
}
` },

    { t: 'callout', kind: 'warn', title: '0 开头的十进制是个陷阱', html:
      '<code>010</code> 不是十，是八。<b>任何以 <code>0</code> 开头的整数常量都是八进制</b>。' +
      '新手常写 <code>int month = 09;</code> 想表示 9 月，结果得到一个编译错误，' +
      '因为 8 进制里没有数字 9。写十进制就不要加前导 0；前导 0 只在你真的想写八进制时才用。'
    },

    { t: 'callout', kind: 'tip', title: '为什么要习惯十六进制', html:
      '调试时观察内存、协议、位掩码，十六进制几乎是通用语言：一个字节两个数字，' +
      '<code>0x00</code> 到 <code>0xFF</code>；4 位一组的边界一眼可见。' +
      '看到 <code>0xFFFFFFFF</code> 立刻反应"32 个 1"，比看到 4294967295 快得多。' +
      '本课后面讲位运算、指针地址、字节序，全部用十六进制表达。'
    },

    { t: 'h', text: '字面量的类型与后缀', lvl: 3 },

    { t: 'p', html:
      '整数常量本身也有类型，只是编译器替你推断。十进制字面量从 <code>int</code> 开始，' +
      '装不下就依次尝试 <code>long</code>、<code>long long</code>；十六进制与八进制还会尝试无符号版本。' +
      '后缀可以强制指定类型：<code>10u</code> 是 <code>unsigned</code>，' +
      '<code>10L</code> 是 <code>long</code>，<code>10ULL</code> 是 <code>unsigned long long</code>，' +
      '浮点则是 <code>1.5</code> 默认 <code>double</code>、<code>1.5f</code> 才是 <code>float</code>。'
    },

    { t: 'code', lang: 'c', caption: 'literal_types.c —— 后缀会改变运算规则', code:
`#include <stdio.h>
#include <limits.h>

int main(void)
{
    /* 后缀 u 明确指定无符号，减法就按无符号规则回绕 */
    unsigned int u = 0u;
    printf("0u - 1 = %u\\n", u - 1);

    unsigned int big = 3000000000u;   /* 超出 INT_MAX，但 unsigned 装得下 */
    printf("big = %u\\n", big);

    /* 需要确定 64 位时用 LL 后缀 */
    long long huge = 1234567890123456LL;
    printf("huge = %lld\\n", huge);

    /* 浮点字面量默认 double，加 f 变成 float，精度明显不同 */
    double d = 1.0 / 3.0;
    float  f = 1.0f / 3.0f;
    printf("double: %.15f\\n", d);
    printf("float : %.15f\\n", (double)f);

    printf("sizeof(long) = %zu\\n", sizeof(long));
    printf("INT_MAX = %d\\n", INT_MAX);
    return 0;
}
` },

    { t: 'h', text: '二、位与字节', id: 'ch02-2' },

    { t: 'p', html:
      '<b>位</b>（bit）是最小单位，只有 0 和 1。<b>字节</b>（byte）是内存可寻址的最小单位，' +
      '在几乎所有平台上等于 8 位。标准只保证一个字节至少 8 位（<code>CHAR_BIT</code>），' +
      '所以严格说"字节 = 8 位"是个平台事实，不是语言规定；但本课后面的所有讨论，' +
      '都建立在"一个字节 8 位"这个现实上。'
    },

    { t: 'code', lang: 'c', caption: 'bits.c —— 用 sizeof 和 CHAR_BIT 确认现实', code:
`#include <stdio.h>
#include <limits.h>

int main(void)
{
    printf("一个字节 = %d 位（CHAR_BIT）\\n", CHAR_BIT);

    printf("sizeof(char)   = %zu 字节\\n", sizeof(char));
    printf("sizeof(short)  = %zu 字节\\n", sizeof(short));
    printf("sizeof(int)    = %zu 字节\\n", sizeof(int));
    printf("sizeof(long)   = %zu 字节\\n", sizeof(long));
    printf("sizeof(double) = %zu 字节\\n", sizeof(double));

    /* 4 字节的 int 有 32 位，能区分 2 的 32 次方个不同的值 */
    printf("int 的位数      = %zu\\n", 8 * sizeof(int));
    printf("int 能表示的值数 = %llu\\n", 1ULL << (8 * sizeof(int)));
    printf("unsigned int 最大 = %u\\n", UINT_MAX);
    return 0;
}
` },

    { t: 'table', caption: '常见的量级（以 8 位字节、int 4 字节为例）', head: ['说法', '位数', '字节数', '能表示多少种值'], rows: [
      ['半字节 nibble', '4', '<code>1/2</code>', '<code>2^4 = 16</code>'],
      ['字节 byte', '8', '1', '<code>2^8 = 256</code>'],
      ['16 位字', '16', '2', '<code>65536</code>'],
      ['32 位字', '32', '4', '<code>4294967296</code>'],
      ['64 位字', '64', '8', '<code>2^64 ≈ 1.8×10^19</code>']
    ] },

    { t: 'p', html:
      '要注意 <b>n 位能表示 <code>2^n</code> 种不同的位模式</b>，但这不等于"能表示 <code>2^n</code> 个正数"。' +
      '这 <code>2^n</code> 种模式怎么分配给正数、负数和零，就是下一节的补码要解决的问题。' +
      '另外，日常说"1KB"到底是一千还是 1024，是十进制 SI 与二进制 IEC 的差异（<code>KiB</code> = 1024 字节）；' +
      '写程序时涉及容量换算，一定先确认对方用的是哪套。'
    },

    { t: 'h', text: '三、补码：负数怎么存', id: 'ch02-3' },

    { t: 'p', html:
      '最朴素的想法是"最高位当符号位，其余位存绝对值"，这叫原码。但它有两个麻烦：' +
      '<b>零有两种写法</b>（+0 和 -0），以及<b>减法电路无法和加法电路复用</b>。' +
      '补码（two\'s complement）解决了这两个问题，现代所有平台都用它，C23 更是把它写进了标准。'
    },

    { t: 'p', html:
      '补码的定义非常简洁：<b>一个负数的位模式，等于它的绝对值取反再加 1</b>，' +
      '也就是 <code>-x</code> 的位模式是 <code>~x + 1</code>（在固定位宽下）。' +
      '反过来，把位模式按无符号读出来是 <code>U</code>，按有符号读就是：' +
      '<code>U &lt; 2^(N-1)</code> 时是 <code>U</code>，否则是 <code>U - 2^N</code>。'
    },

    { t: 'table', caption: '8 位的位模式：无符号与补码的两种读法', head: ['位模式', '十六进制', '按 unsigned 读', '按补码（signed）读'], rows: [
      ['<code>0000 0000</code>', '<code>0x00</code>', '0', '0'],
      ['<code>0111 1111</code>', '<code>0x7F</code>', '127', '127（最大正数）'],
      ['<code>1000 0000</code>', '<code>0x80</code>', '128', '-128（最小负数）'],
      ['<code>1111 1011</code>', '<code>0xFB</code>', '251', '-5'],
      ['<code>1111 1111</code>', '<code>0xFF</code>', '255', '-1']
    ] },

    { t: 'code', lang: 'c', caption: 'twos.c —— 用程序验证补码', code:
`#include <stdio.h>
#include <limits.h>

int main(void)
{
    int minus_five = -5;

    /* 把同一个位模式按无符号读出来，就能看到它的十六进制 */
    printf("-5 的位模式   = 0x%08X\\n", (unsigned)minus_five);
    printf("~(-5) + 1     = %d\\n", ~minus_five + 1);

    printf("INT_MIN       = %d\\n", INT_MIN);
    printf("INT_MAX       = %d\\n", INT_MAX);
    printf("UINT_MAX      = %u\\n", UINT_MAX);
    printf("(unsigned)-1  = %u\\n", (unsigned)-1);

    /* 只看低 8 位：-5 存进 8 位容器 */
    unsigned char u8 = (unsigned char)-5;
    printf("8 位的 -5     = %u（0x%02X）\\n", (unsigned)u8, (unsigned)u8);

    /* 0x80 是 8 位里唯一"没有正数对应"的模式 */
    unsigned char min8 = 0x80;
    printf("0x80 按 signed char 读 = %d\\n", (signed char)min8);
    return 0;
}
` },

    { t: 'callout', kind: 'note', title: '补码带来的三个好处', html:
      '<b>一、零只有一种写法</b>，<code>0</code> 和 <code>-0</code> 是同一个位模式。' +
      '<b>二、减法就是加法</b>：<code>a - b</code> 等于 <code>a + (-b)</code>，' +
      '而 <code>-b</code> 的位模式就是 <code>~b + 1</code>，硬件只需要一个加法器。' +
      '<b>三、范围不对称但连续</b>：N 位补码能表示 <code>-2^(N-1)</code> 到 <code>2^(N-1)-1</code>，' +
      '负数比正数多一个。所以 <code>INT_MIN</code> 是 <code>-2147483648</code>，' +
      '而 <code>INT_MAX</code> 是 <code>2147483647</code>。'
    },

    { t: 'callout', kind: 'warn', title: 'INT_MIN 取负会溢出', html:
      '<code>-INT_MIN</code> 在数学上等于 <code>2^31</code>，超出 <code>int</code> 能表示的范围，' +
      '这是<b>有符号溢出，属于未定义行为</b>。同理 <code>abs(INT_MIN)</code> 也不安全。' +
      '写"取绝对值"的代码时，要么用更宽的类型，要么先判断是否等于最小值。'
    },

    { t: 'h', text: '四、sizeof 与类型宽度', id: 'ch02-4' },

    { t: 'p', html:
      '<code>sizeof</code> 是一个<b>运算符</b>，不是函数：它在编译期就能算出结果，' +
      '返回值类型是 <code>size_t</code>，所以打印用 <code>%zu</code>。' +
      'C 标准只规定了每种类型的最小范围，没有规定确切宽度，' +
      '所以要判断"这个类型在我的机器上占几个字节"，唯一正确的方法就是 <code>sizeof</code>。'
    },

    { t: 'table', caption: '标准保证 vs 常见实现', head: ['类型', '标准保证的最小范围', '典型宽度', '说明'], rows: [
      ['<code>char</code>', '至少 8 位', '1 字节', '<code>sizeof(char)</code> 按定义恒为 1'],
      ['<code>short</code>', '至少 16 位', '2 字节', '转成 <code>int</code> 运算前会提升'],
      ['<code>int</code>', '至少 16 位', '4 字节', '最常见的默认整数类型'],
      ['<code>long</code>', '至少 32 位', 'Linux/macOS 8 字节，Windows 4 字节', '<b>不要假设它固定 8 字节</b>'],
      ['<code>long long</code>', '至少 64 位', '8 字节', '需要确定 64 位时用它'],
      ['<code>float</code>', '至少 6 位十进制有效数字', '4 字节', 'IEEE 754 单精度'],
      ['<code>double</code>', '至少 10 位十进制有效数字', '8 字节', 'IEEE 754 双精度'],
      ['<code>size_t</code>', '能装下任何对象大小', '8 字节（64 位平台）', '无符号，<code>sizeof</code> 与下标类型']
    ] },

    { t: 'code', lang: 'c', caption: 'sizeof_array.c —— sizeof 是运算符，对数组和指针完全不同', code:
`#include <stdio.h>

int main(void)
{
    int  arr[10];
    int *p = arr;          /* 数组名在大多数表达式里退化成首元素地址 */

    printf("sizeof(arr)  = %zu 字节\\n", sizeof arr);      /* 40 = 10 * 4 */
    printf("元素个数     = %zu\\n", sizeof arr / sizeof arr[0]);
    printf("sizeof(p)    = %zu 字节\\n", sizeof p);        /* 8：一个指针 */

    /* sizeof 不要求括号，但类型名必须带括号 */
    printf("sizeof int   = %zu\\n", sizeof(int));
    printf("sizeof 表达式不产生副作用：%zu\\n", sizeof(arr[0]));
    return 0;
}
` },

    { t: 'callout', kind: 'warn', title: 'sizeof(arr) 与 sizeof(p) 的区别是 C 的经典坑', html:
      '把数组传进函数，参数会<b>退化成一个指针</b>，所以在函数里 <code>sizeof(arr)</code> ' +
      '得到的是指针大小（8），不是数组总字节数。' +
      '这就是为什么函数处理数组时，必须<b>额外传一个长度参数</b>。' +
      '这个"数组传参退化"的规则，在讲指针与数组的那一章会正式展开。'
    },

    { t: 'h', text: 'struct 的内存布局：对齐与填充', lvl: 3 },

    { t: 'p', html:
      '结构体的成员在内存里按声明顺序排列，但<b>不是紧密挨着的</b>。' +
      '编译器会在成员之间插入<b>填充字节</b>（padding），让每个成员的地址满足它的对齐要求。' +
      '结果是 <code>sizeof(struct)</code> 常常大于成员大小之和。'
    },

    { t: 'code', lang: 'c', caption: 'layout.c —— 用 offsetof 看清填充', code:
`#include <stdio.h>
#include <stddef.h>

struct point {
    char tag;      /* 1 字节，但后面要补 3 字节，让 int 对齐到 4 */
    int  x;        /* 偏移 4 */
    int  y;        /* 偏移 8 */
};

struct mixed {
    char   c;      /* 偏移 0，后补 7 字节 */
    double d;      /* 偏移 8 */
    short  s;      /* 偏移 16，后补 6 字节让整体对齐到 8 */
};

int main(void)
{
    printf("sizeof(struct point) = %zu\\n", sizeof(struct point));
    printf("  offsetof(tag) = %zu\\n", offsetof(struct point, tag));
    printf("  offsetof(x)   = %zu\\n", offsetof(struct point, x));
    printf("  offsetof(y)   = %zu\\n", offsetof(struct point, y));

    printf("sizeof(struct mixed) = %zu\\n", sizeof(struct mixed));
    printf("  offsetof(c) = %zu\\n", offsetof(struct mixed, c));
    printf("  offsetof(d) = %zu\\n", offsetof(struct mixed, d));
    printf("  offsetof(s) = %zu\\n", offsetof(struct mixed, s));
    return 0;
}
` },

    { t: 'callout', kind: 'tip', title: '填充的代价与优化', html:
      '<code>struct mixed</code> 里 1 + 8 + 2 = 11 字节的数据，实际占了 24 字节，' +
      '超过一半是填充。<b>把成员按"从大到小"重排</b>通常能减少填充：' +
      '<code>double d; short s; char c;</code> 只需要 16 字节。' +
      '但要注意：布局改变会影响二进制兼容（比如文件格式、网络协议），所以涉及序列化时，' +
      '成员顺序是接口的一部分，不能随意调整。'
    },

    { t: 'h', text: '五、溢出与回绕', id: 'ch02-5' },

    { t: 'p', html:
      '一个 N 位的容器只能装 <code>2^N</code> 种值。超出范围时会发生什么，' +
      '取决于类型是<b>无符号</b>还是<b>有符号</b>——这两者的规则完全不同，' +
      '而且区别是 C 里最重要的分界线之一。'
    },

    { t: 'table', caption: '超出范围时的规则', head: ['类型', '规则', '标准地位', '后果'], rows: [
      ['<code>unsigned</code>', '按模 <code>2^N</code> 回绕，结果确定', '<b>良定义</b>', '<code>UINT_MAX + 1 == 0</code>'],
      ['<code>signed</code>', '数学结果超出范围即溢出', '<b>未定义行为</b>（UB）', '编译器可以生成任何代码，不保证回绕'],
      ['浮点', '溢出为无穷大，下溢为 0 或次正规数', 'IEEE 754 定义', '<code>1e308 * 10</code> 得 <code>inf</code>']
    ] },

    { t: 'code', lang: 'c', caption: 'overflow.c —— 无符号回绕是可预测的，有符号溢出不能碰', code:
`#include <stdio.h>
#include <limits.h>

int main(void)
{
    /* 无符号：回绕是标准规定的，可以放心观察 */
    unsigned int u = UINT_MAX;
    printf("UINT_MAX        = %u\\n", u);
    u = u + 1;                      /* 模 2^32，回到 0 */
    printf("UINT_MAX + 1    = %u\\n", u);

    unsigned int zero = 0;
    printf("0u - 1          = %u\\n", zero - 1);   /* 回绕到 UINT_MAX */

    /* 有符号：下面这行是未定义行为，不要真的执行
    int s = INT_MAX;
    s = s + 1;                      // UB：编译器有权做任何事
    */

    /* 正确做法：在加法之前检查是否越界 */
    int limit = INT_MAX;
    int add   = 1;
    if (limit > INT_MAX - add) {
        printf("会溢出，这里选择不执行加法\\n");
    } else {
        limit = limit + add;
        printf("safe = %d\\n", limit);
    }
    return 0;
}
` },

    { t: 'callout', kind: 'warn', title: '为什么有符号溢出比无符号可怕得多', html:
      '编译器会<b>假设有符号运算永不溢出</b>来优化代码。例如它可能把 ' +
      '<code>if (x + 1 &gt; x)</code> 直接优化成 <code>if (1)</code>，理由是"x + 1 不可能回绕"。' +
      '所以即使你的机器上"看起来回绕了"，换一个优化等级、换一个编译器，结果就可能完全不同。' +
      '这就是未定义行为：<b>标准不承诺任何结果，包括不承诺它"真的按位回绕"</b>。'
    },

    { t: 'callout', kind: 'exam', title: '溢出检测的标准写法', html:
      '加法：<code>a &gt; INT_MAX - b</code> 说明溢出。<br>' +
      '乘法：先转成更宽类型再判断，例如 <code>long long p = (long long)a * b;</code> ' +
      '再检查 <code>p &gt; INT_MAX</code>。<br>' +
      '更通用的做法是用 <code>__builtin_add_overflow</code>（GCC/Clang 提供），' +
      '或者把值域收窄到明确足够的类型上。' +
      '考试里常让你用前两种手写判断，一定写"在运算之前判断"，不能等溢出之后再看结果。'
    },

    { t: 'h', text: '六、隐式转换、截断与强制转换', id: 'ch02-6' },

    { t: 'p', html:
      'C 的表达式里，操作数类型不一致时会自动转换，这套规则叫<b>常规算术转换</b>。' +
      '其中最容易出错的一条是：<b>有符号与无符号混合运算时，有符号的那个会被转成无符号</b>。' +
      '也就是说，编译器不是"更小心地比较"，而是把负数变成巨大的正数再比。'
    },

    { t: 'code', lang: 'c', caption: 'convert.c —— 四类转换的实际结果', code:
`#include <stdio.h>

int main(void)
{
    /* 1. 截断：只保留低 8 位 */
    int big = 0x1234;
    unsigned char low = (unsigned char)big;
    printf("0x1234 的低字节 = 0x%02X（十进制 %u）\\n", (unsigned)low, (unsigned)low);

    /* 2. 有符号与无符号混合：-1 被解释成 4294967295 */
    int          neg = -1;
    unsigned int u   = 1;
    if (neg > u) {
        printf("-1 > 1u 为真：因为 -1 被转换成了 %u\\n", (unsigned)neg);
    }

    /* 3. 浮点转整数：直接丢弃小数部分，不四舍五入 */
    double pi = 3.99;
    int    t  = (int)pi;
    printf("(int)3.99 = %d\\n", t);

    /* 4. 大类型转小类型：高位被丢弃，结果依赖实现 */
    long long huge = 1000000000000LL;
    int       cut  = (int)huge;
    printf("(int)1000000000000LL = %d\\n", cut);

    /* 5. 强制转换的优先级：括号位置决定先算谁 */
    int total = 7, n = 2;
    printf("(double)total / n = %.2f\\n", (double)total / n);
    printf("(double)(total / n) = %.2f\\n", (double)(total / n));
    return 0;
}
` },

    { t: 'table', caption: '常见转换的方向与风险', head: ['转换', '规则', '风险'], rows: [
      ['<code>char</code> → <code>int</code>', '整型提升，值不变', '无（有符号时符号扩展）'],
      ['<code>int</code> → <code>unsigned int</code>', '位模式不变，按模解释', '<b>负数变巨大正数</b>'],
      ['<code>int</code> → <code>char</code>', '截断到低 8 位', '值可能完全改变，且 <code>char</code> 是否有符号由实现决定'],
      ['<code>double</code> → <code>int</code>', '截断小数部分', '超出范围是 UB；不四舍五入'],
      ['<code>int</code> → <code>double</code>', '精确（在 2^53 以内）', '超过 2^53 会丢精度'],
      ['有符号 → 更小的有符号类型', '结果由实现定义，可能产生信号', '不要依赖具体值']
    ] },

    { t: 'compare', lang: 'c', left: {
      title: '错误的长度比较', html: '当 <code>len</code> 是 <code>int</code>、<code>size</code> 是 <code>size_t</code> 时，' +
        '-1 会被转成巨大的无符号数，判断失效。', code:
`int    len  = -1;
size_t size = 10;

if (len < size) {
    /* 看起来会进来，实际上不会：
       (size_t)-1 = 18446744073709551615 */
    printf("len 更小\\n");
}`
    }, right: {
      title: '把两边都变成同一类型再比', html: '显式转换或先判断符号，让意图明确。', code:
`int    len  = -1;
size_t size = 10;

if (len >= 0 && (size_t)len < size) {
    printf("len 更小\\n");
} else {
    printf("len 非法或更大\\n");
}`
    } },

    { t: 'callout', kind: 'warn', title: '编译器的转换警告要认真看', html:
      '打开 <code>-Wall -Wextra</code> 后，<code>-Wsign-compare</code>（有符号与无符号比较）、' +
      '<code>-Wconversion</code>（隐式窄化）、<code>-Wsign-conversion</code> 会帮你抓出大部分问题。' +
      '本课建议：<b>只要涉及有符号与无符号混用，就显式写转换</b>，让读代码的人一眼看到你的意图。'
    },

    { t: 'terms', items: [
      { en: 'two\'s complement', zh: '补码', html: '现代 C 平台的负数表示法：<code>-x</code> 的位模式是 <code>~x + 1</code>。' },
      { en: 'bit / byte', zh: '位 / 字节', html: '位是最小单位；字节是内存可寻址的最小单位，通常 8 位。' },
      { en: 'sizeof', zh: '取大小运算符', html: '编译期求值，返回 <code>size_t</code>；对数组返回总字节数，对指针返回指针大小。' },
      { en: 'overflow / wraparound', zh: '溢出 / 回绕', html: '有符号溢出是 UB；无符号按模 2^N 回绕，是良定义的。' },
      { en: 'padding / alignment', zh: '填充 / 对齐', html: '为满足成员地址的对齐要求而插入的无用字节。' },
      { en: 'offsetof', zh: '成员偏移', html: '<code>&lt;stddef.h&gt;</code> 里的宏，求成员相对结构体起始的字节偏移。' }
    ] },

    { t: 'keypoint', items: [
      { title: '内存里只有位', html: '同一个位模式，换个类型就有不同解释；类型决定解释规则。' },
      { title: '进制只是写法', html: '<code>0x</code> 十六进制、<code>0</code> 开头八进制、无前缀十进制；<code>0b</code> 是 C23 才进标准。' },
      { title: '补码统一加减', html: '<code>-x = ~x + 1</code>；<code>INT_MIN</code> 的绝对值不可表示，取负即溢出。' },
      { title: '宽度用 sizeof 确认', html: '标准只保下限；<code>long</code> 在不同平台宽度不同。' },
      { title: '有符号溢出是 UB', html: '只有无符号回绕才是良定义的；加法前判断，别等溢出后检查。' },
      { title: '转换先看符号', html: '有符号与无符号混用会按无符号解释；显式转换让意图可见。' },
      { title: 'struct 有填充', html: '<code>sizeof(struct)</code> 可能大于成员之和；用 <code>offsetof</code> 验证。' }
    ] },

    { t: 'checklist', id: 'ch02', items: [
      '我能把 0x2A 读成 42，并说明它对应哪 8 个位',
      '我知道 <code>010</code> 是八进制 8，并会避免前导零写十进制',
      '我能用补码算出 -5 在 8 位和 32 位下的位模式',
      '我知道 <code>INT_MIN</code> 是 <code>-2147483648</code>，并能解释为什么它比 <code>INT_MAX</code> 的绝对值大 1',
      '我能用 <code>sizeof</code> 确认类型宽度，并区分 <code>sizeof(数组)</code> 与 <code>sizeof(指针)</code>',
      '我能说清无符号回绕与有符号溢出的不同标准地位',
      '我知道有符号与无符号混用会按无符号解释，并会显式转换',
      '我能画出含填充的结构体布局，并用 <code>offsetof</code> 验证'
    ] }
  ]
});
