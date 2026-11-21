/* =====================================================================
 * projects.js · 实战项目（CSC.registerProjects）
 * 结构：{ id, title, en, tagline, level, minutes, chapters, goals, intro,
 *         milestones:[{ n, title, tasks, starter, hints, solution }] }
 * 目标：本站 3 个项目，由易到难，均能落回章节知识点。
 * ===================================================================== */
CSC.registerProjects([
  {
    id: 'p1',
    title: '项目一 · 复现一张工资方程表',
    en: 'PROJECT 01 · REPLICATE A WAGE EQUATION',
    tagline: '从五个变量的横截面回归，走到能直接放进论文的回归表。',
    level: '入门',
    minutes: 90,
    chapters: ['ch01', 'ch02', 'ch03', 'ch04'],
    goals: [
      '独立完成「读数据 → 估方程 → 解释系数 → 报告不确定性」的完整流程',
      '分清简单回归与多元回归的系数差异，并能用遗漏变量偏差解释差异方向',
      '正确使用对数模型、虚拟变量与交互项，写出不超过 80 字的系数解读',
      '把 R 输出整理成一张三列回归表（含标准误与显著性标记）'
    ],
    intro: '这个项目用一份模拟的劳动者横截面数据（n = 800），变量为 wage（月薪，元）、educ（受教育年数）、exper（工作经验年数）、female（女性 = 1）、region（东部 = 1）。目标是把 ch01–ch04 的方法串起来：先跑最简单的方程，再逐步加控制变量，最后加虚拟变量与交互项，观察系数如何变化。数据由下列代码生成，不需要外部文件；如果你有自己的数据，替换读入部分即可。',
    milestones: [
      {
        n: 1,
        title: '跑通第一个方程，并把系数读成一句人话',
        tasks: [
          '生成或读入数据，检查 wage、educ 的均值与标准差，画出 wage 的直方图',
          '估计 wage = β0 + β1·educ + u，记录 β̂1 与标准误',
          '把 β̂1 翻译成「教育每多一年，月薪平均高多少元」',
          '估计 log(wage) = β0 + β1·educ + u，比较两个 β̂1 的含义差异'
        ],
        starter: 'import numpy as np\nimport pandas as pd\nimport statsmodels.formula.api as smf\n\nrng = np.random.default_rng(3121)\nn = 800\neduc = rng.integers(6, 22, n)\nexper = rng.integers(0, 40, n)\nfemale = rng.integers(0, 2, n)\nregion = rng.integers(0, 2, n)\nwage = np.exp(8.2 + 0.075 * educ + 0.02 * exper - 0.25 * female + 0.1 * region\n              + rng.normal(0, 0.4, n))\ndf = pd.DataFrame(dict(wage=wage, educ=educ, exper=exper,\n                       female=female, region=region))\ndf["logwage"] = np.log(df.wage)\n\nm1 = smf.ols("wage ~ educ", data=df).fit()\nm2 = smf.ols("logwage ~ educ", data=df).fit()\nprint(m1.params, m1.bse)\nprint(m2.params, m2.bse)',
        hints: [
          'wage 是水平值，educ 的系数单位是「元/年」；log(wage) 的系数乘以 100 近似百分比。',
          '两个模型的 β̂1 不会相同，因为因变量的尺度变了；不要直接比较数值大小。',
          '先看 params 与 bse，再看 summary 里的 R² 与 F 统计量，别一上来就贴整张表。'
        ],
        solution: '线性模型中 β̂1 约为 500–700（元/年），log 模型中约为 0.075。前者读作「教育多一年月薪高约 600 元」，后者读作「教育多一年月薪高约 7.5%」。后者更常用，因为它把「工资的百分比差异」与「教育年限」联系起来，且对极端值不那么敏感。'
      },
      {
        n: 2,
        title: '加控制变量，观察系数怎么变',
        tasks: [
          '在 log(wage) 方程中加入 exper、female、region，记录 educ 系数的变化',
          '用遗漏变量偏差的公式解释变化方向（educ 与 exper、female 的相关性）',
          '计算 educ 系数的 95% 置信区间，并说明它比「显著/不显著」多提供了什么信息',
          '报告调整 R²，比较三个模型的拟合优度'
        ],
        starter: 'm3 = smf.ols("logwage ~ educ + exper + female + region", data=df).fit()\nprint(m3.summary().tables[1])\n\nimport numpy as np\nb, se = m3.params["educ"], m3.bse["educ"]\nprint("95% CI:", round(b - 1.96 * se, 4), round(b + 1.96 * se, 4))\nprint("adj R2:", round(m3.rsquared_adj, 3))',
        hints: [
          'educ 与 exper 在生成数据时独立，所以加 exper 后 educ 系数变化不大；换成真实数据时往往不同。',
          'female 的系数是「控制教育后，女性相对男性的对数工资差异」，不是「女性工资低多少元」。',
          '置信区间窄说明估计精确，不代表效应大；两者要分开说。'
        ],
        solution: '加入控制变量后 educ 系数基本稳定在 0.075 附近，因为模拟数据里 educ 与 exper 独立。真实数据里，加入 exper 通常会让 educ 系数略降（教育与经验正相关），加入 female 会让它略升或略降，取决于性别与教育的相关性。调整 R² 从约 0.35 升到约 0.40，说明新增变量有解释力，但不构成因果证据。'
      },
      {
        n: 3,
        title: '加虚拟变量与交互项，写成一张三列回归表',
        tasks: [
          '在方程中加入 educ × female 交互项，解释交互项系数的含义',
          '分别报告男性与女性的教育回报（β̂<sub>educ</sub> 与 β̂<sub>educ</sub> + β̂<sub>交互</sub>）',
          '把 m2、m3、含交互项的 m4 整理成一张三列表：系数、标准误、显著性星号',
          '写一段 150 字的结论，说明「教育回报是否存在性别差异」以及你的证据强度'
        ],
        starter: 'm4 = smf.ols("logwage ~ educ * female + exper + region", data=df).fit()\nprint(m4.params[["educ", "female", "educ:female"]])\n\ndef star(p):\n    return "***" if p < 0.01 else "**" if p < 0.05 else "*" if p < 0.1 else ""\n\nrows = []\nfor name, m in [("(1) 基础", m2), ("(2) 加控制", m3), ("(3) 交互", m4)]:\n    rows.append([name, round(m.params["educ"], 4),\n                 round(m.bse["educ"], 4) + star(m.pvalues["educ"])])\nprint(rows)',
        hints: [
          '交互项系数为负，说明女性的教育回报低于男性；为正是高于。',
          '交互项显著只说明「差异不太可能是零」，不说明差异很大；要看两个斜率的具体数值。',
          '三列表的列名要写清因变量与样本，标准误放在系数下方括号里。'
        ],
        solution: '交互项系数约 −0.01 到 −0.02，男性教育回报约 0.08、女性约 0.06–0.07。结论应写成「点估计显示女性教育回报略低，但交互项的标准误较大（p 值可能在 0.1 附近），证据只能算提示性」。一张合格的三列表要包含：因变量、样本量、每列的变量名、系数与括号内标准误、星号说明、R² 或调整 R²。'
      }
    ]
  },
  {
    id: 'p2',
    title: '项目二 · 当标准误说谎：异方差与序列相关诊断',
    en: 'PROJECT 02 · WHEN STANDARD ERRORS LIE',
    tagline: '用模拟数据亲手制造异方差与序列相关，观察 t 值如何被「制造」出来。',
    level: '进阶',
    minutes: 120,
    chapters: ['ch05', 'ch06'],
    goals: [
      '用模拟实验展示「异方差下 OLS 系数无偏但标准误有偏」',
      '独立完成 BP 检验与残差图诊断，并正确解读',
      '比较普通标准误、HC1 稳健标准误与 WLS 的差异',
      '在时间序列中识别序列相关，并用 HAC 标准误修正'
    ],
    intro: '这个项目的核心是「自己造一个已知答案的世界」，再看各种方法能不能把它找回来。第一部分模拟异方差：让误差方差随 x 增大，重复抽样 1000 次，比较普通标准误与稳健标准误的覆盖率。第二部分模拟 AR(1) 序列相关：让 u_t = 0.8u_{t−1} + e_t，看普通 t 检验的拒绝率如何被夸大。全程用 Python（numpy + statsmodels），不需要外部数据。',
    milestones: [
      {
        n: 1,
        title: '制造异方差，看标准误错在哪里',
        tasks: [
          '生成 x ~ U(1, 10)、u ~ N(0, 0.3x)，构造 y = 2 + 1.5x + u',
          '对一次样本做 OLS，画残差对拟合值的散点图，描述形状',
          '做 BP 检验，记录统计量与 p 值',
          '重复 1000 次，分别用普通标准误与 HC1 计算「β̂1 的 95% 区间是否覆盖真值 1.5」，比较覆盖率'
        ],
        starter: 'import numpy as np\nimport statsmodels.api as sm\nfrom statsmodels.stats.diagnostic import het_breuschpagan\n\nrng = np.random.default_rng(3121)\nn = 200\nx = rng.uniform(1, 10, n)\nu = rng.normal(0, 0.3 * x)\ny = 2 + 1.5 * x + u\nX = sm.add_constant(x)\nres = sm.OLS(y, X).fit()\nprint(res.params, res.bse)\nprint(het_breuschpagan(res.resid, X))',
        hints: [
          'BP 检验的 p 值小于 0.05 说明拒绝「同方差」，即存在异方差。',
          '覆盖率实验要固定随机种子，否则每次结果略有不同。',
          'HC1 的 fit(cov_type="HC1") 只改标准误，params 不变。'
        ],
        solution: '残差图呈喇叭口（x 大时残差分散）。BP 检验 p 值通常远小于 0.05。1000 次模拟中，普通标准误的 95% 区间覆盖率明显低于 0.95（可能只有 0.85 左右），HC1 的覆盖率接近 0.95。这说明异方差下「系数无偏」但「推断失真」，稳健标准误修的是后者。'
      },
      {
        n: 2,
        title: 'WLS 与 FGLS：加权能不能更有效',
        tasks: [
          '已知 Var(u|x) = σ²x（模拟设定），用 weight = 1/x 做 WLS，比较 β̂1 的标准误',
          '用「估计的方差函数」做两步 FGLS：先回归 û² 对 x，取拟合值的倒数作权重',
          '比较 OLS、WLS、FGLS 的系数与标准误，说明效率差异',
          '讨论：现实中方差函数未知，WLS 的风险是什么'
        ],
        starter: 'w = 1 / x\nwls = sm.WLS(y, X, weights=w).fit()\nprint("WLS:", wls.params, wls.bse)\n\n# 两步 FGLS\nres = sm.OLS(y, X).fit()\naux = sm.OLS(res.resid ** 2, X).fit()\nh = aux.fittedvalues\nfgls = sm.WLS(y, X, weights=1 / np.maximum(h, 1e-6)).fit()\nprint("FGLS:", fgls.params, fgls.bse)',
        hints: [
          'WLS 的 R² 与 OLS 不可比，因为目标函数（加权残差平方和）不同。',
          'FGLS 的第一步用 û² 回归，拟合值可能为负，要取 max 截断。',
          '权重估错时 WLS 仍一致但不再有效，极端权重会让结果对少数观测敏感。'
        ],
        solution: 'WLS 的 β̂1 标准误通常比 OLS 小 20%–40%，因为权重与真实方差结构匹配。两步 FGLS 接近 WLS，但多了一层估计误差，标准误略大。现实中方差函数是猜的，若权重与真实方差差距大，WLS 的效率优势会消失，甚至不如 OLS；所以实务里更常用「OLS + 稳健标准误」，因为它不依赖方差函数设定。'
      },
      {
        n: 3,
        title: '序列相关：让 t 值虚高',
        tasks: [
          '生成 AR(1) 误差 u_t = 0.8u_{t−1} + e_t，构造 y_t = 1 + 0.5x_t + u_t（T = 200）',
          '做 OLS 与 BG 检验，记录 ρ̂ 与 p 值',
          '用 HAC（Newey–West，maxlags = 4）重估标准误，比较 t 值变化',
          '重复 500 次，比较普通 t 检验与 HAC t 检验在 5% 水平的拒绝率'
        ],
        starter: 'T = 200\nx = rng.normal(0, 1, T)\ne = rng.normal(0, 1, T)\nu = np.zeros(T)\nfor t in range(1, T):\n    u[t] = 0.8 * u[t - 1] + e[t]\ny = 1 + 0.5 * x + u\nX = sm.add_constant(x)\nols = sm.OLS(y, X).fit()\nhac = sm.OLS(y, X).fit(cov_type="HAC", cov_kwds={"maxlags": 4})\nprint("OLS t:", ols.tvalues, "HAC t:", hac.tvalues)',
        hints: [
          'BG 检验用 statsmodels.stats.diagnostic.acorr_breusch_godfrey，滞后阶取 1–4。',
          'HAC 的 t 值通常比 OLS 小，因为标准误被修正得更大。',
          '原假设为真（β1 = 0.5 时检验 β1 = 0.5）时，拒绝率应接近 5%；普通 t 检验会远超 5%。'
        ],
        solution: 'BG 检验 p 值通常小于 0.01，ρ̂ 接近 0.8。HAC 标准误约为普通标准误的 2–3 倍，t 值相应缩小。500 次模拟中，普通 t 检验在 5% 水平的拒绝率可能达到 30%–50%（严重过度拒绝），HAC 检验接近 5%。这就是「序列相关让 t 值虚高」的量化版本。'
      }
    ]
  },
  {
    id: 'p3',
    title: '项目三 · 从相关到因果：一份可复现的识别策略报告',
    en: 'PROJECT 03 · FROM CORRELATION TO CAUSATION',
    tagline: '用面板固定效应与工具变量，写一份 4 页的实证报告，并主动攻击自己的结论。',
    level: '挑战',
    minutes: 180,
    chapters: ['ch06', 'ch07'],
    goals: [
      '为一个真实的政策问题写出「内生性来源 → 识别策略 → 关键假设」的论证链',
      '用城市面板做双向固定效应，并用事件研究图检验平行趋势',
      '用 2SLS 估计同一问题，比较 OLS 与 IV 的差异并解释 LATE',
      '主动做安慰剂检验、替换样本、替换标准误，写一节「局限与反驳」'
    ],
    intro: '这个项目不提供真实数据，而是给出一套可复现的模拟面板（200 个城市 × 10 年），其中「地铁开通」对房价有真实效应 0.08，但同时受「城市经济景气度」影响（遗漏变量）。你的任务是：先用朴素回归得到有偏估计，再用双向固定效应与工具变量把它纠正回来，并写一份结构完整的实证报告。数据生成代码在 starter 里，你可以修改参数做敏感性分析。',
    milestones: [
      {
        n: 1,
        title: '造一个「已知答案」的面板，先跑出有偏的 OLS',
        tasks: [
          '生成 200 个城市 × 10 年的面板，包含城市固定效应与年份固定效应',
          '构造「地铁开通」变量 metro，让它与城市景气度 boom 正相关（内生）',
          '跑混合 OLS：log(price) ~ metro，记录系数（应高估真值 0.08）',
          '加入年份固定效应与城市固定效应，观察系数向真值靠拢'
        ],
        starter: 'import numpy as np\nimport pandas as pd\nimport statsmodels.formula.api as smf\n\nrng = np.random.default_rng(3121)\nN, T = 200, 10\ncity = np.repeat(np.arange(N), T)\nyear = np.tile(np.arange(2014, 2024), N)\ncity_fe = rng.normal(0, 0.5, N)[city]\nyear_fe = rng.normal(0, 0.1, T)[year - 2014]\nboom = rng.normal(0, 1, N * T)\nmetro = (0.6 * boom + rng.normal(0, 1, N * T) > 0.8).astype(float)\nlogprice = 3 + 0.08 * metro + 0.25 * boom + city_fe + year_fe + rng.normal(0, 0.3, N * T)\ndf = pd.DataFrame(dict(city=city, year=year, metro=metro, boom=boom, logprice=logprice))\n\nprint(smf.ols("logprice ~ metro", data=df).fit().params["metro"])\nprint(smf.ols("logprice ~ metro + C(city) + C(year)", data=df).fit().params["metro"])',
        hints: [
          '混合 OLS 的系数会把「boom 的效应」算到 metro 头上，所以偏高。',
          'C(city) + C(year) 就是双向固定效应；城市固定效应吸收 city_fe，年份吸收宏观冲击。',
          '固定效应估计仍可能残留「随时间变化的 boom」，这就是下一节的动机。'
        ],
        solution: '混合 OLS 的 metro 系数约 0.18–0.22，远高于真值 0.08。加入双向固定效应后降到 0.10–0.14，仍偏高，因为 boom 是随时间变化的遗漏变量，固定效应吸收不掉。这一步的意义是：让你亲眼看到「固定效应不是万能」。'
      },
      {
        n: 2,
        title: '找工具变量，做 2SLS 并解释 LATE',
        tasks: [
          '构造一个工具变量 near_subway（城市是否在规划线网 1 公里内），让它影响 metro 但不直接影响房价（除通过 metro）',
          '做第一阶段回归，报告工具系数与 F 统计量',
          '用 2SLS 估计 metro 的效应，比较 OLS、FE、2SLS 三个结果',
          '解释为什么 2SLS 的估计可能不同于 FE，以及 LATE 在此处的含义'
        ],
        starter: 'from linearmodels.iv import IV2SLS\n\nnear_subway = (rng.normal(0, 1, N)[city] + rng.normal(0, 0.5, N * T) > 0.5).astype(float)\ndf["near_subway"] = near_subway\n\nfirst = smf.ols("metro ~ near_subway + C(city) + C(year)", data=df).fit()\nprint("first stage coef:", first.params["near_subway"], "F:", first.fvalue)\n\niv = IV2SLS.from_formula("logprice ~ 1 + C(year) + [metro ~ near_subway]", data=df).fit()\nprint(iv.summary)',
        hints: [
          '工具变量必须与 metro 相关（第一阶段 F 远大于 10），且不能直接影响 logprice。',
          'IV2SLS 的公式里，外生控制变量放在方括号外，内生变量与工具放在方括号内。',
          'LATE 指「因为靠近规划线网而开通地铁」的那部分城市，不是所有城市。'
        ],
        solution: '第一阶段 near_subway 的系数显著、F 远大于 10。2SLS 的 metro 系数应接近 0.08（真值），且标准误比 FE 大。三个结果的排序（混合 OLS &gt; FE &gt; 2SLS ≈ 真值）正好演示了「控制越多、识别越干净、方差越大」的权衡。LATE 的解释是：这个估计只对「因规划线网而开通」的边际城市有效。'
      },
      {
        n: 3,
        title: '攻击自己的结论：安慰剂、平行趋势与稳健性',
        tasks: [
          '做安慰剂检验：把 metro 随机打乱 200 次，看估计系数的分布是否以 0 为中心',
          '画事件研究图：以开通前 3 年为基准，画出开通前后各年的系数与置信区间',
          '把标准误从普通改为按城市聚类，观察显著性是否变化',
          '写一节 300 字的「局限与反驳」，列出至少两条你自己无法排除的威胁'
        ],
        starter: 'import matplotlib.pyplot as plt\n\n# 安慰剂：随机打乱 metro\nplacebo = []\nfor _ in range(200):\n    df["fake"] = rng.permutation(df["metro"].values)\n    placebo.append(smf.ols("logprice ~ fake + C(city) + C(year)", data=df).fit().params["fake"])\nprint(np.percentile(placebo, [2.5, 50, 97.5]))\n\n# 聚类标准误\nfe = smf.ols("logprice ~ metro + C(city) + C(year)", data=df).fit(\n    cov_type="cluster", cov_kwds={"groups": df["city"]})\nprint(fe.bse["metro"])',
        hints: [
          '安慰剂系数应以 0 为中心；若明显偏离 0，说明固定效应没吸收干净。',
          '事件研究图要把「开通前一年」设为基准（省略），否则完全共线。',
          '聚类到城市后标准误通常变大；如果显著性消失，结论要打折扣。'
        ],
        solution: '安慰剂系数分布以 0 为中心、95% 区间覆盖 0，说明没有明显的「假处理」效应。事件研究图应显示开通前系数接近 0（平行趋势成立）、开通后逐年上升。按城市聚类后标准误约增大 30%–60%，若 2SLS 的显著性下降，结论应写成「点估计支持正效应，但区间较宽」。局限至少要写：工具的外生性无法检验、LATE 不可外推、样本期内的其他政策未完全控制。'
      }
    ]
  }
]);
