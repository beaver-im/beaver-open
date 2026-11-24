# 第2章　目录、命名、依赖方向与模块边界

## 2.1 先确定放在哪里

**当前事实**：这是一个单页门户，源码全部在 `src`，没有 Electron 主进程、独立窗口包或插件运行时。

| 新增内容 | 放置位置 | 不应放在哪里 / 原因 |
| --- | --- | --- |
| 页面与页面内子组件 | `src/pages/<domain>/<feature>/`，入口 `index.vue` | 不把所有业务塞进 `src/pages/index.vue`；域目录按业务归属 |
| 列表页与详情页的页签 | `src/pages/<domain>/detail/tabs/` | 不把页签内容平铺在详情 `index.vue` 里 |
| 跨页面复用业务组件 | `src/pages/digitals/components/`（现有共享位置） | 不为一次复用造全局注册中心 |
| 纯展示/通用 UI | 现有同域组件目录或 Element Plus | 不在 UI 里接入账号、权限或 HTTP 细节 |
| HTTP 方法 | `src/api/<domain>.ts` | 不在 `.vue` 里直接 `axios`、不在 API 里写业务编排 |
| 请求/响应与领域实体类型 | `src/types/api/*.ts` | 不把所有类型塞进一个巨型文件 |
| 跨组件共享状态 | `src/pinia/<domain>/*.ts` | 不把短命表单草稿塞全局 store |
| 请求封装、存储、上传、校验 | `src/utils/...` 既有子目录 | 不新造与现有工具平行的第二套实现 |
| 环境、菜单、主题令牌 | `src/config/`、`src/styles/` | 不把域名和令牌写进业务文件 |
| 静态图标 | `src/assets/icons/` | 不在模板里内联重复的长 SVG（确有必要时见 `libraryTypeIcon.vue`） |

**统一约束**：先选择已有职责位置；只有确实跨多个使用方的稳定能力才提升共享位置。发现错位、冗余或多余抽象，直接按依赖方向重构并删除不需要的层，不因改动成本保留错位结构。

## 2.2 命名硬规则

**唯一例外：`src/App.vue` 大写开头**，这是 Vue 根组件约定。除此之外，`src` 下所有文件和目录一律**小驼峰（lowerCamelCase）**：

| 对象 | 约束 | 正例 | 反例 |
| --- | --- | --- | --- |
| Vue 文件 | 小写开头，多词小驼峰；`index.vue` 可作目录入口 | `formCard.vue`、`promptEditor.vue`、`notFound.vue` | `FormCard.vue`、`prompt-editor.vue`、`404.vue` |
| 普通 TS 文件 | 小驼峰 | `credentialFlash.ts`、`workspace.ts` | `CredentialFlash.ts`、`credential-flash.ts` |
| 目录 | 小驼峰 | `knowledgeSource/`、`navigationBar/`、`orchestration/` | `knowledge-source/`、`navigation-bar/` |
| 图片/SVG 资源 | 小驼峰 | `brandMark.svg`、`segmentSparkFilled.svg` | `brand-mark.svg`、`segment-spark-filled.svg` |
| 样式文件 | 小驼峰 | `designSystem.css`、`elementOverrides.css` | `design-system.css`、`element-overrides.css` |
| 文档文件 | 小驼峰 | `readme.md` | `README.md`（根级项目说明除外） |
| 组件注册名 / 类型 / 类 | PascalCase | `NavigationBar`、`IDigitalInfo` | `navigationBar` 作组件名 |
| Pinia 导出 | `use` + 领域名 + `Store` | `useUserStore`、`useAppStore` | `userStore` |
| 对外请求方法 | lowerCamelCase，精确 `Api` 后缀 | `getDigitalConfigApi` | `get_digital_config`、`getConfigAPI` |
| 请求/响应接口 | `I` + 动作 + `Req` / `Res` | `IGetDigitalConfigReq` | `DigitalConfigRequest` |

CSS 类名、HTML 属性与 BEM 仍用 kebab-case（例如 `class="navigation-bar"`、`:knowledge-source-id`）；**它们不是文件名，不受本规则约束**。

**整改方式**：文件/目录改名后，必须同步修改全部 `import`、路由动态 `import`、资源 `import` 与文档链接。禁止保留旧文件名占位文件、转发导出或双路径兼容。第13章的命令与命名脚本可验证结果。

**本轮已整改的旧路径**见[工程目录](../directory.md#改名后的关键路径)，旧名只作历史索引。

## 2.3 依赖方向

```text
pages  → api → utils/request → 网关
  ↓       ↓
types ← types
  ↓
pinia（只保存共享状态，不反向导入页面实现）
```

- `src/types/**` 只放契约与数据形状，不导入 `.vue`、axios 或 Pinia 实现。
- `src/api/**` 只依赖类型与请求封装，不导入页面/store，不弹窗。
- `src/utils/**` 是可复用纯工具或底层封装，不反向导入页面。
- `src/pinia/**` 可调用 API 编排状态，但不把页面局部状态吸走。
- 同域短相对导入允许；跨层优先用 `@/` 别名，路径必须指向最终文件名。
- 页面内的“模块级单例”（`credentialFlash`、`workspace`、`pending`）只服务本域，放在该域目录下，不提升到 `src/utils`。

## 2.4 评审检查

- 新文件能否解释“为什么放在这一层”？是否把请求封装或状态放进了页面？
- 文件名/目录名是否符合第2.2节，`App.vue` 是否是唯一大写例外？
- 改名是否同步了所有引用；是否残留旧路径的兼容壳？
- 是否出现只服务一次调用的通用框架、注册中心或无必要抽象？
- 凭据明文是否只存在于 flash 模块与展示组件，没有落到 store、URL 或日志？

[下一章：类型与接口](02-types-and-api.md) · [返回目录](../README.md)
