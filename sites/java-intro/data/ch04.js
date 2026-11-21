/* =====================================================================
 * data/ch04.js · 第 04 章：数组
 * 职责：从"一个变量"过渡到"一批数据"。覆盖声明/创建/默认值、下标与 length、
 *       两种遍历、六种典型算法套路、越界与 null 边界、二维数组与锯齿数组、
 *       引用/别名/传参、Arrays 工具类、三个调试实录、两个完整案例。
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5；代码均可在站内引擎运行（打开单步可看变量与内存）。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch04',
  num: '04',
  title: '数组',
  en: 'Arrays',
  goals: [
    '能正确声明、创建、初始化一维数组，说出元素的默认值',
    '能解释下标为什么从 0 开始，以及 length 与最大下标的关系',
    '能用循环完成求和、求最值、计数、查找、反转、移位',
    '能写出二维数组（含锯齿数组）的创建与行列遍历',
    '能说清"数组变量存的是引用"，区分别名与复制、传参的两种结果',
    '会用 Arrays 工具类完成打印、排序、复制、填充与内容比较',
    '能按"画下标轴—数边界—单步验证"的流程定位数组 bug'
  ],
  kp: [
    { id: 'ch04-1', title: '声明、创建、初始化与默认值' },
    { id: 'ch04-2', title: '下标从 0 开始，length 是属性' },
    { id: 'ch04-3', title: '遍历与六个典型算法套路' },
    { id: 'ch04-4', title: '越界异常与边界情况' },
    { id: 'ch04-5', title: '二维数组与锯齿数组' },
    { id: 'ch04-6', title: '数组是对象：引用、别名与传参' },
    { id: 'ch04-7', title: 'Arrays 工具类' },
    { id: 'ch04-8', title: '数组 bug 的调试方法' },
    { id: 'ch04-12', title: '教材 §1.4：洗牌、抽样、优惠券收集与素数筛' }
  ],
  blocks: [

    /* ------------------------------------------------------------------ 开篇 */
    { t: 'callout', kind: 'why', html:
      '先看一个真实会发生的怪事：老师想把成绩单复制一份再加 5 分，于是写了 <code>int[] curved = scores;</code>，' +
      '然后循环给 <code>curved</code> 每个元素 +5。结果打印出来，<b>原始成绩单也全部被加了 5 分</b>，' +
      '「原始分」和「加分后」变成同一份数据，后面的排名、及格率全错。<br>' +
      '这段代码没写错循环、没写错边界，却从一开始就错了——因为数组变量里装的不是一列数字，而是<b>一个地址</b>。' +
      '这一章要解决的就是这类问题：怎样创建和遍历数组、怎样写出六种考试最常考的数组算法、' +
      '怎样在「看起来都对」的代码里一眼揪出越界与别名的坑。'
    },

    { t: 'p', lead: true, html:
      '先运行下面这段程序，把三个输出记下来，再往下读。它只有十几行，却包含了本章最核心的那个问题。'
    },

    { t: 'code', caption: 'OpeningBug.java · 想复制一份成绩，结果原成绩被一起改了', trace: true, code:
`import java.util.Arrays;

public class OpeningBug {
    public static void main(String[] args) {
        int[] scores = {72, 91, 58, 100};
        int[] curved = scores;              // 以为复制了一份，其实只是别名

        for (int i = 0; i < curved.length; i++) {
            curved[i] = curved[i] + 5;      // 改的是同一块内存
        }

        System.out.println("original = " + Arrays.toString(scores));
        System.out.println("curved   = " + Arrays.toString(curved));
        System.out.println("same?    = " + (scores == curved));
    }
}
` },

    { t: 'p', html:
      '输出是 <code>original = [77, 96, 63, 105]</code>、<code>curved = [77, 96, 63, 105]</code>、' +
      '<code>same? = true</code>：两份「数据」其实是同一个数组对象。点「单步」你会看到，' +
      '<code>scores</code> 和 <code>curved</code> 两个变量里装的是同一个地址，箭头指向堆上的同一块内存。' +
      '想让两份数据真正独立，要写 <code>int[] curved = Arrays.copyOf(scores, scores.length);</code>——' +
      '这就是本章要反复强调的<b>引用（reference）</b>与<b>复制（copy）</b>的区别。'
    },

    { t: 'p', html:
      '本章路线：先把「声明、创建、初始化」三件事和默认值分清（一），再吃透下标与 <code>length</code>（二）；' +
      '然后用两种遍历写会六种必考套路（三），顺着说清越界与边界的关系（四）；' +
      '接着进入二维数组与锯齿数组（五）、数组作为对象的引用语义（六）、<code>Arrays</code> 工具类（七）；' +
      '最后用三个调试实录（八）和两个 50 行以上的完整案例把全部概念串起来。'
    },

    /* ------------------------------------------------------------------ 一、声明创建 */
    { t: 'h', text: '一、声明、创建与初始化', id: 'ch04-1' },

    { t: 'p', html:
      '三件事初学者常混在一起：<b>声明（declare）</b>只是告诉编译器「我要用一个 int 数组」，此时还没有格子；' +
      '<b>创建（create）</b>用 <code>new</code> 真正在堆上分配空间；<b>初始化（initialize）</b>是往里放值。' +
      '用 <code>{ }</code> 简写可以把后两步合成一步。'
    },

    { t: 'code', caption: 'CreateArray.java · 三种写法与默认值', code:
`public class CreateArray {
    public static void main(String[] args) {
        int[] scores = new int[5];           // 创建：5 个格子，默认全是 0
        System.out.println(scores.length);   // 5
        System.out.println(scores[0]);       // 0
        System.out.println(scores[4]);       // 0，最后一个合法下标

        int[] primes = {2, 3, 5, 7};         // 声明 + 创建 + 初始化一步到位
        System.out.println(primes[3]);       // 7

        double[] rates = new double[2];      // 数值型默认 0.0
        boolean[] flags = new boolean[2];    // 布尔型默认 false
        String[] names = new String[3];      // 引用类型默认 null
        System.out.println(rates[0] + " " + flags[0] + " " + names[0]);
    }
}
` },

    { t: 'p', html:
      '<code>new</code> 出来的元素不是「空」的，而是有一份确定的默认值：数字 0、<code>0.0</code>、' +
      '<code>false</code>、字符 <code>\'\\u0000\'</code>、引用类型 <code>null</code>。' +
      '默认值由类型决定，跟「有没有赋值」无关——这一点在考试里会以「数组元素默认值是什么」的形式出现。'
    },

    { t: 'table',
      head: ['元素类型', '默认值', '注意'],
      rows: [
        ['<code>int</code> / <code>long</code> / <code>short</code> / <code>byte</code>', '<code>0</code>', '不是 null，是数字 0'],
        ['<code>double</code> / <code>float</code>', '<code>0.0</code>', '打印出来带小数点'],
        ['<code>boolean</code>', '<code>false</code>', '不是 0，也不是 null'],
        ['<code>char</code>', '<code>\'\\u0000\'</code>', '打印出来是看不见的控制字符'],
        ['<code>String</code> / 对象 / 二维数组的行', '<code>null</code>', '调用方法会抛 NullPointerException']
      ],
      caption: '数组元素一定有默认值；但方法里的局部变量没有默认值，必须先赋值再使用' },

    { t: 'terms', cols: 2, items: [
      { en: 'array', zh: '数组', html: '连续存放同类型元素的内存块，创建后长度固定。' },
      { en: 'element', zh: '元素', html: '数组里的一个格子，用 <code>a[i]</code> 访问。' },
      { en: 'index', zh: '下标 / 索引', html: '元素的位置编号，<b>从 0 开始</b>。' },
      { en: 'length', zh: '长度', html: '元素个数，是<b>属性</b>不是方法：<code>a.length</code>。' },
      { en: 'default value', zh: '默认值', html: '<code>new</code> 之后、赋值之前元素自动获得的值。' },
      { en: 'reference', zh: '引用', html: '变量里存的是指向堆中数组对象的地址。' }
    ] },

    { t: 'svg', maxW: 620, html:
'<svg viewBox="0 0 620 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="数组在内存中连续存放">\n' +
'  <text x="10" y="20" font-size="12" fill="var(--text3)" font-family="ui-monospace,monospace">int[] a = new int[5];   // 每个元素占 4 字节</text>\n' +
'  <g font-family="ui-monospace,monospace" text-anchor="middle">\n' +
'    <rect x="40" y="40" width="100" height="50" rx="8" fill="var(--surface2)" stroke="var(--line2)"/>\n' +
'    <rect x="140" y="40" width="100" height="50" rx="8" fill="var(--surface2)" stroke="var(--line2)"/>\n' +
'    <rect x="240" y="40" width="100" height="50" rx="8" fill="var(--surface2)" stroke="var(--line2)"/>\n' +
'    <rect x="340" y="40" width="100" height="50" rx="8" fill="var(--surface2)" stroke="var(--line2)"/>\n' +
'    <rect x="440" y="40" width="100" height="50" rx="8" fill="var(--surface2)" stroke="var(--line2)"/>\n' +
'    <text x="90" y="70" font-size="15" fill="var(--text)">0</text>\n' +
'    <text x="190" y="70" font-size="15" fill="var(--text)">0</text>\n' +
'    <text x="290" y="70" font-size="15" fill="var(--text)">0</text>\n' +
'    <text x="390" y="70" font-size="15" fill="var(--text)">0</text>\n' +
'    <text x="490" y="70" font-size="15" fill="var(--text)">0</text>\n' +
'    <text x="90" y="112" font-size="12" fill="var(--accent)">a[0]</text>\n' +
'    <text x="190" y="112" font-size="12" fill="var(--accent)">a[1]</text>\n' +
'    <text x="290" y="112" font-size="12" fill="var(--accent)">a[2]</text>\n' +
'    <text x="390" y="112" font-size="12" fill="var(--accent)">a[3]</text>\n' +
'    <text x="490" y="112" font-size="12" fill="var(--accent)">a[4]</text>\n' +
'    <text x="90" y="140" font-size="11" fill="var(--text3)">base</text>\n' +
'    <text x="190" y="140" font-size="11" fill="var(--text3)">base+4</text>\n' +
'    <text x="290" y="140" font-size="11" fill="var(--text3)">base+8</text>\n' +
'    <text x="390" y="140" font-size="11" fill="var(--text3)">base+12</text>\n' +
'    <text x="490" y="140" font-size="11" fill="var(--text3)">base+16</text>\n' +
'    <text x="40" y="172" font-size="12" fill="var(--text3)">共 5 个元素，合法下标 0 ~ 4；没有 a[5]</text>\n' +
'  </g>\n' +
'</svg>',
      caption: '连续的内存格子：下标 i 的地址 = base + i × 元素大小' },

    { t: 'callout', kind: 'warn', title: '只声明、没创建，还不是数组', html:
      '<code>int[] a;</code> 之后 a 里没有任何地址，还<b>不能</b>访问 <code>a[0]</code>，也还不能用 <code>a.length</code>；' +
      '必须先 <code>a = new int[5];</code> 或写 <code>int[] a = {1, 2, 3};</code>。' +
      '考试里给了 <code>int[] a = new int[5];</code>，问「a.length 是多少、a[4] 是多少」，答案是 5 和 0；' +
      '若只给 <code>int[] a;</code>，则连 length 都不能用。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 创建三件事', html: '能分别说出声明、创建、初始化各做什么，并写出「创建 5 个元素且全为 0」的代码。' },
      { title: '检查点 · 默认值', html: '能背出 int、double、boolean、char、String 数组元素的默认值，并知道局部变量没有默认值。' }
    ] },

    /* ------------------------------------------------------------------ 二、下标与 length */
    { t: 'h', text: '二、下标从 0 开始，length 是属性', id: 'ch04-2' },

    { t: 'p', html:
      '下标（index）本质上是<b>偏移量（offset）</b>：数组从地址 <code>base</code> 开始，每个元素占 <code>size</code> 字节，' +
      '那么 <code>a[i]</code> 的地址就是 <code>base + i × size</code>。<code>i = 0</code> 表示「离起点 0 个格子」，' +
      '也就是第一个元素。这样算地址只需要一次乘加，不必再减 1；同时上界刚好等于元素个数，' +
      '循环条件可以直接写 <code>i &lt; a.length</code>，形成<b>半开区间</b> <code>[0, n)</code>，边界少一次出错机会。'
    },

    { t: 'p', html:
      '记住一条换算：<b><code>new int[n]</code> 有 n 个元素，合法下标是 0 ~ n-1，最大下标 = <code>length - 1</code></b>。' +
      '这是数组题最高频的出错点。写循环时问自己一句：「最后一个该执行的 i 是多少？」' +
      '如果你希望访问到下标 <code>length - 1</code>，条件就必须是 <code>i &lt; a.length</code>；' +
      '写成 <code>i &lt;= a.length</code> 就会多走一步、访问 <code>a[a.length]</code> 而越界。'
    },

    { t: 'table',
      head: ['要表达的', '数组', 'String', 'ArrayList（第 10 章）'],
      rows: [
        ['长度', '<code>a.length</code>（无括号）', '<code>s.length()</code>', '<code>list.size()</code>'],
        ['取元素', '<code>a[i]</code>', '<code>s.charAt(i)</code>', '<code>list.get(i)</code>'],
        ['合法下标', '<code>0 … a.length - 1</code>', '<code>0 … s.length() - 1</code>', '<code>0 … list.size() - 1</code>'],
        ['修改元素', '<code>a[i] = 5;</code>', '不能改（String 不可变）', '<code>list.set(i, 5)</code>']
      ],
      caption: '考试爱在这里挖坑：数组的 length 是字段（不带括号），String 的 length() 是方法' },

    { t: 'callout', kind: 'warn', title: '两种写法的后果完全不同', html:
      '<b>推荐：</b><code>for (int i = 0; i &lt; a.length; i++)</code> —— 恰好访问 0 到 length-1。<br>' +
      '<b>常见错：</b><code>for (int i = 0; i &lt;= a.length; i++)</code> —— 最后一次访问 <code>a[a.length]</code>，越界；' +
      '<code>for (int i = 1; i &lt; a.length; i++)</code> —— 漏掉 <code>a[0]</code>，结果少一个数。' +
      '前者会崩，后者不崩但答案错——后者更危险，因为不容易发现。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 最大下标', html: '看到 <code>new int[5]</code> 能立刻说出：最大下标 4、循环条件 <code>i &lt; 5</code>。' },
      { title: '检查点 · length 无括号', html: '能分清数组 <code>a.length</code> 与字符串 <code>s.length()</code>，并说出写错会怎样（编译错误）。' }
    ] },

    /* ------------------------------------------------------------------ 三、遍历与六套路 */
    { t: 'h', text: '三、遍历与六个必须练熟的套路', id: 'ch04-3' },

    { t: 'p', html:
      '<b>遍历（traverse）</b>就是用循环把每个元素都访问一次。两种写法各有取舍：' +
      '普通 <code>for</code> 能拿到下标，可以修改元素、倒着走、跳着走；' +
      '<b>增强 for</b>（for-each）只能拿到元素的值，写起来短，但拿不到下标，也<b>改不到数组</b>——' +
      '因为循环变量只是元素值的副本。'
    },

    { t: 'code', caption: 'Traverse.java · 两种遍历方式', code:
`public class Traverse {
    public static void main(String[] args) {
        int[] a = {4, 8, 15, 16, 23, 42};

        // 普通 for：i 是下标，能读也能写
        for (int i = 0; i < a.length; i++) {
            System.out.println("a[" + i + "] = " + a[i]);
        }

        // 增强 for：v 是元素的值，拿不到下标
        int sum = 0;
        for (int v : a) {
            sum = sum + v;
        }
        System.out.println("sum = " + sum);    // 108
    }
}
` },

    { t: 'compare', left: {
      title: '普通 for',
      html: '能拿下标，能改元素（<code>a[i] = 0</code>），能倒着走、隔一个走。啰嗦一点。',
      code: 'for (int i = 0; i < a.length; i++) {\n    if (a[i] < 0) a[i] = 0;\n}'
    }, right: {
      title: '增强 for（for-each）',
      html: '只读场景最清爽。但它给的是<b>值的副本</b>，<code>v = 0</code> 改不到数组里的元素。',
      code: 'for (int v : a) {\n    System.out.println(v);\n}\n// v = 0 不会改变 a'
    } },

    { t: 'p', html:
      '选型口诀：<b>要下标、要修改、要跳步 → 普通 for；纯粹读一遍 → 增强 for</b>。' +
      '考试写「把数组里所有负数改成 0」必须用普通 for（或增强 for 里写 <code>a[i]</code>，但那还是需要下标）；' +
      '写「求和、计数、求最大值」用增强 for 更不容易写错边界。'
    },

    { t: 'p', html: '下面这个实验台可以点任意格子取值、赋值，也能故意越界看会发生什么。' },

    { t: 'lab', id: 'array' },

    { t: 'p', html:
      '掌握了遍历，数组题就只剩「套路」问题。下面六个模式覆盖了 90% 的数组题：' +
      '<b>求和 / 平均、求最大最小、计数、查找、反转、移位</b>。先背模式，再写代码，最后才调边界。'
    },

    { t: 'table',
      head: ['套路', '关键点', '典型题目'],
      rows: [
        ['求和 / 平均', '累加器从 0 开始；平均值要转 <code>double</code>', '班级总分、平均分'],
        ['求最大 / 最小', '先假设 <code>a[0]</code> 是最大 / 最小，再从下标 1 开始比', '最高分、最低温度'],
        ['计数', '满足条件就 <code>count++</code>', '数及格人数、数负数'],
        ['查找', '找到返回下标，找不到返回 <b>−1</b>', '线性查找、判断是否存在'],
        ['反转', '双指针从两头往中间换', '倒序输出、回文判断'],
        ['移位 / 旋转', '先把要跑出去的元素存起来，再按方向覆盖', '左移一位、循环右移 k 位']
      ],
      caption: '这六个套路覆盖了 90% 的数组题，先背模式，再写代码' },

    { t: 'code', caption: 'Stats.java · 点「单步」，看 sum / max / min / pass 同时变化', trace: true, code:
`public class Stats {
    public static void main(String[] args) {
        int[] scores = {72, 91, 58, 91, 100};
        int sum = 0;
        int max = scores[0];        // 先假设第一个最大
        int min = scores[0];        // 同理，先假设第一个最小
        int pass = 0;

        for (int i = 0; i < scores.length; i++) {
            sum = sum + scores[i];
            if (scores[i] > max) max = scores[i];
            if (scores[i] < min) min = scores[i];
            if (scores[i] >= 60) pass++;
        }

        System.out.println("sum  = " + sum);       // 412
        System.out.println("max  = " + max);       // 100
        System.out.println("min  = " + min);       // 58
        System.out.println("pass = " + pass);      // 4
        System.out.println("avg  = " + (double) sum / scores.length);   // 82.4
    }
}
` },

    { t: 'p', html:
      '注意两个初值细节：① <code>max</code> 和 <code>min</code> 都从 <code>scores[0]</code> 开始，' +
      '而不是从 0 开始——如果数组全是负数，从 0 开始的 max 会错误地返回 0；' +
      '② 平均值必须写 <code>(double) sum / scores.length</code>，否则先做整除再赋值，小数部分被丢掉。'
    },

    { t: 'code', caption: 'Patterns.java · 查找、反转、左移三个模板', code:
`import java.util.Arrays;

public class Patterns {
    // ① 线性查找：找到返回下标，找不到返回 -1
    static int indexOf(int[] a, int target) {
        for (int i = 0; i < a.length; i++) {
            if (a[i] == target) return i;
        }
        return -1;
    }

    // ② 原地反转：双指针从两头往中间换
    static void reverse(int[] a) {
        for (int i = 0, j = a.length - 1; i < j; i++, j--) {
            int t = a[i];
            a[i] = a[j];
            a[j] = t;
        }
    }

    // ③ 左移一位：先存首元素，再整体前移，最后补到末尾
    static void rotateLeft(int[] a) {
        if (a.length == 0) return;          // 边界：空数组不能取 a[0]
        int first = a[0];
        for (int i = 0; i < a.length - 1; i++) {
            a[i] = a[i + 1];
        }
        a[a.length - 1] = first;
    }

    public static void main(String[] args) {
        int[] a = {1, 2, 3, 4, 5};
        System.out.println(indexOf(a, 3));          // 2
        System.out.println(indexOf(a, 9));          // -1

        reverse(a);
        System.out.println(Arrays.toString(a));     // [5, 4, 3, 2, 1]

        rotateLeft(a);
        System.out.println(Arrays.toString(a));     // [4, 3, 2, 1, 5]
    }
}
` },

    { t: 'p', html:
      '这三个模板要能默写。查找的返回值习惯用 <b>−1</b> 表示「没找到」，因为 0 是合法下标，不能拿来当「无」。' +
      '反转的循环条件是 <code>i &lt; j</code> 而不是 <code>i &lt;= j</code>：元素个数是奇数时，中间那个元素不需要和自己交换；' +
      '写成 <code>&lt;=</code> 虽然结果碰巧也对，但多了一次无意义交换。' +
      '左移的关键是<b>先把要跑出去的首元素存起来</b>，否则第一轮覆盖就把它冲掉了。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 遍历选型', html: '能说出什么时候必须用普通 for、什么时候用增强 for，并知道增强 for 里改 <code>v</code> 不会改数组。' },
      { title: '检查点 · 六套路', html: '不看资料能写出求和、求最大、计数、查找、反转、左移的代码，并说出每个初值为什么这么取。' }
    ] },

    /* ------------------------------------------------------------------ 四、越界 */
    { t: 'h', text: '四、越界与边界：程序为什么跑到一半崩了', id: 'ch04-4' },

    { t: 'p', html:
      '访问不存在的下标（负数或 ≥ length）会抛 <b>ArrayIndexOutOfBoundsException</b>。' +
      '这是<b>运行时异常（runtime exception）</b>：代码能编译，跑起来才崩。' +
      'Java 检查越界是好设计——C 语言不检查，越界会读到别的变量的内存，产生极难排查的 bug。'
    },

    { t: 'code', caption: 'OutOfBounds.java · 第四行是故意越界，运行会抛异常', code:
`public class OutOfBounds {
    public static void main(String[] args) {
        int[] a = new int[3];

        System.out.println(a[0]);   // 0，合法
        System.out.println(a[2]);   // 0，最后一个合法下标
        System.out.println(a[3]);   // 越界！抛 ArrayIndexOutOfBoundsException
    }
}
` },

    { t: 'p', html:
      '控制台会显示 <code>Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3</code>，' +
      '并给出出错行号。这行信息已经把答案写出来了：「<b>用了 3，长度只有 3</b>」——' +
      '合法下标是 0 到 2，所以 3 越界。看到异常先读这句话，比盯着代码猜快得多。'
    },

    { t: 'callout', kind: 'warn', title: '防越界只有三招', html:
      '① 循环条件永远写 <code>i &lt; a.length</code>，不写死数字，也绝不写 <code>&lt;=</code>；<br>' +
      '② 手动算下标前先问一遍「最小可能是多少、最大可能是多少」（尤其是 <code>i + 1</code>、<code>length - 1</code> 之类的表达式）；<br>' +
      '③ 循环体里如果要访问 <code>a[i + 1]</code>，循环条件就要收紧成 <code>i &lt; a.length - 1</code>，否则最后一轮越界。'
    },

    { t: 'p', html:
      '除了越界，还有两个常考的边界：<b>空数组</b>和 <b>null 数组</b>。' +
      '<code>new int[0]</code> 是合法的，长度 0、没有元素，求和要返回 0、求平均要特殊处理（不能除以 0）；' +
      '而 <code>int[] a = null;</code> 表示「没有数组」，访问 <code>a.length</code> 或 <code>a[0]</code> 都会抛 ' +
      '<code>NullPointerException</code>——注意连 <code>a.length</code> 都不能用。'
    },

    { t: 'table',
      head: ['说法 / 写法', '真相', '怎么记'],
      rows: [
        ['<code>new int[0]</code> 不合法', '合法。长度 0 的数组是正常对象，<code>length</code> 为 0', '边界情况要单独处理'],
        ['<code>a.length()</code> 是数组的长度', '错。数组 <code>length</code> 是属性，<code>length()</code> 是 String 的方法', '数组不带括号'],
        ['<code>a[0]</code> 一定是第一个元素', '对，但空数组和 null 数组会先抛异常', '先判断再访问'],
        ['<code>int[] b = a;</code> 复制了数组', '错。只复制了引用，两个变量指向同一数组', '要复制用 <code>Arrays.copyOf</code>'],
        ['<code>a.equals(b)</code> 比较数组内容', '错。数组没有重写 equals，等价于 <code>a == b</code>', '用 <code>Arrays.equals</code>'],
        ['二维数组 <code>grid.length</code> 是列数', '错。是行数；<code>grid[0].length</code> 才是列数', '外层行、内层列']
      ],
      caption: '这六条覆盖了卷面上 80% 的数组判断题' },

    { t: 'keypoint', items: [
      { title: '检查点 · 越界信息', html: '能读懂 <code>Index 3 out of bounds for length 3</code>，知道去循环边界与 <code>i + 1</code> 处找问题。' },
      { title: '检查点 · 两个边界', html: '能说出 <code>new int[0]</code> 合法、<code>null</code> 数组连 length 都不能访问。' }
    ] },

    /* ------------------------------------------------------------------ 五、二维数组 */
    { t: 'h', text: '五、二维数组：数组的数组', id: 'ch04-5' },

    { t: 'p', html:
      '<code>int[][] grid = new int[3][4]</code> 可以理解成「3 行、每行 4 个格子」，' +
      '但更准确的说法是：它是<b>一个长度为 3 的数组，每个元素又是一个长度为 4 的 int 数组</b>。' +
      '所以 <code>grid.length</code> 是行数 3，<code>grid[0].length</code> 是第一行的列数 4。' +
      '因为本质是「数组的数组」，每行长度其实可以不同——这就是<b>锯齿数组（jagged array）</b>。'
    },

    { t: 'code', caption: 'GridAndJagged.java · 矩形创建、行列遍历、锯齿数组', code:
`import java.util.Arrays;

public class GridAndJagged {
    public static void main(String[] args) {
        int[][] grid = new int[2][3];       // 2 行 3 列，默认全 0
        grid[0][0] = 1;
        grid[1][2] = 9;

        for (int r = 0; r < grid.length; r++) {            // 行数
            for (int c = 0; c < grid[r].length; c++) {     // 第 r 行的列数
                System.out.print(grid[r][c] + " ");
            }
            System.out.println();
        }
        System.out.println(grid.length + " " + grid[0].length);   // 2 3

        // 锯齿数组：先只定行数，再逐行 new 出不同长度
        int[][] jagged = new int[3][];
        for (int r = 0; r < jagged.length; r++) {
            jagged[r] = new int[r + 1];
        }
        jagged[2][2] = 7;
        System.out.println(Arrays.deepToString(jagged));   // [[0], [0, 0], [0, 0, 7]]
    }
}
` },

    { t: 'p', html:
      '遍历二维数组要用<b>两层循环</b>：外层走行 <code>r &lt; grid.length</code>，内层走列 <code>c &lt; grid[r].length</code>。' +
      '注意内层一定用 <code>grid[r].length</code>，不能想当然用 <code>grid[0].length</code>——遇到锯齿数组时后者会越界或漏元素。' +
      '<code>new int[3][]</code> 只创建了 3 个「空槽位」，每个槽位是 <code>null</code>，必须再逐行 <code>new int[n]</code>，' +
      '否则访问 <code>jagged[0][0]</code> 会抛 NullPointerException。'
    },

    { t: 'table',
      head: ['表达式', '含义', '矩形 2×3 时的值'],
      rows: [
        ['<code>grid.length</code>', '行数（外层数组长度）', '2'],
        ['<code>grid[0].length</code>', '第 0 行的列数', '3'],
        ['<code>grid[r].length</code>', '第 r 行的列数（锯齿时可不同）', '3'],
        ['<code>grid[r][c]</code>', '第 r 行第 c 列的元素', '0'],
        ['<code>grid[r]</code>', '第 r 行这个一维数组的引用', '<code>int[3]</code> 的地址']
      ],
      caption: '二维数组是「数组的数组」：外层数组的每个元素是一个 int[] 引用' },

    { t: 'callout', kind: 'warn', title: '行数列数别搞混，对角线下标要会推', html:
      '<code>grid.length</code> 是<b>行数</b>，<code>grid[0].length</code> 是<b>列数</b>。写外层循环用 <code>grid.length</code>、' +
      '内层用 <code>grid[r].length</code>；反过来写虽然能编译，但会越界或漏掉元素。<br>' +
      '对角线公式（n×n 方阵）：<b>主对角线</b> <code>r == c</code>（从左上到右下）；' +
      '<b>副对角线</b> <code>r + c == n - 1</code>（从右上到左下）。考试常把副对角线条件写成 <code>r == c</code>，' +
      '这时程序不报错、但算出来的还是主对角线——正是 Mock A Q8 挖的坑。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 两个 length', html: '能说出二维数组 <code>grid.length</code> 与 <code>grid[0].length</code> 分别是什么，并写出行列遍历。' },
      { title: '检查点 · 锯齿与对角线', html: '能解释 <code>new int[3][]</code> 为什么每行还要 new，能写出主/副对角线的条件。' }
    ] },

    /* ------------------------------------------------------------------ 六、引用 */
    { t: 'h', text: '六、数组是对象：引用、别名与传参', id: 'ch04-6' },

    { t: 'p', html:
      '数组不是基本类型，它是<b>对象（object）</b>，活在堆（heap）上。数组变量本身只存一个<b>引用（reference）</b>，' +
      '相当于门牌号。所以 <code>int[] b = a;</code> 不会复制数组，只是让 b 也指向同一块内存——这叫<b>别名（alias）</b>，' +
      '改 b 就是改 a。<code>==</code> 比较的是两个变量是否指向同一个对象，而不是内容是否相同。'
    },

    { t: 'code', caption: 'Alias.java · 点「单步」，在内存面板里看两个箭头指向同一块内存', trace: true, code:
`import java.util.Arrays;

public class Alias {
    public static void main(String[] args) {
        int[] a = {1, 2, 3};
        int[] b = a;                 // 别名：两个变量存同一个门牌号
        b[0] = 99;
        System.out.println(a[0]);    // 99：改 b 就是改 a

        int[] c = new int[a.length]; // 真复制：新建一块内存，逐个搬
        for (int i = 0; i < a.length; i++) {
            c[i] = a[i];
        }
        c[0] = -1;
        System.out.println(a[0]);                   // 99：a 不受影响
        System.out.println(Arrays.toString(a));     // [99, 2, 3]
        System.out.println(Arrays.toString(c));     // [-1, 2, 3]
    }
}
` },

    { t: 'svg', maxW: 640, html:
'<svg viewBox="0 0 640 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="数组引用与别名">\n' +
'  <defs>\n' +
'    <marker id="ch04-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">\n' +
'      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent2)"/>\n' +
'    </marker>\n' +
'  </defs>\n' +
'  <rect x="16" y="16" width="190" height="196" rx="12" fill="var(--surface2)" stroke="var(--line2)"/>\n' +
'  <text x="32" y="42" font-size="13" font-weight="700" fill="var(--accent)">栈 Stack</text>\n' +
'  <text x="32" y="78" font-size="12" fill="var(--text2)">int[] a</text>\n' +
'  <text x="32" y="112" font-size="12" fill="var(--text2)">int[] b</text>\n' +
'  <text x="32" y="146" font-size="12" fill="var(--text2)">int[] c</text>\n' +
'  <text x="32" y="186" font-size="11" fill="var(--text3)">b = a 只复制箭头</text>\n' +
'\n' +
'  <rect x="260" y="16" width="360" height="196" rx="12" fill="var(--surface2)" stroke="var(--line2)"/>\n' +
'  <text x="276" y="42" font-size="13" font-weight="700" fill="var(--accent2)">堆 Heap</text>\n' +
'  <rect x="278" y="60" width="200" height="46" rx="6" fill="var(--bg2)" stroke="var(--accent2)"/>\n' +
'  <text x="292" y="80" font-size="11" fill="var(--accent2)">#1 int[3]</text>\n' +
'  <text x="292" y="98" font-size="12" fill="var(--text)">99   2   3</text>\n' +
'  <rect x="278" y="126" width="200" height="46" rx="6" fill="var(--bg2)" stroke="var(--ok)"/>\n' +
'  <text x="292" y="146" font-size="11" fill="var(--ok)">#2 int[3]</text>\n' +
'  <text x="292" y="164" font-size="12" fill="var(--text)">-1   2   3</text>\n' +
'  <line x1="118" y1="74" x2="274" y2="80" stroke="var(--accent2)" stroke-width="1.6" marker-end="url(#ch04-arw)"/>\n' +
'  <line x1="118" y1="108" x2="274" y2="90" stroke="var(--accent2)" stroke-width="1.6" marker-end="url(#ch04-arw)"/>\n' +
'  <line x1="118" y1="142" x2="274" y2="150" stroke="var(--ok)" stroke-width="1.6" marker-end="url(#ch04-arw)"/>\n' +
'  <text x="276" y="196" font-size="11" fill="var(--text3)">a、b 指向 #1；c 是 new 出来的 #2，改 c 不影响 a</text>\n' +
'</svg>',
      caption: '别名 vs 复制：a、b 共享 #1；c 指向新数组 #2' },

    { t: 'p', html:
      '别名不一定是 bug。方法收到数组参数时，传进来的就是<b>引用的副本</b>：形参和实参指向同一个数组。' +
      '所以方法里通过形参改元素，调用者看得见；但如果方法里让形参<b>重新指向一个新数组</b>，调用者的变量不受影响。' +
      '这就是「Java 只有值传递」在两个场景下的两种表现：<b>能改对象内容，不能换掉对象</b>。'
    },

    { t: 'compare', left: {
      title: '<code>int[] b = a;</code> 别名',
      html: '两个变量指向<b>同一个</b>数组。改任意一个，另一个立刻看到变化。这是「共享」，不是「备份」。',
      code: 'int[] a = {1, 2, 3};\nint[] b = a;\nb[0] = 99;\n// a[0] 也是 99'
    }, right: {
      title: '<code>Arrays.copyOf(a, n)</code> 复制',
      html: '新建一块内存，把值逐个复制过去。之后两者<b>互不影响</b>，代价是多占一份内存。',
      code: 'int[] a = {1, 2, 3};\nint[] b = Arrays.copyOf(a, a.length);\nb[0] = 99;\n// a[0] 仍是 1'
    } },

    { t: 'code', caption: 'PassArray.java · 三种方法：改内容 / 换形参 / 返回新数组', code:
`import java.util.Arrays;

public class PassArray {
    static void fill(int[] arr) {            // 改对象内容：调用者看得见
        for (int i = 0; i < arr.length; i++) {
            arr[i] = arr[i] * 2;
        }
    }

    static void reassign(int[] arr) {        // 改形参箭头：调用者看不见
        arr = new int[]{7, 7, 7};
        arr[0] = 0;
    }

    static int[] doubled(int[] arr) {        // 返回新数组：最安全
        int[] result = new int[arr.length];
        for (int i = 0; i < arr.length; i++) {
            result[i] = arr[i] * 2;
        }
        return result;
    }

    public static void main(String[] args) {
        int[] data = {1, 2, 3};

        fill(data);
        System.out.println(Arrays.toString(data));   // [2, 4, 6]

        reassign(data);
        System.out.println(Arrays.toString(data));   // [2, 4, 6]，没被换成 {0, 7, 7}

        int[] copy = doubled(data);
        System.out.println(Arrays.toString(data));   // [2, 4, 6]
        System.out.println(Arrays.toString(copy));   // [4, 8, 12]
        System.out.println(data == copy);            // false
    }
}
` },

    { t: 'callout', kind: 'tip', title: '为什么数组要设计成引用', html:
      '如果传数组时按值复制，把 100 万个元素传进一个方法就要复制 100 万个，慢得离谱；而且方法没法「原地修改」你的数组。' +
      '用引用传递，传的只是一个门牌号，代价固定、还能原地改。代价是你要小心别名：' +
      '<b>任何「看起来像复制」的赋值，都要停下来想一想</b>。第 09 章会把栈、堆、值传递与深浅拷贝一次讲透。'
    },

    { t: 'p', html: '下面这个实验台预置了几个内存场景：基本类型赋值、数组别名、复制对比着看，适合配合本节的单步面板使用。' },

    { t: 'lab', id: 'memory' },

    { t: 'keypoint', items: [
      { title: '检查点 · 别名', html: '能解释 <code>int[] b = a</code> 之后改 b 为什么影响 a，并说出两种真复制写法。' },
      { title: '检查点 · 传参', html: '能判断一个方法会不会改到调用者的数组：看它「改内容是改箭头」。' }
    ] },

    /* ------------------------------------------------------------------ 七、Arrays 工具类 */
    { t: 'h', text: '七、Arrays 工具类：打印、排序、复制、比较', id: 'ch04-7' },

    { t: 'p', html:
      '数组本身能用的方法很少（只有一个 <code>length</code>），日常操作都靠 <code>java.util.Arrays</code> 这个工具类。' +
      '它全是 <b>static 方法</b>，直接 <code>Arrays.方法名(...)</code> 调用，不需要 new 对象。' +
      '考试与作业里最常用的六个：<code>toString</code>、<code>sort</code>、<code>copyOf</code>、<code>fill</code>、' +
      '<code>equals</code>、<code>deepToString</code>。'
    },

    { t: 'code', caption: 'ArraysTools.java · 六个最常用方法', code:
`import java.util.Arrays;

public class ArraysTools {
    public static void main(String[] args) {
        int[] a = {3, 1, 4, 1, 5};

        System.out.println(Arrays.toString(a));       // [3, 1, 4, 1, 5]

        int[] sorted = Arrays.copyOf(a, a.length);    // 先复制，避免改原数组
        Arrays.sort(sorted);
        System.out.println(Arrays.toString(sorted));  // [1, 1, 3, 4, 5]
        System.out.println(Arrays.toString(a));       // [3, 1, 4, 1, 5]

        int[] bigger = Arrays.copyOf(a, 8);           // 变长复制，多出来的补 0
        System.out.println(Arrays.toString(bigger));  // [3, 1, 4, 1, 5, 0, 0, 0]

        int[] same = {3, 1, 4, 1, 5};
        System.out.println(Arrays.equals(a, same));   // true：逐元素比较

        int[] filled = new int[4];
        Arrays.fill(filled, 7);
        System.out.println(Arrays.toString(filled));  // [7, 7, 7, 7]
    }
}
` },

    { t: 'table',
      head: ['方法', '作用', '会不会改原数组'],
      rows: [
        ['<code>Arrays.toString(a)</code>', '把一维数组变成 <code>[1, 2, 3]</code> 形式的字符串', '不会'],
        ['<code>Arrays.deepToString(m)</code>', '把二维数组变成 <code>[[1, 2], [3, 4]]</code>', '不会'],
        ['<code>Arrays.sort(a)</code>', '原地升序排序（第 11 章讲原理）', '<b>会</b>'],
        ['<code>Arrays.copyOf(a, n)</code>', '复制成长度 n 的新数组，多出的补默认值、截断多余', '不会'],
        ['<code>Arrays.fill(a, v)</code>', '把每个元素都设成 v', '<b>会</b>'],
        ['<code>Arrays.equals(a, b)</code>', '逐元素比较两个一维数组内容', '不会']
      ],
      caption: '记住哪些方法会改原数组，是避免「排序把原始数据也改了」这类 bug 的关键' },

    { t: 'callout', kind: 'warn', title: '两个必须记住的坑', html:
      '① <b><code>Arrays.copyOf</code> 对二维/对象数组只是浅拷贝</b>：它复制的是外层数组里的引用，行数组仍然共享；' +
      '要真正独立的二维副本，必须逐行再 <code>copyOf</code> 一次（第 09 章详讲）。<br>' +
      '② <b>直接 <code>println(a)</code> 打印的是地址</b>（形如 <code>[I@1a2b3c</code>），不是内容。' +
      '想看内容必须 <code>Arrays.toString(a)</code>，二维必须 <code>Arrays.deepToString</code>。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 六个方法', html: '能说出 toString / sort / copyOf / fill / equals 各自做什么、哪些会改原数组。' },
      { title: '检查点 · 打印与比较', html: '知道打印数组要 <code>Arrays.toString</code>、比较内容要 <code>Arrays.equals</code>。' }
    ] },

    /* ------------------------------------------------------------------ 八、调试实录 */
    { t: 'h', text: '八、调试实录：三个真实 bug', id: 'ch04-8' },

    { t: 'p', html:
      '数组 bug 分两类：一类会抛异常（越界、空指针），看报错行就能定位；另一类<b>不报错、结果就是不对</b>（边界差一、别名、初值错），' +
      '这类更危险。调试它们有一套固定流程，不要凭感觉改代码：' +
      '<b>① 在纸上画下标轴</b>（0 到 length-1，标出循环变量每一步的值）；' +
      '<b>② 数边界</b>（第一次和最后一次执行时 i 是多少，访问的下标是否在范围内）；' +
      '<b>③ 用单步或打印验证假设</b>，一次只改一处。'
    },

    { t: 'steps', items: [
      { title: '先分类症状', html: '抛异常 → 看异常类型和行号；不报错但结果错 → 画下标轴，检查第一次/最后一次循环。' },
      { title: '画下标轴而不是读代码', html: '写一行 0 1 2 … length-1，把每轮 i 的值标上去，多走的一步、少走的一步会立刻现形。' },
      { title: '只改一处再验证', html: '一次只改一个假设（<code>&lt;=</code> 改 <code>&lt;</code>、加复制、换初值），跑一遍确认，别一次改三处。' }
    ] },

    { t: 'p', html:
      '还有一个提效技巧：<b>把 bug 缩成最小复现（minimal reproduction）</b>。如果 200 行的程序结果不对，' +
      '先删到只剩「造数组、调方法、打印结果」三块；能复现再逐步加回去。数组 bug 在最小程序里往往一眼就能看出来，' +
      '因为剩下的每一行都必须为它负责。'
    },

    { t: 'h', lvl: 3, text: '案例 1：循环写成 &lt;=，最后一轮越界' },

    { t: 'p', html:
      '需求是「求三个成绩的和」。代码看起来很正常，运行却在最后一次循环崩掉：' +
      '数组长度是 3，合法下标 0~2，而 <code>i &lt;= scores.length</code> 让 i 走到 3，于是访问 <code>scores[3]</code>。' +
      '这是数组题最高频的错误，没有之一。'
    },

    { t: 'code', caption: 'DebugCase1.java · 故意越界：循环条件写成 &lt;= 就会访问 scores[3]', code:
`public class DebugCase1 {
    public static void main(String[] args) {
        int[] scores = {72, 91, 58};
        int sum = 0;

        for (int i = 0; i <= scores.length; i++) {   // BUG：<= 多走一步
            sum = sum + scores[i];
        }

        System.out.println("sum = " + sum);
    }
}
` },

    { t: 'p', html:
      '定位过程：① 报错信息是 <code>Index 3 out of bounds for length 3</code>，说明某次循环访问了下标 3；' +
      '② 画下标轴：i 依次取 0、1、2、3，而合法值只到 2，问题锁定在循环条件；' +
      '③ 把 <code>&lt;=</code> 改成 <code>&lt;</code>，输出 sum = 221。<br>' +
      '这一类 bug 的检查口诀：<b>问「最后一个该执行的 i 是多少」，再决定用 &lt; 还是 &lt;=</b>。' +
      '如果循环体里出现了 <code>a[i + 1]</code>，条件还要再收紧成 <code>i &lt; a.length - 1</code>。'
    },

    { t: 'h', lvl: 3, text: '案例 2：以为复制，其实只是别名' },

    { t: 'p', html:
      '第二个 bug 不抛异常，但会把「原始数据」弄脏。老师想把成绩复制一份再加分，' +
      '写了 <code>int[] curved = scores;</code>，结果循环加 5 分时改的是同一块内存，' +
      '原始成绩也被加 5 分；后面再用原始成绩算及格率就全错了。'
    },

    { t: 'code', caption: 'DebugCase2.java · 不报错但结果错：scores 和 curved 是同一个数组', code:
`import java.util.Arrays;

public class DebugCase2 {
    public static void main(String[] args) {
        int[] scores = {72, 91, 58};
        int[] curved = scores;              // BUG：以为复制，其实是别名

        for (int i = 0; i < curved.length; i++) {
            curved[i] = curved[i] + 5;
        }

        System.out.println("original = " + Arrays.toString(scores));  // [77, 96, 63]
        System.out.println("curved   = " + Arrays.toString(curved));  // [77, 96, 63]
        System.out.println(scores == curved);                          // true
    }
}
` },

    { t: 'p', html:
      '定位过程：① 打印 <code>scores == curved</code> 得到 <code>true</code>，说明两个变量指向同一对象，' +
      '「复制」从第一行就不存在；② 修复：<code>int[] curved = Arrays.copyOf(scores, scores.length);</code>，' +
      '或手写循环逐元素复制；③ 改完再打印，original 仍是 [72, 91, 58]。<br>' +
      '判断标准只有一句：<b>你要的是「共享」还是「独立」？</b>共享就保留别名（省内存，方法间传数据常用），' +
      '独立就必须复制。凡是「先备份、再修改」的代码，备份那一行必须用 <code>copyOf</code> 或循环复制。'
    },

    { t: 'h', lvl: 3, text: '案例 3：空数组与初值，两个隐藏的边界' },

    { t: 'p', html:
      '第三个 bug 有两个隐藏边界。① 求平均时没有处理<b>空数组</b>：长度 0 时 <code>sum / a.length</code> 会抛 ' +
      '<code>ArithmeticException: / by zero</code>（整数除零），而且即使长度不为 0，' +
      '<code>sum / a.length</code> 也是整数除法，得不到小数。' +
      '② 求最大时把初值写成 0：数组全是负数时，循环里没有任何元素大于 0，结果会错误地返回 0。'
    },

    { t: 'code', caption: 'DebugCase3.java · 空数组除零 + 全负数时最大值为 0', code:
`public class DebugCase3 {
    static double average(int[] a) {
        int sum = 0;
        for (int i = 0; i < a.length; i++) sum += a[i];
        return sum / a.length;          // BUG 1：长度 0 时除零；且这是整数除法
    }

    static int max(int[] a) {
        int m = 0;                      // BUG 2：全负数时答案会是 0
        for (int v : a) {
            if (v > m) m = v;
        }
        return m;
    }

    public static void main(String[] args) {
        int[] allNegative = {-5, -2, -9};
        System.out.println(max(allNegative));            // 0，不是 -2
        System.out.println(average(new int[]{1, 2}));    // 1.0，不是 1.5
        System.out.println(average(new int[]{}));        // 抛出 ArithmeticException
    }
}
` },

    { t: 'p', html:
      '修复两处：① <code>average</code> 开头先判 <code>if (a.length == 0) return 0.0;</code>，并且返回值写成 ' +
      '<code>(double) sum / a.length</code>；② <code>max</code> 先把初值设成 <code>a[0]</code>（或 <code>Integer.MIN_VALUE</code>），' +
      '循环从下标 1 开始，同时对空数组返回一个约定值（如 <code>-1</code> 或抛 <code>IllegalArgumentException</code>）。<br>' +
      '这个案例的启示：<b>写方法前先问三个边界</b>——空数组怎么办？全是负数怎么办？长度为 1 呢？' +
      '把这三个问题写进注释，考试与作业都少扣一半分。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 三个 bug', html: '能说出每个 bug 属于「越界 / 别名 / 边界」哪一类，并给出对应修法。' },
      { title: '检查点 · 流程', html: '遇到「不报错但结果错」的数组题，会先画下标轴、再问空数组与全负数边界。' }
    ] },

    /* ------------------------------------------------------------------ 完整案例 A */
    { t: 'h', text: '完整案例 A：学生成绩统计与排序', id: 'ch04-9' },

    { t: 'p', html:
      '下面这段程序把本章所有概念用在一处：<code>average</code> 只读数组、<code>maxIndex</code> 返回下标、' +
      '<code>histogram</code> 新建并返回计数数组、<code>sortedCopy</code> 先用 <code>copyOf</code> 复制再排序（不改调用者）。' +
      '读之前先预测：<code>scores</code> 会不会被排序影响？<code>histogram</code> 返回的数组长什么样？空数组调用会怎样？'
    },

    { t: 'code', caption: 'GradeStats.java · 近 75 行完整程序：统计 + 直方图 + 排序副本', code:
`import java.util.Arrays;

public class GradeStats {
    // 平均分：空数组返回 0.0（先处理边界，再写主逻辑）
    static double average(int[] scores) {
        if (scores.length == 0) return 0.0;
        int sum = 0;
        for (int i = 0; i < scores.length; i++) {
            sum += scores[i];
        }
        return (double) sum / scores.length;
    }

    // 最高分的下标：空数组返回 -1，初值取 a[0] 以兼容全负数
    static int maxIndex(int[] scores) {
        if (scores.length == 0) return -1;
        int best = 0;
        for (int i = 1; i < scores.length; i++) {
            if (scores[i] > scores[best]) best = i;
        }
        return best;
    }

    // 分数段人数：<60, 60-69, 70-79, 80-89, 90-100 共 5 档
    static int[] histogram(int[] scores) {
        int[] buckets = new int[5];
        for (int i = 0; i < scores.length; i++) {
            int s = scores[i];
            if (s < 60) buckets[0]++;
            else if (s < 70) buckets[1]++;
            else if (s < 80) buckets[2]++;
            else if (s < 90) buckets[3]++;
            else buckets[4]++;
        }
        return buckets;
    }

    // 升序副本：先复制，再做选择排序，原数组保持不变
    static int[] sortedCopy(int[] scores) {
        int[] copy = Arrays.copyOf(scores, scores.length);
        for (int i = 0; i < copy.length - 1; i++) {
            int min = i;
            for (int j = i + 1; j < copy.length; j++) {
                if (copy[j] < copy[min]) min = j;
            }
            int t = copy[i];
            copy[i] = copy[min];
            copy[min] = t;
        }
        return copy;
    }

    public static void main(String[] args) {
        int[] scores = {72, 91, 58, 91, 100, 45};
        int[] sorted = sortedCopy(scores);

        System.out.println("scores    = " + Arrays.toString(scores));
        System.out.println("sorted    = " + Arrays.toString(sorted));
        System.out.printf("average   = %.2f%n", average(scores));

        int best = maxIndex(scores);
        System.out.println("best      = " + scores[best] + " at index " + best);
        System.out.println("histogram = " + Arrays.toString(histogram(scores)));

        System.out.println("empty avg = " + average(new int[0]));
        System.out.println("empty idx = " + maxIndex(new int[0]));
        System.out.println("same ref? = " + (scores == sorted));
    }
}
` },

    { t: 'table',
      head: ['方法', '会改调用者的数组吗', '返回值', '为什么'],
      rows: [
        ['<code>average</code>', '不会', '平均分 <code>double</code>', '只读元素，没有写回'],
        ['<code>maxIndex</code>', '不会', '下标或 −1', '只比较，不交换'],
        ['<code>histogram</code>', '不会', '新计数数组', '在新建的 <code>buckets</code> 上累加'],
        ['<code>sortedCopy</code>', '不会', '排好序的新数组', '先 <code>copyOf</code>，排序发生在副本上']
      ],
      caption: '同一个「传数组」动作，四种方法三种语义——区别只在「有没有写回共享对象」' },

    { t: 'p', html:
      '逐段看几个关键点。① <code>sortedCopy</code> 第一行就复制，所以 <code>scores</code> 顺序不变；' +
      '如果写成 <code>int[] copy = scores;</code>，排序会把原始数据也打乱（案例 2 的坑）。' +
      '② <code>histogram</code> 返回的是<b>新数组</b>：方法里 <code>new int[5]</code>，长度固定，五个桶分别累加；' +
      '这种「返回数组」的写法比让调用者传数组进来更安全。③ <code>average</code> 先判空，再算；' +
      '<code>(double) sum</code> 保证做小数除法。④ <code>maxIndex</code> 返回的是<b>下标</b>不是数值——' +
      '好处是调用者还能顺便拿到分数本身，这也是考试常考的「返回下标」设计。<br>' +
      '把这段代码当模板：换掉数据来源（<code>Scanner</code> 读入、命令行参数）、换掉统计口径，就是一道完整作业题。'
    },

    /* ------------------------------------------------------------------ 完整案例 B */
    { t: 'h', text: '完整案例 B：矩阵转置与对角线', id: 'ch04-10' },

    { t: 'p', html:
      '二维数组最常考的三件事：<b>转置</b>（行列互换）、<b>对角线求和</b>、<b>遍历时按行/按列</b>。' +
      '下面这段程序把它们放在一起，并演示「二维数组也是引用」：<code>addOne(m)</code> 会改到调用者的矩阵。' +
      '注意转置必须<b>新建</b>一个「列数 × 行数」的矩阵，不能原地改一个非方阵。'
    },

    { t: 'code', caption: 'MatrixTools.java · 转置、主/副对角线和、原地修改', code:
`import java.util.Arrays;

public class MatrixTools {
    // 转置：新矩阵的行数 = 原矩阵的列数
    static int[][] transpose(int[][] m) {
        int rows = m.length;
        int cols = m[0].length;
        int[][] t = new int[cols][rows];
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                t[c][r] = m[r][c];
            }
        }
        return t;
    }

    // 主对角线：r == c
    static int mainDiagonal(int[][] m) {
        int sum = 0;
        for (int i = 0; i < m.length; i++) {
            if (i < m[i].length) sum += m[i][i];
        }
        return sum;
    }

    // 副对角线：r + c == 列数 - 1
    static int antiDiagonal(int[][] m) {
        int sum = 0;
        int cols = m[0].length;
        for (int r = 0; r < m.length; r++) {
            int c = cols - 1 - r;
            if (c >= 0 && c < m[r].length) sum += m[r][c];
        }
        return sum;
    }

    // 原地每个元素 +1：改的是调用者的矩阵
    static void addOne(int[][] m) {
        for (int r = 0; r < m.length; r++) {
            for (int c = 0; c < m[r].length; c++) {
                m[r][c] = m[r][c] + 1;
            }
        }
    }

    public static void main(String[] args) {
        int[][] m = {
            {1, 2, 3},
            {4, 5, 6}
        };
        int[][] t = transpose(m);
        System.out.println("m         = " + Arrays.deepToString(m));
        System.out.println("transpose = " + Arrays.deepToString(t));
        System.out.println("size      = " + t.length + " x " + t[0].length);

        int[][] square = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 10}
        };
        System.out.println("main diag = " + mainDiagonal(square));   // 16
        System.out.println("anti diag = " + antiDiagonal(square));   // 15

        addOne(m);
        System.out.println("m changed = " + Arrays.deepToString(m));  // 原矩阵被改
    }
}
` },

    { t: 'p', html:
      '三个要点。① <b>转置只能新建矩阵</b>：2×3 转置后是 3×2，形状变了，没法塞回原来的 2×3；' +
      '即使方阵可以原地转置，也要小心交换顺序（只遍历上三角，否则会换回去）。' +
      '② 副对角线的条件是 <code>r + c == 列数 - 1</code>，代码里写成 <code>c = cols - 1 - r</code>，' +
      '再检查 <code>c</code> 是否在 <code>0 … m[r].length - 1</code> 内，这样矩形（非方阵）也不会越界。' +
      '③ <code>addOne(m)</code> 直接改调用者的矩阵——因为二维数组参数同样传的是引用的副本；' +
      '如果你希望保留原矩阵，就和案例 A 一样先 <code>copyOf</code>（注意二维要逐行复制）。<br>' +
      '这段程序直接对应 Mock A Q8：给一个 3×3 矩阵，先问主对角线和，再问副对角线和；' +
      '如果副对角线条件写错，程序不会报错，只会把主对角线又算一遍——所以写完一定要用一组手算结果验证。'
    },

    { t: 'p', html: '最后试试查找实验台：线性查找和二分查找在同一份数据上，比较次数差多少。' },

    { t: 'lab', id: 'search' },

    /* ------------------------------------------------------------------ 即时练习 */
    { t: 'h', text: '教材对照：§1.4 数组与四个经典程序', id: 'ch04-11' },

    { t: 'p', html:
      '教材 §1.4 的开头只有一句话："数组是一组同一类型的值，每个值有一个下标。" 接着它不急着讲语法，' +
      '而是用四个程序把数组的用途摊开：<b>洗牌</b>（随机排列）、<b>抽样</b>（从 n 个里随机取 m 个）、' +
      '<b>优惠券收集</b>（集齐 n 种要抽多少次）、<b>素数筛</b>（用布尔数组批量标记）。本站 ch04 更偏语法与套路，' +
      '这四个程序正好补齐"数组能做什么"的直觉。'
    },

    { t: 'code', caption: '教材 Program 1.4.3 素数筛：原书跑 25 输出 9（25 以内有 9 个素数）；这里预置 25', args: ['25'], code:
`public class PrimeSieve {
    public static void main(String[] args) {
        int n = Integer.parseInt(args[0]);
        boolean[] isPrime = new boolean[n + 1];
        for (int i = 2; i <= n; i++)
            isPrime[i] = true;
        for (int i = 2; i <= n / i; i++)
            if (isPrime[i])
                for (int j = i; j <= n / i; j++)
                    isPrime[i * j] = false;
        int primes = 0;
        for (int i = 2; i <= n; i++)
            if (isPrime[i]) primes++;
        System.out.println(primes);
    }
}
` },

    { t: 'table',
      head: ['教材主题', '本站小节', '这个例子里真正的数组技巧'],
      rows: [
        ['洗牌（shuffle）', '（本站未单列）', '从第 i 位与 i..n−1 中随机一位交换，保证每种排列等概率'],
        ['抽样（sample）', '（本站未单列）', '先洗牌再取前 m 个；或每个元素以 m/n 的概率入选'],
        ['优惠券收集', '（本站未单列）', '<code>boolean[]</code> 标记"是否见过"，用计数变量算抽了多少次'],
        ['素数筛', '（本站未单列）', '双层循环标记合数；外层只需到 <code>i &lt;= n / i</code>'],
        ['二维数组', '五、二维数组', '"数组的数组"：先取行，再取列，矩阵转置就是行列互换']
      ],
      caption: '教材这四个程序有一个共同点：数组不是"存一堆数"，而是"用下标当状态"——见过的标记为 true，没见过的保持默认' },

    { t: 'p', html:
      '教材在洗牌这段讲了一个容易被忽略的点：<b>"每次从整个数组里随机选两个位置交换"并不均匀</b>。' +
      '它给出的正确写法是 <code>int r = i + (int) (Math.random() * (n - i));</code>，' +
      '让第 i 位只与"它自己及后面"的位置交换。这样第 i 位一旦定下来就不再动，所有排列出现的概率相同；' +
      '如果每轮都从 0..n−1 里选，同一个排列会被多条交换路径生成，概率就不等了。' +
      '这个算法叫 Fisher–Yates 洗牌，考试问"怎么打乱一个数组"时写它就不会错。<br><br>教材还顺手补了数组的三条"冷知识"，本站讲得比较散，这里集中对一遍：' +
      '① <b>默认值</b>——<code>new int[n]</code> 全是 0，<code>new double[n]</code> 全是 0.0，' +
      '<code>new boolean[n]</code> 全是 false，对象数组全是 null；' +
      '② <b>长度不可变</b>——创建后 <code>a.length</code> 固定，想"变长"只能新建一个再复制（本站 ch04 的 Arrays.copyOf 就是干这个的）；' +
      '③ <b>越界是运行时错误</b>——访问 <code>a[n]</code> 时抛 <code>ArrayIndexOutOfBoundsException</code>，' +
      '编译期不检查，所以"循环条件写成 &lt;= "这类 bug 往往跑到最后一轮才崩。<br><br>最后一个值得记住的结论：教材用 <code>CouponCollector</code> 模拟"集齐 n 种优惠券要抽多少次"，结果是期望约 <b>n·H<sub>n</sub></b>' +
      '（H<sub>n</sub> 是调和数，约等于 ln n + 0.577）。n = 1000 时大约 6500 次，' +
      'n = 1000000 时约 1278 万次——比直觉大得多。它想说明的不是"随机很慢"，而是' +
      '"随机过程的代价要用数学算，不能靠感觉"。这个例子在 ch13 讲复杂度时会再出现一次。'
    },

    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch04-q1' },
    { t: 'quiz', qid: 'ch04-q2' },
    { t: 'quiz', qid: 'ch04-q3' },

    /* ------------------------------------------------------------------ 考试映射 */
    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      '数组是所有读程序题的<b>载体</b>：期中 A 卷 100 分里有 60 分以上的题都围绕数组。五种考法：<br>' +
      '① <b>读代码写输出</b>：Mock A Q2 把数组左移/右移一位，问最后输出什么——本质是考「先存要跑出去的元素」；' +
      'B 卷 Q3 直接问「数组长度、最后一个元素下标、length 是不是方法」。<br>' +
      '② <b>边界纠错</b>：Mock A Q2 让你指出右移代码错在哪、怎么改；B 卷 Q5 填空 <code>arr.length - 1</code> 与 <code>&gt;=</code>。' +
      '改的是「循环边界」，错法永远只有那几种：<code>&lt;=</code>、从 1 开始、少走一圈、右移方向反。' +
      '③ <b>二维数组</b>：Mock A Q8 给 3×3 矩阵，问主对角线、总和、副对角线，并找副对角线条件的 bug。' +
      '④ <b>写方法</b>：求和、平均、找最大、数出现次数、反转、判断回文。' +
      '⑤ <b>概念题</b>：<code>int[] b = a</code>、<code>Arrays.copyOf</code> 深还是浅、<code>a.length</code> 与 <code>equals</code>。<br>' +
      '<b>做读代码题的标准动作</b>：先在草稿纸上画一条下标轴 0..n-1，把循环变量每轮的值标上去，' +
      '标注「第一次执行」「最后一次执行」时刻的数组状态，再写输出。先画下标轴、再数边界，比在脑子里空想可靠十倍；' +
      '写完用一个小例子（3 个元素、含重复值）代进去验算一遍。'
    },

    { t: 'keypoint', items: [
      { title: '创建三件事', html: '声明（类型 + 名字）、创建（<code>new</code> 分配）、初始化（放值）；<code>new</code> 出来的元素有默认值。' },
      { title: '下标与 length', html: '从 <b>0</b> 开始，最大下标 = <code>length - 1</code>；数组用 <code>a.length</code>（无括号），String 用 <code>length()</code>。' },
      { title: '遍历取舍', html: '要下标/要修改用普通 for；只读用增强 for，但增强 for 改不到数组元素。' },
      { title: '六套路', html: '求和、最值（初值取 <code>a[0]</code>）、计数、查找（返回 −1）、反转（<code>i &lt; j</code>）、移位（先存再覆盖）。' },
      { title: '越界', html: '抛 <code>ArrayIndexOutOfBoundsException</code>；循环写 <code>i &lt; a.length</code>；访问 <code>a[i+1]</code> 时条件收紧。' },
      { title: '二维与锯齿', html: '二维是「数组的数组」；<code>grid.length</code> 行数、<code>grid[r].length</code> 列数；主对角线 <code>r==c</code>、副对角线 <code>r+c==n-1</code>。' },
      { title: '引用与传参', html: '数组是对象，变量存引用；<code>=</code> 是别名，复制用 <code>Arrays.copyOf</code> 或循环；方法能改内容、不能换对象。' },
      { title: 'Arrays 工具', html: '<code>toString/deepToString</code> 打印、<code>sort/fill</code> 改原数组、<code>copyOf</code> 复制、<code>equals</code> 比内容。' }
    ] },

    { t: 'checklist', id: 'ch04', items: [
      '我能写出数组的三种创建方式，并说出 <code>new int[5]</code> 的元素默认值',
      '我能解释下标为什么从 0 开始、最大下标为什么是 <code>length - 1</code>',
      '我能区分普通 for 与增强 for 的适用场景，并知道增强 for 里改 <code>v</code> 不会改数组',
      '我能不看资料写出求和、求最大、计数、查找、反转、左移六个套路',
      '我能在越界时读懂异常信息，知道去循环边界或 <code>a[i + 1]</code> 处找问题',
      '我能说出 <code>new int[0]</code> 合法、长度为 0 与 <code>null</code> 数组的区别',
      '我能写出二维数组的行列遍历与锯齿数组创建，分清两处 length',
      '我能写出主/副对角线的下标条件，并解释为什么副对角线不能写 <code>r == c</code>',
      '我能说清 <code>int[] b = a</code> 之后修改 b 会发生什么，以及怎么真正复制',
      '我能判断一个方法会不会改到调用者的数组，并说出 Arrays 六个常用方法的作用',
      '我能说出教材 §1.4 的四个程序各自用数组做了什么，并解释洗牌为什么不能每轮从整个数组里随机交换'
    ] },

    /* ------------------------------------------------------------------ 延伸阅读 */
    { t: 'p', html:
      '<b>延伸阅读</b>：教材 Sedgewick《Computer Science: An Interdisciplinary Approach》第 1.4 节（Arrays）' +
      '系统讲了数组的定义、典型应用（洗牌、直方图）与二维数组，配图适合再巩固一遍；' +
      '站内第 09 章「内存与引用」会把本章的别名与传参深入成栈/堆内存图与深浅拷贝，' +
      '第 11 章「算法：排序与查找」会把本章的查找、排序套路升级成算法复杂度分析。' +
      '想练手可以到 <a href="#/quiz/ch04">题库 · ch04</a> 按章节筛选，或用首页的随机挑战抽题；' +
      '做完后建议回到本章的「完整案例 A/B」，不看答案默写一遍。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '数组题是练「边界思维」最好的素材，用 AI 这样练：' +
      '① 让它写「反转数组」，然后你检查：长度是奇数时中间那个元素会不会被换两次？长度是 0 呢？' +
      '② 让它给一段「求和 + 求平均」的代码，你专门找它有没有忘记把 sum 转成 double、有没有处理空数组；' +
      '③ 让它画 <code>int[] b = a</code> 的内存图，重点看箭头数量——AI 常把「别名」错画成「复制」；' +
      '④ 让它解释「副对角线为什么是 r + c == n - 1」，再用本站的单步面板验证它说的是不是真的。<br>' +
      'AI 写的数组代码经常在「少一圈 / 多一圈」和「别名当成复制」上出错——这两点正是考试扣分点。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：数组：声明与默认值、下标与 length、遍历与常见算法、二维与锯齿数组、引用与别名、Arrays 工具、越界与边界。<br>依据：Course Outline v5 的 Arrays 部分；Sedgewick §1.4。本站为个人整理的学习材料，与课程要求冲突时以老师和课程大纲为准；代码均在真实 JDK 上校验过。' }

  ]
});