/* =====================================================================
 * data/quiz.js · CSC1004 学习站 · 全站题库（21 章）
 * 覆盖：ch00–ch20（12 讲 Lecture + 11 个 Tutorial + 期末考纲），每章 16–17 题。
 * 题型：mcq 单选 / multi 多选 / tf 判断 / fill 填空（含 mode:findbug 找 bug）/
 *       predict 读代码写输出 / order 排序 / code 编程（仅 ch01–ch05，站内 Java 引擎判分）。
 * 题号：chXX-qN 章节保底题（q1 概念 / q2 读码 / q3 陷阱，正文直接引用）·
 *       chXX-tN 梯度训练 · chXX-f1 找 bug · chXX-c1 编程。
 * 判分口径：tf 也走 options（True=下标0 / False=下标1）；predict 比较时忽略行首尾空白与空行；
 *           fill 命中 answer 或 accept 任一即对；order 的 answer 是正确顺序的选项下标。
 * 依据：.work/csc1004_txt/ 讲义原文，不考课程未涉及的内容。
 * 由 .work/quizgen/ 下按章片段拼装生成（node .work/quizgen/build.js --write）。
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = { items: [
    {
      "id": "ch00-q1",
      "ch": "ch00",
      "kp": "ch00-2",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "讲义专门用一页对比 CSC-1003 与 CSC-1004。下列哪一项符合这个对比？",
      "options": [
        {
          "text": "CSC-1004 只要求记住概念并通过考试，不要求交付任何项目，也不涉及图形界面"
        },
        {
          "text": "CSC-1003 以掌握计算机科学与 Java 编程的基础知识为目标，用作业和考试评价；CSC-1004 以「用所学做出有用的项目」为目标，靠动手实践来训练",
          "correct": true
        },
        {
          "text": "两门课的目标相同，只是 CSC-1004 的作业数量更多、给分更松"
        },
        {
          "text": "CSC-1003 以完成项目、交付可运行的程序为主，CSC-1004 以背概念、通过考试为主"
        }
      ],
      "explain": "lecture0 用三行对照两门课：CSC-1003 的 Goal 是 basic knowledge of computer science and Java programming，Approach 是记得概念、实现特性、通过考试，Evaluation 是作业与考试；CSC-1004 的 Goal 是 build a project (something useful) with your knowledge，Approach 是 practical training that makes you a qualified programmer，Evaluation 不是卷面而是把东西做出来。所以差别不在难度，而在「拿什么来验收」：1004 认的是能跑起来的项目。选 c 或 d 的人把两门课的定位对调了；选 b 的人以为只是作业量不同，忽略了目标与验收方式都变了。",
      "hint": "看两门课各自的 Goal / Approach / Evaluation 三行，重点在 Evaluation 靠什么。"
    },
    {
      "id": "ch00-q2",
      "ch": "ch00",
      "kp": "ch00-1",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "exam"
      ],
      "stem": "某同学的成绩：两个 Java 项目 90 与 80，Python 项目 70，期末 60。下面程序按课程的评分规则计算总评并打印。写出它的输出。",
      "code": "public class Score {\n    public static void main(String[] args) {\n        int java1 = 90, java2 = 80;\n        int python = 70;\n        int exam = 60;\n        int total = (java1 + java2) * 20 / 100 + python * 20 / 100 + exam * 40 / 100;\n        System.out.println(total);\n    }\n}",
      "answer": "72",
      "explain": "评分是三块加权：两个 Java 项目合计 40%（每个 20%）、Python 项目 20%、期末 40%。代入代码：(90+80)*20/100 = 34，正好等于 90*20% + 80*20% = 18 + 16；70*20/100 = 14；60*40/100 = 24；三块相加 34+14+24 = 72。最容易错的是权重串位：把 Python 当成 40%、期末当成 20%，算出来是 74；漏掉 Python 那 20%，算出来是 58。判据是先把三块的权重各自写出来，再逐块相乘——不要凭「期末应该最重」的印象直接乘。",
      "hint": "先确认三块权重分别是 20+20、20、40，再逐块相乘相加。"
    },
    {
      "id": "ch00-q3",
      "ch": "ch00",
      "kp": "ch00-1",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "trap",
        "exam"
      ],
      "stem": "关于 AI 工具在 CSC-1004 中的使用，下列哪一条同时符合 lecture 0 给出的两条规定？",
      "options": [
        {
          "text": "只有 Python 项目允许用 AI，两个 Java 项目必须完全手写"
        },
        {
          "text": "完成项目时允许使用 AI 工具，但期末考试中严禁使用",
          "correct": true
        },
        {
          "text": "项目与期末考试都允许使用 AI 工具，只要在答案里注明出处"
        },
        {
          "text": "项目不允许使用 AI 工具，期末考试则允许用它检查语法"
        }
      ],
      "explain": "lecture0 在评分页把两句话放在相邻两张上：项目部分写 The use of AI tools is permitted for completing projects，紧接着期末部分写 The use of AI tools is strictly prohibited during the final exam。允许与禁止各自管一段场景，不能互相推广，而「项目能用，那考试查个语法当然也行」正是这里最典型的推断错误。b 把课下的许可搬进了考场，还编出讲义里不存在的「注明出处」规则；c 把两条彻底颠倒；d 编出 Java 与 Python 区别对待，而讲义对三个项目的政策是一致的。判据：看场景——课下产出可以用工具，考场内只能靠自己的脑子。",
      "hint": "允许与禁止分别写在哪一页上？各自的范围是什么？"
    },
    {
      "id": "ch00-t1",
      "ch": "ch00",
      "kp": "ch00-1",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "project"
      ],
      "stem": "关于课程要求的三个项目，下列说法符合 lecture 0 的是？",
      "options": [
        {
          "text": "三个项目都只要求命令行界面，不需要任何 GUI，界面部分留作加分项"
        },
        {
          "text": "两个中型 Java 项目（Java Chat Zoom 聊天室与 Java Gomoku 五子棋）加一个较小的 Python 游戏，三个都要自己实现",
          "correct": true
        },
        {
          "text": "一个大型 Java 项目加两个小型 Python 项目，三份代码的量级差不多"
        },
        {
          "text": "三个项目都是 Java 项目，Python 只在期末考试的选择题里出现"
        }
      ],
      "explain": "lecture0 的项目页正好列了三个：1. Java Chat Zoom（聊天室，涉及类与继承、多线程、Socket）、2. Java Game 即 Gomoku（五子棋，涉及类与继承、GUI）、3. Python Games（涉及 Python 包、类与继承、GUI）。规模上两个 Java 项目各约 2000 行、Python 项目约 500 行，所以是「两个中型 + 一个小型」。b 把数量与语言配错；c 忽略了 Python 项目确实存在；d 与 Gomoku 要求的 Java GUI、Python 项目要求的 Python GUI 都矛盾——三个项目里有两个明确要求图形界面。",
      "hint": "数一数几个 Java、几个 Python，以及哪几个项目要 GUI。"
    },
    {
      "id": "ch00-t2",
      "ch": "ch00",
      "kp": "ch00-5",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "按 Final Examination Guideline，期末试卷四部分的题量（Part I 选择 / Part II 判断 / Part III 填空 / Part IV 简答与编程）是？",
      "options": [
        {
          "text": "20 / 5 / 5 / 1"
        },
        {
          "text": "10 / 5 / 5 / 2",
          "correct": true
        },
        {
          "text": "5 / 10 / 5 / 2"
        },
        {
          "text": "10 / 5 / 2 / 5"
        }
      ],
      "explain": "Guideline 的分节说明逐条写死了题量：Part I 是 10 questions、Part II 是 5 questions、Part III 是 5 questions、Part IV 是 2 questions，四部分合计 22 题、总分 100。b 把选择与判断的题量对调了，于是变成判断比选择还多，与 30% 对 20% 的分值分布也矛盾；c 把填空（5 题）和简答编程（2 题）对调；d 以为选择题有 20 题——那是把 100 分误当成了题数。记忆时抓住两个 5：判断 5 题、填空 5 题；大题最少，只有 2 题。",
      "hint": "记住两个 5，再看选择题和大题的题数。"
    },
    {
      "id": "ch00-t3",
      "ch": "ch00",
      "kp": "ch00-5",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "关于期末考试的条件，下列说法符合 Guideline 的是？",
      "options": [
        {
          "text": "闭卷考试，可以带编程计算器，因为它能存公式和代码片段"
        },
        {
          "text": "闭卷考试，只允许非编程计算器和标准书写工具，禁止手机、平板、智能手表等具备通信能力的电子设备",
          "correct": true
        },
        {
          "text": "开卷考试，可以带讲义、笔记和打印出来的代码"
        },
        {
          "text": "闭卷考试，但允许带一台笔记本电脑，在 IDE 里写代码"
        }
      ],
      "explain": "Guideline 的 Exam Conditions 一节写得很具体：closed-book，不允许笔记、教材或任何参考资料；允许的是 non-programmable calculators（没有存储和通信功能）与 standard writing instruments；禁止手机、平板、智能手表以及任何具备通信能力的电子设备。b 直接违反闭卷；c 与笔试形式矛盾，Guideline 专门建议用手写代码来适应没有 IDE 的考场；d 抓住了「计算器」却漏掉 non-programmable 这个限定，能存公式的编程计算器恰恰被排除。判据就两个关键词：closed-book 与 non-programmable。",
      "hint": "关键词是 closed-book 和 non-programmable。"
    },
    {
      "id": "ch00-t4",
      "ch": "ch00",
      "kp": "ch00-5",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "期末是闭卷笔试，要在 100 分钟内手写代码。按 Guideline 的备考建议，下列哪种复习方式最符合？",
      "options": [
        {
          "text": "只复习教材的理论章节，实验代码与考试无关"
        },
        {
          "text": "把实验讲义与代码系统地过一遍，并练习手写代码，在没有 IDE 的条件下也能写对",
          "correct": true
        },
        {
          "text": "只背题库答案，因为考试题型固定，选择判断填空占了大头"
        },
        {
          "text": "只在 IDE 里反复运行示例，考试时靠 IDE 的自动补全来写代码"
        }
      ],
      "explain": "Guideline 的 Preparation & Strategy Tips 给了三条可执行建议：彻底复习实验室的 slides 与 codes；用笔写代码，在没有 IDE 的条件下建立信心；写逻辑清楚、可读、语法正确的代码，并管理好时间。因为期末是闭卷笔试、没有 IDE，也就没有自动补全和红色波浪线，只在 IDE 里「能跑就行」的人上考场最容易漏分号、漏类型。b 只背题库会丢掉 Part IV 的解释与编程（占 25%）；c 恰好依赖考场上不存在的东西；d 与「考试只覆盖与项目紧密相关的知识」相矛盾——实验代码正是复习重点。",
      "hint": "没有 IDE 的考场，最该练的是哪件事？"
    },
    {
      "id": "ch00-t5",
      "ch": "ch00",
      "kp": "ch00-5",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "exam"
      ],
      "stem": "下面程序按 Guideline 统计期末考试四部分的分值。写出它的输出（逐行）。",
      "code": "public class Exam {\n    public static void main(String[] args) {\n        String[] part = {\"Part I\", \"Part II\", \"Part III\", \"Part IV\"};\n        int[] mark = {10 * 3, 5 * 4, 5 * 5, 25};\n        for (int i = 0; i < part.length; i++) {\n            System.out.println(part[i] + \": \" + mark[i]);\n        }\n    }\n}",
      "answer": "Part I: 30\nPart II: 20\nPart III: 25\nPart IV: 25",
      "explain": "Guideline 的分节说明给出每部分的总分：Part I 10 题 × 3 分 = 30；Part II 5 题 × 4 分 = 20；Part III 5 题 × 5 分 = 25；Part IV 2 题合计 25。代码里 10*3、5*4、5*5 和常量 25 正好对应这四项，循环再按 part 数组的顺序逐行拼出「名称: 分值」。四部分相加是 100，与总评里期末占 40% 相呼应。最容易记混的是 Part II 与 Part III：都是 5 题，但每题 4 分对 5 分，所以判断 20 分、填空 25 分——不要因为题数一样就把分值也当成一样。",
      "hint": "两个 5 题的部分，每题分值并不相同。"
    },
    {
      "id": "ch00-t6",
      "ch": "ch00",
      "kp": "ch00-5",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "判断：期末考试的命题范围只覆盖与三个项目紧密相关的知识，而不是整门课讲过的所有细节。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "lecture0 在评分页的原话是 The final exam covers only the knowledge that is closely related to the projects。这句话直接决定了复习策略——Guideline 也建议以实验室 slides 和代码为主，而不是把教材从头背一遍。但要注意，「范围只覆盖项目相关知识」不等于「只考项目里出现过的代码」：判断与填空会考语法片段、补全代码，只是这些知识点都能在项目里用到。把它读成「不用学语法」或读成「整本书都要背」，都是过度推断。",
      "hint": "lecture0 在期末那一条上写了 covers only 什么？"
    },
    {
      "id": "ch00-t7",
      "ch": "ch00",
      "kp": "ch00-5",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "trap",
        "exam"
      ],
      "stem": "判断：期末考试的 100 分钟里已经包含 10 分钟的阅读时间，所以实际答题只有 90 分钟。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "Guideline 写的是 lasts for a total of 100 minutes plus 10 minutes reading time——100 分钟是答题时间，前面另加 10 分钟阅读，整场约 110 分钟。它还给了时间分配建议：Part I 与 Part II 合起来约 35 分钟、Part III 约 25 分钟、Part IV 约 30 分钟，加起来 90 分钟，正好留出约 10 分钟检查。把阅读时间算进 100 分钟，会让你误以为只剩 90 分钟可写，于是在 Part IV 上赶工——而 Part IV 的两道题占了 25%。",
      "hint": "plus 10 minutes 里的 plus 是加还是包含？"
    },
    {
      "id": "ch00-t8",
      "ch": "ch00",
      "kp": "ch00-1",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "project",
        "concept"
      ],
      "stem": "讲义给的项目规模是：两个中型 Java 项目各约 ____ 行代码，另有一个较小的 Python 项目约 500 行。",
      "answer": "2000",
      "accept": [
        "2000行",
        "2000 行",
        "2,000",
        "两千",
        "两千行"
      ],
      "explain": "lecture0 原文是 Two medium-sized Java projects (around 2000 lines of code) 与 A smaller Python project (around 500 lines of code)。注意 2000 行是每个 Java 项目的规模，不是三个项目合计——两个 Java 项目加起来约 4000 行。这个量级也解释了为什么课程把自学与调试能力列为关键：两千行不可能只靠听课写出来，必须自己拆模块、自己定位 bug；项目还要交基本功能与演示视频，说明验收看的是能跑起来的东西。",
      "hint": "两个 Java 项目各多少行？Python 项目「较小」是多小？"
    },
    {
      "id": "ch00-t9",
      "ch": "ch00",
      "kp": "ch00-1",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "project",
        "concept"
      ],
      "stem": "讲义强调项目必须由每个学生 ____ 完成，不允许组队（原文：Every student must ____ finish the projects without forming any team.），空格处填的英文副词是？",
      "answer": "individually",
      "accept": [
        "individually",
        "独立",
        "独自",
        "独立地",
        "独立完成",
        "独自完成",
        "个人",
        "independent"
      ],
      "explain": "这一句把三件事绑在一起：must、individually、without forming any team——项目是单人交付，既不能分工，也不能挂名组队。讲义紧接着写 students must learn how to design the projects and debug the codes by themselves，所以「独立」不只是行政规定，而是这门课的训练目标本身：设计、调试、把实现讲清楚，三件事都得你自己来。项目允许用 AI 工具，但工具不能替你把这三件事做完；期末考场上 AI 又被明令禁止，独立能力就是唯一的兜底。",
      "hint": "副词的意思是「一个人地」，以 in- 开头。"
    },
    {
      "id": "ch00-t10",
      "ch": "ch00",
      "kp": "ch00-1",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "concept",
        "project"
      ],
      "stem": "讲义明确划出助教的边界：TAs will not ____ for you or write any code for you（助教不会替你调试，也不会替你写代码），空格处填的英文动词是？",
      "answer": "debug",
      "accept": [
        "debug",
        "调试"
      ],
      "explain": "lecture0 在 Lectures and Tutorials 一节写：Tutorial 会带你过示例项目的代码、也会答疑，但 TAs will not debug for you or write any code for you。原因是这门课的核心训练就是「自己把 bug 找出来」——把报错直接甩给别人，等于跳过了唯一的练习环节。所以提问的正确姿势是给出三件事：你期望发生什么、实际发生了什么、你已经排查过哪些地方；而不是一句「帮我改好」。期末禁止 AI、平时助教又不代劳，自学与调试能力就是这门课真正的兜底。",
      "hint": "这个词就是「调试」，英文以 de- 开头。"
    },
    {
      "id": "ch00-t11",
      "ch": "ch00",
      "kp": "ch00-1",
      "type": "multi",
      "difficulty": 2,
      "tags": [
        "project",
        "concept"
      ],
      "stem": "讲义在课程介绍里为三个项目分别列出了基本功能与技术点。下列哪些属于这些列出的内容？（多选）",
      "options": [
        {
          "text": "Java Chat Zoom：Java Class and Inheritance（类与继承）",
          "correct": true
        },
        {
          "text": "Java Chat Zoom：Java Multi-Threading 与 Java Socket Programming",
          "correct": true
        },
        {
          "text": "Java Gomoku（五子棋）：Java Graphical User Interface（GUI）",
          "correct": true
        },
        {
          "text": "Python 游戏：Python Package Usage 与 Python GUI",
          "correct": true
        },
        {
          "text": "三个项目都要求用 JavaFX 绘制界面"
        },
        {
          "text": "三个项目都要求实现多线程的 Socket 服务器"
        }
      ],
      "explain": "讲义对三个项目的技术要求写得很具体：Chat Zoom 是 Class and Inheritance + Multi-Threading + Socket Programming；Gomoku 是 Class and Inheritance + GUI；Python 项目是 Package Usage + Class and Inheritance + GUI。所以「多线程 + Socket」是聊天室专属的要求，Gomoku 和 Python 项目都不需要；「用 JavaFX 画界面」只可能出现在 Java 项目里，Python 项目用的是 Python 自己的 GUI 库。把某个项目的要求当成三个项目的共同要求，是复习时最常见的串台错误——它会导致你在错误的地方找讲义。",
      "hint": "多线程与 Socket 是哪个项目的招牌要求？"
    },
    {
      "id": "ch00-t12",
      "ch": "ch00",
      "kp": "ch00-5",
      "type": "order",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "按期末试卷上出现的先后顺序，排列下面四个部分。",
      "options": [
        {
          "text": "Part III 填空：5 题，共 25 分"
        },
        {
          "text": "Part I 选择：10 题，共 30 分"
        },
        {
          "text": "Part IV 简答与编程：2 题，共 25 分"
        },
        {
          "text": "Part II 判断：5 题，共 20 分"
        }
      ],
      "answer": [
        1,
        3,
        0,
        2
      ],
      "explain": "Guideline 的 Overview 与分节说明都按 Part I → II → III → IV 的顺序排：选择（10 题 30 分）→ 判断（5 题 20 分）→ 填空（5 题 25 分）→ 简答与编程（2 题 25 分）。注意「题少的分未必少」：判断与填空都是 5 题，但判断每题 4 分（共 20）、填空每题 5 分（共 25），所以看到题数相同就以为分值相同会算错时间。Guideline 的时间建议也按这个顺序给：Part I 与 II 一起约 35 分钟、Part III 约 25 分钟、Part IV 约 30 分钟，顺着做刚好对上。",
      "hint": "先选择、后判断，再填空，最后才是大题。"
    },
    {
      "id": "ch00-f1",
      "ch": "ch00",
      "kp": "ch00-5",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "bug",
        "exam"
      ],
      "stem": "下面这段代码想按 Final Examination Guideline 算出期末卷面总分（四部分合计应为 100 分），但运行结果是 83。请指出错误所在并说明改法。",
      "code": "public class Total {\n    public static void main(String[] args) {\n        int part1 = 10 + 3;\n        int part2 = 5 * 4;\n        int part3 = 5 * 5;\n        int part4 = 25;\n        int total = part1 + part2 + part3 + part4;\n        System.out.println(total);\n    }\n}",
      "accept": [
        {
          "hint": "指出 Part I 是 10 题 × 3 分 = 30 分，代码却写成了 10 + 3 = 13",
          "any": [
            "10*3",
            "10×3",
            "10题×3",
            "10题*3",
            "乘法",
            "相乘",
            "乘",
            "每题3分",
            "乘以3"
          ]
        },
        {
          "hint": "说明总分应为 100 分（正是因为 Part I 少了 17 分）",
          "any": [
            "100",
            "应为30",
            "30分",
            "少了17"
          ]
        },
        {
          "hint": "改法：把第 3 行改成 10 * 3 或直接写 30",
          "any": [
            "改成10*3",
            "改为10*3",
            "写成10*3",
            "改成30",
            "改为30",
            "应写30"
          ]
        }
      ],
      "minHits": 2,
      "answer": "第 3 行 int part1 = 10 + 3 应为 10 * 3（10 题 × 3 分 = 30 分）；这样四部分合计才是 30+20+25+25 = 100。",
      "explain": "Part I 是选择题 10 题、每题 3 分，合计 30 分；代码把「10 题每题 3 分」误读成「10 + 3」，于是 Part I 只剩 13 分，总分变成 13+20+25+25 = 83。其余三项都是对的（Part II 5*4 = 20、Part III 5*5 = 25、Part IV 25），补回漏掉的 17 分正好 100。这类 bug 编译通过、运行也不报错，只是结果悄悄少了一截；用「四部分合计必须等于 100」这个已知条件去验算，立刻就能发现。判据：凡是按分值表算总分的代码，都要拿总分当校验位。",
      "hint": "把四部分的分值分别和 Guideline 对一遍，看哪一项对不上。"
    },
    {
      "id": "ch01-q1",
      "ch": "ch01",
      "kp": "ch01-1",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept"
      ],
      "stem": "关于 CSC1004 推荐的 Java 开发环境，下列哪条符合讲义的说法？",
      "options": [
        {
          "text": "不推荐任何 IDE，要求全程只用命令行的 <code>javac</code> 与 <code>java</code> 完成项目"
        },
        {
          "text": "推荐 <code>IntelliJ IDEA</code>：免费开源的商业 Java IDE，自带代码补全与调试功能",
          "correct": true
        },
        {
          "text": "推荐 <code>Eclipse</code>：因为它是开源平台，可以用插件定制出各种 IDE"
        },
        {
          "text": "推荐 <code>NetBeans</code>：因为它在 JavaFX、PHP 与 C/C++ 上的支持最全面"
        }
      ],
      "explain": "lecture0 的 Java IDEs 页把三个主流 IDE 并列后逐一评价：Eclipse 与 NetBeans 后面都跟着 Not Recommended!，只有 IntelliJ IDEA 标了 Recommended!，并解释它是 free and open-source 的商业 Java IDE，功能包括 code completion、debugging、XML editing support、code refactoring、code checks、unit testing。所以 b、c 正好点到了被标注为不推荐的两个。d 走另一个极端：课程确实要用 javac/java 讲清「编译 vs 运行」，但项目开发是在 IDE 里做的，后面还要用它的 Maven 集成。",
      "hint": "注意讲义在每个 IDE 名字后面括号里写的那句评价。"
    },
    {
      "id": "ch01-q2",
      "ch": "ch01",
      "kp": "ch01-4",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "trap",
        "concept"
      ],
      "stem": "下面程序中，你在第 5 行 <code>sum += i;</code> 左侧的行号区（gutter）点了一个红点作为断点，然后点 Debug 启动。当程序第一次停在这个断点时，Variables 面板里 <code>sum</code> 的值是？",
      "code": "public class T1 {\n    public static void main(String[] args) {\n        int sum = 0;\n        for (int i = 1; i <= 4; i++) {\n            sum += i;\n        }\n        System.out.println(sum);\n    }\n}",
      "options": [
        {
          "text": "<code>10</code>"
        },
        {
          "text": "<code>0</code>",
          "correct": true
        },
        {
          "text": "<code>1</code>"
        },
        {
          "text": "<code>4</code>"
        }
      ],
      "explain": "断点让程序在「该行执行之前」暂停：第一次停下时 <code>sum += i;</code> 一次都还没执行，所以 sum 仍是第 3 行赋进去的 0，而此时 i 已经是 1。选 1 的人把「停在这一行」理解成「这一行已经执行完」——这是调试最常见的误解；选 4 的人以为断点要等循环跑几次才生效，其实每次经过都会停；选 10 的人把 Debug 当成 Run，10 是程序跑完后的结果，只有按 Resume Program 继续执行才会到那一步。判据：调试器停在某行，表示该行尚未执行。",
      "hint": "断点停下的那一行，是已经执行了还是还没执行？"
    },
    {
      "id": "ch01-q3",
      "ch": "ch01",
      "kp": "ch01-5",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "trap",
        "concept"
      ],
      "stem": "调试时程序停在某一行，你想临时看清表达式 <code>list.size()</code> 的值，但不想改源码、也不想丢掉当前的调用栈。最符合 IntelliJ IDEA 用法的做法是？",
      "options": [
        {
          "text": "把断点删掉再重新 Debug 一次，看这次会不会多打印一点东西"
        },
        {
          "text": "在 Variables & Threads 面板按 <code>Alt+F8</code>，在弹出框里输入 <code>list.size()</code> 求值",
          "correct": true
        },
        {
          "text": "在源码里加一行 <code>System.out.println(list.size())</code>，再重新点 Run"
        },
        {
          "text": "按 Resume Program 让程序跑完，再从控制台的输出里找 size"
        }
      ],
      "explain": "Tutorial 1 明确写了这个用法：在 Variables & Threads 里按 Alt+F8 可以输入调试代码，能访问局部变量与全局变量，相当于一个 debug console——它不改源码，也不打断当前会话，所以能就地看到 list.size()。b 会改代码、重新编译，之前的调用栈与变量现场全部丢失；c 让程序直接跑完，恰恰越过了你想观察的那一刻；d 删掉断点后重跑，得到的还是同一份输出，不会凭空多出信息。判据：只想「看」就用求值窗口，真要「改」才动源码。",
      "hint": "讲义给了一个能在暂停时输入表达式的快捷键。"
    },
    {
      "id": "ch01-t1",
      "ch": "ch01",
      "kp": "ch01-2",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept"
      ],
      "stem": "在 IntelliJ IDEA 里第一次新建 Java 项目，IDE 提示没有可用的 JDK。按 Tutorial 1 的说法，正确的处理是？",
      "options": [
        {
          "text": "只能手动去官网下载并解压，IDE 完全不支持自动安装 JDK"
        },
        {
          "text": "让 <code>IntelliJ IDEA</code> 自动下载并配置 JDK——IDE 提供了自动获取 JDK 的方式",
          "correct": true
        },
        {
          "text": "先安装 Python，<code>IntelliJ IDEA</code> 会自动带上 JDK"
        },
        {
          "text": "把 <code>.java</code> 文件改名为 <code>.class</code> 再打开，IDE 就会识别"
        }
      ],
      "explain": "Tutorial 1 的原话是 you might need to download the JDK，紧接着一句 IntelliJ IDEA provides an automatic way to get the JDK——所以第一次建项目时点几下让 IDE 下载即可，不必自己折腾。JDK 提供 javac 编译器与 JVM，IDE 只是集成开发环境；缺 JDK 时项目无法编译运行，所以这个问题必须解决，不能绕。b 与 Java 环境无关；c 是把方向搞反了（.class 是编译产物，改扩展名不会生成字节码）；d 否定了 IDE 明明提供的自动能力。",
      "hint": "Tutorial 里那句 provides an automatic way 说的是什么？"
    },
    {
      "id": "ch01-t2",
      "ch": "ch01",
      "kp": "ch01-5",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept"
      ],
      "stem": "调试时程序停在 <code>main</code> 里调用 <code>helper()</code> 的那一行，你想进入 <code>helper()</code> 内部逐行看它怎么执行，应该用哪个操作？",
      "options": [
        {
          "text": "<code>Run</code>：重新从头运行程序"
        },
        {
          "text": "<code>Step Into</code>：遇到函数就进去，在函数内部逐行暂停",
          "correct": true
        },
        {
          "text": "<code>Step Over</code>：不进入函数，直接跳到下一行"
        },
        {
          "text": "<code>Resume Program</code>：忽略后面的断点，把程序执行完"
        }
      ],
      "explain": "讲义的三个定义要分清：Step into 是「遇到函数时进入函数内部，并在函数里的每一行停下来」；Step over 不进入函数，而是把整个函数当成一步执行完、直接跳到你当前方法的下一行；Resume Program 忽略后面的断点继续执行到结束。所以只有 Step Into 能看到 helper() 内部。b 恰好是你不想看到的效果——整段函数被跳过；c、d 都是让程序继续往下跑，直接丢掉你想观察的那一刻。判据：想「进去」用 Into，想「跨过去」用 Over。",
      "hint": "Into 是进去，Over 是跨过去。"
    },
    {
      "id": "ch01-t3",
      "ch": "ch01",
      "kp": "ch01-7",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "trap",
        "concept"
      ],
      "stem": "在一个 Maven 项目里执行 <code>mvn clean</code>，会发生什么？",
      "options": [
        {
          "text": "把项目打包成 JAR 并安装到本地仓库"
        },
        {
          "text": "删除上一次构建生成的文件（例如 target 目录里的产物），<code>src</code> 下的源码保留",
          "correct": true
        },
        {
          "text": "删除 <code>src</code> 目录下的所有 <code>.java</code> 文件，把项目恢复成空目录"
        },
        {
          "text": "编译所有源文件并生成 <code>.class</code> 文件"
        }
      ],
      "explain": "Tutorial 1 的生命周期表对 clean 的定义是 remove all files generated by the previous build——删的是上一次构建的产物，不是源码。c 是 compile 阶段的职责（编译源码），d 要 package 之后再 install 才进本地仓库，三个阶段的职责不能混。把 clean 理解成「清空项目」是初学者的经典误解，后果往往是以为源码丢了而重写；正确的心智模型是：clean 只打扫「生成物」，源代码是输入，任何生命周期阶段都不会自动删掉它。",
      "hint": "看定义里的关键字 generated by the previous build。"
    },
    {
      "id": "ch01-t4",
      "ch": "ch01",
      "kp": "ch01-6",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "concept"
      ],
      "stem": "判断：Maven 用 <code>pom.xml</code> 描述项目，其中 <code>project</code> 是根元素，<code>modelVersion</code> 应设为 <code>4.0.0</code>。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "lecture0 的 pom.xml 元素表逐行给出：project 是 pom.xml 的根元素；modelVersion 指定模型版本且应设为 4.0.0；groupId、artifactId、version 用来定位这个构件；packaging 决定 jar 还是 war；dependencies 里放 dependency，scope 可取 compile、provided、runtime、test、system。POM 是 Project Object Model 的缩写，Maven 的依赖管理、构建、文档生成都以它为配置中心——所以这些元素不是格式细节，而是 Maven 读懂你项目的入口，写错一个就可能拉不到依赖或打不出包。",
      "hint": "POM 里的根元素叫什么，模型版本号又是多少？"
    },
    {
      "id": "ch01-t5",
      "ch": "ch01",
      "kp": "ch01-1",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "trap",
        "concept"
      ],
      "stem": "判断：只要装了 <code>IntelliJ IDEA</code> 就能编译和运行 Java 程序，JDK 不是必需的。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "IDE 是集成开发环境：编辑器、调试器、构建工具的界面，它自己并不提供 javac 与 JVM。真正把 .java 编译成 .class、并让 java 命令跑起来的是 JDK。Tutorial 1 说 IDEA 会 provide an automatic way to get the JDK，意思是它可以替你下载和配置，而不是不需要 JDK；缺 JDK 时项目直接显示没有 SDK，运行按钮按下去也没有结果。这就是「装好 IDE 就万事大吉」这个误解的根源：环境 = IDE + JDK，两者角色不同，谁也不能替代谁。",
      "hint": "是谁把 .java 变成 .class？"
    },
    {
      "id": "ch01-t6",
      "ch": "ch01",
      "kp": "ch01-3",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "code"
      ],
      "stem": "源文件 <code>Hello.java</code> 的内容如下。在它所在的目录里先执行 <code>javac Hello.java</code>，再执行 <code>java Hello</code>（后面没有别的词），写出程序的完整输出。",
      "code": "public class Hello {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, \" + args.length + \" args\");\n    }\n}",
      "answer": "Hello, 0 args",
      "explain": "javac 只做编译：Hello.java 编译出 Hello.class，这一步不执行程序；java 才是启动 JVM 运行那个类，而且它后面只写类名、不写扩展名——写成 java Hello.class 会报找不到主类。这条命令里类名后面什么都没有，所以 main 收到的 args 是空数组、args.length 为 0。如果改成 java Hello A B，输出就会变成 Hello, 2 args：类名后面那些用空格分开的词才是参数，类名本身永远不进 args。误答 Hello, 1 args 的人正是把类名当成了第一个参数。",
      "hint": "java 后面除了类名，还有别的词吗？类名算不算参数？"
    },
    {
      "id": "ch01-t7",
      "ch": "ch01",
      "kp": "ch01-4",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "trap"
      ],
      "stem": "下面程序在第 6 行设了一个断点。点 Debug 启动后，你没有做任何单步操作，直接按 Resume Program 让程序执行完。写出程序的标准输出（逐行）。",
      "code": "public class Names {\n    public static void main(String[] args) {\n        String[] names = {\"Ada\", \"Bob\", \"Cyd\"};\n        String out = \"\";\n        for (int i = 0; i < names.length; i++) {\n            out = out + names[i] + \";\";\n        }\n        System.out.println(out);\n    }\n}",
      "answer": "Ada;Bob;Cyd;",
      "explain": "断点只让程序在调试时暂停，它不往标准输出打印任何东西——变量的值出现在 Debug 面板的 Variables 里，不会跑到控制台。Resume Program 是「忽略断点继续执行」，所以三次循环照常跑完，out 依次拼成 Ada;、Ada;Bob;、Ada;Bob;Cyd;，最后 println 打印整行。把输出写成三行 Ada、Bob、Cyd，或者写成 Ada;Bob;Cyd 的都少了最后那个分号；更常见的是以为每次停在断点就会输出一次。判据：输出只由 print/println 决定，调试器不改变程序本身的行为。",
      "hint": "断点会不会改变程序打印的内容？"
    },
    {
      "id": "ch01-t8",
      "ch": "ch01",
      "kp": "ch01-3",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "concept",
        "syntax"
      ],
      "stem": "用命令行把源文件 <code>Hello.java</code> 编译成字节码 <code>Hello.class</code>，应执行 <code>____ Hello.java</code>。",
      "answer": "javac",
      "accept": [
        "javac",
        "javac.exe"
      ],
      "explain": "javac 是 Java 编译器（java compiler）：读 .java 源文件、检查语法与类型、产出 .class 字节码，这一步不执行程序逻辑。java 命令则是启动 JVM 并加载类，所以它后面写类名而不是文件名。两者的差别正好解释了两个高频错误：用 java Hello.java 运行会报找不到主类，用 javac Hello 编译会报找不到文件——一个要类名，一个要带扩展名的源文件。",
      "hint": "编译器的名字是 javac，运行器的名字是 java。"
    },
    {
      "id": "ch01-t9",
      "ch": "ch01",
      "kp": "ch01-7",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "concept"
      ],
      "stem": "Maven 生命周期里，把编译后的代码打包成可分发的格式（如 JAR）的阶段是 <code>____</code>。",
      "answer": "package",
      "accept": [
        "package",
        "打包"
      ],
      "explain": "按 Tutorial 1 的顺序：validate 检查项目信息是否完整 → compile 编译源码 → test 跑单元测试（此时还不打包）→ package 把编译产物压成 JAR 等可分发格式 → verify 检查包是否有效 → install 放进本地仓库供其他项目依赖 → deploy 上传到远程仓库。所以「打成 JAR」落在 package：不是 compile（那一步只产出 .class），也不是 install（那一步是把已经打好的包复制到本地仓库）。",
      "hint": "「打包」这个动作在英文里的名字就是答案。"
    },
    {
      "id": "ch01-t10",
      "ch": "ch01",
      "kp": "ch01-1",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "concept",
        "project"
      ],
      "stem": "Tutorial 1 提到，用学校的 CUHKSZ 邮箱在 JetBrains 账号页可以申请许可证，从而使用 <code>____</code> 版 <code>IntelliJ IDEA</code>（以及 Professional PyCharm）。",
      "answer": "Ultimate",
      "accept": [
        "Ultimate",
        "ultimate",
        "Ultimate版",
        "ultimate版",
        "旗舰版",
        "终极版"
      ],
      "explain": "Tutorial 1 的说明是：用学校邮箱在 account.jetbrains.com/licenses 申请许可证，可以激活 Ultimate 版 IntelliJ IDEA 与 Professional PyCharm。同一页还提醒，现在已经不单独售卖 ultimate edition，而且大多数情况下用不到 Ultimate 的功能——也就是说，日常写 CSC1004 的项目并不依赖它的高级特性，但凭学校许可证可以合法使用全功能版本。把这两句合起来读，才不会误以为「必须用付费的 Ultimate 才能做项目」。",
      "hint": "IDEA 有 Community 版，还有 ____ 版。"
    },
    {
      "id": "ch01-t11",
      "ch": "ch01",
      "kp": "ch01-6",
      "type": "multi",
      "difficulty": 2,
      "tags": [
        "concept",
        "project"
      ],
      "stem": "讲义在介绍 Maven 时列出了它的主要功能。下列哪些属于这些功能？（多选）",
      "options": [
        {
          "text": "为每个项目添加一组 JAR 包（管理依赖）",
          "correct": true
        },
        {
          "text": "创建正确的项目结构",
          "correct": true
        },
        {
          "text": "构建与部署项目",
          "correct": true
        },
        {
          "text": "代替 JDK 提供 <code>javac</code> 编译器"
        },
        {
          "text": "自动替你写出项目的业务代码"
        }
      ],
      "explain": "lecture0 把 Maven 的主要功能概括成三条：Adding a set of Jars in each project、Creating the right project structure、Building and Deploying the project；它基于 POM 工作，还能生成项目文档、管理多模块项目。它本身不是编译器——把 .java 变成 .class 的始终是 JDK 自带的 javac，Maven 只是调用它；它也不会替你写业务代码，连助教都不会（讲义写明 TAs will not write any code for you）。把构建工具与编译器、代码生成器混为一谈，是配项目时最容易走偏的地方。",
      "hint": "Maven 管的是「结构、依赖、构建」，不是编译器和代码生成器。"
    },
    {
      "id": "ch01-t12",
      "ch": "ch01",
      "kp": "ch01-7",
      "type": "order",
      "difficulty": 2,
      "tags": [
        "concept"
      ],
      "stem": "把 Maven 生命周期的前五个阶段按讲义给出的先后顺序排列。",
      "options": [
        {
          "text": "<code>test</code>"
        },
        {
          "text": "<code>package</code>"
        },
        {
          "text": "<code>clean</code>"
        },
        {
          "text": "<code>compile</code>"
        },
        {
          "text": "<code>validate</code>"
        }
      ],
      "answer": [
        2,
        4,
        3,
        0,
        1
      ],
      "explain": "讲义的生命周期表按 clean、validate、compile、test、package、verify、install、site、deploy 排列。这个顺序也有依赖逻辑：先 clean 清掉上一次的产物，再 validate 确认项目信息完整，然后 compile 编译源码，编译通过才谈得上 test（测试跑的就是编译出来的类），测试通过才 package 打成 JAR。顺序颠倒的典型症状是「测试跑的还是旧的 .class」——因为没先 compile；或者「JAR 里少了新写的类」——因为打包前没有重新编译。",
      "hint": "想一想每一步需要哪一步的产物。"
    },
    {
      "id": "ch01-c1",
      "ch": "ch01",
      "kp": "ch01-3",
      "type": "code",
      "difficulty": 2,
      "tags": [
        "code",
        "concept"
      ],
      "stem": "补全 <code>Sum</code> 类：把命令行参数（都是数字字符串）逐个转成整数并求和，最后打印总和。例如在 IntelliJ 的 Run Configuration 里把 Program arguments 设为 <code>3 4 5</code>，程序应输出 <code>12</code>。",
      "starter": "public class Sum {\n    public static void main(String[] args) {\n        // TODO: args 的元素是字符串，先转成整数再累加，最后打印总和\n    }\n}\n",
      "solution": "public class Sum {\n    public static void main(String[] args) {\n        int sum = 0;\n        for (int i = 0; i < args.length; i++) {\n            sum += Integer.parseInt(args[i]);\n        }\n        System.out.println(sum);\n    }\n}",
      "tests": [
        {
          "stdin": "",
          "args": [
            "3",
            "4",
            "5"
          ],
          "expect": "12"
        }
      ],
      "explain": "main 的参数类型是 String[]，即使传进来的是 3 也还是字符串，必须先 Integer.parseInt 转成 int 才能相加；直接写 sum += args[i] 会编译错误，因为 String 不能赋给 int。args 的内容由运行配置决定：IDEA 里是 Run Configuration 的 Program arguments，命令行里是类名后面那些用空格分开的词，所以 args.length 是参数个数而不是字符数。累加变量 sum 要先初始化为 0，否则编译时会报可能未初始化就使用。",
      "hint": "先想清楚 args[i] 是什么类型，再想加法需要什么类型。"
    },
    {
      "id": "ch01-f1",
      "ch": "ch01",
      "kp": "ch01-8",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "bug",
        "concept"
      ],
      "stem": "同学把下面这段代码保存成 <code>First.java</code>，然后在命令行执行 <code>javac First.java</code>，编译器报错：<code>class Hello is public, should be declared in a file named Hello.java</code>。请指出原因，并说明两种改法中的任意一种。",
      "code": "public class Hello {\n    public static void main(String[] args) {\n        System.out.println(\"Hi\");\n    }\n}",
      "accept": [
        {
          "hint": "指出 public 类名 Hello 与文件名 First.java 不一致",
          "any": [
            "类名",
            "文件名",
            "不一致",
            "不匹配",
            "不同名",
            "没有同名",
            "必须同名",
            "同名"
          ]
        },
        {
          "hint": "改法：把文件改名为 Hello.java，或把类名改成 First",
          "any": [
            "Hello.java",
            "改名",
            "重命名",
            "命名",
            "改成first",
            "改为first",
            "类名改成first",
            "叫first",
            "改成hello"
          ]
        }
      ],
      "minHits": 2,
      "answer": "文件名 First.java 与 public 类名 Hello 不一致：public 类必须放在与类名同名的 .java 文件里。改法：把文件改名为 Hello.java，或把类声明改成 public class First。",
      "explain": "javac 的规则是：一个 .java 文件里可以有多个类，但被 public 修饰的那个类必须与文件名（不含扩展名）完全相同，而且大小写敏感。First.java 里声明的是 public class Hello，编译器就去找 Hello.java，找不到便报出这句 should be declared in a file named Hello.java。两种改法等价：把文件重命名为 Hello.java，或者把类声明改成 public class First。这类错误的隐蔽之处在于代码本身完全正确，只是文件名与类名错位——所以看到报错里出现 a file named 某某.java，第一步就核对文件名。",
      "hint": "报错里已经写出了它期望的文件名。"
    },
    {
      "id": "ch02-q1",
      "ch": "ch02",
      "kp": "ch02-2",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept"
      ],
      "stem": "关于讲义所说的 AI 编程助手（AI coding assistant），下列说法正确的是？",
      "options": [
        {
          "text": "它生成的代码不需要再审查，因为模型已经见过大量正确的代码，出错概率极低"
        },
        {
          "text": "它由在大量源代码与自然语言上训练的大语言模型驱动，能预测下一行代码、把自然语言翻译成代码，也能解释和重构已有代码",
          "correct": true
        },
        {
          "text": "它本质上是一个在线编译器：你点运行，它负责把 <code>.java</code> 文件编译成 <code>.class</code> 文件并返回报错"
        },
        {
          "text": "它只能生成新代码，不能解释也不能重构已有代码，解释功能要靠人工写注释"
        }
      ],
      "explain": "lecture1 说 AI 编程助手由大语言模型驱动，训练数据是 vast datasets of source code and natural language，因此能 Understand programming syntax and patterns、Predict the next line of code、Translate human language into code、Explain and refactor existing code——四项能力是一次性给出的。b 混淆了工具角色：编译是 JDK 里 javac 的活，模型并不负责编译你的文件；c 直接否认了后两项能力；d 与讲义传统对比表里的 May require reviewing and correcting AI-generated code 相矛盾。把 AI 当成编译器会低估它，把它当成真理来源又会高估它。",
      "hint": "把讲义列的四个 bullet 一条条对照选项。"
    },
    {
      "id": "ch02-q2",
      "ch": "ch02",
      "kp": "ch02-5",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept"
      ],
      "stem": "你写聊天室客户端时卡住了，准备问 DeepSeek。方式甲：只写「帮我写一个聊天室」。方式乙：贴出已有的 <code>Client</code> 类代码，附上报错 <code>ConnectException: Connection refused</code>，并说明期望「点按钮后连上 9000 端口并显示已连接」。哪一种更符合讲义的建议？",
      "options": [
        {
          "text": "方式甲更好：贴整段代码会超出模型的上下文，回答反而更差"
        },
        {
          "text": "方式乙更好：把完整代码、报错和期望行为一起给出，信息越全歧义越少",
          "correct": true
        },
        {
          "text": "方式甲更好：需求越短，模型越能自由发挥，不容易被既有代码带偏"
        },
        {
          "text": "两者一样：模型靠的是训练数据，提问里写什么不影响结果"
        }
      ],
      "explain": "lecture1 在两处强调同一件事：Adaptive Debugging 一节建议提供完整代码（including all relevant background），Natural Language to Code 一节建议附上所有相关背景代码，并直接写 More information reduces ambiguity；它还列了 Context Awareness——模型能理解依赖、先前代码与你的项目目标。方式甲只给一句需求，模型只能猜技术栈、猜你写到哪一步；方式乙把现场交给它，答案才可能落在你的项目里。c 否认了提示词的作用；d 与「信息越多越好」正好相反。",
      "hint": "讲义反复写的那句 More information reduces ambiguity。"
    },
    {
      "id": "ch02-q3",
      "ch": "ch02",
      "kp": "ch02-3",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "trap",
        "concept"
      ],
      "stem": "讲义说可以用 vibe coding 在十分钟内做完 Project 1。据此，下列判断正确的是？",
      "options": [
        {
          "text": "十分钟做完的项目不能提交，讲义明文禁止用 AI 工具完成课程项目"
        },
        {
          "text": "十分钟能做出可运行的原型，但这不等于掌握了课程要求：讲义说学会用 DeepSeek 要三到四周，项目还要求你能自己设计、调试并解释代码",
          "correct": true
        },
        {
          "text": "既然十分钟就能做完，就不必再学 Java 语法与调试，三个项目都可以直接让 AI 全权代写后提交"
        },
        {
          "text": "十分钟做完说明 AI 生成的代码一定正确，可以不做验证就直接写进项目交上去"
        }
      ],
      "explain": "lecture1 的原话是 Finish Project 1 in ten minutes with vibe coding，紧接着一句 Learning from DeepSeek takes a longer time: Three to Four Weeks!——十分钟指的是产出一个能跑的原型，三四周指的是你真正掌握这套工作流。lecture0 又把自学与调试能力列为这门课成功的关键，项目还要交基本功能与演示视频，说明验收看的是你能讲清、能改对的东西。b 把工具当成了学习的替代品；c 忽略了讲义把 Verify 明确列为三步中的第三步；d 与 lecture0 允许项目使用 AI 的规定相反。",
      "hint": "十分钟后面紧跟着的那句话才是重点。"
    },
    {
      "id": "ch02-t1",
      "ch": "ch02",
      "kp": "ch02-1",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept"
      ],
      "stem": "讲义用一张表对比传统编程与 AI 编程。下列哪一条符合表中的说法？",
      "options": [
        {
          "text": "传统编程无法处理重复的样板代码，AI 编程则完全不产生样板代码，所以更省时间"
        },
        {
          "text": "传统编程由程序员逐行手写、需人工逐步调试；AI 编程由模型生成代码、能实时发现并建议修复 bug，但生成的代码可能需要人审查和修正",
          "correct": true
        },
        {
          "text": "传统编程不需要懂语法与语义，只有 AI 编程才要求程序员深入理解语言细节"
        },
        {
          "text": "AI 编程不需要调试，因为模型在训练时已经把常见的 bug 类型都排除掉了"
        }
      ],
      "explain": "表里是逐项对照：Programmers write all code manually 对 AI generates code automatically；Requires deep knowledge of syntax and semantics 对 Can help beginners by explaining and generating syntax；Debugging is done manually step-by-step 对 AI may detect and suggest fixes for bugs in real-time；repetitive tasks 耗时 对 由 AI 处理 boilerplate；按程序员的逻辑与规划写 对 由自然语言提示生成；High control and precision over every line 对 May require reviewing and correcting AI-generated code。b 把两侧说反了，传统编程恰恰要求更深的语法语义功底；c 忽略了「实时建议」不等于「保证正确」；d 的后半句是编的——AI 擅长的正是替你写样板代码，而不是让样板代码消失。",
      "hint": "表里每一行都是「一边怎样、另一边怎样」，别只记住一边。"
    },
    {
      "id": "ch02-t2",
      "ch": "ch02",
      "kp": "ch02-3",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept"
      ],
      "stem": "你有一个能跑但写得很乱的 <code>GomokuGame</code> 类，希望 DeepSeek 把它拆成更清晰的类结构、去掉重复代码，但不改变现有功能。这用的是讲义的哪项能力？",
      "options": [
        {
          "text": "<code>Adaptive Debugging</code>：检测、解释并交互式修正 bug"
        },
        {
          "text": "<code>Refactoring Support</code>：为清晰性、结构与可维护性重写代码",
          "correct": true
        },
        {
          "text": "<code>Code Generation</code>：从描述生成类、函数和文档"
        },
        {
          "text": "<code>Code Understanding</code>：用自然语言解释程序的目的与流程"
        }
      ],
      "explain": "讲义的四项能力各对应一种诉求：Code Understanding 是读懂并解释（只说不改），Code Generation 是从描述造出新代码（会引入新东西），Refactoring Support 是 Rewrites code for clarity, structure, and maintainability（功能不变、结构变好），Adaptive Debugging 是给有 bug 的代码定位并修。本题的关键词是「不改变现有功能、结构更清晰」，正好是重构的定义。选 Code Generation 的人会拿到一份重新写过的代码，等于把原来的实现丢掉，反而更危险。",
      "hint": "功能不变、结构变好——这是哪种操作的定义？"
    },
    {
      "id": "ch02-t3",
      "ch": "ch02",
      "kp": "ch02-3",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept"
      ],
      "stem": "讲义把与 DeepSeek 协作概括为三点：Natural Dialogue、Dynamic Feedback、Context Awareness。其中 <code>Dynamic Feedback</code> 指的是？",
      "options": [
        {
          "text": "模型会记住你说过的每一句话，所以第一次提问之后就不必再提供代码"
        },
        {
          "text": "模型在提出改进方案的同时解释它的设计选择与语法，让你边改边懂",
          "correct": true
        },
        {
          "text": "模型会自动编译并运行你的代码，再把运行结果反馈到聊天窗口"
        },
        {
          "text": "你每改一行代码，IDE 就自动把改动同步到云端仓库"
        }
      ],
      "explain": "lecture1 原文：Dynamic Feedback 是 DeepSeek explains design choices and syntax while proposing improvements，也就是「给方案 + 讲为什么」的即时反馈，这正是它区别于只吐代码的工具的地方。b 把模型当成了运行环境：真正执行代码的是 JDK 与 JVM，模型不会自动跑你的程序——这也正是必须自己 Verify 的原因；c 编造了云端同步；d 与 Context Awareness 的本意相反，上下文感知是模型能理解你给出的依赖、先前代码与项目目标，前提是你把相关代码贴给它。",
      "hint": "dynamic 强调的是「边聊边给理由」，不是「自动运行」。"
    },
    {
      "id": "ch02-t4",
      "ch": "ch02",
      "kp": "ch02-3",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "concept"
      ],
      "stem": "判断：讲义把 vibe coding 描述成一个「想法 → 生成 → 改进」的循环，而不是把需求一次性丢给 AI 就结束。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "lecture1 的原话是 development becomes a loop of idea to generation to refinement，未来愿景里又用 Continuous 形容这条流程：ideas flow directly into functional prototypes。所以一次提问就期待拿到最终代码，不符合讲义描述的工作流——生成之后必然有 refinement（补上下文、改需求、修 bug），而 refinement 又会引出新一轮对话。这也解释了为什么「多轮对话 + 每次都贴全上下文」比「一句话许愿」有效：循环本来就要走好几圈。",
      "hint": "loop 这个词说明至少要走两圈。"
    },
    {
      "id": "ch02-t5",
      "ch": "ch02",
      "kp": "ch02-6",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "trap",
        "concept"
      ],
      "stem": "判断：只要 DeepSeek 生成的代码能编译通过，就说明逻辑正确，可以直接写进项目。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "编译通过只证明语法合法、类型匹配，逻辑错误照样能编译、能运行，只是结果是错的——循环少跑一项、整数除法丢掉小数、条件写反都属于这一类。讲义把 Verify the Code Generated by DeepSeek 单列为第三步，正因为「能跑」与「符合需求」是两件事：正确性必须靠具体输入去对比期望输出，或者用边界值、异常输入去撞它。把编译器点头当成逻辑正确的证明，是使用 AI 时最危险的偷懒。",
      "hint": "编译器管语法，谁管逻辑？"
    },
    {
      "id": "ch02-t6",
      "ch": "ch02",
      "kp": "ch02-6",
      "type": "predict",
      "difficulty": 3,
      "tags": [
        "output",
        "trap"
      ],
      "stem": "DeepSeek 生成了下面这段求平均分的代码，并在说明里写输出是 <code>2.3333333333333335</code>。你自己跑一遍，实际输出是什么？（只要输出那一行）",
      "code": "public class Avg {\n    public static void main(String[] args) {\n        int[] a = {1, 2, 4};\n        int sum = 0;\n        for (int i = 0; i < a.length; i++) {\n            sum += a[i];\n        }\n        double avg = sum / a.length;\n        System.out.println(avg);\n    }\n}",
      "answer": "2.0",
      "explain": "关键在 <code>sum / a.length</code>：除号两边都是 int，Java 先做整数除法（7 / 3 = 2，小数被截断），再把结果 2 赋给 double，于是打印 2.0 而不是 2.333…。要拿到真实平均值，必须让除法发生在浮点域：写成 <code>(double) sum / a.length</code> 或 <code>sum * 1.0 / a.length</code>。这正是「AI 的说明要自己验」的典型例子：代码能编译、能运行，注释里还写着精确的小数，看上去无懈可击，但结果就是错的。",
      "hint": "先看除号两边是什么类型。"
    },
    {
      "id": "ch02-t7",
      "ch": "ch02",
      "kp": "ch02-6",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "trap"
      ],
      "stem": "DeepSeek 写下面这段代码时说明「求 1 到 5 的和，输出 15」。你运行后实际输出是什么？",
      "code": "public class Total {\n    public static void main(String[] args) {\n        int n = 5;\n        int sum = 0;\n        for (int i = 1; i < n; i++) {\n            sum += i;\n        }\n        System.out.println(sum);\n    }\n}",
      "answer": "10",
      "explain": "循环条件是 <code>i &lt; n</code>，i 取 1、2、3、4 就停了，5 从来没有加进去，所以是 1+2+3+4 = 10；要覆盖 1 到 n 必须写 <code>i &lt;= n</code>。这类「边界差一」的 bug 编译能过、也不抛异常，只在边界值上悄悄给出错误答案，用 {1,2,3} 这种小数据几乎发现不了。审查 AI 代码时要专门设计边界输入：最小值、最大值、最后一项、空集合，逐一对照期望输出。",
      "hint": "把 i 的取值列出来，看最后一项有没有进去。"
    },
    {
      "id": "ch02-t8",
      "ch": "ch02",
      "kp": "ch02-6",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "concept",
        "code"
      ],
      "stem": "讲义把用 vibe coding 完成 Project 1 拆成三步，其中第三步是 <code>____</code> the Code Generated by DeepSeek。",
      "answer": "Verify",
      "accept": [
        "Verify",
        "verify",
        "验证",
        "检查",
        "核实"
      ],
      "explain": "三步是 Build a Java Project → Chat with DeepSeek → Verify the Code Generated by DeepSeek。第三步之所以被单独列出来，是因为前两步的产物只是「看着该这么做」的代码：模型没有在你的项目里编译过它，也不知道其它类怎么调用它、你的类名与字段叫什么。跳过验证等于把没跑过的代码当成品，而这一步恰恰是三步里唯一由你负责、也只能由你负责的一步。",
      "hint": "第三步的动词是「核实」的英文，以 V 开头。"
    },
    {
      "id": "ch02-t9",
      "ch": "ch02",
      "kp": "ch02-5",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "concept"
      ],
      "stem": "讲义建议把完整代码连同所有相关背景一起提供给 AI，理由是：信息越多，<code>____</code> 越少（原文：More information reduces ____）。",
      "answer": "ambiguity",
      "accept": [
        "ambiguity",
        "歧义",
        "不确定性"
      ],
      "explain": "模型只能依据你给出的信息推断技术栈、类结构与目标；少贴一段代码，它就可能自己编一个不存在的字段名，或者假定一个与你不同的类结构。讲义因此在两处提示要附上 all relevant background code，并直接写 More information reduces ambiguity。这就是「上下文」这一提示词要素的实际含义：不是把话说长，而是把模型无法从训练数据里知道你项目的那部分信息补上——文件名、已有方法签名、报错原文、期望行为。",
      "hint": "一个以 a 开头的英文名词，中文是「歧义」。"
    },
    {
      "id": "ch02-t10",
      "ch": "ch02",
      "kp": "ch02-2",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "concept"
      ],
      "stem": "AI 编程助手背后的模型叫 Large Language Models，中文通常译作「<code>____</code> 模型」。",
      "answer": "大语言",
      "accept": [
        "大语言",
        "大型语言",
        "大语言模型",
        "大模型",
        "LLM"
      ],
      "explain": "LLM 是 Large Language Model 的缩写，在海量源代码与自然语言上预训练，因此同时「懂」编程语法模式和人类语言——这正是它能把你的一句中文需求翻译成代码的原因。但它的本质是预测下一个 token（在代码里就是预测下一行），并不是真的执行你的程序，所以它给出的运行结果、输出、报错都必须由你自己验证；这也解释了它为什么能把 7 / 3 的平均值说成 2.333，却写出整数除法的代码。",
      "hint": "Large = 大，Language = 语言。"
    },
    {
      "id": "ch02-t11",
      "ch": "ch02",
      "kp": "ch02-2",
      "type": "multi",
      "difficulty": 2,
      "tags": [
        "concept"
      ],
      "stem": "讲义列出 Vibe Coding with DeepSeek 的几项关键能力。下列哪些在列表里？（多选）",
      "options": [
        {
          "text": "<code>Code Understanding</code>：逐步解释复杂逻辑",
          "correct": true
        },
        {
          "text": "<code>Adaptive Debugging</code>：检测、解释并交互式修正 bug",
          "correct": true
        },
        {
          "text": "<code>Code Generation</code>：从描述生成类、函数与文档",
          "correct": true
        },
        {
          "text": "<code>Refactoring Support</code>：为清晰性、结构与可维护性重写代码",
          "correct": true
        },
        {
          "text": "自动把项目提交到课程平台并录制演示视频"
        },
        {
          "text": "保证生成的代码无需测试即可直接使用"
        }
      ],
      "explain": "讲义的四条能力是 Code Understanding、Adaptive Debugging、Code Generation、Refactoring Support，分别对应「读懂」「修错」「造新」「改结构」四种诉求。第五项是编的：模型没有替你提交作业、录演示视频的能力，这些仍然是项目要求你完成的部分；第六项与讲义把 Verify 单列为第三步直接冲突——能力清单里没有任何一条叫「保证正确」。把 AI 的能力记成这四条并守住边界，就不容易高估它。",
      "hint": "四条能力都围绕代码本身，没有一条是替你交作业。"
    },
    {
      "id": "ch02-t12",
      "ch": "ch02",
      "kp": "ch02-3",
      "type": "order",
      "difficulty": 2,
      "tags": [
        "concept",
        "project"
      ],
      "stem": "按讲义给出的顺序，排列用 vibe coding 完成 Project 1 的三个步骤。",
      "options": [
        {
          "text": "Verify the Code Generated by DeepSeek（验证生成的代码）"
        },
        {
          "text": "Build a Java Project（先把 Java 项目建起来）"
        },
        {
          "text": "Chat with DeepSeek（与 DeepSeek 对话）"
        }
      ],
      "answer": [
        1,
        2,
        0
      ],
      "explain": "讲义的三步写得明确：Step 1 Build a Java Project、Step 2 Chat with DeepSeek、Step 3 Verify the Code Generated by DeepSeek。顺序不能倒：没有项目就没有地方落代码；没有对话就没有代码可验；验证必须放在最后，因为它要检查「生成的东西放进这个项目里能不能跑对」。跳过第一步直接聊天，往往拿到一段与你的 Maven 结构、类名都对不上的代码，回头改起来比自己写还费时间。",
      "hint": "先有容器，再有内容，最后才谈对不对。"
    },
    {
      "id": "ch02-f1",
      "ch": "ch02",
      "kp": "ch02-8",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "bug",
        "trap"
      ],
      "stem": "下面这段是 DeepSeek 生成的「统计及格人数」代码，数组里是 58、72、45 三个分数，应该只有 1 人及格，但程序打印 3。请指出 bug 所在并说明改法。",
      "code": "public class Pass {\n    public static void main(String[] args) {\n        int[] scores = {58, 72, 45};\n        int pass = 0;\n        for (int i = 0; i < scores.length; i++) {\n            if (scores[i] >= 60);\n            {\n                pass++;\n            }\n        }\n        System.out.println(pass);\n    }\n}",
      "accept": [
        {
          "hint": "指出 if 条件后面多了一个分号，if 的语句体变成了空语句",
          "any": [
            "分号",
            "空语句",
            "多余的分号",
            "条件后面",
            "if后面"
          ]
        },
        {
          "hint": "指出后果：下面的大括号块无条件执行，三个人全被算成及格",
          "any": [
            "无条件",
            "都会",
            "每次都",
            "全都",
            "全部",
            "都算"
          ]
        },
        {
          "hint": "改法：删掉那个分号，让代码块成为 if 的语句体",
          "any": [
            "删",
            "去掉",
            "移除",
            "取消"
          ]
        }
      ],
      "minHits": 2,
      "answer": "第 6 行 if (scores[i] >= 60); 末尾多了一个分号：if 的语句体变成空语句，紧跟的大括号块成了无条件执行的普通代码块。删掉这个分号即可。",
      "explain": "Java 里单独一个分号是合法的空语句，所以 <code>if (条件);</code> 的含义是「条件成立时执行一条空语句」，而紧跟其后的那个大括号块只是一个普通代码块，每次循环都会执行——于是三个人全被计成及格，输出 3。删掉分号后，<code>pass++;</code> 所在的大括号块才成为 if 的语句体，只有 72 分的那一个会进来。这类 bug 编译通过、运行不报错、结果只是偏大，属于最需要「拿已知输入算一遍」才能发现的一类；AI 生成的代码里，多余的分号、缺一半的括号都很常见。",
      "hint": "盯着 if 那一行的末尾看。"
    },
    {
      "id": "ch03-q1",
      "ch": "ch03",
      "kp": "ch03-1",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "关于类（class）与对象（object），下列说法正确的是？",
      "options": [
        {
          "text": "同一个类的每个对象各有一份实例字段；方法是全类共享的代码，调用时才作用到某个具体对象上",
          "correct": true
        },
        {
          "text": "类是对象的一个实例，对象是创建类的模板"
        },
        {
          "text": "每创建一个对象，JVM 都会为这个对象复制一份该类的全部方法代码"
        },
        {
          "text": "字段必须声明为 <code>static</code>，才能被该类的对象用点号访问"
        }
      ],
      "explain": "类是一张模板/蓝图，对象是按模板 new 出来的实例：实例字段是\"每个对象一份\"，所以两个对象可以各存不同的值；方法代码在类里只有一份，调用时会隐式传入当前对象（this），同一份代码才能作用在不同对象上。B 把类与对象说反了；C 错在方法并不复制，只有字段各存一份；D 也说反了，static 字段才是全类共享的一份，普通实例字段恰恰是用\"对象.字段\"访问的。",
      "hint": "问自己：new 出来的是模板还是实例？方法代码会随对象复制吗？"
    },
    {
      "id": "ch03-q2",
      "ch": "ch03",
      "kp": "ch03-2",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "exam"
      ],
      "stem": "写出下面程序的输出（逐行）。",
      "code": "class Point {\n    private int x;\n    private int y;\n\n    Point() {\n        this(1, 2);\n    }\n\n    Point(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    int sum() {\n        return x + y;\n    }\n\n    void shift(int dx, int dy) {\n        x = x + dx;\n        y = y + dy;\n    }\n}\n\npublic class Q {\n    public static void main(String[] args) {\n        Point a = new Point();\n        Point b = new Point(3, 4);\n        a.shift(10, 20);\n        System.out.println(a.sum());\n        System.out.println(b.sum());\n    }\n}",
      "answer": "33\n7",
      "explain": "new Point() 调用无参构造器，它的第一行 this(1, 2) 把控制权转给两参构造器，于是 a 先被初始化成 (1, 2)，此时 sum 为 3；随后 a.shift(10, 20) 把 a 改成 (11, 22)，sum 变成 33。b 是另一个对象，用两参构造器建成 (3, 4)，sum 为 7 —— 两个对象的字段互不影响，这正是\"每个对象一份实例字段\"。注意 this(...) 只能写在构造器第一行，用来在一个构造器里转调另一个构造器。",
      "hint": "new Point() 先执行 this(1, 2)，再想想 shift 改的是哪个对象的字段。"
    },
    {
      "id": "ch03-q3",
      "ch": "ch03",
      "kp": "ch03-5",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "trap",
        "exam"
      ],
      "stem": "下面程序的输出是？",
      "code": "class Box {\n    int value;\n}\n\npublic class Q {\n    public static void main(String[] args) {\n        Box a = new Box();\n        a.value = 1;\n        Box b = a;\n        b.value = 2;\n        System.out.println(a.value);\n    }\n}",
      "options": [
        {
          "text": "<code>2</code>",
          "correct": true
        },
        {
          "text": "<code>1</code>，因为 <code>Box b = a;</code> 复制出了一份新的 Box 对象"
        },
        {
          "text": "运行时报 <code>NullPointerException</code>，因为 b 没有用 <code>new</code> 创建"
        },
        {
          "text": "编译错误，因为 <code>value</code> 没有用 <code>private</code> 修饰"
        }
      ],
      "explain": "对象变量里存的是引用（可以理解成地址），Box b = a 复制的只是这个地址，a 与 b 指向堆上同一个 Box 对象；所以 b.value = 2 改的就是那块内存，a.value 跟着变成 2。B 错在把引用赋值当成对象复制——Java 里对象只能由 new 创建，赋值不会再造一个；C 混淆了\"引用已有对象\"与\"未初始化\"；D 更是误解，字段不加 private 只是失去封装，与能否赋值无关。想判断两个引用是否指向同一对象用 ==，比较对象内容要用 equals。",
      "hint": "b = a 复制的是引用还是对象本身？"
    },
    {
      "id": "ch03-t1",
      "ch": "ch03",
      "kp": "ch03-3",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "字段用 <code>private</code> 修饰后，下列哪个范围内的代码可以直接访问它？",
      "options": [
        {
          "text": "只有声明该字段的那个类内部的代码",
          "correct": true
        },
        {
          "text": "同一个包内其他类的代码"
        },
        {
          "text": "该类的子类里的代码（即使子类在另一个包）"
        },
        {
          "text": "任何拿到该类对象引用的代码"
        }
      ],
      "explain": "四个访问级别从窄到宽是 private、默认（不写修饰符）、protected、public：private 表示\"仅本类可见\"，出了这个类就写不出名字；默认级别是同包可见；protected 在同包之外还额外允许子类；public 才到处可见。封装就是先把字段收窄到 private，再用 public 方法暴露受控的读写口，这样外部无法绕过校验直接改数据。选项 B 对应默认级别，C 对应 protected 级别，D 对应 public 级别，都比 private 宽。",
      "hint": "按\"private、默认、protected、public\"从窄到宽排一遍。"
    },
    {
      "id": "ch03-t2",
      "ch": "ch03",
      "kp": "ch03-2",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "trap",
        "exam"
      ],
      "stem": "判断：构造器可以写成 <code>public void Foo()</code>，这样它依然是构造器，<code>new Foo()</code> 时会被自动调用。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "构造器的判定标准只有两条：名字与类名完全相同，声明处不写任何返回值类型。一旦写上 void（哪怕方法体再像构造器），它在编译器眼里就是普通方法，new 时不会被调用；同时类里如果只剩这个\"伪构造器\"，编译器仍会补一个无参构造器，于是 new Foo() 走的是那个空的版本，字段根本没被赋值。这是\"给构造器写返回值类型\"最隐蔽的后果，编译也许能过，行为却完全错了。",
      "hint": "void 是返回值类型；构造器不允许有返回值类型。"
    },
    {
      "id": "ch03-t3",
      "ch": "ch03",
      "kp": "ch03-4",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "concept",
        "syntax"
      ],
      "stem": "要让同一个类的所有对象共享同一份数据（例如统计一共创建了多少个对象），该字段必须声明为 <code>____</code> 字段（填关键字）。",
      "answer": "static",
      "accept": [
        "静态",
        "静态字段",
        "static 字段",
        "Static",
        "STATIC"
      ],
      "explain": "不加 static 的字段是实例字段，每个对象各存一份，A 对象加 1 不会影响 B 对象；加上 static 后它变成类变量，整个类只有一份，所有对象（以及类名本身）看到的都是同一个值。所以计数器、常量这类\"全类共享\"的数据用 static，而每个对象各自的状态（坐标、姓名、余额）用实例字段。判断标准就是问一句：这个数据是每个对象各不相同，还是整个类共用一份。",
      "hint": "共享 = 类级 = 不属于某个具体对象。"
    },
    {
      "id": "ch03-t4",
      "ch": "ch03",
      "kp": "ch03-7",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "syntax",
        "exam"
      ],
      "stem": "下面哪一组方法构成合法的重载（overload）？",
      "options": [
        {
          "text": "<code>class A</code> 里的 <code>int f(int a)</code> 与 <code>class B</code> 里的 <code>int f(int a)</code>"
        },
        {
          "text": "<code>int f(int a)</code> 与 <code>int f(int a, int b)</code>",
          "correct": true
        },
        {
          "text": "<code>int f(int a)</code> 与 <code>double f(int a)</code>"
        },
        {
          "text": "<code>int f(int a)</code> 与 <code>int f(int b)</code>"
        }
      ],
      "explain": "重载要求同一个类里方法名相同、参数列表不同（个数、类型或顺序不同），与返回值类型无关。A 的参数个数不同，是合法重载；B 只有返回值类型不同，签名相同，编译器会报\"已在类中定义\"；C 的参数名不影响签名，仍然重复；D 是两个不同的类，各自的方法谈不上重载，也谈不上重写。记一句：重载看参数列表，重写看父子类且签名相同，返回值都不参与判定。",
      "hint": "签名 = 方法名 + 参数类型列表，返回值不算。"
    },
    {
      "id": "ch03-t5",
      "ch": "ch03",
      "kp": "ch03-5",
      "type": "tf",
      "difficulty": 1,
      "tags": [
        "trap",
        "exam"
      ],
      "stem": "判断：比较两个 <code>String</code> 对象的内容是否相同，应当使用 <code>equals()</code>，而不能用 <code>==</code>。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "== 比较的是两个引用是否指向同一个对象（地址），equals 才是\"内容是否一样\"。String 是对象，两个内容相同的字符串完全可能是两个不同对象（一个来自字面量、一个来自 new String(...) 或 Scanner 输入），这时 == 为 false 而 equals 为 true。所以比较字符串内容一律用 equals；== 只适合基本类型，或确实想判断\"是不是同一个对象\"。反过来，String 是不可变对象，equals 比较内容既安全又符合直觉。",
      "hint": "== 比地址，equals 比内容。"
    },
    {
      "id": "ch03-t6",
      "ch": "ch03",
      "kp": "ch03-2",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "trap",
        "exam"
      ],
      "stem": "类 <code>Foo</code> 只声明了一个带参数的构造器 <code>Foo(int n)</code>。此时写 <code>new Foo()</code> 会编译失败，因为编译器不再自动提供 ____ 构造器。",
      "answer": "无参",
      "accept": [
        "无参构造器",
        "默认构造器",
        "默认无参构造器",
        "无参的构造器",
        "默认"
      ],
      "explain": "编译器只在\"你一个构造器都没写\"的时候，才自动补一个空的无参构造器。一旦你写了任意构造器（哪怕只写了带参的），这个自动补充就取消，类里只剩你自己写的那几个。于是 new Foo() 找不到匹配的构造器，编译报\"无法将类 Foo 中的构造器应用到给定类型\"。想同时支持两种创建方式，就显式再写一个 Foo()，在里面给字段设好默认值。",
      "hint": "默认构造器只在\"一个构造器都没写\"时才存在。"
    },
    {
      "id": "ch03-t7",
      "ch": "ch03",
      "kp": "ch03-6",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "project",
        "concept"
      ],
      "stem": "Tutorial 5 把最简单的五子棋版本拆成 <code>GomokuGame</code> 类：构造器、<code>play()</code>、<code>move(x, y)</code>、<code>render()</code>。关于职责划分，下列说法正确的是？",
      "options": [
        {
          "text": "构造器里应该直接跑完整个游戏循环，play() 只负责打印最终结果"
        },
        {
          "text": "构造器负责初始化棋盘与 currentPlayer、gameOver 等状态；play() 负责循环读输入、调用 move() 并渲染，直到分出胜负",
          "correct": true
        },
        {
          "text": "落子、判胜、渲染的逻辑都应该写在 main() 里，GomokuGame 只用来存棋盘数据"
        },
        {
          "text": "render() 应该负责判断胜负并修改 gameOver，因为只有它知道棋盘长什么样"
        }
      ],
      "explain": "Tutorial 5 的分工是：构造器只做初始化（棋盘、当前玩家、gameOver、winner，必要时连输入用的 Scanner），play() 承担主循环——不断\"读输入 → move() → render()\"，直到 gameOver；move(x, y) 负责合法性检查、落子、判胜并切换玩家；render() 只负责把棋盘画/打印出来。把逻辑塞进 main 或构造器会让类无法复用，也让后面 JavaFX 版无处接入；render 只读状态、不改状态，才能既用于控制台又用于图形界面。",
      "hint": "构造器只初始化，主循环在 play()，render 只画不改状态。"
    },
    {
      "id": "ch03-t8",
      "ch": "ch03",
      "kp": "ch03-3",
      "type": "multi",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "下列哪些做法符合封装（encapsulation）的思想？（多选）",
      "options": [
        {
          "text": "把字段声明为 <code>private</code>，再提供 <code>public</code> 的 getter/setter",
          "correct": true
        },
        {
          "text": "在 setter 里检查参数，例如分数只接受 0 到 100",
          "correct": true
        },
        {
          "text": "把字段声明为 <code>public</code>，这样任何类都能直接读写，最方便"
        },
        {
          "text": "只提供 getter 不提供 setter，让字段创建后不能被随意修改",
          "correct": true
        }
      ],
      "explain": "封装的目的是\"把数据藏起来，只暴露受控的访问口\"：字段 private 挡住外部直接改，public 方法负责读写；setter 里加校验就能挡住非法值（负分、超过 100 分的成绩），这是封装最实际的收益；只给 getter 相当于做出不可变对象，外部无法绕过规则改字段。第三项恰恰放弃了封装——字段 public 之后任何代码都能把它改成非法值，类再也无法维护自己的不变量，出错时也无从定位是谁改坏的。",
      "hint": "封装 = 藏数据 + 受控入口 + 在入口处校验。"
    },
    {
      "id": "ch03-t9",
      "ch": "ch03",
      "kp": "ch03-2",
      "type": "order",
      "difficulty": 2,
      "tags": [
        "syntax",
        "concept"
      ],
      "stem": "类 <code>Point</code> 有两个构造器：<code>Point() { this(3, 4); }</code> 与 <code>Point(int x, int y) { this.x = x; this.y = y; }</code>。执行 <code>new Point()</code> 时，下列步骤的正确顺序是？",
      "options": [
        {
          "text": "执行两参构造器体，把 3、4 写入字段 x、y"
        },
        {
          "text": "无参构造器第一行的 <code>this(3, 4)</code> 把控制权交给两参构造器"
        },
        {
          "text": "两参构造器执行完毕，控制权返回无参构造器"
        },
        {
          "text": "无参构造器里 this(...) 之后的语句继续执行，对象创建完成"
        }
      ],
      "answer": [
        1,
        0,
        2,
        3
      ],
      "explain": "this(...) 是构造器之间的转调，必须写在构造器第一行：它把控制权完整地交给另一个构造器，等对方执行完再回到自己继续。所以顺序是\"进入无参 → 转调两参 → 两参赋值 → 返回无参 → 执行剩余语句\"。这也解释了为什么 this(...) 不能写在中间：对象还没被那个构造器初始化完，此时再转调会打乱初始化，编译器索性只允许写在第一行。",
      "hint": "this(3, 4) 像一次函数调用：先跳过去，执行完再回来。"
    },
    {
      "id": "ch03-t10",
      "ch": "ch03",
      "kp": "ch03-4",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "trap"
      ],
      "stem": "写出下面程序的输出（逐行）。",
      "code": "class Counter {\n    static int total = 0;\n    int own = 0;\n\n    void hit() {\n        own++;\n        total++;\n    }\n\n    static int getTotal() {\n        return total;\n    }\n}\n\npublic class Q {\n    public static void main(String[] args) {\n        Counter a = new Counter();\n        Counter b = new Counter();\n        a.hit();\n        a.hit();\n        b.hit();\n        System.out.println(a.own);\n        System.out.println(b.own);\n        System.out.println(Counter.getTotal());\n    }\n}",
      "answer": "2\n1\n3",
      "explain": "own 是实例字段，a 与 b 各有一份：a 调了两次 hit()，所以 a.own 是 2；b 只调了一次，所以 b.own 是 1。total 前面有 static，属于类而不属于对象，a.hit() 与 b.hit() 改的是同一份 total，三次自增后为 3。getTotal() 是静态方法，规范写法是用类名 Counter.getTotal() 调用；用对象调用虽然也能编译，但会让人误以为结果和具体对象有关。",
      "hint": "先分清哪些字段前面有 static。"
    },
    {
      "id": "ch03-t11",
      "ch": "ch03",
      "kp": "ch03-4",
      "type": "fill",
      "difficulty": 3,
      "tags": [
        "trap",
        "exam"
      ],
      "stem": "静态方法不属于任何对象，因此在静态方法内部不能使用指向\"当前对象\"的 <code>____</code> 关键字（写了会编译失败）。",
      "answer": "this",
      "accept": [
        "this 关键字",
        "this关键字",
        "This",
        "THIS"
      ],
      "explain": "this 的含义是\"当前这个对象\"，而静态方法是用类名调用的，调用时根本没有对象传进来，所以编译器拒绝在静态方法里使用 this；同理也不能直接读写实例字段、调用实例方法。要访问实例成员，必须把方法改成非静态，或者显式传入一个对象引用再用\"引用.字段\"。这条规则正是\"静态方法不能直接用实例字段\"背后的原因，两个现象是同一件事。",
      "hint": "静态方法没有接收者对象，那 this 该指向谁？"
    },
    {
      "id": "ch03-t12",
      "ch": "ch03",
      "kp": "ch03-1",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "关于字段（成员变量）与局部变量的默认值，下列说法正确的是？",
      "options": [
        {
          "text": "<code>String</code> 字段没赋值时是空字符串，不是 <code>null</code>"
        },
        {
          "text": "实例字段没显式赋值时，<code>int</code> 是 0、<code>boolean</code> 是 <code>false</code>、对象引用是 <code>null</code>；局部变量没有默认值，必须先赋值才能使用",
          "correct": true
        },
        {
          "text": "局部变量 <code>int</code> 没赋值时默认也是 0"
        },
        {
          "text": "字段必须显式初始化，否则编译错误"
        }
      ],
      "explain": "字段随对象一起分配，JVM 会把它们清零：数值 0、boolean 为 false、引用为 null，所以不写初始值也能直接用。局部变量（方法体、代码块里声明的变量）不在对象里，编译器不做清零，使用未赋值的局部变量会直接编译报\"可能尚未初始化\"。还有一条高频误解：String 字段的默认值是 null，不是空字符串，对它调方法才会抛 NullPointerException。",
      "hint": "字段有默认值，局部变量没有。"
    },
    {
      "id": "ch03-f1",
      "ch": "ch03",
      "kp": "ch03-4",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "bug",
        "trap"
      ],
      "stem": "下面的程序想统计\"所有对象一共被 increase 了多少次\"，期望两行都打印 2，但实际打印的是 1 和 1。找出错误并说明改法。",
      "code": "public class Counter {\n    private int total = 0;\n\n    public void increase() {\n        total++;\n    }\n\n    public int getTotal() {\n        return total;\n    }\n\n    public static void main(String[] args) {\n        Counter a = new Counter();\n        Counter b = new Counter();\n        a.increase();\n        b.increase();\n        System.out.println(a.getTotal());\n        System.out.println(b.getTotal());\n    }\n}",
      "accept": [
        {
          "hint": "指出 total 是实例字段，每个对象各有一份",
          "any": [
            "实例字段",
            "实例变量",
            "不是静态",
            "没有static",
            "不是static",
            "每个对象",
            "各有一份"
          ]
        },
        {
          "hint": "把 total 改成 static 类变量",
          "any": [
            "static",
            "静态",
            "类变量"
          ]
        }
      ],
      "minHits": 2,
      "answer": "字段 total 少了 static，应改成 private static int total = 0;",
      "explain": "计数器的语义是\"所有对象共用一个总数\"，所以它必须是类变量。写成实例字段后，a 与 b 各自持有一份 total：a.increase() 只加 a 的那份，b.increase() 只加 b 的那份，于是两个 getTotal() 都返回 1。加上 static 后 total 全类只有一份，两次自增累加到 2。判断标准：这个数据是\"每个对象各不相同\"还是\"整个类共享\"，前者用实例字段，后者用 static。",
      "hint": "两个对象打印出一样的 1，说明它们没有共享同一份数据。"
    },
    {
      "id": "ch03-c1",
      "ch": "ch03",
      "kp": "ch03-8",
      "type": "code",
      "difficulty": 2,
      "tags": [
        "code",
        "concept"
      ],
      "stem": "补全 <code>Student</code> 类：私有字段 <code>name</code>（String）与 <code>score</code>（int）；构造器 <code>Student(String name, int score)</code> 给两个字段赋值；<code>setScore(int)</code> 只接受 0 到 100（超出的值直接忽略，保持原分数）；<code>getScore()</code> 返回分数；再用 <code>static</code> 字段 <code>count</code> 统计创建了多少个学生，并提供 <code>static int getCount()</code>。main 里创建 Ann(90) 与 Bob(80)，把 Ann 的分数改成 150（应被拒绝），然后打印每个学生的姓名和分数，最后打印 <code>count=</code> 加总人数。",
      "starter": "public class Student {\n    // TODO: 字段、构造器、setScore、getScore、getName、static 计数\n\n    public static void main(String[] args) {\n        // TODO: 创建两个学生，试着把分数改成 150，打印结果\n    }\n}\n",
      "solution": "public class Student {\n    private String name;\n    private int score;\n    private static int count = 0;\n\n    public Student(String name, int score) {\n        this.name = name;\n        this.score = score;\n        count++;\n    }\n\n    public void setScore(int score) {\n        if (score >= 0 && score <= 100) {\n            this.score = score;\n        }\n    }\n\n    public int getScore() {\n        return score;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public static int getCount() {\n        return count;\n    }\n\n    public static void main(String[] args) {\n        Student a = new Student(\"Ann\", 90);\n        Student b = new Student(\"Bob\", 80);\n        a.setScore(150);\n        System.out.println(a.getName() + \" \" + a.getScore());\n        System.out.println(b.getName() + \" \" + b.getScore());\n        System.out.println(\"count=\" + Student.getCount());\n    }\n}",
      "tests": [
        {
          "stdin": "",
          "args": [],
          "expect": "Ann 90\nBob 80\ncount=2"
        }
      ],
      "explain": "三个考点串在一起：私有字段 + 构造器把参数写进字段（this.name = name 用来区分同名的参数与字段）；setScore 里先判断 0 到 100 再赋值，这就是封装——外部无法把分数改成非法值；count 用 static，因为它是\"所有 Student 共享的总数\"，每进一个构造器就自增一次，两个学生创建完正好是 2。注意 getName 这类 getter 不能少，否则 main 里读不到 private 字段。",
      "hint": "构造器里用 this.name 区分参数与字段；count 要在构造器里自增。"
    },
    {
      "id": "ch04-q1",
      "ch": "ch04",
      "kp": "ch04-1",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "关于 Java 的继承（inheritance），下列说法正确的是？",
      "options": [
        {
          "text": "子类必须重写父类的每一个方法，否则编译不通过"
        },
        {
          "text": "<code>class Dog extends Animal</code> 建立 IS-A 关系：Dog 是一种 Animal，并获得 Animal 的字段与方法（构造器除外）",
          "correct": true
        },
        {
          "text": "<code>extends</code> 建立的是 HAS-A 关系，表示\"有一个\""
        },
        {
          "text": "子类会把父类的构造器一起继承过来，直接用父类的构造器名 new 子类"
        }
      ],
      "explain": "继承用 extends 表达 IS-A（是一种）：Dog IS-A Animal，所以子类对象可以直接赋给父类引用，也自动拥有父类可继承的字段与方法。构造器不参与继承——构造器名必须与类名相同，子类只能通过 super(...) 调用父类构造器。HAS-A 是聚合，用字段引用另一个对象表示，与 extends 无关；子类也不必重写任何方法，不重写就沿用父类版本。",
      "hint": "IS-A 用 extends，HAS-A 用字段引用另一个对象。"
    },
    {
      "id": "ch04-q2",
      "ch": "ch04",
      "kp": "ch04-6",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "exam"
      ],
      "stem": "写出下面程序的输出（逐行）。",
      "code": "class Animal {\n    void speak() {\n        System.out.println(\"Animal\");\n    }\n}\n\nclass Dog extends Animal {\n    void speak() {\n        System.out.println(\"Woof\");\n    }\n}\n\nclass Cat extends Animal {\n    void speak() {\n        System.out.println(\"Meow\");\n    }\n}\n\npublic class Q {\n    public static void main(String[] args) {\n        Animal[] zoo = { new Dog(), new Cat(), new Animal() };\n        for (Animal a : zoo) {\n            a.speak();\n        }\n    }\n}",
      "answer": "Woof\nMeow\nAnimal",
      "explain": "数组元素类型是 Animal，但三个元素分别是 Dog、Cat、Animal 的对象。循环里 a.speak() 调用的是实例方法：编译期只检查 Animal 里有没有 speak()，真正执行哪个版本由对象的真实类型在运行时决定，这叫动态绑定（多态）。所以 Dog 对象执行 Dog 重写的版本，Cat 执行 Cat 的，Animal 执行自己的。如果某个子类没重写，就沿用父类版本；如果调的是子类特有、父类没有的方法，编译期就会报错。",
      "hint": "方法调用看对象真实类型，不看引用声明类型。"
    },
    {
      "id": "ch04-q3",
      "ch": "ch04",
      "kp": "ch04-6",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "trap",
        "exam"
      ],
      "stem": "当父类引用指向子类对象（<code>Animal a = new Dog();</code>）时，下列说法正确的是？",
      "options": [
        {
          "text": "<code>static</code> 方法也会被子类重写，并参与动态绑定"
        },
        {
          "text": "调用被重写的实例方法时执行子类版本（动态绑定）；访问字段时用的仍是引用的声明类型，字段没有多态",
          "correct": true
        },
        {
          "text": "方法和字段都取子类版本，因为对象是 Dog"
        },
        {
          "text": "方法和字段都取父类版本，因为引用类型写的是 Animal"
        }
      ],
      "explain": "Java 的多态只作用于实例方法：编译期按引用类型检查方法是否存在，运行期按对象真实类型选实现，这叫动态绑定。字段不是方法，没有动态绑定，a.name 取的是声明类型 Animal 里的那个字段；哪怕 Dog 也声明了同名字段，那也只是把父类字段藏起来，不叫重写。static 方法属于类，按引用类型在编译期就定死了，子类写同名同参的静态方法只是隐藏（hide），不是重写，也不参与多态。",
      "hint": "只有实例方法有多态；字段与 static 方法都按声明类型走。"
    },
    {
      "id": "ch04-t1",
      "ch": "ch04",
      "kp": "ch04-2",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "子类构造器的第一行既没有写 <code>super(...)</code>，也没有写 <code>this(...)</code> 时，会发生什么？",
      "options": [
        {
          "text": "编译器自动插入 <code>super()</code>；如果父类没有无参构造器，就编译错误",
          "correct": true
        },
        {
          "text": "父类那部分不会被初始化，直接执行子类构造器体"
        },
        {
          "text": "编译器会自动挑父类参数最多的构造器来调用"
        },
        {
          "text": "先执行完子类构造器体，结束时再回头调用父类构造器"
        }
      ],
      "explain": "Java 保证\"父类部分先于子类部分初始化\"，所以子类构造器必须先调用父类构造器：没写就用无参的 super() 顶上。于是父类一旦只定义了带参构造器（编译器不再补无参构造器），这个自动插入的 super() 就找不到目标，直接编译失败——这正是\"父类写了带参构造器后，子类必须显式 super(...)\"的原因。第二、四项违反初始化顺序；第三项是编译器的猜测，它只认无参 super()，不会替你挑参数。",
      "hint": "默认插入的是无参 super()，父类没有无参构造器就报错。"
    },
    {
      "id": "ch04-t2",
      "ch": "ch04",
      "kp": "ch04-4",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "trap",
        "exam"
      ],
      "stem": "判断：Java 允许一个类同时 <code>extends</code> 两个类，只要这两个父类没有同名方法。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "Java 不支持类的多继承，class C extends A, B 直接是语法错误，与父类有没有同名方法无关。语言层面禁止的原因是菱形歧义：如果 A 和 B 都有同名成员，C 的对象该用哪一份？要\"同时具备多种能力\"，Java 的答案是 implements 多个接口——接口只规定方法签名，实现由类自己给，不会产生歧义。Java 支持的三种继承是单继承、多级继承、层次继承。",
      "hint": "Java 用接口替代类的多继承。"
    },
    {
      "id": "ch04-t3",
      "ch": "ch04",
      "kp": "ch04-3",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "syntax",
        "exam"
      ],
      "stem": "在子类里重写父类方法时，在方法前加上 <code>____</code> 注解，可以让编译器检查这个方法确实重写了父类的方法（方法名或参数写错会立刻报错）。",
      "answer": "@Override",
      "accept": [
        "Override",
        "@override",
        "override",
        "Override 注解",
        "@OVERRIDE"
      ],
      "explain": "不加注解，方法签名写错时编译器不会提醒，你只是\"多写了一个新方法\"，多态也就悄悄失效了——这是最典型的隐性 bug。加上 @Override，编译器会核对父类（或接口）里是否存在可重写的方法，签名不一致就报错，等于把这类错误提前到编译期。注解本身不改变运行行为，它是一张\"我确定在重写\"的声明，让编译器替你检查。",
      "hint": "一个以 @ 开头的注解，名字就是\"重写\"。"
    },
    {
      "id": "ch04-t4",
      "ch": "ch04",
      "kp": "ch04-8",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "关于接口（interface）与抽象类（abstract class），下列说法正确的是？",
      "options": [
        {
          "text": "一个类只能继承一个类，但可以实现多个接口",
          "correct": true
        },
        {
          "text": "一个类最多只能实现一个接口"
        },
        {
          "text": "接口里的每个方法都必须在接口里写出方法体"
        },
        {
          "text": "抽象类不能被继承，只能被实例化"
        }
      ],
      "explain": "Java 的类继承是单继承，extends 后面只能跟一个父类；接口则是\"能力清单\"，一个类可以 implements A, B, C，从而绕开多继承的歧义——这也是 Java 不支持类多继承却仍能组合多种行为的原因。接口里声明的是抽象方法（只有签名、没有方法体），方法体由实现类给出；抽象类正好相反，它是\"不能 new 的类\"，必须被继承，子类实现完所有抽象方法后才能实例化。",
      "hint": "类单继承，接口可多实现；抽象类不能 new，只能被继承。"
    },
    {
      "id": "ch04-t5",
      "ch": "ch04",
      "kp": "ch04-5",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "判断：<code>class Car { private Engine engine; }</code> 中 Car 持有 Engine 的引用，这属于 HAS-A（聚合）关系。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "HAS-A 表示\"整体—部分\"：Car 里有一个 Engine 字段，说明 Car 拥有/使用一个 Engine，这就是聚合（aggregation），讲义里用它来实现代码复用。它与继承的 IS-A 完全不同：IS-A 是\"是一种\"，用 extends；HAS-A 是\"有一个\"，用字段引用。选错会让设计变形，例如把 Engine 写成 Car 的父类，语义就变成\"汽车是一种发动机\"，显然荒谬。",
      "hint": "字段引用另一个对象 = HAS-A；extends = IS-A。"
    },
    {
      "id": "ch04-t6",
      "ch": "ch04",
      "kp": "ch04-6",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "syntax",
        "exam"
      ],
      "stem": "在把父类引用向下转型成子类之前，通常先用 <code>____</code> 运算符判断这个对象到底是不是该子类的实例。",
      "answer": "instanceof",
      "accept": [
        "instance of",
        "instanceOf",
        "Instanceof"
      ],
      "explain": "instanceof 的左边是对象引用、右边是类型，返回 boolean：对象真实类型是该类或其子类时为 true。因为向下转型 Dog d = (Dog) a 在类型不匹配时会抛 ClassCastException，所以规范写法是先 if (a instanceof Dog) 再强转。它判断的是运行时对象的真实类型，因此对\"父类引用指向子类对象\"的情形同样有效，这一点恰好与多态配套使用。",
      "hint": "一个关键字，形如 a instanceof Dog。"
    },
    {
      "id": "ch04-t7",
      "ch": "ch04",
      "kp": "ch04-3",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "关于重载（overload）与重写（override），下列说法正确的是？",
      "options": [
        {
          "text": "重写发生在父子类之间，方法名与参数列表都必须相同；重载发生在同一个类里，参数列表必须不同",
          "correct": true
        },
        {
          "text": "重载发生在父子类之间，重写发生在同一个类里"
        },
        {
          "text": "重写只要求方法名相同，参数列表和返回值都可以随便改"
        },
        {
          "text": "重载要求返回值类型不同，否则不算重载"
        }
      ],
      "explain": "重写（override）是子类给出父类已有方法的新版本：名字、参数列表必须完全一致（返回值要兼容），再加 @Override 让编译器把关；重载（overload）是同一个类里同名但参数列表不同的多个方法，编译器按实参的类型和个数挑一个。第三项描述的其实是\"写错签名\"，那样只是一个新方法，多态不会生效；第四项说反了，返回值类型不参与重载判定，只改返回值反而会编译报错。",
      "hint": "重写：父子类 + 签名相同；重载：同类 + 参数不同。"
    },
    {
      "id": "ch04-t8",
      "ch": "ch04",
      "kp": "ch04-4",
      "type": "multi",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "下列关于 Java 继承类型的说法，哪些正确？（多选）",
      "options": [
        {
          "text": "单继承：一个类有一个直接父类，例如 <code>class Dog extends Animal</code>",
          "correct": true
        },
        {
          "text": "多级继承：<code>BabyDog extends Dog</code> 且 <code>Dog extends Animal</code>，BabyDog 间接也是 Animal",
          "correct": true
        },
        {
          "text": "层次继承：多个类继承同一个父类，例如 Dog 与 Cat 都 extends Animal",
          "correct": true
        },
        {
          "text": "一个类可以 extends 多个类，只要这几个父类之间没有继承关系"
        }
      ],
      "explain": "讲义把 Java 支持的继承分成三种：单继承（一个父类）、多级继承（继承链，BabyDog 依次得到 Dog 与 Animal 的可继承成员）、层次继承（一个父类被多个子类继承）。最后一项描述的是多继承，Java 明确不支持——哪怕父类之间毫无关系，class C extends A, B 也是语法错误；需要多种能力时用 implements 多个接口，这也是接口存在的意义之一。",
      "hint": "支持的只有单继承、多级、层次三种。"
    },
    {
      "id": "ch04-t9",
      "ch": "ch04",
      "kp": "ch04-2",
      "type": "order",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "有 <code>class A</code>、<code>class B extends A</code>、<code>class C extends B</code>，三个类的构造器都只打印自己的类名（A 打印 A，B 打印 B，C 打印 C），且 B、C 的构造器第一行都显式写了 <code>super()</code>。执行 <code>new C()</code> 时，下列事件的正确顺序是？",
      "options": [
        {
          "text": "A 的构造器体执行，打印 A"
        },
        {
          "text": "C 的构造器体执行，打印 C"
        },
        {
          "text": "B 的构造器体执行，打印 B"
        },
        {
          "text": "C 的构造器调用 <code>super()</code>，进入 B 的构造器"
        },
        {
          "text": "B 的构造器调用 <code>super()</code>，进入 A 的构造器"
        }
      ],
      "answer": [
        3,
        4,
        0,
        2,
        1
      ],
      "explain": "构造器的调用是\"从最顶层父类往下\"：new C() 先进入 C，C 第一行 super() 进 B，B 第一行 super() 进 A；A 的构造器体先执行（打印 A），返回 B 打印 B，返回 C 打印 C。所以输出顺序是 A、B、C。记住两条：super(...) 必须是构造器第一行；父类部分一定先于子类部分完成初始化。多级继承时这条链会一直往上追到 Object。",
      "hint": "沿着 super() 一路向上，再从上往下依次执行构造器体。"
    },
    {
      "id": "ch04-t10",
      "ch": "ch04",
      "kp": "ch04-7",
      "type": "predict",
      "difficulty": 3,
      "tags": [
        "output",
        "exam"
      ],
      "stem": "写出下面程序的输出（逐行）。",
      "code": "abstract class Shape {\n    protected String name;\n\n    Shape(String name) {\n        this.name = name;\n    }\n\n    abstract double area();\n\n    String info() {\n        return name + \" \" + area();\n    }\n}\n\nclass Rect extends Shape {\n    private double w;\n    private double h;\n\n    Rect(double w, double h) {\n        super(\"rect\");\n        this.w = w;\n        this.h = h;\n    }\n\n    double area() {\n        return w * h;\n    }\n}\n\nclass Square extends Rect {\n    Square(double s) {\n        super(s, s);\n    }\n\n    String info() {\n        return \"square \" + area();\n    }\n}\n\npublic class Q {\n    public static void main(String[] args) {\n        Shape[] shapes = { new Rect(2, 3), new Square(4) };\n        for (Shape s : shapes) {\n            System.out.println(s.info());\n        }\n    }\n}",
      "answer": "rect 6.0\nsquare 16.0",
      "explain": "Shape 是抽象类，不能 new，但可以声明引用；Rect 实现 area() 返回 2*3=6.0（double 运算结果带小数点），Square 继承 Rect 并重写 info()，area() 沿用 Rect 的 w*h，4*4=16.0。循环里 s.info() 按对象真实类型动态绑定：第一个对象是 Rect，用 Shape 的 info()，name 由 super(\"rect\") 设好，所以打印 rect 6.0；第二个是 Square，用 Square 重写的 info()，前缀变成 square。这题同时考了抽象方法必须被实现、super(...) 传参、多级继承与多态。",
      "hint": "注意 area() 返回 double，打印会带 .0；再看 info() 有没有被重写。"
    },
    {
      "id": "ch04-t11",
      "ch": "ch04",
      "kp": "ch04-2",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "syntax",
        "trap"
      ],
      "stem": "子类重写了父类的方法后，若还想调用父类那个被重写的版本，应写 <code>____.方法名()</code>。",
      "answer": "super",
      "accept": [
        "super 关键字",
        "super关键字",
        "Super"
      ],
      "explain": "super 在子类里代表\"父类那部分\"：super.方法名() 明确从父类开始找实现，跳过自己的重写版本；super(...) 则是调用父类构造器。它常用于\"在父类行为的基础上扩展\"，比如子类 describe() 想先拿到父类的描述再拼上自己的信息。注意 super 不是对象引用，不能赋给变量，也不能在静态方法里使用，因为静态方法没有当前对象。",
      "hint": "对应 this 的\"父类版本\"。"
    },
    {
      "id": "ch04-t12",
      "ch": "ch04",
      "kp": "ch04-3",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "trap",
        "exam"
      ],
      "stem": "父类 <code>Animal</code> 里有 <code>private String name;</code>，子类 <code>Dog</code> 的方法里直接写 <code>System.out.println(name);</code>，结果是什么？",
      "options": [
        {
          "text": "编译错误：name 是父类的私有字段，子类不能直接访问，应通过父类提供的 public 方法读取",
          "correct": true
        },
        {
          "text": "正常运行，打印父类里的 name"
        },
        {
          "text": "运行时抛 <code>NullPointerException</code>"
        },
        {
          "text": "打印 <code>null</code>，因为子类有自己的一份 name"
        }
      ],
      "explain": "private 的含义是\"仅声明它的那个类内部可见\"，子类虽然在内存里确实拥有父类那部分字段，但编译期无权直接写名字访问，所以编译报\"name 在 Animal 中是 private 访问控制\"。正确做法是父类提供 public（或 protected）的 getter。第二项忽略了访问控制；第三项混淆了\"不可见\"与\"空指针\"；第四项更不对，子类不会因为不能访问就自动多出一份同名字段。",
      "hint": "private 连子类都挡；在内存里存在不等于能在代码里访问。"
    },
    {
      "id": "ch04-f1",
      "ch": "ch04",
      "kp": "ch04-3",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "bug",
        "trap"
      ],
      "stem": "下面的程序期望 <code>a.speak()</code> 打印 <code>Woof</code>，实际却打印了 <code>...</code>。找出错误并说明改法。",
      "code": "class Animal {\n    void speak() {\n        System.out.println(\"...\");\n    }\n}\n\nclass Dog extends Animal {\n    void speak(String word) {\n        System.out.println(word);\n    }\n}\n\npublic class Q {\n    public static void main(String[] args) {\n        Animal a = new Dog();\n        a.speak();\n    }\n}",
      "accept": [
        {
          "hint": "指出 Dog.speak 带参数，只是重载不是重写",
          "any": [
            "重载",
            "overload",
            "参数列表不同",
            "参数不同",
            "多了参数",
            "签名不同"
          ]
        },
        {
          "hint": "改成无参的 speak()，并加 @Override",
          "any": [
            "去掉参数",
            "改成speak()",
            "无参",
            "speak()",
            "@override",
            "override"
          ]
        }
      ],
      "minHits": 2,
      "answer": "Dog 里的 speak(String word) 与父类 speak() 参数列表不同，只是重载、没有重写；应改成 void speak() 并加 @Override。",
      "explain": "重写要求方法名与参数列表完全一致。Dog 写的是 speak(String)，参数列表不同，编译器认为这是一个新方法（重载），父类的 speak() 原封不动地被继承下来；a 的声明类型是 Animal，动态绑定找到的仍是 Animal.speak()，所以打印 ...。把 Dog 的方法改成 void speak()，签名对上才是重写；再加上 @Override，以后签名写错编译器会直接报错，不会再有这种静默失败。",
      "hint": "对比两个 speak 的参数列表，它们一样吗？"
    },
    {
      "id": "ch04-c1",
      "ch": "ch04",
      "kp": "ch04-8",
      "type": "code",
      "difficulty": 2,
      "tags": [
        "code",
        "project"
      ],
      "stem": "定义接口 <code>Payable</code>（方法 <code>double pay()</code>），再写两个实现类：<code>HourlyWorker</code>（字段 name、hours、rate，pay 返回 hours*rate）与 <code>SalariedWorker</code>（字段 name、monthly，pay 返回 monthly），两者都提供 <code>getName()</code>。main 里用 <code>Payable[]</code> 存一个 <code>HourlyWorker(\"Ann\", 10, 20.0)</code> 和一个 <code>SalariedWorker(\"Bob\", 500.0)</code>，遍历数组，用 <code>instanceof</code> 判断类型后按 <code>hourly 200.0</code> / <code>salaried 500.0</code> 的格式打印。",
      "starter": "interface Payable {\n    double pay();\n}\n\nclass HourlyWorker implements Payable {\n    // TODO: 字段、构造器、pay()、getName()\n}\n\nclass SalariedWorker implements Payable {\n    // TODO: 字段、构造器、pay()、getName()\n}\n\npublic class Payroll {\n    public static void main(String[] args) {\n        // TODO: Payable[] staff = { ... }; 遍历并按格式打印\n    }\n}\n",
      "solution": "interface Payable {\n    double pay();\n}\n\nclass HourlyWorker implements Payable {\n    private String name;\n    private int hours;\n    private double rate;\n\n    HourlyWorker(String name, int hours, double rate) {\n        this.name = name;\n        this.hours = hours;\n        this.rate = rate;\n    }\n\n    public double pay() {\n        return hours * rate;\n    }\n\n    public String getName() {\n        return name;\n    }\n}\n\nclass SalariedWorker implements Payable {\n    private String name;\n    private double monthly;\n\n    SalariedWorker(String name, double monthly) {\n        this.name = name;\n        this.monthly = monthly;\n    }\n\n    public double pay() {\n        return monthly;\n    }\n\n    public String getName() {\n        return name;\n    }\n}\n\npublic class Payroll {\n    public static void main(String[] args) {\n        Payable[] staff = { new HourlyWorker(\"Ann\", 10, 20.0), new SalariedWorker(\"Bob\", 500.0) };\n        for (Payable p : staff) {\n            String kind = (p instanceof HourlyWorker) ? \"hourly\" : \"salaried\";\n            System.out.println(kind + \" \" + p.pay());\n        }\n    }\n}",
      "tests": [
        {
          "stdin": "",
          "args": [],
          "expect": "hourly 200.0\nsalaried 500.0"
        }
      ],
      "explain": "接口只规定\"能做什么\"（pay() 的签名），具体金额由每个实现类自己算，这就是用接口做多态：Payable[] 里可以放任何实现类的对象，循环里 p.pay() 由对象真实类型决定调哪个版本。instanceof 在这里只用来区分工种、决定打印前缀，不参与金额计算。注意 pay() 返回 double，输出是 200.0 而不是 200；实现接口的方法必须写 public，否则会被视为缩小了访问权限，编译不通过。",
      "hint": "每个实现类都要有自己的构造器给字段赋值；实现接口的方法必须 public。"
    },
    {
      "id": "ch05-q1",
      "ch": "ch05",
      "kp": "ch05-1",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "函数式接口（functional interface）指的是？",
      "options": [
        {
          "text": "恰好只有一个抽象方法的接口，因此可以用一个 lambda 表达式来实现它",
          "correct": true
        },
        {
          "text": "只包含静态方法的接口"
        },
        {
          "text": "包含两个以上抽象方法的接口"
        },
        {
          "text": "必须写上 <code>@FunctionalInterface</code> 才能通过编译的接口"
        }
      ],
      "explain": "函数式接口的判据只有一条：抽象方法恰好一个。满足这条，编译器就能用一个 lambda 表达式\"填\"这个唯一的方法——lambda 的参数对应方法的参数，箭头右边对应方法体。反过来，接口里有两个抽象方法时，lambda 不知道该实现哪一个，语法上就接不上。@FunctionalInterface 只是让编译器帮你自检\"这个接口确实只有一个抽象方法\"，不写也照样能用 lambda；第四项把它说成编译必需，是常见误解。",
      "hint": "数一数接口里抽象方法的个数。"
    },
    {
      "id": "ch05-q2",
      "ch": "ch05",
      "kp": "ch05-1",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "exam"
      ],
      "stem": "写出下面程序的输出（逐行）。",
      "code": "interface IntOp {\n    int apply(int a, int b);\n}\n\nclass Add implements IntOp {\n    public int apply(int a, int b) {\n        return a + b;\n    }\n}\n\nclass Mul implements IntOp {\n    public int apply(int a, int b) {\n        return a * b;\n    }\n}\n\npublic class Q {\n    static int calc(IntOp op, int a, int b) {\n        return op.apply(a, b);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(calc(new Add(), 3, 4));\n        System.out.println(calc(new Mul(), 3, 4));\n    }\n}",
      "answer": "7\n12",
      "explain": "IntOp 只有一个抽象方法 apply，所以它是函数式接口；Add 与 Mul 是两个普通实现类，各自给出 apply 的方法体。calc 的形参类型是 IntOp，传进去的是哪个实现类的对象，op.apply(...) 在运行时就走哪个版本——这是多态，也正是 lambda 想省掉的那层\"类名 + 方法名\"。把 Add 换成 lambda 写法，语义完全一样：都是给这个唯一的抽象方法提供实现。第一行 3+4=7，第二行 3*4=12。",
      "hint": "calc 收到的是哪个对象？apply 走谁的方法体？"
    },
    {
      "id": "ch05-q3",
      "ch": "ch05",
      "kp": "ch05-2",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "syntax",
        "trap"
      ],
      "stem": "下面用匿名内部类实现的 <code>IntOp add</code>，改写成 lambda 后正确的是哪一个？",
      "code": "IntOp add = new IntOp() {\n    public int apply(int a, int b) {\n        return a + b;\n    }\n};",
      "options": [
        {
          "text": "<code>IntOp add = (a, b) -> a + b;</code>",
          "correct": true
        },
        {
          "text": "<code>IntOp add = (a, b) -> { a + b };</code>"
        },
        {
          "text": "<code>IntOp add = (a, b) -> return a + b;</code>"
        },
        {
          "text": "<code>IntOp add = a, b -> a + b;</code>"
        }
      ],
      "explain": "匿名内部类里唯一被实现的方法是 apply(int a, int b)，所以 lambda 的参数列表照抄成 (a, b)，方法体就是 return a + b 这个表达式——表达式体可以把 return 和分号一起省掉，写成 (a, b) -> a + b。第二项用了花括号却没写 return（语句块体必须自己写 return，还要有分号），块里只剩一条没有返回值的表达式语句；第三项的 return 不能直接跟在箭头后面，只能出现在块体里；第四项两个参数却没加圆括号。",
      "hint": "表达式体可以省略 return 和分号；块体必须自己写 return。"
    },
    {
      "id": "ch05-t1",
      "ch": "ch05",
      "kp": "ch05-2",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "关于 lambda 表达式，下列说法正确的是？",
      "options": [
        {
          "text": "它必须写 <code>return</code> 关键字，否则编译错误"
        },
        {
          "text": "它是函数式接口实现的简写：编译器据此生成一个实现了该接口的对象",
          "correct": true
        },
        {
          "text": "它是一个没有名字的普通方法，可以直接用方法名调用"
        },
        {
          "text": "它是一种新的基本数据类型，可以像 int 一样参与运算"
        }
      ],
      "explain": "lambda 不是\"匿名方法\"，而是\"匿名实现\"：目标类型是一个函数式接口，编译器把它变成一个实现了该接口的对象，所以它能赋给接口变量、能当实参传给方法。它没有名字，不能像普通方法那样直接调用，只能通过接口变量调用唯一那个抽象方法。它也不是数据类型；箭头右边如果是单个表达式，可以省略 return 和分号，只有写成花括号的块体才必须写 return。",
      "hint": "lambda 最后变成了什么？一个对象还是一个方法？"
    },
    {
      "id": "ch05-t2",
      "ch": "ch05",
      "kp": "ch05-5",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "判断：一个接口只要恰好只有一个抽象方法，即使没有写 <code>@FunctionalInterface</code>，也仍然可以用 lambda 来实现它。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "@FunctionalInterface 是给编译器看的自检标签：它要求被标注的类型确实是函数式接口，否则报错，防止以后有人往里加第二个抽象方法、悄悄破坏已有的 lambda。决定能不能用 lambda 的是\"抽象方法恰好一个\"这个结构条件，不是注解；JDK 里大量函数式接口（例如 Runnable）都没有这个注解，照样能用 lambda 实现。反过来，加了注解却有两个抽象方法，才会编译失败。",
      "hint": "注解是自检，不是开关。"
    },
    {
      "id": "ch05-t3",
      "ch": "ch05",
      "kp": "ch05-1",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "只有一个抽象方法的接口称为 ____ 接口，可以直接用 lambda 表达式来实现。",
      "answer": "函数式",
      "accept": [
        "函数式接口",
        "函数接口",
        "functional interface"
      ],
      "explain": "这是 lambda 能成立的前提：接口里只有一个抽象方法，lambda 的参数就对应它的参数、箭头右边就对应它的方法体，不会产生\"到底实现哪个方法\"的歧义。讲义把 lambda 描述为\"函数式接口实现的语法糖\"——先有函数式接口这个类型，再有 lambda 这个简写。判断一个接口能不能接 lambda，数抽象方法的个数就够了。",
      "hint": "讲义里反复出现的术语，英文是 functional interface。"
    },
    {
      "id": "ch05-t4",
      "ch": "ch05",
      "kp": "ch05-3",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "syntax",
        "trap"
      ],
      "stem": "接口 <code>IntOp</code> 的方法签名是 <code>int apply(int a, int b)</code>。下列哪个 lambda 能正确实现它（返回 a+b）？",
      "options": [
        {
          "text": "<code>(a, b) -> { return a + b; }</code>",
          "correct": true
        },
        {
          "text": "<code>(a, b) -> { a + b; }</code>"
        },
        {
          "text": "<code>(int a, b) -> a + b</code>"
        },
        {
          "text": "<code>(a) -> a + b</code>"
        }
      ],
      "explain": "块体 lambda 的花括号里就是一段普通方法体，要返回值就必须写 return a + b;，第一项正确。第二项少了 return，a + b; 只是一条没有副作用的表达式语句，方法没有返回值，编译报\"缺少返回语句\"。第三项把类型写混了：参数要么全省略类型、要么全部写类型，(int a, b) 不合法。第四项只声明了一个参数，而 apply 需要两个，参数个数对不上。",
      "hint": "块体要 return；参数类型要么全写、要么全不写。"
    },
    {
      "id": "ch05-t5",
      "ch": "ch05",
      "kp": "ch05-1",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "trap",
        "exam"
      ],
      "stem": "判断：lambda 表达式可以赋值给任意接口类型的变量，只要接口里的方法参数个数和 lambda 对得上。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "目标类型必须是函数式接口，也就是抽象方法恰好一个。如果接口里有两个抽象方法，lambda 只能实现其中一个，编译器无法确定另一个由谁实现，于是直接报\"不是函数式接口\"。参数个数对得上只是必要条件之一，还要看参数类型、返回值类型是否兼容；抽象方法多于一个时，参数个数再吻合也没用。",
      "hint": "先数接口里抽象方法的个数。"
    },
    {
      "id": "ch05-t6",
      "ch": "ch05",
      "kp": "ch05-4",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "syntax",
        "exam"
      ],
      "stem": "把 lambda <code>x -> Math.abs(x)</code> 改写成方法引用，应写成 <code>____</code>（用\"类名::方法名\"的形式）。",
      "answer": "Math::abs",
      "accept": [
        "Math :: abs",
        "Math.abs",
        "Math::abs()"
      ],
      "explain": "方法引用是 lambda 的进一步简写：当 lambda 的方法体只是\"把参数原样传给某个已有方法\"时，可以直接写\"类名::方法名\"，让编译器替你补参数。x -> Math.abs(x) 正是这种情形，所以写成 Math::abs。Math.abs 是静态方法，用类名引用；如果是某个具体对象的实例方法，就写\"对象::方法名\"——区分的依据是双冒号左边写的是类还是对象。",
      "hint": "静态方法用类名加双冒号。"
    },
    {
      "id": "ch05-t7",
      "ch": "ch05",
      "kp": "ch05-4",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "syntax",
        "exam"
      ],
      "stem": "已有函数式接口 <code>interface StrOp { String run(String s); }</code>。下列哪个写法把 <code>String</code> 的实例方法 <code>toUpperCase()</code> 作为它的实现？",
      "options": [
        {
          "text": "<code>StrOp op = String::toUpperCase;</code>",
          "correct": true
        },
        {
          "text": "<code>StrOp op = String.toUpperCase;</code>"
        },
        {
          "text": "<code>StrOp op = String::toUpperCase();</code>"
        },
        {
          "text": "<code>StrOp op = s -> String.toUpperCase(s);</code>"
        }
      ],
      "explain": "方法引用用双冒号连接\"类型（或对象）\"与\"方法名\"，方法名后面不带括号——带括号就变成调用了，而这里要的是\"指向这个方法\"。所以第一项正确；第二项少了冒号，是普通的方法访问写法；第三项多了一对括号，把待引用的方法写成了调用；第四项试图用类名调用实例方法，实例方法必须通过对象调用，正确写法应是 s -> s.toUpperCase()。",
      "hint": "方法引用不带括号：类名::方法名。"
    },
    {
      "id": "ch05-t8",
      "ch": "ch05",
      "kp": "ch05-3",
      "type": "multi",
      "difficulty": 2,
      "tags": [
        "syntax",
        "exam"
      ],
      "stem": "下列哪些是合法的 lambda 表达式写法？（多选）",
      "options": [
        {
          "text": "<code>(int a, int b) -> a + b</code>",
          "correct": true
        },
        {
          "text": "<code>(a, b) -> a * b</code>",
          "correct": true
        },
        {
          "text": "<code>x -> { return x + 1; }</code>",
          "correct": true
        },
        {
          "text": "<code>a, b -> a + b</code>"
        },
        {
          "text": "<code>(a, b) -> return a + b;</code>"
        }
      ],
      "explain": "合法写法有两条硬规则：参数放在圆括号里（只有一个参数时可以省括号），参数类型要么全省略、要么全写——(int a, int b) 属于全写，合法。箭头右边如果是一个表达式，可以省略 return 和分号；如果写成花括号块体，就必须像普通方法体那样写 return ...;。所以第四项缺括号（两个及以上参数必须加括号），第五项把 return 直接跟在箭头后面——return 只能出现在块体里。",
      "hint": "多参数要括号；块体才需要 return。"
    },
    {
      "id": "ch05-t9",
      "ch": "ch05",
      "kp": "ch05-2",
      "type": "order",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "把\"从接口到 lambda\"的演进过程按出现顺序排列（最原始的在最前，最简洁的在最后）。",
      "options": [
        {
          "text": "改写成 lambda 表达式 <code>(a, b) -> a + b</code>，连类名和方法名都省掉"
        },
        {
          "text": "定义只有一个抽象方法的接口，例如 <code>interface IntOp { int apply(int a, int b); }</code>"
        },
        {
          "text": "写一个具名类 <code>class Add implements IntOp</code>，在类里实现 apply"
        },
        {
          "text": "改成匿名内部类 <code>new IntOp() { ... }</code>，不再单独定义类"
        }
      ],
      "answer": [
        1,
        2,
        3,
        0
      ],
      "explain": "这条路正好是讲义里 lambda 的推导顺序：先要有函数式接口（类型），才谈得上\"实现它\"；最直白的实现是写一个具名类，但为了一个方法就造一个类太啰嗦；匿名内部类省掉了类名，可方法签名还得完整写一遍；lambda 再把方法名、参数类型、return 一起省掉，只留下参数与表达式体。越往后越短，语义完全等价。",
      "hint": "先有接口类型，才谈得上实现；实现方式越来越短。"
    },
    {
      "id": "ch05-t10",
      "ch": "ch05",
      "kp": "ch05-3",
      "type": "predict",
      "difficulty": 3,
      "tags": [
        "output",
        "exam"
      ],
      "stem": "写出下面程序的输出（逐行）。",
      "code": "interface IntOp {\n    int apply(int a, int b);\n}\n\npublic class Q {\n    public static void main(String[] args) {\n        IntOp add = (a, b) -> a + b;\n        IntOp max = (a, b) -> { return a > b ? a : b; };\n        System.out.println(add.apply(3, 4));\n        System.out.println(max.apply(3, 4));\n    }\n}",
      "answer": "7\n4",
      "explain": "add 用表达式体，箭头右边就是返回值，等价于 return a + b;，所以 3+4=7。max 用语句块体，块里写了 return 加三元表达式，返回较大的那个，3 与 4 中较大的是 4。表达式体不能有分号、也不能写 return；块体则必须自己写 return——这是两种写法唯一需要小心的区别。两个 lambda 都赋给了 IntOp，而 IntOp 只有一个抽象方法 apply，符合函数式接口的要求。",
      "hint": "一行是表达式体，一行是带 return 的块体。"
    },
    {
      "id": "ch05-t11",
      "ch": "ch05",
      "kp": "ch05-6",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "trap",
        "exam"
      ],
      "stem": "lambda 内部引用的局部变量必须是 ____ 的（声明之后不再被重新赋值），否则编译报错。",
      "answer": "effectively final",
      "accept": [
        "final",
        "effectively-final",
        "effectivelyfinal",
        "有效的 final",
        "事实上的 final",
        "有效final",
        "Effectively final",
        "Effectively Final",
        "Final",
        "FINAL"
      ],
      "explain": "lambda（以及匿名内部类）捕获的是局部变量的值，不是变量本身，所以 Java 要求它\"看起来像 final\"：声明后不能再被赋值，这个性质叫 effectively final。写成 final int n = 5 当然可以；即使不写 final，只要之后没改过也满足要求。反过来，先 int n = 1 再 n = 2、然后 lambda 里用 n，就会报\"必须是最终变量或实际上的最终变量\"。要绕开就把值复制到一个新变量里。",
      "hint": "声明之后不再改 = effectively final。"
    },
    {
      "id": "ch05-t12",
      "ch": "ch05",
      "kp": "ch05-7",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "javafx",
        "exam"
      ],
      "stem": "在 JavaFX 里给按钮注册点击处理（<code>setOnAction</code> 接收一个 <code>EventHandler&lt;ActionEvent&gt;</code>，它只有一个抽象方法 <code>handle</code>），下列写法正确的是？",
      "options": [
        {
          "text": "<code>btn.setOnAction(e -> System.out.println(\"clicked\"));</code>",
          "correct": true
        },
        {
          "text": "<code>btn.setOnAction(System.out.println(\"clicked\"));</code>"
        },
        {
          "text": "<code>btn.setOnAction(e -> { System.out.println(\"clicked\") });</code>"
        },
        {
          "text": "<code>btn.setOnAction(e) -> System.out.println(\"clicked\");</code>"
        }
      ],
      "explain": "EventHandler 是函数式接口（只有一个 handle 方法），所以可以直接传 lambda：参数 e 就是事件对象，箭头右边是 handle 的方法体，表达式体不需要额外的分号。第二项把 println 的调用结果（void）当成 handler 传进去，类型对不上；第三项用了块体却漏了语句末尾的分号；第四项把箭头写在了 setOnAction 的括号外面，破坏了方法调用的括号结构。",
      "hint": "lambda 要整个放在 setOnAction( ... ) 的括号里。"
    },
    {
      "id": "ch05-f1",
      "ch": "ch05",
      "kp": "ch05-6",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "bug",
        "trap"
      ],
      "stem": "下面的程序想用 lambda 把参数乘以 factor，但编译失败。找出错误并说明改法。",
      "code": "interface Op {\n    int apply(int x);\n}\n\npublic class Q {\n    public static void main(String[] args) {\n        int factor = 2;\n        factor = 3;\n        Op times = x -> x * factor;\n        System.out.println(times.apply(5));\n    }\n}",
      "accept": [
        {
          "hint": "指出 factor 被重新赋值，不再是 effectively final",
          "any": [
            "重新赋值",
            "再次赋值",
            "二次赋值",
            "被修改",
            "effectively final",
            "最终变量",
            "不是final",
            "不是 final"
          ]
        },
        {
          "hint": "删掉重新赋值、声明 final，或复制到新变量",
          "any": [
            "去掉 factor = 3",
            "不要重新赋值",
            "声明为final",
            "加 final",
            "新变量",
            "复制"
          ]
        }
      ],
      "minHits": 2,
      "answer": "factor 被第二次赋值（factor = 3），不再是 effectively final，lambda 不能捕获它；删掉那次赋值或改成 final。",
      "explain": "lambda 捕获局部变量时拿到的是声明时的值，如果这个变量之后还能被改，lambda 看到的值就会和捕获时不一致，所以编译器直接禁止：从 lambda 引用的局部变量必须是 final 或 effectively final。这段代码先 int factor = 2 再 factor = 3，已经不满足；删掉那次赋值，或者写成 final int factor = 3，就能编译通过。成员字段不受这条限制，受约束的只有局部变量和方法参数。",
      "hint": "编译器抱怨的是哪个变量？它被赋值了几次？"
    },
    {
      "id": "ch05-c1",
      "ch": "ch05",
      "kp": "ch05-1",
      "type": "code",
      "difficulty": 2,
      "tags": [
        "code",
        "concept"
      ],
      "stem": "定义函数式接口 <code>Greeter</code>（方法 <code>String greet(String name)</code>），再写两个实现类：<code>EnglishGreeter</code> 返回 Hello 加姓名，<code>SpanishGreeter</code> 返回 Hola 加姓名。main 里把两个实现放进 <code>Greeter[]</code>，再用姓名数组 Ann、Bob 做双重循环，依次打印四个问候语。",
      "starter": "interface Greeter {\n    String greet(String name);\n}\n\nclass EnglishGreeter implements Greeter {\n    // TODO\n}\n\nclass SpanishGreeter implements Greeter {\n    // TODO\n}\n\npublic class Greet {\n    public static void main(String[] args) {\n        // TODO: Greeter[] + String[]，双重循环打印\n    }\n}\n",
      "solution": "interface Greeter {\n    String greet(String name);\n}\n\nclass EnglishGreeter implements Greeter {\n    public String greet(String name) {\n        return \"Hello \" + name;\n    }\n}\n\nclass SpanishGreeter implements Greeter {\n    public String greet(String name) {\n        return \"Hola \" + name;\n    }\n}\n\npublic class Greet {\n    public static void main(String[] args) {\n        Greeter[] gs = { new EnglishGreeter(), new SpanishGreeter() };\n        String[] names = { \"Ann\", \"Bob\" };\n        for (Greeter g : gs) {\n            for (String n : names) {\n                System.out.println(g.greet(n));\n            }\n        }\n    }\n}",
      "tests": [
        {
          "stdin": "",
          "args": [],
          "expect": "Hello Ann\nHello Bob\nHola Ann\nHola Bob"
        }
      ],
      "explain": "Greeter 只有一个抽象方法 greet，是标准的函数式接口，每个实现类只需给出一行方法体——这正是它能被 lambda 替代的原因（本章其他题里的写法）。main 里用 Greeter[] 存两个不同实现，循环里 g.greet(n) 由对象真实类型决定调英文还是西班牙语版本，这是接口带来的多态。注意实现接口的方法必须写 public，否则访问权限比接口声明的更窄，编译不通过；外层循环走过两个 Greeter，内层走过两个名字，所以正好四行。",
      "hint": "实现类里每个方法都要 public；外层两个 Greeter，内层两个名字。"
    },
    {
      "id": "ch06-q1",
      "ch": "ch06",
      "kp": "ch06-1",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "io",
        "concept"
      ],
      "stem": "下面四个类中，哪一个是<b>字节流</b>（byte stream）？",
      "options": [
        {
          "text": "<code>FileReader</code>"
        },
        {
          "text": "<code>FileInputStream</code>",
          "correct": true
        },
        {
          "text": "<code>BufferedReader</code>"
        },
        {
          "text": "<code>FileWriter</code>"
        }
      ],
      "explain": "Java I/O 的判据只看类名后缀：以 <code>InputStream</code> / <code>OutputStream</code> 结尾的是字节流，搬的是 8 位的 <code>byte</code>；以 <code>Reader</code> / <code>Writer</code> 结尾的是字符流，搬的是 16 位的 <code>char</code>，并且会按编码自动做字节与字符的转换。所以 <code>FileInputStream</code> 是字节流，<code>FileReader</code>、<code>BufferedReader</code>、<code>FileWriter</code> 都是字符流。记住：文件、数组、Socket 都能当流的来源或目的地，但\"字节还是字符\"由类的后缀决定，与来源无关。",
      "hint": "看后缀：Stream 还是 Reader/Writer。"
    },
    {
      "id": "ch06-q2",
      "ch": "ch06",
      "kp": "ch06-5",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "io",
        "output"
      ],
      "stem": "设 <code>a.txt</code> 中正好有三行，内容依次是 <code>Alice</code>、<code>Bob</code>、<code>Carol</code>。写出下面程序的输出（逐行）。",
      "code": "BufferedReader br = new BufferedReader(new FileReader(\"a.txt\"));\nString line;\nint count = 0;\nwhile ((line = br.readLine()) != null) {\n    count++;\n    System.out.println(count + \":\" + line);\n}\nbr.close();",
      "answer": "1:Alice\n2:Bob\n3:Carol",
      "explain": "<code>readLine()</code> 每次读取一整行，换行符会被吃掉、不会留在返回的字符串里，所以打印出来是 <code>1:Alice</code> 这样的形式，而不是每行多一个空行。第一行 <code>count</code> 先自增成 1 再拼接，因此从 1 开始。循环的条件 <code>!= null</code> 是关键：读完第三行后再读一次会返回 <code>null</code>，循环结束，所以只打印三行；如果写成 <code>!= \"\"</code>，永远不会相等，循环会带着 <code>null</code> 继续跑。",
      "hint": "先自增再拼接，以及 readLine 到末尾返回 null。"
    },
    {
      "id": "ch06-q3",
      "ch": "ch06",
      "kp": "ch06-4",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "io",
        "trap",
        "exam"
      ],
      "stem": "关于 <code>new BufferedReader(new FileReader(\"a.txt\"))</code> 这一行，下列说法正确的是？",
      "options": [
        {
          "text": "<code>FileReader</code> 负责打开文件并借助默认编码把字节解码成字符，<code>BufferedReader</code> 负责加缓冲区、提供 <code>readLine()</code>",
          "correct": true
        },
        {
          "text": "<code>BufferedReader</code> 负责把字节解码成字符，<code>FileReader</code> 只负责加缓冲区"
        },
        {
          "text": "这一行是多余的，直接 <code>new FileReader(\"a.txt\").readLine()</code> 也能按行读"
        },
        {
          "text": "外层的 <code>BufferedReader</code> 必须再包一个 <code>InputStreamReader</code> 才能读文本"
        }
      ],
      "explain": "包装链要<b>从里往外</b>读：最里层 <code>FileReader</code> 是字符流的源头，它打开文件、按默认编码把字节解码成 <code>char</code>；外层 <code>BufferedReader</code> 不碰编码，只加一块缓冲区、减少物理读写次数，并额外提供 <code>readLine()</code>。所以两项职责是分开的。第二个选项把两层职责对调；第三个错在 <code>FileReader</code> 只有 <code>read()</code>（一次一个字符），没有 <code>readLine()</code>；第四个错在方向——<code>InputStreamReader</code> 是把字节流桥成字符流用的，它该出现在 <code>FileInputStream</code>、<code>System.in</code> 外面，而不是包在已经是字符流的 <code>FileReader</code> 外面。",
      "hint": "先问：谁打开文件？谁提供缓冲区？"
    },
    {
      "id": "ch06-t1",
      "ch": "ch06",
      "kp": "ch06-2",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "io",
        "concept"
      ],
      "stem": "用 <code>FileInputStream</code> 读文件时，<code>read()</code> 返回 <code>-1</code> 表示什么？",
      "options": [
        {
          "text": "文件不存在或没有读权限"
        },
        {
          "text": "已经读到文件末尾（EOF），没有更多字节可读了",
          "correct": true
        },
        {
          "text": "读到了一个值为 <code>-1</code> 的字节"
        },
        {
          "text": "发生了 I/O 异常，文件损坏"
        }
      ],
      "explain": "<code>read()</code> 的返回值类型是 <code>int</code>：正常情况下返回读到的那个字节（0–255），以便和\"出错\"区分开；<code>-1</code> 是专门留给文件末尾（EOF）的哨兵值，所以判循环结束要写 <code>while ((b = in.read()) != -1)</code>。因为一个字节只有 8 位、最大值 255，永远不可能是 -1，这个约定才成立。I/O 出错时抛的是 <code>IOException</code>；文件打不开时抛 <code>FileNotFoundException</code>，都不是靠返回值告诉你。",
      "hint": "字节的取值范围是 0–255，那 -1 只能表示什么？"
    },
    {
      "id": "ch06-t2",
      "ch": "ch06",
      "kp": "ch06-6",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "io",
        "trap"
      ],
      "stem": "用 <code>BufferedWriter</code> 写文件时，<code>write()</code> 之后常常还要调用 <code>flush()</code>。原因是？",
      "options": [
        {
          "text": "<code>write()</code> 只是把字符放进内存缓冲区，<code>flush()</code> 才把它们推给底层的 <code>FileWriter</code>",
          "correct": true
        },
        {
          "text": "<code>write()</code> 一次只能写一个字符，<code>flush()</code> 才负责写字符串"
        },
        {
          "text": "<code>flush()</code> 会清空文件原有的内容，方便从头重新写"
        },
        {
          "text": "<code>flush()</code> 在把缓冲区写出去的同时会把流关闭"
        }
      ],
      "explain": "<code>BufferedWriter</code> 的核心就是\"先攒着\"：<code>write()</code> 只把字符放进内存里的缓冲区，攒满一块或有人调用 <code>flush()</code> 时才真正交给底层 <code>FileWriter</code>（再由操作系统写盘）。这样很多次小的写操作被合并成少数几次物理写，效率才高。第二个选项错在读写接口：<code>write(String)</code>、<code>write(char[])</code> 都是它有的，\"一次一个字符\"是底层 <code>Writer</code> 的 <code>write(int)</code>。第三个错在 <code>flush()</code> 既不清空文件也不改变写位置，它只负责\"把内存里的东西推出去\"。第四个错在 <code>flush()</code> 不关闭流，关闭是 <code>close()</code> 的事（<code>close()</code> 内部会先 flush 一次）。",
      "hint": "write 之后数据在哪一层？"
    },
    {
      "id": "ch06-t3",
      "ch": "ch06",
      "kp": "ch06-7",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "io",
        "trap",
        "exam"
      ],
      "stem": "先用 <code>DataOutputStream</code> 的 <code>writeInt(2024)</code> 把整数写进文件，之后要把它正确读回来，应该用哪个方法？",
      "options": [
        {
          "text": "<code>DataInputStream</code> 的 <code>readInt()</code>",
          "correct": true
        },
        {
          "text": "<code>BufferedReader</code> 的 <code>readLine()</code>，再 <code>Integer.parseInt()</code>"
        },
        {
          "text": "<code>FileInputStream</code> 的 <code>read()</code>，一次读回整个 int"
        },
        {
          "text": "<code>DataInputStream</code> 的 <code>readUTF()</code>"
        }
      ],
      "explain": "<code>writeInt()</code> 把一个 int 拆成固定的 4 个字节按二进制写出，文件里根本没有 \"2024\" 这四个字符，所以只能用同样按 4 字节解析的 <code>readInt()</code> 配对读回——写什么类型就用读什么类型的方法，这是数据流最重要的规矩。第二个选项错在 <code>readLine()</code> 是字符流按行读，它会把那 4 个二进制字节当成字符解码，得到乱码，再 <code>parseInt</code> 只会抛异常。第三个错在 <code>read()</code> 一次只给 1 个字节，要凑 4 次还得自己拼。第四个错在 <code>readUTF()</code> 只能配 <code>writeUTF()</code> 写的字符串。",
      "hint": "writeInt 写了几个字节？谁来按同样格式解析？"
    },
    {
      "id": "ch06-t4",
      "ch": "ch06",
      "kp": "ch06-3",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "io",
        "syntax"
      ],
      "stem": "要按行读取一个纯文本文件，下列做法正确的是？",
      "options": [
        {
          "text": "<code>new BufferedReader(new FileReader(\"a.txt\"))</code>，再循环调用 <code>readLine()</code>",
          "correct": true
        },
        {
          "text": "<code>new FileReader(\"a.txt\")</code>，再循环调用 <code>readLine()</code>"
        },
        {
          "text": "<code>new BufferedReader(new FileInputStream(\"a.txt\"))</code>，再循环调用 <code>readLine()</code>"
        },
        {
          "text": "<code>new FileInputStream(\"a.txt\")</code>，再循环调用 <code>readLine()</code>"
        }
      ],
      "explain": "<code>readLine()</code> 只属于 <code>BufferedReader</code>，它是\"缓冲 + 按行\"这个能力的提供者，所以必须真的 new 出一个 <code>BufferedReader</code>。第二、四个选项都直接拿文件流调 <code>readLine()</code>，编译就过不了：<code>FileReader</code> 只有读单个字符的 <code>read()</code>，字节流更是压根没有 <code>readLine</code>。第三个选项看起来最像，错在 <code>BufferedReader</code> 的构造器只接受 <code>Reader</code>，塞 <code>InputStream</code> 类型不匹配；要处理字节来源（比如 <code>System.in</code>、<code>socket.getInputStream()</code>），中间必须加一层 <code>InputStreamReader</code> 做字节到字符的桥接。",
      "hint": "readLine 是谁的方法？构造器又接受什么类型？"
    },
    {
      "id": "ch06-t5",
      "ch": "ch06",
      "kp": "ch06-8",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "io",
        "trap",
        "exam"
      ],
      "stem": "判断：<code>System.in</code> 是字节流，若想按行读取键盘输入，需要先用 <code>InputStreamReader</code> 把它桥接成字符流，再套上 <code>BufferedReader</code>。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "这句话正是讲义里 InputStreamReader 的用途：bridge the gap between character streams and byte streams。<code>System.in</code> 的类型是 <code>InputStream</code>，只能一个字节一个字节地读；<code>InputStreamReader</code> 按默认编码把字节解码成字符；最后 <code>BufferedReader</code> 加缓冲并提供 <code>readLine()</code>。所以标准写法是 <code>new BufferedReader(new InputStreamReader(System.in))</code>。少了桥接这一层，<code>BufferedReader</code> 的构造器直接编译不过；只桥接不缓冲，就没有 <code>readLine()</code> 可用。",
      "hint": "System.in 的静态类型是什么？谁负责字节→字符？"
    },
    {
      "id": "ch06-t6",
      "ch": "ch06",
      "kp": "ch06-4",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "io",
        "trap"
      ],
      "stem": "判断：包装流可以任意嵌套，所以 <code>new FileReader(new BufferedReader(new FileReader(\"a.txt\")))</code> 这种写法也是合法的。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "包装不是\"随便套\"，每一层的构造器都限定了它能接受的内层类型，方向只能从数据源往外：<code>FileReader</code> 的构造器要的是 <code>File</code> 或文件路径字符串，不接受一个 <code>Reader</code>，所以把 <code>BufferedReader</code> 塞进去是编译错误。正确的链条是 <code>FileReader</code>（字符源）→ <code>BufferedReader</code>（缓冲）。同一个文件也不需要开两个 <code>FileReader</code>；就算能编译，两层读同一文件也会互相抢位置、数据错乱。",
      "hint": "FileReader 的构造器能收 Reader 吗？"
    },
    {
      "id": "ch06-t7",
      "ch": "ch06",
      "kp": "ch06-5",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "io",
        "syntax"
      ],
      "stem": "用 <code>BufferedReader</code> 逐行读文件时，判断\"已经读到文件末尾\"的依据是 <code>readLine()</code> 返回 ____。",
      "answer": [
        "null"
      ],
      "accept": [
        "null值",
        "返回null",
        "null 值"
      ],
      "explain": "<code>readLine()</code> 读到文件末尾时返回 <code>null</code>，不是空字符串 <code>\"\"</code>，也不是 -1（-1 是字节流 <code>read()</code> 的 EOF 标记，字符流的 <code>read()</code> 才是返回 -1）。这两者必须分清：文件里如果真有一行空行，<code>readLine()</code> 返回的是长度为 0 的字符串，它不等于 <code>null</code>，仍然是有效的一行。所以标准写法是 <code>while ((line = br.readLine()) != null)</code>；写成 <code>!= \"\"</code> 会永远成立，循环在 EOF 之后还继续，把 <code>null</code> 拼进字符串或直接抛 <code>NullPointerException</code>。",
      "hint": "字节流 EOF 返回 -1，字符流的按行读返回什么？"
    },
    {
      "id": "ch06-t8",
      "ch": "ch06",
      "kp": "ch06-8",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "io",
        "syntax"
      ],
      "stem": "补全把键盘输入桥接成字符流的代码：<code>BufferedReader br = new BufferedReader(new ____(System.in));</code>",
      "answer": [
        "InputStreamReader"
      ],
      "accept": [
        "InputStreamReader()",
        "inputstreamreader"
      ],
      "explain": "括号里要填的是那个\"桥\"：<code>InputStreamReader</code>。参数 <code>System.in</code> 是字节流，<code>BufferedReader</code> 的构造器却只收 <code>Reader</code>，两者的类型对不上，<code>InputStreamReader</code> 正好一头接 <code>InputStream</code>、自己是 <code>Reader</code>，把字节按默认编码解码成字符。整条包装链从里到外是：<code>System.in</code>（字节来源）→ <code>InputStreamReader</code>（解码成字符）→ <code>BufferedReader</code>（缓冲、提供 <code>readLine()</code>）。漏掉中间这层，编译就通不过。",
      "hint": "讲义里说它 bridge 了 byte stream 和 character stream。"
    },
    {
      "id": "ch06-t9",
      "ch": "ch06",
      "kp": "ch06-7",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "io",
        "syntax"
      ],
      "stem": "用 <code>DataOutputStream</code> 把一个 int 写进文件，应调用它的 ____ 方法；读回时用 <code>DataInputStream</code> 的 <code>readInt()</code>。",
      "answer": [
        "writeInt"
      ],
      "accept": [
        "writeInt()",
        "writeint"
      ],
      "explain": "<code>DataOutputStream</code> 是\"过滤流\"（filter stream），它把基本类型拆成固定长度的字节再交给底层输出流，所以每种类型都有一个对应方法：<code>writeInt</code> 写 4 字节、<code>writeDouble</code> 写 8 字节、<code>writeUTF</code> 按 UTF-8 写字符串。名字必须与读取端成对：写 <code>writeInt</code> 就用 <code>readInt</code> 读，写 <code>writeUTF</code> 就用 <code>readUTF</code> 读，写读不对称会读到错位的数据。另外这类带缓冲的输出流别忘了 <code>flush()</code> 或 <code>close()</code>，否则内容可能还在内存里。",
      "hint": "与 readInt 对称的写方法叫什么？"
    },
    {
      "id": "ch06-t10",
      "ch": "ch06",
      "kp": "ch06-1",
      "type": "multi",
      "difficulty": 2,
      "tags": [
        "io",
        "concept"
      ],
      "stem": "下列关于 Java I/O 的说法，哪些是正确的？（多选）",
      "options": [
        {
          "text": "<code>DataInputStream</code> 与 <code>DataOutputStream</code> 属于过滤流（filter stream），可以直接读写字符串和基本类型",
          "correct": true
        },
        {
          "text": "字符流可以包装在字节流外面，例如 <code>new BufferedReader(new InputStreamReader(System.in))</code>",
          "correct": true
        },
        {
          "text": "只有字符流才需要 <code>flush()</code>，字节流写出去的数据一定立刻落盘"
        },
        {
          "text": "<code>BufferedWriter</code> 比直接用 <code>FileWriter</code> 快，是因为它减少了实际的物理读写次数",
          "correct": true
        }
      ],
      "explain": "第一个说法对应讲义的 Stream Wrappers：这两类是 filtered streams，能一次读写一个 String 或基本类型，而不只是一个字节。第二个对应包装方向：<code>InputStreamReader</code> 可以把任何字节来源（文件、<code>System.in</code>、Socket 的输入流）桥成字符流，所以字符流能套在字节流外面。第四个对应缓冲的意义：攒够一块再写，把很多次小的物理写合并成少数几次。第三个错在\"只有字符流才需要 flush\"：<code>flush()</code> 是 <code>OutputStream</code> 就有的方法，凡是有缓冲的输出流都要 flush，字节流的 <code>BufferedOutputStream</code> 同样如此；而\"立刻落盘\"更是没有保证，是否真正写盘还取决于操作系统。",
      "hint": "flush 是 OutputStream 的通用方法，不分字节字符。"
    },
    {
      "id": "ch06-t11",
      "ch": "ch06",
      "kp": "ch06-6",
      "type": "order",
      "difficulty": 2,
      "tags": [
        "io",
        "syntax"
      ],
      "stem": "把\"用缓冲字符流把两段文本写进 a.txt，并确保数据真正写到文件里\"的语句按正确执行顺序排列。",
      "options": [
        {
          "text": "<code>bw.flush();</code>"
        },
        {
          "text": "<code>BufferedWriter bw = new BufferedWriter(new FileWriter(\"a.txt\"));</code>"
        },
        {
          "text": "<code>bw.close();</code>"
        },
        {
          "text": "<code>bw.write(\"hello\");</code>"
        },
        {
          "text": "<code>bw.write(\" world\");</code>"
        }
      ],
      "answer": [
        1,
        3,
        4,
        0,
        2
      ],
      "explain": "必须先有流对象才能写，所以创建 <code>BufferedWriter</code> 是第一步；然后按你要的顺序调用 <code>write()</code> 把字符交给缓冲区；接着 <code>flush()</code> 把缓冲区里的内容真正推给底层 <code>FileWriter</code>；最后 <code>close()</code> 再刷一次并释放文件句柄。顺序颠倒的典型后果：先 <code>close()</code> 再 <code>write()</code> 会抛 <code>IOException</code>（流已关闭）；只 <code>write</code> 不 <code>flush</code>/<code>close</code>，文件就是空的。实际写代码时 <code>close()</code> 内部会先 flush，所以单独一次 <code>close()</code> 也能保证落盘，但把两步都写出来更能说明\"数据什么时候离开内存\"。",
      "hint": "先有对象，再写，再推出去，最后释放。"
    },
    {
      "id": "ch06-t12",
      "ch": "ch06",
      "kp": "ch06-7",
      "type": "predict",
      "difficulty": 3,
      "tags": [
        "io",
        "output"
      ],
      "stem": "<code>n.dat</code> 事先不存在。写出下面程序运行后的输出。",
      "code": "DataOutputStream out = new DataOutputStream(new FileOutputStream(\"n.dat\"));\nout.writeInt(7);\nout.writeInt(9);\nout.close();\nDataInputStream in = new DataInputStream(new FileInputStream(\"n.dat\"));\nint a = in.readInt();\nint b = in.readInt();\nin.close();\nSystem.out.println(a + b);",
      "answer": "16",
      "explain": "两个关键点。第一，写出和读入必须对称：<code>writeInt</code> 按固定 4 字节写二进制，<code>readInt</code> 就按同样长度和顺序解析，所以先写的 7 被第一个 <code>readInt</code> 读进 <code>a</code>，后写的 9 进 <code>b</code>。第二，<code>close()</code> 把数据真正刷到文件，后面再打开读才不会读到空文件。最后 <code>a + b</code> 是两个 int 相加，结果是 16；如果写成 <code>\"\" + a + b</code> 才会得到字符串 \"79\"。注意这不是把文本 \"7\"、\"9\" 写进文件，文件里是 8 个二进制字节。",
      "hint": "writeInt 写的是二进制还是文本？两个 int 相加等于几？"
    },
    {
      "id": "ch06-f1",
      "ch": "ch06",
      "kp": "ch06-6",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "io",
        "bug",
        "trap"
      ],
      "stem": "下面的程序想把 <code>hello</code> 写进 out.txt，但运行结束后 out.txt 里什么都没有。找出错误并说明改法。",
      "code": "import java.io.*;\n\npublic class Save {\n    public static void main(String[] args) throws IOException {\n        BufferedWriter bw = new BufferedWriter(new FileWriter(\"out.txt\"));\n        bw.write(\"hello\");\n    }\n}",
      "accept": [
        {
          "hint": "指出写完没有 flush() 或 close()",
          "any": [
            "flush",
            "close",
            "没有关闭",
            "未关闭",
            "没关"
          ]
        },
        {
          "hint": "说明数据还留在缓冲区里，没交给文件",
          "any": [
            "缓冲区",
            "buffer",
            "缓存",
            "内存里"
          ]
        }
      ],
      "minHits": 2,
      "answer": "bw.write(\"hello\") 之后缺少 bw.flush() 或 bw.close()，字符还留在 BufferedWriter 的缓冲区里没有写到文件",
      "explain": "<code>BufferedWriter</code> 的作用是攒：<code>write(\"hello\")</code> 只是把这 5 个字符放进内存缓冲区，还停在 Java 进程里；只有 <code>flush()</code>（或 <code>close()</code> 内部的 flush）才把它们交给底层的 <code>FileWriter</code>，再由操作系统写进 out.txt。程序直接结束、流对象既没 flush 也没 close，缓冲区随对象被丢弃，文件自然是空的。改法：<code>bw.write(\"hello\"); bw.flush(); bw.close();</code>。这个 bug 在聊天室项目里最致命——消息发出去了却永远送不到对端。",
      "hint": "缓冲区里的字符什么时候才会真正写出去？"
    },
    {
      "id": "ch07-q1",
      "ch": "ch07",
      "kp": "ch07-1",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "socket",
        "concept"
      ],
      "stem": "客户端要用 <code>Socket</code> 连接服务器时，必须知道的两项信息是？",
      "options": [
        {
          "text": "服务器的主机名和它运行的操作系统名称"
        },
        {
          "text": "服务器的 IP 地址（或主机名）和端口号",
          "correct": true
        },
        {
          "text": "服务器的 IP 地址和 MAC 地址"
        },
        {
          "text": "服务器的端口号和它硬盘上的文件路径"
        }
      ],
      "explain": "讲义把这两件事说得最清楚：the client must know the IP Address of the server and port number。IP 负责在网络上找到<b>哪台机器</b>，端口负责在这台机器上找到<b>哪个程序</b>——同一台机器可以同时跑很多网络程序，靠端口号区分。MAC 地址由链路层处理，应用程序完全不用管；文件路径和操作系统名称与建立连接无关。所以 <code>new Socket(\"localhost\", 1004)</code> 的两个参数正好对应这两项：主机 + 端口。",
      "hint": "先定位机器，再定位机器上的程序。"
    },
    {
      "id": "ch07-q2",
      "ch": "ch07",
      "kp": "ch07-5",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "socket",
        "output"
      ],
      "stem": "服务器端代码如下。某客户端连上后先发送一行 <code>ping</code> 并 flush，然后不再发送。写出服务器控制台的输出。",
      "code": "ServerSocket ss = new ServerSocket(7000);\nSocket s = ss.accept();\nBufferedReader in = new BufferedReader(new InputStreamReader(s.getInputStream()));\nSystem.out.println(\"server:\" + in.readLine());",
      "answer": "server:ping",
      "explain": "<code>accept()</code> 阻塞到有客户端连上才返回一个已连接的 <code>Socket</code>；接着 <code>getInputStream()</code> 拿到的是字节流，必须先用 <code>InputStreamReader</code> 桥成字符流，<code>BufferedReader</code> 才能提供 <code>readLine()</code>。客户端发来的 <code>ping</code> 后面跟着换行，<code>readLine()</code> 读到换行就返回，并且会把换行符去掉，所以拼出来正好是 <code>server:ping</code>，后面不会多一个空行。注意客户端写完要 flush，否则数据还在缓冲区里，服务器会一直阻塞在 <code>readLine()</code>。",
      "hint": "readLine 会吃掉换行符；拼接的字符串没有空格。"
    },
    {
      "id": "ch07-q3",
      "ch": "ch07",
      "kp": "ch07-4",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "socket",
        "trap",
        "exam"
      ],
      "stem": "服务器端先写 <code>Socket socket = null;</code>，紧接着写 <code>new InputStreamReader(socket.getInputStream())</code>，最后才写 <code>socket = serverSocket.accept();</code>。运行时会怎样？",
      "options": [
        {
          "text": "抛 <code>NullPointerException</code>：<code>socket</code> 还是 <code>null</code> 就被拿去调用 <code>getInputStream()</code>",
          "correct": true
        },
        {
          "text": "程序正常阻塞在 <code>accept()</code>，等客户端连上之后一切正常"
        },
        {
          "text": "编译错误，因为 <code>null</code> 不能赋给 <code>Socket</code> 类型的变量"
        },
        {
          "text": "<code>accept()</code> 在没有客户端时返回 <code>null</code>，所以加个 null 判断就能修好"
        }
      ],
      "explain": "这段代码能编译通过——<code>null</code> 可以赋给任何引用类型；错在<b>执行顺序</b>。语句按顺序执行，走到 <code>socket.getInputStream()</code> 时 <code>socket</code> 仍然是 <code>null</code>，在 null 引用上调用方法立即抛 <code>NullPointerException</code>，所以第三行 <code>accept()</code> 根本轮不到执行，连客户端连没连上都无关。正确顺序是：<code>new ServerSocket(端口)</code> → <code>accept()</code> 阻塞拿到已连接的 <code>Socket</code> → 再 <code>getInputStream()</code> → 再包装成 <code>InputStreamReader</code> / <code>BufferedReader</code>。第四个选项还额外错在 API 行为：<code>accept()</code> 会阻塞等待，不会返回 <code>null</code>。",
      "hint": "语句从上往下执行，走到第二句时 socket 是什么值？"
    },
    {
      "id": "ch07-t1",
      "ch": "ch07",
      "kp": "ch07-2",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "socket",
        "concept"
      ],
      "stem": "<code>ServerSocket</code> 的 <code>accept()</code> 方法的作用是？",
      "options": [
        {
          "text": "关闭服务器套接字并释放占用的端口"
        },
        {
          "text": "阻塞等待客户端连接，连接成功后返回一个用于通信的 <code>Socket</code>",
          "correct": true
        },
        {
          "text": "立即返回一个新的 <code>ServerSocket</code>，供更多客户端使用"
        },
        {
          "text": "向刚连上的客户端发送一条欢迎消息"
        }
      ],
      "explain": "讲义原话：Its accept() method blocks the console until the client is connected；如果客户端用给定端口连上来，它就 returns an instance of Socket。也就是说 <code>accept()</code> 只负责\"接客\"，不负责收发数据：它返回的这个 <code>Socket</code> 才是之后 <code>getInputStream()</code> / <code>getOutputStream()</code> 的来源。返回类型是 <code>Socket</code> 而不是 <code>ServerSocket</code>；关闭用的是 <code>close()</code>；发消息要靠输出流自己写。",
      "hint": "accept 返回的是哪一种套接字？"
    },
    {
      "id": "ch07-t2",
      "ch": "ch07",
      "kp": "ch07-6",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "socket",
        "trap"
      ],
      "stem": "服务器只写了一句 <code>Socket socket = serverSocket.accept();</code>，没有放进循环里。第二个客户端尝试连接时会发生什么？",
      "options": [
        {
          "text": "服务器会为第二个客户端自动创建新线程"
        },
        {
          "text": "连不上，会一直等（或被拒绝），因为服务器处理完第一个连接后不会再 accept",
          "correct": true
        },
        {
          "text": "第二个客户端会自动复用第一个连接"
        },
        {
          "text": "第二个客户端会收到第一个客户端发的消息"
        }
      ],
      "explain": "<code>accept()</code> 一次只从连接队列里取出<b>一个</b>连接。代码里只调一次，服务器就只服务一个客户端；这段逻辑执行完，程序继续往下走直到结束，端口被关闭，后面再来的连接自然连不上（连上队列里的会一直等，队列外的被拒绝）。所以服务器必须写成循环：<code>while (!serverSocket.isClosed()) { Socket socket = serverSocket.accept(); ... }</code>，这样每来一个客户端就取一个 <code>Socket</code>。线程更不会自动创建，必须自己 <code>new Thread(...).start()</code>。",
      "hint": "accept 一次取几个连接？"
    },
    {
      "id": "ch07-t3",
      "ch": "ch07",
      "kp": "ch07-7",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "socket",
        "thread",
        "exam"
      ],
      "stem": "聊天室服务器在循环里 <code>accept()</code> 到新连接后，为什么要写成 <code>new Thread(new ClientHandler(socket)).start()</code>，而不是直接 <code>new ClientHandler(socket).run()</code>？",
      "options": [
        {
          "text": "直接调用 <code>run()</code> 会在主线程里执行 <code>ClientHandler</code> 的读循环，主线程被占住，无法再 <code>accept()</code> 其他客户端",
          "correct": true
        },
        {
          "text": "因为 <code>ClientHandler</code> 里没有 <code>main</code> 方法，只有 <code>Thread</code> 才能运行它"
        },
        {
          "text": "因为 <code>run()</code> 只能由 JVM 调用，Java 代码里不能直接调用"
        },
        {
          "text": "因为 <code>Thread</code> 构造器会复制一份 <code>Socket</code>，避免多个客户端共用端口"
        }
      ],
      "explain": "<code>run()</code> 只是一个普通的 <code>public</code> 方法，直接调用就是一次普通方法调用，代码仍在<b>当前线程</b>（主线程）里跑。而 <code>ClientHandler.run()</code> 里是 <code>while (socket.isConnected()) { bufferedReader.readLine(); ... }</code> 这样的阻塞读循环，主线程一旦进去就出不来，<code>accept()</code> 再也执行不到，服务器等于只能服务一个客户端。只有 <code>start()</code> 才会让 JVM 创建新线程、由新线程回调 <code>run()</code>，主线程则立刻回到循环顶部继续 <code>accept()</code>——这就是\"每个客户端一个线程\"。第三个选项错在 <code>run()</code> 完全可以直接调，只是没有新线程。",
      "hint": "直接调 run 等于把活儿揽到主线程身上。"
    },
    {
      "id": "ch07-t4",
      "ch": "ch07",
      "kp": "ch07-4",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "socket",
        "syntax"
      ],
      "stem": "已经拿到 <code>Socket s</code>，要按行读取对方发来的文本，正确的包装顺序是？",
      "options": [
        {
          "text": "<code>new BufferedReader(new InputStreamReader(s.getInputStream()))</code>",
          "correct": true
        },
        {
          "text": "<code>new InputStreamReader(new BufferedReader(s.getInputStream()))</code>"
        },
        {
          "text": "<code>new BufferedReader(s.getInputStream())</code>"
        },
        {
          "text": "<code>new InputStreamReader(s.getOutputStream())</code>"
        }
      ],
      "explain": "套娃要从内往外按能力递进：Socket 只提供字节流（<code>getInputStream()</code> 返回 <code>InputStream</code>）；<code>InputStreamReader</code> 把字节按编码解码成字符，自己成了 <code>Reader</code>；<code>BufferedReader</code> 加缓冲并给出 <code>readLine()</code>。所以顺序是 字节 → 字符 → 缓冲。第二个选项把方向倒过来，<code>BufferedReader</code> 的构造器要 <code>Reader</code>，塞 <code>InputStream</code> 编译不过；第三个同样类型不匹配；第四个错在用了输出流——那是写给对方的通道，在这上面读不到任何东西。",
      "hint": "字节 → 字符 → 缓冲，一层一层往外包。"
    },
    {
      "id": "ch07-t5",
      "ch": "ch07",
      "kp": "ch07-2",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "socket",
        "trap",
        "exam"
      ],
      "stem": "判断：<code>accept()</code> 不会阻塞，如果没有客户端连接就立刻返回 <code>null</code>，所以必须判断返回值是否为 <code>null</code>。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "讲义明确写着 accept() blocks the console until the client is connected：它会一直阻塞，直到有客户端连上才返回一个已连接的 <code>Socket</code>，正常情况下不会返回 <code>null</code>。所以\"判断 null\"既没用也防不住卡住——只要没客户端来，线程就停在这行。要让服务器在等待连接的同时还能做别的事（或响应关闭），做法是关闭 <code>ServerSocket</code> 让 <code>accept()</code> 抛异常跳出循环，或者把 accept 放到单独的线程里。",
      "hint": "讲义里 accept 的描述里有个词 blocks。"
    },
    {
      "id": "ch07-t6",
      "ch": "ch07",
      "kp": "ch07-3",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "socket",
        "concept"
      ],
      "stem": "判断：客户端 <code>new Socket(\"localhost\", 1004)</code> 里的端口号必须与服务器 <code>new ServerSocket(1004)</code> 里的端口号一致，否则连不上。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "端口号是\"服务器上哪个程序在监听\"的标识，客户端就是去敲这个门。两边的数字对不上，客户端敲的是一个没人监听的端口，连接会被拒绝（抛 <code>ConnectException</code>）。Tutorial 3 里特意提醒 the port should be equal to the serverSocket。第一个参数 <code>localhost</code> 表示本机（等价于 127.0.0.1），因为服务器和客户端在同一台机器上调试；换成服务器真实的 IP 或域名，就变成跨机器连接，端口规则不变。",
      "hint": "端口是\"敲门\"的号码，两边必须一致。"
    },
    {
      "id": "ch07-t7",
      "ch": "ch07",
      "kp": "ch07-2",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "socket",
        "syntax"
      ],
      "stem": "服务器端用 <code>ServerSocket</code> 等待客户端连接、并取回一个已连接 <code>Socket</code> 的方法是 <code>____</code>。",
      "answer": [
        "accept"
      ],
      "accept": [
        "accept()"
      ],
      "explain": "<code>accept()</code> 是 <code>ServerSocket</code> 的核心方法：它阻塞等待，直到有客户端用这个端口连上来，然后返回一个代表这条连接的 <code>Socket</code>。写法是 <code>Socket socket = serverSocket.accept();</code>。注意它返回的不是 <code>ServerSocket</code>，也不会告诉你客户端的消息内容；所有收发都要通过返回的那个 <code>Socket</code> 的输入输出流进行。",
      "hint": "讲义里说它 blocks the console until the client is connected。"
    },
    {
      "id": "ch07-t8",
      "ch": "ch07",
      "kp": "ch07-4",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "socket",
        "syntax"
      ],
      "stem": "要从 <code>Socket socket</code> 取出输入流（用来读取对方发来的数据），应调用 <code>socket.____()</code>。",
      "answer": [
        "getInputStream"
      ],
      "accept": [
        "getInputStream()",
        "getinputstream"
      ],
      "explain": "一个 <code>Socket</code> 握有两条单向通道：<code>getInputStream()</code> 拿输入流（读对方发来的数据），<code>getOutputStream()</code> 拿输出流（写数据给对方）。拿到的都是字节流，要按行读还得再包 <code>InputStreamReader</code> 和 <code>BufferedReader</code>；要写文本则包 <code>OutputStreamWriter</code> 和 <code>BufferedWriter</code>。这两个方法都可能抛 <code>IOException</code>，所以 main 上常写 <code>throws IOException</code>。",
      "hint": "读用 Input，写用 Output。"
    },
    {
      "id": "ch07-t9",
      "ch": "ch07",
      "kp": "ch07-3",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "socket",
        "syntax"
      ],
      "stem": "下面是客户端连接本机 1004 端口服务器的代码，横线上应填 <code>Socket socket = new Socket(\"____\", 1004);</code> 中的主机名。",
      "answer": [
        "localhost"
      ],
      "accept": [
        "127.0.0.1",
        "本机",
        "LocalHost"
      ],
      "explain": "服务器跑在同一台机器上时，客户端用 <code>localhost</code>（本机回环地址 127.0.0.1）即可；直接写 IP 地址或真实域名也可以，效果是让 <code>Socket</code> 知道去哪台机器。Tutorial 3 的例子正是 <code>new Socket(\"localhost\", 1004)</code>，并强调 In this project localhost is fine。第二个参数必须与 <code>new ServerSocket(1004)</code> 的端口一致，否则连到没人监听的端口会失败。",
      "hint": "\"本机\"的英文主机名。"
    },
    {
      "id": "ch07-t10",
      "ch": "ch07",
      "kp": "ch07-1",
      "type": "multi",
      "difficulty": 2,
      "tags": [
        "socket",
        "concept"
      ],
      "stem": "下列关于 Java Socket 编程的说法，哪些是正确的？（多选）",
      "options": [
        {
          "text": "<code>Socket</code> 与 <code>ServerSocket</code> 用于面向连接（connection-oriented）的通信",
          "correct": true
        },
        {
          "text": "服务器在循环里反复调用 <code>accept()</code>，才能接连处理多个客户端",
          "correct": true
        },
        {
          "text": "一个 <code>ServerSocket</code> 调一次 <code>accept()</code> 就能同时返回所有客户端的 <code>Socket</code>"
        },
        {
          "text": "通信结束后应关闭 <code>Socket</code> / <code>ServerSocket</code>，释放连接与端口资源",
          "correct": true
        }
      ],
      "explain": "第一个是讲义原话：Socket and ServerSocket are used for connection-oriented socket programming（无连接的是 <code>DatagramSocket</code> / <code>DatagramPacket</code>）。第二个和第三个其实在问同一件事：<code>accept()</code> 一次只取<b>一个</b>连接，所以必须放在 <code>while (!serverSocket.isClosed())</code> 里反复调用，第三个说\"一次返回所有\"是错的。第四个是收尾：不 <code>close()</code> 会一直占着端口和连接，服务器重启时常看到\"端口已被占用\"（Address already in use），多半就是上一次没关干净。",
      "hint": "accept 一次取一个连接。"
    },
    {
      "id": "ch07-t11",
      "ch": "ch07",
      "kp": "ch07-4",
      "type": "order",
      "difficulty": 2,
      "tags": [
        "socket",
        "syntax"
      ],
      "stem": "把服务器端\"接受一次连接、并读到客户端发来的一行文本\"的代码按正确执行顺序排列。",
      "options": [
        {
          "text": "<code>Socket socket = serverSocket.accept();</code>"
        },
        {
          "text": "<code>ServerSocket serverSocket = new ServerSocket(1004);</code>"
        },
        {
          "text": "<code>String line = in.readLine();</code>"
        },
        {
          "text": "<code>BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));</code>"
        },
        {
          "text": "<code>System.out.println(\"received: \" + line);</code>"
        }
      ],
      "answer": [
        1,
        0,
        3,
        2,
        4
      ],
      "explain": "依赖关系决定顺序：先 <code>new ServerSocket(1004)</code> 在端口 1004 上监听；有了监听套接字才能 <code>accept()</code>，它阻塞到有客户端连上并返回一个 <code>Socket</code>；有了 <code>Socket</code> 才能 <code>getInputStream()</code> 并包成 <code>BufferedReader</code>；有了 <code>BufferedReader</code> 才能 <code>readLine()</code>；读到 <code>line</code> 才能打印。顺序颠倒最典型的报错是 <code>NullPointerException</code>——<code>socket</code> 还是 <code>null</code> 就去调 <code>getInputStream()</code>；其次是编译错误，比如在 <code>accept()</code> 之前就声明 <code>socket</code> 却先用了它。",
      "hint": "谁依赖谁：没有 Socket 就没有流。"
    },
    {
      "id": "ch07-t12",
      "ch": "ch07",
      "kp": "ch07-5",
      "type": "predict",
      "difficulty": 3,
      "tags": [
        "socket",
        "output"
      ],
      "stem": "服务器端代码如下。某客户端连上后依次发送两行 <code>a</code>、<code>b</code>（每行都以换行结束），然后关闭自己的 <code>Socket</code>。写出服务器控制台的输出（逐行）。",
      "code": "ServerSocket ss = new ServerSocket(7000);\nSocket s = ss.accept();\nBufferedReader in = new BufferedReader(new InputStreamReader(s.getInputStream()));\nString line;\nwhile ((line = in.readLine()) != null) {\n    System.out.println(\"got \" + line);\n}\nSystem.out.println(\"done\");",
      "answer": "got a\ngot b\ndone",
      "explain": "每次 <code>readLine()</code> 读一行并去掉换行，所以先打印 <code>got a</code>、再打印 <code>got b</code>。循环的出口是 <code>null</code>：客户端把自己的 <code>Socket</code> 关掉后，服务器这一端的输入流到达末尾，<code>readLine()</code> 返回 <code>null</code>——注意这里是\"正常收尾\"而不是抛异常，所以循环干净结束，接着打印 <code>done</code>。反过来，如果客户端既不关连接也不再发数据，<code>readLine()</code> 会一直阻塞，<code>done</code> 永远不会打印。这也说明服务器的读循环既要能处理\"对方关了连接\"，也要有办法主动跳出。",
      "hint": "对方关闭连接时，读到的不是异常而是 null。"
    },
    {
      "id": "ch07-f1",
      "ch": "ch07",
      "kp": "ch07-5",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "socket",
        "bug",
        "trap"
      ],
      "stem": "下面的客户端程序想让服务器先发欢迎语、自己随后再发消息，但运行时两个程序都停住不动了（服务器端也是先 <code>readLine()</code> 等客户端发消息）。找出错误并说明改法。",
      "code": "public class Client {\n    public static void main(String[] args) throws IOException {\n        Socket socket = new Socket(\"localhost\", 1004);\n        BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));\n        BufferedWriter out = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));\n        String welcome = in.readLine();\n        System.out.println(welcome);\n        out.write(\"hello\");\n        out.flush();\n    }\n}",
      "accept": [
        {
          "hint": "指出双方都阻塞在 readLine 上（读写顺序不配对）",
          "any": [
            "阻塞",
            "卡住",
            "死锁",
            "互相等",
            "都在等",
            "等待"
          ]
        },
        {
          "hint": "改法：先写并 flush 再读，或约定服务器先发消息",
          "any": [
            "先写",
            "先发送",
            "先 flush",
            "交换",
            "反过来",
            "服务器先"
          ]
        }
      ],
      "minHits": 2,
      "answer": "客户端一上来就 in.readLine() 等服务器，而服务器也先 readLine() 等客户端，双方互相阻塞；应改成先 out.write(\"hello\") + out.flush()，再 in.readLine()",
      "explain": "<code>readLine()</code> 是阻塞读：流里没数据就不会返回。现在客户端在等服务器的欢迎语、服务器在等客户端的消息，两边都停在读上，谁都不肯先写，于是永远等下去——这是最经典的 Socket 时序 bug，和代码语法无关。修法有两种：一是让客户端先 <code>out.write(\"hello\")</code> 再 <code>out.flush()</code>，把消息推出去之后才 <code>in.readLine()</code>；二是双方约定服务器在 accept 之后先写一句欢迎语，这样客户端先读就是安全的，因为数据已经在路上了。无论哪种，写的一方都必须 <code>flush()</code>，否则 <code>BufferedWriter</code> 里的内容没发出去，对方依旧阻塞。",
      "hint": "谁先说话？两边都在等对方先开口会怎样？"
    },
    {
      "id": "ch08-q1",
      "ch": "ch08",
      "kp": "ch08-1",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "thread",
        "concept"
      ],
      "stem": "在 Java 中创建线程有哪两种基本方式？",
      "options": [
        {
          "text": "继承 <code>Thread</code> 类并重写 <code>run()</code>；或实现 <code>Runnable</code> 接口，把实例交给 <code>Thread</code>",
          "correct": true
        },
        {
          "text": "继承 <code>Runnable</code> 类并重写 <code>start()</code>；或实现 <code>Thread</code> 接口"
        },
        {
          "text": "只能继承 <code>Thread</code> 类，<code>Runnable</code> 只用于匿名内部类"
        },
        {
          "text": "把任意类的方法名改成 <code>start()</code> 并加 <code>@Override</code>，它就变成线程"
        }
      ],
      "explain": "讲义给出的两种机制是：Extending the Thread class 和 Implementing the Runnable Interface。它们的共同点是都要重写 <code>run()</code>（线程的任务体），区别只是任务放在哪：继承时任务混在 <code>Thread</code> 子类里；实现 <code>Runnable</code> 时任务单独成类，再 <code>new Thread(runnable)</code> 把它交给线程对象。第二个选项把两者关系整个说反了——<code>Runnable</code> 是接口、<code>Thread</code> 是类（而且 <code>Thread</code> 本身就 implements Runnable）。第四个选项更不对：线程不是靠改名变出来的，必须有 <code>Thread</code> 对象并调用 <code>start()</code>。",
      "hint": "两条路：继承 Thread，或实现 Runnable。"
    },
    {
      "id": "ch08-q2",
      "ch": "ch08",
      "kp": "ch08-2",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "thread",
        "output",
        "trap"
      ],
      "stem": "写出下面程序的输出（逐行）。",
      "code": "public class Demo {\n    public static void main(String[] args) {\n        Thread t = new Thread(new Runnable() {\n            public void run() {\n                System.out.println(\"run\");\n            }\n        });\n        t.run();\n        System.out.println(\"main\");\n    }\n}",
      "answer": "run\nmain",
      "explain": "关键在 <code>t.run()</code>：<code>run()</code> 只是一个普通方法，直接调用就是在<b>当前线程</b>（main 线程）里执行方法体，不会创建任何新线程。所以执行顺序就是代码顺序：先执行 <code>run()</code> 的方法体打印 <code>run</code>，方法返回后再打印 <code>main</code>，输出完全确定。如果改成 <code>t.start()</code>，JVM 会新开一个线程去执行 <code>run()</code>，主线程则继续往下跑，两行谁先出现就由调度器决定，答案就不再唯一了——这正是判断\"这道题能不能出成 predict\"的分界线。",
      "hint": "run 是普通方法调用，仍在 main 线程里顺序执行。"
    },
    {
      "id": "ch08-q3",
      "ch": "ch08",
      "kp": "ch08-2",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "thread",
        "trap",
        "exam"
      ],
      "stem": "关于线程的 <code>start()</code> 和 <code>run()</code>，下列说法正确的是？",
      "options": [
        {
          "text": "<code>start()</code> 会创建新线程，再由新线程调用 <code>run()</code>；直接调用 <code>run()</code> 只是在当前线程里执行方法体",
          "correct": true
        },
        {
          "text": "<code>start()</code> 和 <code>run()</code> 完全等价，只是名字不同"
        },
        {
          "text": "<code>run()</code> 会创建新线程，<code>start()</code> 只是把线程标记成就绪"
        },
        {
          "text": "直接调用 <code>run()</code> 会抛 <code>IllegalThreadStateException</code>，所以只能用 <code>start()</code>"
        }
      ],
      "explain": "<code>start()</code> 的职责是向 JVM 申请一个新线程，新线程进入 Runnable、拿到 CPU 后<b>回调</b>该对象的 <code>run()</code>；而 <code>run()</code> 只是普通的实例方法，谁调用就在谁的线程栈上执行，直接调它没有任何并发效果——这是本章最高频的考点。第二个选项错在两者行为完全不同；第三个把职责对调了；第四个错在 <code>run()</code> 直接调用不会抛任何异常，它就是一次普通方法调用；<code>IllegalThreadStateException</code> 是同一个 <code>Thread</code> 对象被 <code>start()</code> 两次时才会抛的。",
      "hint": "谁真正向 JVM 要了新线程？"
    },
    {
      "id": "ch08-t1",
      "ch": "ch08",
      "kp": "ch08-3",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "thread",
        "concept"
      ],
      "stem": "线程对象调用了 <code>start()</code>、但还没有被调度器分配到 CPU 时，处于生命周期的哪个状态？",
      "options": [
        {
          "text": "Terminated（终止）"
        },
        {
          "text": "Runnable（就绪，排队等 CPU）",
          "correct": true
        },
        {
          "text": "New（新建）"
        },
        {
          "text": "Running（运行）"
        }
      ],
      "explain": "讲义把 New 之后的状态称为 Active，它内部再分两个子状态：Runnable 是\"准备好了、等调度器分配 CPU\"，Running 是\"已经拿到 CPU 正在执行\"，两者之间会来回切换，是线程状态中最常见的变化。所以 <code>start()</code> 之后、拿到 CPU 之前是 Runnable。New 是 <code>start()</code> 之前（代码一行都还没跑）；Terminated 是 <code>run()</code> 正常结束或异常终止之后。判断这类题就看一句：CPU 现在在谁手上。",
      "hint": "start 之后是\"就绪\"，拿到 CPU 才是\"运行\"。"
    },
    {
      "id": "ch08-t2",
      "ch": "ch08",
      "kp": "ch08-4",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "thread",
        "concept"
      ],
      "stem": "在线程里执行 <code>Thread.sleep(1000)</code>，下列说法正确的是？",
      "options": [
        {
          "text": "<code>sleep</code> 会让当前线程直接终止，之后不能再运行"
        },
        {
          "text": "<code>sleep(1000)</code> 会让程序里所有线程一起暂停 1 秒"
        },
        {
          "text": "当前线程进入 Timed Waiting，约 1 秒后回到 Runnable，但实际停顿可能比 1000 毫秒更久",
          "correct": true
        },
        {
          "text": "当前线程会精确地在 1000 毫秒后恢复运行"
        }
      ],
      "explain": "<code>sleep</code> 让<b>当前正在执行的那个线程</b>进入 Timed Waiting（定时等待）状态，参数单位是毫秒。时间到了以后它只是变回 Runnable（就绪），还得排队等调度器分配 CPU 才能真正继续跑，所以实际停顿时长 ≥ 1000 毫秒，绝不会\"准时\"。它也绝不会把线程弄死——终止只发生在 <code>run()</code> 正常结束或抛出未处理异常时；更不会影响别的线程，其他线程该跑照跑。讲义把 <code>sleep</code> 举为 Timed Waiting 的典型例子，正是因为它有\"限时\"这个特征。",
      "hint": "睡醒之后还要排队等 CPU。"
    },
    {
      "id": "ch08-t3",
      "ch": "ch08",
      "kp": "ch08-6",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "thread",
        "trap",
        "exam"
      ],
      "stem": "主线程先后 <code>start()</code> 了两个线程，每个线程都打印自己名字三次，主线程随后什么也不做。关于输出顺序，正确的说法是？",
      "options": [
        {
          "text": "两个线程的输出可能交错，谁先打印由线程调度器决定，程序不保证顺序",
          "correct": true
        },
        {
          "text": "先 <code>start()</code> 的那个线程一定先打印完它那三行"
        },
        {
          "text": "两个线程会严格交替打印，一行换一个"
        },
        {
          "text": "不调用 <code>join()</code> 的话线程根本不会开始执行"
        }
      ],
      "explain": "<code>start()</code> 只是把线程送进 Runnable，让它\"有资格\"运行；什么时候真正拿到 CPU、一次能跑多久，全由线程调度器决定，还受机器核数、系统负载影响，因此不同次运行的输出都可能不同。所以任何\"先 start 的一定先跑完\"\"一定交替\"的断言都是错的——把不确定当确定，是线程题最常见的陷阱。第四个选项也错：<code>join()</code> 的作用是\"等它结束\"，不是\"让它开始\"，不 join 线程照样会跑，只是主线程不会等它。想让顺序确定，得靠 <code>join()</code>、<code>sleep()</code> 这类手段人为固定时间关系。",
      "hint": "start 只代表\"就绪\"，不代表\"先执行\"。"
    },
    {
      "id": "ch08-t4",
      "ch": "ch08",
      "kp": "ch08-5",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "thread",
        "concept"
      ],
      "stem": "主线程里执行 <code>t.start(); t.join();</code> 之后，主线程会怎样？",
      "options": [
        {
          "text": "在 <code>join()</code> 处等待，直到 <code>t</code> 执行结束，才继续往下执行",
          "correct": true
        },
        {
          "text": "立刻继续往下执行，完全不等 <code>t</code>"
        },
        {
          "text": "让 <code>t</code> 暂停，等主线程结束后 <code>t</code> 再继续"
        },
        {
          "text": "把 <code>t</code> 的优先级提到最高，让它一定先跑"
        }
      ],
      "explain": "<code>join()</code> 的语义是\"等这个线程结束\"：主线程执行到 <code>t.join()</code> 时进入等待，直到 <code>t</code> 的 <code>run()</code> 返回、线程进入 Terminated，主线程才回到 Runnable 继续往下走。这正是让输出顺序变得确定的常用手段——先 <code>start()</code> 再 <code>join()</code>，就保证了 <code>t</code> 的输出全部出现在主线程后续语句之前。第三个选项把\"谁等谁\"说反了：<code>t.join()</code> 是调用者等 <code>t</code>，不是 <code>t</code> 等调用者；<code>join</code> 也不改优先级。",
      "hint": "join 的意思是\"加入/等待它结束\"。"
    },
    {
      "id": "ch08-t5",
      "ch": "ch08",
      "kp": "ch08-2",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "thread",
        "trap",
        "exam"
      ],
      "stem": "判断：线程一旦调用了 <code>start()</code>，就一定立刻开始执行 <code>run()</code> 里的代码。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "<code>start()</code> 做完的事只是把线程从 New 送进 Active 的 Runnable（就绪），意思是\"有资格运行了\"；真正开始执行还要等线程调度器把 CPU 分给它，此时才进入 Running。所以 <code>start()</code> 会立即返回，调用它的线程（通常是 main）继续往下走，而 <code>run()</code> 的第一行什么时候执行、和主线程谁先谁后，都不确定。若把\"立刻\"理解成\"start 返回时 run 已经跑完\"，那就更错了——要确定它执行完，只能用 <code>join()</code> 等它结束。",
      "hint": "run 只是普通方法，没有新线程。"
    },
    {
      "id": "ch08-t6",
      "ch": "ch08",
      "kp": "ch08-1",
      "type": "tf",
      "difficulty": 1,
      "tags": [
        "thread",
        "concept"
      ],
      "stem": "判断：一个类实现 <code>Runnable</code> 接口并重写 <code>run()</code> 之后，还必须把它的实例交给 <code>Thread</code> 并调用 <code>start()</code>，它才会以线程方式运行。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "<code>Runnable</code> 只描述\"有一个可运行的任务\"，它本身<b>不是</b>线程，也没有 <code>start()</code> 方法。Tutorial 4 的说法是：instantiate a Thread object and call start() method on this object——先把 <code>Runnable</code> 实例交给 <code>new Thread(runnable)</code>，再对这个 <code>Thread</code> 调 <code>start()</code>，JVM 才会开新线程去执行那个 <code>run()</code>。只 <code>new</code> 出 <code>Runnable</code> 对象再直接调 <code>run()</code>，仍然是主线程里的普通方法调用。",
      "hint": "Runnable 是任务，Thread 才是线程。"
    },
    {
      "id": "ch08-t7",
      "ch": "ch08",
      "kp": "ch08-2",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "thread",
        "syntax"
      ],
      "stem": "要让一个线程真正以新线程运行并回调它的 <code>run()</code>，应调用 <code>t.____()</code>。",
      "answer": [
        "start"
      ],
      "accept": [
        "start()"
      ],
      "explain": "正确答案是 <code>start()</code>。它的作用不是\"运行 run 方法\"，而是向 JVM 申请一个新线程：线程先进入 Runnable（就绪），等调度器分配 CPU 后才由这个新线程去执行 <code>run()</code>。所以 <code>start()</code> 会立刻返回，主线程继续往下走，两段代码真正并行（并发）起来。而 <code>t.run()</code> 只是普通方法调用，还在原来的线程里，写错这一个词，整个多线程程序就退化成单线程。",
      "hint": "让 JVM 开新线程的是哪个方法？"
    },
    {
      "id": "ch08-t8",
      "ch": "ch08",
      "kp": "ch08-4",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "thread",
        "syntax"
      ],
      "stem": "让当前线程暂停约 1 秒的语句是 <code>Thread.____(1000);</code>。",
      "answer": [
        "sleep"
      ],
      "accept": [
        "sleep()"
      ],
      "explain": "<code>sleep</code> 是 <code>Thread</code> 的静态方法，作用在自己身上就是让<b>当前正在执行</b>的线程暂停，参数单位是毫秒，1000 毫秒即 1 秒。暂停期间线程处于 Timed Waiting；时间到后回到 Runnable，还要重新排队等 CPU，所以实际停顿只会 ≥ 1000 毫秒，不是精确计时。它常被用来做\"每轮循环间隔一下\"，也常和 <code>join</code> 一起用来把线程的时间关系固定住。",
      "hint": "静态方法，单位毫秒。"
    },
    {
      "id": "ch08-t9",
      "ch": "ch08",
      "kp": "ch08-5",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "thread",
        "syntax"
      ],
      "stem": "主线程想等线程 <code>t</code> 执行完之后再继续，应调用 <code>t.____()</code>。",
      "answer": [
        "join"
      ],
      "accept": [
        "join()"
      ],
      "explain": "<code>join()</code> 是\"合并/等待\"的意思：调用它的线程（这里是 main）会被挂起，直到 <code>t</code> 的 <code>run()</code> 执行完、<code>t</code> 进入 Terminated 才恢复。它最常见的用途就是给多线程程序制造确定的顺序——先 <code>t.start()</code> 让任务跑起来，再 <code>t.join()</code> 等它跑完，之后的打印就一定排在 <code>t</code> 的输出后面。如果没有 <code>join</code>，主线程会立刻继续，谁先打印就由调度器决定。",
      "hint": "等它结束再往下走。"
    },
    {
      "id": "ch08-t10",
      "ch": "ch08",
      "kp": "ch08-3",
      "type": "multi",
      "difficulty": 2,
      "tags": [
        "thread",
        "concept"
      ],
      "stem": "下列关于 Java 线程的说法，哪些是正确的？（多选）",
      "options": [
        {
          "text": "线程共享同一块内存区域，因此多个线程可以读写同一个对象的字段",
          "correct": true
        },
        {
          "text": "线程比进程轻量，创建和切换的开销更小",
          "correct": true
        },
        {
          "text": "一个线程里抛出未处理的异常，会连带终止进程里的其他线程"
        },
        {
          "text": "线程的生命周期包括 New、Runnable/Running、Blocked 或 Waiting、Timed Waiting、Terminated",
          "correct": true
        }
      ],
      "explain": "前两条和第四条都是讲义原话：a thread is a lightweight subprocess；threads use a shared memory area, they do not allocate separate memory areas；生命周期五态是 New、Active（含 Runnable 与 Running）、Blocked/Waiting、Timed Waiting、Terminated。第三个选项恰好说反了：讲义强调 Threads are independent，并且明确写了某个线程出现异常并不会影响其他线程——所以一个线程挂掉，别的线程照常运行。共享内存这一点也解释了为什么多个线程同时改同一个字段会出问题：它们看到的是同一份数据，没有各自的副本。",
      "hint": "讲义说线程之间\"独立\"，但内存是共享的。"
    },
    {
      "id": "ch08-t11",
      "ch": "ch08",
      "kp": "ch08-3",
      "type": "order",
      "difficulty": 2,
      "tags": [
        "thread",
        "concept"
      ],
      "stem": "按线程生命周期，把下面发生在一个线程上的事件排成正确顺序。",
      "options": [
        {
          "text": "线程调度器分配 CPU，线程进入 Running"
        },
        {
          "text": "<code>Thread t = new Thread(task);</code> 创建线程，处于 New"
        },
        {
          "text": "<code>run()</code> 返回，线程进入 Terminated"
        },
        {
          "text": "线程执行 <code>Thread.sleep(1000)</code>，进入 Timed Waiting"
        },
        {
          "text": "<code>t.start()</code> 被调用，线程进入 Runnable"
        }
      ],
      "answer": [
        1,
        4,
        0,
        3,
        2
      ],
      "explain": "顺序就是状态机的走向：<code>new Thread(task)</code> 之后线程处于 New（代码还没跑）→ 调用 <code>start()</code> 进入 Active 的 Runnable（就绪，排队等 CPU）→ 调度器分配 CPU 后进入 Running → 执行 <code>sleep(1000)</code> 进入 Timed Waiting（时间到再回到 Runnable 重新排队）→ <code>run()</code> 结束进入 Terminated。注意 Runnable 与 Running 之间会来回切换，这是讲义特别指出的\"最常见的变化\"；而 Timed Waiting 是可恢复的中间态，不是终点，Terminated 才是。",
      "hint": "New → 就绪 → 运行 → 定时等待 → 终止。"
    },
    {
      "id": "ch08-t12",
      "ch": "ch08",
      "kp": "ch08-5",
      "type": "predict",
      "difficulty": 3,
      "tags": [
        "thread",
        "output"
      ],
      "stem": "写出下面程序的输出（逐行）。",
      "code": "public class JoinDemo {\n    public static void main(String[] args) throws InterruptedException {\n        Thread t = new Thread(new Runnable() {\n            public void run() {\n                System.out.println(\"worker\");\n            }\n        });\n        t.start();\n        t.join();\n        System.out.println(\"main\");\n    }\n}",
      "answer": "worker\nmain",
      "explain": "这个输出是确定的，全部功劳在 <code>t.join()</code>：主线程执行到这一行就进入等待，直到 <code>t</code> 的 <code>run()</code> 打印完 <code>worker</code>、线程终止，才被唤醒继续执行 <code>System.out.println(\"main\")</code>。所以 <code>worker</code> 一定在前。反过来说，如果把 <code>t.join()</code> 删掉，主线程 <code>start()</code> 完就立刻往下跑，两个打印谁先谁后完全取决于调度器，同样的代码在不同机器上可能得到不同结果——那样的题目就<strong>不能</strong>出成 predict，因为答案不唯一。",
      "hint": "join 把\"谁先谁后\"固定住了。"
    },
    {
      "id": "ch08-f1",
      "ch": "ch08",
      "kp": "ch08-2",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "thread",
        "bug",
        "trap"
      ],
      "stem": "下面的程序想开一个线程打印 1 到 3，但运行后抛出了 <code>IllegalThreadStateException</code>。找出错误并说明改法。",
      "code": "public class Twice {\n    public static void main(String[] args) {\n        Thread t = new Thread(new Runnable() {\n            public void run() {\n                for (int i = 1; i <= 3; i++) {\n                    System.out.println(i);\n                }\n            }\n        });\n        t.start();\n        t.start();\n    }\n}",
      "accept": [
        {
          "hint": "指出同一个 Thread 对象被 start 了两次",
          "any": [
            "两次",
            "第二次",
            "重复",
            "再次",
            "多次"
          ]
        },
        {
          "hint": "改法：只 start 一次；要再开线程就 new 一个新的 Thread",
          "any": [
            "删除",
            "去掉",
            "只调用一次",
            "只 start",
            "new Thread",
            "新建",
            "另一个"
          ]
        }
      ],
      "minHits": 2,
      "answer": "同一个 Thread 对象只能 start() 一次，第二次 start() 抛 IllegalThreadStateException；删掉第二次 start()，若要再开一个线程必须 new 一个新的 Thread 对象",
      "explain": "线程的状态是单向的：<code>start()</code> 之后它从 New 走到 Runnable/Running，最后 Terminated，永远回不到 New，所以同一个 <code>Thread</code> 对象的第二次 <code>start()</code> 直接抛 <code>IllegalThreadStateException</code>——这是 JVM 在替你挡住\"让一个已经启动过的线程重跑\"这种非法操作。想让两段任务并发执行，正确做法是 <code>new</code> 两个 <code>Thread</code> 对象（同一个 <code>Runnable</code> 可以交给两个 <code>Thread</code>），或者干脆只用一次 <code>start()</code>。注意这里和\"重复调用 <code>run()</code>\"完全不同：<code>run()</code> 调多少次都不会抛异常，只是都在当前线程里顺序执行。",
      "hint": "一个 Thread 对象的生命周期能不能重来一次？"
    },
    {
      "id": "ch09-q1",
      "ch": "ch09",
      "kp": "ch09-3",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "javafx"
      ],
      "stem": "写一个 JavaFX 桌面程序时，应用主类必须满足的条件是？",
      "options": [
        {
          "text": "实现 <code>Runnable</code> 接口，并重写 <code>run()</code>"
        },
        {
          "text": "继承 <code>javafx.scene.Scene</code>，并重写 <code>start(Stage)</code>"
        },
        {
          "text": "继承 <code>javafx.application.Application</code>，并重写 <code>start(Stage)</code>",
          "correct": true
        },
        {
          "text": "继承 <code>javafx.stage.Stage</code>，并重写 <code>show()</code>"
        }
      ],
      "explain": "JavaFX 的启动方式是\"框架回调\"：主类必须继承 <code>javafx.application.Application</code>，并重写 <code>public void start(Stage primaryStage)</code>。main 里的 <code>launch(args)</code> 启动 runtime 后，由框架创建 primary Stage 再回调 start，把窗口交给你。Stage 和 Scene 是运行时创建的对象，不是继承目标；Runnable 是线程接口，与 JavaFX 启动无关。",
      "hint": "想一想 <code>start(Stage)</code> 是谁调用的：不是 main，是框架。"
    },
    {
      "id": "ch09-q2",
      "ch": "ch09",
      "kp": "ch09-4",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "output",
        "trap",
        "javafx"
      ],
      "stem": "下面这段 <code>start</code> 方法运行后，屏幕上的情况是？",
      "code": "@Override\npublic void start(Stage primaryStage) {\n    Button btn = new Button(\"Say Hello\");\n    StackPane root = new StackPane();\n    root.getChildren().add(btn);\n\n    Scene scene = new Scene(root, 300, 200);\n    primaryStage.setTitle(\"Hello\");\n    primaryStage.setScene(scene);\n}",
      "options": [
        {
          "text": "什么都不出现，因为始终没有调用 <code>primaryStage.show()</code>",
          "correct": true
        },
        {
          "text": "出现一个 300×200 的空窗口，按钮没有显示"
        },
        {
          "text": "编译错误，因为 <code>start</code> 方法缺少返回值"
        },
        {
          "text": "出现窗口和按钮，但点按钮没有反应"
        }
      ],
      "explain": "<code>setScene</code> 只是把内容装进窗口，<code>show()</code> 才是让窗口出现在屏幕上的那一步——六步里少了最后这一下，代码不报错，但屏幕上看不到窗口。选项 B 把\"窗口不出现\"和\"控件没进场景图\"混为一谈：这里按钮已经 add 进 root，问题是窗口根本没显示；C 错在 start 本来就是 void；D 错在窗口都没出现，谈不上点击。",
      "hint": "六步里最后让窗口现身的那一句是哪一句？"
    },
    {
      "id": "ch09-q3",
      "ch": "ch09",
      "kp": "ch09-5",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "trap",
        "exam",
        "javafx"
      ],
      "stem": "某同学在 <code>main</code> 方法里连续写了两遍 <code>launch(args);</code>。运行结果是？",
      "options": [
        {
          "text": "第二次调用被静默忽略，只出现一个窗口"
        },
        {
          "text": "编译错误：<code>launch</code> 是实例方法，不能在 static 的 <code>main</code> 里调用"
        },
        {
          "text": "第二次调用抛出 <code>IllegalStateException</code>：<code>launch()</code> 在一个 JVM 里只能调用一次",
          "correct": true
        },
        {
          "text": "打开两个一模一样的窗口"
        }
      ],
      "explain": "<code>launch</code> 是 Application 的静态方法，负责初始化 JavaFX runtime、实例化 Application 子类、创建 primary Stage，并在 JavaFX 应用线程上调用 start。这套初始化一个 JVM 只允许做一次，第二次 launch 会抛 <code>IllegalStateException</code>。想再开一个窗口，正确做法是在 start 里 <code>new Stage()</code> 再 show，而不是再 launch 一次。D 的误解在于 launch 正是 static 的，可以在 main 里直接调用。",
      "hint": "<code>launch</code> 启动的是整个 JavaFX runtime，而不是一个窗口。"
    },
    {
      "id": "ch09-t1",
      "ch": "ch09",
      "kp": "ch09-2",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "javafx"
      ],
      "stem": "关于 Stage、Scene、Node 三层结构，下列说法正确的是？",
      "options": [
        {
          "text": "<code>Stage</code> 是窗口，负责标题与显示；<code>Scene</code> 是内容容器，负责挂一棵场景图",
          "correct": true
        },
        {
          "text": "<code>Scene</code> 是窗口，<code>Stage</code> 是窗口里的内容"
        },
        {
          "text": "<code>Node</code> 是窗口，<code>Stage</code> 是界面上的一个元素"
        },
        {
          "text": "一个 <code>Stage</code> 装了某个 <code>Scene</code> 之后，就再也不能换成别的 <code>Scene</code>"
        }
      ],
      "explain": "三层是\"窗口 → 内容 → 元素\"：Stage 是顶层容器（一个程序一个 primary Stage），Scene 装所有可见内容并持有场景图的根节点，Node 是场景图里的可视元素（按钮、标签、布局都是 Node）。B、C 把三层的职责说反了；D 错在 Stage 可以随时 setScene 换内容——登录页换注册页就是这么做的，只是同一时刻只显示一个 Scene。",
      "hint": "从外到内：窗口、内容、元素。"
    },
    {
      "id": "ch09-t2",
      "ch": "ch09",
      "kp": "ch09-3",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam",
        "javafx"
      ],
      "stem": "重写 <code>start</code> 时写上 <code>@Override</code>，它的作用是？",
      "options": [
        {
          "text": "让 JavaFX 知道这是程序的入口，不写就不会显示窗口"
        },
        {
          "text": "必须写，否则 <code>start</code> 永远不会被回调"
        },
        {
          "text": "让编译器检查这确实是覆盖父类的方法，签名写错会直接报错",
          "correct": true
        },
        {
          "text": "让 <code>start</code> 变成静态方法，框架才能调用它"
        }
      ],
      "explain": "@Override 是给编译器的断言：它要求下面这个方法确实覆盖了父类中的同名同参方法。start 的正确签名是 <code>public void start(Stage)</code>，参数类型写成 Scene、Button 都不算覆盖，@Override 会立刻报\"方法未覆盖父类\"，把签名错误提前暴露。它不影响方法是不是 static，也不参与\"入口识别\"——入口由 Application 子类加 launch 决定；不写 @Override 也能运行，只是失去这层保险。",
      "hint": "注解是写给编译器看的检查，不是写给框架看的开关。"
    },
    {
      "id": "ch09-t3",
      "ch": "ch09",
      "kp": "ch09-6",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept",
        "javafx"
      ],
      "stem": "登录程序里已经准备好 <code>loginScene</code> 与 <code>registerScene</code> 两个场景，当前显示登录页。点\"去注册\"按钮后要把窗口内容换成注册页，正确写法是？",
      "options": [
        {
          "text": "<code>stage.setScene(registerScene);</code>",
          "correct": true
        },
        {
          "text": "<code>new Stage().show();</code>"
        },
        {
          "text": "<code>stage.show(registerScene);</code>"
        },
        {
          "text": "<code>registerScene.show();</code>"
        }
      ],
      "explain": "多页面的做法是\"一个 Stage 装多个 Scene\"，切换只改 setScene：窗口位置和大小不动，里面的内容整体替换。B 会再开一个窗口，而且新 Stage 没装 Scene，show 出来是空的；C 错在 show() 没有参数；D 错在 show() 是 Stage 的方法，Scene 没有 show()。补一句：setScene 之后不需要再 show()，Stage 已经在显示中，换内容会立刻刷新。",
      "hint": "换的是\"窗口里的内容\"，不是\"窗口\"。"
    },
    {
      "id": "ch09-t4",
      "ch": "ch09",
      "kp": "ch09-2",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "trap",
        "javafx"
      ],
      "stem": "判断：一个 <code>Scene</code> 可以同时挂两个根节点（root），这样两个布局会左右并排显示。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "Scene 的构造器 <code>new Scene(root, w, h)</code> 只接收一个 root，整棵场景图是一棵树而不是森林。要让\"两个布局并排\"，正确做法是让唯一的 root 变成能装子节点的容器（例如 HBox），再把两个布局 add 进去——布局本身也是 Node，可以嵌套。场景图只有一个根，这是渲染和事件传递的基础。",
      "hint": "树只有一个根；并排是布局的事，不是 Scene 的事。"
    },
    {
      "id": "ch09-t5",
      "ch": "ch09",
      "kp": "ch09-5",
      "type": "tf",
      "difficulty": 1,
      "tags": [
        "concept",
        "javafx"
      ],
      "stem": "判断：从 JavaFX 8 开始，<code>Application</code> 子类可以省略 <code>main</code> 方法，由 JavaFX runtime 自己找到并启动它。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "JavaFX 的 launcher 会自己寻找 Application 子类并调用 launch，所以 main 不是必需的；但 IntelliJ 的 Run 按钮找的是 main，课程代码保留 <code>main</code> 加 <code>launch(args)</code> 最稳。注意\"能省略 main\"不等于\"能省略启动逻辑\"：Application 子类加 start 仍然必需，省略的只是那个入口方法。",
      "hint": "launcher 找的是 Application 子类，不是 main。"
    },
    {
      "id": "ch09-t6",
      "ch": "ch09",
      "kp": "ch09-5",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "syntax",
        "javafx"
      ],
      "stem": "JavaFX 程序的 <code>main</code> 里通常只写一行 <code>____(args);</code>，它启动 JavaFX runtime，并在 JavaFX 应用线程上回调 <code>start</code>。",
      "answer": [
        "launch"
      ],
      "accept": [
        "launch()",
        "launch(args)",
        "Application.launch",
        "Launch",
        "LAUNCH"
      ],
      "explain": "<code>launch</code> 是 <code>javafx.application.Application</code> 的静态方法，main 里调用它等于把控制权交给 JavaFX：它初始化图形系统、实例化 Application 子类、创建 primary Stage，再在 JavaFX 应用线程上调用 <code>start(Stage)</code>。args 是 main 收到的命令行参数，会转交给 Application。它在一个 JVM 里只能调用一次，重复调用会抛异常。",
      "hint": "启动器的方法名，六个字母。"
    },
    {
      "id": "ch09-t7",
      "ch": "ch09",
      "kp": "ch09-3",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "syntax",
        "exam",
        "javafx"
      ],
      "stem": "重写启动回调时，方法签名必须写成 <code>public void start(____ primaryStage)</code>；参数类型写错，<code>@Override</code> 会直接报编译错误。",
      "answer": [
        "Stage"
      ],
      "accept": [
        "Stage primaryStage",
        "javafx.stage.Stage",
        "stage",
        "STAGE"
      ],
      "explain": "start 的签名是 <code>public void start(Stage primaryStage)</code>：参数类型是 <code>javafx.stage.Stage</code>，返回 void。它由 launch 在 JavaFX 应用线程上回调，参数是框架新建的 primary Stage，你只管往这个 Stage 上装 Scene 并 show。写成 Scene、Button 或 String 都不是重写，@Override 会报\"方法未覆盖父类\"——这是编译器帮你抓签名错误的标准姿势。",
      "hint": "参数是\"窗口\"那个类型。"
    },
    {
      "id": "ch09-t8",
      "ch": "ch09",
      "kp": "ch09-2",
      "type": "fill",
      "difficulty": 3,
      "tags": [
        "trap",
        "javafx"
      ],
      "stem": "<code>new Scene(root, 300, 200)</code> 里的 300×200 指的是窗口的 ____ 大小；窗口实际还会多出标题栏和边框。",
      "answer": [
        "内容区"
      ],
      "accept": [
        "内容",
        "内容区域",
        "内容面板"
      ],
      "explain": "Scene 的宽高描述的是\"内容区\"，也就是放节点的那块区域，不含标题栏和边框——那两部分由操作系统的窗口管理器画。所以给 Stage 设 <code>setWidth(300)</code> 会发现内容区比 300 窄；反过来只给 Scene 定尺寸，窗口会自动包住内容。写\"窗口正好装下棋盘\"这类需求时，先想清楚说的是哪一个尺寸。",
      "hint": "标题栏和边框不算在 Scene 里。"
    },
    {
      "id": "ch09-t9",
      "ch": "ch09",
      "kp": "ch09-4",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "javafx"
      ],
      "stem": "下面程序启动后，点击窗口中间的按钮，控制台打印什么？（只写打印出来的那一行）",
      "code": "public class HelloFX extends Application {\n    @Override\n    public void start(Stage primaryStage) {\n        Button btn = new Button(\"Say Hello\");\n        StackPane root = new StackPane();\n        root.getChildren().add(btn);\n\n        Scene scene = new Scene(root, 300, 200);\n        primaryStage.setTitle(\"Hello JavaFX\");\n        primaryStage.setScene(scene);\n        primaryStage.show();\n\n        btn.setOnAction(e -> System.out.println(\"Hello, JavaFX!\"));\n    }\n\n    public static void main(String[] args) {\n        launch(args);\n    }\n}",
      "answer": "Hello, JavaFX!",
      "accept": [
        "Hello JavaFX!",
        "Hello, JavaFX",
        "Hello JavaFX"
      ],
      "explain": "六步的最后一步是注册事件：<code>setOnAction</code> 接收一个 EventHandler，lambda 的参数 e 是这次点击产生的事件对象。点击时 JavaFX 在应用线程上调用这个 lambda，执行 println。注意窗口里显示的是按钮的 text（\"Say Hello\"），控制台打印的是 lambda 里写的字符串——两者不是一回事，考试常拿这个设陷阱。",
      "hint": "看 lambda 里 println 的参数，不是按钮上的字。"
    },
    {
      "id": "ch09-t10",
      "ch": "ch09",
      "kp": "ch09-4",
      "type": "predict",
      "difficulty": 3,
      "tags": [
        "output",
        "trap",
        "javafx"
      ],
      "stem": "下面程序运行后，连续点击按钮 3 次，控制台按顺序打印什么？（每行一个数字）",
      "code": "public class ClickCounter extends Application {\n    private int count = 0;\n\n    @Override\n    public void start(Stage stage) {\n        Label label = new Label(\"0\");\n        Button btn = new Button(\"+1\");\n        btn.setOnAction(e -> {\n            count++;\n            label.setText(\"\" + count);\n            System.out.println(count);\n        });\n\n        VBox root = new VBox(8, label, btn);\n        stage.setScene(new Scene(root, 200, 120));\n        stage.show();\n    }\n\n    public static void main(String[] args) {\n        launch(args);\n    }\n}",
      "answer": "1\n2\n3",
      "explain": "事件处理器是\"每点一次执行一次\"，不是启动时执行：第一次点击 count 从 0 变 1 并打印 1，之后是 2、3。count 必须写成字段，不能写成 start 里的局部 int——lambda 只能捕获 effectively final 的局部变量，<code>count++</code> 会直接编译错误。这也解释了为什么计数器、场景引用这类\"处理器要改的状态\"都做成字段。",
      "hint": "三个数字，从 1 开始；处理器每次点击才跑。"
    },
    {
      "id": "ch09-t11",
      "ch": "ch09",
      "kp": "ch09-2",
      "type": "multi",
      "difficulty": 2,
      "tags": [
        "concept",
        "javafx"
      ],
      "stem": "下列哪些是 JavaFX 场景图里的 <code>Node</code>？（多选）",
      "options": [
        {
          "text": "<code>Button</code>",
          "correct": true
        },
        {
          "text": "<code>VBox</code>",
          "correct": true
        },
        {
          "text": "<code>Scene</code>"
        },
        {
          "text": "<code>Stage</code>"
        }
      ],
      "explain": "判据是\"能不能被放进场景图、能不能被父容器 add\"：Button 是控件、VBox 是布局容器，两者都继承自 Node，都能当 root 或被 add 进别的布局。Scene 是内容容器，它持有 root，但在场景图之上；Stage 是窗口，又在 Scene 之上。三层的层次是 Stage 包住 Scene、Scene 包住场景图，别把\"容器\"和\"节点\"混成一类。",
      "hint": "布局能当 root，而 root 必须是 Node。"
    },
    {
      "id": "ch09-t12",
      "ch": "ch09",
      "kp": "ch09-4",
      "type": "order",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam",
        "javafx"
      ],
      "stem": "按讲义\"六步\"的顺序（先建控件，最后挂事件），把下面几行代码排好序。",
      "options": [
        {
          "text": "<code>primaryStage.show();</code>"
        },
        {
          "text": "<code>Button btn = new Button(\"Say Hello\");</code>"
        },
        {
          "text": "<code>Scene scene = new Scene(root, 300, 200);</code>"
        },
        {
          "text": "<code>StackPane root = new StackPane(); root.getChildren().add(btn);</code>"
        },
        {
          "text": "<code>primaryStage.setTitle(\"Hello JavaFX\"); primaryStage.setScene(scene);</code>"
        },
        {
          "text": "<code>btn.setOnAction(e -> System.out.println(\"Hello\"));</code>"
        }
      ],
      "answer": [
        1,
        3,
        2,
        4,
        0,
        5
      ],
      "explain": "六步是\"从里往外\"：先创建控件，再创建布局并把控件 add 进去（得到 root），然后 <code>new Scene(root, w, h)</code>——Scene 的构造器需要 root；接着 setTitle 与 setScene 准备 Stage，再 show() 让窗口出现，最后给按钮注册事件。顺序背后的依赖是：Scene 需要 root，setScene 需要 Scene，show 需要 Stage 已经有内容。",
      "hint": "Scene 需要 root；show 之前必须先 setScene。"
    },
    {
      "id": "ch09-f1",
      "ch": "ch09",
      "kp": "ch09-4",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "bug",
        "javafx",
        "exam"
      ],
      "stem": "下面程序运行后窗口能出现，但窗口里是空的，按钮完全看不到。找出错误并说明改法。",
      "code": "public class HelloFX extends Application {\n    @Override\n    public void start(Stage primaryStage) {\n        Button btn = new Button(\"Say Hello\");\n        StackPane root = new StackPane();\n\n        Scene scene = new Scene(root, 300, 200);\n        primaryStage.setTitle(\"Hello JavaFX\");\n        primaryStage.setScene(scene);\n        primaryStage.show();\n    }\n\n    public static void main(String[] args) {\n        launch(args);\n    }\n}",
      "accept": [
        {
          "hint": "指出按钮没有加进布局，不在场景图上",
          "any": [
            "没有加",
            "没加",
            "没有添加",
            "没添加",
            "忘了加",
            "忘记加",
            "加进",
            "不在场景图",
            "没有放进",
            "没放进",
            "没有加入",
            "没加入",
            "看不到",
            "不显示",
            "没显示",
            "空白"
          ]
        },
        {
          "hint": "给出改法：root.getChildren().add(btn)",
          "any": [
            "getChildren().add",
            "root.getChildren",
            "add(btn)",
            "addAll(btn",
            "加进布局",
            "加进root",
            "add进",
            "加到"
          ]
        }
      ],
      "minHits": 2,
      "answer": "Button 创建后没有加进布局，应在 new Scene 之前补上 root.getChildren().add(btn);",
      "explain": "控件 new 出来只是内存里的对象，必须成为场景图的一部分才会被渲染。这里 StackPane 是空的，Scene 里没有按钮，窗口自然空白。补一句 <code>root.getChildren().add(btn)</code> 即可。判断思路：窗口出现说明 setScene 和 show 都对，问题只能出在\"内容没进场景图\"这一层——遇到\"窗口有了但控件不见\"，先查 add。",
      "hint": "窗口出现了，说明 Stage 和 Scene 都没错；那就查控件进没进 root。"
    },
    {
      "id": "ch10-q1",
      "ch": "ch10",
      "kp": "ch10-1",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "javafx"
      ],
      "stem": "界面上要显示一行只读的提示文字（例如 \"Score: 0\"），应该用哪个控件？",
      "options": [
        {
          "text": "<code>TextArea</code>"
        },
        {
          "text": "<code>Button</code>"
        },
        {
          "text": "<code>Label</code>",
          "correct": true
        },
        {
          "text": "<code>TextField</code>"
        }
      ],
      "explain": "<code>Label</code> 用来在屏幕上定义一行简单文本，是只读的显示件；<code>TextField</code> 是给用户输入的单行输入框（有光标、可编辑），虽然也有 setText，但语义是输入；<code>TextArea</code> 是多行输入；<code>Button</code> 是可点击的按钮。读文字用 getText()，改显示用 setText()，控件选错语义就错了。",
      "hint": "区分\"显示\"和\"输入\"：谁是给用户打字的？"
    },
    {
      "id": "ch10-q2",
      "ch": "ch10",
      "kp": "ch10-5",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "output",
        "trap",
        "javafx"
      ],
      "stem": "下面代码搭出来的表单是什么样子？",
      "code": "GridPane grid = new GridPane();\ngrid.setHgap(10);\ngrid.setVgap(10);\n\ngrid.add(new Label(\"Name:\"), 0, 0);\ngrid.add(new TextField(), 1, 0);\ngrid.add(new Label(\"Email:\"), 0, 1);\ngrid.add(new TextField(), 1, 1);",
      "options": [
        {
          "text": "四行一列：四个控件从上到下排开"
        },
        {
          "text": "编译错误，因为 <code>add</code> 的参数应该是（节点, 行, 列）"
        },
        {
          "text": "两行两列：第 0 列是两个标签，第 1 列是两个输入框",
          "correct": true
        },
        {
          "text": "两行两列：第 0 行是两个标签，第 1 行是两个输入框"
        }
      ],
      "explain": "<code>add(node, columnIndex, rowIndex)</code> 的第二个参数是列、第三个才是行——先列后行，这是最容易记反的地方。所以 (0,0) 是第 0 列第 0 行、(1,0) 是第 1 列第 0 行，(0,1)、(1,1) 是第二行的两格：标签在左列、输入框在右列，正好是表单。写反了不会报错，只是控件跑到别的位置。",
      "hint": "看每一对数字：第二个是列号，第三个是行号。"
    },
    {
      "id": "ch10-q3",
      "ch": "ch10",
      "kp": "ch10-7",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "concept",
        "exam",
        "javafx"
      ],
      "stem": "要搭一个聊天窗口：顶部一行放标题和设置按钮，中间是随窗口拉伸的消息区，底部一行放输入框和发送按钮。最合适的布局方案是？",
      "options": [
        {
          "text": "根用 <code>StackPane</code>，让三段叠在一起"
        },
        {
          "text": "根用 <code>FlowPane</code>，让三段按窗口宽度自动换行"
        },
        {
          "text": "根用 <code>VBox</code> 把三段竖排；顶部和底部各嵌一个 <code>HBox</code>；消息区用 <code>VBox.setVgrow(msgArea, Priority.ALWAYS)</code> 吃掉多余高度",
          "correct": true
        },
        {
          "text": "根用 <code>HBox</code>，把三段从左到右排开"
        }
      ],
      "explain": "上中下三段是\"一列\"，所以根用 VBox；每一段内部是\"一行\"，用 HBox 嵌套——布局可以嵌套，这就是把大界面拆成小块的方法。窗口变大时想让消息区变高，必须给它 <code>setVgrow(ALWAYS)</code>，否则多余空间不会被分配。StackPane 会把三段叠在同一位置；FlowPane 的换行由宽度决定，都表达不了\"固定三段\"。",
      "hint": "先看整体是\"一行\"还是\"一列\"，再拆每一段。"
    },
    {
      "id": "ch10-t1",
      "ch": "ch10",
      "kp": "ch10-3",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "javafx"
      ],
      "stem": "关于 <code>HBox</code> 与 <code>VBox</code>，下列说法正确的是？",
      "options": [
        {
          "text": "两者都会在排不下时自动换行"
        },
        {
          "text": "两者都会把子节点叠在容器正中央"
        },
        {
          "text": "<code>HBox</code> 按添加顺序把子节点从左到右排成一行；<code>VBox</code> 从上到下排成一列",
          "correct": true
        },
        {
          "text": "<code>HBox</code> 从上到下排成一列；<code>VBox</code> 从左到右排成一行"
        }
      ],
      "explain": "讲义两句话：HBox 把节点排成 single row，VBox 排成 single vertical column，都按 add 的先后顺序。构造参数里的数字是 spacing，例如 <code>new HBox(8)</code> 表示子节点之间留 8 像素。自动换行是 FlowPane 的行为，叠放在中央是 StackPane 的默认行为——四种布局的形状不同，别混。",
      "hint": "H 是 horizontal（水平），V 是 vertical（垂直）。"
    },
    {
      "id": "ch10-t2",
      "ch": "ch10",
      "kp": "ch10-4",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "output",
        "javafx"
      ],
      "stem": "把 20 个按钮加进 <code>FlowPane</code>，再放进一个只有 280 像素宽的窗口。看到的结果是？",
      "code": "FlowPane flow = new FlowPane(8, 8);\nflow.setPrefWrapLength(220);\nfor (int i = 1; i <= 20; i++) {\n    flow.getChildren().add(new Button(\"Btn \" + i));\n}\nstage.setScene(new Scene(flow, 280, 200));\nstage.show();",
      "options": [
        {
          "text": "只显示第一个按钮，其余被丢弃"
        },
        {
          "text": "编译错误：<code>FlowPane</code> 必须先指定行数和列数"
        },
        {
          "text": "按钮按添加顺序排，一行放不下就自动换到下一行，最后排成多行",
          "correct": true
        },
        {
          "text": "20 个按钮全部挤在一行里，超出窗口的部分被裁掉"
        }
      ],
      "explain": "FlowPane 的规则是\"按顺序摆，碰到边界就换行\"（讲义：wrapped at the FlowPane boundary），换行位置由宽度和 prefWrapLength 决定，不需要你告诉它有几列——这正是它适合\"数量不固定\"内容的原因。它不会丢弃子节点，也不需要指定行列；要指定格子的是 GridPane。",
      "hint": "Flow 这个词本身就是\"流动、排到边就换行\"的意思。"
    },
    {
      "id": "ch10-t3",
      "ch": "ch10",
      "kp": "ch10-6",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept",
        "javafx"
      ],
      "stem": "把 <code>Rectangle</code> 和 <code>Label</code> 依次 add 进 <code>StackPane</code>，会看到什么？",
      "options": [
        {
          "text": "两者左右并排，矩形在左、标签在右"
        },
        {
          "text": "只显示矩形，标签被隐藏"
        },
        {
          "text": "两者都居中叠放，标签盖在矩形上面",
          "correct": true
        },
        {
          "text": "矩形盖在标签上面"
        }
      ],
      "explain": "StackPane 把所有子节点叠在同一个位置，后加的盖在先加的上面（讲义：every new node gets placed on top of the previous node），默认对齐是居中。所以先加 Rectangle 再加 Label，标签在上层。要做\"背景图 + 前景文字\"\"棋盘 + 棋子层\"就用它；想让子节点靠左上，用 <code>setAlignment(Pos.TOP_LEFT)</code>。",
      "hint": "后加的在上面，默认居中。"
    },
    {
      "id": "ch10-t4",
      "ch": "ch10",
      "kp": "ch10-8",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "trap",
        "javafx"
      ],
      "stem": "判断：窗口被拉大后，<code>HBox</code> 会自动把多出来的宽度平均分给所有子节点，不需要额外设置。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "HBox 默认只按子节点的 pref 尺寸摆放，多余的宽度留在容器里（表现为右侧空白），不会自动分配。想让某个子节点吃掉剩余宽度，要对它调用 <code>HBox.setHgrow(node, Priority.ALWAYS)</code>；VBox 对应 <code>setVgrow</code> 管高度。不设置 grow 时窗口变大、控件不变大，是\"布局没反应\"的常见原因。",
      "hint": "默认只保证\"排得下\"，多出来的空间要显式分配。"
    },
    {
      "id": "ch10-t5",
      "ch": "ch10",
      "kp": "ch10-5",
      "type": "tf",
      "difficulty": 1,
      "tags": [
        "concept",
        "javafx"
      ],
      "stem": "判断：<code>GridPane</code> 的 <code>setHgap(10)</code> 控制相邻两列之间的水平间距，<code>setVgap(10)</code> 控制相邻两行之间的垂直间距。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "h 代表 horizontal、v 代表 vertical：hgap 是列与列之间的水平空隙，vgap 是行与行之间的垂直空隙，两者都是 GridPane 的属性。注意和 spacing 区分：HBox/VBox 用 spacing 描述\"子节点之间\"，而 padding 描述\"容器边框到内容\"，三者问的是不同的距离。",
      "hint": "h = horizontal，v = vertical。"
    },
    {
      "id": "ch10-t6",
      "ch": "ch10",
      "kp": "ch10-1",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "syntax",
        "javafx"
      ],
      "stem": "读回用户在 <code>TextField</code> 里输入的文字，要调用 <code>tf.____()</code>。",
      "answer": [
        "getText"
      ],
      "accept": [
        "getText()",
        "gettext",
        "GetText"
      ],
      "explain": "TextField 的内容存在 text 属性里：读用 <code>getText()</code>，写用 <code>setText()</code>，而 <code>setPromptText()</code> 设置的是输入框为空时显示的灰色提示，不是真实内容。Label、Button、TextArea 都遵循同一套 get/set 约定，所以\"读用户输入\"永远是 getText。",
      "hint": "读回来当然用 get。"
    },
    {
      "id": "ch10-t7",
      "ch": "ch10",
      "kp": "ch10-8",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "syntax",
        "javafx"
      ],
      "stem": "HBox 里子节点之间的间距可以在构造器里给，也可以调用 <code>box.____(8)</code> 设置；而容器边框到内容的距离要用 <code>setPadding(new Insets(8))</code>。",
      "answer": [
        "setSpacing"
      ],
      "accept": [
        "setSpacing(8)",
        "spacing",
        "setspacing"
      ],
      "explain": "spacing 是子节点之间的距离，padding 是容器边框到内容之间的距离，两者常被混为一谈：<code>new HBox(8)</code> 等价于 <code>box.setSpacing(8)</code>，改的是节点之间；<code>setPadding(new Insets(8))</code> 改的是内容整体往里缩，Insets 的四个参数按上、右、下、左的顺序。想让整块内容离窗口边缘远一点，用 padding，不是 spacing。",
      "hint": "子节点之间叫 spacing，边框到内容叫 padding。"
    },
    {
      "id": "ch10-t8",
      "ch": "ch10",
      "kp": "ch10-8",
      "type": "fill",
      "difficulty": 3,
      "tags": [
        "trap",
        "javafx"
      ],
      "stem": "把 Label 放进 <code>StackPane</code> 后调用 <code>label.setLayoutX(0)</code>，它仍然显示在正中间。原因是布局容器在每次布局时都会重算并覆盖子节点的 layoutX / layoutY；要精确定位，应改用不会自动摆放子节点的 <code>____</code> 布局（填类名）。",
      "answer": [
        "Pane"
      ],
      "accept": [
        "javafx.scene.layout.Pane",
        "Pane 布局",
        "pane"
      ],
      "explain": "StackPane、HBox 这些布局会在每次 layout pass 里重新计算子节点的位置，你设的 layoutX / layoutY 会被覆盖，所以设了也没用。Pane 是\"不自动摆放\"的容器：它不改变子节点的位置，<code>setLayoutX</code> / <code>setLayoutY</code> 才会真正生效，适合做精确定位（例如自己算像素画棋盘）。另一条路是用布局规则表达位置，而不是硬算像素。",
      "hint": "要找的是\"最朴素、什么都不替你摆\"的容器。"
    },
    {
      "id": "ch10-t9",
      "ch": "ch10",
      "kp": "ch10-1",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "javafx"
      ],
      "stem": "下面程序运行后点击 OK 按钮，控制台打印什么？",
      "code": "TextField name = new TextField(\"Ada\");\nCheckBox sound = new CheckBox(\"Sound\");\nsound.setSelected(true);\nButton ok = new Button(\"OK\");\nok.setOnAction(e -> System.out.println(name.getText() + \" \" + sound.isSelected()));\n\nVBox root = new VBox(8, name, sound, ok);\nstage.setScene(new Scene(root, 240, 160));\nstage.show();",
      "answer": "Ada true",
      "accept": [
        "Ada  true"
      ],
      "explain": "<code>new TextField(\"Ada\")</code> 把初始文本设为 Ada，<code>sound.setSelected(true)</code> 把复选框置为选中，所以 getText() 得到 Ada、isSelected() 得到 true，字符串拼接后打印 Ada true。注意字符串加布尔值会调用 String.valueOf，输出的是小写 true，不是 TRUE。",
      "hint": "看两处初始值：输入框里的文字、复选框是否被选中。"
    },
    {
      "id": "ch10-t10",
      "ch": "ch10",
      "kp": "ch10-7",
      "type": "predict",
      "difficulty": 3,
      "tags": [
        "output",
        "trap",
        "javafx"
      ],
      "stem": "下面程序运行后，控制台两行分别打印什么？",
      "code": "Button b = new Button(\"X\");\nHBox left = new HBox(b);\nHBox right = new HBox(b);\n\nSystem.out.println(left.getChildren().size());\nSystem.out.println(right.getChildren().size());",
      "answer": "0\n1",
      "explain": "一个 Node 在场景图里只能有一个父节点。第二次把 b 放进 right 时，JavaFX 会把它从 left 中移走（静默发生，不报错），所以 left 变成空的、right 里有 1 个孩子。要在界面上出现两个一样的按钮，必须 new 两个；\"我明明加了两处怎么只显示一个\"就是这个规则造成的。",
      "hint": "同一个节点不能同时属于两个容器，它被后一个\"抢走\"了。"
    },
    {
      "id": "ch10-t11",
      "ch": "ch10",
      "kp": "ch10-7",
      "type": "multi",
      "difficulty": 2,
      "tags": [
        "concept",
        "javafx"
      ],
      "stem": "下列\"布局 → 典型用途\"的搭配，正确的有？（多选）",
      "options": [
        {
          "text": "<code>GridPane</code>：标签 + 输入框的表单，靠列对齐",
          "correct": true
        },
        {
          "text": "<code>StackPane</code>：背景图 + 前景文字这种图层",
          "correct": true
        },
        {
          "text": "<code>FlowPane</code>：数量不固定、排不下要自动换行的标签云",
          "correct": true
        },
        {
          "text": "<code>VBox</code>：一排按钮从左到右排开"
        },
        {
          "text": "<code>HBox</code>：从上到下的侧边栏"
        }
      ],
      "explain": "选布局先看整体形状：二维对齐用 GridPane（表单最典型），层叠用 StackPane，数量不定、要换行用 FlowPane。D、E 把 HBox 与 VBox 说反了：HBox 才是一行（一排按钮），VBox 才是一列（侧边栏）。同一组控件换一种布局，排列结果完全不同，所以\"先想形状，再选布局\"。",
      "hint": "H 是一行，V 是一列；别被选项里\"一排/从上到下\"的描述骗了。"
    },
    {
      "id": "ch10-t12",
      "ch": "ch10",
      "kp": "ch10-5",
      "type": "order",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam",
        "javafx"
      ],
      "stem": "把\"用 GridPane 搭一个两列表单\"的代码按正确顺序排好。",
      "options": [
        {
          "text": "<code>grid.add(new Label(\"Name:\"), 0, 0);</code>"
        },
        {
          "text": "<code>stage.setScene(new Scene(grid, 340, 190));</code>"
        },
        {
          "text": "<code>GridPane grid = new GridPane();</code>"
        },
        {
          "text": "<code>grid.setHgap(10); grid.setVgap(10); grid.setPadding(new Insets(16));</code>"
        },
        {
          "text": "<code>stage.show();</code>"
        },
        {
          "text": "<code>grid.add(new TextField(), 1, 0);</code>"
        }
      ],
      "answer": [
        2,
        3,
        0,
        5,
        1,
        4
      ],
      "explain": "顺序由依赖决定：先创建 GridPane，才能设置它的 hgap / vgap / padding；再往格子里 add 节点（先标签后输入框，分别是第 0 列与第 1 列）；有了完整的根节点才能 new Scene 并 setScene；最后 show()。先 setScene 再 add 其实也能显示（场景图是活的），但\"先搭好内容，再交给窗口\"更稳，读代码时也不容易漏掉控件。",
      "hint": "先有容器，再有间距和子节点，最后交给 Scene 并 show。"
    },
    {
      "id": "ch10-f1",
      "ch": "ch10",
      "kp": "ch10-2",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "bug",
        "javafx",
        "exam"
      ],
      "stem": "程序想实现\"难度二选一\"，但运行后两个单选按钮可以同时被选中。找出错误并说明改法。",
      "code": "public class LevelDemo extends Application {\n    @Override\n    public void start(Stage stage) {\n        RadioButton easy = new RadioButton(\"Easy\");\n        RadioButton hard = new RadioButton(\"Hard\");\n\n        VBox root = new VBox(8, new Label(\"Level\"), easy, hard);\n        stage.setScene(new Scene(root, 240, 160));\n        stage.show();\n    }\n\n    public static void main(String[] args) {\n        launch(args);\n    }\n}",
      "accept": [
        {
          "hint": "指出两个 RadioButton 没有共享 ToggleGroup",
          "any": [
            "togglegroup",
            "toggle group",
            "没有分组",
            "没有设置互斥",
            "没有放进同一组",
            "没有放到同一组",
            "没有绑定",
            "没有互斥",
            "各自独立"
          ]
        },
        {
          "hint": "给出改法：new ToggleGroup() 后分别 setToggleGroup(group)",
          "any": [
            "settogglegroup",
            "new togglegroup",
            "easy.settogglegroup",
            "hard.settogglegroup",
            "同一个组",
            "togglegroup"
          ]
        }
      ],
      "minHits": 2,
      "answer": "两个 RadioButton 没有共享同一个 ToggleGroup，需 new ToggleGroup() 后分别 setToggleGroup(group)。",
      "explain": "RadioButton 的\"单选\"语义要靠 ToggleGroup 实现：只有共享同一个 ToggleGroup 的按钮才互斥，组里最多一个被选中。不设组时每个按钮各自独立，可以同时选中好几个——这是\"控件没反应\"的经典原因之一。CheckBox 相反，本来就是多选，不需要组。",
      "hint": "单选按钮的互斥不是自动的，需要一个\"组\"把它们绑在一起。"
    },
    {
      "id": "ch11-q1",
      "ch": "ch11",
      "kp": "ch11-2",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "javafx"
      ],
      "stem": "JavaFX 画布（<code>Canvas</code>）与 Shape 使用的坐标系是？",
      "options": [
        {
          "text": "原点在中心，x 向右、y 向上"
        },
        {
          "text": "原点在右上角，x 向左增大，y 向下增大"
        },
        {
          "text": "原点在左上角，x 向右增大，y 向下增大",
          "correct": true
        },
        {
          "text": "原点在左下角，x 向右增大，y 向上增大"
        }
      ],
      "explain": "屏幕坐标系的原点在左上角：x 向右为正、y 向下为正，所以 y 越大越靠下。这与数学课的直角坐标系（y 向上）相反，画\"向上\"的图形时最容易翻车——想往上画就要减小 y。Canvas 和 Shape 用的是同一套坐标系，记住\"左上角起点、y 向下\"这一句就够。",
      "hint": "屏幕的 (0,0) 在哪个角？往下走 y 变大还是变小？"
    },
    {
      "id": "ch11-q2",
      "ch": "ch11",
      "kp": "ch11-6",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "output",
        "javafx"
      ],
      "stem": "画布 300×200，执行 <code>gc.fillRect(0, 0, 300, 40)</code> 后，蓝色矩形出现在哪里？",
      "options": [
        {
          "text": "画布正中央一个 300×40 的矩形"
        },
        {
          "text": "画布底部一条横带"
        },
        {
          "text": "画布顶部一条横带：宽 300、高 40",
          "correct": true
        },
        {
          "text": "画布左侧一条竖带：宽 40、高 300"
        }
      ],
      "explain": "<code>fillRect(x, y, w, h)</code> 的参数是\"左上角 + 宽 + 高\"：左上角在 (0,0)，宽 300 覆盖整幅画布，高 40 只占顶部，所以是顶部横带。记住 Canvas 的 y 轴向下增大，(0,0) 是左上角而不是左下角——用数学坐标的直觉会把它画到底部。",
      "hint": "(0,0) 是左上角，高 40 表示从顶部往下 40 像素。"
    },
    {
      "id": "ch11-q3",
      "ch": "ch11",
      "kp": "ch11-7",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "trap",
        "exam",
        "javafx"
      ],
      "stem": "在画布上画棋盘时，先循环 <code>gc.fillOval</code> 画棋子，再循环 <code>gc.strokeLine</code> 画横竖线。结果是什么？",
      "options": [
        {
          "text": "两者都不显示，因为绘制顺序冲突"
        },
        {
          "text": "JavaFX 会按坐标自动决定谁在上层"
        },
        {
          "text": "线压在棋子上面，棋子被线穿过，看着像破碎的",
          "correct": true
        },
        {
          "text": "棋子盖住线，棋子完整显示"
        }
      ],
      "explain": "绘制顺序就是图层顺序：后画的盖在先画的上面。所以必须先画线、再画棋子，否则线会横穿棋子。讲义里的 Canvas 版棋盘正是这样做的：先循环 strokeLine 画满横竖线，落子时再 fillOval 叠上去。JavaFX 不会按坐标自动排序，顺序完全由你的调用顺序决定。",
      "hint": "后画的盖在先画的上面——想让谁在最上层，就最后画它。"
    },
    {
      "id": "ch11-t1",
      "ch": "ch11",
      "kp": "ch11-3",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "javafx"
      ],
      "stem": "在 Shape（例如 <code>Circle</code>）上，<code>setFill</code> 与 <code>setStroke</code> 的区别是？",
      "options": [
        {
          "text": "两者都只改线宽，颜色由 <code>setStrokeWidth</code> 决定"
        },
        {
          "text": "<code>setFill</code> 只能用于 Canvas，<code>setStroke</code> 只能用于 Shape"
        },
        {
          "text": "<code>setFill</code> 给图形内部上色，<code>setStroke</code> 给轮廓线上色",
          "correct": true
        },
        {
          "text": "<code>setFill</code> 给轮廓线上色，<code>setStroke</code> 给内部上色"
        }
      ],
      "explain": "讲义的定义只有一句：stroke 用来画 outlines（轮廓），fill 用来涂 interiors（内部）。两者互相独立：可以只填充、只描边（把 fill 设成 <code>Color.TRANSPARENT</code>），也可以同时设置。线宽由 <code>setStrokeWidth</code> 控制，那是粗细问题，与颜色是两件事。",
      "hint": "fill 是\"灌满\"，stroke 是\"描边\"。"
    },
    {
      "id": "ch11-t2",
      "ch": "ch11",
      "kp": "ch11-1",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam",
        "javafx"
      ],
      "stem": "关于 <code>Line</code>、<code>Rectangle</code>、<code>Circle</code>、<code>Polygon</code> 这四个类，下列说法正确的是？",
      "options": [
        {
          "text": "都在 <code>javafx.scene.layout</code> 包里，属于布局"
        },
        {
          "text": "都在 <code>javafx.stage</code> 包里，属于窗口"
        },
        {
          "text": "都在 <code>javafx.scene.shape</code> 包里，而且都是 <code>Node</code>，可以直接放进布局",
          "correct": true
        },
        {
          "text": "都在 <code>javafx.scene.control</code> 包里，属于控件"
        }
      ],
      "explain": "讲义原话：all these classes reside in the <code>javafx.scene.shape</code> package。它们共同的父类是 <code>Shape</code>，而 Shape 继承自 Node，所以这些图形能放进 HBox、Pane、StackPane，也能被事件命中、能改样式。控件在 control 包、布局在 layout 包、窗口在 stage 包，别记串。",
      "hint": "类名里带 shape 的那个包。"
    },
    {
      "id": "ch11-t3",
      "ch": "ch11",
      "kp": "ch11-4",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept",
        "javafx"
      ],
      "stem": "把 <code>new Canvas(300, 200)</code> 放进窗口，然后把窗口从 300 像素拉宽到 900 像素。画布会怎样？",
      "options": [
        {
          "text": "自动变成 900 宽，内容保持原大小居中"
        },
        {
          "text": "抛出异常，因为 <code>Canvas</code> 不支持窗口缩放"
        },
        {
          "text": "画布仍是 300×200，右侧露出空白，除非手动改宽并重画",
          "correct": true
        },
        {
          "text": "自动变成 900 宽，并把原内容按比例拉伸"
        }
      ],
      "explain": "Canvas 的宽高在构造时定死，它是一张固定大小的位图，布局不会替它缩放或重绘。窗口变大只会让外层容器多出空白，画布本身不变。要适配窗口，得自己根据新尺寸重建 Canvas 或重设宽高，然后整块重画——这也是棋盘用 Canvas 时通常直接固定尺寸的原因。",
      "hint": "Canvas 是\"一张定尺寸的纸\"，纸不会跟着窗口长大。"
    },
    {
      "id": "ch11-t4",
      "ch": "ch11",
      "kp": "ch11-3",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "trap",
        "javafx"
      ],
      "stem": "判断：<code>Shape</code> 的 fill 默认是黑色、stroke 默认是 null（不描边），所以只 <code>new Rectangle(...)</code> 会得到一个黑色实心矩形。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "Shape 的默认样式就是\"填充黑色、不描边\"：stroke 为 null 意味着没有轮廓线可画，fill 为黑色意味着内部被涂满。想要只有轮廓的矩形，要 <code>setFill(Color.TRANSPARENT)</code> 并 <code>setStroke(...)</code>。注意 GraphicsContext 的默认值不同——讲义说它的 setStroke 与 setFill 默认都是黑色。",
      "hint": "什么都没设时，图形是实心黑块还是空心框？"
    },
    {
      "id": "ch11-t5",
      "ch": "ch11",
      "kp": "ch11-4",
      "type": "tf",
      "difficulty": 1,
      "tags": [
        "trap",
        "javafx"
      ],
      "stem": "判断：用 <code>gc.fillOval</code> 画在 Canvas 上的圆是场景图里的 <code>Node</code>，可以单独给它注册 <code>setOnMouseClicked</code>。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "Canvas 本身是 Node，但画在它上面的线、圆、文字不是节点——它们只是像素，没有身份、不能单独挂事件、也不能单独改样式。所以 Canvas 版棋盘要判断\"点到了哪一格\"，只能靠鼠标坐标反算行列；想让每个棋子单独响应，就得用 Circle 这类 Shape 节点，而不是 Canvas。",
      "hint": "Canvas 是纸，画上去的痕迹不是节点。"
    },
    {
      "id": "ch11-t6",
      "ch": "ch11",
      "kp": "ch11-5",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "syntax",
        "javafx"
      ],
      "stem": "用路径画线时，先 <code>gc.____(x1, y1)</code> 把笔移到起点，再 <code>lineTo(x2, y2)</code> 加线段，最后 <code>stroke()</code> 描出来。",
      "answer": [
        "moveTo"
      ],
      "accept": [
        "moveTo()",
        "gc.moveTo",
        "moveto"
      ],
      "explain": "四步要能默写：<code>beginPath()</code> 开始一条新路径，<code>moveTo(x, y)</code> 把笔移到起点，<code>lineTo(x, y)</code> 从当前点画直线到新点（可连续调用成折线），<code>stroke()</code> 才按当前描边颜色和线宽真正落笔。moveTo 与 lineTo 只是在描述路径，不调用 stroke 画布上什么也没有。",
      "hint": "\"移动到起点\"对应的英文就是 move。"
    },
    {
      "id": "ch11-t7",
      "ch": "ch11",
      "kp": "ch11-6",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "syntax",
        "javafx"
      ],
      "stem": "在画布上写一行文字，用 <code>gc.____(\"Score: 0\", 20, 40)</code>。",
      "answer": [
        "fillText"
      ],
      "accept": [
        "fillText()",
        "gc.fillText",
        "filltext"
      ],
      "explain": "文字用 <code>fillText(text, x, y)</code>：第一个参数是内容，(x, y) 是文字的基准点（大致在左下角），不是左上角——所以 y 给 40 表示文字基线下移 40 像素。写之前通常先 <code>setFill</code> 设颜色、<code>setFont</code> 设字号。想画空心文字可以用 strokeText，但课程示例用的是 fillText。",
      "hint": "fill 系列负责\"涂内部\"，文字也是\"填\"出来的。"
    },
    {
      "id": "ch11-t8",
      "ch": "ch11",
      "kp": "ch11-2",
      "type": "fill",
      "difficulty": 3,
      "tags": [
        "trap",
        "javafx"
      ],
      "stem": "画布 400×300，要画一个边长 100 的实心方块并让它居中，应调用 <code>gc.fillRect(____, 100, 100, 100)</code>。",
      "answer": [
        "150"
      ],
      "accept": [
        "150.0",
        "x=150"
      ],
      "explain": "居中意味着左右、上下留白相等：x = (400 − 100) / 2 = 150，y = (300 − 100) / 2 = 100，所以第一个参数是 150。<code>fillRect(x, y, w, h)</code> 的参数是\"左上角 + 宽 + 高\"，不是中心点；把它当成中心坐标去算，结果会整体偏右下半个方块。",
      "hint": "(画布宽 − 方块宽) ÷ 2。"
    },
    {
      "id": "ch11-t9",
      "ch": "ch11",
      "kp": "ch11-4",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "javafx"
      ],
      "stem": "下面程序运行后，控制台两行分别打印什么？",
      "code": "Canvas canvas = new Canvas(300, 200);\nGraphicsContext gc = canvas.getGraphicsContext2D();\ngc.fillRect(0, 0, 500, 500);\n\nSystem.out.println(canvas.getWidth());\nSystem.out.println(canvas.getHeight());",
      "answer": "300.0\n200.0",
      "explain": "Canvas 的宽高在构造时确定，getWidth / getHeight 返回 double，所以打印 300.0 和 200.0。fillRect 画得比画布大也没用——讲义明确说所有绘制操作都被裁剪在画布边界内，超出部分不显示，也不会把画布\"撑大\"。想改尺寸只能重设 width/height（会清空画布）或重建 Canvas。",
      "hint": "画得再大也不会改变画布本身的尺寸；注意 getWidth 返回 double。"
    },
    {
      "id": "ch11-t10",
      "ch": "ch11",
      "kp": "ch11-2",
      "type": "predict",
      "difficulty": 3,
      "tags": [
        "output",
        "trap",
        "javafx"
      ],
      "stem": "下面程序运行后，控制台打印什么？",
      "code": "Canvas canvas = new Canvas(400, 300);\nGraphicsContext gc = canvas.getGraphicsContext2D();\n\nint size = 60;\ndouble x = (canvas.getWidth() - size) / 2;\ndouble y = (canvas.getHeight() - size) / 2;\ngc.fillOval(x, y, size, size);\n\nSystem.out.println(x + \",\" + y);",
      "answer": "170.0,120.0",
      "accept": [
        "170.0, 120.0",
        "170,120"
      ],
      "explain": "画布 400×300，要让边长 60 的圆居中：x = (400 − 60) / 2 = 170，y = (300 − 60) / 2 = 120，两个都是 double，打印成 170.0,120.0。关键是记住 <code>fillOval(x, y, w, h)</code> 的 (x, y) 是外接矩形左上角，不是圆心；圆心在 (x + 30, y + 30) = (200, 150)。",
      "hint": "先算左上角，再注意 double 的打印格式。"
    },
    {
      "id": "ch11-t11",
      "ch": "ch11",
      "kp": "ch11-4",
      "type": "multi",
      "difficulty": 2,
      "tags": [
        "concept",
        "javafx"
      ],
      "stem": "关于 <code>Canvas</code> 与 <code>GraphicsContext</code>，下列说法正确的有？（多选）",
      "options": [
        {
          "text": "<code>new Canvas(300, 200)</code> 创建一块 300×200 的画布，宽高在构造时确定",
          "correct": true
        },
        {
          "text": "<code>canvas.getGraphicsContext2D()</code> 返回与这块画布关联的 <code>GraphicsContext</code>（画笔）",
          "correct": true
        },
        {
          "text": "所有绘制操作都被裁剪在画布边界内，画出界的部分不会显示",
          "correct": true
        },
        {
          "text": "<code>gc.strokeRect(x, y, w, h)</code> 画的是矩形轮廓，参数是左上角坐标加宽高",
          "correct": true
        },
        {
          "text": "<code>Canvas</code> 在 <code>javafx.scene.control</code> 包里，属于控件"
        },
        {
          "text": "调用 <code>gc.fillRect</code> 会把画布尺寸自动改成窗口大小"
        }
      ],
      "explain": "讲义给了 Canvas 三条定义：有指定宽高、绘制被裁剪在边界内、通过 <code>getGraphicsContext2D()</code> 拿到 GraphicsContext。strokeRect 与 fillRect 参数完全一样（左上角 + 宽 + 高），区别只是画轮廓还是涂内部。Canvas 在 <code>javafx.scene.canvas</code> 包里（不是 control），它本身是 Node，但不会随窗口自动缩放；画在上面的图形只是像素，不是节点。",
      "hint": "Canvas 是纸、GraphicsContext 是笔；纸的尺寸固定、画不出界。"
    },
    {
      "id": "ch11-t12",
      "ch": "ch11",
      "kp": "ch11-5",
      "type": "order",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam",
        "javafx"
      ],
      "stem": "把\"在 Canvas 上画一条斜线\"的代码按正确执行顺序排好。",
      "options": [
        {
          "text": "<code>gc.stroke();</code>"
        },
        {
          "text": "<code>Canvas canvas = new Canvas(300, 200);</code>"
        },
        {
          "text": "<code>gc.moveTo(20, 20); gc.lineTo(280, 180);</code>"
        },
        {
          "text": "<code>GraphicsContext gc = canvas.getGraphicsContext2D();</code>"
        },
        {
          "text": "<code>gc.beginPath();</code>"
        }
      ],
      "answer": [
        1,
        3,
        4,
        2,
        0
      ],
      "explain": "依赖顺序很清楚：先有 Canvas 才能拿到 GraphicsContext；拿到画笔后 <code>beginPath()</code> 开始一条新路径，才能 <code>moveTo</code> 定起点、<code>lineTo</code> 加线段；路径描述完最后 <code>stroke()</code> 才真正描到画布上。少了 stroke，前面几行只是\"记下了这条路径\"，屏幕上什么也没有。",
      "hint": "先有画布才有画笔；先有路径才谈得上描边。"
    },
    {
      "id": "ch11-f1",
      "ch": "ch11",
      "kp": "ch11-7",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "bug",
        "javafx",
        "exam"
      ],
      "stem": "下面方法被动画每帧调用一次，想让小球向右移动。但运行时球后面拖着一条越来越长的红带。找出错误并说明改法。",
      "code": "public void redraw(double x) {\n    GraphicsContext gc = canvas.getGraphicsContext2D();\n    gc.setFill(Color.RED);\n    gc.fillOval(x, 90, 20, 20);\n}",
      "accept": [
        {
          "hint": "指出每帧重画前没有清空画布，旧帧留在位图上",
          "any": [
            "没有清空",
            "没清空",
            "没有清除",
            "没清除",
            "没有擦",
            "清空",
            "擦除",
            "残留",
            "拖影",
            "轨迹",
            "没有clearrect",
            "没clearrect"
          ]
        },
        {
          "hint": "改法：重画前 gc.clearRect(0, 0, canvas.getWidth(), canvas.getHeight())",
          "any": [
            "clearrect",
            "清空画布",
            "先清空",
            "擦掉旧",
            "每帧清空"
          ]
        }
      ],
      "minHits": 2,
      "answer": "每帧重画前没有清空画布，旧帧残留在位图上；应在 fillOval 之前调用 gc.clearRect(0, 0, canvas.getWidth(), canvas.getHeight())。",
      "explain": "Canvas 是累积的像素画布：fillOval 只往上叠，不会自动擦掉上一帧。每帧都画在新位置，旧位置的圆留在画布上，连起来就是\"拖影/轨迹\"。clearRect 用透明色擦掉一块，动画每帧开头先擦整块再画当前帧。注意 clearRect 之后画笔状态（颜色、线宽）仍然保留，不必重设。",
      "hint": "球只在新位置画，旧位置的圆是谁留下来的？"
    },
    {
      "id": "ch12-q1",
      "ch": "ch12",
      "kp": "ch12-3",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "javafx"
      ],
      "stem": "要让一个按钮在被点击时执行一段代码，标准写法是？",
      "options": [
        {
          "text": "<code>btn.addAction(\"clicked\");</code>"
        },
        {
          "text": "<code>btn.setAction(\"clicked\");</code>"
        },
        {
          "text": "<code>btn.setOnAction(e -> System.out.println(\"clicked\"));</code>",
          "correct": true
        },
        {
          "text": "<code>btn.onClick(e -> System.out.println(\"clicked\"));</code>"
        }
      ],
      "explain": "Node 有一系列事件处理器属性，用 <code>setOnXxx</code> 把 EventHandler 挂上去，按钮点击对应 <code>setOnAction</code>（onAction 属性）。onClick、addAction、setAction 都不是 JavaFX 的 API。另一种注册方式是 <code>addEventHandler(EventType, handler)</code>，它能给同一节点挂多个处理器，而 setOnAction 是属性、再设会覆盖。",
      "hint": "方法名是 setOn + 事件名（Action）。"
    },
    {
      "id": "ch12-q2",
      "ch": "ch12",
      "kp": "ch12-2",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam",
        "javafx"
      ],
      "stem": "讲义的事件例子里，一个 <code>Circle</code> 上放着 Stop 和 Play 两个按钮。用户点击 Play 按钮时，这次事件的<b>事件源（Event Source）</b>是？",
      "options": [
        {
          "text": "装着按钮和圆形的容器"
        },
        {
          "text": "整个 <code>Stage</code> 窗口"
        },
        {
          "text": "Play 按钮",
          "correct": true
        },
        {
          "text": "那个 <code>Circle</code>"
        }
      ],
      "explain": "事件源是\"产生事件的组件\"：用户点的是 Play 按钮，所以 source 就是 Play 按钮；这次的事件对象是 <code>MouseEvent</code>（点击属于鼠标事件），handler 是你注册的那个方法。source 回答\"谁产生的\"，不是\"谁接收的\"——把 source 和 target 混为一谈是最常见的失分点。四要素里 Object 携带信息、Handler 负责处理，各管一件事。",
      "hint": "source 是\"谁产生的\"，不是\"谁接收的\"。"
    },
    {
      "id": "ch12-q3",
      "ch": "ch12",
      "kp": "ch12-4",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "concept",
        "exam",
        "javafx"
      ],
      "stem": "要在 <code>Canvas</code> 上实现\"点击落子\"，先拿到点击位置再换算成行列。正确做法是？",
      "options": [
        {
          "text": "用 <code>canvas.setOnKeyPressed(e -> ...)</code>，处理器里读 <code>e.getX()</code> / <code>e.getY()</code>"
        },
        {
          "text": "用 <code>setOnMouseClicked</code>，但必须读 <code>e.getSceneX()</code> / <code>e.getSceneY()</code> 才是相对画布的坐标"
        },
        {
          "text": "用 <code>canvas.setOnMouseClicked(e -> ...)</code>，处理器里读 <code>e.getX()</code> / <code>e.getY()</code>",
          "correct": true
        },
        {
          "text": "用 <code>canvas.setOnAction(e -> ...)</code>，处理器里读 <code>e.getX()</code> / <code>e.getY()</code>"
        }
      ],
      "explain": "Canvas 是 Node，鼠标点击要注册 <code>setOnMouseClicked</code>，参数是 MouseEvent，它的 <code>getX()</code> / <code>getY()</code> 是相对事件源节点（画布）的坐标，正好用来除以格子边长反算行列。setOnAction 是动作事件（按钮、菜单项），参数是 ActionEvent，没有坐标；KeyEvent 也没有 getX。getSceneX / getSceneY 相对整个场景，画布不在 (0,0) 时就会偏。",
      "hint": "点击是鼠标事件；要\"相对画布\"的坐标，看 getX 还是 getSceneX？"
    },
    {
      "id": "ch12-t1",
      "ch": "ch12",
      "kp": "ch12-1",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "javafx"
      ],
      "stem": "用 <code>btn.setOnAction(...)</code> 注册处理器时，处理器参数 <code>e</code> 的类型是？",
      "options": [
        {
          "text": "<code>KeyEvent</code>"
        },
        {
          "text": "<code>EventHandler</code>"
        },
        {
          "text": "<code>ActionEvent</code>",
          "correct": true
        },
        {
          "text": "<code>MouseEvent</code>"
        }
      ],
      "explain": "setOnAction 要的是一个处理 <code>ActionEvent</code> 的 EventHandler，所以 e 是 ActionEvent。点按钮虽然也涉及鼠标动作，但 setOnAction 这条线传的是\"动作事件\"；鼠标坐标要用 setOnMouseClicked 的 MouseEvent，键盘要用 setOnKeyPressed 的 KeyEvent。EventHandler 是接口名，不是事件类型。",
      "hint": "动作事件（Action）对应哪个类？"
    },
    {
      "id": "ch12-t2",
      "ch": "ch12",
      "kp": "ch12-6",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam",
        "javafx"
      ],
      "stem": "同一个 <code>EventHandler</code> 注册给 OK 和 Cancel 两个按钮，处理器里怎么知道点的是哪个？",
      "options": [
        {
          "text": "用 <code>e.getSource()</code> 拿到事件源，转型成 <code>Button</code> 后调 <code>getText()</code>",
          "correct": true
        },
        {
          "text": "在 lambda 里用 <code>this</code> 判断，因为 <code>this</code> 就是被点的按钮"
        },
        {
          "text": "必须给每个按钮各写一个处理器，共享的处理器无法区分"
        },
        {
          "text": "用 <code>e.getTarget()</code> 判断，因为它返回产生事件的组件"
        }
      ],
      "explain": "讲义原话：一个 handler 可以注册给多个节点，The event source is discriminated in the handle() method。<code>getSource()</code> 返回产生事件的组件，转型后调 getText() 就能分辨。lambda 里的 this 指向外层 Application 对象，不是按钮；共享 handler 正是讲义强调的能力。D 错在把\"事件目标\"当成\"事件源\"：target 是接收事件的节点，source 才是产生事件的组件。",
      "hint": "source 是\"谁产生的\"，target 是\"谁接收的\"。"
    },
    {
      "id": "ch12-t3",
      "ch": "ch12",
      "kp": "ch12-3",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "trap",
        "javafx"
      ],
      "stem": "给同一个按钮连续调用两次 <code>setOnAction</code>，各挂一个不同的处理器。点击按钮时？",
      "options": [
        {
          "text": "两个都执行，后设的先执行"
        },
        {
          "text": "编译错误，<code>setOnAction</code> 只能调用一次"
        },
        {
          "text": "只有第二次设置的那个执行，第一次的被覆盖了",
          "correct": true
        },
        {
          "text": "两个都执行，先设的先执行"
        }
      ],
      "explain": "setOnAction 设置的是节点的 onAction 属性，再设一次是覆盖而不是追加，所以只有最后一个生效。要在一个节点上挂多个处理器，用 <code>addEventHandler(EventType, handler)</code>。这条\"属性 vs 追加\"的区别是本章最容易踩的坑：看到\"我设了两个怎么只有一个生效\"，先想是不是用了两次 setOnAction。",
      "hint": "set 是\"设置\"还是\"添加\"？"
    },
    {
      "id": "ch12-t4",
      "ch": "ch12",
      "kp": "ch12-5",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "concept",
        "javafx"
      ],
      "stem": "判断：只要 <code>onClick</code> 的签名是 <code>void onClick(ActionEvent e)</code>，<code>btn.setOnAction(this::onClick)</code> 与写一个等价的 lambda 效果相同。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "EventHandler 是函数式接口（只有一个抽象方法 handle），lambda、方法引用、匿名内部类都是它的实现方式：this::onClick 就是把当前对象的 onClick 方法当作 handle。方法引用的前提是签名匹配——参数类型和个数对得上，否则编译不过。三种写法编译后都是\"一个实现了 EventHandler 的对象\"，区别只在可读性。",
      "hint": "函数式接口可以用 lambda，也可以用方法引用。"
    },
    {
      "id": "ch12-t5",
      "ch": "ch12",
      "kp": "ch12-4",
      "type": "tf",
      "difficulty": 1,
      "tags": [
        "trap",
        "javafx"
      ],
      "stem": "判断：键盘事件只能注册在 <code>Button</code> 上，注册到 <code>Scene</code> 上不会生效。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "键盘事件的前提是节点有焦点（focus）：按钮、输入框天然有，普通 Canvas / Pane 默认没有，所以按键监听常注册在 Scene 上——它总能收到键盘事件。<code>setOnKeyPressed</code> 在节点和 Scene 上都能用，注册在 Scene 上不仅生效，还是课程示例里的推荐做法（例如用方向键移动棋子）。",
      "hint": "谁\"总能收到\"键盘事件？想想焦点。"
    },
    {
      "id": "ch12-t6",
      "ch": "ch12",
      "kp": "ch12-7",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "syntax",
        "javafx"
      ],
      "stem": "在事件处理器里调用 <code>e.____()</code>，可以把事件标记为\"已处理\"，让它不再继续传播给后面的处理器。",
      "answer": [
        "consume"
      ],
      "accept": [
        "consume()",
        "e.consume",
        "Consume"
      ],
      "explain": "consume 是 Event 的方法：一旦调用，事件被标记为已消费，捕获/冒泡链上后续的 filter 与 handler 都不会再收到它。典型用途是\"子节点处理完点击后，不想让父容器也响应\"，或者在 filter 里统一拦截某类事件。它不改变事件对象里携带的数据，只影响传播。",
      "hint": "\"消费掉\"这个事件，英文是 consume。"
    },
    {
      "id": "ch12-t7",
      "ch": "ch12",
      "kp": "ch12-7",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "syntax",
        "javafx"
      ],
      "stem": "想让父容器在捕获阶段先看到事件，用 <code>root.addEvent____(MouseEvent.MOUSE_CLICKED, e -> ...)</code> 注册（填 Filter 或 Handler）。",
      "answer": [
        "Filter"
      ],
      "accept": [
        "addEventFilter",
        "EventFilter",
        "filter"
      ],
      "explain": "addEventFilter 注册的处理器在捕获阶段执行（从根往目标），addEventHandler 注册的在冒泡阶段执行（从目标往根）。同一节点上 filter 先于 handler；跨节点时父节点的 filter 甚至早于目标节点的 handler。所以\"想在别人之前拦截\"就用 filter，普通业务逻辑用 handler。",
      "hint": "捕获阶段 = 从外往里\"筛\"一遍。"
    },
    {
      "id": "ch12-t8",
      "ch": "ch12",
      "kp": "ch12-8",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "concept",
        "javafx"
      ],
      "stem": "把控制台版的 <code>while (!gameOver) { … }</code> 改写成 JavaFX 事件驱动版时，循环体变成事件处理器，而循环条件 <code>gameOver</code> 要变成类的 ____，让多次事件之间共享同一个状态。",
      "answer": [
        "字段"
      ],
      "accept": [
        "成员变量",
        "属性",
        "field",
        "成员字段",
        "类的字段"
      ],
      "explain": "事件驱动版没有那个 while 循环：start() 里画一次界面，之后每次点击由处理器接管。gameOver、currentPlayer 这些\"跨多次事件要保留\"的状态必须从局部变量升级成字段，否则每次回调都是新的局部变量、状态丢失。判据：凡是处理器要读、要改，并且下次事件还要用的变量，都做成字段。",
      "hint": "局部变量活不过一次方法调用，那状态该放哪？"
    },
    {
      "id": "ch12-t9",
      "ch": "ch12",
      "kp": "ch12-3",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "javafx"
      ],
      "stem": "下面程序启动后，依次点击 Play、Stop、Play 三个按钮，控制台按顺序打印什么？（每行一句）",
      "code": "Button play = new Button(\"Play\");\nButton stop = new Button(\"Stop\");\n\nplay.setOnAction(e -> System.out.println(\"play clicked\"));\nstop.setOnAction(e -> System.out.println(\"stop clicked\"));\n\nHBox root = new HBox(8, play, stop);\nstage.setScene(new Scene(root, 240, 120));\nstage.show();",
      "answer": "play clicked\nstop clicked\nplay clicked",
      "explain": "每个按钮各自注册了处理器，点谁就执行谁的那一句：setOnAction 的处理器只在对应按钮被点击时调用，不会\"点一个按钮所有按钮都响应\"。输出顺序就是点击顺序。注意窗口里显示的是按钮的 text（Play / Stop），打印的是 lambda 里写的字符串，两者不是一回事。",
      "hint": "点击顺序就是打印顺序；看每个 lambda 里写的是哪一句。"
    },
    {
      "id": "ch12-t10",
      "ch": "ch12",
      "kp": "ch12-4",
      "type": "predict",
      "difficulty": 3,
      "tags": [
        "output",
        "trap",
        "javafx"
      ],
      "stem": "画布每格 40 像素，原点在画布左上角。用户在画布内相对左上角 (95, 45) 的位置点了一下，控制台打印什么？",
      "code": "canvas.setOnMouseClicked(e -> {\n    int col = (int) (e.getX() / 40);\n    int row = (int) (e.getY() / 40);\n    System.out.println(row + \",\" + col);\n});",
      "answer": "1,2",
      "explain": "getX / getY 是相对事件源节点（画布）的坐标：col = (int)(95 / 40) = 2，row = (int)(45 / 40) = 1，按 row,col 的顺序打印 1,2。整数除法会截断小数，95/40 = 2.375 取 2，这正是\"像素坐标 → 行列号\"的换算方式；打印时把 row 和 col 写反就会变成 2,1。",
      "hint": "先各自除以格子边长再取整，最后注意打印的是 row 还是 col 在前。"
    },
    {
      "id": "ch12-t11",
      "ch": "ch12",
      "kp": "ch12-1",
      "type": "multi",
      "difficulty": 2,
      "tags": [
        "concept",
        "javafx"
      ],
      "stem": "关于 JavaFX 的事件，下列说法正确的有？（多选）",
      "options": [
        {
          "text": "点击按钮、按键、移动鼠标、改变窗口大小、拖拽对象，都会产生事件",
          "correct": true
        },
        {
          "text": "事件对象携带这次事件的信息，例如 <code>MouseEvent</code> 里的坐标",
          "correct": true
        },
        {
          "text": "<code>EventHandler</code> 是函数式接口，可以用 lambda 实现",
          "correct": true
        },
        {
          "text": "事件只能由鼠标产生，键盘和窗口操作不会产生事件"
        },
        {
          "text": "一个事件处理器只能注册给一个节点，不能复用"
        }
      ],
      "explain": "讲义列了五种典型事件：点击按钮、按键、移动鼠标、改变窗口大小、拖拽对象；每个事件都是 Event 类或其子类的实例，事件对象里带着坐标、按键等信息。EventHandler 只有一个抽象方法 handle，所以能用 lambda 实现。一个 handler 可以注册给多个节点，讲义专门讲了用 getSource() 区分——D、E 都是反例。",
      "hint": "把讲义列的\"五种用户操作\"回忆一遍。"
    },
    {
      "id": "ch12-t12",
      "ch": "ch12",
      "kp": "ch12-7",
      "type": "order",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam",
        "javafx"
      ],
      "stem": "父容器 root 里放着一个 Button，四层处理器都注册好了。点击这个按钮，把下面四步按执行顺序排好。",
      "options": [
        {
          "text": "目标 <code>Button</code> 上的 <code>EventHandler</code> 执行"
        },
        {
          "text": "<code>root</code> 上的 <code>EventFilter</code> 执行（捕获阶段，从根开始）"
        },
        {
          "text": "<code>root</code> 上的 <code>EventHandler</code> 执行（冒泡阶段，回到根）"
        },
        {
          "text": "目标 <code>Button</code> 上的 <code>EventFilter</code> 执行"
        }
      ],
      "answer": [
        1,
        3,
        0,
        2
      ],
      "explain": "事件传播分三段：捕获阶段从根往目标走（执行 filter，父→子），到达目标后先跑目标自己的 filter，再跑目标的 handler，然后进入冒泡阶段从目标往根走（执行 handler，子→父）。所以顺序是 root 的 filter → button 的 filter → button 的 handler → root 的 handler。一句话记：filter 是\"下楼时\"看一遍，handler 是\"上楼时\"看一遍。",
      "hint": "filter 在捕获（下楼）阶段，handler 在冒泡（上楼）阶段。"
    },
    {
      "id": "ch12-f1",
      "ch": "ch12",
      "kp": "ch12-7",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "bug",
        "javafx",
        "exam"
      ],
      "stem": "程序想实现\"点一次 +1 按钮，分数加 1\"，但运行时点一次按钮分数会加 2。找出错误并说明改法。",
      "code": "public class ScoreDemo extends Application {\n    private int score = 0;\n\n    @Override\n    public void start(Stage stage) {\n        Label label = new Label(\"Score: 0\");\n        Button btn = new Button(\"+1\");\n        VBox root = new VBox(8, label, btn);\n\n        btn.setOnMouseClicked(e -> {\n            score++;\n            label.setText(\"Score: \" + score);\n        });\n        root.setOnMouseClicked(e -> {\n            score++;\n            label.setText(\"Score: \" + score);\n        });\n\n        stage.setScene(new Scene(root, 240, 160));\n        stage.show();\n    }\n\n    public static void main(String[] args) {\n        launch(args);\n    }\n}",
      "accept": [
        {
          "hint": "指出事件从按钮冒泡到父容器 root，两个处理器各执行一次",
          "any": [
            "冒泡",
            "bubble",
            "父容器",
            "root",
            "两个处理器",
            "都执行",
            "各执行",
            "两次",
            "都响应",
            "也执行"
          ]
        },
        {
          "hint": "改法：按钮的处理器里 e.consume()，或去掉 root 上的处理器",
          "any": [
            "consume",
            "去掉",
            "删除",
            "只保留",
            "gettarget",
            "只在按钮",
            "只注册",
            "拦截"
          ]
        }
      ],
      "minHits": 2,
      "answer": "事件冒泡让按钮和 root 的处理器都执行了一次，所以一次点击加 2；应在按钮的处理器里调用 e.consume()，或去掉 root 上的处理器。",
      "explain": "点击落在 btn 上，事件在冒泡阶段依次经过 btn、root，两个 handler 都改了 score，所以一次点击加 2。consume() 把事件标记为已处理，冒泡提前停止。另一种改法是只在 root 上注册一次，用 e.getTarget() 判断点的是不是按钮。这类\"父容器也跟着响应\"的现象是冒泡的正常行为，不是 JavaFX 的 bug，不想要就必须显式阻断。",
      "hint": "点击按钮时，除了按钮自己，还有谁收到了这次点击？"
    },
    {
      "id": "ch13-q1",
      "ch": "ch13",
      "kp": "ch13-1",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "project",
        "socket"
      ],
      "stem": "项目 #1（聊天室）把代码拆成 <code>Server</code>、<code>ClientHandler</code>、<code>Client</code> 三个类。下面哪一项的职责分配是正确的？",
      "options": [
        {
          "text": "<code>Server</code> 建 <code>ServerSocket</code> 并循环 <code>accept()</code>；<code>ClientHandler</code> 读某个客户端的消息并广播给所有人；<code>Client</code> 连服务器、发消息、收消息",
          "correct": true
        },
        {
          "text": "<code>Server</code> 负责把消息广播给所有人，<code>ClientHandler</code> 只负责 <code>accept()</code> 新连接"
        },
        {
          "text": "<code>Client</code> 负责监听端口等待连接，<code>Server</code> 主动去连每个客户端"
        },
        {
          "text": "三个类各自新建一个 <code>ServerSocket</code>，各自 <code>accept()</code> 自己的连接"
        }
      ],
      "explain": "分工的判据是“谁持有哪个资源”。<code>Server</code> 只持有一个 <code>ServerSocket</code>，所以它只做两件事：<code>accept()</code> 出一个 <code>Socket</code>，再为这个 <code>Socket</code> 创建 <code>ClientHandler</code> 并放进新线程——它自己不读消息。某个客户端的 socket 和它的输入/输出流由对应的 <code>ClientHandler</code> 持有，所以“读这个客户端的消息”和“把消息写给所有客户端”（<code>broadcastMessage</code>）都归它。<code>Client</code> 只握着自己那条 socket，负责连服务器、发消息、收消息。B 把 accept 和广播对调了；C 方向反了（客户端主动连服务器）；D 说明没理解一个服务器进程只需要一个 <code>ServerSocket</code>。",
      "hint": "谁握着 ServerSocket、谁握着某个客户端的 socket，活儿就归谁。"
    },
    {
      "id": "ch13-q2",
      "ch": "ch13",
      "kp": "ch13-6",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "socket",
        "exam"
      ],
      "stem": "一个客户端连上后，先把用户名 <code>Alice</code> 发出去（结尾带换行），紧接着再发一条聊天内容 <code>hello</code>（结尾也带换行），然后保持连接不关闭。写出服务器控制台打印的内容（逐行）。",
      "code": "public class ClientHandler implements Runnable {\n    private Socket socket;\n    private BufferedReader bufferedReader;\n    private String clientUsername;\n\n    public ClientHandler(Socket socket) throws IOException {\n        this.socket = socket;\n        this.bufferedReader = new BufferedReader(\n                new InputStreamReader(socket.getInputStream()));\n        this.clientUsername = bufferedReader.readLine();\n        System.out.println(clientUsername + \" has joined\");\n    }\n\n    public void run() {\n        while (socket.isConnected()) {\n            try {\n                String message = bufferedReader.readLine();\n                System.out.println(clientUsername + \": \" + message);\n            } catch (IOException e) {\n                break;\n            }\n        }\n    }\n}",
      "answer": "Alice has joined\nAlice: hello",
      "explain": "<code>ClientHandler</code> 的构造器里第一件事就是 <code>bufferedReader.readLine()</code>——它把客户端发来的第一行读走，当作用户名，所以用户名必须是客户端连上后发的第一条内容。剩下的 <code>hello</code> 还留在流里，交给 <code>run()</code> 的循环再读一次，于是打印出 <code>Alice: hello</code>。如果客户端顺序反了（先发聊天内容、后发名字），服务器就会把聊天内容当用户名，之后每一条消息都错位——这就是 <code>Client.sendMessage()</code> 里必须先发 username 再进输入循环的原因。",
      "hint": "构造器里第一行 readLine 读的是谁？"
    },
    {
      "id": "ch13-q3",
      "ch": "ch13",
      "kp": "ch13-5",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "trap",
        "thread",
        "javafx"
      ],
      "stem": "有人在 JavaFX 聊天室客户端里把 <code>listenForMessage()</code> 改成“不新建线程、直接在方法里用 <code>while (socket.isConnected())</code> 循环 <code>readLine()</code>”，然后在 <code>start(Stage)</code> 里先调用它，再创建 <code>Scene</code> 并调用 <code>stage.show()</code>。运行后会发生什么？",
      "options": [
        {
          "text": "编译错误，因为 <code>readLine()</code> 不允许写在 <code>start()</code> 里面"
        },
        {
          "text": "客户端会立刻抛出 <code>IOException</code> 并退出，因为服务器还没有发消息"
        },
        {
          "text": "<code>readLine()</code> 没有数据时一直阻塞，<code>start()</code> 卡在这个方法里返回不了，后面的 <code>show()</code> 执行不到，窗口根本出不来",
          "correct": true
        },
        {
          "text": "窗口正常显示，只是界面会偶尔卡顿一下，功能都还能用"
        }
      ],
      "explain": "<code>readLine()</code> 是阻塞调用：没有数据时线程就停在那儿等，不会返回。<code>start()</code> 是顺序执行的，把它放在创建 <code>Scene</code>、调用 <code>show()</code> 之前，后面的语句就永远轮不到，所以窗口不会出现。这正是项目结构里 <code>listenForMessage()</code> 内部要 <code>new Thread(...).start()</code> 的原因：收消息的阻塞循环必须待在自己的线程里，主流程（以及 <code>sendMessage()</code> 那个读键盘的循环）才不会被它挡住。注意这不是编译错误，也不是异常，而是“卡住”。",
      "hint": "readLine 没消息时会一直等，start() 后面的 show() 还轮得到吗？"
    },
    {
      "id": "ch13-t1",
      "ch": "ch13",
      "kp": "ch13-3",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "socket",
        "concept"
      ],
      "stem": "关于 <code>ServerSocket.accept()</code>，下列说法正确的是？",
      "options": [
        {
          "text": "它立即返回 <code>null</code>，用来表示“暂时还没有客户端”"
        },
        {
          "text": "它只返回客户端的 IP 地址字符串"
        },
        {
          "text": "没有客户端连接时它会阻塞等待；一旦有客户端连上，就返回一个代表这条连接的 <code>Socket</code>",
          "correct": true
        },
        {
          "text": "它返回服务器自己的那个 <code>ServerSocket</code> 对象"
        }
      ],
      "explain": "<code>ServerSocket.accept()</code> 是服务器“接客”的方法：监听端口、等待连接，有客户端连上时才返回一个新的 <code>Socket</code>——这个 <code>Socket</code> 才是和那个客户端通信的端点，从它才能 <code>getInputStream()</code>/<code>getOutputStream()</code>。也正因为会阻塞，服务器把它放在 <code>while (!serverSocket.isClosed())</code> 里反复调用，每返回一个 <code>Socket</code> 就交给一个新线程。返回 <code>null</code>、返回 IP 字符串都是对它的误解；<code>ServerSocket</code> 自己不是通信端点。",
      "hint": "先有监听，accept 之后拿到的才是“连接”。"
    },
    {
      "id": "ch13-t2",
      "ch": "ch13",
      "kp": "ch13-6",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "thread",
        "socket",
        "trap"
      ],
      "stem": "<code>ClientHandler.run()</code> 里读消息的逻辑写成了 <code>while (socket.isConnected())</code> 循环。如果把循环换掉、只调用一次 <code>bufferedReader.readLine()</code> 就返回，会怎样？",
      "options": [
        {
          "text": "客户端发第二条消息时会收到异常，但服务器不受影响"
        },
        {
          "text": "只有最后一个连上的客户端能发消息，前面的都不行"
        },
        {
          "text": "每个客户端只有它的第一条消息会被读到并广播，之后这个 handler 的线程结束，后面的消息再没人转发",
          "correct": true
        },
        {
          "text": "没有影响，<code>Thread</code> 会自动反复调用 <code>run()</code> 直到连接断开"
        }
      ],
      "explain": "一个客户端连上后可以一直发消息，所以“读消息”必须是一个循环：只要连接还在（<code>while (socket.isConnected())</code>），就反复 <code>readLine()</code> 并广播。只读一次，<code>run()</code> 立刻返回，该线程进入 Terminated 状态；这个客户端之后写进 socket 的消息留在缓冲区里没人取，其他客户端自然收不到。<code>run()</code> 只会被 JVM 调用一次，不会自动重复执行，这是它和“循环处理请求”的本质区别。",
      "hint": "一个客户端只会发一条消息吗？run() 会被调用几次？"
    },
    {
      "id": "ch13-t3",
      "ch": "ch13",
      "kp": "ch13-6",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "socket",
        "project"
      ],
      "stem": "服务器要把一条消息发给“所有在线客户端”，它靠什么知道现在有哪些客户端在线？",
      "options": [
        {
          "text": "客户端之间直接互相连接，服务器不需要保存任何列表"
        },
        {
          "text": "广播时重新调用一次 <code>serverSocket.accept()</code>，就能拿到所有在线客户端"
        },
        {
          "text": "<code>ClientHandler</code> 的构造器把自己加进 <code>public static ArrayList&lt;ClientHandler&gt; clientHandlers</code>，广播时遍历这个列表",
          "correct": true
        },
        {
          "text": "<code>Server</code> 在 <code>startServer()</code> 里把每个 <code>Socket</code> 存进一个数组，广播时遍历这个 <code>Socket</code> 数组"
        }
      ],
      "explain": "讲义里的做法是：每个 <code>ClientHandler</code> 在构造时执行 <code>clientHandlers.add(this)</code>，把自己登记进一个公开的 <code>static ArrayList&lt;ClientHandler&gt;</code> 名单；广播时 for 循环遍历它，逐个调用各 handler 的 writer。名单存 handler 而不是 <code>Socket</code>，是因为写消息要用 handler 已经包装好的流；设成 <code>static</code> 则让所有 handler 共享同一份名单。<code>accept()</code> 每次只返回“下一个”新连接，重复调用只会等到新客户端，拿不到已有名单；客户端之间也没有直连。",
      "hint": "讲义让谁把自己加进哪个集合？"
    },
    {
      "id": "ch13-t4",
      "ch": "ch13",
      "kp": "ch13-2",
      "type": "tf",
      "difficulty": 1,
      "tags": [
        "thread",
        "concept"
      ],
      "stem": "判断：在项目 #1 中，<code>ClientHandler</code> 实现了 <code>Runnable</code>，服务器每接收一个客户端就创建一个 <code>ClientHandler</code>，并调用 <code>new Thread(clientHandler).start()</code> 启动它。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "这正是项目 #1 服务器端的主结构：<code>startServer()</code> 的 while 循环里，每 <code>accept()</code> 到一个 <code>Socket</code> 就 <code>new ClientHandler(socket)</code>，再把它包进 <code>Thread</code> 并 <code>start()</code>。因为 <code>ClientHandler</code> 实现了 <code>Runnable</code> 并重写 <code>run()</code>，线程启动后执行的就是 <code>run()</code> 里“读这个客户端的消息并广播”的循环。一个客户端对应一个 handler 对象、一条线程，彼此不阻塞，聊天室才能同时服务多人。",
      "hint": "Server 的 while 循环里，accept 之后紧接着做了什么？"
    },
    {
      "id": "ch13-t5",
      "ch": "ch13",
      "kp": "ch13-8",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "trap",
        "socket",
        "bug"
      ],
      "stem": "判断：在 <code>broadcastMessage()</code> 的 for-each 循环里，如果发现某个客户端已经断开，可以直接用 <code>clientHandlers.remove(handler)</code> 把它移除，循环会安全地继续。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "for-each 遍历 <code>ArrayList</code> 时底层用的是迭代器，迭代器会检查“遍历期间集合有没有被结构性修改”。在循环体里 <code>remove()</code> 会让下一次取元素时抛 <code>ConcurrentModificationException</code>，广播途中这个 handler 线程就直接崩了——这正是讲义把“并发修改 clientHandlers”列进项目一高频坑的原因。安全做法是先把要移除的对象记下来，循环结束后再统一删；或者用显式下标的 for 循环从后往前遍历再删。",
      "hint": "边 for-each 遍历边删元素，迭代器会同意吗？"
    },
    {
      "id": "ch13-t6",
      "ch": "ch13",
      "kp": "ch13-6",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "socket",
        "project"
      ],
      "stem": "让 <code>ClientHandler</code> 的 <code>broadcastMessage(String message)</code> 把一条消息送给所有在线客户端，正确的做法是？",
      "options": [
        {
          "text": "遍历 <code>clientHandlers</code>，对每个 handler 用它自己的 <code>bufferedWriter</code> 把这条消息写出去（并 <code>flush()</code>）",
          "correct": true
        },
        {
          "text": "只把消息写进“自己这个” handler 的 writer，服务器会自动帮它转发给别人"
        },
        {
          "text": "遍历 <code>clientHandlers</code>，直接用 <code>Server</code> 里那个 <code>ServerSocket</code> 把消息写出去"
        },
        {
          "text": "把消息存进一个 <code>String</code> 字段，等有新客户端连上时再发一次"
        }
      ],
      "explain": "广播的本质是“一条消息、N 条连接”：<code>clientHandlers</code> 里每个 <code>ClientHandler</code> 都握着某个客户端专属的 <code>BufferedWriter</code>，只有它能往那个客户端写，所以必须 for 循环遍历列表、对每个 handler 用各自的 writer 写同一段文字。A 只写自己，只有发送者能收到；C 没分清 <code>ServerSocket</code>（只负责监听和接受连接，不是任何一条连接的输出流）和每个连接的 <code>Socket</code>；D 把“广播”误解成“缓存等下次”。",
      "hint": "每个客户端一条连接、一个 writer，广播要挨个写。"
    },
    {
      "id": "ch13-t7",
      "ch": "ch13",
      "kp": "ch13-3",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "socket",
        "syntax"
      ],
      "stem": "服务器在 <code>while</code> 循环里等待客户端连接：<code>Socket socket = serverSocket.____();</code> 没有客户端时这行会一直阻塞，有客户端连上时返回一个代表该连接的 <code>Socket</code>。",
      "answer": "accept",
      "accept": [
        "accept()"
      ],
      "explain": "<code>ServerSocket.accept()</code> 是服务器端“接客”的方法：它阻塞等待，直到有客户端发起连接，才返回一个新的 <code>Socket</code>。不阻塞、立即返回 <code>null</code> 或返回 <code>ServerSocket</code> 本身，都是对它行为的误解。也正因为会阻塞，服务器把它写在 <code>while (!serverSocket.isClosed())</code> 里反复调用，每拿到一个 <code>Socket</code> 就交给一个新线程去服务。",
      "hint": "服务器“接受一个连接”的方法名，就是 accept。"
    },
    {
      "id": "ch13-t8",
      "ch": "ch13",
      "kp": "ch13-4",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "socket",
        "io"
      ],
      "stem": "客户端要把服务器发来的字节按行读成文本，先取输入流再包一层：<code>bufferedReader = new BufferedReader(new InputStreamReader(socket.____()));</code>",
      "answer": "getInputStream",
      "accept": [
        "getInputStream()"
      ],
      "explain": "<code>Socket</code> 提供两个方向相反的流：<code>getInputStream()</code> 拿到“从对方发来的字节”，用于读；<code>getOutputStream()</code> 拿到“要发给对方的字节”，用于写。想按行读文本，还要用 <code>InputStreamReader</code> 把字节解码成字符，再用 <code>BufferedReader</code> 加缓冲，才能调用 <code>readLine()</code>，这就是讲义里的三层包装链。写成 <code>getOutputStream()</code> 是最常见的错误：方向反了，读不到任何东西。",
      "hint": "读用 InputStream，写用 OutputStream。"
    },
    {
      "id": "ch13-t9",
      "ch": "ch13",
      "kp": "ch13-8",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "socket",
        "io"
      ],
      "stem": "服务器要停止监听时调用 <code>serverSocket.____()</code>；之后 <code>while (!serverSocket.isClosed())</code> 的条件才会变成 false，accept 循环随之结束。",
      "answer": "close",
      "accept": [
        "close()"
      ],
      "explain": "<code>close()</code> 会释放端口和底层网络资源，并把 <code>ServerSocket</code> 标记为已关闭；正因如此，accept 循环用 <code>while (!serverSocket.isClosed())</code> 作为退出条件——调用 <code>close()</code> 之后条件变 false，循环结束，服务器才能正常收尾。客户端断开时同理：要关闭它那条连接的 <code>socket</code>、reader 和 writer，并把该 handler 从 <code>clientHandlers</code> 移除，否则广播还会往死连接上写、资源也会泄漏。",
      "hint": "让 isClosed() 变成 true 的方法是哪个？"
    },
    {
      "id": "ch13-t10",
      "ch": "ch13",
      "kp": "ch13-8",
      "type": "predict",
      "difficulty": 3,
      "tags": [
        "output",
        "trap",
        "socket"
      ],
      "stem": "服务器端连续广播两条消息（下面只画出发给同一条连接的部分），客户端在自己的 <code>listenForMessage</code> 线程里读。写出客户端打印的内容。",
      "code": "// ClientHandler 里连续广播两条消息\nbufferedWriter.write(\"Alice: hi\");\nbufferedWriter.flush();\nbufferedWriter.write(\"Bob: yo\");\nbufferedWriter.newLine();\nbufferedWriter.flush();\n\n// 客户端 listenForMessage 线程里\nString line = bufferedReader.readLine();\nSystem.out.println(line);",
      "answer": "Alice: hiBob: yo",
      "explain": "<code>readLine()</code> 的结束标志是换行符，不是每次 <code>write()</code>。第一条消息写完就 <code>flush()</code>，但流里没有换行，客户端读不到“一行结束”；第二条 <code>write</code> 再加上 <code>newLine()</code> 之后，客户端缓冲区里累积的是 <code>Alice: hiBob: yo</code> 加一个换行，一次 <code>readLine()</code> 就把整段当成一行返回。所以每条消息写完都要紧跟 <code>newLine()</code>（写一个换行符）再 <code>flush()</code>，两条消息才不会粘在一起、也不会让客户端一直阻塞。",
      "hint": "换行符才是消息的边界，write 本身不是。"
    },
    {
      "id": "ch13-t11",
      "ch": "ch13",
      "kp": "ch13-1",
      "type": "multi",
      "difficulty": 2,
      "tags": [
        "concept",
        "thread",
        "socket"
      ],
      "stem": "关于聊天室项目 #1 的服务器端，下列说法正确的有？（多选）",
      "options": [
        {
          "text": "每 <code>accept()</code> 到一个客户端，就 <code>new ClientHandler(socket)</code> 并把它放进一个新线程 <code>start()</code>",
          "correct": true
        },
        {
          "text": "<code>broadcastMessage()</code> 要遍历 <code>clientHandlers</code>，用每个 handler 自己的 writer 写消息",
          "correct": true
        },
        {
          "text": "<code>ClientHandler</code> 可以在构造器里用自己 socket 的输入流读出客户端发来的用户名",
          "correct": true
        },
        {
          "text": "<code>Server</code> 的主线程除了 <code>accept()</code> 和启动线程，还负责读取每个客户端发来的消息"
        },
        {
          "text": "每来一个新客户端，<code>Server</code> 的 <code>main</code> 方法都要重新执行一次，才能 <code>accept()</code> 到新连接"
        }
      ],
      "explain": "服务器端的分工是“一个客户端一条连接、一个 handler、一条线程、一套流”：主线程只跑 accept 循环和创建线程，读消息是各 handler 线程的活，所以 D 错。<code>main</code> 只在启动时执行一次，之后靠 <code>startServer()</code> 里的 while 循环一遍遍 <code>accept()</code>，所以 E 也错。构造器里先用自己 socket 的输入流读第一行当用户名（C 对），广播在 <code>clientHandlers</code> 上遍历、逐个 writer 写（B 对），每来一个客户端就配一条新线程（A 对）。",
      "hint": "每条连接都有自己的流；读消息的线程是谁？"
    },
    {
      "id": "ch13-t12",
      "ch": "ch13",
      "kp": "ch13-7",
      "type": "order",
      "difficulty": 2,
      "tags": [
        "socket",
        "thread",
        "concept"
      ],
      "stem": "把“服务器启动并为第一个客户端开一条处理线程”的过程按正确顺序排列。",
      "options": [
        {
          "text": "<code>new Thread(handler).start();</code>"
        },
        {
          "text": "<code>ServerSocket serverSocket = new ServerSocket(1004);</code>"
        },
        {
          "text": "handler 所在线程里循环 <code>readLine()</code> 读消息并广播"
        },
        {
          "text": "<code>Socket socket = serverSocket.accept();</code>"
        },
        {
          "text": "<code>ClientHandler handler = new ClientHandler(socket);</code>"
        }
      ],
      "answer": [
        1,
        3,
        4,
        0,
        2
      ],
      "explain": "顺序由依赖决定：先有 <code>ServerSocket</code> 才能 <code>accept()</code>；<code>accept()</code> 返回 <code>Socket</code> 后才能构造 <code>ClientHandler</code>（它要拿 socket 去建流、读用户名）；有了 handler 对象才能 <code>new Thread(handler).start()</code>；线程真正跑起来，才执行 <code>run()</code> 里的读消息循环。任何提前都会出问题：没有 socket 就 <code>new ClientHandler(null)</code> 会空指针，没 <code>start()</code> 就调 <code>run()</code> 则根本不开新线程。",
      "hint": "没有 Socket 就没有 handler，没有 start 就没有 run。"
    },
    {
      "id": "ch13-f1",
      "ch": "ch13",
      "kp": "ch13-2",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "bug",
        "thread",
        "socket"
      ],
      "stem": "下面的 <code>startServer()</code> 想让多个客户端同时聊天：每 <code>accept()</code> 到一个连接就创建一个 <code>ClientHandler</code>。但实测只有第一个客户端能连上，之后服务器像死了一样。找出错误并说明改法。",
      "code": "public void startServer() throws IOException {\n    while (!serverSocket.isClosed()) {\n        Socket socket = serverSocket.accept();\n        ClientHandler clientHandler = new ClientHandler(socket);\n        clientHandler.run();\n    }\n}",
      "accept": [
        {
          "hint": "指出第 5 行直接调用了 run()，并没有开新线程",
          "any": [
            "run()",
            "clientHandler.run",
            "直接调用run",
            "调用了run",
            "调用 run",
            "调 run"
          ]
        },
        {
          "hint": "改成把 handler 交给新线程并 start()",
          "any": [
            "new thread",
            "start()",
            "thread.start",
            "启动线程"
          ]
        },
        {
          "hint": "说出后果：accept 循环被卡住，其他客户端连不上",
          "any": [
            "第二个客户端",
            "其他客户端",
            "连不上",
            "卡住",
            "阻塞",
            "无法accept",
            "accept 无法"
          ]
        }
      ],
      "minHits": 2,
      "answer": "第 5 行 clientHandler.run() 只是普通方法调用，没有启动新线程；应改为 new Thread(clientHandler).start()。",
      "explain": "直接调用 <code>run()</code> 时，<code>run()</code> 里那个 <code>while (socket.isConnected())</code> 加 <code>readLine()</code> 的循环会在服务器主线程里一直转，<code>startServer()</code> 永远回不到 while 开头再 <code>accept()</code>，第二个客户端的连接请求就堆在队列里没人处理——现象正是“第一个客户端还能聊，后面的人都连不上”。改成 <code>new Thread(clientHandler).start()</code> 后，<code>run()</code> 由新线程执行，主线程立刻回去 <code>accept()</code>。线程是 <code>start()</code> 出来的，不是 <code>run()</code> 调出来的，这是本课线程部分第一高频陷阱。",
      "hint": "run() 是线程体，不是“启动线程”的方法。"
    },
    {
      "id": "ch14-q1",
      "ch": "ch14",
      "kp": "ch14-1",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "project"
      ],
      "stem": "Gomoku（五子棋）用 15×15 的棋盘，黑棋（Player 1，用 <code>X</code> 表示）先下。下列关于下棋规则的说法正确的是？",
      "options": [
        {
          "text": "白棋先下，因为白色通常代表先手"
        },
        {
          "text": "只要棋盘还没满，同一个格子可以反复落子覆盖"
        },
        {
          "text": "黑先落一子，之后双方轮流各落一子；落在已经有棋子的格子上是不允许的",
          "correct": true
        },
        {
          "text": "黑棋可以连下两子，只要第二子还落在同一条线上"
        }
      ],
      "explain": "基本规则：黑先、双方轮流（一手一子），落子位置必须在棋盘内，且该格当前是空的（讲义用 <code>+</code> 表示空位）。“不能落在已有棋子上”和“游戏结束后不能再落子”都是 <code>move()</code> 必须挡住的非法操作。棋盘用二维数组保存每个格子的状态，“这一格现在是什么”决定了这一步合不合法，所以 <code>move()</code> 一开始就要做越界与占用检查。",
      "hint": "谁先下？能不能下在别人已经占了的格子上？"
    },
    {
      "id": "ch14-q2",
      "ch": "ch14",
      "kp": "ch14-3",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "exam"
      ],
      "stem": "下面这段代码用 5×5 的简化棋盘演示打印。写出它的输出（逐行）。",
      "code": "char[][] board = new char[5][5];\nfor (int r = 0; r < 5; r++) {\n    for (int c = 0; c < 5; c++) {\n        board[r][c] = '+';\n    }\n}\n\nboard[1][1] = 'X';\nboard[2][3] = 'O';\n\nfor (int r = 0; r < 5; r++) {\n    for (int c = 0; c < 5; c++) {\n        System.out.print(board[r][c] + \" \");\n    }\n    System.out.println();\n}",
      "answer": "+ + + + +\n+ X + + +\n+ + + O +\n+ + + + +\n+ + + + +",
      "explain": "棋盘按行优先存储：<code>board[r][c]</code> 第一个下标是行、第二个是列，所以 <code>board[1][1]</code> 落在第 2 行第 2 列，<code>board[2][3]</code> 落在第 3 行第 4 列。打印时外层循环 r、内层循环 c，一行打完才换行，形状就和数组一致。很多同学把平面的 (x, y) 直觉带进来写成 <code>board[c][r]</code>，画出来就是转置（沿对角线镜像）的棋盘，之后的坐标换算也会跟着错。",
      "hint": "第一个下标是行还是列？把 r、c 标在格子上数一遍。"
    },
    {
      "id": "ch14-q3",
      "ch": "ch14",
      "kp": "ch14-4",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "trap",
        "exam"
      ],
      "stem": "下面的 <code>move()</code> 片段想实现“落子后判断这一步是否五连”：<br><code>board[x][y] = currentPlayer;</code><br><code>totalMoves++;</code><br><code>currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';</code><br><code>if (checkWin(x, y, currentPlayer)) { winner = currentPlayer; gameOver = true; }</code><br>问题出在哪？",
      "options": [
        {
          "text": "<code>totalMoves++</code> 应该放到 <code>checkWin</code> 之后，否则步数会多算一步"
        },
        {
          "text": "落子语句应该放到 <code>checkWin</code> 之后，先判后落"
        },
        {
          "text": "换手换早了：<code>checkWin</code> 拿到的是下一手的玩家，即使这步真的五连也判不出来（<code>winner</code> 还会被记成对手）；应先 <code>checkWin</code>、确认胜负后再换手",
          "correct": true
        },
        {
          "text": "没有问题，因为 <code>checkWin</code> 只用坐标 <code>(x, y)</code> 判断，和 <code>currentPlayer</code> 无关"
        }
      ],
      "explain": "<code>checkWin(x, y, stone)</code> 需要知道“刚下的是哪一方的子”，才能判断这条线上的连子是不是同一个人的。片段里先把 <code>currentPlayer</code> 换成了对手，再把对手的颜色传进去：轻则该赢的没判出来，重则如果新子附近碰巧有对手的连子，还会把胜利错误地记到对手头上。正确顺序是：检查合法性 → 落子 → <code>totalMoves++</code> → <code>checkWin(x, y, currentPlayer)</code>（此时 <code>currentPlayer</code> 仍是刚落子的人）→ 判平局 → 最后才切换玩家。D 则彻底错了：不落子就判，棋盘上根本没有这颗新子。",
      "hint": "checkWin 要传“刚落子那一方”的颜色——换手之后它还对吗？"
    },
    {
      "id": "ch14-t1",
      "ch": "ch14",
      "kp": "ch14-5",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "<code>checkWin(x, y, stone)</code> 只从刚落的这颗子出发判断是否五连。它需要检查哪些方向？",
      "options": [
        {
          "text": "把棋盘上 8 个相邻方向各自单独数，哪个方向先凑够 5 颗就算赢"
        },
        {
          "text": "只从这颗子向坐标增大的方向数，反向的连子由对手那一步负责"
        },
        {
          "text": "横、竖、左上到右下、右上到左下四条方向线，每条线都向两个相反方向数",
          "correct": true
        },
        {
          "text": "只查横、竖两个方向，斜线在五子棋里不算"
        }
      ],
      "explain": "五连可以沿四条方向线形成：水平（左右）、竖直（上下）、主对角线（左上到右下）、副对角线（右上到左下）。每条线的判据都是“自己 1 颗 + 正方向连续同色数 + 反方向连续同色数 大于等于 5”，所以要从新子出发向两侧各数一次。只查横竖会漏掉斜线；8 个方向各自单独数，每个方向只覆盖一条线的一半，新子落在五连中间时两边都不够 5；只数坐标增大方向同理会漏判。",
      "hint": "一条直线有两个方向，五连可能跨在这颗子的两边。"
    },
    {
      "id": "ch14-t2",
      "ch": "ch14",
      "kp": "ch14-6",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "15×15 棋盘上，什么时候判“平局”（Draw）？",
      "options": [
        {
          "text": "棋盘上只剩 1 个空位时"
        },
        {
          "text": "某一方连续三次落子非法时"
        },
        {
          "text": "没有任何一方五连，并且总落子数已经达到 225（棋盘被下满）",
          "correct": true
        },
        {
          "text": "双方各下了 15 手之后"
        }
      ],
      "explain": "平局的判据是“没有空位可下、同时没人达成五连”。讲义建议不要每次都遍历棋盘数空格，而是维护一个总落子数，每成功落一子加 1，当它达到棋盘容量上限（15×15 = 225）且 <code>checkWin</code> 没有返回 true 时，才判平局——每次落子只多一次比较。注意胜负判定要在平局之前（或同时确认没有赢家），因为最后一手有可能正好凑成五连，那一局是赢而不是平局。",
      "hint": "15×15 一共多少个格子？"
    },
    {
      "id": "ch14-t3",
      "ch": "ch14",
      "kp": "ch14-8",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "javafx",
        "code"
      ],
      "stem": "用 Canvas 画 15×15 棋盘，格子边长是 <code>CELL_SIZE</code>，第 <code>i</code> 条横线（<code>i</code> 从 0 到 14）要从左到右画满整行。下列调用正确的是？",
      "options": [
        {
          "text": "<code>gc.strokeLine(0, i * CELL_SIZE, 15 * CELL_SIZE, i * CELL_SIZE);</code>",
          "correct": true
        },
        {
          "text": "<code>gc.strokeLine(i * CELL_SIZE, 0, i * CELL_SIZE, 15 * CELL_SIZE);</code>"
        },
        {
          "text": "<code>gc.strokeLine(0, i, 15, i);</code>"
        },
        {
          "text": "<code>gc.fillLine(0, i * CELL_SIZE, 15 * CELL_SIZE, i * CELL_SIZE);</code>"
        }
      ],
      "explain": "<code>GraphicsContext</code> 的 <code>strokeLine(x1, y1, x2, y2)</code> 画的是从 (x1, y1) 到 (x2, y2) 的线段。横线两个端点的 y 相同、x 从 0 到 15 * CELL_SIZE，所以是 <code>(0, i * CELL_SIZE)</code> 到 <code>(15 * CELL_SIZE, i * CELL_SIZE)</code>。B 把 x 固定、y 变化，画出来是竖线；C 忘了乘格子边长，所有线都挤在左上角 15 个像素里；D 的 <code>fillLine</code> 根本不存在——填充类方法叫 <code>fillRect</code>/<code>fillOval</code>，画线的叫 <code>strokeLine</code>。",
      "hint": "横线的两个端点：y 相同、x 不同。"
    },
    {
      "id": "ch14-t4",
      "ch": "ch14",
      "kp": "ch14-5",
      "type": "tf",
      "difficulty": 1,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "判断：每次落子后，只需要从这颗新棋子出发检查它所在的四条方向线，不必每次都遍历整个棋盘去找五连。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "任何新出现的五连都必然包含“刚刚落下的那颗子”——在它落下之前，这条线还没有连成。所以只以新子为中心检查就够了，全局遍历是多余的。以新子为中心时，只要四条方向线中任意一条的“正向连子 + 反向连子 + 自己”达到 5，就说明有人赢了。这样每次落子的代价只和连子长度有关、与棋盘大小无关，这正是讲义强调“不要每次检查整个棋盘”的原因。",
      "hint": "新出现的五连，一定经过刚下的那颗子。"
    },
    {
      "id": "ch14-t5",
      "ch": "ch14",
      "kp": "ch14-8",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "javafx",
        "trap"
      ],
      "stem": "判断：用 Canvas 画五子棋时，每落一颗子都必须先清空整块画布，再把 15 条横线、15 条竖线和所有棋子重画一遍，否则新棋子显示不出来。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "Canvas 的绘制是累积的：<code>strokeLine</code>、<code>fillOval</code> 画上去的像素会一直留在画布上，所以常见做法是开局画一次棋盘线，之后每落一子只补画这一颗棋子，既省事又不会闪。整块重画当然也能得到正确的画面，但那是“重置棋局”时更方便的做法，不是显示新棋子的必要条件。只有在同一位置要改画别的东西（比如吃子、悔棋）时，才需要考虑覆盖或清空重画。",
      "hint": "Canvas 上画过的像素会自己消失吗？"
    },
    {
      "id": "ch14-t6",
      "ch": "ch14",
      "kp": "ch14-1",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "trap",
        "code"
      ],
      "stem": "<code>GomokuGame</code> 的构造器要初始化棋盘。若棋盘声明为 <code>char[][] board = new char[15][15];</code>，下列做法正确的是？",
      "options": [
        {
          "text": "把每个格子都填成 <code>X</code>，表示还没有人下过"
        },
        {
          "text": "让 <code>board</code> 先保持 <code>null</code> 表示空棋盘，等第一步落子时再创建数组"
        },
        {
          "text": "用双重循环把 225 个格子都填成表示空位的 <code>+</code>，否则数组元素是编码为 0 的空字符，和“空位”的判断对不上",
          "correct": true
        },
        {
          "text": "只写 <code>new char[15][15]</code> 就够了，<code>char</code> 数组的默认值就是空格"
        }
      ],
      "explain": "Java 的 <code>char</code> 数组元素默认值是编码为 0 的空字符，既不是空格也不是 <code>+</code>。如果后面用 <code>board[x][y] != '+'</code> 判断“这一格已经有人下了”，不初始化就会把 225 个格子全判成已占用，第一步都下不进去，打印出来也是一片看不见的字符。所以构造器里必须显式把每个格子设成约定的空位标记（讲义用 <code>+</code>），这也是 <code>render()</code> 能正常显示棋盘的前提。若用 <code>int[][]</code> 表示（0 空、1 黑、2 白）也是同一个道理，默认 0 恰好等于“空”，但那是碰巧，仍建议显式初始化。保持 <code>null</code> 更不行，第一步 <code>board[x][y]</code> 就空指针。",
      "hint": "char 数组不初始化时，每个元素里到底是什么？"
    },
    {
      "id": "ch14-t7",
      "ch": "ch14",
      "kp": "ch14-1",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "syntax",
        "concept"
      ],
      "stem": "Gomoku 的棋盘是 15×15，程序里通常定义常量 <code>final int BOARD_SIZE = ____;</code>，后面用它建二维数组、做边界检查。",
      "answer": "15",
      "explain": "棋盘是 15 行 15 列，所以取 15（不是 14，也不是 19——19 是围棋）。这个常量同时决定三件事：<code>new char[BOARD_SIZE][BOARD_SIZE]</code> 的数组大小、边界检查 <code>x &gt;= 0 &amp;&amp; x &lt; BOARD_SIZE</code> 的上界、以及平局的总手数上限 <code>BOARD_SIZE * BOARD_SIZE = 225</code>。用常量而不是到处写 15，改棋盘大小时只改一处，也能让“下标 0 到 14”这类差一错误更难发生。",
      "hint": "15 行 15 列，常量是多少？注意下标从 0 开始。"
    },
    {
      "id": "ch14-t8",
      "ch": "ch14",
      "kp": "ch14-8",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "javafx",
        "syntax"
      ],
      "stem": "在 Canvas 上用 <code>GraphicsContext</code> 画一颗实心棋子（圆形），调用的是 <code>gc.____(x, y, w, h);</code> 这个“填充椭圆”的方法。",
      "answer": "fillOval",
      "accept": [
        "fillOval()"
      ],
      "explain": "Canvas 的绘制分“描边（stroke）”和“填充（fill）”两类：画棋盘线用 <code>strokeLine</code>，画实心棋子用 <code>fillOval(x, y, w, h)</code>——x、y 是圆外接矩形的左上角，w、h 是宽和高，所以想画一个圆心在 (cx, cy)、半径 r 的棋子，要传 <code>(cx - r, cy - r, 2 * r, 2 * r)</code>。对应的 <code>strokeOval</code> 只画空心圆轮廓，<code>fillRect</code> 画的是方块。填充颜色由 <code>setFill(Color)</code> 决定，默认是黑色。",
      "hint": "fill + Oval；画线才是 strokeLine。"
    },
    {
      "id": "ch14-t9",
      "ch": "ch14",
      "kp": "ch14-5",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "trap",
        "code"
      ],
      "stem": "棋盘是 15 行 15 列，二维数组下标合法范围是 0 到 14。沿方向数连子时必须先查边界，例如写成 <code>nx &gt;= 0 &amp;&amp; nx &lt; ____</code>（<code>ny</code> 同理），否则 <code>board[nx][ny]</code> 会抛 <code>ArrayIndexOutOfBoundsException</code>。",
      "answer": "15",
      "accept": [
        "BOARD_SIZE",
        "boardSize"
      ],
      "explain": "数组下标从 0 开始，15 个格子对应 0 到 14，所以“上界（不含）”是 15：写成 <code>nx &gt;= 0 &amp;&amp; nx &lt; 15</code> 才等价于 <code>nx</code> 只在 0 到 14 之间取值。少了这个检查，沿棋盘边缘的棋子往某个方向数时，<code>nx</code> 或 <code>ny</code> 会变成 15 或 -1，<code>board[nx][ny]</code> 立刻抛 <code>ArrayIndexOutOfBoundsException</code>，程序直接崩掉。用 <code>BOARD_SIZE</code> 代替写死的 15，可以避免“棋盘改成 19 时忘了改这里”。",
      "hint": "下标 0 到 14，上界（不含）是几？"
    },
    {
      "id": "ch14-t10",
      "ch": "ch14",
      "kp": "ch14-7",
      "type": "predict",
      "difficulty": 3,
      "tags": [
        "javafx",
        "output",
        "trap"
      ],
      "stem": "Canvas 上每个格子的宽和高都是 <code>CELL_SIZE = 40</code>，鼠标点击的坐标用下面这段代码换算成行列。点击 <code>(95, 130)</code> 时打印什么？",
      "code": "canvas.setOnMouseClicked(e -> {\n    int col = (int) (e.getX() / CELL_SIZE);\n    int row = (int) (e.getY() / CELL_SIZE);\n    System.out.println(row + \",\" + col);\n});",
      "answer": "3,2",
      "explain": "鼠标坐标的 x 是水平方向（决定列），y 是垂直方向（决定行），两个都要除以格子边长 <code>CELL_SIZE</code>：坐标是像素、棋盘是格子，不除就全是越界的大数。这里 <code>130 / 40 = 3.25</code>，换成 <code>int</code> 向下取整得 3；<code>95 / 40 = 2.375</code> 得 2。打印顺序是 <code>row + \",\" + col</code>，所以输出 <code>3,2</code>。常见错误：忘了除 <code>CELL_SIZE</code>、把 x 当成行、把 row 与 col 的打印顺序写反。",
      "hint": "x 对应列、y 对应行；整数除法向下取整。"
    },
    {
      "id": "ch14-t11",
      "ch": "ch14",
      "kp": "ch14-2",
      "type": "multi",
      "difficulty": 2,
      "tags": [
        "concept",
        "code"
      ],
      "stem": "关于 <code>GomokuGame</code> 的字段与方法划分，下列说法正确的有？（多选）",
      "options": [
        {
          "text": "棋盘二维数组、<code>currentPlayer</code>、<code>gameOver</code>、<code>winner</code>、<code>totalMoves</code> 都是这个类的字段",
          "correct": true
        },
        {
          "text": "<code>move(x, y)</code> 负责合法性检查、落子、调用 <code>checkWin</code> 判胜负或平局，最后换手",
          "correct": true
        },
        {
          "text": "<code>render()</code> 只负责显示当前棋盘，不修改棋盘状态",
          "correct": true
        },
        {
          "text": "<code>checkWin()</code> 应该由渲染代码在每次重画时调用，这样才能及时显示胜负"
        },
        {
          "text": "构造器里应该把棋盘直接填满某一方的棋子，让局面更快开始"
        }
      ],
      "explain": "按“数据 + 操作”来分：局面数据和游戏状态是字段（A 对）；<code>move()</code> 是唯一改变局面的方法，检查、落子、判胜、换手都在里面且顺序不能乱（B 对）；<code>render()</code> 是只读的展示层，改它不该改状态（C 对）。D 错：<code>checkWin</code> 是规则判定，应该在 <code>move()</code> 里、落子后立刻调用，渲染只根据 <code>gameOver</code> 和 <code>winner</code> 显示结果。E 错：构造器只把棋盘初始化成空位，棋子只能由 <code>move()</code> 落下。",
      "hint": "谁是状态、谁是动作，渲染该不该改状态？"
    },
    {
      "id": "ch14-t12",
      "ch": "ch14",
      "kp": "ch14-4",
      "type": "order",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam"
      ],
      "stem": "把 <code>move(x, y)</code> 内部一次合法落子的处理步骤按正确顺序排列。",
      "options": [
        {
          "text": "检查 <code>x</code>、<code>y</code> 是否越界，以及 <code>board[x][y]</code> 是否已经被占用"
        },
        {
          "text": "把 <code>currentPlayer</code> 的棋子写进 <code>board[x][y]</code>，并让 <code>totalMoves</code> 加 1"
        },
        {
          "text": "切换 <code>currentPlayer</code> 到另一方"
        },
        {
          "text": "用 <code>checkWin(x, y, currentPlayer)</code> 判断是否五连；若棋盘已满且无人五连则判平局"
        },
        {
          "text": "若 <code>gameOver</code> 为真，直接拒绝这一步"
        }
      ],
      "answer": [
        4,
        0,
        1,
        3,
        2
      ],
      "explain": "第一步永远是“游戏结束了吗”——结束后不允许再落子，所以“若 <code>gameOver</code> 为真就拒绝这一步”必须排在最前。接着做两个合法性检查（越界、已占用），不合法就直接返回、什么都不改。合法才落子并累加步数；然后以“刚落子这一方”的颜色调用 <code>checkWin</code>，顺便用 <code>totalMoves</code> 判断平局。最后才切换玩家——如果提前换手，<code>checkWin</code> 拿到的颜色就是对手的，胜负会被判错。",
      "hint": "先挡住非法操作，再落子，再判胜负，最后才轮到对手。"
    },
    {
      "id": "ch14-f1",
      "ch": "ch14",
      "kp": "ch14-5",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "bug",
        "exam",
        "trap"
      ],
      "stem": "下面的 <code>checkWin</code> 想判断“刚落在 (x, y) 的 <code>stone</code> 是否形成五连”，但实战中会漏判：有时棋盘上明明已经连成五颗，程序却说没赢。找出问题并说明改法。",
      "code": "private boolean checkWin(int x, int y, char stone) {\n    int[][] dirs = {{1, 0}, {0, 1}, {1, 1}, {1, -1}};\n    for (int[] d : dirs) {\n        int count = 1;\n        int nx = x + d[0];\n        int ny = y + d[1];\n        while (nx >= 0 && nx < 15 && ny >= 0 && ny < 15 && board[nx][ny] == stone) {\n            count++;\n            nx += d[0];\n            ny += d[1];\n        }\n        if (count >= 5) return true;\n    }\n    return false;\n}",
      "accept": [
        {
          "hint": "指出每个方向只数了 (dx, dy) 这一侧，漏掉反方向",
          "any": [
            "反方向",
            "负方向",
            "相反方向",
            "另一侧",
            "只数一个方向",
            "单向",
            "只往一个方向",
            "只数了一边",
            "另一头"
          ]
        },
        {
          "hint": "改成两个方向都数（正、反两侧）",
          "any": [
            "两个方向",
            "两边",
            "双向",
            "正负",
            "反方向也",
            "两侧",
            "两边都"
          ]
        },
        {
          "hint": "说明五连判据要把新子自己算进去（或从线的一端开始数）",
          "any": [
            "加上自己",
            "算上自己",
            "自己这颗",
            "从线的一端",
            "从一端",
            "起点开始"
          ]
        }
      ],
      "minHits": 2,
      "answer": "每个方向只沿 (dx, dy) 一侧累加，漏掉了相反的一侧；应同时向正、反两个方向数，再把新子自己算进去（自己 1 颗 + 两侧连子数 大于等于 5）。",
      "explain": "五连的判据是“自己 1 颗 + 正方向连续同色数 + 反方向连续同色数 大于等于 5”。这段代码只沿 (dx, dy) 一个方向数，所以只有新子恰好是五连的一端时 <code>count</code> 才能到 5；如果新子落在五连正中间（例如左右各两颗），两个单方向含自己都只有 3，于是漏判——这正是讲义里说的 incomplete implementation。改法一：对每个方向分别数正、反两侧，<code>count = 1 + countDir(d) + countDir(-d)</code>；改法二：先把坐标退到这条线的起点，再沿正方向一次数到底。注意这段代码的边界检查是对的，别把它当成 bug。",
      "hint": "如果这颗子落在五连的正中间，单向还数得到 5 吗？"
    },
    {
      "id": "ch15-q1",
      "ch": "ch15",
      "kp": "ch15-2",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "python",
        "exam"
      ],
      "stem": "关于 Python 的缩进（indentation），下列说法正确的是？",
      "options": [
        {
          "text": "缩进只是为了排版好看，Python 和 Java 一样用花括号划分代码块，缩进会被解释器忽略"
        },
        {
          "text": "属于同一个代码块的多条语句必须保持相同的缩进量，缩进不一致会抛出 <code>IndentationError</code>",
          "correct": true
        },
        {
          "text": "Python 规定只能按 <code>Tab</code> 键缩进，用空格会直接报错"
        },
        {
          "text": "每个代码块至少要缩进 8 个空格，否则程序不运行"
        }
      ],
      "explain": "Python 没有 <code>{ }</code>，代码块的范围完全由缩进决定：以冒号结尾的那一行之后，凡是缩进量相同的连续语句都属于同一个块。讲义建议每层缩进 4 个空格（相当于按一次 <code>Tab</code>），但缩进量本身可以自选，只要同一块内保持一致就行；多了少了都会让解释器误判块的边界，抛 <code>IndentationError</code>。A 错在 Python 根本没有花括号；C、D 把\"常用 4 个空格\"当成了硬性语法规定。记住：缩进在 Python 里是语法，不是风格。",
      "hint": "想想 Java 用 <code>{ }</code> 圈出代码范围，Python 用什么圈？"
    },
    {
      "id": "ch15-q2",
      "ch": "ch15",
      "kp": "ch15-5",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "python",
        "exam"
      ],
      "stem": "写出下面程序的输出（逐行）。",
      "codeTitle": "Python",
      "code": "a = [\"apple\", \"banana\", \"cherry\"]\na.append(\"orange\")\na.insert(1, \"kiwi\")\na.remove(\"banana\")\nprint(a)\nprint(len(a))",
      "answer": "['apple', 'kiwi', 'cherry', 'orange']\n4",
      "explain": "逐行推演：<code>append</code> 把 orange 加到末尾；<code>insert(1, \"kiwi\")</code> 把 kiwi 插到下标 1 的位置（也就是 banana 之前），列表变成 apple、kiwi、banana、cherry、orange；<code>remove(\"banana\")</code> 按值删除，删掉后后面的元素整体前移，得到 apple、kiwi、cherry、orange。顺带区分三个删除手段：<code>remove(值)</code> 按值删、<code>pop(下标)</code> 按下标删并把被删元素返回、<code>del a[下标]</code> 按下标删。打印时 Python 用 repr 形式输出列表：外层方括号、字符串带单引号、元素之间逗号加空格，所以第一行必须原样写出引号和方括号；<code>len</code> 返回元素个数 4。",
      "hint": "<code>insert(1, x)</code> 插在下标 1 之前；<code>print</code> 列表会带方括号和单引号。"
    },
    {
      "id": "ch15-q3",
      "ch": "ch15",
      "kp": "ch15-5",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "trap",
        "output",
        "python"
      ],
      "stem": "下面程序的本意是删掉列表里所有的 2，但实际结果并不是预期。它的实际输出是？",
      "codeTitle": "Python",
      "code": "nums = [1, 2, 2, 3]\nfor n in nums:\n    if n == 2:\n        nums.remove(n)\nprint(nums)",
      "options": [
        {
          "text": "<code>[1, 2]</code>"
        },
        {
          "text": "<code>[1, 3]</code>"
        },
        {
          "text": "<code>[1, 2, 3]</code>",
          "correct": true
        },
        {
          "text": "<code>[1, 2, 2, 3]</code>"
        }
      ],
      "explain": "<code>for … in</code> 遍历时内部维护的是一个持续往后走的下标，而 <code>remove</code> 会立刻把后面的元素整体前移。走到下标 1 时拿到第一个 2 并删除，列表变成 [1, 2, 3]，第二个 2 从下标 2 挪到了下标 1；循环接着看下标 2，取到的是 3，那个 2 就被跳过了，所以最后仍剩一个 2。要真正删干净，可以用 <code>while</code> 配下标（删了不递增）、遍历副本 <code>for n in nums[:]</code>，或者直接构造新列表。",
      "hint": "删除元素会让后面的元素整体前移，而下标还在继续加 1。"
    },
    {
      "id": "ch15-t1",
      "ch": "ch15",
      "kp": "ch15-1",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "python",
        "exam"
      ],
      "stem": "下列哪一条是 Python 与 Java 之间真实存在的差异？",
      "options": [
        {
          "text": "Python 每条语句末尾必须写分号，Java 不用写"
        },
        {
          "text": "Python 用缩进划分代码块，Java 用一对花括号 <code>{ }</code>",
          "correct": true
        },
        {
          "text": "Python 的布尔字面量是 <code>true</code> / <code>false</code>，Java 的是 <code>True</code> / <code>False</code>"
        },
        {
          "text": "Python 中 <code>5 / 2</code> 的结果是 <code>2</code>，与 Java 的整数除法完全一样"
        }
      ],
      "explain": "Java 的语句以分号结尾、代码块用花括号；Python 两者都不要，靠冒号和缩进圈定范围。布尔值与\"没有值\"的字面量正好相反：Python 大写开头写 <code>True</code> / <code>False</code> / <code>None</code>，Java 写 <code>true</code> / <code>false</code> / <code>null</code>。算术上 Java 的 <code>5 / 2</code> 是整数除法得 2，Python 的 <code>/</code> 永远返回浮点，<code>5 / 2</code> 得 2.5，要整除必须写 <code>5 // 2</code>。A、C、D 都把两边说反或说错了。",
      "hint": "分号、花括号、大小写、<code>/</code> 与 <code>//</code>，逐条对比。"
    },
    {
      "id": "ch15-t2",
      "ch": "ch15",
      "kp": "ch15-3",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept",
        "python",
        "syntax"
      ],
      "stem": "关于 Python 的变量与类型，下列说法正确的是？",
      "options": [
        {
          "text": "<code>int(\"3.7\")</code> 会得到 <code>3</code>，即自动截断小数"
        },
        {
          "text": "必须先声明类型才能赋值，例如 <code>int x = 5</code>"
        },
        {
          "text": "变量没有声明语句，赋值即创建；同一个名字可以先后指向 <code>int</code> 和 <code>str</code> 类型的对象",
          "correct": true
        },
        {
          "text": "<code>type(3.0)</code> 的结果是 <code>int</code>，因为 3.0 没有小数部分"
        }
      ],
      "explain": "Python 是动态类型语言：<code>x = 5</code> 只是把名字 x 绑定到一个 int 对象上，之后 <code>x = \"hi\"</code> 完全合法，类型跟着对象走，所以既不需要也不能写 <code>int x = 5</code>。查当前类型用 <code>type()</code>：<code>type(3.0)</code> 是 <code>float</code>，有没有小数部分不影响类型归属。<code>int()</code> 只接受\"长得像整数\"的字符串，<code>int(\"3.7\")</code> 直接抛 <code>ValueError</code>，想截断必须先 <code>float(\"3.7\")</code> 再 <code>int()</code>。",
      "hint": "动态类型 = 类型属于对象，不属于变量名。"
    },
    {
      "id": "ch15-t3",
      "ch": "ch15",
      "kp": "ch15-6",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "trap",
        "python",
        "exam"
      ],
      "stem": "运行下面的程序并输入 <code>18</code>，会发生什么？",
      "codeTitle": "Python",
      "code": "age = input(\"age: \")\nif age >= 18:\n    print(\"adult\")\nelse:\n    print(\"minor\")",
      "options": [
        {
          "text": "打印 <code>minor</code>，因为字符串 <code>\"18\"</code> 比整数 18 小"
        },
        {
          "text": "抛 <code>SyntaxError</code>，因为 <code>if</code> 后面的条件少了括号"
        },
        {
          "text": "打印 <code>adult</code>"
        },
        {
          "text": "抛 <code>TypeError</code>：<code>&gt;=</code> 不支持在 <code>str</code> 与 <code>int</code> 之间比较",
          "correct": true
        }
      ],
      "explain": "<code>input()</code> 无论用户敲什么，返回的永远是字符串（这里是 \"18\"），不是数字。Python 不做隐式类型转换，字符串与整数比较会直接抛 <code>TypeError: \">=\" not supported between instances of \"str\" and \"int\"</code>。正确写法是先转换：<code>age = int(input(\"age: \"))</code>，或者比较前写 <code>int(age)</code>。这也是\"输入 18 却不进 if\"和\"输入 18 却直接报错\"这两种坑的分界：问题不在判断逻辑，而在比较的两个东西根本不是同一种类型。",
      "hint": "<code>input()</code> 的返回值到底是什么类型？"
    },
    {
      "id": "ch15-t4",
      "ch": "ch15",
      "kp": "ch15-4",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "syntax",
        "python",
        "exam"
      ],
      "stem": "<code>a = [\"a\", \"b\", \"c\", \"d\", \"e\"]</code>，表达式 <code>a[1:3]</code> 的值是？",
      "options": [
        {
          "text": "<code>[\"b\", \"c\", \"d\"]</code>"
        },
        {
          "text": "<code>[\"a\", \"b\", \"c\"]</code>"
        },
        {
          "text": "<code>[\"c\", \"d\"]</code>"
        },
        {
          "text": "<code>[\"b\", \"c\"]</code>",
          "correct": true
        }
      ],
      "explain": "切片写作 <code>a[start:end]</code>，取的是下标 start 到 end−1，含头不含尾：start=1 指向 \"b\"，end=3 表示\"到下标 3 之前停\"，所以只包含下标 1、2 两个元素，结果是 [\"b\", \"c\"]。也正因为右端点是开区间，<code>a[0:len(a)]</code> 才恰好等于整个列表。两条要记牢：下标从 0 开始；切片右端点不取。",
      "hint": "切片的右端点包不包含？回忆 <code>range(1, 3)</code>。"
    },
    {
      "id": "ch15-t5",
      "ch": "ch15",
      "kp": "ch15-3",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "concept",
        "python",
        "exam"
      ],
      "stem": "判断：Python 用 <code>None</code> 表示\"没有值\"，它相当于 Java 的 <code>null</code>，并且在条件判断中被当作假。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "<code>None</code> 是 Python 内置的空值对象，类型是 <code>NoneType</code>，作用与 Java 的 <code>null</code> 对应；不同之处在于它是真实存在的对象，可以赋值、可以比较（惯用 <code>x is None</code>）。在布尔上下文里 <code>None</code> 为假，所以 <code>if x:</code> 在 x 为 None 时不进分支。首字母必须大写：写成 <code>none</code> 会被当成未定义的名字，抛 <code>NameError</code>。",
      "hint": "Java 的 null，Python 写作什么？首字母大小写与真假值都要想。"
    },
    {
      "id": "ch15-t6",
      "ch": "ch15",
      "kp": "ch15-7",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "trap",
        "python",
        "exam"
      ],
      "stem": "判断：在 Python 中，<code>if []:</code> 的条件为真，因为空列表里\"有内容\"。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "真值测试的规则是：有内容的对象为真，而 0、空字符串 <code>\"\"</code>、空列表 <code>[]</code>、空字典以及 <code>None</code> 都为假，所以 <code>if []:</code> 不会进入分支。讲义的原话是\"几乎任何有内容的值都为 True，除了 0、空字符串和其他空的数据结构\"。这条规则的实用价值是 <code>if thislist:</code> 可以直接代替 <code>if len(thislist) &gt; 0:</code>。题干把\"有内容为真\"误推成\"空列表也有内容\"，方向正好相反。",
      "hint": "先问自己 <code>bool([])</code> 是真是假；讲义列举了哪些例外。"
    },
    {
      "id": "ch15-t7",
      "ch": "ch15",
      "kp": "ch15-2",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "bug",
        "python",
        "syntax"
      ],
      "stem": "同一个代码块内两行的缩进量不一致（例如上一行缩进 4 个空格、下一行缩进 6 个空格），Python 解释器会抛出 ____ 异常。",
      "answer": [
        "IndentationError"
      ],
      "accept": [
        "IndentationError",
        "indentationerror",
        "缩进错误"
      ],
      "explain": "缩进在 Python 里是语法的一部分，解析器靠它判断\"这一行属于哪个块\"。同一块里多缩进或少缩进，解析器就认为块的边界错了，抛 <code>IndentationError</code>（常见提示 <code>unexpected indent</code>、<code>expected an indented block</code>、<code>unindent does not match any outer indentation level</code>）。它发生在解析阶段，程序一行都不会执行，所以不是运行时异常。混用 Tab 与空格还会得到它的子类 <code>TabError</code>。",
      "hint": "错误名里带 Indentation（缩进）这个词。"
    },
    {
      "id": "ch15-t8",
      "ch": "ch15",
      "kp": "ch15-6",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "syntax",
        "python"
      ],
      "stem": "在 Python 分支里，当前面的条件不成立、还要继续判断下一个条件时，用的关键字是 ____（它相当于 Java 的 <code>else if</code>）。",
      "answer": [
        "elif"
      ],
      "explain": "Python 没有 <code>else if</code> 这种连写，而是把两者合并成一个关键字 <code>elif</code>，写成 <code>if …: / elif …: / else:</code>。它按从上到下的顺序逐个测试条件，一旦某个条件为真就执行对应分支并跳过后面所有分支，所以\"越具体的条件越往前放\"。把 <code>elif</code> 写成 <code>else if</code> 是 Java 转 Python 时最常见的语法错误之一，冒号也不能漏。",
      "hint": "els(e) + if 缩成一个词。"
    },
    {
      "id": "ch15-t9",
      "ch": "ch15",
      "kp": "ch15-3",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "syntax",
        "python"
      ],
      "stem": "把整数变量 <code>x</code> 转成字符串（讲义里的 casting 写法），应调用内置函数 <code>____(x)</code>。",
      "answer": [
        "str"
      ],
      "explain": "Python 用同名内置函数做类型转换：<code>str(3)</code> 得到 <code>\"3\"</code>、<code>int(3)</code> 得到 3、<code>float(3)</code> 得到 <code>3.0</code>，讲义把这套写法叫 casting。它在拼接和输出时特别重要，因为 Python 不会把数字自动变成字符串，<code>\"年龄：\" + 18</code> 会抛 <code>TypeError</code>，必须写 <code>\"年龄：\" + str(18)</code> 或者直接用 f-string。反过来 <code>int(\"3\")</code> 能把字符串转回整数，但 <code>int(\"abc\")</code> 会抛 <code>ValueError</code>。",
      "hint": "string 的前三个字母；<code>str(3)</code> 得到 <code>\"3\"</code>。"
    },
    {
      "id": "ch15-t10",
      "ch": "ch15",
      "kp": "ch15-8",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "python",
        "exam"
      ],
      "stem": "写出下面程序的输出（逐行）。",
      "codeTitle": "Python",
      "code": "name = \"Tushar\"\nage = 23\nprint(f\"Hello, My name is {name} and I'm {age} years old.\")\nprint(7 // 2, 7 / 2, 2 ** 3)",
      "answer": "Hello, My name is Tushar and I'm 23 years old.\n3 3.5 8",
      "explain": "f-string 里 <code>{name}</code>、<code>{age}</code> 会被替换成变量的值，引号外的普通文字原样输出，花括号本身不会打印，所以第一行是完整的问候语。第二个 <code>print</code> 一次打印三个表达式，<code>print</code> 默认用空格分隔多个参数，输出是 <code>3 3.5 8</code> 而不是 <code>33.58</code>。三个运算分别是：<code>//</code> 整除并向下取整得 3、<code>/</code> 真除法永远返回浮点得 3.5、<code>**</code> 幂运算得 2 的 3 次方 8。",
      "hint": "f-string 的花括号会被替换掉；<code>print</code> 用空格分隔多个参数。"
    },
    {
      "id": "ch15-t11",
      "ch": "ch15",
      "kp": "ch15-1",
      "type": "multi",
      "difficulty": 3,
      "tags": [
        "trap",
        "python",
        "exam"
      ],
      "stem": "下列关于 Python 运算的说法，哪些正确？（多选）",
      "options": [
        {
          "text": "<code>7 // 2</code> 的结果是 <code>3</code>，<code>//</code> 是整除并向下取整",
          "correct": true
        },
        {
          "text": "<code>2 ** 3</code> 的结果是 <code>8</code>，<code>**</code> 是幂运算符",
          "correct": true
        },
        {
          "text": "<code>7 / 2</code> 的结果是 <code>3</code>，与 Java 的整数除法一致"
        },
        {
          "text": "<code>\"3\" + 3</code> 的结果是 <code>\"33\"</code>，加号会自动把数字转成字符串"
        }
      ],
      "explain": "Python 的 <code>/</code> 是真除法，永远返回浮点数：<code>7 / 2</code> 是 3.5，不会像 Java 那样截成 3；要整数除法必须写 <code>//</code>（向下取整，<code>7 // 2</code> 得 3）。<code>**</code> 是幂运算，<code>2 ** 3</code> 得 8，Java 里得靠 <code>Math.pow</code>。加号不负责类型转换，<code>\"3\" + 3</code> 直接抛 <code>TypeError: can only concatenate str (not \"int\") to str</code>，要拼接得写 <code>\"3\" + str(3)</code> 或用 f-string。C、D 都是把 Java 习惯搬到 Python 的典型误解。",
      "hint": "<code>/</code> 和 <code>//</code> 谁返回浮点？字符串加数字会怎样？"
    },
    {
      "id": "ch15-t12",
      "ch": "ch15",
      "kp": "ch15-5",
      "type": "order",
      "difficulty": 2,
      "tags": [
        "syntax",
        "python"
      ],
      "stem": "把\"用 while 循环按下标遍历列表并逐个打印\"的代码按正确顺序排列。",
      "options": [
        {
          "text": "<code>i = i + 1</code>（写在循环体最后）"
        },
        {
          "text": "<code>i = 0</code>"
        },
        {
          "text": "在循环体里打印 <code>print(thislist[i])</code>"
        },
        {
          "text": "<code>while i &lt; len(thislist):</code>"
        }
      ],
      "answer": [
        1,
        3,
        2,
        0
      ],
      "explain": "顺序由三条依赖关系决定：计数器必须先有初值，条件判断必须在循环体之前，循环体执行完才更新计数器。所以先把 <code>i</code> 置 0，再判断 <code>i &lt; len(thislist)</code>，条件成立才进入循环体打印 <code>thislist[i]</code>，最后写 <code>i = i + 1</code> 回到条件。如果把自增放在 print 之前，第一个元素会被跳过、循环末尾还会越界抛 <code>IndexError</code>；如果忘了写自增，条件永远成立，就是死循环。",
      "hint": "初始化 → 判断 → 打印 → 自增。"
    },
    {
      "id": "ch15-f1",
      "ch": "ch15",
      "kp": "ch15-2",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "bug",
        "python",
        "syntax"
      ],
      "stem": "下面程序想输出 1 到 3 的累加和 6，但一运行就报错。找出错误并说明改法。",
      "codeTitle": "Python",
      "code": "total = 0\nfor i in range(1, 4):\ntotal = total + i\nprint(total)",
      "accept": [
        {
          "hint": "指出 for 下面的循环体没有缩进",
          "any": [
            "没有缩进",
            "未缩进",
            "没缩进",
            "缺少缩进",
            "缩进不对",
            "缩进错误"
          ]
        },
        {
          "hint": "指出抛出的是 IndentationError（或 SyntaxError）",
          "any": [
            "IndentationError",
            "indentationerror",
            "SyntaxError",
            "语法错误"
          ]
        },
        {
          "hint": "改法：把 total = total + i 缩进 4 个空格",
          "any": [
            "缩进4",
            "缩进 4",
            "四个空格",
            "4个空格",
            "加缩进",
            "缩进一格",
            "缩进一级"
          ]
        }
      ],
      "minHits": 2,
      "answer": "第 3 行 total = total + i 没有缩进，应缩进 4 个空格，让它成为 for 的循环体",
      "explain": "以冒号结尾的 for 语句，它后面的第一条语句必须缩进，才算\"循环体\"。这里第 3 行顶格写，解释器认为 for 的循环体是空的（下一条语句不属于它），于是抛 <code>IndentationError: expected an indented block</code>，程序一行都不会执行。正确写法是把 <code>total = total + i</code> 缩进 4 个空格：此时循环执行 3 次，total 依次变成 1、3、6，最后 <code>print(total)</code> 输出 6。注意 <code>print</code> 要保持顶格，它在循环结束后只执行一次；如果连 print 也缩进，就会打印 1、3、6 三行。",
      "hint": "冒号后面的第一条语句必须缩进，否则循环体是空的。"
    },
    {
      "id": "ch16-q1",
      "ch": "ch16",
      "kp": "ch16-1",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "python",
        "exam"
      ],
      "stem": "在 Python 里定义类并创建对象，下列说法正确的是？",
      "options": [
        {
          "text": "创建对象必须写 <code>new Dog()</code>，与 Java 一样"
        },
        {
          "text": "类名必须以大写字母开头，否则解释器报错"
        },
        {
          "text": "一个类只能创建一个对象，第二次 <code>Dog()</code> 会返回同一个对象"
        },
        {
          "text": "用 <code>class Dog:</code> 定义类，用 <code>d = Dog()</code> 创建对象",
          "correct": true
        }
      ],
      "explain": "Python 用 <code>class 类名:</code> 定义类，创建对象就是\"调用类\"：<code>d = Dog()</code>，没有 <code>new</code> 关键字。类名首字母大写只是约定（PEP 8 风格），写小写不会报错。每次调用 <code>Dog()</code> 都会新建一个实例（如果类里写了 <code>__init__</code>，就顺带跑一遍初始化），各实例各自持有自己的属性，因此想造几个就造几个。Java 的 <code>new</code>、类名必须大写这两个习惯在这里都不成立。",
      "hint": "Python 里\"调用类\"就等于 new。"
    },
    {
      "id": "ch16-q2",
      "ch": "ch16",
      "kp": "ch16-2",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "python",
        "exam"
      ],
      "stem": "写出下面程序的输出（逐行）。",
      "codeTitle": "Python",
      "code": "class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def birthday(self):\n        self.age = self.age + 1\n\np1 = Person(\"John\", 36)\np1.birthday()\np1.birthday()\nprint(p1.name)\nprint(p1.age)",
      "answer": "John\n38",
      "explain": "<code>Person(\"John\", 36)</code> 会调用 <code>__init__</code>，把 \"John\" 存进 <code>self.name</code>、36 存进 <code>self.age</code>。每次 <code>p1.birthday()</code> 执行的都是\"读旧值、加 1、写回同一个实例属性\"，所以两次调用让 age 从 36 变 37 再变 38；name 从头到尾没被修改，仍是 John。这里的关键是 <code>self</code> 让方法读写的是\"当前这个对象\"的属性，因此两次调用是累加的，而不是每次都从 36 重新开始。",
      "hint": "<code>birthday</code> 改的是 <code>self.age</code>，两次调用会累加。"
    },
    {
      "id": "ch16-q3",
      "ch": "ch16",
      "kp": "ch16-3",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "trap",
        "output",
        "python"
      ],
      "stem": "下面程序的输出是？",
      "codeTitle": "Python",
      "code": "class Dog:\n    tricks = []\n\n    def __init__(self, name):\n        self.name = name\n\n    def add(self, t):\n        self.tricks.append(t)\n\na = Dog(\"a\")\nb = Dog(\"b\")\na.add(\"sit\")\nb.add(\"roll\")\nprint(a.tricks)\nprint(len(Dog.tricks))",
      "options": [
        {
          "text": "<code>['roll']</code> 和 <code>1</code>，因为 b 覆盖了 a 的列表"
        },
        {
          "text": "<code>['sit']</code> 和 <code>1</code>，因为每个实例有独立的 <code>tricks</code>"
        },
        {
          "text": "<code>[]</code> 和 <code>0</code>，因为 <code>tricks</code> 没在 <code>__init__</code> 里赋值"
        },
        {
          "text": "<code>['sit', 'roll']</code> 和 <code>2</code>",
          "correct": true
        }
      ],
      "explain": "<code>tricks = []</code> 写在类体里，是类属性：整个类只创建这一个列表对象，所有实例共享。执行 <code>self.tricks.append(t)</code> 时，实例自身没有 <code>tricks</code>，属性查找沿链回退到类属性拿到同一个列表，而 <code>append</code> 是就地修改，所以 a、b 加进去的元素落在同一个列表里，最后是 [\"sit\", \"roll\"]，<code>Dog.tricks</code> 长度为 2。想让每个实例各有一份，必须在 <code>__init__</code> 里写 <code>self.tricks = []</code>——每次实例化都会新建一个列表。可变对象（list、dict）做类属性是 Python 的经典陷阱。",
      "hint": "<code>append</code> 是就地修改，而类属性只有一个对象。"
    },
    {
      "id": "ch16-t1",
      "ch": "ch16",
      "kp": "ch16-2",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "python"
      ],
      "stem": "关于 <code>__init__</code>，下列说法正确的是？",
      "options": [
        {
          "text": "必须手动调用 <code>p1.__init__()</code>，否则对象没有属性"
        },
        {
          "text": "它必须 <code>return</code> 一个对象，否则创建失败"
        },
        {
          "text": "名字可以随便改，比如写成 <code>init</code>，效果一样"
        },
        {
          "text": "它在创建对象时被自动调用，用来给实例属性赋初值",
          "correct": true
        }
      ],
      "explain": "<code>__init__</code> 是初始化方法：执行 <code>Person(\"John\", 36)</code> 时，解释器先造出实例，再自动调用 <code>__init__(实例, \"John\", 36)</code>，把实参按位置绑定到 name、age，最终写进这个实例的属性。名字必须前后各两个下划线、一字不差地叫 <code>__init__</code>；改成 <code>init</code> 就只是一个普通方法，实例化时不会执行，属性也就不存在。<code>__init__</code> 只负责初始化、不负责返回对象，它必须返回 <code>None</code>，硬写 <code>return 对象</code> 反而抛 <code>TypeError</code>。",
      "hint": "<code>__init__</code> 是\"初始化\"，不是\"新建\"。"
    },
    {
      "id": "ch16-t2",
      "ch": "ch16",
      "kp": "ch16-4",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "trap",
        "python",
        "exam"
      ],
      "stem": "在 <code>Person</code> 类里写了 <code>self.__deposit = 1000</code>，在类外面执行 <code>print(p1.__deposit)</code> 会怎样？",
      "options": [
        {
          "text": "抛 <code>SyntaxError</code>，因为类外部不允许写双下划线"
        },
        {
          "text": "打印 <code>None</code>，私有属性对外一律返回 None"
        },
        {
          "text": "正常打印 <code>1000</code>"
        },
        {
          "text": "抛 <code>AttributeError</code>，因为这个名字在类里被改写成了 <code>_Person__deposit</code>",
          "correct": true
        }
      ],
      "explain": "名字以两个下划线开头（且不以两个下划线结尾）的属性会触发 name mangling：类内部的 <code>self.__deposit</code> 被改写成 <code>self._Person__deposit</code>，所以类外写 <code>p1.__deposit</code> 找的是另一个名字，找不到就抛 <code>AttributeError</code>。这正是讲义说的\"私有属性不能在类外直接访问\"，而类内方法（如 <code>print_deposit</code>）读的是改写后的名字，因此能正常工作。要清楚它只是改名而不是上锁：<code>p1._Person__deposit</code> 依然读得到，Python 的私有靠约定而不是强制。",
      "hint": "双下划线触发 name mangling：类名会被插进属性名里。"
    },
    {
      "id": "ch16-t3",
      "ch": "ch16",
      "kp": "ch16-6",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept",
        "python",
        "exam"
      ],
      "stem": "子类 <code>class Student(Person):</code> 的 <code>__init__</code> 里调用 <code>super().__init__(fname, lname)</code>，作用是？",
      "options": [
        {
          "text": "把 Person 的所有方法复制一份到 Student 里"
        },
        {
          "text": "只能写在子类 <code>__init__</code> 的最后一行，否则报错"
        },
        {
          "text": "新建一个 Person 对象并返回给子类使用"
        },
        {
          "text": "调用父类的 <code>__init__</code>，让父类的初始化代码在\"当前这个子类实例\"上执行",
          "correct": true
        }
      ],
      "explain": "<code>super()</code> 返回父类的代理，<code>super().__init__(fname, lname)</code> 就是把\"设置 firstname / lastname\"那段父类代码拿来，作用在当前的 Student 实例上，并不会新建对象。不写这一句，<code>self.firstname</code> 根本不会被创建，子类里任何访问它的地方都会抛 <code>AttributeError</code>。位置一般放在子类 <code>__init__</code> 开头，先让父类准备好公共属性，再设置 <code>self.graduationyear</code> 这类子类特有属性；并没有\"必须在最后一行\"的规定。",
      "hint": "<code>super()</code> 返回父类代理，调的是父类 <code>__init__</code>，作用在当前实例上。"
    },
    {
      "id": "ch16-t4",
      "ch": "ch16",
      "kp": "ch16-5",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "output",
        "python",
        "exam"
      ],
      "stem": "类里定义了 <code>def __str__(self): return f\"{self.name}({self.age})\"</code>，创建 <code>p1 = Person(\"John\", 36)</code> 后执行 <code>print(p1)</code>，输出是？",
      "options": [
        {
          "text": "<code>&lt;__main__.Person object at 0x...&gt;</code>"
        },
        {
          "text": "<code>None</code>，因为 <code>print</code> 打印对象时没有返回值"
        },
        {
          "text": "抛 <code>TypeError</code>，因为 <code>print</code> 不能打印自定义类的对象"
        },
        {
          "text": "<code>John(36)</code>",
          "correct": true
        }
      ],
      "explain": "<code>print</code> 会先对参数调用 <code>str()</code>，而 <code>str()</code> 优先使用类里定义的 <code>__str__</code>，所以输出它返回的那个字符串 <code>John(36)</code>。若没定义 <code>__str__</code>，才会退回到默认的 <code>&lt;__main__.Person object at 0x...&gt;</code>（类名 + 内存地址），那正是 B 描述的情况，也说明默认打印对调试没帮助。<code>__str__</code> 必须 <code>return</code> 字符串，只在里面 <code>print</code> 而不 return 会得到 <code>TypeError: __str__ returned non-string (type NoneType)</code>。",
      "hint": "<code>print</code> 对对象调用 <code>str()</code>，<code>str()</code> 优先找 <code>__str__</code>。"
    },
    {
      "id": "ch16-t5",
      "ch": "ch16",
      "kp": "ch16-2",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "syntax",
        "python",
        "exam"
      ],
      "stem": "判断：Python 类中定义方法时，第一个参数 <code>self</code> 必须显式写出来；调用 <code>p1.myfunc()</code> 时解释器会自动把 <code>p1</code> 传给这个参数。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "Python 的方法本质上是\"类里的普通函数 + 自动绑定\"：定义时要自己写出 <code>self</code>（名字可以换，但约定叫 self），调用 <code>p1.myfunc()</code> 时解释器会把 <code>p1</code> 作为第一个实参塞进去，方法内部才能用 <code>self.name</code> 访问这个对象的属性。漏写 <code>self</code> 的典型症状是 <code>TypeError: myfunc() takes 0 positional arguments but 1 was given</code>——参数个数对不上。这也是 Java 转 Python 时最高频的错误：Java 的 this 是隐式的，Python 的 self 必须写。",
      "hint": "Java 的 this 是隐式的，Python 的 self 呢？"
    },
    {
      "id": "ch16-t6",
      "ch": "ch16",
      "kp": "ch16-7",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "trap",
        "python",
        "exam"
      ],
      "stem": "判断：<code>try/except</code> 语句里的 <code>finally</code> 块，只在没有发生异常时才执行。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "<code>finally</code> 的含义就是\"无论如何都执行\"：try 正常跑完要执行，抛了异常且被 except 接住要执行，异常没被接住、程序即将崩掉之前也照样执行。所以它最适合放必须收尾的代码，讲义的例子就是把 <code>f.close()</code> 放进 finally，保证文件一定被关闭。只在\"没有异常时\"执行的是 <code>else</code> 块，题干把 else 和 finally 弄混了。",
      "hint": "<code>finally</code> = 无论结果如何；哪个块才是\"没出错才执行\"？"
    },
    {
      "id": "ch16-t7",
      "ch": "ch16",
      "kp": "ch16-6",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "syntax",
        "python"
      ],
      "stem": "子类的 <code>__init__</code> 里要调用父类的构造方法，Python 3 的写法是 <code>____().__init__(fname, lname)</code>。",
      "answer": [
        "super"
      ],
      "accept": [
        "super()"
      ],
      "explain": "<code>super()</code> 返回父类的代理对象，再点 <code>__init__</code> 就调到父类的初始化方法，实参要和父类定义的一致。它的好处是不写死父类名字：以后把 <code>class Student(Person)</code> 改成继承别的类，这一行也不用改。Tutorial 里另一种写法 <code>people.__init__(self, n, a, w)</code> 把父类名写死了，父类改名就得同步改。也别漏掉括号，写成 <code>super.__init__(...)</code> 是把函数当普通属性取出来，不会自动绑定 self，会报参数错误。",
      "hint": "内置函数 <code>super()</code>，记得带括号。"
    },
    {
      "id": "ch16-t8",
      "ch": "ch16",
      "kp": "ch16-8",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "syntax",
        "python",
        "project"
      ],
      "stem": "用 <code>random.randint(1, 6)</code> 模拟掷骰子，返回值可能是 1、2、3、4、5、____。",
      "answer": [
        "6"
      ],
      "explain": "<code>randint(a, b)</code> 返回 a 到 b 之间的随机整数，两个端点都能取到（闭区间），所以 <code>randint(1, 6)</code> 有 6 种等概率结果，正好对应一颗骰子。这和 <code>range(1, 6)</code> 不同——range 的右端点是开区间，只到 5，很容易记混。使用前必须先 <code>import random</code>，再用 <code>random.randint(...)</code> 调用；讲义里生成蛇身食物的坐标就是靠它随机取格子。",
      "hint": "<code>randint</code> 的两个端点都能取到。"
    },
    {
      "id": "ch16-t9",
      "ch": "ch16",
      "kp": "ch16-7",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "syntax",
        "python"
      ],
      "stem": "<code>try/except</code> 结构中，当 try 块里的代码顺利执行、没有抛出异常时才会执行的块是 <code>____</code>。",
      "answer": [
        "else"
      ],
      "explain": "Python 的 try 语句可以带四个块：<code>try</code> 放可能出错的代码，<code>except</code> 接住并处理异常，<code>else</code> 在\"try 没有抛异常\"时执行，<code>finally</code> 无论成败都执行。用 else 的好处是把\"受保护的语句\"和\"成功后才做的后续处理\"分开，try 里只留真正可能出错的那几行，异常处理逻辑更清楚。最容易混的是 else 与 finally：else 有前提（没异常），finally 无条件。",
      "hint": "有异常走 except，没异常走哪个块？"
    },
    {
      "id": "ch16-t10",
      "ch": "ch16",
      "kp": "ch16-5",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "python",
        "exam"
      ],
      "stem": "写出下面程序的输出（逐行）。",
      "codeTitle": "Python",
      "code": "class Person:\n    def __init__(self, name):\n        self.name = name\n\n    def __str__(self):\n        return \"Person:\" + self.name\n\nclass Student(Person):\n    def __init__(self, name, grade):\n        super().__init__(name)\n        self.grade = grade\n\n    def __str__(self):\n        return super().__str__() + \"/\" + str(self.grade)\n\ns = Student(\"Mike\", 3)\nprint(s)\nprint(s.name)",
      "answer": "Person:Mike/3\nMike",
      "explain": "Student 重写了 <code>__str__</code>，<code>print(s)</code> 调用的是 Student 版本：它先用 <code>super().__str__()</code> 拿到父类拼出的 <code>Person:Mike</code>，再拼上斜杠和 <code>str(self.grade)</code>（3 必须先转字符串，否则字符串加 int 抛 <code>TypeError</code>），得到 <code>Person:Mike/3</code>。第二行直接取属性 <code>s.name</code>，它在父类 <code>__init__</code> 里被设置，而子类通过 <code>super().__init__(name)</code> 执行了这段父类初始化，所以打印 Mike。",
      "hint": "<code>super().__str__()</code> 先拿到父类那段字符串，再拼接子类部分。"
    },
    {
      "id": "ch16-t11",
      "ch": "ch16",
      "kp": "ch16-7",
      "type": "multi",
      "difficulty": 2,
      "tags": [
        "concept",
        "python",
        "exam"
      ],
      "stem": "下列哪些是 Python 异常处理里真实存在的关键字？（多选）",
      "options": [
        {
          "text": "<code>try</code>",
          "correct": true
        },
        {
          "text": "<code>except</code>",
          "correct": true
        },
        {
          "text": "<code>finally</code>",
          "correct": true
        },
        {
          "text": "<code>catch</code>"
        },
        {
          "text": "<code>throw</code>"
        }
      ],
      "explain": "Python 用 <code>try</code> 圈出受保护的代码，用 <code>except</code> 接住异常（可以写 <code>except ValueError:</code> 指定类型，也可以裸 <code>except:</code> 接全部），<code>else</code> 处理\"没出错\"的情况，<code>finally</code> 做无论如何都要执行的收尾。<code>catch</code> 与 <code>throw</code> 都是 Java 的关键字（Java 是 try/catch/finally，抛异常用 throw），在 Python 里写 <code>catch</code> 会直接 <code>SyntaxError</code>；Python 抛异常用 <code>raise</code>。",
      "hint": "Java 是 try/catch，Python 是 try/except。"
    },
    {
      "id": "ch16-t12",
      "ch": "ch16",
      "kp": "ch16-6",
      "type": "order",
      "difficulty": 2,
      "tags": [
        "syntax",
        "python"
      ],
      "stem": "执行 <code>s = Student(\"Mike\", \"Olsen\")</code> 时，下面这些步骤的正确先后顺序是？",
      "options": [
        {
          "text": "在父类 <code>Person.__init__</code> 里给 <code>self.firstname</code>、<code>self.lastname</code> 赋值"
        },
        {
          "text": "解释器创建 Student 实例，并调用 <code>Student.__init__</code>"
        },
        {
          "text": "回到 <code>Student.__init__</code>，执行 <code>self.graduationyear = 2019</code>"
        },
        {
          "text": "执行子类里的 <code>super().__init__(fname, lname)</code>"
        }
      ],
      "answer": [
        1,
        3,
        0,
        2
      ],
      "explain": "实例化时先创建 Student 实例并执行子类的 <code>__init__</code>；遇到 <code>super().__init__(fname, lname)</code> 就转去执行父类初始化，父类那两行把 firstname、lastname 设好；返回子类后继续执行剩下的语句，设置 graduationyear。这个顺序的意义是\"父类先准备好公共属性，子类再补自己的属性\"；把 <code>self.graduationyear</code> 写到 super 之前也能跑，但只要子类后续逻辑依赖父类属性就会 <code>AttributeError</code>。",
      "hint": "子类 <code>__init__</code> 先开始，进 <code>super()</code> 去父类，再回来。"
    },
    {
      "id": "ch16-f1",
      "ch": "ch16",
      "kp": "ch16-2",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "bug",
        "python",
        "exam"
      ],
      "stem": "下面程序想打印 \"Hello my name is John\"，但一调用就报错。找出错误并说明改法。",
      "codeTitle": "Python",
      "code": "class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def myfunc():\n        print(\"Hello my name is \" + self.name)\n\np1 = Person(\"John\", 36)\np1.myfunc()",
      "accept": [
        {
          "hint": "指出 myfunc 的参数表里少了 self",
          "any": [
            "少了self",
            "缺少self",
            "没有self",
            "缺self",
            "漏了self",
            "补self",
            "加self",
            "写上self"
          ]
        },
        {
          "hint": "指出调用时实例被自动当作第一个参数传入，参数个数不匹配",
          "any": [
            "TypeError",
            "typeerror",
            "参数",
            "positional",
            "自动传入",
            "自动传",
            "绑定"
          ]
        },
        {
          "hint": "改法：写成 def myfunc(self)",
          "any": [
            "defmyfunc(self)",
            "myfunc(self)",
            "def myfunc(self)",
            "(self)"
          ]
        }
      ],
      "minHits": 2,
      "answer": "第 6 行应写成 def myfunc(self):，方法必须显式接收 self",
      "explain": "Python 在调用 <code>p1.myfunc()</code> 时会把 <code>p1</code> 自动作为第一个实参传进去，等价于 <code>Person.myfunc(p1)</code>。这里定义的是无参的 <code>def myfunc():</code>，却收到一个参数，于是抛 <code>TypeError: myfunc() takes 0 positional arguments but 1 was given</code>；同时函数体里的 <code>self</code> 也没有定义，改完参数表后才会有值。正确写法是 <code>def myfunc(self):</code>，这也是章节里最高频的错误——Java 的 this 隐式可用，Python 的 self 必须写出来。",
      "hint": "方法括号里少了什么？调用时谁会替你传第一个参数？"
    },
    {
      "id": "ch17-q1",
      "ch": "ch17",
      "kp": "ch17-1",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "tkinter",
        "exam"
      ],
      "stem": "关于 Tkinter，下列说法正确的是？",
      "options": [
        {
          "text": "它是 Python 自带的 GUI 模块，不需要额外安装，并提供面向对象的接口",
          "correct": true
        },
        {
          "text": "它是第三方库，必须先执行 <code>pip install tkinter</code> 才能使用"
        },
        {
          "text": "它只能写命令行程序，无法创建窗口和按钮"
        },
        {
          "text": "它用 XML 文件描述界面，Python 代码只负责绑定事件"
        }
      ],
      "explain": "讲义对 Tkinter 的三个定性是：简单易用、无需安装、面向对象的接口。它是 Python 标准库自带的模块，用 <code>import tkinter as tk</code> 就能用，不存在\"先 pip 安装\"这一步，所以 B 错。Tkinter 正是用来做窗口、按钮这些图形界面元素的，C 说反了。用 XML 描述界面是 JavaFX 的 FXML、Android 的布局文件那类做法，Tkinter 的界面完全由 Python 代码创建 widget 得到，D 也不对。",
      "hint": "讲义列了 Tkinter 的三个特点：简单、免安装、面向对象。"
    },
    {
      "id": "ch17-q2",
      "ch": "ch17",
      "kp": "ch17-4",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "tkinter",
        "exam"
      ],
      "stem": "写出下面程序的输出（逐行）。",
      "codeTitle": "Python",
      "code": "import tkinter as tk\n\nroot = tk.Tk()\non_hit = False\n\ndef hit_me():\n    global on_hit\n    on_hit = not on_hit\n    print(on_hit)\n\nhit_me()\nhit_me()\nhit_me()",
      "answer": "True\nFalse\nTrue",
      "explain": "这里 <code>hit_me</code> 没有被按钮回调，而是被直接调用了三次（函数名后面加括号就是立刻执行，这正是 <code>command=</code> 那个陷阱的另一面）。函数体里的 <code>global on_hit</code> 声明\"我要改的是模块级那个变量\"，否则 <code>on_hit = not on_hit</code> 会被当成新建局部变量并抛 <code>UnboundLocalError</code>。<code>not</code> 每执行一次就翻转一次：False→True→False→True，所以三行输出依次是 True、False、True。",
      "hint": "<code>not</code> 每调用一次翻转一次，注意 <code>global</code> 的作用。"
    },
    {
      "id": "ch17-q3",
      "ch": "ch17",
      "kp": "ch17-5",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "trap",
        "tkinter",
        "exam"
      ],
      "stem": "在同一个父容器里，先对 <code>label1</code> 调用 <code>pack()</code>，再对 <code>label2</code> 调用 <code>grid(row=0, column=1)</code>，程序会怎样？",
      "options": [
        {
          "text": "后调用的 grid 会覆盖 pack，只显示 label2，但不报错"
        },
        {
          "text": "编译阶段就报错，程序无法启动"
        },
        {
          "text": "两个标签都正常显示，一个在上、一个在右"
        },
        {
          "text": "运行时抛 <code>TclError</code>：该父容器已经由 pack 管理，不能再交给 grid",
          "correct": true
        }
      ],
      "explain": "Tk 的三个几何管理器（pack / grid / place）是\"抢地盘\"的：一个父容器只能由其中一种来排布它的子 widget。已经在同一父容器里用过 <code>pack()</code>，再对另一个子 widget 用 <code>grid()</code>，运行到那一行时就会抛 <code>TclError: cannot use geometry manager grid inside . which already has slaves managed by pack</code>。Python 的编译只做语法检查，抓不到这种\"运行时才成立的约束\"，所以 D 说的\"编译阶段就报错、程序无法启动\"不成立——程序能启动，跑到这一行才崩。正确做法是统一用同一种管理器；确实想混用，就把它们放进不同的 Frame，各自管理自己的子 widget。",
      "hint": "三个几何管理器互斥，谁先占了父容器谁说话。"
    },
    {
      "id": "ch17-t1",
      "ch": "ch17",
      "kp": "ch17-2",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "tkinter"
      ],
      "stem": "关于 <code>root.mainloop()</code>，下列说法正确的是？",
      "options": [
        {
          "text": "它只负责把窗口画一次，画完立刻返回，程序继续往下走"
        },
        {
          "text": "它负责创建根窗口，所以必须写在 <code>tk.Tk()</code> 之前"
        },
        {
          "text": "它会让程序卡死，所以 Python 程序里不应该调用它"
        },
        {
          "text": "它启动事件循环，让窗口显示并持续处理鼠标、键盘等事件，直到窗口被销毁才返回",
          "correct": true
        }
      ],
      "explain": "<code>mainloop()</code> 是 Tkinter 的事件循环，而且是阻塞的：进入后程序停在这行，不停\"取事件 → 分发 → 重绘\"，直到窗口被销毁才返回，它后面的语句这时才执行。讲义里那个计时例子正是靠这一点：<code>root.after(5000, root.destroy)</code> 让 5 秒后关窗，<code>mainloop()</code> 返回后才打印 \"Destroyed after 5 seconds\"。它不创建窗口（创建窗口的是 <code>Tk()</code>），也不是\"没有出口的死循环\"——关闭窗口就是出口。",
      "hint": "mainloop 返回之后代码才继续往下走，想想讲义那个计时例子。"
    },
    {
      "id": "ch17-t2",
      "ch": "ch17",
      "kp": "ch17-3",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept",
        "tkinter"
      ],
      "stem": "用户在一个名为 <code>e</code> 的 <code>Entry</code> 里输入了文字，程序想把它读出来，应调用？",
      "options": [
        {
          "text": "<code>e.text</code>"
        },
        {
          "text": "<code>e.read()</code>"
        },
        {
          "text": "<code>e.value</code>"
        },
        {
          "text": "<code>e.get()</code>",
          "correct": true
        }
      ],
      "explain": "<code>Entry</code> 是单行输入框：取内容用 <code>get()</code>，往里写用 <code>insert()</code>。Tutorial 的例子就是先把 <code>var = e.get()</code> 取出来，再用 <code>t.insert(\"insert\", var)</code> 插到 Text 里。<code>text</code>、<code>read()</code>、<code>value</code> 都不是 Entry 的方法或属性，写了会抛 <code>AttributeError</code>。还要记住 <code>get()</code> 返回的永远是字符串，要当数字用必须先 <code>int()</code>/<code>float()</code> 转换。",
      "hint": "输入框取值和 Python 里 dict 取值同名。"
    },
    {
      "id": "ch17-t3",
      "ch": "ch17",
      "kp": "ch17-6",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "trap",
        "tkinter",
        "output"
      ],
      "stem": "<code>canvas.create_rectangle(20, 30, 60, 80)</code> 画出的矩形，这四个数字的含义是？",
      "options": [
        {
          "text": "左上角 (20, 30) 与右下角 (60, 80)，所以宽 40、高 50",
          "correct": true
        },
        {
          "text": "左上角 (20, 30) 与宽 60、高 80"
        },
        {
          "text": "中心点 (20, 30) 与宽 60、高 80"
        },
        {
          "text": "左上角 (20, 30) 与右上角 (60, 80)，高度由画布决定"
        }
      ],
      "explain": "<code>create_rectangle(x1, y1, x2, y2)</code> 给的是矩形的两个对角点：前两个是左上角坐标，后两个是右下角坐标，因此宽 = 60 − 20 = 40、高 = 80 − 30 = 50。Canvas 的坐标原点在左上角，x 向右增大、y 向下增大，所以 y=30 的那条边在上、y=80 的在下面。同样的四个数在 <code>create_oval</code> 里表示外接矩形，含义一致。Snake 项目里画一格写 <code>x, y, x + cell_size, y + cell_size</code>，正是用左上角加格子边长算出右下角，所以画出来永远是边长 cell_size 的方块。",
      "hint": "<code>create_rectangle</code> 收的是两个对角点，不是宽和高。"
    },
    {
      "id": "ch17-t4",
      "ch": "ch17",
      "kp": "ch17-7",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept",
        "tkinter",
        "exam"
      ],
      "stem": "用 <code>root.bind(\"&lt;Key&gt;\", key_press)</code> 绑定按键后，处理函数里怎么知道用户按了哪个键？",
      "options": [
        {
          "text": "从全局变量 <code>key</code> 里读，Tkinter 会自动写入"
        },
        {
          "text": "把函数写成无参的 <code>def key_press():</code> 即可，Tkinter 会把键名放进函数名里"
        },
        {
          "text": "无法知道，Tkinter 只通知\"有键按下\"，不告诉是哪个键"
        },
        {
          "text": "处理函数接收一个 event 参数，从 <code>event.keysym</code> 读键名（如 Left、Right、Up、Down）",
          "correct": true
        }
      ],
      "explain": "用 <code>bind</code> 注册的处理函数必须能接收一个参数——Tkinter 会把事件对象传给它。键名在 <code>event.keysym</code> 里（方向键是 <code>Left</code>/<code>Right</code>/<code>Up</code>/<code>Down</code>），字符在 <code>event.char</code>，鼠标位置在 <code>event.x</code>/<code>event.y</code>。Snake 项目的 <code>change_direction(self, event)</code> 就是靠 <code>event.keysym</code> 判断方向的。如果定义成无参函数，被回调时会抛 <code>TypeError</code>（多给了一个参数），所以 <code>event</code> 这个形参不能省。",
      "hint": "绑定函数的第一个参数就是事件对象。"
    },
    {
      "id": "ch17-t5",
      "ch": "ch17",
      "kp": "ch17-8",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "concept",
        "tkinter",
        "exam"
      ],
      "stem": "判断：<code>root.after(100, run_game)</code> 表示\"100 毫秒之后调用一次 run_game\"；要让它持续循环，必须在 run_game 里面再调用一次 <code>after</code>。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "<code>after(ms, func)</code> 只是\"定时一次\"：把 func 排进事件队列，ms 毫秒后由事件循环调用一次就结束，它本身不会重复。Snake 的主循环之所以能一直跑，是因为 <code>run_game</code> 最后一行又写了 <code>self.after(100, self.run_game)</code>，每次执行完都重新预约下一次，形成自我调度的循环。这样做的好处是两次调用之间控制权回到 <code>mainloop()</code>，界面能刷新、按键能响应，而不会像 <code>while True</code> 那样把主线程占死。",
      "hint": "after 只排一次，循环要靠函数自己再排一次。"
    },
    {
      "id": "ch17-t6",
      "ch": "ch17",
      "kp": "ch17-8",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "trap",
        "tkinter",
        "exam"
      ],
      "stem": "判断：在 Tkinter 里把 <code>after()</code> 换成 <code>while True:</code> 加 <code>time.sleep(0.1)</code> 也一样能让界面保持响应，因为两者都在\"等时间\"。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "Tkinter 的 GUI 跑在单线程里，所有绘制和事件分发都由 <code>mainloop()</code> 完成。你在主线程写 <code>while True</code> 就永远回不到事件循环，<code>sleep</code> 期间更是彻底阻塞：窗口不重绘、按键没反应，Windows 上还会显示\"未响应\"。<code>after()</code> 的差别在于它不阻塞——只是向事件循环登记\"过 ms 毫秒叫我一次\"，登记完立刻返回，控制权仍在 mainloop 手上。所以\"等待\"要交给事件循环做，而不是自己 sleep。",
      "hint": "Tkinter 是单线程，谁占了主线程谁就卡住界面。"
    },
    {
      "id": "ch17-t7",
      "ch": "ch17",
      "kp": "ch17-2",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "syntax",
        "tkinter"
      ],
      "stem": "用 <code>import tkinter as tk</code> 时，创建根窗口的语句是 <code>root = tk.____()</code>。",
      "answer": [
        "Tk"
      ],
      "accept": [
        "Tk",
        "tk"
      ],
      "explain": "Tkinter 的根窗口由 <code>Tk</code> 类创建，所以写 <code>root = tk.Tk()</code>；若用 <code>from tkinter import *</code>，就直接写 <code>root = Tk()</code>。讲义两种写法都出现过。拿到 root 之后才能 <code>root.title(\"Snake Game\")</code>、<code>root.geometry(\"800x800\")</code>，并把它作为父容器传给各个 widget。注意大小写：<code>Tk</code> 的 T 大写、k 小写，写成 <code>TK()</code> 会 <code>NameError</code>。",
      "hint": "类名是 Tk，两个字母，T 大写。"
    },
    {
      "id": "ch17-t8",
      "ch": "ch17",
      "kp": "ch17-5",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "syntax",
        "tkinter"
      ],
      "stem": "用 grid 把一个 widget 放到第 2 行、第 3 列（行列都从 0 开始数），写法是 <code>w.grid(row=1, ____=2)</code>。",
      "answer": [
        "column"
      ],
      "explain": "<code>grid()</code> 把父容器切成二维表格，用关键字参数 <code>row</code> 与 <code>column</code> 指定格子，两者都从 0 开始计数：第 2 行是 <code>row=1</code>，第 3 列是 <code>column=2</code>。因为是关键字参数，书写顺序无所谓（<code>grid(column=2, row=1)</code> 效果相同），但名字不能写错，写成 <code>col</code> 之类会抛 <code>TclError</code>。对比 JavaFX 的 <code>GridPane.add(node, column, row)</code> 是\"先列后行\"的位置参数，两边很容易记混。",
      "hint": "列是 column，行是 row。"
    },
    {
      "id": "ch17-t9",
      "ch": "ch17",
      "kp": "ch17-8",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "syntax",
        "tkinter"
      ],
      "stem": "要让窗口在 5 秒后自动关闭、让 <code>mainloop()</code> 返回，可以写 <code>root.after(5000, root.____)</code>。",
      "answer": [
        "destroy"
      ],
      "accept": [
        "destroy()"
      ],
      "explain": "<code>destroy()</code> 是通用的 widget 方法，作用在 root 上就是销毁主窗口，<code>mainloop()</code> 随之返回。讲义的例子正是 <code>root.after(5000, root.destroy)</code>，之后才执行到 <code>end = time()</code>、打印 \"Destroyed after 5 seconds\"。注意传给 after 的是方法对象 <code>root.destroy</code>，不要写成 <code>root.destroy()</code>——那样会在登记的时候就立刻关窗。对普通 widget 调用 <code>widget.destroy()</code> 则是把它从界面上移除。",
      "hint": "销毁窗口的方法，别加括号。"
    },
    {
      "id": "ch17-t10",
      "ch": "ch17",
      "kp": "ch17-6",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "tkinter",
        "project"
      ],
      "stem": "Snake 里用 <code>canvas.create_rectangle(x, y, x + cell_size, y + cell_size)</code> 画每个格子。写出下面程序的输出（逐行）。",
      "codeTitle": "Python",
      "code": "cell_size = 20\nsnake = [(60, 40), (40, 40)]\nfood = (100, 20)\nfor x, y in snake:\n    print(x, y, x + cell_size, y + cell_size)\nprint(food[0] + cell_size, food[1] + cell_size)",
      "answer": "60 40 80 60\n40 40 60 60\n120 40",
      "explain": "循环用元组解包 <code>for x, y in snake</code> 依次取出每个坐标；<code>print(x, y, x + cell_size, y + cell_size)</code> 一次打印 4 个数并用空格分开：第一个格子 (60, 40) 得到 60 40 80 60，第二个 (40, 40) 得到 40 40 60 60。食物是一个单独的元组，用 <code>food[0]</code>、<code>food[1]</code> 取 x、y，各加 20 得 120 40。这三组数正是\"左上角 + 右下角\"，在 Canvas 上画出三个 20×20 的方块；注意 <code>print</code> 多个参数之间是空格，不是逗号。",
      "hint": "<code>print</code> 多个参数用空格分隔，别漏了元组解包。"
    },
    {
      "id": "ch17-t11",
      "ch": "ch17",
      "kp": "ch17-5",
      "type": "multi",
      "difficulty": 2,
      "tags": [
        "concept",
        "tkinter",
        "exam"
      ],
      "stem": "下列关于 Tkinter 几何管理器（geometry manager）的说法，哪些正确？（多选）",
      "options": [
        {
          "text": "<code>pack()</code> 把 widget 按行或列的顺序依次排布",
          "correct": true
        },
        {
          "text": "<code>grid()</code> 把 widget 放进二维表格，用 <code>row</code>/<code>column</code> 指定格子",
          "correct": true
        },
        {
          "text": "<code>place()</code> 用 <code>x</code>/<code>y</code> 坐标显式指定位置",
          "correct": true
        },
        {
          "text": "同一个父容器里可以随意混用 <code>pack()</code> 与 <code>grid()</code>"
        },
        {
          "text": "<code>grid()</code> 的 <code>row</code> 和 <code>column</code> 从 1 开始计数"
        }
      ],
      "explain": "三个管理器各有定位方式：<code>pack()</code> 按加入顺序在一行或一列里排列（还可以配 <code>side</code>、<code>padx</code>、<code>pady</code>），<code>grid()</code> 铺成二维表格用 <code>row</code>/<code>column</code> 定位，<code>place()</code> 用绝对坐标 <code>x</code>/<code>y</code> 精确摆放。两条硬规则：同一个父容器只能用其中一种，混用会抛 <code>TclError</code>；<code>grid</code> 的行列都从 0 开始计数。想混用就把 widget 分装到不同的 Frame 里。",
      "hint": "三者互斥；grid 从 0 开始计数。"
    },
    {
      "id": "ch17-t12",
      "ch": "ch17",
      "kp": "ch17-1",
      "type": "order",
      "difficulty": 2,
      "tags": [
        "syntax",
        "tkinter",
        "exam"
      ],
      "stem": "把讲义里\"在窗口里显示一个按钮\"的四步按正确顺序排列。",
      "options": [
        {
          "text": "在 frame 里创建按钮：<code>button = Button(frame, text=\"Geek\")</code>"
        },
        {
          "text": "创建根窗口：<code>root = Tk()</code>"
        },
        {
          "text": "调用事件循环：<code>root.mainloop()</code>"
        },
        {
          "text": "在 root 里创建 frame 并调用 <code>frame.pack()</code> 让它显示"
        }
      ],
      "answer": [
        1,
        3,
        0,
        2
      ],
      "explain": "依赖链决定顺序：没有 root 就没有父容器，所以先建根窗口；frame 的 parent 是 root，创建后才能 pack；button 的 parent 是 frame，frame 不先存在就传不进去；最后才调用 <code>mainloop()</code> 进入事件循环，窗口和按钮这时才真正显示并接受点击。讲义把这几步写成：Create root window → Create frame inside root window and call geometry method → Create button inside frame → Call Tkinter event loop。常见的错误顺序是先 mainloop 再建 widget，那样窗口里会是空的。",
      "hint": "谁是谁的 parent？mainloop 一定在最后。"
    },
    {
      "id": "ch17-f1",
      "ch": "ch17",
      "kp": "ch17-4",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "bug",
        "tkinter",
        "exam"
      ],
      "stem": "下面程序想做到\"点按钮时打印 You hit me!\"，但按钮点下去没有任何反应。找出错误并说明改法。",
      "codeTitle": "Python",
      "code": "import tkinter as tk\n\nroot = tk.Tk()\n\ndef hit_me():\n    print(\"You hit me!\")\n\nb = tk.Button(root, text=\"hello\", command=hit_me())\nb.pack()\nroot.mainloop()",
      "accept": [
        {
          "hint": "指出 command=hit_me() 多了括号，函数在创建按钮时就被执行了",
          "any": [
            "hit_me()",
            "括号",
            "立即执行",
            "马上执行",
            "立刻执行",
            "提前执行"
          ]
        },
        {
          "hint": "指出应写成 command=hit_me，只把函数名（引用）交给按钮",
          "any": [
            "command=hit_me",
            "去掉括号",
            "不要括号",
            "不加括号",
            "只传函数名",
            "函数名"
          ]
        },
        {
          "hint": "指出 command 收到的是 None，点击时不会再调用函数",
          "any": [
            "none",
            "无反应",
            "没反应",
            "不会执行",
            "返回值"
          ]
        }
      ],
      "minHits": 2,
      "answer": "把 command=hit_me() 改成 command=hit_me，去掉括号",
      "explain": "<code>command</code> 要的是\"一个将来可以被调用的函数对象\"，不是\"函数调用的结果\"。写 <code>hit_me()</code> 会在创建 Button 的那一瞬间就把函数执行掉（所以窗口还没出来，\"You hit me!\" 已经打印过一次），然后把返回值 <code>None</code> 交给按钮；点击时 Tkinter 试图调用 <code>None</code>，什么也不会发生。去掉括号后传的是函数本身，点击时由 Tkinter 替你调用它。这和 <code>bind(\"&lt;Key&gt;\", handler)</code> 里写 <code>handler</code> 而不是 <code>handler()</code> 是同一条规律：回调参数传的是函数引用。",
      "hint": "command 要的是函数对象，不是函数调用的结果。"
    },
    {
      "id": "ch18-q1",
      "ch": "ch18",
      "kp": "ch18-3",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "python",
        "tkinter"
      ],
      "stem": "贪吃蛇的入口是 <code>game = SnakeGame()</code> 和 <code>game.mainloop()</code>，而类写作 <code>class SnakeGame(tk.Tk)</code>。关于这个结构，下列说法正确的是？",
      "options": [
        {
          "text": "<code>class SnakeGame(tk.Tk)</code> 表示 <code>SnakeGame</code> 有一个 <code>tk.Tk</code> 类型的字段，窗口必须另写 <code>self.window = tk.Tk()</code>"
        },
        {
          "text": "<code>mainloop()</code> 必须写在 <code>__init__</code> 的最后，否则窗口根本不会出现"
        },
        {
          "text": "因为继承了 <code>tk.Tk</code>，<code>SnakeGame</code> 不能再调用 <code>title()</code>、<code>geometry()</code> 这些窗口方法"
        },
        {
          "text": "<code>SnakeGame</code> 继承 <code>tk.Tk</code>，<code>__init__</code> 里先调 <code>super().__init__()</code> 建立窗口，再创建 Canvas 等控件；<code>mainloop()</code> 在实例上调用后进入事件循环",
          "correct": true
        }
      ],
      "explain": "括号里写 <code>tk.Tk</code> 是<b>继承</b>（IS-A），不是字段组合：<code>SnakeGame</code> 本身就是一个 Tk 窗口，所以能直接调用继承来的 <code>title()</code>、<code>geometry()</code>、<code>bind()</code>。父类构造器不会自动执行，必须在子类 <code>__init__</code> 开头用 <code>super().__init__()</code> 初始化窗口那部分；否则控件没有宿主。而 <code>mainloop()</code> 会阻塞并接管事件循环，所以它写在模块级、在创建实例之后调用，不能塞进 <code>__init__</code>——那样构造器永远不返回。",
      "hint": "括号里写父类名是继承；继承来的方法可以直接用。"
    },
    {
      "id": "ch18-q2",
      "ch": "ch18",
      "kp": "ch18-6",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "python",
        "trap"
      ],
      "stem": "下面的代码演示了方向锁下的两次移动，写出 <code>print</code> 这一行的输出。",
      "codeTitle": "Python",
      "code": "class Demo:\n    def __init__(self):\n        self.cell_size = 20\n        self.snake = [(100, 100), (80, 100), (60, 100)]\n        self.snake_direction = \"Right\"\n\n    def change_direction(self, key):\n        opposite = {\"Left\": \"Right\", \"Right\": \"Left\", \"Up\": \"Down\", \"Down\": \"Up\"}\n        if key != opposite[self.snake_direction]:\n            self.snake_direction = key\n\n    def move_snake(self):\n        head_x, head_y = self.snake[0]\n        if self.snake_direction == \"Left\":\n            head_x -= self.cell_size\n        elif self.snake_direction == \"Right\":\n            head_x += self.cell_size\n        elif self.snake_direction == \"Up\":\n            head_y -= self.cell_size\n        else:\n            head_y += self.cell_size\n        self.snake = [(head_x, head_y)] + self.snake[:-1]\n\nd = Demo()\nd.change_direction(\"Left\")\nd.move_snake()\nd.change_direction(\"Up\")\nd.move_snake()\nprint(d.snake[0], len(d.snake))",
      "answer": "(120, 80) 3",
      "accept": [
        "(120,80) 3"
      ],
      "explain": "第一步 <code>change_direction(\"Left\")</code> 被方向锁拒绝：当前方向是 Right，它的反方向正好是 Left，所以方向仍为 Right；<code>move_snake</code> 把蛇头从 <code>(100, 100)</code> 推到 <code>(120, 100)</code>，并丢掉尾巴，长度仍是 3。第二步按 Up 时，Right 的反方向是 Left，Up 不是反方向，于是允许改向；蛇头纵坐标减 20，变成 <code>(120, 80)</code>，长度依旧 3。若方向锁失效让第一步的 Left 生效，蛇头会落到 <code>(80, 100)</code>——那正是脖子所在格，下一帧就会撞自己。",
      "hint": "先判断每次按键是否被 opposite 字典拦下，再算坐标。"
    },
    {
      "id": "ch18-q3",
      "ch": "ch18",
      "kp": "ch18-2",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "trap",
        "python",
        "tkinter"
      ],
      "stem": "有同学把游戏主循环改成下面的写法，希望蛇动得更“准时”。运行后窗口很快显示“无响应”，蛇也不动。原因是？",
      "codeTitle": "Python",
      "code": "def run_game(self):\n    while True:\n        self.move_snake()\n        time.sleep(0.1)",
      "options": [
        {
          "text": "<code>time.sleep(0.1)</code> 的单位是毫秒，实际只停了 0.1 毫秒，循环太快把 CPU 占满了"
        },
        {
          "text": "<code>move_snake()</code> 只能在 <code>after()</code> 的回调里调用，直接在普通方法里调用会崩溃"
        },
        {
          "text": "因为循环里没有调用 <code>update_ui()</code>，只要补上重绘就不会卡"
        },
        {
          "text": "Tkinter 的界面事件和重绘都在主线程的事件循环里处理；这个 <code>while True</code> 占住主线程，<code>mainloop()</code> 没有机会处理事件，窗口就无响应了",
          "correct": true
        }
      ],
      "explain": "Tkinter 是<b>单线程</b>的：<code>mainloop()</code> 不断从事件队列取事件、回调处理、重绘。一旦进入 <code>while True</code>，控制权再也回不到事件循环，鼠标、键盘、窗口系统的重绘消息全部积压，操作系统便判定窗口“无响应”。<code>sleep</code> 只会让主线程睡着，睡醒继续占着，仍然不处理事件；而 <code>after(100, self.run_game)</code> 是“登记一个 100 毫秒后的回调”后立刻返回，把主线程还给事件循环，所以界面能继续响应。补 <code>update_ui()</code> 也救不了，因为重绘消息同样要事件循环来派发。",
      "hint": "问自己：这个循环什么时候把控制权还给 mainloop？"
    },
    {
      "id": "ch18-t1",
      "ch": "ch18",
      "kp": "ch18-3",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "python",
        "tkinter"
      ],
      "stem": "项目里 <code>self.cell_size = 20</code>，蛇头保存在 <code>self.snake[0]</code>，初值是 <code>(100, 100)</code>。关于这套坐标，下列哪项正确？",
      "options": [
        {
          "text": "坐标单位是格子编号；<code>(100, 100)</code> 表示第 100 列第 100 行，画图时要先除以 20"
        },
        {
          "text": "坐标单位是像素，但 Canvas 的原点在左下角，所以 y 越大越靠上"
        },
        {
          "text": "向右移动一格是把横坐标加 1，因为每一格就是 1 个单位"
        },
        {
          "text": "坐标单位是像素；向右移动一格就是横坐标加 20，画一格要用 <code>create_rectangle(x, y, x + 20, y + 20)</code>",
          "correct": true
        }
      ],
      "explain": "蛇身列表里存的是<b>像素坐标</b>，而且都落在 20 的整数倍上：<code>(100, 100)</code> 是第 5 列第 5 行的左上角像素，不是第 100 行。移动一格就加减一个 <code>cell_size</code>；画矩形时 <code>create_rectangle</code> 要的是左上角和右下角两个点，所以右下角是 <code>x + cell_size, y + cell_size</code>。Canvas 的原点在<b>左上角</b>，x 向右增、y 向下增，所以 Up 是 <code>head_y -= cell_size</code>。把格子编号和像素混用，会出现蛇一格跳 20 格或只挪 1 像素的现象。",
      "hint": "画布坐标从左上角起，y 向下增大；蛇的坐标已经是像素。"
    },
    {
      "id": "ch18-t2",
      "ch": "ch18",
      "kp": "ch18-3",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "python",
        "trap"
      ],
      "stem": "<code>__init__</code> 里先写 <code>self.snake = [(100, 100), (80, 100), (60, 100)]</code>，再写 <code>self.food = self.create_food()</code>。如果把这两行顺序反过来，最可能发生什么？",
      "options": [
        {
          "text": "没有影响，Python 会自动把 <code>self.snake</code> 补成一个空列表"
        },
        {
          "text": "食物会画在蛇身上，但游戏仍能正常开始"
        },
        {
          "text": "<code>create_food()</code> 会无限循环，因为蛇身列表是空的"
        },
        {
          "text": "<code>create_food()</code> 里要判断 <code>food not in self.snake</code>，此时 <code>self.snake</code> 还没建立，会抛 <code>AttributeError</code>",
          "correct": true
        }
      ],
      "explain": "Python 不会因为你在别处“打算”赋值就预先创建属性：在 <code>self.snake = ...</code> 执行之前，实例上根本没有 <code>snake</code> 这个属性，<code>self.snake</code> 会抛 <code>AttributeError: snake</code>。所以初始化有依赖顺序：先建立蛇身与方向这些状态，再调用依赖它们的方法。<br>后两个选项也值得澄清：即使蛇身是空列表，<code>food not in []</code> 也恒为真，不会无限循环；食物画在蛇身上属于“逻辑错误”，不是这次顺序颠倒的直接后果。",
      "hint": "属性要先赋值才能读取；create_food 里读了什么？"
    },
    {
      "id": "ch18-t3",
      "ch": "ch18",
      "kp": "ch18-2",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "python",
        "tkinter"
      ],
      "stem": "<code>run_game</code> 末尾写 <code>self.after(100, self.run_game)</code>。这句话的作用是？",
      "options": [
        {
          "text": "让当前线程暂停 100 毫秒，然后再执行下一行"
        },
        {
          "text": "立刻递归调用 <code>run_game</code> 100 次"
        },
        {
          "text": "把 <code>run_game</code> 注册成键盘事件的处理函数"
        },
        {
          "text": "告诉 Tkinter 的事件循环：大约 100 毫秒后再调用一次 <code>run_game</code>；这句话本身立刻返回，不阻塞",
          "correct": true
        }
      ],
      "explain": "<code>after(ms, func)</code> 是“定时登记”：把回调排进 Tk 的事件队列，约定约 100 毫秒后由事件循环调用，然后<b>马上返回</b>。因此 <code>run_game</code> 每次执行完都把控制权交还 <code>mainloop</code>，100 毫秒后事件循环再调它一次；它又在末尾登记下一次，形成不会占死线程的循环。它的参数是<b>函数对象</b>，不能写成 <code>self.run_game()</code>——那会在登记前就把函数执行掉，变成无限递归。键盘事件是用 <code>bind(\"&lt;KeyPress&gt;\", ...)</code> 注册的，和 after 无关。",
      "hint": "after 是“过一会儿再叫我”，不是“我现在睡一会儿”。"
    },
    {
      "id": "ch18-t4",
      "ch": "ch18",
      "kp": "ch18-7",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "python",
        "project"
      ],
      "stem": "蛇吃到食物后要变长。正常移动的代码是 <code>self.snake = [new_head] + self.snake[:-1]</code>；吃到食物时正确的改法是？",
      "options": [
        {
          "text": "<code>self.snake = self.snake + [new_head]</code>，把新头加在列表末尾"
        },
        {
          "text": "仍然用 <code>[new_head] + self.snake[:-1]</code>，只把 <code>self.score</code> 加 1"
        },
        {
          "text": "<code>self.snake.append(new_head)</code>，然后 <code>self.snake.pop(0)</code>"
        },
        {
          "text": "<code>self.snake = [new_head] + self.snake</code>，不删尾巴，然后调用 <code>create_food()</code> 换食物位置",
          "correct": true
        }
      ],
      "explain": "约定 <code>self.snake[0]</code> 是蛇头，<code>self.snake[-1]</code> 是蛇尾。正常移动 = 新头插到最前面 + 丢掉尾巴（<code>[:-1]</code>），长度不变；吃到食物 = 新头插到最前面 + <b>保留尾巴</b>，长度加 1，同时必须重新生成食物，避免食物留在蛇身里。把新头 <code>append</code> 到末尾会破坏“第 0 个是蛇头”的约定，下一帧会拿尾巴当脑袋去算方向；只加分不保留尾巴则蛇永远不变长。",
      "hint": "列表第 0 项是头；变长就是“不删尾”。"
    },
    {
      "id": "ch18-t5",
      "ch": "ch18",
      "kp": "ch18-7",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "concept",
        "python"
      ],
      "stem": "判断：贪吃蛇的蛇身用一个坐标列表表示，正常移动一帧的写法是把新蛇头插到列表最前面、再删掉列表最后一项，所以不吃食物时蛇的长度保持不变。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "蛇身列表同时承担“形状”和“顺序”两个职责：下标 0 是头，下标 -1 是尾。移动时新头 <code>[new_head]</code> 拼上 <code>self.snake[:-1]</code>（去掉尾巴的旧身体），列表长度不变，视觉上就是整条蛇向前爬了一格。只有吃到食物时才改用 <code>[new_head] + self.snake</code>，保留尾巴让长度加 1。理解“头插尾删”这个模式，移动、变长、撞自己三件事就都能推出来。",
      "hint": "切片 <code>[:-1]</code> 去掉的是哪一端？"
    },
    {
      "id": "ch18-t6",
      "ch": "ch18",
      "kp": "ch18-6",
      "type": "tf",
      "difficulty": 3,
      "tags": [
        "trap",
        "python"
      ],
      "stem": "判断：<code>change_direction</code> 里已经用 <code>opposite_directions</code> 拒绝了反向键，所以玩家在同一个 100 毫秒间隔内快速依次按“右→上→左”，蛇也不可能在下一帧反向撞到自己。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "方向锁每次只把“新按键”和“当前方向”比较，而当前方向会被上一个按键改掉。假设蛇正在向右：按上时，Right 的反方向是 Left，上不是反方向，于是方向改成 Up；紧接着按左时，Up 的反方向是 Down，左也不是反方向，于是方向改成 Left。两次都合法，但最终方向 Left 与上一帧实际移动方向 Right 正好相反，下一帧新头会落进脖子那一格，触发撞自己。<br>修法是每帧只接受一个方向输入（用待处理方向变量），或与“上一帧实际移动的方向”比较，而不是与随时可变的当前方向比较。",
      "hint": "两次按键之间，self.snake_direction 已经变了；锁比较的是哪一个值？"
    },
    {
      "id": "ch18-t7",
      "ch": "ch18",
      "kp": "ch18-4",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "syntax",
        "python",
        "tkinter"
      ],
      "stem": "<code>setup_ui</code> 里把方向键处理函数注册到窗口上：<code>self.bind(\"&lt;KeyPress&gt;\", self.____)</code>。横线处应填哪个方法名？",
      "answer": [
        "change_direction"
      ],
      "accept": [
        "change_direction()",
        "self.change_direction"
      ],
      "explain": "<code>bind(事件, 处理函数)</code> 的第二个参数要传<b>函数对象</b>，不是函数调用结果，所以写 <code>self.change_direction</code>，不能写 <code>self.change_direction()</code>。绑定后，每次按键 Tkinter 都会调用这个函数并传入一个 <code>event</code>，函数里用 <code>event.keysym</code> 判断是按了 Left、Right、Up 还是 Down。这也是回调函数必须能接收一个参数的原因。",
      "hint": "处理方向键的方法在 setup_ui 里被 bind 到 &lt;KeyPress&gt;。"
    },
    {
      "id": "ch18-t8",
      "ch": "ch18",
      "kp": "ch18-8",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "python",
        "project"
      ],
      "stem": "<code>create_food</code> 要让食物落在格点上：<code>x = random.randint(0, (self.width // self.cell_size) - 1) * ____</code>。横线处应填什么？",
      "answer": [
        "self.cell_size"
      ],
      "accept": [
        "cell_size",
        "20"
      ],
      "explain": "<code>randint(0, 39)</code> 得到的是<b>格子编号</b>，不是像素坐标；乘上 <code>cell_size</code>（20）后才变成 0、20、40……780 这些落在网格线上的像素值。上界写 <code>(self.width // self.cell_size) - 1</code> 是为了让最后一格从 780 开始、正好在 800 的窗口内。纵坐标同理。抽到食物后还要检查 <code>food not in self.snake</code>，落在蛇身上就重新抽。",
      "hint": "randint 给的是第几格，画到画布上要乘每格像素。"
    },
    {
      "id": "ch18-t9",
      "ch": "ch18",
      "kp": "ch18-7",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "python",
        "trap"
      ],
      "stem": "蛇头坐标以像素计，窗口 <code>self.width = 800</code>、<code>self.height = 800</code>，每格 20 像素。判断撞右墙的条件写成 <code>new_head[0] >= ____</code>，横线处应填什么？",
      "answer": [
        "self.width"
      ],
      "accept": [
        "width",
        "800"
      ],
      "explain": "合法蛇头的横坐标是 0、20、……、780。最右一格从 780 开始，矩形画到 800 结束，仍然在窗口内；而 800 已经出了画布，所以判定要用 <code>&gt;= self.width</code>，不能写 <code>&gt; self.width</code>——后者会允许蛇头停在 800，画出界一格。左侧用 <code>&lt; 0</code>，纵坐标同理。把“格点坐标”和“矩形右边界”混在一起是这类边界题最常见的错因。",
      "hint": "最后一格的左上角是 780，右下角才是 800；>= 与 > 差一个格子。"
    },
    {
      "id": "ch18-f1",
      "ch": "ch18",
      "kp": "ch18-6",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "bug",
        "python",
        "trap"
      ],
      "stem": "下面的 <code>change_direction</code> 想实现“不能 180 度掉头”，但蛇向右移动时按下左键会立刻掉头，下一帧撞到自己的脖子。找出问题并说明改法。",
      "codeTitle": "Python",
      "code": "def change_direction(self, event):\n    if event.keysym in [\"Left\", \"Right\", \"Up\", \"Down\"]:\n        self.snake_direction = event.keysym",
      "answer": "缺少反向判断：应先建立 opposite_directions 映射，只有 event.keysym != opposite_directions[self.snake_direction] 时才赋值。",
      "accept": [
        {
          "hint": "指出没有判断新方向是否与当前方向相反",
          "any": [
            "没有判断反向",
            "未判断反向",
            "没有检查反向",
            "缺少反向判断",
            "没有判断是否反向",
            "缺少方向锁",
            "没有 opposite",
            "没有判断相反方向",
            "未检查反方向",
            "反向检查",
            "没有做反向判断",
            "未做反向判断",
            "少了方向判断"
          ]
        },
        {
          "hint": "改成与 opposite_directions[self.snake_direction] 比较后再赋值",
          "any": [
            "opposite_directions[self.snake_direction]",
            "opposite_directions",
            "不等于反方向",
            "和反方向比较",
            "与相反方向比较",
            "判断是否等于相反方向",
            "!= opposite",
            "和当前方向的反方向比较",
            "与反方向比较",
            "判断新方向是否反向",
            "不能是反方向",
            "不能掉头",
            "禁止掉头"
          ]
        }
      ],
      "minHits": 2,
      "explain": "这段代码只要按键是四个方向键就无条件赋值。蛇向右时按左，<code>self.snake_direction</code> 立刻变成 Left，下一帧新蛇头会落到 <code>(80, 100)</code>，也就是脖子所在格；<code>new_head in self.snake[:-1]</code> 成立，游戏直接结束。正确写法是先准备 <code>opposite_directions = {\"Left\": \"Right\", \"Right\": \"Left\", \"Up\": \"Down\", \"Down\": \"Up\"}</code>，再判断 <code>event.keysym != opposite_directions[self.snake_direction]</code> 才赋值。方向锁只改方向字符串、不改坐标，坐标统一由 <code>move_snake</code> 计算。",
      "hint": "缺了一张“相反方向”表，也缺了一次比较。"
    },
    {
      "id": "ch18-t10",
      "ch": "ch18",
      "kp": "ch18-7",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "python"
      ],
      "stem": "下面的代码模拟蛇的两帧移动，写出 <code>print</code> 这一行的输出。",
      "codeTitle": "Python",
      "code": "class Demo:\n    def __init__(self):\n        self.cell_size = 20\n        self.snake = [(100, 100), (80, 100), (60, 100)]\n        self.food = (120, 100)\n        self.score = 0\n\n    def move_snake(self):\n        head_x, head_y = self.snake[0]\n        head_x += self.cell_size\n        new_head = (head_x, head_y)\n        if new_head == self.food:\n            self.snake = [new_head] + self.snake\n            self.score += 1\n            self.food = (200, 200)\n        else:\n            self.snake = [new_head] + self.snake[:-1]\n\nd = Demo()\nd.move_snake()\nd.move_snake()\nprint(len(d.snake), d.score, d.snake[0])",
      "answer": "4 1 (140, 100)",
      "accept": [
        "4 1 (140,100)"
      ],
      "explain": "第一帧蛇头从 <code>(100, 100)</code> 向右到 <code>(120, 100)</code>，正好等于食物坐标，于是走“吃到食物”分支：<code>[new_head] + self.snake</code> 不删尾巴，长度从 3 变 4，分数加 1，食物被换到 <code>(200, 200)</code>。第二帧蛇头再到 <code>(140, 100)</code>，不是食物，走普通移动分支：头插尾删，长度仍为 4，分数仍为 1。因此依次打印 4、1、<code>(140, 100)</code>。",
      "hint": "第一帧吃到食物会保留尾巴；第二帧没有食物可吃。"
    },
    {
      "id": "ch18-t11",
      "ch": "ch18",
      "kp": "ch18-5",
      "type": "multi",
      "difficulty": 2,
      "tags": [
        "concept",
        "tkinter",
        "python"
      ],
      "stem": "关于 <code>update_ui</code> 与 <code>game_over</code>，下列说法正确的有哪些？（多选）",
      "options": [
        {
          "text": "<code>update_ui</code> 先 <code>canvas.delete(\"all\")</code> 清空画布，再按 <code>self.snake</code> 逐格重画，避免旧画面残留",
          "correct": true
        },
        {
          "text": "每一格用 <code>create_rectangle(x, y, x + self.cell_size, y + self.cell_size)</code> 绘制，四个参数分别是左上角与右下角坐标",
          "correct": true
        },
        {
          "text": "<code>game_over</code> 里调用 <code>self.unbind(\"&lt;KeyPress&gt;\")</code>，可以让方向键不再改变方向",
          "correct": true
        },
        {
          "text": "<code>canvas.delete(\"all\")</code> 会把 Canvas 控件本身从窗口里删掉，所以整个游戏只能调用一次"
        },
        {
          "text": "只在画布中央画出“Game Over”文字，<code>after</code> 链就会自动停止，不必再做别的处理"
        }
      ],
      "explain": "<code>update_ui</code> 是“整帧重画”：<code>delete(\"all\")</code> 删除的是 Canvas 上的<b>绘图项</b>（矩形、文字等），不会删除 Canvas 控件本身，所以每帧都可以清空重画；矩形要用左上角加 <code>cell_size</code> 得到右下角。游戏结束时 <code>unbind(\"&lt;KeyPress&gt;\")</code> 解掉键盘绑定，方向键就不再触发回调；但仅画文字不会停止已经登记的 <code>after</code> 链，工程上还要用 <code>is_running</code> 之类的开关让 <code>run_game</code> 不再继续调度，否则蛇会继续动。",
      "hint": "delete(\"all\") 删的是画布上的图形，不是画布控件。"
    },
    {
      "id": "ch18-t12",
      "ch": "ch18",
      "kp": "ch18-7",
      "type": "order",
      "difficulty": 2,
      "tags": [
        "python",
        "project"
      ],
      "stem": "把 <code>move_snake</code> 处理一帧的顺序排列正确。",
      "options": [
        {
          "text": "取 <code>self.snake[0]</code>，按 <code>self.snake_direction</code> 算出 <code>new_head</code>"
        },
        {
          "text": "判断 <code>new_head</code> 是否越界，或是否撞到蛇身"
        },
        {
          "text": "若吃到食物则保留尾巴，否则用 <code>[new_head] + self.snake[:-1]</code> 更新蛇身"
        },
        {
          "text": "调用 <code>self.update_ui()</code> 重画这一帧"
        },
        {
          "text": "调用 <code>self.after(100, self.run_game)</code> 安排下一帧"
        }
      ],
      "answer": [
        0,
        1,
        2,
        3,
        4
      ],
      "explain": "顺序由依赖关系决定：没有新蛇头就无从判断碰撞；碰撞必须在改蛇身之前判，否则蛇头已经“穿”进身体或墙里，再判就晚了；确认安全后才决定这一帧是变长还是截尾；蛇身定下来后重画才有意义；最后才登记下一帧。若先 <code>update_ui</code> 再改蛇身，画面会永远慢一帧；若先改蛇身再判碰撞，撞墙的那一帧仍会被画出来。",
      "hint": "先算头，再判死，再改身体，再画，最后排下一帧。"
    },
    {
      "id": "ch19-q1",
      "ch": "ch19",
      "kp": "ch19-3",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "concept",
        "project",
        "python"
      ],
      "stem": "课程 ML 项目从命令行启动：<code>python main.py ./config/minist.yaml</code>。入口 <code>main</code> 的合理执行顺序是？",
      "options": [
        {
          "text": "<code>run(config)</code> 先跑起来 → <code>load_config()</code> 补读配置 → <code>read_args()</code> 最后读参数"
        },
        {
          "text": "在 <code>main.py</code> 里写死所有超参数，不需要读命令行参数和配置文件"
        },
        {
          "text": "先调用 <code>model.train()</code>，再读配置，最后创建模型"
        },
        {
          "text": "<code>read_args()</code> 读命令行参数 → <code>load_config()</code> 读 YAML → <code>run(config)</code> 开始训练",
          "correct": true
        }
      ],
      "explain": "<code>main</code> 是 Python 程序的入口，它要先把“这次实验用哪份配置”搞清楚：<code>read_args()</code> 从 <code>sys.argv</code> 里取出配置文件路径，<code>load_config()</code> 把 YAML 读成字典，最后把字典交给 <code>run(config)</code>。只有配置到位，<code>run</code> 才知道 batch size、epochs、学习率，才能继续建 DataLoader、模型和优化器。反过来先 <code>run</code> 再读配置，<code>run</code> 根本不知道超参；先 <code>model.train()</code> 更不可能，因为模型还没创建。",
      "hint": "配置文件路径来自命令行，run 需要 config 才能装配训练。"
    },
    {
      "id": "ch19-q2",
      "ch": "ch19",
      "kp": "ch19-6",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "python",
        "project"
      ],
      "stem": "下面是一段简化后的测试集统计代码，写出 <code>print</code> 这一行的输出。",
      "codeTitle": "Python",
      "code": "pred = [3, 1, 7, 3]\ntarget = [3, 1, 2, 4]\ncorrect = 0\nfor i in range(len(pred)):\n    if pred[i] == target[i]:\n        correct += 1\nprint(correct, len(pred), correct / len(pred))",
      "answer": "2 4 0.5",
      "explain": "这段代码就是 test 循环里“统计准确率”的核心：逐张比较预测类别 <code>pred[i]</code> 与真实标签 <code>target[i]</code>，相等就把 <code>correct</code> 加 1。四组里只有前两组相等（3=3、1=1），所以 <code>correct</code> 为 2，总数为 4，准确率为 2/4=0.5。工程代码通常再乘 100 变成百分比。注意比较的是“类别下标是否相等”，不是比较概率值大小。",
      "hint": "逐位比较，数一数有几组相等；准确率是正确数除以总数。"
    },
    {
      "id": "ch19-q3",
      "ch": "ch19",
      "kp": "ch19-6",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "trap",
        "python",
        "project"
      ],
      "stem": "<code>test()</code> 里写了 <code>model.eval()</code>，但漏掉了 <code>with torch.no_grad():</code>。最准确的后果是？",
      "options": [
        {
          "text": "参数会在测试过程中被更新，准确率被污染"
        },
        {
          "text": "程序立刻报错，因为 <code>model.eval()</code> 必须和 <code>no_grad()</code> 一起用"
        },
        {
          "text": "准确率一定变成 0，因为梯度被清空了"
        },
        {
          "text": "前向仍会记录计算图，测试更慢、更占内存；但因为不调用 <code>backward()</code> 和 <code>step()</code>，参数不会被更新",
          "correct": true
        }
      ],
      "explain": "<code>torch.no_grad()</code> 的作用是“这一块不记录梯度”，省掉计算图能省显存、提速；它<b>不会</b>替你更新参数，也<b>不是</b> <code>eval()</code> 的语法前提，所以漏写不会报错。真正决定参数是否更新的是有没有调用 <code>backward()</code> 和 <code>optimizer.step()</code>：test 循环里只做前向和统计，不调用它们，参数就不会变。反过来，<code>model.eval()</code> 也不是“算准确率”的开关，它只是把某些训练/评估行为不同的层切到评估模式。",
      "hint": "no_grad 管的是“记不记计算图”，不是“更不更新参数”。"
    },
    {
      "id": "ch19-t1",
      "ch": "ch19",
      "kp": "ch19-5",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "project",
        "python"
      ],
      "stem": "项目把 <code>batch_size</code>、<code>epochs</code>、学习率等写在 <code>minist.yaml</code>，由 <code>load_config()</code> 读入。这样做的主要好处是？",
      "options": [
        {
          "text": "YAML 里的数字比 Python 代码里的数字精度更高"
        },
        {
          "text": "只有写成 YAML，PyTorch 才能使用 GPU"
        },
        {
          "text": "配置文件会自动帮我们写好 <code>train()</code> 与 <code>test()</code> 循环"
        },
        {
          "text": "改超参不用改代码，换一份配置就能重复实验",
          "correct": true
        }
      ],
      "explain": "这是“配置与代码分离”：训练逻辑（<code>run</code>、<code>train</code>、<code>test</code>）只写一次，所有可调的量（batch size、epochs、学习率等）从 YAML 读进一个字典，再通过 <code>config[\"batch_size\"]</code> 这样的键取用。这样换实验只改 YAML，不动代码，也不会因为手改代码引入新 bug。YAML 不提升数值精度、不决定能否用 GPU，更不会自动生成训练循环——循环仍然要你自己写。",
      "hint": "超参与代码分离，实验才可复现、可对比。"
    },
    {
      "id": "ch19-t2",
      "ch": "ch19",
      "kp": "ch19-4",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept",
        "python",
        "project"
      ],
      "stem": "关于 PyTorch 的模型类 <code>class Net(nn.Module)</code>，下列说法正确的是？",
      "options": [
        {
          "text": "<code>forward</code> 必须由用户在训练循环里写成 <code>model.forward(data)</code>，直接写 <code>model(data)</code> 是不合法的"
        },
        {
          "text": "模型类不需要继承 <code>nn.Module</code>，只要类名叫 <code>Net</code> 就能被 PyTorch 识别"
        },
        {
          "text": "<code>__init__</code> 里不需要调用 <code>super().__init__()</code>，因为父类没有构造器"
        },
        {
          "text": "在 <code>__init__</code> 里定义网络层，在 <code>forward(self, x)</code> 里把输入依次送过这些层并返回输出；调用 <code>model(data)</code> 就会执行 <code>forward</code>",
          "correct": true
        }
      ],
      "explain": "<code>nn.Module</code> 的子类用 <code>__init__</code> 声明“有哪些层”，用 <code>forward</code> 描述“输入怎么变成输出”。PyTorch 让 <code>model(data)</code> 触发 <code>__call__</code>，再由它转调 <code>forward</code>，所以训练循环里写 <code>output = model(data)</code> 即可；直接调 <code>model.forward(data)</code> 语法上能跑，但会绕过框架为我们做的钩子，不是推荐写法。继承 <code>nn.Module</code> 并调用 <code>super().__init__()</code> 是让层和参数被正确注册的前提，否则优化器拿不到参数。",
      "hint": "model(data) 会自动转调 forward；层的注册依赖父类构造器。"
    },
    {
      "id": "ch19-t3",
      "ch": "ch19",
      "kp": "ch19-6",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "concept",
        "python",
        "project"
      ],
      "stem": "训练循环里调用 <code>model.train()</code>，测试循环里调用 <code>model.eval()</code>，它们的作用是？",
      "options": [
        {
          "text": "<code>train()</code> 负责启动训练循环，<code>eval()</code> 负责计算准确率"
        },
        {
          "text": "它们分别用来打开和关闭 GPU"
        },
        {
          "text": "调用 <code>eval()</code> 会自动清空梯度并更新参数"
        },
        {
          "text": "切换网络的训练/评估模式；某些层在两种模式下行为不同，所以测试前必须切换",
          "correct": true
        }
      ],
      "explain": "<code>train()</code> 和 <code>eval()</code> 只改模型内部的一个“模式开关”，不会启动循环、不会算准确率、也不会动 GPU。之所以要切：有些层在训练和评估时行为不同（例如 Dropout 训练时随机丢弃、评估时保留全部），不切换会让测试结果不稳定。真正更新参数的是 <code>loss.backward()</code> 与 <code>optimizer.step()</code>，和 eval() 无关。",
      "hint": "它们只是模式开关，不执行循环、不更新参数。"
    },
    {
      "id": "ch19-t4",
      "ch": "ch19",
      "kp": "ch19-5",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "project",
        "concept",
        "python"
      ],
      "stem": "<code>DataLoader(train_set, batch_size=64, shuffle=True)</code> 的作用是？",
      "options": [
        {
          "text": "从网上下载 MNIST 数据集并解压到本地目录"
        },
        {
          "text": "定义神经网络的层数与每层神经元个数"
        },
        {
          "text": "计算 loss 并对参数做梯度下降"
        },
        {
          "text": "把数据集按 64 个样本一批打包，迭代时每次给出一批 <code>(data, target)</code>，并可选打乱顺序",
          "correct": true
        }
      ],
      "explain": "<code>DataLoader</code> 是“批量迭代器”：它不负责下载数据（那是数据集构造时做的），也不定义网络结构，更不算 loss。它把 dataset 切成大小为 <code>batch_size</code> 的批，训练循环里 <code>for data, target in train_loader</code> 每次拿一批；<code>shuffle=True</code> 让每个 epoch 的样本顺序不同，减少模型对顺序的依赖。测试集通常不 shuffle，因为只关心统计结果。",
      "hint": "DataLoader 管“怎么分批取”，不管下载、网络和 loss。"
    },
    {
      "id": "ch19-t5",
      "ch": "ch19",
      "kp": "ch19-7",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "concept",
        "project"
      ],
      "stem": "判断：一个 epoch 表示把整个训练集完整过一遍；<code>config[\"epochs\"]</code> 为 5 就是让训练集被过 5 遍，每个 epoch 内通常还会做一次测试。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "epoch（轮次）的定义就是“训练集完整过一遍”。训练集有 N 个样本、batch size 为 B，则一个 epoch 约有 N/B 个 batch，每个 batch 做一次参数更新；<code>epochs=5</code> 就是把这件事重复 5 遍。项目的 <code>run()</code> 在外层写 <code>for epoch in range(1, config[\"epochs\"] + 1)</code>，里面先 <code>train(...)</code> 再 <code>test(...)</code>，所以每个 epoch 结束都能看到一次测试准确率。",
      "hint": "epoch 是“训练集过一遍”，不是“一个 batch”。"
    },
    {
      "id": "ch19-t6",
      "ch": "ch19",
      "kp": "ch19-7",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "trap",
        "project"
      ],
      "stem": "判断：把 <code>batch_size</code> 调大后，一个 epoch 里 <code>optimizer.step()</code> 被调用的次数会变多。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "一个 epoch 的更新次数等于 batch 的个数，约等于 <code>训练集大小 / batch_size</code>（向上取整）。batch size 调大，每批装的样本更多，批数反而变少，所以 <code>step()</code> 次数变<b>少</b>；每次更新用的样本更多，单步更“稳”，但更新更少。把“批更大”误当成“更新更多”是常见的方向性错误，记公式 <code>steps = ceil(N / batch_size)</code> 就不会反。",
      "hint": "批越大，一个 epoch 的批数越少。"
    },
    {
      "id": "ch19-t7",
      "ch": "ch19",
      "kp": "ch19-6",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "syntax",
        "python"
      ],
      "stem": "训练开始前把模型切换到训练模式，应调用 <code>model.____()</code>。横线处填什么？",
      "answer": [
        "train"
      ],
      "explain": "<code>model.train()</code> 把网络切到训练模式，是训练循环的第一行；对应的测试循环第一行是 <code>model.eval()</code>。注意它是“模式开关”，没有返回值，也不启动循环。项目里 <code>train()</code> 函数和这个方法同名，但一个是模块级函数、一个是模型对象的方法，别混淆。",
      "hint": "训练模式的方法名就是 train。"
    },
    {
      "id": "ch19-t8",
      "ch": "ch19",
      "kp": "ch19-6",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "syntax",
        "python"
      ],
      "stem": "算出 loss 后，要从 loss 反向求出每个参数的梯度，应调用 <code>loss.____()</code>。横线处填什么？",
      "answer": [
        "backward"
      ],
      "explain": "<code>loss.backward()</code> 执行反向传播：从 loss 出发，按计算图倒着算出每个参数的梯度，并累加到参数的 <code>.grad</code> 上。它只负责“算梯度”，不负责“改参数”；真正按梯度更新参数的是下一行 <code>optimizer.step()</code>。顺序不能反：没有梯度，优化器就没有更新依据。",
      "hint": "反向传播的英文是 backpropagation，方法名取前半。"
    },
    {
      "id": "ch19-t9",
      "ch": "ch19",
      "kp": "ch19-6",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "python",
        "project"
      ],
      "stem": "测试集共 10000 张图片，模型答对 9500 张，准确率是 ____%。",
      "answer": [
        "95"
      ],
      "accept": [
        "95%",
        "95.0",
        "95.0%"
      ],
      "explain": "准确率 = 预测正确的样本数 / 总样本数 × 100%。<code>9500 / 10000 = 0.95</code>，换成百分比就是 95%。测试循环里通常用 <code>correct</code> 累加答对数量，最后打印 <code>100. * correct / n</code>；这里的 <code>n</code> 是测试集大小，不能误用成 batch 数或训练集大小。",
      "hint": "正确数除以总数，再乘 100。"
    },
    {
      "id": "ch19-f1",
      "ch": "ch19",
      "kp": "ch19-6",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "bug",
        "python",
        "project"
      ],
      "stem": "下面的 <code>train()</code> 想按\"前向 → 算损失 → 反向传播 → 更新参数\"的顺序训练，但训练几乎不收敛。找出语句顺序的问题并说明改法。",
      "codeTitle": "Python",
      "code": "def train(model, device, train_loader, optimizer, epoch):\n    model.train()\n    for batch_idx, (data, target) in enumerate(train_loader):\n        data, target = data.to(device), target.to(device)\n        output = model(data)\n        loss = F.nll_loss(output, target)\n        optimizer.step()\n        loss.backward()",
      "answer": "optimizer.step() 写在了 loss.backward() 之前：梯度还没算出来就更新了参数；应改成先 loss.backward() 求梯度，再 optimizer.step() 更新。",
      "accept": [
        {
          "hint": "指出 step() 与 backward() 的顺序颠倒了",
          "any": [
            "step 在 backward 之前",
            "先 step",
            "step 提前",
            "step 写反",
            "顺序颠倒",
            "顺序反了",
            "写反了",
            "应该先 backward",
            "backward 在后面",
            "backward 写在后"
          ]
        },
        {
          "hint": "说明正确顺序：先反向传播算梯度，再更新参数",
          "any": [
            "先反向传播",
            "先算梯度",
            "先求梯度",
            "backward 之后",
            "再 step",
            "再更新参数",
            "先 backward",
            "backward 再 step"
          ]
        }
      ],
      "minHits": 2,
      "explain": "讲义把训练的一步拆成四个动作：前向 <code>output = model(data)</code> → 算损失 <code>loss = F.nll_loss(output, target)</code> → 算梯度 <code>loss.backward()</code> → 更新参数 <code>optimizer.step()</code>。这是一条依赖链：<code>backward()</code> 才把每个参数的梯度算出来，<code>step()</code> 只是拿着梯度沿负方向挪一步。先 <code>step()</code>，用的还是上一批留下的旧梯度（第一个 batch 甚至还没有梯度，等于原地不动），本批的梯度要拖到下一批才被用上，训练自然不收敛。",
      "hint": "谁负责算梯度？谁负责用梯度更新参数？"
    },
    {
      "id": "ch19-t10",
      "ch": "ch19",
      "kp": "ch19-7",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "python",
        "project"
      ],
      "stem": "阅读下面的 Python 代码，写出 <code>print</code> 的输出。",
      "codeTitle": "Python",
      "code": "epochs = 2\nn_train = 6\nbatch_size = 3\nsteps = 0\nfor epoch in range(epochs):\n    for start in range(0, n_train, batch_size):\n        steps += 1\nprint(steps)",
      "answer": "4",
      "explain": "训练集 6 个样本、每批 3 个，一个 epoch 能切出两个 batch（<code>range(0, 6, 3)</code> 给出 0 和 3），每个 batch 对应一次参数更新，所以 <code>steps</code> 在一个 epoch 加 2。外层跑 2 个 epoch，总共 <code>2 × 2 = 4</code> 次更新。这正好解释了“epoch 数 × 每 epoch 的 batch 数 = step 次数”；如果把 batch_size 改成 2，一个 epoch 就是 3 批，总数变 6。",
      "hint": "每个 epoch 切出几个 batch？再乘 epoch 数。"
    },
    {
      "id": "ch19-t11",
      "ch": "ch19",
      "kp": "ch19-1",
      "type": "multi",
      "difficulty": 2,
      "tags": [
        "project",
        "concept"
      ],
      "stem": "下列哪些通常作为超参数写在配置文件（如 <code>minist.yaml</code>）里，而不是写死在训练循环里？（多选）",
      "options": [
        {
          "text": "<code>batch_size</code>：一次喂给网络多少个样本",
          "correct": true
        },
        {
          "text": "<code>epochs</code>：整个训练集过几遍",
          "correct": true
        },
        {
          "text": "学习率（learning rate）：优化器每一步迈多大",
          "correct": true
        },
        {
          "text": "贪吃蛇蛇身的初始坐标列表"
        },
        {
          "text": "Tkinter 窗口的 <code>geometry(\"800x800\")</code>"
        }
      ],
      "explain": "超参数是“训练前由人设定、训练中不被梯度更新”的量：batch size 决定一批多大，epochs 决定训练集过几遍，学习率决定优化器每步走多远，它们都会影响实验结果，放进 YAML 才能不改代码就做对比实验。蛇的初始坐标属于游戏状态，窗口尺寸属于 GUI 布局，和机器学习训练无关，不应混进训练配置。判断标准是：这个量会不会影响 loss 与准确率、是否需要反复调。",
      "hint": "会影响训练效果、需要反复调的量才放进配置。"
    },
    {
      "id": "ch19-t12",
      "ch": "ch19",
      "kp": "ch19-6",
      "type": "order",
      "difficulty": 3,
      "tags": [
        "project",
        "python",
        "concept"
      ],
      "stem": "<code>train()</code> 函数里，从\"切到训练模式\"到\"更新参数\"的执行顺序是什么？把下面的语句排好。",
      "options": [
        {
          "text": "<code>loss = F.nll_loss(output, target)</code> 计算损失"
        },
        {
          "text": "<code>optimizer.step()</code> 按梯度更新参数"
        },
        {
          "text": "<code>model.train()</code> 切到训练模式"
        },
        {
          "text": "<code>output = model(data)</code> 前向传播得到预测"
        },
        {
          "text": "<code>loss.backward()</code> 反向传播计算梯度"
        }
      ],
      "answer": [
        2,
        3,
        0,
        4,
        1
      ],
      "explain": "这是一条依赖链，顺序由\"谁需要谁的输出\"决定：先 <code>model.train()</code> 把网络切到训练模式（某些层在训练/评估下行为不同，必须在前向前切好）；再前向得到 <code>output</code>；用 <code>output</code> 与 <code>target</code> 算 <code>loss</code>；<code>backward()</code> 从 loss 倒推每个参数的梯度；最后 <code>step()</code> 按梯度和学习率挪动参数。把 <code>step()</code> 提到 <code>backward()</code> 之前，就等于用上一批的旧梯度更新，本批的 loss 白算。",
      "hint": "切模式 → 前向 → 算 loss → 反向 → 更新。"
    },
    {
      "id": "ch20-q1",
      "ch": "ch20",
      "kp": "ch20-1",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "exam",
        "concept"
      ],
      "stem": "按 Final Examination Guideline 的建议，100 分钟考试时间最合理的分配是？",
      "options": [
        {
          "text": "四部分各 25 分钟，平均分配"
        },
        {
          "text": "先花 40 分钟写 Part IV 的编程题，再回头做选择题与判断题"
        },
        {
          "text": "用前 10 分钟阅读时间直接开始写 Part I，因为阅读时间也算在 100 分钟内"
        },
        {
          "text": "Part I 与 Part II 合计 35 分钟，Part III 25 分钟，Part IV 30 分钟，剩下约 10 分钟检查",
          "correct": true
        }
      ],
      "explain": "考纲给的参考是 Part I &amp; II 35 分钟、Part III 25 分钟、Part IV 30 分钟，合计 90 分钟，剩下约 10 分钟检查；另有独立的 10 分钟阅读时间，用来通览全卷、规划先做哪部分。Part I 与 II 共 50 分却只给 35 分钟，意味着这部分必须靠条件反射，不能在现场慢慢推；Part IV 只有 25 分却给 30 分钟，因为手写代码、组织简答要点都更耗时。平均分配或先写编程题都会让客观题来不及。",
      "hint": "50 分的客观题只给 35 分钟；阅读时间不写题。"
    },
    {
      "id": "ch20-q2",
      "ch": "ch20",
      "kp": "ch20-1",
      "type": "predict",
      "difficulty": 2,
      "tags": [
        "output",
        "exam",
        "python"
      ],
      "stem": "下面这段代码按期末四部分的得分估算总分，写出 <code>print</code> 的输出。",
      "codeTitle": "Python",
      "code": "part1 = 8 * 3\npart2 = 3 * 4\npart3 = 4 * 5\npart4 = 18\ntotal = part1 + part2 + part3 + part4\nprint(total, total / 100)",
      "answer": "74 0.74",
      "explain": "按考纲的分值换算：Part I 选择题 10 题、每题 3 分，答对 8 题得 24 分；Part II 判断题 5 题、每题 4 分，答对 3 题得 12 分；Part III 填空题 5 题、每题 5 分，答对 4 题得 20 分；Part IV 两题共 25 分，得 18 分。四部分相加 <code>24+12+20+18=74</code>，总分 100，所以比例是 0.74。这类估算能帮你在考前判断“哪一部分多对一题最划算”。",
      "hint": "先按各部分的题数与单题分值分别算分，再相加。"
    },
    {
      "id": "ch20-q3",
      "ch": "ch20",
      "kp": "ch20-6",
      "type": "mcq",
      "difficulty": 3,
      "tags": [
        "exam",
        "trap"
      ],
      "stem": "Part III 填空每题 5 分，常要求补全短代码或逻辑片段。下列哪种作答最符合它的判分方式？",
      "options": [
        {
          "text": "把整段标准代码默写进空格，写得越多越容易命中得分点"
        },
        {
          "text": "五个空里只要有一个不会，就整题放弃，因为填空题没有部分分"
        },
        {
          "text": "所有空都写“略”，阅卷老师会按思路给分"
        },
        {
          "text": "先看空格问的是方法名、关键字、顺序还是返回值，只写能填进空里的最小片段；多余内容可能让整空判错",
          "correct": true
        }
      ],
      "explain": "填空题的判分对象是“这个空应该填什么”，所以答案要短、要准：问方法名就写方法名，问关键字就写关键字，问执行顺序就写序号或短语。把整行代码抄进去，往往因为多了分号、括号或修饰符而判错；反过来，一个空不会也不该放弃整题，把其余空写对仍能拿分。“略”不是答案，阅卷人没有义务替你补全逻辑。",
      "hint": "空格问什么就答什么，答案越短越不容易错。"
    },
    {
      "id": "ch20-t1",
      "ch": "ch20",
      "kp": "ch20-1",
      "type": "mcq",
      "difficulty": 1,
      "tags": [
        "exam",
        "concept"
      ],
      "stem": "期末 Part II 判断题的题量与分值是？",
      "options": [
        {
          "text": "10 题，每题 2 分，共 20 分"
        },
        {
          "text": "5 题，每题 5 分，共 25 分"
        },
        {
          "text": "5 题，每题 4 分，答对几个关键点就给几分"
        },
        {
          "text": "5 题，每题 4 分，共 20 分；每题只在 True / False 中选一个",
          "correct": true
        }
      ],
      "explain": "考纲写明 Part II 是 5 道判断题、每题 4 分、合计 20 分，答案只有 True 或 False 两种，没有“答对一半给一半分”的说法。Part I 才是 10 题 × 3 分 = 30 分，Part III 是 5 题 × 5 分 = 25 分。判断题只有两种结果，所以一句话里只要有一处与讲义不符，整题就是 False，不能因为前半句对而给分。",
      "hint": "5 题 × 4 分，二选一，无部分分。"
    },
    {
      "id": "ch20-t2",
      "ch": "ch20",
      "kp": "ch20-2",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "io",
        "concept",
        "exam"
      ],
      "stem": "复习 I/O 包装链时，判断一条链“能不能调用 <code>readLine()</code>”最直接的依据是？",
      "options": [
        {
          "text": "看最内层是不是 <code>FileInputStream</code>"
        },
        {
          "text": "看变量名里有没有 <code>Reader</code>"
        },
        {
          "text": "看有没有调用过 <code>flush()</code>"
        },
        {
          "text": "看最外层是不是 <code>BufferedReader</code>；<code>readLine()</code> 是它提供的方法",
          "correct": true
        }
      ],
      "explain": "包装链的规则是：<b>外层决定你能调用哪些方法，内层决定数据从哪里来</b>。字符流 <code>FileReader</code> 能按字符读，但 <code>readLine()</code> 是 <code>BufferedReader</code> 加缓冲后提供的方法；所以 <code>new BufferedReader(new FileReader(\"a.txt\"))</code> 的最外层是 BufferedReader，才能用 readLine。若最内层是字节流，还要先套 <code>InputStreamReader</code> 把字节转成字符，再套 BufferedReader。变量名和 flush 都不能决定方法是否存在。",
      "hint": "方法属于最外层那个流；内层只负责数据来源。"
    },
    {
      "id": "ch20-t3",
      "ch": "ch20",
      "kp": "ch20-2",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "javafx",
        "concept",
        "exam"
      ],
      "stem": "复习 JavaFX 时，三层结构 Stage、Scene、Node 的关系常被考到。下列哪项正确？",
      "options": [
        {
          "text": "Node 包含 Scene，Scene 包含 Stage"
        },
        {
          "text": "Stage 与 Scene 是同一个东西的两种叫法"
        },
        {
          "text": "一个 Node 可以同时放进两个 Scene，只要分别调用 <code>setScene</code>"
        },
        {
          "text": "Stage 是窗口容器，Scene 装一棵 Node 树，按钮、文本、布局都是 Node",
          "correct": true
        }
      ],
      "explain": "三层结构是“Stage 装 Scene、Scene 装 Node 树”：Stage 代表一个窗口（primaryStage 由 <code>start(Stage)</code> 传入），Scene 是窗口里的内容场景（构造时要给一个根节点），Node 是按钮、标签、布局等可见元素。调用 <code>stage.setScene(scene)</code> 把场景挂到窗口上，再 <code>stage.show()</code> 显示。Node 在场景图中只能有一个父容器，不能同时挂到两个 Scene；而且 <code>setScene</code> 是 Stage 的方法，不是 Node 的。",
      "hint": "窗口 → 场景 → 节点，方向不能反。"
    },
    {
      "id": "ch20-t4",
      "ch": "ch20",
      "kp": "ch20-2",
      "type": "mcq",
      "difficulty": 2,
      "tags": [
        "python",
        "concept",
        "exam"
      ],
      "stem": "复习 Python 与 Java 的差异时，下列哪条对比是正确的？",
      "options": [
        {
          "text": "Python 是静态强类型语言，Java 是动态类型语言"
        },
        {
          "text": "Python 里 <code>#</code> 是整除运算符，<code>//</code> 是注释"
        },
        {
          "text": "Python 每条语句必须以分号结尾，Java 不需要"
        },
        {
          "text": "Python 用缩进划分代码块、布尔字面量是 <code>True</code>/<code>False</code>；Java 用花括号、布尔字面量是 <code>true</code>/<code>false</code>",
          "correct": true
        }
      ],
      "explain": "Python 的代码块由缩进决定，没有花括号；布尔值首字母大写，写 <code>True</code>/<code>False</code>，Java 全小写写 <code>true</code>/<code>false</code>。类型方向也相反：Java 是静态类型（变量声明时写类型，编译期检查），Python 是动态类型（运行时才绑定类型），但两者都不是“弱类型”。注释方面 Python 用 <code>#</code>，整除用 <code>//</code>；分号在 Python 里可写可不写，不是必需。",
      "hint": "缩进、True/False、// 与 # 这三组最容易记反。"
    },
    {
      "id": "ch20-t5",
      "ch": "ch20",
      "kp": "ch20-4",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "exam",
        "concept"
      ],
      "stem": "判断：期末 Part IV 的简答与编程题按关键点给分，即使代码不完整，写出正确的类结构、方法签名与关键步骤也可能得到部分分。",
      "options": [
        {
          "text": "正确（True）",
          "correct": true
        },
        {
          "text": "错误（False）"
        }
      ],
      "answer": "true",
      "explain": "考纲明确说 partial marks 会给“表达清楚的想法或语法正确的未完成答案”，并强调评分看概念理解、语法准确与解题逻辑。所以 Part IV 的正确策略是先把骨架写出来：类声明、字段、方法签名、关键循环或判断，再补细节；即使最后没写完，阅卷人也能按关键点给分。反过来，空着或只写一句“不会”才是真的零分。",
      "hint": "先写结构与关键步骤，部分分就是给这些的。"
    },
    {
      "id": "ch20-t6",
      "ch": "ch20",
      "kp": "ch20-2",
      "type": "tf",
      "difficulty": 2,
      "tags": [
        "concept",
        "python",
        "trap"
      ],
      "stem": "判断：Java 的子类构造器会先调用父类构造器；Python 的子类只要定义了 <code>__init__</code>，也会自动调用父类的 <code>__init__</code>，所以不必写 <code>super().__init__()</code>。",
      "options": [
        {
          "text": "正确（True）"
        },
        {
          "text": "错误（False）",
          "correct": true
        }
      ],
      "answer": "false",
      "explain": "前半句对，后半句错，所以整题判 False。Java 在子类构造器里如果没有显式写 <code>super(...)</code>，编译器会自动插入对父类无参构造器的调用；但 Python 不会自动调用父类 <code>__init__</code>：子类一旦定义了自己的 <code>__init__</code>，实例化时只会执行子类版本，父类字段不会被初始化，必须显式写 <code>super().__init__(...)</code>（或 <code>父类名.__init__(self, ...)</code>）。这正是判断题的典型考法：一句话里混入一个跨语言的真事实和一个假事实。",
      "hint": "Java 会自动插 super()，Python 不会自动调父类 __init__。"
    },
    {
      "id": "ch20-t7",
      "ch": "ch20",
      "kp": "ch20-1",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "exam",
        "concept"
      ],
      "stem": "期末考是闭卷，除文具外只允许携带一种电子设备：不可编程、无存储与通信功能的 ____。",
      "answer": [
        "计算器"
      ],
      "accept": [
        "calculator",
        "Calculator",
        "普通计算器",
        "非编程计算器",
        "non-programmable calculator",
        "Non-programmable calculator"
      ],
      "explain": "考纲列出的允许材料只有两样：<b>不可编程的计算器</b>（没有存储与通信功能）和标准书写工具。手机、平板、智能手表以及任何能通信的电子设备一律禁止；笔记、教材、外部参考资料也不允许。所以复习时不要指望考场查资料，计算器也只是用来算数，不能存公式或程序。",
      "hint": "能带进考场的电子设备只有一种，而且不能编程。"
    },
    {
      "id": "ch20-t8",
      "ch": "ch20",
      "kp": "ch20-6",
      "type": "fill",
      "difficulty": 2,
      "tags": [
        "exam",
        "trap"
      ],
      "stem": "Part II 的判断题按整句给分：一句话里只要有一处与讲义不符，整题就应判 ____。",
      "answer": [
        "错误"
      ],
      "accept": [
        "False",
        "false",
        "错",
        "F",
        "错误（False）",
        "错误(False)"
      ],
      "explain": "判断题考的是“这个断言整体是否成立”。一句话往往包含多个分句，只要其中任何一个关键点错（例如把 <code>start()</code> 说成不创建线程、把 <code>readLine()</code> 的 EOF 说成空字符串），整个断言就不成立，应判 False。不能因为前半句对就判 True，也不能因为出现 always、never 这类词就机械判错——绝对化词只是提示，最终仍要回到讲义判据。",
      "hint": "整句是一个断言，一部分错就是错。"
    },
    {
      "id": "ch20-t9",
      "ch": "ch20",
      "kp": "ch20-1",
      "type": "fill",
      "difficulty": 1,
      "tags": [
        "exam",
        "concept"
      ],
      "stem": "Part I 选择题共 10 题，每题 3 分，合计 ____ 分。",
      "answer": [
        "30"
      ],
      "accept": [
        "30分"
      ],
      "explain": "Part I 是 10 × 3 = 30 分，占总分 30%；Part II 是 5 × 4 = 20 分；Part III 是 5 × 5 = 25 分；Part IV 两题共 25 分。四部分相加正好 100 分。记住这张分值表，考场上就能快速判断一道题值多少时间：Part I 一题 3 分，不值得纠缠超过两分钟；Part IV 一题十几分，必须留足时间写结构。",
      "hint": "10 题，每题 3 分。"
    },
    {
      "id": "ch20-f1",
      "ch": "ch20",
      "kp": "ch20-5",
      "type": "fill",
      "mode": "findbug",
      "difficulty": 3,
      "tags": [
        "bug",
        "tkinter",
        "python"
      ],
      "stem": "复习 <code>after()</code> 时看到下面这段调度代码，本意是每 100 毫秒跑一帧，但程序很快递归过深报错。找出错误并说明改法。",
      "codeTitle": "Python",
      "code": "def run_game(self):\n    self.move_snake()\n    self.update_ui()\n    self.after(100, self.run_game())",
      "answer": "第 3 行 self.after(100, self.run_game()) 多了一对括号；应改为 self.after(100, self.run_game)。",
      "accept": [
        {
          "hint": "指出 after 的第二个参数被写成了函数调用 self.run_game()",
          "any": [
            "run_game()",
            "多了括号",
            "多了一对括号",
            "立即执行",
            "调用而不是传函数",
            "self.run_game()",
            "函数被调用",
            "函数调用",
            "提前调用",
            "先执行了",
            "函数被立即执行"
          ]
        },
        {
          "hint": "改成 self.after(100, self.run_game)，只传函数对象",
          "any": [
            "self.after(100, self.run_game)",
            "去掉括号",
            "去掉()",
            "不写括号",
            "不要括号",
            "删掉括号",
            "删除括号",
            "传函数名",
            "传函数对象",
            "只传函数"
          ]
        }
      ],
      "minHits": 2,
      "explain": "函数调用的参数在<b>调用发生之前</b>就会求值：执行 <code>self.after(100, self.run_game())</code> 时，Python 先调用 <code>self.run_game()</code>，而它内部又执行到同一行、又调用一次，形成无限递归，根本轮不到 <code>after</code> 登记回调。正确写法是传函数对象 <code>self.after(100, self.run_game)</code>，让 Tkinter 在 100 毫秒后替我们调用。这也是所有回调 API（<code>bind</code>、<code>after</code>、<code>command=</code>）的共同规则：传函数名，不传调用结果。",
      "hint": "after 要的是“函数对象”，不是“函数执行结果”。"
    },
    {
      "id": "ch20-t10",
      "ch": "ch20",
      "kp": "ch20-2",
      "type": "predict",
      "difficulty": 3,
      "tags": [
        "output",
        "python",
        "trap"
      ],
      "stem": "下面的 Python 代码演示类属性与实例属性，写出 <code>print</code> 这一行的输出。",
      "codeTitle": "Python",
      "code": "class Counter:\n    count = 0\n\n    def __init__(self):\n        self.count += 1\n\na = Counter()\nb = Counter()\nprint(Counter.count, a.count, b.count)",
      "answer": "0 1 1",
      "explain": "<code>count = 0</code> 写在类体里，是<b>类属性</b>，所有实例共享；<code>self.count += 1</code> 等价于 <code>self.count = self.count + 1</code>：读取时先找到类属性的 0，加 1 后<b>赋值给实例属性</b>。赋值会在实例自己的命名空间里新建一个 <code>count</code>，不会修改类属性。所以两次实例化后，<code>Counter.count</code> 仍是 0，而 <code>a.count</code> 与 <code>b.count</code> 各自是 1。若想共享计数，应写 <code>Counter.count += 1</code> 或 <code>type(self).count += 1</code>。",
      "hint": "self.count = ... 创建的是实例属性，不会改类属性。"
    },
    {
      "id": "ch20-t11",
      "ch": "ch20",
      "kp": "ch20-2",
      "type": "multi",
      "difficulty": 2,
      "tags": [
        "concept",
        "exam",
        "python",
        "thread",
        "socket"
      ],
      "stem": "考前最后一遍串讲，下列哪些说法正确？（多选）",
      "options": [
        {
          "text": "父类引用指向子类对象时，重写方法的调用由对象的实际类型决定",
          "correct": true
        },
        {
          "text": "调用 <code>t.start()</code> 才会创建新线程；直接调用 <code>t.run()</code> 仍在当前线程执行",
          "correct": true
        },
        {
          "text": "<code>ServerSocket.accept()</code> 在没有客户端连接时会阻塞等待",
          "correct": true
        },
        {
          "text": "Tkinter 的 <code>pack()</code> 与 <code>grid()</code> 可以混用在同一个父容器里，布局会自动协调"
        },
        {
          "text": "<code>after(100, f)</code> 会让当前线程暂停 100 毫秒，再继续执行下一行"
        }
      ],
      "explain": "前三条是三个项目里最高频的机制：多态看<b>对象实际类型</b>做动态绑定；<code>start()</code> 向 JVM 申请新线程再由新线程回调 <code>run()</code>，直接调 <code>run()</code> 只是普通方法调用；<code>accept()</code> 在监听套接字上阻塞，直到有客户端连上才返回一个 <code>Socket</code>。后两条是常见误区：同一个父容器里 <code>pack</code> 与 <code>grid</code> 不能混用，Tkinter 会报布局冲突；<code>after</code> 只是把回调登记到事件队列后立刻返回，暂停线程的是 <code>time.sleep</code>。",
      "hint": "多态、start/run、accept 阻塞都是“机制型”事实；几何管理与 after 别记反。"
    },
    {
      "id": "ch20-t12",
      "ch": "ch20",
      "kp": "ch20-4",
      "type": "order",
      "difficulty": 2,
      "tags": [
        "exam",
        "concept"
      ],
      "stem": "把考场上处理一道 Part IV 编程题的步骤按合理顺序排列。",
      "options": [
        {
          "text": "读题，标出输入、输出、要实现的类与方法"
        },
        {
          "text": "先写类声明、字段与方法签名，搭好结构"
        },
        {
          "text": "填核心逻辑（循环、条件、数据结构操作）"
        },
        {
          "text": "用题目给的小样例手算走一遍，检查边界"
        },
        {
          "text": "检查括号、分号、缩进等语法，再进入下一题"
        }
      ],
      "answer": [
        0,
        1,
        2,
        3,
        4
      ],
      "explain": "Part IV 按关键点给分，所以顺序要围绕“先拿结构分，再拿逻辑分，最后保语法分”：先读题确认输入输出与要写的类/方法，避免答非所问；接着把类声明、字段、方法签名写出来，这一步就能拿部分分；再填循环、条件等核心逻辑；然后用题目的小样例手算一遍，检查边界（空输入、最后一项、等于号）；最后专门检查括号、分号、缩进。先写细节再搭结构，一旦方向错，整段都要重写。",
      "hint": "先骨架后逻辑，先样例后语法。"
    }
  ] };

  /* 数据先于引擎加载（app.js 的 loadQuizPack 先 data/quiz.js 再 assets/quiz.js），
     因此把同一份 pack 挂到 CSC._quizPack 上，引擎启动时从这里读。 */
  var G = (typeof globalThis !== 'undefined') ? globalThis
        : (typeof window !== 'undefined') ? window : this;
  var C = G && G.CSC;
  if (C && typeof C.registerQuizPack === 'function') {
    try { C._quizPack = PACK; } catch (e) {}
    C.registerQuizPack(PACK);
  }
})();
