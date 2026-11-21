/* =====================================================================
 * ch03.js · 第 3 章「物理引擎：刚体、碰撞与射线」
 * 职责：讲清物理系统如何模拟刚体运动、如何判定碰撞与触发、如何用意与射线做查询，
 *       以及抖动、穿墙、滑行等故障的成因与修法。
 * 依据：Lab 2 讲义（Introduction to Unity Physical Engine）与 Lab 2 Guidance。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch03',
  num: '03',
  title: '物理引擎：刚体、碰撞与射线',
  en: 'PHYSICS ENGINE',
  goals: [
    '说清刚体、碰撞体、物理材质三者各自负责什么，缺一个会怎样',
    '解释碰撞（Collision）与触发（Trigger）的判定条件与回调差异',
    '在 MovePosition、velocity、AddForce 三种移动方式之间按需求做出选择',
    '用射线检测实现着地判定、射击命中与物体拾取，并正确使用层遮罩',
    '诊断并修复穿墙、抖动、永久滑行与碰撞爆炸四类常见物理故障',
    '把物理参数当作手感参数来调，能说明每个数值改变了玩家的什么感受'
  ],
  kp: [
    { id: 'ch03-1', title: '物理系统在模拟什么' },
    { id: 'ch03-2', title: 'Rigidbody：质量、阻力与约束' },
    { id: 'ch03-3', title: 'Collider：形状、触发器与层矩阵' },
    { id: 'ch03-4', title: '碰撞回调与触发回调' },
    { id: 'ch03-5', title: '三种移动方式：位移、速度、力' },
    { id: 'ch03-6', title: '射线与查询：着地、射击、拾取' },
    { id: 'ch03-7', title: '四类常见物理故障' },
    { id: 'ch03-8', title: '把物理参数调成手感' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么物理是游戏设计的分水岭', html: '物理系统决定了「世界有没有重量」。同样是按一下跳跃键，重力 9.8 与 30 给人的感觉完全不同：前者轻盈，适合平台跳跃；后者厚重，适合写实动作。很多设计意图不是靠改机制实现的，而是靠改一个数字实现的。反过来，物理也是 bug 的高发区——穿墙、抖动、角色黏在墙上，九成源于对刚体与碰撞体的误解。<b>懂物理，你才能既做出手感，又修得掉故障。</b>' },

    { t: 'p', lead: true, html: '本章从「引擎在算什么」讲起，依次展开刚体、碰撞体、回调、移动方式、射线查询与故障排查，最后回到设计：每个物理参数对应玩家的哪种感受。学完你应该能独立搭出一个不穿墙、不抖动、手感可控的角色控制器。' },

    { t: 'h', lvl: 2, text: '一、物理系统在模拟什么', id: 'ch03-1' },

    { t: 'p', html: 'Unity 的物理引擎（PhysX）每个固定时间步做三件事：<b>积分</b>（根据受力与速度更新位置）、<b>检测</b>（找出这一帧互相重叠的形状）、<b>求解</b>（把重叠推开、按材质与冲量计算反弹与摩擦）。它不模拟「游戏规则」，只模拟「实体怎么动、怎么撞」。所以你要给它三样东西：质量与惯性（<code>Rigidbody</code>）、形状（<code>Collider</code>）、表面属性（<code>PhysicMaterial</code>）。' },

    { t: 'p', html: '缺任何一个，行为都会变味。只有碰撞体没有刚体，物体会被当成静态障碍，别人撞上去像撞墙，自己永远不会动；有刚体没有碰撞体，物体会受重力下落，但会直接穿过地面；两者都有但没有物理材质，摩擦与弹性取默认值，冰面与橡胶地板的差别就做不出来。' },

    { t: 'table', head: ['部件', '作用', '缺了会怎样', '典型设置'], rows: [
      ['<code>Rigidbody</code>', '把对象交给物理系统：质量、重力、受力', '对象只能被脚本直接摆位置，不参与碰撞响应', '玩家 mass 1–2，箱子 5–20'],
      ['<code>Collider</code>', '定义碰撞形状与体积', '对象会穿模，回调不触发', '角色用胶囊，子弹用球，地形用网格'],
      ['<code>PhysicMaterial</code>', '摩擦与弹性', '滑冰与橡胶手感一样，落地不弹', '冰面 friction 0.05，橡胶 0.9'],
      ['层（Layer）', '决定谁和谁碰撞', '不该碰的互相推挤，性能浪费', 'Player / Enemy / Ground / Trigger 分层'],
      ['固定步长 <code>fixedDeltaTime</code>', '物理计算频率', '调小更精确但更耗性能', '默认 0.02 秒，动作游戏可 0.0167']
    ], caption: '先检查这五项，再看代码逻辑' },

    { t: 'p', html: '还要记住一个前提：<b>物理在 <code>FixedUpdate</code> 的时间轴上运行，与渲染帧不同步</b>。渲染帧率 120 时，两帧之间可能只有半个物理步；渲染帧率 20 时，一帧里会补跑两三次物理步。这解释了很多「为什么我的角色偶尔穿过墙」——不是代码错，而是速度太快、步长太大。' },

    { t: 'h', lvl: 2, text: '二、Rigidbody：质量、阻力与约束', id: 'ch03-2' },

    { t: 'p', html: '刚体上最常调的是六个参数。<b>Mass（质量）</b>影响碰撞时的动量交换：玩家撞箱子，质量大的箱子更难推动，但两个物体下落速度相同——重力加速度与质量无关，这是初中物理就学过的。<b>Drag（阻力）</b>让速度持续衰减，适合做空气阻力；<b>Angular Drag</b> 让旋转衰减。<b>Use Gravity</b> 关掉就变成漂浮物。<b>Is Kinematic</b> 打开后物体不受物理力，只能由脚本移动，但仍会推开别人——适合移动平台与电梯。' },

    { t: 'p', html: '约束（Constraints）常被低估。角色胶囊如果不勾 <code>Freeze Rotation X/Z</code>，被撞一下就会倒地，因为物理系统把它当成一个可以翻滚的圆柱。勾上之后，碰撞只改位置不改朝向，角色才站得住。旋转交给脚本控制，物理只负责位置——这是绝大多数第三人称控制器的做法。' },

    { t: 'table', head: ['参数', '调大 / 打开', '调小 / 关闭', '用在什么地方'], rows: [
      ['Mass', '更难推动，碰撞更「重」', '一撞就飞，适合轻质道具', '箱子、推车、可击飞的敌人'],
      ['Drag', '滑行很快停下，像在泥里', '滑得远，像冰面', '水面、冰面、空中控制'],
      ['Angular Drag', '旋转很快停', '一直转，像陀螺', '轮胎、被击飞的碎片'],
      ['Is Kinematic', '脚本完全控制，仍推开别人', '正常受物理影响', '移动平台、电梯、门'],
      ['Freeze Rotation', '不会被撞倒', '可以被撞翻滚', '角色、站立的人形敌人'],
      ['Interpolate', '画面平滑，位置略滞后', '画面直接跳，省一点性能', '玩家、相机跟随目标']
    ], caption: '参数没有「正确值」，只有「符合你想要的手感的值」' },

    { t: 'callout', kind: 'tip', title: 'Interpolate 与抖动', html: '物理步 50Hz、渲染 60Hz 时，刚体位置在渲染帧之间不变，画面会出现轻微抖动。把 <code>Interpolate</code> 设为 <code>Interpolate</code>（或 <code>Extrapolate</code>）会按渲染时间插值，画面立刻平滑。代价是位置略微滞后一个物理步，对竞速类游戏要谨慎。相机跟随的抖动则应该用 <code>LateUpdate</code> 解决，两者常被混淆。' },

    { t: 'h', lvl: 2, text: '三、Collider：形状、触发器与层矩阵', id: 'ch03-3' },

    { t: 'p', html: '碰撞体决定「什么算撞上」。Unity 提供盒、球、胶囊、网格、地形等形状。选择原则是<b>用最简单的形状近似</b>：角色用胶囊（斜面过渡平滑、不会卡台阶），子弹用球（快速移动时不易漏检），箱子用盒，复杂场景用网格碰撞体但尽量只给静态物体用。网格碰撞体精确但昂贵，且凹形网格不能用于动态刚体。' },

    { t: 'p', html: '每个碰撞体上有个 <code>Is Trigger</code> 勾选框。<b>勾上之后它不再阻挡物体，只报告「有东西进来了」</b>，这就是触发区域：拾取物、伤害区、检查点、过场触发都用它。勾掉则是实体碰撞，会推开物体并产生碰撞回调。同一个对象上可以既有实体碰撞体又有触发碰撞体，但要注意层与回调的分工，否则会出现「明明走进去了却没触发」。' },

    { t: 'table', head: ['碰撞体', '适合', '成本', '注意'], rows: [
      ['BoxCollider', '箱子、墙、地板、门', '低', '旋转后与视觉可能不一致'],
      ['SphereCollider', '球、子弹、拾取物', '最低', '快速移动时仍可能隧穿，需连续检测'],
      ['CapsuleCollider', '角色、树、柱', '低', '斜面与台阶表现最好'],
      ['MeshCollider（凸）', '不规则道具、可交互物件', '中', 'Convex 打开才能被动态刚体使用'],
      ['MeshCollider（凹）', '静态地形、建筑', '高', '不能挂在动态刚体上'],
      ['TerrainCollider', '大地形', '中高', '配合地形工具使用']
    ], caption: '先用简单形状近似，视觉模型单独挂着即可' },

    { t: 'p', html: '层（Layer）与碰撞矩阵（Physics Settings 里的 Layer Collision Matrix）决定「谁和谁碰」。把玩家、敌人、地面、触发区分层，再取消不需要的勾选，能同时解决两个问题：<b>避免误碰撞</b>（玩家的攻击判定不该推自己）与<b>省性能</b>（不检测的组合直接被剔除）。射线检测也依赖层遮罩，这一点在第 6 节展开。' },

    { t: 'h', lvl: 2, text: '四、碰撞回调与触发回调', id: 'ch03-4' },

    { t: 'p', html: '物理系统用四个回调把「撞上了」告诉脚本：<code>OnCollisionEnter</code>（实体碰撞开始）、<code>OnCollisionStay</code>（持续接触）、<code>OnCollisionExit</code>（分开），以及对应的 <code>OnTriggerEnter/Stay/Exit</code>。名字相近，语义完全不同：碰撞回调报告接触面的法线与冲量，触发回调只报告「谁进来了」。' },

    { t: 'p', html: '触发回调的生效条件是最容易记错的地方：<b>至少一方有刚体，且至少一方勾了 <code>Is Trigger</code></b>。两个静态碰撞体之间不会触发，两个触发器之间也不会（除非其中一方有刚体）。如果代码没错却没反应，先检查这两条，再检查层矩阵是否把两者的碰撞关掉了。' },

    { t: 'code', lang: 'csharp', caption: '触发区：拾取、伤害与一次性事件', code: `using UnityEngine;

public class PickupZone : MonoBehaviour
{
    [SerializeField] int scoreValue = 10;
    [SerializeField] AudioSource pickupSound;

    // 只在「进入」时结算，避免 Stay 每帧重复加分
    void OnTriggerEnter(Collider other)
    {
        if (!other.CompareTag("Player")) return;

        GameStats.AddScore(scoreValue);
        pickupSound.Play();

        // 关掉碰撞体而不是整个对象，音效还能播完
        GetComponent<Collider>().enabled = false;
    }
}` },

    { t: 'p', html: '注意 <code>other</code> 拿到的是「对方身上的某个碰撞体」，不是对象本身。玩家身上若挂了多个碰撞体（身体 + 攻击判定），<code>OnTriggerEnter</code> 可能触发多次。稳妥做法是在玩家根对象上放一个带标签的碰撞体专门做交互，或者用 <code>other.attachedRigidbody</code> 去重。另外，<code>CompareTag</code> 比 <code>tag == "Player"</code> 快，因为后者会分配字符串。' },

    { t: 'code', lang: 'csharp', caption: '碰撞回调：用接触法线判断「踩在头顶」还是「撞在侧面」', code: `using UnityEngine;

public class Stompable : MonoBehaviour
{
    [SerializeField] float bounceForce = 8f;

    void OnCollisionEnter(Collision collision)
    {
        if (!collision.collider.CompareTag("Player")) return;

        // 取第一个接触点的法线：从敌人指向玩家
        Vector3 normal = collision.contacts[0].normal;

        // 法线朝下，说明玩家在敌人上方，是踩踏
        if (normal.y < -0.5f)
        {
            var rb = collision.collider.attachedRigidbody;
            rb.velocity = new Vector3(rb.velocity.x, bounceForce, rb.velocity.z);
            Destroy(gameObject);
        }
        else
        {
            // 侧面撞上：玩家受伤，交给玩家自己的脚本处理
            collision.collider.SendMessage("TakeDamage", 1,
                SendMessageOptions.DontRequireReceiver);
        }
    }
}` },

    { t: 'p', html: '接触法线（contact normal）是碰撞回调里最有用的信息：它区分「踩头」与「撞墙」，也是判断可站立斜坡角度的依据。<code>collision.contacts[0]</code> 只是第一个接触点，多点碰撞时要遍历或取平均法线。示例里用 <code>SendMessage</code> 是为了少写引用，实际项目更推荐用接口或事件，性能与可读性都更好。' },

    { t: 'h', lvl: 2, text: '五、三种移动方式：位移、速度、力', id: 'ch03-5' },

    { t: 'p', html: '让一个有刚体的对象动起来，有三条路线，手感与适用场景差别很大。' },

    { t: 'table', head: ['方式', '写法', '手感', '适合'], rows: [
      ['<code>MovePosition</code>', '在 <code>FixedUpdate</code> 里给目标位置', '即时、精准，像贴地滑行', '平台跳跃、精确走位、移动平台'],
      ['<code>velocity</code>', '直接设 <code>rb.velocity</code>', '即时但保留物理响应（撞墙会被挡）', '第三人称、射击、有惯性的角色'],
      ['<code>AddForce</code>', '施加力或冲量', '有加速过程，重量感强', '物理玩具、爆炸、飞船、推箱子'],
      ['<code>transform.position</code>', '直接改坐标', '完全绕过物理', '相机、UI、无碰撞的装饰物']
    ], caption: '同一个角色可以混用：水平用 velocity，跳跃用 velocity.y，受击用 AddForce' },

    { t: 'p', html: '选择标准是「你要不要保留物理的反应」。平台跳跃要求落点精准，用 <code>MovePosition</code> 或速度直设；写实动作希望撞墙被挡住、被爆炸推开，就用 <code>velocity</code> 加 <code>AddForce</code>。唯一要避免的是<b>在 <code>Update</code> 里改 <code>transform.position</code> 去推有刚体的对象</b>：物理系统不知道你移动了它，下一帧会把对象拉回去，表现为抖动或穿墙。' },

    { t: 'p', html: '还有一个细节：<code>MovePosition</code> 与 <code>velocity</code> 都应在 <code>FixedUpdate</code> 里调用，并且位移量要乘 <code>Time.fixedDeltaTime</code>。如果在 <code>Update</code> 里调用 <code>MovePosition</code>，一帧内可能被调用多次或零次，轨迹会变得不可预测，高速时直接穿墙。' },

    { t: 'h', lvl: 2, text: '六、射线与查询：着地、射击、拾取', id: 'ch03-6' },

    { t: 'p', html: '射线检测（raycast）回答一个问题：<b>从 A 点沿某方向走，会不会撞到东西？撞到什么？</b>它在游戏里几乎无处不在：着地判定、射击命中、鼠标点选、AI 视线、传送落点。核心 API 是 <code>Physics.Raycast(origin, direction, out hit, distance, layerMask)</code>，返回布尔值表示是否命中，<code>hit</code> 里带碰撞体、点、法线与距离。' },

    { t: 'code', lang: 'csharp', caption: '着地检测：三条射线比一条稳', code: `using UnityEngine;

public class GroundCheck : MonoBehaviour
{
    [SerializeField] float rayLength = 1.1f;
    [SerializeField] LayerMask groundMask;
    [SerializeField] float coyoteTime = 0.1f;

    float lastGroundedTime;

    public bool IsGrounded { get; private set; }

    void Update()
    {
        // 从胶囊中心向下打三条：中间、左前、右前，避免站在边缘时误判
        Vector3 origin = transform.position;
        bool hitMid = Physics.Raycast(origin, Vector3.down, rayLength, groundMask);
        bool hitL = Physics.Raycast(origin + transform.forward * 0.2f + transform.right * -0.2f,
                                     Vector3.down, rayLength, groundMask);
        bool hitR = Physics.Raycast(origin + transform.forward * 0.2f + transform.right * 0.2f,
                                     Vector3.down, rayLength, groundMask);

        IsGrounded = hitMid || hitL || hitR;

        if (IsGrounded) lastGroundedTime = Time.time;
    }

    // 离开地面后仍允许短暂起跳，叫「土狼时间」，能显著改善手感
    public bool CanJump => Time.time - lastGroundedTime <= coyoteTime;
}` },

    { t: 'p', html: '这段代码包含两个实用技巧。<b>多射线</b>：单条射线在台阶边缘会打空，角色明明站着却不能跳；三条覆盖脚底一小片区域，判定稳定得多。<b>土狼时间（coyote time）</b>：玩家刚走出平台边缘的 0.1 秒内仍可起跳，因为人的反应有延迟，严格判定会让人频繁觉得「我明明按了」。这类「放宽一点点」的设计几乎总能提升手感。' },

    { t: 'p', html: '射线还要注意三件事。第一，<b>层遮罩要显式指定</b>，否则射线会打到自己身上的碰撞体，角色永远「站在自己头上」。第二，<b>起点不要贴在碰撞体表面</b>，留 0.01 的偏移，避免浮点误差导致的漏检。第三，<b>高速物体用 <code>RaycastAll</code> 或球形投射</b>，单条射线在子弹速度下会直接穿过去。' },

    { t: 'callout', kind: 'warn', title: '射线打不到东西的四个原因', html: '① 遮罩层没勾选，射线只检测指定层；② 起点在碰撞体内部，射线从内部射出不算命中；③ 距离太短，物体还在更远处；④ 目标只有触发器，而 <code>Physics.Raycast</code> 默认会命中触发器（需 <code>QueryTriggerInteraction.Ignore</code> 才忽略）。按这四条顺序排查，比反复改代码快。' },

    { t: 'h', lvl: 2, text: '七、四类常见物理故障', id: 'ch03-7' },

    { t: 'p', html: '下面四类故障占了物理问题的绝大多数，每一类都有明确的成因与固定修法。' },

    { t: 'table', head: ['故障', '表现', '成因', '修法'], rows: [
      ['穿墙 / 穿地', '高速移动时直接穿过碰撞体', '单步位移大于碰撞体厚度', '开 <code>Continuous</code> 碰撞检测、加厚碰撞体、限制最大速度'],
      ['角色抖动', '站在地面时轻微上下跳', '碰撞体与地面重叠，求解器反复推拉', '抬高角色起点、加 Skin Width、相机放 LateUpdate'],
      ['永久滑行', '松开按键仍缓慢移动', '没有阻力且速度未归零', '设 <code>velocity</code> 水平分量归零、加 Drag、勾 <code>Freeze Rotation</code>'],
      ['碰撞爆炸', '两个物体接触后突然飞出', '质量差过大或初始重叠，冲量被放大', '质量比控制在 1:10 内、避免初始重叠、限速']
    ], caption: '先按表现归类，再按成因修，不要凭感觉改参数' },

    { t: 'p', html: '穿墙值得单独说。物理引擎每步只检测「这一步结束时的位置」，如果子弹一步跨过 0.5 米而墙只有 0.2 米厚，它就检测不到中间的重叠。解决办法有三种：把 <code>Collision Detection</code> 设为 <code>Continuous</code>（对快速移动的刚体）、用射线代替物理碰撞（射击类首选）、或把墙加厚。三者可以叠加，射击游戏通常全用。' },

    { t: 'p', html: '抖动则多与「初始重叠」有关：角色胶囊底部正好嵌进地面 0.01 米，求解器每帧把它往上推，重力又把它拉下来，于是画面抖。把角色抬高 0.05 米出生、或者给胶囊加一点 <code>Skin Width</code>（默认 10% 半径）通常就能解决。如果只在相机上看到抖动，那不是物理问题，是相机跟随写在了 <code>Update</code> 里。' },

    { t: 'compare', left: { title: '用物理做碰撞', html: '给子弹挂刚体与球形碰撞体，速度 60 米/秒，靠 <code>OnCollisionEnter</code> 结算伤害。结果一半子弹穿墙，一半打中敌人却不掉血，因为碰撞回调在高速下被跳过。' }, right: { title: '用射线做命中', html: '子弹不挂刚体，开火时从枪口向前打一条射线，命中点生成弹孔与特效，伤害直接结算。判定确定、开销低、不会穿墙，还能顺便拿到法线做贴花朝向。' } },

    { t: 'h', lvl: 2, text: '八、把物理参数调成手感', id: 'ch03-8' },

    { t: 'p', html: '物理参数不是「物理正确」的问题，而是「感觉对不对」的问题。真实世界的重力是 9.81，但平台跳跃游戏常把重力调到 25–40，因为玩家不想等角色慢慢落下；写实射击游戏反而会把重力调低一点，让抛物线更可控。<b>先决定你想要的感觉，再去反推数值。</b>' },

    { t: 'steps', items: [
      { title: '第一步 · 写下三个形容词', html: '例如「轻盈、精准、略带惯性」。形容词就是验收标准，调参时反复对照。' },
      { title: '第二步 · 固定跳跃高度，调重力与初速', html: '跳跃高度 h = v² / (2g)。想要高 2 米，先定重力，再算初速；两者一起改会失去控制。' },
      { title: '第三步 · 调上升与下落的不对称', html: '下落阶段把重力乘以 1.5–2，落地更干脆，这是平台游戏最常用的一招。' },
      { title: '第四步 · 加缓冲', html: '土狼时间 0.1 秒、跳跃输入缓冲 0.1 秒、落地轻微压扁。三项加起来能显著减少「我明明按了」的抱怨。' },
      { title: '第五步 · 让同事盲测', html: '不告诉他们参数，只问「跳起来像什么」。三人中有两人说出你写的形容词，就调对了。' }
    ] },

    { t: 'p', html: '最后提醒一句：<b>物理参数要集中管理</b>。把重力、速度、跳跃初速放进一个 <code>[SerializeField]</code> 区或 ScriptableObject，不要散落在十个脚本里。改手感时你会在几十组数值之间来回试，集中管理能把每次试验的成本从十分钟降到十秒。' },

    { t: 'terms', items: [
      { en: 'Rigidbody', zh: '刚体', html: '把对象交给物理系统模拟的组件，决定质量、受力与碰撞响应。' },
      { en: 'collider', zh: '碰撞体', html: '定义对象碰撞形状的组件，触发器与实体碰撞共用同一套形状。' },
      { en: 'trigger', zh: '触发器', html: '勾选 Is Trigger 的碰撞体，不阻挡移动，只报告进入与离开。' },
      { en: 'raycast', zh: '射线检测', html: '从一点沿方向投射射线，返回是否命中与命中信息，用于着地、射击、拾取。' },
      { en: 'layer mask', zh: '层遮罩', html: '用位掩码指定射线或碰撞只作用于哪些层，兼顾正确性与性能。' },
      { en: 'continuous collision', zh: '连续碰撞检测', html: '对高速刚体在步与步之间补做检测，避免隧穿。' },
      { en: 'coyote time', zh: '土狼时间', html: '离开平台后仍允许短暂起跳的宽容窗口，用来补偿人的反应延迟。' },
      { en: 'fixedDeltaTime', zh: '固定步长', html: '物理计算的时间间隔，默认 0.02 秒，与渲染帧率无关。' }
    ] },

    { t: 'quiz', qid: 'ch03-q1' },
    { t: 'quiz', qid: 'ch03-q2' },
    { t: 'quiz', qid: 'ch03-q3' },

    { t: 'keypoint', items: [
      { title: '三件套缺一不可', html: '刚体给质量与受力，碰撞体给形状，物理材质给摩擦与弹性；缺哪个都会表现出「不物理」的行为。' },
      { title: '触发器需要刚体与勾选', html: '至少一方有刚体、至少一方是 Trigger，两个条件同时满足才会回调。' },
      { title: '移动方式决定手感', html: 'MovePosition 精准、velocity 保留碰撞响应、AddForce 有重量；别在 Update 里改 transform 推物理对象。' },
      { title: '射线是查询，不是碰撞', html: '射击、着地、拾取用射线更稳更省；记得指定层遮罩并避开自身碰撞体。' },
      { title: '故障按表现归类', html: '穿墙看连续检测，抖动看初始重叠，滑行看速度归零，爆炸看质量比。' }
    ] },

    { t: 'checklist', id: 'ch03', items: [
      '我能说出刚体、碰撞体、物理材质各自缺失时会出现什么现象',
      '我理解 Freeze Rotation 为什么对角色控制器几乎是必选项',
      '我能解释触发器生效的两个条件，并知道缺一个会怎样',
      '我能用接触法线区分踩踏与侧面撞击',
      '我能在 MovePosition、velocity、AddForce 之间按需求选一种并说明理由',
      '我用三条射线做地面判定，并知道为什么单条不够',
      '我知道射线打不到东西的四种常见原因与排查顺序',
      '我遇到过穿墙或抖动，并用本章的方法定位到成因',
      '我能把跳跃手感拆成重力、初速、下落倍率与缓冲四个可调项',
      '我试过用形容词验收手感，并让至少一位同学盲测'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 ECE3200 Lab 2 讲义（Introduction to Unity Physical Engine）与 Lab 2 Guidance 编写，覆盖刚体参数、碰撞体选型、碰撞与触发回调、三种移动方式、射线查询与常见故障。Lab 2 中的具体场景搭建步骤与官方示例工程未逐条复述，只保留判断依据；射线着地、土狼时间与踩踏判定为本章补充的实践写法，不属于讲义原文。重力与速度的示例数值针对 1 单位 = 1 米、角色高 1.8 米的尺度给出，若你的关卡尺度不同，所有数值需按比例缩放。层名与遮罩请按课程工程约定设置，不要与既有层冲突。' }
  ]
});
