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

// 群通知机器人：一级实体，对应服务端 open_bot 表。
// Token 与签名密钥仅存哈希，明文只在创建 / 重置时返回一次，详情接口不返回。

export type BotVisibility = "private" | "partial" | "public"

export interface IBotInfo {
  botId: string
  /** IM 工号 B100000；空/缺省 = 未申请。加好友、拉群用的是这个，不是 botId */
  userId?: string
  name: string
  avatar?: string
  description?: string
  visibility: BotVisibility
  /** 1 已发布 / 2 未发布。新建默认未发布（草稿），发布后才对 IM 侧生效 */
  status: number
  webhookUrl: string
  adminIds?: string[]
  viewerIds?: string[]
  createdAt: number
}

export interface ICreateBotReq {
  name: string
  description?: string
  avatar?: string
  visibility?: BotVisibility
}
export interface ICreateBotRes {
  botId: string
  webhookUrl: string
  token: string
  secret: string
}

export interface IListBotReq {
  page?: number
  pageSize?: number
}
export interface IListBotRes {
  total: number
  list: IBotInfo[]
}

export interface IGetBotDetailReq {
  botId: string
}
export interface IGetBotDetailRes {
  bot: IBotInfo
}

/** 手动申请工号（创建 IM 用户），幂等：已申请直接返回现有工号 */
export interface IApplyBotWorkIdReq {
  botId: string
}
export interface IApplyBotWorkIdRes {
  botId: string
  userId: string
}

/** 发布 / 取消发布：status 1 已发布 2 未发布 */
export interface ISetBotStatusReq {
  botId: string
  status: number
}
export interface ISetBotStatusRes {
  status: number
}

export interface IUpdateBotReq {
  botId: string
  name?: string
  avatar?: string
  description?: string
  visibility?: BotVisibility
}
export interface IUpdateBotRes {}

export interface IDeleteBotReq {
  botId: string
}
export interface IDeleteBotRes {}

export interface IResetBotSecretReq {
  botId: string
}
export interface IResetBotSecretRes {
  secret: string
}

export interface ISetBotMembersReq {
  botId: string
  userIds: string[]
}
export interface ISetBotMembersRes {}
