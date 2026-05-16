# MellowGrid Project Plan

## 项目简介

MellowGrid 是一个个人自用、开源、Bento 风格的个人主页项目。核心目标是提供一个圆角、简洁、带柔和阴影、响应迅速、可视化编辑、模块易扩展的个人主页系统。

项目不是多人 SaaS 平台，首要目标是个人维护方便、部署方式灵活、代码结构清晰。后续可以逐步扩展成更完整的个人主页编辑器。

## 核心目标

- 支持 `/:username` 公开个人主页。
- 支持 `/editor` 可视化编辑页面。
- 支持模块拖拽、调整大小、编辑内容。
- 支持多种部署模式：静态部署、文件存储部署、未来远程存储部署。
- 支持未来 Docker 一键部署。
- 模块系统要易维护，新增模块时尽量只新增 widget 文件并注册。
- 公开主页要保持轻量，不加载完整编辑器依赖。

## 当前技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- React
- 文件存储 adapter / 静态存储 adapter
- Docker standalone 构建预留

计划引入：

- Zustand：编辑器状态管理
- React Grid Layout：拖拽和 resize 网格
- Framer Motion：轻微 hover、入场和浮动动画
- MapLibre / react-map-gl：地图模块
- Spotify Embed / HTML audio：音乐模块

## 当前项目结构

```txt
mellow-grid/
├─ data/
│  └─ pages/
│     └─ username.json
│
├─ docs/
│  └─ superpowers/
│     └─ specs/
│        └─ 2026-05-16-mellow-grid-design.md
│
├─ src/
│  ├─ app/
│  │  ├─ page.tsx
│  │  ├─ [username]/
│  │  │  └─ page.tsx
│  │  ├─ editor/
│  │  │  └─ page.tsx
│  │  └─ api/
│  │     └─ pages/
│  │        └─ [username]/
│  │           └─ route.ts
│  │
│  ├─ components/
│  │  ├─ page/
│  │  │  └─ page-renderer.tsx
│  │  └─ ui/
│  │     └─ bento-card.tsx
│  │
│  ├─ lib/
│  │  ├─ page-config/
│  │  │  ├─ defaults.ts
│  │  │  └─ types.ts
│  │  ├─ storage/
│  │  │  ├─ file-storage.ts
│  │  │  ├─ index.ts
│  │  │  ├─ static-storage.ts
│  │  │  ├─ types.ts
│  │  │  └─ README.md
│  │  └─ widgets/
│  │     └─ registry.ts
│  │
│  └─ widgets/
│     ├─ profile/
│     │  └─ index.tsx
│     ├─ links/
│     │  └─ index.tsx
│     ├─ text/
│     │  └─ index.tsx
│     └─ stats/
│        └─ index.tsx
│
├─ Dockerfile
├─ docker-compose.yml
├─ .dockerignore
├─ .env.example
├─ next.config.ts
└─ package.json
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
标题和描述
theme
layout
widgets
updatedAt
```

`layout` 保存网格位置和尺寸，`widgets` 保存模块实例和 props。

### Widget 模块系统

所有模块通过注册表统一管理：

```txt
src/lib/widgets/registry.ts
```

每个 widget 至少包含：

```txt
type
name
description
defaultLayout
defaultProps
Component
```

新增模块时优先遵循这个模式：

```txt
src/widgets/<widget-name>/index.tsx
```

然后注册到：

```txt
src/lib/widgets/registry.ts
```

### Storage Adapter

存储逻辑通过 adapter 隔离：

```txt
src/lib/storage
```

当前模式：

- `staticStorage`：静态模式，用于 GitHub Pages 等静态部署。
- `fileStorage`：文件模式，用于 Node.js / VPS / Docker。

未来模式：

- `remoteStorage`：用于 Upstash、Vercel KV、Cloudflare KV、Supabase 或自定义 API。

### 部署模式

通过环境变量控制：

```txt
MELLOWGRID_MODE=static | file | remote
MELLOWGRID_DEFAULT_USER=username
MELLOWGRID_DATA_DIR=./data
MELLOWGRID_EDITOR_PASSWORD=
```

静态模式无法在没有外部服务的情况下把编辑器保存结果同步给所有访客。静态模式适合 localStorage 草稿、导出 JSON、提交后重新部署。

文件模式支持点击保存后写入 JSON，刷新公开页后读取最新状态，适合 VPS / Docker / 本地 Node 服务。

## 当前已完成

- 初始化 Next.js 项目。
- 添加项目设计文档。
- 添加公开用户页 `/:username`。
- 添加编辑器占位页 `/editor`。
- 添加页面配置类型和默认配置。
- 添加 storage adapter 基础结构。
- 添加 file/static 两种 storage 实现。
- 添加 API 路由 `/api/pages/[username]`。
- 添加初始 widgets：Profile、Links、Text、Stats。
- 添加 Bento 卡片基础样式。
- 添加 Dockerfile、docker-compose.yml、.env.example。
- 配置 `output: "standalone"` 以支持 Docker 部署。
- 通过 `npm run lint` 和 `npm run build`。

## 下一阶段路线

### 阶段 1：编辑器基础能力

目标：让 `/editor` 真正可以编辑页面。

任务：

- 安装并接入 Zustand。
- 安装并接入 React Grid Layout。
- 创建 editor store。
- 实现模块选择状态。
- 实现拖动模块。
- 实现调整模块大小。
- 实现模块添加和删除。
- 实现属性面板基础表单。
- 实现导入 / 导出 JSON。
- 在 static mode 下保存到 localStorage。
- 在 file mode 下 POST 到 `/api/pages/[username]`。

### 阶段 2：模块扩展

目标：覆盖目标截图中的常见个人主页模块。

任务：

- Image widget
- Music widget
  - Spotify embed 模式
  - HTML audio 模式
- Map widget
  - MapLibre/react-map-gl
  - Based in 标签
- GitHub widget
  - 贡献热力图样式
  - 后续接 GitHub 数据
- QR widget
- Social icon widget
- Quote / About widget 增强

### 阶段 3：主题系统

目标：让页面风格更接近柔和 Bento 主页。

任务：

- 抽象 theme tokens。
- 支持圆角等级。
- 支持阴影等级。
- 支持背景色 / 卡片色 / 强调色。
- 支持 glass / solid / gradient 卡片风格。
- 编辑器中可修改主题。

### 阶段 4：部署体验

目标：让项目更容易开源使用。

任务：

- 完善 README。
- 添加 Docker 使用说明。
- 添加 GitHub Pages 静态部署说明。
- 添加 file mode 自托管说明。
- 增加示例 `.env`。
- 验证 `docker compose up`。
- 增加静态导出配置方案。

### 阶段 5：安全与维护

目标：让 file mode 的编辑能力不被公开滥用。

任务：

- 为 `/editor` 增加轻量密码保护。
- 为保存 API 增加鉴权。
- 增加页面配置校验。
- 避免外部链接和图片配置引入明显安全问题。
- 增加基础测试。

## 示例数据规范

仓库内示例文件必须使用通用占位信息，例如 `username`、`Your Name`、`Based in Your City`。不要在示例配置、文档、默认值或测试数据里写入真实个人信息。

## 后续协作提示

每次继续开发前，请先阅读：

```txt
PROJECT_PLAN.md
AGENTS.md
CLAUDE.md
src/lib/page-config/types.ts
src/lib/widgets/registry.ts
src/lib/storage/index.ts
```

开发时优先保持这些原则：

- 不要把编辑器依赖塞进公开页面。
- 不要把存储逻辑写死在 UI 组件里。
- 不要为了一个模块修改整个渲染器。
- 新模块优先走 widget registry。
- 新部署方式优先走 storage adapter。
- 首版保持个人自用，不做多人 SaaS。
- 任何保存到公开页面的数据都要考虑后续校验和鉴权。

## 推荐下一步

下一步优先做编辑器基础能力：

```txt
Zustand store + React Grid Layout canvas + 右侧属性面板 + 保存按钮
```

这一步完成后，MellowGrid 就会从静态展示骨架变成真正可编辑的个人主页系统。
