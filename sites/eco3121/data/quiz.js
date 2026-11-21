/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 每项字段：{ id:'ch01-q1', ch:'ch01', kp:'ch01-1', tier:1, type:'mcq'|'tf'|'fill'|'multi'|'predict',
 *            difficulty:1, tags:['concept'], stem, options:[{text, correct:true?}], explain }
 * predict 类型额外含 code / codeTitle / answer。
 * 目标：每章 6–8 题，全站 ≥ 48 题；每题必须写 explain。
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '计量经济学与「用均值、方差描述数据」的统计描述，最核心的区别是什么？',
        options: [
          { text: '计量经济学要在<em>控制其他因素</em>的前提下估计某个变量的效应，并给出不确定性', correct: true },
          { text: '计量经济学只处理时间序列，统计描述只处理横截面' },
          { text: '计量经济学不需要数据，只做理论推导' },
          { text: '两者没有区别，只是叫法不同' }
        ],
        explain: '统计描述回答「数据长什么样」，计量经济学回答「x 变化一单位，y 会变化多少」，并且必须说明这个估计在抽样波动下有多可靠。控制其他因素与量化不确定性，是它区别于描述统计的两件事。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept', 'causal'],
        stem: '判断：只要回归系数在 5% 水平上显著，就说明 x 对 y 有因果影响。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '显著只说明「在抽样波动下，这个相关不太可能是零」，与因果无关。遗漏变量、反向因果、测量误差都会让一个显著系数失去因果含义。因果需要识别策略（面板、工具变量、实验等）来支撑。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept', 'data'],
        stem: '「同一批城市在 2015–2023 年每年的空气污染与医疗支出」属于哪类数据？',
        options: [
          { text: '面板数据（panel data）', correct: true },
          { text: '纯横截面数据' },
          { text: '纯时间序列数据' },
          { text: '实验数据' }
        ],
        explain: '面板数据同时有「个体维度」（多个城市）与「时间维度」（多年），可以对同一城市做前后比较，从而消掉不随时间变化的城市特征。这正是 ch07 固定效应的用武之地。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-3', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept', 'causal'],
        stem: '下列哪些情形会让「x 与 y 的回归系数」偏离因果效应？（多选）',
        options: [
          { text: '存在同时影响 x 与 y 的遗漏变量（如能力）', correct: true },
          { text: 'y 反过来影响 x（反向因果）', correct: true },
          { text: 'x 存在经典测量误差', correct: true },
          { text: '样本量足够大' }
        ],
        explain: '遗漏变量造成偏误、反向因果让「谁影响谁」颠倒、经典测量误差导致衰减偏误，三者都是内生性的来源。样本量大只降低抽样方差，不消除偏误——偏误不会随 n 增大而消失。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '在模型 <code>y = β<sub>0</sub> + β<sub>1</sub>x + u</code> 中，除 x 之外所有影响 y 的因素都被归入哪个符号？',
        answer: 'u',
        accept: ['u', '误差项', '扰动项', 'error term'],
        explain: 'u 是误差项（扰动项），承载了所有未被模型显式包含的影响因素。计量经济学的核心工作之一，就是判断 u 里是否含有与 x 相关的成分——若有，β̂<sub>1</sub> 就有偏。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept', 'data'],
        stem: '「2023 年对 5000 名劳动者各观测一次工资、教育、经验」属于哪类数据？',
        options: [
          { text: '横截面数据', correct: true },
          { text: '时间序列数据' },
          { text: '面板数据' },
          { text: '季度数据' }
        ],
        explain: '横截面数据是在同一时点对不同个体观测一次。它只能利用个体之间的差异，无法控制不随时间变化的个体特征——这是它与面板数据的关键差别。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept', 'model'],
        stem: '判断：两个模型比较时，R<sup>2</sup> 更高的那个一定更好。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: 'R² 随解释变量增加而单调不降，多加一个无关变量也能让它上升。比较模型要看调整 R²、信息准则、系数是否合理，以及样本外预测表现。R² 高更不等于因果识别正确。'
      },

      /* ---------------- ch01 简单线性回归 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept', 'ols'],
        stem: '普通最小二乘（OLS）选择 β̂<sub>0</sub>、β̂<sub>1</sub> 的标准是什么？',
        options: [
          { text: '使残差平方和 Σû<sub>i</sub><sup>2</sup> 最小', correct: true },
          { text: '使残差之和 Σû<sub>i</sub> 最小' },
          { text: '使 R<sup>2</sup> 最大' },
          { text: '使解释变量与残差的协方差最大' }
        ],
        explain: 'OLS 最小化残差平方和。残差之和在含截距时自动为零，所以「最小化残差和」没有意义；最大化 R² 与最小化 SSE 在简单回归里等价，但 R² 不是估计准则，多元回归里还会随变量增加而虚增。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'tf', difficulty: 2,
        tags: ['ols', 'property'],
        stem: '判断：只要回归含截距项，OLS 残差的样本均值就一定为零。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '含截距时，对 β<sub>0</sub> 求导的一阶条件就是 Σû<sub>i</sub> = 0，所以残差均值恒为零。这也解释了为什么回归线一定经过样本均值点 (x̄, ȳ)。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['interpretation'],
        stem: '在 <code>wage = β<sub>0</sub> + β<sub>1</sub>educ + u</code>（wage 单位为元/小时，educ 为年）中，β̂<sub>1</sub> = 1.62 的正确读法是：',
        options: [
          { text: '教育每多一年，小时工资平均高 1.62 元', correct: true },
          { text: '教育解释了工资变异的 1.62%' },
          { text: '工资每高 1 元，教育平均多 1.62 年' },
          { text: '1.62% 的样本受过教育' }
        ],
        explain: '斜率系数的单位是「y 的单位 / x 的单位」：元每小时 ÷ 年。它衡量 x 增加一单位时 y 的平均变化，不是解释比例，也不是反向关系。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'fill', difficulty: 3,
        tags: ['calculation'],
        stem: '五个观测的 x 为 12、14、16、18、20，y 为 5、7、10、12、16。用 OLS 估计斜率 b<sub>1</sub>，结果是？（保留两位小数）',
        answer: '1.35',
        accept: ['1.35'],
        explain: 'x̄ = 16，ȳ = 10。Σ(x−x̄)(y−ȳ) = (−4)(−5)+(−2)(−3)+0+2·2+4·6 = 20+6+0+4+24 = 54；Σ(x−x̄)² = 16+4+0+4+16 = 40。b<sub>1</sub> = 54/40 = 1.35。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['fit'],
        stem: '某回归的 R<sup>2</sup> = 0.985，最准确的含义是：',
        options: [
          { text: 'y 的样本变异中约 98.5% 可由 x 的线性关系解释', correct: true },
          { text: '有 98.5% 的把握认为 x 影响 y' },
          { text: '预测误差约为 1.5%' },
          { text: '模型一定正确' }
        ],
        explain: 'R² = 1 − SSE/SST，是「被解释的变异占比」，属于样本内的拟合度量。它既不是置信水平，也不是预测误差率，更不能证明模型设定正确——加入无关变量或趋势都会推高它。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'tf', difficulty: 2,
        tags: ['inference'],
        stem: '判断：OLS 的无偏性意味着「用这一份样本算出的 β̂<sub>1</sub> 一定等于真实 β<sub>1</sub>」。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '无偏性说的是「重复抽很多次样本，β̂<sub>1</sub> 的均值等于真值」，单次估计仍然会偏离。它描述的是估计量的抽样分布性质，不是某一次计算结果的准确性。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 3, type: 'predict', difficulty: 3,
        tags: ['code', 'ols'],
        stem: '下面这段代码拟合简单线性回归并打印斜率。它的输出最接近哪个值？',
        codeTitle: 'numpy 拟合斜率',
        code: 'import numpy as np\nx = np.array([12, 14, 16, 18, 20])\ny = np.array([5, 7, 10, 12, 16])\nb1, b0 = np.polyfit(x, y, 1)\nprint(round(b1, 2))',
        answer: '1.35',
        explain: 'np.polyfit(x, y, 1) 返回 [斜率, 截距]，斜率即 54/40 = 1.35。polyfit 默认按 x 的幂次从高到低排列系数，所以第一个返回值是斜率而不是截距，这一点容易看错。'
      },

      /* ---------------- ch02 多元回归 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['interpretation'],
        stem: '在 <code>log(wage) = β<sub>0</sub> + β<sub>1</sub>educ + β<sub>2</sub>exper + u</code> 中，β̂<sub>1</sub> = 0.07 的含义是：',
        options: [
          { text: '控制经验后，教育每多一年，工资平均高约 7%', correct: true },
          { text: '教育与工资的相关系数为 0.07' },
          { text: '教育能解释工资变异的 7%' },
          { text: '受过教育的人占 7%' }
        ],
        explain: '「其他条件不变」是多元回归系数的核心：β<sub>1</sub> 衡量的是在 exper 相同的人群内部，educ 多一年带来的 log(wage) 变化，约等于 7% 的工资差异。它不是相关系数，也不是 R²。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'tf', difficulty: 2,
        tags: ['fit'],
        stem: '判断：调整 R<sup>2</sup> 可能小于 0，而 R<sup>2</sup> 不可能小于 0。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: 'R² = 1 − SSE/SST 落在 [0, 1]。调整 R² 对自由度做了惩罚，公式中 SSE/(n−k−1) 可能大于 SST/(n−1)，于是算出来为负——通常意味着模型里塞了太多没用的变量。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['bias'],
        stem: '真实模型含变量 z，但研究者遗漏了它。若 z 对 y 的系数为正，且 z 与已纳入的 x 正相关，则 x 的系数估计会：',
        options: [
          { text: '向上偏（高估）', correct: true },
          { text: '向下偏（低估）' },
          { text: '无偏' },
          { text: '方向无法判断' }
        ],
        explain: '遗漏变量偏差约为 β<sub>z</sub> × δ（δ 是 z 对 x 的回归系数）。两个因子都为正，乘积为正，所以 x 的系数被推高。两个因子一正一负时方向才相反。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'fill', difficulty: 3,
        tags: ['collinearity', 'calculation'],
        stem: '若把 x<sub>j</sub> 对其余解释变量回归得到的 R<sub>j</sub><sup>2</sup> = 0.8，则方差膨胀因子 VIF<sub>j</sub> 等于多少？',
        answer: '5',
        accept: ['5', '5.0'],
        explain: 'VIF<sub>j</sub> = 1/(1 − R<sub>j</sub><sup>2</sup>) = 1/(1 − 0.8) = 5。经验上 VIF 超过 10（对应 R<sub>j</sub>² 超过 0.9）提示共线性严重，但共线性本身不导致偏误，只是让标准误变大。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['collinearity'],
        stem: '关于多重共线性，下列说法正确的有：（多选）',
        options: [
          { text: '它不导致系数偏误，但会放大标准误', correct: true },
          { text: '完全共线时 OLS 无法计算（矩阵不可逆）', correct: true },
          { text: '删掉一个高度共线的控制变量可能让另一个系数变化很大', correct: true },
          { text: '共线性意味着模型设定错误' }
        ],
        explain: '共线性让「分离各变量的独立贡献」变难，标准误膨胀、系数对样本敏感；完全共线时 X′X 不可逆。但它与「模型是否设定正确」是两件事：共线可能只是样本中变量同向变动，不代表遗漏了什么。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-3', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['fwl', 'theory'],
        stem: 'Frisch–Waugh–Lovell 定理告诉我们，多元回归中 x<sub>1</sub> 的系数等于：',
        options: [
          { text: '把 y 与 x<sub>1</sub> 都「扣除其余变量能解释的部分」后，两个残差做简单回归的斜率', correct: true },
          { text: 'y 对 x<sub>1</sub> 做简单回归的斜率' },
          { text: 'x<sub>1</sub> 与 y 的相关系数' },
          { text: '把所有变量标准化后的系数' }
        ],
        explain: 'FWL 定理给出了「控制」的精确含义：先把 x<sub>1</sub> 对其他变量回归取残差，再把 y 对其他变量回归取残差，用两个残差做简单回归。这就是「控制变量到底扣掉了什么」的答案——扣掉的是其余变量能解释的那部分变异。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 3, type: 'predict', difficulty: 3,
        tags: ['code', 'python'],
        stem: '用 statsmodels 拟合工资方程后，代码打印 <code>res.params["educ"]</code>。若输出为 0.070，下列哪个说法正确？',
        codeTitle: 'statsmodels 读取系数',
        code: 'import statsmodels.formula.api as smf\nres = smf.ols("np.log(wage) ~ educ + exper + tenure", data=df).fit()\nprint(round(res.params["educ"], 3))',
        answer: '控制经验与任期后，教育每多一年工资约高 7%',
        explain: 'params 给出的是偏效应系数，因为模型同时包含了 exper 与 tenure，所以 educ 的系数是「其他条件不变」下的效应。log 因变量下系数近似为百分比变化，0.070 约等于 7%。'
      },

      /* ---------------- ch03 推断 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['inference'],
        stem: '检验 H<sub>0</sub>: β<sub>j</sub> = 0 的 t 统计量是：',
        options: [
          { text: 'β̂<sub>j</sub> 除以它的标准误', correct: true },
          { text: 'β̂<sub>j</sub> 除以残差标准差' },
          { text: 'β̂<sub>j</sub><sup>2</sup> 除以 R<sup>2</sup>' },
          { text: 'R<sup>2</sup> 除以 (1 − R<sup>2</sup>)' }
        ],
        explain: 't = (β̂<sub>j</sub> − 假设值)/se(β̂<sub>j</sub>)，检验零假设时假设值为 0。它在 H<sub>0</sub> 下服从自由度 n − k − 1 的 t 分布。分母是系数的标准误，不是残差标准差本身。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-6', tier: 1, type: 'tf', difficulty: 2,
        tags: ['pvalue'],
        stem: '判断：p 值 = 0.03 意味着「原假设为真的概率是 3%」。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: 'p 值是「在原假设为真的条件下，得到当前或更极端统计量的概率」，即 P(数据 | H<sub>0</sub>)，不是 P(H<sub>0</sub> | 数据)。混淆这两者是实证研究里最常见的误读之一。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['confidence'],
        stem: 'β̂ = 0.062、se = 0.008 时，95% 置信区间约为：',
        options: [
          { text: '[0.046, 0.078]', correct: true },
          { text: '[0.054, 0.070]' },
          { text: '[0.062, 0.078]' },
          { text: '[0.000, 0.062]' }
        ],
        explain: '大样本下用 1.96：0.062 ± 1.96 × 0.008 = 0.062 ± 0.0157，即 [0.046, 0.078]。区间不含 0，等价于双侧 5% 水平下显著。区间比「显著/不显著」提供更多信息，因为它给出了效应大小的合理范围。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calculation'],
        stem: 'β̂ = 0.35、se = 0.10，检验 H<sub>0</sub>: β = 0 的 t 统计量是多少？',
        answer: '3.5',
        accept: ['3.5', '3.50'],
        explain: 't = 0.35/0.10 = 3.5。自由度足够大时，双侧 5% 临界值约 1.96，3.5 远超临界值，可以在 1% 水平拒绝零假设。但「显著」只说明不太可能是零，不说明效应在经济上重要。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-1', tier: 2, type: 'multi', difficulty: 2,
        tags: ['inference'],
        stem: '下列哪些因素会让 β̂<sub>j</sub> 的标准误变大？（多选）',
        options: [
          { text: 'x<sub>j</sub> 的样本变异更小', correct: true },
          { text: '残差方差更大', correct: true },
          { text: 'x<sub>j</sub> 与其他解释变量高度共线', correct: true },
          { text: '样本量更大' }
        ],
        explain: '标准误与「x<sub>j</sub> 的变异」负相关、与残差方差正相关、与 VIF 正相关。样本量越大标准误越小。记住公式 se(β̂<sub>j</sub>) = σ̂/√(SST<sub>j</sub>(1 − R<sub>j</sub>²))，三项因素一目了然。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-4', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['ftest'],
        stem: '只检验一个线性约束（q = 1）时，F 统计量与 t 统计量的关系是：',
        options: [
          { text: 'F = t<sup>2</sup>', correct: true },
          { text: 'F = t' },
          { text: 'F = 1/t' },
          { text: '两者无关' }
        ],
        explain: '单个约束下 F 统计量等于对应 t 统计量的平方，两者给出完全一致的 p 值。这也是为什么「整体显著性 F 检验」在只有一个解释变量时与斜率 t 检验等价。q &gt; 1 时 F 才提供 t 检验给不了的信息。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-7', tier: 3, type: 'predict', difficulty: 3,
        tags: ['code', 'inference'],
        stem: '下面代码打印的结果最可能说明什么？',
        codeTitle: '读取 t 检验结果',
        code: 'import statsmodels.formula.api as smf\nres = smf.ols("logwage ~ educ + exper", data=df).fit()\nprint(res.pvalues["educ"])',
        answer: '输出约 0.03，说明在 5% 水平下 educ 的系数显著不为零',
        explain: 'pvalues 给出双侧检验的 p 值。0.03 &lt; 0.05，在 5% 水平拒绝 β<sub>educ</sub> = 0。但要注意：显著不等于因果，也不等于效应大；还要看系数大小、置信区间与识别策略。'
      },

      /* ---------------- ch04 函数形式与虚拟变量 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['functional-form'],
        stem: '在 log-log 模型 <code>log(y) = β<sub>0</sub> + β<sub>1</sub>log(x) + u</code> 中，β<sub>1</sub> 的含义是：',
        options: [
          { text: 'x 增加 1% 时 y 增加的百分比，即弹性', correct: true },
          { text: 'x 增加一单位时 y 增加的单位数' },
          { text: 'x 增加一单位时 y 增加的百分比' },
          { text: 'y 的方差中 x 解释的比例' }
        ],
        explain: '双对数模型的斜率就是弹性：d log y / d log x。log-log 读弹性、log-lin 读半弹性（增长率）、lin-log 读「x 增 1% 时 y 变化多少单位」。三种形式不要混。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'tf', difficulty: 2,
        tags: ['dummy'],
        stem: '判断：对「性别」这类二分类变量，同时放入男性虚拟变量与女性虚拟变量会更好，因为信息更全。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '同时放入两个虚拟变量且模型含截距，会造成完全共线（两个虚拟变量之和恒为 1，等于截距），即「虚拟变量陷阱」，软件会丢弃一个或报错。正确做法是留一个基准组。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-1', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['functional-form'],
        stem: '在 <code>log(wage) = β<sub>0</sub> + β<sub>1</sub>educ + u</code> 中，β̂<sub>1</sub> = 0.062。教育多一年，工资大约高：',
        options: [
          { text: '6.2%', correct: true },
          { text: '0.062 元' },
          { text: '6.2 倍' },
          { text: '0.062%' }
        ],
        explain: '半对数模型里系数乘以 100 就是百分比变化，所以约 6.2%。精确值是 100 × (e<sup>0.062</sup> − 1) ≈ 6.40%，系数不大时近似很好用。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'fill', difficulty: 3,
        tags: ['quadratic', 'calculation'],
        stem: '模型 <code>log(wage) = β<sub>0</sub> + 0.041exper − 0.0007exper<sup>2</sup> + u</code> 的转折点（边际效应为零处）大约在多少年经验？',
        answer: '29.3',
        accept: ['29.3', '29', '29.29'],
        explain: '边际效应为 0.041 − 2 × 0.0007 × exper = 0，解得 exper = 0.041/0.0014 ≈ 29.3。二次项为负说明边际效应递减，超过这个点后经验对工资的边际贡献转为负——但这个外推要谨慎。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'multi', difficulty: 2,
        tags: ['interaction'],
        stem: '在 <code>y = β<sub>0</sub> + β<sub>1</sub>x + β<sub>2</sub>d + β<sub>3</sub>(x·d) + u</code> 中，交互项系数 β<sub>3</sub> 衡量什么？（多选）',
        options: [
          { text: '两组之间 x 的斜率差异', correct: true },
          { text: 'd 对 y 的效应随 x 变化的部分', correct: true },
          { text: 'x 对 y 的平均效应' },
          { text: '模型的截距差异' }
        ],
        explain: 'd = 0 时斜率为 β<sub>1</sub>，d = 1 时为 β<sub>1</sub> + β<sub>3</sub>，所以 β<sub>3</sub> 是斜率差。把式子对 x 求导得 β<sub>1</sub> + β<sub>3</sub>d，也说明它是 x 的边际效应随 d 变化的部分。截距差异由 β<sub>2</sub> 承担。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['dummy'],
        stem: '含截距的回归里放「地区」虚拟变量（华东、华南、华北、西部），应该放几个？',
        options: [
          { text: '3 个，留一个作基准组', correct: true },
          { text: '4 个，全放进去' },
          { text: '1 个就够' },
          { text: '放几个都可以' }
        ],
        explain: 'k 个类别留一个基准，放 k − 1 个虚拟变量。系数读作「相对基准组的差异」。全放会与截距完全共线，触发虚拟变量陷阱。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 3, type: 'predict', difficulty: 3,
        tags: ['code', 'marginal-effect'],
        stem: '下面代码计算 x = 10 处的边际效应，输出最接近哪个值？',
        codeTitle: '二次项边际效应',
        code: 'b1, b2 = 0.041, -0.0007\nx = 10\nmarg = b1 + 2 * b2 * x\nprint(round(marg, 4))',
        answer: '0.027',
        explain: 'dy/dx = b<sub>1</sub> + 2b<sub>2</sub>x = 0.041 − 0.0014 × 10 = 0.027。二次模型里边际效应不是常数，必须指定 x 的位置再报告，直接说「系数是 0.041」会误导。'
      },

      /* ---------------- ch05 异方差 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['heteroskedasticity'],
        stem: '存在异方差时，OLS 估计量的性质是：',
        options: [
          { text: '仍然无偏、一致，但不再有效，普通标准误有偏', correct: true },
          { text: '有偏且不一致' },
          { text: '无偏且仍然有效，标准误无需修正' },
          { text: '完全无法估计' }
        ],
        explain: '异方差违反 MLR.5，不影响无偏性（那取决于零条件均值），但让 Gauss–Markov 定理失效：OLS 不再是 BLUE，普通标准误算错，t/F 检验失真。修正办法是稳健标准误或 WLS。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'tf', difficulty: 2,
        tags: ['robust'],
        stem: '判断：使用异方差稳健标准误会改变系数的点估计。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '稳健标准误只改标准误（以及由它推出的 t、p、置信区间），系数点估计与 OLS 完全相同。若换了标准误系数也变了，那说明用的不是「稳健标准误」，而是 WLS 或别的估计方法。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['test'],
        stem: 'Breusch–Pagan 检验的统计量 nR<sup>2</sup> 来自哪个辅助回归？',
        options: [
          { text: '残差平方对全部解释变量回归', correct: true },
          { text: '残差对拟合值回归' },
          { text: 'y 对残差回归' },
          { text: '残差对滞后残差回归' }
        ],
        explain: 'BP 检验把 û² 对所有解释变量回归，用 nR² ~ χ²(k) 检验「残差方差是否随解释变量变化」。White 检验则加入平方项与交叉项，对函数形式更稳健但更耗自由度。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'fill', difficulty: 3,
        tags: ['wls', 'calculation'],
        stem: '若误差方差与 x 成正比（Var(u|x) = σ<sup>2</sup>x），加权最小二乘应以什么为权重（weight = 1/h）？',
        answer: '1/x',
        accept: ['1/x', '1/x_i', '1/xi'],
        explain: 'WLS 的最优权重是方差的倒数：w = 1/Var(u|x) = 1/(σ²x) ∝ 1/x。直观上，方差大的观测信息少，给较小权重。注意 WLS 的 R² 与 OLS 的 R² 不可直接比较，因为目标函数变了。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'multi', difficulty: 2,
        tags: ['test'],
        stem: '下列哪些是检验异方差的常用方法？（多选）',
        options: [
          { text: 'Breusch–Pagan 检验', correct: true },
          { text: 'White 检验', correct: true },
          { text: '看残差对拟合值的散点图', correct: true },
          { text: 'Durbin–Watson 检验' }
        ],
        explain: 'BP、White 与残差图都是异方差的诊断工具；DW 检验的是序列相关（一阶），与异方差无关。残差图的形状（喇叭口、扇形）虽不严格，但能提示函数形式或方差问题。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['reset'],
        stem: 'RESET 检验的做法是：',
        options: [
          { text: '在回归中加入拟合值的平方、立方项，检验这些项是否联合显著', correct: true },
          { text: '把样本随机分成两半分别回归' },
          { text: '对残差做单位根检验' },
          { text: '比较 R<sup>2</sup> 与调整 R<sup>2</sup>' }
        ],
        explain: 'RESET（Regression Specification Error Test）通过加入 ŷ²、ŷ³ 等项，检验「是否存在被忽略的非线性」。联合 F 检验不显著，说明线性设定没有明显问题；显著则提示需要加二次项、交互项或变换。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 3, type: 'predict', difficulty: 3,
        tags: ['code', 'robust'],
        stem: '下面代码中 <code>cov_type="HC1"</code> 的作用是什么？',
        codeTitle: '稳健标准误',
        code: 'import statsmodels.formula.api as smf\nres = smf.ols("wage ~ educ + exper", data=df).fit(cov_type="HC1")\nprint(res.bse)',
        answer: '用异方差稳健标准误替换普通标准误，系数估计不变',
        explain: 'HC1 是 White 类稳健协方差矩阵的一种小样本修正。fit(cov_type="HC1") 只改标准误与检验统计量，params 与普通 OLS 一样。报告结果时应注明用了哪种稳健标准误。'
      },

      /* ---------------- ch06 时间序列 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['timeseries'],
        stem: '时间序列的「平稳性」指的是：',
        options: [
          { text: '均值、方差与自协方差不随时间变化', correct: true },
          { text: '序列的取值保持不变' },
          { text: '序列没有季节性' },
          { text: '序列的 R<sup>2</sup> 很高' }
        ],
        explain: '平稳性说的是「生成机制不变」：均值、方差、任意滞后的自协方差都与 t 无关。它不要求数值不变，也不排斥季节性（季节模式本身可以是平稳的周期成分）。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'tf', difficulty: 2,
        tags: ['trend'],
        stem: '判断：两个都随时间上升的序列做回归，得到 R<sup>2</sup> = 0.95，说明它们之间关系很强。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '共同趋势会让两个无关序列呈现高 R²，这是伪回归的典型表现。要看残差是否平稳、DW 是否过低、结果是否对样本期敏感，而不是只看 R²。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['serial-correlation'],
        stem: '存在正序列相关（ρ &gt; 0）时，普通 OLS 标准误通常会：',
        options: [
          { text: '低估真实标准误，导致 t 值虚高', correct: true },
          { text: '高估真实标准误，导致 t 值偏小' },
          { text: '不受影响' },
          { text: '变为零' }
        ],
        explain: '正序列相关意味着「有效样本量」小于观测数，但普通公式仍按独立样本计算，于是标准误被低估、t 值被夸大。修正方法是 HAC（Newey–West）标准误。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'fill', difficulty: 3,
        tags: ['dynamic', 'calculation'],
        stem: 'AR(1) 模型 <code>y<sub>t</sub> = α<sub>0</sub> + ρy<sub>t−1</sub> + βx<sub>t</sub> + u<sub>t</sub></code> 中，ρ̂ = 0.5、β̂ = 0.2。x 永久增加一单位，y 的长期变化是多少？',
        answer: '0.4',
        accept: ['0.4', '0.40'],
        explain: '长期乘数 = β/(1 − ρ) = 0.2/(1 − 0.5) = 0.4。直观上，冲击每期按 ρ 衰减：0.2 + 0.1 + 0.05 + … = 0.4。短期只变 0.2，长期累积到 0.4。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-2', tier: 2, type: 'multi', difficulty: 2,
        tags: ['trend'],
        stem: '处理时间序列趋势的常用方法包括：（多选）',
        options: [
          { text: '在回归中加入时间趋势项 t', correct: true },
          { text: '对 y 与 x 分别去趋势后回归', correct: true },
          { text: '用一阶差分 Δy 对 Δx 回归', correct: true },
          { text: '增加样本量' }
        ],
        explain: '加趋势项、去趋势（与加趋势项等价）、差分是三种标准做法，分别回答「控制趋势后的效应」「残差关系」「增长率关系」。增加样本量不能消除趋势造成的伪相关。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['spurious'],
        stem: '下列哪个组合最像「伪回归」的信号？',
        options: [
          { text: 'R<sup>2</sup> 很高、DW 统计量很低、去掉几年数据后系数翻转', correct: true },
          { text: 'R<sup>2</sup> 很低、系数不显著、残差随机' },
          { text: 'R<sup>2</sup> 很高、残差平稳、系数对样本期稳定' },
          { text: '系数显著、置信区间很窄、样本量很大' }
        ],
        explain: '高 R² + 残差强正相关（低 DW）+ 结果对样本期敏感，是伪回归的经典三信号。相反，残差平稳、系数稳定说明关系可能是真的（或至少不是趋势造成的假象）。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 3, type: 'predict', difficulty: 3,
        tags: ['code', 'timeseries'],
        stem: '下面代码用 Newey–West 标准误，<code>maxlags=4</code> 的作用是：',
        codeTitle: 'Newey–West 标准误',
        code: 'import statsmodels.api as sm\nres = sm.OLS(y, X).fit(cov_type="HAC", cov_kwds={"maxlags": 4})\nprint(res.bse)',
        answer: '允许误差项在 4 期以内相关，据此修正标准误',
        explain: 'maxlags 是 HAC 的截断参数 L：把 1 到 L 阶的残差自协方差都纳入方差估计。L 越大越稳健但方差越大，常用经验规则如 0.75T^(1/3) 或 4(T/100)^(2/9)。'
      },

      /* ---------------- ch07 面板与工具变量 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['panel'],
        stem: '固定效应（FE）估计通过组内去均值消掉了什么？',
        options: [
          { text: '不随时间变化的个体特征 a<sub>i</sub>', correct: true },
          { text: '所有随时间变化的遗漏变量' },
          { text: '测量误差' },
          { text: '反向因果' }
        ],
        explain: '去均值把 a<sub>i</sub> 减掉，因为它对每个 t 都一样。但随时间变化的遗漏变量、测量误差、反向因果都还在——FE 不是万能的，它只解决「不随时间变化」这一类内生性。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'tf', difficulty: 2,
        tags: ['iv'],
        stem: '判断：工具变量的外生性（排他性约束）可以用第一阶段 F 统计量检验。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '第一阶段 F 只能检验「相关性」（工具是否影响 x），外生性无法用数据检验，只能靠制度背景与逻辑论证。这正是 IV 最脆弱的地方——过度识别检验也只能在特定条件下提供间接证据。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['weak-iv'],
        stem: '弱工具变量（第一阶段 F 很小）的主要后果是：',
        options: [
          { text: 'IV 估计量的偏误方向与 OLS 相同但被放大，且分布严重偏离正态', correct: true },
          { text: 'IV 估计量变得无偏且更有效' },
          { text: '只影响 R<sup>2</sup>，不影响系数' },
          { text: '模型无法识别，软件会报错' }
        ],
        explain: 'Bound–Jaeger–Baker 的经典结果：弱工具下 2SLS 的偏误向 OLS 靠拢并可能更大，t 检验失效。所以第一阶段 F &lt; 10 时要警惕，最好报告弱工具稳健的置信区间（Anderson–Rubin）。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'fill', difficulty: 3,
        tags: ['weak-iv', 'rule-of-thumb'],
        stem: '判断工具变量是否「足够强」时，常用的第一阶段 F 经验门槛是多少？',
        answer: '10',
        accept: ['10', 'F>10', '大于10'],
        explain: 'Staiger–Stock 的经验规则是第一阶段 F &gt; 10 才算「不弱」。这个门槛来自「IV 偏误不超过 OLS 偏误 10%」的推导，只适用于单个内生变量、同方差情形，稳健做法要看弱工具稳健推断。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'multi', difficulty: 2,
        tags: ['panel'],
        stem: '关于固定效应与随机效应，下列说法正确的有：（多选）',
        options: [
          { text: 'FE 允许 a<sub>i</sub> 与 x 任意相关，RE 假设它们不相关', correct: true },
          { text: 'FE 无法估计性别、出生地这类不随时间变化的变量', correct: true },
          { text: 'Hausman 检验拒绝原假设时，应优先用 FE', correct: true },
          { text: 'RE 在任何情况下都比 FE 更可信' }
        ],
        explain: 'FE 用去均值消掉 a<sub>i</sub>，代价是估不了不随时间变化的变量；RE 在 a<sub>i</sub> 与 x 不相关时更有效。Hausman 拒绝「RE 成立」就用 FE。RE 的假设在经济学里常不成立，所以它不是「更可信」。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['cluster'],
        stem: '面板数据回归为什么要按个体聚类标准误？',
        options: [
          { text: '同一个体不同期的误差项相关，普通标准误会低估', correct: true },
          { text: '聚类能消除固定效应' },
          { text: '聚类能让系数变小' },
          { text: '聚类可以替代工具变量' }
        ],
        explain: '同一个体的观测共享 a<sub>i</sub> 与其他持续冲击，误差项在个体内相关。聚类稳健标准误允许个体内任意相关，只要求个体间独立。聚类层级应匹配处理分配层级，组数太少时要修正。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-7', tier: 3, type: 'predict', difficulty: 3,
        tags: ['code', 'iv'],
        stem: '下面代码估计教育回报的 2SLS，<code>educ ~ 1 + nearc4 + exper</code> 这一行表示什么？',
        codeTitle: 'linearmodels 2SLS',
        code: 'from linearmodels.iv import IV2SLS\nmod = IV2SLS.from_formula("logwage ~ 1 + exper + [educ ~ nearc4]", data=df)\nprint(mod.fit().summary)',
        answer: '用 nearc4 作为 educ 的工具变量，第一阶段把 educ 对 nearc4 与 exper 回归',
        explain: '方括号 [educ ~ nearc4] 是 IV2SLS 的语法：左边是内生变量，右边是工具变量。第一阶段用 nearc4 与 exper 预测 educ，第二阶段用预测值估计工资方程。外生控制变量（exper）放在方括号外。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
