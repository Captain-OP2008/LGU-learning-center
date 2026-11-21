/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * title 必须与 chapters/chXX.js 中的 title 逐字一致。
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：从一颗碳原子到一次心跳', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先看清整门课的地形：三条主线（结构、能量、信息）、七章之间的依赖关系，以及怎么用本站的题库与资料库。' },

  { id: 'ch01', num: '01', title: '化学键与分子形状：电子怎么共享，分子就怎么长', en: 'CHEMICAL BONDS & MOLECULAR SHAPE', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'layers', labs: 1,
    blurb: '从电子排布出发，把离子键、共价键、极性、VSEPR 与杂化串起来，解释为什么分子的形状能决定它的功能。' },

  { id: 'ch02', num: '02', title: '分子间作用力与水：弱作用撑起生命', en: 'INTERMOLECULAR FORCES & WATER', part: 'Part II · 基础', week: 3, minutes: 90, icon: 'sparkle', labs: 1,
    blurb: '氢键、疏水效应、渗透与胶束——四种弱作用如何叠加出既稳定又可逆的组装，以及水为什么是生命的溶剂。' },

  { id: 'ch03', num: '03', title: '酸碱平衡与缓冲：pH、pKa 与血液的 7.40', en: 'ACID–BASE EQUILIBRIUM & BUFFERS', part: 'Part II · 基础', week: 4, minutes: 100, icon: 'chart', labs: 1,
    blurb: '把 Kw、Ka、Henderson–Hasselbalch 与滴定曲线连成一套定量工具，再用它解释血液为什么能稳在 pH 7.40。' },

  { id: 'ch04', num: '04', title: '有机化学与生物分子：碳骨架与官能团', en: 'ORGANIC CHEMISTRY & BIOMOLECULES', part: 'Part III · 深入', week: 6, minutes: 90, icon: 'grid', labs: 1,
    blurb: '碳的四价与异构、立体化学、四类基本反应，以及 ATP 如何把放能反应与吸能反应耦合起来。' },

  { id: 'ch05', num: '05', title: '蛋白质：从氨基酸序列到功能', en: 'PROTEINS: SEQUENCE TO FUNCTION', part: 'Part III · 深入', week: 8, minutes: 110, icon: 'function', labs: 1,
    blurb: '二十种氨基酸、肽键、α-螺旋与 β-折叠、折叠与变性、血红蛋白的协同效应，以及酶动力学的 Km 与 Vmax。' },

  { id: 'ch06', num: '06', title: '糖与核酸：能量货币与信息载体', en: 'CARBOHYDRATES & NUCLEIC ACIDS', part: 'Part IV · 综合', week: 10, minutes: 100, icon: 'memory', labs: 1,
    blurb: '单糖的环化与糖苷键、多糖的两种连接方式，以及 DNA 双螺旋、碱基配对与中心法则的信息流。' },

  { id: 'ch07', num: '07', title: '代谢与人体系统：从葡萄糖到心跳', en: 'METABOLISM & SYSTEMS', part: 'Part IV · 综合', week: 12, minutes: 110, icon: 'zap', labs: 1,
    blurb: '把糖酵解、三羧酸循环与呼吸链算成一笔 32 ATP 的账，再接到血糖调控、循环与呼吸的负反馈上。' }
]);
