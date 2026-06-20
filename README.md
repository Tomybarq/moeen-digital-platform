<div align="center">

<img src="https://img.shields.io/badge/Platform-Moeen_Cloud_Engine-0D9488?style=for-the-badge" />
<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" />
<img src="https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css" />
<img src="https://img.shields.io/badge/Architecture-Enterprise_SaaS-475569?style=for-the-badge" />
<img src="https://img.shields.io/badge/Language-Arabic_RTL-F97316?style=for-the-badge" />

# 🌟 Moeen Digital Platform — منصة معين الرقمية

> An intelligent, multi-tenant digital platform designed to connect charitable organizations, beneficiaries, and marketers — powered by proprietary AI and built for scale.

</div>

---

## 📌 Overview

**Mo'een Digital Platform** is an enterprise-grade SaaS web application engineered specifically for the Saudi non-profit sector. It provides a robust, highly secure environment for managing social cases, automating field research data, and generating AI-driven marketing kits.

The architecture is strictly decoupled, leveraging our proprietary **Moeen Cloud Engine** to ensure high-performance data delivery, strict PDPL compliance, and seamless multi-tenancy across various NGOs.

---

## 🏗️ Architecture & Tech Stack

This platform was architected using cutting-edge local development environments and built for maximum scalability and data privacy.

| Layer | Technology Used |
|-------|-----------------|
| **Frontend Framework** | React 18 + Vite |
| **Development Tools** | VS Code Dev Tools, Antigravity CLI |
| **UI/UX System** | Custom shadcn/ui components, Tailwind CSS (100% RTL), Framer Motion |
| **Backend Infrastructure** | **Moeen Cloud Engine** (Proprietary RESTful API & Cloud Architecture) |
| **State & Cache Management** | TanStack Query (Optimized for 3000+ dynamic records) |
| **Data Adapter** | `MoeenCloudAdapter` (Abstracted Service Layer) |

---

## ✨ Key Enterprise Features

### 🏢 Secure Multi-Tenancy (RLS)
- Strict Row-Level Security enforced at the cloud engine layer.
- Total data isolation between hosted NGOs to comply with Saudi data privacy regulations (PDPL).

### 👥 Advanced RBAC (Role-Based Access Control)

| Role | Access Level |
|------|-------------|
| **Super Admin** | Absolute platform control and tenant management |
| **NGO Manager** | Full operational control within their specific organization |
| **Researcher** | Creator-scoped permissions for field data entry and beneficiary tracking |
| **Marketer** | Read-only access to approved cases with AI marketing kit generation |
| **PDO (Privacy Data Officer)** | Unrestricted audit access and total deletion rights for compliance |

### 🚀 AI-Driven Marketing Automation
- Seamlessly converts complex social research data into highly emotional, privacy-compliant WhatsApp marketing kits in under 3 seconds.

---

## 🚀 Quick Start for Developers

### Prerequisites
- Node.js 18+
- Active access credentials for **Moeen Cloud Engine**

### Local Setup

```bash
# 1. Install precise dependencies
npm install

# 2. Configure environment variables (.env.local)
VITE_MOEEN_WORKSPACE_ID=your_workspace_id
VITE_MOEEN_CLOUD_ENDPOINT=https://api.moeen.cloud/v1

# 3. Start local development server
npm run dev
```

---

## 🔒 Security & Performance Policies

- **Caching:** The application employs aggressive local caching (5-minute stale times) to minimize redundant API calls, guaranteeing zero performance lag even with over 3,000 active beneficiary records.
- **Data Fetching:** Direct database access is strictly prohibited. All data queries MUST pass through the `MoeenCloudAdapter` and `coreClient`.

---

## 📁 Project Structure

```
moeen-digital-platform/
├── src/
│   ├── adapters/             # MoeenCloudAdapter — proprietary API bridge
│   ├── api/                  # coreClient.js — unified API instance
│   ├── components/
│   │   ├── dashboard/        # KPI cards, charts, real-time widgets
│   │   ├── beneficiaries/    # Full case lifecycle management
│   │   ├── ngos/             # NGO directory & contribution tracking
│   │   ├── marketers/        # AI marketing kit generation
│   │   ├── researcher/       # Multi-step case submission wizard
│   │   ├── auth/             # Role-based access components
│   │   └── layout/           # Sidebar, TopBar, AppLayout
│   ├── context/              # AuthContext (MoeenCloudAdapter-backed)
│   ├── lib/                  # TanStack Query client with cache config
│   ├── pages/                # Route-level page components
│   └── services/             # Domain services (BeneficiaryService, etc.)
├── public/                   # Static assets
└── src/README.md             # Technical architecture guide for developers
```

---

## 🌍 Localization

The platform is built **100% RTL** for Arabic with bilingual support across all modules.

---

## 📄 License & Ownership

This system architecture, frontend codebase, and proprietary cloud integrations are the exclusive intellectual property of **Moeen Digital & Commercials Foundation (مؤسسة معين الرقمية التجارية)**.

---

**Architected & Engineered By:**
**Eng. Mohamed Munibari**
*Technology & Development Department*

© 2026 Moeen Digital. All rights reserved.
