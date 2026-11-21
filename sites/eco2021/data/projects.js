/* =====================================================================
 * projects.js · ECO2021 实战项目
 * 结构：{ id, title, en, tagline, level, minutes, chapters, goals, intro,
 *         milestones:[{ n, title, tasks, starter, hints, solution }] }
 * 目标：3 个宏观数据分析项目，由易到难，分别落在增长核算、菲利普斯曲线
 *       与开放经济政策模拟上。
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerProjects([

    /* ------------------------------------------------------------ 项目 1 */
    {
      id: 'eco2021-p1',
      title: '从一张 GDP 表读出增长与通胀',
      en: 'Growth and Inflation from GDP Data',
      tagline: '用名义 GDP、实际 GDP、人口与 CPI 四列数据，算清增长率、人均产出、平减指数与通胀，并写出一页解读。',
      level: '入门',
      minutes: 120,
      chapters: ['ch01', 'ch02'],
      goals: [
        '能区分名义与实际口径，说明平减指数与 CPI 各自衡量什么',
        '能计算实际 GDP 增长率、人均实际 GDP 与人均增长率',
        '能用七十法则估算翻倍时间，并与精确计算对照',
        '能写出一页数据解读，指出一个不能从这四列数据得出的结论'
      ],
      intro: '下面的数据是某经济体 2018–2024 年的年度序列（教学用虚构数据，单位：十亿元）。' +
        '名义 GDP 逐年上升，但其中一部分只是价格上涨。你的任务是把「增长」与「通胀」拆开：' +
        '先统一口径，再算实际增长率与人均值，最后解释 2020 年的异常与 2021–2022 年的反弹。' +
        '所有计算用 pandas 完成，图可以用 matplotlib 画。',
      milestones: [
        {
          n: 1,
          title: '数据清洗与口径统一',
          tasks: [
            '把数据读入 DataFrame，检查每列单位与缺失值，确认年份连续',
            '用名义 GDP 除以实际 GDP 再乘 100，构造 GDP 平减指数列',
            '用 CPI 除以基年 CPI 再乘 100，构造 CPI 指数列，并说明它与平减指数的差别',
            '把实际 GDP 除以人口，得到人均实际 GDP（单位换算成人均元）'
          ],
          starter: 'import pandas as pd\n\ndf = pd.DataFrame({\n    "year": [2018, 2019, 2020, 2021, 2022, 2023, 2024],\n    "nominal_gdp": [90.0, 95.0, 93.0, 105.0, 112.0, 118.0, 124.0],\n    "real_gdp":    [90.0, 92.5, 89.0, 95.0, 98.0, 101.0, 104.0],\n    "population":  [1.40, 1.41, 1.415, 1.42, 1.425, 1.43, 1.435],\n    "cpi":         [100.0, 102.0, 102.6, 105.0, 110.0, 114.0, 117.0]\n})\n\ndf["deflator"] = df["nominal_gdp"] / df["real_gdp"] * 100\ndf["real_gdp_pc"] = df["real_gdp"] / df["population"]\nprint(df.head())',
          hints: [
            '平减指数覆盖国内生产的全部最终产品，CPI 只覆盖居民消费篮子且包含进口品，两者不必相等',
            '人口单位是十亿人，实际 GDP 单位是十亿元，相除得到的是「十亿元/十亿人」即万元/人，再乘 10000 换成元',
            '保留原始列，新增派生列，不要覆盖原始数据，后面还要用名义与实际两列'
          ],
          solution: 'import pandas as pd\n\ndf = pd.DataFrame({\n    "year": [2018, 2019, 2020, 2021, 2022, 2023, 2024],\n    "nominal_gdp": [90.0, 95.0, 93.0, 105.0, 112.0, 118.0, 124.0],\n    "real_gdp":    [90.0, 92.5, 89.0, 95.0, 98.0, 101.0, 104.0],\n    "population":  [1.40, 1.41, 1.415, 1.42, 1.425, 1.43, 1.435],\n    "cpi":         [100.0, 102.0, 102.6, 105.0, 110.0, 114.0, 117.0]\n})\ndf["deflator"] = df["nominal_gdp"] / df["real_gdp"] * 100\ndf["real_gdp_pc"] = df["real_gdp"] / df["population"] * 10000\nprint(df[["year", "deflator", "real_gdp_pc"]])'
        },
        {
          n: 2,
          title: '增长率、人均与七十法则',
          tasks: [
            '计算实际 GDP 的同比增长率（%），以及人均实际 GDP 的增长率',
            '计算 2018–2024 年的年均复合增长率（CAGR），用 (末/初)^(1/年数) − 1',
            '用七十法则估算按该 CAGR 翻倍需要多少年，再用 log(2)/log(1+g) 精确计算并比较误差',
            '找出实际 GDP 负增长的年份，计算 2020 年产出缺口的一个粗略估计（假设潜在增速为 3%）'
          ],
          starter: 'df["g_real"] = df["real_gdp"].pct_change() * 100\ndf["g_pc"] = df["real_gdp_pc"].pct_change() * 100\n\nn = len(df) - 1\ncagr = (df["real_gdp"].iloc[-1] / df["real_gdp"].iloc[0]) ** (1 / n) - 1\nprint(df[["year", "g_real", "g_pc"]])\nprint("CAGR =", cagr)',
          hints: [
            'pct_change() 默认与上一行比较，第一年会得到 NaN，这是正常的',
            'CAGR 的「年数」是间隔数：7 个年度观测只有 6 个增长区间',
            '七十法则给出 70/g（g 用百分数），精确值是 ln2/ln(1+g)，g 越大两者偏差越大'
          ],
          solution: 'import numpy as np\n\ndf["g_real"] = df["real_gdp"].pct_change() * 100\ndf["g_pc"] = df["real_gdp_pc"].pct_change() * 100\nn = len(df) - 1\ncagr = (df["real_gdp"].iloc[-1] / df["real_gdp"].iloc[0]) ** (1 / n) - 1\nprint(df[["year", "g_real", "g_pc"]])\nprint("CAGR = %.2f%%" % (cagr * 100))\nprint("七十法则翻倍年数 = %.1f" % (70 / (cagr * 100)))\nprint("精确翻倍年数 = %.1f" % (np.log(2) / np.log(1 + cagr)))\n\n# 粗略产出缺口：以 2019 为基年、潜在增速 3%\npotential = df.loc[0, "real_gdp"] * (1.03 ** np.arange(len(df)))\ndf["gap"] = (df["real_gdp"] / potential - 1) * 100\nprint(df[["year", "gap"]])'
        },
        {
          n: 3,
          title: '一页解读与边界声明',
          tasks: [
            '画两张图：实际 GDP 与人均实际 GDP 的时间路径；平减指数通胀率与 CPI 通胀率的对比',
            '用 150 字解释 2020 年发生了什么、2021–2022 年名义与实际为何背离',
            '指出这四列数据无法回答的一个问题（例如分配、闲暇、环境），并说明需要什么补充数据',
            '把代码整理成可复现的脚本，加注释说明每个派生列的定义'
          ],
          starter: 'import matplotlib.pyplot as plt\n\ndf["infl_deflator"] = df["deflator"].pct_change() * 100\ndf["infl_cpi"] = df["cpi"].pct_change() * 100\n\nfig, ax = plt.subplots(1, 2, figsize=(10, 4))\nax[0].plot(df["year"], df["real_gdp"], marker="o")\nax[0].set_title("Real GDP")\nax[1].plot(df["year"], df["infl_deflator"], marker="o", label="deflator")\nax[1].plot(df["year"], df["infl_cpi"], marker="s", label="CPI")\nax[1].legend()\nplt.tight_layout()\nplt.show()',
          hints: [
            '两条通胀线不重合是正常的：2022 年进口能源涨价会先推高 CPI，平减指数反应较慢',
            '解读时把「名义增长 = 实际增长 + 通胀」写成近似式，并指出交互项很小',
            '边界声明要具体：说「GDP 不含家务劳动」比说「GDP 不完美」更有信息量'
          ],
          solution: 'import matplotlib.pyplot as plt\n\ndf["infl_deflator"] = df["deflator"].pct_change() * 100\ndf["infl_cpi"] = df["cpi"].pct_change() * 100\n\nfig, ax = plt.subplots(1, 2, figsize=(10, 4))\nax[0].plot(df["year"], df["real_gdp"], marker="o", label="real GDP")\nax[0].plot(df["year"], df["real_gdp_pc"], marker="s", label="per capita")\nax[0].legend(); ax[0].set_title("Levels")\nax[1].plot(df["year"], df["infl_deflator"], marker="o", label="deflator")\nax[1].plot(df["year"], df["infl_cpi"], marker="s", label="CPI")\nax[1].legend(); ax[1].set_title("Inflation (%)")\nplt.tight_layout(); plt.show()\n\n# 解读要点：2020 年实际 GDP 下降、平减指数仍为正，说明是供给与需求同时收缩；\n# 2021–2022 年名义增速高于实际增速，差额主要是通胀。\n# 四列数据无法回答分配问题：需要家庭调查或税收微观数据。'
        }
      ]
    },

    /* ------------------------------------------------------------ 项目 2 */
    {
      id: 'eco2021-p2',
      title: '失业与通胀：菲利普斯曲线的数据检验',
      en: 'Phillips Curve in the Data',
      tagline: '用 40 个季度的失业率与核心通胀，画散点、做回归、分样本，判断短期取舍是否稳定。',
      level: '中级',
      minutes: 180,
      chapters: ['ch01', 'ch05', 'ch06'],
      goals: [
        '能构造季度通胀率与失业率序列，并说明同比与环比口径的取舍',
        '能画散点图并拟合简单回归，正确解释斜率与 R²',
        '能区分短期菲利普斯曲线、长期垂直曲线与预期 augmented 版本',
        '能识别供给冲击造成的离群点，并说明为什么它会让简单回归失效'
      ],
      intro: '数据集包含某经济体 2014Q1–2023Q4 的失业率（u）与核心 CPI 同比（pi），另有 2020–2021 的疫情虚拟变量。' +
        '你先做一个「教科书版」的菲利普斯曲线回归，再用滚动窗口与分样本检验它是否稳定。' +
        '重点不是追求高 R²，而是理解斜率在不同制度与冲击下为什么会变。',
      milestones: [
        {
          n: 1,
          title: '构造序列与描述统计',
          tasks: [
            '读入 CSV，把季度字符串转成 PeriodIndex，检查缺失与异常值',
            '计算通胀的季度环比年化率，与同比序列对照，说明各自的优缺点',
            '按十年或按疫情前后分组，输出均值、标准差与相关系数',
            '画双轴时间序列图，标出 2020Q2 与 2022Q1 两个关键点'
          ],
          starter: 'import pandas as pd\n\ndf = pd.read_csv("phillips.csv")\ndf["q"] = pd.PeriodIndex(df["quarter"], freq="Q")\ndf = df.set_index("q").sort_index()\n\n# 同比通胀已在 pi 列；环比年化：((1+pi_mom)^4 - 1) * 100\ndf["pi_yoy"] = df["pi"]\ndf["pi_qoq_ann"] = ((1 + df["pi_mom"] / 100) ** 4 - 1) * 100\nprint(df[["u", "pi_yoy", "pi_qoq_ann"]].describe())',
          hints: [
            '同比平滑但滞后，环比敏感但噪声大；季度数据用环比年化更接近「当期压力」',
            '检查 2020Q2：失业率骤升、通胀骤降，这是供给与需求同时冲击的极端点',
            '相关系数要用同期还是滞后一期？两种都算，比较差异'
          ],
          solution: 'import pandas as pd\n\ndf = pd.read_csv("phillips.csv")\ndf["q"] = pd.PeriodIndex(df["quarter"], freq="Q")\ndf = df.set_index("q").sort_index()\ndf["pi_qoq_ann"] = ((1 + df["pi_mom"] / 100) ** 4 - 1) * 100\n\nprint(df[["u", "pi_yoy", "pi_qoq_ann"]].describe())\nprint("corr contemporaneous:", df["u"].corr(df["pi_yoy"]))\nprint("corr lagged:", df["u"].shift(1).corr(df["pi_yoy"]))\n\npre = df.loc[:"2019Q4"]\npost = df.loc["2021Q1":]\nprint("pre mean", pre[["u", "pi_yoy"]].mean().to_dict())\nprint("post mean", post[["u", "pi_yoy"]].mean().to_dict())'
        },
        {
          n: 2,
          title: '回归与滚动稳定性',
          tasks: [
            '用 statsmodels 跑 pi = a + b·u + e，报告斜率、标准误与 R²',
            '加入滞后失业率与油价同比作为控制变量，观察斜率是否变化',
            '用 20 季度滚动窗口估计斜率，画出斜率随时间的变化',
            '解释「斜率变平」可能来自锚定预期、全球化或劳动市场结构变化中的哪些机制'
          ],
          starter: 'import statsmodels.formula.api as smf\n\nm1 = smf.ols("pi_yoy ~ u", data=df).fit(cov_type="HAC", cov_kwds={"maxlags": 4})\nprint(m1.summary())\n\nm2 = smf.ols("pi_yoy ~ u + u_lag + oil_yoy", data=df).fit(cov_type="HAC", cov_kwds={"maxlags": 4})\nprint(m2.params)',
          hints: [
            '预期通胀上升会整体抬高曲线，而不是只改变斜率；augmented 版本要控制预期或滞后通胀',
            'HAC 标准误处理序列相关与异方差，季度数据 maxlags 取 4 左右',
            '滚动斜率若在 2020 后明显变平，要注意样本太短导致的估计噪声，不要过度解读'
          ],
          solution: 'import statsmodels.formula.api as smf\nimport matplotlib.pyplot as plt\n\nm1 = smf.ols("pi_yoy ~ u", data=df).fit(cov_type="HAC", cov_kwds={"maxlags": 4})\nprint(m1.params, m1.rsquared)\n\nm2 = smf.ols("pi_yoy ~ u + u_lag + oil_yoy", data=df).fit(cov_type="HAC", cov_kwds={"maxlags": 4})\nprint(m2.params)\n\nslopes = []\nfor i in range(20, len(df) + 1):\n    sub = df.iloc[i - 20:i]\n    slopes.append(smf.ols("pi_yoy ~ u", data=sub).fit().params["u"])\nplt.plot(df.index[19:].to_timestamp(), slopes)\nplt.axhline(0, color="gray", lw=0.8)\nplt.title("Rolling slope of Phillips curve (20q)")\nplt.show()'
        },
        {
          n: 3,
          title: '写一份两页的政策备忘',
          tasks: [
            '用一段话回答：数据是否支持「降低失业必然推高通胀」这一短期命题',
            '指出至少一个内生性问题（例如央行对通胀反应导致 u 与 pi 同向变动），并说明可用什么工具或自然实验缓解',
            '讨论 2020–2022 的离群点对回归结果的影响：删掉它们斜率会怎么变',
            '给出三条对政策制定者有操作性的结论，每条附一个不确定性说明'
          ],
          starter: 'df["covid"] = ((df.index >= "2020Q1") & (df.index <= "2021Q4")).astype(int)\nm3 = smf.ols("pi_yoy ~ u + covid", data=df).fit(cov_type="HAC", cov_kwds={"maxlags": 4})\nprint(m3.params)\n\n# 删除疫情样本后重估\nm4 = smf.ols("pi_yoy ~ u", data=df[df["covid"] == 0]).fit(cov_type="HAC", cov_kwds={"maxlags": 4})\nprint(m4.params)',
          hints: [
            '央行同时盯失业与通胀，会让 u 与 pi 的同期相关混入政策反应，不能直接读成因果',
            '疫情虚拟变量只能吸收水平位移，不能吸收斜率变化；可以加交互项 u×covid',
            '政策结论要区分「短期管理需求」与「长期锚定预期」，两者工具不同'
          ],
          solution: 'df["covid"] = ((df.index >= "2020Q1") & (df.index <= "2021Q4")).astype(int)\nm3 = smf.ols("pi_yoy ~ u + covid + u:covid", data=df).fit(cov_type="HAC", cov_kwds={"maxlags": 4})\nprint(m3.params)\n\n# 结论模板：\n# 1) 短期存在负相关，但斜率在疫情后变平且不显著，不能假定稳定取舍；\n# 2) 政策应优先锚定预期，避免用制造意外通胀来换短期就业；\n# 3) 供给冲击期，需求管理对通胀的效果有限，需配合供给政策。\n# 不确定性：样本短、内生性强、油价与全球因素难以完全控制。'
        }
      ]
    },

    /* ------------------------------------------------------------ 项目 3 */
    {
      id: 'eco2021-p3',
      title: '开放经济政策模拟器',
      en: 'Open Economy Policy Simulator',
      tagline: '用恒等式、泰勒规则与利率平价搭一个小型宏观模型，模拟财政扩张、货币紧缩与风险溢价冲击。',
      level: '进阶',
      minutes: 240,
      chapters: ['ch03', 'ch04', 'ch07'],
      goals: [
        '能把 S − I = CA、利率平价与泰勒规则写成一组可迭代的方程',
        '能在浮动汇率与固定汇率两种制度下模拟同一冲击，比较产出、通胀与经常账户',
        '能解释模拟结果对参数（资本流动性、进口依存度、政策反应系数）的敏感性',
        '能写一份政策备忘，说明模型省略了什么、结论在什么条件下成立'
      ],
      intro: '本项目的模型是一个「教学版」蒙代尔—弗莱明结构：产出缺口由总需求决定，通胀由缺口与汇率传递决定，' +
        '央行按泰勒规则设定利率，汇率由利率平价与风险溢价决定，经常账户由 S − I 与实际汇率共同决定。' +
        '参数是刻意简化的，你的目标不是预测现实，而是看清不同制度下冲击的传导方向。',
      milestones: [
        {
          n: 1,
          title: '搭模型与校准',
          tasks: [
            '写出五个方程：IS 曲线、菲利普斯曲线、泰勒规则、利率平价、经常账户恒等式',
            '为每个参数设定基准值，并说明取值依据（教材典型值或数量级判断）',
            '写一个 simulate(shock, regime, periods=20) 函数，返回产出缺口、通胀、利率、汇率与 CA 的路径',
            '先跑一个无冲击基线，确认所有变量收敛到稳态'
          ],
          starter: 'import numpy as np\nimport pandas as pd\n\ndef simulate(shock=0.0, regime="float", periods=20, phi=0.5, beta=0.3, gamma=0.2):\n    y = np.zeros(periods); pi = np.zeros(periods); i = np.zeros(periods)\n    e = np.zeros(periods); ca = np.zeros(periods)\n    for t in range(periods):\n        y[t] = -phi * (i[t-1] if t else 0) + shock\n        pi[t] = beta * y[t] + gamma * (e[t-1] if t else 0)\n        i[t] = 1.5 * pi[t] + 0.5 * y[t]\n        e[t] = i[t] - 2.0 if regime == "float" else 0.0\n        ca[t] = 0.2 * y[t] - 0.1 * e[t]\n    return pd.DataFrame({"y": y, "pi": pi, "i": i, "e": e, "ca": ca})',
          hints: [
            '先写稳态：无冲击时 y = pi = 0、i = r*、e = 0、ca = 0，再写偏离稳态的线性方程',
            '固定汇率下 e 恒为 0，央行失去利率独立性：i 必须跟随世界利率，货币政策方程要替换',
            '迭代顺序会影响结果，但收敛后差异很小；固定一个清晰的时序约定并写进注释'
          ],
          solution: 'import numpy as np\nimport pandas as pd\n\ndef simulate(shock=0.0, regime="float", periods=20, phi=0.5, beta=0.3, gamma=0.2):\n    y = np.zeros(periods); pi = np.zeros(periods); i = np.zeros(periods)\n    e = np.zeros(periods); ca = np.zeros(periods)\n    for t in range(periods):\n        i_prev = i[t-1] if t else 0.0\n        e_prev = e[t-1] if t else 0.0\n        y[t] = -phi * i_prev + shock\n        pi[t] = beta * y[t] + gamma * e_prev\n        i[t] = 1.5 * pi[t] + 0.5 * y[t] if regime == "float" else 0.0\n        e[t] = (i[t] - 2.0) / 2.0 if regime == "float" else 0.0\n        ca[t] = 0.2 * y[t] - 0.1 * e[t]\n    return pd.DataFrame({"y": y, "pi": pi, "i": i, "e": e, "ca": ca})'
        },
        {
          n: 2,
          title: '三种冲击 × 两种制度',
          tasks: [
            '财政扩张：shock = +1，分别跑浮动与固定汇率，比较 y、i、e、ca 的路径',
            '货币紧缩：把泰勒规则截距提高 1 个单位，观察汇率升值与净出口下降',
            '风险溢价冲击：在世界利率上加 1 个单位，比较两种制度下产出与储备调整',
            '把六条路径画成 2×3 的子图，标注峰值与半衰期'
          ],
          starter: 'cases = {\n    "fiscal": simulate(shock=1.0, regime="float"),\n    "fiscal_fix": simulate(shock=1.0, regime="fix"),\n    "risk_float": simulate(shock=0.0, regime="float"),\n}\nfor k, v in cases.items():\n    print(k, "peak y =", v["y"].max(), "peak pi =", v["pi"].max())',
          hints: [
            '浮动汇率下财政扩张会被本币升值部分抵消，固定汇率下则保留更多产出效应但储备承压',
            '风险溢价上升时，浮动汇率靠贬值吸收，固定汇率必须加息或卖外汇，产出收缩更明显',
            '半衰期可以用「峰值首次回落到一半」的期数近似，不必精确'
          ],
          solution: 'import matplotlib.pyplot as plt\n\nscenarios = {\n    "Fiscal / float": simulate(shock=1.0, regime="float"),\n    "Fiscal / fix": simulate(shock=1.0, regime="fix"),\n    "Risk / float": simulate(shock=-1.0, regime="float"),\n    "Risk / fix": simulate(shock=-1.0, regime="fix")\n}\nfig, axes = plt.subplots(2, 2, figsize=(10, 6), sharex=True)\nfor ax, (name, d) in zip(axes.ravel(), scenarios.items()):\n    ax.plot(d["y"], label="output gap")\n    ax.plot(d["pi"], label="inflation")\n    ax.plot(d["ca"], label="current account")\n    ax.set_title(name); ax.legend()\nplt.tight_layout(); plt.show()'
        },
        {
          n: 3,
          title: '敏感性分析与政策备忘',
          tasks: [
            '让资本流动性参数（利率对利差的敏感度）从 0.5 变到 3，记录产出峰值的范围',
            '让进口依存度从 0.1 变到 0.4，观察财政乘数与 CA 的变化',
            '写 300 字备忘：在什么条件下固定汇率优于浮动汇率，代价是什么',
            '列出模型至少三个省略（预期、金融摩擦、期限结构、非线性），并说明各自会如何改变结论'
          ],
          starter: 'rows = []\nfor k in [0.5, 1.0, 2.0, 3.0]:\n    d = simulate(shock=1.0, regime="float", phi=k)\n    rows.append({"k": k, "peak_y": d["y"].max(), "peak_ca": d["ca"].abs().max()})\nprint(pd.DataFrame(rows))',
          hints: [
            '敏感性分析不要只报一个数，要报区间与方向：参数变大时结论是增强还是反转',
            '固定汇率的优势是降低贸易与资本流动的汇率风险，代价是丧失货币政策独立性、需要储备或资本管制',
            '省略预期会让模型低估通胀的持续性；省略金融摩擦会低估危机时的非线性放大'
          ],
          solution: 'rows = []\nfor k in [0.5, 1.0, 2.0, 3.0]:\n    d = simulate(shock=1.0, regime="float", phi=k)\n    rows.append({"k": k, "peak_y": round(d["y"].max(), 3),\n                 "peak_ca": round(d["ca"].abs().max(), 3)})\nprint(pd.DataFrame(rows))\n\n# 备忘要点：\n# 固定汇率适合贸易依存度高、冲击以外部名义冲击为主、储备充足的经济；\n# 代价是货币政策受制、需要冲销与资本管理，危机时调整更痛苦。\n# 模型省略预期、金融摩擦与非线性，结论应表述为方向性而非精确预测。'
        }
      ]
    }
  ]);
})();
