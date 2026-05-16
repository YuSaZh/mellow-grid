# 发现与决策

## 需求
- `/editor` 采用布局编辑优先模式。
- profile 独立显示在 grid 外，不作为右侧卡片。
- 右侧 Bento grid 支持选择、拖拽、调整大小。
- 所有内容编辑通过 Inspector 完成，不做卡片内 inline 编辑。
- 支持添加、删除非 profile 模块、保存、导入、导出。
- 公开页 `/:username` 不加载 editor-only 依赖。

## 研究发现
- 已确认设计文档：`docs/superpowers/specs/2026-05-16-editor-layout-first-design.md`。
- 当前依赖已包含 `zustand`、`react-grid-layout`、`react-resizable`。
- 当前 `PageConfig` 使用 `widgets` 保存内容，用 `layout` 保存 Bento grid 位置和尺寸。
- 当前 editor 是单文件混合实现，profile inline input、卡片编辑、添加菜单、保存逻辑都耦合在 `editor-client.tsx` 中，需要拆分。
- Next.js 文档确认：`"use client"` 只需要放在 client entry 边界；被 client 文件导入的子组件会进入 client bundle。
- Next.js CSS 文档确认：全局 CSS 可在 layout 中导入；当前 RGL CSS 放在 `src/app/editor/layout.tsx`，能限制在 editor route。
- React Grid Layout v2 导出 `ReactGridLayout`、`GridLayout`、`Layout`、`LayoutItem` 等类型，支持 `onDragStop`、`onResizeStop` 和 `useContainerWidth`。

## 技术决策
| 决策 | 理由 |
|------|------|
| 使用 Zustand 管理 editor 状态 | 多组件共享 config、selection、status 和 mutation，避免 prop drilling。 |
| 使用 Inspector 编辑内容 | 避免卡片内部链接、input、drag、resize 事件互相抢占。 |
| 保留公开渲染组件边界 | 公开页应轻量，不导入 React Grid Layout 或 editor store。 |
| profile 作为 widget 数据但在 grid 外渲染 | 符合数据模型，也符合用户布局要求。 |
| 右侧 Bento grid 改为 8 列 | 用户确认 8 列更贴近参考图；1x1 社交、2x2 默认、2x4/4x2/4x4 展示更多信息。 |
| `x/y/w/h` 成为公开页和 editor 的唯一布局协议 | 修复公开页忽略 x/y、editor 与公开页尺寸不一致的问题。 |

## 遇到的问题
| 问题 | 解决方案 |
|------|---------|
| 127.0.0.1 打开 dev server 时 Next.js 16 拦截 HMR WebSocket，导致开发态交互异常 | 在 `next.config.ts` 添加 `allowedDevOrigins: ["127.0.0.1"]` 并重启 dev server。 |
| 默认 layout 仍包含 profile 且 grid widget 从 x=4 开始，导致 profile 独立后右侧 canvas 初始留空 | 从默认和示例 layout 移除 profile item，并让右侧 widget 从 x=0 开始；canvas 也兼容旧 layout 做 x 归一化。 |
| editor 三栏后台式布局与参考图不符 | editor 主体改为公开页同构的左 profile + 右 Bento grid，顶栏保留，Inspector/添加模块改成右下浮动面板。 |
| static mode 保存后刷新 `/username` 看不到修改 | static mode 只保存 localStorage 草稿；本地 development 默认改为 file mode，让保存通过 API 写入 `data/pages/username.json`。 |

## 资源
- `docs/superpowers/specs/2026-05-16-editor-layout-first-design.md`
- `PROJECT_PLAN.md`
- `AGENTS.md`

## 视觉/浏览器发现
- 已发现旧 editor 是三栏后台式布局，不符合参考图；已改为页面同构布局，去掉中央 Canvas 外框。
- 本轮完成 HTTP 验证，尚未进行人工浏览器视觉验收。

---
*每执行2次查看/浏览器/搜索操作后更新此文件*
*防止视觉信息丢失*
