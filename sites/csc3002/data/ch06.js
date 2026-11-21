/* =====================================================================
 * ch06.js · 第 6 章「STL 与算法：容器、迭代器与算法库」
 * 依据：讲义 Chapter 05（Collections）、Chapter 15（Maps）、Chapter 17（Sets）、
 *       Chapter 10（Algorithmic Analysis）、Tutorial 03（bracketMatching / postFixEval）。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch06',
  num: '06',
  title: 'STL 与算法：容器、迭代器与算法库',
  en: 'STL & ALGORITHMS',
  goals: [
    '说出 STL 三个部件（容器、迭代器、算法）各自的职责与连接方式',
    '按访问模式、增删位置、是否需要有序，在 vector/list/map/set 中做出选择',
    '解释迭代器失效的三种典型场景，并写出安全的删除写法',
    '用 sort、find_if、accumulate、transform 加 lambda 完成一次数据处理',
    '估算常见容器操作的时间复杂度，并据此判断一段代码会不会超时'
  ],
  kp: [
    { id: 'ch06-1', title: 'STL 的三个部件' },
    { id: 'ch06-2', title: '序列容器：vector、list、deque' },
    { id: 'ch06-3', title: '关联容器：map、set 与哈希版' },
    { id: 'ch06-4', title: '迭代器：容器的通用游标' },
    { id: 'ch06-5', title: '算法库：不写循环也能处理数据' },
    { id: 'ch06-6', title: 'lambda 与函数对象' },
    { id: 'ch06-7', title: '容器适配器：stack、queue、priority_queue' },
    { id: 'ch06-8', title: '选型、复杂度与一个完整的例子' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '不要自己造容器', html: '第 3 章你手写了 <code>IntVector</code>，第 5 章把它模板化。手写的价值是理解原理，但正式代码里不该再用它：标准库的 <code>vector</code> 经过几十年优化，异常安全、迭代器、分配器全都考虑过。<b>这一章的任务是从「会造」切换到「会选、会用」</b>：知道 vector 和 list 各自适合什么场景，知道 map 的 key 为什么要能比较，知道迭代器什么时候会失效。选错了容器，算法再漂亮也慢十倍。' },

    { t: 'p', lead: true, html: 'STL（Standard Template Library）是 C++ 标准库的核心，它的设计有一条清晰的分工：<b>容器</b>负责存，<b>迭代器</b>负责指，<b>算法</b>负责算。三者通过统一的接口拼在一起，所以 <code>std::sort</code> 既能排 <code>vector</code> 也能排 <code>deque</code>，还能排普通数组——它只要求「你给我一对能前后移动的迭代器」。理解这条分工，比背下所有函数名重要得多。' },

    { t: 'h', lvl: 2, text: '一、STL 的三个部件', id: 'ch06-1' },

    { t: 'p', html: '容器是数据结构：<code>vector</code> 是动态数组，<code>list</code> 是双向链表，<code>map</code> 是平衡树，<code>unordered_map</code> 是哈希表。迭代器是「指向容器元素的对象」，支持 <code>*it</code>、<code>++it</code>、<code>it != end</code> 这些操作，行为像指针。算法是模板函数：<code>sort</code>、<code>find</code>、<code>count</code>、<code>transform</code>，它们只依赖迭代器接口，不依赖具体容器。' },

    { t: 'flow', dir: 'row', nodes: [
      { title: '容器', desc: 'vector / map / set' },
      { title: '迭代器', desc: 'begin() / end()' },
      { title: '算法', desc: 'sort / find / count' },
      { title: '结果', desc: '写回或返回迭代器' }
    ] },

    { t: 'p', html: '这个设计的妙处在于<b>组合爆炸被避免了</b>。假设有 m 种容器、n 种算法，如果每个算法都为每种容器写一遍，需要 m×n 个实现；有了迭代器这层抽象，只需要 m 个容器 + n 个算法。标准库有十几个容器、上百个算法，靠的就是这一层解耦。' },

    { t: 'code', lang: 'cpp', caption: '同一套算法作用于不同容器', code: `#include <algorithm>
#include <iostream>
#include <list>
#include <vector>

int main() {
    std::vector<int> v = {3, 1, 4, 1, 5};
    std::list<int>   l = {3, 1, 4, 1, 5};

    std::cout << std::count(v.begin(), v.end(), 1) << "\\n";  // 2
    std::cout << std::count(l.begin(), l.end(), 1) << "\\n";  // 2

    int arr[5] = {3, 1, 4, 1, 5};
    std::cout << std::count(arr, arr + 5, 1) << "\\n";        // 2
}` },

    { t: 'h', lvl: 2, text: '二、序列容器：vector、list、deque', id: 'ch06-2' },

    { t: 'p', html: '序列容器按位置存元素，顺序由你决定。<code>vector</code> 是连续内存的动态数组，随机访问 O(1)，尾部追加均摊 O(1)，中间插入 O(n)；<code>list</code> 是双向链表，任意位置插入删除 O(1)，但访问第 n 个要 O(n)；<code>deque</code> 是分段连续，两端插入删除都快。<b>默认选 vector</b>，除非你有明确理由。' },

    { t: 'code', lang: 'cpp', caption: 'vector 的常用操作', code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> v;                 // 空
    v.push_back(10);
    v.push_back(20);
    v.emplace_back(30);                 // 原地构造，少一次拷贝

    v.insert(v.begin(), 5);             // 头部插入：O(n)
    v.erase(v.begin() + 1);             // 删除第二个元素

    std::cout << v.size() << " " << v.capacity() << "\\n";
    std::cout << v.front() << " " << v.back() << "\\n";

    v.resize(10);                        // 补 0 到 10 个
    v.clear();                           // 清空，容量不变
}` },

    { t: 'p', html: '<code>size()</code> 是元素个数，<code>capacity()</code> 是已分配空间能放几个。两者分开是为了避免每次 push 都重新分配：容量不够时通常翻倍，把旧元素搬过去。所以 <code>push_back</code> 单次可能是 O(n)，但 n 次总代价 O(n)，叫<b>均摊 O(1)</b>。如果你预先知道要存多少，用 <code>v.reserve(n)</code> 一次分配好，能省掉所有搬移。' },

    { t: 'p', html: '<code>list</code> 的优势只在「已知位置、频繁插删」。而且它的每个节点都有前后指针，内存开销大约是元素的两倍，缓存局部性也差——遍历一个装 100 万个 int 的 list，通常比 vector 慢好几倍，因为每次都要跳内存。这就是为什么「链表插入 O(1)」在真实场景里经常打不过 vector。' },

    { t: 'table', head: ['操作', 'vector', 'list', 'deque'], rows: [
      ['随机访问 <code>v[i]</code>', 'O(1)', 'O(n)', 'O(1)'],
      ['尾部插入', '均摊 O(1)', 'O(1)', 'O(1)'],
      ['头部插入', 'O(n)', 'O(1)', 'O(1)'],
      ['中间插入（已知迭代器）', 'O(n)', 'O(1)', 'O(n)'],
      ['内存连续性', '连续', '分散', '分段连续'],
      ['迭代器失效', '扩容后全部失效', '只有被删的那个失效', '两端插入可能失效']
    ], caption: '默认 vector；确实需要频繁在中间插删、且元素很大时再考虑 list' },

    { t: 'h', lvl: 2, text: '三、关联容器：map、set 与哈希版', id: 'ch06-3' },

    { t: 'p', html: '关联容器按 key 组织数据，查找不靠遍历。<code>map&lt;K, V&gt;</code> 存键值对，<code>set&lt;K&gt;</code> 只存 key。<code>map</code> 和 <code>set</code> 底层是红黑树，有序，查找 O(log n)；<code>unordered_map</code> 和 <code>unordered_set</code> 底层是哈希表，无序，平均 O(1)，最坏 O(n)。' },

    { t: 'code', lang: 'cpp', caption: 'map 的插入、查找与遍历', code: `#include <iostream>
#include <map>
#include <string>

int main() {
    std::map<std::string, int> age;

    age["Alice"] = 20;                 // 不存在则插入默认值再赋值
    age.insert({"Bob", 22});           // 已存在则不覆盖
    age.emplace("Carol", 21);

    if (age.count("Alice")) {          // 是否存在
        std::cout << age["Alice"] << "\\n";
    }

    auto it = age.find("Dave");
    if (it == age.end()) {
        std::cout << "not found\\n";
    }

    for (const auto& [name, a] : age) {   // C++17 结构化绑定
        std::cout << name << " " << a << "\\n";
    }
}` },

    { t: 'p', html: '有一个坑必须记住：<b><code>operator[]</code> 会在 key 不存在时插入一个默认值</b>。所以「查询某个 key 是否存在」不能用 <code>m[key]</code>，要用 <code>find</code> 或 <code>count</code>。更隐蔽的是在循环里用 <code>m[k]</code> 判断，结果 map 越查越大，最后内存爆掉。' },

    { t: 'p', html: '如果 value 没有默认构造函数，<code>operator[]</code> 根本编译不过，这时用 <code>at()</code>（不存在会抛 <code>out_of_range</code>）或 <code>find()</code>。C++17 还有 <code>insert_or_assign</code> 和 <code>try_emplace</code>，语义更明确，推荐在写新代码时使用。' },

    { t: 'table', head: ['容器', '底层', '是否有序', '查找', '什么时候用'], rows: [
      ['<code>map</code> / <code>set</code>', '红黑树', '按 key 升序', 'O(log n)', '需要有序遍历、范围查询'],
      ['<code>unordered_map</code> / <code>unordered_set</code>', '哈希表', '无序', '平均 O(1)', '只做查找计数、不在乎顺序'],
      ['<code>multimap</code> / <code>multiset</code>', '红黑树', '有序', 'O(log n)', '允许重复 key'],
      ['<code>vector</code> + 排序 + 二分', '连续数组', '手动维护', '排序 O(n log n)，查 O(log n)', '数据静态、查询极多']
    ], caption: '需要顺序就 map，只查不计顺序就 unordered_map；后者要提供哈希函数' },

    { t: 'p', html: '<code>map</code> 的 key 必须能比较：默认用 <code>operator&lt;</code>。自定义类型做 key，要么重载 <code>&lt;</code>，要么传一个比较器作为第三个模板参数。<code>unordered_map</code> 的 key 必须能哈希：标准库为 int、string 等内置类型提供了 <code>std::hash</code>，自定义类型需要自己特化，或者传哈希函数对象。' },

    { t: 'h', lvl: 2, text: '四、迭代器：容器的通用游标', id: 'ch06-4' },

    { t: 'p', html: '迭代器是「泛化的指针」。它支持 <code>*it</code> 取值、<code>++it</code> 前进、<code>it != end()</code> 判断结束。<code>begin()</code> 指向第一个元素，<code>end()</code> 指向「最后一个元素的下一位」——注意它<b>不指向任何元素</b>，解引用它是未定义行为。这个「半开区间」<code>[begin, end)</code> 是 STL 的统一约定，所有算法都按它工作。' },

    { t: 'code', lang: 'cpp', caption: '四种遍历写法，从迭代器到范围 for', code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> v = {10, 20, 30};

    for (std::vector<int>::iterator it = v.begin(); it != v.end(); ++it)
        std::cout << *it << " ";

    for (auto it = v.begin(); it != v.end(); ++it)
        std::cout << *it << " ";

    for (int x : v)
        std::cout << x << " ";

    for (const auto& x : v)          // 大对象用 const 引用
        std::cout << x << " ";
}` },

    { t: 'p', html: '迭代器分五类：输入、输出、前向、双向、随机访问。能力逐级增强：<code>vector</code> 的迭代器是随机访问，支持 <code>it + n</code>、<code>it[n]</code>、<code>&lt;</code> 比较；<code>list</code> 的只是双向，只能 <code>++</code>/<code>--</code>，不能加数字。算法会按需要的最低类别声明，所以 <code>std::sort</code> 要求随机访问迭代器——<b>这就是 list 不能 sort 的原因</b>，它有自己的成员函数 <code>l.sort()</code>。' },

    { t: 'p', html: '迭代器失效是 STL 最危险的坑。三种典型场景：<b>①</b> <code>vector</code> 扩容后，所有迭代器、指针、引用全部失效（内存搬走了）；<b>②</b> <code>erase</code> 之后，被删元素的迭代器失效，后面的也可能失效；<b>③</b> 在遍历中插入元素，可能让当前迭代器失效。' },

    { t: 'code', lang: 'cpp', caption: '遍历中删除元素的正确写法', code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> v = {1, 2, 3, 4, 5, 6};

    // 错误：erase 后 it 失效，++it 是未定义行为
    // for (auto it = v.begin(); it != v.end(); ++it)
    //     if (*it % 2 == 0) v.erase(it);

    // 正确：用 erase 的返回值接住下一个位置
    for (auto it = v.begin(); it != v.end(); ) {
        if (*it % 2 == 0) it = v.erase(it);
        else              ++it;
    }

    for (int x : v) std::cout << x << " ";   // 1 3 5
    std::cout << "\\n";
}` },

    { t: 'p', html: 'C++20 有 <code>std::erase_if</code>，一行就能完成上面的逻辑：<code>std::erase_if(v, [](int x){ return x % 2 == 0; })</code>。如果环境支持，优先用它；不支持就记住「erase 返回下一个有效迭代器」这个规则。' },

    { t: 'h', lvl: 2, text: '五、算法库：不写循环也能处理数据', id: 'ch06-5' },

    { t: 'p', html: '<code>&lt;algorithm&gt;</code> 里有上百个算法，常用的其实就十来个。它们的共同点是：接受一对迭代器表示范围，返回迭代器或值，不改变容器结构。<b>先查有没有现成的算法，再考虑手写循环</b>，这是写出简洁 C++ 的关键。' },

    { t: 'table', head: ['算法', '作用', '返回'], rows: [
      ['<code>std::find</code>', '找第一个等于给定值的元素', '迭代器（找不到返回 end）'],
      ['<code>std::find_if</code>', '找第一个满足条件的元素', '迭代器'],
      ['<code>std::count</code> / <code>count_if</code>', '统计满足条件的个数', '整数'],
      ['<code>std::sort</code>', '排序（要求随机访问迭代器）', 'void'],
      ['<code>std::accumulate</code>', '累加（在 <code>&lt;numeric&gt;</code>）', '累加结果'],
      ['<code>std::transform</code>', '对每个元素做映射，写到另一处', '输出迭代器'],
      ['<code>std::min_element</code> / <code>max_element</code>', '找最小/最大', '迭代器'],
      ['<code>std::any_of</code> / <code>all_of</code> / <code>none_of</code>', '存在/全部/没有满足条件', 'bool']
    ], caption: '会这八个，日常数据处理基本不用写 for 循环' },

    { t: 'code', lang: 'cpp', caption: '一段完整的数据处理：筛选、变换、求和', code: `#include <algorithm>
#include <iostream>
#include <numeric>
#include <vector>

int main() {
    std::vector<int> v = {1, 2, 3, 4, 5, 6, 7, 8};

    int evens = std::count_if(v.begin(), v.end(),
                              [](int x) { return x % 2 == 0; });

    std::vector<int> squares;
    std::transform(v.begin(), v.end(), std::back_inserter(squares),
                   [](int x) { return x * x; });

    int sum = std::accumulate(squares.begin(), squares.end(), 0);

    auto it = std::max_element(v.begin(), v.end());

    std::cout << evens << " " << sum << " " << *it << "\\n";  // 4 204 8
}` },

    { t: 'p', html: '注意 <code>std::back_inserter</code>：它返回一个「插入迭代器」，每次赋值就 push_back 一个元素，所以 <code>transform</code> 能往空 vector 里写。<b>直接传 <code>squares.begin()</code> 是错的</b>，因为空 vector 没有可写的元素，会越界。这个坑几乎每个初学者都踩过。' },

    { t: 'p', html: '<code>std::accumulate</code> 的第三个参数是初值，它的类型决定了返回类型。写 <code>0</code> 就是 int 累加；如果元素是 <code>double</code>，要写 <code>0.0</code>，否则小数部分会被截断。这个细节在考试和作业里都容易被扣分。' },

    { t: 'h', lvl: 2, text: '六、lambda 与函数对象', id: 'ch06-6' },

    { t: 'p', html: '算法需要「把一段逻辑作为参数传进去」，lambda 就是写这段逻辑最方便的方式。它的完整形式是 <code>[捕获列表](参数) -&gt; 返回类型 { 函数体 }</code>，返回类型通常可以省略。捕获列表决定 lambda 能访问外部哪些变量：<code>[]</code> 什么都不捕获，<code>[&amp;]</code> 按引用捕获全部，<code>[=]</code> 按值捕获全部，<code>[x, &amp;y]</code> 混合。' },

    { t: 'code', lang: 'cpp', caption: '捕获列表的三种常见用法', code: `#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v = {5, 2, 9, 1, 7};
    int threshold = 4;

    int above = std::count_if(v.begin(), v.end(),
                              [threshold](int x) { return x > threshold; });

    int total = 0;
    std::for_each(v.begin(), v.end(), [&total](int x) { total += x; });

    std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });

    std::cout << above << " " << total << "\\n";   // 3 24
    for (int x : v) std::cout << x << " ";          // 9 7 5 2 1
}` },

    { t: 'p', html: '按值捕获是<b>拷贝</b>，lambda 内部改它不影响外面；按引用捕获能改外面，但要小心生命周期——如果 lambda 被存起来、晚于变量销毁才调用，就是悬垂引用。异步回调里这条尤其致命，所以「能按值就按值，确实要改再按引用」。' },

    { t: 'p', html: '<code>mutable</code> 可以让按值捕获的变量在 lambda 内被修改（改的是副本）。这个关键字用得很少，看到时知道含义即可。lambda 的本质是编译器生成的一个匿名函数对象类，捕获的变量成了它的成员，<code>operator()</code> 是调用入口——理解这一点，就能解释为什么 lambda 有类型但类型名无法写出（要用 <code>auto</code> 接）。' },

    { t: 'compare', left: { title: '函数指针', html: '<code>bool cmp(int a, int b)</code> 只接受无捕获的函数，无法携带额外状态（比如阈值），语法也啰嗦。' }, right: { title: 'lambda', html: '能捕获外部变量，写在使用处，可读性最好；无捕获的 lambda 还能退化成函数指针，兼容老接口。' } },

    { t: 'h', lvl: 2, text: '七、容器适配器：stack、queue、priority_queue', id: 'ch06-7' },

    { t: 'p', html: '适配器不是新容器，而是给已有容器换一套接口。<code>stack</code> 只允许在一端进出，<code>queue</code> 先进先出，<code>priority_queue</code> 每次取最大。它们默认用 <code>deque</code> 做底层，也可以指定 <code>vector</code> 或 <code>list</code>。' },

    { t: 'code', lang: 'cpp', caption: '用 stack 做括号匹配（课程 Tutorial 03 的经典题）', code: `#include <iostream>
#include <stack>
#include <string>

bool balanced(const std::string& s) {
    std::stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else if (c == ')' || c == ']' || c == '}') {
            if (st.empty()) return false;
            char open = st.top();
            st.pop();
            if ((c == ')' && open != '(') ||
                (c == ']' && open != '[') ||
                (c == '}' && open != '{')) return false;
        }
    }
    return st.empty();
}

int main() {
    std::cout << balanced("{[()]}") << "\\n";   // 1
    std::cout << balanced("([)]")   << "\\n";   // 0
}` },

    { t: 'p', html: '这段代码体现了栈的本质：<b>最近遇到的左括号，必须最先被匹配</b>。每读一个右括号，就检查栈顶是不是对应的左括号；全部读完还要确认栈为空（否则有没闭合的）。用 vector 也能实现，但 <code>stack</code> 的接口（<code>push</code>/<code>top</code>/<code>pop</code>）更贴合问题，也防止你手滑访问中间元素。' },

    { t: 'p', html: '<code>priority_queue</code> 默认是最大堆，取 <code>top()</code> 得到当前最大值。<b>它没有迭代器</b>，不能遍历，只能不断 pop。要最小堆得写 <code>priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt;</code>，这个冗长的写法值得背下来。第 7 章会用它做「Top-K」的例子。' },

    { t: 'h', lvl: 2, text: '八、选型、复杂度与一个完整的例子', id: 'ch06-8' },

    { t: 'p', html: '选容器只需问三个问题：<b>①</b> 需不需要按 key 查找？需要就用 map/set，不需要就往下。<b>②</b> 主要在两端操作还是中间？两端用 deque，中间频繁插删用 list，其余用 vector。<b>③</b> 需不需要有序？需要就用有序版本，不需要用哈希版本。三个问题问完，选择基本唯一。' },

    { t: 'table', head: ['需求', '首选', '避免'], rows: [
      ['存一批数、频繁遍历', '<code>vector</code>', '<code>list</code>（缓存不友好）'],
      ['按名字查分数', '<code>unordered_map</code>', '线性查找 vector'],
      ['按分数排名输出', '<code>map</code> 或排序后的 vector', '<code>unordered_map</code>（无序）'],
      ['频繁在中间插入删除', '<code>list</code>', '<code>vector</code>（O(n) 搬移）'],
      ['括号匹配 / 撤销', '<code>stack</code>', '手动维护下标'],
      ['每次取最大', '<code>priority_queue</code>', '每次 sort 一遍'],
      ['固定大小、编译期已知', '<code>std::array</code>', '裸数组（会退化）']
    ], caption: '选错容器是最常见的性能问题，比算法写错更难发现' },

    { t: 'p', html: '把本章所有东西合起来，做一个「统计词频并输出前 K 名」的完整程序。它用到了 <code>unordered_map</code> 计数、<code>vector</code> 排序、lambda 自定义比较——正好是第 0 章那个例子的升级版。' },

    { t: 'code', lang: 'cpp', caption: '词频 Top-K：容器 + 算法 + lambda', code: `#include <algorithm>
#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>

int main() {
    std::unordered_map<std::string, int> freq;
    std::string word;
    while (std::cin >> word) {
        ++freq[word];
    }

    std::vector<std::pair<std::string, int>> items(freq.begin(), freq.end());
    std::sort(items.begin(), items.end(),
              [](const auto& a, const auto& b) {
                  if (a.second != b.second) return a.second > b.second;
                  return a.first < b.first;      // 次数相同按字典序
              });

    const int k = 3;
    for (int i = 0; i < k && i < static_cast<int>(items.size()); ++i) {
        std::cout << i + 1 << ". " << items[i].first
                  << " (" << items[i].second << ")\\n";
    }
}` },

    { t: 'p', html: '复杂度：计数平均 O(n)，排序 O(m log m)（m 是不同单词数），总 O(n + m log m)。如果 m 很大而只要前 10 名，可以用 <code>priority_queue</code> 维护一个大小为 10 的最小堆，复杂度降到 O(n log 10)——这就是「Top-K 用堆」的标准解法，也是作业里常考的优化点。' },

    { t: 'callout', kind: 'exam', title: '考试怎么考 STL', html: '很少考函数签名，常考三件事：<b>①</b> 给场景选容器并说明理由（要写复杂度）；<b>②</b> 读一段用 STL 的代码写输出（重点看 <code>map::operator[]</code> 的插入行为、<code>erase</code> 的返回值、<code>accumulate</code> 的初值类型）；<b>③</b> 用算法 + lambda 重写一段循环。第 ③ 类只要写对 <code>sort</code> 的比较器和 <code>find_if</code> 的条件，基本满分。' },

    { t: 'terms', items: [
      { en: 'container', zh: '容器', html: '存元素的类模板，分序列容器（vector/list/deque）与关联容器（map/set）。' },
      { en: 'iterator', zh: '迭代器', html: '指向容器元素的泛化指针，支持 <code>*</code>、<code>++</code>、<code>!=</code>；半开区间 <code>[begin, end)</code>。' },
      { en: 'amortized O(1)', zh: '均摊常数时间', html: '单次可能 O(n)，但 n 次操作总代价 O(n)，平均下来每次 O(1)；vector 扩容即如此。' },
      { en: 'iterator invalidation', zh: '迭代器失效', html: '容器结构改变后旧迭代器不再有效；vector 扩容、erase、insert 都可能触发。' },
      { en: 'lambda', zh: '匿名函数', html: '<code>[捕获](参数){ 体 }</code>，编译器生成一个函数对象类；捕获方式决定能否访问外部变量。' },
      { en: 'container adapter', zh: '容器适配器', html: 'stack、queue、priority_queue：在已有容器上换一套受限接口。' }
    ] },

    { t: 'quiz', qid: 'ch06-q1' },
    { t: 'quiz', qid: 'ch06-q2' },
    { t: 'quiz', qid: 'ch06-q3' },

    { t: 'keypoint', items: [
      { title: '容器存、迭代器指、算法算', html: '三者靠迭代器解耦，所以一套算法能用于所有容器和裸数组。' },
      { title: '默认 vector，有理由才换', html: '连续内存带来缓存优势；list 只在已知位置频繁插删时才有优势。' },
      { title: 'map 的 [] 会插入', html: '查存在用 <code>find</code>/<code>count</code>；需要有序用 map，只查不计序用 unordered_map。' },
      { title: 'erase 返回下一个有效迭代器', html: '遍历中删除必须接住返回值，否则 ++ 已失效的迭代器是未定义行为。' },
      { title: '算法优先于手写循环', html: '<code>count_if</code>、<code>transform</code>、<code>accumulate</code> 配 lambda 能覆盖八成数据处理。' }
    ] },

    { t: 'checklist', id: 'ch06', items: [
      '我能说出 STL 三个部件各自负责什么，以及它们怎样连接',
      '我能比较 vector 与 list 在随机访问、插入、缓存上的差异',
      '我知道 vector 的 size 与 capacity 的区别，以及 reserve 的作用',
      '我能解释 map 的 operator[] 为什么会插入元素，并给出正确的查询写法',
      '我知道 map 与 unordered_map 的底层结构和复杂度差别',
      '我能写出遍历中安全删除元素的代码，并说明为什么原写法错',
      '我能用 sort + lambda 按自定义规则排序一组结构体',
      '我知道 back_inserter 的作用，以及直接传 begin() 会出什么问题',
      '我能用 stack 写出括号匹配，并说出为什么这里适合用栈'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应讲义 Chapter 05（Collections）、Chapter 15（Maps）、Chapter 17（Sets）与 Chapter 10（Algorithmic Analysis）的复杂度部分，括号匹配与后缀表达式求值参考课程 Tutorial 03 的 <code>bracketMatching.cpp</code> 与 <code>postFixEval.cpp</code>。树、图、堆的内部实现（Chapter 16、18）本章只讲接口与复杂度，不展开节点旋转与遍历实现；需要时可在资料库查阅对应讲义压缩包。示例代码在 g++ -std=c++17 下编译运行。下一章处理最后一块拼图：出错时怎么办、资源怎么自动归还、拷贝能不能变成移动。' }
  ]
});
