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
  ICreateDigitalReq,
  ICreateDigitalRes,
  IListDigitalReq,
  IListDigitalRes,
  IGetDigitalDetailReq,
  IGetDigitalDetailRes,
  IUpdateDigitalReq,
  IUpdateDigitalRes,
  IResetDigitalSecretReq,
  IResetDigitalSecretRes,
  ISetDigitalMembersReq,
  ISetDigitalMembersRes,
  ISetDigitalStatusReq,
  ISetDigitalStatusRes,
  IApplyWorkIdReq,
  IApplyWorkIdRes,
  IGetDigitalConfigReq,
  IGetDigitalConfigRes,
  ISaveDigitalConfigReq,
  ISaveDigitalConfigRes,
  IDeleteDigitalReq,
  IDeleteDigitalRes,
  IListDigitalCatalogRes,
  ISaveDigitalMcpReq,
  ISaveDigitalMcpRes,
  IDeleteDigitalMcpReq,
  IDeleteDigitalMcpRes
} from "@/types/api/digital"

// 数字伙伴（服务端 api/digital_developer.api）
export function createDigitalApi(data: ICreateDigitalReq) {
  return ajax<ICreateDigitalRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/digital_create`,
    data
  })
}

export function listDigitalsApi(params: IListDigitalReq) {
  return ajax<IListDigitalRes>({
    method: "GET",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/digital_list`,
    params
  })
}

export function getDigitalDetailApi(params: IGetDigitalDetailReq) {
  return ajax<IGetDigitalDetailRes>({
    method: "GET",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/digital_detail`,
    params
  })
}

export function updateDigitalApi(data: IUpdateDigitalReq) {
  return ajax<IUpdateDigitalRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/digital_update`,
    data
  })
}

export function resetDigitalSecretApi(data: IResetDigitalSecretReq) {
  return ajax<IResetDigitalSecretRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/digital_reset_secret`,
    data
  })
}

export function deleteDigitalApi(data: IDeleteDigitalReq) {
  return ajax<IDeleteDigitalRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/digital_delete`,
    data
  })
}

export function setDigitalAdminsApi(data: ISetDigitalMembersReq) {
  return ajax<ISetDigitalMembersRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/digital_set_admins`,
    data
  })
}

export function setDigitalViewersApi(data: ISetDigitalMembersReq) {
  return ajax<ISetDigitalMembersRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/digital_set_viewers`,
    data
  })
}

/** 发布 / 取消发布：status 1 已发布 2 未发布 */
export function setDigitalStatusApi(data: ISetDigitalStatusReq) {
  return ajax<ISetDigitalStatusRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/digital_set_status`,
    data
  })
}

/** 手动申请工号（创建 IM 用户，幂等） */
export function applyWorkIdApi(data: IApplyWorkIdReq) {
  return ajax<IApplyWorkIdRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/digital_work_id_apply`,
    data
  })
}

export function getDigitalConfigApi(params: IGetDigitalConfigReq) {
  return ajax<IGetDigitalConfigRes>({
    method: "GET",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/digital_config_get`,
    params
  })
}

export function saveDigitalConfigApi(data: ISaveDigitalConfigReq) {
  return ajax<ISaveDigitalConfigRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/digital_config_save`,
    data
  })
}

/* ============ 工具与 MCP 目录 ============ */

export function listDigitalCatalogApi() {
  return ajax<IListDigitalCatalogRes>({
    method: "GET",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/digital_catalog`
  })
}

export function saveDigitalMcpApi(data: ISaveDigitalMcpReq) {
  return ajax<ISaveDigitalMcpRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/digital_mcp_save`,
    data
  })
}

export function deleteDigitalMcpApi(data: IDeleteDigitalMcpReq) {
  return ajax<IDeleteDigitalMcpRes>({
    method: "POST",
    url: `${config.baseAPI}/beaver-open/api/open/developer/v1/digital_mcp_delete`,
    data
  })
}
