/* =====================================================================
 * ch06.js · 第 6 章「偏导数、梯度与多元极值」
 * 教材对应：Thomas 第 14 章（14.1–14.9，跳过 14.10）：
 * 多元极限与连续、偏导、链式法则、方向导数与梯度、切平面、
 * 极值与鞍点、拉格朗日乘子。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch06',
  num: '06',
  title: '偏导数、梯度与多元极值',
  en: 'PARTIAL DERIVATIVES AND EXTREMA',
  goals: [
    '判断多元极限是否存在，并用路径法或极坐标给出证明',
    '区分偏导数存在、连续、可微三个概念，并说出它们的强弱关系',
    '用链式法则求复合函数的偏导，用梯度求方向导数与最陡方向',
    '写出切平面方程与全微分，并用它做线性近似与误差估计',
    '用二阶判别式与拉格朗日乘子求无约束与有约束极值'
  ],
  kp: [
    { id: 'ch06-1', title: '多元极限与连续' },
    { id: 'ch06-2', title: '偏导数与可微性' },
    { id: 'ch06-3', title: '链式法则与隐函数' },
    { id: 'ch06-4', title: '方向导数与梯度' },
    { id: 'ch06-5', title: '切平面与全微分' },
    { id: 'ch06-6', title: '极值、鞍点与二阶判别' },
    { id: 'ch06-7', title: '拉格朗日乘子' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '一元直觉在这里全部要重装', html: '一元微积分里「可导 ⇒ 连续 ⇒ 可积」是一条顺畅的阶梯。多元里这条阶梯断成了两截：<b>偏导数存在连连续都推不出来</b>，因为偏导只看两条坐标轴方向，函数可以在其他方向上剧烈跳动而不影响这两个方向。想恢复「可导 ⇒ 连续」，必须把「可导」升级成「可微」——要求函数能被一个线性函数（切平面）以 <code>o(ρ)</code> 的误差逼近。这个升级是本章前半部分的核心，也是多元微积分与一元最本质的差别。后半部分的极值问题则多了一个新麻烦：约束。拉格朗日乘子就是为此而生。' },

    { t: 'p', lead: true, html: '本章按「先描述局部、再找最优」展开。局部描述包括四个层次：极限与连续（函数是否稳定）、偏导数（沿坐标轴的变化率）、可微（能否用平面逼近）、梯度（往哪个方向变化最快）。最优问题分两类：无约束的用一阶条件加二阶判别式，有约束的用拉格朗日乘子。两条线都依赖同一个几何对象——<b>等值线与法向量</b>，理解了它，整章就串起来了。' },

    { t: 'h', lvl: 2, text: '一、多元极限与连续', id: 'ch06-1' },

    { t: 'p', html: '二元函数 <code>f(x, y)</code> 在 <code>(a, b)</code> 处有极限 L，意思是：任给 <code>ε &gt; 0</code>，存在 <code>δ &gt; 0</code>，当 <code>0 &lt; √((x−a)<sup>2</sup> + (y−b)<sup>2</sup>) &lt; δ</code> 时 <code>|f(x, y) − L| &lt; ε</code>。注意这里用的是<b>距离</b>而不是「左右两侧」，因为平面上趋近一个点有无数条路径。这就带来一个判定上的不对称：<b>证明极限不存在很容易</b>（找两条路径给出不同答案），<b>证明存在很难</b>（要排除所有路径）。' },

    { t: 'p', html: '证明不存在的标准手法：沿 <code>y = kx</code> 代入，若结果依赖 <code>k</code>，极限不存在。例：<code>f = xy/(x<sup>2</sup> + y<sup>2</sup>)</code>，代入 <code>y = kx</code> 得 <code>k/(1 + k<sup>2</sup>)</code>，随 k 变化，故极限不存在。更隐蔽的例子是 <code>f = x<sup>2</sup>y/(x<sup>4</sup> + y<sup>2</sup>)</code>：沿任何直线 <code>y = kx</code> 都趋于 0，但沿抛物线 <code>y = x<sup>2</sup></code> 得 <code>x<sup>4</sup>/(2x<sup>4</sup>) = 1/2</code>，极限仍不存在。所以「所有直线都给出同一个值」<b>不是</b>极限存在的证明。' },

    { t: 'p', html: '证明存在，最常用的是<b>极坐标夹逼</b>：令 <code>x = r cos θ, y = r sin θ</code>，若 <code>|f − L| ≤ g(r)</code> 且 <code>g(r) → 0</code>（与 θ 无关），则极限为 L。关键是「与 θ 无关」：如果界里还留着 <code>θ</code>，说明不同方向的收敛速度不同，夹逼失效。例：<code>f = (x<sup>2</sup> + y<sup>2</sup>)ln(x<sup>2</sup> + y<sup>2</sup>)</code>，换成 <code>r<sup>2</sup>ln r<sup>2</sup></code>，与 θ 无关且 <code>→ 0</code>，故极限为 0。' },

    { t: 'callout', kind: 'warn', title: '连续与极限的两个易错点', html: '<b>一、</b>「<code>f</code> 在 <code>(a, b)</code> 处有定义且 <code>f(a, b) = lim f</code>」才算连续；如果函数在该点无定义，即使极限存在也不连续（但可以「补定义」使之连续）。<br><b>二、</b>多元函数可以在「沿每条直线都连续」的情况下仍然不连续，因为连续性要求所有路径，而直线只是一部分。所以判断连续性不能靠「沿坐标轴看」，必须用定义或夹逼。' },

    { t: 'h', lvl: 2, text: '二、偏导数与可微性', id: 'ch06-2' },

    { t: 'p', html: '<b>偏导数</b> <code>f<sub>x</sub>(a, b) = lim<sub>h→0</sub> [f(a+h, b) − f(a, b)]/h</code>，就是把 y 当常数对 x 求导。计算时只需记住「对谁求导，另一个变量视为常数」，所有一元求导法则照用。高阶偏导 <code>f<sub>xy</sub> = (f<sub>x</sub>)<sub>y</sub></code> 是先对 x 再对 y；<b>若 <code>f<sub>xy</sub></code> 与 <code>f<sub>yx</sub></code> 都连续，则它们相等</b>（克莱罗定理）。教材的反例 <code>f = xy(x<sup>2</sup> − y<sup>2</sup>)/(x<sup>2</sup> + y<sup>2</sup>)</code> 在原点处两个混合偏导分别为 1 与 −1，说明「连续」这个条件不能省。' },

    { t: 'p', html: '<b>可微</b>的定义是：存在常数 A, B，使得 <code>Δf = AΔx + BΔy + o(ρ)</code>，其中 <code>ρ = √(Δx<sup>2</sup> + Δy<sup>2</sup>)</code>。若可微，则 <code>A = f<sub>x</sub></code>、<code>B = f<sub>y</sub></code>，于是 <code>Δf ≈ f<sub>x</sub>Δx + f<sub>y</sub>Δy</code>，右边就是全微分 <code>df</code>。几何上，可微意味着曲面在該点有<b>切平面</b>，且曲面与切平面的差是 <code>o(ρ)</code>。' },

    { t: 'table', head: ['命题', '是否成立', '说明'], rows: [
      ['可微 ⇒ 连续', '成立', '因为 <code>Δf → 0</code>'],
      ['可微 ⇒ 偏导存在', '成立', '且 <code>A = f<sub>x</sub>, B = f<sub>y</sub></code>'],
      ['偏导存在 ⇒ 连续', '不成立', '反例 <code>f = xy/(x<sup>2</sup>+y<sup>2</sup>)</code>（补 <code>f(0,0)=0</code>）在原点'],
      ['偏导存在 ⇒ 可微', '不成立', '同上例，偏导都为 0 但不可微'],
      ['偏导连续 ⇒ 可微', '成立', '这是最常用的充分条件'],
      ['沿所有直线连续 ⇒ 连续', '不成立', '路径不止直线']
    ], caption: '考试里判断可微，最省事的路径是「验证偏导连续」，而不是回到定义' },

    { t: 'p', html: '判断可微的实用流程：<b>（1）</b>先算 <code>f<sub>x</sub>, f<sub>y</sub></code>；<b>（2）</b>若它们在該点附近连续，直接得可微；<b>（3）</b>若不连续（通常发生在分段函数的接缝处），回到定义验证 <code>[f(a+h, b+k) − f(a, b) − f<sub>x</sub>h − f<sub>y</sub>k]/√(h<sup>2</sup>+k<sup>2</sup>) → 0</code>。第三步是考试里真正考「可微」的地方，因为大多数函数在定义域内部都满足充分条件，只有接缝处需要定义验证。' },

    { t: 'h', lvl: 2, text: '三、链式法则与隐函数', id: 'ch06-3' },

    { t: 'p', html: '<b>链式法则</b>：若 <code>z = f(x, y)</code> 且 <code>x = x(t), y = y(t)</code>，则 <code>dz/dt = f<sub>x</sub> dx/dt + f<sub>y</sub> dy/dt</code>。它的结构是「把每条路径的贡献加起来」，画一张依赖图就不会漏项：z 依赖 x 与 y，x 与 y 各依赖 t，所以有两条路径，每条乘起来再相加。若有三个中间变量，就三条路径；若中间变量又依赖两个自变量，就对每个自变量各写一次。' },

    { t: 'p', html: '二阶链式法则容易错，因为要对「乘积」再用一次法则。以 <code>z = f(x, y), x = x(s, t), y = y(s, t)</code> 为例，<code>∂z/∂s = f<sub>x</sub>x<sub>s</sub> + f<sub>y</sub>y<sub>s</sub></code>，再对 s 求一次得 <code>f<sub>xx</sub>x<sub>s</sub><sup>2</sup> + 2f<sub>xy</sub>x<sub>s</sub>y<sub>s</sub> + f<sub>yy</sub>y<sub>s</sub><sup>2</sup> + f<sub>x</sub>x<sub>ss</sub> + f<sub>y</sub>y<sub>ss</sub></code>。前三个是「二阶偏导乘一阶导的平方」，后两个是「一阶偏导乘二阶导」，两项都不能丢。' },

    { t: 'p', html: '<b>隐函数求导</b>：若 <code>F(x, y) = 0</code> 确定 <code>y = y(x)</code>，则 <code>dy/dx = −F<sub>x</sub>/F<sub>y</sub></code>（<code>F<sub>y</sub> ≠ 0</code>）。三元情形：<code>F(x, y, z) = 0</code> 确定 <code>z = z(x, y)</code>，则 <code>∂z/∂x = −F<sub>x</sub>/F<sub>z</sub></code>、<code>∂z/∂y = −F<sub>y</sub>/F<sub>z</sub></code>。记忆法是「负号加交叉」：对 x 求偏导时分子是 F 对 x 的偏导，分母是 F 对 z 的偏导。这个公式来自对 <code>F(x, y, z(x, y)) = 0</code> 两边求导再用链式法则。' },

    { t: 'compare', left: { title: '显函数：先解出再求导', html: '<code>z = x<sup>2</sup> + y<sup>2</sup></code> 直接算 <code>z<sub>x</sub> = 2x</code>。适用于能解出目标变量的情形；解不出来时硬解会引入根号、分段的麻烦。' }, right: { title: '隐函数：不解直接求', html: '<code>x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup> = 1</code> 直接得 <code>z<sub>x</sub> = −x/z</code>。适用于曲面、等值线、约束方程；代价是结果里仍含 z，代点时要用原方程。' } },

    { t: 'h', lvl: 2, text: '四、方向导数与梯度', id: 'ch06-4' },

    { t: 'p', html: '<b>方向导数</b> <code>D<sub>u</sub>f = ∇f·u</code>（<code>u</code> 是单位向量），表示沿方向 <code>u</code> 的变化率。它是一元导数在方向上的推广：取 <code>u = i</code> 得 <code>f<sub>x</sub></code>，取 <code>u = j</code> 得 <code>f<sub>y</sub></code>。注意 <code>u</code> 必须是单位向量，否则算出的不是「每单位长度」的变化率，这是最常见的错误。' },

    { t: 'p', html: '<b>梯度</b> <code>∇f = ⟨f<sub>x</sub>, f<sub>y</sub>⟩</code> 有两条几何性质，都从 <code>D<sub>u</sub>f = |∇f|cos θ</code> 读出：<b>（1）</b>当 <code>u</code> 与 <code>∇f</code> 同向时方向导数最大，最大值就是 <code>|∇f|</code>，所以<b>梯度指向增长最快的方向</b>；<b>（2）</b>当 <code>u</code> 垂直于 <code>∇f</code> 时方向导数为 0，所以<b>梯度垂直于等值线</b>（等值面）。第二条性质是拉格朗日乘子与曲面积分的几何基础。' },

    { t: 'p', html: '例：<code>f = x<sup>2</sup> + y<sup>2</sup></code> 在 <code>(1, 1)</code> 处，<code>∇f = ⟨2, 2⟩</code>。沿 <code>u = ⟨1, 0⟩</code> 的方向导数是 2，沿 <code>u = ⟨1, 1⟩/√2</code> 是 <code>4/√2 = 2√2</code>，正是 <code>|∇f| = 2√2</code>，验证了「梯度方向最大」。等值线是圆 <code>x<sup>2</sup> + y<sup>2</sup> = c</code>，在 <code>(1, 1)</code> 处切线斜率是 −1，而梯度方向斜率是 1，两者垂直，验证了第二条性质。' },

    { t: 'callout', kind: 'tip', title: '梯度的三个「一句话」', html: '<b>一、</b>梯度是向量，方向是增长最快的方向，模长是最大变化率。<br><b>二、</b>梯度垂直于等值线（二维）或等值面（三维），因此可作为法向量写切线与切平面。<br><b>三、</b>梯度为零的点是「驻点」，可能是极值点、鞍点或平坦点，需要二阶判别区分。' },

    { t: 'h', lvl: 2, text: '五、切平面与全微分', id: 'ch06-5' },

    { t: 'p', html: '曲面 <code>z = f(x, y)</code> 在 <code>(a, b, f(a, b))</code> 处的<b>切平面</b>方程是 <code>z = f(a, b) + f<sub>x</sub>(a, b)(x − a) + f<sub>y</sub>(a, b)(y − b)</code>。它是 ch03 切线公式的二维版本：把「斜率」换成「两个偏导」，把「直线」换成「平面」。若曲面以隐式 <code>F(x, y, z) = 0</code> 给出，则法向量是 <code>∇F</code>，切平面为 <code>F<sub>x</sub>(x − a) + F<sub>y</sub>(y − b) + F<sub>z</sub>(z − c) = 0</code>。' },

    { t: 'p', html: '<b>全微分</b> <code>df = f<sub>x</sub>dx + f<sub>y</sub>dy</code> 是切平面的增量，用来做线性近似：<code>f(a + Δx, b + Δy) ≈ f(a, b) + f<sub>x</sub>Δx + f<sub>y</sub>Δy</code>，误差是 <code>o(ρ)</code>。它在误差传播里特别有用：若测量 <code>x, y</code> 有误差 <code>Δx, Δy</code>，则 <code>f</code> 的误差约等于 <code>|f<sub>x</sub>||Δx| + |f<sub>y</sub>||Δy|</code>（取绝对值是因为误差可能正负抵消最坏情况）。' },

    { t: 'p', html: '例：测量圆柱的半径 <code>r = 2 ± 0.01</code>、高 <code>h = 5 ± 0.02</code>，求体积 <code>V = πr<sup>2</sup>h</code> 的误差。算 <code>V<sub>r</sub> = 2πrh = 20π</code>、<code>V<sub>h</sub> = πr<sup>2</sup> = 4π</code>，于是 <code>ΔV ≈ 20π(0.01) + 4π(0.02) = 0.28π ≈ 0.88</code>。体积约 <code>20π ≈ 62.8</code>，相对误差约 1.4%，主要来自半径（因为 <code>V<sub>r</sub></code> 比 <code>V<sub>h</sub></code> 大得多）。这个例子说明：<b>线性近似不仅给数值，还能告诉你哪个变量最值得提高精度</b>。' },

    { t: 'table', head: ['对象', '公式', '法向量'], rows: [
      ['曲线 <code>y = f(x)</code> 的切线', '<code>y = f(a) + f′(a)(x − a)</code>', '<code>⟨f′(a), −1⟩</code>'],
      ['曲面 <code>z = f(x, y)</code> 的切平面', '<code>z = f + f<sub>x</sub>Δx + f<sub>y</sub>Δy</code>', '<code>⟨f<sub>x</sub>, f<sub>y</sub>, −1⟩</code>'],
      ['隐式曲面 <code>F = 0</code>', '<code>∇F·(P − P<sub>0</sub>) = 0</code>', '<code>∇F</code>'],
      ['等值线 <code>f = c</code> 的法线', '<code>f<sub>x</sub>Δx + f<sub>y</sub>Δy = 0</code>', '<code>∇f</code>'],
      ['全微分', '<code>df = f<sub>x</sub>dx + f<sub>y</sub>dy</code>', '—']
    ], caption: '切线、切平面、法向量三件事，本质都是「用梯度或偏导构造线性近似」' },

    { t: 'h', lvl: 2, text: '六、极值、鞍点与二阶判别', id: 'ch06-6' },

    { t: 'p', html: '无约束极值的第一步是找<b>驻点</b>：解 <code>f<sub>x</sub> = 0, f<sub>y</sub> = 0</code>。驻点只是「可能是极值」，还需要二阶判别。设 <code>D = f<sub>xx</sub>f<sub>yy</sub> − f<sub>xy</sub><sup>2</sup></code>（判别式，即海森矩阵的行列式）：<b>（1）</b><code>D &gt; 0</code> 且 <code>f<sub>xx</sub> &gt; 0</code> 为极小；<b>（2）</b><code>D &gt; 0</code> 且 <code>f<sub>xx</sub> &lt; 0</code> 为极大；<b>（3）</b><code>D &lt; 0</code> 为鞍点；<b>（4）</b><code>D = 0</code> 判别失效，需另行分析。' },

    { t: 'p', html: '为什么是 <code>D</code>？因为二阶泰勒展开是 <code>f ≈ f<sub>0</sub> + ½(f<sub>xx</sub>h<sup>2</sup> + 2f<sub>xy</sub>hk + f<sub>yy</sub>k<sup>2</sup>)</code>，二次型正定当且仅当 <code>f<sub>xx</sub> &gt; 0</code> 且 <code>D &gt; 0</code>，负定当且仅当 <code>f<sub>xx</sub> &lt; 0</code> 且 <code>D &gt; 0</code>，不定则 <code>D &lt; 0</code>。所以判别式本质上是「二次型的符号」，与 ch05 的二次曲面分类是同一件事。' },

    { t: 'p', html: '例：<code>f = x<sup>2</sup> − y<sup>2</sup></code>。驻点 <code>(0, 0)</code>，<code>f<sub>xx</sub> = 2, f<sub>yy</sub> = −2, f<sub>xy</sub> = 0</code>，<code>D = −4 &lt; 0</code>，鞍点。几何上沿 x 轴是开口向上的抛物线，沿 y 轴是开口向下的抛物线，原点既不是最大也不是最小。例：<code>f = x<sup>2</sup> + y<sup>2</sup></code>，<code>D = 4 &gt; 0</code>、<code>f<sub>xx</sub> = 2 &gt; 0</code>，极小。例：<code>f = x<sup>4</sup> + y<sup>4</sup></code>，<code>D = 0</code>，判别失效，但显然原点是最小值（因为 <code>f ≥ 0</code>），这类要靠定义或配方判断。' },

    { t: 'steps', items: [
      { title: '第一步 · 求驻点', html: '解方程组 <code>f<sub>x</sub> = 0, f<sub>y</sub> = 0</code>；可能有多组解，全部保留。' },
      { title: '第二步 · 算二阶偏导', html: '<code>f<sub>xx</sub>, f<sub>xy</sub>, f<sub>yy</sub></code>；若它们是常数，直接代；若含变量，在每个驻点分别算。' },
      { title: '第三步 · 算判别式', html: '<code>D = f<sub>xx</sub>f<sub>yy</sub> − f<sub>xy</sub><sup>2</sup></code>；按符号分类。' },
      { title: '第四步 · D = 0 时另想办法', html: '配方、利用定义、沿不同路径看符号变化，或画等高线。' },
      { title: '第五步 · 有界闭区域要查边界', html: '内部驻点之外，边界上的极值要用参数化或拉格朗日乘子单独求，不能漏。' }
    ] },

    { t: 'callout', kind: 'warn', title: '有界闭区域的极值别只查内部', html: '连续函数在有界闭区域上必有最大最小值（极值定理），但最大值可能出现在<b>边界</b>上。标准做法是：内部驻点全部列出并算函数值，边界用参数化或乘子法求候选点，最后比较所有候选点的函数值。只查内部驻点是本题型最常见的失分原因，尤其是区域是三角形、圆盘这类「边界很长」的情形。' },

    { t: 'h', lvl: 2, text: '七、拉格朗日乘子', id: 'ch06-7' },

    { t: 'p', html: '有约束的极值问题：在 <code>g(x, y) = c</code> 上求 <code>f</code> 的极值。几何直觉是：在极值点，<code>f</code> 的等值线与约束曲线<b>相切</b>，于是两者的法向量平行，即 <code>∇f = λ∇g</code>。这个 <code>λ</code> 就是拉格朗日乘子。<b>拉格朗日方程</b>是 <code>∇f = λ∇g</code> 加上约束 <code>g = c</code>，共三个方程解三个未知数 <code>x, y, λ</code>。' },

    { t: 'p', html: '例：在圆 <code>x<sup>2</sup> + y<sup>2</sup> = 1</code> 上求 <code>f = xy</code> 的极值。<code>∇f = ⟨y, x⟩</code>、<code>∇g = ⟨2x, 2y⟩</code>，方程 <code>y = 2λx, x = 2λy</code>。两式相乘得 <code>xy = 4λ<sup>2</sup>xy</code>，若 <code>xy ≠ 0</code> 则 <code>λ = ±1/2</code>，代回得 <code>x = ±y</code>，结合约束得四个点 <code>(±1/√2, ±1/√2)</code>，函数值 <code>±1/2</code>。最大值 <code>1/2</code>、最小值 <code>−1/2</code>。' },

    { t: 'p', html: '两个约束的情形：<code>∇f = λ∇g + μ∇h</code>，加上 <code>g = c<sub>1</sub>, h = c<sub>2</sub></code>，共五个方程。三个变量的情形同理，把 <code>∇</code> 换成三维。乘子法的解可能有多组，必须<b>全部代回比较</b>，不能只取一组就下结论；另外要检查约束曲面是否有「奇异点」（<code>∇g = 0</code> 处），那里乘子法失效，需单独处理。' },

    { t: 'p', html: '乘子 <code>λ</code> 有实际含义：它是「约束放松一点，最优值能改善多少」的速率，即影子价格。若约束是预算 <code>g = c</code>，则 <code>λ</code> 是「预算增加一单位时目标函数的增量」。这个解释在经济学与工程优化里都用得到，也是考试里偶尔会问的「解释 λ 的意义」。' },

    { t: 'terms', items: [
      { en: 'partial derivative', zh: '偏导数', html: '固定其余变量，对一个变量求导；<code>f<sub>x</sub></code> 是沿 x 方向的变化率。' },
      { en: 'differentiable', zh: '可微', html: '<code>Δf = f<sub>x</sub>Δx + f<sub>y</sub>Δy + o(ρ)</code>；比偏导存在强得多。' },
      { en: 'gradient', zh: '梯度', html: '<code>∇f = ⟨f<sub>x</sub>, f<sub>y</sub>⟩</code>；指向增长最快方向，垂直于等值线。' },
      { en: 'directional derivative', zh: '方向导数', html: '<code>D<sub>u</sub>f = ∇f·u</code>；<code>u</code> 必须是单位向量。' },
      { en: 'saddle point', zh: '鞍点', html: '驻点但非极值；判别式 <code>D &lt; 0</code>，一个方向升一个方向降。' },
      { en: 'Lagrange multiplier', zh: '拉格朗日乘子', html: '约束极值中 <code>∇f = λ∇g</code> 的比例系数；可解释为影子价格。' },
      { en: 'Hessian', zh: '海森矩阵', html: '二阶偏导组成的对称矩阵；判别式是它的行列式。' }
    ] },

    { t: 'quiz', qid: 'ch06-q1' },
    { t: 'quiz', qid: 'ch06-q2' },
    { t: 'quiz', qid: 'ch06-q3' },

    { t: 'keypoint', items: [
      { title: '极限不存在容易证', html: '找两条路径给不同答案即可；存在则要用极坐标夹逼且界与 θ 无关。' },
      { title: '偏导存在推不出连续', html: '这是多元与一元最本质的差别；要恢复「可导 ⇒ 连续」必须升级为可微。' },
      { title: '可微的实用判据', html: '偏导连续 ⇒ 可微；接缝处回到定义验证 <code>o(ρ)</code>。' },
      { title: '梯度两性质', html: '方向是增长最快，模长是最大变化率；垂直于等值线，可作切平面法向量。' },
      { title: '二阶判别看 D', html: '<code>D = f<sub>xx</sub>f<sub>yy</sub> − f<sub>xy</sub><sup>2</sup></code>；<code>D &gt; 0</code> 定极值，<code>D &lt; 0</code> 鞍点，<code>D = 0</code> 失效。' },
      { title: '乘子法别漏候选点', html: '所有解都要代回比较；边界与奇异点单独处理。' }
    ] },

    { t: 'checklist', id: 'ch06', items: [
      '我能用路径法证明 <code>xy/(x<sup>2</sup>+y<sup>2</sup>)</code> 在原点无极限',
      '我能用极坐标夹逼证明一个多元极限存在，并说明界与 θ 无关',
      '我能说出偏导存在、连续、可微三者的关系，并各举一个反例',
      '我能用链式法则求二阶偏导，且不漏 <code>f<sub>x</sub>x<sub>ss</sub></code> 这类项',
      '我能用隐函数公式求 <code>∂z/∂x</code>，并说明 <code>F<sub>z</sub> ≠ 0</code> 的作用',
      '我能求方向导数与最大变化率，并指出梯度方向',
      '我能写切平面方程与全微分，并用它做误差估计',
      '我能用二阶判别式区分极大、极小与鞍点，并处理 <code>D = 0</code>',
      '我能用拉格朗日乘子解一个等式约束的极值问题，并解释 λ 的含义'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应 Thomas《Calculus》第 13 版 SI 单位第 14.1–14.9 节：多元函数的极限与连续、偏导数、链式法则、方向导数与梯度、切平面与微分、极值与鞍点、拉格朗日乘子。按课程大纲，14.10（二元函数的泰勒公式）跳过，因此本章不展开多元泰勒定理的完整形式，只在二阶判别处使用「二阶展开决定二次型符号」的想法。约束极值只讲等式约束；不等式约束（KKT 条件）不属于本课。本章的梯度与法向量会在 ch07 的曲面积分与三大定理中反复使用。' }
  ]
});
