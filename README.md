# Zenith Campus Operations Hub 🎓

A modern, full-stack web application for managing university facilities, bookings, and maintenance operations with real-time notifications and role-based access control.

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![OAuth 2.0](https://img.shields.io/badge/OAuth-2.0-orange)
![MySQL](https://img.shields.io/badge/MySQL-8.x-blue)
![JWT](https://img.shields.io/badge/JWT-Secured-red)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Team Contributions](#team-contributions)
- [Screenshots](#screenshots)
- [License](#license)

## 🎯 Overview

Zenith is a comprehensive campus operations management system built for the IT3030 - Programming Applications and Frameworks course at SLIIT. The platform streamlines facility bookings, asset management, and maintenance ticket handling through an intuitive web interface with robust backend APIs.

### Key Capabilities

- **Facilities & Assets Management**: Complete catalogue of bookable resources including lecture halls, labs, meeting rooms, and equipment
- **Smart Booking System**: Conflict-free scheduling with approval workflows and real-time availability checking
- **Incident Ticketing**: End-to-end maintenance request handling with image attachments and technician assignments
- **Real-time Notifications**: Instant updates for booking approvals, ticket status changes, and comments
- **Secure Authentication**: OAuth 2.0 integration with Google sign-in and JWT-based authorization

## ✨ Features

### Module A: Facilities & Assets Catalogue
- ✅ Comprehensive resource catalogue (rooms, labs, equipment)
- ✅ Advanced search and filtering (type, capacity, location, status)
- ✅ Resource metadata management (availability windows, capacity, location)
- ✅ Status tracking (ACTIVE / OUT_OF_SERVICE)

### Module B: Booking Management
- ✅ User-friendly booking request interface
- ✅ Automated conflict detection (prevents overlapping bookings)
- ✅ Multi-stage workflow: PENDING → APPROVED/REJECTED → CANCELLED
- ✅ Admin approval system with reason tracking
- ✅ Personal and admin-level booking views with filters

### Module C: Maintenance & Incident Ticketing
- ✅ Incident ticket creation with category, priority, and description
- ✅ Support for up to 3 image attachments per ticket
- ✅ Ticket lifecycle: OPEN → IN_PROGRESS → RESOLVED → CLOSED
- ✅ Technician assignment and task management
- ✅ Collaborative commenting system with ownership controls

### Module D: Notifications
- ✅ Real-time notification panel in UI
- ✅ Automated notifications for booking decisions
- ✅ Ticket status change alerts
- ✅ Comment notifications for relevant users

### Module E: Authentication & Authorization
- ✅ OAuth 2.0 with Google Sign-In
- ✅ Role-based access control (USER, ADMIN, TECHNICIAN)
- ✅ JWT token-based session management
- ✅ Protected routes on both frontend and backend

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security with OAuth 2.0 & JWT
- **Database**: MySQL 8.x
- **ORM**: Spring Data JPA / Hibernate
- **Validation**: Jakarta Validation (Bean Validation)
- **Build Tool**: Maven
- **Testing**: JUnit 5, Mockito

### Frontend
- **Framework**: React 18.x with Vite
- **UI Library**: Tailwind CSS / Material-UI / Ant Design (specify yours)
- **State Management**: React Context API / Redux (specify yours)
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Authentication**: OAuth 2.0 flow integration

### DevOps & Tools
- **Version Control**: Git & GitHub
- **CI/CD**: GitHub Actions
- **API Testing**: Postman
- **Development**: VS Code, IntelliJ IDEA


## 🚀 Getting Started

### Prerequisites

- **Java**: JDK 17 or higher
- **Node.js**: v18.x or higher
- **MySQL**: 8.0 or higher
- **Maven**: 3.8+
- **Git**: Latest version

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/HarisAmmar117/it3030-paf-2026-smart-campus-knd_03
   ```

2. **Configure Database**
   
   Create a MySQL database:
   ```sql
   CREATE DATABASE zenith_campus;
   ```
   
   Update `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/zenith_campus
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   
   # OAuth 2.0 Configuration
   spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
   spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
   
   # JWT Configuration
   jwt.secret=your_secret_key_here
   jwt.expiration=86400000
   ```

3. **Build and Run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   
   Backend will start on `http://localhost:8081`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   
   Create `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   Frontend will start on `http://localhost:5173`

### OAuth 2.0 Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:8080/login/oauth2/code/google`
   - `http://localhost:5173/auth/callback`
6. Copy Client ID and Client Secret to configuration files

## 📚 API Documentation

### Base URL
```
http://localhost:8081/api
```

### Custom Headers Used

Your API uses several custom headers for request routing and authorization:

| Header | Type | Description | Example |
|--------|------|-------------|---------|
| `Authorization` | String | JWT Bearer token for authentication | `Bearer eyJhbGc...` |
| `Content-Type` | String | Request body format | `application/json` |
| `userId` | String | User ID for booking operations | `"123"` |
| `X-User-Id` | String | User ID for tickets/notifications | `"123"` |
| `X-User-Role` | String | User role for authorization checks | `"ADMIN"` / `"USER"` / `"TECHNICIAN"` |

**Note**: Different endpoints use different header conventions:
- **Bookings**: Use `userId` header
- **Tickets/Notifications**: Use `X-User-Id` header
- **Admin operations**: Require `X-User-Role` header

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/google` | Google OAuth login | No |
| POST | `/auth/refresh` | Refresh JWT token | Yes |
| POST | `/auth/logout` | Logout user | Yes |

### Resources (Facilities & Assets) Endpoints

| Method | Endpoint | Description | Role | Headers |
|--------|----------|-------------|------|---------|
| GET | `/resources` | Get all resources (optional type filter) | USER | Authorization |
| GET | `/resources?type={type}` | Filter resources by type | USER | Authorization |
| GET | `/resources/{id}` | Get resource by ID | USER | Authorization |
| POST | `/resources` | Create new resource | ADMIN | Authorization, Content-Type |
| PUT | `/resources/{id}` | Update resource | ADMIN | Authorization, Content-Type |
| DELETE | `/resources/{id}` | Delete resource | ADMIN | Authorization |

### Booking Endpoints

| Method | Endpoint | Description | Role | Headers |
|--------|----------|-------------|------|---------|
| GET | `/bookings` | Get all bookings (admin) | ADMIN | Authorization |
| GET | `/bookings/my` | Get user's bookings | USER | Authorization, userId |
| GET | `/bookings/my?status={status}` | Filter user bookings by status | USER | Authorization, userId |
| GET | `/bookings/my?page={page}&size={size}` | Paginated user bookings | USER | Authorization, userId |
| GET | `/bookings/{id}` | Get single booking by ID | USER | Authorization |
| POST | `/bookings` | Create booking request | USER | Authorization, Content-Type, userId |
| PUT | `/bookings/{id}` | Update booking | USER | Authorization, Content-Type, userId |
| PUT | `/bookings/{id}/status` | Update booking status | ADMIN | Authorization, Content-Type |
| DELETE | `/bookings/{id}` | Delete booking | USER/ADMIN | Authorization |

### Incident Tickets Endpoints

| Method | Endpoint | Description | Role | Headers |
|--------|----------|-------------|------|---------|
| GET | `/tickets` | Get all tickets (with filters) | ADMIN | Authorization |
| GET | `/tickets?status={status}` | Filter tickets by status | ADMIN | Authorization |
| GET | `/tickets?priority={priority}` | Filter tickets by priority | ADMIN | Authorization |
| GET | `/tickets?requesterId={id}` | Filter tickets by requester | ADMIN | Authorization |
| POST | `/tickets` | Create new ticket | USER | Authorization, Content-Type, X-User-Id |
| PATCH | `/tickets/{id}` | Update ticket | TECHNICIAN | Authorization, Content-Type, X-User-Id |
| PATCH | `/tickets/{id}/assign` | Assign technician to ticket | ADMIN | Authorization, Content-Type, X-User-Id, X-User-Role |
| PATCH | `/tickets/{id}/status` | Update ticket status | ADMIN/TECH | Authorization, Content-Type, X-User-Id, X-User-Role |
| DELETE | `/tickets/{id}` | Delete ticket | ADMIN | Authorization, X-User-Id |

### Ticket Comments Endpoints

| Method | Endpoint | Description | Role | Headers |
|--------|----------|-------------|------|---------|
| GET | `/tickets/{ticketId}/comments` | Get all comments for a ticket | USER | Authorization |
| POST | `/tickets/{ticketId}/comments` | Add comment to ticket | USER | Authorization, Content-Type, X-User-Id |
| PATCH | `/tickets/{ticketId}/comments/{commentId}` | Update comment | USER/ADMIN | Authorization, Content-Type, X-User-Id, X-User-Role |
| DELETE | `/tickets/{ticketId}/comments/{commentId}` | Delete comment | USER/ADMIN | Authorization, X-User-Id, X-User-Role |

### Ticket Attachments Endpoints

| Method | Endpoint | Description | Role | Headers |
|--------|----------|-------------|------|---------|
| GET | `/tickets/{ticketId}/attachments` | Get all attachments for a ticket | USER | Authorization |
| POST | `/tickets/{ticketId}/attachments` | Upload attachments (max 3 images) | USER | Authorization, multipart/form-data |
| DELETE | `/tickets/{ticketId}/attachments/{attachmentId}` | Delete attachment | USER/ADMIN | Authorization |

### Notifications Endpoints

| Method | Endpoint | Description | Role | Headers |
|--------|----------|-------------|------|---------|
| GET | `/notifications` | Get all notifications (admin) | ADMIN | Authorization |
| GET | `/notifications?recipientId={id}` | Get user's notifications | USER | Authorization |
| GET | `/notifications/unread-count?recipientId={id}` | Get unread count | USER | Authorization |
| POST | `/notifications` | Create notification | ADMIN | Authorization, Content-Type |
| PUT | `/notifications/{id}` | Update notification | ADMIN | Authorization, Content-Type |
| PATCH | `/notifications/{id}/read` | Mark notification as read | USER | Authorization, X-User-Id |
| PATCH | `/notifications/read-all` | Mark all as read | USER | Authorization, X-User-Id |
| DELETE | `/notifications/{id}` | Delete notification (admin) | ADMIN | Authorization |
| DELETE | `/notifications/my/{id}` | Delete own notification | USER | Authorization, X-User-Id |

### User Management Endpoints

| Method | Endpoint | Description | Role | Headers |
|--------|----------|-------------|------|---------|
| GET | `/users` | Get all users | ADMIN | Authorization |
| POST | `/users/support-staff` | Register support staff/technician | ADMIN | Authorization, Content-Type, X-User-Role |


## 👥 Team Contributions

### Member 1: Ahamed Shaamil
- **Backend**: Facilities catalogue management endpoints (GET, POST, PUT, DELETE `/facilities`)
- **Frontend**: Facility search & filter UI, resource management dashboard
- **Database**: Facilities and assets schema design

### Member 2: Haris Ammar
- **Backend**: Booking workflow endpoints (POST, PUT `/bookings`, conflict detection logic)
- **Frontend**: Booking request form, approval workflow UI
- **Features**: Automated conflict checking algorithm

### Member 3: Ahmed Huzaifa
- **Backend**: Incident ticketing system (CRUD operations, image upload handling)
- **Frontend**: Ticket creation form, technician assignment interface
- **Features**: Multi-image upload with validation

### Member 4: Muaadh
- **Backend**: Notifications system, OAuth 2.0 integration, JWT implementation
- **Frontend**: Notification panel, Google sign-in integration
- **Security**: Role-based access control implementation

## 🧪 Testing

### Backend Tests
```bash
cd webapp
mvn test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

### Test Coverage
- Unit tests for service layer business logic
- Integration tests for REST API endpoints
- Postman collection for API testing (included in `/docs/postman`)

## 📸 Screenshots

### Public
![Home](/screenshots/home.png)
![Home_light](/screenshots/home_light.png)
![About](/screenshots/about.png)
![About_light](/screenshots/about_light.png)


### Resources
![Resource Catalogue](/screenshots/resource_catalogue.png)
![Create Resoruce](/screenshots/add_resoruces.png)
![Create Resoruce](/screenshots/manage_resources.png)

### Booking Management
![Create Bookings](/screenshots/add_booking.png)
![User Specific Bookings](/screenshots/my_bookings.png)
![Manage Bookings](/screenshots/manage_bookings.png)

### Incident Tickets
![Manage Tickets](/screenshots/ticket_management.png)
![Create Tickets](/screenshots/create_ticket.png)
![User Specific Tickets](/screenshots/my_tickets.png)

### OAuth Login & Notification
![Login](/screenshots/login.png)
![Manage Notifications](/screenshots/manage_notifications.png)
![User Specific Notifications](/screenshots/my_notification.png)

## 🔒 Security Features

- ✅ OAuth 2.0 authentication with Google
- ✅ JWT-based stateless sessions
- ✅ Role-based access control (RBAC)
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (JPA/Hibernate)
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Secure file upload handling

## 📝 License

This project is developed as part of the IT3030 - Programming Applications and Frameworks course at SLIIT.

## 🙏 Acknowledgments

- SLIIT Faculty of Computing for project guidance
- Google Cloud Platform for OAuth 2.0 services
- Spring Boot and React communities for excellent documentation

## 📧 Contact

For questions or issues, please contact:
- **Team Lead**: [Your Email]
- **GitHub Issues**: [Repository Issues Link]

---

**Course**: IT3030 - Programming Applications and Frameworks  
**Institution**: Sri Lanka Institute of Information Technology (SLIIT)  
**Academic Year**: 2026 Semester 1