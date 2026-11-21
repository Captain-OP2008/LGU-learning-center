/* 站点身份：唯一事实来源。必须在 assets/app.js 之前加载。
   改站点名 / 语言 / 启动文案 / 关于页信息，只改这个文件。 */
window.CSC_SITE = {
  id: 'calculus',
  short: 'CALCULUS',
  name: '微积分 I',
  en: 'CALCULUS I',
  lang: 'text',
  langLabel: 'Text',
  mode: 'TEXT',
  bootHead: 'CALCULUS // OBSERVATORY',
  bootLog: [
    'INITIALIZING CORE .......... OK',
    'LOADING MODULES ............ OK',
    'CONTENT TYPESETTER ......... READY',
    'TOPOGRAPHY RENDERER ........ ONLINE',
    'OPTICS CALIBRATED .......... 100%'
  ],
  tagline: '从极限走到微分方程，把符号背后的图景看清楚。',
  missionEn: 'OBSERVATORY FOR CALCULUS · THOMAS 14E SI',
  lede: '零基础也能读。每一节都从「为什么」讲起，把符号拆开讲，再让你动手拖、即时算、看得见图。',
  searchPlaceholder: '搜索：洛必达 · 中值定理 · 换元 · 泰勒 · 格林公式',
  aboutLines: [
    ['站点', '微积分 I · CALCULUS I：静态离线教材（纯文字 + MathJax 公式 + Canvas 实验台），不依赖任何后端。'],
    ['课程', "CUHK-Shenzhen Calculus I · AY2026-27 Term 1 (L10) · Thomas' Calculus 14e SI"],
    ['存储', '不记录学习进度；答题记录（每题对错统计）与模拟卷成绩保存在本地浏览器 localStorage，键名前缀 csc.calculus.，六门课互不覆盖，不上传服务器。'],
    ['导出', '关于页提供「导出记录 / 导入记录」，导出的 JSON 只含答题与模拟卷成绩，不含任何进度数据。'],
    ['版本', '20261112p1']
  ]
};
