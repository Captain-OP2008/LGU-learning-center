/* =====================================================================
 * exam.js · 模拟卷（CSC.registerExam）
 * 结构：{ id, title, style, subtitle, date, minutes, totalScore, summary, instructions,
 *         questions:[{ no, points, type, intro, code, codeTitle, parts:[{ label, points, kind,
 *                     prompt, options:[{text,correct}], explain }] }] }
 * 本卷：BIO1008-A，12 题，满分 100，建议 100 分钟。
 * ===================================================================== */
CSC.registerExam({
  id: 'BIO1008-A',
  title: '模拟卷 A',
  style: 'MIDTERM',
  subtitle: '覆盖第 1–7 章：化学键与形状、水与弱作用、酸碱与缓冲、有机与生物分子、蛋白、糖与核酸、代谢与系统',
  date: '',
  minutes: 100,
  totalScore: 100,
  summary: '12 题，满分 100 分。选择题 6 题共 48 分，判断题 2 题共 15 分，填空与计算 2 题共 16 分，简答（关键词评分）3 题共 21 分。重点考查「结构决定功能」的推理链、缓冲与代谢的定量计算，以及把分子机制连到生理现象的能力。',
  instructions: [
    '闭卷，100 分钟。计算题需写出公式与单位，只写答案不得满分。',
    '选择题只有一个最佳答案；若题目标明「多选」，则选出所有正确项，漏选得一半分、错选不得分。',
    '简答题按关键词给分：每个要点 2–4 分，答出机制名称、关键数值、因果链三者才算完整。',
    '所有数值请注明单位；pH 保留两位小数，能量保留三位有效数字。'
  ],
  questions: [
    {
      no: 1, points: 8, type: 'choice',
      intro: '下列三个分子的键角依次为 109.5°、107.3°、104.5°。',
      parts: [{
        label: '第 1 题', points: 8, kind: 'choice',
        prompt: 'CH<sub>4</sub>、NH<sub>3</sub>、H<sub>2</sub>O 的键角依次减小，最合理的解释是：',
        options: [
          { text: '中心原子上的孤对电子依次增多，孤对对成键电子对的排斥更强', correct: true },
          { text: '中心原子的原子半径依次减小', correct: false },
          { text: 'H–X 键的键能依次增大', correct: false },
          { text: '分子的总电子数依次增多' }
        ],
        explain: 'VSEPR 的核心是「电子对互相排斥，尽量远离」。CH<sub>4</sub> 四对电子全是成键对，理想四面体 109.5°；NH<sub>3</sub> 有一对孤对，孤对电子云更靠近中心原子、更「胖」，排斥更强，把键角压到 107.3°；H<sub>2</sub>O 有两对孤对，压到 104.5°。递减的原因不是半径或键能，而是孤对数目。'
      }]
    },
    {
      no: 2, points: 8, type: 'choice',
      intro: '冰的密度是 0.917 g·cm<sup>−3</sup>，液态水是 1.000 g·cm<sup>−3</sup>。',
      parts: [{
        label: '第 2 题', points: 8, kind: 'choice',
        prompt: '冰能浮在水面上，其分子层面的原因是：',
        options: [
          { text: '结冰时每个水分子与四个邻居形成四面体氢键网络，产生大量空腔', correct: true },
          { text: '冰中的水分子数量比同体积液态水少，因为水分子蒸发了', correct: false },
          { text: '冰的分子量比液态水大', correct: false },
          { text: '冰中含有大量溶解的空气' }
        ],
        explain: '液态水的氢键不断断裂重组，分子可以挤得更近；结冰时氢键被固定成六方四面体网络，每个分子与四个邻居相连，形成六元环空腔，体积膨胀约 9%。这不是「分子变大」或「有气泡」，而是排列方式造成的密度下降。这一性质让湖面结冰后成为隔热层，水下生物得以越冬。'
      }]
    },
    {
      no: 3, points: 8, type: 'tf',
      intro: '判断下列说法，并说明理由。',
      parts: [
        {
          label: '3(1)', points: 4, kind: 'tf',
          prompt: '同一对原子之间，双键的键长比单键短，键能比单键大。',
          options: [
            { text: '正确', correct: true },
            { text: '错误', correct: false }
          ],
          explain: 'C–C 单键 154 pm / 347 kJ·mol<sup>−1</sup>，C=C 双键 134 pm / 611 kJ·mol<sup>−1</sup>。共享电子对越多，原子核被拉得越近，拆开需要的能量也越大。注意双键键能小于单键的两倍（611 &lt; 2 × 347），因为第二对电子的结合不如第一对牢固。'
        },
        {
          label: '3(2)', points: 4, kind: 'tf',
          prompt: '酶能降低反应的活化能，因此也会改变反应的 ΔG 与平衡常数。',
          options: [
            { text: '正确', correct: false },
            { text: '错误', correct: true }
          ],
          explain: '酶只降低活化能、加快达到平衡的速率，不改变 ΔG，也不改变平衡常数。ΔG 由反应物与产物的本性及浓度决定，与路径无关。催化剂改变的是「走哪条路、走多快」，不是「终点在哪」。'
        }
      ]
    },
    {
      no: 4, points: 8, type: 'fill',
      intro: '某弱酸的 pKa = 4.76，用 NaOH 滴定。',
      parts: [
        {
          label: '4(1)', points: 4, kind: 'fill',
          prompt: '当 [A<sup>−</sup>]/[HA] = 1 时，溶液的 pH = ____（保留两位小数）。',
          answer: '4.76',
          explain: '按 Henderson–Hasselbalch，pH = pKa + log([A<sup>−</sup>]/[HA]) = 4.76 + log 1 = 4.76。这就是「半当量点 pH = pKa」，此时缓冲能力最强。'
        },
        {
          label: '4(2)', points: 4, kind: 'fill',
          prompt: '当 [A<sup>−</sup>]/[HA] = 10 时，pH = ____（保留两位小数）。',
          answer: '5.76',
          explain: 'pH = 4.76 + log 10 = 5.76。碱/酸比例每变化 10 倍，pH 移动 1 个单位；这个换算关系在做缓冲题时最省时间。'
        }
      ]
    },
    {
      no: 5, points: 8, type: 'choice',
      intro: '血液 pH = 7.40，主要缓冲对为 HCO<sub>3</sub><sup>−</sup>/CO<sub>2</sub>。',
      parts: [{
        label: '第 5 题', points: 8, kind: 'choice',
        prompt: '血液中 [HCO<sub>3</sub><sup>−</sup>] = 24 mM、溶解 CO<sub>2</sub> = 1.2 mM，碳酸表观 pKa = 6.1。血液 pH 约为：',
        options: [
          { text: '7.40', correct: true },
          { text: '6.10', correct: false },
          { text: '7.70', correct: false },
          { text: '6.70', correct: false }
        ],
        explain: 'pH = 6.1 + log(24/1.2) = 6.1 + log 20 = 6.1 + 1.30 = 7.40。20:1 这个比例是血液酸碱平衡的核心：HCO<sub>3</sub><sup>−</sup> 由肾慢调，CO<sub>2</sub> 由肺快调，两个器官共同把比例锁在 20，pH 因此稳定在 7.40。'
      }]
    },
    {
      no: 6, points: 10, type: 'keywords',
      intro: '把油与水混合，油会聚成球状。',
      parts: [{
        label: '第 6 题（简答）', points: 10, kind: 'keywords',
        prompt: '用热力学语言解释疏水效应的驱动力。你的答案应包含：有序水、熵变、表面积、以及「为什么不是油分子互相吸引」这四点。',
        explain: '评分关键词：①非极性表面使周围水分子无法自由取向，形成有序笼状结构，熵降低；②油滴聚并后总表面积减小，被束缚的水被释放回自由状态；③体系总熵增大（ΔS &gt; 0），是过程自发的主要驱动力；④油分子之间只有色散力，并没有强吸引，所以「油怕水」的说法不准确，准确说法是「水不愿被油限制自由度」。答出①③各 3 分，②④各 2 分。'
      }]
    },
    {
      no: 7, points: 10, type: 'keywords',
      intro: '一分子葡萄糖完全氧化为 CO<sub>2</sub> 与 H<sub>2</sub>O。',
      parts: [{
        label: '第 7 题（简答）', points: 10, kind: 'keywords',
        prompt: '写出糖酵解、丙酮酸氧化、三羧酸循环各产生多少 ATP/GTP、NADH、FADH<sub>2</sub>，并据此算出总 ATP（用 NADH 2.5、FADH<sub>2</sub> 1.5 的系数）。要求写出每一步的乘法。',
        explain: '评分要点：①糖酵解净 2 ATP + 2 NADH；②丙酮酸氧化（×2）2 NADH + 2 CO<sub>2</sub>；③三羧酸循环（×2 圈）2 GTP + 6 NADH + 2 FADH<sub>2</sub> + 4 CO<sub>2</sub>；④合计 4 + 10 NADH + 2 FADH<sub>2</sub> + 6 CO<sub>2</sub>；⑤计算 10 × 2.5 = 25、2 × 1.5 = 3、加底物水平磷酸化 4，总 32（写 30–32 亦认可，旧系数 3/2 得 38 也可，但须注明系数）。分项数据 5 分，计算过程 5 分。'
      }]
    },
    {
      no: 8, points: 10, type: 'keywords',
      intro: '血红蛋白的氧解离曲线呈 S 形，肌红蛋白呈双曲线形。',
      parts: [{
        label: '第 8 题（简答）', points: 10, kind: 'keywords',
        prompt: '解释 S 形的分子基础（用 Hill 系数与亚基协同），并说明玻尔效应在组织供氧中的作用。',
        explain: '评分要点：①血红蛋白为 α<sub>2</sub>β<sub>2</sub> 四聚体，结合一个 O<sub>2</sub> 后构象由 T 态转向 R 态，其余亚基亲和力升高（正协同）；②Hill 系数 n<sub>H</sub> ≈ 2.8–3.0 &gt; 1，是协同的定量证据；③S 形让肺部高氧处迅速饱和、组织低氧处迅速卸氧，输送效率高于双曲线；④玻尔效应：组织产生 CO<sub>2</sub>、pH 下降，曲线右移，亲和力下降，促进卸氧；肺部相反。①②各 3 分，③④各 2 分。'
      }]
    },
    {
      no: 9, points: 8, type: 'choice',
      intro: '某酶的 K<sub>m</sub> = 5 mM，V<sub>max</sub> = 100 μmol·min<sup>−1</sup>。',
      parts: [{
        label: '第 9 题', points: 8, kind: 'choice',
        prompt: '当底物浓度为 5 mM 时，反应速率约为：',
        options: [
          { text: '50 μmol·min<sup>−1</sup>', correct: true },
          { text: '100 μmol·min<sup>−1</sup>', correct: false },
          { text: '25 μmol·min<sup>−1</sup>', correct: false },
          { text: '无法确定' }
        ],
        explain: '米氏方程 v = V<sub>max</sub>[S]/(K<sub>m</sub> + [S])。代入 [S] = K<sub>m</sub> = 5 mM，得 v = V<sub>max</sub>/2 = 50 μmol·min<sup>−1</sup>。这就是 K<sub>m</sub> 的操作定义：达到半最大速率所需的底物浓度。'
      }]
    },
    {
      no: 10, points: 8, type: 'fill',
      intro: '无氧条件下，骨骼肌细胞把葡萄糖转化为乳酸。',
      parts: [
        {
          label: '10(1)', points: 4, kind: 'fill',
          prompt: '每分子葡萄糖经乳酸发酵净产生的 ATP 数目是 ____ 个。',
          answer: '2',
          explain: '发酵本身不产生 ATP，2 个 ATP 全部来自糖酵解（投资 2、回收 4、净得 2）。发酵的唯一作用是把 NADH 氧化回 NAD<sup>+</sup>，让糖酵解能继续。'
        },
        {
          label: '10(2)', points: 4, kind: 'fill',
          prompt: '乳酸发酵中，被还原的底物是____（写中文或英文均可）。',
          answer: '丙酮酸',
          explain: '乳酸脱氢酶催化「丙酮酸 + NADH + H<sup>+</sup> → 乳酸 + NAD<sup>+</sup>」。被还原的是丙酮酸的羰基，被氧化的是 NADH。注意乳酸不是「废物」：它可运到肝脏经糖异生变回葡萄糖（Cori 循环），心肌与大脑也直接利用乳酸作燃料。'
        }
      ]
    },
    {
      no: 11, points: 7, type: 'keywords',
      intro: '两种来源的 DNA 样品，GC 含量分别为 30% 与 70%。',
      parts: [{
        label: '第 11 题（简答）', points: 7, kind: 'keywords',
        prompt: '按 T<sub>m</sub> ≈ 69.3 + 0.41 × GC% 估算两者的熔解温度，并解释为什么 GC 含量高更稳定。',
        explain: '评分要点：①30% → 69.3 + 12.3 = 81.6 ℃；70% → 69.3 + 28.7 = 98.0 ℃；②G≡C 有三条氢键，A=T 只有两条；③GC 相邻堆积的极化率更高、接触更紧密，堆积作用更强；④T<sub>m</sub> 是半数双链解开的温度，GC 含量每增加 1% 约升高 0.41 ℃。计算 3 分，机制 4 分。'
      }]
    },
    {
      no: 12, points: 7, type: 'tf',
      intro: '判断下列与代谢有关的说法。',
      parts: [
        {
          label: '12(1)', points: 4, kind: 'tf',
          prompt: '糖酵解发生在线粒体基质中，因此必须有氧才能进行。',
          options: [
            { text: '正确', correct: false },
            { text: '错误', correct: true }
          ],
          explain: '两处都错：糖酵解发生在细胞质；它本身不需要氧，只在 NAD<sup>+</sup> 耗尽时才需要发酵或呼吸链再生 NAD<sup>+</sup>。有氧时 NADH 交给呼吸链，无氧时交给丙酮酸（发酵）。'
        },
        {
          label: '12(2)', points: 3, kind: 'tf',
          prompt: '三羧酸循环每转一圈直接产生 2 个 ATP。',
          options: [
            { text: '正确', correct: false },
            { text: '错误', correct: true }
          ],
          explain: '每圈直接产生的是 1 个 GTP（相当于 1 个 ATP），另有 3 个 NADH、1 个 FADH<sub>2</sub>、2 个 CO<sub>2</sub>。一分子葡萄糖产生两分子乙酰辅酶 A，循环转两圈，所以「每分子葡萄糖 2 个 GTP」是对的，但「每圈 2 个」是错的。'
        }
      ]
    }
  ]
});
