# 学习中心 · OBSERVATORY 深空观测台

[中文](#中文) · [English](#english)

---

## 中文

一个**纯静态、零依赖、双击即用**的课程学习站合集：66 门港中大（深圳）课程，按院系组织成一片星空。

打开 `index.html` 即可使用，不需要安装、不需要联网、不需要服务器。

**在线访问**：<https://captain-op2008.github.io/LGU-learning-center/>

- 66 门课程 · 12 个院系 · 582 章正文
- 5181 道题目 · 76 套模拟卷 · 198 个课程项目
- 章内知识点、例题、练习、题库、模拟卷、课程项目
- 跨课程全文搜索、题库即时判题、模拟卷成绩记录与导出 / 导入
- 支持 PWA 安装（需要 http 访问，见下文）

### 目标用户

- **港中大（深圳）在校学生**：按院系与课号定位课程，用于随堂复习、作业参考与期末备考。
- **自学者**：想按 CS / 数学 / 统计的课程结构系统补基础，但不知道从哪本教材读起的人。
- **离线或弱网环境下的学习者**：教室、宿舍断网、通勤路上，或只有 U 盘、电脑不能联网时，双击即可打开全部内容。
- **低配设备用户**：纯静态页面，不加载框架与 CDN，老电脑与手机浏览器也能流畅浏览。

### 实际问题

1. **资料分散、学期结束后失联**：讲义、往年题与教材散落在群文件和网盘里，过期后很难再找。本站按课程与院系统一组织，课程正文与题库随仓库长期保存。
2. **复习没有路径**：直接翻 PDF 讲义往往不知道从哪一页读起。每门课被拆成章节，章内按「知识点 → 例题 → 练习」排布，并配有题库与模拟卷。
3. **只看不练、缺少反馈**：题库提交即判题并给出解析，模拟卷保存历史成绩，课程项目列出可动手的实战任务。
4. **依赖网络与安装**：本站是纯静态文件，`file://` 双击即可用；通过 http 打开时还能安装为 PWA 并离线缓存。
5. **资料版权边界**：原始讲义、课件、试卷与教材不做分发，站内只保留索引；正文、题库与交互由本项目编写。

### 使用方法

1. 直接打开上面的在线地址，或下载 / 克隆本仓库；
2. 本地使用时双击根目录的 `index.html`（或 `courses.html` 看全部课程目录）；
3. 完整使用手册见 [`使用说明.md`](使用说明.md)。

> 浏览器建议：近两年的 Chrome / Edge / Firefox / Safari。
> 双击打开（`file://`）时全部功能可用；只有「安装为应用」这类 PWA 能力需要 http 访问。

| 操作 | 说明 |
| --- | --- |
| 顶栏「全部课程」/ `courses.html` | 按 12 个院系浏览 66 门课，支持课名、课号与英文名搜索 |
| `/` 或右上角「搜索」 | 跨课程全文搜索：`↑` `↓` 选择、`Enter` 直达章节、`Esc` 关闭 |
| 课程站 | 章节正文与练习、题库即时判题、模拟卷与课程项目 |
| 右上角「静止模式」 | 停止全部动画，只保留静态画面；系统开启「减少动态效果」时默认启用 |
| 成绩记录 | 保存在各站 localStorage，可在课程站内导出 / 导入 JSON |

本地起一个静态服务器（可选，用于 PWA 预览）：

```bash
node _serve.js        # → http://127.0.0.1:8811/
```

### 目录结构

```text
学习中心/
├── index.html              门户：星空首页
├── courses.html            全部课程目录 + 搜索
├── 使用说明.md              面向使用者的完整手册
├── assets/                 门户样式、交互、跨课搜索索引
├── shared/                 公共样式、字体、图标、MathJax
├── sites/                  66 个课程站（每站可独立打开、独立离线）
├── resources/              资料库离线副本（本地生成，不入版本库）
├── _data/                  课程主数据与资料索引
├── _template/              new-site.js 使用的站点骨架
└── tools/                  生成、校验、打包脚本
```

### 资料库（可选，需自备原始资料）

各课程站的「资料库」页会链接到课程原始讲义、往年题与教材。受版权限制，**这些文件不在本仓库中**，站内「资料库」链接指向本机一个外部资料目录。因此：

- 在线阅读或 clone 后阅读时，**课程正文、知识点、题库、模拟卷、课程项目全部可用**，不依赖这些文件；
- 「资料库」页的链接会打不开（找不到本地文件），这是正常现象，不影响正文。

原始资料可从「数据来源与致谢」里的两个仓库获取。想补齐资料库的用户可以这样操作：

1. 把资料放好，使本仓库上一级存在 `CUHKSZ course/` 目录（或修改 `_data/course-files.json` 的 `root` 字段指向你的资料目录）；
2. 运行 `node tools/pack-resources.js`：按引用清单把用到的文件复制到 `resources/`，并把各站链接切到项目内；
3. 此后整个文件夹自包含，拷到 U 盘或另一台电脑，双击依然可用。

维护者常用命令：

```bash
node tools/pack-resources.js          # 按引用清单复制到 resources/ 并切换站内链接
node tools/pack-resources.js --check  # 校验副本完整（文件齐全、体积一致）
node tools/pack-resources.js --dry-run# 只统计，不复制
node tools/pack-resources.js --revert # 还原为指向外部资料目录，并删除 resources/
```

`resources/` 已在 `.gitignore` 中忽略。

### 校验与维护

```bash
node tools/check-hub.js               # 门户 + 全部课程站验收
node tools/check-site.js csc3001      # 单站结构验收
node tools/check-content.js csc3001   # 单站内容质量检查
node tools/build-hub-index.js         # 重建跨课程搜索索引
node tools/build-catalog.js           # 重建课程目录页
```

新增课程站：`node tools/new-site.js <参数>`（见脚本头部说明），骨架来自 `_template/`。

### AI 工具

本项目由作者与 AI 助手协作完成，主要使用 **DeepSeek**（本对话中的 AI 助手）辅助：

- 课程资料整理与源目录索引；
- 章节正文、知识点、题库与模拟卷的初稿撰写；
- 生成 / 校验脚本、门户样式与交互代码的编写和排错；
- 链接、路径、文件体积与格式的一致性检查。

AI 产出的内容均经作者人工筛选、修改与验收后才进入仓库；事实性内容以课程原始资料为准。

### 用户反馈与改进

以下来自 2 位真实用户的使用反馈，以及对应的改进：

| 反馈 | 相应改进 |
| --- | --- |
| 课程数量偏少 | 课程扩展至 66 门、12 个院系、582 章正文；课程主数据集中在 `_data/courses.json`，`tools/new-site.js` + `_template/` 可快速接入新课程。 |
| 网站交互性不强 | 增加跨课程全文搜索（`/` 唤起、键盘选择、直达章节）、课程目录搜索与院系筛选、键盘操作与静止模式；各课程站增加题库即时判题、模拟卷成绩记录与导出 / 导入，以及章节横幅配图。 |

### 数据来源与致谢

站内的课程资料整理自以下两个公开仓库，特此致谢：

- **CUHKSZ_sourse**（港中深资料）：<https://github.com/dsanying/CUHKSZ_sourse>
- **LGU-Course**：<https://github.com/LGUCourses/LGU-Course>

各课程站正文、题库与交互由本项目编写；原始讲义、课件、试卷、教材的版权归原作者与课程方所有，本项目仅提供本地索引与阅读入口，不再分发这些文件。

### 章节配图

每个章节页顶部有一张 1200×340 的横幅图（共 582 张，位于 `sites/<课程>/assets/img/chXX.webp`），只作视觉分隔与氛围铺垫，不承载知识点。图片全部取自可公开使用的图库：主体来自 [Burst](https://burst.shopify.com/)（CC0），科学、天文类补充自 NASA（公有领域），统一做裁切、调色与暗色渐变处理，不含需要署名的素材。某张图缺失时页面会自动隐藏该区域，删掉 `assets/img/` 下对应文件即可回到纯文字版。

### 许可

本项目代码与自编内容可自由使用、修改与分发（保留出处即可）。第三方课程资料不在许可范围内，请遵守其原始授权。章节配图来自 CC0 与公有领域图库，同样可自由使用。

---

## English

A collection of **pure-static, zero-dependency course study sites that run on a double-click**: 66 CUHK-Shenzhen courses, organized into a starfield by department.

Open `index.html` and it works — no install, no network, no server required.

**Online**: <https://captain-op2008.github.io/LGU-learning-center/>

- 66 courses · 12 departments · 582 chapters
- 5,181 quiz questions · 76 mock exams · 198 course projects
- Knowledge points, worked examples, exercises, question banks, mock exams and course projects in every chapter
- Cross-course full-text search, instant quiz grading, mock-exam score history with export / import
- Installable as a PWA (requires http access; see below)

### Target users

- **CUHK-Shenzhen students**: locate a course by department and course code for revision, homework reference and final-exam preparation.
- **Self-learners**: people who want to work through a CS / math / statistics curriculum in order without guessing which textbook to start from.
- **Learners offline or on weak networks**: lecture halls, dorm rooms without Wi-Fi, commutes, or a USB stick on a computer with no internet — double-click and everything opens.
- **Low-end devices**: plain static pages with no framework or CDN, so old laptops and mobile browsers stay responsive.

### Real problems

1. **Scattered, short-lived materials**: handouts, past papers and textbooks live in chat groups and cloud drives and vanish after the term. The site reorganizes them by course and department, and keeps the written chapters and question banks in the repository.
2. **No study path**: flipping through a PDF handout gives you no clear starting point. Each course is split into chapters ordered as *concepts → worked examples → exercises*, backed by question banks and mock exams.
3. **Reading without practice or feedback**: quizzes are graded on submit with explanations, mock exams keep a score history, and course projects list hands-on tasks.
4. **Dependence on network and installation**: the site is plain static files that run from `file://` by double-click; served over http it can also be installed as a PWA and cached for offline use.
5. **Copyright boundaries**: original handouts, slides, exam papers and textbooks are not redistributed — the site keeps only an index, while the chapters, question banks and interactions are written for this project.

### How to use

1. Open the online URL above, or download / clone this repository;
2. Locally, double-click `index.html` in the root folder (or `courses.html` for the full catalog);
3. The complete manual is [`使用说明.md`](使用说明.md) (in Chinese).

> Browsers: Chrome / Edge / Firefox / Safari from the last two years.
> Over `file://` every feature works; only PWA features such as "Install app" need http.

| Action | What it does |
| --- | --- |
| Top bar "All courses" / `courses.html` | Browse 66 courses by 12 departments; search by name, course code or English title |
| `/` or "Search" | Cross-course full-text search: `↑` `↓` to choose, `Enter` to open the chapter, `Esc` to close |
| Course site | Chapter text and exercises, instant quiz grading, mock exams and course projects |
| "Still mode" | Stops all animation and keeps a static frame; on by default when the system requests reduced motion |
| Score records | Stored in each site's localStorage; export / import as JSON inside the course site |

Optional local static server (for the PWA preview):

```bash
node _serve.js        # → http://127.0.0.1:8811/
```

### Repository layout

```text
学习中心/
├── index.html              Portal: the starfield home page
├── courses.html            Full course catalog + search
├── 使用说明.md              Complete user manual
├── assets/                 Portal styles, interactions, cross-course search index
├── shared/                 Shared styles, fonts, icons, MathJax
├── sites/                  66 course sites (each opens and works offline on its own)
├── resources/              Offline copy of the resource library (generated locally, not versioned)
├── _data/                  Course master data and resource index
├── _template/              Site skeleton used by new-site.js
└── tools/                  Generator, validation and packaging scripts
```

### Resource library (optional, bring your own sources)

Each course site's "Resource library" page links to the original handouts, past papers and textbooks. For copyright reasons **those files are not in this repository**: the links point to an external folder on the local machine. Therefore:

- When reading online or after cloning, **chapters, concepts, question banks, mock exams and course projects are all available** and do not depend on those files;
- Links on the "Resource library" page will not open (the local files are missing) — this is expected and does not affect the course text.

The original materials can be obtained from the two repositories listed under "Data sources and acknowledgements". To complete the resource library:

1. Place the materials so that a `CUHKSZ course/` directory exists next to this repository (or edit the `root` field in `_data/course-files.json` to point at your own folder);
2. Run `node tools/pack-resources.js`: it copies the referenced files into `resources/` and repoints the site links to the project folder;
3. The whole folder is then self-contained — copy it to a USB stick or another computer and double-clicking still works.

Maintainer commands:

```bash
node tools/pack-resources.js          # copy referenced files into resources/ and repoint links
node tools/pack-resources.js --check  # verify the copy (every file present, same size)
node tools/pack-resources.js --dry-run# count only, copy nothing
node tools/pack-resources.js --revert # repoint to the external folder and delete resources/
```

`resources/` is ignored by `.gitignore`.

### Validation and maintenance

```bash
node tools/check-hub.js               # portal + all course sites acceptance
node tools/check-site.js csc3001      # single-site structure acceptance
node tools/check-content.js csc3001   # single-site content quality checks
node tools/build-hub-index.js         # rebuild the cross-course search index
node tools/build-catalog.js           # rebuild the catalog page
```

Adding a course site: `node tools/new-site.js <args>` (see the script header); the skeleton comes from `_template/`.

### AI tools

This project was built by the author working with an AI assistant, mainly **DeepSeek** (the AI assistant used in this conversation). It helped with:

- organizing course materials and the source-directory index;
- first drafts of chapter text, knowledge points, question banks and mock exams;
- writing and debugging the generator / validation scripts, portal styles and interaction code;
- consistency checks on links, paths, file sizes and formatting.

All AI output is reviewed, edited and accepted by the author before it enters the repository; factual content follows the original course materials.

### User feedback and improvements

The following comes from two real users' feedback and the corresponding changes:

| Feedback | Improvement |
| --- | --- |
| Too few courses | The site now covers 66 courses across 12 departments with 582 chapters; course master data lives in `_data/courses.json`, and `tools/new-site.js` + `_template/` make adding a course fast. |
| Weak interactivity | Added cross-course full-text search (`/`, keyboard navigation, jump straight to a chapter), catalog search and department filtering, keyboard operation and still mode; course sites gained instant quiz grading, mock-exam score history with export / import, and chapter banner images. |

### Data sources and acknowledgements

The course materials on the site were compiled from the following two public repositories, with thanks:

- **CUHKSZ_sourse**: <https://github.com/dsanying/CUHKSZ_sourse>
- **LGU-Course**: <https://github.com/LGUCourses/LGU-Course>

The chapters, question banks and interactions were written for this project. Copyright of the original handouts, slides, exam papers and textbooks belongs to their authors and course providers; this project only provides local indexing and reading entry points and does not redistribute those files.

### Chapter images

Each chapter page has a 1200×340 banner at the top (582 in total, at `sites/<course>/assets/img/chXX.webp`). They serve only as visual breaks and atmosphere and carry no knowledge content. All images come from publicly usable sources: the majority from [Burst](https://burst.shopify.com/) (CC0), with science and astronomy images from NASA (public domain), uniformly cropped, colour-graded and given a dark gradient — no attribution-required assets are used. If an image is missing, the page hides that area automatically; delete the matching file under `assets/img/` to return to a text-only layout.

### License

The code and original content of this project may be freely used, modified and distributed (with attribution). Third-party course materials are not covered by this license — follow their original terms. Chapter images come from CC0 and public-domain sources and are equally free to use.
