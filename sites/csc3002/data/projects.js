/* =====================================================================
 * projects.js · CSC3002 实战项目
 * 结构：{ id, title, en, tagline, level, minutes, chapters, goals, intro,
 *         milestones:[{ n, title, tasks, starter, hints, solution }] }
 * 三个项目由易到难，全部只用标准库，均可在 g++ -std=c++17 下编译。
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerProjects([

    /* ================================================================ P1 */
    {
      id: 'P1',
      title: '词频统计器 WordRank',
      en: 'WORD RANK',
      tagline: '读一个文本文件，统计词频，输出前 K 名——把字符串、容器与算法串起来。',
      level: '入门',
      minutes: 120,
      chapters: ['ch01', 'ch06'],
      goals: [
        '能用 getline 与 istringstream 把一行拆成单词，并处理标点与大小写',
        '能用 unordered_map 计数、vector 排序，写出 O(n + m log m) 的统计流程',
        '能读懂并修改一段真实课程风格的 C++ 程序，而不是拼凑片段'
      ],
      intro: '这个项目没有花哨的架构，但它是「C++ 能不能干活」的第一道门槛：文件读得进来、单词拆得对、' +
        '计数不重复、排序规则明确、边界不崩溃。做完之后你会发现，第 6 章那张容器选择表不是背出来的，' +
        '而是被需求逼出来的——为什么用 map 而不是 vector，为什么排序要自定义比较器，你都会有答案。',
      milestones: [
        {
          n: 1,
          title: '读入与切词',
          tasks: [
            '从命令行参数取文件名，用 std::ifstream 打开；打开失败打印错误并返回 1，不要抛异常（这一层用错误码更合适）。',
            '逐行 getline，用 std::istringstream 拆出单词；把每个单词转成小写，并去掉首尾的非字母字符。',
            '至少处理三种边界：空文件、只有标点的行、单词跨行被截断（例如连字符）。',
            '把切出的单词按原顺序打印到标准输出，一行一个，用来验证切词逻辑。',
            '写一个 10 行的测试文本，包含大写、数字、标点、中文标点，确认输出符合预期。'
          ],
          starter: `#include <cctype>
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>

std::string clean(const std::string& raw) {
    std::string out;
    for (char c : raw) {
        if (std::isalpha(static_cast<unsigned char>(c))) {
            out += static_cast<char>(std::tolower(static_cast<unsigned char>(c)));
        }
    }
    return out;
}

int main(int argc, char** argv) {
    if (argc < 2) {
        std::cerr << "usage: wordrank <file>\\n";
        return 1;
    }
    std::ifstream in(argv[1]);
    if (!in) {
        std::cerr << "cannot open " << argv[1] << "\\n";
        return 1;
    }

    std::string line;
    while (std::getline(in, line)) {
        std::istringstream iss(line);
        std::string word;
        while (iss >> word) {
            std::string w = clean(word);
            if (!w.empty()) std::cout << w << "\\n";
        }
    }
    return 0;
}`,
          hints: [
            'clean 里为什么先把 char 转成 unsigned char？因为 isalpha 的参数是 int，负数（比如 UTF-8 字节）传入是未定义行为。',
            '不要用 cin >> word 读全文：它跳过空白但也跳过换行，无法保留行结构，遇到空行会卡住。getline + istringstream 是标准解法。',
            '如果想把连字符保留为单词的一部分，就在判断里额外允许 - 和 \'，但要先想清楚 "well-known" 算一个词还是两个。'
          ],
          solution: `std::string clean(const std::string& raw) {
    std::string out;
    for (char c : raw) {
        unsigned char u = static_cast<unsigned char>(c);
        if (std::isalnum(u)) out += static_cast<char>(std::tolower(u));
    }
    return out;
}

// 用法：先确认切词对了，再做统计。切词错，后面全错。`
        },
        {
          n: 2,
          title: '计数与排序',
          tasks: [
            '把单词存进 std::unordered_map<std::string, int>，每读到一个就 ++freq[w]。',
            '把 map 的内容拷进 vector<pair<string, int>>，用 std::sort 加 lambda 排序：次数降序，次数相同按字典序升序。',
            '输出前 K 名（K 从第二个命令行参数读，默认 10），格式为「名次. 单词 (次数)」。',
            '统计并输出总词数、不同词数、只出现一次的词数三个指标。',
            '验证：对同一文件跑两次，输出必须完全一致（排序规则要全序，不能有并列歧义）。'
          ],
          starter: `#include <algorithm>
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include <unordered_map>
#include <utility>
#include <vector>

int main(int argc, char** argv) {
    // ... 打开文件、切词 ...

    std::unordered_map<std::string, int> freq;
    // freq[w]++;

    std::vector<std::pair<std::string, int>> items(freq.begin(), freq.end());
    std::sort(items.begin(), items.end(),
              [](const auto& a, const auto& b) {
                  if (a.second != b.second) return a.second > b.second;
                  return a.first < b.first;
              });

    int k = (argc >= 3) ? std::stoi(argv[2]) : 10;
    for (int i = 0; i < k && i < static_cast<int>(items.size()); ++i) {
        std::cout << i + 1 << ". " << items[i].first
                  << " (" << items[i].second << ")\\n";
    }
}`,
          hints: [
            '排序比较器必须满足严格弱序：count 不同时按 count 降序，相同时按单词升序，两条都写才不会有未定义行为。',
            'std::stoi 遇到非法输入会抛 invalid_argument，所以读 K 之前先检查 argv[2] 全是数字，或包一层 try/catch。',
            'unordered_map 的遍历顺序不保证，所以必须排序；如果直接输出 map，两次运行顺序可能不同，测试会挂。'
          ],
          solution: `std::sort(items.begin(), items.end(),
          [](const auto& a, const auto& b) {
              if (a.second != b.second) return a.second > b.second;
              return a.first < b.first;
          });

std::size_t once = 0;
for (const auto& [w, c] : freq) if (c == 1) ++once;

std::cout << "tokens=" << total << " unique=" << freq.size()
          << " once=" << once << "\\n";`
        },
        {
          n: 3,
          title: 'Top-K 优化与异常安全',
          tasks: [
            '把「全排序再取前 K」改成「维护大小为 K 的最小堆」，用 priority_queue 实现，复杂度从 O(m log m) 降到 O(m log K)。',
            '比较两种实现：在 10 万词的输入上，K=10 时各自耗时多少（用 chrono 计时，输出毫秒）。',
            '把文件读取封装成 RAII 的类 FileReader，构造失败抛 std::runtime_error，主函数统一捕获并返回 2。',
            '处理空输入、K=0、K 大于不同词数三种边界，确保不崩溃且输出合理。',
            '写一份 5 行的 README，说明编译命令、用法与复杂度。'
          ],
          starter: `#include <queue>
#include <utility>

// 最小堆：堆顶是当前 Top-K 里次数最少的
using Item = std::pair<int, std::string>;   // (count, word)

std::priority_queue<Item, std::vector<Item>, std::greater<Item>> heap;
for (const auto& [w, c] : freq) {
    heap.push({c, w});
    if (static_cast<int>(heap.size()) > k) heap.pop();
}
// 现在堆里是前 K 名，但顺序是反的，需要再排一次或反向输出
`,
          hints: [
            '最小堆的模板参数很长：priority_queue<pair<int,string>, vector<...>, greater<...>>。greater 比较 pair 时先比 first 再比 second，正好符合「次数最少在堆顶」。',
            '用 pair<int, string> 而不是 pair<string, int>，是因为堆需要按次数比较；如果按单词比较就完全错了。',
            '堆里只剩 K 个元素时，pop 掉的永远是当前最小的，所以留下的一定是最大的 K 个——这就是 Top-K 的核心不变式。',
            'chrono 计时要用 steady_clock，并且把输出关掉（或输出到 /dev/null），否则 IO 时间会盖过算法差异。'
          ],
          solution: `using Item = std::pair<int, std::string>;

std::priority_queue<Item, std::vector<Item>, std::greater<Item>> heap;
for (const auto& kv : freq) {
    heap.push({kv.second, kv.first});
    if (static_cast<int>(heap.size()) > k) heap.pop();
}

std::vector<Item> top;
while (!heap.empty()) { top.push_back(heap.top()); heap.pop(); }
std::reverse(top.begin(), top.end());
for (std::size_t i = 0; i < top.size(); ++i) {
    std::cout << i + 1 << ". " << top[i].second
              << " (" << top[i].first << ")\\n";
}`
        }
      ]
    },

    /* ================================================================ P2 */
    {
      id: 'P2',
      title: '手写容器 Vec&lt;T&gt;',
      en: 'VECTOR FROM SCRATCH',
      tagline: '从 IntVector 到模板化的 Vec&lt;T&gt;，把 Rule of Five 真正写一遍。',
      level: '进阶',
      minutes: 180,
      chapters: ['ch03', 'ch05', 'ch07'],
      goals: [
        '能独立写出正确的析构、拷贝构造、拷贝赋值与移动构造，并说明每一步为什么必要',
        '能把一个具体类型的容器改造成类模板，并处理模板定义位置、显式实例化等工程问题',
        '能用 assert 与小测试覆盖边界：空容器、自赋值、扩容、移动后源对象状态'
      ],
      intro: '标准库的 vector 你天天用，但只有自己写一遍，才知道 size 与 capacity 为什么要分开、' +
        '拷贝赋值为什么要先分配再释放、移动构造为什么必须 noexcept。这个项目的验收标准不是「能跑」，' +
        '而是「用 ASan 跑 100 组测试零报错，并且每个特殊成员函数都能解释清楚」。',
      milestones: [
        {
          n: 1,
          title: 'IntVector：三件套',
          tasks: [
            '实现 IntVector：私有成员 int* data_、std::size_t size_、std::size_t capacity_。',
            '实现 push_back、size、capacity、empty、operator[]（const 与非 const 两个版本）、at（越界抛 out_of_range）。',
            '实现析构、拷贝构造、拷贝赋值，要求深拷贝、防自赋值、返回 *this。',
            '写 20 组测试：空容器 push、连续 push 触发扩容、拷贝后改原对象不影响副本、a = a 自赋值。',
            '用 ASan 编译运行测试，确认零泄漏、零越界。'
          ],
          starter: `#include <cstddef>
#include <stdexcept>

class IntVector {
public:
    IntVector() = default;
    explicit IntVector(std::size_t n) : data_(new int[n]()), size_(n), capacity_(n) {}
    ~IntVector() { delete[] data_; }

    IntVector(const IntVector& other)
        : data_(new int[other.size_]), size_(other.size_), capacity_(other.size_) {
        for (std::size_t i = 0; i < size_; ++i) data_[i] = other.data_[i];
    }

    IntVector& operator=(const IntVector& other) {
        if (this == &other) return *this;
        int* fresh = new int[other.size_];
        for (std::size_t i = 0; i < other.size_; ++i) fresh[i] = other.data_[i];
        delete[] data_;
        data_ = fresh;
        size_ = capacity_ = other.size_;
        return *this;
    }

    void push_back(int value) {
        if (size_ == capacity_) grow(capacity_ ? capacity_ * 2 : 1);
        data_[size_++] = value;
    }

    std::size_t size() const { return size_; }
    std::size_t capacity() const { return capacity_; }
    bool empty() const { return size_ == 0; }

    int& operator[](std::size_t i) { return data_[i]; }
    const int& operator[](std::size_t i) const { return data_[i]; }

private:
    void grow(std::size_t newCap) {
        int* fresh = new int[newCap];
        for (std::size_t i = 0; i < size_; ++i) fresh[i] = data_[i];
        delete[] data_;
        data_ = fresh;
        capacity_ = newCap;
    }

    int* data_ = nullptr;
    std::size_t size_ = 0;
    std::size_t capacity_ = 0;
};`,
          hints: [
            '拷贝赋值里为什么先 new 再 delete？如果先 delete 再 new，而 new 抛 bad_alloc，对象就处于「指针已释放但成员还指着它」的状态，析构会二次释放。',
            'grow 里也要先分配新块、搬完、再释放旧块，理由同上。这叫「强异常安全保证」。',
            'capacity 为 0 时翻倍会一直是 0，所以初始容量要写成 capacity_ ? capacity_ * 2 : 1。',
            '自赋值检查写成 this == &other，不要写成 *this == other（那是值比较，且你没定义 operator==）。'
          ],
          solution: `IntVector& operator=(const IntVector& other) {
    if (this == &other) return *this;          // 防自赋值
    int* fresh = new int[other.size_];         // 先分配，可能抛异常
    for (std::size_t i = 0; i < other.size_; ++i) fresh[i] = other.data_[i];
    delete[] data_;                            // 分配成功后才释放旧的
    data_ = fresh;
    size_ = capacity_ = other.size_;
    return *this;                              // 支持链式赋值
}`
        },
        {
          n: 2,
          title: '模板化：Vec&lt;T&gt;',
          tasks: [
            '把 IntVector 改造成 template <typename T> class Vec，成员函数定义全部放进头文件。',
            '对 T 的要求写清楚：需要可拷贝构造、可拷贝赋值；push_back 用 const T& 接收。',
            '写一个测试：Vec<std::string> 与 Vec<int> 同时使用，确认互不影响。',
            '故意把某个成员函数定义移到 .cpp 里，观察链接错误，记录错误信息，再改回头文件。',
            '为 Vec<int> 在 .cpp 末尾写一次显式实例化 template class Vec<int>;，验证「声明放头、定义放 cpp」也能工作。'
          ],
          starter: `#ifndef VEC_H
#define VEC_H

#include <cstddef>
#include <stdexcept>

template <typename T>
class Vec {
public:
    Vec() = default;
    ~Vec() { delete[] data_; }

    Vec(const Vec& other)
        : data_(new T[other.size_]), size_(other.size_), capacity_(other.size_) {
        for (std::size_t i = 0; i < size_; ++i) data_[i] = other.data_[i];
    }

    Vec& operator=(const Vec& other) {
        if (this == &other) return *this;
        T* fresh = new T[other.size_];
        for (std::size_t i = 0; i < other.size_; ++i) fresh[i] = other.data_[i];
        delete[] data_;
        data_ = fresh;
        size_ = capacity_ = other.size_;
        return *this;
    }

    void push_back(const T& value) {
        if (size_ == capacity_) grow(capacity_ ? capacity_ * 2 : 1);
        data_[size_++] = value;
    }

    std::size_t size() const { return size_; }
    bool empty() const { return size_ == 0; }
    T& operator[](std::size_t i) { return data_[i]; }
    const T& operator[](std::size_t i) const { return data_[i]; }

private:
    void grow(std::size_t newCap) {
        T* fresh = new T[newCap];
        for (std::size_t i = 0; i < size_; ++i) fresh[i] = data_[i];
        delete[] data_;
        data_ = fresh;
        capacity_ = newCap;
    }

    T* data_ = nullptr;
    std::size_t size_ = 0;
    std::size_t capacity_ = 0;
};

#endif`,
          hints: [
            '模板的成员函数在类外定义时，每一处都要重复 template <typename T> 和 Vec<T>:: 前缀，漏一个就编译不过。',
            '两个不同的实例化（Vec<int>、Vec<string>）是完全独立的类型，不能互相赋值，也没有共同基类。',
            '报错 undefined reference to Vec<int>::push_back(int const&) 是模板最典型的链接错误：编译单元只看到声明，没有定义可实例化。',
            '显式实例化要写在能看到全部定义的 .cpp 里：template class Vec<int>; 这会强制生成所有成员。'
          ],
          solution: `// Vec.h 末尾（或单独 Vec.cpp 末尾）
template class Vec<int>;
template class Vec<std::string>;

// 之后其他 .cpp 只需 #include "Vec.h" 就能链接到这两份实例化。
// 但新类型（比如 Vec<double>）仍需要自己的显式实例化，或者干脆把定义放回头文件。`
        },
        {
          n: 3,
          title: '移动语义与 noexcept',
          tasks: [
            '为 Vec 增加移动构造与移动赋值：接管指针，把源对象置空（data_ = nullptr, size_ = capacity_ = 0）。',
            '两个移动函数都标 noexcept，并说明不加会怎样。',
            '验证 Vec<Vec<int>> 扩容时走移动而不是拷贝：在移动构造里打印计数，观察 push_back 触发扩容时的计数。',
            '去掉 noexcept 再跑一次，对比移动计数是否变化，把结论写进 README。',
            '用 ASan + UBSan 跑全部测试，确认移动后源对象析构安全（delete nullptr）。'
          ],
          starter: `Vec(Vec&& other) noexcept
    : data_(other.data_), size_(other.size_), capacity_(other.capacity_) {
    other.data_ = nullptr;
    other.size_ = other.capacity_ = 0;
}

Vec& operator=(Vec&& other) noexcept {
    if (this != &other) {
        delete[] data_;
        data_ = other.data_;
        size_ = other.size_;
        capacity_ = other.capacity_;
        other.data_ = nullptr;
        other.size_ = other.capacity_ = 0;
    }
    return *this;
}`,
          hints: [
            '移动赋值的自赋值检查同样不能省：v = std::move(v) 虽然罕见，但一旦发生，先 delete 再接管就是自己删自己。',
            'noexcept 不是「优化建议」而是接口承诺：vector 的扩容逻辑用 is_nothrow_move_constructible 判断，false 就退回拷贝。',
            '移动后源对象的 data_ 必须是 nullptr，否则它析构时会 delete 已被接管的内存，双重释放。',
            '测试移动计数时，把计数器设为 static 成员或全局变量，并确保 -O2 不会把整个对象优化掉（用 volatile 或打印结果）。'
          ],
          solution: `// 观察点：在移动构造里 ++move_count;
// 1) 有 noexcept：扩容时 move_count 随元素个数增长
// 2) 去掉 noexcept：vector 改用拷贝构造，move_count 不再增长
// 结论：noexcept 直接决定容器扩容走移动还是拷贝。`
        }
      ]
    },

    /* ================================================================ P3 */
    {
      id: 'P3',
      title: '图形报表 ShapeLab',
      en: 'SHAPE LAB',
      tagline: '抽象基类 + 多态容器 + 智能指针 + 异常，做一个可扩展的图形统计程序。',
      level: '挑战',
      minutes: 240,
      chapters: ['ch04', 'ch06', 'ch07'],
      goals: [
        '能用抽象基类定义接口，用 vector<unique_ptr<Shape>> 管理异构对象',
        '能解释虚析构、override、对象切片三者在真实代码中的后果',
        '能把「读配置 → 建对象 → 统计 → 输出」拆成职责清晰的函数，并处理错误输入'
      ],
      intro: '这是本课程的综合项目：它同时用到继承、多态、STL、异常与所有权。' +
        '需求看起来简单——读入若干图形，算总面积、按面积排序、输出报表——但每一层都有考点：' +
        '基类析构不虚会泄漏、按值存进 vector 会切片、用裸指针管理会忘记 delete、' +
        '输入格式错误要给出可读的错误信息而不是崩溃。做完这个项目，第 4 章和第 7 章就真正连起来了。',
      milestones: [
        {
          n: 1,
          title: '抽象基类与三个图形',
          tasks: [
            '定义抽象基类 Shape：纯虚 area()、纯虚 name()、虚析构（= default）。',
            '实现 Circle（半径）、Rect（宽高）、Triangle（三边，用海伦公式算面积）三个派生类，构造函数校验参数（非正数抛 invalid_argument）。',
            '为每个派生类写 override，并用 -Wall -Wextra 编译确认没有签名警告。',
            '故意把某个 override 的参数写成非 const，观察编译错误，理解 override 的作用。',
            '为三个类各写一组单元测试：正常值、边界值（半径 0）、异常输入。'
          ],
          starter: `#include <cmath>
#include <stdexcept>
#include <string>

class Shape {
public:
    virtual double area() const = 0;
    virtual std::string name() const = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {
public:
    explicit Circle(double r) : r_(r) {
        if (r <= 0) throw std::invalid_argument("radius must be positive");
    }
    double area() const override { return 3.141592653589793 * r_ * r_; }
    std::string name() const override { return "circle"; }
private:
    double r_;
};

class Rect : public Shape {
public:
    Rect(double w, double h) : w_(w), h_(h) {
        if (w <= 0 || h <= 0) throw std::invalid_argument("rect sides must be positive");
    }
    double area() const override { return w_ * h_; }
    std::string name() const override { return "rect"; }
private:
    double w_, h_;
};

class Triangle : public Shape {
public:
    Triangle(double a, double b, double c) : a_(a), b_(b), c_(c) {
        if (a <= 0 || b <= 0 || c <= 0) throw std::invalid_argument("sides must be positive");
        if (a + b <= c || a + c <= b || b + c <= a)
            throw std::invalid_argument("violates triangle inequality");
    }
    double area() const override {
        double s = (a_ + b_ + c_) / 2;
        return std::sqrt(s * (s - a_) * (s - b_) * (s - c_));
    }
    std::string name() const override { return "triangle"; }
private:
    double a_, b_, c_;
};`,
          hints: [
            '基类析构必须 virtual：main 里用 Shape* 或 unique_ptr<Shape> 持有时，delete 才会调用派生类析构。写成 virtual ~Shape() = default; 即可。',
            '纯虚函数让 Shape 不能实例化，这是「接口」而不是「半成品类」的正确表达。',
            '海伦公式要求三边满足三角不等式，否则 sqrt 里会出现负数，结果是 nan——所以在构造函数里就拦住。',
            'override 不是装饰：签名不一致（比如少了 const）时它会直接编译报错，而不加 override 只会「悄悄没重写」。'
          ],
          solution: `// 关键点复查：
// 1. virtual ~Shape() = default;       多态删除安全
// 2. double area() const = 0;          纯虚，Shape 抽象
// 3. 三个派生类都写 override           签名错误立即暴露
// 4. 构造函数校验参数并抛 invalid_argument`
        },
        {
          n: 2,
          title: '多态容器与对象切片',
          tasks: [
            '用 std::vector<std::unique_ptr<Shape>> 保存所有图形，写 add 函数按类型字符串创建对象。',
            '实现 total_area()：遍历容器调用 area()，验证动态绑定生效。',
            '做一个对照实验：把这些对象按值存进 vector<Shape>，观察编译错误或对象切片；把结论写进注释。',
            '用 std::sort 按面积降序排序（注意容器里是指针，比较器要解引用）。',
            '用 std::accumulate 求总面积，初值写 0.0，确认不会截断小数。'
          ],
          starter: `#include <algorithm>
#include <memory>
#include <numeric>
#include <vector>

std::vector<std::unique_ptr<Shape>> shapes;
shapes.push_back(std::make_unique<Circle>(2.0));
shapes.push_back(std::make_unique<Rect>(3.0, 4.0));
shapes.push_back(std::make_unique<Triangle>(3.0, 4.0, 5.0));

double total = std::accumulate(
    shapes.begin(), shapes.end(), 0.0,
    [](double acc, const std::unique_ptr<Shape>& p) { return acc + p->area(); });

std::sort(shapes.begin(), shapes.end(),
          [](const auto& a, const auto& b) { return a->area() > b->area(); });`,
          hints: [
            '不要用 vector<Shape>：Shape 是抽象类，编译都过不了；即使不是抽象类，按值存也会切片。',
            'unique_ptr 不能拷贝，所以容器里存的是 unique_ptr 的「移动」；push_back(make_unique<T>(...)) 是标准写法。',
            'sort 的比较器接收的是 unique_ptr 的引用，要写 a->area() 而不是 a.area()。',
            'accumulate 的 lambda 第一个参数是累积值（double），第二个是元素；返回类型要一致，否则会被截断。'
          ],
          solution: `double total_area(const std::vector<std::unique_ptr<Shape>>& v) {
    double sum = 0.0;
    for (const auto& p : v) sum += p->area();
    return sum;
}

// 对照实验结论：
// vector<Shape> 无法编译（Shape 抽象）；
// 若 Shape 非抽象，push_back(Circle) 会切片，area() 调用基类版本，结果错误。`
        },
        {
          n: 3,
          title: '读入配置与错误处理',
          tasks: [
            '定义文本格式：每行「类型 参数1 参数2 ...」，例如 circle 2.0 / rect 3 4 / triangle 3 4 5。',
            '实现 parse_line：拆词、校验参数个数、把字符串转 double；任何一步失败抛 runtime_error，消息里带行号。',
            '用 try/catch 包住整个读取循环：单行错误跳过并记录，不要因为一行坏数据终止整个程序。',
            '统计成功与失败行数，最后打印汇总；错误信息统一输出到 std::cerr。',
            '用一个包含 5 行合法、3 行非法（缺参数、负数、非数字）的测试文件验证。'
          ],
          starter: `#include <sstream>
#include <stdexcept>
#include <string>

std::unique_ptr<Shape> parse_line(const std::string& line, int lineno) {
    std::istringstream iss(line);
    std::string kind;
    if (!(iss >> kind)) throw std::runtime_error("line " + std::to_string(lineno) + ": empty");

    if (kind == "circle") {
        double r;
        if (!(iss >> r)) throw std::runtime_error("line " + std::to_string(lineno) + ": bad radius");
        return std::make_unique<Circle>(r);
    }
    // rect / triangle 同理
    throw std::runtime_error("line " + std::to_string(lineno) + ": unknown shape " + kind);
}`,
          hints: [
            '把行号传进 parse_line，错误消息才有定位价值；这是「可读错误信息」的最低要求。',
            'iss >> r 失败时 r 的值不确定，必须检查流状态，不能读完直接用。',
            'catch 里用 const std::exception& 接，可以同时捕获 invalid_argument 与 runtime_error；不要 catch(...) 后什么也不做。',
            '单行失败不应该让整个程序退出：记录错误行号、继续读下一行，最后统一汇报。'
          ],
          solution: `int ok = 0, bad = 0;
std::string line;
int lineno = 0;
while (std::getline(in, line)) {
    ++lineno;
    try {
        shapes.push_back(parse_line(line, lineno));
        ++ok;
    } catch (const std::exception& e) {
        std::cerr << "skip: " << e.what() << "\\n";
        ++bad;
    }
}
std::cout << "loaded=" << ok << " skipped=" << bad << "\\n";`
        },
        {
          n: 4,
          title: '报表输出与扩展',
          tasks: [
            '输出报表：表头、每行「名称 面积」、分隔线、总计；面积保留两位小数（fixed + setprecision）。',
            '增加一个「按类型分组统计」的功能：unordered_map<string, pair<int, double>> 记录每类个数与总面积。',
            '新增 RegularPolygon（正 n 边形，边长 s）派生类，要求不改动 total_area、排序与报表代码——验证开闭原则。',
            '把报表写成函数 print_report(const vector<unique_ptr<Shape>>&, ostream&)，默认输出 cout，方便测试时输出到 stringstream。',
            '用 ASan 跑完整流程，确认没有泄漏；用 valgrind（若可用）复核。'
          ],
          starter: `#include <iomanip>
#include <iostream>

void print_report(const std::vector<std::unique_ptr<Shape>>& v,
                  std::ostream& os = std::cout) {
    os << std::fixed << std::setprecision(2);
    os << "name       area\\n";
    os << "----------------\\n";
    double total = 0;
    for (const auto& p : v) {
        os << std::setw(10) << std::left << p->name()
           << std::setw(10) << std::right << p->area() << "\\n";
        total += p->area();
    }
    os << "----------------\\n";
    os << "total      " << total << "\\n";
}`,
          hints: [
            'setw 只对「下一次」输出生效，所以每个字段前都要写；setprecision 与 fixed 会持续生效，写一次即可。',
            '输出流作为参数用 std::ostream&，这样既能传 cout 也能传 ostringstream，测试时不用抓屏。',
            '新增派生类不需要改任何统计代码，只要它实现 area() 与 name()——这就是多态带来的扩展点。',
            '报表里的中文对齐要考虑显示宽度，终端里一个汉字占两列；简单做法是只用英文表头。'
          ],
          solution: `class RegularPolygon : public Shape {
public:
    RegularPolygon(int n, double side) : n_(n), side_(side) {
        if (n < 3 || side <= 0) throw std::invalid_argument("bad polygon");
    }
    double area() const override {
        return n_ * side_ * side_ / (4.0 * std::tan(3.141592653589793 / n_));
    }
    std::string name() const override {
        return "polygon-" + std::to_string(n_);
    }
private:
    int n_;
    double side_;
};

// total_area、sort、print_report 一行都不用改。`
        }
      ]
    }
  ]);
})();
