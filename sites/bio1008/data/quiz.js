/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 每项字段：{ id, ch, kp, tier, type, difficulty, tags, stem, options:[{text,correct}], explain }
 * 每章 7 题：q1–q3 为正文内嵌题（chXX.js 里有对应 quiz 块），q4–q7 供复习与自测。
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ================= ch00 课程地图 ================= */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['framework'],
        stem: '本站把 BIO1008 的内容组织成三条主线，下列哪一项<b>不属于</b>这三条主线？',
        options: [
          { text: '结构：原子、键、分子形状与相互作用', correct: false },
          { text: '能量：ATP、代谢通路与热力学', correct: false },
          { text: '信息：DNA、RNA 与中心法则', correct: false },
          { text: '分类：按元素周期表给生物分子编号归档', correct: true }
        ],
        explain: '三条主线是结构、能量、信息。它们分别对应「分子长什么样」「能量怎么流动」「信息怎么传递与表达」。按周期表编号不是这门课的组织方式，生物分子只涉及约 20 多种元素中的少数几种。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'mcq', difficulty: 2, tags: ['framework'],
        stem: '从分子结构到生理功能，下面哪条链的<b>顺序</b>是正确的？',
        options: [
          { text: '分子形状 → 分子间作用 → 折叠与组装 → 功能 → 器官系统', correct: true },
          { text: '器官系统 → 功能 → 分子形状 → 分子间作用 → 折叠', correct: false },
          { text: '功能 → 分子形状 → 器官系统 → 折叠 → 分子间作用', correct: false },
          { text: '分子间作用 → 分子形状 → 器官系统 → 功能 → 折叠', correct: false }
        ],
        explain: '这门课反复使用同一条推理链：先看原子怎么成键决定形状，再看形状如何决定弱作用与折叠，折叠出的三维结构决定功能，功能叠加成器官系统的行为。倒着走只在复习时用，不能作为推导顺序。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'mcq', difficulty: 2, tags: ['calculation'],
        stem: '血液 pH = 7.40，对应的氢离子浓度最接近下列哪一个？',
        options: [
          { text: '4.0 × 10<sup>−8</sup> M，即 40 nM', correct: true },
          { text: '7.4 × 10<sup>−7</sup> M，即 740 nM', correct: false },
          { text: '1.0 × 10<sup>−7</sup> M，即 100 nM', correct: false },
          { text: '2.4 × 10<sup>−9</sup> M，即 2.4 nM', correct: false }
        ],
        explain: 'pH 是 −log[H<sup>+</sup>]，所以 [H<sup>+</sup>] = 10<sup>−7.40</sup> = 3.98 × 10<sup>−8</sup> M ≈ 40 nM。记住这个数量级很有用：血液中的氢离子只有纳摩尔级，却决定了整条代谢链能不能正常运行。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'tf', difficulty: 1, tags: ['framework'],
        stem: '判断：糖酵解发生在线粒体基质中，所以它必须有氧才能进行。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '两处都错。糖酵解发生在细胞质（胞质溶胶），不在线粒体基质；而且它本身不需要氧，只在 NAD<sup>+</sup> 被耗尽时才需要发酵或呼吸链来再生 NAD<sup>+</sup>。线粒体基质是三羧酸循环与丙酮酸氧化的场所。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些属于「弱作用力」（非共价相互作用）？',
        options: [
          { text: '氢键', correct: true },
          { text: '疏水作用', correct: true },
          { text: '范德华力', correct: true },
          { text: 'C–C 单键', correct: false }
        ],
        explain: '氢键、疏水作用、范德华力、离子键都属于非共价作用，能量在 0.05–40 kJ/mol 量级；C–C 单键是共价键，约 347 kJ/mol，比弱作用强一个数量级以上。生物体系靠大量弱作用的叠加实现「既稳定又可逆」的组装。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'fill', difficulty: 2, tags: ['concept'],
        stem: '血红蛋白的氧解离曲线在 pH 下降、CO<sub>2</sub> 升高时向右移动，这表示血红蛋白对氧的亲和力____（填「升高」或「下降」）。',
        answer: '下降',
        accept: ['下降', '降低', '减小', '变低'],
        explain: '曲线右移意味着在同样的氧分压下饱和度更低，也就是更难结合氧、更容易把氧交出去，亲和力下降。这就是玻尔效应：代谢活跃的组织产 CO<sub>2</sub>、pH 低，正好促使血红蛋白在那里卸氧。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-8', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '本课程的主要教材与讲义组合是下列哪一项？',
        options: [
          { text: 'Lehninger 生物化学原理 + Campbell 生理学教材 + 课程讲义 0–7 与 B1–B9', correct: true },
          { text: '只有课程讲义，教材仅作参考书不必翻阅', correct: false },
          { text: '有机化学教材 + 物理化学教材', correct: false },
          { text: '只靠课堂笔记，讲义 PDF 与教材都不需要', correct: false }
        ],
        explain: '课程资料库里既有 0–7 号基础讲义（化学部分）与 B1–B9 号生理讲义，也有 Lehninger《Principles of Biochemistry》与 Campbell 生理学教材两个 PDF。讲义给框架，教材补推导与细节，两者配合使用效率最高。'
      },

      /* ================= ch01 化学键与分子形状 ================= */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'mcq', difficulty: 2, tags: ['geometry'],
        stem: '甲烷（CH<sub>4</sub>）的 H–C–H 键角约为 109.5°，氨（NH<sub>3</sub>）约为 107.3°，水（H<sub>2</sub>O）约为 104.5°。造成这一递减顺序的主要原因是：',
        options: [
          { text: '中心原子上的孤对电子数目依次增多，孤对与成键电子对的排斥更强', correct: true },
          { text: '中心原子的原子半径依次增大', correct: false },
          { text: 'H–X 键的键长依次变短', correct: false },
          { text: '分子的总电子数依次减少', correct: false }
        ],
        explain: '按 VSEPR，四对电子呈四面体排布，理想角度 109.5°。孤对电子只受一个原子核吸引、电子云更「胖」，对成键电子对的排斥大于成键电子对之间的排斥，于是把键角压小：NH<sub>3</sub> 有一对孤对，压到 107.3°；H<sub>2</sub>O 有两对，压到 104.5°。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['bonding'],
        stem: 'C 与 O 的电负性分别约为 2.55 与 3.44。C–O 键最准确的描述是：',
        options: [
          { text: '极性共价键，电子偏向氧，氧带部分负电荷', correct: true },
          { text: '完全非极性的共价键，电子对均匀共享', correct: false },
          { text: '离子键，电子完全转移给氧', correct: false },
          { text: '金属键，电子在晶格中自由流动', correct: false }
        ],
        explain: '电负性差约 0.89，落在 0.4–1.7 的区间，属于极性共价键：电子对偏向电负性大的氧，形成部分负电荷（δ−）与部分正电荷（δ+）。差值小于 0.4 才近似非极性，大于 1.7 才接近离子键。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 3, tags: ['resonance'],
        stem: '肽键（C–N）的实测键长为 132 pm，介于 C–N 单键（147 pm）与 C=N 双键（127 pm）之间，且绕该键旋转的能垒约 80 kJ/mol。最合理的解释是：',
        options: [
          { text: '氮的孤对电子与羰基 π 体系共轭，使 C–N 键具有约 40% 的双键性质', correct: true },
          { text: '肽键其实是离子键，所以键长居中', correct: false },
          { text: '碳原子发生了 sp<sup>3</sup> 杂化，键长因此缩短', correct: false },
          { text: '测量误差导致键长介于两者之间', correct: false }
        ],
        explain: '酰胺氮的孤对电子可以离域到羰基 π* 轨道，形成共振结构，使 C–N 键带部分双键性质（约 40%）。双键性质带来平面性与高旋转能垒，这正是肽键平面（ω ≈ 180°）与蛋白质二级结构规整性的化学基础。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'tf', difficulty: 1, tags: ['bonding'],
        stem: '判断：同一对原子之间，双键的键长比单键短，键能比单键大。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: 'C–C 单键 154 pm / 347 kJ·mol<sup>−1</sup>，C=C 双键 134 pm / 611 kJ·mol<sup>−1</sup>。多一对共享电子，原子核被拉得更近、拆开需要更多能量。注意「双键键能小于单键的两倍」，因为第二对电子的结合不如第一对牢固。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-6', tier: 1, type: 'multi', difficulty: 2, tags: ['functional-group'],
        stem: '下列哪些官能团可以作为氢键<b>供体</b>（带 O–H 或 N–H）？',
        options: [
          { text: '羟基（—OH）', correct: true },
          { text: '氨基（—NH<sub>2</sub>）', correct: true },
          { text: '羧基（—COOH）', correct: true },
          { text: '甲基（—CH<sub>3</sub>）', correct: false }
        ],
        explain: '氢键供体必须有与电负性原子共价结合的氢。羟基、氨基、羧基的 O–H 与 N–H 都满足；甲基的氢连在碳上，C–H 几乎不极化，既不能供也不能受。这也是烃类不溶于水的原因。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'fill', difficulty: 2, tags: ['hybridization'],
        stem: '苯环中每个碳原子采取____杂化，六个 p 轨道侧面重叠形成离域 π 体系，因此六个 C–C 键长完全相等（139 pm）。',
        answer: 'sp2',
        accept: ['sp2', 'sp²', 'SP2', 'sp<sup>2</sup>'],
        explain: '苯的每个碳与两个碳、一个氢成 σ 键，共三个 σ 键需要三个 sp<sup>2</sup> 杂化轨道，平面三角形、键角 120°；剩下一个未杂化的 p 轨道垂直于环平面，六个 p 轨道重叠成离域 π 体系，键级平均为 1.5，所以键长介于单键与双键之间。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 1, type: 'mcq', difficulty: 3, tags: ['structure-function'],
        stem: '为什么改变一个氨基酸的侧链（如把缬氨酸换成谷氨酸）可能让整个酶失活？下列解释最完整的是：',
        options: [
          { text: '侧链改变会改变局部电荷与形状，进而改变折叠方式与活性位点的几何，底物无法正确结合', correct: true },
          { text: '因为氨基酸数量变了，蛋白质变短了', correct: false },
          { text: '因为新氨基酸一定有毒', correct: false },
          { text: '因为所有氨基酸侧链的化学性质都相同，换与不换没有区别', correct: false }
        ],
        explain: '蛋白功能取决于三维形状，形状由侧链之间的弱作用网络决定。把中性疏水的缬氨酸换成带负电的谷氨酸，会在疏水核心引入一个带电基团，破坏局部堆积并可能引起重排，活性位点的几何随之改变——镰状细胞血红蛋白（β6 Glu→Val）就是这类「一个残基改变整个功能」的经典案例。'
      },

      /* ================= ch02 分子间作用力与水 ================= */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['water'],
        stem: '冰的密度（0.917 g·cm<sup>−3</sup>）小于液态水（1.000 g·cm<sup>−3</sup>），因此冰能浮在水面上。根本原因是：',
        options: [
          { text: '结冰时每个水分子与四个邻居形成近乎完美的四面体氢键网络，产生大量空隙', correct: true },
          { text: '冰中的水分子运动更快，占据更大体积', correct: false },
          { text: '冰的分子量比水大', correct: false },
          { text: '冰中含有大量溶解气体', correct: false }
        ],
        explain: '液态水中氢键网络不断断裂重组，分子可以彼此靠得更近；结冰时氢键被「锁定」成六方四面体网络，每个分子固定与四个邻居相连，形成大量六元环空腔，体积反而膨胀约 9%。这一异常性质让湖泊从表面结冰、水下得以保温，是水生生物越冬的前提。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['hydrogen-bond'],
        stem: '水分子之间的氢键强度约为 20 kJ·mol<sup>−1</sup>，而 O–H 共价键约为 460 kJ·mol<sup>−1</sup>。这个数量级差异在生物学上的意义是：',
        options: [
          { text: '弱作用可以反复断裂与重建，使分子识别与构象变化可逆', correct: true },
          { text: '氢键太弱，对生物体系没有任何作用', correct: false },
          { text: '氢键比共价键更稳定，因此决定了蛋白的共价骨架', correct: false },
          { text: '两者能量相同，只是单位不同', correct: false }
        ],
        explain: '弱作用的「弱」正是它的功能优势：单个氢键在体温下容易断裂，但几十上百个叠加起来足以稳定一个三维结构；需要时又能局部解开，让酶催化、DNA 复制、膜融合得以可逆进行。共价键一旦断裂就是化学损伤，不能用于需要反复切换的过程。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'mcq', difficulty: 3, tags: ['hydrophobic'],
        stem: '把一滴油放进水里，油会聚成球状而不是散开。驱动这一过程的<b>主要</b>热力学原因是：',
        options: [
          { text: '非极性分子周围的水被迫形成有序笼状结构，聚集后释放这些有序水，体系熵增', correct: true },
          { text: '油分子之间形成强氢键，互相吸引', correct: false },
          { text: '油与水之间产生强静电排斥', correct: false },
          { text: '油的密度比水小，浮力使其成球', correct: false }
        ],
        explain: '疏水效应本质上是<b>熵驱动</b>的：非极性表面让周围水分子无法自由取向，形成有序的「笼」，熵降低；油滴聚并后总表面积减小，被束缚的水被释放回自由状态，体系总熵增大。所以严格说不是「油怕水」，而是「水不愿被油限制自由度」。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'tf', difficulty: 2, tags: ['osmosis'],
        stem: '判断：0.9% NaCl 溶液与血浆等渗，因此把红细胞放进去不会发生明显的溶血或皱缩。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '0.9% NaCl 约 154 mM，按 i ≈ 1.8 计算渗透浓度约 290 mOsm·L<sup>−1</sup>，与血浆（约 285–295）等渗。等渗时膜两侧水势相同，净水通量为零，红细胞保持正常双凹形态。浓度过低会溶血，过高会皱缩。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'multi', difficulty: 2, tags: ['colligative'],
        stem: '下列哪些性质属于稀溶液的依数性（只取决于粒子数目，与粒子种类无关）？',
        options: [
          { text: '沸点升高', correct: true },
          { text: '凝固点降低', correct: true },
          { text: '渗透压', correct: true },
          { text: '溶液的颜色', correct: false }
        ],
        explain: '依数性只看溶质粒子的数量：沸点升高、凝固点降低、蒸汽压下降、渗透压都是。颜色取决于分子的电子结构与共轭体系，与粒子数无关。临床上用凝固点降低法测渗透浓度，正是因为它是依数性。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'fill', difficulty: 2, tags: ['imf'],
        stem: '四种分子间作用力按强度从大到小排序：离子–偶极（40–600）&gt; 氢键（10–40）&gt; 偶极–偶极（5–25）&gt; ____（0.05–40 kJ·mol<sup>−1</sup>）。',
        answer: '色散力',
        accept: ['色散力', '伦敦色散力', '范德华力', '伦敦力'],
        explain: '色散力（伦敦色散力）来自瞬时偶极的相互诱导，存在于所有分子之间，强度随极化率与接触面积增大。它是唯一的「普适」作用力——惰性气体能液化就是靠它。四个弱作用叠加起来才足以稳定蛋白与膜。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-6', tier: 1, type: 'mcq', difficulty: 3, tags: ['amphiphile'],
        stem: '把 SDS（十二烷基硫酸钠）加入水中，当其浓度超过临界胶束浓度（约 8 mM）时，分子会自发聚集形成胶束。驱动这一自组装的主要作用力是：',
        options: [
          { text: '疏水效应：烷基链避开水、趋向内部，极性头基朝向水', correct: true },
          { text: '烷基链之间形成氢键', correct: false },
          { text: '硫酸根头基之间形成共价交联', correct: false },
          { text: '静电吸引把所有分子拉成一个整体', correct: false }
        ],
        explain: 'SDS 是两亲分子：十二碳烷基链疏水、硫酸根头基带负电亲水。超过 CMC 后，疏水尾部聚集在内部以减少与水接触的面积（熵驱动的疏水效应），头基朝外与水形成氢键并靠静电排斥限制胶束生长。这一原理与生物膜中磷脂双分子层的形成完全相同。'
      },

      /* ================= ch03 酸碱平衡与缓冲 ================= */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 2, tags: ['ph'],
        stem: '25 ℃ 时纯水的离子积 Kw = 1.0 × 10<sup>−14</sup>，而 37 ℃ 时 Kw ≈ 2.4 × 10<sup>−14</sup>。由此推断 37 ℃ 时纯水的 pH 约为：',
        options: [
          { text: '6.81', correct: true },
          { text: '7.00', correct: false },
          { text: '7.40', correct: false },
          { text: '7.19', correct: false }
        ],
        explain: '[H<sup>+</sup>] = √Kw = √(2.4 × 10<sup>−14</sup>) = 1.55 × 10<sup>−7</sup> M，pH = −log(1.55 × 10<sup>−7</sup>) ≈ 6.81。中性指 [H<sup>+</sup>] = [OH<sup>−</sup>]，不是 pH = 7.00——7.00 只在 25 ℃ 成立。体温下中性 pH 是 6.81，血液 7.40 仍属碱性。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['buffer'],
        stem: '要在 pH 7.4 附近获得最好的缓冲能力，应选择 pKa 为多少的缓冲体系？',
        options: [
          { text: '7.4 附近（如 HEPES，pKa 7.48）', correct: true },
          { text: '4.8 附近（如乙酸，pKa 4.76）', correct: false },
          { text: '9.3 附近（如铵，pKa 9.25）', correct: false },
          { text: '任意 pKa 都可以，缓冲能力相同', correct: false }
        ],
        explain: '缓冲能力在 pH = pKa 时最大，有效范围约为 pKa ± 1。pH 7.4 时，乙酸的共轭碱几乎全部质子化、铵几乎全部去质子化，两者都处于「一侧耗尽」的状态，缓冲能力很弱。所以细胞实验选 HEPES（pKa 7.48）、磷酸盐（6.86）或碳酸（表观 6.1，靠肺调 pCO<sub>2</sub> 补足）。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-6', tier: 1, type: 'mcq', difficulty: 3, tags: ['buffer'],
        stem: '血液中 [HCO<sub>3</sub><sup>−</sup>] = 24 mM、溶解 CO<sub>2</sub> = 1.2 mM，碳酸的表观 pKa 取 6.1。按 Henderson–Hasselbalch 计算，血液 pH 约为：',
        options: [
          { text: '7.40', correct: true },
          { text: '6.70', correct: false },
          { text: '7.10', correct: false },
          { text: '7.70', correct: false }
        ],
        explain: 'pH = 6.1 + log(24/1.2) = 6.1 + log 20 = 6.1 + 1.30 = 7.40。这个 20:1 的比例是血液 pH 的核心数字：HCO<sub>3</sub><sup>−</sup> 由肾调节（慢，小时到天），CO<sub>2</sub> 由肺调节（快，秒到分），两个器官共同把比例锁在 20。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'tf', difficulty: 2, tags: ['titration'],
        stem: '判断：用强碱滴定弱酸时，半当量点处的 pH 等于该弱酸的 pKa，此时缓冲能力最强。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '半当量点时 [HA] = [A<sup>−</sup>]，代入 Henderson–Hasselbalch 得 pH = pKa。此时溶液对加入的酸或碱抵抗能力最大（滴定曲线最平缓），是缓冲体系的「最佳工作点」。当量点附近 pH 急剧变化，缓冲能力最弱。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-7', tier: 1, type: 'multi', difficulty: 2, tags: ['buffer'],
        stem: '人体维持血液 pH 稳定的机制包括下列哪些？',
        options: [
          { text: '碳酸–碳酸氢盐缓冲体系', correct: true },
          { text: '磷酸盐缓冲体系（细胞内与尿液中为主）', correct: true },
          { text: '血红蛋白与血浆蛋白的缓冲作用', correct: true },
          { text: '骨骼中的钙盐溶解中和 H<sup>+</sup>', correct: false }
        ],
        explain: '血液的第一道防线是碳酸–碳酸氢盐（占缓冲能力约 64%），其次是血红蛋白（约 29%）、血浆蛋白（约 6%）与磷酸盐（约 1%）。骨骼的钙磷代谢参与长期酸碱平衡，但不是「溶解中和」式的即时缓冲，把它列为即时缓冲机制是错的。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'fill', difficulty: 3, tags: ['calculation'],
        stem: '某弱酸的 pKa = 4.76。当溶液中 [A<sup>−</sup>]/[HA] = 10 时，pH = ____（保留两位小数）。',
        answer: '5.76',
        accept: ['5.76', '5.8'],
        explain: 'pH = pKa + log([A<sup>−</sup>]/[HA]) = 4.76 + log 10 = 4.76 + 1.00 = 5.76。每让碱/酸比例变化 10 倍，pH 就移动 1 个单位——这个「一个数量级 = 一个 pH 单位」的直觉在做缓冲题时非常省时间。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-6', tier: 1, type: 'mcq', difficulty: 3, tags: ['pi'],
        stem: '甘氨酸的 pKa<sub>1</sub>（羧基）= 2.34，pKa<sub>2</sub>（氨基）= 9.60。它的等电点 pI 约为：',
        options: [
          { text: '5.97', correct: true },
          { text: '2.34', correct: false },
          { text: '9.60', correct: false },
          { text: '7.00', correct: false }
        ],
        explain: '中性氨基酸的 pI = (pKa<sub>1</sub> + pKa<sub>2</sub>)/2 = (2.34 + 9.60)/2 = 5.97。在 pI 处分子净电荷为零，溶解度最低，电泳时不移动。酸性氨基酸（如 Asp，pI 2.77）取两个羧基的 pKa 平均，碱性氨基酸（如 Lys，pI 9.74）取两个氨基的 pKa 平均。'
      },

      /* ================= ch04 有机化学与生物分子 ================= */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'mcq', difficulty: 2, tags: ['atp'],
        stem: 'ATP 水解的标准自由能变化 ΔG°′ 约为 −30.5 kJ·mol<sup>−1</sup>。这个「高能」的本质来源是：',
        options: [
          { text: '产物（ADP 与 Pi）的电荷排斥与共振稳定程度高于 ATP，且水化更充分', correct: true },
          { text: 'ATP 分子内存在一个真实的「高能键」特殊化学键', correct: false },
          { text: '水解反应释放了 ATP 分子中储存的光能', correct: false },
          { text: 'ATP 水解是吸能反应，需要输入能量', correct: false }
        ],
        explain: '「高能磷酸键」是历史俗称，并不存在特殊的键型。真正的原因是热力学：ATP 的三个磷酸基团紧密相邻、负电荷互相排斥；水解后 ADP 与 Pi 分开、电荷分散，且 Pi 的共振杂化更稳定、水化能更大。产物更稳定，所以 ΔG 为负。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['stereochemistry'],
        stem: '天然蛋白质中的氨基酸几乎全部是 L 型。这个「手性偏好」的直接后果是：',
        options: [
          { text: '由 L 型氨基酸组成的螺旋具有确定的右手旋向，折叠结果可预测且可重复', correct: true },
          { text: 'L 型与 D 型氨基酸可以随意混用，不影响结构', correct: false },
          { text: '手性只影响味道，不影响三维结构', correct: false },
          { text: '所有氨基酸都没有手性，因此没有偏好', correct: false }
        ],
        explain: '除甘氨酸外，每个氨基酸的 α 碳连有四个不同基团，是手性中心。L 与 D 是一对镜像，物理化学性质几乎相同，但组装成肽链后侧链指向不同方向：L 型才能形成稳定的右手 α-螺旋。混入 D 型会在螺旋中产生「别扭」的接触，破坏规整性。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['reaction'],
        stem: '两个氨基酸脱水缩合成二肽，这个反应的类型与产物是：',
        options: [
          { text: '缩合反应，生成一个肽键并释放一分子水', correct: true },
          { text: '水解反应，消耗一分子水并断开肽键', correct: false },
          { text: '氧化还原反应，转移电子并生成 NADH', correct: false },
          { text: '取代反应，用羟基替换氨基', correct: false }
        ],
        explain: '缩合（condensation）是「两个分子连起来并脱去一个小分子」的通称，蛋白合成中脱去的是水，糖苷键与磷酸二酯键的形成同样是缩合。反过来加水拆开就是水解。这个「缩合–水解」的对偶贯穿整门课：合成靠缩合耗能，消化靠水解回收。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'tf', difficulty: 2, tags: ['thermodynamics'],
        stem: '判断：酶作为催化剂能降低反应的活化能，因此会改变反应的 ΔG 与平衡常数。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '酶只降低活化能、加快达到平衡的速率，<b>不改变</b>反应的 ΔG，也不改变平衡常数——因为 ΔG 只由反应物与产物的本性及浓度决定。酶能让一个热力学上有利但极慢的反应在毫秒内完成，也能把两个反应耦合起来推动吸能反应，但它不能把 ΔG &gt; 0 的反应变成自发。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'multi', difficulty: 2, tags: ['functional-group'],
        stem: '下列哪些是生物分子中常见的官能团？',
        options: [
          { text: '羟基 —OH', correct: true },
          { text: '羧基 —COOH', correct: true },
          { text: '巯基 —SH', correct: true },
          { text: '硝基 —NO<sub>2</sub>', correct: false }
        ],
        explain: '羟基（糖、醇）、羧基（脂肪酸、氨基酸）、巯基（半胱氨酸，可形成二硫键）、氨基、磷酸基、羰基都是生物分子中的常见官能团。硝基在生物体系中极少出现，主要存在于合成化合物中（如硝基苯、某些药物）。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'fill', difficulty: 3, tags: ['calculation'],
        stem: '葡萄糖完全氧化释放约 2870 kJ·mol<sup>−1</sup>，若实际捕获 32 mol ATP（每个按 30.5 kJ·mol<sup>−1</sup> 计），则能量转换效率约为 ____%（取整数）。',
        answer: '34',
        accept: ['34', '34%', '约34'],
        explain: '32 × 30.5 = 976 kJ，976 / 2870 ≈ 0.34，即约 34%。其余 66% 以热的形式释放，用于维持体温。这个效率高于普通汽油发动机（约 25%），是氧化磷酸化「分步释放」设计的成果。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'mcq', difficulty: 3, tags: ['coupling'],
        stem: '葡萄糖-6-磷酸的合成（G6P + H<sub>2</sub>O → 葡萄糖 + Pi）ΔG°′ = −13.8 kJ·mol<sup>−1</sup>，逆反应（磷酸化）为 +13.8。己糖激酶如何让磷酸化自发进行？',
        options: [
          { text: '把磷酸化与 ATP 水解（−30.5）耦合，总 ΔG°′ ≈ −16.7 kJ·mol<sup>−1</sup>', correct: true },
          { text: '提高温度使 ΔG 变负', correct: false },
          { text: '加入催化剂，使 ΔG 从正变负', correct: false },
          { text: '移除产物水，使反应逆转', correct: false }
        ],
        explain: '己糖激酶催化的是 ATP 的 γ-磷酸直接转移到葡萄糖上，不是「先水解 ATP 再磷酸化」。但从热力学看，可以把它理解成两个过程的耦合：磷酸化 +13.8 加 ATP 水解 −30.5，净 −16.7，因此整体自发。这是生物体推动吸能反应的通用策略——耦合一个更负的反应。'
      },

      /* ================= ch05 蛋白质 ================= */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['secondary-structure'],
        stem: 'α-螺旋每圈包含约 3.6 个氨基酸残基，螺距 0.54 nm。由此推算每个残基沿螺旋轴上升的距离约为：',
        options: [
          { text: '0.15 nm', correct: true },
          { text: '0.34 nm', correct: false },
          { text: '0.54 nm', correct: false },
          { text: '0.20 nm', correct: false }
        ],
        explain: '0.54 ÷ 3.6 = 0.15 nm/残基。0.34 nm 是 β-折叠中每个残基沿链延伸的距离，两者容易混：α-螺旋「矮胖」，β-折叠「细长」。这两个数字在做结构题时经常需要互相换算。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'mcq', difficulty: 2, tags: ['denaturation'],
        stem: '把鸡蛋煮熟，蛋白从透明变白、从流动变固态，且无法逆转。这一过程发生的变化是：',
        options: [
          { text: '氢键等弱作用被破坏导致变性，肽键未断裂，但聚集后难以复性', correct: true },
          { text: '肽键被水解，蛋白质被切成小肽', correct: false },
          { text: '氨基酸序列发生改变，变成另一种蛋白', correct: false },
          { text: '蛋白质被氧化成二氧化碳和水', correct: false }
        ],
        explain: '加热破坏弱作用网络，蛋白去折叠（变性），疏水残基暴露后互相聚集、形成不可溶的凝胶。肽键与一级结构完好——所以煮熟的蛋白仍能被消化酶水解成氨基酸，营养价值不变。变性不等于降解，也不等于序列改变。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-7', tier: 1, type: 'mcq', difficulty: 3, tags: ['enzyme'],
        stem: '某酶的 K<sub>m</sub> = 5 mM。当底物浓度为 5 mM 时，反应速率约为最大速率 V<sub>max</sub> 的：',
        options: [
          { text: '50%', correct: true },
          { text: '100%', correct: false },
          { text: '25%', correct: false },
          { text: '无法判断' }
        ],
        explain: '按米氏方程 v = V<sub>max</sub>[S]/(K<sub>m</sub> + [S])，当 [S] = K<sub>m</sub> 时 v = V<sub>max</sub>/2。这就是 K<sub>m</sub> 的操作定义：达到半最大速率所需的底物浓度。K<sub>m</sub> 越小表示酶对底物亲和力越高（在 k<sub>cat</sub> 相近的前提下）。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-7', tier: 1, type: 'tf', difficulty: 3, tags: ['inhibition'],
        stem: '判断：竞争性抑制剂会降低表观 V<sub>max</sub>，但不改变 K<sub>m</sub>。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '说反了。竞争性抑制剂与底物争抢活性位点，加大底物浓度可以把它「挤掉」，所以 V<sub>max</sub> 不变、表观 K<sub>m</sub> 增大；非竞争性抑制剂结合在别处、降低有效酶量，V<sub>max</sub> 下降而 K<sub>m</sub> 不变；反竞争性抑制剂两者都下降。这四种模式在双倒数图上表现为不同方向的直线。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'multi', difficulty: 2, tags: ['tertiary-structure'],
        stem: '下列哪些作用力参与维持蛋白质的三级结构？',
        options: [
          { text: '疏水作用', correct: true },
          { text: '氢键', correct: true },
          { text: '二硫键', correct: true },
          { text: '肽键', correct: false }
        ],
        explain: '三级结构是靠侧链之间的相互作用维持的：疏水核心（主要驱动力）、氢键、离子键（盐桥）、范德华力，以及半胱氨酸之间形成的共价二硫键。肽键是连接氨基酸的一级结构化学键，它决定序列，不属于「维持三维折叠」的范畴。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'fill', difficulty: 3, tags: ['allostery'],
        stem: '血红蛋白的 Hill 系数 n<sub>H</sub> 约为 2.8–3.0，明显大于 1，这说明四个亚基之间存在____效应（填「协同」或「拮抗」）。',
        answer: '协同',
        accept: ['协同', '正协同', 'cooperativity', '正协同效应'],
        explain: 'n<sub>H</sub> &gt; 1 表示结合一个氧分子会增加其余亚基对氧的亲和力，即正协同效应。它让氧解离曲线呈 S 形：肺部高氧处迅速饱和，组织低氧处迅速卸氧，输送效率远高于双曲线形的肌红蛋白。这也是「四级结构带来新功能」的经典例证。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'mcq', difficulty: 2, tags: ['mutation'],
        stem: '镰状细胞贫血的血红蛋白 β 链第 6 位由谷氨酸（带负电、亲水）变为缬氨酸（疏水）。这一改变最直接的后果是：',
        options: [
          { text: 'β 链表面出现疏水补丁，脱氧状态下与相邻分子黏附，聚合成纤维', correct: true },
          { text: '血红蛋白无法结合铁，完全失去运氧能力', correct: false },
          { text: '血红素环被降解，红细胞变圆', correct: false },
          { text: '肽键断裂，蛋白被切成碎片', correct: false }
        ],
        explain: '谷氨酸在表面、带负电、亲水；换成缬氨酸后表面出现疏水斑块。脱氧构象下这个斑块正好嵌入相邻血红蛋白的疏水口袋，分子首尾相连聚成纤维，红细胞被撑成镰刀状。运氧能力其实还在（纯合子仍能存活到成年），问题出在细胞形态与血管阻塞。'
      },

      /* ================= ch06 糖与核酸 ================= */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'mcq', difficulty: 2, tags: ['dna'],
        stem: 'B 型 DNA 每圈螺旋包含 10 个碱基对、螺距 3.4 nm。相邻两个碱基对之间的垂直距离是：',
        options: [
          { text: '0.34 nm', correct: true },
          { text: '0.15 nm', correct: false },
          { text: '2.0 nm', correct: false },
          { text: '3.4 nm', correct: false }
        ],
        explain: '3.4 ÷ 10 = 0.34 nm。这个数字很实用：一段 1000 bp 的基因长约 340 nm；人类基因组 3 × 10<sup>9</sup> bp 拉直约 1 米（两条链合计约 2 米），却能装进直径 6 μm 的细胞核，靠的是组蛋白缠绕与超螺旋。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['glycosidic'],
        stem: '两个葡萄糖分子通过 α-1,4-糖苷键连接成麦芽糖。这个键的形成属于：',
        options: [
          { text: '缩合反应，脱去一分子水', correct: true },
          { text: '水解反应，消耗一分子水', correct: false },
          { text: '氧化反应，转移两个电子', correct: false },
          { text: '加成反应，加上一个氢分子', correct: false }
        ],
        explain: '糖苷键由两个单糖的羟基缩合脱水形成，与肽键、磷酸二酯键同属「缩合建键」家族。注意 α 与 β 的区别在于异头碳上羟基的朝向：α 键（如糖原、淀粉）可被人体淀粉酶水解，β 键（如纤维素）不能——人体没有 β-葡萄糖苷酶，所以纤维素只能当膳食纤维。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'mcq', difficulty: 3, tags: ['dna'],
        stem: 'DNA 的熔解温度 T<sub>m</sub> 与 GC 含量正相关（经验式 T<sub>m</sub> ≈ 69.3 + 0.41 × GC%）。原因是：',
        options: [
          { text: 'G≡C 有三条氢键、C–G 堆积也更紧密，拆开需要更多能量', correct: true },
          { text: 'GC 碱基对分子量更大，所以更重、更难熔', correct: false },
          { text: 'GC 含量高的 DNA 更长', correct: false },
          { text: 'GC 碱基对带正电，与磷酸骨架吸引更强', correct: false }
        ],
        explain: 'A=T 只有两条氢键，G≡C 有三条；此外 GC 相邻堆积的极化率更高、碱基间范德华接触更紧密。两者共同提高双链稳定性，所以 GC 含量每增加 1%，T<sub>m</sub> 约升高 0.41 ℃。这也是 PCR 设计引物要看 GC 含量的原因。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-6', tier: 1, type: 'tf', difficulty: 1, tags: ['rna'],
        stem: '判断：细胞内的 RNA 通常是单链分子，但可以局部折叠形成双链区域与复杂三维结构。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: 'RNA 以单链形式转录与存在，但同一分子内部的互补区段可以回折配对，形成发夹、茎环、假结等二级结构，再进一步折叠成三级结构。tRNA 的三叶草形与核糖体 RNA 的催化中心都依赖这种折叠——「单链」不等于「没有结构」。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'multi', difficulty: 2, tags: ['nucleotide'],
        stem: '一个核苷酸由哪几部分组成？',
        options: [
          { text: '含氮碱基', correct: true },
          { text: '五碳糖（核糖或脱氧核糖）', correct: true },
          { text: '一个或多个磷酸基团', correct: true },
          { text: '一个脂肪酸尾巴', correct: false }
        ],
        explain: '核苷酸 = 碱基 + 五碳糖 + 磷酸。碱基与糖合称核苷，加上磷酸才是核苷酸。DNA 的糖是脱氧核糖（2′ 位无羟基），RNA 是核糖；这个 2′-OH 的差别让 RNA 更容易水解、也更活泼，是「RNA 做临时信使、DNA 做长期存档」的化学基础之一。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-7', tier: 1, type: 'fill', difficulty: 2, tags: ['central-dogma'],
        stem: '遗传信息从 DNA 传到 RNA 的过程称为____，从 RNA 合成蛋白质的过程称为翻译。',
        answer: '转录',
        accept: ['转录', 'transcription'],
        explain: '中心法则：DNA →（复制）→ DNA，DNA →（转录）→ RNA，RNA →（翻译）→ 蛋白。转录由 RNA 聚合酶完成，以 DNA 的一条链为模板；翻译在核糖体上进行，由 tRNA 搬运氨基酸。逆转录（RNA → DNA）是中心法则的补充，存在于逆转录病毒与端粒酶中。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'mcq', difficulty: 3, tags: ['polysaccharide'],
        stem: '糖原与纤维素都由葡萄糖组成，但人体能消化糖原而不能消化纤维素。根本原因是：',
        options: [
          { text: '两者糖苷键的构型不同（α 与 β），人体只有 α-葡萄糖苷酶', correct: true },
          { text: '纤维素的葡萄糖分子量更大', correct: false },
          { text: '糖原含有氮元素，纤维素不含', correct: false },
          { text: '纤维素不溶于水，所以不能被酶接触', correct: false }
        ],
        explain: '糖原是 α-1,4（带 α-1,6 分支）连接，纤维素是 β-1,4 连接。酶的活性位点对底物构型高度专一，人类的淀粉酶与糖原磷酸化酶只能识别 α 键。β 键需要纤维素酶，而人体不产生——所以纤维素穿过消化道成为膳食纤维，反而促进肠道蠕动。'
      },

      /* ================= ch07 代谢与人体系统 ================= */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['glycolysis'],
        stem: '一分子葡萄糖经糖酵解净产生的 ATP 与 NADH 分别是：',
        options: [
          { text: '2 个 ATP、2 个 NADH', correct: true },
          { text: '4 个 ATP、2 个 NADH', correct: false },
          { text: '2 个 ATP、4 个 NADH', correct: false },
          { text: '32 个 ATP、10 个 NADH', correct: false }
        ],
        explain: '投资阶段花 2 个 ATP，回收阶段产生 4 个 ATP，净得 2 个；GAPDH 一步产生 2 个 NADH（因为一分子的糖裂成两分子三碳糖，后续反应各走一遍）。32 ATP 与 10 NADH 是「完全氧化」的总账，不是糖酵解一项。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'mcq', difficulty: 3, tags: ['etc'],
        stem: '氰化物中毒在几分钟内致死，其分子机制是：',
        options: [
          { text: '与复合体 IV 结合，阻断电子传给氧，质子梯度崩溃，ATP 迅速耗尽', correct: true },
          { text: '与血红蛋白结合，使红细胞无法运氧', correct: false },
          { text: '直接水解 ATP，使细胞立刻失去能量', correct: false },
          { text: '抑制糖酵解，使葡萄糖无法分解', correct: false }
        ],
        explain: 'CN<sup>−</sup> 与细胞色素 c 氧化酶（复合体 IV）的血红素 a<sub>3</sub> 高亲和结合，电子无法交给 O<sub>2</sub>，整条链停转，质子梯度消失，ATP 合酶甚至反向水解 ATP 试图维持梯度。此时血液中氧分压正常、静脉血呈鲜红色，但细胞无法利用氧——这是「组织中毒性缺氧」。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'mcq', difficulty: 3, tags: ['atp-yield'],
        stem: '按现代 P/O 比（NADH 2.5、FADH<sub>2</sub> 1.5），一分子葡萄糖完全氧化约产生多少 ATP？',
        options: [
          { text: '30–32 个', correct: true },
          { text: '36–38 个', correct: false },
          { text: '2 个', correct: false },
          { text: '100 个以上', correct: false }
        ],
        explain: '底物水平磷酸化 4 个（糖酵解 2 + 三羧酸循环 2），10 个 NADH × 2.5 = 25，2 个 FADH<sub>2</sub> × 1.5 = 3，合计 32。旧教材按 3 与 2 算得 38 个，差异来自质子漏与转运成本。答题时写「约 30–32」最稳，若题目指定系数就按题目算。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'tf', difficulty: 2, tags: ['fermentation'],
        stem: '判断：乳酸发酵能额外产生 ATP，所以剧烈运动时肌肉的 ATP 产量比安静时更高。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '发酵本身<b>不产生</b>任何 ATP，它的唯一作用是把 NADH 重新氧化成 NAD<sup>+</sup>，让糖酵解能继续跑。运动时 ATP 消耗变快，糖酵解通量提高，所以单位时间产 ATP 变多——但这全部来自糖酵解那 2 个，与发酵无关。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-6', tier: 1, type: 'multi', difficulty: 3, tags: ['gluconeogenesis'],
        stem: '下列哪些酶是糖异生特有的（不在糖酵解中出现）？',
        options: [
          { text: '丙酮酸羧化酶', correct: true },
          { text: '果糖-1,6-二磷酸酶', correct: true },
          { text: '葡萄糖-6-磷酸酶', correct: true },
          { text: '磷酸果糖激酶-1', correct: false }
        ],
        explain: '糖酵解有三个不可逆步骤（己糖激酶、PFK-1、丙酮酸激酶），糖异生必须绕过它们，用的是四个不同的酶：丙酮酸羧化酶、PEP 羧激酶、果糖-1,6-二磷酸酶、葡萄糖-6-磷酸酶。PFK-1 是糖酵解的限速酶，与糖异生方向相反，两者受激素互斥调节。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 1, type: 'fill', difficulty: 2, tags: ['blood-glucose'],
        stem: '健康成人空腹血糖的参考范围约为 4.0–____ mM。',
        answer: '6.1',
        accept: ['6.1', '6.0', '6', '6.1mM'],
        explain: '空腹血糖 4.0–6.1 mM（70–110 mg/dL）。低于 3.9 为低血糖，高于 7.0（空腹两次）提示糖尿病。这个窄区间靠胰岛素与胰高血糖素的双向调节维持：餐后胰岛素把血糖压回 7.8 以下，空腹时胰高血糖素把它拉回 4 以上。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-7', tier: 1, type: 'mcq', difficulty: 3, tags: ['physiology'],
        stem: '人从安静状态进入剧烈运动，心输出量可从约 5 L·min<sup>−1</sup> 升到 20–25 L·min<sup>−1</sup>。这一变化主要通过什么实现？',
        options: [
          { text: '心率显著升高，加上每搏输出量增加（交感神经兴奋、肾上腺素）', correct: true },
          { text: '仅靠血液黏度下降', correct: false },
          { text: '仅靠呼吸频率升高，与心脏无关', correct: false },
          { text: '靠血管总长度增加' }
        ],
        explain: '心输出量 = 心率 × 每搏输出量。运动时交感神经与肾上腺素使心率从约 70 升到 180 次/分以上，同时心肌收缩力增强、静脉回流增加使每搏输出量从 70 mL 升到 120–150 mL，两者相乘即达 20–25 L/分。呼吸系统同时把分钟通气量从 6 L 提高到 100 L 以上，两者配合才能满足肌肉的氧需求。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
