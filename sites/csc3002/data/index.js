/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * 说明：title 必须与 data/chXX.js 里的 title 逐字一致。
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：C++ 在解决什么问题', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先摊开整门课的地图：C++ 的设计取舍、七章依赖、编译工具链，以及本站四条学习线怎么配合。' },
  { id: 'ch01', num: '01', title: '基础与类型系统：值、类型与表达式', en: 'TYPES, VALUES & EXPRESSIONS', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'code', labs: 1,
    blurb: '从编译模型、基本类型与初始化讲到表达式求值、函数与流：把「程序为什么这样算」讲清楚。' },
  { id: 'ch02', num: '02', title: '指针、引用与内存：看见地址', en: 'POINTERS, REFERENCES & MEMORY', part: 'Part II · 基础', week: 4, minutes: 100, icon: 'memory', labs: 1,
    blurb: '画出栈与堆的地址图，分清指针、引用与数组，手写 new/delete 与链表，消灭悬垂指针和内存泄漏。' },
  { id: 'ch03', num: '03', title: '类与对象：封装、生命周期与运算符', en: 'CLASSES & OBJECTS', part: 'Part III · 深入', week: 6, minutes: 110, icon: 'layers', labs: 1,
    blurb: '用构造函数、析构函数与 const 成员函数维护对象不变量，再用运算符重载让自定义类型用起来像内置类型。' },
  { id: 'ch04', num: '04', title: '继承与多态：同一接口，不同行为', en: 'INHERITANCE & POLYMORPHISM', part: 'Part III · 深入', week: 8, minutes: 110, icon: 'target', labs: 1,
    blurb: '从 is-a 关系、虚函数表到抽象接口：看懂动态绑定，也看懂对象切片与虚析构这两个致命坑。' },
  { id: 'ch05', num: '05', title: '模板与泛型：写一次，适配所有类型', en: 'TEMPLATES & GENERICS', part: 'Part III · 深入', week: 10, minutes: 100, icon: 'grid', labs: 1,
    blurb: '函数模板、类模板、特化与编译期约束：理解 STL 背后的泛型机制，读懂冗长的模板报错。' },
  { id: 'ch06', num: '06', title: 'STL 与算法：容器、迭代器与算法库', en: 'STL CONTAINERS & ALGORITHMS', part: 'Part IV · 综合', week: 12, minutes: 110, icon: 'function', labs: 1,
    blurb: '按复杂度选容器，用迭代器与算法组合出解：vector/map/set 的取舍、lambda 与 remove-erase 惯用法。' },
  { id: 'ch07', num: '07', title: '异常与现代 C++：所有权与移动语义', en: 'EXCEPTIONS & MODERN C++', part: 'Part IV · 综合', week: 14, minutes: 120, icon: 'zap', labs: 1,
    blurb: '异常安全、RAII 与智能指针、右值引用与移动语义：把资源管理交给类型系统，写出不泄漏的现代 C++。' }
]);
