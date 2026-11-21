/* =====================================================================
 * ch04.js · 第 4 章「估计量的评价与充分性」
 * 职责：无偏性、MSE 与偏差-方差权衡；有效性、一致性、渐近正态；
 *       充分统计量；Fisher 信息与 CRLB；Rao-Blackwell 与 UMVUE。
 * 依据：STA2002 讲义估计量评价部分与期末卷中「证明无偏/求 CRLB」一类题。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch04',
  num: '04',
  title: '估计量的评价与充分性',
  en: 'EVALUATING ESTIMATORS',
  goals: [
    '计算估计量的偏差与均方误差，并解释偏差-方差权衡',
    '判断两个估计量谁更有效，并说明一致性的含义',
    '用因子分解定理识别充分统计量，理解它为什么能压缩数据',
    '计算 Fisher 信息并用 Cramér-Rao 下界判断估计量是否达到最优',
    '用 Rao-Blackwell 定理改进估计量，说明 UMVUE 的来历'
  ],
  kp: [
    { id: 'ch04-1', title: '无偏性与偏差' },
    { id: 'ch04-2', title: '均方误差与偏差-方差权衡' },
    { id: 'ch04-3', title: '有效性、一致性与渐近正态' },
    { id: 'ch04-4', title: '充分统计量与因子分解' },
    { id: 'ch04-5', title: 'Fisher 信息与 Cramér-Rao 下界' },
    { id: 'ch04-6', title: 'Rao-Blackwell 与最小方差无偏' },
    { id: 'ch04-7', title: '常见错误与自检' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么「估得出来」还不够', html: 'ch03 给了你一堆估计量：X̄、<code>1/X̄</code>、最大值、除以 n 的方差。它们都能算出一个数，但<b>好坏差别很大</b>：有的系统性偏高，有的方差大得没法用，有的浪费了数据里的信息。更麻烦的是，单看一次估计值完全看不出这些问题——必须回到「重复抽样」的视角，比较它们的分布。这一章给出四把尺子：无偏性（准不准）、均方误差（综合误差）、有效性（谁更省）、充分性（有没有浪费信息），最后用 Cramér-Rao 下界回答「还能不能更好」。' },

    { t: 'p', lead: true, html: '评价估计量不是比谁算得快，而是比它们的抽样分布。<b>无偏</b>看分布的中心是否落在真值上；<b>方差</b>看分布有多宽；<b>均方误差</b>把两者合成一个数；<b>一致性</b>看样本量增大时分布是否收缩到真值；<b>有效性</b>比较同样无偏的两个估计量谁方差更小。这几把尺子有时互相冲突——有偏的估计量可能 MSE 更小——所以「好」必须相对于你关心什么来定义。本章把这些标准逐一拆开，并给出一套可操作的判定流程。' },

    { t: 'h', lvl: 2, text: '一、无偏性与偏差', id: 'ch04-1' },

    { t: 'p', html: '若 <code>E(θ̂) = θ</code> 对一切 θ 成立，称 θ̂ 是 θ 的<b>无偏估计量</b>（unbiased estimator）；偏差（bias）定义为 <code>Bias(θ̂) = E(θ̂) − θ</code>。无偏的意思是「重复抽样很多次，平均下来正好命中」，而不是「这一次一定准」。单个估计值可能偏高也可能偏低，无偏性只保证长期平均没有系统误差。反过来，有偏也不等于不能用：若偏差随 n 增大趋于 0，仍然可以接受，这叫渐近无偏。' },

    { t: 'p', html: '几个必须记住的结论。<code>X̄</code> 是 μ 的无偏估计，因为 <code>E(X̄) = μ</code>。样本方差 <code>S² = (1/(n−1))Σ(Xᵢ−X̄)²</code> 是 σ² 的无偏估计；若除以 n，则 <code>E(σ̂²) = (n−1)σ²/n</code>，偏低 <code>σ²/n</code>。均匀分布 <code>Uniform(0,θ)</code> 的 MLE 是 <code>max Xᵢ</code>，它的期望是 <code>nθ/(n+1)</code>，偏差 <code>−θ/(n+1)</code>；乘上 <code>(n+1)/n</code> 就无偏了。' },

    { t: 'table', caption: '常见估计量的偏差（样本量 n）', head: ['参数', '估计量', '期望', '偏差'], rows: [
      ['μ（总体均值）', '<code>X̄</code>', '<code>μ</code>', '<code>0</code>（无偏）'],
      ['σ²', '<code>S² = Σ(Xᵢ−X̄)²/(n−1)</code>', '<code>σ²</code>', '<code>0</code>（无偏）'],
      ['σ²', '<code>σ̂²<sub>MLE</sub> = Σ(Xᵢ−X̄)²/n</code>', '<code>(n−1)σ²/n</code>', '<code>−σ²/n</code>'],
      ['θ（Uniform 上界）', '<code>max Xᵢ</code>', '<code>nθ/(n+1)</code>', '<code>−θ/(n+1)</code>'],
      ['θ（Uniform 上界）', '<code>(n+1)/n · max Xᵢ</code>', '<code>θ</code>', '<code>0</code>（无偏）']
    ] },

    { t: 'quiz', qid: 'ch04-q1' },

    { t: 'h', lvl: 2, text: '二、均方误差与偏差-方差权衡', id: 'ch04-2' },

    { t: 'p', html: '无偏只管中心，不管宽度。把两者合起来就是均方误差（mean squared error, MSE）：<code>MSE(θ̂) = E[(θ̂ − θ)²]</code>。它有一个好用的分解：<code>MSE = Var(θ̂) + [Bias(θ̂)]²</code>。无偏估计的 MSE 就是方差，所以比较两个无偏估计量时，比方差就够了；一旦允许有偏，比较就必须回到 MSE，因为小的偏差可能换来大幅的方差下降。' },

    { t: 'p', html: '看一个真实的权衡。设 <code>X ~ N(μ, σ²)</code>，考虑收缩估计 <code>θ̂<sub>c</sub> = cX̄</code>（0 &lt; c ≤ 1）。它的偏差是 <code>(c−1)μ</code>，方差是 <code>c²σ²/n</code>，所以 <code>MSE(c) = c²σ²/n + (c−1)²μ²</code>。对 c 求导令零，得最优 <code>c* = μ²/(μ² + σ²/n)</code>。代入电池数据（μ = 968、σ = 90、n = 25）：<code>σ²/n = 324</code>，<code>c* = 937024/937348 ≈ 0.99965</code>，几乎等于 1——此时收缩带来的改善微乎其微，说明数据本身已经足够精确。' },

    { t: 'p', html: '但如果换一个场景，结论就完全不同。若 μ 很小（比如真实均值只有 5）、σ = 90、n = 25，则 <code>c* = 25/(25 + 324) ≈ 0.072</code>，最优估计会把 X̄ 大幅拉向 0，MSE 从 324 降到约 23。这不是数学游戏：当信号很弱、噪声很大时，刻意引入偏差（往先验或零点收缩）反而让总体误差更小。岭回归、经验贝叶斯、James-Stein 估计都是这个思想的产物。所以说「无偏最好」只在一类损失函数与一类约束下成立，不是普遍真理。' },

    { t: 'compare', left: { title: '无偏优先：报告与审计', html: '当你需要「长期平均不偏」的可解释性（官方统计、审计抽样），偏差会被质疑，宁可要一个稍宽但中心正确的估计。此时 MSE 的分解里偏差项必须为零。' }, right: { title: 'MSE 优先：预测与决策', html: '当你只关心预测误差或决策损失，允许用偏差换方差。收缩估计、正则化、集成平均都是这条路，实际预测表现往往更好。' } },

    { t: 'h', lvl: 2, text: '三、有效性、一致性与渐近正态', id: 'ch04-3' },

    { t: 'p', html: '两个估计量都无偏时，方差小的更<b>有效</b>（efficient）。相对有效性定义为 <code>eff(θ̂₁, θ̂₂) = Var(θ̂₂)/Var(θ̂₁)</code>，大于 1 说明 θ̂₁ 更好。经典例子：正态总体用中位数估 μ，样本中位数的渐近方差约为 <code>πσ²/(2n) ≈ 1.571σ²/n</code>，而 X̄ 只有 <code>σ²/n</code>，相对有效性约 0.64——为了抗离群点，中位数牺牲了约 36% 的效率。这个数字解释了「为什么正态数据不该用中位数」。' },

    { t: 'p', html: '一致性（consistency）是另一把尺子：若对任意 ε &gt; 0，<code>P(|θ̂<sub>n</sub> − θ| &gt; ε) → 0</code>，称 θ̂<sub>n</sub> 依概率收敛到 θ，记作 <code>θ̂<sub>n</sub> →<sub>p</sub> θ</code>。一个常用的充分条件：偏差与方差都趋于 0（切比雪夫不等式）。X̄ 与 S² 都相合；<code>max Xᵢ</code> 也相合，因为偏差 <code>−θ/(n+1) → 0</code>、方差 <code>→ 0</code>。相合性是最低要求：一个不相合的估计量，样本再多也不会更准，等于没用。' },

    { t: 'p', html: '大多数「好」估计量还有渐近正态性：<code>√n(θ̂ − θ) →<sub>d</sub> N(0, v)</code>。对 MLE，<code>v = 1/I₁(θ)</code>，其中 I₁ 是单个观测的 Fisher 信息。这条性质是 ch05 大样本区间与 ch06 Wald 检验的基础：不管总体是什么，只要 n 够大，<code>θ̂</code> 就近似正态，标准误可以估、区间可以算。<b>无偏、相合、渐近正态、有效</b>这四件事并不等价，答题时要说清你在证哪一条。' },

    { t: 'p', html: '估计量的函数怎么办？用 delta 方法（delta method）：若 <code>θ̂</code> 渐近正态、方差为 v/n，则对光滑函数 g，<code>g(θ̂)</code> 也渐近正态，方差为 <code>[g′(θ)]²v/n</code>。例如估计对数赔率 <code>log(p/(1−p))</code>，<code>g′(p) = 1/[p(1−p)]</code>，代入 <code>v = p(1−p)</code> 得方差 <code>1/[np(1−p)]</code>。这条公式在 logistic 回归的报告里天天出现，也是「先估参数再变换」时标准误必须跟着变换的原因。' },

    { t: 'table', caption: '四把尺子的定义与关系', head: ['标准', '定义', '关心什么', '典型反例'], rows: [
      ['无偏', '<code>E(θ̂) = θ</code>', '长期中心是否命中', '<code>max Xᵢ</code> 估 θ 有偏'],
      ['有效', '无偏中方差最小', '同样准的前提下谁更省', '中位数估正态均值效率 0.64'],
      ['相合', '<code>θ̂ →<sub>p</sub> θ</code>', 'n 增大是否收敛', '只用第一个观测 x₁ 估 μ'],
      ['渐近正态', '<code>√n(θ̂−θ) →<sub>d</sub> N(0,v)</code>', '能否用正态做区间', '均匀分布上界的 MLE']
    ] },

    { t: 'h', lvl: 2, text: '四、充分统计量与因子分解', id: 'ch04-4' },

    { t: 'p', html: '充分统计量（sufficient statistic）回答的是「数据里的信息有没有被浪费」。若给定 T(X) 后，样本的条件分布不再依赖 θ，则 T 是充分的：<b>知道 T 就等于知道了关于 θ 的全部信息</b>，剩下的样本细节只是噪声。判定靠因子分解定理（factorization theorem）：<code>f(x₁,…,xₙ; θ) = g(T(x); θ) · h(x)</code>，其中 g 只通过 T 依赖数据，h 不含 θ。找到这样的分解，T 就是充分统计量。' },

    { t: 'p', html: '五个必须认得的结论：Bernoulli 与 Poisson 的充分统计量是 <code>ΣXᵢ</code>；正态在 σ 已知时是 <code>X̄</code>，在 μ、σ² 都未知时是 <code>(X̄, S²)</code>；均匀分布 <code>Uniform(0,θ)</code> 的是 <code>max Xᵢ</code>。注意最后这个：顺序统计量里的最大值包含了「θ 至少有多大」的全部信息，其余观测的条件分布是 <code>Uniform(0, max)</code>，与 θ 无关——这正是充分性的定义。' },

    { t: 'p', html: '充分统计量的实际价值是<b>数据压缩</b>。一百万个 Bernoulli 观测，对 p 而言只需要成功次数 S；一旦知道 S，具体哪几次成功不再提供任何关于 p 的信息。这也解释了为什么 MLE 总可以写成充分统计量的函数（若充分统计量存在）：似然通过 T 依赖 θ，最大化自然只在 T 上发生。极小充分统计量（minimal sufficient）则是「压缩到不能再压」的那一个，判定方法是看似然比 <code>f(x;θ)/f(y;θ)</code> 是否与 θ 无关。' },

    { t: 'p', html: '用似然比判极小充分，一步就能看清。两个 Bernoulli 样本的似然比是 <code>[p/(1−p)]<sup>S<sub>x</sub>−S<sub>y</sub></sup></code>，它不依赖 p 当且仅当两个样本的成功次数相同，所以 <code>ΣXᵢ</code> 是极小充分的。若换成 <code>Normal(μ, 1)</code>，比值是 <code>exp[μ(Σxᵢ − Σyᵢ) − nμ²/2 + nμ²/2]</code> 一类只含 <code>Σxᵢ</code> 的式子，结论相同。反过来，若比值中出现了 <code>Σxᵢ²</code> 与 <code>Σxᵢ</code> 两个都不能消去的量，说明极小充分统计量是二维的。' },

    { t: 'quiz', qid: 'ch04-q2' },

    { t: 'steps', items: [
      { title: '第一步：写出联合密度或概率', html: '把 <code>Πf(xᵢ;θ)</code> 完整写出，先不化简，确保没有漏掉指示函数。' },
      { title: '第二步：把含 θ 的部分凑成一个整体', html: '让 θ 只通过某个统计量 T 出现；指数族通常直接把 <code>Σt(xᵢ)</code> 暴露出来。' },
      { title: '第三步：把不含 θ 的因子分离出去', html: '剩下的部分记为 h(x)，它可以是任意只依赖数据的函数。' },
      { title: '第四步：读出 T 并检查', html: 'T 就是充分统计量；用条件分布或似然比再验证一遍，防止把参数混进 h。' }
    ] },

    { t: 'h', lvl: 2, text: '五、Fisher 信息与 Cramér-Rao 下界', id: 'ch04-5' },

    { t: 'p', html: 'Fisher 信息（Fisher information）度量「数据对参数有多敏感」：<code>I(θ) = E[s(θ)²] = −E[ℓ″(θ)]</code>，其中 s 是得分函数。直觉是：若 ℓ 在 θ 附近很陡，稍微移动参数似然就大幅下降，说明数据把 θ 钉得很牢，信息量大；若 ℓ 很平，很多 θ 都同样合理，信息量就小。n 个独立观测的信息相加：<code>I<sub>n</sub>(θ) = nI₁(θ)</code>。' },

    { t: 'table', caption: '常见分布的单观测 Fisher 信息', head: ['分布', '参数', '<code>I₁(θ)</code>', '达到 CRLB 的估计量'], rows: [
      ['Bernoulli(p)', 'p', '<code>1/[p(1−p)]</code>', '<code>X̄</code>（样本比例）'],
      ['Poisson(λ)', 'λ', '<code>1/λ</code>', '<code>X̄</code>'],
      ['Exponential(λ)', 'λ', '<code>1/λ²</code>', '<code>1/X̄</code>（渐近）'],
      ['Normal(μ, σ²)，σ 已知', 'μ', '<code>1/σ²</code>', '<code>X̄</code>'],
      ['Normal(μ, σ²)，μ 已知', 'σ²', '<code>1/(2σ⁴)</code>', '<code>Σ(Xᵢ−μ)²/n</code>']
    ] },

    { t: 'p', html: 'Cramér-Rao 下界（CRLB）说：在正则条件下，任何无偏估计量都满足 <code>Var(θ̂) ≥ 1/I<sub>n</sub>(θ)</code>。它给出「方差最小能到多少」的绝对下限，因此是判断有效性的标尺。以 Bernoulli 为例，<code>I₁(p) = 1/[p(1−p)]</code>，所以 <code>Var(p̂) ≥ p(1−p)/n</code>；而样本比例 <code>X̄</code> 的方差正好是 <code>p(1−p)/n</code>，<b>达到下界</b>，称为有效估计量（efficient estimator）。' },

    { t: 'p', html: '达到 CRLB 不是常态。正态均值 X̄ 达到；指数分布的率 <code>1/X̄</code> 有偏，达不到；均匀分布上界的 MLE 也不满足正则条件（支撑集依赖参数），CRLB 根本不能用。所以看到一个估计量方差大于下界，不要急着说它「不好」——可能只是没有无偏且达到下界的估计量存在。CRLB 的作用是<b>给出不可能性证明</b>：若某个估计量的方差已等于下界，就不必再找更好的无偏估计了。' },

    { t: 'quiz', qid: 'ch04-q3' },

    { t: 'h', lvl: 2, text: '六、Rao-Blackwell 与最小方差无偏', id: 'ch04-6' },

    { t: 'p', html: '有了充分统计量，就能系统性地改进估计量。Rao-Blackwell 定理：若 T 充分、θ̃ 无偏，则 <code>θ* = E(θ̃ | T)</code> 仍然无偏，且 <code>Var(θ*) ≤ Var(θ̃)</code>。原因是条件化平均掉了与 T 无关的噪声，相当于把估计量投影到「只依赖充分信息」的子空间上，方差只会变小（全方差公式：<code>Var(θ̃) = Var(E[θ̃|T]) + E[Var(θ̃|T)]</code>，后一项非负）。' },

    { t: 'p', html: '均匀分布是标准练习。取 <code>θ̃ = 2X̄</code>，它无偏（<code>E(2X̄) = θ</code>），方差 <code>θ²/(3n)</code>。以 <code>T = max Xᵢ = m</code> 为条件，其余 n − 1 个观测独立均匀于 <code>(0, m)</code>，均值 m/2，所以 <code>E(X̄|m) = (m + (n−1)m/2)/n = (n+1)m/(2n)</code>，从而 <code>E(2X̄|m) = (n+1)m/n</code>。这正是前面那个无偏估计量，其方差为 <code>θ²/[n(n+2)]</code>。取 n = 5：<code>2X̄</code> 的方差是 <code>θ²/15 ≈ 0.0667θ²</code>，改进后是 <code>θ²/35 ≈ 0.0286θ²</code>，降到不到一半。' },

    { t: 'p', html: '再加上「完备性」（completeness），就得到 Lehmann-Scheffé 定理：若 T 是完备充分统计量，且 <code>h(T)</code> 无偏，则 <code>h(T)</code> 是<b>一致最小方差无偏估计</b>（uniformly minimum variance unbiased estimator, UMVUE）。实践中不需要每次验证完备性：指数族在自然参数化下充分统计量通常完备，所以「找无偏的 T 的函数」往往就得到 UMVUE。这也解释了为什么 <code>(n+1)/n · max</code> 是 Uniform 上界的 UMVUE，而 <code>2X̄</code> 不是。' },

    { t: 'tabs', items: [
      { label: '改进三步', blocks: [
        { t: 'p', html: '第一步，找一个无偏的粗糙估计量（<code>X̄</code>、<code>2X̄</code>、样本矩都行）；第二步，找到充分统计量 T；第三步，算条件期望 <code>E(θ̃|T)</code>，它自动无偏且方差更小。' },
        { t: 'p', html: '若 T 还完备，这一步的结果就是 UMVUE，不必再比较其他无偏估计。' }
      ] },
      { label: '常见 UMVUE', blocks: [
        { t: 'table', caption: '几个直接可用的结论', head: ['参数', 'UMVUE', '备注'], rows: [
          ['μ（正态，σ² 未知）', '<code>X̄</code>', '同时是 MLE'],
          ['σ²（正态）', '<code>S²</code>', '除以 n − 1'],
          ['p（Bernoulli）', '<code>ΣXᵢ/n</code>', '达到 CRLB'],
          ['θ（Uniform 上界）', '<code>(n+1)/n · max Xᵢ</code>', 'MLE 是 max，有偏']
        ] }
      ] }
    ] },

    { t: 'h', lvl: 2, text: '七、常见错误与自检', id: 'ch04-7' },

    { t: 'table', caption: '估计量评价部分的六个高频错误', head: ['错误说法', '错在哪', '正确做法'], rows: [
      ['「无偏就一定准」', '无偏只保证平均，单次仍可能偏很远', '同时看方差或 MSE'],
      ['「有偏就不能用」', '偏差可换方差，MSE 可能更小', '按损失函数比较 MSE'],
      ['「MSE 就是方差」', '有偏时还含偏差平方项', '<code>MSE = Var + Bias²</code>'],
      ['「充分统计量只有一个」', '任何一一变换仍是充分的', '通常取极小充分统计量'],
      ['「CRLB 对所有估计量成立」', '只对无偏且满足正则条件的成立', '有偏或支撑依赖参数时不适用'],
      ['「E(X̄|max) = max/2」', '忘了 X̄ 里还含最大值本身', '<code>E(X̄|m) = (n+1)m/(2n)</code>']
    ] },

    { t: 'p', html: '自检的最好方式是模拟。以 Uniform(0,1) 为例，重复抽 n = 5、算 <code>2X̄</code> 与 <code>6/5 · max</code>，各跑 10000 次，比较均值与方差：前者均值应接近 1（无偏），方差约 0.0667；后者均值也接近 1，方差约 0.0286。再画两张直方图，你会看到改进后的分布明显更窄。这个实验把「无偏」「方差」「Rao-Blackwell」三件事一次性验证完，比推公式更有体感。' },

    { t: 'terms', items: [
      { en: 'unbiased estimator', zh: '无偏估计量', html: '满足 <code>E(θ̂) = θ</code>；只保证长期平均，不保证单次准确。' },
      { en: 'bias', zh: '偏差', html: '<code>E(θ̂) − θ</code>；MLE 的方差估计偏差为 <code>−σ²/n</code>。' },
      { en: 'mean squared error', zh: '均方误差', html: '<code>E[(θ̂−θ)²] = Var + Bias²</code>；允许有偏时的综合标准。' },
      { en: 'efficiency', zh: '有效性', html: '无偏估计中方差越小越有效；相对有效性是方差之比。' },
      { en: 'consistency', zh: '相合性', html: '<code>θ̂ →<sub>p</sub> θ</code>；偏差与方差都趋于 0 是充分条件。' },
      { en: 'sufficient statistic', zh: '充分统计量', html: '给定它之后样本条件分布不含 θ；用因子分解定理判定。' },
      { en: 'Fisher information', zh: 'Fisher 信息', html: '<code>−E[ℓ″]</code>；度量数据对参数的敏感度，可加。' },
      { en: 'Cramér-Rao lower bound', zh: 'Cramér-Rao 下界', html: '无偏估计方差的下限 <code>1/I<sub>n</sub>(θ)</code>。' },
      { en: 'UMVUE', zh: '一致最小方差无偏估计', html: '所有无偏估计中方差最小者；完备充分统计量的无偏函数。' }
    ] },

    { t: 'keypoint', items: [
      { title: '无偏看中心，MSE 看整体', html: '有偏时 <code>MSE = Var + Bias²</code>，不能只比方差。' },
      { title: 'S² 无偏、MLE 方差有偏', html: '除以 n − 1 与除以 n 的差别是 <code>σ²/n</code>。' },
      { title: '相合是最低要求', html: '偏差与方差都趋于 0 时相合；不相合的估计量样本再多也没用。' },
      { title: '因子分解找充分统计量', html: '<code>f = g(T;θ)h(x)</code>；Bernoulli 与 Poisson 是 <code>ΣXᵢ</code>，Uniform 是 max。' },
      { title: 'CRLB 是绝对下限', html: '<code>Var ≥ 1/(nI₁)</code>；达到下界的估计量称为有效。' },
      { title: 'Rao-Blackwell 降方差', html: '<code>E(θ̃|T)</code> 保持无偏、方差更小；完备时即 UMVUE。' }
    ] },

    { t: 'checklist', id: 'ch04', items: [
      '我能写出偏差的定义并计算常见估计量的偏差',
      '我能证明 S² 无偏、MLE 的方差估计有偏',
      '我能用 MSE 分解比较两个估计量，包括一偏一无偏的情形',
      '我能解释相对有效性，并说出中位数估正态均值的效率损失',
      '我能用切比雪夫条件判断一个估计量是否相合',
      '我能用因子分解定理找出充分统计量，并说明它为什么能压缩数据',
      '我能计算 Bernoulli、Poisson、正态的 Fisher 信息',
      '我能用 CRLB 判断估计量是否达到最优，并说明适用条件',
      '我能用 Rao-Blackwell 改进一个无偏估计量并算出新方差'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 STA2002 讲义的估计量评价部分：无偏与偏差、MSE 与偏差-方差权衡、有效性与相合性、充分统计量与因子分解、Fisher 信息与 CRLB、Rao-Blackwell 与 UMVUE。数值例子（电池的收缩系数 <code>0.99965</code>、Uniform(0,1) 的 <code>θ²/15</code> 与 <code>θ²/35</code>）均可手算复核。本章不展开指数族的完备性证明与 Lehmann-Scheffé 的严格叙述，只要求会用结论；也不涉及渐近有效性的高阶展开（如 Edgeworth 修正）。' }
  ]
});
