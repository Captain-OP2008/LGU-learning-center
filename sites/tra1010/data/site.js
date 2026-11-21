/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'tra1010',
  short: 'TRA1010',
  name: '翻译导论',
  en: 'Introduction to Translation Studies',
  dept: '人文与语言',
  lang: 'text',
  langLabel: '翻译',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'TRA1010 // TRANSLATION LAB',
  bootLog: [
    '> mounting course partition ... TRA1010',
    '> loading 8 modules: definition, map, procedures, shifts ...',
    '> indexing 56 drills and 3 projects ...',
    '> ready. read slowly, compare carefully.'
  ],

  /* 首页主视觉文案 */
  tagline: '把翻译读成一门可以验证的学问。',
  missionEn: 'TRA1010 · 8 MODULES · 56 DRILLS',
  missionTitle: '从语际转换<br><em>到跨文化判断</em>',
  lede: '八章从定义走到语境：概念、例子、对照表、常见误判与自检清单，配分章题库、模拟卷与三个实战项目。',
  searchPlaceholder: 'QUERY // 搜索章节、术语与题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/TRA1010/',
  resources: {
    note: '本课公开资料只有一份教材 PDF（Munday 第 1–2 章，约 1250KB）。下列条目按章节与用途分列，指向同一文件的不同阅读任务；读的时候带着问题做三栏笔记，不要从头抄到尾。',
    groups: [
      {
        name: '教材原典',
        items: [
          { title: 'Munday 第 1 章：Main issues of translation studies', kind: 'PDF · 教材章节', note: '定义、学科史与 Holmes 地图的出处。', path: '学习资料/TRA1010_Introducing_Translation_Studies_Jeremy_Munday_Chapter1_Chapter2.pdf' },
          { title: 'Munday 第 2 章：Studying translation product and process', kind: 'PDF · 教材章节', note: '七种技法、转换与描写研究的出处。', path: '学习资料/TRA1010_Introducing_Translation_Studies_Jeremy_Munday_Chapter1_Chapter2.pdf' }
        ]
      },
      {
        name: '概念底稿',
        items: [
          { title: '七种技法与 Catford 转换的对照阅读', kind: 'PDF · 概念对照', note: '先读第 2 章的七种技法，再回看层次与范畴转换。', path: '学习资料/TRA1010_Introducing_Translation_Studies_Jeremy_Munday_Chapter1_Chapter2.pdf' },
          { title: '等值、目的与规范的概念线索', kind: 'PDF · 概念对照', note: '第 1 章的定义与第 2 章的描写立场，是后几章的理论起点。', path: '学习资料/TRA1010_Introducing_Translation_Studies_Jeremy_Munday_Chapter1_Chapter2.pdf' }
        ]
      },
      {
        name: '练习与复习',
        items: [
          { title: '译文评析练习的原文样例', kind: 'PDF · 练习素材', note: '从第 2 章的例子里挑短句，做四层判等与技法标注。', path: '学习资料/TRA1010_Introducing_Translation_Studies_Jeremy_Munday_Chapter1_Chapter2.pdf' },
          { title: '期末复习：术语与章节核对', kind: 'PDF · 复习清单', note: '对照每章术语表与速查页，检查自己能否举例说明。', path: '学习资料/TRA1010_Introducing_Translation_Studies_Jeremy_Munday_Chapter1_Chapter2.pdf' }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '翻译导论（Introduction to Translation Studies）'],
    ['来源', 'CUHKSZ TRA1010 课程资料 · Munday 教材第 1–2 章'],
    ['结构', '8 章正文 · 56 道分章题 · 模拟卷 A · 3 个实战项目 · 资料库'],
    ['建议', '先读第 0 章建立地图；每章先看例子再看定义，结尾清单逐条自问。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    {
      label: '七种技法',
      blocks: [
        {
          t: 'table',
          head: ['技法', '一句话', '英汉例子'],
          rows: [
            ['借词', '原样搬来，必要时加注', 'tofu 豆腐；qigong 气功'],
            ['仿译', '照构词方式逐字仿造', 'skyscraper → 摩天楼'],
            ['直译', '词序词性基本保留，语法微调', 'I left my spectacles → 我忘了眼镜'],
            ['词性转换', '换词类，命题不变', 'announced his resignation → 宣布辞职'],
            ['调制', '换视角或否定焦点', 'Wet paint → 油漆未干'],
            ['等值', '用目标语固定套语替换', 'Yours sincerely → 此致敬礼'],
            ['改编', '整体换情境，文化对应', '板球 → 自行车赛']
          ],
          caption: '判定顺序：先看能否直译，再看换词类还是换视角，最后才考虑换情境。'
        },
        {
          t: 'keypoint',
          items: [
            { title: '强制 vs 选择', html: '换译法若违反目标语语法，是<b>强制</b>，不能评价；若两种说法都合法，才是<b>选择</b>，可以评价。' },
            { title: '别把标签当结论', html: '标出「调制」只是开始，还要写清代价：丢了什么、补了什么。' }
          ]
        },
        {
          t: 'callout',
          kind: 'tip',
          title: '一个快速自检',
          html: '把译文回译成英文，若命题变了，多半是调制过了头；若读起来像外语，多半是仿译或直译没有落地。'
        }
      ]
    },
    {
      label: '五类转换',
      blocks: [
        {
          t: 'table',
          head: ['类型', '判断线索', '例子'],
          rows: [
            ['层次转换', '语法手段变词汇手段，或反过来', 'He has left → 他已经走了'],
            ['结构转换', '句法结构变：被动转主动、定语从句拆句', 'The proposal was rejected → 委员会否决了'],
            ['类别转换', '词类变：名词转动词、形容词转补语', 'She is a good cook → 她做饭做得好'],
            ['单位转换', '对应单位升降：短语变词、从句变短语', 'without saying goodbye → 不辞而别'],
            ['内部系统转换', '同一子系统内换成员：单复数、冠词、敬语', 'advice → des conseils']
          ],
          caption: '标注前先交代形式对应的基线，否则「转换」无从谈起。'
        },
        {
          t: 'keypoint',
          items: [
            { title: '一处可能有多种', html: '同一句常同时发生结构转换与类别转换，按主次各记一条，不要只记一个。' },
            { title: '转换不等于不忠', html: '转换是描写工具，说明译文偏离了形式对应，不构成好坏判断。' }
          ]
        },
        {
          t: 'callout',
          kind: 'note',
          title: '标注的分母',
          html: '统计转换频率时，分母是小句对而不是字数；否则长句多的文本会显得转换特别多。'
        }
      ]
    },
    {
      label: '等值四层',
      blocks: [
        {
          t: 'table',
          head: ['层面', '问什么', '失手的样子'],
          rows: [
            ['指称', '说的是不是同一件事、同一个对象', '把「员工专用」译成「顾客止步」，对象变了'],
            ['内涵', '语体、褒贬、文化联想是否相称', '把中性的 staff 译成带轻蔑的「闲人」'],
            ['语用', '在这个场景里，读者会不会照做', '广播太长，听众没听完就走了'],
            ['形式', '节奏、长度、排比、押韵是否服务功能', '标语译成两行，海报放不下']
          ],
          caption: '四层不是四选一：先定关键层，再看其他层能否让步。'
        },
        {
          t: 'keypoint',
          items: [
            { title: '关键层由场景定', html: '合同的关键层通常是指称与文本规范，广告的关键层通常是语用与形式。' },
            { title: '等值不是相同', html: 'Jakobson 说等值是差异中的对应；要求每层相同，等于要求译文就是原文。' }
          ]
        },
        {
          t: 'callout',
          kind: 'warn',
          title: '常见误判',
          html: '只查指称层就宣布「等值」，是评析里最常见的失分点；指称对不等于译文可用。'
        }
      ]
    },
    {
      label: '规范三问',
      blocks: [
        {
          t: 'table',
          head: ['规范', '问什么', '材料在哪'],
          rows: [
            ['预备规范', '为什么选这部作品、这个时期重译', '出版社选题、译丛计划、版权页'],
            ['初始规范', '整体偏向原文还是目标语读者', '译文序跋、注释密度、句子长短'],
            ['操作规范', '具体到词句怎么处理：增删、拆分、统一术语', '译文对照、术语表、校样']
          ],
          caption: '三类规范是观察角度，不是三个先后步骤。'
        },
        {
          t: 'keypoint',
          items: [
            { title: '规范是共享期待', html: '规范不是个人习惯，而是一个社群在某个时期认为「这样译才对」的共识。' },
            { title: '描写先于评价', html: '先用副文本与译文重建规范，再谈译者为什么这样选；顺序反了容易循环论证。' }
          ]
        },
        {
          t: 'callout',
          kind: 'exam',
          title: '考场用法',
          html: '遇到「分析某译本为何这样处理」，先写三类规范各一条观察，再补一句历史语境，最后才评价。'
        }
      ]
    }
  ]
};
