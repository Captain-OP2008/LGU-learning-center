/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'dda3020',
  short: 'DDA3020',
  name: '机器学习',
  en: 'Machine Learning',
  dept: '统计与数据科学',
  lang: 'python',
  langLabel: 'Python',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'DDA3020 // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... DDA3020',
    '> loading 8 modules ...',
    '> calibrating glossary & quiz bank ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '把课程读成一张可以走通的地图。',
  missionEn: 'DDA3020 · 8 MODULES',
  missionTitle: '从零开始<br><em>机器学习 全掌握</em>',
  lede: '先建立整门课的地图，再逐章推进：概念、例子、对比表、常见错误与自检清单，每章都配有题库与延伸练习。',
  searchPlaceholder: 'QUERY // 搜索本站章节、术语与题目',

  /* 资料库（path 相对 "CUHKSZ course/DDA3020" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/DDA3020/',
  resources: {
    note: '收录 DDA3020 的讲义、作业与官方解答、tutorial notebook 与考试说明；文件名保持原始命名，点击后用系统默认程序打开。标了 Annotated 的是带课堂批注的版本，复习时优先看它。',
    groups: [
      { name: '讲义（Lecture 01–17）', note: '按课程进度排列，每讲都有普通版与 Annotated 版；后者含课堂批注，适合二刷。', items: [
        { title: 'Lecture 01 · 课程介绍', path: '学习资料/DDA3020_Lectures_DDA3020_Lecture_01_Introduction_Annotated.pdf', kind: 'pdf', note: '课程安排、评分构成、机器学习的问题设定' },
        { title: 'Lecture 02 · 概率', path: '学习资料/DDA3020_Lectures_DDA3020_Lecture_02_Probability_Annotated.pdf', kind: 'pdf', note: '随机变量、期望方差、条件概率与贝叶斯' },
        { title: 'Lecture 03 · 线性代数', path: '学习资料/DDA3020_Lectures_DDA3020_Lecture_03_Linear_Algebra_Annotated.pdf', kind: 'pdf', note: '内积、投影、特征分解与 SVD' },
        { title: 'Lecture 04 · 优化', path: '学习资料/DDA3020_Lectures_DDA3020_Lecture_04_Optimization_Annotated.pdf', kind: 'pdf', note: '梯度、凸性、拉格朗日乘子与 KKT' },
        { title: 'Lecture 05 · 线性回归', path: '学习资料/DDA3020_Lectures_DDA3020_Lecture_05_Linear_Regression_Annotated.pdf', kind: 'pdf', note: '最小二乘、正规方程、最大似然视角' },
        { title: 'Lecture 06 · 逻辑回归', path: '学习资料/DDA3020_Lectures_DDA3020_Lecture_06_Logitstic_Regression_Annotated.pdf', kind: 'pdf', note: 'sigmoid、交叉熵与梯度推导（原文件名拼作 Logitstic）' },
        { title: 'Lecture 07 · SVM', path: '学习资料/DDA3020_Lectures_DDA3020_ML_Lecture_07_SVM_Annotated.pdf', kind: 'pdf', note: '最大间隔、对偶、软间隔与核技巧' },
        { title: 'Lecture 08 · 树方法', path: '学习资料/DDA3020_Lectures_DDA3020_Lecture_08_Tree_Methods_Annotated.pdf', kind: 'pdf', note: '不纯度、信息增益、剪枝与集成' },
        { title: 'Lecture 09 · 神经网络', path: '学习资料/DDA3020_Lectures_DDA3020_Lecture_09_Neural_Networks_Annotated.pdf', kind: 'pdf', note: '感知机、MLP、反向传播与优化器' },
        { title: 'Lecture 10 · CNN', path: '学习资料/DDA3020_Lectures_DDA3020_Lecture_10_CNN_Annotated.pdf', kind: 'pdf', note: '卷积、池化、感受野与经典架构' },
        { title: 'Lecture 11 · RNN 与 Transformer', path: '学习资料/DDA3020_Lectures_DDA3020_Lecture_11_RNN_Transformer_Annotated.pdf', kind: 'pdf', note: '序列建模、LSTM 门控、自注意力' },
        { title: 'Lecture 12 · 过拟合与偏差-方差', path: '学习资料/DDA3020_Lectures_DDA3020_Lecture_12_Overfitting_BiasVariance_Annotated.pdf', kind: 'pdf', note: '误差分解、正则化与模型选择' },
        { title: 'Lecture 13 · 性能评估', path: '学习资料/DDA3020_Lectures_DDA3020_Lecture_13_Performance_Evaluation.pdf', kind: 'pdf', note: '混淆矩阵、ROC/PR、交叉验证' },
        { title: 'Lecture 14 · 无监督学习导论', path: '学习资料/DDA3020_Lectures_DDA3020_Lecture_14_Intro_Unsupervised_Learning_Annotated.pdf', kind: 'pdf', note: '聚类与降维的任务形态' },
        { title: 'Lecture 15 · K-Means', path: '学习资料/DDA3020_Lectures_DDA3020_Lecture_15_Kmeans_Annotated.pdf', kind: 'pdf', note: '目标函数、Lloyd 算法与 k 的选择' },
        { title: 'Lecture 16 · GMM 与 EM', path: '学习资料/DDA3020_Lectures_DDA3020_Lecture_16_GMM_EM_Annotated.pdf', kind: 'pdf', note: '混合模型、隐变量、E 步与 M 步' },
        { title: 'Lecture 17 · PCA', path: '学习资料/DDA3020_Lectures_DDA3020_Lecture_17_PCA_Annotated.pdf', kind: 'pdf', note: '方差最大化、SVD 与主成分个数' }
      ] },
      { name: '作业与官方解答', note: '先自己做，再看解答；Solution 里的推导步骤比最终答案更值得读。', items: [
        { title: 'Homework 1', path: '作业习题/DDA3020_Homeworks_DDA3020_HW1.pdf', kind: 'pdf', note: '概率、线性代数与线性回归' },
        { title: 'Homework 2', path: '作业习题/DDA3020_Homeworks_DDA3020_HW2.pdf', kind: 'pdf', note: '逻辑回归、SVM 与优化' },
        { title: 'Homework 3', path: '作业习题/DDA3020_Homeworks_DDA3020_HW3.pdf', kind: 'pdf', note: '树、集成与无监督学习' },
        { title: 'Homework 2 · 代码包', path: '作业习题/DDA3020_Homeworks_DDA3020_HW2_Coding.zip', kind: 'zip', note: '需要自己补全的 Python 框架与数据' },
        { title: 'Assignment 1 · 解答', path: '作业习题/DDA3020_Homeworks_DDA3020_A1_Solution.pdf', kind: 'pdf', note: '推导题的完整步骤与常见扣分点' },
        { title: 'Assignment 1 · 逻辑回归 notebook', path: '作业习题/DDA3020_Homeworks_logistic_assignment1_Solution.ipynb', kind: 'ipynb', note: '从零实现逻辑回归的参考代码' },
        { title: 'Assignment 1 · SVM notebook', path: '作业习题/DDA3020_Homeworks_SVM_assignment1_Solution.ipynb', kind: 'ipynb', note: 'hinge 损失与核 SVM 的参考实现' },
        { title: 'Homework 2 · 解答', path: '作业习题/DDA3020_Homeworks_DDA3020_Homework2_Solution.pdf', kind: 'pdf', note: 'SVM 对偶与 softmax 梯度的推导' },
        { title: 'Assignment 3 · 解答', path: '作业习题/DDA3020_Homeworks_Assignment3_Solution.pdf', kind: 'pdf', note: 'K-Means、GMM 与 EM 的推导题' },
        { title: 'Assignment 3 · K-Means/GMM notebook', path: '作业习题/DDA3020_Homeworks_Assignment3_KMeans_GMM_Solution.ipynb', kind: 'ipynb', note: '聚类作业的参考实现与可视化' },
        { title: 'Iris 数据集', path: '作业习题/DDA3020_Homeworks_Iris.csv', kind: 'csv', note: '课堂与作业共用的三分类小数据集' }
      ] },
      { name: 'Tutorial 与代码', note: '每个 tutorial 对应一周上机；notebook 可直接在 Jupyter 或 Colab 打开。', items: [
        { title: 'Week 02 · 代码包', path: '学习资料/DDA3020_Week_02.zip', kind: 'zip', note: '概率与线性代数的课堂练习' },
        { title: 'Week 03 · 代码包', path: '学习资料/DDA3020_Week_03.zip', kind: 'zip', note: '优化与回归的示例代码' },
        { title: 'Week 05 · Tutorial notebook', path: '作业习题/DDA3020_Week_05_tutorial_week_05.ipynb', kind: 'ipynb', note: '线性回归与梯度下降的动手练习' },
        { title: 'Week 05 · Tutorial 讲义', path: '作业习题/DDA3020_Week_05_tutorial_week_05.pdf', kind: 'pdf', note: '练习说明与参考答案要点' },
        { title: 'Week 06 · Tutorial 讲义', path: '作业习题/DDA3020_Week_06_tutorial_week_06_2.pdf', kind: 'pdf', note: '逻辑回归与分类边界' },
        { title: 'Week 07 · 决策树 slides', path: '学习资料/DDA3020_Week_07_Decision_Trees.pptx', kind: 'pptx', note: '树的分裂、剪枝与可视化' },
        { title: 'Week 07 · 课堂 demo', path: '学习资料/DDA3020_Week_07_demo.ipynb', kind: 'ipynb', note: '用 sklearn 现场训练一棵树' },
        { title: 'Week 07 · MNIST 数据包', path: '学习资料/DDA3020_Week_07_mnist.zip', kind: 'zip', note: '手写数字数据，项目 P3 会用到' },
        { title: 'Week 09 · MLP slides', path: '学习资料/DDA3020_Week_09_Multi_layer_Feedforward_Neural_Network.pptx', kind: 'pptx', note: '多层前馈网络与反向传播' },
        { title: 'Week 10 · 如何使用 Colab', path: '作业习题/DDA3020_Week_10_How_to_use_Colab.pdf', kind: 'pdf', note: '环境、GPU 与 notebook 导入' },
        { title: 'Week 10 · CNN tutorial', path: '作业习题/DDA3020_Week_10_Tutorial_CNN.pptx', kind: 'pptx', note: '卷积层的动手实现与调参' },
        { title: 'Week 12 · Tutorial 12.1', path: '学习资料/DDA3020_Week_12_Tut_12_1.ipynb', kind: 'ipynb', note: '无监督学习的第一个 notebook' },
        { title: 'Week 12 · Tutorial 12.2', path: '学习资料/DDA3020_Week_12_Tut_12_2.ipynb', kind: 'ipynb', note: '聚类与降维的对比实验' },
        { title: 'Week 12 · Tutorial 讲义', path: '学习资料/DDA3020_Week_12_Tut_12.pdf', kind: 'pdf', note: 'K-Means 与 PCA 的课堂练习' },
        { title: 'Week 13 · Tutorial notebook', path: '学习资料/DDA3020_Week_13_Tut_13.ipynb', kind: 'ipynb', note: 'GMM 与 EM 的收敛实验' },
        { title: 'Week 13 · Tutorial 讲义', path: '学习资料/DDA3020_Week_13_Tut_week_13.pdf', kind: 'pdf', note: '期末复习要点与综合练习' }
      ] },
      { name: '试卷与总结', note: '考前一周用：先看考试模板确认题型与分值，再用 Summary 做最后一轮查漏。', items: [
        { title: '考试模板', path: '考试资料/DDA3020_exam_template.pdf', kind: 'pdf', note: '题型、分值分布与答题格式' },
        { title: '课程总结', path: '学习资料/DDA3020_Summary.pdf', kind: 'pdf', note: '全课公式与方法的浓缩版，适合考前速览' },
        { title: 'Softmax 梯度补充', path: '学习资料/DDA3020_Lectures_softmax_gradient.pdf', kind: 'pdf', note: 'softmax + 交叉熵梯度的完整推导' }
      ] }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '机器学习（Machine Learning）'],
    ['来源', 'CUHKSZ DDA3020 课程资料'],
    ['结构', '8 章正文 · 分章题库 · 模拟卷 · 实战项目 · 资料库'],
    ['建议', '先读第 0 章建立地图，再按顺序推进；每章结尾的自检清单不要跳过。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    {
      label: '核心概念',
      blocks: [
        { t: 'p', html: '这张表把八章里最容易被混淆的概念放在一起。复习时先遮住右列，尝试自己说出区别，再对照。' },
        { t: 'table', head: ['概念', '一句话定义', '最容易混淆的点'], rows: [
          ['过拟合 / 欠拟合', '训练误差低而测试高 / 两者都高', '过拟合要加正则或加数据，欠拟合要加容量或加特征'],
          ['偏差 / 方差', '平均预测偏离真值的程度 / 换数据后预测的波动', 'bagging 降方差，boosting 降偏差'],
          ['判别式 / 生成式', '直接建模 p(y|x) / 建模 p(x,y) 再用贝叶斯', '逻辑回归是判别式，朴素贝叶斯与 GMM 是生成式'],
          ['硬间隔 / 软间隔', '不允许违反 margin / 允许并惩罚违反', 'C 越大越接近硬间隔，正则越弱'],
          ['bagging / boosting', '并行、独立、平均 / 串行、拟合残差', '前者基学习器深，后者浅'],
          ['L1 / L2', '菱形约束、稀疏 / 圆形约束、收缩', '需要特征选择用 L1，共线严重用 L2 或弹性网'],
          ['K-Means / GMM', '硬分配、球形等大小 / 软分配、可椭圆', 'GMM 多一层概率，能给出归属置信度'],
          ['PCA / 特征选择', '线性组合出新特征 / 挑原始列的子集', 'PCA 不可解释，但压缩率更高']
        ], caption: '被问「有什么区别」时，答「定义 + 一个具体后果」就够了' }
      ]
    },
    {
      label: '公式速查',
      blocks: [
        { t: 'p', html: '考试允许带一张公式纸时，优先抄这些。每个公式后面都标了它成立的前提，前提比公式更容易被忘。' },
        { t: 'table', head: ['名称', '公式', '前提 / 备注'], rows: [
          ['最小二乘闭式解', '<code>w = (XᵀX)⁻¹Xᵀy</code>', 'XᵀX 可逆；否则加 λI 或用伪逆'],
          ['岭回归', '<code>w = (XᵀX + λI)⁻¹Xᵀy</code>', '不惩罚截距；需标准化'],
          ['sigmoid', '<code>σ(z) = 1/(1+e⁻ᶻ)</code>', '<code>σ′ = σ(1-σ)</code>'],
          ['逻辑回归梯度', '<code>∇ = (1/n)Xᵀ(σ(Xw) - y)</code>', '与线性回归同构：预测减真值'],
          ['softmax', '<code>pₖ = e^{zₖ}/Σⱼe^{zⱼ}</code>', '配交叉熵时梯度为 <code>p - onehot</code>'],
          ['SVM 对偶', '<code>w = Σαᵢyᵢxᵢ</code>，<code>Σαᵢyᵢ = 0</code>', '只有支持向量 αᵢ &gt; 0'],
          ['hinge 损失', '<code>max(0, 1 - y·f(x))</code>', 'y 取 ±1；margin 大于 1 时为零'],
          ['Gini', '<code>1 - Σpₖ²</code>', '二分类最大 0.5；熵最大 1'],
          ['信息增益', '<code>H(p) - Σ(mₖ/m)H(k)</code>', '子节点熵要按样本比例加权'],
          ['误差分解', '<code>σ² + Bias² + Var</code>', '噪声不可消除'],
          ['AUC', '<code>P(score₊ &gt; score₋)</code>', '只看排序，与阈值、类别比例无关'],
          ['最优阈值', '<code>C_FP/(C_FP+C_FN)</code>', '漏报代价越大，阈值越接近 0'],
          ['GMM 责任度', '<code>γᵢₖ ∝ πₖN(xᵢ|μₖ,Σₖ)</code>', '对 k 归一化后求和为 1'],
          ['EM 的 M 步', '<code>μₖ = (1/Nₖ)Σγᵢₖxᵢ</code>', '<code>Nₖ = Σγᵢₖ</code>，加权样本均值'],
          ['PCA', '<code>Σw = λw</code>，取最大 λ', '中心化必做；解释方差比 <code>λᵢ/Σλ</code>'],
          ['卷积输出', '<code>⌊(H+2P-K)/S⌋ + 1</code>', 'P = (K-1)/2 时尺寸不变']
        ], caption: '公式纸的空间有限，优先写「带前提」的版本' }
      ]
    },
    {
      label: 'numpy · pandas · sklearn',
      blocks: [
        { t: 'p', html: '这份速查只列本课程真正会用到的调用。记不住参数名没关系，记住「哪个对象负责哪一步」更重要。' },
        { t: 'code', lang: 'python', caption: 'numpy：形状、广播与三个必会操作', code: `import numpy as np

X = np.random.randn(100, 5)
w = np.random.randn(5)
z = X @ w                    # (100,) 矩阵乘向量
Xb = np.c_[np.ones(100), X]  # 加一列偏置
print(X.mean(0).shape)       # (5,) 按列求均值
print(X.std(0, ddof=1))      # 样本标准差

# 广播：列向量减行向量得到矩阵
a = np.arange(3).reshape(3, 1)
b = np.arange(4).reshape(1, 4)
print((a + b).shape)         # (3, 4)

# 常用
print(np.linalg.inv(X.T @ X + 1e-6 * np.eye(5)) @ X.T @ np.ones(100))
print(np.linalg.svd(X, full_matrices=False)[1][:3])` },
        { t: 'code', lang: 'python', caption: 'pandas：读数据、看缺失、切分与编码', code: `import pandas as pd

df = pd.read_csv('data.csv')
print(df.shape, df.dtypes.value_counts())
print(df.isna().mean().sort_values(ascending=False).head())
print(df.describe().T[['mean', 'std', 'min', 'max']])

num = df.select_dtypes(include='number').columns.tolist()
cat = df.select_dtypes(exclude='number').columns.tolist()
df[num] = df[num].fillna(df[num].median())
df = pd.get_dummies(df, columns=cat, drop_first=True)

# 分组聚合：每类的均值与样本数
print(df.groupby('label')['price'].agg(['mean', 'count']))` },
        { t: 'code', lang: 'python', caption: 'sklearn：Pipeline + 交叉验证 + 指标', code: `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import classification_report, roc_auc_score

pipe = Pipeline([
    ('sc', StandardScaler()),
    ('clf', LogisticRegression(C=1.0, max_iter=1000)),
])
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)
scores = cross_val_score(pipe, X, y, cv=cv, scoring='roc_auc')
print('AUC %.3f +/- %.3f' % (scores.mean(), scores.std()))

pipe.fit(X_train, y_train)
print(classification_report(y_test, pipe.predict(X_test), digits=3))
print('AUC(test) =', roc_auc_score(y_test, pipe.predict_proba(X_test)[:, 1]))` },
        { t: 'table', head: ['任务', '调用', '注意'], rows: [
          ['切分', '<code>train_test_split(X, y, stratify=y)</code>', '分类问题要分层；时间序列不能随机切'],
          ['标准化', '<code>StandardScaler().fit(X_train)</code>', '只在训练集 fit，测试集只 transform'],
          ['填缺失', '<code>SimpleImputer(strategy="median")</code>', '放进 Pipeline 才安全'],
          ['编码', '<code>OneHotEncoder(handle_unknown="ignore")</code>', '避免测试集新类别报错'],
          ['调参', '<code>GridSearchCV(pipe, grid, cv=5)</code>', '搜索空间里写 <code>clf__C</code> 这样的前缀'],
          ['聚类', '<code>KMeans(n_clusters=k, n_init=10)</code>', '先标准化；用轮廓系数选 k'],
          ['降维', '<code>PCA(n_components=0.95)</code>', '中心化由 PCA 内部完成'],
          ['模型持久化', '<code>joblib.dump(model, "m.pkl")</code>', '整条 Pipeline 一起存']
        ], caption: '前四行是「必须放进 Pipeline」的四件事' }
      ]
    },
    {
      label: '答题与易错',
      blocks: [
        { t: 'p', html: '期末失分往往不是因为不会，而是因为答非所问或漏掉前提。下面这张表按题型给出可执行的检查动作。' },
        { t: 'table', head: ['题型', '阅卷人想看什么', '自查动作'], rows: [
          ['概念辨析', '定义 + 一个具体后果', '遮住答案，能否用一句话说清两者的差别'],
          ['公式推导', '每一步的依据（链式法则、贝叶斯、KKT）', '检查维度是否对得上，边界条件是否写了'],
          ['计算题', '中间步骤与单位', '代回原式验证；概率是否落在 [0,1]'],
          ['代码输出', '精确的空格、换行、数据类型', '手动跟踪前两轮循环，注意整数除法与广播'],
          ['调参/实验设计', '控制变量、数据划分、评估指标', '是否只改了要研究的那个变量'],
          ['开放题', '取舍与理由，而非罗列方法', '写出「在什么条件下选谁」']
        ], caption: '计算题写清步骤，即使结果错也能拿过程分' },
        { t: 'table', head: ['高频错误', '为什么错', '正确说法'], rows: [
          ['「C 越大正则越强」', 'C 是正则强度的倒数', 'C 大 → 间隔窄 → 容易过拟合'],
          ['「PCA 能提高分类精度」', 'PCA 只保留方差大的方向', '方差不等于判别力，可能丢有用信息'],
          ['「AUC 高说明概率准」', 'AUC 只看排序', '校准要看可靠性图与 Brier 分数'],
          ['「树能外推」', '叶子输出训练样本均值', '预测必在训练目标范围内'],
          ['「EM 保证全局最优」', '只保证似然单调不减', '非凸，依赖初始化'],
          ['「先标准化再切分」', '测试集信息泄漏', '先切分，scaler 只在训练折 fit'],
          ['「深度网络一定比浅层好」', '没有非线性时深度无效', '表达能力来自激活函数'],
          ['「不平衡就看准确率」', '多数类基线可能已经 99%', '看 PR/AP、每类召回与代价']
        ], caption: '这八条在模拟卷与题库里都会反复出现' }
      ]
    }
  ]
};
