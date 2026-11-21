/* =====================================================================
 * data/ch00.js · 第 00 章：序章 —— 从源码到程序
 * 职责：把"一段文本如何变成正在运行的进程"这条链路讲清楚，
 *       建立内存与地址的初印象，给出三类错误与学习方法的框架。
 * 内容块 schema 见 学习中心/.work/AUTHORING.md；示例均按 C17 书写。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch00',
  num: '00',
  title: '序章：从源码到程序',
  en: 'Prologue',
  goals: [
    '能画出并解释源码 → 预处理 → 编译 → 汇编 → 链接 → 可执行文件这条链路',
    '能说清编译器、汇编器、链接器各自负责什么，以及为什么 C 依赖目标平台',
    '建立「内存是一排带编号的字节」的初印象，知道地址是什么',
    '能区分编译错误、运行时错误与逻辑错误，并按正确的顺序排查',
    '知道这门课的学习方法：写完整程序、真的编译、看报错、改一处再重编'
  ],
  kp: [
    { id: 'ch00-1', title: '从一段文本开始' },
    { id: 'ch00-2', title: '预处理：编译前的文本搬运' },
    { id: 'ch00-3', title: '编译与汇编：翻成机器指令' },
    { id: 'ch00-4', title: '链接：把零件装成整机' },
    { id: 'ch00-5', title: '内存与地址初识' },
    { id: 'ch00-6', title: '三类错误与学习法' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '大多数 C 课第一句就是 <code>#include &lt;stdio.h&gt;</code>，然后就开始背格式符。' +
      '但如果不先看清「你写下的那几行文本，经过几个程序的处理，最后变成 CPU 真正执行的指令」，' +
      '后面遇到 <code>undefined reference</code>、<code>Segmentation fault</code>、' +
      '「在我电脑上能跑」这些问题时，你会完全不知道发生了什么。' +
      '这一章不教语法，只做一件事：<b>把 C 的整条工具链和运行模型先立起来</b>。'
    },

    { t: 'p', lead: true, html:
      'C 是一门很"直"的语言：你写的每一行，几乎都能对应到机器上的几个动作；' +
      '你想的每一个数据，都实实在在躺在内存的某个字节里。' +
      '代价是，这条从文本到进程的路必须由你自己走完——<b>没有虚拟机、没有解释器替你做决定</b>。' +
      '所以先认识路上的每一个关卡，是后面所有内容的地基。'
    },

    { t: 'h', text: '一、从一段文本开始', id: 'ch00-1' },

    { t: 'p', html:
      '新建一个文件 <code>hello.c</code>，写入下面七行。这是本课第一个完整程序：' +
      '有头文件、有函数、有语句、有返回值，可以直接编译运行。'
    },

    { t: 'code', lang: 'c', caption: 'hello.c —— 最小的完整 C 程序', code:
`#include <stdio.h>

int main(void)
{
    printf("hello, C\\n");
    return 0;
}
` },

    { t: 'p', html:
      '你敲的这七行叫<b>源代码</b>（source code），是纯文本，人能读，CPU 读不懂。' +
      '要让电脑执行它，中间要经过四个程序：<code>预处理器</code>、<code>编译器</code>、' +
      '<code>汇编器</code>、<code>链接器</code>。它们大多被打包成一条命令——' +
      '在终端里执行 <code>cc</code> 或者 <code>gcc</code> 就够了。'
    },

    { t: 'p', html:
      '编译只需要一条命令：<code>cc -std=c17 -Wall -Wextra hello.c -o hello</code>，' +
      '然后执行 <code>./hello</code>，屏幕上应该出现 <code>hello, C</code>。' +
      '这次先把 <code>cc</code> 当成一个黑盒：它读 <code>hello.c</code>，吐出一个叫 <code>hello</code> 的程序。' +
      '下一节开始拆开看它内部做了什么。'
    },

    { t: 'flow', dir: 'v', nodes: [
      { title: 'hello.c · 源代码', desc: '你敲的纯文本，约 60 字节', kind: 'proc' },
      { title: '预处理', desc: '展开 #include、#define，删除注释', kind: 'proc' },
      { title: 'hello.i · 翻译单元', desc: '一份被撑大的、只剩声明与语句的 C 文本', kind: 'proc' },
      { title: '编译', desc: '语法分析、类型检查、优化，生成汇编', kind: 'proc' },
      { title: 'hello.s · 汇编', desc: '一条条 mov / add / call 指令', kind: 'proc' },
      { title: '汇编', desc: '把助记符逐条编码成机器码', kind: 'proc' },
      { title: 'hello.o · 目标文件', desc: '二进制，但还缺 printf 的实现', kind: 'proc' },
      { title: '链接', desc: '把本文件的代码和标准库拼在一起', kind: 'proc' },
      { title: 'hello · 可执行文件', desc: '操作系统能加载并运行的格式', kind: 'decide' }
    ] },

    { t: 'callout', kind: 'note', title: '为什么分成这么多步', html:
      '如果每次改一行就要重新把整个标准库翻一遍，开发会慢得难以忍受。' +
      '拆成多步的好处是<b>可以分别缓存</b>：头文件和库基本不变，' +
      '只要重新处理你改动的那个 <code>.c</code> 文件即可。' +
      '大型项目动辄上千个源文件，靠的正是这个"分工 + 复用"的结构。' +
      '本课后期会教你把命令拆开，分别执行每一步来观察中间产物。'
    },

    { t: 'h', text: '二、预处理：编译前的文本搬运', id: 'ch00-2' },

    { t: 'p', html:
      '预处理器是一个<b>只会做文本替换的程序</b>。它不理解类型、不理解语法，' +
      '只认得以 <code>#</code> 开头的指令。最常见的两条：' +
      '<code>#include</code>（把另一个文件的全部内容原样插进来）和 ' +
      '<code>#define</code>（定义名字替换规则）。'
    },

    { t: 'code', lang: 'c', caption: 'preprocess.c —— 宏就是文本替换', code:
`#include <stdio.h>

#define PI 3.14159
#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define SQUARE(x) ((x) * (x))

int main(void)
{
    double r = 2.0;

    /* PI 在编译前就被替换成 3.14159 */
    printf("周长 = %.5f\\n", 2 * PI * r);

    /* 宏参数没有类型，3 和 5 原样替换进去 */
    printf("较大者 = %d\\n", MAX(3, 5));

    /* 展开后是 ((2 + 1) * (2 + 1))，所以括号必须写全 */
    printf("平方 = %d\\n", SQUARE(2 + 1));
    return 0;
}
` },

    { t: 'callout', kind: 'warn', title: '宏的括号不是装饰', html:
      '如果把 <code>SQUARE(x)</code> 写成 <code>#define SQUARE(x) x * x</code>，' +
      '那么 <code>SQUARE(2 + 1)</code> 会被展开成 <code>2 + 1 * 2 + 1</code>，结果是 <code>5</code> 而不是 <code>9</code>。' +
      '<b>宏没有"参数"这个概念，只有文本</b>。这条规则贯穿全课：看到宏，先在脑子里做一遍替换。' +
      '到后面讲泛型与抽象时，你会看到 <code>static inline</code> 函数这种更安全的替代写法：' +
      '它像函数一样做类型检查，又不会带来真正的调用开销。'
    },

    { t: 'p', html:
      '还有一个附带效果：<b>注释在这一步被彻底删除并替换成一个空格</b>。' +
      '所以 <code>int/*注释*/x;</code> 仍然是合法的 <code>int x;</code>，' +
      '但注释不能用来切断一个标识符。理解这一点，你就不会奇怪为什么有些语法错误指向的行' +
      '"看起来完全没问题"——你看到的是源码，编译器看到的是预处理之后的那份文本。'
    },

    { t: 'table', head: ['指令', '作用', '本课常见用法'], rows: [
      ['<code>#include &lt;stdio.h&gt;</code>', '把系统头文件的内容插入当前位置', '用到 <code>printf</code> / <code>scanf</code> / <code>FILE</code>'],
      ['<code>#include "stats.h"</code>', '插入自己项目里的头文件', '多文件项目共享函数声明'],
      ['<code>#define N 100</code>', '定义一个文本替换的名字', '数组容量、常量、条件编译开关'],
      ['<code>#ifdef / #ifndef / #endif</code>', '按条件决定哪段文本留下', '头文件保护，防止重复包含'],
      ['<code>#error</code>', '故意让预处理失败', '平台不满足要求时给出清晰提示']
    ] },

    { t: 'h', text: '三、编译与汇编：翻成机器指令', id: 'ch00-3' },

    { t: 'p', html:
      '编译器的输入是"翻译单元"，输出是汇编文本。它做的事比文本替换复杂得多：' +
      '先把你写的字符切成<b>记号</b>（token），再按语法规则拼成<b>语法树</b>，' +
      '然后做类型检查，最后生成目标平台的指令序列。你写的 <code>printf("hello, C\\n");</code> ' +
      '会变成类似下面这样的东西（x86-64，精简过）：'
    },

    { t: 'code', lang: 'c', caption: '编译器生成的机器码思路（示意，不是逐字输出）', code:
`//  把字符串地址放进 rdi（printf 的第 1 个参数）
//  lea  rdi, [rip + .L.str]
//  mov  eax, 0            // printf 是变参函数，eax 记录使用的向量寄存器个数
//  call printf
//  mov  eax, 0            // return 0 的值放进返回值寄存器

// 数据段里：
// .L.str:
//   .asciz "hello, C\\n"
` },

    { t: 'p', html:
      '这里有两个必须现在建立的偏见。第一，<b>机器码是平台相关的</b>：' +
      '同样的 C 源码，在 x86-64 的 Linux 上和在 ARM 的 Mac 上，编出来的指令完全不同。' +
      'C 代码本身是"可移植的"，但可执行文件不是。第二，<b>编译器会重排、会省略、 ' +
      '甚至会把整段代码优化掉</b>。所以你后面学"未定义行为"时要记住：' +
      '你不是在描述一份逐字执行的剧本，而是在给编译器一个必须遵守的约束。'
    },

    { t: 'table', head: ['阶段', '输入', '输出', '典型报错'], rows: [
      ['预处理', '<code>.c</code>', '<code>.i</code>', '<code>fatal error: stdio.h: No such file</code>'],
      ['编译', '<code>.i</code>', '<code>.s</code>', '<code>error: expected \';\' before ...</code>'],
      ['汇编', '<code>.s</code>', '<code>.o</code>', '几乎不报错，语法由编译器生成'],
      ['链接', '<code>.o</code> + 库', '可执行文件', '<code>undefined reference to `foo\'</code>']
    ] },

    { t: 'callout', kind: 'tip', title: '看到报错先判断是哪一段', html:
      '报错信息里出现 <code>error: expected ...</code>、<code>warning: ...</code>，说明卡在<b>编译阶段</b>，' +
      '问题在你写的语法或类型上；出现 <code>undefined reference</code>、<code>multiple definition</code>，' +
      '说明语法过了，卡在<b>链接阶段</b>，问题在"声明有了但实现没找到"。' +
      '这两类错误的原因完全不同，别混着查。'
    },

    { t: 'h', text: '四、链接：把零件装成整机', id: 'ch00-4' },

    { t: 'p', html:
      '<code>hello.o</code> 里只有你的 <code>main</code> 和一句"这里要调用一个叫 <code>printf</code> 的东西，' +
      '它的地址我以后再填"。链接器的工作就是：<b>把所有目标文件拼起来，' +
      '把每个未解析的名字找到唯一确定的地址</b>。找不到就报 <code>undefined reference</code>；' +
      '找到两个就报 <code>multiple definition</code>。'
    },

    { t: 'p', html:
      '真实项目一定是多文件的。下面三个文件分别扮演：入口、接口声明、实现。' +
      '注意头文件里放的是<b>声明</b>（告诉编译器"有这么个函数，参数和返回值长这样"），' +
      '<code>.c</code> 文件里放的是<b>定义</b>（真正的函数体）。'
    },

    { t: 'tabs', items: [
      { label: 'main.c', blocks: [
        { t: 'code', lang: 'c', caption: 'main.c —— 只要声明，不需要知道实现细节', code:
`#include <stdio.h>
#include "stats.h"

int main(void)
{
    int scores[] = {88, 92, 79, 95};
    int n = (int)(sizeof scores / sizeof scores[0]);

    printf("共 %d 个数，平均分 = %.2f\\n", n, average(scores, n));
    return 0;
}
` }
      ] },
      { label: 'stats.h', blocks: [
        { t: 'code', lang: 'c', caption: 'stats.h —— 声明，被两个 .c 文件共享', code:
`#ifndef STATS_H
#define STATS_H

/* 返回数组平均值；n 必须大于 0，data 不能为空 */
double average(const int *data, int n);

#endif /* STATS_H */
` }
      ] },
      { label: 'stats.c', blocks: [
        { t: 'code', lang: 'c', caption: 'stats.c —— 定义，编译成 stats.o', code:
`#include "stats.h"

double average(const int *data, int n)
{
    long sum = 0;
    for (int i = 0; i < n; i++) {
        sum += data[i];
    }
    return (double)sum / n;
}
` }
      ] }
    ] },

    { t: 'p', html:
      '把它们一起编译：<code>cc -std=c17 -Wall -Wextra main.c stats.c -o statdemo</code>。' +
      '编译器会分别产出 <code>main.o</code> 和 <code>stats.o</code>，链接器再把两个目标文件' +
      '和 C 标准库拼成 <code>statdemo</code>。<b><code>printf</code> 不在你的代码里，' +
      '它来自标准库</b>——这就是为什么必须链接库。'
    },

    { t: 'callout', kind: 'note', title: '头文件不参与"执行"', html:
      '<code>#include "stats.h"</code> 的效果是把声明抄进 <code>main.c</code> 和 <code>stats.c</code> 各一份。' +
      '头文件本身<b>从不单独编译</b>，也不产生任何代码。它唯一的职责是让每个 <code>.c</code> ' +
      '看到同一份接口描述，从而在语法上能互相调用。'
    },

    { t: 'h', text: '五、内存与地址初识', id: 'ch00-5' },

    { t: 'p', html:
      '程序运行时，所有数据都在<b>内存</b>里。你可以把内存想成一条极长的走廊，' +
      '走廊被隔成一间间<b>字节</b>（byte），每间房有一个编号，这个编号就叫<b>地址</b>。' +
      'C 里可以用 <code>&amp;</code> 取一个变量的地址，用 <code>%p</code> 打印它。' +
      '下面这段程序先把"变量住在哪"这件事变成可见的：'
    },

    { t: 'code', lang: 'c', caption: 'address.c —— 变量、字节与地址', code:
`#include <stdio.h>

int main(void)
{
    int  a = 42;
    int  b = 100;
    char text[] = "C";

    printf("a    = %d，地址 = %p\\n", a, (void *)&a);
    printf("b    = %d，地址 = %p\\n", b, (void *)&b);
    printf("text = %s，地址 = %p\\n", text, (void *)text);

    printf("int  占 %zu 字节\\n", sizeof(int));
    printf("char 占 %zu 字节\\n", sizeof(char));
    printf("char[2] 占 %zu 字节（'C' 加结尾的零字节）\\n", sizeof text);
    return 0;
}
` },

    { t: 'p', html:
      '几个必须现在记住的结论。第一，<b>每个变量占若干连续字节</b>，' +
      '<code>int</code> 通常占 4 个字节，<code>char</code> 恰好 1 个。' +
      '第二，<b>地址的值每次运行都可能不同</b>——现代操作系统会做地址随机化，' +
      '所以不要把某次打印出来的地址当成固定值背下来。' +
      '第三，<code>%p</code> 要求参数是 <code>void *</code>，所以这里写了强制转换，' +
      '这是少数必须显式转换的场景之一。'
    },

    { t: 'callout', kind: 'warn', title: '两个新手必踩的坑', html:
      '一是把地址当"内容"打印：<code>printf("%d", &amp;a)</code> 是错的，' +
      '地址不是 <code>int</code>，应该用 <code>%p</code> 并转成 <code>void *</code>。' +
      '二是以为变量在内存里是按声明顺序紧挨着排的：<b>编译器有权重排、对齐、甚至把变量整个放进寄存器</b>，' +
      '所以相邻变量的地址差通常不是它们大小之和。这些细节第五章讲指针、第六章讲栈帧时会正式展开。'
    },

    { t: 'terms', items: [
      { en: 'source code', zh: '源代码', html: '你写的 <code>.c</code> 纯文本，给人读，不能用 CPU 直接执行。' },
      { en: 'translation unit', zh: '翻译单元', html: '预处理之后交给编译器的完整文本，一个 <code>.c</code> 加它所包含的头文件。' },
      { en: 'object file', zh: '目标文件', html: '编译产出的二进制中间件，含机器码与待解析的符号名。' },
      { en: 'linker', zh: '链接器', html: '把多个目标文件和库合成一个可执行文件的程序。' },
      { en: 'undefined behavior', zh: '未定义行为', html: '标准没有规定结果的操作；编译器可以生成任何代码，程序不保证有意义。' }
    ] },

    { t: 'h', text: '六、三类错误与学习法', id: 'ch00-6' },

    { t: 'p', html:
      '和任何语言一样，C 的错误可以分成三类。区别在于：C 的第三类和第五类（内存错误）' +
      '往往<b>不报错、不崩溃，只是悄悄给出错误结果</b>，这是它比解释型语言难的地方。' +
      '先建立分类，再谈排查。'
    },

    { t: 'table', head: ['类型', '什么时候出现', '典型表现', '怎么查'], rows: [
      ['<b>编译错误</b>', '编译/链接时', '根本没生成可执行文件', '看第一条 error 的行号，从最上面往下改'],
      ['<b>运行时错误</b>', '执行到某一步时', '<code>Segmentation fault</code>、除零被终止、断言失败', '用 <code>printf</code> 打印进度，或开 <code>-fsanitize=address</code>'],
      ['<b>逻辑错误</b>', '不报错', '程序跑完了，但答案不是你要的', '对照预期，缩小范围，逐段打印中间值']
    ] },

    { t: 'p', html:
      '下面两个文件故意演示"编译不过"和"能编过但会崩/算错"。' +
      '请真的复制到本地各编译一次，亲眼看这两类错误长什么样——' +
      '报错文本的样子，是这门课最值得早点熟悉的东西。'
    },

    { t: 'code', lang: 'c', caption: 'bad_syntax.c —— 故意少一个分号，编译阶段就被拦下', code:
`#include <stdio.h>

int main(void)
{
    int price = 100      /* 缺少分号：编译器会在下一行报 expected ';' */
    int count = 3;

    printf("%d\\n", price * count);
    return 0;
}
` },

    { t: 'code', lang: 'c', caption: 'runtime_vs_logic.c —— 一个会崩，一个会算错', code:
`#include <stdio.h>

int main(void)
{
    int price = 100;
    int count = 0;       /* 这里本该是 3 */

    /* 逻辑错误：语法完全合法，但语义错了，结果 103 */
    int total = price + count;
    printf("total = %d\\n", total);

    /* 运行时错误：整数除以 0，进程会被操作系统直接终止 */
    printf("average = %d\\n", price / count);
    return 0;
}
` },

    { t: 'callout', kind: 'warn', title: '读编译报错的正确姿势', html:
      '编译器一次会吐出几十行警告，新手容易从第一行读到最后。正确做法：' +
      '<b>只看第一条 error</b>，按它给的行号去改；很多后面的错误是第一处错误引发的连锁反应。' +
      '警告也不要无视：<code>-Wall -Wextra</code> 打开的警告里，相当一部分正是未定义行为的前兆。' +
      '本课要求你<b>始终带着这两个开关编译</b>。'
    },

    { t: 'h', text: '学习方法：写、编、跑、改', lvl: 3 },

    { t: 'p', html:
      '本站的代码块是<b>只读展示</b>的，没有内置运行按钮。这不是缺陷，而是刻意的：' +
      'C 必须真的经过编译和链接，才能看到真实的行为与真实的报错。' +
      '在网页里点一下"运行"得到的幻觉，替代不了本地那条命令。'
    },

    { t: 'steps', items: [
      { title: '准备一个能编译的环境', html: 'Linux / macOS 自带 <code>cc</code>；Windows 装 MSYS2 或 WSL 后同样用 <code>cc</code>。本课只要求一条能跑通的编译命令。' },
      { title: '先原样跑通', html: '把正文里的完整程序抄成文件，编译、运行，对比输出与讲解是否一致。不一致就先解决不一致。' },
      { title: '每次只改一处', html: '改一个数字、一个格式符、一行顺序，重新编译。改动是最便宜的理解方式。' },
      { title: '主动制造错误', html: '故意删掉分号、故意除零、故意越界。见过错误长什么样，下次它出现时你才认得出来。' },
      { title: '合上正文重写', html: '不看原文，从空文件把同样的程序写出来。卡住的地方就是还没真正掌握的地方。' }
    ] },

    { t: 'compare', left: {
      title: '低效学法', html: '把正文当小说读，<b>一行代码都不编译</b>；报错就怀疑编译器；' +
        '把源码和可执行文件混为一谈；只背格式符不写程序。'
    }, right: {
      title: '高效学法', html: '每段都<b>编译一次、运行一次</b>；把报错当线索而非失败；' +
        '清楚每个阶段产出了什么文件；用完整程序练手，而不是孤立地背语法。'
    } },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      'AI 能几秒钟写出能编译的 C 代码，但<b>不能替你建立"这段代码在内存里怎么动"的直觉</b>。' +
      '正确用法：先自己写、自己编、自己错一遍，再让 AI 对比你的写法，问它' +
      '"我这段为什么编译不过、它改的那一行依据是什么"。' +
      '如果跳过动手，你会得到一堆能跑的代码，和一个遇到崩溃就束手无策的自己。'
    },

    { t: 'keypoint', items: [
      { title: '一条链路', html: '源码 → 预处理 → 编译 → 汇编 → 链接 → 可执行文件；每一步都有对应产物与典型报错。' },
      { title: '编译器不做整体执行', html: '它只负责把你的翻译单元翻成机器码；运行时行为由指令和内存状态决定。' },
      { title: '可执行文件是平台相关的', html: 'C 源码可移植，但编译产物绑定指令集与操作系统。' },
      { title: '内存是带地址的字节', html: '<code>&amp;</code> 取地址、<code>sizeof</code> 量字节；地址每次运行可能不同。' },
      { title: '错误分三类', html: '编译错误一行都跑不了；运行时错误中途崩；逻辑错误跑完但结果错，最难查。' },
      { title: '下一章', html: '把 <code>hello.c</code> 拆开：主函数、头文件、语句、格式符、变量与类型。' }
    ] },

    { t: 'checklist', id: 'ch00', items: [
      '我能说出预处理、编译、汇编、链接各做了什么',
      '我能解释 <code>undefined reference</code> 和 <code>expected \';\'</code> 分别出在哪个阶段',
      '我已经在本机用一条编译命令跑通过一个完整 C 程序',
      '我知道什么是字节、什么是地址，并能用 <code>%p</code> 打印变量地址',
      '我能区分编译错误、运行时错误和逻辑错误',
      '我知道本课的学习方法是"写、编、跑、改"'
    ] }
  ]
});
