# 接口层命名约定

1. 所有接口类型以 `I` 开头。
2. 请求参数以 `Req` 结尾：`I<Action>Req`。
3. 响应数据以 `Res` 结尾：`I<Action>Res`。
4. 对外请求方法以精确大小写 `Api` 结尾：`getDigitalConfigApi`。
5. 仿写同域既有文件，不要自由发挥——类型放 `src/types/api/`，方法放 `src/api/`。

约定正文与示例见[第3章：TypeScript 类型、接口请求与数据契约](../../docs/standards/02-types-and-api.md)。
新增接口的完整步骤见[第8章：新增一个 API 与配套类型](../../docs/how-to/02-add-api.md)。
