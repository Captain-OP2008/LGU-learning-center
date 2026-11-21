/* =====================================================================
 * ch01.js · 第 1 章「基础与类型系统：值、类型与表达式」
 * 依据：Lecture 02–04（Chapter 01 Overview of C++、Chapter 02 Functions and Libraries）、
 *       Lecture 05（C03 Strings）、Lecture 06（C04 Streams）。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch01',
  num: '01',
  title: '基础与类型系统：值、类型与表达式',
  en: 'TYPES & EXPRESSIONS',
  goals: [
    '用 sizeof 和补码解释一个 int 为什么能存 -2147483648 却存不了 2147483648',
    '区分声明与定义、初始化与赋值，并说出未初始化变量为什么危险',
    '准确判断一个混合类型表达式的类型与结果，指出其中的隐式转换',
    '解释值传递、引用传递、const 引用传递各自的开销与语义差别',
    '用 string、getline、stringstream 完成一行文本的拆分与规范化'
  ],
  kp: [
    { id: 'ch01-1', title: '类型是对内存的约定' },
    { id: 'ch01-2', title: '变量：声明、定义与初始化' },
    { id: 'ch01-3', title: '表达式与运算符优先级' },
    { id: 'ch01-4', title: '隐式转换与整数陷阱' },
    { id: 'ch01-5', title: '函数：参数怎样进入函数' },
    { id: 'ch01-6', title: '作用域、生命周期与 static' },
    { id: 'ch01-7', title: '字符串与流：处理真实输入' },
    { id: 'ch01-8', title: '把值打印出来：最小调试法' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么从「值」开始', html: 'C++ 的几乎所有 bug，追到最后都是「你以为这个变量是那个值，其实不是」。<code>int</code> 溢出成负数、<code>double</code> 存不下 0.1、<code>char</code> 在某些平台是有符号的、<code>unsigned</code> 减过头变成 42 亿——这些都不是玄学，而是<b>类型对内存的约定</b>被违反了。本章把「一个值在机器里到底是什么」讲清楚，后面讲指针、对象、容器才有落脚点。' },

    { t: 'p', lead: true, html: '学一门语言最容易犯的错，是把「类型」当成标签：<code>int x = 5;</code> 读作「x 是一个整数」。在 C++ 里更准确的理解是：<b>类型决定了这块内存占多少字节、这些字节按什么规则解释、能对它做哪些操作</b>。同一串 32 个二进制位，按 <code>int</code> 读是 -1，按 <code>unsigned</code> 读是 4294967295，按 <code>float</code> 读是 NaN。类型不是贴在值上的标签，而是你与内存之间的合同。' },

    { t: 'h', lvl: 2, text: '一、类型是对内存的约定', id: 'ch01-1' },

    { t: 'p', html: 'C++ 的基本类型大小不是完全固定的，标准只规定了「至少多大」和相对顺序。但在本课使用的 x86-64 / g++ 环境里，可以记下面这张表。写代码时如果关心字节数，应该用 <code>sizeof</code> 而不是背数字，因为换平台就可能变。' },

    { t: 'table', head: ['类型', '典型大小', '取值范围（本课环境）', '常见误用'], rows: [
      ['<code>bool</code>', '1 字节', '<code>true</code> / <code>false</code>', '把任意非 0 当 true，误以为只能存 0/1'],
      ['<code>char</code>', '1 字节', '-128 ~ 127（有符号时）', '用它存中文或大于 127 的值'],
      ['<code>short</code>', '2 字节', '-32768 ~ 32767', '当作「小 int」省内存，结果溢出'],
      ['<code>int</code>', '4 字节', '-2147483648 ~ 2147483647', '阶乘、斐波那契算到二十几项就爆'],
      ['<code>long long</code>', '8 字节', '约 ±9.2×10^18', '忘了字面量后缀，右边先按 int 算溢出'],
      ['<code>float</code>', '4 字节', '约 7 位有效数字', '拿它做金额累加，误差越滚越大'],
      ['<code>double</code>', '8 字节', '约 15–16 位有效数字', '用 <code>==</code> 直接比较两个计算结果']
    ], caption: '「典型大小」指本课环境；跨平台代码请用 sizeof 或 <cstdint> 里的定长类型' },

    { t: 'p', html: '为什么 <code>int</code> 的上限是 2147483647 而不是 2147483648？因为 4 字节 = 32 位，其中最高位被拿去做符号位，剩下 31 位表示大小，2^31 = 2147483648，正数从 0 到 2^31-1。负数不用「符号位 + 绝对值」，而用<b>补码</b>：-1 表示为全 1（0xFFFFFFFF），-2 是 0xFFFFFFFE。补码的好处是加法和减法可以用同一套电路，<code>a - b</code> 直接算 <code>a + (-b)</code>。' },

    { t: 'code', lang: 'cpp', caption: '看看一个 int 的边界与溢出', code: `#include <iostream>
#include <limits>

int main() {
    std::cout << sizeof(int) << " bytes\\n";              // 4
    std::cout << std::numeric_limits<int>::max() << "\\n"; // 2147483647
    std::cout << std::numeric_limits<int>::min() << "\\n"; // -2147483648

    int big = std::numeric_limits<int>::max();
    big = big + 1;      // 有符号溢出：未定义行为，不要依赖结果
    std::cout << big << "\\n";
}` },

    { t: 'callout', kind: 'warn', title: '溢出不是「变成最小值」那么简单', html: '很多教程说「int 最大值加一会变成最小值」，这在补码机器上<b>经常</b>成立，但标准说这是未定义行为（UB）。开了 <code>-O2</code> 的编译器可能假设「有符号数不会溢出」，从而把 <code>if (x + 1 &lt; x)</code> 这种检查直接优化掉。要检测溢出，用 <code>__builtin_add_overflow</code> 或先转成 <code>long long</code> 再判断。' },

    { t: 'p', html: '浮点数更微妙。IEEE 754 把 64 位分成符号位、11 位指数、52 位尾数，能表示的范围极大，但<b>精度有限</b>。0.1 在二进制里是无限循环小数，存进 double 时就被截断了。所以 <code>0.1 + 0.2 == 0.3</code> 的结果是 <code>false</code>。这不是 C++ 的 bug，任何用二进制浮点的语言都一样。' },

    { t: 'code', lang: 'cpp', caption: '浮点比较的正确写法', code: `#include <cmath>
#include <iostream>

int main() {
    double a = 0.1 + 0.2;
    std::cout << (a == 0.3) << "\\n";            // 0
    std::cout.precision(17);
    std::cout << a << "\\n";                       // 0.30000000000000004

    const double eps = 1e-9;
    if (std::fabs(a - 0.3) < eps) {
        std::cout << "close enough\\n";
    }
}` },

    { t: 'h', lvl: 2, text: '二、变量：声明、定义与初始化', id: 'ch01-2' },

    { t: 'p', html: '三个词经常被混用，但在多文件工程里必须分清。<b>声明</b>是告诉编译器「有这么个名字，类型是这样」，不分配内存；<b>定义</b>是真正分配内存（或给出函数体）；<b>初始化</b>是定义时给初值。头文件里放声明，.cpp 里放定义，这是第 0 章就立下的规矩。' },

    { t: 'table', head: ['写法', '是声明还是定义', '说明'], rows: [
      ['<code>int x;</code>', '定义', '分配 4 字节，值不确定'],
      ['<code>extern int x;</code>', '声明', '告诉编译器别处有定义，不分配'],
      ['<code>int f(int);</code>', '声明', '函数原型，只有签名'],
      ['<code>int f(int a) { return a; }</code>', '定义', '有函数体'],
      ['<code>const int k = 3;</code>', '定义（内部链接）', '每个包含它的翻译单元各有一份'],
      ['<code>inline int f() {...}</code>', '定义（可多处出现）', '链接器只保留一份']
    ], caption: '「重复定义」错误几乎都来自把定义写进了头文件' },

    { t: 'p', html: 'C++11 之后初始化方式有好几种，语义并不完全相同。最推荐的是<b>花括号初始化</b>（列表初始化），因为它禁止窄化转换：<code>int x{3.9}</code> 直接编译报错，而 <code>int x = 3.9</code> 会悄悄截断成 3。' },

    { t: 'code', lang: 'cpp', caption: '四种初始化写法与它们的差别', code: `int a;          // 默认初始化：值不确定（UB 风险）
int b = 3.9;    // 拷贝初始化：截断为 3，不报错
int c(3.9);     // 直接初始化：同样截断为 3
int d{3.9};     // 列表初始化：编译错误，禁止窄化（推荐）

int e{};        // 值初始化为 0
std::string s;  // 默认构造为空串
int arr[5]{};   // 五个元素全为 0` },

    { t: 'p', html: '<code>auto</code> 让编译器推导类型，省掉冗长的写法，但有两个坑：一是 <code>auto x = 3;</code> 得到 <code>int</code>，<code>auto y = 3.0;</code> 得到 <code>double</code>，别以为它总是你想要的；二是 <code>auto</code> 会丢掉引用和 const，<code>for (auto s : words)</code> 每次都拷贝一个 string，应该写 <code>const auto&amp; s</code>。' },

    { t: 'p', html: '<code>const</code> 是最便宜的文档。它告诉读代码的人「这个值不会再变」，也让编译器帮你检查。<b>习惯是：能加 const 就加</b>。函数参数、局部变量、成员函数（写在参数表后面）都可以加。第 3 章会看到，const 成员函数是类接口设计的一部分。' },

    { t: 'compare', left: { title: '#define 定义常量', html: '<code>#define MAX 100</code> 是预处理文本替换，没有类型、没有作用域、调试器看不到符号，出错时报错行号会指到奇怪的地方。唯一还常用的场景是头文件守卫。' }, right: { title: 'const / constexpr 定义常量', html: '<code>constexpr int kMax = 100;</code> 有类型、有作用域、能进调试器，编译期就能参与计算（如数组大小）。现代 C++ 一律优先用它。' } },

    { t: 'h', lvl: 2, text: '三、表达式与运算符优先级', id: 'ch01-3' },

    { t: 'p', html: '表达式由运算符和操作数组成，每个表达式都有一个类型和一个值。两个最常见的错误来源：<b>优先级记错</b>，以及<b>在同一个表达式里多次修改同一个变量</b>（未定义行为）。前者查表就能避免，后者只能靠纪律。' },

    { t: 'table', head: ['优先级（高→低）', '运算符', '结合性', '易错点'], rows: [
      ['1', '<code>::</code>', '左', '命名空间与类作用域'],
      ['2', '<code>() [] . -&gt;</code> <code>++ --</code>（后缀）', '左', '后缀自增先取值再加'],
      ['3', '<code>! ~ ++ -- + -</code>（一元）<code>* &amp; sizeof</code>', '右', '<code>*p++</code> 是 <code>*(p++)</code>'],
      ['4–7', '<code>* / %</code>，<code>+ -</code>，<code>&lt;&lt; &gt;&gt;</code>，<code>&lt; &lt;= &gt; &gt;=</code>', '左', '<code>a &lt; b == c</code> 先算比较'],
      ['8–10', '<code>== !=</code>，<code>&amp;</code>，<code>^</code>，<code>|</code>', '左', '位运算优先级低于比较'],
      ['11–13', '<code>&amp;&amp;</code>，<code>||</code>，<code>?:</code>', '左/右', '短路求值'],
      ['14–15', '<code>= += -=</code> 等', '右', '<code>a = b = 0</code> 从右往左']
    ], caption: '记不住就加括号；括号不丢分，优先级记错会丢分' },

    { t: 'p', html: '整数除法与取模是另一组高频陷阱。<code>7 / 2</code> 是 3 不是 3.5；<code>-7 / 2</code> 在 C++11 之后规定向零取整，结果是 -3；<code>-7 % 2</code> 的结果是 -1，符号跟着被除数。如果你想要「数学上的模」（结果非负），需要自己补一句。' },

    { t: 'code', lang: 'cpp', caption: '除法、取模与短路的实际结果', code: `#include <iostream>
int main() {
    std::cout << 7 / 2 << "\\n";          // 3
    std::cout << 7.0 / 2 << "\\n";        // 3.5
    std::cout << -7 / 2 << "\\n";         // -3
    std::cout << -7 % 2 << "\\n";         // -1

    int i = 0;
    if (i != 0 && 10 / i > 2) {           // 短路：右边不会执行
        std::cout << "ok\\n";
    }

    // int j = i++ + ++i;                 // UB：同一表达式多次修改 i
}` },

    { t: 'p', html: '<code>&amp;&amp;</code> 和 <code>||</code> 是短路求值的：左边能决定结果，右边根本不执行。这既是优化，也是写安全代码的手段——上面 <code>i != 0 &amp;&amp; 10 / i &gt; 2</code> 就靠它避免除零。反过来，如果右边有副作用（比如 <code>count++</code>），短路会让它有时执行有时不执行，这种代码必须拆开写。' },

    { t: 'callout', kind: 'exam', title: '读代码写输出的固定套路', html: '考试里的表达式题，按这个顺序推：<b>①</b> 标出每个子表达式的类型；<b>②</b> 按优先级加括号；<b>③</b> 注意整数除法与取模的符号；<b>④</b> 检查有没有 <code>i++</code> 与 <code>++i</code> 混用。四步走完再动笔算，比心算快且不出错。' },

    { t: 'h', lvl: 2, text: '四、隐式转换与整数陷阱', id: 'ch01-4' },

    { t: 'p', html: '当两个不同类型的值一起运算时，C++ 会按「整型提升 → 常规算术转换」的规则把小的往大的转。<code>char</code> 和 <code>short</code> 先提升为 <code>int</code>，然后 <code>int</code> 与 <code>double</code> 运算时 <code>int</code> 转 <code>double</code>。方向大体是「向精度更高、范围更大的类型看齐」，但遇到<b>有符号与无符号混用</b>时会出问题。' },

    { t: 'code', lang: 'cpp', caption: '有符号与无符号混用：-1 变成 42 亿', code: `#include <iostream>
int main() {
    unsigned int u = 1;
    int i = -1;
    if (i < u) {
        std::cout << "less\\n";
    } else {
        std::cout << "greater or equal\\n";   // 实际走这里
    }

    std::cout << i + u << "\\n";             // 4294967296? 不，是 0
    std::cout << (int)(i + u) << "\\n";      // 0
}` },

    { t: 'p', html: '原因：比较时 <code>int</code> 被转成 <code>unsigned int</code>，-1 的位模式全 1，按无符号解释就是 4294967295，当然大于 1。这类 bug 在 <code>for (int i = 0; i &lt; v.size(); ++i)</code> 里最常见：<code>size()</code> 返回 <code>size_t</code>（无符号），当 <code>v</code> 为空、<code>i</code> 递减到 -1 时条件永远成立，程序直接越界崩溃。' },

    { t: 'table', head: ['场景', '危险写法', '安全写法'], rows: [
      ['遍历容器', '<code>for (int i = 0; i &lt; v.size(); ++i)</code>', '<code>for (size_t i = 0; i &lt; v.size(); ++i)</code> 或范围 for'],
      ['倒序遍历', '<code>for (int i = v.size()-1; i &gt;= 0; --i)</code>', '用 <code>int i = (int)v.size()-1</code>，或反向迭代器'],
      ['比较差值', '<code>if (a - b &lt; 0)</code>（a、b 无符号）', '<code>if (a &lt; b)</code>'],
      ['字符分类', '<code>if (c &gt;= 65 &amp;&amp; c &lt;= 90)</code>', '用 <code>std::isupper</code>（需 <code>unsigned char</code> 转换）']
    ], caption: '规则：容器大小、下标一律当作 size_t 处理，不要在两者之间来回转' },

    { t: 'p', html: '字符也有坑。<code>char</code> 是否有符号由实现决定，在 x86 上通常有符号。把 <code>char</code> 传给 <code>toupper</code>、<code>isdigit</code> 这类函数时，如果字符值超过 127（比如中文 UTF-8 字节），会被当成负数，行为未定义。正确写法是先转 <code>unsigned char</code>。' },

    { t: 'code', lang: 'cpp', caption: '字符分类的安全写法', code: `#include <cctype>
#include <iostream>
#include <string>

int main() {
    std::string s = "Hello, World 42";
    int letters = 0, digits = 0;
    for (char ch : s) {
        unsigned char u = static_cast<unsigned char>(ch);
        if (std::isalpha(u)) ++letters;
        if (std::isdigit(u)) ++digits;
    }
    std::cout << letters << " letters, " << digits << " digits\\n";
}` },

    { t: 'h', lvl: 2, text: '五、函数：参数怎样进入函数', id: 'ch01-5' },

    { t: 'p', html: '函数是把一段逻辑命名、隔离、复用的工具。C++ 的函数参数默认是<b>值传递</b>：调用时把实参复制一份给形参，函数里怎么改都不影响外面。这对 <code>int</code> 无所谓，但对 <code>string</code>、<code>vector</code> 这种大对象，每次调用都复制一遍，代价可能很大。' },

    { t: 'code', lang: 'cpp', caption: '三种参数传递：值、指针、引用（来自课程 Tutorial 05 的 swap 例子）', code: `#include <iostream>

void swap_by_value(int a, int b) {        // 只交换副本
    int t = a; a = b; b = t;
}

void swap_by_pointer(int* a, int* b) {    // 通过地址改原对象
    int t = *a; *a = *b; *b = t;
}

void swap_by_reference(int& a, int& b) {  // 引用就是原对象的别名
    int t = a; a = b; b = t;
}

int main() {
    int x = 1, y = 2;
    swap_by_value(x, y);      std::cout << x << y << "\\n";  // 12
    swap_by_pointer(&x, &y);  std::cout << x << y << "\\n";  // 21
    swap_by_reference(x, y);  std::cout << x << y << "\\n";  // 12
}` },

    { t: 'table', head: ['传递方式', '写法', '是否拷贝', '能否修改实参', '什么时候用'], rows: [
      ['值传递', '<code>void f(int x)</code>', '是', '不能', '小类型（int、double、指针）'],
      ['指针传递', '<code>void f(int* p)</code>', '拷贝地址', '能（解引用后）', '参数可为空、需要表达「没有」'],
      ['引用传递', '<code>void f(int&amp; x)</code>', '否', '能', '需要修改调用者的对象'],
      ['const 引用', '<code>void f(const string&amp; s)</code>', '否', '不能', '大对象只读，首选'],
      ['值返回', '<code>string f()</code>', '通常省略', '—', '返回新对象，靠 RVO/移动优化']
    ], caption: '读大对象一律 const 引用；要改就引用；只有可空才用指针' },

    { t: 'p', html: '函数重载允许同名函数有不同的参数列表，编译器按实参类型挑一个。注意<b>返回值类型不参与重载</b>：<code>int f()</code> 和 <code>double f()</code> 不能共存。默认参数也有坑：一旦某个参数给了默认值，它右边的所有参数都必须有默认值；而且默认值是在<b>调用点</b>决定的，通过基类指针调用虚函数时不会用派生类的默认值（第 4 章会讲）。' },

    { t: 'p', html: '函数必须先声明后使用。单文件里把函数定义写在 <code>main</code> 之前就行；多文件工程里，声明放头文件，定义放 .cpp。这就是第 0 章说的「接口在前，实现在后」。' },

    { t: 'h', lvl: 2, text: '六、作用域、生命周期与 static', id: 'ch01-6' },

    { t: 'p', html: '作用域回答「这个名字在哪可见」，生命周期回答「这块内存从哪到哪有效」。两者经常被混为一谈，但它们是不同的东西：一个局部变量离开作用域时生命周期结束，而一个 <code>static</code> 局部变量作用域仍在函数内，生命周期却一直到程序结束。' },

    { t: 'table', head: ['种类', '作用域', '生命周期', '初值', '典型用途'], rows: [
      ['局部变量', '所在 <code>{}</code> 块', '进入块到离开块', '不确定', '临时计算'],
      ['static 局部', '所在块', '程序全程', '0（首次进入时初始化）', '缓存、计数器、单例'],
      ['全局变量', '整个翻译单元（或全程序）', '程序全程', '0', '尽量少用'],
      ['成员变量', '对象内', '对象构造到析构', '由构造函数决定', '对象状态'],
      ['函数参数', '函数体', '调用到返回', '由实参决定', '输入']
    ], caption: '全局变量越多，程序越难理解；本课的项目一律用参数和返回值传数据' },

    { t: 'code', lang: 'cpp', caption: 'static 局部变量只初始化一次', code: `#include <iostream>

int next_id() {
    static int counter = 0;   // 第一次调用时初始化为 0
    return ++counter;
}

int main() {
    std::cout << next_id() << "\\n";  // 1
    std::cout << next_id() << "\\n";  // 2
    std::cout << next_id() << "\\n";  // 3
}` },

    { t: 'p', html: '同名变量在内层作用域会<b>遮蔽</b>外层变量。这是 bug 的温床：在 <code>for</code> 循环里写 <code>int sum = 0;</code>，循环外用同名的 <code>sum</code>，两个不是同一个变量。开启 <code>-Wshadow</code> 可以让编译器提醒你。' },

    { t: 'callout', kind: 'tip', title: '命名能省掉一半注释', html: '把 <code>int a, b, c;</code> 改成 <code>int totalWords, uniqueWords, maxCount;</code>，读代码的人（包括三个月后的你）不需要任何注释就知道在算什么。变量名长度不收费，模糊的名字才是成本。' },

    { t: 'h', lvl: 2, text: '七、字符串与流：处理真实输入', id: 'ch01-7' },

    { t: 'p', html: '<code>std::string</code> 是标准库的字符串类，可以 <code>+</code> 拼接、<code>size()</code> 取长度、<code>[]</code> 下标访问、<code>substr</code> 取子串、<code>find</code> 查位置。它自动管理内存，不用你 <code>new</code>/<code>delete</code>，这是它与 C 风格 <code>char*</code> 最大的区别。<b>本课一律用 std::string</b>，除非在讲指针。' },

    { t: 'code', lang: 'cpp', caption: 'string 的常用操作', code: `#include <iostream>
#include <string>

int main() {
    std::string s = "Hello";
    s += ", World";                       // 拼接
    std::cout << s.size() << "\\n";        // 12
    std::cout << s.substr(7, 5) << "\\n";  // World
    std::cout << s.find("World") << "\\n"; // 7
    std::cout << s[0] << "\\n";            // H

    s.replace(0, 5, "Goodbye");            // 替换前 5 个字符
    std::cout << s << "\\n";               // Goodbye, World
}` },

    { t: 'p', html: '输入是最容易翻车的地方。<code>cin &gt;&gt; s</code> 以空白为分隔，读不到带空格的整行；<code>getline(cin, line)</code> 读一整行，但它不会跳过上一行留下的换行符，于是常常读到空串。混用 <code>&gt;&gt;</code> 和 <code>getline</code> 时，必须先用 <code>cin.ignore()</code> 清掉残留的 <code>\\n</code>。' },

    { t: 'code', lang: 'cpp', caption: '混用 >> 与 getline 的经典 bug 与修法', code: `#include <iostream>
#include <string>

int main() {
    int age;
    std::string name;

    std::cout << "Age: ";
    std::cin >> age;              // 读走数字，换行符留在缓冲区
    std::cin.ignore();            // 关键：丢掉那个 '\\n'

    std::cout << "Name: ";
    std::getline(std::cin, name); // 现在能读到完整一行

    std::cout << name << " is " << age << "\\n";
}` },

    { t: 'p', html: '要把一行拆成单词，最顺手的工具是 <code>std::istringstream</code>：把字符串包成一个流，再用 <code>&gt;&gt;</code> 逐个取词，天然跳过任意多个空格。这比手写 <code>find</code> + <code>substr</code> 循环短得多，也不容易漏掉边界情况。' },

    { t: 'code', lang: 'cpp', caption: '用 stringstream 切分一行并统计单词数', code: `#include <iostream>
#include <sstream>
#include <string>

int main() {
    std::string line = "  the quick   brown fox  ";
    std::istringstream iss(line);
    std::string word;
    int count = 0;
    while (iss >> word) {
        ++count;
        std::cout << "[" << word << "]\\n";
    }
    std::cout << count << " words\\n";   // 4
}` },

    { t: 'p', html: '流的另一个用途是格式化输出。<code>std::setw</code> 控制宽度、<code>std::setprecision</code> 控制小数位、<code>std::fixed</code> 固定小数点表示。做「对齐的表格输出」时这几行就够了，不需要手写空格。' },

    { t: 'code', lang: 'cpp', caption: '对齐输出一张小表', code: `#include <iomanip>
#include <iostream>

int main() {
    std::cout << std::left << std::setw(12) << "name"
              << std::right << std::setw(8) << "score" << "\\n";
    std::cout << std::left << std::setw(12) << "Alice"
              << std::right << std::setw(8) << std::fixed
              << std::setprecision(1) << 92.5 << "\\n";
}` },

    { t: 'h', lvl: 2, text: '八、把值打印出来：最小调试法', id: 'ch01-8' },

    { t: 'p', html: '初学阶段最有效的调试手段不是断点，而是<b>打印</b>。规则是：怀疑哪个变量，就在它被修改的前后各打印一次，带上变量名和行号。打印要能一眼看出「值在什么时候变成了意外的样子」，而不是淹没在一堆输出里。' },

    { t: 'code', lang: 'cpp', caption: '带标签的调试打印', code: `#include <iostream>

int main() {
    int sum = 0;
    for (int i = 1; i <= 5; ++i) {
        int before = sum;
        sum += i;
        std::cout << "[L" << __LINE__ << "] i=" << i
                  << " sum: " << before << " -> " << sum << "\\n";
    }
}` },

    { t: 'p', html: '调试完记得删掉或注释掉这些打印，或者用 <code>#ifdef DEBUG</code> 包起来。留在正式代码里的调试输出会让程序变慢、输出变脏，评阅时也会扣印象分。更进一步的做法是写一个 <code>assert</code>，把「这里必须成立」的条件写进代码，出错时立刻停下并告诉你哪个文件哪一行。' },

    { t: 'code', lang: 'cpp', caption: '用 assert 表达不变量', code: `#include <cassert>
#include <vector>

double average(const std::vector<int>& v) {
    assert(!v.empty());       // 空数组求平均是调用者的错
    int sum = 0;
    for (int x : v) sum += x;
    return static_cast<double>(sum) / v.size();
}` },

    { t: 'terms', items: [
      { en: 'type', zh: '类型', html: '规定一块内存的大小、编码方式与可用操作的合同；同一串位按不同类型解释会得到不同值。' },
      { en: 'two complement', zh: '补码', html: '负数用「取反加一」表示的编码方式，让加减法共用一套电路；-1 的 32 位表示是全 1。' },
      { en: 'narrowing', zh: '窄化转换', html: '把大范围类型的值转成小范围类型，可能丢失信息；花括号初始化会拒绝它。' },
      { en: 'short-circuit', zh: '短路求值', html: '<code>&amp;&amp;</code> 左边为假、<code>||</code> 左边为真时，右边不再执行。' },
      { en: 'pass by reference', zh: '引用传递', html: '形参是实参的别名，不拷贝；加 const 表示只读，是传递大对象的默认选择。' },
      { en: 'lifetime', zh: '生命周期', html: '一个对象从构造到析构的时间段；离开作用域不等于内存立即被覆盖。' }
    ] },

    { t: 'quiz', qid: 'ch01-q1' },
    { t: 'quiz', qid: 'ch01-q2' },
    { t: 'quiz', qid: 'ch01-q3' },

    { t: 'keypoint', items: [
      { title: '类型 = 大小 + 编码 + 允许的操作', html: 'int 的 32 位里有一位是符号位，所以正数上限是 2^31-1；浮点用 IEEE 754，精度有限。' },
      { title: '初始化优先用花括号', html: '<code>int x{3.9}</code> 会编译报错，而 <code>int x = 3.9</code> 会静默截断；差别就在这一次检查。' },
      { title: '有符号与无符号混用是 bug 工厂', html: '比较和相减前先统一类型；容器下标一律用 size_t 或范围 for。' },
      { title: '参数传递三选一', html: '小类型传值，大对象传 const 引用，需要修改传引用；只有「可能没有」才用指针。' },
      { title: '混用 >> 与 getline 要 ignore', html: '格式化输入把换行留在缓冲区，getline 会立刻读到空串。' }
    ] },

    { t: 'checklist', id: 'ch01', items: [
      '我能说出 int 为什么是 -2147483648 到 2147483647，并解释补码的作用',
      '我知道 0.1 + 0.2 != 0.3 的原因，并能写出正确的浮点比较',
      '我能区分声明、定义、初始化，并指出头文件里该放什么',
      '我能判断 int x{3.9} 与 int x = 3.9 哪个会编译失败',
      '我能解释 i < v.size() 在 v 为空时为什么危险',
      '我能写出 swap 的值传递、指针传递、引用传递三个版本并说明差别',
      '我知道 static 局部变量的生命周期与初始化时机',
      '我能用 getline + istringstream 把一行拆成单词',
      '我遇到意外值时，会先打印带标签的中间结果再改代码'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应课程讲义 Chapter 01（Overview of C++）、Chapter 02（Functions and Libraries）、C03（Strings）与 C04（Streams），并补充了讲义中分散出现的整数与浮点陷阱。示例代码按 g++ -std=c++17 环境验证；类型大小以 x86-64 为准，跨平台时请以 sizeof 输出为准。第 5 节的 swap 三版本参考课程 Tutorial 05 的示例文件。下一章进入地址与内存，本章的「类型 = 大小 + 编码」会直接变成「指针 = 地址 + 类型」。' }
  ]
});
