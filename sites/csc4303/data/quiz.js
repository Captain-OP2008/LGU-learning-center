/* =====================================================================
 * quiz.js · CSC4303 分章题库（PACK.items）
 * 结构：{ items:[{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options?, answer?, accept?, explain }] }
 * 题型：mcq / tf / fill / multi
 * 覆盖：ch00–ch07，每章 7 题，共 56 题
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '本站把 ch01–ch03 称为「不能跳的地基」，最主要的理由是什么？',
        options: [
          { text: '这三章学分权重最高，考试出题最多' },
          { text: '后面 ch04–ch07 的讨论都默认你已经理解「包怎么逐层走、字节流怎么变可靠、程序怎么把协议用起来」', correct: true },
          { text: '它们讲的工具在后面的作业里不会再用到' },
          { text: '只有这三章涉及计算题，其余章节全是背诵' }
        ],
        explain: 'ch01 给分层与性能的语言，ch02 把「不可靠链路 → 可靠字节流」的机制讲透，ch03 把协议变成可运行的程序。ch04 的路由、ch06 的 RPC、ch07 的集合通信都要回头引用这三章的概念；跳过它们，后面只能死记结论。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'tf', difficulty: 1,
        tags: ['course'],
        stem: '按课程安排，CSC4303 的成绩由编程作业 60% 与期末 40% 构成。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '课程介绍页写明 Programming assignments 占 60%、Final exam 占 40%。这意味着「只看书不写代码」拿不到高分：作业里的 socket 服务器、测量脚本与分布式小系统，才是把章节知识变成能力的地方。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'multi', difficulty: 2,
        tags: ['tool'],
        stem: '想确认一次网页请求在各层的真实行为，下面哪些命令最直接？（多选）',
        options: [
          { text: '<code>dig example.com</code> 看 DNS 解析结果与耗时', correct: true },
          { text: '<code>curl -v https://example.com</code> 看 TCP、TLS 与 HTTP 的往返', correct: true },
          { text: '<code>traceroute example.com</code> 看包经过哪些路由器', correct: true },
          { text: '<code>ss -tan</code> 看本机连接的状态与收发队列', correct: true },
          { text: '<code>top</code> 看 CPU 占用，就能推断出丢包发生在哪一跳' }
        ],
        explain: 'dig 对应应用层的 DNS，curl -v 把建立连接、握手、请求响应逐段打印，traceroute 用逐跳 TTL 暴露网络层路径，ss 展示传输层连接状态与队列。top 只能说明本机进程忙不忙，推不出网络哪一跳丢了包。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '在浏览器地址栏输入 <code>https://example.com</code> 并回车，本机缓存全为空。下面哪一步最先发生？',
        options: [
          { text: '与服务器完成 TCP 三次握手' },
          { text: '把域名解析成 IP 地址', correct: true },
          { text: '发送 HTTP GET 请求' },
          { text: '进行 TLS 握手协商密钥' }
        ],
        explain: '要先知道对端 IP 才能建连接，所以顺序是 DNS 解析 → TCP 握手 → TLS 握手 → HTTP 请求 → 响应渲染。每一步失败的表现不同：DNS 失败报「找不到服务器」，TCP 失败多是超时，TLS 失败会提示证书错误——排错时先看卡在哪一步。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '用一句话概括这门课的核心问题，下面哪一句最准确？',
        options: [
          { text: '把 OSI 七层模型的每一层字段背下来' },
          { text: '在不可靠、会拥塞、规模巨大的链路上，构造可靠且可扩展的通信', correct: true },
          { text: '学会配置路由器和交换机' },
          { text: '用 Python 写一个网页服务器' }
        ],
        explain: '协议字段只是手段。真正的问题是：物理链路会丢包、会出错、带宽有限，而应用要求「字节不丢不乱、延迟可预期、上万台机器能一起工作」。每一章的机制都是对这个矛盾的某种回答，背字段解释不了「为什么这样设计」。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'fill', difficulty: 1,
        tags: ['course'],
        stem: 'CSC4303 的官方课程名是 ______ Programming（填一个英文单词，注意大小写不敏感）。',
        answer: 'Network',
        accept: ['network', 'Network', 'NETWORK'],
        explain: '课程全名是 Network Programming（网络编程）。名字里的 Programming 是重点：课程目标包含 network programming、distributed storage、collective communication，都要落到能跑的代码上，而不只是协议分析。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['method'],
        stem: '按本站建议，第一次系统学这门课时最合理的推进方式是哪一种？',
        options: [
          { text: '直接从 ch07 开始，因为分布式训练最热门' },
          { text: '先读 ch00 建立地图，再按 ch01→ch02→ch03 打地基，之后每章配合项目回看', correct: true },
          { text: '八章并行读，每天每章各读一节' },
          { text: '只做模拟卷，遇到不会的再翻章节' }
        ],
        explain: 'ch00 给依赖关系与考核节奏，ch01–ch03 是后续所有章节的共同语言。ch04 之后内容跨度大，适合「读一章 + 做一个项目 milestone + 回看前一章」的循环；并行推进会让每章都停在名词层面。'
      },

      /* ---------------- ch04 网络层 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '一个 4000 字节的 IPv4 数据报（含 20 字节头）经过 MTU=1500 的链路，被切成三片。第三片的 fragment offset 字段值是多少？',
        options: [
          { text: '0' },
          { text: '185' },
          { text: '370', correct: true },
          { text: '2960' }
        ],
        explain: '前两片各承载 1480 字节数据（1500 − 20 头），第三片数据从原始数据的第 2960 字节开始。offset 以 8 字节为单位，2960 ÷ 8 = 370。注意 2960 是字节偏移，直接填进 offset 字段会差 8 倍，这是最常见的失分点。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '网段 <code>172.16.40.0/22</code> 的掩码与可用主机数分别是多少？',
        options: [
          { text: '255.255.254.0，510 台' },
          { text: '255.255.252.0，1022 台', correct: true },
          { text: '255.255.252.0，1024 台' },
          { text: '255.255.240.0，4094 台' }
        ],
        explain: '/22 表示前 22 位是网络位，第三段借了 6 位，掩码第三段为 252。块大小 = 2<sup>10</sup> = 1024，作用在第三段（步长 4），范围是 172.16.40.0 – 172.16.43.255，扣掉网络地址与广播地址后可用 1022 台。1024 是块大小，不是可用数。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '转发表中多条路由都能匹配同一个目的地址时，路由器取「最先查到」的那条；因此表项顺序会影响转发结果。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'IPv4 转发规则是<b>最长前缀匹配</b>：在所有匹配项中选前缀最长（最具体）的那条，与表项顺序无关。默认路由前缀长度为 0，是所有匹配项里最短的，只在没有更具体路由时才生效。硬件用前缀树或 TCAM 并行比较，正是为了摆脱顺序依赖。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '家庭宽带普遍使用 NAT。下面哪一项是 NAT 带来的直接后果？',
        options: [
          { text: '内网主机无法访问公网服务器' },
          { text: '外网主机无法主动发起连接到内网主机，P2P 需要打洞或中继', correct: true },
          { text: 'IP 包在网络层不再需要校验和' },
          { text: '内网主机之间的通信必须经过公网' }
        ],
        explain: 'NAT 表项只在内网主机先发包时建立，外网来的包若匹配不到表项就无处可转。所以外部主动连接（P2P、VoIP、远程桌面）会失败，需要 STUN 打洞或 TURN 中继。NAT 不影响内网互访，也不取消校验和（改写地址端口后还要重算）。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '「一条链路断开后，两个路由器互相通告，代价每次加一，缓慢爬到无穷大」描述的是哪种现象？它属于哪类协议？',
        options: [
          { text: '路由震荡，属于链路状态协议' },
          { text: '计数到无穷，属于距离向量协议', correct: true },
          { text: 'PMTU 黑洞，属于 IPv6' },
          { text: '队头阻塞，属于传输层' }
        ],
        explain: '距离向量协议只交换「到各处的代价」，节点无法判断邻居报的路径是否经过自己，于是断链后会互相抬高代价，形成计数到无穷。水平分割与毒性逆转能缓解两节点互骗，RIP 再用最大跳数 15 硬性截断。链路状态协议每人有完整拓扑，不会出现这种现象。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '关于 OSPF 与 BGP，下列哪些说法正确？（多选）',
        options: [
          { text: 'OSPF 是链路状态协议，域内每个路由器拥有本区域的完整拓扑', correct: true },
          { text: 'BGP 用 AS-PATH 记录经过的自治系统，看到自己的 AS 就判定成环并丢弃', correct: true },
          { text: 'BGP 一定选择跳数最少的路径，因此和 OSPF 的度量等价' },
          { text: 'BGP 运行在 TCP 179 端口上，依赖可靠传输交换路由', correct: true },
          { text: 'OSPF 用于自治系统之间，BGP 用于自治系统内部' }
        ],
        explain: 'OSPF 靠 LSA 泛洪建拓扑、跑 Dijkstra；BGP 用 AS-PATH 防环、跑在 TCP 179 上。BGP 的选路看策略（local pref、AS-PATH 长度、商业关系），不是单纯跳数，所以「绕远」很常见。两者的作用域正好相反：OSPF 域内，BGP 域间。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-8', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: 'IPv6 的固定首部长度是多少字节？（只填阿拉伯数字）',
        answer: '40',
        explain: 'IPv6 首部固定 40 字节，去掉了校验和与分片字段，可选项放进扩展头。字段少了、长度固定，路由器转发流水线更短；分片只能由源端做，路径上超 MTU 时回 ICMPv6「包太大」让源端调小。'
      }
,

      /* ---------------- ch01 分层与性能 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '一条路径的链路 MTU 为 1500 字节，IPv4 与 TCP 均不带选项。若改用 IPv6（基本头 40 字节，TCP 头仍 20 字节），MSS 应变为多少？',
        options: [
          { text: '1440 字节', correct: true },
          { text: '1460 字节' },
          { text: '1480 字节' },
          { text: '1420 字节' }
        ],
        explain: 'MSS = MTU − IP 头 − TCP 头。IPv6 基本头 40 字节，所以 1500 − 40 − 20 = 1440。1460 是 IPv4（20 字节头）的算法；1480 漏减了 TCP 头；1420 把 IPv6 头当成了 60 字节。MTU 约束整个 IP 包，MSS 只约束 TCP 载荷，两个数字不能混用。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '一条 1 Gbps、RTT 20 ms 的路径，接收窗口 64 KB（65536 字节），忽略拥塞与丢包。仅按窗口限制，单条 TCP 连接的吞吐上限约为多少？',
        options: [
          { text: '约 26 Mbps', correct: true },
          { text: '约 100 Mbps' },
          { text: '约 512 Mbps' },
          { text: '1 Gbps（链路速率）' }
        ],
        explain: '吞吐上限 = 窗口 / RTT = 65536 B ÷ 0.02 s ≈ 3.3 MB/s ≈ 26 Mbps，只占 1 Gbps 的 2.6%。要把链路跑满，窗口至少要等于 BDP = 1 Gbps × 20 ms = 20 Mbit = 2.5 MB，这正是长肥管道要开窗口缩放的原因。选 1 Gbps 是混淆了链路速率与端到端吞吐。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-6', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['calc'],
        stem: '一条路径依次经过 100 Mbps、1 Gbps、10 Gbps、500 Mbps 四段串行链路，无其它流量。端到端稳态吞吐约为多少？',
        options: [
          { text: '100 Mbps', correct: true },
          { text: '500 Mbps' },
          { text: '1 Gbps' },
          { text: '10 Gbps' }
        ],
        explain: '串行路径的稳态吞吐由瓶颈链路决定，取各段速率的最小值，即 100 Mbps。500 Mbps 只是较慢的一段，并非最小；1 Gbps 与 10 Gbps 反而有富余。这条结论只对单流、串行、稳态成立，多流共享时要按流量分配算。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '在任何负载下，分组交换的端到端时延都低于电路交换。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '轻载时分组交换确实不用建电路、时延更低，但它的时延随利用率上升而增长：输出队列接近满时排队时延按 1/(1−ρ) 发散，还会丢包。电路交换预留了固定带宽，通话期间时延稳定、不受他人影响。所以分组交换赢在统计复用带来的容量与成本，而不是「时延永远更低」。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'fill', difficulty: 1,
        tags: ['calc'],
        stem: '一段 2000 km 的光纤，光在其中的传播速度取 2×10<sup>8</sup> m/s。单程传播时延是多少毫秒？（只填数字）',
        answer: '10',
        explain: '传播时延 = 距离 / 传播速度 = 2×10<sup>6</sup> m ÷ 2×10<sup>8</sup> m/s = 0.01 s = 10 ms，往返即 20 ms。这个值只由距离与介质决定，与链路是 1 Gbps 还是 100 Gbps 无关；加大带宽不会缩短它，只能靠把服务器搬近（CDN）来压缩。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下列哪些属于分层设计带来的代价？（多选）',
        options: [
          { text: '每层都要加自己的头部，小包场景下开销占比很高', correct: true },
          { text: '跨层信息不可见，例如 TCP 看不到无线误码，只能把丢包当拥塞', correct: true },
          { text: '必须严格实现 OSI 七层，否则无法互通' },
          { text: '功能重复，例如以太网 FCS、IP 头校验与 TCP 校验和并存', correct: true },
          { text: '更换下层实现时，上层应用必须重写' }
        ],
        explain: '第一、二、四项是真实代价：58 字节头部对 40 字节语音包意味着 145% 开销；TCP 看不到丢包原因，会把无线误码误判为拥塞而盲目降窗；各层都做校验是「不信任下层」的一致代价。第三项错在把教学模型当实现要求——现实中广泛使用的是 TCP/IP 五层，表示层与会话层没有独立头部。第五项恰好说反了：分层的价值就在于换掉以太网改用 Wi-Fi 时上层不必改。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'TCP 收到 SYN 后回一个 SYN-ACK，这一行为属于协议三要素中的哪一项？',
        options: [
          { text: '语义（semantics）', correct: true },
          { text: '语法（syntax）' },
          { text: '时序（timing）' },
          { text: '封装（encapsulation）' }
        ],
        explain: '语义规定字段含义与应当做出的应答：SYN=1 表示请求建连，收到就必须回 SYN-ACK。语法管字段顺序与长度（源端口在第 1–2 字节），时序管先后与超时（1 秒没收到 SYN-ACK 就重传），封装是相邻两层之间的加头剥头，不属于三要素。把「回什么」与「什么时候回」分开，是这类题的常见考点。'
      }
,

      /* ---------------- ch02 传输层 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '一条 1 Gbps 链路，RTT 为 20 ms，每个停等分组长 1500 B（含首部），忽略 ACK 的传输时间。采用停等协议时，发送方的最大平均吞吐约为多少？',
        options: [
          { text: '600 kbps', correct: true },
          { text: '6 Mbps' },
          { text: '60 Mbps' },
          { text: '1 Gbps' }
        ],
        explain: '停等每个 RTT 只能发送一个分组，吞吐 = 1500×8 bit ÷ 0.02 s = 600 kbps，仅为链路速率的 0.06%。要提高利用率必须让多个分组同时在途，也就是流水线化；这正是滑动窗口与选择重传存在的理由。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-6', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '接收方通告零窗口后，只要发送方还有数据，就可以按原速率继续发送，因为窗口字段只是建议值。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'rwnd 是硬限制，通告 0 后发送方必须停止发送常规数据，并启动 persist 定时器周期性发送零窗口探测，直到接收方通告非零窗口。若把窗口更新包丢了又不再探测，双方就会互相等待，形成死锁。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: '某 TCP 连接在 cwnd = 16 MSS 时发生超时，ssthresh 被更新为 8 MSS，连接随后进入慢启动。若之后 3 个 RTT 都没有再丢包，cwnd 约为多少？',
        options: [
          { text: '8 MSS', correct: true },
          { text: '11 MSS' },
          { text: '16 MSS' },
          { text: '4 MSS' }
        ],
        explain: '超时后 cwnd 置 1 并慢启动，每个 RTT 翻倍：1→2→4→8，3 个 RTT 后为 8 MSS。若是 3 个重复 ACK 触发的快速恢复，cwnd 才会是 ssthresh + 3 = 11 MSS；这就是「超时」比「三个重复 ACK」更狠的地方。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-1', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '关于 TCP 的复用与解复用，下列说法正确的有：（多选）',
        options: [
          { text: '同一台服务器可以在 443 端口上同时服务多条连接，因为各连接的四元组不同', correct: true },
          { text: '目的 IP 和目的端口相同、源 IP 和源端口不同的两个报文一定属于同一条连接' },
          { text: '端口号只有 16 位，客户端临时端口数量有限，大量短连接可能耗尽端口', correct: true },
          { text: '监听 socket 每接受一条连接，就会在内核中占用一个新的本地端口' }
        ],
        explain: 'TCP 用源 IP、源端口、目的 IP、目的端口四元组解复用，服务器靠不同的源 IP/端口区分连接，监听端口始终是 443。端口 16 位，临时端口约 2.8 万个，短连接频繁 TIME_WAIT 时确实可能耗尽。accept 出来的新连接复用同一个本地端口，不会另占端口。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: 'UDP 首部固定为多少字节？（只填数字）',
        answer: '8',
        explain: 'UDP 首部只有源端口、目的端口、长度、校验和四个字段，每个 2 字节，共 8 字节。它不提供序号、确认和重传，因此简单、开销小，但可靠性要由应用自己补，DNS 与实时音视频都建立在这个取舍上。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-8', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: 'BBR 通过估计瓶颈带宽和最小 RTT 来调整发送速率，而不是把丢包当作唯一的拥塞信号。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'BBR 属于基于模型的拥塞控制，维护瓶颈带宽与最小 RTT 的估计并据此计算 pacing rate；Reno/CUBIC 则主要以丢包作为拥塞信号。在有随机丢包或深缓冲的链路上，这个差别会直接表现为吞吐与排队时延的不同。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '客户端初始序号为 1001，服务器初始序号为 5001。三次握手过程中，客户端发出的第三个报文（ACK）的确认号是多少？',
        options: [
          { text: '1002' },
          { text: '5001' },
          { text: '5002', correct: true },
          { text: '5001 + 1001' }
        ],
        explain: '第三个报文确认服务器的 SYN，确认号 = 服务器初始序号 + 1 = 5001 + 1 = 5002；它自身的序号为 1002，但不携带数据，所以不会让确认号再增加。SYN 占一个序号，这一点是算握手题的关键。'
      }
,

      /* ---------------- ch05 应用层与 P2P ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '浏览器第二次请求同一页面时带上 If-None-Match，服务器检查后发现内容没有变化，最合适的响应是？',
        options: [
          { text: '304 Not Modified，响应只有头、没有体', correct: true },
          { text: '200 OK，重新发送整个页面' },
          { text: '301 Moved Permanently，让浏览器去新地址' },
          { text: '412 Precondition Failed，拒绝这次条件请求' }
        ],
        explain: '304 表示缓存副本仍然有效，客户端直接复用本地内容，省掉整个响应体的传输；412 的语义是前置条件不满足，与「内容没变化」无关。ETag/If-None-Match 与 Last-Modified/If-Modified-Since 是两条并行的时间与内容校验线。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'DNS 根服务器常被说成「13 组」，正确理解这个数字的是？',
        options: [
          { text: '13 组逻辑标识，每组用 anycast 在全球部署多个实例', correct: true },
          { text: '全球只有 13 台物理机器，所有查询都发到它们' },
          { text: '13 个顶级域，每个顶级域配一组根服务器' },
          { text: '13 个递归解析器集群，由 ICANN 直接运营' }
        ],
        explain: '根服务器是 a.root-servers.net 到 m.root-servers.net 共 13 个逻辑名字，每组通过 anycast 在多地宣告同一地址，实际实例有上千个，所以 13 不是机器数量。这也解释了为什么根区扩展不必增加逻辑名字，只要多部署实例。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'BitTorrent 用 rarest-first 选择下一个要下载的块，最主要的原因是？',
        options: [
          { text: '优先补齐副本最少的块，防止持有者离开后该块消失', correct: true },
          { text: '优先下载体积最大的块，减少请求次数' },
          { text: '优先向上传最快的 peer 请求，提高本地下行速率' },
          { text: '优先重传校验失败的块，尽快完成文件' }
        ],
        explain: '稀有块一旦没有其他 peer 持有，最后一个持有者下线就可能让整个文件永远拼不完整；rarest-first 让稀缺副本尽快扩散，提高 swarm 的整体可完成性。它与 tit-for-tat 的分工是：前者决定「下什么」，后者决定「向谁下」。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: 'HTTP/3 把传输层从 TCP 换成基于 UDP 的 QUIC，因此同一条连接里某个流丢包，只会阻塞该流的重传，其它流不受影响。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'QUIC 在用户态实现独立流与按流重传，丢包只影响所在的流；这正是它相对 HTTP/2 over TCP 的关键改进，因为 TCP 的有序字节流保证会让所有流一起等重传，形成传输层队头阻塞。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '某 CDN 边缘节点原来的缓存命中率是 80%，优化后提高到 95%。假设总请求量不变，回源流量变为原来的多少？（填百分数，保留整数，如 25%）',
        answer: '25%',
        accept: ['25%', '25', '25％'],
        explain: '回源流量与未命中率成正比：未命中率从 20% 降到 5%，5 ÷ 20 = 25%，即回源流量降到原来的四分之一。命中率每提高一点，源站带宽都按未命中比例下降，这就是 CDN 把内容推到边缘的经济动机。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '关于 Chord 的 finger 表，下列说法正确的有？（多选）',
        options: [
          { text: '第 i 项指向环上 n + 2^(i−1) 之后的第一个节点', correct: true },
          { text: 'finger 表把平均查找跳数从 O(N) 降到 O(log N)', correct: true },
          { text: '任何节点加入都必须重建全网所有节点的 finger 表', correct: false },
          { text: 'finger 表的第一项就是该节点的直接后继', correct: true }
        ],
        explain: 'finger 表是「指数跳跃」路由表：第 i 项跨 2^(i−1)，每次至少把剩余距离减半，所以查找 O(log N)；节点加入只需更新邻居和自身的表，靠 stabilize 逐步收敛，不需要全网重建。第一项跨 1，正好是直接后继。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-8', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['practice'],
        stem: '一个基于 TCP 的自定义协议，发送方连续 send 两条消息，接收方一次 recv 却收到了两条拼在一起的数据。最直接的原因与修复是？',
        options: [
          { text: 'TCP 是字节流、不保留消息边界，协议要自带长度字段或分隔符', correct: true },
          { text: 'TCP 丢包触发了重传，需要关闭快速重传' },
          { text: '接收方缓冲区太小，需要调大 SO_RCVBUF' },
          { text: 'UDP 校验和出错，应改用 TCP 重发' }
        ],
        explain: 'TCP 只保证字节有序到达，不保留 send 的边界：两次 send 可能合并成一次 recv（粘包），一条消息也可能分多次到达（半包）；协议必须自己定义边界，例如固定长度前缀、分隔符或定长消息。调大缓冲区只会改变拆分位置，不会恢复边界。'
      }
,

      /* ---------------- ch06 RPC、时钟与分布式存储 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-3', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['design'],
        stem: '某支付服务用 gRPC 调用扣款接口，客户端 deadline 设为 800 ms，超时后自动重试一次。服务端实现是「读余额→减 100→写回」，没有幂等键。下列判断哪一项正确？',
        options: [
          { text: 'gRPC 默认保证恰好一次，重试不会重复扣款' },
          { text: '超时可能发生在扣款成功之后，重试会重复扣款；应让服务端用幂等键去重', correct: true },
          { text: '把 deadline 从 800 ms 调到 5 s 就一定不会重复' },
          { text: '只要把重试次数限制为 1 次，就一定不会重复' }
        ],
        explain: '超时只能说明没在 deadline 内收到响应，不能区分请求没到、没执行完、还是执行完但响应丢了。重试会把「可能已扣款」变成「可能扣两次」，所以要么用幂等键让服务端去重，要么把扣款本身设计成幂等操作。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-5', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '三个事件的向量时钟分别为 V(a)=(2,1,0)、V(b)=(1,3,0)、V(c)=(2,1,0)。下列判断哪一项正确？',
        options: [
          { text: 'a 因果先于 b' },
          { text: 'a 与 b 并发', correct: true },
          { text: 'a 与 c 存在因果先后' },
          { text: 'b 因果先于 c' }
        ],
        explain: '逐分量比较：V(a) 第一位 2>1，V(b) 第二位 3>1，两个向量各有大小、互不包含，因此 a 与 b 并发。V(a) 与 V(c) 完全相等，说明二者是同一事件或信息尚未传播，不能判为先后；Lamport 时钟在这种情况下只能给出一个假的全序。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-8', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['design'],
        stem: 'Dynamo 集群 N=3、R=2、W=2，键 k 的三个首选副本为 A、B、C，其中 C 宕机。此时一次写请求最可能发生什么？',
        options: [
          { text: '写失败，因为不足三个副本' },
          { text: 'A、B 确认后写成功；D 可能替 C 暂存，待 C 恢复后再移交', correct: true },
          { text: '只写 A 就返回，因为 W 可以临时降为 1' },
          { text: '读请求一定返回旧值' }
        ],
        explain: 'W=2 只要求两个副本确认，C 宕机后 A、B 已满足。sloppy quorum 还可能把本该属于 C 的数据顺延写到 D 并标记「替 C 暂存」，等 C 恢复后用 hinted handoff 移交。写不会失败，但读可能读到尚未移交的版本，需要读修复与反熵兜底。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '关于 gRPC 的存根与序列化，下列哪一项描述正确？',
        options: [
          { text: '存根由服务端在运行时动态生成，客户端不需要 IDL' },
          { text: '客户端存根编组参数并按请求号匹配响应，服务端存根解组并派发到实现函数', correct: true },
          { text: 'Protobuf 会传输字段名，所以通常比 JSON 更大' },
          { text: '请求号只用于日志追踪，不参与响应匹配' }
        ],
        explain: '存根由 IDL 编译生成：客户端存根负责编组参数、发送请求、按请求号找到等待中的调用；服务端存根负责解组、查分发表并调用实现函数。Protobuf 只传字段编号与变长编码，不传字段名，通常比 JSON 小；请求号同时用于响应匹配与辅助去重。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '在 NTP 中，stratum 的值越大，表示该服务器离参考时钟越近、精度越高。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'stratum 表示「离参考时钟几跳」：stratum 0 是原子钟或 GPS 本身，stratum 1 直连它，stratum 2 再向 stratum 1 同步。层级越深，累积的路径不对称误差与排队误差越大，精度通常越低，所以题目说反了。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 3, type: 'multi', difficulty: 3,
        tags: ['concept'],
        stem: '关于 quorum 与一致性模型，下列哪些说法正确？（多选）',
        options: [
          { text: 'N=3、R=2、W=2 时，读集合与写集合一定有交集', correct: true },
          { text: 'R+W>N 保证读到最新值，读延迟由最慢的那个副本决定' },
          { text: '最终一致的系统在停止写入后，副本最终会收敛到同一值', correct: true },
          { text: '线性一致要求操作按真实时间顺序生效，分区时可能牺牲可用性', correct: true }
        ],
        explain: 'R+W>N 保证读写集合相交，从而至少碰到一个最新副本；但读要等 R 个响应，延迟由「第 R 快」的副本决定，不是最慢的。最终一致只承诺停止写入后收敛，不承诺读时最新；线性一致在分区时确实可能选择拒绝服务以保一致。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: 'GFS 把文件切成固定大小的 chunk，默认大小为多少 MB？（只填数字）',
        answer: '64',
        explain: 'GFS 论文把 chunk 默认设为 64 MB，远大于当时普通文件系统的 4 KB 块。大 chunk 让 master 的元数据规模变小、客户端与 master 的交互次数变少；代价是热点 chunk 更难均衡，只能靠迁移副本缓解。'
      },

      /* ---------------- ch03 Socket 编程 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '服务器只在一个 9000 端口上监听，却能同时服务上万个客户端。内核凭什么判断某个到达的字节属于哪一条连接？',
        options: [
          { text: '看五元组：协议、源 IP、源端口、目的 IP、目的端口，五者全同才算同一条连接', correct: true },
          { text: '看 accept 返回的 fd 号，fd 不同就是不同连接' },
          { text: '看 TCP 报文里的序号，序号不重叠就属于不同连接' },
          { text: '看客户端每次连接时重新协商的端口，服务器端口会随之改变' }
        ],
        explain: '区分连接靠五元组而不是 fd：fd 只是本进程内的一张表项，同一个数字在不同进程里毫无关系，内核收包时先用五元组查 socket。正因为每条连接的源端口不同，同一个监听端口才能承载上万条连接；服务器端口始终是 9000，不会随连接改变。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '客户端 connect 返回成功，说明服务器进程已经执行过 accept。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'connect 成功只说明三次握手完成、连接已进入服务器的已完成连接队列，这一步由双方内核完成，与应用程序是否调用 accept 无关。服务器迟迟不 accept 时，客户端能连上却收不到任何回应，正是这个原因。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 3, type: 'multi', difficulty: 3,
        tags: ['practice'],
        stem: '用 fork 写每连接一进程的 echo 服务器，下面哪些做法是必须的？',
        options: [
          { text: '父进程 accept 后关闭自己的连接 fd', correct: true },
          { text: '子进程处理数据前关闭继承来的监听 fd', correct: true },
          { text: '在 SIGCHLD 处理函数里循环调用 waitpid(-1, NULL, WNOHANG)', correct: true },
          { text: '子进程结束时调用 exit(0)，让 stdio 缓冲区刷新', correct: false }
        ],
        explain: '父子进程各持一份 fd 引用，任何一方不关，引用计数都降不到 0，连接就不会真正关闭，监听 fd 也会一直被占着。子进程退出后不回收会变成僵尸，且一次 SIGCHLD 可能对应多个子进程退出，所以要循环 waitpid。子进程应当用 _exit，避免把父进程 stdio 缓冲区里的内容重复刷出去。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '不考虑 IPv6 与 IP 选项，一个 UDP 数据报最多能携带多少字节的应用数据？（只填数字）',
        answer: '65507',
        accept: ['65507', '65,507'],
        explain: '65535 是 IP 总长度字段的上限，减去 20 字节 IP 首部与 8 字节 UDP 首部，剩下 65507 字节。超过这个长度 sendto 会返回 EMSGSIZE；实际还受 MTU 约束，超过约 1472 字节就会被分片，丢一片整个报文就废了。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'UDP 服务器不用 listen 与 accept，一个 socket 就能服务任意多个客户端。回包时它靠什么知道该发给谁？',
        options: [
          { text: 'recvfrom 把发送方地址写进传入的 sockaddr 结构，原样传给 sendto 即可', correct: true },
          { text: '内核为每个客户端自动创建一个新 socket，服务器遍历这些 socket 回包' },
          { text: 'UDP 报文头里有连接号，服务器按连接号查表' },
          { text: '必须先调用 connect 记录对端地址，否则无法回包' }
        ],
        explain: 'UDP 没有连接，也就没有 accept 产生的新 fd：每次 recvfrom 都会把来源地址与端口填进你给的 sockaddr_in，这是唯一需要记住的对端信息，回包时原样交给 sendto。connect 只是可选优化，用来固定默认目的地址并过滤来源，不调用照样能收发。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['debug'],
        stem: '某服务把 epoll 从水平触发改成边缘触发后，压测时偶发「连接还在、但再也不回包」。最可能的原因是？',
        options: [
          { text: '事件到来时只 read 了一次，没有循环读到 EAGAIN，缓冲区剩余数据再也等不到通知', correct: true },
          { text: '忘了设置 SO_REUSEADDR，端口被旧连接占住' },
          { text: '关闭连接前忘了调用 EPOLL_CTL_DEL' },
          { text: '监听 fd 仍是阻塞的，accept 卡住了事件循环' }
        ],
        explain: 'ET 只在状态变化的那一下通知一次，之后即使缓冲区里还有数据也不会再提醒。一次 read 没读空，剩余字节就永远留在内核缓冲区里，表现为连接活着却不再有回包。修法是 fd 设非阻塞，并在循环里读到返回 -1 且 errno 为 EAGAIN 为止。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'tf', difficulty: 2,
        tags: ['debug'],
        stem: '服务器 read 返回 -1 且 errno 为 EINTR 时，应当把它当成对端异常，关闭连接并结束循环。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'EINTR 只是慢系统调用被信号处理函数打断，调用本身没有失败，重试即可（if (errno == EINTR) continue;）。把它当致命错误，会在装上 SIGCHLD 或定时器信号后频繁误关正常连接。真正表示对端关闭的是 read 返回 0。'
      },

      /* ---------------- ch07 集合通信与数据中心网络 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-3', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['calc'],
        stem: '64 个节点、每节点 1.6 GB 梯度：环形 All-Reduce 约 0.13 s，单点参数服务器要 4.0 s。两者搬过网络的总字节数都是 201.6 GB，耗时却差 32 倍，根本原因是：',
        options: [
          { text: '环形 All-Reduce 的总流量比参数服务器小一个数量级' },
          { text: '参数服务器的流量全压在 root 的一块网卡上，环形的流量被所有网卡平摊', correct: true },
          { text: '参数服务器要额外做序列化与反序列化，这部分开销无法并行' },
          { text: '环形走的是 UDP，绕过了内核协议栈' }
        ],
        explain: '两者的总字节数完全一样：64 × 3.15 GB = 201.6 GB。差别在「流量落在哪块网卡」：环形里每个节点只发 3.15 GB，正好是自己出海口的一条流水线；参数服务器要由 root 收齐 63 份梯度（100.8 GB）再分发 100.8 GB，100.8/25 ≈ 4.03 s 全挤在 root 的一块网卡上。所以集合通信优化的不是总流量，而是把流量摊到所有网卡、并且不让任何一块成为瓶颈。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-5', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['calc'],
        stem: '一台交换机有 8 条等价上行链路，4 条大象流各自独立做五元组哈希、结果在 8 条链路上均匀分布。至少两条流撞到同一条上行链路的概率约为：',
        options: [
          { text: '12.5%' },
          { text: '41%' },
          { text: '59%', correct: true },
          { text: '99.8%' }
        ],
        explain: '先算反面：4 条流全部错开 = (8/8)(7/8)(6/8)(5/8) = 210/512 ≈ 41%，所以至少撞一次 ≈ 1 − 41% = 59%。12.5% 只是「指定的两条流撞在指定一条链路上」；41% 是全错开的概率，方向反了；99.8% 是 8 条流时的情形。哈希冲突无法靠调参消除，只能靠更大的熵（逐流、逐包喷洒）或自适应选路缓解。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '8 亿参数的模型用混合精度 Adam 训练：fp16 参数与梯度各占 2 B，fp32 主权重与两个动量各占 4 B。未做 ZeRO 时每张卡都存一份完整状态，需要约多少 GB 显存？（只填数字，保留一位小数）',
        answer: '12.8',
        accept: ['12.8', '12.8 GB', '12.8GB', '12.8 gb'],
        explain: '每参数 16 B：2（fp16 参数）+ 2（fp16 梯度）+ 4（fp32 主权重）+ 4 + 4（两个动量）= 16 B，8 亿 × 16 B = 12.8 GB。按 8 卡做 ZeRO-1 只切 12 B 的优化器状态：每参数 2 + 2 + 12/8 = 5.5 B，合计约 4.4 GB；ZeRO-3 连参数也切开，每卡约 1.6 GB。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '环形 All-Reduce 中，单个节点需要收发的字节数会随节点数 N 线性增长。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '每节点收发 2(N−1)/N × S：N 从 8 增到 64，系数只从 1.75 变到 1.97，极限是 2S，基本与 N 无关。随 N 线性增长的是全网总流量 2(N−1)S，以及跳数 2(N−1)——代价从「带宽」转移到了「延迟」。这正是环形适合大消息的原因：单节点带宽占用不随规模恶化。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-7', tier: 3, type: 'multi', difficulty: 3,
        tags: ['concept'],
        stem: '关于大模型训练的并行策略与通信代价，下列哪些说法正确？（多选）',
        options: [
          { text: '张量并行每层要做两次 All-Reduce，对延迟极敏感，通常只放在 NVLink 域内', correct: true },
          { text: '流水并行的气泡比例为 (p−1)/(m+p−1)，p 是流水级数、m 是 micro-batch 数', correct: true },
          { text: '数据并行每节点收发约 2(N−1)/N × S，N 增大时趋近 2S，与卡数几乎无关', correct: true },
          { text: '全局 batch 越大越好：既降低通信频率，又加快收敛' },
          { text: '专家并行的 All-to-All 不需要归约，所以比同样数据量的 All-Reduce 便宜' }
        ],
        explain: '前三条是三条并行维度的主导约束：TP 的 All-Reduce 是每层两次的小消息，只有 NVLink 的微秒级延迟扛得住；PP 的气泡由流水级数 p 和 micro-batch 数 m 的相对大小决定；DP 的单节点流量近似与卡数无关，只有全网总流量线性增长。第 4 条错在两头：batch 过大泛化变差、每步能跑的迭代数变少，学习率还得重调；第 5 条错在 All-to-All 虽然不求和，但每块网卡要发出全量数据、还依赖全局配对，实际比同数据量的 All-Reduce 更贵。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['calc'],
        stem: 'k=48 的 fat-tree（每台交换机 48 口、上下各 24 口）最多能接多少台主机？',
        options: [
          { text: '2304' },
          { text: '6912' },
          { text: '27648', correct: true },
          { text: '110592' }
        ],
        explain: 'k 元 fat-tree 的主机数是 k³/4 = 48³/4 = 110592/4 = 27648。2304 = k²，大致是一个 pod 的量级；110592 = k³，漏了「端口上下各一半、pod 内还要对折」。配套数字：交换机 5k²/4 = 2880 台，其中核心层 k²/4 = 576 台；每个 pod 装 576 台主机。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '8 个进程各持一份 1.6 GB 的梯度，要求每个进程最后都拿到这 8 份梯度之和。应该用哪个集合通信原语？',
        options: [
          { text: 'All-Gather' },
          { text: 'Reduce' },
          { text: 'All-Reduce', correct: true },
          { text: 'Scatter' }
        ],
        explain: 'All-Gather 把 8 份拼成 8 × 1.6 GB，但不做逐元素求和；Reduce 只有 root 拿到和，其余进程仍是各自的局部值；Scatter 是把 root 的一份切成 8 份分发，方向正好相反。All-Reduce 等于 Reduce-Scatter + All-Gather 两阶段，既求和又人人有份，是数据并行梯度同步的标准原语。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
