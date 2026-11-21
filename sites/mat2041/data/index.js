/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * title 必须与各章 registerChapter 的 title 逐字一致。
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：从向量到 SVD 的一条主线', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先建立整门课的地图：七章回答什么问题、彼此怎么衔接，以及怎样使用本站。' },
  { id: 'ch01', num: '01', title: '向量、内积与范数：把几何装进代数', en: 'VECTORS, INNER PRODUCTS AND NORMS', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'box', labs: 1,
    blurb: '从点积、长度与夹角出发，证明 Cauchy–Schwarz 与三角不等式，理解正交与投影。' },
  { id: 'ch02', num: '02', title: '线性方程组与高斯消元：解集是一张仿射子空间', en: 'LINEAR SYSTEMS AND GAUSSIAN ELIMINATION', part: 'Part II · 基础', week: 3, minutes: 90, icon: 'layers', labs: 1,
    blurb: '用增广矩阵与 RREF 解方程，分清主元与自由变量，掌握秩判据与通解结构。' },
  { id: 'ch03', num: '03', title: '矩阵代数、逆与 LU：让运算有结构', en: 'MATRIX ALGEBRA, INVERSES AND LU', part: 'Part II · 基础', week: 4, minutes: 100, icon: 'grid', labs: 1,
    blurb: '用四种视角读矩阵乘法，掌握转置、逆、分块求逆与 LU 分解，估算运算量。' },
  { id: 'ch04', num: '04', title: '向量空间、基与四个基本子空间：维数把无限压成有限', en: 'VECTOR SPACES, BASES AND THE FOUR SUBSPACES', part: 'Part III · 深入', week: 5, minutes: 100, icon: 'function', labs: 1,
    blurb: '判断子空间与线性无关，用基与维数描述空间，理清四个基本子空间与秩-零化度。' },
  { id: 'ch05', num: '05', title: '线性变换与基变换：同一个变换，不同的脸', en: 'LINEAR TRANSFORMATIONS AND CHANGE OF BASIS', part: 'Part III · 深入', week: 6, minutes: 100, icon: 'repeat', labs: 1,
    blurb: '把矩阵看成映射，求核与像，用换基矩阵与相似解释同一变换的不同矩阵。' },
  { id: 'ch06', num: '06', title: '行列式与特征值：不变量从哪里来', en: 'DETERMINANTS AND EIGENVALUES', part: 'Part III · 深入', week: 7, minutes: 110, icon: 'target', labs: 1,
    blurb: '从公理与几何意义理解行列式，求特征值与特征向量，判断对角化与正定性。' },
  { id: 'ch07', num: '07', title: '正交性、最小二乘与 SVD：把矩阵拆成三块', en: 'ORTHOGONALITY, LEAST SQUARES AND THE SVD', part: 'Part IV · 综合', week: 8, minutes: 120, icon: 'sparkle', labs: 1,
    blurb: '用正交基做投影与最小二乘，构造 SVD，用奇异值解释四个子空间与低秩近似。' }
]);
