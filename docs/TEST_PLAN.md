# 🧪 TalentFlow Automated Testing & Quality Assurance Plan

## 🎯 Test Layers & Strategy

1. **Unit Testing**: JUnit 5 + Mockito for Java service & security logic; Vitest for React components.
2. **Integration Testing**: Spring Boot Test + MockMvc for REST API contracts; Testcontainers for real MySQL & Redis database testing.
3. **End-to-End Visual Verification**: Automated browser route recording cycling through all 7 primary platform routes.
4. **Security & Dependency Auditing**: OWASP Dependency-Check & Trivy container scans.
