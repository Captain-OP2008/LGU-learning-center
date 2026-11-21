/* =====================================================================
 * data/projects.js · CSC1004 学习站 · 项目手册（#/projects）
 *
 * 职责：把课程的三个大项目（Chat Zoom / Gomoku / Snake）拆成可执行的里程碑，
 *   每个里程碑提供任务清单、代码骨架、提示、参考实现与评分讲解。
 *   schema：{ id, title, en, tagline, level, minutes, chapters, goals, intro,
 *             milestones:[{ n, title, tasks, starter, hints, solution, explain, tests }],
 *             extension, solutionNote }
 * 注意：Socket / JavaFX / Tkinter 无法在站内 Java 引擎里执行，tests 一律为 []。
 *   项目页的价值在任务拆解、检查清单、骨架与评分要点，不在自动判分。
 * 作者模块：projects
 * ===================================================================== */

CSC.registerProjects([
  /* ==================================================================
   * 项目一 · Chat Zoom（ch07 Socket + ch08 多线程 + ch13 架构）
   * ================================================================== */
  {
    id: 'chat',
    title: 'Java Chat Zoom 聊天室',
    en: 'CHAT ZOOM',
    tagline: 'Socket + 多线程 + 广播：从一条消息到多人实时聊天',
    level: 3,
    minutes: 720,
    chapters: ['ch07', 'ch08', 'ch13'],
    goals: [
      '能画出 ServerSocket → accept → ClientHandler → Thread 的连接与线程图，并指出每一步阻塞在哪里',
      '能用 BufferedReader / BufferedWriter 设计一套「一行一条消息」的应用层协议，解释 flush 与 readLine 的配合',
      '能写出线程安全的多客户端广播，处理断线、重名、并发修改、端口占用这些真实运行才会出现的问题',
      '能把控制台客户端升级成 JavaFX 图形客户端，并用 Platform.runLater 把后台消息送回 UI 线程',
      '能独立完成 3 分钟项目演示：启动服务器、三个客户端互发、私聊、强行关闭一个客户端并解释恢复过程'
    ],
    intro: 'Chat Zoom 是课程的第一个 Java 项目（占总评 20%），官方要求覆盖 Java 类与继承、多线程、Socket 编程三块。'
      + '它不是一个「能发一句话」的玩具：服务器要同时服务多个客户端，每个客户端要一边读键盘一边收消息，'
      + '任何一个人断线都不能影响其他人。本项目按 5 个里程碑推进——先让服务器听见一句话，再让多个客户端同时说话，'
      + '然后加上用户名与广播，最后处理断线、端口占用、并发修改，并升级到 JavaFX 客户端。'
      + '每一关都给出代码骨架与可运行的参考实现，你可以在 IntelliJ 里按「文件」分段粘贴运行。',
    milestones: [
      {
        n: 1,
        title: 'M1 · 单向通信：让服务器听见第一句话',
        tasks: [
          '在 IntelliJ 里先运行 ChatServerM1，控制台出现「listening on port 1004」，光标停住不返回（说明 accept 正在阻塞）',
          '再运行 ChatClientM1，服务器控制台出现「client connected: /127.0.0.1」',
          '客户端发出的 Hello 出现在服务器控制台，格式为「client says: ...」',
          '客户端进程结束后，服务器依次关闭 socket 与 serverSocket，控制台没有红色异常堆栈',
          '把端口改成 1005 后重新运行，仍然是「服务器先起、客户端后连」的顺序，消息依旧可见'
        ],
        starter: `import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;

public class ChatServerM1 {
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(1004);
        System.out.println("[SERVER] listening on port 1004 ...");

        Socket socket = serverSocket.accept();
        System.out.println("[SERVER] client connected: " + socket.getInetAddress());

        BufferedReader reader = new BufferedReader(
                new InputStreamReader(socket.getInputStream()));

        // TODO 1: 用 reader.readLine() 读一行，保存到 String message
        // TODO 2: 打印 "[SERVER] client says: " + message
        // TODO 3: 依次关闭 reader、socket、serverSocket

        serverSocket.close();
    }
}`,
        hints: [
          'ServerSocket 只负责「监听端口」，真正代表一条连接的是 accept() 返回的 Socket；两个对象都要 close。',
          '客户端写完消息必须 flush()，否则内容可能留在缓冲区，服务器 readLine() 会一直等下去。',
          '先启动服务器再启动客户端。反过来的话，客户端 new Socket(...) 会立刻抛 ConnectException: Connection refused。',
          'readLine() 返回 null 表示对方正常关闭了输出流，不是空字符串；循环里要用 null 判断结束。'
        ],
        solution: `/* ===== 文件 1：ChatServerM1.java ===== */
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;

public class ChatServerM1 {
    public static void main(String[] args) throws IOException {
        try (ServerSocket serverSocket = new ServerSocket(1004)) {
            System.out.println("[SERVER] listening on port 1004 ...");

            try (Socket socket = serverSocket.accept()) {
                System.out.println("[SERVER] client connected: " + socket.getInetAddress());

                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(socket.getInputStream()));
                String message = reader.readLine();
                System.out.println("[SERVER] client says: " + message);
            }
        }
        System.out.println("[SERVER] connection closed, server stopped");
    }
}

/* ===== 文件 2：ChatClientM1.java ===== */
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.net.Socket;

public class ChatClientM1 {
    public static void main(String[] args) throws IOException {
        try (Socket socket = new Socket("localhost", 1004);
             BufferedWriter writer = new BufferedWriter(
                     new OutputStreamWriter(socket.getOutputStream()))) {

            System.out.println("[CLIENT] connected to " + socket.getRemoteSocketAddress());
            writer.write("Hello from the first client!");
            writer.newLine();
            writer.flush();
            System.out.println("[CLIENT] message sent");
        }
    }
}`,
        explain: '<b>为什么这样设计。</b>这一步故意只做「一次连接、一条消息」，因为 Socket 编程的失败几乎都来自顺序和阻塞：'
          + '<code>ServerSocket</code> 只负责在 1004 端口监听，<code>accept()</code> 会一直阻塞到有客户端连进来；'
          + '真正代表这条连接的是 <code>accept()</code> 返回的 <code>Socket</code>，读写都从它的输入流 / 输出流走。'
          + '必须先启动服务器、再启动客户端，是因为客户端 <code>new Socket(...)</code> 时如果没人监听，会立刻抛 <code>ConnectException</code>。'
          + '<b>常见坑。</b>第一，<code>BufferedWriter</code> 有缓冲区，写完不 <code>flush()</code>，服务器会永远停在 <code>readLine()</code>；'
          + '第二，<code>readLine()</code> 以换行符为一条消息的边界，所以客户端要 <code>newLine()</code> 再 <code>flush()</code>；'
          + '第三，<code>readLine()</code> 返回 <code>null</code> 表示对方关闭了连接，不是空字符串。'
          + '<b>答辩 / 评分看什么。</b>老师会让你指出「服务器现在阻塞在哪一行」，再让你先关客户端、观察服务器如何结束。'
          + '能解释 <code>accept()</code> 与 <code>readLine()</code> 的阻塞点，比多写十个功能更加分；演示视频里也要保留「先服务器、后客户端」的启动顺序。',
        tests: []
      },

      {
        n: 2,
        title: 'M2 · 双向与多客户端：每个连接一个线程',
        tasks: [
          '启动服务器后连续启动两个客户端，服务器分别打印「client #1 connected」「client #2 connected」，第二个不会被第一个卡住',
          '任一客户端输入一行，服务器把「echo: 内容」只回给发送它的那个客户端',
          '客户端一边能持续输入，一边能实时看到服务器返回的消息（输入时不会被阻塞）',
          '关闭其中一个客户端，服务器打印该客户端断开，另一个客户端仍然能正常收发',
          '在服务器端把 new Thread(handler).start() 临时改成 handler.run()，观察第二个客户端为什么进不来，再改回来'
        ],
        starter: `/* ===== 文件 1：ChatServerM2.java ===== */
import java.io.IOException;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class ChatServerM2 {
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(1004);
        System.out.println("[SERVER] listening on port 1004 ...");
        int count = 0;

        while (!serverSocket.isClosed()) {
            Socket socket = serverSocket.accept();
            count++;
            System.out.println("[SERVER] client #" + count + " connected");

            // TODO 1: 创建 ClientHandlerM2(socket, count)
            // TODO 2: 放进 new Thread(...) 并调用 start()
            // 注意：不要在这里直接调用 handler.run()
        }
    }
}

/* ===== 文件 2：ClientHandlerM2.java ===== */
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;

public class ClientHandlerM2 implements Runnable {
    private final Socket socket;
    private final int id;
    private final BufferedReader reader;
    private final BufferedWriter writer;

    public ClientHandlerM2(Socket socket, int id) throws IOException {
        this.socket = socket;
        this.id = id;
        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
    }

    @Override
    public void run() {
        // TODO 3: 循环 readLine()，打印到服务器，并回写 "echo: " + message
        // TODO 4: 用 finally 关闭 socket
    }
}

/* ===== 文件 3：ChatClientM2.java ===== */
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.util.Scanner;

public class ChatClientM2 {
    private final Socket socket;
    private final BufferedReader reader;
    private final BufferedWriter writer;

    public ChatClientM2(Socket socket) throws IOException {
        this.socket = socket;
        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
    }

    public void listenForMessage() {
        // TODO 5: 新开一个线程，循环 readLine() 并打印服务器消息
    }

    public void sendMessage() {
        // TODO 6: 用 Scanner 循环读键盘，写一行、newLine、flush
    }

    public static void main(String[] args) throws IOException {
        Socket socket = new Socket("localhost", 1004);
        ChatClientM2 client = new ChatClientM2(socket);
        client.listenForMessage();
        client.sendMessage();
    }
}`,
        hints: [
          '服务器的主线程只做 accept；每接到一个 Socket 就 new 一个 handler，把它交给新线程，主线程立刻回去 accept。',
          '必须调用 thread.start()，不能调用 handler.run()。run() 是普通方法调用，会在当前线程里跑，等于没有并发。',
          '客户端也需要两个线程：主线程读键盘并发送，另一个线程专门 readLine() 接收服务器消息。',
          '服务器关闭或客户端退出时 readLine() 会抛 SocketException，把它当作正常断开处理，不要让它把整个程序带崩。',
          '两个线程不要共用同一个 Scanner；Scanner 不是线程安全的，共享会出现 NoSuchElementException 或丢输入。'
        ],
        solution: `/* ===== 文件 1：ChatServerM2.java ===== */
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

public class ChatServerM2 {
    public static void main(String[] args) {
        int clientCount = 0;
        try (ServerSocket serverSocket = new ServerSocket(1004)) {
            System.out.println("[SERVER] listening on port 1004 ...");

            while (!serverSocket.isClosed()) {
                Socket socket = serverSocket.accept();
                clientCount++;
                System.out.println("[SERVER] client #" + clientCount
                        + " connected from " + socket.getRemoteSocketAddress());

                try {
                    ClientHandlerM2 handler = new ClientHandlerM2(socket, clientCount);
                    Thread thread = new Thread(handler, "client-" + clientCount);
                    thread.start();
                } catch (IOException e) {
                    System.out.println("[SERVER] cannot set up client #" + clientCount
                            + ": " + e.getMessage());
                    socket.close();
                }
            }
        } catch (IOException e) {
            System.out.println("[SERVER] stopped: " + e.getMessage());
        }
    }
}

/* ===== 文件 2：ClientHandlerM2.java ===== */
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;

public class ClientHandlerM2 implements Runnable {
    private final Socket socket;
    private final int id;
    private final BufferedReader reader;
    private final BufferedWriter writer;

    public ClientHandlerM2(Socket socket, int id) throws IOException {
        this.socket = socket;
        this.id = id;
        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
    }

    @Override
    public void run() {
        try {
            String message;
            while ((message = reader.readLine()) != null) {
                System.out.println("[SERVER] client #" + id + " says: " + message);
                send("echo: " + message);
            }
        } catch (IOException e) {
            System.out.println("[SERVER] client #" + id + " connection lost");
        } finally {
            close();
        }
        System.out.println("[SERVER] client #" + id + " handler finished");
    }

    private void send(String message) {
        try {
            writer.write(message);
            writer.newLine();
            writer.flush();
        } catch (IOException e) {
            close();
        }
    }

    private void close() {
        try {
            socket.close();
        } catch (IOException ignored) {
            // 关闭失败没有补救动作，忽略即可
        }
    }
}

/* ===== 文件 3：ChatClientM2.java ===== */
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.util.Scanner;

public class ChatClientM2 {
    private final Socket socket;
    private final BufferedReader reader;
    private final BufferedWriter writer;
    private final Scanner scanner = new Scanner(System.in);

    public ChatClientM2(Socket socket) throws IOException {
        this.socket = socket;
        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
    }

    public void listenForMessage() {
        Thread listener = new Thread(() -> {
            try {
                String message;
                while ((message = reader.readLine()) != null) {
                    System.out.println(message);
                }
            } catch (IOException e) {
                System.out.println("[CLIENT] connection closed");
            }
        }, "server-listener");
        listener.setDaemon(true);
        listener.start();
    }

    public void sendMessage() {
        System.out.println("Type a message and press Enter. Type /quit to exit.");
        try {
            while (socket.isConnected() && scanner.hasNextLine()) {
                String message = scanner.nextLine();
                if (message.equalsIgnoreCase("/quit")) {
                    break;
                }
                writer.write(message);
                writer.newLine();
                writer.flush();
            }
        } catch (IOException e) {
            System.out.println("[CLIENT] cannot send: " + e.getMessage());
        } finally {
            close();
        }
    }

    private void close() {
        try {
            socket.close();
        } catch (IOException ignored) {
        }
    }

    public static void main(String[] args) throws IOException {
        Socket socket = new Socket("localhost", 1004);
        ChatClientM2 client = new ChatClientM2(socket);
        client.listenForMessage();
        client.sendMessage();
    }
}`,
        explain: '<b>为什么这样设计。</b>多客户端的关键不是「多开几个窗口」，而是服务器不能在一个客户端上停下来。'
          + '<code>accept()</code> 本身很快，但 <code>readLine()</code> 会阻塞；如果把处理逻辑直接写在 accept 循环里，第二个客户端就永远进不来。'
          + '正确结构是：主线程只负责 accept，接到一个 Socket 就 new 一个 ClientHandler，把它交给新线程，主线程立刻回去 accept。'
          + '<b>常见坑。</b>最典型的是把 <code>thread.start()</code> 写成 <code>handler.run()</code>：后者只是普通方法调用，会在主线程里跑，'
          + '第一个客户端不退出，第二个客户端就永远等不到 accept。第二个坑是客户端只用主线程：读键盘时收不到消息，收消息时又没法输入，'
          + '所以客户端也要一个专门读服务器的小线程。第三，两个线程共享一个 <code>Scanner</code> 会互相抢输入，要各自持有自己的 Scanner。'
          + '<b>答辩 / 评分看什么。</b>老师会问「为什么需要两个线程」「start 和 run 的区别」，并让你在两个客户端之间来回发消息，'
          + '观察服务器是否被第一个客户端卡住。能说清楚「主线程 accept、子线程 readLine」这条分工，M2 就算过关。',
        tests: []
      },
      {
        n: 3,
        title: 'M3 · 广播与用户名：从回声到聊天室',
        tasks: [
          '客户端启动后先输入用户名（如 Alice），服务器记录并在所有人屏幕上广播「SERVER: Alice joined the chat」',
          'Alice 发送 hello，Bob 与 Carol 的客户端都显示「Alice: hello」，Alice 自己也能看到这条消息',
          '三个客户端同时在线时，任意一个发送的消息都能到达其余两个，显示顺序与发送顺序一致',
          '客户端输入 /quit 后正常退出，其余人看到「SERVER: Alice left the chat」，服务器没有抛异常',
          '用带空格的用户名（如 Alice Smith）启动，客户端在连接前就拒绝并提示，而不是让协议错位'
        ],
        starter: `/* ===== 文件 1：ChatServerM3.java ===== */
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;

public class ChatServerM3 {
    public static final List<ClientHandlerM3> clientHandlers = new ArrayList<>();

    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(1004);
        System.out.println("[SERVER] listening on port 1004 ...");

        while (!serverSocket.isClosed()) {
            Socket socket = serverSocket.accept();
            ClientHandlerM3 handler = new ClientHandlerM3(socket);

            // TODO 1: 把 handler 加入 clientHandlers
            // TODO 2: new Thread(handler).start()
        }
    }

    public static void broadcast(String message) {
        // TODO 3: 遍历 clientHandlers，调用每个 handler 的 send(message)
    }
}

/* ===== 文件 2：ClientHandlerM3.java ===== */
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;

public class ClientHandlerM3 implements Runnable {
    private final Socket socket;
    private final BufferedReader reader;
    private final BufferedWriter writer;
    private final String username;

    public ClientHandlerM3(Socket socket) throws IOException {
        this.socket = socket;
        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));

        // TODO 4: 第一行必须是用户名，用 reader.readLine() 读出来
        this.username = "TODO";
    }

    @Override
    public void run() {
        // TODO 5: 广播 "SERVER: " + username + " joined the chat"
        // TODO 6: 循环 readLine()，把 username + ": " + message 广播出去
        // TODO 7: finally 中从 clientHandlers 移除自己，并广播 left
    }

    public void send(String message) {
        // TODO 8: 写一行、flush；IOException 时关闭 socket
    }

    private void close() {
        try {
            socket.close();
        } catch (IOException ignored) {
        }
    }
}

/* ===== 文件 3：ChatClientM3.java ===== */
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.util.Scanner;

public class ChatClientM3 {
    private final Socket socket;
    private final BufferedReader reader;
    private final BufferedWriter writer;
    private final Scanner scanner = new Scanner(System.in);

    public ChatClientM3(Socket socket, String username) throws IOException {
        this.socket = socket;
        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
        // TODO 9: 连上后第一行先发 username
    }

    public void listenForMessage() {
        // TODO 10: 新线程循环 readLine() 并打印
    }

    public void sendMessage() {
        // TODO 11: 循环读键盘，发送每一行，/quit 退出
    }

    public static void main(String[] args) throws IOException {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter your username: ");
        String username = scanner.nextLine().trim();
        Socket socket = new Socket("localhost", 1004);
        ChatClientM3 client = new ChatClientM3(socket, username);
        client.listenForMessage();
        client.sendMessage();
    }
}`,
        hints: [
          '广播的本质是：服务器保存所有 ClientHandler，收到一条消息后遍历这个列表，用每个 handler 自己的 writer 写一遍。',
          '用户名要在聊天内容之前读：客户端连上后的第一行发用户名，handler 构造器里用 readLine() 把它读走，之后的每一行才是聊天内容。',
          '广播时把发送者自己也加进去，发送者能看到自己的消息被服务器接收，演示时更直观。',
          '用户名不要含空格，否则「用户名 + 冒号 + 内容」的格式会被拆错；在客户端连接前就校验并拒绝。',
          '每次 write 后都要 newLine() 和 flush()；只 write 不 flush，接收端会一直等。'
        ],
        solution: `/* ===== 文件 1：ChatServerM3.java ===== */
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;

public class ChatServerM3 {
    public static final List<ClientHandlerM3> clientHandlers = new ArrayList<>();

    public static void main(String[] args) {
        try (ServerSocket serverSocket = new ServerSocket(1004)) {
            System.out.println("[SERVER] listening on port 1004 ...");

            while (!serverSocket.isClosed()) {
                Socket socket = serverSocket.accept();
                try {
                    ClientHandlerM3 handler = new ClientHandlerM3(socket);
                    clientHandlers.add(handler);
                    new Thread(handler, "client-" + socket.getPort()).start();
                } catch (IOException e) {
                    System.out.println("[SERVER] cannot set up client: " + e.getMessage());
                    socket.close();
                }
            }
        } catch (IOException e) {
            System.out.println("[SERVER] stopped: " + e.getMessage());
        }
    }

    public static void broadcast(String message) {
        for (ClientHandlerM3 handler : clientHandlers) {
            handler.send(message);
        }
    }
}

/* ===== 文件 2：ClientHandlerM3.java ===== */
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;

public class ClientHandlerM3 implements Runnable {
    private final Socket socket;
    private final BufferedReader reader;
    private final BufferedWriter writer;
    private final String username;

    public ClientHandlerM3(Socket socket) throws IOException {
        this.socket = socket;
        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));

        String name = reader.readLine();
        this.username = (name == null || name.isBlank())
                ? "guest-" + socket.getPort()
                : name.trim();
    }

    @Override
    public void run() {
        ChatServerM3.broadcast("SERVER: " + username + " joined the chat");
        System.out.println("[SERVER] " + username + " joined");

        try {
            String message;
            while ((message = reader.readLine()) != null) {
                ChatServerM3.broadcast(username + ": " + message);
            }
        } catch (IOException e) {
            System.out.println("[SERVER] " + username + " connection lost");
        } finally {
            ChatServerM3.clientHandlers.remove(this);
            ChatServerM3.broadcast("SERVER: " + username + " left the chat");
            System.out.println("[SERVER] " + username + " left");
            close();
        }
    }

    public void send(String message) {
        try {
            writer.write(message);
            writer.newLine();
            writer.flush();
        } catch (IOException e) {
            close();
        }
    }

    private void close() {
        try {
            socket.close();
        } catch (IOException ignored) {
        }
    }
}

/* ===== 文件 3：ChatClientM3.java ===== */
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.util.Scanner;

public class ChatClientM3 {
    private final Socket socket;
    private final BufferedReader reader;
    private final BufferedWriter writer;
    private final Scanner scanner = new Scanner(System.in);

    public ChatClientM3(Socket socket, String username) throws IOException {
        this.socket = socket;
        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
        sendRaw(username);
    }

    public void listenForMessage() {
        Thread listener = new Thread(() -> {
            try {
                String message;
                while ((message = reader.readLine()) != null) {
                    System.out.println(message);
                }
            } catch (IOException e) {
                System.out.println("[CLIENT] connection closed");
            }
        }, "server-listener");
        listener.setDaemon(true);
        listener.start();
    }

    public void sendMessage() {
        System.out.println("Type /quit to exit.");
        try {
            while (scanner.hasNextLine()) {
                String message = scanner.nextLine().trim();
                if (message.equalsIgnoreCase("/quit")) {
                    break;
                }
                if (message.isEmpty()) {
                    continue;
                }
                sendRaw(message);
            }
        } catch (IOException e) {
            System.out.println("[CLIENT] cannot send: " + e.getMessage());
        } finally {
            close();
        }
    }

    private void sendRaw(String message) throws IOException {
        writer.write(message);
        writer.newLine();
        writer.flush();
    }

    private void close() {
        try {
            socket.close();
        } catch (IOException ignored) {
        }
    }

    public static void main(String[] args) throws IOException {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter your username: ");
        String username = scanner.nextLine().trim();
        if (username.isEmpty() || username.contains(" ")) {
            System.out.println("Username cannot be empty or contain spaces.");
            return;
        }

        Socket socket = new Socket("localhost", 1004);
        ChatClientM3 client = new ChatClientM3(socket, username);
        client.listenForMessage();
        client.sendMessage();
    }
}`,
        explain: '<b>为什么这样设计。</b>广播的本质是「服务器保存所有 ClientHandler，收到一条消息后遍历列表，用每个 handler 自己的 writer 写一遍」。'
          + '注意不是把消息写回发送者的 socket 就完事，也不是让客户端互相连接——客户端只认识服务器，这是典型的星形拓扑。'
          + '用户名要在读消息之前先读：客户端连上后第一行发用户名，handler 构造器里 <code>readLine()</code> 把它读走，之后的每一行才是聊天内容；'
          + '顺序错一位，后面全部错位。广播时建议连发送者一起发，这样发送者能看到自己的消息被服务器接收。'
          + '<b>常见坑。</b>直接遍历 <code>ArrayList</code> 时如果有人退出会抛 <code>ConcurrentModificationException</code>（M4 解决）；'
          + 'writer 没有 <code>flush()</code>，消息看起来「丢了」；用户名里带空格会破坏「用户名 + 冒号 + 内容」的格式，最好在客户端就禁止。'
          + '还有一个小坑：构造器里 <code>readLine()</code> 读用户名时也会阻塞，如果客户端连上却不发用户名，这个 handler 会一直卡在构造器里——'
          + '实际项目可以在 socket 上设置 <code>setSoTimeout</code>，超时就断开。'
          + '<b>答辩 / 评分看什么。</b>老师会开三个客户端互发，并检查加入 / 离开提示是否完整。'
          + '你要能解释「为什么客户端不直接连客户端」「广播时遍历的是什么对象」，以及「用户名握手为什么必须排在第一行」。',
        tests: []
      },

      {
        n: 4,
        title: 'M4 · 健壮性：断线、重名、端口占用与并发修改',
        tasks: [
          '用同一个端口启动第二个服务器，程序不崩溃，而是打印「port 1004 is already in use」并退出',
          '客户端直接关窗口（不输入 /quit），服务器在 1 秒内打印 Alice 的断开日志（closed / connection lost），其余客户端不受影响',
          '三个客户端同时快速发消息、同时退出，服务器不出现 ConcurrentModificationException，也不重复广播同一个人 left',
          '客户端连接一个没有启动的服务器时，打印友好提示「cannot connect to localhost:1004」，而不是一整屏堆栈',
          '服务器关闭后，所有客户端都能感知并退出，不留下僵尸线程；再次启动服务器时端口可以立即复用'
        ],
        starter: `/* ===== 文件 1：ChatServerM4.java ===== */
import java.io.IOException;
import java.net.BindException;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;

public class ChatServerM4 {
    public static void main(String[] args) {
        int port = args.length > 0 ? Integer.parseInt(args[0]) : 1004;

        try (ServerSocket serverSocket = new ServerSocket()) {
            // TODO 1: setReuseAddress(true)，再 bind(new InetSocketAddress(port))
            System.out.println("[SERVER] listening on port " + port + " ...");

            while (!serverSocket.isClosed()) {
                Socket socket = serverSocket.accept();
                try {
                    ClientHandlerM4 handler = new ClientHandlerM4(socket);
                    new Thread(handler).start();
                } catch (IOException e) {
                    System.out.println("[SERVER] rejected a client: " + e.getMessage());
                    socket.close();
                }
            }
        } catch (BindException e) {
            // TODO 2: 打印「端口已被占用」的人话提示，不要直接抛堆栈
        } catch (IOException e) {
            System.out.println("[SERVER] stopped: " + e.getMessage());
        }
    }
}

/* ===== 文件 2：ClientHandlerM4.java ===== */
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicBoolean;

public class ClientHandlerM4 implements Runnable {
    public static final CopyOnWriteArrayList<ClientHandlerM4> clientHandlers =
            new CopyOnWriteArrayList<>();

    private final Socket socket;
    private final BufferedReader reader;
    private final BufferedWriter writer;
    private final String username;
    private final AtomicBoolean closed = new AtomicBoolean(false);

    public ClientHandlerM4(Socket socket) throws IOException {
        this.socket = socket;
        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
        String name = reader.readLine();
        this.username = (name == null || name.isBlank())
                ? "guest-" + socket.getPort()
                : name.trim();
    }

    @Override
    public void run() {
        // TODO 3: 加入 clientHandlers，广播 joined
        try {
            String message;
            while ((message = reader.readLine()) != null) {
                broadcast(username + ": " + message);
            }
        } catch (IOException e) {
            System.out.println("[SERVER] " + username + " connection lost");
        } finally {
            // TODO 4: 调用 close()，保证只清理一次
        }
    }

    public void send(String message) {
        // TODO 5: 同步写一行并 flush；close 之后直接 return
    }

    public static void broadcast(String message) {
        for (ClientHandlerM4 handler : clientHandlers) {
            handler.send(message);
        }
    }

    public void close() {
        // TODO 6: AtomicBoolean 保证幂等：只移除一次、只广播一次 left、只 close 一次
    }
}`,
        hints: [
          'ConcurrentModificationException 来自「一边遍历 ArrayList，一边 remove」；CopyOnWriteArrayList 的迭代器看的是快照，正好适合读多写少的广播。',
          'close() 可能被 readLine 返回 null、IOException、send 失败三条路径同时触发，用 AtomicBoolean 的 compareAndSet 保证只执行一次。',
          'socket.isConnected() 只表示「曾经连上过」，不能判断对方是否还活着；可靠信号是 readLine() 返回 null 或抛 IOException。',
          '多个线程可能同时向同一个客户端广播，BufferedWriter 不是线程安全的；在 send 方法上加 synchronized，避免两条消息交错。',
          'BindException 表示端口被占用；Windows 下用 netstat -ano | findstr 1004 找 PID，或换一个端口启动。setReuseAddress(true) 要在 bind 之前调用。'
        ],
        solution: `/* ===== 文件 1：ChatServerM4.java ===== */
import java.io.IOException;
import java.net.BindException;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;

public class ChatServerM4 {
    public static void main(String[] args) {
        int port = 1004;
        if (args.length > 0) {
            try {
                port = Integer.parseInt(args[0]);
            } catch (NumberFormatException e) {
                System.out.println("[SERVER] invalid port: " + args[0]);
                return;
            }
        }

        try (ServerSocket serverSocket = new ServerSocket()) {
            serverSocket.setReuseAddress(true);
            serverSocket.bind(new InetSocketAddress(port));
            System.out.println("[SERVER] listening on port " + port + " ...");

            while (!serverSocket.isClosed()) {
                Socket socket = serverSocket.accept();
                System.out.println("[SERVER] connection from " + socket.getRemoteSocketAddress());
                try {
                    ClientHandlerM4 handler = new ClientHandlerM4(socket);
                    new Thread(handler, "client-" + socket.getPort()).start();
                } catch (IOException e) {
                    System.out.println("[SERVER] rejected a client: " + e.getMessage());
                    closeQuietly(socket);
                }
            }
        } catch (BindException e) {
            System.out.println("[SERVER] port " + port + " is already in use.");
            System.out.println("[SERVER] close the other process, or run: java ChatServerM4 1005");
        } catch (IOException e) {
            System.out.println("[SERVER] stopped: " + e.getMessage());
        }
    }

    private static void closeQuietly(Socket socket) {
        try {
            socket.close();
        } catch (IOException ignored) {
        }
    }
}

/* ===== 文件 2：ClientHandlerM4.java ===== */
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicBoolean;

public class ClientHandlerM4 implements Runnable {
    public static final CopyOnWriteArrayList<ClientHandlerM4> clientHandlers =
            new CopyOnWriteArrayList<>();

    private final Socket socket;
    private final BufferedReader reader;
    private final BufferedWriter writer;
    private final String username;
    private final AtomicBoolean closed = new AtomicBoolean(false);

    public ClientHandlerM4(Socket socket) throws IOException {
        this.socket = socket;
        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));

        String name = reader.readLine();
        this.username = (name == null || name.isBlank())
                ? "guest-" + socket.getPort()
                : name.trim();
        if (username.length() > 20) {
            throw new IOException("username is too long");
        }
    }

    @Override
    public void run() {
        clientHandlers.add(this);
        broadcast("SERVER: " + username + " joined the chat");
        System.out.println("[SERVER] " + username + " joined, online: " + clientHandlers.size());

        try {
            String message;
            while ((message = reader.readLine()) != null) {
                broadcast(username + ": " + message);
            }
            System.out.println("[SERVER] " + username + " closed the connection");
        } catch (IOException e) {
            System.out.println("[SERVER] " + username + " connection lost: " + e.getMessage());
        } finally {
            close();
        }
    }

    public void send(String message) {
        synchronized (this) {
            if (closed.get()) {
                return;
            }
            try {
                writer.write(message);
                writer.newLine();
                writer.flush();
            } catch (IOException e) {
                close();
            }
        }
    }

    public static void broadcast(String message) {
        for (ClientHandlerM4 handler : clientHandlers) {
            handler.send(message);
        }
    }

    public void close() {
        if (!closed.compareAndSet(false, true)) {
            return;
        }
        clientHandlers.remove(this);
        broadcast("SERVER: " + username + " left the chat");
        System.out.println("[SERVER] " + username + " removed, online: " + clientHandlers.size());
        try {
            socket.close();
        } catch (IOException ignored) {
        }
    }
}

/* ===== 文件 3：ChatClientM4.java ===== */
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.Scanner;

public class ChatClientM4 {
    private final Socket socket;
    private final BufferedReader reader;
    private final BufferedWriter writer;
    private final Scanner scanner = new Scanner(System.in);

    public ChatClientM4(String host, int port, String username) throws IOException {
        this.socket = new Socket();
        this.socket.connect(new InetSocketAddress(host, port), 3000);
        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
        sendRaw(username);
    }

    public void start() {
        Thread listener = new Thread(this::listenForMessage, "server-listener");
        listener.setDaemon(true);
        listener.start();
        sendMessages();
    }

    private void listenForMessage() {
        try {
            String message;
            while ((message = reader.readLine()) != null) {
                System.out.println(message);
            }
        } catch (IOException e) {
            System.out.println("[CLIENT] connection closed");
        }
    }

    private void sendMessages() {
        System.out.println("Type /quit to exit.");
        try {
            while (scanner.hasNextLine()) {
                String message = scanner.nextLine().trim();
                if (message.equalsIgnoreCase("/quit")) {
                    break;
                }
                if (message.isEmpty()) {
                    continue;
                }
                sendRaw(message);
            }
        } catch (IOException e) {
            System.out.println("[CLIENT] cannot send: " + e.getMessage());
        } finally {
            close();
        }
    }

    private void sendRaw(String text) throws IOException {
        writer.write(text);
        writer.newLine();
        writer.flush();
    }

    private void close() {
        try {
            socket.close();
        } catch (IOException ignored) {
        }
    }

    public static void main(String[] args) {
        String host = "localhost";
        int port = 1004;
        if (args.length >= 1) {
            host = args[0];
        }
        if (args.length >= 2) {
            try {
                port = Integer.parseInt(args[1]);
            } catch (NumberFormatException e) {
                System.out.println("[CLIENT] invalid port: " + args[1]);
                return;
            }
        }

        Scanner scanner = new Scanner(System.in);
        System.out.print("Username: ");
        String username = scanner.nextLine().trim();
        if (username.isEmpty()) {
            System.out.println("[CLIENT] username cannot be empty");
            return;
        }

        try {
            new ChatClientM4(host, port, username).start();
        } catch (IOException e) {
            System.out.println("[CLIENT] cannot connect to " + host + ":" + port
                    + " -> " + e.getMessage());
        }
    }
}`,
        explain: '<b>为什么这样设计。</b>这一关是从「能跑」到「敢演示」的分水岭。'
          + '<code>ArrayList</code> 在遍历时被另一个线程 <code>remove</code> 会抛 <code>ConcurrentModificationException</code>，'
          + '因为迭代器发现结构被改动了；<code>CopyOnWriteArrayList</code> 的迭代器读的是快照，广播这种「读多写少」的场景正合适。'
          + '关闭逻辑用 <code>AtomicBoolean</code> 做成幂等：无论 readLine 返回 null、抛 IOException，还是 send 失败，都只会移除一次、只广播一次 left。'
          + '<b>常见坑。</b>第一个坑是把 <code>socket.isConnected()</code> 当成「对方还活着」，它只表示曾经连上过；'
          + '第二个坑是多个广播线程同时写同一个 <code>BufferedWriter</code>，两条消息会交错，所以 <code>send</code> 要加锁；'
          + '第三个坑是端口占用：会抛 <code>BindException</code>，要在 main 里捕获并给出人话提示，'
          + '调试时用 <code>netstat -ano | findstr 1004</code> 找到占用进程，或者直接用参数换端口。'
          + '<b>一个设计取舍。</b>本项目沿用讲义结构，在 ClientHandler 构造器里读用户名；'
          + '这意味着一个连上却不发用户名的客户端会卡住 accept 循环。想更稳，可以把 <code>readLine()</code> 移进 <code>run()</code>，'
          + '或者给 socket 设 <code>setSoTimeout(5000)</code>，超时就断开——答辩时能主动指出这个边界，是加分项。'
          + '<b>答辩 / 评分看什么。</b>老师演示时一定会「暴力关掉一个客户端」，看你的服务器是否还活着、其他人是否还能聊、日志是否只出现一次 left。'
          + '能现场解释「为什么会 CME」「为什么 close 要幂等」「为什么 send 要同步」，比功能多更体现工程能力。',
        tests: []
      },
      {
        n: 5,
        title: 'M5 · 私聊、时间戳与 JavaFX 客户端',
        tasks: [
          '所有广播消息带时间戳，格式固定为「[HH:mm:ss] Alice: hello」',
          '输入「@Bob 你好」只有 Bob 收到，Bob 显示「[HH:mm:ss] (private) Alice -> Bob: 你好」，Alice 收到一条发送回执',
          '输入「@Nobody hi」时，Alice 收到「SERVER: user Nobody not found」，程序不崩溃',
          '两个客户端用同一个用户名登录，第二个被拒绝并提示「username ... is already taken」，第一个不受影响',
          '用 JavaFX 客户端连接服务器，在窗口里能看到历史消息、输入并发送，连续收发时窗口不卡顿',
          '关闭 JavaFX 窗口后，服务器能看到该用户离开，JVM 进程正常结束'
        ],
        starter: `/* ===== 文件 1：ChatMessage.java ===== */
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

abstract class ChatMessage {
    protected static final DateTimeFormatter TIME_FORMAT =
            DateTimeFormatter.ofPattern("HH:mm:ss");
    protected final String sender;
    protected final String body;

    protected ChatMessage(String sender, String body) {
        this.sender = sender;
        this.body = body;
    }

    protected String timestamp() {
        return LocalTime.now().format(TIME_FORMAT);
    }

    public abstract String render();
}

class BroadcastMessage extends ChatMessage {
    public BroadcastMessage(String sender, String body) {
        super(sender, body);
    }

    @Override
    public String render() {
        // TODO 1: 返回 "[时间] sender: body"
        return body;
    }
}

class PrivateMessage extends ChatMessage {
    private final String target;

    public PrivateMessage(String sender, String target, String body) {
        super(sender, body);
        this.target = target;
    }

    @Override
    public String render() {
        // TODO 2: 返回 "[时间] (private) sender -> target: body"
        return body;
    }
}

/* ===== 文件 2：ClientHandlerM5.java（只列关键片段） ===== */
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ClientHandlerM5 implements Runnable {
    public static final Map<String, ClientHandlerM5> clients = new ConcurrentHashMap<>();

    @Override
    public void run() {
        // TODO: 注册用户名、循环 readLine、调用 handle
    }

    private void handle(String line) {
        if (line.startsWith("@")) {
            // TODO 3: 找到第一个空格，切出 target 和 body
            // TODO 4: clients.get(target)；不存在就回 "SERVER: user ... not found"
            // TODO 5: 用 PrivateMessage 渲染后只发给目标
        } else {
            // TODO 6: 用 BroadcastMessage 渲染后广播
        }
    }
}

/* ===== 文件 3：ChatFxClient.java（界面骨架） ===== */
import javafx.application.Application;
import javafx.application.Platform;
import javafx.scene.Scene;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;

public class ChatFxClient extends Application {
    private TextArea chatArea;
    private TextField inputField;

    @Override
    public void start(Stage stage) {
        chatArea = new TextArea();
        inputField = new TextField();
        // TODO 7: 组装布局、连接服务器、启动读线程
        // TODO 8: 读线程收到消息后必须 Platform.runLater(...) 再改 chatArea
        BorderPane root = new BorderPane();
        root.setCenter(chatArea);
        root.setBottom(inputField);
        stage.setScene(new Scene(root, 560, 420));
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}`,
        hints: [
          '协议可以先用最简单的文本格式：以 @ 开头表示私聊，第一个空格前是目标用户名，空格后是正文；不引入 JSON 也能一行一条地传。',
          '时间戳统一由服务器生成，避免各客户端时钟不一致；用 LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"))。',
          'ConcurrentHashMap 的 putIfAbsent 可以原子地完成「检查重名 + 注册」，比先 containsKey 再 put 安全。',
          'JavaFX 的控件只能在 FX Application Thread 上改；后台读线程必须用 Platform.runLater(() -> chatArea.appendText(...))。',
          '关闭窗口时只关 Stage 不关 Socket，读线程会一直阻塞在 readLine()，进程退不掉；在 stop() 里关闭 socket。',
          'JavaFX 不是 JDK 自带的，需要在 VM options 里加 --module-path 和 --add-modules javafx.controls；用 Maven 的 javafx-maven-plugin 更省事。'
        ],
        solution: `/* ===== 文件 1：ChatMessage.java ===== */
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

abstract class ChatMessage {
    protected static final DateTimeFormatter TIME_FORMAT =
            DateTimeFormatter.ofPattern("HH:mm:ss");
    protected final String sender;
    protected final String body;

    protected ChatMessage(String sender, String body) {
        this.sender = sender;
        this.body = body;
    }

    protected String timestamp() {
        return LocalTime.now().format(TIME_FORMAT);
    }

    public abstract String render();
}

class BroadcastMessage extends ChatMessage {
    public BroadcastMessage(String sender, String body) {
        super(sender, body);
    }

    @Override
    public String render() {
        return "[" + timestamp() + "] " + sender + ": " + body;
    }
}

class PrivateMessage extends ChatMessage {
    private final String target;

    public PrivateMessage(String sender, String target, String body) {
        super(sender, body);
        this.target = target;
    }

    @Override
    public String render() {
        return "[" + timestamp() + "] (private) " + sender + " -> " + target + ": " + body;
    }
}

/* ===== 文件 2：ChatServerM5.java ===== */
import java.io.IOException;
import java.net.BindException;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;

public class ChatServerM5 {
    public static void main(String[] args) {
        int port = 1004;
        if (args.length > 0) {
            try {
                port = Integer.parseInt(args[0]);
            } catch (NumberFormatException e) {
                System.out.println("[SERVER] invalid port: " + args[0]);
                return;
            }
        }

        try (ServerSocket serverSocket = new ServerSocket()) {
            serverSocket.setReuseAddress(true);
            serverSocket.bind(new InetSocketAddress(port));
            System.out.println("[SERVER] listening on port " + port + " ...");

            while (!serverSocket.isClosed()) {
                Socket socket = serverSocket.accept();
                try {
                    ClientHandlerM5 handler = new ClientHandlerM5(socket);
                    new Thread(handler, "client-" + socket.getPort()).start();
                } catch (IOException e) {
                    System.out.println("[SERVER] rejected a client: " + e.getMessage());
                    socket.close();
                }
            }
        } catch (BindException e) {
            System.out.println("[SERVER] port " + port + " is already in use.");
        } catch (IOException e) {
            System.out.println("[SERVER] stopped: " + e.getMessage());
        }
    }
}

/* ===== 文件 3：ClientHandlerM5.java ===== */
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

public class ClientHandlerM5 implements Runnable {
    public static final Map<String, ClientHandlerM5> clients = new ConcurrentHashMap<>();

    private final Socket socket;
    private final BufferedReader reader;
    private final BufferedWriter writer;
    private final String username;
    private final AtomicBoolean closed = new AtomicBoolean(false);
    private final AtomicBoolean joined = new AtomicBoolean(false);

    public ClientHandlerM5(Socket socket) throws IOException {
        this.socket = socket;
        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));

        String name = reader.readLine();
        if (name == null || name.isBlank()) {
            throw new IOException("empty username");
        }
        this.username = name.trim();
    }

    @Override
    public void run() {
        if (clients.putIfAbsent(username, this) != null) {
            send("SERVER: username " + username + " is already taken");
            close();
            return;
        }
        joined.set(true);
        broadcast("SERVER: " + username + " joined the chat");
        System.out.println("[SERVER] " + username + " joined, online: " + clients.size());

        try {
            String line;
            while ((line = reader.readLine()) != null) {
                handle(line.trim());
            }
        } catch (IOException e) {
            System.out.println("[SERVER] " + username + " connection lost");
        } finally {
            close();
        }
    }

    private void handle(String line) {
        if (line.isEmpty()) {
            return;
        }
        if (line.startsWith("@")) {
            int space = line.indexOf(' ');
            if (space < 0) {
                send("SERVER: usage: @username message");
                return;
            }
            String target = line.substring(1, space);
            String body = line.substring(space + 1).trim();
            if (target.isEmpty() || body.isEmpty()) {
                send("SERVER: usage: @username message");
                return;
            }
            ClientHandlerM5 receiver = clients.get(target);
            if (receiver == null) {
                send("SERVER: user " + target + " not found");
                return;
            }
            receiver.send(new PrivateMessage(username, target, body).render());
            send("[private -> " + target + "] " + body);
        } else {
            broadcast(new BroadcastMessage(username, line).render());
        }
    }

    public void send(String line) {
        synchronized (this) {
            if (closed.get()) {
                return;
            }
            try {
                writer.write(line);
                writer.newLine();
                writer.flush();
            } catch (IOException e) {
                close();
            }
        }
    }

    public static void broadcast(String line) {
        for (ClientHandlerM5 handler : clients.values()) {
            handler.send(line);
        }
    }

    public void close() {
        if (!closed.compareAndSet(false, true)) {
            return;
        }
        if (joined.get()) {
            clients.remove(username, this);
            broadcast("SERVER: " + username + " left the chat");
            System.out.println("[SERVER] " + username + " left, online: " + clients.size());
        }
        try {
            socket.close();
        } catch (IOException ignored) {
        }
    }
}

/* ===== 文件 4：ChatClientM5.java ===== */
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.Scanner;

public class ChatClientM5 {
    private final Socket socket;
    private final BufferedReader reader;
    private final BufferedWriter writer;
    private final Scanner scanner = new Scanner(System.in);

    public ChatClientM5(String host, int port, String username) throws IOException {
        this.socket = new Socket();
        this.socket.connect(new InetSocketAddress(host, port), 3000);
        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
        sendRaw(username);
    }

    public void start() {
        Thread listener = new Thread(this::listenForMessage, "server-listener");
        listener.setDaemon(true);
        listener.start();
        sendMessages();
    }

    private void listenForMessage() {
        try {
            String message;
            while ((message = reader.readLine()) != null) {
                System.out.println(message);
            }
        } catch (IOException e) {
            System.out.println("[CLIENT] connection closed");
        }
    }

    private void sendMessages() {
        System.out.println("Broadcast: hello");
        System.out.println("Private:   @Bob hello");
        System.out.println("Quit:      /quit");
        try {
            while (scanner.hasNextLine()) {
                String message = scanner.nextLine().trim();
                if (message.equalsIgnoreCase("/quit")) {
                    break;
                }
                if (message.isEmpty()) {
                    continue;
                }
                sendRaw(message);
            }
        } catch (IOException e) {
            System.out.println("[CLIENT] cannot send: " + e.getMessage());
        } finally {
            close();
        }
    }

    private void sendRaw(String text) throws IOException {
        writer.write(text);
        writer.newLine();
        writer.flush();
    }

    private void close() {
        try {
            socket.close();
        } catch (IOException ignored) {
        }
    }

    public static void main(String[] args) {
        String host = "localhost";
        int port = 1004;
        if (args.length >= 1) {
            host = args[0];
        }
        if (args.length >= 2) {
            port = Integer.parseInt(args[1]);
        }

        Scanner scanner = new Scanner(System.in);
        System.out.print("Username: ");
        String username = scanner.nextLine().trim();
        if (username.isEmpty() || username.contains(" ")) {
            System.out.println("[CLIENT] username cannot be empty or contain spaces");
            return;
        }

        try {
            new ChatClientM5(host, port, username).start();
        } catch (IOException e) {
            System.out.println("[CLIENT] cannot connect to " + host + ":" + port
                    + " -> " + e.getMessage());
        }
    }
}

/* ===== 文件 5：ChatFxClient.java（需要 JavaFX SDK） ===== */
import javafx.application.Application;
import javafx.application.Platform;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.control.TextInputDialog;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.stage.Stage;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;

public class ChatFxClient extends Application {
    private Socket socket;
    private BufferedReader reader;
    private BufferedWriter writer;
    private TextArea chatArea;
    private TextField inputField;
    private Label statusLabel;
    private volatile boolean running = true;

    @Override
    public void start(Stage stage) {
        chatArea = new TextArea();
        chatArea.setEditable(false);
        chatArea.setWrapText(true);

        inputField = new TextField();
        inputField.setPromptText("Type a message, press Enter to send");
        Button sendButton = new Button("Send");
        statusLabel = new Label("Not connected");

        sendButton.setOnAction(e -> sendMessage());
        inputField.setOnAction(e -> sendMessage());

        HBox bottom = new HBox(8, inputField, sendButton);
        HBox.setHgrow(inputField, Priority.ALWAYS);
        bottom.setPadding(new Insets(8));

        BorderPane root = new BorderPane(chatArea);
        root.setTop(statusLabel);
        root.setBottom(bottom);

        stage.setTitle("Chat Zoom · JavaFX Client");
        stage.setScene(new Scene(root, 620, 460));
        stage.setOnCloseRequest(e -> close());
        stage.show();

        connectWithDialog();
    }

    private void connectWithDialog() {
        TextInputDialog dialog = new TextInputDialog("guest");
        dialog.setTitle("Chat Zoom");
        dialog.setHeaderText("Choose a username");
        dialog.setContentText("Username:");
        String username = dialog.showAndWait().orElse("guest").trim();
        if (username.isEmpty()) {
            username = "guest";
        }

        try {
            socket = new Socket("localhost", 1004);
            reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
            writer.write(username);
            writer.newLine();
            writer.flush();
            statusLabel.setText("Connected as " + username);

            Thread listener = new Thread(this::listen, "fx-listener");
            listener.setDaemon(true);
            listener.start();
        } catch (IOException e) {
            statusLabel.setText("Connect failed: " + e.getMessage());
        }
    }

    private void listen() {
        try {
            String line;
            while (running && (line = reader.readLine()) != null) {
                String message = line;
                Platform.runLater(() -> chatArea.appendText(message + System.lineSeparator()));
            }
        } catch (IOException e) {
            if (running) {
                Platform.runLater(() -> statusLabel.setText("Disconnected"));
            }
        }
    }

    private void sendMessage() {
        String text = inputField.getText().trim();
        if (text.isEmpty() || writer == null) {
            return;
        }
        try {
            writer.write(text);
            writer.newLine();
            writer.flush();
            inputField.clear();
        } catch (IOException e) {
            statusLabel.setText("Send failed: " + e.getMessage());
        }
    }

    private void close() {
        running = false;
        try {
            if (socket != null) {
                socket.close();
            }
        } catch (IOException ignored) {
        }
    }

    @Override
    public void stop() {
        close();
    }

    public static void main(String[] args) {
        launch(args);
    }
}`,
        explain: '<b>为什么这样设计。</b>私聊不是「客户端直接连另一个客户端」，而是客户端把「发给谁」告诉服务器，服务器查用户名表后只转发给目标。'
          + '协议要在文本层设计清楚：以 <code>@</code> 开头的第一个 token 是目标用户名，剩下的才是正文；这样不用引入 JSON，也能用 <code>readLine()</code> 一行一条地传输。'
          + '消息类用抽象类 <code>ChatMessage</code> 加两个子类，把「广播消息长什么样」和「私聊消息长什么样」分开，服务器只调用 <code>render()</code>，'
          + '这是继承与多态在这个项目里最自然的落点。时间戳统一由服务器生成，避免各客户端时钟不一致。'
          + '<b>常见坑。</b>JavaFX 客户端最容易犯的错是在后台读线程里直接改 <code>TextArea</code>，这会抛 <code>IllegalStateException</code>；'
          + '所有 UI 更新都要包在 <code>Platform.runLater(...)</code> 里。另一个坑是关闭窗口时只关 Stage 不关 Socket，后台线程会一直阻塞在 <code>readLine()</code>，'
          + '进程退不掉；在 <code>stop()</code> 里关闭 socket 才能让读线程收到异常并结束。还有重名：用 <code>putIfAbsent</code> 原子注册，'
          + '失败时只给新连接发提示，不能把人踢下线。'
          + '<b>答辩 / 评分看什么。</b>把「广播 / 私聊 / 重名 / 断线」四条各演示一遍，再解释 <code>Platform.runLater</code> 为什么必要、'
          + '抽象类在这里解决了什么问题。老师还可能问你「时间戳为什么不由客户端生成」——答案是客户端时钟不可信，服务器才是唯一事实来源。',
        tests: []
      }
    ],
    extension: [
      '消息历史：服务器保留最近 50 条，新用户加入时只私聊推送历史，不要把历史广播给所有人',
      '文件传输：定义 FILE name size 协议头，先读固定字节数再写文件，注意区分文本协议与二进制数据',
      '聊天室房间：用 /join room1 切换房间，把广播范围从「所有人」缩小到「同一个房间的成员」',
      '服务器监控面板：用 JavaFX 做在线人数、连接时长、踢人按钮，练习跨线程更新 TableView'
    ],
    solutionNote: '代码按文件拆分：每个「===== 文件名 =====」段落保存为独立的 .java 文件，放在同一个目录（默认包）下。'
      + 'M1–M4 只需要 JDK 17；M5 的 JavaFX 客户端需要 JavaFX SDK 21，并在 VM options 里加 --module-path 与 --add-modules javafx.controls。'
      + '运行顺序永远是先 Server 后 Client；端口被占用时换一个端口或结束占用进程。'
      + '项目演示视频建议按「正常聊天 → 私聊 → 关掉一个客户端 → 重启服务器」四段录制，每段都让日志和界面同框。'
  },

  /* ==================================================================
   * 项目二 · Gomoku（ch03 类设计 + ch04 继承 + ch09 JavaFX + ch14 项目）
   * ================================================================== */
  {
    id: 'gomoku',
    title: 'Gomoku 五子棋',
    en: 'GOMOKU',
    tagline: '15×15 棋盘、四方向胜负、平局、JavaFX 界面与 AI 对手',
    level: 3,
    minutes: 720,
    chapters: ['ch03', 'ch04', 'ch09', 'ch14'],
    goals: [
      '能把五子棋拆成棋盘状态、落子规则、胜负判定、渲染四块，并解释每块为什么放在那个类里',
      '能写出「只检查最后一手所在四条线」的胜负判定，而不是每次遍历整个棋盘',
      '能用 moveCount 判断平局，并把非法输入、重复落子、越界都挡在状态修改之前',
      '能用 JavaFX Canvas 画棋盘、把鼠标坐标换算成行列，并处理重开、撤销与状态栏',
      '能加一个基于棋型评分的 AI 对手，并说清楚它的强度边界与改进方向'
    ],
    intro: 'Gomoku 是第二个 Java 项目（占总评 20%），官方要求覆盖 Java 类与继承、JavaFX 图形界面。'
      + '很多人一上来就写界面，结果规则和界面缠在一起，改一个 bug 要动三处。本项目反着来：先在控制台把棋盘、落子、胜负、平局做对，'
      + '再把同一套 GomokuGame 模型搬到 JavaFX 上，最后加状态栏、撤销、重开和 AI。'
      + '这样做的好处是：控制台版本可以快速验证规则，界面只负责「把状态画出来」和「把点击翻译成坐标」，两层互不污染。',
    milestones: [
      {
        n: 1,
        title: 'M1 · 控制台核心：棋盘、落子与四方向胜负',
        tasks: [
          '运行后看到 15×15 棋盘，列号与行号对齐，空位显示 +，黑棋显示 X，白棋显示 O',
          '黑棋先手，输入「7 7」后 (7,7) 变成 X，再输入「7 8」后变成 O，两人交替',
          '输入已在棋盘上的位置或越界坐标时，提示 invalid move，并且不换手',
          '连成横向、纵向、主对角线、副对角线任意一种五子，程序立即宣布获胜并停止接受输入',
          '在四子两端各补一子形成五连时都能判胜（说明两个方向都数了），而不是只朝一个方向数'
        ],
        starter: `import java.util.Scanner;

public class GomokuGame {
    static final int SIZE = 15;
    static final char EMPTY = '+';
    static final char BLACK = 'X';
    static final char WHITE = 'O';

    private final char[][] board = new char[SIZE][SIZE];
    private int currentPlayer = 1;
    private boolean gameOver = false;
    private int winner = 0;
    private final Scanner scanner = new Scanner(System.in);

    public GomokuGame() {
        for (int r = 0; r < SIZE; r++) {
            for (int c = 0; c < SIZE; c++) {
                board[r][c] = EMPTY;
            }
        }
    }

    public void play() {
        while (!gameOver) {
            render();
            System.out.print("Player " + currentPlayer + " (" + stoneOf(currentPlayer)
                    + "), enter row col: ");
            int row = scanner.nextInt();
            int col = scanner.nextInt();

            if (!place(row, col)) {
                System.out.println("Invalid move, try again.");
                continue;
            }

            char stone = stoneOf(currentPlayer);
            if (checkWin(row, col, stone)) {
                gameOver = true;
                winner = currentPlayer;
            } else {
                currentPlayer = 3 - currentPlayer;
            }
        }
        render();
        System.out.println("Player " + winner + " (" + stoneOf(winner) + ") wins!");
    }

    private boolean place(int row, int col) {
        // TODO 1: 越界返回 false
        // TODO 2: 已有棋子返回 false
        // TODO 3: 写入当前玩家的棋子并返回 true
        return false;
    }

    private boolean checkWin(int row, int col, char stone) {
        int[][] directions = {{0, 1}, {1, 0}, {1, 1}, {1, -1}};
        for (int[] d : directions) {
            int count = 1;
            // TODO 4: 正方向数 + 反方向数
            // TODO 5: 如果 count >= 5 返回 true
        }
        return false;
    }

    private char stoneOf(int player) {
        return player == 1 ? BLACK : WHITE;
    }

    private void render() {
        System.out.println();
        System.out.print("    ");
        for (int c = 0; c < SIZE; c++) {
            System.out.printf("%3d", c);
        }
        System.out.println();
        for (int r = 0; r < SIZE; r++) {
            System.out.printf("%3d ", r);
            for (int c = 0; c < SIZE; c++) {
                System.out.printf("%3c", board[r][c]);
            }
            System.out.println();
        }
        System.out.println();
    }

    public static void main(String[] args) {
        new GomokuGame().play();
    }
}`,
        hints: [
          '棋盘用 char[SIZE][SIZE]，三个常量 EMPTY / BLACK / WHITE 分别用 + / X / O，渲染时直接 printf("%3c")。',
          'place 的检查顺序是：先越界、再占用，最后才写入；任何一步失败都直接 return false，不要改 currentPlayer。',
          '胜负只需要检查最后一手：以落子点为中心，沿横、竖、两条对角线各数正反两个方向，总数达到 5 就赢。',
          '为什么不能只沿 8 个方向各数一次？因为「四子中间补一子成五」的情况要求把一条线的两侧合起来数，方向要成对。',
          '把「谁赢」存成 int winner（1 黑、2 白、0 无），比存字符串更好比较；渲染时再转成 X / O。'
        ],
        solution: `import java.util.Scanner;

public class GomokuGame {
    static final int SIZE = 15;
    static final char EMPTY = '+';
    static final char BLACK = 'X';
    static final char WHITE = 'O';

    private final char[][] board = new char[SIZE][SIZE];
    private int currentPlayer = 1;
    private boolean gameOver = false;
    private int winner = 0;
    private final Scanner scanner = new Scanner(System.in);

    public GomokuGame() {
        for (int r = 0; r < SIZE; r++) {
            for (int c = 0; c < SIZE; c++) {
                board[r][c] = EMPTY;
            }
        }
    }

    public void play() {
        while (!gameOver) {
            render();
            System.out.print("Player " + currentPlayer + " (" + stoneOf(currentPlayer)
                    + "), enter row col: ");
            int row = scanner.nextInt();
            int col = scanner.nextInt();

            if (!place(row, col)) {
                System.out.println("Invalid move: row / col must be 0-" + (SIZE - 1)
                        + " and the cell must be empty.");
                continue;
            }

            char stone = stoneOf(currentPlayer);
            if (checkWin(row, col, stone)) {
                gameOver = true;
                winner = currentPlayer;
            } else {
                currentPlayer = 3 - currentPlayer;
            }
        }
        render();
        System.out.println("Player " + winner + " (" + stoneOf(winner) + ") wins!");
    }

    private boolean place(int row, int col) {
        if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) {
            return false;
        }
        if (board[row][col] != EMPTY) {
            return false;
        }
        board[row][col] = stoneOf(currentPlayer);
        return true;
    }

    private boolean checkWin(int row, int col, char stone) {
        int[][] directions = {{0, 1}, {1, 0}, {1, 1}, {1, -1}};
        for (int[] d : directions) {
            int count = 1;
            count += countDirection(row, col, d[0], d[1], stone);
            count += countDirection(row, col, -d[0], -d[1], stone);
            if (count >= 5) {
                return true;
            }
        }
        return false;
    }

    private int countDirection(int row, int col, int dr, int dc, char stone) {
        int count = 0;
        int r = row + dr;
        int c = col + dc;
        while (r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r][c] == stone) {
            count++;
            r += dr;
            c += dc;
        }
        return count;
    }

    private char stoneOf(int player) {
        return player == 1 ? BLACK : WHITE;
    }

    private void render() {
        System.out.println();
        System.out.print("    ");
        for (int c = 0; c < SIZE; c++) {
            System.out.printf("%3d", c);
        }
        System.out.println();
        for (int r = 0; r < SIZE; r++) {
            System.out.printf("%3d ", r);
            for (int c = 0; c < SIZE; c++) {
                System.out.printf("%3c", board[r][c]);
            }
            System.out.println();
        }
        System.out.println();
    }

    public static void main(String[] args) {
        new GomokuGame().play();
    }
}`,
        explain: '<b>为什么这样设计。</b>控制台版本不是「退而求其次」，而是把规则从界面里剥离出来的最快方式。'
          + '<code>GomokuGame</code> 只负责棋盘状态与规则，<code>render()</code> 只负责把二维数组打印成人能看的样子；'
          + '后面换成 JavaFX 时，模型一行不用改，只换渲染层。'
          + '胜负判定只检查最后一手，是因为五子棋的胜局一定包含最后落下的那颗子：以它为中心，沿四条线各向两边数，总数达到 5 就赢。'
          + '这比「遍历整个棋盘找五连」快得多，也不会漏掉「中间补子成五」的情况。'
          + '<b>常见坑。</b>只沿一个方向数会漏掉反方向的棋子；把 <code>place</code> 的检查写在写入之后，会把非法落子留在棋盘上；'
          + '输错坐标后仍然切换玩家，会导致黑白错位。还有 <code>printf("%3c")</code> 的宽度要和列号对齐，否则棋盘看起来是歪的。'
          + '<b>答辩 / 评分看什么。</b>老师会随机摆出横、竖、两条对角线各一种五连，并故意在四子中间补一子，'
          + '看你的 <code>checkWin</code> 是否能判出来。你要能指着代码说清楚「为什么是 4 条线、为什么每条线要数两个方向」。',
        tests: []
      },
      {
        n: 2,
        title: 'M2 · 平局与输入健壮性：让规则闭环',
        tasks: [
          '输入字母、只输入一个数字、输入「7,7」、直接回车时，程序都给出提示并重新询问，不崩溃、不换手',
          '输入已经占用的位置时提示该位置已有棋子，当前玩家仍然是同一个人',
          '输入 q 时程序打印退出提示并结束，不抛 NoSuchElementException',
          '用 3×3 小棋盘（java GomokuGame 3）下满 9 手，程序输出「It is a draw」，而不是继续要输入',
          '棋盘下满但最后一手恰好五连时，优先判胜而不是判平局'
        ],
        starter: `import java.util.Scanner;

public class GomokuGame {
    static final char EMPTY = '+';
    static final char BLACK = 'X';
    static final char WHITE = 'O';

    private final int size;
    private final char[][] board;
    private int currentPlayer = 1;
    private int moves = 0;
    private boolean gameOver = false;
    private int winner = 0;
    private final Scanner scanner;

    public GomokuGame(int size, Scanner scanner) {
        this.size = size;
        this.scanner = scanner;
        this.board = new char[size][size];
        for (int r = 0; r < size; r++) {
            for (int c = 0; c < size; c++) {
                board[r][c] = EMPTY;
            }
        }
    }

    public void play() {
        while (!gameOver) {
            render();
            System.out.print("Player " + currentPlayer + " (row col, q to quit): ");
            String line = scanner.nextLine().trim();

            int row = -1;
            int col = -1;
            boolean validInput = false;

            // TODO 1: 处理 q / 空行
            // TODO 2: 把逗号替换成空格，用 Scanner 读两个 int；成功时把 validInput 设为 true
            // TODO 3: place 失败时 continue

            if (!validInput) {
                System.out.println("TODO: parse row and col first");
                continue;
            }

            moves++;
            char stone = stoneOf(currentPlayer);
            if (checkWin(row, col, stone)) {
                gameOver = true;
                winner = currentPlayer;
            } else if (moves == size * size) {
                // TODO 4: 平局
            } else {
                currentPlayer = 3 - currentPlayer;
            }
        }
        render();
        // TODO 5: 区分「有人获胜」与「平局」两种输出
    }

    private boolean place(int row, int col) {
        if (row < 0 || row >= size || col < 0 || col >= size) {
            return false;
        }
        if (board[row][col] != EMPTY) {
            return false;
        }
        board[row][col] = stoneOf(currentPlayer);
        return true;
    }

    private boolean checkWin(int row, int col, char stone) {
        int[][] directions = {{0, 1}, {1, 0}, {1, 1}, {1, -1}};
        for (int[] d : directions) {
            int count = 1
                    + countDirection(row, col, d[0], d[1], stone)
                    + countDirection(row, col, -d[0], -d[1], stone);
            if (count >= 5) {
                return true;
            }
        }
        return false;
    }

    private int countDirection(int row, int col, int dr, int dc, char stone) {
        int count = 0;
        int r = row + dr;
        int c = col + dc;
        while (r >= 0 && r < size && c >= 0 && c < size && board[r][c] == stone) {
            count++;
            r += dr;
            c += dc;
        }
        return count;
    }

    private char stoneOf(int player) {
        return player == 1 ? BLACK : WHITE;
    }

    private void render() {
        System.out.println();
        System.out.print("    ");
        for (int c = 0; c < size; c++) {
            System.out.printf("%3d", c);
        }
        System.out.println();
        for (int r = 0; r < size; r++) {
            System.out.printf("%3d ", r);
            for (int c = 0; c < size; c++) {
                System.out.printf("%3c", board[r][c]);
            }
            System.out.println();
        }
        System.out.println();
    }

    public static void main(String[] args) {
        int size = args.length > 0 ? Integer.parseInt(args[0]) : 15;
        new GomokuGame(size, new Scanner(System.in)).play();
    }
}`,
        hints: [
          '先读整行再解析，比 nextInt() 更稳：nextInt() 遇到字母会直接抛 InputMismatchException，整行解析可以自己决定怎么提示。',
          '用 line.replace(",", " ") 把「7,7」变成「7 7」，再 new Scanner(line) 读两个 int，hasNextInt() 用来判断是否合法。',
          '平局不用遍历棋盘，维护一个 moves 计数器：每成功落一子加一，等于 size * size 就是棋盘满了。',
          '判断顺序很重要：先 checkWin 再判断 moves 是否满，否则最后一手成五会被误判成平局。',
          '允许用命令行参数传棋盘大小（3、5、15），这样不用下满 15×15 也能验证平局逻辑。'
        ],
        solution: `import java.util.Scanner;

public class GomokuGame {
    static final char EMPTY = '+';
    static final char BLACK = 'X';
    static final char WHITE = 'O';

    private final int size;
    private final char[][] board;
    private int currentPlayer = 1;
    private int moves = 0;
    private boolean gameOver = false;
    private int winner = 0;
    private final Scanner scanner;

    public GomokuGame(int size, Scanner scanner) {
        this.size = size;
        this.scanner = scanner;
        this.board = new char[size][size];
        for (int r = 0; r < size; r++) {
            for (int c = 0; c < size; c++) {
                board[r][c] = EMPTY;
            }
        }
    }

    public void play() {
        while (!gameOver) {
            render();
            System.out.print("Player " + currentPlayer + " (" + stoneOf(currentPlayer)
                    + "), enter row col (q to quit): ");
            String line = scanner.nextLine().trim();

            if (line.equalsIgnoreCase("q")) {
                System.out.println("Game quit. Thanks for playing.");
                return;
            }
            if (line.isEmpty()) {
                continue;
            }

            Scanner lineScanner = new Scanner(line.replace(',', ' '));
            if (!lineScanner.hasNextInt()) {
                System.out.println("Please enter two integers, for example: 7 7");
                continue;
            }
            int row = lineScanner.nextInt();
            if (!lineScanner.hasNextInt()) {
                System.out.println("Please enter two integers, for example: 7 7");
                continue;
            }
            int col = lineScanner.nextInt();

            if (!place(row, col)) {
                System.out.println("Invalid move: row / col must be 0-" + (size - 1)
                        + " and the cell must be empty.");
                continue;
            }

            moves++;
            char stone = stoneOf(currentPlayer);
            if (checkWin(row, col, stone)) {
                gameOver = true;
                winner = currentPlayer;
            } else if (moves == size * size) {
                gameOver = true;
                winner = 0;
            } else {
                currentPlayer = 3 - currentPlayer;
            }
        }

        render();
        if (winner == 0) {
            System.out.println("It is a draw. The board is full and nobody has five in a row.");
        } else {
            System.out.println("Player " + winner + " (" + stoneOf(winner)
                    + ") wins in " + moves + " moves!");
        }
    }

    private boolean place(int row, int col) {
        if (row < 0 || row >= size || col < 0 || col >= size) {
            return false;
        }
        if (board[row][col] != EMPTY) {
            return false;
        }
        board[row][col] = stoneOf(currentPlayer);
        return true;
    }

    private boolean checkWin(int row, int col, char stone) {
        int[][] directions = {{0, 1}, {1, 0}, {1, 1}, {1, -1}};
        for (int[] d : directions) {
            int count = 1
                    + countDirection(row, col, d[0], d[1], stone)
                    + countDirection(row, col, -d[0], -d[1], stone);
            if (count >= 5) {
                return true;
            }
        }
        return false;
    }

    private int countDirection(int row, int col, int dr, int dc, char stone) {
        int count = 0;
        int r = row + dr;
        int c = col + dc;
        while (r >= 0 && r < size && c >= 0 && c < size && board[r][c] == stone) {
            count++;
            r += dr;
            c += dc;
        }
        return count;
    }

    private char stoneOf(int player) {
        return player == 1 ? BLACK : WHITE;
    }

    private void render() {
        System.out.println();
        System.out.print("    ");
        for (int c = 0; c < size; c++) {
            System.out.printf("%3d", c);
        }
        System.out.println();
        for (int r = 0; r < size; r++) {
            System.out.printf("%3d ", r);
            for (int c = 0; c < size; c++) {
                System.out.printf("%3c", board[r][c]);
            }
            System.out.println();
        }
        System.out.printf("moves: %d / %d%n", moves, size * size);
        System.out.println();
    }

    public static void main(String[] args) {
        int size = 15;
        if (args.length > 0) {
            try {
                size = Integer.parseInt(args[0]);
            } catch (NumberFormatException e) {
                System.out.println("Board size must be an integer, e.g. java GomokuGame 15");
                return;
            }
        }
        if (size < 3) {
            System.out.println("Board size must be at least 3.");
            return;
        }
        new GomokuGame(size, new Scanner(System.in)).play();
    }
}`,
        explain: '<b>为什么这样设计。</b>平局最容易被忽略，也最容易写错。有人会去遍历整个棋盘数空格，既慢又容易和胜负判定重复；'
          + '更好的做法是维护 <code>moves</code> 计数器，每成功落一子加一，等于 <code>size * size</code> 就说明棋盘满了。'
          + '判断顺序必须是「先胜负、后平局」：最后一手可能恰好成五，如果先判满盘就会把胜利吞掉。'
          + '输入层单独处理，是因为控制台输入天然不可信：用户会输入字母、逗号、空行、负数，甚至直接按回车。'
          + '<b>常见坑。</b>用 <code>nextInt()</code> 读坐标时，遇到字母会抛 <code>InputMismatchException</code>，程序直接崩；'
          + '先读整行再用小 <code>Scanner</code> 解析，可以把「格式不对」变成一条提示。'
          + '另一个坑是解析失败后没有 <code>continue</code>，继续执行 <code>moves++</code>，导致计数和棋盘不一致。'
          + '还有 <code>line.split</code> 处理连续空格很麻烦，用 <code>replace(",", " ")</code> 加 <code>Scanner</code> 更稳。'
          + '<b>答辩 / 评分看什么。</b>老师会故意输入非法内容，看你是否崩溃；也会用 3×3 或 5×5 的棋盘验证平局。'
          + '你要能解释「为什么用 moveCount 而不是扫描棋盘」「为什么先判胜负再判平局」。',
        tests: []
      },

      {
        n: 3,
        title: 'M3 · JavaFX 界面：Canvas 棋盘与鼠标落子',
        tasks: [
          '运行 GomokuApp 后出现 696×696 左右的木质棋盘，15 条横线与 15 条竖线均匀分布，星位可见',
          '在棋盘交叉点附近点击，最近的位置出现黑色棋子；再点另一处出现白色棋子，黑白交替',
          '点击已经有棋子的交叉点、点击棋盘外、点击两条线正中间，都不会落子，也不会报错',
          '鼠标坐标换算正确：点左上角第一交叉点落在 (0,0)，点右下角落在 (14,14)，不会整体偏移一格',
          '任意一方连成五子后，窗口标题显示 Black wins 或 White wins，再点击不再落子'
        ],
        starter: `import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

public class GomokuApp extends Application {
    private static final int SIZE = 15;
    private static final double CELL = 44;
    private static final double MARGIN = 40;
    private static final double BOARD_SIZE = MARGIN * 2 + CELL * (SIZE - 1);

    private final GomokuGame game = new GomokuGame();
    private Canvas canvas;
    private Stage stage;

    @Override
    public void start(Stage primaryStage) {
        this.stage = primaryStage;
        canvas = new Canvas(BOARD_SIZE, BOARD_SIZE);

        // TODO 1: 给 canvas 设置 setOnMouseClicked，调用 handleClick(x, y)
        // TODO 2: 把 canvas 放进 Pane，创建 Scene，设置标题、不可缩放、show()

        drawBoard();
    }

    private void handleClick(double x, double y) {
        // TODO 3: 用 Math.round((x - MARGIN) / CELL) 算 col，row 同理
        // TODO 4: 越界或离交叉点太远就 return
        // TODO 5: game.place(row, col) 成功后 drawBoard()；若 gameOver 更新标题
    }

    private void drawBoard() {
        GraphicsContext gc = canvas.getGraphicsContext2D();

        // TODO 6: 填充木色背景
        // TODO 7: 画 15 条横线 + 15 条竖线
        // TODO 8: 画星位，再遍历棋盘画黑白棋子
    }

    private void drawStone(GraphicsContext gc, int row, int col, boolean black) {
        // TODO 9: 以 (MARGIN + col * CELL, MARGIN + row * CELL) 为圆心画圆
    }

    public static void main(String[] args) {
        launch(args);
    }
}

class GomokuGame {
    static final int SIZE = 15;
    static final char EMPTY = ' ';
    static final char BLACK = 'X';
    static final char WHITE = 'O';

    private final char[][] board = new char[SIZE][SIZE];
    private int currentPlayer = 1;
    private boolean gameOver = false;
    private int winner = 0;
    private int moves = 0;

    GomokuGame() {
        for (int r = 0; r < SIZE; r++) {
            for (int c = 0; c < SIZE; c++) {
                board[r][c] = EMPTY;
            }
        }
    }

    boolean place(int row, int col) {
        if (gameOver || row < 0 || row >= SIZE || col < 0 || col >= SIZE) {
            return false;
        }
        if (board[row][col] != EMPTY) {
            return false;
        }
        char stone = stoneOf(currentPlayer);
        board[row][col] = stone;
        moves++;
        if (checkWin(row, col, stone)) {
            gameOver = true;
            winner = currentPlayer;
        } else if (moves == SIZE * SIZE) {
            gameOver = true;
            winner = 0;
        } else {
            currentPlayer = 3 - currentPlayer;
        }
        return true;
    }

    private boolean checkWin(int row, int col, char stone) {
        int[][] directions = {{0, 1}, {1, 0}, {1, 1}, {1, -1}};
        for (int[] d : directions) {
            int count = 1
                    + countDirection(row, col, d[0], d[1], stone)
                    + countDirection(row, col, -d[0], -d[1], stone);
            if (count >= 5) {
                return true;
            }
        }
        return false;
    }

    private int countDirection(int row, int col, int dr, int dc, char stone) {
        int count = 0;
        int r = row + dr;
        int c = col + dc;
        while (r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r][c] == stone) {
            count++;
            r += dr;
            c += dc;
        }
        return count;
    }

    private char stoneOf(int player) {
        return player == 1 ? BLACK : WHITE;
    }

    char getStone(int row, int col) {
        return board[row][col];
    }

    boolean isGameOver() {
        return gameOver;
    }

    int getWinner() {
        return winner;
    }
}`,
        hints: [
          '棋盘坐标是「交叉点」，不是格子中心：第 c 条竖线的 x 是 MARGIN + c * CELL，第 r 条横线的 y 是 MARGIN + r * CELL。',
          '点击换算用 Math.round((x - MARGIN) / CELL)，得到的是最近的交叉点编号；再用 0 到 14 的范围过滤。',
          '只 round 还不够：点在两条线正中间时会落到某一边，应该再用 Math.abs(x - centerX) > CELL / 2 拒绝。',
          '每次落子后整块重画最简单：fillRect 背景、strokeLine 画线、fillOval 画棋子，15×15 规模完全不用担心性能。',
          'JavaFX 的 Canvas 不会自动清空，drawBoard 一开始就要覆盖整块画布，否则旧棋子会残留。'
        ],
        solution: `import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

public class GomokuApp extends Application {
    private static final int SIZE = 15;
    private static final double CELL = 44;
    private static final double MARGIN = 40;
    private static final double BOARD_SIZE = MARGIN * 2 + CELL * (SIZE - 1);

    private final GomokuGame game = new GomokuGame();
    private Canvas canvas;
    private Stage stage;

    @Override
    public void start(Stage primaryStage) {
        this.stage = primaryStage;
        canvas = new Canvas(BOARD_SIZE, BOARD_SIZE);
        canvas.setOnMouseClicked(event -> handleClick(event.getX(), event.getY()));

        Pane root = new Pane(canvas);
        Scene scene = new Scene(root, BOARD_SIZE, BOARD_SIZE);
        primaryStage.setTitle("Gomoku · JavaFX");
        primaryStage.setScene(scene);
        primaryStage.setResizable(false);
        primaryStage.show();

        drawBoard();
    }

    private void handleClick(double x, double y) {
        int col = (int) Math.round((x - MARGIN) / CELL);
        int row = (int) Math.round((y - MARGIN) / CELL);
        if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) {
            return;
        }

        double centerX = MARGIN + col * CELL;
        double centerY = MARGIN + row * CELL;
        if (Math.abs(x - centerX) > CELL / 2 || Math.abs(y - centerY) > CELL / 2) {
            return;
        }

        if (!game.place(row, col)) {
            return;
        }
        drawBoard();
        if (game.isGameOver()) {
            stage.setTitle(game.getWinner() == 0
                    ? "Gomoku · Draw"
                    : "Gomoku · " + (game.getWinner() == 1 ? "Black" : "White") + " wins");
        }
    }

    private void drawBoard() {
        GraphicsContext gc = canvas.getGraphicsContext2D();

        gc.setFill(Color.web("#E3B778"));
        gc.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

        gc.setStroke(Color.web("#5A3A1B"));
        gc.setLineWidth(1.2);
        for (int i = 0; i < SIZE; i++) {
            double pos = MARGIN + i * CELL;
            gc.strokeLine(MARGIN, pos, BOARD_SIZE - MARGIN, pos);
            gc.strokeLine(pos, MARGIN, pos, BOARD_SIZE - MARGIN);
        }

        gc.setFill(Color.web("#5A3A1B"));
        int[] stars = {3, 7, 11};
        for (int r : stars) {
            for (int c : stars) {
                double cx = MARGIN + c * CELL;
                double cy = MARGIN + r * CELL;
                gc.fillOval(cx - 3, cy - 3, 6, 6);
            }
        }

        for (int r = 0; r < SIZE; r++) {
            for (int c = 0; c < SIZE; c++) {
                char stone = game.getStone(r, c);
                if (stone == GomokuGame.EMPTY) {
                    continue;
                }
                drawStone(gc, r, c, stone == GomokuGame.BLACK);
            }
        }
    }

    private void drawStone(GraphicsContext gc, int row, int col, boolean black) {
        double cx = MARGIN + col * CELL;
        double cy = MARGIN + row * CELL;
        double radius = CELL * 0.42;

        gc.setFill(black ? Color.web("#1A1A1A") : Color.web("#F7F7F7"));
        gc.fillOval(cx - radius, cy - radius, radius * 2, radius * 2);
        gc.setStroke(black ? Color.BLACK : Color.web("#8A8A8A"));
        gc.setLineWidth(1);
        gc.strokeOval(cx - radius, cy - radius, radius * 2, radius * 2);
    }

    public static void main(String[] args) {
        launch(args);
    }
}

class GomokuGame {
    static final int SIZE = 15;
    static final char EMPTY = ' ';
    static final char BLACK = 'X';
    static final char WHITE = 'O';

    private final char[][] board = new char[SIZE][SIZE];
    private int currentPlayer = 1;
    private boolean gameOver = false;
    private int winner = 0;
    private int moves = 0;

    GomokuGame() {
        for (int r = 0; r < SIZE; r++) {
            for (int c = 0; c < SIZE; c++) {
                board[r][c] = EMPTY;
            }
        }
    }

    boolean place(int row, int col) {
        if (gameOver || row < 0 || row >= SIZE || col < 0 || col >= SIZE) {
            return false;
        }
        if (board[row][col] != EMPTY) {
            return false;
        }
        char stone = stoneOf(currentPlayer);
        board[row][col] = stone;
        moves++;
        if (checkWin(row, col, stone)) {
            gameOver = true;
            winner = currentPlayer;
        } else if (moves == SIZE * SIZE) {
            gameOver = true;
            winner = 0;
        } else {
            currentPlayer = 3 - currentPlayer;
        }
        return true;
    }

    private boolean checkWin(int row, int col, char stone) {
        int[][] directions = {{0, 1}, {1, 0}, {1, 1}, {1, -1}};
        for (int[] d : directions) {
            int count = 1
                    + countDirection(row, col, d[0], d[1], stone)
                    + countDirection(row, col, -d[0], -d[1], stone);
            if (count >= 5) {
                return true;
            }
        }
        return false;
    }

    private int countDirection(int row, int col, int dr, int dc, char stone) {
        int count = 0;
        int r = row + dr;
        int c = col + dc;
        while (r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r][c] == stone) {
            count++;
            r += dr;
            c += dc;
        }
        return count;
    }

    private char stoneOf(int player) {
        return player == 1 ? BLACK : WHITE;
    }

    char getStone(int row, int col) {
        return board[row][col];
    }

    boolean isGameOver() {
        return gameOver;
    }

    int getWinner() {
        return winner;
    }
}`,
        explain: '<b>为什么这样设计。</b>JavaFX 版本沿用控制台的 <code>GomokuGame</code>，只把 <code>render()</code> 换成 <code>drawBoard()</code>，'
          + '把 <code>scanner.nextInt()</code> 换成鼠标点击换算出的 (row, col)。这就是「模型和界面分离」的价值：规则只写一遍。'
          + '棋盘是画在 <code>Canvas</code> 上的，坐标系要注意：第 c 条竖线的 x 是 <code>MARGIN + c * CELL</code>，'
          + '点击反算时用 <code>Math.round</code> 得到最近的交叉点，再用半格距离过滤掉「点在两条线中间」的误触。'
          + '<b>常见坑。</b>第一，Canvas 不会自动清空，每次重画都要先 <code>fillRect</code> 覆盖整块画布；'
          + '第二，鼠标坐标是相对于 Canvas 左上角的，如果 Canvas 放进 Pane 后又被布局挪动，就会整体偏移——把 Canvas 直接放在 Pane 的 (0,0) 最稳；'
          + '第三，只在交叉点落子，不要按「格子中心」算，否则棋子会偏半格。'
          + '第四，窗口设为不可缩放，避免拖动窗口后棋盘被拉伸而点击错位。'
          + '<b>答辩 / 评分看什么。</b>老师会点几个交叉点看棋子是否落在正确位置，再点已有棋子和线中间测试过滤。'
          + '你要能解释 <code>Math.round</code> 与半格过滤分别解决什么问题，以及为什么规则层不需要 import 任何 JavaFX 类。',
        tests: []
      },
      {
        n: 4,
        title: 'M4 · 状态栏、重开与撤销：把界面做成产品',
        tasks: [
          '顶部状态栏实时显示「Black to move · 5 moves」，落子后立刻更新，不需要看控制台',
          '点 Restart 后棋盘清空、状态回到「Black to move · 0 moves」，之前的历史和胜负高亮全部消失',
          '点 Undo 撤销最后一手：棋子消失、手数减一、当前玩家恢复成落子的人；连续撤销到空棋盘也不会出错',
          '任意一方获胜后，五颗连子被红色圆圈标出，状态栏显示 Black wins / White wins，再点击棋盘不会落子',
          '获胜后点 Undo 可以撤销制胜一手，状态回到获胜者落子前，棋盘重新可以落子',
          '先落子再点 Restart、再点 Undo，程序不崩溃（历史已清空时 Undo 应该无动作）'
        ],
        starter: `/* ===== 在 M3 的基础上扩展 GomokuGame ===== */
import java.util.ArrayList;
import java.util.List;

class GomokuGame {
    static final int SIZE = 15;
    static final char EMPTY = ' ';
    static final char BLACK = 'X';
    static final char WHITE = 'O';

    private final char[][] board = new char[SIZE][SIZE];
    private final List<int[]> history = new ArrayList<>();
    private final List<int[]> winningLine = new ArrayList<>();
    private int currentPlayer = 1;
    private boolean gameOver = false;
    private int winner = 0;
    private int moves = 0;
    private int lastRow = -1;
    private int lastCol = -1;

    void reset() {
        // TODO 1: 清空棋盘、history、winningLine，重置所有计数
    }

    boolean place(int row, int col) {
        // TODO 2: 记录 history.add(new int[]{row, col, currentPlayer})
        // TODO 3: 胜利时调用 collectWinningLine
        return false;
    }

    boolean undo() {
        // TODO 4: 弹出 history 最后一手，清空该格，恢复 currentPlayer
        // TODO 5: 清空 gameOver / winner / winningLine，重新计算 lastRow / lastCol
        return false;
    }

    private void collectWinningLine(int row, int col, char stone) {
        // TODO 6: 沿四条线收集连续棋子，长度 >= 5 就存进 winningLine
    }

    // getStone / isGameOver / getWinner / getCurrentPlayer / getMoves
    // getWinningLine / getLastRow / getLastCol 省略
}

/* ===== GomokuApp 的关键变化 ===== */
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;

public class GomokuApp extends Application {
    private final GomokuGame game = new GomokuGame();
    private Label statusLabel;

    private void buildToolbar() {
        statusLabel = new Label();
        Button undoButton = new Button("Undo");
        Button restartButton = new Button("Restart");

        undoButton.setOnAction(e -> {
            // TODO 7: game.undo() 成功后重画并更新状态
        });
        restartButton.setOnAction(e -> {
            // TODO 8: game.reset()，重画并更新状态
        });

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);
        HBox toolbar = new HBox(10, statusLabel, spacer, undoButton, restartButton);
        toolbar.setPadding(new Insets(8));
        toolbar.setAlignment(Pos.CENTER_LEFT);
    }

    private void updateStatus() {
        // TODO 9: 根据 gameOver / winner / currentPlayer 生成状态文本
    }
}`,
        hints: [
          '撤销需要历史：每手记录 {row, col, player}，撤销时把 player 取回来赋给 currentPlayer，黑白才不会错。',
          '撤销不只是把格子清空，还要把 gameOver 置回 false、winner 置 0、winningLine 清空，否则界面仍显示「已结束」。',
          '重开就是一次完整 reset：棋盘、history、winningLine、moves、lastRow / lastCol、currentPlayer 全部回到初始值。',
          '状态栏不要自己维护一份「当前玩家」副本，永远从 game 里读；界面只做投影，状态只有一个事实来源。',
          '胜利高亮不要重新扫描棋盘，collectWinningLine 在判胜时顺手把五颗（或更多）棋子存进 winningLine，重画时直接用。'
        ],
        solution: `import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

import java.util.ArrayList;
import java.util.List;

public class GomokuApp extends Application {
    private static final int SIZE = 15;
    private static final double CELL = 44;
    private static final double MARGIN = 40;
    private static final double BOARD_SIZE = MARGIN * 2 + CELL * (SIZE - 1);

    private final GomokuGame game = new GomokuGame();
    private Canvas canvas;
    private Label statusLabel;

    @Override
    public void start(Stage stage) {
        canvas = new Canvas(BOARD_SIZE, BOARD_SIZE);
        canvas.setOnMouseClicked(event -> handleClick(event.getX(), event.getY()));

        statusLabel = new Label();
        Button undoButton = new Button("Undo");
        Button restartButton = new Button("Restart");

        undoButton.setOnAction(e -> {
            if (game.undo()) {
                drawBoard();
                updateStatus();
            }
        });
        restartButton.setOnAction(e -> {
            game.reset();
            drawBoard();
            updateStatus();
        });

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);
        HBox toolbar = new HBox(10, statusLabel, spacer, undoButton, restartButton);
        toolbar.setPadding(new Insets(8));
        toolbar.setAlignment(Pos.CENTER_LEFT);

        BorderPane root = new BorderPane();
        root.setTop(toolbar);
        root.setCenter(new Pane(canvas));

        stage.setTitle("Gomoku · JavaFX");
        stage.setScene(new Scene(root));
        stage.setResizable(false);
        stage.sizeToScene();
        stage.show();

        drawBoard();
        updateStatus();
    }

    private void handleClick(double x, double y) {
        if (game.isGameOver()) {
            return;
        }

        int col = (int) Math.round((x - MARGIN) / CELL);
        int row = (int) Math.round((y - MARGIN) / CELL);
        if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) {
            return;
        }

        double centerX = MARGIN + col * CELL;
        double centerY = MARGIN + row * CELL;
        if (Math.abs(x - centerX) > CELL / 2 || Math.abs(y - centerY) > CELL / 2) {
            return;
        }

        if (game.place(row, col)) {
            drawBoard();
            updateStatus();
        }
    }

    private void updateStatus() {
        if (game.isGameOver()) {
            if (game.getWinner() == 0) {
                statusLabel.setText("Draw · board is full");
            } else {
                statusLabel.setText((game.getWinner() == 1 ? "Black" : "White") + " wins");
            }
        } else {
            statusLabel.setText((game.getCurrentPlayer() == 1 ? "Black" : "White")
                    + " to move · " + game.getMoves() + " moves");
        }
    }

    private void drawBoard() {
        GraphicsContext gc = canvas.getGraphicsContext2D();

        gc.setFill(Color.web("#E3B778"));
        gc.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

        gc.setStroke(Color.web("#5A3A1B"));
        gc.setLineWidth(1.2);
        for (int i = 0; i < SIZE; i++) {
            double pos = MARGIN + i * CELL;
            gc.strokeLine(MARGIN, pos, BOARD_SIZE - MARGIN, pos);
            gc.strokeLine(pos, MARGIN, pos, BOARD_SIZE - MARGIN);
        }

        gc.setFill(Color.web("#5A3A1B"));
        int[] stars = {3, 7, 11};
        for (int r : stars) {
            for (int c : stars) {
                double cx = MARGIN + c * CELL;
                double cy = MARGIN + r * CELL;
                gc.fillOval(cx - 3, cy - 3, 6, 6);
            }
        }

        for (int r = 0; r < SIZE; r++) {
            for (int c = 0; c < SIZE; c++) {
                char stone = game.getStone(r, c);
                if (stone == GomokuGame.EMPTY) {
                    continue;
                }
                drawStone(gc, r, c, stone == GomokuGame.BLACK);
            }
        }

        if (!game.isGameOver() && game.getLastRow() >= 0) {
            double cx = MARGIN + game.getLastCol() * CELL;
            double cy = MARGIN + game.getLastRow() * CELL;
            gc.setFill(Color.web("#D62828"));
            gc.fillOval(cx - 4, cy - 4, 8, 8);
        }

        for (int[] cell : game.getWinningLine()) {
            double cx = MARGIN + cell[1] * CELL;
            double cy = MARGIN + cell[0] * CELL;
            gc.setStroke(Color.web("#D62828"));
            gc.setLineWidth(3);
            gc.strokeOval(cx - CELL * 0.46, cy - CELL * 0.46,
                    CELL * 0.92, CELL * 0.92);
        }
    }

    private void drawStone(GraphicsContext gc, int row, int col, boolean black) {
        double cx = MARGIN + col * CELL;
        double cy = MARGIN + row * CELL;
        double radius = CELL * 0.42;

        gc.setFill(black ? Color.web("#1A1A1A") : Color.web("#F7F7F7"));
        gc.fillOval(cx - radius, cy - radius, radius * 2, radius * 2);
        gc.setStroke(black ? Color.BLACK : Color.web("#8A8A8A"));
        gc.setLineWidth(1);
        gc.strokeOval(cx - radius, cy - radius, radius * 2, radius * 2);
    }

    public static void main(String[] args) {
        launch(args);
    }
}

class GomokuGame {
    static final int SIZE = 15;
    static final char EMPTY = ' ';
    static final char BLACK = 'X';
    static final char WHITE = 'O';

    private final char[][] board = new char[SIZE][SIZE];
    private final List<int[]> history = new ArrayList<>();
    private final List<int[]> winningLine = new ArrayList<>();

    private int currentPlayer = 1;
    private boolean gameOver = false;
    private int winner = 0;
    private int moves = 0;
    private int lastRow = -1;
    private int lastCol = -1;

    GomokuGame() {
        reset();
    }

    void reset() {
        for (int r = 0; r < SIZE; r++) {
            for (int c = 0; c < SIZE; c++) {
                board[r][c] = EMPTY;
            }
        }
        history.clear();
        winningLine.clear();
        currentPlayer = 1;
        gameOver = false;
        winner = 0;
        moves = 0;
        lastRow = -1;
        lastCol = -1;
    }

    boolean place(int row, int col) {
        if (gameOver || !inBounds(row, col) || board[row][col] != EMPTY) {
            return false;
        }

        char stone = stoneOf(currentPlayer);
        board[row][col] = stone;
        history.add(new int[]{row, col, currentPlayer});
        lastRow = row;
        lastCol = col;
        moves++;

        if (checkWin(row, col, stone)) {
            gameOver = true;
            winner = currentPlayer;
            collectWinningLine(row, col, stone);
        } else if (moves == SIZE * SIZE) {
            gameOver = true;
            winner = 0;
        } else {
            currentPlayer = 3 - currentPlayer;
        }
        return true;
    }

    boolean undo() {
        if (history.isEmpty()) {
            return false;
        }
        int[] last = history.remove(history.size() - 1);
        board[last[0]][last[1]] = EMPTY;
        moves--;
        currentPlayer = last[2];
        gameOver = false;
        winner = 0;
        winningLine.clear();

        if (history.isEmpty()) {
            lastRow = -1;
            lastCol = -1;
        } else {
            int[] previous = history.get(history.size() - 1);
            lastRow = previous[0];
            lastCol = previous[1];
        }
        return true;
    }

    private boolean checkWin(int row, int col, char stone) {
        int[][] directions = {{0, 1}, {1, 0}, {1, 1}, {1, -1}};
        for (int[] d : directions) {
            int count = 1
                    + countDirection(row, col, d[0], d[1], stone)
                    + countDirection(row, col, -d[0], -d[1], stone);
            if (count >= 5) {
                return true;
            }
        }
        return false;
    }

    private int countDirection(int row, int col, int dr, int dc, char stone) {
        int count = 0;
        int r = row + dr;
        int c = col + dc;
        while (inBounds(r, c) && board[r][c] == stone) {
            count++;
            r += dr;
            c += dc;
        }
        return count;
    }

    private void collectWinningLine(int row, int col, char stone) {
        int[][] directions = {{0, 1}, {1, 0}, {1, 1}, {1, -1}};
        for (int[] d : directions) {
            List<int[]> line = new ArrayList<>();
            line.add(new int[]{row, col});

            int r = row - d[0];
            int c = col - d[1];
            while (inBounds(r, c) && board[r][c] == stone) {
                line.add(0, new int[]{r, c});
                r -= d[0];
                c -= d[1];
            }

            r = row + d[0];
            c = col + d[1];
            while (inBounds(r, c) && board[r][c] == stone) {
                line.add(new int[]{r, c});
                r += d[0];
                c += d[1];
            }

            if (line.size() >= 5) {
                winningLine.clear();
                winningLine.addAll(line);
                return;
            }
        }
    }

    private boolean inBounds(int row, int col) {
        return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
    }

    private char stoneOf(int player) {
        return player == 1 ? BLACK : WHITE;
    }

    char getStone(int row, int col) {
        return board[row][col];
    }

    boolean isGameOver() {
        return gameOver;
    }

    int getWinner() {
        return winner;
    }

    int getCurrentPlayer() {
        return currentPlayer;
    }

    int getMoves() {
        return moves;
    }

    List<int[]> getWinningLine() {
        return winningLine;
    }

    int getLastRow() {
        return lastRow;
    }

    int getLastCol() {
        return lastCol;
    }
}`,
        explain: '<b>为什么这样设计。</b>状态栏、重开、撤销看起来是三个小功能，其实都在检验同一件事：你的状态是否只有一个事实来源。'
          + '界面不要自己维护「当前玩家」或「是否结束」的副本，而是每次从 <code>GomokuGame</code> 读；这样撤销、重开之后不会出现「棋盘空了但状态栏还写着 White wins」。'
          + '撤销必须依赖历史栈：每手记录 row、col、player，撤销时把 player 取回来赋给 currentPlayer，黑白才不会错位；'
          + '同时要把 gameOver、winner、winningLine 一起复位。胜利高亮也不要重新扫描棋盘，判胜时顺手把五颗棋子存进 winningLine，重画时直接标红。'
          + '<b>常见坑。</b>只把棋子清掉、不恢复 currentPlayer，会导致撤销后连下两步黑棋；'
          + '重开时只清棋盘、不清 history，下一次 Undo 会去清一个已经不存在的格子；'
          + '状态栏在构造时设置一次就再也不更新，落子后看起来「卡住了」。'
          + '还有一个细节：Restart 后 lastRow / lastCol 必须置 -1，否则会画出一个不存在的「最后一手」红点。'
          + '<b>答辩 / 评分看什么。</b>老师会「落子 → 撤销 → 重开 → 再撤销」这样乱序操作，看界面和状态是否始终一致。'
          + '你要能解释「为什么撤销要记录 player」「为什么界面不缓存当前玩家」「winningLine 是什么时候收集的」。',
        tests: []
      },
      {
        n: 5,
        title: 'M5 · AI 对手、计时与胜负提示',
        tasks: [
          '人执黑先手，落子后约 0.3 秒白棋自动回应，界面在 AI 思考期间不会卡死，也不能抢先落子',
          '当人已经连成四子（下一步就五连）时，AI 会优先堵住这个点；当 AI 自己有四子时，它会优先完成五连',
          '顶部计时器从 00:00 开始每秒加一，分出胜负后停止；点 Restart 后回到 00:00 并重新计时',
          '分出胜负时弹出对话框，显示 Black (you) wins / White (AI) wins / Draw，关闭后棋盘仍保留最终局面',
          'AI 走完一手后点 Undo，会一次撤销 AI 与人各一手，状态栏回到「Black to move」',
          '连续点 Restart、Undo、再落子，计时器与 AI 都不会出现重复触发或越走越快'
        ],
        starter: `/* ===== 在 M4 的基础上新增 GomokuAI ===== */
class GomokuAI {
    private static final int[][] DIRECTIONS = {{0, 1}, {1, 0}, {1, 1}, {1, -1}};

    static int[] chooseMove(GomokuGame game, char aiStone) {
        char humanStone = aiStone == GomokuGame.BLACK
                ? GomokuGame.WHITE : GomokuGame.BLACK;

        int bestScore = Integer.MIN_VALUE;
        int[] best = null;

        for (int r = 0; r < game.getSize(); r++) {
            for (int c = 0; c < game.getSize(); c++) {
                if (!game.isEmpty(r, c)) {
                    continue;
                }
                // TODO 1: 分别计算「我下这里」的进攻分与「对手下这里」的防守分
                // TODO 2: total = attack * 2 + defense * 3 / 2 + 中心奖励
                // TODO 3: 记录最高分的 (r, c)
            }
        }
        return best;
    }

    private static int scorePoint(GomokuGame game, int row, int col, char stone) {
        // TODO 4: 四个方向分别数正向、反向连续棋子
        // TODO 5: 再数两端是否为空，按连子数与开放端打分
        return 0;
    }
}

/* ===== GomokuApp 新增字段与流程 ===== */
public class GomokuApp extends Application {
    private final GomokuGame game = new GomokuGame();
    private Timeline clock;
    private int seconds = 0;
    private boolean aiThinking = false;
    private Label statusLabel;

    private void handleClick(double x, double y) {
        if (aiThinking || game.isGameOver() || game.getCurrentPlayer() != 1) {
            return;
        }
        // ... 换算 row / col，game.place(...)
        // TODO 6: 人落子后 askAiToMove()
    }

    private void askAiToMove() {
        aiThinking = true;
        updateStatus();
        // TODO 7: 用 PauseTransition 延迟 260ms，再调用 GomokuAI.chooseMove
        // TODO 8: AI 落子后重画、更新状态；若结束则 finishGame()
    }

    private void finishGame() {
        // TODO 9: 停表，弹 Alert 显示结果
    }
}`,
        hints: [
          'AI 不需要很复杂：对每个空位，分别按「AI 下这里」和「人下这里」评估四个方向的连子与开放端，取最高分即可。',
          '评分表可以很朴素：五连 1000000，活四 100000，冲四 10000，活三 8000，眠三 800，活二 300；关键是进攻与防守都算。',
          '防守分要乘一个不小于 1 的权重（例如 3/2），否则 AI 会沉迷于自己做活三，而忽视对手下一步就五连。',
          '不要用 Thread.sleep 做「思考延迟」，它会阻塞 JavaFX Application Thread，界面直接卡死；用 PauseTransition 或 Timeline。',
          '计时用 Timeline + KeyFrame(Duration.seconds(1), ...)，setCycleCount(Animation.INDEFINITE)；结束时 stop()，重开时 playFromStart()。',
          'Undo 要撤到「轮到人」为止：AI 刚走完通常撤两手；人刚赢时只撤一手，循环条件用 currentPlayer != 1。'
        ],
        solution: `import javafx.animation.Animation;
import javafx.animation.KeyFrame;
import javafx.animation.PauseTransition;
import javafx.animation.Timeline;
import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.paint.Color;
import javafx.stage.Stage;
import javafx.util.Duration;

import java.util.ArrayList;
import java.util.List;

public class GomokuApp extends Application {
    private static final int SIZE = 15;
    private static final double CELL = 44;
    private static final double MARGIN = 40;
    private static final double BOARD_SIZE = MARGIN * 2 + CELL * (SIZE - 1);

    private final GomokuGame game = new GomokuGame();
    private Canvas canvas;
    private Label statusLabel;
    private Label timeLabel;
    private Timeline clock;
    private int seconds = 0;
    private boolean aiThinking = false;

    @Override
    public void start(Stage stage) {
        canvas = new Canvas(BOARD_SIZE, BOARD_SIZE);
        canvas.setOnMouseClicked(event -> handleClick(event.getX(), event.getY()));

        statusLabel = new Label();
        timeLabel = new Label("TIME 00:00");
        Button undoButton = new Button("Undo");
        Button restartButton = new Button("Restart");

        undoButton.setOnAction(e -> undoMove());
        restartButton.setOnAction(e -> restartGame());

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);
        HBox toolbar = new HBox(10, statusLabel, spacer, timeLabel, undoButton, restartButton);
        toolbar.setPadding(new Insets(8));
        toolbar.setAlignment(Pos.CENTER_LEFT);

        BorderPane root = new BorderPane();
        root.setTop(toolbar);
        root.setCenter(new Pane(canvas));

        stage.setTitle("Gomoku · JavaFX + AI");
        stage.setScene(new Scene(root));
        stage.setResizable(false);
        stage.sizeToScene();
        stage.show();

        clock = new Timeline(new KeyFrame(Duration.seconds(1), e -> {
            if (!game.isGameOver()) {
                seconds++;
                updateStatus();
            }
        }));
        clock.setCycleCount(Animation.INDEFINITE);
        clock.play();

        drawBoard();
        updateStatus();
    }

    private void handleClick(double x, double y) {
        if (aiThinking || game.isGameOver() || game.getCurrentPlayer() != 1) {
            return;
        }

        int col = (int) Math.round((x - MARGIN) / CELL);
        int row = (int) Math.round((y - MARGIN) / CELL);
        if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) {
            return;
        }

        double centerX = MARGIN + col * CELL;
        double centerY = MARGIN + row * CELL;
        if (Math.abs(x - centerX) > CELL / 2 || Math.abs(y - centerY) > CELL / 2) {
            return;
        }

        if (!game.place(row, col)) {
            return;
        }
        drawBoard();
        updateStatus();

        if (game.isGameOver()) {
            finishGame();
        } else {
            askAiToMove();
        }
    }

    private void askAiToMove() {
        aiThinking = true;
        updateStatus();

        PauseTransition pause = new PauseTransition(Duration.millis(260));
        pause.setOnFinished(event -> {
            int[] move = GomokuAI.chooseMove(game, GomokuGame.WHITE);
            if (move != null) {
                game.place(move[0], move[1]);
            }
            aiThinking = false;
            drawBoard();
            updateStatus();
            if (game.isGameOver()) {
                finishGame();
            }
        });
        pause.play();
    }

    private void undoMove() {
        if (aiThinking) {
            return;
        }
        int undone = 0;
        while (undone < 2 && game.undo()) {
            undone++;
            if (game.getCurrentPlayer() == 1) {
                break;
            }
        }
        if (undone == 0) {
            return;
        }
        if (clock.getStatus() != Animation.Status.RUNNING) {
            clock.play();
        }
        drawBoard();
        updateStatus();
    }

    private void restartGame() {
        game.reset();
        seconds = 0;
        aiThinking = false;
        clock.playFromStart();
        drawBoard();
        updateStatus();
    }

    private void finishGame() {
        clock.stop();
        String result;
        if (game.getWinner() == 0) {
            result = "Draw. The board is full.";
        } else if (game.getWinner() == 1) {
            result = "Black (you) wins!";
        } else {
            result = "White (AI) wins!";
        }

        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("Gomoku");
        alert.setHeaderText("Game over");
        alert.setContentText(result);
        alert.show();
    }

    private void updateStatus() {
        int minutes = seconds / 60;
        int rest = seconds % 60;
        timeLabel.setText(String.format("TIME %02d:%02d", minutes, rest));

        if (game.isGameOver()) {
            if (game.getWinner() == 0) {
                statusLabel.setText("Draw · board is full");
            } else {
                statusLabel.setText((game.getWinner() == 1 ? "Black (you)" : "White (AI)") + " wins");
            }
        } else if (aiThinking) {
            statusLabel.setText("White (AI) is thinking ...");
        } else {
            statusLabel.setText("Black to move · " + game.getMoves() + " moves");
        }
    }

    private void drawBoard() {
        GraphicsContext gc = canvas.getGraphicsContext2D();

        gc.setFill(Color.web("#E3B778"));
        gc.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

        gc.setStroke(Color.web("#5A3A1B"));
        gc.setLineWidth(1.2);
        for (int i = 0; i < SIZE; i++) {
            double pos = MARGIN + i * CELL;
            gc.strokeLine(MARGIN, pos, BOARD_SIZE - MARGIN, pos);
            gc.strokeLine(pos, MARGIN, pos, BOARD_SIZE - MARGIN);
        }

        gc.setFill(Color.web("#5A3A1B"));
        int[] stars = {3, 7, 11};
        for (int r : stars) {
            for (int c : stars) {
                double cx = MARGIN + c * CELL;
                double cy = MARGIN + r * CELL;
                gc.fillOval(cx - 3, cy - 3, 6, 6);
            }
        }

        for (int r = 0; r < SIZE; r++) {
            for (int c = 0; c < SIZE; c++) {
                char stone = game.getStone(r, c);
                if (stone == GomokuGame.EMPTY) {
                    continue;
                }
                drawStone(gc, r, c, stone == GomokuGame.BLACK);
            }
        }

        if (!game.isGameOver() && game.getLastRow() >= 0) {
            double cx = MARGIN + game.getLastCol() * CELL;
            double cy = MARGIN + game.getLastRow() * CELL;
            gc.setFill(Color.web("#D62828"));
            gc.fillOval(cx - 4, cy - 4, 8, 8);
        }

        for (int[] cell : game.getWinningLine()) {
            double cx = MARGIN + cell[1] * CELL;
            double cy = MARGIN + cell[0] * CELL;
            gc.setStroke(Color.web("#D62828"));
            gc.setLineWidth(3);
            gc.strokeOval(cx - CELL * 0.46, cy - CELL * 0.46,
                    CELL * 0.92, CELL * 0.92);
        }
    }

    private void drawStone(GraphicsContext gc, int row, int col, boolean black) {
        double cx = MARGIN + col * CELL;
        double cy = MARGIN + row * CELL;
        double radius = CELL * 0.42;

        gc.setFill(black ? Color.web("#1A1A1A") : Color.web("#F7F7F7"));
        gc.fillOval(cx - radius, cy - radius, radius * 2, radius * 2);
        gc.setStroke(black ? Color.BLACK : Color.web("#8A8A8A"));
        gc.setLineWidth(1);
        gc.strokeOval(cx - radius, cy - radius, radius * 2, radius * 2);
    }

    public static void main(String[] args) {
        launch(args);
    }
}

class GomokuGame {
    static final int SIZE = 15;
    static final char EMPTY = ' ';
    static final char BLACK = 'X';
    static final char WHITE = 'O';

    private final char[][] board = new char[SIZE][SIZE];
    private final List<int[]> history = new ArrayList<>();
    private final List<int[]> winningLine = new ArrayList<>();

    private int currentPlayer = 1;
    private boolean gameOver = false;
    private int winner = 0;
    private int moves = 0;
    private int lastRow = -1;
    private int lastCol = -1;

    GomokuGame() {
        reset();
    }

    void reset() {
        for (int r = 0; r < SIZE; r++) {
            for (int c = 0; c < SIZE; c++) {
                board[r][c] = EMPTY;
            }
        }
        history.clear();
        winningLine.clear();
        currentPlayer = 1;
        gameOver = false;
        winner = 0;
        moves = 0;
        lastRow = -1;
        lastCol = -1;
    }

    boolean place(int row, int col) {
        if (gameOver || !inBounds(row, col) || board[row][col] != EMPTY) {
            return false;
        }

        char stone = stoneOf(currentPlayer);
        board[row][col] = stone;
        history.add(new int[]{row, col, currentPlayer});
        lastRow = row;
        lastCol = col;
        moves++;

        if (checkWin(row, col, stone)) {
            gameOver = true;
            winner = currentPlayer;
            collectWinningLine(row, col, stone);
        } else if (moves == SIZE * SIZE) {
            gameOver = true;
            winner = 0;
        } else {
            currentPlayer = 3 - currentPlayer;
        }
        return true;
    }

    boolean undo() {
        if (history.isEmpty()) {
            return false;
        }
        int[] last = history.remove(history.size() - 1);
        board[last[0]][last[1]] = EMPTY;
        moves--;
        currentPlayer = last[2];
        gameOver = false;
        winner = 0;
        winningLine.clear();

        if (history.isEmpty()) {
            lastRow = -1;
            lastCol = -1;
        } else {
            int[] previous = history.get(history.size() - 1);
            lastRow = previous[0];
            lastCol = previous[1];
        }
        return true;
    }

    private boolean checkWin(int row, int col, char stone) {
        int[][] directions = {{0, 1}, {1, 0}, {1, 1}, {1, -1}};
        for (int[] d : directions) {
            int count = 1
                    + countDirection(row, col, d[0], d[1], stone)
                    + countDirection(row, col, -d[0], -d[1], stone);
            if (count >= 5) {
                return true;
            }
        }
        return false;
    }

    private int countDirection(int row, int col, int dr, int dc, char stone) {
        int count = 0;
        int r = row + dr;
        int c = col + dc;
        while (inBounds(r, c) && board[r][c] == stone) {
            count++;
            r += dr;
            c += dc;
        }
        return count;
    }

    private void collectWinningLine(int row, int col, char stone) {
        int[][] directions = {{0, 1}, {1, 0}, {1, 1}, {1, -1}};
        for (int[] d : directions) {
            List<int[]> line = new ArrayList<>();
            line.add(new int[]{row, col});

            int r = row - d[0];
            int c = col - d[1];
            while (inBounds(r, c) && board[r][c] == stone) {
                line.add(0, new int[]{r, c});
                r -= d[0];
                c -= d[1];
            }

            r = row + d[0];
            c = col + d[1];
            while (inBounds(r, c) && board[r][c] == stone) {
                line.add(new int[]{r, c});
                r += d[0];
                c += d[1];
            }

            if (line.size() >= 5) {
                winningLine.clear();
                winningLine.addAll(line);
                return;
            }
        }
    }

    boolean inBounds(int row, int col) {
        return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
    }

    boolean isEmpty(int row, int col) {
        return inBounds(row, col) && board[row][col] == EMPTY;
    }

    char stoneAt(int row, int col) {
        return board[row][col];
    }

    private char stoneOf(int player) {
        return player == 1 ? BLACK : WHITE;
    }

    char getStone(int row, int col) {
        return board[row][col];
    }

    boolean isGameOver() {
        return gameOver;
    }

    int getWinner() {
        return winner;
    }

    int getCurrentPlayer() {
        return currentPlayer;
    }

    int getMoves() {
        return moves;
    }

    int getSize() {
        return SIZE;
    }

    List<int[]> getWinningLine() {
        return winningLine;
    }

    int getLastRow() {
        return lastRow;
    }

    int getLastCol() {
        return lastCol;
    }
}

class GomokuAI {
    private static final int[][] DIRECTIONS = {{0, 1}, {1, 0}, {1, 1}, {1, -1}};

    static int[] chooseMove(GomokuGame game, char aiStone) {
        char humanStone = aiStone == GomokuGame.BLACK
                ? GomokuGame.WHITE : GomokuGame.BLACK;
        int center = game.getSize() / 2;
        int bestScore = Integer.MIN_VALUE;
        int[] best = null;

        for (int r = 0; r < game.getSize(); r++) {
            for (int c = 0; c < game.getSize(); c++) {
                if (!game.isEmpty(r, c)) {
                    continue;
                }

                int attack = scorePoint(game, r, c, aiStone);
                int defense = scorePoint(game, r, c, humanStone);
                int centerBonus = center - (Math.abs(r - center) + Math.abs(c - center));
                int total = attack * 2 + defense * 3 / 2 + centerBonus;

                if (total > bestScore) {
                    bestScore = total;
                    best = new int[]{r, c};
                }
            }
        }
        return best;
    }

    private static int scorePoint(GomokuGame game, int row, int col, char stone) {
        int score = 0;

        for (int[] d : DIRECTIONS) {
            int forward = countRun(game, row, col, d[0], d[1], stone);
            int backward = countRun(game, row, col, -d[0], -d[1], stone);
            int total = 1 + forward + backward;

            int openEnds = 0;
            if (isOpen(game, row + (forward + 1) * d[0],
                    col + (forward + 1) * d[1])) {
                openEnds++;
            }
            if (isOpen(game, row - (backward + 1) * d[0],
                    col - (backward + 1) * d[1])) {
                openEnds++;
            }

            score += patternScore(total, openEnds);
        }
        return score;
    }

    private static int countRun(GomokuGame game, int row, int col,
                                int dr, int dc, char stone) {
        int count = 0;
        int r = row + dr;
        int c = col + dc;
        while (game.inBounds(r, c) && game.stoneAt(r, c) == stone) {
            count++;
            r += dr;
            c += dc;
        }
        return count;
    }

    private static boolean isOpen(GomokuGame game, int row, int col) {
        return game.inBounds(row, col)
                && game.stoneAt(row, col) == GomokuGame.EMPTY;
    }

    private static int patternScore(int total, int openEnds) {
        if (total >= 5) {
            return 1_000_000;
        }
        if (total == 4) {
            return openEnds == 2 ? 100_000 : (openEnds == 1 ? 10_000 : 0);
        }
        if (total == 3) {
            return openEnds == 2 ? 8_000 : (openEnds == 1 ? 800 : 0);
        }
        if (total == 2) {
            return openEnds == 2 ? 300 : (openEnds == 1 ? 30 : 0);
        }
        return openEnds == 2 ? 10 : 1;
    }
}`,
        explain: '<b>为什么这样设计。</b>这个 AI 不是搜索树，而是「棋型评分 + 一步贪心」：对每个空位，分别假设 AI 下这里、假设人下这里，'
          + '沿四个方向数连续棋子与两端是否为空，按「五连 > 活四 > 冲四 > 活三 > 眠三 > 活二」打分。'
          + '进攻分乘 2、防守分乘 1.5，是为了让它既不放过自己的胜机，也不会对对手的四子视而不见；中心奖励只是打破平局的轻量偏好。'
          + '这个强度足以应付课程演示，也能在答辩时讲清楚「为什么这样加权」「它什么时候会犯错」。'
          + '<b>常见坑。</b>第一，用 <code>Thread.sleep</code> 做「思考延迟」会阻塞 JavaFX Application Thread，界面直接卡死；'
          + '要用 <code>PauseTransition</code> 或 <code>Timeline</code>。第二，AI 思考期间没有锁住棋盘，玩家可以连点两下，导致黑白错位；'
          + '用 <code>aiThinking</code> 标志挡住输入。第三，计时器的 <code>KeyFrame</code> 在游戏结束后还在跑，要把 <code>clock.stop()</code> 写进 <code>finishGame()</code>。'
          + '第四，Undo 撤两手是常态，但人获胜时只该撤一手；用「一直撤到 currentPlayer == 1」的循环条件最稳。'
          + '<b>答辩 / 评分看什么。</b>老师会先让你连成四子看 AI 是否堵，再让你观察 AI 自己成四时是否知道取胜，最后问「你的 AI 时间复杂度是多少」——'
          + '答案是每个空位常数次方向扫描，约 <code>O(棋盘格数)</code>，不是指数搜索。能说清楚评分表与攻防权重，比「AI 很强」更有说服力。',
        tests: []
      }
    ],
    extension: [
      '把评分表换成真正的极小化极大搜索（深度 2–4，带 alpha-beta 剪枝），并比较它与贪心 AI 的对局结果',
      '加入「禁手」或「三三禁手」规则，把胜负判定扩展成规则引擎，而不是只数五连',
      '做棋盘尺寸选择（9×9 / 13×13 / 15×15）与难度选择（随机 / 贪心 / 搜索），把参数从常量改成构造器参数',
      '加入落子音效、最后一手动画与胜利连线闪烁，练习 JavaFX 的 Timeline 与 MediaPlayer'
    ],
    solutionNote: 'GomokuApp.java 与同文件内的 GomokuGame / GomokuAI 一起编译；JavaFX 需要 SDK 21，并在 VM options 里加 --module-path 与 --add-modules javafx.controls。'
      + '若只想验证规则，先跑 M1 / M2 的控制台版本，它不依赖 JavaFX。'
      + '演示时建议按「人先连四 → AI 堵 → 人获胜 → 弹窗 → 重开 → 计时归零」的顺序录，能一次覆盖所有评分点。'
  },
  /* ==================================================================
   * 项目三 · Snake（ch15 Python 基础 + ch16 类 + ch17 Tkinter + ch18 项目）
   * ================================================================== */
  {
    id: 'snake',
    title: 'Python Snake 贪吃蛇',
    en: 'SNAKE',
    tagline: 'Tkinter Canvas + after 循环 + 碰撞判定：把 500 行 Python 写成完整游戏',
    level: 2,
    minutes: 480,
    chapters: ['ch15', 'ch16', 'ch17', 'ch18'],
    goals: [
      '能解释 tk.Tk、Canvas、mainloop 各自的职责，并用 pack 布局出 HUD 与游戏画布',
      '能用 after 回调驱动游戏帧，而不是用 while True 阻塞事件循环，并说清楚两者的区别',
      '能实现食物随机生成、两种食物、蛇身增长与计分，保证食物不会刷在蛇身上',
      '能判定撞墙、撞自己、达到最大长度三种结束条件，并正确停止循环、解绑按键、显示结果',
      '能在主线上扩展开始菜单、障碍物、动态速度与暂停重开，形成可演示的完整小游戏'
    ],
    intro: 'Python 项目占总评 20%，官方要求覆盖 Python 包的使用、类与继承、图形界面三块。'
      + 'Snake 的代码量比两个 Java 项目小（约 500 行），但「小而完整」：窗口、游戏循环、输入、碰撞、计分、结束、重开一个都不能少。'
      + '本项目按 5 个里程碑推进：先画出一个静态画面，再让蛇动起来，然后加食物与增长，接着补齐三种结束条件，'
      + '最后做开始菜单、障碍、变速与暂停。每一关都给完整可运行脚本，建议先在 PyCharm 里跑通，再回头读代码。',
    milestones: [
      {
        n: 1,
        title: 'M1 · Tkinter 窗口与静态画面：先把棋盘画出来',
        tasks: [
          '运行脚本后出现一个 800×800、不可缩放的窗口，标题为 Snake Game，画布背景是黑色',
          '画布上能看到 20px 的浅色网格线，横竖各 41 条，把窗口切成 40×40 个格子',
          '蛇的初始三节显示在 (100,100)、(80,100)、(60,100)，蛇头颜色比身体亮，方块之间没有缝隙',
          '食物显示在 (300,300) 的红色圆点，不覆盖网格线，也不会跑到画布外',
          '关闭窗口后 Python 进程正常结束，控制台没有 TclError 或残留的 after 回调报错'
        ],
        starter: `import tkinter as tk

CELL = 20
WIDTH = 800
HEIGHT = 800


class SnakeGame(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Snake Game")
        self.geometry(f"{WIDTH}x{HEIGHT}")
        self.resizable(False, False)

        self.canvas = tk.Canvas(self, width=WIDTH, height=HEIGHT, bg="black",
                                highlightthickness=0)
        self.canvas.pack()

        self.snake = [(100, 100), (80, 100), (60, 100)]
        self.food = (300, 300)

        # TODO 1: 调用 self.draw()

    def draw(self):
        self.canvas.delete("all")
        self.draw_grid()
        # TODO 2: 画食物（create_oval）
        # TODO 3: 遍历 self.snake，画绿色方块（create_rectangle）

    def draw_grid(self):
        for x in range(0, WIDTH + 1, CELL):
            self.canvas.create_line(x, 0, x, HEIGHT, fill="#111111")
        for y in range(0, HEIGHT + 1, CELL):
            self.canvas.create_line(0, y, WIDTH, y, fill="#111111")


if __name__ == "__main__":
    SnakeGame().mainloop()`,
        hints: [
          'Tkinter 的坐标原点在画布左上角，x 向右、y 向下；格子 (col, row) 的左上角是 (col * CELL, row * CELL)。',
          'create_rectangle(x1, y1, x2, y2) 的 x2 / y2 是右下角，不是宽高；画一格要写 x + CELL, y + CELL。',
          '画布默认有一条 1–2px 的高亮边框，会吃掉 800×800 的可视区域；设置 highlightthickness=0 去掉它。',
          '每次重画先 canvas.delete("all")，再按「网格 → 食物 → 蛇」的顺序画，后画的会盖住先画的。',
          'mainloop() 必须放在最后一行；它启动事件循环后会阻塞，写在它后面的代码不会执行。'
        ],
        solution: `import tkinter as tk

CELL = 20
WIDTH = 800
HEIGHT = 800


class SnakeGame(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Snake Game")
        self.geometry(f"{WIDTH}x{HEIGHT}")
        self.resizable(False, False)

        self.canvas = tk.Canvas(self, width=WIDTH, height=HEIGHT, bg="black",
                                highlightthickness=0)
        self.canvas.pack()

        self.snake = [(100, 100), (80, 100), (60, 100)]
        self.food = (300, 300)

        self.draw()

    def draw(self):
        self.canvas.delete("all")
        self.draw_grid()

        fx, fy = self.food
        self.canvas.create_oval(fx + 3, fy + 3, fx + CELL - 3, fy + CELL - 3,
                                fill="red", outline="")

        for index, (x, y) in enumerate(self.snake):
            color = "#7CFC00" if index == 0 else "#32CD32"
            self.canvas.create_rectangle(x, y, x + CELL, y + CELL,
                                         fill=color, outline="black")

    def draw_grid(self):
        for x in range(0, WIDTH + 1, CELL):
            self.canvas.create_line(x, 0, x, HEIGHT, fill="#111111")
        for y in range(0, HEIGHT + 1, CELL):
            self.canvas.create_line(0, y, WIDTH, y, fill="#111111")


if __name__ == "__main__":
    SnakeGame().mainloop()`,
        explain: '<b>为什么这样设计。</b>Tkinter 程序的最小结构是「根窗口 → 控件 → mainloop」：<code>tk.Tk()</code> 是根窗口，'
          + '<code>Canvas</code> 是画布控件，<code>mainloop()</code> 启动事件循环并阻塞主线程。'
          + '先把静态画面画对，是在建立坐标系感：画布左上角是 (0,0)，x 向右、y 向下，每个格子 20px，'
          + '所以第 5 列第 5 行的左上角是 (100,100)。蛇的三节从 (100,100) 往左排，正好是「头在右、身体在左」。'
          + '<b>常见坑。</b><code>create_rectangle</code> 的后两个参数是右下角坐标，不是宽高；写成 <code>x + CELL - 1</code> 会留下 1px 缝。'
          + '画布默认有高亮边框，窗口看起来比 800 大一点；<code>highlightthickness=0</code> 可以去掉。'
          + '还有 <code>mainloop()</code> 后面的代码不会执行，别把游戏逻辑写在它下面。'
          + '<b>答辩 / 评分看什么。</b>老师会看窗口是否固定大小、蛇与食物的位置是否正确、重画时有没有闪烁。'
          + '你要能解释「Canvas 的坐标原点在哪」「为什么先画网格再画蛇」，以及 <code>mainloop</code> 到底在等什么。',
        tests: []
      },

      {
        n: 2,
        title: 'M2 · after 循环与方向键：让蛇动起来',
        tasks: [
          '运行后蛇每隔约 120ms 自动向右移动一格，尾巴跟着前进，长度保持 3 节',
          '按 ↑ 后蛇改为向上移动，按 ← 后改为向左，按 ↓ 后改为向下，方向立即在下一帧生效',
          '蛇向右移动时按 ← 没有任何反应（不能 180° 掉头）；按其他方向正常',
          '连续快速按两个方向键（如先 ↑ 再 ←）不会让蛇「穿到自己身上」或出现两节重叠',
          '关闭窗口后进程立即结束，控制台没有 invalid command name 或 after 相关异常'
        ],
        starter: `import tkinter as tk

CELL = 20
WIDTH = 800
HEIGHT = 800


class SnakeGame(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Snake Game")
        self.geometry(f"{WIDTH}x{HEIGHT}")
        self.resizable(False, False)

        self.canvas = tk.Canvas(self, width=WIDTH, height=HEIGHT, bg="black",
                                highlightthickness=0)
        self.canvas.pack()

        self.snake = [(100, 100), (80, 100), (60, 100)]
        self.food = (300, 300)
        self.snake_direction = "Right"
        self.delay = 120
        self.running = True

        # TODO 1: 绑定 <KeyPress> 到 change_direction
        # TODO 2: 调用 self.after(self.delay, self.run_game)

    def change_direction(self, event):
        opposite = {"Left": "Right", "Right": "Left",
                    "Up": "Down", "Down": "Up"}
        # TODO 3: 只接受方向键，且不能与当前方向相反

    def move_snake(self):
        # TODO 4: 根据 self.snake_direction 计算 new_head
        # TODO 5: self.snake = [new_head] + self.snake[:-1]
        pass

    def run_game(self):
        if not self.running:
            return
        self.move_snake()
        self.draw()
        # TODO 6: 再次 after，形成循环

    def draw(self):
        self.canvas.delete("all")
        self.draw_grid()
        fx, fy = self.food
        self.canvas.create_oval(fx + 3, fy + 3, fx + CELL - 3, fy + CELL - 3,
                                fill="red", outline="")
        for index, (x, y) in enumerate(self.snake):
            color = "#7CFC00" if index == 0 else "#32CD32"
            self.canvas.create_rectangle(x, y, x + CELL, y + CELL,
                                         fill=color, outline="black")

    def draw_grid(self):
        for x in range(0, WIDTH + 1, CELL):
            self.canvas.create_line(x, 0, x, HEIGHT, fill="#111111")
        for y in range(0, HEIGHT + 1, CELL):
            self.canvas.create_line(0, y, WIDTH, y, fill="#111111")


if __name__ == "__main__":
    SnakeGame().mainloop()`,
        hints: [
          'Tkinter 的 bind 写在根窗口上：self.bind("<KeyPress>", self.change_direction)，事件对象里的 event.keysym 就是 "Up" / "Down" / "Left" / "Right"。',
          '不要用 while True + time.sleep 驱动游戏：它会卡住 mainloop，窗口拖不动、按键也没反应；用 self.after(毫秒, 函数) 让 Tkinter 在空闲时回调你。',
          '禁止反向：维护 opposite 字典，如果 event.keysym 等于当前方向的反方向就忽略。',
          '移动蛇用「加头去尾」：self.snake = [new_head] + self.snake[:-1]，列表长度不变，看起来就是整体前进。',
          'run_game 的末尾必须再调用一次 self.after(...)，否则只动一帧就停了；用 self.running 标志防止关闭窗口后继续调度。'
        ],
        solution: `import tkinter as tk

CELL = 20
WIDTH = 800
HEIGHT = 800


class SnakeGame(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Snake Game")
        self.geometry(f"{WIDTH}x{HEIGHT}")
        self.resizable(False, False)

        self.canvas = tk.Canvas(self, width=WIDTH, height=HEIGHT, bg="black",
                                highlightthickness=0)
        self.canvas.pack()

        self.snake = [(100, 100), (80, 100), (60, 100)]
        self.food = (300, 300)
        self.snake_direction = "Right"
        self.delay = 120
        self.running = True

        self.bind("<KeyPress>", self.change_direction)
        self.focus_set()
        self.draw()
        self.after(self.delay, self.run_game)

    def change_direction(self, event):
        opposite = {"Left": "Right", "Right": "Left",
                    "Up": "Down", "Down": "Up"}
        if event.keysym in opposite:
            if event.keysym != opposite[self.snake_direction]:
                self.snake_direction = event.keysym

    def move_snake(self):
        head_x, head_y = self.snake[0]

        if self.snake_direction == "Left":
            head_x -= CELL
        elif self.snake_direction == "Right":
            head_x += CELL
        elif self.snake_direction == "Up":
            head_y -= CELL
        elif self.snake_direction == "Down":
            head_y += CELL

        new_head = (head_x, head_y)
        self.snake = [new_head] + self.snake[:-1]

    def run_game(self):
        if not self.running:
            return
        self.move_snake()
        self.draw()
        self.after(self.delay, self.run_game)

    def draw(self):
        self.canvas.delete("all")
        self.draw_grid()

        fx, fy = self.food
        self.canvas.create_oval(fx + 3, fy + 3, fx + CELL - 3, fy + CELL - 3,
                                fill="red", outline="")

        for index, (x, y) in enumerate(self.snake):
            color = "#7CFC00" if index == 0 else "#32CD32"
            self.canvas.create_rectangle(x, y, x + CELL, y + CELL,
                                         fill=color, outline="black")

    def draw_grid(self):
        for x in range(0, WIDTH + 1, CELL):
            self.canvas.create_line(x, 0, x, HEIGHT, fill="#111111")
        for y in range(0, HEIGHT + 1, CELL):
            self.canvas.create_line(0, y, WIDTH, y, fill="#111111")


if __name__ == "__main__":
    SnakeGame().mainloop()`,
        explain: '<b>为什么这样设计。</b>Tkinter 是单线程事件循环：<code>mainloop()</code> 不断取出鼠标、键盘、定时器事件并调用你的回调。'
          + '游戏循环不能用 <code>while True</code> + <code>time.sleep</code>，因为那会把事件循环占死，窗口无法重绘、按键也进不来。'
          + '正确做法是 <code>after(120, self.run_game)</code>：告诉 Tkinter「120ms 后叫我一次」，然后立刻把控制权还给事件循环。'
          + '每一帧做三件事：算出新的头、加头去尾、重画；最后再预约下一帧。'
          + '<b>常见坑。</b>第一，方向键的 <code>keysym</code> 是 <code>Up</code> / <code>Down</code> / <code>Left</code> / <code>Right</code>，不是字符。'
          + '第二，不判断反向的话，蛇向右时按左会立刻撞到自己（头直接穿进身体）。'
          + '第三，两个方向键快速连按时，可能在一帧内改两次方向；因为只在下一帧生效，通常没问题，但如果你的实现是「按键就移动」，就会出事。'
          + '第四，关闭窗口后已预约的 after 仍可能触发，回调里要先判断 <code>self.running</code>，否则会报 <code>invalid command name</code>。'
          + '<b>答辩 / 评分看什么。</b>老师会按住方向键快速转向，看蛇是否自交；也会问「为什么不用 while True」。'
          + '你要能说清楚 <code>after</code> 是「预约一次回调」而不是「开一个线程」，以及事件循环为什么不能被阻塞。',
        tests: []
      },
      {
        n: 3,
        title: 'M3 · 食物、增长与计分：两种食物，两种长度',
        tasks: [
          '食物每次出现在空白格子上，不会与蛇身重叠，也不会落在画布外或半格位置',
          '吃到红色苹果时长度 +1、分数 +1，蛇身当场多出一节，尾部不会缩短',
          '吃到金色食物时长度 +2、分数 +3：当场 +1，下一帧再 +1，两帧后长度确实增加了 2',
          '画布左上角实时显示「SCORE 4  LENGTH 7」，吃食物后数字立刻变化',
          '连续吃 5 次食物后，食物仍然不会刷在蛇身上；蛇变长后移动依旧流畅，没有拖影'
        ],
        starter: `import random
import tkinter as tk

CELL = 20
WIDTH = 800
HEIGHT = 800


class SnakeGame(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Snake Game")
        self.geometry(f"{WIDTH}x{HEIGHT}")
        self.resizable(False, False)

        self.canvas = tk.Canvas(self, width=WIDTH, height=HEIGHT, bg="black",
                                highlightthickness=0)
        self.canvas.pack()

        self.snake = [(100, 100), (80, 100), (60, 100)]
        self.snake_direction = "Right"
        self.delay = 120
        self.running = True
        self.score = 0
        self.grow_pending = 0
        self.food_type = "apple"
        self.food = self.create_food()

        self.bind("<KeyPress>", self.change_direction)
        self.focus_set()
        self.draw()
        self.after(self.delay, self.run_game)

    def create_food(self):
        # TODO 1: 随机生成格子坐标，避开 self.snake
        # TODO 2: 随机选择 "apple" 或 "golden" 存进 self.food_type
        return (300, 300)

    def move_snake(self):
        head_x, head_y = self.snake[0]
        if self.snake_direction == "Left":
            head_x -= CELL
        elif self.snake_direction == "Right":
            head_x += CELL
        elif self.snake_direction == "Up":
            head_y -= CELL
        elif self.snake_direction == "Down":
            head_y += CELL

        new_head = (head_x, head_y)

        # TODO 3: 如果 new_head == self.food，加头（不删尾）、加分、重新生成食物
        # TODO 4: 如果 grow_pending > 0，加头不删尾并减一
        # TODO 5: 否则正常「加头去尾」

    def run_game(self):
        if not self.running:
            return
        self.move_snake()
        self.draw()
        self.after(self.delay, self.run_game)

    def draw(self):
        self.canvas.delete("all")
        self.draw_grid()

        fx, fy = self.food
        food_color = "#FFD700" if self.food_type == "golden" else "#FF4040"
        self.canvas.create_oval(fx + 3, fy + 3, fx + CELL - 3, fy + CELL - 3,
                                fill=food_color, outline="")

        for index, (x, y) in enumerate(self.snake):
            color = "#7CFC00" if index == 0 else "#32CD32"
            self.canvas.create_rectangle(x, y, x + CELL, y + CELL,
                                         fill=color, outline="black")

        # TODO 6: 用 create_text 画分数与长度

    def draw_grid(self):
        for x in range(0, WIDTH + 1, CELL):
            self.canvas.create_line(x, 0, x, HEIGHT, fill="#111111")
        for y in range(0, HEIGHT + 1, CELL):
            self.canvas.create_line(0, y, WIDTH, y, fill="#111111")

    def change_direction(self, event):
        opposite = {"Left": "Right", "Right": "Left",
                    "Up": "Down", "Down": "Up"}
        if event.keysym in opposite:
            if event.keysym != opposite[self.snake_direction]:
                self.snake_direction = event.keysym


if __name__ == "__main__":
    SnakeGame().mainloop()`,
        hints: [
          '随机食物要落在格子上：x = random.randint(0, WIDTH // CELL - 1) * CELL，y 同理，不要直接 random.randint(0, WIDTH)。',
          '生成食物要用 while True 反复抽，直到 (x, y) not in self.snake 才返回；否则食物会叠在蛇身上，永远吃不到。',
          '吃苹果就是「加头、不删尾」：self.snake = [new_head] + self.snake；普通移动是「加头、删尾」。',
          '金色食物要长 2 节，但一次只移动一格：当场 +1，再用 self.grow_pending 记下欠的一节，下一帧补上。',
          '分数文字要最后画，否则会被蛇身盖住；create_text 的 anchor="nw" 表示以左上角为锚点。'
        ],
        solution: `import random
import tkinter as tk

CELL = 20
WIDTH = 800
HEIGHT = 800


class SnakeGame(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Snake Game")
        self.geometry(f"{WIDTH}x{HEIGHT}")
        self.resizable(False, False)

        self.canvas = tk.Canvas(self, width=WIDTH, height=HEIGHT, bg="black",
                                highlightthickness=0)
        self.canvas.pack()

        self.snake = [(100, 100), (80, 100), (60, 100)]
        self.snake_direction = "Right"
        self.delay = 120
        self.running = True

        self.score = 0
        self.grow_pending = 0
        self.food_type = "apple"
        self.food = self.create_food()

        self.bind("<KeyPress>", self.change_direction)
        self.focus_set()
        self.draw()
        self.after(self.delay, self.run_game)

    def create_food(self):
        while True:
            x = random.randint(0, WIDTH // CELL - 1) * CELL
            y = random.randint(0, HEIGHT // CELL - 1) * CELL
            if (x, y) not in self.snake:
                self.food_type = random.choice(["apple", "golden"])
                return (x, y)

    def move_snake(self):
        head_x, head_y = self.snake[0]

        if self.snake_direction == "Left":
            head_x -= CELL
        elif self.snake_direction == "Right":
            head_x += CELL
        elif self.snake_direction == "Up":
            head_y -= CELL
        elif self.snake_direction == "Down":
            head_y += CELL

        new_head = (head_x, head_y)

        if new_head == self.food:
            self.snake = [new_head] + self.snake
            if self.food_type == "golden":
                self.score += 3
                self.grow_pending += 1
            else:
                self.score += 1
            self.food = self.create_food()
        elif self.grow_pending > 0:
            self.snake = [new_head] + self.snake
            self.grow_pending -= 1
        else:
            self.snake = [new_head] + self.snake[:-1]

    def run_game(self):
        if not self.running:
            return
        self.move_snake()
        self.draw()
        self.after(self.delay, self.run_game)

    def draw(self):
        self.canvas.delete("all")
        self.draw_grid()

        fx, fy = self.food
        food_color = "#FFD700" if self.food_type == "golden" else "#FF4040"
        self.canvas.create_oval(fx + 3, fy + 3, fx + CELL - 3, fy + CELL - 3,
                                fill=food_color, outline="")

        for index, (x, y) in enumerate(self.snake):
            color = "#7CFC00" if index == 0 else "#32CD32"
            self.canvas.create_rectangle(x, y, x + CELL, y + CELL,
                                         fill=color, outline="black")

        self.canvas.create_text(10, 10, anchor="nw",
                                text=f"SCORE {self.score}   LENGTH {len(self.snake)}",
                                fill="white", font=("Consolas", 14, "bold"))

    def draw_grid(self):
        for x in range(0, WIDTH + 1, CELL):
            self.canvas.create_line(x, 0, x, HEIGHT, fill="#111111")
        for y in range(0, HEIGHT + 1, CELL):
            self.canvas.create_line(0, y, WIDTH, y, fill="#111111")

    def change_direction(self, event):
        opposite = {"Left": "Right", "Right": "Left",
                    "Up": "Down", "Down": "Up"}
        if event.keysym in opposite:
            if event.keysym != opposite[self.snake_direction]:
                self.snake_direction = event.keysym


if __name__ == "__main__":
    SnakeGame().mainloop()`,
        explain: '<b>为什么这样设计。</b>贪吃蛇的「增长」本质是「这一次移动不删尾巴」：普通移动是加头去尾，长度不变；'
          + '吃到食物时只加头、不删尾，长度 +1。金色食物要 +2，但蛇一次只走一格，所以把它拆成「当场 +1 + 欠一节」：'
          + '<code>grow_pending</code> 记下欠账，下一帧优先补上。这样既不会瞬移，也不会让蛇身重叠。'
          + '食物生成用「随机格子 + 排除蛇身」，而不是随机像素，保证永远落在 20px 网格上、永远可被吃到。'
          + '<b>常见坑。</b>直接 <code>random.randint(0, WIDTH)</code> 会生成不在格子上的坐标，看起来食物「浮」在半格；'
          + '不检查 <code>(x, y) not in self.snake</code> 会把食物刷进蛇身，玩家永远吃不到；'
          + '金色食物如果一次加两节，第二帧头会跳两格，看起来像穿模。'
          + '还有分数文字如果先画，会被后画的蛇盖住——绘制顺序就是图层顺序。'
          + '<b>答辩 / 评分看什么。</b>老师会看你吃苹果与金色食物时长度分别 +1 / +2、分数是否对应、食物是否会在蛇身上。'
          + '你要能解释「为什么增长是加头不删尾」「grow_pending 解决了什么问题」，以及食物坐标为什么要乘 CELL。',
        tests: []
      },

      {
        n: 4,
        title: 'M4 · 撞墙、撞自己与最大长度：三种结束条件',
        tasks: [
          '蛇头撞到左右上下边界时立即显示 GAME OVER 与「You hit the wall」，蛇停止移动',
          '蛇头撞到自己身体时显示「You bit yourself」，不再继续移动，也不刷出新的食物',
          '蛇长度达到 8 时显示「Maximum length 8 reached - you win!」，这是课程要求的胜利条件',
          '结束画面出现后按 R 可以重开：蛇回到 3 节、分数归零、食物重新生成、速度恢复 120ms',
          '连续按 R 多次不会出现两条蛇在动（说明旧的 after 循环已被取消，没有重复调度）',
          '游戏结束后按方向键不再改变方向，也不会让画面继续移动'
        ],
        starter: `import random
import tkinter as tk

CELL = 20
WIDTH = 800
HEIGHT = 800
MAX_LENGTH = 8


class SnakeGame(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Snake Game")
        self.geometry(f"{WIDTH}x{HEIGHT}")
        self.resizable(False, False)

        self.canvas = tk.Canvas(self, width=WIDTH, height=HEIGHT, bg="black",
                                highlightthickness=0)
        self.canvas.pack()

        self.snake = [(100, 100), (80, 100), (60, 100)]
        self.snake_direction = "Right"
        self.delay = 120
        self.running = True
        self.after_id = None

        self.score = 0
        self.grow_pending = 0
        self.food_type = "apple"
        self.food = self.create_food()

        self.bind("<KeyPress>", self.change_direction)
        self.focus_set()
        self.draw()
        self.after_id = self.after(self.delay, self.run_game)

    def move_snake(self):
        # ... 与 M3 相同的方向计算
        new_head = (0, 0)

        # TODO 1: 撞墙：x < 0 或 x >= WIDTH 或 y 越界
        # TODO 2: 撞自己：new_head in self.snake[1:]
        # TODO 3: 吃到食物后，检查 len(self.snake) >= MAX_LENGTH
        pass

    def game_over(self, reason):
        # TODO 4: running=False，取消 after_id，解绑方向键
        # TODO 5: 在画布中央显示 GAME OVER、原因、按 R 重开
        # TODO 6: 绑定 R 键到 restart
        pass

    def restart(self, event=None):
        # TODO 7: 重置蛇、方向、分数、食物、running，重新绑定方向键
        # TODO 8: 重新调度 after，并只调度一次
        pass

    def run_game(self):
        self.after_id = None
        if not self.running:
            return
        self.move_snake()
        if not self.running:
            return
        self.draw()
        self.after_id = self.after(self.delay, self.run_game)

    # create_food / draw / draw_grid / change_direction 与 M3 相同


if __name__ == "__main__":
    SnakeGame().mainloop()`,
        hints: [
          '碰撞检查要放在「修改 self.snake」之前：先用 new_head 判断，确认安全再移动，否则蛇会先穿进去再报错。',
          '撞自己的条件用 new_head in self.snake[1:]；这里把尾巴也算进去，和讲义示例一致，简单且不会误放行。',
          '三种结束条件是「撞墙 / 撞自己 / 达到最大长度」，最大长度按课程要求写 8，不要自己改成 50。',
          'game_over 里一定要把已预约的 after 取消：after_cancel(self.after_id)，否则重开后旧循环和新循环会同时跑。',
          '重开时用 unbind("<KeyPress>") 清掉旧的 R 绑定，再 bind 回 change_direction，避免两个回调同时响应。',
          '结束文字直接画在 canvas 上即可；它不会被后续 draw 覆盖，因为 game_over 之后不再调用 draw。'
        ],
        solution: `import random
import tkinter as tk

CELL = 20
WIDTH = 800
HEIGHT = 800
MAX_LENGTH = 8


class SnakeGame(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Snake Game")
        self.geometry(f"{WIDTH}x{HEIGHT}")
        self.resizable(False, False)

        self.canvas = tk.Canvas(self, width=WIDTH, height=HEIGHT, bg="black",
                                highlightthickness=0)
        self.canvas.pack()

        self.snake = [(100, 100), (80, 100), (60, 100)]
        self.snake_direction = "Right"
        self.delay = 120
        self.running = True
        self.after_id = None

        self.score = 0
        self.grow_pending = 0
        self.food_type = "apple"
        self.food = self.create_food()

        self.bind("<KeyPress>", self.change_direction)
        self.focus_set()
        self.draw()
        self.after_id = self.after(self.delay, self.run_game)

    def create_food(self):
        while True:
            x = random.randint(0, WIDTH // CELL - 1) * CELL
            y = random.randint(0, HEIGHT // CELL - 1) * CELL
            if (x, y) not in self.snake:
                self.food_type = random.choice(["apple", "golden"])
                return (x, y)

    def move_snake(self):
        head_x, head_y = self.snake[0]

        if self.snake_direction == "Left":
            head_x -= CELL
        elif self.snake_direction == "Right":
            head_x += CELL
        elif self.snake_direction == "Up":
            head_y -= CELL
        elif self.snake_direction == "Down":
            head_y += CELL

        new_head = (head_x, head_y)

        if new_head[0] < 0 or new_head[0] >= WIDTH or new_head[1] < 0 or new_head[1] >= HEIGHT:
            self.game_over("You hit the wall")
            return
        if new_head in self.snake[1:]:
            self.game_over("You bit yourself")
            return

        if new_head == self.food:
            self.snake = [new_head] + self.snake
            if self.food_type == "golden":
                self.score += 3
                self.grow_pending += 1
            else:
                self.score += 1
            self.food = self.create_food()
        elif self.grow_pending > 0:
            self.snake = [new_head] + self.snake
            self.grow_pending -= 1
        else:
            self.snake = [new_head] + self.snake[:-1]

        if len(self.snake) >= MAX_LENGTH:
            self.game_over("Maximum length reached - you win!")
            return

        self.draw()

    def run_game(self):
        self.after_id = None
        if not self.running:
            return
        self.move_snake()
        if not self.running:
            return
        self.draw()
        self.after_id = self.after(self.delay, self.run_game)

    def game_over(self, reason):
        self.running = False
        if self.after_id is not None:
            self.after_cancel(self.after_id)
            self.after_id = None

        self.draw()
        self.unbind("<KeyPress>")
        self.bind("<KeyPress>", self.restart_on_key)

        self.canvas.create_rectangle(100, 300, WIDTH - 100, 500,
                                     fill="black", outline="#7CFC00", width=2)
        self.canvas.create_text(WIDTH // 2, 350, text="GAME OVER",
                                fill="white", font=("Consolas", 32, "bold"))
        self.canvas.create_text(WIDTH // 2, 405, text=reason,
                                fill="#FFD700", font=("Consolas", 15))
        self.canvas.create_text(WIDTH // 2, 450, text="Press R to restart",
                                fill="#AAAAAA", font=("Consolas", 13))
        self.canvas.create_text(WIDTH // 2, 475,
                                text=f"SCORE {self.score}   LENGTH {len(self.snake)}",
                                fill="#CCCCCC", font=("Consolas", 12))

    def restart_on_key(self, event):
        if event.keysym.lower() == "r":
            self.restart()

    def restart(self, event=None):
        if self.after_id is not None:
            self.after_cancel(self.after_id)
            self.after_id = None

        self.unbind("<KeyPress>")
        self.bind("<KeyPress>", self.change_direction)

        self.snake = [(100, 100), (80, 100), (60, 100)]
        self.snake_direction = "Right"
        self.score = 0
        self.grow_pending = 0
        self.running = True
        self.food = self.create_food()

        self.draw()
        self.after_id = self.after(self.delay, self.run_game)

    def draw(self):
        self.canvas.delete("all")
        self.draw_grid()

        fx, fy = self.food
        food_color = "#FFD700" if self.food_type == "golden" else "#FF4040"
        self.canvas.create_oval(fx + 3, fy + 3, fx + CELL - 3, fy + CELL - 3,
                                fill=food_color, outline="")

        for index, (x, y) in enumerate(self.snake):
            color = "#7CFC00" if index == 0 else "#32CD32"
            self.canvas.create_rectangle(x, y, x + CELL, y + CELL,
                                         fill=color, outline="black")

        self.canvas.create_text(10, 10, anchor="nw",
                                text=f"SCORE {self.score}   LENGTH {len(self.snake)} / {MAX_LENGTH}",
                                fill="white", font=("Consolas", 14, "bold"))

    def draw_grid(self):
        for x in range(0, WIDTH + 1, CELL):
            self.canvas.create_line(x, 0, x, HEIGHT, fill="#111111")
        for y in range(0, HEIGHT + 1, CELL):
            self.canvas.create_line(0, y, WIDTH, y, fill="#111111")

    def change_direction(self, event):
        opposite = {"Left": "Right", "Right": "Left",
                    "Up": "Down", "Down": "Up"}
        if event.keysym in opposite:
            if event.keysym != opposite[self.snake_direction]:
                self.snake_direction = event.keysym


if __name__ == "__main__":
    SnakeGame().mainloop()`,
        explain: '<b>为什么这样设计。</b>三种结束条件分别对应三个边界：撞墙检查新头是否越出 0..WIDTH-1 / 0..HEIGHT-1；'
          + '撞自己检查 <code>new_head in self.snake[1:]</code>；最大长度检查 <code>len(self.snake) &gt;= 8</code>。'
          + '检查必须放在修改蛇身之前，否则蛇头已经穿进去，再报错就晚了。'
          + '课程讲义明确写了「蛇达到最大长度（8 units）时游戏结束」，所以这里把 8 当成胜利条件，而不是继续无限增长。'
          + '<b>常见坑。</b>最大的坑是重开后出现两条蛇：旧的 <code>after</code> 已经预约，重开时又预约了一个，两个循环同时移动同一份蛇身。'
          + '解决办法是保存 <code>after_id</code>，在 <code>game_over</code> 和 <code>restart</code> 里都 <code>after_cancel</code>。'
          + '第二个坑是只把 <code>running</code> 设成 False 却没有解绑按键，结束后按方向键仍然能改方向，画面看起来「怪怪的」。'
          + '第三个坑是撞自己时把尾巴算不算：讲义示例用 <code>snake[1:]</code>，把尾巴也算进去；严格来说不进食时尾巴会移开，但简单实现这样写更安全。'
          + '<b>答辩 / 评分看什么。</b>老师会分别演示撞墙、撞自己、达到长度 8 三种结束，再按 R 重开。'
          + '你要能解释「为什么重开要取消 after」「为什么碰撞检查在移动之前」「最大长度 8 是哪里来的」。',
        tests: []
      },
      {
        n: 5,
        title: 'M5 · 开始菜单、障碍、变速与暂停：做成可演示的完整游戏',
        tasks: [
          '启动后先看到开始菜单：标题 SNAKE、操作说明、START 按钮；点 START 才进入游戏，画布被清空并重新计时',
          'HUD 显示 SCORE / BEST / LENGTH / SPEED，吃食物后分数与长度实时更新，历史最高分在重开后仍然保留',
          '地图上随机出现 16 个灰色障碍块，障碍不会压在蛇的初始三节上，也不会堵住出生点右侧的通道',
          '每吃一个食物速度提升一档：分数越高，蛇移动越快，但不会快到无法操作（延迟下限 60ms）',
          '按空格可以暂停/继续，暂停时画面显示 PAUSED、蛇不移动，再按空格继续',
          '撞墙、撞障碍、撞自己或达到长度 8 时显示对应原因与最终分数，按空格可以立刻重开一局',
          '连续重开 3 次，每次都只有一条蛇在动，HUD 计数不会翻倍（说明旧的 after 已取消）'
        ],
        starter: `import random
import tkinter as tk

CELL = 20
WIDTH = 800
HEIGHT = 800
MAX_LENGTH = 8
START_SNAKE = [(100, 100), (80, 100), (60, 100)]


class SnakeGame(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Snake Game")
        self.geometry(f"{WIDTH}x{HEIGHT + 70}")
        self.resizable(False, False)
        self.configure(bg="#111111")

        self.score = 0
        self.best_score = 0
        self.delay = 120
        self.running = False
        self.paused = False
        self.after_id = None
        self.obstacles = set()

        self.build_hud()
        self.canvas = tk.Canvas(self, width=WIDTH, height=HEIGHT, bg="black",
                                highlightthickness=0)
        self.canvas.pack()
        self.build_menu()
        self.bind("<KeyPress>", self.on_key)

    def build_hud(self):
        # TODO 1: 用 Frame + StringVar + Label 做 SCORE / BEST / LENGTH / SPEED
        pass

    def build_menu(self):
        # TODO 2: 用 place 覆盖画布，放标题、说明、START 按钮
        pass

    def start_game(self):
        # TODO 3: 销毁菜单，重置蛇/分数/食物/障碍，running=True
        # TODO 4: update_hud、draw、schedule_next_tick
        pass

    def create_obstacles(self, count):
        # TODO 5: 随机格子，避开蛇、出生通道，返回 set
        return set()

    def create_food(self):
        # TODO 6: 在「不在蛇、不在障碍」的空格里随机选，设置 food_type
        return (300, 300)

    def update_speed(self):
        # TODO 7: 根据分数计算 delay，设置下限
        pass

    def on_key(self, event):
        # TODO 8: 未运行时空格重开；运行时空格暂停；方向键转向且禁止 180°
        pass

    def run_game(self):
        # TODO 9: 未暂停则 move_snake + draw，然后 schedule_next_tick
        pass

    def game_over(self, reason):
        # TODO 10: 停循环、更新最高分、画结束面板
        pass

    # create_food / draw / draw_grid 等与 M4 相同


if __name__ == "__main__":
    SnakeGame().mainloop()`,
        hints: [
          '开始菜单用 Frame + place 覆盖在画布上最简单：place(x=0, y=70, width=WIDTH, height=HEIGHT)，点 START 后 destroy 菜单即可。',
          '障碍用 set 存格子坐标最方便：new_head in self.obstacles 就是 O(1) 判断；生成时排除蛇身与出生点右侧的通道。',
          '食物生成最稳的做法是先把所有空格收集成列表，再 random.choice；这样蛇变长、障碍变多时也不会卡在 while 循环里。',
          '速度不要每吃一个就减 20ms，太陡；用 delay = max(60, 130 - score * 3)，既明显又不会失控。',
          '暂停不需要停 after，只需要在 run_game 里判断 self.paused：暂停时跳过 move_snake，但仍然预约下一帧，这样按空格能恢复。',
          '重开前必须 after_cancel(self.after_id) 并置 None，否则旧的 after 会和新的 after 同时跑，蛇会「加速」到无法控制。'
        ],
        solution: `import random
import tkinter as tk

CELL = 20
WIDTH = 800
HEIGHT = 800
MAX_LENGTH = 8
START_SNAKE = [(100, 100), (80, 100), (60, 100)]


class SnakeGame(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Snake Game")
        self.geometry(f"{WIDTH}x{HEIGHT + 70}")
        self.resizable(False, False)
        self.configure(bg="#111111")

        self.score = 0
        self.best_score = 0
        self.delay = 130
        self.running = False
        self.paused = False
        self.after_id = None

        self.snake = list(START_SNAKE)
        self.snake_direction = "Right"
        self.grow_pending = 0
        self.obstacles = set()
        self.food = (0, 0)
        self.food_type = "apple"

        self.build_hud()
        self.canvas = tk.Canvas(self, width=WIDTH, height=HEIGHT, bg="black",
                                highlightthickness=0)
        self.canvas.pack()
        self.build_menu()
        self.bind("<KeyPress>", self.on_key)
        self.update_hud()

    def build_hud(self):
        self.hud = tk.Frame(self, bg="#111111", height=70)
        self.hud.pack(fill="x")

        self.score_var = tk.StringVar(value="SCORE 0")
        self.best_var = tk.StringVar(value="BEST 0")
        self.length_var = tk.StringVar(value="LENGTH 3 / 8")
        self.status_var = tk.StringVar(value="READY")

        tk.Label(self.hud, textvariable=self.score_var, fg="#7CFC00", bg="#111111",
                 font=("Consolas", 16, "bold")).pack(side="left", padx=12, pady=18)
        tk.Label(self.hud, textvariable=self.best_var, fg="#FFD700", bg="#111111",
                 font=("Consolas", 12)).pack(side="left", padx=8, pady=18)
        tk.Label(self.hud, textvariable=self.length_var, fg="#00CED1", bg="#111111",
                 font=("Consolas", 12)).pack(side="left", padx=8, pady=18)
        tk.Label(self.hud, textvariable=self.status_var, fg="#AAAAAA", bg="#111111",
                 font=("Consolas", 12)).pack(side="right", padx=12, pady=18)

    def build_menu(self):
        self.menu = tk.Frame(self, bg="#111111")
        self.menu.place(x=0, y=70, width=WIDTH, height=HEIGHT)

        tk.Label(self.menu, text="SNAKE", fg="#7CFC00", bg="#111111",
                 font=("Consolas", 52, "bold")).pack(pady=(120, 6))
        tk.Label(self.menu, text="A Tkinter Canvas Game", fg="#666666", bg="#111111",
                 font=("Consolas", 14)).pack(pady=(0, 30))
        tk.Label(self.menu,
                 text="Arrow keys to move\\n"
                      "SPACE to pause / play again\\n"
                      "Apple +1 length, golden food +2 length\\n"
                      "Avoid walls, yourself and gray obstacles\\n"
                      "Reach length 8 to win",
                 fg="#CCCCCC", bg="#111111", font=("Consolas", 13),
                 justify="center").pack(pady=10)
        tk.Button(self.menu, text="START", command=self.start_game,
                  font=("Consolas", 16, "bold"), width=14,
                  bg="#7CFC00", fg="black", activebackground="#5FBF00"
                  ).pack(pady=32)

    def start_game(self):
        if self.after_id is not None:
            self.after_cancel(self.after_id)
            self.after_id = None
        if self.menu is not None:
            self.menu.destroy()
            self.menu = None

        self.snake = list(START_SNAKE)
        self.snake_direction = "Right"
        self.grow_pending = 0
        self.score = 0
        self.delay = 130
        self.paused = False
        self.running = True
        self.obstacles = self.create_obstacles(16)
        self.food = self.create_food()

        self.focus_set()
        self.update_hud()
        self.draw()
        self.schedule_next_tick()

    def create_obstacles(self, count):
        obstacles = set()
        forbidden = set(self.snake)
        for x in range(0, 340, CELL):
            forbidden.add((x, 100))

        attempts = 0
        while len(obstacles) < count and attempts < 2000:
            attempts += 1
            x = random.randrange(0, WIDTH, CELL)
            y = random.randrange(0, HEIGHT, CELL)
            if (x, y) in forbidden or (x, y) in obstacles:
                continue
            if x < 400 and abs(y - 100) < CELL * 2:
                continue
            obstacles.add((x, y))
        return obstacles

    def create_food(self):
        free = []
        occupied = set(self.snake) | self.obstacles
        for x in range(0, WIDTH, CELL):
            for y in range(0, HEIGHT, CELL):
                if (x, y) not in occupied:
                    free.append((x, y))

        if not free:
            return (-CELL, -CELL)

        self.food_type = random.choice(["apple", "golden"])
        return random.choice(free)

    def update_speed(self):
        self.delay = max(60, 130 - self.score * 3)

    def update_hud(self):
        self.score_var.set(f"SCORE {self.score}")
        self.best_var.set(f"BEST {self.best_score}")
        self.length_var.set(f"LENGTH {len(self.snake)} / {MAX_LENGTH}")

        if self.paused:
            self.status_var.set("PAUSED")
        elif self.running:
            level = max(1, (130 - self.delay) // 10 + 1)
            self.status_var.set(f"SPEED {level}")
        else:
            self.status_var.set("GAME OVER")

    def on_key(self, event):
        key = event.keysym

        if not self.running:
            if key == "space":
                self.start_game()
            return

        if key == "space":
            self.paused = not self.paused
            self.update_hud()
            self.draw()
            return

        opposite = {"Left": "Right", "Right": "Left",
                    "Up": "Down", "Down": "Up"}
        if key in opposite and key != opposite[self.snake_direction]:
            self.snake_direction = key

    def schedule_next_tick(self):
        if self.after_id is not None:
            self.after_cancel(self.after_id)
        self.after_id = self.after(self.delay, self.run_game)

    def run_game(self):
        self.after_id = None
        if not self.running:
            return

        if not self.paused:
            self.move_snake()
            if not self.running:
                return
            self.draw()

        self.schedule_next_tick()

    def move_snake(self):
        head_x, head_y = self.snake[0]

        if self.snake_direction == "Left":
            head_x -= CELL
        elif self.snake_direction == "Right":
            head_x += CELL
        elif self.snake_direction == "Up":
            head_y -= CELL
        elif self.snake_direction == "Down":
            head_y += CELL

        new_head = (head_x, head_y)

        if new_head[0] < 0 or new_head[0] >= WIDTH or new_head[1] < 0 or new_head[1] >= HEIGHT:
            self.game_over("You hit the wall")
            return
        if new_head in self.obstacles:
            self.game_over("You hit an obstacle")
            return
        if new_head in self.snake[1:]:
            self.game_over("You bit yourself")
            return

        if new_head == self.food:
            self.snake = [new_head] + self.snake
            if self.food_type == "golden":
                self.score += 3
                self.grow_pending += 1
            else:
                self.score += 1
            self.food = self.create_food()
            self.update_speed()
        elif self.grow_pending > 0:
            self.snake = [new_head] + self.snake
            self.grow_pending -= 1
        else:
            self.snake = [new_head] + self.snake[:-1]

        if len(self.snake) >= MAX_LENGTH:
            self.game_over("Maximum length 8 reached - you win!")
            return

        self.update_hud()

    def game_over(self, reason):
        self.running = False
        if self.after_id is not None:
            self.after_cancel(self.after_id)
            self.after_id = None

        self.best_score = max(self.best_score, self.score)
        self.update_hud()
        self.draw()

        self.canvas.create_rectangle(80, 270, WIDTH - 80, 520,
                                     fill="black", outline="#7CFC00", width=2)
        self.canvas.create_text(WIDTH // 2, 320, text="GAME OVER",
                                fill="white", font=("Consolas", 34, "bold"))
        self.canvas.create_text(WIDTH // 2, 375, text=reason,
                                fill="#FFD700", font=("Consolas", 15))
        self.canvas.create_text(WIDTH // 2, 420,
                                text=f"SCORE {self.score}   BEST {self.best_score}",
                                fill="#CCCCCC", font=("Consolas", 14))
        self.canvas.create_text(WIDTH // 2, 465,
                                text="Press SPACE to play again",
                                fill="#AAAAAA", font=("Consolas", 13))

    def draw(self):
        self.canvas.delete("all")
        self.draw_grid()

        for (x, y) in self.obstacles:
            self.canvas.create_rectangle(x, y, x + CELL, y + CELL,
                                         fill="#4A4A4A", outline="#666666")

        fx, fy = self.food
        food_color = "#FFD700" if self.food_type == "golden" else "#FF4040"
        self.canvas.create_oval(fx + 3, fy + 3, fx + CELL - 3, fy + CELL - 3,
                                fill=food_color, outline="")

        for index, (x, y) in enumerate(self.snake):
            color = "#7CFC00" if index == 0 else "#32CD32"
            self.canvas.create_rectangle(x, y, x + CELL, y + CELL,
                                         fill=color, outline="black")

        if self.paused:
            self.canvas.create_text(WIDTH // 2, HEIGHT // 2, text="PAUSED",
                                    fill="white", font=("Consolas", 38, "bold"))

    def draw_grid(self):
        for x in range(0, WIDTH + 1, CELL):
            self.canvas.create_line(x, 0, x, HEIGHT, fill="#111111")
        for y in range(0, HEIGHT + 1, CELL):
            self.canvas.create_line(0, y, WIDTH, y, fill="#111111")


if __name__ == "__main__":
    SnakeGame().mainloop()`,
        explain: '<b>为什么这样设计。</b>这一关把前四关拼成一个「打开就能玩」的游戏：开始菜单负责第一次交互，HUD 负责状态反馈，'
          + '障碍与变速负责难度曲线，暂停负责可演示性。菜单用 <code>Frame.place</code> 盖住画布，比开第二个窗口简单，也不用管理窗口层级；'
          + '点 START 后 <code>destroy()</code> 菜单、重置全部状态、再启动 after 循环。'
          + '障碍用格子坐标的 <code>set</code> 保存，碰撞判断是 O(1)；生成时避开蛇身与出生点右侧的通道，避免一开局就必死。'
          + '速度用 <code>delay = max(60, 130 - score * 3)</code> 做线性提升，既让分数有反馈，又不会快到不可玩。'
          + '<b>常见坑。</b>第一，重开时忘记 <code>after_cancel</code>，旧循环和新循环同时跑，蛇会突然加速甚至一次走两格。'
          + '第二，暂停只把 <code>running</code> 设成 False，结果按空格无法恢复；正确做法是保留 after 循环、只跳过 <code>move_snake</code>。'
          + '第三，障碍生成不排除食物与蛇，会出现「食物被障碍压住」或「开局撞障碍」。'
          + '第四，最高分只存在内存里，关掉程序就丢；如果要做持久化，用 json 文件并加 try/except，避免文件损坏导致游戏起不来。'
          + '<b>答辩 / 评分看什么。</b>这一关就是最终演示：从菜单开始，吃两种食物、展示变速、暂停、撞障碍、获胜、按空格重开。'
          + '老师会问「障碍怎么保证不堵死出生点」「速度公式为什么有下限」「重开为什么不会双循环」——三题都能在代码里指出对应行，20% 的项目分就稳了。',
        tests: []
      }
    ],
    extension: [
      '多关卡：每关预设不同的障碍布局与目标分数，过关后进入下一关，把障碍从随机改成关卡数据',
      '持久化最高分：用 json 读写本地存档，读取失败时回退到 0，并给玩家一个「存档损坏」的提示',
      '音效与动画：吃食物时用 winsound 或 Canvas 缩放做一个小反馈，胜利时让蛇身闪两下',
      '双人模式或鼠标控制：WASD 控制第二条蛇，或让蛇跟随鼠标方向，练习事件绑定与状态机'
    ],
    solutionNote: '脚本只依赖 Python 标准库 tkinter 与 random，Python 3.8+ 直接运行 python snake.py 即可。'
      + '课程要求「蛇达到最大长度 8 时结束」，所以 MAX_LENGTH 固定为 8；如果把它改成更大的值，记得同步修改 HUD 的显示与胜利文案。'
      + '演示时按「菜单 → 吃苹果 → 吃金色 → 暂停 → 撞障碍 → 重开」的顺序操作，能在一分钟内覆盖开始菜单、两种食物、变速、暂停、碰撞与重开六个评分点。'
  }
]);

