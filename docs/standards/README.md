# 第二篇　编码规范索引

这一篇是全仓统一规范正文，不只是“建议”。新增代码和本次修改的代码都按它执行；遇到存量差异直接按规范整改，不留兼容层。

| 章节 | 主题 | 一句话 |
| --- | --- | --- |
| [第2章](01-boundaries-and-naming.md) | 目录、命名、依赖方向 | 只有 `App.vue` 大写，其他文件/目录小驼峰；先选对职责位置 |
| [第3章](02-types-and-api.md) | 类型与接口 | `I...Req/Res`、`...Api`、信封先看 `code` |
| [第4章](03-vue-and-state.md) | Vue / Pinia / 样式 | `defineComponent`，共享状态进领域 store，样式 scoped |
| [第5章](04-auth-and-routing.md) | 登录态与路由 | Token 由统一封装注入，路由守卫不是权限系统 |
| [第6章](05-errors-and-resources.md) | 错误、凭据与资源 | 失败要可见，凭据只用 flash 传一次，监听要释放 |

接口层原始约定见 [src/api/readme.md](../../src/api/readme.md)；它与本章冲突时以本章为准，并同步修正原文。

[返回全书目录](../README.md)
