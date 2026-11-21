/* =====================================================================
 * ch05.js · 第 5 章「应用层与 P2P：从 HTTP 到 BitTorrent」
 * 职责：讲清应用层协议的四个要素、HTTP 与缓存、DNS 的层次解析、CDN 的就近调度、
 *       P2P 的三种架构、BitTorrent 的分块与激励、Chord 的环与 finger 表。
 * 依据：CSC4303_09_p2p.pdf、11_application.pdf、chord_sigcomm.pdf。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch05',
  num: '05',
  title: '应用层与 P2P：从 HTTP 到 BitTorrent',
  en: 'APPLICATION & P2P',
  goals: [
    '说出应用层协议的四个要素，并用 HTTP 请求行与 DNS 查询报文各举一例',
    '读懂一条 HTTP 请求与响应，判断缓存是否命中、304 与重定向分别意味着什么',
    '画出一次冷 DNS 查询的迭代路径，解释 TTL、EDNS0 与 TCP 回退各解决什么问题',
    '用分发时间公式比较 C/S 与 P2P，说明 BitTorrent 的 rarest-first 与 tit-for-tat 各自防住什么',
    '在 m 位标识环上手算一次 Chord 查找，并估算 N 个节点时的跳数'
  ],
  kp: [
    { id: 'ch05-1', title: '应用层协议与 C/S 模型' },
    { id: 'ch05-2', title: 'HTTP：请求、响应与缓存' },
    { id: 'ch05-3', title: 'DNS：分布式解析' },
    { id: 'ch05-4', title: 'CDN：把内容搬到离用户更近' },
    { id: 'ch05-5', title: 'P2P 架构：从中心到对等' },
    { id: 'ch05-6', title: 'BitTorrent：分块与 tit-for-tat' },
    { id: 'ch05-7', title: 'DHT 与 Chord' },
    { id: 'ch05-8', title: '应用层协议设计要点' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么先读这一章', html: '应用层是唯一「没有通用协议」的一层：HTTP 规定请求与响应，DNS 规定查询与回答，BitTorrent 规定对等节点怎样互换数据块，三者对消息边界、谁先说话、失败重试的处理完全不同。这一章不背协议头，而是回答三个问题：一个应用层协议必须定义什么？HTTP 与 DNS 为什么长成今天这样？P2P 为什么能把分发成本从服务器转移给用户，又为此付出了什么代价？' },

    { t: 'p', lead: true, html: '先接上前面几章。ch01 讲了封装与 MTU，ch02 讲了 TCP 的可靠传输与拥塞控制，ch04 讲了分组怎样被路由。这一章站在这三层之上看应用：同一条 TCP 字节流，HTTP 用 <code>Content-Length</code> 切消息，BitTorrent 用 4 字节长度前缀切消息，DNS 干脆把整条查询塞进一个 UDP 报文。传输层只负责字节或报文，<b>消息的语义与边界由应用层自己定义</b>——这是本章的主线。' },

    { t: 'h', lvl: 2, text: '一、应用层协议与 C/S 模型', id: 'ch05-1' },

    { t: 'p', html: '一个应用层协议（application-layer protocol）至少要定义四件事。<b>报文类型</b>：谁可能发什么，比如 HTTP 的 GET 与 POST、DNS 的 query 与 response、BitTorrent 的 choke 与 request。<b>语法</b>：字段放在哪、多长、怎么分隔，比如请求行 <code>GET /index.html HTTP/1.1</code> 由空格分成三段，头部每行是 <code>Key: Value</code>。<b>语义</b>：字段的含义与副作用，GET 只取不改，PUT 是整体替换，POST 一般不幂等。<b>时序</b>：谁先发、什么条件下回、超时怎么办，HTTP 是客户端先请求，DNS 是解析器先查询。四者常常互相牵制：DNS 的响应必须带回原查询的 ID，否则解析器无法把答案配对，这是语法在替时序兜底。少定义任何一项，两端就只能各自猜测。还要分清协议与实现：协议是双方都认的约定，实现是各自的代码，同一份 HTTP 规范下浏览器、curl、nginx 的内部写法可以完全不同，只要线上字节符合约定就能互通。' },

    { t: 'table', head: ['协议', '传输层与端口', '消息边界', '谁先说话', '典型大小'], rows: [
      ['HTTP/1.1', 'TCP，80 或 443', '头部空行 + Content-Length 或 chunked', '客户端先请求', '请求头 300–800 字节'],
      ['DNS', 'UDP 53，大响应回退 TCP', '一个报文就是一条消息', '解析器先查询', '查询 30–60 字节'],
      ['BitTorrent peer wire', 'TCP，端口随机', '4 字节长度前缀 + 1 字节消息 ID', '双方对称握手', '块消息约 16 KB']
    ], caption: '同是应用层，消息边界的做法完全不同：这是设计协议时第一个要定的东西' },

    { t: 'compare', left: { title: '客户端-服务器（C/S）', html: '索引、内容、鉴权都放在中心。好处是状态好管、内容可审计、客户端简单；坏处是<b>服务器上行带宽就是全网上限</b>：100 Mbps 上行服务 1000 个 1 Mbps 的下载者，分发时间随人数线性增长。单点故障与 DDoS 也集中在这一处。' }, right: { title: '对等网络（P2P）', html: '每个 peer 既是下载者也是上传者，总上行随人数一起增长，分发时间近似与人数无关。代价是没有中心就没人负责：要靠激励算法防止搭便车，要靠 DHT 找资源，还要处理 NAT 穿透、作弊与版权问题。' } },

    { t: 'h', lvl: 2, text: '二、HTTP：请求、响应与缓存', id: 'ch05-2' },

    { t: 'p', html: 'HTTP 是「请求-响应」式的文本协议：请求 = 请求行 + 请求头 + 空行 + 可选体，响应 = 状态行 + 响应头 + 空行 + 体。方法决定语义：GET 取资源，安全且幂等；HEAD 只要头；POST 提交数据，不保证幂等；PUT 整体替换，幂等；DELETE 删除，幂等。<br><br>HTTP/1.1 默认<b>持久连接</b>（persistent connection），一条 TCP 连接可连发多条请求，省掉反复握手；代价是同连接上的请求串行：前一个响应慢，后面全等，这就是<b>队头阻塞</b>（head-of-line blocking）。<br><br>HTTP/2 把请求拆成带编号的<b>流</b>（stream），在一条 TCP 连接上多路复用、乱序返回，还压缩了头部；但只要 TCP 丢一个包，所有流一起等重传，阻塞只是从应用层挪到了传输层。HTTP/3 改用 <b>QUIC</b>（基于 UDP），每个流独立重传，丢包只影响自己；TLS 1.3 合入连接建立，复用时可 <b>0-RTT</b> 发数据。代价是 UDP 在部分网络被限速或拦截，中间设备也看不懂 QUIC，排障更难。' },

    { t: 'code', lang: 'http', caption: '一次条件 GET：客户端带着上次的 ETag 来问，服务器回 304 且不带响应体', code: `GET /notes/ch05.html HTTP/1.1
Host: course.example.edu
If-None-Match: "9f2c-4a1"
If-Modified-Since: Wed, 18 Nov 2026 08:00:00 GMT

HTTP/1.1 304 Not Modified
Date: Fri, 20 Nov 2026 02:11:07 GMT
ETag: "9f2c-4a1"
Cache-Control: max-age=600, public` },
    { t: 'table', head: ['族', '常见码', '含义', '最容易误判的地方'], rows: [
      ['2xx', '200 / 206', '成功 / 部分内容（Range 请求）', '206 不是错误，视频拖动进度条就靠它'],
      ['3xx', '301 / 302 / 304 / 307', '重定向、未修改、保持方法的重定向', '304 没有响应体，不是失败；301 会被浏览器长期缓存'],
      ['4xx', '400 / 403 / 404 / 429', '请求错、禁止、不存在、限流', '403 是「认得出你但不许」，不要一律当 401'],
      ['5xx', '500 / 502 / 503 / 504', '服务端错、网关错、过载、网关超时', '502 与 504 往往错在上游，不在收到请求的这一台']
    ], caption: '状态码要记的是「客户端该做什么」，不是编号本身' },

    { t: 'p', html: '缓存要回答三个问题。<b>新不新鲜</b>：<code>Cache-Control: max-age=600</code> 表示 600 秒内直接用，不必回源；<code>no-cache</code> 不是不缓存，而是每次用前必须验证；<code>no-store</code> 才是完全不存。<b>能不能验证</b>：服务器给 <code>ETag</code>（或 <code>Last-Modified</code>），客户端带 <code>If-None-Match</code>（或 <code>If-Modified-Since</code>），没变就回 304，省下整个响应体。<b>谁能存</b>：<code>private</code> 只许浏览器存，<code>public</code> 允许代理缓存（proxy cache）存。代理缓存命中率 90%，源站就只承担十分之一流量。常见错误：把 <code>no-cache</code> 当禁止缓存，每次全量回源；给带 <code>Set-Cookie</code> 的响应配 <code>public</code> 长缓存，把一个人的会话发给所有人。' },

    { t: 'quiz', qid: 'ch05-q1' },

    { t: 'h', lvl: 2, text: '三、DNS：分布式解析', id: 'ch05-3' },

    { t: 'p', html: 'DNS 要解决「名字到地址」的全球规模查询，所以它不能是一张大表，只能把命名空间切成层次。根、顶级域（TLD）、权威服务器（authoritative server）各管一段。<b>根服务器是 13 组逻辑名字</b>（a.root-servers.net 到 m），每组通过 anycast 在全球部署上千个实例，所以「13」不是 13 台机器。根只做一件事：告诉你 <code>.com</code> 或 <code>.edu</code> 的服务器在哪。顶级域再告诉你 <code>example.edu</code> 的权威服务器在哪，权威服务器才持有最终的 A 记录。每一级只被上一级用 NS 记录委派，没有一台机器知道全部名字，这就是「分布式」的含义。' },

    { t: 'steps', items: [
      { title: '第 1 步 · 查本地缓存', html: '浏览器、操作系统、hosts 文件依次查。命中且 TTL 未到就直接用，一个报文都不发。' },
      { title: '第 2 步 · 问递归解析器', html: '通常是运营商或 8.8.8.8 这类递归解析器（recursive resolver）。它替客户端跑腿，自己也缓存结果。' },
      { title: '第 3 步 · 解析器迭代问根', html: '根回一条委派：<code>.edu</code> 的 NS 与地址。注意这一步是<b>迭代查询</b>：根不替你去问下一级。' },
      { title: '第 4 步 · 问顶级域，再问权威', html: '<code>.edu</code> 回 <code>example.edu</code> 的权威 NS；解析器问权威，拿到 <code>www.example.edu</code> 的 A 记录与 TTL。' },
      { title: '第 5 步 · 逐级缓存并返回', html: '解析器按 TTL 缓存答案再给客户端。冷查询约 2–4 个 RTT，热查询 0 个 RTT。' }
    ] },

    { t: 'table', head: ['类型', '作用', '例子', '常见错误'], rows: [
      ['A / AAAA', 'IPv4 与 IPv6 地址', 'www A 203.0.113.7', '只配 A 不配 AAAA，双栈客户端白等超时'],
      ['CNAME', '别名，指向另一个名字', 'cdn CNAME edge.example.net', '在顶点域放 CNAME，与 NS、SOA 冲突'],
      ['MX', '邮件服务器与优先级', 'MX 10 mail.example.edu', '以为数字越大越优先（实际越小越优先）'],
      ['NS / SOA', '委派与区参数', 'example.edu NS ns1.example.edu', '忽略 SOA 的 minimum，否定答案被缓存很久'],
      ['TXT', '任意文本，用于验证与邮件策略', 'SPF、DKIM、域名归属验证', '把长配置塞进 TXT，改动没有审计']
    ], caption: '记录类型记五个就够应付大题：A、AAAA、CNAME、MX、NS' },

    { t: 'callout', kind: 'warn', title: 'UDP 53 不是「永远够用」', html: 'DNS 默认走 UDP 53。早期规定 UDP 响应不超过 <b>512 字节</b>，超了就置 TC 位截断，客户端改用 TCP 53 重问。EDNS0 把可协商的 UDP 载荷提高到 4096 字节，DNSSEC 与多 A 记录才不至于频繁走 TCP。常见故障：防火墙只放行 UDP 53，大响应全部失败，表现为「网页能开、某些域名解析不了」；TTL 设 30 秒让解析器频繁回源，设 7 天又会让换 IP 后一天不生效。' },

    { t: 'quiz', qid: 'ch05-q2' },

    { t: 'h', lvl: 2, text: '四、CDN：把内容搬到离用户更近', id: 'ch05-4' },

    { t: 'p', html: 'CDN 的物理动机只有一条：光速没法谈。深圳到北京约 2000 km，光纤中光速约 2×10<sup>8</sup> m/s，单程 10 ms、往返 20 ms；把副本放到离用户 200 km 的<b>边缘节点</b>（edge node），往返降到 2 ms。一次 HTTPS 首访要 DNS、TCP、TLS、HTTP 四五个 RTT，省下的就是几十到上百毫秒。CDN 做三件事：在边缘缓存静态内容；用调度把用户导向最近且不拥塞的节点；未命中时<b>回源</b>（origin fetch）取内容并按策略缓存。' },

    { t: 'p', html: '调度有两条主流路线。<b>DNS 重定向</b>：把 <code>static.example.com</code> CNAME 到 CDN 的域名，CDN 的权威服务器按解析器位置（或 EDNS Client Subnet 带来的用户子网）返回不同的边缘 IP；粒度受解析器影响，一个省级解析器后面的用户会被导向同一个节点。<b>Anycast</b>：同一个 IP 在多个机房同时宣告，BGP 让每个用户走路由上最近的那台；切换快、粒度细，但受 BGP 收敛影响，也不感知节点负载，需要应用层再兜一层。两条路线常一起用：anycast 做第一跳，DNS 或 HTTP 重定向做第二层微调。' },

    { t: 'table', head: ['指标', '含义', '典型值或算例'], rows: [
      ['命中率（hit ratio）', '边缘直接返回、不回源的比例', '静态站点 90%–98%'],
      ['回源带宽', '总带宽 ×（1 − 命中率）', '1 Gbps × 5% = 50 Mbps'],
      ['首字节时间（TTFB）', '请求发出到收到第一个字节', '边缘命中 20–50 ms，回源 100 ms 以上'],
      ['失效（purge）', '主动清掉边缘副本', '发版后按 URL 或 tag 批量清']
    ], caption: '命中率每掉一个点，回源带宽就多一份，这条账要会算' },

    { t: 'p', html: '把数字算一遍。源站出口 1 Gbps、命中率 95%，回源只需 50 Mbps；命中率掉到 80%，回源变 200 Mbps，源站与骨干链路压力翻四倍——这正是「一次批量 purge 把源站打挂」的机制：所有边缘同时失效，所有请求同时回源，形成缓存雪崩。常见错误还有：把带用户身份的接口放进长缓存；只按地理距离选节点，不看节点负载与 ISP 互联质量；把 <code>max-age</code> 设得比发布周期还长，用户长期看到旧版本。' },

    { t: 'h', lvl: 2, text: '五、P2P 架构：从中心到对等', id: 'ch05-5' },

    { t: 'p', html: 'P2P 不是一种协议，而是一类「资源不放在中心」的组织方式，按「怎么找到资源」可以分三代。<b>集中目录</b>（Napster）：索引放在中心服务器，文件仍在 peer 之间直传；找得快，但中心一挂全网瘫，也最容易惹上官司。<b>非结构化泛洪</b>（Gnutella）：没有索引，查询用 ping 在邻居间转发（flooding），靠 TTL 限制范围；抗单点，但查询流量随规模爆炸，还常常查不到。<b>结构化 DHT</b>：把 key 映射到确定的节点，查询走 O(log N) 跳，代价是要维护路由表、应对节点频繁加入与离开。' },

    { t: 'table', head: ['架构', '索引在哪', '查找代价', '主要问题'], rows: [
      ['集中目录（Napster）', '中心服务器', '一次查询', '单点故障、法律风险、索引成为瓶颈'],
      ['非结构化泛洪（Gnutella）', '没有索引', 'TTL 内广播', '查询流量大、结果不全、容易扑空'],
      ['结构化 DHT（Chord、Kademlia）', '按 key 分布在节点上', 'O(log N) 跳', '维护复杂、NAT 穿透难、只支持精确匹配']
    ], caption: '三代 P2P 的差别不在传输，而在「索引放在哪、怎么找」' },

    { t: 'p', html: '用分发时间把差别量化。设文件大小 F、服务器上行 u<sub>s</sub>、N 个下载者、每人上行 u<sub>i</sub>、下行 d<sub>i</sub>。C/S 的完成时间 T<sub>cs</sub> = max{NF/u<sub>s</sub>, F/min d<sub>i</sub>}，第一项说明人越多越慢。P2P 多了一项：总上行是 u<sub>s</sub> + Σu<sub>i</sub>，所以 T<sub>p2p</sub> = max{F/u<sub>s</sub>, F/min d<sub>i</sub>, NF/(u<sub>s</sub> + Σu<sub>i</sub>)}。取 F = 1 GB = 8000 Mb、u<sub>s</sub> = 100 Mbps、N = 1000、u<sub>i</sub> = 1 Mbps：C/S 为 8×10<sup>6</sup> / 100 = 80000 s，约 22 小时；P2P 为 8×10<sup>6</sup> / 1100 ≈ 7273 s，约 2 小时。' },

    { t: 'callout', kind: 'exam', title: '考「N 变大时谁先撑不住」', html: '标准答法是把三个 max 项分别看。C/S 的第一项 NF/u<sub>s</sub> 随 N 线性增长；P2P 的第三项 NF/(u<sub>s</sub> + N·u) 在 N 很大时趋近 F/u，<b>与 N 无关</b>，只取决于单个 peer 的上行。所以 P2P 的天花板是「最慢那个 peer 的上行」，而不是人数。反过来说，peer 上行极低（比如 0.5 Mbps）时 P2P 也会慢，但总上行 600 Mbps 仍远好于把所有人压在一台 100 Mbps 的服务器上。答出「哪一项主导、随 N 怎么变」，比背公式得分高。' },

    { t: 'h', lvl: 2, text: '六、BitTorrent：分块与 tit-for-tat', id: 'ch05-6' },

    { t: 'p', html: 'BitTorrent 把一个文件切成<b>分块</b>（piece），通常 256 KB 到 4 MB；piece 再切成 16 KB 的 block 在网络上传输，piece 是校验单位、block 是请求单位。<b>torrent 文件</b>是 bencode 字典：<code>announce</code> 给 tracker 地址，<code>info</code> 里有文件名、piece 长度、每块 SHA-1 拼成的 <code>pieces</code> 字符串；<code>info</code> 的 SHA-1 就是 <b>infohash</b>，全局标识这个资源。客户端先向 <b>tracker</b> 要 peer 列表（compact 格式每个 peer 6 字节：4 字节 IP 加 2 字节端口），或通过 DHT、PEX 找 peer，再与 peer 建立 TCP 连接。' },

    { t: 'steps', items: [
      { title: '握手与位图', html: '先发 19 字节的 <code>BitTorrent protocol</code> 前缀、8 字节保留位、20 字节 infohash、20 字节 peer id；infohash 不一致直接断开。随后互发 <code>bitfield</code>，之后用 <code>have</code> 增量通知。' },
      { title: '选块：rarest-first', html: '在「对方有、我没有」的集合里，优先选<b>本地已知副本最少</b>的 piece，让稀有块尽快扩散，避免最后所有人都缺同一块。' },
      { title: '请求与校验', html: '按 16 KB 发 <code>request</code>，收到 <code>piece</code> 后算 SHA-1；对不上就丢弃，并降低该 peer 的评分。' },
      { title: 'tit-for-tat 换 unchoke', html: '每 <b>10 秒</b>重算一次，按「我给它上传的速率」排序，给前 <b>4</b> 名发 <code>unchoke</code>，其余 <code>choke</code>。' },
      { title: '乐观 unchoke 与 seeding', html: '每 <b>30 秒</b>随机 unchoke 一个 peer，给它 30 秒表现机会；下载完成后继续上传，成为 seeding 节点。' }
    ] },

    { t: 'p', html: 'tit-for-tat 的关键是<b>按「我给对方的速率」排名，而不是「对方给我的速率」</b>。上传是稀缺资源，谁对我有用我就先给谁；对方想继续拿数据，就得反过来给我。在重复博弈里这样合作是稳定策略，只下载不贡献的搭便车者会被 choke 掉。乐观 unchoke 是打破僵局的那一手：如果所有人都只跟已经交换过的 peer 玩，新节点永远没有机会证明自己；随机给一个名额，既探测更快的 peer，也让新节点有起点。常见错误：把 rarest-first 说成省带宽（它省不了带宽，是为了均衡副本、提高稀有块的可用性）；把乐观 unchoke 说成 NAT 穿透（它是激励层的探测）；把 piece 设成 16 KB（那是 block 的大小，piece 太小会让哈希与请求开销压过有效载荷）。' },

    { t: 'quiz', qid: 'ch05-q3' },

    { t: 'h', lvl: 2, text: '七、DHT 与 Chord', id: 'ch05-7' },

    { t: 'p', html: 'DHT 的核心是「把 key 放到确定的节点上」。<b>一致性哈希</b>（consistent hashing）把节点与 key 都哈希到同一个 m 位标识空间，首尾相接成环。key 归它的<b>后继</b>（successor）：环上第一个标识不小于 key 的节点。这样加一台机器只影响它旁边的一段，平均只搬 1/N 的数据；而取模哈希在节点数变化时会搬走几乎全部数据。Chord 常取 m = 160（SHA-1），节点标识可以是 <code>IP:port</code> 的哈希，也可以随机生成。' },

    { t: 'table', head: ['概念', '定义', '作用'], rows: [
      ['successor(k)', '环上第一个标识不小于 k 的节点', '决定 key 归谁存'],
      ['predecessor', '环上的前一个节点', '加入时确定新节点接管哪段 key'],
      ['finger[i]', '指向 succ(n + 2<sup>i−1</sup>)，i = 1 到 m', '每跳至少减半距离，形成 O(log N) 查找'],
      ['join', '新节点查 succ(n)，接管前驱里属于它的 key', '只改邻居指针，数据搬动有界'],
      ['stabilize', '周期性核对后继与前驱', '应对并发加入、离开与失效']
    ], caption: 'finger 表是 Chord 的全部魔法：把「线性走环」变成「指数逼近」' },

    { t: 'p', html: '查找时，节点先看 key 是否落在自己与后继之间；不是就查 finger 表，跳到「不超过 key 的最远节点」，每跳至少把剩余距离减半，所以 N 个节点约需 log<sub>2</sub>N 跳：N = 1000 时约 10 跳，N = 10<sup>6</sup> 时约 20 跳。加入时，新节点 n 通过任意已知节点查 succ(n)，把自己的后继指过去、让前驱改指自己，并接管原本属于后继但标识小于 n 的那段 key；其它节点的 finger 表由 stabilize 逐步修正。常见错误：finger 表第 i 项写成 n + 2<sup>i</sup>（差一位，应为 2<sup>i−1</sup>）；把 O(log N) 当成消息数（查找是 O(log N) 跳、每跳一个 RTT，加入维护是 O(log<sup>2</sup>N) 条消息）。' },

    { t: 'code', lang: 'python', caption: '查找与 finger 表构造：每次只往前跳，不会跳过头', code: `# 节点 n 上查找 key k 的后继（伪代码）
def find_successor(n, k):
    if between(n.id, k, n.successor.id):        # k 落在 n 与后继之间
        return n.successor
    n2 = closest_preceding_finger(n, k)         # 最大的 finger.id 小于 k
    return find_successor(n2, k)

# finger 表：i 从 1 到 m
finger[i].start = (n.id + 2 ** (i - 1)) % (2 ** m)
finger[i].node  = find_successor(n, finger[i].start)` },

    { t: 'h', lvl: 2, text: '八、应用层协议设计要点', id: 'ch05-8' },

    { t: 'table', head: ['要点', '做法', '常见错误'], rows: [
      ['消息边界', '长度前缀（BitTorrent 的 4 字节），或头部加长度（Content-Length、chunked）', '假设一次 read 就是一条完整消息，遇到半包与粘包就解析错位'],
      ['幂等与重试', 'GET、PUT、DELETE 设计成幂等；POST 用 Idempotency-Key 去重', '超时后无脑重试，重复下单、重复扣款'],
      ['版本兼容', '字段可选、未知字段忽略、用 /v2 或 content-type 协商', '给旧客户端加必填字段，升级当天全线报错'],
      ['安全', '全程 TLS、认证与授权分离、输入校验、限流', '把 token 放在 URL 查询串里，随日志与 Referer 泄漏'],
      ['可观测性', 'request-id 贯穿调用链、结构化日志、延迟分位数', '只看平均延迟，p99 已经爆了还不知道'],
      ['背压与流控', '窗口或信用机制、队列上限、429 加 Retry-After', '无上限队列，过载时延迟雪崩而不是快速失败']
    ], caption: '这六条是设计评审的检查表，也是「为什么这个协议难用」的答案' },

    { t: 'p', html: '先把最容易翻车的一条讲透：TCP 是<b>字节流</b>，没有消息概念。发送方两次 <code>send</code> 可能在接收方一次 <code>recv</code> 里出现（粘包），也可能一条消息分三次到达（半包）。所以协议必须自己定义边界：要么在消息前放固定长度的长度字段，读到长度再读正文；要么用分隔符并处理转义；要么像 HTTP/1.1 那样用头部的 <code>Content-Length</code> 或 <code>Transfer-Encoding: chunked</code>。UDP 虽然保留报文边界，但会丢、会乱序、还有 64 KB 上限，不能拿来当「省事的 TCP」。' },

    { t: 'p', html: '第二条是<b>幂等</b>（idempotent）：网络超时只说明「没收到答复」，不说明「对方没执行」。所以支付、下单这类接口要么设计成幂等（同一个请求 id 重复提交只生效一次），要么由客户端生成去重键。第三条是<b>版本兼容</b>：协议的寿命远长于一次发布，新增字段必须可选、旧实现必须忽略不认识的字段，破坏性变更走新版本而不是改语义。HTTP 本身无状态，会话靠 <b>Cookie</b>：服务器用 <code>Set-Cookie</code> 种一个键值，浏览器后续请求自动带 <code>Cookie</code> 头；代价是每个请求都要发一遍，别把大对象塞进去，而且客户端可以改 Cookie，服务端必须校验签名。第四条是安全与可观测性，两者都不是「以后再补」的功能：认证、限流、request-id、延迟分位数，第一版就得留位置，否则出故障时既查不到也拦不住。' },

    { t: 'terms', items: [
      { en: 'application-layer protocol', zh: '应用层协议', html: '定义报文类型、语法、语义与时序的约定；HTTP、DNS、BitTorrent 是三种不同形态。' },
      { en: 'persistent connection', zh: '持久连接', html: 'HTTP/1.1 默认在一条 TCP 连接上连发多条请求，省掉重复握手；代价是同连接串行。' },
      { en: 'conditional GET', zh: '条件 GET', html: '带 If-None-Match 或 If-Modified-Since 的请求；未修改时服务器回 304，不传正文。' },
      { en: 'recursive resolver', zh: '递归解析器', html: '替客户端跑完整条查询链并缓存结果的服务器，客户端只与它对话一次。' },
      { en: 'anycast', zh: '任播', html: '同一地址在多地宣告，路由把用户带到最近实例；CDN 与根服务器都靠它就近接入。' },
      { en: 'tit-for-tat', zh: '一报还一报', html: 'BitTorrent 的上传激励：按自己给对方的速率排名，前 4 名 unchoke，每 10 秒重算。' },
      { en: 'consistent hashing', zh: '一致性哈希', html: '节点与 key 映射到同一环，key 归后继；增删节点只搬相邻区间的数据。' },
      { en: 'backpressure', zh: '背压', html: '下游处理不过来时向上游传「慢一点」的信号，避免队列无限增长后延迟雪崩。' }
    ] },

    { t: 'keypoint', items: [
      { title: '协议四要素', html: '报文类型、语法、语义、时序；缺任何一项，两端就只能各自猜。' },
      { title: 'HTTP 缓存的三问', html: '新鲜度看 max-age，验证看 ETag 与 Last-Modified，可见性看 private、public 与 no-store。' },
      { title: '队头阻塞换了三次位置', html: 'HTTP/1.1 在应用层串行；HTTP/2 用 stream 多路复用，但 TCP 丢包仍阻塞全部流；HTTP/3 用 QUIC 的独立流解决。' },
      { title: 'DNS 的快靠缓存，稳靠层次', html: '13 组根、TLD 委派、权威持有最终记录；UDP 53，超过 512 字节靠 EDNS0 或 TCP。' },
      { title: 'P2P 把瓶颈搬到 peer 上行之和', html: '分发时间的第三项在 N 大时趋近 F/u，与人数无关；BitTorrent 用 rarest-first 均衡副本、用 tit-for-tat 维持合作。' },
      { title: 'Chord 用 finger 表压到 O(log N)', html: 'finger[i] 指向 succ(n + 2 的 i−1 次方)；加入只影响邻居，stabilize 逐步修正路由。' }
    ] },

    { t: 'checklist', id: 'ch05', items: [
      '我能说出应用层协议的四个要素，并用 HTTP 与 DNS 各举一例',
      '我能写出完整的 HTTP 请求行、请求头与空行，并说明 GET 与 PUT 的幂等差异',
      '我能解释 304 与 200 的区别，以及 ETag 与 Last-Modified 各自怎么用',
      '我能说清 no-cache 与 no-store 的区别，并指出「no-cache 就是不许缓存」错在哪',
      '我能画出一次冷 DNS 查询的迭代路径，标出根、TLD、权威各回答了什么',
      '我知道 UDP 53 的 512 字节限制与 EDNS0 的作用，能解释「网页能开但某些域名解析失败」',
      '我能比较 DNS 重定向与 anycast 两种 CDN 调度，并算一次命中率变化对回源带宽的影响',
      '我能写出 C/S 与 P2P 的分发时间公式，并说明 N 增大时哪一项主导',
      '我能解释 rarest-first 与 tit-for-tat 各解决什么问题，并说出 10 秒与 30 秒两个周期',
      '我能用 finger 表手算一次 Chord 查找，并说明加入节点时哪些 key 会搬家'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章覆盖 <code>CSC4303_09_p2p.pdf</code> 的 P2P 三种架构（集中目录、非结构化泛洪、结构化 DHT）、BitTorrent 的分块与激励机制、Chord 的标识环与 finger 表；覆盖 <code>11_application.pdf</code> 的应用层协议要素、HTTP 方法与缓存、DNS 层次与记录类型、CDN 的调度与回源；原始论文 <code>chord_sigcomm.pdf</code> 提供一致性哈希、O(log N) 查找与加入协议的推导。文中数字（piece 256 KB–4 MB、10 秒与 30 秒两个周期、根服务器 13 组逻辑名字、UDP 512 字节）取自讲义与对应 RFC 的通行取值，考试以课堂讲义与作业说明为准。' }
  ]
});
