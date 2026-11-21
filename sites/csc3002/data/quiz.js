/* =====================================================================
 * quiz.js · CSC3002 分章题库
 * 结构：{ items:[{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options?, answer?, accept?, code?, explain }] }
 * 题型：mcq / tf / fill / multi / predict
 * 覆盖：ch00–ch07，每章 7 题，共 56 题
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-8', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '本站把八章内容串成一条主线，下面哪条描述最准确？',
        options: [
          { text: '语法 → 算法 → 数据结构 → 操作系统' },
          { text: '类型与值 → 内存与地址 → 类与对象 → 继承多态 → 泛型 → 标准库 → 资源与所有权', correct: true },
          { text: '变量 → 循环 → 函数 → 文件 → 图形界面' },
          { text: 'C 语言基础 → Java 对比 → Python 互操作 → 项目实战' }
        ],
        explain: '八章是一条递进链：先弄清「值怎么表示」（ch01），再弄清「值放在哪」（ch02），然后用类把数据和操作绑起来（ch03），用继承表达接口一致而行为不同（ch04），用模板把类型参数化（ch05），用 STL 复用现成容器与算法（ch06），最后用异常、RAII、移动语义管好资源（ch07）。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: 'C++ 源码由编译器一次性翻译成机器码，运行时不需要解释器逐行解释。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'C++ 是编译型语言：预处理 → 编译 → 汇编 → 链接，产出可执行文件。运行时没有解释器参与，所以启动快、可预测，但跨平台要针对每个平台重新编译。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'multi', difficulty: 2,
        tags: ['tool'],
        stem: '用 g++ 编译一个多文件项目时，下面哪些旗标是本站推荐加的？（多选）',
        options: [
          { text: '<code>-std=c++17</code>', correct: true },
          { text: '<code>-Wall -Wextra</code>', correct: true },
          { text: '<code>-g</code>（需要调试时）', correct: true },
          { text: '<code>-fno-exceptions</code> 用于关闭异常以提速' },
          { text: '<code>-O3</code> 在调试阶段务必加上' }
        ],
        explain: '标准版本、警告、调试信息是日常三件套。关闭异常会让 try/catch 与标准库的部分行为失效，不适合本课程；-O3 会重排代码、影响单步调试，调试阶段应保持 -O0。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['tool'],
        stem: '编译时报 <code>undefined reference to \'foo()\'</code>，最可能的原因是什么？',
        options: [
          { text: '头文件忘记写 <code>#include</code>' },
          { text: '函数只有声明没有定义，或定义所在的 .cpp 没有参与链接', correct: true },
          { text: '变量名拼写错误' },
          { text: '少写了分号' }
        ],
        explain: 'undefined reference 是链接期错误：编译单元里看到了声明所以编译通过，但链接器找不到实现。常见于忘记把 foo.cpp 加进编译命令，或模板定义被放进了 .cpp。缺 include 报的是编译期「未声明」。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '一个 C++ 程序从源码到可执行文件要经过四个阶段，依次是预处理、编译、汇编和 ______。',
        answer: '链接',
        accept: ['链接（linking）', 'linking', '链接阶段'],
        explain: '预处理展开宏与 include，编译生成汇编，汇编生成目标文件 .o，链接把多个 .o 和库合并成可执行文件。链接期才会检查「声明了但没定义」的符号。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: '#include <iostream>\n\nint main() {\n    int a = 7;\n    int b = 2;\n    std::cout << a / b << " " << a % b << "\\n";\n    double c = a / b;\n    std::cout << c << "\\n";\n}',
        stem: '这段程序的输出是什么？',
        answer: '3 1\n3',
        accept: ['3 1\\n3', '3 1 3'],
        explain: '整数相除截断：7/2 = 3，7%2 = 1。第三行看似得到 3.5，但 a/b 先按 int 算完等于 3，再转成 double 赋给 c，所以输出 3 而不是 3.5。要得到 3.5 必须写 static_cast<double>(a)/b。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '按本站建议，学完一章后最有效的下一步是什么？',
        options: [
          { text: '立刻刷下一章的视频' },
          { text: '合上正文做自检清单，再挑一个项目里程碑动手实现', correct: true },
          { text: '把本章所有代码抄一遍' },
          { text: '只背术语表里的英文缩写' }
        ],
        explain: '自检清单暴露「以为懂了其实说不清」的地方，项目里程碑把这些点变成能跑通的代码。抄代码不产生理解，跳过自检会把漏洞带到后面章节。'
      },

      /* ---------------- ch01 基础与类型系统 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '执行 <code>int x{3.9};</code> 会发生什么？',
        options: [
          { text: 'x 等于 3，小数部分被截断' },
          { text: '编译报错：列表初始化不允许窄化转换', correct: true },
          { text: 'x 等于 4，四舍五入' },
          { text: '运行时抛异常' }
        ],
        explain: '花括号初始化会检查窄化：double 到 int 会丢小数，编译器直接报错。这是它优于赋值初始化的地方——圆的面积改用 int 存，错误在编译期就被拦住，而不是运行到一半才发现。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '在 IEEE 754 双精度下，表达式 <code>0.1 + 0.2 == 0.3</code> 的值为 true。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '0.1、0.2、0.3 都无法用二进制精确表示，0.1+0.2 得到 0.30000000000000004，与 0.3 不相等。浮点数比较要用 |a-b| < 1e-9 这类容差写法。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些写法属于「窄化转换」，用花括号初始化时会编译失败？（多选）',
        options: [
          { text: '<code>int a{3.5};</code>', correct: true },
          { text: '<code>char c{1000};</code>', correct: true },
          { text: '<code>double d{3};</code>' },
          { text: '<code>int b = 3.5;</code>' },
          { text: '<code>long long n{42};</code>' }
        ],
        explain: 'double→int、int→char（超范围）都是窄化。int b = 3.5 是拷贝初始化，不检查窄化，只会静默截断成 3。int→double 与 int→long long 是安全的加宽，允许。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '<code>-7 / 2</code> 与 <code>-7 % 2</code> 在 C++11 之后分别等于？',
        options: [
          { text: '-3 和 -1', correct: true },
          { text: '-3 和 1' },
          { text: '-4 和 1' },
          { text: '-3.5 和 -1' }
        ],
        explain: 'C++11 规定整数除法向零截断，所以 -7/2 = -3；余数符号随被除数，-7%2 = -1。这与 Python 的向下取整不同（Python 里是 -4 和 1），跨语言移植时要注意。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-1', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '32 位有符号 int 用补码表示，其最大值为 2147483647，最小值为 ______。',
        answer: '-2147483648',
        accept: ['-2^31', '-2147483648（即 -2 的 31 次方）'],
        explain: '补码范围不对称：负数比正数多一个。int 溢出是未定义行为，不是回绕（unsigned 才回绕），所以检测上限要用 INT_MAX 而不是等它变成负数。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'predict', difficulty: 3,
        tags: ['code'],
        code: '#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> v = {1, 2, 3};\n    for (int i = v.size() - 1; i >= 0; --i)\n        std::cout << v[i] << " ";\n}',
        stem: '这段程序在 64 位平台上有问题，它的实际输出（或行为）是什么？',
        answer: '没有任何输出，循环一次都不执行',
        accept: ['不输出', '死循环后崩溃', '无输出'],
        explain: 'v.size() 返回无符号的 size_t，v.size()-1 仍是 unsigned。i 被声明为 int，比较时 i 先转成 unsigned，i >= 0 恒真；但 i=0 时 --i 变成 -1，转 unsigned 是巨大正数，v[i] 越界。正确写法是用 size_t 并写成 i-- > 0，或直接用反向迭代器。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['code'],
        stem: '先 <code>cin &gt;&gt; n;</code> 再 <code>getline(cin, line);</code>，line 常常是空串，原因是什么？',
        options: [
          { text: 'getline 只能读文件' },
          { text: 'cin >> 把回车留在了缓冲区，getline 立刻读到一个空行', correct: true },
          { text: 'line 没有初始化' },
          { text: '必须先调用 cin.sync()' }
        ],
        explain: '格式化输入遇到空白就停，分隔符留在流里。getline 见到那个换行符就返回空串。修正：在读完整数后加 cin.ignore(numeric_limits<streamsize>::max(), \"\\n\")。'
      },

      /* ---------------- ch02 指针、引用与内存 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '在 64 位平台上，<code>sizeof(int*)</code> 与 <code>sizeof(char*)</code> 的关系是？',
        options: [
          { text: '前者更大，因为 int 更大' },
          { text: '两者相等，指针大小只与地址位宽有关', correct: true },
          { text: '后者更大' },
          { text: '取决于编译器实现，无法确定' }
        ],
        explain: '指针存的是地址，同一平台所有对象指针大小相同：64 位下是 8 字节。sizeof(int) 是 4，与指针大小无关。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '函数返回局部变量的地址是安全的，因为调用者会拷贝一份。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '局部变量在栈上，函数返回时栈帧销毁，返回的地址指向已回收的内存，解引用是未定义行为。要么返回值，要么在堆上分配并明确所有权，要么由调用者传入缓冲区。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '关于 new/delete，下面哪些说法正确？（多选）',
        options: [
          { text: '<code>new[]</code> 必须配 <code>delete[]</code>', correct: true },
          { text: '对同一块内存 delete 两次是未定义行为', correct: true },
          { text: '<code>delete nullptr</code> 是安全的，什么也不做', correct: true },
          { text: 'delete 之后指针自动变成 nullptr' },
          { text: 'new 失败一定返回 nullptr' }
        ],
        explain: 'delete 不会改写指针的值，删除后原指针变成悬垂指针，建议 delete 后手动置空。现代 C++ 的 new 失败默认抛 bad_alloc，除非用 nothrow 版本。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['code'],
        stem: '在函数 <code>void f(int arr[10])</code> 内部写 <code>sizeof(arr)</code>，结果是？',
        options: [
          { text: '40' },
          { text: '8，数组已退化为指针', correct: true },
          { text: '10' },
          { text: '编译错误' }
        ],
        explain: '数组做函数参数会退化成指向首元素的指针，sizeof 得到指针大小（64 位为 8）。所以数组长度必须额外传参，或用 std::array / std::vector 按引用传。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-2', tier: 2, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: 'C++11 起表示「空指针」的关键字是 ______，它比 NULL 更安全。',
        answer: 'nullptr',
        accept: ['nullptr_t', 'nullptr 关键字'],
        explain: 'NULL 常被定义为 0，重载解析时会与整数混淆。nullptr 有独立类型 std::nullptr_t，只能转成指针，消除了这个歧义。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: '#include <iostream>\n\nint main() {\n    int a[5] = {10, 20, 30, 40, 50};\n    int* p = a;\n    std::cout << *p << " " << *(p + 2) << " " << p[4] << "\\n";\n    std::cout << (p + 2) - p << "\\n";\n}',
        stem: '这段程序的输出是什么？',
        answer: '10 30 50\n2',
        accept: ['10 30 50\\n2', '10 30 50 2'],
        explain: '数组名退化为首元素地址，*p 是 10，*(p+2) 是 30，p[4] 等价 *(p+4) 是 50。两个同类型指针相减得到元素个数差，所以是 2 而不是 8 字节。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '关于引用，下面哪个说法正确？',
        options: [
          { text: '引用可以不初始化，之后再绑定' },
          { text: '引用一旦绑定就不能改绑到另一个对象，且必须初始化', correct: true },
          { text: '引用本质上是拷贝了一份对象' },
          { text: '可以有空引用表示不指向任何对象' }
        ],
        explain: '引用是别名，定义时必须绑定，之后所有操作都作用在原对象上，无法改绑。没有「空引用」，需要可空就用指针。'
      },

      /* ---------------- ch03 类与对象 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '为什么成员应在初始化列表里初始化，而不是在构造函数体内赋值？',
        options: [
          { text: '初始化列表执行更快，且 const 成员和引用成员只能在列表里初始化', correct: true },
          { text: '函数体内赋值语法不合法' },
          { text: '初始化列表会自动调用析构函数' },
          { text: '两者完全等价，只是风格差异' }
        ],
        explain: '写在函数体里等于先默认构造再赋值，多一次操作；const 成员、引用成员、无默认构造的成员则根本没法在体内赋值。另外初始化顺序由声明顺序决定，与列表书写顺序无关。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '拷贝赋值运算符必须先检查自赋值（this != &amp;other），否则可能把自己持有的内存先释放掉。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '典型实现先 delete[] data_ 再 new 拷贝，若 other 就是自己，删完再读 other.data_ 就是读已释放内存。除了判断自赋值，也可以先分配新内存再释放旧的（copy-and-swap）来天然避免。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'multi', difficulty: 1,
        tags: ['concept'],
        stem: 'Rule of Three 指哪三个特殊成员函数？（多选）',
        options: [
          { text: '析构函数', correct: true },
          { text: '拷贝构造函数', correct: true },
          { text: '拷贝赋值运算符', correct: true },
          { text: '默认构造函数' },
          { text: '虚函数表指针' }
        ],
        explain: '需要自定义其中一个，通常三个都要：它们共同管理同一份资源。默认构造函数不在此列。C++11 之后扩展为 Rule of Five，加上移动构造与移动赋值。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '在 <code>const</code> 成员函数内部，<code>this</code> 的类型是？',
        options: [
          { text: '<code>Counter*</code>' },
          { text: '<code>const Counter*</code>', correct: true },
          { text: '<code>Counter&amp;</code>' },
          { text: '<code>const Counter&amp;</code>' }
        ],
        explain: 'const 成员函数承诺不改对象状态，所以 this 变成指向 const 的指针，无法调用非 const 成员或修改成员（mutable 成员除外）。这也决定了哪些函数能被 const 对象调用。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'fill', difficulty: 1,
        tags: ['code'],
        stem: '要让 <code>a = b = c;</code> 这样的链式赋值成立，拷贝赋值运算符应返回 ______。',
        answer: '*this',
        accept: ['*this（引用）', '自身的引用', 'Counter&'],
        explain: '返回 *this 的引用，赋值表达式的结果就是左操作数本身，可以继续参与下一次赋值。返回 void 或值都会让链式写法失效或产生多余拷贝。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'predict', difficulty: 3,
        tags: ['code'],
        code: '#include <iostream>\n\nstruct W {\n    W() { std::cout << "ctor "; }\n    W(const W&) { std::cout << "copy "; }\n    ~W() { std::cout << "dtor "; }\n};\n\nvoid take(W w) {}\n\nint main() {\n    W a;\n    take(a);\n    std::cout << "end\\n";\n}',
        stem: '这段程序输出的顺序是什么？',
        answer: 'ctor copy dtor end dtor',
        accept: ['ctor copy dtor end dtor '],
        explain: 'main 里构造 a 打印 ctor；take 按值传参拷贝一份打印 copy；函数返回时形参析构打印 dtor；打印 end；main 结束时 a 析构再打印 dtor。改成 take(const W&) 可以省掉那次拷贝。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-8', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '构造函数加 <code>explicit</code> 的作用是什么？',
        options: [
          { text: '禁止该构造函数被用于隐式类型转换', correct: true },
          { text: '让构造函数运行得更快' },
          { text: '让该构造函数不能被继承' },
          { text: '强制调用者写注释' }
        ],
        explain: '单参数构造函数默认允许 int 隐式转成类类型（如函数接收 Counter 时传 5）。explicit 要求必须显式写 Counter(5)，避免意外的隐式转换，标准库容器的大小构造就是这样做的。'
      },

      /* ---------------- ch04 继承与多态 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '通过基类指针 delete 派生类对象时，基类析构函数为什么必须是虚函数？',
        options: [
          { text: '否则只调用基类析构，派生类成员不会释放，造成泄漏', correct: true },
          { text: '否则编译不通过' },
          { text: '虚析构能让对象变成只读' },
          { text: '为了支持拷贝构造' }
        ],
        explain: '非虚析构按静态类型调用，delete Base* 只执行 ~Base()，派生类的资源和成员析构被跳过。声明 virtual ~Base() = default; 后才会按动态类型调用完整析构链。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '构造函数可以声明为虚函数，以便根据对象类型决定调用哪个构造函数。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '构造对象时虚表还没建立，语言规定构造函数不能是虚的。需要「按类型创建对象」时用工厂函数或 clone() 惯用法。析构函数则相反，基类析构应为虚。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '要触发动态绑定（运行期多态），需要满足哪些条件？（多选）',
        options: [
          { text: '通过基类的指针或引用调用', correct: true },
          { text: '被调函数在基类中声明为 virtual', correct: true },
          { text: '派生类重写了该虚函数，且签名一致', correct: true },
          { text: '对象必须用 new 创建' },
          { text: '基类和派生类的函数名必须不同' }
        ],
        explain: '按值传递会发生对象切片，只剩基类部分，动态绑定失效，所以必须用指针或引用。栈上对象同样可以多态，new 不是必要条件。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['code'],
        stem: '把派生类对象按值传给形参 <code>void f(Shape s)</code>，调用 <code>s.area()</code> 会执行哪个版本？',
        options: [
          { text: '派生类的 area，因为对象本身是派生类' },
          { text: '基类 Shape 的 area，因为对象切片只剩基类部分', correct: true },
          { text: '编译错误' },
          { text: '运行时抛异常' }
        ],
        explain: '按值传参只拷贝基类子对象，派生类的成员与虚表指针都丢失，这就是对象切片。改用 const Shape& 即可保留动态类型。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '纯虚函数的声明写法是在函数声明末尾加 ______，含有纯虚函数的类叫抽象类。',
        answer: '= 0',
        accept: ['=0', '= 0;', '等于 0'],
        explain: 'virtual double area() const = 0; 表示该函数只有接口没有实现，抽象类不能实例化，派生类必须实现全部纯虚函数才能创建对象。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-1', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: '#include <iostream>\n\nstruct Base {\n    virtual void hello() const { std::cout << "base\\n"; }\n};\n\nstruct Derived : Base {\n    void hello() const override { std::cout << "derived\\n"; }\n};\n\nint main() {\n    Derived d;\n    Base& b = d;\n    Base copy = d;\n    b.hello();\n    copy.hello();\n}',
        stem: '这段程序的输出是什么？',
        answer: 'derived\nbase',
        accept: ['derived\\nbase', 'derived base'],
        explain: 'b 是引用，动态类型仍是 Derived，调用 Derived::hello；copy 是 Base 类型的对象，d 被切片，只剩 Base 部分，调用 Base::hello。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-8', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪种情况更适合用组合而不是继承？',
        options: [
          { text: 'Stack 需要复用 vector 的存储能力，但只暴露 push/pop/top', correct: true },
          { text: 'Circle 与 Shape 的关系' },
          { text: '需要重写基类的虚函数以改变行为' },
          { text: '需要通过基类指针统一管理多种子类型' }
        ],
        explain: 'Stack 与 vector 是「用」而不是「是」的关系：has-a 用组合，把 vector 作为私有成员，只暴露受限接口，避免继承带来的 isEmpty 等无关操作。is-a 关系才用 public 继承。'
      },

      /* ---------------- ch05 模板与泛型 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '函数模板在什么时候真正生成代码？',
        options: [
          { text: '编译期，按实际使用的类型实例化', correct: true },
          { text: '运行时，第一次调用时生成' },
          { text: '链接时，由链接器生成' },
          { text: '从不生成，解释执行' }
        ],
        explain: '模板是编译期的代码生成器：max_of(3, 4) 让编译器用 int 实例化一份，max_of(1.5, 2.5) 再实例化一份 double 版本。这也是模板报错信息很长的原因。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'tf', difficulty: 2,
        tags: ['tool'],
        stem: '类模板的成员函数定义可以放在 .cpp 文件里，只要在头文件中保留声明。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '编译器在实例化时必须看到完整定义，否则只能生成调用指令、等着链接到不存在的实现，报 undefined reference。模板定义通常整个放头文件，或在 .cpp 末尾显式实例化。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些可以作为模板参数？（多选）',
        options: [
          { text: '类型参数 <code>typename T</code>', correct: true },
          { text: '非类型参数，如 <code>int N</code>', correct: true },
          { text: '模板模板参数，如 <code>template&lt;typename&gt; class C</code>', correct: true },
          { text: '运行期变量 <code>int n</code> 的值' },
          { text: '函数的返回值' }
        ],
        explain: '模板参数必须是编译期可知的：类型、常量表达式、或另一个模板。运行期变量无法在编译期确定，不能作模板实参（C++20 的 constexpr 值可以，但仍需编译期常量）。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['code'],
        stem: '对 <code>template&lt;typename T&gt; T max_of(T a, T b)</code> 调用 <code>max_of(3, 4.5)</code> 会怎样？',
        options: [
          { text: '返回 4.5' },
          { text: '编译错误：T 无法同时推导为 int 和 double', correct: true },
          { text: '返回 4' },
          { text: '运行时抛异常' }
        ],
        explain: '两个实参要推导出同一个 T，冲突则推导失败。解决：显式指定 max_of&lt;double&gt;(3, 4.5)，或写成两个类型参数，或把其中一个实参转型。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '为某个具体类型提供特化版本时，模板头写作 <code>template&lt;&gt;</code>，这称为 ______ 特化。',
        answer: '全',
        accept: ['完全', 'full', 'explicit'],
        explain: 'template<> 后面所有类型参数都被指定，叫全特化（显式特化）。只指定部分参数、或对指针/容器等模式做特化，叫偏特化，函数模板不支持偏特化。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: '#include <iostream>\n\ntemplate <typename T>\nT twice(T x) { return x + x; }\n\nint main() {\n    std::cout << twice(3) << " ";\n    std::cout << twice(1.5) << "\\n";\n}',
        stem: '这段程序的输出是什么？',
        answer: '6 3',
        accept: ['6 3\\n', '6 3 '],
        explain: 'twice 分别用 int 与 double 实例化：3+3=6，1.5+1.5=3。第二次输出用默认格式，3.0 打印成 3。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-8', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '与运行期多态（虚函数）相比，模板带来的编译期多态主要优势是？',
        options: [
          { text: '没有虚表与间接跳转开销，且能对内置类型生效', correct: true },
          { text: '生成的代码体积更小' },
          { text: '可以在运行时决定类型' },
          { text: '支持异构容器' }
        ],
        explain: '模板在编译期确定调用，可内联、无虚表开销，int 这类非类类型也能参与。代价是每种实例化都生成一份代码，二进制更大，且不能运行期换类型。'
      },

      /* ---------------- ch06 STL 与算法 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['code'],
        stem: '遍历 vector 时删除偶数元素，下面哪种写法正确？',
        options: [
          { text: 'for (auto it = v.begin(); it != v.end(); ++it) if (even) v.erase(it);' },
          { text: 'for (auto it = v.begin(); it != v.end(); ) { if (even) it = v.erase(it); else ++it; }', correct: true },
          { text: 'for (int i = 0; i < v.size(); ++i) if (even) v.erase(v.begin() + i);' },
          { text: '先 clear 再重新插入' }
        ],
        explain: 'erase 之后原迭代器失效，必须用返回值接住下一个位置。按索引删除会漏掉后一个元素（删除后所有元素前移）。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '<code>std::map</code> 的 <code>operator[]</code> 在 key 不存在时只返回默认值，不会修改 map。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'operator[] 找不到就插入一个 value 默认构造的条目再返回引用，所以 map 会变大。查存在要用 find 或 count，写入才用 []。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些操作会让 vector 的迭代器失效？（多选）',
        options: [
          { text: 'push_back 触发扩容', correct: true },
          { text: 'erase 删除元素', correct: true },
          { text: '在中间 insert', correct: true },
          { text: '读取 v[0]' },
          { text: '调用 v.size()' }
        ],
        explain: '任何可能改变容量或搬移元素的操作都会让迭代器、指针、引用失效。只读操作不影响。list 的迭代器只在被删元素处失效，所以常被用在对失效敏感的场景。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '<code>std::sort</code> 不能直接用于 <code>std::list</code>，根本原因是什么？',
        options: [
          { text: 'list 没有 begin()' },
          { text: 'sort 要求随机访问迭代器，list 只提供双向迭代器', correct: true },
          { text: 'list 的元素不能比较' },
          { text: 'list 不支持拷贝' }
        ],
        explain: 'sort 内部要用 it + n、it[n] 做划分与堆排，list 的迭代器只能 ++/--。list 提供成员函数 l.sort()，按节点重排，不需要随机访问。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: 'STL 的区间约定是左闭右开，<code>begin()</code> 指向首元素，<code>end()</code> 指向最后一个元素的 ______。',
        answer: '下一位',
        accept: ['下一个位置', '后面一位', 'past-the-end'],
        explain: '半开区间 [begin, end) 让空区间可以表示为 begin == end，循环条件统一写 it != end，不需要处理空容器特例。解引用 end() 是未定义行为。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'predict', difficulty: 3,
        tags: ['code'],
        code: '#include <iostream>\n#include <map>\n\nint main() {\n    std::map<std::string, int> m;\n    m["a"] = 1;\n    std::cout << m["b"] << " ";\n    std::cout << m.size() << "\\n";\n    if (m.count("c") == 0) m["c"]; \n    std::cout << m.size() << "\\n";\n}',
        stem: '这段程序的输出是什么？',
        answer: '0 2\n3',
        accept: ['0 2\\n3', '0 2 3'],
        explain: 'm["b"] 插入 b=0 并返回 0，size 变 2。m.count("c") 不插入所以是 0，随后 m["c"] 又插入了 c=0，size 变 3。这就是 [] 会修改容器的经典陷阱。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-8', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '需要按学号快速查找学生成绩，且经常按学号顺序输出，应选哪种容器？',
        options: [
          { text: '<code>std::vector</code> 线性查找' },
          { text: '<code>std::map&lt;int, int&gt;</code>', correct: true },
          { text: '<code>std::list</code>' },
          { text: '<code>std::stack</code>' }
        ],
        explain: 'map 查找 O(log n)，且按 key 有序，遍历即学号顺序。unordered_map 查找更快但无序，要排序还得额外 O(n log n)。vector 线性查找 O(n)，人数多时不可取。'
      },

      /* ---------------- ch07 异常与现代 C++ ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'RAII 能保证资源释放，根本原因是什么？',
        options: [
          { text: '析构函数在作用域结束时一定会被调用，包括异常展开路径', correct: true },
          { text: 'C++ 有 finally 关键字' },
          { text: '编译器会自动插入 delete' },
          { text: '垃圾回收器会定期清理' }
        ],
        explain: '局部对象离开作用域必然析构，正常返回、提前 return、异常展开都覆盖。所以把资源交给对象持有，就无需在每个出口手写释放。C++ 没有 finally，也不靠 GC。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '<code>std::move(v)</code> 会立刻把 v 的元素搬到新对象里。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'std::move 只是把左值转成右值引用（一次类型转换），真正的搬移发生在移动构造或移动赋值中。单独写 std::move(v); 什么也不会发生。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-6', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '关于智能指针，下面哪些说法正确？（多选）',
        options: [
          { text: '<code>unique_ptr</code> 不能拷贝，只能移动', correct: true },
          { text: '<code>shared_ptr</code> 用引用计数决定何时释放', correct: true },
          { text: '<code>weak_ptr</code> 不增加引用计数，可打破循环引用', correct: true },
          { text: '同一裸指针可以安全地构造两个 shared_ptr' },
          { text: '智能指针能自动防止数组越界' }
        ],
        explain: '同一裸指针构造两个 shared_ptr 会产生两个独立控制块，导致双重 delete。智能指针只管所有权与释放，不检查下标，越界仍要靠 at() 或自己判断。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '移动构造函数没有标 <code>noexcept</code>，对 <code>vector&lt;T&gt;</code> 扩容有什么影响？',
        options: [
          { text: '编译失败' },
          { text: 'vector 为保证强异常安全，改用拷贝而不是移动，性能下降', correct: true },
          { text: '没有任何影响' },
          { text: 'vector 会直接 terminate' }
        ],
        explain: '扩容时若移动中途抛异常，旧元素已被改坏无法回滚；拷贝则可以丢弃新缓冲区。所以只有移动构造声明 noexcept，容器才敢用移动。这是漏写 noexcept 最常见的性能坑。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '异常从抛出点向上传播时，沿途函数的局部对象会被逐个析构，这个过程叫 ______。',
        answer: '栈展开',
        accept: ['stack unwinding', '栈展开（stack unwinding）', '退栈'],
        explain: '栈展开保证 RAII 生效：即使异常跨越好几层函数，局部对象的析构函数仍会执行，资源随之释放。析构函数若在展开中再抛异常，程序会直接 terminate。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'predict', difficulty: 3,
        tags: ['code'],
        code: '#include <iostream>\n#include <stdexcept>\n\nstruct Guard {\n    ~Guard() { std::cout << "guard "; }\n};\n\nvoid f() {\n    Guard g;\n    throw std::runtime_error("boom");\n}\n\nint main() {\n    try { f(); }\n    catch (const std::exception& e) { std::cout << e.what() << "\\n"; }\n}',
        stem: '这段程序的输出是什么？',
        answer: 'guard boom',
        accept: ['guard boom\\n', 'guard boom '],
        explain: 'throw 后 f 立即退出，局部对象 g 被析构打印 guard，然后异常被 main 的 catch 接住，打印 what() 得到 boom。这演示了栈展开与 RAII 的配合。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-8', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'Rule of Zero 的含义是？',
        options: [
          { text: '类里不直接持有资源时，析构、拷贝、移动都不用手写，交给成员类型', correct: true },
          { text: '一个类最多只能有零个成员函数' },
          { text: '禁止使用 new 和 delete' },
          { text: '所有类都必须写默认构造函数' }
        ],
        explain: '成员都用 vector、string、unique_ptr 这类 RAII 类型时，编译器生成的析构与拷贝移动语义已经正确，手写反而容易出错。Rule of Zero 是现代 C++ 的首选写法。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
