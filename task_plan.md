# 任务计划：MellowGrid editor layout-first 实现

## 目标
将 `/editor` 实现为布局编辑优先的可视化编辑器：profile 独立展示并通过 Inspector 编辑，右侧 Bento grid 使用 React Grid Layout 拖拽/缩放，所有内容编辑通过 Inspector 完成，并保持公开页不加载编辑器依赖。

## 当前阶段
8 列 Bento 布局复现已完成，准备提交并推送

## 各阶段

### 阶段 1：恢复上下文与准备
- [x] 阅读已确认设计文档 `docs/superpowers/specs/2026-05-16-editor-layout-first-design.md`
- [x] 确认用户选择布局编辑优先方案
- [x] 创建规划文件 `task_plan.md`、`findings.md`、`progress.md`
- [x] 阅读当前 editor、renderer、widget、storage 相关实现
- [x] 阅读 Next.js 本地相关文档
- **状态：** complete

### 阶段 2：文件级实施计划
- [x] 确定需要新增、重写、保留、删除的文件
- [x] 明确每个组件的数据输入和职责边界
- [x] 记录关键技术决策到 `findings.md`
- **状态：** complete

### 阶段 3：状态层与编辑器骨架
- [x] 创建 editor store，集中管理 config、selection、status 和 mutation
- [x] 重写 `editor-client.tsx` 为 store provider / shell 入口
- [x] 创建 editor layout、toolbar、sidebar、canvas 基础组件
- [x] 保持公开页组件不导入 editor 专用代码
- **状态：** complete

### 阶段 4：Inspector 内容编辑闭环
- [x] 实现 profile inspector：姓名、位置、简介、头像、联系方式
- [x] 实现 widget inspector：字符串、textarea、link-list 基础编辑
- [x] 实现添加模块和删除非 profile 模块
- [ ] 验证修改后 preview 立即刷新
- **状态：** complete_pending_browser_validation

### 阶段 5：React Grid Layout 布局编辑
- [x] 只在 editor canvas 中接入 React Grid Layout
- [x] profile 保持在 grid 外部
- [x] 实现点击选中、拖拽、缩放和 layout 更新
- [x] 禁止 editor preview 内部链接跳转造成交互冲突
- **状态：** complete

### 阶段 6：保存、导入、导出、预览
- [x] static mode 保存到 localStorage
- [x] file mode POST 到 `/api/pages/:username`
- [x] 实现 JSON 导入导出
- [x] 实现预览链接和 toolbar 状态反馈
- **状态：** complete

### 阶段 7：自动化验证
- [x] 运行 `npm run lint`
- [x] 运行 `npm run build`
- [x] 修复发现的问题并记录错误
- **状态：** complete

### 阶段 8：浏览器验证
- [x] 启动 3001 端口开发服务
- [x] 浏览器验证 `/editor` 加载、选择、编辑、添加、删除、拖拽、缩放、保存、导出
- [x] 浏览器验证 `/:username` 公开页仍可渲染
- [x] 停止测试服务
- **状态：** complete

### 阶段 9：8 列 Bento 布局复现
- [x] 写入设计规格 `docs/superpowers/specs/2026-05-16-eight-column-bento-layout-design.md`
- [x] 创建共享 8 列 Bento 布局 token
- [x] 将默认数据与示例数据改为 8 列布局
- [x] 公开页完整解释 `x/y/w/h`
- [x] editor RGL 改为同一套 8 列标尺
- [x] 改善 drag/resize 可见性和可用性
- [x] 运行 lint/build 并浏览器验证
- **状态：** complete

## 关键问题
1. React Grid Layout 与 React 19 / Next.js 16 是否需要动态导入或 CSS 特殊处理。
2. 当前 widget props 是否足够用通用 inspector 覆盖。
3. 当前 static/file mode 的保存行为是否需要保留现有 API 语义。

## 已做决策
| 决策 | 理由 |
|------|------|
| 采用布局编辑优先 | 用户已确认；能避免 inline 输入、链接、拖拽、resize 事件冲突。 |
| 内容统一通过 Inspector 编辑 | 卡片和 profile 只负责预览和选择，降低交互冲突。 |
| profile 不进入 React Grid Layout | 用户要求 profile 独立，不在卡片内。 |
| React Grid Layout 只用于 editor canvas | 公开页不能加载编辑器依赖。 |
| 不提交 git commit，除非用户明确要求 | 当前用户只要求执行实现，未要求提交。 |

## 遇到的错误
| 错误 | 尝试次数 | 解决方案 |
|------|---------|---------|
| 无 | 0 | - |

## 备注
- 做重大决策前重新读取此计划。
- 每个阶段完成后更新 `progress.md` 和本文件状态。
- 记录所有错误，避免重复失败。
