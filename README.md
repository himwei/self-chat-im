# 💬 self-chat

> A minimalist, private, and eco-friendly instant messenger built on Cloudflare Edge.
> 一个基于 Cloudflare 构建的极简、私密、零成本且节能的即时通讯工具。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Deploy](https://img.shields.io/badge/deploy-Cloudflare%20Pages-orange.svg)
![Cost](https://img.shields.io/badge/cost-%240%2Fmo-green.svg)

## 📖 简介 (Introduction)

**self-chat** 是一个为个人或小团队打造的私密聊天室/备忘录。它完全运行在 Cloudflare 的边缘网络上，利用 **Pages Functions** 处理逻辑，**KV** 存储数据。

**V1.3 核心理念**：
*   **Privacy First**: 只有持有密码的人才能访问。
*   **Eco Mode**: 默认关闭自动轮询，采用“按需同步”机制，极致省流。
*   **Zero Cost**: 通过 KV Metadata 优化，读取成本降低 20 倍。

## ✨ 功能特性 (Features)

### 🎨 现代交互 (UI/UX)
- **Glassmorphism Design**: 采用毛玻璃特效、圆角卡片与柔和阴影，视觉体验现代化。
- **Toast Notifications**: 优雅的顶部悬浮提示，替代传统的 alert 弹窗。
- **Smart Input**: 实时字数统计 (Counter)，临界值变色预警 + 震动反馈 (Haptic Feedback)。
- **Responsive**: 完美适配桌面端与移动端，手机端自动优化按钮布局。

### ⚡️ 核心逻辑 (Core Logic)
- **🔐 私密鉴权**: 基于 Token 的访问控制，本地持久化登录状态。
- **🌱 Eco Mode (节能模式)**: 
    - 默认**不开启**自动轮询，进入页面仅拉取一次。
    - 支持手动开启 `Auto` 模式 (5s 轮询)。
    - 发送消息后触发 **Double Check** 机制（立即刷新 + 5秒延迟刷新），确保数据一致性。
- **💸 极致省钱**: 采用 **KV Metadata** 存储方案，List 操作直接返回数据，不消耗 Get 额度。
- **📱 设备感知**: 智能识别发送端设备（如 "iPhone Mobile", "Windows PC"），未填昵称时自动兜底。

## 🛠 技术栈 (Tech Stack)

| 模块 | 技术/服务 | 说明 |
| :--- | :--- | :--- |
| **Frontend** | Vanilla JS + HTML5 + CSS3 | 无框架依赖，单文件组件，加载飞快 |
| **Backend** | Cloudflare Pages Functions | Serverless 架构 (Workers) |
| **Database** | Cloudflare KV | 键值对存储 (利用 Metadata 优化 Payload) |
| **Deploy** | Cloudflare Pages | Git 自动化 CI/CD |

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

### 5. 重试部署 (Retry)
配置完成后，前往 **Deployments** 页面，点击最新部署右侧的 `...` -> **Retry deployment** 以使环境变量和 KV 绑定生效。

## 📝 使用说明

1.  **登录**: 输入设置的 `SECRET_PASSWORD`。
2.  **发送**: 输入消息回车或点击发送。昵称选填，不填则自动显示设备名。
3.  **刷新**: 
    - **手动**: 点击顶部状态栏的 `↻` 图标。
    - **自动**: 勾选 `Auto` 复选框开启 5秒 轮询。
4.  **节能**: 默认情况下，发送完消息会自动刷新两次（立即 + 5秒后），无需手动干预。

## 🤝 贡献 (Contributing)

这是一个 **Vibe Coding** 项目 (AI-Assisted)。如果你有更好的想法，欢迎提交 PR！

## 📄 License

MIT License © 2025