/* =====================================================================
 * data/site.js · 站点标识（框架 app.js 读取）
 * 换一门课只需改这里与 index.html 的静态文案。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'java',
  short: 'JAVA',
  name: '计算机科学与 Java 编程导论',
  en: 'JAVA',
  lang: 'java',
  langLabel: 'Java',
  mode: 'JAVA · JDK SUBSET',
  bootHead: 'JAVA // OBSERVATORY',
  bootLog: [
    'INITIALIZING CORE .......... OK',
    'LOADING MODULES ............ {MODULES}',
    'JAVA SUBSET ENGINE ......... READY',
    'TOPOGRAPHY RENDERER ........ ONLINE',
    'OPTICS CALIBRATED .......... 100%'
  ],
  tagline: '从零学会用 Java 思考',
  missionEn: 'OBSERVATORY FOR COMPUTER SCIENCE & JAVA',
  lede: '零基础也能读。26 个任务模块（14 章主课 + 12 章继续学习），每一块都能<b>动手改、逐行跑、看得见内存</b>。',
  searchPlaceholder: 'QUERY // 搜索：for · 数组越界 · 多态 · Big-O',
  aboutLines: [
    ['定位', '零基础 Java 编程入门：从表达式与变量，到控制流、数组、对象、继承与综合项目；后四部分按教材继续延伸到算法、计算理论与机器硬件。'],
    ['语言范围', '课程范围内的 Java 子集：基本类型、控制流、数组、方法、类与对象、继承 / 多态、集合与常用 API。'],
    ['代码说明', '正文代码块可直接在站内 Java 子集解释器中运行与单步执行；引擎不支持的语法会标注并给出真实 JDK 结果。'],
    ['成绩记录', '答题对错与模拟卷成绩保存在本站专属本地存储 csc.java.* 中，不上传服务器；换浏览器或清缓存会丢失，六门课互不覆盖。']
  ]
};
