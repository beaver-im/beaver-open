# 第10章　智能体：列表、详情与三种编排方式

最后核验：2026-11-25。智能体（数字伙伴）是门户最复杂的一块：一个实体、三种运行时、五个页签，编排配置与渠道参数分两处存。

## 10.1 文件地图

| 位置 | 职责 |
| --- | --- |
| [pages/digitals/list/index.vue](../../src/pages/digitals/list/index.vue) | 列表、创建跳转、卡片视觉 |
| [pages/digitals/detail/index.vue](../../src/pages/digitals/detail/index.vue) | 工作台外壳：加载实体、`provide` 编排服务、页签、模式切换 |
| [pages/digitals/detail/workspace.ts](../../src/pages/digitals/detail/workspace.ts) | 编排配置的模块级单例 + `provide/inject` 契约 |
| [pages/digitals/detail/constants.ts](../../src/pages/digitals/detail/constants.ts) | 模式文案等展示常量 |
| [pages/digitals/detail/credentialFlash.ts](../../src/pages/digitals/detail/credentialFlash.ts) | digitalKey/digitalSecret 一次性明文 |
| [detail/tabs/orchestrationTab.vue](../../src/pages/digitals/detail/tabs/orchestrationTab.vue) | 编排分区：模式选择 + 提示词/长连接编辑器 |
| [detail/tabs/knowledgeTab.vue](../../src/pages/digitals/detail/tabs/knowledgeTab.vue) | 当前智能体名下的知识源列表与入口 |
| [detail/tabs/toolsTab.vue](../../src/pages/digitals/detail/tabs/toolsTab.vue) | 工具目录浏览 + MCP 注册表维护 |
| [detail/tabs/developerOptionsTab.vue](../../src/pages/digitals/detail/tabs/developerOptionsTab.vue) | 开放凭据、重置密钥 |
| [detail/tabs/settingsTab.vue](../../src/pages/digitals/detail/tabs/settingsTab.vue) | 基本信息、头像、可见性、成员、删除 |

## 10.2 三种编排方式与 runtime 的对应

| 前端模式 | 服务端 runtime | 配置来源 |
| --- | --- | --- |
| `prompt` 提示词 | `builtin` | `configDetail = { type: 1, prompt: {...} }` |
| `longconnect` 长连接 | `external` | `externalConfig`（`callbackUrl`） |
| `workflow` 工作流 | `workflow` | `configDetail = { type: 2, workflow: {...} }` |

映射函数在 `workspace.ts`：`modeToRuntime` / `runtimeToMode`。**不要**在两个页签里各写一份映射；模式变化统一走 `ws.switchMode(next)`——实体态落库 `runtime`，草稿态只改本地草稿。

## 10.3 编排工作台的真实机制

- **模块级单例**：`createDigitalConfig()` 的 `prompt` / `external` / `workflow` 是模块级 `reactive`，不是组件局部状态。原因是草稿态保存后会 `router.replace` 到真实 ID，组件可能重建；编辑内容不能因此丢失。切到另一个实体会由 `load()` 整体覆盖。
- **注入契约**：`digitalWorkspaceKey` + `useDigitalWorkspace()`，提供 `digital`、`draft`、`mode`、`config`、`ensureCreated()`、`saveConfig()`、`switchMode()`、`refresh()`、`goTab()`。
- **草稿态**：`/robot/digitals/create` 与 `:digitalId` 共用 [detail/index.vue](../../src/pages/digitals/detail/index.vue)。`ensureCreated()` 先创建实体，再原地换 ID；任何分区保存都会走它。
- **整份提交**：`config.save(id, mode)` 一次提交 `configDetail`（或 `externalConfig`）。服务端按 `runtime` 只认一列，分区各自保存时若只带局部字段会互相覆盖，所以**不要再加“只存当前分区”的接口调用**。
- **校验前置**：`config.validate(mode)` 在创建前跑，避免实体已落库但配置写不进去。提示词模式下校验变量名非空且不重复。

## 10.4 configDetail 契约

```text
configDetail = {
  type: 1,                     // 1 提示词 / 2 工作流
  prompt: {
    system,                    // 系统提示词
    opening_message,           // 开场白
    opening_questions: [],     // 建议问法
    variables: [               // 变量行
      { name, label, type, default, required, options }
    ]
  }
}
```

- 内部键一律 snake_case；表单层用驼峰（`openingMessage`、`openingQuestions`），提交前显式转换（见 [workspace.ts](../../src/pages/digitals/detail/workspace.ts) 的 `save`）。
- 变量类型取值 `text | textarea | select`，与 AI 侧 `PromptVariable` 一致。
- `knowledgeIds` 由后端按知识源表派生，前端只读回显，**不随编排提交**。
- `type` 必须与实际模式一致；切模式时同时改 `runtime` 与 `configDetail.type`。

## 10.5 工具与 MCP

- [toolsTab.vue](../../src/pages/digitals/detail/tabs/toolsTab.vue) 只做**目录浏览**：`digital_catalog` 返回平台已上架工具与 MCP，卡片展示数量取目录长度。
- 工具启用是客户端（WorkBuddy）本机能力，**不写进云端 Agent 编排**；不要再往 `configDetail.prompt` 里塞 `tools` / `mcpServerIds`。
- MCP 注册表维护走 `digital_mcp_save` / `digital_mcp_delete`，属于开发者自建服务，不是 Agent 绑定关系。

## 10.6 工号与 IM 资料

- 申请工号后 `userId` 即 account 用户（`userType=digital`），与普通用户同表。
- [settingsTab.vue](../../src/pages/digitals/detail/tabs/settingsTab.vue) 改名称/头像：上传走 [utils/upload](../../src/utils/upload/index.ts) 拿 `fileUrl`；保存时 open 写本地表，**已有工号则同步 account**，由 account 推 `USER_PROFILE`。
- 未申请工号时只改 open 本地展示字段；申请工号时把本地名称/头像一并写入 IM 用户。

## 10.7 改动提示

- 改编排字段：先改 `types/api/digital.ts` 的 `IDigitalConfigDetail` 与 `workspace.ts` 的读写，再改编辑器组件，最后核对服务端 `beaver-server-open` 的 `digital_config_save` 与 AI 的 `config_detail`。
- 改模式：同时检查 `orchestrationTab.vue` 的分支渲染、`switchMode` 的落库、`knowledgeTab` 是否仍适用（工作流模式不消费知识源）。
- 删除/停用：`deleteDigitalApi` / `setDigitalStatusApi` 必须二次确认。
- 成员：`digital_set_admins` / `digital_set_viewers`，选择器是 [components/memberPickerDialog.vue](../../src/pages/digitals/components/memberPickerDialog.vue)。

[下一章：知识源](../modules/knowledgeSource.md) · [返回目录](../README.md)
