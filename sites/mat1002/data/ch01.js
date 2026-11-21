/* =====================================================================
 * ch01.js · 第 1 章「数列与级数：收敛的判据」
 * 教材对应：Thomas 第 10 章（10.1–10.4）；含数列、部分和、积分判别、
 * 比较判别、p-级数与余项估计。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch01',
  num: '01',
  title: '数列与级数：收敛的判据',
  en: 'SEQUENCES AND SERIES',
  goals: [
    '用部分和的语言说清「级数收敛」到底在定义什么',
    '独立判断几何级数、调和级数、p-级数与望远镜级数的收敛性',
    '在积分判别、比较判别、极限比较之间选出计算量最小的那条',
    '给定精度要求，用积分余项估计截断到第几项',
    '识别「每项趋于 0 却发散」与「通项不趋于 0 却看不出」两类陷阱'
  ],
  kp: [
    { id: 'ch01-1', title: '数列极限与单调有界' },
    { id: 'ch01-2', title: '级数 = 部分和的极限' },
    { id: 'ch01-3', title: '几何级数与调和级数' },
    { id: 'ch01-4', title: '发散判别与积分判别' },
    { id: 'ch01-5', title: '比较判别与极限比较' },
    { id: 'ch01-6', title: 'p-级数与余项估计' },
    { id: 'ch01-7', title: '判别法的选择流程' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么级数值得花三章', html: '级数是本课唯一一个「定义简单、推论极多」的对象：定义只是「部分和序列有极限」，但从这一个定义长出了十几条判别法、整套幂级数理论、以及泰勒展开的误差控制。更实际的理由是——它是后面所有内容的度量工具。ch03 要问「泰勒多项式差多少」，答案是一个级数的余项；ch07 要问「积分能不能换成求和」，答案还是级数。这一章只做一件事：把「判断收敛」练成条件反射。' },

    { t: 'p', lead: true, html: '本章按「先定义、再基准、后工具」的顺序展开。定义部分要接受一个反直觉的事实：<b>级数的值不是「加出来」的，而是「部分和序列的极限」</b>。基准部分只需记住两个级数：几何级数与调和级数，其余判别法都是拿未知级数去和它们比。工具部分给出四条判别法（发散、积分、比较、极限比较）和一条 p-级数结论，最后整理成一张选择流程图。' },

    { t: 'h', lvl: 2, text: '一、数列极限与单调有界', id: 'ch01-1' },

    { t: 'p', html: '数列是定义在正整数上的函数，记作 <code>{a<sub>n</sub>}</code>。它收敛到 <code>L</code> 的意思是：任给 <code>ε &gt; 0</code>，存在 <code>N</code>，当 <code>n &gt; N</code> 时 <code>|a<sub>n</sub> − L| &lt; ε</code>。这个定义在计算里很少直接用，真正好用的是它的推论：<b>夹逼定理</b>（两边夹住就收敛）、<b>单调有界定理</b>（单调递增且有上界必收敛）、以及<b>连续函数保持极限</b>（<code>a<sub>n</sub> → L</code> 则 <code>f(a<sub>n</sub>) → f(L)</code>）。' },

    { t: 'p', html: '考试里常见的数列极限有三类。<b>第一类是有理式</b>：分子分母同除最高次幂，如 <code>(3n<sup>2</sup> + 2)/(n<sup>2</sup> − n) → 3</code>。<b>第二类是含 n 次方或阶乘</b>：用比值法猜极限，如 <code>x<sup>n</sup>/n!</code> 对任意 x 都趋于 0。<b>第三类是递推数列</b>：先证单调有界（数学归纳法），再对递推式两边取极限解出 L。第三类最容易丢分，因为「先假设极限存在再解方程」是循环论证，必须先证存在。' },

    { t: 'callout', kind: 'warn', title: '两个不能做的事', html: '<b>一、</b>不能对递推式直接取极限而不证收敛。例如 <code>a<sub>1</sub> = 1, a<sub>n+1</sub> = 2a<sub>n</sub></code>，若假设极限 L 存在会得到 <code>L = 2L</code>，即 <code>L = 0</code>，但数列实际发散。<b>二、</b>不能把「<code>a<sub>n</sub> → 0</code>」当作级数收敛的充分条件，这正是下一节要拆穿的陷阱。' },

    { t: 'p', html: '单调有界定理的用法有个固定套路：<b>（1）</b>用归纳法证 <code>a<sub>n+1</sub> ≥ a<sub>n</sub></code>；<b>（2）</b>猜一个上界（通常是极限的候选值），用归纳法证 <code>a<sub>n</sub> ≤ M</code>；<b>（3）</b>由定理得极限存在，设为 L；<b>（4）</b>对递推式取极限解出 L。经典例子是 <code>a<sub>1</sub> = √2, a<sub>n+1</sub> = √(2 + a<sub>n</sub>)</code>，极限为 2。' },

    { t: 'h', lvl: 2, text: '二、级数 = 部分和的极限', id: 'ch01-2' },

    { t: 'p', html: '把数列各项加起来记作 <code>Σ<sub>n=1</sub><sup>∞</sup> a<sub>n</sub></code>。这个符号本身没有定义，必须先定义部分和 <code>S<sub>N</sub> = a<sub>1</sub> + a<sub>2</sub> + … + a<sub>N</sub></code>，然后规定：<b>若序列 <code>{S<sub>N</sub>}</code> 收敛到 S，就说级数收敛且和为 S；否则说级数发散</b>。注意 S 是一个数，不是「无穷大」。' },

    { t: 'p', html: '这个定义带来一条极有用的线性性质：若 <code>Σa<sub>n</sub> = A</code>、<code>Σb<sub>n</sub> = B</code> 都收敛，则 <code>Σ(ca<sub>n</sub> + db<sub>n</sub>) = cA + dB</code>。但反过来不成立：两个发散级数相加可能收敛（<code>1 + (−1) + 1 + …</code> 与 <code>−1 + 1 − 1 + …</code>），所以<b>不能把发散级数当数一样移项</b>。同理，收敛级数加发散级数一定发散，这条常用来快速判断。' },

    { t: 'table', head: ['命题', '成立吗', '理由或反例'], rows: [
      ['<code>a<sub>n</sub> → 0</code> ⇒ <code>Σa<sub>n</sub></code> 收敛', '不成立', '调和级数 <code>Σ1/n</code> 通项趋于 0 但发散'],
      ['<code>Σa<sub>n</sub></code> 收敛 ⇒ <code>a<sub>n</sub> → 0</code>', '成立', '因为 <code>a<sub>N</sub> = S<sub>N</sub> − S<sub>N−1</sub> → S − S = 0</code>'],
      ['<code>Σa<sub>n</sub></code> 收敛 ⇒ <code>Σ|a<sub>n</sub>|</code> 收敛', '不成立', '交错调和级数收敛，绝对值级数发散'],
      ['去掉或添加有限项改变收敛性', '不成立', '有限项不影响部分和是否收敛'],
      ['<code>Σa<sub>n</sub></code> 收敛 ⇒ <code>Σa<sub>n</sub><sup>2</sup></code> 收敛', '不成立', '<code>Σ(−1)<sup>n</sup>/√n</code> 收敛，平方后成调和级数'],
      ['两个收敛级数逐项相乘后仍收敛', '不成立', '柯西乘积可能发散，需绝对收敛才安全']
    ], caption: '「收敛 ⇒ 通项趋于 0」只能正着用：通项不趋于 0 就发散，这是最快的排除法' },

    { t: 'p', html: '上表第一行给出<b>发散判别法（n-th term test）</b>：若 <code>lim a<sub>n</sub> ≠ 0</code> 或极限不存在，则级数发散。它只能判发散，不能判收敛。做题时先看通项：像 <code>Σ n/(2n+1)</code>、<code>Σ cos(1/n)</code>、<code>Σ (−1)<sup>n</sup></code> 这类通项不趋于 0 的，一行就能结束，不必动积分。' },

    { t: 'h', lvl: 2, text: '三、几何级数与调和级数', id: 'ch01-3' },

    { t: 'p', html: '几何级数 <code>Σ<sub>n=0</sub><sup>∞</sup> ar<sup>n</sup></code> 的部分和有闭式：<code>S<sub>N</sub> = a(1 − r<sup>N+1</sup>)/(1 − r)</code>（<code>r ≠ 1</code>）。于是当 <code>|r| &lt; 1</code> 时收敛到 <code>a/(1 − r)</code>，当 <code>|r| ≥ 1</code> 时发散。它是唯一一个你能写出精确和的常用级数，也是后面幂级数在收敛区间内部求和的模板。' },

    { t: 'p', html: '调和级数 <code>Σ<sub>n=1</sub><sup>∞</sup> 1/n</code> 发散，这件事有多种证法，最值得记住的是<b>分组证法</b>：把项按 <code>1/2</code>、<code>1/3 + 1/4</code>、<code>1/5 + … + 1/8</code> 分组，第 k 组有 <code>2<sup>k−1</sup></code> 项、每项不小于 <code>1/2<sup>k</sup></code>，故每组之和不小于 <code>1/2</code>，部分和可以超过任意大。这个证法同时告诉你发散有多慢：要到 <code>10<sup>3</sup></code> 量级的项数，部分和才勉强到 7 左右。' },

    { t: 'compare', left: { title: '几何级数：通项按比例缩', html: '<code>Σar<sup>n</sup></code> 的相邻项之比恒为 r。部分和有闭式，收敛性完全由 <code>|r|</code> 决定。它是「快收敛」的典型：<code>r = 1/2</code> 时十项就精确到小数点后三位。用它做比较标准，适合处理含 <code>n</code> 次方、阶乘的级数。' }, right: { title: '调和级数：通项按幂次缩', html: '<code>Σ1/n<sup>p</sup></code> 的项以幂律衰减。p = 1 恰好在临界点上发散，p &gt; 1 收敛但极慢：<code>p = 2</code> 时前 1000 项之和约 1.644，距离极限 <code>π<sup>2</sup>/6 ≈ 1.6449</code> 还差一点点。用它做比较标准，适合处理有理式。' } },

    { t: 'p', html: '两个基准的作用不同：几何级数适合与「指数型」通项比较（<code>2<sup>n</sup></code>、<code>n!</code>、<code>n<sup>n</sup></code>），p-级数适合与「幂型」通项比较（<code>n<sup>2</sup> + 1</code>、<code>√n</code>、<code>n<sup>1/3</sup></code>）。选错基准不会做错，但会让比较不等式难写。经验法则是：<b>通项里出现阶乘或 n 在指数上，优先比值判别（ch02）；出现根号与多项式，优先 p-级数比较</b>。' },

    { t: 'callout', kind: 'tip', title: '望远镜级数：部分和能直接算出来', html: '若通项能拆成 <code>b<sub>n</sub> − b<sub>n+1</sub></code>，则 <code>S<sub>N</sub> = b<sub>1</sub> − b<sub>N+1</sub></code>，收敛性等价于 <code>b<sub>N</sub></code> 收敛。例：<code>Σ 1/(n(n+1)) = Σ(1/n − 1/(n+1)) = 1</code>；<code>Σ 1/(n<sup>2</sup> + 3n + 2)</code> 先因式分解再拆项。这类题不要用判别法，直接算部分和更快。' },

    { t: 'h', lvl: 2, text: '四、发散判别与积分判别', id: 'ch01-4' },

    { t: 'p', html: '当通项趋于 0、又看不出与 p-级数的关系时，<b>积分判别法</b>是第一个该试的工具。设 <code>f</code> 在 <code>[1, ∞)</code> 上连续、正值、单调递减，且 <code>a<sub>n</sub> = f(n)</code>，则 <code>Σa<sub>n</sub></code> 与 <code>∫<sub>1</sub><sup>∞</sup> f(x) dx</code> 同敛散。三个条件缺一不可，尤其是<b>单调递减</b>：<code>f</code> 只正不降时结论可能失效。' },

    { t: 'p', html: '证明思路值得看一遍，因为它给出了余项估计。对每个 n，在 <code>[n, n+1]</code> 上 <code>f(x) ≤ f(n)</code>，所以 <code>∫<sub>n</sub><sup>n+1</sup> f ≤ f(n)</code>；又 <code>f(n+1) ≤ f(x)</code>，所以 <code>f(n+1) ≤ ∫<sub>n</sub><sup>n+1</sup> f</code>。两边的和给出 <code>∫<sub>1</sub><sup>N+1</sup> f ≤ S<sub>N</sub> ≤ f(1) + ∫<sub>1</sub><sup>N</sup> f</code>，于是积分有界当且仅当部分和有界。' },

    { t: 'p', html: '例：判断 <code>Σ 1/(n ln n)</code>（n ≥ 2）。取 <code>f(x) = 1/(x ln x)</code>，它连续、正、递减，且 <code>∫<sub>2</sub><sup>∞</sup> dx/(x ln x) = [ln ln x]<sub>2</sub><sup>∞</sup> = ∞</code>，故级数发散。把分母改成 <code>n (ln n)<sup>2</sup></code>，积分变成 <code>[−1/ln x]</code>，收敛到 <code>1/ln 2</code>，级数收敛。这就是「临界指数」的直观：对数因子也要算进幂次。' },

    { t: 'steps', items: [
      { title: '第一步 · 先看通项是否趋于 0', html: '不趋于 0 直接判发散，结束。趋于 0 才进入下一步。' },
      { title: '第二步 · 能否拆项', html: '能拆成 <code>b<sub>n</sub> − b<sub>n+1</sub></code> 就直接算部分和；这类题用判别法反而绕远。' },
      { title: '第三步 · 是否是几何或 p-级数', html: '是则直接套结论；相差一个常数倍也算。' },
      { title: '第四步 · 与 p-级数比较', html: '通项是有理式或带根号，用比较或极限比较，抓最高阶项。' },
      { title: '第五步 · 含 ln n 或不易比较', html: '用积分判别；注意验证连续、正、递减三条件。' },
      { title: '第六步 · 含阶乘或 n 次方', html: '留给 ch02 的比值、根值判别，本章不必硬做。' }
    ] },

    { t: 'h', lvl: 2, text: '五、比较判别与极限比较', id: 'ch01-5' },

    { t: 'p', html: '<b>比较判别法</b>：若 <code>0 ≤ a<sub>n</sub> ≤ b<sub>n</sub></code>，则 <code>Σb<sub>n</sub></code> 收敛推出 <code>Σa<sub>n</sub></code> 收敛；<code>Σa<sub>n</sub></code> 发散推出 <code>Σb<sub>n</sub></code> 发散。注意方向：<b>大收敛推小收敛，小发散推大发散</b>，另外两个方向都不成立。用法是先猜一个「同量级」的 p-级数，再证不等式。' },

    { t: 'p', html: '<b>极限比较法</b>把不等式换成极限，通常更好写：设 <code>a<sub>n</sub>, b<sub>n</sub> &gt; 0</code>，若 <code>lim a<sub>n</sub>/b<sub>n</sub> = c</code> 且 <code>0 &lt; c &lt; ∞</code>，则两级数同敛散；若 <code>c = 0</code> 且 <code>Σb<sub>n</sub></code> 收敛，则 <code>Σa<sub>n</sub></code> 收敛；若 <code>c = ∞</code> 且 <code>Σb<sub>n</sub></code> 发散，则 <code>Σa<sub>n</sub></code> 发散。三条结论里只有「c 为有限正数」是对称的，另外两条要看清方向。' },

    { t: 'p', html: '例：<code>Σ (2n + 3)/(n<sup>3</sup> − n + 1)</code>。抓最高阶得 <code>~ 2n/n<sup>3</sup> = 2/n<sup>2</sup></code>，取 <code>b<sub>n</sub> = 1/n<sup>2</sup></code>，则 <code>a<sub>n</sub>/b<sub>n</sub> → 2</code>，由 p = 2 &gt; 1 收敛。注意分母在 n = 1 时为 1、n ≥ 2 时为正，所以从 n = 1 开始比较没问题；若分母会变号，先去掉有限项再从某项开始。' },

    { t: 'callout', kind: 'warn', title: '比较判别的三个常见错误', html: '<b>一、方向用反：</b>由 <code>a<sub>n</sub> ≤ b<sub>n</sub></code> 且 <code>Σa<sub>n</sub></code> 收敛，推不出 <code>Σb<sub>n</sub></code> 收敛。<br><b>二、不等式太松：</b>把 <code>1/(n<sup>2</sup> + n)</code> 放成 <code>1/n</code> 只能得到「小于发散级数」，什么也推不出。要放到 <code>1/n<sup>2</sup></code>。<br><b>三、忽略负项：</b>比较判别只对非负项级数有效。含负项时先取绝对值判绝对收敛，或留到 ch02 用交错级数判别。' },

    { t: 'h', lvl: 2, text: '六、p-级数与余项估计', id: 'ch01-6' },

    { t: 'p', html: '<b>p-级数结论</b>：<code>Σ<sub>n=1</sub><sup>∞</sup> 1/n<sup>p</sup></code> 当 <code>p &gt; 1</code> 时收敛，当 <code>p ≤ 1</code> 时发散。p = 1 是调和级数，p &lt; 1 时通项衰减更慢，p &gt; 1 时衰减够快。这条结论由积分判别法得到，因为 <code>∫<sub>1</sub><sup>∞</sup> x<sup>−p</sup> dx</code> 在 <code>p &gt; 1</code> 时收敛。它和几何级数一起构成本章全部比较的基准。' },

    { t: 'p', html: '收敛之后还有一个实际问题：<b>要加多少项才能达到给定精度？</b>设 <code>f</code> 满足积分判别条件、级数收敛于 S，则余项满足 <code>∫<sub>N+1</sub><sup>∞</sup> f(x) dx ≤ R<sub>N</sub> = S − S<sub>N</sub> ≤ ∫<sub>N</sub><sup>∞</sup> f(x) dx</code>。也就是说，积分给出余项的上下界，取上界小于容差即可定出 N。' },

    { t: 'p', html: '例：<code>Σ 1/n<sup>2</sup></code> 要精确到 <code>10<sup>−3</sup></code>。余项 <code>R<sub>N</sub> ≤ ∫<sub>N</sub><sup>∞</sup> x<sup>−2</sup> dx = 1/N</code>，取 <code>N = 1000</code> 即可；若要求 <code>10<sup>−6</sup></code>，需要 <code>N = 10<sup>6</sup></code>。这解释了为什么 p-级数收敛却「算不快」：误差按 <code>1/N<sup>p−1</sup></code> 衰减，p 越接近 1 越慢。对比几何级数 <code>r = 1/2</code>，误差按 <code>2<sup>−N</sup></code> 衰减，20 项就到 <code>10<sup>−6</sup></code>。' },

    { t: 'table', head: ['级数', '收敛性', '判据', '余项量级'], rows: [
      ['<code>Σ 1/n</code>', '发散', '积分判别 / 分组', '—'],
      ['<code>Σ 1/n<sup>2</sup></code>', '收敛', 'p = 2 &gt; 1', '<code>≈ 1/N</code>'],
      ['<code>Σ 1/√n</code>', '发散', 'p = 1/2 ≤ 1', '—'],
      ['<code>Σ 1/n<sup>1.001</sup></code>', '收敛', 'p &gt; 1（极慢）', '<code>≈ 1000·N<sup>−0.001</sup></code>'],
      ['<code>Σ 1/(n ln n)</code>', '发散', '积分判别', '—'],
      ['<code>Σ 1/(n (ln n)<sup>2</sup>)</code>', '收敛', '积分判别', '<code>≈ 1/ln N</code>'],
      ['<code>Σ (1/2)<sup>n</sup></code>', '收敛', '几何 <code>|r| &lt; 1</code>', '<code>≈ 2<sup>−N</sup></code>']
    ], caption: '「收敛」与「算得出来」是两件事：p 接近 1 的级数收敛但数值上几乎不可用' },

    { t: 'h', lvl: 2, text: '七、判别法的选择流程', id: 'ch01-7' },

    { t: 'p', html: '把前面的工具排成一条决策链，做题时从上往下走，命中就停。这条链不保证最短，但保证不会卡死。真正熟练之后你会跳过前几步，直接看出该用哪条。' },

    { t: 'flow', dir: 'v', nodes: [
      '通项 <code>a<sub>n</sub></code> 是否趋于 0？不趋于 → 发散',
      '能否拆成 <code>b<sub>n</sub> − b<sub>n+1</sub></code>？能 → 算部分和',
      '是否几何级数或 p-级数？是 → 套结论',
      '含阶乘或 <code>n</code> 次方？是 → 比值/根值判别（ch02）',
      '是有理式或根号？是 → 极限比较，抓最高阶',
      '含 <code>ln n</code>？是 → 积分判别',
      '以上都不行 → 回到定义，估部分和或找反例'
    ] },

    { t: 'p', html: '最后提醒两件事。<b>第一，判别法只回答「收敛与否」，不回答「和是多少」</b>；除几何级数与望远镜级数外，本章的级数你都算不出精确和，考试也不会要求。<b>第二，条件必须逐条验证</b>：积分判别要写「连续、正、递减」，比较判别要写「非负」，极限比较要写「极限为有限正数」。阅卷时这些句子本身就是分。' },

    { t: 'terms', items: [
      { en: 'sequence', zh: '数列', html: '编号的一列数 <code>{a<sub>n</sub>}</code>；收敛指存在有限极限。' },
      { en: 'partial sum', zh: '部分和', html: '<code>S<sub>N</sub> = a<sub>1</sub> + … + a<sub>N</sub></code>；级数的收敛性由它定义。' },
      { en: 'geometric series', zh: '几何级数', html: '<code>Σar<sup>n</sup></code>；<code>|r| &lt; 1</code> 时和为 <code>a/(1 − r)</code>。' },
      { en: 'harmonic series', zh: '调和级数', html: '<code>Σ1/n</code>；通项趋于 0 但发散，是最重要的反例。' },
      { en: 'p-series', zh: 'p-级数', html: '<code>Σ1/n<sup>p</sup></code>；<code>p &gt; 1</code> 收敛，<code>p ≤ 1</code> 发散。' },
      { en: 'integral test', zh: '积分判别法', html: '把求和换成积分比较，需 <code>f</code> 连续、正、单调递减。' },
      { en: 'remainder', zh: '余项', html: '<code>R<sub>N</sub> = S − S<sub>N</sub></code>；积分判别可给出它的上下界。' }
    ] },

    { t: 'quiz', qid: 'ch01-q1' },
    { t: 'quiz', qid: 'ch01-q2' },
    { t: 'quiz', qid: 'ch01-q3' },

    { t: 'keypoint', items: [
      { title: '级数是部分和的极限', html: '不是「一直加」，而是序列 <code>S<sub>N</sub></code> 的极限；所有性质都从这条定义推出。' },
      { title: '通项趋于 0 是必要条件', html: '只能用来判发散。调和级数证明它不充分，这是本章最重要的一句话。' },
      { title: '两个基准', html: '几何级数管指数型通项，p-级数管幂型通项；比较判别的全部技巧就是找到合适的基准。' },
      { title: '积分判别的三条件', html: '连续、正值、单调递减。缺单调性时结论可能失效，答题要写明。' },
      { title: '比较方向不能反', html: '大收敛推小收敛，小发散推大发散；另两个方向是常见错误。' },
      { title: '余项按幂律衰减', html: '<code>R<sub>N</sub> ≈ 1/N<sup>p−1</sup></code>；p 接近 1 时收敛但数值上不可用。' }
    ] },

    { t: 'checklist', id: 'ch01', items: [
      '我能写出级数收敛的正式定义（用部分和与 ε），而不是只说「加下去」',
      '我能证明调和级数发散，并说清它与几何级数的区别',
      '我能默写 p-级数的结论，并说明 p = 1 为什么是临界的',
      '我能用积分判别法判断 <code>Σ1/(n ln n)</code> 与 <code>Σ1/(n (ln n)<sup>2</sup>)</code>',
      '我能正确使用比较判别法，并说出哪两个方向不成立',
      '我能用极限比较法处理有理式通项，并写出极限值',
      '我能用积分余项估计「精确到 10<sup>−3</sup> 需要多少项」',
      '我能识别望远镜级数并直接算出它的和',
      '我能不看笔记走完第七节的判别流程，并解释每一步为什么放在那里'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应 Thomas《Calculus》第 13 版 SI 单位第 10.1–10.4 节：数列、无穷级数、积分判别法、比较判别法。p-级数与余项估计取自 10.3 的推论与习题，教材未单列小节，但课程大纲把它列为必备结论。本章不涉及比值判别、根值判别、交错级数与绝对收敛——这些全部放在 ch02，因为它们的证明要用到本章的比较工具。教材 11.6（极坐标下的圆锥曲线）与 11.7 按大纲跳过，与本章无关。' }
  ]
});
