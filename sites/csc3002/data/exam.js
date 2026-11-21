/* =====================================================================
 * exam.js · CSC3002 模拟卷 A
 * 范围：ch00–ch07（类型系统 / 指针与内存 / 类与对象 / 继承多态 /
 *       模板 / STL / 异常与资源管理）
 * 规格：12 题、满分 100、限时 90 分钟
 * 题型：choice / tf / fill / output / keywords
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerExam({
    id: 'CSC3002-A',
    title: 'C++ 程序设计 模拟卷 A',
    style: '期末风格',
    subtitle: 'CSC3002 · 覆盖 ch00–ch07 的综合模拟',
    date: '2026-11-21',
    minutes: 90,
    totalScore: 100,
    summary: '本卷覆盖八章全部内容：类型与表达式、指针与内存、类与生命周期、继承与多态、' +
      '模板、STL、异常与移动语义。卷面 12 题：选择 4 分×4、判断 4 分×4、填空 4 分×4、' +
      '读代码写输出 4 题共 34 分、简答与写代码 4 题共 34 分。建议闭卷限时完成，' +
      '读代码题务必在纸上手动跟踪变量，不要凭感觉。',
    instructions: [
      '时间 90 分钟，满分 100 分。计时开始后不会暂停，刷新页面也按真实时间计算。',
      '题型：单项选择 4 小问、判断 4 小问、填空 4 小问、读代码写输出 4 题、简答与写代码 4 题。',
      '读代码题按行比对，输出中的空格与换行都要写对；简答题按关键词命中比例给分，答出要点即可。',
      '涉及标准库的题默认使用 C++17，编译选项为 g++ -std=c++17 -Wall。',
      '写代码题只要求写出关键部分（函数或类），不必写 #include 与 main，但签名必须完整。'
    ],
    questions: [

      /* ---------------------------------------------------------- Q1 */
      { no: 1, points: 8, type: 'single choice',
        intro: '本题考察类型、初始化与整数运算。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '下面哪条语句会产生<b>编译错误</b>？',
            options: [
              { text: '<code>int a = 3.9;</code>' },
              { text: '<code>int b{3.9};</code>', correct: true },
              { text: '<code>double c = 3;</code>' },
              { text: '<code>auto d = 3.9;</code>' }
            ],
            explain: '花括号初始化禁止窄化转换：double 到 int 会丢小数，编译器直接报错。' +
              '<code>int a = 3.9</code> 是拷贝初始化，只静默截断为 3；<code>double c = 3</code> 是安全的加宽；' +
              '<code>auto d</code> 推导为 double，没有问题。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '表达式 <code>-7 / 2</code> 与 <code>-7 % 2</code> 的值分别是：',
            options: [
              { text: '-3 和 -1', correct: true },
              { text: '-3 和 1' },
              { text: '-4 和 1' },
              { text: '-4 和 -1' }
            ],
            explain: 'C++11 规定整数除法向零截断，-7/2 = -3（不是向下取整的 -4）；' +
              '余数的符号随被除数，所以 -7%2 = -1。这与 Python 的行为不同，移植代码时要特别注意。' }
        ] },

      /* ---------------------------------------------------------- Q2 */
      { no: 2, points: 8, type: 'true / false',
        intro: '判断下列陈述的真假。',
        parts: [
          { label: '(a)', points: 4, kind: 'tf',
            prompt: '用 <code>new[]</code> 分配的内存，可以用 <code>delete</code>（不带方括号）释放。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '必须严格配对：<code>new[]</code> 配 <code>delete[]</code>，<code>new</code> 配 <code>delete</code>。' +
              '混用是未定义行为——数组的分配块前面通常记录了元素个数，用标量 delete 只会析构第一个元素，' +
              '其余元素的析构函数被跳过，堆管理器也可能因此崩溃。' },
          { label: '(b)', points: 4, kind: 'tf',
            prompt: '在 <code>const</code> 成员函数内部，不能修改被声明为 <code>mutable</code> 的成员变量。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '恰恰相反：<code>mutable</code> 的存在意义就是允许在 const 成员函数中修改它，' +
              '典型用途是缓存、引用计数、互斥锁。const 成员函数里 <code>this</code> 是 <code>const T*</code>，' +
              '普通成员不可改，mutable 成员可以。' }
        ] },

      /* ---------------------------------------------------------- Q3 */
      { no: 3, points: 8, type: 'fill in the blank',
        intro: '把答案写在横线处。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '要让 <code>a = b = c;</code> 这样的连续赋值成立，拷贝赋值运算符的返回类型应为 ______。',
            answer: '*this 的引用',
            accept: ['引用', 'T&', '自身的引用', '*this'],
            explain: '赋值运算符返回 <code>*this</code> 的引用，赋值表达式的结果就是左操作数本身，' +
              '于是可以继续参与下一次赋值。<b>必须返回引用</b>：返回 void 会让链式写法编译失败，' +
              '返回值则多一次拷贝，且对自定义类型可能产生意外副作用。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '遍历 <code>vector</code> 时删除满足条件的元素，<code>v.erase(it)</code> 的返回值是 ______。',
            answer: '被删元素之后的那个迭代器',
            accept: ['下一个有效迭代器', '下一个元素的迭代器', '指向下一个元素的迭代器', '下一个位置'],
            explain: 'erase 会使被删元素及其后的迭代器失效，但它返回指向「被删元素之后」的有效迭代器。' +
              '正确写法是 <code>it = v.erase(it);</code>，不要在这个分支里再 <code>++it</code>，' +
              '否则跳过元素甚至解引用失效迭代器。' }
        ] },

      /* ---------------------------------------------------------- Q4 */
      { no: 4, points: 8, type: 'read the code',
        intro: '写出下面程序的输出；注意空格与换行。',
        parts: [
          { label: '(a)', points: 4, kind: 'output',
            prompt: '程序输出是什么？',
            code: '#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> v = {1, 2, 3, 4, 5};\n    for (auto it = v.begin(); it != v.end(); ) {\n        if (*it % 2 == 0) it = v.erase(it);\n        else ++it;\n    }\n    for (int x : v) std::cout << x << " ";\n}',
            answer: '1 3 5 ',
            accept: ['1 3 5'],
            explain: '循环删除偶数：2 和 4 被 erase，剩余 1、3、5。关键在于 erase 返回值接住下一个位置，' +
              '奇数分支才前进。若写成 <code>for (...; ++it)</code> 并在循环体里 erase，' +
              '会跳过被删元素的后一个元素，同时可能解引用已失效的迭代器。' },
          { label: '(b)', points: 4, kind: 'output',
            prompt: '程序输出是什么？',
            code: '#include <iostream>\n\nint main() {\n    int a[4] = {10, 20, 30, 40};\n    int* p = a + 1;\n    std::cout << *p << " " << p[2] << "\\n";\n    std::cout << p - a << "\\n";\n}',
            answer: '20 40\n1',
            accept: ['20 40', '20 40 1'],
            explain: 'p 指向 a[1]，*p = 20；p[2] 等价 *(p+2) = a[3] = 40；两个同类型指针相减得到' +
              '<b>元素个数差</b>，p - a = 1，而不是 4 字节。指针加法按所指类型的大小缩放。' }
        ] },

      /* ---------------------------------------------------------- Q5 */
      { no: 5, points: 8, type: 'read the code',
        intro: '写出下面程序的输出，并说明每行来自哪次函数调用。',
        parts: [
          { label: '(a)', points: 4, kind: 'output',
            prompt: '程序输出什么？',
            code: '#include <iostream>\n\nstruct Base {\n    virtual void show() const { std::cout << "B"; }\n    virtual ~Base() = default;\n};\n\nstruct Derived : Base {\n    void show() const override { std::cout << "D"; }\n};\n\nint main() {\n    Derived d;\n    Base& r = d;\n    Base v = d;\n    r.show();\n    v.show();\n    std::cout << "\\n";\n}',
            answer: 'DB',
            accept: ['D B', 'DB\\n'],
            explain: 'r 是基类引用，动态类型仍是 Derived，虚函数按动态类型分派，输出 D。' +
              'v 是 Base 类型的对象，d 被<b>对象切片</b>，只剩基类子对象，输出 B。' +
              '这是「多态必须通过指针或引用」的最直接反例。' },
          { label: '(b)', points: 4, kind: 'output',
            prompt: '若把 <code>virtual ~Base() = default;</code> 删掉，再执行 <code>Base* p = new Derived; delete p;</code>，' +
              '会有什么问题？用一句话写出后果。',
            answer: '只调用基类析构函数，派生类部分不释放，造成资源泄漏',
            accept: ['析构不完整', '派生类析构不被调用', '内存泄漏', '未定义行为'],
            explain: '析构函数非虚时按静态类型调用，<code>delete Base*</code> 只执行 <code>~Base()</code>，' +
              'Derived 的成员（尤其是它持有的堆资源）不会被析构。规则：只要类可能被多态删除，' +
              '基类析构就必须是虚的。' }
        ] },

      /* ---------------------------------------------------------- Q6 */
      { no: 6, points: 8, type: 'find the bug',
        intro: '下面这段代码在 64 位平台上有两处问题，请指出并给出修正。',
        parts: [
          { label: '(a)', points: 4, kind: 'keywords',
            prompt: '指出这段代码的问题（写出关键原因即可）。',
            code: 'void print_reverse(const std::vector<int>& v) {\n    for (int i = v.size() - 1; i >= 0; --i) {\n        std::cout << v[i] << " ";\n    }\n}',
            keywords: ['无符号', 'size_t', 'i >= 0 恒真', '越界', '下溢'],
            explain: 'v.size() 返回无符号的 <code>size_t</code>，<code>v.size() - 1</code> 在空容器时下溢成极大值；' +
              '即便非空，比较 <code>i >= 0</code> 时 i 会被转成无符号，条件恒真，i 减到 -1 后变成巨大正数，' +
              '<code>v[i]</code> 越界。修正：用 <code>size_t i = v.size(); i-- &gt; 0;</code>，' +
              '或用反向迭代器 <code>for (auto it = v.rbegin(); it != v.rend(); ++it)</code>。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '写出修正后的循环（一行核心语句即可描述）。',
            keywords: [['i-- > 0', 'i--&gt;0', 'i--'], 'rbegin', 'size_t', '迭代器'],
            explain: '两种标准写法：其一 <code>for (size_t i = v.size(); i-- &gt; 0; )</code>，' +
              '先判断后自减，天然避开下溢；其二反向迭代器 <code>rbegin()/rend()</code>，' +
              '语义最清楚，也不会碰无符号比较。核心是把「减到 -1 再判断」改成「先判断再减」。' }
        ] },

      /* ---------------------------------------------------------- Q7 */
      { no: 7, points: 8, type: 'write code',
        intro: '模板与泛型编程。',
        parts: [
          { label: '(a)', points: 4, kind: 'keywords',
            prompt: '写一个函数模板 <code>clamp_to</code>，把值限制在 [lo, hi] 区间内：小于 lo 返回 lo，大于 hi 返回 hi，否则原样返回。',
            keywords: ['template', 'typename', 'const T&', 'return', 'if'],
            explain: '参考实现：<code>template &lt;typename T&gt; T clamp_to(const T&amp; v, const T&amp; lo, const T&amp; hi) ' +
              '{ if (v &lt; lo) return lo; if (v &gt; hi) return hi; return v; }</code>。' +
              '参数用 const 引用避免大对象拷贝；三个参数同一类型 T，保证比较有意义。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '如果把上面模板的定义放进 <code>clamp_to.cpp</code>、只在头文件留声明，会发生什么？为什么？',
            keywords: ['undefined reference', '链接错误', '实例化', '头文件', '看不到定义'],
            explain: '编译器在实例化时必须看到完整定义。只有声明时，调用处会生成一条外部符号引用，' +
              '而 .cpp 里没有针对该类型的实例化代码，链接阶段报 <code>undefined reference</code>。' +
              '所以模板定义通常整个放头文件，或在 .cpp 末尾显式实例化需要的类型。' }
        ] },

      /* ---------------------------------------------------------- Q8 */
      { no: 8, points: 8, type: 'single choice',
        intro: '本题考察类与对象、继承的细节。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '一个类需要管理裸指针成员，下面哪种做法最符合 Rule of Three？',
            options: [
              { text: '只写析构函数，拷贝用编译器生成的浅拷贝' },
              { text: '同时定义析构、拷贝构造、拷贝赋值，三者都正确处理那块内存', correct: true },
              { text: '把成员改成 public，让调用者自己 delete' },
              { text: '禁止一切对象拷贝，包括返回值优化' }
            ],
            explain: '编译器生成的拷贝是逐成员浅拷贝，两个对象会持有同一块内存，析构时双重 delete。' +
              'Rule of Three 要求三者同时自定义：析构释放、拷贝构造深拷贝、拷贝赋值先释放再深拷贝并防自赋值。' +
              '更好的现代做法是用 <code>unique_ptr</code>/<code>vector</code> 做成员，退化成 Rule of Zero。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '关于继承中的构造与析构顺序，正确的是：',
            options: [
              { text: '先构造派生类，再构造基类；析构顺序相同' },
              { text: '先构造基类，再构造派生类；析构顺序相反', correct: true },
              { text: '构造与析构都由虚函数表决定' },
              { text: '派生类可以在自己的构造函数体里直接调用基类构造函数' }
            ],
            explain: '基类子对象必须先就位，派生类才能使用它，所以构造顺序是基类 → 成员 → 派生类体；' +
              '析构严格逆序。基类构造只能通过初始化列表调用，不能写在函数体里——那时基类已经构造完了。' }
        ] },

      /* ---------------------------------------------------------- Q9 */
      { no: 9, points: 8, type: 'fill in the blank',
        intro: '本题考察 STL 与资源管理。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '用 <code>std::map&lt;std::string, int&gt; m;</code> 查询 key 是否存在，' +
              '不应使用 <code>m[key]</code>，因为它会 ______。',
            answer: '在 key 不存在时插入一个默认值',
            accept: ['插入', '插入新元素', '插入默认值', '改变容器大小'],
            explain: '<code>operator[]</code> 的语义是「取引用，不存在就创建」，所以查询会污染容器，' +
              '循环里查还会让 map 无限增长。查存在用 <code>find</code>（返回迭代器）或 <code>count</code>（返回 0/1），' +
              '只在确定要写入时才用 <code>[]</code>。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '移动构造函数应声明为 ______，否则 <code>vector</code> 扩容时会退化为拷贝。',
            answer: 'noexcept',
            accept: ['noexcept 不抛异常', '不抛异常', 'noexcept(true)'],
            explain: '扩容时如果移动到一半抛异常，旧缓冲区已被改坏、无法回滚；拷贝则可以放弃新缓冲区、保持原状。' +
              '因此标准库容器只在移动构造声明 <code>noexcept</code> 时才敢用移动。漏写这个关键字，' +
              '性能可能差一个数量级，而且不会有任何编译警告。' }
        ] },

      /* ---------------------------------------------------------- Q10 */
      { no: 10, points: 10, type: 'read the code',
        intro: '这道题考察拷贝构造、析构与对象生命周期，请写出完整输出。',
        parts: [
          { label: '(a)', points: 5, kind: 'output',
            prompt: '程序输出什么？按执行顺序写出所有标记。',
            code: '#include <iostream>\n\nstruct Track {\n    Track() { std::cout << "ctor "; }\n    Track(const Track&) { std::cout << "copy "; }\n    Track& operator=(const Track&) { std::cout << "assign "; return *this; }\n    ~Track() { std::cout << "dtor "; }\n};\n\nint main() {\n    Track a;\n    Track b = a;\n    Track c;\n    c = a;\n    std::cout << "end\\n";\n}',
            answer: 'ctor copy ctor assign end dtor dtor dtor',
            accept: ['ctor copy ctor assign end dtor dtor dtor '],
            explain: '<code>Track b = a;</code> 是<b>初始化</b>，调用拷贝构造（copy）；' +
              '<code>c = a;</code> 中 c 已存在，调用拷贝赋值（assign）。' +
              'main 结束时三个对象按构造逆序析构，打印三次 dtor。' +
              '区分「初始化」与「赋值」是这类题的得分点：<code>=</code> 在定义处是初始化，在已有对象上是赋值。' },
          { label: '(b)', points: 5, kind: 'keywords',
            prompt: '如果把 <code>Track b = a;</code> 改成 <code>Track b = std::move(a);</code>，' +
              '并且类里补上移动构造（同样打印 "move"），输出会怎样变化？说明理由。',
            keywords: ['move', '移动构造', '不再 copy', 'a 被置空', 'noexcept'],
            explain: '<code>std::move(a)</code> 把 a 转成右值，重载解析优先选移动构造，输出变成 ' +
              '<code>ctor move ctor assign end dtor dtor dtor</code>。移动构造接管 a 的资源并把 a 置成空状态，' +
              'a 仍然有效但内容未指定，析构时不能重复释放。前提是移动构造存在且最好标 <code>noexcept</code>。' }
        ] },

      /* ---------------------------------------------------------- Q11 */
      { no: 11, points: 10, type: 'design',
        intro: '资源管理与 RAII。',
        parts: [
          { label: '(a)', points: 5, kind: 'keywords',
            prompt: '用 RAII 设计一个 <code>FileHandle</code> 类：构造函数接收文件名并打开文件，打开失败抛异常；' +
              '析构函数负责关闭；禁止拷贝、允许移动。写出类骨架（成员与四个特殊成员函数的声明即可）。',
            keywords: ['explicit', '析构', '= delete', 'noexcept', '移动构造', 'fstream'],
            explain: '骨架：<code>class FileHandle { public: explicit FileHandle(const std::string&amp;); ' +
              '~FileHandle(); FileHandle(const FileHandle&amp;) = delete; ' +
              'FileHandle&amp; operator=(const FileHandle&amp;) = delete; ' +
              'FileHandle(FileHandle&amp;&amp;) noexcept = default; ' +
              'FileHandle&amp; operator=(FileHandle&amp;&amp;) noexcept = default; private: std::ifstream in_; };</code>' +
              '析构可以 <code>= default</code>，因为 ifstream 自己关文件——这正是 Rule of Zero。' },
          { label: '(b)', points: 5, kind: 'keywords',
            prompt: '说明为什么禁止拷贝、允许移动，以及构造函数抛异常时资源会不会泄漏。',
            keywords: ['文件句柄唯一', '双重关闭', '所有权转移', '构造函数抛异常', '析构不会被调用', '不会泄漏'],
            explain: '文件句柄是独占资源，两个对象持同一个句柄会双重关闭；移动则把句柄转移，源对象置空。' +
              '构造函数抛异常时，该对象尚未构造完成，析构函数<b>不会</b>被调用——所以构造中打开文件失败必须在抛出前' +
              '自行清理，或者干脆让 <code>ifstream</code> 的构造函数处理（它失败时不持有资源）。' }
        ] },

      /* ---------------------------------------------------------- Q12 */
      { no: 12, points: 8, type: 'design',
        intro: '继承、多态与设计取舍。',
        parts: [
          { label: '(a)', points: 4, kind: 'keywords',
            prompt: '设计一个抽象基类 <code>Shape</code>，要求：不能实例化；提供 <code>area()</code> 与 <code>name()</code> 两个接口；' +
              '支持通过 <code>Shape*</code> 安全删除派生类对象。写出关键声明。',
            keywords: ['= 0', '纯虚函数', 'virtual ~Shape', 'override', 'const'],
            explain: '<code>struct Shape { virtual double area() const = 0; virtual std::string name() const = 0; ' +
              'virtual ~Shape() = default; };</code> 两个纯虚函数使 Shape 抽象；虚析构保证 <code>delete Shape*</code> ' +
              '会调用完整析构链。派生类用 <code>override</code> 让签名错误在编译期暴露。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '如果要实现一个「只能 push/pop/top 的栈」，应该继承 <code>std::vector</code> 还是包含它？说明两条理由。',
            keywords: ['组合', 'has-a', 'is-a', '暴露无关接口', '私有成员'],
            explain: '应该<b>包含</b>（组合）：栈与 vector 是 has-a 关系，不是 is-a。' +
              '继承会把 vector 的全部接口（<code>insert</code>、<code>operator[]</code>、<code>erase</code>）暴露出去，' +
              '破坏栈的不变量；组合只需把 vector 作为私有成员，对外只暴露三个操作，还能自由替换底层容器。' }
        ] }
    ]
  });
})();
