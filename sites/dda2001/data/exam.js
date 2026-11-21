/* =====================================================================
 * exam.js · 模拟卷（CSC.registerExam）
 * 结构：{ id, title, style, subtitle, date, minutes, totalScore, summary, instructions,
 *         questions:[{ no, points, type, intro, code, codeTitle, parts:[{ label, points, kind,
 *                     prompt, options:[{text,correct}], explain }] }] }
 * 目标：本站至少 1 套 100 分卷；题目编号从 1 开始连续。
 * ===================================================================== */
CSC.registerExam({
  id: 'DDA2001-A',
  title: '模拟卷 A',
  style: 'FINAL',
  subtitle: '覆盖概率、统计推断、线性回归、凸优化与机器学习入门的一张综合卷',
  date: '2026-11-21',
  minutes: 110,
  totalScore: 100,
  summary: '共 12 题、满分 100 分：选择题 5 题、判断题 1 题、填空题 3 题、程序输出题 2 题、简答题 1 题。前六题考概率与统计推断，后六题考回归、凸性与机器学习。',
  instructions: [
    '闭卷，限时 110 分钟；除特别说明外，数值答案保留两位小数。',
    '选择题与判断题只需写出选项；填空题写出数值或表达式即可。',
    '程序输出题按给出的 Python 代码推演，不要假设未写出的库函数行为。',
    '简答题按要点给分，写出结论与理由各占一半。'
  ],
  questions: [
    {
      no: 1,
      points: 8,
      type: '选择题',
      intro: '某疾病在人群中的患病率为 1%。一种筛查的灵敏度为 99%，特异度为 95%。某人筛查结果为阳性。',
      parts: [
        {
          label: '第 1 问',
          points: 8,
          kind: 'choice',
          prompt: '该人真正患病的概率最接近下列哪个值？',
          options: [
            { text: '约 16.7%', correct: true },
            { text: '约 99%' },
            { text: '约 50%' },
            { text: '约 5%' }
          ],
          explain: 'P(+)=0.01×0.99+0.99×0.05=0.0099+0.0495=0.0594，后验概率 = 0.0099/0.0594 ≈ 16.7%。患病率很低时，假阳性会把阳性人群中的真患者比例压得很低，这正是贝叶斯公式要提醒的事。'
        }
      ]
    },
    {
      no: 2,
      points: 8,
      type: '选择题',
      intro: '设 X 表示 10 道单选题中猜对的题数，每题 4 个选项，答题者对每题完全随机猜测。',
      parts: [
        {
          label: '第 1 问',
          points: 8,
          kind: 'choice',
          prompt: 'P(X = 3) 最接近：',
          options: [
            { text: '0.2503', correct: true },
            { text: '0.0031' },
            { text: '0.7500' },
            { text: '0.0937' }
          ],
          explain: 'X 服从二项分布 B(10, 0.25)，P(X=3)=C(10,3)×0.25³×0.75⁷=120×0.015625×0.1335≈0.2503。猜对题数的期望是 2.5 题，不是 5 题。'
        }
      ]
    },
    {
      no: 3,
      points: 10,
      type: '填空题',
      intro: '掷一枚均匀的六面骰子，X 为朝上的点数。',
      parts: [
        {
          label: '第 1 问',
          points: 10,
          kind: 'fill',
          prompt: '求 Var(X)，用分数或两位小数表示。',
          answer: '35/12',
          accept: ['35/12', '2.92', '2.917', '2.9167'],
          explain: 'E(X)=3.5，E(X²)=(1+4+9+16+25+36)/6=91/6≈15.167，Var(X)=15.167−12.25=35/12≈2.9167，标准差约 1.708。'
        }
      ]
    },
    {
      no: 4,
      points: 6,
      type: '判断题',
      intro: '下列关于中心极限定理的判断：',
      parts: [
        {
          label: '第 1 问',
          points: 6,
          kind: 'tf',
          prompt: '总体方差有限时，无论总体服从什么分布，样本量足够大后样本均值的抽样分布都近似正态。',
          options: [
            { text: '正确', correct: true },
            { text: '错误' }
          ],
          explain: '这句话正是中心极限定理的内容：有限方差下，样本均值的标准化量依分布收敛到标准正态，与总体形状无关。若总体方差无穷（如柯西分布），结论不成立。'
        }
      ]
    },
    {
      no: 5,
      points: 10,
      type: '程序输出题',
      intro: '下面的代码计算样本均值 70、样本标准差 10、样本量 25 时 95% 置信区间的半宽。',
      parts: [
        {
          label: '第 1 问',
          points: 10,
          kind: 'output',
          prompt: '程序打印出的数字是多少？',
          code: 'from scipy import stats\n\nn, xbar, s = 25, 70, 10\nt = stats.t.ppf(0.975, n - 1)\nme = t * s / n ** 0.5\nprint(round(me, 2))',
          answer: '4.13',
          accept: ['4.13', '4.1278', '4.127'],
          explain: 't(24, 0.975)=2.0639，s/√n=10/5=2，半宽 = 2.0639×2 = 4.1278，四舍五入为 4.13，对应区间 [65.87, 74.13]。'
        }
      ]
    },
    {
      no: 6,
      points: 8,
      type: '简答题',
      intro: '对同一批数据，某同学报告了 95% 置信区间 [65.87, 74.13]，并说「真实均值有 95% 的概率落在这个区间内」。',
      parts: [
        {
          label: '第 1 问',
          points: 8,
          kind: 'keywords',
          prompt: '指出这句话的问题，并用一句话说明置信区间的正确含义。',
          answer: '真实均值是固定的，不是随机变量；正确含义是：如果重复抽样并按同样方法构造区间，约有 95% 的区间会覆盖真实均值，而某个已经算出的具体区间要么覆盖要么不覆盖。',
          accept: ['95%', '覆盖', '重复抽样'],
          explain: '置信水平描述的是构造方法的长期覆盖率，不是某个具体区间的概率。这句话把固定参数当成了随机变量，是频率派区间最常见的误读。'
        }
      ]
    },
    {
      no: 7,
      points: 10,
      type: '填空题',
      intro: '对五组数据 x = 1, 2, 3, 4, 5 与 y = 52, 58, 67, 71, 82 做简单线性回归。',
      parts: [
        {
          label: '第 1 问',
          points: 10,
          kind: 'fill',
          prompt: '最小二乘斜率 b1 是多少？保留一位小数。',
          answer: '7.3',
          accept: ['7.3', '7.30'],
          explain: 'x̄=3，ȳ=66，Sxy=73，Sxx=10，b1=Sxy/Sxx=7.3，b0=66−7.3×3=44.1。斜率 7.3 表示学习时间每多一小时，成绩平均高约 7.3 分。'
        }
      ]
    },
    {
      no: 8,
      points: 8,
      type: '选择题',
      intro: '对一份多元回归模型做残差诊断，发现残差的绝对值随拟合值增大而明显扩大。',
      parts: [
        {
          label: '第 1 问',
          points: 8,
          kind: 'choice',
          prompt: '最合理的判断是：',
          options: [
            { text: '存在异方差，系数标准误与区间估计不可信', correct: true },
            { text: '说明模型的 R² 必然小于 0.5' },
            { text: '说明自变量之间存在完全共线性' },
            { text: '残差图的这种形状是正态性的直接证据' }
          ],
          explain: '残差随拟合值扩散是异方差的典型信号，它不改变系数的最小二乘估计，但会让标准误、t 值与置信区间失真。R² 与共线性都不是这张图能直接断定的，正态性要看残差的直方图或 Q-Q 图。'
        }
      ]
    },
    {
      no: 9,
      points: 8,
      type: '选择题',
      intro: '凸性决定了优化问题是否好解。',
      parts: [
        {
          label: '第 1 问',
          points: 8,
          kind: 'choice',
          prompt: '下列函数在其定义域上为凸函数的是：',
          options: [
            { text: 'f(x) = eˣ', correct: true },
            { text: 'f(x) = x³' },
            { text: 'f(x) = sin x' },
            { text: 'f(x) = 1/x（x ≠ 0）' }
          ],
          explain: 'eˣ 的二阶导仍是 eˣ>0，处处凸；x³ 的二阶导 6x 在负半轴为负；sin x 的二阶导 −sin x 变号；1/x 的二阶导 2/x³ 在负半轴为负。判断凸性看二阶导（或 Hessian）是否半正定，不能只看图像像不像碗。'
        }
      ]
    },
    {
      no: 10,
      points: 10,
      type: '程序输出题',
      intro: '对 f(x)=x² 做两步梯度下降，初始点 x=1、学习率 0.1。',
      parts: [
        {
          label: '第 1 问',
          points: 10,
          kind: 'output',
          prompt: '程序打印出的 x 是多少？',
          code: 'x = 1.0\nalpha = 0.1\nfor _ in range(2):\n    x = x - alpha * 2 * x\nprint(x)',
          answer: '0.64',
          accept: ['0.64', '0.640'],
          explain: '每步乘上因子 1−2α=0.8：第一步 0.8，第二步 0.64。对 f(x)=x² 这种二次函数，梯度下降不会一步到 0，只会按固定比例缩小误差。'
        }
      ]
    },
    {
      no: 11,
      points: 6,
      type: '填空题',
      intro: '在条件数 κ=100 的二次问题上，用最优步长的梯度下降，误差每步乘上因子 (κ−1)/(κ+1)。',
      parts: [
        {
          label: '第 1 问',
          points: 6,
          kind: 'fill',
          prompt: '求该收敛因子，保留三位小数。',
          answer: '0.980',
          accept: ['0.980', '0.98', '0.9802'],
          explain: '(100−1)/(100+1)=99/101≈0.9802。因子越接近 1，收敛越慢；要把误差降到原来的 0.1，大约需要 ln(0.1)/ln(0.9802)≈115 步，这也是病态问题难优化的原因。'
        }
      ]
    },
    {
      no: 12,
      points: 8,
      type: '选择题',
      intro: '某二分类器在测试集上的混淆矩阵为：TP=40、FP=10、FN=20、TN=30。',
      parts: [
        {
          label: '第 1 问',
          points: 8,
          kind: 'choice',
          prompt: '它的精确率（precision）是：',
          options: [
            { text: '0.80', correct: true },
            { text: '0.67' },
            { text: '0.73' },
            { text: '0.70' }
          ],
          explain: '精确率 = TP/(TP+FP)=40/50=0.80；召回率 = TP/(TP+FN)=40/60≈0.667；F1 = 2×0.8×0.667/(0.8+0.667)≈0.727；准确率 = (40+30)/100=0.70。四个指标问的是不同的事，别混用。'
        }
      ]
    }
  ]
});
