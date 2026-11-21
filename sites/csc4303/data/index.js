/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * 说明：title 必须与 data/chXX.js 里的 title 逐字一致。
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：从网页请求到数据中心', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先摊开整门课的地图：一次请求经过哪些协议、七章怎样互相支撑、作业与期末怎么考，以及本站怎么用。' },
  { id: 'ch01', num: '01', title: '分层与性能：一个分组怎样走完全程', en: 'LAYERING & PERFORMANCE', part: 'Part II · 基础', week: 2, minutes: 100, icon: 'layers', labs: 1,
    blurb: '从封装、MTU 到四种时延与带宽时延积：把「网络慢」拆成可计算的几项，并讲清分层与端到端原则的代价。' },
  { id: 'ch02', num: '02', title: '传输层：可靠传输、流量与拥塞控制', en: 'TRANSPORT LAYER', part: 'Part II · 基础', week: 4, minutes: 110, icon: 'repeat', labs: 1,
    blurb: '在会丢包的 IP 之上造出可靠、有序、不把网络打爆的传输：滑动窗口、三次握手、AIMD 与快速恢复。' },
  { id: 'ch03', num: '03', title: 'Socket 编程：从 echo 到并发服务器', en: 'SOCKET PROGRAMMING', part: 'Part II · 基础', week: 5, minutes: 120, icon: 'code', labs: 1,
    blurb: '把协议变成系统调用：TCP/UDP 调用序列、fork 与线程、粘包与字节序、select/poll/epoll 与常见错误。' },
  { id: 'ch04', num: '04', title: '网络层：IP 地址、转发与路由', en: 'NETWORK LAYER', part: 'Part III · 深入', week: 7, minutes: 110, icon: 'grid', labs: 1,
    blurb: 'IPv4 头与分片、CIDR 与最长前缀匹配、NAT，再到距离向量/链路状态与 OSPF/BGP 的域内域外分工。' },
  { id: 'ch05', num: '05', title: '应用层与 P2P：从 HTTP 到 BitTorrent', en: 'APPLICATION & P2P', part: 'Part III · 深入', week: 8, minutes: 100, icon: 'star', labs: 1,
    blurb: 'HTTP/1.1 到 HTTP/3 的演进、DNS 的分布式解析、CDN，以及 BitTorrent 的 tit-for-tat 与 Chord 的 DHT。' },
  { id: 'ch06', num: '06', title: 'RPC、时钟与分布式存储', en: 'RPC, TIME & STORAGE', part: 'Part III · 深入', week: 10, minutes: 110, icon: 'cpu', labs: 1,
    blurb: '远程调用为什么不像本地调用、物理时钟为何不可信、复制与 quorum 怎么取舍，以及 GFS 与 Dynamo 的架构。' },
  { id: 'ch07', num: '07', title: '集合通信与数据中心网络', en: 'COLLECTIVE COMM & DCN', part: 'Part IV · 综合', week: 12, minutes: 120, icon: 'rocket', labs: 1,
    blurb: 'All-Reduce 的环与树、fat-tree 与 ECMP、分布式训练的通信瓶颈，最后把七章串成一条从分组到集群的线。' }
]);
