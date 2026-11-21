/* =====================================================================
 * ch04.js · 第 4 章「继承与多态：同一接口，不同行为」
 * 依据：讲义 Chapter 19（Inheritance，含 Part 02）、Chapter 20（Strategies for
 *       Iteration），Tutorial 10（继承与虚函数）。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch04',
  num: '04',
  title: '继承与多态：同一接口，不同行为',
  en: 'INHERITANCE & POLYMORPHISM',
  goals: [
    '判断两个类之间该用继承还是组合，并说出 is-a 与 has-a 的区别',
    '写出基类与派生类的构造、析构顺序，解释为什么基类析构必须是虚的',
    '说明虚函数表怎样让基类指针调用到派生类的实现',
    '用纯虚函数定义抽象接口，并让三个不同的子类实现它',
    '识别对象切片、签名不匹配、忘记 override 这三类多态 bug'
  ],
  kp: [
    { id: 'ch04-1', title: '继承表达 is-a 关系' },
    { id: 'ch04-2', title: '构造与析构的顺序' },
    { id: 'ch04-3', title: '虚函数与动态绑定' },
    { id: 'ch04-4', title: '纯虚函数与抽象基类' },
    { id: 'ch04-5', title: 'override、final 与访问控制' },
    { id: 'ch04-6', title: '对象切片与虚析构' },
    { id: 'ch04-7', title: '组合优于继承' },
    { id: 'ch04-8', title: '案例：图形层次与迭代策略' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '多态解决的是「同一句话，不同反应」', html: '假设你要写一个绘图程序，支持圆、矩形、三角形。没有多态，你只能写 <code>drawCircle</code>、<code>drawRect</code>、<code>drawTriangle</code>，再写一个 <code>switch</code> 按类型分发；每加一种图形，就要改这个 switch，还要改所有类似的 switch。多态把这件事翻过来：<b>调用者只说「画」，具体怎么画由对象自己决定</b>。加新图形时只加一个类，调用代码一行不改。这就是「对扩展开放，对修改关闭」。' },

    { t: 'p', lead: true, html: '继承的语法很简单：<code>class Circle : public Shape</code>。难的是判断<b>什么时候该用</b>。用错继承，代码会比不用更糟：基类里塞进一堆只有某个子类才关心的字段，子类之间互相依赖，改一处全崩。本章先把「is-a」这条判据立住，再讲虚函数怎样实现运行时分发，最后给出「组合优于继承」的边界。' },

    { t: 'h', lvl: 2, text: '一、继承表达 is-a 关系', id: 'ch04-1' },

    { t: 'p', html: '继承的语义是「派生类<b>是一种</b>基类」。<code>Circle</code> 是一种 <code>Shape</code>，<code>GraduateStudent</code> 是一种 <code>Student</code>，这说得通；<code>Car</code> 继承 <code>Engine</code> 就说不通，因为车不是一种发动机，车<b>有</b>一个发动机——那该用组合（成员变量）。' },

    { t: 'p', html: '判据可以更严格一点：<b>凡是能用在基类对象上的操作，用在派生类对象上也必须成立</b>（Liskov 替换原则）。<code>Shape</code> 有 <code>area()</code>，圆和矩形都能算面积，成立。如果 <code>Bird</code> 有 <code>fly()</code>，而 <code>Penguin</code> 继承它，企鹅不会飞，这条就破了——正确做法是把 <code>fly</code> 拆到另一个接口里，而不是在 <code>Penguin::fly()</code> 里抛异常。' },

    { t: 'code', lang: 'cpp', caption: '最朴素的继承：派生类自动拥有基类的成员', code: `#include <iostream>
#include <string>

class Animal {
public:
    std::string name_;
    void eat() { std::cout << name_ << " eats\\n"; }
};

class Dog : public Animal {
public:
    void bark() { std::cout << name_ << " barks\\n"; }
};

int main() {
    Dog d;
    d.name_ = "Wangcai";
    d.eat();       // 继承来的
    d.bark();      // 自己的
}` },

    { t: 'p', html: '注意 <code>public</code> 继承这个词。C++ 有三种继承方式，<code>public</code> 表示「is-a」，基类的 public 成员在派生类里仍是 public；<code>private</code> 继承表示「用基类实现」，外界看不到这层关系；<code>protected</code> 介于两者之间。实际项目里 99% 是 public 继承，另外两种只在极少数库代码里出现，本课只用 public。' },

    { t: 'p', html: '<code>protected</code> 成员是给派生类开的后门：外界不能访问，派生类可以。但它破坏了封装——基类一改 protected 成员的语义，所有子类都可能受影响。经验法则是：<b>优先 private，确实需要给子类用才 protected，public 只放接口</b>。' },

    { t: 'h', lvl: 2, text: '二、构造与析构的顺序', id: 'ch04-2' },

    { t: 'p', html: '构造一个派生类对象时，顺序是<b>先基类、后成员、再自己的函数体</b>；析构时完全相反，先自己、再成员、最后基类。这个顺序保证派生类的构造函数执行时，基类那部分已经可用；析构时派生类那部分还没被拆掉，可以安全使用。' },

    { t: 'code', lang: 'cpp', caption: '打印构造与析构顺序', code: `#include <iostream>

class Base {
public:
    Base()  { std::cout << "Base ctor\\n"; }
    ~Base() { std::cout << "Base dtor\\n"; }
};

class Member {
public:
    Member()  { std::cout << "Member ctor\\n"; }
    ~Member() { std::cout << "Member dtor\\n"; }
};

class Derived : public Base {
public:
    Derived()  { std::cout << "Derived ctor\\n"; }
    ~Derived() { std::cout << "Derived dtor\\n"; }
private:
    Member m_;
};

int main() { Derived d; }` },

    { t: 'p', html: '输出是 <code>Base ctor</code> → <code>Member ctor</code> → <code>Derived ctor</code> → <code>Derived dtor</code> → <code>Member dtor</code> → <code>Base dtor</code>。派生类的构造函数只能通过初始化列表把参数传给基类，不能在函数体里「调用基类构造函数」——那时基类已经构造完了。' },

    { t: 'code', lang: 'cpp', caption: '把参数一路传给基类', code: `class Shape {
public:
    explicit Shape(std::string name) : name_(std::move(name)) {}
    virtual ~Shape() = default;
protected:
    std::string name_;
};

class Circle : public Shape {
public:
    Circle(double r) : Shape("circle"), r_(r) {}   // 初始化列表里调基类构造
private:
    double r_;
};` },

    { t: 'callout', kind: 'warn', title: '基类析构不是虚函数 = 定时炸弹', html: '用 <code>Shape* p = new Circle(1.0);</code> 创建对象，然后 <code>delete p;</code>。如果 <code>~Shape()</code> 不是虚函数，只调用基类析构，<code>Circle</code> 里 new 出来的资源全部泄漏——而且编译器不会提醒你。<b>规则：只要一个类可能被继承并通过基类指针删除，析构函数就必须是 virtual。</b>本课的所有基类都遵守这条。' },

    { t: 'h', lvl: 2, text: '三、虚函数与动态绑定', id: 'ch04-3' },

    { t: 'p', html: '普通成员函数的调用在<b>编译期</b>就定好了：编译器看指针的静态类型，直接生成「调用 Shape::area」的指令。虚函数不同，调用被编译成「查对象里的虚函数表，取第 k 个函数指针，间接调用」。具体调哪个，要等运行期看对象真实类型，这叫<b>动态绑定</b>。' },

    { t: 'flow', dir: 'row', nodes: [
      { title: 'Shape* p', desc: '静态类型 Shape*' },
      { title: '对象首地址', desc: '内含 vptr' },
      { title: '虚函数表', desc: '每个类一张' },
      { title: 'Circle::area', desc: '运行期选中' }
    ] },

    { t: 'p', html: '每个含虚函数的类有一张<b>虚函数表</b>（vtable），表里按声明顺序存放各个虚函数的地址；每个对象里有一个隐藏指针 <code>vptr</code> 指向自己类的表。派生类覆盖了某个虚函数，它的表里对应位置就换成自己的实现。所以「同一个调用，不同对象走不同函数」，代价是每个对象多一个指针、每次调用多一次间接寻址。' },

    { t: 'code', lang: 'cpp', caption: '基类指针调用虚函数：看对象，不看指针', code: `#include <iostream>

class Shape {
public:
    virtual double area() const { return 0.0; }
    virtual ~Shape() = default;
};

class Circle : public Shape {
public:
    explicit Circle(double r) : r_(r) {}
    double area() const override { return 3.14159 * r_ * r_; }
private:
    double r_;
};

class Rect : public Shape {
public:
    Rect(double w, double h) : w_(w), h_(h) {}
    double area() const override { return w_ * h_; }
private:
    double w_, h_;
};

int main() {
    Circle c(2.0);
    Rect   r(3.0, 4.0);
    Shape* shapes[2] = { &c, &r };

    for (Shape* s : shapes) {
        std::cout << s->area() << "\\n";   // 28.27 / 12
    }
}` },

    { t: 'p', html: '如果 <code>area</code> 前面没有 <code>virtual</code>，上面这个循环会输出两个 0——因为 <code>Shape*</code> 的静态类型是 <code>Shape</code>，编译器直接绑定了 <code>Shape::area</code>。这就是「多态失效」最典型的样子：语法全对，结果全错。' },

    { t: 'table', head: ['', '静态绑定', '动态绑定'], rows: [
      ['何时决定', '编译期', '运行期'],
      ['依据', '指针/引用的静态类型', '对象的真实类型'],
      ['触发条件', '普通函数、非虚成员', '虚函数 + 指针或引用调用'],
      ['代价', '无额外开销', '一次间接寻址，对象多一个 vptr'],
      ['典型错误', '以为基类指针会调到派生类', '用对象（而非指针/引用）调用，退化成静态']
    ], caption: '多态需要两个条件同时满足：函数是虚的，且通过指针或引用调用' },

    { t: 'h', lvl: 2, text: '四、纯虚函数与抽象基类', id: 'ch04-4' },

    { t: 'p', html: '基类的 <code>area()</code> 返回 0 其实很别扭：一个「形状」本身没有面积，它只是要求所有子类都能算面积。这种「只声明、不实现」的函数叫<b>纯虚函数</b>，写法是在声明后加 <code>= 0</code>。含纯虚函数的类叫<b>抽象基类</b>，不能创建对象，只能被继承。' },

    { t: 'code', lang: 'cpp', caption: '抽象基类定义接口，子类必须实现', code: `#include <iostream>
#include <memory>
#include <string>
#include <vector>

class Shape {
public:
    virtual ~Shape() = default;
    virtual double area() const = 0;              // 纯虚：必须实现
    virtual std::string name() const = 0;
    virtual void scale(double factor) = 0;
};

class Circle : public Shape {
public:
    explicit Circle(double r) : r_(r) {}
    double area() const override { return 3.14159 * r_ * r_; }
    std::string name() const override { return "circle"; }
    void scale(double f) override { r_ *= f; }
private:
    double r_;
};

int main() {
    // Shape s;                       // 错误：抽象类不能实例化
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(1.0));
    for (auto& s : shapes) {
        std::cout << s->name() << " " << s->area() << "\\n";
    }
}` },

    { t: 'p', html: '抽象基类在工程里的价值是<b>把「需要什么」和「怎么做到」分开</b>。上层代码只依赖 <code>Shape</code> 这个接口，不关心有几个子类、各自怎么实现。加一个新图形时，只写一个新的 .cpp，上层一行不改。这也是第 6 章「算法与容器解耦」的思想来源。' },

    { t: 'p', html: '纯虚函数也可以有函数体（在类外定义），供子类在 <code>override</code> 里显式调用；但更常见的写法是留空。析构函数不要写成纯虚，除非你确实在类外给了定义——因为派生类析构时要调用它，没有定义会链接失败。' },

    { t: 'h', lvl: 2, text: '五、override、final 与访问控制', id: 'ch04-5' },

    { t: 'p', html: 'C++11 引入 <code>override</code> 关键字，用来<b>让编译器检查</b>「这个函数确实覆盖了基类的虚函数」。不写也能覆盖，但一旦签名写错（漏了 const、参数类型差一点），编译器会认为你定义了一个新函数，多态悄悄失效。加上 <code>override</code>，这种错误立刻变成编译错误。' },

    { t: 'code', lang: 'cpp', caption: '一个漏写 const 导致多态失效的例子', code: `#include <iostream>

class Base {
public:
    virtual void show() const { std::cout << "base\\n"; }
    virtual ~Base() = default;
};

class Derived : public Base {
public:
    // void show() { std::cout << "derived\\n"; }   // 漏了 const：新函数，不覆盖
    void show() const override { std::cout << "derived\\n"; }
};

int main() {
    Derived d;
    const Base& b = d;
    b.show();          // 有 override 才输出 derived
}` },

    { t: 'p', html: '<code>final</code> 用在两个地方：修饰类表示「不能再被继承」，修饰虚函数表示「子类不能再覆盖」。它的作用是<b>把设计意图写进代码</b>，让编译器帮你阻止误用，也可能让编译器做去虚化优化。不要给所有类都加 final，只在确实不允许扩展的地方加。' },

    { t: 'table', head: ['关键字', '加在哪', '作用'], rows: [
      ['<code>virtual</code>', '基类函数声明', '允许子类覆盖，启用动态绑定'],
      ['<code>= 0</code>', '虚函数声明末尾', '纯虚，类变抽象，子类必须实现'],
      ['<code>override</code>', '子类函数声明末尾', '编译期检查确实覆盖了基类虚函数'],
      ['<code>final</code>', '类名后或函数声明末尾', '禁止继续继承或覆盖'],
      ['<code>protected</code>', '成员声明', '子类可见、外界不可见'],
      ['<code>public</code> 继承', '类头', '表达 is-a；基类 public 成员对外仍可见']
    ], caption: '本课的写法约定：基类虚函数写 virtual，子类一律写 override，析构一律 virtual' },

    { t: 'p', html: '访问控制还有一个细节：<b>覆盖时可以把访问权限改严</b>，比如基类 public 虚函数，子类改成 private，通过基类指针仍能调用（因为绑定看的是基类的访问权限），但通过子类对象直接调用会编译失败。这种写法很少见，知道有这回事即可，不要主动用。' },

    { t: 'h', lvl: 2, text: '六、对象切片与虚析构', id: 'ch04-6' },

    { t: 'p', html: '多态只对<b>指针和引用</b>生效。如果把派生类对象按值赋给基类对象，发生的是<b>对象切片</b>：只复制基类那部分，派生类新增的成员被丢掉，虚函数表也变成基类的。之后无论怎么调，都不会回到派生类的实现。' },

    { t: 'code', lang: 'cpp', caption: '切片：值传递把 Circle 切成 Shape', code: `#include <iostream>
#include <vector>

void print_area(Shape s) {          // 按值：切片！
    std::cout << s.area() << "\\n";
}

void print_area_ref(const Shape& s) {  // 引用：多态保留
    std::cout << s.area() << "\\n";
}

int main() {
    Circle c(2.0);
    print_area(c);        // 0：被切成 Shape
    print_area_ref(c);    // 12.57
}` },

    { t: 'p', html: '这也是为什么第 3 章反复强调「大对象传 const 引用」。在继承体系里，按值传参不只是性能问题，而是<b>语义直接错掉</b>。同理，<code>std::vector&lt;Shape&gt;</code> 存不下 <code>Circle</code>，只能存 <code>std::vector&lt;std::unique_ptr&lt;Shape&gt;&gt;</code> 或 <code>std::vector&lt;Shape*&gt;</code>。' },

    { t: 'p', html: '虚析构的必要性前面提过，这里补一个具体场景：<code>std::unique_ptr&lt;Shape&gt;</code> 在析构时调用 <code>delete ptr</code>，<code>ptr</code> 的静态类型是 <code>Shape*</code>。如果析构不是虚的，只调用 <code>~Shape()</code>，<code>Circle</code> 的成员（比如它内部 new 的数组）不会释放。智能指针也救不了你，因为问题出在类型系统，不在所有权。' },

    { t: 'callout', kind: 'exam', title: '卷面上的三种多态题', html: '<b>①</b> 给一段含 virtual 与非 virtual 的代码，写出输出——考静态绑定与动态绑定的区别。<b>②</b> 指出代码中的三处错误——常考漏 virtual、漏虚析构、切片。<b>③</b> 设计一个抽象基类加两个子类——考接口设计与 override 语法。第 ③ 类分值最高，写的时候别忘虚析构和 override。' },

    { t: 'h', lvl: 2, text: '七、组合优于继承', id: 'ch04-7' },

    { t: 'p', html: '继承是最强的耦合：派生类依赖基类的全部实现细节，基类一改，所有子类重编、可能重写。所以有一条流传很广的经验法则：<b>优先用组合，只有在确实需要「运行时替换行为」时才用继承</b>。组合就是一个成员变量，语义是 has-a，耦合弱得多。' },

    { t: 'compare', left: { title: '继承：Stack 继承 Vector', html: '看起来省事，直接拥有 <code>push_back</code>、<code>insert</code>、<code>operator[]</code>……但栈的语义是「只能在一端进出」，继承把不该暴露的操作全暴露了，客户可以随意 <code>insert</code> 到中间，不变量被破坏。' }, right: { title: '组合：Stack 内含 Vector', html: '把 <code>std::vector&lt;int&gt; data_</code> 作为 private 成员，只转发 <code>push</code>、<code>pop</code>、<code>top</code>、<code>size</code>。既能复用实现，又能严格控制接口，改内部容器也不影响客户。' } },

    { t: 'code', lang: 'cpp', caption: '用组合实现一个栈', code: `#include <cassert>
#include <vector>

class Stack {
public:
    void push(int v) { data_.push_back(v); }
    void pop()       { assert(!data_.empty()); data_.pop_back(); }
    int  top() const { assert(!data_.empty()); return data_.back(); }
    bool empty() const { return data_.empty(); }
    int  size() const { return data_.size(); }

private:
    std::vector<int> data_;      // has-a，而不是 is-a
};` },

    { t: 'p', html: '那什么时候真该用继承？两种情况：<b>①</b> 需要「同一接口、多种实现」，并且调用方要在运行时决定用哪个（图形、形状；事件处理器；迭代策略）；<b>②</b> 框架要求你继承某个基类才能接入（比如某些测试框架）。其余场景，组合几乎总是更稳。' },

    { t: 'p', html: '还有一个折中工具：<b>策略模式</b>。把可替换的行为抽成一个抽象类或函数对象，作为成员注入，而不是让整个类继承。这样既保留了运行时替换，又避免了深继承树。第 6 章的 <code>std::sort</code> 接受比较函数，就是这个思想的标准库版本。' },

    { t: 'h', lvl: 2, text: '八、案例：图形层次与迭代策略', id: 'ch04-8' },

    { t: 'p', html: '把本章零件组装成一个可扩展的小程序：一个 <code>Shape</code> 抽象基类，三个子类，一个统一的 <code>report</code> 函数只依赖基类接口。新增图形时，只加一个类和一个 <code>make_unique</code>，其余代码不动。' },

    { t: 'code', lang: 'cpp', caption: '完整案例：面积报表', code: `#include <algorithm>
#include <iostream>
#include <memory>
#include <vector>

class Shape {
public:
    virtual ~Shape() = default;
    virtual double area() const = 0;
    virtual std::string name() const = 0;
};

class Circle : public Shape {
public:
    explicit Circle(double r) : r_(r) {}
    double area() const override { return 3.14159 * r_ * r_; }
    std::string name() const override { return "circle"; }
private:
    double r_;
};

class Rect : public Shape {
public:
    Rect(double w, double h) : w_(w), h_(h) {}
    double area() const override { return w_ * h_; }
    std::string name() const override { return "rect"; }
private:
    double w_, h_;
};

class Triangle : public Shape {
public:
    Triangle(double b, double h) : b_(b), h_(h) {}
    double area() const override { return 0.5 * b_ * h_; }
    std::string name() const override { return "triangle"; }
private:
    double b_, h_;
};

int main() {
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(1.0));
    shapes.push_back(std::make_unique<Rect>(2.0, 3.0));
    shapes.push_back(std::make_unique<Triangle>(4.0, 5.0));

    std::sort(shapes.begin(), shapes.end(),
              [](const auto& a, const auto& b) { return a->area() < b->area(); });

    double total = 0;
    for (const auto& s : shapes) {
        std::cout << s->name() << "\\t" << s->area() << "\\n";
        total += s->area();
    }
    std::cout << "total " << total << "\\n";
}` },

    { t: 'p', html: '这段代码有两个值得注意的设计。<b>①</b> <code>std::vector&lt;std::unique_ptr&lt;Shape&gt;&gt;</code> 同时解决了「不能存抽象类」和「不能切片」两个问题，还自动管理内存。<b>②</b> <code>report</code> 与 <code>sort</code> 只依赖 <code>Shape</code> 的接口，不知道 <code>Circle</code> 存在。这就是依赖倒置：<b>高层模块依赖抽象，不依赖具体实现</b>。' },

    { t: 'p', html: '讲义第 20 章「Strategies for Iteration」把同样的思想用在遍历上：把「怎么走到下一个」抽成一个策略对象，容器只负责存数据，遍历方式可以换（前序、中序、层序）。第 6 章的迭代器就是它的标准化版本——用一对 <code>begin/end</code> 指针把「遍历」变成通用接口。' },

    { t: 'terms', items: [
      { en: 'is-a', zh: '是一种', html: '继承的前提：派生类对象在语义上可以当作基类对象使用，基类所有操作对子类都成立。' },
      { en: 'virtual function', zh: '虚函数', html: '允许子类覆盖、通过基类指针或引用调用时在运行期选择实现的成员函数。' },
      { en: 'dynamic binding', zh: '动态绑定', html: '调用哪个函数由对象真实类型在运行期决定，而不是由指针的静态类型在编译期决定。' },
      { en: 'abstract class', zh: '抽象类', html: '含纯虚函数的类，不能实例化，只能作为接口被继承。' },
      { en: 'object slicing', zh: '对象切片', html: '派生类对象按值赋给基类对象时，派生部分被丢弃，多态失效。' },
      { en: 'vtable', zh: '虚函数表', html: '每个多态类一张的函数指针表，对象里的 vptr 指向它，实现运行期分发。' }
    ] },

    { t: 'quiz', qid: 'ch04-q1' },
    { t: 'quiz', qid: 'ch04-q2' },
    { t: 'quiz', qid: 'ch04-q3' },

    { t: 'keypoint', items: [
      { title: '继承必须是 is-a', html: '派生类要能替换基类出现在任何地方；说不通就该用组合（has-a）。' },
      { title: '构造先基类后自己，析构反过来', html: '基类构造参数只能通过初始化列表传；派生类析构时基类部分仍有效。' },
      { title: '多态 = 虚函数 + 指针/引用', html: '缺一个就退化成静态绑定；按值传递还会发生对象切片。' },
      { title: '基类析构必须 virtual', html: '否则通过基类指针 delete 只调用基类析构，派生类资源泄漏。' },
      { title: '子类覆盖一律写 override', html: '签名不匹配时编译器直接报错，而不是悄悄定义一个新函数。' }
    ] },

    { t: 'checklist', id: 'ch04', items: [
      '我能用 is-a / has-a 判断两个类该用继承还是组合',
      '我能写出基类、成员、派生类三者的构造与析构顺序',
      '我能解释虚函数表与 vptr 怎样实现动态绑定',
      '我知道多态生效的两个前提，并能举出失效的例子',
      '我能写出含纯虚函数的抽象基类，并说明它为什么不能实例化',
      '我知道基类析构不是虚函数会发生什么，并能构造一个例子',
      '我能解释对象切片，并说出两种避免它的容器写法',
      '我能给子类的覆盖函数加上 override 并说明它的作用',
      '我能把一个「继承 Vector 的 Stack」改成组合实现'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应讲义 Chapter 19（Inheritance，含 Part 02 的多重继承与虚继承补充）与 Chapter 20（Strategies for Iteration），示例按课程 Tutorial 10 的图形层次练习重写。多重继承只在讲义里出现一节，本课不要求在项目中使用，知道「菱形继承需要虚继承」即可。运行时多态的实现细节（vtable 布局）属于加分理解，考试通常只考「有没有 virtual、有没有指针或引用、有没有虚析构」这三问。下一章换一条路：不靠继承，靠模板在编译期适配所有类型。' }
  ]
});
