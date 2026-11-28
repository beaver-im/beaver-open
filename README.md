# 🦫 Beaver Open - 海狸开放平台

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-3.0.4-blue.svg)](VERSION)
[![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.x-blue.svg)](https://element-plus.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![QQ群](https://img.shields.io/badge/QQ群-1013328597%2B-blue.svg)](https://qm.qq.com/q/82rbf7QBzO)

> 🚀 **海狸 IM 开放平台门户** - 基于 Vue 3 + Element Plus + TypeScript 构建的可选开发者门户，配合后端开放平台拓展服务（`beaver-server-open`）为第三方开发者提供应用管理、API 接入与 Webhook 配置能力

> 💡 **架构定位说明**：`beaver-server` 与核心客户端（`beaver-flutter` / `beaver-desktop`）自身即可构成完整的 IM 基础闭环；本仓库属于配套开放平台的可选开发者门户，不部署本仓库与开放平台扩展服务，核心即时通讯仍可独立正常运行。

**当前版本：[3.0.4](VERSION)**（以仓库根目录 [`VERSION`](VERSION) 文件为准，与 `package.json` 同步）

[English](README_EN.md) | [中文](README.md)

---

## ✨ 核心特性

- 🧩 **应用管理** - 创建应用、管理 AppID / AppSecret、应用状态控制
- 📊 **数据统计** - API 调用与 Webhook 推送统计
- 🔔 **Webhook 管理** - 事件订阅与推送日志查看
- 📖 **API 文档** - 开放平台接口说明
- 📦 **SDK 下载** - 多语言 SDK 获取入口
- 🎨 **现代化 UI** - 面向开发者的开放平台门户体验

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **Vue.js** | 3.5+ | 渐进式前端框架 |
| **TypeScript** | 5.8+ | 类型安全 |
| **Element Plus** | 2.10+ | Vue 3 组件库 |
| **Vite** | 7.0+ | 下一代前端构建工具 |
| **Pinia** | 3.0+ | Vue 状态管理 |
| **Vue Router** | 4.5+ | 官方路由管理器 |
| **Axios** | 1.10+ | HTTP 客户端 |

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0

### 安装步骤
```bash
# 克隆项目
git clone https://github.com/beaver-im/beaver-open.git
cd beaver-open

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build_prod

# 测试环境构建
npm run build_test
```

### 环境配置
1. 创建 `.env.development` 文件（开发环境）
2. 创建 `.env.test` 文件（测试环境）
3. 创建 `.env.production` 文件（生产环境）

## 🔗 相关项目

### 核心闭环（可独立完成即时通讯）

| 项目 | 仓库地址 | 说明 |
|------|----------|------|
| **beaver-server** | [GitHub](https://github.com/beaver-im/beaver-server) \| [Gitee](https://gitee.com/dawwdadfrf/beaver-server) | 核心后端微服务（可独立运行完整 IM 闭环） |
| **beaver-flutter** | [GitHub](https://github.com/beaver-im/beaver-flutter) \| [Gitee](https://gitee.com/dawwdadfrf/beaver-flutter) | 核心移动端（Flutter，推荐） |
| **beaver-desktop** | [GitHub](https://github.com/beaver-im/beaver-desktop) \| [Gitee](https://gitee.com/dawwdadfrf/beaver-desktop) | 核心桌面端（Electron） |

### 可选增值服务与生态组件（按需部署，不影响核心 IM）

| 项目 | 仓库地址 | 说明 |
|------|----------|------|
| **beaver-server-package** | [GitHub](https://github.com/beaver-im) | 后端独立增值服务集合（`ai` / `backend` / `call` / `observability` / `online` / `open` / `social`） |
| **beaver-desktop-package** | [GitHub](https://github.com/beaver-im) | 桌面端独立可选能力包集合（`beaver-desktop-ai` / `beaver-desktop-online`） |
| **beaver-manager** | [GitHub](https://github.com/beaver-im/beaver-manager) \| [Gitee](https://gitee.com/dawwdadfrf/beaver-manager) | 后台管理系统（配套 `beaver-server-backend`） |
| **beaver-open** | [GitHub](https://github.com/beaver-im/beaver-open) \| [Gitee](https://gitee.com/dawwdadfrf/beaver-open) | 开放平台门户（本仓库，配套 `beaver-server-open`） |
| **beaver-oauth** | [GitHub](https://github.com/beaver-im/beaver-oauth) \| [Gitee](https://gitee.com/dawwdadfrf/beaver-oauth) | OAuth 授权登录门户（配套 `beaver-server-open`） |
| **beaver-sdk** | [GitHub](https://github.com/beaver-im/beaver-sdk) | OpenClaw / JS SDK（可选开发集成套件） |
| **beaver-docs** | [GitHub](https://github.com/beaver-im/beaver-docs) \| [Gitee](https://gitee.com/dawwdadfrf/beaver-docs) | 官方文档与部署指南 |

## 📚 文档与帮助

- 📖 **详细文档**: [Beaver IM 文档](https://wsrh8888.github.io/beaver-docs/)
- 🎥 **视频教程**: [B站教程](https://www.bilibili.com/video/BV1HrrKYeEB4/)
- 💬 **QQ群**:
  - [1013328597](https://qm.qq.com/q/82rbf7QBzO) - 群一
  - [1044762885](https://qm.qq.com/q/82rbf7QBzO) - 群二
  - [1003121259](https://qm.qq.com/q/82rbf7QBzO) - 群三

## 🤝 贡献指南

我们欢迎所有形式的贡献！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## ⭐ 支持项目

如果这个项目对你有帮助，请给我们一个 ⭐ Star！

## 📄 开源协议与免责声明

本项目基于 [MIT](LICENSE) 协议开源，详见 [LICENSE](LICENSE)。

**使用要点（摘要）：**

- 闭源自用商用、二次开源均可免费，但须保留根目录 `LICENSE`，上线前端须有「关于」署名（基于海狸 IM + 仓库地址）
- 闭源交付第三方、去掉署名、对外 SaaS 收费等，请采购商业授权（书面合同）
- 无论是否付费，**不得删除或篡改 `LICENSE`**

完整免责与署名要求：[LEGAL.md](LEGAL.md)  
商业授权产品线与报价：[版权与商业授权](https://wsrh8888.github.io/beaver-docs/community/license.html)  
联系：[751135385@qq.com](mailto:751135385@qq.com)

## ⭐ Star历史

[![Star History Chart](https://api.star-history.com/svg?repos=beaver-im/beaver-open&type=Date)](https://star-history.com/#beaver-im/beaver-open&Date)

---

<div align="center">
  <strong>Made with ❤️ by Beaver IM Team</strong><br>
  <em>企业级即时通讯平台开放平台</em>
</div>
