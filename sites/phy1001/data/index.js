/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * title 必须与 chXX.js 的 title 逐字一致
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：力学的起点与路线', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：这门课回答什么问题、各章怎么衔接、怎样使用本站。' },
  { id: 'ch01', num: '01', title: '测量、单位与矢量：物理的语言', en: 'MEASUREMENT & VECTORS', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'function', labs: 1,
    blurb: 'SI 单位、量纲分析、有效数字与矢量运算：把「物理的语言」先学对，后面才不算错。' },
  { id: 'ch02', num: '02', title: '直线运动：位置、速度与加速度', en: 'MOTION IN A STRAIGHT LINE', part: 'Part II · 基础', week: 3, minutes: 90, icon: 'chart', labs: 1,
    blurb: '位移与路程、平均与瞬时、四个运动学方程与图像法：一维运动学是全部力学的语法。' },
  { id: 'ch03', num: '03', title: '二维运动：抛体、圆周与相对运动', en: 'MOTION IN TWO DIMENSIONS', part: 'Part III · 深入', week: 4, minutes: 100, icon: 'target', labs: 1,
    blurb: '把运动分解成两个一维问题：抛体、匀速与变速圆周、切向法向加速度、相对运动。' },
  { id: 'ch04', num: '04', title: '牛顿定律：力如何改变运动', en: "NEWTON'S LAWS", part: 'Part III · 深入', week: 5, minutes: 110, icon: 'zap', labs: 1,
    blurb: '三大定律、自由体图、摩擦与斜面、连接体、圆周动力学与非惯性系：动力学的核心工具箱。' },
  { id: 'ch05', num: '05', title: '功与能量：守恒律的第一种写法', en: 'WORK & ENERGY', part: 'Part III · 深入', week: 6, minutes: 110, icon: 'layers', labs: 1,
    blurb: '功、功率、动能定理、保守力与势能、机械能守恒：用能量绕开复杂的力，是解题的第一捷径。' },
  { id: 'ch06', num: '06', title: '动量与转动：守恒律的两副面孔', en: 'MOMENTUM & ROTATION', part: 'Part IV · 综合', week: 7, minutes: 130, icon: 'repeat', labs: 1,
    blurb: '质心、冲量、碰撞、转动惯量、力矩、角动量守恒与滚动：平动与转动的完整对应表。' },
  { id: 'ch07', num: '07', title: '平衡、引力与振动波：力学的收束', en: 'EQUILIBRIUM, GRAVITY & WAVES', part: 'Part IV · 综合', week: 8, minutes: 140, icon: 'star', labs: 1,
    blurb: '刚体平衡与弹性、万有引力与轨道、流体、简谐运动、单摆、横波与声波、多普勒：力学的收尾。' }
]);
