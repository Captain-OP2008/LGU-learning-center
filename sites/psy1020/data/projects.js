/* =====================================================================
 * projects.js · PSY1020 实践项目
 * 三个项目分别对应描述统计、t 检验、相关与回归，均提供 SPSS 与 Python 双路径。
 * 每个项目 3 个 milestone，含任务、起步代码、提示与参考做法。
 * ===================================================================== */
CSC.registerProjects([
  {
    id: 'psy1020-p1',
    title: '项目一：把一份真实数据说清楚',
    en: 'DATA DESCRIPTION WORKBENCH',
    tagline: '从数据检查到描述统计表：用 Python 与 SPSS 各做一遍，比较两者的输出',
    level: '入门',
    minutes: 90,
    chapters: ['ch01', 'ch02'],
    goals: [
      '独立完成数据导入、缺失值与异常值检查',
      '按变量尺度选择正确的描述统计量与图表',
      '用 Python 生成描述统计表，并用 SPSS 复现同一张表',
      '写出一段 150 字以内的数据描述，指出分布偏态与异常值'
    ],
    intro: '本项目的目标是「不急着做检验，先把数据说清楚」。你会拿到一份包含 120 名被试的模拟数据（年龄、性别、焦虑分数、睡眠时长、组别），先做数据检查，再按尺度选择描述统计，最后用 Python 与 SPSS 各生成一张描述统计表并互相对照。重点是养成「先看分布、再算数字」的顺序。',
    milestones: [
      {
        n: 1,
        title: '导入数据并做完整性检查',
        tasks: [
          '把数据读入 Python（pandas），查看行数、列数与每列类型',
          '统计每列的缺失值数量与比例，决定删除还是填补',
          '检查年龄、焦虑、睡眠是否存在不可能值（如负数、超过量表范围）',
          '用describe()与箱线图定位疑似异常值，记录判断依据'
        ],
        starter: 'import pandas as pd\ndf = pd.read_csv("psy1020_demo.csv")\nprint(df.shape)\nprint(df.dtypes)\nprint(df.isna().sum())\nprint(df.describe())',
        hints: '先看 shape 与 dtypes，确认分类变量没有被读成数字；缺失比例超过 5% 时要说明处理理由；箱线图的 1.5×IQR 规则只是提示，不是自动删除标准。',
        solution: '用 df.isna().mean() 看缺失比例，用 df.describe(include="all") 同时看数值与分类变量；异常值先标记为 suspect 列，不要直接删，后续报告里说明「保留/剔除」两种结果。'
      },
      {
        n: 2,
        title: '按尺度生成描述统计与图表',
        tasks: [
          '连续变量报告 M、SD、Md、Min、Max、偏度',
          '分类变量报告频数与百分比',
          '为焦虑分数画直方图与箱线图，为组别画条形图',
          '用 SPSS 的 Frequencies 与 Explore 复现同一组数字'
        ],
        starter: 'num = ["age", "anxiety", "sleep_hours"]\nprint(df[num].agg(["mean", "std", "median", "min", "max", "skew"]))\nprint(df["group"].value_counts(normalize=True))\ndf["anxiety"].plot(kind="hist", bins=15)',
        hints: 'SPSS 路径是 Analyze → Descriptive Statistics → Frequencies（勾选 Mean、Median、Std. deviation、Skewness）与 Explore（含箱线图）；Python 的 skew() 与 SPSS 的偏度定义一致，可直接对照。',
        solution: '把 Python 与 SPSS 的 M、SD、Md 抄进同一张表，逐项核对；若小数位不同，统一保留两位。偏度绝对值大于 1 时，在文字里说明分布明显偏态，并同时给中位数。'
      },
      {
        n: 3,
        title: '写一段可核对的数据描述',
        tasks: [
          '用 120–150 字描述样本构成、三个连续变量的中心与离散、偏态情况',
          '明确指出选择了哪个指标代表「典型水平」，并给出理由',
          '说明异常值的数量与处理方式（保留或剔除，及理由）',
          '附一张描述统计表，表注写清 n 与单位'
        ],
        starter: '段落结构建议：样本构成 → 连续变量 M(SD) → 偏态与中位数 → 异常值处理 → 一句局限。',
        hints: '不要写「数据良好」这类空话；每个数字都要能追溯到你生成的表；如果剔除了异常值，必须同时给出剔除前后的 M 与 SD。',
        solution: '示例句式：「样本共 120 人（女性 64 人，53.3%），年龄 M = 20.4，SD = 1.8。焦虑分数呈右偏（偏度 = 1.12），Md = 42.0，M = 45.6，SD = 9.3；睡眠时长 M = 6.8 小时，SD = 1.1。依据 1.5×IQR 规则标记 4 个高焦虑疑似异常值，因量表允许该范围且无录入错误，分析中保留并在结果中报告敏感性检查。」'
      }
    ]
  },
  {
    id: 'psy1020-p2',
    title: '项目二：两种教学法的效果比较',
    en: 'T-TEST LAB',
    tagline: '从设计判断到结果写作：独立样本 t、配对 t 与 Welch 校正的完整流程',
    level: '进阶',
    minutes: 120,
    chapters: ['ch03', 'ch04'],
    goals: [
      '根据设计判断该用独立样本 t 还是配对 t',
      '检查正态性与方差齐性，必要时改用 Welch 或非参数检验',
      '计算并报告 t、df、p、Cohen\'s d 与 95% CI',
      '写出包含描述统计与方向解释的 APA 结果段'
    ],
    intro: '某学院比较「传统讲授」与「翻转课堂」两种教学法。数据包含两个独立班的期末成绩，以及一个班在学期初、学期末的两次测验。你要分别完成独立样本比较与配对比较，练习假设检查、效应量计算与结果写作。项目强调「先判断设计，再选检验」，而不是拿到数据就点 t 检验。',
    milestones: [
      {
        n: 1,
        title: '判断设计与检查假设',
        tasks: [
          '说明两个班的数据为什么是独立样本，前后测为什么是配对样本',
          '对两组期末成绩做正态性检查（偏度、Q–Q 图或 Shapiro–Wilk）',
          '做 Levene 检验，记录 p 值并决定读哪一行 t 结果',
          '写出你的检验选择及理由（三句话以内）'
        ],
        starter: 'from scipy import stats\ng1 = df.loc[df.group == "lecture", "final"]\ng2 = df.loc[df.group == "flipped", "final"]\nprint(stats.shapiro(g1), stats.shapiro(g2))\nprint(stats.levene(g1, g2))',
        hints: 'Shapiro–Wilk 对样本量敏感，n 很大时轻微偏离也会显著；结合 Q–Q 图判断更稳妥。Levene p < .05 时读 Welch 行。',
        solution: '设计判断：两个班是不同学生，独立；同一班前后测是同一批人，配对。若 Levene 显著，用 Welch t（scipy 的 equal_var=False）；若正态性严重违反且样本小，改用 Mann–Whitney U。'
      },
      {
        n: 2,
        title: '跑检验并算效应量',
        tasks: [
          '独立样本：报告 t、df、p，并计算 Cohen\'s d 与 95% CI',
          '配对样本：报告差值均值、差值 SD、t、df、p 与 dz',
          '用 SPSS 的 Compare Means 复现两个检验',
          '把结果整理成一张三线表（组别、n、M、SD、t、p、d）'
        ],
        starter: 't1, p1 = stats.ttest_ind(g1, g2, equal_var=False)\nd = (g2.mean() - g1.mean()) / (((g1.var(ddof=1) + g2.var(ddof=1)) / 2) ** 0.5)\nprint(t1, p1, d)\nt2, p2 = stats.ttest_rel(df.pre, df.post)\nprint(t2, p2, (df.post - df.pre).mean(), (df.post - df.pre).std(ddof=1))',
        hints: 'd 的符号取决于你减的方向，报告时要说明「翻转减传统」；配对 t 的 dz = 差值均值 / 差值 SD，不要用两组的 SD 合并。SPSS 路径：Analyze → Compare Means → Independent-Samples T Test / Paired-Samples T Test。',
        solution: '独立样本示例：t(78) = −2.14，p = .035，d = 0.48，95% CI [0.04, 0.92]；配对示例：差值 M = 4.2，SD = 6.1，t(39) = 4.35，p < .001，dz = 0.69。两个检验都要在表注写清方向与使用的方差假设。'
      },
      {
        n: 3,
        title: '写结果段并做敏感性检查',
        tasks: [
          '写一段 120 字左右的 APA 结果段，含描述、检验、效应量、方向',
          '说明若方差不齐时结果是否改变结论',
          '说明若剔除异常值，结论是否稳健',
          '列出这项比较的两条局限（如非随机分班、教师差异）'
        ],
        starter: '结果段模板：描述（各组 M、SD、n）→ 检验（t、df、p、d、CI）→ 方向（哪组更高）→ 一句解释。',
        hints: '不要写「显著优于」却不给均值；不要把 p < .05 写成「证明有效」；敏感性检查只需报告结论是否改变，不必贴全部输出。',
        solution: '示例：「翻转课堂组（n = 40，M = 82.4，SD = 8.1）期末成绩高于传统组（n = 40，M = 78.6，SD = 8.9），t(78) = −2.14，p = .035，d = 0.48，95% CI [0.04, 0.92]。Levene 检验不显著，采用方差齐性结果；剔除 2 个疑似异常值后结论不变。因分班非随机，差异不能直接归因于教学法。」'
      }
    ]
  },
  {
    id: 'psy1020-p3',
    title: '项目三：屏幕时间与睡眠的关系',
    en: 'CORRELATION & REGRESSION PRACTICUM',
    tagline: '散点图、相关、回归与诊断：一条完整的观察研究分析链',
    level: '综合',
    minutes: 150,
    chapters: ['ch06', 'ch07'],
    goals: [
      '用散点图判断关系形状、异常值与范围限制',
      '计算 Pearson r 与 95% CI，并正确解释 r²',
      '建立一元回归、检查残差，再扩展到多元回归',
      '区分相关与因果，写出有节制的结论'
    ],
    intro: '本项目使用一份观察数据：120 名大学生的每日屏幕时间、睡眠时长、焦虑分数与年级。你要完成从散点图到回归诊断的完整链条，并回答「屏幕时间能解释多少睡眠变异」「控制焦虑后关系是否仍在」两个问题。项目结束时，你需要交出一张相关矩阵、一张回归表、两张诊断图与一段 200 字以内的结论。',
    milestones: [
      {
        n: 1,
        title: '画图并计算相关',
        tasks: [
          '画屏幕时间与睡眠的散点图，叠加拟合线',
          '计算 Pearson r、p 与 95% CI（可用 pingouin 或 Fisher z）',
          '计算 r²，用一句话解释「解释了多少变异」',
          '检查是否存在异常值、非线性或范围限制'
        ],
        starter: 'import seaborn as sns\nimport pingouin as pg\nsns.regplot(data=df, x="screen_hours", y="sleep_hours")\nprint(pg.corr(df.screen_hours, df.sleep_hours, method="pearson"))',
        hints: '先看散点图再算 r；若出现明显弯曲，考虑加二次项或改用 Spearman。pingouin.corr 默认输出 95% CI，比 scipy 方便。',
        solution: '示例结果：r = −.34，95% CI [−.49, −.16]，p < .001，r² = .12；散点图未见明显非线性，2 个高屏幕时间点值得关注但不足以改变结论。'
      },
      {
        n: 2,
        title: '建立回归并检查残差',
        tasks: [
          '用 statsmodels 拟合 sleep ~ screen，报告 b、SE、t、p、R²',
          '画出残差 vs 拟合值图与 Q–Q 图',
          '判断线性、等方差、正态性是否满足，记录处理方式',
          '用 SPSS 的 Linear Regression 复现系数表'
        ],
        starter: 'import statsmodels.formula.api as smf\nm = smf.ols("sleep_hours ~ screen_hours", data=df).fit()\nprint(m.summary())\nresid = m.resid\nfitted = m.fittedvalues',
        hints: '残差图出现漏斗形说明方差不齐；出现弯曲说明需要非线性项。SPSS 的 Plots 里把 *ZRESID 放 Y、*ZPRED 放 X 即可。',
        solution: '示例：Ŷ = 7.62 − 0.21×screen，b = −0.21，SE = 0.05，t = −3.92，p < .001，R² = .12。残差图基本随机，Q–Q 图接近对角线，未做变换。'
      },
      {
        n: 3,
        title: '扩展多元回归并讨论因果边界',
        tasks: [
          '加入焦虑分数作为第二个预测变量，比较调整后 R² 与 ΔR²',
          '检查 VIF，说明是否存在多重共线性',
          '回答「控制焦虑后屏幕时间是否仍显著」',
          '写一段结论，明确哪些是相关、哪些不能推因果'
        ],
        starter: 'm2 = smf.ols("sleep_hours ~ screen_hours + anxiety", data=df).fit()\nprint(m2.summary())\nfrom statsmodels.stats.outliers_influence import variance_inflation_factor',
        hints: 'ΔR² 用两个模型的 rsquared 相减；VIF > 10 提示共线性严重。结论里避免「导致」「影响」这类动词，除非设计支持。',
        solution: '示例：加入焦虑后 R² 从 .12 升到 .19，ΔR² = .07，F(1, 117) = 9.8，p = .002；屏幕时间的 b 从 −0.21 变为 −0.16，仍显著。VIF 均小于 2。结论应写「屏幕时间与睡眠呈负相关，控制焦虑后关联减弱但仍存在；横断设计不能排除反向因果与未测混杂」。'
      }
    ]
  }
]);
