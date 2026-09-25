# 💼 TalentFlow — AI-Powered Enterprise Talent Acquisition & Career Management SaaS

> **TalentFlow** is a production-oriented, multi-tenant talent acquisition, applicant tracking (ATS), Talent CRM, professional networking, and career management SaaS platform. Built with **Java 17/21**, **Spring Boot 3**, **React 18**, **TypeScript**, **MySQL 8.0**, **Redis**, and **AWS**, TalentFlow combines a **Community Feed**, **1-Click Easy Apply**, **Real-Time STOMP Messaging**, **Multi-Tenant Organization Workflows**, **AWS S3 Document Storage**, **Granular RBAC Security**, and **TalentAI Copilot (GPT-4o)** for AI-driven job matching, resume intelligence, and interview preparation.

---

## 🏷️ Platform Architecture & Positioning Keywords

`Java 17/21` • `Spring Boot 3` • `Spring Security` • `JWT` • `RBAC` • `JPA/Hibernate` • `REST APIs` • `WebSocket` • `React` • `TypeScript` • `MySQL` • `Redis` • `AWS S3` • `Docker` • `GitHub Actions` • `AI/LLM Integration` • `ATS` • `Talent CRM` • `Multi-Tenant SaaS` • `CI/CD` • `Observability`

---

## 🎬 Platform Navigation Demo Video Walkthrough

> Live automated 7-step browser video recording cycling through **all 7 platform navigation routes** (Feed, My Network, Jobs, Messaging, Applications, Candidate Profile, and Recruiter Portal):

<div align="center">
  <img src="demo-navigation.webp" alt="TalentFlow 7-Step Navigation Walkthrough Video" width="100%" style="border-radius: 16px; border: 1px solid #cbd5e1; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);" />
  <p align="center" style="margin-top: 8px;">
    🎥 <strong>Video File Link</strong>: <a href="demo-navigation.webp">Play / Open demo-navigation.webp</a>
  </p>
</div>

---

## 📸 Captured Visual Results & Screenshots for All 7 Navigation Pages

Below are the full visual results captured for every navigation page in **TalentFlow**:

### 1. 🌐 Community Feed (`/feed`)
![1. Community Feed](screenshots/1_feed_page.png)

### 2. 👥 My Network (`/network`)
![2. My Network](screenshots/2_network_page.png)

### 3. 💼 Jobs Board (`/jobs`)
![3. Jobs Board](screenshots/3_jobs_page.png)

### 4. 💬 Messaging Hub (`/messaging`)
![4. Messaging Hub](screenshots/4_messaging_page.png)

### 5. 📂 Applications Tracker (`/candidate/applications`)
![5. Applications Tracker](screenshots/5_applications_page.png)

### 6. 👤 Candidate Profile Showcase (`/candidate/profile`)
![6. Candidate Profile Showcase](screenshots/6_profile_page.png)

### 7. 🛡️ Recruiter Portal Dashboard (`/admin`)
![7. Recruiter Portal Dashboard](screenshots/7_admin_page.png)

---

## 🏛️ System Architecture Blueprint

```
                         TALENTFLOW
                             │
                    React + TypeScript
                             │
                     Nginx / CDN
                             │
                    REST API / WebSocket
                             │
                  Spring Boot Backend
                             │
       ┌─────────────────────┼─────────────────────┐
       │                     │                     │
   Security              Business Logic        AI Layer
       │                     │                     │
   JWT/RBAC              Services              AI APIs
       │                     │                     │
       └─────────────────────┼─────────────────────┘
                             │
                       JPA / Hibernate
                             │
                          MySQL
                             │
             ┌───────────────┼────────────────┐
             │               │                │
          AWS S3           Redis          Search Engine
             │               │                │
        Documents         Cache           Elasticsearch
```

---

## 🌟 Complete Enterprise Platform Capabilities

### 🏢 1. Multi-Tenant SaaS Architecture
- **Tenant Data Isolation**: Enterprise organization boundaries (e.g. Google, Microsoft) where recruiters, hiring managers, interviewers, and jobs operate within isolated tenant scopes.
- **Spring Security & Hibernate Integration**: Automatic tenant context filtering via Spring Security Context and JPA specifications.

### 👥 2. Multi-Role Hierarchy & RBAC Security
- **Roles**: Candidate, Recruiter, Hiring Manager, Interviewer, Organization Admin, Platform Admin.
- **Granular Permissions**: `JOB_CREATE`, `JOB_UPDATE`, `JOB_DELETE`, `CANDIDATE_VIEW`, `APPLICATION_REVIEW`, `CANDIDATE_SHORTLIST`, `INTERVIEW_CREATE`, `ANALYTICS_VIEW`, `USER_MANAGE`.

### 🤖 3. TalentAI Copilot Suite (`AIChatBotWidget.tsx`)
- **Global AI Assistant**: Floating assistant accessible across all routes.
- **Job Match Calculator**: Compatibility analysis vector comparing resume skills, keywords, and experience against job descriptions.
- **AI Resume Analyzer & Parser**: PDF resume extraction, keyword optimization, and achievement impact scoring.
- **AI Skill Gap Analyzer**: Pinpoints missing candidate skills and generates customized learning roadmaps.
- **AI Interview Copilot & Mock Interview**: AI-generated technical questions and interactive interview practice.

### 📊 4. Recruiter ATS & Talent CRM Engine
- **Recruiter Pipeline Stages**: `NEW` ➔ `SCREENING` ➔ `SHORTLISTED` ➔ `INTERVIEW` ➔ `TECHNICAL` ➔ `HR` ➔ `OFFER` ➔ `HIRED`.
- **Talent CRM Dossiers**: Internal recruiter notes, candidate tags (`#Java`, `#Senior`, `#ImmediateJoiner`), document attachments, and candidate interaction timelines.

### 🌐 5. Professional Network & STOMP WebSockets Messaging
- **Community Feed**: Share career posts, articles, job opportunities, image attachments, upvotes, and comments.
- **My Network**: Manage connection invitations, company follows, and mutual connection indicators.
- **Real-Time Messaging Hub**: WebSocket + STOMP protocol 1-on-1 messaging with live presence indicators and file sharing.

### ⚡ 6. 1-Click Easy Apply & Advanced Profile Manager
- **Easy Apply Modal**: Instant candidate applications with pre-filled profile data, target resume selection, and live AI compatibility scores.
- **Advanced Profile Manager**: Complete Add (+)/Remove (🗑️) controls across Experience, Education, Skills, Projects, Certifications, Publications, Patents, Honors, Languages, and AWS S3 Media.

---

## 🛠️ Technology Architecture

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Vanilla CSS Design Tokens
- **State Management**: Redux Toolkit (Auth/UI State) + TanStack Query (Server State)
- **Icons & UI**: Lucide React + Recharts
- **Routing**: React Router v6

### Backend
- **Framework**: Java 17/21 + Spring Boot 3
- **Security**: Spring Security 6 + Stateless JWT + BCrypt
- **ORM & Database**: Spring Data JPA + Hibernate + MySQL 8.0
- **Cache & Messaging**: Redis + WebSocket / STOMP
- **Documentation**: Springdoc OpenAPI / Swagger UI (`/swagger-ui`)

---

## 🐳 Docker Cloud Production Deployment

Deploy the full-stack application (Frontend + Backend + MySQL + Redis) with a single command:

```bash
docker-compose up --build
```

Access the deployed application at:
- **Frontend App**: `http://localhost:80`
- **Backend API**: `http://localhost:8080/api`
- **Swagger Documentation**: `http://localhost:8080/swagger-ui.html`

---

## 🗃️ Seeded Test Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin / Recruiter** | `admin@talentflow.com` | `Admin@123` |
| **Candidate** | `candidate@talentflow.com` | `Candidate@123` |

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

Visit `http://localhost:5173` to launch **TalentFlow**.

---

## 📄 Documentation Suite

- 📘 [Complete Enterprise Platform Blueprint](docs/ENTERPRISE_PLATFORM_BLUEPRINT.md)
- 👤 [Complete Candidate Profile & Professional Identity System Blueprint](docs/CANDIDATE_PROFILE_SYSTEM_BLUEPRINT.md)
- 📋 [Product Requirements Document (PRD)](docs/PRD.md)
- 🏗️ [Technical Architecture Specification](docs/ARCHITECTURE.md)

