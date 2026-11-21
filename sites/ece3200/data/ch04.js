/* =====================================================================
 * ch04.js · 第 4 章「2D 与 2.5D：精灵、相机与关卡节奏」
 * 职责：从精灵与排序讲起，覆盖正交相机、2D 物理、Tilemap 拼图、2.5D 三种实现
 *       路线，最后落到关卡节奏与可读性——即「怎么排出一关好玩又能看懂」。
 * 依据：Lab 3–5 Guidance、Lab 5 讲义（Introduction to 2.5D game design）与 RPG 素材包。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch04',
  num: '04',
  title: '2D 与 2.5D：精灵、相机与关卡节奏',
  en: '2D & 2.5D',
  goals: [
    '用 SpriteRenderer 的 Sorting Layer 与 Order in Layer 控制前后关系，不再靠改 Z 值碰运气',
    '正确配置正交相机，掌握 Size、Aspect 与像素完美三者的关系',
    '用 Rigidbody2D 与 Collider2D 做 2D 角色控制，并知道它与 3D 物理的关键差别',
    '用 Tilemap 搭出一段有关卡节奏的 2D 关卡，并说明教学、变化、考验三段的结构',
    '说出 2.5D 的三条实现路线，并为自己项目选定一条并说明理由',
    '用视差、引导光与危险预告提高关卡可读性，让玩家不用文字也知道该往哪走'
  ],
  kp: [
    { id: 'ch04-1', title: '精灵、排序与像素完美' },
    { id: 'ch04-2', title: '正交相机与画面构图' },
    { id: 'ch04-3', title: '2D 物理：Rigidbody2D 与碰撞体' },
    { id: 'ch04-4', title: 'Tilemap 与关卡拼装' },
    { id: 'ch04-5', title: '2.5D 的三条实现路线' },
    { id: 'ch04-6', title: '视差、纵深与场景层次' },
    { id: 'ch04-7', title: '关卡节奏：教学、变化、考验' },
    { id: 'ch04-8', title: '可读性与玩家引导' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '2D 不是「3D 少一个轴」', html: '很多人以为 2D 只是把 Z 轴锁死，结果一上手就遇到三个新问题：<b>谁挡谁</b>（渲染顺序）、<b>镜头看到多少</b>（正交相机的大小与宽高比）、<b>手感怎么来</b>（没有第三个维度，跳跃与冲刺的时机成了全部）。2.5D 更微妙：画面是三维的，玩法却常常是二维的，两者之间的错位正是乐趣与 bug 的共同来源。这一章把这三件事讲透。' },

    { t: 'p', lead: true, html: '本章沿着 Lab 3–5 的路线走：先建立 2D 的视觉基础（精灵与相机），再做 2D 的物理与关卡（碰撞体与 Tilemap），接着讨论 2.5D 的三条实现路线与视差，最后回到设计——怎样排出一关有节奏、能读懂、不需要文字解释的关卡。' },

    { t: 'h', lvl: 2, text: '一、精灵、排序与像素完美', id: 'ch04-1' },

    { t: 'p', html: '2D 里的一切视觉都是<b>精灵（Sprite）</b>：一张贴图加一个矩形，由 <code>SpriteRenderer</code> 画到屏幕上。因为精灵都是平面的，前后关系不能靠 Z 坐标（虽然也能用，但会与相机裁剪冲突），Unity 提供了专门的排序机制：<b>Sorting Layer</b> 决定大层（背景、地面、角色、前景、UI），<b>Order in Layer</b> 决定同层内的先后（数值大的画在上面）。' },

    { t: 'p', html: '实践上建议一开始就把 Sorting Layer 定好：<code>Background</code>、<code>Midground</code>、<code>Ground</code>、<code>Character</code>、<code>Foreground</code>、<code>FX</code>。角色在 <code>Character</code> 层内用 Order 表示前后（越靠下越靠前，模拟俯视），敌人与玩家共用同一层，这样谁在前面由 Y 坐标决定，视觉上才自然。用 Z 值排序在正交相机下也能跑，但一旦加了后处理或换相机就会出问题。' },

    { t: 'table', head: ['需求', '做法', '不要这样做'], rows: [
      ['角色挡住背景', 'Sorting Layer 设为 Character，高于 Ground', '改 Z 值为 −1，与相机 near clip 打架'],
      ['角色之间按位置前后', 'Order in Layer = −Mathf.RoundToInt(y * 100)', '所有角色同一 Order，重叠时闪烁'],
      ['粒子在角色之上', '粒子渲染器 Sorting Layer 设 FX', '把粒子挂在角色子对象上就以为在上面'],
      ['血条永远在最上', '单独一层 UI，或用 World Space Canvas 加高 Order', '与角色同层靠 Order 抢'],
      ['像素风不糊', '贴图 Filter Mode 设 Point，关闭压缩，PPU 统一', '用 Bilinear 缩放导致边缘发虚']
    ], caption: '排序是 2D 的第一课，定好层再开始做美术' },

    { t: 'p', html: '像素完美（pixel perfect）是像素风的硬要求：一个精灵的 1 像素必须正好对应屏幕上的整数个像素，否则边缘会糊、移动时会抖。做法是统一 <b>Pixels Per Unit（PPU）</b>（常用 16、32、100），贴图过滤设为 Point，相机尺寸按「屏幕高度 ÷ (2 × PPU)」算，并使用 Unity 的 Pixel Perfect Camera 组件。非像素风可以忽略这一节，但仍要统一 PPU，否则同一场景里的精灵大小关系会乱。' },

    { t: 'h', lvl: 2, text: '二、正交相机与画面构图', id: 'ch04-2' },

    { t: 'p', html: '2D 用<b>正交相机（Orthographic）</b>：没有透视，远近不影响大小，看到的是一个矩形区域。<code>Orthographic Size</code> 是<b>可见高度的一半</b>（单位：世界单位），所以 Size = 5 表示纵向能看到 10 个单位。横向可见宽度由宽高比决定：宽度 = 高度 × Aspect。这意味着<b>同一个 Size 在 16:9 与 21:9 的屏幕上看到的横向范围不同</b>，UI 贴边与关卡边界都要考虑这一点。' },

    { t: 'p', html: '构图上有三条经验。第一，<b>角色不要永远在正中</b>：把相机略微朝角色面向的方向偏移，玩家能看到更多前方信息，这在横版动作游戏里几乎是标配。第二，<b>相机要有边界</b>：用 <code>Clamp</code> 限制在关卡矩形内，避免看到地图外的空白。第三，<b>跟随要平滑但不要滞后太多</b>：位置用 <code>Vector3.SmoothDamp</code> 或 Cinemachine 的阻尼，跟随过慢会让玩家觉得自己在拖着一个镜头走。' },

    { t: 'code', lang: 'csharp', caption: '带边界与前瞻的 2D 相机跟随', code: `using UnityEngine;

public class CameraFollow2D : MonoBehaviour
{
    [SerializeField] Transform target;
    [SerializeField] float smoothTime = 0.15f;
    [SerializeField] float lookAhead = 1.5f;
    [SerializeField] Vector2 minBounds = new Vector2(-20f, -5f);
    [SerializeField] Vector2 maxBounds = new Vector2(40f, 12f);

    Vector3 velocity;
    float facing = 1f;

    void LateUpdate()
    {
        if (target == null) return;

        // 记录角色朝向：只在朝向翻转时更新，避免每帧抖动
        float h = Input.GetAxisRaw("Horizontal");
        if (Mathf.Abs(h) > 0.1f) facing = Mathf.Sign(h);

        Vector3 desired = new Vector3(
            target.position.x + facing * lookAhead,
            target.position.y + 1.2f,          // 视线略高于脚底
            transform.position.z);

        Vector3 pos = Vector3.SmoothDamp(transform.position, desired, ref velocity, smoothTime);

        // 夹在关卡边界内，注意相机自身可见范围
        float halfH = Camera.main.orthographicSize;
        float halfW = halfH * Camera.main.aspect;
        pos.x = Mathf.Clamp(pos.x, minBounds.x + halfW, maxBounds.x - halfW);
        pos.y = Mathf.Clamp(pos.y, minBounds.y + halfH, maxBounds.y - halfH);
        pos.z = -10f;

        transform.position = pos;
    }
}` },

    { t: 'p', html: '三个要点。第一，跟随写在 <code>LateUpdate</code>，保证在角色移动之后执行，画面不抖。第二，<b>边界要考虑相机自身的可见范围</b>：直接用关卡最小 x 夹住会让画面露出空白，要加上 <code>halfW</code>。第三，前瞻（look-ahead）只在朝向改变时更新方向，否则角色停下时镜头会来回微动——这是「镜头莫名其妙晃」的常见来源。' },

    { t: 'h', lvl: 2, text: '三、2D 物理：Rigidbody2D 与碰撞体', id: 'ch04-3' },

    { t: 'p', html: 'Unity 有两套独立的物理系统：3D 的 <code>Rigidbody</code> 与 2D 的 <code>Rigidbody2D</code>。<b>它们互不碰撞</b>，也不能混用组件。2D 物理的刚体默认只在一个平面上运动，重力方向可设为 (0, −9.81) 或侧视角的 (0, −9.81)，碰撞体用 <code>BoxCollider2D</code>、<code>CircleCollider2D</code>、<code>CapsuleCollider2D</code> 与 <code>PolygonCollider2D</code>。' },

    { t: 'p', html: '2D 物理有四个 3D 没有的关键设置。<b>Body Type</b>：<code>Dynamic</code> 受重力与力，<code>Kinematic</code> 只受脚本控制但能推开别人，<code>Static</code> 完全不动（地面、墙）。<b>Gravity Scale</b>：每个刚体单独的重力倍数，做「飘浮」与「重物」不用改全局重力。<b>Collision Detection</b>：<code>Discrete</code> 与 <code>Continuous</code>，高速移动必须开后者。<b>Interpolate</b>：与 3D 一样，解决画面抖动。' },

    { t: 'table', head: ['3D 组件', '2D 对应', '关键差别'], rows: [
      ['<code>Rigidbody</code>', '<code>Rigidbody2D</code>', '2D 有 Body Type 与 Gravity Scale，两套物理互不影响'],
      ['<code>BoxCollider</code>', '<code>BoxCollider2D</code>', '2D 碰撞体是平面矩形，没有厚度参数'],
      ['<code>MeshCollider</code>', '<code>PolygonCollider2D</code>', '2D 多边形碰撞体成本高，尽量用少量顶点'],
      ['<code>OnCollisionEnter</code>', '<code>OnCollisionEnter2D</code>', '回调参数是 <code>Collision2D</code>，法线只有两个分量'],
      ['<code>Physics.Raycast</code>', '<code>Physics2D.Raycast</code>', '2D 射线返回 <code>RaycastHit2D</code>，默认忽略触发器'],
      ['<code>Quaternion</code> 旋转', '<code>float</code> 角度', '2D 只有 Z 轴旋转，用 <code>transform.eulerAngles.z</code>']
    ], caption: '两套物理不能混用，认准组件名里的 2D' },

    { t: 'p', html: '2D 角色控制最简单的做法是：<code>Rigidbody2D</code> 的 <code>gravityScale = 0</code>，在 <code>Update</code> 里读输入，在 <code>FixedUpdate</code> 里设 <code>rb.velocity</code>。跳跃用手动重力：按下跳时给一个向上的速度，之后在 <code>FixedUpdate</code> 里按「上升 / 下落」给不同的重力倍率，这样能做出「上升慢、下落快」的经典手感，而不必改全局物理设置。' },

    { t: 'code', lang: 'csharp', caption: '2D 平台跳跃：手动重力与可变跳跃高度', code: `using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
public class Platformer2D : MonoBehaviour
{
    [SerializeField] float moveSpeed = 7f;
    [SerializeField] float jumpVelocity = 12f;
    [SerializeField] float fallMultiplier = 2.2f;
    [SerializeField] float lowJumpMultiplier = 3f;

    Rigidbody2D rb;
    float moveInput;
    bool jumpPressed;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
        rb.gravityScale = 1f;
    }

    void Update()
    {
        moveInput = Input.GetAxisRaw("Horizontal");
        if (Input.GetButtonDown("Jump")) jumpPressed = true;
    }

    void FixedUpdate()
    {
        rb.velocity = new Vector2(moveInput * moveSpeed, rb.velocity.y);

        if (jumpPressed && Mathf.Abs(rb.velocity.y) < 0.01f)
        {
            rb.velocity = new Vector2(rb.velocity.x, jumpVelocity);
        }
        jumpPressed = false;

        // 下落时加重，松开跳跃键时更重：两个倍率叠出手感
        if (rb.velocity.y < 0f)
            rb.velocity += Vector2.up * Physics2D.gravity.y * (fallMultiplier - 1f) * Time.fixedDeltaTime;
        else if (rb.velocity.y > 0f && !Input.GetButton("Jump"))
            rb.velocity += Vector2.up * Physics2D.gravity.y * (lowJumpMultiplier - 1f) * Time.fixedDeltaTime;
    }
}` },

    { t: 'p', html: '这段代码实现了两个经典手感技巧。<b>下落倍率</b>（fall multiplier）：下落时重力更大，落地更干脆，玩家觉得「不飘」。<b>短跳</b>（low jump multiplier）：松开跳跃键时立即加重，按住则跳得更高，同一个按键就能表达「轻点小跳、长按大跳」，控制精度立刻提升。注意着地判定这里用了速度近似，实际项目应换成射线或 <code>Physics2D.OverlapCircle</code>，否则贴墙下滑时也能起跳。' },

    { t: 'h', lvl: 2, text: '四、Tilemap 与关卡拼装', id: 'ch04-4' },

    { t: 'p', html: '<b>Tilemap</b> 是把关卡切成网格、用「瓷砖（Tile）」批量拼装的功能。它把成百上千个精灵合并成少量网格绘制，性能远好于逐个摆放 <code>SpriteRenderer</code>；同时提供网格吸附，让关卡边缘整齐。<code>Grid</code> 决定格子大小，<code>Tilemap</code> 是画布，<code>Tile Palette</code> 是笔刷面板，<code>TilemapCollider2D</code> 负责让整张地图参与碰撞。' },

    { t: 'p', html: '工作流建议：先做一小块「标准件」——地面、斜坡、平台、墙——把它们的碰撞体调准，再开始大面积铺。铺的时候遵守三条：<b>碰撞体与视觉对齐</b>（差一个像素就会卡角）、<b>相邻瓷砖合并碰撞</b>（用 <code>CompositeCollider2D</code> 减少接缝卡顿）、<b>危险物与装饰物分层</b>（尖刺在危险层，草丛在装饰层，玩家踩草丛不该受伤）。' },

    { t: 'callout', kind: 'tip', title: 'Tilemap 卡角的修法', html: '角色贴着两块瓷砖的接缝往上跳时被卡住，是因为接缝处形成了内凹角。三个修法：给 <code>TilemapCollider2D</code> 加 <code>CompositeCollider2D</code> 合并成一条连续轮廓；把角色胶囊的 <code>CapsuleCollider2D</code> 换成带圆角的形状；或给角色加一个极小的「滑过」修正（贴墙时给一点水平推力）。第一种最治本。' },

    { t: 'p', html: '关卡规模上，一个学生项目的 2D 关卡控制在 3–5 分钟内能走完比较合适。太长会暴露素材重复，太短则节奏还没建立就结束。用 Tilemap 的好处是改起来快：加一段、删一段都是几十秒的事，这正是「先排再调」的工作方式所需的。' },

    { t: 'h', lvl: 2, text: '五、2.5D 的三条实现路线', id: 'ch04-5' },

    { t: 'p', html: '2.5D 是「视觉看起来有纵深，玩法仍在平面或近似平面」的做法。课程 Lab 5 讨论的就是这个方向：三维的场景、二维的操作。它有三条常见实现路线，选哪条决定了后面所有工作流。' },

    { t: 'table', head: ['路线', '做法', '优点', '代价'], rows: [
      ['2D 玩法 + 3D 视觉', '角色与碰撞都在 XY 平面，背景与场景用 3D 模型和透视相机', '手感可控、物理简单，画面有纵深', '美术制作成本高，遮挡关系要手工调'],
      ['3D 场景 + 2D 操作', '角色在 XZ 平面移动，Y 轴只用于跳跃', '适合俯视动作、双摇杆射击', '相机与深度排序要仔细处理'],
      ['3D 场景 + 固定机位', '类似《生化危机》早期作品，相机固定，角色在三维中走', '悬疑感强、构图可控', '操作方向与镜头方向不一致，玩家易迷路']
    ], caption: '课程 Lab 5 走的是第一条；后两条在期末项目里也有人用' },

    { t: 'p', html: '以第一条为例，实现要点是：<b>把玩法层与视觉层分开</b>。玩法层的角色是一个带 <code>Rigidbody2D</code> 的空对象，只负责移动与碰撞；视觉层的模型挂在它下面，只负责好看。这样调整画面（换模型、加阴影、改材质）不会影响手感，调整手感也不会打乱画面。很多 2.5D 项目的崩坏，就是因为把手感与画面绑死在同一个对象上。' },

    { t: 'p', html: '如果是第二条路线，深度排序要靠 <code>Order in Layer</code> 或「相机朝向的投影深度」动态计算：每帧按物体与相机的距离设置 Order，近的画在上面。这个逻辑开销小，但要避免在同一帧内数值抖动导致闪烁——加上阈值或取整即可。' },

    { t: 'h', lvl: 2, text: '六、视差、纵深与场景层次', id: 'ch04-6' },

    { t: 'p', html: '<b>视差（parallax）</b>是让背景层以不同速度移动，制造纵深的经典手法。原理很简单：离相机越远的层，位移越小。实现时给每层一个系数（远景 0.1、中景 0.4、前景 1.2），在相机移动后按系数反向偏移。它几乎不花性能，却能让平面画面立刻「有空间」。' },

    { t: 'code', lang: 'csharp', caption: '视差层：跟随相机但按系数偏移', code: `using UnityEngine;

public class ParallaxLayer : MonoBehaviour
{
    [SerializeField] Transform cam;
    [SerializeField] float factor = 0.5f;      // 0 = 完全跟随，1 = 完全不动
    [SerializeField] bool infiniteHorizontal = true;

    Vector3 startPos;
    float startCamX;

    void Start()
    {
        startPos = transform.position;
        startCamX = cam.position.x;
    }

    void LateUpdate()
    {
        float delta = cam.position.x - startCamX;
        transform.position = new Vector3(
            startPos.x + delta * factor,
            startPos.y,          // 纵向一般不动，避免露出边缘
            startPos.z);

        // 横向无限：图层宽度有限时，用取模把位置拉回起点附近
        if (infiniteHorizontal)
        {
            float w = 20f;       // 单块背景的宽度，按素材设置
            transform.position = new Vector3(
                startPos.x + Mathf.Repeat(delta * factor, w),
                startPos.y, startPos.z);
        }
    }
}` },

    { t: 'p', html: '三个注意点。第一，视差要写在 <code>LateUpdate</code>，且<b>基于相机的实际位移</b>，不要基于角色——角色被击退时背景跟着跳会很怪。第二，<b>纵向一般不做视差</b>，否则跳跃时天空会上下滑动，露出图层边缘。第三，无限滚动的背景要用 <code>Mathf.Repeat</code> 取模并准备两块拼接，单块素材总会在某个位置露馅。' },

    { t: 'p', html: '纵深不只靠视差，还靠<b>明度与饱和度分层</b>：远景降对比、偏冷色；近景饱和度高、细节多。玩家会自然地把注意力放在对比最强的区域，这正好可以用来引导视线——把出口画得比周围更亮，玩家不用小地图也知道往哪走。' },

    { t: 'h', lvl: 2, text: '七、关卡节奏：教学、变化、考验', id: 'ch04-7' },

    { t: 'p', html: '一关好玩的关卡很少是「一堆障碍物随机摆放」，而是一个有结构的教学单元。最通用的结构是三段式：<b>教学（teach）→ 变化（twist）→ 考验（test）</b>。先用安全环境介绍一个新机制，再把它和旧机制组合出变化，最后在不给提示的情况下考一次。三段走完，玩家会觉得自己「学会了」。' },

    { t: 'p', html: '以「弹簧板」为例。教学段：一个弹簧板放在平地上，玩家踩上去被弹到对面平台，路上没有危险。变化段：两个弹簧板连用，中间有移动平台，需要算时机。考验段：弹簧板在尖刺上方，玩家必须先清掉飞行敌人再踩，否则空中被撞落。每一段只引入一个新变量，难度才可控。' },

    { t: 'table', head: ['段落', '目的', '设计手法', '玩家感受'], rows: [
      ['教学', '让玩家发现机制', '安全环境、单一变量、明显反馈', '「原来是这么用的」'],
      ['变化', '让玩家组合机制', '旧机制 + 新机制、轻微时间压力', '「还能这样」'],
      ['考验', '确认玩家掌握', '无提示、组合难点、失败可快速重试', '「我做到了」'],
      ['呼吸段', '让玩家恢复', '安全区、补给、一段风景', '放松，准备下一个高峰'],
      ['奖励', '确认值得', '捷径、收藏品、新能力预览', '满足，想继续']
    ], caption: '每一关都可以按这张表检查，缺哪段补哪段' },

    { t: 'p', html: '呼吸段常被学生项目忽略，但它决定玩家会不会疲劳。连续三段高强度跳跃之后，给一个平缓的走廊、一段音乐变化、一个存档点，玩家的紧张才会释放，下一个高峰才有对比。节奏的本质是对比：<b>没有安静，紧张就不成立。</b>' },

    { t: 'h', lvl: 2, text: '八、可读性与玩家引导', id: 'ch04-8' },

    { t: 'p', html: '2D 关卡最大的隐形问题是<b>可读性</b>：玩家不知道哪里能站、哪里会死、下一步该去哪。文字提示是最后手段，优先用视觉语言。四个手段按成本从低到高排列：<b>明度对比</b>（可走的路更亮）、<b>形状语言</b>（尖刺一律尖锐、平台一律平顶）、<b>动势引导</b>（飘动的旗帜、流动的光点指向出口）、<b>危险预告</b>（陷阱启动前 0.3 秒的闪烁与音效）。' },

    { t: 'p', html: '「危险预告」值得单独强调。玩家可以接受难，但不能接受「莫名其妙就死了」。任何一击必杀的机关，都应该在生效前给出可感知的信号：颜色变化、音效、粒子、镜头微推。信号时长与难度成反比——越难越要给得早。这条规则同样适用于 3D 与 Boss 战。' },

    { t: 'compare', left: { title: '不可读的关卡', html: '地面与背景同色，尖刺和装饰草混在一起，出口藏在画面边缘。玩家反复死亡，说「这游戏很难」，其实是「这游戏没说清楚」。测试时他们把失败归因于运气。' }, right: { title: '可读的关卡', html: '地面比背景亮一档，危险物统一用高饱和红并带轻微脉冲，出口有光柱与飘动粒子。同样难度，玩家死亡后能说出「我应该在弹簧板上等一下」，失败变成学习。' } },

    { t: 'p', html: '测试可读性的方法很简单：找一个没玩过的人，<b>不给任何口头提示</b>，看他第一分钟会不会停在某个地方发呆。停留超过三秒的地方，就是可读性缺口。记下位置，回去改视觉，而不是加一行「按 A 向左走」的文字。' },

    { t: 'terms', items: [
      { en: 'sprite', zh: '精灵', html: '2D 中的基本视觉单位，由一张贴图与矩形区域构成，用 SpriteRenderer 绘制。' },
      { en: 'sorting layer', zh: '排序层', html: '决定精灵前后关系的大层，同层内再用 Order in Layer 细分。' },
      { en: 'orthographic camera', zh: '正交相机', html: '无透视的 2D 相机，Size 等于可见高度的一半。' },
      { en: 'pixel perfect', zh: '像素完美', html: '让一个像素正好对应屏幕整数像素的设置，避免像素风画面发虚与抖动。' },
      { en: 'tilemap', zh: '瓷砖地图', html: '把关卡切成网格、用瓷砖批量拼装的功能，绘制性能优于逐个精灵。' },
      { en: 'parallax', zh: '视差', html: '让不同距离的背景以不同速度移动，制造纵深感的手法。' },
      { en: '2.5D', zh: '二点五维', html: '三维视觉搭配平面或近似平面玩法的设计路线。' },
      { en: 'readability', zh: '可读性', html: '玩家能否从画面判断哪里安全、哪里危险、下一步去哪。' }
    ] },

    { t: 'quiz', qid: 'ch04-q1' },
    { t: 'quiz', qid: 'ch04-q2' },
    { t: 'quiz', qid: 'ch04-q3' },

    { t: 'keypoint', items: [
      { title: '排序靠层，不靠 Z', html: 'Sorting Layer 定大层，Order in Layer 定同层顺序；Z 值在正交相机下容易出问题。' },
      { title: '正交相机的 Size 是半高', html: '可见宽度 = 高度 × 宽高比，因此不同屏幕看到的世界宽度不同，边界要按相机范围夹。' },
      { title: '2D 物理是独立一套', html: 'Rigidbody2D 与 Rigidbody 互不碰撞；2D 有 Body Type、Gravity Scale 与 2D 专用射线。' },
      { title: '2.5D 先分离玩法层与视觉层', html: '手感与画面解耦，改一个不会毁掉另一个；三条路线按项目需求选。' },
      { title: '关卡要有教学、变化、考验', html: '再加呼吸段与奖励，玩家才会「学会」而不是「熬过」。' }
    ] },

    { t: 'checklist', id: 'ch04', items: [
      '我能说出 Sorting Layer 与 Order in Layer 的分工，并已为自己的项目定好层',
      '我理解正交相机的 Size 是半高，并能算出 16:9 屏幕下的可见宽度',
      '我做出了带边界与前瞻的相机跟随，且画面不抖',
      '我知道 Rigidbody2D 与 Rigidbody 不能混用，并能说出 2D 特有的三个设置',
      '我用下落倍率与短跳调出了自己满意的手感，并能解释两个倍率的作用',
      '我用 Tilemap 拼出一段关卡，并处理过瓷砖接缝卡角',
      '我能说出 2.5D 的三条路线，并为自己的项目选定一条、写明理由',
      '我实现了至少两层视差，且知道纵向为什么不建议做视差',
      '我能把一关拆成教学、变化、考验三段，并找出它缺哪一段',
      '我做过一次无提示可读性测试，记录到至少一个「发呆超过三秒」的位置'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 ECE3200 Lab 3–5 的讲义与 Guidance 编写，其中 Lab 5（Introduction to 2.5D game design）提供了 2.5D 路线与场景搭法的原始讨论，RPG 素材包用于精灵与 Tilemap 示例。讲义中的具体导入步骤、素材命名与场景截图未逐条复述；相机跟随、视差、平台跳跃的代码为本章补充，数值以 1 单位 = 1 米、角色高约 1.8 单位的尺度给出。像素完美与 PPU 的说明针对像素风项目，非像素风可只保留「统一 PPU」这一条。可读性测试方法为通用可用性测试的简化版，不属讲义原文。' }
  ]
});
