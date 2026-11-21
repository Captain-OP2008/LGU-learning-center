/* =====================================================================
 * data/ch01.js · 第 01 章：C 程序的结构
 * 职责：把一个完整 C 程序拆到每个零件——头文件、main、语句与分号、
 *       printf 格式符、变量与基本类型、const、运算符优先级、注释。
 * 内容块 schema 见 学习中心/.work/AUTHORING.md；示例均按 C17 书写。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch01',
  num: '01',
  title: 'C 程序的结构',
  en: 'Program Anatomy',
  goals: [
    '能写出并解释一个最小可编译 C 程序的每个组成部分',
    '能正确使用 <code>printf</code> 的格式符与转义字符输出各类数据',
    '能声明变量、选择合适的基本类型，并用 <code>const</code> 表达"不该改"',
    '能说清整数除法、取模与浮点运算的差别，避免最常见的表达式陷阱',
    '能按优先级读懂复杂表达式，并用注释与命名让代码可读'
  ],
  kp: [
    { id: 'ch01-1', title: '最小的 C 程序' },
    { id: 'ch01-2', title: '#include 与头文件' },
    { id: 'ch01-3', title: 'main、语句与代码块' },
    { id: 'ch01-4', title: 'printf 与格式化输出' },
    { id: 'ch01-5', title: '变量、基本类型与 const' },
    { id: 'ch01-6', title: '运算符、优先级与注释' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      'C 的语法其实很小：一个文件里只有<b>预处理指令、声明、函数定义</b>三大类东西。' +
      '难的不是记住这些，而是理解<b>每个符号都在向编译器传达一个精确的约束</b>：' +
      '这个类型占几个字节、这个函数返回什么、这个分号是不是语句的结束。' +
      '这一章把你后面要写几千遍的骨架一次讲透，包括那些"能编过但结果是错的"细节。'
    },

    { t: 'p', lead: true, html:
      '上一章看到的是整条工具链，这一章回到源码本身。' +
      '下面这个程序只有十几行，却已经包含了 C 程序的全部结构要素。' +
      '我们逐层把它拆开：先看整体，再依次看头文件、主函数、语句、输出、变量与运算符。'
    },

    { t: 'h', text: '一、最小的 C 程序', id: 'ch01-1' },

    { t: 'code', lang: 'c', caption: 'arithmetic.c —— 十几行，结构要素齐全', code:
`#include <stdio.h>          /* 1. 预处理指令：引入 printf 的声明 */

int main(void)              /* 2. 程序入口：返回 int，不接收参数 */
{                           /* 3. 函数体开始 */
    int a = 12;             /* 4. 声明并初始化一个 int */
    int b = 5;
    int sum = a + b;        /* 5. 表达式求值后赋给变量 */

    printf("sum = %d\\n", sum);   /* 6. 调用库函数输出 */
    return 0;               /* 7. 返回值：0 表示正常结束 */
}                           /* 8. 函数体结束 */
` },

    { t: 'p', html:
      '把这八处拆开看，每一处都有明确职责。' +
      '<b>头文件</b>让编译器知道 <code>printf</code> 长什么样；' +
      '<b>main</b> 是操作系统加载程序后调用的第一个函数；' +
      '<b>花括号</b>划出一个作用域；<b>分号</b>结束一条语句；' +
      '<b>return 0</b> 把结束状态交还给操作系统。'
    },

    { t: 'table', caption: '一个 C 文件的组成', head: ['成分', '写法', '作用'], rows: [
      ['预处理指令', '<code>#include</code>、<code>#define</code>、<code>#if</code>', '交给预处理器，在编译前处理'],
      ['声明', '<code>double average(const int *, int);</code>', '告诉编译器"有这么个东西"，不产生代码'],
      ['定义', '函数体、全局变量', '真正产生代码或占用存储'],
      ['语句', '<code>int a = 1;</code>、<code>return 0;</code>', '函数体内可执行的一步，以分号结尾'],
      ['注释', '<code>/* ... */</code>、<code>// ...</code>', '给人看，预处理器阶段被删除']
    ] },

    { t: 'callout', kind: 'note', title: 'C 是编译型语言，不是脚本', html:
      'Python 那样逐行解释的语言，语句可以随意写在文件顶层；C 不行，' +
      '<b>所有可执行语句都必须待在一个函数里</b>。' +
      '你能在文件顶层写的，只有预处理指令、类型声明、函数声明和全局变量定义。' +
      '写完 <code>int x = 1;</code> 就直接写在函数外面，编译器不会执行它，只是定义了一个全局变量。'
    },

    { t: 'h', text: '二、#include 与头文件', id: 'ch01-2' },

    { t: 'p', html:
      '<code>#include &lt;stdio.h&gt;</code> 的意思是：<b>把 <code>stdio.h</code> 这个文件的全部内容，' +
      '在这里原样展开</b>。它的效果相当于你亲手把几千行函数声明复制粘贴进自己的文件。' +
      '尖括号表示"去系统头文件目录找"，双引号表示"先在我自己的目录找"。'
    },

    { t: 'code', lang: 'c', caption: 'includes.c —— 常用的四个头文件', code:
`#include <stdio.h>      /* printf, scanf, FILE, stderr */
#include <stdlib.h>     /* malloc, free, atoi, exit, EXIT_SUCCESS */
#include <string.h>     /* strlen, strcpy, strcmp, memcpy */
#include <stdint.h>     /* int32_t, uint8_t, UINT32_MAX —— 精确宽度的整数 */

int main(void)
{
    printf("size_t 是 %zu 字节\\n", sizeof(size_t));
    printf("uint8_t 最大能存 %u\\n", (unsigned)UINT8_MAX);

    char buf[8];
    strcpy(buf, "C");
    printf("字符串 \\"%s\\" 的长度是 %zu\\n", buf, strlen(buf));
    return 0;
}
` },

    { t: 'p', html:
      '这里有一个初学者常问的问题：<b>既然只是复制声明，那为什么要 include？</b>' +
      '因为在 C 里，调用一个函数之前，编译器必须知道它的参数类型和返回值类型。' +
      '如果不知道，C17 会直接报错（或给出 <code>implicit declaration</code> 警告），' +
      '哪怕这个函数在标准库里确实存在。'
    },

    { t: 'callout', kind: 'tip', title: '记不住该 include 什么怎么办', html:
      '查手册。每个标准函数的手册页顶部都会列出它所属的头文件，例如 ' +
      '<code>printf</code> 属于 <code>stdio.h</code>，<code>malloc</code> 属于 <code>stdlib.h</code>，' +
      '<code>strlen</code> 属于 <code>string.h</code>。' +
      '另外注意：数学函数（<code>sqrt</code>、<code>pow</code>）除了 <code>#include &lt;math.h&gt;</code>，' +
      '链接时还要加 <code>-lm</code>。这是链接阶段的问题，不是 include 的问题。'
    },

    { t: 'h', text: '三、main、语句与代码块', id: 'ch01-3' },

    { t: 'p', html:
      '<code>main</code> 是<b>约定俗成的入口</b>：操作系统把程序加载起来后，' +
      '运行时启动代码会调用 <code>main</code>。它的标准形态只有两种：' +
      '<code>int main(void)</code> 表示不接收命令行参数；' +
      '<code>int main(int argc, char *argv[])</code> 表示接收参数。' +
      '返回值必须是 <code>int</code>，交给操作系统作为<b>退出状态</b>：0 表示成功，非 0 表示失败。'
    },

    { t: 'code', lang: 'c', caption: 'main_forms.c —— 两种标准入口与退出状态', code:
`#include <stdio.h>

/* 形态一：不接收参数。void 表示"明确不接收"，不是"随便什么"。 */
int main(void)
{
    printf("没有命令行参数\\n");
    return 0;            /* 正常结束 */
}

/* 形态二：接收命令行参数，此处仅作展示，实际只能有一个 main。
int main(int argc, char *argv[])
{
    printf("参数个数 = %d\\n", argc);
    for (int i = 0; i < argc; i++) {
        printf("argv[%d] = %s\\n", i, argv[i]);
    }
    return argc > 1 ? 0 : 1;
}
*/
` },

    { t: 'p', html:
      '注意两点。<b>第一，<code>main</code> 里省略 <code>return</code> 时，C 标准规定等价于返回 0</b>' +
      '（这是 <code>main</code> 的特权，其他函数不行）；但本课一律显式写 <code>return 0;</code>，' +
      '读代码时不必去回忆这条特例。<b>第二，<code>void</code> 和空括号不是一回事</b>：' +
      'C17 里函数<b>定义</b>的空括号确实表示"没有参数"，但在<b>声明</b>中写 ' +
      '<code>int f();</code> 表示"参数未指定"，C23 才把两者统一成等价于 <code>(void)</code>。' +
      '所以本课一律写 <code>(void)</code>，让意图在任何标准下都明确。'
    },

    { t: 'p', html:
      '再看语句。C 的语句以<b>分号</b>结尾，这个分号是语句的一部分，不是装饰。' +
      '漏掉一个分号，编译器往往在<b>下一行</b>才报错——因为它一直读到下一行才发现"这里说不通"。' +
      '这就是为什么报错行号经常比你真正出错的位置晚一行。'
    },

    { t: 'compare', lang: 'c', left: {
      title: '漏分号：报错指向下一行', html: '编译器在 <code>int b = 2</code> 之后继续读，' +
        '直到看见 <code>int</code> 才发现语句没结束，于是报在下面的行号上。', code:
`int main(void)
{
    int a = 1
    int b = 2;
    return a + b;
}`
    }, right: {
      title: '正确写法', html: '每条语句以分号结束；即使一行写多条语句，也要每条都有分号。', code:
`int main(void)
{
    int a = 1;
    int b = 2;
    return a + b;
}`
    } },

    { t: 'callout', kind: 'warn', title: '花括号划出的是作用域，不只是排版', html:
      '一对花括号构成<b>块</b>（block），块里声明的变量只在这个块内可见，出了块就不存在。' +
      '<code>{ }</code> 的位置和缩进<b>不影响语义</b>，但影响人读代码的速度。' +
      '本课统一采用 Allman 风格（左花括号独占一行），你可以换风格，但一个项目要统一。'
    },

    { t: 'h', text: '四、printf 与格式化输出', id: 'ch01-4' },

    { t: 'p', html:
      '<code>printf</code> 的第一个参数是<b>格式串</b>，里面用 <code>%</code> 开头的占位符' +
      '标记"这里要插入一个值、按什么类型解释"。后面跟着的值必须与占位符<b>一一对应、类型匹配</b>。' +
      '这是 C 里少数完全不检查类型的接口之一——编译器只能给出警告，运行时错了就是未定义行为。'
    },

    { t: 'table', caption: 'printf 常用格式符', head: ['格式符', '对应类型', '示例输出'], rows: [
      ['<code>%d</code> / <code>%i</code>', '<code>int</code>', '<code>-42</code>'],
      ['<code>%u</code>', '<code>unsigned int</code>', '<code>3000000000</code>'],
      ['<code>%ld</code> / <code>%lld</code>', '<code>long</code> / <code>long long</code>', '<code>1234567890123</code>'],
      ['<code>%zu</code>', '<code>size_t</code>（<code>sizeof</code> 的结果）', '<code>8</code>'],
      ['<code>%f</code> / <code>%.2f</code>', '<code>double</code>（<code>float</code> 会自动提升）', '<code>3.14</code> / <code>3.14</code>'],
      ['<code>%e</code>', '<code>double</code>，科学计数法', '<code>3.140000e+00</code>'],
      ['<code>%c</code>', '<code>char</code>', '<code>A</code>'],
      ['<code>%s</code>', '<code>char *</code>（C 字符串）', '<code>hello</code>'],
      ['<code>%x</code> / <code>%o</code>', '无符号整数的十六进制 / 八进制', '<code>ff</code> / <code>377</code>'],
      ['<code>%p</code>', '<code>void *</code> 指针', '<code>0x7ffd...</code>'],
      ['<code>%%</code>', '无参数，输出一个百分号', '<code>%</code>']
    ] },

    { t: 'code', lang: 'c', caption: 'printf_demo.c —— 格式、宽度、精度与转义', code:
`#include <stdio.h>

int main(void)
{
    int    n     = 42;
    double pi    = 3.14159265358979;
    char   ch    = 'C';
    char   name[] = "C course";
    unsigned int big = 4000000000u;

    printf("十进制 = %d，十六进制 = %x，八进制 = %o\\n", n, n, n);
    printf("无符号 = %u\\n", big);
    printf("圆周率 = %f\\n", pi);
    printf("圆周率（两位）= %.2f\\n", pi);
    printf("圆周率（八位）= %.8f\\n", pi);
    printf("科学计数 = %e\\n", pi);
    printf("字符 = %c，字符串 = %s\\n", ch, name);

    printf("宽 6 右对齐：[%6d]\\n", n);
    printf("宽 6 左对齐：[%-6d]\\n", n);
    printf("补零：[%06d]\\n", n);
    printf("百分号本身 = 100%%\\n");

    printf("制表符\\t这之后有缩进\\n");
    printf("引号 \\" 与反斜杠 \\\\ 也可以输出\\n");
    return 0;
}
` },

    { t: 'callout', kind: 'warn', title: '格式符写错不会报错，只会给你垃圾值', html:
      '把 <code>double</code> 用 <code>%d</code> 打印，或者在 <code>%s</code> 位置传一个整数，' +
      '编译器通常只给 <code>-Wformat</code> 警告，程序照样跑——然后输出一个随机数，甚至崩溃。' +
      '原因与函数调用的参数传递方式有关：<b>可变参数函数不检查参数类型，只按格式串的指示去读内存</b>。' +
      '本课后面讲栈帧与函数调用时会再回来解释这件事。' +
      '所以打开 <code>-Wall</code>，并且认真对待每一条格式警告。'
    },

    { t: 'h', text: '格式串的复合写法', lvl: 3 },

    { t: 'p', html:
      '格式说明可以组合：<code>%8.3f</code> 表示"总宽至少 8、小数 3 位"，' +
      '<code>%.3s</code> 表示"字符串最多输出 3 个字符"。' +
      '另外 <code>*</code> 可以把宽度或精度从参数里取，写对齐表格时很有用。'
    },

    { t: 'code', lang: 'c', caption: 'format_extra.c —— 宽度、精度与动态参数', code:
`#include <stdio.h>

int main(void)
{
    double pi = 3.14159265;
    const char *s = "programming";

    printf("[%8.3f]\\n", pi);       /* 总宽 8，小数 3 位 */
    printf("[%-8.3f]\\n", pi);      /* 左对齐 */
    printf("[%.3s]\\n", s);         /* 最多输出 3 个字符 */
    printf("[%10.4s]\\n", s);       /* 总宽 10，最多 4 个字符 */

    /* 宽度和精度用 * 从参数取 */
    int width = 12;
    int prec  = 2;
    printf("[%*.*f]\\n", width, prec, pi);

    /* 用格式化输出对齐一组数据 */
    printf("%-10s %6s\\n", "name", "score");
    printf("%-10s %6d\\n", "Alice", 92);
    printf("%-10s %6d\\n", "Bob", 78);
    return 0;
}
` },

    { t: 'terms', items: [
      { en: 'format string', zh: '格式串', html: '<code>printf</code> 的第一个参数，含 <code>%</code> 占位符的模板。' },
      { en: 'escape sequence', zh: '转义序列', html: '用反斜杠表示无法直接输入的字符，如 <code>\\n</code>、<code>\\t</code>、<code>\\\\</code>。' },
      { en: 'placeholder', zh: '占位符', html: '格式串中 <code>%</code> 加转换说明的那一小段，如 <code>%05.2f</code>。' },
      { en: 'return value', zh: '返回值', html: '函数结束时交回调用者的值；<code>main</code> 的返回值成为进程退出状态。' }
    ] },

    { t: 'h', text: '五、变量、基本类型与 const', id: 'ch01-5' },

    { t: 'p', html:
      'C 的变量声明必须给出类型，而且<b>类型在编译期就固定</b>，运行中不会变。' +
      '类型决定了三件事：占几个字节、按什么规则解释这些字节、能做哪些运算。' +
      '下面是本课最常用的几个类型；大小是<b>典型值</b>，标准只规定了下限，' +
      '真正的值一律用 <code>sizeof</code> 确认。'
    },

    { t: 'table', caption: '基本类型（典型 64 位平台）', head: ['类型', 'sizeof', '范围 / 精度', '用途'], rows: [
      ['<code>char</code>', '1', '至少 <code>-128..127</code>（此处 <code>signed</code>）', '单个字节、字符、原始数据'],
      ['<code>short</code>', '2', '至少 <code>-32768..32767</code>', '省内存的小整数'],
      ['<code>int</code>', '4', '<code>-2147483648..2147483647</code>', '默认整数'],
      ['<code>unsigned int</code>', '4', '<code>0..4294967295</code>', '位模式、计数、哈希'],
      ['<code>long</code>', '8（Linux/macOS）', '与平台有关，Windows 上常是 4', '大整数，但别假设宽度'],
      ['<code>long long</code>', '8', '至少 64 位', '确定要 64 位时用它'],
      ['<code>float</code>', '4', '约 6–7 位有效十进制数字', '省空间的浮点'],
      ['<code>double</code>', '8', '约 15–16 位有效数字', '默认浮点类型'],
      ['<code>size_t</code>', '8', '无符号，能表示任何对象大小', '<code>sizeof</code> 与数组下标的类型']
    ] },

    { t: 'code', lang: 'c', caption: 'types.c —— 声明、初始化、const 与 sizeof', code:
`#include <stdio.h>
#include <limits.h>

int main(void)
{
    int    count = 0;          /* 声明时就初始化，避免不确定的值 */
    double ratio = 0.75;
    char   grade = 'A';

    const int MAX_ITEMS = 100; /* 只读：编译器禁止后续赋值 */
    const double TAX = 0.08;

    printf("count = %d, ratio = %f, grade = %c\\n", count, ratio, grade);
    printf("MAX_ITEMS = %d, TAX = %.2f\\n", MAX_ITEMS, TAX);

    printf("sizeof(int)    = %zu\\n", sizeof(int));
    printf("sizeof(double) = %zu\\n", sizeof(double));
    printf("sizeof(char)   = %zu\\n", sizeof(char));
    printf("int 的最大值   = %d\\n", INT_MAX);
    printf("int 的最小值   = %d\\n", INT_MIN);

    /* MAX_ITEMS = 200;   编译错误：assignment of read-only variable */
    return 0;
}
` },

    { t: 'callout', kind: 'warn', title: '局部变量不初始化就是不确定值', html:
      '在函数里写 <code>int x;</code> 却不赋值，<code>x</code> 里是<b>上一个使用者留下的垃圾</b>，' +
      '不是 0。读它是未定义行为——可能得到一个看起来正常的数，也可能每次运行都不一样。' +
      '本课要求：<b>每个变量声明时就初始化</b>，除非你立刻要把它交给 <code>scanf</code> 之类的函数写入。'
    },

    { t: 'p', html:
      '<b>命名规范</b>没有强制标准，但业界有共识：变量与函数用小写加下划线（<code>total_score</code>）；' +
      '宏与编译期常量用全大写（<code>MAX_ITEMS</code>）；类型名可用 <code>_t</code> 结尾；' +
      '标识符不能以数字开头，且<b>区分大小写</b>（<code>Count</code> 和 <code>count</code> 是两个东西）。' +
      '名字要能回答"这里面存的是什么"，不要用 <code>a1</code>、<code>temp2</code> 这种。'
    },

    { t: 'h', text: '六、运算符、优先级与注释', id: 'ch01-6' },

    { t: 'p', html:
      'C 的算术运算符和数学课本几乎一样，只有两个地方必须警惕：' +
      '<b>整数除法会直接丢弃小数部分</b>，以及<b>取模结果的符号跟随被除数</b>。' +
      '这两条是考试和真实 bug 的双重高发区。'
    },

    { t: 'code', lang: 'c', caption: 'operators.c —— 算术、整数除法、取模与复合赋值', code:
`#include <stdio.h>

int main(void)
{
    int a = 7, b = 2;

    printf("a + b   = %d\\n", a + b);
    printf("a - b   = %d\\n", a - b);
    printf("a * b   = %d\\n", a * b);
    printf("a / b   = %d   <- 3，小数部分被直接丢弃\\n", a / b);
    printf("a %% b   = %d   <- 1\\n", a % b);

    /* 想让除法保留小数，至少有一个操作数得是浮点类型 */
    printf("a / 2.0 = %.2f\\n", a / 2.0);

    /* 负数取模：C99 起结果符号跟随被除数 */
    printf("-7 / 2  = %d\\n", -7 / 2);
    printf("-7 %% 2  = %d\\n", -7 % 2);

    int x = 5;
    x += 3;      /* x = x + 3，得 8 */
    x *= 2;      /* x = x * 2，得 16 */
    x++;         /* 后缀自增，得 17 */
    printf("x = %d\\n", x);

    /* 强制类型转换：明确告诉编译器"按这个类型算" */
    int total = 7, n = 2;
    double avg = (double)total / n;
    printf("avg = %.2f\\n", avg);
    return 0;
}
` },

    { t: 'callout', kind: 'warn', title: '1 / 2 等于 0', html:
      '两个整数相除，做的是<b>整数除法</b>，结果仍为整数：<code>1 / 2</code> 得 <code>0</code>，' +
      '<code>3 / 2</code> 得 <code>1</code>。这不是"四舍五入"，是直接截断。' +
      '要得到 0.5，写成 <code>1.0 / 2</code> 或 <code>(double)1 / 2</code>。' +
      '更隐蔽的写法是 <code>double half = 1 / 2;</code>——右边先按整数算出 0，再转成 0.0，类型正确但值错。'
    },

    { t: 'table', caption: '常见运算符优先级（由高到低）', head: ['优先级', '运算符', '结合性', '例子'], rows: [
      ['1', '<code>()</code> <code>[]</code> <code>.</code> <code>-&gt;</code> <code>++</code>（后缀）', '从左到右', '<code>a[i]++</code>'],
      ['2', '<code>!</code> <code>~</code> <code>+</code> <code>-</code> <code>*</code> <code>&amp;</code>（前缀） <code>sizeof</code> <code>(类型)</code>', '从右到左', '<code>!flag</code>、<code>(double)n</code>'],
      ['3', '<code>*</code> <code>/</code> <code>%</code>', '从左到右', '<code>a * b / c</code>'],
      ['4', '<code>+</code> <code>-</code>', '从左到右', '<code>a - b + c</code>'],
      ['5', '<code>&lt;&lt;</code> <code>&gt;&gt;</code>', '从左到右', '<code>x &lt;&lt; 2</code>'],
      ['6', '<code>&lt;</code> <code>&lt;=</code> <code>&gt;</code> <code>&gt;=</code>', '从左到右', '<code>a &lt; b</code>'],
      ['7', '<code>==</code> <code>!=</code>', '从左到右', '<code>a == b</code>'],
      ['8–10', '<code>&amp;</code> <code>^</code> <code>|</code>（位运算）', '从左到右', '<code>flags &amp; MASK</code>'],
      ['11–12', '<code>&amp;&amp;</code> <code>||</code>', '从左到右', '<code>a &amp;&amp; b</code>'],
      ['13', '<code>? :</code>', '从右到左', '<code>a &gt; b ? a : b</code>'],
      ['14', '<code>=</code> <code>+=</code> <code>-=</code> 等', '从右到左', '<code>a = b = 0</code>'],
      ['15', '<code>,</code>', '从左到右', '<code>a = 1, b = 2</code>']
    ] },

    { t: 'p', html:
      '不用背这张表，只需要记住三条经验：<b>拿不准就加括号</b>；' +
      '<code>&amp;</code> 的优先级比 <code>==</code> 低（所以 <code>flags &amp; 1 == 1</code> 会先算 <code>1 == 1</code>，' +
      '这几乎总是错的，应写 <code>(flags &amp; 1) == 1</code>）；' +
      '<code>=</code> 和 <code>==</code> 混淆是最经典的错误，编译器通常只给警告。'
    },

    { t: 'p', html:
      '最后是注释。C 有两种：<code>/* ... */</code> 是多行注释，可以跨行但<b>不能嵌套</b>；' +
      '<code>// ...</code> 是单行注释，到行尾结束。注释在预处理阶段被删掉，' +
      '所以注释里写什么都不会影响程序；也正因如此，<b>不要用注释去"关掉"一段本身含多行注释的代码</b>，' +
      '否则外层注释会提前结束。'
    },

    { t: 'code', lang: 'c', caption: 'comments.c —— 注释的写法与常见误用', code:
`#include <stdio.h>

/*
 * 多行注释：解释这一整段代码的意图。
 * 注意它不能嵌套：注释里再出现一对注释符号，外层会在那里提前结束。
 */

int main(void)
{
    int total = 0;      /* 行尾注释：解释这一行，简短有效 */

    // 单行注释：到行尾结束
    total = 1 + 2 + 3;

    /* 不要用注释去"关掉"已有的代码块，里面若含注释符号就会出错：
    total = 0;
    printf("hello\\n");
    */

    printf("total = %d\\n", total);
    return 0;
}
` },

    { t: 'callout', kind: 'tip', title: '注释该写什么', html:
      '不要写 <code>/* 把 a 加 1 */</code> 这种重复代码本身的注释。' +
      '该写的是：<b>为什么</b>要这样做、这个函数的<b>前置条件</b>、这个魔数<b>从哪来</b>、' +
      '以及这里<b>看起来奇怪但没有 bug</b> 的原因。' +
      '代码说"怎么做"，注释说"为什么"。'
    },

    { t: 'h', text: '那些最常见的编译警告', lvl: 3 },

    { t: 'p', html:
      '<code>-Wall -Wextra</code> 打开之后警告会变多。它们不是噪音：' +
      '下面这几条几乎都指向真实的 bug。养成"警告清零"的习惯，比事后调试省几十倍时间。'
    },

    { t: 'table', caption: '常见警告与含义', head: ['警告关键词', '含义', '怎么改'], rows: [
      ['<code>unused variable</code>', '变量声明了却没有使用', '删掉，或确认是不是漏写了逻辑'],
      ['<code>implicit declaration of function</code>', '调用前没有声明，通常缺头文件', '补上对应的 <code>#include</code>'],
      ['<code>format specifies type ... but the argument has type ...</code>', '格式符与参数类型不匹配', '按格式符表改格式符或参数'],
      ['<code>control reaches end of non-void function</code>', '有返回值的函数存在没 return 的路径', '补 <code>return</code>，或改返回类型为 <code>void</code>'],
      ['<code>comparison of integer expressions of different signedness</code>', '有符号与无符号混合比较', '显式转换，或统一两边类型'],
      ['<code>variable may be used uninitialized</code>', '使用了未初始化的局部变量', '声明时就赋初值']
    ] },

    { t: 'keypoint', items: [
      { title: '一个文件三类东西', html: '预处理指令、声明、定义；可执行语句必须待在函数里。' },
      { title: 'include 是文本替换', html: '它只提供声明，让编译器认识函数签名；不产生任何代码。' },
      { title: 'main 是入口', html: '返回 <code>int</code> 作为退出状态，0 表示成功。' },
      { title: '分号是语句的一部分', html: '漏分号通常报在下一行；花括号划出作用域。' },
      { title: 'printf 的格式符必须匹配', html: '可变参数不做类型检查，写错得到的是未定义行为而不是报错。' },
      { title: '整数除法会截断', html: '<code>1 / 2 == 0</code>；要小数就至少让一个操作数成为浮点。' }
    ] },

    { t: 'checklist', id: 'ch01', items: [
      '我能不看资料写出一个带 <code>#include</code>、<code>main</code>、变量与 <code>printf</code> 的完整程序',
      '我能解释 <code>#include</code> 到底做了什么、为什么不能省',
      '我能说出 <code>main</code> 的两种标准形态，并正确使用返回值',
      '我能为 <code>int</code>、<code>double</code>、<code>char</code>、<code>size_t</code> 选择正确的格式符',
      '我知道局部变量不初始化是垃圾值，并且总是初始化',
      '我能说清 <code>1 / 2</code> 为什么是 0，并写出正确的浮点除法',
      '我知道 <code>=</code> 与 <code>==</code>、<code>&amp;</code> 与 <code>==</code> 的优先级陷阱'
    ] }
  ]
});
