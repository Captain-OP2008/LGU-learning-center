/* =====================================================================
 * ch05.js · 第 5 章「模板与泛型：写一次，适配所有类型」
 * 依据：讲义 Chapter 05（Collections，泛型容器部分）、Chapter 16（Trees，模板节点）、
 *       Chapter 17（Sets，模板实现），以及讲义里 vector / map 的教学库实现。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch05',
  num: '05',
  title: '模板与泛型：写一次，适配所有类型',
  en: 'TEMPLATES & GENERICS',
  goals: [
    '把三个只有类型不同的函数合并成一个函数模板，并说清编译器做了什么',
    '写出一个能存任意类型的类模板，并解释为什么成员函数定义要放在头文件',
    '区分类型参数与非类型参数，给模板加默认参数',
    '用 static_assert 或类型特征给模板加约束，让错误在调用点暴露',
    '解释模板与 STL 的关系：为什么 vector、map、sort 都是模板'
  ],
  kp: [
    { id: 'ch05-1', title: '从重复代码到函数模板' },
    { id: 'ch05-2', title: '模板参数推导与显式指定' },
    { id: 'ch05-3', title: '类模板：Stack&lt;T&gt;' },
    { id: 'ch05-4', title: '为什么模板要在头文件里' },
    { id: 'ch05-5', title: '非类型参数与默认参数' },
    { id: 'ch05-6', title: '特化与重载' },
    { id: 'ch05-7', title: '约束：static_assert 与类型特征' },
    { id: 'ch05-8', title: '模板怎样支撑起 STL' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '模板是「编译期填空」', html: '你在第 3 章写过 <code>IntVector</code>，如果现在要一个存 <code>string</code> 的版本，只能把整个类复制一遍，把 <code>int</code> 改成 <code>std::string</code>。再来一个 <code>double</code> 版本？再复制。三份代码逻辑一样，却要维护三次，改一个 bug 要改三处。模板把「类型」变成参数：<b>写一次，编译器按你用的类型各生成一份</b>。标准库的 <code>vector</code>、<code>map</code>、<code>sort</code> 全是这么来的。' },

    { t: 'p', lead: true, html: '模板不是运行期机制，它发生在<b>编译期</b>。你写 <code>template &lt;typename T&gt; T max(T a, T b)</code>，编译器不会生成任何代码；直到你写 <code>max(3, 5)</code>，它才用 <code>T = int</code> 把函数体「填」一遍，生成一个真实的函数。这个过程叫<b>实例化</b>。理解这一点，后面所有「为什么模板报错这么长」「为什么模板要放头文件」都有了答案。' },

    { t: 'h', lvl: 2, text: '一、从重复代码到函数模板', id: 'ch05-1' },

    { t: 'p', html: '先看没有模板时的重复。三个函数做同一件事：返回值较大的那个。除了类型，一字不差。这种重复不只是打字累，更麻烦的是<b>修 bug 要修三遍</b>，而人总会漏。' },

    { t: 'code', lang: 'cpp', caption: '三份只差类型的代码', code: `int max_int(int a, int b)       { return a > b ? a : b; }
double max_double(double a, double b) { return a > b ? a : b; }
std::string max_str(const std::string& a, const std::string& b) {
    return a > b ? a : b;
}` },

    { t: 'p', html: '把类型抽出来，就得到函数模板。语法是 <code>template &lt;typename T&gt;</code> 加在函数前面，函数里凡是原来写类型的地方都换成 <code>T</code>。调用时你不需要写 <code>&lt;int&gt;</code>，编译器从实参推导。' },

    { t: 'code', lang: 'cpp', caption: '一个函数模板顶三个函数', code: `#include <iostream>
#include <string>

template <typename T>
T max_of(T a, T b) {
    return a > b ? a : b;
}

int main() {
    std::cout << max_of(3, 5) << "\\n";                       // T = int
    std::cout << max_of(2.5, 1.5) << "\\n";                   // T = double
    std::cout << max_of<std::string>("apple", "pear") << "\\n"; // 显式指定
}` },

    { t: 'p', html: '模板本身不是函数，是「生成函数的图纸」。上面三次调用会让编译器实例化出三个不同的函数，它们各有自己的机器码。所以模板不会增加运行期开销，但可能增加编译时间和二进制体积——用十种类型调同一个模板，就有十份代码。' },

    { t: 'compare', left: { title: '运行期多态（第 4 章）', html: '虚函数 + 基类指针，运行时查表决定调哪个实现。一份代码处理所有类型，但有间接调用开销，且要求类型有共同基类。' }, right: { title: '编译期多态（本章）', html: '模板按类型生成多份特化代码，调用是直接调用，可内联、无开销。代价是代码膨胀，且类型不需要有共同基类——只要有相同的操作即可。' } },

    { t: 'h', lvl: 2, text: '二、模板参数推导与显式指定', id: 'ch05-2' },

    { t: 'p', html: '编译器从实参推导 <code>T</code> 时，会做几件事：去掉引用、去掉顶层 const、数组退化成指针、函数退化成函数指针。所以 <code>max_of(3, 5)</code> 里 <code>T</code> 是 <code>int</code> 而不是 <code>const int&amp;</code>。这个规则叫<b>模板实参推导</b>，它决定了你写的模板能不能被调用。' },

    { t: 'code', lang: 'cpp', caption: '推导失败与二义性的典型场景', code: `template <typename T>
T max_of(T a, T b) { return a > b ? a : b; }

int main() {
    // max_of(3, 4.5);        // 错误：T 同时被推成 int 和 double
    max_of<double>(3, 4.5);   // 正确：显式指定，int 转 double

    int x = 1; const int y = 2;
    max_of(x, y);              // T = int，顶层 const 被去掉
}` },

    { t: 'p', html: '当两个实参推导出的类型不一致时，编译器不会帮你选「更大的那个」，而是直接报错。解决方式有两种：显式指定 <code>&lt;double&gt;</code>，或者把模板写成两个类型参数 <code>template &lt;typename T, typename U&gt;</code> 并自己决定返回类型。后者更灵活，但要想清楚 <code>3</code> 和 <code>4.5</code> 比较时该按什么类型比。' },

    { t: 'p', html: '显式指定还有一个常见用途：<b>强制某个参数走特定重载</b>。<code>max_of&lt;std::string&gt;("apple", "pear")</code> 里两个实参是 <code>const char*</code>，不加显式参数的话，<code>T</code> 会被推成 <code>const char*</code>，比较的是<b>指针地址</b>而不是字符串内容，结果完全错误。这是模板最阴险的坑之一。' },

    { t: 'callout', kind: 'warn', title: '指针比较 vs 内容比较', html: '<code>max_of("apple", "pear")</code> 编译通过、运行不崩，但返回哪个字符串取决于两个字面量在内存里的地址。类似地，<code>std::max</code> 对 <code>char*</code> 也会做指针比较。规则：<b>传给模板的字符串要么是 <code>std::string</code>，要么显式指定类型</b>，不要让 <code>const char*</code> 悄悄进来。' },

    { t: 'h', lvl: 2, text: '三、类模板：Stack&lt;T&gt;', id: 'ch05-3' },

    { t: 'p', html: '函数模板把类型参数化，类模板也一样：整个类里凡是出现具体类型的地方都用 <code>T</code>。这样一份实现能生成 <code>Stack&lt;int&gt;</code>、<code>Stack&lt;string&gt;</code>、<code>Stack&lt;Student&gt;</code>……每个都是独立的类型，互不兼容。' },

    { t: 'code', lang: 'cpp', caption: '一个完整的类模板', code: `#include <cassert>
#include <vector>

template <typename T>
class Stack {
public:
    void push(const T& v) { data_.push_back(v); }
    void pop()            { assert(!data_.empty()); data_.pop_back(); }
    const T& top() const  { assert(!data_.empty()); return data_.back(); }
    bool empty() const    { return data_.empty(); }
    int  size() const     { return static_cast<int>(data_.size()); }

private:
    std::vector<T> data_;
};

int main() {
    Stack<int> si;
    si.push(1); si.push(2);
    Stack<std::string> ss;
    ss.push("hi");

    // si = ss;              // 错误：Stack<int> 与 Stack<string> 是不同类型
}` },

    { t: 'p', html: '注意 <code>Stack&lt;int&gt;</code> 与 <code>Stack&lt;string&gt;</code> 之间没有任何转换关系，哪怕它们的成员函数长得一样。这与第 4 章的继承不同：模板生成的是<b>互不相关的独立类型</b>，不是父子类。所以不能把 <code>Stack&lt;int&gt;</code> 赋给 <code>Stack&lt;double&gt;</code>，也不能把 <code>Stack&lt;Derived&gt;</code> 传给需要 <code>Stack&lt;Base&gt;</code> 的函数。' },

    { t: 'p', html: '类模板的成员函数可以在类内定义（如上），也可以在类外定义，但类外定义要写两遍模板参数：<code>template &lt;typename T&gt; void Stack&lt;T&gt;::push(const T&amp; v) { ... }</code>。漏掉 <code>template &lt;typename T&gt;</code> 或漏掉 <code>&lt;T&gt;</code> 都是常见的编译错误。' },

    { t: 'h', lvl: 2, text: '四、为什么模板要在头文件里', id: 'ch05-4' },

    { t: 'p', html: '第 3 章说「头文件放声明、.cpp 放实现」。这条规则对模板<b>不成立</b>。原因是：编译器在实例化 <code>Stack&lt;int&gt;</code> 时必须看到成员函数的<b>完整定义</b>，否则生成不出代码。如果定义在 .cpp 里，另一个 .cpp 只 include 了头文件，链接时就会报 <code>undefined reference</code>。' },

    { t: 'code', lang: 'cpp', caption: '模板的常见组织方式：声明与定义都放 .h', code: `// Stack.h
#pragma once
#include <vector>

template <typename T>
class Stack {
public:
    void push(const T& v);
    const T& top() const;
private:
    std::vector<T> data_;
};

// 定义也必须在头文件里
template <typename T>
void Stack<T>::push(const T& v) { data_.push_back(v); }

template <typename T>
const T& Stack<T>::top() const { return data_.back(); }` },

    { t: 'p', html: '如果确实想把实现藏起来，有两种办法：<b>①</b> 在 .cpp 末尾显式实例化 <code>template class Stack&lt;int&gt;;</code>，只支持已知的几种类型；<b>②</b> 用 <code>extern template</code> 声明，把实例化集中到一个编译单元。这两种都属于工程优化，本课的项目规模不需要，但要知道「模板报链接错误」时该往哪个方向查。' },

    { t: 'table', head: ['现象', '原因', '修法'], rows: [
      ['<code>undefined reference to Stack&lt;int&gt;::push</code>', '定义在 .cpp 里，另一个翻译单元看不到', '把定义移到头文件'],
      ['模板代码改一行，全项目重编', '所有包含头文件的单元都要重新实例化', '用显式实例化 + extern template'],
      ['报错指向模板库内部', '错误发生在实例化时，真正的调用点在上面', '看报错里第一个提到你代码的行'],
      ['同一个模板在两个 .cpp 各实例化一次', '链接器通常能合并，但可能重复', '显式实例化或加 inline']
    ], caption: '模板的编译模型与普通函数不同，出错信息也更长' },

    { t: 'h', lvl: 2, text: '五、非类型参数与默认参数', id: 'ch05-5' },

    { t: 'p', html: '模板参数不一定是类型，也可以是<b>编译期常量</b>：整数、枚举、指针、引用。<code>template &lt;typename T, int N&gt; class Array</code> 里的 <code>N</code> 就是非类型参数，用来在编译期固定大小。标准库的 <code>std::array&lt;int, 5&gt;</code> 就是这样，大小成为类型的一部分。' },

    { t: 'code', lang: 'cpp', caption: '非类型参数：大小写进类型里', code: `#include <iostream>

template <typename T, int N>
class FixedArray {
public:
    T& operator[](int i)             { return data_[i]; }
    const T& operator[](int i) const { return data_[i]; }
    int size() const                 { return N; }

private:
    T data_[N];                      // N 必须是编译期常量
};

int main() {
    FixedArray<int, 5> a;
    for (int i = 0; i < a.size(); ++i) a[i] = i * i;
    std::cout << a[4] << "\\n";       // 16

    // int n = 5; FixedArray<int, n> b;   // 错误：n 不是常量表达式
}` },

    { t: 'p', html: '非类型参数必须是编译期可求值的东西：字面量、<code>constexpr</code> 变量、<code>sizeof</code> 的结果。用普通变量会编译失败。它的好处是把大小检查提前到编译期，坏处是每个不同大小都生成一个新类型，<code>FixedArray&lt;int, 5&gt;</code> 和 <code>FixedArray&lt;int, 6&gt;</code> 完全无关。' },

    { t: 'p', html: '模板参数还可以有默认值：<code>template &lt;typename T, typename Cmp = std::less&lt;T&gt;&gt; class SortedList</code>，调用时只写 <code>SortedList&lt;int&gt;</code> 就用默认比较器。标准库大量使用默认参数，比如 <code>std::map&lt;Key, Value, Compare = std::less&lt;Key&gt;, Allocator = ...&gt;</code>，所以平时你只写两个参数就够了。' },

    { t: 'p', html: '还有一种常见组合：<b>模板模板参数</b>，让参数本身是一个模板。<code>template &lt;typename T, template &lt;typename&gt; class Container&gt; class Adapter</code> 可以让调用者选择用 <code>vector</code> 还是 <code>list</code> 作为底层容器。这个概念在标准库的 <code>stack</code>、<code>queue</code> 适配器里用到，本课只需能读懂。' },

    { t: 'h', lvl: 2, text: '六、特化与重载', id: 'ch05-6' },

    { t: 'p', html: '有时某个类型需要特殊处理。<code>max_of</code> 对 <code>const char*</code> 应该比较内容而不是地址，这时可以写一个<b>全特化</b>：<code>template &lt;&gt; const char* max_of&lt;const char*&gt;(...)</code>。全特化告诉编译器「当 T 恰好是这个类型时，用我这一份」。' },

    { t: 'code', lang: 'cpp', caption: '全特化：为特定类型换实现', code: `#include <cstring>
#include <iostream>

template <typename T>
T max_of(T a, T b) { return a > b ? a : b; }

template <>
const char* max_of<const char*>(const char* a, const char* b) {
    return std::strcmp(a, b) > 0 ? a : b;      // 比较内容
}

int main() {
    std::cout << max_of<const char*>("apple", "pear") << "\\n";  // pear
}` },

    { t: 'p', html: '与全特化相对的是<b>偏特化</b>：只特化一部分参数，或者针对指针、引用做特化。比如 <code>template &lt;typename T&gt; class Stack&lt;T*&gt;</code> 可以专门处理指针类型。偏特化只能用于类模板，函数模板不能偏特化，只能用重载代替——这是语言规则，考试常考。' },

    { t: 'p', html: '特化的实用场景其实不多。更常见的做法是<b>重载</b>：写一个普通函数 <code>max_of(const std::string&amp;, const std::string&amp;)</code>，重载决议会优先选非模板的精确匹配。规则是：非模板函数优先于模板，特化优先于泛化。三者混在一起时，记住这个优先级就不会选错。' },

    { t: 'callout', kind: 'tip', title: '先别急着特化', html: '初学模板时最容易犯的错是「为每个类型写一个特化」，结果代码比不用模板还长。先用泛化版本，确认某个类型确实不适用，再考虑重载或特化。标准库自己也只在极少数地方用特化（比如 <code>std::hash</code>、<code>std::numeric_limits</code>）。' },

    { t: 'h', lvl: 2, text: '七、约束：static_assert 与类型特征', id: 'ch05-7' },

    { t: 'p', html: '模板的报错之所以难读，是因为编译器要到实例化时才发现「这个类型不支持 <code>&lt;</code>」或「没有默认构造函数」，而报错位置在模板库内部。缓解办法是<b>主动加约束</b>，让错误在调用点就暴露。最简单的工具是 <code>static_assert</code>。' },

    { t: 'code', lang: 'cpp', caption: '用 static_assert 把约束写清楚', code: `#include <type_traits>

template <typename T>
T max_of(T a, T b) {
    static_assert(std::is_copy_constructible<T>::value,
                  "max_of requires a copy-constructible type");
    static_assert(!std::is_pointer<T>::value,
                  "compare pointed-to values explicitly, not pointers");
    return a > b ? a : b;
}` },

    { t: 'p', html: '<code>std::is_copy_constructible</code>、<code>std::is_pointer</code> 这类工具叫<b>类型特征</b>，定义在 <code>&lt;type_traits&gt;</code> 里，编译期就能回答「T 有没有某个性质」。C++20 之后有更优雅的写法叫 <code>concepts</code>：<code>template &lt;std::copyable T&gt;</code>，约束直接写在参数表里，报错也更友好。本课环境是 C++17 的话用 <code>static_assert</code>，看到 concepts 代码能读懂即可。' },

    { t: 'table', head: ['需求', 'C++17 写法', '说明'], rows: [
      ['要求可拷贝', '<code>static_assert(std::is_copy_constructible&lt;T&gt;::value)</code>', '否则按值返回或传参会失败'],
      ['要求可比较', '<code>static_assert</code> 配合表达式检测', '或直接让编译错误指出'],
      ['要求是整数', '<code>std::is_integral&lt;T&gt;::value</code>', '避免对 double 做位运算'],
      ['要求是指针', '<code>std::is_pointer&lt;T&gt;::value</code>', '特化或分支实现'],
      ['C++20', '<code>template &lt;std::integral T&gt;</code>', 'concepts 语法，约束更清晰']
    ], caption: '约束的价值：让「调用点」报错，而不是在模板深处报错' },

    { t: 'p', html: '除了类型特征，还有一个常用技巧：<b>把错误提前到编译期</b>。比如 <code>static_assert(sizeof(T) &gt;= 4, "type too small")</code>，或者用 <code>if constexpr</code> 在编译期选择分支（C++17）：<code>if constexpr (std::is_pointer_v&lt;T&gt;) { ... } else { ... }</code>。这样同一个模板对不同类型走不同实现，不需要写特化。' },

    { t: 'h', lvl: 2, text: '八、模板怎样支撑起 STL', id: 'ch05-8' },

    { t: 'p', html: '标准库几乎全是模板。<code>std::vector&lt;T&gt;</code> 是类模板，<code>std::sort</code> 是函数模板，<code>std::map&lt;K, V&gt;</code> 是带默认参数的类模板。它们能被设计成这样，靠的正是本章的三件事：<b>类型参数化</b>（什么都能存）、<b>编译期实例化</b>（零运行期开销）、<b>接口约定</b>（只要求类型支持某些操作）。' },

    { t: 'code', lang: 'cpp', caption: '标准库的泛型接口：sort 只要求「能比较」', code: `#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

int main() {
    std::vector<int> nums = {5, 2, 8, 1};
    std::sort(nums.begin(), nums.end());            // 用 operator<

    std::vector<std::string> words = {"pear", "apple", "fig"};
    std::sort(words.begin(), words.end());          // string 自带 <

    std::sort(words.begin(), words.end(),
              [](const std::string& a, const std::string& b) {
                  return a.size() < b.size();       // 自定义比较
              });

    for (const auto& w : words) std::cout << w << " ";
    std::cout << "\\n";
}` },

    { t: 'p', html: '<code>std::sort</code> 不关心你排的是整数、字符串还是自定义结构体，它只要求「能用 <code>&lt;</code> 比较」或者「你提供一个比较函数」。这种「按需求约束、不按类型约束」的设计叫<b>泛型编程</b>。第 6 章会看到，容器、迭代器、算法三者靠这套约定拼在一起，形成 STL 的骨架。' },

    { t: 'p', html: '一个具体例子：为什么 <code>std::vector&lt;bool&gt;</code> 是个特例？因为标准库对它做了特化，把每个 bool 压成一个 bit，省了 8 倍空间，但 <code>operator[]</code> 返回的是代理对象而不是 <code>bool&amp;</code>，导致 <code>auto&amp; b = v[0]</code> 编译失败。这是特化的代价，也是「不要轻易特化」的反面教材。' },

    { t: 'terms', items: [
      { en: 'template', zh: '模板', html: '带类型参数的代码图纸；本身不是函数或类，实例化后才产生真正的代码。' },
      { en: 'instantiation', zh: '实例化', html: '编译器用具体类型替换模板参数、生成真实函数或类的过程，发生在编译期。' },
      { en: 'type parameter', zh: '类型参数', html: '<code>typename T</code> 或 <code>class T</code> 声明的参数，调用时由实参推导或显式指定。' },
      { en: 'non-type parameter', zh: '非类型参数', html: '编译期常量作为参数，如 <code>int N</code>；大小成为类型的一部分。' },
      { en: 'specialization', zh: '特化', html: '为特定类型提供专门实现；全特化对所有参数指定，偏特化只指定一部分（仅类模板）。' },
      { en: 'concept', zh: '概念', html: 'C++20 的编译期约束，用来描述类型必须支持哪些操作，替代冗长的 SFINAE。' }
    ] },

    { t: 'quiz', qid: 'ch05-q1' },
    { t: 'quiz', qid: 'ch05-q2' },
    { t: 'quiz', qid: 'ch05-q3' },

    { t: 'keypoint', items: [
      { title: '模板是编译期填空，不是运行期机制', html: '每次用新类型调用，编译器就生成一份新代码；没有虚函数表那样的运行期开销。' },
      { title: '推导会去掉引用、const，数组退化', html: '两个实参类型不一致时推导失败，需显式指定或改两个类型参数。' },
      { title: '模板定义必须对调用点可见', html: '所以放头文件；放 .cpp 会导致 <code>undefined reference</code>。' },
      { title: '非类型参数必须是编译期常量', html: '<code>FixedArray&lt;int, 5&gt;</code> 与 <code>&lt;int, 6&gt;</code> 是两个无关类型。' },
      { title: '约束越早写，报错越好读', html: '<code>static_assert</code> + 类型特征把错误提前到调用点；C++20 用 concepts。' }
    ] },

    { t: 'checklist', id: 'ch05', items: [
      '我能把三个只差类型的函数合并成一个函数模板',
      '我能解释 max_of(3, 4.5) 为什么编译失败，并给出两种修法',
      '我知道 const char* 传给模板会按地址比较，并能说出防范办法',
      '我能写出 Stack<T> 并说明为什么成员函数定义放在头文件',
      '我能解释 undefined reference 在模板场景下的成因',
      '我能写出带非类型参数的 FixedArray 并说明它的类型含义',
      '我知道全特化与偏特化的区别，以及函数模板为什么不能偏特化',
      '我能用 static_assert 给模板加一条约束',
      '我能说出 vector、map、sort 分别是哪种模板，以及它们对类型的要求'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应讲义 Chapter 05（Collections）中的泛型容器实现、Chapter 16（Trees）与 Chapter 17（Sets）的模板节点设计，以及教学库 vector / map 的模板化写法。变参模板、SFINAE、模板元编程只作概念提及，不在本课考核范围；C++20 concepts 仅要求能读懂。示例代码在 g++ -std=c++17 下验证。下一章把模板交给标准库：不再自己造容器，而是学会按场景选容器、按接口用算法。' }
  ]
});
