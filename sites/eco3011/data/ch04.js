/* =====================================================================
 * ch04.js · 第 4 章「技术、成本与利润」
 * 职责：从消费者切换到厂商——先描述技术（生产函数），再把技术翻译成成本
 *       （成本函数），最后用成本解出利润最大化的产量与供给。
 * 承接：ch02 的最优化模板；为 ch05 的市场供给、ch06 的垄断定价提供成本底座。
 * 依据：Varian 第 8 版第 18–21 章（技术、成本最小化、成本曲线、厂商供给）。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch04',
  num: '04',
  title: '技术、成本与利润',
  en: 'TECHNOLOGY, COST, PROFIT',
  goals: [
    '用生产函数与等产量线描述技术，并区分短期与长期',
    '计算边际产品与边际技术替代率，说明边际报酬递减的含义',
    '判断规模报酬的三种类型，并说明它与边际报酬递减不是一回事',
    '用等成本线与相切条件解出成本最小化的投入组合',
    '由成本函数推出平均成本、边际成本，并解释它们与供给曲线的关系'
  ],
  kp: [
    { id: 'ch04-1', title: '生产函数：把技术写成投入与产出的关系' },
    { id: 'ch04-2', title: '短期与长期：固定投入与可变投入' },
    { id: 'ch04-3', title: '边际产品与边际技术替代率' },
    { id: 'ch04-4', title: '规模报酬：三种类型与判别' },
    { id: 'ch04-5', title: '成本最小化：等成本线与相切' },
    { id: 'ch04-6', title: '成本函数与成本曲线族' },
    { id: 'ch04-7', title: '利润最大化与厂商供给' },
    { id: 'ch04-8', title: '常见错误与自检' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么先讲技术再讲成本', html: '很多同学把「成本」理解成会计账本上的数字，于是成本函数成了背下来的曲线。但在经济学里，<b>成本是技术的影子</b>：给定要素价格，用最省的方式生产某个产量需要花多少钱，这个最小值就是成本函数。所以必须先有生产函数，才能谈成本；先有成本，才能谈利润最大化。<code>MC = MR</code> 这个条件之所以成立，是因为它背后有一整套「技术 → 成本 → 供给」的推导链条。跳过前面直接背结论，遇到「要素价格变化，供给怎么变」就答不上来。' },

    { t: 'p', lead: true, html: '厂商问题与消费者问题结构相同，只是目标从「最大化效用」换成「最大化利润」，约束从「预算」换成「技术」。本章按三步走：<b>第一步描述技术</b>（生产函数、等产量线、规模报酬）；<b>第二步把技术翻译成成本</b>（成本最小化、成本函数）；<b>第三步用成本做决策</b>（利润最大化、供给曲线）。这三步是后面三章的共同骨架，ch05 加总市场、ch06 引入市场势力、ch07 讨论效率，都在这条链上做文章。' },

    { t: 'h', lvl: 2, text: '一、生产函数：把技术写成投入与产出的关系', id: 'ch04-1' },

    { t: 'p', html: '厂商把投入（inputs）变成产出（output）。给定技术水平，最大可能产出与投入之间的关系叫<b>生产函数</b>（production function）：<code>q = f(x1, x2)</code>，其中 <code>q</code> 是产量，<code>x1, x2</code> 是两种要素（典型是劳动 <code>L</code> 与资本 <code>K</code>）。它描述的是<b>技术上的效率边界</b>——同样的投入，达不到这个产出就是浪费。' },

    { t: 'p', html: '与无差异曲线对应，生产函数有<b>等产量线</b>（isoquant）：<code>f(x1, x2) = q̄</code> 的轨迹，表示生产同一产量的所有投入组合。等产量线通常向下倾斜、凸向原点，理由与无差异曲线相同：多用一个工人就要少用一点机器才能保持产量不变；而且替代越来越难（凸性）。区别在于：无差异曲线的位置是主观偏好，等产量线的位置是客观技术——后者可以被工程师测量出来。' },

    { t: 'p', html: '生产函数的常见形式有四类，与 ch01 的效用函数一一对应。<b>Cobb-Douglas</b>：<code>q = A L<sup>α</sup>K<sup>β</sup></code>，最常用；<b>固定比例（列昂惕夫）</b>：<code>q = min(L/a, K/b)</code>，要素不能替代；<b>完全替代</b>：<code>q = aL + bK</code>；<b>CES</b>：<code>q = (aL<sup>ρ</sup> + bK<sup>ρ</sup>)<sup>1/ρ</sup></code>，把前几种作为特例。' },

    { t: 'table', caption: '四类生产函数：形式、等产量线、典型行业', head: ['类型', '函数形式', '等产量线形状', '典型行业'], rows: [
      ['Cobb-Douglas', '<code>q = A L<sup>α</sup>K<sup>β</sup></code>', '双曲线，凸向原点', '制造业的总体描述'],
      ['固定比例', '<code>q = min(L/a, K/b)</code>', 'L 形折线', '化工配方、装配线'],
      ['完全替代', '<code>q = aL + bK</code>', '直线', '同质化的外包工序'],
      ['CES', '<code>q = (aL<sup>ρ</sup> + bK<sup>ρ</sup>)<sup>1/ρ</sup></code>', '介于前两者之间', '宏观生产函数的估计']
    ] },

    { t: 'h', lvl: 2, text: '二、短期与长期：固定投入与可变投入', id: 'ch04-2' },

    { t: 'p', html: '「短期」与「长期」不是日历时间，而是<b>有多少要素可以调整</b>。短期内至少有一种要素固定（通常是资本 <code>K̄</code>），厂商只能调整劳动；长期内所有要素都可变，还可以进出行业。这个区分之所以重要，是因为它决定了成本曲线的形状：短期有固定成本，长期没有。' },

    { t: 'p', html: '短期生产函数记作 <code>q = f(L, K̄)</code>。随着 <code>L</code> 增加，总产量先加速上升、再减速上升、最后可能下降。<b>边际产品</b>（marginal product）<code>MP_L = ∂f/∂L</code> 是「多雇一个工人带来的额外产量」，<b>平均产品</b>（average product）<code>AP_L = q/L</code> 是「人均产量」。两者关系是本章最重要的几何事实：<b><code>MP</code> 曲线穿过 <code>AP</code> 曲线的最高点</b>——<code>MP &gt; AP</code> 时 <code>AP</code> 上升，<code>MP &lt; AP</code> 时 <code>AP</code> 下降，相等时 <code>AP</code> 取最大值。' },

    { t: 'p', html: '为什么？用一句话证明：<code>d(q/L)/dL = (L·MP − q)/L<sup>2</sup> = (MP − AP)/L</code>。导数的符号完全由 <code>MP − AP</code> 的符号决定。这个证明在考试里经常直接考，值得记住推导而不是结论。' },

    { t: 'p', html: '<b>边际报酬递减</b>（diminishing marginal returns）指短期内固定要素不变、不断追加可变要素时，<code>MP</code> 最终会下降。原因是固定要素被「稀释」：一台机器配一个工人效率很高，配十个工人就要排队。注意它是<b>短期</b>概念，长期所有要素都可调整时不存在「递减」——那属于规模报酬的范畴。' },

    { t: 'h', lvl: 2, text: '三、边际产品与边际技术替代率', id: 'ch04-3' },

    { t: 'p', html: '等产量线的斜率叫<b>边际技术替代率</b>（marginal rate of technical substitution，MRTS）：<code>MRTS = −dK/dL</code>（沿同一条等产量线）。含义是：<b>为了多用一单位劳动，可以少用多少资本而保持产量不变。</b>与 MRS 一样，它可以写成边际产品之比：对 <code>f(L,K) = q̄</code> 全微分得 <code>MP_L·dL + MP_K·dK = 0</code>，所以 <code>MRTS = MP_L/MP_K</code>。' },

    { t: 'p', html: '这个式子在做题时非常有用：给定 Cobb-Douglas <code>q = L<sup>0.5</sup>K<sup>0.5</sup></code>，<code>MP_L = 0.5(K/L)<sup>0.5</sup></code>，<code>MP_K = 0.5(L/K)<sup>0.5</sup></code>，相除得 <code>MRTS = K/L</code>。要与要素价格比 <code>w/r</code> 相等，得到 <code>K/L = w/r</code>，即 <code>rK = wL</code>——成本在两种要素上平均分配。这与 Cobb-Douglas 效用函数下支出份额恒定是同一个数学事实。' },

    { t: 'p', html: 'MRTS 递减是等产量线凸向原点的微分表达：随着劳动不断增加、资本不断减少，<code>MP_L</code> 下降（边际报酬递减）、<code>MP_K</code> 上升（资本变得稀缺），比值 <code>MP_L/MP_K</code> 递减。所以等产量线越来越平。若技术是固定比例，等产量线是 L 形，折点处 MRTS 无定义；若完全替代，MRTS 是常数，等产量线是直线。' },

    { t: 'steps', items: [
      { title: '第一步：确认目标产量', html: '等产量线对应一个固定的 <code>q̄</code>。若题目给的是「扩大生产」，那属于规模报酬问题，不是 MRTS。' },
      { title: '第二步：求两个边际产品', html: '对 <code>L</code>、<code>K</code> 分别求偏导。Cobb-Douglas 的偏导会产生负指数，整理时先提取公因子。' },
      { title: '第三步：相除得 MRTS', html: '<code>MRTS = MP_L/MP_K</code>。检查量纲：分子分母都是「产量/单位要素」，相除后是「资本/劳动」，符合替代率的含义。' },
      { title: '第四步：与要素价格比联立', html: '成本最小化要求 <code>MRTS = w/r</code>，加上产量约束 <code>f(L,K) = q̄</code>，两个方程解出 <code>L, K</code>。' }
    ] },

    { t: 'quiz', qid: 'ch04-q1' },

    { t: 'h', lvl: 2, text: '四、规模报酬：三种类型与判别', id: 'ch04-4' },

    { t: 'p', html: '规模报酬（returns to scale）问的是：<b>把所有要素同比例放大 <code>t</code> 倍，产量会放大多少倍？</b>若 <code>f(tL, tK) = t·f(L,K)</code>，是<b>规模报酬不变</b>（CRS）；若大于 <code>t</code> 倍，是<b>递增</b>（IRS）；若小于 <code>t</code> 倍，是<b>递减</b>（DRS）。判别方法很直接：把 <code>t</code> 代入函数，提出公因子，看指数。' },

    { t: 'p', html: '以 Cobb-Douglas <code>q = AL<sup>α</sup>K<sup>β</sup></code> 为例：<code>f(tL, tK) = A t<sup>α+β</sup>L<sup>α</sup>K<sup>β</sup> = t<sup>α+β</sup>q</code>。所以 <b><code>α + β = 1</code> 时 CRS，大于 1 时 IRS，小于 1 时 DRS。</b>这个「指数和」判据只对 Cobb-Douglas 成立，其他函数要老老实实代入。' },

    { t: 'p', html: '规模报酬与边际报酬递减<b>不是一回事</b>，这是最常考的概念辨析。边际报酬递减是「固定一种要素、增加另一种」，规模报酬是「所有要素同比例增加」。一个生产函数可以同时有边际报酬递减与规模报酬递增：Cobb-Douglas 的 <code>α &lt; 1</code> 保证劳动边际报酬递减，<code>α + β &gt; 1</code> 又是规模报酬递增。两者不矛盾，因为比较的对象不同。' },

    { t: 'table', caption: '规模报酬三种类型：条件、几何、经济后果', head: ['类型', '条件', '等产量线间距', '经济后果'], rows: [
      ['递增', '<code>f(tx) &gt; t f(x)</code>', '随产量增加而变密', '大厂有成本优势，易形成自然垄断'],
      ['不变', '<code>f(tx) = t f(x)</code>', '等距', '竞争性行业的标准假设'],
      ['递减', '<code>f(tx) &lt; t f(x)</code>', '随产量增加而变疏', '管理成本上升，小厂更灵活']
    ] },

    { t: 'p', html: '规模报酬为什么重要？因为它决定了长期平均成本曲线的形状。规模报酬递增对应长期平均成本下降（规模经济），不变对应水平，递减对应上升。而长期平均成本的形状又决定了行业结构：<b>规模经济强的行业天然趋向垄断或寡头</b>（自来水、电网），规模报酬不变的行业适合完全竞争（服装、餐饮）。这条逻辑链在 ch05 与 ch06 会反复用到。' },

    { t: 'h', lvl: 2, text: '五、成本最小化：等成本线与相切', id: 'ch04-5' },

    { t: 'p', html: '给定要素价格 <code>w</code>（工资）、<code>r</code>（资本租金），生产 <code>q̄</code> 的最小成本是多少？这又是一个约束最优化问题：<b>最小化 <code>wL + rK</code>，约束 <code>f(L,K) = q̄</code></b>。它的几何与 ch02 完全同构，只是「预算线」换成了<b>等成本线</b>（isocost line）：<code>wL + rK = C</code>，斜率 <code>−w/r</code>，截距 <code>C/r</code>。' },

    { t: 'p', html: '最优解在等产量线与等成本线相切处：<code>MRTS = w/r</code>，即 <code>MP_L/MP_K = w/r</code>。改写成 <code>MP_L/w = MP_K/r</code>，含义很清楚：<b>每一元钱花在劳动上带来的产量增量，等于花在资本上的产量增量</b>。若不相等，就把钱从产出效率低的那边挪到高的那边，成本还能降。这个条件与 ch02 的 <code>MU1/p1 = MU2/p2</code> 是同一句话。' },

    { t: 'p', html: '解出来的 <code>L(w, r, q)</code>、<code>K(w, r, q)</code> 叫<b>条件要素需求</b>（conditional factor demand）。「条件」二字指它依赖于目标产量 <code>q</code>，而不是利润最大化的产量。这一点很容易混：条件要素需求是「为了生产 q，最省的投入组合」；ch04 后面的要素需求是「为了最大化利润，选多少产量」。两者在完全竞争下最终一致，但推导路径不同。' },

    { t: 'p', html: '以 <code>q = L<sup>0.5</sup>K<sup>0.5</sup></code> 为例。相切条件给出 <code>K/L = w/r</code>，即 <code>rK = wL</code>。代入产量约束：<code>q = (L·(w/r)L)<sup>0.5</sup> = L(w/r)<sup>0.5</sup></code>，所以 <code>L = q(r/w)<sup>0.5</sup></code>、<code>K = q(w/r)<sup>0.5</sup></code>。成本 <code>C = wL + rK = 2q(wr)<sup>0.5</sup></code>。这个成本函数对 <code>q</code> 是线性的——正是规模报酬不变的表现。' },

    { t: 'callout', kind: 'warn', title: '相切条件失效的三种情形', html: '与 ch02 一样，<code>MRTS = w/r</code> 只适用于内点解。<b>固定比例技术</b>的最优解在折点上，用比例条件 <code>L/a = K/b = q</code> 求解；<b>完全替代技术</b>的最优解在角点，比较 <code>MP_L/w</code> 与 <code>MP_K/r</code>，哪边大就全用哪边；<b>要素不可分割</b>（整数约束）时，解可能不在切点上，要枚举邻近的整数组合。' },

    { t: 'h', lvl: 2, text: '六、成本函数与成本曲线族', id: 'ch04-6' },

    { t: 'p', html: '把条件要素需求代回成本式，得到<b>成本函数</b> <code>C(w, r, q)</code>：给定要素价格，生产 <code>q</code> 的最小总成本。它有三个性质：对 <code>q</code> 递增、对要素价格递增且一次齐次（要素价格同比例上升，成本同比例上升）、对 <code>q</code> 是凹的（因为可以调整投入组合，成本增长慢于线性）。' },

    { t: 'p', html: '由成本函数派生出四条曲线，考试必须能画能算。<b>总成本</b> <code>TC = C(q)</code>；<b>平均成本</b> <code>AC = C(q)/q</code>；<b>边际成本</b> <code>MC = C′(q)</code>；短期还要加<b>平均可变成本</b> <code>AVC = VC(q)/q</code> 与<b>平均固定成本</b> <code>AFC = FC/q</code>。它们的关系是本章的几何核心。' },

    { t: 'p', html: '三条关键关系。<b>第一，<code>MC</code> 穿过 <code>AC</code> 的最低点。</b>证明与 <code>MP</code>/<code>AP</code> 相同：<code>d(C/q)/dq = (MC − AC)/q</code>，符号由 <code>MC − AC</code> 决定。<b>第二，<code>AC = AVC + AFC</code></b>，<code>AFC</code> 随产量单调下降，所以 <code>AC</code> 与 <code>AVC</code> 的差距越来越小。<b>第三，<code>MC</code> 穿过 <code>AVC</code> 的最低点</b>，理由同上。这三条合起来，就是教科书上那张「U 形成本曲线」图。' },

    { t: 'table', caption: '四条成本曲线：定义、形状、相互关系', head: ['曲线', '定义', '形状', '关系'], rows: [
      ['<code>TC</code>', '<code>C(q)</code>', '先凹后凸（先递减后递增的 MC）', '斜率是 MC'],
      ['<code>AC</code>', '<code>TC/q</code>', 'U 形', 'MC 穿过其最低点'],
      ['<code>MC</code>', '<code>dTC/dq</code>', 'U 形，最低点早于 AC', '决定供给曲线的上升段'],
      ['<code>AVC</code>', '<code>VC/q</code>', 'U 形，位于 AC 下方', 'MC 穿过其最低点；停产点']
    ] },

    { t: 'p', html: '为什么短期成本曲线是 U 形？因为短期有固定成本。产量很低时，固定成本被少量产品分摊，<code>AC</code> 很高；随着产量增加，固定成本被摊薄，<code>AC</code> 下降；但边际报酬递减最终使 <code>MC</code> 上升，拉起 <code>AC</code>。所以 U 形是「固定成本摊薄」与「边际报酬递减」两股力量拉扯的结果。长期没有固定成本，<code>AC</code> 的形状完全由规模报酬决定：递增则下降，不变则水平，递减则上升。' },

    { t: 'quiz', qid: 'ch04-q2' },

    { t: 'h', lvl: 2, text: '七、利润最大化与厂商供给', id: 'ch04-7' },

    { t: 'p', html: '利润是收入减成本：<code>π(q) = p·q − C(q)</code>。最大化的一阶条件是 <code>p = MC(q)</code>，二阶条件要求 <code>MC</code> 上升（即 <code>C″ &gt; 0</code>）。这个条件的经济含义：<b>多生产一单位的收入（价格）恰好等于多生产一单位的成本（边际成本）</b>。若 <code>p &gt; MC</code>，多生产能增利润；若 <code>p &lt; MC</code>，少生产能增利润。' },

    { t: 'p', html: '但 <code>p = MC</code> 只是必要条件，还要检查<b>是否值得生产</b>。短期只要价格高于 <code>AVC</code> 的最低点，生产就比停产好——因为固定成本已经沉没，只要覆盖可变成本就能减少亏损。价格低于 <code>AVC</code> 最低点时，生产越多亏越多，应该<b>停产</b>（shut down）。长期则要求价格不低于 <code>AC</code> 的最低点，否则厂商退出行业（exit）。' },

    { t: 'p', html: '于是供给曲线是<b>分段</b>的：价格高于 <code>AVC</code> 最低点时，供给量由 <code>p = MC</code> 决定，即 <code>MC</code> 曲线在 <code>AVC</code> 最低点以上的部分；价格低于该点时，供给量为零。长期供给曲线是 <code>MC</code> 在 <code>AC</code> 最低点以上的部分。这条分段曲线是 ch05 加总市场供给的基础。' },

    { t: 'p', html: '长期均衡还有一个「零利润」条件。若行业可自由进出，正利润会吸引新厂商进入，价格被压到 <code>AC</code> 最低点，经济利润为零。注意「零利润」不等于「不赚钱」：会计利润仍为正，因为成本里已经包含了资本的机会成本（正常利润）。这个概念区分在考试里经常设陷阱。' },

    { t: 'compare', left: { title: '短期：停产但不退出', html: '固定成本沉没，只要 <code>p ≥ min AVC</code> 就继续生产。厂商亏损但仍比停产好，因为停产要照付固定成本。' }, right: { title: '长期：退出或进入', html: '所有成本可变，<code>p &lt; min AC</code> 就退出。长期均衡时 <code>p = min AC</code>，经济利润为零，没有进入或退出的激励。' } },

    { t: 'quiz', qid: 'ch04-q3' },

    { t: 'h', lvl: 2, text: '八、常见错误与自检', id: 'ch04-8' },

    { t: 'p', html: '本章的错误集中在「短期与长期混用」和「把会计成本当经济成本」两处。下面四条是批改时最常见的。' },

    { t: 'table', caption: '四个高频错误与修正', head: ['错误做法', '为什么错', '正确做法'], rows: [
      ['认为长期也有固定成本', '长期所有要素可调整', '长期 <code>FC = 0</code>，<code>AC</code> 由规模报酬决定'],
      ['把边际报酬递减当规模报酬递减', '前者固定其他要素，后者所有要素同比例变', '分别检查 <code>∂MP/∂L</code> 与 <code>f(tx)</code> 与 <code>t f(x)</code>'],
      ['价格低于 AC 就立刻停产', '短期只要高于 AVC 就该继续生产', '区分停产点（AVC）与退出点（AC）'],
      ['用会计成本算经济利润', '漏掉了自有资本与自有劳动的机会成本', '经济成本 = 显性成本 + 隐性成本']
    ] },

    { t: 'p', html: '自检方法与前面章节一致，用特例验算。取 <code>C(q) = q<sup>2</sup></code>，则 <code>MC = 2q</code>、<code>AC = q</code>，<code>MC</code> 在 <code>q = 0</code> 处「穿过」<code>AC</code> 的最低点（边界情形）；取 <code>C(q) = 4 + q<sup>2</sup></code>，<code>AC</code> 最低点在 <code>q = 2</code>，验证 <code>MC(2) = 4 = AC(2)</code>。若算出的交点不满足这个等式，说明求导或配方出错。' },

    { t: 'keypoint', items: [
      { title: '生产函数是技术边界', html: '<code>q = f(L,K)</code>，等产量线对应固定产量，凸性来自 MRTS 递减。' },
      { title: 'MP 穿过 AP 的最高点', html: '<code>d(q/L)/dL = (MP − AP)/L</code>，符号由两者之差决定。' },
      { title: '规模报酬看指数和', html: 'Cobb-Douglas 下 <code>α+β</code> 与 1 比较；与边际报酬递减不是一回事。' },
      { title: '成本最小化的相切条件', html: '<code>MP_L/MP_K = w/r</code>，等价于每元钱的边际产量相等。' },
      { title: 'MC 穿过 AC 与 AVC 的最低点', html: '因为 <code>d(C/q)/dq = (MC − AC)/q</code>。' },
      { title: '供给曲线的分段', html: '<code>p ≥ min AVC</code> 时由 <code>p = MC</code> 给出，否则供给为零。' }
    ] },

    { t: 'checklist', id: 'ch04', items: [
      '我能写出生产函数与等产量线，并说明两者的关系',
      '我能区分短期与长期，并说出固定成本在两者中的差别',
      '我能推导 MP 与 AP 的关系，并画出两者的曲线',
      '我能计算 MRTS，并说明它为什么等于边际产品之比',
      '我能判断规模报酬的类型，并说明它与边际报酬递减的区别',
      '我能用等成本线与相切条件解出成本最小化的投入组合',
      '我能由成本函数推出 AC、MC、AVC，并画出 U 形曲线',
      '我能说明 MC 为什么穿过 AC 的最低点',
      '我能写出利润最大化的一阶与二阶条件',
      '我能区分停产点与退出点，并画出分段供给曲线'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 Varian《Intermediate Microeconomics: A Modern Approach》第 8 版第 18–21 章（技术、成本最小化、成本曲线、厂商供给）组织，覆盖生产函数与等产量线、短期与长期、边际产品与 MRTS、规模报酬、成本最小化与条件要素需求、成本曲线族、利润最大化与分段供给曲线。教材文件为课程资料中的 <code>学习资料/ECO3011_Intermediate_Microeconomics_A_Modern_Approach_8th_Edition.pdf</code>。本章的 <code>MC</code> 曲线是 ch05 市场供给曲线的直接来源，<code>AC</code> 与规模经济是 ch06 自然垄断讨论的前提，建议把「成本最小化」与「利润最大化」两个最优化问题对照记忆。' }
  ]
});
