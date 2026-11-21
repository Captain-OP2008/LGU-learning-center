/* =====================================================================
 * ch02.js · 第 2 章「Unity 与 C#：场景、对象与脚本」
 * 职责：把第 0 章的组件模型展开成可操作的工程知识：场景与预制体、生命周期、
 *       引用与序列化、时间与输入、协程、调试与命名规范。
 * 依据：Lab 1 讲义与答疑（Intro to Unity and C#）、课程工程模板。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch02',
  num: '02',
  title: 'Unity 与 C#：场景、对象与脚本',
  en: 'SCENES & SCRIPTS',
  goals: [
    '说清场景（Scene）、游戏对象（GameObject）、组件（Component）与预制体（Prefab）的分工',
    '按 UnityEngine 的执行顺序解释 Awake、OnEnable、Start、FixedUpdate、Update、LateUpdate 的调用时机',
    '正确使用 GetComponent 缓存引用与 [SerializeField] 暴露字段，避免运行时空引用',
    '写出读取输入、按帧率无关的速度移动的角色脚本，并说明为什么不用 deltaTime 会出问题',
    '用协程把一个多步流程写成可读、可中断的代码，并知道它与 Update 的分工',
    '按命名与目录规范组织一个能被队友接手的 Unity 工程'
  ],
  kp: [
    { id: 'ch02-1', title: '场景、对象、预制体：三层组织' },
    { id: 'ch02-2', title: '组件的组合与通信方式' },
    { id: 'ch02-3', title: 'MonoBehaviour 生命周期与执行顺序' },
    { id: 'ch02-4', title: '引用、序列化与空引用' },
    { id: 'ch02-5', title: '时间与帧：三种 Update 的分工' },
    { id: 'ch02-6', title: '输入读取与帧率无关的移动' },
    { id: 'ch02-7', title: '协程与多步流程' },
    { id: 'ch02-8', title: '调试、命名与工程规范' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '这一章决定你后面能走多远', html: 'Lab 2 之后的每一次作业，都假设你已掌握本章的内容：知道脚本挂在哪里、什么时候被调用、引用从哪里来。很多同学在物理、相机、UI 环节卡住，回头发现根因在这里——把初始化写错生命周期、把 <code>GetComponent</code> 写在每帧里、把输入写在 <code>FixedUpdate</code> 里。这些不是「高级技巧」，而是<b>地基</b>。地基歪了，后面每一层都要返工。' },

    { t: 'p', lead: true, html: '本章按「组织 → 组件 → 生命周期 → 引用 → 时间 → 输入 → 协程 → 调试」的顺序展开，每一节都对应 Lab 1 讲义里的一个片段，但把「怎么做」补成了「为什么这样做」。读完你应该能独立写出一个可复用、无空引用、不受帧率影响的主角控制脚本。' },

    { t: 'h', lvl: 2, text: '一、场景、对象、预制体：三层组织', id: 'ch02-1' },

    { t: 'p', html: 'Unity 用三个层级来组织内容。<b>场景（Scene）</b>是关卡或界面的一次快照，里面装着当时存在的所有对象；一个游戏通常有 Boot 场景、主菜单场景、若干关卡场景。<b>游戏对象（GameObject）</b>是场景里的一个实体，它只有名字、标签、层和一个 Transform，其余一切能力来自挂载的组件。<b>预制体（Prefab）</b>是可复用的对象模板，存在于 <code>Assets/</code> 里，能被多个场景反复实例化。' },

    { t: 'p', html: '三者关系可以这样记：<b>预制体是模板，场景是舞台，对象是演员。</b>在场景里改一个对象，只影响这一次演出；把改动 Apply 回预制体，才会影响所有引用它的地方。这条规则解释了两类常见困惑：为什么我改了一个敌人的血量，另一个敌人没变（因为它们各自是独立实例，没连到同一个预制体）；为什么我明明改好了，第二天打开又变回去（改的是实例，并且没保存场景）。' },

    { t: 'table', head: ['层级', '存在位置', '影响范围', '典型用途'], rows: [
      ['场景 Scene', '<code>Assets/Scenes/*.unity</code>', '独立，加载时才存在', '关卡、菜单、过场'],
      ['预制体 Prefab', '<code>Assets/Prefabs/*.prefab</code>', '所有实例共享模板', '玩家、敌人、道具、UI 面板'],
      ['游戏对象 GameObject', '场景内', '仅当前场景的当前实例', '摆放、微调、临时对象'],
      ['脚本资产 Script', '<code>Assets/Scripts/*.cs</code>', '所有挂载它的对象', '逻辑复用'],
      ['ScriptableObject', '<code>Assets/Data/*.asset</code>', '数据资产，可在多处引用', '武器数值表、关卡配置']
    ], caption: '先判断「这个改动该影响谁」，再决定改哪一层' },

    { t: 'p', html: '场景设计有两条实践建议。第一，<b>一个场景只做一件事</b>：把菜单、关卡、结算拆开，加载时用 <code>SceneManager.LoadScene</code> 切换，避免一个巨型场景承载所有状态。第二，<b>把会在运行中反复生成的东西做成预制体</b>：子弹、敌人、飘字、掉落物。预制体让你在编辑器里调好一次，代码里只负责 <code>Instantiate</code>，不用在运行时拼装对象。' },

    { t: 'h', lvl: 2, text: '二、组件的组合与通信方式', id: 'ch02-2' },

    { t: 'p', html: '组件模型解决了「能力从哪来」，但没解决「组件之间怎么说话」。Unity 里常见四种通信方式，各有适用场景，混用是项目失控的主因之一。' },

    { t: 'table', head: ['方式', '怎么用', '优点', '风险'], rows: [
      ['直接引用', '<code>public Player player;</code> 在 Inspector 拖入', '直观、能在编辑器里看到连线', '耦合强，换场景易丢引用'],
      ['GetComponent', '<code>GetComponent&lt;Rigidbody&gt;()</code>', '同一对象内取组件最方便', '写在 <code>Update</code> 里会持续分配与查找'],
      ['事件 / 委托', '<code>public event Action&lt;int&gt; OnScore;</code>', '发送方不认识接收方，解耦', '忘记退订会报空引用'],
      ['单例 / 管理器', '<code>GameManager.Instance</code>', '全局访问方便', '滥用会变成隐式全局状态，难测试']
    ], caption: '优先同对象用 GetComponent，跨对象用事件，全局状态最后才考虑' },

    { t: 'p', html: '选择原则很简单：<b>能局部就不要全局</b>。玩家血量变化，只有血条与音效关心，用事件；关卡切换，需要多个系统响应，用一个 <code>GameManager</code> 单例；同一对象上要拿刚体，<code>GetComponent</code> 在 <code>Awake</code> 里缓存一次即可。反过来，如果每个脚本都能随手访问 <code>GameManager.Instance.player.health</code>，那任何一个字段改名都会引发连锁修改，项目会在两周内变得不敢动。' },

    { t: 'code', lang: 'csharp', caption: '同一对象内取组件：在 Awake 缓存一次', code: `using UnityEngine;

[RequireComponent(typeof(Rigidbody), typeof(CapsuleCollider))]
public class PlayerRefs : MonoBehaviour
{
    // 需要的组件在挂脚本时自动补齐，避免「忘了挂刚体」导致的诡异行为
    Rigidbody rb;
    CapsuleCollider col;
    Animator anim;

    void Awake()
    {
        rb = GetComponent<Rigidbody>();
        col = GetComponent<CapsuleCollider>();
        anim = GetComponentInChildren<Animator>(); // 模型在子对象上
    }

    void FixedUpdate()
    {
        // 直接使用缓存，不要在这里再 GetComponent
        rb.AddForce(Vector3.forward * 10f, ForceMode.Acceleration);
    }
}` },

    { t: 'p', html: '<code>[RequireComponent]</code> 是低成本的保险：它保证挂脚本时对象上已有指定组件，缺失会自动补上，删也删不掉。对依赖刚体、碰撞体、音频源的脚本都建议加。另一条经验是 <b>Awake 只做「拿引用」</b>，不要在这里读别的对象的状态，因为它们的 Awake 可能还没跑。' },

    { t: 'h', lvl: 2, text: '三、MonoBehaviour 生命周期与执行顺序', id: 'ch02-3' },

    { t: 'p', html: 'Unity 的脚本不是「被 main 函数调用」，而是由引擎在特定时机回调一组固定名字的方法，这组方法统称生命周期（lifecycle）。记住顺序，你就知道代码该写在哪；记不住，就会出现「引用为空」「初始化被覆盖」「每帧卡顿」这类问题。' },

    { t: 'table', head: ['回调', '调用时机', '典型用途', '不要做什么'], rows: [
      ['<code>Awake</code>', '对象实例化后、启用前，只一次', '缓存自身组件、初始化内部状态', '读取其他对象的数据'],
      ['<code>OnEnable</code>', '每次组件启用', '订阅事件、注册到管理器', '假设 <code>Start</code> 已跑过'],
      ['<code>Start</code>', '首次启用后的第一帧前，只一次', '使用其他对象已就绪的引用', '做耗时初始化'],
      ['<code>FixedUpdate</code>', '固定时间步，默认 0.02 秒', '刚体、力、射线检测', '读输入、做 UI'],
      ['<code>Update</code>', '每帧一次', '输入、相机、动画参数、计时', '直接改刚体位置'],
      ['<code>LateUpdate</code>', '所有 Update 之后', '相机跟随、IK、覆盖性修正', '修改物理'],
      ['<code>OnDisable</code> / <code>OnDestroy</code>', '禁用 / 销毁时', '退订事件、释放资源', '访问已销毁对象']
    ], caption: '同一帧内的顺序：Awake → OnEnable → Start → FixedUpdate → Update → LateUpdate' },

    { t: 'p', html: '两个容易混淆的点。第一，<b><code>Awake</code> 与 <code>Start</code> 的差别在「依赖」</b>：<code>Awake</code> 时其他对象的 <code>Awake</code> 可能还没跑，所以只处理自己；<code>Start</code> 在所有对象 <code>Awake</code> 之后，可以安全使用别人的引用。第二，<b><code>FixedUpdate</code> 与 <code>Update</code> 的差别在「时间」</b>：物理步长固定，渲染帧长随负载波动。把输入放 <code>FixedUpdate</code> 会漏按键（一帧可能对应零次或多次物理步），把刚体移动放 <code>Update</code> 会抖动。' },

    { t: 'callout', kind: 'exam', title: '考点提示：执行顺序题', html: '常见问法是「A 脚本的 <code>Start</code> 与 B 脚本的 <code>Awake</code> 谁先」。答案是<b>不确定</b>：同一阶段内不同脚本的顺序由引擎决定，可以用 Script Execution Order 手动指定，但更稳的做法是不依赖它——用事件或显式初始化方法解耦。能说出「不依赖顺序」比背出顺序更得分。' },

    { t: 'h', lvl: 2, text: '四、引用、序列化与空引用', id: 'ch02-4' },

    { t: 'p', html: '<b>序列化（serialization）</b>是 Unity 把 Inspector 里设置的值存进场景或预制体的机制。只有 <code>public</code> 字段，或标注了 <code>[SerializeField]</code> 的 <code>private</code> 字段，才会被序列化并显示在 Inspector 里。<code>static</code> 字段、属性（property）、<code>readonly</code> 字段都不会显示——这是「我明明声明了变量，Inspector 里却没有」的唯一原因。' },

    { t: 'p', html: '推荐写法是字段 <code>private</code> 加 <code>[SerializeField]</code>，对外的读取用属性暴露。这样 Inspector 仍可配置，代码里却不会被其他脚本随意改写，边界清晰。命名上用小驼峰，Inspector 会显示成带空格的标题，可读性够用，不必额外加 <code>[Header]</code> 除非字段很多。' },

    { t: 'code', lang: 'csharp', caption: '推荐的字段写法与空引用防御', code: `using UnityEngine;

public class Turret : MonoBehaviour
{
    [Header("配置")]
    [SerializeField] float range = 12f;
    [SerializeField] float fireInterval = 0.8f;

    [Header("引用")]
    [SerializeField] Transform muzzle;
    [SerializeField] GameObject bulletPrefab;

    public float Range => range;

    float timer;

    void Awake()
    {
        // 引用类字段忘了在 Inspector 拖，运行时就是 null，早报早改
        if (muzzle == null || bulletPrefab == null)
        {
            Debug.LogError($"{name}: 枪口或子弹预制体未赋值", this);
            enabled = false;
            return;
        }
    }

    void Update()
    {
        timer += Time.deltaTime;
        if (timer >= fireInterval)
        {
            timer = 0f;
            Fire();
        }
    }

    void Fire()
    {
        Instantiate(bulletPrefab, muzzle.position, muzzle.rotation);
    }
}` },

    { t: 'p', html: '<code>Debug.LogError</code> 的第二个参数传 <code>this</code> 时，点击 Console 里的报错会直接在 Hierarchy 里高亮这个对象，排查效率比打印字符串高得多。另外，<code>enabled = false</code> 让脚本在配置不全时停止工作，比让它带着 <code>null</code> 每帧抛异常干净——后者会刷满 Console，把真正的错误挤掉。' },

    { t: 'compare', left: { title: '反例：每帧查找与拼装', html: '在 <code>Update</code> 里写 <code>GetComponent&lt;Rigidbody&gt;()</code>、<code>GameObject.Find("Player")</code>、字符串拼接日志。功能能跑，但每帧都有查找与内存分配，场景一复杂帧率就掉，Profiler 里 GC Alloc 高得离谱。' }, right: { title: '正例：缓存与预分配', html: '在 <code>Awake</code> 缓存组件与引用，日志只在状态变化时打，频繁生成的对象用对象池。代码看起来多几行，但帧时间稳定，问题也更容易定位。' } },

    { t: 'h', lvl: 2, text: '五、时间与帧：三种 Update 的分工', id: 'ch02-5' },

    { t: 'p', html: 'Unity 里有两个时间概念。<code>Time.deltaTime</code> 是上一帧到这一帧的秒数，随帧率变化；<code>Time.fixedDeltaTime</code> 是物理步的固定长度，默认 0.02 秒（即每秒 50 次物理计算）。想做「每秒移动 5 米」，就必须乘上对应的 delta，否则速度会随机器性能变化——在 30 帧的机器上看起来慢一半，玩家会以为游戏卡了。' },

    { t: 'p', html: '三种 Update 的分工可以这样记：<b><code>Update</code> 管「这一帧要做什么」，<code>FixedUpdate</code> 管「物理这一步怎么算」，<code>LateUpdate</code> 管「在所有移动都算完之后再修正什么」</b>。相机跟随最典型：如果写在 <code>Update</code> 里，它可能在玩家移动之前执行，画面就会抖一帧；写在 <code>LateUpdate</code> 里，永远在玩家之后，画面平滑。' },

    { t: 'table', head: ['需求', '该用哪个', '原因'], rows: [
      ['读取按键、鼠标', '<code>Update</code>', '输入是每帧采样的，物理步可能一帧零次或多次'],
      ['给刚体加力、改速度', '<code>FixedUpdate</code>', '与物理步对齐，避免抖动与穿透'],
      ['相机跟随、瞄准', '<code>LateUpdate</code>', '在所有对象移动之后执行，画面不滞后'],
      ['倒计时、冷却', '<code>Update</code> + <code>deltaTime</code>', '按真实时间走，与帧率无关'],
      ['动画参数', '<code>Update</code>', '动画在渲染前采样即可'],
      ['周期性生成敌人', '协程 <code>WaitForSeconds</code>', '可读性好，能随时停止']
    ], caption: '先问「这件事和物理步有关吗」，再决定放哪里' },

    { t: 'p', html: '还有一个常被忽略的量：<code>Time.timeScale</code>。把它设成 0 会暂停所有基于 deltaTime 与物理的更新，但 <code>Update</code> 仍会被调用（deltaTime 变成 0），所以暂停菜单要用 <code>timeScale = 0</code> 配合 <code>unscaledDeltaTime</code> 做界面动画。这也是「暂停后 UI 动不了」的常见原因。' },

    { t: 'h', lvl: 2, text: '六、输入读取与帧率无关的移动', id: 'ch02-6' },

    { t: 'p', html: '课程 Lab 使用 Unity 的传统输入接口（Input Manager），核心就三个：<code>Input.GetAxis("Horizontal")</code> 返回 −1 到 1 的平滑值，<code>Input.GetAxisRaw</code> 返回 −1、0、1 的离散值，<code>Input.GetKeyDown</code> 判断这一帧是否按下。做角色移动通常用 <code>GetAxis</code> 做平滑转向，用 <code>GetKeyDown</code> 做跳跃这类一次性动作。' },

    { t: 'p', html: '移动实现有两条路线：改 <code>transform.position</code>（不经过物理，适合无碰撞的相机或 UI）与用刚体（<code>MovePosition</code>、<code>velocity</code>、<code>AddForce</code>，参与碰撞检测）。有碰撞体的角色应该走刚体路线，否则会穿墙、被物理系统「弹开」。下面这段是最小可用的第三人称移动骨架。' },

    { t: 'code', lang: 'csharp', caption: '输入 + 刚体移动：注意 deltaTime 与 FixedUpdate 的配合', code: `using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public class PlayerMotor : MonoBehaviour
{
    [SerializeField] float moveSpeed = 6f;
    [SerializeField] float turnSpeed = 720f;
    [SerializeField] float jumpSpeed = 5f;

    Rigidbody rb;
    Vector3 inputDir;

    void Awake()
    {
        rb = GetComponent<Rigidbody>();
        rb.freezeRotation = true; // 防止碰撞把角色撞倒
    }

    void Update()
    {
        // 输入每帧采样，但只记录方向，不在这里推物理
        float h = Input.GetAxis("Horizontal");
        float v = Input.GetAxis("Vertical");
        inputDir = new Vector3(h, 0f, v);

        if (inputDir.sqrMagnitude > 1f) inputDir.Normalize();

        if (Input.GetKeyDown(KeyCode.Space) && IsGrounded())
        {
            rb.velocity = new Vector3(rb.velocity.x, jumpSpeed, rb.velocity.z);
        }
    }

    void FixedUpdate()
    {
        // 水平速度直接设，竖直速度交给重力，避免把跳跃覆盖掉
        Vector3 target = inputDir * moveSpeed;
        rb.velocity = new Vector3(target.x, rb.velocity.y, target.z);

        if (inputDir.sqrMagnitude > 0.01f)
        {
            Quaternion targetRot = Quaternion.LookRotation(inputDir);
            rb.MoveRotation(Quaternion.RotateTowards(
                rb.rotation, targetRot, turnSpeed * Time.fixedDeltaTime));
        }
    }

    bool IsGrounded()
    {
        // 从胶囊底部往下打一条短射线，忽略自身碰撞体
        return Physics.Raycast(transform.position, Vector3.down, 1.1f);
    }
}` },

    { t: 'p', html: '这段代码里有三个值得记住的细节。<b>第一</b>，水平速度用「直接设」而不是「累加力」，角色才有即时响应；竖直速度保留 <code>rb.velocity.y</code>，否则每次移动都会把跳跃速度清零，人物永远跳不起来。<b>第二</b>，旋转用 <code>MoveRotation</code> 而不是 <code>transform.rotation</code>，让物理系统知道对象转过来了。<b>第三</b>，着地判定用短射线而不是 <code>OnCollisionEnter</code>，因为后者在斜面与边缘上不可靠。' },

    { t: 'callout', kind: 'warn', title: '输入相关的三个经典坑', html: '<b>坑一：把 <code>GetKeyDown</code> 写在 <code>FixedUpdate</code> 里。</b>一帧可能没有物理步，按键被吞掉。跳到 <code>Update</code> 里记录「本帧想跳」，在 <code>FixedUpdate</code> 里执行。<br><b>坑二：没检查 <code>timeScale</code>。</b>暂停时 <code>GetAxis</code> 仍在读，角色会在菜单后面偷偷移动。<br><b>坑三：多个脚本同时改 <code>velocity</code>。</b>移动脚本设水平速度、跳跃脚本设整条速度，互相覆盖。约定「只有一个脚本负责刚体速度」能省掉大量玄学 bug。' },

    { t: 'h', lvl: 2, text: '七、协程与多步流程', id: 'ch02-7' },

    { t: 'p', html: '有些逻辑天然是「分几步、隔一段时间」的：开火后冷却、受伤后无敌闪烁、Boss 出场先吼再冲。用 <code>Update</code> 加计时器能写，但状态一多就变成一堆 <code>if (timer &gt; x)</code>。协程（coroutine）把这类流程写成顺序代码，用 <code>yield return</code> 表示「在这里等」。' },

    { t: 'code', lang: 'csharp', caption: '协程：无敌帧与受击闪烁', code: `using System.Collections;
using UnityEngine;

public class Damageable : MonoBehaviour
{
    [SerializeField] float invincibleTime = 1.2f;
    [SerializeField] Renderer body;

    bool invincible;
    public bool IsInvincible => invincible;

    public void TakeDamage(int amount)
    {
        if (invincible) return;

        // ……扣血逻辑……
        StartCoroutine(InvincibleRoutine());
    }

    IEnumerator InvincibleRoutine()
    {
        invincible = true;

        float t = 0f;
        while (t < invincibleTime)
        {
            body.enabled = !body.enabled;   // 闪烁
            yield return new WaitForSeconds(0.1f);
            t += 0.1f;
        }

        body.enabled = true;
        invincible = false;
    }

    void OnDisable()
    {
        // 对象被禁用时协程会停，显式恢复状态避免下次启用时是隐形的
        body.enabled = true;
        invincible = false;
    }
}` },

    { t: 'p', html: '三条纪律。<b>一是协程属于启动它的 MonoBehaviour</b>，对象被禁用或销毁，协程就停，所以清理逻辑要放在 <code>OnDisable</code>。<b>二是 <code>WaitForSeconds</code> 受 <code>timeScale</code> 影响</b>，暂停时不会推进；界面动画要用 <code>WaitForSecondsRealtime</code>。<b>三是不要在协程里写死循环等待某个条件</b>，条件永不满足时它会一直存在，用 <code>yield return new WaitUntil(() =&gt; cond)</code> 更清晰，也便于加超时。' },

    { t: 'p', html: '协程不是线程，它仍然在主线程上跑，只是被引擎分帧调度。所以协程里不能做耗时计算（比如生成大网格），那一样会卡帧。真正的重活要用分帧处理或后台线程，这一点在第 07 章的性能优化里还会提到。' },

    { t: 'h', lvl: 2, text: '八、调试、命名与工程规范', id: 'ch02-8' },

    { t: 'p', html: '调试的第一步永远是<b>读 Console 的第一条红字</b>。Unity 的异常会连锁：第一条通常是根因，后面几十条是同一个空引用被不同脚本触发。双击报错跳到行号，看那一行用了哪个为 <code>null</code> 的字段，再回到 Inspector 看它为什么没被赋值——这条路径能解决八成问题。' },

    { t: 'p', html: '第二步是<b>用日志验证假设，而不是猜</b>。在关键分支前打印状态：<code>Debug.Log($"grounded={grounded}, vy={rb.velocity.y}")</code>。日志要带上下文（对象名、关键数值），不要只打「到这里了」。第三步才是断点：Visual Studio 附加到 Unity 进程，在可疑行下断点，逐帧看变量。断点适合逻辑错误，日志适合时序问题。' },

    { t: 'table', head: ['规范', '做法', '收益'], rows: [
      ['命名', '类名 PascalCase，字段 camelCase，常量全大写', '搜索与阅读成本低'],
      ['目录', 'Art / Audio / Prefabs / Scenes / Scripts / Settings', '队友能猜到东西在哪'],
      ['脚本职责', '一个脚本一件事，超过 300 行就考虑拆分', '改一处不会牵动全局'],
      ['魔法数字', '提取为 <code>[SerializeField]</code> 字段或常量', '调参不用改代码、不用重编译'],
      ['引用检查', '<code>Awake</code> 里判空并 <code>Debug.LogError</code>', '问题在启动时暴露，而不是十分钟后'],
      ['版本管理', '只提交 Assets / ProjectSettings / Packages', '仓库体积可控，冲突更少']
    ], caption: '规范不是审美问题，它直接影响返工次数' },

    { t: 'p', html: '最后一条常被忽视：<b>给公共字段写一句注释说明单位</b>。`speed = 6` 是每秒 6 米还是每帧 6 单位？`range = 12` 是米还是格？队友（以及三个月后的你）没有义务猜。写清单位与取值范围，比写一段漂亮的架构文档有用得多。' },

    { t: 'terms', items: [
      { en: 'Scene', zh: '场景', html: '关卡或界面的一次快照，保存其中所有对象与组件设置。' },
      { en: 'Prefab', zh: '预制体', html: '可复用的对象模板；修改模板会同步到所有实例。' },
      { en: 'MonoBehaviour', zh: '脚本基类', html: 'Unity 中挂在对象上的脚本基类，提供生命周期回调与协程能力。' },
      { en: 'lifecycle', zh: '生命周期', html: 'Awake、Start、Update 等由引擎在固定时机回调的方法序列。' },
      { en: 'serialization', zh: '序列化', html: '把字段值保存进场景或预制体的机制，只对 public 或 [SerializeField] 字段生效。' },
      { en: 'deltaTime', zh: '帧间隔', html: '上一帧到这一帧的秒数；乘上它，速度才与帧率无关。' },
      { en: 'coroutine', zh: '协程', html: '用 yield 分帧执行的多步流程，仍在主线程，不是线程。' },
      { en: 'null reference', zh: '空引用', html: '访问未赋值对象的成员所抛的异常，Unity 中最常见的运行时错误。' }
    ] },

    { t: 'quiz', qid: 'ch02-q1' },
    { t: 'quiz', qid: 'ch02-q2' },
    { t: 'quiz', qid: 'ch02-q3' },

    { t: 'keypoint', items: [
      { title: '预制体是模板，场景是舞台', html: '改实例只影响当前场景，Apply 回预制体才影响所有引用处。' },
      { title: '生命周期决定代码位置', html: 'Awake 拿引用、Start 用引用、Update 读输入、FixedUpdate 推物理、LateUpdate 修相机。' },
      { title: '引用要缓存并早检查', html: 'GetComponent 放 Awake，字段判空在启动时 LogError，别等运行时每帧抛异常。' },
      { title: '速度必须乘 delta', html: '不乘 deltaTime 的速度会随帧率变化；物理步用 fixedDeltaTime。' },
      { title: '协程解决多步流程', html: '用 yield 表达等待，用 OnDisable 清理，用 WaitForSecondsRealtime 避免被 timeScale 冻结。' }
    ] },

    { t: 'checklist', id: 'ch02', items: [
      '我能不看文档说出 Awake、Start、Update、FixedUpdate、LateUpdate 的调用顺序',
      '我能解释为什么输入要放在 Update、刚体速度要放在 FixedUpdate',
      '我写出了带 [SerializeField]、判空与 RequireComponent 的组件脚本',
      '我知道 GetComponent 为什么要缓存，以及不缓存会在 Profiler 里看到什么',
      '我做出一个能用 WASD 移动、能跳、相机平滑跟随的角色',
      '我知道角色移动为什么保留 rb.velocity.y，去掉会怎样',
      '我能用协程写出无敌帧闪烁，并知道对象被禁用时协程会怎样',
      '我能读懂 Console 的第一条报错并定位到具体行与字段',
      '我的工程目录符合 Art / Audio / Prefabs / Scenes / Scripts / Settings 结构',
      '我知道哪些目录不该提交到 Git，并已在 .gitignore 里排除'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 ECE3200 Lab 1 讲义（Intro to Unity and C#）与课程工程模板编写，覆盖场景与预制体、组件通信、MonoBehaviour 生命周期、序列化与引用、Update 系列、传统输入接口、协程与调试规范。Lab 1 讲义中的编辑器面板截图与菜单路径未逐条复述，只保留判断依据与易错点；移动与协程示例为本章自拟，参数值（速度 6、跳跃 5、无敌 1.2 秒）仅作演示，实际应按关卡尺度调整。若课程改用新版 Input System，读取输入的 API 会变，但「输入在 Update 采样、物理在 FixedUpdate 执行」的分工不变。' }
  ]
});
