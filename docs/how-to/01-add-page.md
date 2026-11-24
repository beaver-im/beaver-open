# 第7章　新增页面或普通业务功能

## 7.1 开始前

1. 明确页面属于哪个域：`bots` / `digitals` / `oauth` / `dashboard` / `common`。
2. 确认是否已有同域页面可复用；不要把新功能塞进无关的 `index.vue`。列表页、详情页、详情页签各有固定位置（见[第2章](../standards/01-boundaries-and-naming.md)）。
3. 判断页面是“列表 / 新建 / 详情 / 详情页签”中的哪一种，按同域既有文件仿写。
4. 查 `git status`，不覆盖他人未提交改动。

## 7.2 落文件

- 列表页：`src/pages/<domain>/list/index.vue`；详情页：`src/pages/<domain>/detail/index.vue`；页签：`src/pages/<domain>/detail/tabs/<name>Tab.vue`。
- 目录与文件名一律小驼峰：`knowledgeSource/`，不是 `knowledge-source/`。
- 页面内局部状态用 `ref` / `reactive`；跨组件共享才建 `src/pinia/<domain>/*.ts` 并导出 `use<Domain>Store`。
- 需要跨路由重建保留的一次性数据，才用同域 `xxxFlash.ts` / `pending.ts` 这类模块级单例，并说明清空时机。
- 路由挂到 [src/router/index.ts](../../src/router/index.ts) 对应域树下，补齐 `meta`：

```ts
{
  path: "/robot/bots/:botId/audit",
  name: "BotAudit",
  component: () => import("@/pages/bots/detail/tabs/auditTab.vue"),
  meta: {
    title: "操作审计",
    requiresAuth: true,
    group: "机器人能力",
    module: "推送机器人",
    modulePath: "/robot/bots",
    page: "操作审计"
  }
}
```

示例路径与文件不存在，仅说明写法；真实新增时保证文件已存在，并把路由放在对应层级（`create` 这类静态段必须排在 `:id` 动态段之前）。

## 7.3 数据与交互

- 需要接口时先按[第8章](02-add-api.md)加类型和方法，页面只调用 `...Api`。
- 判断 `code`：`0` 才用 `result`；失败提示 `msg` 或统一文案，不渲染空成功态。
- 空态、加载态、失败态都要可见；快速切换时防止旧响应覆盖新状态。
- 样式写在 `.vue` 的 `<style lang="less" scoped>`，颜色与间距用 `--ds-*` 令牌；图标走 Element Plus 或 `src/assets/icons/` 小驼峰资源。
- 破坏性操作（删除机器人/智能体、重置密钥、停用）必须二次确认，结果以服务端返回为准。

## 7.4 收尾

- 运行 `node_modules/.bin/vue-tsc --noEmit -p tsconfig.app.json`，确认新增文件无类型错误。
- 运行 `node scripts/check-knowledge.mjs`；页面结构/入口变化时同步改[目录页](../directory.md)与[模块参考](../modules/README.md)。
- 说明实际命令、结果和未验证项；不要提交/推送，除非用户明确要求。

[下一章：新增一个 API 与配套类型](02-add-api.md) · [返回目录](README.md)
