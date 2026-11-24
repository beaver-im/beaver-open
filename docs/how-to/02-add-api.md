# 第8章　新增一个 API 与配套类型

## 8.1 先确认服务端契约

从服务端路由/处理器确认：HTTP 方法、完整路径、字段名与响应结构。门户接口全部是 `POST`，参数放 `data`。

路径形如：

```text
/beaver-open/api/open/developer/v1/{action}         需登录
/beaver-open/api/open/developer_public/v1/{action}  公开
```

`config.baseAPI` 只提供 origin，不在这里拼业务路径。服务端真相源在 `beaver-server-open` 的 `app/open/open_api`（`.api` 文件 + `internal/types`）。

## 8.2 加类型

在 `src/types/api/<domain>.ts` 按[第3章](../standards/02-types-and-api.md)声明：

```ts
export interface IGetAuditSummaryReq { botId: string }
export interface IGetAuditSummaryRes { total: number; lastAt: string }
```

- 只用真实字段；不为一个接口造通用大对象。
- 后端字段变化直接改类型与所有消费者，不保留旧字段别名。
- 需要提交编排时，`configDetail` 用对象、`externalConfig` 用字符串（服务端如此存储），不要混。

## 8.3 加 API 方法

在 `src/api/<domain>.ts` 仿写同域既有方法，统一 `export function`：

```ts
export function getAuditSummaryApi(data: IGetAuditSummaryReq) {
  return ajax<IGetAuditSummaryRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/bot_audit_summary`,
    data
  })
}
```

示例端点不存在，仅表达写法。方法名必须以精确大小写 `Api` 结尾；不在 API 层导入页面、弹窗或 Pinia。

## 8.4 调用方

- 页面/store 调用 `...Api`，先判断 `code`，`0` 才读 `result`。
- 失败提示 `msg`，并按[第6章](../standards/05-errors-and-resources.md)处理局部状态与资源。
- 若接口返回一次性明文凭据，走对应域的 `credentialFlash`，不要直接放进组件 state 或 Pinia。
- 若接口改变登录态语义，同步检查[第5章](../standards/04-auth-and-routing.md)的封装与守卫行为。

## 8.5 收尾

- `vue-tsc --noEmit -p tsconfig.app.json` 检查类型；必要时 `npm run build_test` 验证打包。
- 更新相关模块页与[目录页](../directory.md)；说明实际验证命令与结果。

[下一章：推送机器人](../modules/bots.md) · [返回目录](README.md)
