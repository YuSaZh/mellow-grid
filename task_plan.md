# 任务计划：MellowGrid editor layout-first 实现

## 目标

将 `/editor` 实现为和公开页同构的可视化编辑器：profile 是 `PageConfig.profile` 独立数据和左侧可编辑区域，不作为 widget 或 grid item；右侧 Bento grid 与公开页共用 CSS Grid 渲染，选中卡片后用局部浮层编辑内容和调整 `x/y/w/h`；添加模块入口作为 grid 内 2x2 占位卡片；公开页不加载编辑器状态或编辑控件。

## 当前阶段

正在收尾可拖拽 CSS Grid editor：editor 与公开页复用同一套 Bento grid 渲染逻辑，编辑器额外支持拖拽排布、右下角网格吸附缩放、自动挤压排版和顶层编辑浮窗。

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
- [x] 验证修改后 preview 立即刷新
- **状态：** complete

### 阶段 5：React Grid Layout 布局编辑

- [x] 只在 editor canvas 中接入 React Grid Layout
- [x] profile 保持在 grid 外部
- [x] 实现点击选中、拖拽、缩放和 layout 更新
- [x] 禁止 editor preview 内部链接跳转造成交互冲突
- **状态：** superseded_by_stage_12

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
- [x] 浏览器验证 `/editor` 加载、选择、编辑、添加、删除、布局调整、保存、导出
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
- **状态：** superseded_by_stage_12

### 阶段 10：editor 排版同构优化

- [x] 对比公开页和 editor 的 8 列布局实现
- [x] profile 改为整块可选中，减少常驻编辑按钮对公开页视觉的干扰
- [x] 卡片改为整卡拖拽，并保留点击选择和右下 resize handle
- [x] 添加模块默认收起，Inspector 仅在选中对象后显示
- [x] editor canvas 使用 `noCompactor` 保持 `x/y/w/h` 与公开页解释一致
- [x] 运行 lint/build 并 HTTP 验证 `/editor`、`/username`
- **状态：** superseded_by_stage_12

### 阶段 11：profile 独立数据与 editor 同构重做

- [x] 更新说明文件，记录 profile 不再作为 widget 的决策
- [x] 将 `PageConfig` 增加独立 `profile` 字段，并迁移默认/示例数据
- [x] 从 widget registry 移除 profile widget
- [x] 公开页从 `config.profile` 渲染左侧资料区
- [x] editor 左侧 profile 改为直接点击编辑和头像上传
- [x] editor 右侧修复为真实 8 列 RGL 排列
- [x] 移除右侧 sidebar，widget 编辑改为卡片局部浮层
- [x] 添加模块改为 grid 内 2x2 占位卡片和悬浮选单
- [x] 运行 lint/build 和本地页面验证
- **状态：** superseded_by_stage_12

### 阶段 12：共享 CSS Grid editor 重构

- [x] 用户确认不再使用 RGL canvas，editor 直接复用公开页 CSS Grid 渲染逻辑
- [x] 抽出共享 Bento grid 渲染组件
- [x] 公开页改用共享 Bento grid 的只读模式
- [x] editor 改用共享 CSS Grid 编辑模式
- [x] 添加模块保留为 grid 内虚拟 2x2 占位卡片
- [x] 移除 editor route 的 RGL CSS 依赖和相关代码
- [x] 新增 8 列碰撞推挤和垂直压实布局算法
- [x] editor 卡片支持拖拽到网格位置并自动挤压其它卡片
- [x] editor 卡片支持右下角拖拽缩放并吸附到网格尺寸
- [x] widget 内容编辑迁移到顶层浮窗
- [x] 运行 lint/build
- [x] HTTP 本地页面验证
- [ ] 人工浏览器视觉验收
- **状态：** complete_pending_manual_visual_check

## 关键问题

1. 当前 widget props 是否足够用通用 inspector 覆盖。
2. 当前 static/file mode 的保存行为是否需要保留现有 API 语义。
3. 当前自定义拖拽/缩放层仍以共享 `x/y/w/h` 协议为唯一布局源，避免再次出现 editor 与公开页双渲染路径漂移。

## 已做决策

- 采用布局编辑优先：用户已确认；能避免 inline 输入、链接、布局调整事件冲突。
- profile 使用 `PageConfig.profile` 独立数据：用户明确要求 profile 不作为 widget；它是左侧独立可编辑资料区。
- widget 内容编辑迁移到顶层浮窗：右侧 sidebar 需要消失，点击卡片后用独立浮窗承载编辑选项，避免挤占卡片内部空间。
- editor 不再使用 React Grid Layout canvas：用户确认 editor 应直接复用公开页 CSS Grid 逻辑，再叠加点击弹窗和布局按钮，避免双渲染路径漂移。
- 不提交 git commit，除非用户明确要求：当前用户只要求执行实现，未要求提交。

## 遇到的错误

- 暂无新增实现错误；最终 lint/build 与 HTTP 验证通过。

## 备注

- 做重大决策前重新读取此计划。
- 每个阶段完成后更新 `progress.md` 和本文件状态。
- 记录所有错误，避免重复失败。
