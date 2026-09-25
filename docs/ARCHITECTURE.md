# 🏗️ TalentFlow — Technical Architecture Specification

## 🏛️ High-Level System Architecture

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

## 🛠️ Technology Stack Detail

### Backend Layer
- **Language & Framework**: Java 17/21, Spring Boot 3.x
- **Security & Authorization**: Spring Security 6, Stateless JWT, BCrypt, Role-Based Access Control (RBAC) with fine-grained permissions (`JOB_CREATE`, `APPLICATION_REVIEW`, `CANDIDATE_SHORTLIST`, etc.)
- **Multi-Tenancy**: Tenant ID context propagation via Spring Security & Hibernate `@Filter` / JPA Specifications
- **Persistence & Database**: Spring Data JPA, Hibernate ORM, MySQL 8.0
- **Real-Time Communication**: Spring WebSocket + STOMP messaging engine
- **Cache & Async Events**: Redis (caching, rate limiting, sessions), Domain Event Listeners (RabbitMQ / Kafka optional integration)
- **API Documentation**: Springdoc OpenAPI 3.0 / Swagger UI (`/swagger-ui`)

### Frontend Layer
- **Core Stack**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS + Vanilla CSS Design Tokens
- **State Management**: Redux Toolkit (Auth & Global UI state) + TanStack Query (Server state management & caching)
- **Routing & Networking**: React Router v6, Axios (with 401 retry interceptors & resilient fallbacks)
- **UI Components**: Lucide React icons, Recharts analytics, TipTap rich text

### Cloud & DevOps
- **Document Management**: AWS S3 (pre-signed URL generation for private resumes & media)
- **Containerization**: Docker, Docker Compose (`docker-compose.yml` for Frontend, Backend, MySQL, Redis)
- **CI/CD & Security**: GitHub Actions, OWASP Dependency-Check, Trivy security scanning

---

## 🔒 Security Architecture

1. **JWT Authentication**: Short-lived access tokens paired with HTTP-only refresh tokens.
2. **Multi-Tenant Scoping**: All database queries automatically append `organization_id` filters for recruiter and admin roles.
3. **Audit Trail**: Action recording table logging `USER`, `ACTION`, `RESOURCE`, `TIMESTAMP`, `IP_ADDRESS`, and `RESULT`.
4. **Correlation Tracking**: Distributed tracing header `X-Correlation-ID` added to every API request lifecycle.
