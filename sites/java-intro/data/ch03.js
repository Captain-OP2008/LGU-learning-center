/* =====================================================================
 * data/ch03.js · 第 03 章：条件与循环
 * 职责：控制流的两大支柱——分支与重复。覆盖 boolean / 逻辑运算符 /
 *       if-else / while / for / do-while / 嵌套 / break-continue / 标签 /
 *       while(true) / 数位处理 / 边界反例 / 调试实录 / 两个完整案例。
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5；示例输出均用 JDK 25 核对。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch03',
  num: '03',
  title: '条件与循环',
  en: 'Conditionals & Loops',
  goals: [
    '能写出 if / else if / else，并算出到底哪个分支会执行',
    '能解释 && 与 || 的短路求值，说清它为什么既省时间又防 bug',
    '能区分 while / for / do-while 的适用场景，并按三要素写对循环',
    '能数出一个循环执行几次（含区间、步长、逆序与 n-- 边界）',
    '能识别差一错误、死循环、悬空 else 与 break 只跳一层这四类坑'
  ],
  kp: [
    { id: 'ch03-1', title: 'boolean 与关系运算符' },
    { id: 'ch03-2', title: '逻辑运算符与短路求值' },
    { id: 'ch03-3', title: 'if / else if / else 与悬空 else' },
    { id: 'ch03-4', title: 'while / for / do-while 三种循环' },
    { id: 'ch03-5', title: 'for 循环与执行顺序' },
    { id: 'ch03-9', title: '循环次数、区间与步长' },
    { id: 'ch03-6', title: '嵌套、break / continue 与标签' },
    { id: 'ch03-8', title: 'while(true) 与 break 退出' },
    { id: 'ch03-7', title: '数位处理与进制转换' },
    { id: 'ch03-10', title: '边界与常见反例' },
    { id: 'ch03-11', title: '调试循环与分支 bug' },
    { id: 'ch03-13', title: '教材 §1.3：四种循环构造与五个应用' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '先看三行"看起来完全正确、结果却不对"的输出：<code>sum = 45</code>（要求 1 加到 10）、' +
      '<code>D</code>（95 分应该是 A）、<code>i = 0</code>（代码里明明写了 <code>++i</code>）。' +
      '三段都没有语法错误、都能跑完，只是结果不对——这就是控制流 bug 的典型样子：' +
      '坑几乎全在<b>边界</b>上（少算一次、多转一圈、条件写反、else 配错 if）。' +
      '判断与重复也是后面所有算法（排序、查找、递归）的骨架。'
    },

    { t: 'p', lead: true, html:
      '下面这段程序把本章三个高频坑一次演完。先别急着读文字，自己推一遍输出，再点「运行」核对。'
    },

    { t: 'code', caption: 'OpeningBug.java —— 三段都没报错，三段结果都不对', code:
`public class OpeningBug {
    public static void main(String[] args) {
        // 需求：把 1 到 10 加起来
        int sum = 0;
        for (int i = 1; i < 10; i++) {          // 差一：这里少算了一个数
            sum = sum + i;
        }
        System.out.println("sum = " + sum);      // 45，而不是 55

        // 需求：95 分应该是 A
        int score = 95;
        if (score >= 60) {                       // 条件顺序反了
            System.out.println("D");
        } else if (score >= 90) {
            System.out.println("A");
        }

        // 需求：让 i 加 1；但短路让右边根本没执行
        int i = 0;
        boolean ok = false && (++i > 0);
        System.out.println("ok = " + ok + ", i = " + i);   // false, 0
    }
}
` },

    { t: 'p', html:
      '三个输出是 <code>sum = 45</code>、<code>D</code>、<code>ok = false, i = 0</code>。' +
      '第一个错在循环边界：<code>i &lt; 10</code> 让循环停在 9，少加了一个 10——这叫<b>差一错误（off-by-one）</b>，' +
      '是循环题最常见的扣分点。第二个错在<b>条件顺序</b>：<code>95 &gt;= 60</code> 先成立，' +
      '代码打印 D 之后整个 if 链就结束了，永远轮不到 <code>&gt;= 90</code> 那一支。' +
      '第三个错在对<b>短路（short-circuit）</b>的误解：<code>&amp;&amp;</code> 左边是 <code>false</code>，' +
      '右边的 <code>++i</code> 根本不会执行，所以 <code>i</code> 还是 0。'
    },

    { t: 'p', html:
      '三个坑对应三类知识：边界（循环三要素）、顺序（if 链只走第一个成立的分支）、' +
      '短路（逻辑运算符的求值规则）。它们<b>都不会报错</b>，只能靠理解的模型发现。'
    },

    { t: 'h', text: '一、boolean 与关系运算符', id: 'ch03-1' },

    { t: 'p', html:
      '<b>布尔值（boolean）</b>只有 <code>true</code> 和 <code>false</code> 两个值，像开关。' +
      '它是所有判断的原材料：if 的括号里、while 的条件里，最终都必须是一个 boolean。' +
      'Java 比 C 严格——<code>if (1)</code> 直接编译错误，因为 int 不会自动变成 boolean。' +
      '这条规则看着麻烦，其实在保护你：C 里最常见的 bug 就是把 <code>==</code> 写成 <code>=</code>，' +
      '而 Java 里 <code>if (x = 5)</code> 编译不过，等于替你把这类事故挡在门外。'
    },

    { t: 'p', html:
      '产生 boolean 最常用的办法是<b>关系运算符（relational operator）</b>：比较两个值，得到一个 true/false。' +
      '注意 <code>==</code> 是"相等比较"，和单个 <code>=</code>（赋值）完全不同；' +
      '<code>!=</code> 是"不相等"，读作 not equal。'
    },

    { t: 'table',
      head: ['运算符', '含义', '例子', '结果'],
      rows: [
        ['<code>==</code>', '相等', '<code>5 == 5</code>', '<code>true</code>'],
        ['<code>!=</code>', '不等', '<code>5 != 5</code>', '<code>false</code>'],
        ['<code>&gt;</code> / <code>&gt;=</code>', '大于 / 大于等于', '<code>5 &gt; 3</code>', '<code>true</code>'],
        ['<code>&lt;</code> / <code>&lt;=</code>', '小于 / 小于等于', '<code>5 &lt;= 4</code>', '<code>false</code>']
      ],
      caption: '关系运算符的两边可以是数字、字符，也可以是能比较大小的引用（如 String 用 compareTo）' },

    { t: 'p', html:
      '第一个容易翻车的地方是<b>整数除法</b>：<code>1 / 2</code> 两边都是 int，结果先截断成 0，再参与比较，' +
      '所以 <code>1 / 2 == 0</code> 是 <code>true</code>，而不是"0.5 等于 0 所以 false"。' +
      '要得到 0.5，至少一边得是 double。第二个坑是<b>浮点比较</b>：' +
      '<code>0.1 + 0.2 == 0.3</code> 是 <code>false</code>，因为二进制小数存不下精确的 0.1；' +
      '判断两个 double 是否"相等"，要比差值：<code>Math.abs(a - b) &lt; 1e-9</code>。' +
      '第三个坑是字符：<code>\'a\' &lt; \'b\'</code> 比较的是字符编码，不是字典序长度。'
    },

    { t: 'code', caption: 'Logic.java —— 关系运算、整数除法与短路各来一次', code:
`public class Logic {
    public static void main(String[] args) {
        int age = 18;
        System.out.println(age >= 18);              // true
        System.out.println(age == 18);              // true
        System.out.println(5 < age && age < 30);    // true  两个条件都要成立

        // 整数除法：两边都是 int，结果先截断再比较
        System.out.println(1 / 2 == 0);             // true   0.5 被截成 0
        System.out.println(1.0 / 2 == 0.5);         // true

        // 短路：左边已经能定结果，右边根本不会执行
        int i = 0;
        boolean r1 = false && (++i > 0);            // && 左边 false，右边跳过
        boolean r2 = true || (++i > 0);             // || 左边 true，右边跳过
        System.out.println(r1 + " " + r2);          // false true
        System.out.println("i = " + i);             // 0，i 一次都没加过

        // 短路也是防空指针的常用手法
        String s = null;
        System.out.println(s != null && s.length() > 0);   // false，不会抛异常
    }
}
` },

    { t: 'callout', kind: 'warn', title: '三个初学者必踩的坑', html:
      '① <code>=</code> 是赋值、<code>==</code> 是比较。<code>if (x = 5)</code> 在 Java 里直接编译报错，' +
      '看到 <code>if</code> 括号里有单个等号，先当 bug 处理。<br>' +
      '② <code>5 &lt; x &lt; 10</code> 不合法！<code>5 &lt; x</code> 得到 boolean，boolean 不能和数字比大小。' +
      '必须写 <code>x &gt; 5 &amp;&amp; x &lt; 10</code>。<br>' +
      '③ 浮点数不要用 <code>==</code> 比较（第 02 章讲过），判断相等要看差值。' +
      '<b>结论：能产生 true/false 的表达式才有资格进 if 的括号。</b>'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · boolean', html: '能说出为什么 <code>if (1)</code> 编译不过，以及 Java 为什么故意这么设计。' },
      { title: '检查点 · 关系运算', html: '能判断 <code>1 / 2 == 0</code>、<code>0.1 + 0.2 == 0.3</code> 的结果并解释。' }
    ] },

    { t: 'h', text: '二、逻辑运算符与短路求值', id: 'ch03-2' },

    { t: 'p', html:
      '<b>逻辑运算符（logical operator）</b>把多个 boolean 组合成一个：' +
      '<code>&amp;&amp;</code>（与，两个都真才真）、<code>||</code>（或，一个真就真）、' +
      '<code>!</code>（非，取反）。优先级是 <code>!</code> &gt; <code>&amp;&amp;</code> &gt; <code>||</code>，' +
      '所以 <code>a || b &amp;&amp; c</code> 实际是 <code>a || (b &amp;&amp; c)</code>；记不住就加括号。'
    },

    { t: 'svg', maxW: 720, caption: '短路求值：&& 左边为 false 时，右边整段被跳过；|| 左边为 true 时同理。', html:
`<svg viewBox="0 0 720 300" role="img" aria-label="短路求值示意">
  <rect x="12" y="16" width="330" height="268" rx="12" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="30" y="44" font-size="13" font-weight="700" fill="var(--accent)">A &amp;&amp; B</text>
  <rect x="30" y="62" width="120" height="34" rx="6" fill="var(--bg2)" stroke="var(--line2)"/>
  <text x="90" y="84" font-size="12" text-anchor="middle" fill="var(--text)">A = false</text>
  <path d="M158 79 H196" stroke="var(--line2)" stroke-width="1.4" marker-end="url(#arw1)"/>
  <rect x="204" y="62" width="120" height="34" rx="6" fill="var(--bg2)" stroke="var(--line2)" stroke-dasharray="4 3"/>
  <text x="264" y="84" font-size="12" text-anchor="middle" fill="var(--text3)">B 被跳过</text>
  <text x="30" y="128" font-size="12" fill="var(--text2)">结果 false，B 里的 ++i 不会执行</text>
  <rect x="30" y="150" width="120" height="34" rx="6" fill="var(--bg2)" stroke="var(--line2)"/>
  <text x="90" y="172" font-size="12" text-anchor="middle" fill="var(--text)">A = true</text>
  <path d="M158 167 H196" stroke="var(--line2)" stroke-width="1.4"/>
  <rect x="204" y="150" width="120" height="34" rx="6" fill="var(--bg2)" stroke="var(--line2)"/>
  <text x="264" y="172" font-size="12" text-anchor="middle" fill="var(--text)">B 必须求值</text>
  <text x="30" y="216" font-size="12" fill="var(--text2)">结果由 B 决定</text>

  <rect x="378" y="16" width="330" height="268" rx="12" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="396" y="44" font-size="13" font-weight="700" fill="var(--accent2)">A || B</text>
  <rect x="396" y="62" width="120" height="34" rx="6" fill="var(--bg2)" stroke="var(--line2)"/>
  <text x="456" y="84" font-size="12" text-anchor="middle" fill="var(--text)">A = true</text>
  <path d="M524 79 H562" stroke="var(--line2)" stroke-width="1.4"/>
  <rect x="570" y="62" width="120" height="34" rx="6" fill="var(--bg2)" stroke="var(--line2)" stroke-dasharray="4 3"/>
  <text x="630" y="84" font-size="12" text-anchor="middle" fill="var(--text3)">B 被跳过</text>
  <text x="396" y="128" font-size="12" fill="var(--text2)">结果 true，B 不执行</text>
  <rect x="396" y="150" width="120" height="34" rx="6" fill="var(--bg2)" stroke="var(--line2)"/>
  <text x="456" y="172" font-size="12" text-anchor="middle" fill="var(--text)">A = false</text>
  <path d="M524 167 H562" stroke="var(--line2)" stroke-width="1.4"/>
  <rect x="570" y="150" width="120" height="34" rx="6" fill="var(--bg2)" stroke="var(--line2)"/>
  <text x="630" y="172" font-size="12" text-anchor="middle" fill="var(--text)">B 必须求值</text>
  <text x="396" y="216" font-size="12" fill="var(--text2)">结果由 B 决定</text>
</svg>
` },

    { t: 'p', html:
      '<b>短路求值（short-circuit evaluation）</b>的规则只有两句：' +
      '<code>&amp;&amp;</code> 左边是 false，右边<b>不执行</b>；<code>||</code> 左边是 true，右边<b>不执行</b>。' +
      '这里的"不执行"是字面意义——右边不管写着方法调用、自增还是除零，都一次都不跑。' +
      '所以 <code>false &amp;&amp; (10 / 0 &gt; 1)</code> 不抛异常，而 <code>true &amp;&amp; (10 / 0 &gt; 1)</code> ' +
      '会真的执行右边，抛 <code>ArithmeticException</code>。'
    },

    { t: 'table',
      head: ['a', 'b', '<code>a &amp;&amp; b</code>', '<code>a || b</code>', '<code>!a</code>'],
      rows: [
        ['true', 'true', 'true', 'true', 'false'],
        ['true', 'false', 'false', 'true', 'false'],
        ['false', 'true', 'false', 'true', 'true'],
        ['false', 'false', 'false', 'false', 'true']
      ],
      caption: '这张叫真值表（truth table），考试常让你补全一行，或者判断某个组合的结果' },

    { t: 'p', html:
      '为什么要短路？一是<b>安全</b>：<code>if (s != null &amp;&amp; s.length() &gt; 0)</code> 不会抛空指针，' +
      '因为 <code>s</code> 为 null 时左边已 false，右边压根没执行——顺序记牢：<b>先判空，再用</b>。' +
      '二是<b>效率</b>：把最便宜、最容易失败的条件放左边，可以少算很多次。' +
      '比如 <code>if (arr.length == 0 || arr[0] == 0)</code>，空数组时右边不会越界。'
    },

    { t: 'p', html:
      '但短路也是坑：把<b>有副作用的表达式</b>放右边时，要先确认它一定会执行。' +
      '<code>false &amp;&amp; (++i &gt; 0)</code> 里 i 不会变，<code>true || (++i &gt; 0)</code> 也不会变。' +
      '更隐蔽的是优先级：<code>a &amp;&amp; b || c</code> 等价于 <code>(a &amp;&amp; b) || c</code>。' +
      '读代码题的"打印几"，往往就是靠短路和优先级拉开区分度。'
    },

    { t: 'callout', kind: 'warn', title: '短路与"看起来会执行"', html:
      '① 别在有副作用的表达式上依赖短路（<code>++i</code>、<code>i--</code>、方法调用）。' +
      '真需要执行就单独写一行。<br>' +
      '② 条件里有 <code>!</code> 时先翻译成人话：<code>!(a &amp;&amp; b)</code> 是"不是两者都成立"，' +
      '等价于 <code>!a || !b</code>（德摩根律），而不是 <code>!a &amp;&amp; !b</code>。<br>' +
      '③ 优先级记不清就加括号——<b>可读性也是分数</b>，改错题里"逻辑写对但括号不清"照样扣分。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 短路', html: '能对 <code>false &amp;&amp; f()</code> 与 <code>true || f()</code> 判断 <code>f()</code> 是否执行。' },
      { title: '检查点 · 防 NPE', html: '能写出 <code>s != null &amp;&amp; s.length() &gt; 0</code> 并解释为什么安全。' }
    ] },

    { t: 'h', text: '三、if / else if / else 与悬空 else', id: 'ch03-3' },

    { t: 'p', html:
      'if 语句（conditional statement）从上往下检查，<b>第一个成立的</b>分支执行，' +
      '执行完整个 if 结构就结束，后面的分支不再检查。所以<b>分支顺序会改变结果</b>：' +
      '要么按"从严格到宽松"排，要么用互斥区间把条件写全。' +
      '流程图是 score = 85 时：第一个条件不成立，第二个成立，打印 B 后直接结束。'
    },

    { t: 'flow', nodes: [
      { title: 'score >= 90 ?', desc: '第一个条件', kind: 'decide' },
      { title: '打印 A', desc: '成立就结束', kind: 'proc' },
      { title: 'score >= 80 ?', desc: '不成立才继续问', kind: 'decide' },
      { title: '打印 B', kind: 'proc' },
      { title: '否则打印 F', desc: '所有条件都不成立', kind: 'end' }
    ] },

    { t: 'code', caption: 'Grade.java —— 只会在一个分支里打印', code:
`public class Grade {
    public static void main(String[] args) {
        int score = 85;

        if (score >= 90) {
            System.out.println("A");
        } else if (score >= 80) {
            System.out.println("B");     // 只有这里会执行
        } else if (score >= 70) {
            System.out.println("C");
        } else {
            System.out.println("F");
        }
    }
}
` },

    { t: 'p', html:
      '<code>score = 85</code> 时输出 B：第一个条件 85 &gt;= 90 不成立，第二个 85 &gt;= 80 成立，' +
      '打印 B 后整个 if 链结束，第三个条件不再检查。' +
      '现在把顺序改成"<code>if (score &gt;= 60)</code> 在前、<code>else if (score &gt;= 90)</code> 在后"，' +
      '95 分的同学会先命中 <code>&gt;= 60</code>，打印 D 之后就不再检查——' +
      '这正是开篇第一个 bug 的第二个现象。规律：<b>条件要从严格到宽松排</b>，或者用互斥区间。'
    },

    { t: 'h', lvl: 3, text: '悬空 else（dangling else）：缩进会骗人' },

    { t: 'p', html:
      'Java 里 else 总是配<b>最近的、还没配对的 if</b>，和缩进无关——这叫<b>悬空 else（dangling else）</b>。' +
      '下面的缩进让人以为 else 属于外层 <code>if (score &gt;= 60)</code>，但编译器把它配给了内层 ' +
      '<code>if (bonus)</code>，于是 bonus 为 false 时打印 A 而不是 F。' +
      '想表达"外层 else"，唯一可靠的办法是<b>加大括号</b>——这也是老程序员坚持写 <code>{ }</code> 的原因。'
    },

    { t: 'code', caption: 'DanglingElse.java —— 同一段意思，加不加大括号结果不同', code:
`public class DanglingElse {
    public static void main(String[] args) {
        int score = 95;
        boolean bonus = false;

        // 缩进看起来像"bonus 属于外层 if"，但 else 只配最近的未配对 if
        if (score >= 60)
            if (bonus)
                System.out.println("A+");
            else
                System.out.println("A");        // 这个 else 配的是内层 if

        // 想表达"外层 else"，必须加大括号
        if (score >= 60) {
            if (bonus) System.out.println("A+");
        } else {
            System.out.println("F");
        }

        // 大括号还能救一类 bug：条件成立时只想执行一行
        int x = 5;
        if (x > 0)
            System.out.println("positive");
        System.out.println("always runs");
    }
}
` },

    { t: 'callout', kind: 'warn', title: '两条硬规则，能挡掉八成 if 事故', html:
      '① <b>永远写大括号</b>，即使只有一条语句——省下的是两个字符，搭进去的是调试两小时。<br>' +
      '② <b>多分支按"从严格到宽松"排</b>，或让区间互斥（<code>&gt;= 90</code> / <code>&gt;= 80 &amp;&amp; &lt; 90</code>）。<br>' +
      '改错题里常见的"给 95 分判 D"，就是这两条没做到。'
    },

    { t: 'p', html:
      '试试下面这个实验台：拖动分数，看流程图上高亮的是哪条路径；再把条件顺序改一改，' +
      '观察 95 分会不会被"截胡"。亲手改一次，比读十遍规则更记得住。'
    },

    { t: 'lab', id: 'conditionals' },

    { t: 'keypoint', items: [
      { title: '检查点 · if 链', html: '能说出"if 链只执行第一个成立的分支"，并解释条件顺序为什么重要。' },
      { title: '检查点 · 悬空 else', html: '能判断 <code>if (a) if (b) x(); else y();</code> 里的 else 配的是哪个 if。' }
    ] },

    { t: 'h', text: '四、三种循环：while / for / do-while', id: 'ch03-4' },

    { t: 'p', html:
      '循环（loop）就是重复执行一段代码。写循环永远要凑齐三样：<b>初值</b>、<b>条件</b>、<b>更新</b>。' +
      '检查一个循环最快的方法：问自己<b>哪一步让条件最终变成 false？</b>答不上来就是死循环。<br>' +
      '三种写法只是把三要素放在不同位置：while 把条件放括号；for 把三要素全塞进括号；do-while 先执行一次再判断。'
    },

    { t: 'h', lvl: 3, text: 'while：条件为真就一直做' },

    { t: 'p', html:
      'while 最像自然语言：<b>只要条件成立，就再来一遍</b>。适合"次数不确定"的场景——' +
      '不知道要转几圈，只知道什么时候该停。下面的例子数一个整数有几位：' +
      '每轮 <code>n = n / 10</code> 去掉最后一位，<code>count++</code> 记一笔，直到 n 变成 0；9875 走四轮。'
    },

    { t: 'code', caption: 'CountDigits.java —— 数一个整数有几位', code:
`public class CountDigits {
    public static void main(String[] args) {
        int n = 9875;
        int count = 0;              // 计数器（counter）

        while (n > 0) {             // 条件
            n = n / 10;             // 更新：每次去掉最后一位
            count++;                // 计数
        }

        System.out.println("digits = " + count);   // 4
    }
}
` },

    { t: 'h', lvl: 3, text: 'for：把三要素写在一行', id: 'ch03-5' },

    { t: 'p', html:
      '<code>for (初始化; 条件; 更新)</code> 把三要素压缩到括号里，最适合"<b>次数已知</b>"的场景。' +
      '执行顺序是固定考点：初始化只执行一次，然后反复"判断条件 → 执行循环体 → 执行更新"。' +
      '注意更新之后回到<b>条件判断</b>而不是初始化——这决定了循环体可能一次都不执行。'
    },

    { t: 'steps', items: [
      { title: '初始化', html: '只执行一次。<code>int i = 1</code>' },
      { title: '判断条件', html: '为 true 才进循环体，为 false 就结束。<code>i &lt;= 5</code>' },
      { title: '执行循环体', html: '花括号里的代码' },
      { title: '执行更新', html: '然后<b>回到 ②</b>，不是跳回 ①。<code>i++</code>' }
    ] },

    { t: 'code', caption: 'ForSum.java —— 点「单步」，看 i 和 sum 每一轮怎么变', trace: true, code:
`public class ForSum {
    public static void main(String[] args) {
        int sum = 0;                         // 累加器（accumulator）

        for (int i = 1; i <= 5; i++) {
            sum = sum + i;
            System.out.println("i = " + i + ", sum = " + sum);
        }

        System.out.println("total = " + sum);   // 15
    }
}
` },

    { t: 'h', lvl: 3, text: 'do-while：至少执行一次' },

    { t: 'p', html:
      '<code>do { ... } while (条件);</code> 先执行再判断，所以<b>循环体至少跑一次</b>。' +
      '适合"先做一次，再决定要不要继续"的场景，比如菜单。注意结尾的<b>分号</b>不能丢。' +
      '判断一段代码会不会执行：while 条件为 false 时一次都不跑，do-while 至少跑一次。'
    },

    { t: 'code', caption: 'DoWhile.java —— 条件一开始就是 false', code:
`public class DoWhile {
    public static void main(String[] args) {
        int n = 5;

        do {
            System.out.println("execute " + n);
            n++;
        } while (n < 3);            // 一开始就 false，但循环体已执行过一次

        System.out.println("n = " + n);   // 6
    }
}
` },

    { t: 'table',
      head: ['', '<code>while</code>', '<code>do-while</code>'],
      rows: [
        ['先判断还是先执行', '先判断', '先执行'],
        ['最少执行次数', '<b>0</b> 次', '<b>1</b> 次'],
        ['典型场景', '可能一次都不做', '必须先做一次（菜单、读输入）'],
        ['注意', '别忘更新', '结尾分号 <code>;</code> 不能丢']
      ] },

    { t: 'compare', left: {
      title: 'while：次数不确定',
      html: '不知道要转几圈，只知道"什么时候该停"。典型：读输入直到用户输入 0、拆数字直到 n 变 0。',
      code: 'int n = 9875;\nwhile (n > 0) {\n    n = n / 10;\n    count++;\n}'
    }, right: {
      title: 'for：次数确定',
      html: '知道要转多少圈，或者要遍历一段区间。典型：求和 1..n、遍历数组下标。',
      code: 'int sum = 0;\nfor (int i = 1; i <= n; i++) {\n    sum += i;\n}'
    } },

    { t: 'callout', kind: 'warn', title: '死循环长什么样', html:
      '<b>死循环（infinite loop）</b>三种典型写法：' +
      '① 忘了更新（<code>while (i &lt; 10)</code> 里从不改 i）；' +
      '② 更新方向错了（条件要 i 变大，你却在 <code>i--</code>）；' +
      '③ 用浮点数做相等判断（<code>while (x != 1.0)</code>，x 可能永远差一点点）。' +
      '还有一种隐蔽的：<b>整数溢出</b>——<code>for (int i = 0; i &lt;= Integer.MAX_VALUE; i++)</code> ' +
      '在 i 达到上限后加 1 变成负数，条件又成立，于是永远停不下来。' +
      '本站引擎有步数与时间上限，真实程序会直接卡死，所以写完循环先问"哪一步让它停"。'
    },

    { t: 'p', html:
      '下面这个实验台可以拖动 n、切换 for / while，逐轮看 i、条件、累加器各自的值——' +
      '循环题做不出来时，先在脑子里跑一遍这个表。'
    },

    { t: 'lab', id: 'loops' },

    { t: 'keypoint', items: [
      { title: '检查点 · 三要素', html: '任意给一个循环，能指出它的初值、条件、更新分别在哪一行。' },
      { title: '检查点 · 三种写法', html: '次数未知用 while，次数已知用 for，至少一次用 do-while。' }
    ] },

    { t: 'h', text: '五、数循环次数：区间、步长与边界', id: 'ch03-9' },

    { t: 'p', html:
      '考试里最常见的循环题不是写代码，而是回答"这段循环执行几次""总共打印什么"。' +
      '手算错的原因无非三个：<b>区间端点</b>（&lt; 还是 &lt;=）、<b>步长</b>（i++ 还是 i += 2）、' +
      '<b>更新位置</b>（写在 for 里还是循环体里）。四步法照着走：' +
      '① 找初值；② 按步长列前三个值和最后一个值；③ 确认条件在哪一步变 false；' +
      '④ 用最后一轮的值反算次数，别凭感觉。'
    },

    { t: 'table',
      head: ['写法', '从哪到哪', '执行几次', '易错点'],
      rows: [
        ['<code>for (i = 0; i &lt; n; i++)</code>', '0 到 n-1', '<code>n</code> 次', '不含 n，容易误写成 n+1'],
        ['<code>for (i = 1; i &lt;= n; i++)</code>', '1 到 n', '<code>n</code> 次', '含 n，与上面等价但写法不同'],
        ['<code>for (i = 0; i &lt; n; i += 2)</code>', '0, 2, 4 …', '<code>ceil(n / 2)</code> 次', '步长不是 1 时次数减半'],
        ['<code>for (i = n - 1; i &gt;= 0; i--)</code>', 'n-1 到 0', '<code>n</code> 次', '写成 i &gt; 0 会漏掉下标 0'],
        ['<code>while (n-- &gt; 0)</code>', '先比较后自减', '<code>n₀</code> 次', '结束时 n 变成 -1，不是 0'],
        ['<code>for (i = 0; i &lt; 10; c++) k += 3;</code>', 'k: 0, 3, 6, 9', '<code>4</code> 次', '更新变量和判断变量不是同一个']
      ],
      caption: '前四种是考试主流；后两种是"读代码写输出"的区分题，看清谁在变、变几次' },

    { t: 'code', caption: 'LoopCount.java —— 六种写法各跑几次，一次看清', code:
`public class LoopCount {
    public static void main(String[] args) {
        int n = 5, c = 0;
        for (int i = 0; i < n; i++) c++;
        System.out.println("i <  n     -> " + c);      // 5

        c = 0;
        for (int i = 0; i <= n; i++) c++;
        System.out.println("i <= n     -> " + c);      // 6

        c = 0;
        for (int i = 1; i < n; i += 2) c++;
        System.out.println("i += 2     -> " + c);      // 2

        c = 0;
        for (int i = n; i > 0; i--) c++;
        System.out.println("i--        -> " + c);      // 5

        // 更新写在条件里：先比较、后自减，最后一轮 n 变成 -1
        int m = 3, rounds = 0;
        while (m-- > 0) rounds++;
        System.out.println("rounds=" + rounds + " m=" + m);   // rounds=3 m=-1

        // 更新表达式也可以放在 for 的第三格
        c = 0;
        for (int k = 0; k < 10; c++) {
            k += 3;
        }
        System.out.println("k += 3     -> " + c);      // 4
    }
}
` },

    { t: 'p', html:
      '重点看后两行。<code>while (m-- &gt; 0)</code> 是"先拿 m 和 0 比，再让 m 减 1"：' +
      'm = 3 → 比 3 &gt; 0 成立、m 变 2；→ 比 2 &gt; 0、m 变 1；→ 比 1 &gt; 0、m 变 0；→ 比 0 &gt; 0 不成立，' +
      '循环结束但 m 已变成 -1。所以执行 3 次、结束后 <code>m = -1</code>——数"结束后变量的值"一定要算上这"多减的一次"。<br>' +
      '最后一段更阴险：<code>for (int k = 0; k &lt; 10; c++)</code> 的更新格是 <code>c++</code>，' +
      '真正的推进在体里 <code>k += 3</code>，k 取 0/3/6/9 共 4 轮，所以 c = 4。' +
      '<b>看 for 先确认"谁负责推进、谁负责计数"</b>。'
    },

    { t: 'p', html:
      '再补一个高频疑问：<code>for (int i = 0; i &lt; n; i += 2)</code> 到底几次？' +
      '把 n 代入具体值最快：n = 5 时 i 取 0, 2, 4 共 3 次（<code>ceil(5/2) = 3</code>）；' +
      'n = 6 时 i 取 0, 2, 4 还是 3 次。所以公式是<br>' +
      '<code>次数 = ceil((n - 0) / 2) = (n + 1) / 2</code>（整数除法）。' +
      '考试不会让你背公式，但会让你算具体的 n——<b>把前三个值写下来，比套公式可靠</b>。' +
      '如果是倒序 <code>for (i = n - 1; i &gt;= 0; i--)</code>，i 取 n-1, n-2, …, 0，正好 n 次。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 数次数', html: '能不运行代码，算出 <code>for (i = 0; i &lt; n; i += 3)</code> 的迭代次数并说明理由。' },
      { title: '检查点 · 边界值', html: '能说出 <code>while (n-- &gt; 0)</code> 结束后 n 的值，以及为什么不是 0。' }
    ] },

    { t: 'h', text: '六、嵌套循环、break / continue 与标签', id: 'ch03-6' },

    { t: 'p', html:
      '<b>嵌套循环（nested loop）</b>像钟表：时针走一格，分针要转一整圈才跟一步。' +
      '外层循环每执行一次，内层循环都会<b>完整地跑完</b>。总执行次数是两层次数的<b>乘积</b>——' +
      '外层 3 次、内层 3 次，循环体就执行 9 次。这个"乘积"是第 13 章讲 O(n²) 的起点，' +
      '也是为什么"两层循环找重复元素"在数据量大时会突然变慢。'
    },

    { t: 'code', caption: 'NineNine.java —— 嵌套循环打印乘法表', code:
`public class NineNine {
    public static void main(String[] args) {
        for (int i = 1; i <= 3; i++) {        // 外层：每一行
            for (int j = 1; j <= 3; j++) {    // 内层：每行里的每一列
                System.out.print(i + "x" + j + "=" + (i * j) + "  ");
            }
            System.out.println();            // 一整行结束后换行
        }
    }
}
` },

    { t: 'callout', kind: 'tip', title: '嵌套是性能问题的源头', html:
      '两层循环各跑 1000 次，循环体就执行 100 万次；三层就是 10 亿次。' +
      '同样是"在 100 万条数据里找东西"，用两层循环（暴力）和用一次遍历（哈希）差了几个数量级。' +
      '第 11、13 章会反复回到这一点：<b>看到嵌套循环，先问能不能降一层</b>。'
    },

    { t: 'p', html:
      '<code>break</code> 是"不干了"，直接跳出<b>当前这一层</b>循环；<code>continue</code> 是"这轮跳过"，' +
      '立刻进入下一次判断（for 会先执行更新）。两者都只能用在循环里，默认<b>只影响最内层</b>。' +
      '要一次跳出多层，给循环<b>贴标签（label）</b>：<code>outer:</code> 写在 for 前面，然后 <code>break outer;</code>；' +
      '标签也能配 continue，表示"跳过内层剩下的，直接进入外层下一轮"。'
    },

    { t: 'code', caption: 'BreakJump.java —— break / continue / 带标签的跳转', code:
`public class BreakJump {
    public static void main(String[] args) {
        // continue：跳过奇数，只打印偶数
        for (int i = 1; i <= 8; i++) {
            if (i % 2 != 0) continue;
            System.out.print(i + " ");
        }
        System.out.println();

        // break：找到第一个能被 7 整除的数就收工
        for (int n = 10; n < 100; n++) {
            if (n % 7 == 0) {
                System.out.println("first = " + n);
                break;
            }
        }

        // 不带标签的 break 只跳出内层
        for (int i = 1; i <= 2; i++) {
            for (int j = 1; j <= 3; j++) {
                if (j == 2) break;
                System.out.println("inner " + i + "," + j);
            }
        }

        // 带标签的 break：一次跳出两层
        outer:
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) {
                if (i * j == 6) {
                    System.out.println("break outer at " + i + "," + j);
                    break outer;
                }
            }
        }

        // 带标签的 continue：直接进入外层下一轮
        outer2:
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) {
                if (j == 2) continue outer2;
                System.out.println("pair " + i + "," + j);
            }
        }
    }
}
` },

    { t: 'callout', kind: 'warn', title: 'break 只跳一层，标签语法别写错', html:
      '两层循环里写 break，只结束<b>内层</b>，外层继续下一轮——上面输出里 <code>inner 1,1</code> 与 ' +
      '<code>inner 2,1</code> 各打印一次就是证据（j = 2 时 break，外层 i 继续）。<br>' +
      '标签写法：<code>outer:</code> 加冒号、贴在 for 前面，<code>break outer;</code> 时不要加冒号。' +
      '标签名可以是任意合法标识符，但不要用关键字。<br>' +
      '工程上更推荐"用一个 boolean 标志位"而不是标签，可读性更好；考试则要会读标签代码。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 嵌套', html: '能算出两层循环的总执行次数，并说明内层为什么"完整跑完"。' },
      { title: '检查点 · 跳转', html: '能区分 break 与 continue，并写出带标签跳出两层的代码。' }
    ] },

    { t: 'h', text: '七、while (true)：故意写的死循环，用 break 退出', id: 'ch03-8' },

    { t: 'p', html:
      '有一类循环<b>天生不知道要转几次</b>：读输入直到输入 0、猜数字直到猜中、找第一个满足条件的数。' +
      '这时可以先写 <code>while (true)</code>——条件恒真，靠循环体里的 <code>break</code> 退出。' +
      '它不是 bug 而是可控的<b>惯用法（idiom）</b>；但必须保证"一定有一条路径会 break"。' +
      '读程序题里很常见，别一看到 <code>true</code> 就以为会卡死——<b>先找 break，再看 break 前的条件会不会成立</b>。'
    },

    { t: 'code', caption: 'FirstSquare.java —— while (true) + break', code:
`public class FirstSquare {
    public static void main(String[] args) {
        int n = 1;
        while (true) {                     // 条件恒真，只能靠 break 退出
            int square = n * n;
            if (square > 50) {
                System.out.println("first square > 50 is " + square);   // 64
                break;                     // 找到就退出，否则会一直转
            }
            n++;                           // 更新在循环体里，别忘了
        }
        System.out.println("n = " + n);    // 8
    }
}
` },

    { t: 'callout', kind: 'warn', title: '别把 while (true) 和死循环搞混', html:
      '<code>while (true)</code> 本身没有问题，问题是<b>有没有 break 出口</b>。' +
      '判断方法：在循环体里找 break，并问"它前面那个条件真的会成立吗"。' +
      '如果 break 被包在另一个永不进入的 if 里、或者条件写反了，才是真死循环。<br>' +
      '读程序题的另一半考点是<b>数循环次数</b>：先看 n 的初值，再手算两轮，' +
      '别把它当成"无限循环"直接跳过。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · while(true)', html: '能判断一个 <code>while (true)</code> 有没有可靠出口，并算出它执行几轮。' }
    ] },

    { t: 'h', text: '八、数位处理三件套：拆位、数位和、进制转换', id: 'ch03-7' },

    { t: 'p', html:
      '期中卷有一类题反复出现：<b>把一个整数的每一位拆出来</b>（数位和、最大位、各位立方和），' +
      '或反过来<b>把十进制转成二进制</b>。它们共享同一骨架：<code>n % 10</code> 取最后一位，' +
      '<code>n / 10</code> 去掉最后一位；每圈少一位，<code>n</code> 变成 0 时结束。' +
      '这个"循环 + 整除取余"就是<b>数位处理（digit processing）</b>，反转整数、判断回文、进制转换都是它。'
    },

    { t: 'table',
      head: ['任务', '取什么', '怎么让 n 变小', '典型题目'],
      rows: [
        ['拆出每一位', '<code>n % 10</code>', '<code>n = n / 10</code>', '数位和、各位立方和'],
        ['数位数', '不必取', '<code>n = n / 10</code>', '判断一个数有几位'],
        ['十进制 → 二进制', '<code>n % 2</code>', '<code>n = n / 2</code>', '进制转换、逆序输出'],
        ['反转整数', '<code>n % 10</code>', '<code>n = n / 10</code>', '<code>rev = rev * 10 + digit</code>']
      ],
      caption: '进制转换只是把除数 10 换成 2——骨架一模一样，换的只是"几进制就取余几"' },

    { t: 'code', caption: 'Digits.java —— 数位和 / Armstrong 数 / 十进制转二进制', code:
`public class Digits {
    public static void main(String[] args) {
        int n = 407;

        // 1) 数位和 + 最大的一位
        int sum = 0, max = 0;
        int t = n;                     // 用副本，原数后面还要用
        while (t > 0) {
            int digit = t % 10;        // 取出最后一位
            sum = sum + digit;
            if (digit > max) max = digit;
            t = t / 10;                // 去掉最后一位
        }
        System.out.println("sum = " + sum + ", max = " + max);   // 11, 7

        // 2) 判断 Armstrong 数：三位数各位立方和等于自身
        t = n;
        int cubeSum = 0;
        while (t > 0) {
            int d = t % 10;
            cubeSum = cubeSum + d * d * d;
            t = t / 10;
        }
        System.out.println(n + " is Armstrong? " + (cubeSum == n));   // true

        // 3) 十进制转二进制：除 2 取余，余数从低位开始，最后要倒序输出
        int num = 19;
        int[] bits = new int[32];
        int id = 0;
        while (num > 0) {
            bits[id] = num % 2;
            id++;
            num = num / 2;
        }
        System.out.print("binary = ");
        for (int i = id - 1; i >= 0; i--) {    // 倒序打印才是正确顺序
            System.out.print(bits[i]);
        }
        System.out.println();                  // 10011
    }
}
` },

    { t: 'callout', kind: 'note', title: '数位题在考试里怎么考', html:
      '① <b>给程序问输出</b>：数位和、Armstrong 数、十进制转二进制；<br>' +
      '② <b>找 bug</b>：最常见的两处错误——忘了写 <code>n = n / 10</code>（死循环）、' +
      '转二进制时忘记倒序打印（结果反了）；<br>' +
      '③ <b>补全代码</b>：把 <code>% 10</code> 或 <code>/ 10</code> 挖空让你填。<br>' +
      '手算时取 n = 153、19 这类小数字走两轮，就能确认整除取余的方向对不对。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 数位骨架', html: '能不查资料写出"取最后一位 + 去掉最后一位"的两行代码，并说明循环为什么在 n = 0 时停。' },
      { title: '检查点 · 倒序', html: '能解释十进制转二进制为什么要倒序输出，正序会发生什么。' }
    ] },

    { t: 'h', text: '九、边界与反例：六条易错规律', id: 'ch03-10' },

    { t: 'p', html:
      '控制流的 bug 几乎都发生在"边界"上。下面这张表把六条最容易踩的规律集中列出，' +
      '每条都对应一个具体的反例；它们不是"偏门知识"，而是期中改错题和读程序题的常客。' +
      '读表时别只记结论，想一遍"为什么"——为什么在循环体里改 i 会跳过一个值、' +
      '为什么浮点循环会多跑一轮、为什么 int 到上限再加会变负数。'
    },

    { t: 'table',
      head: ['规律', '反例', '为什么错 / 怎么改'],
      rows: [
        ['在循环体里改循环变量会跳值', '<code>for (i = 0; i &lt; 5; i++) { if (i == 2) i++; }</code>', 'i 被手动加到 3，for 的 i++ 又加一次，3 被跳过；改：不要在体里动 i'],
        ['do-while 至少执行一次', '<code>do { ... } while (false);</code>', '循环体仍执行一次；改：要"可能不执行"就用 while'],
        ['break 只跳一层', '两层循环里的 break', '外层继续；改：标签 <code>break outer;</code> 或标志位'],
        ['<code>while (n-- &gt; 0)</code> 终点是 -1', '<code>int n = 3; while (n-- &gt; 0) {}</code>', '先比较后自减，结束后 n = -1；改：要 n 归零用 <code>while (n &gt; 0) { n--; }</code>'],
        ['浮点做循环条件会多跑或少跑', '<code>for (double x = 0; x &lt; 1.0; x += 0.1)</code>', '0.1 无法精确表示，x 累加到 0.999… 仍 &lt; 1，共 11 轮；改：用整数计数器'],
        ['int 溢出导致死循环', '<code>for (int i = 0; i &lt;= Integer.MAX_VALUE; i++)</code>', 'i 到上限后加 1 变负数，条件又成立；改：用 long 或改边界']
      ],
      caption: '六条里有四条会直接导致"程序不错误但结果不对"或"卡死"，属于必须条件反射识别的内容' },

    { t: 'code', caption: 'EdgeCases.java —— 前四条反例的实际运行结果', code:
`public class EdgeCases {
    public static void main(String[] args) {
        // 1) 在循环体里改循环变量：i 被手动 +1，会跳过一个值
        for (int i = 0; i < 5; i++) {
            if (i == 2) i++;
            System.out.print(i + " ");
        }
        System.out.println();                 // 0 1 3 4（3 之后直接到 4）

        // 2) 浮点做循环条件：0.1 累加 10 次也不正好等于 1.0
        int count = 0;
        for (double x = 0.0; x < 1.0; x += 0.1) count++;
        System.out.println("count = " + count);   // 11

        // 3) int 到上限再加 1：回绕成负数
        int big = Integer.MAX_VALUE;
        System.out.println("big + 1 = " + (big + 1));   // -2147483648

        // 4) 空循环体：分号把循环体变成了空语句
        int k = 0;
        for (int i = 0; i < 3; i++);
        k++;
        System.out.println("k = " + k);           // 1
    }
}
` },

    { t: 'p', html:
      '逐行看结果。第一段输出 <code>0 1 3 4</code>：i = 2 时体里把 i 改成 3，for 的更新又加 1 变成 4，' +
      '所以 3 与 4 各打印一次、循环提前结束——<b>循环变量最好只由 for 的第三格修改</b>。<br>' +
      '第二段 <code>count = 11</code>：0.1 在二进制里是无限循环小数，累加到 0.9999… 仍小于 1，于是多跑一轮。<br>' +
      '第三段 <code>-2147483648</code>：int 是 32 位补码，最大值加 1 回绕成最小值。<br>' +
      '第四段 <code>for (...);</code> 的分号让循环体变成空语句，循环空转三次，k 只加一次——<b>分号是隐形 bug</b>。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 边界', html: '能说出至少三条会让循环"结果对不上预期"的边界情况，并给出修法。' },
      { title: '检查点 · 分号', html: '能看出 <code>for (int i = 0; i &lt; 3; i++);</code> 后面那条语句不属于循环体。' }
    ] },

    { t: 'h', text: '十、调试实录：三个真实 bug', id: 'ch03-11' },

    { t: 'p', html:
      '控制流 bug 的共同点是"程序不报错，结果就是不对"。调试流程：① <b>先确认预期</b>（把应该输出什么写在纸上）；' +
      '② <b>缩小范围</b>（砍到最小复现）；③ <b>逐轮列表</b>（列出每轮的 i、sum、count）；' +
      '④ <b>一次只改一处</b>。下面三个案例覆盖差一错误、死循环、悬空 else 三类最高频的坑。'
    },

    { t: 'steps', items: [
      { title: '先定位症状', html: '是编译错误、运行时异常，还是"能跑但结果不对"？控制流 bug 绝大多数属于第三种。' },
      { title: '写预期再对照', html: '把输入和期望输出写出来，逐轮列表（i、条件、累加器），找出第一次对不上的那一轮。' },
      { title: '只改一处再验证', html: '一次只改一个假设（边界 &lt; → &lt;=、加更新、加大括号），跑一遍确认。' }
    ] },

    { t: 'h', lvl: 3, text: '案例 1：差一错误——1 加到 10 得到 45' },

    { t: 'p', html:
      '需求是"求 1 到 10 的和"。实现用 <code>for (int i = 1; i &lt; n; i++)</code>，传 n = 10，结果 45，少了 10。' +
      '定位过程：① 手算小规模——n = 3 时代码算 1 + 2 = 3，正确应是 6，说明漏了最后一项；' +
      '② 打印最后一轮的 i，发现停在 9；③ 结论是条件写成了 &lt; 而应该是 &lt;=。' +
      '修法有两条：改条件，或统一用"左闭右开"的写法 <code>for (i = 1; i &lt;= n; i++)</code>。' +
      '验证时别忘了边界：n = 0 应该返回 0，n = 1 应该返回 1。'
    },

    { t: 'code', caption: 'DebugOffByOne.java —— 对照 bug 版与修复版，并检查 n = 0 / 1 边界', code:
`public class DebugOffByOne {
    // bug 版：< n 少算最后一个数
    static int sumTo(int n) {
        int sum = 0;
        for (int i = 1; i < n; i++) {
            sum += i;
        }
        return sum;
    }

    // 修复版：<= n
    static int sumToFixed(int n) {
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += i;
        }
        return sum;
    }

    public static void main(String[] args) {
        System.out.println("sumTo(10)      = " + sumTo(10));       // 45
        System.out.println("sumToFixed(10) = " + sumToFixed(10));  // 55
        System.out.println("expected       = " + (10 * 11 / 2));   // 55
        System.out.println("sumTo(0)       = " + sumTo(0));        // 0
        System.out.println("sumTo(1)       = " + sumTo(1) + ", fixed = " + sumToFixed(1));
    }
}
` },

    { t: 'h', lvl: 3, text: '案例 2：忘记更新——while 卡死' },

    { t: 'p', html:
      '第二个 bug 会让程序立刻卡住：<code>while (i &lt; 5)</code> 里打印 i 却忘了 <code>i++</code>，' +
      'i 永远是 0。定位：① 程序不结束、控制台刷同一行；② 在循环体里问"哪一步让 i 变化"，发现没有；' +
      '③ 补上 <code>i++</code>。下面的代码故意保留 bug 并关掉了运行按钮——本机跑它会一直刷屏，只能读代码找问题。'
    },

    { t: 'code', caption: 'DebugInfinite.java —— 故意死循环（不提供运行按钮，请阅读找 bug）', run: false, code:
`public class DebugInfinite {
    public static void main(String[] args) {
        int i = 0;
        while (i < 5) {
            System.out.println("i = " + i);
            // 忘了更新：i 永远是 0，条件永远成立 → 死循环
        }
        // 修复：在循环体里加 i++;（或把条件改成 while (i++ < 5)）
    }
}
` },

    { t: 'h', lvl: 3, text: '案例 3：悬空 else 与 == 写成 = 的变体' },

    { t: 'p', html:
      '第三个 bug 不卡死也不报错，只是分支走错：需求是"60 分及以上且有加分才 A+，否则 A；60 以下 F"，' +
      '结果 59 分没加分也走进了 A。定位：① 用 59 分做最小复现；② 发现 else 配到了内层 if——' +
      '外层 59 &gt;= 60 为 false 时根本没分支执行，所以"打印 A"其实是别的输入造成的错觉。' +
      '同类的还有"用 <code>==</code> 比较字符串"：比的是地址，应该用 <code>input.equals("YES")</code>。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 三类 bug', html: '能说出每个 bug 属于"边界错 / 忘了更新 / 配对错"中的哪一类，并给出修法。' },
      { title: '检查点 · 流程', html: '遇到"能跑但不对"的循环题，会先写预期、缩小到最小复现，再逐轮列表。' }
    ] },

    { t: 'h', text: '完整案例 A：猜数字游戏（循环 + 分支 + 计数）' },

    { t: 'p', html:
      '下面这段程序把本章概念用在一处：<code>while</code> 控制轮次、<code>if / else if</code> 判断大小、' +
      '<b>计数器</b>统计次数、<b>状态变量</b>（<code>won</code>）记录是否猜中。' +
      '为了能直接运行，猜测序列用固定数组模拟"用户每次输入的数"；真实版本换成 <code>Scanner</code> 即可，' +
      '逻辑一行都不用改。读之前先预测：第几次能猜中？范围会怎么收缩？' +
      '（答案：50 太小 → 75 太大 → 62 太小 → 68 太大 → 66 猜中，共 5 次。）'
    },

    { t: 'code', caption: 'GuessGame.java —— 近 60 行：循环 + 分支 + 计数 + 边界保护', code:
`public class GuessGame {
    // 用固定序列模拟"用户每次猜的数"，这样程序能直接跑
    static final int[] GUESSES = {50, 75, 62, 68, 66};

    // 比较结果：-1 太小，1 太大，0 猜中
    static int compare(int guess, int target) {
        if (guess < target) return -1;
        if (guess > target) return 1;
        return 0;
    }

    public static void main(String[] args) {
        int target = 66;
        int low = 1;
        int high = 100;
        int tries = 0;
        int tooSmall = 0;
        int tooLarge = 0;
        boolean won = false;

        System.out.println("目标在 " + low + ".." + high + " 之间");

        for (int k = 0; k < GUESSES.length; k++) {
            int guess = GUESSES[k];
            tries++;
            int cmp = compare(guess, target);

            if (cmp == 0) {
                won = true;
                System.out.println("第 " + tries + " 次猜 " + guess + " → 猜中！");
                break;
            } else if (cmp < 0) {
                tooSmall++;
                low = guess + 1;
                System.out.println("第 " + tries + " 次猜 " + guess + " → 太小，范围缩到 " + low + ".." + high);
            } else {
                tooLarge++;
                high = guess - 1;
                System.out.println("第 " + tries + " 次猜 " + guess + " → 太大，范围缩到 " + low + ".." + high);
            }

            // 边界保护：范围空了说明序列本身有问题
            if (low > high) {
                System.out.println("范围已空，提前结束");
                break;
            }
        }

        if (!won) {
            System.out.println("没猜中，答案是 " + target);
        }
        System.out.println("共猜 " + tries + " 次｜太小 " + tooSmall + " 次｜太大 " + tooLarge + " 次");
        System.out.println("最终范围 " + low + ".." + high);

        // 同样的逻辑换成 while (true) + break，条件只写在 break 前面
        int n = 0;
        int steps = 0;
        while (true) {
            n++;
            steps++;
            if (n * n > 30) {
                System.out.println("第一个平方大于 30 的数是 " + n + "（" + (n * n) + "），用了 " + steps + " 轮");
                break;
            }
        }
    }
}
` },

    { t: 'p', html:
      '逐段看关键点。① <code>for</code> 管"最多猜几次"，<code>break</code> 管"猜中就停"。<br>' +
      '② <code>low</code> / <code>high</code> 维护"还可能的范围"，每猜一次收缩一边，这是二分查找的雏形（第 11 章）；' +
      '<code>low = guess + 1</code> 而不是 <code>low = guess</code>，因为 guess 已确定太小——这个"±1"是差一错误常发地。<br>' +
      '③ <code>won</code> 是<b>状态变量</b>：循环里可能修改，结束后统一判断。<br>' +
      '④ 末尾的 <code>while (true)</code> 版本：知道上限用 for，只知道"满足条件就停"用 while(true) + break。' +
      '⑤ <code>if (low &gt; high)</code> 防输入序列本身矛盾。'
    },

    { t: 'table',
      head: ['本章知识', '在案例里体现为', '对应考试题型'],
      rows: [
        ['循环三要素', '<code>k</code> 初值 0、<code>k &lt; GUESSES.length</code> 条件、<code>k++</code> 更新', '读程序数循环次数'],
        ['if / else if 链', '<code>cmp == 0</code> → <code>cmp &lt; 0</code> → 否则', '问"哪个分支执行"'],
        ['break 提前退出', '猜中后 <code>break</code>，不再继续猜', '读程序问输出'],
        ['计数器与状态变量', '<code>tries</code> / <code>tooSmall</code> / <code>tooLarge</code> / <code>won</code>', '写代码题（统计类）'],
        ['边界保护', '<code>low &gt; high</code> 提前结束', '找 bug / 补全代码']
      ] },

    { t: 'h', text: '完整案例 B：素数判断与质因数分解' },

    { t: 'p', html:
      '第二个案例更接近作业形态：写一个 <code>isPrime(n)</code> 判断素数，再把一个整数分解成质因数。' +
      '它同时用到<b>循环 + 提前 return</b>（发现因子立刻返回 false）、<b>外层 for + 内层 while</b>（枚举因子、除干净）、' +
      '以及"循环条件用 <code>d * d &lt;= x</code> 而不是 <code>d &lt; x</code>"这个经典优化。' +
      '读之前先预测：1..30 里有多少个素数？360 分解成什么？（答案：10 个；2³ × 3² × 5。）'
    },

    { t: 'code', caption: 'PrimeFactors.java —— 60 行：素数筛选 + 质因数分解 + gcd/lcm', code:
`public class PrimeFactors {
    // 素数判断：只需试到 d*d <= n
    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int d = 2; d * d <= n; d++) {
            if (n % d == 0) return false;
        }
        return true;
    }

    // 最大公约数：while + 取余
    static int gcd(int a, int b) {
        while (b != 0) {
            int r = a % b;
            a = b;
            b = r;
        }
        return a;
    }

    // 分解质因数：外层枚举候选因子，内层 while 除干净
    static void factorize(int n) {
        if (n < 2) {
            System.out.println(n + " 不能分解质因数");
            return;
        }
        System.out.print(n + " = ");
        int x = n;
        boolean first = true;
        for (int d = 2; d * d <= x; d++) {
            int exp = 0;
            while (x % d == 0) {
                x = x / d;
                exp++;
            }
            if (exp > 0) {
                if (!first) System.out.print(" x ");
                System.out.print(exp > 1 ? d + "^" + exp : String.valueOf(d));
                first = false;
            }
        }
        if (x > 1) {
            if (!first) System.out.print(" x ");
            System.out.print(x);
        }
        System.out.println();
    }

    public static void main(String[] args) {
        // 1) 用循环筛出 1..30 的素数
        System.out.print("1..30 的素数：");
        int count = 0;
        for (int n = 1; n <= 30; n++) {
            if (isPrime(n)) {
                System.out.print(n + " ");
                count++;
            }
        }
        System.out.println("（共 " + count + " 个）");

        // 2) 因数分解
        factorize(360);
        factorize(97);
        factorize(1);

        // 3) gcd 与 lcm：lcm 用 a/g*b 避免溢出
        int a = 12, b = 18;
        int g = gcd(a, b);
        System.out.println("gcd(" + a + "," + b + ") = " + g + "，lcm = " + (a / g * b));

        // 4) 边界
        System.out.println("isPrime(1) = " + isPrime(1) + "，isPrime(2) = " + isPrime(2));
    }
}
` },

    { t: 'p', html:
      '几个值得抄下来的细节。① <code>isPrime</code> 先排除 <code>n &lt; 2</code>（0 和 1 不是素数，最常被忘的边界），' +
      '再从 2 试到 √n：若 n 有大于 √n 的因子，必有一个小于 √n 的因子。② 循环里 <code>return false</code> ' +
      '是合法的提前退出，比 break + 标志位更简洁。<br>' +
      '③ <code>factorize</code> 外层 for、内层 while 把同一因子除干净：360 先除 3 次 2，再除 2 次 3，剩 5；' +
      '条件用 <code>d * d &lt;= x</code> 而不是 n，因为 x 在循环里不断变小。④ <code>gcd</code> 是欧几里得算法；' +
      '<code>lcm</code> 用 <code>a / g * b</code> 先除后乘防溢出。⑤ 边界：1 不是素数、2 是素数。'
    },

    { t: 'h', text: '教材对照：§1.3 条件与循环的四种构造', id: 'ch03-12' },

    { t: 'p', html:
      '教材 §1.3 的组织方式很有代表性：它先给你五个完整程序——调和级数、牛顿开方、二进制转换、赌徒破产、' +
      '因数分解——再逐个拆出 if、while、for 这些构造。也就是说，<b>先看程序解决什么问题，再学它为什么这样写</b>。' +
      '本站的顺序相反：先讲构造再给例子。两种顺序都行，读完这一节可以把两边接起来。'
    },

    { t: 'table',
      head: ['构造', '本站小节', '什么时候用它'],
      rows: [
        ['<code>if</code> / <code>else if</code> / <code>else</code>', '三、if 与悬空 else', '按条件二选一或多选一；注意花括号永远写全'],
        ['<code>while</code>', '四、while', '<b>不知道要循环几次</b>，只知道"做到什么条件为止"（如牛顿迭代）'],
        ['<code>for</code>', '四、for', '<b>次数已知</b>或能用一个计数器数清（如从 1 加到 n）'],
        ['<code>do-while</code>', '四、do-while', '至少执行一次，再判断要不要继续（如"先读一行再看有没有输入"）'],
        ['<code>switch</code>', '（本站未单列，见下方说明）', '一个变量对多个<b>常量</b>分支；忘了 break 会穿透到下一个 case'],
        ['<code>break</code> / <code>continue</code>', '六、break / continue 与标签', '提前退出循环 / 跳过本次剩余部分']
      ],
      caption: '教材五种程序里，牛顿开方是 while 的典型，调和级数是 for 的典型——记住这两个场景，比背语法有用' },

    { t: 'code', caption: '教材 Program 1.3.5 调和级数：原书跑 10 得 2.9289682539682538，跑 1000 得 7.485470860550343', args: ['10'], code:
`public class HarmonicNumber {
    public static void main(String[] args) {
        int n = Integer.parseInt(args[0]);
        double sum = 0.0;
        for (int i = 1; i <= n; i++) {
            sum += 1.0 / i;
        }
        System.out.println(sum);
    }
}
` },

    { t: 'p', html:
      '这段 10 行代码把 §1.3 的多个考点一次占全：<code>for</code> 的初始化/条件/更新三段怎么写、' +
      '<code>1.0 / i</code> 为什么不能写成 <code>1 / i</code>（后者是整数除法，除了 i=1 全是 0）、' +
      '以及"累加器"变量为什么必须在循环外初始化。教材随后用它对比不同 n 的增长速度，' +
      '为后面讲"复杂度"埋下伏笔——这也是本站 ch13 的 Big-O 要回答的问题。<br><br>两个教材特意点出的细节：① <b><code>for</code> 的三段不是"并行"执行的</b>，顺序是' +
      '初始化一次 → 判断条件 → 执行循环体 → 执行更新 → 再判断，如此往复；② <b>while 的适用场景</b>是' +
      '"次数事先不知道"：教材的牛顿开方写的是 <code>while (Math.abs(t - c / t) &gt; 1e-15)</code>，' +
      '循环到误差足够小才停，没人能事先算出要迭代几轮。本站 ch05 的递归分形、ch03 的猜数字都是同一类结构。<br><br>五个程序里，除了细看的两个，另外三个各管一个考点：<b>Binary</b> 用 <code>while (n &gt; 0)</code> 反复取 ' +
      '<code>n % 2</code>、再 <code>n /= 2</code>，从低位到高位拼出二进制串；<b>Gambler</b> 用 ' +
      '<code>Math.random()</code> 模拟“每次押 1 美元”，循环条件同时检查“钱还没输光”和“还没赢到目标”，' +
      '说明循环次数可以完全是随机的；<b>Factors</b> 先用 <code>while (n % factor != 0) factor++;</code> 找最小因子，' +
      '再把 n 除以它、重复找下一个。三种模式——取余拆位、随机游走、反复除去——是后面所有循环题的原型。<br><br>最后补一句本站没单讲的 switch：教材 §1.3 把 switch 与 if 并列讲，本站为了控制篇幅，只在"边界与反例"里提过它。' +
      '你需要会读即可：<code>switch (x) { case 1: …; break; default: …; }</code>，' +
      '每个 case 后忘了 <code>break</code> 会继续执行下一个分支（fall-through），这是最常见的 switch 错误；' +
      '另外 case 后面必须是<b>常量</b>，不能是变量或范围。遇到考试题按这两条判断就够了。'
    },

    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch03-q1' },
    { t: 'quiz', qid: 'ch03-q2' },
    { t: 'quiz', qid: 'ch03-q3' },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      '控制流是 本课程期中占比最大的部分，四类题：' +
      '① <b>读代码写输出（10 分档）</b>：Mock A Q4 给一段"最小公倍数"程序——' +
      '<code>int step = (a &gt; b) ? a : b;</code> 用三元运算符，' +
      '<code>while (!(lcm % a == 0 &amp;&amp; lcm % b == 0))</code> 用<b>双重取反 + 短路</b>当条件、' +
      '循环体里 <code>lcm += step;</code>，' +
      '问 <code>java Q4 12 18</code> 与 <code>java Q4 7 5</code> 的输出（36 与 35）。' +
      '考的是"手跑 while"与"看不看得懂 <code>!(A &amp;&amp; B)</code>"。<br>' +
      '② <b>写代码（5 分档）</b>：Mock B Q4 要求"用 for 循环统计 <code>int[] arr</code> 里正数的个数存入 <code>count</code>"——' +
      '<code>int count = 0;</code> + <code>for (int i = 0; i &lt; arr.length; i++)</code> + ' +
      '<code>if (arr[i] &gt; 0) count++;</code>；评分看边界与 <code>&lt;</code> 而非 <code>&lt;=</code>。<br>' +
      '③ <b>填空（9 分档）</b>：Mock B Q5 三个空——最后元素下标 <code>arr.length - 1</code>、' +
      '逆序条件 <code>i &gt;= 0</code>、整除判断 <code>arr[i] % 3 == 0</code>。<br>' +
      '④ <b>改错</b>：差一错误、死循环、悬空 else、<code>==</code> 写成 <code>=</code>。<br>' +
      '<b>看到循环题先做什么</b>：① 初值是多少；② 每一轮更新谁；③ 条件在哪一轮第一次变成 false。 ' +
      '这三步写完，输出和次数基本就出来了。'
    },

    { t: 'keypoint', items: [
      { title: 'boolean', html: '只有 true / false；<code>if (1)</code> 编译错误。' },
      { title: '短路', html: '<code>&amp;&amp;</code> 左假不看右，<code>||</code> 左真不看右——防 NPE。' },
      { title: '分支', html: 'if 链只执行第一个成立的分支；else 配最近的 if。' },
      { title: '三要素', html: '初值、条件、更新；问"哪一步让条件变 false"。' },
      { title: '三种循环', html: '未知次数 while，已知次数 for，至少一次 do-while。' },
      { title: '数次数', html: '写前三轮的值；注意端点、步长、<code>n--</code> 结束为 -1。' },
      { title: '跳转', html: 'break 跳一层，continue 跳一轮；跨层用标签。' },
      { title: '数位', html: '<code>% 10</code> 取位、<code>/ 10</code> 去位；进制转 2 后倒序。' },
      { title: '边界', html: '0 / 1 / 负数 / 相等 / 溢出 / 浮点比较——扣分重灾区。' }
    ] },

    { t: 'checklist', id: 'ch03', items: [
      '我能预测一段 if / else if / else 在给定输入下打印什么',
      '我能解释为什么 5 < x < 10 不能编译，正确写法是什么',
      '我能说出 && 与 || 的短路规则，并用代码验证',
      '我能写出 for 循环的完整执行顺序（初始化 → 判断 → 体 → 更新）',
      '我能不运行代码算出 <code>for (i = 0; i &lt; n; i += 2)</code> 的执行次数',
      '我能判断一段循环会不会死，以及 while 与 do-while 的最少执行次数',
      '我能说清 break 与 continue 的区别，并用标签跳出两层循环',
      '我能解释悬空 else 为什么配内层 if，以及大括号如何避免它',
      '我能用循环完成数位和、十进制转二进制、素数判断与质因数分解',
      '我能按"写预期—缩小复现—逐轮列表—只改一处"的流程调试控制流 bug',
      '我能说出教材 §1.3 的四种循环构造，并解释 while 与 for 各自适合"次数已知"还是"次数未知"'
    ] },

    { t: 'p', html:
      '<b>延伸阅读</b>：Sedgewick《Computer Science: An Interdisciplinary Approach》第 1.3 节（Conditionals and Loops）' +
      '讲了本节所有结构，并给出二分查找、牛顿迭代等循环应用；站内第 04 章把循环用在数组遍历上，' +
      '第 11、13 章会把"循环次数"升级成 Big-O 分析。想练手到 <a href="#/quiz/ch03">题库 · ch03</a> 按章筛选，' +
      '或去实验台「条件分支流程」「循环逐轮可视化」再走一遍。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '循环题是 AI 最容易"看起来对、其实错"的地方：' +
      '① 让它写"打印 1 到 n 的素数"，逐行检查边界：n = 1、2、负数分别怎样？' +
      '② 让它解释一段嵌套循环执行多少次，你先算一遍再对照——它常把 <code>&lt;=</code> 与 <code>&lt;</code> 搞混；' +
      '③ 让它故意给一个有 bug 的循环（少更新、条件写反），你来找出错在哪。<br>' +
      '反过来考 AI：把"完整案例 A"发给它，问"若第 4 次猜中，<code>tooSmall</code> 与 <code>tooLarge</code> 各是多少"，再用本站结果裁决。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：条件与循环：boolean 与短路、if/else 与悬空 else、while/for/do-while、循环次数与边界、嵌套、break/continue 与标签、数位处理。<br>依据：Course Outline v5 的 Conditionals & Loops 部分；Sedgewick §1.3。本站为个人整理的学习材料，与课程要求冲突时以老师和课程大纲为准；代码均在真实 JDK 上校验过。' }

  ]
});