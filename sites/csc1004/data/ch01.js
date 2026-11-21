/* =====================================================================
 * data/ch01.js · 第 01 章：实验环境与项目结构（IDE, JDK & Project Layout）
 * 职责：把「装对工具」讲成可操作流程：IntelliJ IDEA 安装与界面、JDK、
 *       运行第一个程序、断点与变量窗、Step over/into/out/Resume、Alt+F8、
 *       Maven 与生命周期、Java 项目目录结构、PyCharm 与 Python 环境。
 * 依据：CSC1004 Tutorial 1（IntelliJ/Maven/调试）、lecture0 的 IDE 部分。
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5；代码均可在站内引擎运行。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch01',
  num: '01',
  title: '实验环境与项目结构',
  en: 'IDE, JDK & Project Layout',
  goals: [
    '能独立安装 IntelliJ IDEA、配好 JDK，新建并运行第一个 Java 程序',
    '能说出 IntelliJ 界面四个区域，以及 Project 树和编辑器各自负责什么',
    '能用断点、Step over/into/out、Resume 和 Alt+F8 找出循环里变量的变化',
    '能按 clean → compile → test → package → install 说出一次 Maven 构建做了什么',
    '能分辨 Maven 项目与 PyCharm 项目的目录结构，知道每个目录由谁生成'
  ],
  kp: [
    { id: 'ch01-1', title: 'IDE、JDK 与安装' },
    { id: 'ch01-2', title: '新建项目与 IntelliJ 界面' },
    { id: 'ch01-3', title: '运行第一个程序：编译与执行' },
    { id: 'ch01-4', title: '断点与变量窗' },
    { id: 'ch01-5', title: 'Step over/into/out、Resume 与 Alt+F8' },
    { id: 'ch01-6', title: 'Maven 与 pom.xml' },
    { id: 'ch01-7', title: 'Maven 生命周期' },
    { id: 'ch01-8', title: '项目目录结构与 PyCharm 环境' }
  ],
  blocks: [

    /* ------------------------------------------------------------------ 开篇 */
    { t: 'callout', kind: 'why', html:
      '课上代码能跑，回宿舍就报错——原因往往不是代码写错，而是三件事没对上：<b>IDE</b> 不知道用哪个 <b>JDK</b>、' +
      '<b>Maven</b> 没同步、文件放错了目录。项目交上去，助教在另一台电脑上打开，红色波浪线爬满屏幕。<br>' +
      '这门课两个约 2000 行的 Java 项目都要能被人打开、编译、运行，<b>环境本身也是作业的一部分</b>。' +
      '这一章先搭好 IntelliJ IDEA，再学会用调试器看清每行执行时变量怎么变，最后讲清 Maven 生命周期与目录结构——' +
      '它们是 Chat Zoom 与 Gomoku 的骨架。'
    },

    { t: 'p', lead: true, html: '先跑通第一个程序，这是你第一次看清「IDE 做什么、JDK 做什么」。' },

    { t: 'code', caption: 'HelloCSC.java · 新建项目后的第一个类，点绿色三角运行', run: true, code:
`public class HelloCSC {
    public static void main(String[] args) {
        System.out.println("Hello, CSC1004!");
        System.out.println("Java + Maven + IntelliJ");
    }
}
` },

    { t: 'p', html:
      '注意三件事：文件名必须与 <code>public class</code> 同名；入口是固定签名的 <code>public static void main(String[] args)</code>；' +
      '<code>System.out.println</code> 把文本送到控制台。IDE 在后台做的，是调用 JDK 的编译器把 <code>.java</code> 变成 <code>.class</code> 字节码，再交给 JVM 执行。'
    },

    { t: 'terms', cols: 2, items: [
      { en: 'IDE', zh: '集成开发环境', html: '编辑、编译、运行、调试、依赖管理合在一个窗口里；课程推荐 IntelliJ IDEA。' },
      { en: 'JDK', zh: 'Java 开发工具包', html: 'Java Development Kit：编译器 <code>javac</code>、运行器 <code>java</code>、标准库都在这。' },
      { en: 'JRE', zh: 'Java 运行环境', html: 'Java Runtime Environment：只够运行字节码，不含编译器。' },
      { en: 'JVM', zh: 'Java 虚拟机', html: 'Java Virtual Machine：执行 <code>.class</code> 字节码的机器，跨平台靠它。' },
      { en: 'project', zh: '项目', html: 'IDE 里一个完整工程，含源码、依赖配置与构建产物。' },
      { en: 'breakpoint', zh: '断点', html: '行号旁 gutter 上点出的红点；运行到这一行会暂停。' }
    ] },

    /* ------------------------------------------------------------------ 一、IDE 与 JDK */
    { t: 'h', text: '一、IDE、JDK 与安装', id: 'ch01-1' },

    { t: 'p', html:
      '<b>IDE（集成开发环境）</b>就是「写代码的整套工作台」：左边管文件，中间写代码，下面看输出，调试时把变量摊开给你看。' +
      '讲义比较了三种 Java IDE：<b>Eclipse</b>、<b>NetBeans</b>、<b>IntelliJ IDEA</b>，前两个明确标了「不推荐」——' +
      '课程演示、助教答疑、Tutorial 截图全基于 IntelliJ，工具不同菜单就不同，出问题时没人能照着你的屏幕讲。'
    },

    { t: 'table',
      head: ['工具', '定位', '课程态度'],
      rows: [
        ['<b>Eclipse</b>', '开源 Java IDE 平台，插件生态庞大', '不推荐（讲义标注）'],
        ['<b>NetBeans</b>', 'Oracle 系 IDE，支持 Java/JavaFX 等', '不推荐（讲义标注）'],
        ['<b>IntelliJ IDEA</b>', '商业 IDE，补全、重构、调试、单元测试齐全', '<b>推荐</b>，统一使用'],
        ['<b>PyCharm</b>', 'JetBrains 的 Python IDE，第三个项目用', 'Python 项目使用']
      ],
      caption: '讲义原话：IntelliJ IDEA（Recommended!），Eclipse / NetBeans（Not Recommended!）' },

    { t: 'p', html:
      '安装路径：打开 <code>https://www.jetbrains.com/idea/</code> → Download → 选操作系统 → 按向导 Next。' +
      '讲义里有两处说法：lecture0 建议「下载 Ultimate，用学校邮箱注册」；Tutorial 1 补充「现在已不再单独区分 Ultimate 版，' +
      '大多数情况下也用不到它的功能」。合起来读：<b>能拿到教育许可就用完整功能，拿不到用社区版也能完成本课程</b>，' +
      '同一许可还能覆盖 PyCharm Professional。'
    },

    { t: 'callout', kind: 'warn', title: '三个高频环境事故', html:
      '① <b>JDK 版本不匹配</b>：项目用 21、同学电脑只有 8，别人的 IDE 满屏红线；交作业前换台机器打开试一次。<br>' +
      '② <b>改了代码没重新 Build</b>：跑的是旧 <code>.class</code>，现象是「明明改了却没生效」。<br>' +
      '③ <b>把 <code>.idea/</code>、<code>target/</code> 一起发出去</b>：它们由本机生成，换机器要重建；发源码加 <code>pom.xml</code> 就够了。'
    },

    /* ------------------------------------------------------------------ 二、新建项目与界面 */
    { t: 'h', text: '二、新建项目与 IntelliJ 界面', id: 'ch01-2' },

    { t: 'steps', items: [
      { title: 'New Project', html: '启动页点 <b>New Project</b>；已有项目点 Open。' },
      { title: '起名与选 JDK', html: '填项目名（如 <code>Gomoku</code>），语言选 Java，Build system 选 <b>Maven</b>；JDK 没有就点 <b>Download JDK</b>。' },
      { title: '看目录树', html: '左侧 Project 面板出现 <code>src/main/java</code>，讲义说的「right project structure」就是 IDE 自动建好的这一层。' },
      { title: '新建类', html: '右键 <code>src/main/java</code> → <b>New → Java Class</b>，输类名（不带 <code>.java</code>），IDE 自动建文件。' },
      { title: '写 main', html: '<code>psvm</code> + Tab 生成 <code>main</code> 签名，<code>sout</code> + Tab 生成 <code>println</code>。' },
      { title: '运行', html: '点 <code>main</code> 左边绿色三角；结果出现在下方 <b>Run</b> 窗口，输出 <code>exit code 0</code> 表示正常结束。' }
    ] },

    { t: 'svg', maxW: 660, html:
'<svg viewBox="0 0 660 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IntelliJ IDEA 窗口四个区域">' +
'  <rect x="10" y="10" width="640" height="230" fill="none" stroke="var(--line2)"/>' +
'  <rect x="10" y="10" width="150" height="230" fill="var(--surface2)" stroke="var(--line2)"/>' +
'  <text x="22" y="32" font-size="11" fill="var(--text3)" font-family="ui-monospace,monospace">PROJECT</text>' +
'  <text x="22" y="58" font-size="12" fill="var(--text)">Gomoku</text>' +
'  <text x="30" y="80" font-size="11" fill="var(--text2)">src/main/java</text>' +
'  <text x="38" y="100" font-size="11" fill="var(--accent)">GomokuGame.java</text>' +
'  <text x="38" y="120" font-size="11" fill="var(--text2)">Main.java</text>' +
'  <text x="30" y="142" font-size="11" fill="var(--text3)">pom.xml</text>' +
'  <rect x="160" y="10" width="360" height="150" fill="none" stroke="var(--line2)"/>' +
'  <text x="172" y="32" font-size="11" fill="var(--text3)" font-family="ui-monospace,monospace">EDITOR</text>' +
'  <text x="176" y="56" font-size="11" fill="var(--text2)" font-family="ui-monospace,monospace">1  public class Main {</text>' +
'  <text x="176" y="76" font-size="11" fill="var(--text2)" font-family="ui-monospace,monospace">2      public static void main(...)</text>' +
'  <text x="176" y="96" font-size="11" fill="var(--text2)" font-family="ui-monospace,monospace">3          play();</text>' +
'  <circle cx="167" cy="92" r="4" fill="var(--const-red)"/>' +
'  <text x="176" y="124" font-size="10" fill="var(--text3)">← gutter：点红点设断点</text>' +
'  <rect x="160" y="160" width="360" height="80" fill="var(--surface2)" stroke="var(--line2)"/>' +
'  <text x="172" y="182" font-size="11" fill="var(--text3)" font-family="ui-monospace,monospace">RUN / DEBUG</text>' +
'  <text x="176" y="204" font-size="11" fill="var(--text2)" font-family="ui-monospace,monospace">Hello, CSC1004!</text>' +
'  <text x="176" y="224" font-size="11" fill="var(--ok)" font-family="ui-monospace,monospace">Process finished with exit code 0</text>' +
'  <rect x="520" y="10" width="130" height="150" fill="none" stroke="var(--line2)"/>' +
'  <text x="532" y="32" font-size="11" fill="var(--text3)" font-family="ui-monospace,monospace">VARIABLES</text>' +
'  <text x="532" y="60" font-size="11" fill="var(--text2)" font-family="ui-monospace,monospace">i = 3</text>' +
'  <text x="532" y="80" font-size="11" fill="var(--text2)" font-family="ui-monospace,monospace">sum = 6</text>' +
'  <text x="532" y="100" font-size="11" fill="var(--text2)" font-family="ui-monospace,monospace">board = char[15][15]</text>' +
'  <text x="532" y="134" font-size="10" fill="var(--text3)">调试时看这里</text>' +
'  <text x="20" y="200" font-size="10" fill="var(--text3)">左：文件</text>' +
'  <text x="20" y="218" font-size="10" fill="var(--text3)">中：代码</text>' +
'  <text x="20" y="236" font-size="10" fill="var(--text3)">下：输出</text>' +
'</svg>',
      caption: '四个区域：左边 Project 树、中间 Editor（行号旁是 gutter）、下边 Run/Debug、右边 Variables' },

    { t: 'p', html:
      '界面记四个区域就够：<b>Project</b>（管文件）、<b>Editor</b>（写代码，行号条叫 gutter）、<b>Run/Debug</b>（看输出与报错）、' +
      '<b>Variables</b>（调试时看变量）。运行结束那行 <code>exit code 0</code> 表示正常；非 0 表示异常退出，先去 Run 窗口读异常栈第一行。'
    },

    /* ------------------------------------------------------------------ 三、运行第一个程序 */
    { t: 'h', text: '三、运行第一个程序：编译与执行', id: 'ch01-3' },

    { t: 'p', html:
      '点绿色三角时 IDE 做两件事：先用 <b>JDK 的编译器</b>把 <code>.java</code> 编成 <code>.class</code>，再用 <b>JVM</b> 执行。' +
      '编译阶段抓语法错误（少分号、类型不匹配、名字拼错），编辑器里是红色波浪线；运行阶段才出现崩溃（越界、空指针、除零），' +
      '在 Run 窗口显示异常栈。很多同学把红线当「程序坏了」，其实只是还没编译通过——从下往上逐个修即可。'
    },

    { t: 'compare', left: {
      title: '编译错误（compile error）',
      html: '代码没变成 <code>.class</code>，程序<b>一次都不会跑</b>。',
      code: 'int x = "hello";      // 类型不匹配\nSystem.out.println(y); // 找不到 y'
    }, right: {
      title: '运行时错误（runtime error）',
      html: '编译通过、程序启动，执行到某行才崩；能看到异常类型与栈。<b>这一类才需要调试器</b>。',
      code: 'int[] a = new int[3];\nSystem.out.println(a[3]);  // 越界'
    } },

    /* ------------------------------------------------------------------ 四、断点与变量窗 */
    { t: 'h', text: '四、断点与变量窗', id: 'ch01-4' },

    { t: 'p', html:
      '<b>断点（breakpoint）</b>是「跑到这一行先停一下」的标记。讲义原文：' +
      '<b>Breakpoints are set by hovering the mouse over the gutter area and clicking on it</b>——' +
      '鼠标移到行号条上单击出现红点，再点取消。点右上角甲虫图标（Debug）启动，程序在红点处暂停，' +
      '这一行<b>还没执行</b>，Variables 窗列出当前作用域所有变量此刻的值。'
    },

    { t: 'code', caption: 'DebugSum.java · 循环求 1..n；在 for 行下断点，Step over 看 i 与 sum 怎么变', run: true, trace: true, code:
`public class DebugSum {
    public static void main(String[] args) {
        int n = 5;
        int sum = 0;

        for (int i = 1; i < n; i++) {   // 断点：Step over 反复走
            sum = sum + i;
        }

        System.out.println("sum = " + sum);   // 期望 15，实际 10
    }
}
` },

    { t: 'p', html:
      '输出是 <code>sum = 10</code>，而 1+2+3+4+5 应为 15。下断点反复 Step over，变量窗依次显示 ' +
      '<code>i=1, sum=1</code> → <code>i=2, sum=3</code> → <code>i=3, sum=6</code> → <code>i=4, sum=10</code>，然后条件 <code>i &lt; 5</code> 不成立退出。' +
      '<b>i 从没取到 5</b>——边界条件应是 <code>i &lt;= n</code>。点「单步」可以自己走一遍这个循环。'
    },

    { t: 'callout', kind: 'warn', title: '断点的三个误会', html:
      '① 断点暂停时高亮行表示<b>即将执行</b>，变量窗是执行前的值；<br>' +
      '② 红点一直不生效，多半是程序根本没走到（循环提前结束、分支没进），不是断点坏了；<br>' +
      '③ 调完忘了删断点，下次又在老地方停下，看起来像程序卡住。'
    },

    /* ------------------------------------------------------------------ 五、Step 与 Alt+F8 */
    { t: 'h', text: '五、Step over/into/out、Resume 与 Alt+F8', id: 'ch01-5' },

    { t: 'p', html:
      '暂停之后怎么往下走有四个动作，讲义定义很精确：<b>Step over</b> 不进入被调方法，直接到本方法下一行；' +
      '<b>Step into</b> 遇到方法调用钻进去；<b>Step out</b> 跑完当前方法回到调用处；<b>Resume Program</b> 继续执行到下一个断点或结束（ignoring the breakpoint）。' +
      '快捷键 F8 / F7 / Shift+F8 / F9。'
    },

    { t: 'table',
      head: ['动作', '快捷键', '什么时候用', '项目里的场景'],
      rows: [
        ['<b>Step over</b>', '<code>F8</code>', '只看本方法流程', '循环里逐行看 <code>i</code> 与 <code>sum</code>'],
        ['<b>Step into</b>', '<code>F7</code>', '怀疑问题在被调方法里', '钻进 <code>move()</code> 看坐标校验'],
        ['<b>Step out</b>', '<code>Shift+F8</code>', '方法里看明白了，回上层', '从 <code>checkWin()</code> 回 <code>move()</code>'],
        ['<b>Resume</b>', '<code>F9</code>', '只停在下一个断点', '跳过已知正常的初始化'],
        ['<b>Alt+F8</b>', '—', '不前进，临时算表达式', '算 <code>board[r][c]</code>、调 <code>checkWin()</code>']
      ],
      caption: '快捷键按 Windows/Linux 列；macOS 通常换成 ⌥/⌘ 组合' },

    { t: 'code', caption: 'DebugMethod.java · 在 add(a, b) 行下断点，F7 钻进 add，Shift+F8 回 main', run: true, trace: true, code:
`public class DebugMethod {
    public static void main(String[] args) {
        int a = 3;
        int b = 4;
        int result = add(a, b);
        System.out.println("result = " + result);
    }

    static int add(int x, int y) {
        int s = x + y;
        return s;
    }
}
` },

    { t: 'p', html:
      '在 <code>add(a, b)</code> 那行下断点按 F7，会跳进 <code>add</code>，变量窗同时显示两层：外层 <code>a=3, b=4</code>，内层 <code>x=3, y=4</code>——' +
      '这一瞬间就看懂了「值怎么传进去」。Shift+F8 回到 <code>main</code>，<code>result</code> 已是 7。Debug 窗口里那张从上往下的列表就是<b>调用栈（call stack）</b>，最上面是当前方法。' +
      'Tutorial 1 专门用一页讲 <b>Alt+F8</b>：在 Variables 区按 Alt+F8 弹出求值窗口，可访问局部与全局变量，相当于调试控制台。' +
      '断在 <code>move(r, c)</code> 里输入 <code>board[r][c]</code> 看这格有没有子，输入 <code>checkWin(r, c)</code> 直接问「落这里会不会赢」——不用改代码、不用重跑。'
    },

    /* ------------------------------------------------------------------ 六、Maven */
    { t: 'h', text: '六、Maven 与 pom.xml', id: 'ch01-6' },

    { t: 'p', html:
      '<b>Maven</b> 是 Java 的项目管理与构建工具，核心是 <b>POM（Project Object Model）</b>：用一个 <code>pom.xml</code> 描述「项目是谁、依赖哪些 jar、怎么打包」。' +
      '讲义列了三大功能：<b>Adding a set of Jars in each project</b>、<b>Creating the right project structure</b>、<b>Building and Deploying the project</b>。' +
      '没有 Maven 时要手动下 jar、拖进 <code>lib/</code>、逐个加 classpath；有了 Maven，只在 <code>pom.xml</code> 写几行依赖，它自己下载。'
    },

    { t: 'code', caption: 'pom.xml · 一个最小配置（目录示意，不是 Java 代码）', code:
`<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>

  <groupId>edu.cuhk.csc1004</groupId>   <!-- 组织/包名 -->
  <artifactId>gomoku</artifactId>      <!-- 项目名 -->
  <version>1.0-SNAPSHOT</version>      <!-- 版本号 -->
  <packaging>jar</packaging>           <!-- 打包成 jar -->

  <properties>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
  </properties>
</project>
` },

    { t: 'p', html:
      '讲义逐项解释过：<code>project</code> 是根元素，<code>modelVersion</code> 固定 4.0.0，' +
      '<code>groupId</code> 是项目组 id，<code>artifactId</code> 是项目 id，<code>version</code> 是版本，' +
      '<code>packaging</code> 是打包类型（jar / war），<code>dependencies</code> 与 <code>dependency</code> 定义依赖，' +
      '<code>scope</code> 是依赖作用域（compile / provided / runtime / test / system）。' +
      '<code>groupId:artifactId:version</code> 三段合起来，是 Maven 世界里一个构件的唯一坐标。'
    },

    { t: 'callout', kind: 'warn', title: '改了 pom.xml 必须重新加载', html:
      'IntelliJ 右上角会出现 <b>Maven 刷新</b>图标（两个箭头绕圈），点一下才会重新解析依赖；不点的话新依赖在编辑器里仍是红的。' +
      '这是「pom 里写了却 import 不到」的第一原因。Maven 项目与非 Maven 项目的区别也不只是 <code>pom.xml</code>：' +
      '依赖、构建、打包全由 Maven 管，非 Maven 项目靠 IDE 自己配，换台电脑就得重配。'
    },

    /* ------------------------------------------------------------------ 七、Maven 生命周期 */
    { t: 'h', text: '七、Maven 生命周期', id: 'ch01-7' },

    { t: 'p', html:
      'Maven 把「构建项目」拆成固定流水线，叫<b>生命周期（lifecycle）</b>。讲义列的顺序是：' +
      '<code>clean</code> → <code>validate</code> → <code>compile</code> → <code>test</code> → <code>package</code> → ' +
      '<code>verify</code> → <code>install</code> → <code>site</code> → <code>deploy</code>。' +
      '关键规则只有一句：<b>执行某阶段时，它前面的阶段自动先执行</b>。敲 <code>mvn package</code> 会先 validate、compile、test，最后才打包；测试失败就不打包。'
    },

    { t: 'table',
      head: ['阶段', '讲义里的职责', '在本课程项目里'],
      rows: [
        ['<code>clean</code>', 'Remove all files generated by the previous build', '删 <code>target/</code>，专治「改了没生效」'],
        ['<code>validate</code>', 'Validate the project is correct and information is available', '检查 <code>pom.xml</code> 完整'],
        ['<code>compile</code>', 'Compile the source code of the project', '把 <code>src/main/java</code> 编成 <code>.class</code>'],
        ['<code>test</code>', 'Run tests using a suitable unit testing framework', '跑单元测试，失败就停'],
        ['<code>package</code>', 'Package it in its distributable format, such as a JAR', '产出 <code>target/xxx.jar</code>'],
        ['<code>verify</code>', 'Run checks to verify the package is valid', '校验打包结果'],
        ['<code>install</code>', 'Install the package into the local repository', '装进 <code>~/.m2</code> 供别的项目用'],
        ['<code>site</code>', 'Generate the project site documentation', '生成项目文档'],
        ['<code>deploy</code>', 'Copies the final package to the remote repository', '发布到远程仓库，课程一般不用']
      ],
      caption: '不必死记，记住「clean 最前、compile 在 test 前、package 在测试之后」即可' },

    { t: 'code', caption: '终端里的 Maven 命令（示意，不是 Java 代码）', code:
`mvn clean           # 删除 target/，清空上一次构建产物
mvn compile         # 只编译，不测试、不打包
mvn test            # 编译 + 跑测试
mvn package         # 编译 + 测试 + 打包成 jar（target/*.jar）
mvn install         # 在 package 基础上装进本地仓库
mvn clean package   # 先清空，再完整打包：交作业前的标准动作
` },

    { t: 'p', html:
      'IntelliJ 右侧 <b>Maven</b> 面板 → Lifecycle 也列着这九个阶段，双击即可执行，效果与命令行一样。' +
      '项目里最常用 <code>clean</code> 与 <code>package</code>：交作业前跑一次 <code>mvn clean package</code>，能把「本机能跑、别人机器不能跑」提前暴露。'
    },

    { t: 'callout', kind: 'warn', title: 'target/ 是产物，不是源码', html:
      '<code>target/</code> 里全是编译、测试、打包产物，删了能重新生成，所以<b>不提交、不手改、不往源码目录复制</b>。' +
      '「我的类文件去哪了」的答案就在这里：源文件改了但没重新编译，<code>target/classes</code> 里还是旧 <code>.class</code>。'
    },

    /* ------------------------------------------------------------------ 八、目录结构 + PyCharm */
    { t: 'h', text: '八、项目目录结构与 PyCharm 环境', id: 'ch01-8' },

    { t: 'code', caption: 'Maven 项目目录结构（示意）', code:
`Gomoku/
├── pom.xml                    ← 项目身份证：坐标、依赖、打包方式
├── src/
│   ├── main/
│   │   ├── java/              ← 源码根目录，包名从下一层开始
│   │   │   └── edu/cuhk/csc1004/
│   │   │       ├── Main.java
│   │   │       └── GomokuGame.java
│   │   └── resources/         ← 图片、字体等资源
│   └── test/java/             ← 单元测试源码（与 main 对称）
├── target/                    ← 构建产物（可删）
└── .idea/                     ← IntelliJ 本机配置（换机重建）
` },

    { t: 'p', html:
      '<b>package（包）</b>是 Java 的命名空间，写法是文件顶部 <code>package edu.cuhk.csc1004;</code>；' +
      '<code>src/main/java</code> 下的<b>子目录层级必须与包名一致</b>，包叫 <code>edu.cuhk.csc1004</code>，文件就在 <code>edu/cuhk/csc1004/</code> 里，否则编译报「package 不存在」。' +
      '项目里可以拆成多个包，比如 <code>model</code>、<code>view</code>、<code>network</code>，后面讲类设计时再展开。'
    },

    { t: 'compare', left: {
      title: 'Java / Maven 项目',
      html: '<code>src/main/java</code> 放源码，<code>pom.xml</code> 管依赖，<code>target/</code> 是产物，JVM 跑 <code>.class</code>。'
    }, right: {
      title: 'Python / PyCharm 项目',
      html: '<code>.py</code> 按目录放，解释器由 PyCharm 配置；依赖写 <code>requirements.txt</code>，<code>.venv/</code> 是虚拟环境。'
    } },

    { t: 'p', html:
      '<b>PyCharm</b> 是 JetBrains 的 Python IDE，界面与 IntelliJ 同一套逻辑（Project 树、编辑器、Run 窗口、断点调试都一样），' +
      '本章的调试手法能直接迁移到第三个 Python 项目。差别在环境：Java 依赖由 Maven 管，Python 依赖由 <b>pip</b> 装进某个<b>解释器（interpreter）</b>，' +
      'PyCharm 里要指定用哪个解释器，通常选项目内的<b>虚拟环境（venv，virtual environment）</b>——给这个项目单独一套 Python 与第三方库，装什么都不影响系统。' +
      '遇到 <code>ModuleNotFoundError</code>，九成是「装进了另一个解释器」，去 Settings → Project → Python Interpreter 确认。'
    },

    { t: 'callout', kind: 'note', title: '真实项目怎么用这一章', html:
      'Chat Zoom 与 Gomoku 都是 Maven 项目：源码放 <code>src/main/java</code>，用 <code>mvn clean package</code> 验证能打包，运行与调试都在 IntelliJ。' +
      'Snake 是 PyCharm 项目：一个 <code>.py</code> 文件加 Tkinter，断点、Step over、Variables 用法与 Java 完全同构。' +
      '三个项目交作业都要附运行录像，环境错了录像里全是报错。'
    },

    /* ------------------------------------------------------------------ 交互 */
    { t: 'p', html: '把按钮动手过一遍比读十遍讲义有效。下面这个调试器导览把断点、Step over/into、变量窗做成可点击流程：' },

    { t: 'lab', id: 'ide' },

    { t: 'p', html: '再用三道题检查一下生命周期顺序与调试动作：' },

    { t: 'quiz', qid: 'ch01-q1' },

    { t: 'quiz', qid: 'ch01-q2' },

    { t: 'quiz', qid: 'ch01-q3' },

    /* ------------------------------------------------------------------ 章末 */
    { t: 'keypoint', items: [
      { title: '环境三件套', html: 'IDE 是工作台，JDK 提供 <code>javac</code> 与标准库，JVM 执行字节码；版本要对齐。' },
      { title: '四个区域', html: 'Project 管文件、Editor 写代码、Run/Debug 看输出、Variables 调试看变量；gutter 点红点设断点。' },
      { title: '四个动作', html: '<code>F8</code> Step over 逐行、<code>F7</code> Step into 钻进方法、<code>Shift+F8</code> Step out 回上层、<code>F9</code> Resume 跑到下一个断点。' },
      { title: 'Alt+F8', html: '暂停时求值：查 <code>board[r][c]</code>、算表达式、调方法，相当于调试控制台。' },
      { title: 'Maven', html: '<code>pom.xml</code> 描述项目；生命周期 <code>clean → validate → compile → test → package → verify → install</code>；后面的阶段会先跑前面的。' },
      { title: '目录', html: '<code>src/main/java</code> 是源码（包名与目录一致），<code>target/</code> 是产物，<code>.idea/</code> 是本机配置。' },
      { title: 'PyCharm', html: '与 IntelliJ 同构的 Python IDE；关键是解释器与 venv 选对，否则 <code>ModuleNotFoundError</code>。' }
    ] },

    { t: 'checklist', id: 'ch01', items: [
      '我能独立安装 IntelliJ IDEA 并新建、运行一个 Java 项目',
      '我能说出 JDK、JRE、JVM 的区别，以及 IDE 在中间做了什么',
      '我能描述 Project / Editor / Run / Variables 四个区域各自的用途',
      '我能设置断点并用 Variables 窗读出循环里每个变量的值',
      '我能分辨 Step over、Step into、Step out、Resume 并各举一个使用场景',
      '我能用 Alt+F8 求值，说出它比改代码重跑省了什么',
      '我能按顺序说出 Maven 生命周期，并解释 <code>mvn package</code> 先做什么',
      '我能画出 Maven 项目目录，指出源码、产物、配置各在哪',
      '我能说出 Maven 项目与 PyCharm/Python 项目在依赖管理上的区别'
    ] },

    { t: 'callout', kind: 'exam', title: '考试怎么考这一章', html:
      '期末不考「怎么点按钮」，但会考背后的概念，常见于 Part I 选择与 Part II 判断：' +
      '① <b>JDK / JRE / JVM 的关系</b>——「只装 JRE 能不能编译 Java 源码？」不能，JRE 没有 <code>javac</code>。' +
      '② <b>生命周期顺序</b>——问哪个阶段先执行，或「<code>mvn package</code> 会不会跑测试」（会）。' +
      '③ <b>clean 的作用</b>——判断题「clean 会删除源码」错，删的是构建产物。' +
      '④ <b>调试动作语义</b>——「Step into 会跳过方法」「Step over 会进入方法」都错，两个定义最爱互换着考。' +
      '⑤ <b>目录</b>——<code>.class</code> 出现在 <code>target/</code>，源码在 <code>src/main/java</code>。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '环境问题很适合问 AI，但它看不到你的屏幕，提示词要把症状写全：' +
      '「IntelliJ 新建 Maven 项目，JDK 选 21，<code>mvn clean package</code> 报 <code>invalid target release: 21</code>，系统只装了 JDK 17，pom 里 source/target 写的 21。根因和最省事的修法？」' +
      '这样通常一次就能得到可用答案。要自己验证三点：① 它给的命令在<b>你的项目根目录</b>是否同样报错；② 它建议改的 <code>pom.xml</code> 元素是否真的存在；' +
      '③ 修完后 <code>mvn clean package</code> 是否真的从失败变成功。别让 AI 直接替你点菜单——这一章的能力期末会以概念题出现。'
    }

  ]
});
