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
 * Portal 复用的 IM 能力（用户搜索 / 头像上传 / 图片预览）。
 * 这些能力属于主站 IM，但浏览器不直连 /beaver/...：
 * 全部打开放平台 developer 面 /beaver-open/api/open/developer/v1/{action}，
 * 由 open_api 内部透传/转发到主站 account / asset。
 *
 * 门户令牌和 IM 用户令牌用同一个 Auth.AccessSecret 签发，上传接口带同一条 Token 即可。
 * 目前三处：MemberPicker 选人搜索、头像上传、图片预览。
 */

import config from "@/config/env"
import { ajax, redirectToLogin } from "@/utils/request"
import { readUserInfo } from "@/utils/storage"
import type { ILoginRes } from "@/types/auth"
import type { ISearchImUserReq, ISearchImUserRes, IUploadFileRes } from "@/types/api/im"

const base = config.baseAPI

/** 按用户 ID / 邮箱精确查一个用户 */
export function searchImUserApi(params: ISearchImUserReq) {
  return ajax<ISearchImUserRes>({
    method: "GET",
    url: `${base}/beaver-open/api/open/developer/v1/user_search`,
    params
  })
}

/**
 * 图片上传：multipart 字段名服务端固定取 "file"。
 * 这里用 fetch 而不是封装的 ajax —— axios 实例默认 Content-Type 是 application/json，
 * 传 FormData 时容易被序列化成 JSON；fetch 交给浏览器自己带 boundary 最稳。
 */
export async function uploadImageFileApi(file: File): Promise<IUploadFileRes> {
  const form = new FormData()
  form.append("file", file)
  const token = readUserInfo<ILoginRes>()?.token || ""
  const resp = await fetch(`${base}/beaver-open/api/open/developer/v1/file_upload`, {
    method: "POST",
    headers: token ? { Token: token } : undefined,
    body: form
  })
  // fetch 绕过 axios 拦截器，网关 401 必须在这里自己兜住
  if (resp.status === 401) {
    redirectToLogin()
    throw new Error("登录已失效，请重新登录")
  }
  const json = (await resp.json()) as { code: number; msg: string; result?: IUploadFileRes }
  if (json.code !== 0) throw new Error(json.msg || "图片上传失败")
  if (!json.result?.fileUrl) throw new Error("图片上传失败：服务端未返回文件地址")
  return json.result
}
