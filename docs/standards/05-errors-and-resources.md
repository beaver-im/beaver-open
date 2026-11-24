# 第6章　错误处理、日志与凭据生命周期

## 6.1 错误不被吞掉

**当前事实**：请求封装在 `code !== 0` 时不会自动弹窗，而是把响应原样交给调用方；网络异常以 rejected Promise 抛出。认证失败是封装层唯一直接跳登录的分支（见[第5章](04-auth-and-routing.md)）。页面普遍用 `ElMessage` 提示，并在 `catch` 中回填失败态。

**统一约束**：

- API 调用方先判断 `code`，成功再用 `result`；失败用 `msg` 或统一文案，不能把失败渲染成空成功列表。
- `catch` 必须明确处理边界：提示用户、回滚局部状态、记录必要上下文之一；禁止空 `catch` 伪装成功。
- 外部输入（网络响应、`externalConfig` JSON、`localStorage`、文件、URL 参数）先校验格式；校验失败给出可定位信息，不把原始异常直接暴露给用户。
- 日志不记录 Token、AppSecret、webhook token、密码、真实用户隐私或完整请求体；需要排障时记录操作标识与错误类别。
- 空态、加载态、失败态必须可区分：列表接口失败时不能显示“暂无数据”。

## 6.2 凭据只活一次：flash 生命周期

创建 / 重置返回的明文凭据（机器人 token+secret、智能体 digitalSecret、OAuth secret）服务端只存哈希，事后无法重建。三个域各有一个 `credentialFlash.ts`：

| 模块 | 暂存字段 | 消费方 |
| --- | --- | --- |
| [bots/credentialFlash.ts](../../src/pages/bots/credentialFlash.ts) | `webhookUrl`、`token`、`secret` | 机器人详情「开发者选项」 |
| [digitals/detail/credentialFlash.ts](../../src/pages/digitals/detail/credentialFlash.ts) | `digitalKey`、`digitalSecret`、`reason` | 智能体详情「对外」分区 |
| [oauth/credentialFlash.ts](../../src/pages/oauth/credentialFlash.ts) | `oauthSecret` | OAuth 详情「开发者选项」 |

**必须遵守**：

- 明文只在模块级 `reactive` 中短暂存在；用户确认保存后立即调用对应 `clear*Flash()`。
- 明文不写入 `localStorage`、Pinia、URL、剪贴板预览或日志。
- 详情接口返回的是掩码（`***`）；不能用掩码“假装”可复制，缺失时明确提示需重新生成。
- 组件重建（`router.push` / `router.replace`）是这套机制存在的原因；不要改成按组件生命周期存放。

## 6.3 资源与生命周期

- 组件内 `setTimeout` / `setInterval`、事件监听、第三方实例，必须在 `onBeforeUnmount` 中清理。
- 页面切换或搜索条件快速变化时，旧请求结果不得覆盖新状态；用请求标识或 `loadedId` 之类的前置判断隔离。
- 弹窗、抽屉关闭时清理草稿与校验错误，避免下次打开残留上一次状态。
- 本地文件导入前先校验大小（知识源上限见 `MAX_PENDING_FILE_BYTES`，与服务端一致），失败给出具体原因。
- 资源文件改名后，所有引用同步更新；不保留旧文件副本“以防万一”。

## 6.4 评审检查

- 每个失败分支是否可见、可恢复；是否把 `code !== 0` 当成功？
- 是否有空 `catch`、裸 `any` 异常或把服务端原文直接当提示？
- 凭据是否只用 flash 传递、用完即清；有没有落进 Pinia、URL 或日志？
- 监听/定时器/请求是否在销毁或条件变化时释放？
- 日志是否脱敏；是否留下旧文件名/旧接口的兼容兜底？

[下一章：新增页面或普通业务功能](../how-to/01-add-page.md) · [返回目录](../README.md)
