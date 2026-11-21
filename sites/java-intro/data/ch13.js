/* =====================================================================
 * data/ch13.js · 第 13 章：复杂度分析与 Big-O
 * 职责：操作计数、Big-O 定义与化简、常见阶、循环分析三模板、
 *       最好/最坏/平均、倍增法实测、空间复杂度、常见误区、
 *       调试实录、两个完整案例。
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5；示例输出均用 JDK 25 核对。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch13',
  num: '13',
  title: '复杂度分析与 Big-O',
  en: 'Complexity Analysis & Big-O',
  goals: [
    '能数出一段循环代码的关键操作次数 T(n)',
    '能说出 Big-O 的含义，并把 3n² + 5n + 2 化简成 O(n²)',
    '能分析单层循环、嵌套循环、每轮减半三类代码的复杂度',
    '会用倍增法从实测数据推断复杂度，并区分最好/最坏/平均',
    '能估算算法的空间复杂度，并识别"见嵌套就写 n²"这类误判'
  ],
  kp: [
    { id: 'ch13-1', title: '为什么数操作' },
    { id: 'ch13-2', title: 'Big-O 的定义与化简' },
    { id: 'ch13-3', title: '常见阶与增长' },
    { id: 'ch13-4', title: '分析循环的三个模板' },
    { id: 'ch13-5', title: '倍增法实证' },
    { id: 'ch13-6', title: '空间复杂度' },
    { id: 'ch13-7', title: '四个常见误区' },
    { id: 'ch13-8', title: '调试复杂度误判' },
    { id: 'ch13-9', title: '完整案例 A：三种去重' },
    { id: 'ch13-10', title: '完整案例 B：倍增拟合' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '先看一组反常的数字：同样是"1 加到 n"，<code>n = 10000</code> 时循环版要做 10000 次加法，' +
      '公式版只做 3 次运算——成绩单上两段代码都是"对"的，只有数据量一大，差别才暴露。' +
      '两台电脑比快慢没有意义，因为 CPU、编译器、缓存都在变；真正有意义的问题是：' +
      '<b>n 翻倍时，工作量怎么变？</b>这就是复杂度（complexity）要回答的事，' +
      '它只看代码结构、不看硬件，能提前判断一段程序会不会在某天突然慢到不能用。'
    },

    { t: 'p', lead: true, html:
      '这一章按"数操作 → 化简成 Big-O → 三个分析模板 → 用实测验证 → 空间复杂度 → 排坑"的顺序走。' +
      '学完你拿到一段陌生代码，应该能在 30 秒内说出它大概是 O(n) 还是 O(n²)。'
    },

    { t: 'code', caption: 'OpeningOps.java —— 同一件事两种写法，操作次数差三个数量级', code:
`public class OpeningOps {
    static long loopOps(int n) {
        long ops = 0;
        for (int i = 1; i <= n; i++) {
            ops++;
        }
        return ops;
    }

    static long formulaOps(int n) {
        long ops = 0;
        ops++;              // multiply
        ops++;              // add
        ops++;              // divide
        return ops;
    }

    public static void main(String[] args) {
        int[] ns = {100, 1000, 10000};
        for (int k = 0; k < ns.length; k++) {
            int n = ns[k];
            System.out.println("n = " + n + "  loop = " + loopOps(n) + "  formula = " + formulaOps(n));
        }
    }
}
` },

    { t: 'p', html:
      '输出三行：<code>loop</code> 分别等于 100、1000、10000，而 <code>formula</code> 一直是 3。' +
      '注意我们数的是<b>操作次数</b>，不是秒数——秒数换个 CPU 就变，操作次数只由代码结构决定。' +
      '这个"操作次数的表达式"记为 <b>T(n)</b>：这里循环版 T(n) = n，公式版 T(n) = 3。' +
      'T(n) 才是算法本身的属性，也是后面所有分析的起点。'
    },

    { t: 'h', text: '一、为什么要数操作', id: 'ch13-1' },

    { t: 'p', html:
      '运行时间受 CPU 主频、编译器优化、缓存命中率影响，同一段代码在不同机器上能差好几倍，所以直接比秒数不可靠。' +
      '我们只数<b>关键操作（basic operation）</b>——比较、赋值、数组访问、算术运算这些"一步能算完"的动作，' +
      '并约定：循环里执行一次算一次，方法调用先展开再算。这样得到的 T(n) 是一个不含单位的函数，' +
      '描述"工作量随 n 怎么增长"，而不是"跑多久"。'
    },

    { t: 'code', caption: 'CountOps.java —— 数一数这层嵌套循环执行了多少次', code:
`public class CountOps {
    public static void main(String[] args) {
        int n = 100;
        int count = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                count++;               // executed n * n times
            }
        }
        System.out.println(count);     // 10000
    }
}
` },

    { t: 'p', html:
      '外层跑 n 次，内层每次都完整跑 n 次，所以 <code>count++</code> 执行 n² 次，n = 100 时是 10000。' +
      '严格说还有 <code>i++</code>、<code>j++</code>、条件判断的开销，但它们的量级同样是 n² 或更低，' +
      '在 Big-O 里都会被丢掉——<b>先数对最高阶的那一项，细节留给化简规则</b>。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 数操作', html: '能说出为什么数"操作次数"而不是"秒数"，并把上面嵌套循环的 T(n) 写成 n²。' }
    ] },

    { t: 'h', text: '二、Big-O：只保留增长的量级', id: 'ch13-2' },

    { t: 'p', html:
      '<b>Big-O 记法（Big-O notation）</b>描述增长率的上界：如果存在正常数 c 和 n₀，' +
      '使得当 n ≥ n₀ 时 <code>T(n) ≤ c·f(n)</code>，就记作 <code>T(n) = O(f(n))</code>。' +
      '人话版：<b>n 很大时，T(n) 长得像什么</b>。它故意忽略两样东西——常数系数（3n² 和 n² 一回事）' +
      '和低阶项（n² + n + 1 里 n 和 1 无关紧要），因为量级才是决定"能不能跑"的因素。'
    },

    { t: 'p', html:
      '化简只有三条规则：<b>去掉常数系数、丢掉低阶项、只看最高阶</b>。' +
      '为什么能丢？n = 10000 时 3n² 是 3 亿，5n 只有 5 万，常数项 2 更是零头——' +
      '低阶项和系数改变不了量级。下面这段程序把"各项占比"打印出来，你能亲眼看到它随 n 迅速失衡。'
    },

    { t: 'steps', items: [
      { title: '原式', html: '<code>T(n) = 3n² + 5n + 2</code>' },
      { title: '去掉系数', html: '3n² → n²，5n → n：<code>n² + n + 1</code>' },
      { title: '丢掉低阶项', html: 'n 与常数在 n 很大时可忽略：<code>n²</code>' },
      { title: '结果', html: '<code>T(n) = O(n²)</code>；O(n²) 不能写成 O(n³)，上界不能随意收紧。' }
    ] },

    { t: 'code', caption: 'Simplify.java —— 3n² 的占比：85% → 99% → 99%', code:
`public class Simplify {
    static long tn(long n) {
        return 3 * n * n + 5 * n + 2;
    }

    public static void main(String[] args) {
        long[] ns = {10, 1000, 1000000};
        for (int k = 0; k < ns.length; k++) {
            long n = ns[k];
            long t = tn(n);
            long top = 3 * n * n;
            long low = 5 * n + 2;
            System.out.println("n = " + n);
            System.out.println("  T(n) = " + t);
            System.out.println("  3n^2 = " + top + "  share = " + (top * 100 / t) + "%");
            System.out.println("  rest = " + low);
        }
    }
}
` },

    { t: 'p', html:
      'n = 10 时最高阶只占 85%，还有 15% 是"零头"；n = 1000 时占 99%，n = 1000000 时低阶项只剩 500 万，' +
      '相对 3 万亿可以忽略。这就是 Big-O 敢丢项的依据：<b>n 越大，最高阶越绝对主导</b>。' +
      '注意实现上要用 long：n = 1000000 时 3n² 已经是 3×10¹²，int 早就溢出了' +
      '（这正是第 02 章讲的溢出，在复杂度题里也常出现）。'
    },

    { t: 'callout', kind: 'warn', title: '化简的三个陷阱', html:
      '① <b>O(2n) 要写成 O(n)</b>，O(3n² + n) 要写成 O(n²)；系数一律丢弃，写 O(2n) 会被判不规范。<br>' +
      '② <b>连续两段循环是相加不是相乘</b>：两个 n 次循环一前一后是 2n → O(n)，不是 O(n²)。<br>' +
      '③ <b>别忘了每步的代价</b>：循环体里如果调用了 O(n) 的操作（如 <code>String</code> 拼接），外层再 n 次，' +
      '整体就是 O(n²)——<b>复杂度 = 循环次数 × 每步代价</b>。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 定义', html: '能写出 Big-O 的不等式定义，并解释"上界"是什么意思。' },
      { title: '检查点 · 化简', html: '能把 5n³ + 100n² + 7 化简成 O(n³)，并说出丢掉每一项的理由。' }
    ] },

    { t: 'h', text: '三、常见阶与增长曲线', id: 'ch13-3' },

    { t: 'p', html:
      '下面这六个阶就是 本课程的"生存等级"：前五个在数据量大时还能用，最后一个 O(2ⁿ) 稍微大一点就跑不完。' +
      '背下它们的相对大小只是第一步，更重要的是记住每个阶<b>典型长什么样</b>，' +
      '这样看到代码就能反推它属于哪一档。'
    },

    { t: 'table',
      head: ['阶', '名称', '典型代码', 'n 很大时'],
      rows: [
        ['O(1)', '常数', '<code>a[i]</code>、<code>arr.length</code>', '不随 n 变化'],
        ['O(log n)', '对数', '二分查找、每轮减半的循环', 'n 翻倍只多 1 次'],
        ['O(n)', '线性', '遍历一遍数组', '与 n 成正比'],
        ['O(n log n)', '线性对数', '归并排序、快速排序（平均）', '比线性稍慢，仍可接受'],
        ['O(n²)', '平方', '双层嵌套循环、选择/插入排序', 'n 翻倍，时间翻 4 倍'],
        ['O(2ⁿ)', '指数', '朴素递归斐波那契、枚举所有子集', 'n 稍大就跑不完']
      ],
      caption: '这六个阶按从小到大排列；考试常让你排序，或者判断某段代码属于哪一档' },

    { t: 'svg', maxW: 780, caption: '操作数随 n 的增长（纵轴为对数刻度）。若用普通刻度，O(1) 与 O(log n) 会被压成贴着 x 轴的一条线。', html:
`<svg viewBox="0 0 800 430" role="img" aria-label="常见复杂度增长曲线">
  <text x="20" y="28" font-size="13" font-weight="700" fill="var(--accent)">操作数随 n 增长（纵轴 log₁₀，刻度 10⁰ 到 10⁶）</text>

  <line x1="80" y1="60" x2="80" y2="360" stroke="var(--line2)" stroke-width="1.2"/>
  <line x1="80" y1="360" x2="700" y2="360" stroke="var(--line2)" stroke-width="1.2"/>
  <line x1="80" y1="260" x2="700" y2="260" stroke="var(--line)" stroke-width="1"/>
  <line x1="80" y1="160" x2="700" y2="160" stroke="var(--line)" stroke-width="1"/>
  <line x1="80" y1="60" x2="700" y2="60" stroke="var(--line)" stroke-width="1"/>

  <text x="72" y="364" font-size="11" text-anchor="end" fill="var(--text3)">10⁰</text>
  <text x="72" y="264" font-size="11" text-anchor="end" fill="var(--text3)">10²</text>
  <text x="72" y="164" font-size="11" text-anchor="end" fill="var(--text3)">10⁴</text>
  <text x="72" y="64" font-size="11" text-anchor="end" fill="var(--text3)">10⁶</text>
  <text x="80" y="380" font-size="11" fill="var(--text3)">0</text>
  <text x="390" y="380" font-size="11" text-anchor="middle" fill="var(--text3)">32</text>
  <text x="700" y="380" font-size="11" text-anchor="middle" fill="var(--text3)">n = 64</text>

  <polyline points="80,360 700,360" fill="none" stroke="var(--text3)" stroke-width="2" stroke-dasharray="5 4"/>
  <polyline points="89.7,360 157.5,334.9 235,329.4 390,324.9 545,322.6 700,321" fill="none" stroke="var(--accent2)" stroke-width="2"/>
  <polyline points="89.7,360 157.5,314.9 235,299.8 390,284.7 545,275.9 700,269.7" fill="none" stroke="var(--ok)" stroke-width="2"/>
  <polyline points="89.7,360 157.5,289.7 235,269.2 390,249.6 545,238.5 700,230.7" fill="none" stroke="var(--warn)" stroke-width="2"/>
  <polyline points="89.7,360 157.5,269.7 235,239.6 390,209.5 545,191.9 700,179.4" fill="none" stroke="var(--err)" stroke-width="2"/>
  <polyline points="89.7,344.9 118.75,299.8 157.5,239.6 196.25,179.4 235,119.2 273.75,59" fill="none" stroke="var(--accent)" stroke-width="2.4"/>
  <line x1="273.75" y1="59" x2="300" y2="42" stroke="var(--accent)" stroke-width="1.6" stroke-dasharray="4 3"/>

  <text x="708" y="364" font-size="11" fill="var(--text3)">O(1)</text>
  <text x="708" y="317" font-size="11" fill="var(--accent2)">O(log n)</text>
  <text x="708" y="274" font-size="11" fill="var(--ok)">O(n)</text>
  <text x="708" y="235" font-size="11" fill="var(--warn)">O(n log n)</text>
  <text x="708" y="184" font-size="11" fill="var(--err)">O(n²)</text>
  <text x="302" y="44" font-size="11" fill="var(--accent)">O(2ⁿ) 冲出画面</text>

  <text x="20" y="412" font-size="11" fill="var(--text3)">读法：n=64 时 O(n²) 约 4096 次操作，O(n log n) 约 385 次，O(log n) 只要 6 次。</text>
</svg>`
    },

    { t: 'p', html:
      '注意纵轴是<b>对数刻度</b>：曲线画成直线不代表线性关系。看的是相对位置与斜率——' +
      'O(n²) 越到右边越陡，O(n log n) 稳在它下方，O(log n) 几乎贴着底。' +
      '这张图的实用价值是：当你把算法从 O(n²) 换成 O(n log n)，n = 64 时只有 10 倍差距，' +
      '但 n = 100 万时就是几百倍——<b>量级差距会随规模放大</b>。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 排序', html: '能把 O(n²)、O(n log n)、O(log n)、O(n)、O(1) 按增长速度排好。' },
      { title: '检查点 · 典型代码', html: '看到"遍历一遍"能想到 O(n)，看到"每轮减半"能想到 O(log n)。' }
    ] },

    { t: 'h', text: '四、分析循环：三个模板', id: 'ch13-4' },

    { t: 'p', html:
      '考试里的复杂度分析，九成逃不出三种循环：单层、嵌套、每轮减半。' +
      '下面这段程序把四种情况放在一起，跑一遍、再点「单步」走两轮，把四个计数和你的推理对一对。'
    },

    { t: 'code', caption: 'LoopCount.java · 单步看四个计数', trace: true, code:
`public class LoopCount {
    public static void main(String[] args) {
        int n = 16;
        int c1 = 0;
        int c2 = 0;
        int c3 = 0;
        int c4 = 0;

        for (int i = 0; i < n; i++) {
            c1++;                      // n times -> O(n)
        }

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                c2++;                  // n * n times -> O(n^2)
            }
        }

        for (int i = n; i > 0; i = i / 2) {
            c3++;                      // halving -> O(log n)
        }

        for (int i = 0; i < n; i++) {
            c4++;                      // n times
        }
        for (int i = 0; i < n; i++) {
            c4++;                      // n more -> total 2n -> O(n)
        }

        System.out.println(c1);        // 16
        System.out.println(c2);        // 256
        System.out.println(c3);        // 5
        System.out.println(c4);        // 32
    }
}
` },

    { t: 'p', html:
      '四个数是 16、256、5、32，分别对应 O(n)、O(n²)、O(log n)、O(n)。' +
      '最后一个最容易错：两个连续的 n 次循环加起来是 2n，丢掉系数还是 O(n)——不是 O(2n)，更不是 O(n²)。' +
      '记两条规则：<b>嵌套看乘积</b>（外层 n 次、内层每次 n 次，合起来 n²）；' +
      '<b>减半看对数</b>（每轮 i 除以 2，走 k 轮后到 1，2^k = n，所以 k = log₂n）。'
    },

    { t: 'p', html:
      '第三个模板需要多练一步推导：<code>for (int i = n; i &gt; 0; i = i / 2)</code> 从 n 开始，' +
      '每轮砍一半，n → n/2 → n/4 → … → 1 → 0。假设走了 k 轮，那么 n / 2^k ≈ 1，取对数得 k = log₂n。' +
      '所以 n = 16 时是 5 次（16→8→4→2→1→0），n = 1024 时是 11 次——<b>n 翻了 64 倍，次数只加了 6</b>，' +
      '这就是对数阶的威力。下面这段代码把三种写法并排放，验证一下。'
    },

    { t: 'code', caption: 'HalfLoop.java —— 减半与倍增：1024 只需要 10~11 次', code:
`public class HalfLoop {
    public static void main(String[] args) {
        int n = 1024;
        int c1 = 0;
        for (int i = n; i > 0; i = i / 2) {
            c1++;
        }
        System.out.println("halve  = " + c1);      // 11

        int c2 = 0;
        for (int i = 1; i < n; i = i * 2) {
            c2++;
        }
        System.out.println("double = " + c2);      // 10

        int m = 1024;
        int c3 = 0;
        while (m > 1) {
            m = m / 2;
            c3++;
        }
        System.out.println("while  = " + c3);      // 10
    }
}
` },

    { t: 'p', html:
      '输出 11、10、10。差别只在一个细节：第一种以 <code>i &gt; 0</code> 为条件，会多跑一轮到 i = 0；' +
      '后两种以 <code>i &lt; n</code> 或 <code>m &gt; 1</code> 为条件，正好是 10 轮。' +
      '差 1 次不影响阶，但会影响"数具体次数"的题——<b>先判断阶，再抠边界</b>。'
    },

    { t: 'h', lvl: 3, text: '最好、最坏与平均情况' },

    { t: 'p', html:
      '同一段代码，输入不同，操作次数可以差很多。以线性查找为例：找的元素正好在第一个位置，比较 1 次就返回（<b>最好情况 best case</b>）；' +
      '要找的元素不在数组里，必须比较 n 次（<b>最坏情况 worst case</b>）；随机找一个存在的元素，平均要比较 (n+1)/2 次（<b>平均情况 average case</b>）。' +
      '三者的 Big-O 都是 O(n)，但具体次数差一个常数因子甚至差 n 的量级——' +
      '考试问"最坏情况比较多少次"时要给具体数，问"复杂度"时三者通常同为 O(n)（排序是例外：快排最坏 O(n²)、平均 O(n log n)）。'
    },

    { t: 'code', caption: 'BestWorstAvg.java —— 同一方法，1 次 / 4 次 / 6 次', code:
`public class BestWorstAvg {
    static int find(int[] a, int target, int[] ops) {
        for (int i = 0; i < a.length; i++) {
            ops[0]++;
            if (a[i] == target) {
                return i;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] a = {4, 8, 15, 16, 23, 42};

        int[] best = {0};
        find(a, 4, best);
        int[] mid = {0};
        find(a, 16, mid);
        int[] worst = {0};
        find(a, 99, worst);

        int total = 0;
        for (int i = 0; i < a.length; i++) {
            int[] o = {0};
            find(a, a[i], o);
            total += o[0];
        }

        System.out.println("best  = " + best[0]);   // 1
        System.out.println("mid   = " + mid[0]);    // 4
        System.out.println("worst = " + worst[0]);  // 6
        System.out.println("avg   = " + ((double) total / a.length));   // 3.5
    }
}
` },

    { t: 'p', html:
      '输出 1、4、6、3.5。注意 <code>ops</code> 是长度为 1 的数组——用来在方法外部累计计数' +
      '（Java 参数是值传递，传 int 改不了外部变量，传数组可以改元素，第 09 章讲过）。' +
      '平均 3.5 正好等于 (n+1)/2 = 3.5，这是线性查找平均情况的公式：每个位置被查到的概率相同，(1+2+…+n)/n。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 三模板', html: '能给单层、嵌套、减半三种循环分别写出 T(n) 与 Big-O。' },
      { title: '检查点 · 三种情况', html: '能说出线性查找的最好/最坏/平均比较次数，并解释复杂度为什么都是 O(n)。' }
    ] },

    { t: 'h', text: '五、倍增法：用实测数据验证', id: 'ch13-5' },

    { t: 'p', html:
      '有时看不到代码结构（比如调用别人的库），只能测。<b>倍增法（doubling test）</b>：把 n 翻倍，' +
      '看工作量变成几倍。比值约 2 → O(n)；约 4 → O(n²)；约 2.2 → O(n log n)；几乎不变 → O(log n)。' +
      '下面这段程序把"操作次数"当成可观测的值打印出来，避免受 JVM 预热影响。'
    },

    { t: 'code', caption: 'Doubling.java —— 每翻倍一次，工作量翻 4 倍 → O(n²)', code:
`public class Doubling {
    static int work(int n) {
        int count = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                count++;
            }
        }
        return count;
    }

    public static void main(String[] args) {
        int n = 20;
        for (int k = 0; k < 4; k++) {
            int t = work(n);
            System.out.println("n = " + n + "  work = " + t);
            n = n * 2;
        }
    }
}
` },

    { t: 'p', html:
      '输出四行：20→400、40→1600、80→6400、160→25600。n 每翻倍，work 变 4 倍——这是 O(n²) 的签名。' +
      '真实 JVM 上 n 涨到几十万也只是眨眼之间，本站引擎为了教学演示限制了执行步数，所以这里用较小规模。' +
      '你只要看"n 翻倍、work 变 4 倍"这个比例关系，不必在意绝对数字。' +
      '站内 <a href="#/labs/doubling">倍增法实验台</a> 就是把这件事做成表格：填入实测的 n 与耗时，它自动算比值并给出判断。'
    },

    { t: 'table',
      head: ['复杂度', 'n 翻倍时工作量约变为', '比值', '实测判断'],
      rows: [
        ['O(1)', '不变', '1', '跟 n 无关'],
        ['O(log n)', '多 1 次', '略大于 1', '几乎不变'],
        ['O(n)', '2 倍', '2', '线性增长'],
        ['O(n log n)', '2.1 ~ 2.3 倍', '≈2.2', '略高于线性'],
        ['O(n²)', '4 倍', '4', '翻倍就翻四倍'],
        ['O(2ⁿ)', 't2 ≈ t1²', '按平方增长', '很快就测不动了']
      ],
      caption: '倍增法的判据：看 t2/t1 与 2、4 的关系，选最接近的那个阶' },

    { t: 'p', html:
      '下面是在本站环境里用倍增法跑 <code>CaseB</code>（第 10 节完整案例）得到的实测数据：' +
      'n 从 25 到 200，操作数 300 → 1225 → 4950 → 19900，比值 4.08 → 4.04 → 4.02，稳定逼近 4，' +
      '所以结论是 O(n²)。注意第一个比值不是 4：n 很小时低阶项与常数还占一定比例，' +
      '这也解释了为什么<b>倍增法要至少取三个点</b>，且从足够大的 n 开始。'
    },

    { t: 'table',
      head: ['n', 'work(n) = n(n-1)/2', 't₂/t₁', '判断'],
      rows: [
        ['25', '300', '—', '起点'],
        ['50', '1225', '4.08', '接近 4'],
        ['100', '4950', '4.04', '接近 4'],
        ['200', '19900', '4.02', '稳定 4 → O(n²)']
      ],
      caption: '实测数据来自 CaseB.java 的本站运行输出；真实机器上时间比值会受噪声影响，多跑几次取平均' },

    { t: 'callout', kind: 'warn', title: '测时间的四个坑', html:
      '① <b>JVM 预热</b>：前几次运行会被解释器拖慢，先热身再计时。' +
      '② <b>计时精度</b>：<code>System.currentTimeMillis()</code> 只有毫秒级，小数据量测不出来，要用 <code>System.nanoTime()</code>。' +
      '③ <b>数据差异</b>：有序、逆序、随机的耗时可能不同，要说明用的哪种。' +
      '④ <b>只测一次不算数</b>：同一 n 多跑几次取平均。<br>' +
      '所以更稳的做法是像上面那样<b>数操作次数</b>——它没有噪声，能直接算出比值。'
    },

    { t: 'p', html:
      '什么时候用倍增法、什么时候直接分析？<b>能看代码结构就直接分析</b>：数循环层数、看步长，' +
      '三步就能出结论，不必跑。倍增法是给三类情况准备的——① 调用了看不到源码的库；' +
      '② 代码里有多层方法调用，人工数不清；③ 想验证自己的分析对不对。' +
      '考试里基本只能用直接分析（没条件跑），所以两种都要会：一种用于答题，一种用于验证。'
    },

    { t: 'lab', id: 'bigo' },
    { t: 'lab', id: 'doubling' },

    { t: 'keypoint', items: [
      { title: '检查点 · 倍增法', html: '给一组 (n, t) 数据，能用电比值判断是 O(n)、O(n log n) 还是 O(n²)。' },
      { title: '检查点 · 前提', html: '能说出为什么至少要测三个点、为什么小 n 的比值不可靠。' }
    ] },

    { t: 'h', text: '六、空间复杂度', id: 'ch13-6' },

    { t: 'p', html:
      '<b>空间复杂度（space complexity）</b>：算法<b>额外</b>占用的内存随 n 怎么增长。注意"额外"二字——' +
      '输入本身占的空间不算，只算你自己申请的那部分。它和时间复杂度一样用 Big-O 表示，' +
      '但关心的人少得多：现代机器内存普遍够用，除非处理超大数据或在嵌入式设备上。'
    },

    { t: 'p', html:
      '三个典型：选择排序原地交换只要 O(1)（几个临时变量）；归并排序需要 O(n) 的辅助数组；' +
      '快速排序的递归栈平均 O(log n)。有时<b>用空间换时间是划算的</b>：哈希表用 O(n) 空间换来平均 O(1) 查找；' +
      '第 12 章的记忆化斐波那契用 O(n) 的表，把时间从指数级降到线性。反过来，内存受限时要优先选原地算法。'
    },

    { t: 'code', caption: 'SpaceDemo.java —— 同一个问题，三种额外空间', code:
`public class SpaceDemo {
    static int constantSpace(int n) {
        int a = 1;
        int b = 2;
        int c = 3;
        return a + b + c + n;          // 3 个 int，与 n 无关 -> O(1)
    }

    static int linearSpace(int n) {
        int[] arr = new int[n];         // n 个 int -> O(n)
        return arr.length;
    }

    static int squareSpace(int n) {
        int[] grid = new int[n * n];    // n^2 个 int -> O(n^2)
        return grid.length;
    }

    public static void main(String[] args) {
        int n = 8;
        System.out.println("constant = " + constantSpace(n) + "  extra: 3 ints");
        System.out.println("linear   = " + linearSpace(n) + "  extra: n ints");
        System.out.println("square   = " + squareSpace(n) + "  extra: n^2 ints");
    }
}
` },

    { t: 'p', html:
      '三个方法返回 14、8、64，对应额外空间 O(1)、O(n)、O(n²)。' +
      '注意 <code>squareSpace</code> 里 <code>new int[n * n]</code> 在 n = 8 时只占 64 个 int，' +
      '看着无害；但 n = 1000 时就是 100 万个 int（约 4 MB），n = 10000 时 1 亿个（约 400 MB）——' +
      '二维数组/矩阵是 O(n²) 空间最常见的来源，写图像与网格算法时要先估算。<br>' +
      '还有一类容易忽略的：<b>递归的调用栈</b>也算空间。递归深度 n 的函数，空间至少 O(n)。' +
      '比如第 12 章的阶乘递归 <code>fact(n)</code> 会压 n 层栈帧，所以它时间 O(n)、空间也 O(n)；' +
      '而同样求阶乘的循环版本只需要几个临时变量，空间 O(1)——<b>同一个问题的两种写法，时间可能同阶，空间却差一个量级</b>。' +
      '考试问"空间复杂度"时，别忘了把递归栈算进去。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 额外空间', html: '能解释"额外"的含义，并说出为什么输入数组本身不计入空间复杂度。' },
      { title: '检查点 · 典型算法', html: '能说出选择排序 O(1)、归并 O(n)、快排栈 O(log n) 各自的来源。' }
    ] },

    { t: 'h', text: '七、四个常见误区', id: 'ch13-7' },

    { t: 'p', html:
      '复杂度分析的错误很少出在化简上（规则就三条），八成错在"数错次数"。下面四条是历年最常踩的坑，' +
      '每一条都对应一个具体的判断错误——注意它们都不是语法问题，而是<b>对代码行为的误读</b>。'
    },

    { t: 'table',
      head: ['误区', '反例', '正确结论'],
      rows: [
        ['见嵌套就写 O(n²)', '内层固定跑 3 次：<code>for (j = 0; j &lt; 3; j++)</code>', '3n → <b>O(n)</b>，常数层数不进阶'],
        ['只看层数不看内层次数', '<code>for (i = 0; i &lt; n; i++) for (j = 0; j &lt; i; j++)</code>', '1+2+…+n = n(n-1)/2 → 仍是 <b>O(n²)</b>'],
        ['忘了每步的代价', '单层循环里做 <code>s = s + i</code>（字符串拼接复制 O(n)）', 'n × O(n) = <b>O(n²)</b>'],
        ['把并列当嵌套', '两个独立的 n 次循环一前一后', 'n + n = 2n → <b>O(n)</b>']
      ],
      caption: '四条误区全部是"看结构猜阶"造成的；正确做法永远是先写出 T(n) 再加总' },

    { t: 'code', caption: 'Misconception.java · 嵌套 ≠ n²', code:
`public class Misconception {
    public static void main(String[] args) {
        int n = 50;

        // 看起来嵌套，内层固定 3 次：仍是 O(n)
        int c1 = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < 3; j++) {
                c1++;
            }
        }

        // 单层循环，但内层长度随 i 变：1+2+...+n = O(n^2)
        int c2 = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++) {
                c2++;
            }
        }

        System.out.println("nested-constant = " + c1 + "  -> O(n)");
        System.out.println("inner-grows     = " + c2 + "  -> O(n^2)");
    }
}
` },

    { t: 'p', html:
      '输出 <code>150</code> 与 <code>1225</code>。第一段外层 50 次、内层固定 3 次，总 150 = 3n，' +
      '去掉系数是 O(n)——虽然写了两层 <code>for</code>，但内层不随 n 增长。' +
      '第二段只有"一层半"循环，但内层跑 i 次，总和 1+2+…+49 = 1225 = n(n-1)/2，' +
      '这是 O(n²) 的标准形态。<b>结论：数总次数，不要数括号层数。</b>'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 嵌套', html: '能判断"内层固定 100 次"的双层循环是 O(n) 而不是 O(n²)。' },
      { title: '检查点 · 阶梯循环', html: '能推出 <code>for (j = 0; j &lt; i; j++)</code> 的总次数是 n(n-1)/2。' }
    ] },

    { t: 'h', text: '八、调试实录：三个复杂度误判', id: 'ch13-8' },

    { t: 'p', html:
      '复杂度写错不像语法错误那样报错，程序照样跑，只是"跑得比预期慢"。排查这类问题有一个固定流程：' +
      '① <b>先测规模</b>——n 翻倍两次，看耗时或操作数怎么变；② <b>再找热点</b>——哪个循环/哪一步占大头；' +
      '③ <b>最后算阶</b>——写出 T(n)，别凭"感觉像 n²"。下面三个案例都是真实会发生的误判。'
    },

    { t: 'steps', items: [
      { title: '用规模判断而不是猜', html: '至少测两个规模：n 与 2n，比操作数或耗时；倍增一次不够准。' },
      { title: '找热点行', html: '把计数打进最内层语句，看哪个计数最大——通常就是它决定阶。' },
      { title: '写出 T(n) 再化简', html: '先加总所有部分，再丢系数与低阶项；不要跳过加总直接写阶。' }
    ] },

    { t: 'h', lvl: 3, text: '案例 1：把 O(n²) 当成 O(n)' },

    { t: 'p', html:
      '需求是"找出数组里重复的元素对"。有人写了两层循环（每对都比较一次），却因为"外层只有一个 for"就认为是 O(n)。' +
      '定位：把计数打在内层，n = 5 时比较 10 次 = n(n-1)/2，而 n = 5 的线性扫描只该有 5 次——差了一倍，' +
      '说明内层不是常数。结论：<b>内层次数随外层变化时，必须做求和</b>，和的结果 n(n-1)/2 化简后是 O(n²)。'
    },

    { t: 'code', caption: 'DebugComplexity1.java —— 同样"一趟"，10 次 vs 5 次', code:
`public class DebugComplexity1 {
    // 单趟扫描：O(n)
    static int count(String[] a, String target) {
        int hits = 0;
        for (int i = 0; i < a.length; i++) {
            if (a[i].equals(target)) {
                hits++;
            }
        }
        return hits;
    }

    // 每个元素都和其他元素比较：O(n^2)
    static int duplicatePairs(String[] a) {
        int pairs = 0;
        for (int i = 0; i < a.length; i++) {
            for (int j = i + 1; j < a.length; j++) {
                if (a[i].equals(a[j])) {
                    pairs++;
                }
            }
        }
        return pairs;
    }

    public static void main(String[] args) {
        String[] a = {"a", "b", "a", "c", "a"};
        System.out.println("count(a)      = " + count(a, "a"));       // 3
        System.out.println("duplicatePairs = " + duplicatePairs(a));  // 3
        int n = 5;
        System.out.println("pairs(n=5)    ~ " + (n * (n - 1) / 2));   // 10 次比较
    }
}
` },

    { t: 'h', lvl: 3, text: '案例 2：字符串拼接的隐藏 O(n²)' },

    { t: 'p', html:
      '另一个高频误判：单层循环里写 <code>s = s + i</code>，看上去只有 n 次迭代，所以是 O(n)。' +
      '但 Java 的 <code>String</code> 不可变（第 02 章讲过），每次 <code>+</code> 都要新建字符串并<b>复制已有全部字符</b>。' +
      '第 i 轮复制 i 个字符，总复制量 1+2+…+n = n(n+1)/2，是 O(n²)。' +
      '定位方法：在循环里累加 <code>s.length()</code>，n = 10 时得到 55 而不是 10——这就是"每步代价被忽略"的直接证据。' +
      '修法：改用 <code>StringBuilder</code>（append 均摊 O(1)），或先收集到数组再一次性拼接。'
    },

    { t: 'code', caption: 'DebugComplexity2.java —— 10 次循环，复制了 55 个字符', code:
`public class DebugComplexity2 {
    public static void main(String[] args) {
        int n = 10;
        String s = "";
        int copies = 0;
        for (int i = 0; i < n; i++) {
            s = s + i;               // 每轮都要复制已有字符
            copies += s.length();
        }
        System.out.println("length      = " + s.length());   // 10
        System.out.println("char copies = " + copies);       // 55 = 1+2+...+10
    }
}
` },

    { t: 'h', lvl: 3, text: '案例 3：只数循环、不数每步代价' },

    { t: 'p', html:
      '第三个误判和上一个同源，但更隐蔽：单层循环里调用了另一个耗时与 n 有关的方法。' +
      '比如"对每个元素都做一次线性查找"，或者"对每个元素都排序一次"：<code>for (i = 0; i &lt; n; i++) { sort(a); }</code> ' +
      '看起来是 O(n)，实际是 n × O(n log n) = O(n² log n)。' +
      '判断方法：<b>复杂度 = 循环次数 × 每轮代价</b>，每轮里出现的任何 O(f(n)) 操作都要乘进去。' +
      '这条规则也解释了为什么"两层循环"不等于"一定会慢"——内层如果只做 O(1) 的事，两层还是 O(n)；' +
      '反过来单层循环里做 O(n) 的事，它就变成 O(n²)。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 求和', html: '能推出 1+2+…+n = n(n+1)/2 并说明它属于 O(n²)。' },
      { title: '检查点 · 每步代价', html: '能看出循环里的字符串拼接/嵌套查找会把复杂度乘以一个 n。' }
    ] },

    { t: 'h', text: '完整案例 A：三种去重写法的复杂度', id: 'ch13-9' },

    { t: 'p', html:
      '同一个需求"数组去重"，三种实现对应三种复杂度，最适合横向对比：' +
      '① 双层循环查重（O(n²)）；② 先排序再单趟（排序 O(n log n) + 单趟 O(n)）；③ 哈希集合（平均 O(n)）。' +
      '下面把三种都写在同一个程序里，并打印各自的操作次数——注意输入规模只有 10，' +
      '但操作次数的<b>比例</b>已经能看出差别。读之前先预测：哪个 ops 最大？'
    },

    { t: 'code', caption: 'CaseA.java —— 28 次 / 10 次 / 10 次：同样去重，代价不同', code:
`import java.util.HashSet;

public class CaseA {
    // O(n^2)：每来一个新元素，都回头扫一遍已保留的元素
    static int dedupeQuadratic(int[] a) {
        int[] out = new int[a.length];
        int m = 0;
        int ops = 0;
        for (int i = 0; i < a.length; i++) {
            boolean seen = false;
            for (int j = 0; j < m; j++) {
                ops++;
                if (out[j] == a[i]) {
                    seen = true;
                    break;
                }
            }
            if (!seen) {
                out[m] = a[i];
                m++;
            }
        }
        System.out.println("quadratic ops = " + ops);
        return m;
    }

    // O(n)：输入已排序时，只需和前一元素比较
    static int dedupeSorted(int[] sorted) {
        int m = 0;
        int ops = 0;
        for (int i = 0; i < sorted.length; i++) {
            ops++;
            if (i == 0 || sorted[i] != sorted[i - 1]) {
                m++;
            }
        }
        System.out.println("sorted ops    = " + ops);
        return m;
    }

    // O(n)：哈希表插入一次算一步
    static int dedupeHash(int[] a) {
        HashSet<Integer> set = new HashSet<Integer>();
        for (int i = 0; i < a.length; i++) {
            set.add(a[i]);
        }
        System.out.println("hash ops      = " + a.length);
        return set.size();
    }

    public static void main(String[] args) {
        int[] a = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3};
        int[] sorted = {1, 1, 2, 3, 3, 4, 5, 5, 6, 9};
        System.out.println("unique(quadratic) = " + dedupeQuadratic(a));
        System.out.println("unique(sorted)    = " + dedupeSorted(sorted));
        System.out.println("unique(hash)      = " + dedupeHash(a));
    }
}
` },

    { t: 'p', html:
      '输出关键三行：<code>quadratic ops = 28</code>、<code>sorted ops = 10</code>、<code>hash ops = 10</code>，' +
      '三种方法去重结果都是 7。第一段 28 次比较来自"每个新元素都要和已保留的元素比一遍"，' +
      'n 翻倍时它会变成 4 倍；后两段是 10 次，随 n 线性增长。' +
      '注意第二段隐含了一个前提——<b>输入已排序</b>；如果输入乱序，排序本身要 O(n log n)，' +
      '所以完整代价是 O(n log n)，仍优于 O(n²)。' +
      '第三段的哈希表用 O(n) 额外空间换来平均 O(1) 插入，这是典型的"用空间换时间"。'
    },

    { t: 'table',
      head: ['写法', '时间', '额外空间', '适用场景'],
      rows: [
        ['双层循环查重', 'O(n²)', 'O(n)（输出数组）', 'n 很小、不想排序、不想用集合'],
        ['排序后单趟', 'O(n log n)', 'O(1)（原地排序时）', '本来就要排序，或内存受限'],
        ['哈希集合', '平均 O(n)', 'O(n)', '通用场景，最常用；最坏情况仍是 O(n) 摊销']
      ],
      caption: '去重是"时间—空间权衡"的最佳教学例：三种写法都能得出正确答案，区别只在代价' },

    { t: 'keypoint', items: [
      { title: '检查点 · 对比', html: '能说出去重三种写法的复杂度差异，并解释排序法为什么是 O(n log n)。' }
    ] },

    { t: 'h', text: '完整案例 B：用倍增法拟合真实曲线', id: 'ch13-10' },

    { t: 'p', html:
      '第二个案例把倍增法做成一个可复现的"仪器"：对 <code>work(n) = n(n-1)/2</code> 这样不好一眼看出的式子，' +
      '打印 n 与操作数、自动算比值，用数据判断阶。这个方法的价值在于<b>它可以用于任何黑盒</b>——' +
      '你不需要看到库的源码，只要能把 n 翻倍、观察代价。'
    },

    { t: 'code', caption: 'CaseB.java —— 比值稳定在 4.0x，判定 O(n²)', code:
`public class CaseB {
    static long work(int n) {
        long ops = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++) {
                ops++;
            }
        }
        return ops;
    }

    public static void main(String[] args) {
        int n = 25;
        long prev = 0;
        for (int k = 0; k < 4; k++) {
            long t = work(n);
            double ratio = prev == 0 ? 0.0 : (double) t / prev;
            System.out.printf("n=%4d  work=%7d  ratio=%.2f%n", n, t, ratio);
            prev = t;
            n = n * 2;
        }
    }
}
` },

    { t: 'p', html:
      '输出四行：25→300、50→1225（4.08）、100→4950（4.04）、200→19900（4.02）。' +
      '比值稳定在 4 附近，说明 work 的增长是平方级。若把 work 换成单层循环，比值会稳定在 2；' +
      '换成每轮减半，比值会接近 1（对数阶几乎不随翻倍变化）。' +
      '注意首次比值 4.08 略高，是因为 n 小的时候低阶项还有影响——<b>至少要三个点、并看后两个比值是否收敛</b>。'
    },

    { t: 'callout', kind: 'note', title: '读数时要避开的三个坑', html:
      '① 比值不是整数不代表不是那个阶：O(n log n) 的比值约 2.2，O(n) 在常数较大时也可能测出 2.1。' +
      '② 只测两个点无法区分"收敛到 4"还是"偶然 4"——至少三个点。<br>' +
      '③ 引擎/机器的时间噪声会让比值抖动，所以教学与自测里最好<b>数操作次数</b>而不是计时。'
    },

    { t: 'p', html:
      '分析陌生代码有个三步模板，照做就不会漏：<b>① 找循环</b>（每层循环的次数是 n 的什么函数）；' +
      '<b>② 乘每步代价</b>（循环体里如果调用了 O(n) 的操作，要乘上去）；' +
      '<b>③ 加总再化简</b>（并列部分相加取最大、去系数、丢低阶）。' +
      '比如"外层 n 次，内层每次做一次二分查找 O(log n)"，总代价是 O(n log n)；' +
      '而"外层 n 次，内层每次遍历 n 个元素"，才是 O(n²)。<b>先写式子再化简</b>，比直接猜可靠得多。'
    },

    { t: 'h', text: '教材对照：§4.1 分析算法', id: 'ch13-book' },

{ t: 'table',
      head: ['增长阶', '规模翻倍时耗时约乘', '教材里的例子', '站内对应'],
      rows: [
        ['log n', '几乎不变（+1 次比较）', '二分查找', '本章 O(log n) 模板'],
        ['n', '2', '一次遍历求和', '第 09 章数组遍历'],
        ['n log n', '约 2.2', '归并排序', '第 11 章排序对比'],
        ['n²', '4', '选择排序、3-sum 的平方版', '第 11 章 O(n²) 排序'],
        ['n³', '8', '3-sum 三重循环', '本章 ThreeSumCount']
      ],
      caption: '教材的倍增实验表：不看具体秒数，只看「翻倍后的比值」就能反推增长阶'
    },

{ t: 'code', caption: 'ThreeSumCount.java —— 教材 §4.1：三重循环的 3-sum，增长阶是 n³', code:
`public class Q {
    static int count(int[] a) {
        int n = a.length, count = 0;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                for (int k = j + 1; k < n; k++)
                    if (a[i] + a[j] + a[k] == 0) count++;
        return count;
    }
    public static void main(String[] args) {
        int[] a = {-1, 0, 1, 2, -2};
        System.out.println("count = " + count(a));
    }
}
` },

    { t: 'p', html:
      "教材 §4.1 用<b>科学方法</b>研究性能：观察（跑几组数据计时）→ 假设（猜测增长阶）→ 预测（按模型推算更大规模）→ 验证（真跑一次对照）。它举的例子是 3-sum：三重循环统计和为 0 的三元组，规模每翻一倍，耗时大约变成 8 倍，因为循环有三层。<br><br>输出 <code>count = 2</code>（三元组是 -1+0+1 和 0+2-2）。教材在 1 000、2 000、4 000 个随机数上实测，规模翻倍耗时约乘 8，log-log 图的斜率约 3——与「三层循环 → n³」的预测一致。这就是科学方法的价值：<b>先预测，再验证</b>，而不是跑完看着秒数猜。<br><br>教材 §4.1 的「倍增值」还有一层用途：估算程序在更大规模上的耗时。如果 n = 1000 时跑 1 秒、增长阶是 n²，那么 n = 10000 时约 100 秒——不用真跑就能预判「这个方案上线会超时」。教材把这叫「用增长阶做容量规划」。<br><br>教材 §4.1 还提醒「最好/平均/最坏」要分开看：插入排序最好 O(n)（已有序）、最坏 O(n²)（逆序）；快排平均 O(n log n)、最坏 O(n²)。只报一个数字会误导——工程上既要看典型输入，也要看最坏输入（对手可能构造最坏数据）。教材的做法是：对每个算法都画出「输入规模-耗时」曲线，并标注数据分布。<br><br>教材 §4.1 的实验部分还强调「记录环境」：CPU、内存、JVM 版本、是否开启 JIT，都要写进实验日志。否则别人复现不出同样的曲线——这也是站内第 13 章「可复现实验」清单里的一条。<br><br>教材最后强调：增长阶分析是「预测工具」而不是「精确计时器」。先用它排除量级错误的方案，再用真实数据做基准，两者缺一不可。"
    },

    { t: 'callout', kind: 'note', title: '教材 Q&A：为什么要用倍增值，而不是直接看秒数', html:
      "秒数受机器、编译器、缓存、后台进程影响，换台电脑就不可比。教材的做法是让规模翻倍、观察<b>比值</b>：比值稳定在 2 附近就是线性，4 附近是平方，8 附近是立方。比值是数据自己的性质，与硬件无关。这也解释了本章为什么反复强调「增长阶比绝对时间重要」。<br><br>Big-O 忽略常数，所以两个 O(n log n) 算法在真实数据上可能差几倍。工程上先用增长阶筛掉量级不对的方案，再在小规模基准里比常数——顺序不能反。<br><br>同一台机器、同一份代码、同样的数据分布，只改规模；否则比值会被缓存、JIT、GC 干扰。它建议每个规模重复跑多次取中位数，先预热几轮再计时。"
    },

    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch13-q1' },
    { t: 'quiz', qid: 'ch13-q2' },
    { t: 'quiz', qid: 'ch13-q3' },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      '复杂度是期末（Final）的固定考点，也常混在期中读程序题里，四种问法：' +
      '① <b>化简</b>：给 T(n) = 5n³ + 100n² + 7，问 Big-O（答 O(n³)：只留最高阶、去掉系数）。<br>' +
      '② <b>分析代码</b>：给一段循环问复杂度。F 卷的复杂度大题就是"三段代码分别判断 + 比较谁更快"，' +
      '套路是：先数循环次数，再乘每步代价，最后化简。<br>' +
      '③ <b>读程序 + 问复杂度</b>：Mock A/B 的读程序题常追加一问"这段代码的时间复杂度是多少"，' +
      '比如双层循环 + 每轮一次数组访问就是 O(n²)。<br>' +
      '④ <b>倍增法读表</b>：给几组 (n, 耗时)，让判断是哪种阶——比 t₂/t₁ 与 2、4 的关系即可。<br>' +
      '<b>答题模板</b>：写出 T(n)（带推导）→ 化简 → 给结论 + 一句理由。"只写 O(n²) 不写推导"通常只给部分分。'
    },

    { t: 'keypoint', items: [
      { title: '数操作', html: '只数关键操作，忽略硬件；得到 T(n)，它描述趋势而不是秒数。' },
      { title: 'Big-O 定义', html: 'T(n) ≤ c·f(n) 对足够大的 n 成立；化简：去系数、丢低阶、留最高阶。' },
      { title: '三模板', html: '单层 O(n)、嵌套相乘 O(n²)、每轮减半 O(log n)；连续循环相加取最大。' },
      { title: '常见阶排序', html: 'O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(2ⁿ)。' },
      { title: '三种情况', html: '最好/最坏/平均次数可以差很多，但常见算法的三者同阶（快排除外）。' },
      { title: '倍增法', html: 'n 翻倍看比值：2 → O(n)，≈2.2 → O(n log n)，4 → O(n²)；至少三个点。' },
      { title: '空间复杂度', html: '只算额外内存；选择 O(1)、归并 O(n)、快排栈 O(log n)、递归深度 O(n)。' },
      { title: '误区', html: '数总次数而不是数循环层数；循环里做 O(n) 的操作会把阶乘一个 n。' }
    ] },

    { t: 'checklist', id: 'ch13', items: [
      '我能数出一段双层循环的操作次数并写成 T(n)',
      '我能把 3n² + 5n + 2 化简成 O(n²) 并说明每一步理由',
      '我能分析单层、嵌套、减半三类循环的复杂度',
      '我能按快慢给常见阶排序，并说出每个阶的典型代码',
      '我能区分最好、最坏、平均情况，并给出线性查找的三种次数',
      '我能用倍增法从实测数据判断 O(n) / O(n log n) / O(n²)',
      '我能估算算法的空间复杂度，并解释"额外空间"',
      '我能识别"见嵌套就写 n²""单层循环里做 O(n) 操作"这两类误判',
      '我能把复杂度分析写成"推导 + 结论"的完整答案'
    ] },

    { t: 'p', html:
      '<b>延伸阅读</b>：Sedgewick《Computer Science: An Interdisciplinary Approach》第 4 章（Analysis of Algorithms）' +
      '与本节的 T(n)/增长阶、倍增法完全对应；站内第 11 章「排序与查找」给出了 O(n²) 与 O(n log n) 的真实对比，' +
      '第 12 章「递归」的斐波那契是 O(2ⁿ) 到 O(n) 的经典案例。' +
      '想练手到 <a href="#/quiz/ch13">题库 · ch13</a> 按章筛选，或去实验台「复杂度增长曲线」「倍增法推断复杂度」动手改参数。'
    },

    { t: 'h', text: '学完 14 章主课之后，还有 12 章继续学习', id: 'ch13-next' },

    { t: 'p', html:
      '整门课现在有 <b>26 章 = 14 章主课 + 12 章继续学习</b>，分八个 Part：前四个 Part 是刚走完的主课，' +
      '后四个 Part 是继续学习——数据结构与算法、计算机系统、软件工程、AI 与数据。' +
      '这门课给你的是"能读懂、能写出正确程序"的底子，往后的路大致分四类：' +
      '<b>数据结构与算法</b>（栈、队列、树、图、哈希表、动态规划，继续学习部分的前三章）；' +
      '<b>计算机系统</b>（操作系统、计算机网络、数据库，看编程语言之下的那层机器）；' +
      '<b>软件工程</b>（版本控制、测试、设计模式、多人协作）；' +
      '<b>AI 与数据</b>（机器学习、数据工程，数学与工程的交叉）。' +
      '无论选哪条，把"读代码 → 改代码 → 用复杂度判断它会不会慢"这个循环练熟，都是最划算的投入。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '复杂度最适合用来检验 AI：① 给它一段代码让它分析复杂度，你对照本站的 <code>bigo</code> 实验台验证；' +
      '② 故意给它"看起来是 O(n²)、其实是 O(n)"的代码（内层固定跑 100 次），看它会不会犯"见嵌套就写 n²"的错；' +
      '③ 问它某个 Java 库方法的时间复杂度，但要它给出证据——很多库方法的文档里根本没写，AI 会编。<br>' +
      '反过来也可以让它出题：让 AI 生成 5 段长度相近、复杂度不同的代码，你来排序并说明理由，' +
      '再用本站单步/计数验证——这类练习比背表格有效得多。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：复杂度分析：数操作次数、Big-O 定义与化简、常见阶、循环/嵌套/多段代码模板、最好最坏平均、空间复杂度、倍增法实验。<br>依据：Course Outline v5 的 Complexity Analysis and Performance 部分；Sedgewick §4.1（Analysis of Algorithms）。本站为个人整理的学习材料，与课程要求冲突时以老师和课程大纲为准；代码均在真实 JDK 上校验过。' }

  ]
});