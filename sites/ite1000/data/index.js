/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * title 必须与 data/chXX.js 里的 title 逐字一致。
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：IT 素养到底练什么', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：七个模块各回答什么问题、彼此怎么依赖、这门课到底不教什么。' },
  { id: 'ch01', num: '01', title: '现代信息技术全景：从 ENIAC 到口袋里的机器', en: 'MODERN IT LANDSCAPE', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'cpu', labs: 1,
    blurb: '用算力、存储、网络、接口四条线，把七十年的信息技术史压缩成一张能读懂的结构图。' },
  { id: 'ch02', num: '02', title: '电子表格：把数据变成可复算的模型', en: 'SPREADSHEETS & DATA MODELS', part: 'Part II · 基础', week: 4, minutes: 100, icon: 'grid', labs: 2,
    blurb: '从引用、函数、错误值到图表与排序筛选，把手工表改造成改一个数就全部更新的模型。' },
  { id: 'ch03', num: '03', title: '信息安全：CIA 三要素与攻防常识', en: 'INFORMATION SECURITY', part: 'Part III · 深入', week: 6, minutes: 110, icon: 'layers', labs: 2,
    blurb: '用机密、完整、可用三要素拆解攻击与防护，重点落在口令、钓鱼、补丁与备份这些日常动作。' },
  { id: 'ch04', num: '04', title: '信息素养：从信息过载到可引用的结论', en: 'INFORMATION LITERACY', part: 'Part III · 深入', week: 8, minutes: 110, icon: 'target', labs: 2,
    blurb: '按 Big6 走完一次查证：定义问题、限定检索、评价来源、规范引用，让结论能被别人复核。' },
  { id: 'ch05', num: '05', title: '新兴技术：芯片、云、大数据与 AI', en: 'EMERGING TECHNOLOGIES', part: 'Part III · 深入', week: 10, minutes: 110, icon: 'rocket', labs: 1,
    blurb: '把芯片、云、大数据、IoT、5G 与 AI 放回同一条产业链，学会用五个问题拆解技术宣传。' },
  { id: 'ch06', num: '06', title: '知识产权与 IT 伦理：谁拥有这段代码和这张图', en: 'INTELLECTUAL PROPERTY & IT ETHICS', part: 'Part IV · 综合', week: 12, minutes: 110, icon: 'star', labs: 1,
    blurb: '分清专利、商标、版权的边界，用合理使用四要素与引用规范处理图片、代码与音乐。' },
  { id: 'ch07', num: '07', title: '视频项目：把研究讲成五分钟', en: 'VIDEO PROJECT & PRESENTATION', part: 'Part IV · 综合', week: 14, minutes: 120, icon: 'play', labs: 3,
    blurb: '按真实交付节奏完成一支英文解说视频：收窄选题、写脚本分镜、拍摄剪辑、合规提交。' }
]);
