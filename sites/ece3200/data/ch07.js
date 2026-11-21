/* =====================================================================
 * ch07.js · 第 7 章「3D 进阶与交付：从原型到可玩成品」
 * 职责：把前六章的内容收束成一条交付链：动画与 AI、关卡流程、性能优化、
 *       打包设置、试玩迭代与最终演示。
 * 依据：Lab 8 讲义（Introduction to 3D game design part 3）、Lab 8 Guidance Part 3
 *       与 Final Project Guidance。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch07',
  num: '07',
  title: '3D 进阶与交付：从原型到可玩成品',
  en: 'SHIP IT',
  goals: [
    '把「做完」拆成可验证的四个阶段，并为每个阶段设明确的完成标准',
    '用 Animator 状态机与动画事件驱动角色动作，知道根运动与混合树的作用',
    '用 NavMesh 搭出会巡逻、会追击、会放弃的敌人 AI，并处理卡住与掉队',
    '定位并修复帧率、内存与加载三类性能问题，能读懂 Profiler 的主要面板',
    '正确配置打包设置，导出一个能在别人电脑上直接运行的版本',
    '组织一次有效试玩与一场五分钟演示，把设计决策讲清楚'
  ],
  kp: [
    { id: 'ch07-1', title: '四个阶段：可玩、完整、打磨、交付' },
    { id: 'ch07-2', title: 'Animator：状态机、混合树与事件' },
    { id: 'ch07-3', title: 'NavMesh 与敌人 AI' },
    { id: 'ch07-4', title: '关卡流程、存档与检查点' },
    { id: 'ch07-5', title: '性能优化：Profiler 与对象池' },
    { id: 'ch07-6', title: '打包与平台设置' },
    { id: 'ch07-7', title: '试玩、反馈与迭代' },
    { id: 'ch07-8', title: '演示、文档与作品集' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '「快做完了」是最危险的时刻', html: '学生项目最常见的失败不是做不出来，而是<b>做出来了但交不出去</b>：场景能跑，打包报错；功能齐全，帧率 20；演示时找不到该展示哪一段。原因几乎都是把「功能完成」当成「项目完成」。真正的完成包含四件事：能跑、能玩完、不崩、能讲清楚。这一章就是把这四件事变成可执行的清单。' },

    { t: 'p', lead: true, html: '本章按交付顺序展开：先把原型推进成完整关卡（动画、AI、流程），再做性能与打包保证能跑，接着用试玩把「能玩」变成「好玩」，最后准备演示与文档。每一步都有明确的验收标准，达不到就不要进入下一步——这是按时交付的唯一办法。' },

    { t: 'h', lvl: 2, text: '一、四个阶段：可玩、完整、打磨、交付', id: 'ch07-1' },

    { t: 'p', html: '把项目分成四个阶段，每个阶段有一个「完成」的定义。<b>可玩（playable）</b>：核心循环能跑通，玩家能失败也能赢，但只有灰盒场景。<b>完整（complete）</b>：有开始、有过程、有结束，所有关键系统都在。<b>打磨（polished）</b>：反馈齐全、没有明显 bug、帧率稳定。<b>交付（shipped）</b>：能打包、能在别人机器上运行、有演示材料。' },

    { t: 'p', html: '阶段之间不要跳。最常见的时间黑洞是：可玩阶段还没通过（核心循环不好玩），就开始做美术与特效，结果做到打磨阶段发现要推翻重来，时间全浪费。判断「可玩」的标准很简单：<b>找三个没看过项目的人，不给提示，让他们玩五分钟，其中至少两人能自己完成一次完整循环并且想再来一次。</b>达不到就不要往下走。' },

    { t: 'table', head: ['阶段', '完成标准', '时间占比参考', '常见错误'], rows: [
      ['可玩 Playable', '核心循环跑通、能输能赢、三人试玩通过', '30%', '灰盒阶段就纠结美术'],
      ['完整 Complete', '有关卡流程、有开始与结束、系统齐全', '30%', '功能一直加，收不住'],
      ['打磨 Polished', '反馈齐全、无阻塞性 bug、帧率稳定', '25%', '把 debug 当打磨'],
      ['交付 Shipped', '能打包、能演示、有文档', '15%', '最后一天才第一次打包']
    ], caption: '四阶段的比例不是规定，但「交付只留 15%」是惨痛教训换来的' },

    { t: 'p', html: '时间安排上，把交付阶段提前到倒数第二周，留出至少一周给「打包后才发现的问题」。打包会暴露一类编辑器里看不到的错误：路径大小写、资源未包含、平台 API 差异、着色器变体缺失。这些问题修起来不复杂，但需要时间发现，而发现的前提是你真的打过一次包。' },

    { t: 'h', lvl: 2, text: '二、Animator：状态机、混合树与事件', id: 'ch07-2' },

    { t: 'p', html: 'Unity 的动画系统由三部分组成：<b>Animator Controller</b>（状态机，定义有哪些动作、怎么切换）、<b>Animation Clip</b>（单个动作的关键帧数据）、<b>Avatar</b>（人形骨骼映射）。对程序来说，最重要的是状态机与参数：脚本只负责设参数（速度、是否着地、是否攻击），状态机负责播哪个动作。' },

    { t: 'p', html: '状态切换有两个容易搞错的地方。<b>一是过渡时长（Transition Duration）</b>：设成 0 会瞬间切换、动作生硬，设成 0.2 秒又会让人觉得操作延迟。经验值是动作切换 0.05–0.15 秒，受击与死亡可以更短。<b>二是 <code>Has Exit Time</code></b>：勾上会等当前动作播完才切换，适合连招；不勾则由参数立即打断，适合受击与闪避。' },

    { t: 'p', html: '<b>混合树（Blend Tree）</b>用一维或二维参数在多个动作之间插值，最典型的用法是「速度 → 走 / 跑」与「方向 → 八向移动」。它比写一堆状态切换清晰得多，也让动画过渡自然。<b>根运动（Root Motion）</b>则决定位移由动画驱动还是由代码驱动：由动画驱动更真实但有延迟，由代码驱动响应更快，动作游戏通常选后者。' },

    { t: 'code', lang: 'csharp', caption: '用参数驱动状态机，并用动画事件触发命中判定', code: `using UnityEngine;

[RequireComponent(typeof(Animator))]
public class PlayerAnimator : MonoBehaviour
{
    static readonly int SpeedHash = Animator.StringToHash("Speed");
    static readonly int GroundedHash = Animator.StringToHash("Grounded");
    static readonly int AttackHash = Animator.StringToHash("Attack");

    Animator anim;
    CharacterController cc;

    void Awake()
    {
        anim = GetComponent<Animator>();
        cc = GetComponent<CharacterController>();
    }

    void Update()
    {
        // 用哈希而不是字符串，避免每帧计算字符串哈希
        Vector3 planar = new Vector3(cc.velocity.x, 0f, cc.velocity.z);
        anim.SetFloat(SpeedHash, planar.magnitude);
        anim.SetBool(GroundedHash, cc.isGrounded);

        if (Input.GetMouseButtonDown(0))
            anim.SetTrigger(AttackHash);
    }

    // 在 Animation 窗口的帧上添加事件，调用这个方法
    // 命中判定放在「挥到一半」而不是按键瞬间，才与画面同步
    public void OnAttackHit()
    {
        Vector3 center = transform.position + transform.forward * 1.2f;
        Collider[] hits = Physics.OverlapSphere(center, 1.0f, LayerMask.GetMask("Enemy"));
        foreach (var h in hits)
        {
            h.SendMessage("TakeDamage", 10, SendMessageOptions.DontRequireReceiver);
        }
    }
}` },

    { t: 'p', html: '这段代码的关键在最后：<b>攻击判定由动画事件触发，而不是按键瞬间</b>。玩家按下鼠标到刀真正挥出之间有 0.2–0.3 秒的前摇，如果判定在按键瞬间生效，会出现「敌人还没被碰到就掉血」的错位感。把判定挂到动画的合适帧上，画面与判定就同步了——这是动作游戏手感的核心细节之一。' },

    { t: 'p', html: '另一个细节是用 <code>Animator.StringToHash</code> 缓存参数名。直接写 <code>anim.SetFloat("Speed", v)</code> 每帧都会做一次字符串哈希，人物一多就是可观的 CPU 开销。缓存成 <code>static readonly int</code> 只算一次，是几乎零成本的优化。' },

    { t: 'h', lvl: 2, text: '三、NavMesh 与敌人 AI', id: 'ch07-3' },

    { t: 'p', html: '<b>NavMesh</b> 是 Unity 的寻路系统：先烘焙出一张「可以走的地面」网格，再让 <code>NavMeshAgent</code> 在网格上自动绕开障碍走到目标点。它解决的是「怎么绕过去」，不解决「要不要过去」——后者是 AI 逻辑，得你自己写。' },

    { t: 'p', html: '一个能用的敌人 AI 通常有四个状态：<b>巡逻</b>（在几个点之间走）、<b>警觉</b>（发现玩家，短暂停顿或转向）、<b>追击</b>（朝玩家移动，超出范围放弃）、<b>攻击</b>（进入范围后停下出手）。四个状态用简单的枚举加 <code>switch</code> 就能实现，不需要行为树。学生项目里最容易忽略的是「放弃」与「卡住恢复」：敌人追到天涯海角，或者被卡在门框上原地抖动。' },

    { t: 'code', lang: 'csharp', caption: '四状态敌人 AI：带放弃与卡住检测', code: `using UnityEngine;
using UnityEngine.AI;

[RequireComponent(typeof(NavMeshAgent))]
public class EnemyAI : MonoBehaviour
{
    enum State { Patrol, Chase, Attack, Search }

    [SerializeField] Transform[] patrolPoints;
    [SerializeField] float sightRange = 12f;
    [SerializeField] float attackRange = 1.8f;
    [SerializeField] float giveUpRange = 20f;

    NavMeshAgent agent;
    State state = State.Patrol;
    int patrolIndex;
    float stuckTimer;

    void Awake() { agent = GetComponent<NavMeshAgent>(); }

    void Update()
    {
        float dist = Vector3.Distance(transform.position, PlayerRef.Position);

        // 先做状态迁移，再执行行为，逻辑更清楚
        switch (state)
        {
            case State.Patrol:
                if (dist < sightRange) state = State.Chase;
                else Patrol();
                break;
            case State.Chase:
                if (dist > giveUpRange) state = State.Patrol;
                else if (dist < attackRange) state = State.Attack;
                else agent.SetDestination(PlayerRef.Position);
                break;
            case State.Attack:
                agent.isStopped = true;
                if (dist > attackRange * 1.3f) { agent.isStopped = false; state = State.Chase; }
                break;
        }

        RecoverIfStuck();
    }

    void Patrol()
    {
        if (patrolPoints.Length == 0) return;
        if (!agent.pathPending && agent.remainingDistance < 0.5f)
            patrolIndex = (patrolIndex + 1) % patrolPoints.Length;
        agent.SetDestination(patrolPoints[patrolIndex].position);
    }

    void RecoverIfStuck()
    {
        // 有目标却几乎没动，持续 1.5 秒就重新寻路
        if (agent.velocity.sqrMagnitude < 0.01f && agent.remainingDistance > 1f)
            stuckTimer += Time.deltaTime;
        else
            stuckTimer = 0f;

        if (stuckTimer > 1.5f)
        {
            agent.ResetPath();
            stuckTimer = 0f;
        }
    }
}` },

    { t: 'p', html: '这段代码演示了三个实践要点。<b>先迁移状态再执行行为</b>：状态判断集中在一处，比散落在各个方法里好维护。<b>攻击时 <code>isStopped = true</code></b>：否则敌人会一边攻击一边往玩家身上挤，把玩家推走。<b>卡住恢复</b>：<code>ResetPath</code> 让 agent 重新规划，能解决大部分「原地抖动」。另外 <code>pathPending</code> 要检查，否则刚设目标就判断「还没到」会误触发。' },

    { t: 'p', html: '巡逻点建议用空对象摆好再拖进数组，不要硬编码坐标——关卡一改，坐标全废。追击范围与放弃范围要有明显差值（如 12 与 20），否则敌人会在边界反复进出状态，玩家看到的是「它一会儿追一会儿不追」。这种边界抖动是 AI 里最常见的观感问题。' },

    { t: 'h', lvl: 2, text: '四、关卡流程、存档与检查点', id: 'ch07-4' },

    { t: 'p', html: '一个完整的游戏要有<b>流程</b>：启动 → 主菜单 → 关卡 → 结算 → 返回或下一关。这段流程用场景加载与一个持久化的管理器实现。管理器的常见做法是 <code>DontDestroyOnLoad</code>，但要注意它会在每次回到主菜单时残留，需要在合适时机销毁或重置状态。' },

    { t: 'p', html: '存档与检查点决定「失败后要重来多少」。学生项目的最低要求是<b>检查点</b>：玩家经过某个区域时记录位置与状态，死亡后从这里复活。用 <code>PlayerPrefs</code> 存简单数据（关卡号、最高分）足够；要存完整状态就序列化成 JSON 写到 <code>Application.persistentDataPath</code>。<b>不要用 <code>PlayerPrefs</code> 存大段数据</b>，它在不同平台的行为不一致，而且容易被玩家手动改。' },

    { t: 'table', head: ['数据', '存放方式', '注意'], rows: [
      ['音量、画质、键位', '<code>PlayerPrefs</code>', '小、频繁读写，注意调用 <code>Save</code>'],
      ['最高分、解锁进度', '<code>PlayerPrefs</code> 或 JSON', '结构简单，注意版本兼容'],
      ['关卡内状态（位置、血量）', 'JSON 到 <code>persistentDataPath</code>', '要处理旧版本字段缺失'],
      ['大型配置（关卡表）', 'ScriptableObject 或 JSON', '随包发布，不进存档'],
      ['截图、录像', '<code>persistentDataPath</code>', '注意清理与容量']
    ], caption: '先问「这数据丢了玩家会不会骂」，再决定存在哪' },

    { t: 'p', html: '检查点要处理三件事：<b>记录什么</b>（位置、朝向、血量、已收集物）、<b>何时记录</b>（进入触发区时，不要每帧）、<b>复活时怎么恢复</b>（重置敌人、恢复血量、播放淡入）。第三点最容易被漏：玩家复活了，但敌人还在原地守尸，体验会很差。稳妥做法是复活时重置当前区域的敌人状态。' },

    { t: 'h', lvl: 2, text: '五、性能优化：Profiler 与对象池', id: 'ch07-5' },

    { t: 'p', html: '优化的第一条纪律是<b>先测量再动手</b>。Unity 的 Profiler 能按帧显示 CPU 与 GPU 的耗时分布：<code>CPU Usage</code> 看脚本、物理、渲染线程，<code>Rendering</code> 看 draw call 与三角形数，<code>Memory</code> 看托管堆与资源占用。没有数据就优化，等于闭眼改代码。' },

    { t: 'p', html: '学生项目最常见的三个性能问题：<b>频繁 <code>Instantiate</code> / <code>Destroy</code></b>（子弹、飘字、特效）造成 GC 峰值；<b>每帧字符串拼接与查找</b>；<b>材质种类过多</b>导致无法合批。前两个用对象池与缓存解决，第三个靠合并贴图与共享材质。' },

    { t: 'code', lang: 'csharp', caption: '通用对象池：避免反复实例化', code: `using System.Collections.Generic;
using UnityEngine;

public class SimplePool : MonoBehaviour
{
    [SerializeField] GameObject prefab;
    [SerializeField] int prewarm = 20;

    readonly Queue<GameObject> pool = new Queue<GameObject>();

    void Awake()
    {
        for (int i = 0; i < prewarm; i++)
        {
            var go = Instantiate(prefab, transform);
            go.SetActive(false);
            pool.Enqueue(go);
        }
    }

    public GameObject Get(Vector3 pos, Quaternion rot)
    {
        GameObject go = pool.Count > 0 ? pool.Dequeue() : Instantiate(prefab, transform);
        go.transform.SetPositionAndRotation(pos, rot);
        go.SetActive(true);
        return go;
    }

    public void Release(GameObject go)
    {
        go.SetActive(false);
        pool.Enqueue(go);
    }
}` },

    { t: 'p', html: '对象池的关键不是「复用」，而是<b>状态复位</b>。从池里取出的对象可能带着上次的粒子、速度、计时器，忘记重置就会出现「刚生成的子弹停在半空」这类怪异现象。稳妥做法是给池化对象一个 <code>OnSpawn</code> 接口，在取出时统一复位。预生成数量（prewarm）按峰值估算，太多浪费内存，太少仍会实例化。' },

    { t: 'p', html: '另外两个高性价比的优化：<b>把 <code>Camera.main</code> 缓存起来</b>（它在旧版本里每次调用都会查找对象），<b>把每帧的字符串拼接改成条件触发</b>（<code>scoreText.text = "分数：" + score</code> 每帧执行会产生大量垃圾）。这两处改完，Profiler 里的 GC Alloc 通常会明显下降。' },

    { t: 'h', lvl: 2, text: '六、打包与平台设置', id: 'ch07-6' },

    { t: 'p', html: '打包（Build）之前要检查五件事：<b>场景列表</b>（Build Settings 里包含所有要用的场景，顺序对，0 号是启动场景）、<b>平台</b>（Windows / macOS / WebGL，切换平台会重导入资源，要留时间）、<b>分辨率与画质</b>（Player Settings 里设默认窗口模式）、<b>图标与产品名</b>（别用默认 Unity 图标）、<b>脚本编译错误</b>（有任何错误都打不出包）。' },

    { t: 'p', html: 'WebGL 是最容易出问题的平台：不支持多线程、内存受限、加载慢、音频格式受限。如果课程要求提交 WebGL，要提前一周试打，并注意把压缩格式改成 Brotli 或关闭压缩（视服务器而定）。Windows 包则要注意杀毒软件误报与路径中文问题——把工程放在纯英文路径下能省掉一半麻烦。' },

    { t: 'table', head: ['检查项', '常见问题', '处理'], rows: [
      ['场景列表', '漏了菜单场景，启动直接进关卡', '确认 0 号场景与顺序'],
      ['资源引用', '运行时才加载的资源没被包含', '放进 Resources 或用 Addressables'],
      ['路径', '中文或空格路径导致打包失败', '工程与输出都放纯英文路径'],
      ['着色器', '打包后材质变粉（shader 丢失）', '确认 shader 在 Always Included 列表'],
      ['分辨率', '窗口过大超出屏幕', 'Player Settings 设默认窗口尺寸'],
      ['输入', 'WebGL 下鼠标锁定失效', '按平台分支处理光标逻辑'],
      ['音频', 'WebGL 首次交互前无声', '在点击后启动音频上下文']
    ], caption: '打包检查表过一次，能省掉演示当天的手忙脚乱' },

    { t: 'p', html: '打包完成后<b>一定要在另一台电脑上运行一次</b>。自己的机器上能跑不代表别人能跑：可能缺运行库、可能杀毒拦截、可能分辨率不对。把包发给一位同学，让他自己解压、双击、玩三分钟，这个过程能暴露 80% 的交付问题。' },

    { t: 'h', lvl: 2, text: '七、试玩、反馈与迭代', id: 'ch07-7' },

    { t: 'p', html: '试玩（playtest）的目标不是「获得夸奖」，而是<b>找出你无法自己发现的问题</b>。你已经知道怎么玩，所以你的操作路径是「最优路径」；新玩家会走「直觉路径」，两条路径的差异就是设计缺口。' },

    { t: 'steps', items: [
      { title: '第一步 · 定一个假设', html: '例如「玩家能自己发现二段跳」。带着假设去试玩，才知道该观察什么。' },
      { title: '第二步 · 不给提示，只看与记', html: '读一遍操作说明就闭嘴。记录停顿、误操作、表情变化与时间戳。' },
      { title: '第三步 · 玩后问具体问题', html: '「刚才那个门你知道怎么开吗」「你为什么往左走」「哪里最紧张」。' },
      { title: '第四步 · 当天改一条', html: '选最能解释停顿的那条改，不要一次改五处，否则不知道是哪条起了作用。' },
      { title: '第五步 · 再找一个人验证', html: '同一个假设，换一个没玩过的人。如果停顿消失，改对了。' }
    ] },

    { t: 'p', html: '记录工具用纸笔最快：时间戳、位置、玩家说的话、你的猜测。不要一边试玩一边解释，那会污染数据。如果条件允许，录屏并回看——你会发现很多当时没注意的细节，比如玩家反复尝试一个你以为很明显的地方。' },

    { t: 'p', html: '迭代要有节制。每次只改一个变量，改完立刻验证；连续改三处再测，等于把三个实验混在一起，结论不可信。时间不够时，优先修「阻塞性」问题：卡关、崩溃、看不懂目标。视觉瑕疵可以留到最后一轮。' },

    { t: 'h', lvl: 2, text: '八、演示、文档与作品集', id: 'ch07-8' },

    { t: 'p', html: '期末演示通常是 5–10 分钟。结构建议：<b>30 秒讲清是什么</b>（一句话核心循环）、<b>3 分钟实机演示</b>（挑最好的一段，不要从主菜单开始慢慢点）、<b>2 分钟讲设计决策</b>（为什么这样设计、试玩后改了什么）、<b>1 分钟讲不足与下一步</b>。第四段最能体现你懂设计——能说清「哪里没做好、为什么、下一步怎么做」，比宣称「都做好了」可信得多。' },

    { t: 'p', html: '演示前一定要<b>彩排</b>。彩排要解决三件事：时间是否超、演示路径是否会卡住、有没有需要临场解释的地方。实机演示最怕「现场翻车」：敌人卡住、任务没触发、存档是旧版本。准备一个「安全存档」或直接跳关的作弊键，能在出问题时救场。' },

    { t: 'p', html: '文档与作品集不用很长，一页就够：<b>一句话介绍、三张截图或一段 GIF、核心机制说明、你负责的部分、可玩链接</b>。把「我做了什么」写具体：不是「负责关卡设计」，而是「设计并实现了 3 个教学关卡，把首次通关率从 40% 提到 75%」。有数字的表述，面试官与老师都更容易记住。' },

    { t: 'compare', left: { title: '弱演示', html: '从启动画面开始，慢慢点菜单，边玩边说「这里本来想做一个 Boss 但没时间」。演示到一半遇到 bug，现场调试五分钟，最后超时，设计决策一句没讲。' }, right: { title: '强演示', html: '开场一句话说清玩法，直接进入准备好的关卡，展示核心循环与一个高光时刻；用三十秒讲试玩后改了什么、数据怎么变；最后一分钟讲不足与下一步。全程可控，超时风险低。' } },

    { t: 'terms', items: [
      { en: 'Animator Controller', zh: '动画状态机', html: '定义动画状态与切换条件的资产，由脚本设置参数驱动。' },
      { en: 'blend tree', zh: '混合树', html: '用参数在多个动画之间插值，常用于速度或方向驱动的移动动画。' },
      { en: 'root motion', zh: '根运动', html: '由动画本身驱动角色位移的方式，真实但有延迟。' },
      { en: 'NavMesh', zh: '导航网格', html: '烘焙出的可行走地面，供 NavMeshAgent 自动寻路。' },
      { en: 'object pool', zh: '对象池', html: '复用对象而不是反复实例化销毁，降低 GC 峰值与卡顿。' },
      { en: 'Profiler', zh: '性能分析器', html: 'Unity 内置的耗时与内存分析工具，优化前必须先看。' },
      { en: 'checkpoint', zh: '检查点', html: '记录玩家进度的位置，死亡后从该处复活。' },
      { en: 'build settings', zh: '打包设置', html: '决定包含哪些场景、目标平台与打包参数的配置。' }
    ] },

    { t: 'quiz', qid: 'ch07-q1' },
    { t: 'quiz', qid: 'ch07-q2' },
    { t: 'quiz', qid: 'ch07-q3' },

    { t: 'keypoint', items: [
      { title: '四阶段各有完成标准', html: '可玩看三人试玩，完整看流程闭环，打磨看反馈与帧率，交付看能否在别人机器上跑。' },
      { title: '动画事件对齐判定', html: '攻击命中挂到动画的合适帧，而不是按键瞬间，画面与手感才同步。' },
      { title: 'AI 要有放弃与恢复', html: '追击范围与放弃范围留差值，卡住 1.5 秒就 ResetPath，否则会原地抖动。' },
      { title: '优化先测量', html: 'Profiler 定位后再改；最常见的是频繁实例化、每帧字符串与材质过多。' },
      { title: '交付 = 打包 + 演示 + 文档', html: '提前打包、在别人电脑上验证、彩排演示，三件事都要留出时间。' }
    ] },

    { t: 'checklist', id: 'ch07', items: [
      '我能说出四个阶段的完成标准，并知道自己的项目现在处于哪个阶段',
      '我的角色动画由 Animator 参数驱动，且攻击判定挂在动画事件上',
      '我知道 Has Exit Time 与过渡时长分别影响什么手感',
      '我的敌人 AI 至少有巡逻、追击、攻击三种状态，且会放弃',
      '我处理过敌人卡住的情况（ResetPath 或重新布点）',
      '我的游戏有完整的开始到结束流程，死亡后能从检查点复活',
      '我用 Profiler 看过自己的场景，并定位到至少一个瓶颈',
      '我用对象池替代了至少一处频繁的 Instantiate / Destroy',
      '我打过一个能在另一台电脑上运行的包，并让别人玩过',
      '我彩排过至少一次演示，且能在一分钟内讲清核心循环与设计决策'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 ECE3200 Lab 8 讲义（Introduction to 3D game design part 3）、Lab 8 Guidance Part 3 与 Final Project Guidance 编写，覆盖动画状态机、NavMesh 与 AI、关卡流程与检查点、性能优化、打包设置、试玩迭代与演示。Lab 8 中关于具体烘焙参数、相机设置与场景搭建的步骤未逐条复述；动画事件、敌人四状态、对象池的代码为本章补充。四阶段的时间占比与演示结构属通用项目管理建议，不是课程硬性规定；期末项目的里程碑与提交格式请以当学期 Final Project Guidance 为准。性能数值（帧率目标、GC 阈值）随平台与项目规模变化，报告时以实测为准。' }
  ]
});
