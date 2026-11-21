/* =====================================================================
 * data/ch06.js · 第 06 章：栈与堆
 * 职责：看清进程地址空间的五个区域，理解栈帧的建立与销毁，
 *       掌握 malloc / calloc / realloc / free 的语义与三类典型错误。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch06',
  num: '06',
  title: '栈与堆',
  en: 'Stack & Heap',
  goals: [
    '能画出 text / data / bss / heap / stack 的布局，并说出各自的生命周期',
    '能解释一次函数调用里栈帧压入了什么、返回时发生了什么',
    '能正确使用 malloc / calloc / realloc 并检查失败',
    '能识别并修复内存泄漏、悬垂指针、双重释放',
    '能在堆上分配字符串与二维数组，并按正确顺序释放'
  ],
  kp: [
    { id: 'ch06-1', title: '进程的地址空间' },
    { id: 'ch06-2', title: '栈与栈帧' },
    { id: 'ch06-3', title: 'malloc 与 calloc' },
    { id: 'ch06-4', title: 'realloc 与 free 的规则' },
    { id: 'ch06-5', title: '三类典型错误：泄漏、悬垂、双重释放' },
    { id: 'ch06-6', title: '堆上的字符串与二维数组' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '很多 C 程序崩溃，不是算法错，而是内存用错：该释放的没释放、释放过的还在用、' +
      '要 10 个元素却写了第 11 个。这些错误之所以难查，是因为它们<b>不一定当场发作</b>。' +
      '这一章给出一个能"看见"内存的心智模型：程序一启动，地址空间就被切成几个区域；' +
      '局部变量住栈，动态申请的内存住堆，两者的生命周期规则完全不同。'
    },

    { t: 'p', lead: true, html:
      '一句话概括这一章：<b>栈上的内存由函数调用自动管理，堆上的内存由你手动管理。</b>' +
      '自动的那部分不需要你操心，但不能越界；手动的那部分灵活，但每一次 ' +
      '<code>malloc</code> 都必须有对应的 <code>free</code>。' +
      '把这两条规则记牢，你就已经避开了 C 里大部分最难的 bug。'
    },

    { t: 'h', text: '一、进程的地址空间', id: 'ch06-1' },

    { t: 'p', html:
      '程序运行起来之后，操作系统会分给它一片<b>虚拟地址空间</b>，并按用途切成若干段。' +
      '编译器把不同的东西放进不同的段：代码放 <code>.text</code>，字符串字面量放只读段，' +
      '全局变量放数据段，局部变量放栈，<code>malloc</code> 申请的放堆。' +
      '下面的程序把各类对象的地址打印出来，你就能看到这个分布。'
    },

    { t: 'code', lang: 'c', caption: 'segments.c —— 各类对象分别住在哪一段', code:
`#include <stdio.h>
#include <stdlib.h>

int g_inited = 42;                  // .data：已初始化的全局变量
int g_zero;                         // .bss：未初始化（启动时清零）的全局变量
const char *msg = "hello";          // 指针在 .data，字符串字面量在只读段

int main(void) {
    int local = 1;                            // 栈
    int *heap = malloc(sizeof(int));          // 堆
    if (heap == NULL) return 1;
    *heap = 7;

    printf("全局已初始化  &g_inited @ %p\\n", (void *)&g_inited);
    printf("全局未初始化  &g_zero   @ %p\\n", (void *)&g_zero);
    printf("字符串字面量  msg      @ %p\\n", (void *)msg);
    printf("局部变量      &local   @ %p\\n", (void *)&local);
    printf("堆上内存      heap     @ %p\\n", (void *)heap);

    free(heap);
    return 0;
}
` },

    { t: 'p', html:
      '在常见的 Linux x86-64 机器上，你会看到 <b>栈地址最大，堆次之，全局再小一些</b>。' +
      '但这只是"通常"：具体高低取决于平台、编译器和操作系统。' +
      '真正要记住的不是地址数值，而是每个区域的<b>生命周期规则</b>。'
    },

    { t: 'table', head: ['区段', '放什么', '生命周期', '谁管理'], rows: [
      ['<code>.text</code>', '编译后的机器指令', '整个程序运行期', '操作系统，只读'],
      ['<code>.rodata</code>', '字符串字面量、<code>const</code> 全局量', '整个程序运行期', '操作系统，只读'],
      ['<code>.data</code>', '已初始化的全局 / 静态变量', '程序启动到结束', '编译器'],
      ['<code>.bss</code>', '未初始化的全局 / 静态变量', '程序启动到结束，启动时清零', '编译器'],
      ['<code>heap</code>', '<code>malloc</code> 系列申请的内存', '<code>malloc</code> 到 <code>free</code> 之间', '<b>你</b>'],
      ['<code>stack</code>', '局部变量、参数、返回地址', '所属函数调用期间', '编译器与 CPU 自动']
    ] },

    { t: 'callout', kind: 'note', html:
      '地址值大不代表"内存多"。虚拟地址空间只是一个编号范围，真正用到的物理页由操作系统按需映射。' +
      '另外，栈的大小通常只有几 MB，而堆可以一直申请到内存或地址空间的上限。' +
      '这个差别直接决定了"大数组该放哪里"。'
    },

    { t: 'h', text: '二、栈与栈帧', id: 'ch06-2' },

    { t: 'p', html:
      '每次调用一个函数，CPU 都会在栈上压出一个<b>栈帧</b>（stack frame）：' +
      '返回地址、调用者的帧指针、参数的副本、这个函数的所有局部变量，都住在这里。' +
      '函数返回时，整个栈帧被丢弃——不需要任何清理代码，<code>rsp</code> 一移动，这一帧就没了。' +
      '所以局部变量的生命周期等于"函数这一次调用"。'
    },

    { t: 'code', lang: 'c', caption: 'frame.c —— 局部变量的地址在每次调用中复用', code:
`#include <stdio.h>

void show(const char *tag) {
    int local = 0;
    printf("%-8s &local = %p\\n", tag, (void *)&local);
}

int main(void) {
    int m = 1;
    printf("%-8s &m     = %p\\n", "main", (void *)&m);

    show("第一次");
    show("第二次");

    // 两次调用通常打印同一个地址：上一帧已经随函数返回被丢弃，
    // 新的调用在原位置重新建立了帧。
    return 0;
}
` },

    { t: 'p', html:
      '这个实验说明了一件重要的事：<b>局部变量的地址不能保存到函数返回之后。</b>' +
      '函数一返回，那块栈空间就"自由"了，随时会被下一次调用覆盖。' +
      '所以"返回局部变量的地址"是最典型的悬垂指针来源。'
    },

    { t: 'code', lang: 'c', caption: 'badret.c —— 返回局部变量的地址（错误示范）', code:
`#include <stdio.h>

int *make_pointer(void) {
    int x = 42;
    return &x;              // 错：x 所在的栈帧在函数返回时已经销毁
}

int main(void) {
    int *p = make_pointer();
    // 下面这行是未定义行为：可能打印 42，也可能打印垃圾，还可能崩溃
    printf("%d\\n", *p);
    return 0;
}
` },

    { t: 'callout', kind: 'warn', title: '栈是有限的', html:
      'Linux 上主线程的栈默认只有 8 MB 左右。一个 <code>int[2000000]</code> 就占 8 MB，' +
      '直接放在局部变量里很可能触发<b>栈溢出</b>（Segmentation Fault）。' +
      '大数组、大小在运行时才能确定的结构，都应该放到堆上。' +
      '递归太深也是同一个问题：每一层调用都要一帧。'
    },

    { t: 'table', head: ['维度', '栈', '堆'], rows: [
      ['分配方式', '函数调用时自动压栈', '<code>malloc</code> / <code>calloc</code> / <code>realloc</code>'],
      ['释放方式', '函数返回时自动丢弃', '手动 <code>free</code>，漏了就是泄漏'],
      ['大小', '默认几 MB，超出即崩溃', '受内存与地址空间限制'],
      ['速度', '极快（移动栈指针）', '需要分配器查找空闲块，较慢'],
      ['生命周期', '函数调用期间', '从分配到释放，可跨函数']
    ] },

    { t: 'h', text: '三、malloc 与 calloc', id: 'ch06-3' },

    { t: 'p', html:
      '什么时候必须用堆？三种情况：<b>大小在运行时才知道</b>、<b>数据要活得比函数久</b>、' +
      '<b>结构太大，栈放不下</b>。<code>malloc</code> 的签名是 ' +
      '<code>void *malloc(size_t size)</code>：参数是<b>字节数</b>，返回一个指向新内存的指针，' +
      '失败时返回 <code>NULL</code>，并且<b>不会初始化</b>这块内存。'
    },

    { t: 'code', lang: 'c', caption: 'malloc.c —— 申请、使用、释放的标准三步', code:
`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    size_t n = 10;
    int *a = malloc(n * sizeof(int));       // 申请 n 个 int
    if (a == NULL) {                        // 一定要检查失败
        fprintf(stderr, "内存不够\\n");
        return 1;
    }

    for (size_t i = 0; i < n; i++) {
        a[i] = (int)(i * i);                // 写之前这块内存内容不确定
    }
    for (size_t i = 0; i < n; i++) {
        printf("%d ", a[i]);
    }
    printf("\\n");

    free(a);                                // 用完还给分配器
    return 0;
}
` },

    { t: 'p', html:
      '写 <code>malloc</code> 有一个推荐习惯：用 <code>sizeof *p</code> 而不是再写一遍类型。' +
      '<code>int *a = malloc(n * sizeof *a);</code> 的好处是——将来把 <code>int</code> 改成 ' +
      '<code>long long</code>，这一行不用动。<code>sizeof</code> 的操作数不会被求值，' +
      '所以 <code>sizeof *a</code> 不会因为 a 还没初始化而出错。'
    },

    { t: 'table', head: ['函数', '作用', '是否初始化', '失败时'], rows: [
      ['<code>malloc(size)</code>', '申请 size 个字节', '否，内容是"不确定"的', '返回 <code>NULL</code>'],
      ['<code>calloc(n, size)</code>', '申请 n 个 size 字节的元素', '是，全部字节清零', '返回 <code>NULL</code>'],
      ['<code>realloc(p, size)</code>', '把 p 指向的块调整为 size 字节', '新扩展部分不初始化', '返回 <code>NULL</code>，原块不变'],
      ['<code>free(p)</code>', '释放 p 指向的块', '—', '无返回值；<code>free(NULL)</code> 合法']
    ] },

    { t: 'p', html:
      '<code>calloc</code> 适合"数组要全 0 开始"的场景。它还有一个附带好处：' +
      '<code>calloc(n, size)</code> 把"个数 × 单元大小"分开传，允许实现检查乘法溢出；' +
      '而手写 <code>malloc(n * size)</code> 时，如果 n 和 size 都很大，乘积可能悄悄溢出 ' +
      '<code>size_t</code>，结果申请到一块<b>比预期小得多</b>的内存。'
    },

    { t: 'code', lang: 'c', caption: 'calloc.c —— 清零与不清零的差别', code:
`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    size_t n = 5;
    int *zeroed = calloc(n, sizeof(int));   // 分配 + 全部清零
    int *raw = malloc(n * sizeof(int));     // 只分配，内容不确定
    if (zeroed == NULL || raw == NULL) {
        free(zeroed);                       // free(NULL) 是合法的
        free(raw);
        return 1;
    }

    printf("calloc 首元素 = %d\\n", zeroed[0]);   // 一定是 0

    // raw[0] 不能直接读：未初始化内存的值不确定，读它是未定义行为
    for (size_t i = 0; i < n; i++) {
        raw[i] = (int)i;                    // 先写，再用
    }
    printf("raw 首元素 = %d\\n", raw[0]);

    free(zeroed);
    free(raw);
    return 0;
}
` },

    { t: 'callout', kind: 'warn', html:
      '<b>malloc 返回的内存没有初始化。</b>它不是"0"，也不是"上一次用剩的内容"——' +
      '在 C 的规则里，它就没有值。读未初始化内存是未定义行为，' +
      '可能读出垃圾，也可能被优化成任何东西。凡是要读，先写。'
    },

    { t: 'h', text: '四、realloc 与 free 的规则', id: 'ch06-4' },

    { t: 'p', html:
      '<code>realloc</code> 用来调整一块已分配内存的大小。它的语义比名字看起来复杂：' +
      '它可能<b>原地扩大</b>，也可能<b>搬到一个新地址</b>（把旧内容复制过去再释放旧块），' +
      '还可能<b>失败</b>。失败时它返回 <code>NULL</code>，但<b>原来那块内存仍然有效</b>。' +
      '这个"失败时原块有效"的细节，是 <code>realloc</code> 最常被写错的地方。'
    },

    { t: 'code', lang: 'c', caption: 'grow.c —— realloc 的正确用法', code:
`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    size_t n = 4;
    int *a = malloc(n * sizeof(int));
    if (a == NULL) return 1;
    for (size_t i = 0; i < n; i++) {
        a[i] = (int)i;
    }

    size_t bigger = 8;
    int *tmp = realloc(a, bigger * sizeof(int));   // 先用临时指针接住
    if (tmp == NULL) {
        free(a);                                    // 原来那块仍然有效，别丢
        return 1;
    }
    a = tmp;                                        // 成功后再覆盖

    for (size_t i = n; i < bigger; i++) {
        a[i] = (int)i;                              // 新扩展的区域没有初始化
    }
    for (size_t i = 0; i < bigger; i++) {
        printf("%d ", a[i]);
    }
    printf("\\n");

    free(a);
    return 0;
}
` },

    { t: 'compare', left: {
      title: '直接覆盖（错）', html:
        '<code>p = realloc(p, n);</code> 一旦失败，返回的 <code>NULL</code> 覆盖了 p，' +
        '原来那块内存的地址就永久丢失了——这是<b>教科书级的泄漏</b>，而且紧接着还可能 ' +
        '对 <code>NULL</code> 解引用。'
    }, right: {
      title: '临时指针接住（对）', html:
        '<code>int *tmp = realloc(p, n); if (tmp) p = tmp; else { /* 处理失败 */ }</code> ' +
        '先检查再覆盖，保证失败路径上原块还能被 <code>free</code>。'
    } },

    { t: 'p', html:
      '<code>free</code> 的规则比 <code>malloc</code> 更严格：<b>只能释放 malloc / calloc / realloc 返回的地址</b>，' +
      '而且每块只能释放一次。<code>free(NULL)</code> 是合法的空操作，可以放心写；' +
      '但释放栈上的地址、全局变量的地址、或者数组中间某个元素的地址，都会破坏堆管理器。' +
      '另外，<code>free</code> 只释放内存，<b>不会把指针改掉</b>——它仍然存着那个地址，只是那个地址不再有效。'
    },

    { t: 'p', html:
      '把 <code>realloc</code> 用 <code>p = realloc(p, 0)</code> 当成"释放"是不可靠的写法：' +
      '大小为 0 时行为依赖实现（有的返回 <code>NULL</code>，有的返回一块最小块），' +
      '而返回 <code>NULL</code> 又不能区分"成功释放"还是"失败"。要释放就直说：<code>free(p); p = NULL;</code>。'
    },

    { t: 'h', text: '五、三类典型错误：泄漏、悬垂、双重释放', id: 'ch06-5' },

    { t: 'p', html:
      '堆上的错误可以归成三类，它们的原因、表现和预防方法各不相同。' +
      '把它们放在一起对比，比逐个记忆有用得多。'
    },

    { t: 'p', html:
      '<b>悬垂指针</b>是"用已经还回去的内存"。<code>free(p)</code> 之后 p 里存的地址仍然存在，' +
      '但那块内存已经不属于你；再读写它就是未定义行为。' +
      '<b>双重释放</b>是悬垂指针的特例：同一块内存被 free 两次，堆管理器的内部链表会被破坏，' +
      '轻则崩溃，重则被利用来执行任意代码。' +
      '预防办法很朴素：<b>free 之后立刻把指针置 NULL</b>，并且约定每块内存只有一个"负责人"。'
    },

    { t: 'code', lang: 'c', caption: 'freewrong.c —— 悬垂指针与双重释放（注释掉的是错误写法）', code:
`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    // 1) 悬垂指针：free 之后又用
    int *p = malloc(sizeof(int));
    if (p == NULL) return 1;
    *p = 42;
    free(p);
    // printf("%d\\n", *p);   // 未定义行为：内存已经归还
    p = NULL;                 // 好习惯：立刻置空，防止再次误用

    // 2) 双重释放：两个指针指向同一块
    int *q = malloc(sizeof(int));
    if (q == NULL) return 1;
    int *r = q;               // q 和 r 指向同一块内存
    free(q);
    // free(r);               // 未定义行为：同一块被释放两次
    r = NULL;

    printf("示例结束\\n");
    return 0;
}
` },

    { t: 'table', head: ['错误', '成因', '典型表现', '预防'], rows: [
      ['<b>内存泄漏</b>', '申请后丢失指针，或忘记 <code>free</code>', '程序越跑内存越大，最终被系统杀掉', '谁申请谁释放；错误路径也要释放'],
      ['<b>悬垂指针</b>', '<code>free</code> 后继续使用', '读到垃圾数据，或写坏别的对象', '<code>free</code> 后立刻置 <code>NULL</code>'],
      ['<b>双重释放</b>', '同一块内存被 <code>free</code> 两次', '堆损坏、崩溃、可能被利用', '只让一个指针负责释放'],
      ['<b>释放非堆地址</b>', '对栈变量、全局变量或数组中间元素 <code>free</code>', '立即崩溃或堆损坏', '只 <code>free</code> 动态分配的块首地址']
    ] },

    { t: 'p', html:
      '<b>内存泄漏</b>的典型形态是"指针被覆盖"或"函数提前返回忘了释放"。' +
      '短命的小程序泄漏一点看不出来，但服务器、编辑器、浏览器这种要连续运行几天几十天的程序，' +
      '泄漏会让内存持续上涨，最后被系统强制结束。' +
      '检测泄漏没有捷径：<b>让每一次 malloc 都能在代码里找到对应的 free</b>，' +
      '包括所有错误分支。'
    },

    { t: 'code', lang: 'c', caption: 'leak.c —— 一次调用泄漏 4 KB，一千次就是 4 MB', code:
`#include <stdio.h>
#include <stdlib.h>

static void leak_once(void) {
    int *p = malloc(1024 * sizeof(int));   // 4 KB
    if (p == NULL) return;
    p[0] = 1;
    // 忘记 free(p)：函数返回后，这块内存再也找不回来了
}

int main(void) {
    for (int i = 0; i < 1000; i++) {
        leak_once();
    }
    printf("跑完了，但泄漏了约 %zu KB\\n",
           (size_t)1000 * 1024 * sizeof(int) / 1024);
    return 0;
}
` },

    { t: 'p', html:
      '多资源函数要特别小心：先申请 A，再申请 B；如果 B 失败，A 必须被释放。' +
      '常见做法是统一走一个清理出口（C 里常用 <code>goto cleanup</code>），' +
      '保证每条失败路径都经过同一段释放代码。'
    },

    { t: 'code', lang: 'c', caption: 'cleanup.c —— 错误路径也必须释放', code:
`#include <stdio.h>
#include <stdlib.h>

int process(void) {
    char *a = malloc(100);
    if (a == NULL) return -1;

    char *b = malloc(200);
    if (b == NULL) {
        free(a);              // 错误路径：不能把已经申请到的 a 丢了
        return -1;
    }

    a[0] = 'A';
    b[0] = 'B';
    printf("处理完成：%c%c\\n", a[0], b[0]);

    free(b);                  // 释放顺序与申请顺序相反
    free(a);
    return 0;
}

int main(void) {
    return process() == 0 ? 0 : 1;
}
` },

    { t: 'h', text: '六、堆上的字符串与二维数组', id: 'ch06-6' },

    { t: 'p', html:
      '堆上最常用的两种结构是<b>动态字符串</b>和<b>动态二维数组</b>。' +
      '前者要记得给结尾的 <code>\\0</code> 留一个字节，后者要按"行指针数组 + 每行"两层释放。' +
      '下面这个函数相当于标准库里的 <code>strdup</code>（不在 C 标准里，但几乎所有平台都有）。'
    },

    { t: 'code', lang: 'c', caption: 'dupstr.c —— 在堆上复制一个字符串', code:
`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char *dup_str(const char *s) {
    size_t n = strlen(s) + 1;      // +1 是结尾的 '\\0'
    char *copy = malloc(n);
    if (copy == NULL) return NULL;
    memcpy(copy, s, n);            // 连同 '\\0' 一起复制
    return copy;
}

int main(void) {
    char *s = dup_str("hello, heap");
    if (s == NULL) return 1;
    printf("%s（长度 %zu）\\n", s, strlen(s));
    free(s);                       // 字符串在堆上，必须自己释放
    return 0;
}
` },

    { t: 'p', html:
      '二维数组有两种分配方式。第一种是<b>指针数组</b>：先申请"行指针"，再逐行申请——' +
      '行与行在内存里不一定连续，但 <code>m[r][c]</code> 的写法照常可用。' +
      '第二种是<b>一整块连续内存</b>加手动计算下标 <code>data[r * cols + c]</code>，' +
      '缓存更友好、释放只需一次。这一章先掌握指针数组的写法，因为它把"二级指针"用上了。'
    },

    { t: 'code', lang: 'c', caption: 'matrix.c —— 行指针数组 + 每行一块，释放要反过来', code:
`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    size_t rows = 3, cols = 4;

    int **m = malloc(rows * sizeof(int *));       // 第一步：行指针数组
    if (m == NULL) return 1;

    for (size_t r = 0; r < rows; r++) {
        m[r] = malloc(cols * sizeof(int));        // 第二步：每一行
        if (m[r] == NULL) {
            for (size_t k = 0; k < r; k++) free(m[k]);  // 只释放成功的行
            free(m);
            return 1;
        }
    }

    for (size_t r = 0; r < rows; r++) {
        for (size_t c = 0; c < cols; c++) {
            m[r][c] = (int)(r * cols + c);
        }
    }
    printf("m[2][3] = %d\\n", m[2][3]);

    // 释放顺序与分配顺序相反：先放每一行，再放行指针数组
    for (size_t r = 0; r < rows; r++) free(m[r]);
    free(m);
    return 0;
}
` },

    { t: 'callout', kind: 'tip', title: '怎样抓出这些错误', html:
      '把程序编译成 <code>gcc -fsanitize=address -g prog.c -o prog</code> 再运行，' +
      '<b>AddressSanitizer</b> 会在越界、使用已释放内存、双重释放发生的那一刻直接报错，' +
      '并打印出源码行号。上面 <code>freewrong.c</code> 里注释掉的两行，' +
      '放开任意一行让 ASan 跑一遍，你会看到它比"程序碰巧没崩"可靠得多。' +
      '另外，平时就开 <code>-Wall -Wextra</code>，能提前发现大量可疑写法。'
    },

    { t: 'code', lang: 'c', caption: 'asan.c —— 越界写会被当场抓住', code:
`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *a = malloc(4 * sizeof(int));
    if (a == NULL) return 1;
    for (int i = 0; i < 4; i++) {
        a[i] = i;
    }

    a[4] = 99;      // 越界写：ASan 会在这里直接报错并给出源码行号
    free(a);
    return 0;
}
` },

    { t: 'keypoint', items: [
      { title: '地址空间分区管理', html:
        '代码在 <code>.text</code>，全局在 <code>.data</code> / <code>.bss</code>，局部变量在栈，动态内存在堆。分区决定了生命周期。' },
      { title: '栈帧随调用生灭', html:
        '每次调用压一帧：返回地址、旧帧指针、参数副本、局部变量；返回即销毁，局部变量地址不能带出去。' },
      { title: 'malloc 不初始化', html:
        '<code>malloc(size)</code> 收字节数、返回 <code>void *</code>、失败返回 <code>NULL</code>、内容不确定；读之前先写。' },
      { title: 'realloc 先用临时指针接', html:
        '可能搬家、可能失败；失败时原块仍有效。<code>p = realloc(p, n)</code> 会泄漏，必须先 <code>tmp</code> 再赋值。' },
      { title: 'free 的三条铁律', html:
        '只释放动态分配的块首地址；每块只释放一次；释放后立刻置 <code>NULL</code>。' },
      { title: '谁申请谁释放', html:
        '泄漏来自丢失指针和遗漏的错误路径；多资源函数让所有失败分支走同一个清理出口。' }
    ] },

    { t: 'checklist', id: 'ch06', items: [
      '我能说出 text / data / bss / heap / stack 各放什么、生命周期多长',
      '我能解释局部变量为什么不能返回地址，以及栈溢出是怎么发生的',
      '我能写出 malloc + 检查 NULL + free 的完整流程',
      '我能说清 calloc 与 malloc 的区别，以及 realloc 失败时原块的状态',
      '我能看出双重释放和悬垂指针，并知道它们各自的预防办法',
      '我能写出动态字符串和二维数组的分配与释放，顺序不出错'
    ] }
  ]
});
