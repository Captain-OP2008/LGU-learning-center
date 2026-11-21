/* =====================================================================
 * data/ch11.js · 第11章 向量与空间几何（Vectors and the Geometry of Space）
 * 初学者版：从「房间里的三个数」讲到「看方程猜曲面」，每个符号首次出现都解释。
 * 内容：98 blocks / 2 定理 / 5 例题 / 1 公式 / 1 列表 / 2 实验台 / 0 演算台 / 9 内嵌题
 * ===================================================================== */
CSC.registerChapter({
 "id": "ch11",
 "num": "11",
 "title": "向量与空间几何",
 "en": "Vectors and the Geometry of Space",
 "goals": [
  "能在一个房间里读出空间点的三个坐标，并解释两点距离公式为什么是「勾股定理用了两次」。",
  "能说清向量是「长度 + 方向、与位置无关」的箭头，会算模长、单位向量与中点。",
  "能用点积回答「两个方向有多一致」：求夹角、判垂直、算投影与功。",
  "能用叉积造出同时垂直于两者的方向：求法向量、面积与体积，并说清右手定则。",
  "能用一个点加一个法向量写出平面，用投影推出点到平面/直线的距离，并从方程认出二次曲面。"
 ],
 "kp": [
  {
   "id": "ch11-1",
   "title": "这一章要解决什么问题"
  },
  {
   "id": "ch11-2",
   "title": "11.1 三根轴：空间里的位置怎么标"
  },
  {
   "id": "ch11-3",
   "title": "11.2 向量：会平移的箭头"
  },
  {
   "id": "ch11-4",
   "title": "11.3 点积：两个方向有多一致"
  },
  {
   "id": "ch11-5",
   "title": "11.4 叉积：用右手造出第三个方向"
  },
  {
   "id": "ch11-6",
   "title": "11.5 平面与直线：一个点加一支箭头"
  },
  {
   "id": "ch11-7",
   "title": "11.6 二次曲面：看方程猜形状"
  },
  {
   "id": "ch11-8",
   "title": "例题、易错与公式清单"
  }
 ],
 "blocks": [
  {
   "t": "callout",
   "kind": "why",
   "title": "这一章要解决什么问题",
   "html": "<p>你站在一间屋子里，指着墙角说：「箱子在那儿。」在平面上，这句话可以翻译成两个数：往右 3 米、往前 2 米。可如果箱子挂在半空，你还得补一句「离地 1.5 米」。<b>三个数</b>，才能锁定空间里的一个位置。</p><p>位置好办，方向不好办。风往哪吹、力往哪推、一根杆子朝哪斜——这些都不是「一个点」，而是一支<b>箭头</b>。箭头可以在空间里平移，只要长度和朝向不变，它就还是同一支箭头。这一条听起来没什么，却是整章的起点：正因为箭头可以平移，我们才能把它搬到原点，用三个数把它记下来。</p><p>本章要造三件工具。<b>坐标</b>：把位置和箭头都写成三个数。<b>两种乘法</b>：点积回答「两个方向有多一致」，叉积回答「哪个方向同时垂直于它们」。<b>方程</b>：只要给我一个点和一支箭头，我就能写出整张平面、整条直线。学完你就能算出两条空间直线究竟相不相交、一个点到一张平面有多远、$x^2+y^2=4z$ 到底长什么样。</p>"
  },
  {
   "t": "callout",
   "kind": "note",
   "title": "开始前你需要知道",
   "html": "<ul><li><b>平面直角坐标与配方法</b>：知道 $(x-1)^2+(y+2)^2=9$ 是圆心 $(1,-2)$、半径 $3$ 的圆，会「加上一次项系数一半的平方，再减掉」。本章只是把圆升级成球，配方的手法一模一样。见 <a href=\"#/ch10\">第 10 章</a>。</li><li><b>三角函数与余弦定理</b>：记得 $\\cos60^\\circ=\\frac12$，以及 $c^2=a^2+b^2-2ab\\cos C$。11.3 节的点积公式就是从这条定理推出来的。见 <a href=\"#/ch01\">第 1 章</a>。</li><li><b>二阶、三阶行列式</b>：会按「交叉相乘再相减」展开。11.4 节的叉积公式就是一个三阶行列式，不会展开就写不出答案。速查见 <a href=\"#/ch18\">附录 A</a>。</li><li><b>物理里的「矢量」</b>：如果你听过「速度是矢量、质量是标量」，直觉已经够了。本章只是把物理课的箭头换成 $(x,y,z)$ 三个数来算。</li></ul>"
  },
  {
   "t": "scope",
   "scope": "outside",
   "weeks": "—",
   "sections": "§11.1–11.6"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "从一支箭说起",
   "id": "ch11-s1"
  },
  {
   "t": "p",
   "html": "先别看公式，跟我做一件事。在纸上画一支箭头：从 $A$ 指向 $B$。现在把整支箭头往右平移 5 厘米，它指的方向变了吗？长度变了吗？都没有。<br>这就是向量（vector）最特别的地方：<b>它不关心自己站在哪里，只关心「多长」和「朝哪」</b>。所以「从 $A$ 到 $B$」和「从 $C$ 到 $D$」可以是同一个向量，只要两段位移的方向与长度一样。<br>再往前走一步：既然位置无所谓，那我就把箭头的尾巴挪到原点。这时箭头的尖端落在某个点上，那个点的三个坐标，就成了这支箭头的<b>身份证</b>。"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "一句话",
     "html": "向量 $=$ 长度 $+$ 方向，与位置无关；把它平移到原点，三个坐标就把这支箭头记死了。"
    },
    {
     "title": "为什么值得先想清楚",
     "html": "后面所有公式都建立在「向量可以平移」这一条上。忘了它，你会觉得 $\\mathbf n\\cdot\\overrightarrow{P_0P}=0$ 来得莫名其妙。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "11.1 三根轴：空间里的位置怎么标（Three-Dimensional Coordinate Systems）",
   "id": "ch11-s2"
  },
  {
   "t": "callout",
   "kind": "tip",
   "title": "先想一想",
   "html": "<p>描述一盏吊灯的位置，最少需要几个数？如果换一个人站在房间对角，你报的三个数还一样吗？</p>"
  },
  {
   "t": "p",
   "html": "过墙角画三条互相垂直的线：沿着两面墙的交线往右是 $x$ 轴，沿着另一面墙往前往里是 $y$ 轴，从地面往上竖起来是 $z$ 轴。三轴交于一点，叫<b>原点</b>（origin）。有了这三根轴，空间里任何一点 $P$ 都能写成三个数 $(x,y,z)$：从原点出发，沿 $x$ 轴走 $x$，沿 $y$ 轴走 $y$，再沿 $z$ 轴走 $z$，就到 $P$ 了。<br>这三个数叫 $P$ 的坐标，顺序不能换。$(3,2,1)$ 和 $(2,3,1)$ 是空间里两个不同的点，虽然它们只是把前两个数调了个位置。"
  },
  {
   "t": "p",
   "html": "三根轴有两种摆法，数学统一用<b>右手系</b>（right-handed frame）：右手四指从 $+x$ 弯向 $+y$，拇指自然指向 $+z$。现在就伸手试一下，这个动作记住了，以后判断叉积方向会省很多事。<br>三张坐标平面把空间切成 8 块，每块叫一个<b>卦限</b>（octant），名字借自平面的「象限」，三坐标全为正的那块是第一卦限。几个常见说法顺便认一下：$z\\ge0$ 是 $xy$ 平面以上的半空间；$-1\\le y\\le1$ 是两张平行平面之间的一层「板」（slab）；而 $x=2$ 与 $y=3$ 两张平面一交，得到的是一条平行于 $z$ 轴的直线。"
  },
  {
   "t": "tex",
   "tex": "|P_1P_2|=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "第一步：先在底面上看",
     "html": "从 $P_1$ 走到 $P_2$ 的正下方。横向挪了 $\\Delta x=x_2-x_1$，纵向挪了 $\\Delta y=y_2-y_1$。这两个数张成一个平面上的直角三角形，斜边是 $\\sqrt{\\Delta x^2+\\Delta y^2}$。"
    },
    {
     "title": "第二步：再竖起来看",
     "html": "从那个落脚点升到 $P_2$，升高了 $\\Delta z=z_2-z_1$。现在有了第二个直角三角形：两条直角边分别是上一步的斜边和 $\\Delta z$，而斜边正是我们要的 $|P_1P_2|$。"
    },
    {
     "title": "第三步：再用一次勾股定理",
     "html": "$|P_1P_2|^2=\\left(\\Delta x^2+\\Delta y^2\\right)+\\Delta z^2$，两边开方就是公式。所以三维距离公式不是新东西，只是<b>勾股定理用了两次</b>。"
    }
   ]
  },
  {
   "t": "p",
   "html": "平面上「到定点距离相等」的点组成一个圆。空间里同样的条件，得到的是一整张<b>球面</b>（sphere）。把距离公式两边平方，就得到球面方程。"
  },
  {
   "t": "tex",
   "tex": "(x-x_0)^2+(y-y_0)^2+(z-z_0)^2=a^2"
  },
  {
   "t": "p",
   "html": "这里 $(x_0,y_0,z_0)$ 是<b>球心</b>，$a$ 是<b>半径</b>。注意右边的数是半径的平方：读到 $=25$ 时半径是 $5$，不是 $25$。<br>题目给的方程常常是展开的，比如 $x^2+y^2+z^2+3x-4z+1=0$。这时要先<b>配方</b>，把一次项收回括号里。手法和平面上的圆完全一样：$x^2+3x=\\left(x+\\frac32\\right)^2-\\frac94$，$z^2-4z=(z-2)^2-4$。代回去整理得 $\\left(x+\\frac32\\right)^2+y^2+(z-2)^2=\\frac{21}{4}$，于是球心是 $\\left(-\\frac32,0,2\\right)$，半径是 $\\frac{\\sqrt{21}}{2}$。<br>最容易错的是右边那个常数。原式移项后右边是 $\\frac94+4-1=\\frac{21}{4}$，不是 $\\frac{29}{4}$——减掉的那部分要加回来，而留下来的常数项 $+1$ 要减掉。"
  },
  {
   "t": "quiz",
   "qid": "ch11-q1"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "距离",
     "html": "三维距离公式 $=$ 勾股定理用两次。$\\Delta x,\\Delta y,\\Delta z$ 各自平方，相加，再开方。"
    },
    {
     "title": "球面",
     "html": "标准式右边是<b>半径的平方</b>；一般式先配方，配方时「加进去多少就要减掉多少」。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "11.2 向量：会平移的箭头（Vectors）",
   "id": "ch11-s3"
  },
  {
   "t": "callout",
   "kind": "tip",
   "title": "先想一想",
   "html": "<p>一支箭头平移之后，起点的坐标变了，终点的坐标也变了。那什么东西<b>没有</b>变？</p>"
  },
  {
   "t": "p",
   "html": "把箭头的尾巴放在原点，尖端落在 $(v_1,v_2,v_3)$。这三个数就唯一确定了这支箭头，记作 $\\mathbf v=\\langle v_1,v_2,v_3\\rangle$。尖括号 $\\langle\\ \\rangle$ 只是「这是一个向量」的记号，和点的圆括号 $(x,y,z)$ 区分开——数字可能一样，但一个是位置，一个是箭头。<br>另一套写法用 $\\mathbf i,\\mathbf j,\\mathbf k$：$\\mathbf i=\\langle1,0,0\\rangle$ 是沿 $x$ 轴正方向的<b>单位箭头</b>，$\\mathbf j=\\langle0,1,0\\rangle$ 沿 $y$ 轴，$\\mathbf k=\\langle0,0,1\\rangle$ 沿 $z$ 轴。这三个叫<b>标准基向量</b>（standard basis vectors）。于是"
  },
  {
   "t": "tex",
   "tex": "\\mathbf v=v_1\\mathbf i+v_2\\mathbf j+v_3\\mathbf k=\\langle v_1,v_2,v_3\\rangle"
  },
  {
   "t": "p",
   "html": "读作「沿 $x$ 走 $v_1$、沿 $y$ 走 $v_2$、沿 $z$ 走 $v_3$」。两种写法随时可以互换，后面看哪个方便就用哪个：算点积用尖括号顺手，讲方向用 $\\mathbf i,\\mathbf j,\\mathbf k$ 更像「走了几步」。<br>两支向量相等，当且仅当长度相同、方向相同——和它们画在哪儿无关。所以 $\\langle1,2,3\\rangle$ 可以画在原点，也可以画在任意一点出发，都是同一支向量。<br>已知两点 $P_1(x_1,y_1,z_1)$、$P_2(x_2,y_2,z_2)$，从 $P_1$ 指向 $P_2$ 的向量是「终点减起点」：$\\overrightarrow{P_1P_2}=\\langle x_2-x_1,\\ y_2-y_1,\\ z_2-z_1\\rangle$。这个顺序千万别反，反了整支箭头掉头，后面的投影、夹角、距离会一路错到底。"
  },
  {
   "t": "p",
   "html": "加法就是「接力走」：$\\mathbf u+\\mathbf v=\\langle u_1+v_1,\\ u_2+v_2,\\ u_3+v_3\\rangle$。几何上，把 $\\mathbf v$ 的尾巴接到 $\\mathbf u$ 的头上，从 $\\mathbf u$ 的尾巴到 $\\mathbf v$ 的头就是和；如果两支箭头共起点，和就是以它们为邻边的平行四边形的对角线，这叫<b>平行四边形法则</b>。<br>数乘是「拉长或缩短」：$k\\mathbf u=\\langle ku_1,ku_2,ku_3\\rangle$。$k\\gt1$ 拉长，$0\\lt k\\lt1$ 缩短，$k\\lt0$ 还要掉头。长度按 $|k|$ 倍变：$|k\\mathbf u|=|k||\\mathbf u|$。注意这里 $|k|$ 带绝对值——$k=-2$ 时长度是 $2$ 倍，不是 $-2$ 倍。<br>减法 $\\mathbf u-\\mathbf v$ 就是 $\\mathbf u+(-\\mathbf v)$，几何上从 $\\mathbf v$ 的头指向 $\\mathbf u$ 的头。"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "第一步：算长度",
     "html": "$\\mathbf v=\\langle v_1,v_2,v_3\\rangle$ 的<b>模</b>（magnitude，记作 $|\\mathbf v|$）就是箭头有多长。把原点当起点、尖端当终点，用两点距离公式：$|\\mathbf v|=\\sqrt{v_1^2+v_2^2+v_3^2}$。"
    },
    {
     "title": "第二步：只留方向",
     "html": "把一支箭头除以它自己的长度，长度就变成 1，方向一点没动。所以 $\\dfrac{\\mathbf v}{|\\mathbf v|}$ 是与 $\\mathbf v$ <b>同向的单位向量</b>（unit vector），这一步叫单位化。"
    },
    {
     "title": "第三步：长度与方向合成",
     "html": "想要「与 $\\mathbf v$ 同向、长度为 $k$」的向量，就拿单位向量乘 $k$：$k\\dfrac{\\mathbf v}{|\\mathbf v|}$。反过来，任何非零向量都能拆成「长度 $\\times$ 方向」，这条分解式是后面所有几何题的通用套路。"
    }
   ]
  },
  {
   "t": "tex",
   "tex": "\\mathbf v=|\\mathbf v|\\cdot\\frac{\\mathbf v}{|\\mathbf v|}\\qquad(\\mathbf v\\ne\\mathbf 0),\\qquad \\left|\\frac{\\mathbf v}{|\\mathbf v|}\\right|=1"
  },
  {
   "t": "p",
   "html": "符号逐个看：左边 $\\mathbf v$ 是箭头，右边是一个数 $|\\mathbf v|$ 乘一支单位箭头，两边都是箭头，账对得上。$\\mathbf v\\ne\\mathbf 0$ 这个条件不能省：零向量的长度是 0，用它做分母没有意义，而且零向量是唯一没有确定方向的向量。<br>顺便记住中点公式：两点中点就是把两端坐标各取平均，$M=\\left(\\frac{x_1+x_2}{2},\\frac{y_1+y_2}{2},\\frac{z_1+z_2}{2}\\right)$。道理很直白——从 $P_1$ 出发，走 $\\overrightarrow{P_1P_2}$ 的一半，正好停在中间。"
  },
  {
   "t": "quiz",
   "qid": "ch11-q3"
  },
  {
   "t": "quiz",
   "qid": "ch11-q4"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "向量是什么",
     "html": "长度 $+$ 方向，位置无关。平移到原点后，三个分量就是它的身份证；$\\overrightarrow{P_1P_2}$ 一律「终点减起点」。"
    },
    {
     "title": "怎么变长度",
     "html": "单位化 $=$ 除以自己的长度；「同向、长 $k$」$=k$ 乘单位向量。模长别忘最后开方。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "11.3 点积：两个方向有多一致（The Dot Product）",
   "id": "ch11-s4"
  },
  {
   "t": "p",
   "html": "一个人用绳子拉箱子，绳子与地面成 $60^\\circ$。他使的力只有一部分真的在「往前拉」，另一部分在「往上提」，白白浪费。到底有多少力气用在了前进上？这个问题逼出了点积（dot product）：它不问「力有多大」，而问「力有多大比例顺着这个方向」。"
  },
  {
   "t": "tex",
   "tex": "\\mathbf u\\cdot\\mathbf v=u_1v_1+u_2v_2+u_3v_3"
  },
  {
   "t": "p",
   "html": "中间的「$\\cdot$」读作「点」，所以叫<b>点积</b>。算法是「对应分量相乘，再全部相加」。注意结果是一个<b>数</b>（标量），不是向量——这是点积和叉积最容易搞混的地方，做题前先看清题目要的是「值」还是「向量」。<br>可这个式子看起来和角度毫无关系，它凭什么能回答「方向有多一致」？答案藏在下面这条等式里：同一件事有两种算法，一种按坐标算，一种按几何算，它们相等。"
  },
  {
   "t": "tex",
   "tex": "\\mathbf u\\cdot\\mathbf v=|\\mathbf u||\\mathbf v|\\cos\\theta"
  },
  {
   "t": "p",
   "html": "逐字读：$|\\mathbf u|$、$|\\mathbf v|$ 是两支箭头的长度，都是正数；$\\theta$ 是它们夹在中间的那个角，取值范围 $0$ 到 $\\pi$；$\\cos\\theta$ 就是「两个方向有多一致」的分数。同向时 $\\cos0=1$，点积取到最大；垂直时 $\\cos90^\\circ=0$，点积为零；反向时 $\\cos180^\\circ=-1$，点积最负。所以点积的<b>符号</b>就够判断锐角还是钝角，根本不用算出角度。"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "第一步：想清楚要证什么",
     "html": "要证 $u_1v_1+u_2v_2+u_3v_3=|\\mathbf u||\\mathbf v|\\cos\\theta$。左边是坐标，右边是几何量，两边都不像能直接变形。于是换一个中间人：第三边 $|\\mathbf u-\\mathbf v|^2$，它同时能用坐标和余弦定理算。"
    },
    {
     "title": "第二步：按坐标展开第三边",
     "html": "$|\\mathbf u-\\mathbf v|^2=(u_1-v_1)^2+(u_2-v_2)^2+(u_3-v_3)^2$。把每个平方拆开：$=|\\mathbf u|^2+|\\mathbf v|^2-2(u_1v_1+u_2v_2+u_3v_3)$。"
    },
    {
     "title": "第三步：按余弦定理展开同一条边",
     "html": "在由 $\\mathbf u,\\mathbf v,\\mathbf u-\\mathbf v$ 围成的三角形里，$|\\mathbf u-\\mathbf v|^2=|\\mathbf u|^2+|\\mathbf v|^2-2|\\mathbf u||\\mathbf v|\\cos\\theta$。"
    },
    {
     "title": "第四步：两边相减",
     "html": "两个式子右边相等，把 $|\\mathbf u|^2+|\\mathbf v|^2$ 消掉，两边同除 $-2$，立刻得到 $u_1v_1+u_2v_2+u_3v_3=|\\mathbf u||\\mathbf v|\\cos\\theta$。证完。这条推导说明点积的「坐标算法」和「角度算法」是同一件事的两种写法。"
    }
   ]
  },
  {
   "t": "p",
   "html": "这条等式一口气给我们三件东西。<b>求夹角</b>：把 $\\cos\\theta$ 解出来，$\\theta=\\cos^{-1}\\dfrac{\\mathbf u\\cdot\\mathbf v}{|\\mathbf u||\\mathbf v|}$，结果永远落在 $[0,\\pi]$ 里。<b>判垂直</b>：两支非零向量垂直，等价于点积为零，因为只有 $\\cos90^\\circ=0$。垂直在英文里叫 orthogonal 或 perpendicular，混着用都行。<b>判锐钝</b>：点积为正说明夹角小于 $90^\\circ$，为负说明大于 $90^\\circ$。<br>另外记住点积的运算律：交换顺序不变 $\\mathbf u\\cdot\\mathbf v=\\mathbf v\\cdot\\mathbf u$；常数可以随便挪 $(c\\mathbf u)\\cdot\\mathbf v=c(\\mathbf u\\cdot\\mathbf v)$；可以分配 $\\mathbf u\\cdot(\\mathbf v+\\mathbf w)=\\mathbf u\\cdot\\mathbf v+\\mathbf u\\cdot\\mathbf w$；自己点自己得长度的平方 $\\mathbf u\\cdot\\mathbf u=|\\mathbf u|^2$。最后这条在化简含模长的式子时特别顺手。"
  },
  {
   "t": "theorem",
   "name": "点积的夹角公式",
   "rows": [
    {
     "k": "白话",
     "html": "两支箭头的点积，等于「两个长度相乘」再乘上「方向一致的程度」。"
    },
    {
     "k": "条件",
     "html": "$\\mathbf u,\\mathbf v$ 都不能是零向量，否则夹角没有定义。"
    },
    {
     "k": "结论",
     "html": "$\\cos\\theta=\\dfrac{\\mathbf u\\cdot\\mathbf v}{|\\mathbf u||\\mathbf v|}$，其中 $\\theta\\in[0,\\pi]$ 是两向量的夹角。"
    },
    {
     "k": "怎么用",
     "html": "先算点积，再算两个模，相除后取反余弦。题目问「是否垂直」只看点积是否为零；问「锐角还是钝角」只看点积的符号。"
    }
   ]
  },
  {
   "t": "p",
   "html": "太阳在正上方，一根斜杆在地上投下影子。影子就是杆子「顺着地面方向」的那一部分。数学上把这件事做成<b>投影</b>（projection）：把 $\\mathbf u$ 拆成两块，一块平行于 $\\mathbf v$（影子），一块垂直于 $\\mathbf v$（剩下的高度）。<br>影子有多长？用点积就能量出来：$\\mathbf u\\cdot\\dfrac{\\mathbf v}{|\\mathbf v|}=|\\mathbf u|\\cos\\theta$，这正是影子带正负号的长度，叫<b>标量分量</b>（scalar component）。它可以是负数——夹角是钝角时，影子其实落在反方向。"
  },
  {
   "t": "tex",
   "tex": "\\operatorname{proj}_{\\mathbf v}\\mathbf u=\\frac{\\mathbf u\\cdot\\mathbf v}{|\\mathbf v|^2}\\,\\mathbf v,\\qquad \\text{标量分量}=|\\mathbf u|\\cos\\theta=\\frac{\\mathbf u\\cdot\\mathbf v}{|\\mathbf v|}"
  },
  {
   "t": "p",
   "html": "符号逐个看：$\\operatorname{proj}_{\\mathbf v}\\mathbf u$ 读作「$\\mathbf u$ 在 $\\mathbf v$ 上的投影」，下标 $\\mathbf v$ 说明「往谁身上投」，整个结果是一支<b>向量</b>，方向和 $\\mathbf v$ 相同或相反。前面那个系数 $\\dfrac{\\mathbf u\\cdot\\mathbf v}{|\\mathbf v|^2}$ 是一个数，它告诉你「要取几个 $\\mathbf v$」——取 2 个就是两倍长，取 $-0.5$ 个就是反向一半长。<br>分母为什么是 $|\\mathbf v|^2$ 而不是 $|\\mathbf v|$？因为最后还要乘一整支 $\\mathbf v$，长度会自动补回来：$\\dfrac{\\mathbf u\\cdot\\mathbf v}{|\\mathbf v|^2}\\cdot|\\mathbf v|=\\dfrac{\\mathbf u\\cdot\\mathbf v}{|\\mathbf v|}$，正好是标量分量。<br>做题时看清问的是哪一个：问「投影」交一支箭头，问「投影长度」交一个非负数，问「分量」通常交带符号的数。三种问法答案都不一样。"
  },
  {
   "t": "quiz",
   "qid": "ch11-q5"
  },
  {
   "t": "quiz",
   "qid": "ch11-q6"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "点积在问什么",
     "html": "点积出<b>数</b>，问的是「两个方向有多一致」。等于 0 就是垂直，为正锐角，为负钝角。"
    },
    {
     "title": "投影怎么算",
     "html": "影子长度 $=\\dfrac{\\mathbf u\\cdot\\mathbf v}{|\\mathbf v|}$；投影向量 $=$ 影子长度再乘上 $\\mathbf v$ 的单位方向，即 $\\dfrac{\\mathbf u\\cdot\\mathbf v}{|\\mathbf v|^2}\\mathbf v$。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "11.4 叉积：用右手造出第三个方向（The Cross Product）",
   "id": "ch11-s5"
  },
  {
   "t": "p",
   "html": "拧螺丝的时候，扳手的把手从转轴伸向你的手，你顺着与把手垂直的方向推，螺丝却沿着轴往里走。把手的方向、用力的方向、螺丝前进的方向，三者两两垂直。这种「由两个方向造出第三个方向」的操作，就是叉积（cross product）。"
  },
  {
   "t": "tex",
   "tex": "\\mathbf u\\times\\mathbf v=\\bigl(|\\mathbf u||\\mathbf v|\\sin\\theta\\bigr)\\,\\mathbf n"
  },
  {
   "t": "p",
   "html": "这个式子把叉积拆成两半。<b>大小</b>是 $|\\mathbf u||\\mathbf v|\\sin\\theta$，$\\theta$ 还是两向量的夹角；这里用 $\\sin$ 而不是 $\\cos$，因为它量的是「两支箭头张开的程度」——垂直时张得最开，$\\sin90^\\circ=1$，平行时合上了，$\\sin0^\\circ=0$。<b>方向</b>是 $\\mathbf n$，一支同时垂直于 $\\mathbf u$ 和 $\\mathbf v$ 的<b>单位</b>向量。符号「$\\times$」读作「叉」，所以叫叉积。<br>$\\mathbf n$ 其实有两个相反的选择，数学规定用<b>右手定则</b>（right-hand rule）挑一个：右手四指从 $\\mathbf u$ 弯向 $\\mathbf v$，拇指指的就是 $\\mathbf n$。所以 $\\mathbf u\\times\\mathbf v$ 与 $\\mathbf v\\times\\mathbf u$ 是两支方向相反的箭头，大小完全一样。"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "第一步：为什么还需要一个坐标公式",
     "html": "上面那个定义要先知道夹角和 $\\mathbf n$，可实际算题时这两样都没有，手里只有分量。所以需要一条能直接用分量算出结果的公式。"
    },
    {
     "title": "第二步：摆成三阶行列式",
     "html": "把 $\\mathbf i,\\mathbf j,\\mathbf k$ 摆第一行，$\\mathbf u$ 的三个分量第二行，$\\mathbf v$ 的三个分量第三行。按第一行展开，正负号 $+,-,+$ 交替。"
    },
    {
     "title": "第三步：写 $\\mathbf i$ 的系数",
     "html": "划掉 $\\mathbf i$ 所在的行和列，剩下二阶行列式 $\\begin{vmatrix}u_2&amp;u_3\\\\v_2&amp;v_3\\end{vmatrix}=u_2v_3-u_3v_2$。"
    },
    {
     "title": "第四步：写 $\\mathbf j$ 的系数（带负号）",
     "html": "划掉 $\\mathbf j$ 所在的行和列，剩下 $\\begin{vmatrix}u_1&amp;u_3\\\\v_1&amp;v_3\\end{vmatrix}=u_1v_3-u_3v_1$，前面<b>要加一个负号</b>。这一步是全场最容易漏的地方。"
    },
    {
     "title": "第五步：写 $\\mathbf k$ 的系数",
     "html": "剩下 $\\begin{vmatrix}u_1&amp;u_2\\\\v_1&amp;v_2\\end{vmatrix}=u_1v_2-u_2v_1$，符号为正。三块拼起来，就是下面的完整公式。"
    }
   ]
  },
  {
   "t": "tex",
   "tex": "\\mathbf u\\times\\mathbf v=\\begin{vmatrix}\\mathbf i&\\mathbf j&\\mathbf k\\\\u_1&u_2&u_3\\\\v_1&v_2&v_3\\end{vmatrix}=(u_2v_3-u_3v_2)\\mathbf i-(u_1v_3-u_3v_1)\\mathbf j+(u_1v_2-u_2v_1)\\mathbf k"
  },
  {
   "t": "p",
   "html": "再强调一次 $\\mathbf j$ 项：它等于「减去 $u_1v_3-u_3v_1$」。写成加号是最常见的错误。更麻烦的是，如果这一项恰好算出来是 0（后面的例题 1 就是这样），你写错符号也看不出来——所以别靠「答案对不对」来检查这一步，要靠规范展开的习惯。<br>叉积不满足交换律，交换两支箭头会整体变号：$\\mathbf v\\times\\mathbf u=-(\\mathbf u\\times\\mathbf v)$。原因就是右手定则：手从 $\\mathbf v$ 弯向 $\\mathbf u$，拇指正好指向反面。它也不满足结合律，$(\\mathbf u\\times\\mathbf v)\\times\\mathbf w$ 一般不等于 $\\mathbf u\\times(\\mathbf v\\times\\mathbf w)$，所以叉积之间不要随便挪括号。<br>三个基向量之间有固定关系：$\\mathbf i\\times\\mathbf j=\\mathbf k$、$\\mathbf j\\times\\mathbf k=\\mathbf i$、$\\mathbf k\\times\\mathbf i=\\mathbf j$，正好顺着 $x\\to y\\to z\\to x$ 转一圈；反过来写就要加负号。自己叉自己得零向量：$\\mathbf i\\times\\mathbf i=\\mathbf j\\times\\mathbf j=\\mathbf k\\times\\mathbf k=\\mathbf 0$。"
  },
  {
   "t": "p",
   "html": "叉积的大小里有个 $\\sin\\theta$。两支箭头<b>平行</b>时夹角是 $0$ 或 $\\pi$，$\\sin\\theta=0$，叉积就是零向量；反过来，叉积为零向量也说明 $\\sin\\theta=0$，只能平行。于是得到一个非常好用的判据：<b>平行 $\\iff$ 叉积 $=\\mathbf 0$</b>。<br>它和点积正好配对：点积为零管<b>垂直</b>，叉积为零管<b>平行</b>。这两条一左一右，是本章所有判定题的两把钥匙。做判定题时先问自己：题目要比的是「夹角是不是 $90^\\circ$」还是「方向是不是一样」？问清了，用哪个就定了。"
  },
  {
   "t": "tex",
   "tex": "|\\mathbf u\\times\\mathbf v|=|\\mathbf u||\\mathbf v|\\sin\\theta,\\qquad S_{\\text{平行四边形}}=|\\mathbf u\\times\\mathbf v|,\\qquad S_\\triangle=\\tfrac12\\,\\bigl|\\overrightarrow{PQ}\\times\\overrightarrow{PR}\\bigr|"
  },
  {
   "t": "p",
   "html": "为什么大小就是面积？把 $\\mathbf u$ 当底，底长 $|\\mathbf u|$；再把 $\\mathbf v$ 拆成「沿 $\\mathbf u$ 的影子」和「垂直于 $\\mathbf u$ 的高」，高就是 $|\\mathbf v|\\sin\\theta$。底乘高正好是 $|\\mathbf u||\\mathbf v|\\sin\\theta$，也就是叉积的大小。三角形是平行四边形的一半，所以再乘 $\\frac12$。<br>把叉积和点积接起来，还能算体积。$\\mathbf u\\times\\mathbf v$ 垂直于底面，它的长度就是底面积；再和 $\\mathbf w$ 做点积，得到「底面积 $\\times$ 高」，正是平行六面体的体积。这个组合叫<b>三重积</b>（triple scalar product），也叫盒积：$$(\\mathbf u\\times\\mathbf v)\\cdot\\mathbf w=\\begin{vmatrix}u_1&amp;u_2&amp;u_3\\\\v_1&amp;v_2&amp;v_3\\\\w_1&amp;w_2&amp;w_3\\end{vmatrix}$$ 体积要取绝对值（点积可能为负）；四面体是它的 $\\frac16$；三个向量共面时高为 0，三重积就是 0。三个向量轮换位置结果不变，这条性质常用来验算。<br>物理里的力矩也是叉积：$\\boldsymbol\\tau=\\mathbf r\\times\\mathbf F$，$\\mathbf r$ 是从转轴指向受力点的箭头，$\\mathbf F$ 是力。扳手越长、力越垂直于扳手，力矩越大；力要是正好沿着扳手方向（$\\theta=0$），$\\sin\\theta=0$，怎么推都拧不动。"
  },
  {
   "t": "lab",
   "id": "dotcross"
  },
  {
   "t": "quiz",
   "qid": "ch11-q7"
  },
  {
   "t": "quiz",
   "qid": "ch11-q8"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "叉积在问什么",
     "html": "叉积出<b>箭头</b>：方向同时垂直于两者（右手定则），大小是它们张成的平行四边形面积。"
    },
    {
     "title": "两个判据别弄反",
     "html": "点积为零 $\\iff$ 垂直；叉积为零 $\\iff$ 平行。判定题先问「比夹角还是比较方向」。"
    },
    {
     "title": "展开口诀",
     "html": "$\\mathbf i$ 正、$\\mathbf j$ 负、$\\mathbf k$ 正；行序是「基向量、$\\mathbf u$、$\\mathbf v$」，换行就变号。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "11.5 平面与直线：一个点加一支箭头（Lines and Planes in Space）",
   "id": "ch11-s6"
  },
  {
   "t": "callout",
   "kind": "tip",
   "title": "先想一想",
   "html": "<p>一张无限大的平面，要几个条件才能把它「钉死」？给它两个躺在平面里的方向够不够？如果改给一个垂直于它的方向呢？</p>"
  },
  {
   "t": "p",
   "html": "想象一块无限大的玻璃板。怎样一句话说清它朝哪边？给它一个「面内方向」没用——面内方向有无数个，说哪一个都不够。真正管用的是<b>垂直</b>于它的方向：只要指出「板的法线朝哪」，板的姿态就定了。<br>这个垂直于平面的向量叫<b>法向量</b>（normal vector），习惯记作 $\\mathbf n$。于是钉死一张平面只需要两件事：板上一个点 $P_0(x_0,y_0,z_0)$，加一个法向量 $\\mathbf n=A\\mathbf i+B\\mathbf j+C\\mathbf k$。"
  },
  {
   "t": "p",
   "html": "为什么这就够了？在板上随便取一点 $P(x,y,z)$，从 $P_0$ 指向 $P$ 的向量 $\\overrightarrow{P_0P}$ 一定整支躺在板子里。躺在板子里，就意味着它和法向量垂直；而「垂直」用点积写出来就是零。于是「$P$ 在平面上」这句几何话，被翻译成了一个方程。"
  },
  {
   "t": "tex",
   "tex": "\\mathbf n\\cdot\\overrightarrow{P_0P}=0"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "第一步：写出板内那支箭头",
     "html": "$\\overrightarrow{P_0P}=\\langle x-x_0,\\ y-y_0,\\ z-z_0\\rangle$，仍然是「终点减起点」。"
    },
    {
     "title": "第二步：代进点积，让它等于零",
     "html": "$A(x-x_0)+B(y-y_0)+C(z-z_0)=0$。这一步叫<b>点法式</b>，名字就说明了它需要什么：一个点、一个法向量。"
    },
    {
     "title": "第三步：拆括号，常数挪到右边",
     "html": "$Ax+By+Cz=Ax_0+By_0+Cz_0$。右边那一团全是常数，记作 $D$。"
    },
    {
     "title": "第四步：得到一般式",
     "html": "$Ax+By+Cz=D$。它最好用的地方是：$x,y,z$ 前面的三个系数，原封不动就是法向量的三个分量。"
    }
   ]
  },
  {
   "t": "p",
   "html": "所以看到 $2x-y+3z=6$，你可以立刻说出法向量是 $\\langle2,-1,3\\rangle$，一个计算都不用做。反过来，知道法向量和一点，也能立刻写出方程：过 $(1,0,4)$、法向量 $\\langle2,-1,3\\rangle$ 的平面是 $2(x-1)-(y-0)+3(z-4)=0$，整理成 $2x-y+3z=14$。<br>注意点法式里的<b>符号</b>：点是 $(-3,0,7)$ 时，要写 $A(x+3)$、$C(z-7)$，括号里是「坐标减去点的坐标」。<br>还有两种特殊情况：平面过原点时 $D=0$；三张坐标平面分别是 $z=0$、$y=0$、$x=0$，它们的法向量就是 $\\mathbf k,\\mathbf j,\\mathbf i$。"
  },
  {
   "t": "table",
   "head": [
    "形式",
    "表达式",
    "什么时候用它"
   ],
   "rows": [
    [
     "向量式",
     "$\\mathbf r(t)=\\mathbf r_0+t\\mathbf v,\\ -\\infty\\lt t\\lt\\infty$",
     "推公式；$\\mathbf v$ 就是「每秒往哪走」"
    ],
    [
     "参数式",
     "$x=x_0+tv_1,\\ y=y_0+tv_2,\\ z=z_0+tv_3$",
     "求交点：把三个式子代进平面方程解 $t$"
    ],
    [
     "对称式",
     "$\\dfrac{x-x_0}{v_1}=\\dfrac{y-y_0}{v_2}=\\dfrac{z-z_0}{v_3}$",
     "一眼读出方向数；某个分母为 0 时，那个分子单独写成等式"
    ]
   ]
  },
  {
   "t": "p",
   "html": "直线比平面简单：它只需要一个点和一个<b>方向向量</b>（direction vector）$\\mathbf v$。方向向量可以取直线上任意两点相减，也可以从参数式里直接读系数。三种写法是同一件事的三件外衣：向量式适合推公式，参数式适合求交点，对称式适合一眼看出方向数。<br>参数式里的 $t$ 是一个可以随便取的数，每取一个就得到一个点。所以「线段」只要把 $t$ 关在某个区间里，比如 $0\\le t\\le1$，两端点分别对应 $t=0$ 和 $t=1$。<br>同一根直线有无穷多种参数化：换个基点，或者把 $t$ 换成 $2t$，写的还是那根线。所以题目给的答案和你算的不一样，不一定是错。对称式里如果某个分母为 0（说明该方向分量为 0，直线平行于某张坐标平面），分式不能写，要把那个分子单独写成等式，例如 $\\dfrac{x-1}{2}=\\dfrac{z+3}{-1},\\ y=2$。"
  },
  {
   "t": "p",
   "html": "点到平面的距离，本质上是「垂直于平面的那一段有多长」。从点 $S$ 往平面上任意一点 $P_0$ 连一条斜线 $\\overrightarrow{P_0S}$，这条斜线不是距离；只有把它<b>投影</b>到法向量方向上，剩下的才是真正的垂直距离。这就是公式里出现「点积除以 $|\\mathbf n|$」的原因。"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "第一步：在平面上随便取一点",
     "html": "取 $P_0$ 就行，取哪个都可以——因为平面上所有点代进最后那条公式，算出来的结果一样。连出 $\\overrightarrow{P_0S}$。"
    },
    {
     "title": "第二步：把斜线拆成两块",
     "html": "一块垂直于平面（真正算距离的那块），一块平行于平面（在板上滑来滑去，对距离没有贡献）。只要垂直那块。"
    },
    {
     "title": "第三步：用投影量出垂直那块",
     "html": "垂直那块的长度 $=\\left|\\overrightarrow{P_0S}\\cdot\\dfrac{\\mathbf n}{|\\mathbf n|}\\right|$。这里 $\\dfrac{\\mathbf n}{|\\mathbf n|}$ 是单位法向量，点积就是「$\\overrightarrow{P_0S}$ 在法线方向上的投影长度」。加绝对值是因为投影可能为负，而距离永远非负。"
    },
    {
     "title": "第四步：把 $P_0$ 消掉",
     "html": "代入 $\\overrightarrow{P_0S}=\\langle x_1-x_0,\\ y_1-y_0,\\ z_1-z_0\\rangle$，再用 $Ax_0+By_0+Cz_0=D$ 把含 $P_0$ 的项合并，$P_0$ 就消失了，只剩点 $S$ 的坐标和 $D$。这说明距离与「在平面上取哪一点」无关。"
    }
   ]
  },
  {
   "t": "theorem",
   "name": "点到平面的距离",
   "rows": [
    {
     "k": "白话",
     "html": "把「点到平面上某一点的斜线」投影到法向量上，剩下的那一段就是距离。"
    },
    {
     "k": "条件",
     "html": "平面写成 $Ax+By+Cz=D$，点为 $S(x_1,y_1,z_1)$。"
    },
    {
     "k": "结论",
     "html": "$d=\\dfrac{|Ax_1+By_1+Cz_1-D|}{\\sqrt{A^2+B^2+C^2}}$。"
    },
    {
     "k": "怎么用",
     "html": "先把平面化成 $Ax+By+Cz-D=0$ 的形式再代，$D$ 的符号最容易错。分母是法向量的长度。两张平行平面（法向量系数先统一）之间的距离是 $\\dfrac{|D_1-D_2|}{\\sqrt{A^2+B^2+C^2}}$。"
    }
   ]
  },
  {
   "t": "p",
   "html": "分子为什么带绝对值？因为点在平面哪一侧都有可能，点积算出来是负数，而距离不能是负的。<br>分母 $\\sqrt{A^2+B^2+C^2}$ 就是 $|\\mathbf n|$，它负责把「点积」换算成「真正的长度」。如果忘了除，你算出来的其实是「沿着法向量走了几个 $|\\mathbf n|$」，不是一个长度。<br>两张平行平面之间的距离更省事：先把两个方程的法向量系数调成一样，再算 $\\dfrac{|D_1-D_2|}{|\\mathbf n|}$。系数没统一就套公式，是这一类题最常见的错。"
  },
  {
   "t": "p",
   "html": "点到直线用的是<b>叉积</b>，不是点积。把直线上一点 $P$ 到目标点 $S$ 的向量 $\\overrightarrow{PS}$ 与方向向量 $\\mathbf v$ 一叉，得到的新向量长度是 $|\\overrightarrow{PS}||\\mathbf v|\\sin\\varphi$；而 $|\\overrightarrow{PS}|\\sin\\varphi$ 正是 $S$ 到直线的垂直距离（$\\varphi$ 是 $\\overrightarrow{PS}$ 与 $\\mathbf v$ 的夹角）。两边同除 $|\\mathbf v|$，就得到 $d=\\dfrac{|\\overrightarrow{PS}\\times\\mathbf v|}{|\\mathbf v|}$。所以「点到平面投到 $\\mathbf n$，点到直线投到 $\\mathbf v$」，一个用点积、一个用叉积，别用混。<br>两条空间直线的关系只有三种。<b>平行</b>：方向向量成比例，等价于 $\\mathbf v_1\\times\\mathbf v_2=\\mathbf 0$。<b>相交</b>：不平行，而且联立参数式能解出同一组 $t,s$。<b>异面</b>（skew）：不平行也不相交，两条线不在同一张平面上，看起来「错开」了。<br>判异面最省事的办法是三重积：算 $(\\mathbf v_1\\times\\mathbf v_2)\\cdot\\overrightarrow{P_1P_2}$，它等于 0 说明两个方向与连线共面（会相交），不等于 0 就是异面。真的异面时，两条线之间的最短距离是 $d=\\dfrac{|(\\mathbf v_1\\times\\mathbf v_2)\\cdot\\overrightarrow{P_1P_2}|}{|\\mathbf v_1\\times\\mathbf v_2|}$——分子是「盒子的体积」，分母是「底面积」，商就是高。"
  },
  {
   "t": "lab",
   "id": "planedist"
  },
  {
   "t": "quiz",
   "qid": "ch11-q9"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "平面怎么定",
     "html": "一个点 $+$ 一个法向量。$\\mathbf n\\cdot\\overrightarrow{P_0P}=0$ 展开就是 $Ax+By+Cz=D$，系数就是法向量。"
    },
    {
     "title": "距离怎么来",
     "html": "全部是投影：点到平面投到 $\\mathbf n$ 上（点积），点到直线投到 $\\mathbf v$ 的垂直方向（叉积）。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 3,
   "text": "11.6 二次曲面：看方程猜形状（Cylinders and Quadric Surfaces）",
   "id": "ch11-s7"
  },
  {
   "t": "p",
   "html": "先看一个不太像立体的方程：$y=x^2$。在平面上它是抛物线；在空间里，方程里没有 $z$，意思是「$z$ 想取什么都行」。于是把这条抛物线沿着 $z$ 轴方向推着走，扫出来的是一张像瓦楞纸一样的曲面——这叫<b>柱面</b>（cylinder），那条被推着走的曲线叫<b>生成曲线</b>（generating curve）。<br>记住这个判据：<b>方程里缺哪个变量，柱面就平行于哪条轴</b>。$y=x^2$ 缺 $z$，平行于 $z$ 轴；$x^2+y^2=1$ 缺 $z$，是圆柱面；$x^2+z^2=4$ 缺 $y$，平行于 $y$ 轴。<br>注意「柱面」不一定长得像柱子。抛物线推出来叫抛物柱面，正弦曲线推出来叫正弦柱面，只要是「一条曲线沿某个方向平移」扫出来的，都叫柱面。"
  },
  {
   "t": "p",
   "html": "如果三个变量都以二次的方式出现，图形叫<b>二次曲面</b>（quadric surface）。它们有六种基本形状，看着吓人，其实只要会两件事就能认出来：<b>配方</b>（把一次项收进括号，找到图形的中心）和<b>数符号</b>（看三个平方项前面是正还是负）。<br>画图不必真的画立体图。用<b>截痕法</b>（trace）：拿 $z=z_0$ 这样的平面去切它，看切出来的是椭圆、双曲线还是抛物线，再让 $z_0$ 变一变，形状就拼出来了。这相当于用一把刀把立体切成一片片薄片，看每片的轮廓。"
  },
  {
   "t": "steps",
   "items": [
    {
     "title": "第一步：按变量分组",
     "html": "把含 $x$ 的项放一起、含 $y$ 的放一起、含 $z$ 的放一起，纯常数留在最后。以 $x^2+y^2+4z^2-2x+4y+1=0$ 为例。"
    },
    {
     "title": "第二步：每组提公因数",
     "html": "$z$ 组的系数是 $4$，先提出来；$x,y$ 组的系数是 $1$，不用提。提的时候整组一起提，别漏掉一次项。"
    },
    {
     "title": "第三步：括号内配方",
     "html": "$x^2-2x=(x-1)^2-1$，$y^2+4y=(y+2)^2-4$。$4z^2$ 没有一次项，不用配。加进去的数是「一次项系数一半的平方」。"
    },
    {
     "title": "第四步：把减掉的常数挪到右边",
     "html": "$(x-1)^2-1+(y+2)^2-4+4z^2+1=0$，整理得 $(x-1)^2+(y+2)^2+4z^2=4$。常数 $-1-4+1=-4$ 挪过去变 $+4$。"
    },
    {
     "title": "第五步：右边化成 1，读类型",
     "html": "两边同除 $4$：$\\dfrac{(x-1)^2}{4}+\\dfrac{(y+2)^2}{4}+\\dfrac{z^2}{1}=1$。三项全正、右边为 $1$，是<b>椭球面</b>；中心 $(1,-2,0)$，三个半轴是 $2,2,1$。注意 $4z^2$ 除以 $4$ 得 $\\dfrac{z^2}{1}$，分母是 $1$ 而不是 $4$。"
    }
   ]
  },
  {
   "t": "table",
   "head": [
    "类型（英文）",
    "标准方程（$a,b,c\\gt 0$）",
    "图形与截面",
    "怎么认出来"
   ],
   "rows": [
    [
     "椭球面 ellipsoid",
     "$\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}+\\dfrac{z^2}{c^2}=1$",
     "封闭有界；三张坐标平面截出来都是椭圆",
     "三项全正、右边 $=1$、没有一次项；半轴 $=\\sqrt{\\text{分母}}$"
    ],
    [
     "椭圆抛物面 elliptical paraboloid",
     "$\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}=\\dfrac zc$",
     "沿 $z$ 轴开口的碗；水平截痕是椭圆，竖直截痕是抛物线",
     "两个平方项<b>同号</b>，第三个变量是<b>一次</b>；$c\\gt 0$ 开口朝 $+z$"
    ],
    [
     "椭圆锥面 elliptical cone",
     "$\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}=\\dfrac{z^2}{c^2}$",
     "顶点在原点；$z=\\pm c$ 截出同样的椭圆，$z=0$ 缩成一点",
     "三项俱全，两同号一<b>异号</b>，右边是 $0$"
    ],
    [
     "单叶双曲面 hyperboloid of one sheet",
     "$\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}-\\dfrac{z^2}{c^2}=1$",
     "<b>连通一片</b>，像一只细腰花瓶；水平截痕椭圆，竖直截痕双曲线",
     "两正一负、右边 $=1$；负号那个变量方向上曲面不断开"
    ],
    [
     "双叶双曲面 hyperboloid of two sheets",
     "$\\dfrac{z^2}{c^2}-\\dfrac{x^2}{a^2}-\\dfrac{y^2}{b^2}=1$",
     "<b>分成两片</b>；只有 $|z|\\ge c$ 才有截面，$z=\\pm c$ 各是一个顶点",
     "一正两负、右边 $=1$；正号那个变量方向被「切断」"
    ],
    [
     "双曲抛物面 hyperbolic paraboloid",
     "$\\dfrac{y^2}{b^2}-\\dfrac{x^2}{a^2}=\\dfrac zc$",
     "马鞍形；水平截痕是双曲线，竖直截痕是上下两条抛物线",
     "两个平方项<b>异号</b>，第三个变量是一次；原点叫<b>鞍点</b>"
    ]
   ]
  },
  {
   "t": "p",
   "html": "按这个顺序问自己三个问题，基本不会认错。<b>第一问：有没有变量缺失？</b>缺一个就是柱面，直接查缺的变量对应哪条轴。<b>第二问：有几个平方项？</b>三个平方项，就在椭球、单叶、双叶、锥面里挑；两个平方项加一个一次项，就是抛物面——两项同号是椭圆抛物面（碗），异号是双曲抛物面（马鞍）。<b>第三问：右边是几？</b>右边是 $1$ 且两正一负是单叶（连通一片），一正两负是双叶（断成两片），右边是 $0$ 则是锥面（在原点收成一个点）。<br>最后补一句：带 $(x-x_0)$ 这种一次项的，先配方平移到中心；如果方程里还出现 $xy$、$yz$ 这样的交叉项，那是图形被旋转了，本章不处理，遇到再说。"
  },
  {
   "t": "quiz",
   "qid": "ch11-q10"
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "柱面",
     "html": "方程缺哪个变量，曲面就平行于哪条轴。缺变量 $=$ 柱面，不是「没有这个方向」。"
    },
    {
     "title": "二次曲面",
     "html": "先配方找中心，再数平方项个数与符号：三正 $=1$ 椭球；两正一负 $=1$ 单叶；一正两负 $=1$ 双叶；两同号 $+$ 一次 $=$ 碗；两异号 $+$ 一次 $=$ 马鞍。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "例题：跟着做一遍",
   "id": "ch11-s8"
  },
  {
   "t": "example",
   "no": "1",
   "tag": "叉积、单位法向量与三角形面积（§11.4）",
   "fields": [
    {
     "k": "题目",
     "html": "设 $P(1,-1,0)$、$Q(2,1,-1)$、$R(-1,1,2)$，求 (a) $\\overrightarrow{PQ}\\times\\overrightarrow{PR}$；(b) 垂直于平面 $PQR$ 的单位向量；(c) $\\triangle PQR$ 的面积。"
    },
    {
     "k": "想一想",
     "html": "三个点就能定一张平面。怎么把「平面」变成向量？选同一个起点 $P$，连两条边 $\\overrightarrow{PQ}$、$\\overrightarrow{PR}$——它们都躺在平面里，所以它们的叉积一定垂直于平面，正好可以当法向量。先算边，再叉乘，最后取模。"
    },
    {
     "k": "解答",
     "html": "两条边都是「终点减起点」：$$\\overrightarrow{PQ}=\\langle2-1,\\ 1-(-1),\\ -1-0\\rangle=\\mathbf i+2\\mathbf j-\\mathbf k,\\qquad \\overrightarrow{PR}=\\langle-1-1,\\ 1-(-1),\\ 2-0\\rangle=-2\\mathbf i+2\\mathbf j+2\\mathbf k$$ 按第一行展开三阶行列式，$\\mathbf i$ 正、$\\mathbf j$ 负、$\\mathbf k$ 正：$$\\overrightarrow{PQ}\\times\\overrightarrow{PR}=\\begin{vmatrix}\\mathbf i&amp;\\mathbf j&amp;\\mathbf k\\\\1&amp;2&amp;-1\\\\-2&amp;2&amp;2\\end{vmatrix}=\\begin{vmatrix}2&amp;-1\\\\2&amp;2\\end{vmatrix}\\mathbf i-\\begin{vmatrix}1&amp;-1\\\\-2&amp;2\\end{vmatrix}\\mathbf j+\\begin{vmatrix}1&amp;2\\\\-2&amp;2\\end{vmatrix}\\mathbf k=(4+2)\\mathbf i-(2-2)\\mathbf j+(2+4)\\mathbf k=6\\mathbf i+6\\mathbf k$$ 再取模：$|\\overrightarrow{PQ}\\times\\overrightarrow{PR}|=\\sqrt{36+0+36}=6\\sqrt2$。单位法向量是两个方向任选一个：$$\\mathbf n=\\frac{6\\mathbf i+6\\mathbf k}{6\\sqrt2}=\\frac1{\\sqrt2}\\mathbf i+\\frac1{\\sqrt2}\\mathbf k$$ 面积是叉积模的一半：$$S_\\triangle=\\tfrac12\\cdot6\\sqrt2=3\\sqrt2$$"
    },
    {
     "k": "点评",
     "html": "本题的 $\\mathbf j$ 分量刚好算出来是 $0$，写不写负号都看不出来——这更说明规范展开的必要，别用「答案对不对」反推过程是否干净。另外注意：单位法向量有 $\\pm\\mathbf n$ 两支，题目不加限制时两个都对；若补一句「指向第一卦限」才需要挑符号。面积不受符号影响，永远是 $3\\sqrt2$。"
    }
   ]
  },
  {
   "t": "example",
   "no": "2",
   "tag": "过一点且平行于两条直线的平面（§11.5）",
   "fields": [
    {
     "k": "题目",
     "html": "求过点 $P_0(2,1,-1)$、且与直线 $L_1:x=-1+t,\\ y=2+t,\\ z=1-t$ 和 $L_2:x=1-4s,\\ y=1+2s,\\ z=2-2s$ 都平行的平面方程。"
    },
    {
     "k": "想一想",
     "html": "「平面平行于一条直线」的意思是：平面的法向量垂直于这条直线的方向向量。两条方向都要垂直，那法向量只能取它们的叉积——两个不平行的方向一叉，得到的正好是同时垂直于两者的那支箭头。"
    },
    {
     "k": "解答",
     "html": "从参数式直接读方向向量，$t$ 或 $s$ 前面的系数就是分量：$\\mathbf v_1=\\mathbf i+\\mathbf j-\\mathbf k$，$\\mathbf v_2=-4\\mathbf i+2\\mathbf j-2\\mathbf k$。$$\\mathbf n=\\mathbf v_1\\times\\mathbf v_2=\\begin{vmatrix}\\mathbf i&amp;\\mathbf j&amp;\\mathbf k\\\\1&amp;1&amp;-1\\\\-4&amp;2&amp;-2\\end{vmatrix}=\\begin{vmatrix}1&amp;-1\\\\2&amp;-2\\end{vmatrix}\\mathbf i-\\begin{vmatrix}1&amp;-1\\\\-4&amp;-2\\end{vmatrix}\\mathbf j+\\begin{vmatrix}1&amp;1\\\\-4&amp;2\\end{vmatrix}\\mathbf k=0\\mathbf i+6\\mathbf j+6\\mathbf k$$ 约去公因子，取 $\\mathbf n=\\mathbf j+\\mathbf k$。代入点法式（过 $P_0(2,1,-1)$）：$$0\\cdot(x-2)+(y-1)+(z+1)=0\\ \\Longrightarrow\\ \\boxed{y+z=0}$$"
    },
    {
     "k": "点评",
     "html": "$z=1-t$ 的系数是 $-1$，读方向向量时最常在这里写错（容易顺手写成 $+1$）。约束只有「平行」，所以平面不必包含这两条直线，只要求法向量同时垂直于两个方向。验算：把 $\\mathbf v_1,\\mathbf v_2$ 分别代入 $y+z$，得 $1-1=0$ 与 $2-2=0$，说明两个方向都躺在平面的方向子空间里，答案对得上。"
    }
   ]
  },
  {
   "t": "example",
   "no": "3",
   "tag": "两平面交线，以及直线与平面的夹角（§11.5）",
   "fields": [
    {
     "k": "题目",
     "html": "求平面 $M_1:3x-6y-2z=15$ 与 $M_2:2x+y-2z=5$ 的交线参数式，并求这条交线与平面 $3x+2y+6z=6$ 的夹角。"
    },
    {
     "k": "想一想",
     "html": "交线同时属于两张平面，所以它必须同时垂直于两个法向量——方向向量就是 $\\mathbf n_1\\times\\mathbf n_2$。有了方向还差一个点：令 $z=0$，两张平面的方程就退化成两个未知数的二元一次方程组，解出来就是交线上的一点。"
    },
    {
     "k": "解答",
     "html": "$\\mathbf n_1=3\\mathbf i-6\\mathbf j-2\\mathbf k$，$\\mathbf n_2=2\\mathbf i+\\mathbf j-2\\mathbf k$，$$\\mathbf v=\\mathbf n_1\\times\\mathbf n_2=\\begin{vmatrix}\\mathbf i&amp;\\mathbf j&amp;\\mathbf k\\\\3&amp;-6&amp;-2\\\\2&amp;1&amp;-2\\end{vmatrix}=\\begin{vmatrix}-6&amp;-2\\\\1&amp;-2\\end{vmatrix}\\mathbf i-\\begin{vmatrix}3&amp;-2\\\\2&amp;-2\\end{vmatrix}\\mathbf j+\\begin{vmatrix}3&amp;-6\\\\2&amp;1\\end{vmatrix}\\mathbf k=14\\mathbf i+2\\mathbf j+15\\mathbf k$$ 令 $z=0$，解 $\\begin{cases}3x-6y=15\\\\2x+y=5\\end{cases}$：由第二式 $y=5-2x$，代回第一式得 $15x=45$，即 $x=3,\\ y=-1$，交线过 $P(3,-1,0)$。于是$$x=3+14t,\\qquad y=-1+2t,\\qquad z=15t$$ 再求与第三张平面的夹角。$\\mathbf n_3=3\\mathbf i+2\\mathbf j+6\\mathbf k$，$|\\mathbf n_3|=7$；$|\\mathbf v|=\\sqrt{196+4+225}=5\\sqrt{17}$；$\\mathbf v\\cdot\\mathbf n_3=42+4+90=136$。直线与平面夹角用 $\\sin$：$$\\sin\\varphi=\\frac{|\\mathbf v\\cdot\\mathbf n_3|}{|\\mathbf v||\\mathbf n_3|}=\\frac{136}{35\\sqrt{17}}\\approx0.9424\\ \\Longrightarrow\\ \\varphi\\approx1.23\\ \\text{rad}\\ (70.5^\\circ)$$"
    },
    {
     "k": "点评",
     "html": "$\\mathbf j$ 分量的算式是 $-\\begin{vmatrix}3&amp;-2\\\\2&amp;-2\\end{vmatrix}=-(-6+4)=2$，那个负号决定答案，漏了就整支方向向量歪掉。取点时令 $z=0$ 完全任意，令 $x=0$ 或 $z=1$ 也能得到同一条直线的另一种参数化，所以答案形式不同不必慌。<br>夹角要分清：直线与<b>平面</b>的夹角用 $\\sin$（方向向量与法向量互余），直线与直线、平面与平面的夹角才用 $\\cos$，而且结果超过 $90^\\circ$ 时要取补角。"
    }
   ]
  },
  {
   "t": "example",
   "no": "4",
   "tag": "判定两条空间直线的关系（§11.5）",
   "fields": [
    {
     "k": "题目",
     "html": "判断 $L_1:x=3+2t,\\ y=-1+4t,\\ z=2-t$ 与 $L_2:x=1+4s,\\ y=1+2s,\\ z=-3+4s$ 是平行、相交还是异面；相交就求交点，异面就求距离。"
    },
    {
     "k": "想一想",
     "html": "三步走：先比方向向量，成比例就是平行；不成比例就联立参数式解 $t,s$；解出来还不算完，必须代回第三个方程检验——两个方程只能保证在某两个坐标上碰头，第三个坐标对不上就是异面。"
    },
    {
     "k": "解答",
     "html": "$\\mathbf v_1=2\\mathbf i+4\\mathbf j-\\mathbf k$，$\\mathbf v_2=4\\mathbf i+2\\mathbf j+4\\mathbf k$。因 $\\frac42\\ne\\frac24$（前两个分量比不一致），$\\mathbf v_1$ 与 $\\mathbf v_2$ 不成比例，两直线不平行。<br>联立 $x$ 与 $y$：$\\begin{cases}3+2t=1+4s\\\\-1+4t=1+2s\\end{cases}$，整理得 $\\begin{cases}t-2s=-1\\\\2t-s=1\\end{cases}$。由第一式 $t=2s-1$，代入第二式得 $3s=3$，故 $s=1,\\ t=1$。<br>代回 $z$ 检验：$L_1$ 在 $t=1$ 时 $z=2-1=1$；$L_2$ 在 $s=1$ 时 $z=-3+4=1$。两者相等，所以<b>两直线相交</b>，交点是$$(x,y,z)=(3+2,\\ -1+4,\\ 2-1)=\\boxed{(5,3,1)}$$ 用 $L_2$ 复核：$(1+4,\\ 1+2,\\ -3+4)=(5,3,1)$，一致。"
    },
    {
     "k": "点评",
     "html": "本题第三个方程恰好成立，所以是相交。若只解两个方程就下结论，碰到异面直线会把「投影碰头」误判成「真的相交」，这是这类题唯一的坑。两个参数必须来自同一次联立，不能一个从 $x$ 解、一个从 $y$ 解再拼起来。<br>对照一下：若把 $L_2$ 改成 $z=-2+4s$，则 $t=s=1$ 时两个 $z$ 分别是 $1$ 和 $2$，两直线就异面了。那时才需要动用 $d=\\dfrac{|(\\mathbf v_1\\times\\mathbf v_2)\\cdot\\overrightarrow{P_1P_2}|}{|\\mathbf v_1\\times\\mathbf v_2|}$。"
    }
   ]
  },
  {
   "t": "example",
   "no": "5",
   "tag": "配方识别二次曲面（§11.6）",
   "fields": [
    {
     "k": "题目",
     "html": "判断 $4x^2-9y^2+z^2+8x-18y+2z+4=0$ 的类型，写出标准方程与中心。"
    },
    {
     "k": "想一想",
     "html": "按变量分组，把一次项配进括号，常数挪到右边。配完先看平方项有几个、符号怎么搭，再去对照标准型——不用画图。"
    },
    {
     "k": "解答",
     "html": "分组并配方：$$4(x^2+2x)-9(y^2+2y)+(z^2+2z)+4=0\\Longrightarrow4\\big[(x+1)^2-1\\big]-9\\big[(y+1)^2-1\\big]+\\big[(z+1)^2-1\\big]+4=0$$ 把减掉的常数收起来：$$4(x+1)^2-9(y+1)^2+(z+1)^2+(-4+9-1+4)=0\\Longrightarrow4(x+1)^2-9(y+1)^2+(z+1)^2=-8$$ 两边同除 $-8$，并令 $X=x+1,\\ Y=y+1,\\ Z=z+1$：$$\\frac{9Y^2}{8}-\\frac{X^2}{2}-\\frac{Z^2}{8}=1$$ 这是<b>双叶双曲面</b>（hyperboloid of two sheets）：一正两负、右边为 $1$，正号对应的 $y$ 方向被切断。中心是 $(-1,-1,-1)$，两片分别沿 $y$ 轴的正负方向张开。截痕：$Y=Y_0$ 截得椭圆，但只有 $|Y_0|\\gt\\frac{2\\sqrt2}{3}$ 才有实截痕，$Y_0=\\pm\\frac{2\\sqrt2}{3}$ 各退化为一个顶点；$X=X_0$ 与 $Z=Z_0$ 截得双曲线。"
    },
    {
     "k": "点评",
     "html": "配方时<b>括号外还有系数</b>（$4$ 与 $-9$），把 $-1$ 提出括号时要乘回去，常数项算成 $-4+9-1+4=8$，这里符号错一步，类型就判反了。<br>判单叶还是双叶只看一件事：标准型右边是 $1$，正项对应的变量方向被「切断」即为双叶（此处正项是 $Y^2$，曲面沿 $y$ 轴分成两片）；如果正项有两个、负项一个，就是连通一片的单叶。若配方后右边是 $0$，那是锥面，不是双曲面。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "这些地方最容易错",
   "id": "ch11-s9"
  },
  {
   "t": "list",
   "items": [
    "<b>方向反了</b>：$\\overrightarrow{AB}$ 写成起点减终点。为什么会错——脑子里想的是「从 $A$ 看 $B$」，手却写成了 $A-B$。正确做法：一律终点减起点，写完拿一个坐标验一下符号。",
    "<b>忘了开方</b>：把 $|\\langle2,2,-1\\rangle|$ 写成 $9$。为什么会错——平方和算完手就停了。正确做法：模长、距离、法向量长度，最后一步都要开方。",
    "<b>点积叉积混着用</b>：题目要「垂直于两者的向量」，却交上去一个数。为什么会错——两个公式都带 $\\cos/\\sin$，长得像。正确做法：点积出数（管夹角、投影、垂直），叉积出箭头（管平行、面积、法向量）。",
    "<b>$\\mathbf j$ 分量漏负号</b>：把 $-(u_1v_3-u_3v_1)\\mathbf j$ 直接写成正的。为什么会错——只记了「交叉相乘」，没记符号交替。正确做法：按 $+,-,+$ 展开；如果这一项恰好是 0，你根本发现不了自己错了。",
    "<b>叉积交换顺序</b>：把 $\\mathbf v\\times\\mathbf u$ 当成 $\\mathbf u\\times\\mathbf v$。为什么会错——实数的乘法可以交换，习惯被带过来了。正确做法：叉积反交换，换一次顺序整体变号，法向量方向也跟着反过来。",
    "<b>平行用点积、垂直用叉积</b>：拿「点积为零」去证两条线平行。为什么会错——两个「等于零」记混了。正确做法：点积为零 $\\iff$ 垂直；叉积为零 $\\iff$ 平行。",
    "<b>投影分母写成 $|\\mathbf v|$</b>：得到 $\\dfrac{\\mathbf u\\cdot\\mathbf v}{|\\mathbf v|}\\mathbf v$。为什么会错——记成了标量分量的公式。正确做法：投影向量的系数是 $\\dfrac{\\mathbf u\\cdot\\mathbf v}{|\\mathbf v|^2}$，因为后面还要再乘一整支 $\\mathbf v$。",
    "<b>体积忘取绝对值、四面体忘乘 $\\frac16$</b>：三重积算出来是 $-2$ 就交 $-2$。为什么会错——把「代数值」当成了「体积」。正确做法：体积写 $|(\\mathbf u\\times\\mathbf v)\\cdot\\mathbf w|$，四面体再乘 $\\frac16$。",
    "<b>点到平面的 $D$ 符号错</b>：把 $x+2y-2z=3$ 代成 $D=-3$。为什么会错——没先把常数挪到同一边。正确做法：化成 $Ax+By+Cz-D=0$ 再代 $|Ax_1+By_1+Cz_1-D|$；分母是 $|\\mathbf n|$，不是 $|\\mathbf n|^2$。",
    "<b>判两直线只解两个方程</b>：解出 $t,s$ 就宣布相交。为什么会错——忘了第三个坐标也得对上。正确做法：代回第三个方程，不成立就是异面。",
    "<b>线面夹角用了 $\\cos$</b>：和线线夹角混在一起。为什么会错——只记了「夹角用余弦」。正确做法：线面夹角用 $\\sin\\varphi=\\dfrac{|\\mathbf v\\cdot\\mathbf n|}{|\\mathbf v||\\mathbf n|}$；线线、面面夹角用 $\\cos$，且都取锐角。"
   ]
  },
  {
   "t": "callout",
   "kind": "warn",
   "title": "三个最容易踩的坑",
   "html": "<p><b>坑一：$\\mathbf j$ 项的负号。</b>叉积展开时 $\\mathbf j$ 前面自带负号，这是本章最常见的计算错误，而且碰上「该项恰好为 0」的题目根本查不出来。养成写法：先把行列式完整写出来，再逐块填。</p><p><b>坑二：投影的分母。</b>投影向量除 $|\\mathbf v|^2$，标量分量除 $|\\mathbf v|$。两个公式只差一个平方，抄错就整题偏掉。</p><p><b>坑三：判两直线时跳过第三个方程。</b>联立只能保证两个坐标对上，第三个坐标才是「在不在同一点」的裁判。少了这一步，异面会被判成相交。</p>"
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "这一章要记住的",
   "id": "ch11-s10"
  },
  {
   "t": "formula",
   "items": [
    {
     "name": "两点距离（三维勾股）",
     "tex": "|P_1P_2|=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}"
    },
    {
     "name": "球面标准方程",
     "tex": "(x-x_0)^2+(y-y_0)^2+(z-z_0)^2=a^2"
    },
    {
     "name": "模长与单位向量",
     "tex": "|\\mathbf v|=\\sqrt{v_1^2+v_2^2+v_3^2},\\qquad \\left|\\frac{\\mathbf v}{|\\mathbf v|}\\right|=1"
    },
    {
     "name": "点积的两种算法",
     "tex": "\\mathbf u\\cdot\\mathbf v=u_1v_1+u_2v_2+u_3v_3=|\\mathbf u||\\mathbf v|\\cos\\theta"
    },
    {
     "name": "夹角与正交",
     "tex": "\\cos\\theta=\\frac{\\mathbf u\\cdot\\mathbf v}{|\\mathbf u||\\mathbf v|},\\qquad \\mathbf u\\perp\\mathbf v\\iff\\mathbf u\\cdot\\mathbf v=0"
    },
    {
     "name": "投影与标量分量",
     "tex": "\\operatorname{proj}_{\\mathbf v}\\mathbf u=\\frac{\\mathbf u\\cdot\\mathbf v}{|\\mathbf v|^2}\\mathbf v,\\qquad \\text{comp}=\\frac{\\mathbf u\\cdot\\mathbf v}{|\\mathbf v|}"
    },
    {
     "name": "叉积（行列式）",
     "tex": "\\mathbf u\\times\\mathbf v=\\begin{vmatrix}\\mathbf i&\\mathbf j&\\mathbf k\\\\u_1&u_2&u_3\\\\v_1&v_2&v_3\\end{vmatrix}=(u_2v_3-u_3v_2)\\mathbf i-(u_1v_3-u_3v_1)\\mathbf j+(u_1v_2-u_2v_1)\\mathbf k"
    },
    {
     "name": "叉积的模与面积",
     "tex": "|\\mathbf u\\times\\mathbf v|=|\\mathbf u||\\mathbf v|\\sin\\theta,\\qquad S_\\triangle=\\tfrac12|\\overrightarrow{PQ}\\times\\overrightarrow{PR}|"
    },
    {
     "name": "三重积与体积",
     "tex": "V_{\\text{六面体}}=\\bigl|(\\mathbf u\\times\\mathbf v)\\cdot\\mathbf w\\bigr|,\\qquad V_{\\text{四面体}}=\\tfrac16\\bigl|(\\mathbf u\\times\\mathbf v)\\cdot\\mathbf w\\bigr|"
    },
    {
     "name": "平面方程",
     "tex": "\\mathbf n\\cdot\\overrightarrow{P_0P}=0\\ \\Longleftrightarrow\\ A(x-x_0)+B(y-y_0)+C(z-z_0)=0\\ \\Longleftrightarrow\\ Ax+By+Cz=D"
    },
    {
     "name": "直线（向量式与参数式）",
     "tex": "\\mathbf r=\\mathbf r_0+t\\mathbf v,\\qquad x=x_0+tv_1,\\ y=y_0+tv_2,\\ z=z_0+tv_3"
    },
    {
     "name": "点到平面、点到直线",
     "tex": "d=\\frac{|Ax_1+By_1+Cz_1-D|}{\\sqrt{A^2+B^2+C^2}},\\qquad d=\\frac{|\\overrightarrow{PS}\\times\\mathbf v|}{|\\mathbf v|}"
    },
    {
     "name": "两种夹角",
     "tex": "\\cos\\theta=\\frac{|\\mathbf n_1\\cdot\\mathbf n_2|}{|\\mathbf n_1||\\mathbf n_2|}\\ (\\text{面面}),\\qquad \\sin\\varphi=\\frac{|\\mathbf v\\cdot\\mathbf n|}{|\\mathbf v||\\mathbf n|}\\ (\\text{线面})"
    },
    {
     "name": "两直线的关系",
     "tex": "\\mathbf v_1\\times\\mathbf v_2=\\mathbf 0\\ (\\text{平行});\\qquad (\\mathbf v_1\\times\\mathbf v_2)\\cdot\\overrightarrow{P_1P_2}=0\\ (\\text{共面})"
    },
    {
     "name": "二次曲面标准型",
     "tex": "\\text{椭球}:\\ \\frac{x^2}{a^2}+\\frac{y^2}{b^2}+\\frac{z^2}{c^2}=1;\\quad \\text{椭圆抛物面}:\\ \\frac{x^2}{a^2}+\\frac{y^2}{b^2}=\\frac zc;\\quad \\text{双曲抛物面}:\\ \\frac{y^2}{b^2}-\\frac{x^2}{a^2}=\\frac zc"
    }
   ]
  },
  {
   "t": "keypoint",
   "items": [
    {
     "title": "如果只记三件事",
     "html": "① 向量只管长度和方向，位置无关；② 点积出数、管夹角与投影，叉积出箭头、管垂直方向与面积，两个「等于零」分别对应垂直与平行；③ 平面 $=$ 一个点 $+$ 一个法向量，所有距离公式都是投影。"
    },
    {
     "title": "两个看见就想",
     "html": "看见「垂直」「投影」「功」，立刻写点积；看见「面积」「法向量」「平行」「体积」，立刻写叉积。看见「曲面」两个字，先配方、再数符号。"
    }
   ]
  },
  {
   "t": "h",
   "lvl": 2,
   "text": "接下来学什么",
   "id": "ch11-s11"
  },
  {
   "t": "p",
   "html": "这一章不含极限和导数，看起来像是「插进来的一章」，其实是后面所有内容的地基。<br>下一章 <a href=\"#/ch12\">第 12 章</a>马上就会用：位置写成向量 $\\mathbf r(t)$，求导得速度、再求导得加速度，而曲率公式 $\\kappa=\\dfrac{|\\mathbf v\\times\\mathbf a|}{|\\mathbf v|^3}$ 里的叉积，就是本章 11.4 节那一个。<br>到了 <a href=\"#/ch13\">第 13 章</a>，切平面的法向量 $\\langle f_x,f_y,-1\\rangle$ 就是本章「法向量定平面」的直接应用；方向导数 $\\nabla f\\cdot\\mathbf u$ 则是点积换了个名字，$\\mathbf u$ 必须是单位向量这一点，正是 11.2 节强调过的。11.6 节的鞍点，会在那里升级成「判别极值」的工具。<br>再往后，<a href=\"#/ch14\">第 14 章</a>的三重积分要画积分区域，靠的是本章的截痕法；<a href=\"#/ch15\">第 15 章</a>的通量 $\\iint\\mathbf F\\cdot\\mathbf n\\,d\\sigma$ 里的 $\\mathbf n$ 与 $\\mathbf F\\cdot d\\mathbf r$ 里的点积，也全部来自这一章。<br>换句话说：本章的三种运算（加、点积、叉积）你练熟了，后面几章的新公式就只是「换个符号再写一遍」。"
  },
  {
   "t": "checklist",
   "id": "ch11",
   "items": [
    "能说出空间一点为什么要三个数，并解释两点距离公式为什么是「勾股定理用两次」。",
    "能用自己的话讲清「向量与位置无关」，并说明为什么可以把它平移到原点再读分量。",
    "能解释点积为什么能回答「两个方向有多一致」，并算出夹角、判断垂直。",
    "能说清投影与标量分量的区别，并解释投影公式的分母为什么是 $|\\mathbf v|^2$。",
    "能用右手定则说明叉积的方向，并解释为什么叉积为零就代表平行。",
    "能用一个点加一个法向量写出平面方程，并用投影推出点到平面/直线的距离。",
    "能按「缺变量 → 数平方项 → 看符号」的顺序，从方程认出椭球、抛物面、双曲面。"
   ]
  }
 ]
});
