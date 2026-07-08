# FixItNow — Video Explanation Script (3-5 minutes)

---

## 🎬 Introduction (30 seconds)

**What to show:** Terminal + Postman side by side

"Hi, this is my FixItNow API — a home services marketplace backend built with Node.js, Express 5, TypeScript, PostgreSQL with Prisma ORM, and JWT authentication. Let me walk you through the architecture and demonstrate all three user roles."

---

## 🏗️ Project Architecture (45 seconds)

**What to show:** Project structure in VS Code

- **Database:** 7 Prisma models — User, TechnicianProfile, Category, Service, Booking, Payment, Review
- **Pattern:** Route → Middleware (Validation + Auth) → Controller → Service → Prisma
- **Auth:** JWT access/refresh tokens, role-based middleware (CUSTOMER, TECHNICIAN, ADMIN)
- **Validation:** Custom TypeScript validation middleware (no external library)
- **Payments:** Stripe integration with webhook for payment confirmation

---

## 👤 Customer Journey (1 minute)

**What to show:** Postman requests

### 1. Register
`POST /api/auth/register` with `{ name, email, password, role: "CUSTOMER" }`

### 2. Login
`POST /api/auth/login` — returns `accessToken`. I'll show the token being auto-set as a collection variable.

### 3. Browse Services
`GET /api/services?search=paint&minPrice=50` — public endpoint, no auth needed

### 4. View Technicians
`GET /api/technicians` — shows available technicians with their profiles and services

### 5. Book a Service
`POST /api/bookings` with `{ serviceId }` — creates a booking with REQUESTED status

### 6. Make Payment
`POST /api/payments/create` with `{ bookingId }` — creates a Stripe PaymentIntent

### 7. Leave Review
`POST /api/reviews` with `{ bookingId, rating, comment }` — only after COMPLETED status

---

## 🛠️ Technician Journey (1 minute)

**What to show:** Login as technician, then demonstrate

### 1. Register as Technician
`POST /api/auth/register` with `{ role: "TECHNICIAN" }`

### 2. Update Profile
`PUT /api/technician/profile` — set bio and experience years

### 3. Set Availability
`PUT /api/technician/availability` — JSON array with days and time slots

### 4. Create Service
`POST /api/services` — add a service under a category with a price

### 5. View Incoming Bookings
`GET /api/technician/bookings` — see bookings from customers

### 6. Accept/Complete
`PATCH /api/technician/bookings/:id` with `{ status: "ACCEPTED" }` then `{ status: "COMPLETED" }` — I'll show the booking status transitions

---

## 👑 Admin Journey (45 seconds)

**What to show:** Login with seed admin credentials

- `admin@fixitnow.com` / `admin123`

### 1. View All Users
`GET /api/admin/users` — see all customers and technicians

### 2. Ban a User
`PATCH /api/admin/users/:id` with `{ isBanned: true }` — demonstrates admin moderation

### 3. View All Bookings
`GET /api/admin/bookings` — full platform overview

### 4. Manage Categories
`GET /api/admin/categories` then `POST /api/admin/categories` — create new service categories

---

## 🐛 Error Handling & Validation (30 seconds)

**What to show:** Sending bad data

- **Missing fields:** `POST /api/auth/register` with empty name → `{ success: false, message: "Name is required", errorDetails: {...} }`
- **Duplicate email:** Register with same email → 409 Conflict
- **Wrong role:** Customer trying admin endpoint → 403 Forbidden
- **404:** Hitting unknown route → `{ success: false, message: "Route not found" }`

"This standardized error format with `success, message, errorDetails` is used across all endpoints."

---

## 💡 Technical Challenge (30 seconds)

"The biggest challenge was the Stripe webhook integration. Stripe webhooks need the raw request body for signature verification, but the JSON body parser modifies it. I solved this by registering the webhook route **before** the `express.json()` middleware, using `express.raw({ type: 'application/json' })` exclusively for that endpoint. This ensures proper signature validation while keeping JSON parsing for all other routes."

---

## ✅ Closing (10 seconds)

"That wraps up the FixItNow API. All source code is on GitHub with 20 meaningful commits. Thanks for watching!"

---

## ⏱️ Timing Summary

| Section | Duration |
|---------|:--------:|
| Introduction | 30s |
| Architecture | 45s |
| Customer Journey | 1m |
| Technician Journey | 1m |
| Admin Journey | 45s |
| Error Handling | 30s |
| Technical Challenge | 30s |
| Closing | 10s |
| **Total** | **~4m 40s** |
