/* =====================================================================
 * data/index.js · 课程章节清单
 * 职责：定义 10 章的元数据与顺序，供导航、总览、搜索与课时统计使用。
 * 章节正文在 data/chXX.js 中按需加载。
 * ===================================================================== */
CSC.registerMeta([

  /* ----------------------------- Part I · 起点 ----------------------------- */
  {
    id: 'ch00', num: '00', title: '序章：编程是什么', en: 'Prologue',
    part: 'Part I · 起点', week: 0, minutes: 45, icon: 'compass',
    blurb: '程序、解释器、错误——先建立三个直觉，再写第一行代码。'
  },
  {
    id: 'ch01', num: '01', title: '第一个 Python 程序', en: 'First Program',
    part: 'Part I · 起点', week: 1, minutes: 50, icon: 'rocket',
    blurb: '调用函数、打印、注释与缩进：一段文本如何变成屏幕上的结果。'
  },
  {
    id: 'ch02', num: '02', title: '变量、表达式与类型', en: 'Variables, Expressions & Types',
    part: 'Part I · 起点', week: 1, minutes: 50, icon: 'box',
    blurb: '给数据起名字：int / float / str / bool、运算优先级、类型转换。'
  },

  /* -------------------------- Part II · 控制与结构 -------------------------- */
  {
    id: 'ch03', num: '03', title: '条件与循环', en: 'Conditionals & Loops',
    part: 'Part II · 控制与结构', week: 2, minutes: 50, icon: 'branch',
    blurb: '让程序会判断、会重复：if / elif / else、while、for、range、break / continue。'
  },
  {
    id: 'ch04', num: '04', title: '函数与分解', en: 'Functions & Decomposition',
    part: 'Part II · 控制与结构', week: 3, minutes: 50, icon: 'function',
    blurb: '把大问题拆成小问题：def、参数、返回值、作用域、前置/后置条件。'
  },
  {
    id: 'ch05', num: '05', title: '图像与二维循环', en: 'Images & Nested Loops',
    part: 'Part II · 控制与结构', week: 4, minutes: 55, icon: 'grid',
    blurb: '把屏幕当成像素网格：双层循环、坐标、颜色、像素级处理。'
  },

  /* ----------------------------- Part III · 数据 ----------------------------- */
  {
    id: 'ch06', num: '06', title: '字符串与切片', en: 'Strings & Slicing',
    part: 'Part III · 数据', week: 6, minutes: 55, icon: 'list',
    blurb: '文本也是一种序列：索引、切片、in、大小写、查找与替换。'
  },
  {
    id: 'ch07', num: '07', title: '列表与文件', en: 'Lists & Files',
    part: 'Part III · 数据', week: 7, minutes: 50, icon: 'array',
    blurb: '一次存很多数据：list 的增删改查、遍历、排序，以及读写文本文件。'
  },
  {
    id: 'ch08', num: '08', title: '字典与计数', en: 'Dictionaries & Counting',
    part: 'Part III · 数据', week: 8, minutes: 50, icon: 'layers',
    blurb: '用键查值：dict 的增删改查、遍历、get 默认值、计数与分组。'
  },

  /* ----------------------------- Part IV · 综合 ----------------------------- */
  {
    id: 'ch09', num: '09', title: '嵌套结构、排序与综合项目', en: 'Nested Structures, Sorting & Project',
    part: 'Part IV · 综合', week: 9, minutes: 55, icon: 'sort',
    blurb: '列表套字典、字典套列表；排序与查找；用一个真实数据集完成综合项目。'
  }

]);
