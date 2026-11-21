/* =====================================================================
 * data/ch09.js · 第 09 章：内存与引用
 * 职责：栈与堆、值 vs 引用、String 的引用语义、== 与 equals、别名、
 *       值传递、浅拷贝/深拷贝、引用 bug 调试、两个完整案例
 * 对外 API：CSC.registerChapter({...})（内容块 schema 见 _dev/CONTRACT.md §4–§5）
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch09',
  num: '09',
  title: '内存与引用',
  en: 'Memory Management & References',
  goals: [
    '能画出变量、栈帧与堆对象之间的引用箭头（内存图）',
    '能解释 == 与 equals 的区别，并预测一段比较代码的输出',
    '能识别别名（aliasing），说清浅拷贝与深拷贝差在哪',
    '能解释"Java 只有值传递"，以及对象参数为什么看起来像引用传递',
    '能按"画图—标箭头—逐行更新"的流程调试引用类 bug'
  ],
  kp: [
    { id: 'ch09-1', title: '栈、堆与栈帧' },
    { id: 'ch09-2', title: '变量里存的是值还是引用' },
    { id: 'ch09-3', title: '== 与 equals' },
    { id: 'ch09-4', title: '别名 aliasing' },
    { id: 'ch09-5', title: 'Java 只有值传递' },
    { id: 'ch09-6', title: '浅拷贝与深拷贝' },
    { id: 'ch09-7', title: '引用 bug 的调试方法' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '先看一个真实会发生的怪事：同一个数组，调用 <code>changeElement(data)</code> 之后 <code>data[0]</code> 变成了 99；' +
      '可调用 <code>reassign(data)</code>（里面明明写了 <code>arr[0] = 7</code>）之后，<code>data[0]</code> 还是 99。' +
      '两个方法看起来都在"改数组"，结果一个生效、一个不生效。<br>' +
      '前八章的程序，行为都能从输出反推；这一章不一样：真正的故事发生在你看不见的地方——<b>内存</b>。' +
      '为什么 <code>b = a</code> 之后改 b 会连带改 a？为什么内容相同的字符串用 <code>==</code> 比是 false？' +
      '为什么方法里改了参数，有时生效有时不生效？答案都在<b>内存图（memory diagram）</b>里。'
    },

    { t: 'p', lead: true, html:
      '先运行下面这段程序，把两个输出记下来，再往下读。它只有 20 行，却包含本章所有坑的原型。'
    },

    { t: 'code', caption: 'OpeningBug.java · 同一数组，两种"修改"，结果不同', trace: true, code:
`public class OpeningBug {
    static void changeElement(int[] arr) {
        arr[0] = 99;              // write through the copied reference
    }

    static void reassign(int[] arr) {
        arr = new int[]{7, 7, 7}; // only moves this local copy of the arrow
        arr[0] = 7;
    }

    public static void main(String[] args) {
        int[] data = {1, 2, 3};
        changeElement(data);
        System.out.println(data[0]);   // 99

        reassign(data);
        System.out.println(data[0]);   // 99, NOT 7
    }
}
` },

    { t: 'p', html:
      '输出是 <code>99</code> 和 <code>99</code>。第二行不是 7，说明 <code>reassign</code> 里的两次赋值对外面毫无影响。' +
      '单步执行时你会看到关键差异：第一个方法里，形参 <code>arr</code> 和实参 <code>data</code> 的箭头指向<b>同一个</b>数组对象；' +
      '第二个方法里，<code>arr = new int[]{7,7,7}</code> 只是把形参自己的箭头改指向一个新对象，<code>data</code> 的箭头没动。' +
      '读完这一章，你应该能一眼看出这两段的区别，并画出箭头图。'
    },

    { t: 'p', html:
      '本章路线：先把内存分成栈和堆（一），再搞清变量里到底装了什么（二），然后依次拆开四个高频考点——' +
      '<code>==</code> 与 <code>equals</code>（三）、别名（四）、值传递（五）、浅拷贝与深拷贝（六）；' +
      '第七节用三个真实 bug 演示怎么调试，最后用两个 50 行以上的完整程序把全部概念串起来。'
    },

    { t: 'h', text: '一、栈与堆：两间屋子', id: 'ch09-1' },

    { t: 'p', html:
      'Java 程序运行时，内存分成两间屋子：<b>栈（stack）</b>和<b>堆（heap）</b>。' +
      '栈负责"谁在调用谁"，随方法调用自动进出；堆负责"东西放在哪"，<code>new</code> 出来的对象和数组都住在那里。' +
      '这句话背下来只要十秒，但它是后面所有结论的地基。'
    },

    { t: 'p', html:
      '<b>栈（stack）</b>像一摞盘子：只能从顶上放、从顶上取，后进先出（LIFO）。' +
      '每次调用方法，JVM 就在栈顶压入一个<b>栈帧（stack frame）</b>，装这次调用的参数和局部变量；' +
      '方法返回，栈帧被弹出，局部变量随之消失——这就是"局部变量活不过方法"。' +
      '递归能一层层展开，靠的正是每次调用都压一个新栈帧；递归太深会撑爆栈，抛 <code>StackOverflowError</code>。'
    },

    { t: 'p', html:
      '<b>堆（heap）</b>是一个大仓库。每个 <code>new</code> 出来的对象和数组都占一块地方，位置由 JVM 分配，' +
      '你拿不到也无需知道。你手里只有一张取货单——<b>引用（reference）</b>，记录对象在堆里的位置。' +
      '没有引用指向的对象会被<b>垃圾回收器（garbage collector）</b>回收。' +
      '所以 Java 里"把变量设成 null"不会立刻销毁对象，只是把取货单撕掉；仓库什么时候清，由 GC 决定。'
    },

    { t: 'p', html:
      '再强调一次栈帧的生命周期：进入方法压栈、返回时弹栈。递归之所以能"记住每一层"，就是因为每一层都有自己的栈帧；' +
      '但如果方法里创建的局部数组只被栈帧里的箭头指着，方法一返回，箭头消失，数组就变成垃圾等待回收。' +
      '反过来，只要还有一个箭头指向它——返回给调用者、或者存进某个对象的字段——对象就活着。' +
      '<b>"引用在，对象在"</b>是理解内存的第一句话。'
    },

    { t: 'svg', maxW: 760, caption: '栈帧装局部变量；箭头从变量指向堆对象。a、b 与 x 指向同一个数组 #1。', html:
`<svg viewBox="0 0 780 430" role="img" aria-label="栈与堆内存图">
  <defs>
    <marker id="ch09-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent2)"/>
    </marker>
  </defs>
  <rect x="16" y="16" width="300" height="390" rx="14" fill="var(--surface2)" stroke="var(--line2)" stroke-width="1.4"/>
  <text x="34" y="44" font-size="14" font-weight="700" fill="var(--accent)">栈 Stack</text>

  <rect x="32" y="76" width="268" height="164" rx="10" fill="var(--bg2)" stroke="var(--line2)"/>
  <text x="46" y="98" font-size="12" font-weight="600" fill="var(--text)">栈帧 main()</text>
  <text x="46" y="126" font-size="12" fill="var(--text2)">int n</text>
  <rect x="130" y="112" width="40" height="20" rx="4" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="150" y="127" font-size="12" text-anchor="middle" fill="var(--text)">5</text>
  <text x="46" y="156" font-size="12" fill="var(--text2)">Account acc</text>
  <text x="46" y="186" font-size="12" fill="var(--text2)">int[] a</text>
  <text x="46" y="216" font-size="12" fill="var(--text2)">int[] b</text>

  <rect x="32" y="260" width="268" height="126" rx="10" fill="var(--bg2)" stroke="var(--line2)"/>
  <text x="46" y="282" font-size="12" font-weight="600" fill="var(--text)">栈帧 sum(int[] x)</text>
  <text x="46" y="308" font-size="12" fill="var(--text2)">int[] x（指向 #1）</text>
  <text x="46" y="336" font-size="12" fill="var(--text2)">int total</text>
  <rect x="130" y="322" width="40" height="20" rx="4" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="150" y="337" font-size="12" text-anchor="middle" fill="var(--text)">16</text>
  <text x="46" y="370" font-size="11" fill="var(--text3)">sum 未返回，两帧同时存在</text>

  <rect x="380" y="16" width="384" height="390" rx="14" fill="var(--surface2)" stroke="var(--line2)" stroke-width="1.4"/>
  <text x="398" y="44" font-size="14" font-weight="700" fill="var(--accent2)">堆 Heap</text>
  <text x="398" y="62" font-size="11" fill="var(--text3)">new 出来的对象与数组</text>

  <rect x="398" y="80" width="330" height="118" rx="10" fill="var(--bg2)" stroke="var(--accent2)"/>
  <text x="414" y="104" font-size="12" font-weight="700" fill="var(--accent2)">#2  Account</text>
  <text x="414" y="132" font-size="12" fill="var(--text2)">owner = “Alice”</text>
  <text x="414" y="158" font-size="12" fill="var(--text2)">balance = 150</text>

  <rect x="398" y="240" width="330" height="150" rx="10" fill="var(--bg2)" stroke="var(--accent2)"/>
  <text x="414" y="264" font-size="12" font-weight="700" fill="var(--accent2)">#1  int[3]</text>
  <rect x="424" y="278" width="56" height="32" rx="4" fill="var(--accentSoft)" stroke="var(--accent)"/>
  <text x="452" y="299" font-size="13" text-anchor="middle" fill="var(--text)">7</text>
  <rect x="490" y="278" width="56" height="32" rx="4" fill="var(--accentSoft)" stroke="var(--accent)"/>
  <text x="518" y="299" font-size="13" text-anchor="middle" fill="var(--text)">9</text>
  <rect x="556" y="278" width="56" height="32" rx="4" fill="var(--accentSoft)" stroke="var(--accent)"/>
  <text x="584" y="299" font-size="13" text-anchor="middle" fill="var(--text)">3</text>
  <text x="452" y="328" font-size="10" text-anchor="middle" fill="var(--text3)">0</text>
  <text x="518" y="328" font-size="10" text-anchor="middle" fill="var(--text3)">1</text>
  <text x="584" y="328" font-size="10" text-anchor="middle" fill="var(--text3)">2</text>

  <line x1="300" y1="152" x2="392" y2="152" stroke="var(--accent2)" stroke-width="1.6" marker-end="url(#ch09-arw)"/>
  <line x1="300" y1="182" x2="392" y2="284" stroke="var(--accent2)" stroke-width="1.6" marker-end="url(#ch09-arw)"/>
  <line x1="300" y1="212" x2="392" y2="322" stroke="var(--accent2)" stroke-width="1.6" marker-end="url(#ch09-arw)"/>
  <text x="390" y="416" font-size="12" text-anchor="middle" fill="var(--text2)">a、b、sum 的 x 都指向 #1：三个引用，一个对象 —— 别名（aliasing）</text>
</svg>`
    },

    { t: 'terms', items: [
      { en: 'stack', zh: '栈', html: '方法调用的记录，每次调用对应一个栈帧。' },
      { en: 'heap', zh: '堆', html: '存放 <code>new</code> 出来的对象和数组。' },
      { en: 'reference', zh: '引用', html: '指向堆对象的地址，画图时写成箭头。' },
      { en: 'stack frame', zh: '栈帧', html: '一次调用的工作台：参数、局部变量、返回地址。' },
      { en: 'garbage collector', zh: '垃圾回收器', html: '回收不再被任何引用指向的对象。' }
    ] },

    { t: 'p', html:
      '读图规则只有一句：<b>栈里的盒子装数值或箭头，堆里的盒子装对象内容</b>。' +
      '考试画图时只要编号对得上、箭头方向对，就得分。画图时先写栈帧，再画堆对象，最后连箭头——' +
      '顺序反了容易漏掉"谁指向谁"。'
    },

    { t: 'code', caption: 'MemoryWalk.java · 点「单步」，看箭头怎么出现', trace: true, code:
`public class MemoryWalk {
    public static void main(String[] args) {
        int n = 5;                  // primitive: the value lives in the variable
        int[] a = new int[3];       // the array object lives on the heap; a points to it
        a[0] = 7;
        int[] b = a;                // copies the reference, not the array
        b[1] = 9;                   // changes the object through b; a sees it too
        b[2] = 3;
        System.out.println(a[1]);   // 9
        System.out.println(n);      // 5
    }
}
` },

    { t: 'p', html:
      '单步到第 4 行，a 指向 <code>#1</code>；执行完第 6 行，a、b 的箭头都指向 <code>#1</code>，堆里仍只有一个数组。' +
      '改 <code>b[1]</code> 时变的是 <code>#1</code> 的第 1 格——这就是"改了 b，a 也变"的全部秘密。'
    },

    { t: 'lab', id: 'memory' },

    { t: 'keypoint', items: [
      { title: '检查点 · 栈 vs 堆', html: '能说出栈帧什么时候创建、什么时候消失，以及为什么局部变量活不过方法。' },
      { title: '检查点 · 箭头', html: '看到 <code>int[] b = a;</code> 能立刻画出"两个箭头指向同一个堆对象"。' }
    ] },

    { t: 'h', text: '二、变量里存的是值还是引用', id: 'ch09-2' },

    { t: 'p', html:
      'Java 类型只有两类。八种<b>基本类型（primitive type）</b>：<code>byte</code>、<code>short</code>、' +
      '<code>int</code>、<code>long</code>、<code>float</code>、<code>double</code>、<code>char</code>、' +
      '<code>boolean</code>，变量里直接装数值；其余类型（<code>String</code>、数组、你写的类）都是' +
      '<b>引用类型（reference type）</b>，变量里装箭头。'
    },

    { t: 'table',
      head: ['类型', '变量里装什么', '执行 b = a 时复制什么', '例子'],
      rows: [
        ['基本类型', '数值本身', '数值的副本，此后互不相干', '<code>int</code>、<code>double</code>、<code>char</code>'],
        ['引用类型', '指向堆对象的引用', '引用的副本，两个变量指向同一对象', '<code>int[]</code>、<code>String</code>']
      ],
      caption: '口诀：类型名首字母小写（int）是基本类型，首字母大写（String）都是引用类型'
    },

    { t: 'code', caption: 'ValueVsRef.java · 结果相反：int 复制数值，int[] 复制箭头', code:
`public class ValueVsRef {
    public static void main(String[] args) {
        int x = 5;
        int y = x;        // copies the value 5
        y = 10;
        System.out.println(x);     // 5: x is unaffected

        int[] a = {5, 6};
        int[] b = a;      // copies the reference, not the array
        b[0] = 10;
        System.out.println(a[0]);  // 10: same memory
    }
}
` },

    { t: 'p', html:
      '一行结论：<b>赋值永远复制盒子里的东西</b>。基本类型盒子里是数值，复制后互不相干；' +
      '引用类型盒子里是箭头，复制后两个箭头指向同一个对象，所以通过任意一个箭头改对象，另一个都看得见。' +
      '注意"改对象"和"改箭头"是两件事：<code>b[0] = 10</code> 改的是对象，生效；<code>b = new int[3]</code> 改的是箭头，只影响 b 自己。'
    },

    { t: 'h', lvl: 3, text: 'String 也是引用类型——但它不可变' },

    { t: 'p', html:
      '<code>String</code> 是引用类型，变量里装的也是箭头。但它有一个特殊性质：<b>不可变（immutable）</b>——' +
      '字符串对象一旦创建，内容永远不能改。所有看起来"修改字符串"的方法（<code>+</code>、<code>substring</code>、' +
      '<code>replace</code>、<code>toUpperCase</code>）都返回<b>新对象</b>，原对象纹丝不动。' +
      '所以 <code>s = s + "!"</code> 的真实含义是：造一个新字符串，然后把 s 的箭头改指向新对象。'
    },

    { t: 'code', caption: 'StringRef.java · 拼接只改箭头，字面量会被复用', code:
`public class StringRef {
    public static void main(String[] args) {
        String s = "java";
        String t = s;              // t copies the arrow: same object
        s = s + "!";               // creates a NEW string; t still points to "java"
        System.out.println(s);     // java!
        System.out.println(t);     // java
        System.out.println(s == t); // false

        String a = "hi";
        String b = "hi";           // literals are reused from the string pool
        System.out.println(a == b);      // true: one pooled object
        String c = new String("hi");     // new always creates a fresh object
        System.out.println(a == c);      // false
        System.out.println(a.equals(c)); // true: same content
    }
}
` },

    { t: 'p', html:
      '两个结论：① <b>"修改"字符串永远不会影响别的引用</b>，因为每次都是造新对象——这让字符串可以安全共享；' +
      '② 字面量 <code>"hi"</code> 会被<b>字符串常量池（string pool）</b>复用，所以两个相同字面量常常是同一个对象，' +
      '<code>==</code> 有时"碰巧"是 true。别依赖这个巧合：<b>比较字符串内容一律用 <code>equals</code></b>。'
    },

    { t: 'callout', kind: 'warn', title: '不可变的代价', html:
      '循环里用 <code>s = s + x</code> 拼接，每轮都会创建一个新字符串，n 轮产生 n 个临时对象（旧第 10 章会用 ' +
      '<code>StringBuilder</code> 解决）。这不是正确性问题，但在大数据量下会明显变慢——' +
      '"不可变"换来了安全，代价是复制。'
    },

    { t: 'h', text: '三、== 与 equals', id: 'ch09-3' },

    { t: 'p', html:
      '<code>==</code> 只做一件事：比较两个盒子里的东西是否相同。对基本类型比数值；对引用类型比"是否指向同一对象"——比的是<b>地址</b>。' +
      '换句话说，<code>==</code> 问的是"是不是同一个东西"，而不是"长得一不一样"。'
    },

    { t: 'p', html:
      '<code>equals</code> 是 <code>Object</code> 类定义的方法，默认实现就是 <code>this == other</code>——' +
      '也就是说，<b>不重写的话它和 == 一样</b>。但 <code>String</code>、<code>Integer</code> 这些类<b>重写（override）</b>了它，改成比较内容。' +
      '所以判断字符串内容必须用 <code>equals</code>；数组没有重写 <code>equals</code>，要比内容得用 <code>Arrays.equals</code>。'
    },

    { t: 'code', caption: 'EqualsDemo.java · 运行前先预测每个布尔值', code:
`public class EqualsDemo {
    public static void main(String[] args) {
        String s1 = new String("java");
        String s2 = new String("java");
        System.out.println(s1 == s2);       // false: two different objects
        System.out.println(s1.equals(s2));  // true: same content

        int[] a = {1, 2, 3};
        int[] b = {1, 2, 3};
        System.out.println(a == b);         // false
        System.out.println(a.equals(b));    // false: arrays do not override equals

        int x = 7;
        int y = 7;
        System.out.println(x == y);         // true: compares values
    }
}
` },

    { t: 'callout', kind: 'warn', title: '两个必须记住的坑', html:
      '① <b>数组没有重写 equals</b>：<code>a.equals(b)</code> 等价于 <code>a == b</code>，内容相同也返回 false；' +
      '比较数组内容要用 <code>Arrays.equals(a, b)</code>。<br>' +
      '② <b>字符串字面量会复用常量池里的同一个对象</b>，所以 <code>"java" == "java"</code> 为 true。这是实现细节，' +
      '考试中判断字符串内容<b>一律用 equals</b>，不要拿 == 赌运气。'
    },

    { t: 'table',
      head: ['表达式', '两边类型', '比较什么', '结果'],
      rows: [
        ['<code>3 == 3</code>', '<code>int</code>', '数值', '<code>true</code>'],
        ['<code>s1 == s2</code>（两个 new String）', '<code>String</code>', '引用（地址）', '<code>false</code>'],
        ['<code>s1.equals(s2)</code>', '<code>String</code>', '字符内容', '<code>true</code>'],
        ['<code>a == b</code>（两个内容相同的 int[]）', '<code>int[]</code>', '引用（地址）', '<code>false</code>'],
        ['<code>a.equals(b)</code>（数组）', '<code>int[]</code>', '引用（未重写）', '<code>false</code>'],
        ['<code>Arrays.equals(a, b)</code>', '<code>int[]</code>', '逐个元素', '<code>true</code>']
      ],
      caption: '先看类型，再判断比的是数值、地址还是内容'
    },

    { t: 'p', html:
      '顺带回答一个常被问到的问题：Java 为什么不允许自己重载 <code>==</code>？因为 <code>==</code> 是语言层面的"盒子比较"，' +
      '如果允许重载，同一个符号在不同类型上会有完全不同的含义，读代码的人就无法只凭上下文判断。Java 的选择是：' +
      '<code>==</code> 永远只有一种含义（比数值或比地址），要比较内容就显式调用 <code>equals</code>——' +
      '用"多写几个字符"换"读代码不用猜"。'
    },

    { t: 'h', lvl: 3, text: '自己写的类：equals 默认比地址' },

    { t: 'p', html:
      '如果你写一个 <code>Point</code> 类，new 出两个坐标相同的点，<code>equals</code> 会返回 <b>false</b>——' +
      '因为它继承的是 <code>Object.equals</code>，也就是 <code>==</code>。想让"内容相同即相等"，必须自己重写：' +
      '先判 <code>this</code>、再判 <code>null</code>、再判类型（<code>instanceof</code>）、最后强转逐字段比较。' +
      '这四步几乎是模板，考试写"重写 equals"就按这个顺序写。'
    },

    { t: 'code', caption: 'PointEquals.java · 不重写就比地址，重写后比内容', code:
`public class PointEquals {
    public static void main(String[] args) {
        Point p = new Point(1, 2);
        Point q = new Point(1, 2);
        Point r = p;

        System.out.println(p == q);        // false: two objects
        System.out.println(p == r);        // true: same object
        System.out.println(p.equals(q));   // true: content compared by our override
        System.out.println(p.equals(r));   // true
        System.out.println(p.equals("x")); // false: different type
    }
}

class Point {
    private int x;
    private int y;

    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) return true;              // 1) same object
        if (other == null) return false;             // 2) null
        if (!(other instanceof Point)) return false; // 3) type check
        Point p = (Point) other;                     // 4) cast, then compare fields
        return this.x == p.x && this.y == p.y;
    }
}
` },

    { t: 'p', html:
      '注意两个细节：① 参数类型必须是 <code>Object</code> 而不是 <code>Point</code>，否则那是重载不是重写，' +
      '<code>equals</code> 的多态派发会绕过你写的方法；② 重写 <code>equals</code> 最好连 <code>hashCode</code> 一起重写，' +
      '否则对象放进 <code>HashMap</code> / <code>HashSet</code> 会找不到（第 10 章讲集合时会回到这一点）。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 三种相等', html: '能分别说清"同一个对象"（==）、"内容相同"（equals）、"数组内容相同"（Arrays.equals）。' },
      { title: '检查点 · 为什么', html: '能解释 <code>"hi" == "hi"</code> 为什么是 true，以及为什么仍然不该这么写。' }
    ] },

    { t: 'h', text: '四、别名：一个对象，多个名字', id: 'ch09-4' },

    { t: 'p', html:
      '两个或更多引用指向同一个对象，叫<b>别名（aliasing）</b>。它不是语法错误，却是 bug 温床：改一个，另一个也变。' +
      '上一节 <code>Account bob = alice</code> 的效果不是"复制了一个账户"，而是"给同一个账户又起了个名字"。'
    },

    { t: 'code', caption: 'AliasDemo.java · 运行，看 bob 怎么改到了 alice', code:
`public class AliasDemo {
    public static void main(String[] args) {
        Account alice = new Account("Alice", 100);
        Account bob = alice;              // copies the reference, not the account
        bob.deposit(50);
        System.out.println(alice.getBalance()); // 150
        System.out.println(alice == bob);       // true
    }
}

class Account {
    private String owner;
    private int balance;

    public Account(String owner, int balance) {
        this.owner = owner;
        this.balance = balance;
    }

    public void deposit(int amount) {
        balance += amount;
    }

    public int getBalance() {
        return balance;
    }
}
` },

    { t: 'p', html:
      '本意也许是"给 bob 开一个一样的账户"，实际是两人共用一个账户。想真正独立，必须 <code>new</code> 新对象或复制内容。' +
      '不过别名不一定坏：下面的值传递正是利用它修改调用者的对象。判断标准只有一句——<b>你想让两边共享，还是想让两边独立</b>？' +
      '共享就保留别名，独立就深拷贝。'
    },

    { t: 'h', text: '五、Java 只有值传递', id: 'ch09-5' },

    { t: 'p', html:
      '本章最容易被误解的一句话：<b>Java 只有值传递（pass by value），没有引用传递（pass by reference）</b>。' +
      '调用方法时，实参盒子里的东西被复制一份给形参：基本类型复制数值，引用类型复制箭头。' +
      '"传引用"这个说法不准确，准确的说法是"传引用的副本"。'
    },

    { t: 'steps', items: [
      { title: '传基本类型', html: '复制数值。方法里把形参改成 999，调用者的变量纹丝不动。' },
      { title: '传对象', html: '复制箭头。形参与实参指向同一对象，通过形参改对象内容，调用者看得见。' },
      { title: '让形参重新指向', html: '<code>arr = new int[3];</code> 只改了形参那份副本，调用者的箭头还指着老对象。' },
      { title: '结论', html: '对象参数"像引用传递"是因为两个箭头指向同一对象；但箭头本身永远是复制来的。' }
    ] },

    { t: 'p', html:
      '为什么 Java 不做引用传递？因为引用传递会让"方法能不能改调用者的变量"变成一件必须研究方法内部实现才能确定的事。' +
      '值传递的规则简单到一句话：<b>方法只会拿到副本，想让调用者看见结果，就必须 return 或通过对象内容回写</b>。' +
      '这条规则牺牲了一点语法便利，换来的是"只看方法签名就能推理行为"的可预测性。'
    },

    { t: 'code', caption: 'PassDemo.java · 三个方法，三种结果', code:
`public class PassDemo {
    static void changeInt(int x) {
        x = 999;              // changes the copy
    }

    static void fill(int[] arr) {
        arr[0] = 99;          // changes the object through the copied reference
    }

    static void replace(int[] arr) {
        arr = new int[3];     // makes the parameter point to a new array
        arr[0] = 7;
    }

    public static void main(String[] args) {
        int n = 1;
        changeInt(n);
        System.out.println(n);          // 1

        int[] data = {1, 2, 3};
        fill(data);
        System.out.println(data[0]);    // 99

        replace(data);
        System.out.println(data[0]);    // 99, not replaced by 7
    }
}
` },

    { t: 'callout', kind: 'warn', title: '别被 fill 的效果骗了', html:
      '有人看到 <code>fill(data)</code> 改了数组，就断言"Java 是引用传递"。恰恰相反：正因为传的是<b>引用的副本</b>，' +
      '形参和实参才指向同一数组。如果真是引用传递，<code>replace</code> 里的重新赋值就该让调用者的 data 也指向新数组——它没有。'
    },

    { t: 'p', html:
      '做这类题有个三问口诀：<b>① 方法里改的是"对象内容"还是"形参的箭头"？</b>' +
      '只有前者能让调用者看见变化。<b>② 形参有没有被重新赋值（<code>arr = ...</code>、<code>arr = new ...</code>）？</b>' +
      '有就只影响方法内部。<b>③ 实参本身是基本类型还是引用类型？</b>基本类型连对象内容都改不了。' +
      '三问走完，答案就出来了，不需要在脑子里跑整个程序。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 值传递', html: '能用一句话解释"为什么 fill 能改数组，replace 却不能换掉数组"，并说出"引用的副本"。' },
      { title: '检查点 · 口诀', html: '拿到"方法改参数"的题，能先问"改内容还是改箭头"。' }
    ] },

    { t: 'h', text: '六、浅拷贝与深拷贝', id: 'ch09-6' },

    { t: 'p', html:
      '想要真正独立的副本，得自己拷贝。麻烦在于对象里常存着别的对象的引用。' +
      '只复制外层、内层继续共享叫<b>浅拷贝（shallow copy）</b>；连内部数组也复制叫<b>深拷贝（deep copy）</b>。' +
      '<code>Arrays.copyOf</code> 对基本类型数组是"真复制"，对对象数组（含二维数组）只复制外层引用。'
    },

    { t: 'svg', maxW: 700, caption: '浅拷贝共享内部数组；深拷贝连数组内容一起复制。', html:
`<svg viewBox="0 0 720 330" role="img" aria-label="浅拷贝与深拷贝对比">
  <defs>
    <marker id="ch09-arw2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent2)"/>
    </marker>
  </defs>
  <rect x="16" y="20" width="330" height="290" rx="14" fill="var(--surface2)" stroke="var(--line2)" stroke-width="1.4"/>
  <text x="34" y="48" font-size="13" font-weight="700" fill="var(--warn)">浅拷贝 shallow copy</text>
  <rect x="36" y="72" width="112" height="64" rx="8" fill="var(--bg2)" stroke="var(--line2)"/>
  <text x="92" y="96" font-size="12" text-anchor="middle" fill="var(--text)">Box #2</text>
  <text x="92" y="118" font-size="11" text-anchor="middle" fill="var(--text3)">values</text>
  <rect x="36" y="176" width="112" height="64" rx="8" fill="var(--bg2)" stroke="var(--line2)"/>
  <text x="92" y="200" font-size="12" text-anchor="middle" fill="var(--text)">Box #3</text>
  <text x="92" y="222" font-size="11" text-anchor="middle" fill="var(--text3)">values</text>
  <rect x="204" y="98" width="124" height="110" rx="8" fill="var(--bg2)" stroke="var(--accent)"/>
  <text x="266" y="122" font-size="12" text-anchor="middle" fill="var(--accent)">#1 int[3]</text>
  <rect x="214" y="136" width="30" height="26" rx="3" fill="var(--accentSoft)" stroke="var(--accent)"/>
  <text x="229" y="154" font-size="11" text-anchor="middle" fill="var(--text)">1</text>
  <rect x="250" y="136" width="30" height="26" rx="3" fill="var(--accentSoft)" stroke="var(--accent)"/>
  <text x="265" y="154" font-size="11" text-anchor="middle" fill="var(--text)">2</text>
  <rect x="286" y="136" width="30" height="26" rx="3" fill="var(--accentSoft)" stroke="var(--accent)"/>
  <text x="301" y="154" font-size="11" text-anchor="middle" fill="var(--text)">3</text>
  <text x="266" y="190" font-size="10" text-anchor="middle" fill="var(--text3)">共享数组</text>
  <line x1="148" y1="104" x2="200" y2="130" stroke="var(--accent2)" stroke-width="1.6" marker-end="url(#ch09-arw2)"/>
  <line x1="148" y1="208" x2="200" y2="176" stroke="var(--accent2)" stroke-width="1.6" marker-end="url(#ch09-arw2)"/>
  <text x="34" y="272" font-size="11" fill="var(--text2)">两个 Box 指向同一数组</text>
  <text x="34" y="292" font-size="11" fill="var(--text2)">改一处，另一处也变</text>

  <rect x="374" y="20" width="330" height="290" rx="14" fill="var(--surface2)" stroke="var(--line2)" stroke-width="1.4"/>
  <text x="392" y="48" font-size="13" font-weight="700" fill="var(--ok)">深拷贝 deep copy</text>
  <rect x="394" y="66" width="100" height="60" rx="8" fill="var(--bg2)" stroke="var(--line2)"/>
  <text x="444" y="90" font-size="12" text-anchor="middle" fill="var(--text)">Box #4</text>
  <text x="444" y="112" font-size="11" text-anchor="middle" fill="var(--text3)">values</text>
  <rect x="540" y="60" width="140" height="86" rx="8" fill="var(--bg2)" stroke="var(--ok)"/>
  <text x="610" y="82" font-size="11" text-anchor="middle" fill="var(--ok)">#2 int[3]</text>
  <rect x="550" y="90" width="30" height="26" rx="3" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="565" y="108" font-size="11" text-anchor="middle" fill="var(--text)">1</text>
  <rect x="586" y="90" width="30" height="26" rx="3" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="601" y="108" font-size="11" text-anchor="middle" fill="var(--text)">2</text>
  <rect x="622" y="90" width="30" height="26" rx="3" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="637" y="108" font-size="11" text-anchor="middle" fill="var(--text)">3</text>
  <line x1="494" y1="96" x2="536" y2="96" stroke="var(--accent2)" stroke-width="1.6" marker-end="url(#ch09-arw2)"/>

  <rect x="394" y="180" width="100" height="60" rx="8" fill="var(--bg2)" stroke="var(--line2)"/>
  <text x="444" y="204" font-size="12" text-anchor="middle" fill="var(--text)">Box #5</text>
  <text x="444" y="226" font-size="11" text-anchor="middle" fill="var(--text3)">values</text>
  <rect x="540" y="174" width="140" height="86" rx="8" fill="var(--bg2)" stroke="var(--ok)"/>
  <text x="610" y="196" font-size="11" text-anchor="middle" fill="var(--ok)">#3 int[3]</text>
  <rect x="550" y="204" width="30" height="26" rx="3" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="565" y="222" font-size="11" text-anchor="middle" fill="var(--text)">1</text>
  <rect x="586" y="204" width="30" height="26" rx="3" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="601" y="222" font-size="11" text-anchor="middle" fill="var(--text)">2</text>
  <rect x="622" y="204" width="30" height="26" rx="3" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="637" y="222" font-size="11" text-anchor="middle" fill="var(--text)">3</text>
  <line x1="494" y1="210" x2="536" y2="210" stroke="var(--accent2)" stroke-width="1.6" marker-end="url(#ch09-arw2)"/>
  <text x="392" y="272" font-size="11" fill="var(--text2)">每个 Box 有自己的数组</text>
  <text x="392" y="292" font-size="11" fill="var(--text2)">改一处，另一处不受影响</text>
</svg>`
    },

    { t: 'code', caption: 'CopyDemo.java · 改的是共享还是独立，看原数组就知道', code:
`public class CopyDemo {
    public static void main(String[] args) {
        int[] nums = {1, 2, 3};

        Box shallow = new Box(nums);        // shallow: shares nums
        Box deep = new Box(nums, true);     // deep: copies the content of nums

        shallow.values[0] = 99;
        System.out.println(nums[0]);        // 99: shallow copy changed the original

        deep.values[1] = 42;
        System.out.println(nums[1]);        // 2: deep copy is independent
    }
}

class Box {
    int[] values;

    Box(int[] values) {                     // shallow: stores the reference only
        this.values = values;
    }

    Box(int[] values, boolean deep) {       // deep: copies element by element
        if (deep) {
            this.values = new int[values.length];
            for (int i = 0; i < values.length; i++) {
                this.values[i] = values[i];
            }
        } else {
            this.values = values;
        }
    }
}
` },

    { t: 'compare', left: {
      title: '浅拷贝 shallow copy',
      html: '只复制第一层，引用类型字段仍指向同一对象。快、代码少，内层不独立。<code>Arrays.copyOf</code> 对对象数组仍是浅拷贝。'
    }, right: {
      title: '深拷贝 deep copy',
      html: '递归复制每一层，包括内部数组和对象。慢、代码多（要处理循环引用），但副本完全独立。'
    } },

    { t: 'p', html:
      '什么时候必须深拷贝？判断标准：<b>副本和原对象会不会各自修改内部数据</b>。' +
      '如果两个对象都要独立增删改内部数组，就必须深拷贝；如果内部数据是只读的，浅拷贝反而更省内存。' +
      '这也是"不可变对象可以安全共享"的原因——不可变对象根本不需要拷贝。'
    },

    { t: 'p', html:
      '工程上更常见的做法是把"怎么拷贝"封装进类里，而不是在每个调用点写循环：① <b>拷贝构造器</b>（<code>new Book(other)</code>）；' +
      '② <b>静态工厂方法</b>（<code>Book.copyOf(b)</code>）；③ 让类变成<b>不可变</b>（字段 <code>final</code>、不给 setter），这样连拷贝都不用。' +
      '前两种把"深还是浅"的决定收进一个地方，调用者不会漏掉某一层；第三种从根上消除了共享带来的风险。'
    },

    { t: 'h', lvl: 3, text: '二维数组：Arrays.copyOf 只拷了外层' },

    { t: 'p', html:
      '二维数组本质是"数组的数组"，外层每个元素是一个指向内层一维数组的引用。' +
      '所以 <code>Arrays.copyOf(grid, grid.length)</code> 只复制了这些引用，行数组仍然共享——' +
      '改 <code>shallow[0][0]</code> 会改到原数组。真正的深拷贝必须逐行再复制一次。'
    },

    { t: 'code', caption: 'ShallowDeepArrays.java · 同一个 grid，浅拷贝共享行、深拷贝独立', code:
`import java.util.Arrays;

public class ShallowDeepArrays {
    public static void main(String[] args) {
        int[][] grid = {{1, 2}, {3, 4}};

        int[][] shallow = Arrays.copyOf(grid, grid.length);  // shallow: row references copied
        shallow[0][0] = 99;
        System.out.println(grid[0][0]);      // 99: the row array is shared

        int[][] deep = new int[grid.length][];               // deep: copy every row too
        for (int i = 0; i < grid.length; i++) {
            deep[i] = Arrays.copyOf(grid[i], grid[i].length);
        }
        deep[1][1] = 42;
        System.out.println(grid[1][1]);      // 4: deep copy stays independent
        System.out.println(deep[1][1]);      // 42
    }
}
` },

    { t: 'p', html:
      '结论：<b>拷贝的深度取决于"复制到第几层引用"</b>。一行 <code>Arrays.copyOf</code> 只到第一层；' +
      '要独立到第 n 层，就得写 n 层循环（或者用对象自己的拷贝构造器/工厂方法封装起来，见案例 B）。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 浅 vs 深', html: '能说出 <code>Arrays.copyOf</code> 对一维基本类型数组是深、对二维/对象数组是浅，并解释原因。' }
    ] },

    { t: 'h', text: '边界与反例：五个常见误解' },

    { t: 'table',
      head: ['说法', '真相', '怎么记'],
      rows: [
        ['<code>String s = "a"; s += "b";</code> 改掉了原对象', '错。造了新串，s 换箭头，别的引用仍指向 "a"', 'String 不可变'],
        ['<code>final int[] a</code> 里面的元素也不能改', '错。<code>final</code> 锁的是箭头，元素照样能改', 'final 管变量，不管对象'],
        ['数组 <code>a.clone()</code> / <code>Arrays.copyOf</code> 一定是深拷贝', '错。一维基本类型是深，二维/对象数组是浅', '看被复制的东西是不是引用'],
        ['对象参数是"引用传递"', '错。传的是引用的副本；能改内容、不能换对象', 'Java 只有值传递'],
        ['<code>a.equals(b)</code> 对数组比较内容', '错。数组没重写 equals，等价于 a == b', '用 <code>Arrays.equals</code>']
      ],
      caption: '这五条覆盖了期中卷面上 80% 的引用类判断题'
    },

    { t: 'p', html:
      '再补一个容易混的：<code>null</code> 不是"空对象"，而是"没有箭头"。' +
      '声明 <code>String[] names = new String[3];</code> 只是造了三个空槽位，每个槽位都是 <code>null</code>；' +
      '在给槽位赋值之前调用它的方法，就会抛 <code>NullPointerException</code>——下一节的第 2 个 bug 就是这样。'
    },

    { t: 'h', text: '七、调试实录：三个真实 bug', id: 'ch09-7' },

    { t: 'p', html:
      '引用类 bug 的共同点是"程序不报错，结果就是不对"。调试它们有一套固定流程，不要凭感觉改代码：' +
      '<b>① 在纸上画栈帧</b>（每个变量一个盒子）；<b>② 每执行一行，更新谁指向谁</b>（箭头只有两种变化：改内容、改箭头）；' +
      '<b>③ 找到"你以为共享/独立，实际相反"的那一行</b>。下面三个案例都按这个流程走。'
    },

    { t: 'steps', items: [
      { title: '先定位症状', html: '是编译错误、运行时异常，还是"能跑但结果不对"？引用类 bug 绝大多数属于第三种。' },
      { title: '画图而不是读代码', html: '把变量画成盒子、对象画成编号方块，逐行连箭头。脑子里的"应该"经常是错的。' },
      { title: '只改一处再验证', html: '一次只改一个假设（改 == 为 equals / 加 new / 加 copy 循环），跑一遍确认。' }
    ] },

    { t: 'p', html:
      '还有一个提效技巧：<b>把 bug 缩成最小复现（minimal reproduction）</b>。如果 200 行的程序结果不对，' +
      '先删到只剩"造对象、调方法、打印结果"三块，能复现再逐步加回去。引用类 bug 在最小程序里往往一眼就能看出来，' +
      '因为剩下的每一行都必须为它负责。'
    },

    { t: 'h', lvl: 3, text: '案例 1：字符串用 == 比较，分支永远走错' },

    { t: 'p', html:
      '需求是"输入 YES 就通过"。代码用 <code>==</code> 比较，键盘输入明明打了 YES，却总是 rejected。' +
      '原因：从输入/拼接得来的字符串是新对象，而字面量 <code>"YES"</code> 在常量池里，两者地址不同。'
    },

    { t: 'code', caption: 'DebugCase1.java · 用 new String 模拟"读进来的字符串"', code:
`public class DebugCase1 {
    public static void main(String[] args) {
        String input = new String("YES");   // simulate a string read from input
        if (input == "YES") {
            System.out.println("accepted");
        } else {
            System.out.println("rejected");  // this is what actually prints
        }
        System.out.println(input == "YES");      // false: different objects
        System.out.println(input.equals("YES")); // true: same content
    }
}
` },

    { t: 'p', html:
      '定位过程：① 打印 <code>input == "YES"</code> 得到 false，说明不是内容问题而是地址问题；' +
      '② 再看 <code>equals</code> 返回 true，确认内容一致；③ 结论是"比较方式选错了"。' +
      '修复：把条件改成 <code>input.equals("YES")</code>；如果担心大小写，用 <code>input.trim().toUpperCase().equals("YES")</code>。' +
      '注意常量写在前面（<code>"YES".equals(input)</code>）还能避免 input 为 null 时的空指针。'
    },

    { t: 'h', lvl: 3, text: '案例 2：空的槽位，一调用就抛异常' },

    { t: 'p', html:
      '第二个 bug 会抛异常，比第一个好查。数组只造了外壳、没给元素赋值，槽位默认是 <code>null</code>；' +
      '对 <code>null</code> 调用任何方法都会抛 <code>NullPointerException</code>（NPE）——Java 世界最常见的运行时异常。'
    },

    { t: 'code', caption: 'DebugCase2.java · 第 5 行故意抛 NullPointerException', code:
`public class DebugCase2 {
    public static void main(String[] args) {
        String[] names = new String[3];
        System.out.println(names[0] == null);   // true: slots default to null
        System.out.println(names[0].length());  // NullPointerException here
    }
}
` },

    { t: 'p', html:
      '运行后控制台会显示 <code>Exception in thread "main" java.lang.NullPointerException</code>，并指出出错行。' +
      '定位过程：报错行是第 5 行，那里唯一的可疑点是 <code>names[0]</code>；上一行刚确认它是 null，于是问题清楚——' +
      '<b>对象数组只造了数组本身，没有 new 元素</b>。修复：<code>names[0] = "Alice";</code> 之后再调用方法，' +
      '或者先判 <code>if (names[0] != null)</code>。'
    },

    { t: 'h', lvl: 3, text: '案例 3：方法里重新赋值，调用者看不到' },

    { t: 'p', html:
      '第三个 bug 就是本章开头那段 <code>reassign</code>：方法里写了 <code>arr = new int[]{7,7,7}</code>，' +
      '以为能换掉调用者的数组，结果外面毫无变化。定位关键是分清两种赋值：' +
      '<code>arr[0] = 99</code>（改对象内容，共享可见）和 <code>arr = new ...</code>（改形参箭头，只影响方法内部）。' +
      '修复有两条路：① 让方法<b>返回</b>新数组，调用者用 <code>data = fix(data)</code> 接收；' +
      '② 传一个已有对象进来，方法只改它的字段/元素（这就是 <code>fill</code> 的做法）。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 三个 bug', html: '能说出每个 bug 是"地址 vs 内容"、"null"还是"改箭头 vs 改内容"三类中的哪一类。' },
      { title: '检查点 · 流程', html: '遇到"能跑但不对"的引用题，会先画栈帧图，而不是直接读代码。' }
    ] },

    { t: 'h', text: '完整案例 A：成绩统计与排序', id: 'ch09-8' },

    { t: 'p', html:
      '下面这段程序把本章所有概念用在一处：<code>total</code> 只读数组（不改调用者）、' +
      '<code>sortDescending</code> 原地排序（<b>会</b>改调用者）、<code>boosted</code> 返回新数组（不改调用者）。' +
      '读之前先预测：<code>backup</code> 会不会被排序影响？<code>cs</code> 和 <code>bumped</code> 是不是同一个对象？'
    },

    { t: 'code', caption: 'GradeReport.java · 近 60 行完整程序：读、改、复制三种语义', code:
`import java.util.Arrays;

public class GradeReport {
    // 1) sum: only reads. The parameter is a copy of the reference.
    static int total(int[] scores) {
        int sum = 0;
        for (int i = 0; i < scores.length; i++) {
            sum = sum + scores[i];
        }
        return sum;
    }

    // 2) average: empty array is a boundary case
    static double average(int[] scores) {
        if (scores.length == 0) return 0.0;
        return (double) total(scores) / scores.length;
    }

    // 3) in-place: changes the caller's array through the copied reference
    static void sortDescending(int[] scores) {
        for (int i = 0; i < scores.length - 1; i++) {
            int maxIdx = i;
            for (int j = i + 1; j < scores.length; j++) {
                if (scores[j] > scores[maxIdx]) maxIdx = j;
            }
            int t = scores[i];
            scores[i] = scores[maxIdx];
            scores[maxIdx] = t;
        }
    }

    // 4) returns a new array: the argument stays untouched
    static int[] boosted(int[] scores, int bonus) {
        int[] result = new int[scores.length];
        for (int i = 0; i < scores.length; i++) {
            result[i] = scores[i] + bonus;
        }
        return result;
    }

    public static void main(String[] args) {
        int[] cs = {72, 95, 60, 88};
        int[] backup = Arrays.copyOf(cs, cs.length);   // an independent copy

        System.out.println("total = " + total(cs));
        System.out.printf("average = %.2f%n", average(cs));

        sortDescending(cs);            // in place: cs is rearranged
        System.out.println("sorted = " + Arrays.toString(cs));
        System.out.println("backup = " + Arrays.toString(backup));

        int[] bumped = boosted(cs, 5);  // returns a new array: cs unchanged
        System.out.println("bumped = " + Arrays.toString(bumped));
        System.out.println("cs     = " + Arrays.toString(cs));
        System.out.println("same?  = " + (cs == bumped));
        System.out.println("empty avg = " + average(new int[0]));
    }
}
` },

    { t: 'table',
      head: ['方法', '会改调用者的数组吗', '为什么'],
      rows: [
        ['<code>total</code>', '不会', '只读 <code>scores[i]</code>，没写回任何位置'],
        ['<code>average</code>', '不会', '调用 total，只读'],
        ['<code>sortDescending</code>', '<b>会</b>', '通过引用的副本写 <code>scores[i] = ...</code>，改的是共享对象'],
        ['<code>boosted</code>', '不会', '新建 <code>result</code> 数组并返回，原数组不动']
      ],
      caption: '同一个"传数组"动作，四种方法三种语义——区别只在"有没有写回共享对象"'
    },

    { t: 'p', html:
      '逐段看几个关键点。① <code>backup</code> 用 <code>Arrays.copyOf</code> 复制，所以排序后它还是原来的顺序——' +
      '如果写成 <code>int[] backup = cs;</code>，排序后 backup 也会变（别名）。' +
      '② <code>sortDescending(cs)</code> 的实参和形参是两个箭头、指向同一个数组，所以原地排序生效。' +
      '③ <code>boosted</code> 里 <code>new int[...]</code> 造了新对象，<code>result</code> 的箭头指向新数组，' +
      '所以 <code>cs == bumped</code> 是 false。④ <code>average(new int[0])</code> 演示边界：空数组要单独处理，否则除零得到 NaN。' +
      '这四个点，正好对应卷面上"问输出"题的四种出法。'
    },

    { t: 'h', text: '完整案例 B：对象数组的深拷贝', id: 'ch09-9' },

    { t: 'p', html:
      '真实项目里更常见的是"对象里装着数组"。下面用 <code>Student</code> 演示：' +
      '浅拷贝构造器只复制字段（<code>scores</code> 仍共享），深拷贝构造器逐个元素复制数组，副本才真正独立。' +
      '注意两个构造器签名不同（<code>Student(String, int[])</code> 与 <code>Student(Student, boolean)</code>），这是合法重载。'
    },

    { t: 'code', caption: 'DeepCopyDemo.java · 同一个对象，浅拷贝和深拷贝两种副本', code:
`import java.util.Arrays;

public class DeepCopyDemo {
    public static void main(String[] args) {
        Student alice = new Student("Alice", new int[]{80, 90});
        Student shallow = new Student(alice, false);   // shallow: shares the array
        Student deep = new Student(alice, true);       // deep: copies the array

        shallow.scores[0] = 0;                         // leaks into alice
        deep.scores[1] = 0;                            // stays inside deep

        System.out.println("alice   = " + alice.scoreList());   // [0, 90]
        System.out.println("shallow = " + shallow.scoreList()); // [0, 90]
        System.out.println("deep    = " + deep.scoreList());    // [80, 0]
        System.out.println("same array? " + (alice.scores == shallow.scores)); // true
        System.out.println("same array? " + (alice.scores == deep.scores));    // false
        System.out.println("alice total = " + alice.total());                  // 90
    }
}

class Student {
    String name;
    int[] scores;

    Student(String name, int[] scores) {
        this.name = name;
        this.scores = new int[scores.length];          // defensively copy on the way in
        for (int i = 0; i < scores.length; i++) {
            this.scores[i] = scores[i];
        }
    }

    Student(Student other, boolean deep) {
        this.name = other.name;
        if (deep) {
            this.scores = new int[other.scores.length];
            for (int i = 0; i < other.scores.length; i++) {
                this.scores[i] = other.scores[i];
            }
        } else {
            this.scores = other.scores;                // shallow: share the array
        }
    }

    int total() {
        int sum = 0;
        for (int i = 0; i < scores.length; i++) {
            sum = sum + scores[i];
        }
        return sum;
    }

    String scoreList() {
        return Arrays.toString(scores);
    }
}
` },

    { t: 'p', html:
      '三个要点：① 主构造器里 <code>this.scores = new int[...]</code> 是<b>防御性拷贝（defensive copy）</b>——' +
      '防止外部持有同一个数组后偷偷改它；② <code>deep.scores[1] = 0</code> 只影响 deep，因为它的数组是复制出来的；' +
      '③ <code>alice.scores == shallow.scores</code> 为 true，证明浅拷贝只复制了箭头。<br>' +
      '这也是第 10 章 <code>ArrayList</code> 的引用语义基础：集合里装的也是引用，' +
      '"把 list 复制一份"如果不深拷贝，里面元素仍然共享。'
    },

    { t: 'h', text: '教材对照：§3.1 引用语义与 §4.3 链表', id: 'ch09-book' },

{ t: 'table',
      head: ['操作', '数组（连续存储）', '单链表'],
      rows: [
        ['按下标取第 i 个', 'O(1)，一次地址计算', 'O(i)，从头走 i 步'],
        ['在头部插入', 'O(n)，后面元素全部右移', 'O(1)，改两条引用'],
        ['删除已知节点', 'O(n)，后面元素全部左移', 'O(1)，把前驱指向后继'],
        ['额外空间', '一段连续内存', '每个节点多一个引用字段']
      ],
      caption: '教材的取舍：需要随机访问用数组，需要频繁头插/删除用链表'
    },

{ t: 'code', caption: 'LinkedStack.java —— 教材 §4.3：用 next 引用把节点串成后进先出的栈', code:
`class Node {
    int val;
    Node next;
    Node(int v, Node n) { val = v; next = n; }
}

public class Q {
    static Node head;
    static void push(int v) { head = new Node(v, head); }
    static int pop() { int v = head.val; head = head.next; return v; }
    public static void main(String[] args) {
        push(1); push(2); push(3);
        System.out.println("pop = " + pop());
        System.out.println("pop = " + pop());
        System.out.println("top = " + head.val);
    }
}
` },

    { t: 'p', html:
      "教材 §3.1 把「数组是对象」讲得很直白：数组变量里存的是<b>引用</b>，<code>a = b</code> 之后两个名字指向同一块内存，改一个另一个也变。§4.3 的链表把这个模型变成数据结构——节点对象里放一个 <code>next</code> 引用，头插只改两条链接，不需要搬动任何元素。<br><br>输出 <code>pop = 3</code>、<code>pop = 2</code>、<code>top = 1</code>。<code>push</code> 新建节点并让它指向旧头，<code>pop</code> 把 head 移到下一个节点——两条语句，没有循环。这就是教材说的「链表把插入删除的代价从搬数据变成改引用」。<br><br>教材 §3.1 还讲了「数组的数组」：<code>int[][] a = new int[3][4]</code> 其实是「一个数组，每个元素是 <code>int[]</code> 的引用」。所以 <code>a[0]</code> 和 <code>a[1]</code> 是不同的一维数组对象；把 <code>a[0]</code> 赋给另一个变量再改元素，<code>a</code> 里也会变。这个模型直接支撑第 10 章的 <code>ArrayList</code> 和本章的链表——容器里装的都是引用。<br><br>教材 §4.3 还给了一个遍历链表的固定模板：<code>for (Node x = first; x != null; x = x.next)</code>——初始化、条件、更新都写在 for 头里，循环体只处理 <code>x.val</code>。删除当前节点时要保存前驱 <code>prev</code>，否则接不上；删头节点要单独判断，或引入哑节点（dummy node）让头节点和中间节点共用一套删除逻辑。<br><br>教材最后提醒：数组和链表都是「引用的容器」，区别在「连续」与「分散」。数组支持 O(1) 随机访问，但插入删除要移动元素；链表插入删除 O(1)，但要顺序走才能找到位置。选哪个，取决于客户端更常做哪种操作——先看操作频率，再谈数据结构。这也是教材反复强调「先写客户端」的原因：客户端的操作组合，决定了哪种实现更合适。"
    },

    { t: 'callout', kind: 'warn', title: '教材 Q&A：为什么 node.next = node 会造环', html:
      "把一个节点的 <code>next</code> 指向它自己（或指回前面的节点），遍历就永远走不到 <code>null</code>，<code>while (p != null)</code> 会变成死循环。教材提醒：改 <code>next</code> 之前先想清楚「原来的链还连得上吗」，删除节点时要先把前驱的 <code>next</code> 接到后继，再让被删节点出局。<br><br>看到「改 A 结果 B 也变了」，先画引用图：每个变量一个框、每个对象一个框，箭头表示引用。如果两条箭头指向同一个对象，就是别名；要断开别名，必须复制对象本身（<code>clone</code> / 新数组 / 深拷贝），只复制变量没用。教材说这张图比任何断点都快。<br><br>栈是后进先出（push/pop 都在同一端），队列是先进先出（尾部入队、头部出队）。用链表实现队列时，要同时维护 head 和 tail 两个引用，否则出队 O(1)、入队却要 O(n)。站内第 09 章的链表实验台可以单步观察指针变化。"
    },

    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch09-q1' },
    { t: 'quiz', qid: 'ch09-q2' },
    { t: 'quiz', qid: 'ch09-q3' },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      '本章是期中、M2、期末都反复出现的区域，三种题型对应三个分值档：<br>' +
      '① <b>读代码写输出（10 分档）</b>：Mock A Q5 就是"数组别名 + 方法内重新绑定"——给出一个数组、' +
      '调用一个改元素的方法和一个重新赋值的方法，问最后打印什么；B 卷 Q6 的引用传递小题同理。<br>' +
      '② <b>画内存图（10–14 分档）</b>：M2 常考"画出执行到某一行时的栈帧、堆对象与箭头"，' +
      '评分点是<b>编号、箭头方向、谁指向谁</b>三样，缺一个扣一项。<br>' +
      '③ <b>找 bug / 解释现象</b>：给你一段"能跑但结果错"的代码，问哪一行错、为什么、怎么改——' +
      '答案要求说出"== 比地址"或"形参重新赋值不影响调用者"。<br>' +
      '<b>看到这类题先做什么</b>：不要急着算输出，先在草稿纸左上角画两列——左列栈帧变量、右列堆对象编号；' +
      '每执行一行只更新两件事：某个格子的值、某条箭头指向。图对了，输出和解释自然对。'
    },

    { t: 'keypoint', items: [
      { title: '栈 vs 堆', html: '栈帧随方法调用进出，装局部变量；对象与数组在堆上，靠引用访问。' },
      { title: '变量里装什么', html: '基本类型装数值，引用类型装箭头；赋值永远复制盒子里那份东西。' },
      { title: 'String', html: '引用类型但不可变；拼接造新对象、只改箭头；内容比较一律用 <code>equals</code>。' },
      { title: '== vs equals', html: '<code>==</code> 比地址，<code>equals</code> 比内容（前提是重写过）。数组用 <code>Arrays.equals</code>。' },
      { title: '别名', html: '多个引用指向同一对象，改一个全变；要独立就 <code>new</code> 或深拷贝。' },
      { title: '值传递', html: 'Java 只有值传递：能改对象内容，不能换对象；口诀是"改内容还是改箭头"。' },
      { title: '浅 vs 深拷贝', html: '浅拷贝共享内层，深拷贝层层复制；<code>Arrays.copyOf</code> 对二维/对象数组是浅的。' },
      { title: '调试', html: '画栈帧图、逐行更新箭头、一次只改一个假设。' }
    ] },

    { t: 'checklist', id: 'ch09', items: [
      '我能分清哪个变量在栈上、哪个对象在堆上',
      '我能解释 b = a 对基本类型和数组分别做了什么',
      '我能说明 String 拼接为什么不会影响别的引用',
      '我能判断 s1 == s2 与 s1.equals(s2) 的结果并说明理由',
      '我知道数组为什么不能用 equals 比较内容',
      '我能解释 fill 与 replace 结果为什么不同',
      '我能画出浅拷贝与深拷贝的内存图，指出哪一层共享',
      '我能判断 Arrays.copyOf 对二维数组是深还是浅',
      '我能按"画图—标箭头—逐行更新"调试一个引用类 bug'
    ] },

    { t: 'p', html:
      '<b>延伸阅读</b>：教材 Sedgewick《Computer Science: An Interdisciplinary Approach》第 1.2 节（Data Abstraction）与 ' +
      '第 3.3 节（Designing Data Types）里关于对象、引用与不可变性的讨论；站内第 06 章的「值传递」小节、' +
      '第 10 章「集合」里的引用语义与 <code>equals/hashCode</code>，都是本章的直接延伸。' +
      '想练手可以到 <a href="#/quiz/ch09">题库 · ch09</a> 按章节筛选，或用首页的随机挑战抽题。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '可以让 AI 做三件事，但每件都要自己验证：① 让它出 5 道"问输出"题，你先手算，再用本章单步面板核对；' +
      '② 让它画你代码的内存图，重点看箭头数量——AI 常把"形参指向新对象"错画成"改了原对象"；' +
      '③ 让它解释"Java 为什么没有引用传递"，你再反问："那为什么 <code>fill(data)</code> 能改数组？"<br>' +
      '更进一步：把你的完整案例（如 GradeReport）发给 AI，让它只回答一个问题——"哪些方法会改调用者的数组？" ' +
      '答对了再让它改一处代码并预测输出，用本站运行结果裁决。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：内存与引用：栈与堆、值传递与引用语义、== 与 equals、别名、浅拷贝与深拷贝、对象生命周期。<br>依据：Course Outline v5 的 Stack and Heap / Equality, Aliasing, Deep Copying 部分；Sedgewick §3.1（Memory 相关小节）。本站为个人整理的学习材料，与课程要求冲突时以老师和课程大纲为准；代码均在真实 JDK 上校验过。' }

  ]
});