/* =====================================================================
 * projects.js · DDA3020 实战项目
 * 结构：{ id, title, en, tagline, level, minutes, chapters, goals, intro,
 *         milestones:[{ n, title, tasks, starter, hints, solution }] }
 * 三个项目由易到难：全流程回归 → 从零实现分类器 → 深度学习对比与误差分析。
 * 前两个只依赖 numpy / pandas / scikit-learn，第三个的 CNN 部分为可选的
 * PyTorch 扩展，没有 GPU 也能完成主体。
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerProjects([

    /* ================================================================ P1 */
    {
      id: 'P1',
      title: '房价预测：一条完整的回归流水线',
      en: 'HOUSE PRICE PIPELINE',
      tagline: '从读数据到交叉验证，把「训练集/验证集/测试集」这条纪律走一遍。',
      level: '入门',
      minutes: 150,
      chapters: ['ch01', 'ch02', 'ch06'],
      goals: [
        '能用 pandas 完成缺失值、类别编码与异常值的检查，并说清每一步的理由',
        '能用 Pipeline + ColumnTransformer 保证预处理只在训练折上 fit',
        '能用交叉验证选正则强度，并在测试集上只评估一次',
        '能写出「均值基线 → 线性回归 → 岭回归」的对比表，而不是只报一个分数'
      ],
      intro: '这个项目的数据是经典的加州房价（或任何一份带数值与类别列的房价表），目标不是把 RMSE 压到最低，' +
        '而是把流程走对：先切分、再预处理、再交叉验证、最后测试一次。做完你会发现，' +
        '第 6 章反复强调的「数据泄漏」不是抽象概念——只要把 scaler 放在切分之前，交叉验证的分数就会明显偏乐观，' +
        '而这个小实验比任何定义都更能让你记住它。',
      milestones: [
        {
          n: 1,
          title: '数据体检与切分',
          tasks: [
            '用 pandas 读入数据，打印形状、各列缺失率、数值列的分位数与类别列的取值分布。',
            '把目标列单独取出，其余作为特征；用 train_test_split 按 80/20 切出训练集与测试集，random_state 固定。',
            '在训练集上统计数值列的偏度，对明显右偏（偏度大于 1）的列尝试 log1p 变换，比较变换前后的分布。',
            '找出至少两个异常值（例如用 IQR 规则），决定是删除、截断还是保留，并把理由写进注释。',
            '把测试集封存：这一步之后直到里程碑 3 结束，不允许再用它做任何选择。'
          ],
          starter: `import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

df = pd.read_csv('housing.csv')
print(df.shape)
print(df.isna().mean().sort_values(ascending=False).head())

y = df['median_house_value'].values
X = df.drop(columns=['median_house_value'])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

num_cols = X_train.select_dtypes(include=[np.number]).columns.tolist()
cat_cols = X_train.select_dtypes(exclude=[np.number]).columns.tolist()
print('数值列', num_cols)
print('类别列', cat_cols)
print('训练集偏度')
print(X_train[num_cols].skew().sort_values(ascending=False).head())`,
          hints: [
            '先切分再体检：所有统计量（中位数、均值、分位数）都只应在训练集上算，否则测试集的信息会通过预处理渗进来。',
            '偏度大于 1 时 log1p 往往有效，但要注意房价这类目标本身也可能右偏，对 y 做变换后预测结果要逆变换回来。',
            'IQR 规则是 [Q1 - 1.5IQR, Q3 + 1.5IQR]；加州房价里有大量被截断在 500001 的样本，这类「天花板值」更该单独讨论而不是直接删。',
            '把 random_state 固定下来，之后每次实验都用同一个切分，否则不同次运行之间的差异会掩盖方法之间的差异。'
          ],
          solution: `# 关键点：切分在一切统计之前
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2,
                                                    random_state=42)
skew = X_train[num_cols].skew()
skewed = skew[skew.abs() > 1].index.tolist()
for c in skewed:
    X_train[c] = np.log1p(X_train[c].clip(lower=0))
    X_test[c] = np.log1p(X_test[c].clip(lower=0))
print('变换后偏度', X_train[skewed].skew().round(2).to_dict())`
        },
        {
          n: 2,
          title: '预处理流水线与交叉验证',
          tasks: [
            '用 ColumnTransformer 把数值列（中位数填充 + 标准化）与类别列（众数填充 + OneHotEncoder）分开处理。',
            '把预处理器与 Ridge 回归串成 Pipeline，确保交叉验证的每一折内部都重新 fit。',
            '对 alpha 取 [0.01, 0.1, 1, 10, 100]，用 5 折交叉验证比较负均方根误差，画出 alpha 与 CV 分数的关系。',
            '做一次「故意泄漏」的对照实验：先对全量数据标准化再交叉验证，比较两次的 CV 分数差多少。',
            '记录最优 alpha、对应的 CV 均值与标准差，并解释标准差说明什么。'
          ],
          starter: `from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import Ridge
from sklearn.model_selection import cross_val_score

num_pipe = Pipeline([
    ('imp', SimpleImputer(strategy='median')),
    ('sc', StandardScaler()),
])
cat_pipe = Pipeline([
    ('imp', SimpleImputer(strategy='most_frequent')),
    ('oh', OneHotEncoder(handle_unknown='ignore')),
])
pre = ColumnTransformer([
    ('num', num_pipe, num_cols),
    ('cat', cat_pipe, cat_cols),
])

for alpha in [0.01, 0.1, 1, 10, 100]:
    pipe = Pipeline([('pre', pre), ('ridge', Ridge(alpha=alpha))])
    scores = cross_val_score(pipe, X_train, y_train,
                             cv=5, scoring='neg_root_mean_squared_error')
    print('alpha=%6.2f  CV-RMSE=%.1f  (+/- %.1f)' % (
        alpha, -scores.mean(), scores.std()))`,
          hints: [
            'Pipeline 的价值就在这一行：cross_val_score 会在每一折的训练部分重新 fit 整个 pre，验证部分只 transform。',
            'OneHotEncoder 要加 handle_unknown="ignore"，否则测试集出现训练时没见过的类别会直接报错。',
            'scoring 用 neg_root_mean_squared_error（sklearn 的分数都是「越大越好」，所以误差取负）。',
            '泄漏实验里你会看到 CV 分数变好——变好的那部分正是虚假的乐观，这个差值就是泄漏的代价。'
          ],
          solution: `pipe = Pipeline([('pre', pre), ('ridge', Ridge(alpha=10))])
scores = cross_val_score(pipe, X_train, y_train, cv=5,
                         scoring='neg_root_mean_squared_error')
print('CV-RMSE = %.1f +/- %.1f' % (-scores.mean(), scores.std()))

# 对照：先标准化全量，再交叉验证（错误做法）
from sklearn.preprocessing import StandardScaler
X_all = StandardScaler().fit_transform(
    X_train.select_dtypes(include=[np.number]).fillna(0))
leaky = cross_val_score(Ridge(alpha=10), X_all, y_train, cv=5,
                        scoring='neg_root_mean_squared_error')
print('泄漏版 CV-RMSE = %.1f' % (-leaky.mean()))`
        },
        {
          n: 3,
          title: '测试集评估与误差分析',
          tasks: [
            '用最优超参数在完整训练集上重新 fit，然后对测试集预测一次，报告 RMSE、MAE 与 R²。',
            '画出预测值对真实值的散点图，并叠加 y = x 参考线，观察系统性偏差。',
            '把残差按预测值分箱，看残差是否随预测值变化（异方差），并给出解释。',
            '找出残差最大的 10 个样本，检查它们的特征是否有共性（例如都落在价格上限附近）。',
            '写一张三行对比表：均值基线、线性回归、岭回归的测试 RMSE，并说明岭回归的收益来自哪里。'
          ],
          starter: `from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import matplotlib.pyplot as plt

pipe.fit(X_train, y_train)
pred = pipe.predict(X_test)
rmse = mean_squared_error(y_test, pred, squared=False)
print('RMSE=%.1f  MAE=%.1f  R2=%.4f' % (
    rmse, mean_absolute_error(y_test, pred), r2_score(y_test, pred)))

base = np.full_like(y_test, y_train.mean(), dtype=float)
print('均值基线 RMSE=%.1f' % mean_squared_error(y_test, base, squared=False))

plt.scatter(y_test, pred, s=8, alpha=0.4)
lim = [y_test.min(), y_test.max()]
plt.plot(lim, lim, 'r--')
plt.xlabel('true'); plt.ylabel('pred'); plt.show()`,
          hints: [
            'sklearn 新版本里 mean_squared_error 的 squared 参数已弃用，可改用 root_mean_squared_error 或对 MSE 开方，注意版本。',
            '散点图如果出现一条水平的天花板（500001 附近），说明模型学到的上限来自训练数据里的截断值，这不是模型 bug 而是数据问题。',
            '残差分箱后若高价格区的残差明显更大，说明误差是异方差的；此时 RMSE 会被高价样本主导，汇报时最好同时给 MAE。',
            '三条基线是报告的最低要求：常数基线（均值/众数）、最简单的模型、你的模型。没有基线，RMSE 是多少都说明不了好坏。'
          ],
          solution: `from sklearn.metrics import root_mean_squared_error as rmse_fn

pipe.fit(X_train, y_train)
pred = pipe.predict(X_test)
print('岭回归  RMSE=%.1f' % rmse_fn(y_test, pred))
print('均值基线 RMSE=%.1f' % rmse_fn(y_test, np.full_like(y_test, y_train.mean())))

res = y_test - pred
for lo, hi in [(0, 1e5), (1e5, 2e5), (2e5, 3e5), (3e5, 1e6)]:
    m = (y_test >= lo) & (y_test < hi)
    if m.sum():
        print('%6.0f-%6.0f  n=%4d  MAE=%8.1f' % (lo, hi, m.sum(),
                                                 np.abs(res[m]).mean()))`
        }
      ]
    },

    /* ================================================================ P2 */
    {
      id: 'P2',
      title: '从零实现逻辑回归与线性 SVM',
      en: 'LOGISTIC & SVM FROM SCRATCH',
      tagline: '用 numpy 手写梯度下降与 hinge 损失的次梯度，再和 sklearn 对照。',
      level: '进阶',
      minutes: 210,
      chapters: ['ch01', 'ch02', 'ch03'],
      goals: [
        '能独立推导并实现 sigmoid、交叉熵、梯度与 L2 正则，训练出与 sklearn 相当的逻辑回归',
        '能实现 hinge 损失 + 次梯度下降，理解为什么 SVM 的解只由支持向量决定',
        '能设计公平的对照实验：同一数据、同一划分、同一评估指标',
        '能用决策边界图解释「L2 正则强度」与「C」如何改变边界'
      ],
      intro: '第 2、3 章给了你一堆公式，这个项目把它们变成 60 行能跑的代码。重点不是复现 sklearn 的精度，' +
        '而是亲眼看到几件事：交叉熵的梯度就是 p - y；hinge 损失的梯度只在 margin 小于 1 时非零，' +
        '所以大部分样本对 w 没有贡献；以及 L2 正则与 C 其实是同一个旋钮的两端。' +
        '做完之后，两个类的「对偶 / 支持向量 / 最大间隔」就不再是背下来的名词。',
      milestones: [
        {
          n: 1,
          title: '逻辑回归：从公式到收敛',
          tasks: [
            '在二维两类数据（make_moons 或 make_classification）上实现 sigmoid、交叉熵损失与梯度。',
            '写出批量梯度下降，记录每轮损失，画出损失曲线，确认它单调下降并趋于平缓。',
            '加入 L2 正则（注意偏置项不惩罚），比较 lambda 取 0、0.01、0.1 时决策边界的平滑程度。',
            '用 sklearn 的 LogisticRegression 在同一数据上训练，比较两者的准确率与系数（注意 sklearn 的 C = 1/lambda）。',
            '实现 predict_proba，并用它验证「阈值 0.5 时预测与 argmax 一致」。'
          ],
          starter: `import numpy as np

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))

def loss_grad(X, y, w, b, lam=0.0):
    n = len(y)
    p = sigmoid(X @ w + b)
    eps = 1e-12
    loss = -np.mean(y * np.log(p + eps) + (1 - y) * np.log(1 - p + eps))
    loss += 0.5 * lam * np.dot(w, w)
    grad_w = X.T @ (p - y) / n + lam * w
    grad_b = np.mean(p - y)
    return loss, grad_w, grad_b

def train(X, y, lr=0.1, epochs=3000, lam=0.0):
    w = np.zeros(X.shape[1]); b = 0.0
    hist = []
    for _ in range(epochs):
        loss, gw, gb = loss_grad(X, y, w, b, lam)
        w -= lr * gw; b -= lr * gb
        hist.append(loss)
    return w, b, hist`,
          hints: [
            '数值稳定：exp 的参数先 clip 到 [-500, 500]，否则极端值会溢出成 inf，log(0) 变成 -inf。',
            '梯度是 X.T @ (p - y) / n，形状 (d,)，与 w 对齐；b 的梯度是标量均值。写错维度会得到一个 silently 广播的结果，务必 assert 形状。',
            '正则只加在 w 上，不加 b：偏置控制的是整体平移，惩罚它等于强迫决策边界过原点，通常有害。',
            '学习率从 0.1 起步，若损失震荡就减半；特征先标准化，否则不同量纲会让同一个 lr 对某些维度太大、对另一些太小。'
          ],
          solution: `from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_moons

X, y = make_moons(n_samples=400, noise=0.25, random_state=0)
X = StandardScaler().fit_transform(X)
w, b, hist = train(X, y, lr=0.5, epochs=4000, lam=0.01)
print('首末损失 %.4f -> %.4f' % (hist[0], hist[-1]))
print('训练准确率 %.3f' % ((sigmoid(X @ w + b) > 0.5) == y).mean())

from sklearn.linear_model import LogisticRegression
clf = LogisticRegression(C=100).fit(X, y)   # C=100 约等于 lam=0.01
print('sklearn 准确率 %.3f' % clf.score(X, y))
print('系数相关 %.3f' % np.corrcoef(w, clf.coef_[0])[0, 1])`
        },
        {
          n: 2,
          title: '线性 SVM：hinge 损失与次梯度',
          tasks: [
            '实现 hinge 损失 L = mean(max(0, 1 - y·(wᵀx + b))) + 0.5·lam·‖w‖²，其中 y 取 ±1。',
            '推导并实现次梯度：margin 小于 1 的样本贡献 -y·x，其余贡献 0；注意用「次梯度」而不是梯度。',
            '用不同 lam（等价于不同 C）训练，统计每次的非零 α 比例（即违反 margin 的样本占比），验证「C 越大支持向量越多」。',
            '把决策边界与 margin 边界（wᵀx + b = ±1）画在同一张图上，标出支持向量。',
            '与 sklearn 的 SVC(kernel="linear", C=...) 对比准确率与支持向量个数。'
          ],
          starter: `import numpy as np

def hinge_loss_grad(X, y, w, b, lam=1.0):
    # y in {-1, +1}
    margins = y * (X @ w + b)
    loss = np.mean(np.maximum(0, 1 - margins)) + 0.5 * lam * np.dot(w, w)
    mask = margins < 1                      # 违反间隔的样本
    grad_w = -X[mask].T @ y[mask] / len(y) + lam * w
    grad_b = -np.sum(y[mask]) / len(y)
    return loss, grad_w, grad_b, mask

def train_svm(X, y, lr=0.05, epochs=3000, lam=1.0):
    w = np.zeros(X.shape[1]); b = 0.0
    for _ in range(epochs):
        loss, gw, gb, mask = hinge_loss_grad(X, y, w, b, lam)
        w -= lr * gw; b -= lr * gb
    return w, b, mask`,
          hints: [
            '标签必须是 ±1，不能用 0/1：hinge 里的 y 是符号，换成 0 会让正类样本的 margin 恒为 0。',
            'mask = margins < 1 同时包含了「分错」与「分对但在间隔内」的样本，它们才是支持向量；margin 大于 1 的样本梯度为零。',
            'lam 与 C 的关系是 lam = 1/(n·C)（sklearn 的目标里 C 乘在损失上），所以 lam 越小等价于 C 越大、越不容忍违反。',
            '次梯度下降不保证单调，损失曲线会有小抖动；这是正常的，看趋势而不是每一步。'
          ],
          solution: `from sklearn.svm import SVC

w, b, mask = train_svm(X, y, lr=0.01, epochs=5000, lam=0.1)
print('支持向量占比 %.2f' % mask.mean())
print('训练准确率 %.3f' % (((X @ w + b) > 0) == (y > 0)).mean())

svc = SVC(kernel='linear', C=10).fit(X, y)
print('sklearn 支持向量数 %d / %d' % (svc.n_support_.sum(), len(y)))
print('sklearn 准确率 %.3f' % svc.score(X, y))`
        },
        {
          n: 3,
          title: '公平对比与结论',
          tasks: [
            '固定同一份训练/测试划分，把逻辑回归、线性 SVM、sklearn 两个实现放在同一张表里比较准确率与训练时间。',
            '画出四者的决策边界（2×2 子图），标注各自的超参数。',
            '构造一个线性不可分的数据（同心圆），观察线性 SVM 的失败，并说明需要核方法或特征映射。',
            '写 200 字结论：在什么数据上选逻辑回归、什么数据上选 SVM，理由分别是什么。',
            '把最优模型封装成 fit/predict 接口，输入一条新样本返回类别与得分。'
          ],
          starter: `import time
from sklearn.datasets import make_circles

Xc, yc = make_circles(n_samples=400, noise=0.1, factor=0.3, random_state=0)
Xc = StandardScaler().fit_transform(Xc)

results = []
for name, fn in [('logistic', lambda: train(X, y, lr=0.5, epochs=3000)),
                 ('svm-hinge', lambda: train_svm(X, 2 * y - 1, lr=0.01, epochs=3000))]:
    t0 = time.time(); fn(); dt = time.time() - t0
    results.append((name, round(dt, 2)))
print(results)

# 线性模型在同心圆上必然失败
w2, b2, _ = train_svm(Xc, 2 * yc - 1, lr=0.01, epochs=3000, lam=0.1)
print('同心圆上的训练准确率 %.3f' % (((Xc @ w2 + b2) > 0) == (yc > 0)).mean())`,
          hints: [
            '对比实验的唯一变量是模型：数据、划分、评估指标、随机种子都必须相同，否则差异无法归因。',
            '训练时间受 epochs 与向量化程度影响，公平起见应固定迭代次数或固定收敛阈值，而不是各跑各的。',
            '同心圆上线性 SVM 的准确率会停在 0.5 附近——这不是实现错了，而是假设错了。这时 RBF 核一步就能到 0.95 以上。',
            '结论要写「在什么条件下选谁」，而不是「谁更好」；面试里被追问的永远是条件。'
          ],
          solution: `import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC

rows = []
for name, model in [('logreg', LogisticRegression(C=10, max_iter=1000)),
                    ('svm-linear', SVC(kernel='linear', C=10)),
                    ('svm-rbf', SVC(kernel='rbf', C=10, gamma='scale'))]:
    model.fit(X, y)
    rows.append((name, round(model.score(X, y), 3)))
print(pd.DataFrame(rows, columns=['model', 'acc']))

# 同心圆：线性必败，RBF 可行
print('linear on circles', round(SVC(kernel='linear').fit(Xc, yc).score(Xc, yc), 3))
print('rbf    on circles', round(SVC(kernel='rbf').fit(Xc, yc).score(Xc, yc), 3))`
        }
      ]
    },

    /* ================================================================ P3 */
    {
      id: 'P3',
      title: '手写数字识别：MLP 与 CNN 的对比与误差分析',
      en: 'DIGITS: MLP VS CNN',
      tagline: '同一份数据、同一套评估，比较全连接与卷积，并把错误样本看个明白。',
      level: '挑战',
      minutes: 240,
      chapters: ['ch05', 'ch06', 'ch07'],
      goals: [
        '能搭起「数据加载 → 预处理 → 模型 → 交叉验证 → 误差分析」的完整实验框架',
        '能说清 MLP 与 CNN 的参数量、感受野与归纳偏置差异，并用实验数据支撑',
        '能用混淆矩阵、每类召回率与 PCA 可视化定位模型的具体弱点',
        '能写出可复现的实验报告：固定种子、记录超参数、报告均值与标准差'
      ],
      intro: '手写数字是这门课里最合适的「端到端」数据集：它小到能在笔记本上跑完，又真实到能暴露各种问题。' +
        '这个项目要求你做两件常被跳过的事：一是给出三条基线（多数类、逻辑回归、MLP），' +
        '二是把分错的样本一张张看过去。第二件事往往会告诉你，模型的瓶颈在数据（书写模糊、标签错误），' +
        '而不是在架构。CNN 部分是可选的 PyTorch 扩展；没有 GPU 也能用 sklearn 的 MLP 完成主体。',
      milestones: [
        {
          n: 1,
          title: '数据、基线与评估框架',
          tasks: [
            '加载 digits（8×8，1797 条）或 MNIST（需自行准备），做训练/测试划分并标准化像素。',
            '建立三条基线：多数类分类器、逻辑回归、单隐层 MLP，记录准确率与训练时间。',
            '为所有模型统一使用同一份划分与同一套评估函数（准确率 + 宏平均 F1 + 混淆矩阵）。',
            '检查类别是否平衡，若不平衡则改用分层划分并说明理由。',
            '把结果整理成表，注明每行的超参数与随机种子。'
          ],
          starter: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.neural_network import MLPClassifier
from sklearn.dummy import DummyClassifier
from sklearn.metrics import accuracy_score, f1_score

X, y = load_digits(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=0)
sc = StandardScaler().fit(X_train)
Xtr, Xte = sc.transform(X_train), sc.transform(X_test)

def evaluate(name, model):
    model.fit(Xtr, y_train)
    pred = model.predict(Xte)
    print('%-12s acc=%.4f  macroF1=%.4f' % (
        name, accuracy_score(y_test, pred), f1_score(y_test, pred, average='macro')))
    return pred

evaluate('majority', DummyClassifier(strategy='most_frequent'))
evaluate('logreg', LogisticRegression(max_iter=2000))
evaluate('mlp', MLPClassifier(hidden_layer_sizes=(128,), max_iter=500,
                              random_state=0))`,
          hints: [
            '标准化要用训练集的均值方差：在测试集上 fit 是泄漏，在全集上 fit 也是泄漏。',
            'digits 是 8×8、像素 0–16，MNIST 是 28×28、0–255；换数据集时预处理要跟着改，但评估框架应当完全复用。',
            'MLPClassifier 的 hidden_layer_sizes 是元组，单隐层写 (128,)，两层写 (128, 64)。',
            '先跑基线再调模型：如果 MLP 只比逻辑回归高 1 个点，先怀疑数据与特征，而不是急着加深网络。'
          ],
          solution: `preds = {}
preds['majority'] = evaluate('majority', DummyClassifier(strategy='most_frequent'))
preds['logreg'] = evaluate('logreg', LogisticRegression(max_iter=2000))
preds['mlp'] = evaluate('mlp', MLPClassifier(hidden_layer_sizes=(128,),
                                             max_iter=500, random_state=0))

from sklearn.metrics import confusion_matrix
cm = confusion_matrix(y_test, preds['mlp'])
print('最难分的两类：', np.dstack(np.unravel_index(
    np.argsort(cm - np.diag(np.diag(cm)), axis=None)[-4:], cm.shape))[0])`
        },
        {
          n: 2,
          title: 'MLP 调参与学习曲线',
          tasks: [
            '对隐层宽度 [32, 64, 128, 256] 与层数 [1, 2] 做网格搜索，用 3 折交叉验证选最优。',
            '画学习曲线（样本量 vs 训练/验证分数），判断当前是欠拟合还是过拟合。',
            '比较有无 L2 正则（alpha 参数）与有无早停（early_stopping）对验证分数的影响。',
            '记录每个配置的训练时间，算一张「准确率 / 时间」的性价比表。',
            '选出一个在验证集上最优、且训练时间可接受的配置，冻结它，进入下一步。'
          ],
          starter: `from sklearn.model_selection import GridSearchCV, learning_curve

param_grid = {
    'hidden_layer_sizes': [(32,), (64,), (128,), (256,), (128, 64)],
    'alpha': [1e-4, 1e-2],
}
gs = GridSearchCV(MLPClassifier(max_iter=500, random_state=0),
                  param_grid, cv=3, scoring='f1_macro', n_jobs=-1)
gs.fit(Xtr, y_train)
print('best', gs.best_params_, round(gs.best_score_, 4))

sizes, train_scores, val_scores = learning_curve(
    gs.best_estimator_, Xtr, y_train, cv=3,
    train_sizes=np.linspace(0.1, 1.0, 6), scoring='accuracy')
print('train', train_scores.mean(1).round(3))
print('val  ', val_scores.mean(1).round(3))`,
          hints: [
            '网格搜索本身也会过拟合验证集，所以「最优」只是在这组候选中最好；最终仍要在测试集上只评估一次。',
            '学习曲线里训练分数与验证分数都低 = 欠拟合（加容量/减正则）；训练高验证低且差距大 = 过拟合（加正则/加数据）。',
            'alpha 是 L2 惩罚系数，越大正则越强；early_stopping=True 会从训练集里再切 10% 做监控，样本少时慎用。',
            'n_jobs=-1 会占满所有核，笔记本上可能反而变慢（内存带宽瓶颈），可以试 -1 与 1 的差异。'
          ],
          solution: `best = gs.best_estimator_
print('最优配置：', gs.best_params_)
print('CV macro-F1 = %.4f' % gs.best_score_)
pred = best.predict(Xte)
print('测试 acc = %.4f' % accuracy_score(y_test, pred))
# 学习曲线解读：若最后一点 val 仍在上升，说明加数据还有收益
`
        },
        {
          n: 3,
          title: '误差分析与（可选）CNN 对比',
          tasks: [
            '画混淆矩阵热力图，找出最容易被混淆的两对数字，并各挑 3 张错分样本可视化。',
            '计算每类召回率，找出最差的类，观察它的错误是否集中在某个特定数字上。',
            '用 PCA 把 64 维降到 2 维并着色，观察类别在低维空间是否重叠，解释这与分类难度的关系。',
            '可选：用 PyTorch 训练一个两层卷积 + 全连接的 CNN，比较它与 MLP 的参数量、准确率与训练时间。',
            '写一份 300 字报告：模型弱点、数据问题、下一步最值得做的改进（按性价比排序）。'
          ],
          starter: `import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.metrics import ConfusionMatrixDisplay, recall_score

ConfusionMatrixDisplay.from_predictions(y_test, pred, cmap='Blues')
plt.show()

print('每类召回率')
for k in range(10):
    print(k, round(recall_score(y_test == k, pred == k), 3))

Z = PCA(n_components=2).fit_transform(sc.transform(X))
plt.scatter(Z[:, 0], Z[:, 1], c=y, s=6, cmap='tab10')
plt.title('PCA of digits'); plt.show()

wrong = np.where(pred != y_test)[0][:12]
fig, axes = plt.subplots(3, 4, figsize=(8, 6))
for ax, i in zip(axes.ravel(), wrong):
    ax.imshow(X_test[i].reshape(8, 8), cmap='gray_r')
    ax.set_title('true=%d pred=%d' % (y_test[i], pred[i]))
    ax.axis('off')
plt.show()`,
          hints: [
            '混淆矩阵要按行归一化才看得出「每类被分到哪」；不归一化时样本多的类会主导颜色。',
            '召回率用 recall_score(y_true == k, y_pred == k) 逐个类算，等价于混淆矩阵对角线除以行和。',
            'PCA 二维图里类别重叠是正常的：8×8 像素的类间差异主要在少数几个方向上，降到 2 维必然丢信息。重叠程度可以解释「为什么线性模型也有 95%」。',
            'CNN 的可选实现：Conv2d(1, 32, 3) → ReLU → MaxPool2d(2) → Conv2d(32, 64, 3) → ReLU → MaxPool2d(2) → Flatten → Linear(64*5*5, 10)（MNIST 尺寸）。参数量会比 MLP 少一个量级。'
          ],
          solution: `# 误差分析的结论模板
# 1) 最差类：通常是 8/9、3/5、4/9 这类书写相似的组合
# 2) 错分样本中约有一部分是「人也会看错」的模糊样本，属于标签噪声
# 3) PCA 二维重叠说明类别在像素空间不是线性可分的，但高维近邻结构很好
# 4) 性价比排序：数据增强 > 调容量 > 换 CNN > 集成
print('MLP 参数量约', 64 * 128 + 128 + 128 * 10 + 10)
print('CNN 参数量约', 32 * 1 * 9 + 32 + 64 * 32 * 9 + 64 + 64 * 5 * 5 * 10 + 10)`
        }
      ]
    }
  ]);
})();
