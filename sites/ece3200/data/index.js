/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * 说明：title 必须与 data/chXX.js 里的 title 逐字一致。
 * ===================================================================== */
CSC.registerMeta([
  { id: 'ch00', num: '00', title: '课程地图：游戏设计在解决什么问题', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,
    blurb: '先摊开整门课的地图：游戏设计的核心问题、八章依赖关系、Unity 的对象模型，以及本站四条学习线怎么配合。' },
  { id: 'ch01', num: '01', title: '游戏与玩法：从规则到体验', en: 'RULES TO EXPERIENCE', part: 'Part II · 基础', week: 2, minutes: 90, icon: 'sparkle', labs: 1,
    blurb: '从游戏四要素、MDA 与核心循环讲到有意义的选择与难度曲线：把「好不好玩」拆成可以设计、可以验证的东西。' },
  { id: 'ch02', num: '02', title: 'Unity 与 C#：场景、对象与脚本', en: 'SCENES & SCRIPTS', part: 'Part II · 基础', week: 4, minutes: 100, icon: 'code', labs: 1,
    blurb: '场景、预制体与组件的组织方式，MonoBehaviour 生命周期，输入读取与帧率无关的移动，以及协程与调试规范。' },
  { id: 'ch03', num: '03', title: '物理引擎：刚体、碰撞与射线', en: 'PHYSICS ENGINE', part: 'Part III · 深入', week: 6, minutes: 110, icon: 'box', labs: 1,
    blurb: '刚体参数、碰撞体与层矩阵、碰撞与触发回调、三种移动方式，以及用射线做地面检测与射击判定。' },
  { id: 'ch04', num: '04', title: '2D 与 2.5D：精灵、相机与关卡节奏', en: '2D & 2.5D', part: 'Part III · 深入', week: 8, minutes: 110, icon: 'grid', labs: 1,
    blurb: '精灵排序、正交相机与手感参数、Tilemap 拼装、2.5D 的三条路线，以及教学—变化—考验的关卡节奏。' },
  { id: 'ch05', num: '05', title: '3D 世界：变换、相机、光照与材质', en: 'WORLD IN 3D', part: 'Part III · 深入', week: 10, minutes: 110, icon: 'layers', labs: 1,
    blurb: '世界与局部坐标、四元数朝向、第三人称相机、实时与烘焙光照、PBR 材质，以及可读性与性能的平衡。' },
  { id: 'ch06', num: '06', title: 'UI、音效与反馈：让玩家读懂游戏', en: 'FEEDBACK & UI', part: 'Part IV · 综合', week: 12, minutes: 110, icon: 'target', labs: 1,
    blurb: '反馈三要素、Canvas 与分辨率适配、HUD 与暂停菜单、音频四层与混音，以及打击感与无障碍设计。' },
  { id: 'ch07', num: '07', title: '3D 进阶与交付：从原型到可玩成品', en: 'SHIP IT', part: 'Part IV · 综合', week: 14, minutes: 120, icon: 'rocket', labs: 1,
    blurb: '动画状态机与事件、NavMesh 敌人 AI、检查点与流程、Profiler 与对象池、打包设置，以及试玩与演示。' }
]);
