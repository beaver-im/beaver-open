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

import config from "@/config/env"
import { ajax } from "@/utils/request"
import type {
  ICreateBotReq,
  ICreateBotRes,
  IListBotReq,
  IListBotRes,
  IGetBotDetailReq,
  IGetBotDetailRes,
  IApplyBotWorkIdReq,
  IApplyBotWorkIdRes,
  ISetBotStatusReq,
  ISetBotStatusRes,
  IUpdateBotReq,
  IUpdateBotRes,
  IDeleteBotReq,
  IDeleteBotRes,
  IResetBotSecretReq,
  IResetBotSecretRes,
  ISetBotMembersReq,
  ISetBotMembersRes
} from "@/types/api/bot"

// 群通知机器人（服务端 api/bot_developer.api）
export function createBotApi(data: ICreateBotReq) {
  return ajax<ICreateBotRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/bot_create`,
    data
  })
}

export function listBotsApi(params: IListBotReq) {
  return ajax<IListBotRes>({
    method: "GET",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/bot_list`,
    params
  })
}

export function getBotDetailApi(params: IGetBotDetailReq) {
  return ajax<IGetBotDetailRes>({
    method: "GET",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/bot_detail`,
    params
  })
}

export function updateBotApi(data: IUpdateBotReq) {
  return ajax<IUpdateBotRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/bot_update`,
    data
  })
}

/** 手动申请工号（创建 IM 用户，幂等） */
export function applyBotWorkIdApi(data: IApplyBotWorkIdReq) {
  return ajax<IApplyBotWorkIdRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/bot_work_id_apply`,
    data
  })
}

/** 发布 / 取消发布：status 1 已发布 2 未发布 */
export function setBotStatusApi(data: ISetBotStatusReq) {
  return ajax<ISetBotStatusRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/bot_set_status`,
    data
  })
}

export function deleteBotApi(data: IDeleteBotReq) {
  return ajax<IDeleteBotRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/bot_delete`,
    data
  })
}

export function resetBotSecretApi(data: IResetBotSecretReq) {
  return ajax<IResetBotSecretRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/bot_reset_secret`,
    data
  })
}

export function setBotAdminsApi(data: ISetBotMembersReq) {
  return ajax<ISetBotMembersRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/bot_set_admins`,
    data
  })
}

export function setBotViewersApi(data: ISetBotMembersReq) {
  return ajax<ISetBotMembersRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/bot_set_viewers`,
    data
  })
}
