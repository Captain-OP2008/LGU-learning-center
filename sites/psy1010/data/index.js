/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * title 与各章 registerChapter 的 title 逐字一致；part 把八章分成五段。
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：心理学的地图与学法', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：心理学回答什么问题、七章怎么衔接、六个视角怎样切换，以及本站的用法。' },
  { id: 'ch01', num: '01', title: '心理学作为科学：证据、变量与推理', en: 'PSYCHOLOGY AS A SCIENCE', part: 'Part II · 方法与生物基础', week: 2, minutes: 90, icon: 'flask', labs: 1,
    blurb: '从莫扎特效应到重复危机：变量与操作定义、实验与相关、效应量与伦理，建立判断证据好坏的标准。' },
  { id: 'ch02', num: '02', title: '脑与行为：从神经元到神经系统', en: 'BRAIN AND BEHAVIOR', part: 'Part II · 方法与生物基础', week: 3, minutes: 90, icon: 'cpu', labs: 1,
    blurb: '神经元怎样放电、递质怎样传递、皮层怎样分工：把行为放回它的生物硬件里看。' },
  { id: 'ch03', num: '03', title: '感觉、知觉与意识', en: 'SENSATION, PERCEPTION & CONSCIOUSNESS', part: 'Part III · 感知与学习', week: 4, minutes: 90, icon: 'sparkle', labs: 1,
    blurb: '从换能与阈限到格式塔与注意，再到睡眠、催眠与药物：意识不是开关，而是一条连续变化的谱。' },
  { id: 'ch04', num: '04', title: '学习：经验怎样改变行为', en: 'LEARNING', part: 'Part III · 感知与学习', week: 5, minutes: 90, icon: 'repeat', labs: 1,
    blurb: '经典与操作条件作用、强化程式、观察学习与行为改变：经验通过什么机制改写行为。' },
  { id: 'ch05', num: '05', title: '记忆：编码、存储与提取', en: 'MEMORY', part: 'Part IV · 记忆与思维', week: 6, minutes: 90, icon: 'memory', labs: 1,
    blurb: '三个记忆系统、编码深度与遗忘的原因，以及重构性记忆为什么让目击者证词不可靠。' },
  { id: 'ch06', num: '06', title: '发展与思维：心智怎样成长与运作', en: 'DEVELOPMENT, THINKING & INTELLIGENCE', part: 'Part IV · 记忆与思维', week: 7, minutes: 90, icon: 'chart', labs: 1,
    blurb: '皮亚杰与维果茨基、依恋与人生阶段，加上概念、问题解决、判断偏差与智力测验的信效度。' },
  { id: 'ch07', num: '07', title: '人格、社会与健康：把心理学用起来', en: 'PERSONALITY, SOCIETY & WELL-BEING', part: 'Part V · 应用与整合', week: 8, minutes: 90, icon: 'target', labs: 1,
    blurb: '动机与情绪、大五人格、从众与服从、压力应对与心理治疗：把前面所有机制用到真实的人身上。' }
]);
