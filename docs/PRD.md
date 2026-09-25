# 📋 TalentFlow — Product Requirements Document (PRD)

## 🎯 Product Overview
**TalentFlow** is an AI-powered, multi-tenant Talent Acquisition, Applicant Tracking (ATS), Talent CRM, Professional Networking, and Career Management SaaS Platform.

> For the comprehensive 92-section architectural and feature specification, see [ENTERPRISE_PLATFORM_BLUEPRINT.md](ENTERPRISE_PLATFORM_BLUEPRINT.md).

---

## 👥 Target User Roles

1. **Candidate**: Profile building, multi-resume management, Easy Apply, AI ATS compatibility scoring, professional networking, 1-on-1 messaging, interview prep, career analytics.
2. **Recruiter**: Job creation, talent sourcing, candidate shortlisting/rejection, candidate CRM notes & tags, pipeline management, scheduling interviews, recruiter analytics.
3. **Hiring Manager**: Review shortlisted candidate dossiers, evaluate resume match scores, submit structured interview feedback, approve/reject stage advances.
4. **Interviewer**: View assigned interviews, conduct technical/HR assessments using AI interview question templates, submit standardized candidate scores.
5. **Organization Admin**: Manage organization settings, multi-tenant recruiter teams, hiring pipelines, custom permission roles, and time-to-hire analytics.
6. **Platform Admin**: System-wide user & organization governance, content moderation, feature flag toggling, global audit logs.

---

## 🌟 Core Feature Modules

1. **Multi-Tenant Organization SaaS Isolation**: Scoped candidate data, jobs, and recruitment workflows per organization.
2. **Granular RBAC Security & JWT Auth**: Spring Security 6 + stateless JWT + fine-grained permission checks.
3. **Advanced Candidate Profile (Professional Identity System)**: 10 profile sections with full Add (+)/Remove (🗑️) controls & privacy visibility (Public, Recruiters Only, Connections Only, Private).
4. **Multi-Resume Management & PDF Parsing**: Targeted resume portfolio, automated skill/keyword extraction via Apache PDFBox/NLP.
5. **TalentAI Copilot & ATS Compatibility Scoring**: Vector-based match calculations (Overall, Technical, Experience, Keyword, Education) and AI skill-gap roadmaps.
6. **Recruiter ATS & Talent CRM Engine**: Stage tracking (`NEW` ➔ `SCREENING` ➔ `SHORTLISTED` ➔ `INTERVIEW` ➔ `TECHNICAL` ➔ `HR` ➔ `OFFER` ➔ `HIRED`), private recruiter notes, candidate tags.
7. **Real-Time WebSockets Messaging & Community Network**: 1-on-1 chat with STOMP WebSockets, online indicators, career feed, posts, upvotes, comments, and connection requests.
8. **Interview Management & AI Mock Interview Engine**: Scheduling, AI question generator, interactive candidate mock interview evaluation.
9. **Analytics & Cloud Storage Integration**: Recharts funnel analytics, AWS S3 pre-signed URL document storage, CSV/PDF reporting export.

---

## 📐 Non-Functional Requirements

- **Scalability**: Modular monolith architecture designed for seamless microservices decomposition.
- **Security**: BCrypt password hashing, CORS, rate limiting, audit logging, OWASP vulnerability scans.
- **Performance**: Sub-100ms API response time cached via Redis, Pageable pagination for candidates & jobs.
