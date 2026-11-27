# 术语表

跨章高频且易混淆的名词只在这里定义一次；各章使用本表口径。

| 术语 | 含义 |
| --- | --- |
| 开发者面 / `developer` | 门户调用的网关面；路径形如 `/beaver-open/api/open/developer/v1/{action}`，需登录 |
| 公开面 / `login_public` | 无需登录的端点组（登录、OAuth 换票）；前端仍走统一请求封装 |
| 推送机器人 / bot | 单向推送型机器人，有 `botId`、webhook、token/secret；`UserType=2` |
| 智能体 / digital | 平台上配置的机器人实体，门户里也叫“数字伙伴”；三种编排方式 |
| `runtime` | 服务端编排形态：`builtin` / `external` / `workflow` |
| 编排模式 `mode` | 前端用语：`prompt` / `longconnect` / `workflow`，与 `runtime` 一一映射（见 `workspace.ts`） |
| `configDetail` | 编排详情 JSON：`{ type, prompt?, workflow? }`，`type` 为 1 提示词 / 2 工作流，内部键 snake_case |
| `externalConfig` | 长连接接入的渠道参数 JSON 字符串（如 `callbackUrl`），与“大脑”配置分开存 |
| `knowledgeIds` | 运行时知识库 ID，由后端按知识源表派生，只读回显，不随编排提交 |
| 知识源 / knowledgeSource | 智能体下的子实体；一个知识源含多份文档，文档分段后可检索 |
| 待添加队列 / `pending.ts` | 知识源文档的统一提交模型；在线文档存链接，本地文件存 `File` |
| `credentialFlash` | 模块级 `reactive`，只暂存创建/重置返回的一次性明文凭据 |
| `...Api` | 前端对外请求方法，精确大小写后缀；例如 `getDigitalConfigApi` |
| `I...Req` / `I...Res` | 请求/响应数据接口，`src/types/api/` 中定义 |
| `code` / `msg` / `result` | 统一响应信封；`code === 0` 才表示成功 |
| Store | `src/pinia/**` 中导出的 `use<Domain>Store`，只承担跨组件共享状态 |
| 根组件 | `src/App.vue`，唯一允许大写开头的源文件 |
| 小驼峰 | lowerCamelCase；文件名/目录名默认规则，如 `formCard.vue`、`knowledgeSource/` |
| kebab-case | 短横线小写；仅用于 CSS 类名/HTML 属性，不用于文件名 |
| 兼容性代码 | 仅为旧接口/旧路径/旧字段存在的适配层、双轨分支或空占位；本项目禁止 |

[返回全书目录](README.md)
