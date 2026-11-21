/* =====================================================================
 * site.js · CSC3002 C++ 程序设计 站点配置（window.CSC_SITE）
 * ===================================================================== */
window.CSC_SITE = {
  id: 'csc3002',
  short: 'CSC3002',
  name: 'C++ 程序设计',
  en: 'C++ Programming',
  dept: '计算机科学',
  lang: 'cpp',
  langLabel: 'C++',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读 + 自测',
  bootHead: 'CSC3002 // MEMORY OBSERVATORY',
  bootLog: [
    '> mounting course partition ... CSC3002',
    '> loading 8 modules: types, memory, objects, polymorphism ...',
    '> linking templates, STL & exception handlers ...',
    '> heap check passed. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '从一块内存开始，读懂 C++ 的每个决定。',
  missionEn: 'CSC3002 · 8 MODULES',
  missionTitle: '从类型到所有权<br><em>写得出，也说得清</em>',
  lede: '八章沿一条主线推进：值怎么表示、放在哪、怎样封装、如何多态、怎么泛化、用哪些现成工具、最后谁来释放资源。每章配真实课程代码、对比表、常见错误与自检清单，读完能独立写出不泄漏、可维护的 C++ 程序。',
  searchPlaceholder: 'QUERY // 搜索：指针 · 虚函数 · 模板 · 迭代器 · RAII · 移动语义',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/CSC3002/',
  resources: {
    note: '收录 CSC3002 的讲义压缩包、习题课代码与考试说明；文件名即原始文件，点击后用系统默认程序打开。',
    groups: [
      { name: '讲义与课件', note: '按课程进度排列。zip 是讲义源码包，解压后含 .cpp 示例与 slides。', items: [
        { title: '课程介绍（Lecture 00）', path: '学习资料/CSC3002_00_Course_Introduction.pptx', kind: 'pptx', note: '课程安排、评分构成与工具链说明' },
        { title: 'Chapter 01 · C++ 概览', path: '学习资料/CSC3002_Lecture_02_03_Chapter_01_Overview_of_CPP.zip', kind: 'zip', note: '编译流程、基本类型与第一个程序' },
        { title: 'Chapter 02 · 函数与库（上）', path: '学习资料/CSC3002_Lecture_04_Chapter_02_Functions_and_Libraries_Part_1.zip', kind: 'zip', note: '函数声明、参数传递与作用域' },
        { title: 'Chapter 02 · 函数与库（下）', path: '学习资料/CSC3002_Lecture_10_Chapter_02_Functions_and_Libraries_Part_2.zip', kind: 'zip', note: '重载、默认参数与库的组织' },
        { title: 'Chapter 03 · 字符串', path: '学习资料/CSC3002_Lecture_05_C03_Strings.zip', kind: 'zip', note: 'std::string 与 C 风格字符串的差别' },
        { title: 'Chapter 04 · 输入输出流', path: '学习资料/CSC3002_Lecture_06_C04_Streams.zip', kind: 'zip', note: 'cin/cout、格式化与文件流' },
        { title: 'Chapter 05 · 集合', path: '学习资料/CSC3002_Lecture_07_08_Chapter_05_Collections.zip', kind: 'zip', note: 'vector、map、set 的接口与复杂度' },
        { title: 'Chapter 11 · 指针与数组', path: '学习资料/CSC3002_Lecture_10_11_C11_Pointers_and_Arrays.zip', kind: 'zip', note: '地址、指针算术、数组退化' },
        { title: 'Chapter 12 · 动态内存', path: '学习资料/CSC3002_Lecture_12_13_Chapter_12_Dynamic_Memory_Management.zip', kind: 'zip', note: 'new/delete、堆与栈、泄漏' },
        { title: 'Chapter 10 · 算法分析', path: '学习资料/CSC3002_Lecture_17_Chapter_10_Algorithmic_Analysis.zip', kind: 'zip', note: '复杂度记号与常见操作的代价' },
        { title: 'Chapter 13 · 效率与表示', path: '学习资料/CSC3002_Lecture_18_C13_Efficiency_and_Representation.zip', kind: 'zip', note: '对象布局、缓存与表示选择' },
        { title: 'Chapter 14 · 线性结构', path: '学习资料/CSC3002_Lecture_19_Chapter_14_Linear_Structures.zip', kind: 'zip', note: '栈、队列与链表的实现' },
        { title: 'Chapter 19 · 继承', path: '学习资料/CSC3002_Lecture_24_25_Chapter_19_Inheritance.zip', kind: 'zip', note: '继承层次、虚函数与多态' },
        { title: '继承（Part 02）', path: '学习资料/CSC3002_19_Inheritance_Part_02.pptx', kind: 'pptx', note: '虚析构、抽象类与接口设计' },
        { title: 'Chapter 20 · 迭代策略', path: '学习资料/CSC3002_Lecture_25_26_Chapter_20_Strategies_for_Iteration.zip', kind: 'zip', note: '迭代器、回调与算法复用' }
      ] },
      { name: '习题课与代码', note: '每个 Tutorial 都对应一次上机练习；.cpp 可直接编译运行。', items: [
        { title: 'Tutorial 01 · 环境与样例工程', path: '作业习题/CSC3002_Tutorial_01.pptx', kind: 'pptx', note: 'VS Code、编译命令与 sample project' },
        { title: 'Tutorial 01 · Hello World 工程', path: '作业习题/CSC3002_Tutorial_01_helloworld.zip', kind: 'zip', note: '最小可编译工程，用来验证工具链' },
        { title: 'Tutorial 01 · 样例项目', path: '作业习题/CSC3002_Tutorial_01_sample_project.zip', kind: 'zip', note: '多文件工程的组织方式' },
        { title: 'Tutorial 01 · 自测包', path: '作业习题/CSC3002_Tutorial_01_3002test.zip', kind: 'zip', note: '环境自检脚本与测试用例' },
        { title: 'Tutorial 02 · 讲义', path: '作业习题/CSC3002_Tutorial_02_22Fall_ver.pdf', kind: 'pdf', note: '字符串处理与三个课堂练习' },
        { title: 'Tutorial 02 · Acronym', path: '作业习题/CSC3002_Tutorial_02_Program1_Acronym.zip', kind: 'zip', note: '缩写生成：字符判断与 string 拼接' },
        { title: 'Tutorial 02 · Palindrome', path: '作业习题/CSC3002_Tutorial_02_Program2_Palindrome.zip', kind: 'zip', note: '回文判断：双指针与大小写归一' },
        { title: 'Tutorial 02 · Integer or String', path: '作业习题/CSC3002_Tutorial_02_Program3_Integer_or_String.zip', kind: 'zip', note: '输入解析与类型判定' },
        { title: 'Tutorial 03 · 括号匹配', path: '作业习题/CSC3002_Tutorial_03_bracketMatching.cpp', kind: 'code', note: 'stack 的经典应用，本站 ch06 引用' },
        { title: 'Tutorial 03 · 后缀表达式求值', path: '作业习题/CSC3002_Tutorial_03_postFixEval.cpp', kind: 'code', note: '用栈处理运算符优先级' },
        { title: 'Tutorial 03 · 井字棋', path: '作业习题/CSC3002_Tutorial_03_TicTacToe.cpp', kind: 'code', note: '二维数组与游戏循环' },
        { title: 'Tutorial 03 · 讲义', path: '作业习题/CSC3002_Tutorial_03.pptx', kind: 'pptx', note: '三道题的思路与常见错误' },
        { title: 'Tutorial 04 · 讲义', path: '作业习题/CSC3002_Tutorial_04.pptx', kind: 'pptx', note: '类与对象的第一组练习' },
        { title: 'Tutorial 04 · 代码包', path: '作业习题/CSC3002_Tutorial_04_code.zip', kind: 'zip', note: '课堂演示代码与参考答案' },
        { title: 'Tutorial 05 · 指针与地址', path: '作业习题/CSC3002_Tutorial_05_PointerAndAddress.cpp', kind: 'code', note: '打印地址、观察 & 与 * 的行为' },
        { title: 'Tutorial 05 · 三种 swap', path: '作业习题/CSC3002_Tutorial_05_Swap.cpp', kind: 'code', note: '值传递、指针传递、引用传递对比' },
        { title: 'Tutorial 05 · 自增运算', path: '作业习题/CSC3002_Tutorial_05_Increment.cpp', kind: 'code', note: '前置与后置 ++ 的区别' },
        { title: 'Tutorial 05 · 讲义', path: '作业习题/CSC3002_Tutorial_05.pdf', kind: 'pdf', note: '指针与引用的课堂练习' },
        { title: 'Tutorial 06 · 链表', path: '作业习题/CSC3002_Tutorial_06_linked_list.cpp', kind: 'code', note: 'struct 与 next 指针，本站 ch02 引用' },
        { title: 'Tutorial 06 · 链表（unique_ptr 版）', path: '作业习题/CSC3002_Tutorial_06_linked_list_unique.cpp', kind: 'code', note: '用智能指针重写链表所有权' },
        { title: 'Tutorial 06 · 讲义', path: '作业习题/CSC3002_Tutorial_06_24Fall_ver.pptx', kind: 'pptx', note: '链表插入、删除与内存释放' },
        { title: 'Tutorial 07 · 讲义', path: '作业习题/CSC3002_Tutorial_07.pptx', kind: 'pptx', note: '类设计专题' },
        { title: 'Tutorial 08 · 讲义', path: '作业习题/CSC3002_Tutorial_08.pptx', kind: 'pptx', note: '构造、析构与拷贝语义' },
        { title: 'Tutorial 09 · 讲义', path: '作业习题/CSC3002_Tutorial_09.pptx', kind: 'pptx', note: '运算符重载与友元' },
        { title: 'Tutorial 09 · 代码包', path: '作业习题/CSC3002_Tutorial_09_tut9.zip', kind: 'zip', note: '重载练习的工程文件' },
        { title: 'Tutorial 10 · 讲义', path: '作业习题/CSC3002_Tutorial_10.pptx', kind: 'pptx', note: '继承与虚函数' },
        { title: 'Tutorial 10 · 代码包', path: '作业习题/CSC3002_Tutorial_10_code.zip', kind: 'zip', note: '多态示例与调试练习' },
        { title: 'Tutorial 11 · 讲义', path: '作业习题/CSC3002_Tutorial_11_tut11.pptx', kind: 'pptx', note: '模板与泛型编程' },
        { title: 'Tutorial 12 · 讲义', path: '作业习题/CSC3002_Tutorial_12_CSC3002_Tutorial12.pptx', kind: 'pptx', note: 'STL 综合练习' },
        { title: 'Tutorial 13 · 讲义', path: '作业习题/CSC3002_Tutorial_13.pdf', kind: 'pdf', note: '期末复习与答疑整理' }
      ] },
      { name: '项目、考试与工具', note: '开工前先读 Project Guidelines；考试说明用于确认题型与允许携带的材料。', items: [
        { title: 'Project Guidelines', path: '作业习题/CSC3002_Project_Guidelines.pdf', kind: 'pdf', note: '项目要求、评分点与提交格式' },
        { title: 'Final Info', path: '考试资料/CSC3002_Final_Info.pptx', kind: 'pptx', note: '期末范围、题型与注意事项' },
        { title: 'Sample Topic 1', path: '学习资料/CSC3002_Sample_topic_1.pdf', kind: 'pdf', note: '命题作文式样题一，含评分参考' },
        { title: 'Sample Topic 2', path: '学习资料/CSC3002_Sample_topic_2.pdf', kind: 'pdf', note: '命题作文式样题二' },
        { title: '环境配置指南', path: '学习资料/CSC3002_env_setup.pdf', kind: 'pdf', note: '编译器、编辑器与调试器安装' },
        { title: 'VS Code 与 Makefile 指南', path: '学习资料/CSC3002_VSC_Makefile_Guide_V1.pdf', kind: 'pdf', note: '多文件工程的构建配置' }
      ] }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', 'C++ 程序设计（C++ Programming），CUHKSZ CSC3002'],
    ['来源', 'CUHKSZ CSC3002 课程讲义、习题课代码与考试资料'],
    ['结构', '8 章正文 · 56 题题库 · 模拟卷 · 3 个实战项目 · 资料库'],
    ['建议', '第 0 章先建地图；ch02 与 ch07 务必动手调试，指针与资源问题只看书学不会。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    { label: '类型与表达式', blocks: [
      { t: 'table', head: ['类型', '典型大小', '范围 / 精度', '坑'], rows: [
        ['<code>bool</code>', '1 字节', 'true / false', '非 0 即真，但别把 bool 当整数做算术'],
        ['<code>char</code>', '1 字节', '-128 ~ 127（是否有符号由实现决定）', '中文字符不能用 char 存'],
        ['<code>int</code>', '4 字节', '-2147483648 ~ 2147483647', '溢出是未定义行为，不会回绕'],
        ['<code>unsigned</code>', '4 字节', '0 ~ 4294967295', '与 int 混比会被转成无符号'],
        ['<code>long long</code>', '8 字节', '约 ±9.2×10<sup>18</sup>', '字面量要写 <code>1LL</code> 才按 long long 算'],
        ['<code>double</code>', '8 字节', '约 15~17 位有效数字', '<code>0.1+0.2 != 0.3</code>，比较要用容差'],
        ['<code>size_t</code>', '8 字节（64 位）', '无符号，容器大小/下标的类型', '倒序循环写 <code>i &gt;= 0</code> 是死循环']
      ], caption: 'sizeof 的结果是实现相关，考试若问「一定成立」只有 char 为 1 字节' },
      { t: 'table', head: ['写法', '名称', '是否检查窄化', '能否用于 const/引用成员'], rows: [
        ['<code>int a = 3.9;</code>', '拷贝初始化', '否，静默截断', '否'],
        ['<code>int a(3.9);</code>', '直接初始化', '否', '可以'],
        ['<code>int a{3.9};</code>', '列表初始化', '是，编译报错', '可以（推荐）'],
        ['<code>auto a = 3.9;</code>', '类型推导', '不适用', '会丢掉引用与顶层 const']
      ], caption: '默认用花括号；只有需要兼容老代码或刻意截断时才用 =' },
      { t: 'callout', kind: 'warn', title: '三个必背的表达式结果', html: '<code>-7 / 2 == -3</code>（向零截断）、<code>-7 % 2 == -1</code>（余数随被除数）、<code>7 / 2.0 == 3.5</code>（有一个操作数是浮点就按浮点算）。' }
    ] },

    { label: '指针与内存', blocks: [
      { t: 'table', head: ['操作', '写法', '说明'], rows: [
        ['取地址', '<code>int* p = &amp;a;</code>', 'p 存的是 a 的地址，64 位下 8 字节'],
        ['解引用', '<code>*p = 5;</code>', '改的是 p 指向的那个对象'],
        ['指针算术', '<code>p + 1</code>', '前进 <code>sizeof(*p)</code> 字节，不是 1 字节'],
        ['数组退化', '<code>void f(int a[])</code>', '等价于 <code>int*</code>，<code>sizeof(a)</code> 变成 8'],
        ['等价关系', '<code>a[i] == *(a + i)</code>', '下标只是语法糖'],
        ['空指针', '<code>int* p = nullptr;</code>', 'delete 空指针安全，解引用空指针崩溃'],
        ['堆分配', '<code>int* p = new int[10];</code>', '必须配 <code>delete[] p;</code>'],
        ['悬垂指针', '<code>delete p;</code> 后继续用 p', 'delete 不会把 p 置空，建议手动置 nullptr']
      ], caption: '指针本身永远是固定大小；它「指向什么类型」只影响解引用与算术步长' },
      { t: 'compare', left: { title: '栈（stack）', html: '函数局部变量，自动分配释放，大小有限（通常几 MB），速度快；返回局部变量的地址必错。' }, right: { title: '堆（heap）', html: 'new/malloc 手动申请，容量大，需要手动释放；忘记 delete 就泄漏，delete 两次是未定义行为。' } },
      { t: 'code', lang: 'bash', caption: '用 AddressSanitizer 抓内存错误', code: 'g++ -std=c++17 -g -fsanitize=address,undefined main.cpp -o main\n./main' }
    ] },

    { label: '类与继承', blocks: [
      { t: 'table', head: ['特殊成员', '签名', '什么时候必须自己写'], rows: [
        ['默认构造', '<code>T()</code>', '有成员没有默认构造时'],
        ['析构', '<code>~T()</code>', '类直接持有需要释放的资源'],
        ['拷贝构造', '<code>T(const T&amp;)</code>', '需要深拷贝，或要禁止拷贝（<code>= delete</code>）'],
        ['拷贝赋值', '<code>T&amp; operator=(const T&amp;)</code>', '同上；记得防自赋值并返回 <code>*this</code>'],
        ['移动构造', '<code>T(T&amp;&amp;) noexcept</code>', '希望转移而非复制资源时'],
        ['移动赋值', '<code>T&amp; operator=(T&amp;&amp;) noexcept</code>', '同上']
      ], caption: 'Rule of Three：析构/拷贝构造/拷贝赋值同进同退；Rule of Zero：都用 RAII 成员就一个都别写' },
      { t: 'table', head: ['继承规则', '结论', '后果'], rows: [
        ['构造顺序', '基类 → 成员 → 派生类函数体', '基类构造只能走初始化列表'],
        ['析构顺序', '与构造严格相反', '派生类先释放自己的资源'],
        ['基类析构', '多态删除时必须 virtual', '否则派生类部分不析构，泄漏'],
        ['虚函数调用', '指针/引用 → 动态绑定；对象 → 静态绑定', '按值传参会对象切片'],
        ['纯虚函数', '<code>virtual f() = 0;</code>', '所在类抽象，不能实例化'],
        ['override', '<code>void f() override;</code>', '签名不匹配时编译报错，强烈建议加']
      ], caption: '判断多态是否生效：看调用点是「基类的指针或引用」还是「基类对象」' },
      { t: 'callout', kind: 'tip', title: '组合优先于继承', html: '先问「是 is-a 还是 has-a」。Stack 与 vector 是 has-a，用私有成员包含；只有真正的 is-a（Circle 是 Shape）才用 public 继承。' }
    ] },

    { label: 'STL 与算法', blocks: [
      { t: 'table', head: ['容器', '查找', '插入（尾部 / 中间）', '有序', '首选场景'], rows: [
        ['<code>vector</code>', 'O(n) / 下标 O(1)', '均摊 O(1) / O(n)', '否', '默认选择，遍历多'],
        ['<code>deque</code>', 'O(1) 下标', 'O(1) / O(n)', '否', '两端频繁进出'],
        ['<code>list</code>', 'O(n)', 'O(1) / O(1)（已知位置）', '否', '频繁中间插删'],
        ['<code>map</code> / <code>set</code>', 'O(log n)', 'O(log n)', '是', '要按 key 有序'],
        ['<code>unordered_map</code>', '平均 O(1)', '平均 O(1)', '否', '只查不计顺序']
      ], caption: '复杂度是渐近的；小数据下 vector 常常比 list 快，因为缓存友好' },
      { t: 'table', head: ['算法', '一句话', '注意'], rows: [
        ['<code>sort(b, e, cmp)</code>', '排序，cmp 返回 true 表示 a 应排在 b 前', '要求随机访问迭代器，list 用自己的 sort'],
        ['<code>find(b, e, v)</code>', '找第一个等于 v 的元素', '找不到返回 e，必须判 end'],
        ['<code>find_if(b, e, pred)</code>', '找第一个满足条件的元素', '常配 lambda'],
        ['<code>count_if(b, e, pred)</code>', '统计满足条件的个数', '比手写循环清楚'],
        ['<code>accumulate(b, e, init)</code>', '累加', '初值类型决定返回类型，double 要写 0.0'],
        ['<code>transform(b, e, out, f)</code>', '逐个映射写出', '输出到空容器要用 back_inserter'],
        ['<code>erase_if(c, pred)</code>', 'C++20，删除满足条件的元素', '老标准用 <code>it = c.erase(it)</code>']
      ], caption: '先找算法再写循环；写循环时想清楚迭代器何时失效' },
      { t: 'callout', kind: 'warn', title: '迭代器失效三连', html: 'vector 扩容 → 全部失效；<code>erase</code> → 被删元素及其后失效（用返回值接住）；遍历中插入 → 可能全部失效。list 只在被删节点处失效。' }
    ] },

    { label: '编译与调试', blocks: [
      { t: 'code', lang: 'bash', caption: '常用编译与调试命令', code: 'g++ -std=c++17 -Wall -Wextra -g main.cpp -o main   # 开发\n g++ -std=c++17 -O2 main.cpp -o main                  # 发布\n./main < input.txt > output.txt                       # 重定向\n gdb ./main                                            # 调试\nvalgrind --leak-check=full ./main                     # 查泄漏（Linux）' },
      { t: 'table', head: ['报错', '含义', '先查什么'], rows: [
        ['<code>undefined reference</code>', '链接期找不到符号', '实现所在的 .cpp 有没有参与编译；模板定义是否在头文件'],
        ['<code>expected ;</code>', '语法错误', '上一行是否漏分号、括号是否配对'],
        ['<code>no matching function</code>', '重载解析失败', '参数类型/const 是否匹配，是否忘了 include'],
        ['<code>invalid conversion</code>', '类型不兼容', '是否需要 static_cast，是否把 const 丢了'],
        ['段错误（Segmentation fault）', '访问了非法地址', '空指针解引用、数组越界、返回局部变量地址'],
        ['输出全是乱码', '编码/格式问题', 'setw 是否只对下一次输出有效，是否混用 printf'],
        ['程序结果随机变化', '未定义行为', '未初始化变量、越界写、悬垂指针，用 ASan 复现']
      ], caption: '段错误优先用 ASan 跑一遍，它会直接打印出错行与越界距离' }
    ] }
  ]
};
