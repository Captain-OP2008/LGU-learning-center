/* =====================================================================
 * ch02.js · 第 2 章「变号级数与幂级数」
 * 教材对应：Thomas 第 10 章（10.5–10.7）：交错级数、绝对收敛、
 * 比值与根值判别、幂级数。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch02',
  num: '02',
  title: '变号级数与幂级数',
  en: 'ALTERNATING SERIES AND POWER SERIES',
  goals: [
    '区分绝对收敛与条件收敛，并说明为什么这个区分决定了能不能重排',
    '用交错级数判别法判断收敛，并用首项界估计截断误差',
    '在比值判别与根值判别之间选择，并处理极限等于 1 的失效情形',
    '用比值法求幂级数的收敛半径，再逐个端点单独判定',
    '对幂级数逐项求导、逐项积分，并说明为什么在收敛区间内部合法'
  ],
  kp: [
    { id: 'ch02-1', title: '绝对收敛与条件收敛' },
    { id: 'ch02-2', title: '交错级数与误差界' },
    { id: 'ch02-3', title: '比值判别法' },
    { id: 'ch02-4', title: '根值判别法' },
    { id: 'ch02-5', title: '幂级数与收敛半径' },
    { id: 'ch02-6', title: '端点判定与收敛区间' },
    { id: 'ch02-7', title: '幂级数的运算与求和' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么「去掉符号」是一个关键动作', html: 'ch01 的所有判别法都假设通项非负：比较判别要有不等式，积分判别要有正值。一旦通项开始变号，这些工具全部失效——你不能说「<code>a<sub>n</sub></code> 比 <code>b<sub>n</sub></code> 小」因为负数更小反而更容易收敛。处理办法只有一个：<b>先取绝对值，把变号级数拉回 ch01 的领地</b>；如果取绝对值后发散，再单独研究符号带来的抵消。这个「先绝对、后条件」的两段式，就是本章前半部分的主线。后半部分把同样的思路搬到函数项级数上：幂级数在收敛半径内绝对收敛，于是可以逐项求导、逐项积分。' },

    { t: 'p', lead: true, html: '本章有两个目标。第一个是<b>把变号级数分类</b>：绝对收敛的级数性质最好（可重排、可逐项相乘），条件收敛的级数只有「按原顺序求和」这一条性质，重排后可以收敛到任意值。第二个是<b>把级数看成函数</b>：幂级数 <code>Σc<sub>n</sub>(x − a)<sup>n</sup></code> 的收敛点集一定是一个以 a 为中心的区间，区间内部可以随便求导积分，端点必须单独验。' },

    { t: 'h', lvl: 2, text: '一、绝对收敛与条件收敛', id: 'ch02-1' },

    { t: 'p', html: '设 <code>Σa<sub>n</sub></code> 是任意项级数。<b>若 <code>Σ|a<sub>n</sub>|</code> 收敛，则称原级数绝对收敛</b>；<b>若原级数收敛但 <code>Σ|a<sub>n</sub>|</code> 发散，则称条件收敛</b>。这两类之间有一条硬定理：<b>绝对收敛必收敛</b>。证明用柯西准则：<code>|Σ<sub>k=m</sub><sup>n</sup> a<sub>k</sub>| ≤ Σ<sub>k=m</sub><sup>n</sup> |a<sub>k</sub>|</code>，右边可以被任意小的 ε 控制。' },

    { t: 'p', html: '两类级数的差别不在「和是多少」，而在「和是否稳定」。绝对收敛的级数可以任意重排、可以拆成两个收敛的正项级数之差，和不变；条件收敛的级数一旦改变求和顺序，和就可能改变。黎曼重排定理说得很彻底：条件收敛级数经过适当重排，可以收敛到任何指定的实数，甚至发散。这就是为什么「无限项相加不满足交换律」——交换律只在绝对收敛时成立。' },

    { t: 'p', html: '经典例子是交错调和级数 <code>Σ(−1)<sup>n−1</sup>/n</code>。它收敛（下一节的交错判别），但取绝对值后是调和级数，发散。所以它是条件收敛。而 <code>Σ(−1)<sup>n−1</sup>/n<sup>2</sup></code> 取绝对值后是 p = 2 的 p-级数，收敛，所以它绝对收敛。判断顺序永远是：<b>先看绝对值级数，能判就判；判不了再回到原级数用交错判别</b>。' },

    { t: 'compare', left: { title: '绝对收敛：性质齐全', html: '可任意重排而不改变和；可拆成两个收敛正项级数之差；两个绝对收敛级数的柯西乘积仍绝对收敛；在幂级数里对应「收敛半径内部」。它是「无条件收敛」。' }, right: { title: '条件收敛：只按原顺序', html: '重排会改变和（黎曼定理）；不能随意拆项或结合；交错判别给出的误差界依赖「从第一项起按序相加」。它是「有条件收敛」，条件就是顺序。' } },

    { t: 'callout', kind: 'warn', title: '重排陷阱的具体样子', html: '把 <code>1 − 1/2 + 1/3 − 1/4 + …</code> 按「两正一负」重排：<code>1 + 1/3 − 1/2 + 1/5 + 1/7 − 1/4 + …</code>，新级数收敛到原值的 <code>3/2</code> 倍。这不是计算错误，而是条件收敛的定义性缺陷。考试若问「下列重排是否合法」，判断依据只有一条：原级数是否绝对收敛。' },

    { t: 'h', lvl: 2, text: '二、交错级数与误差界', id: 'ch02-2' },

    { t: 'p', html: '<b>交错级数判别法</b>：若 <code>b<sub>n</sub> &gt; 0</code>、<code>b<sub>n</sub></code> 单调递减、且 <code>b<sub>n</sub> → 0</code>，则 <code>Σ(−1)<sup>n−1</sup>b<sub>n</sub></code> 收敛。三个条件同样缺一不可：只趋于 0 而不单调时可能发散，例如把 <code>1/n</code> 的项打乱成「一小一大」的交替序列，通项仍趋于 0 但部分和在两个值之间跳。' },

    { t: 'p', html: '这个判别法附带一个非常好用的误差界：若级数满足上述条件、和为 S、第 N 部分和为 <code>S<sub>N</sub></code>，则 <code>|S − S<sub>N</sub>| ≤ b<sub>N+1</sub></code>，而且误差的符号与下一项相同。也就是说，<b>用前 N 项近似，误差不超过第 N+1 项的绝对值</b>。这是本课少数几个「免费的」误差估计，考试里凡是要求「精确到 10<sup>−k</sup>」的交错级数，都用它。' },

    { t: 'p', html: '例：用 <code>Σ(−1)<sup>n−1</sup>/n</code> 近似 ln 2，要求误差小于 <code>10<sup>−3</sup></code>。由 <code>b<sub>N+1</sub> = 1/(N+1) &lt; 10<sup>−3</sup></code> 得 <code>N &gt; 999</code>，即需要 1000 项。这个结果说明交错调和级数收敛得极慢，实际计算 ln 2 要用别的展开（ch03 会给出更快的方法）。' },

    { t: 'table', head: ['判别法', '适用对象', '结论', '失效情形'], rows: [
      ['交错级数判别', '<code>Σ(−1)<sup>n</sup>b<sub>n</sub></code>，<code>b<sub>n</sub></code> 正、减、趋 0', '收敛，且 <code>|R<sub>N</sub>| ≤ b<sub>N+1</sub></code>', '<code>b<sub>n</sub></code> 不单调'],
      ['绝对值判别', '任意项级数', '<code>Σ|a<sub>n</sub>|</code> 收敛 ⇒ 原级数绝对收敛', '绝对值级数发散时无结论，需另判'],
      ['比值判别', '含阶乘、n 次方、连乘', '<code>L &lt; 1</code> 绝对收敛，<code>L &gt; 1</code> 发散', '<code>L = 1</code> 完全失效'],
      ['根值判别', '通项是整体的 n 次方', '<code>L &lt; 1</code> 绝对收敛，<code>L &gt; 1</code> 发散', '<code>L = 1</code> 完全失效'],
      ['p-级数比较', '有理式、根号', '按幂次判敛散', '变号时须先取绝对值']
    ], caption: '比值与根值判别的 L = 1 不是「收敛」，是「不知道」，必须换工具' },

    { t: 'h', lvl: 2, text: '三、比值判别法', id: 'ch02-3' },

    { t: 'p', html: '对任意项级数 <code>Σa<sub>n</sub></code>（<code>a<sub>n</sub> ≠ 0</code>），令 <code>L = lim |a<sub>n+1</sub>/a<sub>n</sub>|</code>。若 <code>L &lt; 1</code>，级数绝对收敛；若 <code>L &gt; 1</code>（含 <code>L = ∞</code>），级数发散；若 <code>L = 1</code>，判别法失效。它的原理是「与几何级数比较」：<code>L &lt; 1</code> 时从某项起 <code>|a<sub>n+1</sub>| ≤ r|a<sub>n</sub>|</code>（取 <code>L &lt; r &lt; 1</code>），于是尾部被几何级数控制。' },

    { t: 'p', html: '比值判别最适合通项里出现<b>阶乘、双阶乘、n 的 n 次方、常数 n 次方</b>的场合，因为除法能把这些结构大幅约掉。例：<code>Σ n!/n<sup>n</sup></code>，<code>|a<sub>n+1</sub>/a<sub>n</sub>| = (n+1)!/(n+1)<sup>n+1</sup> · n<sup>n</sup>/n! = (n/(n+1))<sup>n</sup> → 1/e &lt; 1</code>，收敛。这类题目用 p-级数比较几乎无从下手，用比值一行就完。' },

    { t: 'p', html: '失效的例子也要记住：<code>Σ1/n</code> 的比值极限是 1 但发散，<code>Σ1/n<sup>2</sup></code> 的比值极限也是 1 但收敛。所以 <code>L = 1</code> 时不能下任何结论。遇到这种情况，说明通项是幂律型，应当改用 p-级数比较或积分判别。考试里如果比值算出 1 就停笔写「收敛」，那是零分。' },

    { t: 'callout', kind: 'tip', title: '算比值时的三个化简技巧', html: '<b>一、</b>阶乘相除先写成连乘：<code>(n+1)!/n! = n+1</code>，<code>(2n+2)!/(2n)! = (2n+2)(2n+1)</code>。<br><b>二、</b>把 <code>(1 + 1/n)<sup>n</sup></code> 认出来就是 <code>e</code>，别展开。<br><b>三、</b>含 <code>n</code> 次方时先取对数再算极限，比直接求幂快。若比值里出现 <code>n<sup>n</sup>/(n+1)<sup>n</sup></code>，写成 <code>(n/(n+1))<sup>n</sup> = 1/(1 + 1/n)<sup>n</sup></code> 立刻得 <code>1/e</code>。' },

    { t: 'h', lvl: 2, text: '四、根值判别法', id: 'ch02-4' },

    { t: 'p', html: '令 <code>L = lim <sup>n</sup>√|a<sub>n</sub>|</code>，结论与比值判别完全平行：<code>L &lt; 1</code> 绝对收敛，<code>L &gt; 1</code> 发散，<code>L = 1</code> 失效。它的原理是把通项写成 <code>|a<sub>n</sub>| = (|a<sub>n</sub>|<sup>1/n</sup>)<sup>n</sup></code>，一旦括号里的东西趋于 L，整体就像 <code>L<sup>n</sup></code>。' },

    { t: 'p', html: '什么时候用根值而不用比值？<b>通项整体是一个 n 次方时</b>。例：<code>Σ(1 − 1/n)<sup>n<sup>2</sup></sup></code>，比值会算出一堆幂，根值直接得 <code>(1 − 1/n)<sup>n</sup> → 1/e &lt; 1</code>，收敛。反之，通项是连乘或阶乘时根值要开 n 次方，往往要用斯特林公式，不如比值。经验：<b>结构在指数上选根值，结构在乘积上选比值</b>。' },

    { t: 'p', html: '两个判别法的强弱关系值得一提：<b>比值判别能判的，根值判别一定能判，反之不然</b>。也就是说根值判别更强。但比值通常更好算，所以做题仍以比值为先。证明思路是柯西第二极限定理：若 <code>|a<sub>n+1</sub>/a<sub>n</sub>| → L</code>，则 <code>|a<sub>n</sub>|<sup>1/n</sup> → L</code>，反之不成立。' },

    { t: 'h', lvl: 2, text: '五、幂级数与收敛半径', id: 'ch02-5' },

    { t: 'p', html: '形如 <code>Σ<sub>n=0</sub><sup>∞</sup> c<sub>n</sub>(x − a)<sup>n</sup></code> 的级数叫<b>幂级数</b>，<code>a</code> 是中心，<code>c<sub>n</sub></code> 是系数。把它看成 x 的函数，收敛点集有极强的结构：<b>存在 <code>R ∈ [0, ∞]</code>，使得 <code>|x − a| &lt; R</code> 时绝对收敛，<code>|x − a| &gt; R</code> 时发散</b>。R 叫收敛半径，区间 <code>(a − R, a + R)</code> 叫收敛开区间。端点 <code>x = a ± R</code> 是唯一的灰色地带，必须代回原级数单独判。' },

    { t: 'p', html: '求 R 的标准做法：令 <code>u<sub>n</sub> = c<sub>n</sub>(x − a)<sup>n</sup></code>，用比值判别 <code>lim |u<sub>n+1</sub>/u<sub>n</sub>| = |x − a| · lim |c<sub>n+1</sub>/c<sub>n</sub>| &lt; 1</code>，解出 <code>|x − a| &lt; 1/lim|c<sub>n+1</sub>/c<sub>n</sub>|</code>。所以 <code>R = lim |c<sub>n</sub>/c<sub>n+1</sub>|</code>（当这个极限存在）。若用根值，则 <code>R = 1/lim <sup>n</sup>√|c<sub>n</sub>|</code>。两个公式等价，选好算的那个。' },

    { t: 'p', html: '例：<code>Σ (x − 2)<sup>n</sup>/n<sup>2</sup></code>。<code>R = lim (n+1)<sup>2</sup>/n<sup>2</sup> = 1</code>，开区间 <code>(1, 3)</code>。端点 <code>x = 1</code> 代入得 <code>Σ(−1)<sup>n</sup>/n<sup>2</sup></code>，绝对收敛；<code>x = 3</code> 代入得 <code>Σ1/n<sup>2</sup></code>，收敛。故收敛区间是闭区间 <code>[1, 3]</code>。若把分母换成 <code>n</code>，则 <code>x = 1</code> 处条件收敛、<code>x = 3</code> 处调和级数发散，区间为 <code>[1, 3)</code>。' },

    { t: 'steps', items: [
      { title: '第一步 · 算收敛半径', html: '用 <code>R = lim|c<sub>n</sub>/c<sub>n+1</sub>|</code> 或根值公式；算不出极限时用不等式直接解。' },
      { title: '第二步 · 写出开区间', html: '<code>(a − R, a + R)</code>；<code>R = 0</code> 时只在 <code>x = a</code> 收敛，<code>R = ∞</code> 时处处收敛。' },
      { title: '第三步 · 逐端点代入', html: '把 <code>x = a − R</code> 与 <code>x = a + R</code> 分别代回，得到两个具体的数项级数。' },
      { title: '第四步 · 用 ch01/ch02 的工具判端点', html: '通常是 p-级数、交错级数或两者的组合；注意端点处不能用比值判别。' },
      { title: '第五步 · 写结论', html: '用区间记号写全，例如 <code>[1, 3)</code>；只写 <code>|x − 2| &lt; 1</code> 会丢端点分。' }
    ] },

    { t: 'h', lvl: 2, text: '六、端点判定与收敛区间', id: 'ch02-6' },

    { t: 'p', html: '端点之所以必须单独判，是因为比值判别在 <code>|x − a| = R</code> 时恰好给出 <code>L = 1</code>，完全失效。而这四种形态——两端都发散、左闭右开、两端都收敛——全都可能发生：<code>Σx<sup>n</sup></code> 得 <code>(−1, 1)</code>；<code>Σx<sup>n</sup>/n</code> 得 <code>[−1, 1)</code>；<code>Σx<sup>n</sup>/n<sup>2</sup></code> 得 <code>[−1, 1]</code>。' },

    { t: 'table', head: ['幂级数', 'R', 'x = −1', 'x = 1', '收敛区间'], rows: [
      ['<code>Σx<sup>n</sup></code>', '1', '发散（通项不趋 0）', '发散', '<code>(−1, 1)</code>'],
      ['<code>Σx<sup>n</sup>/n</code>', '1', '收敛（交错调和）', '发散（调和）', '<code>[−1, 1)</code>'],
      ['<code>Σx<sup>n</sup>/n<sup>2</sup></code>', '1', '绝对收敛', '收敛', '<code>[−1, 1]</code>'],
      ['<code>Σx<sup>n</sup>/√n</code>', '1', '收敛（交错）', '发散（p = 1/2）', '<code>[−1, 1)</code>'],
      ['<code>Σn! x<sup>n</sup></code>', '0', '—', '—', '仅 <code>x = 0</code>'],
      ['<code>Σx<sup>n</sup>/n!</code>', '∞', '绝对收敛', '绝对收敛', '<code>(−∞, ∞)</code>']
    ], caption: '端点结论与 R 无关：同一个 R = 1，四种区间形态都可能出现' },

    { t: 'p', html: '还有一类幂级数不是「标准形」：<code>Σ(x − 1)<sup>2n</sup>/4<sup>n</sup></code> 只含偶次幂，比值法会算出 <code>|x − 1|<sup>2</sup>/4 &lt; 1</code>，即 <code>|x − 1| &lt; 2</code>，R = 2，但端点处通项不趋 0，故为开区间。处理这类题不要套 <code>R = lim|c<sub>n</sub>/c<sub>n+1</sub>|</code>，直接用比值不等式解更安全；若要套公式，就把缺的系数补 0，但记忆负担更大。' },

    { t: 'h', lvl: 2, text: '七、幂级数的运算与求和', id: 'ch02-7' },

    { t: 'p', html: '幂级数在收敛区间<b>内部</b>表现得像多项式：可以逐项相加、逐项相乘（在公共收敛区间内）、逐项求导、逐项积分，收敛半径不变。具体地，若 <code>f(x) = Σc<sub>n</sub>(x − a)<sup>n</sup></code> 在 <code>|x − a| &lt; R</code> 成立，则 <code>f′(x) = Σn c<sub>n</sub>(x − a)<sup>n−1</sup></code>，<code>∫f = Σc<sub>n</sub>(x − a)<sup>n+1</sup>/(n+1) + C</code>，两个新级数的收敛半径仍是 R（端点可能变，但半径不变）。' },

    { t: 'p', html: '这条性质是求和的主力工具。例：已知 <code>1/(1 − x) = Σx<sup>n</sup></code>（<code>|x| &lt; 1</code>），两边求导得 <code>1/(1 − x)<sup>2</sup> = Σn x<sup>n−1</sup></code>，于是 <code>Σn x<sup>n</sup> = x/(1 − x)<sup>2</sup></code>。两边积分得 <code>−ln(1 − x) = Σx<sup>n+1</sup>/(n+1)</code>，即 <code>ln(1 + x) = Σ(−1)<sup>n−1</sup>x<sup>n</sup>/n</code>。ch03 的泰勒展开有一半是这套动作的重复。' },

    { t: 'p', html: '两个注意点。<b>第一，逐项求导会损失端点信息</b>：<code>Σx<sup>n</sup>/n</code> 在 <code>x = −1</code> 收敛，求导后得 <code>Σx<sup>n−1</sup></code> 在 <code>x = −1</code> 发散。所以「求导后的级数」只在开区间内保证成立，端点要重新验。<b>第二，逐项积分可能改善端点</b>：<code>Σx<sup>n</sup></code> 在 <code>x = 1</code> 发散，积分后 <code>Σx<sup>n+1</sup>/(n+1)</code> 在 <code>x = 1</code> 仍是调和级数——这个例子没改善，但换成把 <code>1/n<sup>2</sup></code> 放进去，就能看到端点从开变闭。' },

    { t: 'callout', kind: 'exam', title: '考场上这类题的标准写法', html: '求 <code>Σ(x − 1)<sup>n</sup>/(n·3<sup>n</sup>)</code> 的收敛区间：<b>（1）</b>写 <code>lim|a<sub>n+1</sub>/a<sub>n</sub>| = |x − 1|/3</code>；<b>（2）</b>令其 &lt; 1 得 <code>|x − 1| &lt; 3</code>，R = 3；<b>（3）</b><code>x = 4</code> 代入得 <code>Σ1/(3n)</code> 发散；<b>（4）</b><code>x = −2</code> 代入得 <code>Σ(−1)<sup>n</sup>/(3n)</code> 条件收敛；<b>（5）</b>结论 <code>[−2, 4)</code>。五步缺一扣一分的节奏，别跳步。' },

    { t: 'terms', items: [
      { en: 'absolute convergence', zh: '绝对收敛', html: '<code>Σ|a<sub>n</sub>|</code> 收敛；此时原级数必收敛且可任意重排。' },
      { en: 'conditional convergence', zh: '条件收敛', html: '原级数收敛但 <code>Σ|a<sub>n</sub>|</code> 发散；重排可改变和。' },
      { en: 'alternating series', zh: '交错级数', html: '通项符号正负交替；判别需正项、递减、趋 0 三条件。' },
      { en: 'ratio test', zh: '比值判别', html: '看 <code>|a<sub>n+1</sub>/a<sub>n</sub>|</code> 的极限；等于 1 时失效。' },
      { en: 'root test', zh: '根值判别', html: '看 <code>|a<sub>n</sub>|<sup>1/n</sup></code> 的极限；比比值判别更强。' },
      { en: 'radius of convergence', zh: '收敛半径', html: '使幂级数在 <code>|x − a| &lt; R</code> 内绝对收敛、外发散的那个 R。' },
      { en: 'interval of convergence', zh: '收敛区间', html: '开区间加上端点判定结果，可能是开、闭或半开半闭。' }
    ] },

    { t: 'quiz', qid: 'ch02-q1' },
    { t: 'quiz', qid: 'ch02-q2' },
    { t: 'quiz', qid: 'ch02-q3' },

    { t: 'keypoint', items: [
      { title: '先绝对、后条件', html: '任意项级数的第一动作是看 <code>Σ|a<sub>n</sub>|</code>；绝对收敛则一切性质可用，否则退回交错判别。' },
      { title: '绝对收敛才可重排', html: '条件收敛级数重排可得到任意和，这是黎曼重排定理，也是「无限项不能随便交换」的根源。' },
      { title: '交错判别的误差界', html: '<code>|S − S<sub>N</sub>| ≤ b<sub>N+1</sub></code>；要求精度就解 <code>b<sub>N+1</sub> &lt; ε</code>。' },
      { title: 'L = 1 是失效不是收敛', html: '比值与根值判别在 L = 1 时必须换工具，最常见的是改回 p-级数比较。' },
      { title: '半径内部绝对收敛', html: '<code>|x − a| &lt; R</code> 内绝对收敛且可逐项求导积分；端点必须代回原级数。' },
      { title: '区间要写全', html: 'R 只给出开区间，端点结论决定方括号；四种形态都可能出现。' }
    ] },

    { t: 'checklist', id: 'ch02', items: [
      '我能给出绝对收敛与条件收敛的定义，并各举一个例子',
      '我能解释为什么条件收敛级数重排后和会改变，并写出一个重排的例子',
      '我能用交错级数判别法判断收敛，并写出误差不超过第 N+1 项的结论',
      '我能用 <code>|S − S<sub>N</sub>| ≤ b<sub>N+1</sub></code> 算出达到给定精度所需的项数',
      '我能对含阶乘或 n 次方的级数正确使用比值判别，并处理 <code>1/e</code> 这类极限',
      '我能说出比值与根值判别各自的适用结构，以及 <code>L = 1</code> 时该换什么工具',
      '我能用比值法求收敛半径，并写出开区间',
      '我能把两个端点分别代回原级数，判断收敛、条件收敛或发散',
      '我能对 <code>1/(1 − x)</code> 逐项求导、积分，得到 <code>Σnx<sup>n</sup></code> 与 <code>ln(1 + x)</code> 的展开'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应 Thomas《Calculus》第 13 版 SI 单位第 10.5–10.7 节：交错级数与绝对收敛、比值与根值判别、幂级数。收敛半径的两个公式分别来自比值判别与根值判别，教材在 10.7 给出。幂级数的逐项求导与逐项积分定理属于 10.7 的推论，本章只使用、不证明（证明需要一致收敛，超出本课范围）。教材 11.6、11.7 与本章无关；泰勒级数的系统展开留给 ch03，本章末尾的 <code>ln(1 + x)</code> 只是演示运算，不作为公式表要求记忆。' }
  ]
});
