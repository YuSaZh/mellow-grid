# MellowGrid Project Plan

## 项目简介

MellowGrid 是一个个人自用、开源、2.5D Bento 风格的个人主页项目。核心目标是提供一个可视化编辑、模块易扩展、部署方式灵活、最终公开页足够轻量的个人主页系统。

项目不是多人 SaaS 平台。优先级是：个人维护方便、编辑体验直观、公开页轻量、静态部署友好、代码结构清晰。编辑器主要作为本地或自托管的配置工具；最终个人主页可以用静态模式展示。

## 核心目标

- 支持 `/editor` 可视化编辑个人主页配置。
- 支持 `/[username]` 公开个人主页。
- 支持模块添加、选择、拖拽、缩放、内容编辑和保存。
- 公开主页和编辑器预览共用同一套 Bento Grid 渲染规则。
- Widget 比例由 grid size 决定，避免 viewport 变化导致模块被拉伸。
- 移动端竖屏使用 profile 在上、widgets 在下的单列排版。
- 支持多种配置来源：静态默认配置、文件 JSON、未来远程存储。
- 支持未来把编辑完成的个人主页导出为静态压缩包，解压到网站目录即可访问。
- 公开主页保持轻量，不加载完整编辑器依赖。

## 当前技术栈

- Next.js App Router 16.2.6
- React 19
- TypeScript
- Tailwind CSS
- Zustand 编辑器状态管理
- CSS Grid Bento 渲染
- 文件存储 adapter / 静态存储 adapter
- Standalone build 预留 Docker / Node 部署
- Pencil / Figma 作为设计参考来源

仍在依赖中但当前主路径不再使用：

- `react-grid-layout`
- `react-resizable`

后续可以在确认不再需要旧 RGL 路线后清理。

## 当前项目结构

```txt
mellow-grid/
├─ app/                         # 兼容入口，转发到 src/app
├─ data/
│  └─ pages/
│     └─ username.json           # file mode 当前编辑器保存配置
├─ docs/
│  └─ superpowers/
│     └─ specs/
├─ src/
│  ├─ app/
│  │  ├─ page.tsx                # 根路径，默认跳转到默认用户
│  │  ├─ [username]/page.tsx      # 公开个人主页
│  │  ├─ editor/
│  │  │  ├─ page.tsx
│  │  │  ├─ editor-client.tsx
│  │  │  ├─ store.tsx
│  │  │  └─ components/
│  │  │     ├─ editor-layout.tsx
│  │  │     ├─ editor-canvas.tsx
│  │  │     ├─ editor-toolbar.tsx
│  │  │     ├─ editable-profile.tsx
│  │  │     ├─ widget-editor-modal.tsx
│  │  │     ├─ widget-inspector.tsx
│  │  │     ├─ link-widget-inspector.tsx
│  │  │     ├─ add-widget-panel.tsx
│  │  │     └─ inspector-fields.tsx
│  │  └─ api/pages/[username]/route.ts
│  │
│  ├─ components/
│  │  ├─ page/
│  │  │  ├─ page-renderer.tsx
│  │  │  ├─ page-shell.tsx
│  │  │  ├─ profile-panel.tsx
│  │  │  ├─ bento-grid.tsx
│  │  │  └─ bento-grid.module.css
│  │  ├─ ui/
│  │  │  └─ bento-card.tsx
│  │  └─ widgets/
│  │     ├─ widget-shell.tsx
│  │     ├─ icon-effect.tsx
│  │     └─ link-logo.tsx
│  │
│  ├─ lib/
│  │  ├─ page-config/
│  │  │  ├─ bento-layout.ts
│  │  │  ├─ defaults.ts
│  │  │  ├─ normalize.ts
│  │  │  └─ types.ts
│  │  ├─ storage/
│  │  │  ├─ file-storage.ts
│  │  │  ├─ static-storage.ts
│  │  │  ├─ index.ts
│  │  │  ├─ types.ts
│  │  │  └─ README.md
│  │  └─ widgets/
│  │     ├─ logo-registry.tsx
│  │     └─ registry.ts
│  │
│  └─ widgets/
│     ├─ link/index.tsx
│     ├─ links/index.tsx
│     ├─ text/index.tsx
│     └─ stats/index.tsx
│
├─ next.config.ts
├─ package.json
├─ Dockerfile
├─ docker-compose.yml
└─ PROJECT_PLAN.md
```

## 关键架构说明

### 页面配置

页面配置由 `PageConfig` 描述，位置：

```txt
src/lib/page-config/types.ts
```

核心字段：

```txt
username
title / description
profile
layout
widgets
updatedAt
```

`profile` 保存左侧个人资料区，独立于 widget registry；`layout` 保存右侧 Bento Grid 位置和尺寸；`widgets` 保存模块实例和 props。

### Bento Grid 尺寸模型

当前 Bento Grid 使用 4 列设计模型：

```txt
cell size: 175px
gap: 40px
grid width: 820px
```

关键文件：

```txt
src/lib/page-config/bento-layout.ts
src/components/page/bento-grid.tsx
src/components/page/bento-grid.module.css
```

约束：

- `1x1` 始终是方形。
- `2x1` 始终保持 2:1。
- `2x2` 始终是方形。
- public page 和 editor preview 使用同一套 grid 参数。
- 移动端通过 layout 派生 aspect ratio，避免 widget 被拉伸或塌陷。

### Widget 模块系统

所有模块通过注册表统一管理：

```txt
src/lib/widgets/registry.ts
```

每个 widget 至少包含：

```txt
name
description
defaultLayout
defaultProps
Component
```

当前主要 widgets：

- `link`：单个链接 / 社交 / 行动入口卡片。
- `links`：链接列表。
- `text`：说明文本卡片。
- `stats`：数字统计卡片。

旧 `social` widget 已删除，当前统一使用 `link` widget。

### 2.5D Widget 外观

关键文件：

```txt
src/components/widgets/widget-shell.tsx
src/components/widgets/icon-effect.tsx
src/components/widgets/link-logo.tsx
src/lib/widgets/logo-registry.tsx
src/widgets/link/index.tsx
```

当前约定：

- `WidgetShell` 负责卡片圆角、描边、顶部高光、背景和链接 indicator。
- `IconEffect` 负责 logo 的多层 2.5D 投影和轻微亮边。
- `LinkLogo` 负责 builtin / uploaded / fallback initials 三种 logo 渲染。
- Link widget 使用 `UI.pen` / Figma Playground widget 的 48px icon、24px 内边距参考。

### Storage Adapter

存储逻辑通过 adapter 隔离：

```txt
src/lib/storage
```

当前模式：

- `fileStorage`：读取和写入 `data/pages/<username>.json`，用于 dev / VPS / Docker / 本地 Node 服务。
- `staticStorage`：读取 `src/lib/page-config/defaults.ts` 中的 `defaultPageConfig`，用于无服务器静态展示。

模式选择：

```txt
MELLOWGRID_MODE=static | file | remote
MELLOWGRID_DEFAULT_USER=username
MELLOWGRID_DATA_DIR=./data
```

默认逻辑：

- development 默认 `file`。
- production 默认 `static`。

因此：

- `npm run dev` 默认读 `data/pages/username.json`。
- `npm run build && npm run start` 默认读 `src/lib/page-config/defaults.ts`。

如果需要 production 读取编辑器保存的 JSON，需要设置：

```bash
MELLOWGRID_MODE=file
```

或者把编辑器 JSON 同步到 `defaults.ts`。

## 当前已完成

- Next.js App Router 项目初始化。
- 公开用户页 `/[username]`。
- 可视化编辑页 `/editor`。
- Zustand editor store。
- Profile 编辑。
- Widget 添加、选择、拖拽、缩放、内容编辑。
- 顶层 widget 编辑浮窗。
- Link widget inspector。
- file/static storage adapter。
- 保存 API `/api/pages/[username]`。
- `link` / `links` / `text` / `stats` widgets。
- 统一 `WidgetShell`。
- 内置 logo registry 与上传 logo 数据模型。
- 2.5D `IconEffect`。
- 共享 `BentoGrid`，公开页和 editor 复用同一渲染逻辑。
- 固定 4 列 Bento Grid 比例模型，避免 widget 被页面宽高变化拉伸。
- editor/public grid 宽度对齐，减少切换到 editor 后 UI 比例变化。
- 移动端竖屏 profile 在上、widgets 在下。
- 用当前编辑器配置同步覆盖 `defaultPageConfig`，使 static 模式展示当前样例。
- `npm run lint` 和 `npm run build` 已多次通过。

## 当前注意事项

- 生产默认 `static` 模式不会读取 `data/pages/username.json`；它读取 `src/lib/page-config/defaults.ts`。
- 编辑器保存的是 JSON；static 默认配置是 TS。两者需要同步机制，避免 dev/prod 展示不一致。
- 当前 `next.config.ts` 使用 `output: "standalone"`，适合 Node/Docker 部署；GitHub Pages 纯静态部署需要未来增加 `output: "export"` 模式。
- GitHub Pages 无法直接运行保存 API，也无法把 editor 保存结果写回仓库文件。
- 本地 dev server 建议显式指定 hostname，避免当前系统环境中的网络接口枚举问题：

```bash
npm run dev -- --hostname 127.0.0.1 --port 3001
```

- 当前依赖中仍有 React Grid Layout 相关包，主路径已不使用，后续可清理。

## 下一阶段路线

### 阶段 1：编辑器体验打磨

目标：让 `/editor` 更稳定、更接近最终设计工具。

任务：

- 优化拖拽和缩放手感。
- 优化添加模块后的默认 placement。
- 改善小屏编辑器工具栏避让。
- 增加删除模块能力的确认流程。
- 增加编辑器撤销 / 重做。
- 增加草稿保存提示。
- 增加导入 / 导出 JSON 的明确入口。
- 增加导出 `defaults.ts` 的入口，用于直接覆盖 static 模式默认配置。
- 增加“同步当前 JSON 到 static 默认配置”的开发脚本。

### 阶段 2：静态导出与压缩包发布

目标：编辑器完成后，可以导出一个静态网站压缩包。用户解压到网站目录，即可直接访问个人主页，不需要 Node server、API、数据库或编辑器运行时。

未来能力：

- 新增 `export:site` 模式。
- 支持 `output: "export"` 生成静态站点。
- 支持只导出个人主页，不导出 editor / API。
- 支持把当前编辑器配置写入 build-time static config。
- 支持编辑器导出 static config TS 文件，例如 `defaults.ts`，减少 JSON 到 TS 的手动转换步骤。
- 支持导出 zip 包，例如：

```txt
mellow-grid-site.zip
├─ index.html
├─ _next/static/...
└─ assets/...
```

- 解压后可部署到：
  - GitHub Pages
  - Cloudflare Pages
  - Netlify static
  - Nginx 静态目录
  - 任意对象存储 / CDN

进一步可探索：

- 真正单文件 `index.html` 导出。
- 内联关键 CSS。
- 上传 logo / 图片资源复制到导出包。
- basePath / assetPrefix 自动配置。
- 导出前自动隐藏 editor 相关路由。

### 阶段 3：GitHub Pages 静态部署

目标：支持仓库用户把个人主页部署到 GitHub Pages。

任务：

- 增加 `GITHUB_PAGES=true` 构建模式。
- `next.config.ts` 支持 `output: "export"`。
- 支持仓库名 basePath / assetPrefix。
- 为 `/[username]` 或单页 `/` 增加静态导出策略。
- 写入 GitHub Actions 部署示例。
- 文档说明 static 模式下 editor 不能在线保存，只能导出 JSON 后重新构建部署。

### 阶段 4：配置同步与数据工作流

目标：解决 JSON 编辑配置与 TS 默认配置双源维护问题。

任务：

- 新增 `scripts/sync-defaults`：把 `data/pages/username.json` 转换为 `src/lib/page-config/defaults.ts`。
- 可选新增 `scripts/export-config`：从 editor 下载 JSON 后格式化写入 data。
- 编辑器导出菜单支持三种配置产物：JSON、`defaults.ts`、未来静态网站 zip。
- `defaults.ts` 导出必须只用 `JSON.stringify` 写入数据对象，避免把用户输入拼接成可执行代码。
- 可选让 staticStorage 直接读取 build-time JSON。
- 设计多用户配置映射方式。
- 明确 `file` / `static` / `remote` 三种模式的配置来源。

### 阶段 5：模块扩展

目标：覆盖更多个人主页常见模块。

任务：

- Image widget。
- Music widget。
  - Spotify embed 模式。
  - HTML audio 模式。
- Map widget。
  - MapLibre / react-map-gl。
  - Based in 标签。
- GitHub widget。
  - 贡献热力图样式。
  - 后续接 GitHub 数据。
- QR widget。
- Quote / About widget 增强。
- Gallery / Project widget。

### 阶段 6：主题系统

目标：让页面风格更系统化。

任务：

- 抽象 theme tokens。
- 支持圆角等级。
- 支持阴影等级。
- 支持背景色 / 卡片色 / 强调色。
- 支持 glass / solid / gradient 卡片风格。
- 支持每个 link widget 的品牌色、logo 和背景组合。
- 编辑器中可修改主题。

### 阶段 7：部署与安全

目标：让项目更容易自托管和安全使用。

任务：

- 完善 README。
- 添加 Docker 使用说明。
- 添加 file mode 自托管说明。
- 验证 `docker compose up`。
- 为 `/editor` 增加轻量密码保护。
- 为保存 API 增加鉴权。
- 增加页面配置校验。
- 避免外部链接和图片配置引入明显安全问题。
- 增加基础测试。

## 示例数据规范

仓库内示例文件应使用通用占位信息，例如 `username`、`Your Name`、`Based in Your City`。如果后续需要放入真实个人主页内容，建议通过用户自己的分支或私有配置维护。

## 后续协作提示

每次继续开发前，请先阅读：

```txt
PROJECT_PLAN.md
AGENTS.md
src/lib/page-config/types.ts
src/lib/widgets/registry.ts
src/lib/storage/index.ts
src/lib/page-config/bento-layout.ts
```

开发时优先保持这些原则：

- 不要把编辑器依赖塞进公开页面。
- 不要把存储逻辑写死在 UI 组件里。
- 不要为了一个模块修改整个渲染器。
- Profile 是独立页面资料区，不走 widget registry。
- 新增右侧 Bento 模块优先走 widget registry。
- 新部署方式优先走 storage adapter 或独立 build/export pipeline。
- 首版保持个人自用，不做多人 SaaS。
- 任何保存到公开页面的数据都要考虑后续校验和鉴权。
- 静态导出相关改动要同时考虑 GitHub Pages basePath 和普通网站根目录两种场景。

## 推荐下一步

优先补齐配置同步与静态导出路线：

```txt
sync-defaults script + export:site static build + zip package export
```

完成后，MellowGrid 的工作流会更清晰：

```txt
本地 /editor 编辑 -> 保存 JSON -> 同步 static config -> 导出 zip -> 解压部署个人主页
```
