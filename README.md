<h1 align="center">MellowGrid</h1>

<p align="center">
  <img alt="Status: in development" src="https://img.shields.io/badge/status-in%20development-orange">
  <img alt="Usability: not yet" src="https://img.shields.io/badge/usable-not%20yet-red">
  <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript 5" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="Docker supported" src="https://img.shields.io/badge/Docker-supported-2496ED?logo=docker&logoColor=white">
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-green"></a>
</p>

<p align="center">
  <a href="README.md">简体中文</a> | <a href="README.en.md">English</a>
</p>

> [!WARNING]
> MellowGrid 仍在早期开发中，当前版本暂时不可用，不建议用于正式个人主页或生产部署。

MellowGrid 是一个个人自用、可自托管、Bento 风格的个人主页项目。它把公开主页、可视化编辑器、模块化卡片和灵活部署模式放在同一个轻量代码库里，适合用来搭建一个柔和、圆角、可扩展的个人主页。

> 当前定位：个人主页编辑器，而不是多人 SaaS 平台。项目优先保证个人维护方便、部署方式清晰、模块扩展简单。

## 功能亮点

- **Bento 风格公开主页**：通过 `/:username` 访问公开页面，左侧个人资料区 + 右侧模块化 Bento 网格。
- **可视化编辑器**：通过 `/editor` 添加模块、拖拽调整位置、缩放卡片、编辑内容、导入/导出 JSON。
- **模块化 Widget 系统**：当前内置 `link`、`links`、`text`、`stats`，新增模块时优先新增 widget 文件并注册。
- **共享 Bento Grid**：公开页和编辑器共用同一套 8 列布局解释，避免展示和编辑结果不一致。
- **多部署模式设计**：支持静态模式、本地/服务器文件模式，并为后续远程存储 adapter 预留扩展点。
- **Docker 自托管**：提供 `Dockerfile` 和 `docker-compose.yml`，适合 VPS、NAS 或个人服务器部署。

## 当前状态

已经实现：

- `/:username` 公开个人主页。
- `/editor` 可视化编辑器。
- 模块添加、删除、选择、属性编辑。
- Bento 卡片拖拽移动和拖拽缩放。
- JSON 导入/导出。
- `static` 模式下保存到浏览器本地草稿。
- `file` 模式下通过 API 保存到 `data/pages/<username>.json`。
- Docker standalone 构建与 docker compose 运行配置。

仍在规划/打磨：

- 远程存储 adapter，例如 KV、Supabase 或自定义 API。
- 编辑器密码保护和保存 API 鉴权。
- 更多 widget：图片、音乐、地图、GitHub、二维码等。
- 更完整的主题系统和配置校验。
- 静态部署导出流程文档。

## 快速开始

### 1. 安装依赖

```bash
npm ci
```

### 2. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问：

- 公开主页：<http://localhost:3000/username>
- 编辑器：<http://localhost:3000/editor>

根路径 `/` 会重定向到 `MELLOWGRID_DEFAULT_USER` 指定的用户页；未配置时默认是 `username`。

## 常用脚本

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run start    # 启动生产服务器
npm run lint     # 运行 ESLint
```

## 环境变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `MELLOWGRID_MODE` | 开发环境为 `file`，生产环境为 `static` | 部署模式：`static`、`file` 或预留的 `remote`。 |
| `MELLOWGRID_DEFAULT_USER` | `username` | 根路径重定向和编辑器默认加载的用户名。 |
| `MELLOWGRID_DATA_DIR` | `./data` | `file` 模式下保存页面 JSON 的数据目录。 |
| `MELLOWGRID_EDITOR_PASSWORD` | 空 | 预留字段；当前版本尚未接入编辑器鉴权。 |

## 部署模式

### File mode：本地、VPS、Docker 推荐模式

`file` 模式会从 `MELLOWGRID_DATA_DIR/pages` 读取页面配置，并在编辑器点击保存后写入 JSON 文件。

```bash
MELLOWGRID_MODE=file
MELLOWGRID_DEFAULT_USER=username
MELLOWGRID_DATA_DIR=./data
```

适合：

- 本地长期运行
- VPS / NAS / 个人服务器
- Docker Compose 自托管

### Static mode：静态部署模式

`static` 模式不会把编辑器保存结果写回公开页面。编辑器中的保存会写入浏览器 localStorage，适合作为本地草稿、导出 JSON 后再提交到仓库或重新部署。

适合：

- 静态站点托管
- GitHub Pages 一类环境
- 不需要在线写入服务器文件的场景

### Remote mode：预留扩展模式

`remote` 是为后续 KV、Supabase、Cloudflare、Upstash 或自定义 API 准备的 adapter 入口。当前版本尚未实现远程持久化。

## 使用 Docker Compose

```bash
docker compose up --build
```

默认服务会监听：

```txt
http://localhost:3000
```

`docker-compose.yml` 默认使用 `file` 模式，并把宿主机的 `./data` 挂载到容器内的 `/app/data`：

```yaml
volumes:
  - ./data:/app/data
```

这样编辑器保存后的页面配置会保留在仓库的 `data/pages` 目录中。

## 项目结构

```txt
mellow-grid/
├─ data/pages/                 # file mode 示例页面数据
├─ docs/superpowers/specs/     # 设计文档与阶段性规格
├─ src/
│  ├─ app/
│  │  ├─ [username]/           # 公开个人主页路由
│  │  ├─ editor/               # 可视化编辑器
│  │  └─ api/pages/[username]/ # 页面配置读写 API
│  ├─ components/page/         # 公开页渲染与 Bento Grid
│  ├─ components/ui/           # 通用 UI 基础组件
│  ├─ lib/
│  │  ├─ page-config/          # 页面配置类型、默认值、布局工具
│  │  ├─ storage/              # storage adapter
│  │  └─ widgets/              # widget 注册表
│  └─ widgets/                 # 各类 Bento 模块
├─ Dockerfile
├─ docker-compose.yml
├─ next.config.ts
└─ package.json
```

## Widget 扩展方式

新增右侧 Bento 模块时，推荐遵循下面的流程：

1. 在 `src/widgets/<widget-name>/index.tsx` 新增 widget 定义和组件。
2. 提供 `type`、`name`、`description`、`defaultLayout`、`defaultProps` 和 `Component`。
3. 在 `src/lib/widgets/registry.ts` 注册新模块。
4. 如需编辑字段，优先扩展编辑器 inspector，而不是把逻辑写死在页面渲染器中。

Profile 是独立的页面资料区，不走右侧 widget registry。

## 数据模型概览

页面配置由 `PageConfig` 描述，核心字段包括：

- `username`：页面所属用户名。
- `title` / `description`：页面标题和描述。
- `profile`：左侧个人资料区。
- `theme`：背景色、文字色、卡片色、强调色、圆角和阴影。
- `layout`：右侧 Bento 网格中的位置和尺寸。
- `widgets`：右侧模块实例和 props。
- `updatedAt`：最后更新时间。

相关文件：

- `src/lib/page-config/types.ts`
- `src/lib/page-config/defaults.ts`
- `src/lib/page-config/normalize.ts`

## 技术栈

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Zustand
- 自定义 Bento CSS Grid
- Storage Adapter：static / file / remote 预留
- Docker standalone build

## 路线图

- [ ] 完善编辑器鉴权和保存 API 鉴权。
- [ ] 增加页面配置校验。
- [ ] 增加 Image、Music、Map、GitHub、QR 等 widget。
- [ ] 抽象更完整的 theme tokens。
- [ ] 完善 static mode 和 GitHub Pages 部署说明。
- [ ] 增加基础测试和安全检查。

## 维护原则

- 不把编辑器依赖塞进公开页面。
- 不把存储逻辑写死在 UI 组件里。
- 不为了一个模块修改整个渲染器。
- 新增右侧模块优先走 widget registry。
- 新增部署方式优先走 storage adapter。
- 示例数据使用通用占位信息，避免写入真实个人信息。

## 许可证

本项目基于 [MIT License](LICENSE) 开源。
