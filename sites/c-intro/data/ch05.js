/* =====================================================================
 * data/ch05.js · 第 05 章：指针与数组
 * 职责：建立"地址 + 类型"的指针模型：取地址、解引用、空指针、指针算术、
 *       数组名退化与数组参数、const 指针、二级指针。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch05',
  num: '05',
  title: '指针与数组',
  en: 'Pointers & Arrays',
  goals: [
    '能用 & 取出变量地址、用 * 读写它指向的内存',
    '能解释"指针类型决定解引用宽度和算术步长"',
    '能说出数组名在表达式里如何退化成首元素地址，以及 sizeof 为什么不退化',
    '能写出接收数组参数的函数，并说明为什么必须额外传长度',
    '能区分 const int *p 与 int * const p，并说清各自保护的是什么'
  ],
  kp: [
    { id: 'ch05-1', title: '地址、指针与解引用' },
    { id: 'ch05-2', title: '空指针：合法但不指向任何对象' },
    { id: 'ch05-3', title: '指针算术：以元素为单位' },
    { id: 'ch05-4', title: '数组名、sizeof 与数组参数' },
    { id: 'ch05-5', title: 'const 指针的三种写法' },
    { id: 'ch05-6', title: '二级指针：修改指针本身' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '指针是 C 的分水岭。从这一章起，你看到的不再只是"值"，而是' +
      '<b>值放在内存的哪个位置</b>。后面所有的东西——栈帧、堆、函数指针、' +
      '按引用修改、缓冲区——都建立在"地址 + 类型"这一个模型上。' +
      '反过来说，初学阶段那些"莫名其妙的崩溃"，绝大多数也都能还原成三句话：' +
      '指针没初始化、数组越界、用已经失效的内存。'
    },

    { t: 'p', lead: true, html:
      '先记住一句话：<b>指针是一个存着地址的变量，而地址是内存里某个字节的编号。</b>' +
      '指针的所有行为——解引用、加减、比较——都可以还原成"拿着编号去内存里找东西"。' +
      '这一章要做的，就是把这个动作练到不用想。'
    },

    { t: 'h', text: '一、地址、指针与解引用', id: 'ch05-1' },

    { t: 'p', html:
      '把内存想成一条极长的字节数组，每个字节有一个唯一编号：0、1、2……' +
      '变量的名字只是写给人看的，编译器在背后把它翻译成"从哪个地址开始、占几个字节"。' +
      '所谓"取地址"，就是把这个编号取出来。'
    },

    { t: 'code', lang: 'c', caption: 'address.c —— 每个变量都有自己的门牌号', code:
`#include <stdio.h>

int main(void) {
    int x = 42;
    double y = 3.5;
    char c = 'A';

    // %p 专门打印地址，但它要求参数类型是 void *，所以必须显式转换
    printf("x 的值 = %d，地址 = %p\\n", x, (void *)&x);
    printf("y 的值 = %.1f，地址 = %p\\n", y, (void *)&y);
    printf("c 的值 = %c，地址 = %p\\n", c, (void *)&c);
    printf("本机一个指针 = %zu 字节\\n", sizeof(int *));

    return 0;
}
` },

    { t: 'p', html:
      '<code>&amp;</code> 是取地址运算符，只能作用于<b>有确定位置的对象</b>：' +
      '变量、数组元素、结构体成员。它是有类型的：<code>&amp;x</code> 的类型是 ' +
      '<code>int *</code>，读作"指向 int 的指针"。' +
      '指针本身的宽度和平台有关：64 位机器上通常是 8 字节，能表示 2<sup>64</sup> 个字节编号。'
    },

    { t: 'callout', kind: 'note', html:
      '地址的值每次运行都可能不一样——操作系统会做<b>地址空间随机化</b>（ASLR）。' +
      '所以不要把打印出来的地址当常量，更不要用地址大小做逻辑判断。' +
      '你能依赖的是"同一个对象在一次运行里地址不变"。'
    },

    { t: 'p', html:
      '有了地址，就要能"顺着地址找回去"。存放地址的变量叫<b>指针变量</b>，' +
      '声明写法是 <code>int *p;</code>，读作"p 的类型是 pointer to int"。' +
      '注意：声明里的 <code>*</code> 属于类型的一部分，不是解引用。' +
      '赋值 <code>p = &amp;x;</code> 之后，<code>*p</code> 就成了 <code>x</code> 的别名——' +
      '<code>*p = 100;</code> 会真的改掉 x，因为解引用的结果是一个<b>左值</b>。'
    },

    { t: 'code', lang: 'c', caption: 'pointer.c —— 通过指针间接读写', code:
`#include <stdio.h>

int main(void) {
    int x = 42;
    int *p = &x;              // p 里存的是 x 的地址

    printf("x = %d\\n", x);
    printf("*p = %d\\n", *p);  // 顺着地址取 x 的值

    *p = 100;                 // 通过指针改写 x
    printf("改了之后 x = %d\\n", x);

    printf("p 里存的地址 = %p，&x = %p\\n", (void *)p, (void *)&x);
    printf("p 自己的地址 = %p\\n", (void *)&p);   // 指针本身也是变量

    return 0;
}
` },

    { t: 'p', html:
      '<code>*</code> 在 C 里有两个身份，靠上下文区分：出现在声明里是"指针类型的一部分"，' +
      '出现在表达式里是"解引用运算符"。初学时把这张表抄一遍，能省掉大量混淆。'
    },

    { t: 'table', head: ['写法', '含义', '类型'], rows: [
      ['<code>int x = 1;</code>', '定义一个 int 变量', '<code>int</code>'],
      ['<code>int *p = &amp;x;</code>', 'p 存放 x 的地址', '<code>int *</code>'],
      ['<code>*p</code>', '访问 p 指向的那个 int', '<code>int</code>（左值）'],
      ['<code>&amp;x</code>', 'x 的地址', '<code>int *</code>'],
      ['<code>&amp;p</code>', '指针变量 p 自己的地址', '<code>int **</code>'],
      ['<code>int **pp = &amp;p;</code>', 'pp 存放 p 的地址', '<code>int **</code>']
    ] },

    { t: 'p', html:
      '指针的类型不决定"指针本身多大"（64 位下都是 8 字节），它决定三件事：' +
      '<b>解引用时访问几个字节</b>、<b>加减时走多远</b>、以及<b>解引用结果是什么类型</b>。' +
      '同一个地址，用 <code>int *</code> 读是 4 个字节，用 <code>char *</code> 读只有 1 个字节。'
    },

    { t: 'code', lang: 'c', caption: 'bytes.c —— 用字节视角看一个 int（仅作演示，不要依赖结果顺序）', code:
`#include <stdio.h>

int main(void) {
    int n = 0x41424344;                       // 四个字节，低地址存的是 44 还是 41 取决于端序
    unsigned char *bytes = (unsigned char *)&n;  // 字符指针可以合法地"看"任何对象的字节

    printf("sizeof(int) = %zu\\n", sizeof(int));
    for (int i = 0; i < (int)sizeof n; i++) {
        printf("第 %d 个字节 = 0x%02X\\n", i, bytes[i]);
    }

    // 小端机器从低地址读到 44 43 42 41；大端机器顺序相反
    return 0;
}
` },

    { t: 'callout', kind: 'warn', title: '野指针', html:
      '<code>int *p;</code> 之后直接 <code>*p</code> 是<b>未定义行为</b>：p 里是栈上的残留值，' +
      '可能指向任何地方。声明指针时只有两种选择——立刻用 <code>&amp;x</code> 之类初始化，' +
      '或者明确置 <code>NULL</code>。<b>没有第三种。</b>'
    },

    { t: 'h', text: '二、空指针：合法但不指向任何对象', id: 'ch05-2' },

    { t: 'p', html:
      '<code>NULL</code> 是空指针常量，表示"不指向任何对象"。它定义在 ' +
      '<code>&lt;stddef.h&gt;</code> 里（<code>&lt;stdio.h&gt;</code> 一般会间接包含它）。' +
      '空指针是一个合法值，可以赋值、比较、传参；只是<b>不能解引用</b>。' +
      '所以任何"可能失败"的指针操作，第一件事都是跟 <code>NULL</code> 比较。'
    },

    { t: 'code', lang: 'c', caption: 'null.c —— 用之前先检查', code:
`#include <stdio.h>
#include <stddef.h>

int main(void) {
    int *p = NULL;             // 明确的"不指向任何东西"

    if (p != NULL) {
        printf("%d\\n", *p);    // 不会执行
    } else {
        printf("p 是空指针，不能解引用\\n");
    }

    int x = 7;
    p = &x;                    // 从"不指向"变成"指向 x"
    printf("现在 *p = %d\\n", *p);

    return 0;
}
` },

    { t: 'p', html:
      '解引用空指针通常会触发段错误（Segmentation Fault）——这其实是<b>最好的结果</b>，' +
      '因为程序立刻停下，问题暴露得清清楚楚。真正危险的是指针里存的地址"碰巧可写"：' +
      '程序继续跑，数据已经被悄悄改坏，等到十分钟后才在别处崩溃。'
    },

    { t: 'callout', kind: 'warn', html:
      '凡是返回指针的函数，一定要在文档里约定"失败时返回什么"。' +
      '本课的约定与 C 库一致：<b>失败返回 NULL</b>。调用方不检查，就等于主动放弃所有错误处理。'
    },

    { t: 'h', text: '三、指针算术：以元素为单位', id: 'ch05-3' },

    { t: 'p', html:
      '指针能加减，但它的单位不是字节，而是<b>元素</b>。规则只有一句：' +
      '<code>p + 1</code> 表示"下一个同类型元素"，实际地址前进 <code>sizeof(*p)</code> 个字节。' +
      '这就是为什么 <code>int *</code> 加一次走 4 字节，<code>double *</code> 加一次走 8 字节。'
    },

    { t: 'code', lang: 'c', caption: 'arithmetic.c —— 指针算术与指针相减', code:
`#include <stdio.h>

int main(void) {
    int a[5] = {10, 20, 30, 40, 50};
    int *p = a;                // 数组名退化成 &a[0]

    printf("*p       = %d\\n", *p);
    printf("*(p + 1) = %d\\n", *(p + 1));   // p + 1 前进 sizeof(int) 字节

    // 两个地址的差，单位是"元素个数"，不是字节数
    printf("p + 2 - p = %td\\n", (p + 2) - p);

    p += 3;                    // 指向 a[3]
    printf("*p = %d\\n", *p);
    printf("p - a = %td（说明 p 是第几个元素）\\n", p - a);

    return 0;
}
` },

    { t: 'table', head: ['运算', '含义', '合法前提'], rows: [
      ['<code>p + n</code> / <code>p - n</code>', '地址移动 n 个元素', '结果落在同一数组内（含末尾后一个位置）'],
      ['<code>p2 - p1</code>', '两指针之间的元素个数，类型 <code>ptrdiff_t</code>', '两者指向同一数组'],
      ['<code>p++</code> / <code>++p</code>', '指针前进一个元素（配合 <code>*</code> 时取值顺序不同）', '移动后有定义'],
      ['<code>p1 &lt; p2</code>', '比较地址先后', '同一数组'],
      ['<code>p == NULL</code>', '判断是否空指针', '任何指针']
    ] },

    { t: 'callout', kind: 'warn', title: '只有"同一个数组之内"才有定义', html:
      '把两个无关变量的地址相减，或者让指针走到数组末尾之外再使用，都是<b>未定义行为</b>。' +
      '编译器不会拦你，运行时可能"看起来正常"，但这不代表代码是对的。' +
      'C 的规则是：数组允许有一个"末尾后一个位置"的指针用于比较，但不允许解引用它。'
    },

    { t: 'h', text: '四、数组名、sizeof 与数组参数', id: 'ch05-4' },

    { t: 'p', html:
      '在绝大多数表达式里，数组名会<b>退化</b>成指向首元素的指针：' +
      '<code>a</code> 等价于 <code>&amp;a[0]</code>，类型是 <code>int *</code>。' +
      '于是 <code>a[i]</code>、<code>*(a + i)</code>、<code>*(i + a)</code> 是三种完全等价的写法。' +
      '这就是"下标访问本质是指针算术"的含义。'
    },

    { t: 'code', lang: 'c', caption: 'array.c —— 数组名退化，但 sizeof 与 & 不退化', code:
`#include <stdio.h>

int main(void) {
    int a[5] = {10, 20, 30, 40, 50};

    // 三种写法等价
    printf("%d %d %d\\n", a[2], *(a + 2), *(2 + a));

    // 表达式里的 a 就是 &a[0]
    printf("a = %p，&a[0] = %p\\n", (void *)a, (void *)&a[0]);

    // sizeof 是例外：它看到的是整个数组
    printf("sizeof(a) = %zu，sizeof(&a[0]) = %zu\\n", sizeof a, sizeof(&a[0]));

    // &a 的类型是 int (*)[5]，+1 直接跨过整个数组
    printf("a + 1 = %p，&a + 1 = %p\\n", (void *)(a + 1), (void *)(&a + 1));

    return 0;
}
` },

    { t: 'p', html:
      '两个例外要记住：<code>sizeof</code> 和 <code>&amp;</code> 作用于数组名时不退化。' +
      '<code>sizeof a</code> 是整个数组的字节数（5 × 4 = 20），' +
      '<code>&amp;a</code> 的类型是 <code>int (*)[5]</code>，所以 <code>&amp;a + 1</code> 会跨过 20 个字节，' +
      '而 <code>a + 1</code> 只跨过 4 个字节。'
    },

    { t: 'p', html:
      '数组作为函数参数时，退化成指针是<b>强制的</b>，所以函数根本收不到"数组长度"这个信息。' +
      '<code>void f(int a[], int n)</code> 和 <code>void f(int *a, int n)</code> 在编译器眼里是同一个函数。' +
      '这也是 C 的标准做法：<b>数组 + 长度，两个参数一起传</b>。'
    },

    { t: 'code', lang: 'c', caption: 'sum.c —— 接收数组与长度，函数内可以修改原数组', code:
`#include <stdio.h>

// 下面两种写法等价；推荐用指针写法，一眼看出它收的是地址
long sum(const int *a, int n) {
    long total = 0;
    for (int i = 0; i < n; i++) {
        total += a[i];
    }
    return total;
}

void fill_zero(int *a, int n) {
    for (int i = 0; i < n; i++) {
        a[i] = 0;
    }
}

int main(void) {
    int data[5] = {1, 2, 3, 4, 5};

    printf("sum = %ld\\n", sum(data, 5));
    fill_zero(data, 5);
    printf("data[0] = %d\\n", data[0]);   // 传的是地址，所以能改原数组

    return 0;
}
` },

    { t: 'compare', left: {
      title: '在函数里算长度（错）', html:
        '函数参数 <code>int a[]</code> 实际是 <code>int *a</code>，' +
        '<code>sizeof(a)</code> 只有 8，除以 <code>sizeof(int)</code> 得到 2，' +
        '而不是真实长度 5。<b>这个 bug 不会报错，只会算错。</b>'
    }, right: {
      title: '长度由调用方传入（对）', html:
        '把 <code>n</code> 作为独立参数传进来，循环条件用 <code>i &lt; n</code>；' +
        '约定"容量"与"当前元素个数"分开记录。这是 C 里唯一可靠的数组长度传递方式。'
    } },

    { t: 'callout', kind: 'tip', html:
      '<code>sizeof a / sizeof a[0]</code> 只在数组还"活着"的那个作用域里可靠。' +
      '一旦数组名作为实参传进函数，这个技巧立刻失效。一个实用原则：' +
      '<b>凡是接收数组的函数，参数表里必须有长度；凡是看到没有长度的数组参数，就要怀疑调用方怎么知道边界。</b>'
    },

    { t: 'p', html:
      '用指针遍历数组时，最常见的写法是 <code>*p++</code>：先解引用取当前值，再让指针前进一格。' +
      '因为后缀 <code>++</code> 的优先级高于 <code>*</code>，<code>*p++</code> 等价于 <code>*(p++)</code>，' +
      '<b>不是</b> <code>(*p)++</code>。这组写法是面试和实际代码里都高频的陷阱。'
    },

    { t: 'code', lang: 'c', caption: 'pplus.c —— 四种写法，四种效果', code:
`#include <stdio.h>

int main(void) {
    int a[4] = {1, 2, 3, 4};
    int *p = a;

    printf("*p++   = %d\\n", *p++);   // 先取 1，p 再前进：等价 *(p++)
    printf("*p     = %d\\n", *p);     // 现在是 2

    printf("(*p)++ 后：");
    printf("%d ", (*p)++);           // 把 p 指向的值加 1（后缀），打印 2
    printf("p 仍指向 %d\\n", *p);      // 同一个位置，值变成 3

    printf("++*p   = %d\\n", ++*p);   // 先加 1 再取，等价 ++(*p)

    return 0;
}
` },

    { t: 'table', head: ['写法', '等价于', '动作'], rows: [
      ['<code>*p++</code>', '<code>*(p++)</code>', '取 <code>*p</code>，然后 p 前进一格'],
      ['<code>(*p)++</code>', '—', '把 p 指向的值加 1，p 不动'],
      ['<code>*++p</code>', '<code>*(++p)</code>', 'p 先前进一格，再取新位置的值'],
      ['<code>++*p</code>', '<code>++(*p)</code>', '把 p 指向的值加 1']
    ] },

    { t: 'h', text: '五、const 指针的三种写法', id: 'ch05-5' },

    { t: 'p', html:
      '<code>const</code> 修饰谁，谁就不能改。读声明的实用办法是<b>从变量名往外读</b>：' +
      '<code>const int *p</code> 先看 p 是"指向 int 的指针"，再看 int 前面有 const，' +
      '所以是"指向 const int 的指针"——指针能换目标，但不能通过它改目标的值。' +
      '<code>int * const p</code> 则是"const 指针，指向 int"——指针本身是常量，但能改目标的值。'
    },

    { t: 'code', lang: 'c', caption: 'constptr.c —— 三种 const 位置', code:
`#include <stdio.h>

int main(void) {
    int x = 1, y = 2;

    const int *p1 = &x;         // 指向"只读 int"的指针：p1 可换目标，*p1 不能改
    int * const p2 = &x;        // 只读指针：p2 不能换目标，*p2 可以改
    const int * const p3 = &x;  // 两个都不能改

    p1 = &y;                    // 合法
    *p2 = 10;                   // 合法：改的是 x
    printf("%d %d %d\\n", x, *p1, *p3);

    // *p1 = 5;                 // 编译错误：assignment of read-only location
    // p2 = &y;                 // 编译错误：assignment of read-only variable
    // *p3 = 5;                 // 编译错误
    return 0;
}
` },

    { t: 'table', head: ['声明', '能改指向？', '能通过它改值？', '典型用途'], rows: [
      ['<code>const int *p</code>', '能', '不能', '只读参数，如 <code>const char *s</code>'],
      ['<code>int * const p</code>', '不能', '能', '固定指向某个对象的句柄'],
      ['<code>const int * const p</code>', '不能', '不能', '完全只读的引用'],
      ['<code>int const *p</code>', '能', '不能', '与第一种完全相同']
    ] },

    { t: 'callout', kind: 'tip', html:
      '函数参数写成 <code>const char *s</code>，意思是"我只读你的数据，不会改"。' +
      '这是 C 里最重要的接口约定：它既表达了意图，也让调用方可以安全地传字符串字面量进来。' +
      '第 04 章的 <code>strlen</code>、<code>strcmp</code> 用的就是这种签名。'
    },

    { t: 'h', text: '六、二级指针：修改指针本身', id: 'ch05-6' },

    { t: 'p', html:
      '指针本身也是变量，也有地址，所以可以有"指向指针的指针"。' +
      '它最常见的用途只有一个：<b>当函数需要修改调用者的指针时</b>。' +
      '因为 C 只有值传递，想改动调用方的一个变量，就必须把它的地址传进去；' +
      '要改的是"指针变量"，那就得传"指针的地址"——也就是二级指针。'
    },

    { t: 'code', lang: 'c', caption: 'dblptr.c —— 通过二级指针让调用者的指针改指向', code:
`#include <stdio.h>

// 让 *pp 指向 first：必须接收 int **，否则改的只是函数里的副本
void point_to(int **pp, int *target) {
    *pp = target;
}

int main(void) {
    int a = 1, b = 2;
    int *p = &a;
    int **pp = &p;              // pp 存 p 的地址

    printf("*p = %d\\n", *p);   // 1
    **pp = 100;                 // 两次解引用，等价于 a = 100
    printf("a = %d\\n", a);

    point_to(&p, &b);           // 把 p 的地址交出去
    printf("*p = %d\\n", *p);   // 2，p 已经改指向 b

    return 0;
}
` },

    { t: 'p', html:
      '第二个常见场景是<b>指针数组</b>。命令行参数 <code>char *argv[]</code> 是"字符串指针的数组"，' +
      '作为参数传进函数时退化成 <code>char **</code>：它指向第一个元素，而每个元素又是一个 ' +
      '<code>char *</code>。理解这一点，<code>argv[i]</code> 与 <code>*(argv + i)</code> 就统一了。'
    },

    { t: 'code', lang: 'c', caption: 'argv.c —— char ** 就是"字符串数组"', code:
`#include <stdio.h>

int main(int argc, char **argv) {
    printf("一共 %d 个命令行参数\\n", argc);

    for (int i = 0; i < argc; i++) {
        printf("argv[%d] = %s\\n", i, argv[i]);
    }

    // argv 的类型是 char **：
    // argv      -> 指向 argv[0]（类型 char *）
    // argv[i]   -> 指向第 i 个字符串（类型 char *）
    // *argv[i]  -> 第 i 个字符串的第一个字符（类型 char）
    return 0;
}
` },

    { t: 'callout', kind: 'tip', title: '读复杂声明', html:
      '从变量名开始，先看右边（<code>[]</code>、<code>()</code>），再看左边（<code>*</code>、类型），一层层往外读。' +
      '例如 <code>int *(*f)(int *)</code>：f 是一个指针，指向"接收 <code>int *</code>、返回 <code>int *</code>"的函数。' +
      '这个技巧在第 07 章的函数指针里会反复用到。'
    },

    { t: 'keypoint', items: [
      { title: '指针 = 地址 + 类型', html:
        '地址决定指向哪里，类型决定解引用读几个字节、算术走多远、结果是什么类型。' },
      { title: '& 与 * 是一对', html:
        '<code>&amp;</code> 取地址得到指针，<code>*</code> 解引用访问目标；解引用结果通常是左值，可以直接赋值。' },
      { title: '空指针要检查', html:
        '未初始化指针与 <code>NULL</code> 都不能解引用；返回指针的函数必须约定失败时返回 <code>NULL</code>。' },
      { title: '指针算术以元素为单位', html:
        '<code>p + 1</code> 前进 <code>sizeof(*p)</code> 字节；只有同一数组（含末尾后一位）内的运算才有定义。' },
      { title: '数组名会退化', html:
        '表达式里 <code>a</code> 等价 <code>&amp;a[0]</code>；<code>sizeof</code> 与 <code>&amp;</code> 是例外；<code>int a[]</code> 参数就是 <code>int *</code>，长度必须另传。' },
      { title: 'const 看位置', html:
        '<code>const</code> 在 <code>*</code> 左边管"值"，在 <code>*</code> 右边管"指针本身"；只读参数一律写成 <code>const T *</code>。' }
    ] },

    { t: 'checklist', id: 'ch05', items: [
      '我能用 & 打印一个变量的地址，并解释 %p 为什么要求 void *',
      '我能用指针间接修改另一个函数里的变量',
      '我能说出 int * 与 char * 在同一个地址上解引用的区别',
      '我能解释 p + 1 为什么不是加 1 个字节，并说清它的合法范围',
      '我能写出接收数组和长度两个参数的函数，并说明为什么必须传长度',
      '我能区分 const int *p 与 int * const p，并说出各自的用途',
      '我能用二级指针让调用者的指针改指向，并说清为什么一级指针不够'
    ] }
  ]
});
