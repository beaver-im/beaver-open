/**
 * Copyright (c) 2024-2026 Beaver IM Team
 * SPDX-License-Identifier: MIT
 * Project: beaver-open
 * https://github.com/wsrh8888/beaver-open
 *
 * 中文：
 * 本文件为海狸 IM（Beaver IM）开源项目源代码。
 * 版权所有 © 2024-2026 Beaver IM Team，基于 MIT 协议授权。
 * 禁止删除、篡改或替换本文件头部版权与许可声明。
 * 使用与商业授权说明：https://wsrh8888.github.io/beaver-docs/community/license.html
 *
 * English:
 * This file is part of the Beaver IM open-source project.
 * Copyright (c) 2024-2026 Beaver IM Team. Licensed under the MIT License.
 * Do not remove, alter, or replace this copyright and license header.
 * Usage & commercial licensing: https://wsrh8888.github.io/beaver-docs/community/license.html
 *
 * beaver-open-header-v1
 */

import type { ILoginRes } from "@/types/auth"
import { defineStore } from "pinia"
import { oauthLoginApi } from "@/api/auth"
import { clearUserInfo, readUserInfo, writeUserInfo } from "@/utils/storage"

export const useUserStore = defineStore("useUserStore", {
  // 登录态就是接口返回的整个对象；localStorage 只存这一个 key，不拆成 token/userId/nickName
  state: () => ({
    userInfo: readUserInfo<ILoginRes>()
  }),

  getters: {
    isLoggedIn: state => !!state.userInfo?.token,
    displayName: state => state.userInfo?.nickName || "未登录"
  },

  actions: {
    // OAuth 授权码登录：底层已统一捕获异常并返回错误信封，这里只判 code，不嵌套 try/catch
    async oauthLogin(data: { code: string }): Promise<boolean> {
      const response = await oauthLoginApi(data)
      if (response.code !== 0) return false
      this.userInfo = response.result
      writeUserInfo(response.result)
      return true
    },

    logout() {
      this.userInfo = null
      clearUserInfo()
    }
  }
})
