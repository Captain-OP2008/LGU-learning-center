/* =====================================================================
 * data/ch18.js · 第 18 章：符号表
 * 职责：键值映射、顺序查找、有序数组与二分查找、哈希表与分离链接、
 *       二叉查找树、四条路线性能对比、词典与倒排索引、选型判据。
 * 内容块 schema 见 data/ 各文件注释；示例输出均在本站 Java 引擎里实跑核对。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch18',
  num: '18',
  title: '符号表',
  en: 'Symbol Tables',

  goals: [
    '能说清符号表要解决什么问题，并写出它的基本操作',
    '能用无序数组实现顺序查找，并解释为什么它慢',
    '能用有序数组加二分查找，把查找从 O(n) 降到 O(log n)',
    '能实现分离链接的哈希表，解释哈希冲突从哪来',
    '能实现二叉查找树，并说清它为什么会退化成链表',
    '能根据数据规模与操作特点，在四种实现里选对那一个'
  ],

  kp: [
    { id: 'ch18-1', title: '键值对：符号表要解决什么' },
    { id: 'ch18-2', title: '顺序查找：最直接的做法' },
    { id: 'ch18-3', title: '有序数组与二分查找' },
    { id: 'ch18-4', title: '哈希表：把键变成下标' },
    { id: 'ch18-5', title: '哈希冲突与分离链接' },
    { id: 'ch18-6', title: '二叉查找树' },
    { id: 'ch18-7', title: '性能对比：四条路线' },
    { id: 'ch18-8', title: '应用：词典查找与倒排索引' },
    { id: 'ch18-9', title: '该选哪个：一张决策表' }
  ],

  blocks: [

    { t: 'callout', kind: 'why', html:
      '你手机里的通讯录、浏览器的访问记录、编译器的变量表、数据库的索引——它们的内部结构完全不同，' +
      '但都做同一件事：<b>给一个键，立刻拿到对应的值</b>。给姓名拿到电话，给 URL 拿到缓存页面，' +
      '给变量名拿到内存地址，给学号拿到成绩。这种「键 → 值」的映射就是<b>符号表（symbol table）</b>，' +
      '也叫字典、映射、关联数组。<br>' +
      '它为什么值得单独一章？因为"怎么找"决定了程序是快还是慢：同样一万条数据，' +
      '一条一条比最坏要比一万次，哈希表平均一次就够，二叉查找树大约比十四次。' +
      '<b>数据结构的选择，直接决定了查找的代价</b>——这正是本章要比较的四条路线。'
    },

    { t: 'p', lead: true, html:
      '这一章按"问题 → 最笨的实现 → 逐步变快"的顺序走：先用无序数组做顺序查找，' +
      '再用有序数组加二分查找，然后看哈希表怎么把查找变成 O(1)，最后用二叉查找树理解"有序"的另一种代价。' +
      '四段代码都能跑，你会看到同样的查询在不同实现里比较次数差多少。'
    },

    { t: 'p', html:
      '符号表的接口很小，只有五六个方法：<code>put(key, value)</code> 插入或替换、' +
      '<code>get(key)</code> 查找、<code>delete(key)</code> 删除、<code>contains(key)</code> 是否存在、' +
      '<code>size()</code> 元素个数、<code>keys()</code> 遍历所有键。' +
      '本章约定：<b>键唯一</b>（重复 put 会覆盖旧值）、<b>键不可变</b>（放进表里之后不能改，' +
      '否则哈希值和排序位置都会失效）、<b>不允许 null 键</b>。'
    },

    { t: 'table',
      head: ['场景', '键', '值'],
      rows: [
        ['通讯录', '姓名', '手机号'],
        ['词典', '单词', '释义'],
        ['学籍系统', '学号', '成绩单'],
        ['网页缓存', 'URL', '页面内容'],
        ['编译器符号表', '变量名', '类型与位置'],
        ['词频统计', '单词', '出现次数']
      ],
      caption: '键负责"找"，值负责"用"：几乎所有「按名字取东西」的需求，底层都是符号表' },

    { t: 'h', text: '一、键值对：符号表要解决什么', id: 'ch18-1' },

    { t: 'h', text: '二、顺序查找：最直接的做法', id: 'ch18-2' },

    { t: 'p', html:
      '先把问题说清楚：给定 n 个键值对，要支持"按任意键快速取值"。' +
      '最直接的办法是存一个数组，查找时从头比到尾——<b>这就是顺序查找（sequential search）</b>。' +
      '它的优点是插入极快（直接放到末尾），缺点是查找慢：平均要比较 n/2 次，最坏 n 次。' +
      '数据量小的时候（几十条）完全够用，一万条以上就开始明显变慢。<br>' +
      '下面这个类用两个平行数组存键和值：<code>keys[i]</code> 与 <code>vals[i]</code> 是同一个键值对。' +
      '为了把"慢"量化，它统计了每次查找的比较次数——这是本章所有程序共用的手法：' +
      '<b>不看耗时，看比较次数</b>，因为比较次数与机器无关、可以被精确预测。'
    },

    { t: 'code', caption: 'LinearST.java —— 五个词，查 cherry 比 3 次、查 zebra 比 5 次', code:
`public class LinearST {
    private String[] keys = new String[100];
    private int[] vals = new int[100];
    private int n = 0;
    private int compares = 0;

    public void put(String key, int val) {
        for (int i = 0; i < n; i++) {
            if (keys[i].equals(key)) {
                vals[i] = val;          // 键已存在：替换旧值
                return;
            }
        }
        keys[n] = key;
        vals[n] = val;
        n++;
    }

    public int get(String key) {
        compares = 0;
        for (int i = 0; i < n; i++) {
            compares++;
            if (keys[i].equals(key)) {
                return vals[i];
            }
        }
        return -1;
    }

    public int size() { return n; }
    public int lastCompares() { return compares; }

    public static void main(String[] args) {
        LinearST st = new LinearST();
        String[] words = {"apple", "banana", "cherry", "date", "elder"};
        for (int i = 0; i < words.length; i++) {
            st.put(words[i], (i + 1) * 10);
        }
        System.out.println("n = " + st.size());
        System.out.println("get(cherry) = " + st.get("cherry") + "  compares = " + st.lastCompares());
        System.out.println("get(zebra)  = " + st.get("zebra") + "  compares = " + st.lastCompares());
        System.out.println("get(apple)  = " + st.get("apple") + "  compares = " + st.lastCompares());
        st.put("cherry", 99);
        System.out.println("after put(cherry, 99): value = " + st.get("cherry") + "  n = " + st.size());
    }
}
` },

    { t: 'p', html:
      '输出五行：<code>n = 5</code>、<code>get(cherry) = 30  compares = 3</code>、' +
      '<code>get(zebra) = -1  compares = 5</code>、<code>get(apple) = 10  compares = 1</code>、' +
      '<code>after put(cherry, 99): value = 99  n = 5</code>。' +
      '看比较次数：cherry 排第 3 位所以比 3 次，zebra 不存在所以<b>从头比到尾</b>共 5 次，' +
      'apple 排第 1 位只比 1 次。插入 cherry 新值时，<code>put</code> 找到同一个键并替换，' +
      '元素个数仍然是 5——这就是"键唯一"的含义。' +
      '数据量变成 1 万时，不存在的键要比较 1 万次——<b>顺序查找的代价与 n 成正比</b>，这是它最大的问题。'
    },

    { t: 'h', text: '三、有序数组与二分查找', id: 'ch18-3' },

    { t: 'p', html:
      '如果键按顺序排好，查找就不必从头开始：每次比较<b>中间那个</b>键，就能一次排除一半。' +
      '查 <code>honey</code> 时先看中间（date），比它大就只看右半边；再看右半边中间（fig），' +
      '还是大就继续往右——<b>8 个键最多比 3~4 次，1000 个键最多 10 次</b>。' +
      '这就是二分查找（binary search），代价从 O(n) 降到 O(log n)。<br>' +
      '代价也很直接：数组必须<b>保持有序</b>，于是每次 put 都要先二分找到插入位置，' +
      '再把后面的元素整体右移一位——插入变成 O(n)。' +
      '换句话说，二分查找是"<b>用插入的代价换查找的代价</b>"：读多写少时很划算，频繁插入就不划算。'
    },

    { t: 'code', caption: 'BinaryST.java —— 同样的 8 个键：查 honey 比 4 次，查不存在的 zebra 也比 4 次', code:
`public class BinaryST {
    private String[] keys = new String[100];
    private int[] vals = new int[100];
    private int n = 0;
    private int compares = 0;

    public void put(String key, int val) {
        int lo = 0;
        int hi = n - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            int cmp = keys[mid].compareTo(key);
            if (cmp == 0) {
                vals[mid] = val;
                return;
            }
            if (cmp < 0) lo = mid + 1;
            else hi = mid - 1;
        }
        for (int i = n; i > lo; i--) {
            keys[i] = keys[i - 1];
            vals[i] = vals[i - 1];
        }
        keys[lo] = key;
        vals[lo] = val;
        n++;
    }

    public int get(String key) {
        compares = 0;
        int lo = 0;
        int hi = n - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            compares++;
            int cmp = keys[mid].compareTo(key);
            if (cmp == 0) return vals[mid];
            if (cmp < 0) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }

    public int size() { return n; }
    public int lastCompares() { return compares; }

    public String keysInOrder() {
        String s = "";
        for (int i = 0; i < n; i++) {
            if (i > 0) s = s + " ";
            s = s + keys[i];
        }
        return s;
    }

    public static void main(String[] args) {
        BinaryST st = new BinaryST();
        String[] words = {"apple", "banana", "cherry", "date", "elder", "fig", "grape", "honey"};
        for (int i = 0; i < words.length; i++) {
            st.put(words[i], (i + 1) * 10);
        }
        System.out.println("keys in order: " + st.keysInOrder());
        System.out.println("get(honey) = " + st.get("honey") + "  compares = " + st.lastCompares());
        System.out.println("get(zebra) = " + st.get("zebra") + "  compares = " + st.lastCompares());
        System.out.println("get(apple) = " + st.get("apple") + "  compares = " + st.lastCompares());
    }
}
` },

    { t: 'p', html:
      '输出四行：<code>keys in order: apple banana cherry date elder fig grape honey</code>、' +
      '<code>get(honey) = 80  compares = 4</code>、<code>get(zebra) = -1  compares = 4</code>、' +
      '<code>get(apple) = 10  compares = 3</code>。' +
      '对比上一段：<b>查不存在的 zebra，顺序查找要 5 次（换成 8 个键就要 8 次），二分只要 4 次</b>；' +
      'n 越大差距越明显——n = 1,000,000 时顺序查找最坏 100 万次，二分只要 20 次。' +
      '注意 <code>put</code> 里那个从后往前的移位循环：这就是"插入 O(n)"的来源，也是二分查找的代价。'
    },

    { t: 'callout', kind: 'warn', title: '二分查找的三个前提', html:
      '① <b>必须有序</b>：数组乱序时二分结果是错的（不是慢，是错）。每次 put 都要维护有序。' +
      '② <b>必须能比较大小</b>：键要能排序（字符串、数字可以，复杂对象要定义比较规则）。' +
      '③ <b>中点别写错</b>：<code>(lo + hi) / 2</code> 在 lo、hi 都很大时会整数溢出，' +
      '所以写成 <code>lo + (hi - lo) / 2</code>；循环条件用 <code>lo &lt;= hi</code>，' +
      '更新时 <code>lo = mid + 1</code>、<code>hi = mid - 1</code>，否则会死循环。'
    },

    { t: 'h', text: '四、哈希表：把键变成下标', id: 'ch18-4' },

    { t: 'p', html:
      '顺序查找和二分查找都要"比较键"，哈希表换了个思路：<b>先算，再直接跳过去</b>。' +
      '把键交给一个哈希函数（hash function），得到一个整数，再对桶数取模，就得到它该待的下标——' +
      '查找时用同样的计算一步定位，不用比较整个表。理想情况下，查找、插入、删除都是 <b>O(1)</b>。' +
      '这就是为什么哈希表是"字典"类结构里最快的通用选择。<br>' +
      '下面是一个最朴素的哈希函数：把每个字符的编码累加进 <code>h = (h * 31 + c) % m</code>，' +
      '<code>m</code> 是桶的个数（这里取 5）。<code>31</code> 是质数，能打散相近的字符串。' +
      '看结果：8 个单词被分到 5 个桶里，<b>apple 和 fig 撞在 0 号桶，grape 和 honey 撞在 2 号桶</b>——' +
      '桶比键少，撞车不可避免。'
    },

    { t: 'code', caption: 'HashDemo.java —— 8 个单词进 5 个桶：谁和谁撞了', code:
`public class HashDemo {
    static int hash(String key, int m) {
        int h = 0;
        for (int i = 0; i < key.length(); i++) {
            h = (h * 31 + key.charAt(i)) % m;
        }
        return h;
    }

    public static void main(String[] args) {
        String[] words = {"apple", "banana", "cherry", "date", "elder", "fig", "grape", "honey"};
        int m = 5;
        for (String w : words) {
            System.out.println(w + " -> bucket " + hash(w, m));
        }
    }
}
` },

    { t: 'p', html:
      '输出八行，按顺序是：<code>apple -> bucket 0</code>、<code>banana -> bucket 4</code>、' +
      '<code>cherry -> bucket 3</code>、<code>date -> bucket 4</code>、<code>elder -> bucket 4</code>、' +
      '<code>fig -> bucket 0</code>、<code>grape -> bucket 2</code>、<code>honey -> bucket 2</code>。' +
      '同一个键每次算出的下标一定相同（这是查找能成立的前提），但不同的键完全可能算出相同的下标。' +
      '<b>两个键争同一个桶，就叫哈希冲突（collision）</b>。冲突不是 bug，而是"键多桶少"的必然结果，' +
      '每个哈希表实现都必须有处理冲突的策略——下一节讲最常用的分离链接。'
    },

    { t: 'callout', kind: 'warn', title: '好的哈希函数要满足三件事', html:
      '① <b>确定性</b>：同一个键每次必须得到同一个值，否则存入和取出会落到不同桶。' +
      '② <b>均匀性</b>：键应尽量均匀散到各个桶，避免"所有键都撞在一起"。' +
      '③ <b>快</b>：哈希函数本身要 O(1) 或 O(键长)，不能算一次哈希比顺序查找还慢。' +
      'Java 的 <code>String.hashCode()</code> 用的就是 <code>h = 31*h + c</code> 这个公式，' +
      '和上面程序里的写法一致；真实实现还会再做一次"扰动"让低位也参与，减少规律性冲突。'
    },

    { t: 'h', text: '五、哈希冲突与分离链接', id: 'ch18-5' },

    { t: 'p', html:
      '处理冲突最常见的两种办法是<b>分离链接（separate chaining）</b>与<b>开放寻址（open addressing）</b>。' +
      '分离链接最直观：每个桶不是存一个元素，而是存一个<b>链表</b>——撞到同一个桶的键都挂在这条链上。' +
      '查找时先算桶，再沿链表比较键；插入时直接插到链头，O(1)。' +
      '只要哈希函数均匀、桶数足够，平均每条链很短，查找仍是常数级。<br>' +
      '下面这个哈希表有 5 个桶，8 个单词，正是上一节的分组结果：0 号桶挂 2 个，2 号桶挂 2 个，' +
      '4 号桶挂了 3 个（banana、date、elder）。注意 <code>get</code> 的比较次数统计：' +
      '查 <code>cherry</code> 独占 3 号桶，只需 1 次比较；查不存在的 <code>zebra</code>，' +
      '它落在 4 号桶，需要沿链比较 2 次才确认"没有"。'
    },

    { t: 'code', caption: 'HashST.java —— 5 个桶装 8 个键：链长 1 到 3，查 cherry 只比 1 次', code:
`class EntryNode {
    String key;
    int val;
    EntryNode next;

    EntryNode(String key, int val, EntryNode next) {
        this.key = key;
        this.val = val;
        this.next = next;
    }
}

public class HashST {
    private EntryNode[] buckets = new EntryNode[5];
    private int n = 0;
    private int compares = 0;

    private int hash(String key) {
        int h = 0;
        for (int i = 0; i < key.length(); i++) {
            h = (h * 31 + key.charAt(i)) % buckets.length;
        }
        return h;
    }

    public void put(String key, int val) {
        int b = hash(key);
        for (EntryNode x = buckets[b]; x != null; x = x.next) {
            if (x.key.equals(key)) {
                x.val = val;
                return;
            }
        }
        buckets[b] = new EntryNode(key, val, buckets[b]);
        n++;
    }

    public int get(String key) {
        compares = 0;
        for (EntryNode x = buckets[hash(key)]; x != null; x = x.next) {
            compares++;
            if (x.key.equals(key)) {
                return x.val;
            }
        }
        return -1;
    }

    public int size() { return n; }
    public int lastCompares() { return compares; }

    public int chainLength(int b) {
        int len = 0;
        for (EntryNode x = buckets[b]; x != null; x = x.next) {
            len++;
        }
        return len;
    }

    public int maxChain() {
        int best = 0;
        for (int b = 0; b < buckets.length; b++) {
            if (chainLength(b) > best) best = chainLength(b);
        }
        return best;
    }

    public static void main(String[] args) {
        HashST st = new HashST();
        String[] words = {"apple", "banana", "cherry", "date", "elder", "fig", "grape", "honey"};
        int[] vals = {10, 20, 30, 40, 50, 60, 70, 80};
        for (int i = 0; i < words.length; i++) {
            st.put(words[i], vals[i]);
        }
        System.out.println("n = " + st.size());
        for (int b = 0; b < 5; b++) {
            if (st.chainLength(b) > 0) {
                System.out.println("bucket " + b + ": chain length " + st.chainLength(b));
            }
        }
        System.out.println("max chain length = " + st.maxChain());
        System.out.println("get(cherry) = " + st.get("cherry") + "  compares = " + st.lastCompares());
        System.out.println("get(zebra)  = " + st.get("zebra") + "  compares = " + st.lastCompares());
    }
}
` },

    { t: 'p', html:
      '输出依次是：<code>n = 8</code>、<code>bucket 0: chain length 2</code>、' +
      '<code>bucket 2: chain length 2</code>、<code>bucket 3: chain length 1</code>、' +
      '<code>bucket 4: chain length 3</code>、<code>max chain length = 3</code>、' +
      '<code>get(cherry) = 30  compares = 1</code>、<code>get(zebra) = -1  compares = 2</code>。' +
      '关键结论：<b>哈希表的查找代价取决于链长，而不是键的总数</b>。' +
      '8 个键、5 个桶时最长链是 3；如果桶加到 100 个，链几乎全是 1，查找就是"一次命中"。' +
      '所以工程上会把桶数设为"预计元素数的两倍左右"，并随着元素增多扩容（重新哈希）。' +
      '注意 <code>put</code> 的写法：先沿链找同键（有就替换），没有就把新节点插到链头——' +
      '链头插入让 put 也是 O(1)，而 Java 里链太长的桶会转成红黑树把最坏情况压到 O(log n)。'
    },

    { t: 'h', text: '六、二叉查找树：有序的另一种代价', id: 'ch18-6' },

    { t: 'p', html:
      '哈希表快，但丢了一件事：<b>顺序</b>。它无法"按字母序输出所有键"，也无法找"比 k 大的最小键"。' +
      '二叉查找树（binary search tree, BST）把"有序"重新捡了起来：每个节点存一个键值对，' +
      '并保证<b>左子树所有键都小于自己、右子树所有键都大于自己</b>。' +
      '于是中序遍历（左 → 根 → 右）会按顺序输出所有键，查找则像二分查找一样每层排除一半。<br>' +
      '下面这个 BST 按 <code>date → banana → fig → apple → cherry → elder → grape → honey</code> 的顺序插入。' +
      '第一个键 <code>date</code> 成为根，比它小的往左、大的往右，树自然长成左右均衡的形态。' +
      '中序遍历输出正是字母序；查找 <code>honey</code> 从根开始比较 4 次，' +
      '查找不存在的 <code>zebra</code> 也只要 4 次——这就是"每层排除一半"的效果。'
    },

    { t: 'code', caption: 'BSTDemo.java —— 8 个键、树高 4：中序有序，查 honey 比 4 次', code:
`class TreeNode {
    String key;
    int val;
    TreeNode left;
    TreeNode right;

    TreeNode(String key, int val) {
        this.key = key;
        this.val = val;
    }
}

public class BSTDemo {
    private TreeNode root;
    private int compares = 0;

    public void put(String key, int val) {
        root = put(root, key, val);
    }

    private TreeNode put(TreeNode x, String key, int val) {
        if (x == null) return new TreeNode(key, val);
        int cmp = key.compareTo(x.key);
        if (cmp < 0) x.left = put(x.left, key, val);
        else if (cmp > 0) x.right = put(x.right, key, val);
        else x.val = val;
        return x;
    }

    public int get(String key) {
        compares = 0;
        TreeNode x = root;
        while (x != null) {
            compares++;
            int cmp = key.compareTo(x.key);
            if (cmp < 0) x = x.left;
            else if (cmp > 0) x = x.right;
            else return x.val;
        }
        return -1;
    }

    public int lastCompares() { return compares; }

    public void inorder() {
        inorder(root);
        System.out.println();
    }

    private void inorder(TreeNode x) {
        if (x == null) return;
        inorder(x.left);
        System.out.print(x.key + " ");
        inorder(x.right);
    }

    public static void main(String[] args) {
        BSTDemo st = new BSTDemo();
        String[] words = {"date", "banana", "fig", "apple", "cherry", "elder", "grape", "honey"};
        int[] vals = {40, 20, 60, 10, 30, 50, 70, 80};
        for (int i = 0; i < words.length; i++) {
            st.put(words[i], vals[i]);
        }
        System.out.print("inorder: ");
        st.inorder();
        System.out.println("get(honey) = " + st.get("honey") + "  compares = " + st.lastCompares());
        System.out.println("get(zebra) = " + st.get("zebra") + "  compares = " + st.lastCompares());
        System.out.println("get(grape) = " + st.get("grape") + "  compares = " + st.lastCompares());
    }
}
` },

    { t: 'p', html:
      '输出四行：<code>inorder: apple banana cherry date elder fig grape honey</code>、' +
      '<code>get(honey) = 80  compares = 4</code>、<code>get(zebra) = -1  compares = 4</code>、' +
      '<code>get(grape) = 70  compares = 3</code>。' +
      '树高是 4（date 根 → fig → grape → honey），所以在最坏位置找也要 4 次。' +
      '换成 8 个键的二分查找，最多也是 4 次；换成哈希表可能 1 次——但 BST 多给了你两样东西：' +
      '<b>中序遍历直接有序</b>、<b>能回答"比 k 大的最小键"这类范围查询</b>。' +
      '这就是"选择结构取决于要用到什么操作"的典型例子。'
    },

    { t: 'callout', kind: 'warn', title: 'BST 的致命弱点：插入顺序决定形状', html:
      'BST 不是自动平衡的。把同样的 8 个键<b>按字母序</b>插入（apple、banana、cherry……），' +
      '每个新键都往右走，树会退化成一个链表：根是 apple，最深是 honey，<b>查 honey 要比较 8 次</b>——' +
      '和顺序查找一样慢，却多花了指针空间。这就是为什么真实实现用红黑树、AVL 树或 B 树：' +
      '在插入时做旋转，把树高维持在 O(log n)。第 20 章之后的高级数据结构会展开。' +
      '本章只需要记住：<b>BST 的 O(log n) 是"平均"结论，最坏是 O(n)</b>。'
    },

    { t: 'h', text: '七、性能对比：四条路线', id: 'ch18-7' },

    { t: 'p', html:
      '把前面四条路线放在一张表里。注意"平均"与"最坏"要分开看：哈希表的 O(1) 是平均代价，' +
      '最坏（所有键撞一条链）仍是 O(n)；BST 的 O(log n) 也只在树平衡时成立。' +
      '考试与工程评估都要求你能说出"这个结论的前提是什么"。'
    },

    { t: 'table',
      head: ['实现', '查找', '插入', '有序遍历', '适用场景'],
      rows: [
        ['无序数组 + 顺序查找', 'O(n)', 'O(1)', '需先排序', '数据量小、几乎不改动'],
        ['有序数组 + 二分查找', 'O(log n)', 'O(n)（要移位）', 'O(n)', '建表后只读，查询极多'],
        ['哈希表 + 分离链接', 'O(1) 平均，O(n) 最坏', 'O(1) 平均', '无序', '通用键值查询、缓存、去重'],
        ['二叉查找树', 'O(log n) 平均，O(n) 最坏', 'O(log n) 平均', 'O(n) 且有序', '需要按序遍历或范围查询']
      ],
      caption: '四条路线不是"谁绝对最好"，而是各自对应一类操作组合；平均与最坏必须分开说' },

    { t: 'p', html:
      '还有两个常被忽略但很实用的选择：<b>直接数组索引</b>（键本身是 0..M-1 的整数时，' +
      '直接用数组下标当键，查找就是 O(1)，比哈希还快，例如"统计各年龄段人数"）与' +
      '<b>有序链表</b>（插入 O(n)、查找 O(n)，几乎总是不如数组，只在"边插边有序遍历"时有意义）。' +
      '第 11 章排序、第 12 章递归里的很多算法，都是"先建符号表再查"的变体。'
    },

    { t: 'h', text: '八、应用：词典查找与倒排索引', id: 'ch18-8' },

    { t: 'p', html:
      '教材里最经典的两个应用是<b>词典查找</b>与<b>倒排索引</b>。词典查找：把「单词 → 解释」的表格读进符号表，' +
      '再从标准输入读单词，逐个查表输出。倒排索引：反过来记「单词 → 它出现过的行号列表」，' +
      '搜索引擎的"关键词到文档"就是它的放大版。两者的共同点是<b>先建一张表，再反复查询</b>——' +
      '这正是符号表擅长的事。<br>' +
      '下面的 <code>Lookup</code> 程序来自教材 §4.4：从 csv 文件建表（<code>args[0]</code>），' +
      '<code>args[1]</code> 指定键在哪一列、<code>args[2]</code> 指定值在哪一列，然后从标准输入逐行读键。' +
      '它用到了教材库 <code>In</code>（读文件）、<code>StdIn</code>（读标准输入）、<code>StdOut</code>（输出）' +
      '与泛型符号表 <code>ST</code>，本站引擎不提供这些，所以这里标为不可运行，' +
      '但逻辑值得逐行读懂：<b>建表一次，查询多次</b>。'
    },

    { t: 'code', caption: 'Lookup.java —— csv 文件当词典，从标准输入查（教材库 · 需本地 JDK + algs4.jar）', run: false, code:
`public class Lookup {
    public static void main(String[] args) {
        In in = new In(args[0]);
        int keyField = Integer.parseInt(args[1]);
        int valField = Integer.parseInt(args[2]);
        ST<String, String> st = new ST<String, String>();

        while (in.hasNextLine()) {
            String[] tokens = in.readLine().split(",");
            String key = tokens[keyField];
            String val = tokens[valField];
            st.put(key, val);
        }

        while (!StdIn.isEmpty()) {
            String s = StdIn.readString();
            if (!st.contains(s)) StdOut.println("Not found");
            else StdOut.println(st.get(s));
        }
    }
}
` },

    { t: 'p', html:
      '在本地 JDK 上跑起来的样子（教材原文示例）：<code>java Lookup amino.csv 0 3</code> 之后输入 ' +
      '<code>TTA</code>，输出 <code>Leucine</code>；<code>java Lookup ip.csv 0 1</code> 之后输入 ' +
      '<code>www.abc.com</code>，输出 <code>192.168.1.1</code>。<code>args</code> 的三个参数分别是' +
      '"数据文件、键列号、值列号"，所以同一份 csv 换个列号就能按另一列当键建表。' +
      '体会一下它的结构：<b>while 建表 + while 查询</b>，中间只有一个符号表——这就是最简单的"数据库"。'
    },

    { t: 'p', html:
      '倒排索引把键值对反过来用：键是<b>单词</b>，值是<b>行号列表</b>。教材的 <code>Index</code> 程序' +
      '对输入文件建表，跑出来的结果（教材示例）像这样：<br>' +
      '<code>continue 12</code><br><code>enqueue 15</code><br>' +
      '<code>Integer 4 5 7 8 14</code><br><code>parseInt 4 5</code><br><code>println 22</code><br>' +
      '左边是单词，右边是它出现的所有行号。<b>"Integer 出现在第 4、5、7、8、14 行"</b>——' +
      '这就是"按内容找位置"，而普通符号表只能"按位置找内容"。' +
      '搜索引擎的索引结构、日志系统的按关键词检索、代码编辑器里的"查找引用"，底层都是这张表。' +
      '实现时值那一栏常用队列或列表（还记得第 17 章的队列吗？就是这里用的）。'
    },

    { t: 'h', text: '九、该选哪个：一张决策表', id: 'ch18-9' },

    { t: 'p', html:
      '真实工程里极少"从头实现一个符号表"，但选择用哪种结构、给多少初始容量、要不要保序，' +
      '仍然由你的操作组合决定。下面这张表可以直接拿去对照。'
    },

    { t: 'table',
      head: ['你的情况', '选择', '为什么'],
      rows: [
        ['数据量几十条、几乎不改', '无序数组 + 顺序查找', '代码最短，没有额外开销'],
        ['建表后只读、查询极多', '有序数组 + 二分查找', '建表一次 O(n log n)，之后每次 O(log n)'],
        ['通用键值查询、缓存、去重', '哈希表', '平均 O(1)，Java 的 HashMap 就是这个'],
        ['需要按序输出所有键', '哈希表不够，要 BST / 平衡树', '哈希表无序，遍历顺序不可控'],
        ['需要"比 k 大的最小键"这类范围查询', 'BST / 平衡树', '树的有序性支持范围与前后驱查询'],
        ['键是 0..M-1 的小整数', '直接数组索引', '比任何哈希都简单且最快'],
        ['并发读多写少', '不可变 + 哈希表 + 写时复制', '避免锁竞争，读侧完全无锁']
      ],
      caption: '先问"我要做什么操作"，再问"数据规模多大"，最后才是实现' },

    { t: 'p', html: '把同一批键分别插进 BST 和哈希桶，比较查找时的比较次数：结构不同，代价曲线也不同。' },
    { t: 'lab', id: 'symboltable' },

    { t: 'keypoint', items: [
      { title: '符号表 = 键 → 值', html: '接口只有 put/get/delete/contains/size/keys；键唯一、键不可变、键不能为 null。' },
      { title: '顺序查找', html: '无序数组逐个比较，查找 O(n)、插入 O(1)；数据量小时够用，是最容易手写的版本。' },
      { title: '二分查找', html: '有序数组每次比较中间元素、排除一半，查找 O(log n)；代价是插入要移位 O(n)。' },
      { title: '哈希表', html: '哈希函数把键变成桶下标，查找 O(1) 平均；桶数要约为元素数的两倍，扩容时重新哈希。' },
      { title: '哈希冲突', html: '键多桶少必然撞车；分离链接每个桶挂一条链，链长决定最坏代价，Java 中长链会转红黑树。' },
      { title: '二叉查找树', html: '左小右大，中序遍历有序，查找 O(log n) 平均；插入顺序不巧会退化成链表，最坏 O(n)。' },
      { title: '性能对比', html: '无序数组 O(n)/O(1)、有序数组 O(log n)/O(n)、哈希 O(1)/O(1)、BST O(log n)/O(log n) 平均。' },
      { title: '选型判据', html: '先看要什么操作（有序遍历？范围查询？），再看规模与写频率；通用键值查询首选哈希表。' }
    ] },

    { t: 'quiz', qid: 'ch18-q4' },
    { t: 'quiz', qid: 'ch18-q5' },
    { t: 'quiz', qid: 'ch18-q6' },

    { t: 'checklist', id: 'ch18', items: [
      '我能说清符号表要解决什么问题，并写出它的五个基本操作',
      '我能用无序数组实现顺序查找，并说出它的最坏代价',
      '我能解释二分查找为什么是 O(log n)，以及它要求数组有序',
      '我能写一个字符串哈希函数，并说明为什么要对桶数取模',
      '我能说清哈希冲突为什么不可避免，以及分离链接怎么处理它',
      '我能实现二叉查找树的中序遍历，并解释为什么输出是有序的',
      '我能说出 BST 在什么情况下会退化成链表',
      '我能对着四条路线的表格，解释每个复杂度是怎么来的',
      '我能根据「有序输出 / 范围查询 / 通用键值 / 小整数键」选出合适结构'
    ] },

    { t: 'p', html:
      '<b>延伸阅读</b>：Sedgewick《Computer Science: An Interdisciplinary Approach》§4.4（Symbol Tables），' +
      '按"字典查找 → 倒排索引 → 哈希表 → 二叉查找树 → 去重过滤"组织，本章顺序与它基本一致；' +
      '站内第 13 章「复杂度分析与 Big-O」解释了本章所有复杂度符号，第 17 章「栈与队列」的链表与数组' +
      '正是本章两种实现的底层。想动手可以到实验台试试哈希与查找的小实验，或在题库里按 ch18 筛选。'
    },

    { t: 'h', text: '下一站：图与小世界现象', id: 'ch18-next' },

    { t: 'p', html:
      '到这里，我们已经能用表把"键"和"值"连起来。但现实中的关系往往不是一对一，而是<b>多对多</b>：' +
      '朋友的朋友、论文的引用、网页的链接、地铁的换乘。把关系表示成"点 + 边"，就是<b>图</b>；' +
      '第 19 章会用图回答一个问题：为什么社交网络里"六度分隔"常常只有三四步？' +
      '你会看到，第 17 章的队列在 BFS 里扮演核心角色，而本章的符号表把"点"映射到"距离"。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '哈希表与 BST 是最容易被 AI "糊弄"的两块：① 让 AI 写一个"只用数组、不用 HashMap"的符号表，' +
      '看它是否真的维护了链；② 问它"为什么 Java 8 之后链表超过 8 个节点要转红黑树"，' +
      '答不出"最坏 O(n) → O(log n)"就是背的；③ 给它一段用哈希表遍历顺序做假设的代码，' +
      '问它哪里会出错——哈希表无序是常见 bug 来源。反过来练：拿一个真实需求（如"统计词频并输出前 10 名"），' +
      '先自己选结构（哈希 + 排序，还是 BST），再让 AI 对比你的方案。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：键值映射与符号表 API、顺序查找、有序数组与二分查找、哈希函数、分离链接冲突处理、' +
      '二叉查找树与中序遍历、四条路线性能对比、词典查找与倒排索引、选型判据。<br>' +
      '依据：Sedgewick《Computer Science: An Interdisciplinary Approach》§4.4（Symbol Tables）；' +
      'Course Outline v5 中数据结构部分的符号表。本站为个人整理的学习材料，' +
      '与课程要求冲突时以老师和课程大纲为准；除标注「教材库」的程序外，所有示例输出均在本站 Java 引擎里实跑核对。'
    }
  ]
});
