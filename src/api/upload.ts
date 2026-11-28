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
 *
 * 上传两段式（均经网关）：
 * 1) 登录面 BFF 代领 beaver:upload 短时票
 * 2) 浏览器带票打 asset file_public/upload
 */

import type { IGetUploadTokenRes, IUploadFileReq, IUploadFileRes } from "@/types/api/upload"
import config from "@/config/env"
import { ajax } from "@/utils/request"

/** 向 open BFF 代领 asset 上传能力票 */
export function getUploadTokenApi() {
  return ajax<IGetUploadTokenRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/asset/v1/upload_token`
  })
}

/** 经网关直传 asset（Bearer = uploadToken，不带登录 Token） */
export function uploadFileApi(data: IUploadFileReq, uploadToken: string) {
  const formData = new FormData()
  formData.append("file", data.file)
  formData.append("fileInfo", JSON.stringify(data.fileInfo))

  return ajax<IUploadFileRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver/api/asset/file_public/v1/upload`,
    data: formData,
    headers: {
      Authorization: `Bearer ${uploadToken}`
    }
  })
}
