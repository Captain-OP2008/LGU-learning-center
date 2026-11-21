/* =====================================================================
 * ch03.js · 第 3 章「类与对象：封装、生命周期与运算符」
 * 依据：讲义 Chapter 05 Collections / Chapter 14 Linear Structures 中的类设计部分，
 *       Tutorial 04（类与对象）、Tutorial 09（tut9：类的实现）。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch03',
  num: '03',
  title: '类与对象：封装、生命周期与运算符',
  en: 'CLASSES & OBJECTS',
  goals: [
    '把一个「数据和操作分散在全局」的程序改写成类，并写出它的不变量',
    '说清构造函数初始化列表与函数体内赋值的区别，尤其是成员是对象或 const 时',
    '为一个持有堆内存的类写出析构、拷贝构造、拷贝赋值，并解释为什么三个都要写',
    '给成员函数加 const，并解释 this 指针在其中的类型变化',
    '重载 ==、&lt;&lt;、[]、+ 四个最常用的运算符，并说明哪些该是成员、哪些该是友元'
  ],
  kp: [
    { id: 'ch03-1', title: '类是把不变量守住' },
    { id: 'ch03-2', title: '封装：public 与 private 的分界' },
    { id: 'ch03-3', title: '构造函数与初始化列表' },
    { id: 'ch03-4', title: '析构函数与三件套' },
    { id: 'ch03-5', title: 'const 成员函数与 this' },
    { id: 'ch03-6', title: '运算符重载的边界' },
    { id: 'ch03-7', title: '头文件与实现分离' },
    { id: 'ch03-8', title: '完整案例：一个会扩容的 IntVector' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '类不是「函数加结构体」', html: '很多人学完类，写出来的东西只是把一堆变量塞进 <code>struct</code>、再把一堆函数名前面加上类名，本质上还是面向过程。类真正的价值是<b>守住一条不变量</b>：比如「size 永远等于实际元素个数」「余额永远不为负」。只要这条性质在所有公开操作后都成立，类的使用者就不需要读实现。本章就围绕这条线展开：怎么设计接口、怎么在构造和析构时获取与归还资源、怎么让对象用起来像内置类型。' },

    { t: 'p', lead: true, html: '上一章的链表节点 <code>struct int_list { int value; int_list* next; };</code> 已经是一个「对象」了：它把两个相关的值放在一起。但它没有任何保护——任何人都能把 <code>next</code> 改成野指针，也没有人负责在不再使用时释放它。类要做的第一件事，就是把这种「谁都能改」变成「只能通过我提供的方法改」。' },

    { t: 'h', lvl: 2, text: '一、类是把不变量守住', id: 'ch03-1' },

    { t: 'p', html: '先看一个反例。用一个数组加一个长度表示「一堆整数」，所有操作都写成自由函数。它能跑，但每个函数都必须自己记得维护长度，只要有一处忘了，后面所有代码都建立在错误状态上。' },

    { t: 'code', lang: 'cpp', caption: '没有类的时候：长度靠每个函数自觉维护', code: `#include <iostream>

const int kCap = 100;
int data[kCap];
int count = 0;

void push(int v) {
    if (count >= kCap) return;      // 满了只能忽略
    data[count++] = v;
}

int pop() {
    return data[--count];           // 空的时候会越界
}` },

    { t: 'p', html: '这段代码的问题不在于写得丑，而在于<b>没有任何地方能保证 <code>0 &lt;= count &lt;= kCap</code></b>。任何人都可以直接写 <code>count = 999;</code>，编译器不会拦，运行时才炸。类的做法是把 <code>data</code> 和 <code>count</code> 设为 private，只暴露 <code>push</code>、<code>pop</code>、<code>size</code>，并在每个方法里维护那条不等式。这条不等式就是<b>不变量</b>。' },

    { t: 'p', html: '不变量不是注释，而是「构造完成后一定成立、每次公开操作后仍然成立」的性质。设计一个类时，第一件事应该是用一句话写出它的不变量：栈是「元素个数在 0 到容量之间，元素按后进先出排列」；银行账户是「余额等于所有交易之和，且不为负」；矩阵是「行数、列数与数据长度一致」。写不出来，说明这个类的职责还没想清楚。' },

    { t: 'callout', kind: 'tip', title: '先写测试，再写类', html: '把不变量翻成几个断言：<code>size() == 0</code> 初始成立；push 后 <code>size()</code> 加一；pop 后减一；空栈 pop 应该报错而不是崩溃。这几条写下来，接口自然就出来了。比先想「要哪些成员变量」有效得多。' },

    { t: 'h', lvl: 2, text: '二、封装：public 与 private 的分界', id: 'ch03-2' },

    { t: 'p', html: '<code>class</code> 的成员默认 private，<code>struct</code> 默认 public，这是两者唯一的语言差别（习惯上 struct 用于纯数据、class 用于有行为的对象）。分界原则只有一条：<b>public 放「承诺」，private 放「实现」</b>。public 的东西一旦发布就很难改，因为客户代码依赖它；private 随便重构，外面看不到。' },

    { t: 'code', lang: 'cpp', caption: '一个带不变量的计数器类', code: `#include <iostream>

class Counter {
public:
    Counter() : count_(0) {}          // 构造后不变量成立

    void increment() { ++count_; }
    void reset()     { count_ = 0; }
    int  value() const { return count_; }

private:
    int count_;                        // 外部不可直接改
};

int main() {
    Counter c;
    c.increment();
    c.increment();
    std::cout << c.value() << "\\n";    // 2
    // c.count_ = 100;                 // 编译错误：private
}` },

    { t: 'p', html: '注意成员名后面的下划线 <code>count_</code>。这不是语法要求，而是约定：一眼区分成员变量与局部变量，构造函数的参数就可以同名 <code>Counter(int count) : count_(count)</code>。团队里统一一种风格（下划线、<code>m_</code> 前缀、或 <code>this-&gt;</code>）比选哪种更重要。' },

    { t: 'table', head: ['放 public', '放 private', '理由'], rows: [
      ['构造、析构', '成员变量', '客户只该看到「怎么造、怎么用」，不该看到数据怎么排'],
      ['查询（<code>size</code>、<code>empty</code>、<code>value</code>）', '内部辅助函数', '查询是承诺，辅助是实现'],
      ['修改状态的操作（<code>push</code>、<code>add</code>）', '缓存、哨兵、指针', '操作要维护不变量，不能交给客户'],
      ['运算符（<code>==</code>、<code>&lt;&lt;</code>）', '扩容策略、哈希函数', '接口稳定，策略可换']
    ], caption: '判断标准：如果暴露出去，你以后还敢不敢改它？不敢就别放 public' },

    { t: 'p', html: '封装不等于「所有成员都写 getter/setter」。给每个 private 成员配一对 <code>getX</code>/<code>setX</code>，等于把 public 换了个名字，不变量照样守不住。<b>只有当你愿意为这个 setter 的合法性负责时，才提供它</b>；否则宁可只提供「整体操作」，比如 <code>deposit(amount)</code> 而不是 <code>setBalance(x)</code>。' },

    { t: 'h', lvl: 2, text: '三、构造函数与初始化列表', id: 'ch03-3' },

    { t: 'p', html: '构造函数在对象创建时自动调用，负责把对象带到「不变量成立」的状态。它的名字与类名相同、没有返回类型、可以重载。最关键的一点：<b>成员真正的初始化发生在进入函数体之前</b>，函数体里的赋值已经是「先默认构造、再赋值」了。所以能写初始化列表就写。' },

    { t: 'code', lang: 'cpp', caption: '初始化列表 vs 函数体内赋值', code: `#include <string>
#include <vector>

class Student {
public:
    // 好：一次构造完成
    Student(std::string name, int id)
        : name_(std::move(name)), id_(id), scores_() {}

    // 差：name_ 先默认构造为空串，再被赋值
    // Student(std::string name, int id) {
    //     name_ = name;
    //     id_ = id;
    // }

private:
    std::string name_;
    int id_;
    std::vector<int> scores_;
};` },

    { t: 'p', html: '有三种成员<b>必须</b>用初始化列表，否则编译不过：<code>const</code> 成员、引用成员、没有默认构造函数的类类型成员。因为它们都要求「创建时就有值」，而函数体执行时已经晚了。这条规则在考试里出现频率很高：给你一个含 const 成员的类，问哪种构造函数写法能编译。' },

    { t: 'p', html: '成员的初始化顺序由<b>声明顺序</b>决定，不是初始化列表里的书写顺序。如果列表顺序与声明顺序不一致，编译器会给警告（<code>-Wreorder</code>），而且可能读到还没初始化的成员。习惯：初始化列表的顺序永远与声明顺序一致。' },

    { t: 'code', lang: 'cpp', caption: '顺序陷阱：b_ 用到 a_，但 b_ 先声明', code: `class Bad {
public:
    Bad(int x) : b_(x), a_(b_) {}   // 实际先初始化 a_，再 b_
private:
    int a_;
    int b_;                          // 声明顺序：a_ 在前
};` },

    { t: 'p', html: '还有两个常用工具：<b>默认参数</b>让一个构造函数覆盖多种调用方式（<code>Counter(int start = 0)</code>）；<b>委托构造</b>让一个构造函数调用另一个，避免重复代码（<code>Counter() : Counter(0) {}</code>）。<code>explicit</code> 用来禁止单参数构造函数的隐式转换，比如 <code>Vector(int n)</code> 不加 explicit 时，<code>Vector v = 10;</code> 居然能编译，这几乎总是 bug。' },

    { t: 'h', lvl: 2, text: '四、析构函数与三件套', id: 'ch03-4' },

    { t: 'p', html: '析构函数在对象销毁时自动调用，负责归还资源。对于只含 <code>int</code>、<code>string</code>、<code>vector</code> 的类，编译器生成的析构函数已经够用；但只要类里有一个<b>裸指针指向 new 出来的内存</b>，就必须自己写析构，否则那块内存永远泄漏。' },

    { t: 'p', html: '更麻烦的是拷贝。编译器默认生成的拷贝构造函数是<b>浅拷贝</b>：逐成员复制，指针复制的是地址，于是两个对象指向同一块内存。等它们先后析构，同一块内存被 delete 两次，程序崩溃。所以「持有资源的类」必须同时定义三个函数：析构、拷贝构造、拷贝赋值，合称<b>三件套</b>（Rule of Three）。' },

    { t: 'code', lang: 'cpp', caption: 'IntVector：三件套齐全的最小动态数组', code: `#include <algorithm>
#include <iostream>

class IntVector {
public:
    explicit IntVector(int cap = 4)
        : data_(new int[cap]), size_(0), cap_(cap) {}

    ~IntVector() { delete[] data_; }                 // ① 析构

    IntVector(const IntVector& other)                // ② 拷贝构造
        : data_(new int[other.cap_]), size_(other.size_), cap_(other.cap_) {
        std::copy(other.data_, other.data_ + size_, data_);
    }

    IntVector& operator=(const IntVector& other) {   // ③ 拷贝赋值
        if (this != &other) {
            int* fresh = new int[other.cap_];        // 先分配，失败不影响自己
            std::copy(other.data_, other.data_ + other.size_, fresh);
            delete[] data_;                          // 再释放旧内存
            data_ = fresh;
            size_ = other.size_;
            cap_ = other.cap_;
        }
        return *this;
    }

    void push_back(int v) {
        if (size_ == cap_) grow();
        data_[size_++] = v;
    }

    int size() const { return size_; }
    int at(int i) const { return data_[i]; }

private:
    void grow() {
        int newCap = cap_ * 2;
        int* fresh = new int[newCap];
        std::copy(data_, data_ + size_, fresh);
        delete[] data_;
        data_ = fresh;
        cap_ = newCap;
    }

    int* data_;
    int  size_;
    int  cap_;
};` },

    { t: 'p', html: '拷贝赋值里有四个细节值得逐条看。<b>①</b> <code>if (this != &amp;other)</code> 防自赋值，否则会先 delete 掉自己的数据再读它。<b>②</b> 先 new 后 delete，万一 new 抛异常，原对象还完好（异常安全）。<b>③</b> 返回 <code>*this</code> 的引用，才能支持 <code>a = b = c</code> 这种链式赋值。<b>④</b> 复制的是 <code>size_</code> 个元素，不是 <code>cap_</code> 个，超出部分是未初始化的。' },

    { t: 'table', head: ['函数', '什么时候被调用', '默认版本做什么', '何时必须自己写'], rows: [
      ['构造函数', '创建对象', '逐成员默认构造', '需要建立不变量时'],
      ['析构函数', '对象销毁（离开作用域、delete）', '逐成员析构', '持有裸资源时'],
      ['拷贝构造', '用同类型对象初始化新对象', '逐成员拷贝（浅拷贝）', '持有裸资源时'],
      ['拷贝赋值', '对已存在对象赋值', '逐成员赋值（浅拷贝）', '持有裸资源时'],
      ['移动构造/赋值', '从临时对象或 std::move 构造', '若无自定义则退化为拷贝', '第 7 章']
    ], caption: 'Rule of Three：三个里写了一个，通常三个都要写' },

    { t: 'callout', kind: 'warn', title: '三件套最容易被忽略的第 2 条', html: '多数人记得写析构，忘了写拷贝构造，于是 <code>IntVector b = a;</code> 之后两个对象共用一块内存，程序在 b 析构时崩溃。更隐蔽的是按值传参：<code>void f(IntVector v)</code> 每次调用都会拷贝一次，函数结束再析构一次——泄漏或崩溃迟早出现。<b>规则：类里出现 <code>new</code>，立刻检查三件套。</b>' },

    { t: 'h', lvl: 2, text: '五、const 成员函数与 this', id: 'ch03-5' },

    { t: 'p', html: '成员函数其实都隐含一个参数：指向当前对象的 <code>this</code> 指针。在非 const 成员函数里，<code>this</code> 的类型是 <code>Counter* const</code>；在 const 成员函数里是 <code>const Counter* const</code>。所以 const 成员函数不能修改成员变量，也不能调用非 const 成员函数。' },

    { t: 'p', html: '给成员函数加 const 不是可选项。一个 <code>const Student s;</code> 对象只能调用 const 成员函数；<code>print(const Student&amp; s)</code> 里的 <code>s</code> 也一样。如果你的 <code>name()</code> 忘了加 const，客户代码就编译不过，只能把参数改成非 const 引用，连带破坏了「不修改」的语义。' },

    { t: 'code', lang: 'cpp', caption: 'const 成员函数才能被 const 对象调用', code: `#include <string>

class Student {
public:
    Student(std::string n) : name_(n) {}
    std::string name() const { return name_; }   // 可以
    void rename(std::string n) { name_ = n; }    // 非 const

private:
    std::string name_;
};

void print(const Student& s) {
    // s.rename("x");     // 错误：const 引用不能调非 const 成员
    s.name();             // 正确
}` },

    { t: 'p', html: '有时逻辑上「不改变对象」的操作，实现上却需要改一个缓存或计数器。这时把那个成员声明为 <code>mutable</code>，它就能在 const 成员函数里被修改。这是例外，不要滥用：<code>mutable</code> 越多，说明类的设计越可疑。' },

    { t: 'p', html: '<code>this</code> 还有一个用途：在成员函数里返回自己，支持链式调用。<code>Counter&amp; add(int n) { count_ += n; return *this; }</code> 就能写 <code>c.add(1).add(2).add(3);</code>。注意返回类型必须是引用，返回 <code>Counter</code> 会拷贝一份临时对象，后续调用改的是临时对象。' },

    { t: 'h', lvl: 2, text: '六、运算符重载的边界', id: 'ch03-6' },

    { t: 'p', html: '运算符重载让自定义类型用起来像内置类型。<code>a + b</code>、<code>a == b</code>、<code>cout &lt;&lt; a</code> 都可以为自己的类定义。原则是<b>只重载语义直观的运算符</b>：矩阵可以 <code>+</code>，日期可以 <code>&lt;</code>，但一个 <code>Student</code> 重载 <code>-</code> 就没有意义。不要为了炫技让 <code>+</code> 去修改对象。' },

    { t: 'table', head: ['运算符', '建议写成', '原因'], rows: [
      ['<code>==</code> <code>!=</code>', '非成员友元或普通函数', '两边类型对称，允许隐式转换'],
      ['<code>&lt;&lt;</code> <code>&gt;&gt;</code>', '非成员友元', '左操作数是 ostream，不能属于你的类'],
      ['<code>[]</code> <code>()</code> <code>=</code> <code>+=</code>', '成员函数', '左操作数必须是本类对象'],
      ['<code>+</code> <code>-</code> <code>*</code>', '非成员（基于 += 实现）', '不修改操作数，返回新对象'],
      ['<code>&lt;</code>', '非成员', '便于配合 sort 与 set']
    ], caption: '判断口诀：左操作数是不是本类？是就成员，不是就非成员' },

    { t: 'code', lang: 'cpp', caption: '== 与 << 的标准写法', code: `#include <iostream>
#include <string>

class Point {
public:
    Point(int x = 0, int y = 0) : x_(x), y_(y) {}
    int x() const { return x_; }
    int y() const { return y_; }

    bool operator==(const Point& o) const {
        return x_ == o.x_ && y_ == o.y_;
    }
    bool operator!=(const Point& o) const { return !(*this == o); }

private:
    int x_, y_;
};

std::ostream& operator<<(std::ostream& os, const Point& p) {
    return os << "(" << p.x() << ", " << p.y() << ")";
}

int main() {
    Point a(1, 2), b(1, 2);
    std::cout << a << " " << (a == b) << "\\n";   // (1, 2) 1
}` },

    { t: 'p', html: '<code>&lt;&lt;</code> 必须返回 <code>ostream&amp;</code>，才能连续输出 <code>cout &lt;&lt; a &lt;&lt; b</code>；参数必须是 <code>ostream&amp;</code> 与 <code>const T&amp;</code>，因为 <code>cout</code> 不可拷贝。这两点是固定模板，记住就行。如果运算符需要访问 private 成员，在类里写 <code>friend std::ostream&amp; operator&lt;&lt;(std::ostream&amp;, const Point&amp;);</code>。' },

    { t: 'callout', kind: 'warn', title: '重载 == 忘了配套 != 与 <', html: '只写 <code>==</code> 时，<code>a != b</code> 会退化成「地址比较」或者编译失败；把对象放进 <code>std::set</code> 需要 <code>&lt;</code>；放进 <code>unordered_set</code> 需要 <code>==</code> 与哈希函数。第 6 章会用到这些，先把 <code>==</code>、<code>!=</code>、<code>&lt;</code> 三件一起写好的习惯建立起来。' },

    { t: 'h', lvl: 2, text: '七、头文件与实现分离', id: 'ch03-7' },

    { t: 'p', html: '一个类通常拆成两个文件：头文件放<b>声明</b>（类定义、函数原型、成员变量），.cpp 放<b>实现</b>（函数体）。客户代码只 include 头文件，不需要看到实现，改了 .cpp 也只重编那一个文件。这是 C++ 编译模型的基本用法，也是第 0 章说的「接口在前」。' },

    { t: 'code', lang: 'cpp', caption: 'Counter.h：只放声明', code: `#pragma once

class Counter {
public:
    Counter();
    void increment();
    int  value() const;

private:
    int count_;
};` },

    { t: 'code', lang: 'cpp', caption: 'Counter.cpp：放实现，成员函数名前加类名', code: `#include "Counter.h"

Counter::Counter() : count_(0) {}

void Counter::increment() { ++count_; }

int Counter::value() const { return count_; }` },

    { t: 'p', html: '三个细节。<b>①</b> <code>#pragma once</code>（或 <code>#ifndef</code> 守卫）防止头文件被重复包含。<b>②</b> 实现文件里函数名要写 <code>Counter::increment</code>，否则编译器会以为你在定义一个全局函数。<b>③</b> 头文件里<b>不要写函数体</b>（模板和内联除外），否则被多个 .cpp 包含时链接器会报重复定义。' },

    { t: 'p', html: '如果头文件里需要用到另一个类的指针或引用，可以用<b>前向声明</b> <code>class Student;</code> 代替 <code>#include "Student.h"</code>，减少编译依赖。只有当你要按值使用它、或调用它的成员时，才需要完整定义。大型项目里这条习惯能把编译时间从几分钟压到几秒。' },

    { t: 'h', lvl: 2, text: '八、完整案例：一个会扩容的 IntVector', id: 'ch03-8' },

    { t: 'p', html: '把本章所有零件装起来，写一个能真正使用的动态数组。它要满足四条不变量：<b>①</b> <code>0 &lt;= size_ &lt;= cap_</code>；<b>②</b> <code>data_</code> 指向 <code>cap_</code> 个 int 的数组；<b>③</b> 前 <code>size_</code> 个元素有效；<b>④</b> 析构时恰好释放一次。' },

    { t: 'code', lang: 'cpp', caption: 'IntVector 的使用与自检', code: `#include <cassert>
#include <iostream>

int main() {
    IntVector v;                 // cap = 4
    for (int i = 0; i < 10; ++i) v.push_back(i * i);
    assert(v.size() == 10);
    assert(v.at(0) == 0 && v.at(9) == 81);

    IntVector copy = v;          // 拷贝构造：独立内存
    copy.push_back(100);
    assert(copy.size() == 11);
    assert(v.size() == 10);      // 原对象不受影响

    IntVector assigned;
    assigned = v;                // 拷贝赋值
    assert(assigned.size() == 10);

    assigned = assigned;         // 自赋值不能崩
    assert(assigned.size() == 10);

    std::cout << "all good\\n";
}` },

    { t: 'p', html: '这段自检代码就是前面说的「把不变量翻成断言」。它能抓住三类典型错误：扩容时忘了搬数据、拷贝构造只复制了指针、拷贝赋值没有防自赋值。<b>每次写完一个类，先跑这样一段测试，再写业务代码</b>，比在几百行程序里 debug 快得多。' },

    { t: 'p', html: '最后一个观察：<code>grow()</code> 把容量翻倍，而不是每次加一。这样 n 次 push 的总拷贝次数是 1+2+4+...+n，约等于 2n，<b>均摊 O(1)</b>；如果每次加一，总拷贝次数是 n²/2，插入就退化成 O(n)。这个「翻倍扩容」的策略，就是第 6 章 <code>std::vector</code> 的核心设计。' },

    { t: 'compare', left: { title: '值语义（本课的默认）', html: '对象可以拷贝，拷贝出来的是独立的一份，改一个不影响另一个。像 <code>int</code> 一样用。代价是拷贝可能很贵，需要三件套保证正确。' }, right: { title: '引用语义（指针/句柄）', html: '拷贝的是句柄，两个句柄指向同一个对象，改一个两边都变。像 Java 的对象。C++ 里需要显式用指针或 <code>shared_ptr</code> 表达。' } },

    { t: 'terms', items: [
      { en: 'invariant', zh: '不变量', html: '对象在每次公开操作后都必须成立的性质；构造函数负责建立，成员函数负责维持。' },
      { en: 'encapsulation', zh: '封装', html: '把实现细节设为 private，只通过 public 接口暴露承诺，使内部可以独立演化。' },
      { en: 'initializer list', zh: '初始化列表', html: '构造函数冒号后的一段，真正「初始化」成员；const、引用、无默认构造的成员必须用它。' },
      { en: 'Rule of Three', zh: '三件套', html: '析构、拷贝构造、拷贝赋值：只要有一个需要自定义，通常三个都要。' },
      { en: 'shallow copy', zh: '浅拷贝', html: '逐成员复制，指针只复制地址；两个对象指向同一块内存，是重复释放的根源。' },
      { en: 'const member function', zh: 'const 成员函数', html: '承诺不修改对象状态，const 对象只能调用它；本质是 <code>this</code> 变成指向 const 的指针。' }
    ] },

    { t: 'quiz', qid: 'ch03-q1' },
    { t: 'quiz', qid: 'ch03-q2' },
    { t: 'quiz', qid: 'ch03-q3' },

    { t: 'keypoint', items: [
      { title: '类的核心是不变量，不是成员变量', html: '先写清「对象始终满足什么」，再决定接口与 private 成员。' },
      { title: '初始化列表 vs 函数体赋值', html: 'const、引用、无默认构造的成员只能用初始化列表；顺序按声明顺序。' },
      { title: '有 new 就要三件套', html: '析构、拷贝构造、拷贝赋值缺一不可，否则浅拷贝导致重复释放或泄漏。' },
      { title: '拷贝赋值四要素', html: '防自赋值、先分配后释放、返回 <code>*this</code> 引用、只复制有效元素。' },
      { title: '运算符：左操作数是本类就做成员', html: '<code>&lt;&lt;</code> 必须是非成员并返回 <code>ostream&amp;</code>；<code>==</code> 记得配 <code>!=</code> 与 <code>&lt;</code>。' }
    ] },

    { t: 'checklist', id: 'ch03', items: [
      '我能为一个类写出它的不变量，并把它翻成三条断言',
      '我能说出 class 与 struct 的唯一语言差别，以及各自的使用习惯',
      '我知道哪三种成员必须用初始化列表，并解释原因',
      '我能指出初始化列表顺序与声明顺序不一致会出什么问题',
      '我能为一个持有 new[] 的类写出析构、拷贝构造、拷贝赋值',
      '我能解释拷贝赋值里「先 new 后 delete」的理由',
      '我知道 const 成员函数里 this 的类型，以及它为什么不能改成员',
      '我能写出 operator== 与 operator<< 的完整签名',
      '我能把类拆成 .h 与 .cpp 两个文件并成功编译'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应讲义 Chapter 05（Collections）与 Chapter 14（Linear Structures）中的类设计内容，并整合了课程 Tutorial 04 与 Tutorial 09 的类实现练习。三件套与 IntVector 是按讲义「动态数组」主线重写的完整示例，代码在 g++ -std=c++17 下编译通过。运算符重载只覆盖本课用得到的四个（==、&lt;&lt;、[]、+），其余（如 ++、()、类型转换）在项目里按需查阅即可。下一章在这个类的基础上加继承：让不同的子类共用一套接口。' }
  ]
});
