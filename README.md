# 💼 Link2Career — Your Professional Network & Career Platform

> **Link2Career** (*"Connect. Discover. Grow."*) is a modern, enterprise-grade Talent Acquisition, Applicant Tracking (ATS), Talent CRM, Professional Networking, and Career Management SaaS platform. Built with **Java 17/21**, **Spring Boot 3**, **React 18**, **TypeScript**, **MySQL 8.0**, **Redis**, and **Cloud Storage**, Link2Career features a **Community Feed**, **1-Click Easy Apply**, **Real-Time STOMP Messaging**, **50/50 Split Auth Layout**, **Header Search with Persistent History**, **Candidate Profile 70/30 Grid**, **Direct Resume Drag & Drop Uploads**, **Profile Photo & Cover Photo Operations**, **Public Profile Preview**, and **Link2Career AI Copilot** with a custom AI Robot symbol.

---

## 🏷️ Key Positioning & Technology Keywords

`Link2Career` • `Java 17/21` • `Spring Boot 3` • `Spring Security` • `JWT` • `RBAC` • `JPA/Hibernate` • `REST APIs` • `WebSocket` • `React` • `TypeScript` • `MySQL` • `Redis` • `Cloud Storage` • `Docker` • `AI Copilot` • `ATS` • `Talent CRM` • `Multi-Tenant SaaS` • `CI/CD`

---

## ✨ Primary Features & Capabilities

### ⚡ 1. Brand Identity & Half-and-Half Auth Layout
- **Brand Logo**: Custom hexagonal node network logo symbolizing professional connections and career growth trajectory.
- **50/50 Split Authentication**: `LoginPage.tsx` and `RegisterPage.tsx` built with a dark navy branding panel on the left and clean white interactive login form on the right.
- **Search Engine Title Tag**: `<title>Link2Career</title>` strictly configured for optimal SEO indexing.

### 🔍 2. Header Search Bar with Persistent Search History
- **White Navigation Bar**: Modern `bg-white border-b border-slate-200` sticky header layout.
- **Search History Dropdown**: Saves recent search queries to `localStorage` with clear history actions and instant re-search triggers.

### 🤖 3. Link2Career AI Copilot (`AIRobotIcon`)
- **AI Robot Symbol**: Custom SVG AI Robot icon with antenna glow and eye reflections.
- **Event-Driven Opening**: Dispatches `open-ai-copilot` event upon clicking the AI Robot symbol across the app or floating button.
- **Career Capabilities**: Profile compatibility scoring (e.g. 88% Match), AI resume summary generator, technical interview prep questions, and salary insights.

### 👤 4. Candidate Profile System (70/30 Grid Layout)
- **70/30 Desktop Layout**: 70% primary column for profile details and 30% right sidebar for Profile Strength (94%), TalentAI Insights, and Career Preferences.
- **Photo & Banner Controls**:
  - 📷 **Profile Photo**: Upload new image, Edit photo URL, Delete/Remove photo.
  - 🖼️ **Cover Banner**: Change banner image, Edit cover URL, Reset to default banner.
- **📄 Resume Drag & Drop Upload Section**: Direct file upload zone supporting PDF, DOC, DOCX up to 10MB with live status card and download actions.
- **👁️ View Public Profile Modal**: Recruiter-facing public view layout preview displaying candidate credentials, project cards, and verified badges.
- **10 Profile Sections with Add (+)/Remove (🗑️) Controls**:
  1. Personal & Contact Information
  2. Featured Projects & Engineering Work
  3. Portfolio Media & Cloud Attachments
  4. Licenses & Certifications
  5. Publications & Papers
  6. Honors & Awards
  7. Patents & Innovations
  8. Education History
  9. Work Experience
  10. Skills & Peer Endorsements

---

## 🏛️ System Architecture Blueprint

```
                       LINK2CAREER PLATFORM
                                │
                       React 18 + TypeScript
                                │
                       White Navigation Header
                                │
                       REST API / WebSocket
                                │
                      Spring Boot 3 Backend
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
    Security                Business Logic           AI Layer
        │                       │                       │
    JWT/RBAC                Services               AI Copilot
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                         JPA / Hibernate
                                │
                             MySQL 8
                                │
               ┌────────────────┼────────────────┐
               │                │                │
          Cloud Storage       Redis       Search History
               │                │                │
            Documents         Cache         localStorage
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Design Tokens
- **Icons**: Lucide React + Custom SVG Icons (`Link2CareerLogo`, `AIRobotIcon`)
- **Routing**: React Router v6

### Backend
- **Framework**: Java 17/21 + Spring Boot 3
- **Security**: Spring Security 6 + Stateless JWT + RBAC
- **Persistence**: Spring Data JPA + Hibernate + MySQL 8.0
- **Documentation**: OpenAPI / Swagger UI (`/swagger-ui`)

---

## 🚀 Local Development Setup

```bash
# Frontend Setup
cd frontend
npm install
npm run dev

# Backend Setup (in separate terminal)
cd backend
./mvnw spring-boot:run
```

Visit `http://localhost:5173` to launch **Link2Career**.

---

## 📄 Platform Documentation Suite

- 📘 [Enterprise Platform Master Blueprint](docs/ENTERPRISE_PLATFORM_BLUEPRINT.md)
- 👤 [Candidate Profile System Blueprint](docs/CANDIDATE_PROFILE_SYSTEM_BLUEPRINT.md)
- 🎨 [Premium Professional Profile UI Spec](docs/PREMIUM_PROFESSIONAL_PROFILE_UI_SPEC.md)
- 📋 [Product Requirements Document (PRD)](docs/PRD.md)
- 🏗️ [Technical Architecture Specification](docs/ARCHITECTURE.md)
- 🔐 [Security & RBAC Architecture](docs/SECURITY.md)
- 🧪 [Testing & Verification Plan](docs/TEST_PLAN.md)
