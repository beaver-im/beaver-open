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
-->

<template>
  <div>
    <div class="orch-mode">
      <div class="orch-mode__head">
        <span class="orch-mode__label">编排方式</span>
        <el-select
          v-model="localMode"
          :loading="switching"
          class="orch-mode__select"
          @change="onModeChange"
        >
          <el-option
            v-for="option in MODE_OPTIONS"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <span class="orch-mode__lock">随时可切换，已有配置不会被删除</span>
      </div>
      <p v-if="currentDesc" class="orch-mode__desc">{{ currentDesc }}</p>
    </div>

    <PromptEditor v-if="localMode === 'prompt'" />
    <LongConnectionEditor v-else-if="localMode === 'longconnect'" />

    <!-- 编排分区的保存入口：改动只在点击「保存」后落库，不再随输入静默提交。
         草稿态由顶部「创建智能体」统一创建+保存，这里不重复暴露按钮。 -->
    <div v-if="!isNew && localMode === 'prompt'" class="orch-save">
      <span class="orch-save__hint">改动在点击保存后生效</span>
      <el-button type="primary" :loading="saving" @click="onSave">保存编排</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, watch, defineComponent } from "vue"
import { useDigitalWorkspace, type DigitalMode } from "../workspace"
import PromptEditor from "./orchestration/promptEditor.vue"
import LongConnectionEditor from "./orchestration/longConnectionEditor.vue"

export default defineComponent({
  name: "OrchestrationTab",
  components: { PromptEditor, LongConnectionEditor },
  setup() {
    const ws = useDigitalWorkspace()
    const switching = ref(false)

    const MODE_OPTIONS: { value: DigitalMode; label: string; desc: string }[] = [
      { value: "prompt", label: "提示词编排", desc: "平台托管运行，在这里配置人设、模型、工具与知识源。" },
      { value: "longconnect", label: "长链接接入", desc: "你自己的服务通过长连接（WebSocket）接入，平台只签发凭据并转发消息。" },
      { value: "workflow", label: "工作流编排", desc: "" }
    ]

    /**
     * 下方面板由本地 mode 驱动：选择后立刻换内容，再等服务端落库。
     * 直接用 ws.mode 的话，切换要等一次「更新 + 重新拉详情」的往返，中途看起来像没生效。
     */
    const localMode = ref<DigitalMode>(ws.mode.value)
    watch(ws.mode, value => { localMode.value = value })

    const currentDesc = computed(() => MODE_OPTIONS.find(item => item.value === localMode.value)?.desc || "")

    const onModeChange = async (value: DigitalMode) => {
      if (value === ws.mode.value) return
      const previous = ws.mode.value
      localMode.value = value
      switching.value = true
      try {
        const ok = await ws.switchMode(value)
        if (!ok) localMode.value = previous
      } finally {
        switching.value = false
      }
    }

    const isNew = ws.isNew
    // config.saving 是 Ref，模板里需要解包后的布尔值
    const saving = ws.config.saving
    const onSave = async () => { await ws.saveConfig() }
    return {
      ws, switching, MODE_OPTIONS, localMode, currentDesc, onModeChange, isNew, saving, onSave,
      computed, ref, watch,
      useDigitalWorkspace, PromptEditor, LongConnectionEditor
    }
  }
})
</script>

<style lang="less" scoped>
.orch-mode {
  padding: var(--ds-space-4) var(--ds-space-5);
  margin-bottom: var(--ds-space-5);
  background: var(--ds-fill-soft);
  border: 1px solid var(--ds-border-light);
  border-radius: var(--ds-radius-lg);

  &__head {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--ds-space-3);
  }

  &__label {
    font-size: var(--ds-fs-14);
    font-weight: var(--ds-weight-medium);
    color: var(--ds-neutral-900);
  }

  &__select {
    width: 200px;
  }

  &__lock {
    font-size: var(--ds-fs-12);
    color: var(--ds-neutral-500);
  }

  &__desc {
    margin: var(--ds-space-2) 0 0;
    font-size: var(--ds-fs-13);
    line-height: var(--ds-lh-body);
    color: var(--ds-neutral-600);
  }
}

.orch-save {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--ds-space-3);
  padding: var(--ds-space-3) var(--ds-space-5);
  background: var(--ds-neutral-0);
  border: 1px solid var(--ds-border-light);
  border-radius: var(--ds-radius-md);

  &__hint {
    font-size: var(--ds-fs-12);
    color: var(--ds-neutral-500);
  }
}
</style>
