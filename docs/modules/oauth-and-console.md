# 第12章　OAuth 登录、控制台与公共页

最后核验：2026-11-25。这一章覆盖“进门”和“门面”：OAuth 应用管理、控制台首页、登录/回调/404，以及全局布局。

## 12.1 登录链路（没有账号密码表单）

门户本身不提供注册登录表单，**登录=跳转 OAuth 授权页**：

1. [pages/common/login/index.vue](../../src/pages/common/login/index.vue) 拼 `${config.oauthBaseUrl}/auth?oauthId=&redirectUri=` 并跳转；`oauthId` 与 `redirectUri` 来自 `.env.*` 的 `VITE_OPEN_OAUTH_ID` / `VITE_OAUTH_REDIRECT_URI`。
2. 授权完成后浏览器回到 `redirectUri`，`code` 出现在 `#` 之前的 query 中。
3. [src/App.vue](../../src/App.vue) 在 `onMounted` 统一处理：有 `error` 提示并回登录页，有 `code` 调 `userStore.oauthLogin({ code })`，成功进 `/dashboard`，随后清理 URL 参数。
4. [pages/common/redirect/index.vue](../../src/pages/common/redirect/index.vue) 是兼容授权服务回跳到 `/redirect` 的中转页，逻辑与 App.vue 一致。

**约束**：`oauthSecret` 不下发前端，也不能出现在 URL；换票只在前端拿 `code` 调 `auth_oauth_login`。新增登录相关页面时不要在页面里再写一套回调解析——回调解析只有 App.vue 与 redirect 两处，且必须清理 query。

## 12.2 OAuth 应用管理

| 位置 | 职责 |
| --- | --- |
| [pages/oauth/list/index.vue](../../src/pages/oauth/list/index.vue) | 应用列表、创建、跳详情 |
| [pages/oauth/detail/index.vue](../../src/pages/oauth/detail/index.vue) | 详情壳与页签 |
| [detail/tabs/settingsTab.vue](../../src/pages/oauth/detail/tabs/settingsTab.vue) | 基本信息、图标、删除 |
| [detail/tabs/developerTab.vue](../../src/pages/oauth/detail/tabs/developerTab.vue) | `oauthId` / `oauthSecret` 展示与重置 |
| [detail/tabs/platformsTab.vue](../../src/pages/oauth/detail/tabs/platformsTab.vue) | 接入端配置：H5 / 桌面端 / 移动端 |
| [pages/oauth/credentialFlash.ts](../../src/pages/oauth/credentialFlash.ts) | secret 一次性明文 |

接口在 [api/oauth.ts](../../src/api/oauth.ts)：`app_list`、`app_create`、`app_detail`、`app_update`、`app_delete`、`oauth_reset_secret`、`oauth_config_get`、`oauth_config_update`。

- 接入端配置类型是 `IH5OAuthConfig` / `IDesktopOAuthConfig` / `IMobileOAuthConfig`；三类结构不同，不要强行合并成一个对象。
- 重置 secret 后旧值立即失效，必须二次确认，并把新值走 `setOAuthCredentialFlash` 交给开发者选项展示。

## 12.3 控制台首页

[pages/dashboard/index.vue](../../src/pages/dashboard/index.vue) 聚合三份列表：`getOAuthAppListApi`、`listBotsApi`、`listDigitalsApi`，用卡片展示数量与最近条目。

- 三份请求互相独立：一份失败只影响对应卡片（`failed` 标记），不能整页空白。
- 卡片跳转目标与 [src/config/menu.ts](../../src/config/menu.ts) 的模块路径保持一致。
- 新增能力板块时同时改三处：路由、`menuGroups`、控制台卡片。

## 12.4 布局、菜单与公共页

- 布局外壳 [src/layouts/index.vue](../../src/layouts/index.vue)：侧栏 + 顶栏 + 唯一滚动容器 `.app-main`；窄屏时侧栏变抽屉。
- 导航组件 [navigationBar/index.vue](../../src/layouts/components/navigationBar/index.vue) 负责面包屑与用户区；侧栏 [sidebar/index.vue](../../src/layouts/components/sidebar/index.vue) 按 `menuGroups` 渲染。
- 菜单/分组定义在 [src/config/menu.ts](../../src/config/menu.ts)：一级是业务板块，二级是模块，路径层级必须与路由一致。
- 公共页：登录、`redirect`、以及 [pages/common/error/notFound.vue](../../src/pages/common/error/notFound.vue)（路由 `/error/404`，catch-all 也指向它）。
- 页面标题的唯一常规写入点是路由 `afterEach`；详情页拿到真实名称后写 `meta.entityName` 并再写一次 `document.title`。

[下一章：开发闭环与验证](../workflow.md) · [返回目录](../README.md)
