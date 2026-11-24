# 第4章　Vue 组件、Pinia 状态、样式和资源

## 4.1 组件写法

**当前事实**：`src` 下 41 个 Vue 组件统一用 `export default defineComponent`，没有 `script setup`；块顺序为 `template → script lang="ts" → style lang="less" scoped`。[eslint.config.js](../../eslint.config.js) 未强制块顺序，但统一写法便于检索。

**统一约束**：新组件继续用 `defineComponent`，在 `setup()` 中组合 ref/reactive 与 store，通过 `setup()` 返回值暴露给模板。不混用第二套写法；遇到存量混用直接在相关任务中改齐。

```vue
<!-- 写法示例：不是仓库已有文件 -->
<template>
  <span class="digital-label">{{ label }}</span>
</template>
<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
  name: "DigitalLabel",
  props: { label: { type: String, required: true } }
})
</script>
<style lang="less" scoped>
.digital-label { white-space: nowrap; }
</style>
```

组件负责渲染、交互与语义事件；不直接在组件中拼鉴权头、不散落业务 URL、不把请求编排写进模板表达式。

## 4.2 状态放哪

| 状态 | 放置 | 原因 |
| --- | --- | --- |
| 弹层开关、输入草稿、表格勾选 | 组件 `ref` / `reactive` | 短命状态不塞全局 |
| 登录态、布局状态 | `src/pinia/**`，导出 `use<Domain>Store` | 单一维护入口 |
| 后端持久化数据 | 服务端；前端只缓存展示副本 | Pinia 不是事实源 |
| Token / userId / deviceId | 以 `localStorage` 为既有持久化位置，由 store 与请求封装读写 | 不在每个页面重复读写细节 |
| 跨路由重建仍需保留的一次性数据 | 本域目录下的模块级 `reactive`（`credentialFlash.ts`、`workspace.ts`） | 组件会重建，Pinia 又不该存凭据明文 |

**真实模式**：

- [src/pinia/user/user.ts](../../src/pinia/user/user.ts) 使用 `defineStore("useUserStore", { state, getters, actions })`，负责 `token`/`userId`/`nickName` 与登录动作。
- [src/pinia/app/app.ts](../../src/pinia/app/app.ts) 保存侧栏折叠、设备类型、加载态与标题；`setTitle` 会直接写 `document.title`，页面标题的常规入口仍是路由 `afterEach`。
- 详情页的编排状态通过 `provide(digitalWorkspaceKey, ...)` + `useDigitalWorkspace()` 注入，见[第10章](../modules/digitals.md)；新页面不要复制这套注入键，直接复用。

## 4.3 样式、图标与资源路径

- 设计令牌唯一真源是 [designSystem.css](../../src/styles/designSystem.css)：颜色、字号、间距、圆角一律用 `--ds-*`。Element Plus 的视觉覆写在 [elementOverrides.css](../../src/styles/elementOverrides.css)，全局骨架在 [global.css](../../src/styles/global.css)。
- 新组件样式写在自身 `.vue` 的 `<style lang="less" scoped>`；不在组件里重定义 `--ds-*` 令牌。
- 功能图标用 Element Plus 图标或 `src/assets/icons/` 下的 SVG；资源文件名按[第2章](01-boundaries-and-naming.md)小驼峰，如 `brandMark.svg`、`segmentSpark.svg`。
- 资源引用统一走 `@/assets/icons/...`，路径中的文件名必须与磁盘一致；改名后同步改 `import` 与样式里的 `url(...)`。
- CSS 类名用 kebab-case/BEM（`class="navigation-bar"`），不因为文件名改成小驼峰而改类名；图标要有 `aria-label` 或 `aria-hidden`。

## 4.4 评审检查

- props/事件边界是否清楚；空态、加载态、失败态是否处理？
- 跨组件状态是否走领域 store；是否有页面直写别人的内部状态？
- 快速切换时旧响应是否可能覆盖新状态；监听/定时器是否在生命周期内清理？
- 文件名与资源路径是否符合第2章，改名引用是否全部同步？
- 凭据明文是否只存在于 flash 模块与展示节点，没有被写进 store 或模板以外的持久化位置？

[下一章：登录态、Token 注入与路由边界](04-auth-and-routing.md) · [返回目录](../README.md)
