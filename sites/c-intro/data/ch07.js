/* =====================================================================
 * data/ch07.js · 第 07 章：泛型与函数指针
 * 职责：用 void * 与函数指针写出"不依赖具体类型"的代码：
 *       通用交换、按字节复制、通用查找、比较函数、qsort、回调与函数指针表。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch07',
  num: '07',
  title: '泛型与函数指针',
  en: 'Generics & Function Pointers',
  goals: [
    '能说清 void * 能做什么、不能做什么，以及为什么它需要"元素大小"配合',
    '能实现接收任意类型元素的通用 swap 与通用查找',
    '能正确声明、赋值、调用函数指针，并读懂复杂的函数指针声明',
    '能写出符合三值约定的比较函数，并用 qsort 对数组与结构体排序',
    '能用函数指针表替代长 if/else 链，并说明回调模式的用途'
  ],
  kp: [
    { id: 'ch07-1', title: '从"每种类型写一遍"到泛型' },
    { id: 'ch07-2', title: 'void *：只装地址，不带类型' },
    { id: 'ch07-3', title: '通用 swap 与按字节复制' },
    { id: 'ch07-4', title: '函数指针：把函数当参数' },
    { id: 'ch07-5', title: '回调与通用查找' },
    { id: 'ch07-6', title: 'qsort、比较函数与函数指针表' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '如果你写过"给 int 写一遍、给 double 再写一遍、给字符串再抄一遍"的代码，' +
      '你就摸到了 C 泛型问题的入口：<b>同一套逻辑，只是类型不同，却不得不复制多份</b>。' +
      '复制出来的代码一旦要改，就有 N 个地方要同步改，迟早漏掉一个。' +
      '这一章学两种把"类型"和"操作"参数化的技术，它们也是标准库 ' +
      '<code>qsort</code>、<code>pthread_create</code> 这些接口的设计基础。'
    },

    { t: 'p', lead: true, html:
      'C 没有模板，也没有重载，所以泛型只能靠两条手工路线实现：' +
      '用 <b><code>void *</code> 把类型擦掉</b>，再用"元素大小"补回来；' +
      '用<b>函数指针</b>把"具体做什么"变成参数传进来。' +
      '前者解决"数据是什么类型"，后者解决"操作是什么行为"。'
    },

    { t: 'h', text: '一、从"每种类型写一遍"到泛型', id: 'ch07-1' },

    { t: 'p', html:
      '先看一个真实的小痛点：写一个"取较大值"的函数。C 里没有重载，' +
      '于是 int、double、字符串各要写一遍，它们的逻辑几乎一模一样。'
    },

    { t: 'code', lang: 'c', caption: 'max3.c —— 同一件事写了三遍', code:
`#include <stdio.h>
#include <string.h>

int max_int(int a, int b) {
    return a > b ? a : b;
}

double max_double(double a, double b) {
    return a > b ? a : b;
}

const char *max_str(const char *a, const char *b) {
    return strcmp(a, b) >= 0 ? a : b;
}

int main(void) {
    printf("%d\\n", max_int(3, 5));
    printf("%.1f\\n", max_double(2.5, 1.0));
    printf("%s\\n", max_str("apple", "banana"));
    return 0;
}
` },

    { t: 'p', html:
      '三份代码的差别只有两处：<b>比较的方式</b>不同，<b>元素的大小</b>不同。' +
      '如果能把这"两处差异"变成参数，就能只写一遍。这正是泛型的本质：' +
      '把类型信息从代码里抽出来，变成运行时的数据。' +
      'C 的做法不是语言级的模板，而是<b>把元素大小和比较函数当参数传进去</b>。' +
      '代价是：编译器不再替你检查类型，正确性变成你的责任。'
    },

    { t: 'callout', kind: 'note', html:
      'C11 还引入了 <code>_Generic</code>，可以按表达式的类型在编译期选择不同实现，' +
      '适合写少量小函数（比如打印不同类型的值）。但它不擅长表达"循环处理一段任意长度的数据"这类逻辑，' +
      '所以真正通用的算法仍然用 <code>void *</code> + 函数指针实现，标准库的 <code>qsort</code> 就是范例。'
    },

    { t: 'h', text: '二、void *：只装地址，不带类型', id: 'ch07-2' },

    { t: 'p', html:
      '<code>void *</code> 是"通用对象指针"：任何对象指针都能<b>隐式</b>转成 <code>void *</code>，' +
      '反过来从 <code>void *</code> 转回具体类型指针时需要显式强转。' +
      '它携带的只有地址，没有"指向什么类型"的信息，因此编译器也就无法替你检查解引用是否合理。'
    },

    { t: 'code', lang: 'c', caption: 'voidptr.c —— 能装任何地址，但用之前必须转回去', code:
`#include <stdio.h>

int main(void) {
    int x = 42;
    double d = 3.5;
    void *p;

    p = &x;                             // int * → void *，隐式转换
    printf("x = %d\\n", *(int *)p);      // 用之前必须转回具体类型

    p = &d;
    printf("d = %.1f\\n", *(double *)p);

    // *p = 1;                          // 错误：void 没有大小，不能解引用
    // p = p + 1;                       // 错误：标准 C 不允许 void * 做算术
    return 0;
}
` },

    { t: 'table', head: ['操作', 'void * 能做吗', '说明'], rows: [
      ['接收任意对象指针', '能', '任何 <code>T *</code> 都能隐式转成 <code>void *</code>'],
      ['存进结构体 / 传参', '能', '这是"擦除类型"的基础'],
      ['解引用 <code>*p</code>', '不能', '<code>void</code> 没有大小，不知道读几个字节'],
      ['指针算术 <code>p + 1</code>', '不能（标准 C）', '不知道步长；部分编译器把它当 <code>char *</code> 处理，属扩展'],
      ['与 <code>NULL</code> 比较', '能', '空指针判断照常'],
      ['转回具体类型', '能，但要强转', '转错类型就是未定义行为，编译器不会拦']
    ] },

    { t: 'callout', kind: 'warn', html:
      '<code>void *</code> 换来了通用性，代价是<b>类型安全</b>。' +
      '把 <code>int</code> 的地址转成 <code>double *</code> 再解引用，编译器不会报错，' +
      '但读到的是完全错误的位模式，而且可能因为对齐要求直接崩溃。' +
      '所以泛型接口的文档必须写清楚"这个 <code>void *</code> 期望你传什么类型的指针"。'
    },

    { t: 'h', text: '三、通用 swap 与按字节复制', id: 'ch07-3' },

    { t: 'p', html:
      '先解决"交换两个值"。普通写法只能交换一种类型；要做成通用的，就必须知道' +
      '<b>一个元素占几个字节</b>，然后逐字节交换。' +
      '标准保证 <code>unsigned char *</code> 可以合法地"看"任何对象的每一个字节，' +
      '所以它是实现字节级操作的唯一正确指针类型。'
    },

    { t: 'code', lang: 'c', caption: 'swap.c —— 接收任意类型：地址 + 字节数', code:
`#include <stdio.h>

void swap_bytes(void *a, void *b, size_t size) {
    unsigned char *pa = a;
    unsigned char *pb = b;

    for (size_t i = 0; i < size; i++) {
        unsigned char t = pa[i];
        pa[i] = pb[i];
        pb[i] = t;
    }
}

int main(void) {
    int x = 1, y = 2;
    swap_bytes(&x, &y, sizeof x);
    printf("int    : %d %d\\n", x, y);

    double d1 = 1.5, d2 = 2.5;
    swap_bytes(&d1, &d2, sizeof d1);
    printf("double : %.1f %.1f\\n", d1, d2);

    char s1[] = "abc", s2[] = "xyz";
    swap_bytes(s1, s2, sizeof s1);     // 连结尾的 '\\0' 一起换
    printf("string : %s %s\\n", s1, s2);

    return 0;
}
` },

    { t: 'p', html:
      '按字节搬东西是 C 里极其常见的底层操作，标准库把它封装成了几个函数。' +
      '它们的参数都是 <code>void *</code> + 字节数，因此可以用于任何类型。' +
      '但每个函数都有必须记住的约束，尤其是 <code>memcpy</code> 的"不能重叠"。'
    },

    { t: 'table', head: ['函数', '作用', '关键约束'], rows: [
      ['<code>memcpy(dst, src, n)</code>', '复制 n 个字节', '<b>源与目标不能重叠</b>，否则未定义行为'],
      ['<code>memmove(dst, src, n)</code>', '复制 n 个字节，允许重叠', '比 <code>memcpy</code> 略慢，重叠时用它'],
      ['<code>memset(p, c, n)</code>', '把 n 个<b>字节</b>都设为 c', '<b>按字节</b>填充；<code>memset(a, 1, n)</code> 不等于把 int 设成 1'],
      ['<code>memcmp(a, b, n)</code>', '按字节比较', '返回负/零/正，不是"差多少"']
    ] },

    { t: 'code', lang: 'c', caption: 'memops.c —— memcpy / memmove / memset 的边界', code:
`#include <stdio.h>
#include <string.h>

int main(void) {
    char buf[32];

    strcpy(buf, "abcdef");
    memcpy(buf + 6, "XYZ", 4);         // 复制 'X' 'Y' 'Z' '\\0'
    printf("memcpy  ：%s\\n", buf);      // abcdefXYZ

    strcpy(buf, "abcdef");
    memmove(buf + 2, buf, 4);          // 源和目标重叠，memmove 会选对方向
    printf("memmove ：%s\\n", buf);      // ababcd

    char block[8];
    memset(block, 'A', sizeof block - 1);   // 按字节填 'A'
    block[7] = '\\0';
    printf("memset  ：%s\\n", block);

    return 0;
}
` },

    { t: 'callout', kind: 'warn', title: '两个高频坑', html:
      '<b>1.</b> <code>memcpy</code> 遇到重叠区域是未定义行为，想"自己搬到自己身上"就用 <code>memmove</code>。' +
      '<b>2.</b> <code>memset</code> 按字节填。对 <code>int</code> 数组写 ' +
      '<code>memset(a, 1, n * sizeof(int))</code>，得到的是每个字节都是 0x01，' +
      '也就是每个 int 等于 <code>0x01010101</code>，而不是 1。清 0 可以用它，设其它值要用循环。'
    },

    { t: 'p', html:
      '有了"地址 + 大小"，结构体也能直接交换：<code>swap_bytes(&s1, &s2, sizeof s1)</code>。' +
      '这也是为什么泛型函数的参数表里，<b>元素大小</b>几乎总是和 <code>void *</code> 成对出现——' +
      '类型被擦掉了，大小就是唯一还知道"一个元素有多宽"的信息。'
    },

    { t: 'h', text: '四、函数指针：把函数当参数', id: 'ch07-4' },

    { t: 'p', html:
      '第二个要参数化的东西是"操作"。如果能把一个函数本身当成值传给另一个函数，' +
      '那么"遍历时做什么"就能在调用时才决定。函数在 C 里不是一等对象，' +
      '但<b>函数的入口地址</b>可以当值用，这就是函数指针。' +
      '函数名在大多数表达式里会自动转换成"指向该函数的指针"（除了 <code>&amp;</code> 之外，' +
      '写 <code>&amp;foo</code> 与 <code>foo</code> 等价）。'
    },

    { t: 'code', lang: 'c', caption: 'fp.c —— 声明、赋值、调用、函数指针数组', code:
`#include <stdio.h>

static int add(int a, int b) { return a + b; }
static int sub(int a, int b) { return a - b; }
static int mul(int a, int b) { return a * b; }

int main(void) {
    // 读法：op 是一个指针，指向"接收两个 int、返回 int"的函数
    int (*op)(int, int) = add;

    printf("op(3, 4)   = %d\\n", op(3, 4));
    printf("(*op)(3, 4) = %d\\n", (*op)(3, 4));   // 两种调用写法等价

    op = sub;
    printf("sub        = %d\\n", op(10, 4));

    // 函数指针数组：适合"按编号/名字分派"
    int (*table[3])(int, int) = { add, sub, mul };
    for (int i = 0; i < 3; i++) {
        printf("table[%d](10, 5) = %d\\n", i, table[i](10, 5));
    }
    return 0;
}
` },

    { t: 'p', html:
      '函数指针的声明语法是 C 里最容易被误读的地方，区别全在括号：' +
      '<code>int *f(int)</code> 是"返回 <code>int *</code> 的函数"，' +
      '<code>int (*f)(int)</code> 才是"指向函数的指针"。' +
      '记不住时就用 <code>typedef</code> 起别名，可读性立刻好转。'
    },

    { t: 'table', head: ['声明', '含义'], rows: [
      ['<code>int (*f)(int)</code>', '指向"int → int"函数的指针'],
      ['<code>int *f(int)</code>', '返回 <code>int *</code> 的函数'],
      ['<code>int (*f[3])(int)</code>', '含 3 个函数指针的数组'],
      ['<code>void (*f)(void *)</code>', '指向"void * → void"函数的指针，线程入口就是这种'],
      ['<code>typedef int (*binop)(int, int);</code>', '给上面的类型起别名，之后写 <code>binop f</code>']
    ] },

    { t: 'callout', kind: 'tip', html:
      '一旦出现 <code>(*f)</code>，就说明 f 是"指针"；<code>(*f)(...)</code> 是函数指针，' +
      '<code>(*f)[...]</code> 是数组指针。看到 <code>*</code> 先找它有没有被括号包起来，' +
      '这是区分"返回指针的函数"和"函数指针"最快的办法。'
    },

    { t: 'h', text: '五、回调与通用查找', id: 'ch07-5' },

    { t: 'p', html:
      '把函数指针当参数传进去，被调用的那一方在需要的时候"回头调用"它，这种机制叫<b>回调</b>。' +
      '有了"元素大小 + 比较函数"，就能写一个完全不认识具体类型的线性查找：' +
      '它只知道怎么按字节移动、怎么调用比较函数判断相等。'
    },

    { t: 'code', lang: 'c', caption: 'find.c —— 通用线性查找：大小 + 比较函数', code:
`#include <stdio.h>
#include <stddef.h>

// 三值约定：a < b 返回负数，a == b 返回 0，a > b 返回正数
int cmp_int(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y);        // 避免 x - y 溢出
}

void *find_item(const void *base, size_t n, size_t size,
                const void *key,
                int (*cmp)(const void *, const void *)) {
    const unsigned char *p = base;
    for (size_t i = 0; i < n; i++) {
        const void *item = p + i * size;      // 按字节移动：这就是 size 的用途
        if (cmp(item, key) == 0) {
            return (void *)item;
        }
    }
    return NULL;
}

int main(void) {
    int a[5] = {11, 22, 33, 44, 55};
    int key = 33;

    int *hit = find_item(a, 5, sizeof(int), &key, cmp_int);
    if (hit != NULL) {
        printf("找到 %d，下标 %td\\n", *hit, hit - a);
    } else {
        printf("没找到\\n");
    }
    return 0;
}
` },

    { t: 'p', html:
      '比较函数为什么返回 <code>(x &gt; y) - (x &lt; y)</code>，而不是直接 <code>x - y</code>？' +
      '因为 <code>int</code> 相减可能溢出（比如 <code>INT_MAX - (-1)</code>），而有符号溢出是未定义行为。' +
      '泛型代码里最容易被忽略的细节，往往就是这种"看起来能跑"的写法。' +
      '约定只关心结果的<b>符号</b>，不关心具体数值。'
    },

    { t: 'p', html:
      '回调的另一个常见需求是"带上下文"：同一个处理函数，每次调用要访问不同的状态。' +
      'C 的做法是再传一个 <code>void *ctx</code>，由回调自己强转回需要的类型。' +
      '这相当于手工实现了"闭包"要携带的环境。'
    },

    { t: 'code', lang: 'c', caption: 'foreach.c —— 回调 + 上下文指针', code:
`#include <stdio.h>

typedef void (*visit_fn)(int value, void *ctx);

void for_each(const int *a, size_t n, visit_fn visit, void *ctx) {
    for (size_t i = 0; i < n; i++) {
        visit(a[i], ctx);              // 被调用的函数由调用方决定
    }
}

static void print_one(int value, void *ctx) {
    (void)ctx;                         // 这个回调不关心上下文
    printf("%d ", value);
}

static void sum_one(int value, void *ctx) {
    int *total = ctx;                  // 把 void * 还原成具体类型
    *total += value;
}

int main(void) {
    int a[4] = {1, 2, 3, 4};
    int total = 0;

    for_each(a, 4, print_one, NULL);
    printf("\\n");
    for_each(a, 4, sum_one, &total);
    printf("total = %d\\n", total);
    return 0;
}
` },

    { t: 'callout', kind: 'tip', html:
      '<code>void *ctx</code> 是 C 里最实用的设计模式之一：既保持 callback 类型统一，' +
      '又允许每个调用方携带自己的数据。你在第 09 章会看到 <code>pthread_create</code> 的' +
      '线程入口 <code>void *(*)(void *)</code> 用的是同一个思路：参数和返回值都是 <code>void *</code>。'
    },

    { t: 'h', text: '六、qsort、比较函数与函数指针表', id: 'ch07-6' },

    { t: 'p', html:
      '标准库的 <code>qsort</code> 是"泛型 + 回调"最经典的示范。它的原型是：' +
      '<code>void qsort(void *base, size_t n, size_t size, int (*cmp)(const void *, const void *))</code>。' +
      '它不知道你排的是什么，只知道"起始地址、元素个数、元素大小、怎么比较"。' +
      '你只要提供一个符合三值约定的比较函数，它就能对任意类型排序。'
    },

    { t: 'code', lang: 'c', caption: 'qsort1.c —— 排 int 数组与结构体数组', code:
`#include <stdio.h>
#include <stdlib.h>

typedef struct {
    const char *name;
    int score;
} student_t;

static int cmp_int(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y);
}

static int cmp_student(const void *a, const void *b) {
    const student_t *p = a;
    const student_t *q = b;
    if (p->score != q->score) {
        return p->score < q->score ? 1 : -1;   // 分数从高到低
    }
    return 0;
}

int main(void) {
    int nums[] = {42, 7, 19, 3, 88, 1};
    size_t n = sizeof nums / sizeof nums[0];
    qsort(nums, n, sizeof nums[0], cmp_int);
    for (size_t i = 0; i < n; i++) printf("%d ", nums[i]);
    printf("\\n");

    student_t s[] = {
        { "小明", 82 }, { "小红", 95 }, { "小刚", 70 }
    };
    size_t m = sizeof s / sizeof s[0];
    qsort(s, m, sizeof s[0], cmp_student);
    for (size_t i = 0; i < m; i++) {
        printf("%s %d\\n", s[i].name, s[i].score);
    }
    return 0;
}
` },

    { t: 'p', html:
      '排"字符串数组"时，比较函数的参数类型要多一层：数组元素是 <code>char *</code>，' +
      '所以 <code>qsort</code> 传给比较函数的是"指向 <code>char *</code> 的指针"，' +
      '也就是 <code>char **</code>。先把这层还原出来，再对字符串本身用 <code>strcmp</code>。'
    },

    { t: 'code', lang: 'c', caption: 'qsort2.c —— 排字符串数组', code:
`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int cmp_str(const void *a, const void *b) {
    const char *const *pa = a;      // a 指向数组元素，元素的类型是 const char *
    const char *const *pb = b;
    return strcmp(*pa, *pb);        // 比较的才是字符串内容
}

int main(void) {
    const char *words[] = { "pear", "apple", "orange", "banana" };
    size_t n = sizeof words / sizeof words[0];

    qsort(words, n, sizeof words[0], cmp_str);
    for (size_t i = 0; i < n; i++) {
        printf("%s\\n", words[i]);
    }
    return 0;
}
` },

    { t: 'callout', kind: 'warn', html:
      '比较函数必须返回 <code>int</code>，且满足"负数 / 0 / 正数"的约定。' +
      '常见错误有两个：直接 <code>return *a - *b</code>（大数溢出）、' +
      '或者比较 <code>char *</code> 的地址而不是字符串内容（忘了比对 <code>*pa</code>）。' +
      '另外，<code>qsort</code> <b>不保证稳定</b>：分数相同的元素相对顺序可能改变，' +
      '需要稳定排序时要自己加"次序"作为第二比较键。'
    },

    { t: 'p', html:
      '函数指针的最后一个重要用法是<b>表驱动</b>：把"名字 → 函数"放进一张表，' +
      '用查表替代一长串 <code>if/else</code> 或 <code>switch</code>。' +
      '新增一个操作只需要往表里加一行，命令解析、状态机、简单解释器都靠这种结构。'
    },

    { t: 'code', lang: 'c', caption: 'dispatch.c —— 用函数指针表做分派', code:
`#include <stdio.h>
#include <string.h>

typedef int (*binop_fn)(int, int);

static int op_add(int a, int b) { return a + b; }
static int op_sub(int a, int b) { return a - b; }
static int op_mul(int a, int b) { return a * b; }

typedef struct {
    const char *name;
    binop_fn fn;
} entry_t;

int main(void) {
    static const entry_t ops[] = {
        { "add", op_add },
        { "sub", op_sub },
        { "mul", op_mul },
    };
    const char *wanted = "mul";
    int a = 12, b = 4;

    for (size_t i = 0; i < sizeof ops / sizeof ops[0]; i++) {
        if (strcmp(ops[i].name, wanted) == 0) {
            printf("%s(%d, %d) = %d\\n", ops[i].name, a, b, ops[i].fn(a, b));
            break;
        }
    }
    return 0;
}
` },

    { t: 'compare', left: {
      title: '长 if/else 链', html:
        '每加一种操作就要改函数、加分支，分支越多越容易漏；' +
        '所有逻辑挤在一个函数里，测试时无法单独替换其中一种。'
    }, right: {
      title: '表驱动', html:
        '每种操作一个独立函数，表里一行对应一种；新增操作只加一行，' +
        '调用方通过查表统一分派，甚至可以让表由配置文件生成。'
    } },

    { t: 'keypoint', items: [
      { title: '泛型 = 大小 + 操作', html:
        'C 用 <code>void *</code> 擦掉类型，用"元素大小"补回步长，用函数指针补回操作。' },
      { title: 'void * 不能直接解引用', html:
        '它只装地址；使用前必须强转回具体类型，转错就是未定义行为。' },
      { title: '按字节操作要用 unsigned char *', html:
        '<code>swap_bytes</code>、<code>memcpy</code>、<code>memmove</code> 都遵循这条；' +
        '<code>memcpy</code> 不能处理重叠，重叠要用 <code>memmove</code>。' },
      { title: '函数指针声明看括号', html:
        '<code>int (*f)(int)</code> 是函数指针，<code>int *f(int)</code> 是返回指针的函数。' },
      { title: '比较函数是三值约定', html:
        '返回负 / 零 / 正；用 <code>(x &gt; y) - (x &lt; y)</code> 避免相减溢出。' },
      { title: '回调与表驱动', html:
        '<code>void *ctx</code> 携带上下文，函数指针表替代长分支——两者都是 C 里的"可插拔"设计。' }
    ] },

    { t: 'checklist', id: 'ch07', items: [
      '我能说清 void * 能做什么、不能做什么',
      '我能写出接收 void * 和元素大小的通用 swap 或通用查找',
      '我能解释 memcpy 与 memmove 的区别，以及 memset 为什么只能清 0',
      '我能读懂 int (*f)(int) 与 int *f(int) 的区别',
      '我能写一个符合三值约定的比较函数，并解释为什么不用 a - b',
      '我能用 qsort 排 int、结构体和字符串数组',
      '我能用函数指针表把长 if/else 链改成查表分派'
    ] }
  ]
});
