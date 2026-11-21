/* =====================================================================
 * data/ch07.js · 第 7 章 奇异值分解（The Singular Value Decomposition）
 * 主线：任何矩阵都能拆成「正交 × 对角 × 正交」：A = UΣV^T。
 * 特征值只对少数好矩阵有效，SVD 对所有矩阵有效——它是线代真正的顶点。
 * ===================================================================== */
CSC.registerChapter({
  id: "ch07",
  num: "07",
  title: "奇异值分解",
  en: "The Singular Value Decomposition",
  goals: [
    "你能说清 $A=U\\Sigma V^{\\mathsf T}$ 中 $U$、$\\Sigma$、$V$ 各自的尺寸与含义，并解释「任意矩阵 = 正交 × 对角 × 正交」。",
    "你能从 $A^{\\mathsf T}A$ 的特征值与特征向量算出 $\\sigma_i$、$\\mathbf{v}_i$，再用 $\\mathbf{u}_i=A\\mathbf{v}_i/\\sigma_i$ 补出 $U$。",
    "你能写出秩 1 展开 $A=\\sum\\sigma_i\\mathbf{u}_i\\mathbf{v}_i^{\\mathsf T}$，并用它做最佳低秩近似（Eckart–Young）。",
    "你能把 SVD 用在图像压缩与 PCA 上，说清「保留前 $k$ 个奇异值」为什么能压缩、误差是什么。",
    "你能用 SVD 解释单位圆到椭圆的几何图像，并用 $\\sigma_{\\max}/\\sigma_{\\min}$ 判断条件数。",
    "你能用伪逆 $A^{+}=V\\Sigma^{+}U^{\\mathsf T}$ 求最小二乘解，并知道它和条件数的关系。"
  ],
  kp: [
    { id: "ch07-s1", title: "先看一个例子：一张图片的压缩" },
    { id: "ch07-s2", title: "§7.1 用线性代数做图像处理" },
    { id: "ch07-s3", title: "§7.2 SVD 的基与矩阵：$A=U\\Sigma V^{\\mathsf T}$" },
    { id: "ch07-s4", title: "§7.2 从 $A^{\\mathsf T}A$ 与 $AA^{\\mathsf T}$ 求 SVD" },
    { id: "ch07-s5", title: "§7.3 主成分分析 PCA" },
    { id: "ch07-s6", title: "§7.4 SVD 的几何：圆到椭圆" },
    { id: "ch07-s7", title: "§7.4 低秩近似与伪逆" }
  ],
  labIds: ["svd"],
  quizIds: ["ch07-q1", "ch07-q2", "ch07-q3", "ch07-q4", "ch07-q5", "ch07-q6", "ch07-q7"],
  blocks: [
    { t: "scope", scope: "core", weeks: "第 10 周", sections: "§7.1–7.4" },
    { t: "callout", kind: "why", title: "这一章要解决什么问题", html: "<p>你手机里的一张照片，黑白版本就是一个 $1000\\times1000$ 的矩阵：一百万个灰度值。如果原样保存，需要一百万个数字；可你把它发出去时，文件往往只有几十万个字节。图像压缩到底丢掉了什么？</p><p>答案是一组「不重要的方向」。任何矩阵 $A$ 都可以拆成一串秩 1 矩阵的加权和：$A=\\sigma_1\\mathbf{u}_1\\mathbf{v}_1^{\\mathsf T}+\\sigma_2\\mathbf{u}_2\\mathbf{v}_2^{\\mathsf T}+\\cdots$，其中权重 $\\sigma_1\\ge\\sigma_2\\ge\\cdots\\ge0$ 叫<b>奇异值</b>（singular values）。大的 $\\sigma$ 项描绘大轮廓，小的 $\\sigma$ 项只负责细节与噪声。只保留前 $k$ 项，就得到一张几乎一样的图，却只需要存 $k(m+n+1)$ 个数，而不是 $mn$ 个。</p><p>但 SVD 不只是压缩工具。它是<b>任意矩阵</b>的「特征值分解」：对称矩阵可以用一组正交特征向量对角化，一般矩阵没有那么多特征向量，SVD 就用<b>两组</b>正交基代替——一组在输入空间，一组在输出空间。线性代数里几乎所有「这个矩阵好不好、稳不稳、能近似成什么」的问题，都能用这组数回答。这一章要把它拆开看清楚。</p>" },
    { t: "callout", kind: "note", title: "开始前你需要知道", html: "<ul><li><b>对称矩阵与谱定理</b>：知道对称矩阵可以写成 $A=Q\\Lambda Q^{\\mathsf T}$，特征值全实，特征向量正交。SVD 的推导完全建立在这上面，见 <a href='#/ch06'>第 6 章</a>。</li><li><b>正交矩阵</b>：知道 $Q^{\\mathsf T}Q=I$，正交变换不改变长度与角度。见 <a href='#/ch04'>第 4 章</a>。</li><li><b>秩、零空间、列空间</b>：知道 $\\operatorname{rank}(A)$、$N(A)$、$C(A)$ 的定义。SVD 会把这几个子空间的关系画得一清二楚，见 <a href='#/ch03'>第 3 章</a>。</li><li><b>矩阵的 Frobenius 范数</b>：$\\lVert A\\rVert_F=\\sqrt{\\sum a_{ij}^2}$，可以理解成「把矩阵拉直成向量后的长度」。本章用它度量近似误差，不熟也没关系，用到时会解释。</li></ul>" },

    { t: "h", lvl: 2, text: "先看一个例子：一张图片的压缩", id: "ch07-s1" },
    { t: "p", html: "把一张黑白照片读成矩阵 $A$：第 $i$ 行第 $j$ 列的元素 $a_{ij}$ 是第 $i$ 行第 $j$ 列像素的灰度（0 是黑，255 是白）。一张 $1000\\times1000$ 的照片就是一百万个数字。现在做一件看似浪费的事：把这个矩阵做 SVD，拆成" },
    { t: "tex", tex: "A=\\sigma_1\\mathbf{u}_1\\mathbf{v}_1^{\\mathsf T}+\\sigma_2\\mathbf{u}_2\\mathbf{v}_2^{\\mathsf T}+\\cdots+\\sigma_r\\mathbf{u}_r\\mathbf{v}_r^{\\mathsf T}", caption: "秩 1 展开：每一项都是一张「竖条纹 × 横条纹」的图案，权重是奇异值" },
    { t: "p", html: "每一项 $\\mathbf{u}_i\\mathbf{v}_i^{\\mathsf T}$ 是一个秩 1 矩阵：它的每一行都是 $\\mathbf{v}_i^{\\mathsf T}$ 的倍数，每一列都是 $\\mathbf{u}_i$ 的倍数。可以把它想成「竖条纹乘以横条纹」得到的明暗格子，只有一种变化模式。$\\sigma_i$ 是这一项的重要性权重，按从大到小排列。" },
    { t: "p", html: "关键观察：<b>前几个 $\\sigma$ 通常占掉了绝大部分「能量」</b>。一张自然图像的大轮廓，用前几十个模式就能描个八九不离十；后面几百个模式只负责细微纹理。于是可以只保留前 $k$ 项：" },
    { t: "tex", tex: "A_k=\\sigma_1\\mathbf{u}_1\\mathbf{v}_1^{\\mathsf T}+\\cdots+\\sigma_k\\mathbf{u}_k\\mathbf{v}_k^{\\mathsf T}", caption: "截断 SVD：秩不超过 $k$ 的最佳近似（Eckart–Young）" },
    { t: "p", html: "存 $A_k$ 需要多少个数？$k$ 个奇异值，加上 $k$ 个长度为 $m$ 的 $\\mathbf{u}_i$、$k$ 个长度为 $n$ 的 $\\mathbf{v}_i$，共 $k(m+n+1)$ 个数。对 $m=n=1000$、$k=50$，是 $50\\times2001\\approx10$ 万个数，只有原来的一百万的十分之一。而图像看起来几乎没变——因为丢掉的都是 $\\sigma$ 很小的项。" },
    { t: "p", html: "这里已经埋下了本章要回答的三组问题。第一，为什么任意矩阵都能这样拆？第二，为什么按 $\\sigma$ 从大到小截断就是「最佳」近似？第三，这样做的代价是什么、什么时候会出问题？要回答这些，得先弄清 SVD 里三样东西各自是什么。" },
    { t: "quiz", qid: "ch07-q1" },

    { t: "h", lvl: 2, text: "§7.1 用线性代数做图像处理", id: "ch07-s2" },
    { t: "p", html: "把图像当矩阵，不是比喻，而是字面意义上的等价：一张 $m\\times n$ 的灰度图就是一个 $m\\times n$ 矩阵。彩色图像是三张这样的矩阵叠在一起（红、绿、蓝三个通道）。于是对图像做的很多操作，都能翻译成矩阵运算：整体调亮是 $A+cJ$（$J$ 是全 1 矩阵）；反色是 $255J-A$；模糊、锐化是「卷积」，可以写成矩阵乘法；而压缩，就是找一个秩更低的矩阵 $A_k$ 去近似 $A$。" },
    { t: "p", html: "为什么「低秩」等于「可压缩」？矩阵的秩是「独立模式」的个数。一张纯色图片的秩是 1（所有行都成比例）；一张由几条渐变条纹拼成的图，秩也不高；而一张充满随机噪声的图，秩接近满。自然图像之所以能压缩，是因为它在数学上「不随机」：相邻像素高度相关，真正的独立模式远少于像素个数。SVD 给出的 $\\sigma_1\\ge\\sigma_2\\ge\\cdots$ 就是这些模式的强弱排序。" },
    { t: "table", head: ["对象", "大小 / 参数", "含义"], rows: [
      ["原矩阵 $A$", "$mn$ 个数", "完整图像"],
      ["前 $k$ 项 $A_k$", "$k(m+n+1)$ 个数", "压缩后的图像"],
      ["$\\mathbf{u}_i$", "长度 $m$ 的列向量", "第 $i$ 个模式的「竖向轮廓」"],
      ["$\\mathbf{v}_i$", "长度 $n$ 的列向量", "第 $i$ 个模式的「横向轮廓」"],
      ["$\\sigma_i$", "一个非负数", "第 $i$ 个模式的强度（能量）"]
    ], caption: "SVD 压缩的记账方式：每一项只存两个向量与一个数" },
    { t: "p", html: "算一笔具体的账。设 $m=n=1000$，原矩阵要存 $10^6$ 个数；取 $k=50$，压缩后存 $50\\times(1000+1000+1)=100050$ 个数，约为原来的 $10\\%$。若再狠一点取 $k=10$，只要约 $2\\%$，但图像会明显变糊——因为这个尺寸的图像，第 10 到第 50 个模式还承载着不少结构信息。$k$ 取多少，是「压缩比」与「保真度」之间的权衡；Eckart–Young 定理（7.4 节）会告诉你：在秩不超过 $k$ 的所有矩阵里，$A_k$ 是离 $A$ 最近的那一个。" },
    { t: "p", html: "还有一个容易忽略的点：SVD 的「最佳」在谱范数与 Frobenius 范数下都成立；在 Frobenius 范数下，它等价于「所有像素误差的平方和最小」。如果你更在意人眼对某些区域的敏感度，可以给不同像素加权，那就变成加权低秩近似，不再是最佳，但更符合需求。数学给的是「在某个标准下最优」，不是「在所有标准下最优」——这一点在工程里要记牢。" },
    { t: "p", html: "真实图像的奇异值有一个共同特征：<b>衰减很快</b>。自然图像的前几十个奇异值往往就覆盖了总能量的九成以上，从第几百个开始基本只剩噪声。用 $\\sum\\sigma_i^2$ 表示总能量，可以画一条「奇异值谱」曲线：曲线下降得越快，图像越容易被低秩近似。纯噪声图的谱接近平的——每个方向能量差不多，压缩不了。所以「这张图能不能压」用一句话回答：看它的奇异值谱掉得多快。" },
    { t: "p", html: "现实中的图像格式（JPEG、PNG）并没有直接用 SVD：JPEG 用的是离散余弦变换，PNG 用的是无损预测编码，它们比 SVD 快得多。但「低秩近似」的思想到处都在：科学计算里压缩大规模数据矩阵、推荐系统里补全用户–物品评分、机器学习里做降维与去噪。理论上的「最优」与实际中的「够快」，是两套不同的标准；理解 SVD 能让你看懂后者为什么这样设计。" },
    { t: "p", html: "下一节正式把 SVD 的定义写出来。先记住结论的形状：<b>任意 $m\\times n$ 矩阵都能写成「旋转（$V^{\\mathsf T}$）→ 拉伸（$\\Sigma$）→ 旋转（$U$）」</b>。" },

    { t: "h", lvl: 2, text: "§7.2 SVD 的基与矩阵：$A=U\\Sigma V^{\\mathsf T}$", id: "ch07-s3" },
    { t: "p", html: "特征值分解 $A=Q\\Lambda Q^{-1}$ 有两个限制：$A$ 必须是方阵，而且特征向量要够多、够正交。SVD 把这两个限制全部去掉：<b>任意 $m\\times n$ 矩阵</b>都有分解，而且两边的矩阵都是正交的。" },
    { t: "theorem", name: "奇异值分解的存在性", zh: "SVD 定理", rows: [
      { k: "白话", html: "任意矩阵都可以拆成「正交 × 对角 × 正交」；对角线上是非负的奇异值，从大到小排。" },
      { k: "条件", html: "$A$ 是任意 $m\\times n$ 实矩阵，秩为 $r$。" },
      { k: "结论", html: "$A=U\\Sigma V^{\\mathsf T}$，其中 $U$ 是 $m\\times m$ 正交矩阵，$V$ 是 $n\\times n$ 正交矩阵，$\\Sigma$ 是 $m\\times n$ 的「对角」矩阵：$\\sigma_1\\ge\\sigma_2\\ge\\cdots\\ge\\sigma_r\\gt0$，其余元素全为 0。等价地，$A=\\sum_{i=1}^{r}\\sigma_i\\mathbf{u}_i\\mathbf{v}_i^{\\mathsf T}$。" },
      { k: "几何", html: "$V$ 的列 $\\mathbf{v}_1,\\dots,\\mathbf{v}_n$ 是输入空间 $\\mathbb{R}^n$ 的标准正交基，$U$ 的列 $\\mathbf{u}_1,\\dots,\\mathbf{u}_m$ 是输出空间 $\\mathbb{R}^m$ 的标准正交基，并且 $A\\mathbf{v}_i=\\sigma_i\\mathbf{u}_i$。也就是说：$A$ 把第 $i$ 个输入基方向送到第 $i$ 个输出基方向，长度乘 $\\sigma_i$；$i\\gt r$ 的方向被压成 0。" },
      { k: "构造思路", html: "先对对称半正定矩阵 $A^{\\mathsf T}A$ 做谱分解，得到 $\\mathbf{v}_i$ 与 $\\lambda_i=\\sigma_i^2$；再令 $\\mathbf{u}_i=A\\mathbf{v}_i/\\sigma_i$，验证它们两两正交且长度为 1；剩下的 $\\mathbf{u}$ 用 Gram–Schmidt 补成 $\\mathbb{R}^m$ 的完整正交基。" }
    ]},
    { t: "p", html: "逐个符号解释。$U$ 的列叫<b>左奇异向量</b>，生活在输出空间 $\\mathbb{R}^m$ 里；$V$ 的列叫<b>右奇异向量</b>，生活在输入空间 $\\mathbb{R}^n$ 里；$\\Sigma$ 与 $A$ 同尺寸，只有前 $r$ 个对角元非零，它们就是<b>奇异值</b> $\\sigma_i$。注意 $\\sigma_i$ 按从大到小排，这个顺序不是随便定的——它决定了「截断时先丢谁」。$r$ 是 $A$ 的秩，也是非零奇异值的个数。用大白话说：<b>$A$ 把输入空间的一组正交方向，送到输出空间的一组正交方向，每个方向配一个拉伸倍数 $\\sigma_i$；倍数小的方向贡献小，可以被截掉</b>。" },
    { t: "p", html: "当 $A$ 的秩远小于 $\\min(m,n)$ 时，$\\Sigma$ 里大部分是 0，用完整的 $U$、$V$ 很浪费。这时用<b>经济型 SVD</b>（reduced SVD）：只保留前 $r$ 个奇异值与对应的向量，" },
    { t: "tex", tex: "A=U_r\\Sigma_r V_r^{\\mathsf T},\\qquad U_r\\in\\mathbb{R}^{m\\times r},\\ \\Sigma_r\\in\\mathbb{R}^{r\\times r},\\ V_r\\in\\mathbb{R}^{n\\times r}", caption: "经济型 SVD：只保留非零奇异值对应的部分，存储更省" },
    { t: "p", html: "若再截到前 $k$ 项（$k\\lt r$），就得到前面定义的 $A_k$。经济型与截断型的区别要分清：前者是<b>精确</b>的（丢掉的全是零奇异值），后者是<b>近似</b>的（丢掉的是小但非零的奇异值）。很多软件默认返回经济型，做图像压缩时再手动截断。" },
    { t: "p", html: "秩 1 展开还有一个漂亮的读法：$A$ 的每一列都是 $\\mathbf{u}_1,\\dots,\\mathbf{u}_r$ 的线性组合，系数由 $\\sigma_i\\mathbf{v}_i$ 给出；每一行则是 $\\mathbf{v}_1,\\dots,\\mathbf{v}_r$ 的组合。所以「秩 $r$」意味着：<b>整个矩阵只用了 $r$ 组「竖模式 × 横模式」，别的内容都是这 $r$ 组的叠加</b>。图像压缩、推荐系统、降噪，本质上都是在减少这个 $r$。" },
    { t: "p", html: "SVD 还顺便把第 3 章的「四个基本子空间」一次性摊开。$V$ 的前 $r$ 列 $\\mathbf{v}_1,\\dots,\\mathbf{v}_r$ 张成行空间 $C(A^{\\mathsf T})$，后 $n-r$ 列张成零空间 $N(A)$；$U$ 的前 $r$ 列 $\\mathbf{u}_1,\\dots,\\mathbf{u}_r$ 张成列空间 $C(A)$，后 $m-r$ 列张成左零空间 $N(A^{\\mathsf T})$。四组向量两两正交，而且 $A$ 把「行空间方向」一一送到「列空间方向」，把「零空间方向」全部压成 0。所以 $\\operatorname{rank}(A)=r$、$\\dim N(A)=n-r$、$\\dim N(A^{\\mathsf T})=m-r$ 全部看得见——这比用消元去数主元直观得多。" },
    { t: "quiz", qid: "ch07-q2" },
    { t: "h", lvl: 2, text: "§7.2 从 $A^{\\mathsf T}A$ 与 $AA^{\\mathsf T}$ 求 SVD", id: "ch07-s4" },
    { t: "p", html: "SVD 存在，但怎么算？关键是把「一般矩阵」转成「对称矩阵」——因为对称矩阵我们已经会谱分解了。观察两个矩阵：$A^{\\mathsf T}A$ 是 $n\\times n$ 的对称矩阵，$AA^{\\mathsf T}$ 是 $m\\times m$ 的对称矩阵。它们都半正定：对任意 $\\mathbf{x}$，$\\mathbf{x}^{\\mathsf T}(A^{\\mathsf T}A)\\mathbf{x}=\\lVert A\\mathbf{x}\\rVert^2\\ge0$，所以特征值非负。" },
    { t: "p", html: "设 $A=U\\Sigma V^{\\mathsf T}$。把 $A$ 代进 $A^{\\mathsf T}A$：$A^{\\mathsf T}A=V\\Sigma^{\\mathsf T}U^{\\mathsf T}U\\Sigma V^{\\mathsf T}=V(\\Sigma^{\\mathsf T}\\Sigma)V^{\\mathsf T}$。$\\Sigma^{\\mathsf T}\\Sigma$ 是对角阵，对角元是 $\\sigma_1^2,\\dots,\\sigma_r^2,0,\\dots,0$。这正是一个谱分解：<b>$A^{\\mathsf T}A$ 的特征值是 $\\sigma_i^2$，单位特征向量是 $\\mathbf{v}_i$</b>。同理 $AA^{\\mathsf T}=U(\\Sigma\\Sigma^{\\mathsf T})U^{\\mathsf T}$，说明 <b>$AA^{\\mathsf T}$ 的特征值也是这些 $\\sigma_i^2$（再加一些 0），特征向量是 $\\mathbf{u}_i$</b>。两个矩阵共享同一批非零特征值，这不是巧合，而是 SVD 的直接推论。" },
    { t: "p", html: "反过来，这条关系给出了计算 SVD 的算法。因为 $A^{\\mathsf T}A$ 对称，可以正交对角化；它的特征值非负，可以开平方得到 $\\sigma_i$。有了 $\\mathbf{v}_i$ 与 $\\sigma_i$，$\\mathbf{u}_i$ 由 $A\\mathbf{v}_i=\\sigma_i\\mathbf{u}_i$ 解出，即 $\\mathbf{u}_i=\\dfrac{A\\mathbf{v}_i}{\\sigma_i}$。这个定义为什么对？验证一下：它自动是单位向量（$\\lVert A\\mathbf{v}_i\\rVert^2=\\mathbf{v}_i^{\\mathsf T}A^{\\mathsf T}A\\mathbf{v}_i=\\lambda_i\\lVert\\mathbf{v}_i\\rVert^2=\\sigma_i^2$），不同 $i$ 的 $\\mathbf{u}_i$ 也正交（$\\mathbf{u}_i\\cdot\\mathbf{u}_j=\\frac{1}{\\sigma_i\\sigma_j}\\mathbf{v}_i^{\\mathsf T}A^{\\mathsf T}A\\mathbf{v}_j=\\frac{\\lambda_j}{\\sigma_i\\sigma_j}\\mathbf{v}_i\\cdot\\mathbf{v}_j=0$）。" },
    { t: "steps", items: [
      { title: "先算 $A^{\\mathsf T}A$", html: "得到 $n\\times n$ 对称半正定矩阵。这是全部计算的起点。" },
      { title: "求它的特征值与单位特征向量", html: "解 $\\det(A^{\\mathsf T}A-\\lambda I)=0$，把 $\\lambda$ 从大到小排；对每个 $\\lambda$ 解零空间，再单位化，得到 $\\mathbf{v}_1,\\dots,\\mathbf{v}_n$。" },
      { title: "开根号得到奇异值", html: "$\\sigma_i=\\sqrt{\\lambda_i}$。只保留正的（最多 $r$ 个），零特征值对应被压扁的方向。" },
      { title: "用 $\\mathbf{u}_i=A\\mathbf{v}_i/\\sigma_i$ 求左奇异向量", html: "对 $i=1,\\dots,r$ 计算即可。若需要完整的 $U$，再用 Gram–Schmidt 把它补齐成 $\\mathbb{R}^m$ 的正交基。" },
      { title: "拼矩阵并验算", html: "$U$、$\\Sigma$、$V$ 的列与对角元要按同一顺序排列；用 $U\\Sigma V^{\\mathsf T}=A$ 或 $A\\mathbf{v}_i=\\sigma_i\\mathbf{u}_i$ 验算。" }
    ]},
    { t: "theorem", name: "从转置乘 A 到 SVD", zh: "两个对称矩阵共享奇异值", rows: [
      { k: "白话", html: "$A^{\\mathsf T}A$ 与 $AA^{\\mathsf T}$ 像两台「探针」：它们的特征值平方根是奇异值，它们的特征向量分别是右、左奇异向量。" },
      { k: "结论", html: "$A^{\\mathsf T}A=V\\,\\operatorname{diag}(\\sigma_1^2,\\dots,\\sigma_r^2,0,\\dots,0)\\,V^{\\mathsf T}$；$AA^{\\mathsf T}=U\\,\\operatorname{diag}(\\sigma_1^2,\\dots,\\sigma_r^2,0,\\dots,0)\\,U^{\\mathsf T}$。两者非零特征值相同，都是 $\\sigma_i^2$，各有 $\\max(n-r,0)$ 与 $\\max(m-r,0)$ 个额外的零特征值。" },
      { k: "为什么", html: "把 $A=U\\Sigma V^{\\mathsf T}$ 代入：$A^{\\mathsf T}A=V\\Sigma^{\\mathsf T}U^{\\mathsf T}U\\Sigma V^{\\mathsf T}=V(\\Sigma^{\\mathsf T}\\Sigma)V^{\\mathsf T}$，中间是对角阵，对角元 $\\sigma_i^2$。$U^{\\mathsf T}U=I$ 用了 $U$ 正交。$AA^{\\mathsf T}$ 同理。" },
      { k: "注意", html: "零特征值的个数与零空间维数对应：$A^{\\mathsf T}A$ 的零特征向量张成 $N(A)$，$AA^{\\mathsf T}$ 的零特征向量张成 $N(A^{\\mathsf T})$。这就是 SVD 能同时给出四个子空间的原因。" }
    ]},
    { t: "p", html: "手算一遍最有说服力。取一个看上去很普通的 $2\\times2$ 矩阵 $A=\\begin{bmatrix}3&0\\\\4&5\\end{bmatrix}$。" },
    { t: "example", no: "1", tag: "手算 2×2 SVD", fields: [
      { k: "题目", html: "求 $A=\\begin{bmatrix}3&0\\\\4&5\\end{bmatrix}$ 的 SVD：$U$、$\\Sigma$、$V$，并验证 $U\\Sigma V^{\\mathsf T}=A$。" },
      { k: "思路", html: "先算 $A^{\\mathsf T}A$，解特征值问题得到 $\\mathbf{v}_i$ 与 $\\sigma_i$，再用 $\\mathbf{u}_i=A\\mathbf{v}_i/\\sigma_i$ 算 $U$，最后相乘验证。" },
      { k: "解答", html: "<p>$A^{\\mathsf T}A=\\begin{bmatrix}3&4\\\\0&5\\end{bmatrix}\\begin{bmatrix}3&0\\\\4&5\\end{bmatrix}=\\begin{bmatrix}9+16&20\\\\20&25\\end{bmatrix}=\\begin{bmatrix}25&20\\\\20&25\\end{bmatrix}$。</p><p>特征值：$\\operatorname{tr}=50$，$\\det=625-400=225$，特征方程 $\\lambda^2-50\\lambda+225=0$，得 $\\lambda_1=45$、$\\lambda_2=5$。于是 $\\sigma_1=\\sqrt{45}=3\\sqrt5$、$\\sigma_2=\\sqrt5$。</p><p>$\\lambda_1=45$：$A^{\\mathsf T}A-45I=\\begin{bmatrix}-20&20\\\\20&-20\\end{bmatrix}$，得 $\\mathbf{v}_1=\\left(\\frac{1}{\\sqrt2},\\frac{1}{\\sqrt2}\\right)$。$\\lambda_2=5$：$\\begin{bmatrix}20&20\\\\20&20\\end{bmatrix}$，得 $\\mathbf{v}_2=\\left(\\frac{1}{\\sqrt2},-\\frac{1}{\\sqrt2}\\right)$。所以 $V=\\frac{1}{\\sqrt2}\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}$。</p><p>$\\mathbf{u}_1=\\frac{A\\mathbf{v}_1}{\\sigma_1}=\\frac{1}{3\\sqrt5}\\left(\\frac{3}{\\sqrt2},\\frac{9}{\\sqrt2}\\right)=\\frac{1}{\\sqrt{10}}(1,3)$；$\\mathbf{u}_2=\\frac{A\\mathbf{v}_2}{\\sigma_2}=\\frac{1}{\\sqrt5}\\left(\\frac{3}{\\sqrt2},-\\frac{1}{\\sqrt2}\\right)=\\frac{1}{\\sqrt{10}}(3,-1)$。所以 $U=\\frac{1}{\\sqrt{10}}\\begin{bmatrix}1&3\\\\3&-1\\end{bmatrix}$。</p><p>验证：$\\sigma_1\\mathbf{u}_1\\mathbf{v}_1^{\\mathsf T}=\\frac32\\begin{bmatrix}1&1\\\\3&3\\end{bmatrix}$，$\\sigma_2\\mathbf{u}_2\\mathbf{v}_2^{\\mathsf T}=\\frac12\\begin{bmatrix}3&-3\\\\-1&1\\end{bmatrix}$，两者相加得 $\\begin{bmatrix}3&0\\\\4&5\\end{bmatrix}=A$。</p>" },
      { k: "点评", html: "这个例子把整条流水线走了一遍。注意几个细节：① $\\sigma_1=3\\sqrt5\\approx6.71$，$\\sigma_2=\\sqrt5\\approx2.24$，比值约为 3，说明 $A$ 把不同方向拉伸的程度差 3 倍；② $U$ 的两列 $\\mathbf{u}_1,\\mathbf{u}_2$ 正交且长度为 1，可以验证 $U^{\\mathsf T}U=I$；③ $\\mathbf{v}_1,\\mathbf{v}_2$ 是 $A^{\\mathsf T}A$ 的特征向量，<b>不是</b> $A$ 的特征向量。$A$ 本身是非对称的，它的特征值与特征向量是另一套东西（$\\operatorname{tr}=8$、$\\det=15$，特征值为 3 和 5），与 $\\mathbf{v}_i$ 无关。SVD 的「基」来自 $A^{\\mathsf T}A$ 与 $AA^{\\mathsf T}$，这一点不能混。" }
    ]},
    { t: "p", html: "这个例子里 $A$ 是 $2\\times2$。若 $m\\ne n$，$A^{\\mathsf T}A$ 与 $AA^{\\mathsf T}$ 的尺寸不同，但非零特征值完全相同。$m\\gt n$ 时 $U$ 比 $V$ 大，$U$ 多出来的列对应零奇异值，可以任选；实际计算用经济型，只保留 $r$ 列。" },
    { t: "p", html: "两个常见的概念错误必须先纠正。第一，<b>$\\sigma_i=\\sqrt{\\lambda_i}$，不是 $\\lambda_i$</b>。$A=\\begin{bmatrix}3&0\\\\4&5\\end{bmatrix}$ 的 $\\sigma_1=3\\sqrt5$，而 $A^{\\mathsf T}A$ 的最大特征值是 45，差了一个平方。第二，<b>$\\mathbf{v}_i$ 是 $A^{\\mathsf T}A$ 的特征向量，$\\mathbf{u}_i$ 是 $AA^{\\mathsf T}$ 的特征向量</b>；记反了会得到完全错误的矩阵。最稳的记忆是「$A\\mathbf{v}_i=\\sigma_i\\mathbf{u}_i$ 从右往左读：$V$ 在输入侧，$U$ 在输出侧」。" },
    { t: "p", html: "最后说一句数值计算。实际软件不会真的去算 $A^{\\mathsf T}A$：这会把条件数平方（$\\kappa(A^{\\mathsf T}A)=\\kappa(A)^2$），小奇异值会被舍入误差淹没。工业标准算法是 Golub–Kahan 双对角化，直接对 $A$ 做正交变换，数值上稳定得多（<a href='#/ch11'>第 11 章</a> 会讨论条件数与稳定性）。手算时无所谓，理解原理用 $A^{\\mathsf T}A$ 最清楚。" },
    { t: "quiz", qid: "ch07-q3" },
    { t: "quiz", qid: "ch07-q4" },

    { t: "h", lvl: 2, text: "§7.3 主成分分析 PCA", id: "ch07-s5" },
    { t: "p", html: "SVD 最著名的应用是<b>主成分分析</b>（Principal Component Analysis，PCA）。场景：你有一批数据，每个样本有很多特征（身高、体重、血压、…），特征之间高度相关，冗余很多。想用两三个「综合指标」概括它们，同时尽量不丢失信息。PCA 给出的就是这些综合指标，它本质上就是「数据中心化之后的 SVD」。" },
    { t: "p", html: "把数据排成矩阵 $X$：每一行是一个样本，每一列是一个特征，共 $n$ 行 $d$ 列。第一步是<b>中心化</b>：每一列减去该列的均值，让数据的中心落在原点。这一步不能省——若不中心化，第一主成分会被「均值方向」占掉，得到的不是变化方向。" },
    { t: "p", html: "中心化后，$X^{\\mathsf T}X$ 度量各特征之间的「共同变化」。把它除以 $n-1$（样本协方差的无偏估计），得到<b>协方差矩阵</b> $C=\\dfrac{1}{n-1}X^{\\mathsf T}X$。$C$ 是对称半正定的，它的特征向量就是主成分方向，特征值就是该方向上的方差。找「投影后方差最大」的方向，就是找 $C$ 的最大特征值方向——这正是谱定理解决的问题。" },
    { t: "p", html: "用 SVD 看更直接：$X=U\\Sigma V^{\\mathsf T}$，则 $X^{\\mathsf T}X=V\\Sigma^{\\mathsf T}\\Sigma V^{\\mathsf T}$，所以 $C=V\\dfrac{\\Sigma^{\\mathsf T}\\Sigma}{n-1}V^{\\mathsf T}$。于是 <b>$V$ 的列就是主成分方向，第 $i$ 个主成分的方差是 $\\sigma_i^2/(n-1)$</b>。保留前 $k$ 个主成分，就是把数据投影到 $V_k$ 张成的子空间：$X_k=XV_k$，维度从 $d$ 降到 $k$。被丢掉的那部分方差是 $\\sum_{i\\gt k}\\sigma_i^2/(n-1)$，衡量了降维的损失。" },
    { t: "p", html: "看一个只有两个特征、四个样本的小例子。" },
    { t: "example", no: "2", tag: "PCA 手算", fields: [
      { k: "题目", html: "四个样本（已中心化）：$(1,1)$、$(2,2)$、$(-1,-1)$、$(-2,-2)$。求主成分方向、各主成分的方差，以及降维到一维是否无损。" },
      { k: "思路", html: "写出 $X$，算 $X^{\\mathsf T}X$，求特征值与特征向量；方差 = 特征值除以 $n-1=3$；若第二主成分方差为 0，则一维投影无损。" },
      { k: "解答", html: "<p>$X=\\begin{bmatrix}1&1\\\\2&2\\\\-1&-1\\\\-2&-2\\end{bmatrix}$，$X^{\\mathsf T}X=\\begin{bmatrix}1+4+1+4&1+4+1+4\\\\1+4+1+4&1+4+1+4\\end{bmatrix}=\\begin{bmatrix}10&10\\\\10&10\\end{bmatrix}$。</p><p>特征值：$\\operatorname{tr}=20$，$\\det=0$，所以 $\\lambda_1=20$、$\\lambda_2=0$。特征向量 $\\mathbf{v}_1=\\left(\\frac{1}{\\sqrt2},\\frac{1}{\\sqrt2}\\right)$，$\\mathbf{v}_2=\\left(\\frac{1}{\\sqrt2},-\\frac{1}{\\sqrt2}\\right)$。</p><p>方差：$\\frac{20}{3}\\approx6.67$ 与 $0$。第一主成分解释了 $100\\%$ 的方差，降维到一维无损。投影坐标 $X\\mathbf{v}_1=(\\sqrt2,2\\sqrt2,-\\sqrt2,-2\\sqrt2)$，$X\\mathbf{v}_2=(0,0,0,0)$——所有点都落在直线 $y=x$ 上。</p>" },
      { k: "点评", html: "这个例子刻意让所有点共线，所以第二主成分方差为 0——秩为 1，一维就能完全描述。真实数据的第二主成分一般不为零，「丢掉它」才是有损的。注意特征向量取 $(1,1)/\\sqrt2$ 还是 $(-1,-1)/\\sqrt2$ 没有区别，主成分的方向只确定到正负号；方差才是实质。" }
    ]},
    { t: "theorem", name: "PCA 与 SVD 是同一件事", zh: "主成分 = 协方差矩阵的特征向量", rows: [
      { k: "白话", html: "把数据中心化后做 SVD，右奇异向量就是主成分方向，奇异值平方除以 $n-1$ 就是各主成分的方差。" },
      { k: "结论", html: "设 $X$（$n$ 个样本、$d$ 个特征，已中心化）的 SVD 为 $X=U\\Sigma V^{\\mathsf T}$，协方差矩阵 $C=\\frac{1}{n-1}X^{\\mathsf T}X$。则 $C=V\\frac{\\Sigma^{\\mathsf T}\\Sigma}{n-1}V^{\\mathsf T}$：主方向是 $V$ 的列，第 $i$ 个主成分的方差是 $\\sigma_i^2/(n-1)$。" },
      { k: "为什么", html: "把 $X^{\\mathsf T}X$ 用 SVD 展开：$X^{\\mathsf T}X=V\\Sigma^{\\mathsf T}\\Sigma V^{\\mathsf T}$，两边除以 $n-1$ 就是一个谱分解。SVD 与协方差特征分解是同一个分解的两种写法。" },
      { k: "用法", html: "降维到 $k$ 维就是 $X_k=XV_k$；解释方差比例 = $\\frac{\\lambda_1+\\cdots+\\lambda_k}{\\lambda_1+\\cdots+\\lambda_d}$，其中 $\\lambda_i=\\sigma_i^2/(n-1)$。中心化是前提，否则第一主成分会被均值方向占据。" }
    ]},
    { t: "p", html: "PCA 有四个常见的坑。<b>① 忘记中心化</b>：算出来的第一主成分指向数据的均值方向，不是变异最大的方向。<b>② 特征尺度不同</b>：身高用厘米、体重用克，方差差几个数量级，PCA 会只盯着数值大的特征。通常先对每一列做标准化（除以标准差），再做 PCA。<b>③ 把方差大当成「重要」</b>：方差大只说明变化大，不一定与你想预测的目标相关；PCA 是无监督的，它不知道标签。<b>④ 以为主成分可以解释</b>：主成分是原始特征的线性组合，系数可正可负，「第一主成分」未必有直观含义。" },
    { t: "p", html: "最后一个值得记住的对应关系：PCA 处理的是「数据的协方差矩阵」，SVD 处理的是「数据矩阵」；对中心化后的数据，这两件事是同一件事的两种说法。这也解释了为什么 <a href='#/ch12'>第 12 章</a> 讲概率统计时，协方差矩阵的特征分解会再次出现。" },
    { t: "quiz", qid: "ch07-q5" },
    { t: "h", lvl: 2, text: "§7.4 SVD 的几何：圆到椭圆", id: "ch07-s6" },
    { t: "p", html: "把 $A=U\\Sigma V^{\\mathsf T}$ 按顺序作用在一个向量上：先用 $V^{\\mathsf T}$ 转一下，再用 $\\Sigma$ 沿坐标轴拉伸，最后用 $U$ 转一下。对单位圆来说，$V^{\\mathsf T}$ 是旋转/反射，圆还是圆；$\\Sigma$ 把圆沿两个坐标轴分别乘 $\\sigma_1$、$\\sigma_2$，圆变成轴对齐的椭圆；$U$ 再把这个椭圆整体旋转到新的方向。结论是：<b>任意 $2\\times2$ 矩阵都把单位圆变成椭圆（可能退化成线段），半轴长就是两个奇异值，半轴方向就是 $U$ 的两列</b>。高维同理：单位球变成椭球，半轴长 $\\sigma_1\\ge\\sigma_2\\ge\\cdots$。" },
    { t: "p", html: "这个图像和第 6 章对称矩阵的画面要对照着看。对称矩阵取 $U=V=Q$（严格说，特征值全为正时才能这样取；否则两组基至多差一个符号），所以「输入的主方向」与「输出的主方向」是同一组，椭圆的两轴与特征向量重合，$\\sigma_i=\\lvert\\lambda_i\\rvert$。一般矩阵 $U\\ne V$：输入空间有一组正交方向 $\\mathbf{v}_i$，输出空间有另一组正交方向 $\\mathbf{u}_i$，$A$ 把前者送到后者。所以非对称矩阵也会有完美的「主轴图像」，只不过输入主轴和输出主轴不是同一组——这就是 SVD 比特征值分解更普适的地方。" },
    { t: "example", no: "3", tag: "缺陷矩阵也有漂亮的 SVD", fields: [
      { k: "题目", html: "设 $A=\\begin{bmatrix}2&1\\\\0&2\\end{bmatrix}$。(a) 说明 $A$ 不可对角化。(b) 求 $A$ 的奇异值，并解释单位圆经 $A$ 作用后的形状。(c) 求条件数 $\\sigma_1/\\sigma_2$。" },
      { k: "思路", html: "(a) 特征值是 2,2，看特征空间维数。(b) 算 $A^{\\mathsf T}A$ 的特征值再开方。(c) 两个奇异值之比。" },
      { k: "解答", html: "<p>(a) $\\operatorname{tr}=4$，$\\det=4$，特征多项式 $(\\lambda-2)^2$，特征值是 $\\lambda=2$（二重）。$A-2I=\\begin{bmatrix}0&1\\\\0&0\\end{bmatrix}$，零空间只有 $\\mathbf{v}=(1,0)$ 一个方向，几何重数 1 $\\lt$ 代数重数 2，所以不可对角化。</p><p>(b) $A^{\\mathsf T}A=\\begin{bmatrix}2&0\\\\1&2\\end{bmatrix}\\begin{bmatrix}2&1\\\\0&2\\end{bmatrix}=\\begin{bmatrix}4&2\\\\2&5\\end{bmatrix}$。$\\operatorname{tr}=9$，$\\det=16$，特征值 $\\lambda=\\frac{9\\pm\\sqrt{81-64}}2=\\frac{9\\pm\\sqrt{17}}2$，所以 $\\sigma_1=\\sqrt{\\frac{9+\\sqrt{17}}2}\\approx2.56$，$\\sigma_2=\\sqrt{\\frac{9-\\sqrt{17}}2}\\approx1.56$。单位圆变成椭圆，半轴长约 2.56 与 1.56，方向由 $U$ 的两列给出（与 $A$ 的特征向量 $(1,0)$ 无关）。</p><p>(c) $\\kappa(A)=\\frac{\\sigma_1}{\\sigma_2}=\\sqrt{\\frac{9+\\sqrt{17}}{9-\\sqrt{17}}}\\approx1.64$。</p>" },
      { k: "点评", html: "这个例子专门挑了一个「特征值退化、不可对角化」的矩阵，SVD 却完好无损——两个奇异值不相等，椭圆有明确的形状。这说明「缺陷」只影响特征值分解，不影响 SVD。顺带验证 $\\sigma_1\\sigma_2=\\sqrt{\\lambda_1\\lambda_2}=\\sqrt{\\det(A^{\\mathsf T}A)}=\\lvert\\det(A)\\rvert=4$：$2.56\\times1.56\\approx4.0$ ✓。面积放大倍数等于 $\\lvert\\det\\rvert$，与第 5 章一致。" }
    ]},
    { t: "p", html: "顺便得到第 5 章体积公式的 SVD 版本：$\\lvert\\det(A)\\rvert=\\sigma_1\\sigma_2\\cdots\\sigma_n$。因为 $\\lvert\\det(A)\\rvert=\\sqrt{\\det(A^{\\mathsf T}A)}=\\sqrt{\\prod\\lambda_i}=\\prod\\sigma_i$。所以「矩阵把单位立方体放大几倍」与「各个方向分别放大几倍再相乘」是同一件事。若某个 $\\sigma_i=0$，体积就是 0——矩阵奇异，图形被压扁到低维。" },
    { t: "p", html: "奇异值还度量了矩阵的<b>条件数</b>（condition number）：$\\kappa(A)=\\dfrac{\\sigma_{\\max}}{\\sigma_{\\min}}$。它衡量「单位圆被拉得多扁」：$\\kappa(A)=1$ 时所有方向拉伸相同（矩阵是正交矩阵乘以一个常数），圆还是圆；$\\kappa(A)$ 很大时，某些方向被拉得很长、某些方向几乎被压没，矩阵接近奇异。这个数决定了方程组 $A\\mathbf{x}=\\mathbf{b}$ 对扰动的敏感程度：$\\mathbf{b}$ 的相对误差最多被放大 $\\kappa(A)$ 倍。例如 $A=\\begin{bmatrix}1&0\\\\0&0.001\\end{bmatrix}$ 的 $\\kappa(A)=1000$，右端第 2 个分量只要有 $10^{-6}$ 的误差，解的对应分量就可能错到 $10^{-3}$。" },
    { t: "p", html: "顺便说一个漂亮的推论：$A=U\\Sigma V^{\\mathsf T}=(UV^{\\mathsf T})(V\\Sigma V^{\\mathsf T})$。第一个因子 $UV^{\\mathsf T}$ 是正交矩阵（旋转或反射），第二个因子 $V\\Sigma V^{\\mathsf T}$ 是对称半正定矩阵（纯拉伸，没有旋转）。所以任意方阵都能分解成「正交 × 对称半正定」，这叫<b>极分解</b>（polar decomposition），类比复数的 $z=re^{i\\theta}$：$r$ 是拉伸，$e^{i\\theta}$ 是旋转。" },
    { t: "p", html: "实验台里可以把一个 $2\\times2$ 矩阵拆成旋转、拉伸、旋转三步，看单位圆怎样一步步变成椭圆；拖动滑块改变奇异值时，椭圆的扁平程度与条件数一起变化。" },
    { t: "lab", id: "svd" },
    { t: "quiz", qid: "ch07-q6" },

    { t: "h", lvl: 2, text: "§7.4 低秩近似与伪逆", id: "ch07-s7" },
    { t: "p", html: "SVD 的前 $k$ 项 $A_k$ 不只是「一个还行的近似」——在所有秩不超过 $k$ 的矩阵里，它是最好的。这就是 <b>Eckart–Young 定理</b>，图像压缩、降噪、推荐系统的数学依据。" },
    { t: "theorem", name: "Eckart–Young 低秩近似定理", zh: "截断 SVD 的最优性", rows: [
      { k: "白话", html: "秩不超过 $k$ 的矩阵里，离 $A$ 最近的就是「只保留前 $k$ 个奇异值」的 $A_k$。" },
      { k: "条件", html: "$A$ 的奇异值为 $\\sigma_1\\ge\\cdots\\ge\\sigma_r\\gt0$，$k\\lt r$。" },
      { k: "结论", html: "$\\min_{\\operatorname{rank}(B)\\le k}\\lVert A-B\\rVert_2=\\sigma_{k+1}$，最小值在 $B=A_k$ 处取得；若用 Frobenius 范数，误差是 $\\sqrt{\\sigma_{k+1}^2+\\cdots+\\sigma_r^2}$。" },
      { k: "直觉", html: "奇异值就是各个方向上的「能量」。要让残差最小，当然先丢掉能量最小的那些方向；而 $\\sigma_{k+1}$ 是第一个被丢掉的方向，所以残差的范数至少是它。" },
      { k: "用法", html: "图像压缩：存 $A_k$ 而不是 $A$；降噪：小的奇异值往往对应噪声；推荐系统：用户–物品矩阵近似低秩，补全缺失项。" }
    ]},
    { t: "p", html: "拿 §7.2 例 1 的 $A=\\begin{bmatrix}3&0\\\\4&5\\end{bmatrix}$ 试一下最佳秩 1 近似。它只有两个奇异值，$A_1=\\sigma_1\\mathbf{u}_1\\mathbf{v}_1^{\\mathsf T}=\\frac32\\begin{bmatrix}1&1\\\\3&3\\end{bmatrix}=\\begin{bmatrix}1.5&1.5\\\\4.5&4.5\\end{bmatrix}$。两列成比例，秩确实是 1。误差矩阵 $A-A_1=\\begin{bmatrix}1.5&-1.5\\\\-0.5&0.5\\end{bmatrix}$ 的 Frobenius 范数是 $\\sqrt{2.25+2.25+0.25+0.25}=\\sqrt5=\\sigma_2$，与定理一致（这里只有一项被丢掉）。" },
    { t: "p", html: "再说<b>伪逆</b>（pseudoinverse）。当 $A$ 不是方阵、或者不可逆时，$A^{-1}$ 不存在，但我们仍然想「解」$A\\mathbf{x}=\\mathbf{b}$。SVD 给出了一个自然的替代：把 $\\Sigma$ 里的非零奇异值取倒数、零保持为零，再转置回原位置，得到 $\\Sigma^{+}$；于是" },
    { t: "tex", tex: "A^{+}=V\\Sigma^{+}U^{\\mathsf T},\\qquad \\Sigma^{+}=\\operatorname{diag}\\left(\\frac{1}{\\sigma_1},\\dots,\\frac{1}{\\sigma_r},0,\\dots,0\\right)", caption: "伪逆（Moore–Penrose 逆）：非零奇异值取倒数，零奇异值保留为零" },
    { t: "p", html: "伪逆满足四条 Moore–Penrose 条件：$AA^{+}A=A$、$A^{+}AA^{+}=A^{+}$、$(AA^{+})^{\\mathsf T}=AA^{+}$、$(A^{+}A)^{\\mathsf T}=A^{+}A$。前两条说它「像逆矩阵」；后两条说 $AA^{+}$ 与 $A^{+}A$ 都是正交投影矩阵——$AA^{+}$ 把向量投影到 $A$ 的列空间，$A^{+}A$ 投影到行空间。所以 $A^{+}\\mathbf{b}$ 是「把 $\\mathbf{b}$ 投影到列空间后再解」的结果：方程有解时给出精确解；无解时给出最小二乘解；有无穷多解时给出其中范数最小的那个。" },
    { t: "p", html: "列满秩（$r=n$）时，伪逆有一个熟悉的形式：$A^{+}=(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}$。把它代进 $A^{+}\\mathbf{b}$，得到的正是<a href='#/ch04'>第 4 章</a>的最小二乘解 $\\hat{\\mathbf{x}}=(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}\\mathbf{b}$。行满秩（$r=m$）时则是 $A^{+}=A^{\\mathsf T}(AA^{\\mathsf T})^{-1}$，对应「最小范数解」。" },
    { t: "example", no: "4", tag: "伪逆与最小二乘", fields: [
      { k: "题目", html: "设 $A=\\begin{bmatrix}1&0\\\\0&1\\\\1&1\\end{bmatrix}$（$3\\times2$）。(a) 求 $A^{+}$。(b) 用 $A^{+}$ 解 $A\\mathbf{x}=\\mathbf{b}_1$，$\\mathbf{b}_1=(1,2,3)$。(c) 用 $A^{+}$ 求 $A\\mathbf{x}=\\mathbf{b}_2$ 的最小二乘解，$\\mathbf{b}_2=(1,2,0)$。" },
      { k: "思路", html: "列满秩，可直接用 $A^{+}=(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}$。先算 $A^{\\mathsf T}A$ 与它的逆，再乘 $A^{\\mathsf T}$。" },
      { k: "解答", html: "<p>$A^{\\mathsf T}A=\\begin{bmatrix}1&0&1\\\\0&1&1\\end{bmatrix}\\begin{bmatrix}1&0\\\\0&1\\\\1&1\\end{bmatrix}=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$，$(A^{\\mathsf T}A)^{-1}=\\frac13\\begin{bmatrix}2&-1\\\\-1&2\\end{bmatrix}$。于是 $A^{+}=\\frac13\\begin{bmatrix}2&-1\\\\-1&2\\end{bmatrix}\\begin{bmatrix}1&0&1\\\\0&1&1\\end{bmatrix}=\\frac13\\begin{bmatrix}2&-1&1\\\\-1&2&1\\end{bmatrix}$。</p><p>(b) $A^{+}\\mathbf{b}_1=\\frac13(2-2+3,\\,-1+4+3)=(1,2)$，代回 $A(1,2)=(1,2,3)=\\mathbf{b}_1$，精确。</p><p>(c) $A^{+}\\mathbf{b}_2=\\frac13(2-2+0,\\,-1+4+0)=(0,1)$。此时 $A(0,1)=(0,1,1)$，与 $\\mathbf{b}_2$ 的差是 $(1,1,-1)$，残差范数 $\\sqrt3$。这个解满足正规方程 $A^{\\mathsf T}A\\mathbf{x}=A^{\\mathsf T}\\mathbf{b}_2$：左边 $\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}\\begin{bmatrix}0\\\\1\\end{bmatrix}=\\begin{bmatrix}1\\\\2\\end{bmatrix}$，右边 $(1+0+0,\\,2+0+0)=(1,2)$，一致。</p>" },
      { k: "点评", html: "(b) 的 $\\mathbf{b}_1$ 恰好落在 $A$ 的列空间里，所以伪逆给出精确解；(c) 的 $\\mathbf{b}_2$ 不在列空间里，伪逆给出最小二乘解。两种情形用一个公式 $\\mathbf{x}=A^{+}\\mathbf{b}$ 统一处理——这就是伪逆的方便之处。注意 $A^{+}$ 是一个 $2\\times3$ 矩阵：$A$ 是 $3\\times2$ 的矩形矩阵，伪逆是 $2\\times3$ 的矩形矩阵，尺寸反过来。" }
    ]},
    { t: "p", html: "伪逆也能处理奇异（不可逆）的矩阵。比如 $A=\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$，它的两个奇异值是 $2$ 和 $0$，所以 $A^{+}$ 只保留第 1 个方向：$A^{+}=\\frac14\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$。验证 $AA^{+}A$：$AA^{+}=\\frac12\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$ 是投影到直线 $x=y$ 的投影矩阵，再乘 $A$ 回到 $A$，满足 $AA^{+}A=A$。而 $A^{+}\\mathbf{b}$ 给出「所有解中范数最小的那个」：$\\mathbf{x}=\\frac{b_1+b_2}{4}(1,1)$，沿 $A$ 的零空间方向 $(1,-1)$ 不再额外增大范数。" },
    { t: "p", html: "最后必须提醒：伪逆和低秩近似都通过「除以 $\\sigma_i$」或「忽略 $\\sigma_i$」工作，所以它们对<b>小奇异值</b>非常敏感。若 $\\kappa(A)$ 很大，$\\sigma_{\\min}$ 很小，$1/\\sigma_{\\min}$ 会把数据中的微小误差放大成巨大的解误差。这时正确的做法不是硬求逆，而是用截断 SVD（只保留较大的奇异值）做正则化——这就是机器学习里「岭回归」与「主成分回归」的数学来源。" },
    { t: "p", html: "低秩近似最著名的商业应用是<b>推荐系统</b>。把用户对电影的评分排成一个矩阵：行是用户、列是电影，大部分格子是空的（没看过）。人们相信「口味」只有少数几个独立维度，所以这个评分矩阵近似低秩。对它做截断 SVD，$\\sigma_i\\mathbf{u}_i\\mathbf{v}_i^{\\mathsf T}$ 的每一项可以读成「一类观众」乘「一类电影」：$\\mathbf{u}_i$ 给出哪些用户属于这一「口味群」，$\\mathbf{v}_i$ 给出哪些电影属于这一「类型」。空白的格子用 $A_k$ 的对应元素填上，就是预测评分。这里「低秩」不是假设数据完美，而是「用少数模式解释大部分偏好」——与图像压缩共享同一个数学内核。" },
    { t: "quiz", qid: "ch07-q7" },
    { t: "keypoint", items: [
      { title: "一句话", html: "任意矩阵 $A=U\\Sigma V^{\\mathsf T}$：两组正交基 + 一组非负奇异值；它把几何讲成「旋转 → 拉伸 → 旋转」。" },
      { title: "怎么求", html: "$A^{\\mathsf T}A$ 的特征值是 $\\sigma_i^2$，特征向量是 $\\mathbf{v}_i$；$\\mathbf{u}_i=A\\mathbf{v}_i/\\sigma_i$。记住 $\\sigma=\\sqrt{\\lambda}$，别把两者混。" },
      { title: "秩 1 展开", html: "$A=\\sum\\sigma_i\\mathbf{u}_i\\mathbf{v}_i^{\\mathsf T}$；截到前 $k$ 项得到最佳秩 $k$ 近似，误差由 $\\sigma_{k+1}$ 控制（Eckart–Young）。" },
      { title: "几何", html: "单位圆 → 椭圆，半轴 $\\sigma_i$，方向 $\\mathbf{u}_i$；$\\lvert\\det\\rvert=\\prod\\sigma_i$，条件数 $\\kappa(A)=\\sigma_{\\max}/\\sigma_{\\min}$。" },
      { title: "应用", html: "图像压缩（低秩）、PCA（中心化数据的 SVD）、伪逆（最小二乘与最小范数解）。" }
    ]},
    { t: "callout", kind: "exam", title: "考试视角：这章会怎么考", html: "<p>常见题型：① <b>手算小矩阵的 SVD</b>——$2\\times2$ 用 $A^{\\mathsf T}A$ 的特征值，算 $\\mathbf{v}$、$\\sigma$、$\\mathbf{u}$，最后验算 $U\\Sigma V^{\\mathsf T}=A$；注意 $\\sigma=\\sqrt{\\lambda}$。② <b>用奇异值回答性质</b>——秩 = 非零奇异值个数；$\\lvert\\det\\rvert=\\prod\\sigma_i$；条件数 = 比值。③ <b>低秩近似</b>——写出 $A_k$，说明误差是 $\\sigma_{k+1}$；图像压缩的存储量 $k(m+n+1)$。④ <b>PCA</b>——中心化、协方差矩阵、特征值即方差、解释方差比例。⑤ <b>伪逆</b>——列满秩时 $(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}$，或用 SVD 公式，求最小二乘解。</p><p>易错清单：把 $\\sigma$ 写成 $\\lambda$；把 $V$ 当成 $A$ 的特征向量；$U$ 与 $V$ 的顺序错位（$\\sigma_1$ 必须配 $\\mathbf{u}_1,\\mathbf{v}_1$）；忘记把特征向量单位化；PCA 忘记中心化；伪逆里把零奇异值取倒数（会得到无穷大）。这些点每一条都值得在考前重看一遍。</p>" },
    { t: "checklist", id: "ch07-check", items: [
      "我能写出 $A=U\\Sigma V^{\\mathsf T}$ 中每个矩阵的尺寸，并说清 $U$、$V$ 的列分别是什么空间的基。",
      "我能从 $A^{\\mathsf T}A$ 的特征值算出 $\\sigma_i=\\sqrt{\\lambda_i}$，并区分「谁的特征向量」。",
      "我能用 $\\mathbf{u}_i=A\\mathbf{v}_i/\\sigma_i$ 补出左奇异向量，并验证 $A\\mathbf{v}_i=\\sigma_i\\mathbf{u}_i$。",
      "我能写出秩 1 展开，并用前 $k$ 项做低秩近似。",
      "我能说出 Eckart–Young 定理的结论，并解释图像压缩为什么能省空间。",
      "我能把 SVD 的几何讲成「旋转 → 拉伸 → 旋转」，并指出椭圆半轴是 $\\sigma_i$。",
      "我能用 $\\kappa(A)=\\sigma_{\\max}/\\sigma_{\\min}$ 判断矩阵是否接近奇异。",
      "我能用伪逆 $A^{+}=V\\Sigma^{+}U^{\\mathsf T}$ 求最小二乘解，并解释它和正规方程的关系。"
    ]}
  ]
});
