/* =====================================================================
 * quiz.js · DDA2001 分章题库
 * 结构：{ items:[{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options?, answer?, accept?, code?, explain }] }
 * 题型：mcq / tf / fill / multi / predict
 * 覆盖：ch00–ch07，每章 7 题，共 56 题
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '本站八章的组织顺序，下面哪条最准确？',
        options: [
          { text: '概率 → 分布 → 推断 → 回归 → 凸性 → 优化 → 机器学习', correct: true },
          { text: '回归 → 概率 → 分布 → 优化 → 推断 → 凸性 → 机器学习' },
          { text: '凸性 → 优化 → 概率 → 分布 → 回归 → 推断 → 机器学习' },
          { text: '机器学习 → 回归 → 概率 → 推断 → 分布 → 凸性 → 优化' }
        ],
        explain: '前两章建立概率语言（样本空间、随机变量、分布），第三、四章做统计推断与回归，第五、六章讲凸性与优化算法，第七章用这些工具搭起 KNN、逻辑回归与模型选择。顺序是「描述不确定性 → 从数据推断 → 拟合关系 → 保证可解 → 学习方法」。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '数据科学的核心是选一个足够复杂的模型，数据质量与问题定义只占次要位置。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '恰好相反。问题定义错了，再复杂的模型也在回答一个没人问的问题；数据有偏或泄漏，模型在测试集上再漂亮也不能用。本站把「四层问题链」放在第一章，就是要先确认问题、数据、方法与结论四层都站得住。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '本课的三条主线中，哪一条负责回答「结果有多可靠」？',
        options: [
          { text: '概率与统计推断', correct: true },
          { text: '优化' },
          { text: '机器学习' },
          { text: '数据可视化' }
        ],
        explain: '概率与统计推断给出不确定性度量：标准误、置信区间、假设检验。优化负责「怎么解」，机器学习负责「怎么从数据学规则」。可视化是表达工具，不构成主线。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'multi', difficulty: 2,
        tags: ['tool'],
        stem: '本课推荐的 Python 分析工具链包含下面哪些？（多选）',
        options: [
          { text: 'pandas 做表格数据的读取与整理', correct: true },
          { text: 'numpy 做数组与线性代数运算', correct: true },
          { text: 'matplotlib 做静态图表', correct: true },
          { text: 'Excel 宏做全部统计推断' },
          { text: 'Photoshop 做残差诊断' }
        ],
        explain: 'pandas 管数据、numpy 管数值、matplotlib 管出图，三者是分析工作流的骨架；scipy 与 statsmodels 补上分布与回归推断。Excel 宏和图像软件不属于本课工具链。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '五个点 x=1,2,3,4,5、y=52,58,67,71,82 拟合直线，斜率是 ______。',
        answer: '7.3',
        accept: ['7.3', '7.30', '73/10'],
        explain: 'x̄=3、ȳ=66，Sxy=73、Sxx=10，所以斜率 b1=73/10=7.3。截距 b0=66-7.3×3=44.1。这组数在 ch00 与 ch04 反复使用，是核对公式的最快例子。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: `import numpy as np

x = np.array([1, 2, 3, 4, 5], dtype=float)
y = np.array([52, 58, 67, 71, 82], dtype=float)
print(x.mean(), y.mean())
print(((x - x.mean()) * (y - y.mean())).sum())`,
        stem: '这段代码输出什么？',
        answer: '3.0 66.0\n73.0',
        accept: ['3.0 66.0 73.0'],
        explain: 'x 的均值是 3.0，y 的均值是 66.0；中心化乘积之和就是 Sxy=73.0，它是斜率的分子。残差平方和与 R² 都由此推出。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-8', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '按本站建议，学完一章后最有效的下一步是什么？',
        options: [
          { text: '立刻跳到下一章的视频' },
          { text: '合上正文做自检清单，再挑一个项目里程碑动手实现', correct: true },
          { text: '把本章代码逐字抄一遍' },
          { text: '只背术语表里的英文缩写' }
        ],
        explain: '自检清单暴露「以为懂了其实说不清」的地方，项目里程碑把这些点变成能跑通的代码。抄代码不产生理解，跳过自检会把漏洞带到后面章节。'
      },

      /* ---------------- ch01 概率论基础 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '对任意两个事件 A、B，下面哪个式子恒成立？',
        options: [
          { text: 'P(A∪B) = P(A) + P(B)' },
          { text: 'P(A∪B) = P(A) + P(B) - P(A∩B)', correct: true },
          { text: 'P(A∩B) = P(A)P(B)' },
          { text: 'P(A|B) = P(B|A)' }
        ],
        explain: '加法公式要减去重复计算的一次交集，这是容斥原理的两事件形式。只有 A、B 互斥时才有 P(A∪B)=P(A)+P(B)；只有独立时才有 P(A∩B)=P(A)P(B)；P(A|B)=P(B|A) 一般不成立。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '两个事件互斥（不能同时发生），就一定是独立的。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '恰恰相反。若 A、B 互斥且概率都大于 0，则 P(A∩B)=0，而 P(A)P(B)>0，两者不等，所以互斥反而不独立。独立要求「知道 B 发生不改变 A 的概率」，互斥时知道 B 发生就排除了 A，信息量极大。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '某病患病率 1%，检验灵敏度 99%、特异度 99%。某人检验阳性，他真正患病的概率大约是？',
        options: [
          { text: '99%' },
          { text: '50%', correct: true },
          { text: '约 9%' },
          { text: '约 16.7%' }
        ],
        explain: '1000 人里约 10 人患病，其中约 9.9 人检出阳性；990 名健康者中约 1% 假阳性，也有约 9.9 人。阳性者中真患病约一半，所以后验约 50%。若特异度降到 95%，假阳性增至 49.5 人，后验就掉到约 16.7%——基础率与特异度共同决定了这个反直觉的结果。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些集合恒等式是正确的？（多选）',
        options: [
          { text: '<code>(A∪B)ᶜ = Aᶜ∩Bᶜ</code>', correct: true },
          { text: '<code>A∩(B∪C) = (A∩B)∪(A∩C)</code>', correct: true },
          { text: '<code>A - A = ∅</code>', correct: true },
          { text: '<code>A∪Aᶜ = A</code>' },
          { text: '<code>A∩∅ = A</code>' }
        ],
        explain: '前三条是德摩根律、分配律与差集的基本性质。A∪Aᶜ 应是全集，A∩∅ 应是空集，所以后两条错。事件运算与集合运算一一对应，做题时可以先画韦恩图。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '房间里 23 个人，至少两人生日相同的概率约为 ______（保留三位小数）。',
        answer: '0.507',
        accept: ['0.507', '0.5073', '50.7%'],
        explain: '用补事件：365×364×…×343/365²³≈0.4927，所以至少两人同生日约 1-0.4927=0.5073。人数到 50 时升到约 0.9704。概率增长比直觉快得多，因为比较的是「对」而不是「人」。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-8', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: `from itertools import product

S = list(product([1, 2, 3], repeat=2))
same = sum(1 for a, b in S if a == b)
print(len(S), same)`,
        stem: '这段代码输出什么？',
        answer: '9 3',
        accept: ['9 3'],
        explain: '两颗三面骰子的样本空间有 3×3=9 个等可能结果，其中 (1,1)、(2,2)、(3,3) 共 3 个相同，所以古典概率是 3/9=1/3。穷举样本空间是检验组合计数的最可靠方式。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '什么时候该用全概率公式？',
        options: [
          { text: '已知各原因的概率与各原因下结果的条件概率，要求结果的总概率', correct: true },
          { text: '已知结果，要求各原因的后验概率' },
          { text: '两个事件独立时求交集的概率' },
          { text: '样本空间有限且每个结果等可能时' }
        ],
        explain: '全概率公式 <code>P(B)=ΣP(Aᵢ)P(B|Aᵢ)</code> 是「由因推果」，把复杂事件按互斥完备的原因分组再求和。已知结果反推原因，用的是贝叶斯公式；等可能有限样本空间用古典概型。'
      },

      /* ---------------- ch02 随机变量与分布 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '关于期望的线性性质，下面哪条正确？',
        options: [
          { text: 'E[aX+b] = aE[X]+b，对任意随机变量成立', correct: true },
          { text: 'E[XY] = E[X]E[Y] 恒成立' },
          { text: 'E[X²] = (E[X])² 恒成立' },
          { text: 'E[X+Y] = E[X]+E[Y] 只在 X、Y 独立时成立' }
        ],
        explain: '期望的线性不需要独立性，<code>E[aX+bY]=aE[X]+bE[Y]</code> 恒成立。但 <code>E[XY]=E[X]E[Y]</code> 只在独立（或至少不相关）时成立，<code>E[X²]</code> 一般大于 <code>(E[X])²</code>，差额就是方差。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '两个随机变量的相关系数为 0，就说明它们相互独立。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '相关系数为 0 只说明没有线性关系，可能存在很强的非线性关系。例如 X 在 -1、0、1 上等可能，Y=X²，则 Cov(X,Y)=0 但 Y 完全由 X 决定。独立一定不相关，不相关不一定独立。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '成绩服从 N(70, 10²)，85 分以上的比例约为多少？',
        options: [
          { text: '约 6.68%', correct: true },
          { text: '约 15.87%' },
          { text: '约 30%' },
          { text: '约 1.5%' }
        ],
        explain: '标准化 z=(85-70)/10=1.5，查表 P(Z>1.5)=1-0.9332=0.0668。若问 80 分以上，z=1，比例是 15.87%——差 5 分，比例差一倍多，这就是正态尾部的陡峭之处。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '一个随机变量服从二项分布 B(n,p)，需要满足哪些条件？（多选）',
        options: [
          { text: '试验次数 n 固定', correct: true },
          { text: '每次试验只有成功与失败两种结果', correct: true },
          { text: '每次成功的概率 p 相同', correct: true },
          { text: '各次试验相互独立', correct: true },
          { text: 'n 必须大于 30 才能使用' }
        ],
        explain: '二项分布的四要素是：次数固定、结果二分、概率恒定、试验独立。n 的大小只影响能否用正态近似，不是定义要求；n 很大且 p 很小时常用泊松近似。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '掷一颗均匀六面骰子，点数的方差是 ______（保留三位小数）。',
        answer: '2.917',
        accept: ['2.917', '35/12', '2.9167'],
        explain: 'E[X]=3.5，E[X²]=(1+4+9+16+25+36)/6=91/6≈15.1667，方差 =91/6-12.25=35/12≈2.9167，标准差约 1.708。计算方差用 <code>E[X²]-(E[X])²</code> 通常比逐项算偏差平方更快。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'predict', difficulty: 3,
        tags: ['code'],
        code: `from math import comb

p = comb(10, 3) * 0.25 ** 3 * 0.75 ** 7
print(round(p, 4))`,
        stem: '这段代码输出什么？',
        answer: '0.2503',
        accept: ['0.2503'],
        explain: '这是 B(10,0.25) 在 k=3 处的概率：从 10 题里选 3 题乘上对应概率。C(10,3)=120，120×0.015625×0.1335≈0.2503。二项分布的均值 np=2.5、方差 np(1-p)=1.875。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '关于连续随机变量的密度函数 f(x)，下面哪条正确？',
        options: [
          { text: 'f(x) 就是 P(X=x)，可以大于 1' },
          { text: 'f(x) 可以大于 1，但它在区间上的积分才是概率', correct: true },
          { text: 'f(x) 必须小于 1，否则不是合法密度' },
          { text: 'P(X=x) 等于 f(x) 在该点的导数' }
        ],
        explain: '连续变量单点概率为 0，密度不是概率。密度只需非负且全积分等于 1，局部可以大于 1（区间很窄时）。概率由积分 <code>P(a&lt;X≤b)=∫f</code> 给出，这也是为什么连续分布讨论区间而不讨论单点。'
      },

      /* ---------------- ch03 统计推断 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-6', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '「95% 置信区间为 [65.87, 74.13]」的正确解释是？',
        options: [
          { text: '总体均值有 95% 的概率落在 65.87 到 74.13 之间' },
          { text: '若重复抽样很多次，约 95% 的区间会覆盖总体均值', correct: true },
          { text: '样本均值有 95% 的概率落在该区间内' },
          { text: '下一次抽样算出的样本均值有 95% 的概率等于 70' }
        ],
        explain: '置信水平描述的是「构造区间这一过程」的长期覆盖率，不是某个具体区间包含参数的概率。参数是固定的，区间算出后要么覆盖要么不覆盖，概率语言只对重复抽样成立。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '总体均值 μ 是随机变量，因为它未知。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'μ 是固定的常数，只是我们不知道它；随样本变化的是统计量 x̄。正因为 x̄ 随机，才有抽样分布与标准误。把「未知」误当成「随机」是本章最常见的概念错误。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'n=25、总体标准差未知时，构造均值区间应该用哪个临界值？',
        options: [
          { text: 'z=1.96' },
          { text: 't(24) 的 0.975 分位数，约 2.064', correct: true },
          { text: 't(25) 的 0.975 分位数' },
          { text: 'z=2.576' }
        ],
        explain: 'σ 未知要用 t 分布，自由度是 n-1=24，临界值 2.0639。用 z=1.96 会得到偏窄的区间，低估不确定性。自由度写 25 是常见错误，t 分布的自由度来自样本方差的 n-1。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '关于估计量的性质，下面哪些说法正确？（多选）',
        options: [
          { text: '无偏指估计量的期望等于被估参数', correct: true },
          { text: '有效指在无偏估计中方差更小', correct: true },
          { text: '一致指样本量趋于无穷时估计量依概率收敛到参数', correct: true },
          { text: '无偏估计一定比有偏估计更接近真值' },
          { text: '样本方差除以 n 才是无偏估计' }
        ],
        explain: '无偏、有效、一致是三个独立维度。无偏不等于每次更接近真值，它只保证长期平均无系统偏差；样本方差要除以 n-1 才无偏，除以 n 会系统性低估。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '样本量 n=25、样本标准差 s=10 时，均值的标准误是 ______。',
        answer: '2',
        accept: ['2', '2.0'],
        explain: '标准误 =s/√n=10/5=2。注意 s 描述个体波动（10），标准误描述均值的不确定性（2），两者差一个 √n。样本量翻四倍，标准误才减半。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'predict', difficulty: 3,
        tags: ['code'],
        code: `import numpy as np

n = np.ceil((1.96 / 0.03) ** 2 * 0.25)
print(int(n))`,
        stem: '这段代码输出什么？',
        answer: '1068',
        accept: ['1068'],
        explain: '这是 95% 置信、误差不超过 3% 时的最保守样本量：p 取 0.5 使 p(1-p) 最大。<code>(1.96/0.03)²×0.25≈1067.1</code>，向上取整得 1068。民调常说「约 1000 人、误差 ±3%」就来自这个公式。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-8', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'Bootstrap 估计置信区间时，重抽样的方式是？',
        options: [
          { text: '从总体中有放回抽 n 个' },
          { text: '从原样本中有放回抽 n 个，重复很多次', correct: true },
          { text: '从原样本中无放回抽 n 个' },
          { text: '把原样本复制一份再合并' }
        ],
        explain: 'bootstrap 把样本当作总体的近似，从中有放回抽 n 个（同规模、允许重复），重复几千次得到统计量的经验分布，再取分位数。有放回是关键，否则每次抽到的都是同一批数据，没有波动。'
      },

      /* ---------------- ch04 线性回归 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: 'R²=0.983 的含义是？',
        options: [
          { text: '模型解释了因变量约 98.3% 的变异', correct: true },
          { text: '预测值有 98.3% 的概率正确' },
          { text: '斜率等于 0.983' },
          { text: '残差的标准差是 0.983' }
        ],
        explain: '<code>R²=1-SSE/SST</code>，衡量被解释的变异占比。它不是准确率，也不说明因果。简单线性回归里 R² 等于相关系数的平方，所以 r≈0.9916。R² 高不代表模型假设成立，仍要看残差图。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '带截距的最小二乘回归直线一定经过样本均值点 (x̄, ȳ)。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '由 <code>β̂₀=ȳ-β̂₁x̄</code> 可知，x 取 x̄ 时拟合值正好是 ȳ。这是检查手算的快捷方式：若你算出的直线不过均值点，一定哪里错了。无截距模型没有这个性质。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '斜率 95% 置信区间为 [5.55, 9.05]，最合理的结论是？',
        options: [
          { text: '斜率一定是 7.3' },
          { text: 'x 每增加 1，y 的平均增量在 5.55 到 9.05 之间（95% 置信）', correct: true },
          { text: 'y 有 95% 的概率落在这个区间' },
          { text: '模型解释了 95% 的变异' }
        ],
        explain: '系数区间描述的是斜率这一参数的不确定性，单位是「y 的变化量每单位 x」。它不覆盖个体预测值，也和 R² 无关。区间不包含 0，说明在 5% 水平下斜率显著异于 0。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '残差图出现下面哪些形状时，说明模型假设可能有问题？（多选）',
        options: [
          { text: '残差呈 U 形弯曲', correct: true },
          { text: '残差随 x 增大呈漏斗状扩散', correct: true },
          { text: '个别点远离其余残差', correct: true },
          { text: '残差随机散布在 0 附近，无明显形状' },
          { text: '残差与 x 的相关系数为 0' }
        ],
        explain: 'U 形说明漏了非线性项，漏斗说明异方差，孤立远点说明离群或高杠杆。随机散布与相关系数为 0 恰恰是理想状态（后者是正规方程的必然结果，不是额外的优点）。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '最小二乘法选择参数的标准，是使 ______ 最小。',
        answer: '残差平方和',
        accept: ['残差平方和', 'SSE', '误差平方和'],
        explain: '最小化 <code>Σ(yᵢ-ŷᵢ)²</code>。平方让正负残差不抵消、处处可微，从而有闭式解；代价是放大了离群点的影响，稳健场景可改用绝对损失或 Huber 损失。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: `import numpy as np

x = np.array([1, 2, 3, 4, 5], dtype=float)
y = np.array([52, 58, 67, 71, 82], dtype=float)
b1 = ((x - x.mean()) * (y - y.mean())).sum() / ((x - x.mean()) ** 2).sum()
print(round(b1, 1))`,
        stem: '这段代码输出什么？',
        answer: '7.3',
        accept: ['7.3'],
        explain: '分子 Sxy=73、分母 Sxx=10，斜率 7.3。再由 <code>b0=ȳ-b1x̄=66-21.9=44.1</code>。这两个数与 ch00 的例子一致，用来检验公式实现是否正确。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '多元回归中某个特征的 VIF 远大于 10，说明什么？',
        options: [
          { text: '该特征与因变量高度相关' },
          { text: '该特征与其他自变量高度共线，系数估计不稳定', correct: true },
          { text: '模型的 R² 一定很低' },
          { text: '该特征的系数一定为正' }
        ],
        explain: 'VIF 衡量一个自变量被其余自变量线性解释的程度，超过 10 通常视为严重共线。后果是系数标准误膨胀、符号可能反常，但预测值未必变差。处理办法是删冗余变量、合并特征或改用岭回归。'
      },

      /* ---------------- ch05 凸集与凸函数 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪个集合是凸集？',
        options: [
          { text: '单位圆盘 <code>{x: ‖x‖₂ ≤ 1}</code>', correct: true },
          { text: '圆环 <code>{x: 1 ≤ ‖x‖₂ ≤ 2}</code>' },
          { text: '所有整数点组成的集合' },
          { text: '两个不相交圆盘的并集' }
        ],
        explain: '凸集要求任意两点连线仍在集合内。圆盘满足；圆环里取内圈两点，连线穿过空心区域，不满足；整数点之间连线含非整数点；两个不相交圆盘的并集在各自取一点时连线跑出集合。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '若 f 是凸函数，则 <code>f(E[X]) ≤ E[f(X)]</code>。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '这就是 Jensen 不等式。直观上，凸函数图像在弦的下方，随机变量的期望落在「平均输入」处，函数值不超过「输出的平均」。等号只在 X 退化或 f 为线性时成立。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '二阶可微函数 f 在凸集上是凸函数，等价于？',
        options: [
          { text: 'Hessian 处处半正定', correct: true },
          { text: 'Hessian 处处半负定' },
          { text: '梯度处处为零' },
          { text: 'Hessian 处处可逆' }
        ],
        explain: '凸性要求二阶方向导数非负，即 <code>∇²f(x) ⪰ 0</code>（半正定）。一维时就是 f″≥0。半负定对应凹函数；梯度为零只是驻点条件，不保证凸性。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些运算能保持凸性？（多选）',
        options: [
          { text: '两个凸集的交', correct: true },
          { text: '凸集在仿射映射下的像', correct: true },
          { text: '两个凸集的 Minkowski 和', correct: true },
          { text: '两个凸集的并' },
          { text: '凸集在任意非线性映射下的像' }
        ],
        explain: '交、仿射像、Minkowski 和都保凸；并集一般不凸（两个圆盘的并就是反例），非线性映射会破坏凸性（如把圆盘映成月牙）。保凸运算表是判断「这个问题能不能用凸优化解」的实用工具。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '函数 <code>f(x)=x⁴-3x²</code> 在 x=0 处的二阶导数是 ______。',
        answer: '-6',
        accept: ['-6', '−6'],
        explain: 'f′(x)=4x³-6x，f″(x)=12x²-6，代入 x=0 得 -6。二阶导为负说明该点局部是凹的，x=0 是局部极大点；两条全局极小在 x=±1.2247，最小值 -2.25。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: `import numpy as np

H = np.array([[2.0, 0.0], [0.0, 4.0]])
print(np.linalg.eigvalsh(H))`,
        stem: '这段代码输出什么？',
        answer: '[2. 4.]',
        accept: ['[2. 4.]', '[2., 4.]', '2 4'],
        explain: '对角矩阵的特征值就是对角线元素，eigvalsh 返回升序结果 [2, 4]。两个特征值都为正，Hessian 正定，二次型 <code>x²+2y²</code> 严格凸，唯一极小点在原点。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-8', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '函数在鞍点处的性质是？',
        options: [
          { text: '梯度为零，但沿某些方向上升、沿另一些方向下降', correct: true },
          { text: '梯度为零，且是所有方向的最小值' },
          { text: '梯度不为零，但函数值不再变化' },
          { text: 'Hessian 正定' }
        ],
        explain: '鞍点是驻点（梯度为零），Hessian 同时有正、负特征值，所以沿负特征值方向是下降的。梯度下降容易卡在鞍点附近，这也是动量与小批量噪声在深层网络中有用的原因之一。'
      },

      /* ---------------- ch06 优化方法 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '梯度下降的更新式是？',
        options: [
          { text: '<code>x ← x - α∇f(x)</code>', correct: true },
          { text: '<code>x ← x + α∇f(x)</code>' },
          { text: '<code>x ← x - αf(x)</code>' },
          { text: '<code>x ← αx - ∇f(x)</code>' }
        ],
        explain: '负梯度是局部下降最快的方向，α 是学习率。写成加号会沿上升方向走；用函数值代替梯度量纲不对。一阶泰勒展开可证：α 足够小时函数值必然下降。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '条件数 κ 越大，梯度下降收敛得越快。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '收敛速率约 <code>(κ-1)/(κ+1)</code>，κ 越大越接近 1，收敛越慢。κ=100 时速率 0.98，跑 100 步误差还剩 0.13；κ=10 时同样的步数早已收敛到 1e-9。等高线越扁，之字形越严重。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '在 f(x)=x² 上做梯度下降，学习率取 1.0，从 x=1 出发会发生什么？',
        options: [
          { text: '一步到达 0 并停住' },
          { text: '在 1 与 -1 之间永远震荡', correct: true },
          { text: '指数收敛到 0' },
          { text: '直接发散到无穷' }
        ],
        explain: '更新式化为 <code>x ← x - 2x = -x</code>，所以序列是 1、-1、1、-1……函数值不降也不增。α=0.5 时因子为 0，一步到 0；α=1.1 时因子 -1.2，绝对值递增，才是发散。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '关于动量与 Adam，下面哪些说法正确？（多选）',
        options: [
          { text: '动量累积历史梯度，抑制震荡方向', correct: true },
          { text: 'Adam 用梯度平方的滑动平均做逐参数缩放', correct: true },
          { text: 'Adam 的默认学习率通常取 0.001', correct: true },
          { text: 'Adam 保证收敛到全局最优' },
          { text: '动量等价于把学习率调大十倍' }
        ],
        explain: '动量把一致方向加速、震荡方向抵消；Adam 在动量之外加二阶矩，让每个参数有自适应步长，默认 α=0.001。两者都不保证全局最优，非凸问题上只能收敛到稳定点附近。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-1', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '二次函数 f(x)=½ax² 上梯度下降收敛的条件是 0 < α < ______。',
        answer: '2/a',
        accept: ['2/a', '2/a_max', '2/λmax'],
        explain: '更新因子是 1-αa，收敛要求绝对值小于 1，解得 α<2/a。多维时 a 换成 Hessian 最大特征值 λmax，上界为 2/λmax。曲率越大，允许的步长越小。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'predict', difficulty: 3,
        tags: ['code'],
        code: `x = 2.0
f1 = 4 * x ** 3 - 6 * x
f2 = 12 * x ** 2 - 6
print(round(x - f1 / f2, 3))`,
        stem: '这段代码输出什么？',
        answer: '1.524',
        accept: ['1.524'],
        explain: '这是 f(x)=x⁴-3x² 上从 x=2 出发的牛顿法一步：f′(2)=20、f″(2)=42，x₁=2-20/42≈1.524。真值 1.2247，再走一步到约 1.295，二次收敛的速度由此可见。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'KKT 条件中的互补松弛 <code>λᵢgᵢ(x)=0</code> 意味着？',
        options: [
          { text: '约束要么不起作用（λ=0），要么正好取等号（g=0）', correct: true },
          { text: '所有约束都必须取等号' },
          { text: '乘子必须为负' },
          { text: '目标函数必须为零' }
        ],
        explain: '互补松弛排除了「约束未违反但乘子非零」的情况：不起作用的约束乘子为零，起作用的约束取等号。配合平稳性与可行性，凸问题下 KKT 即为全局最优的充要条件。'
      },

      /* ---------------- ch07 机器学习入门 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: 'TP=40、FP=10、FN=20、TN=30 时，F1 约为多少？',
        options: [
          { text: '0.727', correct: true },
          { text: '0.700' },
          { text: '0.800' },
          { text: '0.667' }
        ],
        explain: '精确率 40/50=0.80，召回率 40/60≈0.667，F1=2×0.8×0.667/(0.8+0.667)≈0.727。准确率是 70/100=0.70，两个数接近但含义不同：F1 只看正类，准确率看全体。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-6', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: 'AUC 衡量的是排序质量，与分类阈值无关。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'AUC 把阈值从 1 扫到 0 后对整条 ROC 曲线积分，等于「随机正例得分高于随机负例」的概率，因此不依赖某个阈值。但落地时仍要按业务代价选一个具体阈值，选完在测试集上只报一次。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '用 KNN 之前通常要先标准化特征，主要原因是？',
        options: [
          { text: '让各维尺度可比，避免距离被大尺度特征支配', correct: true },
          { text: '让标签变成 0 和 1' },
          { text: '减少样本数量，加快预测' },
          { text: '保证 k 一定是奇数' }
        ],
        explain: '欧氏距离对量纲敏感：收入以万元计、年龄以十位计，距离几乎由收入决定。标准化把各维拉到相近尺度，距离才有意义。这与 K-means 的要求相同。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '面对高方差（过拟合），下面哪些做法是对症的？（多选）',
        options: [
          { text: '增加训练数据', correct: true },
          { text: '加强正则化', correct: true },
          { text: '早停或降低模型容量', correct: true },
          { text: '再加更多特征' },
          { text: '减小正则强度' }
        ],
        explain: '过拟合是模型对训练集扰动太敏感，解决办法是加数据、加约束（正则、早停、降容量）。加特征与减小正则都会进一步增大方差，属于反方向操作；那是高偏差时才该做的事。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'fill', difficulty: 1,
        tags: ['calc'],
        stem: '逻辑回归中 sigmoid(0) 的值是 ______。',
        answer: '0.5',
        accept: ['0.5', '1/2', '50%'],
        explain: '<code>σ(0)=1/(1+e⁰)=1/2</code>。sigmoid 把任意实数压到 (0,1)，0 对应「正负各半」，所以默认阈值 0.5 等价于线性得分 z>0。z=1 时约 0.731，z=3 时约 0.953。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: `import math

p, y = 0.1, 1
loss = -(y * math.log(p) + (1 - y) * math.log(1 - p))
print(round(loss, 3))`,
        stem: '这段代码输出什么？',
        answer: '2.303',
        accept: ['2.303'],
        explain: 'y=1 时只剩 <code>-log p=-log 0.1=2.303</code>，这就是「自信地答错」的代价。若 p=0.9，损失只有 0.105。对数损失在 p→0 时趋于无穷，所以模型不会轻易给出 0 或 1 的极端概率。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-8', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'K-means 的目标函数是？',
        options: [
          { text: '各点到所属簇中心距离平方之和', correct: true },
          { text: '各点到最近邻距离之和' },
          { text: '类间距离之和' },
          { text: '交叉熵损失' }
        ],
        explain: 'K-means 最小化簇内平方和（inertia）<code>Σ_cΣ_{x∈C_c}‖x-μ_c‖²</code>。交替分配与更新中心让目标单调不增，但只保证局部最优，结果依赖初始化，所以要用 k-means++ 并多次重启。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
