/* =====================================================================
 * data/adv-eng.js · 进阶轨道 · 工程实践（课程之外的深入学习）
 *
 * 4 个小节：Git 基础与工作流 / 单元测试 / 调试方法论 / 构建与工具链
 * 说明：Git/Maven/CI 的示例是 shell 命令，本站引擎不执行 shell，统一 run:false
 *       并在 caption 标注「本站引擎不支持，以下为真实命令与输出」。
 *       能跑的 Java 代码保持 run:true（用断言风格演示测试思想、用命令行参数演示工具链）。
 * 注册：CSC.registerAdvanced(...)（独立数组，不进入主课程（ch00–ch13））
 * 作者模块：feature-builder
 * ===================================================================== */

CSC.registerAdvanced({
  id: 'adv-eng',
  order: 3,
  title: '工程实践',
  en: 'ENGINEERING PRACTICE',
  tagline: '从「能跑」到「可维护」：版本控制、测试、调试、构建',
  level: '进阶',
  minutes: 90,
  prereq: ['ch01', 'ch06'],
  intro: '<p>课程作业通常是一个人写一个文件、交上去能跑就行。真实项目不是这样：'
    + '多人同时改代码、改错了要能回退、上线后出了问题要能定位。'
    + '这一篇讲的就是让代码「可维护、可协作、可验证」的四件工程基本功：'
    + '<b>Git</b>（版本控制）、<b>单元测试</b>（正确性防线）、<b>调试</b>（找 bug 的方法）、'
    + '<b>构建工具</b>（编译、依赖、打包）。</p>'
    + '<p>这些内容不考 计算机科学与 Java 编程导论，但决定你在大作业和实习里能走多远。'
    + '好消息是：每一件都可以在一天内入门，然后在项目里越用越熟。</p>',
  goals: [
    '能用 Git 完成「提交—分支—合并—回退」的日常操作，并说清工作区/暂存区/仓库的区别',
    '会给自己的方法写单元测试，理解「红—绿—重构」的节奏',
    '遇到 bug 时不再靠猜，能按「最小复现 → 二分定位 → 断点验证」走完流程',
    '知道 javac / java / jar / Maven 各自解决什么问题，看懂一个标准项目目录'
  ],
  sections: [
    /* ---------------------------------------------------------------- S1 Git */
    {
      id: 'adv-eng-s1',
      title: 'Git：把每一次修改变成可回退的历史',
      en: 'VERSION CONTROL',
      minutes: 22,
      blocks: [
        { t: 'p', html: '没有版本控制时，你大概用过「论文最终版」「论文最终版2」「论文真最终版」这种命名。'
            + 'Git 把这件事做成了系统：每次提交（commit）都记录<b>谁、什么时候、改了什么</b>，'
            + '你可以随时查看历史、对比差异、回退到任意版本。'
            + '它是现代软件协作的事实标准，几乎每个项目都默认 Git。' },
        { t: 'p', html: '理解 Git 的关键是三个区域：<b>工作区</b>（你正在编辑的文件）、'
            + '<b>暂存区</b>（git add 后准备提交的快照）、<b>本地仓库</b>（git commit 后的历史）。'
            + '很多新手被搞晕，是因为把「保存文件」当成了「提交」——保存只是改了工作区，'
            + 'commit 才是把变化写进历史。' },
        { t: 'code', run: false, caption: '本站引擎不支持 shell 命令，以下为真实的 Git 命令',
          code: `# 第一次使用：配置身份
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# 从零开始
git init                      # 当前目录变成 Git 仓库
git status                    # 查看哪些文件被改了（最常用的命令，没有之一）
git add Main.java             # 把文件放进暂存区
git commit -m "feat: 实现计算器 M1"   # 提交，附一条说明

# 日常循环
git add -A && git commit -m "fix: 修正除零判断"
git log --oneline --graph     # 看历史（提交哈希 + 说明 + 分支图）
git diff                      # 工作区 vs 暂存区的差异
git diff HEAD                 # 工作区 vs 最近一次提交

# 回退
git restore Main.java         # 丢弃工作区未暂存的修改（小心！）
git reset --soft HEAD~1       # 撤回最近一次提交，改动留在暂存区` },
        { t: 'table', caption: '常用命令速查',
          head: ['任务', '命令', '说明'],
          rows: [
            ['看状态', '<code>git status</code>', '当前分支、已改文件、待提交内容'],
            ['看历史', '<code>git log --oneline</code>', '一行一条提交'],
            ['看差异', '<code>git diff</code> / <code>git diff --staged</code>', '工作区 vs 暂存区 / 暂存区 vs 上次提交'],
            ['创建分支', '<code>git switch -c feature-a</code>', '从当前点开一条新分支'],
            ['合并分支', '<code>git merge feature-a</code>', '把分支合回当前分支'],
            ['暂存现场', '<code>git stash</code> / <code>git stash pop</code>', '临时切走不提交'],
            ['撤销提交', '<code>git revert &lt;hash&gt;</code> / <code>git reset</code>', 'revert 安全（产生反向提交），reset 改写历史']
          ] },
        { t: 'steps', items: [
          { title: '功能分支', html: '每个功能/修复开一条分支：<code>git switch -c fix/calc-divide</code>，在分支上开发。' },
          { title: '小步提交', html: '完成一个可工作的小步骤就提交一次，说明写清「为什么」（feat/fix/docs/chore 前缀）。' },
          { title: '合并前同步', html: '<code>git fetch</code> + <code>git rebase main</code>（或 merge），先解决冲突再合并。' },
          { title: '合并请求', html: '推送到远程，开 Pull Request，通过代码评审后再合并到主干。' }
        ] },
        { t: 'p', html: '为什么要小步提交？因为提交是最小可回退单元。'
            + '如果一次提交改了 20 个文件、包含了 3 个功能，出问题时你没法只回退其中一个。'
            + '相反，一个提交只做一件事、说明写清楚，就能用 <code>git bisect</code> 二分定位哪个提交引入了 bug —— '
            + '这和第 S3 节的「二分定位」是同一个思想。' },
        { t: 'callout', kind: 'warn', html: '两个新手最容易踩的坑：①<b>提交了不该提交的东西</b>'
            + '（编译产物 .class、IDE 配置、密钥文件）——用 <code>.gitignore</code> 提前排除；'
            + '②<b>在公共分支上 reset 改写历史</b>——已经推送的提交不要 reset，用 <code>git revert</code>。' },
        { t: 'p', html: '两个让仓库更好用的细节。第一是 <code>.gitignore</code>：把编译产物（*.class、target/）、'
            + '编辑器配置（.idea/、.vscode/）、系统文件（.DS_Store、Thumbs.db）、密钥/凭据全部排除，'
            + '仓库只留「人写的东西」。第二是提交信息规范：业界常用 Conventional Commits，'
            + '前缀 feat（新功能）/ fix（修 bug）/ docs（文档）/ refactor（重构）/ test（测试）/ chore（杂务），'
            + '说明写「做了什么、为什么」，而不是「update」「修改」。规范的历史让你三个月后还能看懂自己当时在干嘛。' },
        { t: 'callout', kind: 'tip', html: '本站自己的代码库就遵循这套流程：每次改动跑 <code>_dev/verify-all.js</code> 全绿后才提交，'
            + '提交说明写清「改了什么、为什么、验证结果」。养成这个习惯，你的项目历史就是最好的文档。' }
      ]
    },

    /* ---------------------------------------------------------------- S2 测试 */
    {
      id: 'adv-eng-s2',
      title: '单元测试：给代码装一条安全网',
      en: 'UNIT TESTING',
      minutes: 24,
      blocks: [
        { t: 'p', html: '一个方法写完了，「看起来对」和「确实对」是两件事。'
            + '单元测试就是<b>用代码验证代码</b>：为每个方法准备输入与期望输出，自动比较结果。'
            + '它最大的价值不是「证明程序正确」，而是<b>防止以后改坏</b>——'
            + '你重构、优化、加功能时，测试会立刻告诉你哪里变了行为。' },
        { t: 'p', html: 'Java 世界里最主流的测试框架是 <b>JUnit</b>（现在常用 JUnit 5）。'
            + '它提供 @Test 注解标记测试方法、assertEquals 等断言、以及自动统计「跑了几条、失败几条」。'
            + '写测试的纪律是：<b>一个测试只验证一个行为</b>，名字要读得懂（如 <code>add_negativeNumbers_returnsSum</code>）。' },
        { t: 'code', run: false, caption: '本站引擎不支持 JUnit 注解与依赖库，以下为真实 JUnit 5 代码与运行结果',
          code: `import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {
    private final Calculator calc = new Calculator();

    @Test
    void add_twoPositiveNumbers_returnsSum() {
        assertEquals(5, calc.add(2, 3));
    }

    @Test
    void divide_byZero_throwsArithmeticException() {
        assertThrows(ArithmeticException.class, () -> calc.divide(1, 0));
    }

    @Test
    void average_emptyArray_returnsZero() {
        assertEquals(0.0, calc.average(new int[]{}));
    }
}

// 真实运行输出（mvn test）：
// Tests run: 3, Failures: 0, Errors: 0, Skipped: 0` },
        { t: 'p', html: '本站引擎没有 JUnit，但「断言」的思想可以手写：准备一个计数器，对每个用例比较实际值与期望值，'
            + '不一致就报告。下面这段可运行代码就是一个迷你测试框架，你会看到它如何发现并报告失败。' },
        { t: 'code', caption: '可运行：手写一个迷你测试框架（本站引擎支持）',
          code: `public class MiniTest {
    static int passed = 0;
    static int failed = 0;

    static void assertEquals(String name, int expected, int actual) {
        if (expected == actual) {
            passed++;
            System.out.println("  PASS " + name);
        } else {
            failed++;
            System.out.println("  FAIL " + name + "：期望 " + expected + "，实际 " + actual);
        }
    }

    // 被测方法：求数组最大值（故意留一个 bug 演示测试的价值）
    static int max(int[] a) {
        int m = a[0];
        for (int i = 1; i < a.length; i++) {
            if (a[i] > m) m = a[i];
        }
        return m;
    }

    public static void main(String[] args) {
        System.out.println("max():");
        assertEquals("正数数组", 9, max(new int[]{3, 9, 2}));
        assertEquals("全是负数", -2, max(new int[]{-5, -2, -9}));
        assertEquals("单个元素", 7, max(new int[]{7}));
        System.out.println("通过 " + passed + " / 失败 " + failed);
    }
}` },
        { t: 'p', html: '运行上面这段，你会发现「全是负数」的测试其实会通过——因为当前 max 的初始化是正确的。'
            + '如果把 <code>int m = a[0];</code> 改成 <code>int m = 0;</code>，负数用例立刻失败。'
            + '这就是单元测试的核心用法：<b>把「你以为的正确」写成可执行的检查</b>，让它在每次改动后自动重跑。' },
        { t: 'steps', items: [
          { title: '红（Red）', html: '先写一个会失败的测试（被测功能还没实现），确认测试真的能失败——防止测试本身写错。' },
          { title: '绿（Green）', html: '用最直接的方式让测试通过，不追求优雅。' },
          { title: '重构（Refactor）', html: '在测试保护下改代码结构，每次改完重跑测试，全绿才继续。' }
        ] },
        { t: 'p', html: '这个循环叫 <b>TDD（测试驱动开发）</b>。不必教条地每次都先写测试，'
            + '但「先想清楚期望行为」这个习惯值得保留。'
            + '本站的 <code>_dev/engine-tests.js</code>（解释器 300+ 断言）和 <code>_dev/learning-tests.js</code>（115 条）'
            + '就是纯 Node 版本的同款思路：不需要框架，一个 assert 就够。' },
        { t: 'p', html: '测试不是越多越好，而要分层。业界常说的「测试金字塔」：底层是大量<b>单元测试</b>（毫秒级、隔离、覆盖方法边界），'
            + '中层是少量<b>集成测试</b>（验证几个模块一起工作，比如「读文件→解析→统计」），'
            + '顶层是极少的<b>端到端测试</b>（真正启动程序、模拟用户操作）。'
            + '倒金字塔（大量端到端测试）是最糟糕的结构：慢、脆、一处 UI 改动就红一片。'
            + '对课程大作业来说，把「输入 → 期望输出」的用例写成单元测试就足够；'
            + '本站的 <code>_dev/*-tests.js</code> 全部是纯 Node 单元测试，跑一遍 8 秒以内。' },
        { t: 'callout', kind: 'warn', html: '测试也有成本：太细的测试会随代码实现一起变（换个写法就要改测试），'
            + '太粗的测试发现不了问题。原则是<b>测行为不测实现</b>：输入什么、输出什么、抛什么异常，而不是「内部调了哪个私有方法」。' },
        { t: 'callout', kind: 'tip', html: '给大作业加测试的最低成本做法：把所有「手工验证输入」整理成一张表，'
            + '写一个 <code>verifier</code> 类遍历这张表，自动打印通过/失败。省下的重复点按时间，够你多改三个功能。' }
      ]
    },

    /* ---------------------------------------------------------------- S3 调试 */
    {
      id: 'adv-eng-s3',
      title: '调试方法论：别猜，缩小范围',
      en: 'DEBUGGING',
      minutes: 22,
      blocks: [
        { t: 'p', html: '新手调试的典型方式是「盯着代码想」和「到处加 println」。'
            + '这样有时能碰对，但效率低、容易越改越乱。'
            + '专业调试是一套流程：<b>稳定复现 → 最小化输入 → 定位到具体行 → 验证假设 → 修复并加回归测试</b>。' },
        { t: 'steps', items: [
          { title: '稳定复现', html: '先找到「每次都能触发」的最短操作序列；不能复现的 bug 等于没找到。' },
          { title: '缩小输入', html: '把输入一点点删减到最小：数据减半、关键变量改成常量，直到 bug 仍然存在。' },
          { title: '二分定位', html: '把程序按执行顺序切成两半，用断点/日志确认 bug 在前半还是后半，反复折半。' },
          { title: '验证假设', html: '每次只改一个变量，确认「改这里 bug 消失」——否则你只是在蒙。' },
          { title: '修复 + 回归', html: '修完补一条能复现该 bug 的测试（回归测试），防止它以后复活。' }
        ] },
        { t: 'p', html: '「二分定位」是调试里最值得练的思维：它把 N 步的排查降到 log₂N 步。'
            + '一段代码哪里出错了？在中间打一行输出，看数据到这里是否还正常；'
            + '正常就往后找、不正常就往前找。下面这段可运行的演示，就用二分法在 100 万次迭代里定位出问题的位置。' },
        { t: 'code', caption: '可运行：用二分法定位「第一次算错」的位置（本站引擎支持）',
          code: `public class BinaryDebug {
    // 被测算法：看起来是在累加，但第 500 次之后每次多加了 1（模拟隐藏 bug）
    static int totalAt(int steps) {
        int sum = 0;
        for (int i = 1; i <= steps; i++) {
            sum += i;
            if (i > 500) sum += 1;
        }
        return sum;
    }

    // 正确答案：等差数列求和
    static int expected(int steps) {
        return steps * (steps + 1) / 2;
    }

    public static void main(String[] args) {
        int lo = 1, hi = 2000;
        // 二分查找第一个「算错」的步数
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (totalAt(mid) == expected(mid)) lo = mid + 1;
            else hi = mid;
        }
        System.out.println("第一次出现偏差的步数 = " + lo);
        System.out.println("此时实际值 = " + totalAt(lo) + "，期望值 = " + expected(lo));
    }
}` },
        { t: 'p', html: '这段演示的意义：bug 藏在 2000 次循环里，但二分只需要约 11 次探测就定位到第 501 步。'
            + '真实调试时，你把「二分查找」换成「在代码中间插一行 print/断点」，逻辑完全一样。'
            + '另外一个高频技巧是 <code>git bisect</code>：在提交历史上做同样的二分，找出哪个提交引入了 bug。' },
        { t: 'p', html: '还有一个被低估的技能：<b>读懂异常栈</b>。Java 的 stack trace 从「抛出点」往下是调用链，'
            + '最上面几行往往是 JDK 内部（不要慌），要找的是<b>第一行属于你自己代码的 at</b>——那才是 bug 的现场。'
            + '如果是 <code>Caused by</code> 链，最底下的因果往往才是根因（比如 NullPointerException 被包装成业务异常）。'
            + '本站引擎返回的 error 对象 <code>{stage, type, message, line}</code> 就是同一信息的结构化版本：'
            + '先看 line，再看 type，最后读 message。' },
        { t: 'table', caption: '常用调试手段对比',
          head: ['手段', '优点', '缺点', '适用'],
          rows: [
            ['println / 日志', '零成本、随处可加', '要记得删、大量输出难读', '快速确认某处值'],
            ['断点 + 单步', '能看到完整状态、可回看调用栈', '需要 IDE 与暂停运行', '逻辑分支、状态变化'],
            ['断言 / 单元测试', '自动、可重复', '写的时候要多花心思', '回归、边界'],
            ['二分 / 最小复现', '对复杂系统最有效', '需要先能稳定复现', '疑难、偶现 bug']
          ] },
        { t: 'callout', kind: 'warn', html: '调试时最忌讳「改一行试一次、不行再改回去」。'
            + '每次改动前先写下<b>你的假设是什么、预期改完会怎样</b>，改完立刻验证。'
            + '没有假设的乱改会让你忘记自己改过什么，bug 反而越藏越深。' },
        { t: 'callout', kind: 'tip', html: '本站代码块报错时，先看 error 里的 <b>line</b> 和 <b>message</b>，'
            + '再看「stage」：compile 说明语法/符号问题，runtime 才是运行到一半出的问题。'
            + '这个结构就是真实编译器/解释器错误的简化版。' }
      ]
    },

    /* ---------------------------------------------------------------- S4 构建 */
    {
      id: 'adv-eng-s4',
      title: '从 javac 到 Maven：工具链是怎么长出来的',
      en: 'BUILD TOOLS',
      minutes: 22,
      blocks: [
        { t: 'p', html: '课程里你手敲 <code>javac Main.java</code> 再 <code>java Main</code>。'
            + '这在单文件作业里够用，但真实项目有几十个包、十几个第三方依赖、还要打 jar 包给用户——'
            + '手敲命令会迅速失控。构建工具（Maven / Gradle）就是把这些重复工作自动化的。'
            + '理解它们之前，先理解它们要解决的问题。' },
        { t: 'p', html: 'Java 程序的完整生命周期：<b>源码 .java</b> →（javac 编译）→ <b>字节码 .class</b> '
            + '→（jar 打包）→ <b>.jar</b> →（java -jar 运行）。'
            + '编译时需要 <b>classpath</b> 告诉编译器「依赖的类在哪」；运行时同样需要。'
            + '依赖少时手写 -cp 还行，依赖一多就必须有工具管理。' },
        { t: 'code', run: false, caption: '本站引擎不支持 shell 命令，以下为真实的工具链命令',
          code: `# 1) 编译（有包结构时用 -d 输出目录）
javac -d out src/com/example/Main.java
javac -d out src/com/example/*.java

# 2) 运行（-cp 指定 classpath，后面跟主类全名）
java -cp out com.example.Main

# 3) 打包成可执行 jar
jar cfe app.jar com.example.Main -C out .
java -jar app.jar

# 4) 用 Maven 管理依赖与构建（pom.xml 描述项目）
mvn compile        # 编译
mvn test           # 跑单元测试
mvn package        # 打包 jar
mvn clean          # 清理 target/

# 5) Gradle（另一种构建工具，脚本更短）
gradle build
gradle test` },
        { t: 'p', html: 'Maven 的核心是 <code>pom.xml</code>：声明项目坐标、依赖、构建插件。'
            + '你在 <code>&lt;dependencies&gt;</code> 里写一个依赖坐标（groupId / artifactId / version），'
            + 'Maven 就自动从仓库下载它，以及它依赖的依赖（传递依赖）。'
            + '这解决了「手动往 lib/ 里塞 jar 包」的时代难题。' },
        { t: 'table', caption: '一个标准 Maven 项目的目录结构',
          head: ['路径', '放什么', '说明'],
          rows: [
            ['<code>src/main/java</code>', '主代码（按包分目录）', '编译产物进 target/classes'],
            ['<code>src/main/resources</code>', '配置文件、静态资源', '会被打进 jar'],
            ['<code>src/test/java</code>', '测试代码', '<code>mvn test</code> 时执行'],
            ['<code>pom.xml</code>', '项目描述与依赖', '坐标、依赖、插件、版本'],
            ['<code>target/</code>', '构建输出', '<b>不要提交进 Git</b>（加进 .gitignore）']
          ] },
        { t: 'p', html: '命令行参数是另一个工程必备知识：<code>main(String[] args)</code> 里的 args 就是启动时传入的参数。'
            + '下面这段可运行代码演示如何解析参数——真实工具（比如 git、mvn）就是这么读取用户输入的。' },
        { t: 'code', caption: '可运行：解析命令行参数（本站引擎支持 args）', args: ['add', '3', '5'],
          code: `public class ArgsDemo {
    public static void main(String[] args) {
        if (args.length < 3) {
            System.out.println("用法: java ArgsDemo <op> <a> <b>");
            return;
        }
        String op = args[0];
        int a = Integer.parseInt(args[1]);
        int b = Integer.parseInt(args[2]);
        if (op.equals("add")) System.out.println("= " + (a + b));
        else if (op.equals("mul")) System.out.println("= " + (a * b));
        else System.out.println("未知操作: " + op);
        System.out.println("共 " + args.length + " 个参数");
    }
}` },
        { t: 'p', html: '最后是持续集成（CI）：每次推送代码，服务器自动跑「编译 + 测试 + 打包」，把结果贴在 PR 上。'
            + 'GitHub Actions 的一条最小流水线只需要一个 YAML 文件。'
            + 'CI 的价值是把「我本地能跑」变成「每次提交都验证过能跑」，团队协作时尤其重要。' },
        { t: 'code', run: false, caption: '本站引擎不支持 YAML/CI，以下为真实的 GitHub Actions 配置',
          code: `# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
      - run: mvn -B test      # 编译 + 跑测试
      - run: mvn -B package   # 打包` },
        { t: 'p', html: '依赖管理里有两个常见概念：<b>语义化版本</b>（SemVer）把版本号分成 主.次.修订，'
            + '主版本升级代表不兼容改动、次版本代表新增功能、修订代表修 bug；'
            + '<b>依赖冲突</b>发生在两个库要求同一个依赖的不同版本时，Maven 用「最近者优先」解决，'
            + '必要时用 <code>dependencyManagement</code> 或 <code>exclusion</code> 显式指定。'
            + '这些概念在实习面试里经常被顺带问到，知道名字与思路即可，不必背细节。' },
        { t: 'callout', kind: 'tip', html: '本站没有构建步骤（纯静态、零依赖），但它也有自己的「构建」：'
            + '<code>_dev/verify-all.js</code> 一键跑完 11 项自测（冒烟、解释器、渲染、CSS、SW、版本一致性）。'
            + '思想完全一致：<b>用一条命令验证整个项目仍然健康</b>。' },
        { t: 'p', html: '最后补一个日常效率点：熟练使用 IDE（IntelliJ IDEA / VS Code）的快捷键，'
            + '收益比想象中大得多——重命名符号（而不是全局替换字符串）、格式化、跳转定义、查看调用层级、'
            + '内联重构、运行单元测试，每个动作省几秒，一天下来就是几十分钟。'
            + '但别本末倒置：快捷键只是加速器，真正决定代码质量的是<b>命名、拆分、测试</b>这些慢功夫。' },
        { t: 'callout', kind: 'note', html: '这一篇的四个主题其实是一条线：Git 管历史、测试保正确、调试找问题、构建提效率。'
            + '它们都不改变「写什么算法」，但决定了你的代码能不能被别人接手、能不能长期维护。' }
      ]
    }
  ],
  finish: '<p><b>怎么继续练：</b>下一周把大作业搬进 Git（哪怕只有你自己），'
    + '每天结束前提交一次并写清说明；给最核心的 3 个方法补上断言测试；'
    + '拿一个真实的 bug 走一遍今天的五步调试法；最后用 javac/java 手工编译带包结构的项目一次，再用 Maven 打包一次。</p>',
  checklist: {
    id: 'adv-eng-check',
    items: [
      '能说出工作区/暂存区/本地仓库的区别，并完成「add → commit → log → 回退」',
      '理解功能分支 + 小步提交 + Pull Request 的协作流程',
      '能给一个方法写出 3 条以上断言测试，并解释红绿重构',
      '遇到 bug 能先稳定复现、再二分定位，而不是盲目改代码',
      '能说出 javac / java / jar / Maven 各自解决什么问题'
    ]
  },
  keypoint: {
    items: [
      { title: '提交是最小可回退单元', html: '小步提交 + 清晰说明，才能在出问题时精准回退与 bisect。' },
      { title: '测试保护重构', html: '测行为不测实现；红—绿—重构；每个修完的 bug 补一条回归测试。' },
      { title: '调试靠缩小范围', html: '稳定复现 → 最小输入 → 二分定位 → 验证假设 → 回归测试。' },
      { title: '构建工具管理依赖与流程', html: 'javac/java 是基础，Maven/Gradle 把编译、测试、打包、依赖自动化。' }
    ]
  }
});
