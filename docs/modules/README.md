# 第四篇　模块参考与定位索引

最后核验：2026-11-25（Asia/Shanghai）。从任务类型选一两页，不必全部加载。

| 问题 / 变更 | 指南 | 首选关键词 |
| --- | --- | --- |
| 推送机器人、webhook、token/secret、Work ID | [推送机器人](bots.md) | `bot_list`、`botCredentialFlash`、`bot_set_status` |
| 智能体、编排、configDetail、工具/MCP、成员 | [智能体](digitals.md) | `useDigitalWorkspace`、`digital_config_save`、`digital_catalog` |
| 知识源、文档导入、分段、检索 | [知识源](knowledgeSource.md) | `knowledge_source_doc_import`、`pending.ts`、`ksSegmentSettingsPanel` |
| 登录、OAuth 应用、控制台、布局菜单 | [OAuth 与控制台](oauth-and-console.md) | `oauthLogin`、`oauth_config_update`、`menuGroups` |

方法：文件名/符号精确检索 → 定点读源码 → 追到必要调用方与契约 → 验证。
可用工具自带检索；不要用 `node_modules`、`dist`、日志、缓存的重复文本当实现。
接口跨度超过一页时回看[架构](../architecture.md)，并在交接中记录实际追到的文件。

[返回全书目录](../README.md)
