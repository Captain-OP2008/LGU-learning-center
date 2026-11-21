/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：从开关到状态机', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：这门课回答什么问题、七章之间怎么衔接、怎样使用本站与实验流程。' },
  { id: 'ch01', num: '01', title: '数制、补码与编码', en: 'NUMBER SYSTEMS AND CODES', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'keyboard', labs: 1,
    blurb: '二进制、十六进制与位宽，三种有符号表示与溢出判据，BCD、格雷码与检错码——所有电路的共同语言。' },
  { id: 'ch02', num: '02', title: '逻辑门与布尔代数', en: 'LOGIC GATES AND BOOLEAN ALGEBRA', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'function', labs: 1,
    blurb: '逻辑电平、六种基本门、布尔定理与德摩根，最小项与最大项，以及延迟、扇出与功耗三个工程约束。' },
  { id: 'ch03', num: '03', title: '卡诺图与逻辑化简', en: 'KARNAUGH MAPS AND SIMPLIFICATION', part: 'Part III · 深入', week: 3, minutes: 90, icon: 'grid', labs: 1,
    blurb: '用格雷码排列的图形法圈出最简式：三变量与四变量图、圈规则、无关项、多输出共享与 POS 读法。' },
  { id: 'ch04', num: '04', title: '组合逻辑模块', en: 'COMBINATIONAL BUILDING BLOCKS', part: 'Part III · 深入', week: 4, minutes: 90, icon: 'box', labs: 2,
    blurb: '半加器与全加器、行波进位与超前进位、加减共用、译码器、优先编码器、MUX 当查找表、比较器与冒险。' },
  { id: 'ch05', num: '05', title: '锁存器与触发器', en: 'LATCHES AND FLIP-FLOPS', part: 'Part III · 深入', week: 5, minutes: 90, icon: 'repeat', labs: 1,
    blurb: '从反馈到双稳态：SR 与 D 锁存器、主从与边沿触发、建立保持时间与亚稳态、复位策略与 JK/T 触发器。' },
  { id: 'ch06', num: '06', title: '寄存器、计数器与状态机', en: 'REGISTERS, COUNTERS AND FSMs', part: 'Part IV · 综合', week: 6, minutes: 90, icon: 'cpu', labs: 2,
    blurb: '寄存器与移位寄存器、同步计数器与任意模值、Moore 与 Mealy、状态编码取舍，以及三段式控制器的完整写法。' },
  { id: 'ch07', num: '07', title: '存储阵列与系统综合', en: 'MEMORY ARRAYS AND SYSTEM INTEGRATION', part: 'Part IV · 综合', week: 7, minutes: 90, icon: 'memory', labs: 1,
    blurb: 'SRAM 与 DRAM、ROM 家族与 Flash、字扩展与位扩展、PLA 与 FPGA 的 LUT，以及从需求到实现的六步流程。' }
]);
