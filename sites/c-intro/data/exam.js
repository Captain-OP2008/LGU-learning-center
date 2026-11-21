/* =====================================================================
 * data/exam.js · C 语言与系统基础 模拟卷 A / B
 * A 卷：ch00–ch05，19 题 / 100 分 / 90 分钟（编译、程序结构、整数、位运算、字符串、指针）
 * B 卷：ch06–ch09 + 综合，19 题 / 100 分 / 90 分钟（栈堆、malloc、结构体、函数指针、文件 IO、参数、内存安全）
 * 结构：{ id, title, style, subtitle, date, minutes, totalScore, summary,
 *         instructions, questions:[…] }
 *       question.parts[] 是判分单位：kind = choice | tf | fill | output | keywords
 * 注入：CSC.registerExam({...})；同时挂 CSC._exams 供引擎首屏读取
 * 代码：全部为标准 C（C99/C11）；输出题均按标准语义逐行推演
 * ===================================================================== */
(function () {
  'use strict';

  /* ================================================================ A 卷 */
  var A = {
    id: 'C-A',
    title: 'C 语言模拟卷 A',
    style: '期末风格',
    subtitle: 'C 语言与系统基础 · 覆盖 ch00–ch05（编译/整数/位运算/字符串/指针）',
    date: '2026-11-12',
    minutes: 90,
    totalScore: 100,
    summary: '本卷覆盖 ch00–ch05：从编译四阶段与程序结构，到整数与 sizeof、位运算、字符与 C 字符串，再到指针与数组。题目以概念辨析、读程序写输出和简答为主，适合在完成前六章后做一次 90 分钟的限时自测。所有代码按 C99/C11 编写，不依赖实现相关的 sizeof(int) 或地址值。',
    instructions: [
      '闭卷限时 90 分钟，满分 100 分；建议先完成选择与填空，再留时间逐行推演输出题。',
      '选择题与判断题直接点击选项；填空题只写结果或表达式，不要附加说明文字。',
      '输出题必须逐行写出程序的<strong>精确</strong>输出，注意空格、大小写、十六进制字母大小写与换行。',
      '简答题按关键词给分，请写出关键术语、运算符或核心语句；答案会给出完整参考文本供人工对照。',
      '所有代码按 C99/C11 标准；不考查有符号溢出、越界访问等未定义行为，也不要求记忆实现相关的 <code>sizeof(int)</code> 值。'
    ],
    questions: [
      {
        no: 1, points: 4, type: '单选题',
        intro: '本题考察从源文件到可执行文件的构建流程。',
        parts: [
          {
            points: 4, kind: 'choice',
            prompt: '把 <code>hello.c</code> 变成可执行文件，通常经历下面哪一串阶段？',
            options: [
              { text: '预处理 → 汇编 → 编译 → 链接' },
              { text: '预处理 → 编译 → 汇编 → 链接', correct: true },
              { text: '编译 → 预处理 → 汇编 → 链接' },
              { text: '预处理 → 编译 → 链接 → 汇编' }
            ],
            explain: '预处理展开 <code>#include</code>、宏与条件编译，得到翻译单元；编译把翻译单元翻译成汇编；汇编器把汇编翻译成目标文件（<code>.o</code> / <code>.obj</code>）；链接器合并目标文件与库、解析外部符号，生成可执行文件。四个阶段的顺序不能交换。'
          }
        ]
      },
      {
        no: 2, points: 4, type: '单选题',
        intro: '本题考察 main 函数、头文件与声明/定义的分工。',
        parts: [
          {
            points: 4, kind: 'choice',
            prompt: '关于 C 程序的结构与构建，下列哪一项是正确的？',
            options: [
              { text: '一个可执行程序可以包含多个 <code>main</code> 函数，链接器会自动选用第一个' },
              { text: '<code>int main(void)</code> 是标准允许的 main 定义形式之一，返回 0 表示程序成功结束', correct: true },
              { text: '<code>#include &lt;stdio.h&gt;</code> 会把 <code>printf</code> 的实现代码复制到源文件中' },
              { text: '函数只要在调用之前声明过原型即可，链接时不需要它的定义' }
            ],
            explain: '标准规定 <code>main</code> 的返回类型是 <code>int</code>，<code>int main(void)</code> 是合法形式；返回 0（或 <code>EXIT_SUCCESS</code>）表示成功。一个程序只能有一个 <code>main</code>。头文件只提供声明，<code>printf</code> 的实现由链接器从 C 运行库中解析；函数可以只声明后调用，但链接时必须有定义。'
          }
        ]
      },
      {
        no: 3, points: 4, type: '单选题',
        intro: '本题考察 C 标准保证的整数类型性质。',
        parts: [
          {
            points: 4, kind: 'choice',
            prompt: '下列哪一项是 C 标准明确保证的？',
            options: [
              { text: '<code>sizeof(int) == 4</code>' },
              { text: '<code>char</code> 类型一定是有符号的' },
              { text: '<code>sizeof(char) == 1</code>', correct: true },
              { text: '<code>int</code> 至少 64 位' }
            ],
            explain: '<code>sizeof(char)</code> 按定义恒为 1，一个字节至少 8 位；<code>sizeof(int)</code>、<code>char</code> 是否有符号、<code>int</code> 的位数都由实现决定（标准只要求 <code>int</code> 至少 16 位）。因此不能假定 <code>sizeof(int) == 4</code>。'
          }
        ]
      },
      {
        no: 4, points: 4, type: '单选题',
        intro: '本题考察常见的位运算技巧。',
        parts: [
          {
            points: 4, kind: 'choice',
            prompt: '设 <code>x</code> 是无符号整数且 <code>x != 0</code>。表达式 <code>x &amp; (x - 1)</code> 的效果是：',
            options: [
              { text: '把最低位设置为 1' },
              { text: '清除最低位的那个 1', correct: true },
              { text: '把高 4 位与低 4 位交换' },
              { text: '判断 x 是否为偶数' }
            ],
            explain: '设 <code>x = 0b101100</code>，则 <code>x - 1 = 0b101011</code>，按位与得到 <code>0b101000</code>：最低位的 1 被清除，更高位不变。这个技巧常用来统计二进制中 1 的个数：<code>while (x) { x = x &amp; (x - 1); count++; }</code>。'
          }
        ]
      },
      {
        no: 5, points: 4, type: '单选题',
        intro: '读下面的程序，回答问题。',
        code: String.raw`#include <stdio.h>

int main(void) {
    char s[] = "cat";
    char *p = "cat";
    printf("%s\n", s);
    printf("%s\n", p);
    return 0;
}`,
        codeTitle: 'C',
        parts: [
          {
            points: 4, kind: 'choice',
            prompt: '关于数组 <code>s</code> 与指针 <code>p</code>，下列哪项正确？',
            options: [
              { text: '<code>sizeof(s)</code> 等于 3' },
              { text: '<code>sizeof(s)</code> 等于 4，而 <code>sizeof(p)</code> 与一个指针的大小相同', correct: true },
              { text: '<code>s</code> 与 <code>p</code> 都可以用来修改字符串的内容' },
              { text: '<code>p</code> 指向的字符数组存放在栈上，离开 main 就失效' }
            ],
            explain: '<code>s</code> 是用字符串字面量初始化的字符数组，长度 4（含结尾空字符），内容可修改；<code>p</code> 是指针，指向静态存储的字符串字面量，<code>sizeof(p)</code> 是指针大小。通过 <code>p</code> 修改字面量是未定义行为，不应这么做。'
          }
        ]
      },
      {
        no: 6, points: 4, type: '单选题',
        intro: '读程序，判断指针运算的结果。',
        code: String.raw`#include <stdio.h>

int main(void) {
    int a[5] = {10, 20, 30, 40, 50};
    int *p = a + 1;
    printf("%d\n", *(p + 1));
    return 0;
}`,
        codeTitle: 'C',
        parts: [
          {
            points: 4, kind: 'choice',
            prompt: '下列哪个表达式与程序打印的值相同？',
            options: [
              { text: '<code>a[2]</code>', correct: true },
              { text: '<code>*p + 1</code>' },
              { text: '<code>p[2]</code>' },
              { text: '<code>*(a + 1) + 1</code>' }
            ],
            explain: '<code>p</code> 指向 <code>a[1]</code>，所以 <code>p + 1</code> 指向 <code>a[2]</code>，解引用得 30。<code>*p + 1</code> 是 21，<code>p[2]</code> 是 40，<code>*(a + 1) + 1</code> 也是 21。'
          }
        ]
      },
      {
        no: 7, points: 4, type: '单选题',
        intro: '本题考察 const 与指针的结合。',
        parts: [
          {
            points: 4, kind: 'choice',
            prompt: '下列声明中，哪个表示「<code>p</code> 指向的 int 不能被修改，但 <code>p</code> 本身可以改指向别处」？',
            options: [
              { text: '<code>const int *p;</code>', correct: true },
              { text: '<code>int * const p;</code>' },
              { text: '<code>const int * const p;</code>' },
              { text: '<code>int *p const;</code>' }
            ],
            explain: '<code>const int *p</code>：被指对象只读，指针本身可改指向；<code>int * const p</code>：指针本身只读，被指对象可改；<code>const int * const p</code>：两者都只读。声明从右向左读有助于区分。'
          }
        ]
      },
      {
        no: 8, points: 3, type: '判断题',
        intro: '判断下列说法是否符合 C 标准。',
        parts: [
          {
            points: 3, kind: 'tf',
            prompt: 'C 标准保证 <code>sizeof(char) == 1</code>；<code>sizeof(int)</code> 的具体值由实现决定，不能假定它一定是 4。',
            options: [
              { text: 'True', correct: true },
              { text: 'False' }
            ],
            explain: '标准只规定 <code>char</code> 的大小为 1 字节、<code>int</code> 至少 16 位；常见平台上 <code>sizeof(int) == 4</code>，但这是实现定义值，不能写进可移植代码的假设里。'
          }
        ]
      },
      {
        no: 9, points: 3, type: '判断题',
        intro: '判断下列说法是否正确。',
        parts: [
          {
            points: 3, kind: 'tf',
            prompt: `<code>char s[] = "hello";</code> 与 <code>char *p = "hello";</code> 都创建了可修改的字符数组，因此都可以执行 <code>s[0] = 'H'</code> 和 <code>p[0] = 'H'</code>。`,
            options: [
              { text: 'True' },
              { text: 'False', correct: true }
            ],
            explain: '<code>s</code> 是字符数组，内容可修改；<code>p</code> 是指针，指向静态存储的字符串字面量，通过 <code>p</code> 修改内容属于未定义行为。两者并不都是可修改的数组。'
          }
        ]
      },
      {
        no: 10, points: 4, type: '填空题',
        intro: '补全编译流程中的术语。',
        parts: [
          {
            points: 4, kind: 'fill',
            prompt: '在「预处理 → 编译 → 汇编 → 链接」四个阶段中，把预处理后的 C 翻译单元转换成汇编代码的阶段称为____。',
            answer: '编译',
            accept: ['编译阶段', '编译器', 'compiler', 'compilation', 'compile'],
            explain: '预处理产出 <code>.i</code> 翻译单元，编译阶段把它翻译成汇编（<code>.s</code>），汇编器再生成目标文件，最后由链接器生成可执行文件。'
          }
        ]
      },
      {
        no: 11, points: 4, type: '填空题',
        intro: 'C99 起，整数除法与取余的舍入方向已有明确规定。',
        parts: [
          {
            points: 4, kind: 'fill',
            prompt: '<code>printf("%d %d", -7 / 2, -7 % 2);</code> 会输出什么？按「商 余数」的顺序写，两个数之间用一个空格分隔。',
            answer: '-3 -1',
            explain: 'C99 规定整数除法向零截断：<code>-7 / 2</code> 得 -3（而不是 -4）；余数的符号与被除数相同：<code>-7 % 2</code> 得 -1。因此输出 <code>-3 -1</code>。'
          }
        ]
      },
      {
        no: 12, points: 4, type: '填空题',
        intro: '本题考察位掩码。',
        parts: [
          {
            points: 4, kind: 'fill',
            prompt: '要把无符号整数 <code>x</code> 的低 4 位保留、其余位全部清零，应写成 <code>x &amp; ____</code>（填一个掩码常量）。',
            answer: '0x0F',
            accept: ['0xF', '15', '0x0f', '0x0000000F'],
            explain: '掩码的低 4 位为 1、其余位为 0，即二进制 <code>0000 1111</code>，十六进制写作 <code>0x0F</code>。按位与后只有低 4 位可能保留。'
          }
        ]
      },
      {
        no: 13, points: 8, type: '读程序写输出',
        intro: '逐行写出下面程序的标准输出。',
        code: String.raw`#include <stdio.h>

int main(void) {
    char c = '7';
    int i = c - '0';
    printf("%c\n", c);
    printf("%d\n", i);
    printf("%d\n", (int)sizeof(c));
    printf("%d\n", 7 / 2 * 2);
    return 0;
}`,
        codeTitle: 'C',
        parts: [
          {
            points: 8, kind: 'output',
            prompt: '写出程序的标准输出（共 4 行）。',
            answer: '7\n7\n1\n6',
            explain: '<code>c</code> 是字符 <code>7</code>；C 保证数字字符 <code>0</code>–<code>9</code> 连续，<code>c - \'0\'</code> 得到数字值 7；<code>sizeof(c)</code> 恒为 1；<code>7 / 2</code> 整除得 3，再乘 2 得 6。四行依次为 7、7、1、6。'
          }
        ]
      },
      {
        no: 14, points: 8, type: '读程序写输出',
        intro: '读下面的位运算程序，按小题要求写出输出。',
        code: String.raw`#include <stdio.h>

int main(void) {
    unsigned int x = 0xB4;   /* 1011 0100 */
    unsigned int y = x & 0x0F;
    unsigned int z = x | 0x03;
    unsigned int w = x ^ 0xFF;
    printf("%02X\n", y);
    printf("%02X\n", z);
    printf("%02X\n", w);
    printf("%u\n", (x >> 4) & 1);
    return 0;
}`,
        codeTitle: 'C',
        parts: [
          {
            points: 5, kind: 'output',
            prompt: '写出前 3 行输出。',
            answer: '04\nB7\n4B',
            explain: '<code>x = 0xB4</code>。<code>y = x &amp; 0x0F</code> 只保留低 4 位，得 <code>0x04</code>；<code>z = x | 0x03</code> 把最低两位置 1，得 <code>0xB7</code>；<code>w = x ^ 0xFF</code> 把低 8 位逐位取反，得 <code>0x4B</code>。<code>%02X</code> 输出两位大写十六进制，不足两位补 0。'
          },
          {
            points: 3, kind: 'output',
            prompt: '写出最后 1 行输出。',
            answer: '1',
            explain: '<code>x &gt;&gt; 4</code> 得 <code>0x0B</code>（二进制 1011），再与 1 按位与取最低位，结果为 1，即原数第 4 位（从 0 开始编号）是 1。<code>%u</code> 按无符号十进制输出 1。'
          }
        ]
      },
      {
        no: 15, points: 8, type: '读程序写输出',
        intro: '逐行写出下面字符串程序的标准输出。',
        code: String.raw`#include <stdio.h>
#include <string.h>

int main(void) {
    char s[] = "hello";
    char t[8];
    strcpy(t, s);
    t[0] = 'H';
    printf("%s\n", t);
    printf("%zu\n", strlen(t));
    printf("%d\n", (int)sizeof(s));
    printf("%c\n", s[4]);
    return 0;
}`,
        codeTitle: 'C',
        parts: [
          {
            points: 8, kind: 'output',
            prompt: '写出程序的标准输出（共 4 行）。',
            answer: 'Hello\n5\n6\no',
            explain: '<code>strcpy</code> 把 <code>hello</code> 复制到 <code>t</code>，再把首字母改为 H，得到 <code>Hello</code>；<code>strlen</code> 不计算结尾空字符，长度为 5；<code>sizeof(s)</code> 是数组大小，包含结尾空字符，等于 6；<code>s[4]</code> 是字符 <code>o</code>。<code>%zu</code> 用于输出 <code>size_t</code>。'
          }
        ]
      },
      {
        no: 16, points: 8, type: '读程序写输出',
        intro: '读下面的指针与数组程序，按小题要求写出输出。',
        code: String.raw`#include <stdio.h>

void swap(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int main(void) {
    int a[4] = {2, 4, 6, 8};
    int *p = a;
    swap(&a[0], &a[3]);
    printf("%d %d\n", a[0], a[3]);
    printf("%d\n", *(p + 2));
    p++;
    printf("%d\n", *p);
    printf("%d\n", (int)(&a[3] - &a[0]));
    return 0;
}`,
        codeTitle: 'C',
        parts: [
          {
            points: 4, kind: 'output',
            prompt: '写出第 1 行输出。',
            answer: '8 2',
            explain: '<code>swap</code> 通过指针交换 <code>a[0]</code> 与 <code>a[3]</code>，数组变为 <code>{8, 4, 6, 2}</code>，所以第一行是 <code>8 2</code>。'
          },
          {
            points: 4, kind: 'output',
            prompt: '写出后 3 行输出（每行一个结果）。',
            answer: '6\n4\n3',
            explain: '<code>p</code> 仍指向 <code>a[0]</code>，<code>*(p + 2)</code> 是 <code>a[2]</code>，得 6；<code>p++</code> 后指向 <code>a[1]</code>，解引用得 4；同一数组内两个指针相减得到相隔的元素个数，<code>&amp;a[3] - &amp;a[0]</code> 为 3。'
          }
        ]
      },
      {
        no: 17, points: 8, type: '简答',
        intro: '本题考察位运算的四个基本操作。',
        parts: [
          {
            points: 8, kind: 'keywords',
            prompt: '设 <code>x</code> 是 <code>unsigned int</code>，位号 <code>n</code> 从 0 开始且为合法位号。分别写出：①将第 n 位置 1；②将第 n 位清 0；③翻转第 n 位；④判断第 n 位是否为 1 的条件表达式（写出其中一种即可）。',
            keywords: [
              ['1U << n', '1u<<n', '1 << n'],
              ['|=', 'x |=', '置 1', '置位'],
              ['&= ~', '&=~', '清 0', '清零'],
              ['^=', '翻转', 'toggle'],
              ['(x >> n) & 1', 'x & (1U << n)', '>> n) & 1', '测试']
            ],
            answer: '（关键词给分，人工对照）\n① x |= (1U << n);\n② x &= ~(1U << n);\n③ x ^= (1U << n);\n④ if ((x >> n) & 1U) 或 if (x & (1U << n))\n说明：掩码统一用 1U，避免有符号左移；n 必须小于 unsigned int 的位宽。',
            explain: '置 1 用按位或，清 0 用「与上掩码取反」，翻转用异或，测试既可以把目标位移到最低位再与 1，也可以直接与掩码按位与。用 <code>1U</code> 可以避免有符号整数的左移问题。'
          }
        ]
      },
      {
        no: 18, points: 7, type: '找 bug / 简答',
        intro: '阅读程序，解释为什么没有达到预期效果，并给出修改。',
        code: String.raw`#include <stdio.h>

void add_one(int x) {
    x = x + 1;
}

int main(void) {
    int n = 41;
    add_one(n);
    printf("%d\n", n);
    return 0;
}`,
        codeTitle: 'C',
        parts: [
          {
            points: 7, kind: 'keywords',
            prompt: '程序希望把 <code>n</code> 加 1，但输出仍是 41。指出原因，并写出修改后的 <code>add_one</code> 定义与调用语句。',
            keywords: [
              ['值传递', '按值传递', 'by value'],
              ['副本', '拷贝', '复制', 'copy'],
              ['指针', 'pointer', '地址传递', '传地址'],
              ['&n', '取地址'],
              ['*x', '解引用', 'dereference']
            ],
            answer: '（关键词给分，人工对照）C 的函数参数按值传递：add_one(n) 只是把 n 的值复制给形参 x，函数内修改 x 不会影响 main 中的 n，所以输出仍是 41。修改为传地址：\nvoid add_one(int *x) {\n    *x = *x + 1;\n}\n调用处写 add_one(&n);，此时输出 42。',
            explain: '形参 <code>x</code> 是实参 <code>n</code> 的独立副本，赋值只改副本。要修改调用者的对象，必须把地址传进去，在函数内通过 <code>*x</code> 解引用写回。'
          }
        ]
      },
      {
        no: 19, points: 7, type: '简答',
        intro: '本题考察编译与链接的分工。',
        code: String.raw`#include <stdio.h>

int square(int x);

int main(void) {
    printf("%d\n", square(5));
    return 0;
}`,
        codeTitle: 'C',
        parts: [
          {
            points: 7, kind: 'keywords',
            prompt: "上面的程序能通过编译，却在链接时报 <code>undefined reference to 'square'</code>。解释原因，并给出两种可行的修改方式。",
            keywords: [
              ['声明', 'declaration', '原型'],
              ['没有定义', '缺少定义', 'no definition'],
              ['链接', 'link', 'linker'],
              ['undefined reference', '未定义引用'],
              ['函数体', '函数实现', 'definition']
            ],
            answer: '（关键词给分，人工对照）int square(int x); 只是函数声明（原型），它让编译器知道参数和返回类型，编译 main 时生成对 square 的外部引用。链接器在所有目标文件和库中找不到 square 的定义（缺少定义），于是报 undefined reference。修改一：在本文件补上函数实现（定义），例如 int square(int x) { return x * x; }。修改二：把定义放在另一个源文件（如 square.c），和 main.c 一起编译链接：gcc main.c square.c -o main。',
            explain: '编译阶段只检查声明与调用是否匹配；链接阶段才负责把每个外部引用解析到真正的定义。只有声明没有定义时，编译通过而链接失败。'
          }
        ]
      }
    ]
  };

  /* ================================================================ B 卷 */
  var B = {
    id: 'C-B',
    title: 'C 语言模拟卷 B',
    style: '期末风格',
    subtitle: 'C 语言与系统基础 · 覆盖 ch06–ch09 与综合（栈堆/malloc/函数指针/文件 IO/内存安全）',
    date: '2026-11-12',
    minutes: 90,
    totalScore: 100,
    summary: '本卷覆盖 ch06–ch09 并做跨章综合：栈与堆、malloc/free、结构体、函数指针与 qsort、文件 IO、命令行参数，以及内存安全与调用栈。题目强调资源管理与标准语义，不要求预测未定义行为的结果。建议在完成全部十章后限时完成。',
    instructions: [
      '闭卷限时 90 分钟，满分 100 分；输出题请先在草稿纸上画出内存与栈帧变化。',
      '选择题与判断题直接点击选项；填空题只写结果或核心语句，不要附加说明文字。',
      '输出题按行书写，注意空格、大小写和换行；行尾多余空格不影响判分。',
      '简答与找 bug 题按关键词给分，请写出术语、函数名和关键操作；参考答案会给出完整文本供人工对照。',
      '代码按 C99/C11 标准；不考查有符号溢出、越界访问、未初始化值等未定义行为的具体结果。'
    ],
    questions: [
      {
        no: 1, points: 4, type: '单选题',
        intro: '本题考察栈与堆的存储位置。',
        parts: [
          {
            points: 4, kind: 'choice',
            prompt: '下列对象中，存储期通常由 <code>malloc</code> 管理、位于堆上的是：',
            options: [
              { text: '函数内定义的 <code>int a[10];</code>' },
              { text: '<code>malloc</code> 返回的块', correct: true },
              { text: '函数的形参' },
              { text: '字符串字面量 <code>"hello"</code>' }
            ],
            explain: '函数内的自动数组和形参通常位于栈帧中，函数返回即失效；字符串字面量位于静态存储区，生命周期贯穿整个程序；只有 <code>malloc</code> 返回的块由堆分配器管理。'
          }
        ]
      },
      {
        no: 2, points: 4, type: '单选题',
        intro: '本题考察 malloc/free 的标准语义。',
        parts: [
          {
            points: 4, kind: 'choice',
            prompt: '关于 <code>malloc</code> / <code>free</code>，下列哪项正确？',
            options: [
              { text: '<code>malloc(0)</code> 一定返回 NULL，不能使用' },
              { text: '<code>free(NULL)</code> 是合法的，什么也不做', correct: true },
              { text: '<code>malloc</code> 返回的内存一定被初始化为全 0' },
              { text: '<code>free(p)</code> 会把变量 <code>p</code> 本身置为 NULL' }
            ],
            explain: '<code>malloc(0)</code> 可以返回 NULL，也可以返回一个可传给 <code>free</code> 的唯一指针；<code>free(NULL)</code> 是空操作；<code>malloc</code> 不初始化内存（<code>calloc</code> 才清零）；<code>free</code> 只释放所指的块，不会修改指针变量本身。'
          }
        ]
      },
      {
        no: 3, points: 4, type: '单选题',
        intro: '本题考察函数指针的声明语法。',
        parts: [
          {
            points: 4, kind: 'choice',
            prompt: '哪个声明表示「指向函数的指针」，该函数接收两个 <code>const void *</code> 并返回 <code>int</code>？',
            options: [
              { text: '<code>int *cmp(const void *, const void *);</code>' },
              { text: '<code>int (*cmp)(const void *, const void *);</code>', correct: true },
              { text: '<code>int (*cmp(const void *, const void *))(int);</code>' },
              { text: '<code>void (*cmp)(const void *, const void *);</code>' }
            ],
            explain: '函数指针要把 <code>*cmp</code> 放在括号里：<code>int (*cmp)(参数列表)</code>。A 是返回 <code>int *</code> 的函数；C 是返回函数指针的函数；D 的返回类型是 <code>void</code>，与 <code>qsort</code> 要求的 <code>int</code> 不符。'
          }
        ]
      },
      {
        no: 4, points: 4, type: '单选题',
        intro: '本题考察 qsort 比较函数的约定。',
        parts: [
          {
            points: 4, kind: 'choice',
            prompt: '用 <code>qsort</code> 对 <code>int</code> 数组升序排序时，比较函数应返回负值、0 或正值。下列实现中哪一个是正确且不会因相减而溢出的？',
            options: [
              { text: '<code>return (*(const int *)a &gt; *(const int *)b) - (*(const int *)a &lt; *(const int *)b);</code>', correct: true },
              { text: '<code>return *(const int *)a &lt; *(const int *)b;</code>' },
              { text: '<code>return (int)a - (int)b;</code>' },
              { text: '<code>return *(const int *)a + *(const int *)b;</code>' }
            ],
            explain: '<code>qsort</code> 只要求比较函数返回负/零/正。A 用两个关系表达式相减，结果严格是 -1、0、1，不做可能溢出的减法。B 在 a 小于 b 时返回 1，排序方向反了，而且没有负值；C 把指针强制转成 <code>int</code>，结果没有意义；D 返回和，无法比较大小。'
          }
        ]
      },
      {
        no: 5, points: 4, type: '单选题',
        intro: '本题考察标准 I/O 的打开与关闭。',
        parts: [
          {
            points: 4, kind: 'choice',
            prompt: '关于 <code>fopen</code> 与 <code>fclose</code>，下列哪项正确？',
            options: [
              { text: '<code>fopen("a.txt", "w")</code> 在文件不存在时一定失败' },
              { text: '<code>fopen</code> 失败时返回 NULL，读写前应检查', correct: true },
              { text: '<code>fclose</code> 只刷新缓冲区，不会释放 <code>FILE</code> 资源' },
              { text: '同一个 <code>FILE *</code> 可以安全地 <code>fclose</code> 多次' }
            ],
            explain: '<code>"w"</code> 模式会创建文件或截断已有文件；<code>fopen</code> 失败返回 NULL，必须检查；<code>fclose</code> 既刷新缓冲区又释放流资源；对同一个流重复 <code>fclose</code> 是未定义行为。'
          }
        ]
      },
      {
        no: 6, points: 4, type: '单选题',
        intro: '读程序，判断命令行参数的内容。',
        code: String.raw`#include <stdio.h>

int main(int argc, char *argv[]) {
    printf("argc = %d\n", argc);
    printf("argv[0] = %s\n", argv[0]);
    return 0;
}`,
        codeTitle: 'C',
        parts: [
          {
            points: 4, kind: 'choice',
            prompt: '在终端执行 <code>./prog alpha beta</code> 后，输出是：',
            options: [
              { text: '<code>argc = 3</code>，<code>argv[0]</code> 是 <code>./prog</code>', correct: true },
              { text: '<code>argc = 2</code>，<code>argv[0]</code> 是 <code>alpha</code>' },
              { text: '<code>argc = 3</code>，<code>argv[0]</code> 是 <code>alpha</code>' },
              { text: '<code>argc = 4</code>，<code>argv[0]</code> 是 <code>./prog</code>' }
            ],
            explain: '<code>argc</code> 包含程序名本身，所以是 1 + 2 = 3；<code>argv[0]</code> 是程序名（按调用方式为 <code>./prog</code>），<code>argv[1]</code> 是 <code>alpha</code>，<code>argv[2]</code> 是 <code>beta</code>，<code>argv[argc]</code> 是空指针。'
          }
        ]
      },
      {
        no: 7, points: 3, type: '判断题',
        intro: '判断下列关于堆内存生命周期的说法。',
        parts: [
          {
            points: 3, kind: 'tf',
            prompt: '用 <code>malloc</code> 分配的堆内存不会在函数返回时自动释放；如果丢失所有指向它的指针又没有调用 <code>free</code>，就会造成内存泄漏。',
            options: [
              { text: 'True', correct: true },
              { text: 'False' }
            ],
            explain: '堆内存的生命周期从分配开始，到显式 <code>free</code> 才结束，与函数调用栈无关。指针变量本身随作用域消失后，块仍然占用内存，无法再释放，这就是泄漏。'
          }
        ]
      },
      {
        no: 8, points: 3, type: '判断题',
        intro: '判断下列关于函数名的说法。',
        parts: [
          {
            points: 3, kind: 'tf',
            prompt: '在 C 中，函数名在大多数表达式中会转换为指向该函数的指针，因此可以把函数名直接作为 <code>qsort</code> 的比较函数实参传入。',
            options: [
              { text: 'True', correct: true },
              { text: 'False' }
            ],
            explain: '函数指示符在表达式中（<code>sizeof</code> 和一元 <code>&amp;</code> 的操作数除外）会转换为指向函数的指针。因此 <code>qsort(a, n, sizeof a[0], cmp)</code> 可以直接写函数名，不必写 <code>&amp;cmp</code>。'
          }
        ]
      },
      {
        no: 9, points: 4, type: '填空题',
        intro: '补全堆内存分配语句。',
        parts: [
          {
            points: 4, kind: 'fill',
            prompt: '为 <code>n</code> 个 <code>int</code> 分配一段不初始化的堆内存，并把首地址保存到 <code>int *p</code>。补全：<code>int *p = ____;</code>（写出等号右侧表达式；假设已包含 <code>&lt;stdlib.h&gt;</code>）。',
            answer: 'malloc(n * sizeof(int))',
            accept: ['(int *)malloc(n * sizeof(int))', 'malloc(sizeof(int) * n)', '(int*)malloc(n*sizeof(int))'],
            explain: '分配 <code>n</code> 个 <code>int</code> 需要 <code>n * sizeof(int)</code> 字节，返回的 <code>void *</code> 在 C 中可隐式转换为任意对象指针。实际代码还应检查返回值是否为 NULL。'
          }
        ]
      },
      {
        no: 10, points: 4, type: '填空题',
        intro: '本题考察 call/ret 的基本栈操作。',
        parts: [
          {
            points: 4, kind: 'fill',
            prompt: 'x86-64 中执行 <code>call</code> 指令时，处理器在跳转到被调函数之前会把____压入栈；被调函数执行 <code>ret</code> 时再把它弹出。',
            answer: '返回地址',
            accept: ['return address', '下一条指令的地址', '返回地址（return address）'],
            explain: '<code>call</code> 把 <code>call</code> 之后那条指令的地址（返回地址）压栈，然后跳转；<code>ret</code> 从栈顶弹出返回地址并跳回，从而恢复到调用点之后继续执行。'
          }
        ]
      },
      {
        no: 11, points: 4, type: '填空题',
        intro: '本题考察文件打开失败与关闭。',
        parts: [
          {
            points: 4, kind: 'fill',
            prompt: '用 <code>fopen</code> 打开文件失败时返回____；文件使用完毕后应调用____ 释放资源。按顺序写出两个答案，用空格分隔。',
            answer: 'NULL fclose',
            accept: ['NULL, fclose', 'NULL; fclose', 'NULL；fclose', 'NULL、fclose', 'NULL,fclose'],
            explain: '<code>fopen</code> 失败返回空指针 NULL，必须检查后再使用；<code>fclose</code> 刷新缓冲区并释放 <code>FILE</code> 及其底层资源，成功返回 0，失败返回 EOF。'
          }
        ]
      },
      {
        no: 12, points: 8, type: '读程序写输出',
        intro: '逐行写出下面堆数组程序的标准输出。',
        code: String.raw`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 5;
    int *p = malloc(n * sizeof(int));
    if (p == NULL) return 1;
    for (int i = 0; i < n; i++) p[i] = i * i;
    int sum = 0;
    for (int i = 0; i < n; i++) sum += p[i];
    printf("%d\n", p[3]);
    printf("%d\n", sum);
    printf("%d\n", p[0] + p[4]);
    free(p);
    return 0;
}`,
        codeTitle: 'C',
        parts: [
          {
            points: 8, kind: 'output',
            prompt: '写出程序的标准输出（共 3 行）。',
            answer: '9\n30\n16',
            explain: '<code>p[i]</code> 依次为 0、1、4、9、16，所以 <code>p[3]</code> 是 9；总和为 0 + 1 + 4 + 9 + 16 = 30；<code>p[0] + p[4]</code> = 0 + 16 = 16。<code>free</code> 在输出之后执行，不影响结果。'
          }
        ]
      },
      {
        no: 13, points: 8, type: '读程序写输出',
        intro: '读下面的结构体程序，逐行写出输出。',
        code: String.raw`#include <stdio.h>

struct Point {
    int x;
    int y;
};

struct Point move(struct Point p, int dx, int dy) {
    p.x += dx;
    p.y += dy;
    return p;
}

int main(void) {
    struct Point a = {2, 3};
    struct Point b = move(a, 4, -1);
    printf("%d %d\n", a.x, a.y);
    printf("%d %d\n", b.x, b.y);
    struct Point *q = &b;
    q->x += 10;
    printf("%d %d\n", b.x, b.y);
    return 0;
}`,
        codeTitle: 'C',
        parts: [
          {
            points: 8, kind: 'output',
            prompt: '写出程序的标准输出（共 3 行）。',
            answer: '2 3\n6 2\n16 2',
            explain: '<code>move</code> 按值接收 <code>struct Point</code> 的副本，修改的是副本，所以 <code>a</code> 保持 2 3；返回的副本赋给 <code>b</code>，得 6 2；<code>q</code> 指向 <code>b</code>，<code>q-&gt;x += 10</code> 把 <code>b.x</code> 改为 16，最后一行是 16 2。'
          }
        ]
      },
      {
        no: 14, points: 8, type: '读程序写输出',
        intro: '读下面的 qsort 程序，写出输出。',
        code: String.raw`#include <stdio.h>
#include <stdlib.h>

int cmp(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y);
}

int main(void) {
    int a[6] = {5, 1, 9, 3, 7, 3};
    qsort(a, 6, sizeof(a[0]), cmp);
    for (int i = 0; i < 6; i++) printf("%d%c", a[i], i == 5 ? '\n' : ' ');
    return 0;
}`,
        codeTitle: 'C',
        parts: [
          {
            points: 8, kind: 'output',
            prompt: '写出程序的标准输出（只有 1 行）。',
            answer: '1 3 3 5 7 9',
            explain: '比较函数返回 <code>x - y</code> 的符号（用关系运算实现，避免相减溢出），<code>qsort</code> 将数组升序排为 1、3、3、5、7、9。循环对前 5 个元素输出「数字 + 空格」，最后一个输出「数字 + 换行」，所以只有一行，末尾没有多余空格。'
          }
        ]
      },
      {
        no: 15, points: 8, type: '读程序写输出',
        intro: '读下面的命令行参数程序，写出输出。',
        code: String.raw`#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    int sum = 0;
    for (int i = 1; i < argc; i++) {
        sum += atoi(argv[i]);
    }
    printf("argc = %d\n", argc);
    printf("sum = %d\n", sum);
    return 0;
}`,
        codeTitle: 'C',
        parts: [
          {
            points: 8, kind: 'output',
            prompt: '在终端执行 <code>./prog 12 -4 7</code> 后，程序输出什么？逐行写出。',
            answer: 'argc = 4\nsum = 15',
            explain: '<code>argc</code> 包含程序名，因此为 1 + 3 = 4；循环从 <code>argv[1]</code> 开始，<code>atoi</code> 把 12、-4、7 转成整数，和为 12 + (-4) + 7 = 15。'
          }
        ]
      },
      {
        no: 16, points: 8, type: '读程序写输出',
        intro: '读下面的函数指针数组程序，逐行写出输出。',
        code: String.raw`#include <stdio.h>

int add(int a, int b) { return a + b; }
int mul(int a, int b) { return a * b; }

int apply(int (*f)(int, int), int a, int b) {
    return f(a, b);
}

int main(void) {
    int (*ops[2])(int, int) = { add, mul };
    printf("%d\n", apply(ops[0], 3, 4));
    printf("%d\n", apply(ops[1], 3, 4));
    printf("%d\n", ops[0](2, 5));
    return 0;
}`,
        codeTitle: 'C',
        parts: [
          {
            points: 8, kind: 'output',
            prompt: '写出程序的标准输出（共 3 行）。',
            answer: '7\n12\n7',
            explain: '<code>ops</code> 是函数指针数组，<code>ops[0]</code> 指向 <code>add</code>、<code>ops[1]</code> 指向 <code>mul</code>。<code>apply</code> 通过函数指针调用：3 + 4 = 7，3 × 4 = 12；<code>ops[0](2, 5)</code> 等价于 <code>add(2, 5)</code>，得 7。'
          }
        ]
      },
      {
        no: 17, points: 6, type: '找 bug / 简答',
        intro: '下面的程序完成一次文件复制，请从资源管理与错误处理的角度分析。',
        code: String.raw`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    FILE *in = fopen("in.txt", "r");
    FILE *out = fopen("out.txt", "w");
    char *buf = malloc(128);
    if (in == NULL || out == NULL || buf == NULL) return 1;
    size_t n = fread(buf, 1, 128, in);
    fwrite(buf, 1, n, out);
    return 0;
}`,
        codeTitle: 'C',
        parts: [
          {
            points: 6, kind: 'keywords',
            prompt: '这段程序能完成一次普通的文件复制，但资源管理不完整。请指出至少三处问题，并说明在长期运行的进程中可能造成的后果。',
            keywords: [
              ['fclose', '关闭文件'],
              ['free', '释放'],
              ['泄漏', 'leak'],
              ['部分失败', '提前返回', 'return 1'],
              ['返回值', 'fread', 'fwrite']
            ],
            answer: '（关键词给分，人工对照）① 三个资源中任意一个打开/分配失败就直接 return 1：如果 in 打开成功而 out 失败，in 没有 fclose，buf 也没有 free。② 成功路径没有 fclose(in) 和 fclose(out)，文件描述符与流资源泄漏，而且无法通过 fclose 的返回值确认写入是否成功。③ 没有 free(buf)，每次调用泄漏 128 字节堆内存。④ fread / fwrite 的返回值没有检查，复制可能不完整。正确做法是逐个获取、逐个检查，失败时按相反顺序清理已获得的资源。',
            explain: '资源管理的基本模式是「获取即检查，失败则回滚」：每打开一个文件、分配一块内存，就立即判断是否成功；统一出口按逆序 <code>free</code>、<code>fclose</code>。长期运行的程序若反复泄漏文件描述符或堆块，最终会耗尽资源。'
          }
        ]
      },
      {
        no: 18, points: 6, type: '简答',
        intro: '本题考察栈与堆的对比。',
        parts: [
          {
            points: 6, kind: 'keywords',
            prompt: '从分配方式、生命周期和管理开销三个方面，说明栈（stack）与堆（heap）的区别。',
            keywords: [
              ['自动', 'automatic'],
              ['函数返回', '作用域结束', '离开作用域'],
              ['malloc', 'free', '手动'],
              ['生命周期', 'lifetime'],
              ['碎片', 'fragmentation', '开销']
            ],
            answer: '（关键词给分，人工对照）栈由编译器自动管理：函数调用时分配栈帧，局部变量和参数位于其中，函数返回时随栈帧自动释放；空间通常较小且连续，分配和释放几乎没有额外开销，但对象的生命周期受作用域限制。堆由程序员手动管理：用 malloc / calloc / realloc 申请、free 释放；生命周期从申请开始到释放为止，可以跨函数使用，容量通常更大，但分配器需要维护元数据，可能产生碎片；忘记释放会造成内存泄漏。',
            explain: '回答时抓住三组对照：自动 vs 手动、随作用域结束 vs 显式释放、连续且低开销 vs 灵活但可能碎片化。'
          }
        ]
      },
      {
        no: 19, points: 6, type: '简答',
        intro: '本题考察函数调用与栈帧。',
        parts: [
          {
            points: 6, kind: 'keywords',
            prompt: '简述 x86-64 上一次函数调用从 <code>call</code> 到 <code>ret</code> 的主要栈操作，并解释递归过深为什么会栈溢出。',
            keywords: [
              ['返回地址', 'return address'],
              ['参数', 'arguments'],
              ['局部变量', 'local'],
              ['rbp', '帧指针', 'frame pointer'],
              ['rsp', '栈指针', '栈帧'],
              ['递归', 'stack overflow', '栈溢出']
            ],
            answer: '（关键词给分，人工对照）call 先把返回地址（call 的下一条指令地址）压栈，再跳到被调函数。被调函数的序言通常 push %rbp、mov %rsp,%rbp、sub $N,%rsp，为局部变量和需要保存的寄存器留出栈帧；按 System V ABI，前六个整型参数放在寄存器中，多余的参数压栈。函数体执行完后，leave / ret 恢复 %rsp、%rbp 并弹出返回地址。每次递归调用都会新增一个栈帧，深度过大时耗尽线程的栈空间，触发栈溢出（常见表现为段错误）。',
            explain: '关键是说明「返回地址 + 旧帧指针 + 局部变量」共同构成栈帧，以及 <code>rsp</code> 随调用向低地址增长、随返回回收。递归没有及时收敛时，栈帧只增不减，最终越过栈边界。'
          }
        ]
      }
    ]
  };

  var G = (typeof globalThis !== 'undefined') ? globalThis : (typeof window !== 'undefined') ? window : this;
  var C = G && G.CSC;
  if (C && typeof C.registerExam === 'function') {
    try { C._exams = [A, B]; } catch (e) {}
    [A, B].forEach(function (ex) { C.registerExam(ex); });
  }
})();
