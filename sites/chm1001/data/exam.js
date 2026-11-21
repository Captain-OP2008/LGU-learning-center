/* =====================================================================
 * exam.js · CHM1001 模拟卷 A（CSC.registerExam）
 * 范围：ch00–ch07 综合
 * 规格：12 题、满分 100、限时 90 分钟
 * 题型：choice / tf / fill / output / keywords
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerExam({
    id: 'CHM1001-A',
    title: '普通化学 模拟卷 A',
    style: '期末风格',
    subtitle: 'CHM1001 · 覆盖 ch00–ch07 的综合模拟',
    date: '2026-11-21',
    minutes: 90,
    totalScore: 100,
    summary: '本卷覆盖八章：课程地图、测量与有效数字、原子分子与离子、化学计量、水溶液反应、' +
      '热化学、原子结构与周期律、化学键与分子构型。卷面 12 题：选择 3 题共 24 分、判断 1 题共 8 分、' +
      '填空 2 题共 16 分、计算写答案 3 题共 24 分、简答与解释 3 题共 28 分，合计 100 分。' +
      '建议闭卷限时完成；计算题写出关键步骤，简答题按关键词命中比例给分。',
    instructions: [
      '时间 90 分钟，满分 100 分。计时开始后不暂停，刷新页面也按真实时间计算。',
      '题型：单项选择 6 小问、判断 2 小问、填空 4 小问、计算写答案 6 小问、简答 7 小问。',
      '计算题只需写最终答案，但建议保留一两步关键变形以便自查；简答题按关键词命中比例给分。',
      '除特别说明外，温度取 298 K，气体摩尔体积取 22.4 L/mol（标准状况），相对原子质量用整数近似。',
      '本卷不提供公式表。若某题卡住超过 6 分钟，先标记跳过，最后统一回看。'
    ],
    questions: [

      /* ---------------------------------------------------------- Q1 */
      { no: 1, points: 8, type: 'single choice',
        intro: '本题考察测量、有效数字与单位换算。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '测量值 <code>0.02030 g</code> 有几位有效数字？',
            options: [
              { text: '3 位' },
              { text: '4 位', correct: true },
              { text: '5 位' },
              { text: '6 位' }
            ],
            explain: '开头的两个 0 只定位小数点，不算有效数字；从 2 开始数：2、0、3、0，共 4 位。末尾的 0 位于小数点后且前面有非零数字，属于有效数字。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '密度 <code>1.50 g/cm<sup>3</sup></code> 换算为 <code>kg/m<sup>3</sup></code> 是多少？',
            options: [
              { text: '1.50' },
              { text: '15.0' },
              { text: '1.50×10<sup>3</sup>', correct: true },
              { text: '1.50×10<sup>−3</sup>' }
            ],
            explain: '<code>1 g/cm<sup>3</sup> = 1000 kg/m<sup>3</sup></code>：1 g = 10<sup>−3</sup> kg，1 cm<sup>3</sup> = 10<sup>−6</sup> m<sup>3</sup>，相除得 10<sup>3</sup>。所以 1.50 g/cm<sup>3</sup> = 1.50×10<sup>3</sup> kg/m<sup>3</sup>，数值变大是正常的，因为 kg/m<sup>3</sup> 是更小的单位。' }
        ] },

      /* ---------------------------------------------------------- Q2 */
      { no: 2, points: 8, type: 'true / false',
        intro: '判断下列陈述的真假，并说明理由。',
        parts: [
          { label: '(a)', points: 4, kind: 'tf',
            prompt: '焓是状态函数，所以反应热只取决于始态与终态，与反应路径无关。',
            options: [
              { text: '正确', correct: true },
              { text: '错误' }
            ],
            explain: '焓 H = E + pV 由状态决定，ΔH 只与始态、终态有关。这正是盖斯定律成立的原因：分几步完成与一步完成的总焓变相同。注意这一结论对恒压过程成立，恒容时对应的是 ΔE。' },
          { label: '(b)', points: 4, kind: 'tf',
            prompt: '判断限量试剂时，只要比较各反应物的摩尔数，摩尔数最少的就是限量试剂。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: '必须把各反应物的摩尔数除以配平系数，商最小者才是限量试剂。例如 <code>2H<sub>2</sub> + O<sub>2</sub> → 2H<sub>2</sub>O</code> 中 3 mol H<sub>2</sub> 与 2 mol O<sub>2</sub>，H<sub>2</sub> 摩尔数更多，但商 1.5 小于 2，限量试剂是 H<sub>2</sub>。' }
        ] },

      /* ---------------------------------------------------------- Q3 */
      { no: 3, points: 8, type: 'fill in the blank',
        intro: '直接写出数值，注意单位与有效数字。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '<code>2.50 mol CO<sub>2</sub></code> 中约含多少个分子？（用科学计数法，保留三位有效数字）',
            answer: '1.51×10<sup>24</sup>',
            accept: ['1.51×10^24', '1.51e24', '1.51*10^24', '1.51×10<sup>24</sup>'],
            explain: '<code>N = n × N<sub>A</sub> = 2.50 × 6.022×10<sup>23</sup> = 1.51×10<sup>24</sup></code>。若问原子总数则再乘 3，因为每个 CO<sub>2</sub> 有 3 个原子。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '<code>Ca(NO<sub>3</sub>)<sub>2</sub></code> 的摩尔质量是多少 g/mol？（保留一位小数）',
            answer: '164.1',
            accept: ['164.1', '164.10', '164'],
            explain: 'Ca 40.08 + 2×(N 14.01 + 3×O 16.00) = 40.08 + 2×62.01 = 164.10 g/mol。注意括号外的 2 要乘到硝酸根的每一个原子上。' }
        ] },

      /* ---------------------------------------------------------- Q4 */
      { no: 4, points: 8, type: 'single choice',
        intro: '本题考察原子结构与电子排布。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '铁（Fe，Z = 26）的基态电子排布是？',
            options: [
              { text: '[Ar]4s<sup>2</sup>3d<sup>6</sup>', correct: true },
              { text: '[Ar]4s<sup>1</sup>3d<sup>7</sup>' },
              { text: '[Ar]3d<sup>8</sup>' },
              { text: '[Ar]4s<sup>2</sup>3d<sup>8</sup>' }
            ],
            explain: '按构造原理填满 4s 后填 3d：26 − 18 = 8 个电子，即 4s<sup>2</sup>3d<sup>6</sup>。Fe 不属于 Cr、Cu 那类半满/全满例外。注意电离时先失 4s 电子，Fe<sup>2+</sup> 为 [Ar]3d<sup>6</sup>。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '第二周期中，第一电离能明显高于相邻元素的是？',
            options: [
              { text: 'Li 与 Be' },
              { text: 'Be 与 N', correct: true },
              { text: 'B 与 O' },
              { text: 'F 与 Ne' }
            ],
            explain: 'Be 的 2s<sup>2</sup> 全满、N 的 2p<sup>3</sup> 半满，都特别稳定，失去电子需要额外能量，所以在曲线上形成两个峰。B（2p<sup>1</sup>）与 O（2p<sup>4</sup>）反而偏低，对应两处凹陷。' }
        ] },

      /* ---------------------------------------------------------- Q5 */
      { no: 5, points: 8, type: 'calculation',
        intro: '写出关键步骤与最终答案。',
        parts: [
          { label: '(a)', points: 4, kind: 'output',
            prompt: '<code>5.40 g Al</code>（M = 27.0 g/mol）与 <code>0.500 L 1.00 mol/L HCl</code> 反应：<code>2Al + 6HCl → 2AlCl<sub>3</sub> + 3H<sub>2</sub></code>。哪一种反应物是限量试剂？生成多少 mol H<sub>2</sub>？',
            answer: 'HCl 为限量试剂，生成 0.250 mol H<sub>2</sub>',
            explain: 'Al 为 5.40/27.0 = 0.200 mol，商 0.200/2 = 0.100；HCl 为 0.500 mol，商 0.500/6 = 0.0833，更小，故 HCl 限量。H<sub>2</sub> = 0.500 × 3/6 = 0.250 mol。剩余 Al 为 0.200 − 0.500×2/6 = 0.033 mol，约 0.90 g。' },
          { label: '(b)', points: 4, kind: 'output',
            prompt: '<code>0.500 g</code> 某有机物完全燃烧后，用碱石灰吸收生成的 CO<sub>2</sub>，增重 <code>1.10 g</code>。生成 CO<sub>2</sub> 的物质的量是多少？其中含碳多少克？',
            answer: '0.0250 mol CO<sub>2</sub>，含碳 0.300 g',
            explain: 'CO<sub>2</sub> 摩尔质量 44.0 g/mol，<code>n = 1.10/44.0 = 0.0250 mol</code>；每个 CO<sub>2</sub> 含 1 个碳，碳质量 <code>0.0250 × 12.0 = 0.300 g</code>。剩余 0.200 g 为氢与氧，需再结合水的增重才能分配。' }
        ] },

      /* ---------------------------------------------------------- Q6 */
      { no: 6, points: 8, type: 'short answer',
        intro: '按关键词作答，每题写 2–4 句。',
        parts: [
          { label: '(a)', points: 4, kind: 'keywords',
            prompt: '为什么氢原子的发射光谱是几条离散的亮线，而不是连续彩带？',
            keywords: ['能级量子化', '分立的能级', 'ΔE = hν', '只在特定能级间跃迁', '光子能量等于能级差'],
            explain: '电子的能量只能取分立值，跃迁时放出光子的能量严格等于两个能级之差；由 E = hν 可知每个能量差对应一个确定波长，因此光谱是线状而非连续。连续谱对应能量可以任意变化的情形。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '为什么钾的第 19 个电子填入 4s 而不是 3d？',
            keywords: ['穿透效应', '屏蔽较小', '4s 能量更低', '构造原理', '3d 能量高于 4s'],
            explain: '4s 电子在核附近出现的概率更大（穿透），受到的屏蔽较少，有效核电荷更高，因此能量低于 3d；按构造原理先填能量低的轨道。一旦 3d 上有电子，3d 能量会降到 4s 以下，所以电离时先失 4s。' }
        ] },

      /* ---------------------------------------------------------- Q7 */
      { no: 7, points: 8, type: 'calculation',
        intro: '沉淀反应的计算，注意限量试剂与体积变化。',
        parts: [
          { label: '(a)', points: 4, kind: 'output',
            prompt: '将 <code>50.0 mL 0.200 mol/L AgNO<sub>3</sub></code> 与 <code>50.0 mL 0.100 mol/L NaCl</code> 混合，生成 AgCl 沉淀多少克？（M(AgCl) = 143.4 g/mol）',
            answer: '0.717 g',
            explain: 'Ag<sup>+</sup> 为 0.0100 mol，Cl<sup>−</sup> 为 0.00500 mol，Cl<sup>−</sup> 限量。AgCl 为 0.00500 mol，质量 <code>0.00500 × 143.4 = 0.717 g</code>。混合后总体积 100.0 mL，剩余 Ag<sup>+</sup> 约 0.0500 mol/L。' },
          { label: '(b)', points: 4, kind: 'output',
            prompt: '上题混合液中剩余的 Ag<sup>+</sup> 浓度是多少 mol/L？',
            answer: '0.0500 mol/L',
            explain: '剩余 Ag<sup>+</sup> = 0.0100 − 0.00500 = 0.00500 mol；总体积 50.0 + 50.0 = 100.0 mL = 0.1000 L；<code>c = 0.00500/0.1000 = 0.0500 mol/L</code>。沉淀反应后体积相加，是本题最容易漏的一步。' }
        ] },

      /* ---------------------------------------------------------- Q8 */
      { no: 8, points: 8, type: 'fill in the blank',
        intro: '热化学计算，注意符号与单位。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '<code>100.0 g</code> 水温度升高 <code>10.0 K</code>，吸收多少 kJ 热量？（c = 4.184 J/(g·K)，保留三位有效数字）',
            answer: '4.18',
            accept: ['4.18', '4.18 kJ', '4.2'],
            explain: '<code>q = mcΔT = 100.0 × 4.184 × 10.0 = 4.18×10<sup>3</sup> J = 4.18 kJ</code>。水吸热，若问「水的焓变」则为 +4.18 kJ；若问「反应放热」则取负号。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '已知 ΔH<sub>f</sub>°(NO,g) = +90.3 kJ/mol，则 <code>N<sub>2</sub>(g) + O<sub>2</sub>(g) → 2NO(g)</code> 的 ΔH 是多少 kJ？（带符号）',
            answer: '+180.6',
            accept: ['180.6', '+180.6', '180.6 kJ'],
            explain: '两种反应物都是最稳定单质，生成焓为零；产物 2 mol NO。<code>ΔH = 2 × 90.3 − 0 = +180.6 kJ</code>。正号表示吸热，这也解释了为什么空气在常温下不会自发变成 NO，需要高温（如闪电、引擎）才进行。' }
        ] },

      /* ---------------------------------------------------------- Q9 */
      { no: 9, points: 8, type: 'single choice',
        intro: '本题考察周期律与分子构型。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '下列元素中原子半径最大的是？',
            options: [
              { text: 'Na', correct: true },
              { text: 'Mg' },
              { text: 'Al' },
              { text: 'Si' }
            ],
            explain: '同周期从左到右，核电荷增加、电子加在同一层、Z<sub>eff</sub> 增大，半径逐渐减小，所以 Na 最大、Si 最小。沿族向下则增加电子层，半径增大，因此同族比较时 K 会大于 Na。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '<code>NH<sub>3</sub></code> 的分子几何与中心原子杂化分别是？',
            options: [
              { text: '平面三角，sp<sup>2</sup>' },
              { text: '三角锥，sp<sup>3</sup>', correct: true },
              { text: '三角锥，sp<sup>2</sup>' },
              { text: 'V 形，sp<sup>3</sup>' }
            ],
            explain: '氮周围 4 个电子域（3 个 N–H 键 + 1 对孤对），故为 sp<sup>3</sup> 杂化、电子几何四面体；去掉孤对后分子几何是三角锥，键角约 107°，小于 109.5°。' }
        ] },

      /* ---------------------------------------------------------- Q10 */
      { no: 10, points: 8, type: 'short answer',
        intro: '按关键词作答，要求写出判断依据。',
        parts: [
          { label: '(a)', points: 4, kind: 'keywords',
            prompt: 'CO<sub>2</sub> 是非极性分子而 H<sub>2</sub>O 是极性分子，请从几何与键矩角度解释。',
            keywords: ['直线形', '两个 C=O 键矩方向相反', '矢量和为零', 'V 形', '键矩不能抵消', '净偶极'],
            explain: 'CO<sub>2</sub> 为直线形，两个 C=O 键矩大小相等、方向相反，矢量和为零；H<sub>2</sub>O 为 V 形，两个 O–H 键矩夹角约 104.5°，合成后指向氧一侧，再加上孤对贡献，净偶极不为零。判断极性必须先定几何。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '为什么 NH<sub>3</sub> 的沸点（−33 °C）远高于 PH<sub>3</sub>（−88 °C）？',
            keywords: ['氢键', 'N–H', '孤对', '分子间作用力更强', 'PH<sub>3</sub> 无氢键', '色散力'],
            explain: 'NH<sub>3</sub> 中氢直接连在电负性大的氮上，能与相邻分子的孤对形成氢键，分子间作用力显著增强；PH<sub>3</sub> 中 P–H 极性弱、磷的孤对不易参与，只能靠偶极与色散力，故沸点低得多。' }
        ] },

      /* ---------------------------------------------------------- Q11 */
      { no: 11, points: 8, type: 'calculation',
        intro: '综合计算，注意单位与化学计量关系。',
        parts: [
          { label: '(a)', points: 4, kind: 'output',
            prompt: '<code>2.00 g CaCO<sub>3</sub></code>（M = 100.1 g/mol）与足量盐酸反应，标准状况下生成 CO<sub>2</sub> 多少升？',
            answer: '0.448 L',
            explain: '<code>n(CaCO<sub>3</sub>) = 2.00/100.1 = 0.0200 mol</code>，1:1 生成 CO<sub>2</sub>，故 <code>V = 0.0200 × 22.4 = 0.448 L</code>。若用 25 °C 的气体摩尔体积 24.5 L/mol，则得 0.490 L——题目说标准状况就用 22.4。' },
          { label: '(b)', points: 4, kind: 'output',
            prompt: '已知 ① <code>C(s) + O<sub>2</sub>(g) → CO<sub>2</sub>(g)</code>，ΔH = −393.5 kJ；② <code>CO(g) + ½O<sub>2</sub>(g) → CO<sub>2</sub>(g)</code>，ΔH = −283.0 kJ。求 <code>C(s) + ½O<sub>2</sub>(g) → CO(g)</code> 的 ΔH。',
            answer: '−110.5 kJ',
            explain: '目标反应 = ① − ②，故 ΔH = −393.5 − (−283.0) = −110.5 kJ。CO 无法由碳直接完全燃烧单独得到（总会伴随 CO<sub>2</sub>），只能靠盖斯定律间接求，这是该定律最典型的应用。' }
        ] },

      /* ---------------------------------------------------------- Q12 */
      { no: 12, points: 12, type: 'short answer',
        intro: '综合论述，按要点给分。',
        parts: [
          { label: '(a)', points: 4, kind: 'keywords',
            prompt: '为什么冰的密度小于液态水？',
            keywords: ['氢键', '六方空架结构', '分子排列疏松', '体积膨胀', '融化后结构塌缩'],
            explain: '冰中每个水分子通过氢键与四个邻居相连，形成六方空架结构，分子间空隙大；融化时部分氢键断裂，结构塌缩，分子堆积更紧密，所以水在 4 °C 附近密度最大，冰浮在水面上。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '用分子轨道理论解释 O<sub>2</sub> 的顺磁性，并给出键级。',
            keywords: ['π* 反键轨道', '两个未成对电子', '自旋平行', '键级 2', '顺磁性'],
            explain: 'O<sub>2</sub> 的价电子在 π* 轨道上各填一个电子，共两个未成对电子、自旋平行，故表现为顺磁性；键级 = (8 − 4)/2 = 2，与 O=O 双键一致。Lewis 结构把所有电子配对，无法解释这一现象。' },
          { label: '(c)', points: 4, kind: 'keywords',
            prompt: '实验室用 <code>0.100 mol/L NaOH</code> 滴定 <code>25.0 mL 0.100 mol/L</code> 醋酸，终点时溶液呈碱性。请说明「终点 pH 大于 7」的原因。',
            keywords: ['弱酸', '不完全电离', '醋酸根水解', '生成 OH<sup>−</sup>', '强碱弱酸盐'],
            explain: '醋酸是弱酸，滴定终点生成醋酸钠；醋酸根是弱碱，会水解 <code>CH<sub>3</sub>COO<sup>−</sup> + H<sub>2</sub>O ⇌ CH<sub>3</sub>COOH + OH<sup>−</sup></code>，使溶液显碱性，终点 pH 大于 7。若用酚酞作指示剂，变色范围恰好落在这一区间。' }
        ] }
    ]
  });
})();
