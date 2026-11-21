/* =====================================================================
 * data/ch12.js · 第 12 章：递归
 * 职责：递归三要素、调用栈去程/回程、阶乘与斐波那契、递归树与重复子问题、
 *       记忆化与自底向上、汉诺塔/全排列/二分查找、递归 vs 迭代、三个调试实录、两个完整案例
 * 对外 API：CSC.registerChapter({...})（内容块 schema 见 _dev/CONTRACT.md §4–§5）
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch12',
  num: '12',
  title: '递归',
  en: 'Recursion',
  goals: [
    '能写出含基线条件与递归步骤的方法，并说明它为什么会终止',
    '能画出调用栈，说清"去程压栈、回程返回"两个阶段',
    '能画出递归树，解释朴素斐波那契为什么指数爆炸',
    '能写出记忆化版本，并把"指数级 → 线性"的对比讲清楚',
    '能判断一个问题适合用递归还是迭代，并说出理由（可读性 / 栈深度 / 重复计算）',
    '能按"基线—推进—返回"三步排查递归 bug'
  ],
  kp: [
    { id: 'ch12-1', title: '递归三要素' },
    { id: 'ch12-2', title: '调用栈：去程与回程' },
    { id: 'ch12-3', title: '阶乘与斐波那契' },
    { id: 'ch12-4', title: '递归树与重复子问题' },
    { id: 'ch12-5', title: '记忆化 memoization' },
    { id: 'ch12-6', title: '汉诺塔、全排列与二分查找' },
    { id: 'ch12-7', title: '递归 vs 迭代' },
    { id: 'ch12-8', title: '递归 bug 的调试方法' }
  ],
  blocks: [

    /* ------------------------------------------------------------------ 开篇 */
    { t: 'callout', kind: 'why', html:
      '先看一个"反直觉"的小程序：写一个方法把 1 到 n 打印出来，很多人会先在递归调用<b>之前</b>打印，' +
      '以为会输出 <code>3 2 1</code>，结果却是 <code>1 2 3</code>。把打印挪到递归调用<b>之后</b>，顺序又反过来。<br>' +
      '递归是最像魔法的编程技巧：方法自己调用自己。写对了，六行代码解决汉诺塔；写错了，' +
      '要么 <code>StackOverflowError</code>，要么指数级卡死。这一章只做一件事：<b>让你能在纸上画出递归的执行过程</b>' +
      '——去程怎么压栈、回程怎么返回、递归树上有多少重复——而不是凭感觉猜。'
    },

    { t: 'p', lead: true, html:
      '先运行下面这段程序，把输出记下来：它为什么不是 <code>3 2 1</code>？'
    },

    { t: 'code', caption: 'OpeningRec.java · 点「单步」看栈帧一层层压入再返回', trace: true, code:
`public class OpeningRec {
    static void down(int n) {
        if (n == 0) return;      // 基线条件：不再递归
        down(n - 1);             // 先递归到最深处
        System.out.print(n + " ");   // 返回时再打印
    }

    public static void main(String[] args) {
        down(3);
    }
}
` },

    { t: 'p', html:
      '输出是 <code>1 2 3</code>，不是 <code>3 2 1</code>。原因：<code>down(3)</code> 先调用 <code>down(2)</code>、' +
      '再调用 <code>down(1)</code>、最后到 <code>down(0)</code> 返回；<b>打印语句在递归调用之后</b>，所以它按"回程"的顺序执行：' +
      '<code>down(1)</code> 先打印 1，然后 <code>down(2)</code> 打印 2，最后 <code>down(3)</code> 打印 3。' +
      '把打印挪到 <code>down(n - 1)</code> 之前，就变成"去程"顺序 3 2 1。' +
      '这个"去程 / 回程"的区别，是读懂一切递归输出题的钥匙。'
    },

    { t: 'p', html:
      '本章路线：先立下递归三要素（一），再用调用栈理解去程与回程（二）；' +
      '然后用阶乘与斐波那契（三）引出递归树与重复子问题（四），用记忆化把指数级降下来（五）；' +
      '接着看汉诺塔、全排列与二分查找怎么"照定义写代码"（六），比较递归与迭代的取舍（七）；' +
      '最后用三个调试实录（八）和两个完整案例把递归的写法与排查流程固定下来。'
    },

    /* ------------------------------------------------------------------ 一、三要素 */
    { t: 'h', text: '一、递归三要素', id: 'ch12-1' },

    { t: 'p', html:
      '<b>递归（recursion）</b>的本质是"把大问题化成同样形式的小问题"。能这样转化的前提有两个：' +
      '有最简单的情况可以直接回答，且每次转化都让问题更小。落到代码上就是三要素，缺一个都会出问题。'
    },

    { t: 'steps', items: [
      { title: '基线条件 base case', html: '最简单的情况，直接返回答案，不再调用自己。它是递归的"出口"。' },
      { title: '递归步骤 recursive step', html: '把问题缩小成同类型的子问题，调用自己。例如 <code>fact(n)</code> 依赖 <code>fact(n-1)</code>。' },
      { title: '逼近 progress', html: '每次调用必须更接近基线条件：传 <code>n-1</code>、把区间减半、把盘子数减一，都是在逼近。' }
    ] },

    { t: 'code', caption: 'Factorial.java · 三要素齐全的阶乘', trace: true, code:
`public class Factorial {
    static int fact(int n) {
        if (n <= 1) return 1;          // 1) base case：0! = 1! = 1
        return n * fact(n - 1);        // 2) recursive step：n! = n × (n-1)!
    }                              // 3) n-1 每次变小 → 一定逼近基线

    public static void main(String[] args) {
        System.out.println(fact(5));    // 120
        System.out.println(fact(10));   // 3628800
    }
}
` },

    { t: 'p', html:
      '把三要素对上代码：<code>if (n &lt;= 1) return 1;</code> 是基线；<code>fact(n - 1)</code> 是递归步骤；' +
      '参数从 <code>n</code> 变成 <code>n - 1</code>，每一步都更接近 1，保证会停。' +
      '<b>没有基线条件</b>会一直调用下去；<b>参数不推进</b>（比如写成 <code>fact(n)</code>）也一样——' +
      '两种情况都会在栈空间耗尽时抛 <code>StackOverflowError</code>。'
    },

    { t: 'callout', kind: 'warn', title: '三要素缺一不可', html:
      '① 缺基线：<code>sum(n) { return n + sum(n - 1); }</code> —— 永远停不下来。<br>' +
      '② 缺推进：<code>fact(n) { return n * fact(n); }</code> —— 基线永远到不了。<br>' +
      '③ 缺递归步骤：那就不是递归，只是一个带判断的普通方法。<br>' +
      '考试给递归函数挖空，八成挖的就是基线条件或递归调用里的 <code>n - 1</code>、<code>mid + 1</code>、<code>i + 1</code>。'
    },

    { t: 'code', caption: 'CallCount.java · 数一数递归被调用了多少次', code:
`public class CallCount {
    static int calls = 0;

    static int sum(int n) {
        calls++;                       // 每进入一层就 +1
        if (n == 0) return 0;
        return n + sum(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(sum(10));   // 55 = 1+2+...+10
        System.out.println(calls);     // 11：n=10 到 n=0 共 11 层
    }
}
` },

    { t: 'p', html:
      '<code>sum(10)</code> 的调用次数是 11，不是 10：因为基线 <code>sum(0)</code> 也算一次调用。' +
      '这种"每一层只调用自己一次"的递归，调用次数与 n 成正比，是<b>线性递归</b>；' +
      '下一节会看到"每层调用自己两次"的递归，调用次数会变成指数级。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 三要素', html: '能写出阶乘/求和，并指出代码里哪一行是基线、哪一行是递归步骤、哪一步在逼近。' },
      { title: '检查点 · 调用次数', html: '能解释 <code>sum(10)</code> 为什么被调用 11 次（基线也算一次）。' }
    ] },

    /* ------------------------------------------------------------------ 二、调用栈 */
    { t: 'h', text: '二、调用栈：去程与回程', id: 'ch12-2' },

    { t: 'p', html:
      '每次递归调用都会在栈顶压入一个新的<b>栈帧（stack frame）</b>，里面装着这次调用的参数和局部变量。' +
      '<code>fact(4)</code> 的调用过程是：<code>fact(4)</code> → <code>fact(3)</code> → <code>fact(2)</code> → ' +
      '<code>fact(1)</code>，这是<b>去程</b>（压栈）；<code>fact(1)</code> 命中基线返回 1，然后一层层返回：' +
      '<code>fact(2)=2×1</code>、<code>fact(3)=3×2</code>、<code>fact(4)=4×6</code>，这是<b>回程</b>（弹栈）。'
    },

    { t: 'svg', maxW: 680, html:
'<svg viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="递归调用栈的去程与回程">\n' +
'  <defs>\n' +
'    <marker id="ch12-arw2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">\n' +
'      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent2)"/>\n' +
'    </marker>\n' +
'  </defs>\n' +
'  <text x="16" y="24" font-size="13" font-weight="700" fill="var(--accent)">调用栈：去程一层层压入，回程一层层弹出</text>\n' +
'  <rect x="30" y="120" width="180" height="44" rx="6" fill="var(--accentSoft)" stroke="var(--accent)"/>\n' +
'  <text x="120" y="147" font-size="12" text-anchor="middle" fill="var(--text)">fact(1) → 1</text>\n' +
'  <rect x="30" y="170" width="180" height="44" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>\n' +
'  <text x="120" y="197" font-size="12" text-anchor="middle" fill="var(--text)">fact(2) → 2×1</text>\n' +
'  <rect x="30" y="220" width="180" height="44" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>\n' +
'  <text x="120" y="247" font-size="12" text-anchor="middle" fill="var(--text)">fact(3) → 3×2</text>\n' +
'  <rect x="30" y="270" width="180" height="44" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>\n' +
'  <text x="120" y="297" font-size="12" text-anchor="middle" fill="var(--text)">fact(4) → 4×6</text>\n' +
'\n' +
'  <text x="260" y="100" font-size="12" fill="var(--text2)">去程（压栈，问题变小）</text>\n' +
'  <line x1="290" y1="112" x2="290" y2="300" stroke="var(--accent2)" stroke-width="1.6" marker-end="url(#ch12-arw2)"/>\n' +
'  <text x="310" y="230" font-size="11" fill="var(--text3)">每调用一次</text>\n' +
'  <text x="310" y="248" font-size="11" fill="var(--text3)">压入一个栈帧</text>\n' +
'\n' +
'  <text x="470" y="100" font-size="12" fill="var(--text2)">回程（弹栈，结果变大）</text>\n' +
'  <line x1="500" y1="300" x2="500" y2="112" stroke="var(--ok)" stroke-width="1.6" marker-end="url(#ch12-arw2)"/>\n' +
'  <text x="520" y="230" font-size="11" fill="var(--text3)">每返回一次</text>\n' +
'  <text x="520" y="248" font-size="11" fill="var(--text3)">弹出一个栈帧</text>\n' +
'  <text x="30" y="320" font-size="11" fill="var(--text3)">栈的最大高度 = 递归深度；fact(100000) 会撑爆栈 → StackOverflowError</text>\n' +
'</svg>',
      caption: '去程压栈、回程弹栈；递归深度就是栈的最大高度' },

    { t: 'p', html:
      '这个顺序解释了所有"递归输出题"：<b>打印语句在递归调用之前</b>，是去程顺序（大 → 小）；' +
      '<b>在递归调用之后</b>，是回程顺序（小 → 大）；如果前后各打印一次，就会得到"两头夹"的输出。' +
      '下面这段程序把两种顺序放在一起对比。'
    },

    { t: 'code', caption: 'PrintOrder.java · 打印放在递归调用前 / 后，顺序相反', code:
`public class PrintOrder {
    static void before(int n) {          // 去程打印：3 2 1
        if (n == 0) return;
        System.out.print(n + " ");
        before(n - 1);
    }

    static void after(int n) {           // 回程打印：1 2 3
        if (n == 0) return;
        after(n - 1);
        System.out.print(n + " ");
    }

    public static void main(String[] args) {
        before(3);
        System.out.println();
        after(3);
        System.out.println();
    }
}
` },

    { t: 'p', html:
      '输出是 <code>3 2 1</code> 和 <code>1 2 3</code>。做这类题不用在脑子里跑完整棵树：' +
      '只要问一句"<b>这行代码在递归调用之前还是之后</b>"，就能判断它属于去程还是回程。' +
      '另外，递归深度就是栈的最大高度：Java 默认栈只能放几千层，<code>fact(100000)</code> 会直接栈溢出——' +
      '这是递归的硬限制，也是"递归 vs 迭代"取舍时最重要的一条。'
    },

    { t: 'lab', id: 'trace' },

    { t: 'keypoint', items: [
      { title: '检查点 · 去程回程', html: '能说出递归的两个阶段，并根据打印语句的位置预测输出顺序。' },
      { title: '检查点 · 栈深度', html: '能解释递归深度过大为什么会 <code>StackOverflowError</code>，并说出"栈帧"在哪。' }
    ] },

    /* ------------------------------------------------------------------ 三、阶乘与斐波那契 */
    { t: 'h', text: '三、阶乘与斐波那契：定义直译', id: 'ch12-3' },

    { t: 'p', html:
      '递归最适合"定义本身就是递归"的问题。阶乘的定义是 <code>n! = n × (n-1)!</code>，基线 <code>0! = 1</code>；' +
      '把它逐字翻译成代码，就是上一节的 <code>Factorial</code>——几乎不用"想算法"，照定义写即可。' +
      '斐波那契（Fibonacci）也一样：F(0)=0、F(1)=1，之后每一项是前两项之和。'
    },

    { t: 'code', caption: 'FibSlow.java · 定义怎么写，代码就怎么写', code:
`public class FibSlow {
    static int fib(int n) {
        if (n < 2) return n;                 // base case: F(0)=0, F(1)=1
        return fib(n - 1) + fib(n - 2);      // recursive step：前两项之和
    }

    public static void main(String[] args) {
        System.out.println(fib(10));    // 55
        System.out.println(fib(15));    // 610
        System.out.println(fib(20));    // 6765
    }
}
` },

    { t: 'p', html:
      '代码只有五行，结果也对，但它有一个大问题：<b>同一个子问题会被反复计算</b>。' +
      '<code>fib(20)</code> 还能瞬间算完，<code>fib(40)</code> 却要好几秒，<code>fib(45)</code> 要几十秒——' +
      '明明 n 只大了一点，时间却翻了几十倍。原因藏在递归树里。'
    },

    { t: 'p', html:
      '顺带提醒一个"不报错但答案错"的隐藏坑：阶乘增长极快，<code>fact(12)</code> 是 479001600（int 还放得下），' +
      '<code>fact(13)</code> 就超过 int 上限（6 227 020 800），Java 会悄悄溢出成负数，程序不报错但答案全错。' +
      '斐波那契同理，<code>fib(47)</code> 超过 int 上限。考试里 n 在 20 以内时 int 够用；一旦题目给到 30 以上，' +
      '就要考虑用 <code>long</code>（第 02 章的类型范围表可以回看）。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 定义直译', html: '能默写阶乘与斐波那契的递归版本，并指出基线条件。' },
      { title: '检查点 · 溢出', html: '知道阶乘/斐波那契增长很快，13! 与 fib(47) 会超过 int 范围。' }
    ] },

    /* ------------------------------------------------------------------ 四、递归树 */
    { t: 'h', text: '四、递归树与重复子问题', id: 'ch12-4' },

    { t: 'p', html:
      '把每次方法调用画成一个节点、调用关系画成边，就得到<b>递归树（recursion tree）</b>。' +
      '<code>fib(4)</code> 的递归树中，<code>fib(2)</code> 被计算 2 次、<code>fib(1)</code> 被计算 3 次、' +
      '<code>fib(0)</code> 被计算 2 次——这些就是<b>重复子问题（overlapping subproblems）</b>。'
    },

    { t: 'svg', maxW: 760, caption: 'fib(4) 的递归树。橙色节点是被重复计算的子问题：fib(2) 两次、fib(1) 三次、fib(0) 两次。', html:
`<svg viewBox="0 0 760 340" role="img" aria-label="fib(4) 的递归调用树">
  <defs>
    <marker id="ch12-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--line2)"/>
    </marker>
  </defs>
  <text x="20" y="28" font-size="13" font-weight="700" fill="var(--accent)">fib(4) 的递归调用树：每个节点是一次方法调用</text>

  <rect x="342" y="45" width="76" height="30" rx="6" fill="var(--accentSoft)" stroke="var(--accent)"/>
  <text x="380" y="65" font-size="12" text-anchor="middle" fill="var(--text)">fib(4)</text>

  <rect x="212" y="115" width="76" height="30" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="250" y="135" font-size="12" text-anchor="middle" fill="var(--text)">fib(3)</text>
  <rect x="472" y="115" width="76" height="30" rx="6" fill="var(--warnSoft)" stroke="var(--warn)"/>
  <text x="510" y="135" font-size="12" text-anchor="middle" fill="var(--text)">fib(2)</text>

  <rect x="122" y="185" width="76" height="30" rx="6" fill="var(--warnSoft)" stroke="var(--warn)"/>
  <text x="160" y="205" font-size="12" text-anchor="middle" fill="var(--text)">fib(2)</text>
  <rect x="262" y="185" width="76" height="30" rx="6" fill="var(--warnSoft)" stroke="var(--warn)"/>
  <text x="300" y="205" font-size="12" text-anchor="middle" fill="var(--text)">fib(1)</text>
  <rect x="422" y="185" width="76" height="30" rx="6" fill="var(--warnSoft)" stroke="var(--warn)"/>
  <text x="460" y="205" font-size="12" text-anchor="middle" fill="var(--text)">fib(1)</text>
  <rect x="542" y="185" width="76" height="30" rx="6" fill="var(--warnSoft)" stroke="var(--warn)"/>
  <text x="580" y="205" font-size="12" text-anchor="middle" fill="var(--text)">fib(0)</text>

  <rect x="72" y="255" width="76" height="30" rx="6" fill="var(--warnSoft)" stroke="var(--warn)"/>
  <text x="110" y="275" font-size="12" text-anchor="middle" fill="var(--text)">fib(1)</text>
  <rect x="172" y="255" width="76" height="30" rx="6" fill="var(--warnSoft)" stroke="var(--warn)"/>
  <text x="210" y="275" font-size="12" text-anchor="middle" fill="var(--text)">fib(0)</text>

  <line x1="360" y1="75" x2="270" y2="113" stroke="var(--line2)" stroke-width="1.4" marker-end="url(#ch12-arw)"/>
  <line x1="400" y1="75" x2="490" y2="113" stroke="var(--line2)" stroke-width="1.4" marker-end="url(#ch12-arw)"/>
  <line x1="230" y1="145" x2="180" y2="183" stroke="var(--line2)" stroke-width="1.4" marker-end="url(#ch12-arw)"/>
  <line x1="270" y1="145" x2="290" y2="183" stroke="var(--line2)" stroke-width="1.4" marker-end="url(#ch12-arw)"/>
  <line x1="490" y1="145" x2="470" y2="183" stroke="var(--line2)" stroke-width="1.4" marker-end="url(#ch12-arw)"/>
  <line x1="530" y1="145" x2="560" y2="183" stroke="var(--line2)" stroke-width="1.4" marker-end="url(#ch12-arw)"/>
  <line x1="140" y1="215" x2="120" y2="253" stroke="var(--line2)" stroke-width="1.4" marker-end="url(#ch12-arw)"/>
  <line x1="180" y1="215" x2="200" y2="253" stroke="var(--line2)" stroke-width="1.4" marker-end="url(#ch12-arw)"/>

  <text x="20" y="312" font-size="12" fill="var(--text2)">fib(2) 被算 2 次，fib(1) 被算 3 次，fib(0) 被算 2 次 —— n 每大一格，重复就翻倍。</text>
</svg>`
    },

    { t: 'p', html:
      '调用次数可以精确数出来。记 C(n) 为 <code>fib(n)</code> 的调用次数，那么 C(0)=C(1)=1、' +
      'C(n) = 1 + C(n-1) + C(n-2)。下表是几个实测值（用计数器统计，不是估算）：'
    },

    { t: 'table',
      head: ['n', '朴素递归调用次数', '记忆化调用次数', '差距'],
      rows: [
        ['10', '177', '19', '约 9 倍'],
        ['15', '1,973', '29', '约 68 倍'],
        ['20', '21,891', '39', '约 561 倍'],
        ['30', '2,692,537', '59', '约 4.5 万倍'],
        ['40', '约 3.3 亿', '79', '约 400 万倍']
      ],
      caption: '朴素递归按 ≈1.6ⁿ 增长；记忆化是线性 2n−1 次调用。这就是"指数爆炸"的量化含义' },

    { t: 'code', caption: 'FibCalls.java · 同一个 fib(15)：朴素版 1973 次调用，记忆化版 29 次', code:
`public class FibCalls {
    static int slowCalls = 0;
    static int fastCalls = 0;

    static int slow(int n) {
        slowCalls++;
        if (n < 2) return n;
        return slow(n - 1) + slow(n - 2);
    }

    static int[] memo = new int[100];

    static int fast(int n) {
        fastCalls++;
        if (n < 2) return n;
        if (memo[n] != 0) return memo[n];      // 算过就直接取
        memo[n] = fast(n - 1) + fast(n - 2);
        return memo[n];
    }

    public static void main(String[] args) {
        System.out.println(slow(15) + " " + slowCalls);   // 610 1973
        System.out.println(fast(15) + " " + fastCalls);   // 610 29
    }
}
` },

    { t: 'p', html:
      '结果相同（610），调用次数从 1973 降到 29。差别不在"算得更快"，而在<b>不再重复算</b>：' +
      '朴素版把整棵递归树都走了一遍，记忆化版每个 n 只算一次。n 越大差距越夸张——' +
      '这就是为什么"算法选错，代码再短也救不了"。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 递归树', html: '能画出 fib(4) 的递归树，并数出 fib(2)/fib(1)/fib(0) 各被调用几次。' },
      { title: '检查点 · 指数爆炸', html: '能说出调用次数按 ≈1.6ⁿ 增长，并解释"重复子问题"是根因。' }
    ] },

    /* ------------------------------------------------------------------ 五、记忆化 */
    { t: 'h', text: '五、记忆化：把算过的答案存起来', id: 'ch12-5' },

    { t: 'p', html:
      '<b>记忆化（memoization）</b>：第一次算出结果时把它存进表里，以后再遇到同一个子问题直接查表。' +
      '只改几行代码，指数级就降成线性级。写法有两种：<b>自顶向下</b>（递归 + 缓存，改递归函数）与' +
      '<b>自底向上</b>（从基线开始用循环填表，也就是动态规划 dynamic programming）。'
    },

    { t: 'code', caption: 'FibIter.java · 自底向上：用两个变量滚动，连数组都不用', code:
`public class FibIter {
    static int fibIter(int n) {
        if (n < 2) return n;
        int a = 0, b = 1;
        for (int i = 2; i <= n; i++) {
            int t = a + b;     // 下一项 = 前两项之和
            a = b;             // 滚动：a 变成旧的 b
            b = t;             // b 变成新算出的项
        }
        return b;
    }

    public static void main(String[] args) {
        System.out.println(fibIter(10));   // 55
        System.out.println(fibIter(40));   // 102334155，瞬间完成
    }
}
` },

    { t: 'callout', kind: 'warn', title: '记忆化的两个细节', html:
      '① <b>哨兵值不能和合法答案冲突</b>：这里用 0 表示"没算过"，因为 n≥2 时 fib 一定大于 0。' +
      '如果答案可能是 0（比如"方案数可能为 0"），就要额外开一个 boolean 数组记录"算过没有"。<br>' +
      '② <b>记忆化不解决栈深度</b>：它把"重复计算"变成 O(1)，但递归仍是一层压一层；n 极大时照样栈溢出。' +
      '要彻底摆脱深度限制，就用自底向上的循环。'
    },

    { t: 'p', html:
      '<b>设计取舍（一）：自顶向下还是自底向上？</b>自顶向下的记忆化最贴近定义，改递归函数即可，' +
      '但代码里要判"算过没有"，空间是 O(n)，还带着栈深度；自底向上从基线开始填表，没有递归、没有栈溢出，' +
      '但需要把定义"倒过来"想清楚填表顺序，而且空间可以从 O(n) 优化到 O(1)（滚动变量）。' +
      '考试里问"怎么优化斐波那契"，答"记忆化/缓存已算结果"即可；若追问"最优"，再答"自底向上 + 滚动变量，O(n) 时间 O(1) 空间"。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 记忆化', html: '能写出自顶向下（数组缓存）与自底向上（滚动变量）两种斐波那契。' },
      { title: '检查点 · 取舍', html: '能说出两种写法在"栈深度 / 空间 / 可读性"上的区别。' }
    ] },

    /* ------------------------------------------------------------------ 六、汉诺塔与全排列 */
    { t: 'h', text: '六、汉诺塔、全排列与二分查找', id: 'ch12-6' },

    { t: 'p', html:
      '<b>汉诺塔（Towers of Hanoi）</b>：三根柱子 A、B、C，n 个盘子从 A 移到 C，每次只能移动一个，' +
      '大盘不能压在小盘上。递归思路短得惊人：把上面 n-1 个盘子从 A 移到 B（借助 C），把最大的从 A 移到 C，' +
      '再把 n-1 个从 B 移到 C（借助 A）。注意三根柱子的角色在递归里"轮换"，这是最容易绕晕的地方。'
    },

    { t: 'code', caption: 'Hanoi.java · 3 个盘子共 7 步', code:
`public class Hanoi {
    static int moves = 0;

    static void move(int n, char from, char to, char via) {
        if (n == 0) return;                 // base case：没有盘子可移
        move(n - 1, from, via, to);         // 先把上面 n-1 个挪到"借力柱"
        moves++;
        System.out.println("disk " + n + ": " + from + " -> " + to);
        move(n - 1, via, to, from);         // 再把 n-1 个挪到目标柱
    }

    public static void main(String[] args) {
        move(3, 'A', 'C', 'B');
        System.out.println("moves = " + moves);   // 7
    }
}
` },

    { t: 'p', html:
      'n 个盘子需要 2ⁿ - 1 步：3 个盘子 7 步，10 个盘子 1023 步，64 个盘子要 1.8×10¹⁹ 步——' +
      '按每秒一步算得 5800 亿年。递归代码只有六行，但问题本身是指数级规模的：<b>算法正确，不代表问题可解</b>。' +
      '汉诺塔的价值在于它是"把 n 化成 n-1 的两个子问题"的完美范例，考试常问"移动 n 个盘子需要几步"和"第 k 步移的是哪个盘子"。'
    },

    { t: 'code', caption: 'Permute.java · 全排列：固定第 k 位，递归排剩下的', code:
`public class Permute {
    static void permute(char[] a, int k) {
        if (k == a.length) {                // 所有位置都固定了 → 输出一个排列
            String s = "";
            for (char c : a) {
                s = s + c;
            }
            System.out.println(s);
            return;
        }
        for (int i = k; i < a.length; i++) {
            char t = a[k];                  // 把 a[i] 换到第 k 位
            a[k] = a[i];
            a[i] = t;

            permute(a, k + 1);              // 固定第 k 位，递归排后面

            t = a[k];                       // 回溯：换回来，试下一个
            a[k] = a[i];
            a[i] = t;
        }
    }

    public static void main(String[] args) {
        permute(new char[]{'A', 'B', 'C'}, 0);
    }
}
` },

    { t: 'p', html:
      '全排列（permutations）是"回溯（backtracking）"的入门：先固定一个位置，递归排剩下的，返回后<b>把交换换回来</b>' +
      '（这一步叫回溯），再试下一个。3 个字母有 3! = 6 种，10 个字母超过 360 万种——阶乘增长，比指数还猛。' +
      '考试问"输出顺序"时按"换位—递归—换回"的顺序手推，别硬背。'
    },

    { t: 'code', caption: 'RecurAlgos.java · 递归版求和、二分查找、回文判断', code:
`public class RecurAlgos {
    static int sum(int[] a, int i) {                 // 数组求和
        if (i == a.length) return 0;
        return a[i] + sum(a, i + 1);
    }

    static int binarySearch(int[] a, int lo, int hi, int target) {
        if (lo > hi) return -1;                      // 区间空了：没找到
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) return binarySearch(a, mid + 1, hi, target);
        return binarySearch(a, lo, mid - 1, target);
    }

    static boolean isPalindrome(String s, int lo, int hi) {
        if (lo >= hi) return true;                   // 0 或 1 个字符：是回文
        if (s.charAt(lo) != s.charAt(hi)) return false;
        return isPalindrome(s, lo + 1, hi - 1);
    }

    public static void main(String[] args) {
        int[] a = {1, 3, 5, 7, 9};
        System.out.println(sum(a, 0));                                  // 25
        System.out.println(binarySearch(a, 0, a.length - 1, 7));         // 3
        System.out.println(binarySearch(a, 0, a.length - 1, 4));         // -1
        System.out.println(isPalindrome("racecar", 0, 6));               // true
        System.out.println(isPalindrome("java", 0, 3));                  // false
    }
}
` },

    { t: 'p', html:
      '这三个方法共用同一个套路：<b>把区间/数组的"待处理部分"缩小</b>。求和把 <code>i</code> 往后移一位；' +
      '二分把 <code>lo/hi</code> 收缩到一半；回文把左右指针各收一格。它们都是"分治（divide and conquer）"的雏形，' +
      '第 11 章的归并排序、快速排序就是把这个套路用在排序上。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 汉诺塔', html: '能写出递归结构（n-1 借力、最大盘、n-1 归位），并说出 2ⁿ−1 步。' },
      { title: '检查点 · 分治缩小', html: '能写出递归求和、递归二分、递归回文，并指出每一步"待处理部分"怎么缩小。' }
    ] },

    /* ------------------------------------------------------------------ 七、递归 vs 迭代 */
    { t: 'h', text: '七、递归 vs 迭代：怎么选', id: 'ch12-7' },

    { t: 'p', html:
      '能写成递归的都能改写成循环。递归的优点是贴近数学定义、代码短、思路清楚；' +
      '缺点是每层调用都有栈帧开销，而且可能栈溢出。迭代省内存、没有深度限制，' +
      '但有些问题（树遍历、汉诺塔、全排列）用递归表达明显更自然。'
    },

    { t: 'compare', left: {
      title: '递归：让方法调用自己',
      html: '代码短、贴近定义；每层调用占一个栈帧，空间 O(深度)，深度过大抛 <code>StackOverflowError</code>。',
      code: 'int r = factRec(6);        // 6 层栈帧，空间 O(n)\n// n! = n * (n-1)! —— 定义怎么写，代码就怎么写'
    }, right: {
      title: '迭代：用循环重复',
      html: '省内存、没有深度上限、通常更快；但"把 n 化成 n−1"式的定义要自己翻译成循环，代码可能更长。',
      code: 'int r = 1;\nfor (int i = 2; i <= 6; i++) r = r * i;   // 额外空间 O(1)'
    } },

    { t: 'table',
      head: ['问题特征', '优先选', '原因'],
      rows: [
        ['问题天然是树/自相似的（汉诺塔、全排列、树遍历）', '递归', '代码几乎就是定义，改写迭代反而难写'],
        ['把 n 化成 n−1 / 区间减半、层数不大', '递归', '思路清晰，栈开销可接受'],
        ['深度可能很大（n = 10⁵ 以上）', '迭代', '避免 <code>StackOverflowError</code>'],
        ['单纯求和、计数、扫描数组', '迭代', '递归没有额外好处，还多占栈'],
        ['有大量重复子问题（fib）', '记忆化递归 或 迭代 DP', '把指数压成线性']
      ],
      caption: '判据：问题形状 + 最大深度 + 有没有重复子问题' },

    { t: 'callout', kind: 'warn', title: 'Java 不做尾递归优化', html:
      '有些语言（如 Scheme）会把"尾递归"（递归调用是方法最后一条语句）自动优化成循环，不占额外栈。' +
      '<b>Java 不做这个优化</b>，所以别指望把递归写成尾递归就能省栈——该栈溢出还是栈溢出。' +
      '想在 Java 里省栈，只能手动改写成循环。'
    },

    { t: 'p', html:
      '把递归改写成迭代有两种常见做法：① <b>把递归式展开成循环</b>——阶乘/求和从基线往上滚，斐波那契用两个滚动变量；' +
      '② <b>用显式的栈模拟调用栈</b>——树遍历这类"回程还要用现场"的问题，可以自己维护一个栈，把递归压栈/弹栈写成循环。' +
      '第 ② 种代码更长，但彻底摆脱 JVM 栈限制；考试一般不要求手写，但面试与工程里很常见。'
    },

    { t: 'p', html:
      '<b>设计取舍（二）：可读性、栈深度、重复计算，三笔账一起算。</b>写作业时优先"能看懂、能验证"：' +
      '树形/自相似问题先写递归，再检查深度与重复；生产代码里对深度不放心就改迭代。' +
      '考试答题模板："这个问题适合递归，因为定义自相似（给出递归式）；但递归深度 O(n)、且 fib 有重复子问题，' +
      '所以实际实现用记忆化/迭代更稳。"把两面都说出来，才拿得到满分。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 取舍', html: '能按"问题形状 / 深度 / 重复计算"三条判断用递归还是迭代。' },
      { title: '检查点 · 尾递归', html: '知道 Java 不做尾递归优化，以及为什么不能靠它避免栈溢出。' }
    ] },

    /* ------------------------------------------------------------------ 八、调试实录 */
    { t: 'h', text: '八、调试实录：三个递归常见错误', id: 'ch12-8' },

    { t: 'p', html:
      '递归 bug 的症状很集中：要么 <code>StackOverflowError</code>（基线没到、参数不推进、深度过大），' +
      '要么<b>不报错但结果错</b>（返回值被丢弃、打印顺序搞反、重复计算但答案碰巧对）。' +
      '调试流程固定三步：<b>① 找基线条件是否存在且可达</b>；' +
      '<b>② 看每次递归的参数有没有向基线推进</b>；<b>③ 检查递归调用的返回值有没有被用到</b>。'
    },

    { t: 'steps', items: [
      { title: '先看异常类型', html: '<code>StackOverflowError</code> → 查基线与推进；结果错但不崩 → 查返回值与打印位置。' },
      { title: '手推 3 层就够', html: '把 n=3、n=2、n=1 的实际值写下来，比在脑子里递归 20 层可靠。' },
      { title: '一次只改一处', html: '补基线、改参数、加 return，一次改一个假设再跑，别同时改三处。' }
    ] },

    { t: 'h', lvl: 3, text: '案例 1：忘了写基线条件' },

    { t: 'p', html:
      '需求是"求 1 到 n 的和"。代码写成了 <code>return n + sum(n - 1);</code>，却忘了处理 n = 0 的情况。' +
      '程序会一直调用 <code>sum(-1)</code>、<code>sum(-2)</code>……直到栈空间耗尽。'
    },

    { t: 'code', caption: 'DebugMissingBase.java · 故意栈溢出：没有基线条件', code:
`public class DebugMissingBase {
    static int sum(int n) {
        return n + sum(n - 1);             // BUG：没有基线条件
    }

    public static void main(String[] args) {
        System.out.println(sum(3));
    }
}
` },

    { t: 'p', html:
      '运行后会看到 <code>Exception in thread "main" java.lang.StackOverflowError</code>。' +
      '不要被"溢出"两个字吓到——它其实是最容易修的递归错误：<b>补上基线</b>就行。修复：' +
      '<code>if (n == 0) return 0;</code> 放在方法第一行。定位方法：问自己"这个递归什么时候该停？我写了吗？"' +
      '考试给递归函数挖空，第一件事就是找基线。'
    },

    { t: 'h', lvl: 3, text: '案例 2：递归太深，栈不够用' },

    { t: 'p', html:
      '第二个案例是所有基线、推进都写对了，但 n 太大：<code>sum(100000)</code>。' +
      '每层调用压一个栈帧，10 万层远超 JVM 默认栈容量，照样 <code>StackOverflowError</code>。' +
      '注意这<b>不是代码写错</b>，是递归方案对这个规模不合适。'
    },

    { t: 'code', caption: 'DebugDeep.java · 基线推进都对，但 10 万层递归会压爆栈', code:
`public class DebugDeep {
    static int sum(int n) {
        if (n == 0) return 0;              // 基线、推进都没问题
        return n + sum(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(sum(100000));   // 递归太深 → StackOverflowError
    }
}
` },

    { t: 'p', html:
      '修复不是加基线，而是<b>换实现</b>：改成循环 <code>for (int i = 1; i &lt;= n; i++) total += i;</code>，' +
      '空间 O(1)、跑 10 万也毫无压力。这个案例的教训：递归的"深度上限"是方案本身的成本；' +
      '深度可能很大时，即使逻辑适合递归，也应该改成迭代（或分治把深度压到 log n）。'
    },

    { t: 'h', lvl: 3, text: '案例 3：返回值被丢弃，递归白跑' },

    { t: 'p', html:
      '第三个案例更隐蔽：基线、推进都对，也不栈溢出，结果却永远是 0。原因是递归调用的返回值没有被用上——' +
      '<code>sum(n - 1);</code> 这一行算完就把结果扔了，方法最后 <code>return 0;</code> 直接返回常量。'
    },

    { t: 'code', caption: 'DebugForgotReturn.java · 不报错但结果错：递归的返回值被丢弃', code:
`public class DebugForgotReturn {
    static int sum(int n) {
        if (n == 0) return 0;
        sum(n - 1);                        // BUG：结果被丢弃
        return 0;                          // 永远返回 0
    }

    public static void main(String[] args) {
        System.out.println(sum(5));        // 0，应该是 15
    }
}
` },

    { t: 'p', html:
      '修复：把递归结果接住并累加，<code>return n + sum(n - 1);</code>。这类 bug 的检查方法：' +
      '<b>看递归调用前面有没有 return 或赋值</b>。凡是"递归调用单独成行、前面没有 <code>+</code>/<code>return</code>"，' +
      '都要怀疑结果被丢了。做递归题时养成习惯：先写 <code>return</code>，再填递归调用。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 三类错误', html: '能区分"缺基线 / 深度过大 / 返回值丢弃"三类递归 bug 的症状与修法。' },
      { title: '检查点 · 流程', html: '遇到递归 bug 会先问"基线到了吗、参数推进了吗、返回值用了吗"。' }
    ] },

    /* ------------------------------------------------------------------ 完整案例 A */
    { t: 'h', text: '完整案例 A：递归工具集', id: 'ch12-9' },

    { t: 'p', html:
      '下面这段程序把本章的六类递归放在一个类里：<b>线性递归</b>（阶乘）、<b>记忆化递归</b>（斐波那契）、' +
      '<b>分治递归</b>（数组求和、二分查找、回文）、<b>递推关系</b>（汉诺塔步数）。' +
      '读之前先预测：<code>fib(20)</code> 会不会因为记忆化而变快？<code>hanoiMoves(10)</code> 是多少？'
    },

    { t: 'code', caption: 'RecurTools.java · 85 行完整程序：六种递归写法与边界处理', code:
`public class RecurTools {
    // 1) 线性递归：n! = n * (n-1)!
    static int factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    // 2) 记忆化递归：每个 n 只算一次
    static int[] memo = new int[51];

    static int fib(int n) {
        if (n < 2) return n;
        if (memo[n] != 0) return memo[n];
        memo[n] = fib(n - 1) + fib(n - 2);
        return memo[n];
    }

    // 3) 分治递归：把数组"切成"首元素 + 剩余部分
    static int sum(int[] a, int i) {
        if (i == a.length) return 0;
        return a[i] + sum(a, i + 1);
    }

    // 4) 二分查找的递归版：区间每次减半
    static int search(int[] a, int lo, int hi, int target) {
        if (lo > hi) return -1;
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) return search(a, mid + 1, hi, target);
        return search(a, lo, mid - 1, target);
    }

    // 5) 回文判断：左右各收一格
    static boolean isPalindrome(String s, int lo, int hi) {
        if (lo >= hi) return true;
        if (s.charAt(lo) != s.charAt(hi)) return false;
        return isPalindrome(s, lo + 1, hi - 1);
    }

    // 6) 递推式：M(n) = 2*M(n-1) + 1
    static int hanoiMoves(int n) {
        if (n == 0) return 0;
        return 2 * hanoiMoves(n - 1) + 1;
    }

    public static void main(String[] args) {
        System.out.println("factorial(10) = " + factorial(10));   // 3628800
        System.out.println("fib(20) = " + fib(20));               // 6765
        System.out.println("sum = " + sum(new int[]{1, 2, 3, 4}, 0));   // 10

        int[] a = {1, 3, 5, 7, 9};
        System.out.println("search(7) = " + search(a, 0, a.length - 1, 7));   // 3
        System.out.println("search(4) = " + search(a, 0, a.length - 1, 4));   // -1
        System.out.println("palindrome = " + isPalindrome("racecar", 0, 6));  // true
        System.out.println("hanoiMoves(3) = " + hanoiMoves(3));   // 7
        System.out.println("hanoiMoves(10) = " + hanoiMoves(10)); // 1023
    }
}
` },

    { t: 'table',
      head: ['方法', '递归形状', '时间复杂度', '关键边界'],
      rows: [
        ['<code>factorial</code>', '线性：每层 1 个子问题', 'O(n)', '<code>n &lt;= 1</code> 返回 1'],
        ['<code>fib</code>', '记忆化：只算首个未命中', 'O(n)', '<code>n &lt; 2</code> 返回 n；缓存 0 作哨兵'],
        ['<code>sum</code>', '分治：首元素 + 剩余', 'O(n)', '<code>i == a.length</code> 返回 0'],
        ['<code>search</code>', '分治：区间减半', 'O(log n)', '<code>lo &gt; hi</code> 返回 −1'],
        ['<code>isPalindrome</code>', '双指针向中间收', 'O(n)', '<code>lo &gt;= hi</code> 返回 true'],
        ['<code>hanoiMoves</code>', '递推式 2M(n−1)+1', 'O(n) 次调用，答案 O(2ⁿ)', '<code>n == 0</code> 返回 0']
      ],
      caption: '同一个"递归"外壳，六种不同的缩小方式——写代码前先想清楚"每次问题怎么变小"' },

    { t: 'p', html:
      '这段代码可以当模板用：① 每个方法第一行都是基线，且基线的返回值是最简单情况的正确答案；' +
      '② 递归调用前都有 <code>return</code> 或累加，返回值不会丢；' +
      '③ 参数变化方向一致（<code>n-1</code>/<code>i+1</code>/<code>mid±1</code>），保证收敛。' +
      '特别注意 <code>hanoiMoves</code>：递归调用只有 1 次（<code>2 * M(n-1)</code> 里的递归只算一次），' +
      '所以调用次数是 O(n)，但答案本身按 2ⁿ 增长——<b>别把"调用次数"和"答案大小"搞混</b>。'
    },

    /* ------------------------------------------------------------------ 完整案例 B */
    { t: 'h', text: '完整案例 B：递归实现排序（快排与归并）', id: 'ch12-10' },

    { t: 'p', html:
      '递归最经典的工程应用是"分治排序"。下面同时实现快速排序（原地分区 + 递归）与归并排序（对半切 + 合并），' +
      '并统计比较次数。两者都是 O(n log n)，但快排最坏 O(n²)、递归深度 O(log n)（最坏 O(n)）；' +
      '归并稳定但需要 O(n) 辅助数组。这段代码把第 11 章与本章连起来。'
    },

    { t: 'code', caption: 'RecursiveSort.java · 75 行完整程序：快排 + 归并 + 比较次数', code:
`import java.util.Arrays;

public class RecursiveSort {
    static int quickComparisons = 0;
    static int mergeComparisons = 0;

    // 快排：分区后递归左右两半
    static void quickSort(int[] a, int lo, int hi) {
        if (lo >= hi) return;                  // 0 或 1 个元素：已经有序
        int pivot = a[hi];
        int i = lo;
        for (int j = lo; j < hi; j++) {
            quickComparisons++;
            if (a[j] < pivot) {
                int t = a[i];
                a[i] = a[j];
                a[j] = t;
                i++;
            }
        }
        int t = a[i];
        a[i] = a[hi];
        a[hi] = t;
        quickSort(a, lo, i - 1);               // 递归左半
        quickSort(a, i + 1, hi);               // 递归右半
    }

    // 归并：先递归排两半，再合并
    static void mergeSort(int[] a, int lo, int hi) {
        if (lo >= hi) return;
        int mid = (lo + hi) / 2;
        mergeSort(a, lo, mid);
        mergeSort(a, mid + 1, hi);
        merge(a, lo, mid, hi);
    }

    static void merge(int[] a, int lo, int mid, int hi) {
        int[] aux = new int[hi - lo + 1];
        int i = lo, j = mid + 1, k = 0;
        while (i <= mid && j <= hi) {
            mergeComparisons++;
            if (a[i] <= a[j]) aux[k++] = a[i++];
            else aux[k++] = a[j++];
        }
        while (i <= mid) aux[k++] = a[i++];
        while (j <= hi) aux[k++] = a[j++];
        for (int x = 0; x < aux.length; x++) a[lo + x] = aux[x];
    }

    public static void main(String[] args) {
        int[] x = {5, 2, 9, 1, 6, 3};
        int[] y = Arrays.copyOf(x, x.length);
        quickSort(x, 0, x.length - 1);
        mergeSort(y, 0, y.length - 1);
        System.out.println("quick = " + Arrays.toString(x) + " comparisons = " + quickComparisons);
        System.out.println("merge = " + Arrays.toString(y) + " comparisons = " + mergeComparisons);
    }
}
` },

    { t: 'p', html:
      '三个要点。① <b>递归的"分"与"合"</b>：快排在"分"上做文章（分区），归并在"合"上做文章（合并两个有序数组）；' +
      '② <b>递归深度</b>：快排平均深度 O(log n)、最坏 O(n)（每次都选到最值做基准），归并固定 O(log n)；' +
      '③ <b>设计取舍</b>：快排原地、常数小、实际最快，但不稳定、最坏会退化；归并稳定、最坏也 O(n log n)，' +
      '但要 O(n) 额外空间。选哪个取决于"要不要稳定 / 内存紧不紧 / 数据是否可能已有序"——' +
      '这正是第 11 章"算法与实现"的核心思想：同一个问题可以有多份都正确、但代价不同的实现。'
    },

    /* ------------------------------------------------------------------ 即时练习 */
    { t: 'h', text: '教材对照：§2.3 递归', id: 'ch12-book' },

{ t: 'table',
      head: ['问题', '递推关系', '基线', '规模缩小的方式'],
      rows: [
        ['欧几里得 gcd', 'gcd(p, q) = gcd(q, p % q)', 'q == 0 时返回 p', '余数严格变小'],
        ['汉诺塔移动次数', 'T(n) = 2T(n-1) + 1', 'T(0) = 0', 'n 减 1'],
        ['最长公共子序列', '首字符相同：1 + LCS(去首)；否则取两个子问题的较大者', '任一串为空返回 0', '至少一个串变短']
      ],
      caption: '教材用这三类问题说明：递归代码短，但正确性要靠归纳论证'
    },

{ t: 'code', caption: 'RecursionBook.java —— 教材 §2.3：三个经典递归，一页看完', code:
`public class Q {
    static int gcd(int p, int q) {
        if (q == 0) return p;
        return gcd(q, p % q);
    }
    static int hanoi(int n) {
        if (n == 0) return 0;
        return 2 * hanoi(n - 1) + 1;
    }
    static int lcs(String a, String b) {
        if (a.length() == 0 || b.length() == 0) return 0;
        if (a.charAt(0) == b.charAt(0)) return 1 + lcs(a.substring(1), b.substring(1));
        return Math.max(lcs(a.substring(1), b), lcs(a, b.substring(1)));
    }
    public static void main(String[] args) {
        System.out.println(gcd(48, 18) + " " + hanoi(3) + " " + lcs("AGGTAB", "GXTXAYB"));
    }
}
` },

    { t: 'p', html:
      "教材 §2.3 把递归和<b>数学归纳法</b>绑在一起讲：先证明基线情形成立，再假设小规模成立、推出大规模成立。写递归就是同一个套路——先写基线（什么时候直接返回），再写递推（把问题缩小后交给自己），并保证每次调用都朝基线靠近。<br><br>输出 <code>6 7 4</code>：gcd(48, 18) = 6，3 层汉诺塔要 7 步，AGGTAB 与 GXTXAYB 的最长公共子序列是 GTAB（长度 4）。注意 <code>lcs</code> 没有记忆化，规模一大就会指数爆炸——第 13 章的复杂度分析正好解释它为什么慢。<br><br>教材 §2.3 用「递归图形」收尾：H 树、谢尔宾斯基三角形、布朗桥都是「画一部分 + 递归画更小的部分」。它们的递归深度通常是对数级（每次规模减半），所以不会栈溢出；而线性递归（阶乘、斐波那契的朴素版）深度是 n，n 很大时会 <code>StackOverflowError</code>。判断递归好不好，先看「每次规模缩小多少」。<br><br>教材 §2.3 还讲了「递归 vs 迭代」的换算：任何递归都能改写成迭代 + 显式栈；尾递归（递归调用是最后一步）可以改写成循环，不需要额外栈空间。阶乘和 gcd 都是尾递归，改写成 while 循环很自然；汉诺塔不是尾递归（递归后还要做动作），改写要自己维护栈。教材的原则是：先写清楚递归版本，性能不够再考虑改写。<br><br>教材还提醒：递归的参数设计要保证「规模严格变小」，否则即使有基线也会无限递归。比如二分查找把区间写成 <code>[lo, hi)</code> 时，mid 必须落在区间内且两个子区间都比原区间小；写成闭区间时若更新成 <code>lo = mid</code> 就可能死循环。<br><br>教材还提醒：递归函数的返回值类型要能表达「所有分支」的结果，比如 LCS 返回长度而不是具体子序列，才能让递归组合变得简单。先想清楚「要返回什么」，再写递归。"
    },

    { t: 'callout', kind: 'note', title: '教材 Q&A：为什么靠归纳就能确信递归正确', html:
      "教材的回答是：递归函数在数学上就是一个递推式，归纳法证明了「基线对 + 每步都对」，它就对所有输入都对。反过来，如果递归没有朝基线收敛（比如 <code>f(n)</code> 调 <code>f(n)</code>），归纳的前提就不成立，程序会栈溢出。教材把这类错误叫「缺少递推保证」。<br><br>用一个数组或 Map 缓存已算过的结果，进入函数先查缓存，算完写回。斐波那契从 O(2ⁿ) 降到 O(n)，代价是 O(n) 空间。站内第 12 章的记忆化实验台可以对比两种写法的调用次数。<br><br>① 基线写错（比如写成 <code>n == 1</code> 而不是 <code>n == 0</code>）导致少算一层；② 递归调用后忘了用返回值，或者把「递归结果」和「当前层结果」的合并顺序写反。调试时打印进入/返回两层日志最有效。"
    },

    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch12-q1' },
    { t: 'quiz', qid: 'ch12-q2' },
    { t: 'quiz', qid: 'ch12-q3' },

    /* ------------------------------------------------------------------ 考试映射 */
    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      '<b>Final 的固定考点，四种题型：</b><br>' +
      '① <b>补全递归方法</b>：给阶乘/斐波那契/二分查找/汉诺塔的骨架，挖掉基线条件或递归调用。' +
      '答题前先问两句话："最小的情况是什么？下一步怎么变小？"（本卷 F 卷 Q5 就考递归写方法，Q9 是递归找 bug。）<br>' +
      '② <b>读代码写输出</b>：给一段递归代码问打印顺序。<b>判定方法</b>：看打印语句在递归调用之前（去程）还是之后（回程）；' +
      '若是"前后各打印一次"，就按"去程—回程"两头夹推。F 卷 Q1(3) 就是这种题。<br>' +
      '③ <b>画递归树 / 数调用次数</b>：问 fib(4) 里每个子问题被调用几次，或问"朴素斐波那契为什么是指数级"。' +
      '答案要点：重复子问题 + 调用次数按 ≈1.6ⁿ 增长。<br>' +
      '④ <b>复杂度与优化</b>：问递归版斐波那契的时间/空间复杂度，以及记忆化后为什么变成 O(n)。' +
      '答题模板："朴素版重复计算子问题，T(n)=T(n−1)+T(n−2)+O(1)，指数级；记忆化后每个子问题只算一次，时间 O(n)、空间 O(n)。"<br>' +
      '<b>做递归题的标准动作</b>：在草稿纸画一张 3 层的调用栈/递归树，标出每层的参数与返回值，再推输出——不要在心里跑 20 层。'
    },

    { t: 'keypoint', items: [
      { title: '三要素', html: '基线条件 + 递归步骤 + 每次逼近，缺一就会无限递归或栈溢出。' },
      { title: '调用栈', html: '去程压栈、回程弹栈；打印位置决定输出顺序；递归深度 = 栈的最大高度。' },
      { title: '递归树', html: '每个节点是一次调用；能直观看到子问题数量与重复计算。' },
      { title: '重复子问题', html: '朴素 fib 的调用次数按 ≈1.6ⁿ 增长，因为同一子问题被反复计算。' },
      { title: '记忆化', html: '用数组/表存已算结果，指数级降到线性；注意哨兵值与栈深度。' },
      { title: '经典问题', html: '汉诺塔 2ⁿ−1 步、全排列 n! 种、二分查找 O(log n)——都是"缩小待处理部分"的递归。' },
      { title: '递归 vs 迭代', html: '递归贴近定义但费栈，迭代省内存；Java 不做尾递归优化。' },
      { title: '调试', html: '先查基线是否可达、参数是否推进、返回值是否被用到；深度太大就换迭代。' }
    ] },

    { t: 'checklist', id: 'ch12', items: [
      '我能写出含基线条件、递归步骤、逼近的递归方法，并说明它为什么终止',
      '我能在单步面板里说出当前栈里有几个栈帧、现在是去程还是回程',
      '我能根据打印语句的位置预测递归输出顺序',
      '我能写出阶乘、斐波那契、汉诺塔、递归求和、递归二分、递归回文',
      '我能画出 fib(4) 的递归树并数出重复调用次数',
      '我能解释朴素斐波那契为什么指数爆炸，并写出记忆化版本',
      '我能说出自顶向下记忆化与自底向上迭代的取舍',
      '我知道递归什么时候会 StackOverflowError，以及 Java 不做尾递归优化',
      '我能按"基线—推进—返回值"三步排查递归 bug',
      '我能用递归实现快排/归并，并说出它们的递归深度与复杂度'
    ] },

    /* ------------------------------------------------------------------ 延伸阅读 */
    { t: 'p', html:
      '<b>延伸阅读</b>：教材 Sedgewick 第 2.3 节（Recursion）系统讲了阶乘、斐波那契、汉诺塔、递归绘图与分治，' +
      '并分析了递归的代价；第 4.2 节（Sorting and Searching）里的归并/快排是本章分治套路的直接延伸。' +
      '站内第 05 章「输入输出与绘图」的递归树/科赫雪花、第 11 章「算法：排序与查找」、' +
      '第 13 章「复杂度分析与 Big-O」分别从图形、算法与复杂度三个角度把本章接下去。' +
      '想练手可以到 <a href="#/quiz/ch12">题库 · ch12</a> 按章节筛选，或用首页的随机挑战抽题；' +
      '建议把本章两个完整案例默写一遍，再对照运行结果。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '让 AI 递归地解释递归没有用，看代码也容易"以为懂了"。有效的方法：' +
      '① 让它给一段递归代码，你先在纸上画出调用树/调用栈，再用本站单步面板核对；' +
      '② 问它"把基线条件改掉会发生什么"，然后自己跑一遍，观察 <code>StackOverflowError</code>；' +
      '③ 给它你的 <code>fib</code> 代码，让它指出"哪些子问题被重复计算"，再用计数器验证它说的次数；' +
      '④ 让它写"记忆化"版本，你重点检查哨兵值选得对不对、有没有把 <code>memo</code> 数组开得够大。<br>' +
      '<b>AI 写的递归代码最常见的两个问题</b>：忘了把递归结果 return、递归参数没有推进——检查这两处，比检查逻辑更快。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：递归：三要素、调用栈与去程回程、递归树、斐波那契的指数爆炸与记忆化、汉诺塔/排列/二分递归、递归 vs 迭代。<br>依据：Course Outline v5 的 Recursion（Foundations / Classic Examples / Avoiding Exponential Waste）部分；Sedgewick §2.4。本站为个人整理的学习材料，与课程要求冲突时以老师和课程大纲为准；代码均在真实 JDK 上校验过。' }

  ]
});