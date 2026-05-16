# 发现与决策

## 需求

- `/editor` 采用布局编辑优先模式。
- profile 独立显示在 grid 外，不作为右侧卡片。
- profile 使用 `PageConfig.profile` 独立数据，不作为 widget，不进入 widget registry。
- 右侧 Bento grid 支持选择、拖拽调整位置、右下角拖拽调整大小。
- 拖动到网格位置时，其它卡片需要自动挤压排版。
- 右侧 sidebar 消失，widget 内容编辑迁移到顶层浮窗。
- profile 支持直接点击字段编辑，点击头像上传。
- 支持添加、删除非 profile 模块、保存、导入、导出。
- 公开页 `/:username` 不加载 editor-only 依赖。

## 研究发现

- 已确认设计文档：`docs/superpowers/specs/2026-05-16-editor-layout-first-design.md`。
- 当前依赖已包含 `zustand`，并且历史上引入过 `react-grid-layout`、`react-resizable`。
- 当前 `PageConfig` 使用 `profile` 保存左侧资料，用 `widgets` 保存右侧内容，用 `layout` 保存 Bento grid 位置和尺寸。
- Next.js 文档确认：`"use client"` 只需要放在 client entry 边界；被 client 文件导入的子组件会进入 client bundle。
- Next.js CSS 文档确认：全局 CSS 可在 route layout 中导入，但共享 CSS Grid 重构后 editor 不再需要 RGL CSS。
- React Grid Layout v2 可用于拖拽/缩放，但本轮已废弃 editor RGL canvas 路线，避免与公开页 CSS Grid 形成双渲染路径。

## 技术决策

| 决策 | 理由 |
| ---- | ---- |
| 使用 Zustand 管理 editor 状态 | 多组件共享 config、selection、status 和 mutation，避免 prop drilling。 |
| profile 使用 `PageConfig.profile` 独立数据 | 用户明确要求 profile 不作为 widget；公开页和 editor 都从独立资料字段渲染左侧区域。 |
| widget 内容编辑使用顶层浮窗 | 用户要求点击卡片后编辑不在卡片内部，而是弹出新的顶层浮窗显示编辑选项。 |
| 保留公开渲染组件边界 | 公开页应轻量，不导入 editor store 或编辑器 UI。 |
| 右侧 Bento grid 改为 8 列 | 用户确认 8 列更贴近参考图；1x1 社交、2x2 默认、2x4/4x2/4x4 展示更多信息。 |
| `x/y/w/h` 成为公开页和 editor 的唯一布局协议 | 修复公开页忽略 x/y、editor 与公开页尺寸不一致的问题。 |
| editor 复用公开页 CSS Grid 渲染 | 避免 RGL canvas 与 `/username` 形成双渲染路径；拖拽/缩放只更新共享 `x/y/w/h`。 |
| 自定义拖拽和缩放层 | 在共享 CSS Grid 上叠加 pointer 交互，拖拽和右下角缩放都吸附到底层 8 列网格。 |
| 布局写入前统一排版 | 添加、拖拽、缩放和 store update 都走碰撞推挤与垂直压实算法，减少重叠和空洞。 |

## 遇到的问题

| 问题 | 解决方案 |
| ---- | -------- |
| 127.0.0.1 打开 dev server 时 Next.js 16 拦截 HMR WebSocket，导致开发态交互异常 | 在 `next.config.ts` 添加 `allowedDevOrigins: ["127.0.0.1"]` 并重启 dev server。 |
| 默认 layout 仍包含 profile 且 grid widget 从 x=4 开始，导致 profile 独立后右侧初始留空 | 从默认和示例 layout 移除 profile item，并让右侧 widget 从 x=0 开始。 |
| editor 三栏后台式布局与参考图不符 | editor 主体改为公开页同构的左 profile + 右 Bento grid，顶栏保留，Inspector/添加模块改成局部浮层。 |
| static mode 保存后刷新 `/username` 看不到修改 | static mode 只保存 localStorage 草稿；本地 development 默认改为 file mode，让保存通过 API 写入 `data/pages/username.json`。 |
| editor 仍显得像后台面板且卡片操作控件打断 Bento 视觉 | profile 改为直接内联编辑，卡片操作只在选中对象后显示，添加模块默认收起。 |
| React Grid Layout 默认 vertical compactor 会在拖拽/初始化时压缩布局 | 已废弃 editor RGL 路线，避免 editor 和公开页出现不同布局解释。 |
| profile 作为 widget 会混淆左侧资料区和右侧 Bento 模块 | 将 profile 迁移为 `PageConfig.profile`，storage normalize 兼容旧 JSON 中的 profile widget，并从 widget registry 移除 profile。 |
| 右下添加按钮与主页同构目标冲突 | 添加模块改为 grid 内虚拟 2x2 占位卡片，点击后打开局部悬浮选单，虚拟 id 不写入配置。 |
| RGL canvas 与 `/username` 形成双渲染路径，导致 editor 视觉和公开页不同步 | 用户确认移除 RGL canvas，editor 直接复用公开页 CSS Grid 映射 `x/y/w/h`，拖拽和缩放也只更新这一套布局协议。 |
| 卡片内部编辑浮层挤占卡片空间 | 改为顶层 fixed modal，卡片 overlay 只负责选择、拖拽和右下角 resize handle。 |
| 选中卡片浮层内输入时空格/回车可能被外层 selection handler 拦截 | 迁移到顶层浮窗后，卡片 overlay 不再包裹输入控件。 |
| BentoCard hover 位移会让 editor overlay 与卡片视觉错位 | 移除 hover translate，只保留 shadow 反馈。 |

## 资源

- `docs/superpowers/specs/2026-05-16-editor-layout-first-design.md`
- `docs/superpowers/specs/2026-05-16-eight-column-bento-layout-design.md`
- `PROJECT_PLAN.md`
- `AGENTS.md`

## 视觉/浏览器发现

- 已发现旧 editor 是三栏后台式布局，不符合参考图；已改为页面同构布局，去掉中央 Canvas 外框。
- 已发现 RGL canvas 会让 editor 与 `/username` 形成双渲染路径；已改为共享 CSS Grid 渲染，editor 叠加自定义拖拽、右下角缩放、自动挤压排版和顶层编辑浮窗。
- 本轮完成 lint/build 与 HTTP 验证，尚未进行人工浏览器视觉验收。

---

_每执行 2 次查看/浏览器/搜索操作后更新此文件。_
_防止视觉信息丢失。_
