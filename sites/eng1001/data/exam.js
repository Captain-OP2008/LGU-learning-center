/* =====================================================================
 * exam.js · 模拟卷 A（CSC.registerExam）
 * 覆盖 ch01–ch07：学术阅读、摘要、引用与 APA、学术语言、写作、口头汇报
 * 12 题，满分 100，建议 90 分钟
 * ===================================================================== */
CSC.registerExam({
  id: 'ENG1001-A',
  title: '模拟卷 A · 期末范围',
  style: 'FINAL',
  subtitle: '覆盖学术阅读、摘要、引用与 APA、学术语言、文章写作与口头汇报',
  date: '',
  minutes: 90,
  totalScore: 100,
  summary: '阅读 2 题、摘要 2 题、引用与 APA 4 题、语言 2 题、写作 1 题、口头汇报 1 题；共 12 题，满分 100 分。客观题约 55 分钟，改写与写作题约 35 分钟。',
  instructions: [
    '闭卷；可携带一本纸质英汉词典，不得使用手机、翻译软件或任何 AI 工具。',
    '引用与参考文献题一律按 APA 第 7 版作答；拼写错误不扣分，但作者、年份、卷期、页码必须准确。',
    '改写与写作题按内容、组织、语言、引用四个维度评分；只写要点不展开，不得满分。',
    '建议顺序：先做阅读与语言客观题，再做引用题，最后留 30 分钟给写作题。'
  ],
  questions: [
    {
      no: 1,
      points: 8,
      type: '阅读理解',
      intro: '阅读下面这段文字，回答两问。「过去十年，采用算法修复的博物馆从个位数增加到数十家。支持者说，算法能补全肉眼无法还原的颜料层；批评者说，问题不在于补得准不准，而在于谁有权决定一幅画应该是什么样。两种说法其实不在同一个层面上：前者谈技术能力，后者谈决策程序。如果只争论技术，程序问题就会被一直搁置。」',
      parts: [
        {
          label: '1(1)',
          points: 4,
          kind: 'choice',
          prompt: '这段文字的主旨是？',
          options: [
            { text: 'AI 修复的争议有两个层面，只谈技术会掩盖决策程序问题', correct: true },
            { text: 'AI 修复的颜料补全技术已经非常成熟' },
            { text: '博物馆不应使用任何算法修复名画' },
            { text: '批评者比支持者更有道理' }
          ],
          explain: '首句给背景，中间给两种说法，转折句「两种说法其实不在同一个层面上」给出作者判断，末句点明后果。主旨是「层面错位导致程序问题被搁置」，不是支持或反对修复。'
        },
        {
          label: '1(2)',
          points: 4,
          kind: 'choice',
          prompt: '末句「如果只争论技术，程序问题就会被一直搁置」在段落中起什么作用？',
          options: [
            { text: '指出当前争论的盲点，把讨论从技术推向决策程序', correct: true },
            { text: '补充一个技术细节，支持支持者的立场' },
            { text: '总结全文，重复第一句的意思' },
            { text: '引入一个反例，否定前文的全部论证' }
          ],
          explain: '末句是作者的价值判断与推进：它没有重复背景，也没有否定前文，而是指出「只谈技术」的代价，从而把读者引向程序问题。这是学术段落常见的「收束+推进」写法。'
        }
      ]
    },
    {
      no: 2,
      points: 8,
      type: '阅读与证据',
      intro: '同一段文字里，作者用了「支持者说」「批评者说」两种转述。判断证据与主张的关系，是读懂论证的关键。',
      parts: [
        {
          label: '2(1)',
          points: 4,
          kind: 'tf',
          prompt: '作者引用「支持者」与「批评者」的说法，是为了表明自己站在批评者一边。',
          options: [
            { text: '正确' },
            { text: '错误', correct: true }
          ],
          explain: '作者把两种说法并置，是为了指出它们不在同一层面，而不是选边。真正的立场在末句：争论的框架需要从技术转向程序。把「引用」当成「赞同」，是阅读论证时最常见的误判。'
        },
        {
          label: '2(2)',
          points: 4,
          kind: 'choice',
          prompt: '下列哪一项是这段文字中的「证据」，而不是「主张」？',
          options: [
            { text: '采用算法修复的博物馆从个位数增加到数十家', correct: true },
            { text: '问题在于谁有权决定一幅画应该是什么样' },
            { text: '两种说法不在同一个层面上' },
            { text: '程序问题会被一直搁置' }
          ],
          explain: '证据是可核对的事实或数据：博物馆数量的变化。其余三项都是作者的判断或推论。区分主张与证据，才能在回应文章中准确引用、准确反驳。'
        }
      ]
    },
    {
      no: 3,
      points: 8,
      type: '摘要判断',
      intro: '假设你要为上面的段落写一段 60 词的摘要。判断哪些内容应保留、哪些应删除。',
      parts: [
        {
          label: '3(1)',
          points: 4,
          kind: 'choice',
          prompt: '下列哪一句最应该保留在摘要里？',
          options: [
            { text: '作者认为 AI 修复的争论混淆了技术能力与决策程序两个层面', correct: true },
            { text: '支持者说算法能补全肉眼无法还原的颜料层' },
            { text: '过去十年博物馆数量从个位数增加到数十家' },
            { text: '如果只争论技术，程序问题就会被一直搁置' }
          ],
          explain: '摘要是主旨的压缩：保留作者的核心判断（两个层面被混淆），细节如具体论点、数据、后果句可删或合并。B、C 是支撑细节，D 是主旨在后果上的展开，都不是最核心的一句。'
        },
        {
          label: '3(2)',
          points: 4,
          kind: 'choice',
          prompt: '下列哪一句不应该出现在「只陈述原文」的摘要里？',
          options: [
            { text: '这段分析很有说服力，因为它指出了争论的真正盲点', correct: true },
            { text: '作者区分了技术能力与决策程序两个层面' },
            { text: '文章以博物馆采用算法修复的背景开头' },
            { text: '作者最后指出，只谈技术会让程序问题被搁置' }
          ],
          explain: '「很有说服力」是读者评价，属于 response，不属于 summary。摘要只呈现作者说了什么、怎么组织；评价要另起一段，并给出理由。'
        }
      ]
    },
    {
      no: 4,
      points: 8,
      type: '摘要写作',
      intro: '压缩不是删字，而是重组信息。下面两问考压缩与归属。',
      parts: [
        {
          label: '4(1)',
          points: 4,
          kind: 'output',
          prompt: '把下面两句压成一句，保留核心信息，不超过 25 词：「支持者认为算法能补全颜料层。批评者认为问题在于谁有权决定一幅画的样子。」',
          answer: '支持者关注算法能否补全颜料层，批评者关注谁有权决定一幅画的样子。',
          explain: '参考答案用「A 关注 X，B 关注 Y」的平行结构，把两句的对比保留下来，同时删掉重复的「认为」。压缩的要点是找共同框架，而不是逐句删形容词。'
        },
        {
          label: '4(2)',
          points: 4,
          kind: 'keywords',
          prompt: '写一句完整的归属句，把「作者认为争论混淆了两个层面」这个观点归给原文作者（可用 Smith, 2023）。',
          keywords: ['Smith', '2023', 'argues', 'two levels', '混淆', '层面'],
          explain: '合格答案需要三要素：作者、年份、转述动词，例如 Smith (2023) argues that the debate conflates technical capacity with decision-making procedures. 只写「the author thinks」没有出处，无法追溯。'
        }
      ]
    },
    {
      no: 5,
      points: 8,
      type: '引用与抄袭',
      intro: '学术诚信的判断看三件事：文字、观点、结构。三者只要有一样被当作自己的，就可能构成抄袭。',
      parts: [
        {
          label: '5(1)',
          points: 4,
          kind: 'choice',
          prompt: '下列哪种做法构成抄袭？',
          options: [
            { text: '保留原句结构，替换若干同义词，且未标注来源', correct: true },
            { text: '用自己的话重写观点，并标注作者与年份' },
            { text: '直接引用原句，加引号并给页码' },
            { text: '概括全文主旨，并在文内给出来源' }
          ],
          explain: '换词不换结构、且不标注，属于拼接式改写（patchwriting），仍是抄袭。B、C、D 都保留了来源归属，区别只在引用方式。'
        },
        {
          label: '5(2)',
          points: 4,
          kind: 'choice',
          prompt: '为什么「把原文每句换两个词」仍然不安全？',
          options: [
            { text: '句法与信息顺序仍来自原作者，读者对照原文即可发现', correct: true },
            { text: '因为同义词本身都是错的' },
            { text: '因为改写必须比原文更长' },
            { text: '因为只要出现原词就算抄袭' }
          ],
          explain: '抄袭判断看的是「这是谁的语言与结构」。逐句换词保留了原句骨架与信息顺序，等于借用他人的表达。安全做法是合上原文、用自己的句法重组，再对照检查。'
        }
      ]
    },
    {
      no: 6,
      points: 8,
      type: '引用方式',
      intro: '直接引用、改写、概括各有适用场合。选错方式，要么显得偷懒，要么丢失原文的分量。',
      parts: [
        {
          label: '6(1)',
          points: 4,
          kind: 'tf',
          prompt: '直接引用越多，文章越有依据。',
          options: [
            { text: '正确' },
            { text: '错误', correct: true }
          ],
          explain: '引用只提供材料，论证靠你的解释。大量引用会挤掉分析，让文章变成引文串联。直接引用应留给「措辞本身不可替代」的场合：定义、关键判断、法规原文。'
        },
        {
          label: '6(2)',
          points: 4,
          kind: 'choice',
          prompt: '下列哪种情况最适合直接引用？',
          options: [
            { text: '作者给某个术语下的定义，措辞本身会影响后文讨论', correct: true },
            { text: '作者举的一个普通例子，你想省去改写的时间' },
            { text: '你想让文章看起来读了很多材料' },
            { text: '原文的每一句都很重要' }
          ],
          explain: '直接引用的理由是「措辞不可替代」：定义、关键判断、不能改动的原文。普通例子可以概括，堆引用不会增加可信度，反而暴露你没有消化材料。'
        }
      ]
    },
    {
      no: 7,
      points: 8,
      type: 'APA 文内引用',
      intro: 'APA 第 7 版的文内引用由作者、年份、必要时的页码组成。',
      parts: [
        {
          label: '7(1)',
          points: 4,
          kind: 'fill',
          prompt: '一篇论文有四位作者（Lee, Chen, Wang, Kim），第一次在文中引用时应写成 Lee 加什么？',
          answer: 'et al.',
          explain: 'APA 第 7 版规定三位及以上作者从第一次引用起就用「第一作者 + et al.」，不再列出全部作者。参考文献表则要按规则列出全部作者（超过 19 位时列前 19 位加省略号与最后一位）。'
        },
        {
          label: '7(2)',
          points: 4,
          kind: 'fill',
          prompt: '直接引用原文时，除了作者与年份，文内还必须给出什么？（填两个字）',
          answer: '页码',
          explain: '直接引用必须给页码（或段落号），让读者能定位到原句。转述观点时页码不是必需，但建议给出，尤其是争议性较强的具体数据。'
        }
      ]
    },
    {
      no: 8,
      points: 8,
      type: 'APA 参考文献',
      intro: '参考文献表是读者追溯来源的唯一入口，格式错一处就可能找不到原文。',
      parts: [
        {
          label: '8(1)',
          points: 4,
          kind: 'choice',
          prompt: 'APA 期刊文章条目的正确顺序是？',
          options: [
            { text: '作者. (年份). 文章标题. 期刊名, 卷(期), 页码. DOI', correct: true },
            { text: '文章标题. 作者. 期刊名. 年份. 页码' },
            { text: '期刊名. 作者. 年份. 文章标题. 页码' },
            { text: '作者. 文章标题. 年份. 页码. 期刊名' }
          ],
          explain: 'APA 的顺序是「谁写的—什么时候—写了什么—发在哪—第几卷期—第几页—怎么找到」。文章标题只有句首大写，期刊名与卷号斜体，期号在括号里不斜体。'
        },
        {
          label: '8(2)',
          points: 4,
          kind: 'choice',
          prompt: '引用一个网页页面时，下列哪项信息最容易被漏掉、却必须保留？',
          options: [
            { text: '发布或更新日期（没有则用 n.d.）与页面标题', correct: true },
            { text: '网页的背景颜色' },
            { text: '你访问时使用的浏览器' },
            { text: '网页的广告数量' }
          ],
          explain: '网页条目需要作者（或机构）、日期（缺失写 n.d.）、标题、网站名与 URL。日期与标题最常被漏，导致读者无法判断信息的时效与内容。'
        }
      ]
    },
    {
      no: 9,
      points: 8,
      type: '学术语言',
      intro: '准确与适度限定是学术语域的两个标志。',
      parts: [
        {
          label: '9(1)',
          points: 4,
          kind: 'choice',
          prompt: '下列哪一句的限定最恰当？',
          options: [
            { text: 'The findings suggest that disclosure may reduce disputes.', correct: true },
            { text: 'The findings prove that disclosure eliminates all disputes.' },
            { text: 'The findings obviously show that everyone supports disclosure.' },
            { text: 'The findings are definitely the most important ever.' }
          ],
          explain: 'suggest 与 may 承认证据的边界，与有限样本相匹配。prove、eliminate、everyone 把结论推成绝对，一个反例就能推翻；学术写作宁可保守，也不要过度概括。'
        },
        {
          label: '9(2)',
          points: 4,
          kind: 'choice',
          prompt: '下列哪个搭配最自然？',
          options: [
            { text: 'conduct a study', correct: true },
            { text: 'do a study' },
            { text: 'make a study' },
            { text: 'play a study' }
          ],
          explain: 'conduct a study 是学术英语的固定搭配。do 在口语中可接受，但书面语偏随意；make 与 play 都不与 study 搭配。搭配靠积累语料，不靠逐字翻译。'
        }
      ]
    },
    {
      no: 10,
      points: 8,
      type: '简洁与衔接',
      intro: '删冗余、理衔接，是改稿第二遍的主要任务。',
      parts: [
        {
          label: '10(1)',
          points: 4,
          kind: 'choice',
          prompt: '下列哪一句最简洁？',
          options: [
            { text: 'Because the sample was small, the results are tentative.', correct: true },
            { text: 'Due to the fact that the sample was small, the results are tentative.' },
            { text: 'Owing to the circumstance that the sample was of a small nature, the results are tentative.' },
            { text: 'The results are tentative as a result of the smallness of the sample.' }
          ],
          explain: 'because 一个词就表达了因果，其余三句分别用 due to the fact that、owing to the circumstance that、as a result of the smallness 等冗余结构，意思相同、字数翻倍。'
        },
        {
          label: '10(2)',
          points: 4,
          kind: 'fill',
          prompt: '英语句子通常把新信息、重点信息放在句子的哪个位置？（填两个字）',
          answer: '末尾',
          explain: '这是 end focus（句末焦点）原则：读者读到句尾时记忆最新，所以把关键信息放在末尾最有分量。需要强调时，可以调整语序或拆分句子，把重点推到句末。'
        }
      ]
    },
    {
      no: 11,
      points: 10,
      type: '写作',
      intro: '下面两问考 thesis 与段落组织，按写作 rubric 的内容与组织维度评分。',
      parts: [
        {
          label: '11(1)',
          points: 5,
          kind: 'output',
          prompt: '把「AI 修复名画是一个复杂的问题」改写成一句可争论、可限定的 thesis（不超过 30 词）。',
          answer: 'AI restoration is controversial not because the technology is imperfect, but because museums rarely disclose who decides what a painting should look like.',
          explain: '原句是话题，不是判断：复杂是共识，无法反驳。改写后给出具体判断（争议在决策程序与披露），既能被证据支持，也能被反例挑战，符合「可争论、可限定」。'
        },
        {
          label: '11(2)',
          points: 5,
          kind: 'keywords',
          prompt: '写出一个 PEEL 段落的四个组成部分，并说明 E 与 L 各自的作用。',
          keywords: ['Point', 'Evidence', 'Explanation', 'Link', '解释证据', '回扣'],
          explain: 'Point 是段首主张；Evidence 是引用、数据或案例；Explanation 解释证据如何支持主张，通常占段落一半；Link 把本段结论回扣 thesis。缺 Explanation 是「观点+例子」，缺 Link 是孤岛段落。'
        }
      ]
    },
    {
      no: 12,
      points: 10,
      type: '口头汇报',
      intro: '最后一题考汇报的结构与临场判断。',
      parts: [
        {
          label: '12(1)',
          points: 5,
          kind: 'choice',
          prompt: '五分钟汇报，下列哪种时间分配最合理？',
          options: [
            { text: '开场 45 秒、主体 3 分 30 秒、收束 45 秒', correct: true },
            { text: '开场 2 分钟、主体 2 分钟、收束 1 分钟' },
            { text: '开场 15 秒、主体 4 分 30 秒、收束 15 秒' },
            { text: '开场 1 分钟、主体 1 分钟、收束 3 分钟' }
          ],
          explain: '15-70-15 是较稳的分配：开场够给钩子、背景与路线图，主体够三点展开，收束够重述与落点。开场过长会挤掉论证，收束过长则显得没有内容。'
        },
        {
          label: '12(2)',
          points: 5,
          kind: 'choice',
          prompt: '问答环节被问到一个你完全不会的数据，最好的回应是？',
          options: [
            { text: '承认没有这个数据，说明可以如何查证，并把问题接回你的核心信息', correct: true },
            { text: '编一个接近的数字，先应付过去' },
            { text: '反问对方「你觉得呢」，把问题推回去' },
            { text: '沉默，等主持人换下一个问题' }
          ],
          explain: '诚实加方向能保住可信度：承认边界、给出查证路径、把问题接回你熟悉的论证。编数据一旦被追问，整场汇报的可信度都会受损；反问与沉默则会被读成回避。'
        }
      ]
    }
  ]
});
