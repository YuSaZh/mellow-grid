# MellowGrid

MellowGrid 是一个轻量的 Bento 风格个人主页项目。当前架构已经迁移到 Astro：公开主页保持静态输出，编辑器作为 React island 只在 `/editor` 加载。

<p align="center">
  <a href="README.md">简体中文</a> | <a href="README.en.md">English</a>
</p>

## 路由

- `/`：静态个人主页，直接使用 `defaultPageConfig` 渲染。
- `/editor`：React 可视化编辑器，通过 `client:only="react"` 按需加载。

## 当前架构

- Astro static output 用于公开主页。
- React + Zustand 用于编辑器交互。
- 编辑器草稿保存到浏览器 `localStorage`。
- 编辑器支持导入/导出 JSON，也支持导出独立静态 HTML。
- 当前单人主页工作流不再包含运行时后端、页面保存 API、文件存储 adapter 或 Docker 部署文件。

## 功能

- Bento 风格公开主页。
- 可视化编辑 profile 和右侧模块。
- 添加、删除、选择、编辑模块。
- 右侧网格拖拽移动和缩放。
- JSON 配置导入/导出。
- 静态 HTML 导出。

## 当前 Widget

当前 registry 中保留的模块：

- `link`：社交链接或外部链接卡片。
- `text`：文字内容卡片。
- `divider`：无边框分栏/标题文本。

## 快速开始

```bash
npm ci
npm run dev
```

打开：

- 主页：<http://localhost:4321/>
- 编辑器：<http://localhost:4321/editor>

## 常用脚本

```bash
npm run dev     # 启动 Astro 开发服务器
npm run build   # 构建静态输出
npm run start   # 预览构建产物
npm run lint    # 运行 Astro 检查
npm test        # 运行 Vitest
```

## 项目结构

```txt
src/pages/index.astro          静态主页路由
src/pages/editor.astro         React editor island 路由
src/app/editor/                编辑器 UI、状态和 inspector
src/components/page/           主页和预览共用渲染组件
src/lib/page-config/           页面配置类型、默认值和规范化逻辑
src/lib/page-export/           静态 HTML 导出逻辑
src/lib/widgets/registry.ts    当前 Widget 注册表
src/widgets/                   Widget 实现
data/pages/username.json       示例导入/导出配置
```

`dist/` 和 `.astro/` 是生成目录，已经加入 `.gitignore`，需要时可以通过 `npm run build` 重新生成。

## 编辑流程

1. 访问 `/editor`。
2. 在编辑器中调整 profile 和模块。
3. 保存到浏览器本地草稿。
4. 按需导出 JSON 备份或导出静态 HTML 发布。

示例数据统一使用 `Username`、`Location`、example URL 等占位信息。

## 许可证

本项目基于 [MIT License](LICENSE) 开源。
