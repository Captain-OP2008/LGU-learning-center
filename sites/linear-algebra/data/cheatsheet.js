/* =====================================================================
 * data/cheatsheet.js · 线性代数学习站 · 公式速查数据
 * 共 12 组 / 240 条，按学习顺序排列：
 *   向量与点积 → 矩阵运算与逆 → 消元与 LU → 四个子空间与秩 → 正交与投影
 *   → 最小二乘与 QR → 行列式 → 特征值与对角化 → 对称与正定
 *   → SVD 与 PCA → 复数与 FFT → 应用与数值统计
 * 每条 = name（名称）+ tex（纯 LaTeX，不含 $$）+ note（一句话：什么时候用 / 最易错）
 * 记号遵循 CONTRACT §5：\mathbf{v}、A^{\mathsf T}、\lVert、\det、\mathbb{R}^n
 * 数据源：各章正文的公式小结 + 附录（矩阵分解与六大定理）的结论
 * ===================================================================== */
CSC.registerCheat([

  /* ============================ 1. 向量与点积 ============================ */
  { group: '向量与点积', items: [
    { name: '向量加法', tex: '\\mathbf{u}+\\mathbf{v}=(u_1+v_1,\\dots,u_n+v_n)', note: '逐分量相加，两个向量维数必须相同；不是把两列数字接起来' },
    { name: '数乘', tex: 'c\\mathbf{u}=(cu_1,\\dots,cu_n)', note: 'c 为负时方向反转，长度按 |c| 缩放；c=0 得到零向量' },
    { name: '线性组合', tex: 'c_1\\mathbf{v}_1+\\cdots+c_k\\mathbf{v}_k', note: '全书最常见的动作：先数乘再相加，系数可正可负可零' },
    { name: '点积（坐标算法）', tex: '\\mathbf{u}\\cdot\\mathbf{v}=u_1v_1+\\cdots+u_nv_n', note: '最快算法：对应分量相乘再求和；结果是一个数，不是向量' },
    { name: '点积（长度与夹角）', tex: '\\mathbf{u}\\cdot\\mathbf{v}=\\lVert\\mathbf{u}\\rVert\\,\\lVert\\mathbf{v}\\rVert\\cos\\theta', note: '要夹角或长度时用；点积为负说明夹角大于 $90^\\circ$' },
    { name: '长度（范数）', tex: '\\lVert\\mathbf{v}\\rVert=\\sqrt{\\mathbf{v}\\cdot\\mathbf{v}}=\\sqrt{v_1^2+\\cdots+v_n^2}', note: '先平方再开方，结果非负；别把它写成绝对值' },
    { name: '单位向量', tex: '\\mathbf{u}=\\frac{\\mathbf{v}}{\\lVert\\mathbf{v}\\rVert},\\qquad \\lVert\\mathbf{u}\\rVert=1', note: '只改长度不改方向；$\\mathbf{v}=\\mathbf{0}$ 时不能除，单位向量不存在' },
    { name: '夹角余弦', tex: '\\cos\\theta=\\frac{\\mathbf{u}\\cdot\\mathbf{v}}{\\lVert\\mathbf{u}\\rVert\\,\\lVert\\mathbf{v}\\rVert}', note: '求角度先算点积和两个长度；分母为零时没有夹角' },
    { name: '正交判定', tex: '\\mathbf{u}\\perp\\mathbf{v}\\iff\\mathbf{u}\\cdot\\mathbf{v}=0', note: '点积为 0 就是正交，不需要真的画出 $90^\\circ$' },
    { name: '单位向量点积', tex: '\\mathbf{q}_1\\cdot\\mathbf{q}_2=\\cos\\theta', note: '标准正交基里点积只取 0 或 1，这是投影公式好用的原因' },
    { name: '勾股定理（正交情形）', tex: '\\mathbf{u}\\cdot\\mathbf{v}=0\\ \\implies\\ \\lVert\\mathbf{u}+\\mathbf{v}\\rVert^2=\\lVert\\mathbf{u}\\rVert^2+\\lVert\\mathbf{v}\\rVert^2', note: '只在正交时成立；一般情形还要多出交叉项 $2\\mathbf{u}\\cdot\\mathbf{v}$' },
    { name: '点积分配律', tex: '\\mathbf{u}\\cdot(\\mathbf{v}+\\mathbf{w})=\\mathbf{u}\\cdot\\mathbf{v}+\\mathbf{u}\\cdot\\mathbf{w}', note: '点积对加法可以拆开，但对乘法没有结合律' },
    { name: '数乘提出点积', tex: '(c\\mathbf{u})\\cdot\\mathbf{v}=c(\\mathbf{u}\\cdot\\mathbf{v})', note: '常数可以提到点积外面，负号也一样' },
    { name: '自身点积非负', tex: '\\mathbf{v}\\cdot\\mathbf{v}\\ge0,\\qquad \\mathbf{v}\\cdot\\mathbf{v}=0\\iff\\mathbf{v}=\\mathbf{0}', note: '长度平方恒非负，这是 Cauchy–Schwarz 证明的出发点' },
    { name: 'Cauchy–Schwarz 不等式', tex: '\\lvert\\mathbf{u}\\cdot\\mathbf{v}\\rvert\\le\\lVert\\mathbf{u}\\rVert\\,\\lVert\\mathbf{v}\\rVert', note: '估计点积上界时用；等号成立当且仅当两向量共线' },
    { name: '三角不等式', tex: '\\lVert\\mathbf{u}+\\mathbf{v}\\rVert\\le\\lVert\\mathbf{u}\\rVert+\\lVert\\mathbf{v}\\rVert', note: '绕路不会更短；等号成立要求两向量同向' },
    { name: '投影的标量', tex: '\\frac{\\mathbf{u}\\cdot\\mathbf{v}}{\\lVert\\mathbf{u}\\rVert}', note: '$\\mathbf{v}$ 在 $\\mathbf{u}$ 方向上的影子长度，带符号：反向时为负' },
    { name: '投影向量（到直线）', tex: '\\mathbf{p}=\\frac{\\mathbf{u}\\cdot\\mathbf{v}}{\\mathbf{u}\\cdot\\mathbf{u}}\\,\\mathbf{u}', note: '分母是 $\\mathbf{u}\\cdot\\mathbf{u}$，不是 $\\mathbf{u}\\cdot\\mathbf{v}$；写反是最常见的错' },
    { name: '两点距离', tex: '\\lVert\\mathbf{u}-\\mathbf{v}\\rVert', note: '距离就是差向量的长度；平方后展开常用来求最近点' },
    { name: '二维叉积', tex: '\\mathbf{u}\\times\\mathbf{v}=u_1v_2-u_2v_1', note: '二维里它退化成一个数，正负表示旋转方向，绝对值是平行四边形面积' },
    { name: '标准基', tex: '\\mathbf{e}_1=(1,0,\\dots,0),\\ \\dots,\\ \\mathbf{e}_n=(0,\\dots,0,1)', note: '坐标就是这组基下的系数；标准基是最简单的标准正交基' },
    { name: '差的范数展开', tex: '\\lVert\\mathbf{u}-\\mathbf{v}\\rVert^2=\\lVert\\mathbf{u}\\rVert^2-2\\mathbf{u}\\cdot\\mathbf{v}+\\lVert\\mathbf{v}\\rVert^2', note: '证明勾股与正交关系时反复用，别漏掉中间的 $2$' }
  ] },

  /* ============================ 2. 矩阵运算与逆 ============================ */
  { group: '矩阵运算与逆', items: [
    { name: '矩阵乘向量（列组合）', tex: 'A\\mathbf{x}=x_1\\mathbf{a}_1+\\cdots+x_n\\mathbf{a}_n', note: '把 $A\\mathbf{x}$ 看成列的线性组合，这是理解列空间的钥匙' },
    { name: '矩阵乘向量（行点积）', tex: '(A\\mathbf{x})_i=\\sum_{j=1}^{n}a_{ij}x_j', note: '逐行做点积；两种视角结果相同，按题目选方便的那种' },
    { name: '矩阵乘法定义', tex: '(AB)_{ij}=\\sum_{k=1}^{n}a_{ik}b_{kj}', note: '左行右列做点积；$A$ 的列数必须等于 $B$ 的行数' },
    { name: '乘法不交换', tex: 'AB\\ne BA\\quad\\text{（一般情形）}', note: '别随手把 $AB$ 写成 $BA$；只有特殊矩阵（如对角、同特征向量）才可交换' },
    { name: '结合律', tex: '(AB)C=A(BC)', note: '连乘可以任意加括号，计算顺序影响效率、不影响结果' },
    { name: '分配律', tex: 'A(B+C)=AB+AC,\\qquad (A+B)C=AC+BC', note: '展开时注意左右顺序，矩阵乘法不交换' },
    { name: '单位矩阵', tex: 'IA=AI=A', note: '$I$ 的阶数要配得上；它对应"什么都不做"的变换' },
    { name: '转置的乘积', tex: '(AB)^{\\mathsf T}=B^{\\mathsf T}A^{\\mathsf T}', note: '转置要反序，顺序写反是常见错误' },
    { name: '转置再转置', tex: '(A^{\\mathsf T})^{\\mathsf T}=A', note: '转置两次回到原矩阵' },
    { name: '逆的定义', tex: 'AA^{-1}=A^{-1}A=I', note: '逆必须左右都成立；只有方阵才谈逆矩阵' },
    { name: '乘积的逆', tex: '(AB)^{-1}=B^{-1}A^{-1}', note: '求积的逆要反序：先穿袜子再穿鞋，脱的时候反过来' },
    { name: '转置的逆', tex: '(A^{\\mathsf T})^{-1}=(A^{-1})^{\\mathsf T}', note: '转置与求逆可以交换次序' },
    { name: '$2\\times2$ 逆公式', tex: 'A^{-1}=\\frac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}', note: '主对角换位、副对角变号，再除以行列式；$\\det A=0$ 时无逆' },
    { name: '$2\\times2$ 行列式（逆公式的分母）', tex: '\\det A=\\begin{vmatrix}a&b\\\\ c&d\\end{vmatrix}=ad-bc', note: '它就是逆公式的分母；为 0 说明两列成比例' },
    { name: '奇异判定', tex: 'A^{-1}\\ \\text{存在}\\iff\\det A\\ne0', note: '$\\det A=0$ 叫奇异，此时方程组要么无解、要么无穷多解' },
    { name: '对角矩阵的逆', tex: 'D=\\operatorname{diag}(d_1,\\dots,d_n)\\ \\implies\\ D^{-1}=\\operatorname{diag}\\left(\\frac{1}{d_1},\\dots,\\frac{1}{d_n}\\right)', note: '对角元都不能为 0，否则不可逆' },
    { name: '矩阵的幂（定义）', tex: 'A^k=\\underbrace{A\\cdots A}_{k\\ \\text{个}}', note: '只有方阵能自乘；约定 $A^0=I$' },
    { name: '幂的逆', tex: '(A^k)^{-1}=(A^{-1})^k', note: '先求逆再乘 $k$ 次，与先乘再求逆结果一样' },
    { name: '对称矩阵（定义）', tex: 'A^{\\mathsf T}=A', note: '关于主对角线对称；对称矩阵的特征值全为实数' },
    { name: '反对称矩阵', tex: 'A^{\\mathsf T}=-A', note: '对角元必须为 0；奇数阶反对称矩阵的行列式为 0' },
    { name: '乘法维度规则', tex: '(m\\times n)(n\\times p)=(m\\times p)', note: '内维必须相等、结果取外维；动手乘之前先核对维度' },
    { name: '迹', tex: '\\operatorname{tr}(A)=\\sum_{i=1}^{n}a_{ii}', note: '只对方阵定义；迹等于全部特征值之和' },
    { name: '迹的循环性', tex: '\\operatorname{tr}(AB)=\\operatorname{tr}(BA)', note: '只要两个乘积都有定义就成立，可用来快速验算' }
  ] },

  /* ============================ 3. 消元与 LU ============================ */
  { group: '消元与 LU', items: [
    { name: '三种行变换', tex: '\\text{交换两行；一行乘非零数；一行加上另一行的倍数}', note: '这三种操作不改变解集，是消元可用的全部工具' },
    { name: '主元', tex: 'a_{jj}\\ne0\\quad\\text{（消元时的对角元）}', note: '主元为 0 时必须换行；整列都换不出非零主元，该列就是自由变量' },
    { name: '消元乘数', tex: 'l_{ij}=\\frac{a_{ij}}{a_{jj}}', note: '用第 $j$ 行消掉第 $i$ 行的第 $j$ 列；乘数最后原样进入 $L$' },
    { name: '增广矩阵', tex: '[\\,A|\\mathbf{b}\\,]', note: '把右端项接在 $A$ 后面一起做行变换，别只对 $A$ 做' },
    { name: '阶梯形', tex: 'U\\quad\\text{（上三角，主元下方全为 0）}', note: '消元的目标形态；$U$ 的对角元就是主元' },
    { name: '简化行阶梯形', tex: 'R\\quad\\text{（主元为 1，主元所在列其余为 0）}', note: 'RREF 唯一，用来直接读出零空间的基与特解' },
    { name: '秩（主元个数）', tex: 'r=\\operatorname{rank}(A)=\\text{主元个数}', note: '秩是矩阵真正携带的信息量；行秩等于列秩' },
    { name: '自由变量个数', tex: '\\text{自由变量个数}=n-r', note: '每个自由变量对应零空间的一个基向量' },
    { name: 'A=LU 分解', tex: 'A=LU', note: '$L$ 是单位下三角（对角元为 1），$U$ 是消元后的上三角' },
    { name: '$L$ 的元素', tex: 'L_{ij}=l_{ij}\\quad\\text{（消元乘数）}', note: '$L$ 直接记录消元过程，不需要额外计算' },
    { name: '带置换的分解', tex: 'PA=LU', note: '有行交换时必须先乘置换矩阵 $P$，否则 $A=LU$ 不成立' },
    { name: '置换矩阵', tex: 'P\\quad\\text{每行每列恰有一个 1}', note: '$P$ 的作用是重排行；置换矩阵一定可逆' },
    { name: '置换的逆', tex: 'P^{-1}=P^{\\mathsf T}', note: '置换矩阵是正交矩阵，转置就是它的逆' },
    { name: '消元与行列式', tex: '\\det U=\\pm\\det A', note: '行交换变号、行相加不变；所以行列式可以沿着消元过程算' },
    { name: '两步回代', tex: 'L\\mathbf{y}=\\mathbf{b},\\quad U\\mathbf{x}=\\mathbf{y}', note: '先用前代解 $\\mathbf{y}$，再回代解 $\\mathbf{x}$，两步都只做代入' },
    { name: '解的判定流程', tex: '[\\,A|\\mathbf{b}\\,]\\ \\rightarrow\\ [\\,R|\\mathbf{d}\\,]', note: '先化简再判断：无解看最后一列，唯一解看有没有自由变量' },
    { name: 'Gauss–Jordan 求逆', tex: '[\\,A| I\\,]\\ \\rightarrow\\ [\\,I| A^{-1}\\,]', note: '只对可逆矩阵有效；中途主元整列为零说明不可逆' },
    { name: '消元的运算量', tex: '\\sim\\frac{n^3}{3}\\ \\text{次乘法}', note: '大矩阵靠消元；别用伴随矩阵求逆（运算量是阶乘级）' },
    { name: '选主元策略', tex: '\\text{选该列绝对值最大的元素作主元}', note: '数值计算必须选主元，否则舍入误差会被放大' },
    { name: 'LU 的唯一性', tex: 'L\\ \\text{单位下三角},\\ U\\ \\text{上三角}\\ \\implies\\ \\text{分解唯一}', note: '若允许 $L$ 对角元任意，分解就不唯一；本书约定 $L$ 对角元为 1' }
  ] },

  /* ============================ 4. 四个子空间与秩 ============================ */
  { group: '四个子空间与秩', items: [
    { name: '列空间', tex: 'C(A)=\\{A\\mathbf{x}|\\mathbf{x}\\in\\mathbb{R}^n\\}', note: '所有列的线性组合；$A\\mathbf{x}=\\mathbf{b}$ 有解等价于 $\\mathbf{b}$ 在列空间里' },
    { name: '零空间', tex: 'N(A)=\\{\\mathbf{x}| A\\mathbf{x}=\\mathbf{0}\\}', note: '齐次方程的全部解，永远包含零向量' },
    { name: '行空间', tex: 'C(A^{\\mathsf T})\\subseteq\\mathbb{R}^n', note: '$A$ 的行张成的空间；维数也等于 $r$' },
    { name: '左零空间', tex: 'N(A^{\\mathsf T})=\\{\\mathbf{y}| A^{\\mathsf T}\\mathbf{y}=\\mathbf{0}\\}', note: '与列空间正交；判断 $A\\mathbf{x}=\\mathbf{b}$ 无解时用它' },
    { name: '列空间维数', tex: '\\dim C(A)=r', note: '主元所在的列是列空间的一组基' },
    { name: '零空间维数', tex: '\\dim N(A)=n-r', note: '自由变量的个数就是零空间的维数' },
    { name: '行空间维数', tex: '\\dim C(A^{\\mathsf T})=r', note: '行秩等于列秩，这是"秩"能统一成一个数的原因' },
    { name: '左零空间维数', tex: '\\dim N(A^{\\mathsf T})=m-r', note: '$m$ 是行数，别把它和 $n-r$ 记混' },
    { name: '秩-零化度定理', tex: 'n=r+(n-r)', note: '定义域被"打到列空间"与"压进零空间"两部分分完' },
    { name: '基本定理的正交关系', tex: 'C(A)\\perp N(A^{\\mathsf T}),\\qquad C(A^{\\mathsf T})\\perp N(A)', note: '四个子空间两两正交成对，这是线性代数基本定理的核心' },
    { name: '正交补的维数', tex: '\\dim S+\\dim S^{\\perp}=n', note: '$S$ 与 $S^{\\perp}$ 的维数相加等于全空间维数' },
    { name: '有解的判定', tex: 'A\\mathbf{x}=\\mathbf{b}\\ \\text{有解}\\iff\\mathbf{b}\\in C(A)\\iff\\mathbf{b}\\perp N(A^{\\mathsf T})', note: '两个判据等价；后者只需验证 $\\mathbf{b}$ 与左零空间的基正交' },
    { name: '唯一解', tex: 'r=n\\ \\implies\\ \\text{至多一个解}', note: '没有自由变量，就没有可调的参数' },
    { name: '无穷多解', tex: 'r\\lt n\\ \\implies\\ \\text{有解时必有无穷多解}', note: '零空间非平凡：特解加上任意零空间向量仍是解' },
    { name: '无解', tex: '\\mathbf{b}\\notin C(A)', note: '此时最小二乘给出"最好的近似解"，见第 4 章' },
    { name: '线性无关', tex: 'c_1\\mathbf{v}_1+\\cdots+c_k\\mathbf{v}_k=\\mathbf{0}\\ \\implies\\ c_1=\\cdots=c_k=0', note: '只有全零系数才能凑出零向量；有非零系数就线性相关' },
    { name: '基', tex: '\\text{基}=\\text{线性无关}+\\text{张成该空间}', note: '基不唯一，但维数唯一；写答案要写向量组，不是一个矩阵' },
    { name: '维数', tex: '\\dim V=\\text{基中向量的个数}', note: '维数是空间的属性，与选哪一组基无关' },
    { name: '子空间的三个条件', tex: '\\mathbf{0}\\in S;\\quad \\mathbf{u},\\mathbf{v}\\in S\\Rightarrow\\mathbf{u}+\\mathbf{v}\\in S;\\quad \\mathbf{u}\\in S\\Rightarrow c\\mathbf{u}\\in S', note: '三条缺一不可：过原点、对加法封闭、对数乘封闭' },
    { name: '张成空间', tex: '\\operatorname{span}(\\mathbf{v}_1,\\dots,\\mathbf{v}_k)=\\{\\text{全部线性组合}\\}', note: 'span 是包含这些向量的最小子空间' }
  ] },

  /* ============================ 5. 正交与投影 ============================ */
  { group: '正交与投影', items: [
    { name: '正交', tex: '\\mathbf{u}\\perp\\mathbf{v}\\iff\\mathbf{u}\\cdot\\mathbf{v}=0', note: '正交只要求点积为零，与长度无关' },
    { name: '正交基', tex: '\\mathbf{q}_i\\cdot\\mathbf{q}_j=0\\quad(i\\ne j)', note: '两两正交；坐标用点积就能直接算出来' },
    { name: '标准正交基', tex: '\\mathbf{q}_i\\cdot\\mathbf{q}_j=\\begin{cases}1,&i=j\\\\0,&i\\ne j\\end{cases}', note: '又正交又单位长；此时坐标就是点积 $\\mathbf{x}\\cdot\\mathbf{q}_i$' },
    { name: '正交矩阵', tex: 'Q^{\\mathsf T}Q=I,\\qquad Q^{-1}=Q^{\\mathsf T}', note: '列是标准正交基的方阵；不是所有正交矩阵都对称' },
    { name: '正交矩阵保长度', tex: '\\lVert Q\\mathbf{x}\\rVert=\\lVert\\mathbf{x}\\rVert', note: '旋转与镜像不改变长度，这是正交变换的几何含义' },
    { name: '正交矩阵保点积', tex: '(Q\\mathbf{u})\\cdot(Q\\mathbf{v})=\\mathbf{u}\\cdot\\mathbf{v}', note: '正交变换保夹角，所以也保形状' },
    { name: '正交矩阵的行列式', tex: '\\det Q=\\pm1', note: '$+1$ 是旋转，$-1$ 含镜像；绝对值一定是 1' },
    { name: '投影到直线的矩阵', tex: 'P=\\frac{\\mathbf{a}\\mathbf{a}^{\\mathsf T}}{\\mathbf{a}^{\\mathsf T}\\mathbf{a}}', note: '分子是矩阵 $\\mathbf{a}\\mathbf{a}^{\\mathsf T}$，分母是数 $\\mathbf{a}^{\\mathsf T}\\mathbf{a}$，别写反' },
    { name: '投影到子空间的矩阵', tex: 'P=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}', note: '要求 $A$ 的列线性无关，否则 $A^{\\mathsf T}A$ 不可逆' },
    { name: '投影矩阵的幂等性', tex: 'P^2=P', note: '投影两次等于投影一次；这是判断"是不是投影矩阵"的第一条' },
    { name: '投影矩阵的对称性', tex: 'P^{\\mathsf T}=P', note: '正交投影才对称；斜投影只幂等、不对称' },
    { name: '投影到正交补', tex: 'I-P\\ \\text{也是投影矩阵}', note: '$P$ 与 $I-P$ 把空间分成互相垂直的两块' },
    { name: '误差向量正交', tex: '\\mathbf{e}=\\mathbf{b}-\\mathbf{p},\\qquad A^{\\mathsf T}\\mathbf{e}=\\mathbf{0}', note: '误差垂直于列空间，这是最小二乘正规方程的来源' },
    { name: '投影分解', tex: '\\mathbf{b}=\\mathbf{p}+\\mathbf{e},\\qquad \\mathbf{p}\\in C(A),\\ \\mathbf{e}\\in N(A^{\\mathsf T})', note: '任何向量都能唯一拆成"列空间分量 + 正交分量"' },
    { name: 'Gram–Schmidt 第一步', tex: '\\mathbf{q}_1=\\frac{\\mathbf{a}_1}{\\lVert\\mathbf{a}_1\\rVert}', note: '第一个向量直接单位化；$\\mathbf{a}_1=\\mathbf{0}$ 时无法开始' },
    { name: 'Gram–Schmidt 第二步', tex: '\\mathbf{q}_2=\\frac{\\mathbf{a}_2-(\\mathbf{a}_2\\cdot\\mathbf{q}_1)\\mathbf{q}_1}{\\lVert\\mathbf{a}_2-(\\mathbf{a}_2\\cdot\\mathbf{q}_1)\\mathbf{q}_1\\rVert}', note: '先减去在 $\\mathbf{q}_1$ 上的投影，再单位化；顺序不能反' },
    { name: 'Gram–Schmidt 一般式', tex: '\\mathbf{q}_k=\\frac{\\mathbf{a}_k-\\sum_{j\\lt k}(\\mathbf{a}_k\\cdot\\mathbf{q}_j)\\mathbf{q}_j}{\\lVert\\mathbf{a}_k-\\sum_{j\\lt k}(\\mathbf{a}_k\\cdot\\mathbf{q}_j)\\mathbf{q}_j\\rVert}', note: '每次减去前面所有方向上的投影；分母为零说明原向量组线性相关' },
    { name: '正交补', tex: 'S^{\\perp}=\\{\\mathbf{x}|\\mathbf{x}\\cdot\\mathbf{s}=0\\ \\text{对一切}\\ \\mathbf{s}\\in S\\}', note: '与整个子空间垂直，不是只与其中一个向量垂直' },
    { name: '正交矩阵的乘积', tex: 'Q_1Q_2\\ \\text{仍为正交矩阵}', note: '连续做两次旋转/镜像，还是正交变换' }
  ] },

  /* ============================ 6. 最小二乘与 QR ============================ */
  { group: '最小二乘与 QR', items: [
    { name: '最小二乘的目标', tex: '\\min_{\\mathbf{x}}\\ \\lVert A\\mathbf{x}-\\mathbf{b}\\rVert^2', note: '方程无解时退一步，让误差平方和最小' },
    { name: '正规方程', tex: 'A^{\\mathsf T}A\\hat{\\mathbf{x}}=A^{\\mathsf T}\\mathbf{b}', note: '把原方程两边左乘 $A^{\\mathsf T}$ 得到；这是最小二乘的核心方程' },
    { name: '最小二乘解', tex: '\\hat{\\mathbf{x}}=(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}\\mathbf{b}', note: '要求 $A$ 的列线性无关；此时 $A^{\\mathsf T}A$ 对称正定、可逆' },
    { name: '残差', tex: '\\mathbf{e}=\\mathbf{b}-A\\hat{\\mathbf{x}}', note: '残差不是零向量——它垂直于列空间，而不是等于零' },
    { name: '残差正交条件', tex: 'A^{\\mathsf T}\\mathbf{e}=\\mathbf{0}', note: '这是正规方程的几何版本：误差与每一列都正交' },
    { name: '拟合直线的设计矩阵', tex: 'A=\\begin{bmatrix}1&t_1\\\\1&t_2\\\\\\vdots&\\vdots\\\\1&t_m\\end{bmatrix},\\qquad \\mathbf{x}=\\begin{bmatrix}C\\\\ D\\end{bmatrix}', note: '第一列全 1 对应截距；列线性无关当且仅当 $t_i$ 不全相等' },
    { name: '拟合直线的正规方程', tex: '\\begin{bmatrix}m&\\sum t_i\\\\\\sum t_i&\\sum t_i^2\\end{bmatrix}\\begin{bmatrix}C\\\\ D\\end{bmatrix}=\\begin{bmatrix}\\sum y_i\\\\\\sum t_iy_i\\end{bmatrix}', note: '手算拟合直线时直接用这张 $2\\times2$ 方程，不用先算矩阵乘' },
    { name: '投影到列空间', tex: '\\hat{\\mathbf{b}}=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}\\mathbf{b}', note: '最小二乘解代入 $A\\mathbf{x}$ 就得到 $\\mathbf{b}$ 在列空间上的投影' },
    { name: 'QR 分解', tex: 'A=QR', note: '$Q$ 的列标准正交，$R$ 是上三角且对角元为正（列满秩时）' },
    { name: 'Q 与 R 的形状', tex: 'A_{m\\times n}=Q_{m\\times n}R_{n\\times n}\\quad(m\\ge n)', note: '经济型 QR；完整 QR 里 $Q$ 是 $m\\times m$ 方阵' },
    { name: '用 QR 解最小二乘', tex: 'R\\hat{\\mathbf{x}}=Q^{\\mathsf T}\\mathbf{b}', note: '比解正规方程更稳，因为不用算 $A^{\\mathsf T}A$（条件数会平方）' },
    { name: 'R 的对角元', tex: 'R_{kk}=\\lVert\\mathbf{a}_k-\\text{（前面方向上的投影）}\\rVert', note: '就是 Gram–Schmidt 里没单位化之前的长度；某个对角元为 0 说明列相关' },
    { name: '条件数的平方关系', tex: '\\operatorname{cond}(A^{\\mathsf T}A)=\\operatorname{cond}(A)^2', note: '这是"别用正规方程"的定量理由：误差放大倍数被平方了' },
    { name: '加权最小二乘', tex: '(A^{\\mathsf T}WA)\\hat{\\mathbf{x}}=A^{\\mathsf T}W\\mathbf{b}', note: '$W$ 是对角权重矩阵，权重大表示更相信那个数据点' },
    { name: '投影矩阵的秩', tex: '\\operatorname{rank}(P)=r=\\operatorname{rank}(A)', note: '投影矩阵把整个空间压到 $r$ 维的列空间上' },
    { name: '最小二乘的几何图像', tex: '\\mathbf{b}=\\hat{\\mathbf{b}}+\\mathbf{e},\\qquad \\hat{\\mathbf{b}}\\perp\\mathbf{e}', note: '垂足就是最优解；把图画出来，正规方程就不用背' }
  ] },

  /* ============================ 7. 行列式 ============================ */
  { group: '行列式', items: [
    { name: '二阶行列式（展开）', tex: '\\det\\begin{bmatrix}a&b\\\\ c&d\\end{bmatrix}=ad-bc', note: '主对角相乘减副对角相乘；逆公式的分母就是它' },
    { name: '$3\\times3$ 行列式（展开）', tex: '\\det A=a_{11}(a_{22}a_{33}-a_{23}a_{32})-a_{12}(a_{21}a_{33}-a_{23}a_{31})+a_{13}(a_{21}a_{32}-a_{22}a_{31})', note: '沿第一行展开，符号是 $+,-,+$；选零多的行更省力' },
    { name: '行列式与体积', tex: '\\lvert\\det A\\rvert=\\text{平行六面体的体积}', note: '二维是平行四边形面积；负号只表示定向翻转' },
    { name: '单位矩阵的行列式', tex: '\\det I=1', note: '单位立方体体积为 1，这是一切缩放的基准' },
    { name: '交换两行', tex: '\\text{交换两行}\\ \\implies\\ \\det\\ \\text{变号}', note: '只要换了行，结果就要乘 $-1$；漏符号是最常见的错' },
    { name: '一行乘常数', tex: '\\text{某行乘}\\ c\\ \\implies\\ \\det\\ \\text{乘}\\ c', note: '只有一行乘 $c$ 才提出 $c$；整个矩阵乘 $c$ 要提 $c^n$' },
    { name: '行相加不变', tex: '\\text{一行加上另一行的倍数}\\ \\implies\\ \\det\\ \\text{不变}', note: '这条是消元能用来算行列式的理由' },
    { name: '乘积的行列式', tex: '\\det(AB)=\\det A\\,\\det B', note: '先乘再取行列式，等于分别取行列式再乘' },
    { name: '逆的行列式', tex: '\\det(A^{-1})=\\frac{1}{\\det A}', note: '由 $\\det A\\det A^{-1}=\\det I=1$ 直接得到' },
    { name: '转置的行列式', tex: '\\det(A^{\\mathsf T})=\\det A', note: '行列式对行与列一视同仁' },
    { name: '数乘整个矩阵', tex: '\\det(cA)=c^{n}\\det A', note: '$n$ 是阶数；$2\\times2$ 时提 $c^2$，不是 $c$' },
    { name: '三角矩阵的行列式', tex: '\\det U=u_{11}u_{22}\\cdots u_{nn}', note: '上三角、下三角、对角都适用：对角元相乘' },
    { name: '奇异与行列式', tex: '\\det A=0\\iff A\\ \\text{奇异}', note: '行列式为 0 说明列线性相关、体积被压扁' },
    { name: '余子式展开', tex: '\\det A=\\sum_{j=1}^{n}(-1)^{1+j}a_{1j}M_{1j}', note: '沿任意一行或一列展开都行；符号按位置交替' },
    { name: '代数余子式', tex: 'C_{ij}=(-1)^{i+j}M_{ij}', note: '把余子式乘上棋盘符号；写伴随矩阵时要用它' },
    { name: '伴随矩阵求逆', tex: 'A^{-1}=\\frac{\\operatorname{adj}A}{\\det A}', note: '$\\operatorname{adj}A$ 是代数余子式矩阵的转置；只适合手算小矩阵' },
    { name: 'Cramer 法则', tex: 'x_i=\\frac{\\det A_i}{\\det A}', note: '$A_i$ 是把第 $i$ 列换成 $\\mathbf{b}$；$\\det A=0$ 时不能用' },
    { name: 'Sarrus 法则', tex: '\\text{三条主对角线之和}-\\text{三条副对角线之和}', note: '只对 $3\\times3$ 有效，$4\\times4$ 以上不能用' },
    { name: '行列式与特征值', tex: '\\det A=\\lambda_1\\lambda_2\\cdots\\lambda_n', note: '特征值之积等于行列式；有一个零特征值就不可逆' },
    { name: 'Leibniz 公式', tex: '\\det A=\\sum_{\\sigma}(-1)^{\\sigma}a_{1\\sigma(1)}a_{2\\sigma(2)}\\cdots a_{n\\sigma(n)}', note: '理论证明用：$n!$ 项，每项从每行每列各取一个元素' }
  ] },

  /* ============================ 8. 特征值与对角化 ============================ */
  { group: '特征值与对角化', items: [
    { name: '特征值方程', tex: 'A\\mathbf{x}=\\lambda\\mathbf{x},\\qquad \\mathbf{x}\\ne\\mathbf{0}', note: '特征向量被矩阵作用后方向不变，只被拉伸 $\\lambda$ 倍' },
    { name: '特征多项式', tex: '\\det(A-\\lambda I)=0', note: '解这个方程得到全部特征值；$n$ 阶矩阵有 $n$ 个（含重根）' },
    { name: '特征向量求法', tex: '(A-\\lambda I)\\mathbf{x}=\\mathbf{0}', note: '把每个 $\\lambda$ 代回去解零空间；别把零向量当特征向量' },
    { name: '$2\\times2$ 特征值公式', tex: '\\lambda=\\frac{\\operatorname{tr}A\\pm\\sqrt{(\\operatorname{tr}A)^2-4\\det A}}{2}', note: '只对 $2\\times2$ 好用；判别式为负时特征值是共轭复数' },
    { name: '迹等于特征值之和', tex: '\\operatorname{tr}(A)=\\lambda_1+\\cdots+\\lambda_n', note: '快速验算：算出的特征值加起来应等于迹' },
    { name: '行列式等于特征值之积', tex: '\\det(A)=\\lambda_1\\lambda_2\\cdots\\lambda_n', note: '另一个验算工具；有零特征值就不可逆' },
    { name: '对角化', tex: 'A=S\\Lambda S^{-1}', note: '$S$ 的列是特征向量，$\\Lambda$ 的对角元是对应特征值' },
    { name: '可对角化的条件', tex: '\\text{有 } n \\text{ 个线性无关的特征向量}', note: '重特征值可能凑不够向量；这时只能退到 Jordan 形' },
    { name: '矩阵的幂', tex: 'A^{k}=S\\Lambda^{k}S^{-1}', note: '对角化最大的用处：把矩阵幂变成对角元的幂' },
    { name: '相似矩阵', tex: 'B=M^{-1}AM', note: '换一组基，同一个变换的矩阵变成 $B$；$B$ 与 $A$ 相似' },
    { name: '相似不变量', tex: '\\operatorname{tr},\\ \\det,\\ \\text{特征多项式}', note: '相似矩阵的迹、行列式、特征值都相同；矩阵本身不同' },
    { name: '不同特征值的特征向量', tex: '\\lambda_i\\ne\\lambda_j\\ \\implies\\ \\mathbf{x}_i,\\mathbf{x}_j\\ \\text{线性无关}', note: '不同特征值对应的特征向量自动无关，这是可对角化的充分条件之一' },
    { name: '三角矩阵的特征值', tex: '\\lambda_i=a_{ii}', note: '三角矩阵的特征值就是对角元，不用解特征方程' },
    { name: '零空间与特征值 0', tex: '\\lambda=0\\iff A\\ \\text{奇异}', note: '$\\lambda=0$ 的特征向量就是零空间里的非零向量' },
    { name: '特征值的移位', tex: 'A-cI\\ \\text{的特征值是}\\ \\lambda-c', note: '特征向量不变；常用来把谱平移到原点附近' },
    { name: '微分方程组的解', tex: '\\frac{d\\mathbf{u}}{dt}=A\\mathbf{u}\\ \\implies\\ \\mathbf{u}(t)=e^{At}\\mathbf{u}(0)', note: '把初值按特征向量拆开，每一项各自按 $e^{\\lambda t}$ 增长或衰减' },
    { name: '矩阵指数', tex: 'e^{At}=Se^{\\Lambda t}S^{-1}', note: '可对角化时最好算；$e^{\\Lambda t}$ 就是对角元取指数' },
    { name: '稳定性判据', tex: '\\operatorname{Re}\\lambda_i\\lt0\\ \\text{对一切}\\ i\\ \\implies\\ \\mathbf{u}(t)\\to\\mathbf{0}', note: '所有特征值实部为负，解才衰减到零；有正实部就发散' },
    { name: 'Markov 稳态与特征值 1', tex: 'P\\mathbf{x}=\\mathbf{x}\\iff\\lambda=1', note: '列和为 1 的 Markov 矩阵必有特征值 1，对应稳态分布' },
    { name: 'Cayley–Hamilton 定理', tex: 'p(A)=0,\\qquad p(\\lambda)=\\det(\\lambda I-A)', note: '矩阵满足自己的特征多项式；可用来把高次幂降阶' },
    { name: '特征向量的线性组合', tex: 'A(c_1\\mathbf{x}_1+c_2\\mathbf{x}_2)=c_1\\lambda_1\\mathbf{x}_1+c_2\\lambda_2\\mathbf{x}_2', note: '在每个特征方向上单独缩放，这是"对角化"的白话版' },
    { name: '特征值的几何重数', tex: '\\dim N(A-\\lambda I)\\le\\text{代数重数}', note: '几何重数不够时不可对角化；Jordan 块就是补这个缺口' }
  ] },

  /* ============================ 9. 对称矩阵与正定 ============================ */
  { group: '对称矩阵与正定', items: [
    { name: '对称矩阵', tex: 'A^{\\mathsf T}=A', note: '关于主对角线对称；对称矩阵一定可以正交对角化' },
    { name: '谱定理', tex: 'A=A^{\\mathsf T}\\ \\implies\\ A=Q\\Lambda Q^{\\mathsf T}', note: '$Q$ 的列是标准正交特征向量；这是全书最优美的结论' },
    { name: '对称矩阵的特征值', tex: '\\lambda_i\\in\\mathbb{R}', note: '对称矩阵不会出现复特征值，这是它好用的根本原因' },
    { name: '对称矩阵的特征向量', tex: '\\lambda_i\\ne\\lambda_j\\ \\implies\\ \\mathbf{q}_i\\perp\\mathbf{q}_j', note: '不同特征值的特征向量自动正交；重根时再做 Gram–Schmidt' },
    { name: '二次型', tex: 'Q(\\mathbf{x})=\\mathbf{x}^{\\mathsf T}A\\mathbf{x}=\\sum_{i,j}a_{ij}x_ix_j', note: '二次型只由 $A$ 的对称部分决定，所以总可以先对称化' },
    { name: '正定的定义', tex: '\\mathbf{x}^{\\mathsf T}A\\mathbf{x}\\gt0\\quad\\text{对一切}\\ \\mathbf{x}\\ne\\mathbf{0}', note: '严格大于零；等于零允许非零向量时只是半正定' },
    { name: '正定与特征值', tex: 'A\\ \\text{正定}\\iff\\lambda_i\\gt0\\ \\text{对一切}\\ i', note: '最快判据（能算出特征值时）；只对方阵对称矩阵谈正定' },
    { name: '正定与主子式', tex: 'A\\ \\text{正定}\\iff\\text{全部顺序主子式}\\gt0', note: 'Sylvester 判据：不用算特征值，逐阶算行列式即可' },
    { name: '正定与 Cholesky', tex: 'A\\ \\text{正定}\\iff A=R^{\\mathsf T}R\\ (R\\ \\text{可逆})', note: '这是"正定矩阵一定有平方根"的矩阵版本' },
    { name: '半正定', tex: '\\mathbf{x}^{\\mathsf T}A\\mathbf{x}\\ge0', note: '允许存在非零零空间；$A^{\\mathsf T}A$ 一定半正定' },
    { name: '$2\\times2$ 正定判据', tex: 'a\\gt0,\\qquad ac-b^2\\gt0', note: '先看左上角，再看行列式；两个条件都满足才正定' },
    { name: '配方判正定', tex: '\\mathbf{x}^{\\mathsf T}A\\mathbf{x}=a\\left(x_1+\\frac{b}{a}x_2\\right)^2+\\left(c-\\frac{b^2}{a}\\right)x_2^2', note: '配方后看每个平方项的系数是否都为正' },
    { name: '主轴定理', tex: '\\mathbf{x}^{\\mathsf T}A\\mathbf{x}=\\lambda_1y_1^2+\\cdots+\\lambda_ny_n^2', note: '换到特征向量坐标系，二次型变成纯平方和' },
    { name: '能量函数', tex: 'E(\\mathbf{x})=\\frac12\\mathbf{x}^{\\mathsf T}A\\mathbf{x}-\\mathbf{b}^{\\mathsf T}\\mathbf{x}', note: '$A$ 正定时 $E$ 的最小值点就是 $A\\mathbf{x}=\\mathbf{b}$ 的解' },
    { name: '正定的逆', tex: 'A\\ \\text{正定}\\ \\implies\\ A^{-1}\\ \\text{正定}', note: '逆的特征值是 $1/\\lambda_i$，仍全为正' },
    { name: '对称矩阵的秩', tex: '\\operatorname{rank}(A)=\\text{非零特征值的个数}', note: '对称矩阵可对角化，所以秩就是非零特征值的个数' },
    { name: '惯性定理', tex: '\\text{正、负特征值的个数在合同变换下不变}', note: '只看符号不看大小；这是二次型分类的依据' },
    { name: '$A^{\\mathsf T}A$ 半正定', tex: '\\mathbf{x}^{\\mathsf T}A^{\\mathsf T}A\\mathbf{x}=\\lVert A\\mathbf{x}\\rVert^2\\ge0', note: '一行就证完；列满秩时它还是正定的' },
    { name: '协方差矩阵半正定', tex: '\\Sigma=E[(\\mathbf{x}-\\mu)(\\mathbf{x}-\\mu)^{\\mathsf T}]', note: '期望是二次型，所以一定对称半正定；特征值就是各主方向的方差' },
    { name: 'Cholesky 分解', tex: 'A=LL^{\\mathsf T}', note: '$L$ 是下三角；正定矩阵的"LU 分解"可以更省一半计算' }
  ] },

  /* ============================ 10. SVD 与 PCA ============================ */
  { group: 'SVD 与 PCA', items: [
    { name: '奇异值分解', tex: 'A=U\\Sigma V^{\\mathsf T}', note: '任意矩阵都能这样拆：正交 × 对角 × 正交，不要求方阵或对称' },
    { name: '奇异值', tex: '\\sigma_i=\\sqrt{\\lambda_i(A^{\\mathsf T}A)}', note: '奇异值非负，按从大到小排；$A^{\\mathsf T}A$ 的特征值开方' },
    { name: '右奇异向量', tex: 'A^{\\mathsf T}A\\mathbf{v}_i=\\sigma_i^2\\mathbf{v}_i', note: '$V$ 的列是 $A^{\\mathsf T}A$ 的特征向量（输入方向）' },
    { name: '左奇异向量', tex: 'AA^{\\mathsf T}\\mathbf{u}_i=\\sigma_i^2\\mathbf{u}_i', note: '$U$ 的列是 $AA^{\\mathsf T}$ 的特征向量（输出方向）' },
    { name: 'U 与 V 的配对', tex: 'A\\mathbf{v}_i=\\sigma_i\\mathbf{u}_i', note: '右奇异向量被 $A$ 送到左奇异向量，缩放倍数就是奇异值' },
    { name: '秩 1 展开', tex: 'A=\\sigma_1\\mathbf{u}_1\\mathbf{v}_1^{\\mathsf T}+\\cdots+\\sigma_r\\mathbf{u}_r\\mathbf{v}_r^{\\mathsf T}', note: '把矩阵拆成一叠秩 1 的"薄片"，按奇异值从大到小叠' },
    { name: '秩与奇异值', tex: '\\operatorname{rank}(A)=\\text{非零奇异值的个数}', note: '数值上"接近零"的奇异值通常也算零' },
    { name: '条件数（奇异值形式）', tex: '\\operatorname{cond}(A)=\\frac{\\sigma_{\\max}}{\\sigma_{\\min}}', note: '条件数大 = 病态：输入的微小误差会被放大很多倍' },
    { name: '伪逆', tex: 'A^{+}=V\\Sigma^{+}U^{\\mathsf T}', note: '$\\Sigma^{+}$ 把非零奇异值取倒数；不可逆时也能求"最接近的逆"' },
    { name: '用伪逆解方程', tex: '\\hat{\\mathbf{x}}=A^{+}\\mathbf{b}', note: '最小范数最小二乘解；列满秩时它就是普通最小二乘解' },
    { name: 'Eckart–Young 定理', tex: 'A_k=\\sum_{i=1}^{k}\\sigma_i\\mathbf{u}_i\\mathbf{v}_i^{\\mathsf T}', note: '$A_k$ 是秩不超过 $k$ 的矩阵里离 $A$ 最近的一个' },
    { name: '谱范数', tex: '\\lVert A\\rVert_2=\\sigma_{\\max}', note: '矩阵能把向量拉长多少倍的上界' },
    { name: 'Frobenius 范数', tex: '\\lVert A\\rVert_F=\\sqrt{\\sum_{i,j}a_{ij}^2}=\\sqrt{\\sigma_1^2+\\cdots+\\sigma_r^2}', note: '全部元素平方和开方；也等于奇异值平方和开方' },
    { name: '低秩近似的误差', tex: '\\lVert A-A_k\\rVert_2=\\sigma_{k+1}', note: '截断到 $k$ 项后，误差正好等于下一个奇异值' },
    { name: 'PCA 的协方差', tex: '\\Sigma=\\frac{1}{m-1}X^{\\mathsf T}X', note: '$X$ 的行是样本、列是特征；先中心化再算协方差' },
    { name: 'PCA 的主方向', tex: '\\Sigma\\mathbf{v}_i=\\lambda_i\\mathbf{v}_i', note: '最大特征值对应的特征向量就是第一主成分方向' },
    { name: '方差解释比例', tex: '\\frac{\\lambda_1+\\cdots+\\lambda_k}{\\lambda_1+\\cdots+\\lambda_n}', note: '保留前 $k$ 个主成分能解释多少信息；常用 90% 或 95% 作阈值' },
    { name: '图像压缩', tex: 'A\\approx\\sum_{i=1}^{k}\\sigma_i\\mathbf{u}_i\\mathbf{v}_i^{\\mathsf T}\\quad(k\\lt r)', note: '存 $k(m+n+1)$ 个数代替 $mn$ 个；$k$ 越小压得越狠、越模糊' },
    { name: 'SVD 与四个子空间', tex: 'C(A)=\\operatorname{span}(\\mathbf{u}_1,\\dots,\\mathbf{u}_r),\\quad N(A)=\\operatorname{span}(\\mathbf{v}_{r+1},\\dots,\\mathbf{v}_n)', note: 'SVD 一次给出四个子空间的标准正交基，这是它的另一层价值' },
    { name: '奇异值的稳定性', tex: '\\lvert\\sigma_i(A+E)-\\sigma_i(A)\\rvert\\le\\lVert E\\rVert_2', note: '奇异值对扰动不敏感，这是 SVD 在数值计算里可靠的原因' }
  ] },

  /* ============================ 11. 复数与 FFT ============================ */
  { group: '复数与 FFT', items: [
    { name: '复数', tex: 'z=a+bi,\\qquad i^2=-1', note: '$a$ 是实部、$b$ 是虚部；复数平面上的点就是向量' },
    { name: '复共轭', tex: '\\bar z=a-bi', note: '虚部变号；$z\\bar z$ 是实数' },
    { name: '复数的模', tex: '\\lvert z\\rvert=\\sqrt{a^2+b^2}=\\sqrt{z\\bar z}', note: '模是长度，恒非负；乘法时模相乘' },
    { name: '欧拉公式', tex: 'e^{i\\theta}=\\cos\\theta+i\\sin\\theta', note: '把指数与旋转接起来；复数的极坐标写法全靠它' },
    { name: '复数的极形式', tex: 'z=re^{i\\theta},\\qquad r=\\lvert z\\rvert', note: '乘法变成模相乘、角相加，比直角坐标快' },
    { name: '复内积', tex: '\\mathbf{u}^{\\mathsf H}\\mathbf{v}=\\bar u_1v_1+\\cdots+\\bar u_nv_n', note: '第一个向量要取共轭；不取的话"长度"可能不是实数' },
    { name: '共轭转置', tex: '(A^{\\mathsf H})_{ij}=\\bar a_{ji}', note: '先转置再取共轭；实矩阵时就是转置' },
    { name: 'Hermite 矩阵', tex: 'A^{\\mathsf H}=A', note: '复版的对称矩阵；对角元必须是实数' },
    { name: '酉矩阵', tex: 'U^{\\mathsf H}U=I,\\qquad U^{-1}=U^{\\mathsf H}', note: '复版的正交矩阵；列是标准正交复向量' },
    { name: '复谱定理', tex: 'A^{\\mathsf H}=A\\ \\implies\\ A=U\\Lambda U^{\\mathsf H}', note: 'Hermite 矩阵的特征值是实数，特征向量可选成标准正交' },
    { name: 'DFT 矩阵', tex: 'F_{jk}=\\frac{1}{\\sqrt n}\\,\\omega^{jk},\\qquad \\omega=e^{-2\\pi i/n}', note: '$j,k$ 从 0 数起；归一化因子让 $F$ 成为酉矩阵' },
    { name: '$\\omega$ 的幂', tex: '\\omega^{n}=1,\\qquad 1+\\omega+\\cdots+\\omega^{n-1}=0', note: '$n$ 次单位根在复平面上均匀分布，加起来正好抵消' },
    { name: '傅里叶基的正交性', tex: '\\mathbf{f}_j^{\\mathsf H}\\mathbf{f}_k=\\begin{cases}1,&j=k\\\\0,&j\\ne k\\end{cases}', note: '所以 DFT 是正交变换，反变换只需取共轭转置' },
    { name: '逆 DFT', tex: 'F^{-1}=F^{\\mathsf H}', note: '正变换与逆变换只差一个共轭，这是酉矩阵的性质' },
    { name: 'FFT 的复杂度', tex: 'O(n\\log n)\\ \\text{代替}\\ O(n^2)', note: '分治把大 DFT 拆成两个小 DFT；$n$ 是 2 的幂时最方便' },
    { name: '循环矩阵的对角化', tex: 'C\\ \\text{循环}\\ \\implies\\ C=F\\Lambda F^{\\mathsf H}', note: '所有循环矩阵被同一组傅里叶基对角化，这是 FFT 能加速卷积的原因' },
    { name: '实信号的共轭对称', tex: '\\mathbf{x}\\ \\text{实}\\ \\implies\\ \\hat x_{n-k}=\\overline{\\hat x_k}', note: '实信号的频谱有一半是冗余的，可以只存一半' }
  ] },

  /* ============================ 12. 应用与数值统计 ============================ */
  { group: '应用与数值统计', items: [
    { name: '图的关联矩阵', tex: 'B_{ij}=\\begin{cases}1,&\\text{边 }j\\text{ 从节点 }i\\text{ 出发}\\\\-1,&\\text{边 }j\\text{ 进入节点 }i\\\\0,&\\text{其他}\\end{cases}', note: '每列只有 $+1$ 与 $-1$；列数等于边数、行数等于节点数' },
    { name: '图拉普拉斯', tex: 'L=B^{\\mathsf T}B', note: '对称半正定；$B$ 的每一列自动与 $\\mathbf{1}$ 正交，所以 $L\\mathbf{1}=\\mathbf{0}$' },
    { name: '拉普拉斯的性质', tex: 'L=L^{\\mathsf T},\\qquad L\\mathbf{1}=\\mathbf{0}', note: '行和为零；常数向量永远在零空间里' },
    { name: '连通分量个数', tex: '\\dim N(B)=\\text{连通分量的个数}', note: '图不连通时关联矩阵的零空间维数大于 1' },
    { name: '弹簧系统', tex: 'K\\mathbf{x}=\\mathbf{f},\\qquad K=B^{\\mathsf T}CB', note: '$C$ 是各弹簧的劲度系数对角阵；$K$ 对称正定（固定端点时）' },
    { name: '基尔霍夫定律', tex: 'A^{\\mathsf T}\\mathbf{y}=\\mathbf{f}', note: '节点电流守恒；$A$ 是回路与边的关联矩阵' },
    { name: 'Markov 矩阵', tex: 'P\\ge0,\\qquad \\mathbf{1}^{\\mathsf T}P=\\mathbf{1}^{\\mathsf T}', note: '每列和为 1（列随机）；元素非负，概率不会跑负' },
    { name: 'Markov 稳态', tex: 'P\\mathbf{x}=\\mathbf{x},\\qquad \\mathbf{x}\\ge0,\\ \\sum_i x_i=1', note: '稳态就是特征值 1 的特征向量；长期分布与初值无关' },
    { name: '线性规划标准形', tex: '\\min\\ \\mathbf{c}^{\\mathsf T}\\mathbf{x}\\quad\\text{s.t.}\\ A\\mathbf{x}=\\mathbf{b},\\ \\mathbf{x}\\ge0', note: '约束是线性方程组加非负条件；最优解在可行域的顶点上' },
    { name: '傅里叶系数', tex: 'a_k=\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi}f(x)\\cos kx\\,dx', note: '傅里叶系数就是函数在基函数上的投影；分母来自基函数长度平方' },
    { name: '旋转矩阵', tex: 'R(\\theta)=\\begin{bmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{bmatrix}', note: '正交矩阵，$\\det R=1$；旋转不改变长度与夹角' },
    { name: '齐次坐标', tex: '\\begin{bmatrix}x\\\\ y\\\\1\\end{bmatrix}\\ \\text{可表示平移}', note: '二维平移不是线性变换，加一维后才写成矩阵乘法' },
    { name: 'Hill 密码', tex: '\\mathbf{c}=A\\mathbf{p}\\bmod 26,\\qquad \\mathbf{p}=A^{-1}\\mathbf{c}\\bmod 26', note: '要求 $\\det A$ 与 26 互素，否则 $A^{-1}$ 在模 26 下不存在' },
    { name: '矩阵的 1-范数', tex: '\\lVert A\\rVert_1=\\max_j\\sum_i\\lvert a_{ij}\\rvert', note: '列绝对值之和的最大值；别和向量的 1-范数混为一谈' },
    { name: '矩阵的 2-范数', tex: '\\lVert A\\rVert_2=\\sigma_{\\max}(A)', note: '最大奇异值；也就是矩阵能把向量拉长到的最大倍数' },
    { name: '矩阵的无穷范数', tex: '\\lVert A\\rVert_\\infty=\\max_i\\sum_j\\lvert a_{ij}\\rvert', note: '行绝对值之和的最大值；和 1-范数一个按列一个按行' },
    { name: '条件数（范数形式）', tex: '\\operatorname{cond}(A)=\\lVert A\\rVert\\,\\lVert A^{-1}\\rVert', note: '衡量"输入误差放大多少倍"；$\\operatorname{cond}\\gg1$ 叫病态' },
    { name: '相对误差界', tex: '\\frac{\\lVert\\Delta\\mathbf{x}\\rVert}{\\lVert\\mathbf{x}\\rVert}\\le\\operatorname{cond}(A)\\,\\frac{\\lVert\\Delta\\mathbf{b}\\rVert}{\\lVert\\mathbf{b}\\rVert}', note: '条件数就是误差放大倍数的上界；它不依赖具体算法' },
    { name: '幂迭代', tex: '\\mathbf{x}_{k+1}=\\frac{A\\mathbf{x}_k}{\\lVert A\\mathbf{x}_k\\rVert}', note: '反复乘 $A$ 会收敛到主特征向量；要求主特征值唯一且绝对值最大' },
    { name: 'QR 迭代', tex: 'A_k=Q_kR_k,\\qquad A_{k+1}=R_kQ_k', note: '每步做一次 QR 分解再交换顺序；$A_k$ 逐渐变成上三角（特征值在对角）' },
    { name: 'Jacobi 迭代', tex: '\\mathbf{x}^{(k+1)}=D^{-1}\\left(\\mathbf{b}-(L+U)\\mathbf{x}^{(k)}\\right)', note: '把 $A$ 拆成 $D+L+U$；对角占优时才保证收敛' },
    { name: '共轭梯度法', tex: '\\text{每步 }O(n)\\text{，至多 }n\\text{ 步精确收敛}', note: '只适用于对称正定矩阵；大规模稀疏系统的主力算法' },
    { name: '均值是投影', tex: '\\bar x=\\frac{1}{n}\\mathbf{1}^{\\mathsf T}\\mathbf{x}', note: '把所有样本投影到全 1 方向上；投影长度除以 $n$ 就是均值' },
    { name: '方差', tex: '\\sigma^2=\\frac{1}{n}\\sum_{i=1}^{n}(x_i-\\bar x)^2', note: '到均值的平均平方距离；开方就是标准差' },
    { name: '多元高斯密度', tex: 'p(\\mathbf{x})=\\frac{1}{(2\\pi)^{n/2}\\sqrt{\\det\\Sigma}}\\exp\\left(-\\frac12(\\mathbf{x}-\\mu)^{\\mathsf T}\\Sigma^{-1}(\\mathbf{x}-\\mu)\\right)', note: '$\\Sigma$ 必须正定；指数里的二次型用 $\\Sigma^{-1}$ 而不是 $\\Sigma$' },
  ] }
]);
