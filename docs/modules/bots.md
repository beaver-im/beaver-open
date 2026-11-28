# 第9章　推送机器人：列表、详情与开发者选项

最后核验：2026-11-25。推送机器人（`UserType=2` 的那类）是门户里最薄的一条业务线：一个开发者账号下多个机器人，每个机器人有 `botId`、webhook、token/secret。

## 9.1 文件地图

| 位置 | 职责 |
| --- | --- |
| [pages/bots/list/index.vue](../../src/pages/bots/list/index.vue) | 列表、创建、卡片视觉、跳详情 |
| [pages/bots/detail/index.vue](../../src/pages/bots/detail/index.vue) | 详情壳：加载详情、启停、页签切换 |
| [pages/bots/detail/tabs/settingsTab.vue](../../src/pages/bots/detail/tabs/settingsTab.vue) | 基本信息、头像、可见性、成员、Work ID、删除 |
| [pages/bots/detail/tabs/developerTab.vue](../../src/pages/bots/detail/tabs/developerTab.vue) | 开放能力：webhook、token/secret、重置密钥 |
| [pages/bots/credentialFlash.ts](../../src/pages/bots/credentialFlash.ts) | 创建/重置返回的一次性明文 |
| [api/bot.ts](../../src/api/bot.ts) | 全部 `bot_*` 接口 |
| [types/api/bot.ts](../../src/types/api/bot.ts) | `IBotInfo` 与各 `I...Req/Res` |

## 9.2 数据与接口

- 列表 `bot_list`，创建 `bot_create`，详情 `bot_detail`，更新 `bot_update`，删除 `bot_delete`。
- 启停 `bot_set_status`；重置密钥 `bot_reset_secret`；申请 Work ID `bot_work_id_apply`。
- 成员：`bot_set_admins`（管理员）与 `bot_set_viewers`（仅「部分公开」可见）。
- 可见性取值 `private | partial | public`；列表卡片视觉复用 [digitals/components/cardVisual.ts](../../src/pages/digitals/components/cardVisual.ts)（`iconLetter` / `iconColorFor` / `iconTint`），不要另写一套配色。

## 9.3 创建与凭据

1. 列表页调用 `createBotApi`，成功后把 `webhookUrl` / `token` / `secret` 写入 `setBotCredentialFlash(...)`，再 `router.push` 到详情。
2. 详情页的「开发者选项」读取 `botCredentialFlash` 展示明文；详情接口返回的 `webhookUrl` 已脱敏成 `***`，token 只存哈希，事后无法重建。
3. 用户确认保存后调用 `clearBotCredentialFlash()`。明文不写 `localStorage`、不进 URL。

## 9.4 改动提示

- 新增字段先改 `types/api/bot.ts` 与 `api/bot.ts`，再改两个页签；不要只在模板里“取一下”。
- 头像上传走 [utils/upload](../../src/utils/upload/index.ts)（先代领 uploadToken，再经网关直传 asset），结果只用 `fileUrl`。
- 已申请工号（`userId`）后，保存基础信息由 open 同步到 account；account 升 version 并推 `USER_PROFILE`，客户端按 version 更新。未申请工号只改 open 本地表。
- 删除机器人是破坏性操作，必须 `ElMessageBox` 二次确认，并以服务端返回为准。
- 页签导航复用 [digitals/components/tabNav.vue](../../src/pages/digitals/components/tabNav.vue)；详情页不另设标题区，发布状态与操作按钮走它的 `extra` 插槽，改导航行为时同时检查智能体与 OAuth 详情。

[下一章：智能体与编排](../modules/digitals.md) · [返回目录](../README.md)
