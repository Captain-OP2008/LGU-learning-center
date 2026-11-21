/* =====================================================================
 * data/ch04.js · 第 04 章：字符与 C 字符串
 * 职责：char 与 ASCII、字符数组、'\0' 结尾约定、strlen 与手写遍历、
 *       strcpy/strncpy/strcat/strcmp、字符与数字互转、缓冲区越界。
 * 内容块 schema 见 学习中心/.work/AUTHORING.md；示例均按 C17 书写。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch04',
  num: '04',
  title: '字符与 C 字符串',
  en: 'Chars & C Strings',
  goals: [
    '能用 char 与 ASCII 解释字符在内存里的形态，并完成字符与数字的互转',
    '能说明"字符串就是字符数组加一个结尾零"，画出任意 C 字符串的内存布局',
    '能手写 strlen，并说清 sizeof 与 strlen 为什么结果不同',
    '能安全使用 strcpy、strncpy、strcat、strcmp，避开常见的边界错误',
    '能指出一段字符串代码的越界风险，并改写成有界的、能自证安全的版本'
  ],
  kp: [
    { id: 'ch04-1', title: 'char 与 ASCII' },
    { id: 'ch04-2', title: '字符串就是字符数组' },
    { id: 'ch04-3', title: '\\0 结尾约定' },
    { id: 'ch04-4', title: 'strlen：重新认识长度' },
    { id: 'ch04-5', title: '复制、拼接与边界' },
    { id: 'ch04-6', title: 'strcmp 与字符转换' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      'C 没有内置的字符串类型。<b>所谓字符串，只是一个以零字节结尾的字符数组</b>。' +
      '这条约定既是 C 简洁的体现，也是无数安全漏洞的源头：' +
      '长度不会被记录，所有函数都靠"往后数到 0"来工作，一旦忘了那个 0 或者写超出边界，' +
      '程序就会读到别人的数据、覆盖自己的栈，甚至被攻击者利用。' +
      '这一章既讲怎么用，也讲为什么会出事。'
    },

    { t: 'p', lead: true, html:
      '从上一章的位与字节，走到本章的字符，只差一步：' +
      '<b>字符就是一个字节的整数</b>，所谓文本，是一串这样的整数加一个结尾标记。' +
      '理解这一点，你就不会再奇怪为什么 <code>char</code> 可以参与算术、' +
      '为什么 <code>\'0\'</code> 和 <code>0</code> 不是一回事、' +
      '为什么 <code>strlen</code> 一次要遍历整个字符串。'
    },

    { t: 'h', text: '一、char 与 ASCII', id: 'ch04-1' },

    { t: 'p', html:
      '<code>char</code> 是 C 里最小的整数类型，占 1 个字节（也就是 8 位，<code>sizeof(char)</code> 按定义恒为 1）。' +
      '它存字符的方式，就是把字符的<b>编码</b>存进去。C 保证基本字符集中的数字、大小写字母是连续编码的，' +
      '而且 <code>\'0\'</code> 到 <code>\'9\'</code>、<code>\'A\'</code> 到 <code>\'Z\'</code>、' +
      '<code>\'a\'</code> 到 <code>\'z\'</code> 各自连成一段，所以可以放心地做 <code>c - \'0\'</code> 这种运算。'
    },

    { t: 'code', lang: 'c', caption: 'ascii.c —— 字符与它的编码是一回事', code:
`#include <stdio.h>

int main(void)
{
    char ch = 'A';

    printf("字符 %c 的编码 = %d\\n", ch, ch);
    printf("'0' = %d, '9' = %d\\n", '0', '9');
    printf("'A' = %d, 'Z' = %d\\n", 'A', 'Z');
    printf("'a' = %d, 'z' = %d\\n", 'a', 'z');
    printf("'a' - 'A' = %d\\n", 'a' - 'A');

    /* 数字字符转数值：靠的是编码连续 */
    printf("'7' - '0' = %d\\n", '7' - '0');

    /* 编码转字符 */
    printf("65 对应的字符 = %c\\n", 65);

    /* 大小写转换也可以靠加减 32 完成 */
    char lower = 'q';
    char upper = (char)(lower - 32);
    printf("%c -> %c\\n", lower, upper);

    /* 循环打印字母 */
    for (int c = 'A'; c <= 'E'; c++) {
        printf("%c(%d) ", c, c);
    }
    putchar('\\n');
    return 0;
}
` },

    { t: 'table', caption: '必须记牢的几个编码（ASCII 兼容）', head: ['字符', '编码', '记忆点'], rows: [
      ['<code>\'0\'</code>', '48', '<code>\'9\'</code> 是 57，连续 10 个'],
      ['<code>\'A\'</code>', '65', '<code>\'Z\'</code> 是 90，连续 26 个'],
      ['<code>\'a\'</code>', '97', '<code>\'z\'</code> 是 122，连续 26 个'],
      ['<code>\' \'</code>', '32', '空格'],
      ['<code>\'\\n\'</code>', '10', '换行'],
      ['<code>\'\\t\'</code>', '9', '制表'],
      ['<code>\'\\0\'</code>', '0', '<b>空字符，字符串的终止标记</b>']
    ] },

    { t: 'callout', kind: 'warn', title: 'char 是不是有符号，标准没说', html:
      'C 有三种字符类型：<code>char</code>、<code>signed char</code>、<code>unsigned char</code>。' +
      '其中 <b><code>char</code> 到底是无符号还是有符号，由实现决定</b>。' +
      '大多数平台上有符号，于是 0x80 以上的字节读出来是负数。' +
      '所以：<b>存字符用 <code>char</code>；把内存当原始字节处理时用 <code>unsigned char</code></b>，' +
      '否则比较和打印都可能出意外。'
    },

    { t: 'callout', kind: 'note', title: '字符常量在 C 里是 int', html:
      '在 C 里，<code>\'A\'</code> 的类型是 <code>int</code>，不是 <code>char</code>。' +
      '这看起来奇怪，但它让 <code>\'A\' + 1</code>、<code>c - \'0\'</code> 这类运算自然地以整数进行。' +
      '（C++ 里 <code>\'A\'</code> 是 <code>char</code>，两种语言在这里不一样，别记混。）' +
      '把结果赋给 <code>char</code> 时会发生截断，所以本课在这些地方写显式 <code>(char)</code> 转换。'
    },

    { t: 'h', text: '二、字符串就是字符数组', id: 'ch04-2' },

    { t: 'p', html:
      '既然字符是整数，一串字符就是连续排列的整数。' +
      'C 的字符串就是<b>一个字符数组，最后一个字符是值为 0 的字节</b>。' +
      '用双引号写的字符串字面量，编译器会自动在末尾补上这个 0。'
    },

    { t: 'code', lang: 'c', caption: 'string_array.c —— 三种写法，三种结果', code:
`#include <stdio.h>
#include <string.h>

int main(void)
{
    char a[] = "Alice";     /* 自动确定大小：A l i c e \\0，共 6 字节 */
    char b[6] = "Alice";    /* 显式给足 6 字节，刚好放得下结尾零 */
    char c[4] = "Alice";    /* 标准允许，但只放得下 4 个字符，没有结尾零 */

    printf("sizeof(a) = %zu, strlen(a) = %zu\\n", sizeof a, strlen(a));
    printf("sizeof(b) = %zu, strlen(b) = %zu\\n", sizeof b, strlen(b));
    printf("sizeof(c) = %zu（没有地方放结尾零）\\n", sizeof c);

    printf("a = %s\\n", a);
    printf("b = %s\\n", b);

    /* 逐字节看 a 的内容，结尾零清晰可见 */
    printf("a 的每个字节：");
    for (size_t i = 0; i < sizeof a; i++) {
        printf("[%zu]=%d ", i, (int)(unsigned char)a[i]);
    }
    putchar('\\n');
    return 0;
}
` },

    { t: 'p', html:
      '把 <code>char a[] = "Alice"</code> 摊开在内存里，就是这样一张表：' +
      '<b>注意下标 5 那一格是 0，它不属于"内容"，但决定了这个字符串到哪里结束</b>。' +
      '任何按字符串处理的函数，都会在下标 5 处停下。'
    },

    { t: 'table', caption: 'char a[] = "Alice" 的内存布局', head: ['下标', '0', '1', '2', '3', '4', '5'], rows: [
      ['字符', '<code>A</code>', '<code>l</code>', '<code>i</code>', '<code>c</code>', '<code>e</code>', '<code>\\0</code>'],
      ['字节值', '65', '108', '105', '99', '101', '<b>0</b>']
    ] },

    { t: 'callout', kind: 'warn', title: '字符串字面量不能改', html:
      '<code>char *p = "hello";</code> 让指针指向字符串字面量，它通常放在<b>只读数据段</b>。' +
      '<code>p[0] = \'H\';</code> 编译能通过，运行时可能直接崩溃——这是未定义行为。' +
      '要能改，必须复制到自己的数组里：<code>char buf[] = "hello";</code>。' +
      '现代 C 推荐把只读字符串声明为 <code>const char *</code>，让编译器帮你挡住这类写入。'
    },

    { t: 'h', text: '三、\\0 结尾约定', id: 'ch04-3' },

    { t: 'p', html:
      '结尾零是 C 字符串的全部秘密。<b>它是一个值为 0 的字节，不是数字字符 <code>\'0\'</code></b>' +
      '（后者编码是 48）。所有字符串函数——<code>strlen</code>、<code>strcpy</code>、' +
      '<code>strcmp</code>、<code>printf</code> 的 <code>%s</code>——都靠"一直读到 0 为止"来工作。' +
      '这意味着两件事：<b>没有结尾零，函数就会继续读下去</b>；' +
      '<b>结尾零之后的字节，函数根本不知道存在</b>。'
    },

    { t: 'code', lang: 'c', caption: 'terminator.c —— 手动构造与检查结尾零', code:
`#include <stdio.h>
#include <string.h>

int main(void)
{
    char word[8];

    /* 手动逐字节填充，必须记得最后补 0 */
    word[0] = 'C';
    word[1] = 'a';
    word[2] = 't';
    word[3] = '\\0';

    printf("word = %s, 长度 = %zu, 容量 = %zu\\n",
           word, strlen(word), sizeof word);

    /* 把结尾零改成别的字符，字符串就"变长"了 */
    word[3] = '!';
    printf("改掉结尾零之后：%s（后面是不确定的内容，危险！）\\n", word);

    /* 正确做法：用 snprintf 一次写好，它总会放结尾零 */
    char safe[8];
    snprintf(safe, sizeof safe, "%s", "Cat");
    printf("safe = %s, 长度 = %zu\\n", safe, strlen(safe));
    return 0;
}
` },

    { t: 'callout', kind: 'warn', title: '0、\'0\'、\'\\0\' 三者完全不同', html:
      '<code>0</code> 是整数零；<code>\'0\'</code> 是字符"零"，编码 <b>48</b>；' +
      '<code>\'\\0\'</code> 是空字符，编码 <b>0</b>，也就是字符串终止标记。' +
      '写 <code>buf[n] = \'0\';</code> 想"结束字符串"，实际写进去的是 48，' +
      '字符串不会结束，后续函数会一路读下去。这是新手最常犯的错误之一。'
    },

    { t: 'h', text: '四、strlen：重新认识长度', id: 'ch04-4' },

    { t: 'p', html:
      '<code>strlen(s)</code> 返回的是<b>从 <code>s</code> 开始数到第一个 0 之前的字节数</b>，' +
      '不包含结尾零，返回类型是 <code>size_t</code>（所以要用 <code>%zu</code> 打印）。' +
      '它的代价是<b>每次都从头数一遍</b>，长度 n 就要访问 n 个字节；' +
      '在循环里反复调用 <code>strlen</code> 是常见的性能陷阱。'
    },

    { t: 'code', lang: 'c', caption: 'strlen_impl.c —— 自己实现一遍就懂了', code:
`#include <stdio.h>
#include <string.h>

/* 手写 strlen：从开头往后走，直到遇见值为 0 的字节 */
static size_t my_strlen(const char *s)
{
    const char *p = s;
    while (*p != '\\0') {
        p++;
    }
    return (size_t)(p - s);      /* 指针相减得到元素个数 */
}

int main(void)
{
    const char *text = "hello";
    char buf[] = "hello world";
    char empty[] = "";

    printf("my_strlen(\\"%s\\") = %zu\\n", text, my_strlen(text));
    printf("strlen   (\\"%s\\") = %zu\\n", text, strlen(text));

    printf("sizeof(text) = %zu（指针大小，不是字符串长度）\\n", sizeof text);
    printf("sizeof(buf)  = %zu（含结尾零）\\n", sizeof buf);
    printf("strlen(buf)  = %zu（不含结尾零）\\n", strlen(buf));

    printf("空字符串：sizeof = %zu, strlen = %zu\\n",
           sizeof empty, strlen(empty));
    return 0;
}
` },

    { t: 'table', caption: 'sizeof 与 strlen 的区别', head: ['声明', '<code>sizeof</code>', '<code>strlen</code>', '原因'], rows: [
      ['<code>char s[] = "hello";</code>', '6', '5', 'sizeof 含结尾零，strlen 不含'],
      ['<code>char s[20] = "hello";</code>', '20', '5', 'sizeof 是数组容量，与内容无关'],
      ['<code>char *p = "hello";</code>', '8', '5', 'sizeof 是指针大小'],
      ['<code>char s[100]; s[0] = 0;</code>', '100', '0', '容量不变，内容为空'],
      ['<code>char s[] = "";</code>', '1', '0', '空字符串也占一个字节']
    ] },

    { t: 'callout', kind: 'warn', title: 'strlen 的三种崩溃方式', html:
      '一、传 <code>NULL</code>：直接解引用空指针，段错误。' +
      '二、字符串没有结尾零：一路读到内存边界，崩溃或者读出一个荒谬的长度。' +
      '三、指针不是指向一个真正的字符串，比如把结构体地址强转成 <code>char *</code>。' +
      '<b><code>strlen</code> 无法验证自己的输入</b>，这是 C 接口的普遍特征：由调用者保证前置条件。'
    },

    { t: 'h', text: '为什么 C 不把长度存下来', lvl: 3 },

    { t: 'p', html:
      '现代语言大多在字符串对象里存一个长度字段，C 却只存"结尾零"。' +
      '这不是疏忽，而是取舍：<b>结尾零方案不占额外空间、任何字符数组都能当字符串用、' +
      '不需要为字符串分配一个管理结构</b>。代价是求长度必须遍历，' +
      '而且长度完全依赖内容——一旦结尾零丢失，就再也找不回原来的边界。'
    },

    { t: 'table', caption: '两种字符串表示方案', head: ['维度', 'C 的做法：结尾零', '带长度字段的做法'], rows: [
      ['额外空间', '1 个字节', '4 或 8 个字节'],
      ['求长度', '<code>O(n)</code> 遍历', '<code>O(1)</code> 读字段'],
      ['表示方式', '任何 <code>char</code> 数组都行', '必须是特定的字符串对象'],
      ['边界安全', '由调用者保证，没有自动保护', '长度与内容一起管理，较难越界'],
      ['与底层兼容', '可以直接对应字节缓冲区', '需要封装与转换']
    ] },

    { t: 'h', text: '五、复制、拼接与边界', id: 'ch04-5' },

    { t: 'p', html:
      '<code>strcpy(dst, src)</code> 逐个字节复制，直到 src 的结尾零；' +
      '<code>strcat(dst, src)</code> 先找到 dst 的结尾零，再把 src 接上去。' +
      '两个函数都<b>完全不检查 dst 有多大</b>——这不是实现的疏忽，而是标准就这么规定的：' +
      '它们相信调用者已经保证了目标有足够空间。'
    },

    { t: 'code', lang: 'c', caption: 'copy.c —— 从"相信调用者"到"自己保证安全"', code:
`#include <stdio.h>
#include <string.h>

int main(void)
{
    char dst[32];

    /* 安全的前提：dst 放得下 */
    strcpy(dst, "hello");
    printf("dst = %s，长度 %zu\\n", dst, strlen(dst));

    strcat(dst, ", world");
    printf("dst = %s，长度 %zu\\n", dst, strlen(dst));

    /* strncpy：最多复制 n 个字节，但它不保证结尾零，必须自己补 */
    char fixed[8];
    strncpy(fixed, "abcdefgh", sizeof fixed - 1);
    fixed[sizeof fixed - 1] = '\\0';
    printf("fixed = %s\\n", fixed);

    /* 更省心：snprintf 一定会放结尾零，超长就截断 */
    char safe[8];
    snprintf(safe, sizeof safe, "%s", "abcdefgh");
    printf("safe = %s，长度 %zu（被截断）\\n", safe, strlen(safe));

    /* 拼接到固定容量的缓冲区 */
    char line[16];
    snprintf(line, sizeof line, "%s-%s", "C", "lang");
    printf("line = %s\\n", line);
    return 0;
}
` },

    { t: 'compare', lang: 'c', left: {
      title: '没有任何保护', html: '指针是不是有效、目标有多大，<code>strcpy</code> 都不知道。' +
        '写超了就是静默破坏内存，可能当场崩，也可能潜伏到后面才发作。', code:
`char dst[8];
strcpy(dst, "this is a long string");   /* 溢出，未定义行为 */`
    }, right: {
      title: '把容量写进调用', html: '<code>snprintf</code> 接受目标容量，' +
        '保证结果以零结尾，超长时截断而不是溢出。', code:
`char dst[8];
snprintf(dst, sizeof dst, "%s", "this is a long string");
/* dst 里是 "this is"，长度 7，安全 */`
    } },

    { t: 'table', caption: '字符串函数的边界语义', head: ['函数', '做什么', '边界风险', '推荐替代'], rows: [
      ['<code>strcpy(dst, src)</code>', '复制到 src 结束', '<b>不检查 dst 容量</b>', '<code>snprintf(dst, sizeof dst, "%s", src)</code>'],
      ['<code>strcat(dst, src)</code>', '追加到 dst 末尾', '需要 <code>strlen(dst)+strlen(src)+1</code> 的空间', '<code>snprintf</code> 或手动检查剩余空间'],
      ['<code>strncpy(dst, src, n)</code>', '最多复制 n 字节', '<b>src 长度 ≥ n 时不补结尾零</b>', '复制后手动写 <code>dst[n-1] = \'\\0\'</code>'],
      ['<code>strncat(dst, src, n)</code>', '最多追加 n 个字符', 'n 是追加量，不是 dst 容量', '先算剩余空间再决定 n'],
      ['<code>snprintf(buf, n, ...)</code>', '格式化并截断', '返回"本应写入"的长度，可能大于 n', '检查返回值判断是否被截断']
    ] },

    { t: 'callout', kind: 'exam', title: 'strncpy 不是"安全版 strcpy"', html:
      '这是最常被误解的一条。<code>strncpy(dst, src, n)</code> 的语义是"最多复制 n 字节"：' +
      '如果 src 短，它会用零把 dst 剩下的部分填满；' +
      '如果 src 长于等于 n，它<b>不会补结尾零</b>，dst 变成一个没有结尾的字符数组。' +
      '所以 <code>strncpy</code> 之后一定要手动补 <code>dst[n-1] = \'\\0\'</code>，' +
      '或者干脆用 <code>snprintf</code>。'
    },

    { t: 'h', text: '六、strcmp 与字符转换', id: 'ch04-6' },

    { t: 'p', html:
      '<code>strcmp(a, b)</code> 按字典序逐字节比较，返回负数、零或正数：' +
      '负数表示 a 在 b 之前，零表示完全相同，正数表示 a 在 b 之后。' +
      '比较是按 <code>unsigned char</code> 的编码值进行的，所以 <code>"Z"</code> 小于 <code>"a"</code>。' +
      '<b>它返回的是整数，不是布尔值，判等必须写 <code>== 0</code></b>。'
    },

    { t: 'code', lang: 'c', caption: 'strcmp.c —— 四种比较结果', code:
`#include <stdio.h>
#include <string.h>

int main(void)
{
    const char *a = "apple";
    const char *b = "banana";
    const char *c = "apple";

    printf("strcmp(a, c) = %d\\n", strcmp(a, c));   /* 0：相同 */
    printf("strcmp(a, b) = %d\\n", strcmp(a, b));   /* 负数：a 在前 */
    printf("strcmp(b, a) = %d\\n", strcmp(b, a));   /* 正数：b 在后 */

    if (strcmp(a, c) == 0) {
        printf("a 与 c 相同\\n");
    }
    if (strcmp(a, b) != 0) {
        printf("a 与 b 不同\\n");
    }

    /* 前缀关系：短的那个更小 */
    printf("strcmp(\\"app\\", \\"apple\\") = %d\\n", strcmp("app", "apple"));
    /* 大小写：大写字母编码更小 */
    printf("strcmp(\\"Z\\", \\"a\\") = %d\\n", strcmp("Z", "a"));

    /* 只比较前 n 个字符 */
    printf("strncmp(\\"apple\\", \\"apricot\\", 2) = %d\\n",
           strncmp("apple", "apricot", 2));
    return 0;
}
` },

    { t: 'code', lang: 'c', caption: 'chars.c —— 分类、大小写与字符数字互转', code:
`#include <stdio.h>
#include <ctype.h>

int main(void)
{
    const char *s = "Hello, C 2026!";
    int letters = 0, digits = 0, spaces = 0;

    for (const char *p = s; *p != '\\0'; p++) {
        /* ctype 函数要求参数是 unsigned char 或 EOF */
        unsigned char ch = (unsigned char)*p;
        if (isalpha(ch))      letters++;
        else if (isdigit(ch)) digits++;
        else if (isspace(ch)) spaces++;
    }
    printf("字母 %d，数字 %d，空白 %d\\n", letters, digits, spaces);

    printf("toupper('a') = %c\\n", toupper('a'));
    printf("tolower('Z') = %c\\n", tolower('Z'));

    /* 字符 → 数值：靠编码连续 */
    char digit = '7';
    printf("'7' -> %d\\n", digit - '0');

    /* 数值 → 字符：0..9 映射到 '0'..'9' */
    int n = 9;
    printf("9 -> '%c'\\n", (char)('0' + n));

    /* 手写大小写转换，理解原理 */
    char lower = 'q';
    printf("'q' 转大写 -> '%c'\\n", (char)(lower - 'a' + 'A'));
    return 0;
}
` },

    { t: 'h', text: '数字与字符串的互转', lvl: 3 },

    { t: 'p', html:
      '<code>atoi</code> 把字符串转成整数，但它<b>没有任何错误检查</b>：' +
      '输入不是数字时返回 0，无法区分"真的是 0"和"解析失败"；' +
      '输入超出范围时行为未定义。严谨的写法是 <code>strtol</code>，它能告诉你解析停在了哪里。' +
      '反方向用 <code>snprintf</code>，永远不要用 <code>sprintf</code>。'
    },

    { t: 'code', lang: 'c', caption: 'numconv.c —— 用 strtol 与 snprintf 做严谨的转换', code:
`#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    /* 字符串 → 整数：atoi 简单但无法报错 */
    int a = atoi("42");
    int bad = atoi("abc");          /* 返回 0，无法与真正的 0 区分 */
    printf("atoi(\\"42\\")  = %d\\n", a);
    printf("atoi(\\"abc\\") = %d（解析失败也返回 0）\\n", bad);

    /* strtol 能看到解析停止的位置 */
    char *end = NULL;
    long v = strtol("123abc", &end, 10);
    printf("strtol = %ld，停在第 %ld 个字符（'%c'）\\n",
           v, (long)(end - "123abc"), *end);

    /* 整数 → 字符串：snprintf 带容量，安全 */
    char buf[16];
    int year = 2026;
    snprintf(buf, sizeof buf, "%d", year);
    printf("数字转字符串：%s\\n", buf);

    /* 浮点数：注意精度 */
    char fbuf[32];
    snprintf(fbuf, sizeof fbuf, "%.2f", 3.14159);
    printf("浮点转字符串：%s\\n", fbuf);
    return 0;
}
` },

    { t: 'table', caption: '字符与数字转换速查', head: ['需求', '写法', '注意'], rows: [
      ['字符 → 数值', '<code>c - \'0\'</code>', '只对 <code>\'0\'</code> 到 <code>\'9\'</code> 有效'],
      ['数值 → 字符', '<code>\'0\' + n</code>', 'n 必须在 0..9'],
      ['小写 → 大写', '<code>c - \'a\' + \'A\'</code> 或 <code>toupper(c)</code>', '先确认 <code>islower(c)</code>'],
      ['字符串 → 整数', '<code>atoi</code> / <code>strtol</code>', '正式代码用 <code>strtol</code> 检查错误'],
      ['整数 → 字符串', '<code>snprintf</code>', '必带容量，<code>sprintf</code> 不安全'],
      ['判断字符类别', '<code>isalpha</code> / <code>isdigit</code> / <code>isspace</code>', '参数先转 <code>unsigned char</code>']
    ] },

    { t: 'callout', kind: 'tip', title: '最小可用模板', html:
      '把字符串复制到自己的缓冲区里，安全写法只有一种模板：' +
      '<code>char buf[N]; snprintf(buf, sizeof buf, "%s", src);</code>。' +
      '它保证以零结尾、不会越界、超长自动截断。' +
      '写完括号里的 <code>sizeof buf</code> 之后，你就再也不用数 <code>strlen</code> 了。' +
      '如果确实需要知道有没有被截断，检查 <code>snprintf</code> 的返回值是否 <code>&gt;= sizeof buf</code>。'
    },

    { t: 'terms', items: [
      { en: 'character encoding', zh: '字符编码', html: '字符到整数的映射规则；C 的基本字符集编码兼容 ASCII。' },
      { en: 'null terminator', zh: '空字符 / 结尾零', html: '值为 0 的字节，写作 <code>\'\\0\'</code>，标记 C 字符串结束。' },
      { en: 'buffer', zh: '缓冲区', html: '一段用于存放数据的连续内存；字符串数组就是字符缓冲区。' },
      { en: 'buffer overflow', zh: '缓冲区溢出', html: '向缓冲区写入超过其容量的数据，会破坏相邻内存，属于未定义行为。' },
      { en: 'lexicographic order', zh: '字典序', html: '逐字节按编码值比较；某串是另一串前缀时，短的更小。' },
      { en: 'undefined behavior', zh: '未定义行为', html: '标准不作任何保证的操作；越界写、读未初始化内存都属于此类。' }
    ] },

    { t: 'keypoint', items: [
      { title: 'char 是最小整数', html: '字符就是编码；<code>char</code> 是否有符号由实现决定，处理字节用 <code>unsigned char</code>。' },
      { title: '字符串是数组加零', html: '<code>char s[] = "hi"</code> 占 3 个字节：<code>h i \\0</code>。' },
      { title: '结尾零不是字符 0', html: '<code>\'\\0\'</code> 是 0，<code>\'0\'</code> 是 48；写错字符串就不会结束。' },
      { title: 'sizeof 与 strlen 不同', html: '前者是容量（含结尾零、指针大小），后者是内容长度（不含结尾零）。' },
      { title: '无界函数必须换掉', html: '<code>strcpy</code>/<code>strcat</code>/<code>sprintf</code> 不检查容量，改用 <code>snprintf</code> 与显式长度检查。' },
      { title: 'strncpy 也要补零', html: '它不保证结尾零，复制后手动写 <code>dst[n-1] = \'\\0\'</code>。' },
      { title: 'strcmp 判等用 == 0', html: '返回值是负数/零/正数，不是布尔值；逐字节按 <code>unsigned char</code> 比较。' }
    ] },

    { t: 'checklist', id: 'ch04', items: [
      '我能说出 <code>\'A\'</code>、<code>\'a\'</code>、<code>\'0\'</code> 三者的编码，并解释 <code>\'a\' - \'A\'</code> 为什么是 32',
      '我能画出 <code>char s[] = "hello"</code> 的 6 个字节，并标出结尾零',
      '我能区分 <code>\'\\0\'</code> 与 <code>\'0\'</code>，并知道写错会导致什么后果',
      '我能手写 <code>strlen</code>，并说清 <code>sizeof</code> 与它的结果为什么不同',
      '我能说出 <code>strcpy</code> 与 <code>strncpy</code> 各自的边界风险',
      '我能把一段用 <code>strcpy</code> 的代码改成 <code>snprintf</code> 的安全版本',
      '我知道 <code>strcmp</code> 判等要写 <code>== 0</code>，并能解释字典序',
      '我能用 <code>strtol</code> 做带错误检查的字符串转数字'
    ] }
  ]
});
