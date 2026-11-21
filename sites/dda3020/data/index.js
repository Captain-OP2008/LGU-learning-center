/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：机器学习在解决什么问题', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：这门课回答什么问题、八章之间怎么衔接、怎样使用本站与讲义。' },
  { id: 'ch01', num: '01', title: '数学基础：概率、线性代数与优化', en: 'PROBABILITY, LINEAR ALGEBRA & OPTIMIZATION', part: 'Part II · 基础', week: 2, minutes: 110, icon: 'function', labs: 1,
    blurb: '把概率、矩阵与梯度这三件工具磨快：期望方差、贝叶斯与最大似然、内积投影、凸性与 KKT。' },
  { id: 'ch02', num: '02', title: '线性回归与逻辑回归', en: 'LINEAR & LOGISTIC REGRESSION', part: 'Part II · 基础', week: 3, minutes: 120, icon: 'chart', labs: 2,
    blurb: '从最小二乘的正规方程走到 sigmoid 与交叉熵，看清平方损失与最大似然是同一条线的两端。' },
  { id: 'ch03', num: '03', title: '支持向量机与核方法', en: 'SVM & KERNEL METHODS', part: 'Part III · 深入', week: 4, minutes: 120, icon: 'target', labs: 2,
    blurb: '最大间隔、对偶与支持向量、软间隔与 hinge、核技巧与 RBF：一条从几何直觉到凸优化的线。' },
  { id: 'ch04', num: '04', title: '决策树与集成学习', en: 'TREE METHODS & ENSEMBLES', part: 'Part III · 深入', week: 5, minutes: 110, icon: 'layers', labs: 2,
    blurb: '用轴对齐的切分逼近任意边界：Gini 与信息增益、剪枝、bagging 降方差、boosting 降偏差。' },
  { id: 'ch05', num: '05', title: '神经网络：从 MLP 到 Transformer', en: 'NEURAL NETWORKS', part: 'Part III · 深入', week: 6, minutes: 130, icon: 'cpu', labs: 2,
    blurb: '反向传播的四个公式、ReLU 与初始化、卷积与池化、LSTM 的门控，以及注意力的 O(n²d)。' },
  { id: 'ch06', num: '06', title: '过拟合、偏差-方差与模型评估', en: 'OVERFITTING, BIAS-VARIANCE & EVALUATION', part: 'Part IV · 综合', week: 7, minutes: 110, icon: 'grid', labs: 2,
    blurb: '把「模型好不好」变成可操作的流程：分解误差、正则与早停、交叉验证、数据泄漏与指标选择。' },
  { id: 'ch07', num: '07', title: '无监督学习：聚类、EM 与 PCA', en: 'UNSUPERVISED LEARNING', part: 'Part IV · 综合', week: 8, minutes: 120, icon: 'sparkle', labs: 2,
    blurb: '没有标签时如何找结构：K-Means 与 Lloyd、GMM 与 EM 的单调性、PCA 的方差最大化与 SVD。' }
]);
