/* =====================================================================
 * exam.js · 模拟卷（CSC.registerExam）
 * 结构：{ id, title, style, subtitle, date, minutes, totalScore, summary, instructions,
 *         questions:[{ no, points, type, intro, code, codeTitle, parts:[{ label, points, kind,
 *                     prompt, options:[{text,correct}], explain }] }] }
 * 目标：本站至少 1 套 100 分卷；题目编号从 1 开始连续。
 * ===================================================================== */
CSC.registerExam({
  id: 'ECO3121-A',
  title: '模拟卷 A',
  style: 'FINAL',
  subtitle: '覆盖简单回归、多元回归推断、函数形式、异方差、时间序列、面板与工具变量',
  date: '期末复习用 · 建议限时 120 分钟',
  minutes: 120,
  totalScore: 100,
  summary: '全卷 12 题、满分 100：选择题 2 组（20 分）、判断题 2 组（16 分）、计算填空 4 组（31 分）、代码输出解读 2 组（14 分）、简答关键词 2 组（19 分）。前六题覆盖第 1–5 章，后六题覆盖第 6–7 章，最后两题是识别策略的综合题。',
  instructions: [
    '闭卷，可带一张 A4 手写公式纸；计算题保留两位小数，写出关键中间步骤。',
    '选择题与判断题在答题卡上填涂；计算与简答写在答题纸上，标明题号与小题号。',
    '简答题按「关键词踩点」给分，请用「假设—后果—修正」的结构作答，不需要长篇论述。',
    '涉及代码的题目只考「读输出、说含义」，不要求默写语法；解释时请指出系数、标准误与 p 值分别说明什么。'
  ],
  questions: [
    {
      no: 1, points: 10, type: '选择题',
      intro: '某研究者用 500 名劳动者的横截面数据估计 <code>log(wage) = β<sub>0</sub> + β<sub>1</sub>educ + β<sub>2</sub>exper + u</code>，得到 β̂<sub>1</sub> = 0.082、se = 0.012。',
      parts: [
        {
          label: '(1)', points: 5, kind: 'choice',
          prompt: 'β̂<sub>1</sub> = 0.082 的正确解释是：',
          options: [
            { text: '控制经验后，教育每多一年工资平均高约 8.2%', correct: true },
            { text: '教育与工资的相关系数是 0.082' },
            { text: '教育解释了工资变异的 8.2%' },
            { text: '教育每多一年，工资增加 0.082 元' }
          ],
          explain: '半对数模型中系数 × 100 近似为百分比变化，且模型含 exper，所以是「控制经验后」的偏效应。它不是相关系数，也不是 R²；因变量取了对数，单位是百分比而非元。'
        },
        {
          label: '(2)', points: 5, kind: 'choice',
          prompt: '若把 exper 从模型中删掉，β̂<sub>1</sub> 最可能发生什么变化？',
          options: [
            { text: '变大，因为教育与被遗漏的经验正相关，且经验对工资为正效应', correct: true },
            { text: '变小，因为遗漏变量总是导致低估' },
            { text: '不变，因为教育系数只由教育与工资的关系决定' },
            { text: '无法判断方向，因为没有数据' }
          ],
          explain: '遗漏变量偏差 ≈ β<sub>exper</sub> × δ，其中 δ 是 exper 对 educ 回归的系数。教育与经验通常正相关、经验对工资为正，两项相乘为正，所以删除 exper 会高估教育回报。'
        }
      ]
    },
    {
      no: 2, points: 8, type: '判断题',
      intro: '判断下列说法，并说明理由（理由写在各小题的解释栏，考试时口述给分点即可）。',
      parts: [
        {
          label: '(1)', points: 4, kind: 'tf',
          prompt: '回归系数在 5% 水平显著，说明 x 对 y 有因果作用。',
          options: [{ text: '正确', correct: false }, { text: '错误', correct: true }],
          explain: '显著性只排除「系数为零」的抽样巧合，不处理遗漏变量、反向因果、测量误差。因果需要识别策略，不能由 p 值推出。'
        },
        {
          label: '(2)', points: 4, kind: 'tf',
          prompt: '含截距的 OLS 回归，其残差之和一定为零。',
          options: [{ text: '正确', correct: true }, { text: '错误', correct: false }],
          explain: '对截距求一阶条件得 Σû<sub>i</sub> = 0，这是含截距 OLS 的代数性质，与模型设定是否正确无关。'
        }
      ]
    },
    {
      no: 3, points: 10, type: '计算填空',
      intro: '五个观测：x = 2、4、6、8、10，y = 3、5、9、11、12。用 OLS 估计 <code>y = b<sub>0</sub> + b<sub>1</sub>x</code>。',
      parts: [
        {
          label: '(1)', points: 5, kind: 'fill',
          prompt: '斜率 b<sub>1</sub> = ？（保留两位小数）',
          answer: '1.2',
          accept: ['1.2', '1.20'],
          explain: 'x̄ = 6，ȳ = 8。x 的离差为 −4、−2、0、2、4，y 的离差为 −5、−3、1、3、4。交叉项之和 20+6+0+6+16 = 48；Σ(x−x̄)² = 16+4+0+4+16 = 40。所以 b<sub>1</sub> = 48/40 = 1.2。'
        },
        {
          label: '(2)', points: 5, kind: 'fill',
          prompt: '截距 b<sub>0</sub> = ？（提示：b<sub>0</sub> = ȳ − b<sub>1</sub>x̄，用 b<sub>1</sub> = 1.2）',
          answer: '0.8',
          accept: ['0.8', '0.80'],
          explain: 'b<sub>0</sub> = 8 − 1.2 × 6 = 8 − 7.2 = 0.8。回归线一定经过 (x̄, ȳ) = (6, 8)，这是检查截距是否算错的最快方法。'
        }
      ]
    },
    {
      no: 4, points: 8, type: '代码输出解读',
      intro: '下面是一段 R 输出（已简化）：',
      codeTitle: 'R 回归输出',
      code: 'Coefficients:\n            Estimate Std. Error t value Pr(>|t|)\n(Intercept)  5.4210     0.3012  18.00  < 2e-16 ***\neduc         0.0741     0.0098   7.56  1.2e-13 ***\nexper        0.0215     0.0041   5.24  1.8e-07 ***\n---\nResidual standard error: 0.421 on 497 degrees of freedom\nMultiple R-squared:  0.312',
      parts: [
        {
          label: '(1)', points: 4, kind: 'output',
          prompt: 'educ 的 95% 置信区间约为多少？（用 1.96 近似，保留三位小数）',
          answer: '[0.055, 0.093]',
          explain: '0.0741 ± 1.96 × 0.0098 = 0.0741 ± 0.0192，即 [0.0549, 0.0933]。区间不含 0，与 t = 7.56 的显著性一致。报告区间比只报星号更有信息量。'
        },
        {
          label: '(2)', points: 4, kind: 'output',
          prompt: 'R<sup>2</sup> = 0.312 与残差标准误 0.421 分别说明什么？各写一句。',
          answer: 'R² 表示工资对数变异的 31.2% 可由教育与经验解释；残差标准误 0.421 是残差的标准差，反映模型未解释部分的典型大小。',
          explain: 'R² 是拟合优度（样本内、被解释变异占比），残差标准误是残差的标准差（因变量单位）。两者都不是因果证据，也不能直接比较不同因变量尺度的模型。'
        }
      ]
    },
    {
      no: 5, points: 8, type: '简答',
      intro: '某研究发现「上过补习班的学生成绩更高」，回归系数显著。批评者指出：家庭收入既影响是否上补习班，也影响成绩。',
      parts: [
        {
          label: '(1)', points: 8, kind: 'keywords',
          prompt: '请用遗漏变量偏差的框架说明：为什么这个系数不能解释为补习班的因果效应？至少写出偏差公式、方向判断与一种可行的改进思路。',
          keywords: ['遗漏变量偏差', 'β_z × δ', '家庭收入', '正相关', '高估', '随机实验', '面板固定效应', '工具变量'],
          explain: '偏差 ≈ β<sub>收入</sub> × δ（收入对补习班的系数），两项通常都为正，所以 OLS 高估补习班效应。改进思路：随机分配补习班（实验）、用面板固定效应控制不随时间变化的家庭特征、或找一个只影响补习参与而不直接影响成绩的工具（如补习班距离）。'
        }
      ]
    },
    {
      no: 6, points: 10, type: '选择题',
      intro: '考虑工资方程 <code>log(wage) = β<sub>0</sub> + β<sub>1</sub>educ + β<sub>2</sub>exper + β<sub>3</sub>exper<sup>2</sup> + β<sub>4</sub>female + β<sub>5</sub>(educ·female) + u</code>，其中 female 为女性虚拟变量。',
      parts: [
        {
          label: '(1)', points: 5, kind: 'choice',
          prompt: 'β<sub>5</sub> 的含义是：',
          options: [
            { text: '女性相对男性的教育回报率差异', correct: true },
            { text: '女性的平均工资劣势' },
            { text: '教育的平均回报率' },
            { text: '经验的边际效应' }
          ],
          explain: '男性（female = 0）的教育斜率为 β<sub>1</sub>，女性为 β<sub>1</sub> + β<sub>5</sub>，所以 β<sub>5</sub> 是两组教育回报的差。女性的截距差异由 β<sub>4</sub> 承担。'
        },
        {
          label: '(2)', points: 5, kind: 'choice',
          prompt: '若 β̂<sub>2</sub> = 0.041、β̂<sub>3</sub> = −0.0007，经验的边际效应在多少年处转为零？',
          options: [
            { text: '约 29.3 年', correct: true },
            { text: '约 14.6 年' },
            { text: '约 58.6 年' },
            { text: '无法计算' }
          ],
          explain: '边际效应 0.041 − 2 × 0.0007 × exper = 0，解得 exper = 0.041/0.0014 ≈ 29.3。二次项为负，边际效应递减；超过该点后的外推要谨慎。'
        }
      ]
    },
    {
      no: 7, points: 8, type: '计算填空',
      intro: '某多元回归有 4 个解释变量，其中 x<sub>2</sub> 对其余变量回归的 R<sub>2</sub><sup>2</sup> = 0.75。',
      parts: [
        {
          label: '(1)', points: 4, kind: 'fill',
          prompt: 'x<sub>2</sub> 的 VIF 是多少？',
          answer: '4',
          accept: ['4', '4.0'],
          explain: 'VIF = 1/(1 − 0.75) = 4。经验门槛是 VIF &gt; 10（对应 R<sub>j</sub>² &gt; 0.9）。VIF = 4 表示该系数的方差是「无共线时」的 4 倍。'
        },
        {
          label: '(2)', points: 4, kind: 'fill',
          prompt: '若样本量 n = 100、k = 4，回归的 t 检验自由度是多少？',
          answer: '95',
          accept: ['95'],
          explain: '自由度 = n − k − 1 = 100 − 4 − 1 = 95。这里减去 1 是截距消耗的自由度。自由度决定 t 分布的形状，样本大时接近标准正态。'
        }
      ]
    },
    {
      no: 8, points: 8, type: '简答',
      intro: '一张残差对拟合值的散点图呈现明显的「喇叭口」：拟合值越大，残差越分散。',
      parts: [
        {
          label: '(1)', points: 8, kind: 'keywords',
          prompt: '这说明什么问题？对 OLS 估计与推断各有何影响？应如何修正？请写出三个关键词并各用一句话说明。',
          keywords: ['异方差', '无偏但无效', '标准误有偏', '稳健标准误', 'WLS', 'BP 检验', 'White 检验'],
          explain: '这是异方差：Var(u|x) 随 x 变化。系数仍无偏、一致，但 OLS 不再有效，普通标准误有偏、t/F 检验失真。修正：用 White/HC 稳健标准误（不改系数），或用 WLS/FGLS（按方差倒数加权，改变估计）。诊断可用 BP 或 White 检验。'
        }
      ]
    },
    {
      no: 9, points: 10, type: '简答＋计算',
      intro: '某季度消费函数 <code>C<sub>t</sub> = α<sub>0</sub> + α<sub>1</sub>Y<sub>t</sub> + α<sub>2</sub>C<sub>t−1</sub> + u<sub>t</sub></code>，估计得 α̂<sub>1</sub> = 0.35、α̂<sub>2</sub> = 0.55，且残差 BG 检验 p 值为 0.002。',
      parts: [
        {
          label: '(1)', points: 5, kind: 'fill',
          prompt: '收入永久增加一单位，消费的长期变化是多少？（保留两位小数）',
          answer: '0.78',
          accept: ['0.78', '0.7778'],
          explain: '长期乘数 = α<sub>1</sub>/(1 − α<sub>2</sub>) = 0.35/(1 − 0.55) ≈ 0.78。短期只增加 0.35，其余通过滞后消费逐期累积。'
        },
        {
          label: '(2)', points: 5, kind: 'keywords',
          prompt: 'BG 检验 p = 0.002 说明什么？在这样的模型里应如何报告标准误？',
          keywords: ['序列相关', '拒绝原假设', 'HAC', 'Newey–West', '标准误低估', 't 值虚高'],
          explain: 'p = 0.002 拒绝「无序列相关」，说明残差存在自相关。此时普通标准误低估、t 值虚高，应报告 HAC（Newey–West）标准误，并说明截断参数的选择。含滞后因变量时还要注意 OLS 的有偏性（Nickell 偏误）。'
        }
      ]
    },
    {
      no: 10, points: 8, type: '简答',
      intro: '某研究用 200 个城市 10 年的面板数据估计「地铁开通对房价的影响」，采用城市固定效应与年份固定效应。',
      parts: [
        {
          label: '(1)', points: 4, kind: 'keywords',
          prompt: '城市固定效应控制了什么？举两个例子。',
          keywords: ['不随时间变化的城市特征', '地理位置', '历史文化', '城市规模', '固定效应'],
          explain: '控制所有不随时间变化的城市特征，如地理位置、气候、历史文化、长期经济结构。它允许这些因素与「是否开通地铁」任意相关，这是面板相对横截面的关键优势。'
        },
        {
          label: '(2)', points: 4, kind: 'keywords',
          prompt: '还剩下什么威胁？请指出一种并说明如何检验或缓解。',
          keywords: ['随时间变化的遗漏变量', '同期经济冲击', '平行趋势', '事件研究', '安慰剂检验', '聚类标准误'],
          explain: '威胁是「随时间变化且与开通时点相关」的因素，比如同期出台的限购政策、经济下行。可用事件研究图检验开通前趋势是否平行、做安慰剂检验（假设提前开通）、控制城市特定的时间趋势，并按城市聚类标准误。'
        }
      ]
    },
    {
      no: 11, points: 7, type: '简答',
      intro: '研究者想估计「班级规模对成绩的影响」，但班级规模与学校资源、生源质量相关。有人建议用「是否超过 40 人」作为工具变量。',
      parts: [
        {
          label: '(1)', points: 7, kind: 'keywords',
          prompt: '这个工具变量需要满足哪两个条件？分别如何论证或检验？',
          keywords: ['相关性', '外生性', '排他性约束', '第一阶段 F', '制度规则', '无法直接检验'],
          explain: '相关性：超过 40 人确实导致分班、班级规模跳变，可用第一阶段 F（&gt; 10）检验。外生性/排他性：超过 40 只通过班级规模影响成绩，不直接影响成绩——这只能靠制度背景论证（分班由招生人数决定，与单个学生能力无关），无法用数据检验。'
        }
      ]
    },
    {
      no: 12, points: 5, type: '计算填空',
      intro: '某 AR(1) 模型的滞后系数 ρ̂ = 0.8。',
      parts: [
        {
          label: '(1)', points: 5, kind: 'fill',
          prompt: '一次冲击的影响减半需要多少期？（用 ln(0.5)/ln(ρ)，保留一位小数）',
          answer: '3.1',
          accept: ['3.1', '3.11', '3'],
          explain: '半衰期 = ln(0.5)/ln(0.8) = (−0.693)/(−0.223) ≈ 3.11 期。ρ 越接近 1，记忆越长、有效样本量越小，这也是序列相关会严重扭曲推断的直观原因。'
        }
      ]
    }
  ]
});
