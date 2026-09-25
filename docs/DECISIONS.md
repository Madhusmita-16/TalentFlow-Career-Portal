# 📜 Architectural Decision Records (ADRs)

## ADR-001: Java 17/21 & Spring Boot 3 Modular Monolith Backend
- **Status**: Accepted
- **Rationale**: Prioritizes clean domain boundaries, Spring Security 6 integration, JPA entity relationships, and Spring WebSocket STOMP messaging before microservice decomposition.

## ADR-002: Multi-Tenant Data Isolation Strategy
- **Status**: Accepted
- **Rationale**: Implements organization-scoped `tenant_id` filtering via Spring Security Context and Hibernate specifications to ensure strict data segregation for enterprise SaaS deployment.

## ADR-003: Dual State Management Engine (Redux Toolkit + TanStack Query)
- **Status**: Accepted
- **Rationale**: Redux Toolkit manages global authentication and UI states, while TanStack Query handles server API state caching, background synchronization, and optimistic UI updates.

## ADR-004: AWS S3 Cloud Media Storage with Local Fallbacks
- **Status**: Accepted
- **Rationale**: Generates secure pre-signed URLs for private candidate resumes and media, maintaining a mock local file storage fallback for offline development.
