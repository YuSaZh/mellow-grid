<h1 align="center">MellowGrid</h1>

<p align="center">
  <strong>一个轻量、静态优先、可视化编辑的 Bento 风格个人主页。</strong>
</p>

<p align="center">
  <a href="README.md">简体中文</a> · <a href="README.en.md">English</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-static-BC52EE?logo=astro&logoColor=white">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white">
  <img alt="Zustand" src="https://img.shields.io/badge/Zustand-state-443E38">
  <img alt="Static output" src="https://img.shields.io/badge/output-static-2EA44F">
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-green"></a>
</p>

---

MellowGrid 是一个面向个人主页的可视化 Bento 编辑器。它把公开主页和编辑器拆成两条清晰路径：访问者看到的是 Astro 生成的轻量静态页面；只有进入 `/editor` 时，才会加载 React 编辑器。

这个项目的目标不是做一个多人 SaaS 平台，而是提供一个适合个人长期维护的主页工作流：设计感足够强、公开页足够轻、编辑体验足够直观，最后可以通过静态输出或静态 HTML 进行发布。

## 为什么是 MellowGrid

- **静态优先**：公开主页默认是 Astro static output，不依赖运行时后端。
- **编辑器按需加载**：React、Zustand 和编辑器交互只在 `/editor` 出现。
- **Bento 视觉系统**：用柔和圆角、模块化卡片和紧凑网格承载链接、文字和分栏内容。
- **所见即所得**：编辑器复用主页渲染逻辑，尽量减少编辑视图和最终页面之间的差异。
- **个人友好**：本地草稿、JSON 备份、静态 HTML 导出，适合一个人维护自己的主页。

## 路由设计

```txt
/         静态个人主页，极轻
/editor   React 编辑器，只在编辑时加载 JS
```

| 路由 | 说明 |
| --- | --- |
| `/` | 使用 `defaultPageConfig` 渲染的公开主页。 |
| `/editor` | 使用 `client:only="react"` 加载的可视化编辑器。 |

## 功能特性

- 编辑个人资料、简介、位置和联系方式。
- 添加、删除、选择和编辑 Bento 模块。
- 拖拽移动模块，并调整模块尺寸。
- 调整链接卡片颜色、背景、渐变和图标。
- 导入和导出 JSON 配置。
- 保存浏览器本地草稿。
- 导出独立静态 HTML。
- 公开主页不加载完整编辑器依赖。

## 当前模块

MellowGrid 当前保留三个核心 widget，避免过早堆叠复杂功能：

| Widget | 用途 |
| --- | --- |
| `link` | 社交链接、外部链接、按钮式卡片。 |
| `text` | 文字介绍、备注、短内容卡片。 |
| `divider` | 无边框分栏标题，用于把右侧网格切分成内容区块。 |

## 技术栈

- [Astro](https://astro.build/) - 静态页面与路由。
- [React](https://react.dev/) - 编辑器 island。
- [TypeScript](https://www.typescriptlang.org/) - 类型约束。
- [Tailwind CSS](https://tailwindcss.com/) - 样式工具链。
- [Zustand](https://zustand-demo.pmnd.rs/) - 编辑器状态管理。
- [Vitest](https://vitest.dev/) - 单元测试。

## 快速开始

```bash
npm ci
npm run dev
```

默认开发地址：

- 主页：<http://localhost:4321/>
- 编辑器：<http://localhost:4321/editor>

## 常用脚本

```bash
npm run dev     # 启动 Astro 开发服务器
npm run build   # 构建静态输出
npm run start   # 预览构建产物
npm run lint    # 运行 Astro 类型和诊断检查
npm test        # 运行 Vitest
```

## 项目结构

```txt
src/pages/index.astro          静态主页路由
src/pages/editor.astro         React editor island 路由
src/app/editor/                编辑器 UI、状态和 inspector
src/components/page/           主页和编辑器预览共用渲染组件
src/lib/page-config/           页面配置类型、默认值和规范化逻辑
src/lib/page-export/           静态 HTML 导出逻辑
src/lib/widgets/registry.ts    Widget 注册表
src/widgets/                   Widget 实现
data/pages/username.json       示例导入/导出配置
```

`dist/` 和 `.astro/` 是生成目录，已经加入 `.gitignore`。需要时运行 `npm run build` 重新生成即可。

## 编辑与发布流程

1. 打开 `/editor`。
2. 调整 profile、链接卡片、文字卡片和分栏符。
3. 点击保存，把草稿写入浏览器 `localStorage`。
4. 导出 JSON 作为配置备份，或导出静态 HTML 用于独立发布。

当前版本不包含运行时后端、页面保存 API、文件存储 adapter 或 Docker 部署链路。这个取舍让项目更适合作为个人静态主页工具，而不是长期运行的服务端应用。

## 数据模型

页面配置由 `PageConfig` 描述，核心字段包括：

- `profile`：左侧个人资料区。
- `theme`：背景、文字、卡片、强调色、圆角和阴影。
- `layout`：右侧 Bento 网格位置和尺寸。
- `widgets`：右侧模块实例与 props。
- `updatedAt`：最后更新时间。

相关文件：

- `src/lib/page-config/types.ts`
- `src/lib/page-config/defaults.ts`
- `src/lib/page-config/normalize.ts`

## 路线图

- [ ] 继续提升编辑器和公开主页的所见即所得一致性。
- [ ] 完善主题 token 和更多预设风格。
- [ ] 增加更多适合 Bento 主页的轻量 widget。
- [ ] 优化静态 HTML 导出体验。
- [ ] 补充更多针对布局和配置规范化的测试。

## 维护原则

- 公开主页保持轻量，不加载编辑器专用依赖。
- 新增右侧模块优先走 widget registry。
- Profile 作为独立资料区，不混入右侧 widget 系统。
- 示例数据使用 `Username`、`Location`、example URL 等占位信息。
- 除非出现明确需求，否则不重新引入后端、Docker 或 file-mode 存储层。

## 许可证

本项目基于 [MIT License](LICENSE) 开源。
