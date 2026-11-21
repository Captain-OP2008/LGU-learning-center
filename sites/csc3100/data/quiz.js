/* =====================================================================
 * sites/csc3100/data/quiz.js · 数据结构（CSC3100）分章题库
 * 结构：{ items:[{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options?, answer?, accept?, explain }] }
 * 题型：mcq / tf / fill / multi
 * 目标：每章 7 题，全站 56 题
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '数据结构这门课真正在解决的问题是什么？',
        options: [
          { text: '把常用的算法代码背下来，期末直接默写' },
          { text: '在同一批数据上，为不同的操作组合选择代价合适的组织方式', correct: true },
          { text: '证明某些问题绝对不可能被任何程序解决' },
          { text: '研究如何把 Java 代码写得更短' }
        ],
        explain: '同一批数据，如果要频繁按下标取元素，数组最好；如果要频繁在中间插入，链表更好；如果要 O(1) 查存，哈希表最好。数据结构研究的就是「操作组合 → 组织方式 → 代价」这层对应关系。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '本站把堆与哈希表都放在第 06 章，因为哈希表是堆的一种特例。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '两者放在同一章是因为都属于「放弃全序换速度」的结构，但机制完全不同：堆用完全二叉树维护偏序，哈希表用哈希函数把键算成地址。哈希表不是堆的特例。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '本站把八章内容归为三条主线，下面哪些属于这三条主线？（多选）',
        options: [
          { text: '存储：数据怎么摆进内存', correct: true },
          { text: '查找：怎么快速定位一个元素', correct: true },
          { text: '连接：元素之间怎么建立关系', correct: true },
          { text: '渲染：怎么把结果画到屏幕上' },
          { text: '编译：怎么把源码变成字节码' }
        ],
        explain: '存储对应数组、链表、哈希表；查找对应 BST、平衡树、堆；连接对应图与树。渲染与编译是别的课程的主题，本站只在例子中顺带提到。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '为什么这门课选 Java 而不是 C 来讲数据结构？',
        options: [
          { text: '因为 Java 的运行速度比 C 快' },
          { text: '因为 Java 的引用语义清晰、没有指针算术，且标准库提供了可直接对照的现成实现', correct: true },
          { text: '因为 Java 不需要考虑内存，所以不用讲复杂度' },
          { text: '因为 Java 的数组会自动排序' }
        ],
        explain: 'Java 用引用代替指针算术，省掉了手动 malloc/free 与越界踩内存的干扰；同时 ArrayList、LinkedList、PriorityQueue、HashMap、TreeMap 正好是各章的工业实现，可以边学边对照。Java 并不比 C 快，也不会自动排序。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['complexity'],
        stem: '描述运行时间的渐进上界、忽略常数与低阶项时，最常用的记号是 ____ 记号。',
        answer: 'O',
        accept: ['大O', '大 O', 'Big-O', 'Big O', 'big-o'],
        explain: 'O 记号给出上界（最坏不超过某个量级），Ω 给下界，Θ 给紧确界。日常说「这个算法是 O(n log n)」严格讲是上界陈述，但约定俗成表示量级。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'mcq', difficulty: 1,
        tags: ['method'],
        stem: '本站推荐的「四步学习法」中，第三步做什么？',
        options: [
          { text: '先看视频，把正文留到考前' },
          { text: '合上正文，自己复述本节结论并做一道题，再回去对答案', correct: true },
          { text: '把每章的关键词抄成一张表' },
          { text: '直接做项目，遇到问题再回头读正文' }
        ],
        explain: '四步是：看图建立直觉 → 精读正文 → 合上正文自检（主动回忆）→ 做项目把知识用出去。主动回忆比反复重读有效得多，因为它在逼你从零重建推理链。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 3, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '关于本站的资料与考核，下面哪些说法是正确的？（多选）',
        options: [
          { text: '讲义 PDF 放在「学习资料」目录，按 Lecture 编号排列', correct: true },
          { text: '历年期中期末真题放在「考试资料」目录', correct: true },
          { text: '作业说明、样例代码与 Tutorial 材料放在「作业习题」目录', correct: true },
          { text: '本站正文可以完全替代官方讲义，考试范围以本站为准' },
          { text: '资源页的文件都需要自己另外去别处下载' }
        ],
        explain: '本站的资源页直接指向课程目录里已归档的真实文件，三组分别对应学习资料、作业习题、考试资料。但正文是学习辅助，考试范围与评分标准始终以课程官方通知为准。'
      },

      /* ---------------- ch01 复杂度、数组与 ADT ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['complexity'],
        stem: '为什么不能用「跑一次计时」来比较两个算法？',
        options: [
          { text: '因为计时器精度不够，测不出差别' },
          { text: '因为耗时受机器、语言、编译器与输入规模影响，无法跨环境比较', correct: true },
          { text: '因为算法运行时间与输入无关' },
          { text: '因为计时只能测空间，不能测时间' }
        ],
        explain: '同一段代码在不同 CPU、不同 JVM、不同输入规模下耗时能差十倍以上。复杂度把时间抽象成「基本操作执行次数的增长量级」，才是可跨环境比较的量。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'tf', difficulty: 2,
        tags: ['complexity'],
        stem: '若 T(n) = 3n² + 5n + 7，则 T(n) = O(n²) 成立，写成 O(n³) 也成立，但 Θ(n²) 才是紧确界。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'O 是上界，n² 与 n³ 都是合法上界；Θ 要求上下界同阶，只有 n² 满足。这也说明「O(n²)」不等于「恰好 n²」，但工程上说 O(n²) 通常意在指紧确界。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'multi', difficulty: 2,
        tags: ['array'],
        stem: '数组能按下标 O(1) 随机访问，依赖哪些前提？（多选）',
        options: [
          { text: '元素在内存中连续存放', correct: true },
          { text: '每个元素占用相同字节数（或可通过偏移表换算）', correct: true },
          { text: '地址由「首地址 + 下标 × 元素大小」算出', correct: true },
          { text: '数组内部的元素必须已经排好序' },
          { text: '数组长度必须是 2 的幂' }
        ],
        explain: '随机访问是地址算术的结果，与是否有序、长度是否 2 的幂都无关。有序只影响二分查找能不能用；长度是 2 的幂只在哈希取模等技巧里有用。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['amortized'],
        stem: '动态数组每次扩容翻倍，为什么单次 push 的摊还复杂度是 O(1)？',
        options: [
          { text: '因为扩容很少发生，可以直接忽略' },
          { text: '因为从容量 1 扩到 n 的总搬移量小于 2n，摊到每次 push 上是常数', correct: true },
          { text: '因为扩容时不需要搬移元素' },
          { text: '因为 Java 的数组扩容是硬件指令' }
        ],
        explain: '搬移总量是 1 + 2 + 4 + … + n < 2n，平均到 n 次 push 上就是 O(1)。这是摊还分析（记账法）的经典例子：把偶发的高代价摊到整体序列上，而不是看单次最坏。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['adt'],
        stem: '抽象数据类型（ADT）把「接口/契约」与「____」分开，使同一个接口可以有多套实现。',
        answer: '实现',
        accept: ['具体实现', '实现细节', '底层实现'],
        explain: '比如 List 只承诺「有序、可按下标访问、可增删」，ArrayList 与 LinkedList 是两套实现，代价结构完全不同。先定接口再选实现，是数据结构设计的标准顺序。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['complexity'],
        stem: '在长度为 n 的数组里顺序查找一个元素，若查找成功且目标等概率出现在任一位置，平均比较次数最接近？',
        options: [
          { text: 'n' },
          { text: '(n + 1) / 2', correct: true },
          { text: 'log₂ n' },
          { text: '1' }
        ],
        explain: '目标在下标 i 时需要比较 i+1 次，等概率平均得 (1 + 2 + … + n)/n = (n+1)/2。最坏是 n（找不到或在末尾），最好与平均都要分开说明，这是三者的标准口径。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 3, type: 'multi', difficulty: 2,
        tags: ['complexity'],
        stem: '分析一段代码的复杂度时，下面哪些步骤是必要的？（多选）',
        options: [
          { text: '找出执行次数最多的基本操作', correct: true },
          { text: '数清每层循环的执行次数，嵌套则相乘', correct: true },
          { text: '保留最高阶项、丢掉常数与低阶项', correct: true },
          { text: '把每行代码的实际毫秒数加起来' },
          { text: '先假设所有循环都执行 n 次' }
        ],
        explain: '复杂度看的是增长量级，不是毫秒数。先定基本操作、再数次数、最后化简，三步缺一不可；直接假设所有循环都是 n 次会在「内层依赖外层」或提前 break 时算错。'
      },

      /* ---------------- ch02 链表、栈与队列 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['list'],
        stem: '「链表插入删除是 O(1)」这句话缺了什么前提？',
        options: [
          { text: '必须已经定位到待操作位置的前驱节点', correct: true },
          { text: '链表必须是有序的' },
          { text: '节点必须分配在连续内存里' },
          { text: '链表长度必须是 2 的幂' }
        ],
        explain: '改引用本身是 O(1)，但「找到那个位置」要沿链表走，是 O(n)。所以准确说法是：已知前驱时插入删除 O(1)，按下标或按值定位 O(n)。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'tf', difficulty: 2,
        tags: ['list'],
        stem: '用快慢指针判断链表是否有环时，相遇判断应该比较两个节点的值是否相等。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '必须比较引用（节点对象本身）。环里完全可能存在两个值相同的节点，用值比较会误判成相遇；引用相等才说明两个指针真的指向同一个节点。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'multi', difficulty: 2,
        tags: ['stack'],
        stem: '下面哪些场景适合用栈来解决？（多选）',
        options: [
          { text: '括号匹配与标签闭合检查', correct: true },
          { text: '编辑器的撤销与浏览器的后退', correct: true },
          { text: '后缀表达式求值与中缀转后缀', correct: true },
          { text: '打印任务按先来先服务排队' },
          { text: '无权图的最短步数计算' }
        ],
        explain: '栈管「最近发生的先处理」：配对、回溯撤销、表达式的优先级嵌套。打印排队与 BFS 都是先进先出，属于队列；BFS 更是第 07 章的标准用法。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['list'],
        stem: '哨兵节点（dummy head）最主要的作用是什么？',
        options: [
          { text: '加快链表的遍历速度' },
          { text: '消除「操作头节点」的特殊判断，让插入删除的代码统一', correct: true },
          { text: '让链表支持随机访问' },
          { text: '节省一个节点的内存' }
        ],
        explain: '有了哨兵，头节点也有前驱，所有插入删除都能写成同一种形式，减少出错面。它多用一个节点、不改变渐近复杂度，也不提供随机访问能力。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'fill', difficulty: 2,
        tags: ['queue'],
        stem: '循环数组实现队列时，为了区分「空」与「满」，除了故意留一个空位，还可以额外维护一个 ____ 字段。',
        answer: 'size',
        accept: ['元素个数', '长度', 'count', '计数器'],
        explain: '只靠 head == tail 无法区分空和满（两种情况条件相同）。多存 size 最清晰；留一个空位则是把判满条件改成 (tail + 1) % cap == head，代价是浪费一个槽位。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-7', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['queue'],
        stem: '用两个栈实现队列，为什么出队的摊还复杂度是 O(1)？',
        options: [
          { text: '因为每次出队都恰好倒一个元素' },
          { text: '因为每个元素在整个生命周期里最多被倒入 out 栈一次', correct: true },
          { text: '因为栈的 push 和 pop 都是 O(1)，所以总和也是 O(1)' },
          { text: '因为队列的元素总数是常数' }
        ],
        explain: '单次出队最坏 O(n)（要把 in 全倒过去），但倒完之后元素就留在 out 里，每个元素只被搬一次。n 次操作总额外代价 O(n)，摊还即 O(1)。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-2', tier: 3, type: 'multi', difficulty: 2,
        tags: ['list'],
        stem: '与单链表相比，双链表有哪些真实优势？（多选）',
        options: [
          { text: '已知当前节点时，删除它可以做到 O(1)', correct: true },
          { text: '支持从尾向头的反向遍历', correct: true },
          { text: '支持 O(1) 的随机访问' },
          { text: '每个节点的内存占用更小' },
          { text: '插入时需要修改的引用更少' }
        ],
        explain: '双链表多了 prev 引用，换来 O(1) 删除当前节点与反向遍历；代价是每个节点多一个字段、插入删除要改四个引用。随机访问仍是 O(n)，链表天生不支持。'
      },

      /* ---------------- ch03 排序 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['proof'],
        stem: '「比较排序至少需要 Ω(n log n) 次比较」这个结论依赖的关键前提是什么？',
        options: [
          { text: '算法只能通过比较两个元素的大小来获取信息', correct: true },
          { text: '被排序的元素必须是整数' },
          { text: '算法必须是递归实现的' },
          { text: '数组长度必须是 2 的幂' }
        ],
        explain: '决策树的论证把每次比较看成一个二叉分支，n! 种输入排列要求至少 n! 个叶子，于是高度 ≥ log₂(n!) = Θ(n log n)。计数排序打破的正是这个前提——它直接拿值当下标，不做比较。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'tf', difficulty: 2,
        tags: ['sorting'],
        stem: '快排固定取末尾元素当枢轴时，对已经排好序的数组会退化成 O(n²)。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '每次都取到当前区间的最大（或最小）值，划分成 0 与 n−1 两段，递归深度 n、总代价 O(n²)。随机化枢轴或三数取中能避免这个最坏情况恰好落在最常见输入上。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'multi', difficulty: 2,
        tags: ['sorting'],
        stem: '下列排序算法中，哪些是稳定的？（多选）',
        options: [
          { text: '插入排序', correct: true },
          { text: '归并排序', correct: true },
          { text: '冒泡排序', correct: true },
          { text: '快速排序' },
          { text: '选择排序' }
        ],
        explain: '插入（严格大于才移动）、归并（相等取左边）、冒泡（相等不交换）都稳定；快排的划分有长距离交换、选择排序的交换会把元素甩到远处，两者都不稳定。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['sorting'],
        stem: '插入排序在某个数组上的元素移动次数，正好等于什么？',
        options: [
          { text: '数组的长度' },
          { text: '数组的逆序对数', correct: true },
          { text: '不同元素的个数' },
          { text: '最大元素与最小元素之差' }
        ],
        explain: '每个逆序对 (i, j) 都会在 i 往前找位置时被跨越一次，对应一次右移。所以运行时间是 O(n + I)，I 为逆序对数——这同时解释了为什么近乎有序时接近 O(n)。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['sorting'],
        stem: '归并排序合并两段时，写成 a[i] <= a[j] 优先取左边，是为了保证排序的 ____ 性。',
        answer: '稳定',
        accept: ['稳定性', 'stability', 'stable'],
        explain: '取等时优先左边，相等元素就保持原来的相对次序。若改成严格小于，右边相等元素会先被取出，稳定性当场丢失——判稳往往就藏在这一个符号里。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['sorting'],
        stem: '计数排序为什么能突破 Ω(n log n) 的下界？',
        options: [
          { text: '因为它使用了多线程' },
          { text: '因为它不做元素比较，直接用值当下标去计数', correct: true },
          { text: '因为它的常数比其他排序小' },
          { text: '因为它只排已经有序的数组' }
        ],
        explain: '下界只约束「基于比较」的算法。计数排序把值映射到计数数组下标，代价是 O(n + k)，前提是元素为整数且取值范围 k 不大。它并没有变快，而是换了信息获取方式。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-7', tier: 3, type: 'multi', difficulty: 3,
        tags: ['sorting'],
        stem: '关于 Java 的 Arrays.sort，下面哪些说法正确？（多选）',
        options: [
          { text: '对基本类型数组使用双轴快排，不稳定', correct: true },
          { text: '对对象数组使用 TimSort，稳定', correct: true },
          { text: '对象数组必须稳定，因为相等对象可能是不同实例、次序可被观察', correct: true },
          { text: '两者都使用同一种算法，只是参数不同' },
          { text: '基本类型用归并排序，因为归并更快' }
        ],
        explain: '基本类型没有身份，打乱相等元素的次序无人察觉，所以可以用更快更省的快排；对象有身份，Java 规范承诺稳定排序，故选 TimSort（归并 + 插入的混合）。'
      },

      /* ---------------- ch04 树与 BST ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['bst'],
        stem: 'BST 删除一个有两个孩子的节点，标准做法是什么？',
        options: [
          { text: '直接把它置为 null，再重新插入它的两个孩子' },
          { text: '用右子树的最小节点（中序后继）的键替换它，再删除那个后继', correct: true },
          { text: '把整棵树重建一遍' },
          { text: '用它的左孩子直接顶替它' }
        ],
        explain: '后继是「比它大的最小键」，替换后左小右大的关系仍然成立。后继一定没有左孩子，所以第二次删除必然落到「0 或 1 个孩子」的简单情况，不会无限递归。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'tf', difficulty: 2,
        tags: ['tree'],
        stem: '已知一棵二叉树的前序序列与后序序列，就能唯一确定这棵树。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '前序和后序都只给出「根在哪」，无法区分「只有一个孩子时它是左还是右」。必须有中序提供左右分界才能唯一重建；只有满二叉树（每节点 0 或 2 个孩子）是例外。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'multi', difficulty: 2,
        tags: ['tree'],
        stem: '下列任务中，哪些天然适合用后序遍历？（多选）',
        options: [
          { text: '释放整棵树的内存', correct: true },
          { text: '求每个节点为根的子树高度', correct: true },
          { text: '判断整棵树是否平衡', correct: true },
          { text: '把树序列化成「根、左、右」的字符串' },
          { text: '按从小到大输出 BST 的所有键' }
        ],
        explain: '后序是「先处理孩子、再处理自己」，所以释放、求高度、求子树聚合值都要用它。序列化与复制要「先有根才能建子节点」，用前序；BST 的升序输出用中序。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-1', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['tree'],
        stem: '关于节点的「深度」与「高度」，下面哪个说法正确？',
        options: [
          { text: '两者是同一个概念，只是叫法不同' },
          { text: '深度从根往下数，高度从该节点往下到最远叶子数，方向相反', correct: true },
          { text: '深度从叶子往上数，高度从根往下数' },
          { text: '高度一定大于深度' }
        ],
        explain: '根深度为 0，叶子高度为 0；树高 = 根的高度。对同一节点两者一般不等，只有整棵树上下对称时才相等（比如单节点树两者都是 0）。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'fill', difficulty: 1,
        tags: ['bst'],
        stem: '对一棵二叉搜索树做中序遍历，得到的键序列是 ____ 的。',
        answer: '递增',
        accept: ['升序', '有序', '从小到大', '严格递增', '单调递增'],
        explain: '中序是「左-根-右」，而 BST 保证左子树全部键更小、右子树全部键更大，所以输出天然递增。这条性质既是排序输出的手段，也是验证 BST 的判据。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['bst'],
        stem: '把 1, 2, 3, …, n 依次插入一棵空的 BST，树高与单次查找代价分别是什么？',
        options: [
          { text: '高度 log₂n，查找 O(log n)' },
          { text: '高度 n−1，查找 O(n)', correct: true },
          { text: '高度 n/2，查找 O(n log n)' },
          { text: '高度 1，查找 O(1)' }
        ],
        explain: '每个新键都比之前所有键大，只能一路往右挂，树退化成一条右斜链：高度 n−1，查找、插入、删除全部 O(n)。这正是需要平衡树的直接原因。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 3, type: 'multi', difficulty: 3,
        tags: ['tree'],
        stem: '关于表达式树，下面哪些说法正确？（多选）',
        options: [
          { text: '后序遍历得到逆波兰（后缀）表达式', correct: true },
          { text: '前序遍历得到波兰（前缀）表达式', correct: true },
          { text: '中序遍历并补上必要的括号可还原原始中缀表达式', correct: true },
          { text: '后序遍历可以直接得到中缀表达式，无需括号' },
          { text: '表达式树的叶子节点是运算符' }
        ],
        explain: '叶子是操作数、内部节点是运算符。三种遍历分别对应后缀、前缀、中缀；中缀会丢失优先级信息，必须补括号。用栈对后缀表达式求值正是后序的用途。'
      },

      /* ---------------- ch05 平衡树 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['avl'],
        stem: 'AVL 插入后某节点平衡因子为 +2，且其左孩子的平衡因子为 −1，该做哪种旋转？',
        options: [
          { text: '对根做一次右旋（LL）' },
          { text: '对根做一次左旋（RR）' },
          { text: '先对左孩子左旋、再对根右旋（LR）', correct: true },
          { text: '先对根右旋、再对左孩子左旋（RL）' }
        ],
        explain: 'BF 为 +2 说明左子树过高，左孩子 BF 为负说明孙子拐在右边——这是 LR 形态。先对左孩子左旋把 LR 掰成 LL，再对根右旋，两次旋转完成修复。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'tf', difficulty: 3,
        tags: ['avl'],
        stem: 'AVL 树删除一个节点后，最多只需要一次旋转就能恢复平衡。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '删除会让子树高度降低，修复一处后祖先可能再次失衡，所以要一路修到根，最坏 O(log n) 次旋转。插入才是「最多一次修复」，因为旋转把高度降回原值，祖先不再受影响。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'multi', difficulty: 2,
        tags: ['rbtree'],
        stem: '下列哪些是红黑树的合法性质？（多选）',
        options: [
          { text: '根节点是黑色', correct: true },
          { text: '每个叶子（NIL）是黑色', correct: true },
          { text: '红节点的两个孩子都是黑色', correct: true },
          { text: '任一节点到其后代 NIL 的所有路径包含相同数目的黑节点', correct: true },
          { text: '红黑节点必须严格交替出现' }
        ],
        explain: '五条性质里没有「交替」这一条：只禁止连续红节点，允许连续黑节点，否则黑高无法保持。性质 4（不红红）与性质 5（黑高相等）共同推出高度 ≤ 2log₂(n+1)。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-1', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['tree'],
        stem: '一次旋转改变了树的结构，但保持不变的是什么？',
        options: [
          { text: '每个节点的深度' },
          { text: '中序遍历得到的序列', correct: true },
          { text: '树的高度' },
          { text: '每个节点的左右子树大小' }
        ],
        explain: '旋转只是把「y 的左链」重新挂了一下，元素的相对次序没变，所以中序序列完全相同，BST 不变式不被破坏。改变的正是深度、子树大小与局部高度。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'fill', difficulty: 1,
        tags: ['avl'],
        stem: 'AVL 树每个节点的平衡因子（左高减右高）合法取值是 −1、0 与 ____。',
        answer: '+1',
        accept: ['1', '＋1', '正一', '一'],
        explain: '平衡因子绝对值不超过 1，所以只有 −1、0、+1 三种。一旦出现 ±2 就说明该子树失衡，必须旋转修复；这是 AVL 唯一的结构约束。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['rbtree'],
        stem: '红黑树插入后出现「红红相连」，且叔叔节点是红色，应该怎么处理？',
        options: [
          { text: '直接对祖父做一次左旋' },
          { text: '把父与叔染黑、祖父染红，再把祖父当作新的当前节点继续上溯', correct: true },
          { text: '把新节点染黑，插入结束' },
          { text: '删除新节点，重新插入到别的位置' }
        ],
        explain: '这是情况 1（叔红）：变色即可消除当前的红红，但祖父由黑变红后可能与它的父节点形成新的红红，所以要上溯。整个过程只变色、不旋转，最坏 O(log n)。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 3, type: 'multi', difficulty: 3,
        tags: ['tree'],
        stem: '关于平衡结构的选型，下面哪些判断是正确的？（多选）',
        options: [
          { text: '读远多于写、要求查找最快时优先 AVL', correct: true },
          { text: '读写混合、写操作较多时优先红黑树', correct: true },
          { text: '数据在磁盘上、需要一次 I/O 读多个键时用 B+ 树', correct: true },
          { text: '只需要 O(1) 查存、不需要有序遍历时应该用哈希表而不是任何树' },
          { text: 'AVL 的查找比红黑树慢，所以工程上一律用红黑树' }
        ],
        explain: 'AVL 高度上界 1.44log n 更紧、查找更快，但删除可能多次旋转；红黑树高度上界 2log n、旋转次数少。磁盘要减少 I/O 层数故选 B+ 树；只要查存就用哈希，别用 O(log n) 的结构。'
      },

      /* ---------------- ch06 堆、优先队列与哈希 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['heap'],
        stem: '自底向上建堆为什么是 O(n) 而不是 O(n log n)？',
        options: [
          { text: '因为每个节点都只下沉一层' },
          { text: '因为按高度分组求和后，节点数随高度指数减少而层数线性增加，级数收敛到常数倍 n', correct: true },
          { text: '因为建堆不需要比较元素' },
          { text: '因为数组本来就有序' }
        ],
        explain: '高度 h 的节点约 n/2^(h+1) 个、每个最多沉 h 层，Σ h/2^(h+1) 收敛到 1。直白说：底层节点最多但沉不下去，能沉满 log n 层的只有根一个。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'tf', difficulty: 2,
        tags: ['heap'],
        stem: '下沉（sift-down）时，只要孩子中存在比当前节点大的，就可以任选一个交换。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '必须选两个孩子中更大的那个交换。随便挑可能换上来一个更小的节点，堆序立刻被破坏，而且后续无法靠继续下沉修复。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'multi', difficulty: 2,
        tags: ['heap'],
        stem: '下面哪些问题适合用堆来解决？（多选）',
        options: [
          { text: '从 n 个数里取最大的 k 个（Top-K）', correct: true },
          { text: '实现按优先级取任务的调度器', correct: true },
          { text: '数据流中动态维护中位数（双堆）', correct: true },
          { text: '查询某个区间内所有键（范围查询）' },
          { text: '按从小到大输出全部元素' }
        ],
        explain: '堆只保证「根是最值」，适合取最值、Top-K、优先队列与双堆中位数。范围查询与全量有序输出需要 BST 或排序，堆查任意元素是 O(n)。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-1', tier: 2, type: 'mcq', difficulty: 1,
        tags: ['heap'],
        stem: '用数组存完全二叉树时，下标 i 的节点的父节点下标是什么？',
        options: [
          { text: 'i / 2' },
          { text: '(i − 1) / 2', correct: true },
          { text: '2i + 1' },
          { text: 'i − 1' }
        ],
        explain: '左孩子 2i+1、右孩子 2i+2，反解即得父节点 (i−1)/2（整数除法向下取整）。i=0 时算出 0 或负数，所以根没有父节点，循环要以 i>0 为条件。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'fill', difficulty: 2,
        tags: ['hash'],
        stem: '哈希表的负载因子 α 定义为「元素个数」除以 ____。',
        answer: '桶数',
        accept: ['槽位数', '表长', '桶的个数', '容量', '数组长度'],
        explain: 'α = n / m，m 是桶（槽位）数。链地址法查找期望 O(1+α)，开放寻址约 1/(1−α)，所以 α 超过阈值（如 0.75）就要扩容重哈希。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-7', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['hash'],
        stem: '开放寻址法删除元素时，为什么不能直接把槽位置空？',
        options: [
          { text: '因为置空会浪费内存' },
          { text: '因为会切断后续元素的探测链，导致本来存在的键查不到', correct: true },
          { text: '因为数组不支持置空操作' },
          { text: '因为置空会改变哈希函数的结果' }
        ],
        explain: '查找遇到空格就判定「不存在」。如果把中间的槽位置空，后面的元素就变成「不可达」。所以要放墓碑标记「已删除」，查找时跳过墓碑、遇到真空格才停。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-8', tier: 3, type: 'multi', difficulty: 3,
        tags: ['hash'],
        stem: '关于 Java 的 HashMap，下面哪些说法正确？（多选）',
        options: [
          { text: '默认初始容量 16、默认负载因子 0.75', correct: true },
          { text: '扩容时容量翻倍，保证长度是 2 的幂以便用位与代替取模', correct: true },
          { text: '单个桶的链表长度达到 8 且表容量 ≥ 64 时，链表转成红黑树', correct: true },
          { text: '树化是为了让遍历顺序变成有序' },
          { text: 'HashMap 允许用 null 作为键，并且 null 的哈希值定义为 1' }
        ],
        explain: '树化的目的是防御哈希碰撞攻击，把单桶最坏 O(n) 降到 O(log n)，不是为了有序（HashMap 从不保证顺序）。容量不足 64 时优先扩容而非树化。null 键的哈希被特殊处理为 0。'
      },

      /* ---------------- ch07 图 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['graph'],
        stem: '写 BFS 时，visited 标记应该在什么时刻设置？',
        options: [
          { text: '出队时' },
          { text: '入队时', correct: true },
          { text: '枚举邻居之前' },
          { text: '整个 BFS 结束后统一设置' }
        ],
        explain: '必须在入队时就标记，否则同一个点会被多个邻居重复入队，队列膨胀甚至超时。出队时再标记只是「不会重复处理」，但已经造成了重复入队。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'tf', difficulty: 2,
        tags: ['graph'],
        stem: 'Dijkstra 算法可以处理带负权边的图，只是会比非负权时慢一些。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '不是慢，是错。Dijkstra 的正确性依赖「已确定的最小距离不可能再被改小」，负权边会让绕路反而更短，贪心当场失效。有负权必须换 Bellman-Ford。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-8', tier: 2, type: 'multi', difficulty: 2,
        tags: ['graph'],
        stem: '关于连通无向图的最小生成树（MST），下面哪些说法正确？（多选）',
        options: [
          { text: '恰好包含 n−1 条边', correct: true },
          { text: '不包含任何环', correct: true },
          { text: '所有边的权重之和最小', correct: true },
          { text: 'MST 一定唯一，与边权是否重复无关' },
          { text: 'MST 就是任意两点间的最短路径之并' }
        ],
        explain: 'n−1 条边 + 无环 = 生成树，权重和最小即最小生成树。边权有重复时 MST 可能不唯一，但总权重相同。MST 与最短路是不同问题，两者答案通常不同。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-1', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['graph'],
        stem: '一个 n 个点、m 条边的稀疏图（m ≈ n），用哪种表示最省空间且遍历邻居高效？',
        options: [
          { text: '邻接矩阵，O(n²) 空间' },
          { text: '邻接表，O(n + m) 空间，枚举邻居 O(deg)', correct: true },
          { text: '边集数组，查邻居 O(m)' },
          { text: '完全二叉树' }
        ],
        explain: '矩阵在稀疏图上会浪费 O(n²) 的空间且枚举邻居要扫整行。邻接表空间 O(n+m)、枚举邻居只走实际存在的边，是稀疏图的默认选择；边集数组适合 Kruskal 这类按边处理的算法。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['graph'],
        stem: 'Kruskal 算法里，若 union(u, v) 返回 false，说明 u 与 v 已连通，加入这条边会 ____。',
        answer: '成环',
        accept: ['形成环', '产生环', '构成环', '出现环', '有环'],
        explain: '并查集只维护连通性，两点的代表元相同就说明已有路径相连，再加这条边必然闭合出一个环，而生成树不允许有环，所以这条边要跳过。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-4', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['graph'],
        stem: '用 Kahn 算法做拓扑排序，若最终输出的顶点数少于 n，说明什么？',
        options: [
          { text: '图不连通' },
          { text: '图中存在有向环，拓扑序不存在', correct: true },
          { text: '图中有孤立点' },
          { text: '边的权重为负' }
        ],
        explain: '每轮只取出入度为 0 的点，环上的点入度永远降不到 0，因此不会被输出。输出数 < n 等价于有环——这就是 Kahn 顺便判环的原理。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-7', tier: 3, type: 'multi', difficulty: 3,
        tags: ['graph'],
        stem: '关于最短路算法，下面哪些说法正确？（多选）',
        options: [
          { text: 'Bellman-Ford 支持负权边，并能检测负环', correct: true },
          { text: 'Floyd-Warshall 求全源最短路，复杂度 O(V³)，k 必须在最外层', correct: true },
          { text: '无权图（或边权全相同）的最短路直接用 BFS，O(V+E)', correct: true },
          { text: 'Dijkstra 用优先队列后复杂度是 O((V+E) log V)', correct: true },
          { text: 'Floyd-Warshall 不支持负权边' }
        ],
        explain: 'Floyd 支持负权边（只要无负环，否则 d[i][i] 会变负）。Bellman-Ford 松弛 V−1 轮、第 V 轮仍能松弛即有负环；BFS 只在无权图给出跳数最短路。四个结论都对，只有最后一条错。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
