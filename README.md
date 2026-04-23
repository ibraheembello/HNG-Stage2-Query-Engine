# Insighta Labs - Intelligence Query Engine

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Live-success?style=for-the-badge&logo=vercel)](https://hng-stage2-query-engine.vercel.app)
[![API Docs](https://img.shields.io/badge/API-Swagger-blue?style=for-the-badge&logo=swagger)](https://hng-stage2-query-engine.vercel.app/api-docs)

A professional demographic intelligence platform featuring a rule-based Natural Language Processing (NLP) engine. Slice and query demographic data using plain English or advanced structured filters.

## ✨ Features

- **🧠 Rule-Based NL Engine**: Parse complex queries like *"young males from nigeria"* or *"females above 30"* without LLM overhead.
- **💎 Glassmorphic UI**: A stunning, responsive dashboard with parallax glowing backgrounds and smooth staggered animations.
- **🔍 Advanced Filtering**: Granular control over gender, age groups, country ISO codes, and confidence thresholds.
- **⚡ High Performance**: Built with React 19, Vite, and Prisma ORM for lightning-fast interactions and database queries.
- **📖 Interactive API Docs**: Full OpenAPI/Swagger documentation for seamless developer integration.
- **🧪 E2E Validated**: Verified with Playwright to ensure 100% reliability of the UI-to-API lifecycle.

---

## 🚀 Live Demo & Documentation

- **Interactive Dashboard**: [hng-stage2-query-engine.vercel.app](https://hng-stage2-query-engine.vercel.app)
- **Swagger API Explorer**: [/api-docs](https://hng-stage2-query-engine.vercel.app/api-docs)

---

## 🛠️ Tech Stack

### Backend
- **Node.js & TypeScript**: Type-safe server logic.
- **Express.js**: Lightweight and fast web framework.
- **Prisma ORM**: Modern database access for PostgreSQL.
- **Swagger/OpenAPI**: Automated interactive documentation.

### Frontend
- **React 19 & Vite**: The cutting edge of frontend development.
- **Tailwind CSS**: Modern utility-first styling.
- **Framer Motion**: Professional high-fidelity animations.
- **TanStack Query**: Robust server state management and caching.
- **Lucide React**: Clean and consistent iconography.

---

## 📂 Natural Language Parsing Approach

The engine uses a **Deterministic Rule-Based Parser** (Regex-driven) to map human language to structured database queries:

| Intent | Pattern Example | Mapping |
| :--- | :--- | :--- |
| **Age Range** | *"young"* | `min_age: 16`, `max_age: 24` |
| **Threshold** | *"above 30"* | `min_age: 31` |
| **Demographic** | *"males"*, *"children"* | `gender: male`, `age_group: child` |
| **Location** | *"from nigeria"* | `country_id: NG` |

### Limitations
- Does not handle logical "OR" operators (assumes "AND" for all identified filters).
- Requires exact keyword matches (no fuzzy matching).
- Does not support relative ranges like "between" or "less than" (except for the predefined "young" constant).

---

## ⚙️ Setup & Installation

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/hng-stage2-query-engine.git
npm install
cd frontend && npm install
```

### 2. Environment Configuration
Create a `.env` file in the root:
```env
DATABASE_URL="your-postgresql-url"
```

### 3. Database Initialization
```bash
npx prisma db push
npm run seed
```

### 4. Running the Project
**Backend:**
```bash
npm run dev
```

**Frontend:**
```bash
cd frontend && npm run dev
```

---

## 🧪 Testing

### API Unit Tests
```bash
npm run test
```

### UI End-to-End Tests
```bash
cd frontend
npx playwright test
```

---

*Powered by Insighta Labs Intelligent Engine © 2026*
