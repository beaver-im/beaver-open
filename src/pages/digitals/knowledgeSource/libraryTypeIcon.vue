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

  知识源文档类型图标：word / excel / faq。
  图标本体是 src/assets/icons/libraryType{Word,Excel,Faq}.svg 静态资源，模板只用 img 引用，不内联 SVG。
-->

<template>
  <img
    class="lib-type-icon"
    :src="iconSrc"
    :width="size"
    :height="size"
    :alt="`${type} 文档`"
  >
</template>

<script lang="ts">
import { computed, defineComponent, type PropType } from "vue"
import wordIcon from "@/assets/icons/libraryTypeWord.svg"
import excelIcon from "@/assets/icons/libraryTypeExcel.svg"
import faqIcon from "@/assets/icons/libraryTypeFaq.svg"

type IconType = "word" | "excel" | "faq"

const ICON_SRC: Record<IconType, string> = {
  word: wordIcon,
  excel: excelIcon,
  faq: faqIcon
}

export default defineComponent({
  name: "LibraryTypeIcon",
  props: {
    type: { type: String as PropType<IconType>, default: "word" },
    size: { type: Number, default: 22 }
  },
  setup(props) {
    const iconSrc = computed(() => ICON_SRC[props.type] ?? ICON_SRC.word)

    return { iconSrc }
  }
})
</script>

<style scoped lang="less">
.lib-type-icon {
  display: inline-block;
  flex-shrink: 0;
  vertical-align: middle;
}
</style>
