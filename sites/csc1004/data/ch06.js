/* =====================================================================
 * data/ch06.js · 第 06 章：Java I/O 与流
 * 职责：Stream 概念、OutputStream/InputStream 字节流、DataInputStream/DataOutputStream
 *       （readUTF/writeUTF/flush）、InputStreamReader 字节↔字符桥、BufferedReader 与
 *       readLine、读到 stop 为止的例子、包装链逐层拆解、常见误区。
 * 对外 API：CSC.registerChapter({...})（block schema 见 _dev/CONTRACT.md §4–§5）
 * 注意：本站引擎不支持 I/O，本章代码一律 run:false；机制由 lab「streams」演示。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch06',
  num: '06',
  title: 'Java I/O 与流',
  en: 'Java I/O & Streams',
  goals: [
    '能用「流是一串有顺序的字节」解释 Java 的输入输出，并说清输入流与输出流的方向',
    '能区分字节流与字符流，说出为什么网络程序不能直接把 String 交给 OutputStream',
    '能用 DataInputStream / DataOutputStream 的 readUTF / writeUTF 读写字符串，并解释 flush() 的作用',
    '能写出用 InputStreamReader 桥接 System.in、再用 BufferedReader.readLine 逐行读取的程序',
    '能从内往外拆开 BufferedWriter(new OutputStreamWriter(socket.getOutputStream))，说出每一层的职责'
  ],
  kp: [
    { id: 'ch06-1', title: '流 stream：有方向的字节序列' },
    { id: 'ch06-2', title: '字节流 OutputStream 与 InputStream' },
    { id: 'ch06-3', title: '数据流 readUTF / writeUTF 与 flush' },
    { id: 'ch06-4', title: 'InputStreamReader：字节↔字符的桥' },
    { id: 'ch06-5', title: 'BufferedReader 缓冲与 readLine' },
    { id: 'ch06-6', title: '包装链：聊天室里那一行' },
    { id: 'ch06-7', title: '常见误区：null 与 flush' },
    { id: 'ch06-8', title: 'I/O 能力在聊天室项目里的位置' }
  ],
  blocks: [

    /* ------------------------------------------------------------------ 开篇 */
    { t: 'callout', kind: 'why', html:
      '聊天室第一次联调，最常见的怪事是：<b>消息发出去了，对方却没反应</b>。Socket 明明连上了，' +
      '<code>sendMessage()</code> 也执行了，可服务器的控制台一行字都不出来。把日志加到每一行才发现，' +
      '问题出在 <code>BufferedWriter</code>：消息被写进了缓冲区，却<b>忘了 flush</b>，一直躺在内存里，' +
      '网络的另一端永远等不到它。<br>' +
      '这类问题没法靠盯着 Socket 代码解决，因为真正决定收发行为的，是本章的主角——<b>流（stream）</b>。' +
      '这一章要讲清三件事：流是什么、字节流与字符流差在哪、为什么网络编程里总要「包一层、再包一层」，' +
      '把 <code>BufferedWriter(new OutputStreamWriter(socket.getOutputStream()))</code> 这样一行绕口令，' +
      '一步步拆成能看懂的三层。'
    },

    { t: 'p', lead: true, html:
      '先看一段最小程序：从控制台读一行名字，再打印一句欢迎。它只有十几行，却把本章所有角色都请上了场。'
    },

    { t: 'code', run: false, caption: 'ConsoleEcho.java · 读一行，打印一句（对应讲义 "Read data from the console"）', code:
`import java.io.*;

public class ConsoleEcho {
    public static void main(String[] args) throws IOException {
        // System.in 是字节流：先桥成字符流，再套缓冲
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));

        System.out.print("Enter your name: ");
        String name = reader.readLine();          // 读一整行，不含行末换行符
        System.out.println("Welcome " + name);
    }
}
` },

    { t: 'p', html:
      '输出是 <code>Enter your name: </code> 后面跟着你输入的名字，第二行是 <code>Welcome Alice</code>。' +
      '注意这三个对象是<b>套</b>在一起的：<code>System.in</code> 是最底层的字节流，' +
      '<code>InputStreamReader</code> 把它桥接成字符流，<code>BufferedReader</code> 再套在最外面提供 ' +
      '<code>readLine()</code>。少任何一层，这段程序都写不成现在这么短。'
    },

    { t: 'p', html:
      '本章路线：先讲清流（一）与字节流（二），再学能直接读写字符串的数据流（三）；' +
      '然后用 <code>InputStreamReader</code> 完成字节到字符的桥接（四），用 <code>BufferedReader</code> ' +
      '拿到按行读取的能力（五）；接着把聊天室里的那一行逐层拆开（六），归纳常见误区（七），' +
      '最后回到项目里看这两条包装链（八）。'
    },

    /* ------------------------------------------------------------------ 一、流 */
    { t: 'h', text: '一、流：一条有方向的字节序列', id: 'ch06-1' },

    { t: 'p', html:
      '<b>流（stream）</b>是「有顺序的一串数据」：像水管里的水，从一头进来、从另一头出去，只能按顺序处理。' +
      'Java 把一切输入输出都抽象成流——读文件是从流里取数据，写文件是往流里放数据，网络收发同样如此。' +
      '讲义的定义是 "A stream is a sequence of data"：<b>流的底层单位永远是字节（byte）</b>，字符、字符串都是字节上层的包装。'
    },

    { t: 'p', html:
      '流有<b>方向</b>：程序从外部取数据用<b>输入流（input stream）</b>，把数据送出去用<b>输出流（output stream）</b>。' +
      '这个方向是站在<b>程序</b>的角度说的——<code>InputStream</code> 永远是「读进来」，' +
      '<code>OutputStream</code> 永远是「写出去」。讲义同时强调：输出流的目的地可以是文件、数组或 <b>socket</b>，' +
      '输入流的来源同样可以是文件、数组或 socket——所以网络连接最终也只是两根流。'
    },

    { t: 'terms', cols: 3, items: [
      { en: 'stream', zh: '流', html: '有顺序的一串数据，只能顺着读或顺着写。' },
      { en: 'byte', zh: '字节', html: '流的最小单位，8 位；网络上传的就是它。' },
      { en: 'input stream', zh: '输入流', html: '程序从外部「读进来」的流。' },
      { en: 'output stream', zh: '输出流', html: '程序向外部「写出去」的流。' },
      { en: 'character stream', zh: '字符流', html: '在字节之上按编码处理文本的流。' },
      { en: 'buffer', zh: '缓冲区', html: '先攒一批数据再搬，减少真实读写次数。' }
    ] },

    { t: 'p', html:
      'Java 的 I/O 分三层，后一层包住前一层，这叫<b>包装（wrap）</b>：' +
      '<b>字节流</b>负责搬原始字节；<b>字符流</b>负责按编码在字节与字符之间转换；' +
      '<b>缓冲流</b>负责攒一批再搬，并提供按行读写这类便利方法。'
    },

    { t: 'compare', left: {
      title: '<code>OutputStream</code> / <code>InputStream</code>（字节流）',
      html: '只搬字节，不认识字符；写文本要自己转成 <code>byte[]</code>，读回来要自己拼字符。',
      code: 'out.write("hi".getBytes());\nint b = in.read();      // 0–255 或 −1'
    }, right: {
      title: '<code>Reader</code> / <code>Writer</code>（字符流）',
      html: '按编码把字节解释成字符，能直接读写 <code>String</code>，按行读也靠它。',
      code: 'writer.write("hi");\nString line = reader.readLine();'
    } },

    /* ------------------------------------------------------------------ 二、字节流 */
    { t: 'h', text: '二、字节流：OutputStream 与 InputStream', id: 'ch06-2' },

    { t: 'p', html:
      '<b>OutputStream</b> 与 <b>InputStream</b> 是最基础的两个类，它们只认字节。' +
      '<code>OutputStream</code> 提供 <code>write(int)</code>（写一个字节）、<code>write(byte[])</code>' +
      '（写一批字节）、<code>flush()</code>（把缓冲的数据推出去）、<code>close()</code>（用完关闭）；' +
      '<code>InputStream</code> 提供 <code>read()</code>，返回一个 0–255 的整数，读到末尾返回 <b>−1</b>。'
    },

    { t: 'code', run: false, caption: 'ByteStreamDemo.java · 字节流只搬运字节：写入，再一个字节一个字节读回来', code:
`import java.io.*;

public class ByteStreamDemo {
    public static void main(String[] args) throws IOException {
        // 1) 字节输出流：往文件写内容
        OutputStream out = new FileOutputStream("hello.txt");
        out.write('H');
        out.write('i');
        out.flush();            // 把缓冲的数据真正推出去
        out.close();

        // 2) 字节输入流：一次读一个字节，末尾返回 -1
        InputStream in = new FileInputStream("hello.txt");
        int b = in.read();
        while (b != -1) {
            System.out.print((char) b);
            b = in.read();
        }
        in.close();
    }
}
` },

    { t: 'p', html:
      '输出是 <code>Hi</code>。注意两点：① <code>write(\'H\')</code> 传进去的是字符，但流只认它的编码值，' +
      '<b>字节流不关心你写的是什么文本</b>；② <code>read()</code> 返回 <code>int</code> 而不是 <code>byte</code>，' +
      '就是为了留出空间表示「没有更多数据」的信号 <b>−1</b>。'
    },

    { t: 'callout', kind: 'warn', title: '字节不等于字符', html:
      '一个英文字母在 UTF-8 里占 1 个字节，一个汉字通常占 <b>3 个字节</b>。如果按字节读中文再 <code>(char)</code> 强转，' +
      '就会读到半个字、打印出乱码。所以<b>处理文本时永远不要直接用字节流</b>：先用 <code>InputStreamReader</code> ' +
      '把字节解码成字符，再套 <code>BufferedReader</code>。记住分工：字节流负责搬运，字符流负责解释。'
    },

    /* ------------------------------------------------------------------ 三、数据流 */
    { t: 'h', text: '三、数据流：readUTF / writeUTF 与 flush', id: 'ch06-3' },

    { t: 'p', html:
      '<b>DataInputStream</b> 与 <b>DataOutputStream</b> 是<b>过滤器流（filtered stream）</b>：' +
      '它们不直接连文件或网络，而是包在别的流外面，把一串字节翻译成更大的数据单位——字符串和基本类型，' +
      '也就是讲义说的 "strings and primitive data types that comprise more than a byte"。' +
      '<code>writeUTF()</code> 把一个 Java <code>String</code> 按 <b>UTF-8</b> 写成字节，' +
      '<code>readUTF()</code> 再按同样的格式还原成字符串；<code>DataOutputStream</code> 还有 ' +
      '<code>writeInt</code>、<code>writeDouble</code> 等方法。'
    },

    { t: 'code', run: false, caption: 'DataStreamDemo.java · writeUTF / writeInt 写入，readUTF / readInt 按同样顺序读出', code:
`import java.io.*;

public class DataStreamDemo {
    public static void main(String[] args) throws IOException {
        // 写：FileOutputStream 负责字节，DataOutputStream 负责字符串和基本类型
        DataOutputStream out = new DataOutputStream(new FileOutputStream("msg.dat"));
        out.writeUTF("Alice");
        out.writeInt(1004);
        out.flush();                 // 不 flush，数据可能还卡在缓冲区里
        out.close();

        // 读：顺序必须和写的时候完全一致
        DataInputStream in = new DataInputStream(new FileInputStream("msg.dat"));
        System.out.println(in.readUTF());
        System.out.println(in.readInt());
        in.close();
    }
}
` },

    { t: 'p', html:
      '输出 <code>Alice</code> 和 <code>1004</code>。三个要点：① 读和写的<b>顺序必须完全一致</b>——' +
      '先 writeUTF 再 writeInt，读的时候也必须先 readUTF 再 readInt，流没有「按名字查找」的能力；' +
      '② 写完一定要 <code>flush()</code>，否则数据可能还留在缓冲区里；③ 讲义特别点明 ' +
      '<code>readUTF()</code> 与 <code>writeUTF()</code> 用的是 <b>UTF-8</b> 编码，两端编码一致才不会乱码。'
    },

    { t: 'callout', kind: 'tip', title: 'flush 到底在做什么', html:
      '<code>flush()</code> 不是「发送一个特殊消息」，而是命令缓冲层「<b>现在就把攒着的数据都交出去</b>」。' +
      '对 socket 输出流，它把数据推给网络。不写 flush 不一定出错——缓冲区满了会自动发——' +
      '但聊天要「立刻看到」，延迟就表现成消息收不到。'
    },

    /* ------------------------------------------------------------------ 四、InputStreamReader */
    { t: 'h', text: '四、桥：InputStreamReader', id: 'ch06-4' },

    { t: 'p', html:
      '<b>InputStreamReader</b> 的职责只有一个：<b>桥接字节流与字符流</b>。它包在一个字节输入流外面，' +
      '内部按<b>编码（encoding）</b>把读到的字节解码成字符，是「包在底层字节流外面的字符流」。' +
      '当你把 <code>InputStreamReader</code> 包在 <code>System.in</code> 上时，它就用默认编码把键盘输入的字节转成字符。'
    },

    { t: 'code', run: false, caption: 'BridgeDemo.java · 用 InputStreamReader 把 System.in 从字节流变成字符流', code:
`import java.io.*;

public class BridgeDemo {
    public static void main(String[] args) throws IOException {
        // 只桥一层：一次读一个字符
        InputStreamReader reader = new InputStreamReader(System.in);
        System.out.println("Enter data:");
        int c = reader.read();               // 返回一个字符的整数值，末尾返回 -1
        System.out.println("first char: " + (char) c);
    }
}
` },

    { t: 'p', html:
      '输入 <code>hello</code>，输出 <code>first char: h</code>。这段程序能用，但很笨：<b>逐字符读</b>意味着' +
      '每读一个字都要碰一次底层设备，也没法按行判断输入是否结束。真实程序不会这么写，' +
      '而是在桥后面再套一层<b>缓冲</b>——这就是下一节。'
    },

    /* ------------------------------------------------------------------ 五、BufferedReader */
    { t: 'h', text: '五、缓冲：BufferedReader 与 readLine', id: 'ch06-5' },

    { t: 'p', html:
      '<b>BufferedReader</b> 给流加一个<b>缓冲区（buffer）</b>：一次从底层读一大块放进内存，' +
      '程序要数据时先看缓冲区里有没有。讲义说它 "increase efficiency by reducing the number of physical ' +
      'read or write operations"——减少真正访问设备的次数。更重要的是它提供了 <code>readLine()</code>：' +
      '一次返回一整行文本，不含行末的换行符。'
    },

    { t: 'code', run: false, caption: 'ReadUntilStop.java · 一直读到输入 stop 为止（对应讲义 "until the user writes stop"）', code:
`import java.io.*;

public class ReadUntilStop {
    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));

        System.out.print("Enter data: ");
        String data = reader.readLine();
        while (data != null && !data.equals("stop")) {
            System.out.println("data is: " + data);
            System.out.print("Enter data: ");
            data = reader.readLine();
        }
        System.out.println("bye");
    }
}
` },

    { t: 'p', html:
      '输入 <code>Nakul</code> 再输入 <code>12</code>，输出就是 <code>data is: Nakul</code>、<code>data is: 12</code>，' +
      '输入 <code>stop</code> 时循环结束。这里的关键是：<code>readLine()</code> 读到<b>换行符</b>才认为一行结束，' +
      '所以发送端一定要写换行（<code>newLine()</code> 或写一个换行符），否则接收端的 <code>readLine()</code> ' +
      '会一直等下去。'
    },

    { t: 'callout', kind: 'warn', title: 'readLine() 返回 null 是什么意思', html:
      '<code>readLine()</code> 在<b>流结束</b>（对方关闭连接、文件读完、控制台输入结束）时返回 <code>null</code>，' +
      '它<b>不会</b>返回空字符串 <code>""</code>。空行返回的是 <code>""</code>，只有「真的没数据了」才返回 <code>null</code>。' +
      '所以循环应当写成 <code>while ((line = reader.readLine()) != null)</code>，再在循环体里判断是不是 <code>stop</code>。' +
      '常见错法是 <code>while (reader.readLine() != null)</code> 却在循环体里又调一次 <code>readLine()</code>，' +
      '每行被读掉两次；或者拿 <code>null</code> 去调 <code>equals</code>，直接抛 <code>NullPointerException</code>。'
    },

    /* ------------------------------------------------------------------ 六、包装链 */
    { t: 'h', text: '六、拆开聊天室里的那一行', id: 'ch06-6' },

    { t: 'p', html:
      'Tutorial 3 里那行「绕口令」是这样写的：' +
      '<code>BufferedWriter(new OutputStreamWriter((socket.getOutputStream())))</code>。' +
      '读它的方法是<b>从最内层往外读</b>：<code>socket.getOutputStream()</code> 拿到字节流；' +
      '<code>new OutputStreamWriter(...)</code> 把字节流桥成字符流；最外层 <code>new BufferedWriter(...)</code> ' +
      '加缓冲并提供 <code>newLine()</code>。三层各司其职。'
    },

    { t: 'flow', nodes: [
      { title: 'socket.getOutputStream()', desc: '字节流：网络只能传字节', kind: 'start' },
      { title: 'new OutputStreamWriter(...)', desc: '字符流：按编码把字符变成字节', kind: 'proc' },
      { title: 'new BufferedWriter(...)', desc: '缓冲流：攒一批、newLine()、flush()', kind: 'end' }
    ] },

    { t: 'codegroup', tabs: [
      { label: '① 只有字节流', run: false, code:
`OutputStream raw = socket.getOutputStream();   // 只能写字节
raw.write("hello".getBytes());                 // 自己转字节，麻烦且容易漏
raw.flush();
` },
      { label: '② 包成字符流', run: false, code:
`OutputStreamWriter writer = new OutputStreamWriter(socket.getOutputStream());
writer.write("hello");                         // 能直接写 String 了
writer.flush();
` },
      { label: '③ 再包一层缓冲（项目写法）', run: false, code:
`BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
writer.write("hello");
writer.newLine();                              // 写换行，对方 readLine() 才能读到一行
writer.flush();                                // 不 flush，消息可能一直留在缓冲区
` }
    ] },

    { t: 'p', html:
      '逐层看职责：① 最内层是<b>字节流</b>，因为网络只能传字节，<code>socket.getOutputStream()</code> 给你的是' +
      '一个只能 <code>write(int)</code> / <code>write(byte[])</code> 的对象，直接把 <code>String</code> 交给它编译' +
      '都过不了；② <code>OutputStreamWriter</code> 是<b>字符流</b>，它接受 <code>String</code>，内部按编码把字符' +
      '变成字节再交给内层；③ <code>BufferedWriter</code> 是<b>缓冲流</b>，先把内容攒在缓冲区里，攒够了或你调用 ' +
      '<code>flush()</code> 时才真正发送。'
    },

    { t: 'p', html:
      '于是发送一行文本成了固定三步：<b>write 写内容 → newLine 补换行 → flush 推出去</b>。少一个都不行：' +
      '不写 newLine，对方的 <code>readLine()</code> 不知道这一行结束了；不 flush，消息留在缓冲区，对方可能永远收不到。' +
      '这两条几乎就是「消息发不出去」类问题的标准答案。接收方向的包装链同理：' +
      '<code>new BufferedReader(new InputStreamReader(socket.getInputStream()))</code>，从内往外依次是字节流、' +
      '字符流、缓冲流——只是方向反过来，所以用 <code>getInputStream</code>。'
    },

    { t: 'callout', kind: 'warn', title: '两条包装链要配套使用', html:
      '发送端用了 <code>BufferedWriter</code> 写 <code>newLine()</code>，接收端就必须用 <code>BufferedReader</code> 的 ' +
      '<code>readLine()</code> 来配对；如果一端按字节写、另一端按行读，或者两端编码不一致，就会出现「读到了但内容不对」' +
      '或「一直等」的现象。<b>排查时先看两端的包装链是否对称</b>，再看 flush 和换行。'
    },

    /* ------------------------------------------------------------------ 七、误区 */
    { t: 'h', text: '七、常见误区速查', id: 'ch06-7' },

    { t: 'p', html:
      '把聊天室和作业里最常见的 I/O 问题整理成表。遇到「读不到、写不出、乱码」时按表从上往下查，' +
      '通常几分钟就能定位。'
    },

    { t: 'table',
      head: ['现象', '常见原因', '正确做法'],
      rows: [
        ['对方一直收不到消息', '写完没有 <code>flush()</code>，数据还在缓冲区', '写完立刻 <code>flush()</code>，或调用 <code>close()</code>'],
        ['<code>readLine()</code> 一直不返回', '发送端没写换行符，接收端等不到「一行」结束', '发送端补 <code>newLine()</code>（或写 <code>\\n</code>）'],
        ['<code>readLine()</code> 返回 <code>null</code>', '流结束（对方断开或文件读完），不是空行', '循环用 <code>!= null</code> 判断并退出'],
        ['只处理了一半的输入', '循环条件里读一次、循环体里又读一次', '把 <code>readLine()</code> 放进 <code>while</code> 条件'],
        ['打印出乱码', '两端编码不一致，或直接用字节流读文本', '两端统一用 UTF-8，文本一律走字符流'],
        ['关流顺序错乱', '先关外层、后关内层，或关早了', '后打开的先关闭；或统一用 <code>close()</code> 由外层收尾']
      ],
      caption: '六条覆盖了 I/O 联调里 80% 的「读不到 / 写不出 / 乱码」' },

    { t: 'p', html:
      '调试口诀：<b>先 flush，再看换行，再查 null，最后查编码</b>。这四步覆盖绝大多数情况；' +
      '如果四步都过了还是不对，就去看两端的流是不是压根没连上——那是下一章 Socket 的内容。'
    },

    /* ------------------------------------------------------------------ 八、项目 */
    { t: 'h', text: '八、回到聊天室项目', id: 'ch06-8' },

    { t: 'p', html:
      '现在回头看 Project #1 的 <code>Client</code>：<code>bufferedWriter</code> 负责「从键盘读一行 → 发给服务器」，' +
      '<code>bufferedReader</code> 负责「从服务器读一行 → 打印出来」。server 端的 <code>ClientHandler</code> 也是' +
      '同样两条链，只是方向反过来。第 13 章会直接复用这两条包装链去写 <code>sendMessage()</code> 与 ' +
      '<code>listenForMessage()</code>，所以本章这两段代码要能默写。'
    },

    { t: 'p', html:
      '为什么非要「包一层再包一层」？因为网络只提供最底层的字节管道，而程序想说的是「一行文本」。' +
      '包装链就是把原始管道一级级接到能用的接口上：字节流 → 字符流 → 缓冲流，每加一层多一种能力' +
      '（字符、按行、效率），代价是多一个对象。'
    },

    { t: 'lab', id: 'streams' },

    /* ------------------------------------------------------------------ 练习 */
    { t: 'h', text: '即时练习' },
    { t: 'quiz', qid: 'ch06-q1' },
    { t: 'quiz', qid: 'ch06-q2' },
    { t: 'quiz', qid: 'ch06-q3' },

    /* ------------------------------------------------------------------ 收尾 */
    { t: 'keypoint', items: [
      { title: '流', html: '有序的字节序列，方向站在程序角度：<code>InputStream</code> 读进来、<code>OutputStream</code> 写出去。' },
      { title: '字节流', html: '<code>write(int)</code> / <code>read()</code> 只搬字节；<code>read()</code> 末尾返回 <b>−1</b>，不能直接读写文本。' },
      { title: '数据流', html: '<code>DataInputStream</code> / <code>DataOutputStream</code> 是过滤器流，<code>readUTF/writeUTF</code> 按 UTF-8 读写字符串，读写顺序必须一致。' },
      { title: 'flush', html: '把缓冲区里的数据真正推出去；网络发送不 flush，对方可能永远收不到。' },
      { title: '桥', html: '<code>InputStreamReader</code> 包在字节流外面，按编码把字节解码成字符。' },
      { title: '缓冲', html: '<code>BufferedReader</code> 减少物理读写次数，并提供 <code>readLine()</code>。' },
      { title: 'readLine', html: '读到换行才返回；空行是 <code>""</code>，流结束才是 <code>null</code>。' },
      { title: '包装链', html: '<code>socket.getOutputStream()</code> → <code>OutputStreamWriter</code> → <code>BufferedWriter</code>，从内往外读；发送三步是 write、newLine、flush。' }
    ] },

    { t: 'checklist', id: 'ch06', items: [
      '我能用「有顺序的字节序列」解释流，并说清输入流与输出流的方向是相对谁说的',
      '我能写出字节流的读写，并说出 <code>read()</code> 为什么返回 <code>int</code> 而不是 <code>byte</code>',
      '我能解释为什么不能直接按字节读中文',
      '我能成对使用 <code>writeUTF</code> / <code>readUTF</code>，并说出读写顺序为什么必须一致',
      '我知道 <code>flush()</code> 做了什么，能说出忘了它会有什么现象',
      '我能写出 <code>new BufferedReader(new InputStreamReader(System.in))</code> 并说明每一层的职责',
      '我能写出读到 <code>stop</code> 为止的循环，并正确处理 <code>readLine()</code> 返回 <code>null</code>',
      '我能从内往外拆开 <code>BufferedWriter(new OutputStreamWriter(socket.getOutputStream()))</code>',
      '我知道发送一行文本要做三步：write、newLine、flush',
      '我能按「先 flush、再看换行、再查 null、最后查编码」的顺序排查 I/O 问题'
    ] },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      '按 CSC1004 期末考纲的四部分，本章的考点会这样出现：' +
      '① <b>选择题</b>：Stream 的定义、<code>OutputStream</code> 与 <code>InputStream</code> 的方向、哪个类提供 ' +
      '<code>readLine()</code>、哪个类负责读写 UTF 字符串。' +
      '② <b>判断题</b>：「<code>readLine()</code> 读到空行返回 <code>null</code>」（错，空行返回 <code>""</code>，' +
      '只有流结束才返回 <code>null</code>）、「<code>BufferedWriter</code> 写完要 <code>flush()</code>」（对）。' +
      '③ <b>填空题</b>：补全 <code>new BufferedReader(new InputStreamReader(...))</code> 的空缺、补 ' +
      '<code>flush()</code>、补 <code>while ((line = reader.readLine()) != null)</code> 的循环条件。' +
      '④ <b>简答/编程</b>：解释 <code>BufferedWriter(new OutputStreamWriter(socket.getOutputStream()))</code> ' +
      '里每一层的作用，或写一段「读到 stop 为止」的程序。<br>' +
      '<b>复习动作</b>：把包装链从内往外读练成条件反射，再亲手写一遍「读到 stop 为止」——这类题套路固定，是稳定得分点。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '让 AI 写 I/O 代码很容易「看起来对」，有效的练法是专挑它的三个惯性错误：' +
      '① 让它写 readLine 循环，检查它是不是写成每轮读两次，或者忘了判 <code>null</code>；' +
      '② 让它写 socket 发消息，检查有没有 <code>newLine()</code> 和 <code>flush()</code>——AI 最常漏 flush；' +
      '③ 让它解释 <code>new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()))</code>，' +
      '看它能不能从内往外说清「字节 → 字符 → 缓冲」，再拿本章 lab 的包装链对照。<br>' +
      '最后一定要自己验证：开两个终端实际跑一次，确认消息真的到了对端。本章代码无法在站内运行（引擎不支持 I/O），' +
      '「跑一遍」只能在真实 JDK 上做。'
    }

  ]
});
