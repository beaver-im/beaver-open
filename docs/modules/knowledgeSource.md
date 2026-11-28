# 第11章　知识源：文档导入、检索与分段设置

最后核验：2026-11-25。知识源是智能体的**子实体**，不是一级菜单：一个智能体下多个知识源，一个知识源下多份文档，文档经分段后进入检索。

## 11.1 路由与文件地图

| 路由 | 文件 | 说明 |
| --- | --- | --- |
| `/robot/digitals/:digitalId/knowledge/create` | [knowledgeSource/create.vue](../../src/pages/digitals/knowledgeSource/create.vue) | 先选数据源，再落库 |
| `/robot/digitals/:digitalId/knowledge/:knowledgeSourceId` | [knowledgeSource/index.vue](../../src/pages/digitals/knowledgeSource/index.vue) | 详情容器，内部挂 `ksDetailView` |

静态段 `create` 必须排在 `:knowledgeSourceId` 之前，否则会被当成 ID。

| 组件（`detail/tabs/knowledgeSource/`） | 职责 |
| --- | --- |
| [ksDetailView.vue](../../src/pages/digitals/detail/tabs/knowledgeSource/ksDetailView.vue) | 详情骨架：头部、页签、文档/检索/设置三块 |
| [ksDocumentsPanel.vue](../../src/pages/digitals/detail/tabs/knowledgeSource/ksDocumentsPanel.vue) | 文档列表、添加、删除、状态 |
| [ksRetrievePanel.vue](../../src/pages/digitals/detail/tabs/knowledgeSource/ksRetrievePanel.vue) | 检索测试 |
| [ksSettingsPanel.vue](../../src/pages/digitals/detail/tabs/knowledgeSource/ksSettingsPanel.vue) | 基础设置与索引配置 |
| [importOnlineDocDialog.vue](../../src/pages/digitals/detail/tabs/knowledgeSource/importOnlineDocDialog.vue) | 在线文档导入 |

| 组件（`pages/digitals/knowledgeSource/`） | 职责 |
| --- | --- |
| [create.vue](../../src/pages/digitals/knowledgeSource/create.vue) | 创建入口：选数据源后落库 |
| [index.vue](../../src/pages/digitals/knowledgeSource/index.vue) | 详情路由容器，内部挂 `ksDetailView` |
| [ksAddFileWizard.vue](../../src/pages/digitals/knowledgeSource/ksAddFileWizard.vue) | 添加文件向导（在线文档 / 本地文件） |
| [ksSegmentSettingsPanel.vue](../../src/pages/digitals/knowledgeSource/ksSegmentSettingsPanel.vue) | 分段参数 |
| [libraryTypeIcon.vue](../../src/pages/digitals/knowledgeSource/libraryTypeIcon.vue) | word/excel/faq 文档类型图标（内联 SVG） |
| [linkCheckDialog.vue](../../src/pages/digitals/knowledgeSource/linkCheckDialog.vue) | 链接校验 |
| [pending.ts](../../src/pages/digitals/knowledgeSource/pending.ts) | 待添加条目模型与统一提交流程 |

## 11.2 接口

全部在 [api/knowledge.ts](../../src/api/knowledge.ts)，路径前缀 `/beaver-open/api/open/digital/v1/`：

- 知识源：`knowledge_source_list`、`knowledge_source_save`、`knowledge_source_detail`、`knowledge_source_delete`。
- 文档：`knowledge_source_doc_list`、`knowledge_source_doc_check`、`knowledge_source_doc_upload`、`knowledge_source_doc_import`、`knowledge_source_doc_delete`。
- 检索：`knowledge_source_retrieve`。

## 11.3 待添加队列（pending.ts）

“创建知识源”和“详情内添加文件”共用同一份提交逻辑，避免两处各写一遍导入：

- 条目类型 `PendingDocItem`：`kind` 为 `online`（只存链接与 `docId`）或 `local`（存 `File`，提交时读成 base64）。
- 文档类型 `docType`：`doc`（海狸在线文档）或 `faq`（Q&A）。
- 大小上限 `MAX_PENDING_FILE_BYTES = 20MB`，与服务端限制一致；前端先拦，失败要给出具体原因。
- `pendingIconType` / `pendingTypeLabel` 是展示映射，不要在模板里重复判断扩展名。

## 11.4 索引与分段

- 索引配置类型是 `IKnowledgeIndexConfig`，默认值 `DEFAULT_KNOWLEDGE_INDEX_CONFIG` 在 `types/api/knowledge.ts`。
- 分段设置的变化会直接影响检索质量：改字段时同时核对 `ksSettingsPanel.vue`、`ksSegmentSettingsPanel.vue` 与服务端 `knowledge_source_save` 的入参。
- 检索面板只做验证用途，不承担业务查询；不要把它当作对外检索 API 的封装。

## 11.5 改动提示

- 知识源是智能体子实体，接口都要带 `digitalId`；页面从路由或 `useDigitalWorkspace()` 拿 ID，不自己猜。
- 文档删除与知识源删除都是破坏性操作，需二次确认。
- 新增文档类型时先确认服务端支持的类型集合，再改 `PendingDocItem`、图标映射与向导分支，避免出现“能选但传不上去”的入口。

[下一章：OAuth 登录、控制台与公共页](../modules/oauth-and-console.md) · [返回目录](../README.md)
