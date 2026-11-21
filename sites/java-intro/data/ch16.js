/* =====================================================================
 * data/ch16.js · 第 16 章：案例研究：N 体模拟
 * 职责：万有引力与 N 体问题 → 向量抽象 → 力与叠加 → 数值积分 →
 *       Universe 的 O(n²) 双重循环 → 数据驱动 → 精度与混沌 → 排坑。
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5；可运行代码均用站内 Java
 * 引擎执行核对（初值取教材 2body/3body 数据，输出为真实结果）。
 * 教材依据：Sedgewick §3.4（N-Body Simulation）。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch16',
  num: '16',
  title: '案例研究：N 体模拟',
  en: 'Case Study: N-Body Simulation',
  goals: [
    '能写出万有引力的向量形式，并说清为什么力是「沿连线、指向对方」',
    '能把位置、速度、力抽象成向量对象，让 Body 的方法保持简洁',
    '能实现「先算全部受力、再统一更新」的 n 体一步积分',
    '能估算 n 体模拟每步的 O(n²) 代价，并解释为什么不能一次模拟整个星系',
    '能说出数值模拟的三类误差来源：步长、近碰撞、混沌放大'
  ],
  kp: [
    { id: 'ch16-1', title: '万有引力与 N 体问题' },
    { id: 'ch16-2', title: '向量抽象：位置、速度、力' },
    { id: 'ch16-3', title: '受力计算与叠加原理' },
    { id: 'ch16-4', title: '数值积分：move 与步长 dt' },
    { id: 'ch16-5', title: 'Universe：O(n²) 的双重循环' },
    { id: 'ch16-6', title: '数据驱动：从文件读天体' },
    { id: 'ch16-7', title: '精度、混沌与误差累积' },
    { id: 'ch16-8', title: '常见错误与调试' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '太阳系为什么能稳定运行几十亿年？把八个行星的位置和速度输入计算机，能不能预测一千年后它们在哪儿？' +
      '这正是<b>N 体模拟</b>（N-body simulation）要回答的问题：给定 n 个天体的初始位置、速度和质量，' +
      '按万有引力算出每个天体每一步的加速度，再一步步把时间往前推。' +
      '听起来像天体物理的专属工具，其实它和分子动力学、蛋白质折叠、甚至游戏里的碰撞模拟共用一套代码骨架。' +
      '本章最精彩的地方在于：<b>牛顿能解二体问题，但三体起就没有公式解</b>，' +
      '只能靠数值模拟——而模拟会在小步长、近碰撞和混沌放大这三处悄悄出错。' +
      '你会亲手写一个几十行的「太阳系」，并看到它为什么不能算得太久、太远。'
    },

    { t: 'p', lead: true, html:
      '这一章把「类与对象 + 数组 + 双重循环」拧成一个完整程序：' +
      '先用向量封装二维坐标，再把每个天体做成对象，最后用两层循环实现「两两相互作用」。' +
      '可运行的代码都用教材的 2body/3body 数据，输出是真实计算结果；' +
      '带绘图和文件读写的教材原版程序标注为「需本地运行」，正文给出它应有的输出与现象。'
    },

    { t: 'h', text: '一、从苹果到三体：问题到底难在哪', id: 'ch16-1' },

    { t: 'p', html:
      '万有引力定律说：两个质量分别为 m₁、m₂、相距 r 的物体，互相吸引，力的大小是 <code>F = G·m₁·m₂ / r²</code>，' +
      '其中 <code>G = 6.67 × 10⁻¹¹ N·m²/kg²</code>；方向沿着两者连线，指向对方。' +
      '注意这是<b>向量</b>：两个天体之间有两个力，大小相等、方向相反（牛顿第三定律）。' +
      '把每个天体受到的所有力加起来（<b>叠加原理</b>），除以自己的质量，就是这一瞬间的加速度。'
    },

    { t: 'p', html:
      '如果只有两个天体，数学上可以解出精确的椭圆轨道——这就是牛顿在 1687 年解决的问题。' +
      '但三个及以上天体互相牵制，运动方程没有初等函数解，轨道还可能对初始条件极其敏感（<b>混沌</b>）。' +
      '于是数值模拟成了唯一的选择：把时间切成小步，每一步都假设「力在这一小段内不变」，' +
      '用这一步的加速度更新速度、用新速度更新位置。'
    },

    { t: 'table',
      head: ['场景', '天体/粒子', '典型步长', '关注的问题'],
      rows: [
        ['太阳系', '8 颗行星 + 太阳', '小时到天', '长期稳定性、轨道共振'],
        ['星系演化', '10⁶–10¹⁰ 颗恒星', '百万年', '暗物质分布、旋臂结构'],
        ['分子动力学', '10³–10⁶ 个原子', '飞秒', '蛋白质折叠、材料性质'],
        ['游戏物理', '几十到几百个刚体', '1/60 秒', '碰撞、稳定性']
      ],
      caption: '同一套「两两求力 → 求和 → 更新位置」的骨架，换掉步长和规模就能跨领域使用。'
    },

    { t: 'h', text: '二、向量抽象：别让坐标散落一地', id: 'ch16-2' },

    { t: 'p', html:
      '二维位置是 <code>(x, y)</code>，速度是 <code>(vx, vy)</code>，力也是二维向量。' +
      '如果每个量都拆成两个 <code>double</code> 变量，代码里到处是 <code>r[i][0]</code>、<code>v[i][1]</code>，' +
      '不仅难读，还很容易把 x 和 y 弄混。教材的做法是定义一个 <b>Vector</b> 类型，' +
      '为它提供加、减、数乘、取长度、取方向这几个方法；这样 <code>Body</code> 里的公式就能写成' +
      '<code>v = v.plus(a.scale(dt))</code> 这种接近数学表达式的样子。'
    },

    { t: 'p', html:
      '站内引擎不支持教材的 <code>Vector</code> 库，也不支持嵌套类，所以下面的代码把向量写成一个独立的顶层类 <code>Vec2</code>，' +
      '方法齐全但实现极简。注意这是<b>可运行</b>的：所有运算都是普通的 <code>double</code> 四则运算和 <code>Math.sqrt</code>。'
    },

    { t: 'code', caption: 'Vec2Demo.java —— 用一个最小的向量类验证加减、数乘与长度', code:
`class Vec2 {
    double x, y;

    Vec2(double x0, double y0) {
        x = x0;
        y = y0;
    }

    Vec2 plus(Vec2 o) { return new Vec2(x + o.x, y + o.y); }
    Vec2 minus(Vec2 o) { return new Vec2(x - o.x, y - o.y); }
    Vec2 scale(double s) { return new Vec2(x * s, y * s); }
    double length() { return Math.sqrt(x * x + y * y); }
    Vec2 direction() {
        double d = length();
        return scale(1.0 / d);
    }
}

public class Vec2Demo {
    public static void main(String[] args) {
        Vec2 a = new Vec2(0.0, 4.5e10);
        Vec2 b = new Vec2(0.0, -4.5e10);
        Vec2 delta = b.minus(a);
        System.out.printf("delta = %.4e %.4e%n", delta.x, delta.y);
        System.out.printf("dist = %.4e%n", delta.length());
        Vec2 dir = delta.direction();
        System.out.printf("dir = %.4f %.4f%n", dir.x, dir.y);
        Vec2 scaled = delta.scale(2.0);
        System.out.printf("scaled = %.4e %.4e%n", scaled.x, scaled.y);
    }
}
` },

    { t: 'p', html:
      '输出：<code>delta = 0.0000e+00 -9.0000e+10</code>、<code>dist = 9.0000e+10</code>、' +
      '<code>dir = 0.0000 -1.0000</code>、<code>scaled = 0.0000e+00 -1.8000e+11</code>。' +
      '这里有两个容易忽略的细节：① <code>direction()</code> 返回的是<b>单位向量</b>（长度 1），' +
      '它只保留方向、丢弃距离；② <code>minus</code> 是「自己减参数」，' +
      '<code>b.minus(a)</code> 得到的是「从 a 指向 b」的位移，方向不要搞反。'
    },

    { t: 'h', text: '三、Body：把质量、位置、速度绑在一起', id: 'ch16-3' },

    { t: 'p', html:
      '有了向量，天体就是一个很自然的类：字段 <code>r</code>、<code>v</code>、<code>mass</code>；' +
      '方法 <code>forceFrom(other)</code> 算出「对方对我」的引力，<code>move(force, dt)</code> 更新一步。' +
      '注意 <code>forceFrom</code> 返回的力的方向是<b>从自己指向对方</b>：先用 <code>other.r.minus(r)</code> 求位移，' +
      '再取单位方向、乘上大小。下面用教材 <code>2body.txt</code> 的两个天体做一次真实计算。'
    },

    { t: 'code', caption: 'BodyForce.java —— 两个 1.5×10³⁰ kg 天体相距 9×10¹⁰ m 时的引力与一步位移', code:
`class Vec2 {
    double x, y;
    Vec2(double x0, double y0) { x = x0; y = y0; }
    Vec2 plus(Vec2 o) { return new Vec2(x + o.x, y + o.y); }
    Vec2 minus(Vec2 o) { return new Vec2(x - o.x, y - o.y); }
    Vec2 scale(double s) { return new Vec2(x * s, y * s); }
    double length() { return Math.sqrt(x * x + y * y); }
    Vec2 direction() {
        double d = length();
        return scale(1.0 / d);
    }
}

class Body {
    Vec2 r, v;
    double mass;

    Body(Vec2 r0, Vec2 v0, double m0) {
        r = r0;
        v = v0;
        mass = m0;
    }

    Vec2 forceFrom(Body b) {
        double G = 6.67e-11;
        Vec2 delta = b.r.minus(r);
        double dist = delta.length();
        double magnitude = G * mass * b.mass / (dist * dist);
        return delta.direction().scale(magnitude);
    }

    void move(Vec2 force, double dt) {
        Vec2 a = force.scale(1.0 / mass);
        v = v.plus(a.scale(dt));
        r = r.plus(v.scale(dt));
    }
}

public class BodyForce {
    public static void main(String[] args) {
        Vec2 r0 = new Vec2(0.0, 4.5e10);
        Vec2 v0 = new Vec2(1.0e4, -1.0e4);
        Body a = new Body(r0, v0, 1.5e30);
        Body b = new Body(new Vec2(0.0, -4.5e10), new Vec2(-1.0e4, 1.0e4), 1.5e30);
        Vec2 force = a.forceFrom(b);
        System.out.printf("force = %.4e %.4e%n", force.x, force.y);
        a.move(force, 1.0e4);
        System.out.printf("a.r = %.4e %.4e%n", a.r.x, a.r.y);
        System.out.printf("a.v = %.4e %.4e%n", a.v.x, a.v.y);
    }
}
` },

    { t: 'p', html:
      '输出是 <code>force = 0.0000e+00 -1.8528e+28</code>、<code>a.r = 1.0000e+08 4.4899e+10</code>、' +
      '<code>a.v = 1.0000e+04 -1.0124e+04</code>。手工验算一下：' +
      '<code>F = 6.67e-11 × (1.5e30)² / (9e10)² ≈ 1.8528e28</code>，方向朝下（对方在下方），所以 y 分量为负；' +
      '加速度 <code>a = F/m ≈ 0.01235 m/s²</code>，一步 10⁴ 秒后速度 y 从 −1.0×10⁴ 变成约 −1.0124×10⁴，' +
      '位置 y 减小约 1.0×10⁸ 米。这些数和程序输出完全对得上——<b>能手工验算的小例子，是调试数值代码的第一道保险</b>。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 方向', html: '<code>forceFrom</code> 里用的是 <code>b.r.minus(r)</code>，得到「指向 b」的力；写反了天体就会互相排斥。' },
      { title: '检查点 · 单位', html: 'G 用国际单位制时，质量必须用 kg、距离用 m、时间用 s；教材数据已经是这个单位制。' }
    ] },

    { t: 'h', text: '四、数值积分：一步之内发生了什么', id: 'ch16-4' },

    { t: 'p', html:
      '真实世界里力随位置连续变化；计算机只能把它切成离散的步。最简单的做法叫<b>显式欧拉法</b>：' +
      '在这一步开始时算一次力 <code>F</code>，得到加速度 <code>a = F/m</code>；' +
      '然后 <code>v ← v + a·dt</code>，<code>r ← r + v·dt</code>。' +
      '教材的 <code>Body.move()</code> 正是这两行。它的误差来自「这一步内假设 a 不变」，' +
      '所以步长 <code>dt</code> 越小越准，但计算量也越大。'
    },

    { t: 'table',
      head: ['dt（秒）', '一年约多少步', '误差表现', '适用场景'],
      rows: [
        ['1.0', '3.15×10⁷', '很准，但算一百年要数十亿步', '精确验证、短时间高精度'],
        ['1.0×10⁴', '3.15×10³', '一天内轨道基本正确', '文档示例、教学演示'],
        ['1.0×10⁶', '31.5', '一年后明显偏离', '粗略趋势、快速预览'],
        ['1.0×10⁸', '0.315', '轨道严重失真', '不适合太阳系尺度']
      ],
      caption: '步长是精度的旋钮：减小 10 倍，误差通常显著下降，但步数（因此总时间）增加 10 倍。太阳系模拟常用几小时到几天的步长。'
    },

    { t: 'p', html:
      '还有一个隐蔽问题：欧拉法是「用旧速度走新位置」还是「用新速度走新位置」？' +
      '上面 <code>move()</code> 先更新速度、再用<b>新速度</b>更新位置，这叫半隐式欧拉法，比反过来更稳定；' +
      '在轨道模拟里，两种顺序的结果会随时间明显分开。写代码时要明确自己用的是哪一种，' +
      '不要在同一份代码里混用两种更新顺序。'
    },

    { t: 'h', text: '五、Universe：两两求力，叠加求和', id: 'ch16-5' },

    { t: 'p', html:
      '多个天体时，每个天体受到其它所有天体的力。核心循环只有三句：' +
      '① 为每个天体准备一个力向量并清零；② <b>双重循环</b> i、j，把 j 对 i 的力累加到 i 上；' +
      '③ 再遍历一次，用各自的合力更新每个天体。' +
      '注意顺序：<b>必须先算完所有力，再统一更新位置</b>。如果边算边移动，后面的天体就会用到「已经移动过」的位置，' +
      '等于每个天体在不同的时刻受力，物理上就错了。'
    },

    { t: 'code', caption: 'Universe3.java —— 3 个天体、一步叠加，并统计 forceFrom 被调用的次数', code:
`class Vec2 {
    double x, y;
    Vec2(double x0, double y0) { x = x0; y = y0; }
    Vec2 plus(Vec2 o) { return new Vec2(x + o.x, y + o.y); }
    Vec2 minus(Vec2 o) { return new Vec2(x - o.x, y - o.y); }
    Vec2 scale(double s) { return new Vec2(x * s, y * s); }
    double length() { return Math.sqrt(x * x + y * y); }
    Vec2 direction() {
        double d = length();
        return scale(1.0 / d);
    }
}

class Body {
    Vec2 r, v;
    double mass;
    Body(Vec2 r0, Vec2 v0, double m0) { r = r0; v = v0; mass = m0; }
    Vec2 forceFrom(Body b) {
        double G = 6.67e-11;
        Vec2 delta = b.r.minus(r);
        double dist = delta.length();
        double magnitude = G * mass * b.mass / (dist * dist);
        return delta.direction().scale(magnitude);
    }
    void move(Vec2 force, double dt) {
        Vec2 a = force.scale(1.0 / mass);
        v = v.plus(a.scale(dt));
        r = r.plus(v.scale(dt));
    }
}

public class Universe3 {
    static int calls = 0;

    public static void main(String[] args) {
        Body earth = new Body(new Vec2(0.0, 0.0), new Vec2(0.0, 0.0), 5.97e24);
        Body sun1 = new Body(new Vec2(0.0, 4.5e10), new Vec2(3.0e4, 0.0), 1.989e30);
        Body sun2 = new Body(new Vec2(0.0, -4.5e10), new Vec2(-3.0e4, 0.0), 1.989e30);
        Body[] bodies = new Body[3];
        bodies[0] = earth;
        bodies[1] = sun1;
        bodies[2] = sun2;
        int n = bodies.length;
        double dt = 2.0e4;
        Vec2[] forces = new Vec2[n];
        for (int i = 0; i < n; i++) {
            forces[i] = new Vec2(0.0, 0.0);
        }
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i == j) continue;
                forces[i] = forces[i].plus(bodies[i].forceFrom(bodies[j]));
                calls++;
            }
        }
        for (int i = 0; i < n; i++) {
            bodies[i].move(forces[i], dt);
        }
        System.out.println("force calls = " + calls);
        System.out.printf("body0 r = %.4e %.4e%n", bodies[0].r.x, bodies[0].r.y);
        System.out.printf("body1 r = %.4e %.4e%n", bodies[1].r.x, bodies[1].r.y);
    }
}
` },

    { t: 'p', html:
      '输出：<code>force calls = 6</code>、<code>body0 r = 0.0000e+00 0.0000e+00</code>、' +
      '<code>body1 r = 6.0000e+08 4.4993e+10</code>。' +
      '三个天体、<code>i ≠ j</code>，所以力被计算了 3×2 = 6 次；' +
      '地球正好在两颗恒星的正中间，两颗恒星的引力大小相等、方向相反，合力为零，所以这一步它没有动——' +
      '这是一个<b>不稳定平衡</b>：只要位置稍微偏一点，合力就会把它越拉越远。' +
      '太阳 1 的 x 位置从 0 变成 6.0×10⁸ 米（它本身有 3×10⁴ m/s 的速度），' +
      'y 位置被地球与太阳 2 向下拉了约 7×10⁶ 米。' +
      '这就是「叠加」的具体样子：每个天体的加速度，是其它所有天体贡献之和。'
    },

    { t: 'p', html:
      '从调用次数能直接看出代价：n 个天体、每对算两次（i 对 j 与 j 对 i），共 <code>n(n−1)</code> 次，' +
      '也就是 <b>O(n²)</b>。n=3 时是 6 次，n=1000 时接近 10⁶ 次，n=10⁶ 时是 10¹² 次——每走一步。' +
      '这就是为什么星系模拟必须用近似算法（如树状码、快速多极子）或超级计算机：' +
      '「每个天体都要感受其它所有天体」这件事本身，代价就是平方级的。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 先算后动', html: '必须先算完整个 <code>forces[]</code>，再统一 <code>move</code>；边算边动是典型错误。' },
      { title: '检查点 · 力清零', html: '每个天体的合力初始必须是 (0,0)，否则会累加上一步的残余（或未初始化值）。' }
    ] },

    { t: 'h', text: '六、数据驱动：让天体从文件里来', id: 'ch16-6' },

    { t: 'p', html:
      '把天体的坐标、速度、质量硬编码在程序里，只能算一个固定场景。教材的做法是<b>数据驱动</b>：' +
      '把 n 个天体的数据写进文件，程序运行时读入。文件格式很朴素：' +
      '第一行是天体数 n，第二行是绘图半径（只影响可视化），之后每行 5 个数——位置 x、位置 y、速度 vx、速度 vy、质量。' +
      '教材的 <code>3body.txt</code> 描述「地球 + 两颗恒星」，是一个典型的混沌三体场景。'
    },

    { t: 'table',
      head: ['文件', '天体组成', '用途'],
      rows: [
        ['2body.txt', '两个 1.5×10³⁰ kg 的天体，互相环绕', '验证二体椭圆轨道'],
        ['3body.txt', '地球 + 两颗 1.989×10³⁰ kg 恒星', '演示混沌、轨道被打乱'],
        ['4body.txt', '两对互绕天体（各 3.0×10²⁸ kg）', '演示多体相互作用']
      ],
      caption: '教材三个数据文件；数字来自书中示例，单位均为国际单位制。'
    },

    { t: 'code', run: false, caption: 'Universe.java —— 教材原版：读文件 + StdDraw 实时绘图，每 20 毫秒推进一帧（教材库 · 需本地 JDK + algs4.jar）', code:
`public class Universe {
    private final int n;
    private final Body[] bodies;

    public Universe(String fileName) {
        In in = new In(fileName);
        n = in.readInt();
        double radius = in.readDouble();
        bodies = new Body[n];
        for (int i = 0; i < n; i++) {
            double rx = in.readDouble();
            double ry = in.readDouble();
            double vx = in.readDouble();
            double vy = in.readDouble();
            double mass = in.readDouble();
            bodies[i] = new Body(new Vector(new double[] { rx, ry }),
                                 new Vector(new double[] { vx, vy }), mass);
        }
        StdDraw.setXscale(-radius, radius);
        StdDraw.setYscale(-radius, radius);
    }

    public void increaseTime(double dt) {
        Vector[] force = new Vector[n];
        for (int i = 0; i < n; i++) {
            force[i] = new Vector(new double[2]);
        }
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i != j) force[i] = force[i].plus(bodies[i].forceFrom(bodies[j]));
            }
        }
        for (int i = 0; i < n; i++) {
            bodies[i].move(force[i], dt);
        }
    }

    public void draw() {
        StdDraw.clear();
        for (int i = 0; i < n; i++) {
            bodies[i].draw();
        }
        StdDraw.show();
    }

    public static void main(String[] args) {
        Universe universe = new Universe(args[0]);
        double dt = Double.parseDouble(args[1]);
        StdDraw.enableDoubleBuffering();
        while (true) {
            universe.increaseTime(dt);
            universe.draw();
            StdDraw.pause(20);
        }
    }
}
` },

    { t: 'p', html:
      '在本地运行 <code>java Universe 3body.txt 20000</code>，会看到地球一开始绕着一颗恒星转，' +
      '很快轨道被另一颗恒星拉偏、甚至被甩出去——这就是三体问题的混沌：' +
      '初始条件只差一点，最终的轨道就完全不同。' +
      '教材的程序用 <code>In</code> 读文件、用 <code>StdDraw</code> 画点，两个都是教材库，站内不执行；' +
      '但「读 n → 循环读 5 个 double → 存进 Body 数组」这段逻辑，和前面可运行的 <code>Universe3</code> 完全一致。'
    },

    { t: 'h', text: '七、精度、混沌与误差累积', id: 'ch16-7' },

    { t: 'p', html:
      '数值模拟的结果永远不会「完全正确」，误差主要有三个来源：' +
      '① <b>离散化误差</b>：把连续的力近似成每步不变，步长越大误差越大；' +
      '② <b>近碰撞误差</b>：两个天体靠得很近时 1/r² 变得极大，一步之内位置可能已经跑过对方，欧拉法会严重失真；' +
      '③ <b>混沌放大</b>：三体系统对初值敏感，今天 1 米的误差，几百年后可能变成百万公里。' +
      '所以对太阳系的长期预测，必须用更高阶的积分方法（如辛积分器）并监控能量守恒。'
    },

    { t: 'p', html:
      '一个实用的自检办法是<b>盯住总能量</b>：没有外力时，系统的动能加势能应该守恒。' +
      '如果模拟中总能量单调地上升或下降，通常说明步长太大或积分方法不稳定。' +
      '另一个办法是「倒放」：把速度取反再跑同样步数，理论应该回到起点；回不去多少，就说明误差累积了多少。'
    },

    { t: 'table',
      head: ['现象', '原因', '对策'],
      rows: [
        ['轨道逐渐向外螺旋', '欧拉法持续注入能量', '减小 dt、换辛积分器'],
        ['两天体突然弹飞', '近碰撞时 1/r² 爆炸', '自适应步长、软化因子 ε'],
        ['两台机器结果不同', '混沌放大 + 浮点舍入', '接受统计性预测，不追求单点精确'],
        ['总能量漂移明显', '步长过大或更新顺序错误', '记录能量曲线、检查 move 顺序']
      ],
      caption: '精度问题不是「程序写错了」，而是数值方法本身的边界；知道边界，才知道结果能信到什么程度。'
    },

    { t: 'h', text: '八、常见错误与调试', id: 'ch16-8' },

    { t: 'steps', items: [
      '力的方向写反：用 <code>r.minus(b.r)</code> 就变成排斥力，轨道会迅速飞散；记住「指向对方」。',
      '忘记清零合力：每个天体每一步都从 (0,0) 开始累加，否则加速度会包含历史值。',
      '边算边移动：内层循环里直接 <code>move</code>，后面的天体就会用到被移动过的位置；必须两轮循环分离。',
      '步长单位混乱：dt 用秒时，一天是 86400，不是 24；单位错会让轨道快慢完全不对。',
      '用 int 存位置/速度：1.5e30、4.5e10 这类数远超 int 范围，必须用 double。',
      '把 1/r² 写成 1/r：引力大小随距离平方衰减，少一个平方，远处天体的运动完全错误。',
      '近碰撞不做处理：距离趋近 0 时 1/r² 会溢出为 Infinity，程序出现 NaN；工程上加软化因子或自适应步长。'
    ] },

    { t: 'p', html:
      '最值得记住的一条：<b>先用能手工验算的小例子校准代码</b>。前面两个天体、三个天体的例子，' +
      '力的大小、一步位移都能用计算器核对；等这些对上了，再去跑 n=1000 的场景，才有信心。' +
      '数值代码的 bug 往往不会报错，只会给出「看起来合理但慢慢跑偏」的结果——' +
      '能量守恒、倒放、小例子，是三道最有效的防线。'
    },

    { t: 'p', html: '改变天体数与时间步长，观察总能量漂移：积分器好不好，跑几百步就看得出来。' },
    { t: 'lab', id: 'nbody' },

    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch16-q1' },
    { t: 'quiz', qid: 'ch16-q2' },
    { t: 'quiz', qid: 'ch16-q3' },

    { t: 'keypoint', items: [
      { title: '万有引力', html: '<code>F = G·m₁·m₂/r²</code>，方向沿连线指向对方；<code>G = 6.67×10⁻¹¹</code>。' },
      { title: '叠加', html: '每个天体受到的合力 = 其它所有天体对它的力之和；先算完再统一更新。' },
      { title: '向量抽象', html: '位置、速度、力都是二维向量；<code>forceFrom</code> 用 <code>b.r.minus(r)</code> 保证方向。' },
      { title: '欧拉积分', html: '<code>v ← v + (F/m)·dt</code>，<code>r ← r + v·dt</code>；步长越小越准，代价越高。' },
      { title: '复杂度', html: '每步 <code>n(n−1)</code> 次力计算，O(n²)；n 很大时必须用近似算法。' },
      { title: '数据驱动', html: '天体从文件读入：n、半径，然后每行 5 个 double（x y vx vy mass）。' },
      { title: '误差', html: '步长、近碰撞、混沌放大；用能量守恒、倒放、小例子自检。' }
    ] },

    { t: 'checklist', id: 'ch16', items: [
      '我能写出万有引力的向量形式，并说明力沿连线指向对方',
      '我能把位置、速度、力封装成向量类，而不是散落的 double 变量',
      '我能实现 forceFrom，并用两个天体的数据手工验算力的大小与方向',
      '我能解释为什么必须先算完所有合力、再统一更新位置',
      '我能写出 n 体一步积分：清零合力 → 双重循环叠加 → 逐个 move',
      '我能从调用次数推出每步 O(n²)，并说明 n=10⁶ 时为什么不可行',
      '我能说出教材 2body/3body/4body 文件的格式与用途',
      '我能列举步长、近碰撞、混沌三类误差，并给出至少两种自检方法',
      '我能识别力方向写反、合力未清零、边算边动、单位混乱等常见错误'
    ] },

    { t: 'p', html:
      '<b>延伸阅读</b>：Sedgewick《Computer Science: An Interdisciplinary Approach》§3.4（N-Body Simulation）' +
      '完整给出 Vector/Body/Universe 三个抽象、2body/3body/4body 数据文件与 StdDraw 动画程序；' +
      '《Algorithms》第 1 章则展示了如何用更高阶的积分器保持能量。' +
      '站内第 3 章「类与对象」、第 4 章「数组」是本章的语法基础，第 8 章「二维数组与对象数组」帮助理解 <code>Body[]</code>。' +
      '想练手到 <a href="#/quiz/ch16">题库 · ch16</a> 按章筛选。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：N 体模拟案例——万有引力与三体问题、向量抽象、力与叠加原理、显式/半隐式欧拉积分、Universe 的 O(n²) 双重循环、数据驱动的文件格式、步长/近碰撞/混沌三类误差与自检方法、常见错误。<br>依据：Course Outline v5「Beyond the Basics」案例研究；Sedgewick §3.4（N-Body Simulation）与 §4.1（性能分析）。本站为个人整理的学习材料，与课程要求冲突时以老师和课程大纲为准；可运行代码均由站内 Java 子集引擎执行核对，输出为真实计算结果。' }

  ]
});
