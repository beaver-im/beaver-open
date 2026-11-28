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

  推送机器人详情：只有「设置」和「开发者选项」两个分区，与智能体详情同一套骨架。
  接入信息属于开发者视角（凭据、Webhook），归到开发者选项；其余（名称、头像、描述、
  可见范围、人员）都是产品配置，归到设置。
-->

<template>
  <div class="ws">
    <TabNav :tabs="tabs" :active="active" @select="select">
      <!-- 实体态：发布状态 + 发布/取消发布。未发布是草稿，IM 侧不可用 -->
      <template v-if="bot" #extra>
        <span
          class="ds-badge"
          :class="published ? 'ds-badge--success' : 'ds-badge--neutral'"
        >{{ published ? "已发布" : "未发布" }}</span>
        <el-button :loading="statusSaving" @click="togglePublish">
          {{ published ? "取消发布" : "发布" }}
        </el-button>
      </template>
    </TabNav>

    <div v-if="loadFailed" class="ds-notice ds-notice--danger">
      无法加载该机器人，请返回列表后重试。
    </div>

    <template v-else-if="bot">
      <!-- :key 随实体 ID 变化，强制重建分区组件，避免复用时残留上一个实体的表单状态 -->
      <div :key="botId" v-loading="loading">
        <SettingsTab v-if="active === 'settings'" :bot="bot" @refresh="loadDetail" />
        <DeveloperTab v-else-if="active === 'developer'" :bot="bot" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { ElMessage } from "element-plus"
import { getBotDetailApi, setBotStatusApi } from "@/api/bot"
import type { IBotInfo } from "@/types/api/bot"
import TabNav from "@/pages/digitals/components/tabNav.vue"
import SettingsTab from "./tabs/settingsTab.vue"
import DeveloperTab from "./tabs/developerTab.vue"

export default defineComponent({
  name: "BotsDetailPage",
  components: { TabNav, SettingsTab, DeveloperTab },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const botId = computed(() => String(route.params.botId || ""))
    const loading = ref(false)
    const loadFailed = ref(false)
    const bot = ref<IBotInfo | null>(null)

    const tabs = [
      { key: "settings", label: "设置" },
      { key: "developer", label: "开发者选项" }
    ]

    /** 分区与 URL ?tab= 同步：刷新、分享、浏览器后退都停在同一分区。 */
    const active = computed(() => {
      const queryTab = String(route.query.tab || "")
      return tabs.some(item => item.key === queryTab) ? queryTab : "settings"
    })

    const select = (key: string) => {
      if (key === active.value) return
      router.replace({ query: { ...route.query, tab: key } })
    }

    /* ============ 发布 / 取消发布 ============
     * status：1 已发布 / 2 未发布。新建机器人默认未发布（草稿），
     * 配置好后再由用户手动发布；未发布时 IM 侧不可用（不能入群、不能推送）。
     */
    const published = computed(() => bot.value?.status === 1)
    const statusSaving = ref(false)
    const togglePublish = async () => {
      const current = bot.value
      if (!current) return
      const next = published.value ? 2 : 1
      statusSaving.value = true
      try {
        await setBotStatusApi({ botId: current.botId, status: next })
        current.status = next
        ElMessage.success(next === 1 ? "已发布" : "已取消发布")
      } catch (err) {
        ElMessage.error(errorMessage(err, "操作失败"))
      } finally {
        statusSaving.value = false
      }
    }

    function errorMessage(err: unknown, fallback: string): string {
      if (err instanceof Error && err.message) return err.message
      if (err && typeof err === "object" && "msg" in err) {
        return String((err as { msg?: string }).msg || fallback)
      }
      return fallback
    }

    async function loadDetail() {
      const id = botId.value
      if (!id) {
        loadFailed.value = true
        return
      }
      loading.value = true
      loadFailed.value = false
      try {
        const res = await getBotDetailApi({ botId: id })
        const info = res?.result?.bot
        if (!info) throw new Error("机器人不存在")
        bot.value = info
        route.meta.entityName = info.name
      } catch (err) {
        loadFailed.value = true
        ElMessage.error(errorMessage(err, "加载机器人详情失败"))
      } finally {
        loading.value = false
      }
    }

    // 详情页组件在 :botId 变化时会复用，必须重新拉取，避免显示上一个机器人的数据。
    watch(botId, (id, previous) => {
      if (id && id !== previous) loadDetail()
    })

    onMounted(loadDetail)

    return {
      botId, loading, loadFailed, bot, tabs, active, select,
      published, statusSaving, togglePublish, loadDetail
    }
  }
})
</script>
