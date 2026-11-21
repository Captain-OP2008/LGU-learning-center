/* =====================================================================
 * data/ch20.js · 第 20 章：形式语言与自动机
 * 职责：字母表与形式语言、并/连接/闭包、正则表达式、广义正则、
 *       DFA 模型与模拟、NFA 与子集构造、Kleene 定理、正则语言的边界、PDA。
 * 依据：教材 §5.1；示例输出均用 JDK 25 核对。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch20',
  num: '20',
  title: '形式语言与自动机',
  en: 'Formal Languages',
  goals: [
    '能说清 alphabet、string、formal language 三个定义，并区分"描述"与"识别"两个问题',
    '能用并、连接、闭包把简单语言组合成新语言，并写出对应的正则表达式',
    '能读懂 DFA 的状态图与状态转移表，手算一条输入串的运行轨迹',
    '能说清 NFA 与 DFA 的差别，并用"状态集合"模拟 NFA',
    '能复述 Kleene 定理的两个方向，并解释为什么 DFA 的状态数可能指数爆炸',
    '能用鸽巢原理说明"a 和 b 个数相等"不是正则语言，并知道加一个栈会发生什么'
  ],
  kp: [
    { id: 'ch20-1', title: '字母表、串与形式语言' },
    { id: 'ch20-2', title: '并、连接与闭包' },
    { id: 'ch20-3', title: '正则表达式' },
    { id: 'ch20-4', title: '广义正则与真实应用' },
    { id: 'ch20-5', title: 'DFA：有限状态的机器' },
    { id: 'ch20-6', title: '用程序模拟 DFA' },
    { id: 'ch20-7', title: 'NFA：允许猜测的机器' },
    { id: 'ch20-8', title: 'Kleene 定理：三种模型等价' },
    { id: 'ch20-9', title: '正则语言的边界与更强的机器' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '你一定用正则表达式查过字符串：邮箱、金额、日志里的错误码。但有没有想过，' +
      '有些语言无论怎么写正则都描述不出来？比如"a 和 b 的个数相等"这种看起来极简单的条件。' +
      '形式语言（formal language）把"描述一个字符串集合"变成可以证明的数学对象，' +
      '再用自动机（automaton）回答"给定串是否属于这个集合"。' +
      '这一章的主线是三个看似不同的东西——正则表达式、DFA、NFA——被 Kleene 定理证明为' +
      '<b>完全等价</b>；而这条等价链的尽头，正好是"有限状态"能力的天花板。' +
      '看懂天花板在哪里，才能理解后面为什么要发明图灵机。'
    },

    { t: 'h', text: '一、字母表、串与形式语言', id: 'ch20-1' },

    { t: 'p', html:
      '先固定三个词。<b>字母表（alphabet）</b>是一个有限的符号集合，比如 <code>{a, b}</code> 或 ' +
      '<code>{A, C, G, T}</code>。<b>串（string）</b>是字母表里符号的有限序列，比如 <code>abba</code>；' +
      '长度为 0 的串叫空串（empty string），记作 <code>ε</code>。' +
      '<b>形式语言（formal language）</b>是<b>一些串组成的集合</b>——可以是有限的，也可以是无限的。' +
      '注意语言是集合，不是"句子"：判断一个串在不在语言里，就是判断集合成员关系。'
    },

    { t: 'table', caption: '四个形式语言的例子：字母表、语言、以及两个串的归属', head: ['语言', '字母表', '包含的串（举例）', 'abba 属于吗'], rows: [
      ['所有二进制串', '{a, b}', 'ε, a, b, aab, bbaab …', '是'],
      ['回文串', '{a, b}', 'ε, a, aba, abba, baab …', '是'],
      ['b 的个数是 3 的倍数', '{a, b}', 'ε, bbb, abbb, bbabb …', '否（abba 有 2 个 b）'],
      ['所有合法 Java 程序', 'ASCII 字符集', 'public class … 等', '否']
    ] },

    { t: 'p', html:
      '有了语言，就出现两个不同的问题。<b>描述问题（specification problem）</b>：' +
      '怎么精确地说出"这个语言包含哪些串"？<b>识别问题（recognition problem）</b>：' +
      '给定一个串，怎么判断它在不在语言里？' +
      '正则表达式、自动机、图灵机都是描述工具；而写一个程序去判定成员关系，就是识别问题。' +
      '本章会反复看到：描述工具和识别程序往往是一一对应的。'
    },

    { t: 'code', caption: 'RegexFirst.java —— 一行 matches 就是一个识别程序', code:
`public class RegexFirst {
    public static void main(String[] args) {
        String[] words = { "aab", "abb", "ba", "abab", "a" };
        for (int i = 0; i < words.length; i++) {
            boolean ok = words[i].matches("(a|b)*a(a|b)");
            System.out.println(words[i] + " -> " + ok);
        }
    }
}
` },

    { t: 'p', html:
      '运行结果五行：<code>aab -> true</code>、<code>abb -> false</code>、<code>ba -> false</code>、' +
      '<code>abab -> true</code>、<code>a -> false</code>。' +
      '正则 <code>(a|b)*a(a|b)</code> 描述的是"<b>倒数第二个符号是 a</b>"的所有二进制串：' +
      '前面任意长，然后一个 <code>a</code>，再跟一个任意符号。' +
      '<code>a</code> 只有一位，凑不出"倒数第二个"，所以是 false。' +
      '这条正则就是该语言的一个<b>描述</b>；<code>matches</code> 则是它的<b>识别程序</b>。'
    },

    { t: 'h', text: '二、并、连接与闭包', id: 'ch20-2' },

    { t: 'p', html:
      '从已有语言造新语言，最基本的是三种运算。<b>并（union）</b><code>R | S</code>：' +
      '属于 R 或属于 S 的串。<b>连接（concatenation）</b><code>RS</code>：一个 R 的串后面接一个 S 的串。' +
      '<b>闭包（closure）</b><code>R*</code>：把 R 的串连接 0 次或多次，0 次得到空串 <code>ε</code>。' +
      '闭包是最容易出错的一个——<code>R*</code> 一定包含空串。' +
      '优先级是<b>闭包 &gt; 连接 &gt; 并</b>：<code>ab*</code> 表示 <code>a(b*)</code>，' +
      '而 <code>(ab)*</code> 才是 <code>ab</code> 重复任意多次；括号可以改变结合方式。' +
      '例：<code>{a, ba} | {ab, ba, b}</code> 得到 <code>{a, ba, ab, b}</code>；' +
      '<code>{a, ab}{a, ba, bab}</code> 得到 6 个串，比如 <code>a·ba = aba</code>、<code>ab·bab = abbab</code>。'
    },

    { t: 'table', caption: '三种基本运算：符号、含义与一个具体例子', head: ['运算', '写法', '含义', '例子（R = {a}, S = {b}）'], rows: [
      ['并', 'R | S', '属于 R 或属于 S', '{a} | {b} = {a, b}'],
      ['连接', 'RS', 'R 的串接 S 的串', '{a}{b} = {ab}'],
      ['闭包', 'R*', 'R 的串连接 0 次或多次', '{a}* = {ε, a, aa, aaa, …}']
    ] },

    { t: 'h', text: '三、正则表达式', id: 'ch20-3' },

    { t: 'p', html:
      '正则表达式（regular expression，RE）是描述正则语言的紧凑记号，递归定义只有四条：' +
      '字母表里的单个符号是 RE；若 R、S 是 RE，则 <code>R|S</code>、<code>RS</code>、<code>R*</code> 是 RE；' +
      '括号 <code>(R)</code> 不改变语言。<b>元符号（metasymbol）</b>只有 <code>|</code>、<code>*</code>、' +
      '<code>(</code>、<code>)</code> 四个，其余符号都代表自己。' +
      '一个语言叫<b>正则语言（regular language）</b>，当且仅当存在某个 RE 能描述它。'
    },

    { t: 'code', caption: 'RegexValidate.java —— 用正则做输入校验（金额与基因片段）', code:
`public class RegexValidate {
    public static void main(String[] args) {
        String money = "\\\\$[1-9][0-9]*\\\\.[0-9][0-9]";
        String[] inputs = { "$12.50", "$0.99", "$12.5", "12.50", "$100.00" };
        for (int i = 0; i < inputs.length; i++) {
            System.out.println(inputs[i] + " -> " + inputs[i].matches(money));
        }

        String[] dna = { "GCGCGGCTG", "GCGAGGCTG", "GCGCCCCCTG" };
        for (int i = 0; i < dna.length; i++) {
            System.out.println(dna[i] + " -> " + dna[i].matches("GCG(CGG|AGG)*CTG"));
        }
    }
}
` },

    { t: 'p', html:
      '金额那组的输出是 <code>true, false, false, false, true</code>：必须以 <code>$</code> 开头、' +
      '整数部分不能以 0 开头、小数点后必须恰好两位。<code>$0.99</code> 因为整数部分以 0 开头被拒绝。' +
      '基因那组输出 <code>true, true, false</code>：<code>GCG(CGG|AGG)*CTG</code> 要求开头 GCG、' +
      '结尾 CTG，中间是 0 段或多段 CGG/AGG。<code>GCGCCCCCTG</code> 中间的 CCCC 不匹配任何一段，所以失败。' +
      '这就是"正则描述 + matches 识别"在工业代码里的日常用法。'
    },

    { t: 'h', text: '四、广义正则与真实应用', id: 'ch20-4' },

    { t: 'p', html:
      '教材里的 RE 只有四个元符号，真实语言（Java、grep、Python）做了大量扩展，' +
      '但底层仍然可以化归为正则语言。常见的扩展有：<code>\\|</code> 等转义、<code>.</code> 匹配任意字符、' +
      '<code>^</code>/<code>$</code> 锚定行首行尾、字符类 <code>[a-z]</code> 与 <code>[^aeiou]</code>、' +
      '以及把闭包写成 <code>+</code>（一次或多次）、<code>?</code>（零或一次）、' +
      '<code>{n}</code>（恰好 n 次）、<code>{m,n}</code>（m 到 n 次）。'
    },

    { t: 'callout', kind: 'warn', title: '常见误区：正则不是"万能查找"', html:
      '三个坑要提前知道。第一，<b>贪婪匹配</b>：<code>a.*b</code> 会尽量往后吃，' +
      '常常匹配到最后一个 b 而不是第一个。第二，<b>转义</b>：在 Java 字符串里写一个正则反斜杠要写两个，' +
      '所以 <code>\\d</code> 要写成 <code>"\\\\d"</code>。第三，<b>性能</b>：' +
      '某些嵌套量词（如 <code>(a+)+b</code>）在失败输入上会指数级回溯；' +
      '真正的识别算法是先构造 NFA 再模拟，代价与串长成正比，这也是后面 Kleene 定理要给的答案。'
    },

    { t: 'p', html:
      '工程上，正则识别最典型的两个应用是<b>有效性检查</b>（金额、日期、邮箱是否合法）和' +
      '<b>搜索</b>：grep 把每一行拿去和 <code>.*正则.*</code> 匹配，命中就打印。' +
      '生物信息学里，锌指结构可以用 <code>C.{2,4}C…[LIVMFYWCX].{8}H.{3,5}H</code> 描述，' +
      '在一整条 DNA 序列上找符合模式的片段。' +
      '这些应用之所以可行，是因为背后有一个"能高效识别正则语言"的自动机模型——下一节就来造它。'
    },

    { t: 'h', text: '五、DFA：有限状态的机器', id: 'ch20-5' },

    { t: 'p', html:
      '<b>确定性有限状态自动机（DFA）</b>由四样东西组成：有限个状态（每个标为接受或拒绝）、' +
      '一个字母表、一张转移表（每个状态对每个符号<b>恰好</b>有一条出边）、一个只读且每次右移一格的读写头。' +
      '机器从状态 0 开始，每读一个符号就按转移表换状态；输入读完后，看停在接受态还是拒绝态。' +
      'DFA 一定会停机，因为读头只向右、输入有限。'
    },

    { t: 'svg', maxW: 680, caption: 'DFA：接受"b 的个数是 3 的倍数"的所有串。a 不改变计数，b 让状态循环 0→1→2→0，状态 0 是接受态。', html:
`<svg viewBox="0 0 700 300" role="img" aria-label="识别 b 的个数为 3 的倍数的 DFA">
  <defs>
    <marker id="ch20-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/>
    </marker>
  </defs>
  <text x="20" y="26" font-size="13" font-weight="700" fill="var(--accent)">DFA：b 的个数是 3 的倍数（状态 0 = Yes）</text>

  <circle cx="120" cy="170" r="44" fill="var(--accentSoft)" stroke="var(--accent)" stroke-width="2"/>
  <circle cx="120" cy="170" r="50" fill="none" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="120" y="166" font-size="14" text-anchor="middle" fill="var(--text)">0</text>
  <text x="120" y="184" font-size="11" text-anchor="middle" fill="var(--text)">Yes</text>

  <circle cx="350" cy="170" r="44" fill="var(--surface2)" stroke="var(--line2)" stroke-width="2"/>
  <text x="350" y="166" font-size="14" text-anchor="middle" fill="var(--text)">1</text>
  <text x="350" y="184" font-size="11" text-anchor="middle" fill="var(--text)">No</text>

  <circle cx="580" cy="170" r="44" fill="var(--surface2)" stroke="var(--line2)" stroke-width="2"/>
  <text x="580" y="166" font-size="14" text-anchor="middle" fill="var(--text)">2</text>
  <text x="580" y="184" font-size="11" text-anchor="middle" fill="var(--text)">No</text>

  <path d="M120,120 C120,70 210,70 210,140" fill="none" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#ch20-arw)"/>
  <text x="150" y="84" font-size="12" fill="var(--text)">a</text>

  <line x1="166" y1="170" x2="300" y2="170" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#ch20-arw)"/>
  <text x="228" y="160" font-size="12" fill="var(--text)">b</text>

  <path d="M350,120 C350,70 440,70 440,140" fill="none" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#ch20-arw)"/>
  <text x="380" y="84" font-size="12" fill="var(--text)">a</text>

  <line x1="396" y1="170" x2="530" y2="170" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#ch20-arw)"/>
  <text x="458" y="160" font-size="12" fill="var(--text)">b</text>

  <path d="M580,120 C580,70 670,70 670,140" fill="none" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#ch20-arw)"/>
  <text x="610" y="84" font-size="12" fill="var(--text)">a</text>

  <path d="M580,214 C580,270 120,270 120,218" fill="none" stroke="var(--accent2)" stroke-width="1.6" marker-end="url(#ch20-arw)"/>
  <text x="330" y="262" font-size="12" text-anchor="middle" fill="var(--text)">b（2→0，完成一轮）</text>

  <text x="60" y="170" font-size="12" fill="var(--text)">start</text>
  <line x1="86" y1="170" x2="74" y2="170" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#ch20-arw)"/>
</svg>` },

    { t: 'table', caption: '同一台 DFA 的状态转移表。手算 bbaab：0→1→2→2→2→0，停在接受态 0，所以被接受。', head: ['状态', '是否接受', '读 a 后', '读 b 后'], rows: [
      ['0', 'Yes', '0', '1'],
      ['1', 'No', '1', '2'],
      ['2', 'No', '2', '0']
    ] },

    { t: 'h', text: '六、用程序模拟 DFA', id: 'ch20-6' },

    { t: 'p', html:
      'DFA 之所以好写程序，是因为它只有一个当前状态：用一个整数变量 state 记住位置，' +
      '每读一个字符就查一次表。整段模拟代码只有循环和数组访问，时间复杂度与输入长度成正比。' +
      '下面的程序把上面那台 DFA 写成二维数组，<code>next[state][symbol]</code> 就是转移表。'
    },

    { t: 'code', caption: 'DFASim.java —— 用二维数组实现一台具体的 DFA', code:
`public class DFASim {
    public static void main(String[] args) {
        int[][] next = { { 0, 1 }, { 1, 2 }, { 2, 0 } };
        boolean[] accept = { true, false, false };
        String[] inputs = { "bbaab", "bbb", "abab", "" };

        for (int k = 0; k < inputs.length; k++) {
            String s = inputs[k];
            int state = 0;
            for (int i = 0; i < s.length(); i++) {
                int symbol = (s.charAt(i) == 'a') ? 0 : 1;
                state = next[state][symbol];
            }
            System.out.println(s + " -> " + (accept[state] ? "Yes" : "No"));
        }
    }
}
` },

    { t: 'p', html:
      '输出四行：<code>bbaab -> Yes</code>、<code>bbb -> Yes</code>、<code>abab -> No</code>、' +
      '<code> -> Yes</code>（空串有 0 个 b，0 是 3 的倍数，所以接受）。' +
      '注意最后一行空串也打印了 Yes，这提醒我们：<b>空串是否属于语言，要看定义</b>，' +
      '而 DFA 的初始状态就是答案。' +
      '把转移表从代码里挪到文件里（状态数、字母表、每个状态一行），就得到教材的"通用虚拟 DFA"——' +
      '同一份 Java 程序可以模拟任意一台 DFA，这已经是"程序处理程序"的雏形。'
    },

    { t: 'h', text: '七、NFA：允许猜测的机器', id: 'ch20-7' },

    { t: 'p', html:
      'DFA 的转移太死板：每个状态对每个符号恰好一条出边。' +
      '<b>非确定性有限自动机（NFA）</b>把限制全部放开：同一个符号可以有多条出边，' +
      '可以有不读符号就走的空转移（null transition），某些符号甚至可以不写转移。' +
      '接受规则也变了：只要<b>存在一条</b>从状态 0 到接受态的路径读完整个输入，就接受。' +
      'NFA 不是真的在"猜"，它只是把"所有可能路径"同时保留下来。'
    },

    { t: 'svg', maxW: 680, caption: 'NFA：接受所有"倒数第二个符号是 a"的二进制串。状态 0 读 a 时可以留在 0，也可以跳到 1；状态 1 再读一个符号到 2。', html:
`<svg viewBox="0 0 700 300" role="img" aria-label="识别倒数第二个符号为 a 的 NFA">
  <defs>
    <marker id="ch20-arw2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/>
    </marker>
  </defs>
  <text x="20" y="26" font-size="13" font-weight="700" fill="var(--accent)">NFA：倒数第二个符号是 a（状态 2 = Yes）</text>

  <circle cx="130" cy="170" r="44" fill="var(--surface2)" stroke="var(--line2)" stroke-width="2"/>
  <text x="130" y="166" font-size="14" text-anchor="middle" fill="var(--text)">0</text>
  <text x="130" y="184" font-size="11" text-anchor="middle" fill="var(--text)">No</text>

  <circle cx="360" cy="170" r="44" fill="var(--surface2)" stroke="var(--line2)" stroke-width="2"/>
  <text x="360" y="166" font-size="14" text-anchor="middle" fill="var(--text)">1</text>
  <text x="360" y="184" font-size="11" text-anchor="middle" fill="var(--text)">No</text>

  <circle cx="590" cy="170" r="44" fill="var(--accentSoft)" stroke="var(--accent)" stroke-width="2"/>
  <circle cx="590" cy="170" r="50" fill="none" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="590" y="166" font-size="14" text-anchor="middle" fill="var(--text)">2</text>
  <text x="590" y="184" font-size="11" text-anchor="middle" fill="var(--text)">Yes</text>

  <path d="M130,120 C130,66 230,66 230,140" fill="none" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#ch20-arw2)"/>
  <text x="160" y="80" font-size="12" fill="var(--text)">a, b</text>

  <line x1="176" y1="170" x2="310" y2="170" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#ch20-arw2)"/>
  <text x="238" y="160" font-size="12" fill="var(--text)">a</text>

  <line x1="406" y1="170" x2="540" y2="170" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#ch20-arw2)"/>
  <text x="468" y="160" font-size="12" fill="var(--text)">a, b</text>

  <text x="72" y="170" font-size="12" fill="var(--text)">start</text>
  <line x1="98" y1="170" x2="84" y2="170" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#ch20-arw2)"/>
</svg>` },

    { t: 'p', html:
      '为什么它恰好识别"倒数第二个是 a"？如果串的倒数第二个符号是 a，NFA 可以一直留在状态 0，' +
      '读到那个 a 时跳到 1，再读最后一个符号进入 2，接受。反过来，要走到状态 2，' +
      '必须在某个 a 之后恰好还剩一个符号——所以倒数第二个必然是 a。' +
      '这种"某条路径能走通"的论证，是 NFA 证明的标准套路。' +
      '模拟 NFA 的办法不是穷举所有路径，而是<b>同时维护一个状态集合</b>：' +
      '先求初始状态经空转移能到达的集合；每读一个符号，把集合里每个状态按该符号走一步，' +
      '再补上所有空转移；读完后只要集合里有接受态就接受。' +
      '下面的程序对上面那台 NFA 做集合模拟，用三个布尔变量表示"当前可能处于状态 0/1/2"。'
    },

    { t: 'code', caption: 'NFASim.java —— 用状态集合模拟 NFA', code:
`public class NFASim {
    public static void main(String[] args) {
        String[] inputs = { "ab", "aab", "aba", "ba", "aabb" };

        for (int k = 0; k < inputs.length; k++) {
            boolean[] cur = { true, false, false };   // 初始可能状态集合
            for (int i = 0; i < inputs[k].length(); i++) {
                char c = inputs[k].charAt(i);
                boolean[] next = new boolean[3];
                if (cur[0]) {
                    next[0] = true;                   // 留在 0
                    if (c == 'a') next[1] = true;     // 或跳到 1
                }
                if (cur[1]) next[2] = true;           // 1 读任意符号到 2
                cur = next;
            }
            System.out.println(inputs[k] + " -> " + (cur[2] ? "Yes" : "No"));
        }
    }
}
` },

    { t: 'p', html:
      '输出是 <code>ab -> Yes</code>、<code>aab -> Yes</code>、<code>aba -> No</code>、' +
      '<code>ba -> No</code>、<code>aabb -> No</code>。' +
      '以 <code>aba</code> 为例：读 a 后集合 {0,1}；读 b 后 {0,2}；再读 a 后只剩 {0,1}，没有 2，拒绝。' +
      '这个集合演化过程就是 NFA 的"确定性模拟"，也是下一节 NFA→DFA 构造的原型：' +
      '<b>每个可能的集合，都可以当成一台 DFA 的一个状态</b>。'
    },

    { t: 'h', text: '八、Kleene 定理：三种模型等价', id: 'ch20-8' },

    { t: 'p', html:
      'Kleene 在 1951 年证明：<b>正则表达式、DFA、NFA 三种模型完全等价</b>，它们刻画的正则语言是同一个集合。' +
      '这个结论初看很反直觉——NFA 明明更自由，怎么会不比 DFA 强？' +
      '证明分两步：先把 NFA 变成 DFA（说明 NFA 不强于 DFA），再把 NFA 变成 RE（说明 RE 能描述 NFA 的语言），' +
      '反方向 RE→NFA 用构造法，于是三者闭环。'
    },

    { t: 'steps', items: [
      { title: '第一步：NFA → DFA（子集构造）', html: '让新 DFA 的每个状态对应 NFA 的一个<b>状态子集</b>。若 NFA 有 n 个状态，新 DFA 最多有 2<sup>n</sup> 个状态。给定子集 S 和符号 c，新状态是"从 S 中任一状态出发，读 c 走一步，再任意走空转移"能到达的所有状态的集合。子集里含 NFA 接受态，就是 DFA 的接受态。' },
      { title: '第二步：NFA → RE（状态消去）', html: '先把边标签扩展成 RE，并加一个开始状态和一个结束状态（用空边连到原开始/接受态）。然后每次删掉一个中间状态：把它所有入边标签 S 与出边标签 D 组合成 <code>SR*D</code>，自环标签记为 R。删到只剩开始和结束两个状态时，那条边的标签就是所求 RE。' },
      { title: '第三步：RE → NFA（反向构造）', html: '从一条标签为 R 的边开始，反复化简：<code>(R)</code> 去括号；<code>RS</code> 拆成两条边加一个新状态；<code>R|S</code> 拆成两条平行边；<code>R*</code> 拆成一条空边加一个 R 自环。直到每条边只标单个符号或空，就得到 NFA。' }
    ] },

    { t: 'table', caption: '把"倒数第二个是 a"的 NFA 做子集构造（只列可达状态）。NFA 只有 3 个状态，转成 DFA 后可达状态有 7 个；最坏情况是 2 的 n 次方——等价性只保证"能构造"，不保证"构造出来很小"。', head: ['DFA 状态（NFA 子集）', '接受？', '读 a 后', '读 b 后'], rows: [
      ['0', 'No', '01', '0'],
      ['1', 'No', '2', '2'],
      ['2', 'Yes', '∅', '∅'],
      ['01', 'No', '012', '02'],
      ['02', 'Yes', '01', '0'],
      ['12', 'Yes', '2', '2'],
      ['012', 'Yes', '012', '02']
    ] },

    { t: 'h', text: '九、正则语言的边界与更强的机器', id: 'ch20-9' },

    { t: 'p', html:
      '正则语言有一个明确的天花板。考虑语言 <code>{a<sup>n</sup>b<sup>n</sup> : n ≥ 0}</code>，' +
      '也就是"a 和 b 的个数相等"（先全 a 后全 b）。直觉上它比回文简单，但它<b>不是正则语言</b>，' +
      '任何 RE、DFA、NFA 都描述不了。证明用的是反证法加鸽巢原理：假设有 n 个状态的 DFA 能识别它，' +
      '拿输入 <code>a<sup>n</sup>b<sup>n</sup></code> 跑一遍，读 a 的阶段要经过 n+1 个状态，' +
      '必然有状态重复；把重复环上的 a 删掉，得到 <code>a<sup>n-k</sup>b<sup>n</sup></code>，' +
      'DFA 却停在同一个接受态，于是接受了 a、b 个数不等的串，矛盾。' +
      '这个技巧就是"泵引理"（pumping lemma）的雏形：正则语言里足够长的串总有一段可以反复"泵"而不改变接受性，' +
      '而 <code>a<sup>n</sup>b<sup>n</sup></code> 不允许这种重复。'
    },

    { t: 'steps', items: [
      { title: '假设', html: '假设存在有 n 个状态的 DFA 能识别"a 的个数等于 b 的个数"。' },
      { title: '构造反例串', html: '取 <code>a<sup>n</sup>b<sup>n</sup></code>，它属于该语言，DFA 必须接受。' },
      { title: '用鸽巢原理', html: '读前 n 个 a 的过程中，轨迹有 n+1 个状态（含起点），由鸽巢原理必有两个位置停在同一状态，中间形成一个环。' },
      { title: '删环', html: '把环上那些 a 删掉，得到更短的 <code>a<sup>n-k</sup>b<sup>n</sup></code>；DFA 仍会走同一条轨迹的剩余部分，最后停在同一接受态，因此也接受它。' },
      { title: '矛盾', html: '但新串里 a 和 b 个数不等，不该被接受。矛盾说明假设不成立，该语言不是正则语言。' }
    ] },

    { t: 'table', caption: '哪些语言是正则的？判断依据是"需不需要无界计数"', head: ['语言', '是否正则', '原因'], rows: [
      ['b 的个数是 3 的倍数', '是', '只需要记除以 3 的余数，3 个状态够'],
      ['倒数第二个符号是 a', '是', '只需记住最近两个符号，状态数有限'],
      ['回文串', '否', '需要记住整个前半段，长度无界'],
      ['a 和 b 个数相等', '否', '需要无界计数'],
      ['括号配对（任意深度）', '否', '需要栈，属于上下文无关语言']
    ] },

    { t: 'p', html:
      '怎么突破这个天花板？给 DFA 加一个<b>栈（stack）</b>，就得到下推自动机（pushdown automaton，PDA）。' +
      '遇到 a 就压栈、遇到 b 就弹栈，最后栈空即接受——于是 <code>a<sup>n</sup>b<sup>n</sup></code> 被解决了。' +
      'PDA 识别的语言叫上下文无关语言（context-free language，CFL），正则表达式本身的集合、' +
      'Java 的核心语法子集都是 CFL。但 PDA 也有极限：再加一个栈，就与图灵机等价，' +
      '而"一个栈"和"两个栈"之间是一道巨大的能力鸿沟。下一章就从两个栈开始，正式进入图灵机。'
    },

    { t: 'quiz', qid: 'ch20-q1' },
    { t: 'quiz', qid: 'ch20-q2' },
    { t: 'quiz', qid: 'ch20-q3' },

    { t: 'p', html:
      '理论讲完，动手拨一拨状态。下面这台实验台把本章的 DFA 缩小成 4 个状态：输入任意由 a、b 组成的串，' +
      '单步或连续播放，看状态怎样一跳一跳地走，最后停在接受态还是拒绝态。'
    },

    { t: 'lab', id: 'dfa' },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      '常见题型有四类：给状态图问接受哪些串；给语言让你画 DFA 或写 RE；' +
      '给 NFA 让你做子集构造或写出等价 RE；以及用鸽巢原理证明某个语言不是正则的。' +
      '最容易失分的是两处：闭包 <code>R*</code> 忘了包含空串；子集构造时漏掉空转移的闭包。' +
      '手算时建议先在草稿上列出"当前状态集合"，每读一个符号写一行，别跳步。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 三个定义', html: 'alphabet 是有限符号集；string 是有限序列；formal language 是串的集合（可以是无限集）。' },
      { title: '检查点 · 三种运算', html: '并 <code>R|S</code>、连接 <code>RS</code>、闭包 <code>R*</code>；优先级是闭包 &gt; 连接 &gt; 并，<code>R*</code> 一定含空串。' },
      { title: '检查点 · RE 的四个元符号', html: '基本 RE 只有 <code>| * ( )</code> 四个元符号，其余字符代表自己。' },
      { title: '检查点 · DFA 的确定性', html: '每个状态对每个符号恰好一条出边；只读、只右移、一定停机；接受与否由最后停在哪个状态决定。' },
      { title: '检查点 · NFA 的接受条件', html: '只要存在一条读完整个输入的路径到达接受态就接受；模拟时维护"可能状态集合"。' },
      { title: '检查点 · Kleene 定理', html: 'RE、DFA、NFA 等价；NFA→DFA 用子集构造，最多 2<sup>n</sup> 个状态；NFA→RE 用状态消去。' },
      { title: '检查点 · 正则的边界', html: '"a 和 b 个数相等"不是正则语言，鸽巢原理可证；有限状态记不住无界计数。' },
      { title: '检查点 · 更强的机器', html: 'DFA 加一个栈得到 PDA，识别上下文无关语言；再加一个栈就与图灵机等价。' }
    ] },

    { t: 'checklist', id: 'ch20', items: [
      '我能用自己的话解释 alphabet、string、formal language 的区别',
      '我能写出并、连接、闭包三种运算的定义，并算出一个具体例子',
      '我能判断 <code>ab*</code> 和 <code>(ab)*</code> 描述的语言有什么不同',
      '我能读懂一台 DFA 的状态图，手算一条输入串的完整轨迹',
      '我能把 DFA 的转移表写成二维数组，并说出模拟循环的三步',
      '我能解释 NFA 的"存在一条路径"接受规则，并用状态集合手算一次',
      '我能复述 Kleene 定理的两个证明方向，并说明 2<sup>n</sup> 从哪来',
      '我能用鸽巢原理证明"a 和 b 个数相等"不是正则语言',
      '我能说出 PDA 比 DFA 多了一个栈，以及它对应哪类语言'
    ] },

    { t: 'p', html:
      '延伸阅读：教材 Chapter 5 的 §5.1，' +
      '其中 DFA 的通用模拟程序在 Program 5.1.3，NFA 子集构造的完整例子在 §5.1 后半。' +
      '站内可对照 ch12「递归」复习"有限状态机与递归的差别"，' +
      '以及 ch20 之后的 ch21「图灵机与通用性」——那里会把本章的"一个栈"升级成"两个栈"。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '正则表达式和自动机是少数"越用越值钱"的理论：日志解析、输入校验、词法分析器、' +
      'DNA 序列搜索都以它们为基础。今天你可以让 AI 直接生成一条正则，但<b>判断它是否正确</b>' +
      '仍然需要本章的能力——尤其是"这个语言到底是不是正则的"这类问题，AI 也常常答错。' +
      '建议练习方式：自己先画 DFA，再让 AI 检查你的状态图，重点核对"是否每个状态对每个符号都有出边"。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：形式语言的定义与两个基本问题、并/连接/闭包、正则表达式与广义正则、DFA 模型与程序模拟、' +
      'NFA 与子集构造、Kleene 定理的两个方向、正则语言的极限（鸽巢原理证明）、PDA 与上下文无关语言。' +
      '依据：教材 §5.1（Chapter 5, Formal Languages）。' +
      '本站为个人整理学习材料，与课程要求冲突时以老师和课程大纲为准；' +
      '本章代码示例均在真实 JDK 上编译运行核对过输出。'
    }

  ]
});
