# 学习中心 · OBSERVATORY 深空观测台

一个**纯静态、零依赖、双击即用**的课程学习站合集：66 门港中大（深圳）课程，按院系组织成一片星空。

打开 `index.html` 即可使用，不需要安装、不需要联网、不需要服务器。

**在线访问**：<https://captain-op2008.github.io/LGU-learning-center/>

- 66 门课程 · 12 个院系 · 582 章正文
- 章内知识点、例题、练习、题库、模拟卷、课程项目
- 跨课程全文搜索、学习进度、深色/浅色主题
- 支持 PWA 安装（需要 http 访问，见下文）

## 快速开始

1. 直接打开上面的在线地址，或下载/克隆本仓库；
2. 本地使用时双击根目录的 `index.html`（或 `courses.html` 看全部课程目录）；
3. 完整使用手册见 [`使用说明.md`](使用说明.md)。

> 浏览器建议：近两年的 Chrome / Edge / Firefox / Safari。
> 双击打开（`file://`）时全部功能可用；只有「安装为应用」这类 PWA 能力需要 http 访问。

本地起一个静态服务器（可选，用于 PWA 预览）：

```bash
node _serve.js        # → http://127.0.0.1:8811/
```

## 目录结构

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

## 资料库（可选，需自备原始资料）

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

## 校验与维护

```bash
node tools/check-hub.js               # 门户 + 全部课程站验收
node tools/check-site.js csc3001      # 单站结构验收
node tools/check-content.js csc3001   # 单站内容质量检查
node tools/build-hub-index.js         # 重建跨课程搜索索引
node tools/build-catalog.js           # 重建课程目录页
```

新增课程站：`node tools/new-site.js <参数>`（见脚本头部说明），骨架来自 `_template/`。

## 数据来源与致谢

站内的课程资料整理自以下两个公开仓库，特此致谢：

- **CUHKSZ_sourse**（港中深资料）：<https://github.com/dsanying/CUHKSZ_sourse>
- **LGU-Course**：<https://github.com/LGUCourses/LGU-Course>

各课程站正文、题库与交互由本项目编写；原始讲义、课件、试卷、教材的版权归原作者与课程方所有，本项目仅提供本地索引与阅读入口，不再分发这些文件。

## 许可

本项目代码与自编内容可自由使用、修改与分发（保留出处即可）。第三方课程资料不在许可范围内，请遵守其原始授权。
