# 💬 self-chat

> A minimalist, serverless, and private instant messenger built on the Edge.
> 一个基于 Cloudflare 构建的极简、私密、零成本即时通讯工具。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Deploy](https://img.shields.io/badge/deploy-Cloudflare%20Pages-orange.svg)
![Cost](https://img.shields.io/badge/cost-%240%2Fmo-green.svg)

## 📖 简介 (Introduction)

**self-chat** 是一个为个人或小团队打造的私密聊天室/备忘录。它完全运行在 Cloudflare 的边缘网络上，利用 **Pages Functions** 处理逻辑，**KV** 存储数据。

**核心设计哲学**：
*   **Privacy First**: 只有持有密码的人才能访问。
*   **Zero Cost**: 通过极致的 KV Metadata 优化，在 Cloudflare 免费额度下可实现高频使用。
*   **No Ops**: 无需服务器，无需数据库维护，推送到 Git 即可自动部署。

## ✨ 功能特性 (Features)

- **🔐 私密鉴权**: 基于 Token 的访问控制，并在本地持久化登录状态。
- **⚡️ 极速响应**: 部署在全球边缘节点，毫秒级延迟。
- **📱 设备感知**: 智能识别发送端设备（如 "iPhone Mobile", "Windows PC"），在未填昵称时自动兜底。
- **💸 极致省钱架构**: 采用 **KV Metadata** 存储方案，读取列表时不消耗 Read Ops (Get)，将数据库读取成本降低 **20倍**。
- **🔄 实时同步**: 前端自动轮询，多端消息即时同步。
- **🎨 极简 UI**: 响应式设计，完美适配桌面与移动端，包含发送状态反馈。

## 🛠 技术栈 (Tech Stack)

| 模块 | 技术/服务 | 说明 |
| :--- | :--- | :--- |
| **Frontend** | Vanilla JS + HTML5 | 无框架依赖，体积极小，加载极快 |
| **Backend** | Cloudflare Pages Functions | 也就是 Cloudflare Workers (Serverless) |
| **Database** | Cloudflare KV | 键值对存储 (利用 Metadata 存储 Payload) |
| **Deploy** | Cloudflare Pages | 自动化 CI/CD |

## 🚀 快速部署 (Quick Start)

你可以通过 Cloudflare Pages 直接部署本项目，无需购买服务器。

### 1. 准备工作
Fork 本仓库或下载代码推送到你自己的 GitHub 仓库。

### 2. 创建 KV 命名空间
在 Cloudflare Dashboard 中：
*   前往 **Workers & Pages** -> **KV**。
*   点击 **Create a namespace**。
*   命名为 `IM_KV` (建议)。

### 3. 创建 Pages 项目
*   前往 **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**。
*   选择本仓库。
*   **构建设置 (Build settings)**:
    *   **Framework preset**: `None`
    *   **Build output directory**: `public` (⚠️ 重要)

### 4. 配置环境变量与绑定
项目创建后，进入 **Settings** 进行配置：

**A. 环境变量 (Environment variables)**
设置访问密码：
*   Variable name: `SECRET_PASSWORD`
*   Value: `YourStrongPassword`

**B. 函数绑定 (Functions > KV Namespace Bindings)**
绑定数据库：
*   Variable name: `IM_KV` (⚠️ 必须完全一致)
*   KV Namespace: 选择第2步创建的 `IM_KV`

### 5. 重试部署
配置完成后，前往 **Deployments** 页面，点击最新部署右侧的 `...` -> **Retry deployment** 以使配置生效。

## 📝 环境变量说明

| 变量名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `SECRET_PASSWORD` | Environment Variable | 登录聊天室的唯一凭证 (密码) |
| `IM_KV` | KV Binding | 绑定的 Cloudflare KV 命名空间 |

## 🤝 贡献 (Contributing)

这是一个 Vibe Coding 项目 (AI-Assisted)。如果你有更好的想法（比如支持图片上传、WebSocket 改造），欢迎提交 PR！

## 📄 License

MIT License © 2025