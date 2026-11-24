# Beaver Open：给人和 AI 的薄入口

主手册：[海狸开放平台工程手册](docs/README.md)。工具不能自动加载本文件时由调用者显式提供；它不是永久记忆，也不要求每次读整本手册。

## 按任务阅读

| 当前工作 | 阅读入口 |
| --- | --- |
| 初次接手 / 跨模块理解 | [第1章架构](docs/architecture.md) |
| 新目录、命名、文件放哪 | [第2章](docs/standards/01-boundaries-and-naming.md) |
| TS 类型、接口请求与数据契约 | [第3章](docs/standards/02-types-and-api.md) |
| Vue 组件、Pinia 状态、样式资源 | [第4章](docs/standards/03-vue-and-state.md) |
| 登录态、Token 与路由 | [第5章](docs/standards/04-auth-and-routing.md) |
| 错误、日志与资源释放 | [第6章](docs/standards/05-errors-and-resources.md) |
| 新页面 / 新 API | [第三篇实战](docs/how-to/README.md) |
| 找到具体源码 / 符号 | [第四篇模块速查](docs/modules/README.md) |
| 验证、评审和完成标准 | [第13章](docs/workflow.md) |
| 决策 / 多会话交接 | [第14章](docs/decisions/README.md)、[第15章](docs/tasks/README.md) |

## 最高工程原则（开源项目，无历史包袱）

- 本项目为开源项目，不作商业托管运营，**没有历史包袱**：**不考虑任何兼容代码**、**不考虑实现成本**，哪里有问题就改哪里，不需要的直接去掉。
- 契约、目录、接口与数据模型可直接破坏性调整；改动时同步更新所有受影响的调用方、消费者与初始化/读写代码，删除废弃路径，不留仅为旧版存在的兼容层、双轨分支或适配兜底。
- 仍须保持工程纪律：不因“无历史包袱”省略验证、错误处理或安全校验；他人未提交改动、外部配置及真实用户数据的破坏操作仍须授权。

## 命名硬规则（唯一例外是 App.vue）

- **只有 `src/App.vue` 大写开头**，这是 Vue 根组件约定；除它之外，`src` 下所有文件与目录都必须小驼峰：`formCard.vue`、`knowledgeSource/index.vue`、`brandMark.svg`、`readme.md`。
- 允许 `index.vue` 作为目录入口；CSS 类名、HTML 属性仍用 kebab-case，它们不是文件名。
- 组件注册名、类型/类符号用 PascalCase；Pinia 导出为 `use<Domain>Store`；对外请求方法以精确大小写 `Api` 结尾；请求/响应接口为 `I<Action>Req` / `I<Action>Res`。
- 文件改名必须同步改完全部 import、router 懒加载、`@include` 资源路径与文档链接；不保留旧文件名别名或兼容导出。

## 必须保持的执行边界

- 先明确目标与验收，查看 `git status`、暂存与未暂存差异；不得覆盖他人工作或擅自重置/暂存。
- 普通任务按章节与符号定点检索；跨模块任务可扩大范围并说明原因。
- 源码、构建配置是实现事实源；第二篇是全仓统一规范，遇到存量差异即改；任务卡不是架构事实。
- API 层只做协议适配，不在其中导入页面、弹窗或改 Pinia；页面不直写共享状态细节。
- 外部输入先当未知值校验；`code !== 0` 时不能假定 `result` 存在。
- 检索默认排除 `.git`、`node_modules`、`dist`、日志与缓存；不读取/记录 `.env`、令牌和真实用户数据。
- **接入凭据（AppSecret / token / webhook token）只经模块级 flash 暂存一次**，不写入 URL、日志或持久化缓存。

## 工作闭环

定位 → 按需读取 → 实现 → 验证 → 更新相关知识 → 交接。
接口、职责、入口或命令改变时，同次更新相应章节；重要决策进 ADR，临时进度进任务卡。

## 验证与交付

- 文档检查：`node scripts/check-knowledge.mjs`；空白检查：`git diff --check`。
- 代码检查按[真实命令矩阵](docs/workflow.md)选：`vue-tsc --noEmit -p tsconfig.app.json`、`vite build`、`eslint`（不加 `--fix` 做只读验收）。
- 根 `lint` 脚本带 `--fix`，会改文件；根清单没有 `test` 脚本，不能编造测试结果。
- 最终说明改了什么、实际命令/目录/结果、没验证什么、剩余风险；未运行不能标通过。
- 不默认提交、推送、发布或安装依赖；以本任务授权为准。
