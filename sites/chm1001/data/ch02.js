/* =====================================================================
 * ch02.js · 第 2 章「原子、分子与离子：从微观粒子到化学式」
 * 职责：把物质的微观组成讲清——亚原子粒子、同位素、离子、化学式与摩尔质量。
 * 依据：Chemistry: The Central Science 15th Ed. 第 2 章 Atoms, Molecules, and Ions。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch02',
  num: '02',
  title: '原子、分子与离子：从微观粒子到化学式',
  en: 'ATOMS, MOLECULES & IONS',
  goals: [
    '写出任意原子的质子数、中子数与电子数，并解释同位素与平均原子质量的关系',
    '由元素在周期表的位置预测常见离子的电荷',
    '用电荷平衡写出离子化合物的化学式，并按 IUPAC 规则命名',
    '区分经验式与分子式，由质量百分比推出经验式',
    '计算摩尔质量与元素质量分数，并在计算中正确使用下标'
  ],
  kp: [
    { id: 'ch02-1', title: '亚原子粒子与原子的组成' },
    { id: 'ch02-2', title: '同位素与平均原子质量' },
    { id: 'ch02-3', title: '周期表分区与离子电荷' },
    { id: 'ch02-4', title: '化学式：经验式与分子式' },
    { id: 'ch02-5', title: '离子化合物的命名' },
    { id: 'ch02-6', title: '摩尔质量与质量百分比' },
    { id: 'ch02-7', title: '电解质与水合离子' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么先认识粒子', html: '化学式不是缩写游戏。<code>NaCl</code> 里的 1 : 1 不是随便写的，它来自 <code>Na<sup>+</sup></code> 与 <code>Cl<sup>−</sup></code> 的电荷必须抵消；<code>Al<sub>2</sub>O<sub>3</sub></code> 里的 2 和 3 也不是背出来的，而是 <code>Al<sup>3+</sup></code> 与 <code>O<sup>2−</sup></code> 找最小公倍数 6 的结果。看懂这一层，你就能写出没见过的化合物的式子，而不是靠记忆。这一章把「原子由什么组成」和「式子怎么写」连成一条线。' },

    { t: 'p', lead: true, html: '第 1 章讲了怎么量，这一章讲量的是什么。我们从亚原子粒子出发，经过同位素与平均原子质量，到离子、化学式、命名，最后落到摩尔质量与质量百分比——它是第 3 章化学计量的直接前传。学完本章，你看到任何一个化学式，都应该能说出：它由哪些粒子构成、电荷怎么平衡、一摩尔有多重、各元素占多少比例。' },

    { t: 'h', lvl: 2, text: '一、亚原子粒子与原子的组成', id: 'ch02-1' },

    { t: 'p', html: '原子由三种亚原子粒子构成：<b>质子（proton）</b>带 +1 电荷、位于原子核，<b>中子（neutron）</b>不带电、也在核内，<b>电子（electron）</b>带 −1 电荷、在核外运动。质子的数目叫<b>原子序数（atomic number, Z）</b>，它决定元素身份：Z = 1 是氢，Z = 6 是碳，Z = 26 是铁。中性原子里电子数等于质子数，所以原子整体不带电。' },

    { t: 'p', html: '质子数加中子数叫<b>质量数（mass number, A）</b>。写核素符号时把 A 写在左上角、Z 写在左下角，例如 <code><sup>23</sup><sub>11</sub>Na</code> 表示 11 个质子、12 个中子、11 个电子。注意质量数不是相对原子质量：前者是整数计数，后者是考虑了同位素丰度的加权平均值。把两者混用，是本章最常见的概念错误。' },

    { t: 'table', head: ['粒子', '符号', '相对电荷', '相对质量', '位置'], rows: [
      ['质子', 'p', '+1', '1.0073 u', '原子核内'],
      ['中子', 'n', '0', '1.0087 u', '原子核内'],
      ['电子', 'e<sup>−</sup>', '−1', '0.00055 u（可忽略）', '核外电子云']
    ], caption: '电子的质量约为质子的 1/1836，所以原子的质量几乎全部集中在核内' },

    { t: 'p', html: '原子核极小：若把原子放大到足球场大小，核只有场中央一颗豌豆那么大。但核内质子都带正电，彼此强烈排斥，靠<b>强核力（strong nuclear force）</b>才能束缚在一起。中子不参与电荷排斥，却能提供额外的强核力，所以重核需要更多中子才稳定；中子数太少或太多，核都会不稳定而衰变。' },

    { t: 'p', html: '电子在核外的排布决定了化学性质，这一点在第 6 章展开。现在只需建立两个直觉：第一，电子占据的空间远大于核，原子的「大小」几乎就是电子云的范围；第二，化学反应只涉及最外层电子，核本身不变——所以化学反应不能把一种元素变成另一种元素，那是核反应的事。' },

    { t: 'p', html: '原子质量用<b>原子质量单位（atomic mass unit, u）</b>度量，定义为碳-12 原子质量的 1/12，约 <code>1.66054 × 10<sup>−24</sup> g</code>。用这个单位，质子与中子都约等于 1 u，电子可忽略，所以一个原子的质量数近似等于它的相对质量。这也是为什么质量数能用来估算摩尔质量：1 mol 的 <sup>12</sup>C 重 12 g，1 mol 的 <sup>56</sup>Fe 约重 56 g。' },

    { t: 'p', html: '离子也能用核素符号表示，只是电荷写在右上角：<code><sup>24</sup><sub>12</sub>Mg<sup>2+</sup></code> 表示镁离子，仍有 12 个质子、12 个中子，但只有 10 个电子。写电子数时用「质子数 − 电荷数」，阴离子则加。这个式子在配平氧化还原半反应时会再次出现，先把记法练熟。' },

    { t: 'p', html: '练一个数粒子的例子：<code><sup>31</sup><sub>15</sub>P<sup>3−</sup></code>。质子数 15，中子数 31 − 15 = 16，电子数 15 − (−3) = 18。它和氩（18 个电子）等电子，所以半径与 <code>Cl<sup>−</sup></code>、<code>S<sup>2−</sup></code> 接近。等电子体系（isoelectronic）的半径规律是：核电荷越大，吸引电子越紧，半径越小，所以 <code>P<sup>3−</sup> &gt; S<sup>2−</sup> &gt; Cl<sup>−</sup> &gt; K<sup>+</sup> &gt; Ca<sup>2+</sup></code>。' },

    { t: 'h', lvl: 2, text: '二、同位素与平均原子质量', id: 'ch02-2' },

    { t: 'p', html: '同一种元素可以有不同中子数，这些核素互称<b>同位素（isotope）</b>。氢有三种：氕（<code><sup>1</sup>H</code>，0 个中子）、氘（<code><sup>2</sup>H</code>，1 个中子）、氚（<code><sup>3</sup>H</code>，2 个中子，有放射性）。它们化学性质几乎相同，因为电子数一样；物理性质（如质量、扩散速率）有差别，这也是同位素分离的依据。' },

    { t: 'p', html: '周期表上给的原子质量是<b>平均原子质量（average atomic mass）</b>，按天然丰度加权。氯有两种主要同位素：<code><sup>35</sup>Cl</code> 丰度 75.77%，质量 34.969 u；<code><sup>37</sup>Cl</code> 丰度 24.23%，质量 36.966 u。加权平均：<code>0.7577 × 34.969 + 0.2423 × 36.966 ≈ 35.45 u</code>。周期表上氯写 35.45，不是 35 也不是 36，原因就在这里。' },

    { t: 'p', html: '反过来也能用平均质量求丰度，设 <code><sup>35</sup>Cl</code> 丰度为 x：<code>34.969x + 36.966(1 − x) = 35.45</code>，解得 <code>x ≈ 0.758</code>。这是常见的考试题型，本质是一元一次方程。注意质量数（35、37）只能用于估算，精确计算必须用同位素的实际质量，因为核结合能会造成质量亏损。' },

    { t: 'quiz', qid: 'ch02-q1' },

    { t: 'p', html: '同位素的丰度靠<b>质谱（mass spectrometry）</b>测定。样品先被电离，再在电场与磁场中按质荷比分离，检测器记录的峰高比就是丰度比。氯的质谱在 m/z 35 与 37 处出现两个峰，高度比约 3 : 1，正好对应 75.77% 与 24.23%。同一元素的不同同位素在质谱上「分得开」，但化学性质几乎一样，所以分离同位素很难，通常要用气体扩散或离心。' },

    { t: 'p', html: '顺带解释一个疑问：为什么同位素的实际质量不正好等于质量数？因为把核子结合成原子核会释放能量，按 <code>E = mc<sup>2</sup></code>，质量相应减少，这叫质量亏损。碳-12 被定义为恰好 12 u，其他核素就落在整数附近而非正好整数。这个差额在化学计算里可以忽略，但在核物理里是主角。' },

    { t: 'h', lvl: 2, text: '三、周期表分区与离子电荷', id: 'ch02-3' },

    { t: 'p', html: '周期表按原子序数递增排列，横行叫<b>周期（period）</b>，纵列叫<b>族（group）</b>。同一族元素价电子数相同，所以化学性质相似：第 1 族碱金属都易失一个电子，第 17 族卤素都易得一个电子。第 18 族稀有气体最外层已满，反应性极低。' },

    { t: 'p', html: '主族元素的常见离子电荷可以由此推出。第 1 族失 1 个电子成 +1，第 2 族成 +2；第 15 族得 3 个成 −3，第 16 族成 −2，第 17 族成 −1。过渡金属常有多价态，如铁有 <code>Fe<sup>2+</sup></code> 与 <code>Fe<sup>3+</sup></code>，铜有 <code>Cu<sup>+</sup></code> 与 <code>Cu<sup>2+</sup></code>，命名时必须用罗马数字标明。' },

    { t: 'compare', left: { title: '阳离子（cation）', html: '金属原子失去电子形成，带正电，半径比原原子小。例如 <code>Na → Na<sup>+</sup> + e<sup>−</sup></code>，<code>Mg → Mg<sup>2+</sup> + 2e<sup>−</sup></code>。电子少了，核对外层电子的吸引相对增强，所以离子收缩。' }, right: { title: '阴离子（anion）', html: '非金属原子得到电子形成，带负电，半径比原原子大。例如 <code>Cl + e<sup>−</sup> → Cl<sup>−</sup></code>，<code>O + 2e<sup>−</sup> → O<sup>2−</sup></code>。电子间排斥增强，所以离子膨胀。' } },

    { t: 'p', html: '判断离子电荷有一个速查法：主族元素达到「稀有气体电子构型」所需的电子转移数，就是电荷数。钠（1s²2s²2p⁶3s¹）失一个最外层电子变成 Ne 构型；氯（3s²3p⁵）得一个变成 Ar 构型。这个方法对第 1–17 族主族元素都有效，对过渡金属不适用——它们不追求稀有气体构型，而是形成多种价态。' },

    { t: 'p', html: '周期表还能读出三条趋势的前半段：同周期从左到右，核电荷增加而电子层不变，原子半径逐渐变小；同主族从上到下，电子层增加，原子半径逐渐变大。这两条趋势在第 6 章会用有效核电荷定量解释，现在先记住方向。它们直接决定了离子半径的大小：<code>Na<sup>+</sup></code> 比 <code>Na</code> 小，<code>Cl<sup>−</sup></code> 比 <code>Cl</code> 大，而同周期阳离子总比阴离子小。' },

    { t: 'p', html: '过渡金属的价态必须靠记忆加规则。常见的有：铁 +2 / +3，铜 +1 / +2，锰 +2 / +4 / +7，铬 +3 / +6。命名时罗马数字写在元素名后的括号里，如 <code>CuCl</code> 是 copper(I) chloride，<code>CuCl<sub>2</sub></code> 是 copper(II) chloride。旧命名法用 -ous / -ic 后缀（ferrous / ferric），看到时认得即可，答题建议用罗马数字，歧义最小。' },

    { t: 'h', lvl: 2, text: '四、化学式：经验式与分子式', id: 'ch02-4' },

    { t: 'p', html: '<b>经验式（empirical formula）</b>只给出元素的最简整数比，<b>分子式（molecular formula）</b>给出一个分子里实际含有的原子数。过氧化氢的经验式是 HO，分子式是 <code>H<sub>2</sub>O<sub>2</sub></code>；葡萄糖的经验式是 <code>CH<sub>2</sub>O</code>，分子式是 <code>C<sub>6</sub>H<sub>12</sub>O<sub>6</sub></code>。分子式一定是经验式的整数倍，倍数由摩尔质量确定。' },

    { t: 'p', html: '离子化合物没有「分子」这个概念，它的化学式表示的是<b>离子数目的最简比</b>，叫式量单位（formula unit）。<code>NaCl</code> 表示 <code>Na<sup>+</sup></code> 与 <code>Cl<sup>−</sup></code> 按 1 : 1 排列成晶格，不存在一个独立的 NaCl 分子。所以对离子化合物说「分子量」并不严谨，规范说法是「式量」。' },

    { t: 'p', html: '写离子化合物式子的方法只有一步：<b>让正负电荷总数相等</b>。氧化铝由 <code>Al<sup>3+</sup></code> 与 <code>O<sup>2−</sup></code> 组成，最小公倍数是 6，需要 2 个 Al 和 3 个 O，写作 <code>Al<sub>2</sub>O<sub>3</sub></code>。硝酸钙由 <code>Ca<sup>2+</sup></code> 与 <code>NO<sub>3</sub><sup>−</sup></code> 组成，需要 1 个 Ca 和 2 个硝酸根，写作 <code>Ca(NO<sub>3</sub>)<sub>2</sub></code>，括号不能省，因为下标 2 作用于整个硝酸根。' },

    { t: 'table', head: ['阳离子', '阴离子', '化学式', '易错点'], rows: [
      ['Na<sup>+</sup>', 'Cl<sup>−</sup>', 'NaCl', '不要写 Na<sub>2</sub>Cl<sub>2</sub>，最简比'],
      ['Ca<sup>2+</sup>', 'Cl<sup>−</sup>', 'CaCl<sub>2</sub>', '电荷 2 : 1，下标 2 写在 Cl 后'],
      ['Al<sup>3+</sup>', 'O<sup>2−</sup>', 'Al<sub>2</sub>O<sub>3</sub>', '交叉配位：3 给 O，2 给 Al'],
      ['Fe<sup>3+</sup>', 'OH<sup>−</sup>', 'Fe(OH)<sub>3</sub>', '多原子离子必须加括号'],
      ['NH<sub>4</sub><sup>+</sup>', 'SO<sub>4</sub><sup>2−</sup>', '(NH<sub>4</sub>)<sub>2</sub>SO<sub>4</sub>', '两组多原子离子，两边都要括号']
    ], caption: '「交叉法」只是电荷平衡的快捷写法，写完一定要回查总电荷是否为零' },

    { t: 'p', html: '还有一类式子带结晶水，叫<b>水合物（hydrate）</b>。五水硫酸铜写作 <code>CuSO<sub>4</sub>·5H<sub>2</sub>O</code>，式量要把 5 个水算进去：<code>63.55 + 32.07 + 64.00 + 5 × 18.02 = 249.7 g/mol</code>。加热到 250 °C，蓝色晶体变成白色无水硫酸铜，质量减少的正是这 5 个水，质量差除以水的摩尔质量就能算出结晶水数目。这是实验课常见的一个定量题。' },

    { t: 'h', lvl: 2, text: '五、离子化合物的命名', id: 'ch02-5' },

    { t: 'p', html: '二元离子化合物的命名格式是「金属名 + 非金属名改 -ide」。<code>NaCl</code> 读作 sodium chloride，<code>MgO</code> 读作 magnesium oxide，<code>Al<sub>2</sub>O<sub>3</sub></code> 读作 aluminum oxide。金属只有一种常见价态时不必标数字；有多种价态时必须用罗马数字，如 <code>FeCl<sub>2</sub></code> 是 iron(II) chloride，<code>FeCl<sub>3</sub></code> 是 iron(III) chloride。' },

    { t: 'p', html: '含多原子离子的化合物按离子名直接拼。<code>NaNO<sub>3</sub></code> 是 sodium nitrate，<code>K<sub>2</sub>SO<sub>4</sub></code> 是 potassium sulfate，<code>Ca(OH)<sub>2</sub></code> 是 calcium hydroxide，<code>NH<sub>4</sub>Cl</code> 是 ammonium chloride。注意铵根是阳离子，写在前面；氢氧根、硝酸根、硫酸根、碳酸根、磷酸根这几个必须背熟，它们是后续章节的高频角色。' },

    { t: 'p', html: '分子化合物（两种非金属）用希腊数字前缀表示原子个数：<code>CO</code> 是一氧化碳（carbon monoxide），<code>CO<sub>2</sub></code> 是二氧化碳（carbon dioxide），<code>N<sub>2</sub>O<sub>4</sub></code> 是四氧化二氮（dinitrogen tetroxide）。第一个元素前的前缀 mono- 通常省略，所以 CO 不写 monocarbon monoxide。酸类的命名另有一套：<code>HCl</code> 溶于水叫 hydrochloric acid，<code>H<sub>2</sub>SO<sub>4</sub></code> 叫 sulfuric acid，<code>HNO<sub>3</sub></code> 叫 nitric acid。' },

    { t: 'p', html: '含氧酸根有一组规律：同一元素形成两个含氧酸根时，氧多的叫 -ate，氧少的叫 -ite，例如 <code>NO<sub>3</sub><sup>−</sup></code> 硝酸根 / <code>NO<sub>2</sub><sup>−</sup></code> 亚硝酸根，<code>SO<sub>4</sub><sup>2−</sup></code> 硫酸根 / <code>SO<sub>3</sub><sup>2−</sup></code> 亚硫酸根。再少一个氧加前缀 hypo-，再多一个氧加前缀 per-，如 <code>ClO<sub>4</sub><sup>−</sup></code> 高氯酸根、<code>ClO<sup>−</sup></code> 次氯酸根。把这条规律和电荷一起记，比死背十几个名字稳。' },

    { t: 'quiz', qid: 'ch02-q2' },

    { t: 'h', lvl: 2, text: '六、摩尔质量与质量百分比', id: 'ch02-6' },

    { t: 'p', html: '<b>摩尔质量（molar mass）</b>是一摩尔物质的质量，数值上等于化学式中所有原子相对原子质量之和，单位 g/mol。算 <code>Ca(NO<sub>3</sub>)<sub>2</sub></code>：Ca 40.08，N 2 × 14.01 = 28.02，O 6 × 16.00 = 96.00，合计 <code>164.10 g/mol</code>。下标在括号外时作用于整个括号，这是最常见的漏乘点。' },

    { t: 'p', html: '质量百分比（mass percent）等于某元素的总质量除以式量。以 <code>Ca(NO<sub>3</sub>)<sub>2</sub></code> 为例，氮占 <code>28.02 / 164.10 = 17.07%</code>，氧占 <code>96.00 / 164.10 = 58.50%</code>，钙占 24.43%，三者相加正好 100%。若加起来不是 100%，说明某一步漏乘了下标或算错了摩尔质量。' },

    { t: 'p', html: '质量百分比可以用来判断肥料或矿石的品位。硝酸铵 <code>NH<sub>4</sub>NO<sub>3</sub></code> 的式量是 80.05 g/mol，含氮 28.02 g/mol，氮含量 35.0%，是常见氮肥里含氮量较高的一种；尿素 <code>CO(NH<sub>2</sub>)<sub>2</sub></code> 含氮 46.6%，更高。同样是「100 克肥料」，实际提供的氮原子数可以差三成，这就是计量比价格更有意义的地方。' },

    { t: 'p', html: '质量百分比再往前一步就是第 3 章的桥：100 g 样品含 17.07 g 氮，等于 <code>17.07 / 14.01 = 1.22 mol</code> 氮原子。把每种元素都换成摩尔，再除以最小的那个摩尔数，就得到经验式的下标比。这条路径在本章只做预告，完整算法（含取整技巧）在第 3 章「经验式与分子式」一节展开，那里会用到本章的摩尔质量。' },

    { t: 'steps', items: [
      { title: '第一步 · 写出各元素的质量', html: '用相对原子质量乘以下标，多原子离子先展开再乘，例如 (NO<sub>3</sub>)<sub>2</sub> 展开成 N<sub>2</sub>O<sub>6</sub>。' },
      { title: '第二步 · 求和得摩尔质量', html: '单位 g/mol；保留两位小数即可，答案的有效数字由题目给定数据决定。' },
      { title: '第三步 · 算百分比', html: '某元素质量 ÷ 总质量 × 100%；各元素百分比之和应为 100%（允许 ±0.1 的修约误差）。' },
      { title: '第四步 · 回到粒子层面解释', html: '百分比高不等于原子数多：氢的摩尔质量小，质量占比低但原子数可能最多。' }
    ] },

    { t: 'p', html: '要区分两个常被混用的词：<b>摩尔质量</b>是「一摩尔物质的质量」（g/mol），<b>相对分子质量</b>是「一个分子相对于 1/12 个碳-12 原子的质量」（无量纲）。数值上两者相同，但单位与含义不同。考试写答案时用 g/mol；如果题目问「相对分子质量」，就不能带单位。另一个坑是「式量」：离子化合物用式量，分子化合物才用分子量，虽然数值算法一样。' },

    { t: 'h', lvl: 2, text: '七、电解质与水合离子', id: 'ch02-7' },

    { t: 'p', html: '溶于水能导电的物质叫<b>电解质（electrolyte）</b>，因为它们在水里解离成自由移动的离子。<code>NaCl(s) → Na<sup>+</sup>(aq) + Cl<sup>−</sup>(aq)</code> 是<b>强电解质</b>，解离完全；醋酸 <code>CH<sub>3</sub>COOH</code> 只部分解离，是<b>弱电解质</b>；糖溶于水不产生离子，是<b>非电解质</b>。导电性的强弱取决于离子浓度与电荷，不取决于「溶没溶」。' },

    { t: 'p', html: '离子在水中会被水分子包围，形成<b>水合离子（hydrated ion）</b>，写作 <code>Na<sup>+</sup>(aq)</code>。水分子带极性，氧端带部分负电，朝向阳离子；氢端带部分正电，朝向阴离子。水合放热（或吸热）是溶解热的一部分，第 5 章会定量处理。' },

    { t: 'table', head: ['类别', '例子', '解离情况', '导电性'], rows: [
      ['强电解质', 'NaCl、HCl、NaOH、KNO<sub>3</sub>', '完全解离', '强'],
      ['弱电解质', 'CH<sub>3</sub>COOH、NH<sub>3</sub>、H<sub>2</sub>CO<sub>3</sub>', '部分解离（约 1%）', '弱'],
      ['非电解质', '葡萄糖、乙醇、蔗糖', '不解离', '几乎不导电']
    ], caption: '强弱电解质看「解离程度」，不是看「溶解多少」；硫酸钡难溶，但溶解的那部分完全解离' },

    { t: 'p', html: '本章最后一个易错点：<b>离子化合物溶于水后，原来的「分子」不存在了</b>。写 <code>NaCl(aq)</code> 时，实际存在的是 <code>Na<sup>+</sup>(aq)</code> 与 <code>Cl<sup>−</sup>(aq)</code>，不存在 NaCl 分子。第 4 章写净离子方程式时，正是基于这一点把可溶强电解质拆成离子；如果这一步没想到，方程式一定写错。' },

    { t: 'p', html: '七个强酸要直接记住：<code>HCl、HBr、HI、HNO<sub>3</sub>、H<sub>2</sub>SO<sub>4</sub>、HClO<sub>3</sub>、HClO<sub>4</sub></code>。六个强碱是第 1、2 族氢氧化物：<code>LiOH、NaOH、KOH、Ca(OH)<sub>2</sub>、Sr(OH)<sub>2</sub>、Ba(OH)<sub>2</sub></code>，其中 <code>Ca(OH)<sub>2</sub></code> 微溶，饱和石灰水仍是强电解质。其余常见酸（醋酸、碳酸、氢氟酸、磷酸）都是弱酸，写离子方程式时必须保留分子式。这份清单在第 4 章会反复使用。' },

    { t: 'callout', kind: 'warn', title: '本章五个高频错误', html: '① 把质量数当原子质量用；② 写离子化合物时用分子式思维，写 Na<sub>2</sub>Cl<sub>2</sub> 这类非最简比；③ 括号外下标漏乘，把 Ca(NO<sub>3</sub>)<sub>2</sub> 的氧算成 3 个；④ 命名过渡金属盐不标罗马数字；⑤ 把「难溶」当成「非电解质」——BaSO<sub>4</sub> 难溶，但溶解部分完全解离。' },

    { t: 'quiz', qid: 'ch02-q3' },

    { t: 'terms', items: [
      { en: 'atomic number', zh: '原子序数', html: '核内质子数，决定元素身份；中性原子中等于电子数。' },
      { en: 'isotope', zh: '同位素', html: '质子数相同、中子数不同的核素；化学性质相近，质量不同。' },
      { en: 'empirical formula', zh: '经验式', html: '元素的最简整数比；分子式是它的整数倍。' },
      { en: 'polyatomic ion', zh: '多原子离子', html: '由多个原子共价结合后整体带电的离子，如 NO<sub>3</sub><sup>−</sup>、SO<sub>4</sub><sup>2−</sup>。' },
      { en: 'molar mass', zh: '摩尔质量', html: '一摩尔物质的质量，数值等于式量，单位 g/mol。' },
      { en: 'electrolyte', zh: '电解质', html: '溶于水或熔融时能产生自由离子而导电的物质。' }
    ] },

    { t: 'keypoint', items: [
      { title: '质子数定身份，中子数定同位素', html: 'Z 决定是哪种元素，A − Z 决定中子数；电子数决定电荷，中性时等于 Z。' },
      { title: '平均原子质量是加权平均', html: '周期表数值不是整数，因为它按天然丰度加权；可由丰度求质量，也可由质量反求丰度。' },
      { title: '化学式由电荷平衡决定', html: '离子化合物取最简整数比，多原子离子整体加括号；交叉法写完必须回查总电荷。' },
      { title: '摩尔质量要展开括号', html: 'Ca(NO<sub>3</sub>)<sub>2</sub> 里 N 是 2 个、O 是 6 个；漏乘括号是最高频的计算错误。' },
      { title: '溶解 ≠ 解离', html: '强电解质完全解离，弱电解质部分解离，非电解质不解离；导电性看离子浓度。' }
    ] },

    { t: 'checklist', id: 'ch02', items: [
      '我能由 <sup>56</sup><sub>26</sub>Fe 说出质子、中子、电子各多少个',
      '我能解释为什么周期表上氯的原子质量是 35.45 而不是整数',
      '我能由族序数推出 Na、Mg、Al、O、F 的常见离子电荷',
      '我能写出氧化铁、硝酸钙、硫酸铵的化学式并命名',
      '我能区分经验式与分子式，并说出葡萄糖的两种写法',
      '我能算出 Ca(NO<sub>3</sub>)<sub>2</sub> 的摩尔质量并检查各元素百分比之和',
      '我能判断 NaCl、醋酸、葡萄糖分别属于强电解质、弱电解质还是非电解质',
      '我能解释为什么 NaCl 溶于水后不存在 NaCl 分子',
      '我能看出「FeCl<sub>2</sub> 叫氯化铁」这类命名错误并改正'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应 Chemistry: The Central Science 15th Edition（SI Units）第 2 章：原子结构与亚原子粒子、同位素与平均原子质量、周期表、离子、化学式与命名、摩尔质量。核化学与放射性衰变只在同位素处一笔带过，不在本课考核范围；配合物命名与配位化学留给后续课程。文中氯的同位素丰度与原子质量取教材常用值，不同来源末位可能略有差异，不影响方法。' }
  ]
});
