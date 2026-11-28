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

  OAuth 应用详情：设置 / 端配置 / 开发者选项。
  「设置」「开发者选项」与智能体、推送机器人同名同骨架，中间一块是 OAuth 独有的端接入配置。
-->

<template>
  <div class="ws">
    <TabNav :tabs="tabs" :active="active" @select="select" />

    <div v-if="loadFailed" class="ds-notice ds-notice--danger">
      无法加载该应用，请返回列表后重试。
    </div>

    <template v-else-if="app">
      <!-- :key 随实体 ID 变化，强制重建分区组件，避免复用时残留上一个实体的表单状态 -->
      <div :key="oauthId" v-loading="loading">
        <SettingsTab v-if="active === 'settings'" :app="app" @refresh="loadDetail" />
        <PlatformsTab v-else-if="active === 'platforms'" :oauth-id="app.oauthId" />
        <DeveloperTab v-else-if="active === 'developer'" :app="app" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { ElMessage } from "element-plus"
import { getOAuthAppDetailApi } from "@/api/oauth"
import type { IOAuthAppInfo } from "@/types/api/oauth"
import TabNav from "@/pages/digitals/components/tabNav.vue"
import SettingsTab from "./tabs/settingsTab.vue"
import PlatformsTab from "./tabs/platformsTab.vue"
import DeveloperTab from "./tabs/developerTab.vue"

export default defineComponent({
  name: "OAuthDetailPage",
  components: { TabNav, SettingsTab, PlatformsTab, DeveloperTab },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const oauthId = computed(() => String(route.params.oauthId || ""))
    const loading = ref(false)
    const loadFailed = ref(false)
    const app = ref<IOAuthAppInfo | null>(null)

    const tabs = [
      { key: "settings", label: "设置" },
      { key: "platforms", label: "端配置" },
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

    function errorMessage(err: unknown, fallback: string): string {
      if (err instanceof Error && err.message) return err.message
      if (err && typeof err === "object" && "msg" in err) {
        return String((err as { msg?: string }).msg || fallback)
      }
      return fallback
    }

    async function loadDetail() {
      const id = oauthId.value
      if (!id) {
        loadFailed.value = true
        return
      }
      loading.value = true
      loadFailed.value = false
      try {
        const res = await getOAuthAppDetailApi({ oauthId: id })
        const info = res?.result?.app
        if (!info) throw new Error("应用不存在")
        app.value = info
        route.meta.entityName = info.name
      } catch (err) {
        loadFailed.value = true
        ElMessage.error(errorMessage(err, "加载应用详情失败"))
      } finally {
        loading.value = false
      }
    }

    // 详情页组件在 :oauthId 变化时会复用，必须重新拉取，避免显示上一个应用的数据。
    watch(oauthId, (id, previous) => {
      if (id && id !== previous) loadDetail()
    })

    onMounted(loadDetail)

    return { oauthId, loading, loadFailed, app, tabs, active, select, loadDetail }
  }
})
</script>
