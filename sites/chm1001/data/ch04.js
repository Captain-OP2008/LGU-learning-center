/* =====================================================================
 * ch04.js · 第 4 章「水溶液反应：沉淀、酸碱与氧化还原」
 * 职责：把溶液中的三类反应讲成一套判断流程——溶不溶、传不传质子、变不变价。
 * 依据：Chemistry: The Central Science 15th Ed. 第 4 章 Reactions in Aqueous Solution。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch04',
  num: '04',
  title: '水溶液反应：沉淀、酸碱与氧化还原',
  en: 'REACTIONS IN AQUEOUS SOLUTION',
  goals: [
    '用溶解性规则判断混合两种电解质溶液是否产生沉淀',
    '写出分子方程式、完全离子方程式与净离子方程式，并说明三者差别',
    '用 Brønsted 酸碱定义判断质子的给予与接受，识别共轭酸碱对',
    '计算元素的氧化数，判断反应是否属于氧化还原',
    '用半反应法配平酸性或碱性条件下的氧化还原方程式'
  ],
  kp: [
    { id: 'ch04-1', title: '溶解与电解质' },
    { id: 'ch04-2', title: '沉淀与溶解性规则' },
    { id: 'ch04-3', title: '净离子方程式' },
    { id: 'ch04-4', title: 'Brønsted 酸碱与中和' },
    { id: 'ch04-5', title: '氧化数与氧化还原判断' },
    { id: 'ch04-6', title: '半反应法与常见氧化剂' },
    { id: 'ch04-7', title: '浓度、稀释与化学计量' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么水溶液是化学的主战场', html: '自然界和实验室里绝大多数反应发生在水里：血液、海水、细胞液、滴定瓶。水把离子拆散、让它们自由碰撞，于是反应能否发生，取决于三件事——<b>生成物溶不溶</b>、<b>质子往哪边走</b>、<b>电子往哪边走</b>。这三件事对应沉淀、酸碱、氧化还原三类反应。本章的目标不是背反应式，而是拿到两种溶液就能判断「混在一起会不会变」。' },

    { t: 'p', lead: true, html: '这一章的内容看着杂，其实是一条判断链：先看有没有离子结合成难溶物，再看有没有质子转移，最后看有没有电子转移。三类反应可能同时发生，写方程式时要按「先拆成离子、再删旁观离子」的顺序处理。学完本章，你应能独立写出净离子方程式，并解释它为什么比分子方程式更能说明「真正发生了什么」。' },

    { t: 'h', lvl: 2, text: '一、溶解与电解质', id: 'ch04-1' },

    { t: 'p', html: '物质溶于水分两种情况。离子化合物（如 <code>NaCl</code>）靠水分子把晶格拆开，形成水合离子，过程叫<b>解离（dissociation）</b>；极性分子（如 <code>HCl</code>）与水反应生成离子，叫<b>电离（ionization）</b>。两者都产生自由离子，所以都能导电。蔗糖溶于水只是分子分散，不产生离子，溶液不导电。' },

    { t: 'p', html: '「相似相溶」这条经验规则可以解释很多现象：极性溶质易溶于极性溶剂，非极性溶质易溶于非极性溶剂。碘 <code>I<sub>2</sub></code> 难溶于水却易溶于四氯化碳，因为碘是非极性分子；食盐难溶于汽油，因为离子晶格无法被非极性溶剂拆开。第 7 章讲分子间作用力时会给这条规则一个定量基础。' },

    { t: 'p', html: '溶解不等于反应。把 <code>NaCl</code> 放进水里，得到的是 <code>Na<sup>+</sup></code> 与 <code>Cl<sup>−</sup></code> 的混合物，没有新物质；但把 <code>Na</code> 放进水里，会剧烈反应放出氢气并生成 <code>NaOH</code>，那是化学变化。判断依据仍是第 1 章那条：有没有新物质生成。' },

    { t: 'p', html: '从能量看，溶解是否发生取决于两步的竞争：拆开晶格要吸热（<b>晶格能</b>），离子被水包围要放热（<b>水合能</b>）。两者之差是溶解焓。<code>NH<sub>4</sub>NO<sub>3</sub></code> 溶解明显吸热，是冰袋的原理；<code>NaOH</code> 溶解剧烈放热，因为水合能远大于晶格能。注意「溶解吸热」不代表「不能溶」——硝酸铵溶解度很大，能量只决定温度变化，不决定溶解上限。' },

    { t: 'h', lvl: 2, text: '二、沉淀与溶解性规则', id: 'ch04-2' },

    { t: 'p', html: '两种电解质溶液混合，如果其中一对离子结合成的化合物难溶，就会析出<b>沉淀（precipitate）</b>。例如硝酸银与氯化钠混合：<code>Ag<sup>+</sup> + Cl<sup>−</sup> → AgCl(s)</code>，白色沉淀。硝酸钾与氯化钠混合则什么也不发生，因为四种可能的组合都易溶。判断的关键是<b>逐个检查交叉组合</b>，而不是看溶液颜色或名字。' },

    { t: 'table', head: ['离子', '溶解性规律', '例外（重要）'], rows: [
      ['NO<sub>3</sub><sup>−</sup>', '全部可溶', '无'],
      ['Na<sup>+</sup>、K<sup>+</sup>、NH<sub>4</sub><sup>+</sup>', '全部可溶', '无'],
      ['Cl<sup>−</sup>', '多数可溶', 'AgCl、PbCl<sub>2</sub>（热水可溶）、Hg<sub>2</sub>Cl<sub>2</sub>'],
      ['SO<sub>4</sub><sup>2−</sup>', '多数可溶', 'BaSO<sub>4</sub>、PbSO<sub>4</sub>、CaSO<sub>4</sub>（微溶）'],
      ['OH<sup>−</sup>', '碱金属与 Ba<sup>2+</sup> 可溶', 'Ca(OH)<sub>2</sub> 微溶，其余多难溶'],
      ['CO<sub>3</sub><sup>2−</sup>、PO<sub>4</sub><sup>3−</sup>、S<sup>2−</sup>', '多数难溶', '钠、钾、铵盐可溶']
    ], caption: '溶解性表不必全背，记住「硝酸盐全溶、钠钾铵全溶」与四条常见例外即可覆盖多数题' },

    { t: 'p', html: '「难溶」不等于「一点都不溶」。<code>AgCl</code> 在 25 °C 的溶解度约 <code>1.3 × 10<sup>−5</sup> mol/L</code>，仍有极少量溶解并完全解离。这个微量在定性判断里可以忽略，但在定量分析（如重量法测氯）里必须考虑，否则结果会偏低。第 6 章之后的溶度积会给出定量处理，本章只做「沉不沉」的定性判断。' },

    { t: 'compare', left: { title: '会沉淀的组合', html: 'Ag<sup>+</sup> + Cl<sup>−</sup>、Ba<sup>2+</sup> + SO<sub>4</sub><sup>2−</sup>、Ca<sup>2+</sup> + CO<sub>3</sub><sup>2−</sup>、Cu<sup>2+</sup> + OH<sup>−</sup>、Pb<sup>2+</sup> + I<sup>−</sup>。共同点：生成物的晶格能远大于水合能，离子宁愿挤在固体里。' }, right: { title: '不沉淀的组合', html: 'Na<sup>+</sup> + NO<sub>3</sub><sup>−</sup>、K<sup>+</sup> + Cl<sup>−</sup>、NH<sub>4</sub><sup>+</sup> + SO<sub>4</sub><sup>2−</sup>。水合能足以把晶格拆开，离子留在溶液里，混合后只是「换了邻居」。' } },

    { t: 'quiz', qid: 'ch04-q1' },

    { t: 'h', lvl: 2, text: '三、净离子方程式', id: 'ch04-3' },

    { t: 'p', html: '同一个反应可以写三种式子。以硝酸银与氯化钠为例：<b>分子方程式</b> <code>AgNO<sub>3</sub>(aq) + NaCl(aq) → AgCl(s) + NaNO<sub>3</sub>(aq)</code>；<b>完全离子方程式</b>把所有可溶强电解质拆成离子；<b>净离子方程式</b>再删掉两边都出现的<b>旁观离子（spectator ion）</b>，得 <code>Ag<sup>+</sup>(aq) + Cl<sup>−</sup>(aq) → AgCl(s)</code>。' },

    { t: 'p', html: '净离子方程式的价值在于「点名」真正参与反应的粒子。不管银离子来自硝酸银、硫酸银还是醋酸银，只要溶液里有自由 <code>Ag<sup>+</sup></code>，遇到 <code>Cl<sup>−</sup></code> 就生成同样的沉淀。所以同一净离子方程式可以对应无数个「分子方程式」，这也是它更本质的原因。' },

    { t: 'steps', items: [
      { title: '第一步 · 写分子方程式', html: '先确认产物是什么、是否沉淀或气体；难溶物、弱电解质、气体、水都保留分子式。' },
      { title: '第二步 · 拆成完全离子式', html: '只拆可溶的强电解质（强酸、强碱、可溶盐）；沉淀、弱酸弱碱、氧化物、水不拆。' },
      { title: '第三步 · 消去旁观离子', html: '两边完全相同的离子删掉，系数约成最简；剩下的就是净离子方程式。' },
      { title: '第四步 · 检查原子与电荷', html: '两边原子数相等、总电荷相等；这是唯一能自查的两条硬标准。' }
    ] },

    { t: 'p', html: '哪些物质「不拆」要记牢：<b>沉淀</b>（AgCl、BaSO<sub>4</sub>、CaCO<sub>3</sub>）、<b>弱电解质</b>（醋酸、氨水、水）、<b>气体</b>（CO<sub>2</sub>、SO<sub>2</sub>、H<sub>2</sub>S）、<b>氧化物</b>（Na<sub>2</sub>O、CaO）。把醋酸拆成 <code>H<sup>+</sup> + CH<sub>3</sub>COO<sup>−</sup></code> 是最常见的错误之一，因为它只有约 1% 解离，绝大部分以分子存在。' },

    { t: 'p', html: '写碳酸盐与酸反应时还要注意分步：<code>CO<sub>3</sub><sup>2−</sup> + 2H<sup>+</sup> → H<sub>2</sub>CO<sub>3</sub></code> 随即分解为 <code>H<sub>2</sub>O + CO<sub>2</sub>(g)</code>，合并写成 <code>CO<sub>3</sub><sup>2−</sup> + 2H<sup>+</sup> → H<sub>2</sub>O + CO<sub>2</sub>(g)</code>。如果只写第一步，产物里留着一个不稳定的弱酸，严格评分会扣分。类似地，<code>NH<sub>4</sub><sup>+</sup> + OH<sup>−</sup> → NH<sub>3</sub>·H<sub>2</sub>O</code> 常写成 <code>NH<sub>3</sub>(aq) + H<sub>2</sub>O</code>。' },

    { t: 'p', html: '除沉淀外，还有两类「推动反应前进」的产物：<b>气体</b>与<b>弱电解质</b>。碳酸盐遇酸放出 <code>CO<sub>2</sub></code>，亚硫酸盐遇酸放出 <code>SO<sub>2</sub></code>，硫化物遇酸放出 <code>H<sub>2</sub>S</code>；酸碱中和生成水，也是把自由离子变成弱电解质。判断一个离子反应能否发生，就看有没有沉淀、气体或弱电解质生成——这三者都会把产物从「离子池」里移走。' },

    { t: 'p', html: '把三条规则串起来练一题：碳酸钙与盐酸反应，写净离子式。<code>CaCO<sub>3</sub></code> 难溶，保留分子式；盐酸是强酸，拆成 <code>H<sup>+</sup></code> 与 <code>Cl<sup>−</sup></code>；产物 <code>CaCl<sub>2</sub></code> 可溶，拆成离子；水与二氧化碳保留。<code>CaCO<sub>3</sub>(s) + 2H<sup>+</sup>(aq) → Ca<sup>2+</sup>(aq) + H<sub>2</sub>O + CO<sub>2</sub>(g)</code>，氯离子全程旁观被删掉。检查：原子与电荷都平。' },

    { t: 'h', lvl: 2, text: '四、Brønsted 酸碱与中和', id: 'ch04-4' },

    { t: 'p', html: '<b>Brønsted–Lowry 定义</b>：酸是质子（<code>H<sup>+</sup></code>）给予体，碱是质子接受体。这个定义比「能使石蕊变红」更通用，因为它不依赖溶剂。醋酸给出质子：<code>CH<sub>3</sub>COOH + H<sub>2</sub>O ⇌ CH<sub>3</sub>COO<sup>−</sup> + H<sub>3</sub>O<sup>+</sup></code>；氨接受质子：<code>NH<sub>3</sub> + H<sub>2</sub>O ⇌ NH<sub>4</sub><sup>+</sup> + OH<sup>−</sup></code>。注意水在两式中角色不同，它既能给也能受，是<b>两性（amphiprotic）</b>物质。' },

    { t: 'p', html: '一对只差一个质子的酸碱叫<b>共轭酸碱对（conjugate acid–base pair）</b>。醋酸与醋酸根是一对，铵根与氨是一对。<b>强酸的共轭碱很弱</b>（<code>Cl<sup>−</sup></code> 几乎不结合质子），<b>弱酸的共轭碱较强</b>（<code>CH<sub>3</sub>COO<sup>−</sup></code> 能明显水解）。这条规律解释了为什么强酸强碱盐溶液近中性，而醋酸钠溶液显碱性。' },

    { t: 'p', html: '中和反应的通式是 <code>H<sup>+</sup> + OH<sup>−</sup> → H<sub>2</sub>O</code>，但只在强酸强碱时成立。弱酸与强碱中和，净离子式要保留弱酸分子：<code>CH<sub>3</sub>COOH + OH<sup>−</sup> → CH<sub>3</sub>COO<sup>−</sup> + H<sub>2</sub>O</code>。中和热也因此不同：强酸强碱的中和热约 <code>−57.3 kJ/mol</code>，弱酸的中和热略小，因为弱酸要先电离吸热。第 5 章会用到这个差别。' },

    { t: 'quiz', qid: 'ch04-q2' },

    { t: 'p', html: '共轭关系可以用一张「强弱对照」来记：<code>HCl</code> 强 → <code>Cl<sup>−</sup></code> 极弱；<code>HF</code> 弱 → <code>F<sup>−</sup></code> 较强；<code>H<sub>2</sub>O</code> 极弱酸 → <code>OH<sup>−</sup></code> 强碱；<code>NH<sub>4</sub><sup>+</sup></code> 弱酸 → <code>NH<sub>3</sub></code> 弱碱。注意「强碱的共轭酸极弱」与「强酸的共轭碱极弱」是同一句话的两面，方向别记反。判断盐溶液酸碱性时，就是看这个盐水解后生成的是强还是弱的共轭伙伴。' },

    { t: 'h', lvl: 2, text: '五、氧化数与氧化还原判断', id: 'ch04-5' },

    { t: 'p', html: '氧化还原的本质是<b>电子转移</b>。失去电子叫氧化（oxidation），得到电子叫还原（reduction），两者同时发生。判断是否发生电子转移，靠<b>氧化数（oxidation number）</b>的变化：某元素氧化数升高说明被氧化，降低说明被还原。氧化数是一种记账约定，不等于实际电荷，但对配平极其有用。' },

    { t: 'table', head: ['情形', '规则', '例子'], rows: [
      ['单质', '氧化数为 0', 'O<sub>2</sub> 中 O 为 0，Fe 中 Fe 为 0'],
      ['单原子离子', '等于离子电荷', 'Na<sup>+</sup> 为 +1，S<sup>2−</sup> 为 −2'],
      ['氧（一般）', '−2', 'H<sub>2</sub>O 中 O 为 −2；过氧化物中为 −1'],
      ['氢（一般）', '+1', 'HCl 中 H 为 +1；金属氢化物中为 −1'],
      ['中性分子', '各元素氧化数之和为 0', 'H<sub>2</sub>SO<sub>4</sub>：2(+1) + S + 4(−2) = 0，S 为 +6'],
      ['多原子离子', '之和等于离子电荷', 'MnO<sub>4</sub><sup>−</sup>：Mn + 4(−2) = −1，Mn 为 +7']
    ], caption: '先定 O 与 H，再用总和求未知元素，是最快的顺序' },

    { t: 'p', html: '练一个：<code>K<sub>2</sub>Cr<sub>2</sub>O<sub>7</sub></code> 中铬的氧化数。K 为 +1，O 为 −2，设 Cr 为 x：<code>2(+1) + 2x + 7(−2) = 0</code>，解得 <code>x = +6</code>。再练离子：<code>Cr<sub>2</sub>O<sub>7</sub><sup>2−</sup></code> 中 <code>2x + 7(−2) = −2</code>，同样得 +6。注意过氧化物（<code>H<sub>2</sub>O<sub>2</sub></code> 中 O 为 −1）、超氧化物、<code>OF<sub>2</sub></code>（O 为 +2）是例外，遇到时要按电负性重新判断。' },

    { t: 'p', html: '氧化剂与还原剂要分清：<b>氧化剂</b>本身被还原（氧化数降低），<b>还原剂</b>本身被氧化（氧化数升高）。常见氧化剂有 <code>O<sub>2</sub></code>、<code>Cl<sub>2</sub></code>、<code>KMnO<sub>4</sub></code>、<code>K<sub>2</sub>Cr<sub>2</sub>O<sub>7</sub></code>、浓 <code>HNO<sub>3</sub></code>；常见还原剂有活泼金属、<code>H<sub>2</sub></code>、<code>CO</code>、<code>SO<sub>2</sub></code>、<code>I<sup>−</sup></code>。名字容易记反，口诀是「氧化剂被还原」。' },

    { t: 'p', html: '还有一类反应叫<b>歧化（disproportionation）</b>：同一元素既升价又降价。氯气通入冷氢氧化钠溶液：<code>Cl<sub>2</sub> + 2OH<sup>−</sup> → Cl<sup>−</sup> + ClO<sup>−</sup> + H<sub>2</sub>O</code>，氯从 0 分别变成 −1 与 +1。判断这类反应时不要急着找两种反应物，先看有没有同一元素出现在产物中并带不同价态。加热时产物进一步歧化为 <code>Cl<sup>−</sup></code> 与 <code>ClO<sub>3</sub><sup>−</sup></code>，这也是漂白液久放失效的原因之一。' },

    { t: 'p', html: '再看一个氧化还原判断：铁钉放入硫酸铜溶液，<code>Fe + Cu<sup>2+</sup> → Fe<sup>2+</sup> + Cu</code>。铁从 0 升到 +2（被氧化，是还原剂），铜从 +2 降到 0（被还原，是氧化剂）。如果换成铁钉放入硫酸锌溶液，什么也不发生——因为锌比铁活泼，<code>Zn<sup>2+</sup></code> 没有能力把铁氧化。这类「金属活动性」判断本质是比较还原剂的强弱，顺序表在教材附录里可以查，逻辑是「强还原剂把弱还原剂从其盐中置换出来」。' },

    { t: 'h', lvl: 2, text: '六、半反应法与常见氧化剂', id: 'ch04-6' },

    { t: 'p', html: '配平氧化还原方程式用<b>半反应法</b>：拆成氧化半反应与还原半反应，各自配平原子与电荷，再乘系数使电子数相等，相加消去电子。酸性条件下用 <code>H<sub>2</sub>O</code> 配氧、<code>H<sup>+</sup></code> 配氢；碱性条件下再用 <code>OH<sup>−</sup></code> 中和 <code>H<sup>+</sup></code>。步骤固定，不需要灵感。' },

    { t: 'p', html: '以酸性高锰酸钾氧化 <code>Fe<sup>2+</sup></code> 为例。还原半反应：<code>MnO<sub>4</sub><sup>−</sup> + 8H<sup>+</sup> + 5e<sup>−</sup> → Mn<sup>2+</sup> + 4H<sub>2</sub>O</code>；氧化半反应：<code>Fe<sup>2+</sup> → Fe<sup>3+</sup> + e<sup>−</sup></code>。电子数取 5，相加得 <code>MnO<sub>4</sub><sup>−</sup> + 5Fe<sup>2+</sup> + 8H<sup>+</sup> → Mn<sup>2+</sup> + 5Fe<sup>3+</sup> + 4H<sub>2</sub>O</code>。检查电荷：左 <code>−1 + 10 + 8 = +17</code>，右 <code>+2 + 15 = +17</code>，通过。' },

    { t: 'p', html: '碱性条件下的处理：先把半反应按酸性配平，再在两边加等量 <code>OH<sup>−</sup></code> 把 <code>H<sup>+</sup></code> 中和成水，最后约去重复的水。经验是「酸性加 H<sup>+</sup>，碱性加 OH<sup>−</sup>，两边同时加，别只加一边」。高锰酸钾在碱性条件下被还原成 <code>MnO<sub>2</sub></code>（棕褐色），在中性条件下也生成 <code>MnO<sub>2</sub></code>，在强酸性条件下才变成近乎无色的 <code>Mn<sup>2+</sup></code>，颜色变化本身就是判断条件的线索。' },

    { t: 'p', html: '常见的重铬酸根在酸性条件下被还原成 <code>Cr<sup>3+</sup></code>，溶液由橙色变绿色；<code>MnO<sub>4</sub><sup>−</sup></code> 被还原成 <code>Mn<sup>2+</sup></code> 时紫色褪去。这两个颜色变化在滴定里直接用来判断终点，不需要指示剂。把「颜色 ↔ 氧化态」对应起来，实验现象就不再是死记。' },

    { t: 'p', html: '再走一个碱性配平的例子：<code>MnO<sub>4</sub><sup>−</sup></code> 在碱性溶液中氧化 <code>SO<sub>3</sub><sup>2−</sup></code>。还原半反应先写成 <code>MnO<sub>4</sub><sup>−</sup> + 2H<sub>2</sub>O + 3e<sup>−</sup> → MnO<sub>2</sub> + 4OH<sup>−</sup></code>（已把 H<sup>+</sup> 换成 OH<sup>−</sup>），氧化半反应为 <code>SO<sub>3</sub><sup>2−</sup> + 2OH<sup>−</sup> → SO<sub>4</sub><sup>2−</sup> + H<sub>2</sub>O + 2e<sup>−</sup></code>。取 6 个电子配平后合并：<code>2MnO<sub>4</sub><sup>−</sup> + 3SO<sub>3</sub><sup>2−</sup> + H<sub>2</sub>O → 2MnO<sub>2</sub> + 3SO<sub>4</sub><sup>2−</sup> + 2OH<sup>−</sup></code>。检查电荷：左 <code>−2 − 6 = −8</code>，右 <code>−6 − 2 = −8</code>，通过。' },

    { t: 'quiz', qid: 'ch04-q3' },

    { t: 'p', html: '高锰酸钾滴定的经典应用是测草酸根：<code>2MnO<sub>4</sub><sup>−</sup> + 5H<sub>2</sub>C<sub>2</sub>O<sub>4</sub> + 6H<sup>+</sup> → 2Mn<sup>2+</sup> + 10CO<sub>2</sub> + 8H<sub>2</sub>O</code>。反应需加热到约 60 °C 加快速率，但温度过高草酸会分解。滴定终点由紫色不再褪去判断（自身指示剂），第一滴过量就显浅粉。这类「条件 + 现象 + 计量」三合一的题，是实验笔试题的常见形态。' },

    { t: 'h', lvl: 2, text: '七、浓度、稀释与化学计量', id: 'ch04-7' },

    { t: 'p', html: '本章的计算仍是第 3 章那套三步链，只是入口常是浓度：<code>n = cV</code>。例：多少毫升 0.100 mol/L <code>BaCl<sub>2</sub></code> 才能把 25.0 mL 0.200 mol/L <code>Na<sub>2</sub>SO<sub>4</sub></code> 中的硫酸根完全沉淀？硫酸根 <code>5.00 × 10<sup>−3</sup> mol</code>，按 1 : 1 需钡离子同量，故体积 <code>5.00 × 10<sup>−3</sup> / 0.100 = 0.0500 L = 50.0 mL</code>。' },

    { t: 'p', html: '稀释用 <code>c<sub>1</sub>V<sub>1</sub> = c<sub>2</sub>V<sub>2</sub></code>，但要注意「稀释后体积」不等于「加入的溶剂体积」。把 10.0 mL 浓硫酸加入 90.0 mL 水，总体积并不是 100.0 mL，因为混合时体积收缩且放热。准确配制要用容量瓶定容，先加水、再缓慢加酸、冷却、最后定容到刻度。' },

    { t: 'p', html: '混合两种含相同离子的溶液时，浓度要按总体积重算。把 100 mL 0.10 mol/L NaCl 与 100 mL 0.20 mol/L NaCl 混合，<code>n = 0.010 + 0.020 = 0.030 mol</code>，总体积 0.200 L，浓度 <code>0.15 mol/L</code>，不是 0.30。凡是「混合后浓度」，分母一定是总体积；凡是「反应后剩余浓度」，还要先减去反应消耗的量。' },

    { t: 'p', html: '反过来，由浓度求质量也很常见：配制 250.0 mL 0.100 mol/L <code>CuSO<sub>4</sub></code> 溶液，需要多少克五水硫酸铜？<code>n = 0.100 × 0.2500 = 0.0250 mol</code>，用 <code>CuSO<sub>4</sub>·5H<sub>2</sub>O</code> 的式量 249.7，质量 <code>6.24 g</code>。如果直接称无水硫酸铜 4.00 g，浓度会偏大，因为无水盐的摩尔质量只有 159.6。这类题目考的不是公式，而是「你称的是哪种物质」。' },

    { t: 'p', html: '混合还有一类「同离子」情形：把 50.0 mL 0.10 mol/L <code>AgNO<sub>3</sub></code> 与 50.0 mL 0.10 mol/L NaCl 混合，<code>Ag<sup>+</sup></code> 与 <code>Cl<sup>−</sup></code> 各 <code>5.0 × 10<sup>−3</sup> mol</code>，恰好完全沉淀，溶液中只剩 <code>Na<sup>+</sup></code> 与 <code>NO<sub>3</sub><sup>−</sup></code>，浓度各约 <code>0.050 mol/L</code>（总体积 0.100 L）。沉淀本身仍会微量溶解，所以严格说银离子浓度不为零，但定性题里按「完全」处理。' },

    { t: 'p', html: '滴定算浓度是本章与第 3 章的交汇点。取 20.00 mL 未知浓度的盐酸，用 0.1000 mol/L NaOH 滴定，终点耗去 18.50 mL。NaOH <code>1.850 × 10<sup>−3</sup> mol</code>，按 1 : 1 得盐酸同量，浓度 <code>1.850 × 10<sup>−3</sup> / 0.02000 = 0.09250 mol/L</code>。注意有效数字：20.00 与 18.50 都是四位，0.1000 也是四位，结果保留四位。若终点读数只估到 18.5 mL，结果就只能写 0.093 mol/L。' },

    { t: 'callout', kind: 'warn', title: '本章最容易错的四处', html: '① 把醋酸、氨水拆成离子——它们是弱电解质，离子式中保留分子；② 净离子式只删了部分旁观离子，或系数没有约成最简；③ 氧化数把过氧化物中的氧算成 −2；④ 碱性配平只在一边加 OH<sup>−</sup>，导致电荷不平。写完方程式后，务必花十秒数一遍原子与电荷。' },

    { t: 'terms', items: [
      { en: 'precipitate', zh: '沉淀', html: '溶液中离子结合成的难溶固体，从溶液中析出。' },
      { en: 'spectator ion', zh: '旁观离子', html: '反应前后未发生变化、在净离子方程式中被删去的离子。' },
      { en: 'Brønsted acid', zh: 'Brønsted 酸', html: '能给出质子的物质；其共轭碱是给出质子后的剩余部分。' },
      { en: 'amphiprotic', zh: '两性', html: '既能给出质子又能接受质子的物质，如水、碳酸氢根。' },
      { en: 'oxidation number', zh: '氧化数', html: '按约定分配给元素的电荷数，用来判断电子转移方向。' },
      { en: 'disproportionation', zh: '歧化', html: '同一元素既被氧化又被还原的反应，如 Cl<sub>2</sub> 在碱中生成 Cl<sup>−</sup> 与 ClO<sup>−</sup>。' }
    ] },

    { t: 'keypoint', items: [
      { title: '沉淀判断靠交叉组合', html: '把两种溶液的阳离子与阴离子两两配对，查溶解性；硝酸盐、钠钾铵盐全溶。' },
      { title: '净离子式只留真正变化的粒子', html: '可溶强电解质拆、沉淀弱电解质气体不拆；消去旁观离子后检查原子与电荷。' },
      { title: '酸碱看质子，氧化还原看电子', html: 'Brønsted 酸碱看质子转移，氧化数变化看电子转移；两者可能同时发生。' },
      { title: '半反应法配平三步', html: '配原子 → 配电荷（加电子）→ 乘系数消电子；酸性补 H<sup>+</sup>，碱性补 OH<sup>−</sup>。' },
      { title: '混合后浓度用总体积', html: 'n 相加、V 相加，再相除；反应后的剩余量要先减消耗。' }
    ] },

    { t: 'checklist', id: 'ch04', items: [
      '我能判断 AgNO<sub>3</sub> 与 NaCl、KNO<sub>3</sub> 与 NaCl 混合分别有无沉淀',
      '我能把 AgNO<sub>3</sub> + NaCl 写成完全离子式与净离子式，并指出旁观离子',
      '我能说出哪四类物质在离子方程式中不拆，并各举一例',
      '我能判断醋酸钠溶液显碱性的原因，并写出水解方程式',
      '我能算出 K<sub>2</sub>Cr<sub>2</sub>O<sub>7</sub> 中铬的氧化数并说明步骤',
      '我能用半反应法配平酸性条件下 MnO<sub>4</sub><sup>−</sup> 与 Fe<sup>2+</sup> 的反应',
      '我能说出高锰酸钾在酸性、中性、碱性条件下产物颜色的差别',
      '我能算出沉淀 25.0 mL 0.200 mol/L 硫酸根所需 BaCl<sub>2</sub> 的体积',
      '我能解释为什么混合后浓度要用总体积，而不是取平均'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应 Chemistry: The Central Science 15th Edition（SI Units）第 4 章：水溶液中的电解质、沉淀反应与溶解性规则、离子方程式、Brønsted 酸碱、氧化还原与氧化数、半反应配平。溶度积、缓冲溶液、滴定曲线与 pH 计算放到后续的分析化学课程；本章只做定性判断与基础计量。溶解性表中的「微溶」按教材惯例处理，不同教材对 CaSO<sub>4</sub> 的归类可能略有差异。' }
  ]
});
