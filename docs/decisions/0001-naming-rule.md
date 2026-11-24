# ADR 0001：文件命名——App.vue 是唯一大写例外

- 状态：已确认（用户明确指定，2026-11-25）
- 决策者：项目所有者

## 背景

仓库历史上混用三种命名：kebab-case 目录（`navigation-bar/`、`knowledge-source/`）、kebab-case 资源（`brand-mark.svg`、`design-system.css`）、数字开头页面（`404.vue`）。同一目录里既有 `formCard.vue` 也有 `promptEditor.vue`，检索与引用容易出错。

用户给出的规则很直接：**只有 `App.vue` 大写开头**（Vue 根组件约定），其余文件与目录全部小驼峰。

## 选择

- `src` 下所有文件与目录使用 lowerCamelCase，唯一例外是 `src/App.vue`。
- `index.vue` 允许作为目录入口。
- CSS 类名、HTML 属性保持 kebab-case，它们不是文件名。
- 组件注册名、类型/类用 PascalCase；Pinia 导出 `use<Domain>Store`；请求方法以 `Api` 结尾。

## 影响

- 改名必须同步：`import`、路由动态 `import`、资源 `import`、文档链接。禁止保留旧文件或转发导出。
- `scripts/check-knowledge.mjs` 把该规则变成可执行检查（`namingExceptions` 只放 `src/App.vue`）。
- 本轮整改的旧 → 新对照表见[工程目录](../directory.md#改名后的关键路径)。

## 替代方案与取舍

| 方案 | 结果 |
| --- | --- |
| 全部 kebab-case（含 `app.vue`） | 与 Vue 生态“根组件大写”惯例冲突，且用户明确只保留 `App.vue` 大写 |
| PascalCase 文件名（`FormCard.vue`） | 与现有绝大多数文件不符，重命名面更大，且大小写不敏感文件系统有坑 |
| 保持混用 | 检索成本与引用错误持续存在，与“无历史包袱、哪里有问题改哪里”冲突 |

## 证据与验证

- `find src -type f | awk` 扫描：除 `App.vue` 外无大写开头、无连字符文件名。
- `node scripts/check-knowledge.mjs`：命名检查通过。
- `vue-tsc --noEmit -p tsconfig.app.json` 与 `npm run build_test`：改名后无模块解析错误。

## 复审条件

若引入 Electron 多进程或独立子包，需要区分“根组件”与“窗口组件”命名时，重新评估是否扩大例外；扩大例外必须同时更新本 ADR、第2章与校验脚本。
