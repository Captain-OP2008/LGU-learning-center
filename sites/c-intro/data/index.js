/* =====================================================================
 * data/index.js · 课程章节清单
 * 职责：定义 10 章的元数据与顺序，供导航、总览、搜索与课时统计使用。
 * 章节正文在 data/chXX.js 中按需加载。
 * ===================================================================== */
CSC.registerMeta([

  /* ----------------------------- Part I · 基础 ----------------------------- */
  {
    id: 'ch00', num: '00', title: '序章：从源码到程序', en: 'Prologue',
    part: 'Part I · 基础', week: 0, minutes: 50, icon: 'compass',
    blurb: '源代码、编译、链接、可执行文件——先看清整条链路，再动手写。'
  },
  {
    id: 'ch01', num: '01', title: 'C 程序的结构', en: 'Program Anatomy',
    part: 'Part I · 基础', week: 1, minutes: 55, icon: 'rocket',
    blurb: '头文件、main、语句与分号、printf、变量与基本类型、运算符。'
  },
  {
    id: 'ch02', num: '02', title: '整数、位与字节', en: 'Integers, Bits & Bytes',
    part: 'Part I · 基础', week: 2, minutes: 55, icon: 'box',
    blurb: '数据在内存里到底长什么样：进制、补码、类型大小、溢出与转换。'
  },

  /* --------------------------- Part II · 指针与内存 --------------------------- */
  {
    id: 'ch03', num: '03', title: '位运算', en: 'Bitwise Operators',
    part: 'Part II · 指针与内存', week: 3, minutes: 50, icon: 'cpu',
    blurb: '& | ^ ~ << >>：掩码、置位、取反、移位，以及位级技巧的用途。'
  },
  {
    id: 'ch04', num: '04', title: '字符与 C 字符串', en: 'Chars & C Strings',
    part: 'Part II · 指针与内存', week: 4, minutes: 55, icon: 'keyboard',
    blurb: 'char 数组、\'\\0\' 结尾、strlen / strcpy / strcmp，以及缓冲区边界。'
  },
  {
    id: 'ch05', num: '05', title: '指针与数组', en: 'Pointers & Arrays',
    part: 'Part II · 指针与内存', week: 5, minutes: 50, icon: 'memory',
    blurb: '地址、解引用、指针算术、数组名退化、二级指针与 const。'
  },

  /* ----------------------------- Part III · 堆与抽象 ----------------------------- */
  {
    id: 'ch06', num: '06', title: '栈与堆', en: 'Stack & Heap',
    part: 'Part III · 堆与抽象', week: 7, minutes: 55, icon: 'layers',
    blurb: '内存分段、局部变量、malloc / free、realloc、泄漏与悬垂指针。'
  },
  {
    id: 'ch07', num: '07', title: '泛型与函数指针', en: 'Generics & Function Pointers',
    part: 'Part III · 堆与抽象', week: 8, minutes: 50, icon: 'function',
    blurb: '用 void * 写通用代码：通用交换、通用线性查找、比较函数、qsort。'
  },

  /* --------------------------- Part IV · 机器与安全 --------------------------- */
  {
    id: 'ch08', num: '08', title: '汇编与函数调用', en: 'Assembly & Function Calls',
    part: 'Part IV · 机器与安全', week: 9, minutes: 50, icon: 'engine',
    blurb: 'x86-64 寄存器、指令、栈帧：函数调用、参数传递、递归的机器真相。'
  },
  {
    id: 'ch09', num: '09', title: '内存安全与并发', en: 'Memory Safety & Concurrency',
    part: 'Part IV · 机器与安全', week: 10, minutes: 55, icon: 'fire',
    blurb: '缓冲区溢出、越界写、线程与信号量、竞态条件与死锁。'
  }

]);
