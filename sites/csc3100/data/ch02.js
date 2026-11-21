/* =====================================================================
 * ch02.js · 第 2 章「链表、栈与队列」
 * 职责：从「连续存储」跳到「离散存储」，用引用把节点串起来；
 *       再用链表实现两个最常用的受限线性结构——栈与队列。
 * 依据：Lecture 05（linked list）、Lecture 07（stack & queue）；CLRS 第 10 章。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch02',
  num: '02',
  title: '链表、栈与队列',
  en: 'LISTS, STACKS & QUEUES',
  goals: [
    '写出单链表的插入、删除、反转，并在纸上画出每一步的引用变化',
    '解释哨兵节点为什么能消掉「头节点特判」，说清它省下的到底是哪几行代码',
    '用快慢指针在 O(1) 空间里找出链表中点并判断是否有环',
    '说清栈与队列的 ADT 契约，并各给三个真实系统的用例',
    '用循环数组实现队列且区分「空」与「满」，说明为什么必须多存一个 size 或留一个空位'
  ],
  kp: [
    { id: 'ch02-1', title: '链表：用引用把离散内存串起来' },
    { id: 'ch02-2', title: '单链表、双链表与循环链表' },
    { id: 'ch02-3', title: '哨兵节点与边界处理' },
    { id: 'ch02-4', title: '快慢指针：中点与环检测' },
    { id: 'ch02-5', title: '栈：后进先出的三种用途' },
    { id: 'ch02-6', title: '队列、双端队列与循环数组' },
    { id: 'ch02-7', title: '栈与队列的互相实现' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么读这一章', html: '上一章的数组有一个绕不过去的毛病：<b>中间插入要搬移</b>。一个实时排队的系统每秒钟要插几百条记录到中间，数组就成了瓶颈。链表（linked list）的解法很直接——<b>不要求连续，每个元素自己记住下一个在哪</b>。可代价也随之而来：按下标访问从 O(1) 变成 O(n)，缓存命中率暴跌，每个节点多一个引用字段。这一章要把这笔账算清楚，顺便用它实现两个最常用的受限结构：栈和队列。它们看起来简单，却是表达式求值、括号匹配、BFS、撤销功能、任务调度的共同底座。' },

    { t: 'p', lead: true, html: '链表的核心想法只有一句话：<b>用引用（reference）代替下标</b>。数组靠「起始地址 + 偏移量」定位，链表靠「上一个节点记着下一个节点的地址」定位。前者一步算出来，后者要一步步走；但前者插入要搬移，后者只要改两个引用。<b>这两种取舍贯穿整门课</b>：第 04 章的树、第 07 章的邻接表，都是链式思想的不同外衣。' },

    { t: 'h', lvl: 2, text: '一、链表：用引用把离散内存串起来', id: 'ch02-1' },

    { t: 'p', html: '一个链表由若干<b>节点</b>（node）组成，每个节点装两样东西：数据本身，和指向下一个节点的引用。最后一个节点的引用是 <code>null</code>，表示「没有下一个」。整个链表只需要一个入口——<b>头引用</b>（head），从它出发就能走遍所有节点。' },

    { t: 'p', html: '插入和删除之所以是 O(1)，是因为它们只改引用，不动数据。但注意这句话有个前提：<b>你得先站在要操作的位置上</b>。如果要「删除值为 42 的节点」，得先从头走一遍找到它，那一步是 O(n)。所以准确的说法是：<b>已知前驱位置时，插入删除 O(1)；按下标或按值定位，O(n)</b>。考试里很多判断题就卡在这个前提上。' },

    { t: 'code', lang: 'java', caption: '单链表的三件基本操作：插入、删除、反转', code: `class Node<E> {
    E val; Node<E> next;
    Node(E v, Node<E> n) { val = v; next = n; }
}

// 在 prev 之后插入 x（prev 必须非空）
void insertAfter(Node<E> prev, E x) {
    prev.next = new Node<>(x, prev.next);   // 先接后面，再接前面
}

// 删除 prev 的后继（prev 必须非空且后继存在）
void removeAfter(Node<E> prev) {
    if (prev.next != null) prev.next = prev.next.next;
}

// 反转整条链表：三个引用轮流转
Node<E> reverse(Node<E> head) {
    Node<E> prev = null, cur = head;
    while (cur != null) {
        Node<E> next = cur.next;   // 先存住后继，否则改完就丢了
        cur.next = prev;           // 掉头
        prev = cur;                // prev 前进
        cur = next;                // cur 前进
    }
    return prev;                   // 新头就是原来的尾
}` },

    { t: 'p', html: '反转那六行是链表题的通用模板，值得逐行背下来。三个引用的分工是：<code>prev</code> 记住已经反转好的那段的头，<code>cur</code> 是当前要处理的节点，<code>next</code> 是还没处理的下一段。<b>顺序不能乱</b>：如果先写 <code>cur.next = prev</code> 再去取 <code>cur.next</code>，就永远走不到下一个节点了——这是初学者最常犯的错误，画一次图就不会再错。' },

    { t: 'p', html: '链表还有一个反直觉的性质：<b>它比数组慢，哪怕复杂度一样</b>。同样是 O(n) 的遍历，数组顺序访问能整块读进 CPU 缓存，链表每跳一次都可能是一次缓存未命中（cache miss）。在 100 万节点的规模上，实测差 3–10 倍很常见。所以「链表插入快」只在<b>已经定位好</b>并且<b>数据量大到搬移成本超过缓存损失</b>时才成立。' },

    { t: 'h', lvl: 2, text: '二、单链表、双链表与循环链表', id: 'ch02-2' },

    { t: 'p', html: '单链表只能往前走。这带来一个具体麻烦：<b>删除当前节点时，你改不了前驱的引用</b>。常见的补救是「把后继的值抄过来，再删后继」，但当节点是链表尾部时就无解了。双链表（doubly linked list）直接给每个节点加一个 <code>prev</code> 引用，代价是每个节点多一个字段、每次插入删除要改四个引用。' },

    { t: 'p', html: '循环链表（circular linked list）把尾节点的 <code>next</code> 指回头节点，形成一个环。好处是「从任意节点出发都能走遍全程」，天然适合轮转调度（round-robin）：把当前节点处理完，指针往后挪一格就是下一个该处理的人。<b>代价是所有遍历都必须带终止条件</b>，否则会死循环——通常用一个「起点」引用，走到起点就停。' },

    { t: 'table', head: ['形态', '每个节点字段', '删除当前节点', '反向遍历', '典型用途'], rows: [
      ['单链表', 'val, next', '需要前驱，O(n) 找', '不支持', '栈、邻接表、简单队列'],
      ['双链表', 'prev, val, next', 'O(1) 直接改两边', '支持', 'LRU 缓存、浏览器前进后退'],
      ['循环单链表', 'val, next', '需要前驱', '不支持', '轮转调度、约瑟夫环'],
      ['循环双链表', 'prev, val, next', 'O(1)', '支持', 'Java LinkedList、音乐播放列表']
    ], caption: '多一个引用就多一份维护成本；先问「需不需要反向走」，再决定用哪种' },

    { t: 'p', html: 'Java 的 <code>LinkedList</code> 是循环双链表。它的 <code>get(i)</code> 会先比较 i 与 size/2：靠前就从头走，靠后就从尾倒着走，把平均代价减半——但仍然是 O(n)。这也是为什么「用 LinkedList 代替 ArrayList 做随机访问」是个经典错误：<code>for (int i = 0; i &lt; list.size(); i++) sum += list.get(i);</code> 在 LinkedList 上是 O(n²)，在 ArrayList 上是 O(n)。' },

    { t: 'h', lvl: 2, text: '三、哨兵节点与边界处理', id: 'ch02-3' },

    { t: 'p', html: '写链表代码最烦的不是算法，是边界：空链表怎么办？插在头部怎么办？删的正好是头节点怎么办？每处都要写一个 <code>if (head == null)</code>，十个方法就有十个分支，还容易漏。' },

    { t: 'p', html: '哨兵节点（sentinel，也叫 dummy head）的解法是：<b>永远在真正的第一个元素前面放一个不存数据的空节点</b>。这样「头节点」和「中间节点」就没有区别了——它们都有前驱，插入删除的代码可以完全统一，函数返回时返回 <code>dummy.next</code> 即可。' },

    { t: 'code', lang: 'java', caption: '有哨兵 vs 无哨兵：删除操作的代码量差别', code: `// 无哨兵：必须特判删除头节点
Node<E> remove(Node<E> head, E target) {
    if (head == null) return null;
    if (head.val.equals(target)) return head.next;   // 特判一
    Node<E> p = head;
    while (p.next != null && !p.next.val.equals(target)) p = p.next;
    if (p.next != null) p.next = p.next.next;
    return head;
}

// 有哨兵：一个循环搞定，没有特判
Node<E> removeWithDummy(Node<E> head, E target) {
    Node<E> dummy = new Node<>(null, head);
    Node<E> p = dummy;
    while (p.next != null && !p.next.val.equals(target)) p = p.next;
    if (p.next != null) p.next = p.next.next;
    return dummy.next;
}` },

    { t: 'p', html: '哨兵不只省代码，更重要的是<b>减少出错面</b>。所有「前驱为空」的分支都消失了，你可以放心地写 <code>p.next = p.next.next</code>。代价是多一个节点（常数空间）和一点点间接性。<b>判断要不要用哨兵的标准很简单：这段代码里有没有两处以上在特判头节点</b>。有，就上哨兵。' },

    { t: 'callout', kind: 'warn', title: '哨兵的三个坑', html: '<b>坑一：忘了返回 <code>dummy.next</code>。</b>直接把 <code>dummy</code> 返回出去，调用方会多一个空节点，长度永远错一位。<br><b>坑二：哨兵里存了真数据。</b>有些实现图省事把第一个元素放进哨兵，结果「删除头节点」又变成特判，等于白用。<br><b>坑三：多线程下共享哨兵。</b>哨兵是可变的（它的 <code>next</code> 会被改），不能当常量复用；每个链表实例都得有自己的哨兵。' },

    { t: 'h', lvl: 2, text: '四、快慢指针：中点与环检测', id: 'ch02-4' },

    { t: 'p', html: '链表有一类题看着难，其实只需要两个指针：<b>一个每次走一步（慢），一个每次走两步（快）</b>。它们同时从头出发，快指针到终点时，慢指针恰好在一半的位置。这就是 O(1) 空间找中点，比「先数长度再走一半」少一遍遍历。' },

    { t: 'p', html: '更漂亮的是环检测（cycle detection，也叫 Floyd 判圈算法）。如果链表里有环，快指针进去之后会一直绕，慢指针也进去，两者<b>必然相遇</b>；如果没有环，快指针会先撞到 <code>null</code>。为什么必然相遇？因为每走一轮，快指针相对慢指针靠近一格，环长有限，迟早追上——这是「抽屉原理」的一个具体版本。' },

    { t: 'code', lang: 'java', caption: '快慢指针的两个经典用法', code: `// 找中点：偶数个节点时返回靠后的那个
Node<E> middle(Node<E> head) {
    Node<E> slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}

// 判环：相遇即有环
boolean hasCycle(Node<E> head) {
    Node<E> slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;   // 比较引用，不是比较值
    }
    return false;
}` },

    { t: 'p', html: '两个细节值得停一下。<b>第一，循环条件必须写 <code>fast != null &amp;&amp; fast.next != null</code></b>，少判一个就会在奇数长度的链表上抛空指针。<b>第二，判环比较的是引用相等（<code>==</code>）而不是值相等</b>，因为环里可能有两个值相同的节点，用值比较会误判。' },

    { t: 'p', html: '顺带一个常考的进阶结论：设头到环入口距离为 a，环长为 L，相遇点距入口为 b，则快指针走过 <code>a + nL + b</code>、慢指针走过 <code>a + b</code>，且前者是后者两倍，化简得 <code>a + b = nL</code>，即 <code>a = nL - b</code>。<b>含义是：从相遇点和从头同时各走一个指针，它们会在环入口相遇。</b>这条推导在面试和考试里都出现过。' },

    { t: 'h', lvl: 2, text: '五、栈：后进先出的三种用途', id: 'ch02-5' },

    { t: 'p', html: '栈（stack）的契约只有四条：<code>push</code> 压入、<code>pop</code> 弹出、<code>peek</code> 查看栈顶、<code>isEmpty</code> 判空。<b>后进先出</b>（LIFO）是它唯一的规矩。用动态数组实现时栈顶就是数组尾部，所有操作 O(1)；用链表实现时栈顶就是头节点，同样 O(1)。两种实现都对，选哪个只看常数和内存。' },

    { t: 'p', html: '栈之所以重要，是因为<b>「最近发生的先处理」这个模式在计算里到处都是</b>。下面三类用途几乎覆盖了所有栈的应用：' },

    { t: 'steps', items: [
      { title: '用途一 · 配对与嵌套', html: '括号匹配、HTML 标签闭合、编译器的块结构检查。规则是：遇到左括号压栈，遇到右括号就弹出栈顶比对；结束时栈必须为空。嵌套天然是 LIFO，这是栈最纯粹的用途。' },
      { title: '用途二 · 回溯与撤销', html: '编辑器的 undo、浏览器的后退、迷宫求解、DFS。共同点是「走不通就退回上一个状态」，而「上一个状态」正是最后压进去的那个。' },
      { title: '用途三 · 表达式的转换与求值', html: '中缀转后缀（调度场算法）、后缀表达式求值、函数调用栈。运算符的优先级本质上是一个嵌套结构，所以用栈处理最自然。' }
    ] },

    { t: 'code', lang: 'java', caption: '括号匹配：栈的教科书用例，十行写完', code: `boolean balanced(String s) {
    Deque<Character> st = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') st.push(c);
        else if (c == ')' || c == ']' || c == '}') {
            if (st.isEmpty()) return false;        // 右括号多了
            char open = st.pop();
            if (!match(open, c)) return false;     // 类型不配对
        }
    }
    return st.isEmpty();                           // 左括号多了
}

boolean match(char o, char c) {
    return (o == '(' && c == ')') || (o == '[' && c == ']') || (o == '{' && c == '}');
}` },

    { t: 'p', html: '这段代码的两个 <code>return false</code> 和最后的 <code>return st.isEmpty()</code> 分别对应三种错误：<b>右括号多余</b>、<b>左右类型不匹配</b>、<b>左括号多余</b>。初学者常漏掉第三种——只写 <code>return true</code>，于是输入 <code>"(("</code> 也会被判为合法。' },

    { t: 'callout', kind: 'tip', title: 'Java 里该用哪个栈', html: '不要用 <code>java.util.Stack</code>：它是 1996 年的遗留类，继承自 <code>Vector</code>，所有方法都上了 <code>synchronized</code>，单线程下白付锁开销。官方推荐用 <code>Deque&lt;E&gt; st = new ArrayDeque&lt;&gt;()</code>，用 <code>push / pop / peek</code> 三个方法即可。<b>注意别混用 <code>addFirst</code> 与 <code>pop</code> 的语义</b>：<code>Deque</code> 同时支持两端，方向搞反会让栈变成队列。' },

    { t: 'h', lvl: 2, text: '六、队列、双端队列与循环数组', id: 'ch02-6' },

    { t: 'p', html: '队列（queue）的规矩是<b>先进先出</b>（FIFO）：<code>enqueue</code> 从队尾入、<code>dequeue</code> 从队头出。它对应「先来先服务」的场景：打印任务、消息队列、BFS 的待访问列表、操作系统的就绪队列。' },

    { t: 'p', html: '用链表实现队列很直接：头指针出队、尾指针入队，两边都 O(1)。但用数组实现就有一个坑：如果每次出队都把后面所有元素往前挪一格，单次出队变成 O(n)。循环数组（circular array，也叫环形缓冲区）解决这个问题——<b>不搬数据，只挪下标</b>，走到末尾就绕回 0。' },

    { t: 'code', lang: 'java', caption: '循环数组队列：用 size 区分「空」与「满」', code: `class CircleQueue<E> {
    private Object[] buf;
    private int head = 0, tail = 0, size = 0;

    CircleQueue(int cap) { buf = new Object[cap]; }

    void enqueue(E x) {
        if (size == buf.length) throw new IllegalStateException("full");
        buf[tail] = x;
        tail = (tail + 1) % buf.length;
        size++;
    }

    @SuppressWarnings("unchecked")
    E dequeue() {
        if (size == 0) throw new NoSuchElementException();
        E x = (E) buf[head];
        buf[head] = null;
        head = (head + 1) % buf.length;
        size--;
        return x;
    }

    boolean isEmpty() { return size == 0; }
    boolean isFull()  { return size == buf.length; }
}` },

    { t: 'p', html: '注意这里为什么要多存一个 <code>size</code>。如果只靠 <code>head == tail</code> 判断，那么「空队列」和「满队列」的条件一模一样，无法区分。两种常见解法：<b>（a）多存一个 size 字段</b>（上面的写法，最清晰）；<b>（b）故意留一个空位</b>，队列最多装 <code>cap - 1</code> 个，判满条件改成 <code>(tail + 1) % cap == head</code>。前者多 4 个字节，后者浪费一个槽位，工程上更常用前者。' },

    { t: 'table', head: ['实现方式', 'enqueue', 'dequeue', '空间', '注意点'], rows: [
      ['数组（每次搬移）', 'O(1)', 'O(n)', 'O(n)', '出队搬移是性能杀手，别这么写'],
      ['循环数组', 'O(1) 摊还', 'O(1)', 'O(n) 固定', '必须用 size 或留空位区分空/满'],
      ['单链表（头出尾入）', 'O(1)', 'O(1)', 'O(n) 动态', '要维护 tail 指针，删空后记得置 null'],
      ['双端队列 Deque', 'O(1)', 'O(1)', 'O(n)', '两端都能进出，ArrayDeque 是首选']
    ], caption: '循环数组胜在缓存友好；链表胜在不用预估容量' },

    { t: 'p', html: '双端队列（deque，double-ended queue）是队列的加强版：两端都能入、两端都能出。它一个结构顶三个用——只在一端进出就是栈，一端进另一端出就是队列，两端都能进出的场景（滑动窗口最值、回文判断）也覆盖。<code>ArrayDeque</code> 用循环数组实现，是 Java 里最推荐的栈/队列实现。' },

    { t: 'h', lvl: 2, text: '七、栈与队列的互相实现', id: 'ch02-7' },

    { t: 'p', html: '「用两个栈实现队列」是经典面试题，思路值得体会，因为它展示了<b>如何用受限工具拼出另一个受限工具</b>。设两个栈 <code>in</code> 和 <code>out</code>：入队时压进 <code>in</code>；出队时如果 <code>out</code> 为空，就把 <code>in</code> 里的元素<b>全部倒过去</b>（顺序正好反转两次，变成先进先出），再从 <code>out</code> 弹出。' },

    { t: 'p', html: '复杂度分析是这道题的重点：单次出队最坏 O(n)（要倒一次），但<b>每个元素最多被倒一次</b>，所以 n 次操作的总额外代价是 O(n)，<b>摊还 O(1)</b>。这和上一章动态数组扩容的分析是同一个套路——把偶发的高代价摊到整体上看。' },

    { t: 'code', lang: 'java', caption: '两个栈实现队列：倒一次，管很久', code: `class QueueByStacks<E> {
    private final Deque<E> in = new ArrayDeque<>();
    private final Deque<E> out = new ArrayDeque<>();

    void enqueue(E x) { in.push(x); }

    E dequeue() {
        if (out.isEmpty()) {
            while (!in.isEmpty()) out.push(in.pop());  // 整体倒一次
        }
        if (out.isEmpty()) throw new NoSuchElementException();
        return out.pop();
    }

    boolean isEmpty() { return in.isEmpty() && out.isEmpty(); }
}` },

    { t: 'p', html: '反向的「用两个队列实现栈」也能做，但代价更高：每次 push 要把已有元素在两条队列之间倒一遍，或者每次 pop 倒 n-1 个。思路是<b>让新元素永远在队头</b>，实现上要 O(n) 的搬移。所以现实中没人这么干——这题的价值在于让你看清「栈比队列更强」：栈能模拟队列（摊还 O(1)），队列模拟栈要 O(n)。' },

    { t: 'quiz', qid: 'ch02-q1' },
    { t: 'quiz', qid: 'ch02-q2' },

    { t: 'terms', items: [
      { en: 'linked list', zh: '链表', html: '由节点组成的线性结构，每个节点存数据与指向后继的引用，内存不要求连续。' },
      { en: 'sentinel node', zh: '哨兵节点', html: '放在真实首元素之前、不存有效数据的节点，用来消除头节点特判。' },
      { en: 'doubly linked list', zh: '双链表', html: '每个节点同时存前驱与后继引用，支持 O(1) 删除当前节点与反向遍历。' },
      { en: 'Floyd cycle detection', zh: 'Floyd 判圈算法', html: '快慢指针同向出发，有环必相遇、无环快指针先到 null，时间 O(n) 空间 O(1)。' },
      { en: 'stack', zh: '栈', html: '后进先出（LIFO）的线性结构，支持 push/pop/peek，用于配对、回溯与表达式求值。' },
      { en: 'queue', zh: '队列', html: '先进先出（FIFO）的线性结构，支持 enqueue/dequeue，用于调度与 BFS。' },
      { en: 'circular buffer', zh: '环形缓冲区', html: '用取模让下标绕回起点的数组，无需搬移即可反复入队出队。' }
    ] },

    { t: 'quiz', qid: 'ch02-q3' },

    { t: 'keypoint', items: [
      { title: '链表用引用换连续', html: '已知前驱时插入删除 O(1)，定位 O(n)；缓存不友好，实测常慢于数组。' },
      { title: '哨兵消掉头节点特判', html: '判据：代码里有没有两处以上在特判 head；记得返回 dummy.next。' },
      { title: '快慢指针省一遍遍历', html: '中点、判环、找倒数第 k 个都能用；判环必须比较引用而非值。' },
      { title: '栈 = LIFO，队列 = FIFO', html: '栈管配对与回溯，队列管调度与 BFS；Java 里都优先用 ArrayDeque。' },
      { title: '循环数组要能区分空与满', html: '多存 size 或故意留一个空位，两种方案二选一，别靠 head==tail 猜。' }
    ] },

    { t: 'checklist', id: 'ch02', items: [
      '我能不看书写出单链表的插入、删除与反转，并说清三个引用的更新顺序',
      '我能解释「链表插入 O(1)」这句话缺了什么前提',
      '我能画出有哨兵与无哨兵两种删除代码，并说出哨兵省掉了哪几行',
      '我能用快慢指针找出中点与判环，并说明无环时循环会怎样结束',
      '我能说出栈的三类用途，各举一个具体系统例子',
      '我能用循环数组实现队列，并解释为什么必须多存一个 size',
      '我能说出 Java 里为什么不该用 java.util.Stack 而该用 ArrayDeque',
      '我能分析「两个栈实现队列」的摊还复杂度并说明每个元素最多被倒几次'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 CSC3100 Lecture 05（linked list，含单/双/循环链表与哨兵）与 Lecture 07（stack & queue，含循环数组队列与双端队列）组织；快慢指针与环入口的推导参照 CLRS《算法导论》第 10 章「基本数据结构」的链表一节，环形缓冲区部分对照 OpenJDK 的 <code>ArrayDeque</code> 实现。「两个栈实现队列」的摊还分析结论与第 01 章的摊还记账法一致，可对照复习。' }
  ]
});
