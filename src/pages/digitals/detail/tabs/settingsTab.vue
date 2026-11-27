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

  设置分区：图标 & 名称 / 描述 / 工号（IM user_id，手动申请，只读） / 管理员 / 可见范围 / 已选人员。
  - 头像是一个 file input：点一下选图，上传后把 URL 写进 draft.avatar，随「保存」一起提交；
  - 可见范围改成下拉框（非公开 / 公开 / 部分公开），下面跟一行当前口径说明；
  - 「已选人员」对应 viewerIds，点「添加」打开选择人员面板，只在「部分公开」时可添加。
-->

<template>
  <div v-if="isNew" class="ds-notice ds-notice--brand">
    <span>智能体还没有创建。回到列表用「创建智能体」保存后，这里才能配置管理员与可见范围。</span>
  </div>

  <FormCard v-else title="基本信息">
    <el-form label-width="88px" class="ds-form" @submit.prevent>
      <el-form-item label="图标 / 名称" required>
        <div class="identity">
          <button
            type="button"
            class="identity__avatar"
            title="点击更换头像"
            :disabled="uploadingAvatar"
            @click="pickAvatar"
          >
            <img v-if="draft.avatar" :src="draft.avatar" alt="">
            <template v-else>{{ (draft.name || "?").slice(0, 1) }}</template>
            <span class="identity__mask">
              <el-icon v-if="uploadingAvatar" class="is-loading"><Loading /></el-icon>
              <el-icon v-else><Camera /></el-icon>
            </span>
          </button>
          <input
            ref="avatarInputRef"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            class="identity__file"
            @change="onAvatarChange"
          >
          <el-input
            v-model="draft.name"
            maxlength="50"
            show-word-limit
            placeholder="例如：售后助手"
            class="identity__name"
          />
        </div>
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="draft.description"
          type="textarea"
          :rows="3"
          maxlength="512"
          show-word-limit
          placeholder="一句话说明这个智能体负责什么，会显示在列表卡片上"
        />
      </el-form-item>

      <el-form-item label="工号">
        <div class="workid">
          <template v-if="workId">
            <span class="workid__value">{{ workId }}</span>
            <span class="workid__hint">工号即数字伙伴的 user_id，可用于加好友搜索</span>
          </template>
          <template v-else>
            <span class="workid__empty">未申请</span>
            <span class="workid__hint">申请后成为 IM 数字伙伴，可被搜索、加好友、入群对话</span>
            <el-button
              type="primary"
              size="small"
              :loading="applyingWorkId"
              @click="onApplyWorkId"
            >
              申请工号
            </el-button>
          </template>
        </div>
      </el-form-item>

      <el-form-item label="管理员">
        <IdTagsEditor
          v-model="admins"
          placeholder="输入管理员用户 ID 后回车添加"
          hint="管理员可以修改编排、知识源、工具与成员设置。"
        />
      </el-form-item>

      <el-form-item label="可见范围">
        <div class="vis">
          <el-select v-model="draft.visibility" class="vis__select">
            <el-option
              v-for="item in VISIBILITY_CHOICES"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <p class="vis__desc">
            {{ visibilityDesc }}
          </p>
        </div>
      </el-form-item>

      <el-form-item label="已选人员">
        <div class="members">
          <div v-if="viewers.length" class="members__chips">
            <el-tag
              v-for="id in viewers"
              :key="id"
              closable
              :disable-transitions="true"
              @close="removeViewer(id)"
            >
              {{ id }}
            </el-tag>
          </div>
          <span v-else class="members__empty">暂未选择</span>
          <el-button
            :icon="Plus"
            :disabled="draft.visibility !== 'partial'"
            title="仅「部分公开」时可添加人员"
            @click="memberPickerVisible = true"
          >
            添加
          </el-button>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="danger" plain :loading="deleting" @click="removeDigital">删除数字伙伴</el-button>
      <span class="foot-spacer" />
      <el-button type="primary" :loading="saving" @click="saveAll">保存</el-button>
    </template>
  </FormCard>

  <MemberPickerDialog
    v-model="memberPickerVisible"
    :member-ids="viewers"
    @confirm="onMembersPicked"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue"
import { useRouter } from "vue-router"
import { ElMessage, ElMessageBox } from "element-plus"
import { Camera, Loading, Plus } from "@element-plus/icons-vue"
import {
  applyWorkIdApi,
  deleteDigitalApi,
  setDigitalAdminsApi,
  setDigitalViewersApi,
  updateDigitalApi
} from "@/api/digital"
import { uploadImageFileApi } from "@/api/im"
import FormCard from "@/pages/digitals/components/formCard.vue"
import IdTagsEditor from "@/pages/digitals/components/idTagsEditor.vue"
import MemberPickerDialog from "@/pages/digitals/components/memberPickerDialog.vue"
import { useDigitalWorkspace } from "../workspace"

export default defineComponent({
  name: "DigitalsSettingsTab",
  components: { FormCard, IdTagsEditor, MemberPickerDialog, Camera, Loading },
  setup() {
    const ws = useDigitalWorkspace()
    const { isNew, draft, digital, digitalId } = ws
    const router = useRouter()

    const saving = ref(false)
    const deleting = ref(false)
    const applyingWorkId = ref(false)
    const uploadingAvatar = ref(false)
    const avatarInputRef = ref<HTMLInputElement>()
    const memberPickerVisible = ref(false)

    const admins = ref<string[]>([...(digital.value?.adminIds ?? [])])
    const viewers = ref<string[]>([...(digital.value?.viewerIds ?? [])])

    /** 可见范围口径（服务端 oneof=private public partial） */
    const VISIBILITY_CHOICES = [
      { value: "private", label: "非公开", desc: "仅管理员可搜索和使用" },
      { value: "public", label: "公开", desc: "全站可搜索、可被拉入会话" },
      { value: "partial", label: "部分公开", desc: "仅已选人员可搜索和使用" }
    ] as const

    const visibilityDesc = computed(
      () => VISIBILITY_CHOICES.find(item => item.value === draft.visibility)?.desc ?? ""
    )

    /** 工号 = IM user_id，未申请时为空。digitalId 是平台 UUID，不再当工号展示。 */
    const workId = computed(() => digital.value?.userId ?? "")

    async function onApplyWorkId() {
      if (applyingWorkId.value) return
      applyingWorkId.value = true
      try {
        const res = await applyWorkIdApi({ digitalId: digitalId.value })
        if (res.code !== 0) throw new Error(res.msg || "申请失败")
        ElMessage.success(`工号已申请：${res.result?.userId ?? ""}`)
        await ws.refresh()
      } catch (err) {
        ElMessage.error(errorMessage(err, "申请工号失败"))
      } finally {
        applyingWorkId.value = false
      }
    }

    function errorMessage(err: unknown, fallback: string): string {
      if (err instanceof Error && err.message) return err.message
      if (err && typeof err === "object" && "msg" in err) {
        return String((err as { msg?: string }).msg || fallback)
      }
      return fallback
    }

    const MAX_AVATAR_BYTES = 2 * 1024 * 1024

    function pickAvatar() {
      if (uploadingAvatar.value) return
      avatarInputRef.value?.click()
    }

    async function onAvatarChange(ev: Event) {
      const input = ev.target as HTMLInputElement
      const file = input.files?.[0]
      input.value = ""
      if (!file) return
      if (!file.type.startsWith("image/")) {
        ElMessage.warning("请选择图片文件")
        return
      }
      if (file.size > MAX_AVATAR_BYTES) {
        ElMessage.warning("图片不能超过 2MB")
        return
      }
      uploadingAvatar.value = true
      try {
        const res = await uploadImageFileApi(file)
        draft.avatar = res.fileUrl
        ElMessage.success("头像已更新，保存后生效")
      } catch (err) {
        ElMessage.error(errorMessage(err, "头像上传失败"))
      } finally {
        uploadingAvatar.value = false
      }
    }

    function removeViewer(id: string) {
      viewers.value = viewers.value.filter(item => item !== id)
    }

    function onMembersPicked(ids: string[]) {
      viewers.value = ids
    }

    /**
     * 一次保存：基础信息 + 可见人 + 管理员。
     * 三个接口分开调（服务端就是这样拆的），任一失败即中止并提示，避免半保存。
     * 工号（IM user_id）由用户在上方手动「申请工号」生成，不随这里保存；digitalId 是平台 UUID。
     */
    async function saveAll() {
      const name = draft.name.trim()
      if (name.length < 2 || name.length > 50) {
        ElMessage.warning("名称需 2-50 个字符")
        return
      }
      saving.value = true
      try {
        const res = await updateDigitalApi({
          digitalId: digitalId.value,
          name,
          description: draft.description.trim(),
          avatar: draft.avatar.trim(),
          visibility: draft.visibility
        })
        if (res.code !== 0) throw new Error(res.msg || "保存失败")

        if (draft.visibility === "partial") {
          const viewerRes = await setDigitalViewersApi({
            digitalId: digitalId.value,
            userIds: viewers.value
          })
          if (viewerRes.code !== 0) throw new Error(viewerRes.msg || "保存可见人失败")
        }
        const adminRes = await setDigitalAdminsApi({
          digitalId: digitalId.value,
          userIds: admins.value
        })
        if (adminRes.code !== 0) throw new Error(adminRes.msg || "保存管理员失败")

        ElMessage.success("已保存")
        await ws.refresh()
        admins.value = [...(digital.value?.adminIds ?? [])]
        viewers.value = [...(digital.value?.viewerIds ?? [])]
      } catch (err) {
        ElMessage.error(errorMessage(err, "保存失败"))
      } finally {
        saving.value = false
      }
    }

    async function removeDigital() {
      try {
        await ElMessageBox.confirm(
          `删除后「${digital.value?.name || draft.name}」立即从 IM 中消失，历史会话保留但不可再对话。此操作不可撤销，确认删除？`,
          "删除数字伙伴",
          { type: "warning", confirmButtonText: "确认删除", cancelButtonText: "取消" }
        )
      } catch {
        return
      }
      deleting.value = true
      try {
        const res = await deleteDigitalApi({ digitalId: digitalId.value })
        if (res.code !== 0) throw new Error(res.msg || "删除失败")
        ElMessage.success("已删除")
        router.push("/robot/digitals")
      } catch (err) {
        ElMessage.error(errorMessage(err, "删除失败"))
      } finally {
        deleting.value = false
      }
    }

    return {
      isNew, draft, admins, viewers, saving, deleting, applyingWorkId, uploadingAvatar,
      avatarInputRef, memberPickerVisible, visibilityDesc, workId, VISIBILITY_CHOICES,
      Plus, pickAvatar, onAvatarChange, onApplyWorkId, removeViewer, onMembersPicked,
      saveAll, removeDigital
    }
  }
})
</script>

<style scoped lang="less">
.identity {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  width: 100%;

  &__avatar {
    position: relative;
    flex: 0 0 auto;
    width: 52px;
    height: 52px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    border: 1px solid var(--ds-border);
    background: var(--ds-neutral-50);
    font-size: 20px;
    font-weight: var(--ds-weight-bold);
    color: var(--ds-neutral-600);
    overflow: hidden;
    cursor: pointer;

    img { width: 100%; height: 100%; object-fit: cover; }

    &:hover .identity__mask { opacity: 1; }
    &:disabled { cursor: progress; }
  }

  &__mask {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #fff;
    background: rgb(0 0 0 / 45%);
    opacity: 0;
    transition: opacity 0.15s;

    .identity__avatar:disabled & { opacity: 1; }
  }

  &__file { display: none; }

  &__name { flex: 1 1 auto; max-width: 320px; }
}

.workid {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  width: 100%;

  &__value {
    min-width: 180px;
    padding: 0 12px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    border-radius: var(--ds-radius-md);
    border: 1px solid var(--ds-border);
    background: var(--ds-neutral-50);
    font-family: ui-monospace, "Cascadia Code", monospace;
    font-size: var(--ds-fs-14);
    color: var(--ds-neutral-900);
  }

  &__empty {
    min-width: 180px;
    padding: 0 12px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    border-radius: var(--ds-radius-md);
    border: 1px dashed var(--ds-border);
    background: var(--ds-neutral-50);
    font-size: var(--ds-fs-13);
    color: var(--ds-neutral-500);
  }

  &__hint {
    font-size: var(--ds-fs-12);
    color: var(--ds-neutral-500);
  }
}

.vis {
  width: 100%;

  &__select { width: 240px; }

  &__desc {
    margin: 6px 0 0;
    font-size: var(--ds-fs-13);
    color: var(--ds-neutral-600);
  }
}

.members {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--ds-space-3);
  width: 100%;

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__empty {
    font-size: var(--ds-fs-13);
    color: var(--ds-neutral-600);
  }
}

.foot-spacer { flex: 1 1 auto; }

@media (max-width: 767px) {
  .identity { flex-wrap: wrap; }
  .identity__name { max-width: none; flex: 1 1 100%; }
}
</style>
