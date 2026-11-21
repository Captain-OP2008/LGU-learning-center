/* =====================================================================
 * ch07.js · 第 7 章「异常与现代 C++：所有权与移动语义」
 * 依据：讲义 Chapter 12（Dynamic Memory Management）、Chapter 19/20 的析构与
 *       异常安全讨论、Sample_topic_1/2、Project Guidelines。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch07',
  num: '07',
  title: '异常与现代 C++：所有权与移动语义',
  en: 'EXCEPTIONS & MODERN C++',
  goals: [
    '说清 throw、try、catch 的执行流程与栈展开时发生了什么',
    '用 RAII 把资源管理绑在对象生命周期上，写出不泄漏的代码',
    '区分左值与右值，解释 std::move 为什么只是类型转换而不是搬移',
    '用 unique_ptr 与 shared_ptr 表达独占和共享两种所有权',
    '判断一段代码在异常抛出后是否仍然安全，并给出修正方案'
  ],
  kp: [
    { id: 'ch07-1', title: '错误处理的三种方式' },
    { id: 'ch07-2', title: 'try、catch 与栈展开' },
    { id: 'ch07-3', title: 'RAII：让析构函数收尾' },
    { id: 'ch07-4', title: '左值、右值与 std::move' },
    { id: 'ch07-5', title: '移动构造与移动赋值' },
    { id: 'ch07-6', title: '智能指针与所有权' },
    { id: 'ch07-7', title: '标准异常体系与 noexcept' },
    { id: 'ch07-8', title: '现代 C++ 特性全景与工程收尾' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: 'C++ 最大的难点不是语法，是资源', html: '第 2 章你 new 了一块内存，第 3 章你写了析构函数去 delete 它。但真实代码里 new 和 delete 之间可能隔着 20 行、3 个函数调用、2 个提前 return——任何一处出问题，那块内存就泄漏了。异常让这个问题变得更尖锐：抛异常会直接从中间跳走，后面的 delete 根本执行不到。<b>这一章讲的就是 C++ 的答案：把资源和对象的生命周期绑在一起（RAII），把拷贝换成移动，把裸指针换成智能指针。</b>学会这些，你才算真正会写 C++。' },

    { t: 'p', lead: true, html: '这一章的内容在语言层面看起来分散：异常、析构、移动语义、智能指针。但它们其实回答同一个问题——<b>谁拥有这块资源，什么时候释放</b>。掌握这条主线，C++ 里那些「看起来很奇怪」的规定就都顺了：为什么析构函数要虚，为什么拷贝构造要写 const 引用，为什么 <code>std::move</code> 之后原对象不该再用。' },

    { t: 'h', lvl: 2, text: '一、错误处理的三种方式', id: 'ch07-1' },

    { t: 'p', html: '函数出错了怎么告诉调用者？三种办法。第一种<b>返回错误码</b>：<code>int read_file(...)</code> 返回 0 表示成功、-1 表示失败。问题是调用者容易忘记检查，而且返回值只有一个，错误信息只能挤在全局变量或输出参数里。第二种<b>抛异常</b>：出错时 <code>throw</code> 一个对象，正常路径不受干扰，错误会一路往上传播直到被 <code>catch</code>。第三种<b>终止程序</b>：<code>assert</code> 或 <code>abort</code>，只适合「不可能发生、发生了就是程序 bug」的情况。' },

    { t: 'table', head: ['方式', '典型写法', '优点', '缺点'], rows: [
      ['错误码', '<code>if (read(f) &lt; 0) ...</code>', '无额外开销，可预测', '容易忘记检查；无法携带丰富信息'],
      ['异常', '<code>throw std::runtime_error("...")</code>', '正常路径干净；错误无法被忽略', '有栈展开开销；要小心异常安全'],
      ['断言/终止', '<code>assert(p != nullptr)</code>', '立刻暴露 bug', '不能用于可恢复的错误'],
      ['<code>std::optional</code>', '<code>optional&lt;int&gt; f()</code>', '表达「可能没有值」很清楚', '不携带错误原因'],
      ['<code>std::expected</code>（C++23）', '<code>expected&lt;T, E&gt; f()</code>', '值或错误二选一', '较新，编译器支持有限']
    ], caption: '原则：可恢复的错误用异常或 optional，程序 bug 用 assert，不要用异常做流程控制' },

    { t: 'p', html: '课程和作业里最常见的组合是：<b>底层用异常报错，上层统一捕获并打印</b>。比如一个解析器，遇到非法输入就 <code>throw std::runtime_error("unexpected token at line 7")</code>，<code>main</code> 里包一层 <code>try</code>，捕获后打印错误并返回非零退出码。这样错误信息带上下文，调用栈不用层层传返回值。' },

    { t: 'h', lvl: 2, text: '二、try、catch 与栈展开', id: 'ch07-2' },

    { t: 'p', html: '<code>throw</code> 一旦执行，当前函数立刻停止，控制权交给最近的、能匹配异常类型的 <code>catch</code>。<b>中间的每一层函数都不会继续执行，但它们的局部对象会被正常析构</b>——这个过程叫栈展开（stack unwinding）。这正是异常能安全释放资源的基础：只要资源由对象持有，析构函数就会被调用。' },

    { t: 'code', lang: 'cpp', caption: '异常的抛出、传播与捕获', code: `#include <iostream>
#include <stdexcept>
#include <string>

int parse_age(const std::string& s) {
    int value = std::stoi(s);              // 非法输入会抛 invalid_argument
    if (value < 0 || value > 150) {
        throw std::out_of_range("age out of range: " + s);
    }
    return value;
}

int main() {
    try {
        std::cout << parse_age("20") << "\\n";     // 20
        std::cout << parse_age("-3") << "\\n";     // 抛出
        std::cout << "never printed\\n";
    } catch (const std::out_of_range& e) {
        std::cout << "range error: " << e.what() << "\\n";
    } catch (const std::exception& e) {
        std::cout << "other error: " << e.what() << "\\n";
    }
}` },

    { t: 'p', html: '几个必须记的细节：<b>①</b> <code>catch</code> 按书写顺序匹配，派生类要写在基类前面，否则永远匹配不到；<b>②</b> 用 <code>const&amp;</code> 捕获，避免拷贝并防止切片；<b>③</b> <code>throw;</code>（不带表达式）在 catch 块内表示「重新抛出当前异常」，用于记录日志后继续向上传；<b>④</b> 异常没被任何 catch 接住时，程序调用 <code>std::terminate</code> 直接终止，不会返回值。' },

    { t: 'p', html: '另一个常见错误是<b>在析构函数里抛异常</b>。如果栈展开过程中又有析构函数抛异常，两个异常同时存在，程序直接 <code>terminate</code>。所以析构函数要么不抛，要么自己吞掉（<code>try { ... } catch (...) { }</code>）。这也是标准库容器析构时必须保证不抛的原因。' },

    { t: 'h', lvl: 2, text: '三、RAII：让析构函数收尾', id: 'ch07-3' },

    { t: 'p', html: 'RAII（Resource Acquisition Is Initialization）是 C++ 最重要的惯用法：<b>构造时获取资源，析构时释放资源</b>。因为局部对象在离开作用域时一定会析构——无论是正常返回、提前 return，还是异常展开——资源就一定会被释放。你不需要在每个出口手写 cleanup。' },

    { t: 'code', lang: 'cpp', caption: '手写 new/delete 的三种泄漏路径', code: `#include <iostream>

void bad() {
    int* p = new int[100];

    if (some_condition()) return;        // 泄漏 1：提前返回

    if (another_condition()) {
        throw std::runtime_error("oops"); // 泄漏 2：异常展开
    }

    delete[] p;                           // 只有正常路径才会执行
}

void good() {
    std::vector<int> v(100);              // 内存由 vector 持有
    if (some_condition()) return;         // 自动释放
    if (another_condition()) throw std::runtime_error("oops");  // 自动释放
}` },

    { t: 'p', html: '对比这两段代码：<code>bad()</code> 有两条泄漏路径，而且随着代码变长会越来越多；<code>good()</code> 一条都没有，因为它根本不管理内存——<code>vector</code> 的析构函数负责 <code>delete[]</code>。这就是 RAII 的威力：<b>把「记得释放」从人的责任变成编译器保证的事实</b>。' },

    { t: 'p', html: 'RAII 不只用于内存。文件（<code>std::ifstream</code> 析构时关闭）、互斥锁（<code>std::lock_guard</code> 析构时解锁）、数据库连接、网络 socket，全都遵循这个模式。看到「成对的 acquire/release」，就该想到用一个对象包起来。C++ 里没有 <code>finally</code>，因为 RAII 已经覆盖了它的用途。' },

    { t: 'compare', left: { title: 'Java / Python 的 finally', html: '显式写一段「无论如何都执行」的代码，靠语言保证执行顺序；忘记写就泄漏。' }, right: { title: 'C++ 的 RAII', html: '不写清理代码，让对象的析构函数承担；作用域结束自动触发，异常路径也覆盖。' } },

    { t: 'h', lvl: 2, text: '四、左值、右值与 std::move', id: 'ch07-4' },

    { t: 'p', html: '要理解移动，先分清左值和右值。<b>左值</b>是有名字、有确定地址的表达式，比如变量 <code>a</code>、<code>v[0]</code>、<code>*p</code>；<b>右值</b>是临时的、马上要销毁的，比如 <code>1 + 2</code>、<code>std::string("hi")</code>、函数返回的临时对象。粗略记法：能取地址（<code>&amp;x</code> 合法）的是左值。' },

    { t: 'code', lang: 'cpp', caption: '左值引用与右值引用', code: `#include <iostream>
#include <string>
#include <utility>

void take_lref(int& x)  { std::cout << "lvalue ref\\n"; }
void take_rref(int&& x) { std::cout << "rvalue ref\\n"; }

int main() {
    int a = 10;
    take_lref(a);            // lvalue ref
    take_rref(20);           // rvalue ref

    // take_lref(20);        // 编译错误：右值不能绑到非 const 左值引用
    // take_rref(a);         // 编译错误：a 是左值

    int&& r = std::move(a);  // move 只是把 a 转成右值引用
    std::cout << a << " " << r << "\\n";   // 10 10，a 的值还在
}` },

    { t: 'p', html: '关键在于最后两行：<code>std::move(a)</code> <b>没有搬走任何东西</b>，它只是一个 <code>static_cast&lt;T&amp;&amp;&gt;</code>，把左值标记成「可以被搬走」。真正搬移发生在移动构造或移动赋值里——而标准库的 <code>int</code>、<code>double</code> 这种平凡类型根本没有移动，拷贝和移动一样快。所以 <code>std::move</code> 对内置类型毫无意义，对 <code>std::string</code>、<code>vector</code> 这种持有堆内存的类型才有价值。' },

    { t: 'p', html: '还有一个反直觉的点：<b>被 move 之后的对象仍然有效，但值未指定</b>。你可以给它赋值、可以析构，但不该读它的内容。常见错误是 <code>v2 = std::move(v1);</code> 之后又去 <code>v1.size()</code>——这在标准里是合法的（返回某个合法值），但业务上毫无意义，属于逻辑 bug。' },

    { t: 'h', lvl: 2, text: '五、移动构造与移动赋值', id: 'ch07-5' },

    { t: 'p', html: '移动构造的参数是 <code>T&amp;&amp;</code>，它的任务是「把对方的资源偷过来，再把对方置成空状态」。对 <code>IntVector</code> 来说，就是接管 <code>data_</code> 指针，然后把对方的指针设为 <code>nullptr</code>、<code>size_</code> 设为 0——这样对方析构时 delete 一个空指针，安全。' },

    { t: 'code', lang: 'cpp', caption: 'IntVector 的移动构造与移动赋值', code: `#include <utility>

class IntVector {
public:
    IntVector(IntVector&& other) noexcept
        : data_(other.data_), size_(other.size_) {
        other.data_ = nullptr;
        other.size_ = 0;
    }

    IntVector& operator=(IntVector&& other) noexcept {
        if (this != &other) {
            delete[] data_;             // 释放自己原有的
            data_ = other.data_;        // 接管对方的
            size_ = other.size_;
            other.data_ = nullptr;
            other.size_ = 0;
        }
        return *this;
    }

private:
    int* data_ = nullptr;
    int  size_ = 0;
};` },

    { t: 'p', html: '两个细节不能省。<b>一是 <code>noexcept</code></b>：标准库容器在扩容时，只有当移动构造声明为不抛异常，才会用移动而不是拷贝——因为移动到一半抛异常无法回滚，而拷贝可以。漏写 <code>noexcept</code>，你的 <code>vector&lt;IntVector&gt;</code> 就会退化成深拷贝，性能掉一个数量级。<b>二是防自赋值</b>：<code>v = std::move(v)</code> 虽然少见，但一旦发生，先 delete 再接管就是自己删自己。' },

    { t: 'p', html: '这带来了「Rule of Five」：如果你需要自定义析构、拷贝构造、拷贝赋值中的任何一个，通常五个都要考虑（加移动构造、移动赋值）。反面是 Rule of Zero：<b>如果类里不直接持有资源，就一个都别写</b>，让编译器生成的版本正确工作。现代 C++ 推崇 Rule of Zero——用 <code>vector</code>、<code>string</code>、<code>unique_ptr</code> 做成员，你就永远不用手写这五个函数。' },

    { t: 'table', head: ['写法', '需要手写几个特殊成员', '什么时候用'], rows: [
      ['Rule of Three', '析构 + 拷贝构造 + 拷贝赋值', '自己管理裸资源（课程作业里常要求）'],
      ['Rule of Five', '三件套 + 移动构造 + 移动赋值', '同上，且希望支持高效移动'],
      ['Rule of Zero', '一个都不写', '成员都是 RAII 类型（推荐）'],
      ['<code>= default</code>', '显式要求编译器生成', '想保留默认行为但控制可见性'],
      ['<code>= delete</code>', '显式禁用', '禁止拷贝（如文件句柄、锁）']
    ], caption: '先问「我有没有直接持有资源」；没有就走 Rule of Zero' },

    { t: 'h', lvl: 2, text: '六、智能指针与所有权', id: 'ch07-6' },

    { t: 'p', html: '裸指针的问题是无法表达「谁负责 delete」。<code>unique_ptr</code> 表达<b>独占所有权</b>：同一时刻只有一个 <code>unique_ptr</code> 拥有对象，不能拷贝、只能移动，离开作用域自动 delete。<code>shared_ptr</code> 表达<b>共享所有权</b>：内部有引用计数，最后一个持有者析构时才 delete。<code>weak_ptr</code> 不增加计数，用来打破循环引用。' },

    { t: 'code', lang: 'cpp', caption: '三种智能指针的典型用法', code: `#include <iostream>
#include <memory>
#include <vector>

struct Node { int value; };

int main() {
    auto p = std::make_unique<Node>(Node{42});
    std::cout << p->value << "\\n";              // 42

    // auto q = p;                               // 错误：unique_ptr 不能拷贝
    auto q = std::move(p);                       // 只能移动，p 变成 nullptr
    if (!p) std::cout << "p is empty\\n";

    auto s1 = std::make_shared<Node>(Node{7});
    auto s2 = s1;                                // 共享：计数为 2
    std::cout << s1.use_count() << "\\n";        // 2

    std::vector<std::unique_ptr<Node>> nodes;
    nodes.push_back(std::make_unique<Node>(Node{1}));
    nodes.push_back(std::make_unique<Node>(Node{2}));
}` },

    { t: 'p', html: '为什么优先 <code>make_unique</code> / <code>make_shared</code> 而不是 <code>new</code>？三个理由：<b>①</b> 少写类型名，<code>auto</code> 就能推导；<b>②</b> 异常安全，<code>f(unique_ptr&lt;T&gt;(new T), g())</code> 里两个参数的求值顺序不确定，<code>g()</code> 抛异常时 <code>new</code> 出来的对象会泄漏，而 <code>make_unique</code> 把分配和接管合成一步；<b>③</b> <code>make_shared</code> 把对象和控制块分配在同一块内存，少一次分配。' },

    { t: 'p', html: '<code>shared_ptr</code> 的循环引用是经典陷阱：A 持有 <code>shared_ptr&lt;B&gt;</code>，B 持有 <code>shared_ptr&lt;A&gt;</code>，两个计数都降到 1，永远不释放。解决办法是把其中一边改成 <code>weak_ptr</code>，用的时候 <code>lock()</code> 提升成 <code>shared_ptr</code> 并检查是否为空。另外，<b>不要用同一个裸指针构造两个 shared_ptr</b>，那会得到两个独立控制块，双重 delete。' },

    { t: 'h', lvl: 2, text: '七、标准异常体系与 noexcept', id: 'ch07-7' },

    { t: 'p', html: '标准库的异常都继承自 <code>std::exception</code>，它只有一个虚函数 <code>what()</code> 返回错误描述。常用的几个：<code>logic_error</code>（程序逻辑错误，可预防）、<code>runtime_error</code>（运行期才可能发现）、<code>invalid_argument</code>、<code>out_of_range</code>、<code>bad_alloc</code>（<code>new</code> 失败）。自定义异常通常继承 <code>std::runtime_error</code>，省去自己写 <code>what()</code>。' },

    { t: 'table', head: ['异常类型', '谁抛出', '何时捕获'], rows: [
      ['<code>std::invalid_argument</code>', '<code>std::stoi</code>、<code>stod</code>', '输入格式不合法'],
      ['<code>std::out_of_range</code>', '<code>std::stoi</code>、<code>vector::at</code>、<code>map::at</code>', '下标/数值越界'],
      ['<code>std::bad_alloc</code>', '<code>new</code>、容器扩容', '内存不足'],
      ['<code>std::runtime_error</code>', '你的代码或库', '运行期可恢复错误'],
      ['<code>std::logic_error</code>', '你的代码', '调用者用错了接口']
    ], caption: '捕获顺序：派生类在前，<code>std::exception</code> 兜底在后' },

    { t: 'p', html: '<code>noexcept</code> 是「我承诺不抛异常」的标注。它有两个作用：<b>①</b> 帮助编译器优化（不需要生成栈展开代码）；<b>②</b> 影响标准库的行为（移动构造有 <code>noexcept</code> 才会被 <code>vector</code> 采用）。如果标了 <code>noexcept</code> 却真的抛了，程序直接 <code>terminate</code>，没有商量余地。<b>析构函数、移动构造、移动赋值、swap 都应该标 <code>noexcept</code></b>。' },

    { t: 'p', html: '什么时候不该用异常？两类场景：<b>①</b> 性能极度敏感的代码路径（异常路径本身不慢，但会阻止某些优化，且增加二进制体积）；<b>②</b> 编译时就想拦住的问题——那是 <code>static_assert</code> 的活。游戏引擎、嵌入式常禁用异常，改用错误码 + <code>optional</code>。这是工程取舍，不是语言优劣。' },

    { t: 'h', lvl: 2, text: '八、现代 C++ 特性全景与工程收尾', id: 'ch07-8' },

    { t: 'p', html: 'C++11 之后的语言变化，大部分是为了「让正确的东西写起来更短」。把本课程用到的特性串一遍，你就有了完整的工具箱。' },

    { t: 'table', head: ['特性', '解决什么', '典型写法'], rows: [
      ['<code>auto</code>', '类型名太长', '<code>auto it = m.find(k);</code>'],
      ['范围 for', '遍历样板代码', '<code>for (const auto&amp; x : v)</code>'],
      ['<code>nullptr</code>', '<code>NULL</code> 与 0 混淆', '<code>int* p = nullptr;</code>'],
      ['<code>override</code> / <code>final</code>', '虚函数签名写错不报错', '<code>void draw() override;</code>'],
      ['<code>= default</code> / <code>= delete</code>', '控制特殊成员', '<code>Counter(const Counter&amp;) = delete;</code>'],
      ['结构化绑定', '拆 pair/tuple 麻烦', '<code>for (auto&amp; [k, v] : m)</code>'],
      ['<code>constexpr</code>', '编译期算常量', '<code>constexpr int N = 100;</code>'],
      ['<code>std::optional</code>', '表达「可能没有值」', '<code>optional&lt;int&gt; f();</code>'],
      ['移动语义', '避免大对象深拷贝', '<code>v2 = std::move(v1);</code>'],
      ['<code>unique_ptr</code>', '裸指针所有权不清', '<code>auto p = make_unique&lt;T&gt;();</code>']
    ], caption: '不必一次全用；知道每个特性解决什么问题，遇到场景再查' },

    { t: 'p', html: '最后做一个综合练习：写一个 <code>FileReader</code> 类，构造时打开文件、失败抛异常，析构时自动关闭，禁止拷贝、允许移动，读取时用 <code>std::string</code> 和 <code>getline</code>。这个类把本章所有东西都用上了：RAII、异常、<code>= delete</code>、移动、<code>noexcept</code>。' },

    { t: 'code', lang: 'cpp', caption: 'RAII + 异常 + 禁止拷贝 + 允许移动的完整类', code: `#include <fstream>
#include <stdexcept>
#include <string>
#include <utility>

class FileReader {
public:
    explicit FileReader(const std::string& path)
        : in_(path) {
        if (!in_) throw std::runtime_error("cannot open: " + path);
    }

    ~FileReader() = default;                       // ifstream 自己关文件

    FileReader(const FileReader&) = delete;        // 文件句柄不该被复制
    FileReader& operator=(const FileReader&) = delete;

    FileReader(FileReader&&) noexcept = default;   // 允许移动
    FileReader& operator=(FileReader&&) noexcept = default;

    std::string next_line() {
        std::string line;
        if (!std::getline(in_, line)) return {};
        return line;
    }

private:
    std::ifstream in_;
};

int main() {
    try {
        FileReader r("data.txt");
        std::string line;
        while (!(line = r.next_line()).empty()) {
            // 处理每一行
        }
    } catch (const std::exception& e) {
        return 1;                                  // 资源已由析构函数释放
    }
}` },

    { t: 'p', html: '注意 <code>~FileReader() = default;</code>：<code>ifstream</code> 的析构函数会关闭文件，所以这里什么都不用写——这正是 Rule of Zero 的体现。整个类没有一处 <code>delete</code>，也没有一处 <code>close()</code>，但任何路径下文件都会正确关闭。<b>写到这个程度，你的 C++ 就从「能跑」进入了「工程」</b>。' },

    { t: 'callout', kind: 'ai', title: '让 AI 帮你审查资源管理', html: '把类定义贴给 AI，问三个问题：<b>①</b> 这个类有没有直接持有需要手动释放的资源？<b>②</b> 如果它的成员函数在中间抛异常，有没有泄漏？<b>③</b> 拷贝/移动语义是否符合所有权意图（该禁的禁了没有）？这三个问题能揪出大部分资源 bug。但要注意：AI 常把 <code>std::move</code> 说成「搬移数据」，这是错的；也常漏掉移动构造的 <code>noexcept</code>。关键结论要回到标准（cppreference）核对。' },

    { t: 'terms', items: [
      { en: 'RAII', zh: '资源获取即初始化', html: '构造获取资源、析构释放资源；靠作用域保证释放，异常路径也覆盖。' },
      { en: 'stack unwinding', zh: '栈展开', html: '异常传播时逐层退出函数，并析构沿途的局部对象。' },
      { en: 'lvalue / rvalue', zh: '左值 / 右值', html: '有名字可取地址的是左值；临时对象是右值。右值引用写作 <code>T&amp;&amp;</code>。' },
      { en: 'move semantics', zh: '移动语义', html: '接管对方的资源并置空对方，避免深拷贝；<code>std::move</code> 只是类型转换。' },
      { en: 'smart pointer', zh: '智能指针', html: '<code>unique_ptr</code> 独占、<code>shared_ptr</code> 共享（引用计数）、<code>weak_ptr</code> 弱引用。' },
      { en: 'noexcept', zh: '不抛异常承诺', html: '标注后编译器可优化；违反承诺会 <code>terminate</code>。移动构造必须标。' }
    ] },

    { t: 'quiz', qid: 'ch07-q1' },
    { t: 'quiz', qid: 'ch07-q2' },
    { t: 'quiz', qid: 'ch07-q3' },

    { t: 'keypoint', items: [
      { title: '异常的代价是栈展开，收益是不可忽略', html: '正常路径零开销；只有抛出时才付展开成本。别用异常做流程控制。' },
      { title: 'RAII 是 C++ 的资源管理基石', html: '资源由对象持有，析构自动释放，覆盖提前 return 与异常两条路径。' },
      { title: 'std::move 不搬东西', html: '它只把左值转成右值引用；真正的搬移在移动构造/赋值里发生。' },
      { title: '唯一指针默认选择，共享指针谨慎使用', html: '<code>unique_ptr</code> 零开销、语义清晰；<code>shared_ptr</code> 有计数成本，还要防循环引用。' },
      { title: 'Rule of Zero 优先', html: '成员都用 RAII 类型，就一个特殊成员函数都不用写——正确且最短。' }
    ] },

    { t: 'checklist', id: 'ch07', items: [
      '我能写出带 try/catch 的代码，并说明 catch 的匹配顺序为什么重要',
      '我知道栈展开会析构局部对象，并能解释它在资源管理中的作用',
      '我能举出三种 new/delete 泄漏路径，并用 RAII 改掉它们',
      '我能解释 std::move 做了什么、没做什么，以及 move 之后原对象的状态',
      '我知道移动构造为什么必须标 noexcept，不标会有什么后果',
      '我能区分 unique_ptr 与 shared_ptr 的所有权语义，并说明何时用哪个',
      '我知道 shared_ptr 循环引用怎么形成、怎么用 weak_ptr 打破',
      '我能说出 noexcept 的两个作用，以及违反承诺的后果',
      '我能用 Rule of Zero 写出一个不需要手写析构函数的资源管理类'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应讲义 Chapter 12（Dynamic Memory Management）的内存管理部分，异常安全与析构顺序结合 Chapter 19 的继承讨论；所有权与移动语义参考课程 Sample_topic_1 / Sample_topic_2 的命题风格，综合案例按 Project Guidelines 的评分点（正确性、资源管理、代码组织）设计。<code>std::expected</code>、协程、concepts 的完整用法超出本课程范围，只在表格中作为扩展提及。至此八章走完：从类型到内存，从类到继承，从模板到 STL，最后落在资源与所有权上——这条线就是 CSC3002 的完整骨架。' }
  ]
});
