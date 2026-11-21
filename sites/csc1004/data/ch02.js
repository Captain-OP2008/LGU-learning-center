/* =====================================================================
 * data/ch02.js · 第 02 章：AI 辅助编程：Vibe Coding（AI-Assisted Programming）
 * 职责：讲清 AI 编程助手是什么、LLM 如何生成代码、Vibe Coding 的对话式流程、
 *       课程「项目允许 / 期末禁止」的规则、需求写法、AI 代码审查、AI 辅助调试
 *       与典型误用场景。代码示例演示「编译过 ≠ 正确」，可在站内运行。
 * 依据：CSC1004 lecture1（AI-Assisted Programming: Vibe Coding）+ lecture0 评分规则。
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch02',
  num: '02',
  title: 'AI 辅助编程：Vibe Coding',
  en: 'AI-Assisted Programming',
  goals: [
    '能区分传统编程与 AI 编程的工作方式，说出 AI 助手擅长的四类任务',
    '能解释 LLM 为什么能写代码、又为什么会「自信地编错」',
    '能按「上下文 + 约束 + 验收标准」写出可执行的提示词',
    '能用边界、数值、并发、资源、契约、安全六维审查 AI 生成的代码',
    '能说出课程允许项目用 AI、但期末考严禁 AI 的规则与原因'
  ],
  kp: [
    { id: 'ch02-1', title: '传统编程 vs AI 编程' },
    { id: 'ch02-2', title: 'LLM 助手如何工作' },
    { id: 'ch02-3', title: 'Vibe Coding 是什么' },
    { id: 'ch02-4', title: '课程规则：项目允许、期末禁止' },
    { id: 'ch02-5', title: '怎么提需求：上下文、约束、验收标准' },
    { id: 'ch02-6', title: '审查 AI 代码：编译过 ≠ 对' },
    { id: 'ch02-7', title: '让 AI 帮你 debug' },
    { id: 'ch02-8', title: 'AI 用错的典型场景' }
  ],
  blocks: [

    /* ------------------------------------------------------------------ 开篇 */
    { t: 'callout', kind: 'why', html:
      '用 AI 十分钟写完 Project 1 的骨架，演示时却崩了——这是讲义里的真实场景：' +
      '<b>Finish Project 1 in ten minutes with vibe coding</b>。代码能编译、界面能开，可一到并发、一到边界输入就出问题。<br>' +
      '课程允许项目用 AI，期末又严禁 AI 与电子设备。两条规则合起来说明：<b>AI 可以帮你写，但你必须能判断它写得对不对</b>。' +
      '这一章讲怎么提需求、怎么审查、怎么用它 debug。'
    },

    { t: 'p', lead: true, html: '先看一段「AI 写的、能编译、但结果不对」的代码——这就是本章的核心问题。' },

    { t: 'code', caption: 'AiAverage.java · AI 生成的平均分代码：编译通过、运行不崩，答案却错了', run: true, code:
`public class AiAverage {
    public static void main(String[] args) {
        int[] scores = {88, 92, 79, 95};
        int sum = 0;
        for (int i = 0; i < scores.length; i++) {
            sum = sum + scores[i];
        }

        int average = sum / scores.length;
        System.out.println("average = " + average);   // 输出 88，不是 88.5
    }
}
` },

    { t: 'p', html:
      '运行结果是 <code>average = 88</code>：四个分数平均 88.5，程序给出 88，不报错也不崩溃，' +
      '因为 <code>sum / scores.length</code> 是<b>整数除法（integer division）</b>，小数被截掉。' +
      '这正是 AI 代码最典型的风险：<b>语法正确、逻辑合理、结果错误</b>。改成 <code>double average = sum / (double) scores.length;</code> 才得到 88.5。'
    },

    { t: 'terms', cols: 2, items: [
      { en: 'LLM', zh: '大语言模型', html: 'Large Language Model：从海量代码与文本里学出「下一个词」概率的模型。' },
      { en: 'prompt', zh: '提示词', html: '给 AI 的输入：需求、上下文、约束、验收标准都算。' },
      { en: 'vibe coding', zh: '氛围编程', html: '用自然语言和 AI 对话、实时生成与修改代码的工作方式。' },
      { en: 'boilerplate', zh: '样板代码', html: '结构重复、几乎不用动脑的代码，AI 最擅长。' },
      { en: 'hallucination', zh: '幻觉', html: 'AI 一本正经地编造不存在的 API、类或参数。' },
      { en: 'code review', zh: '代码审查', html: '逐项检查代码是否正确、健壮、可维护；对 AI 代码必不可少。' }
    ] },

    /* ------------------------------------------------------------------ 一、传统 vs AI */
    { t: 'h', text: '一、传统编程 vs AI 编程', id: 'ch02-1' },

    { t: 'p', html:
      '传统编程：自己设计、逐行手写、逐步调试；AI 编程：用自然语言描述意图，模型生成代码，你负责审查与修正。' +
      '讲义对照了两者的差异——编码方式（手写 vs 自动生成）、门槛（需深厚语法知识 vs 能帮初学者解释）、' +
      '调试（手动逐步 vs AI 实时建议）、效率（重复劳动耗时 vs 样板代码批量产出）。' +
      '隐含代价是：<b>AI 代码需要审查和修正</b>，控制力从「每一行」变成「关键行」。'
    },

    { t: 'compare', left: {
      title: '传统编程',
      html: '自己设计、逐行手写、逐步调试。每行可控，但样板代码耗时。'
    }, right: {
      title: 'AI 编程',
      html: '描述意图、AI 生成、人来审查。样板快，但产出必须验证。'
    } },

    /* ------------------------------------------------------------------ 二、LLM 如何工作 */
    { t: 'h', text: '二、LLM 助手如何工作', id: 'ch02-2' },

    { t: 'p', html:
      '<b>AI 编程助手（AI coding assistant）</b>是帮你写、读、调代码的工具，底座是<b>大语言模型（LLM，Large Language Model）</b>：' +
      '从海量源码与自然语言中训练，因此能理解语法模式、<b>预测下一行代码</b>、把自然语言翻译成代码、解释与重构代码。' +
      '本质是「按上下文预测下一个 token」，不是「查数据库找答案」。所以上下文越完整它猜得越准（讲义强调 <b>include all relevant background code</b>，信息越多歧义越少）；' +
      '没记准的 API 也会被流畅编出来——这就是<b>幻觉（hallucination）</b>。'
    },

    { t: 'callout', kind: 'warn', title: 'AI 不知道你的代码库', html:
      'AI 只能看到你贴的内容：不知道 <code>GomokuGame.move()</code> 返回什么，也不知道棋盘多大。' +
      '所以它生成的调用常「差一个参数」「用了不存在的方法」。对策：把相关类、方法签名、错误信息一起贴进去，别只写「帮我写个五子棋」。'
    },

    /* ------------------------------------------------------------------ 三、Vibe Coding */
    { t: 'h', text: '三、Vibe Coding 是什么', id: 'ch02-3' },

    { t: 'p', html:
      '<b>Vibe Coding</b>（氛围编程）是讲义的核心概念：与 LLM 实时协作，用自然语言规划—生成—修改代码的工作流。' +
      '它把编程变成对话：描述问题、要求算法、请求重构，AI 边生成边解释。' +
      '讲义用 DeepSeek 做案例，总结三项特质：<b>Natural Dialogue</b>（平实语言交流）、<b>Dynamic Feedback</b>（边生成边解释）、' +
      '<b>Context Awareness</b>（理解依赖、已有代码与项目目标）。'
    },

    { t: 'flow', nodes: [
      { title: '描述意图', desc: '用自然语言说清目标', kind: 'start' },
      { title: '生成代码', desc: 'AI 产出类与方法', kind: 'proc' },
      { title: '运行验证', desc: '编译 + 边界输入', kind: 'decide' },
      { title: '反馈修正', desc: '贴错误与差异再对话', kind: 'proc' },
      { title: '可提交', desc: '审查通过才算完成', kind: 'end' }
    ], dir: 'h' },

    { t: 'p', html:
      '讲义列出四项能力：<b>Code Understanding</b>、<b>Adaptive Debugging</b>、<b>Code Generation</b>、' +
      '<b>Refactoring Support</b>——四项里有两项是「理解与解释」，不是「替你写」。' +
      '讲义还有一句：<b>Learning from DeepSeek takes a longer time: Three to Four Weeks!</b>' +
      '十分钟生成骨架，真正搞懂要三到四周，这正是期末闭卷的原因。'
    },

    /* ------------------------------------------------------------------ 四、课程规则 */
    { t: 'h', text: '四、课程规则：项目允许、期末禁止', id: 'ch02-4' },

    { t: 'p', html:
      'lecture0 评分页写明：Java 项目 40%（各 20%）、Python 项目 20%、期末考 40%。两行英文必须记住：' +
      '项目 <b>The use of AI tools is permitted for completing projects</b>；期末 <b>The use of AI tools is strictly prohibited during the final exam</b>。' +
      '一边允许、一边严禁，是因为目标不同：项目考「能不能交付能跑的系统」，期末考「你脑子里有没有这些知识」。'
    },

    { t: 'compare', left: {
      title: '项目（占 60%）',
      html: 'AI 可用。评分看功能、可运行性与录像；答辩会问「这段为什么这么写」，你要对交上去的每一行负责。'
    }, right: {
      title: '期末考（占 40%）',
      html: 'AI 与电子设备一律禁止。四部分题型考的是能否手写、口述、读代码，与项目紧密相关。'
    } },

    { t: 'callout', kind: 'note', title: '允许用 AI 不等于可以不懂', html:
      '两条规则叠在一起，等于要求你「<b>用 AI 交付，同时能解释交付物</b>」。最稳的做法：' +
      '每段都问一句「为什么这么写、换一种写法会怎样」，答不上来的就是你要补的洞。'
    },

    /* ------------------------------------------------------------------ 五、怎么提需求 */
    { t: 'h', text: '五、怎么提需求：上下文、约束、验收标准', id: 'ch02-5' },

    { t: 'p', html:
      '同一个需求，差的提示词与好的提示词产出质量差一个数量级。讲义的建议是「提供完整相关代码与背景」，落地成三段式：' +
      '<b>上下文（context）</b>——项目是什么、已有类与方法签名；<b>约束（constraints）</b>——不能改什么、用什么数据结构、复杂度要求；' +
      '<b>验收标准（acceptance criteria）</b>——怎样算做对，最好给可运行的测试用例。' +
      '最后加一句「先说明设计思路再给代码」，能在代码生成前拦下方向错误。'
    },

    { t: 'code', caption: '提示词三段式模板（示意，不是可执行代码）', code:
`【上下文】
我正在写 CSC1004 的 Gomoku 控制台版。已有类 GomokuGame：
  - 字段 char[][] board，15x15，'+' 表示空位
  - 方法 boolean move(int r, int c, char stone)
我在 Main 里用 while 循环反复调用 move。

【约束】
- 不要改已有的 move() 签名与棋盘大小
- 不要引入第三方库，只用 JDK
- 每落一子后要检查胜负，不能每次全盘扫描

【验收标准】
- 给出 checkWin(int r, int c, char stone) 的完整实现
- 用 5x5 棋盘给出 3 个测试输入与期望输出：横五连、竖五连、无五连
- 先说明四个方向怎么查，再给代码` },

    { t: 'compare', left: {
      title: '差提示词',
      html: '一句话，信息不足，AI 只能靠猜；产出看似完整，接口与数据全不对，返工比重写还贵。'
    }, right: {
      title: '好提示词',
      html: '上下文、约束、验收标准齐全，产出可直接审查；甚至自带测试用例，改起来有据可依。'
    } },

    /* ------------------------------------------------------------------ 六、审查 AI 代码 */
    { t: 'h', text: '六、审查 AI 代码：编译过 ≠ 对', id: 'ch02-6' },

    { t: 'p', html:
      '编译器只检查语法与类型，<b>不检查逻辑</b>。AI 代码通常能过编译，审查要看六个维度：' +
      '<b>边界</b>（空数组、首尾、负数、满棋盘）、<b>数值</b>（整数除法、浮点比较、溢出）、' +
      '<b>并发</b>（多客户端同写一个集合）、<b>资源</b>（Socket、Scanner 是否关闭）、<b>契约</b>（签名、返回值、异常）、<b>安全</b>（用户输入拼进命令或路径）。每维配一个最小输入。'
    },

    { t: 'table',
      head: ['维度', 'AI 最常犯的错', '最小的验证方法'],
      rows: [
        ['边界', '循环少走/多走一步，空输入没处理', '空数组、单元素、满棋盘各跑一次'],
        ['数值', '整数除法截断、用 <code>==</code> 比 <code>double</code>', '手算一个小例子对答案'],
        ['并发', '多线程共享 <code>ArrayList</code> 不加锁', '开两个客户端同时发消息'],
        ['资源', '<code>Socket</code> / <code>Scanner</code> 用完不 <code>close()</code>', '长时间运行看句柄与内存'],
        ['契约', '重写签名不一致、乱返回 <code>null</code>', '对照接口声明逐个核对'],
        ['安全', '用户输入直接拼进命令或路径', '输入 <code>../</code> 等特殊字符试一次']
      ],
      caption: '六维审查表；前五条在 Chat Zoom 与 Gomoku 里都会真实出现' },

    { t: 'p', html:
      '再看一个更隐蔽的例子：两个玩家名字相同，用 <code>==</code> 比较却返回 <code>false</code>。' +
      '<code>==</code> 比的是引用地址，比较内容必须用重写过的 <code>equals()</code>——AI 常「按直觉」写 <code>==</code>，审查时专门盯这一条。'
    },

    { t: 'code', caption: 'AiCompare.java · AI 常把对象比较写成 ==，编译通过、结果错误', run: true, code:
`public class AiCompare {
    public static void main(String[] args) {
        Player a = new Player("Lin", 0);
        Player b = new Player("Lin", 0);

        System.out.println(a == b);                // false：比的是引用
        System.out.println(a.name == b.name);      // true：字符串常量池
        System.out.println(a.name.equals(b.name)); // true：比内容，推荐写法
    }
}

class Player {
    String name;
    int score;

    Player(String name, int score) {
        this.name = name;
        this.score = score;
    }
}
` },

    { t: 'callout', kind: 'warn', title: '三个「看起来没问题」的陷阱', html:
      '① <b>空安全</b>：<code>a[0]</code> 直接取首元素，数组为空就抛 <code>ArrayIndexOutOfBoundsException</code>；<br>' +
      '② <b>资源泄漏</b>：<code>Scanner</code>、<code>Socket</code>、<code>BufferedReader</code> 用完不关，长跑程序句柄越积越多；<br>' +
      '③ <b>并发</b>：多人聊天时对共享 <code>ArrayList</code> 边遍历边添加，直接抛 <code>ConcurrentModificationException</code>，或消息静默丢失。'
    },

    { t: 'codegroup', tabs: [
      { label: '数值修复', run: true, code:
`public class FixNumeric {
    public static void main(String[] args) {
        int[] scores = {88, 92, 79, 95};
        int sum = 0;
        for (int i = 0; i < scores.length; i++) {
            sum = sum + scores[i];
        }

        // 把除数转成 double，整个除法按浮点算
        double average = sum / (double) scores.length;
        System.out.printf("average = %.2f%n", average);   // 88.50
    }
}
` },
      { label: '边界修复', run: true, code:
`public class FixBoundary {
    public static void main(String[] args) {
        System.out.println(max(new int[]{3, 9, 2}));   // 9
        System.out.println(max(new int[]{}));          // -1：空数组
        int[] none = null;
        System.out.println(max(none));                 // -1：null
    }

    static int max(int[] a) {
        if (a == null || a.length == 0) {
            return -1;              // 先处理边界，再进主逻辑
        }
        int m = a[0];
        for (int i = 1; i < a.length; i++) {
            if (a[i] > m) m = a[i];
        }
        return m;
    }
}
` }
    ] },

    /* ------------------------------------------------------------------ 七、AI 调试 */
    { t: 'h', text: '七、让 AI 帮你 debug', id: 'ch02-7' },

    { t: 'p', html:
      '<b>Adaptive Debugging</b> 能检测、解释并修正逻辑错误与 API 误用，是 AI 最强的场景之一。' +
      '前提是现场完整，讲义建议 <b>provide the complete code (including all relevant background)</b>。' +
      '有效提问包含五样：完整异常栈（含行号）、相关方法代码、输入、期望输出、实际输出——少一样，AI 就开始猜。'
    },

    { t: 'steps', items: [
      { title: '先缩小范围', html: '用断点或 <code>println</code> 确认哪一行开始不对，否则连问题都描述不清。' },
      { title: '贴异常栈第一行', html: '异常类型 + 消息 + 行号，如 <code>NullPointerException at GomokuGame.move(GomokuGame.java:42)</code>。' },
      { title: '贴上下文代码', html: '出错方法、调用它的方法、相关字段声明。' },
      { title: '写清期望与实际', html: '「输入 (3,4)，期望返回 true，实际抛异常」比「它坏了」有用一百倍。' },
      { title: '先解释再改', html: '要求「先说明根因，再给最小修改」，避免它大改一通把代码改乱。' },
      { title: '自己复现验证', html: '改完重跑同一组输入，确认从失败变成功。' }
    ] },

    { t: 'code', caption: '一次合格的 debug 提问模板（示意，不是可执行代码）', code:
`【异常】
Exception in thread "main" java.lang.NullPointerException:
  Cannot read field "length" because "board" is null
  at GomokuGame.render(GomokuGame.java:27)
  at Main.main(Main.java:5)

【相关代码】
class GomokuGame {
    private char[][] board;
    GomokuGame() { /* 只初始化了 size */ }
    String render() { return "" + board.length; }   // line 27
}

【期望 / 实际】
期望：构造后 render() 返回 15x15 的棋盘文本
实际：抛 NullPointerException

【要求】
先解释根因，再给最小修改；不要重写整个类。` },

    { t: 'callout', kind: 'tip', title: '反向利用 AI：让它出考试题', html:
      '把自己的类贴给 AI，让它出 5 道「这段代码能否编译 / 输出是什么」的选择题，再逐题给解析。' +
      '这是把 AI 用在「学」而不是「代替你写」的好办法，也直接对应期末 Part I 与 Part II 的题型。'
    },

    /* ------------------------------------------------------------------ 八、典型误用 */
    { t: 'h', text: '八、AI 用错的典型场景', id: 'ch02-8' },

    { t: 'p', html:
      '讲义强调「用 AI 学习反而更花时间」：十分钟生成代码，之后可能两天还债。五种误用在项目里都真实发生过。'
    },

    { t: 'table',
      head: ['误用', '后果', '正确做法'],
      rows: [
        ['整个需求一次生成全部代码', '看不懂、改不动、答辩讲不出', '按类与方法拆小步，每步运行验证'],
        ['复制 AI 代码不审查', '编译过但逻辑错，演示当场崩', '按六维检查表过一遍'],
        ['让 AI 猜项目结构', '接口对不上、类名冲突', '贴出真实类与方法签名'],
        ['报错就把整段丢回去重写', '越改越乱，引入新 bug', '先定位最小失败用例再问'],
        ['用 AI 生成没学过的 API', '考试写不出、环境不支持', '只用课程讲过的 API，其余查讲义']
      ],
      caption: '前四条是能力问题，最后一条既影响考试，也涉及学术规范' },

    { t: 'p', html:
      '判断标准很简单：<b>这一行如果老师让你手写，你能写出来吗？</b>写不出来就换课上学过的写法。这也是课程把 Vibe Coding 放第一讲的原因——<b>工具越强，判断力越值钱</b>。'
    },

    /* ------------------------------------------------------------------ 交互 */
    { t: 'p', html: '下面这个实验台把「提示词构造」与「AI 代码审查」做成可操作流程，先自己试一遍：' },

    { t: 'lab', id: 'vibe' },

    { t: 'p', html: '再用三道题检验本章的关键判断：' },

    { t: 'quiz', qid: 'ch02-q1' },

    { t: 'quiz', qid: 'ch02-q2' },

    { t: 'quiz', qid: 'ch02-q3' },

    /* ------------------------------------------------------------------ 章末 */
    { t: 'keypoint', items: [
      { title: '两种编程', html: '传统编程人写全部代码；AI 编程人描述意图并审查结果。AI 擅长样板、解释、改写、补测试。' },
      { title: 'LLM 原理', html: '按上下文预测下一个 token，不是查答案库；上下文越全越准，没记准的 API 会幻觉。' },
      { title: 'Vibe Coding', html: '对话式循环：想法 → 生成 → 验证 → 修改；四项能力里两项是「理解与解释」。' },
      { title: '课程规则', html: '项目允许 AI（60%），期末严禁 AI（40%）；项目代码要能解释，期末知识要能手写。' },
      { title: '提需求', html: '上下文 + 约束 + 验收标准；先讲设计再给代码，能提前拦下方向错误。' },
      { title: '审查', html: '编译过 ≠ 对。按边界、数值、并发、资源、契约、安全六维各备一个最小验证输入。' },
      { title: 'AI 调试', html: '给全异常栈、相关代码、输入、期望与实际；要它先解释根因再给最小修改，改完自己复现。' }
    ] },

    { t: 'checklist', id: 'ch02', items: [
      '我能说出传统编程与 AI 编程在编码、门槛、调试、效率上的差异',
      '我能用「预测下一个 token」解释 AI 为什么会幻觉',
      '我能描述 Vibe Coding 的循环，并说出 DeepSeek 案例的三项特质',
      '我能复述课程「项目允许 AI、期末禁止」的规定与理由',
      '我能按上下文、约束、验收标准三段式写出一个提示词',
      '我能对 AI 生成的类逐条过六维审查表，并各写一个最小测试',
      '我能用五要素组织一次 debug 提问，要求 AI 先解释根因',
      '我能识别五种典型 AI 误用，并说出正确的替代做法'
    ] },

    { t: 'callout', kind: 'exam', title: '考试怎么考这一章', html:
      '期末不考「怎么用 DeepSeek」，但观念题很好出：' +
      '① <b>LLM 本质</b>——「正确答案来自数据库检索」错，它按上下文预测下一个 token；' +
      '② <b>课程规则</b>——「项目与期末都允许 AI」错，期末严格禁止；' +
      '③ <b>审查意识</b>——给一段能编译但逻辑错的代码问「问题在哪」，本章的整数除法就是原型；' +
      '④ <b>提示词要素</b>——哪段提问更可能得到可用代码，答案是「给了上下文与验收标准」那段；' +
      '⑤ <b>术语配对</b>——hallucination 是「编造不存在的 API」，boilerplate 是「样板代码」。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '正确姿势是「让 AI 当陪练，而不是代打」：① 自己先写 10 行再让 AI 补全，对比差异——差异处就是盲区；' +
      '② 让 AI 解释你写的代码，看它有没有说错，能挑出错说明你理解更深；' +
      '③ 把六维审查表贴给 AI，让它审自己刚写的代码，你逐条复核；④ 让它出「输出是什么」的题，先自己做再要解析。' +
      '永远自己验证三件事：代码能不能跑、边界能不能过、换你手写能不能写出来。答不上第三条，这段代码就不算你的。'
    }

  ]
});
