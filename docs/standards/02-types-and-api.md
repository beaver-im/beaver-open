# 第3章　TypeScript 类型、接口请求与数据契约

## 3.1 四条接口命名铁律

来自接口层既有约定（[src/api/readme.md](../../src/api/readme.md)），现在以本章为统一正文：

1. 所有接口类型以 `I` 开头。
2. 请求对象以 `Req` 结尾：`I<Action>Req`。
3. 响应对象以 `Res` 结尾：`I<Action>Res`。
4. 对外请求方法以精确大小写 `Api` 结尾：`getDigitalConfigApi`，不是 `getConfigAPI` / `get_digital_config`。

仿写既有文件，不自由发明第二套模板。请求/响应类型放在 `src/types/api/` 对应域文件，API 方法放在 `src/api/` 对应域文件，统一用 `export function`。

## 3.2 真实请求封装

[src/utils/request/index.ts](../../src/utils/request/index.ts) 创建 axios 实例，并：

- 请求拦截器注入 `Token`（来自 `localStorage.token`）与 `deviceId`（来自 `localStorage.deviceId`）；
- 响应返回 `{ code, msg, result }` 信封；
- `code !== 0` 且 URL 包含 `authentication` 时清理本地登录态并跳 `#/login`（hash 路由，不能直接写 `/login`）；
- 网络异常以 rejected Promise 抛出，不伪装成功响应。

**约束**：API 层只声明 `ajax<I...Res>({ method, url, params/data })`；调用方必须先看 `code`，失败分支不能假定 `result` 存在。未知输入先校验再收窄，不用 `as unknown as` 让不兼容契约“看起来能编译”。

**写法示例（不是已有端点）**：

```ts
export interface IGetSummaryReq { digitalId: string }
export interface IGetSummaryRes { title: string; itemCount: number }

export function getSummaryApi(params: IGetSummaryReq) {
  return ajax<IGetSummaryRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/digital_summary`,
    data: params
  })
}
```

`config.baseAPI` 只含网关 origin；完整业务路径写在每个 API 的 `url` 中，来源见 [src/config/env.ts](../../src/config/env.ts)。门户接口全部是 `POST`，查询条件也走 `data`。

## 3.3 编排与外部配置的契约

数字伙伴的编排不是一堆扁平字段，而是两块 JSON：

| 字段 | 形状 | 说明 |
| --- | --- | --- |
| `configDetail` | `{ type, prompt?, workflow? }` | `type: 1` 提示词、`2` 工作流；内部键一律 snake_case |
| `externalConfig` | JSON 字符串 | 长连接接入的渠道参数（如 `callbackUrl`），与“大脑”配置分开存 |

- 提示词块的真实键是 `system`、`opening_message`、`opening_questions`、`variables`；变量行的键是 `name`、`label`、`type`、`default`、`required`、`options`，类型取值 `text | textarea | select`。
- 前端表单用驼峰（`openingMessage`），**提交前必须显式转成 snake_case**；不要直接 `JSON.stringify` 表单对象。
- `knowledgeIds` 由后端按知识源表派生，只读回显，不随编排提交。
- 编排要**整份提交**：服务端按 `runtime` 只认一列，分区各自保存时若只带局部字段会互相覆盖（见[第10章](../modules/digitals.md)）。

## 3.4 类型跟着边界走

- 网络响应、JSON 解析、`localStorage` 读取都属于外部输入：先当未知值，校验后使用。`externalConfig` 是字符串，读取时必须 `JSON.parse` 并包在 `try/catch` 里。
- UI 表单模型、后端实体、请求/响应各自建模；不把后端对象直接当组件可写状态。
- 导出的边界函数写明参数与返回类型；局部 `any` 只允许在明确边界并注明来源，不外溢到业务层。
- 接口字段变更必须同步：类型 → API → 页面 → 相关文档。不为旧字段保留映射层或空占位字段。

## 3.5 评审检查

- `I...Req/Res` 与 `...Api` 是否齐全，是否仿写同域既有文件？
- 失败分支是否访问了可能不存在的 `result`？未知输入是否校验？
- 契约变化是否同步到所有调用方；是否残留旧字段兼容代码？
- 编排字段是否前后端同构（snake_case 落库、驼峰仅在表单层）？

[下一章：Vue 组件、Pinia 状态、样式和资源](03-vue-and-state.md) · [返回目录](../README.md)
