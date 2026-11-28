# 🦫 Beaver Open - Beaver IM Open Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-3.0.4-blue.svg)](VERSION)
[![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.x-blue.svg)](https://element-plus.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![QQ Group](https://img.shields.io/badge/QQ%20Group-1013328597-blue.svg)](https://qm.qq.com/q/82rbf7QBzO)

> 🚀 **Beaver IM Open Platform Portal** - An optional developer portal built with Vue 3 + Element Plus + TypeScript, pairing with the optional open-platform backend extension (`beaver-server-open`) for third-party app management, API integration, and Webhook configuration

> 💡 **Architecture Note**: `beaver-server` and the core clients (`beaver-flutter` / `beaver-desktop`) already form a complete IM core closed loop on their own. This repository is an optional developer portal for the open-platform extension; core IM runs independently and normally without it.

**Current Version: [3.0.4](VERSION)** (see [`VERSION`](VERSION) at repository root, synced with `package.json`)

[中文](README.md) | [English](README_EN.md)

---

## ✨ Core Features

- 🧩 **App Management** - Create apps, manage AppID / AppSecret, control app status
- 📊 **Statistics** - API call and Webhook delivery analytics
- 🔔 **Webhook Management** - Event subscriptions and delivery logs
- 📖 **API Documentation** - Open platform API reference
- 📦 **SDK Downloads** - Multi-language SDK access
- 🎨 **Modern UI** - Developer-focused open platform portal

## 🛠️ Technology Stack

| Technology | Version | Description |
|------------|---------|-------------|
| **Vue.js** | 3.5+ | Progressive JavaScript Framework |
| **TypeScript** | 5.8+ | Type Safety |
| **Element Plus** | 2.10+ | Vue 3 Component Library |
| **Vite** | 7.0+ | Next Generation Frontend Build Tool |
| **Pinia** | 3.0+ | Vue State Management |
| **Vue Router** | 4.5+ | Official Routing Manager |
| **Axios** | 1.10+ | HTTP Client |

## 🚀 Quick Start

### Environment Requirements
- Node.js >= 18.0.0

### Installation Steps
```bash
# Clone the project
git clone https://github.com/beaver-im/beaver-web-open.git
cd beaver-open

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build_prod

# Build for testing
npm run build_test
```

### Environment Configuration
1. Create `.env.development` (development)
2. Create `.env.test` (testing)
3. Create `.env.production` (production)

## 🔗 Related Projects

### Core Closed Loop (Standalone Complete IM)

| Project | Repository | Description |
|---------|------------|-------------|
| **beaver-server** | [GitHub](https://github.com/beaver-im/beaver-server) \| [Gitee](https://gitee.com/dawwdadfrf/beaver-server) | Core backend microservices (standalone complete IM closed loop) |
| **beaver-flutter** | [GitHub](https://github.com/beaver-im/beaver-flutter) \| [Gitee](https://gitee.com/dawwdadfrf/beaver-flutter) | Core mobile client (Flutter, recommended) |
| **beaver-desktop** | [GitHub](https://github.com/beaver-im/beaver-desktop) \| [Gitee](https://gitee.com/dawwdadfrf/beaver-desktop) | Core desktop client (Electron) |

### Optional Value-Added Services & Ecosystem (Deploy on Demand)

| Project | Repository | Description |
|---------|------------|-------------|
| **beaver-server-package** | [GitHub](https://github.com/beaver-im) | Independent optional backend services (`ai`, `backend`, `call`, `observability`, `online`, `open`, `social`) |
| **beaver-desktop-package** | [GitHub](https://github.com/beaver-im) | Independent optional desktop capability packs (`beaver-desktop-ai`, `beaver-desktop-online`) |
| **beaver-web-manager** | [GitHub](https://github.com/beaver-im/beaver-web-manager) \| [Gitee](https://gitee.com/dawwdadfrf/beaver-web-manager) | Admin management portal (pairs with `beaver-server-backend`) |
| **beaver-web-open** | [GitHub](https://github.com/beaver-im/beaver-web-open) \| [Gitee](https://gitee.com/dawwdadfrf/beaver-web-open) | Open platform portal (this repo, pairs with `beaver-server-open`) |
| **beaver-web-oauth** | [GitHub](https://github.com/beaver-im/beaver-web-oauth) \| [Gitee](https://gitee.com/dawwdadfrf/beaver-web-oauth) | OAuth authorization portal (pairs with `beaver-server-open`) |
| **beaver-sdk** | [GitHub](https://github.com/beaver-im/beaver-sdk) | OpenClaw / JS SDK (optional developer integration suite) |
| **beaver-docs** | [GitHub](https://github.com/beaver-im/beaver-docs) \| [Gitee](https://gitee.com/dawwdadfrf/beaver-docs) | Official documentation & deployment guides |

## 📚 Documentation & Help

- 📖 **Documentation**: [Beaver IM Docs](https://wsrh8888.github.io/beaver-docs/)
- 🎥 **Video Tutorial**: [Bilibili](https://www.bilibili.com/video/BV1HrrKYeEB4/)
- 💬 **QQ Groups**:
  - [1013328597](https://qm.qq.com/q/82rbf7QBzO) - Group 1
  - [1044762885](https://qm.qq.com/q/82rbf7QBzO) - Group 2
  - [1003121259](https://qm.qq.com/q/82rbf7QBzO) - Group 3

## 🤝 Contributing

We welcome all forms of contributions!

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⭐ Support Project

If this project helps you, please give us a ⭐ Star!

## 📄 License & Legal Disclaimer

This project is licensed under the [MIT License](LICENSE) — see [LICENSE](LICENSE).

**Summary:**

- Closed-source self-use and re-open-sourcing derivatives are free if you keep the root `LICENSE` and show About attribution when deployed (Based on Beaver IM + repo link)
- Closed-source delivery to third parties, removing About, or running a paid IM SaaS requires a commercial license (written contract)
- **Do not delete or alter `LICENSE`**, whether paid or free

Full disclaimer & attribution: [LEGAL.md](LEGAL.md)  
Commercial product lines & pricing: [Copyright & Commercial Licensing](https://wsrh8888.github.io/beaver-docs/community/license.html)  
Contact: [751135385@qq.com](mailto:751135385@qq.com)

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=beaver-im/beaver-web-open&type=Date)](https://star-history.com/#beaver-im/beaver-web-open&Date)

---

<div align="center">
  <strong>Made with ❤️ by Beaver IM Team</strong><br>
  <em>Enterprise Instant Messaging Open Platform</em>
</div>
