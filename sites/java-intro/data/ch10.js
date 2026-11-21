/* =====================================================================
 * data/ch10.js · 第 10 章：抽象数据类型与集合
 * 职责：ADT 思想与接口/实现分离、Java 集合三族（List/Set/Map）、
 *       ArrayList 常用操作与链表对比、HashMap/HashSet 与哈希、泛型与增强 for、
 *       遍历中删除的三种安全写法、按操作选容器的决策表、三个调试实录、两个完整案例。
 * 对外 API：CSC.registerChapter({...})（内容块 schema 见 _dev/CONTRACT.md §4–§5）
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch10',
  num: '10',
  title: '抽象数据类型与集合',
  en: 'ADTs & Java Collections',
  goals: [
    '能用自己的话解释 ADT：先定"能做什么"，再谈"怎么实现"',
    '会用 ArrayList、HashMap、HashSet 完成增删改查、去重与计数',
    '能根据操作特点在 ArrayList 与 LinkedList 之间做选择，并说出复杂度理由',
    '能读懂并使用泛型 ArrayList<E>，说明泛型解决什么问题',
    '能列出集合遍历中删除元素的安全写法，避开 ConcurrentModificationException',
    '能按"先列操作、再选容器、最后谈实现"的流程设计一个小 ADT'
  ],
  kp: [
    { id: 'ch10-1', title: 'ADT：接口与实现分离' },
    { id: 'ch10-2', title: 'Java 集合框架：List / Set / Map' },
    { id: 'ch10-3', title: 'ArrayList 与 LinkedList' },
    { id: 'ch10-4', title: 'HashMap 与 HashSet' },
    { id: 'ch10-5', title: '泛型与增强 for' },
    { id: 'ch10-7', title: '遍历中删除与并发修改异常' },
    { id: 'ch10-6', title: '按操作选容器' },
    { id: 'ch10-8', title: '集合类 bug 的调试方法' }
  ],
  blocks: [

    /* ------------------------------------------------------------------ 开篇 */
    { t: 'callout', kind: 'why', html:
      '先看一段"不报错但结果错"的程序：把 ArrayList 里所有不及格（&lt; 60）的成绩删掉。' +
      '代码写得像数组一样自然——循环 <code>i</code> 从 0 到 <code>size() - 1</code>，遇到不及格就 <code>remove(i)</code>。' +
      '运行不报错，但打印结果里竟然还留着一个 30 分。<br>' +
      '这不是边界写错，而是<b>数组思维撞上了集合的"动态长度"</b>：删除一个元素后，后面所有元素整体前移，' +
      '而循环变量 <code>i</code> 还在往前走——被前移过来的那个元素就这样被跳过了。这一章从"数据放哪"讲起，' +
      '用 ADT 的视角重新认识容器：先想清楚要哪些操作，再选一个现成的集合，最后才关心它内部怎么实现。'
    },

    { t: 'p', lead: true, html:
      '先运行下面这段程序，把输出记下来，再回答一个问题：为什么 30 没有被删掉？'
    },

    { t: 'code', caption: 'OpeningBug.java · 删除所有不及格成绩，结果却留下一个 30', trace: true, code:
`import java.util.ArrayList;

public class OpeningBug {
    public static void main(String[] args) {
        ArrayList<Integer> scores = new ArrayList<Integer>();
        scores.add(45);
        scores.add(30);
        scores.add(82);
        scores.add(60);
        scores.add(55);

        for (int i = 0; i < scores.size(); i++) {
            if (scores.get(i) < 60) {
                scores.remove(i);       // 删除后，后面的元素整体前移
            }
        }
        System.out.println(scores);
    }
}
` },

    { t: 'p', html:
      '输出是 <code>[30, 82, 60]</code>：45 和 55 被删掉了，30 却逃过一劫。单步跟踪一遍就明白：' +
      '删掉下标 0 的 45 之后，30 从下标 1 <b>前移到下标 0</b>，而循环里的 <code>i</code> 已经变成 1，' +
      '于是程序去看新的下标 1（82），30 永远没被检查。修复方式有三种：<b>倒序删除</b>（从后往前，前移不影响未检查部分）、' +
      '用<b>迭代器</b>的 <code>remove()</code>、或者先收集要删的元素最后统一删。本章第六节会把三种写法讲全。'
    },

    { t: 'p', html:
      '本章路线：先用一个"袋子"看懂 ADT 与接口/实现分离（一），再认识集合三族 List/Set/Map（二）；' +
      '接着深入 ArrayList 与链表的取舍（三）、HashMap/HashSet 与哈希（四）、泛型与增强 for（五）；' +
      '然后专门讲遍历中删除的安全写法（六）和按操作选容器的决策表（七）；' +
      '最后用三个调试实录（八）和两个完整案例把"设计 ADT → 选容器 → 写业务逻辑"串起来。'
    },

    /* ------------------------------------------------------------------ 一、ADT */
    { t: 'h', text: '一、ADT：先定操作，再谈实现', id: 'ch10-1' },

    { t: 'p', html:
      '<b>抽象数据类型（ADT, abstract data type）</b>是一份"能做什么"的清单：有哪些操作、每个操作是什么语义、' +
      '边界情况返回什么。它<b>不规定</b>内部用什么结构。比如一个"整数袋子"要能 <code>add</code>、' +
      '<code>contains</code>、<code>size</code>——内部用数组、链表还是哈希表，是实现的自由。'
    },

    { t: 'term', en: 'ADT (abstract data type)', zh: '抽象数据类型',
      html: '一组数据 + 定义在这组数据上的操作，只描述"能做什么"，不规定"怎么做"；同一个 ADT 可以有多种实现。' },

    { t: 'p', html:
      '好处有三：调用方只依赖操作清单，换实现不用改调用方；可以先写一个简单实现跑通、再优化；' +
      '团队能并行——一个人定操作，另一个人写实现。Java 里表达 ADT 的常用工具是<b>接口（interface）</b>：' +
      '接口只声明方法签名，不给实现。'
    },

    { t: 'code', caption: 'AdtDemo.java · 接口 IntBag 定义 ADT，ArrayBag 提供一种实现', code:
`interface IntBag {
    void add(int x);
    boolean contains(int x);
    int size();
}

class ArrayBag implements IntBag {
    private int[] data = new int[10];
    private int n = 0;

    public void add(int x) {
        if (n < data.length) {
            data[n] = x;
            n++;
        }
    }

    public boolean contains(int x) {
        for (int i = 0; i < n; i++) {
            if (data[i] == x) return true;
        }
        return false;
    }

    public int size() { return n; }
}

public class AdtDemo {
    public static void main(String[] args) {
        IntBag bag = new ArrayBag();    // 只依赖接口，不关心内部是数组
        bag.add(3);
        bag.add(7);
        System.out.println(bag.contains(7));   // true
        System.out.println(bag.size());        // 2
    }
}
` },

    { t: 'p', html:
      '注意 <code>main</code> 里的变量类型是 <code>IntBag</code>（接口），不是 <code>ArrayBag</code>：' +
      '以后把实现换成"用 ArrayList 存的袋子"，只改 <code>new</code> 那一处，使用代码一行都不用动。' +
      '这就是"面向接口编程"：<b>调用方依赖能力清单，而不是某个具体类</b>。同一个 ADT 可以有多种实现，' +
      '下面换成"内部用 ArrayList 的栈"——对使用者来说，操作清单完全一样，只是换了实现。'
    },

    { t: 'code', caption: 'StackADT.java · 同一个 ADT，换一种实现（内部用 ArrayList）', code:
`import java.util.ArrayList;

class IntStack {
    private ArrayList<Integer> data = new ArrayList<Integer>();

    void push(int x) { data.add(x); }

    int pop() {
        int top = data.get(data.size() - 1);
        data.remove(data.size() - 1);
        return top;
    }

    int peek() { return data.get(data.size() - 1); }
    boolean isEmpty() { return data.size() == 0; }
    int size() { return data.size(); }
}

public class StackADT {
    public static void main(String[] args) {
        IntStack s = new IntStack();
        s.push(1);
        s.push(2);
        s.push(3);
        System.out.println(s.pop());        // 3
        System.out.println(s.peek());       // 2
        System.out.println(s.size());       // 2
        System.out.println(s.isEmpty());    // false
    }
}
` },

    { t: 'p', html:
      '对比 AdtDemo 和 StackADT：一个是"用数组当袋子"，一个是"用 ArrayList 当栈"，对外都只暴露操作。' +
      '这就是 ADT 的实用价值——<b>先把接口稳定下来，实现随时可换、可优化</b>。反过来也要注意别过度抽象：' +
      '如果只是一次性的小脚本，直接写 ArrayList 更省事；抽象是在"会有人依赖、会换实现、要分工"时才值得。'
    },

    { t: 'steps', items: [
      { title: '列出名词', html: '需求里出现的实体是候选数据：学生、课程、订单、单词。' },
      { title: '列出动词', html: '要对这些实体做什么：加入、删除、查询、统计——每个动词对应一个操作。' },
      { title: '定语义与代价', html: '每个操作返回什么、找不到时返回什么（null / −1 / 抛异常）；再按调用频率挑实现。' }
    ] },

    { t: 'keypoint', items: [
      { title: '检查点 · ADT', html: '能说出 ADT 与实现的区别，并用"接口 + 一个实现类"写出来。' },
      { title: '检查点 · 设计三步', html: '拿到一个需求，能按「名词 → 动词 → 语义与代价」列出操作清单。' }
    ] },

    /* ------------------------------------------------------------------ 二、集合三族 */
    { t: 'h', text: '二、集合三族：List / Set / Map', id: 'ch10-2' },

    { t: 'p', html:
      'Java 的集合框架（collection framework）在 <code>java.util</code> 里，按"怎么访问数据"分成三族：' +
      '<b>List</b> 有序、可重复、能按下标取；<b>Set</b> 不重复、不保证顺序；<b>Map</b> 存键值对、按键查找。' +
      '三族都是接口（List/Set/Map），下面各有多种实现（ArrayList、HashSet、HashMap 等）。'
    },

    { t: 'table',
      head: ['族', '是否有序', '能否重复', '典型实现', '典型用途'],
      rows: [
        ['<code>List</code>', '有序（按插入顺序）', '可以重复', '<code>ArrayList</code>、<code>LinkedList</code>', '名单、成绩表、需要按下标访问'],
        ['<code>Set</code>', '不保证顺序', '不允许重复', '<code>HashSet</code>', '去重、判断"存在吗"'],
        ['<code>Map</code>', '不保证顺序', '键唯一、值可重复', '<code>HashMap</code>', '学号→成绩、单词→次数']
      ],
      caption: '先定"要不要下标、要不要去重、是不是键值对"，三族里必有一个合适' },

    { t: 'p', html:
      '所有集合都支持<b>泛型（generics）</b>：<code>ArrayList&lt;String&gt;</code> 表示"装 String 的列表"。' +
      '放进别的类型，编译器当场报错；取出来也不用强制类型转换。集合还有一个和数组最大的不同：' +
      '<b>长度是动态的</b>——<code>add</code> 会自动扩容，<code>remove</code> 会自动缩短，' +
      '所以没有 <code>length</code> 字段，用 <code>size()</code> 方法问大小。'
    },

    { t: 'code', caption: 'ListDemo.java · ArrayList 的常用操作', code:
`import java.util.ArrayList;

public class ListDemo {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<String>();
        names.add("Alice");
        names.add("Bob");
        names.add("Cara");

        System.out.println(names.size());          // 3
        System.out.println(names.get(1));          // Bob

        names.set(1, "Bobby");                     // 改：下标 1 换成 Bobby
        names.remove(0);                           // 删：删下标 0
        System.out.println(names);                 // [Bobby, Cara]
        System.out.println(names.contains("Cara")); // true
        System.out.println(names.indexOf("Bobby")); // 0
    }
}
` },

    { t: 'callout', kind: 'warn', title: '数组 vs 集合：四个最常考的区别', html:
      '① 长度：数组 <code>a.length</code>（属性，定长）；集合 <code>list.size()</code>（方法，可变）。<br>' +
      '② 取元素：数组 <code>a[i]</code>；List 用 <code>list.get(i)</code>，<b>不能用方括号</b>。<br>' +
      '③ 修改：数组 <code>a[i] = x</code>；List 用 <code>list.set(i, x)</code>。<br>' +
      '④ 类型：数组可以装基本类型；集合只能装对象（<code>ArrayList&lt;Integer&gt;</code> 而不是 <code>&lt;int&gt;</code>），' +
      '基本类型会自动装箱（boxing）成包装类。'
    },

    { t: 'terms', cols: 2, items: [
      { en: 'ADT (abstract data type)', zh: '抽象数据类型', html: '数据 + 操作清单，只描述"能做什么"，不规定"怎么做"。' },
      { en: 'interface', zh: '接口', html: '只声明方法签名、不给实现的类型；调用方依赖它而不是具体类。' },
      { en: 'collection framework', zh: '集合框架', html: '<code>java.util</code> 里的容器体系：List / Set / Map 三族。' },
      { en: 'generics', zh: '泛型', html: '编译期的类型参数，如 <code>ArrayList&lt;String&gt;</code>；省掉强转、提前拦住类型错误。' },
      { en: 'ArrayList', zh: '数组列表', html: '底层数组实现的有序列表；按下标 O(1)，中间插入/删除 O(n)。' },
      { en: 'LinkedList', zh: '双向链表', html: '两端增删 O(1)、按下标取 O(n)；本课程以了解特性为主。' },
      { en: 'HashMap', zh: '哈希映射', html: '键值对容器，按键平均 O(1) 查找；靠 <code>hashCode()</code> 与 <code>equals()</code> 工作。' },
      { en: 'HashSet', zh: '哈希集合', html: '"只有键"的哈希容器：不重复、支持快速 <code>contains</code>。' }
    ] },

    { t: 'keypoint', items: [
      { title: '检查点 · 三族', html: '能说出 List / Set / Map 各自"有序吗、能重复吗、按键还是按位置访问"。' },
      { title: '检查点 · 数组 vs 集合', html: '能写出 length/size、[]/get、赋值/set、基本类型/包装类四组区别。' }
    ] },

    /* ------------------------------------------------------------------ 三、ArrayList vs LinkedList */
    { t: 'h', text: '三、ArrayList 与 LinkedList：时间花在哪', id: 'ch10-3' },

    { t: 'p', html:
      'ArrayList 底层是数组：按下标取是瞬间完成的（一步算地址），但往中间插入一个元素，' +
      '后面所有元素都要整体后移；数组满了还要新建更大的数组并复制。LinkedList 底层是双向链表：' +
      '在已知位置插入删除只需改几个指针，但想拿到第 k 个元素，必须从头一个个数过去。'
    },

    { t: 'table',
      head: ['操作', 'ArrayList', 'LinkedList', '原因'],
      rows: [
        ['按下标 <code>get(i)</code>', '快 O(1)', '慢 O(n)', '数组能直接算地址；链表要顺着走'],
        ['末尾 <code>add</code>', '快（摊还 O(1)，偶尔扩容复制）', '快 O(1)', '两者都只动末尾'],
        ['中间插入 / 删除', '慢 O(n)（整体后移）', '快 O(1)（改指针，前提是已经走到位置）', '数组要挪元素，链表只改链接'],
        ['查找某个值 <code>contains</code>', '慢 O(n)', '慢 O(n)', '都要逐个比较']
      ],
      caption: '把"快 / 慢"和 Big-O 对上号（第 13 章会系统讲 Big-O）' },

    { t: 'compare', left: {
      title: 'ArrayList：底层是数组',
      html: '<b>按下标读</b> O(1)；中间插入或删除要挪动后面所有元素，O(n)。适合"查得多、改得少"。',
      code: 'ArrayList<String> list = new ArrayList<String>();\nlist.add("a");\nString s = list.get(0);      // O(1)：按下标直接取值'
    }, right: {
      title: 'LinkedList：底层是双向链表',
      html: '在已知位置（尤其头部）插入删除只改指针 O(1)；但取第 k 个元素必须从头走 O(n)。',
      code: 'LinkedList<String> list = new LinkedList<String>();\nlist.add(0, "a");            // O(1)：头部插入不挪元素\nString s = list.get(2);      // O(n)：要从前端走 2 步'
    } },

    { t: 'p', html:
      '还有一个工程细节：ArrayList 的容量是预留的，元素超过容量时会新建一个约 1.5 倍大的数组，' +
      '把旧元素整体复制过去。所以"末尾追加"平均是 O(1)（摊还），但偶尔会撞上一次 O(n) 复制；' +
      '如果事先知道大概有多少元素，可以用 <code>new ArrayList&lt;&gt;(容量)</code> 预留，避免反复扩容。' +
      'LinkedList 没有扩容复制，但每个节点要额外存两个指针，同样的数据占更多内存——时间和内存，总得选一边。'
    },

    { t: 'p', html:
      '<b>设计取舍（一）：选容器就是为操作频率投票。</b>真实业务里 ArrayList 最常见，因为"按下标遍历/随机访问"永远占大多数；' +
      '只有明确"频繁在头部插入删除、且很少下标访问"（队列的出队、撤销栈）才值得用 LinkedList。' +
      '还要看<b>内存</b>：LinkedList 每个节点额外存两个指针，同样的数据占得更多；ArrayList 则要预留容量，' +
      '扩容时会出现一次 O(n) 复制。没有"绝对更快"的容器，只有"对这个访问模式更合适"的容器。'
    },

    { t: 'lab', id: 'collections' },

    { t: 'keypoint', items: [
      { title: '检查点 · 复杂度', html: '能填出 ArrayList / LinkedList 在按下标、末尾、中间、查找四种操作上的快慢与原因。' },
      { title: '检查点 · 取舍', html: '能针对一个场景说出选哪个容器，并给"操作 + 代价"两条理由。' }
    ] },

    /* ------------------------------------------------------------------ 四、HashMap / HashSet */
    { t: 'h', text: '四、HashMap 与 HashSet：按键一步到位', id: 'ch10-4' },

    { t: 'p', html:
      '数组的下标必须是连续整数，可现实中的键常常是字符串：学号、单词、用户名。' +
      '<b>哈希表（hash table）</b>用<b>哈希函数（hash function）</b>把任意键算成一个整数，再对桶数取余，' +
      '落到某个<b>桶（bucket）</b>里；查找时把同一个键再算一遍，就知道该去哪个桶取。' +
      'Java 的 <code>HashMap</code> 用 <code>hashCode()</code> 与 <code>equals()</code> 配合完成"定位 + 比较"。'
    },

    { t: 'svg', maxW: 700, html:
'<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="哈希表把键映射到桶">\n' +
'  <text x="16" y="26" font-size="13" font-weight="700" fill="var(--accent)">哈希表：键 → hashCode → 桶</text>\n' +
'  <g font-family="ui-monospace,monospace" font-size="12">\n' +
'    <rect x="20" y="54" width="150" height="34" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>\n' +
'    <text x="95" y="76" text-anchor="middle" fill="var(--text)">"java"</text>\n' +
'    <rect x="20" y="118" width="150" height="34" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>\n' +
'    <text x="95" y="140" text-anchor="middle" fill="var(--text)">"python"</text>\n' +
'    <rect x="20" y="182" width="150" height="34" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>\n' +
'    <text x="95" y="204" text-anchor="middle" fill="var(--text)">"c"</text>\n' +
'\n' +
'    <text x="250" y="76" text-anchor="middle" fill="var(--text2)">hashCode() % 4</text>\n' +
'    <text x="250" y="140" text-anchor="middle" fill="var(--text2)">hashCode() % 4</text>\n' +
'    <text x="250" y="204" text-anchor="middle" fill="var(--text2)">hashCode() % 4</text>\n' +
'    <line x1="176" y1="71" x2="316" y2="120" stroke="var(--accent2)" stroke-width="1.5"/>\n' +
'    <line x1="176" y1="135" x2="316" y2="196" stroke="var(--accent2)" stroke-width="1.5"/>\n' +
'    <line x1="176" y1="199" x2="316" y2="254" stroke="var(--accent2)" stroke-width="1.5"/>\n' +
'\n' +
'    <rect x="330" y="40" width="60" height="34" rx="6" fill="var(--bg2)" stroke="var(--line2)"/>\n' +
'    <text x="360" y="62" text-anchor="middle" fill="var(--text3)">桶 0</text>\n' +
'    <rect x="330" y="96" width="60" height="34" rx="6" fill="var(--accentSoft)" stroke="var(--accent)"/>\n' +
'    <text x="360" y="118" text-anchor="middle" fill="var(--text)">桶 1</text>\n' +
'    <rect x="330" y="152" width="60" height="34" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>\n' +
'    <text x="360" y="174" text-anchor="middle" fill="var(--text3)">桶 2</text>\n' +
'    <rect x="330" y="208" width="60" height="34" rx="6" fill="var(--accentSoft)" stroke="var(--accent)"/>\n' +
'    <text x="360" y="230" text-anchor="middle" fill="var(--text)">桶 3</text>\n' +
'\n' +
'    <rect x="420" y="96" width="270" height="34" rx="6" fill="var(--bg2)" stroke="var(--accent)"/>\n' +
'    <text x="432" y="118" fill="var(--text)">java → 3</text>\n' +
'    <rect x="420" y="208" width="270" height="34" rx="6" fill="var(--bg2)" stroke="var(--accent)"/>\n' +
'    <text x="432" y="230" fill="var(--text)">python → 1，c → 1（冲突，桶内再比）</text>\n' +
'  </g>\n' +
'</svg>',
      caption: '键先算哈希落到桶；不同键落到同一个桶叫哈希冲突，桶内再用 equals 逐个比' },

    { t: 'code', caption: 'WordCount.java · 用 HashMap 统计词频', code:
`import java.util.HashMap;

public class WordCount {
    public static void main(String[] args) {
        String[] words = {"java", "python", "java", "c", "java"};
        HashMap<String, Integer> count = new HashMap<String, Integer>();

        for (String w : words) {
            if (count.containsKey(w)) {
                count.put(w, count.get(w) + 1);   // 已出现过：次数 +1
            } else {
                count.put(w, 1);                  // 第一次见：记为 1
            }
        }

        System.out.println(count.get("java"));         // 3
        System.out.println(count.size());              // 3 个不同的单词
        System.out.println(count.containsKey("go"));   // false
    }
}
` },

    { t: 'p', html:
      '这段代码是"键值对"的标准套路：<b>先问有没有（containsKey），再决定 put 什么值</b>。' +
      '如果直接 <code>count.put(w, count.get(w) + 1)</code>，第一次遇到某个单词时 <code>get</code> 返回 <code>null</code>，' +
      '对 <code>null</code> 做加法就会抛 <code>NullPointerException</code>——这是词频统计最经典的坑。'
    },

    { t: 'p', html:
      '再看几个 Map 的基本语义：<code>put</code> 同一个键会<b>覆盖</b>旧值（size 不变）；' +
      '<code>get</code> 一个不存在的键返回 <code>null</code>，不是抛异常，所以取到的值要判空。'
    },

    { t: 'code', caption: 'MapBasics.java · put 覆盖、get 缺失键返回 null', code:
`import java.util.HashMap;

public class MapBasics {
    public static void main(String[] args) {
        HashMap<String, Integer> score = new HashMap<String, Integer>();
        score.put("Alice", 85);
        score.put("Bob", 92);
        score.put("Alice", 90);           // 同一个键：覆盖旧值

        System.out.println(score.size());              // 2
        System.out.println(score.get("Alice"));        // 90
        System.out.println(score.containsKey("Bob"));  // true
        System.out.println(score.get("Cara"));         // null：键不存在
        System.out.println(score.get("Cara") == null); // true
    }
}
` },

    { t: 'code', caption: 'Dedup.java · 用 HashSet 去重', code:
`import java.util.HashSet;

public class Dedup {
    public static void main(String[] args) {
        String[] words = {"a", "b", "a", "c", "b"};
        HashSet<String> seen = new HashSet<String>();

        for (String w : words) {
            seen.add(w);           // 重复添加不会报错，只是不生效
        }

        System.out.println(seen.size());        // 3
        System.out.println(seen.contains("a")); // true
        System.out.println(seen.contains("z")); // false
    }
}
` },

    { t: 'p', html:
      '<code>HashSet</code> 可以理解成"只有键、没有值"的 HashMap：不重复、查得快、不保证顺序。' +
      '注意 <code>add</code> 返回 <code>boolean</code>：第一次加入返回 <code>true</code>，重复加入返回 <code>false</code>——' +
      '利用这一点可以一边去重一边知道"是不是第一次见"。因为不保证顺序，<b>不要依赖它打印出来的先后</b>。'
    },

    { t: 'callout', kind: 'warn', title: 'hashCode 与 equals 的契约', html:
      '哈希容器靠两件事定位与判断相等：<code>hashCode()</code> 决定去哪个桶，<code>equals()</code> 决定桶里是不是同一个键。' +
      '所以自己写的类要放进 <code>HashSet</code> / 当 <code>HashMap</code> 的键时，<b>必须同时重写 hashCode 与 equals</b>，' +
      '并且保证"equals 相等 ⇒ hashCode 相等"。只重写 equals 会让两个"内容相同"的对象落到不同桶，去重失效。' +
      '（第 09 章 Point 类的 equals 重写可以回看，那里补一句 hashCode 即可。）'
    },

    { t: 'lab', id: 'hashmap' },

    { t: 'keypoint', items: [
      { title: '检查点 · 哈希思路', html: '能说出键 → hashCode → 桶 → equals 比较的完整流程，以及冲突是什么。' },
      { title: '检查点 · 两个套路', html: '能默写"HashMap 计数（先 containsKey 再累加）"和"HashSet 去重（add/size/contains）"。' }
    ] },

    /* ------------------------------------------------------------------ 五、泛型与增强 for */
    { t: 'h', text: '五、泛型与增强 for', id: 'ch10-5' },

    { t: 'p', html:
      '泛型是<b>编译期的类型参数</b>。<code>ArrayList&lt;Student&gt;</code> 告诉编译器"这个列表只装 Student"，' +
      '于是 <code>list.get(0)</code> 直接就是 <code>Student</code>，不需要 <code>(Student)</code> 强转；' +
      '放进别的类型会当场编译错误。泛型只在编译期有效，运行时类型信息会被擦除（type erasure）——考试常问这一点。'
    },

    { t: 'code', caption: 'StudentList.java · 泛型 + 增强 for + 倒序删除', code:
`import java.util.ArrayList;

class Student {
    private String name;
    private int score;

    public Student(String name, int score) {
        this.name = name;
        this.score = score;
    }

    public int getScore() { return score; }
}

public class StudentList {
    public static void main(String[] args) {
        ArrayList<Student> list = new ArrayList<Student>();
        list.add(new Student("Alice", 85));
        list.add(new Student("Bob", 92));
        list.add(new Student("Cara", 78));

        int total = 0;
        for (Student s : list) {        // 增强 for：逐个取出元素
            total += s.getScore();
        }
        System.out.println(total / list.size());    // 85

        // 删除不及格的：从后往前删，下标才不会错位
        for (int i = list.size() - 1; i >= 0; i--) {
            if (list.get(i).getScore() < 80) {
                list.remove(i);
            }
        }
        System.out.println(list.size());            // 2
    }
}
` },

    { t: 'p', html:
      '增强 for 只能<b>读</b>，不能改：<code>for (Student s : list) { s = new Student(...); }</code> 只改循环变量，' +
      '不会改集合里的元素；要修改元素的内容得用 <code>get(i)</code> 或 <code>set(i, x)</code>。' +
      '另外，增强 for 背后用的是迭代器，<b>遍历过程中直接增删集合</b>会抛 <code>ConcurrentModificationException</code>——' +
      '这正是下一节要解决的问题。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 泛型', html: '能说出 <code>ArrayList&lt;String&gt;</code> 的两个好处（省强转、编译期查类型），并解释类型擦除。' },
      { title: '检查点 · 增强 for', html: '知道增强 for 只能读、改循环变量不影响集合，且遍历中不能直接删。' }
    ] },

    /* ------------------------------------------------------------------ 六、遍历中删除 */
    { t: 'h', text: '六、遍历中删除：三种安全写法', id: 'ch10-7' },

    { t: 'p', html:
      '为什么"边遍历边删"这么容易错？因为集合删除元素后，后面的元素会前移，下标或迭代器状态随之变化。' +
      '数组因为长度固定，不存在这个问题，所以从数组转过来的直觉在集合上会翻车。安全写法有三种：' +
      '<b>倒序删除</b>（最常用）、<b>迭代器 remove()</b>、<b>先收集再统一删</b>。'
    },

    { t: 'table',
      head: ['写法', '怎么做', '注意'],
      rows: [
        ['倒序删除', '<code>for (int i = list.size() - 1; i &gt;= 0; i--)</code>，要删就 <code>remove(i)</code>', '前移只影响已检查过的下标，最稳'],
        ['迭代器删除', '<code>Iterator&lt;E&gt; it = list.iterator();</code> 循环里用 <code>it.next()</code> 与 <code>it.remove()</code>', '只能删"刚 next 出来的那个"，不能调 list.remove'],
        ['收集后删除', '遍历把要删的元素放进另一个 List，循环结束后 <code>list.removeAll(toRemove)</code>', '多一次遍历、多一份内存，但逻辑最清晰']
      ],
      caption: '考试里给"遍历删除"代码问对错，先看它是从前往后删、还是用了迭代器' },

    { t: 'callout', kind: 'warn', title: 'ConcurrentModificationException', html:
      '增强 for（以及 iterator 循环）遍历过程中，如果直接调用 <code>list.remove(...)</code> / <code>list.add(...)</code>，' +
      'Java 会检测到"集合被修改了"，抛 <code>ConcurrentModificationException</code>（并发修改异常）。' +
      '它不是真的多线程问题，而是<b>迭代状态与集合内容对不上</b>。正确做法是用迭代器自己的 <code>it.remove()</code>，' +
      '或者改成倒序下标删除。（站内解释器对这条异常做了简化，真实 JDK 会抛——写代码时按安全写法来就对了。）'
    },

    { t: 'p', html:
      '一个实用口诀：<b>要删元素，先问"能不能倒着走"</b>。绝大多数"删除某类元素"的题都能用倒序下标解决；' +
      '如果删除条件依赖上下文（比如"删除前一个元素"），再考虑迭代器或收集后删除。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 三种写法', html: '能说出倒序删除 / 迭代器 remove / 收集后删除各自怎么做、适合什么场景。' },
      { title: '检查点 · 异常', html: '知道增强 for 中直接删会抛 <code>ConcurrentModificationException</code>，并能改成安全写法。' }
    ] },

    /* ------------------------------------------------------------------ 七、按操作选容器 */
    { t: 'h', text: '七、按操作选容器：一张决策表', id: 'ch10-6' },

    { t: 'table',
      head: ['你的需求', '选它', '理由'],
      rows: [
        ['按序号访问、保持插入顺序', '<code>ArrayList</code>', '下标访问 O(1)，遍历方便'],
        ['频繁在头部插入 / 删除', '<code>LinkedList</code>', '改指针即可，不用挪动整段'],
        ['按唯一键查值（学号→成绩）', '<code>HashMap</code>', '按键平均 O(1) 定位'],
        ['去重、判断存在性', '<code>HashSet</code>', '天然不重复，查得快'],
        ['需要排序输出', '先放进 <code>ArrayList</code>，再 <code>Collections.sort</code>', '哈希类容器不保证顺序']
      ],
      caption: '先问"我按什么访问、做哪些操作、数据多大"，再选容器——不要默认用 ArrayList' },

    { t: 'p', html:
      '<b>设计取舍（二）：复杂度、内存与可读性要一起算。</b>选容器不能只看单个操作：' +
      '① 用 ArrayList 做"查重"是 O(n²)，换成 HashSet 是 O(n)——数据从 1 千涨到 10 万时，差距是"瞬间"和"卡死"；' +
      '② 用 HashMap 省了查找时间，但多占了哈希表的内存，且输出顺序不可控，要排序就得再放进 List；' +
      '③ 选错了通常不会报错，只是数据量变大后莫名变慢——这也是最后一个调试案例要讲的内容。' +
      '考试问"选哪个"时，答题模板是：<b>场景里的主要操作是什么 → 各候选的该操作复杂度 → 结论</b>，三句话缺一不可。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 决策表', html: '能背出五种场景对应的容器，并为每种说出"操作 + 复杂度"理由。' },
      { title: '检查点 · 取舍', html: '能说清"ArrayList 查重 O(n²) vs HashSet O(n)"和"HashMap 快但无序"两个取舍。' }
    ] },

    /* ------------------------------------------------------------------ 八、调试实录 */
    { t: 'h', text: '八、调试实录：三个集合 bug', id: 'ch10-8' },

    { t: 'p', html:
      '集合类 bug 分两类：一类是<b>编译错误</b>（泛型类型不对，最容易发现）；另一类是<b>不报错但结果错</b>' +
      '（删错元素、计数覆盖、边遍历边删），后者才是考试与作业的重灾区。调试流程：' +
      '<b>① 打印集合当前内容与 size</b>；<b>② 检查每个改变集合的操作是哪一个重载、改的是下标还是对象</b>；' +
      '<b>③ 一次只改一处再验证</b>。'
    },

    { t: 'steps', items: [
      { title: '先看是编译期还是运行期', html: '红色波浪线 / 编译错误 → 类型或方法名问题；能跑但结果错 → 逻辑与集合语义问题。' },
      { title: '打印现场', html: '在循环里打印 <code>i</code>、<code>size()</code> 和集合内容，看删除后元素有没有前移。' },
      { title: '查重载与顺序', html: '<code>remove(int)</code> 删下标、<code>remove(Object)</code> 删对象；遍历删除注意方向。' }
    ] },

    { t: 'h', lvl: 3, text: '案例 1：remove 两个重载，删错了对象' },

    { t: 'p', html:
      '需求是"删除名单里的 Bob"。代码写了 <code>remove("Bob")</code> 时能正常工作，因为参数是 String，匹配 ' +
      '<code>remove(Object)</code>；但如果集合里装的是 <code>Integer</code>，<code>remove(1)</code> 会匹配 ' +
      '<code>remove(int index)</code>，删的是下标 1，而不是"值为 1 的元素"。这个坑在考试里几乎是必考。'
    },

    { t: 'code', caption: 'DebugRemove.java · 两个重载：一个删下标、一个删对象', code:
`import java.util.ArrayList;

public class DebugRemove {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<String>();
        names.add("Alice");
        names.add("Bob");
        names.add("Cara");

        names.remove(1);                 // remove(int index)：删下标 1 → Bob
        System.out.println(names);       // [Alice, Cara]

        names.add("Bob");
        names.remove("Bob");             // remove(Object)：删掉内容为 Bob 的元素
        System.out.println(names);       // [Alice, Cara]
    }
}
` },

    { t: 'p', html:
      '定位方法：看 <code>remove</code> 的参数类型——<b>字面量数字走下标版，对象/字符串走对象版</b>。' +
      '如果确实要按值删除一个整数元素，可以写成 <code>remove(Integer.valueOf(20))</code>（先装箱成对象）；' +
      '或者干脆用倒序循环 + <code>get(i)</code> 判断。记住一句：<code>list.remove(1)</code> 问的是"第 2 个"，' +
      '不是"值为 1 的那个"。'
    },

    { t: 'h', lvl: 3, text: '案例 2：计数时忘了累加，每个键都变成 1' },

    { t: 'p', html:
      '第二个 bug 不抛异常：统计词频时每次都 <code>put(w, 1)</code>，于是每个单词的次数永远是 1。' +
      '原因很简单——<code>put</code> 是<b>覆盖</b>，不会自动相加；必须先用 <code>get</code> 取旧值再加一。'
    },

    { t: 'code', caption: 'DebugPut.java · 每次 put 1，结果永远覆盖成 1', code:
`import java.util.HashMap;

public class DebugPut {
    public static void main(String[] args) {
        String[] words = {"a", "b", "a"};
        HashMap<String, Integer> count = new HashMap<String, Integer>();

        for (String w : words) {
            count.put(w, 1);        // BUG：覆盖，而不是累加
        }

        System.out.println(count.get("a"));   // 1，应该是 2
        System.out.println(count.get("b"));   // 1
    }
}
` },

    { t: 'p', html:
      '修复就是本章第四节的标准套路：<code>if (count.containsKey(w)) count.put(w, count.get(w) + 1); ' +
      'else count.put(w, 1);</code>。这个 bug 的教训是：<b>Map 的 put 语义是"放/替换"，不是"追加"</b>。' +
      '凡是"累计 / 统计"需求，先想清楚"旧值从哪来"。'
    },

    { t: 'h', lvl: 3, text: '案例 3：内容相同的对象，HashSet 去不掉重' },

    { t: 'p', html:
      '第三个 bug 不抛异常、也不涉及删除：需求是"用 HashSet 给坐标点去重"，把两个坐标都是 1 的 Point 加进去，' +
      '以为 set 里只会有 1 个元素。结果 <code>size()</code> 打印出来是 2。原因：HashSet 判断"重复"靠 ' +
      '<code>hashCode()</code> 与 <code>equals()</code>；自定义类没重写这两个方法，就沿用 Object 的"按地址比较"，' +
      '两个内容相同的对象仍然是两个不同的对象。'
    },

    { t: 'code', caption: 'DebugDedup.java · 不报错但去重失败：Point 没有重写 equals/hashCode', code:
`import java.util.HashSet;

class Point {
    int x;
    Point(int x) { this.x = x; }
}

public class DebugDedup {
    public static void main(String[] args) {
        HashSet<Point> set = new HashSet<Point>();
        set.add(new Point(1));
        set.add(new Point(1));
        System.out.println(set.size());   // 2：内容相同，但没有重写 equals/hashCode
    }
}
` },

    { t: 'p', html:
      '修复：给 Point <b>同时重写 hashCode 与 equals</b>——先按第 09 章的四步写 equals（this → null → 类型 → 逐字段），' +
      '再让 hashCode 由同样的字段算出（例如 <code>return x</code>）。这个案例的启示：' +
      '凡是"靠内容判断相等"的场合（Set 去重、Map 作键），都要检查 hashCode/equals 有没有重写；' +
      '只重写 equals 会让两个"相等"对象落到不同桶，仍然去不掉。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 三个 bug', html: '能说出每个 bug 属于"重载选错 / 覆盖而非累加 / 未重写 hashCode 与 equals"哪一类，并给出修法。' },
      { title: '检查点 · 流程', html: '遇到能跑但结果错的集合题，会先打印 size 与集合内容、再查删除方向、重载与相等性。' }
    ] },

    /* ------------------------------------------------------------------ 完整案例 A */
    { t: 'h', text: '完整案例 A：词频统计与排名', id: 'ch10-9' },

    { t: 'p', html:
      '下面这段程序把本章的主要工具用在一处：用 <code>HashMap</code> 统计词频、用 <code>ArrayList</code> 记住' +
      '首次出现顺序、再按"次数降序、次数相同按字典序"排出前三名。关键设计取舍：哈希表不保证顺序，' +
      '所以<b>排序不直接对哈希表做</b>，而是把键放进 List 再排——这正是"按操作选容器"的落地。'
    },

    { t: 'code', caption: 'WordRank.java · 70 行完整程序：计数 + 保留顺序 + 排名', code:
`import java.util.ArrayList;
import java.util.HashMap;

public class WordRank {
    public static void main(String[] args) {
        String[] words = {"the", "cat", "the", "dog", "the", "cat", "ant"};
        HashMap<String, Integer> counts = new HashMap<String, Integer>();
        ArrayList<String> order = new ArrayList<String>();

        for (int i = 0; i < words.length; i++) {
            String w = words[i];
            if (counts.containsKey(w)) {
                counts.put(w, counts.get(w) + 1);
            } else {
                counts.put(w, 1);
                order.add(w);              // 只记首次出现，作为初始顺序
            }
        }

        // 按"次数降序、同次数按字典序升序"做选择排序
        for (int i = 0; i < order.size() - 1; i++) {
            int best = i;
            for (int j = i + 1; j < order.size(); j++) {
                int cj = counts.get(order.get(j));
                int cb = counts.get(order.get(best));
                if (cj > cb || (cj == cb && order.get(j).compareTo(order.get(best)) < 0)) {
                    best = j;
                }
            }
            String t = order.get(i);
            order.set(i, order.get(best));
            order.set(best, t);
        }

        System.out.println("distinct = " + counts.size());   // 4
        for (int i = 0; i < order.size() && i < 3; i++) {
            String w = order.get(i);
            System.out.println(w + " " + counts.get(w));
        }
    }
}
` },

    { t: 'table',
      head: ['容器', '存什么', '为什么选它'],
      rows: [
        ['<code>HashMap</code>', '单词 → 次数', '按键平均 O(1) 查、改次数'],
        ['<code>ArrayList</code>', '单词的首次出现顺序', '要按下标排序、能保留顺序'],
        ['输出', '前 3 名', '排完序后按下标取即可']
      ],
      caption: '两个容器分工：一个负责"查得快"，一个负责"排得动"' },

    { t: 'p', html:
      '逐段看：① <code>containsKey</code> 判断是第几次见，第一次见时把单词追加进 <code>order</code>；' +
      '② 排序时不交换哈希表，而是对 <code>order</code> 做选择排序，交换的是<b>名字</b>，次数总是用 ' +
      '<code>counts.get(name)</code> 现查——避免了"两个容器同步修改"的麻烦；' +
      '③ 排完之后输出前 3 名。如果数据量很大、要找 Top K，可以把排序换成第 11 章的堆/快排思路，' +
      '但"计数用 Map、排序用 List"的骨架不变。<br>' +
      '这段代码能直接改造成作业：把 <code>words</code> 换成 <code>Scanner</code> 读入、把 Top 3 改成参数、把输出写成英文或 CSV。'
    },

    /* ------------------------------------------------------------------ 完整案例 B */
    { t: 'h', text: '完整案例 B：课程名单与成绩管理', id: 'ch10-10' },

    { t: 'p', html:
      '真实需求往往是"多种容器配合"。下面用 <code>Course</code> 这个类演示：名单用 <code>ArrayList</code> 保存' +
      '（按加入顺序），按名字查人用 <code>HashMap</code>（平均 O(1)），重名直接拒绝。' +
      '这既是 ADT 设计（对外只暴露 add/find/size/average/rank），也是"List + Map 分工"的模板。'
    },

    { t: 'code', caption: 'CourseManager.java · 85 行完整程序：一个类内用两种容器', code:
`import java.util.ArrayList;
import java.util.HashMap;

class Student {
    private String name;
    private int score;

    Student(String name, int score) {
        this.name = name;
        this.score = score;
    }

    String getName() { return name; }
    int getScore() { return score; }
}

class Course {
    private String title;
    private ArrayList<Student> roster = new ArrayList<Student>();
    private HashMap<String, Student> byName = new HashMap<String, Student>();

    Course(String title) { this.title = title; }

    boolean add(Student s) {
        if (byName.containsKey(s.getName())) return false;   // 重名：拒绝
        roster.add(s);
        byName.put(s.getName(), s);
        return true;
    }

    Student find(String name) { return byName.get(name); }   // 平均 O(1)

    int size() { return roster.size(); }

    double average() {
        if (roster.size() == 0) return 0.0;
        int sum = 0;
        for (Student s : roster) sum += s.getScore();
        return (double) sum / roster.size();
    }

    ArrayList<String> rank() {   // 按成绩降序返回名字
        ArrayList<String> names = new ArrayList<String>();
        for (Student s : roster) names.add(s.getName());
        for (int i = 0; i < names.size() - 1; i++) {
            int best = i;
            for (int j = i + 1; j < names.size(); j++) {
                if (byName.get(names.get(j)).getScore() > byName.get(names.get(best)).getScore()) {
                    best = j;
                }
            }
            String t = names.get(i);
            names.set(i, names.get(best));
            names.set(best, t);
        }
        return names;
    }
}

public class CourseManager {
    public static void main(String[] args) {
        Course c = new Course("计算机科学与 Java 编程导论");
        c.add(new Student("Alice", 85));
        c.add(new Student("Bob", 92));
        c.add(new Student("Cara", 78));
        System.out.println(c.add(new Student("Bob", 60)));        // false：重名被拒
        System.out.println(c.size() + " " + c.find("Bob").getScore());  // 3 92
        System.out.println(c.average());                          // 85.0
        System.out.println(c.rank());                             // [Bob, Alice, Cara]
    }
}
` },

    { t: 'p', html:
      '三个要点。① <b>两个容器不是重复存储，而是各司其职</b>：roster 管顺序与遍历，byName 管按名字快速定位；' +
      '代价是 add/删除时要同步维护两处。② <b>ADT 思想</b>：main 只调用 add/find/size/average/rank，' +
      '完全不知道内部用了哪些容器——以后想用小顶堆实现 Top K 的 rank，外部代码不用改。' +
      '③ <b>设计取舍</b>：如果需求只有"按名字查成绩"，那就只留 byName，别为"以后可能遍历"提前引入 List；' +
      '反过来，如果还要频繁按加入顺序输出名单，保留两个容器是值得的。取舍依据永远是<b>操作频率</b>，不是"数据多"。'
    },

    /* ------------------------------------------------------------------ 即时练习 */
    { t: 'h', text: '教材对照：§4.4 符号表', id: 'ch10-book' },

{ t: 'table',
      head: ['实现', 'put / get 的平均代价', '教材里的名字', '适用场景'],
      rows: [
        ['无序数组 + 顺序查找', 'O(n)', 'SequentialSearchST', '键很少，或写一次读很多次'],
        ['哈希表', 'O(1)', 'SeparateChainingHashST', '通用默认选择，键可散列'],
        ['二叉查找树', 'O(log n)（平衡时）', 'BST', '需要按顺序遍历键、范围查询']
      ],
      caption: '教材的结论：没有一种实现全场景最优，先看客户端需要哪些操作'
    },

{ t: 'code', caption: 'ST.java —— 教材 §4.4 顺序查找符号表：两个平行数组 + 线性扫描', code:
`class ST {
    private String[] keys = new String[10];
    private int[] vals = new int[10];
    private int n = 0;
    void put(String key, int val) {
        for (int i = 0; i < n; i++) {
            if (keys[i].equals(key)) { vals[i] = val; return; }
        }
        keys[n] = key; vals[n] = val; n++;
    }
    int get(String key) {
        for (int i = 0; i < n; i++) if (keys[i].equals(key)) return vals[i];
        return -1;
    }
    boolean contains(String key) { return get(key) >= 0; }
    int size() { return n; }
}

public class Q {
    public static void main(String[] args) {
        ST st = new ST();
        st.put("a", 1); st.put("b", 2); st.put("a", 3);
        System.out.println(st.get("a") + " " + st.get("c") + " " + st.contains("b") + " " + st.size());
    }
}
` },

    { t: 'p', html:
      "教材 §4.4 把「符号表」定义成<b>键值对的集合</b>，并先给 API 再谈实现：<code>put(key, value)</code>、<code>get(key)</code>、<code>contains(key)</code>、<code>delete(key)</code>、<code>size()</code>、<code>keys()</code>。它的三条约定和本章完全一致：键不可变、<code>put</code> 覆盖旧值、<code>get</code> 未命中返回 <code>null</code>。<br><br>输出 <code>3 -1 true 2</code>。<code>put(\"a\", 3)</code> 第二次遇到 a 时覆盖了旧值，所以 <code>get(\"a\")</code> 是 3；<code>get(\"c\")</code> 没找到，返回 -1；<code>size()</code> 仍然是 2。教材强调 <code>contains</code> 不要单独写一套查找逻辑，直接用 <code>get(key) != null</code>（本站用 -1 表示未命中）最省事。<br><br>教材 §4.4 还给了符号表的两条性能约定：① 顺序查找 ST 的 <code>put</code> 在键已存在时是 O(n)（要先找到），但可以改成「头插 + 惰性删除」把 <code>put</code> 降到 O(1)；② 哈希表把「比较键」换成「算哈希」，代价是必须处理冲突。教材用「分离链接法」演示冲突：每个桶挂一条链表，<code>get</code> 时先算桶再在链表里找。<br><br>教材 §4.4 还讨论了「有序符号表」：如果客户端需要按顺序遍历键、找最大/最小键、做范围查询，就要用能维持键顺序的实现（有序数组 + 二分，或 BST）。有序数组的 <code>get</code> 是 O(log n)、<code>put</code> 是 O(n)（要移动元素）；BST 平均 O(log n)，退化时变 O(n)。教材的结论是：先看客户端需要哪些操作，再选实现——没有「最好的符号表」，只有「对这个客户端最合适的符号表」。<br><br>教材还提醒：符号表的键必须是「可比较/可哈希」的稳定对象，用可变对象当键会让 put 之后再也 get 不到。String 和 Integer 之所以常用作键，正是因为它们不可变、equals 与 hashCode 一致。"
    },

    { t: 'callout', kind: 'note', title: '教材 Q&A：键为什么必须不可变', html:
      "符号表靠键的哈希值或比较结果定位。如果键对象在放进表之后被改，它可能落到错误的桶里，再 <code>get</code> 就找不到了。教材的规矩是：<b>用作键的对象要么不可变（String、Integer），要么保证入表后不再修改</b>。这也是第 07 章强调 <code>final</code> 字段的原因之一。<br><br>客户端只应该看到 <code>put</code>/<code>get</code>/<code>contains</code>/<code>size</code>，不应该看到「数组第 i 格存了什么」。站内第 10 章的 <code>GradeBook</code> 只暴露 add/find/size/average/rank，正是这个原则——内部用 List 还是 Map，外部不关心。<br><br>Map 的遍历顺序不是插入顺序（<code>HashMap</code>）；需要插入顺序用 <code>LinkedHashMap</code>，需要按键排序用 <code>TreeMap</code>。这也是站内第 10 章「按操作选容器」表里的一条。"
    },

    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch10-q1' },
    { t: 'quiz', qid: 'ch10-q2' },
    { t: 'quiz', qid: 'ch10-q3' },

    /* ------------------------------------------------------------------ 考试映射 */
    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      '<b>Midterm 2 与期末都反复出现，三种题型对应三个分值档：</b><br>' +
      '① <b>读代码写输出</b>：给一段 ArrayList / HashMap 操作，问 <code>size()</code>、打印结果或 ' +
      '<code>get</code> 的返回值。高频坑：<code>remove(int)</code> 删下标、<code>remove(Object)</code> 删对象；' +
      '遍历中删除导致漏删；<code>get</code> 不存在的键返回 <code>null</code>。' +
      '（本卷 M2 Q6 就是容器选型简答，M2 Q1(4) 是 <code>ArrayList.remove</code> 读输出。）<br>' +
      '② <b>选容器简答</b>：给场景问用哪个并说理由。答分要点是<b>操作 + 复杂度</b>：' +
      '"按下标频繁读取 → ArrayList O(1)；按唯一键查找 → HashMap 平均 O(1)"。只说"方便/快"拿不到分。<br>' +
      '③ <b>概念题</b>：ADT 与实现的区别、泛型的作用与类型擦除、为什么重写 equals 要连 hashCode 一起重写、' +
      '<code>ConcurrentModificationException</code> 是什么。<br>' +
      '<b>做读代码题的标准动作</b>：在草稿纸左侧写"集合当前内容 + size"，每执行一条改变集合的语句就更新一次，' +
      '特别标出"删了哪个下标之后谁前移了"。不要凭直觉在脑子里模拟集合。'
    },

    { t: 'keypoint', items: [
      { title: 'ADT', html: '先定义操作清单（接口），再谈实现；使用者只依赖操作，不依赖内部结构。' },
      { title: '集合三族', html: '<b>List</b> 有序可重复、<b>Set</b> 不重复、<b>Map</b> 键值对；三者都通过泛型指定元素类型。' },
      { title: 'ArrayList vs LinkedList', html: '数组按下标 O(1)、中间插入 O(n)；链表两端增删 O(1)、按下标 O(n)。' },
      { title: 'HashMap / HashSet', html: '哈希把键映射到桶，平均 O(1)；靠 <code>hashCode()</code> 与 <code>equals()</code> 工作。' },
      { title: '泛型', html: '<code>ArrayList&lt;E&gt;</code> 把类型检查提前到编译期，省掉强转；运行时被擦除。' },
      { title: '增强 for', html: '只能读；改循环变量不影响集合；遍历中直接删除不安全。' },
      { title: '遍历删除', html: '倒序删、迭代器 <code>remove()</code>、收集后统一删；否则抛 ConcurrentModificationException。' },
      { title: '选容器', html: '先问"按什么访问、做哪些操作、数据多大"，再用决策表；选错不报错，只会在数据量大时变慢。' }
    ] },

    { t: 'checklist', id: 'ch10', items: [
      '我能用一个例子说明 ADT 与实现分离的好处，并写出"接口 + 实现类"',
      '我能说出 List / Set / Map 的区别，并各举一个典型实现',
      '我能写出 ArrayList 的增删改查（add/get/set/remove/size/contains）',
      '我能说出 ArrayList 与 LinkedList 在四种操作上的快慢及原因',
      '我能用 HashMap 统计频次、用 HashSet 去重，并解释 <code>put</code> 是覆盖不是累加',
      '我理解泛型解决什么问题，知道 <code>remove(int)</code> 与 <code>remove(Object)</code> 的区别',
      '我知道遍历中删除的三种安全写法，能解释 ConcurrentModificationException',
      '我能按"操作 + 复杂度"回答"该选哪个容器"',
      '我能设计一个小 ADT：先列操作清单，再用合适的集合实现',
      '我能定位"不报错但结果错"的集合 bug（漏删 / 覆盖 / 重载选错）'
    ] },

    /* ------------------------------------------------------------------ 延伸阅读 */
    { t: 'p', html:
      '<b>延伸阅读</b>：教材 Sedgewick 第 4.4 节（Symbol Tables）讲了符号表这种 ADT 与哈希表实现，' +
      '对应本章的 HashMap；第 1.4 节（Arrays）里的"洗牌 / 直方图"可以换成用 List/Map 再写一遍。' +
      '站内第 08 章「继承、多态与抽象类」的接口部分、第 09 章「内存与引用」的 <code>equals</code> 语义，' +
      '是本章的直接前置；第 11 章「算法」会用本章的 List 实现排序、第 13 章会用 Big-O 把选容器的理由量化。' +
      '想练手可以到 <a href="#/quiz/ch10">题库 · ch10</a> 按章节筛选，或用首页的随机挑战抽题。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '让 AI 写"用 HashMap 统计词频"意义不大，但可以这样用：' +
      '① 把同一需求（如"按学号查成绩 + 按提交顺序输出名单"）发给它，让它分别用"只用 List""只用 Map""两者配合"写三版，' +
      '你自己比较可读性与操作代价；② 让它解释"为什么 remove(1) 和 remove(Integer.valueOf(1)) 结果不同"，' +
      '再用本章的 ListDemo 改一改验证；③ 让它出一道"选容器"场景题并给出评分要点，你按"操作 + 复杂度"作答、再对照。' +
      '<b>AI 很擅长写出正确但选错容器的代码</b>——检查它的理由里有没有复杂度，比检查代码本身更有用。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：抽象数据类型与集合：ADT 与实现分离、ArrayList/LinkedList/HashMap/HashSet、泛型与增强 for、按操作选容器、真实建模。<br>依据：Course Outline v5 的 Abstract Data Types / Java Collection Framework / Designing ADTs 部分；Sedgewick §4.1、§4.4。本站为个人整理的学习材料，与课程要求冲突时以老师和课程大纲为准；代码均在真实 JDK 上校验过。' }

  ]
});