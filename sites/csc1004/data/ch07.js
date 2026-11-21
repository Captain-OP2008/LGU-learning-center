/* =====================================================================
 * data/ch07.js · 第 07 章：Socket 网络编程
 * 职责：IP+端口、Socket 与 ServerSocket、accept() 阻塞、客户端连接、
 *       getInputStream/getOutputStream、单向与双向通信、多客户端与线程、
 *       JRE、连接式 vs 无连接、IntelliJ 多实例运行。
 * 对外 API：CSC.registerChapter({...})（block schema 见 _dev/CONTRACT.md §4–§5）
 * 注意：本站引擎不支持 Socket，本章代码一律 run:false；机制由 lab「socket」演示。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch07',
  num: '07',
  title: 'Socket 网络编程',
  en: 'Socket Programming',
  goals: [
    '能说出客户端连接服务器前必须知道的两样信息：IP 地址与端口号',
    '能解释 Socket 与 ServerSocket 的分工，并写出 new ServerSocket(1004) + accept() 的服务器骨架',
    '能写出 new Socket("localhost", 1004) 的客户端，并用 getInputStream / getOutputStream 收发数据',
    '能区分单向（one-way）与双向（Q&A）通信，并预测消息往返的顺序',
    '能解释为什么多客户端必须为每个连接开线程，并在 IntelliJ 里同时运行多个客户端'
  ],
  kp: [
    { id: 'ch07-1', title: '通信两端：IP 地址与端口号' },
    { id: 'ch07-2', title: 'ServerSocket 与 accept() 的阻塞' },
    { id: 'ch07-3', title: 'Socket：客户端发起连接' },
    { id: 'ch07-4', title: '连接之后：getInputStream / getOutputStream' },
    { id: 'ch07-5', title: '一问一答：单向与双向通信' },
    { id: 'ch07-6', title: '多客户端：为什么需要线程' },
    { id: 'ch07-7', title: 'JRE、连接式与无连接' },
    { id: 'ch07-8', title: '常见异常与多实例调试' }
  ],
  blocks: [

    /* ------------------------------------------------------------------ 开篇 */
    { t: 'callout', kind: 'why', html:
      '第一次跑聊天室的 Server，很多人会以为程序死机了：控制台不再有任何输出。' +
      '其实它没卡死，而是执行到了 <code>serverSocket.accept()</code>——' +
      '这一行会<b>阻塞</b>，一直等到某个客户端连上来才返回。<br>' +
      '网络编程的难点常常不在语法，而在这种「谁在等谁」的时序：服务器要先占住端口再等，' +
      '客户端要知道 IP 和端口才能连；连上之后双方各自拿一根管子，谁先写、谁先读必须配好，' +
      '配错了就两边一起等，看起来像死机。本章把这条链路从头到尾走一遍，' +
      '并回答一个项目里绕不开的问题：<b>为什么第二个客户端连上之后，服务器就顾不上第一个了？</b>'
    },

    { t: 'p', lead: true, html:
      '这一章的关键字只有两个：<b>等</b>与<b>连</b>。服务器等，客户端连；连上之后，两条管子开始传字节。'
    },

    { t: 'steps', items: [
      { title: '服务器开机', html: '<code>new ServerSocket(1004)</code>：向操作系统申请占用 1004 端口，开始监听。' },
      { title: '服务器等待', html: '<code>accept()</code> 阻塞，直到有客户端连上这个端口，才返回一个 <code>Socket</code>。' },
      { title: '客户端连接', html: '<code>new Socket("localhost", 1004)</code>：解析地址、找到端口、建立连接。' },
      { title: '双方拿流', html: '各自调用 <code>getInputStream()</code> / <code>getOutputStream()</code>，拿到两根管子。' },
      { title: '一问一答', html: '一端 write + flush，另一端 readLine；然后交换角色，或者继续循环。' }
    ] },

    { t: 'p', html:
      '本章路线：先讲清两端必须约定的两样信息（一），再依次拆开 ServerSocket（二）与 Socket（三）；' +
      '连接建立之后看两条流（四），用一问一答把双向通信跑通（五）；' +
      '然后回答「多客户端怎么办」（六），补充 JRE、连接式与无连接的背景（七），' +
      '最后整理常见异常与多实例调试（八）。'
    },

    /* ------------------------------------------------------------------ 一、IP 与端口 */
    { t: 'h', text: '一、两端要什么：IP 地址与端口号', id: 'ch07-1' },

    { t: 'p', html:
      '讲义的第一句话是：Java Socket programming is used for communication between the applications ' +
      'running on different machines（也可能只是同一台机器上的不同 JRE）。' +
      '要让两个程序找到彼此，客户端必须知道两样信息：服务器的 <b>IP 地址（IP address）</b>与' +
      '<b>端口号（port number）</b>。'
    },

    { t: 'p', html:
      '<b>IP 地址</b>定位「哪一台机器」，<b>端口</b>定位「这台机器上的哪个程序」。' +
      '课程代码里常用 <code>1004</code>（项目 #1）或 <code>6666</code>（讲义示例），端口范围 0–65535；' +
      '服务器占住一个端口后，客户端必须连同一个数字，否则连不上。'
    },

    { t: 'p', html:
      '本机测试时服务器地址写 <code>"localhost"</code> 或 <code>"127.0.0.1"</code>，都表示「这台电脑自己」。' +
      '讲义用 <code>"localhost"</code> 是因为服务器和客户端跑在同一台机器上；' +
      '如果服务器在另一台电脑上，就要换成那台电脑的 IP。'
    },

    { t: 'terms', cols: 3, items: [
      { en: 'socket', zh: '套接字', html: '两台机器之间通信的一个端点，用 IP + 端口标识。' },
      { en: 'server socket', zh: '服务器套接字', html: '只负责监听端口、接受连接，本身不传数据。' },
      { en: 'port number', zh: '端口号', html: '一台机器上区分不同网络程序的编号。' },
      { en: 'IP address', zh: 'IP 地址', html: '网络上一台机器的地址。' },
,    ] },

    { t: 'p', html:
      'Tutorial 3 特意解释了 <b>JRE（Java Runtime Environment）</b>：它是运行在操作系统之上的软件层，' +
      '提供 Java 程序运行所需的类库与资源。Socket 通信的本质，是<b>两个 JRE 里的程序</b>在交换数据，' +
      '所以「客户端」和「服务器」只是角色，不是两种机器。'
    },

    /* ------------------------------------------------------------------ 二、ServerSocket */
    { t: 'h', text: '二、ServerSocket：占住端口，等连接上来', id: 'ch07-2' },

    { t: 'p', html:
      '<b>ServerSocket</b> 是服务器端的类，它只做一件事：在指定端口上等请求进来。' +
      '<code>new ServerSocket(1004)</code> 创建一个绑定到 1004 端口的服务器套接字，' +
      '<code>accept()</code> 则一直阻塞，直到有客户端连上这个端口，然后<b>返回一个新的 <code>Socket</code></b>。' +
      '注意返回的这个 <code>Socket</code> 才是「通向那个客户端」的连接，而原来的 <code>ServerSocket</code> ' +
      '仍然留在端口上继续等下一个。'
    },

    { t: 'code', run: false, caption: 'MyServerOneWay.java · 单向通信：客户端发一句，服务器读出来打印', code:
`import java.io.*;
import java.net.*;

public class MyServerOneWay {
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(1004);   // 1) 占住 1004 端口
        System.out.println("Server is waiting on port 1004 ...");

        Socket socket = serverSocket.accept();                // 2) 阻塞，直到有客户端连上
        System.out.println("A client is connected: " + socket.getInetAddress());

        BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        String message = reader.readLine();                   // 3) 读客户端发来的一行
        System.out.println("Client says: " + message);

        socket.close();
        serverSocket.close();
    }
}
` },

    { t: 'p', html:
      '运行后先打印 <code>Server is waiting on port 1004 ...</code>，然后画面停住——这个「停住」就是 ' +
      '<code>accept()</code> 在工作。等客户端连上、发来一行，服务器才打印 <code>A client is connected: ...</code> ' +
      '和 <code>Client says: ...</code>。讲义对它的描述是：accept() blocks the console until the client is connected。'
    },

    { t: 'callout', kind: 'warn', title: 'accept() 阻塞，而且一次只服务一个连接', html:
      '<code>accept()</code> 不返回就说明还没有客户端连上来，这不是死机，不要急着杀进程。' +
      '另外，<b>一次 accept() 只对应一次连接</b>：如果你只写一次 accept、然后进入读写循环，' +
      '服务器就被这一个客户端占住了，第二个客户端连上来也没人接待。' +
      '要让服务器一直工作，外层必须是 <code>while (!serverSocket.isClosed())</code> 循环，反复 accept。' +
      '但这一点又会引出第六节的问题——主线程会被「读消息」卡住。'
    },

    /* ------------------------------------------------------------------ 三、Socket */
    { t: 'h', text: '三、Socket：客户端发起连接', id: 'ch07-3' },

    { t: 'p', html:
      '<b>Socket</b> 表示通信的一个端点（a socket is an endpoint for communication between two machines）。' +
      '客户端的写法只需要一行：<code>new Socket("localhost", 1004)</code>——把服务器的地址和端口传进去，' +
      '构造的同时就会尝试连接，连不上会抛异常。连接到同一个 <code>ServerSocket</code> 的客户端有好几个时，' +
      '服务器会为每一个连接拿到一个独立的 <code>Socket</code>。'
    },

    { t: 'code', run: false, caption: 'MyClientOneWay.java · 客户端连上去，发一行，然后关闭', code:
`import java.io.*;
import java.net.*;

public class MyClientOneWay {
    public static void main(String[] args) throws IOException {
        Socket socket = new Socket("localhost", 1004);        // 主动连接服务器

        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
        writer.write("hello from client");
        writer.newLine();      // 让服务器端的 readLine() 知道这一行结束了
        writer.flush();        // 不 flush，消息可能还留在缓冲区里

        socket.close();
    }
}
` },

    { t: 'compare', left: {
      title: '<code>ServerSocket</code>（服务器）',
      html: '占住端口、<b>等</b>别人来连；<code>accept()</code> 返回一条新连接的 <code>Socket</code>。它本身不负责收发数据。',
      code: 'ServerSocket serverSocket = new ServerSocket(1004);\nSocket socket = serverSocket.accept();'
    }, right: {
      title: '<code>Socket</code>（客户端，也是服务器端连接）',
      html: '主动<b>连</b>到某个 IP + 端口；连上之后，收发数据都靠它的两条流。两端用的是同一个类。',
      code: 'Socket socket = new Socket("localhost", 1004);\nInputStream in = socket.getInputStream();'
    } },

    { t: 'p', html:
      '一句话记法：<b>ServerSocket 负责「接待」，Socket 负责「通话」</b>。' +
      '服务器端也有一个 <code>Socket</code>——<code>accept()</code> 的返回值就是它，是和某个具体客户端之间的那根线。' +
      '所以服务器端同时存在两种对象：一个 <code>ServerSocket</code>（听）和多个 <code>Socket</code>（说）。'
    },

    /* ------------------------------------------------------------------ 四、两条流 */
    { t: 'h', text: '四、连接之后：两条管子', id: 'ch07-4' },

    { t: 'p', html:
      '连接建立后，通信就变成最普通不过的流读写：<code>socket.getOutputStream()</code> 拿到<b>输出流</b>，' +
      '往对方写；<code>socket.getInputStream()</code> 拿到<b>输入流</b>，从对方读。' +
      '讲义在 Project #1 里就是这两句：<code>BufferedWriter(new OutputStreamWriter(socket.getOutputStream()))</code> 用于写，' +
      '<code>BufferedReader(new InputStreamReader(socket.getInputStream()))</code> 用于读。'
    },

    { t: 'svg', maxW: 640, caption: '一条连接、两个方向：客户端的输出流对应服务器的输入流，反之亦然。', html:
`<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Socket 双向流">
  <defs>
    <marker id="ch07-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent2)"/>
    </marker>
  </defs>
  <rect x="20" y="40" width="160" height="130" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="100" y="70" font-size="13" text-anchor="middle" fill="var(--accent)">Client</text>
  <text x="100" y="94" font-size="11" text-anchor="middle" fill="var(--text2)">Socket</text>
  <text x="100" y="120" font-size="10" text-anchor="middle" fill="var(--text3)">getOutputStream →</text>
  <text x="100" y="140" font-size="10" text-anchor="middle" fill="var(--text3)">← getInputStream</text>
  <rect x="460" y="40" width="160" height="130" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="540" y="70" font-size="13" text-anchor="middle" fill="var(--accent2)">Server</text>
  <text x="540" y="94" font-size="11" text-anchor="middle" fill="var(--text2)">Socket (from accept)</text>
  <text x="540" y="120" font-size="10" text-anchor="middle" fill="var(--text3)">getInputStream ←</text>
  <text x="540" y="140" font-size="10" text-anchor="middle" fill="var(--text3)">getOutputStream →</text>
  <line x1="190" y1="90" x2="450" y2="90" stroke="var(--accent2)" stroke-width="1.6" marker-end="url(#ch07-arw)"/>
  <line x1="450" y1="126" x2="190" y2="126" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#ch07-arw)"/>
  <text x="320" y="82" font-size="11" text-anchor="middle" fill="var(--text3)">客户端写 → 服务器读</text>
  <text x="320" y="146" font-size="11" text-anchor="middle" fill="var(--text3)">服务器写 → 客户端读</text>
  <text x="20" y="200" font-size="11" fill="var(--text3)">同一条 TCP 连接上有两个方向；每一端都同时有输入流和输出流。</text>
</svg>` },

    { t: 'p', html:
      '这两个方法的方向是<b>站在当前程序</b>说的：调用 <code>getOutputStream()</code> 就是「我要写出去」，' +
      '调用 <code>getInputStream()</code> 就是「我要读进来」；两端的对象是同一对，方向正好相反。'
    },

    /* ------------------------------------------------------------------ 五、一问一答 */
    { t: 'h', text: '五、一问一答：从单向到双向', id: 'ch07-5' },

    { t: 'p', html:
      '讲义里的第一个例子是<b>单向通信（one-way）</b>：客户端发一句，服务器读出来打印，没有回话。' +
      '把回话加进来就是<b>双向通信</b>：服务器读完用同一个连接的输出流写回一行，客户端再读回来。' +
      '这就是讲义 Q&amp;A 一节的结构，也是聊天室的最小原型。'
    },

    { t: 'codegroup', tabs: [
      { label: 'QAServer.java', run: false, code:
`import java.io.*;
import java.net.*;

public class QAServer {
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(1004);
        Socket socket = serverSocket.accept();

        BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));

        String question = reader.readLine();            // 先读
        System.out.println("Question: " + question);
        writer.write("Answer: 42");                     // 再写
        writer.newLine();
        writer.flush();

        socket.close();
        serverSocket.close();
    }
}
` },
      { label: 'QAClient.java', run: false, code:
`import java.io.*;
import java.net.*;

public class QAClient {
    public static void main(String[] args) throws IOException {
        Socket socket = new Socket("localhost", 1004);

        BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));

        writer.write("What is the answer?");            // 先写
        writer.newLine();
        writer.flush();

        System.out.println(reader.readLine());          // 再读
        socket.close();
    }
}
` }
    ] },

    { t: 'p', html:
      '注意两边是「配好的」：客户端先写、服务器先读；服务器读完写、客户端写完读。' +
      '顺序一对上，通信就顺畅；顺序错了就会两边一起等——客户端在等回答，服务器还在等问题，' +
      '谁都不肯先动。这是<b>死锁</b>的雏形，考试常以「程序为什么卡住」的形式出现。'
    },

    { t: 'callout', kind: 'warn', title: '两边都先读，就一定卡住', html:
      '<code>readLine()</code> 是阻塞方法：没有一行数据就一直等。所以「谁先写」必须事先约定好。' +
      '聊天室里的做法是双方各开一个线程：一个专门负责读，一个专门负责从键盘读并发送（第 08 章讲）。' +
      '调试时如果发现两端都停在 <code>readLine()</code>，先检查是不是都忘了 <code>flush()</code>，' +
      '再检查是不是都忘了写换行符。'
    },

    /* ------------------------------------------------------------------ 六、多客户端 */
    { t: 'h', text: '六、多客户端：为什么必须开线程', id: 'ch07-6' },

    { t: 'p', html:
      'Tutorial 3 的服务器骨架是 <code>while (!serverSocket.isClosed()) { Socket socket = serverSocket.accept(); ... }</code>：' +
      '主循环不断接受新连接。但「接受」之后呢？如果把读写代码直接写进循环体，' +
      '主线程就忙着跟第一个客户端聊天，第二个只能排队等——而聊天室要求所有人都能同时说话。'
    },

    { t: 'p', html:
      '解法是 Tutorial 2 的结构：<b>每接受一个客户端，就构造一个 ClientHandler，把它放进一个线程里启动</b>，' +
      '主线程立刻回去继续 accept。这样每个客户端都有自己的一条执行流，谁也不会挡住谁。' +
      '下面这段代码就是 Tutorial 4 的 Server 骨架，第 08 章会把 <code>Thread</code> 本身讲透。'
    },

    { t: 'code', run: false, caption: 'Server.java（Tutorial 4 骨架）· 主线程只负责 accept，每个客户端交给一个线程', code:
`import java.io.*;
import java.net.*;

public class Server {
    private ServerSocket serverSocket;

    public Server(ServerSocket serverSocket) {
        this.serverSocket = serverSocket;
    }

    public void startServer() {
        while (!serverSocket.isClosed()) {
            Socket socket = serverSocket.accept();          // 主线程：接待
            ClientHandler clientHandler = new ClientHandler(socket);
            Thread thread = new Thread(clientHandler);      // 每个客户端一个线程
            thread.start();                                 // 立刻返回，继续 accept
        }
    }

    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(1004);
        Server server = new Server(serverSocket);
        server.startServer();
    }
}

class ClientHandler implements Runnable {
    private Socket socket;
    private BufferedReader bufferedReader;

    public ClientHandler(Socket socket) throws IOException {
        this.socket = socket;
        this.bufferedReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
    }

    @Override
    public void run() {
        String messageFromClient;
        while (socket.isConnected()) {
            messageFromClient = bufferedReader.readLine();  // 讲义为突出结构省略了异常处理
            System.out.println(messageFromClient);
        }
    }
}
` },

    { t: 'p', html:
      '这样一来，Server 类里就同时有两种角色：<b>主线程</b>在 <code>startServer()</code> 里死循环 accept，' +
      '<b>子线程</b>们在各自的 <code>run()</code> 里阻塞读消息。' +
      '客户端那边也一样：一个线程负责「监听服务器发来的消息」，主线程负责「从键盘读输入并发送」，' +
      '否则打字时就收不到消息。'
    },

    /* ------------------------------------------------------------------ 七、JRE 与连接式 */
    { t: 'h', text: '七、JRE、连接式与无连接', id: 'ch07-7' },

    { t: 'p', html:
      'Tutorial 3 还区分了两类 Socket 编程：<b>连接式（connection-oriented）</b>与<b>无连接（connection-less）</b>。' +
      '课程项目用的是前者：<code>Socket</code> 与 <code>ServerSocket</code> 成对出现，先建立连接、' +
      '再在连接上收发，顺序有保证。后者用 <code>DatagramSocket</code> 与 <code>DatagramPacket</code>，' +
      '每个数据包自带地址、不保证顺序，项目里用不到。'
    },

    { t: 'table',
      head: ['对比项', '连接式（Socket / ServerSocket）', '无连接（DatagramSocket）'],
      rows: [
        ['先建立连接吗', '要，accept 之后才能收发', '不要，直接发数据包'],
        ['顺序与可靠性', '有连接，顺序有保证', '不保证到达与顺序'],
        ['课程项目用哪个', '<b>Project #1 聊天室</b>', '不涉及'],
        ['典型 API', '<code>new Socket(...)</code>、<code>accept()</code>', '<code>new DatagramSocket(...)</code>']
      ],
      caption: '讲义原话：Socket/ServerSocket 用于 connection-oriented，DatagramSocket/DatagramPacket 用于 connection-less' },

    { t: 'p', html:
      'JRE 的存在还解释了一个现象：只要两端都有 JRE、都在跑 Java 程序，就能用同一套 API 对话。' +
      '所以「服务器」不必是专门的一台机器——同一台电脑上先后启动两个 Java 程序，' +
      '一个当服务器、一个当客户端，这正是本机调试的做法。'
    },

    /* ------------------------------------------------------------------ 八、异常与多实例 */
    { t: 'h', text: '八、常见异常与多实例调试', id: 'ch07-8' },

    { t: 'p', html:
      '网络代码的报错信息很好用，常见就那几种；遇事先对照下表，再查端口和启动顺序。'
    },

    { t: 'table',
      head: ['现象 / 异常', '原因', '处理'],
      rows: [
        ['<code>ConnectException: Connection refused</code>', '服务器没启动，或端口不一致', '先启动 Server，核对两边的端口号'],
        ['<code>BindException: Address already in use</code>', '端口被占用（上一次的服务器没关）', '关掉旧进程，或换一个端口'],
        ['<code>UnknownHostException</code>', '主机名写错了', '本机用 <code>localhost</code> 或 <code>127.0.0.1</code>'],
        ['程序停住不动', '<code>accept()</code> 在等连接，或 <code>readLine()</code> 在等数据', '检查客户端是否启动、是否 flush、是否写了换行'],
        ['客户端一连就断', '服务器端异常退出或提前关流', '看服务器控制台的异常栈，检查流的关闭顺序']
      ],
      caption: '网络调试三板斧：先看异常名、再看端口、最后看「谁在等谁」' },

    { t: 'callout', kind: 'warn', title: '先启动 Server，再启动 Client', html:
      '客户端在 <code>new Socket(...)</code> 时就会尝试连接；如果此时服务器还没监听那个端口，' +
      '它会立刻抛 <code>ConnectException</code>。所以调试顺序永远是<b>先 Server、后 Client</b>。' +
      '改端口时两边要一起改，只改一边必然连不上。' +
      '另外，<code>localhost</code> 只对「同一台机器」有效，把程序发给同学时要么改成对方机器的 IP，' +
      '要么让对方也在本机跑服务器。'
    },

    { t: 'p', html:
      '最后是课程里很实用的一个操作：怎么同时开多个客户端？Chat Zoom 至少要两个客户端才能看到效果。' +
      '在 IntelliJ 里打开 <b>Edit Configuration → Modify options → Allow multiple instances</b>，' +
      '然后多次点击运行 <code>Client.main()</code>，每点一次创建一个新实例。' +
      '不开这个选项的话，第二次运行只会重新启动同一个进程，看不到「多人聊天」的效果。'
    },

    { t: 'lab', id: 'socket' },

    /* ------------------------------------------------------------------ 练习 */
    { t: 'h', text: '即时练习' },
    { t: 'quiz', qid: 'ch07-q1' },
    { t: 'quiz', qid: 'ch07-q2' },
    { t: 'quiz', qid: 'ch07-q3' },

    /* ------------------------------------------------------------------ 收尾 */
    { t: 'keypoint', items: [
      { title: '两端要什么', html: '服务器 IP 地址 + 端口号；本机测试用 <code>localhost</code> / <code>127.0.0.1</code>。' },
      { title: 'ServerSocket', html: '<code>new ServerSocket(1004)</code> 占端口监听；<code>accept()</code> 阻塞等待，返回一条连接的 <code>Socket</code>。' },
      { title: 'Socket', html: '<code>new Socket("localhost", 1004)</code> 构造即连接；连不上会抛异常。' },
      { title: '两条流', html: '<code>getInputStream()</code> 读、<code>getOutputStream()</code> 写；方向相对当前程序，两端正好相反。' },
      { title: '一问一答', html: '单向是只发不回；双向要约定谁先写，两边同时 readLine 会互相等成死锁。' },
      { title: '多客户端', html: '主线程只 accept，每个客户端交给一个 <code>ClientHandler</code> 线程，否则服务器被一个人占住。' },
      { title: '连接式 vs 无连接', html: 'Socket/ServerSocket 有连接、有顺序；DatagramSocket 无连接，项目不用。' },
      { title: '调试', html: '先 Server 后 Client；端口一致；<code>Allow multiple instances</code> 才能开多个客户端。' }
    ] },

    { t: 'checklist', id: 'ch07', items: [
      '我能说出客户端连接服务器必须知道的两样信息，并解释 IP 与端口各定位什么',
      '我能写出 <code>new ServerSocket(1004)</code> + <code>accept()</code> 的服务器骨架',
      '我能解释 <code>accept()</code> 为什么会「阻塞」，以及它返回的是什么',
      '我能写出 <code>new Socket("localhost", 1004)</code> 并说明构造时发生了什么',
      '我能用 <code>getInputStream</code> / <code>getOutputStream</code> 说清两个方向的数据流向',
      '我能写出单向通信与一问一答两种结构，并预测消息往返的顺序',
      '我能解释为什么两个客户端同时连上时服务器会顾不过来，以及为什么要开线程',
      '我能说出 JRE 与连接式 / 无连接的区别（<code>DatagramSocket</code> 一句带过即可）',
      '我知道先启动 Server 再启动 Client，并能看懂 <code>Connection refused</code> 与 <code>Address already in use</code>',
      '我用 <code>Allow multiple instances</code> 同时运行多个客户端'
    ] },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      '按 CSC1004 期末考纲的四部分，本章的考点会这样出现：' +
      '① <b>选择题</b>：Socket 与 ServerSocket 的分工、<code>accept()</code> 的返回值、客户端连接需要哪些信息、' +
      '哪个类用于无连接通信。' +
      '② <b>判断题</b>：「<code>accept()</code> 会一直阻塞到有客户端连接」（对）、' +
      '「ServerSocket 也可以直接用来读写数据」（错，收发靠 <code>accept()</code> 返回的 <code>Socket</code>）。' +
      '③ <b>填空题</b>：补 <code>new ServerSocket(1004)</code>、<code>serverSocket.accept()</code>、' +
      '<code>new Socket("localhost", 1004)</code>、<code>socket.getOutputStream()</code> 这类空缺。' +
      '④ <b>简答/编程</b>：写出「客户端发一句、服务器打印」的程序，或解释「为什么聊天室的服务器要为每个客户端开线程」。<br>' +
      '<b>复习动作</b>：默写一遍 Server + Client 的最小骨架，' +
      '再口述「accept 阻塞 → 拿流 → 一问一答」的时序。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '网络代码「看起来都一样」，正好拿来练审查：① 让 AI 写一对 Server/Client，先检查它有没有把 ' +
      '<code>accept()</code> 写进循环、有没有忘记 <code>flush()</code>、端口两边是否一致；' +
      '② 让它解释「为什么第二个客户端连上后没反应」，看它会不会提到「主线程被 readLine 阻塞」；' +
      '③ 让它给「多客户端」方案，重点看它有没有把 <code>ClientHandler</code> 放进 <code>Thread</code> 里启动。<br>' +
      'AI 常犯的错是把 <code>ServerSocket</code> 和 <code>Socket</code> 混用、或者在 <code>accept()</code> 之后忘记循环。' +
      '这一章的代码无法在站内运行（引擎不支持 Socket），所以任何结论都要在 IntelliJ 里真开两个进程验证。'
    }

  ]
});
