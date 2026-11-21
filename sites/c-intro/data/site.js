/* =====================================================================
 * data/site.js · 站点标识（框架 app.js 读取）
 * 换一门课只需改这里与 index.html 的静态文案。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'c',
  short: 'C',
  name: 'C 语言与系统基础',
  en: 'C',
  lang: 'c',
  langLabel: 'C',
  mode: 'C11 · 静态示例',
  bootHead: 'C // OBSERVATORY',
  bootLog: [
    'C TOOLCHAIN ............ READY',
    'GCC / CLANG ............ LOCAL',
    'CHAPTERS ............... 10 LOADED',
    'OBSERVATORY LINK ....... STABLE'
  ],
  tagline: '从内存开始理解程序',
  missionEn: 'OBSERVATORY FOR C & SYSTEMS',
  lede: '从源码到机器码。10 个任务模块：类型与位、指针与内存、栈与堆、汇编与安全。',
  searchPlaceholder: 'QUERY // 搜索：指针 · malloc · 位运算 · 栈帧',
  aboutLines: [
    ['定位', 'C 语言与系统基础：以内存为主线，从类型与位讲到指针、堆、汇编与内存安全。'],
    ['语言范围', 'C11 核心语法 + 常用标准库（stdio / stdlib / string）；x86-64 汇编入门。'],
    ['代码说明', '正文中的代码块为静态示例（带行号与语法高亮）。本站不内置编译器，请复制到本地用 gcc / clang 编译运行。'],
    ['成绩记录', '练习与模拟卷的成绩记录保存在本站专属本地存储 csc.c.* 中，不上传服务器；清除浏览器数据会重置。']
  ]
};
