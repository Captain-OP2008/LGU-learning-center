/* =====================================================================
 * quiz.js · CHM1001 分章题库
 * 结构：{ items:[{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options?, answer?, accept?, code?, explain }] }
 * 题型：mcq / tf / fill / multi / predict
 * 覆盖：ch00–ch07，每章 7 题，共 56 题；chXX-q1..q3 与正文内嵌 quiz 对应
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = {
    items: [

      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '为什么第 0 章要求在进入公式之前先读「课程地图」？',
        options: [
          { text: '地图里藏着考试原题' },
          { text: '先知道每章解决什么问题、彼此怎么依赖，后面的公式才有挂靠的位置', correct: true },
          { text: '因为地图章节不计入考核' },
          { text: '为了记住教材的页码' }
        ],
        explain: '化学的知识是网状的：没有化学计量就读不懂溶液浓度，没有原子结构就讲不清周期律。先看地图能让你知道「现在学的这一块将来接到哪」，遇到陌生公式时也能判断该回哪一章补。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '本站的章节可以完全打乱顺序学习，例如先学第 5 章热化学、再回头学第 3 章化学计量，不影响理解。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '01 → 02 → 03 是硬依赖：没有原子与化学式，配平无从谈起；没有配平，热化学方程式里的系数与摩尔焓变就算不出来。06 → 07 同理。第 4、5 章可以在第 3 章之后按兴趣调换，但基础段不能跳。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '本站第 1–7 章中，专门讲「先把数字量准」的有效数字与单位换算是哪一章？（填两位编号，如 03）',
        answer: '01',
        accept: ['01', '1', '第1章', 'ch01'],
        explain: '第 1 章处理测量、单位与有效数字，是后面所有计算的地基。摩尔质量、浓度、焓变的数值都要按有效数字规则报出，先在这一章把习惯养对，后面才不会被扣「精度分」。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['calc'],
        stem: '一道题给的密度是 <code>0.789 g/mL</code>，体积是 <code>2.5 L</code>。动笔前第一步应当做什么？',
        options: [
          { text: '直接把 0.789 乘 2.5' },
          { text: '先把 2.5 L 换成 2500 mL，统一单位后再乘', correct: true },
          { text: '先把密度换成 kg/m³ 再乘' },
          { text: '先四舍五入到一位有效数字' }
        ],
        explain: '单位不统一就乘，是量纲错误最常见的来源：0.789 g/mL × 2.5 L 得到的数字没有物理意义。统一到 mL 后得 1.97×10<sup>3</sup> g，约 2.0 kg，两位有效数字与 2.5 L 匹配。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['tool'],
        stem: '做完一章的题目后，复习时间有限，下面哪种安排最有效？',
        options: [
          { text: '把整章例题从头再抄一遍' },
          { text: '只看做对的题，巩固信心' },
          { text: '重做错题并对照章末自检清单，找出错在概念还是计算', correct: true },
          { text: '直接跳到下一章，避免重复' }
        ],
        explain: '错题是信息量最大的样本：它精确指出你的漏洞在哪个知识点。配合自检清单逐条打勾，能把「好像会了」变成「确实会了」。抄例题与只看对题都回避了真正的薄弱环节。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下列哪些属于本课程反复使用的「可计算工具」？（多选）',
        options: [
          { text: '摩尔与摩尔质量', correct: true },
          { text: '化学方程式配平', correct: true },
          { text: '量热公式 q = mcΔT', correct: true },
          { text: '元素中文名称的笔画数' }
        ],
        explain: '本课程把化学写成「可算的」：摩尔把质量换成粒子数，配平给出系数比，量热把温度变化换成热量，量子数把光谱换成能级。名称笔画与计算无关，属于记忆性信息，不能当作工具。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '本站正文共 8 个模块：第 0 章为导览，其余为第 1–7 章。除导览外，正文共几章？（填数字）',
        answer: '7',
        accept: ['7', '七'],
        explain: '第 1–7 章分别覆盖测量、原子分子、化学计量、水溶液反应、热化学、原子结构与周期律、化学键与分子构型。第 0 章只负责地图与使用方法，不计入正文的知识章节。'
      },

      /* ---------------- ch01 物质、能量与测量 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['calc'],
        stem: '<code>0.004050 g</code> 这个测量值有几位有效数字？',
        options: [
          { text: '3 位' },
          { text: '4 位', correct: true },
          { text: '6 位' },
          { text: '7 位' }
        ],
        explain: '前面的三个 0 只定位小数点，不算有效数字；从 4 开始数：4、0、5、0，共 4 位。末尾的 0 因为在小数点后且前面有非零数字，属于有效数字，不能省略。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['calc'],
        stem: '<code>1 m<sup>3</sup></code> 等于 <code>1000 L</code>。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '1 m = 10 dm，所以 1 m<sup>3</sup> = 10<sup>3</sup> dm<sup>3</sup> = 1000 L；而 1 L = 1 dm<sup>3</sup> = 1000 cm<sup>3</sup> = 1000 mL。长度换算要立方，这是单位题最常见的错点。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '铝的密度为 <code>2.70 g/cm<sup>3</sup></code>。一块 <code>54.0 g</code> 的铝体积是多少 <code>cm<sup>3</sup></code>？（填数字）',
        answer: '20.0',
        accept: ['20.0', '20', '20.0 cm3'],
        explain: '由 <code>ρ = m/V</code> 得 <code>V = m/ρ = 54.0 ÷ 2.70 = 20.0 cm<sup>3</sup></code>。54.0 与 2.70 都是三位有效数字，结果也保留三位。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['calc'],
        stem: '把 <code>25.0 °C</code> 换算为热力学温度，结果是多少？',
        options: [
          { text: '298.2 K', correct: true },
          { text: '248.2 K' },
          { text: '25.0 K' },
          { text: '273.2 K' }
        ],
        explain: '<code>T(K) = t(°C) + 273.15</code>，所以 25.0 + 273.15 = 298.15，按三位有效数字报 298.2 K。注意温度差 ΔT 在 °C 与 K 下数值相同，但绝对温度必须加 273.15。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '要把食盐水中的水与食盐分开并回收水，最合适的操作是？',
        options: [
          { text: '过滤' },
          { text: '蒸馏', correct: true },
          { text: '用磁铁吸引' },
          { text: '静置后倒出上层' }
        ],
        explain: '食盐溶于水形成均相溶液，颗粒太小，过滤无法分离。蒸馏利用水与盐的沸点差异，先汽化水再冷凝收集，既得到纯水又留下盐。过滤只适用于不溶性固体的分离。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下列变化中属于物理变化的是？（多选）',
        options: [
          { text: '冰融化成水', correct: true },
          { text: '酒精挥发', correct: true },
          { text: '铁钉生锈' },
          { text: '木材燃烧' }
        ],
        explain: '物理变化不产生新物质，只改变状态或形状；冰融化、酒精挥发都属于分子间距离与排列的变化。铁生锈生成 Fe<sub>2</sub>O<sub>3</sub>·nH<sub>2</sub>O，木材燃烧生成 CO<sub>2</sub> 与 H<sub>2</sub>O，都有新物质生成，是化学变化。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '把 <code>5.00 g</code> NaCl（M = 58.44 g/mol）溶于水配成 <code>250.0 mL</code> 溶液，浓度约为多少 mol/L？（保留三位有效数字）',
        answer: '0.342',
        accept: ['0.342', '0.342 mol/L', '0.34'],
        explain: '<code>n = 5.00 ÷ 58.44 = 0.0856 mol</code>，<code>c = 0.0856 ÷ 0.2500 = 0.342 mol/L</code>。体积必须用升，若用 250 直接除会得到 0.000342，差 1000 倍。'
      },

      /* ---------------- ch02 原子、分子与离子 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '某粒子有 17 个质子、18 个中子、17 个电子，它是？',
        options: [
          { text: '<sup>35</sup>Cl 原子', correct: true },
          { text: '<sup>35</sup>Cl<sup>−</sup> 离子' },
          { text: '<sup>36</sup>Ar 原子' },
          { text: '<sup>35</sup>S 原子' }
        ],
        explain: '质子数 17 决定元素是氯，质量数 17 + 18 = 35；电子数 17 等于质子数，说明不带电。若电子是 18 个才写成 Cl<sup>−</sup>。判断顺序是「质子定元素、电子定电荷、质子加中子定质量数」。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '同位素的化学性质几乎相同，但物理性质（如密度、扩散速率）可能不同。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '化学性质由电子排布决定，同位素电子数相同，所以反应行为几乎一致；但中子数不同导致质量不同，扩散、密度、沸点等物理性质会有差异，这也是同位素分离（如铀浓缩）的难点所在。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '在 <code>Fe<sub>2</sub>(SO<sub>4</sub>)<sub>3</sub></code> 的一个化学式单元中，共有几个氧原子？（填数字）',
        answer: '12',
        accept: ['12', '十二'],
        explain: '括号外的下标 3 要乘到括号内每一个原子上：S 为 1×3 = 3 个，O 为 4×3 = 12 个。铁为 2 个。整式共 2 个 Fe、3 个 S、12 个 O，摩尔质量按此累加。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '<code>CuCl<sub>2</sub></code> 的正确名称是？',
        options: [
          { text: '氯化铜' },
          { text: '氯化铜(II)', correct: true },
          { text: '氯化亚铜' },
          { text: '二氯化铜(II)' }
        ],
        explain: '铜是可变价金属，必须用罗马数字标价态。Cl<sup>−</sup> 两个共 −2，铜为 +2，写作氯化铜(II)；CuCl 中铜为 +1，才叫氯化亚铜或氯化铜(I)。「二氯化铜」的写法不用于 IUPAC 命名。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '<code>1.00 mol H<sub>2</sub>O</code> 中约含多少个氢原子？',
        options: [
          { text: '6.02×10<sup>23</sup> 个' },
          { text: '1.20×10<sup>24</sup> 个', correct: true },
          { text: '1.81×10<sup>24</sup> 个' },
          { text: '3.01×10<sup>23</sup> 个' }
        ],
        explain: '1 mol 水分子含 6.02×10<sup>23</sup> 个 H<sub>2</sub>O，每个分子有 2 个氢原子，所以氢原子数为 2 × 6.02×10<sup>23</sup> = 1.20×10<sup>24</sup>。问「原子总数」则是 3 倍，即 1.81×10<sup>24</sup>。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下列物质中属于离子化合物的是？（多选）',
        options: [
          { text: 'NaCl', correct: true },
          { text: 'MgO', correct: true },
          { text: 'K<sub>2</sub>S', correct: true },
          { text: 'CO<sub>2</sub>' }
        ],
        explain: '活泼金属与活泼非金属之间电子转移明显，形成离子化合物：NaCl、MgO、K<sub>2</sub>S 都是。CO<sub>2</sub> 由非金属原子共用电子对构成，是共价分子，熔沸点低、不导电。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '<code><sup>23</sup>Na<sup>+</sup></code> 离子中有几个电子？（填数字）',
        answer: '10',
        accept: ['10', '十'],
        explain: '钠原子质子数 11、电子数 11；失去一个电子后为 Na<sup>+</sup>，电子数 10，与 Ne 的电子排布相同（1s<sup>2</sup>2s<sup>2</sup>2p<sup>6</sup>）。质量数 23 由 11 个质子与 12 个中子构成，与电子数无关。'
      },

      /* ---------------- ch03 化学计量 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['calc'],
        stem: '配平 <code>C<sub>3</sub>H<sub>8</sub> + O<sub>2</sub> → CO<sub>2</sub> + H<sub>2</sub>O</code> 后，O<sub>2</sub> 的系数是？',
        options: [
          { text: '3' },
          { text: '4' },
          { text: '5', correct: true },
          { text: '7' }
        ],
        explain: '先配碳：3 个 CO<sub>2</sub>；再配氢：4 个 H<sub>2</sub>O；右边氧共 3×2 + 4×1 = 10 个，左边需 5 个 O<sub>2</sub>。完整方程：C<sub>3</sub>H<sub>8</sub> + 5O<sub>2</sub> → 3CO<sub>2</sub> + 4H<sub>2</sub>O。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '判断限量试剂时，只需比较各反应物的摩尔数，摩尔数最小的就是限量试剂。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '必须把摩尔数除以各自的配平系数，得到的商最小者才是限量试剂。例如 2H<sub>2</sub> + O<sub>2</sub> 中，3 mol H<sub>2</sub> 的商是 1.5，2 mol O<sub>2</sub> 的商是 2，尽管 O<sub>2</sub> 摩尔数更少，限量试剂却是 H<sub>2</sub>。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '<code>2H<sub>2</sub> + O<sub>2</sub> → 2H<sub>2</sub>O</code>。若 <code>2.0 mol H<sub>2</sub></code> 与 <code>1.0 mol O<sub>2</sub></code> 完全反应，最多生成多少 mol 水？（填数字）',
        answer: '2.0',
        accept: ['2.0', '2', '2 mol'],
        explain: 'H<sub>2</sub> 的商为 2.0/2 = 1.0，O<sub>2</sub> 的商为 1.0/1 = 1.0，两者恰好完全反应，没有剩余。按 H<sub>2</sub> 与水的 1:1 系数比，生成 2.0 mol 水。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '理论产量为 <code>25.0 g</code>，实际只得到 <code>20.0 g</code>，产率是多少？',
        options: [
          { text: '125%' },
          { text: '80.0%', correct: true },
          { text: '20.0%' },
          { text: '5.00%' }
        ],
        explain: '产率 = 实际产量 ÷ 理论产量 × 100% = 20.0 ÷ 25.0 × 100% = 80.0%。产率超过 100% 通常说明产物未干燥、含杂质，或把副产物也算进了产量。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '<code>100.1 g CaCO<sub>3</sub></code>（M = 100.1 g/mol）完全分解，理论上得到多少克 CO<sub>2</sub>？',
        options: [
          { text: '44.0 g', correct: true },
          { text: '56.0 g' },
          { text: '100.1 g' },
          { text: '22.0 g' }
        ],
        explain: 'CaCO<sub>3</sub> → CaO + CO<sub>2</sub>，1 mol 碳酸钙生成 1 mol CO<sub>2</sub>。100.1 g 正好 1.00 mol，CO<sub>2</sub> 摩尔质量 44.01 g/mol，故得 44.0 g；余下 56.0 g 是 CaO 的质量。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['experiment'],
        stem: '下列哪些操作会使实测产率偏低？（多选）',
        options: [
          { text: '过滤时产物残留在烧杯壁上未转移', correct: true },
          { text: '洗涤沉淀时用了大量冷水，部分产物溶解损失', correct: true },
          { text: '加热时发生副反应生成其他物质', correct: true },
          { text: '称量前把产物充分干燥' }
        ],
        explain: '产率偏低来自「产物少了」：转移损失、洗涤溶解、副反应消耗都会减少目标产物。充分干燥去掉的是水分，会让称量值更接近真实产量，通常使产率上升而不是下降。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-7', tier: 3, type: 'fill', difficulty: 3,
        tags: ['calc'],
        stem: '<code>2Al + 6HCl → 2AlCl<sub>3</sub> + 3H<sub>2</sub></code>。若 <code>0.500 mol Al</code> 与足量盐酸反应，生成多少 mol H<sub>2</sub>？（填数字）',
        answer: '0.750',
        accept: ['0.750', '0.75', '3/4'],
        explain: 'Al 与 H<sub>2</sub> 的系数比为 2:3，所以 <code>n(H<sub>2</sub>) = 0.500 × 3/2 = 0.750 mol</code>。盐酸足量，铝是限量试剂，直接用铝的摩尔数乘系数比即可。'
      },

      /* ---------------- ch04 水溶液反应 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '把 <code>AgNO<sub>3</sub></code> 溶液与 <code>NaCl</code> 溶液混合，生成的白色沉淀是？',
        options: [
          { text: 'AgCl', correct: true },
          { text: 'NaNO<sub>3</sub>' },
          { text: 'AgNa' },
          { text: 'ClNO<sub>3</sub>' }
        ],
        explain: '两种溶液混合后离子重新组合，Ag<sup>+</sup> 与 Cl<sup>−</sup> 生成难溶的 AgCl 白色沉淀；Na<sup>+</sup> 与 NO<sub>3</sub><sup>−</sup> 留在溶液中，是旁观离子。净离子方程式为 Ag<sup>+</sup> + Cl<sup>−</sup> → AgCl(s)。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '写净离子方程式时，应把未参与反应的旁观离子也保留在方程式中。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '净离子方程式只保留实际发生变化的粒子，旁观离子（如 Na<sup>+</sup>、NO<sub>3</sub><sup>−</sup>）两边都有、可以约去。保留它们会让方程式失去「净」的意义，也无法反映反应的本质。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '<code>0.100 L</code> 的 <code>0.200 mol/L HCl</code> 恰好被 <code>0.100 mol/L NaOH</code> 中和，需要 NaOH 溶液多少 L？（填数字）',
        answer: '0.200',
        accept: ['0.200', '0.2', '200 mL'],
        explain: 'HCl 的物质的量为 0.100 × 0.200 = 0.0200 mol；1:1 中和需要 0.0200 mol NaOH，体积为 0.0200 ÷ 0.100 = 0.200 L。注意体积单位统一用 L 再代公式。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '在 <code>2Fe<sup>3+</sup> + Sn<sup>2+</sup> → 2Fe<sup>2+</sup> + Sn<sup>4+</sup></code> 中，氧化剂是？',
        options: [
          { text: 'Fe<sup>3+</sup>', correct: true },
          { text: 'Sn<sup>2+</sup>' },
          { text: 'Fe<sup>2+</sup>' },
          { text: 'Sn<sup>4+</sup>' }
        ],
        explain: '氧化剂自身被还原、得到电子。Fe<sup>3+</sup> 的价态从 +3 降到 +2，得电子被还原，所以是氧化剂；Sn<sup>2+</sup> 从 +2 升到 +4，失电子被氧化，是还原剂。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '<code>0.010 mol/L HCl</code> 溶液的 pH 约为？',
        options: [
          { text: '1.00' },
          { text: '2.00', correct: true },
          { text: '12.00' },
          { text: '0.010' }
        ],
        explain: 'HCl 是强酸，完全电离，[H<sup>+</sup>] = 0.010 mol/L，pH = −lg(0.010) = 2.00。若误把 pH 当成浓度直接抄成 0.010，就混淆了定义。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下列反应中属于氧化还原反应的是？（多选）',
        options: [
          { text: '2H<sub>2</sub> + O<sub>2</sub> → 2H<sub>2</sub>O', correct: true },
          { text: 'Zn + Cu<sup>2+</sup> → Zn<sup>2+</sup> + Cu', correct: true },
          { text: 'CH<sub>4</sub> + 2O<sub>2</sub> → CO<sub>2</sub> + 2H<sub>2</sub>O', correct: true },
          { text: 'HCl + NaOH → NaCl + H<sub>2</sub>O' }
        ],
        explain: '判断标准是元素价态是否变化：H 由 0 变 +1、O 由 0 变 −2；Zn 由 0 变 +2、Cu 由 +2 变 0；甲烷燃烧中 C 由 −4 变 +4。中和反应中各元素价态不变，不是氧化还原。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 3, type: 'fill', difficulty: 3,
        tags: ['calc'],
        stem: '<code>25.0 mL</code> 的 <code>0.150 mol/L H<sub>2</sub>SO<sub>4</sub></code> 完全中和需要多少 mol NaOH？（填数字）',
        answer: '0.00750',
        accept: ['0.00750', '0.0075', '7.50e-3', '7.5×10-3'],
        explain: 'H<sub>2</sub>SO<sub>4</sub> 的物质的量为 0.0250 × 0.150 = 0.00375 mol，每个分子提供 2 个 H<sup>+</sup>，故需 NaOH 0.00375 × 2 = 0.00750 mol。硫酸是二元酸，系数 2 不能漏。'
      },

      /* ---------------- ch05 热化学 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '一个反应放热，以体系为参照，它的 ΔH 符号是？',
        options: [
          { text: '正' },
          { text: '负', correct: true },
          { text: '零' },
          { text: '无法判断' }
        ],
        explain: '焓变的符号以体系为准：体系放热，焓降低，ΔH 为负。与之对应，q 也为负（体系向环境放热）。符号写反是热化学失分最多的地方，牢记「放热为负、吸热为正」。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '盖斯定律成立的根本原因是焓是状态函数，与反应路径无关。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '状态函数只取决于始态与终态，所以无论反应是一步完成还是分几步完成，总焓变相同。正因如此，才能把已知反应的 ΔH 相加、相减、乘系数，拼出无法直接测量的目标反应。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '中和反应放出 <code>2.88 kJ</code> 热量，生成 <code>0.0500 mol</code> 水。每摩尔水的焓变是多少 kJ/mol？（带符号，保留三位有效数字）',
        answer: '-57.6',
        accept: ['-57.6', '−57.6', '-57.60'],
        explain: '每摩尔焓变 = −2.88 ÷ 0.0500 = −57.6 kJ/mol。放热必须带负号；数值与文献值 −57.3 kJ/mol 的差异来自热量散失与近似比热容。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['experiment'],
        stem: '弹式量热计在恒容条件下工作，它直接测得的是？',
        options: [
          { text: 'ΔH' },
          { text: 'ΔE（内能变化）', correct: true },
          { text: '熵变 ΔS' },
          { text: '吉布斯自由能变 ΔG' }
        ],
        explain: '恒容时体积功为零，q<sub>V</sub> = ΔE。恒压杯式量热计测的才是 ΔH。两者相差 ΔnRT，对凝聚相反应很小，对涉及气体的燃烧反应则需换算。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '已知 ΔH<sub>f</sub>°(CH<sub>4</sub>) = −74.8、ΔH<sub>f</sub>°(CO<sub>2</sub>) = −393.5、ΔH<sub>f</sub>°(H<sub>2</sub>O,l) = −285.8 kJ/mol。甲烷完全燃烧生成液态水的 ΔH 约为？',
        options: [
          { text: '−890.3 kJ/mol', correct: true },
          { text: '−604.5 kJ/mol' },
          { text: '+890.3 kJ/mol' },
          { text: '−475.5 kJ/mol' }
        ],
        explain: 'ΔH = [−393.5 + 2×(−285.8)] − [−74.8 + 0] = −965.1 + 74.8 = −890.3 kJ/mol。氧气是单质，生成焓为零；若水写成气态，结果少 44 kJ/mol。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下列物质的 ΔH<sub>f</sub>° 按规定为零的是？（多选）',
        options: [
          { text: 'O<sub>2</sub>(g)', correct: true },
          { text: 'C(石墨)', correct: true },
          { text: 'H<sub>2</sub>(g)', correct: true },
          { text: 'O<sub>3</sub>(g)' }
        ],
        explain: '标准生成焓规定最稳定单质为零：氧气、石墨、氢气都符合。臭氧是氧的另一种同素异形体，不如 O<sub>2</sub> 稳定，其 ΔH<sub>f</sub>° 约为 +142 kJ/mol；金刚石同理不为零。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-6', tier: 3, type: 'fill', difficulty: 3,
        tags: ['calc'],
        stem: '用键能估算 <code>H<sub>2</sub> + Cl<sub>2</sub> → 2HCl</code>：H–H 436、Cl–Cl 243、H–Cl 431 kJ/mol。ΔH 约为多少 kJ/mol？（带符号，填整数）',
        answer: '-183',
        accept: ['-183', '−183', '-183 kJ/mol'],
        explain: '断键吸热 436 + 243 = 679 kJ，成键放热 2 × 431 = 862 kJ，ΔH ≈ 679 − 862 = −183 kJ/mol。实测值 −184.6 kJ/mol，差异来自键能是平均值。'
      },

      /* ---------------- ch06 原子结构与周期律 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '波长 <code>500 nm</code> 的光子，能量约为多少？（h = 6.626×10<sup>−34</sup> J·s）',
        options: [
          { text: '3.98×10<sup>−19</sup> J', correct: true },
          { text: '3.98×10<sup>−28</sup> J' },
          { text: '1.33×10<sup>−19</sup> J' },
          { text: '6.63×10<sup>−34</sup> J' }
        ],
        explain: 'E = hc/λ = (6.626×10<sup>−34</sup>)(3.00×10<sup>8</sup>)/(500×10<sup>−9</sup>) ≈ 3.98×10<sup>−19</sup> J，约合 240 kJ/mol。这个量级与键能相当，所以可见光与紫外光能引发化学变化。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '主量子数 <code>n = 2</code> 的电子层最多能容纳 8 个电子。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '每层最多 2n<sup>2</sup> 个电子，n = 2 时为 8：一个 2s 轨道（2 个）加三个 2p 轨道（6 个）。n = 3 时为 18，但要注意 3d 的实际填充顺序在 4s 之后。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '按构造原理，钾（K，Z = 19）的第 19 个电子填入哪个亚层？（填如 3d 的记号）',
        answer: '4s',
        accept: ['4s', '4s1', '4s<sup>1</sup>'],
        explain: '填充顺序为 1s 2s 2p 3s 3p 4s 3d，前 18 个电子填到 3p<sup>6</sup>（氩），第 19 个进入 4s。原因是 4s 电子穿透性强、受屏蔽较少，能量低于 3d。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '铬（Cr，Z = 24）的基态电子排布是？',
        options: [
          { text: '[Ar]4s<sup>2</sup>3d<sup>4</sup>' },
          { text: '[Ar]4s<sup>1</sup>3d<sup>5</sup>', correct: true },
          { text: '[Ar]4s<sup>2</sup>3d<sup>6</sup>' },
          { text: '[Ar]4s<sup>0</sup>3d<sup>6</sup>' }
        ],
        explain: '半满的 3d<sup>5</sup> 更稳定，所以一个 4s 电子转入 3d，实测排布为 [Ar]4s<sup>1</sup>3d<sup>5</sup>。铜同理写成 [Ar]4s<sup>1</sup>3d<sup>10</sup>。这两个例外要单独记。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-7', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '同一周期从左到右，原子半径的总体趋势是？',
        options: [
          { text: '增大' },
          { text: '减小', correct: true },
          { text: '先增大后减小' },
          { text: '保持不变' }
        ],
        explain: '同周期电子加在同一层，屏蔽增加得慢，有效核电荷 Z<sub>eff</sub> 增大，把电子云拉得更紧，半径减小。同族从上到下则因增加新电子层，半径增大。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下列量子数组合中，取值合法的是？（多选）',
        options: [
          { text: 'n = 3, l = 2', correct: true },
          { text: 'n = 2, l = 1, m<sub>l</sub> = 0', correct: true },
          { text: 'n = 4, l = 0, m<sub>s</sub> = +1/2', correct: true },
          { text: 'n = 2, l = 2' }
        ],
        explain: 'l 的取值范围是 0 到 n−1，所以 n = 2 时 l 只能是 0 或 1，不能取 2；m<sub>l</sub> 取 −l 到 +l，l = 1 时 0 合法；m<sub>s</sub> 只取 ±1/2。n = 3, l = 2 对应 3d，也合法。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-2', tier: 3, type: 'fill', difficulty: 3,
        tags: ['calc'],
        stem: '氢原子电子从 <code>n = 3</code> 跃迁到 <code>n = 2</code>，放出光子的能量约为多少 eV？（保留两位小数）',
        answer: '1.89',
        accept: ['1.89', '1.89 eV', '1.9'],
        explain: 'ΔE = 13.6 × (1/2<sup>2</sup> − 1/3<sup>2</sup>) = 13.6 × (0.25 − 0.111) = 1.89 eV，对应波长约 656 nm，正是氢原子巴尔末系的红线。'
      },

      /* ---------------- ch07 化学键与分子构型 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '<code>CO<sub>2</sub></code> 的分子几何是？',
        options: [
          { text: '直线形', correct: true },
          { text: 'V 形' },
          { text: '平面三角' },
          { text: '四面体' }
        ],
        explain: '碳周围有两个电子域（两个双键，双键算一个域），无孤对，故为直线形，键角 180°。两个 C=O 键矩大小相等、方向相反，所以 CO<sub>2</sub> 整体非极性。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '孤对电子的排斥作用强于成键电子对，因此会使键角小于理想值。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '孤对只受一个核束缚，电子云更胖，排斥更强：lp–lp > lp–bp > bp–bp。所以 CH<sub>4</sub> 的 109.5° 在 NH<sub>3</sub> 降为 107°、在 H<sub>2</sub>O 降为 104.5°。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '水分子中氧原子的杂化类型是什么？（填 sp、sp2、sp3 之一）',
        answer: 'sp3',
        accept: ['sp3', 'sp<sup>3</sup>', 'SP3'],
        explain: '氧周围有 4 个电子域：两个 O–H 键加两对孤对，所以是 sp<sup>3</sup> 杂化，电子几何为四面体。因两对孤对挤压，键角从 109.5° 降到 104.5°，分子呈 V 形。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '下列分子中，整体为非极性的是？',
        options: [
          { text: 'H<sub>2</sub>O' },
          { text: 'NH<sub>3</sub>' },
          { text: 'CCl<sub>4</sub>', correct: true },
          { text: 'CHCl<sub>3</sub>' }
        ],
        explain: 'CCl<sub>4</sub> 是正四面体，四个 C–Cl 键矩大小相等、在空间对称抵消，净偶极为零。H<sub>2</sub>O（V 形）、NH<sub>3</sub>（三角锥）、CHCl<sub>3</sub>（四面体但四个方向不同）键矩无法抵消，都是极性分子。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'O<sub>2</sub> 具有顺磁性，分子轨道理论的解释是？',
        options: [
          { text: '两个 π* 反键轨道各有一个未成对电子', correct: true },
          { text: '氧原子本身有未成对电子' },
          { text: 'O=O 双键中的 σ 键断裂' },
          { text: '氧分子是极性分子' }
        ],
        explain: 'O<sub>2</sub> 的价电子排布在 π* 轨道上填入两个单占电子，总自旋不为零，因此被磁场吸引。Lewis 结构把所有电子画成对，无法解释这一现象，这是分子轨道理论最著名的成功。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下列分子之间能形成氢键的是？（多选）',
        options: [
          { text: 'HF', correct: true },
          { text: 'NH<sub>3</sub>', correct: true },
          { text: 'H<sub>2</sub>O', correct: true },
          { text: 'CH<sub>4</sub>' }
        ],
        explain: '氢键要求 H 直接连在 N、O、F 上：HF、NH<sub>3</sub>、H<sub>2</sub>O 都满足。CH<sub>4</sub> 的氢连在碳上，C–H 键极性弱、碳没有孤对，不能形成氢键，所以甲烷沸点远低于水。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-3', tier: 3, type: 'fill', difficulty: 3,
        tags: ['concept'],
        stem: '<code>SO<sub>4</sub><sup>2−</sup></code> 中硫原子周围有几个电子域？（填数字）',
        answer: '4',
        accept: ['4', '四'],
        explain: '硫与四个氧成键，每个氧算一个域，共 4 个域，所以是四面体几何、sp<sup>3</sup> 杂化。虽然画 Lewis 结构时常用双键表示超价，但数域时双键仍只算一个。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
