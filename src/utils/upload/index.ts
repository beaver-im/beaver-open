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

import type { IUploadFileInfo, IUploadFileRes } from "@/types/api/upload"
import { getUploadTokenApi, uploadFileApi } from "@/api/upload"
import { getFileType, getImageAttribute } from "@/utils/tools"

/** 提前量：避免边界时刻票刚好过期 */
const TOKEN_SKEW_MS = 60_000

let cachedToken = ""
let cachedExpireAt = 0
let inflight: Promise<string> | null = null

async function ensureUploadToken(): Promise<string> {
  const now = Date.now()
  if (cachedToken && now < cachedExpireAt - TOKEN_SKEW_MS) {
    return cachedToken
  }
  if (inflight) return inflight

  inflight = (async () => {
    const res = await getUploadTokenApi()
    if (!res || res.code !== 0 || !res.result?.uploadToken) {
      throw new Error(res?.msg || "获取上传凭证失败")
    }
    const expiresIn = typeof res.result.expiresIn === "number" && res.result.expiresIn > 0
      ? res.result.expiresIn
      : 600
    cachedToken = res.result.uploadToken
    cachedExpireAt = Date.now() + expiresIn * 1000
    return cachedToken
  })()

  try {
    return await inflight
  } finally {
    inflight = null
  }
}

async function buildFileInfo(file: File): Promise<IUploadFileInfo> {
  const kind = getFileType(file.type)
  if (kind === "image") {
    const imageInfo = await getImageAttribute(file)
    return { type: "image", imageFile: imageInfo }
  }
  return { type: kind === "other" ? "other" : kind }
}

/** 统一上传：缓存 uploadToken，经网关直传 asset；成功只关心 fileUrl。 */
export async function uploadFile(file: File): Promise<IUploadFileRes> {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("请选择有效的非空文件")
  }

  const fileInfo = await buildFileInfo(file)
  const uploadToken = await ensureUploadToken()
  const response = await uploadFileApi({ file, fileInfo }, uploadToken)

  if (!response || typeof response.code !== "number") {
    throw new Error("文件上传失败：服务端响应格式错误")
  }
  if (response.code !== 0) {
    throw new Error(response.msg || "文件上传失败")
  }
  if (!response.result?.fileUrl) {
    throw new Error("文件上传失败：服务端未返回文件地址")
  }
  return response.result
}
