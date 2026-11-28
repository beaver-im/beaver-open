# 第1章　系统全貌：开放平台门户、布局、路由与数据流

最后核验：2026-11-25（Asia/Shanghai）。这里是**当前事实**，不把设计愿望当实现。

## 1.1 进程与运行时

beaver-open 是 **Vue 3 + TypeScript + Vite 7** 的单页门户，不是 Electron 应用，没有主进程、窗口包或插件运行时。运行时只有浏览器渲染进程：

- [package.json](../package.json) 是脚本与依赖事实源：`dev`、`serve_prod`、`serve_test`、`build_prod`、`build_test`、`lint`、`prepare`、`add-copyright-header`。根没有 `test` 脚本。
- [vite.config.ts](../vite.config.ts) 定义 `@` → `src` 别名、Element Plus 自动导入与组件解析，开发端口 4012；`base: "./"` 便于子目录静态托管。
- [tsconfig.app.json](../tsconfig.app.json) 是类型检查入口，配合 `vue-tsc`。
- [src/App.vue](../src/App.vue) 是唯一大写开头的源文件，由 [src/main.ts](../src/main.ts) 挂载；其余文件/目录按[第2章](standards/01-boundaries-and-naming.md)小驼峰。
- 样式加载顺序固定：`element-plus/dist/index.css` → [designSystem.css](../src/styles/designSystem.css) → [elementOverrides.css](../src/styles/elementOverrides.css) → [global.css](../src/styles/global.css)，顺序不可调换。

## 1.2 一次页面加载经过什么

```text
浏览器 → src/App.vue（el-config-provider + OAuth 回调处理）
       → src/main.ts（Pinia + Router + Element Plus CSS）
       → src/router/index.ts（hash 路由，懒加载 pages/*）
       → src/layouts/index.vue（Sidebar + navigationBar + router-view）
       → src/pages/<domain>/<feature>/index.vue
       → src/api/<domain>.ts → src/utils/request/index.ts → 网关
```

**真实事实**：路由采用 `createWebHashHistory`，所以站内跳转与认证失败都沿用 hash 形式（认证失败跳 `#/login`）。布局外壳固定在 [src/layouts/index.vue](../src/layouts/index.vue)，导航组件是 [navigationBar/index.vue](../src/layouts/components/navigationBar/index.vue)，侧栏是 [sidebar/index.vue](../src/layouts/components/sidebar/index.vue)，菜单数据在 [src/config/menu.ts](../src/config/menu.ts)。
路由里的 `component` 一律用 `@/pages/...` 动态 import。

[App.vue](../src/App.vue) 还承担一个全局职责：OAuth 回调的 `code` / `error` 出现在 `#` 之前的 `search` 里，任意页面都可能收到；它在 `onMounted` 中换取登录态并清理 URL 参数。

## 1.3 路由与页面域

| 路径 | 组件 | 说明 |
| --- | --- | --- |
| `/login`、`/redirect`、`/error/404` | `pages/common/**` | 公开页，`meta.public` 放行 |
| `/dashboard` | `pages/dashboard/index.vue` | 控制台首页，聚合同一开发者名下的机器人/智能体/OAuth 计数 |
| `/oauth`、`/oauth/:oauthId` | `pages/oauth/**` | OAuth 登录应用列表与详情 |
| `/robot/bots`、`/robot/bots/:botId` | `pages/bots/**` | 推送机器人列表与详情 |
| `/robot/digitals`、`/robot/digitals/create`、`/robot/digitals/:digitalId` | `pages/digitals/**` | 智能体列表、草稿态工作台、实体态详情 |
| `/robot/digitals/:digitalId/knowledge/create` | `pages/digitals/knowledgeSource/create.vue` | 创建知识源（先选数据源） |
| `/robot/digitals/:digitalId/knowledge/:knowledgeSourceId` | `pages/digitals/knowledgeSource/index.vue` | 知识源详情（智能体的子实体） |

`meta` 里的 `group` / `module` / `modulePath` / `page` 供侧栏高亮与面包屑使用；新增页面必须补齐，避免三级路径下菜单丢高亮。

## 1.4 数据流的四个职责层

| 层 | 真实位置 | 职责 | 不应做 |
| --- | --- | --- | --- |
| 页面 | `src/pages/<domain>/...` | 表单、列表、交互、局部状态 | 不自己拼鉴权头、不散落 URL |
| API | `src/api/*.ts` | 一个动作一个 `...Api` 方法，声明 `I...Req/Res` 与 URL | 不导入组件、不弹窗、不改 Pinia |
| 请求封装 | `src/utils/request/index.ts` | axios 实例、`Token`/`deviceId` 注入、`code/msg/result` 信封 | 不替业务决定列表合并与重试 |
| 状态 | `src/pinia/**` | 跨组件共享的登录态、布局状态 | 不作为持久化事实源 |

**配置来源**：[src/config/env.ts](../src/config/env.ts) 导出 `config.baseAPI`（只含网关 origin，不含任何路径段）与 `config.env`、OAuth 相关常量。每个接口的完整路径写在 API 文件里，形如：

```text
/beaver-open/api/open/<组>/v1/{action}          需登录，组按服务端 .api 划分：auth / bot / digital / im / asset / oauth
/beaver-open/api/open/login_public/v1/{action}  公开（登录、OAuth 换票）
```

组名没有 `developer`；以 `beaver-server-open` 的 `app/open/open_api/api/*.api` 为唯一真相源，逐 action 核对，不按前缀猜。

## 1.5 后端边界

门户只对接开放平台的**开发者面**，不自行判断“内部/外部”，也不直接访问管理面接口。业务契约在下述位置追踪：

- `src/types/api/*`：各域请求/响应与实体类型；
- `src/api/*`：实际 URL 与 HTTP 方法；
- 服务端 `beaver-server-open`（`app/open/open_api`）：接口与数据的真相源；编排字段的上游是 `beaver-server-ai` 的 Agent 表。

接口字段变化必须同时改类型、API、页面和文档；不因为“前端暂时没用到”保留旧字段映射。

## 1.6 三处非显然机制

这三个机制不是通用框架，改动前先读对应模块页：

1. **凭据 flash**：[bots/credentialFlash.ts](../src/pages/bots/credentialFlash.ts)、[digitals/detail/credentialFlash.ts](../src/pages/digitals/detail/credentialFlash.ts)、[oauth/credentialFlash.ts](../src/pages/oauth/credentialFlash.ts)。创建/重置返回的明文只出现一次，页面跳转会重建组件，因此明文放模块级 `reactive`，由详情页消费后主动清空。
2. **编排工作台单例草稿**：[digitals/detail/workspace.ts](../src/pages/digitals/detail/workspace.ts) 用模块级 `reactive` + `provide/inject` 共享编排配置；`/robot/digitals/create` 是草稿态，保存时先创建实体再 `router.replace` 到真实 ID。
3. **知识源待添加队列**：[knowledgeSource/pending.ts](../src/pages/digitals/knowledgeSource/pending.ts) 让“创建知识源”与“详情内添加文件向导”共用同一套提交逻辑。

[下一章：目录、命名、依赖方向与模块边界](standards/01-boundaries-and-naming.md) · [返回目录](README.md)
