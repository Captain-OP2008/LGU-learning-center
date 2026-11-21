/* =====================================================================
 * ch05.js · 第 5 章「3D 世界：变换、相机、光照与材质」
 * 职责：讲清三维空间里位置与旋转怎么表示、相机如何取景、光照与材质如何共同决定
 *       可读性，以及怎样在「好看」与「能跑」之间取得平衡。
 * 依据：Lab 7 讲义（Introduction to 3D game design）与 Lab 7 Guidance Part 2。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch05',
  num: '05',
  title: '3D 世界：变换、相机、光照与材质',
  en: 'WORLD IN 3D',
  goals: [
    '区分世界坐标与局部坐标，说明父子层级如何影响位置、旋转与缩放',
    '正确使用 Quaternion 与欧拉角，避免旋转抖动与万向节问题',
    '配置透视相机并搭出可用的第三人称跟随，理解 FOV 与近远裁剪面',
    '区分实时光、烘焙光与混合光，做出有方向感且有阴影的场景',
    '用 PBR 材质的金属度、粗糙度与环境光解释「为什么这个模型看起来不对」',
    '在可读性与性能之间做取舍，知道哪些设置最值得先调'
  ],
  kp: [
    { id: 'ch05-1', title: '世界坐标与局部坐标' },
    { id: 'ch05-2', title: 'Transform：位置、旋转、缩放' },
    { id: 'ch05-3', title: 'Quaternion 与朝向计算' },
    { id: 'ch05-4', title: '三维相机与透视' },
    { id: 'ch05-5', title: '光照：实时、烘焙与阴影' },
    { id: 'ch05-6', title: '材质与 PBR' },
    { id: 'ch05-7', title: '天空、雾与氛围' },
    { id: 'ch05-8', title: '可读性与性能的平衡' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '三维不是「二维多一个轴」', html: '多出来的那个轴带来两个新麻烦：<b>方向</b>与<b>看得见吗</b>。二维只有左与右，三维要处理「朝前」还是「朝某个点」，还要处理遮挡、光照方向与相机可视范围。玩家在三维场景里迷路、看不清敌人、不知道光从哪来，几乎都和本章内容有关。更现实的一点：三维场景比二维更容易掉帧，学会取舍才能把作品交付出去。' },

    { t: 'p', lead: true, html: '本章沿 Lab 7 的路线展开：先把坐标与变换讲清，再处理相机与朝向，然后进入光照与材质这两个「看起来对不对」的决定因素，最后收束到可读性与性能的平衡。学完你应该能独立搭出一个有方向感、不刺眼、帧率稳定的三维关卡。' },

    { t: 'h', lvl: 2, text: '一、世界坐标与局部坐标', id: 'ch05-1' },

    { t: 'p', html: 'Unity 里每个物体都有两套坐标。<b>世界坐标（world position）</b>是它在整个场景中的绝对位置；<b>局部坐标（local position）</b>是它相对于父对象的位置。没有父对象时两者相同，一旦有了父子关系就会分叉。这带来一个非常重要的性质：<b>父对象移动，子对象跟着移动，但子对象的局部坐标不变</b>。' },

    { t: 'p', html: '这套层级是做复合物体的基础。玩家对象带着模型、碰撞体、相机锚点、特效挂点，移动父对象，所有子对象一起走；转身时，所有挂点跟着转，枪口永远朝前。如果不用父子关系，就得在主脚本里手动同步四五个对象的位置，任何一处漏了就会出现「特效留在原地」的尴尬。' },

    { t: 'table', head: ['属性', '含义', '什么时候用', '注意'], rows: [
      ['<code>position</code>', '世界坐标', '跨对象计算距离、射线起点', '有父对象时赋值会被转换'],
      ['<code>localPosition</code>', '相对父对象', '挂点、UI 元素、相机锚点', '父对象缩放会影响实际距离'],
      ['<code>rotation</code>', '世界旋转（四元数）', '朝向世界中的目标', '不要直接改分量'],
      ['<code>localRotation</code>', '相对父对象旋转', '模型自身摆动', '父对象旋转会叠加'],
      ['<code>localScale</code>', '相对缩放', '整体放大缩小', '非均匀缩放会影响子对象与法线'],
      ['<code>TransformPoint</code>', '局部转世界', '把挂点偏移换算成世界位置', '常用于枪口、脚底']
    ], caption: '先问「我要的是绝对位置还是相对位置」，再选属性' },

    { t: 'p', html: '一个高频错误是在有父对象的物体上直接给 <code>position</code> 赋值，以为设的是「相对位置」，结果物体会跳到世界某处。另一种是<b>非均匀缩放</b>（比如 <code>scale = (2, 1, 1)</code>）：它会让子对象的旋转看起来是斜的、法线方向错误、碰撞体变形，甚至让 UI 文字糊掉。要拉长一个物体，优先改模型或用一个专门的子对象承担缩放，不要缩放带子对象的父节点。' },

    { t: 'h', lvl: 2, text: '二、Transform：位置、旋转、缩放', id: 'ch05-2' },

    { t: 'p', html: '三维空间里，一次完整的「摆放」包含三件事：位置（position）、旋转（rotation）、缩放（scale）。Unity 把它们打包在 <code>Transform</code> 组件里，每个游戏对象必有且只有一个。移动与缩放相对直观，旋转是三者里最容易出错的，因为它有三种常用表示法：欧拉角、四元数、方向向量。' },

    { t: 'p', html: '欧拉角（Euler angles）是人类友好的 <code>(x, y, z)</code> 三个角度，Inspector 里显示的就是它；但它有两个问题：<b>万向节死锁</b>（两个轴重合时失去一个自由度）与<b>插值不自然</b>（从 350° 插到 10° 会绕远路）。四元数（Quaternion）没有这两个问题，是引擎内部使用的表示，但它的四个分量对人类不直观。实践原则是：<b>对外用欧拉角，对内用四元数</b>。' },

    { t: 'table', head: ['表示法', '形式', '适合', '不适合'], rows: [
      ['欧拉角', '<code>new Vector3(0, 90, 0)</code>', 'Inspector 配置、简单固定朝向', '连续插值、组合旋转'],
      ['四元数', '<code>Quaternion.Euler(...)</code>', '所有运行时的旋转计算与插值', '手写分量、直接读数值'],
      ['方向向量', '<code>Quaternion.LookRotation(dir)</code>', '朝目标看、角色转向', '需要精确滚转角的场合'],
      ['角度轴', '<code>Quaternion.AngleAxis(deg, axis)</code>', '绕某个轴旋转（炮塔、车轮）', '组合多个轴时易混乱']
    ], caption: '需要「转过去」就用四元数，需要「填数字」才用欧拉角' },

    { t: 'p', html: '还有一个常被忽略的量：<b>旋转的顺序</b>。Unity 的欧拉角按 Z→X→Y 的顺序应用（与很多教材的 Y→X→Z 不同），所以同样的三个数字在不同引擎里结果可能不一样。这也是「为什么我在 Blender 里看着对，导进 Unity 就歪了」的原因之一——导出时的轴向转换与旋转顺序都要检查。' },

    { t: 'h', lvl: 2, text: '三、Quaternion 与朝向计算', id: 'ch05-3' },

    { t: 'p', html: '运行时最常用的旋转操作只有四个：<code>LookRotation</code>（朝某方向）、<code>Slerp</code> 与 <code>RotateTowards</code>（平滑转向）、<code>AngleAxis</code>（绕轴转）、<code>Inverse</code>（反向旋转）。把它们组合起来，就能覆盖九成的需求：炮塔转向目标、角色平滑转身、车轮滚动、相机绕角色转。' },

    { t: 'code', lang: 'csharp', caption: '朝向目标并平滑转向：炮塔示例', code: `using UnityEngine;

public class TurretAim : MonoBehaviour
{
    [SerializeField] Transform turretHead;   // 只转这个子对象
    [SerializeField] float turnSpeed = 180f; // 度/秒
    [SerializeField] float detectRange = 25f;
    [SerializeField] LayerMask targetMask;

    void Update()
    {
        Transform target = FindNearestTarget();
        if (target == null) return;

        // 用「世界坐标差」求方向，避免受父对象旋转影响
        Vector3 dir = target.position - turretHead.position;
        dir.y = 0f;                              // 只做水平旋转
        if (dir.sqrMagnitude < 0.001f) return;

        Quaternion desired = Quaternion.LookRotation(dir.normalized);

        // 平滑转向：速度可控，不会瞬间弹过去
        turretHead.rotation = Quaternion.RotateTowards(
            turretHead.rotation, desired, turnSpeed * Time.deltaTime);
    }

    Transform FindNearestTarget()
    {
        Collider[] hits = Physics.OverlapSphere(transform.position, detectRange, targetMask);
        Transform best = null;
        float bestDist = float.MaxValue;

        foreach (var h in hits)
        {
            float d = (h.transform.position - transform.position).sqrMagnitude;
            if (d < bestDist) { bestDist = d; best = h.transform; }
        }
        return best;
    }
}` },

    { t: 'p', html: '这段代码有四个值得记住的写法。第一，<b>只转炮塔头部</b>（<code>turretHead</code>），底座保持不动，视觉上才像机械结构。第二，<b>方向用世界坐标相减</b>，如果炮塔挂在移动平台上，用局部坐标会算错。第三，<b>把 <code>dir.y</code> 清零</b>，否则目标在半空时炮管会朝天。第四，用 <code>RotateTowards</code> 而不是 <code>Slerp</code>：前者是「每秒转多少度」，速度恒定；后者是「按比例靠近」，越近越慢，做炮塔会显得粘滞。' },

    { t: 'p', html: '还有一个常见需求是「相机绕角色旋转」：鼠标横向拖动改 yaw，纵向改 pitch，再用 <code>Quaternion.Euler(pitch, yaw, 0)</code> 得到旋转，乘以「从角色后退一段距离」的向量得到相机位置。注意 <b>pitch 要夹在 −80° 到 80° 之间</b>，否则相机会翻过头，玩家会看到倒过来的世界。' },

    { t: 'h', lvl: 2, text: '四、三维相机与透视', id: 'ch05-4' },

    { t: 'p', html: '三维通常用<b>透视相机（Perspective）</b>：近大远小，符合人眼习惯。<code>Field of View</code>（FOV）是纵向视野角度，默认 60°，动作游戏常用 70–90 让玩家看得更广，射击游戏会略低以突出目标。FOV 过大边缘会明显拉伸，过小会有压迫感与眩晕感。' },

    { t: 'p', html: '<code>Near</code> 与 <code>Far</code> 是近远裁剪面。近裁剪面太小（如 0.01）会造成深度精度不足，远处的物体出现闪烁（z-fighting）；太大会让贴脸的物体被裁掉。常用值是 near 0.1–0.3、far 500–1000。另一个常被忘记的是<b>相机不要穿墙</b>：第三人称相机撞到墙要有「推近」处理，否则玩家会看到墙体内部。' },

    { t: 'table', head: ['设置', '典型值', '影响', '调错的症状'], rows: [
      ['FOV', '60（默认）／75（动作）', '视野广度与临场感', '太小压抑，太大边缘畸变'],
      ['Near', '0.1–0.3', '深度精度与近处裁剪', '0.01 时远处闪烁'],
      ['Far', '500–1000', '可见距离', '太大浪费精度，太小远景消失'],
      ['Clipping 后处理', '视项目而定', '画面风格', '过度使用导致边缘发糊'],
      ['Culling Mask', '分层设置', '哪些层被这个相机看到', 'UI 层被世界相机渲染两次']
    ], caption: '相机参数先按默认，再按「哪里看起来不对」逐项调' },

    { t: 'p', html: '第三人称跟随的标准做法是：相机不作为角色的子对象（否则角色转身时画面跟着甩），而是独立对象，在 <code>LateUpdate</code> 里按「角色位置 + 旋转偏移 × 距离」计算目标位置，再用 <code>SmoothDamp</code> 过去。碰撞用一条从角色到相机的射线检测，命中就把相机拉到命中点前方，这就是最简版的「相机避墙」。' },

    { t: 'code', lang: 'csharp', caption: '第三人称相机：跟随 + 避墙', code: `using UnityEngine;

public class ThirdPersonCamera : MonoBehaviour
{
    [SerializeField] Transform target;
    [SerializeField] float distance = 4.5f;
    [SerializeField] float height = 1.6f;
    [SerializeField] float mouseSensitivity = 3f;
    [SerializeField] LayerMask blockMask;   // 墙、地形

    float yaw, pitch = 15f;
    Vector3 velocity;

    void LateUpdate()
    {
        yaw += Input.GetAxis("Mouse X") * mouseSensitivity;
        pitch -= Input.GetAxis("Mouse Y") * mouseSensitivity;
        pitch = Mathf.Clamp(pitch, -30f, 70f);

        Quaternion rot = Quaternion.Euler(pitch, yaw, 0f);
        Vector3 pivot = target.position + Vector3.up * height;
        Vector3 desired = pivot - rot * Vector3.forward * distance;

        // 避墙：从 pivot 打向相机，命中就把相机拉近
        if (Physics.Linecast(pivot, desired, out RaycastHit hit, blockMask))
        {
            desired = hit.point + hit.normal * 0.2f;
        }

        transform.position = Vector3.SmoothDamp(
            transform.position, desired, ref velocity, 0.06f);
        transform.rotation = rot;
    }
}` },

    { t: 'p', html: '注意 <code>Linecast</code> 与 <code>Raycast</code> 的区别：前者只需要两个点，读起来更直观；两者语义一致。避墙时把相机推到命中点<b>再沿法线外移 0.2</b>，否则相机会卡进墙里，看到一片黑。平滑用 <code>SmoothDamp</code> 而不是 <code>Lerp</code>，因为后者在帧率波动时速度不一致。' },

    { t: 'h', lvl: 2, text: '五、光照：实时、烘焙与阴影', id: 'ch05-5' },

    { t: 'p', html: '光照决定「这个场景有没有方向感」。Unity 里有两类光：<b>实时光（Realtime）</b>每帧计算，物体移动时光影跟着变，但开销大且默认不产生柔和阴影；<b>烘焙光（Baked）</b>在编辑时算好存进光照贴图，运行时几乎零成本，但只对静态物体有效。还有<b>混合光（Mixed）</b>，静态部分烘焙、动态部分实时，是学生项目最实用的选择。' },

    { t: 'p', html: '一个场景通常需要三类光源：<b>方向光（Directional）</b>当太阳，决定整体明暗与投影方向；<b>点光（Point）</b>做局部照明，如火把、灯泡；<b>聚光（Spot）</b>做手电筒、舞台灯。数量上要克制：实时光每多一盏，逐像素开销就多一份，移动端更要小心。超过三四盏点光时，优先考虑改用自发光材质加后处理。' },

    { t: 'table', head: ['光源', '形状', '适合', '性能'], rows: [
      ['Directional', '平行光，无位置', '太阳、月光、整体基调', '低（只算方向）'],
      ['Point', '向四周发光', '火把、灯泡、爆炸', '中（随距离衰减）'],
      ['Spot', '锥形', '手电、聚光灯、警示灯', '中高（含锥体判定）'],
      ['Area', '矩形面光源', '室内柔光（仅烘焙）', '烘焙高、实时不可用'],
      ['自发光材质', '物体表面发光', '屏幕、霓虹、熔岩', '低（但需配合后处理泛光）']
    ], caption: '先定方向光，再补局部光，最后才考虑自发光' },

    { t: 'p', html: '阴影有三个常被忽略的设置：<b>Shadow Type</b>（无、硬、软）、<b>Shadow Distance</b>（多远处停止投影）、<b>Bias</b>（偏移，用来消除阴影条纹）。阴影条纹（shadow acne）是自阴影采样精度不足造成的，把 Bias 调大一点通常能解决；但 Bias 太大会导致「阴影脱离物体」（peter-panning）。这两个参数是一对矛盾，需要在具体场景里试。' },

    { t: 'callout', kind: 'exam', title: '考点提示：为什么烘焙光不能照亮动态物体', html: '烘焙把光照结果写进贴图，贴图是绑在静态几何体上的；动态物体不在贴图里，所以拿不到间接光。解法是用<b>光照探针（Light Probes）</b>在空间中采样，让动态物体按所在位置取近似光照；或改用混合光，让动态物体接受实时直射光。能说清「贴图是静态的」这一点，基本就能得分。' },

    { t: 'h', lvl: 2, text: '六、材质与 PBR', id: 'ch05-6' },

    { t: 'p', html: '材质（Material）决定表面如何与光交互。Unity 的标准着色器用 <b>PBR（基于物理的渲染）</b>模型，核心参数有四个：<b>Albedo</b>（基础颜色，不该包含光照信息）、<b>Metallic</b>（金属度，0 是绝缘体、1 是金属）、<b>Smoothness</b>（光滑度，越高反射越清晰）、<b>Normal Map</b>（法线贴图，制造表面凹凸细节而不增加面数）。' },

    { t: 'p', html: 'PBR 的核心约束是<b>能量守恒</b>：一个表面反射的光不会超过它接收的光。这解释了为什么「金属不能有漫反射颜色」——金属的 Albedo 实际是反射色，非金属才有漫反射。学生项目里最常见的错误是把金属度拉到 0.8 却给了一个鲜艳的红色 Albedo，结果看起来像塑料上刷了金属漆，怎么调都不对。' },

    { t: 'table', head: ['表面', 'Metallic', 'Smoothness', 'Albedo 举例'], rows: [
      ['木头', '0', '0.1–0.3', '棕褐色，带木纹'],
      ['塑料', '0', '0.4–0.7', '纯色，饱和度高'],
      ['抛光金属', '1', '0.8–0.95', '接近白或金属本色'],
      ['生锈金属', '0.6–0.9', '0.2–0.4', '橙褐色，带噪点'],
      ['皮肤', '0', '0.3–0.5', '偏红，需次表面散射近似'],
      ['水面', '0', '0.9–1', '深蓝绿，靠反射出效果']
    ], caption: '先确定「这是什么材质」，再填四个参数，比反复试色快' },

    { t: 'p', html: '光照与材质要一起看。同一张 Albedo 贴图，在暖色方向光下显得温润，在冷色环境下显得阴森；金属度高的物体在缺少环境反射的场景里会发黑——因为它没有东西可反射。所以做金属物件时，先确认场景有天空盒或反射探针，否则再调参数也救不回来。' },

    { t: 'compare', left: { title: '常见错误：全靠调颜色', html: '模型看起来「不对」，于是不断改 Albedo 的颜色与亮度。结果是越改越脏，明暗关系混乱，同一场景里物件像来自不同游戏。' }, right: { title: '正确顺序：先光后材质', html: '先固定一盏方向光定基调，再看材质的金属度与光滑度是否符合物理，最后才微调 Albedo。明暗关系对了，颜色稍微偏一点也好看。' } },

    { t: 'h', lvl: 2, text: '七、天空、雾与氛围', id: 'ch05-7' },

    { t: 'p', html: '氛围由三个东西共同决定：<b>天空盒（Skybox）</b>提供环境光与远景，<b>雾（Fog）</b>让远处渐隐、制造纵深并掩盖绘制距离，<b>后处理（Post-processing）</b>统一色调、加泛光与暗角。三者都不改变玩法，却能显著改变「这个游戏是不是完整的」的观感。' },

    { t: 'p', html: '雾有两个容易踩的坑。第一，<b>雾会把远处物体染成雾色</b>，如果雾色与天空盒颜色不一致，地平线会出现一条突兀的接缝，解决方法是让雾色取自天空盒的下半部分。第二，<b>雾会削弱可读性</b>：远处的敌人被雾吃掉，玩家看不见就来不及反应，所以战斗区域的雾要调薄，或使用「距离雾 + 高度雾」的组合只压住低处。' },

    { t: 'p', html: '后处理的使用原则是「宁少勿多」。泛光（Bloom）能让自发光物体发光，但阈值太低会让整个画面发糊；色调映射（Tonemapping）能把高动态范围压回可显示范围，是让画面「像照片」的关键一步；暗角（Vignette）能聚焦视线，但过量会让玩家以为屏幕脏了。<b>每加一个效果，都要问它解决了什么问题。</b>' },

    { t: 'h', lvl: 2, text: '八、可读性与性能的平衡', id: 'ch05-8' },

    { t: 'p', html: '三维场景的性能瓶颈通常在三个地方：<b>绘制调用（draw call）</b>太多、<b>三角形</b>太多、<b>实时光与阴影</b>太贵。学生项目的常见情况是：模型面数不高，但物件数量极多（几百个独立小道具），于是 draw call 爆炸。解决办法是合并静态网格（Static Batching）、用 GPU Instancing 画重复物件、或用 LOD 让远处物件简化。' },

    { t: 'table', head: ['症状', '先看哪里', '常用手段', '代价'], rows: [
      ['帧率低但 GPU 不满', 'CPU、draw call 数', '静态合批、GPU Instancing、减少材质种类', '灵活性下降'],
      ['GPU 满载', '三角形数、实时光、阴影', 'LOD、减少光源、降低阴影距离', '画面变简单'],
      ['GC 频繁', '每帧分配（字符串、new）', '缓存、对象池、避免闭包', '代码变复杂'],
      ['加载慢', '贴图尺寸、音频格式', '压缩贴图、流式加载', '需要额外配置'],
      ['远处闪烁', '深度精度、Near/Far', '调大 Near、缩小 Far 范围', '近处细节受限']
    ], caption: '先用 Profiler 定位，再动手；不要凭感觉优化' },

    { t: 'p', html: '可读性方面，三维比二维更需要「视觉分层」。三个手段最有效：<b>明度分层</b>（玩家与敌人比环境亮一档）、<b>色相分层</b>（危险物统一用暖红，安全区偏冷绿）、<b>轮廓光</b>（给角色加边缘光，暗处也能看清剪影）。第三点在暗色调场景里几乎是必需的，很多学生项目「敌人看不见」不是光照不够，而是缺少轮廓区分。' },

    { t: 'p', html: '最后一个实用建议：<b>把画质设置做成可切换的</b>。阴影距离、后处理开关、分辨率缩放各做一个档位，演示时用高画质，同学的低配笔记本用低画质。这比赌「大家的电脑都够快」靠谱得多，也是第 07 章交付环节的前置准备。' },

    { t: 'terms', items: [
      { en: 'world space', zh: '世界坐标', html: '物体在场景中的绝对位置与朝向，跨对象计算时使用。' },
      { en: 'local space', zh: '局部坐标', html: '物体相对父对象的位置与朝向，父子层级的基础。' },
      { en: 'quaternion', zh: '四元数', html: 'Unity 内部使用的旋转表示，避免万向节死锁，适合插值与组合。' },
      { en: 'euler angles', zh: '欧拉角', html: '用三个角度表示旋转，直观但插值不自然、存在万向节问题。' },
      { en: 'FOV', zh: '视野角度', html: '透视相机的纵向可见角度，决定画面的广度与压迫感。' },
      { en: 'PBR', zh: '基于物理的渲染', html: '用金属度、粗糙度等物理参数描述表面的着色模型。' },
      { en: 'light probe', zh: '光照探针', html: '在空间中采样烘焙光照，让动态物体获得近似间接光。' },
      { en: 'draw call', zh: '绘制调用', html: 'CPU 通知 GPU 绘制一批网格的命令，数量过多会成为瓶颈。' }
    ] },

    { t: 'quiz', qid: 'ch05-q1' },
    { t: 'quiz', qid: 'ch05-q2' },
    { t: 'quiz', qid: 'ch05-q3' },

    { t: 'keypoint', items: [
      { title: '父子层级决定坐标语义', html: '父对象移动带着子对象走，子对象局部坐标不变；非均匀缩放会破坏子对象的旋转与法线。' },
      { title: '对外欧拉角，对内四元数', html: 'Inspector 填欧拉角，运行时用 LookRotation、RotateTowards、Slerp 做朝向与插值。' },
      { title: '相机要防穿墙', html: '从角色向相机打一条线，命中就把相机拉近；pitch 必须夹住，否则画面翻转。' },
      { title: '烘焙光只服务静态物体', html: '动态物体要靠光照探针或混合光，否则会「浮」在环境里。' },
      { title: '先光后材质', html: '固定方向光定基调，再按物理常识设金属度与光滑度，最后才调 Albedo。' }
    ] },

    { t: 'checklist', id: 'ch05', items: [
      '我能区分世界坐标与局部坐标，并说出父子层级对位置的影响',
      '我知道非均匀缩放为什么会让子对象变形，并知道怎么规避',
      '我能用 Quaternion.LookRotation 让物体朝向目标，并解释为什么不直接改欧拉角',
      '我能说出 RotateTowards 与 Slerp 的区别，并知道炮塔该用哪个',
      '我调过相机的 FOV、Near、Far，并能说出各自调错的症状',
      '我做出了带避墙的第三人称相机，且画面不穿墙',
      '我能解释烘焙光为什么不能照亮动态物体，以及光照探针的作用',
      '我能按物理常识给木头、金属、水面设置金属度与光滑度',
      '我知道雾色要与天空盒一致，否则地平线会出现接缝',
      '我用 Profiler 看过自己的场景，并知道瓶颈在 draw call 还是 GPU'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 ECE3200 Lab 7 讲义（Introduction to 3D game design）与 Lab 7 Guidance Part 2 编写，覆盖坐标与变换、旋转表示、三维相机、光照与阴影、PBR 材质与氛围。Lab 7 讲义中关于资源导入、模型缩放与场景摆放的具体步骤未逐条复述；炮塔与第三人称相机的代码为本章补充，FOV、Near/Far、Bias 等数值为常见区间，需按场景尺度调整。PBR 参数表按通用材质常识给出，具体数值以你使用的渲染管线（Built-in 或 URP）为准，两者在金属度工作流上一致，但光滑度的取值范围表述略有差异。' }
  ]
});
