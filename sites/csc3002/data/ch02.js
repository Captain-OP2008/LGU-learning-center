/* =====================================================================
 * ch02.js · 第 2 章「指针、引用与内存：看见地址」
 * 依据：Lecture 10–11（C11 Pointers and Arrays）、Lecture 12–13（Chapter 12 Dynamic
 *       Memory Management）、Tutorial 05（PointerAndAddress / Swap / Increment）、
 *       Tutorial 06（linked_list.cpp）。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch02',
  num: '02',
  title: '指针、引用与内存：看见地址',
  en: 'POINTERS & MEMORY',
  goals: [
    '画出「变量—地址—值」三列图，说明 & 与 * 各自改变了哪一列',
    '解释数组名退化为指针的含义，并用指针算术遍历数组',
    '区分栈与堆的分配方式、生命周期和失败模式',
    '写出正确的 new/delete 配对，识别泄漏、悬垂与重复释放',
    '用引用改写一个「通过指针修改实参」的函数，并说明何时该用哪一个'
  ],
  kp: [
    { id: 'ch02-1', title: '地址、指针与取地址运算' },
    { id: 'ch02-2', title: '解引用与指针算术' },
    { id: 'ch02-3', title: '数组与 C 风格字符串' },
    { id: 'ch02-4', title: '栈与堆：两种内存' },
    { id: 'ch02-5', title: 'new 与 delete 的配对规则' },
    { id: 'ch02-6', title: '引用：更安全的别名' },
    { id: 'ch02-7', title: '用指针串起数据：链表' },
    { id: 'ch02-8', title: '内存错误的识别与排查' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么必须过指针这一关', html: '上一章说「类型是对内存的约定」，但那时你只看到名字，没看到地址。指针把地址摆到台面上：<code>int* p = &amp;x;</code> 之后，你手里握着的是 x 住在哪，而不是 x 的值。这门课后面所有的东西——数组、链表、树的节点、对象的 <code>this</code>、容器的迭代器、虚函数表——都是「地址 + 类型」的不同包装。<b>指针没学透，第 3 章之后全是黑箱。</b>' },

    { t: 'p', lead: true, html: '先建立一个可以随身带的图像。每个变量都有三样东西：<b>名字</b>（给人看的）、<b>地址</b>（给机器看的，通常是十六进制数）、<b>值</b>（那块内存里的比特）。普通变量你只操作名字和值；指针变量多了一层——它自己的值就是一个地址，指向别人的地址。所以指针有「指针自己是变量」和「指针指向的也是变量」两层，初学时所有混乱都来自把这两层搅在一起。' },

    { t: 'h', lvl: 2, text: '一、地址、指针与取地址运算', id: 'ch02-1' },

    { t: 'p', html: '<code>&amp;</code> 是取地址运算符，读作「address of」；<code>*</code> 在声明里表示「这是指针类型」，在表达式里表示「解引用，取那个地址上的值」。同一个符号在不同位置含义不同，这是 C++ 继承自 C 的历史包袱，只能靠上下文分辨。' },

    { t: 'code', lang: 'cpp', caption: '打印地址与值：注意指针本身也有地址', code: `#include <iostream>

int main() {
    int x = 42;
    int* p = &x;          // p 保存 x 的地址

    std::cout << "x  = " << x  << "\\n";          // 42
    std::cout << "&x = " << &x << "\\n";          // 0x7ffee...
    std::cout << "p  = " << p  << "\\n";          // 与 &x 相同
    std::cout << "*p = " << *p << "\\n";          // 42
    std::cout << "&p = " << &p << "\\n";          // p 自己的地址，不同

    *p = 100;                                     // 通过指针改 x
    std::cout << "x  = " << x << "\\n";           // 100
}` },

    { t: 'p', html: '指针的大小与类型无关：在 64 位平台上，<code>int*</code>、<code>double*</code>、<code>char*</code> 都是 8 字节，因为它们存的都是同一个东西——一个 64 位地址。类型的作用不是决定指针多大，而是决定<b>解引用时读几个字节、按什么格式解释、指针加一时前进多少</b>。' },

    { t: 'code', lang: 'cpp', caption: '指针加一不是加一个字节', code: `#include <iostream>

int main() {
    int arr[4] = {10, 20, 30, 40};
    int* p = arr;

    std::cout << sizeof(p) << "\\n";        // 8（64 位平台）
    std::cout << *p << "\\n";               // 10
    std::cout << *(p + 1) << "\\n";         // 20：前进 4 字节
    std::cout << (p + 1) - p << "\\n";      // 1：按元素计
}` },

    { t: 'p', html: '空指针用 <code>nullptr</code> 表示（C++11 起），不要再用 <code>NULL</code> 或 <code>0</code>。<code>nullptr</code> 有独立类型 <code>std::nullptr_t</code>，不会和整数重载混淆。解引用空指针是未定义行为，通常直接段错误；使用指针前先判断非空，是这个行业最基本的礼貌。' },

    { t: 'callout', kind: 'warn', title: '未初始化的指针比未初始化的 int 危险一百倍', html: '<code>int* p;</code> 里的值是栈上残留的随机位，它可能指向任何地方。对野指针解引用、写入，轻则崩溃，重则悄悄改坏别的变量，几小时后才在别处爆炸。<b>规则：指针定义时就初始化，不知道指向谁就写 <code>nullptr</code>。</b>' },

    { t: 'h', lvl: 2, text: '二、解引用与指针算术', id: 'ch02-2' },

    { t: 'p', html: '对一个指针解引用，就是「沿着地址找到那块内存，按指针的类型解释它」。指针算术只在<b>同一块数组内部</b>有意义：<code>p + n</code> 表示向后移动 n 个元素，两个同数组的指针相减得到元素个数。跨数组做减法、越界后继续加减，都是未定义行为，哪怕只是算出来不 dereference 也不行。' },

    { t: 'table', head: ['表达式', '含义', '合法条件'], rows: [
      ['<code>&amp;x</code>', 'x 的地址', 'x 是变量（不能对字面量取地址）'],
      ['<code>*p</code>', 'p 指向的值', 'p 非空且指向有效对象'],
      ['<code>p + n</code>', '向后第 n 个元素', '结果仍在同一数组（含末尾后一位）内'],
      ['<code>p2 - p1</code>', '两指针相隔的元素数', '指向同一数组'],
      ['<code>p[i]</code>', '等价于 <code>*(p + i)</code>', '同 <code>p + i</code>'],
      ['<code>p == q</code>', '是否指向同一地址', '总是合法；比较不同类型需转换']
    ], caption: '「末尾后一位」可以取地址、可以比较，但不能解引用，这是迭代器 end() 的由来' },

    { t: 'p', html: '把指针和数组放一起，就能解释那个著名的等价关系：<code>arr[i]</code> 就是 <code>*(arr + i)</code>，而 <code>i[arr]</code> 居然也能编译通过，因为加法可交换。这不是让你炫技，而是让你明白：<b>数组下标本质上是指针算术加解引用</b>，所以 C++ 的数组不检查越界。' },

    { t: 'code', lang: 'cpp', caption: '四种遍历数组的写法，本质相同', code: `#include <iostream>

int main() {
    int a[5] = {1, 2, 3, 4, 5};

    for (int i = 0; i < 5; ++i)  std::cout << a[i] << " ";      // 下标
    std::cout << "\\n";

    for (int* p = a; p != a + 5; ++p) std::cout << *p << " ";   // 指针
    std::cout << "\\n";

    for (int x : a) std::cout << x << " ";                      // 范围 for
    std::cout << "\\n";

    for (int i = 0; i < 5; ++i)  std::cout << *(a + i) << " ";  // 解引用
    std::cout << "\\n";
}` },

    { t: 'p', html: '指针算术还有一个常见用途：把「遍历到末尾」写成条件。<code>for (const char* p = s; *p != 0; ++p)</code> 就是 C 风格字符串的遍历方式，靠末尾的 <code>\\0</code> 停下来。这种写法的风险是：一旦那个 <code>\\0</code> 丢了，循环会一直读下去，直到撞上不可访问的内存。' },

    { t: 'h', lvl: 2, text: '三、数组与 C 风格字符串', id: 'ch02-3' },

    { t: 'p', html: 'C++ 的原始数组有两个特点：<b>大小固定</b>（编译期确定）、<b>不携带长度信息</b>。数组名在大多数表达式里会「退化」成指向首元素的指针，于是 <code>sizeof(arr)</code> 在函数内部就变成了指针大小 8，而不是整个数组的字节数。这是新手最常见的困惑之一。' },

    { t: 'code', lang: 'cpp', caption: '数组退化：为什么函数里算不出数组长度', code: `#include <iostream>

void print_size(int arr[]) {          // 等价于 int* arr
    std::cout << sizeof(arr) << "\\n"; // 8，不是 20
}

int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    std::cout << sizeof(arr) << "\\n"; // 20
    print_size(arr);
}` },

    { t: 'p', html: '因此数组作为参数时，必须<b>额外传一个长度</b>，或者改用 <code>std::vector</code> / <code>std::array</code>。标准库容器自带 <code>size()</code>，还能自动扩容，这就是第 6 章要用容器的原因。C 风格数组只在这门课讲内存布局时出现，正式代码不推荐。' },

    { t: 'p', html: 'C 风格字符串是以 <code>\\0</code> 结尾的字符数组。<code>char s[] = "hi"</code> 实际占 3 个字节：<code>h</code>、<code>i</code>、<code>\\0</code>。判断长度要扫到 <code>\\0</code> 为止，所以 <code>strlen</code> 是 O(n) 而不是 O(1)；拼接用 <code>strcat</code> 时如果不检查目标缓冲区大小，就是经典的缓冲区溢出漏洞。' },

    { t: 'table', head: ['C 风格', 'C++ 风格', '差距'], rows: [
      ['<code>char s[100]</code>', '<code>std::string s</code>', '固定长度 vs 自动扩容'],
      ['<code>strlen(s)</code> 扫到 <code>\\0</code>', '<code>s.size()</code> O(1)', '性能与安全性'],
      ['<code>strcpy(d, s)</code> 不检查边界', '<code>d = s</code> 自动管理', '溢出风险'],
      ['<code>s == t</code> 比较地址', '<code>s == t</code> 比较内容', '语义完全不同'],
      ['需要手动 <code>new char[n]</code>', '自动管理内存', '泄漏风险']
    ], caption: '除非在做底层接口，一律用 std::string；它的 c_str() 可以临时取到 C 风格指针' },

    { t: 'code', lang: 'cpp', caption: '同一个 == 在 char* 和 string 上含义不同', code: `#include <cstring>
#include <iostream>
#include <string>

int main() {
    const char* a = "hello";
    const char* b = "hello";
    std::cout << (a == b) << "\\n";     // 可能 1，也可能 0：比的是地址

    std::string s = "hello", t = "hello";
    std::cout << (s == t) << "\\n";     // 1：比的是内容
    std::cout << std::strcmp(a, b) << "\\n"; // 0 才表示内容相同
}` },

    { t: 'h', lvl: 2, text: '四、栈与堆：两种内存', id: 'ch02-4' },

    { t: 'p', html: '程序运行时用到的内存大致分几块，这门课只需要分清两块：<b>栈</b>和<b>堆</b>。栈由编译器自动管理，函数一进入就分配、一返回就回收，速度极快但容量有限（通常 1–8MB）；堆由程序员用 <code>new</code> 申请、用 <code>delete</code> 归还，容量大但管理责任在你身上。' },

    { t: 'flow', dir: 'row', nodes: [
      { title: '代码区', desc: '机器指令，只读' },
      { title: '全局/静态区', desc: '全局与 static 变量' },
      { title: '栈', desc: '局部变量，自动回收' },
      { title: '堆', desc: 'new 申请，手动释放' }
    ] },

    { t: 'table', head: ['对比项', '栈（stack）', '堆（heap）'], rows: [
      ['谁分配', '编译器自动', '程序员 <code>new</code>'],
      ['谁释放', '函数返回时自动', '程序员 <code>delete</code>'],
      ['大小', '较小，通常 1–8MB', '较大，受物理内存与系统限制'],
      ['速度', '极快（移动栈指针）', '较慢（需分配器查找空闲块）'],
      ['生命周期', '所在函数结束即失效', '从 new 到 delete 之间'],
      ['典型错误', '返回局部变量的地址', '泄漏、重复释放、悬垂指针']
    ], caption: '「局部变量不能返回地址」是栈的规则；「new 了要 delete」是堆的规则' },

    { t: 'code', lang: 'cpp', caption: '同一个函数，栈对象与堆对象的不同命运', code: `#include <iostream>

int* make_on_stack() {
    int local = 42;
    return &local;          // 危险：返回后 local 已失效
}

int* make_on_heap() {
    int* p = new int(42);   // 堆上，函数返回后仍然有效
    return p;               // 调用者负责 delete
}

int main() {
    int* bad = make_on_stack();
    // std::cout << *bad;   // 未定义行为：悬垂指针

    int* good = make_on_heap();
    std::cout << *good << "\\n";   // 42
    delete good;                    // 记得归还
}` },

    { t: 'p', html: '栈的另一个特点是「后进先出」。函数调用时，参数、返回地址、局部变量依次压栈，函数返回时一起弹出。所以递归太深会「爆栈」（stack overflow），而堆上的链表再长也不会因为深度爆栈，只可能耗尽内存。' },

    { t: 'callout', kind: 'tip', title: '画图比读代码快', html: '遇到指针题，拿张纸画四列：<b>变量名 / 地址 / 值 / 指向</b>。每执行一行就更新一次，箭头表示指针。十道题里九道能靠这张图做出来，剩下那道是题本身有坑。考试时在草稿纸上画，比在脑子里模拟可靠得多。' },

    { t: 'h', lvl: 2, text: '五、new 与 delete 的配对规则', id: 'ch02-5' },

    { t: 'p', html: '<code>new T</code> 做两件事：在堆上分配 <code>sizeof(T)</code> 字节，然后调用 T 的构造函数；<code>delete p</code> 做两件事：调用析构函数，然后归还内存。<code>new T[n]</code> 与 <code>delete[] p</code> 必须配对——数组版本要逐个析构元素，用错形式是未定义行为，常常表现为只析构了第一个元素或直接崩溃。' },

    { t: 'code', lang: 'cpp', caption: 'new / delete 的四种正确配对', code: `#include <iostream>

int main() {
    int* a = new int(5);           // 单个对象
    delete a;                       // 配对：delete

    int* b = new int[10];          // 数组
    delete[] b;                     // 配对：delete[]

    int* c = new int[10]();        // 值初始化为 0
    delete[] c;

    // 现代写法：不用裸 new
    auto d = std::make_unique<int>(5);   // C++14，第 7 章详讲
}` },

    { t: 'p', html: '三个高频错误。<b>泄漏</b>：new 了没 delete，程序长时间运行内存一直涨。<b>重复释放</b>：同一个指针 delete 两次，堆管理器内部结构被破坏，常在无关的地方崩溃。<b>悬垂</b>：delete 之后继续用这个指针，那块内存可能已经被别人拿走。delete 之后立刻把指针置为 <code>nullptr</code>，能防住第三种的一部分情况。' },

    { t: 'code', lang: 'cpp', caption: '一个泄漏的例子：异常或提前 return 让 delete 被跳过', code: `#include <iostream>

void leaky(bool early) {
    int* p = new int[100];
    if (early) {
        return;              // 泄漏：delete[] 永远不会执行
    }
    delete[] p;
}

int main() {
    leaky(true);
    leaky(false);
}` },

    { t: 'p', html: '这类 bug 靠人眼很难查，尤其是函数有十几条返回路径时。解决办法不是「更小心」，而是<b>不要手动管理</b>：用 <code>std::vector</code> 替代 <code>new int[n]</code>，用 <code>std::unique_ptr</code> 替代 <code>new T</code>。第 3 章的析构函数和第 7 章的 RAII 就是把这个思想制度化。' },

    { t: 'h', lvl: 2, text: '六、引用：更安全的别名', id: 'ch02-6' },

    { t: 'p', html: '引用是给已有对象起的<b>另一个名字</b>。它必须在定义时绑定，绑定后不能改绑到别的对象，也不能为空。语法上它像值（不用 <code>*</code>），语义上它像指针（不拷贝），所以既省了拷贝又省了箭头，是 C++ 里传递大对象的标准方式。' },

    { t: 'code', lang: 'cpp', caption: '引用与指针的语法对比', code: `#include <iostream>

int main() {
    int x = 10;

    int& r = x;        // r 是 x 的别名
    r = 20;
    std::cout << x << "\\n";     // 20

    int* p = &x;
    *p = 30;
    std::cout << x << "\\n";     // 30

    // int& bad;                  // 错误：引用必须初始化
    // r = y;                     // 不是改绑，是把 y 的值赋给 x
}` },

    { t: 'table', head: ['对比项', '指针', '引用'], rows: [
      ['能否为空', '能（<code>nullptr</code>）', '不能'],
      ['能否改绑', '能', '不能'],
      ['语法', '需要 <code>*</code> 和 <code>&amp;</code>', '像普通变量'],
      ['是否占内存', '占一个地址大小', '通常由编译器优化掉，不保证'],
      ['常见用途', '可空参数、动态结构、迭代', '函数参数、返回值、范围 for'],
      ['典型风险', '野指针、悬垂、泄漏', '绑定到临时对象导致的悬垂']
    ], caption: '「能不用指针就不用」是现代 C++ 的默认立场；引用表达「一定有」' },

    { t: 'p', html: '引用最危险的用法是绑定到临时对象。函数返回局部变量的引用、或者把引用成员绑定到参数，都会在函数结束后留下悬垂引用。这类 bug 的症状是「值偶尔不对」，非常难查。规则：<b>不要返回局部变量的引用或指针</b>，除非它是 static 或成员。' },

    { t: 'code', lang: 'cpp', caption: 'const 引用：既不改，也不拷贝', code: `#include <iostream>
#include <string>
#include <vector>

// 传值：每次调用拷贝整个 vector
int sum_by_value(std::vector<int> v) {
    int s = 0;
    for (int x : v) s += x;
    return s;
}

// const 引用：零拷贝，且承诺不修改
int sum_by_ref(const std::vector<int>& v) {
    int s = 0;
    for (int x : v) s += x;
    return s;
}

int main() {
    std::vector<int> big(1000000, 1);
    std::cout << sum_by_ref(big) << "\\n";   // 快得多
}` },

    { t: 'h', lvl: 2, text: '七、用指针串起数据：链表', id: 'ch02-7' },

    { t: 'p', html: '数组的元素在内存里是连续排的，所以能用下标 O(1) 定位；代价是插入删除要搬移后面所有元素，而且大小固定。链表换一种组织方式：每个节点存一个值和<b>指向下一个节点的指针</b>，节点散落在堆上，靠指针串起来。插入删除只改几个指针，但访问第 n 个元素要一个个走。' },

    { t: 'code', lang: 'cpp', caption: '课程 Tutorial 06 的链表骨架', code: `struct int_list {
    int value;
    int_list* next;
};

int_list* cons(int value, int_list* tail) {
    int_list* node = new int_list;
    node->value = value;
    node->next = tail;
    return node;
}

void clear(int_list* head) {
    while (head != nullptr) {
        int_list* next = head->next;   // 先记住下一个
        delete head;                    // 再删当前
        head = next;
    }
}` },

    { t: 'p', html: '<code>clear</code> 里那个「先记住 next 再 delete」的顺序是关键。如果先 <code>delete head</code> 再读 <code>head-&gt;next</code>，就是访问已释放内存，属于悬垂指针。这类「删除时先保存后继」的模板在后面学树、图的遍历时会反复出现。' },

    { t: 'p', html: '链表还暴露了指针的另一个价值：<b>它是递归数据结构的粘合剂</b>。一个节点里含有指向同类型节点的指针，就能无限延伸。第 3 章的有序表、第 6 章的 <code>std::list</code>、第 4 章的继承体系，内部都是这种「对象里有指针指向别的对象」的结构。' },

    { t: 'compare', left: { title: '数组 / vector', html: '内存连续，缓存友好，随机访问 O(1)；尾部插入均摊 O(1)，中间插入 O(n)；大小可预知时首选。' }, right: { title: '链表', html: '节点分散，缓存不友好，随机访问 O(n)；已知位置时插入删除 O(1)；频繁在中间增删、或需要稳定引用时考虑。' } },

    { t: 'h', lvl: 2, text: '八、内存错误的识别与排查', id: 'ch02-8' },

    { t: 'p', html: '内存错误的特点是「案发现场和崩溃地点经常不在一起」。写越界可能当场没事，几分钟后在完全无关的 <code>delete</code> 上崩溃。所以不能靠「跑一遍没崩」判断正确，要靠工具和纪律。' },

    { t: 'table', head: ['错误', '症状', '怎么发现'], rows: [
      ['泄漏', '长时间运行内存持续上涨', 'AddressSanitizer 的 LeakSanitizer、valgrind'],
      ['越界写', '随机崩溃、别的变量被改', '<code>-fsanitize=address</code> 立刻报行号'],
      ['悬垂读', '值偶尔不对、行为不稳定', 'ASan 的 use-after-free 报告'],
      ['重复释放', '在 delete 处崩溃', 'ASan 的 double-free 报告'],
      ['未初始化读', '结果时对时错', '<code>-fsanitize=memory</code> 或 valgrind']
    ], caption: '编译时加 -g -fsanitize=address，比事后猜快一个数量级' },

    { t: 'code', lang: 'bash', caption: '开启内存检查的编译命令', code: `# AddressSanitizer：越界、悬垂、泄漏一次抓全
g++ -std=c++17 -g -fsanitize=address -fno-omit-frame-pointer \
    main.cpp -o main
./main

# 只查泄漏（Linux 的 valgrind 也行）
valgrind --leak-check=full ./main` },

    { t: 'p', html: '如果没有工具，退而求其次的办法是<b>缩小规模 + 打印</b>：把数组从 1000 改成 3，把链表从 10 个节点改成 2 个，手动走一遍每一步的指针。规模一小，错误就藏不住。这个「最小复现」的习惯比任何调试器都通用。' },

    { t: 'callout', kind: 'exam', title: '这一章在卷面上怎么考', html: '常见三种题型：<b>①</b> 给一段含指针的代码，写出输出或指出错误（考 &amp;、*、指针算术、delete[] 配对）；<b>②</b> 画内存图（给变量、数组、链表，要求标出地址与指向）；<b>③</b> 改错（返回值地址、泄漏、悬垂、越界各一处）。第 ③ 类最容易拿分，因为错误模式就那么几种。' },

    { t: 'terms', items: [
      { en: 'dereference', zh: '解引用', html: '用 <code>*p</code> 沿着地址访问目标对象；空指针或悬垂指针解引用都是未定义行为。' },
      { en: 'pointer arithmetic', zh: '指针算术', html: '以「元素」为单位移动指针；<code>p+1</code> 前进的是 <code>sizeof(*p)</code> 字节。' },
      { en: 'array decay', zh: '数组退化', html: '数组名在多数表达式中变成指向首元素的指针，长度信息随之丢失。' },
      { en: 'heap', zh: '堆', html: '由 new/malloc 手动申请的动态内存区域，生命周期由程序员控制。' },
      { en: 'dangling pointer', zh: '悬垂指针', html: '指向已被释放内存的指针；解引用它属于 use-after-free。' },
      { en: 'RAII', zh: '资源获取即初始化', html: '把资源绑定到对象生命周期：构造时获取、析构时释放，从根上避免泄漏。' }
    ] },

    { t: 'quiz', qid: 'ch02-q1' },
    { t: 'quiz', qid: 'ch02-q2' },
    { t: 'quiz', qid: 'ch02-q3' },

    { t: 'keypoint', items: [
      { title: '指针存的是地址，类型决定怎么解释', html: '64 位平台上所有指针都是 8 字节；<code>p+1</code> 前进的字节数由 <code>sizeof(*p)</code> 决定。' },
      { title: '数组名会退化成指针', html: '函数参数里的 <code>int arr[]</code> 就是 <code>int*</code>，长度必须另传或用容器。' },
      { title: '栈自动、堆手动', html: '返回局部变量的地址必然悬垂；new 出来的内存必须由某个人 delete。' },
      { title: 'new[] 必须配 delete[]', html: '配对错了是未定义行为；现代代码用 vector / unique_ptr 代替裸 new。' },
      { title: '引用是必须有、不能改绑的别名', html: '传大对象用 <code>const T&amp;</code>；不要返回局部变量的引用。' }
    ] },

    { t: 'checklist', id: 'ch02', items: [
      '我能画出「变量名—地址—值」三列表，并标出一个指针的指向',
      '我能解释为什么 int* 和 char* 大小相同但 p+1 前进的字节数不同',
      '我知道 int arr[] 作为参数时为什么 sizeof 变成 8',
      '我能说出栈和堆在分配者、释放者、生命周期上的四点差别',
      '我能写出 new int / delete 与 new int[10] / delete[] 的正确配对',
      '我能指出「返回局部变量地址」的代码错在哪，并给出两种修法',
      '我能把通过指针修改实参的函数改写成引用版本',
      '我知道链表删除节点时为什么要先保存 next',
      '我能用 -fsanitize=address 编译并读懂一次越界报告'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应讲义 C11（Pointers and Arrays）与 Chapter 12（Dynamic Memory Management），链表示例参考课程 Tutorial 06 的 <code>linked_list.cpp</code> 与 <code>linked_list_unique.cpp</code>，swap 三版本参考 Tutorial 05。内存错误一节补充了 AddressSanitizer 的用法，这不是讲义内容，但课程项目与作业都要求代码能通过基本的内存检查。下一章把这些「裸的地址与内存」包进类里：构造函数负责获取资源，析构函数负责归还，拷贝构造函数负责复制——也就是常说的三件套。' }
  ]
});
