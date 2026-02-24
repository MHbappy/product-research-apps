# 🚀 Spring Boot Enterprise Starter

A production-ready Spring Boot starter template with complete authentication, real-time notifications, file storage, and modern enterprise features.

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-11-orange.svg)](https://www.oracle.com/java/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## ✨ Features

### 🔐 Authentication & Authorization
- **Email/Password Authentication** with JWT tokens
- **OAuth2 Social Login** (Google, GitHub, Facebook)
- **Role-Based Access Control** (RBAC)
- **Email Verification** & Password Reset
- **Refresh Token Rotation** for enhanced security
- **Method-Level Security** with `@PreAuthorize`

### 🔔 Real-Time Notifications
- **WebSocket** support with STOMP protocol
- **1-to-1 Notifications** (user to user)
- **Broadcast Notifications** (1-to-all)
- **Persistent Storage** with read/unread tracking
- **SockJS Fallback** for older browsers

### 📁 File Management
- **MinIO Object Storage** (S3-compatible)
- **Local File Storage** option
- **Presigned URLs** for secure file access
- **File Metadata** tracking
- **Multiple File Upload** support

### 📧 Email Service
- **Async Email Sending** (non-blocking)
- **HTML Email Templates** (Thymeleaf)
- **Verification, Reset, Alert Emails**
- **SMTP Configuration** (Gmail ready)

### 🛡️ Security
- **BCrypt Password Hashing** (strength 12)
- **CORS Configuration**
- **Rate Limiting** (Bucket4j)
- **SQL Injection Prevention**
- **XSS Protection**
- **Path Traversal Prevention**

### 📊 Monitoring & Observability
- **Spring Actuator** endpoints
- **Prometheus Metrics** export
- **Health Checks** (liveness, readiness)
- **Structured Logging**

### 🐳 DevOps Ready
- **Docker & Docker Compose** support
- **Multi-stage Dockerfile**
- **PostgreSQL** database
- **MinIO** object storage
- **Environment-based Configuration**

---

## 🏗️ Tech Stack

- **Backend:** Spring Boot 3.2.1, Java 11
- **Security:** Spring Security, JWT (JJWT), OAuth2
- **Database:** PostgreSQL, H2 (dev), Flyway
- **Storage:** MinIO (S3-compatible)
- **WebSocket:** STOMP, SockJS
- **Email:** JavaMailSender, Thymeleaf
- **Monitoring:** Actuator, Prometheus, Micrometer
- **Tools:** Lombok, MapStruct, Jakarta Validation
- **API Docs:** OpenAPI 3.0 (Swagger UI)
- **DevOps:** Docker, Docker Compose

---

## 🚀 Quick Start

### Prerequisites
- Java 11+
- Docker & Docker Compose
- Maven 3.6+

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/spring-boot-starter.git
cd spring-boot-starter
```

### 2. Configure Environment
```bash
cp .env .env
# Edit .env with your credentials
```

### 3. Run with Docker Compose
```bash
docker-compose up -d
```

The application will be available at:
- **API:** http://localhost:8080
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **MinIO Console:** http://localhost:9001 (minioadmin/minioadmin)

### 4. Run Locally (Development)
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

---

## 📡 API Endpoints

### Authentication
```http
POST   /api/v1/auth/signup              # Register new user
POST   /api/v1/auth/login               # Login with email/password
POST   /api/v1/auth/oauth2/token        # Exchange OAuth2 token
POST   /api/v1/auth/refresh             # Refresh access token
POST   /api/v1/auth/logout              # Logout user
GET    /api/v1/auth/verify-email        # Verify email
POST   /api/v1/auth/forgot-password     # Request password reset
POST   /api/v1/auth/reset-password      # Reset password
```

### OAuth2 Social Login
```http
GET    /oauth2/authorize/google         # Login with Google
GET    /oauth2/authorize/github         # Login with GitHub
GET    /oauth2/authorize/facebook       # Login with Facebook
```

### File Upload
```http
POST   /api/v1/files/upload             # Upload single file
POST   /api/v1/files/upload-multiple    # Upload multiple files
GET    /api/v1/files/{fileName}         # Download file
GET    /api/v1/files/{fileName}/metadata # Get file metadata
DELETE /api/v1/files/{fileName}         # Delete file (admin)
```

### Notifications
```http
POST   /api/v1/notifications/send       # Send notification to user
POST   /api/v1/notifications/broadcast  # Broadcast to all (admin)
GET    /api/v1/notifications            # Get all notifications
GET    /api/v1/notifications/unread     # Get unread notifications
GET    /api/v1/notifications/unread/count # Get unread count
PUT    /api/v1/notifications/{id}/read  # Mark as read
PUT    /api/v1/notifications/read-all   # Mark all as read
DELETE /api/v1/notifications/{id}       # Delete notification
```

### WebSocket
```
CONNECT    /ws                          # WebSocket connection
SUBSCRIBE  /user/queue/notifications    # Personal notifications
SUBSCRIBE  /topic/notifications         # Broadcast notifications
```

---

## 🧪 Testing

### Test Authentication
```bash
# Register
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```

### Test File Upload
```bash
TOKEN="your-access-token"

curl -X POST http://localhost:8080/api/v1/files/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.jpg"
```

### Test Notifications
```bash
curl -X POST http://localhost:8080/api/v1/notifications/send \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notification",
    "message": "Hello!",
    "type": "INFO",
    "recipientId": 2
  }'
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=appdb
DB_USERNAME=appuser
DB_PASSWORD=changeme

# JWT
JWT_SECRET=your-secret-key-min-256-bits
JWT_EXPIRATION=900000
JWT_REFRESH_EXPIRATION=604800000

# OAuth2
OAUTH2_GOOGLE_CLIENT_ID=your-google-client-id
OAUTH2_GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@yourapp.com

# MinIO
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=application-files

# Application
APP_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000
```

---

## 📁 Project Structure

```
src/main/java/com/bappy/application/
├── auth/                    # Authentication & Authorization
│   ├── controller/          # Auth REST endpoints
│   ├── service/             # Auth business logic
│   ├── dto/                 # Auth DTOs
│   ├── entity/              # Token entities
│   └── repository/          # Token repositories
├── user/                    # User Management
│   ├── entity/              # User, Role entities
│   └── repository/          # User repositories
├── security/                # Security Configuration
│   ├── jwt/                 # JWT token handling
│   └── oauth2/              # OAuth2 configuration
├── email/                   # Email Service
│   ├── service/             # Email sending logic
│   └── dto/                 # Email DTOs
├── file/                    # File Management
│   ├── controller/          # File upload/download
│   ├── service/             # Storage services (Local, MinIO)
│   └── dto/                 # File DTOs
├── notification/            # Real-time Notifications
│   ├── controller/          # Notification REST API
│   ├── service/             # Notification logic
│   ├── entity/              # Notification entity
│   ├── repository/          # Notification repository
│   └── websocket/           # WebSocket configuration
├── config/                  # Application Configuration
├── common/                  # Common utilities
└── exception/               # Global exception handling
```

---

## 🗄️ Database Schema

The application uses **8 tables**:

1. **users** - User accounts
2. **roles** - User roles (ADMIN, USER, MODERATOR)
3. **user_roles** - User-Role mapping
4. **refresh_tokens** - JWT refresh tokens
5. **email_verification_tokens** - Email verification
6. **password_reset_tokens** - Password reset
7. **notifications** - Real-time notifications
8. **audit_logs** - Audit trail (optional)

Migrations managed by **Flyway**.

---

## 🔒 Security Features

- ✅ **JWT Authentication** with access & refresh tokens
- ✅ **OAuth2 Social Login** (Google, GitHub, Facebook)
- ✅ **Password Hashing** (BCrypt, strength 12)
- ✅ **Email Verification** required
- ✅ **Rate Limiting** to prevent abuse
- ✅ **CORS Configuration** for frontend
- ✅ **SQL Injection Prevention** (JPA)
- ✅ **XSS Protection** enabled
- ✅ **Path Traversal Prevention** in file uploads
- ✅ **Token Rotation** for refresh tokens
- ✅ **Method-Level Security** with annotations

---

## 📊 Monitoring

Access monitoring endpoints:

- **Health Check:** http://localhost:8080/actuator/health
- **Metrics:** http://localhost:8080/actuator/metrics
- **Prometheus:** http://localhost:8080/actuator/prometheus

---

## 🐳 Docker Deployment

### Build & Run
```bash
# Build image
docker build -t spring-boot-starter .

# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Services
- **app** - Spring Boot application (port 8080)
- **postgres** - PostgreSQL database (port 5432)
- **minio** - MinIO object storage (ports 9000, 9001)

---

## 🎯 Use Cases

This starter is perfect for:

- 🏢 **Enterprise Applications** - Full-featured backend
- 📱 **Mobile App Backends** - REST API + Push notifications
- 💬 **Chat Applications** - Real-time messaging with WebSocket
- 📊 **SaaS Platforms** - Multi-tenant ready
- 🛒 **E-commerce** - User management, file uploads
- 📚 **Content Management** - File storage, notifications
- 🎓 **Learning Projects** - Best practices demonstration

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Spring Boot Team for the amazing framework
- All open-source contributors

---

## 📧 Contact

**Your Name** - [@Mehedi Hasan Bappy](https://www.linkedin.com/in/mhbappy18/)

Project Link: [https://github.com/MHbappy/mh-springboot-quickstart](https://github.com/MHbappy/mh-springboot-quickstart)

---

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

**Built with ❤️ using Spring Boot**
