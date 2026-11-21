/* =====================================================================
 * site.js · CSC4303 计算机网络 站点配置（window.CSC_SITE）
 * ===================================================================== */
window.CSC_SITE = {
  id: 'csc4303',
  short: 'CSC4303',
  name: '计算机网络',
  en: 'Computer Networks',
  dept: '计算机科学',
  lang: 'text',
  langLabel: '网络',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读 + 自测',
  bootHead: 'CSC4303 // PACKET OBSERVATORY',
  bootLog: [
    '> mounting course partition ... CSC4303',
    '> loading 8 modules: layering, transport, socket, routing ...',
    '> attaching capture hooks: dns, tcp, http, quic',
    '> link up at 1 Gbps. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '把一个分组从应用写到光纤，再写回来。',
  missionEn: 'CSC4303 · 8 MODULES',
  missionTitle: '从一次请求到一万台机器<br><em>看得见，算得出，写得了</em>',
  lede: '八章沿一条主线推进：请求怎样被封装、可靠传输怎样在丢包之上成立、socket 怎样把它变成程序、IP 与路由怎样把包送到对岸，最后进入 RPC、分布式存储与数据中心。每章配抓包例子、计算题、对比表与自检清单。',
  searchPlaceholder: 'QUERY // 搜索：时延 · 滑动窗口 · epoll · 子网 · quorum · All-Reduce',

  /* 资料库（path 相对 "CUHKSZ course/CSC4303" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/CSC4303/',
  resources: {
    note: '收录 CSC4303 的讲义、三篇经典论文原文、公式汇总与作业习题课材料；文件名即原始文件，点击后用系统默认程序打开。',
    groups: [
      { name: '讲义（按周）', note: '编号与课程周历大致对应，ch01–ch07 的正文都标注了对应的讲义。', items: [
        { title: '01 · 课程介绍与网络概述', path: '学习资料/CSC4303_01_intro.pdf', kind: 'pdf', note: '课程目标、参考书、考核结构与周历' },
        { title: '02 · 分层与性能', path: '学习资料/CSC4303_02_network.pdf', kind: 'pdf', note: '对应 ch01：分层、封装、时延与吞吐' },
        { title: '03 · 传输层', path: '学习资料/CSC4303_03_transport.pdf', kind: 'pdf', note: '对应 ch02：复用、UDP、可靠传输' },
        { title: '04 · 流量控制', path: '学习资料/CSC4303_04_flow_control.pdf', kind: 'pdf', note: '对应 ch02：滑动窗口与 rwnd' },
        { title: '05 · 拥塞控制', path: '学习资料/CSC4303_05_congestion.pdf', kind: 'pdf', note: '对应 ch02：慢启动、AIMD、快速恢复' },
        { title: '06 · Socket 编程', path: '学习资料/CSC4303_06_socket.pdf', kind: 'pdf', note: '对应 ch03：调用序列、并发与多路复用' },
        { title: '07 · IP 协议', path: '学习资料/CSC4303_07_IP.pdf', kind: 'pdf', note: '对应 ch04：报文头、分片、地址与 CIDR' },
        { title: '08 · 路由', path: '学习资料/CSC4303_08_routing.pdf', kind: 'pdf', note: '对应 ch04：距离向量、链路状态、OSPF/BGP' },
        { title: '09 · P2P', path: '学习资料/CSC4303_09_p2p.pdf', kind: 'pdf', note: '对应 ch05：BitTorrent 与 DHT' },
        { title: '11 · 应用层', path: '学习资料/CSC4303_11_application.pdf', kind: 'pdf', note: '对应 ch05：HTTP、DNS、CDN' },
        { title: '12 · RPC', path: '学习资料/CSC4303_12_rpc.pdf', kind: 'pdf', note: '对应 ch06：存根、序列化与失败语义' },
        { title: '13 · GFS', path: '学习资料/CSC4303_13_gfs.pdf', kind: 'pdf', note: '对应 ch06：master、chunk 与租约' },
        { title: '14 · 时钟与顺序', path: '学习资料/CSC4303_14_time.pdf', kind: 'pdf', note: '对应 ch06：NTP、Lamport 与向量时钟' },
        { title: '15 · 集合通信', path: '学习资料/CSC4303_15_collective.pdf', kind: 'pdf', note: '对应 ch07：原语与通信量' },
        { title: '16 · 集合通信算法', path: '学习资料/CSC4303_16_collective_algo.pdf', kind: 'pdf', note: '对应 ch07：环、树与递归倍增' },
        { title: '17 · ML 系统', path: '学习资料/CSC4303_17_mlsys.pdf', kind: 'pdf', note: '对应 ch07：并行策略与通信瓶颈' },
        { title: '18 · 数据中心网络', path: '学习资料/CSC4303_18_dcn.pdf', kind: 'pdf', note: '对应 ch07：fat-tree、ECMP 与拥塞' },
        { title: '19 · 复习', path: '学习资料/CSC4303_19_review.pdf', kind: 'pdf', note: '全课提纲，考前对着速查表过一遍' }
      ] },
      { name: '论文与公式', note: '三篇原文对应 ch05–ch06；公式汇总适合考前速览。', items: [
        { title: 'GFS 论文（SOSP 2003）', path: '学习资料/CSC4303_gfs_sosp2003.pdf', kind: 'pdf', note: 'ch06 的存储原型：架构、租约、追加写' },
        { title: 'Dynamo 论文（SOSP 2007）', path: '学习资料/CSC4303_amazon_dynamo_sosp2007.pdf', kind: 'pdf', note: 'ch06：一致性哈希、向量时钟、sloppy quorum' },
        { title: 'Chord 论文（SIGCOMM）', path: '学习资料/CSC4303_chord_sigcomm.pdf', kind: 'pdf', note: 'ch05：DHT 与 finger table' },
        { title: '定义与公式汇总', path: '学习资料/CSC4303_definitions_and_formulas.docx', kind: 'docx', note: '名词解释与常用公式，考前速览' },
        { title: '并发编程补充材料', path: '学习资料/CSC4303_Conc_Comp.pdf', kind: 'pdf', note: '线程、锁与并发的背景知识，配合 ch03 读' },
        { title: 'Stanford CS295 讲座', path: '学习资料/CSC4303_stanford_295_talk.pdf', kind: 'pdf', note: '数据中心与机器学习系统的外部视角' }
      ] },
      { name: '作业与习题课', note: '作业说明与各次习题课材料；动手前先读要求与评分点。', items: [
        { title: '期末样卷', path: '考试资料/CSC4303_exam_sample.pdf', kind: 'pdf', note: '题型与分值分布，配合本站模拟卷 A 使用' },
        { title: 'Assignment 04 指南', path: '作业习题/CSC4303_Assignment_04_guide.pdf', kind: 'pdf', note: '第四次编程作业的要求与提交说明' },
        { title: 'EC2 网络测量', path: '作业习题/CSC4303_ec2_measurement.pdf', kind: 'pdf', note: '在 AWS 上做时延与吞吐测量的步骤' },
        { title: 'EC2 实验课件', path: '作业习题/CSC4303_ec2.pptx', kind: 'pptx', note: '开实例、配安全组与跑测量的演示' },
        { title: 'Assignment 02 习题课', path: '作业习题/CSC4303_tutorial_assignment2_guide.pdf', kind: 'pdf', note: '第二次作业的思路与常见错误' },
        { title: 'Tutorial 05', path: '作业习题/CSC4303_Tutorial_05.pptx', kind: 'pptx', note: '传输层与 socket 的课堂练习' },
        { title: 'Tutorial 06', path: '作业习题/CSC4303_Tutorial_06.pptx', kind: 'pptx', note: '网络层与子网计算的课堂练习' },
        { title: 'Tutorial 09', path: '作业习题/CSC4303_Tutorial_09.pptx', kind: 'pptx', note: '分布式存储与 RPC 的课堂练习' }
      ] }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '计算机网络（Computer Networks）· CSC4303'],
    ['院系', '香港中文大学（深圳）数据科学学院 · 2026 春季'],
    ['结构', '8 章正文 · 56 道分章题 · 模拟卷 A · 3 个实战项目 · 资料库'],
    ['用法', '先读第 0 章建立地图，再按 ch01→ch07 推进；每章的自检清单与内嵌题不要跳过。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    { label: '时延与吞吐', blocks: [
      { t: 'table', head: ['量', '公式', '例子'], rows: [
        ['传输时延', 'L / R（帧长 ÷ 链路速率）', '1500 B @ 1 Gbps = 12 µs'],
        ['传播时延', 'd / s（距离 ÷ 介质中光速，约 2×10<sup>8</sup> m/s）', '2000 km = 10 ms'],
        ['排队时延', '取决于队列长度与到达率，拥塞时急剧上升', '接近满载时可达毫秒级'],
        ['处理时延', '路由器查表与校验，通常微秒级', '常与排队合并估算'],
        ['带宽时延积', 'BDP = R × RTT', '1 Gbps × 20 ms = 20 Mbit = 2.5 MB'],
        ['窗口吞吐', '窗口 / RTT', '64 KB / 80 ms = 6.55 Mbps'],
        ['停等利用率', '(L/R) / (RTT + L/R)', '1500 B、80 ms → 0.015%'],
        ['瓶颈吞吐', 'min(各链路速率)', '接入 100 Mbps + 骨干 10 Gbps → 100 Mbps']
      ], caption: '先分清「传输」与「传播」：前者与帧长和速率有关，后者只与距离和介质有关' },
      { t: 'p', html: '做时延题的标准步骤：① 画路径，标出每条链路的 R 与 d；② 逐段算传输与传播，路由器处加处理与排队；③ 端到端时延 = 各段之和；④ 若问吞吐，先找瓶颈链路，再判断窗口是否够大（窗口 ≥ BDP 才能跑满）。' }
    ] },
    { label: 'TCP 机制', blocks: [
      { t: 'table', head: ['阶段', '触发', 'cwnd 变化', '结束条件'], rows: [
        ['慢启动', '连接建立或超时后', '每个 RTT 翻倍（指数）', 'cwnd ≥ ssthresh'],
        ['拥塞避免', 'cwnd ≥ ssthresh', '每个 RTT +1 MSS（线性）', '检测到丢包'],
        ['快速重传', '3 个重复 ACK', '不等待超时，立即重发', '收到新 ACK'],
        ['快速恢复', '快速重传之后', 'ssthresh = cwnd/2，cwnd = ssthresh + 3 MSS', '收到新 ACK 后回到拥塞避免'],
        ['超时', 'RTO 到期', 'ssthresh = cwnd/2，cwnd = 1 MSS', '重新慢启动']
      ], caption: '记住两条线：指数到阈值，线性往上爬；丢包就腰斩，超时更狠' },
      { t: 'table', head: ['状态', '含义', '常见问题'], rows: [
        ['<code>LISTEN</code>', '服务器等待连接', '端口被占：<code>EADDRINUSE</code>，用 SO_REUSEADDR'],
        ['<code>SYN_SENT</code>', '客户端已发 SYN', '长时间停留说明对端不可达或被防火墙丢弃'],
        ['<code>SYN_RCVD</code>', '服务器收到 SYN', '大量堆积可能是 SYN flood'],
        ['<code>ESTABLISHED</code>', '连接可用', 'fd 泄漏时这里会持续增长'],
        ['<code>CLOSE_WAIT</code>', '对端已关闭，本端未 close', '应用忘了 close 的典型信号'],
        ['<code>TIME_WAIT</code>', '主动关闭方等待 2MSL', '正常现象；过多可复用连接或调参']
      ], caption: '用 <code>ss -tan</code> 看状态分布，比读日志更快定位问题' },
      { t: 'p', html: '三个窗口别混：<b>rwnd</b> 由接收方通告（流量控制），<b>cwnd</b> 由发送方维护（拥塞控制），实际可发 = min(cwnd, rwnd)。接收窗口为 0 时发送方必须启动零窗口探测，否则窗口更新丢失会死锁。' }
    ] },
    { label: '子网与路由', blocks: [
      { t: 'table', head: ['前缀', '掩码', '块大小', '可用主机'], rows: [
        ['/24', '255.255.255.0', '256', '254'],
        ['/25', '255.255.255.128', '128', '126'],
        ['/26', '255.255.255.192', '64', '62'],
        ['/27', '255.255.255.224', '32', '30'],
        ['/22', '255.255.252.0', '1024（第三段步长 4）', '1022'],
        ['/18', '255.255.192.0', '16384（第三段步长 64）', '16382']
      ], caption: '块大小 = 2<sup>(32−前缀)</sup>；网络地址是块大小的整数倍，广播是下一个块减一' },
      { t: 'steps', items: [
        { title: '① 写掩码', html: '把 /n 展开成点分掩码，确定哪一段是「块大小」所在段。' },
        { title: '② 找网络地址', html: '把主机地址与掩码按位与；或看该段落在哪个块大小的整数倍区间。' },
        { title: '③ 算范围', html: '网络地址 + 1 到广播地址 − 1 是可用范围，数量 2<sup>主机位</sup> − 2。' },
        { title: '④ 最长前缀', html: '多条路由都匹配时选前缀最长的；前缀相同才比较管理距离或度量。' }
      ] },
      { t: 'p', html: '域内用 OSPF（链路状态、Dijkstra、按 cost 选路），域间用 BGP（路径向量、AS-PATH 防环、按策略选路）。BGP 不选「最短」，而选「商业上最合适」——这是它与所有内部协议的根本差别。' }
    ] },
    { label: '分布式与集合通信', blocks: [
      { t: 'table', head: ['概念', '公式 / 条件', '含义'], rows: [
        ['Quorum 交集', 'R + W &gt; N', '读写集合必有交集，读能碰到最新写'],
        ['常见配置', 'N=3, W=2, R=2', '容忍 1 个节点故障，仍可读写'],
        ['一致性哈希迁移', '约 1/(N+1) 的数据', '加一台机器只搬一段，而非全部重算'],
        ['环形 All-Reduce', '2(N−1)/N × S', 'N 越大越接近 2S，与节点数几乎无关'],
        ['树形 All-Reduce', 'O(log N) 跳', '延迟低但根节点带宽是瓶颈'],
        ['GFS 块大小', '64 MB', '元数据少、顺序读快，代价是小文件与热点']
      ], caption: '期末设计题先写这三个式子，再展开讨论取舍' },
      { t: 'p', html: '回答「加机器会怎样」这类题，先分清是<b>分片</b>还是<b>复制</b>：分片改变数据归属，取模会全量迁移，一致性哈希只迁一段；复制增加副本数，写要等 quorum，读可以就近。两者的故障语义完全不同，不要混着答。' }
    ] }
  ]
};
