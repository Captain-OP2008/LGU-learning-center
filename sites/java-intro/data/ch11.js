/* =====================================================================
 * data/ch11.js · 第 11 章：算法：排序与查找
 * 职责：算法与实现、选择/插入/归并/快排（逐轮追踪）、稳定性、
 *       线性查找与二分查找（边界与比较次数）、调试实录、两个完整案例
 * 对外 API：CSC.registerChapter({...})（内容块 schema 见 _dev/CONTRACT.md §4–§5）
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch11',
  num: '11',
  title: '算法：排序与查找',
  en: 'Algorithms: Sorting & Searching',
  goals: [
    '能说清算法与实现的区别，并判断一段代码属于哪种排序',
    '能手写选择排序与插入排序，说出它们各自适合什么数据',
    '能解释归并与快排的分治思路，说明快排为什么会退化',
    '能在大致了解代价的前提下，选择线性查找或二分查找',
    '能识别二分查找的边界错误，并用逐轮追踪表调试排序/查找代码'
  ],
  kp: [
    { id: 'ch11-1', title: '算法与实现' },
    { id: 'ch11-2', title: '选择排序' },
    { id: 'ch11-3', title: '插入排序' },
    { id: 'ch11-4', title: '归并排序' },
    { id: 'ch11-5', title: '快速排序' },
    { id: 'ch11-6', title: '稳定性' },
    { id: 'ch11-7', title: '线性查找与二分查找' },
    { id: 'ch11-8', title: '排序与查找的调试与边界' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '同一组数据 <code>{5, 2, 9, 1, 6}</code>，交给两种排序算法，最后结果都是 <code>{1, 2, 5, 6, 9}</code>——' +
      '但中间过程完全不同：选择排序每一轮都把最小值"搬"到前面，插入排序每一轮只是把新元素"插"进已排好的部分。' +
      '更蹊跷的是二分查找：数组明明有序、目标明明在里面，代码却返回 -1，只因为循环条件少写了一个等号。<br>' +
      '这一章讲四件必须会的事：两种简单排序、两种分治排序、两种查找，以及——<b>为什么同样的目标会有不同的过程，' +
      '为什么边界差一个等号就全错</b>。',
    },

    { t: 'p', lead: true, html:
      '先运行下面这段程序：同一组数据，分别用选择排序和插入排序，逐轮打印数组。' +
      '把两种"中间状态"对比着看，你会立刻发现"排序"不是一种动作，而是一类策略。'
    },

    { t: 'code', caption: 'OpeningSort.java · 同一组数据，两种排序的逐轮过程', trace: true, code:
`import java.util.Arrays;

public class OpeningSort {
    static void selection(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            int min = i;
            for (int j = i + 1; j < a.length; j++) {
                if (a[j] < a[min]) min = j;
            }
            int t = a[i];
            a[i] = a[min];
            a[min] = t;
            System.out.println("  round " + (i + 1) + ": " + Arrays.toString(a));
        }
    }

    static void insertion(int[] a) {
        for (int i = 1; i < a.length; i++) {
            int key = a[i];
            int j = i - 1;
            while (j >= 0 && a[j] > key) {
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = key;
            System.out.println("  round " + i + ": " + Arrays.toString(a));
        }
    }

    public static void main(String[] args) {
        int[] data = {5, 2, 9, 1, 6};
        int[] a = Arrays.copyOf(data, data.length);
        int[] b = Arrays.copyOf(data, data.length);

        System.out.println("selection sort:");
        selection(a);
        System.out.println("insertion sort:");
        insertion(b);
        System.out.println("same result? " + Arrays.equals(a, b));
    }
}
` },

    { t: 'p', html:
      '看两个中间状态：选择排序第 1 轮结束时是 <code>[1, 2, 9, 5, 6]</code>——它把最小的 1 换到最前面，' +
      '但后面的 <code>9, 5, 6</code> 完全没动，仍是乱的；插入排序第 1 轮结束时是 <code>[2, 5, 9, 1, 6]</code>——' +
      '前 3 个元素 <code>2, 5, 9</code> 已经有序，后面还是原始顺序。<br>' +
      '这就是两种策略的本质区别：<b>选择排序维护"前面已就位"的前缀</b>（元素放对了最终位置），' +
      '<b>插入排序维护"前面已有序"的前缀</b>（但元素还可能被后面的插入挤动）。理解了这一点，' +
      '后面所有关于比较次数、稳定性、适应性的结论都能自己推出来。'
    },

    { t: 'p', html:
      '本章路线：算法与实现（一）→ 四种排序（二至五）→ 稳定性（六）→ 查找（七）→ 边界（八）→ 调试（九）→ 两个完整案例。'
    },

    { t: 'h', text: '一、算法与实现', id: 'ch11-1' },

    { t: 'p', html:
      '<b>算法（algorithm）</b>是解决问题的步骤清单：有限步、无歧义、能在有限时间结束。' +
      '<b>实现（implementation）</b>是用某种语言把算法写出来的代码。同一个算法可以用不同语言写，' +
      '同一个语言也可以有不同的实现细节（用 for 还是 while、用临时数组还是原地交换）。' +
      '考试问"这段代码属于哪种排序"时，看的是<b>策略</b>而不是写法：有"每轮找最小"的策略就是选择排序，' +
      '有"插入已排序前缀"的策略就是插入排序。'
    },

    { t: 'p', html:
      '评价算法不看它跑在哪台电脑上，也不看代码长短，而看<b>工作量怎么随输入规模 n 增长</b>。' +
      '所以本章反复数两样东西：<b>比较次数</b>和<b>交换/移动次数</b>。第 13 章会把"怎么增长"正式写成 Big-O，' +
      '现在你只要会数：n 个数排序，选择排序固定比较 n(n-1)/2 次，插入排序最好 n-1 次、最坏 n(n-1)/2 次。'
    },

    { t: 'p', html:
      '同一算法还可以有不同实现，代价不同。以二分查找为例：<b>迭代版</b>用一个 while 循环，额外空间 O(1)；' +
      '<b>递归版</b>代码更短，但每层调用压一个栈帧，额外空间 O(log n)。' +
      '两者比较次数几乎一样，差别在空间和常数——这也是为什么"算法"和"实现"要分开讨论。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 算法 vs 实现', html: '能说出"排序"是问题、"选择排序"是算法、"这段 Java 代码"是实现，三层不是一回事。' },
      { title: '检查点 · 数什么', html: '看到一段排序代码，能数出它最坏情况比较多少次。' }
    ] },

    { t: 'h', text: '二、选择排序：每轮挑出最小的', id: 'ch11-2' },

    { t: 'p', html:
      '人话版：每一轮从"还没排好的部分"里挑出最小的，放到已排好部分的末尾。' +
      '手里有 <code>[5, 2, 9, 1, 6]</code>，第一轮找到 1，把它和首位的 5 交换，得到 <code>[1, 2, 9, 5, 6]</code>；' +
      '第二轮在剩下的 <code>[2, 9, 5, 6]</code> 里找最小，2 已经在位，不动。' +
      '数组在逻辑上被分成两段：左边<b>已排序</b>（且元素都在最终位置），右边<b>未排序</b>。'
    },

    { t: 'svg', maxW: 760, caption: '选择排序的四轮。浅色格子是已排好的部分，每轮只在未排部分里找最小值。', html:
`<svg viewBox="0 0 780 420" role="img" aria-label="选择排序过程快照">
  <text x="20" y="30" font-size="13" font-weight="700" fill="var(--accent)">选择排序：每轮在未排序部分挑出最小值，放到前面</text>
  <text x="120" y="52" font-size="11" fill="var(--text3)">下标 0</text>
  <text x="182" y="52" font-size="11" fill="var(--text3)">1</text>
  <text x="244" y="52" font-size="11" fill="var(--text3)">2</text>
  <text x="306" y="52" font-size="11" fill="var(--text3)">3</text>
  <text x="368" y="52" font-size="11" fill="var(--text3)">4</text>
  <text x="462" y="52" font-size="11" fill="var(--text3)">发生了什么</text>

  <text x="20" y="88" font-size="12" fill="var(--text2)">初始</text>
  <rect x="120" y="64" width="54" height="40" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="147" y="90" font-size="14" text-anchor="middle" fill="var(--text)">5</text>
  <rect x="182" y="64" width="54" height="40" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="209" y="90" font-size="14" text-anchor="middle" fill="var(--text)">2</text>
  <rect x="244" y="64" width="54" height="40" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="271" y="90" font-size="14" text-anchor="middle" fill="var(--text)">9</text>
  <rect x="306" y="64" width="54" height="40" rx="6" fill="var(--warnSoft)" stroke="var(--warn)"/>
  <text x="333" y="90" font-size="14" text-anchor="middle" fill="var(--text)">1</text>
  <rect x="368" y="64" width="54" height="40" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="395" y="90" font-size="14" text-anchor="middle" fill="var(--text)">6</text>
  <text x="462" y="90" font-size="11" fill="var(--text2)">最小值是 1（下标 3）</text>

  <text x="20" y="156" font-size="12" fill="var(--text2)">第 1 轮</text>
  <rect x="120" y="132" width="54" height="40" rx="6" fill="var(--accentSoft)" stroke="var(--accent)"/>
  <text x="147" y="158" font-size="14" text-anchor="middle" fill="var(--text)">1</text>
  <rect x="182" y="132" width="54" height="40" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="209" y="158" font-size="14" text-anchor="middle" fill="var(--text)">2</text>
  <rect x="244" y="132" width="54" height="40" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="271" y="158" font-size="14" text-anchor="middle" fill="var(--text)">9</text>
  <rect x="306" y="132" width="54" height="40" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="333" y="158" font-size="14" text-anchor="middle" fill="var(--text)">5</text>
  <rect x="368" y="132" width="54" height="40" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="395" y="158" font-size="14" text-anchor="middle" fill="var(--text)">6</text>
  <text x="462" y="158" font-size="11" fill="var(--text2)">1 与首位的 5 交换</text>

  <text x="20" y="224" font-size="12" fill="var(--text2)">第 2 轮</text>
  <rect x="120" y="200" width="54" height="40" rx="6" fill="var(--accentSoft)" stroke="var(--accent)"/>
  <text x="147" y="226" font-size="14" text-anchor="middle" fill="var(--text)">1</text>
  <rect x="182" y="200" width="54" height="40" rx="6" fill="var(--accentSoft)" stroke="var(--accent)"/>
  <text x="209" y="226" font-size="14" text-anchor="middle" fill="var(--text)">2</text>
  <rect x="244" y="200" width="54" height="40" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="271" y="226" font-size="14" text-anchor="middle" fill="var(--text)">9</text>
  <rect x="306" y="200" width="54" height="40" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="333" y="226" font-size="14" text-anchor="middle" fill="var(--text)">5</text>
  <rect x="368" y="200" width="54" height="40" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="395" y="226" font-size="14" text-anchor="middle" fill="var(--text)">6</text>
  <text x="462" y="226" font-size="11" fill="var(--text2)">2 已经是最小，不动</text>

  <text x="20" y="292" font-size="12" fill="var(--text2)">第 3 轮</text>
  <rect x="120" y="268" width="54" height="40" rx="6" fill="var(--accentSoft)" stroke="var(--accent)"/>
  <text x="147" y="294" font-size="14" text-anchor="middle" fill="var(--text)">1</text>
  <rect x="182" y="268" width="54" height="40" rx="6" fill="var(--accentSoft)" stroke="var(--accent)"/>
  <text x="209" y="294" font-size="14" text-anchor="middle" fill="var(--text)">2</text>
  <rect x="244" y="268" width="54" height="40" rx="6" fill="var(--accentSoft)" stroke="var(--accent)"/>
  <text x="271" y="294" font-size="14" text-anchor="middle" fill="var(--text)">5</text>
  <rect x="306" y="268" width="54" height="40" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="333" y="294" font-size="14" text-anchor="middle" fill="var(--text)">9</text>
  <rect x="368" y="268" width="54" height="40" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="395" y="294" font-size="14" text-anchor="middle" fill="var(--text)">6</text>
  <text x="462" y="294" font-size="11" fill="var(--text2)">5 与 9 交换</text>

  <text x="20" y="360" font-size="12" fill="var(--text2)">第 4 轮</text>
  <rect x="120" y="336" width="54" height="40" rx="6" fill="var(--accentSoft)" stroke="var(--accent)"/>
  <text x="147" y="362" font-size="14" text-anchor="middle" fill="var(--text)">1</text>
  <rect x="182" y="336" width="54" height="40" rx="6" fill="var(--accentSoft)" stroke="var(--accent)"/>
  <text x="209" y="362" font-size="14" text-anchor="middle" fill="var(--text)">2</text>
  <rect x="244" y="336" width="54" height="40" rx="6" fill="var(--accentSoft)" stroke="var(--accent)"/>
  <text x="271" y="362" font-size="14" text-anchor="middle" fill="var(--text)">5</text>
  <rect x="306" y="336" width="54" height="40" rx="6" fill="var(--accentSoft)" stroke="var(--accent)"/>
  <text x="333" y="362" font-size="14" text-anchor="middle" fill="var(--text)">6</text>
  <rect x="368" y="336" width="54" height="40" rx="6" fill="var(--accentSoft)" stroke="var(--accent)"/>
  <text x="395" y="362" font-size="14" text-anchor="middle" fill="var(--text)">9</text>
  <text x="462" y="362" font-size="11" fill="var(--text2)">6 与 9 交换，完成</text>
</svg>`
    },

    { t: 'code', caption: 'SelectionSort.java · 点「单步」看数组每轮怎么变，输出 1 2 5 6 9', trace: true, code:
`public class SelectionSort {
    public static void main(String[] args) {
        int[] a = {5, 2, 9, 1, 6};

        for (int i = 0; i < a.length - 1; i++) {
            int min = i;                       // assume position i holds the minimum
            for (int j = i + 1; j < a.length; j++) {
                if (a[j] < a[min]) {
                    min = j;                   // a smaller element found: remember it
                }
            }
            int t = a[i];                      // swap the minimum into position i
            a[i] = a[min];
            a[min] = t;
        }

        for (int x : a) {
            System.out.print(x + " ");
        }
        System.out.println();
    }
}
` },

    { t: 'p', html:
      '比较次数是固定的：外层第 i 轮内层要比较 <code>n-1-i</code> 次，加起来 <code>(n-1) + (n-2) + … + 1 = n(n-1)/2</code>，' +
      'n = 5 时正好 10 次。交换最多 n-1 次（每轮至多一次）。' +
      '不管输入本来就有序还是完全逆序，它都干同样多的活——这叫<b>没有适应性（not adaptive）</b>。' +
      '优点是交换次数少、代码短、额外空间 O(1)。'
    },

    { t: 'callout', kind: 'warn', title: '把比较符反过来，就是降序', html:
      'Mock A Q6 的问法：把 <code>a[j] &lt; a[min]</code> 改成 <code>a[j] &gt; a[min]</code>，输出会怎样？' +
      '答案是降序。原理：内层从"找最小"变成"找最大"，每轮把最大值换到前面。' +
      '这类"改一个符号问输出"的题，先在纸上把第一轮跑一遍就能确定方向；千万别只凭代码感觉。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 选择排序', html: '能默写外层 i、内层 j、min 记录下标、一轮一次交换，并说出比较次数 n(n-1)/2。' },
      { title: '检查点 · 改符号', html: '能把 <code>&lt;</code> 改 <code>&gt;</code> 后说出结果是降序，并解释为什么。' }
    ] },

    { t: 'h', text: '三、插入排序：像整理扑克牌', id: 'ch11-3' },

    { t: 'p', html:
      '像整理扑克牌：左手是已经排好的牌，右手摸一张，从右往左比较，插到正确的位置。' +
      '实现上的关键技巧是<b>边比较边后移</b>：把比 <code>key</code> 大的元素统统往右挪一格，腾出空位，' +
      '不用真的申请一个新数组。循环结束时 <code>j + 1</code> 就是 key 该待的位置。'
    },

    { t: 'code', caption: 'InsertionSort.java · 输出 1 2 5 6 9', code:
`public class InsertionSort {
    public static void main(String[] args) {
        int[] a = {5, 2, 9, 1, 6};

        for (int i = 1; i < a.length; i++) {
            int key = a[i];              // the card we just picked up
            int j = i - 1;                // start from the end of the sorted part
            while (j >= 0 && a[j] > key) {
                a[j + 1] = a[j];          // shift larger elements to the right
                j--;
            }
            a[j + 1] = key;               // the empty slot is where key belongs
        }

        for (int x : a) {
            System.out.print(x + " ");
        }
        System.out.println();
    }
}
` },

    { t: 'table',
      head: ['轮次', '取出的 key', '这一轮怎么动', '本轮结束的数组'],
      rows: [
        ['i = 1', '2', '2 比 5 小 → 5 右移，2 放到位置 0', '[2, 5, 9, 1, 6]'],
        ['i = 2', '9', '9 比 5 大 → 不动', '[2, 5, 9, 1, 6]'],
        ['i = 3', '1', '1 比 9、5、2 都小 → 三者依次右移，1 放到位置 0', '[1, 2, 5, 9, 6]'],
        ['i = 4', '6', '6 比 9 小、比 5 大 → 9 右移，6 放到位置 3', '[1, 2, 5, 6, 9]']
      ],
      caption: '每一轮只处理一个元素，左边始终有序——这是"维护有序前缀"策略'
    },

    { t: 'p', html:
      '最好情况（数组已经有序）只要 n-1 次比较，每张牌都插在队尾；最坏情况（完全逆序）要 n(n-1)/2 次比较、' +
      '同样多次移动。这种"数据越有序越快"的性质叫<b>适应性（adaptive）</b>——这是插入排序相对选择排序的核心优势。' +
      '插入排序在小数组上常数小、上手快，Java 的 <code>Arrays.sort</code> 在处理小数组时用的就是它。'
    },

    { t: 'compare', left: {
      title: '选择排序：每轮找最小，直接换到前面',
      html: '比较次数固定 n(n-1)/2，不管数据长什么样；交换最多 n-1 次；<b>无适应性、不稳定</b>。',
      code: 'for (int i = 0; i < n - 1; i++) {\n    int min = i;\n    for (int j = i + 1; j < n; j++)\n        if (a[j] < a[min]) min = j;\n    swap(a, i, min);\n}'
    }, right: {
      title: '插入排序：每轮把新元素插进有序前缀',
      html: '比较次数随数据变化：已有序 n-1 次、逆序 n(n-1)/2 次；移动多但常数小；<b>有适应性、稳定</b>。',
      code: 'for (int i = 1; i < n; i++) {\n    int key = a[i], j = i - 1;\n    while (j >= 0 && a[j] > key) {\n        a[j + 1] = a[j]; j--;\n    }\n    a[j + 1] = key;\n}'
    } },

    { t: 'p', html:
      '判据：<b>数据接近有序就选插入，完全随机两者都行</b>；交换成本很高时，选择排序的"少交换"反而占优。' +
      '实际工程里两者只用于小数组（几十个元素），大数组会用 n log n 的算法。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 插入排序', html: '能默写 key、j 从 i-1 往左、边比边后移、最后 a[j+1] = key。' },
      { title: '检查点 · 适应性', html: '能说出"已排序数组上插入排序只要 n-1 次比较"，而选择排序仍是 n(n-1)/2 次。' }
    ] },

    { t: 'h', text: '四、归并排序：分治 + 合并', id: 'ch11-4' },

    { t: 'p', html:
      '<b>分治（divide and conquer）</b>三步：把问题劈成两半、分别解决、再合并结果。' +
      '归并排序把数组对半劈开，两半各自排好，最后把两个有序数组合并（<b>merge</b>）成一个。' +
      '合并只需要一次扫描：每次比较两个数组的开头，取较小的那个放进结果；谁先用完，就把另一个剩下的直接接上。'
    },

    { t: 'code', caption: 'MergeTwo.java · 合并两个有序数组，输出 1 2 3 4 7 9', code:
`public class MergeTwo {
    public static void main(String[] args) {
        int[] left = {1, 4, 7};
        int[] right = {2, 3, 9};
        int[] merged = new int[left.length + right.length];

        int i = 0;
        int j = 0;
        int k = 0;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                merged[k] = left[i];
                i++;
            } else {
                merged[k] = right[j];
                j++;
            }
            k++;
        }
        while (i < left.length) {          // append whatever is left of left
            merged[k] = left[i];
            i++;
            k++;
        }
        while (j < right.length) {         // append whatever is left of right
            merged[k] = right[j];
            j++;
            k++;
        }

        for (int x : merged) {
            System.out.print(x + " ");
        }
        System.out.println();
    }
}
` },

    { t: 'p', html:
      '合并两个总长为 n 的有序数组，只要 n 次左右的比较——"已有序"这个条件值钱。' +
      '把这个合并过程递归地套上去，就是完整的归并排序：对半递归排好两段，再合并。'
    },

    { t: 'code', caption: 'MergeSort.java · 递归版归并排序，输出 1 2 3 5 6 9', code:
`public class MergeSort {
    static void sort(int[] a, int lo, int hi) {
        if (lo >= hi) return;                  // 0 or 1 element: already sorted
        int mid = lo + (hi - lo) / 2;
        sort(a, lo, mid);                      // sort the left half
        sort(a, mid + 1, hi);                  // sort the right half
        merge(a, lo, mid, hi);                 // merge the two sorted halves
    }

    static void merge(int[] a, int lo, int mid, int hi) {
        int[] temp = new int[hi - lo + 1];
        int i = lo;
        int j = mid + 1;
        int k = 0;

        while (i <= mid && j <= hi) {
            if (a[i] <= a[j]) {
                temp[k] = a[i];
                i++;
            } else {
                temp[k] = a[j];
                j++;
            }
            k++;
        }
        while (i <= mid) {
            temp[k] = a[i];
            i++;
            k++;
        }
        while (j <= hi) {
            temp[k] = a[j];
            j++;
            k++;
        }

        for (int t = 0; t < temp.length; t++) {
            a[lo + t] = temp[t];
        }
    }

    public static void main(String[] args) {
        int[] a = {5, 2, 9, 1, 6, 3};
        sort(a, 0, a.length - 1);
        for (int x : a) {
            System.out.print(x + " ");
        }
        System.out.println();
    }
}
` },

    { t: 'p', html:
      '每一层合并的总代价是 n 次比较，一共 log₂n 层（n 每次减半），所以归并排序约需 n log n 次操作。' +
      '代价是需要一个和原数组同样大的辅助数组 <code>temp</code>，空间开销是 n。' +
      '稳定性来自合并时的 <code>&lt;=</code>：相等时先取左边，左边元素原本就排在前面，于是相对顺序得以保持。'
    },

    { t: 'p', html:
      '归并的优点是"任何输入都是 n log n"，不受数据形态影响；缺点是额外空间和递归调用开销。' +
      '实际工程里，排序大型对象数组（元素复制很贵、需要稳定）常常用归并或它的变体（如 TimSort）。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 分治三件套', html: '能说出"劈半、递归排两半、合并"三步，并写出 merge 的双指针循环。' },
      { title: '检查点 · 稳定性来源', html: '能指出 <code>a[i] &lt;= a[j]</code> 里的等号就是稳定性的来源。' }
    ] },

    { t: 'h', text: '五、快速排序：选基准，分区，递归', id: 'ch11-5' },

    { t: 'p', html:
      '选一个<b>基准（pivot）</b>，把所有比它小的放左边、比它大的放右边——这一步叫<b>分区（partition）</b>。' +
      '分区完成后，基准就落在了最终位置上，左右两段各自递归即可。平均情况下非常快，常数比归并小；' +
      '但如果每次都选到最差的基准（比如数组已有序还总选端点），会退化成 n²。'
    },

    { t: 'code', caption: 'QuickSort.java · 取末尾元素作基准，输出 1 2 3 5 6 9', code:
`public class QuickSort {
    static void sort(int[] a, int lo, int hi) {
        if (lo >= hi) return;
        int p = partition(a, lo, hi);          // p is the final position of pivot
        sort(a, lo, p - 1);
        sort(a, p + 1, hi);
    }

    static int partition(int[] a, int lo, int hi) {
        int pivot = a[hi];                     // simplified: the last item as pivot
        int i = lo - 1;                        // boundary of the "<= pivot" part
        for (int j = lo; j < hi; j++) {
            if (a[j] <= pivot) {
                i++;
                int t = a[i];
                a[i] = a[j];
                a[j] = t;
            }
        }
        int t = a[i + 1];                      // put pivot at the boundary
        a[i + 1] = a[hi];
        a[hi] = t;
        return i + 1;
    }

    public static void main(String[] args) {
        int[] a = {5, 2, 9, 1, 6, 3};
        sort(a, 0, a.length - 1);
        for (int x : a) {
            System.out.print(x + " ");
        }
        System.out.println();
    }
}
` },

    { t: 'p', html:
      '快排的分区只做一次线性扫描（n 次比较），然后把问题分成两个更小的区间递归——平均分得比较均匀时，' +
      '递归深度 log n，总代价 n log n。最坏情况是每次分区都极不均匀（比如有序数组、固定取末尾当基准），' +
      '递归深度退化成 n，总代价 n²。' +
      '避免最坏情况的办法：随机选基准，或者取"首、中、尾三个数的中位数"（median-of-three）。' +
      'Java 对基本类型的排序用的是双轴快速排序（dual-pivot quicksort）。'
    },

    { t: 'p', html:
      '注意快排的"原地"只是省了数组空间：递归调用本身仍然占栈，平均 O(log n)、最坏 O(n)。' +
      '另外分区时用的是严格不稳定的交换，"相等元素谁先谁后"完全可能被打乱——这就是快排不稳定的原因。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 快排', html: '能写出 partition 的 i = lo-1 边界、j 扫描、<= pivot 交换、最后把 pivot 放到 i+1。' },
      { title: '检查点 · 退化', html: '能说出"有序数组 + 固定端点基准"为什么会退化成 n²，并给出两种改进办法。' }
    ] },

    { t: 'h', text: '六、稳定性：排序也有讲究', id: 'ch11-6' },

    { t: 'p', html:
      '<b>稳定性（stability）</b>指排序后，键值相同的元素是否保持原来的相对顺序。什么时候重要？' +
      '先按分数排、再按姓名排——如果第二次排序是稳定的，同分的人仍然保持第一次的顺序。' +
      '对基本类型（int、double）来说，"两个 3 谁在前"看不出区别，所以稳定性似乎无所谓；' +
      '但对<b>对象</b>来说，3 分可能是"张三"和"李四"两条不同记录，顺序就很重要了。'
    },

    { t: 'code', caption: 'StabilityDemo.java · 同一组数据，选择排序打乱了相等元素的顺序', code:
`public class StabilityDemo {
    static void selection(Item[] items) {
        for (int i = 0; i < items.length - 1; i++) {
            int min = i;
            for (int j = i + 1; j < items.length; j++) {
                if (items[j].key < items[min].key) min = j;
            }
            Item t = items[i];
            items[i] = items[min];
            items[min] = t;
        }
    }

    static void insertion(Item[] items) {
        for (int i = 1; i < items.length; i++) {
            Item key = items[i];
            int j = i - 1;
            while (j >= 0 && items[j].key > key.key) {
                items[j + 1] = items[j];
                j--;
            }
            items[j + 1] = key;
        }
    }

    static String show(Item[] items) {
        String s = "";
        for (int i = 0; i < items.length; i++) {
            if (i > 0) s = s + " ";
            s = s + items[i];
        }
        return s;
    }

    public static void main(String[] args) {
        Item[] data = {
            new Item(3, "A"), new Item(1, "B"), new Item(3, "C"),
            new Item(2, "D"), new Item(3, "E")
        };
        Item[] s1 = new Item[data.length];
        Item[] s2 = new Item[data.length];
        for (int i = 0; i < data.length; i++) {
            s1[i] = new Item(data[i].key, data[i].tag);
            s2[i] = new Item(data[i].key, data[i].tag);
        }
        selection(s1);
        insertion(s2);
        System.out.println("input  : " + show(data));
        System.out.println("select : " + show(s1));
        System.out.println("insert : " + show(s2));
    }
}

class Item {
    int key;
    String tag;

    Item(int key, String tag) {
        this.key = key;
        this.tag = tag;
    }

    public String toString() {
        return key + tag;
    }
}
` },

    { t: 'p', html:
      '看输出：输入是 <code>3A 1B 3C 2D 3E</code>。选择排序得到 <code>1B 2D 3C 3A 3E</code>——三个 key 为 3 的元素从 A、C、E 变成 C、A、E，' +
      '相对顺序被打乱；插入排序得到 <code>1B 2D 3A 3C 3E</code>——A、C、E 仍然保持原顺序。' +
      '原因是选择排序"跨距离交换"会把远处的元素直接换到前面，而插入排序只在相邻位置移动（遇到相等就停），不会跨越相等元素。'
    },

    { t: 'table',
      head: ['算法', '平均时间', '最坏时间', '额外空间', '稳定'],
      rows: [
        ['选择排序', 'n²', 'n²', '几格变量', '不稳定'],
        ['插入排序', 'n²', 'n²', '几格变量', '稳定'],
        ['归并排序', 'n log n', 'n log n', 'n', '稳定'],
        ['快速排序', 'n log n', 'n²', 'log n（递归栈）', '不稳定']
      ],
      caption: '这些记号的含义第 13 章会正式定义；现在你只要记住"n log n 比 n² 快，而且差距随规模拉大"'
    },

    { t: 'p', html:
      'Java 里 <code>Arrays.sort</code> 对基本类型用快排（不稳定，但快且不占额外空间），' +
      '对对象数组用归并（稳定）——因为对象可能被多次按不同字段排序，稳定才符合使用者的预期。' +
      '这也是一个通用的设计原则：<b>数据结构/算法的"语义"比性能更优先，性能是第二位</b>。'
    },

    { t: 'compare', left: {
      title: '归并排序：稳定，但要额外空间',
      html: '分治到底再合并。任何输入都是 O(n log n)；合并需要长度 n 的辅助数组，额外空间 O(n)。' +
        '合并时相等取左边，所以稳定。',
      code: 'int[] merged = merge(sort(left), sort(right));   // 需要额外 O(n) 辅助数组\n// 合并时相等取左 → 稳定'
    }, right: {
      title: '快速排序：原地，但可能退化',
      html: '选基准 partition 后递归两边。平均 O(n log n)、原地交换省内存；基准选差会退化 O(n²)，且不稳定。',
      code: 'int p = partition(a, lo, hi);          // 原地交换，额外空间只是递归栈 O(log n)\nquickSort(a, lo, p - 1);\nquickSort(a, p + 1, hi);'
    } },

    { t: 'p', html:
      '判据：<b>先问两个问题——要不要稳定？内存紧不紧？</b>' +
      '要稳定就用归并；内存敏感、数据规模大且随机就用快排。注意两者"最坏情况"不同：' +
      '归并永远是 n log n；快排最坏 n²，但平均常数更小、实际更快。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 稳定性', html: '能用自己的话说清"相等元素的相对顺序是否保持"，并解释为什么选择排序不稳定。' },
      { title: '检查点 · Java 策略', html: '知道 <code>Arrays.sort</code> 对基本类型用快排、对对象数组用归并，并说出原因。' }
    ] },

    { t: 'h', text: '七、查找：线性与二分', id: 'ch11-7' },

    { t: 'p', html:
      '<b>线性查找（linear search）</b>：从头比到尾，n 个数最坏比 n 次。数据无序时，只能用它。' +
      '它简单到不会写错，代价是慢——100 万个数最坏要比 100 万次。'
    },

    { t: 'code', caption: 'SearchDemo.java · 线性查找与二分查找对比', code:
`public class SearchDemo {
    static int linearSearch(int[] a, int target) {
        for (int i = 0; i < a.length; i++) {
            if (a[i] == target) return i;
        }
        return -1;                             // -1 means "not found"
    }

    static int binarySearch(int[] a, int target) {
        int lo = 0;
        int hi = a.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;      // avoid (lo + hi) / 2 overflow
            if (a[mid] == target) return mid;
            if (a[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] sorted = {1, 3, 5, 7, 9, 11, 13};
        System.out.println(linearSearch(sorted, 11));  // 5
        System.out.println(binarySearch(sorted, 11));  // 5
        System.out.println(binarySearch(sorted, 4));   // -1
    }
}
` },

    { t: 'p', html:
      '<b>二分查找（binary search）</b>每次砍掉一半：先看中间，比中间小就去左半边，大了就去右半边。' +
      '1000 个数最多比较 10 次（2¹⁰ ≈ 1000），100 万个数也只要 20 次。<b>前提是数组必须有序</b>——' +
      '没有顺序，"往哪边找"就完全没有依据。' +
      '二分还有一个隐藏要求：数组必须支持<b>随机访问</b>（按下标 O(1) 取值），所以链表上不能直接套二分。'
    },

    { t: 'code', caption: 'BinaryCount.java · 数一数二分到底比较了几次', code:
`public class BinaryCount {
    static int search(int[] a, int target, int[] counter) {
        int lo = 0;
        int hi = a.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            counter[0]++;
            if (a[mid] == target) return mid;
            if (a[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] a = new int[15];
        for (int i = 0; i < a.length; i++) {
            a[i] = i * 2;
        }
        int[] targets = {0, 14, 28, 7};
        for (int k = 0; k < targets.length; k++) {
            int[] counter = {0};
            int idx = search(a, targets[k], counter);
            System.out.println("target " + targets[k] + ": index " + idx + ", comparisons " + counter[0]);
        }
    }
}
` },

    { t: 'table',
      head: ['数据规模', '线性查找最坏比较次数', '二分查找最坏比较次数'],
      rows: [
        ['10', '10', '4'],
        ['1 000', '1 000', '10'],
        ['1 000 000', '1 000 000', '20']
      ],
      caption: '线性：与 n 成正比；二分：n 每翻倍只多 1 次。这就是第 13 章 O(n) 与 O(log n) 的直观区别'
    },

    { t: 'p', html:
      '二分的强大之处在于"变体"：把 <code>if (a[mid] == target) return mid</code> 换成"记录答案、继续往左找"，' +
      '就能求"第一个 ≥ target 的位置"（lower bound）；把数组换成降序，比较方向反一下，就能在降序数组上查找。' +
      '期中卷最喜欢考的就是这些变体——<b>基本模板会背只是及格线，会改边界才是得分点</b>。<br>' +
      '模板只有四行要记：<code>lo = 0</code>、<code>hi = n - 1</code>、<code>while (lo &lt;= hi)</code>、' +
      '<code>mid = lo + (hi - lo) / 2</code>。这四行里每一行都有一个坑，下一个案例会逐个踩。'
    },

    { t: 'callout', kind: 'warn', title: '二分查找的三个经典错误', html:
      '① <b>数组没排序就调用</b>：结果随机对错，最难查。② <b>循环条件写成 <code>lo &lt; hi</code></b>：' +
      '会漏掉最后一个元素，应该用 <code>lo &lt;= hi</code>。③ <b><code>mid = (lo + hi) / 2</code></b>：' +
      '两个大下标相加会溢出 int，标准写法是 <code>lo + (hi - lo) / 2</code>。'
    },

    { t: 'lab', id: 'sorting' },

    { t: 'lab', id: 'search' },

    { t: 'p', html:
      '怎么选？<b>只查一次、数据无序</b>：线性查找，简单直接。' +
      '<b>要反复查很多次</b>：先花 n log n 排序，之后每次查找只要 log n。' +
      '数据量很小（几十个）时，排序的开销可能比省下的查找还大——工程上要算这笔账。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 二分模板', html: '能默写 lo/hi/while(lo<=hi)/mid 四行，并说出为什么 mid 不能写 (lo+hi)/2。' },
      { title: '检查点 · 前提', html: '能说出二分要求"有序 + 随机访问"，并解释缺哪个会失败。' }
    ] },

    { t: 'h', text: '八、边界与反例：六个常见误解' },

    { t: 'table',
      head: ['说法 / 场景', '真相', '怎么记'],
      rows: [
        ['空数组排序会崩', '所有排序都应在 <code>lo &gt;= hi</code> 或长度 &lt; 2 时立即返回，不进入循环', '递归基线要写全'],
        ['单元素数组需要特殊处理', '不需要。它天然有序，排序循环一次都不走', '边界 = 0 或 1 个元素'],
        ['二分只要数组有序就行', '还要能随机访问（链表不行），且比较方向与升序/降序一致', '有序 + 随机访问 + 方向对'],
        ['降序数组可以直接用升序二分', '不行，比较方向要反过来（<code>a[mid] &lt; target</code> 时往右找的是升序写法）', '先看数组方向'],
        ['已排序对插入排序最坏', '相反：已排序是插入排序的<b>最好</b>情况（n-1 次比较）', '插入排序有适应性'],
        ['快排最坏也是 n log n', '错。固定端点基准 + 有序输入会退化成 n²', '基准要随机/三数取中']
      ],
      caption: '这六条覆盖了期中、期末卷面上排序查找类的判断题与边界题'
    },

    { t: 'p', html:
      '再补两个边界：① <b>重复元素</b>——二分找到的可能是任意一个相等元素，"第一个/最后一个"要自己继续往两边找；' +
      '排序时怎么处理重复元素决定稳定性。② <b>数组被原地修改</b>——需要保留原顺序时，调用前先 <code>Arrays.copyOf</code> 备份。'
    },

    { t: 'h', text: '九、调试实录：三个排序/查找 bug', id: 'ch11-8' },

    { t: 'p', html:
      '排序和查找的 bug 有个共同特点：<b>要么不报错但结果错，要么干脆死循环</b>。调试它们靠的是"手写追踪表"，' +
      '而不是盯着代码看。固定流程：① 用一个 5–6 个元素的小数组；② 在纸上写"轮次 / lo / hi / mid / 数组状态"四列；' +
      '③ 逐行模拟，和程序输出对照；④ 找到第一个不一致的位置。'
    },

    { t: 'steps', items: [
      { title: '先看是不是死循环', html: '循环变量（lo、hi、i、j）有没有在某轮不变化？不变化就一定会卡住。' },
      { title: '再看边界条件', html: '<code>&lt;</code> 还是 <code>&lt;=</code>？<code>mid ± 1</code> 有没有漏？先把边界写成能覆盖全部元素的版本。' },
      { title: '最后看数据被谁改了', html: '排序方法往往原地修改数组；如果后面还要用原顺序，检查有没有提前备份。' }
    ] },

    { t: 'h', lvl: 3, text: '案例 1：循环条件少一个等号，最后一个元素永远找不到' },

    { t: 'p', html:
      '需求是"在有序数组里查目标值"。代码逻辑看起来完全正确，但查数组最后一个元素时返回 -1。' +
      '原因：<code>while (lo &lt; hi)</code> 在 lo == hi 时提前退出，而这时区间里还有一个元素没被检查。'
    },

    { t: 'code', caption: 'DebugCase1.java · 查 9 返回 -1，查 1 和 5 却正常', code:
`public class DebugCase1 {
    static int buggy(int[] a, int target) {
        int lo = 0;
        int hi = a.length - 1;
        while (lo < hi) {                     // BUG: should be lo <= hi
            int mid = lo + (hi - lo) / 2;
            if (a[mid] == target) return mid;
            if (a[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] a = {1, 3, 5, 7, 9};
        System.out.println(buggy(a, 9));   // -1: 9 is present but never checked
        System.out.println(buggy(a, 1));   // 0
        System.out.println(buggy(a, 5));   // 2
    }
}
` },

    { t: 'p', html:
      '定位过程：① 查 9 返回 -1，但查 1、5 都正常 → 说明不是数组或方向问题；② 手写追踪：lo=0, hi=4, mid=2（值 5），5 &lt; 9 → lo=3；' +
      'lo=3, hi=4, mid=3（值 7），7 &lt; 9 → lo=4；此时 <code>lo &lt; hi</code> 是 4 &lt; 4，为 false，循环直接退出——' +
      '而 <code>a[4] = 9</code> 正是答案，却从未被比较。修复：把条件改成 <code>lo &lt;= hi</code>。' +
      '这类 bug 的特征是"大部分用例都对，只在边界失败"，所以测试一定要包含<b>第一个、最后一个、不存在</b>三种情况。'
    },

    { t: 'h', lvl: 3, text: '案例 2：mid 用 (lo+hi)/2，数组够大就溢出' },

    { t: 'p', html:
      '第二个 bug 只在超大数组上出现，小数组完全正常。Java 的 int 是 32 位，两个接近 21 亿的下标相加会溢出成负数，' +
      '再除以 2 得到负的 mid，数组访问直接抛异常（或者算出错误结果）。标准写法是 <code>lo + (hi - lo) / 2</code>，' +
      '先减再除，中间值不会超过 hi。'
    },

    { t: 'code', caption: 'DebugCase2.java · 同一个区间，两种 mid 算法结果差 40 亿', code:
`public class DebugCase2 {
    static int buggyMid(int lo, int hi) {
        return (lo + hi) / 2;
    }

    static int safeMid(int lo, int hi) {
        return lo + (hi - lo) / 2;
    }

    public static void main(String[] args) {
        int lo = 2000000000;
        int hi = 2100000000;
        System.out.println("buggy = " + buggyMid(lo, hi));
        System.out.println("safe  = " + safeMid(lo, hi));
    }
}
` },

    { t: 'p', html:
      '输出 <code>buggy = -97483648</code>、<code>safe = 2050000000</code>。溢出的 40 亿是怎么来的：' +
      '两个下标之和超过 int 上限 2147483647，回绕成负数，除以 2 就是约 -9700 万。' +
      '<b>修复只需一个括号</b>，但更重要的是记住结论：涉及"两个大数相加"的写法都要警惕溢出，' +
      '排序里的 <code>(lo + hi) / 2</code>、求平均 <code>(a + b) / 2</code> 都是同一类问题。'
    },

    { t: 'h', lvl: 3, text: '案例 3：排序方法改掉了调用者的数组' },

    { t: 'p', html:
      '第三个 bug 不报错、结果也"对"，但需求是做一份排序后的副本、原数组保留。代码直接传了原数组进去，' +
      '排序方法原地修改，原数组被改得面目全非——因为有别名，连"备份变量"也一起被改了。' +
      '修复：备份必须是真拷贝（<code>Arrays.copyOf</code>），或者让排序方法返回新数组。'
    },

    { t: 'code', caption: 'DebugCase3.java · backup 和 scores 是同一个数组', code:
`import java.util.Arrays;

public class DebugCase3 {
    static void sortInPlace(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            int min = i;
            for (int j = i + 1; j < a.length; j++) {
                if (a[j] < a[min]) min = j;
            }
            int t = a[i];
            a[i] = a[min];
            a[min] = t;
        }
    }

    public static void main(String[] args) {
        int[] scores = {72, 95, 60, 88};
        int[] backup = scores;          // BUG: this is an alias, not a copy
        sortInPlace(scores);
        System.out.println("scores = " + Arrays.toString(scores));
        System.out.println("backup = " + Arrays.toString(backup));
        System.out.println("same object? " + (scores == backup));
    }
}
` },

    { t: 'p', html:
      '输出两个数组都被排成了 <code>[60, 72, 88, 95]</code>，<code>same object?</code> 为 true。' +
      '定位关键就是最后一个打印：它证明 backup 不是副本而是别名。修复：<code>int[] backup = Arrays.copyOf(scores, scores.length);</code>。' +
      '这个模式在第 09 章（内存与引用）讲过——<b>引用类 bug 的根因永远是"你以为复制了，其实共享了"</b>。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 三个 bug', html: '能说出每个 bug 属于"边界 <、溢出、别名"哪一类，并给出对应修复。' },
      { title: '检查点 · 测试用例', html: '给二分写测试时会包含"第一个、最后一个、不存在"三个用例，而不是只测中间。' }
    ] },

    { t: 'h', text: '完整案例 A：成绩排序 + 二分查排名', id: 'ch11-9' },

    { t: 'p', html:
      '需求：给定学生学号和成绩，按成绩<b>降序</b>排名，同分保持原有先后（<b>稳定</b>）；' +
      '然后用二分快速回答"某分数对应的排名/并列情况"。这个案例同时用到：稳定插入排序、平行数组、' +
      '降序数组上的二分变体（找第一个 ≤ target 的位置）。先想一个问题：为什么这里不能用选择排序？' +
      '因为同分学生的相对顺序会被打乱——而"同分按学号先后"恰恰是需求。'
    },

    { t: 'code', caption: 'ScoreRank.java · 57 行完整程序：稳定排序 + 二分查排名', code:
`import java.util.Arrays;

public class ScoreRank {
    // stable insertion sort: descending by score; equal scores keep original order
    static void sortByScoreDesc(int[] scores, int[] ids) {
        for (int i = 1; i < scores.length; i++) {
            int keyScore = scores[i];
            int keyId = ids[i];
            int j = i - 1;
            while (j >= 0 && scores[j] < keyScore) {
                scores[j + 1] = scores[j];
                ids[j + 1] = ids[j];
                j--;
            }
            scores[j + 1] = keyScore;
            ids[j + 1] = keyId;
        }
    }

    // descending array: return the first index whose score <= target; -1 if none
    static int firstNotGreater(int[] desc, int target) {
        int lo = 0;
        int hi = desc.length - 1;
        int ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (desc[mid] <= target) {
                ans = mid;
                hi = mid - 1;
            } else {
                lo = mid + 1;
            }
        }
        return ans;
    }

    public static void main(String[] args) {
        int[] ids = {101, 102, 103, 104, 105, 106, 107};
        int[] scores = {88, 95, 88, 72, 95, 60, 88};

        sortByScoreDesc(scores, ids);
        System.out.println("rank   id  score");
        for (int i = 0; i < scores.length; i++) {
            System.out.printf("%4d %5d %6d%n", i + 1, ids[i], scores[i]);
        }

        int target = 88;
        int idx = firstNotGreater(scores, target);
        System.out.println("first index with score <= 88: " + idx);
        System.out.println("rank of score 88 = " + (idx + 1));
        System.out.println("students above 88 = " + idx);

        int missing = 90;
        int idx2 = firstNotGreater(scores, missing);
        System.out.println("for target 90: index = " + idx2 + ", rank = " + (idx2 + 1));
    }
}
` },

    { t: 'table',
      head: ['代码段', '做什么', '关键点'],
      rows: [
        ['sortByScoreDesc', '按成绩降序、稳定排序平行数组', '条件写 <code>scores[j] &lt; keyScore</code>（严格小于）才稳定'],
        ['firstNotGreater', '降序数组上找第一个 ≤ target 的位置', '降序时"比 target 大"往右走，方向与升序相反'],
        ['main 前半', '打印排名表', '<code>%4d %5d %6d</code> 三列对齐'],
        ['main 后半', '查 88 分的排名 / 90 分该插在哪', '不存在时返回"插入点"，相当于"高于它的人数"']
      ],
      caption: '一遍读下来，稳定排序 + 二分变体两个考点同时覆盖'
    },

    { t: 'p', html:
      '逐段看关键点。① 排序条件用 <code>scores[j] &lt; keyScore</code>（严格小于）：相等时循环停止，' +
      '新元素插在相等元素<b>之后</b>，所以稳定；如果写成 <code>&lt;=</code>，新元素会插到相等元素前面，顺序反转。' +
      '② 降序二分的判断方向：<code>desc[mid] &lt;= target</code> 时说明"这个位置还在目标之后（分数更低或同分）"，' +
      '于是记录答案并继续往左找第一个。③ 查 90 分返回 index 2 / rank 3，含义是"90 分应插在索引 2 之前"，' +
      '等价于"高于 90 分的有 2 人"。<br>' +
      '这个案例说明：真实需求往往要求<b>排序 + 查找组合</b>，而稳定性、边界语义、二分方向都要一起考虑。'
    },

    { t: 'h', text: '完整案例 B：归并与快排的比较次数实验', id: 'ch11-10' },

    { t: 'p', html:
      '光说"n log n 比 n² 快"太抽象。下面写一个实验：对同一组数据分别跑选择排序、归并排序、快速排序，' +
      '用计数器统计**比较次数**，再换三种数据形态（随机、已排序、逆序）各跑一遍。' +
      '这个程序的输出会让你直观看到"适应性"和"最坏情况"到底是什么。'
    },

    { t: 'code', caption: 'CompareCount.java · 108 行：三种排序 × 三种数据形态', code:
`import java.util.Arrays;

public class CompareCount {
    static int mergeCount = 0;
    static int quickCount = 0;
    static int selectCount = 0;

    static void selectionSort(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            int min = i;
            for (int j = i + 1; j < a.length; j++) {
                selectCount++;
                if (a[j] < a[min]) min = j;
            }
            int t = a[i];
            a[i] = a[min];
            a[min] = t;
        }
    }

    static void mergeSort(int[] a, int lo, int hi) {
        if (lo >= hi) return;
        int mid = lo + (hi - lo) / 2;
        mergeSort(a, lo, mid);
        mergeSort(a, mid + 1, hi);
        merge(a, lo, mid, hi);
    }

    static void merge(int[] a, int lo, int mid, int hi) {
        int[] temp = new int[hi - lo + 1];
        int i = lo;
        int j = mid + 1;
        int k = 0;
        while (i <= mid && j <= hi) {
            mergeCount++;
            if (a[i] <= a[j]) {
                temp[k] = a[i];
                i++;
            } else {
                temp[k] = a[j];
                j++;
            }
            k++;
        }
        while (i <= mid) {
            temp[k] = a[i];
            i++;
            k++;
        }
        while (j <= hi) {
            temp[k] = a[j];
            j++;
            k++;
        }
        for (int t = 0; t < temp.length; t++) {
            a[lo + t] = temp[t];
        }
    }

    static void quickSort(int[] a, int lo, int hi) {
        if (lo >= hi) return;
        int p = partition(a, lo, hi);
        quickSort(a, lo, p - 1);
        quickSort(a, p + 1, hi);
    }

    static int partition(int[] a, int lo, int hi) {
        int pivot = a[hi];
        int i = lo - 1;
        for (int j = lo; j < hi; j++) {
            quickCount++;
            if (a[j] <= pivot) {
                i++;
                int t = a[i];
                a[i] = a[j];
                a[j] = t;
            }
        }
        int t = a[i + 1];
        a[i + 1] = a[hi];
        a[hi] = t;
        return i + 1;
    }

    static void run(String name, int[] data) {
        int[] a = Arrays.copyOf(data, data.length);
        selectionSort(a);
        int[] b = Arrays.copyOf(data, data.length);
        mergeSort(b, 0, b.length - 1);
        int[] c = Arrays.copyOf(data, data.length);
        quickSort(c, 0, c.length - 1);
        System.out.printf("%-8s select=%2d  merge=%2d  quick=%2d  sorted=%s%n",
            name, selectCount, mergeCount, quickCount,
            (Arrays.equals(a, b) && Arrays.equals(b, c)));
        selectCount = 0;
        mergeCount = 0;
        quickCount = 0;
    }

    public static void main(String[] args) {
        int[] random = {5, 2, 9, 1, 6, 3, 8, 4, 7};
        int[] sorted = {1, 2, 3, 4, 5, 6, 7, 8, 9};
        int[] reversed = {9, 8, 7, 6, 5, 4, 3, 2, 1};
        run("random", random);
        run("sorted", sorted);
        run("reversed", reversed);
    }
}
` },

    { t: 'table',
      head: ['数据形态', '选择排序比较次数', '归并排序比较次数', '快速排序比较次数', '结论'],
      rows: [
        ['随机', '36', '21', '18', '快排平均最快，归并次之'],
        ['已排序', '36', '16', '36', '插入/归并受益，快排退化'],
        ['逆序', '36', '13', '36', '快排固定端点基准的最坏情况']
      ],
      caption: 'n = 9 时 n(n-1)/2 = 36：选择排序三行都是 36，正是"无适应性"的铁证'
    },

    { t: 'p', html:
      '怎么读这张表？① <b>选择排序恒为 36</b>：不管数据什么样，比较次数固定，这就是"没有适应性"。' +
      '② <b>归并排序在三种数据上都比 n² 少</b>（13–21 次），而且数据越"有序"它反而越省比较——不是因为它有适应性，' +
      '而是因为有序时合并阶段更容易"一边先耗尽"。③ <b>快排随机数据 18 次最快，但已排序/逆序都飙到 36 次</b>，' +
      '正好是 n(n-1)/2 的退化值，这就是"固定端点基准 + 有序输入 = 最坏情况"。<br>' +
      '这组实验值虽然小（n = 9），但趋势与理论一致；n 越大，n log n 与 n² 的差距越明显。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 案例 A', html: '能解释"为什么这里必须用稳定排序"，并说出二分查排名返回的 index 代表什么。' },
      { title: '检查点 · 案例 B', html: '能读出"选择排序恒 36、快排在有序/逆序退化"分别对应哪个理论结论。' }
    ] },

    { t: 'h', text: '教材对照：§4.2 排序与查找', id: 'ch11-book' },

{ t: 'table',
      head: ['算法', '最好情况', '平均 / 最坏', '额外空间', '稳定'],
      rows: [
        ['插入排序', 'n（已经有序）', 'n²', '几格变量', '稳定'],
        ['归并排序', 'n log n', 'n log n', 'n', '稳定'],
        ['二分查找（有序数组）', '1', 'log n', '几格变量', '不适用']
      ],
      caption: '教材的对比表与本章一致：n log n 的排序在大规模数据上远快于 n²'
    },

{ t: 'code', caption: 'BinarySearchDemo.java —— 教材 §4.2：先用插入排序整理，再用二分查找定位', code:
`public class Q {
    static int search(int[] a, int key) {
        int lo = 0, hi = a.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] < key) lo = mid + 1;
            else if (a[mid] > key) hi = mid;
            else return mid;
        }
        return -1;
    }
    static void insertionSort(int[] a) {
        for (int i = 1; i < a.length; i++) {
            int key = a[i], j = i - 1;
            while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; }
            a[j + 1] = key;
        }
    }
    public static void main(String[] args) {
        int[] a = {5, 2, 9, 1, 7};
        insertionSort(a);
        for (int i = 0; i < a.length; i++) {
            if (i > 0) System.out.print(" ");
            System.out.print(a[i]);
        }
        System.out.println();
        System.out.println(search(a, 7) + " " + search(a, 3));
    }
}
` },

    { t: 'p', html:
      "教材 §4.2 从「二十问」游戏讲起：每问把候选范围砍一半，20 问就能在 100 万个数里锁定答案——这就是二分查找。接着用「整理扑克牌」解释插入排序：左手始终有序，每张新牌插到正确位置。最后讲归并排序：分成两半、各自排好、再合并。<br><br>输出 <code>1 2 5 7 9</code> 和 <code>3 -1</code>。7 在排序后数组的下标 3；3 不存在，返回 -1。注意二分查找返回的是「排序后数组里的下标」，不是原始下标——这是教材反复强调的使用前提：<b>数组必须有序</b>。<br><br>教材 §4.2 还给了一个「排序稳定性」的判定方法：看排序过程中相等元素的相对顺序会不会被打乱。插入排序把元素插到「第一个比它大的元素前面」，相等元素不会被越过，所以稳定；选择排序把最小元素换到前面时可能跨过相等元素，所以不稳定；归并在合并时「相等先取左边」，所以稳定。<br><br>教材 §4.2 还比较了归并与快排的分工：归并是「先分到最小、再合并有序段」，快排是「先分区、再递归处理两段」；归并的合并阶段稳定且可预测，快排的分区原地但不稳定。教材的实测显示：随机数据上快排通常更快（常数小、访问局部性好），但已排序/逆序数据上会退化到 O(n²)；归并始终 O(n log n)，代价是 O(n) 额外数组。<br><br>教材最后给出一个经验法则：n 小于几十时，插入排序往往比归并更快（常数小、无额外数组）；n 大了才需要 O(n log n) 的算法。工程上常把两者结合：小段用插入排序，大段用归并，这也是 Java 对对象排序的实现思路之一。"
    },

    { t: 'callout', kind: 'note', title: '教材 Q&A：区间为什么写成 [lo, hi)', html:
      "教材统一用左闭右开区间：<code>hi</code> 是第一个不看的元素，循环条件是 <code>lo &lt; hi</code>，初始 <code>hi = a.length</code> 也不会越界。<code>mid = lo + (hi - lo) / 2</code> 而不是 <code>(lo + hi) / 2</code>，是为了在超大数组上避免 <code>lo + hi</code> 溢出——和第 02 章讲过的整数溢出是同一个坑。<br><br>① 在无序数组上用，结果随机错；② 用 <code>(lo + hi) / 2</code> 在超大数组上溢出。它还给了「查找第一个 ≥ key 的位置」这种变体，思路仍是维护 <code>[lo, hi)</code> 不变式，只是判断条件改成 <code>a[mid] &lt; key</code>。<br><br>实际工程里先用库函数（Java 的 <code>Arrays.sort</code> 对基本类型用双轴快排、对对象用归并/TimSort），自己实现排序主要是为了理解「为什么它快/慢」和「什么时候会退化」。"
    },

    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch11-q1' },
    { t: 'quiz', qid: 'ch11-q2' },
    { t: 'quiz', qid: 'ch11-q3' },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      '三种题型、三档分值：<br>' +
      '① <b>手写/补全排序</b>（Mock A Q6）：给你选择排序或插入排序的骨架，填内层循环与边界；' +
      '或问"把比较符反过来输出什么"（答案降序）。<br>' +
      '② <b>排序过程追踪</b>（F 卷常考）：给一个 6–8 个元素的数组，问"第 3 轮后数组长什么样"或"一共比较多少次"。' +
      '要点：先画"已排序区 | 未排序区"两段，再逐轮写状态；选择排序看"每轮最小值的下标"，插入排序看"每轮插到哪"。<br>' +
      '③ <b>二分查找大题</b>（Mock A Q9，15 分）：降序数组 + 问比较次数 + 问"最大的可能的输出值"。' +
      '步骤：先写下标 0..n-1，再逐轮写 lo / hi / mid 和比较的元素，最后回答问的边界值。<br>' +
      '<b>看到这类题先做什么</b>：不要急着算最终答案，先画数组分区（已排/未排）和二分区间（lo..hi），' +
      '把每一轮的状态写成一行。状态表对了，答案和解释都能直接抄下来。'
    },

    { t: 'keypoint', items: [
      { title: '算法 vs 实现', html: '算法是步骤，实现是代码；评价看比较/移动次数怎么随 n 增长。' },
      { title: '选择排序', html: '每轮找最小放前面；比较恒为 n(n-1)/2，交换 ≤ n−1，无适应性、不稳定。' },
      { title: '插入排序', html: '维护有序前缀；已有序 n−1 次、逆序 n(n-1)/2 次；有适应性、稳定。' },
      { title: '归并排序', html: '分治 + 合并；恒 n log n、稳定，但要 O(n) 辅助空间。' },
      { title: '快速排序', html: '选基准分区再递归；平均 n log n、原地，最坏 n²、不稳定。' },
      { title: '稳定性', html: '相等元素是否保序；插入/归并稳定，选择/快排不稳定。' },
      { title: '查找', html: '线性 O(n) 不要求有序；二分 O(log n) 要求有序 + 随机访问，<code>lo <= hi</code>、mid 防溢出。' },
      { title: '调试', html: '用"轮次 / lo / hi / mid / 数组状态"追踪表；测试覆盖第一个、最后一个、不存在。' }
    ] },

    { t: 'checklist', id: 'ch11', items: [
      '我能不看资料写出选择排序与插入排序',
      '我能说出选择排序和插入排序在什么数据上表现不同',
      '我能画出归并排序的合并过程，并写出 merge 的双指针循环',
      '我能解释快排的 partition 在做什么，以及它为什么会退化',
      '我能手写二分查找并说明为什么必须有序',
      '我能说出四种排序里哪两个是稳定的，并解释原因',
      '我能说明二分循环条件写成 lo < hi 会漏掉哪个元素',
      '我能解释 mid = (lo + hi) / 2 为什么会溢出',
      '我能判断排序方法有没有改掉调用者的数组'
    ] },

    { t: 'p', html:
      '<b>延伸阅读</b>：教材 Sedgewick《Computer Science: An Interdisciplinary Approach》第 4.2 节（Sorting）与 ' +
      '第 4.3 节（Searching）；站内第 12 章「递归」（归并/快排的递归结构）、第 13 章「复杂度」（本章的 n log n 与 n² 会正式定义）。' +
      '动手可以到 <a href="#/labs/sorting">实验台 · 排序动画</a> 和 <a href="#/labs/search">实验台 · 查找动画</a> 对照单步；' +
      '练习到 <a href="#/quiz/ch11">题库 · ch11</a> 按章节筛选。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '让 AI 写排序毫无意义——它背得比你好。值得做的是：① 让它给同一个数组分别用四种排序打印每一轮状态，' +
      '你对照本站实验台的动画检查；② 问它"输入已经有序时，四种排序各要比较多少次"，然后用手算和案例 B 的程序验证；' +
      '③ 让它出一段有 bug 的二分查找，你负责找出漏掉最后一个元素的那个版本；④ 让它解释"为什么 Java 的 Arrays.sort ' +
      '对基本类型和对象数组用不同算法"，并追问"如果对对象数组用快排，会有什么可观察的后果"。' +
      '凡是它给的次数，都用本章的比较计数器跑一遍——数字对不上，就是它在编。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：算法：算法与实现、选择/插入/归并/快速排序的逐轮追踪、稳定性、线性与二分查找、比较次数、选型与调试边界。<br>依据：Course Outline v5 的 Algorithms (Sorting / Searching / Strategies) 部分；Sedgewick §4.2–4.3。本站为个人整理的学习材料，与课程要求冲突时以老师和课程大纲为准；代码均在真实 JDK 上校验过。' }

  ]
});