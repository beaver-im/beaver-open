# 工程目录速查

找文件、判断能否改、确认副作用。这里只记录事实位置，规范见[第二篇](standards/README.md)。最后核验：2026-11-25。

## 顶层

| 路径 | 作用 | 改动注意 |
| --- | --- | --- |
| `src/` | 全部前端源码 | 命名规则见[第2章](standards/01-boundaries-and-naming.md) |
| `docs/` | 本工程手册 | 改入口/契约/命令时同次更新 |
| `scripts/add-copyright-header.mjs` | 版权头脚本 | 由 `npm run add-copyright-header` 调用，会批量改文件 |
| `scripts/check-knowledge.mjs` | 文档/命名检查 | 对应[知识清单](knowledge-checks.json) |
| `types/auto/` | Vite 自动生成的类型声明 | 自动生成，不手改 |
| `.env.dev` / `.env.test` / `.env.prod` | 各模式环境变量（`VITE_API_BASE`、OAuth 三项） | 不读取/记录真实令牌 |
| `VERSION` | 版本号 | 与 `package.json` 同步 |

## src 分区

| 路径 | 作用 | 常见改动 |
| --- | --- | --- |
| `src/App.vue` | 根组件，唯一大写例外；同时处理 OAuth 回调 | 回调逻辑变化时同步 `pages/common/redirect` |
| `src/main.ts` | 应用入口与样式加载顺序 | Pinia、Router、四份 CSS 的先后不可调换 |
| `src/api/` | HTTP 方法，一域一文件 | 增加 `...Api`，类型放 `src/types/api/` |
| `src/assets/icons/` | 界面 SVG 图标 | 文件名小驼峰，如 `brandMark.svg` |
| `src/config/` | `env.ts`（origin 与 OAuth 常量）、`menu.ts`（侧栏分组） | `baseAPI` 只含 origin |
| `src/layouts/` | 布局外壳与 `components/` | `sidebar/`、`navigationBar/` |
| `src/pages/bots/` | 推送机器人列表、详情、两个页签 | 见[第9章](modules/bots.md) |
| `src/pages/digitals/` | 智能体列表、详情、编排、工具、知识源入口 | 见[第10章](modules/digitals.md) |
| `src/pages/digitals/knowledgeSource/` | 知识源创建与详情 | 见[第11章](modules/knowledgeSource.md) |
| `src/pages/oauth/` | OAuth 应用列表、详情、三个页签 | 见[第12章](modules/oauth-and-console.md) |
| `src/pages/dashboard/` | 控制台首页，聚合三份列表 | 新增板块时同步 `menu.ts` |
| `src/pages/common/` | 登录、OAuth 中转、`notFound.vue` | 公共页保持无业务依赖 |
| `src/pinia/` | `user`（登录态）、`app`（侧栏/设备/标题） | `use<Domain>Store` |
| `src/router/index.ts` | hash 路由、守卫、标题 | 新页面挂到域路由树，`create` 排在 `:id` 前 |
| `src/styles/` | `designSystem.css`（令牌）、`elementOverrides.css`、`global.css` | 令牌只在本文件定义 |
| `src/types/api/` | 请求/响应与实体类型 | `I...Req/Res` |
| `src/types/components/`、`src/types/utils/` | 组件与工具本地类型 | 不把领域契约塞这里 |
| `src/utils/request/index.ts` | axios 封装、Token/deviceId 注入、信封 | 鉴权头、认证失败跳转在这里 |
| `src/utils/` 其余子目录 | `qiniu`、`storage`、`tools`、`validation` | 复用既有，不造平行实现 |

## 域内特殊文件

| 文件 | 作用 |
| --- | --- |
| `pages/bots/credentialFlash.ts` | 机器人创建/重置的一次性明文 |
| `pages/digitals/detail/credentialFlash.ts` | 智能体 secret 一次性明文 |
| `pages/digitals/detail/workspace.ts` | 编排配置单例 + `provide/inject` 契约 |
| `pages/digitals/detail/constants.ts` | 编排模式文案 |
| `pages/digitals/knowledgeSource/pending.ts` | 知识源待添加队列与统一提交 |
| `pages/digitals/components/` | 跨页复用的 `formCard` / `tabNav` / `idTagsEditor` / `memberPickerDialog` / `cardVisual` |
| `pages/oauth/credentialFlash.ts` | OAuth secret 一次性明文 |

## 改名后的关键路径

| 旧名（已废弃） | 当前路径 |
| --- | --- |
| `src/layouts/components/navigation-bar/` | `src/layouts/components/navigationBar/` |
| `src/pages/digitals/knowledge-source/` | `src/pages/digitals/knowledgeSource/` |
| `src/pages/digitals/detail/tabs/knowledge-source/` | `src/pages/digitals/detail/tabs/knowledgeSource/` |
| `src/pages/common/error/404.vue` | `src/pages/common/error/notFound.vue` |
| `src/api/README.md` | `src/api/readme.md` |
| `src/styles/design-system.css` | `src/styles/designSystem.css` |
| `src/styles/element-overrides.css` | `src/styles/elementOverrides.css` |
| `src/assets/icons/brand-mark.svg` | `src/assets/icons/brandMark.svg` |
| `src/assets/icons/arrow-left.svg` | `src/assets/icons/arrowLeft.svg` |
| `src/assets/icons/library-type-*.svg` | `src/assets/icons/libraryType*.svg` |
| `src/assets/icons/segment-spark*.svg` | `src/assets/icons/segmentSpark*.svg` |
| `src/assets/icons/segment-sliders.svg` | `src/assets/icons/segmentSliders.svg` |

旧路径只作历史索引，不存在兼容文件；所有 `import` 与文档链接都指向当前路径。

[返回全书目录](README.md)
