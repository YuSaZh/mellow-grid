# MellowGrid 统一外壳与链接模板设计

## 目标

MellowGrid 未来会包含多种模块类型，例如链接、文本、音乐、底图、图片、统计信息等。无论模块内容如何变化，页面上的卡片都应该保持同一套 2.5D Bento 外壳效果：圆角、描边、高光、阴影、hover/focus 交互和整体视觉密度保持一致。

当前阶段先把“链接类模块”设计成可复用模板。链接类模块包括 Figma、GitHub、X、LinkedIn、Email、Blog、Coffee、自定义链接等。它们不应该各自重写卡片结构，而应该引用同一个链接模板，通过数据自定义 Logo、标题、说明、链接、品牌色、背景色和网格尺寸。

## 背景与参考

Figma Community 项目 `Bento — 2.5D widgets` 的 `Playground widgets` 使用的是组件化思路：先建立统一的 `Playground widget` 卡片组件，再通过实例覆盖替换 Logo、文字、链接状态、颜色和布局。Logo 的 2.5D 效果也不是单个简单阴影，而是一个独立的 `.icon effects` 组件，通过多层 SVG 偏移与模糊叠出厚度。

MellowGrid 不需要完全复制 Figma 文件的内部层级，但应该吸收它的架构原则：

- 外壳结构统一。
- 内容模板复用。
- 单个模块只提供数据与轻量覆盖。
- 视觉效果算法集中维护，避免散落在每个 widget 中。

## 核心设计原则

### 统一的是外壳机制，不是每张卡片必须同色

MellowGrid 目前的卡片背景基本是同一套深色渐变。未来需要像参考 Figma 项目一样，允许不同链接卡片拥有不同背景色或背景渐变。但这不意味着每个模块都可以重写外壳。

应该保持统一的部分：

- 圆角规则。
- 描边规则。
- 1px highlight 规则。
- 2.5D 阴影/浮雕算法。
- hover/focus 交互。
- overflow、可访问性包装和点击区域规则。
- 基础 padding 与 slot 约定。

允许按模块自定义的部分：

- Logo。
- 标题。
- 说明/handle。
- 链接地址。
- 品牌色。
- 卡片背景色或背景渐变。
- 网格宽高。

### 布局尺寸由 layout 决定

尺寸不应该主要放在 widget props 中。页面配置已经有 `layout`：

```ts
type GridLayoutItem = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
};
```

因此链接卡片占几格应该继续由 `layout.w` 和 `layout.h` 决定。模板内部可以根据 `w/h` 推导显示变体：

- `1x1`：compact，小卡片，展示 Logo、标题、短说明。
- `2x1`：wide，横向或更宽松的文本布局。
- `2x2`：large，允许更大的 Logo、更完整的说明或辅助信息。

这样编辑器 resize 卡片时，内容排版能跟随 layout 自动变化，不会出现 `props.size` 和真实网格尺寸冲突的问题。

## 推荐架构

```txt
Page visual system
└─ WidgetShell
   ├─ LinkWidgetTemplate
   │  └─ Link instance data
   ├─ TextWidgetTemplate
   ├─ MusicWidgetTemplate
   └─ ImageWidgetTemplate
```

第一阶段只落地 `WidgetShell` 和 `LinkWidgetTemplate`，但边界要为后续模板预留。

## 组件职责

### `WidgetShell`

`WidgetShell` 是所有 widget 的共享外壳。它不理解某个模块是链接、音乐还是文本，只负责统一的卡片外观、交互和结构插槽。

职责：

- 渲染卡片背景。
- 渲染统一圆角、描边、highlight、阴影。
- 管理 `overflow-hidden`。
- 处理可点击卡片的 anchor 包装。
- 提供 hover/focus 状态。
- 提供可选的右上角 link indicator slot。
- 提供统一 padding 或让模板选择 padding preset。
- 暴露背景配置入口，但不允许调用方重写外壳算法。

建议接口：

```ts
type WidgetBackground =
  | { type: "theme" }
  | { type: "solid"; value: string }
  | { type: "gradient"; from: string; to: string; angle?: number };

type WidgetShellProps = {
  href?: string;
  ariaLabel?: string;
  background?: WidgetBackground;
  accentColor?: string;
  interactive?: boolean;
  showLinkIndicator?: boolean;
  padding?: "none" | "compact" | "normal";
  children: React.ReactNode;
};
```

`WidgetShell` 应该使用 theme 默认背景作为 fallback：

```ts
background ?? theme.cardBackground
```

### `LinkWidgetTemplate`

`LinkWidgetTemplate` 是链接类模块的统一内容模板。它引用 `WidgetShell`，并定义 Logo、标题、说明、链接和品牌色如何展示。

职责：

- 接收链接类数据。
- 将 `href`、`title`、`background` 等传给 `WidgetShell`。
- 渲染 Logo 区域。
- 渲染标题与说明。
- 根据 layout-derived variant 调整排版。
- 不自己实现外壳圆角、描边、阴影。

建议接口：

```ts
type BuiltinLogoKey =
  | "figma"
  | "github"
  | "x"
  | "linkedin"
  | "dribbble"
  | "email"
  | "blog"
  | "coffee"
  | "website";

type LinkLogo =
  | { type: "builtin"; key: BuiltinLogoKey }
  | { type: "uploaded"; url: string; alt?: string };

type LinkWidgetProps = {
  title: string;
  description?: string;
  href: string;
  logo: LinkLogo;
  color?: string;
  background?: WidgetBackground;
};

type LinkWidgetTemplateProps = LinkWidgetProps & {
  variant: "compact" | "wide" | "large";
};
```

### `LinkLogo`

`LinkLogo` 负责解析 Logo 来源。链接模板不应该关心 Logo 是内置 SVG 还是用户上传图片。

职责：

- 如果 `logo.type === "builtin"`，从内置 Logo registry 中读取 SVG 组件。
- 如果 `logo.type === "uploaded"`，渲染上传图片。
- 将 Logo 放入统一的 icon effect 容器。
- 支持品牌色影响 Logo 或 icon 背景。

建议拆分：

```txt
src/components/widgets/link-logo.tsx
src/components/widgets/icon-effect.tsx
src/lib/widgets/logo-registry.ts
```

### `IconEffect`

`IconEffect` 是 MellowGrid 对 Figma `.icon effects` 的代码化抽象。第一版可以先实现简化版本，后续再增强到多层 2.5D 投影。

职责：

- 提供统一的 Logo 容器尺寸。
- 提供内阴影和高光。
- 后续支持多层 SVG/图片偏移阴影。
- 不和某个具体平台绑定。

第一版可以保持当前 `BentoIcon` 的视觉基础，但应改名/抽象为更通用的 `IconEffect`，避免它只适用于文字 initials。

## 数据模型

当前 `WidgetInstance` 已经适合继续使用：

```ts
type WidgetInstance<TProps = Record<string, unknown>> = {
  id: string;
  type: string;
  props: TProps;
};
```

链接类 widget 使用统一的 `link` 类型：

```ts
{
  id: "social-figma",
  type: "link",
  props: {
    title: "Figma",
    description: "@handle or address",
    href: "https://figma.com/",
    logo: { type: "builtin", key: "figma" },
    color: "#A259FF",
    background: {
      type: "gradient",
      from: "#313030",
      to: "#121313"
    }
  }
}
```

上传 Logo 示例：

```ts
{
  id: "custom-portfolio",
  type: "link",
  props: {
    title: "Portfolio",
    description: "Selected work",
    href: "https://example.com",
    logo: {
      type: "uploaded",
      url: "/uploads/logos/portfolio.svg",
      alt: "Portfolio logo"
    },
    color: "#ADE0FF",
    background: {
      type: "solid",
      value: "#1E1E1E"
    }
  }
}
```

## Theme 与背景 fallback

页面主题应该提供默认卡片背景。单个 widget 可以覆盖，但不需要每个 widget 都显式写背景。

建议后续把 `PageTheme` 从简单 `card: string` 演进为更明确的背景配置：

```ts
type PageTheme = {
  background: string;
  foreground: string;
  accent: string;
  radius: "soft" | "round" | "pill";
  shadow: "none" | "soft" | "float";
  cardBackground: WidgetBackground;
};
```

迁移时可以保留兼容：

- 如果存在 `theme.cardBackground`，使用它。
- 否则如果存在旧的 `theme.card`，将其视为 `{ type: "solid", value: theme.card }`。
- 否则使用当前深色渐变默认值。

## Registry 设计

Widget registry 继续负责把 `type` 映射到 widget definition。项目仍处于开发阶段，当前直接使用 `link`，不保留旧链接类型兼容入口。

```txt
src/lib/widgets/registry.ts
├─ link
├─ text
├─ links 或 legacy-links
└─ stats
```

长期推荐：

- `link`：单个链接卡片，适合社交、外链、邮箱、作品集入口。
- `links`：链接列表卡片，如果未来仍需要一张卡里显示多个链接。
- `text`：文本卡片。
- `music`：音乐卡片。
- `image`：底图或图片卡片。

## 编辑器行为

链接类 widget 的编辑器字段应包括：

- 标题。
- 说明/handle。
- URL。
- Logo 来源：内置或上传。
- 内置 Logo 选择器。
- 上传 Logo 文件。
- 品牌色。
- 背景类型：使用主题默认、单色、渐变。
- 背景颜色值。

尺寸编辑继续由布局控制处理，不放入链接表单的主要字段。编辑器 resize 后，预览应根据 `layout.w/h` 自动切换 compact/wide/large 变体。

## 渲染流程

```txt
PageConfig
  ├─ layout item 决定位置和网格尺寸
  └─ widget instance 决定 type 和 props
        ↓
widgetRegistry[type]
        ↓
LinkWidget
        ↓
derive variant from layout.w/layout.h
        ↓
LinkWidgetTemplate
        ↓
WidgetShell + LinkLogo + IconEffect
        ↓
最终卡片
```

当前 `ComponentType<{ props: TProps }>` 无法直接把 layout-derived variant 传给 widget。实现时有两个可选方向：

1. 在 page renderer 里额外传 layout context 给 widget component。
2. 先让模板根据容器 CSS 或简单默认布局适配，后续再扩展 widget component 参数。

推荐方向是第 1 种，因为它让 widget 能明确知道当前 `w/h`，更容易实现 Figma 式尺寸变体。

## 实施边界

第一阶段建议完成：

- 新增 `WidgetShell`，从当前 `BentoCard` 抽象而来。
- 新增 `IconEffect`，从当前 `BentoIcon` 抽象而来。
- 新增 `LinkWidgetTemplate`。
- 新增 `link` widget definition。
- 新增内置 Logo registry 的最小集合。
- 支持上传 Logo 的数据结构与渲染路径。
- 支持 widget-level 背景色/背景渐变配置。

不在第一阶段强制完成：

- 完整复刻 Figma 15 层 Logo 阴影。
- 音乐、图片、底图模块。
- 远程上传存储服务。
- 复杂主题市场或多套外壳系统。

## 测试与验证

实现时应验证：

- 现有默认页面仍能渲染。
- `link` 卡片视觉不破坏。
- 不同背景配置能正确 fallback。
- 内置 Logo 和上传 Logo 都能渲染。
- 空标题、无效 URL、缺失 Logo 时有安全 fallback。
- 编辑器 resize 不会造成 props 与 layout 尺寸冲突。
- TypeScript、lint、生产 build 通过。

## 最终判断

MellowGrid 应采用“统一外壳 + 内容模板 + 实例数据”的结构。链接类模块先作为第一类模板落地：它引用共享 `WidgetShell`，通过 props 自定义 Logo、标题、说明、链接、品牌色和背景，通过 layout 自定义网格尺寸。这样既能保持当前页面统一的 2.5D Bento 质感，又能为未来音乐、文本、底图等模块提供稳定扩展路径。
