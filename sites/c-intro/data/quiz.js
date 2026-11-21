/* data/quiz.js · C 题库：90 题，覆盖 ch00–ch09；题型 mcq/predict/fill/multi */
(function () {
  'use strict';
  var PACK = { items: [
    /* ch00 */
    { id: "ch00-q1", ch: "ch00", kp: "ch00-1", tier: 1, type: "mcq", difficulty: 1, tags: ["toolchain", "concept"],
      stem: "一个 C 程序从源文件变成可执行文件，通常经历四个阶段。下列顺序正确的是？",
      options: [
        { text: "预处理 → 编译 → 汇编 → 链接", correct: true },
        { text: "编译 → 预处理 → 链接 → 汇编" },
        { text: "预处理 → 链接 → 编译 → 汇编" },
        { text: "汇编 → 编译 → 预处理 → 链接" }
      ],
      explain: "解析：预处理先展开 #include、替换宏；编译把预处理后的 C 代码翻译成汇编；汇编器把汇编变成目标文件 .o；链接器再把多个 .o 和库合并成可执行文件。其余选项都把相邻阶段的先后顺序打乱了。" },

    { id: "ch00-q2", ch: "ch00", kp: "ch00-2", tier: 1, type: "mcq", difficulty: 1, tags: ["toolchain"],
      stem: "预处理阶段（`gcc -E`）主要做了什么？",
      options: [
        { text: "展开 `#include`、替换宏、删除注释", correct: true },
        { text: "检查类型错误并生成汇编代码" },
        { text: "把多个 `.o` 文件合并成可执行文件" },
        { text: "在运行时为局部变量分配栈空间" }
      ],
      explain: "解析：预处理器只做文本层面的工作：把头文件内容插进来、替换宏、把注释替换为空格，不检查语法和类型。生成汇编是编译阶段，合并 .o 是链接阶段，分配栈空间发生在运行时。" },

    { id: "ch00-q3", ch: "ch00", kp: "ch00-4", tier: 1, type: "mcq", difficulty: 1, tags: ["concept"],
      stem: "关于 `int main(void)` 的返回值，哪项正确？",
      options: [
        { text: "返回值作为进程退出状态交给操作系统，0 通常表示成功", correct: true },
        { text: "必须返回 1，否则程序无法启动" },
        { text: "返回值会被 `printf` 自动打印到屏幕" },
        { text: "`main` 不能返回值，只能写成 `void main()`" }
      ],
      explain: "解析：`main` 的返回值就是进程的退出状态，shell 里可用 `echo $?` 查看；0 表示成功，非 0 表示某种失败。它不会自动被打印，也不是必须为 1。`void main()` 不是标准形式。" },

    { id: "ch00-q4", ch: "ch00", kp: "ch00-6", tier: 2, type: "mcq", difficulty: 2, tags: ["toolchain", "pitfall"],
      stem: "编译 `main.c` 时出现 `undefined reference to 'foo'`，最可能发生在哪个阶段、原因是什么？",
      options: [
        { text: "链接阶段：调用了 `foo`，但没有提供它的定义或对应的库", correct: true },
        { text: "预处理阶段：`#include` 的路径写错了" },
        { text: "编译阶段：`foo` 的返回类型写错了" },
        { text: "运行阶段：调用 `foo` 时参数个数不对" }
      ],
      explain: "解析：编译器看到 `foo` 的声明就能生成调用指令，不会报错；链接器负责把调用和定义对上，找不到定义就报 `undefined reference`。头文件找不到会报 `fatal error: ... No such file`，类型错误属于编译错误，参数问题不会在链接期暴露。" },

    { id: "ch00-q5", ch: "ch00", kp: "ch00-2", tier: 1, type: "predict", codeTitle: "C", difficulty: 1, tags: ["preprocessor", "trace"],
      stem: "写出下面程序的输出（逐行，不要多写空行）。",
      code: `#include <stdio.h>
#define N 4

int main(void) {
    int a = N * 2;
    printf("%d\\n", a);
    return 0;
}`,
      answer: "8",
      explain: "解析：`N` 在预处理阶段被文本替换为 4，编译时计算 `4 * 2` 得 8，`printf` 输出 8 后换行。答案只需写一行 `8`。" },

    { id: "ch00-q6", ch: "ch00", kp: "ch00-5", tier: 2, type: "predict", codeTitle: "C", difficulty: 2, tags: ["argv", "trace"],
      stem: "程序编译为 `args`，在终端执行 `./args sum`。写出程序的输出。",
      code: `#include <stdio.h>

int main(int argc, char *argv[]) {
    printf("argc=%d\\n", argc);
    printf("arg=%s\\n", argv[1]);
    return 0;
}`,
      answer: "argc=2\narg=sum",
      explain: "解析：`argc` 是参数个数，包含程序名本身：`./args` 和 `sum` 共 2 个；`argv[0]` 是 `\"./args\"`，`argv[1]` 是 `\"sum\"`。因此两行分别是 `argc=2` 和 `arg=sum`。" },

    { id: "ch00-q7", ch: "ch00", kp: "ch00-5", tier: 2, type: "predict", codeTitle: "C", difficulty: 2, tags: ["fileio", "trace"],
      stem: "当前目录可写，程序正常执行。写出它的输出。",
      code: `#include <stdio.h>

int main(void) {
    FILE *f = fopen("quiz_tmp.txt", "w");
    if (f == NULL) return 1;
    fprintf(f, "%d %s\\n", 7, "ok");
    fclose(f);

    f = fopen("quiz_tmp.txt", "r");
    if (f == NULL) return 1;
    char buf[16];
    if (fgets(buf, sizeof(buf), f) != NULL) {
        printf("%s", buf);
    }
    fclose(f);
    return 0;
}`,
      answer: "7 ok",
      explain: "解析：第一次 `fopen` 以写模式创建文件，`fprintf` 写入 `7 ok` 加换行，随后 `fclose` 把数据刷到磁盘。第二次以读模式打开，`fgets` 读入整行（包含换行），`printf(\"%s\")` 原样输出，所以屏幕上是 `7 ok` 一行。" },

    { id: "ch00-q8", ch: "ch00", kp: "ch00-4", tier: 1, type: "fill", difficulty: 1, tags: ["toolchain"],
      stem: "把多个目标文件（`.o`）和库合并、解析跨文件符号的阶段叫 ______。",
      answer: "链接",
      accept: ["链接阶段", "linking", "link"],
      explain: "解析：这一步由链接器完成：它把各个目标文件和库拼成一个可执行文件，并解析 `main` 调用 `foo` 这类跨文件符号。编译阶段只负责把单个源文件翻译成汇编或目标文件。" },

    { id: "ch00-q9", ch: "ch00", kp: "ch00-2", tier: 2, type: "multi", difficulty: 2, tags: ["preprocessor"],
      stem: "（多选）关于预处理，下列哪些说法正确？",
      options: [
        { text: "`#include <stdio.h>` 在预处理阶段被展开为头文件内容", correct: true },
        { text: "`#define N 10` 是文本替换，不做类型检查", correct: true },
        { text: "预处理阶段会把源代码中的注释删除（替换为空格）", correct: true },
        { text: "预处理阶段会为 `int x` 分配内存" }
      ],
      explain: "解析：预处理器只做文本搬运：展开头文件、替换宏、处理条件编译、去掉注释，不理解类型，也不分配内存。变量的内存是在程序运行（或编译器安排栈帧）时才有的，与预处理无关。" },

    /* ch01 */
    { id: "ch01-q1", ch: "ch01", kp: "ch01-1", tier: 1, type: "mcq", difficulty: 1, tags: ["syntax"],
      stem: "下列哪个 `main` 定义符合 C 标准（hosted 环境）？",
      options: [
        { text: "`int main(void) { return 0; }`", correct: true },
        { text: "`void main(void) { }`" },
        { text: "`int main { return 0; }`" },
        { text: "`int main(void) { return; }`" }
      ],
      explain: "解析：标准规定 `main` 的返回类型是 `int`，`int main(void)` 是合法形式之一。`void main` 不是标准形式；`int main` 少了参数列表的括号；`return;` 在返回 int 的函数里没有返回值，编译器会报错。" },

    { id: "ch01-q2", ch: "ch01", kp: "ch01-4", tier: 1, type: "mcq", difficulty: 1, tags: ["printf"],
      stem: "打印 `size_t` 类型的值（例如 `sizeof` 的结果），应使用哪个格式占位符？",
      options: [
        { text: "`%zu`", correct: true },
        { text: "`%d`" },
        { text: "`%s`" },
        { text: "`%c`" }
      ],
      explain: "解析：`size_t` 是无符号整数类型，C99 为它提供了长度修饰符 `z`，所以用 `%zu`。`%d` 对应 `int`，`%s` 对应字符串，`%c` 对应单个字符，都与 `size_t` 不匹配。" },

    { id: "ch01-q3", ch: "ch01", kp: "ch01-4", tier: 2, type: "mcq", difficulty: 2, tags: ["printf", "return"],
      stem: "`printf(\"abc\\n\")` 成功执行时返回值是多少？",
      options: [
        { text: "4，即实际写出的字符数（含换行）", correct: true },
        { text: "3，只数字母" },
        { text: "0" },
        { text: "1" }
      ],
      explain: "解析：`printf` 返回成功写出的字符个数，`abc` 加换行共 4 个。出错时它返回负值；返回值不是“参数个数”，也不是固定值。" },

    { id: "ch01-q4", ch: "ch01", kp: "ch01-4", tier: 2, type: "mcq", difficulty: 2, tags: ["scanf"],
      stem: "`int a, b; int n = scanf(\"%d %d\", &a, &b);` 输入 `3 x` 时，`n` 的值是？",
      options: [
        { text: "1", correct: true },
        { text: "2" },
        { text: "0" },
        { text: "EOF" }
      ],
      explain: "解析：`scanf` 返回成功转换并赋值的项数。第一个 `%d` 读到 3 并赋值成功；第二个 `%d` 遇到字符 x 无法转换，函数在此停止，所以返回 1。只有输入在第一次转换前就结束，才会返回 EOF。" },

    { id: "ch01-q5", ch: "ch01", kp: "ch01-6", tier: 1, type: "predict", codeTitle: "C", difficulty: 1, tags: ["operator", "trace"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>

int main(void) {
    int a = 7, b = 2;
    printf("%d %d\\n", a / b, a % b);
    printf("%.2f\\n", (double)a / b);
    return 0;
}`,
      answer: "3 1\n3.50",
      explain: "解析：两个 int 相除做整数除法，7 / 2 得 3，7 % 2 得 1。第二行先把 a 转成 double 再除以 b，得到 3.5，`%.2f` 保留两位小数输出 3.50。" },

    { id: "ch01-q6", ch: "ch01", kp: "ch01-5", tier: 1, type: "predict", codeTitle: "C", difficulty: 1, tags: ["char", "ascii"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>

int main(void) {
    char c = 'A';
    printf("%c %d\\n", c, c);
    printf("%c\\n", c + 2);
    return 0;
}`,
      answer: "A 65\nC",
      explain: "解析：字符 'A' 的 ASCII 码是 65，所以 `%c` 输出 A、`%d` 输出 65。`c + 2` 先按整数运算得到 67，再以 `%c` 输出，对应字符 C。" },

    { id: "ch01-q7", ch: "ch01", kp: "ch01-4", tier: 2, type: "predict", codeTitle: "C", difficulty: 2, tags: ["printf", "format"],
      stem: "写出下面程序的输出（注意方括号内的空格）。",
      code: `#include <stdio.h>

int main(void) {
    printf("[%5d][%-5d][%05d]\\n", 42, 42, 42);
    return 0;
}`,
      answer: "[   42][42   ][00042]",
      explain: "解析：`%5d` 右对齐、宽度 5，42 前面补 3 个空格；`%-5d` 左对齐、宽度 5，42 后面补 3 个空格；`%05d` 用 0 补齐到 5 位，得到 00042。三者都不改变数值本身。" },

    { id: "ch01-q8", ch: "ch01", kp: "ch01-1", tier: 1, type: "fill", difficulty: 1, tags: ["syntax"],
      stem: "C 程序从 ______ 函数开始执行（填函数名）。",
      answer: "main",
      accept: ["main 函数", "主函数", "main()"],
      explain: "解析：hosted 环境下的 C 程序由运行时启动代码调用 `main`，所以它是用户代码的入口。其他函数只有被调用才会执行，名字叫什么都可以。" },

    { id: "ch01-q9", ch: "ch01", kp: "ch01-5", tier: 2, type: "multi", difficulty: 2, tags: ["const", "preprocessor"],
      stem: "（多选）关于变量、const 与注释，哪些说法正确？",
      options: [
        { text: "`const int n = 5; n = 6;` 会产生编译错误", correct: true },
        { text: "`#define N 5` 与 `const int N = 5;` 都在预处理阶段做文本替换" },
        { text: "注释在预处理阶段被替换为空格，不参与编译", correct: true },
        { text: "C99 起，`main` 执行到末尾没有 `return` 时等价于 `return 0;`", correct: true }
      ],
      explain: "解析：`const` 变量由编译器管理，有类型和作用域，赋值给它是编译错误；它不是文本替换，`#define` 才是。注释在预处理阶段就被替换成空格。C99 标准规定 `main` 走到右花括号时隐式返回 0。" },

    /* ch02 */
    { id: "ch02-q1", ch: "ch02", kp: "ch02-4", tier: 1, type: "mcq", difficulty: 1, tags: ["sizeof", "standard"],
      stem: "下列哪个 `sizeof` 结果由 C 标准保证？",
      options: [
        { text: "`sizeof(char) == 1`", correct: true },
        { text: "`sizeof(int) == 4`" },
        { text: "`sizeof(long) == 8`" },
        { text: "`sizeof(void *) == 8`" }
      ],
      explain: "解析：标准只保证 `sizeof(char)` 为 1，其余类型宽度由实现决定：`int` 至少 2 字节，`long` 至少 4 字节，指针大小取决于平台（32 位通常是 4，64 位通常是 8）。所以不能把 4 或 8 当成可移植事实。" },

    { id: "ch02-q2", ch: "ch02", kp: "ch02-3", tier: 1, type: "mcq", difficulty: 1, tags: ["twos-complement"],
      stem: "8 位补码能表示的有符号整数范围是？",
      options: [
        { text: "-128 ~ 127", correct: true },
        { text: "-127 ~ 127" },
        { text: "0 ~ 255" },
        { text: "-255 ~ 255" }
      ],
      explain: "解析：8 位共有 256 个位模式，补码把最高位当符号位：0 ~ 127 表示非负数，-128 ~ -1 表示负数，因此范围是 -128 ~ 127。0 ~ 255 是 8 位无符号数的范围。" },

    { id: "ch02-q3", ch: "ch02", kp: "ch02-6", tier: 3, type: "mcq", difficulty: 2, tags: ["conversion", "pitfall"],
      stem: "表达式 `-1 < 1u` 的值是？",
      options: [
        { text: "0，因为 -1 被转换成无符号数的最大值", correct: true },
        { text: "1，因为 -1 小于 1" },
        { text: "未定义行为" },
        { text: "编译错误" }
      ],
      explain: "解析：`int` 与 `unsigned int` 混合运算时，`int` 会被转换成 `unsigned int`；-1 按模 2^N 变成该类型的最大值，显然不小于 1，所以整个表达式为假，值 0。这个转换是标准规定的，不是未定义行为，也不会编译报错。" },

    { id: "ch02-q4", ch: "ch02", kp: "ch02-5", tier: 2, type: "mcq", difficulty: 2, tags: ["overflow"],
      stem: "关于整数溢出，哪项正确？",
      options: [
        { text: "无符号整数溢出按 2^N 取模回绕，有符号整数溢出是未定义行为", correct: true },
        { text: "有符号和无符号溢出都保证回绕" },
        { text: "有符号溢出保证结果变成 0" },
        { text: "无符号溢出是未定义行为" }
      ],
      explain: "解析：标准明确规定无符号运算按 2^N 取模，所以会回绕；有符号溢出则属于未定义行为，编译器可以假设它不发生并据此优化。实际运行可能得到回绕值，但不能依赖，也不能拿来出确定结果的题。" },

    { id: "ch02-q5", ch: "ch02", kp: "ch02-4", tier: 1, type: "predict", codeTitle: "C", difficulty: 1, tags: ["sizeof", "trace"],
      stem: "在 `int` 为 4 字节的平台上，写出下面程序的输出。",
      code: `#include <stdio.h>

int main(void) {
    int a[5] = {0};
    printf("%zu\\n", sizeof(a));
    printf("%zu\\n", sizeof(a[0]));
    printf("%zu\\n", sizeof(a) / sizeof(a[0]));
    return 0;
}`,
      answer: "20\n4\n5",
      explain: "解析：`a` 是含 5 个 int 的数组，整个数组占 5 × 4 = 20 字节；`a[0]` 是单个 int，占 4 字节；两者相除得到元素个数 5。`sizeof` 的结果类型是 `size_t`，用 `%zu` 打印。" },

    { id: "ch02-q6", ch: "ch02", kp: "ch02-5", tier: 2, type: "predict", codeTitle: "C", difficulty: 2, tags: ["overflow", "conversion"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>

int main(void) {
    unsigned char b = 250;
    b = b + 10;
    printf("%d\\n", b);
    printf("%d\\n", (unsigned char)255 + 1);
    return 0;
}`,
      answer: "4\n256",
      explain: "解析：`b + 10` 先把 b 提升为 int，得到 260；赋回 `unsigned char` 时按 256 取模，变成 4。第二行 `(unsigned char)255` 再提升为 int 后加 1，加法在 int 中进行，没有回绕，得到 256。" },

    { id: "ch02-q7", ch: "ch02", kp: "ch02-1", tier: 2, type: "predict", codeTitle: "C", difficulty: 2, tags: ["base", "printf"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>

int main(void) {
    int x = 0x2A;
    printf("%d %x %o\\n", x, x, x);
    printf("%d\\n", 0x2A + 010);
    return 0;
}`,
      answer: "42 2a 52\n50",
      explain: "解析：`0x2A` 是十六进制的 42；`%x` 以十六进制小写输出 2a，`%o` 以八进制输出 52（42 = 5×8 + 2）。`010` 是八进制写法，值为 8，所以 42 + 8 = 50。" },

    { id: "ch02-q8", ch: "ch02", kp: "ch02-2", tier: 1, type: "fill", difficulty: 1, tags: ["bits"],
      stem: "8 位无符号数能表示的最大值是 ______（十进制）。",
      answer: "255",
      accept: ["0xFF", "0xff"],
      explain: "解析：8 位共有 2^8 = 256 个位模式，无符号从 0 开始计数，最大值是 255，位模式为 11111111（0xFF）。再加 1 就会回绕到 0。" },

    { id: "ch02-q9", ch: "ch02", kp: "ch02-6", tier: 3, type: "multi", difficulty: 2, tags: ["conversion", "overflow"],
      stem: "（多选）关于整数转换，哪些说法正确？",
      options: [
        { text: "有符号负数转成同宽无符号数时，按模 2^N 得到对应位模式", correct: true },
        { text: "无符号值超出同宽有符号类型范围时，转换结果由实现定义", correct: true },
        { text: "从 `int` 转 `long` 一定会丢失信息" },
        { text: "有符号整数溢出是未定义行为", correct: true }
      ],
      explain: "解析：有符号转无符号是标准规定的模运算；无符号转同宽有符号若超出范围则结果由实现定义，不能假设。`int` 转 `long` 是拓宽转换，`long` 至少和 `int` 一样宽，不会丢失信息。有符号溢出是未定义行为。" },

    /* ch03 */
    { id: "ch03-q1", ch: "ch03", kp: "ch03-6", tier: 2, type: "mcq", difficulty: 2, tags: ["bitwise", "trick"],
      stem: "对非零无符号整数 `x`，表达式 `x & (x - 1)` 的作用是？",
      options: [
        { text: "清除 x 最低位的 1", correct: true },
        { text: "清除 x 最高位的 1" },
        { text: "判断 x 是否为偶数" },
        { text: "把 x 左移一位" }
      ],
      explain: "解析：`x - 1` 会把最低位的 1 变成 0，并把它右边的 0 全部变成 1；再与 x 做与运算，最低位的 1 就被清掉，其余高位不变。例如 0b1010 & 0b1001 = 0b1000。它常用来统计二进制中 1 的个数。" },

    { id: "ch03-q2", ch: "ch03", kp: "ch03-4", tier: 1, type: "mcq", difficulty: 1, tags: ["mask"],
      stem: "要取出 `unsigned x` 的最低 4 位，应使用？",
      options: [
        { text: "`x & 0x0F`", correct: true },
        { text: "`x | 0x0F`" },
        { text: "`x ^ 0x0F`" },
        { text: "`x & 0xF0`" }
      ],
      explain: "解析：掩码 0x0F 的低 4 位是 1、其余位是 0，与 x 做与运算会保留低 4 位、把高位清零。`|` 和 `^` 不能清位，0xF0 取的是高 4 位而不是低 4 位。" },

    { id: "ch03-q3", ch: "ch03", kp: "ch03-6", tier: 2, type: "mcq", difficulty: 2, tags: ["shift", "ub"],
      stem: "关于移位运算，哪项正确？",
      options: [
        { text: "对无符号数右移高位补 0；移位数大于等于类型位宽是未定义行为", correct: true },
        { text: "对无符号数右移高位补 1" },
        { text: "左移在任何情况下都不会丢失信息" },
        { text: "移位数大于位宽时结果保证为 0" }
      ],
      explain: "解析：无符号数右移是逻辑右移，高位补 0；有符号负数的右移才可能是算术右移，由实现定义。移位次数必须小于类型位宽，否则是未定义行为。左移也可能把高位挤掉，并不是无损的。" },

    { id: "ch03-q4", ch: "ch03", kp: "ch03-5", tier: 1, type: "mcq", difficulty: 1, tags: ["bitwise"],
      stem: "哪个表达式把 `unsigned x` 的最低位翻转（0 变 1，1 变 0）？",
      options: [
        { text: "`x ^ 1u`", correct: true },
        { text: "`x | 1u`" },
        { text: "`x & 1u`" },
        { text: "`x & ~1u`" }
      ],
      explain: "解析：异或的规则是“相同为 0、不同为 1”，与 1 异或恰好把最低位取反，其他位与 0 异或保持不变。`| 1` 只能置位，`& 1` 只留下最低位，`& ~1` 只清除最低位，都不能翻转。" },

    { id: "ch03-q5", ch: "ch03", kp: "ch03-4", tier: 2, type: "predict", codeTitle: "C", difficulty: 2, tags: ["mask", "trace"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>

int main(void) {
    unsigned x = 0xABCD;
    printf("%x\\n", x & 0x00FF);
    printf("%x\\n", (x >> 8) & 0xFF);
    printf("%d\\n", (x & 0x0F00) >> 8);
    return 0;
}`,
      answer: "cd\nab\n11",
      explain: "解析：0xABCD 的低字节是 0xCD，与 0x00FF 相与得到 cd。右移 8 位后高字节 0xAB 落到低 8 位，再与 0xFF 得到 ab。0xABCD & 0x0F00 留下 0x0B00，右移 8 位得到 0x0B，即十进制 11。" },

    { id: "ch03-q6", ch: "ch03", kp: "ch03-5", tier: 2, type: "predict", codeTitle: "C", difficulty: 2, tags: ["bitwise", "flags"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>

int main(void) {
    unsigned char flags = 0x00;
    flags |= (1 << 3);
    flags |= (1 << 5);
    flags &= ~(1 << 3);
    printf("0x%02X\\n", flags);
    printf("%d\\n", (flags >> 5) & 1);
    return 0;
}`,
      answer: "0x20\n1",
      explain: "解析：先置第 3 位得到 0x08，再置第 5 位得到 0x28，最后用 `&= ~(1 << 3)` 清掉第 3 位，只剩 0x20。`%02X` 以两位大写十六进制输出 0x20。右移 5 位再取最低位，得到第 5 位的值 1。" },

    { id: "ch03-q7", ch: "ch03", kp: "ch03-2", tier: 2, type: "predict", codeTitle: "C", difficulty: 2, tags: ["xor", "trace"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>

int main(void) {
    int a = 5, b = 9;
    a ^= b;
    b ^= a;
    a ^= b;
    printf("%d %d\\n", a, b);
    printf("%d\\n", 5 ^ 9);
    return 0;
}`,
      answer: "9 5\n12",
      explain: "解析：第一句后 a = 5^9 = 12；第二句 b = 9^12 = 5；第三句 a = 12^5 = 9，于是两个变量交换。5 的二进制是 0101，9 是 1001，异或得 1100，即 12。" },

    { id: "ch03-q8", ch: "ch03", kp: "ch03-5", tier: 1, type: "fill", difficulty: 1, tags: ["mask"],
      stem: "把 `unsigned x` 的第 n 位置 1（n 从 0 开始），可写 `x |= ______;`。",
      answer: "1 << n",
      accept: ["(1 << n)", "1u << n", "1<<n"],
      explain: "解析：把 1 左移 n 位得到只有第 n 位为 1 的掩码，再与 x 做或运算即可置位，其他位不变。若 n 可能大于等于 32，需要先检查范围，因为移位次数越界是未定义行为。" },

    { id: "ch03-q9", ch: "ch03", kp: "ch03-2", tier: 2, type: "multi", difficulty: 2, tags: ["bitwise"],
      stem: "（多选）关于位运算，哪些说法正确？",
      options: [
        { text: "`x & (x - 1)` 可以清除最低位的 1", correct: true },
        { text: "`x ^ x` 的结果为 0", correct: true },
        { text: "`x | 0` 会把 x 清零" },
        { text: "对无符号数，`x >> 1` 相当于 `x / 2` 向下取整", correct: true }
      ],
      explain: "解析：`x & (x - 1)` 清最低位的 1；任何数与自身异或都为 0；与 0 做或运算保持原值，不会清零。无符号数右移一位等于除以 2 向下取整，例如 5 >> 1 得 2。" },

    /* ch04 */
    { id: "ch04-q1", ch: "ch04", kp: "ch04-1", tier: 2, type: "mcq", difficulty: 2, tags: ["char", "literal"],
      stem: "在 C 中，关于 `'A'` 与 `\"A\"`，哪项正确？",
      options: [
        { text: "`'A'` 是 int 类型的字符常量；`\"A\"` 是含 `'A'` 和 `'\\0'` 两个字符的数组", correct: true },
        { text: "两者完全等价，都是 char" },
        { text: "`\"A\"` 的长度是 1，`sizeof(\"A\")` 也是 1" },
        { text: "`'A'` 是字符串，`\"A\"` 是字符" }
      ],
      explain: "解析：单引号括起来的是字符常量，在 C 中类型是 int，值为字符的编码；双引号括起来的是字符串字面量，类型是 char 数组，末尾自动加一个 `'\\0'`，所以 `\"A\"` 占 2 个字节。`strlen(\"A\")` 才是 1。" },

    { id: "ch04-q2", ch: "ch04", kp: "ch04-4", tier: 1, type: "mcq", difficulty: 1, tags: ["strlen", "sizeof"],
      stem: "`char s[] = \"hello\";` 则 `strlen(s)` 与 `sizeof(s)` 分别是？",
      options: [
        { text: "5 和 6", correct: true },
        { text: "6 和 6" },
        { text: "5 和 5" },
        { text: "6 和 5" }
      ],
      explain: "解析：`strlen` 数到第一个 `'\\0'` 为止，不把结尾符算进去，所以是 5；`sizeof` 算整个数组的字节数，`hello` 的 5 个字符加上结尾的 `'\\0'` 共 6 字节。" },

    { id: "ch04-q3", ch: "ch04", kp: "ch04-6", tier: 1, type: "mcq", difficulty: 1, tags: ["strcmp"],
      stem: "关于 `strcmp` 的返回值，哪项正确？",
      options: [
        { text: "返回负数、0 或正数，分别表示前者小于、等于、大于后者；具体数值不保证是 -1/1", correct: true },
        { text: "只返回 -1、0、1" },
        { text: "返回两个字符串的长度差" },
        { text: "返回第一个字符串的地址" }
      ],
      explain: "解析：标准只规定返回值的符号：小于时为负、相等时为 0、大于时为正，具体数值由实现决定，所以应写 `strcmp(a, b) < 0` 而不是 `== -1`。它按字符编码逐位比较，不是比较长度。" },

    { id: "ch04-q4", ch: "ch04", kp: "ch04-4", tier: 1, type: "predict", codeTitle: "C", difficulty: 1, tags: ["strlen", "trace"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char s[] = "cat";
    printf("%zu %zu\\n", strlen(s), sizeof(s));
    printf("%c\\n", s[1]);
    return 0;
}`,
      answer: "3 4\na",
      explain: "解析：`strlen` 不数结尾的 `'\\0'`，得到 3；`sizeof` 算整个数组，`cat` 加结尾符共 4 字节。下标从 0 开始，`s[1]` 是第二个字符 a。" },

    { id: "ch04-q5", ch: "ch04", kp: "ch04-5", tier: 2, type: "predict", codeTitle: "C", difficulty: 2, tags: ["strcpy", "trace"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char buf[8] = "abc";
    strcpy(buf, "hi");
    printf("%s %zu\\n", buf, strlen(buf));
    printf("%d\\n", buf[2]);
    return 0;
}`,
      answer: "hi 2\n0",
      explain: "解析：`strcpy` 把 `h`、`i`、`'\\0'` 依次写入 buf 的前三个字节，原来的 `c` 被结尾符覆盖。`printf(\"%s\")` 遇到 `'\\0'` 停止，输出 hi；`strlen` 为 2；`buf[2]` 就是结尾符，值为 0。" },

    { id: "ch04-q6", ch: "ch04", kp: "ch04-6", tier: 2, type: "predict", codeTitle: "C", difficulty: 2, tags: ["strcmp", "ascii"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char a[] = "apple";
    char b[] = "apply";
    printf("%d\\n", strcmp(a, b) < 0);
    printf("%d\\n", 'a' - 'A');
    printf("%c\\n", 'a' - 32);
    return 0;
}`,
      answer: "1\n32\nA",
      explain: "解析：两个字符串前四个字符相同，第五个字符 `e`（101）小于 `y`（121），所以 `strcmp` 返回负数，`< 0` 为真，输出 1。小写字母比对应大写字母的 ASCII 码大 32，所以 `'a' - 'A'` 是 32，`'a' - 32` 得到 A。" },

    { id: "ch04-q7", ch: "ch04", kp: "ch04-3", tier: 1, type: "fill", difficulty: 1, tags: ["string"],
      stem: "C 字符串以字符 ______ 结尾（写转义形式，含单引号）。",
      answer: "'\\0'",
      accept: ["\\0", "NUL", "空字符"],
      explain: "解析：C 字符串约定用值为 0 的字符 `'\\0'` 作为结束标志，`strlen`、`printf(\"%s\")` 等函数都靠它判断终点。它占一个字节，但不计入 `strlen` 的长度。" },

    { id: "ch04-q8", ch: "ch04", kp: "ch04-2", tier: 1, type: "fill", difficulty: 1, tags: ["sizeof"],
      stem: "`char s[] = \"hello\";` 则 `sizeof(s)` 的值是 ______。",
      answer: "6",
      accept: ["6 字节"],
      explain: "解析：`hello` 有 5 个可见字符，字符串字面量末尾还有一个 `'\\0'`，数组按 6 个 char 分配，所以 `sizeof(s)` 是 6。若问 `strlen(s)` 才是 5。" },

    { id: "ch04-q9", ch: "ch04", kp: "ch04-6", tier: 1, type: "fill", difficulty: 1, tags: ["strcmp"],
      stem: "`strcmp(\"abc\", \"abd\")` 的返回值符号是 ______（填 <0、0 或 >0）。",
      answer: "<0",
      accept: ["小于 0", "负数", "negative"],
      explain: "解析：两个字符串前两个字符相同，第三个字符 `c`（99）小于 `d`（100），所以第一个字符串更小，`strcmp` 返回负数。标准只保证符号，不保证具体是 -1。" },

    /* ch05 */
    { id: "ch05-q1", ch: "ch05", kp: "ch05-3", tier: 1, type: "mcq", difficulty: 1, tags: ["pointer-arithmetic"],
      stem: "`int a[5]; int *p = a;` 在 `int` 为 4 字节的平台上，`p + 1` 比 `p` 的地址大多少字节？",
      options: [
        { text: "4", correct: true },
        { text: "1" },
        { text: "5" },
        { text: "8" }
      ],
      explain: "解析：指针算术以“所指类型的大小”为单位，`p + 1` 前进一个 int，也就是 4 字节，而不是 1 字节。这也解释了为什么 `p + 1` 指向 `a[1]`。" },

    { id: "ch05-q2", ch: "ch05", kp: "ch05-4", tier: 2, type: "mcq", difficulty: 2, tags: ["array", "sizeof"],
      stem: "关于数组名 `a` 与指向它的指针 `p`，哪项正确？",
      options: [
        { text: "`sizeof(a)` 得到整个数组的字节数，`sizeof(p)` 得到指针本身的大小", correct: true },
        { text: "两者在 `sizeof` 下完全一样" },
        { text: "`sizeof(a)` 总是 8" },
        { text: "数组名可以自增，`a++` 合法" }
      ],
      explain: "解析：数组名在大多数表达式里退化为首元素地址，但作为 `sizeof` 的操作数时不退化，得到整个数组的大小；指针变量本身只占一个地址的大小。数组名不是可修改的左值，`a++` 会编译报错。" },

    { id: "ch05-q3", ch: "ch05", kp: "ch05-5", tier: 2, type: "mcq", difficulty: 2, tags: ["const", "pointer"],
      stem: "`const int *p` 与 `int * const p` 的区别是？",
      options: [
        { text: "前者不能通过 p 修改它指向的值；后者不能修改 p 的指向", correct: true },
        { text: "两者完全一样" },
        { text: "前者不能修改 p 的指向；后者不能修改指向的值" },
        { text: "两者都既不能改值也不能改指向" }
      ],
      explain: "解析：看 const 在 `*` 的哪一侧：`const int *p` 锁定的是被指向的 int，所以 `*p = 1` 非法，但 `p = &y` 可以；`int * const p` 锁定的是指针本身，所以 `p = &y` 非法，但 `*p = 1` 可以。记忆口诀是“const 在 * 左边锁值，在 * 右边锁指针”。" },

    { id: "ch05-q4", ch: "ch05", kp: "ch05-4", tier: 2, type: "mcq", difficulty: 2, tags: ["2d-array"],
      stem: "`int a[2][3];` 按行主序存放，`a[1][0]` 相对 `a[0][0]` 偏移多少个 `int`？",
      options: [
        { text: "3", correct: true },
        { text: "1" },
        { text: "2" },
        { text: "6" }
      ],
      explain: "解析：二维数组按行连续存放：先放第一行的 3 个 int，再放第二行。所以 `a[1][0]` 前面正好有第一行的 3 个元素，偏移 3 个 int。`a[1][2]` 才是偏移 5。" },

    { id: "ch05-q5", ch: "ch05", kp: "ch05-3", tier: 1, type: "predict", codeTitle: "C", difficulty: 1, tags: ["pointer-arithmetic", "trace"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>

int main(void) {
    int a[4] = {10, 20, 30, 40};
    int *p = a;
    printf("%d\\n", *p);
    printf("%d\\n", *(p + 2));
    p++;
    printf("%d\\n", *p);
    printf("%d\\n", (int)(p - a));
    return 0;
}`,
      answer: "10\n30\n20\n1",
      explain: "解析：`p` 初始指向 `a[0]`，所以 `*p` 是 10；`*(p + 2)` 指向 `a[2]`，是 30。`p++` 让 p 前进一个元素，指向 `a[1]`，输出 20。两个指针相减得到相隔的元素个数，`p - a` 为 1。" },

    { id: "ch05-q6", ch: "ch05", kp: "ch05-4", tier: 1, type: "predict", codeTitle: "C", difficulty: 1, tags: ["array-decay", "trace"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>

void bump(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        arr[i] += 1;
    }
}

int main(void) {
    int a[3] = {1, 2, 3};
    bump(a, 3);
    printf("%d %d %d\\n", a[0], a[1], a[2]);
    return 0;
}`,
      answer: "2 3 4",
      explain: "解析：数组名 `a` 作为实参传给 `bump` 时退化为首元素地址，形参 `int arr[]` 实际上是一个指针，函数内 `arr[i]` 修改的就是 main 里的数组。循环把每个元素加 1，所以输出 2 3 4。" },

    { id: "ch05-q7", ch: "ch05", kp: "ch05-4", tier: 2, type: "predict", codeTitle: "C", difficulty: 2, tags: ["2d-array", "trace"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>

int main(void) {
    int a[2][3] = {{1, 2, 3}, {4, 5, 6}};
    printf("%d\\n", *(*(a + 1) + 2));
    printf("%d\\n", a[1][2] - a[0][0]);
    return 0;
}`,
      answer: "6\n5",
      explain: "解析：`a + 1` 指向第二行（类型是 `int (*)[3]`），`*(a + 1)` 得到第二行首元素地址，再 `+ 2` 指向 `a[1][2]`，解引用得 6。第二行 `a[1][2]` 是 6，`a[0][0]` 是 1，相减得 5。" },

    { id: "ch05-q8", ch: "ch05", kp: "ch05-3", tier: 2, type: "fill", difficulty: 2, tags: ["pointer-arithmetic"],
      stem: "`int a[10];` 中，`&a[i]` 等价于 ______（用 a 和 i 表示）。",
      answer: "a + i",
      accept: ["a+i", "&a[0] + i"],
      explain: "解析：`a` 在表达式中退化为 `&a[0]`，指针加 i 会前进 i 个 int，正好指向 `a[i]`，所以 `&a[i]` 与 `a + i` 等价。由此也能推出 `a[i]` 等价于 `*(a + i)`。" },

    { id: "ch05-q9", ch: "ch05", kp: "ch05-4", tier: 2, type: "multi", difficulty: 2, tags: ["array", "pointer"],
      stem: "（多选）关于数组与指针，哪些说法正确？",
      options: [
        { text: "数组名在大多数表达式中退化为指向首元素的指针", correct: true },
        { text: "对数组名做 `sizeof` 不会退化，得到整个数组大小", correct: true },
        { text: "数组名不能被赋值去指向别处", correct: true },
        { text: "对空指针解引用是合法的，会得到 0" }
      ],
      explain: "解析：数组名在传参、算术等场景退化为首元素地址，但 `sizeof`、`&` 等少数场景保留数组类型；它不是可修改的左值，不能写 `a = p`。空指针不指向任何对象，解引用它是未定义行为，通常直接崩溃，绝不是得到 0。" },

    /* ch06 */
    { id: "ch06-q1", ch: "ch06", kp: "ch06-2", tier: 1, type: "mcq", difficulty: 1, tags: ["struct"],
      stem: "有 `struct Point { int x; int y; }; struct Point p = {1, 2}; struct Point *q = &p;`，哪项正确？",
      options: [
        { text: "`q->x` 等价于 `(*q).x`，值为 1", correct: true },
        { text: "`q.x` 等价于 `(*q).x`" },
        { text: "`p` 一定分配在堆上" },
        { text: "`sizeof(p)` 等于 2" }
      ],
      explain: "解析：`->` 是 `(*q).成员` 的语法糖，q 指向 p，所以 `q->x` 就是 p.x，值为 1。`q.x` 把 q 当成结构体而不是指针，编译不过；p 是局部变量，通常在栈上；`sizeof(p)` 至少是两个 int 的大小，不是 2。" },

    { id: "ch06-q2", ch: "ch06", kp: "ch06-1", tier: 2, type: "mcq", difficulty: 2, tags: ["alignment"],
      stem: "关于结构体对齐（alignment），哪项正确？",
      options: [
        { text: "编译器可能在成员之间插入填充字节，使 `sizeof(struct)` 大于各成员大小之和", correct: true },
        { text: "结构体成员一定按声明顺序紧挨着存放，没有任何填充" },
        { text: "结构体总大小一定等于最大成员的大小" },
        { text: "对齐只影响运行速度，不影响 `sizeof`" }
      ],
      explain: "解析：每个成员有对齐要求，编译器会在成员之间或结构体末尾插入填充字节，保证每个成员落在合适的地址上，因此总大小可能大于成员之和。具体填充多少由实现决定，不应写死；调整成员顺序有时能减少填充。" },

    { id: "ch06-q3", ch: "ch06", kp: "ch06-4", tier: 2, type: "mcq", difficulty: 2, tags: ["realloc"],
      stem: "关于 `realloc`，哪项正确？",
      options: [
        { text: "成功时可能返回新地址，旧指针不能再使用；失败时返回 NULL，原内存块仍然有效", correct: true },
        { text: "失败时原内存块会被自动释放" },
        { text: "成功后旧指针仍然有效，可以继续使用" },
        { text: "`realloc` 只能扩大，不能缩小" }
      ],
      explain: "解析：`realloc` 可能把数据搬到新位置，成功后旧地址就失效了，必须用返回值更新指针。失败时返回 NULL，原块保持不变，所以不能写 `p = realloc(p, n)` 直接覆盖，否则原指针丢失、内存泄漏。它也可以用来缩小块。" },

    { id: "ch06-q4", ch: "ch06", kp: "ch06-5", tier: 1, type: "mcq", difficulty: 1, tags: ["free"],
      stem: "关于 `free`，哪项正确？",
      options: [
        { text: "`free(NULL)` 是安全的；对同一块内存重复 free 是未定义行为", correct: true },
        { text: "`free(NULL)` 会崩溃" },
        { text: "可以 free 栈上变量的地址" },
        { text: "free 之后指针会自动变成 NULL" }
      ],
      explain: "解析：标准规定 `free(NULL)` 什么也不做，是安全的；但同一块堆内存释放两次属于未定义行为，常导致堆损坏。只能释放 `malloc`/`calloc`/`realloc` 返回的地址，不能释放栈变量地址。`free` 不会改指针的值，建议手动置 NULL 防止悬垂。" },

    { id: "ch06-q5", ch: "ch06", kp: "ch06-2", tier: 1, type: "predict", codeTitle: "C", difficulty: 1, tags: ["struct", "trace"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>

struct Point { int x; int y; };

int main(void) {
    struct Point p = {3, 4};
    struct Point *q = &p;
    q->x += 1;
    printf("%d %d\\n", p.x, q->y);
    return 0;
}`,
      answer: "4 4",
      explain: "解析：`q` 保存的是 p 的地址，`q->x += 1` 直接修改 p.x，从 3 变成 4；`q->y` 读到的就是 p.y，仍为 4。结构体指针不复制整个结构体，而是共享同一块内存。" },

    { id: "ch06-q6", ch: "ch06", kp: "ch06-3", tier: 1, type: "predict", codeTitle: "C", difficulty: 1, tags: ["malloc", "trace"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *p = malloc(3 * sizeof(int));
    if (p == NULL) return 1;
    for (int i = 0; i < 3; i++) p[i] = i * i;
    printf("%d %d %d\\n", p[0], p[1], p[2]);
    free(p);
    p = NULL;
    printf("%d\\n", p == NULL);
    return 0;
}`,
      answer: "0 1 4\n1",
      explain: "解析：`malloc` 分配 3 个 int 的空间但不初始化，循环把 `p[0]`、`p[1]`、`p[2]` 分别赋为 0、1、4。释放后把 p 置为 NULL，所以 `p == NULL` 为真，输出 1。" },

    { id: "ch06-q7", ch: "ch06", kp: "ch06-3", tier: 1, type: "predict", codeTitle: "C", difficulty: 1, tags: ["calloc", "trace"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *p = calloc(4, sizeof(int));
    if (p == NULL) return 1;
    p[2] += 7;
    printf("%d %d %d\\n", p[0], p[2], p[3]);
    free(p);
    return 0;
}`,
      answer: "0 7 0",
      explain: "解析：`calloc(4, sizeof(int))` 分配 4 个 int 并把它们全部初始化为 0。`p[2] += 7` 只修改第三个元素，变成 7；`p[0]` 和 `p[3]` 仍是 0。" },

    { id: "ch06-q8", ch: "ch06", kp: "ch06-3", tier: 1, type: "fill", difficulty: 1, tags: ["malloc"],
      stem: "为 10 个 `int` 分配内存：`int *p = malloc(10 * ______);`。",
      answer: "sizeof(int)",
      accept: ["sizeof *p", "sizeof(int) 字节"],
      explain: "解析：`malloc` 的参数是字节数，所以要用元素个数乘以单个元素的大小。写 `sizeof(int)` 或 `sizeof *p` 都可以，后者在改变 p 的类型时更不容易出错。" },

    { id: "ch06-q9", ch: "ch06", kp: "ch06-5", tier: 2, type: "multi", difficulty: 2, tags: ["heap", "memory"],
      stem: "（多选）关于堆内存，哪些说法正确？",
      options: [
        { text: "`malloc` 失败时返回 NULL", correct: true },
        { text: "`free(NULL)` 是安全的", correct: true },
        { text: "函数返回局部数组的地址会产生悬垂指针", correct: true },
        { text: "`realloc` 失败后原指针已经被释放" }
      ],
      explain: "解析：`malloc` 分配不到内存时返回 NULL，必须检查；`free(NULL)` 是标准允许的空操作。局部数组在函数返回后栈帧失效，返回它的地址就是悬垂指针。`realloc` 失败时原块仍然有效，并没有被释放。" },

    /* ch07 */
    { id: "ch07-q1", ch: "ch07", kp: "ch07-2", tier: 2, type: "mcq", difficulty: 2, tags: ["void-pointer"],
      stem: "在标准 C 中，对 `void *` 能做什么？",
      options: [
        { text: "可以保存任意对象指针，并隐式转换为其他对象指针；但不能直接解引用，也不能直接做指针算术", correct: true },
        { text: "可以直接解引用，得到一个 void 值" },
        { text: "可以直接 `p + 1`，步长固定为 1 字节" },
        { text: "可以保存函数指针并直接调用" }
      ],
      explain: "解析：`void *` 是通用对象指针，与任意对象指针之间可以隐式转换；但它指向的类型不完整，标准不允许解引用，也不允许对它做指针算术（GCC 把步长当 1 字节只是扩展）。函数指针与 `void *` 的互转在标准 C 中也不保证。" },

    { id: "ch07-q2", ch: "ch07", kp: "ch07-4", tier: 1, type: "mcq", difficulty: 1, tags: ["function-pointer"],
      stem: "声明 `int (*fp)(int, int);` 的含义是？",
      options: [
        { text: "fp 是指向“接受两个 int、返回 int 的函数”的指针", correct: true },
        { text: "fp 是一个返回 int* 的函数" },
        { text: "fp 是接受两个 int 并返回 int 的函数" },
        { text: "fp 是 int 数组" }
      ],
      explain: "解析：括号让 `*` 先与 fp 结合，所以 fp 首先是指针；右边 `(int, int)` 是参数列表，左边 `int` 是返回类型。若写成 `int *fp(int, int)`，才是“返回 int* 的函数”。" },

    { id: "ch07-q3", ch: "ch07", kp: "ch07-6", tier: 1, type: "mcq", difficulty: 1, tags: ["qsort"],
      stem: "`qsort` 的比较函数 `int cmp(const void *a, const void *b)` 应如何返回？",
      options: [
        { text: "按 a 小于、等于、大于 b 分别返回负数、0、正数", correct: true },
        { text: "返回 a 与 b 的地址差" },
        { text: "只能返回 0 或 1" },
        { text: "返回要交换的元素个数" }
      ],
      explain: "解析：`qsort` 只关心返回值的符号：负数表示 a 应排在 b 前，0 表示相等，正数表示 a 应排在 b 后。返回地址差没有意义，返回 0/1 也无法表达“小于”。" },

    { id: "ch07-q4", ch: "ch07", kp: "ch07-3", tier: 2, type: "mcq", difficulty: 2, tags: ["generic"],
      stem: "写通用 `swap(void *a, void *b, size_t n)` 时，为什么不能直接写 `void *tmp = *a;`？",
      options: [
        { text: "`void *` 不能解引用，而且编译期不知道对象大小，必须按字节复制", correct: true },
        { text: "因为 `void *` 不能赋值" },
        { text: "因为 C 没有指针" },
        { text: "因为 `*a` 总是 int" }
      ],
      explain: "解析：`void *` 指向的类型未知，既不能解引用，也不能做 `*a` 这样的取值；而且通用交换必须知道要复制多少字节，所以额外传入 `n`，用 `memcpy` 按字节搬运。" },

    { id: "ch07-q5", ch: "ch07", kp: "ch07-4", tier: 1, type: "predict", codeTitle: "C", difficulty: 1, tags: ["function-pointer", "trace"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>

int add(int a, int b) { return a + b; }
int mul(int a, int b) { return a * b; }

int main(void) {
    int (*op)(int, int) = add;
    printf("%d\\n", op(3, 4));
    op = mul;
    printf("%d\\n", op(3, 4));
    return 0;
}`,
      answer: "7\n12",
      explain: "解析：`op` 先指向 `add`，`op(3, 4)` 等价于 `add(3, 4)`，得 7；随后把 `mul` 的地址赋给 op，再调用就执行乘法，得 12。函数指针让“调用哪个函数”可以在运行时决定。" },

    { id: "ch07-q6", ch: "ch07", kp: "ch07-6", tier: 2, type: "predict", codeTitle: "C", difficulty: 2, tags: ["qsort", "trace"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>
#include <stdlib.h>

int cmp(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y);
}

int main(void) {
    int a[5] = {5, 1, 4, 2, 3};
    qsort(a, 5, sizeof(int), cmp);
    for (int i = 0; i < 5; i++) {
        printf("%d%s", a[i], i < 4 ? " " : "\\n");
    }
    return 0;
}`,
      answer: "1 2 3 4 5",
      explain: "解析：`qsort` 按比较函数把数组升序排列，得到 1、2、3、4、5。循环在元素之间输出空格，最后一个元素后输出换行，所以整行是 `1 2 3 4 5`。" },

    { id: "ch07-q7", ch: "ch07", kp: "ch07-3", tier: 3, type: "predict", codeTitle: "C", difficulty: 2, tags: ["generic", "memcpy"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>
#include <string.h>

void swap_bytes(void *a, void *b, size_t n) {
    unsigned char tmp[16];
    memcpy(tmp, a, n);
    memcpy(a, b, n);
    memcpy(b, tmp, n);
}

int main(void) {
    int x = 1, y = 2;
    swap_bytes(&x, &y, sizeof(int));
    printf("%d %d\\n", x, y);

    double d1 = 1.5, d2 = 2.5;
    swap_bytes(&d1, &d2, sizeof(double));
    printf("%.1f %.1f\\n", d1, d2);
    return 0;
}`,
      answer: "2 1\n2.5 1.5",
      explain: "解析：`swap_bytes` 不关心类型，只按 n 个字节把 a 的内容暂存、用 b 覆盖 a、再用暂存内容覆盖 b，所以 int 和 double 都能交换。第一次交换后 x=2、y=1；第二次交换后 d1=2.5、d2=1.5。" },

    { id: "ch07-q8", ch: "ch07", kp: "ch07-4", tier: 1, type: "fill", difficulty: 1, tags: ["function-pointer"],
      stem: "`int (*fp)(int, int);` 中，`fp` 是一个 ______。",
      answer: "函数指针",
      accept: ["指向函数的指针", "function pointer", "函数指针变量"],
      explain: "解析：fp 不是函数本身，而是保存函数地址的变量；通过 `fp(1, 2)` 或 `(*fp)(1, 2)` 都能调用它指向的函数。函数名在表达式中会转换成指向该函数的指针。" },

    { id: "ch07-q9", ch: "ch07", kp: "ch07-2", tier: 2, type: "multi", difficulty: 2, tags: ["generic", "function-pointer"],
      stem: "（多选）关于泛型与函数指针，哪些说法正确？",
      options: [
        { text: "函数名在表达式中可以转换为指向该函数的指针", correct: true },
        { text: "`void *` 可以与任意对象指针相互转换", correct: true },
        { text: "`qsort` 通过 `void *` 把元素地址传给比较函数", correct: true },
        { text: "函数指针不能作为函数参数" }
      ],
      explain: "解析：函数名在大多数表达式中退化为函数指针，因此可以直接赋给同类型的函数指针。`void *` 是通用对象指针，与任意对象指针可互转；`qsort` 正是靠它把每个元素的地址交给回调。函数指针当然可以作为参数，回调就是这么实现的。" },

    /* ch08 */
    { id: "ch08-q1", ch: "ch08", kp: "ch08-5", tier: 2, type: "mcq", difficulty: 2, tags: ["abi"],
      stem: "在 x86-64 System V 调用约定中，前六个整型/指针参数依次放入哪些寄存器？",
      options: [
        { text: "`rdi, rsi, rdx, rcx, r8, r9`", correct: true },
        { text: "`rax, rbx, rcx, rdx, rsi, rdi`" },
        { text: "`rsp, rbp, rdi, rsi, rdx, rcx`" },
        { text: "`eax, ebx, ecx, edx, esi, edi`" }
      ],
      explain: "解析：System V AMD64 ABI 规定前六个整型或指针参数依次用 rdi、rsi、rdx、rcx、r8、r9 传递，更多参数才压栈。rax 常用于存放返回值，rsp/rbp 是栈指针和帧指针，不是参数寄存器。" },

    { id: "ch08-q2", ch: "ch08", kp: "ch08-4", tier: 1, type: "mcq", difficulty: 1, tags: ["assembly"],
      stem: "关于 `call` 与 `ret`，哪项正确？",
      options: [
        { text: "`call` 把返回地址压栈并跳转；`ret` 弹出返回地址并跳回", correct: true },
        { text: "`call` 只跳转，不压栈" },
        { text: "`ret` 把返回值压栈" },
        { text: "`call` 会清空当前栈帧" }
      ],
      explain: "解析：`call` 先把下一条指令的地址（返回地址）压入栈，再跳到被调函数；函数结束时 `ret` 从栈顶弹出这个地址，回到调用点继续执行。返回值通常放在 rax，与 `ret` 指令无关。" },

    { id: "ch08-q3", ch: "ch08", kp: "ch08-6", tier: 1, type: "predict", codeTitle: "C", difficulty: 1, tags: ["recursion", "trace"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>

int fact(int n) {
    if (n <= 1) return 1;
    return n * fact(n - 1);
}

int main(void) {
    printf("%d\\n", fact(4));
    printf("%d\\n", fact(0));
    return 0;
}`,
      answer: "24\n1",
      explain: "解析：`fact(4)` 展开为 4 × 3 × 2 × 1 = 24；递归在 n 减到 1 时返回 1。`fact(0)` 满足 `n <= 1`，直接返回 1，不会继续递归。每次调用都有自己的栈帧，返回时逐层弹出。" },

    { id: "ch08-q4", ch: "ch08", kp: "ch08-5", tier: 1, type: "predict", codeTitle: "C", difficulty: 1, tags: ["pass-by-value", "trace"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>

void inc(int x) { x++; }
void incp(int *x) { (*x)++; }

int main(void) {
    int a = 5;
    inc(a);
    printf("%d\\n", a);
    incp(&a);
    printf("%d\\n", a);
    return 0;
}`,
      answer: "5\n6",
      explain: "解析：C 的参数按值传递：`inc(a)` 只把 5 复制给形参 x，函数内自增不影响 main 的 a，所以第一次仍输出 5。`incp(&a)` 传入地址，函数通过 `(*x)++` 直接修改 a，第二次输出 6。" },

    { id: "ch08-q5", ch: "ch08", kp: "ch08-6", tier: 2, type: "predict", codeTitle: "C", difficulty: 2, tags: ["static", "trace"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>

void tick(void) {
    static int n = 0;
    n++;
    printf("%d\\n", n);
}

int main(void) {
    tick();
    tick();
    tick();
    return 0;
}`,
      answer: "1\n2\n3",
      explain: "解析：`static` 局部变量只初始化一次，生命周期贯穿整个程序，而不是每次调用重新创建。第一次调用 n 从 0 变 1，第二次保留上次的值变成 2，第三次变成 3，所以输出 1、2、3。" },

    { id: "ch08-q6", ch: "ch08", kp: "ch08-6", tier: 2, type: "predict", codeTitle: "C", difficulty: 2, tags: ["scope", "trace"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>

int g = 10;

void f(void) {
    int g = 20;
    printf("%d\\n", g);
}

int main(void) {
    printf("%d\\n", g);
    f();
    printf("%d\\n", g);
    return 0;
}`,
      answer: "10\n20\n10",
      explain: "解析：`f` 里的局部变量 `g` 遮蔽了全局 `g`，所以函数内打印 20；它只在这个函数的花括号内有效。main 里看到的仍是全局 g，调用 f 前后都是 10，函数调用不会改变同名全局变量。" },

    { id: "ch08-q7", ch: "ch08", kp: "ch08-5", tier: 1, type: "fill", difficulty: 1, tags: ["abi"],
      stem: "在 x86-64 System V 调用约定中，第一个整型参数放在 ______ 寄存器。",
      answer: "rdi",
      accept: ["%rdi", "RDI", "rdi 寄存器"],
      explain: "解析：前六个整型参数依次使用 rdi、rsi、rdx、rcx、r8、r9，所以第一个参数在 rdi。浮点参数则使用另一组 xmm 寄存器，不占用这六个位置。" },

    { id: "ch08-q8", ch: "ch08", kp: "ch08-4", tier: 1, type: "fill", difficulty: 1, tags: ["assembly"],
      stem: "`call` 指令会把 ______ 压入栈，然后跳转到被调函数。",
      answer: "返回地址",
      accept: ["return address", "下一条指令的地址", "call 的下一条指令地址"],
      explain: "解析：压栈的是 `call` 后面那条指令的地址，也就是函数执行完要回来的位置。被调函数执行 `ret` 时弹出它，程序就回到调用点继续。" },

    { id: "ch08-q9", ch: "ch08", kp: "ch08-4", tier: 2, type: "multi", difficulty: 2, tags: ["stack", "abi"],
      stem: "（多选）关于栈帧与函数调用，哪些说法正确？",
      options: [
        { text: "每次函数调用通常建立自己的栈帧", correct: true },
        { text: "未优化时，局部变量通常放在栈上", correct: true },
        { text: "x86-64 中所有参数都必须通过栈传递" },
        { text: "递归的每一层调用都有自己的栈帧", correct: true }
      ],
      explain: "解析：栈帧保存返回地址、保存的寄存器、局部变量等，每次调用都会建立，递归也不例外，所以递归太深会栈溢出。x86-64 前六个整型参数用寄存器传递，只有更多参数或较大对象才走栈，因此“所有参数都必须通过栈”是错的。" },

    /* ch09 */
    { id: "ch09-q1", ch: "ch09", kp: "ch09-1", tier: 1, type: "mcq", difficulty: 1, tags: ["buffer-overflow"],
      stem: "`char buf[4]; strcpy(buf, \"hello\");` 的问题是什么？",
      options: [
        { text: "源串 6 字节（含 `'\\0'`）写进 4 字节缓冲区，发生越界写，是未定义行为", correct: true },
        { text: "完全安全，`strcpy` 会自动截断" },
        { text: "只会丢失最后一个字符，程序行为有定义" },
        { text: "编译阶段一定报错" }
      ],
      explain: "解析：`hello` 有 5 个字符，加上结尾 `'\\0'` 共 6 字节，而 buf 只有 4 字节；`strcpy` 不做边界检查，会继续往后写，覆盖相邻内存，属于未定义行为。编译器通常不会报错，运行时可能崩溃或被利用。" },

    { id: "ch09-q2", ch: "ch09", kp: "ch09-5", tier: 2, type: "mcq", difficulty: 2, tags: ["concurrency"],
      stem: "两个线程在没有同步的情况下同时对同一个 `int` 变量执行 `x++`，可能发生什么？",
      options: [
        { text: "数据竞争，属于未定义行为，最终值不确定", correct: true },
        { text: "一定得到正确结果，因为 `++` 是原子操作" },
        { text: "一定死锁" },
        { text: "编译器会自动加锁" }
      ],
      explain: "解析：`x++` 通常被拆成读、加、写三步，两个线程可能交错执行，导致更新丢失；没有同步的并发读写构成数据竞争，标准规定为未定义行为。`++` 不是原子操作，编译器也不会自动加锁；数据竞争不等于死锁。" },

    { id: "ch09-q3", ch: "ch09", kp: "ch09-6", tier: 2, type: "mcq", difficulty: 2, tags: ["deadlock"],
      stem: "降低多线程死锁风险的常见做法是？",
      options: [
        { text: "让所有线程按相同的全局顺序获取多把锁", correct: true },
        { text: "每个线程按随机顺序加锁" },
        { text: "加锁后不再解锁" },
        { text: "尽量多嵌套加锁" }
      ],
      explain: "解析：死锁的经典成因是循环等待：线程 A 持有锁 1 等锁 2，线程 B 持有锁 2 等锁 1。规定所有线程按同一顺序加锁可以破坏循环等待。随机顺序、忘记解锁、嵌套加锁都会增加死锁风险。" },

    { id: "ch09-q4", ch: "ch09", kp: "ch09-2", tier: 2, type: "predict", codeTitle: "C", difficulty: 2, tags: ["snprintf", "trace"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>

int main(void) {
    char buf[8];
    int n = snprintf(buf, sizeof(buf), "%s", "hello!");
    printf("%d\\n", n);
    printf("%s\\n", buf);
    return 0;
}`,
      answer: "6\nhello!",
      explain: "解析：`snprintf` 最多写入 size-1 个字符再加结尾符；这里 buf 有 8 字节，`hello!` 只有 6 个字符，完全放得下。它的返回值是“假如空间足够本应写入的字符数”，即 6，而不是实际写入数。" },

    { id: "ch09-q5", ch: "ch09", kp: "ch09-1", tier: 2, type: "predict", codeTitle: "C", difficulty: 2, tags: ["strncpy", "trace"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char src[] = "overflow";
    char dst[5];
    strncpy(dst, src, sizeof(dst) - 1);
    dst[sizeof(dst) - 1] = '\\0';
    printf("%s\\n", dst);
    printf("%zu\\n", strlen(dst));
    return 0;
}`,
      answer: "over\n4",
      explain: "解析：`sizeof(dst) - 1` 为 4，`strncpy` 只复制前 4 个字符 o、v、e、r；因为源串更长，它不会自动补结尾符。随后手动把 `dst[4]` 设为 `'\\0'`，字符串才是合法的，输出 over，长度为 4。" },

    { id: "ch09-q6", ch: "ch09", kp: "ch09-2", tier: 1, type: "predict", codeTitle: "C", difficulty: 1, tags: ["string", "memory"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char s[6] = {'a', 'b', 'c', 'd', 'e', '\\0'};
    printf("%zu\\n", strlen(s));
    s[2] = '\\0';
    printf("%s\\n", s);
    printf("%zu\\n", strlen(s));
    return 0;
}`,
      answer: "5\nab\n2",
      explain: "解析：初始数组是 a、b、c、d、e 加结尾符，`strlen` 得到 5。把 `s[2]` 改成 `'\\0'` 后，字符串在第三个字节提前结束，`printf` 只输出 ab，`strlen` 也变成 2，后面的 d、e 不再可见。" },

    { id: "ch09-q7", ch: "ch09", kp: "ch09-2", tier: 1, type: "predict", codeTitle: "C", difficulty: 1, tags: ["heap", "trace"],
      stem: "写出下面程序的输出。",
      code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *p = malloc(2 * sizeof(int));
    if (p == NULL) return 1;
    p[0] = 3;
    p[1] = 4;
    int sum = p[0] + p[1];
    free(p);
    p = NULL;
    printf("%d\\n", sum);
    printf("%d\\n", p == NULL);
    return 0;
}`,
      answer: "7\n1",
      explain: "解析：分配两个 int，分别写入 3 和 4，求和得到 7；求和发生在 free 之前，所以结果有效。释放后把 p 置为 NULL，避免悬垂指针，`p == NULL` 为真，输出 1。" },

    { id: "ch09-q8", ch: "ch09", kp: "ch09-1", tier: 1, type: "fill", difficulty: 1, tags: ["snprintf"],
      stem: "`char buf[10];` 用 `snprintf` 最多写入 9 个字符加结尾符：`snprintf(buf, ______, ...);`。",
      answer: "sizeof(buf)",
      accept: ["sizeof buf", "10"],
      explain: "解析：`snprintf` 的第二个参数是缓冲区总大小，传 `sizeof(buf)` 能随数组声明自动变化，比写死 10 更安全。它会预留一个字节给结尾符，所以最多写入 size-1 个可见字符。" },

    { id: "ch09-q9", ch: "ch09", kp: "ch09-5", tier: 3, type: "multi", difficulty: 2, tags: ["security", "concurrency"],
      stem: "（多选）关于内存安全与并发，哪些说法正确？",
      options: [
        { text: "数组越界写是未定义行为", correct: true },
        { text: "两个线程无同步地读写同一变量构成数据竞争", correct: true },
        { text: "`volatile` 能保证多线程访问的原子性和互斥" },
        { text: "互斥锁可以保护临界区，避免数据竞争", correct: true }
      ],
      explain: "解析：越界写破坏的是不属于该数组的内存，标准规定为未定义行为。没有同步的并发读写构成数据竞争，同样是未定义行为。`volatile` 只告诉编译器该变量可能被外部改变、不要随意优化读写，它不提供原子性，也不提供互斥；互斥锁才能保护临界区。" }
  ] };
  var G = (typeof globalThis !== 'undefined') ? globalThis : (typeof window !== 'undefined') ? window : this;
  var C = G && G.CSC;
  if (C && typeof C.registerQuizPack === 'function') {
    try { C._quizPack = PACK; } catch (e) {}
    C.registerQuizPack(PACK);
  }
})();
