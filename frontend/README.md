# TalentFlow Frontend — React + TypeScript + Vite + Tailwind CSS v4

> React 18 single-page application for the TalentFlow Enterprise Career Portal. Built with Vite, TypeScript, Tailwind CSS v4, React Router v6, Axios, React Hook Form + Zod, and Framer Motion.

---

## 📁 Project Structure

```
src/
├── api/
│   ├── axios.ts          — Axios instance with base URL & JWT auth interceptor
│   └── index.ts          — Typed API service functions (auth, jobs, applications, admin)
├── components/
│   ├── Header.tsx        — Responsive navigation, notification bell, user dropdown
│   ├── Footer.tsx        — Corporate footer
│   ├── JobCard.tsx       — Job listing card
│   └── StatusBadge.tsx   — Colour-coded application status badge
├── contexts/
│   └── AuthContext.tsx   — Global authentication state with JWT persistence
├── pages/
│   ├── HomePage.tsx               — Hero, featured jobs, culture section, CTA
│   ├── JobsPage.tsx               — Full job listing with search & filters
│   ├── JobDetailsPage.tsx         — Job detail view with apply button
│   ├── ApplicationFlowPage.tsx    — 5-step application wizard
│   ├── LoginPage.tsx              — Login form
│   ├── RegisterPage.tsx           — Candidate registration form
│   ├── CandidateDashboardPage.tsx — Candidate stats & recent applications
│   ├── CandidateProfilePage.tsx   — Profile editor (skills, work, education, resume)
│   ├── CandidateApplicationsPage.tsx — Application tracker with status timeline
│   └── AdminDashboardPage.tsx     — Recruiter dashboard (pipeline, jobs, stats)
└── types/
    └── index.ts          — TypeScript interfaces for all API entities
```

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

> Requires the Spring Boot backend running at `http://localhost:8080`
