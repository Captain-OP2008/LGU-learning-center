/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * title 与 chXX.js 逐字一致；part 分组：ch00 导览、ch01–02 基础、ch03–05 深入、ch06–07 综合
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：从「中国向何处去」到中国式现代化', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 0,
    blurb: '先建立整门课的地图：三次历史性飞跃、一条主线、七章怎么衔接，以及这门课怎么学、怎么考。' },
  { id: 'ch01', num: '01', title: '毛泽东思想：马克思主义中国化的第一次飞跃', en: 'MAO ZEDONG THOUGHT', part: 'Part II · 基础', week: 2, minutes: 110, icon: 'star', labs: 0,
    blurb: '从「马克思主义中国化」命题的提出到党的七大，理解毛泽东思想形成的过程、活的灵魂与历史地位。' },
  { id: 'ch02', num: '02', title: '新民主主义革命理论：农村包围城市的中国道路', en: 'NEW DEMOCRATIC REVOLUTION', part: 'Part II · 基础', week: 3, minutes: 110, icon: 'target', labs: 0,
    blurb: '总路线、三大法宝、农村包围城市道路与新民主主义社会：中国革命为什么必须走自己的路。' },
  { id: 'ch03', num: '03', title: '社会主义改造理论：一场和平的社会变革', en: 'SOCIALIST TRANSFORMATION', part: 'Part III · 深入', week: 4, minutes: 100, icon: 'repeat', labs: 0,
    blurb: '「一化三改」与和平赎买：中国如何在几年内完成生产资料所有制的根本转变，又留下了什么问题。' },
  { id: 'ch04', num: '04', title: '社会主义建设道路的初步探索：以苏为鉴', en: 'EXPLORING THE SOCIALIST ROAD', part: 'Part III · 深入', week: 5, minutes: 110, icon: 'layers', labs: 0,
    blurb: '《论十大关系》、两类矛盾学说与八大的主要矛盾判断：探索的成果、曲折与为后来者留下的基础。' },
  { id: 'ch05', num: '05', title: '邓小平理论：什么是社会主义、怎样建设社会主义', en: 'DENG XIAOPING THEORY', part: 'Part III · 深入', week: 6, minutes: 120, icon: 'sparkle', labs: 0,
    blurb: '社会主义本质、初级阶段、市场经济与「三个有利于」：改革开放的理论突破是怎么发生的。' },
  { id: 'ch06', num: '06', title: '「三个代表」与科学发展观：建设什么样的党、实现什么样的发展', en: 'THREE REPRESENTS & SCIENTIFIC OUTLOOK', part: 'Part IV · 综合', week: 7, minutes: 120, icon: 'grid', labs: 0,
    blurb: '长期执政条件下如何保持先进性、粗放增长之后如何发展：世纪之交的两大课题与两套回答。' },
  { id: 'ch07', num: '07', title: '习近平新时代中国特色社会主义思想：新时代的中国方案', en: 'XI JINPING THOUGHT ON SOCIALISM WITH CHINESE CHARACTERISTICS FOR A NEW ERA', part: 'Part IV · 综合', week: 8, minutes: 140, icon: 'rocket', labs: 0,
    blurb: '主要矛盾转化、中国式现代化、新发展格局与自我革命：新时代的判定依据、理论框架与实践指向。' }
]);
