<!--
  Copyright (c) 2024-2026 Beaver IM Team
  SPDX-License-Identifier: MIT
  Project: beaver-open
  https://github.com/wsrh8888/beaver-open

  中文：
  本文件为海狸 IM（Beaver IM）开源项目源代码。
  版权所有 © 2024-2026 Beaver IM Team，基于 MIT 协议授权。
  禁止删除、篡改或替换本文件头部版权与许可声明。
  使用与商业授权说明：https://wsrh8888.github.io/beaver-docs/community/license.html

  English:
  This file is part of the Beaver IM open-source project.
  Copyright (c) 2024-2026 Beaver IM Team. Licensed under the MIT License.
  Do not remove, alter, or replace this copyright and license header.
  Usage & commercial licensing: https://wsrh8888.github.io/beaver-docs/community/license.html

  beaver-open-header-v1

  工具分区：只读展示平台工具/MCP 目录，并维护 MCP 注册表条目。
  工具与 MCP 的启用属于用户本机 WorkBuddy 能力，不写云端 Agent 编排，
  因此这里不再提供「绑定到本智能体」的操作。
-->

<template>
  <div>
    <div v-if="mode !== 'prompt'" class="ds-notice ds-notice--brand">
      <span>
        当前是{{ mode === 'longconnect' ? '长链接接入' : '工作流编排' }}。
        工具与 MCP 由用户本机 WorkBuddy 在运行时挂载，这里仅展示平台目录。
      </span>
    </div>

    <div v-else v-loading="loading" class="agent-tools">
      <nav class="agent-tools__nav" role="tablist">
        <button
          type="button"
          role="tab"
          class="agent-tools__nav-btn"
          :class="{ 'agent-tools__nav-btn--active': viewMode === 'toolbox' }"
          @click="viewMode = 'toolbox'"
        >
          工具箱<span class="agent-tools__nav-count">{{ tools.length }}</span>
        </button>
        <button
          type="button"
          role="tab"
          class="agent-tools__nav-btn"
          :class="{ 'agent-tools__nav-btn--active': viewMode === 'mcp' }"
          @click="viewMode = 'mcp'"
        >
          MCP<span class="agent-tools__nav-count">{{ mcpServers.length }}</span>
        </button>
      </nav>

      <!-- 工具箱 -->
      <section v-if="viewMode === 'toolbox'" class="agent-tools__panel">
        <div class="tool-grid">
          <button
            v-for="item in tools"
            :key="item.toolId"
            type="button"
            class="tool-card"
            @click="openToolDetail(item.toolId)"
          >
            <div class="tool-card__body">
              <div class="tool-card__row">
                <span class="tool-card__icon" :style="{ background: iconTint(item.name) }">
                  {{ iconLetter(item.name) }}
                </span>
                <div class="tool-card__text">
                  <span class="tool-card__title">{{ item.name }}</span>
                  <span class="tool-card__subtitle">{{ item.toolId }}</span>
                </div>
              </div>
              <p class="tool-card__desc">{{ toolCardDesc(item) }}</p>
            </div>
          </button>

          <p v-if="!tools.length" class="tool-grid__empty">
            平台还没有工具。
          </p>
        </div>
      </section>

      <!-- MCP -->
      <section v-else class="agent-tools__panel">
        <div class="tool-grid">
          <button type="button" class="tool-card tool-card--entry" @click="openMcpForm">
            <div class="tool-card__body tool-card__body--entry">
              <el-icon class="tool-card__plus-icon"><Plus /></el-icon>
              <span class="tool-card__entry-label">添加 MCP 服务</span>
              <span class="tool-card__entry-hint">维护平台 MCP 注册表</span>
            </div>
          </button>

          <button
            v-for="item in mcpServers"
            :key="item.mcpServerId"
            type="button"
            class="tool-card"
            @click="openMcpDetail(item.mcpServerId)"
          >
            <div class="tool-card__body">
              <div class="tool-card__row">
                <span class="tool-card__icon tool-card__icon--mcp">
                  <el-icon><Connection /></el-icon>
                </span>
                <div class="tool-card__text">
                  <span class="tool-card__title">{{ item.name }}</span>
                  <span class="tool-card__subtitle">{{ item.transport || "stdio" }} · {{ sourceText(item.source) }}</span>
                </div>
              </div>
            </div>
          </button>

          <p v-if="!mcpServers.length" class="tool-grid__empty">
            平台还没有 MCP 服务，点上方「添加 MCP 服务」新建一个。
          </p>
        </div>
      </section>
    </div>

    <!-- 工具详情 -->
    <el-dialog v-model="toolDetailVisible" width="480px" destroy-on-close append-to-body class="tool-dialog">
      <template #header>
        <div class="tool-dialog-header">
          <h2 class="tool-dialog-header__title">工具详情</h2>
        </div>
      </template>
      <template v-if="detailTool">
        <div class="tool-detail-hero">
          <span class="tool-detail-hero__icon" :style="{ background: iconTint(detailTool.name) }">
            {{ iconLetter(detailTool.name) }}
          </span>
          <div class="tool-card__text">
            <h3 class="tool-detail-hero__name">{{ detailTool.name }}</h3>
            <p class="tool-detail-hero__code">{{ detailTool.toolId }}</p>
          </div>
        </div>
        <div class="tool-info-grid">
          <div class="tool-info-grid__row">
            <span class="tool-info-grid__label">类型</span>
            <p class="tool-info-grid__value">{{ toolTypeText(detailTool.toolType) }}</p>
          </div>
          <div class="tool-info-grid__row">
            <span class="tool-info-grid__label">来源</span>
            <p class="tool-info-grid__value">{{ sourceText(detailTool.source) }}</p>
          </div>
          <div class="tool-info-grid__row">
            <span class="tool-info-grid__label">状态</span>
            <p class="tool-info-grid__value">{{ detailTool.status === 1 ? "已启用" : "未启用" }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <el-button round @click="toolDetailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- MCP 详情 -->
    <el-dialog v-model="mcpDetailVisible" width="520px" destroy-on-close append-to-body class="tool-dialog">
      <template #header>
        <div class="tool-dialog-header">
          <h2 class="tool-dialog-header__title">MCP 详情</h2>
        </div>
      </template>
      <template v-if="detailMcp">
        <div class="tool-detail-hero">
          <span class="tool-detail-hero__icon tool-card__icon--mcp">
            <el-icon><Connection /></el-icon>
          </span>
          <div class="tool-card__text">
            <h3 class="tool-detail-hero__name">{{ detailMcp.name }}</h3>
            <p class="tool-detail-hero__code">{{ detailMcp.serverName || detailMcp.mcpServerId }}</p>
          </div>
        </div>
        <div class="tool-info-grid">
          <div class="tool-info-grid__row">
            <span class="tool-info-grid__label">传输方式</span>
            <p class="tool-info-grid__value">{{ detailMcp.transport || "stdio" }}</p>
          </div>
          <div class="tool-info-grid__row">
            <span class="tool-info-grid__label">来源</span>
            <p class="tool-info-grid__value">{{ sourceText(detailMcp.source) }}</p>
          </div>
          <div class="tool-info-grid__row">
            <span class="tool-info-grid__label">连接配置</span>
            <p class="tool-info-grid__value tool-info-grid__mono">{{ detailMcp.config || "未配置" }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <el-button round @click="mcpDetailVisible = false">关闭</el-button>
        <el-button round type="danger" plain @click="removeMcp">删除服务</el-button>
      </template>
    </el-dialog>

    <!-- 新建 MCP -->
    <el-dialog v-model="mcpFormVisible" width="560px" destroy-on-close append-to-body class="tool-dialog">
      <template #header>
        <div class="tool-dialog-header">
          <h2 class="tool-dialog-header__title">添加 MCP 服务</h2>
          <p class="tool-dialog-header__sub">平台级注册表条目，建完即可在列表查看</p>
        </div>
      </template>
      <el-form label-position="top" @submit.prevent>
        <el-form-item label="服务名称" required>
          <el-input v-model="mcpForm.name" maxlength="64" placeholder="例如：内部工单查询" />
        </el-form-item>
        <el-form-item label="服务标识">
          <el-input v-model="mcpForm.serverName" maxlength="64" placeholder="可选，MCP server name" />
        </el-form-item>
        <el-form-item label="传输方式">
          <el-select v-model="mcpForm.transport" class="mcp-form__select">
            <el-option label="websocket" value="websocket" />
            <el-option label="sse" value="sse" />
            <el-option label="stdio" value="stdio" />
          </el-select>
        </el-form-item>
        <el-form-item label="连接配置（JSON）">
          <el-input
            v-model="mcpForm.config"
            type="textarea"
            :rows="6"
            placeholder='{"url": "wss://example.com/mcp", "headers": {}}'
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="mcpFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="mcpSaving" @click="submitMcp">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, reactive, ref, defineComponent } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { Connection, Plus } from "@element-plus/icons-vue"
import {
  deleteDigitalMcpApi, listDigitalCatalogApi, saveDigitalMcpApi
} from "@/api/digital"
import type { IDigitalMcpServer, IDigitalTool } from "@/types/api/digital"
import { useDigitalWorkspace } from "../workspace"
import { iconLetter, iconTint } from "@/pages/digitals/components/cardVisual"

export default defineComponent({
  name: "ToolsTab",
  components: { Connection, Plus },
  setup() {
    function errorMessage(err: unknown, fallback: string): string {
      if (err instanceof Error && err.message) return err.message
      if (err && typeof err === "object" && "msg" in err) {
        return String((err as { msg?: string }).msg || fallback)
      }
      return fallback
    }

    const { mode, digitalId } = useDigitalWorkspace()

    const viewMode = ref<"toolbox" | "mcp">("toolbox")
    const tools = ref<IDigitalTool[]>([])
    const mcpServers = ref<IDigitalMcpServer[]>([])
    const loading = ref(false)

    const loadCatalog = async () => {
      loading.value = true
      try {
        const res = await listDigitalCatalogApi()
        if (res.code !== 0) throw new Error(res.msg || "加载工具目录失败")
        tools.value = res.result?.tools ?? []
        mcpServers.value = res.result?.mcpServers ?? []
      } catch (err) {
        ElMessage.error(errorMessage(err, "加载工具目录失败"))
      } finally {
        loading.value = false
      }
    }

    /* ============ 工具目录 ============ */
    const detailToolId = ref("")
    const toolDetailVisible = ref(false)
    const detailTool = computed(() => tools.value.find(item => item.toolId === detailToolId.value) || null)

    const openToolDetail = (id: string) => {
      detailToolId.value = id
      toolDetailVisible.value = true
    }

    /* ============ MCP 注册表 ============ */
    const mcpDetailId = ref("")
    const mcpDetailVisible = ref(false)
    const detailMcp = computed(() => mcpServers.value.find(item => item.mcpServerId === mcpDetailId.value) || null)

    const openMcpDetail = (id: string) => {
      mcpDetailId.value = id
      mcpDetailVisible.value = true
    }

    const removeMcp = async () => {
      if (!detailMcp.value) return
      try {
        await ElMessageBox.confirm(
          `删除 MCP 服务「${detailMcp.value.name}」？此操作只删除平台注册表条目。`,
          "删除 MCP 服务",
          { type: "warning" }
        )
      } catch {
        return
      }
      try {
        const res = await deleteDigitalMcpApi({
          digitalId: digitalId.value,
          mcpServerId: detailMcp.value.mcpServerId
        })
        if (res.code !== 0) throw new Error(res.msg || "删除失败")
        mcpDetailVisible.value = false
        await loadCatalog()
        ElMessage.success("已删除")
      } catch (err) {
        ElMessage.error(errorMessage(err, "删除失败"))
      }
    }

    const mcpFormVisible = ref(false)
    const mcpSaving = ref(false)
    const mcpForm = reactive({
      name: "",
      serverName: "",
      transport: "websocket",
      config: ""
    })

    const openMcpForm = () => {
      mcpForm.name = ""
      mcpForm.serverName = ""
      mcpForm.transport = "websocket"
      mcpForm.config = ""
      mcpFormVisible.value = true
    }

    const submitMcp = async () => {
      const name = mcpForm.name.trim()
      if (!name) {
        ElMessage.warning("请填写服务名称")
        return
      }
      if (mcpForm.config.trim()) {
        try {
          JSON.parse(mcpForm.config)
        } catch {
          ElMessage.warning("连接配置需要是合法 JSON")
          return
        }
      }
      mcpSaving.value = true
      try {
        const res = await saveDigitalMcpApi({
          digitalId: digitalId.value,
          name,
          serverName: mcpForm.serverName.trim() || undefined,
          transport: mcpForm.transport,
          config: mcpForm.config.trim() || undefined
        })
        if (res.code !== 0) throw new Error(res.msg || "创建失败")
        mcpFormVisible.value = false
        await loadCatalog()
        ElMessage.success("已创建")
      } catch (err) {
        ElMessage.error(errorMessage(err, "创建失败"))
      } finally {
        mcpSaving.value = false
      }
    }

    const toolTypeText = (type?: string) => {
      if (type === "builtin") return "内置工具"
      if (type === "api") return "API 工具"
      if (type === "mcp") return "MCP 工具"
      return type || "工具"
    }

    const sourceText = (source?: string) => (source === "custom" ? "自定义" : "官方")

    /** 平台工具目录目前没有 description 字段，卡片描述位用真实的类型/来源信息，不编造文案。 */
    const toolCardDesc = (item: IDigitalTool) =>
      `${toolTypeText(item.toolType)} · ${sourceText(item.source)}`

    onMounted(loadCatalog)
    return {
      mode, digitalId, viewMode, tools, mcpServers, loading, loadCatalog,
      detailToolId, toolDetailVisible, detailTool, openToolDetail,
      mcpDetailId, mcpDetailVisible, detailMcp, openMcpDetail, removeMcp,
      mcpFormVisible, mcpSaving, mcpForm, openMcpForm, submitMcp,
      toolTypeText, sourceText, toolCardDesc, iconLetter, iconTint
    }
  }
})
</script>

<style scoped lang="less">
@import "../../components/toolCards.less";

.agent-tools__nav-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  margin-left: 6px;
  padding: 0 5px;
  border-radius: 999px;
  font-size: 11px;
  background: var(--el-fill-color);
  color: var(--el-text-color-secondary);
}

.agent-tools__nav-btn--active .agent-tools__nav-count {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.tool-grid__empty {
  grid-column: 1 / -1;
  padding: 28px;
  text-align: center;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.mcp-form__select {
  width: 100%;
}
</style>
