/* =====================================================================
 * projects.js · 实战项目（CSC.registerProjects）
 * 结构：{ id, title, en, tagline, level, minutes, chapters, goals, intro,
 *         milestones:[{ n, title, tasks, starter, hints, solution }] }
 * 目标：本站 3 个项目，由易到难，均能落回章节知识点。
 * ===================================================================== */
CSC.registerProjects([
  {
    id: 'p1',
    title: '项目一 · 用模拟检验概率直觉',
    en: 'SIMULATION LAB',
    tagline: '把生日悖论、蒙提霍尔与置信区间覆盖率跑成数字，看看直觉错在哪里',
    level: '入门',
    minutes: 120,
    chapters: ['ch01', 'ch02', 'ch03'],
    goals: [
      '能用随机模拟验证一个解析算出的概率',
      '理解重复实验次数与估计精度的关系',
      '亲手测一次 95% 置信区间的真实覆盖率'
    ],
    intro: '这一章的概率公式都能手算，但手算的结果常常和直觉打架。本项目要求你写三小段模拟：生日问题、蒙提霍尔问题、置信区间覆盖率。每段都先写下你的直觉猜测，再让代码给出答案，最后解释偏差从哪里来。',
    milestones: [
      {
        n: 1,
        title: '生日问题：23 个人里有人同一天生日的概率',
        tasks: [
          '先不看公式，写下你认为 23 人中有两人生日相同的概率大约是多少。',
          '写一个函数，每次随机抽 23 个 1 到 365 的整数，判断是否有重复。',
          '重复 10000 次，统计有重复的比例，与解析值 0.5073 比较。',
          '把人数从 5 增加到 60，画出概率随人数变化的曲线，标出概率首次超过 0.5 的人数。'
        ],
        starter: 'import numpy as np\n\ndef birthday_match(n, trials=10000, seed=0):\n    rng = np.random.default_rng(seed)\n    hit = 0\n    for _ in range(trials):\n        days = rng.integers(1, 366, size=n)\n        if len(set(days)) < n:\n            hit += 1\n    return hit / trials\n\nprint(birthday_match(23))',
        hints: [
          '判断重复可以用 len(set(days)) < n，比两两比较快得多。',
          '用 default_rng(seed) 固定随机种子，别人才能复现你的数字。',
          '解析值的算法是 1 减去「所有人不同」的连乘：1 − (365/365)(364/365)…(343/365)。'
        ],
        solution: '运行后 23 人的结果约 0.507，与解析值 0.5073 相差不超过 0.01。人数为 23 时概率刚过 0.5，人数 50 时约 0.9704。直觉低估的原因是：23 个人两两配对共有 253 对，任何一对相同都算命中，机会比想象的多得多。'
      },
      {
        n: 2,
        title: '蒙提霍尔：换门到底值不值',
        tasks: [
          '写模拟：三扇门后一车两羊，参赛者先随机选一扇，主持人打开一扇有羊的门，参赛者可以选择换或不换。',
          '分别统计「坚持原选择」与「换门」的获胜率，各跑 10000 次。',
          '用条件概率解释两个获胜率为什么是 1/3 与 2/3，并说明主持人的行为为什么关键。'
        ],
        starter: 'import numpy as np\n\ndef monty(trials=10000, switch=True, seed=1):\n    rng = np.random.default_rng(seed)\n    win = 0\n    for _ in range(trials):\n        car = rng.integers(0, 3)\n        pick = rng.integers(0, 3)\n        doors = [d for d in range(3) if d != pick and d != car]\n        opened = rng.choice(doors)\n        final = ([d for d in range(3) if d != pick and d != opened][0]\n                 if switch else pick)\n        win += final == car\n    return win / trials\n\nprint(monty(switch=True), monty(switch=False))',
        hints: [
          '主持人必须打开一扇你没有选、且后面是羊的门，这个约束是概率变化的来源。',
          '换门等价于「一开始就选错」，而一开始选错的概率是 2/3。',
          '如果主持人不知道车在哪、随机开门且恰好开到羊，结论会不同。'
        ],
        solution: '换门获胜率约 0.666，坚持约 0.333。原因是参赛者最初选中的概率只有 1/3，剩下 2/3 的概率车在另外两扇门后；主持人排除一扇空门后，这 2/3 全部集中到唯一可换的门上。'
      },
      {
        n: 3,
        title: '置信区间真的覆盖 95% 吗',
        tasks: [
          '从指数分布（均值 1）中反复抽 n=30 的样本，用 t 分布构造 95% 置信区间。',
          '重复 2000 次，统计区间覆盖真实均值 1 的比例，看是否接近 0.95。',
          '把 n 改成 5 再做一次，解释覆盖率为什么偏离 0.95。'
        ],
        starter: 'import numpy as np\nfrom scipy import stats\n\nrng = np.random.default_rng(2)\ncover = 0\ntrials = 2000\nfor _ in range(trials):\n    x = rng.exponential(1.0, size=30)\n    se = x.std(ddof=1) / np.sqrt(30)\n    lo = x.mean() - stats.t.ppf(0.975, 29) * se\n    hi = x.mean() + stats.t.ppf(0.975, 29) * se\n    cover += lo <= 1.0 <= hi\nprint(cover / trials)',
        hints: [
          '覆盖率检验的「真实均值」是 1.0，不是样本均值。',
          '指数分布右偏，n=30 时样本均值已接近正态，n=5 时 t 区间会偏窄。',
          'ddof=1 才是样本标准差，ddof=0 会系统性低估标准误。'
        ],
        solution: 'n=30 时覆盖率约 0.93 到 0.95，基本可信；n=5 时覆盖率明显低于 0.95，因为 t 区间假设样本均值近似正态，而小样本下的右偏分布还不接近正态。这说明置信区间的名义覆盖率和实际覆盖率是两回事，样本量小时要谨慎。'
      }
    ]
  },
  {
    id: 'p2',
    title: '项目二 · 从散点到一条回归线',
    en: 'REGRESSION WORKBENCH',
    tagline: '手算最小二乘、验证闭式解、读残差图，把回归做成一套可复查的流程',
    level: '进阶',
    minutes: 150,
    chapters: ['ch04'],
    goals: [
      '能手算简单线性回归的斜率、截距、SSE 与 R²',
      '会用 numpy 的闭式解与 scipy 的 linregress 交叉验证',
      '能从残差图判断异方差、非线性与外推风险'
    ],
    intro: '本项目用五个点的成绩数据做主线：x=1,2,3,4,5 小时，y=52,58,67,71,82 分。你要先手算，再用代码验证，最后故意造一份违反假设的数据，观察诊断图怎么报警。',
    milestones: [
      {
        n: 1,
        title: '手算最小二乘并核对闭式解',
        tasks: [
          '算出 x̄、ȳ、Sxy、Sxx，再求 b1 与 b0。',
          '写出五个预测值与残差，求 SSE、SST 与 R²。',
          '用 numpy 的 lstsq 或公式 (XᵀX)⁻¹Xᵀy 复算，确认结果一致。',
          '解释斜率 7.3 与截距 44.1 在这个语境里各代表什么，截距有没有现实意义。'
        ],
        starter: 'import numpy as np\n\nx = np.array([1, 2, 3, 4, 5], dtype=float)\ny = np.array([52, 58, 67, 71, 82], dtype=float)\nX = np.column_stack([np.ones_like(x), x])\nbeta, *_ = np.linalg.lstsq(X, y, rcond=None)\nprint(beta)\nresid = y - X @ beta\nprint(resid, (resid ** 2).sum(), 1 - (resid ** 2).sum() / ((y - y.mean()) ** 2).sum())',
        hints: [
          'Sxy = Σ(xᵢ−x̄)(yᵢ−ȳ)，Sxx = Σ(xᵢ−x̄)²，b1 = Sxy/Sxx。',
          'R² 在简单回归里等于相关系数的平方，可以用两种算法互相校验。',
          '截距是 x=0 时的预测值；本题 x=0 表示「一小时都不学」，可以解释，但不能外推到 x=10。'
        ],
        solution: 'x̄=3、ȳ=66、Sxy=73、Sxx=10，所以 b1=7.3、b0=44.1。预测值 51.4、58.7、66.0、73.3、80.6，残差 0.6、−0.7、1.0、−2.3、1.4，SSE=9.1，SST=542，R²=0.983。手算结果与 numpy 的 lstsq 输出一致。截距 44.1 表示不学习也预期 44 分，只在本数据的范围内可信。'
      },
      {
        n: 2,
        title: '残差诊断：让模型自己暴露问题',
        tasks: [
          '画出残差对拟合值的散点图，判断是否有喇叭形或弯曲趋势。',
          '构造一份异方差数据（噪声随 x 增大），重画残差图并对比。',
          '构造一份二次关系的数据，用直线拟合，观察残差图里的 U 形。',
          '写下三条结论：这份数据能信到什么程度、哪里不能外推、下一步该补什么。'
        ],
        starter: 'import numpy as np\nimport matplotlib.pyplot as plt\n\nrng = np.random.default_rng(3)\nx = np.linspace(0, 10, 60)\ny = 2 * x + 1 + rng.normal(0, 0.3 + 0.4 * x)\nb1, b0 = np.polyfit(x, y, 1)\nresid = y - (b0 + b1 * x)\nplt.scatter(b0 + b1 * x, resid)\nplt.axhline(0, color="gray", lw=1)\nplt.xlabel("fitted")\nplt.ylabel("residual")\nplt.show()',
        hints: [
          '残差图的横轴用拟合值，不要用 x，这样多自变量时也适用。',
          '喇叭形说明方差不是常数；U 形说明模型漏了二次项。',
          '异方差下最小二乘系数仍然无偏，但标准误和区间估计会失真。'
        ],
        solution: '第一份数据残差应随机分布在 0 附近，没有明显形状；异方差数据的残差绝对值随拟合值增大而扩大，是典型喇叭形；二次数据的残差呈 U 形，提示应加 x² 项。结论：系数可以相信，但标准误与置信区间在异方差下不可信，正负号与量级才是稳健的结论。'
      }
    ]
  },
  {
    id: 'p3',
    title: '项目三 · 从梯度下降到分类器',
    en: 'OPTIMIZATION TO CLASSIFIER',
    tagline: '自己实现优化算法，再把它接到逻辑回归与 KNN 上，用交叉验证做选择',
    level: '挑战',
    minutes: 210,
    chapters: ['ch05', 'ch06', 'ch07'],
    goals: [
      '能从零写出梯度下降并解释学习率与条件数的影响',
      '能训练逻辑回归并读懂混淆矩阵与阈值',
      '能用交叉验证在 KNN 的 k 与逻辑回归的正则强度之间做选择'
    ],
    intro: '最后这个项目把优化与机器学习接起来：先在一维二次函数上把梯度下降调稳，再把它用到逻辑回归的对数损失上，最后用交叉验证比较 KNN 与逻辑回归。每一步都要留下可复现的数字，而不是一句「效果不错」。',
    milestones: [
      {
        n: 1,
        title: '梯度下降：学习率、条件数与收敛',
        tasks: [
          '对 f(x)=x² 手写梯度下降，α 取 0.1、0.5、1.0、1.1，各跑 10 步并记录 x。',
          '对 f(x)=½(100x₁²+x₂²) 做梯度下降，观察两个方向的收敛速度差异。',
          '计算并解释条件数 κ=100 时误差衰减因子 (κ−1)/(κ+1)≈0.98。',
          '总结：什么情况下该换牛顿法或动量法，判断依据是什么。'
        ],
        starter: 'import numpy as np\n\ndef gd(grad, x0, alpha, steps=10):\n    x = np.array(x0, dtype=float)\n    hist = [x.copy()]\n    for _ in range(steps):\n        x = x - alpha * grad(x)\n        hist.append(x.copy())\n    return np.array(hist)\n\nh = gd(lambda x: 2 * x, [1.0], 0.1)\nprint(h.ravel())',
        hints: [
          'f(x)=x² 的梯度是 2x，每步乘上因子 1−2α。',
          'α=0.5 时因子为 0，一步到 0；α>0.5 开始震荡，α>1 发散。',
          '条件数大意味着等高线被拉长，梯度方向几乎垂直于最优方向，所以之字形前进。'
        ],
        solution: 'α=0.1 时 x 依次为 0.8、0.64、0.512…；α=0.5 一步到 0；α=1.0 在 1 与 −1 之间震荡；α=1.1 绝对值越来越大。对 ½(100x₁²+x₂²)，x₁ 方向因子约 0.98，x₂ 方向 0.98 之外还受尺度影响，收敛慢的方向决定了整体速度。结论：学习率有稳定上界 2/λmax，条件数大时用动量、预条件或牛顿法。'
      },
      {
        n: 2,
        title: '逻辑回归：从对数损失到混淆矩阵',
        tasks: [
          '用 sigmoid 与对数损失实现逻辑回归的梯度，在二维人造数据上训练。',
          '记录训练损失随迭代次数的变化，确认它在单调下降。',
          '在测试集上算混淆矩阵、精确率、召回率与 F1。',
          '把阈值从 0.5 调到 0.3 与 0.7，观察精确率与召回率如何互换。'
        ],
        starter: 'import numpy as np\n\ndef sigmoid(z):\n    return 1 / (1 + np.exp(-z))\n\ndef train(X, y, lr=0.1, epochs=500):\n    w = np.zeros(X.shape[1])\n    b = 0.0\n    for _ in range(epochs):\n        p = sigmoid(X @ w + b)\n        w -= lr * X.T @ (p - y) / len(y)\n        b -= lr * (p - y).mean()\n    return w, b',
        hints: [
          '对数损失的梯度形式与线性回归很像：Xᵀ(p−y)/n，差别在于 p 是 sigmoid 输出。',
          '阈值降低会提高召回率、降低精确率，两者此消彼长。',
          '类别不平衡时准确率会骗人，要看精确率、召回率与 F1。'
        ],
        solution: '训练损失应从约 0.69 开始单调下降。阈值 0.5 时报告一组混淆矩阵与三个指标；阈值 0.3 时召回率上升、精确率下降；0.7 时相反。结论：阈值是业务选择，不是模型参数，先定「漏判和误判哪个更贵」再选阈值。'
      },
      {
        n: 3,
        title: '交叉验证：在 k 与正则强度之间选',
        tasks: [
          '用 5 折交叉验证评估 KNN 在 k=1,3,5,9,15 上的准确率。',
          '用同样的折对逻辑回归的 L2 正则强度做网格搜索。',
          '画出准确率随 k 与正则强度的变化曲线，说明为什么 k 太小会过拟合。',
          '把最终模型在留出的测试集上评估一次，报告数字与选择依据。'
        ],
        starter: 'from sklearn.model_selection import cross_val_score, KFold\nfrom sklearn.neighbors import KNeighborsClassifier\nimport numpy as np\n\n# X, y 由上一阶段构造\n# scores = [cross_val_score(KNeighborsClassifier(n_neighbors=k), X, y,\n#                           cv=KFold(5, shuffle=True, random_state=0)).mean()\n#           for k in [1, 3, 5, 9, 15]]',
        hints: [
          '交叉验证的每一折都要重新拟合预处理，否则会数据泄漏。',
          'k=1 的 KNN 在训练集上几乎完美，但方差很大，换一批数据就掉。',
          '测试集只能用一次，选模型的过程全部在训练集内部完成。'
        ],
        solution: 'KNN 的准确率通常先随 k 增大而上升，到某个 k 后走平或下降；k=1 在训练集上接近 1 但交叉验证分数波动大，是过拟合的典型。逻辑回归的正则强度过小会过拟合、过大则欠拟合，中间存在一个平台。最终报告应写清：用 5 折交叉验证选出的超参数、测试集准确率、以及为什么这个选择在偏差与方差之间更稳。'
      }
    ]
  }
]);
