# FixItNow - Project Assessment Report

> **Date:** 2026-07-07
> **Project:** b7a4-fixitNow — Home Services Marketplace API (Backend)

---

## 1. Project Overview

FixItNow is a **backend API** for a home services marketplace where:
- **Customers** browse services, book technicians, pay online, and leave reviews
- **Technicians** create profiles, set availability, manage bookings
- **Admins** oversee users, bookings, and categories

---

## 2. Current Status — What You've Built ✅

### Tech Stack (Current)
| Technology | Status |
|------------|--------|
| Node.js + Express 5 | ✅ Running |
| TypeScript | ✅ Configured |
| PostgreSQL + Prisma ORM | ✅ Connected |
| JWT Authentication | ✅ Access + Refresh tokens |
| bcryptjs Password Hashing | ✅ 10 salt rounds |
| cookie-parser | ✅ Installed & configured |
| CORS | ✅ Configured |

### Server Entry Points
- `src/server.ts` — Starts Express, connects Prisma, listens on port 5050
- `src/app.ts` — Express app setup (middleware, routes, error handlers)

### Configuration
- `.env` — PORT, DATABASE_URL, BCRYPT_SALT_ROUNDS, JWT secrets, APP_URL
- `src/config/index.ts` — Centralized config loader
- `prisma.config.ts` — Prisma schema pointing to `prisma/schema/`

### Modules Implemented

#### Auth Module (`src/modules/auth/`)
| File | Purpose |
|------|---------|
| `auth.controller.ts` | Login handler — sets httpOnly cookies (accessToken 1d, refreshToken 7d) |
| `auth.service.ts` | Login logic — finds user, compares password (bcrypt), creates JWT tokens |
| `auth.interface.ts` | `LoginPayload` type (email, password) |
| `auth.route.ts` | `POST /api/auth/login` |

#### User Module (`src/modules/user/`)
| File | Purpose |
|------|---------|
| `user.controller.ts` | Register, getMyProfile, updateMyProfile handlers |
| `user.service.ts` | Registration (duplicate check + hash + create User+Profile), profile CRUD |
| `user.interface.ts` | `RegisterUserPayload` type (name, email, password, profilePhoto?) |
| `user.route.ts` | `POST /api/users/register`, `GET /api/users/me`, `PUT /api/users/my-profile` |

### Middleware
| File | Purpose |
|------|---------|
| `src/middlewares/auth.ts` | JWT verification from cookies/header, role-based authorization, suspended account check |
| `src/utils/catchAsync.ts` | Wraps async handlers to forward errors to Express error handler |
| `src/utils/sendResponse.ts` | Standardized JSON response helper `{ success, statusCode, message, data, meta? }` |
| `src/utils/jwt.ts` | `createToken()` and `verifyToken()` utilities |

### Database Connection
- `src/lib/prisma.ts` — Singleton Prisma client with `PrismaPg` adapter

### Current Database Schema (`prisma/schema/`)

#### Enums
```prisma
enum ActiveStatus { ACTIVE, INACTIVE, SUSPENDED }
enum Role { USER, AUTHOR, ADMIN }
enum PostStatus { DRAFT, PUBLISHED, ARCHIVED }
```

#### Models
| Model | Fields | Relations |
|-------|--------|-----------|
| **User** | id, name, email, password, activeStatus, role, createdAt, updatedAt | Profile?, Post[] |
| **Profile** | id, profilePhoto?, bio?, userId, createdAt, updatedAt | User |
| **Post** | id, title, content, thumbnail, isFeatured, status, tags[], views, authorId, createdAt, updatedAt | User (author) |

---

## 3. What Needs to Be Built ❌

### 3.1 Database Schema Redesign

The current schema has **Post** and **Profile** tables that don't match FixItNow. Roles (USER, AUTHOR, ADMIN) need to become **CUSTOMER, TECHNICIAN, ADMIN**.

#### Required Models

```prisma
enum Role { CUSTOMER, TECHNICIAN, ADMIN }
enum BookingStatus { REQUESTED, ACCEPTED, DECLINED, PAID, IN_PROGRESS, COMPLETED }

model User {
  id        String  @id @default(uuid())
  name      String
  email     String  @unique
  password  String
  role      Role    @default(CUSTOMER)
  isBanned  Boolean @default(false)
  createdAt DateTime @default(now())

  technicianProfile   TechnicianProfile?
  services            Service[]
  customerBookings    Booking[]  @relation("CustomerBookings")
  technicianBookings  Booking[]  @relation("TechnicianBookings")
  reviewsAsCustomer   Review[]   @relation("ReviewCustomer")
  reviewsAsTechnician Review[]   @relation("ReviewTechnician")
  payments            Payment[]
}

model TechnicianProfile {
  id              String  @id @default(uuid())
  userId          String  @unique
  bio             String?
  experienceYears Int?
  availability    Json?

  user User @relation(fields: [userId], references: [id])
}

model Category {
  id          String    @id @default(uuid())
  name        String    @unique
  description String?
  services    Service[]
}

model Service {
  id           String   @id @default(uuid())
  title        String
  description  String?
  price        Float
  categoryId   String
  technicianId String

  category   Category  @relation(fields: [categoryId], references: [id])
  technician User      @relation(fields: [technicianId], references: [id])
  bookings   Booking[]
}

model Booking {
  id           String        @id @default(uuid())
  customerId   String
  serviceId    String
  technicianId String
  status       BookingStatus @default(REQUESTED)
  scheduleDate DateTime?

  customer   User     @relation("CustomerBookings", fields: [customerId], references: [id])
  service    Service  @relation(fields: [serviceId], references: [id])
  technician User     @relation("TechnicianBookings", fields: [technicianId], references: [id])
  payment    Payment?
  review     Review?
}

model Payment {
  id            String  @id @default(uuid())
  bookingId     String  @unique
  amount        Float
  provider      String  @default("Stripe")
  transactionId String?
  status        String  @default("PENDING")
  userId        String

  booking Booking @relation(fields: [bookingId], references: [id])
  user    User    @relation(fields: [userId], references: [id])
}

model Review {
  id           String @id @default(uuid())
  bookingId    String @unique
  customerId   String
  technicianId String
  rating       Int
  comment      String?

  booking    Booking @relation(fields: [bookingId], references: [id])
  customer   User    @relation("ReviewCustomer", fields: [customerId], references: [id])
  technician User    @relation("ReviewTechnician", fields: [technicianId], references: [id])
}
```

### 3.2 New Modules Needed (7 Modules)

| Module | Endpoints | Auth |
|--------|-----------|------|
| **Auth** | `POST /register`, `POST /login`, `GET /me` | No / No / All roles |
| **Category** | `GET /categories`, `POST /categories` | No / Admin |
| **Service** | `GET /services`, `POST /services` | No / Technician+Admin |
| **Technician** | `GET /technicians`, `GET /technicians/:id`, `PUT /technician/profile`, `PUT /technician/availability`, `GET /technician/bookings`, `PATCH /technician/bookings/:id` | No / No / Technician / Technician / Technician / Technician |
| **Booking** | `POST /bookings`, `GET /bookings`, `GET /bookings/:id` | Customer / Customer+Technician+Admin / Customer+Technician+Admin |
| **Payment** | `POST /payments/create`, `POST /payments/confirm`, `GET /payments`, `GET /payments/:id` | Customer / Customer / Customer / Customer |
| **Review** | `POST /reviews` | Customer |
| **Admin** | `GET /admin/users`, `PATCH /admin/users/:id`, `GET /admin/bookings`, `GET /admin/categories`, `POST /admin/categories` | Admin |

### 3.3 Infrastructure Missing

| Item | File(s) Needed | Status |
|------|----------------|--------|
| AppError class | `src/errors/AppError.ts` | ❌ Missing |
| Global error handler middleware | `src/middlewares/globalErrorHandler.ts` | ❌ Missing (inline in app.ts) |
| 404 handler middleware | `src/middlewares/notFound.ts` | ❌ Missing (inline in app.ts) |
| Validate request middleware | `src/middlewares/validateRequest.ts` | ❌ Missing |
| Route index | `src/routes/index.ts` | ❌ Missing (routes mounted directly) |
| Seed script | `prisma/seed.ts` | ❌ Missing |
| Validation schemas | Per module (`*.validation.ts`) | ❌ Missing |
| Postman collection | `FixItNow.postman_collection.json` | ❌ Missing |

### 3.4 Small Fixes / Oddities

- `user.route.ts` has `auth(Role.USER, Role.ADMIN, Role.ADMIN)` — `ADMIN` listed **twice** instead of `AUTHOR`
- Auth route `/api/auth/login` exists but **no register** route on auth (only on `/api/users/register`)
- No `/api/auth/me` endpoint (profile is at `/api/users/me`)

### 3.5 Validation Approach

**TypeScript-based manual validation** (no Zod needed). The requirement says "Server-side validation" — I'll implement custom validation functions in a `validateRequest` middleware that checks fields manually and throws structured errors. No extra packages required.

### 3.6 Missing Packages (Will Ask Permission)

| Package | Purpose | Required? |
|---------|---------|:---------:|
| `stripe` or `sslcommerz` | Payment processing | ✅ Mandatory per README |
| `swagger-jsdoc` + `swagger-ui-express` | Auto-generated API docs | ❌ Can use Postman collection instead |

---

## 4. Mandatory Requirements (0 Marks if Missing)

Based on the assignment README:

| # | Requirement | Approach | Current Status |
|:-:|-------------|----------|:--------------:|
| 1 | **API Documentation** — Postman or Swagger | Postman collection (no package needed) | ❌ |
| 2 | **Consistent Error Responses** — `{ success, message, errorDetails }` | Custom error handler | ⚠️ Partial (missing `errorDetails`) |
| 3 | **20 Meaningful Commits** — Descriptive git history | Git init + staged commits | ❌ (No git repo) |
| 4 | **Input Validation** — Server-side validation | Manual TypeScript validation (no Zod) | ❌ |
| 5 | **Admin Credentials** — Working admin email/password | Seed script | ❌ |
| 6 | **Payment Integration** — Stripe or SSLCommerz | Needs package install (awaiting permission) | ❌ |

---

## 5. API Documentation — Postman Collection

A Postman collection will be created covering all endpoints. Below is the complete specification for every request.

### 5.1 Collection Variables

| Variable | Initial Value |
|----------|---------------|
| `base_url` | `http://localhost:5050` |
| `access_token` | *(set from Login response)* |

**Auth Header:** All protected endpoints use `Authorization: Bearer {{access_token}}`

---

### 5.2 Authentication Endpoints

#### Register a User
- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/register`
- **Auth:** None
- **Body** (raw JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "CUSTOMER"
}
```
- **Success Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CUSTOMER",
      "isBanned": false,
      "createdAt": "2026-07-07T..."
    }
  }
}
```

#### Login
- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/login`
- **Auth:** None
- **Body** (raw JSON):
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```
- **Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```
- **Post-response Script:**
```javascript
pm.collectionVariables.set("access_token", pm.response.json().data.accessToken);
```

#### Get Current User
- **Method:** `GET`
- **URL:** `{{base_url}}/api/auth/me`
- **Auth:** Bearer Token (`{{access_token}}`)
- **Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User fetched successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER",
    "isBanned": false,
    "technicianProfile": null
  }
}
```

---

### 5.3 Category Endpoints

#### Get All Categories
- **Method:** `GET`
- **URL:** `{{base_url}}/api/categories`
- **Auth:** None
- **Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Categories fetched successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Plumbing",
      "description": "Pipe repair and installation",
      "services": []
    }
  ]
}
```

#### Create Category (Admin)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/categories`
- **Auth:** Bearer Token (`{{access_token}}`, admin role required)
- **Body** (raw JSON):
```json
{
  "name": "Plumbing",
  "description": "Pipe repair and installation services"
}
```
- **Success Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Category created successfully",
  "data": {
    "id": "uuid",
    "name": "Plumbing",
    "description": "Pipe repair and installation services"
  }
}
```

---

### 5.4 Service Endpoints

#### Get All Services (with filters)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/services?categoryId=uuid&minPrice=50&maxPrice=200&search=paint`
- **Auth:** None
- **Query Parameters:**
  | Param | Type | Description |
  |-------|------|-------------|
  | `categoryId` | string | Filter by category |
  | `minPrice` | number | Minimum price |
  | `maxPrice` | number | Maximum price |
  | `search` | string | Search in title & description |
- **Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Services fetched successfully",
  "data": [
    {
      "id": "uuid",
      "title": "Wall Painting",
      "description": "Interior wall painting service",
      "price": 120,
      "categoryId": "uuid",
      "technicianId": "uuid",
      "category": { "id": "uuid", "name": "Painting" },
      "technician": { "id": "uuid", "name": "Mike" }
    }
  ]
}
```

#### Create Service (Technician/Admin)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/services`
- **Auth:** Bearer Token (technician or admin)
- **Body** (raw JSON):
```json
{
  "title": "Wall Painting",
  "description": "Interior wall painting service",
  "price": 120,
  "categoryId": "uuid"
}
```
- **Success Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Service created successfully",
  "data": {
    "id": "uuid",
    "title": "Wall Painting",
    "price": 120,
    "categoryId": "uuid",
    "technicianId": "uuid"
  }
}
```

---

### 5.5 Technician Endpoints

#### Get All Technicians
- **Method:** `GET`
- **URL:** `{{base_url}}/api/technicians`
- **Auth:** None
- **Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Technicians fetched successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Mike Smith",
      "email": "mike@example.com",
      "technicianProfile": {
        "bio": "10 years experience",
        "experienceYears": 10,
        "availability": [{"day": "Monday", "slots": ["09:00-12:00"]}]
      },
      "services": []
    }
  ]
}
```

#### Get Technician by ID (with reviews)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/technicians/:id`
- **Auth:** None
- **Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Technician fetched successfully",
  "data": {
    "id": "uuid",
    "name": "Mike Smith",
    "technicianProfile": { ... },
    "services": [ ... ],
    "reviews": [
      {
        "id": "uuid",
        "rating": 5,
        "comment": "Excellent work!",
        "customer": { "name": "John" }
      }
    ]
  }
}
```

#### Update Technician Profile
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/technician/profile`
- **Auth:** Bearer Token (technician)
- **Body** (raw JSON):
```json
{
  "bio": "Expert plumber with 10 years of experience",
  "experienceYears": 10
}
```

#### Update Availability
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/technician/availability`
- **Auth:** Bearer Token (technician)
- **Body** (raw JSON):
```json
{
  "availability": [
    { "day": "Monday", "slots": ["09:00-12:00", "14:00-17:00"] },
    { "day": "Wednesday", "slots": ["10:00-16:00"] }
  ]
}
```

#### Get Technician's Bookings
- **Method:** `GET`
- **URL:** `{{base_url}}/api/technician/bookings`
- **Auth:** Bearer Token (technician)

#### Update Booking Status (Accept/Decline/Complete)
- **Method:** `PATCH`
- **URL:** `{{base_url}}/api/technician/bookings/:id`
- **Auth:** Bearer Token (technician)
- **Body** (raw JSON):
```json
{
  "status": "ACCEPTED"
}
```
- **Valid status values:** `ACCEPTED`, `DECLINED`, `IN_PROGRESS`, `COMPLETED`

---

### 5.6 Booking Endpoints

#### Create Booking (Customer)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/bookings`
- **Auth:** Bearer Token (customer)
- **Body** (raw JSON):
```json
{
  "serviceId": "uuid",
  "scheduleDate": "2026-07-15T10:00:00Z"
}
```
- **Success Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Booking created successfully",
  "data": {
    "id": "uuid",
    "customerId": "uuid",
    "serviceId": "uuid",
    "technicianId": "uuid",
    "status": "REQUESTED",
    "scheduleDate": "2026-07-15T10:00:00Z"
  }
}
```

#### Get User's Bookings
- **Method:** `GET`
- **URL:** `{{base_url}}/api/bookings`
- **Auth:** Bearer Token (customer/technician/admin)
- **Note:** Customers see their own, technicians see assigned, admins see all

#### Get Booking Details
- **Method:** `GET`
- **URL:** `{{base_url}}/api/bookings/:id`
- **Auth:** Bearer Token (customer/technician/admin)

---

### 5.7 Payment Endpoints

#### Create Payment Intent
- **Method:** `POST`
- **URL:** `{{base_url}}/api/payments/create`
- **Auth:** Bearer Token (customer)
- **Body** (raw JSON):
```json
{
  "bookingId": "uuid"
}
```
- **Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment intent created",
  "data": {
    "clientSecret": "pi_..._secret_...",
    "payment": {
      "id": "uuid",
      "bookingId": "uuid",
      "amount": 120,
      "provider": "Stripe",
      "status": "PENDING"
    }
  }
}
```

#### Confirm Payment
- **Method:** `POST`
- **URL:** `{{base_url}}/api/payments/confirm`
- **Auth:** Bearer Token (customer)
- **Body** (raw JSON):
```json
{
  "paymentIntentId": "pi_..."
}
```

#### Get Payment History
- **Method:** `GET`
- **URL:** `{{base_url}}/api/payments`
- **Auth:** Bearer Token (customer)

#### Get Payment Details
- **Method:** `GET`
- **URL:** `{{base_url}}/api/payments/:id`
- **Auth:** Bearer Token (customer)

#### Stripe Webhook (for payment callbacks)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/payments/webhook`
- **Auth:** None (validated by Stripe signature)
- **Header:** `stripe-signature: {{webhook_secret}}`
- **Body:** Raw JSON from Stripe

---

### 5.8 Review Endpoints

#### Create Review (Customer, after job completed)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/reviews`
- **Auth:** Bearer Token (customer)
- **Body** (raw JSON):
```json
{
  "bookingId": "uuid",
  "rating": 5,
  "comment": "Excellent service, very professional!"
}
```
- **Success Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Review created successfully",
  "data": {
    "id": "uuid",
    "bookingId": "uuid",
    "customerId": "uuid",
    "technicianId": "uuid",
    "rating": 5,
    "comment": "Excellent service, very professional!"
  }
}
```

---

### 5.9 Admin Endpoints

#### Get All Users
- **Method:** `GET`
- **URL:** `{{base_url}}/api/admin/users`
- **Auth:** Bearer Token (admin)
- **Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CUSTOMER",
      "isBanned": false,
      "createdAt": "2026-07-07T..."
    }
  ]
}
```

#### Ban/Unban User
- **Method:** `PATCH`
- **URL:** `{{base_url}}/api/admin/users/:id`
- **Auth:** Bearer Token (admin)
- **Body** (raw JSON):
```json
{
  "isBanned": true
}
```

#### Get All Bookings (Admin)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/admin/bookings`
- **Auth:** Bearer Token (admin)

#### Get All Categories (Admin)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/admin/categories`
- **Auth:** Bearer Token (admin)

#### Create Category (Admin)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/admin/categories`
- **Auth:** Bearer Token (admin)
- **Body** (raw JSON):
```json
{
  "name": "Electrical",
  "description": "Electrical repair and installation"
}
```

---

### 5.10 Error Response Format (All Endpoints)

**Validation Error (400):**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "errorDetails": [
    { "field": "name", "message": "Name is required" },
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

**Unauthorized (401):**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "You are not logged in"
}
```

**Forbidden (403):**
```json
{
  "success": false,
  "statusCode": 403,
  "message": "You do not have permission"
}
```

**Not Found (404):**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Route not found"
}
```

**Conflict (409):**
```json
{
  "success": false,
  "statusCode": 409,
  "message": "Email already exists"
}
```

---

## 7. Proposed Implementation Plan

### Phase 1 — Core Infrastructure (Zero New Packages)
1. Redesign Prisma schema (all 7 models with correct enums)
2. Create `src/errors/AppError.ts`
3. Create `src/middlewares/notFound.ts` — `{ success: false, message, errorDetails }`
4. Create `src/middlewares/globalErrorHandler.ts` — Handles AppError, validation errors, generic Error
5. Create `src/middlewares/validateRequest.ts` — Generic validation middleware (manual checks)
6. Create `src/routes/index.ts` — Centralized route registry
7. Update `src/middlewares/auth.ts` — Adapt for new roles (CUSTOMER, TECHNICIAN, ADMIN)
8. Update `src/app.ts` — Use route index, proper error handlers

### Phase 2 — New Modules
9. **Auth module** — Add register + me endpoints
10. **Category module** — CRUD with admin protection
11. **Service module** — With search/filter (category, price range)
12. **Technician module** — Profile management, availability, booking management
13. **Booking module** — Create, view, status tracking
14. **Payment module** — Stripe integration (needs package permission)
15. **Review module** — Post-completion review
16. **Admin module** — User management, booking oversight

### Phase 3 — Finishing Touches
17. Seed script for admin user
18. Manual validation schemas for all modules
19. API documentation (Postman collection)
20. Initialize git and make meaningful commits

---

## 8. Booking Status Flow

```
REQUESTED → ACCEPTED → PAID → IN_PROGRESS → COMPLETED
     ↘ DECLINED
```

- Customers can **cancel** anytime before `IN_PROGRESS`
- Only the assigned technician can update booking status
- Payment can only be made when booking is `ACCEPTED`
- Reviews can only be left when booking is `COMPLETED`

---

## 10. Git Commit History (20 Meaningful Commits)

```
1.  feat: initialize project with Express 5, TypeScript, and Prisma ORM
2.  feat: configure Prisma schema with User, Profile, and Post models
3.  feat: implement database connection with PrismaPg adapter
4.  feat: add JWT authentication utilities (createToken, verifyToken)
5.  feat: implement auth middleware with role-based authorization
6.  feat: add catchAsync utility and standardized sendResponse helper
7.  feat: implement user registration with password hashing and profile creation
8.  feat: implement user login with access and refresh token generation
9.  feat: add cookie-parser and CORS configuration
10. feat: add getMyProfile and updateMyProfile endpoints
11. refactor: redesign schema for FixItNow — add categories, services, bookings, payments, reviews
12. feat: create AppError class and global error handler with structured error format
13. feat: add notFound middleware and validateRequest middleware (manual validation)
14. feat: create centralized route index for all modules
15. feat: implement auth module with register and getMe endpoints
16. feat: implement category CRUD with admin-only protection
17. feat: implement service module with search, filter, and price range
18. feat: implement technician module — profile, availability, booking management
19. feat: implement booking module — create, view, cancel, status tracking
20. feat: implement payment module with Stripe integration, webhook, and seed script
```

---

## 11. Architecture Pattern

```
Route → Middleware (Validation + Auth) → Controller → Service → Prisma → PostgreSQL
```

Each module follows this structure:
```
src/modules/<name>/
  ├── <name>.controller.ts   — Request/response handling
  ├── <name>.service.ts      — Business logic + DB queries
  ├── <name>.routes.ts       — Route definitions + middleware chains
  └── <name>.validation.ts   — Input validation schemas
```
