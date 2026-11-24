# 第5章　登录态、Token 注入与路由边界

## 5.1 当前事实

- 登录接口在 [src/api/auth.ts](../../src/api/auth.ts)：`auth_login`（手机号/密码或验证码，见 `ILoginReq`）与 `auth_oauth_login`（用 OAuth 回调 `code` 换票），路径同属 `/beaver-open/api/open/developer_public/v1/`。
- 登录成功后 [useUserStore](../../src/pinia/user/user.ts) 把 `token`、`userId`、`nickName` 写入 `localStorage`，并保存在 store state 中；`isLoggedIn` 只判断 token 是否存在。
- [src/utils/request/index.ts](../../src/utils/request/index.ts) 每次请求注入 `Token` 与 `deviceId` 头；`deviceId` 也来自 `localStorage`。
- 响应信封 `code !== 0` 且 URL 含 `authentication` 时，请求封装清理本地登录态并跳 `#/login`。
- [src/router/index.ts](../../src/router/index.ts) 使用 hash 路由，`beforeEach` 中 `meta.public` 放行，其余未登录一律跳 `/login`。
- OAuth 回调 `code` 可能出现在任意页面的 `#` 前 query 中，由 [App.vue](../../src/App.vue) 在挂载时统一处理并清理 URL。

**边界**：前端守卫只控制页面可达性，不是权限校验；真实身份、资源归属与写权限由服务端基于 Token 判定。不要在页面里自行信任路由参数中的 `digitalId` / `oauthId`，也不要用“列表里没看到”当成无权访问的证据。

## 5.2 统一约束

- 新增页面必须挂到 `src/router/index.ts` 的对应域路由树下；`component` 用 `@/pages/...` 动态 import，并指向改名后的真实文件。
- 登录态只在 `useUserStore` 与请求封装中读写 `localStorage`；页面只读 `isLoggedIn` / `displayName` 等 getter，不自行清理 token。
- API 文件不拼 `Token` 头；请求封装统一注入。新接口如果需要额外头，先确认服务端契约，再在封装层集中处理。
- 登出/认证失败必须同时清理本地登录态与 store 状态，并跳转 `/login`；不留半登录状态。
- `_public` 类端点（`developer_public` 组）由服务端公开，前端仍通过统一封装调用，不为其单独造请求通道。
- 令牌、AppSecret、webhook token 不得进入路由 query、`document.title`、错误提示或日志。

## 5.3 评审检查

- 新增路由是否在守卫覆盖范围内；动态 import 路径是否存在且为小驼峰？
- 页面是否绕过统一请求封装自行设置鉴权头？
- 认证失败时本地状态、路由跳转是否一致？
- 是否把前端只读守卫误当成权限系统？
- 回调类参数（`code`、`error`）处理完是否清理了 URL？

[下一章：错误处理、日志与凭据生命周期](05-errors-and-resources.md) · [返回目录](../README.md)
