# 🔐 TalentFlow Security Architecture

## 🛡️ Security Mechanisms
1. **Stateless JWT Authentication**: Access tokens & HTTP-only refresh tokens.
2. **Fine-Grained Role-Based Access Control (RBAC)**: 6 User Roles & 9 Permission scopes.
3. **Multi-Tenant Scoping**: Automatic tenant Context filtering (`tenant_id`).
4. **Input Sanitization & Boundary Validation**: Jakarta Bean Validation (`@NotNull`, `@Size`, `@Pattern`) & CORS configuration.
5. **Audit Trail Logging**: Audit system recording `USER`, `ACTION`, `RESOURCE`, `TIMESTAMP`, `IP`, `RESULT`.
6. **Security Scanning**: OWASP Dependency-Check & Trivy container vulnerability scanning.
