/* ============================================================================
 * CSC1004 · 站点身份（六门课共用一套框架，这里只描述「这一门课是谁」）
 * 必须在 assets/app.js 之前加载：app.js 从这里读取站点 id、语言与文案。
 * 改完记得同步 index.html 与 sw.js 的版本号，让浏览器与 Service Worker 更新。
 * ========================================================================== */
window.CSC_SITE = {
  id: 'csc1004',
  short: 'JAVA',
  name: '计算机科学与编程导论',
  en: 'Computational Laboratory Using Java',
  lang: 'java',
  langLabel: 'JAVA',
  mode: 'JAVA · PYTHON · GUI',
  bootHead: 'CSC1004 // OBSERVATORY',
  bootLog: [
    'INITIALIZING CORE .......... OK',
    'LOADING MODULES ............ {{CHAPTERS}}',
    'JAVA SUBSET ENGINE ......... READY',
    'TOPOGRAPHY RENDERER ........ ONLINE',
    'OPTICS CALIBRATED .......... 100%'
  ],
  tagline: '深空观测台 · Java 与 Python 实验课',
  missionEn: 'COMPUTATIONAL LABORATORY USING JAVA',
  lede: '21 个任务模块：从一个 Java 类，到一个能聊天的服务器、一盘能下的五子棋、一条能动的蛇。',
  searchPlaceholder: 'QUERY // 搜索：继承 · Socket · 多线程 · JavaFX · Tkinter',
  aboutLines: [
    ['课程', 'CSC1004 · 计算机科学与编程导论（Computational Laboratory Using Java）'],
    ['主线', 'Java 语言与项目（ch01–ch14）→ Python 与项目（ch15–ch19）→ 期末备考（ch20）'],
    ['站内可运行', 'ch01–ch04 的 Java 子集代码由站内解释器执行；ch05 起（lambda、I/O、Socket、多线程、JavaFX、Python）需本地 JDK 或 Python 环境，站内不执行'],
    ['成绩记录', '答题对错与模拟卷成绩保存在本站专属的 <code>csc.csc1004.*</code> 本地存储中；换浏览器或清缓存会丢失，六门课互不覆盖'],
    ['课程资料', '实验讲义、课件与评分要求以课程页面和老师通知为准']
  ]
};
