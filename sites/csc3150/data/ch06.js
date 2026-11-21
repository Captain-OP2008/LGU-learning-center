/* =====================================================================
 * ch06.js · 第 6 章「文件系统与持久化：从 inode 到崩溃一致」
 * 职责：把「文件」拆成 inode 与块，再讲清崩溃时怎么不丢数据。
 * 依据：xv6 教材第 8 章（File system）+ 课程 Tutorial 6 与 AS4 相关材料
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch06',
  num: '06',
  title: '文件系统与持久化：从 inode 到崩溃一致',
  en: 'FILE SYSTEMS & CRASH CONSISTENCY',
  goals: [
    '说出 inode 里必须记录的至少六个字段，并解释为什么文件名不放在 inode 里',
    '给定逻辑块号，算出它落在直接块还是间接块，并判断是否超出上限',
    '描述 xv6 日志的四步提交协议，指出哪一步是「提交点」',
    '解释为什么 <code>write</code> 返回成功不等于数据已经落盘',
    '列出三种「看似原子、实际不原子」的文件操作并给出正确做法'
  ],
  kp: [
    { id: 'ch06-1', title: '为什么需要文件系统' },
    { id: 'ch06-2', title: 'inode：文件的一切元数据' },
    { id: 'ch06-3', title: '目录、路径解析与硬链接' },
    { id: 'ch06-4', title: '文件描述符与打开文件表' },
    { id: 'ch06-5', title: '磁盘布局：超级块、位图、inode 区' },
    { id: 'ch06-6', title: '崩溃一致性：日志的四步提交' },
    { id: 'ch06-7', title: '性能：缓存、预读与 fsync' },
    { id: 'ch06-8', title: '常见错误与自检' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么这章一半在讲崩溃', html: '文件系统的难点不在「怎么存」，而在「断电时会怎样」。磁盘是按扇区写的，一次写多个块不是原子的；而「创建一个文件」至少要改四个地方。如果改到一半断电，磁盘上就留下一个自相矛盾的状态——inode 存在但目录里没有它，或者位图说这块空闲但 inode 正在用。<b>日志的全部目的，就是让「一半」这个状态不可能出现</b>。' },

    { t: 'p', lead: true, html: '本章从用户看到的「文件」出发，一层层往下拆：文件名怎么变成 inode、inode 怎么找到数据块、数据块怎么避免在崩溃时丢失。拆到底之后，你会发现文件系统的每个设计决策几乎都是为了在「性能」与「崩溃一致性」之间找一个可接受的平衡点。' },

    { t: 'h', lvl: 2, text: '一、为什么需要文件系统', id: 'ch06-1' },

    { t: 'p', html: '磁盘本身只提供「按块号读写固定大小的块」。如果让每个程序自己决定把数据写在哪，会有三个后果：不知道哪些块空闲、无法按名字找到数据、一个程序的 bug 会覆盖另一个程序的数据。文件系统就是在裸块设备上加了三样东西：<b>命名</b>（用路径找到内容）、<b>分配</b>（记录哪些块属于谁）、<b>保护</b>（权限与隔离）。' },

    { t: 'p', html: '抽象层次也要分清。<b>块设备</b>提供 <code>read/write</code> 固定块；<b>文件系统</b>提供文件、目录、路径；<b>虚拟文件系统</b>（VFS）把 ext4、FAT、网络文件系统统一成同一套 <code>open/read/write</code> 接口。xv6 只有一层简单实现，但它已经具备 inode、目录、位图、日志这些必要零件。' },

    { t: 'p', html: '一个常被忽略的事实：<b>文件系统自己也占空间，而且它的元数据比数据更关键</b>。数据块丢了只是少一段内容，超级块或位图丢了可能整个卷都读不出来。所以真实文件系统会把超级块做多副本，并在挂载时校验。' },

    { t: 'h', lvl: 2, text: '二、inode：文件的一切元数据', id: 'ch06-2' },

    { t: 'p', html: 'inode（index node）是文件系统里描述一个文件的结构，包含：<b>类型</b>（普通文件、目录、设备）、<b>大小</b>、<b>权限与属主</b>、<b>时间戳</b>、<b>链接计数</b>、以及<b>数据块的位置</b>。它<b>不包含文件名</b>——名字属于目录，一个 inode 可以有多个名字（硬链接）。' },

    { t: 'code', lang: 'c', caption: 'xv6 的 dinode：12 个直接块 + 1 个间接块', code: '#define NDIRECT 12\n#define NINDIRECT (BSIZE / sizeof(uint))\n\nstruct dinode {\n  ushort type;                 // 0 空闲、1 目录、2 文件\n  short nlink;                 // 硬链接数，为 0 才真正释放\n  uint size;                   // 字节数\n  uint addrs[NDIRECT + 1];     // 前 12 个直接块，最后一个是间接块\n};' },

    { t: 'p', html: '为什么不全用直接块？因为每个 inode 大小固定，不能无限加字段。为什么不全用间接块？因为小文件读一次要两次访存（先读间接块再读数据）。折中方案就是<b>前 12 个块直接指，超出的部分用间接块</b>：小文件零额外开销，大文件也有扩展空间。真实系统用三级间接或 extent（一段连续块用「起始 + 长度」表示），后者更适合大文件与 SSD。' },

    { t: 'p', html: '算一下 xv6 的文件上限：块大小 <code>BSIZE = 1024</code> 字节，一个间接块能装 <code>1024/4 = 256</code> 个块号，所以最大文件是 <code>(12 + 256) × 1024 = 268 KiB</code>。要访问逻辑块 100：因为 100 ≥ 12，落在间接块的第 <code>100 − 12 = 88</code> 项。逻辑块 300 就超限了，<code>bmap</code> 会返回错误。' },

    { t: 'h', lvl: 2, text: '三、目录、路径解析与硬链接', id: 'ch06-3' },

    { t: 'p', html: '目录在文件系统里就是一个特殊文件，内容是若干个目录项。xv6 的目录项只有两个字段：inode 号与名字（最长 14 字节）。<b>「用名字找文件」的过程就是在这个特殊文件里线性查找</b>，找到 inum 之后再去 inode 区取元数据。' },

    { t: 'code', lang: 'c', caption: '路径解析：逐段查目录，最后一段交给调用者决定怎么用', code: 'struct inode *namei(char *path) {\n  struct inode *dp = namex(path, 0);   // 逐段解析，返回最后一段的父目录\n  return dirlookup(dp, name, 0);       // 在父目录里找最后一段\n}\n\nstruct inode *namex(char *path, int nameiparent) {\n  struct inode *ip = root_inode();\n  while ((p = skipelem(path, name)) != 0) {\n    ilock(ip);\n    if (ip->type != T_DIR) panic("namex: not dir");\n    if (nameiparent &amp;&amp; *path == 0) { iunlock(ip); return ip; }\n    struct inode *next = dirlookup(ip, name, 0);\n    iunlockput(ip);\n    if (next == 0) return 0;           // 某一段不存在\n    ip = next;\n  }\n  return ip;\n}' },

    { t: 'p', html: '两条路径细节很重要。<b>第一，绝对路径从根 inode 开始，相对路径从当前工作目录的 inode 开始</b>；<code>cwd</code> 是 <code>proc</code> 结构里的一个 inode 指针，所以进程切换目录不改变文件系统本身。<b>第二，<code>..</code> 与 <code>.</code> 不是特例</b>，它们是目录里真实存在的目录项，分别指向父目录与自己（根目录的 <code>..</code> 指向自己）。' },

    { t: 'p', html: '硬链接就是让多个目录项指向同一个 inode，inode 里的 <code>nlink</code> 记录有几个名字。创建用 <code>link</code>（nlink 加一），删除用 <code>unlink</code>（nlink 减一）。<b>只有 nlink 归零且没有进程打开它时，数据块才真正释放</b>——所以「删除了文件但磁盘没变空」是正常的，有进程还握着它。软链接（symbolic link）则是一个存着路径的独立文件，可以跨文件系统，也可以指向不存在的目标。' },

    { t: 'h', lvl: 2, text: '四、文件描述符与打开文件表', id: 'ch06-4' },

    { t: 'p', html: '用户拿到的 <code>fd</code> 是一个小整数，它是进程内<b>文件描述符表</b>的下标。表里每一项指向系统级的<b>打开文件表</b>（struct file），后者记录偏移、读写模式与指向的 inode。同一个 inode 可以被多个 struct file 指向，各自有独立偏移。' },

    { t: 'table', head: ['层次', '存放位置', '内容', '共享情况'], rows: [
      ['fd 表', '每个进程', '下标 → struct file', 'fork 时复制，父子各有一份'],
      ['struct file', '内核全局', '偏移、模式、引用计数、inode 指针', 'dup 与 fork 后共享同一份'],
      ['inode（内存副本）', '内核全局缓存', '类型、大小、块地址、锁', '全系统共享，按 inode 号索引'],
      ['dinode', '磁盘', '持久化的元数据', '重启后重建内存副本']
    ], caption: '三层结构决定了两件相反的事：fork 后共享偏移，但 fd 表是各自独立的' },

    { t: 'p', html: '这三层解释了几个常见现象。<b><code>dup(1)</code> 之后两个 fd 共享偏移</b>：往 fd 2 写会接着 fd 1 的位置。<b><code>fork</code> 之后父子共享偏移</b>：因为 struct file 的引用计数加一，两边指向同一份。<b>打开两次同一个文件则各自有独立偏移</b>：两个 struct file。想避免混淆就用 <code>pread</code>/<code>pwrite</code>，它们带显式偏移、不改变文件当前位置。' },

    { t: 'code', lang: 'c', caption: 'xv6 的 filewrite：偏移存在 struct file 里，写前先做上限检查', code: 'int filewrite(struct file *f, uint64 addr, int n) {\n  int r, ret = 0;\n  if (f->writable == 0) return -1;\n  if (f->type == FD_PIPE)\n    return pipewrite(f->pipe, addr, n);\n  if (f->type == FD_INODE) {\n    ilock(f->ip);\n    if ((r = writei(f->ip, 1, addr, f->off, n)) &gt; 0)\n      ret = r;\n    iunlock(f->ip);\n    f->off += r;                 // 只有这一处推进偏移\n  }\n  return ret;\n}' },

    { t: 'h', lvl: 2, text: '五、磁盘布局：超级块、位图、inode 区', id: 'ch06-5' },

    { t: 'p', html: 'xv6 把磁盘（或一个分区）切成固定区域：<b>block 0</b> 是引导块（不用），<b>block 1</b> 是超级块（记录总块数、数据块数、inode 数、日志区位置），之后是<b>日志区</b>、<b>inode 位图</b>（哪些 inode 空闲）、<b>数据位图</b>（哪些块空闲）、<b>inode 区</b>（连续存放所有 dinode），最后是<b>数据区</b>。' },

    { t: 'p', html: '拿到一个 inode 号 <code>inum</code>，它在 inode 区的位置是 <code>IBLOCK(inum, sb)</code>，块内偏移是 <code>(inum % IPB) × sizeof(struct dinode)</code>，其中 <code>IPB = BSIZE / sizeof(struct dinode)</code>。这类「编号 → 位置」的换算在文件系统代码里到处都是，<b>写错一个偏移就整个卷损坏</b>，所以 xv6 用宏把公式集中定义。' },

    { t: 'p', html: '位图是分配器的记账本：一位代表一个 inode 或一个数据块，0 空闲、1 已用。<code>balloc</code> 扫描找 0 并置 1，<code>bfree</code> 反向操作。<b>位图与 inode 内容必须同时正确，否则会出现「两个文件共用一块」或「块永远找不回来」</b>。这也是日志必须同时保护位图与 inode 的原因。' },

    { t: 'h', lvl: 2, text: '六、崩溃一致性：日志的四步提交', id: 'ch06-6' },

    { t: 'p', html: '假设创建文件要改四个块：inode 位图、新 inode、目录数据、目录 inode 的大小。如果写完前两个就断电，重启后会看到一个「有 inode 但目录里没有它」的孤儿——它占着空间却无人能访问。反过来如果先改目录再改 inode，就会看到目录项指向一个未使用的 inode，访问直接崩溃。<b>无论哪种顺序，只要不是原子地改完四个块，就有坏状态</b>。' },

    { t: 'p', html: '日志（journaling）的思路是「先把要改的内容写到一个固定区域，再一次性确认，最后慢慢写到原位」。xv6 的协议分四步：' },

    { t: 'steps', items: [
      { title: '① 写日志', html: '<code>begin_op</code> 之后所有 <code>writei</code> 都走 <code>log_write</code>，把块内容复制到日志区，并在内存里记录「这个块被改过」。同一个块多次修改只记一次。' },
      { title: '② 写提交块', html: '<code>commit</code> 时先把日志里的块全部写到磁盘，再写日志头（记录这次事务包含几个块、哪些块）。<b>日志头落盘的那一刻就是提交点</b>：此后即使断电，重启也能重放。' },
      { title: '③ 安装', html: '<code>install_trans</code> 把日志里的块逐个写回它们在文件系统中的真实位置。这一步可以慢慢做，中途断电也无妨——重启后会从头重放。' },
      { title: '④ 清日志头', html: '写一个 <code>n = 0</code> 的头，表示这次事务完成，日志区可以复用。清完才算真正结束。' }
    ] },

    { t: 'p', html: '恢复逻辑非常短：启动时若日志头 <code>n &gt; 0</code>，说明上次没提交完，<b>把日志里的块重放到原位</b>，然后清头。不需要判断「哪些块已经写过了」——重放是幂等的，写两遍结果相同。这个「幂等重放」的思想是崩溃恢复的核心，比试图判断「做到哪一步」要可靠得多。' },

    { t: 'code', lang: 'c', caption: 'xv6 的 commit：先落数据，再落头，顺序不能反', code: 'void commit() {\n  if (log.outstanding &lt; 1) panic("commit");\n  write_log();          // ① 日志块写盘\n  write_head();         // ② 提交点：头写盘后事务不可撤销\n  install_trans(0);     // ③ 写到 home location\n  log.lh.n = 0;\n  write_head();         // ④ 清头\n}' },

    { t: 'h', lvl: 2, text: '七、性能：缓存、预读与 fsync', id: 'ch06-7' },

    { t: 'p', html: '日志的代价是每个块写两遍（先日志后原位），吞吐会下降。真实系统用延迟写、批量提交（把多个小事务合成一个）、以及「只记录元数据」的方式降低开销。xv6 也做了合并：<code>begin_op</code> 期间多个系统调用的修改进同一个事务，减少提交次数。' },

    { t: 'p', html: '另一大性能来源是<b>缓冲缓存</b>（buffer cache）：读过的块留在内存，写过的块延迟写回。xv6 的 <code>bread</code>/<code>bwrite</code> 就是这层，用 LRU 淘汰，并靠 <code>sleeplock</code> 保证一个块同时只有一个写者。它带来两个必须理解的结果：<b>读可能不碰磁盘</b>，<b>写可能还没落盘</b>。' },

    { t: 'p', html: '所以 <code>write</code> 返回 0 只代表「数据进了内核缓冲区」，断电仍可能丢。要真正落盘必须 <code>fsync(fd)</code>，它等到数据与元数据都稳定。数据库与 git 这类程序都大量使用 fsync，这也是它们比普通写慢得多的原因。<b>「持久化」是一个需要显式请求的动作，不是一个自动保证</b>。' },

    { t: 'p', html: '顺带说清三个常见优化：<b>预读</b>（发现顺序访问就提前读下一块）、<b>延迟分配</b>（先记账再真正分配块，让连续写能聚成大片）、<b>批量提交</b>（多个事务一次提交）。它们都在拿「崩溃时可能丢一点」换「快很多」，所以文件系统必须提供 <code>fsync</code> 这样的逃生口让应用自己决定。' },

    { t: 'h', lvl: 2, text: '八、常见错误与自检', id: 'ch06-8' },

    { t: 'compare', left: { title: '以为原子，其实不是', html: '<code>rename</code> 在单机上通常原子，但跨文件系统不保证；<code>create + write</code> 两步之间断电会留下空文件；「先写临时文件再 rename」是常见补救，但仍需目录 fsync。' }, right: { title: '以为持久，其实不是', html: '<code>write</code> 返回只说明进了页缓存；<code>close</code> 也不保证落盘；只有 <code>fsync</code> 或 <code>O_SYNC</code> 才等到稳定存储。' } },

    { t: 'table', head: ['错误', '后果', '正确做法'], rows: [
      ['把 fsync 当可选优化', '断电后数据丢失，日志也可能不全', '关键数据写完显式 fsync，目录也要'],
      ['以为文件名存在 inode 里', '无法理解硬链接与重命名', '名字在目录项，inode 只记 nlink'],
      ['unlink 后以为空间立刻回收', '磁盘不释放，实际被打开的文件占着', '等所有 fd 关闭后引用计数归零才释放'],
      ['忘记 close 导致 fd 泄漏', '进程 fd 表耗尽，后续 open 全部失败', '每个 open 都要有对应的 close'],
      ['只用直接块算文件上限', '算错最大文件大小', '12 个直接块 + 256 个间接项 = 268 KiB'],
      ['崩溃后手工修超级块', '可能把可恢复的卷改坏', '先用 fsck 或让日志重放，再考虑人工']
    ], caption: '前两条是概念错误，中间两条是工程习惯，最后两条是救火现场' },

    { t: 'p', html: '还有一个概念要澄清：<b>日志保护的是「元数据一致性」，不是「你的数据不丢」</b>。默认的 data=ordered 模式下，数据块先于元数据落盘，保证「引用的数据已经存在」；但如果你写了一个文件又没有 fsync，断电后仍可能得到空文件。想要更强保证就得让日志连数据一起记（data=journal），代价是吞吐再降一半。' },

    { t: 'quiz', qid: 'ch06-q1' },
    { t: 'quiz', qid: 'ch06-q2' },
    { t: 'quiz', qid: 'ch06-q3' },

    { t: 'terms', items: [
      { en: 'inode', zh: '索引节点', html: '描述文件元数据与数据块位置的结构，不含文件名。' },
      { en: 'dentries / dirent', zh: '目录项', html: '目录文件里的条目，记录名字与 inode 号。' },
      { en: 'hard link', zh: '硬链接', html: '多个目录项指向同一 inode，靠 nlink 计数管理生命周期。' },
      { en: 'journaling', zh: '日志', html: '先写日志再写原位，用重放保证崩溃后一致。' },
      { en: 'commit point', zh: '提交点', html: '日志头落盘的时刻，此后事务一定可重放。' },
      { en: 'buffer cache', zh: '缓冲缓存', html: '内核缓存磁盘块，读可能免访盘、写可能未落盘。' },
      { en: 'fsync', zh: '同步落盘', html: '等待数据与元数据真正写入稳定存储后才返回。' }
    ] },

    { t: 'keypoint', items: [
      { title: '名字在目录，元数据在 inode', html: '硬链接因此成立：一个 inode 可以有多个名字，nlink 管生命周期。' },
      { title: '12 + 256 决定文件上限', html: '268 KiB 是 xv6 的硬限制，逻辑块 300 直接超界。' },
      { title: '日志头的写入是提交点', html: '之前崩溃等于没做，之后崩溃可以完整重放。' },
      { title: '重放必须幂等', html: '不判断做到哪一步，直接重写所有日志块。' },
      { title: 'write 不等于落盘', html: '只有 fsync 才等到稳定存储；日志保的是一致性不是数据。' }
    ] },

    { t: 'checklist', id: 'ch06', items: [
      '我能列出 inode 里至少六个字段，并解释为什么没有文件名',
      '我能算出 xv6 的最大文件大小，并指出逻辑块 100 落在哪一项',
      '我能描述路径解析的循环，并说清 <code>..</code> 与 <code>.</code> 是怎么实现的',
      '我能区分 fd 表、struct file、inode 三层，并解释 dup 与 open 两次的差异',
      '我能画出磁盘布局的六个区域及其顺序',
      '我能复述日志四步，并指出哪一步是提交点',
      '我能解释为什么重放不需要判断「做到哪一步」',
      '我能说清 fsync 与 write 的区别，并给出一个必须 fsync 的场景',
      '我知道日志保护一致性与保护数据是两件不同的事'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 xv6 教材第 8 章（File system）组织，<code>dinode</code>、<code>namex</code>、<code>filewrite</code>、<code>commit</code> 代码取自 xv6-riscv 的 <code>fs.h</code>、<code>fs.c</code>、<code>file.c</code>、<code>log.c</code> 并做了简化；inode 与目录的抽象、硬链接与软链接的差异属通用教材内容，参考课程 Tutorial 6 与 Assignment 4 的说明材料。文件上限按 <code>BSIZE = 1024</code>、<code>NDIRECT = 12</code> 计算，若换成 4 KiB 块则上限变为 1 MiB 量级。本章不涉及 ext4 的 extent 树、写时复制文件系统（ZFS/btrfs）与分布式一致性，考试若涉及需另查资料。' }
  ]
});
