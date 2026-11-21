/* =====================================================================
 * ch07.js · 第 7 章「统计推断：估计、区间与检验」
 * 职责：把前六章收束成一套流程——怎么估、怎么给区间、怎么检验、
 *       以及如何解释 p 值而不误用。
 * 依据：Hogg & Tanis 第 9 版 §6.1–6.4、§7.1–7.4、§8.1–8.2；Lecture 17–18。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch07',
  num: '07',
  title: '统计推断：估计、区间与检验',
  en: 'STATISTICAL INFERENCE',
  goals: [
    '用矩估计与极大似然求点估计，并写出似然函数与对数似然',
    '用无偏性、均方误差与有效性比较估计量，并说明「无偏」不是唯一标准',
    '由枢轴量构造均值、比例、方差与差值的置信区间，并解释置信水平的频率含义',
    '写出检验的四要素（假设、统计量、拒绝域、结论），并计算两类错误与功效',
    '区分单样本、双样本与配对设计，选择正确的标准误',
    '用卡方检验处理拟合优度与独立性，并指出 p 值的常见误用'
  ],
  kp: [
    { id: 'ch07-1', title: '点估计：矩估计与极大似然' },
    { id: 'ch07-2', title: '评价估计量：无偏、MSE、有效、充分' },
    { id: 'ch07-3', title: '均值的置信区间' },
    { id: 'ch07-4', title: '比例、方差与差值的区间' },
    { id: 'ch07-5', title: '假设检验框架与两类错误' },
    { id: 'ch07-6', title: '单样本检验' },
    { id: 'ch07-7', title: '双样本检验与配对设计' },
    { id: 'ch07-8', title: '卡方检验与 p 值的正确用法' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '这一章把前面六章全部用一次', html: '估计要算期望（ch04），区间要用抽样分布（ch06），检验要算概率（ch01–ch03），双样本要比较方差（ch05–ch06）。<b>这一章没有新数学，只有新流程。</b>流程本身有固定模板：写假设 → 选统计量 → 定分布 → 算概率 → 下结论。学会模板，期末综合题就能稳定拿分；学不会，就只能靠背题型碰运气。' },

    { t: 'p', lead: true, html: '统计推断只有两个产品：<b>估计</b>（参数大概是多少）与<b>检验</b>（有没有理由认为参数等于某个值）。两者的底层工具相同——都是某个统计量的抽样分布。点估计给出一个数，区间估计给出一个范围，假设检验给出一个「拒绝/不拒绝」的判断。<b>三者不是三种方法，而是同一份不确定性以三种方式呈现。</b>' },

    { t: 'h', lvl: 2, text: '一、点估计：矩估计与极大似然', id: 'ch07-1' },

    { t: 'p', html: '<b>点估计（point estimation）</b>是用一个统计量 <code>θ̂</code> 去猜未知参数 <code>θ</code>。两种最常用的构造方法：<b>矩估计（method of moments）</b>令样本矩等于理论矩，解出参数；<b>极大似然估计（maximum likelihood estimation, MLE）</b>选使观测数据出现概率最大的参数。' },

    { t: 'p', html: '矩估计的步骤是「算—等—解」：算样本均值 <code>x̄</code>，令它等于 <code>E(X)</code>，解出参数。例如 <code>X ~ Exp(λ)</code>，<code>E(X)=1/λ</code>，令 <code>1/λ = x̄</code> 得 <code>λ̂ = 1/x̄</code>；<b>若是均匀分布 <code>U(0,θ)</code></b>，<code>E(X)=θ/2</code>，得 <code>θ̂ = 2x̄</code>。<b>矩估计简单，但不一定最优</b>：<code>2x̄</code> 可能小于样本最大值，从而给出「不可能」的估计（因为 <code>θ</code> 必须大于所有观测）。' },

    { t: 'p', html: 'MLE 的步骤是「写—取对数—求导—解」：写出似然函数 <code>L(θ) = Πf(x<sub>i</sub>;θ)</code>，取对数 <code>ℓ(θ) = Σln f(x<sub>i</sub>;θ)</code>，对 <code>θ</code> 求导令其为 0，解出 <code>θ̂</code>。<b>取对数是因为乘积变求和，求导容易，且不改变极值点</b>（<code>ln</code> 单调递增）。' },

    { t: 'steps', items: [
      { title: '例 1 · 指数分布', html: '<code>ℓ(λ) = n ln λ - λΣx<sub>i</sub></code>，求导 <code>n/λ - Σx<sub>i</sub> = 0</code>，得 <code>λ̂ = n/Σx<sub>i</sub> = 1/x̄</code>。与矩估计相同，因为指数只有一个参数、且 <code>E(X)=1/λ</code> 是单调的。' },
      { title: '例 2 · 伯努利分布', html: '<code>ℓ(p) = (Σx<sub>i</sub>)ln p + (n-Σx<sub>i</sub>)ln(1-p)</code>，求导得 <code>p̂ = x̄</code>，即样本比例。这条结论在第 4 节构造比例区间时会直接用到。' },
      { title: '例 3 · 均匀分布 <code>U(0,θ)</code>', html: '似然 <code>L(θ) = θ<sup>-n</sup></code>（当所有 <code>x<sub>i</sub> ≤ θ</code>），关于 <code>θ</code> 单调递减，所以最大值在<b>允许的最小 <code>θ</code></b> 处取到，即 <code>θ̂ = max(x<sub>i</sub>)</code>。<b>这个例子说明「求导令零」不是万能套路</b>，边界解要用单调性判断。' },
      { title: '例 4 · 正态分布', html: '<code>μ̂ = x̄</code>，<code>σ̂<sup>2</sup> = (1/n)Σ(x<sub>i</sub>-x̄)<sup>2</sup></code>。<b>注意 MLE 的方差估计分母是 <code>n</code>，是有偏的</b>；无偏版本分母才是 <code>n-1</code>。考试若问「MLE」就写 <code>n</code>，问「无偏估计」就写 <code>n-1</code>，两问不能混。' }
    ] },

    { t: 'p', html: 'MLE 有三条好性质（大样本下）：<b>一致性</b>（<code>n→∞</code> 时收敛到真值）、<b>渐近正态</b>（<code>θ̂ ≈ N(θ, 1/I(θ))</code>，<code>I</code> 是 Fisher 信息量）、<b>渐近有效</b>（方差达到克拉美–罗下界）。<b>这三条都是「渐近」性质，小样本下不一定成立</b>；<code>U(0,θ)</code> 的 MLE 就是有偏的，<code>E(max X<sub>i</sub>) = nθ/(n+1) &lt; θ</code>。' },

    { t: 'callout', kind: 'tip', title: '看到「求 MLE」先做三件事', html: '① 写出联合密度的乘积，<b>别忘写支撑集条件</b>；② 取对数，把乘积拆成和；③ 求导前先看参数在指数上还是支撑集里——<b>在支撑集里（如 <code>U(0,θ)</code>）就不能求导，要用单调性</b>。这三步能覆盖 90% 的 MLE 考题。' },

    { t: 'h', lvl: 2, text: '二、评价估计量：无偏、MSE、有效、充分', id: 'ch07-2' },

    { t: 'p', html: '<b>无偏性（unbiasedness）</b>：<code>E(θ̂) = θ</code>，即长期平均命中真值。<code>x̄</code> 是 <code>μ</code> 的无偏估计，<code>S<sup>2</sup></code> 是 <code>σ<sup>2</sup></code> 的无偏估计，而 MLE 的 <code>σ̂<sup>2</sup></code> 有偏。<b>无偏不是「好」的全部</b>：一个方差巨大的无偏估计，实际用起来可能远不如一个略有偏差但方差很小的估计。' },

    { t: 'p', html: '把偏差与方差合起来看，就是<b>均方误差（mean squared error, MSE）</b>：<code>MSE(θ̂) = E[(θ̂-θ)<sup>2</sup>] = Var(θ̂) + [Bias(θ̂)]<sup>2</sup></code>。<b>这个分解是本章最重要的公式之一</b>：它说明「准」与「稳」可以互相交换。压缩估计（shrinkage）就是主动引入一点偏差，换取方差大幅下降，从而使 MSE 更小。' },

    { t: 'p', html: '<b>有效性（efficiency）</b>比较两个无偏估计的方差：方差小者更有效。<b>充分性（sufficiency）</b>指统计量包含了样本中关于参数的全部信息，形式化定义是条件分布 <code>f(x<sub>1</sub>,…,x<sub>n</sub>|T=t)</code> 不依赖 <code>θ</code>。判别常用<b>因子分解定理</b>：若联合密度能写成 <code>g(T,θ)h(x)</code>，则 <code>T</code> 充分。' },

    { t: 'table', head: ['标准', '定义', '用途'], rows: [
      ['无偏', '<code>E(θ̂)=θ</code>', '排除系统性偏差'],
      ['有效', '无偏估计中方差最小', '比较两个无偏估计'],
      ['MSE', '<code>Var + Bias<sup>2</sup></code>', '允许有偏时比较总体优劣'],
      ['充分', '包含参数的全部信息', '判断能否只保留 <code>T</code> 而不损失信息'],
      ['一致', '<code>θ̂ →<sub>p</sub> θ</code>', '大样本下的基本要求']
    ], caption: '五个标准各管一件事，考试常要求「判断并说明理由」' },

    { t: 'p', html: '一个经典比较：估计 <code>U(0,θ)</code> 的 <code>θ</code>。矩估计 <code>θ̂<sub>1</sub> = 2x̄</code> 无偏，方差 <code>θ<sup>2</sup>/(3n)</code>；MLE <code>θ̂<sub>2</sub> = max X<sub>i</sub></code> 有偏（<code>E = nθ/(n+1)</code>），但方差量级是 <code>θ<sup>2</sup>/n<sup>2</sup></code>，<b>比前者小一个数量级</b>。若用修正版 <code>θ̂<sub>3</sub> = (n+1)/n·max X<sub>i</sub></code>，它既无偏又比 <code>2x̄</code> 有效得多。<b>这个例子说明：MLE 即使有偏，也常常是更好的选择。</b>' },

    { t: 'h', lvl: 2, text: '三、均值的置信区间', id: 'ch07-3' },

    { t: 'p', html: '<b>置信区间（confidence interval, CI）</b>是一个随机区间，它以给定概率覆盖真参数。95% 置信区间的正确读法是：<b>如果重复抽样很多次，每次构造一个区间，约 95% 的区间会包含 <code>μ</code></b>。<b>不是</b>「<code>μ</code> 有 95% 的概率落在这个具体区间里」——<code>μ</code> 是常数，区间一旦算出就固定，概率只能是 0 或 1。<b>随机的是区间，不是参数。</b>' },

    { t: 'p', html: '构造方法叫<b>枢轴量法（pivotal quantity）</b>：找一个含 <code>θ</code> 但分布已知、不依赖 <code>θ</code> 的量 <code>Q</code>，写出 <code>P(a ≤ Q ≤ b) = 1-α</code>，再对 <code>θ</code> 解不等式。均值的情形：<b><code>σ</code> 已知</b>时 <code>Q = (x̄-μ)/(σ/√n) ~ N(0,1)</code>，得 <code>x̄ ± z<sub>α/2</sub>·σ/√n</code>；<b><code>σ</code> 未知</b>时用 <code>S</code> 代替，<code>Q = (x̄-μ)/(S/√n) ~ t(n-1)</code>，得 <code>x̄ ± t<sub>α/2</sub>(n-1)·S/√n</code>。' },

    { t: 'table', head: ['情形', '统计量', '分布', '区间'], rows: [
      ['<code>σ</code> 已知', '<code>(x̄-μ)/(σ/√n)</code>', '<code>N(0,1)</code>', '<code>x̄ ± z<sub>α/2</sub>σ/√n</code>'],
      ['<code>σ</code> 未知、正态总体', '<code>(x̄-μ)/(S/√n)</code>', '<code>t(n-1)</code>', '<code>x̄ ± t<sub>α/2</sub>S/√n</code>'],
      ['大样本、任意总体', '同上（用 <code>S</code>）', '近似 <code>N(0,1)</code>', '<code>x̄ ± z<sub>α/2</sub>S/√n</code>']
    ], caption: '三行覆盖了 90% 的均值区间题；区别只在「用 z 还是 t」' },

    { t: 'p', html: '<b>区间宽度由三样东西决定</b>：置信水平（越高越宽）、样本量（越大越窄，按 <code>1/√n</code>）、总体波动 <code>σ</code>。<b>「95% 区间比 90% 宽」不是缺陷，是代价</b>：想更有把握覆盖真值，就必须接受更宽的范围。反过来，若只追求窄，可以报 50% 区间，但它一半时候是错的。' },

    { t: 'callout', kind: 'warn', title: '「95% 概率包含 μ」是错的', html: '这句话把 <code>μ</code> 当成了随机变量。正确的两种说法：<b>频率派</b>——「重复抽样下 95% 的区间会覆盖 <code>μ</code>」；<b>贝叶斯派</b>——「给定数据与先验，<code>μ</code> 落在此区间的后验概率是 95%」，那是可信区间（credible interval），不是置信区间。<b>考试写「有 95% 的把握」可以，写「<code>μ</code> 有 95% 概率落在其中」会被扣分。</b>' },

    { t: 'h', lvl: 2, text: '四、比例、方差与差值的区间', id: 'ch07-4' },

    { t: 'p', html: '<b>比例的区间</b>：<code>p̂ = x/n</code>，由 CLT 得 <code>p̂ ≈ N(p, p(1-p)/n)</code>，于是 <code>p̂ ± z<sub>α/2</sub>√(p̂(1-p̂)/n)</code>（Wald 区间）。<b>它在 <code>p̂</code> 接近 0 或 1、或 <code>n</code> 很小时表现很差</b>，可能给出超出 <code>[0,1]</code> 的端点。更稳的是 <b>Wilson 区间</b>或加 2 成功 2 失败的<b>加四区间（Agresti–Coull）</b>，本站不展开公式，但要知道 Wald 不是唯一选择。' },

    { t: 'p', html: '<b>方差的区间</b>：由 <code>(n-1)S<sup>2</sup>/σ<sup>2</sup> ~ χ<sup>2</sup>(n-1)</code> 反解，得 <code>[(n-1)S<sup>2</sup>/χ<sup>2</sup><sub>α/2</sub>, (n-1)S<sup>2</sup>/χ<sup>2</sup><sub>1-α/2</sub>]</code>。<b>注意 <code>χ<sup>2</sup></code> 不对称，所以两侧分位数不能像 <code>z</code> 那样对称取</b>，必须分别查左右尾；把区间写成 <code>S<sup>2</sup> ± ...</code> 是错的。' },

    { t: 'p', html: '<b>两均值差的区间</b>：独立样本、方差未知但相等时，用<b>合并方差</b> <code>S<sub>p</sub><sup>2</sup> = [(n<sub>1</sub>-1)S<sub>1</sub><sup>2</sup>+(n<sub>2</sub>-1)S<sub>2</sub><sup>2</sup>]/(n<sub>1</sub>+n<sub>2</sub>-2)</code>，区间为 <code>(x̄<sub>1</sub>-x̄<sub>2</sub>) ± t<sub>α/2</sub>(n<sub>1</sub>+n<sub>2</sub>-2)·S<sub>p</sub>√(1/n<sub>1</sub>+1/n<sub>2</sub>)</code>。<b>方差不等时用 Welch 近似，自由度用公式算，通常不是整数。</b>' },

    { t: 'table', head: ['参数', '点估计', '标准误', '分布'], rows: [
      ['<code>μ</code>', '<code>x̄</code>', '<code>S/√n</code>', '<code>t(n-1)</code>'],
      ['<code>p</code>', '<code>x/n</code>', '<code>√(p̂(1-p̂)/n)</code>', '近似 <code>N(0,1)</code>'],
      ['<code>σ<sup>2</sup></code>', '<code>S<sup>2</sup></code>', '—（不对称）', '<code>χ<sup>2</sup>(n-1)</code>'],
      ['<code>μ<sub>1</sub>-μ<sub>2</sub></code>', '<code>x̄<sub>1</sub>-x̄<sub>2</sub></code>', '<code>S<sub>p</sub>√(1/n<sub>1</sub>+1/n<sub>2</sub>)</code>', '<code>t(n<sub>1</sub>+n<sub>2</sub>-2)</code>'],
      ['<code>p<sub>1</sub>-p<sub>2</sub></code>', '<code>p̂<sub>1</sub>-p̂<sub>2</sub></code>', '<code>√(p̂<sub>1</sub>(1-p̂<sub>1</sub>)/n<sub>1</sub>+p̂<sub>2</sub>(1-p̂<sub>2</sub>)/n<sub>2</sub>)</code>', '近似 <code>N(0,1)</code>']
    ], caption: '五种区间，记住「点估计 ± 临界值 × 标准误」的模板即可' },

    { t: 'p', html: '<b>差值区间的解释要特别小心</b>：若 <code>μ<sub>1</sub>-μ<sub>2</sub></code> 的 95% 区间是 <code>(-2, 5)</code>，正确结论是「没有足够证据说两者不同」，而不是「两者相同」。<b>区间宽说明数据不足以区分，不说明差异不存在</b>——样本量小时区间必然宽，这时「不显著」几乎必然发生，不能当作「无差异」的证据。' },

    { t: 'h', lvl: 2, text: '五、假设检验框架与两类错误', id: 'ch07-5' },

    { t: 'p', html: '假设检验的四要素：<b>（1）原假设 <code>H<sub>0</sub></code> 与备择假设 <code>H<sub>1</sub></code></b>，通常是「无差异/无效应」对「有差异」；<b>（2）检验统计量</b>，在 <code>H<sub>0</sub></code> 下分布已知；<b>（3）拒绝域或 p 值</b>，由显著性水平 <code>α</code> 决定；<b>（4）结论</b>，措辞必须是「拒绝 <code>H<sub>0</sub></code>」或「不拒绝 <code>H<sub>0</sub></code>」，<b>不能写「接受 <code>H<sub>0</sub></code>」</b>。' },

    { t: 'p', html: '<b>两类错误</b>：<b>第一类错误（Type I）</b>是 <code>H<sub>0</sub></code> 为真时拒绝了它，概率记 <code>α</code>，也叫「弃真」；<b>第二类错误（Type II）</b>是 <code>H<sub>0</sub></code> 为假时没有拒绝，概率记 <code>β</code>，也叫「存伪」。<b>功效（power）</b>是 <code>1-β</code>，即「正确地拒绝了错误的 <code>H<sub>0</sub></code>」的概率。' },

    { t: 'table', head: ['', '<code>H<sub>0</sub></code> 为真', '<code>H<sub>0</sub></code> 为假'], rows: [
      ['拒绝 <code>H<sub>0</sub></code>', '第一类错误（<code>α</code>）', '正确（功效 <code>1-β</code>）'],
      ['不拒绝 <code>H<sub>0</sub></code>', '正确（<code>1-α</code>）', '第二类错误（<code>β</code>）']
    ], caption: '四格表：检验永远在两种错误之间做交换' },

    { t: 'p', html: '在 <code>n</code> 固定时，<b><code>α</code> 减小必然导致 <code>β</code> 增大</b>——把拒绝门槛提高，虽然更少冤枉 <code>H<sub>0</sub></code>，但也更容易放过真实的差异。<b>唯一能同时降低两者的办法是增大样本量</b>，因为更大的 <code>n</code> 让 <code>x̄</code> 的分布更窄，两个假设下的分布重叠更少。这就是「统计功效不足的研究不可信」的原因：<code>n</code> 太小，即使效应真实存在，也很难被检出。' },

    { t: 'p', html: '功效分析的四个量互相牵制：<b>效应量（<code>δ</code>）、样本量 <code>n</code>、显著性水平 <code>α</code>、功效 <code>1-β</code></b>，知道三个可求第四个。常见公式（单样本均值）为 <code>n ≈ (z<sub>α</sub>+z<sub>β</sub>)<sup>2</sup>σ<sup>2</sup>/δ<sup>2</sup></code>。<b>注意这里的 <code>z<sub>α</sub></code> 是单侧分位数</b>，双侧检验要用 <code>z<sub>α/2</sub></code>，写错会低估所需样本量。' },

    { t: 'p', html: '<b>p 值</b>的定义是：在 <code>H<sub>0</sub></code> 为真的前提下，得到「当前观测或更极端」结果的概率。<b>它不是「<code>H<sub>0</sub></code> 为真的概率」，也不是「结果由随机造成的概率」</b>。p 值小只说明「如果 <code>H<sub>0</sub></code> 成立，这样的数据很罕见」，从而让 <code>H<sub>0</sub></code> 显得可疑；它不能告诉你 <code>H<sub>0</sub></code> 到底有多大可能为真。' },

    { t: 'callout', kind: 'exam', title: '检验题的固定书写模板', html: '① 写出 <code>H<sub>0</sub></code> 与 <code>H<sub>1</sub></code>（含参数与方向）；② 写出统计量与 <code>H<sub>0</sub></code> 下的分布；③ 代入数据算统计量值；④ 查临界值或算 p 值；⑤ 比较并下结论（<b>「在 <code>α=0.05</code> 下拒绝/不拒绝 <code>H<sub>0</sub></code>」</b>）；⑥ 用一句话解释实际含义。<b>少写第 ② 或第 ⑥ 步，通常扣 2–3 分。</b>' },

    { t: 'h', lvl: 2, text: '六、单样本检验', id: 'ch07-6' },

    { t: 'p', html: '单样本均值检验的统计量就是第 3 节枢轴量的「代入版」：<code>t = (x̄-μ<sub>0</sub>)/(S/√n)</code>，在 <code>H<sub>0</sub>: μ=μ<sub>0</sub></code> 下服从 <code>t(n-1)</code>。<b>拒绝域的方向由 <code>H<sub>1</sub></code> 决定</b>：<code>H<sub>1</sub>: μ&gt;μ<sub>0</sub></code> 时右尾，<code>μ&lt;μ<sub>0</sub></code> 时左尾，<code>μ≠μ<sub>0</sub></code> 时双尾。' },

    { t: 'p', html: '用第 0 章的灯泡例子：<code>n=25</code>、<code>x̄=1020</code>、<code>S=200</code>、<code>μ<sub>0</sub>=1000</code>，检验 <code>H<sub>0</sub>: μ ≥ 1000</code> 对 <code>H<sub>1</sub>: μ &lt; 1000</code>。<b>注意原假设写成 <code>≥</code> 是合法的</b>，因为检验在边界 <code>μ=1000</code> 处计算最保守；统计量 <code>t = 20/(200/5) = 0.5</code>，自由度 24，左尾临界值约 <code>-1.711</code>。<code>0.5</code> 远大于临界值，<b>不拒绝 <code>H<sub>0</sub></code></b>，即没有证据说寿命低于 1000。' },

    { t: 'p', html: '<b>「不拒绝」不等于「证明达标」。</b>样本均值 1020 只比 1000 高 20，标准误却有 40，数据本身分辨不出「1000」与「1020」。要证明「不低于 1000」，需要更小的标准误（更大 <code>n</code>）或更高的 <code>x̄</code>。<b>这正是「缺乏证据不等于证据缺乏」（absence of evidence is not evidence of absence）的统计版本。</b>' },

    { t: 'p', html: '单样本还有三种常见形态：<b>比例检验</b> <code>z = (p̂-p<sub>0</sub>)/√(p<sub>0</sub>(1-p<sub>0</sub>)/n)</code>，<b>分母用 <code>H<sub>0</sub></code> 下的 <code>p<sub>0</sub></code> 而不是 <code>p̂</code></b>（这是与区间不同的关键点）；<b>方差检验</b> <code>χ<sup>2</sup> = (n-1)S<sup>2</sup>/σ<sub>0</sub><sup>2</sup> ~ χ<sup>2</sup>(n-1)</code>；<b>符号检验</b>用二项分布，不依赖正态假设，适合小样本或序数数据。' },

    { t: 'p', html: '检验与区间有一个精确对应：<b>双侧 <code>α</code> 检验拒绝 <code>μ=μ<sub>0</sub></code>，当且仅当 <code>μ<sub>0</sub></code> 落在 <code>1-α</code> 置信区间之外</b>。所以「区间包含 0」与「差值不显著」是同一件事。这个对应让两种报告的结论必须一致；若你算出的区间包含 0 而检验说显著，一定是某一步算错了。' },

    { t: 'h', lvl: 2, text: '七、双样本检验与配对设计', id: 'ch07-7' },

    { t: 'p', html: '比较两组时，第一个问题不是「用什么检验」，而是<b>「这两组是独立的还是配对的」</b>。<b>独立样本</b>：两组人互不重叠，各自抽样；<b>配对样本</b>：同一个人前后两次测量，或按某个特征一一配对。<b>配对设计把「个体差异」消掉了，通常功效更高</b>，但要求配对有意义。' },

    { t: 'p', html: '独立样本的 <code>t</code> 检验（方差相等版）：<code>t = (x̄<sub>1</sub>-x̄<sub>2</sub>)/[S<sub>p</sub>√(1/n<sub>1</sub>+1/n<sub>2</sub>)]</code>，自由度 <code>n<sub>1</sub>+n<sub>2</sub>-2</code>。<b>使用前要先检验方差齐性</b>（<code>F</code> 检验或 Levene 检验）；若方差不齐，用 Welch 的 <code>t</code>，自由度按 Satterthwaite 公式近似。<b>实务上 Welch 更稳健，很多软件默认用它</b>，不先检验方差齐性。' },

    { t: 'p', html: '配对检验本质上变成<b>单样本</b>：令 <code>D<sub>i</sub> = X<sub>i</sub>-Y<sub>i</sub></code>，检验 <code>E(D)=0</code>，统计量 <code>t = d̄/(S<sub>D</sub>/√n)</code>，自由度 <code>n-1</code>。<b>配对的关键在于「先做差、再检验」，而不是把两组当独立样本算</b>。若误用独立样本公式，会忽略个体间的正相关，标准误被高估，检验变得过于保守。' },

    { t: 'table', head: ['设计', '统计量', '自由度', '何时用'], rows: [
      ['单样本', '<code>(x̄-μ<sub>0</sub>)/(S/√n)</code>', '<code>n-1</code>', '一组数据对某个基准'],
      ['独立双样本（等方差）', '<code>(x̄<sub>1</sub>-x̄<sub>2</sub>)/(S<sub>p</sub>√(1/n<sub>1</sub>+1/n<sub>2</sub>))</code>', '<code>n<sub>1</sub>+n<sub>2</sub>-2</code>', '两组互不重叠、方差相近'],
      ['独立双样本（Welch）', '分母用各自方差', '近似（非整数）', '方差不齐或不确定'],
      ['配对', '<code>d̄/(S<sub>D</sub>/√n)</code>', '<code>n-1</code>', '同一对象前后测量'],
      ['两比例', '<code>(p̂<sub>1</sub>-p̂<sub>2</sub>)/SE<sub>0</sub></code>', '近似 <code>z</code>', '两组成功率比较']
    ], caption: '先判断设计，再选公式；顺序反了必错' },

    { t: 'p', html: '两比例检验的 <code>SE<sub>0</sub></code> 要用<b>合并比例</b> <code>p̂ = (x<sub>1</sub>+x<sub>2</sub>)/(n<sub>1</sub>+n<sub>2</sub>)</code>，因为 <code>H<sub>0</sub></code> 假设两者相等，应共用同一个 <code>p</code>。<b>这与置信区间用各自 <code>p̂<sub>i</sub></code> 不同</b>——检验在 <code>H<sub>0</sub></code> 下算，区间不为任何假设服务。这个差别是双比例题的高频失分点。' },

    { t: 'h', lvl: 2, text: '八、卡方检验与 p 值的正确用法', id: 'ch07-8' },

    { t: 'p', html: '<b>拟合优度检验（goodness-of-fit）</b>判断数据是否来自某个指定分布：把观测值分成 <code>k</code> 个类，统计量 <code>χ<sup>2</sup> = Σ(O<sub>i</sub>-E<sub>i</sub>)<sup>2</sup>/E<sub>i</sub></code>，在 <code>H<sub>0</sub></code> 下近似服从 <code>χ<sup>2</sup>(k-1-r)</code>，<code>r</code> 是<b>用数据估计的参数个数</b>。<b>每估一个参数就少一个自由度</b>，这条最容易漏。' },

    { t: 'p', html: '<b>独立性检验</b>判断两个分类变量是否独立：列联表的期望频数 <code>E<sub>ij</sub> = (行合计×列合计)/总数</code>，统计量同上，自由度 <code>(r-1)(c-1)</code>。<b>两个检验的公式一模一样，区别只在期望频数怎么算、自由度怎么定。</b>另外，<code>E<sub>ij</sub></code> 太小（一般要求 ≥5）时近似不准，需要合并类别或改用精确检验。' },

    { t: 'p', html: '最后必须说清 p 值的三个误用。<b>误用一：把 p 值当「<code>H<sub>0</sub></code> 为真的概率」。</b>p 值是「<code>H<sub>0</sub></code> 为真时数据的概率」，方向恰好相反。<b>误用二：把「p &lt; 0.05」当「效应大」。</b>样本量足够大时，任何微小差异都会显著；<b>显著性说的是「不太可能是偶然」，不是「差异重要」</b>，要配合效应量与区间看。<b>误用三：把「p &gt; 0.05」当「无差异」。</b>这只说明数据不足以拒绝，可能只是样本量不足。' },

    { t: 'callout', kind: 'warn', title: '多重比较会让假阳性暴涨', html: '做 20 次独立的 <code>α=0.05</code> 检验，至少一次假阳性的概率是 <code>1-0.95<sup>20</sup> ≈ 0.64</code>。<b>「多试几次总能显著」不是玩笑，是概率的必然结果。</b>解决办法是校正：Bonferroni 把每次的 <code>α</code> 除以检验次数，或用 FDR 控制。<b>看到「研究做了 30 个指标，其中 3 个显著」时，先问有没有校正。</b>' },

    { t: 'quiz', qid: 'ch07-q1' },
    { t: 'quiz', qid: 'ch07-q2' },
    { t: 'quiz', qid: 'ch07-q3' },

    { t: 'keypoint', items: [
      { title: 'MLE 四步：写似然、取对数、求导、求解', html: '参数在支撑集里（如 <code>U(0,θ)</code>）时不能求导，要用单调性，解在边界。' },
      { title: '无偏不是唯一标准', html: '<code>MSE = Var + Bias<sup>2</sup></code>；有偏但方差小的估计可能更好。' },
      { title: '区间是随机的，参数是固定的', html: '95% 指「重复抽样下 95% 的区间覆盖真值」，不是「<code>μ</code> 落在其中的概率」。' },
      { title: '区间模板：点估计 ± 临界值 × 标准误', html: '均值用 <code>t</code>、比例用 <code>z</code>、方差用 <code>χ<sup>2</sup></code>、差值用合并标准误。' },
      { title: '检验只写「拒绝」或「不拒绝」', html: '不拒绝 <code>H<sub>0</sub></code> 不等于接受，也不等于证明它成立。' },
      { title: '<code>α</code> 与 <code>β</code> 此消彼长，只有 <code>n</code> 能同时降', html: '功效 <code>1-β</code> 不足的研究，阴性结果说明不了问题。' },
      { title: 'p 值不是 <code>H<sub>0</sub></code> 为真的概率', html: '它是「<code>H<sub>0</sub></code> 为真时，得到这么极端数据的概率」，方向不能反。' }
    ] },

    { t: 'checklist', id: 'ch07', items: [
      '我能对指数、伯努利、正态分布写出似然函数并求出 MLE',
      '我能说明 <code>U(0,θ)</code> 的 MLE 为什么是 <code>max X<sub>i</sub></code>，以及它为何有偏',
      '我能写出 <code>MSE = Var + Bias<sup>2</sup></code>，并解释「用偏差换方差」何时划算',
      '我能用枢轴量法推出均值的 <code>t</code> 区间，并说清 <code>z</code> 与 <code>t</code> 的选用条件',
      '我能正确解释 95% 置信水平，并指出「<code>μ</code> 有 95% 概率落入」错在哪',
      '我能为比例、方差、两均值差分别写出区间，并说明各自的分布',
      '我能写出假设检验的四要素，并用四格表说明两类错误',
      '我能解释为什么增大 <code>n</code> 能同时降低 <code>α</code> 与 <code>β</code>',
      '我能判断双样本该用独立还是配对，并写出对应的标准误与自由度',
      '我能说出 p 值的三个常见误用，以及多重比较为何需要校正'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 Hogg & Tanis 第 9 版 §6.1–6.4（估计、充分性、MSE）与 §7.1–7.4、§8.1–8.2（区间、检验、卡方），对应 STA2001 Lecture 17–18。灯泡例子沿用第 0 章设定（<code>n=25, x̄=1020, S=200</code>），检验结果 <code>t=0.5</code> 与区间 <code>(937,1103)</code> 可互相复核；<code>U(0,θ)</code> 的三种估计量比较取自课程习题。Wald 区间的缺陷与 Wilson 区间只提及不展开，配对检验按「先做差再单样本」处理。p 值误用与多重比较部分参考了近年统计教育界的共识，属于对教材结论的补充说明，不影响考点。若你的课程不考充分性，可跳过第 2 节最后一段。' }
  ]
});
