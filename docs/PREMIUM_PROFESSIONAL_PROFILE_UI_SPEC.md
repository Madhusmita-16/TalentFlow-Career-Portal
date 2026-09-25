# 🎨 TalentFlow — Premium Professional Profile UI & System Specification

## 🏛️ Executive Summary & Visual Direction
**TalentFlow Professional Profile & Talent Identity** is designed as a production-grade, enterprise SaaS profile interface combining:
- 🏢 **Enterprise SaaS Aesthetics**: Clean white/slate backgrounds (`#F8FAFC`, `#FFFFFF`), deep navy primary (`#0F172A`), professional blue accents (`#2563EB`), sky blue secondary (`#0EA5E9`), thin borders (`#E2E8F0`), 16px/24px rounded corners (`rounded-2xl`), and soft micro-shadows (`shadow-xs`).
- 🌐 **Modern Professional Networking**: Verification badges, skill endorsements, 1-on-1 messaging integration, network activity, and public canonical URLs (`/in/{username}`).
- 🚀 **Developer Portfolio Showcase**: Dedicated GitHub repos, project thumbnails, live demo links, architecture highlights, open-source PRs, and technical writing cards.
- 🤖 **TalentAI Career Intelligence**: Real-time AI profile strength calculation, non-fabricating profile improvement suggestions, skill gap roadmaps, and recruiter match alignment.
- 🎯 **Recruiter-Grade Candidate Dossier**: Specialized recruiter view with stage actions (*Shortlist*, *Schedule Interview*, *Message*, *Add to Talent Pool*, *Hiring Manager Feedback*).

---

## 🎨 1. Global Design Tokens & Typography

### Color Palette
- **Primary / Brand**: Deep Navy (`#0F172A`), Professional Blue (`#2563EB`), Blue Hover (`#1D4ED8`).
- **Accent / AI**: Sky Blue (`#0EA5E9`), Soft Blue (`#EFF6FF`), AI Purple/Cyan (`#8B5CF6`).
- **Surfaces**: Main (`#F8FAFC`), Card (`#FFFFFF`), Secondary (`#F1F5F9`).
- **Borders & Dividers**: Slate Border (`#E2E8F0`).
- **Status Badges**: Success (`#16A34A`), Warning (`#F59E0B`), Danger (`#DC2626`).

### Typography Hierarchy (Inter / Geist)
- **Page Title**: 32px – 36px / Bold (700)
- **Section Title**: 20px – 24px / Semi-Bold (650)
- **Card Title**: 16px – 18px / Medium (600)
- **Body Text**: 14px – 16px / Regular (400)
- **Metadata & Labels**: 12px – 13px / Medium (500)

---

## 📐 2. Desktop 70/30 Split Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TOP STICKY NAVIGATION BAR (TalentFlow Logo, Search, Feed, Jobs, Profile)    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ PREMIUM PROFILE HEADER & HERO BANNER                                         │
│ Abstract geometric banner, avatar overlay, verified badges, action buttons  │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐ ┌────────────────────────────┐
│ MAIN CONTENT COLUMN (~70% Width)              │ │ RIGHT SIDEBAR (~30% Width) │
│                                              │ │                            │
│ 📝 ABOUT & EXECUTIVE SUMMARY                 │ │ 📊 PROFILE STRENGTH        │
│ 💼 WORK EXPERIENCE TIMELINE                  │ │    94% Gauged Completion   │
│ 🚀 FEATURED & SELECTED PROJECTS              │ │                            │
│ 🛠️ TECHNICAL SKILLS MATRIX                  │ │ ✨ TALENTAI INSIGHTS       │
│ 🎓 EDUCATION & DEGREES                       │ │    Verified Recommendations│
│ 📚 LICENSES & CERTIFICATIONS                 │ │                            │
│ ⭐ FEATURED SPOTLIGHT CARD                   │ │ 🎯 CAREER PREFERENCES      │
│ 📜 PUBLICATIONS & PATENTS                    │ │    Desired roles & Notice  │
│ 🏅 HONORS, AWARDS & SPOKEN LANGUAGES         │ │                            │
│ 📄 MULTI-RESUME MANAGER                      │ │ 📱 QR & PUBLIC PROFILE     │
└──────────────────────────────────────────────┘ └────────────────────────────┘
```

---

## 🧩 3. Modular React Component Architecture

1. `ProfileHeader`: Geometric cover, avatar overlay, name, headline, location, open-to-work toggle, verification badges, action buttons (*Edit Profile*, *Share*, *Download Resume*, *QR Code*).
2. `ProfileStrengthCard`: Circular/horizontal gauged completion bar (94%), section progress indicators, and one-click *Improve Profile* trigger.
3. `TalentAIInsights`: Non-fabricating AI assistant highlighting verified strengths and recommended profile improvements.
4. `AboutSection`: Rich summary text with AI action buttons (*AI Improve*, *Make Concise*, *Optimize for Job*).
5. `ExperienceSection`: Vertical timeline with company logos, employment verification badges (`✓ Verified`), achievements, tech chips, and CRUD controls.
6. `ProjectsSection`: Responsive project cards with thumbnails, live demo URLs, GitHub repo links, and ⭐ Featured Project spotlight mode.
7. `TechnicalSkillsSection`: Skill matrix categorized by domain (*Programming*, *Backend*, *Frontend*, *Databases*, *Cloud*) with level badges (`ADVANCED`, `EXPERT`) and assessment verification.
8. `EducationSection`: Academic degree cards, institution logos, relevant coursework, and GPAs.
9. `CertificationsSection`: Verification badges, issuing organizations, credential IDs, and certificate downloads.
10. `CareerPreferencesCard`: Private recruiter-visible preferences (Target Roles, Work Mode, Preferred Locations, Availability).
11. `ResumeManager`: Multi-resume manager allowing candidates to manage targeted PDF resumes (*Java Developer Resume*, *Full Stack Resume*).
12. `RecruiterCandidateDossier`: Specialized recruiter panel with candidate match alignment signals, talent pool assignment, recruiter notes, and interview scheduling.
13. `PublicProfileQRModal`: Interactive modal rendering QR code for instant public profile sharing (`/in/madhusmita-mishra`).

---

## 🔒 4. Privacy, AI Guardrails & Supabase Security

- **Strict AI Guardrails**: TalentAI only refines user-submitted experience and keywords. It is strictly prohibited from inventing false employment, skills, or certifications.
- **Privacy Controls**: Granular field-level visibility (`EVERYONE`, `MEMBERS`, `RECRUITERS`, `CONNECTIONS`, `PRIVATE`).
- **Supabase RLS & Storage**: Relational tables (`profiles`, `experiences`, `education`, `skills`, `projects`, `certifications`, `resumes`, `audit_logs`) protected with Row Level Security and S3 signed URLs for private resume PDFs.
