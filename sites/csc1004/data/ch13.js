/* =====================================================================
 * data/ch13.js · 第 13 章：项目一 · 聊天室 Chat Zoom
 * 职责：把 Socket + 多线程 + 类设计拼成多人聊天室（Server / ClientHandler /
 *       Client 三件套），讲清 accept 循环、广播、监听线程、实现顺序、调试与评分。
 * 对外 API：CSC.registerChapter({...})（block schema 见 _dev/CONTRACT.md §4–§5）
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch13',
  num: '13',
  title: '项目一：聊天室 Chat Zoom',
  en: 'Project I · Chat Room',
  goals: [
    '能画出聊天室的三层结构：Server 主线程 accept、每个连接一个 ClientHandler 子线程、Client 的发送主线程与接收子线程',
    '能独立写出 ServerSocket(1004)、accept 循环、ClientHandler implements Runnable 与 broadcastMessage 的完整骨架',
    '能解释 readLine 的阻塞为什么要求「一个连接一个线程」，以及 Client 为什么要先启动监听线程再进入发送循环',
    '能按「单向回显 → 多客户端 → 广播 → 用户名 → 扩展」的顺序增量实现，并用日志判断消息断在哪一跳',
    '能识别 readLine 阻塞、漏写 flush、并发修改 clientHandlers、端口占用这几类项目一高频 bug'
  ],
  kp: [
    { id: 'ch13-1', title: '项目要求：Class / Thread / Socket 三件套' },
    { id: 'ch13-2', title: '架构：一个主线程 + 每连接一个子线程' },
    { id: 'ch13-3', title: 'Server：accept 循环只做接客' },
    { id: 'ch13-4', title: 'Client：构造器、main 与发送循环' },
    { id: 'ch13-5', title: 'listenForMessage：收消息的第二个线程' },
    { id: 'ch13-6', title: 'ClientHandler：读消息与广播' },
    { id: 'ch13-7', title: '实现顺序与调试方法' },
    { id: 'ch13-8', title: '常见坑、评分要点与提升方向' }
  ],
  blocks: [

    /* ---------------------------------------------------------------- 开篇 */
    { t: 'callout', kind: 'why', html:
      '项目一占总成绩 <b>20%</b>，官方要求是用 Java 写一个聊天室（Java Chat Zoom），' +
      '必须用上 <b>Java Class and Inheritance</b>、<b>Multi-Threading</b>、<b>Socket Programming</b> 三样东西。' +
      '很多人把它们当成三个独立小作业分别写完，一拼就散：服务器收得到消息却发不出去，或者第二个人一连接就卡死。<br>' +
      '根因不是知识点没记住，而是没想清「谁在等谁」：<b>accept 在等新连接、readLine 在等新消息、键盘在等用户打字</b>。' +
      '一个线程只能停在一个阻塞点上，所以这个项目真正的考点是：<b>把三段等待放进不同的线程</b>。'
    },

    { t: 'p', lead: true, html:
      '聊天室不难在代码量，难在你想清楚每个线程此刻停在哪个阻塞点上。想清楚这一点，代码自己会长出来。'
    },

    /* ---------------------------------------------------------------- 一 */
    { t: 'h', text: '一、项目要求：可验收的四条', id: 'ch13-1' },

    { t: 'p', html:
      '课程的评分口径是 <b>Java 项目共 40%、每个 20%，提交「基础功能 + 演示视频」</b>：功能跑不通，代码再漂亮也没分。' +
      '「基础功能」可验收的只有四条：① 服务器能同时连上多个客户端；② 任何人发的消息出现在其他人屏幕上；' +
      '③ 每条消息带用户名；④ 一个人断线，其他人能继续聊。'
    },

    { t: 'p', html:
      '三个技术点各管一段。<b>套接字（socket）</b>负责「连上」：服务器用 <b>服务器套接字（ServerSocket）</b>监听' +
      '<b>端口（port）</b> 1004，客户端用 <code>new Socket("localhost", 1004)</code> 去连——IP 说明「哪台机器」，' +
      '端口说明「机器上的哪个程序」。<b>线程（thread）</b>负责「同时」：每条连接一个线程，各阻塞在自己的 ' +
      '<code>readLine</code> 上。类与继承负责「结构」：一条连接是一个 <code>ClientHandler</code> 对象，' +
      '「能跑」就是 <code>implements Runnable</code>。'
    },

    { t: 'terms', cols: 2, items: [
      { en: 'socket', zh: '套接字', html: '一条双向连接的两端；客户端用 <code>Socket(ip, port)</code> 主动去连。' },
      { en: 'ServerSocket', zh: '服务器套接字', html: '只负责监听端口，<code>accept()</code> 阻塞到有人连进来。' },
      { en: 'thread', zh: '线程', html: '程序里同时推进的一条执行线；阻塞只卡住它自己。' },
      { en: 'broadcast', zh: '广播', html: '把一条消息写给名单里的每个连接——聊天室的核心动作。' }
    ] },

    /* ---------------------------------------------------------------- 二 */
    { t: 'h', text: '二、架构：一个主线程 + 每连接一个子线程', id: 'ch13-2' },

    { t: 'p', html:
      '整个项目只有两种角色、三种线程。Server 的<b>主线程（main thread）</b>跑 while 循环：' +
      '<code>accept()</code> 阻塞（blocking）等新连接，连接一到就 <code>new ClientHandler(socket)</code> 包装成「服务员」，' +
      '再 <code>new Thread(handler).start()</code> 交给子线程，自己立刻回到 accept。' +
      '它<b>从不读消息、也不写消息</b>——主线程只负责「接客」。'
    },

    { t: 'flow', nodes: [
      { title: '启动 Server', desc: 'new ServerSocket(1004)', kind: 'start' },
      { title: 'accept() 阻塞', desc: '等下一个客户端连进来', kind: 'proc' },
      { title: 'new ClientHandler', desc: '把这条连接包装成对象', kind: 'proc' },
      { title: 'new Thread(h).start()', desc: '交给子线程，主线程回去 accept', kind: 'proc' },
      { title: '子线程 readLine()', desc: '阻塞等这个客户端说话', kind: 'decide' },
      { title: 'broadcastMessage()', desc: '遍历名单，写给每个 writer', kind: 'proc' },
      { title: '所有人收到消息', desc: '客户端子线程打印到屏幕', kind: 'end' }
    ] },

    { t: 'p', html:
      '每个 <code>ClientHandler</code> 子线程跑自己的循环：<code>readLine()</code> 阻塞等这个客户端说话，' +
      '读到一行就 <code>broadcastMessage()</code> 遍历名单，写进每个人的输出流。' +
      '名单是静态的 <code>ArrayList&lt;ClientHandler&gt;</code>：进来就 <code>add(this)</code>，断线就 <code>remove(this)</code>。' +
      '服务器不需要知道「谁在跟谁聊」，它只维护一份连接名单。'
    },

    { t: 'compare', left: {
      title: 'Server 主线程：只负责接客',
      html: '永远停在 <code>accept()</code> 上，连接一到就丢给子线程，然后立刻回去等下一个。不读消息，所以不会被任何客户端拖住。',
      code: 'while (!serverSocket.isClosed()) {\n    Socket socket = serverSocket.accept();   // 阻塞点 1\n    new Thread(new ClientHandler(socket)).start();\n}'
    }, right: {
      title: 'ClientHandler 子线程：只负责这条连接',
      html: '每个连接一条线程，停在自己的 <code>readLine()</code> 上。A 不说话不影响 B，A 断线也不影响 B。',
      code: 'while (socket.isConnected()) {\n    String msg = bufferedReader.readLine();  // 阻塞点 2\n    broadcastMessage(msg);\n}'
    } },

    { t: 'p', html:
      '客户端也有两条线程：main 里 <code>Scanner</code> 读键盘、writer 发消息；<code>listenForMessage</code> ' +
      '另开一条线程 <code>readLine</code> 收消息。为什么不能省？因为 <code>readLine</code> 和 <code>nextLine</code> 都阻塞，' +
      '一个线程只能在一个阻塞点上等：主线程去收消息，用户打的字没人读；主线程读键盘，服务器推来的消息就堆在缓冲区。'
    },

    /* ---------------------------------------------------------------- 三 */
    { t: 'h', text: '三、Server：accept 循环只做接客', id: 'ch13-3' },

    { t: 'p', html:
      '先写服务器，它跑起来才能验证客户端。端口 1004 只在 <code>main</code> 里写一次，Client 里的数字必须一致——' +
      '改端口要两边一起改，这是「连不上」最常见的原因。'
    },

    { t: 'code', run: false, caption: 'Server.java —— 主线程只做三件事：accept、包装、开线程', code:
`import java.io.*;
import java.net.*;

public class Server {
    private ServerSocket serverSocket;

    public Server(ServerSocket serverSocket) {
        this.serverSocket = serverSocket;
    }

    public void startServer() throws IOException {
        System.out.println("[SERVER] listening on port 1004 ...");
        while (!serverSocket.isClosed()) {
            Socket socket = serverSocket.accept();            // 阻塞：等下一个客户端
            System.out.println("[SERVER] new client " + socket.getRemoteSocketAddress());
            ClientHandler handler = new ClientHandler(socket);  // 每个连接一个"服务员"
            Thread thread = new Thread(handler);                // 包装成线程对象
            thread.start();                                     // 交给 CPU，主线程回去 accept
        }
    }

    public void closeServer() throws IOException {
        if (serverSocket != null) {
            serverSocket.close();          // 关闭后 isClosed() 为 true，循环自行退出
        }
    }

    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(1004);   // 端口只在这里写一次
        Server server = new Server(serverSocket);
        server.startServer();
    }
}
` },

    { t: 'p', html:
      '三个决定对应三行代码。① 用 <code>while (!serverSocket.isClosed())</code> 而不是 <code>while (true)</code>，' +
      '关闭服务器后循环能自己退出；② <code>accept()</code> 返回的 Socket 只代表「这一个客户端」，要立刻交给 handler，' +
      '不能塞进全局变量反复覆盖；③ <code>thread.start()</code> 才真的开线程，直接调 <code>run()</code> 只是普通方法调用，' +
      '服务器会退化成一次服务一个人（ch08 讲过）。'
    },

    { t: 'callout', kind: 'warn', title: 'accept 是阻塞调用，别在主线程里读消息', html:
      '在 <code>accept()</code> 之后直接 <code>readLine()</code>，主线程就停在那条连接上，第二个人永远等不到下一次 accept——' +
      '表现是「第一个人连上后，第二个客户端一直转圈」。这就是聊天室必须多线程的唯一原因：' +
      '<b>accept 的等待</b>与<b>每条连接的等待</b>不能串行。'
    },

    { t: 'code', run: false, caption: '反例 SingleClientServer.java —— 单线程服务器：第一个人连上后，第二个人永远排不上', code:
`import java.io.*;
import java.net.*;

public class SingleClientServer {
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(1004);
        Socket socket = serverSocket.accept();                       // 只接受一个
        BufferedReader reader =
                new BufferedReader(new InputStreamReader(socket.getInputStream()));
        String line;
        while ((line = reader.readLine()) != null) {                 // 卡在这里等这一个人
            System.out.println("[ECHO] " + line);
        }
    }
}
` },

    /* ---------------------------------------------------------------- 四 */
    { t: 'h', text: '四、Client：构造器、main 与发送循环', id: 'ch13-4' },

    { t: 'p', html:
      '客户端要做四件事：连服务器、包出读写流、报用户名、进入「读键盘 → 发送」的循环。Tutorial 2 把「发用户名」' +
      '画在 main 里，本实现放进构造器最后一行——这样顺序由代码结构保证，main 里不会忘记；服务器端 ClientHandler ' +
      '构造器的第一行正好是等这个名字。'
    },

    { t: 'code', run: false, caption: 'Client.java —— 构造器包流并报名字；main 里先开接收线程再发消息（listenForMessage 见下一节）', code:
`import java.io.*;
import java.net.*;
import java.util.Scanner;

public class Client {
    private Socket socket;
    private BufferedReader bufferedReader;   // 读服务器推来的消息
    private BufferedWriter bufferedWriter;   // 写给服务器
    private String username;

    public Client(Socket socket, String username) throws IOException {
        this.socket = socket;
        this.username = username;
        this.bufferedReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.bufferedWriter = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
        this.bufferedWriter.write(username);   // 协议第一步：第一行必须是用户名
        this.bufferedWriter.newLine();
        this.bufferedWriter.flush();
    }

    public void sendMessage() throws IOException {
        Scanner scanner = new Scanner(System.in);
        while (socket.isConnected()) {
            String messageToSend = scanner.nextLine();           // 阻塞点：等用户打字
            bufferedWriter.write(username + ": " + messageToSend);
            bufferedWriter.newLine();                            // 对端 readLine 靠换行分界
            bufferedWriter.flush();                              // 真正把缓冲区推出去
        }
    }

    public static void main(String[] args) throws IOException {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter your username: ");
        String username = scanner.nextLine();

        Socket socket = new Socket("localhost", 1004);   // 哪台机器 + 哪个端口
        Client client = new Client(socket, username);
        client.listenForMessage();   // 先开接收线程……
        client.sendMessage();        // ……主线程才进入「读键盘 → 发送」循环
    }
}
` },

    { t: 'p', html:
      '流为什么包三层？<code>socket.getInputStream()</code> 给字节流，<code>InputStreamReader</code> 把字节解码成字符，' +
      '<code>BufferedReader</code> 加缓冲并给出 <code>readLine()</code>（ch06 的包装链）。写方向同理，' +
      '到 <code>BufferedWriter</code> 才有按行的 <code>newLine()</code>。' +
      'main 里的顺序是硬要求：<b>先</b> <code>listenForMessage()</code>、<b>再</b> <code>sendMessage()</code>。' +
      '写反了不一定报错，但 sendMessage 的 while 会一直占着主线程，接收线程根本没机会启动。'
    },

    { t: 'p', html:
      '<code>write</code> 只把字符放进<b>缓冲区（buffer）</b>，<code>newLine</code> 补换行符，' +
      '<code>flush</code>（刷出）才真正推给对端。对端 <code>readLine</code> 按行读：没有换行符它会一直等，' +
      '没有 flush 消息就躺在本地。本段用 <code>throws IOException</code> 把异常交给 main；正式版本应当用 try-catch ' +
      '接住并清理资源，否则一个客户端掉线可能把整个客户端进程结束。'
    },

    { t: 'callout', kind: 'warn', title: '少 newLine 或漏 flush，症状都是「发不出去」', html:
      '只 <code>write</code> 不 <code>flush</code>：消息停在本地缓冲区，服务器毫无动静。' +
      '只 <code>flush</code> 不 <code>newLine</code>：对端 readLine 等不到行尾，看起来像「收到了但不广播」。' +
      '两个坑都不报错，几乎人人都踩一次。把 write / newLine / flush 当成一条口诀，写完消息三连一次做齐。'
    },

    /* ---------------------------------------------------------------- 五 */
    { t: 'h', text: '五、listenForMessage：收消息的第二个线程', id: 'ch13-5' },

    { t: 'code', run: false, note: '本站引擎不支持匿名内部类与 try-catch，解析会报错；本段仅阅读、不提供运行。',
      caption: 'Client.listenForMessage() —— 匿名 Runnable（课程 Tutorial 4 原文写法，节选）', code:
`public class Client {
    private Socket socket;
    private BufferedReader bufferedReader;

    public void listenForMessage() {
        new Thread(new Runnable() {          // 匿名内部类：临时给 Runnable 写一个实现
            @Override
            public void run() {
                String msgFromGroupChat;
                while (socket.isConnected()) {
                    try {
                        msgFromGroupChat = bufferedReader.readLine();  // 阻塞的是这条子线程
                        if (msgFromGroupChat == null) {                // 服务器正常关闭
                            break;
                        }
                        System.out.println(msgFromGroupChat);
                    } catch (IOException e) {                         // 连接断了
                        closeEverything();
                        break;
                    }
                }
            }
        }).start();                          // start() 才真的启动线程
    }
}
` },

    { t: 'p', html:
      '这段可以拆成三层：<code>new Thread(...)</code> 造线程对象；里面 <code>new Runnable() { ... }</code> 是' +
      '<b>匿名内部类（anonymous inner class）</b>——临时给接口写一个实现、连类名都不取，只为塞进 Thread 构造器；' +
      '最后的 <code>.start()</code> 才真正启动。'
    },

    { t: 'p', html:
      '把它改写成 lambda 就是 <code>new Thread(() -&gt; { ... }).start();</code>：ch05 讲过，接口只有一个抽象方法时，' +
      '匿名内部类可以缩成箭头函数，两种写法完全等价。课程示例保留匿名内部类，是因为它把「线程里放了什么」写得更直白。'
    },

    { t: 'callout', kind: 'warn', title: 'run() 里必须把 IOException 接住', html:
      '<code>run()</code> 是 <code>Runnable</code> 规定的签名，<b>不能</b>加 <code>throws</code>。' +
      '如果 <code>readLine()</code> 的 IO 异常不接住，它会结束这条监听线程——之后服务器再推消息这个客户端一条也收不到，' +
      '而且程序不崩，看起来就是「突然收不到消息了」。catch 里要做三件事：提示、<code>break</code>、断开连接。'
    },

    /* ---------------------------------------------------------------- 六 */
    { t: 'h', text: '六、ClientHandler：读消息与广播', id: 'ch13-6' },

    { t: 'p', html:
      'ClientHandler 是服务器端的核心：每接受一条连接就造一个。它有两个设计点。① 构造器里 <code>readLine()</code> ' +
      '读到的第一行就是用户名——这是两边约定的协议，所以 Client 必须先发名字再发消息；② 构造器里 ' +
      '<code>clientHandlers.add(this)</code> 把自己登记进名单，广播时才有对象可写。名单是 <code>static</code> 的：' +
      '全服务器的连接共享同一份。'
    },

    { t: 'code', run: false, note: '本站引擎不支持 try-catch，解析会报错；本段仅阅读、不提供运行。',
      caption: 'ClientHandler.java —— 构造器登记、run 循环、broadcastMessage 广播', code:
`import java.io.*;
import java.net.*;
import java.util.ArrayList;

public class ClientHandler implements Runnable {
    // 类变量：所有 ClientHandler 共享同一份在线名单
    public static ArrayList<ClientHandler> clientHandlers = new ArrayList<>();

    private Socket socket;
    private BufferedReader bufferedReader;
    private BufferedWriter bufferedWriter;
    private String clientUsername;

    public ClientHandler(Socket socket) throws IOException {
        this.socket = socket;
        this.bufferedReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.bufferedWriter = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
        this.clientUsername = bufferedReader.readLine();   // 协议第一步：第一行是用户名
        clientHandlers.add(this);                          // 登记，广播才有对象可写
        System.out.println("[SERVER] " + clientUsername + " joined, online = " + clientHandlers.size());
        broadcastMessage("SERVER: " + clientUsername + " has entered the chat!");
    }

    @Override
    public void run() {
        String messageFromClient;
        while (socket.isConnected()) {
            try {
                messageFromClient = bufferedReader.readLine();
                if (messageFromClient == null) {      // 对方正常关闭：readLine 返回 null
                    break;
                }
                broadcastMessage(messageFromClient);
            } catch (IOException e) {                 // 连接坏了
                break;
            }
        }
        removeClientHandler();                        // 收尾：关流、从名单里删除
    }

    public void broadcastMessage(String messageToSend) {
        for (ClientHandler handler : clientHandlers) {
            if (handler == this) {
                continue;                             // 不给自己发；想看到自己发的话就删掉这两行
            }
            try {
                handler.bufferedWriter.write(messageToSend);
                handler.bufferedWriter.newLine();
                handler.bufferedWriter.flush();
            } catch (IOException e) {
                // 写不出去说明对方已断线，交给 removeClientHandler 清理
            }
        }
    }

    public void removeClientHandler() {
        clientHandlers.remove(this);
        try {
            if (bufferedReader != null) {
                bufferedReader.close();
            }
            if (bufferedWriter != null) {
                bufferedWriter.close();
            }
            if (socket != null) {
                socket.close();
            }
        } catch (IOException e) {
            System.out.println("[SERVER] failed to close " + clientUsername);
        }
    }
}
` },

    { t: 'p', html:
      'run 的循环只有三步：读一行、广播、再循环。<code>readLine</code> 返回 <code>null</code> 表示对方正常关闭（不是异常），' +
      '抛 <code>IOException</code> 表示连接坏了，两种情况都要走到收尾：关流、从名单里删掉自己，' +
      '否则广播会一直往死连接写。广播就是一个 for 循环：拿每个 handler 的 writer，写同一行、newLine、flush。'
    },

    { t: 'p', html:
      '注意 <code>handler.bufferedWriter</code> 是 private 字段，广播却能直接访问——因为它们在<b>同一个类</b>里。' +
      'Java 的 private 是「类可见」而不是「对象可见」：同一个类的不同对象可以互看私有成员。' +
      '跳过自己是个产品决定：跳过只看别人，不跳过能看到自己发的。'
    },

    { t: 'callout', kind: 'warn', title: '广播时删人，会抛 ConcurrentModificationException', html:
      'for-each 遍历 <code>clientHandlers</code> 时，若有客户端断线并从名单被移除，迭代器会抛' +
      '<b>并发修改（concurrent modification）</b>异常，整个 run 线程直接结束。三种修法任选：遍历副本 ' +
      '<code>new ArrayList&lt;&gt;(clientHandlers)</code>；先把要删的收集起来、循环结束后再删；或显式用 ' +
      '<code>Iterator.remove()</code>。提交前用「聊到一半关掉一个客户端」这个测试把它试出来。'
    },

    { t: 'callout', kind: 'warn', title: '构造器里的 readLine 会挡住 accept 循环', html:
      '<code>new ClientHandler(socket)</code> 在 Server 主线程里执行，构造器里的 readLine 一旦等不到用户名，' +
      'accept 循环就停住，所有人都连不进来。课程示例这样写，是因为客户端连上后立刻发了名字，等待只有几毫秒；' +
      '更稳妥的做法是构造器只建流和登记，把读用户名挪到 <code>run()</code> 第一行。' +
      '另外，同一个 Socket 的输入流只包一次 BufferedReader，重复包装会各自缓冲，导致消息错乱或丢失。'
    },

    /* ---------------------------------------------------------------- 七 */
    { t: 'h', text: '七、实现顺序与调试方法', id: 'ch13-7' },

    { t: 'p', html:
      '不要一次把三个类写完再运行。最有效的打法是<b>每次只加一层，每层都能自己验证</b>——任何一步卡住都只在小范围里排查。'
    },

    { t: 'steps', items: [
      { title: '单向回显', html: '服务器收到消息只打印、不广播。能连上、能发一条、服务器能看到，Socket 与流就通了。' },
      { title: '两个客户端', html: 'Run Configuration 勾 <b>Allow multiple instances</b>，启动两个 Client；服务器打印两次 accept 即可。' },
      { title: '广播', html: '让 A 的消息出现在 B 屏幕上；先确认广播循环跑了几次，再确认跳过自己的判断。' },
      { title: '用户名与入群提示', html: 'Client 连上先发名字，ClientHandler 用它广播进入/离开。此时四条基础功能已齐。' },
      { title: '扩展', html: '私聊（<code>/w Bob</code>）、<code>/quit</code>、时间戳、JavaFX 客户端——都是加方法，不改结构。' }
    ] },

    { t: 'p', html:
      '调试第一原则是<b>先客户端、后服务端</b>：先在 <code>write</code> 前打日志确认字节发出去了，' +
      '再看服务器有没有读到（<code>readLine</code> 后打一行），最后看广播循环跑了几次。' +
      '消息断了，就看最后一条日志停在哪一段，问题一定在「最后成功的一步」与「下一步」之间。'
    },

    { t: 'table',
      head: ['症状', '最可能的原因', '怎么修'],
      rows: [
        ['第二个客户端一直连不上', 'accept 之后主线程卡在读消息', '把读消息全部挪进 ClientHandler 的 run()'],
        ['服务器没反应，客户端也没报错', 'write 之后漏了 flush', 'write / newLine / flush 三件套补齐'],
        ['消息发得出、收不到', '漏 newLine，对端 readLine 等不到行尾', '每条消息结尾加 newLine'],
        ['用户名变成第一句话', 'readLine 顺序没对上：客户端没先发名字', 'Client 构造器先发用户名并 flush'],
        ['聊到一半程序报异常退出', '广播时有人断线触发并发修改', '遍历副本 / 延迟删除 / Iterator.remove'],
        ['Address already in use: bind', '上一次 Server 没退出，1004 被占用', '结束旧进程；或换端口两边同步改']
      ],
      caption: '项目一六个高频症状：先用日志确认消息走到哪一跳，再对照修。' },

    { t: 'p', html:
      '启动顺序固定：<b>先 Server 后 Client</b>，反过来连接会被拒绝。另外服务器关掉时客户端不一定立刻察觉，' +
      '因为 <code>isConnected()</code> 只反映本地状态，真正的感知要靠 <code>readLine</code> 返回 null 或抛异常。'
    },

    /* ---------------------------------------------------------------- 八 */
    { t: 'h', text: '八、常见坑、评分要点与提升方向', id: 'ch13-8' },

    { t: 'p', html:
      '全章的坑收成一句话：<b>readLine 阻塞</b>（所以一个连接一个线程）、<b>漏 flush / newLine</b>、' +
      '<b>并发修改 clientHandlers</b>、<b>吞掉 IOException</b>（catch 里什么都不做，断线了还以为在线）、' +
      '<b>端口占用与启动顺序</b>。还有一个容易忽略的：<code>Scanner</code> 与 <code>BufferedReader</code> ' +
      '不要同时包 <code>System.in</code>，两个缓冲读同一个键盘，输入会被其中一个吃掉。'
    },

    { t: 'p', html:
      '评分看「基础功能 + 视频」：视频里至少有三窗口同时在线、任意一方发消息、所有人看到带用户名的消息、' +
      '关掉一个继续聊。提升按性价比排：私聊与命令 → 时间戳与消息格式 → JavaFX 客户端 → 用继承做消息分发。' +
      '下面这个骨架就是第四项：每条新命令只加一个子类，正好对应项目点名的 Class and Inheritance。'
    },

    { t: 'codegroup', tabs: [
      { label: 'ChatCommand.java', run: false, code:
`public abstract class ChatCommand {
    public abstract void execute(ClientHandler sender, String argument);
}

// 这两个方法需要在 ClientHandler 里补上：发私聊、给单个客户端回话
class PrivateMessageCommand extends ChatCommand {
    @Override
    public void execute(ClientHandler sender, String argument) {
        sender.sendPrivate(argument);      // argument 形如 "Bob hello"
    }
}

class QuitCommand extends ChatCommand {
    @Override
    public void execute(ClientHandler sender, String argument) {
        sender.sendToClient("SERVER: bye");
        sender.removeClientHandler();
    }
}
` },
      { label: 'CommandParser.java', run: false, code:
`public class CommandParser {
    public static ChatCommand parse(String line) {
        if (line == null || line.isEmpty()) {
            return null;                    // 空行不处理
        }
        if (line.startsWith("/quit")) {
            return new QuitCommand();
        }
        if (line.startsWith("/w ")) {
            return new PrivateMessageCommand();
        }
        return null;                        // 不是命令：当普通聊天广播
    }
}
` }
    ] },

    /* ---------------------------------------------------------------- 交互 */
    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch13-q1' },
    { t: 'quiz', qid: 'ch13-q2' },
    { t: 'quiz', qid: 'ch13-q3' },

    { t: 'p', html:
      '让实验台动起来：在「聊天室架构」里点开一条连接，看 accept 主线程、ClientHandler 子线程、广播名单三方怎么互相推动，' +
      '再故意把线程模型改成单线程，观察第二个客户端为什么卡住。'
    },

    { t: 'lab', id: 'chat' },

    /* ---------------------------------------------------------------- 收束 */
    { t: 'keypoint', items: [
      { title: '三件套', html: '<code>Server</code> 用 <code>ServerSocket</code> 监听，<code>ClientHandler</code> 实现 <code>Runnable</code> 管一条连接，<code>Client</code> 用 <code>Socket</code> 收发。' },
      { title: '架构', html: '主线程只做 accept + 开线程；每个连接一个子线程阻塞在 readLine；广播遍历 <code>ArrayList&lt;ClientHandler&gt;</code>。' },
      { title: '客户端双线程', html: 'main 读键盘发送，<code>listenForMessage</code> 另开线程接收；先开接收线程再进发送循环。' },
      { title: '端口与协议', html: '端口 1004 两边一致；建连后第一行是用户名；每条消息以 newLine 结尾并 flush。' },
      { title: '阻塞法则', html: '一个线程只能停在一个阻塞点；accept、readLine、nextLine 必须分居不同线程。' },
      { title: '高频坑', html: '漏 flush / newLine、广播时并发修改名单、构造器 readLine 挡住 accept、吞掉 IOException、端口被占用。' },
      { title: '扩展', html: '用抽象类 <code>ChatCommand</code> + 子类做命令分发，把 Class and Inheritance 落到代码里。' }
    ] },

    { t: 'checklist', id: 'ch13', items: [
      '我能不看书画出 Server / ClientHandler / Client 三者的线程与消息流向',
      '我能写出 ServerSocket(1004) + accept 循环 + 每连接一个 Thread 的服务器骨架',
      '我能解释 accept 为什么必须与 readLine 分处不同线程',
      '我能写出 Client 的双线程结构，并说清 listenForMessage 与 sendMessage 的启动顺序',
      '我能写出 ClientHandler implements Runnable、读消息并广播给名单里所有人的代码',
      '我能说出 write / newLine / flush 各自的作用，以及少一个会看到什么现象',
      '我能解释 clientHandlers 为什么是 static，以及广播时为什么不能边遍历边删除',
      '我能用三段日志定位「消息断在哪一跳」',
      '我能按五步增量顺序实现项目，并录出符合要求的三人在线演示',
      '我能说出至少两个可加分的扩展方向'
    ] },

    { t: 'callout', kind: 'exam', title: '这一章在期末考里怎么考', html:
      '考纲明确「期末只考与项目紧密相关的知识」，所以项目一是简答与填空的高频出处。<br>' +
      '① <b>Part III 填空</b>：给 accept 循环或广播循环挖空——<code>new ServerSocket(1004)</code>、<code>accept()</code>、' +
      '<code>new Thread(handler).start()</code>、<code>newLine()</code>、<code>flush()</code>。<br>' +
      '② <b>Part II 判断</b>：「单线程服务器也能同时服务多个客户端」「直接调用 handler.run() 会开新线程」' +
      '「readLine 返回 null 说明发生了异常」——都是典型错误陈述。<br>' +
      '③ <b>Part IV 简答/编程</b>：解释聊天室为什么必须多线程（写出三种阻塞各发生在哪）、手写 broadcastMessage，' +
      '或问「客户端不发用户名，服务器会怎样」。<br>' +
      '答题模板：先一句结论（几层线程），再画三个框（Server / Handler / Client），最后点明每个阻塞点。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '让 AI 生成一个能跑的聊天室对项目帮助很大（课程允许），但对期末分数帮助有限。值得做三件事：' +
      '① 逐行读懂它，让它解释「为什么 <code>start()</code> 不能换成 <code>run()</code>」「为什么客户端要先开接收线程」，' +
      '答不全就说明它只背了模板；② 让它当验收员：给它你的四个类，问「第二个人连上时主线程停在哪一行」；' +
      '③ 自己加一个需求（如私聊）再运行——AI 写的代码没经过你的手，考场上写不出来。' +
      '最后亲自跑「三人同时在线、关掉一个继续聊」并录屏，那才是这 20% 真正落地的地方。'
    }

  ]
});
