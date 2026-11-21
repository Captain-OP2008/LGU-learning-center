/* =====================================================================
 * data/ch17.js · 第 17 章：栈与队列
 * 职责：LIFO/FIFO 两种顺序、栈的数组实现与链表实现、环形数组队列、
 *       括号匹配、Dijkstra 双栈表达式求值、队列模拟与 Little 定律。
 * 内容块 schema 见 data/ 各文件注释；示例输出均在本站 Java 引擎里实跑核对。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch17',
  num: '17',
  title: '栈与队列',
  en: 'Stacks and Queues',

  goals: [
    '能说清 LIFO 与 FIFO 的区别，并给每种结构举出两个真实用途',
    '能用数组和链表两种方式实现栈，并说明各自的代价',
    '能用环形数组实现队列，解释为什么"不环绕"会浪费空间',
    '能用栈检查括号匹配、用双栈算法求值带括号的算术表达式',
    '能读懂队列模拟的输出，理解平均等待时间与 Little 定律'
  ],

  kp: [
    { id: 'ch17-1', title: 'LIFO 与 FIFO：两种顺序' },
    { id: 'ch17-2', title: '栈的数组实现' },
    { id: 'ch17-3', title: '栈的链表实现' },
    { id: 'ch17-4', title: '队列与环形数组' },
    { id: 'ch17-5', title: '应用一：括号匹配' },
    { id: 'ch17-6', title: '应用二：表达式求值' },
    { id: 'ch17-7', title: '应用三：队列模拟' },
    { id: 'ch17-8', title: '栈还是队列：怎么选' }
  ],

  blocks: [

    { t: 'callout', kind: 'why', html:
      '想一个你每天都在用、却没注意过的动作：点浏览器的「后退」。页面按访问顺序一个一个<b>倒着</b>退回去，' +
      '最后访问的最先退出——这就是<b>后进先出（LIFO，last in first out）</b>。' +
      '再想打印店里的任务队列：先交的文档先打，后来的一律排在后面，这叫<b>先进先出（FIFO，first in first out）</b>。' +
      '这两个顺序看起来平凡，却是计算机里最常用的两种组织数据的方式：' +
      '撤销操作、括号匹配、函数调用栈、表达式求值靠 LIFO；打印队列、消息队列、' +
      '网络请求、下一章要讲的广度优先搜索靠 FIFO。<b>信息本身没变，变的只是"取出的顺序"</b>——' +
      '而这一个顺序的差别，决定了一段代码是 O(1) 还是 O(n)。'
    },

    { t: 'p', lead: true, html:
      '这一章按"两种顺序 → 栈的两种实现 → 队列的环形数组 → 三个真实应用 → 怎么选"的顺序走。' +
      '学完你应该能把一个需求翻译成两种选择：用栈还是队列？用数组还是链表？' +
      '先看一段能跑的程序。下面这个类只支持两个动作：<code>push(v)</code> 把数压到顶部，' +
      '<code>pop()</code> 从顶部取出一个数。注意按下 1²、2²、…、5² 的顺序，' +
      '取出来时却是 25、16、9、4、1——<b>压入顺序的完全倒序</b>。'
    },

    { t: 'code', caption: 'ArrayStackOfInts.java —— 压入 1,4,9,16,25，弹出 25,16,9,4,1', code:
`public class ArrayStackOfInts {
    private int[] a = new int[100];
    private int n = 0;

    public void push(int v) {
        a[n] = v;
        n++;
    }

    public int pop() {
        n--;
        return a[n];
    }

    public boolean isEmpty() {
        return n == 0;
    }

    public int size() {
        return n;
    }

    public static void main(String[] args) {
        ArrayStackOfInts s = new ArrayStackOfInts();
        for (int i = 1; i <= 5; i++) {
            s.push(i * i);
        }
        System.out.println("size = " + s.size());
        System.out.print("pop order: ");
        while (!s.isEmpty()) {
            System.out.print(s.pop() + " ");
        }
        System.out.println();
        System.out.println("size after = " + s.size());
    }
}
` },

    { t: 'p', html:
      '输出三行：<code>size = 5</code>、<code>pop order: 25 16 9 4 1</code>、<code>size after = 0</code>。' +
      '整个实现只有一个数组和一个整数 <code>n</code>：<code>n</code> 既是"栈里有多少个元素"，' +
      '也正好是"下一个空位"的下标。<code>push</code> 先写后加，<code>pop</code> 先减后读，' +
      '两个动作都只碰一次数组、一次自增——<b>与栈的大小无关，始终 O(1)</b>。' +
      '这正是栈和队列值得单独讲的原因：它们把"顺序"变成了常数时间的操作。'
    },

    { t: 'h', text: '一、LIFO 与 FIFO：只差一个方向', id: 'ch17-1' },

    { t: 'p', html:
      '把数据排成一条线，只允许在一端进出，就是栈；允许一端进、另一端出，就是队列。' +
      '两者的操作名字不同但语义对称：栈用 <b>push / pop</b>（压入 / 弹出），' +
      '队列用 <b>enqueue / dequeue</b>（入队 / 出队）。它们都只提供"加一个"和"取一个"两个动作，' +
      '却因为取的位置不同，行为完全不同。'
    },

    { t: 'table',
      head: ['', '栈（stack）', '队列（queue）'],
      rows: [
        ['进出规则', '同一端进出：窄口', '一端进、另一端出：管道'],
        ['顺序', 'LIFO：后进先出', 'FIFO：先进先出'],
        ['取出的元素', '最近压入的', '最早入队的'],
        ['典型操作', '<code>push</code> / <code>pop</code> / <code>isEmpty</code> / <code>size</code>', '<code>enqueue</code> / <code>dequeue</code> / <code>isEmpty</code> / <code>size</code>'],
        ['真实用途', '撤销、后退、括号匹配、函数调用、表达式求值', '打印任务、消息队列、BFS、缓冲区'],
        ['生活类比', '一叠盘子、弹夹、电梯里的"最近输入"', '排队买票、流水线、水管']
      ],
      caption: '两种结构都只有"放"和"取"，区别只在"从哪一端取"' },

    { t: 'p', html:
      '下面的程序用两个栈模拟浏览器：<b>已访问</b>的页面压进 back 栈，点后退时从 back 栈弹出、' +
      '并压进 forward 栈；点前进则反过来。这是栈最贴近日常的一个用法，也说明为什么"最近访问"必须先退出。'
    },

    { t: 'code', caption: 'BrowserBack.java —— 访问 A→B→C，后退两次回到 A，再前进两次回到 C', code:
`public class BrowserBack {
    private String[] back = new String[10];
    private int nb = 0;
    private String[] forward = new String[10];
    private int nf = 0;

    public void visit(String page) {
        back[nb] = page;
        nb++;
        nf = 0;                 // 新访问产生后，前进栈作废
    }

    public String back() {
        if (nb <= 1) return "(no back)";
        String cur = back[nb - 1];
        nb--;
        forward[nf] = cur;
        nf++;
        return back[nb - 1];
    }

    public String forward() {
        if (nf == 0) return "(no forward)";
        String page = forward[nf - 1];
        nf--;
        back[nb] = page;
        nb++;
        return page;
    }

    public static void main(String[] args) {
        BrowserBack b = new BrowserBack();
        b.visit("A");
        b.visit("B");
        b.visit("C");
        System.out.println("back -> " + b.back());
        System.out.println("back -> " + b.back());
        System.out.println("forward -> " + b.forward());
        System.out.println("forward -> " + b.forward());
    }
}
` },

    { t: 'p', html:
      '输出四行：<code>back -&gt; B</code>、<code>back -&gt; A</code>、<code>forward -&gt; B</code>、<code>forward -&gt; C</code>。' +
      '访问顺序是 A、B、C，所以第一次后退回到 B；第二次回到 A，此时 C 和 B 都进了 forward 栈；' +
      '再点两次前进，依次回到 B、C。注意 <code>visit</code> 里把 <code>nf</code> 清零的那一行——' +
      '<b>访问新页面会作废前进历史</b>，这正是真实浏览器的行为，也是"用数据结构表达业务规则"的典型例子。'
    },

    { t: 'h', text: '二、栈的数组实现：一个下标就够了', id: 'ch17-2' },

    { t: 'p', html:
      '栈的数组实现只有一个关键变量：<b>栈顶下标</b>。用 <code>a</code> 存元素、<code>n</code> 存元素个数，' +
      '则 <code>push</code> 是"写在 <code>a[n]</code> 再让 n 加一"，<code>pop</code> 是"先让 n 减一再读 <code>a[n]</code>"。' +
      '先减后读的顺序不能颠倒：如果先读 <code>a[n]</code>，读到的是空位，不是栈顶。' +
      '这个细节在考试里经常以"下列 pop 实现哪一个是错的"的形式出现。<br>' +
      '数组实现有两个边界要处理：<b>栈空时 pop</b> 和 <b>栈满时 push</b>。下面的版本用 <code>isEmpty</code> 与' +
      '容量上限做了保护，并且在栈满时给出提示而不是抛异常——真实实现里更常见的选择是扩容，' +
      '把数组长度翻倍，这样 push 的均摊代价仍是 O(1)（第 13 章讲过均摊）。'
    },

    { t: 'code', caption: 'FixedCapacityStack.java —— 压满 3 个再压第 4 个会怎样', code:
`public class FixedCapacityStack {
    private String[] a;
    private int n;

    public FixedCapacityStack(int cap) {
        a = new String[cap];
        n = 0;
    }

    public void push(String item) {
        if (n == a.length) {
            System.out.println("stack full: " + item + " dropped");
            return;
        }
        a[n] = item;
        n++;
    }

    public String pop() {
        if (n == 0) return null;
        n--;
        return a[n];
    }

    public boolean isEmpty() { return n == 0; }
    public int size() { return n; }

    public static void main(String[] args) {
        FixedCapacityStack s = new FixedCapacityStack(3);
        s.push("to");
        s.push("be");
        s.push("or");
        s.push("not");
        System.out.println("size = " + s.size());
        System.out.println("top  = " + s.pop());
        System.out.println("size = " + s.size());
        System.out.println("empty = " + s.isEmpty());
    }
}
` },

    { t: 'p', html:
      '输出五行：<code>stack full: not dropped</code>、<code>size = 3</code>、<code>top = or</code>、' +
      '<code>size = 2</code>、<code>empty = false</code>。' +
      '<code>"not"</code> 被丢掉不是 bug，而是固定容量设计的后果——' +
      '栈只保证"最近的有效元素"能被正确取出，容量得由调用者保证。' +
      '生产代码里更稳的做法是自动扩容：<code>n == a.length</code> 时新建一个两倍长的数组并复制，' +
      '这样连续 push n 次的<b>总代价</b>是 O(n)，均摊到每次仍是 O(1)。'
    },

    { t: 'h', text: '三、栈的链表实现：头插头删', id: 'ch17-3' },

    { t: 'p', html:
      '数组栈的缺点是容量要事先定好。链表没有这个问题：把元素挂在一条链上，' +
      '<b>栈顶就是链表的头节点</b>，push 在头部插入、pop 删除头节点，两步都是常数时间，也不需要拷贝整个数组。' +
      '下面这段程序就是一个完整的链表栈，注意 <code>Node</code> 是一个独立的顶层类——' +
      'Java 允许一个文件里写多个类，但只有与文件名同名的那个可以是 public。'
    },

    { t: 'code', caption: 'LinkedStack.java —— 压入 to be or not to be，弹出 be to not or be to', code:
`class Node {
    String item;
    Node next;

    Node(String item) {
        this.item = item;
    }
}

public class LinkedStack {
    private Node first;
    private int n;

    public void push(String item) {
        Node old = first;
        first = new Node(item);
        first.next = old;
        n++;
    }

    public String pop() {
        if (first == null) {
            return null;
        }
        String item = first.item;
        first = first.next;
        n--;
        return item;
    }

    public boolean isEmpty() {
        return first == null;
    }

    public int size() {
        return n;
    }

    public static void main(String[] args) {
        LinkedStack s = new LinkedStack();
        String[] words = {"to", "be", "or", "not", "to", "be"};
        for (String w : words) {
            s.push(w);
        }
        System.out.println("size = " + s.size());
        System.out.print("pop order: ");
        while (!s.isEmpty()) {
            System.out.print(s.pop() + " ");
        }
        System.out.println();
        System.out.println("pop on empty -> " + s.pop());
    }
}
` },

    { t: 'p', html:
      '输出三行：<code>size = 6</code>、<code>pop order: be to not or be to</code>、' +
      '<code>pop on empty -&gt; null</code>。压入顺序是 to、be、or、not、to、be，' +
      '弹出就是它的倒序。三行 <code>push</code> 里最关键是顺序：' +
      '必须先把旧的 <code>first</code> 存进 <code>old</code>，再新建节点、再把 <code>first.next</code> 指向 <code>old</code>；' +
      '如果先写 <code>first = new Node(item)</code> 再去取 <code>first.next</code>，旧链就丢了。' +
      '这是链表操作里最经典的顺序错误。'
    },

    { t: 'callout', kind: 'warn', title: '链表栈的三个易错点', html:
      '① <b>空栈 pop</b>：<code>first</code> 为 <code>null</code> 时不能再访问 <code>first.item</code>，要先判空返回。' +
      '② <b>size 与判空</b>：<code>size</code> 用计数器维护是 O(1)；如果写成"遍历一遍数节点"，<code>push</code> 就会变 O(n)。' +
      '③ <b>内存换时间</b>：每个节点多一个引用字段（通常 8 字节），元素很多时内存开销比数组大；' +
      '但换来"不用预估容量、不用扩容拷贝"——这就是"数组 vs 链表"的经典权衡。'
    },

    { t: 'h', text: '四、队列与环形数组：把空位绕回来', id: 'ch17-4' },

    { t: 'p', html:
      '队列比栈多一个麻烦：一端进、另一端出。如果直接用数组，<code>head</code> 与 <code>tail</code> 两个下标都只会往后走，' +
      '出队几次之后数组前面会空出一大片，后面的位置却用不上——<b>明明只有 2 个元素，数组却"满"了</b>。' +
      '解决办法是让下标"绕回来"：<code>tail = (tail + 1) % a.length</code>，' +
      '到末尾就回到 0，把数组当成一个环来用。<br>' +
      '下面这个队列容量为 3：先入队 A、B，出队 A，再入队 C、D。注意 D 入队时写到了下标 0——' +
      '那个位置刚好是被 A 空出来的。这正是不环绕时会浪费、而环形数组能复用的原因。'
    },

    { t: 'code', caption: 'ArrayQueue.java —— 容量 3 的环：A 走后，D 占回下标 0', code:
`public class ArrayQueue {
    private String[] a;
    private int head;
    private int tail;
    private int n;

    public ArrayQueue(int cap) {
        a = new String[cap];
        head = 0;
        tail = 0;
        n = 0;
    }

    public void enqueue(String item) {
        if (n == a.length) {
            System.out.println("queue full: " + item + " dropped");
            return;
        }
        a[tail] = item;
        tail = (tail + 1) % a.length;
        n++;
    }

    public String dequeue() {
        if (n == 0) {
            return null;
        }
        String item = a[head];
        head = (head + 1) % a.length;
        n--;
        return item;
    }

    public boolean isEmpty() { return n == 0; }
    public int size() { return n; }

    public static void main(String[] args) {
        ArrayQueue q = new ArrayQueue(3);
        q.enqueue("A");
        q.enqueue("B");
        System.out.println("dequeue -> " + q.dequeue());
        q.enqueue("C");
        q.enqueue("D");
        System.out.println("size = " + q.size());
        System.out.print("order: ");
        while (!q.isEmpty()) {
            System.out.print(q.dequeue() + " ");
        }
        System.out.println();
        System.out.println("head = " + q.head + "  tail = " + q.tail);
    }
}
` },

    { t: 'p', html:
      '输出四行：<code>dequeue -&gt; A</code>、<code>size = 3</code>、<code>order: B C D</code>、' +
      '<code>head = 1  tail = 1</code>。最后一行很有意思：<code>head</code> 和 <code>tail</code> 都回到 1，' +
      '说明整个环走过一圈又回到起点——<b>判断队列空满不能靠 head == tail，必须靠计数器 n</b>，' +
      '因为"空"和"满"都可能是两个下标相等。这是环形数组最容易踩的坑。'
    },

    { t: 'steps', items: [
      { title: '入队', html: '写在 <code>a[tail]</code>，再 <code>tail = (tail + 1) % cap</code>，<code>n++</code>。' },
      { title: '出队', html: '取 <code>a[head]</code>，再 <code>head = (head + 1) % cap</code>，<code>n--</code>。' },
      { title: '判空 / 判满', html: '只看 <code>n</code>：<code>n == 0</code> 为空，<code>n == cap</code> 为满；下标相等时无法区分。' },
      { title: '容量选择', html: '容量满足"最多同时在场元素数"即可，不需要等于总入队次数——这就是环比普通数组省空间的地方。' }
    ],
      caption: '环形数组队列的四个要点' },

    { t: 'h', text: '五、应用一：括号匹配', id: 'ch17-5' },

    { t: 'p', html:
      '第一个真实应用是编译器每天都在做的事：检查括号是否配对。<b>规则</b>：从左往右扫，' +
      '遇到左括号就压栈；遇到右括号就弹出栈顶，看它是不是对应的左括号——' +
      '<b>最后进的那个左括号，必须最先被配对</b>。这正是 LIFO。' +
      '如果扫到右括号时栈已空，或者弹出的左括号不匹配，就说明表达式不合法。'
    },

    { t: 'code', caption: 'BracketMatch.java —— 五个测试串，两个不合法', code:
`public class BracketMatch {
    private char[] stack = new char[100];
    private int n = 0;

    private void push(char c) {
        stack[n] = c;
        n++;
    }

    private char pop() {
        n--;
        return stack[n];
    }

    private boolean isEmpty() {
        return n == 0;
    }

    public boolean isBalanced(String s) {
        n = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(' || c == '[' || c == '{') {
                push(c);
            } else if (c == ')' || c == ']' || c == '}') {
                if (isEmpty()) return false;
                char open = pop();
                if (c == ')' && open != '(') return false;
                if (c == ']' && open != '[') return false;
                if (c == '}' && open != '{') return false;
            }
        }
        return isEmpty();
    }

    public static void main(String[] args) {
        BracketMatch b = new BracketMatch();
        String[] tests = {"[()]{}{[()()]()}", "[(])", "(()", "())", "(((())))"};
        for (String s : tests) {
            System.out.println(s + " -> " + b.isBalanced(s));
        }
    }
}
` },

    { t: 'p', html:
      '输出五行：<code>[()]{}{[()()]()} -&gt; true</code>、<code>[(]) -&gt; false</code>、' +
      '<code>(() -&gt; false</code>、<code>()) -&gt; false</code>、<code>(((()))) -&gt; true</code>。' +
      '看第三个和第四个：<code>(()</code> 是"左括号多了一个"，扫完栈非空，所以 <code>return isEmpty()</code> 返回 false；' +
      '<code>())</code> 是"右括号多了一个"，第二次遇到右括号时栈已空，中途就返回 false。' +
      '<b>两种错误分别对应"栈非空"与"栈提前空"</b>，这两个判断合起来才完整。'
    },

    { t: 'h', text: '六、应用二：用两个栈求值表达式', id: 'ch17-6' },

    { t: 'p', html:
      '编译器怎么算 <code>(1+((2+3)*(4*5)))</code>？它不按人的直觉"先算括号里"来回找，' +
      '而是用两个栈从左到右扫一遍：<b>值栈</b>存数字，<b>运算符栈</b>存 + − × ÷。' +
      '遇到数字压进值栈，遇到运算符压进运算符栈，遇到右括号就"弹一个运算符、两个值，算完把结果压回值栈"。' +
      '这是 Dijkstra 的双栈算法，也是"把字符串当作程序来解释执行"的最简单例子。<br>' +
      '为什么这样能得到正确结果？因为左括号先入栈、后配对，正好是 LIFO；' +
      '而遇到右括号时，栈顶的运算符一定是"最内层、最该先算"的那个。' +
      '下面程序里的表达式都写成<b>完全括号化</b>的形式（每个运算都套一层括号），这样扫描规则最简单。'
    },

    { t: 'code', caption: 'ExpressionEval.java —— 四个完全括号化表达式，从 101.0 到 10.0', code:
`public class ExpressionEval {
    private double[] vals = new double[100];
    private int nv = 0;
    private char[] ops = new char[100];
    private int no = 0;

    private void pushVal(double v) { vals[nv] = v; nv++; }
    private double popVal() { nv--; return vals[nv]; }
    private void pushOp(char c) { ops[no] = c; no++; }
    private char popOp() { no--; return ops[no]; }

    private double apply(char op, double a, double b) {
        if (op == '+') return a + b;
        if (op == '-') return a - b;
        if (op == '*') return a * b;
        return a / b;
    }

    public double evaluate(String s) {
        nv = 0;
        no = 0;
        int i = 0;
        while (i < s.length()) {
            char c = s.charAt(i);
            if (c == '(' || c == ' ') {
                i++;
            } else if (c == '+' || c == '-' || c == '*' || c == '/') {
                pushOp(c);
                i++;
            } else if (c == ')') {
                char op = popOp();
                double b = popVal();
                double a = popVal();
                pushVal(apply(op, a, b));
                i++;
            } else {
                int j = i;
                while (j < s.length() && ((s.charAt(j) >= '0' && s.charAt(j) <= '9') || s.charAt(j) == '.')) {
                    j++;
                }
                pushVal(Double.parseDouble(s.substring(i, j)));
                i = j;
            }
        }
        return popVal();
    }

    public static void main(String[] args) {
        ExpressionEval e = new ExpressionEval();
        String[] tests = {"(1+((2+3)*(4*5)))", "((1+2)*(3+4))", "(8/(2+2))", "(2.5*(2+2))"};
        for (String s : tests) {
            System.out.println(s + " = " + e.evaluate(s));
        }
    }
}
` },

    { t: 'p', html:
      '输出四行：<code>(1+((2+3)*(4*5))) = 101.0</code>、<code>((1+2)*(3+4)) = 21.0</code>、' +
      '<code>(8/(2+2)) = 2.0</code>、<code>(2.5*(2+2)) = 10.0</code>。' +
      '以第一行为例：读到 <code>2+3</code> 的右括号时，算出 5 压回值栈；读到 <code>4*5</code> 的右括号时算出 20；' +
      '再读到 <code>(2+3)*(4*5)</code> 的右括号时，弹出 × 和 5、20 得 100；' +
      '最外层再弹 + 和 1、100 得 101。<b>每个右括号对应一次"最内层先算"</b>，这就是栈在起作用。' +
      '这段代码只处理完全括号化的表达式；真实解析器还要处理优先级与结合性，那是第 20 章形式语言的内容。'
    },

    { t: 'h', text: '七、应用三：队列模拟与等待时间', id: 'ch17-7' },

    { t: 'p', html:
      '队列最典型的工程用途是<b>模拟</b>：把"到达"和"服务"两个过程放进一个时间轴，' +
      '看排队长度、等待时间怎么变化。银行窗口、超市收银、网络路由、服务器请求，都是这个模型。' +
      '下面这段程序让顾客按 0~2 分钟的随机间隔到达（用固定的伪随机序列保证输出可复现），' +
      '每位顾客需要 2 分钟服务，然后统计<b>最大排队长度</b>与<b>平均等待时间</b>。'
    },

    { t: 'code', caption: 'QueueSim.java —— 12 位顾客、每单 2 分钟：队伍会积压吗', code:
`public class QueueSim {
    private int[] q = new int[200];
    private int head = 0;
    private int tail = 0;
    private int n = 0;

    public void enqueue(int v) {
        q[tail] = v;
        tail = (tail + 1) % q.length;
        n++;
    }

    public int dequeue() {
        int v = q[head];
        head = (head + 1) % q.length;
        n--;
        return v;
    }

    public boolean isEmpty() { return n == 0; }
    public int size() { return n; }

    public static void main(String[] args) {
        QueueSim sim = new QueueSim();
        int seed = 12345;
        int arrive = 0;
        int freeAt = 0;
        int totalWait = 0;
        int maxLen = 0;
        int total = 12;
        int service = 2;
        for (int i = 0; i < total; i++) {
            seed = (seed * 1103515245 + 12345) % 2147483647;
            if (seed < 0) seed = -seed;
            arrive = arrive + seed % 3;
            sim.enqueue(arrive);
            if (sim.size() > maxLen) {
                maxLen = sim.size();
            }
            while (!sim.isEmpty() && freeAt <= arrive) {
                int a = sim.dequeue();
                totalWait = totalWait + (freeAt - a);
                freeAt = freeAt + service;
            }
        }
        while (!sim.isEmpty()) {
            int a = sim.dequeue();
            totalWait = totalWait + (freeAt - a);
            freeAt = freeAt + service;
        }
        System.out.println("customers = " + total);
        System.out.println("max queue length = " + maxLen);
        System.out.println("total wait = " + totalWait);
        System.out.println("average wait = " + (1.0 * totalWait / total));
        System.out.println("finish time = " + freeAt);
    }
}
` },

    { t: 'p', html:
      '程序的核心是两个时刻：<code>arrive</code> 是下一位顾客到达的时刻，<code>freeAt</code> 是窗口恢复空闲的时刻。' +
      '顾客到达后入队；只要窗口空闲（<code>freeAt &lt;= arrive</code>）就把队首顾客请进来，从 <code>freeAt</code> 开始服务，' +
      '等待时间就是"开始时刻 − 到达时刻"。全部入队后再把队里剩下的人依次服务完。' +
      '运行结果（本站引擎实跑）：<code>customers = 12</code>、<code>max queue length = 8</code>、' +
      '<code>total wait = 81</code>、<code>average wait = 6.75</code>、<code>finish time = 24</code>。' +
      '这一轮明显积压了：顾客平均每 1 分钟来一位（间隔取 0、1、2 各约三分之一），' +
      '但每位要服务 2 分钟——<b>到达速度是服务速度的两倍，队伍必然越排越长</b>，最长排到 8 人，' +
      '平均每位等了 6.75 分钟。把 <code>service</code> 改成 1 再跑，平均等待会立刻降下来；' +
      '改回 2 并拉长到 100 位顾客，等待时间会继续膨胀——这就是排队论里' +
      '"到达速度 ≥ 服务速度时队列发散"的直观版本。'
    },

    { t: 'callout', kind: 'note', title: 'Little 定律：一个不用推导也能用的结论', html:
      '设队列的平均长度为 L、平均等待时间为 W、单位时间到达数为 λ，则 <b>L = λW</b>。' +
      '它的意思是"排队的人越多，等待必然越久"，而且可以用两个量估第三个。' +
      '比如窗口每分钟来 0.5 人、每人平均等 4 分钟，那平均队列长度约为 2 人。' +
      '工程上评估一个系统要不要加机器、加缓冲区，经常先算这个数量级。'
    },

    { t: 'h', text: '八、栈还是队列：怎么选', id: 'ch17-8' },

    { t: 'p', html:
      '到了这里，栈和队列的实现细节应该已经不重要了。真正要练的是<b>看需求选结构</b>：' +
      '先问"我需要的顺序是什么"——最近优先选栈，最早优先选队列；' +
      '再问"数据量会不会超过预设容量"——会就用链表或动态数组；' +
      '最后问"要不要随机访问中间元素"——要就说明这两种结构都不合适。'
    },

    { t: 'table',
      head: ['需求', '该用的结构', '理由'],
      rows: [
        ['撤销 / 后退', '栈', '最近的操作最先撤销'],
        ['打印任务、消息队列', '队列', '先到先处理，保证公平'],
        ['括号匹配、表达式求值', '栈', '左括号后进先出，内层先配对'],
        ['广度优先搜索（BFS）', '队列', '按距离一层层扩展，第 19 章会用到'],
        ['深度优先搜索（DFS）', '栈（或递归）', '一路深入，走不通再回退'],
        ['函数调用的返回地址', '栈', '最后调用的函数最先返回'],
        ['生产者—消费者缓冲区', '环形队列', '固定容量、先进先出、复用空位'],
        ['要按下标随机取', '数组 / 列表', '栈和队列都不支持随机访问']
      ],
      caption: '选型只有两个问题：要什么顺序？容量和访问方式有什么限制？' },

    { t: 'p', html: '同一串 push/pop 操作，分别用栈和队列跑一遍，再切到括号匹配模式逐字符扫描——顺序的差别会自己说话。' },
    { t: 'lab', id: 'stackqueue' },

    { t: 'keypoint', items: [
      { title: 'LIFO 与 FIFO', html: '栈在同一端进出、后进先出；队列一端进一端出、先进先出。变的是顺序，不是数据。' },
      { title: '数组栈', html: '一个数组加一个下标，push/pop 都是 O(1)；容量固定时要扩容或改用链表。' },
      { title: '链表栈', html: '栈顶是头节点，push/pop 都是 O(1)，不用预估容量，但每个节点多一个引用。' },
      { title: '环形队列', html: 'head/tail 取模回绕复用空位；判空判满只看计数器 n，不能看 head == tail。' },
      { title: '括号匹配', html: '左括号入栈、右括号出栈比对；扫完栈空才算合法，两类错误分别是"栈非空"与"栈提前空"。' },
      { title: '双栈求值', html: '值栈 + 运算符栈，遇右括号就弹一运算符两值求值压回；完全括号化时从左到右一遍完成。' },
      { title: '队列模拟', html: '用到达时刻与空闲时刻推进时间轴，统计最长队列与平均等待；服务速度跟不上到达时队列发散。' },
      { title: '选型判据', html: '先看需要的顺序，再看容量与随机访问需求；栈/队列都只支持端点操作。' }
    ] },

    { t: 'quiz', qid: 'ch17-q1' },
    { t: 'quiz', qid: 'ch17-q2' },
    { t: 'quiz', qid: 'ch17-q3' },

    { t: 'checklist', id: 'ch17', items: [
      '我能用一个具体场景说清 LIFO 与 FIFO 的区别',
      '我能用数组写一个栈，并解释 push 为什么是 O(1)',
      '我能用链表写一个栈，说清头插头删的顺序',
      '我能用环形数组写队列，并解释为什么不能用 head == tail 判空',
      '我能用栈写出括号匹配，并处理"栈提前空"与"扫完栈非空"两类错误',
      '我能讲清双栈求值为什么遇到右括号就算最内层',
      '我能读懂队列模拟的输出，并解释平均等待时间怎么来的',
      '我能根据需求（撤销、打印、BFS、DFS、缓冲区）选择栈或队列',
      '我能说出什么情况下应该放弃栈/队列改用别的结构'
    ] },

    { t: 'p', html:
      '<b>延伸阅读</b>：Sedgewick《Computer Science: An Interdisciplinary Approach》§4.3（Stacks and Queues）' +
      '按"数组栈 → 链表栈 → 泛型 → 表达式求值 → 队列 → 模拟"的顺序展开，与本章一一对应；' +
      '站内第 12 章「递归」讲了调用栈为什么是栈，第 11 章「排序与查找」的归并排序用到了队列式合并。' +
      '想动手可以到实验台找「栈与队列」相关的小实验，或在题库里按 ch17 筛选练习。'
    },

    { t: 'h', text: '下一站：符号表', id: 'ch17-next' },

    { t: 'p', html:
      '栈和队列回答的是"按什么顺序取"，下一章回答一个更普遍的问题：<b>按什么键找</b>。' +
      '从电话簿到哈希表，从编译器符号表到数据库索引，核心都是"把键映射到值"。' +
      '第 18 章会给出符号表的 API，比较顺序查找、二分查找、哈希表、二叉查找树四条路线的代价，' +
      '你会发现：第 17 章里用来实现队列的数组和链表，正是构建这些结构的基础。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '栈和队列是检验 AI"是否真懂"的好题材：① 让 AI 写一个"用两个队列实现栈"，' +
      '再看它的代码是否真的只用队列操作（很多答案会偷偷用数组）；② 给它一个有 bug 的 pop 实现，' +
      '问它哪里错、为什么；③ 让它解释环形队列为什么不能用 <code>head == tail</code> 判满——' +
      '答不出"空和满都可能相等"就是没想清楚。反过来，你也可以让 AI 生成十段小代码，' +
      '自己判断该用栈还是队列，再用本章的判据核对。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：LIFO/FIFO 两种顺序、栈的数组与链表实现、环形数组队列、括号匹配、' +
      'Dijkstra 双栈表达式求值、队列模拟与 Little 定律、结构选型。<br>' +
      '依据：Sedgewick《Computer Science: An Interdisciplinary Approach》§4.3（Stacks and Queues）；' +
      'Course Outline v5 中数据结构部分的栈与队列。本站为个人整理的学习材料，' +
      '与课程要求冲突时以老师和课程大纲为准；所有示例输出均在本站 Java 引擎里实跑核对。' }
  ]
});
