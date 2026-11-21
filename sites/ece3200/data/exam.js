/* =====================================================================
 * exam.js · ECE3200 模拟卷 A
 * 范围：ch00–ch07（游戏与玩法 / Unity 与 C# / 物理 / 2D 与 2.5D /
 *       3D 世界 / UI 与反馈 / 3D 进阶与交付）
 * 规格：12 题、满分 100、限时 90 分钟
 * 题型：choice / tf / fill / output / keywords
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerExam({
    id: 'ECE3200-A',
    title: '游戏设计 模拟卷 A',
    style: '期末风格',
    subtitle: 'ECE3200 · 覆盖 ch00–ch07 的综合模拟',
    date: '2026-11-21',
    minutes: 90,
    totalScore: 100,
    summary: '本卷覆盖八章全部内容：课程地图与 Unity 模型、玩法与 MDA、Unity 与 C# 基础、' +
      '物理引擎、2D 与 2.5D、3D 世界、UI 与反馈、3D 进阶与交付。卷面 12 题：选择 3 题共 24 分、' +
      '判断 1 题 8 分、填空 2 题共 16 分、读代码写输出 2 题共 20 分、简答与设计 4 题共 32 分。' +
      '建议闭卷限时完成；读代码题先在纸上跟踪执行顺序，简答题按关键词命中给分。',
    instructions: [
      '时间 90 分钟，满分 100 分。计时开始后不会暂停，刷新页面也按真实时间计算。',
      '题型：单项选择 3 题、判断 1 题、填空 2 题、读代码写输出 2 题、简答与设计 4 题。',
      '读代码题按执行顺序作答，输出中的大小写与换行要写对；简答题按关键词命中比例给分，答出要点即可。',
      '涉及 Unity 的题默认使用 Unity 2021 LTS 及以上、内置渲染管线，脚本为 C#。',
      '写代码或设计题只要求写出关键部分（类、方法或状态迁移），不必写完整工程，但签名与逻辑必须完整。'
    ],
    questions: [

      /* ---------------------------------------------------------- Q1 */
      { no: 1, points: 8, type: 'single choice',
        intro: '本题考察游戏的基本构成与设计框架。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '下面哪一组是本站所说的「游戏四要素」？',
            options: [
              { text: '画面、音乐、剧情、角色' },
              { text: '目标、规则、挑战、反馈', correct: true },
              { text: '引擎、脚本、资源、平台' },
              { text: '玩家、手柄、屏幕、网络' }
            ],
            explain: '四要素是目标、规则、挑战、反馈。画面与音乐属于表现层，缺失不影响「这是不是游戏」；' +
              '引擎与平台是实现手段。用四要素检查原型，缺哪一项就补哪一项，比笼统地说「不好玩」更容易定位问题。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: 'MDA 框架中，「玩家在游玩过程中实际产生的行为模式」属于哪一层？',
            options: [
              { text: 'Mechanics（机制）' },
              { text: 'Dynamics（动态）', correct: true },
              { text: 'Aesthetics（体验）' },
              { text: '不属于 MDA 的任何一层' }
            ],
            explain: 'Mechanics 是规则与数据，Dynamics 是规则运行时产生的动态行为（玩家实际怎么玩），' +
              'Aesthetics 是玩家体验到的感受。设计师从机制入手、玩家从体验入手，两者在动态层相遇。' +
              '调体验时要顺着「感受 → 动态 → 机制」往回找原因。' }
        ] },

      /* ---------------------------------------------------------- Q2 */
      { no: 2, points: 8, type: 'true / false',
        intro: '判断下列陈述的真假。',
        parts: [
          { label: '(a)', points: 4, kind: 'tf',
            prompt: '一个 MonoBehaviour 的 <code>Awake</code> 一定比另一个对象的 <code>Start</code> 先执行。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: 'Awake 与 Start 的<b>阶段</b>顺序是固定的（所有 Awake 先于所有 Start），但同一阶段内' +
              '多个对象的调用顺序并不保证，除非设置了 Script Execution Order。依赖「A 的 Awake 一定早于 B 的 Start」' +
              '在对象数量变化时就会翻车，正确做法是把依赖放进 Start 或用事件解耦。' },
          { label: '(b)', points: 4, kind: 'tf',
            prompt: '在 <code>Update</code> 里给刚体施加力，与在 <code>FixedUpdate</code> 里施加，效果完全等价。',
            options: [
              { text: '正确' },
              { text: '错误', correct: true }
            ],
            explain: 'FixedUpdate 按固定步长调用，与物理模拟同步；Update 的间隔随帧率波动。在 Update 里施力，' +
              '帧率一抖动，单位时间内累积的力就变了，表现为同样的操作有时跳得高有时跳得低。' +
              '物理相关计算放 FixedUpdate，相机与 UI 跟随放 Update 或 LateUpdate。' }
        ] },

      /* ---------------------------------------------------------- Q3 */
      { no: 3, points: 8, type: 'fill in the blank',
        intro: '把答案写在横线处。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '2D 游戏中决定两个精灵谁画在前面的是 Sorting Layer 与 ______。',
            answer: 'Order in Layer',
            accept: ['Order in Layer', 'order in layer', '层内顺序', 'Order', '排序序号'],
            explain: 'Sprite Renderer 先用 Sorting Layer 分层（背景 / 场景 / 角色 / 前景 / UI），' +
              '同一层内再用 Order in Layer 排先后，Z 坐标在 2D 渲染中基本不参与。' +
              '忘记设 Order 是最常见的「背景盖住角色」原因。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: 'Unity 中让角色自动绕开障碍寻路的技术叫 ______（填英文缩写）。',
            answer: 'NavMesh',
            accept: ['NavMesh', 'navmesh', 'Navigation Mesh', '导航网格'],
            explain: 'NavMesh 是烘焙出的可行走网格，NavMeshAgent 在其上寻路。它只解决「怎么绕过去」，' +
              '不解决「要不要过去」——巡逻、追击、放弃这些决策仍要自己写。' +
              '烘焙时要检查坡度、台阶高度与代理半径，否则会出现「看着能走却过不去」的缝。' }
        ] },

      /* ---------------------------------------------------------- Q4 */
      { no: 4, points: 8, type: 'single choice',
        intro: '本题考察物理引擎的基本行为。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '要让两个物体「碰到就触发事件」但不产生弹开的物理响应，应该怎么设置？',
            options: [
              { text: '勾选 Collider 的 <code>Is Trigger</code>，用 <code>OnTriggerEnter</code> 处理', correct: true },
              { text: '保持普通碰撞体，用 <code>OnCollisionEnter</code> 处理' },
              { text: '勾选 Rigidbody 的 <code>Is Kinematic</code>，用 <code>OnCollisionStay</code> 处理' },
              { text: '把两个物体的 Layer 设为 Ignore Raycast' }
            ],
            explain: '触发器只检测重叠、不产生物理响应，正合「碰到就触发但不弹开」。普通碰撞体会解算冲量，' +
              '玩家会被弹开；Is Kinematic 只影响刚体是否受物理驱动，与是否弹开无关。' +
              '触发器事件要生效，两个物体中至少一个要有 Rigidbody。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '要让移动平台可靠地带着玩家一起走，最合适的做法是：',
            options: [
              { text: '在 <code>Update</code> 里直接改 <code>transform.position</code>' },
              { text: '用 Kinematic 刚体 + <code>MovePosition</code> 在 <code>FixedUpdate</code> 里移动', correct: true },
              { text: '给平台加一个很大的 <code>Rigidbody.velocity</code>' },
              { text: '让玩家自己写脚本跟随平台坐标' }
            ],
            explain: 'MovePosition 在物理步内移动刚体，引擎能正确计算接触与摩擦，玩家站在上面会被带着走。' +
              '直接改 transform.position 相当于瞬移，物理引擎不知道「平台推了玩家」，会穿模或打滑。' +
              '让玩家自己跟随则是把平台的责任推给玩家脚本，一换平台就得改代码。' }
        ] },

      /* ---------------------------------------------------------- Q5 */
      { no: 5, points: 10, type: 'read the code',
        intro: '这道题考察 Unity 的初始化顺序与协程的执行时机，请写出完整输出。',
        parts: [
          { label: '(a)', points: 5, kind: 'output',
            prompt: '按执行顺序写出控制台的所有输出（每行一个）。',
            code: 'void Awake()  { Debug.Log("Awake"); }\nvoid OnEnable() { Debug.Log("OnEnable"); }\nvoid Start()  { Debug.Log("Start"); }\nvoid Update() { if (!once) { once = true; Debug.Log("Update"); } }',
            answer: 'Awake\nOnEnable\nStart\nUpdate',
            accept: ['Awake OnEnable Start Update', 'Awake, OnEnable, Start, Update'],
            explain: 'Awake 在实例化时调用，OnEnable 在启用时调用，Start 在第一帧 Update 之前调用一次，' +
              'Update 每帧调用且被 once 限制为只打印一次。顺序记法：先建立自身（Awake）、再接入场景（OnEnable）、' +
              '再依赖他人（Start）、最后每帧跑逻辑（Update）。' },
          { label: '(b)', points: 5, kind: 'output',
            prompt: '按执行顺序写出控制台的所有输出（每行一个）。',
            code: 'void Start()\n{\n    StartCoroutine(Run());\n    Debug.Log("A");\n}\n\nIEnumerator Run()\n{\n    Debug.Log("B");\n    yield return null;\n    Debug.Log("C");\n}',
            answer: 'B\nA\nC',
            accept: ['B A C', 'B, A, C'],
            explain: 'StartCoroutine 会<b>同步执行</b>协程直到第一个 yield：所以先打印 B，然后才回到 Start 打印 A。' +
              'yield return null 表示「等到下一帧」，下一帧恢复后打印 C。这个顺序常被误解为「协程整体延后执行」，' +
              '实际只有 yield 之后的部分才延后。' }
        ] },

      /* ---------------------------------------------------------- Q6 */
      { no: 6, points: 8, type: 'short answer',
        intro: '简答题：玩法与关卡设计。',
        parts: [
          { label: '(a)', points: 4, kind: 'keywords',
            prompt: '一个「有意义的选择」需要满足哪三个条件？各用一句话说明。',
            keywords: ['后果可感知', '取舍', '信息充分', '不能全拿', '能预判'],
            explain: '三条是：后果可感知（不同选项带来玩家能察觉的差异）、存在取舍（不能全都拿到，必须放弃一些）、' +
              '信息充分（做选择前能获得判断所需的信息）。缺第一条，选择变成盲选；缺第二条，选择没有重量；' +
              '缺第三条，选择退化成运气。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '一段好的关卡节奏通常包含哪三个段落？各说明其作用。',
            keywords: ['教学', '变化', '考验', '安全地介绍机制', '增加组合或压力', '推到极限'],
            explain: '教学段在安全环境里介绍新机制；变化段在同一机制上增加组合或压力，避免重复；' +
              '考验段把刚学会的东西推到极限，给出成就感。三段顺序不能乱：先教再变最后考。' +
              '缺教学会卡住，缺变化会腻，缺考验则没有高潮。' }
        ] },

      /* ---------------------------------------------------------- Q7 */
      { no: 7, points: 8, type: 'single choice',
        intro: '本题考察 2D 相机与 2.5D 的空间方案。',
        parts: [
          { label: '(a)', points: 4, kind: 'choice',
            prompt: '正交相机的 <code>Size</code> 设为 5，画面纵向能看到多少世界单位？',
            options: [
              { text: '5' },
              { text: '10', correct: true },
              { text: '2.5' },
              { text: '取决于屏幕分辨率' }
            ],
            explain: '正交相机的 Size 是「可见高度的一半」，所以纵向可见 2 × 5 = 10 个世界单位，与分辨率无关。' +
              '这正是像素游戏偏爱正交相机的原因：世界单位稳定，分辨率只影响每单位占多少像素。' +
              '横向可见范围再由宽高比推出。' },
          { label: '(b)', points: 4, kind: 'choice',
            prompt: '下面哪种做法<b>不属于</b>本站讲的 2.5D 实现路线？',
            options: [
              { text: '2D 玩法 + 3D 场景表现' },
              { text: '3D 玩法 + 固定 2D 视角' },
              { text: '2D 精灵放在 3D 空间里，靠透视产生纵深' },
              { text: '用两台相机分别渲染左右眼做 VR', correct: true }
            ],
            explain: '三条 2.5D 路线的共同点是「玩法判定在一个平面上，视觉上有纵深」。VR 是立体渲染，' +
              '属于另一类空间方案。判断路线时先问「判定在几个轴上」，再问「视觉纵深从哪来」。' }
        ] },

      /* ---------------------------------------------------------- Q8 */
      { no: 8, points: 8, type: 'fill in the blank',
        intro: '本题考察 UI 适配与音频。',
        parts: [
          { label: '(a)', points: 4, kind: 'fill',
            prompt: '要让 UI 随屏幕大小等比缩放，Canvas 的 <code>Canvas Scaler</code> 应把 UI Scale Mode 设为 ______。',
            answer: 'Scale With Screen Size',
            accept: ['Scale With Screen Size', 'scale with screen size', '按屏幕尺寸缩放', 'ScaleWithScreenSize'],
            explain: 'Scale With Screen Size 按参考分辨率等比缩放，宽高比变化时由 Match 参数决定偏向宽还是高。' +
              'Constant Pixel Size 会让 UI 在大屏上显得很小；Constant Physical Size 按物理尺寸，跨设备差异更大。' },
          { label: '(b)', points: 4, kind: 'fill',
            prompt: '把 0–1 的线性音量转成分贝，常用公式是 <code>20 × ______(v)</code>。',
            answer: 'Log10',
            accept: ['Log10', 'log10', 'Mathf.Log10', 'lg'],
            explain: '人耳对响度的感知接近对数，20 × log10(v) 把线性值转成 dB：v = 1 为 0 dB，v = 0.5 约 -6 dB，' +
              'v = 0 为负无穷（要单独处理成静音）。Audio Mixer 的 Volume 参数正是以 dB 为单位。' }
        ] },

      /* ---------------------------------------------------------- Q9 */
      { no: 9, points: 8, type: 'short answer',
        intro: '简答题：反馈与可读性。',
        parts: [
          { label: '(a)', points: 4, kind: 'keywords',
            prompt: '反馈的三要素是什么？并说明「强度」应当遵循什么原则。',
            keywords: ['信息', '时机', '强度', '匹配事件重要性', '分级'],
            explain: '三要素是信息（告诉玩家什么）、时机（什么时候告诉）、强度（多强烈）。' +
              '强度要匹配事件的重要性并分级：普通命中轻、暴击中、击杀重。所有反馈都拉满，' +
              '玩家就分不清哪次更重要，长时间还会疲劳。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '列举三种提升「打击感」的手段，并各写一句实现要点。',
            keywords: ['hit stop', '停顿', '震屏', '闪白', '粒子', '音效', '短促'],
            explain: 'hit stop：命中瞬间把时间缩放或动画暂停 0.03–0.08 秒，太长会粘滞；' +
              '震屏：小幅、快速衰减，幅度过大会晕；闪白/闪红：受击材质短促变色，配合粒子与音效。' +
              '多通道同时给反馈，比单通道拉满更有效。' }
        ] },

      /* ---------------------------------------------------------- Q10 */
      { no: 10, points: 10, type: 'read the code',
        intro: '这道题考察物理参数与状态判定，请写出结果并说明原因。',
        parts: [
          { label: '(a)', points: 5, kind: 'output',
            prompt: '角色跳跃后在空中执行下面的代码，写出角色的运动表现。',
            code: 'void Update()\n{\n    float h = Input.GetAxis("Horizontal");\n    rb.velocity = new Vector3(h * speed, 0f, 0f);\n}',
            answer: '垂直速度被清零，跳跃中断，角色在空中水平平移并缓慢下落',
            accept: ['垂直速度清零', '跳跃中断', '卡在空中', '不掉也不升', '水平平移'],
            explain: '每帧新建 y 为 0 的速度向量覆盖 <code>rb.velocity</code>，等于抹掉重力累积的垂直速度。' +
              '表现是跳到一半突然停住、只剩水平移动。正确写法保留 y 分量：' +
              '<code>rb.velocity = new Vector3(h * speed, rb.velocity.y, 0f);</code>。' },
          { label: '(b)', points: 5, kind: 'keywords',
            prompt: '角色高速移动时会穿过薄墙。写出两个最可能的原因，以及各自的修法。',
            keywords: ['没有 Collider', '补碰撞体', '直接改 transform', '改用 Rigidbody', 'Discrete', 'Continuous'],
            explain: '原因一：墙没有碰撞体，射线与碰撞都检测不到，补 Collider 即可。' +
              '原因二：用 transform.position 位移绕过了物理，或离散检测在单帧跨过了薄物体。' +
              '修法是改用 Rigidbody 移动，并把碰撞检测设为 Continuous（或加厚墙体）。' }
        ] },

      /* ---------------------------------------------------------- Q11 */
      { no: 11, points: 8, type: 'design',
        intro: '设计题：敌人 AI 与性能。',
        parts: [
          { label: '(a)', points: 4, kind: 'keywords',
            prompt: '为一个近战敌人设计状态机，写出至少三个状态及它们之间的迁移条件。',
            keywords: ['巡逻', '追击', '攻击', '距离', '放弃', '视野'],
            explain: '最小可用状态机：巡逻（在路点间移动，发现玩家进入视野则转追击）、' +
              '追击（朝玩家寻路，超出放弃距离则回巡逻，进入攻击距离则转攻击）、' +
              '攻击（停下出手，玩家离开攻击范围则回追击）。关键细节是「放弃」与「卡住恢复」，' +
              '否则敌人会追到天涯海角或原地抖动。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '场景里子弹很多、帧率下降，Profiler 显示 GC Alloc 很高。写出两个可能原因与对应优化。',
            keywords: ['Instantiate', 'Destroy', '对象池', '字符串拼接', '缓存', '每帧'],
            explain: '原因一：子弹频繁 Instantiate / Destroy，产生大量垃圾，用对象池复用（注意取出时复位状态）。' +
              '原因二：每帧拼接字符串或调用 <code>Camera.main</code>，改为条件触发与缓存引用。' +
              '优化前必须先看 Profiler 定位，不要凭感觉改。' }
        ] },

      /* ---------------------------------------------------------- Q12 */
      { no: 12, points: 8, type: 'design',
        intro: '综合设计题：从原型到交付。',
        parts: [
          { label: '(a)', points: 4, kind: 'keywords',
            prompt: '期末项目只剩两周，功能已经齐全但还有不少 bug、也没打过包。写出你的时间安排与理由。',
            keywords: ['先打包', '功能冻结', '修阻塞性 bug', '试玩', '演示彩排', '留缓冲'],
            explain: '先冻结功能，立刻打一次包——打包会暴露编辑器里看不到的问题（路径、资源未包含、shader 丢失），' +
              '越晚发现越致命。然后按「阻塞性 bug → 试玩验证 → 打磨反馈」排序，最后留出演示彩排与缓冲时间。' +
              '继续加功能是最危险的选择。' },
          { label: '(b)', points: 4, kind: 'keywords',
            prompt: '一场五分钟的期末演示应当包含哪几个部分？说明每部分的作用。',
            keywords: ['一句话介绍', '实机演示', '设计决策', '不足与下一步', '彩排'],
            explain: '四段：30 秒一句话讲清核心循环；3 分钟实机演示挑最好的一段（不要从主菜单慢慢点）；' +
              '2 分钟讲设计决策与试玩后的修改；1 分钟讲不足与下一步。最后一段最能体现设计能力，' +
              '也最容易被忽略。演示前必须彩排，准备安全存档或跳关键以防翻车。' }
        ] }
    ]
  });
})();
