/* =====================================================================
 * data/index.js · 线性代数学习站 · 章节清单（15 个模块）
 * 依据 Gilbert Strang《Introduction to Linear Algebra》5th Edition (2016)
 *   全书 12 章 + Matrix Factorizations / Six Great Theorems 附录 + 公式速查
 *   scope: guide 学习路线 / core 核心章节 / extension 拓展应用 / tool 工具
 * ===================================================================== */
CSC.registerMeta([

  /* ------------------------------ Part I · 向量的语言 ------------------------------ */
  { id: "ch00", num: "00", title: "总览与学习路线", en: "Overview & Study Routes", part: "Part I · 向量的语言", week: 0, minutes: 18, icon: "compass", labs: 1, scope: "guide", weeks: "—", sections: "全书路线", pages: "", ex: 0, blurb: "第一次学线性代数？先读这一页：14 个模块分别在讲什么、按什么顺序读、怎样把「矩阵」看成「向量的变换」", hero: "A\\mathbf{x}=\\mathbf{b}" },
  { id: "ch01", num: "01", title: "向量导论", en: "Introduction to Vectors", part: "Part I · 向量的语言", week: 1, minutes: 48, icon: "vector", labs: 3, scope: "core", weeks: "第 1 周", sections: "§1.1–1.3", pages: "§1.1–1.3", ex: 5, blurb: "向量是线性代数唯一的原材料：怎么相加、怎么数乘、怎么用点积量长度与夹角，最后把一堆向量装进矩阵", hero: "\\mathbf{v}=c_1\\mathbf{v}_1+c_2\\mathbf{v}_2" },
  { id: "ch02", num: "02", title: "解线性方程组", en: "Solving Linear Equations", part: "Part I · 向量的语言", week: 2, minutes: 56, icon: "grid", labs: 3, scope: "core", weeks: "第 2–3 周", sections: "§2.1–2.7", pages: "§2.1–2.7", ex: 7, blurb: "消元法是全书的发动机：行变换把 A 约成 R，解出 Ax=b；再把消元写成矩阵、写成 A=LU 的分解", hero: "A\\mathbf{x}=\\mathbf{b}\\ \\Longrightarrow\\ \\mathbf{x}=A^{-1}\\mathbf{b}" },

  /* ------------------------------ Part II · 子空间与正交 ------------------------------ */
  { id: "ch03", num: "03", title: "向量空间与子空间", en: "Vector Spaces and Subspaces", part: "Part II · 子空间与正交", week: 3, minutes: 55, icon: "layers", labs: 3, scope: "core", weeks: "第 4–5 周", sections: "§3.1–3.5", pages: "§3.1–3.5", ex: 6, blurb: "从「解」升级到「解空间」：列空间、零空间、基与维数，以及那四个基本子空间为什么撑起整本书", hero: "\\dim C(A)+\\dim N(A)=n" },
  { id: "ch04", num: "04", title: "正交性", en: "Orthogonality", part: "Part II · 子空间与正交", week: 4, minutes: 54, icon: "target", labs: 3, scope: "core", weeks: "第 6–7 周", sections: "§4.1–4.4", pages: "§4.1–4.4", ex: 6, blurb: "垂直是矩阵世界里的最短距离：投影、最小二乘、Gram-Schmidt，一条线把「近似解」变成可计算的公式", hero: "\\mathbf{p}=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}\\mathbf{b}" },
  { id: "ch05", num: "05", title: "行列式", en: "Determinants", part: "Part II · 子空间与正交", week: 5, minutes: 42, icon: "chart", labs: 1, scope: "core", weeks: "第 7 周", sections: "§5.1–5.3", pages: "§5.1–5.3", ex: 5, blurb: "一个数就判定了可逆、给出体积缩放：行列式的三条性质、余子式展开，以及 Cramer 法则与逆矩阵公式", hero: "\\det(AB)=\\det(A)\\det(B)" },

  /* ------------------------------ Part III · 特征与分解 ------------------------------ */
  { id: "ch06", num: "06", title: "特征值与特征向量", en: "Eigenvalues and Eigenvectors", part: "Part III · 特征与分解", week: 6, minutes: 58, icon: "star", labs: 2, scope: "core", weeks: "第 8–9 周", sections: "§6.1–6.5", pages: "§6.1–6.5", ex: 7, blurb: "矩阵作用在大多数向量上都会转向，唯独特征向量原地不动、只被拉长；对角化、对称矩阵与正定性都从这里长出来", hero: "A\\mathbf{x}=\\lambda\\mathbf{x}" },
  { id: "ch07", num: "07", title: "奇异值分解", en: "The Singular Value Decomposition", part: "Part III · 特征与分解", week: 7, minutes: 50, icon: "sparkle", labs: 1, scope: "core", weeks: "第 10 周", sections: "§7.1–7.4", pages: "§7.1–7.4", ex: 6, blurb: "任何矩阵都能拆成正交 × 对角 × 正交：SVD 是线性代数的顶点，也是图像压缩、PCA 与推荐系统的引擎", hero: "A=U\\Sigma V^{\\mathsf T}" },
  { id: "ch08", num: "08", title: "线性变换", en: "Linear Transformations", part: "Part III · 特征与分解", week: 8, minutes: 44, icon: "branch", labs: 2, scope: "core", weeks: "第 10–11 周", sections: "§8.1–8.3", pages: "§8.1–8.3", ex: 5, blurb: "矩阵不是数字表格，而是一个动作：旋转、投影、拉伸。换一组基，动作没变，矩阵变了——相似矩阵从这里来", hero: "T(\\mathbf{v})=A\\mathbf{v}\\quad\\Longleftrightarrow\\quad B=M^{-1}AM" },

  /* ------------------------------ Part IV · 复数、应用与数值 ------------------------------ */
  { id: "ch09", num: "09", title: "复向量与复矩阵", en: "Complex Vectors and Matrices", part: "Part IV · 复数、应用与数值", week: 9, minutes: 40, icon: "moon", labs: 1, scope: "extension", weeks: "第 11 周", sections: "§9.1–9.3", pages: "§9.1–9.3", ex: 5, blurb: "把 $i$ 请进来，正交变成酉、对称变成 Hermite；最后一步的通路是快速傅里叶变换 FFT", hero: "e^{i\\theta}=\\cos\\theta+i\\sin\\theta" },
  { id: "ch10", num: "10", title: "应用", en: "Applications", part: "Part IV · 复数、应用与数值", week: 10, minutes: 46, icon: "field", labs: 2, scope: "extension", weeks: "第 12 周", sections: "§10.1–10.7", pages: "§10.1–10.7", ex: 6, blurb: "图与网络、Markov 链、线性规划、傅里叶、计算机图形、密码学——同一套 Ax=b 在不同行业的七种长相", hero: "\\mathbf{x}_{k+1}=P\\mathbf{x}_k" },
  { id: "ch11", num: "11", title: "数值线性代数", en: "Numerical Linear Algebra", part: "Part IV · 复数、应用与数值", week: 11, minutes: 42, icon: "cpu", labs: 1, scope: "extension", weeks: "第 12 周", sections: "§11.1–11.3", pages: "§11.1–11.3", ex: 5, blurb: "真实矩阵有误差：怎样选主元才稳、条件数为什么决定答案的可信度、迭代法怎么在超大规模上求解", hero: "\\kappa(A)=\\lVert A\\rVert\\,\\lVert A^{-1}\\rVert" },
  { id: "ch12", num: "12", title: "概率统计中的线性代数", en: "Linear Algebra in Probability & Statistics", part: "Part IV · 复数、应用与数值", week: 12, minutes: 38, icon: "chart", labs: 1, scope: "extension", weeks: "第 12 周", sections: "§12.1–12.3", pages: "§12.1–12.3", ex: 5, blurb: "均值是投影、协方差是特征值：Prob. = 概率向量，统计里的 PCA 与加权最小二乘全是 4 章和 7 章的直接应用", hero: "\\Sigma=E\\bigl[(\\mathbf{x}-\\mu)(\\mathbf{x}-\\mu)^{\\mathsf T}\\bigr]" },
  { id: "ch13", num: "A", title: "附录：矩阵分解与六大定理", en: "Matrix Factorizations & Six Great Theorems", part: "Part IV · 复数、应用与数值", week: 13, minutes: 26, icon: "book", labs: 1, scope: "tool", weeks: "—", sections: "附录", pages: "Appendix", ex: 4, blurb: "一页看懂全书骨架：A=LU、A=QR、SΛS⁻¹、UΣVᵀ、A=CR 五分解，以及把它们串起来的六大定理", hero: "A=LU=QR=S\\Lambda S^{-1}=U\\Sigma V^{\\mathsf T}" },
  { id: "ch14", num: "F", title: "全书公式速查表", en: "Formula Reference", part: "Part IV · 复数、应用与数值", week: 14, minutes: 20, icon: "formula", labs: 0, scope: "tool", weeks: "—", sections: "全书公式", pages: "—", ex: 0, blurb: "全书公式速查：按主题分组，平时写题和考前都能查；每条配一句「什么时候用 / 最容易错在哪」", hero: "A^{-1}=\\frac{\\operatorname{adj}A}{\\det A}" }
]);
