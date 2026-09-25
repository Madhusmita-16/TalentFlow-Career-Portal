# 💼 Link2Career — Enterprise Candidate & Recruitment SaaS Platform

> **Link2Career** (*"Connect. Discover. Grow."*) is a functional, multi-tenant Talent Acquisition, Applicant Tracking (ATS), Talent CRM, Professional Networking, and Career Management SaaS platform. Built with **Java 17/21**, **Spring Boot 3**, **React 18**, **TypeScript**, **MySQL 8.0**, **Redis**, and **Cloud Storage**.

---

## 🎬 Navigation Video Walkthrough

> Below is the recorded browser video demonstrating full navigation across all platform routes and interactive features:

<div align="center">
  <img src="./demo-navigation.webp" alt="Link2Career Complete Platform Navigation Video Walkthrough" width="100%" style="border-radius: 16px; border: 1px solid #cbd5e1; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);" />
  <p align="center" style="margin-top: 10px;">
    🎥 <strong>Playback File Link</strong>: <a href="./demo-navigation.webp">Open / Play demo-navigation.webp</a>
  </p>
</div>

---

## 🛠️ Functional Features in Active Use

Below is the breakdown of functional components, API endpoints, state managers, and data models currently active in the codebase:

### 1. 🔍 Header Navigation & Persistent Search Engine
- **Active Component**: `Header.tsx`
- **Functional Logic**:
  - Global query filtering across jobs, candidates, and technical skills.
  - **Search History Engine**: Persists recent search queries in `localStorage` under `link2career_search_history`.
  - **History Controls**: Dropdown displaying recent searches with one-click re-execution and `Clear History` deletion.

### 2. 🤖 Link2Career AI Copilot (`AIRobotIcon`)
- **Active Components**: `AIChatBotWidget.tsx`, `AIRobotIcon`
- **Functional Logic**:
  - **Event-Driven Trigger**: Listens for global `open-ai-copilot` custom events dispatched from header buttons or floating action triggers.
  - **Profile Match Score Vector**: Algorithmic match analysis comparing candidate skill matrices against job requirements.
  - **Technical Interview Generator**: Produces tailored technical interview questions based on Java 21, Spring Boot, and React.
  - **Salary Benchmarking**: Generates compensation breakdowns for target job titles and regions.

### 3. 👤 Candidate Profile & File Upload Management
- **Active Components**: `CandidateProfilePage.tsx`, `ProfileHeaderHero.tsx`
- **Functional Logic**:
  - **📄 Resume Drag & Drop Upload Zone**: Uses `candidateApi.uploadResume` to handle PDF/DOCX file uploads, displaying file size, upload timestamp, active status badge, and PDF download actions.
  - **📷 Profile Photo Operations**:
    - **Upload**: Direct image file upload via `cloudStorageApi.uploadMedia`.
    - **Edit**: Direct URL modification.
    - **Delete**: Resets profile photo to default avatar.
  - **🖼️ Cover Photo Operations**:
    - **Upload**: Direct banner image file upload via `cloudStorageApi.uploadMedia`.
    - **Edit**: Direct URL modification.
    - **Delete**: Resets cover photo to default enterprise gradient banner.
  - **10 Profile Data Sections (with Add `+` and Remove `🗑️` State Handlers)**:
    1. Personal & Contact Information
    2. Featured Projects & Engineering Work
    3. Portfolio Media & Cloud Attachments
    4. Licenses & Certifications
    5. Publications & Papers
    6. Honors & Awards
    7. Patents & Innovations
    8. Education History
    9. Work History
    10. Technical Skills & Peer Endorsements

### 4. 👁️ Public Profile Preview Modal
- **Active Component**: `PublicProfileModal.tsx`
- **Functional Logic**:
  - Recruiter-facing public view modal previewing verified candidate identity, skills, verified badges (`#IdentityVerified`, `#SkillsVerified`), project cards, and direct PDF resume downloads.

### 5. ⚡ 1-Click Easy Apply & Multi-Step Application Flow
- **Active Component**: `ApplicationFlowPage.tsx`
- **Functional Logic**:
  - **5-Step Application Wizard**:
    1. Personal Details Verification
    2. Resume Attachment / Saved Resume Picker
    3. Work History & Education Review
    4. Custom Screening Questions (Text, Yes/No, Single Choice)
    5. Review & Legal Confirmation Checkbox
  - Produces unique application records (`#APP-1001`) logged in recruiter pipelines.

### 6. 🛡️ Enterprise Audit Trail & Organization Management
- **Active Backend Services**: `AuditController.java`, `AuditService.java`, `OrganizationController.java`
- **Active Data Entities**: `AuditLog.java`, `Organization.java`, `OrganizationMember.java`
- **Functional Logic**:
  - Tracks user activity (action type, target entity, IP address, timestamp).
  - Multi-tenant organization boundaries and member role assignments (`ADMIN`, `RECRUITER`, `MEMBER`).

### 7. 💬 Real-Time STOMP WebSockets Messaging & Community Network
- **Active Components**: `MessagingPage.tsx`, `FeedPage.tsx`, `NetworkPage.tsx`
- **Functional Logic**:
  - 1-on-1 direct messaging via STOMP WebSockets with unread indicators and presence tracking.
  - Community feed post creation, likes, comments, and hashtag filters.
  - Connection request dispatching (`ACCEPT`, `IGNORE`) and peer skill endorsements.

---

## 🏛️ Codebase Structure & Data Flow

```
f:\works\TalentFlow-Career-Portal
├── backend/
│   └── src/main/java/com/talentflow/careerportal/
│       ├── controller/        # REST Endpoints (Audit, Organization, Candidate, Job, Application)
│       ├── entity/            # JPA Entities (AuditLog, Organization, Candidate, JobApplication)
│       ├── repository/        # Spring Data Repositories
│       └── service/           # Business Logic & Audit Trail Services
└── frontend/
    └── src/
        ├── api/               # Axios REST Clients & API Mock Fallbacks
        ├── components/        # Functional UI Components
        │   ├── Header.tsx     # White Navbar + Persistent Search History
        │   ├── Footer.tsx     # Footer Brand Links
        │   ├── AIChatBotWidget.tsx # AI Copilot & AIRobotIcon
        │   ├── Link2CareerLogo.tsx # Hexagonal Node Logo
        │   └── profile/       # Profile Header Hero, Public Profile Modal, Insight Cards
        └── pages/             # Route Pages (CandidateProfile, Jobs, Feed, Network, Messaging, Auth)
```

---

## 🚀 Running the Project Locally

```bash
# 1. Start Frontend (React + Vite)
cd frontend
npm install
npm run dev

# 2. Start Backend (Java 17/21 + Spring Boot 3)
cd backend
./mvnw spring-boot:run
```

Access the frontend application at `http://localhost:5173`.

---

## 📄 Comprehensive Documentation

- 📘 [Enterprise Platform Blueprint](docs/ENTERPRISE_PLATFORM_BLUEPRINT.md)
- 👤 [Candidate Profile System Blueprint](docs/CANDIDATE_PROFILE_SYSTEM_BLUEPRINT.md)
- 🎨 [Premium Professional Profile UI Spec](docs/PREMIUM_PROFESSIONAL_PROFILE_UI_SPEC.md)
- 📋 [Product Requirements Document (PRD)](docs/PRD.md)
- 🏗️ [Technical Architecture Specification](docs/ARCHITECTURE.md)
