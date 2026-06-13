<div align="center">

<img src="https://img.shields.io/badge/Platform-Base44-6B21A8?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTV6TTIgMTdsOSA1IDktNXYtNWwtOSA1LTktNXoiLz48L3N2Zz4=" />
<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" />
<img src="https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css" />
<img src="https://img.shields.io/badge/Status-Active-22C55E?style=for-the-badge" />
<img src="https://img.shields.io/badge/Language-Arabic_RTL-F97316?style=for-the-badge" />

# 🌟 Moeen Digital Platform — منصة معين الرقمية

### **بيت التمكين | Beit Al-Tamkeen**
> An intelligent digital platform connecting charitable organizations, beneficiaries, and field researchers — powered by AI and built for impact.

**[🚀 Live Demo](#) • [📖 Docs](#) • [🐛 Issues](https://github.com/Tomybarq/moeen-digital-platform/issues) • [💬 Contact](#contact)**

</div>

---

## 📌 Overview

**Mo'een Digital Platform** is a full-stack web application built for **Beit Al-Tamkeen** — a charity-focused organization managing social cases, NGOs, field researchers, and marketers across Yemen and Saudi Arabia.

The platform centralizes case management, automates reporting, and provides real-time dashboards for decision-makers — eliminating paperwork and manual follow-up.

---

## ✨ Key Features

### 🏠 Smart Dashboard
- Real-time KPI cards (beneficiaries, cases, NGOs, marketers)
- Interactive charts: case priority, growth trends, platform overview
- Recent activity feed with role-based filtering

### 👥 Beneficiary Management
- Full case lifecycle: submission → review → approval → closure
- Priority scoring system (urgent / high / medium / low)
- Document management with secure file uploads
- Advanced search & multi-filter support

### 🏛️ NGO Directory
- Register and manage charitable organizations
- Track NGO activity and case contributions
- Top NGOs leaderboard widget

### 🔬 Researcher Portal
- Multi-step case submission wizard
- Personal case tracking dashboard
- Field data collection forms

### 📢 Marketer Hub
- Marketer performance tracking
- Marketing kit generation tool
- Activity metrics and leaderboard

### 🔐 Role-Based Access Control
| Role | Access Level |
|------|-------------|
| `platform_admin` | Full access — all modules |
| `ngo_manager` | NGO data + assigned cases |
| `researcher` | Own cases only |
| `marketer` | Marketing module |
| `pdo` | Reports & analytics |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite |
| **UI Library** | Radix UI + shadcn/ui |
| **Styling** | Tailwind CSS (RTL) |
| **Backend** | Base44 BaaS |
| **Database** | Base44 Entities |
| **Auth** | Base44 Auth |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod |
| **Drag & Drop** | @hello-pangea/dnd |
| **Language** | Arabic (RTL) + English |

---

## 🗄️ Data Entities

```
Beneficiary   →  Social case records (family head, national ID, priority, status)
NGO           →  Charitable organizations directory
Marketer      →  Field marketers with activity tracking
User          →  Platform users with 5 role levels
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Base44 account at [base44.com](https://base44.com)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Tomybarq/moeen-digital-platform.git
cd moeen-digital-platform

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
```

### Environment Variables

```env
VITE_BASE44_APP_ID=your_app_id_here
VITE_BASE44_APP_BASE_URL=https://your-app-name.base44.app
```

### Run Locally

```bash
npm run dev
# App running at → http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
moeen-digital-platform/
├── src/
│   ├── components/
│   │   ├── dashboard/        # KPI cards, charts, widgets
│   │   ├── beneficiaries/    # Case management components
│   │   ├── ngos/             # NGO directory components
│   │   ├── marketers/        # Marketer hub components
│   │   ├── researcher/       # Case wizard & submission
│   │   ├── auth/             # Auth & role components
│   │   └── layout/           # Sidebar, TopBar, AppLayout
│   ├── pages/                # Route-level page components
│   ├── api/                  # Base44 SDK client
│   └── App.jsx               # Root app with routing
├── base44/
│   ├── entities/             # Data model definitions
│   └── config.jsonc          # App configuration
└── public/                   # Static assets
```

---

## 🌍 Localization

The platform is built **100% RTL** for Arabic with bilingual support:

```jsx
// All layouts use dir="rtl"
// Tailwind RTL utilities applied throughout
// Arabic-first content with English fallback
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'feat: add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is proprietary software owned by **Mueen Digital (مؤسسة معين الرقمية)**.
All rights reserved © 2026.

---

## 📞 Contact

**Developer:** Mohamed Talal Munibari
**Role:** Technology & Development Manager
**Organization:** Ghazara for Trade & Marketing
**Email:** tech@ghazara.net

**Platform Owner:** Mueen Digital Institution
**Contact:** info@tamkeen.sa

---

<div align="center">

Built with ❤️ using [Base44](https://base44.com) • Powered by [TomyBarq AI](https://github.com/Tomybarq)

⭐ Star this repo if you find it useful!

</div>
