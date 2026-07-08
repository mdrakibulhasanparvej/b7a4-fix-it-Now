# FixItNow 🔧

**Your Trusted Home Service Platform** — Backend API

---

## 📋 Admin Credentials

| Role  | Email                 | Password   |
|-------|-----------------------|------------|
| Admin | `admin@fixitnow.com`  | `admin123` |

---

## 🚀 Quick Start

```bash
npm install
cp .env.example .env   # Edit with your DATABASE_URL, JWT secrets, Stripe keys
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed     # Seeds admin user
npm run dev             # Starts on http://localhost:5050
```

---

## 📬 Postman Collection Import

**File location:** `Fix It Now PMC/fixitNow.postman_collection.json`

### How to Import
1. Open **Postman** desktop app
2. Click **Import** → **Files** → **Upload Files**
3. Select `Fix It Now PMC/fixitNow.postman_collection.json`
4. Click **Import**

### Collection Variables
| Variable       | Initial Value              | Auto-set on Login |
|----------------|----------------------------|-------------------|
| `base_url`     | `http://localhost:5050`    | No                |
| `access_token` | *(empty)*                  | Yes (by test script) |

> **Important:** Run **Login** request first — the test script automatically sets the `access_token` variable for all subsequent requests.

---

## 🧪 API Testing Instructions (Flow by Flow)

### Flow 1: Authentication (Auth folder)

All non-public endpoints require a JWT token. The Login request has a **test script** that auto-saves the token.

---

#### 1.1 Register Customer

Register a new customer account (role will be `CUSTOMER`).

**Request:**
```
POST {{base_url}}/api/auth/register
Content-Type: application/json

{
  "name": "John Customer",
  "email": "customer@example.com",
  "password": "123456",
  "role": "CUSTOMER"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-here",
      "name": "John Customer",
      "email": "customer@example.com",
      "role": "CUSTOMER"
    }
  }
}
```

> **Validation rules:** name (required), email (valid format), password (min 6 chars), role (must be CUSTOMER or TECHNICIAN).

---

#### 1.2 Register Technician

Same endpoint, different role.

**Request:**
```
POST {{base_url}}/api/auth/register
Content-Type: application/json

{
  "name": "Mike Technician",
  "email": "tech@example.com",
  "password": "123456",
  "role": "TECHNICIAN"
}
```

**Response (201 Created)** — Same structure as customer, but `"role": "TECHNICIAN"`.

---

#### 1.3 Login

Login returns both `accessToken` and `refreshToken`. The test script automatically saves the access token to `{{access_token}}`.

**Request:**
```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

> **Note:** Tokens are also set as httpOnly cookies in the response.

---

#### 1.4 Get My Profile

Requires `Authorization: Bearer {{access_token}}` header.

**Request:**
```
GET {{base_url}}/api/auth/me
Authorization: Bearer {{access_token}}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User fetched successfully",
  "data": {
    "id": "uuid-here",
    "name": "John Customer",
    "email": "customer@example.com",
    "role": "CUSTOMER",
    "isBanned": false,
    "createdAt": "2026-07-08T..."
  }
}
```

---

### Flow 2: User Management (User folder)

Alternative user management endpoints.

---

#### 2.1 Register via Users

Alternative registration endpoint (no validation middleware).

**Request:**
```
POST {{base_url}}/api/users/register
Content-Type: application/json

{
  "name": "Jane User",
  "email": "jane@example.com",
  "password": "123456",
  "role": "CUSTOMER"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": { "user": { ... } }
}
```

---

#### 2.2 Get My Profile (User)

**Request:**
```
GET {{base_url}}/api/users/me
Authorization: Bearer {{access_token}}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "My profile retrieved successfully",
  "data": { "profile": { ... } }
}
```

---

#### 2.3 Update My Profile

Update name and email.

**Request:**
```
PUT {{base_url}}/api/users/my-profile
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "name": "Jane Updated",
  "email": "jane@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User profile updated successfully",
  "data": { "user": { ... } }
}
```

---

### Flow 3: Categories (Categories folder)

Manage service categories (Plumbing, Electrical, Cleaning, etc.).

---

#### 3.1 Get All Categories

Public — no auth needed.

**Request:**
```
GET {{base_url}}/api/categories
```

**Response (200 OK):**
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

---

#### 3.2 Get Category by ID

**Request:**
```
GET {{base_url}}/api/categories/REPLACE_WITH_CATEGORY_ID
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Category fetched successfully",
  "data": { "id": "...", "name": "Plumbing", "services": [] }
}
```

> **Error (404):** `{ "success": false, "statusCode": 404, "message": "Category not found" }`

---

#### 3.3 Create Category

Admin only.

**Request:**
```
POST {{base_url}}/api/categories
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "name": "Plumbing",
  "description": "Pipe repair and installation"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Category created successfully",
  "data": { "id": "uuid", "name": "Plumbing", "description": "Pipe repair and installation" }
}
```

> **Error (409):** `{ "message": "Category already exists" }` if name is duplicate.

---

#### 3.4 Update Category

Admin only.

**Request:**
```
PUT {{base_url}}/api/categories/REPLACE_WITH_CATEGORY_ID
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "name": "Plumbing Updated"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Category updated successfully",
  "data": { "id": "uuid", "name": "Plumbing Updated" }
}
```

---

#### 3.5 Delete Category

Admin only.

**Request:**
```
DELETE {{base_url}}/api/categories/REPLACE_WITH_CATEGORY_ID
Authorization: Bearer {{access_token}}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Category deleted successfully",
  "data": null
}
```

---

### Flow 4: Services (Services folder)

Services are created by Technicians under a Category.

---

#### 4.1 Get All Services

Public — supports query filters.

**Request:**
```
GET {{base_url}}/api/services?search=paint&minPrice=50&maxPrice=200
```

**Query Parameters:**
| Param      | Type   | Description                    |
|------------|--------|--------------------------------|
| `search`   | string | Search in title/description    |
| `categoryId` | string | Filter by category ID       |
| `minPrice` | number | Minimum price filter           |
| `maxPrice` | number | Maximum price filter           |

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Services fetched successfully",
  "data": [
    {
      "id": "uuid",
      "title": "Pipe Repair",
      "description": "Fix leaking pipes",
      "price": 80,
      "categoryId": "uuid",
      "technicianId": "uuid",
      "category": { "name": "Plumbing" },
      "technician": { "name": "Mike Technician", "email": "tech@example.com" }
    }
  ]
}
```

---

#### 4.2 Get Service by ID

**Request:**
```
GET {{base_url}}/api/services/REPLACE_WITH_SERVICE_ID
```

**Response (200 OK):** Single service object with category + technician data.

---

#### 4.3 Create Service

Technician or Admin. `technicianId` is auto-assigned from JWT token.

**Request:**
```
POST {{base_url}}/api/services
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "title": "Pipe Repair",
  "description": "Fix leaking pipes",
  "price": 80,
  "categoryId": "REPLACE_WITH_CATEGORY_ID"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Service created successfully",
  "data": { "id": "uuid", "title": "Pipe Repair", "price": 80, ... }
}
```

> **Validation:** title (required), price (required, positive number), categoryId (required).

---

#### 4.4 Update Service

Only the technician who owns the service or Admin can update.

**Request:**
```
PUT {{base_url}}/api/services/REPLACE_WITH_SERVICE_ID
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "title": "Pipe Repair Updated",
  "price": 90
}
```

**Response (200 OK):** Updated service object.

---

#### 4.5 Delete Service

Only the technician who owns the service or Admin can delete.

**Request:**
```
DELETE {{base_url}}/api/services/REPLACE_WITH_SERVICE_ID
Authorization: Bearer {{access_token}}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Service deleted successfully",
  "data": null
}
```

---

### Flow 5: Technicians (Technicians folder)

View and manage technician profiles.

---

#### 5.1 Get All Technicians

Public — shows only non-banned technicians.

**Request:**
```
GET {{base_url}}/api/technicians
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Technicians fetched successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Mike Technician",
      "email": "tech@example.com",
      "role": "TECHNICIAN",
      "technicianProfile": { "bio": null, "experienceYears": null },
      "services": []
    }
  ]
}
```

---

#### 5.2 Get Technician by ID

Public — shows full profile with services and reviews.

**Request:**
```
GET {{base_url}}/api/technicians/REPLACE_WITH_TECH_ID
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Mike Technician",
    "technicianProfile": { "bio": "...", "experienceYears": 10 },
    "services": [ ... ],
    "reviewsAsTechnician": [
      { "rating": 5, "comment": "Excellent!", "customer": { "name": "John" } }
    ]
  }
}
```

---

#### 5.3 Update Profile

Technician only — updates bio and experience.

**Request:**
```
PUT {{base_url}}/api/technician/profile
Authorization: Bearer {{access_token}}    (must be TECHNICIAN role)
Content-Type: application/json

{
  "bio": "Expert plumber with 10 years experience",
  "experienceYears": 10
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "bio": "Expert plumber with 10 years experience",
    "experienceYears": 10,
    "availability": null
  }
}
```

---

#### 5.4 Update Availability

Technician only — sets weekly availability slots.

**Request:**
```
PUT {{base_url}}/api/technician/availability
Authorization: Bearer {{access_token}}    (must be TECHNICIAN role)
Content-Type: application/json

{
  "availability": [
    { "day": "Monday", "slots": ["09:00-12:00", "14:00-17:00"] },
    { "day": "Wednesday", "slots": ["10:00-16:00"] }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Availability updated successfully",
  "data": {
    "availability": [ { "day": "Monday", "slots": [...] } ]
  }
}
```

---

#### 5.5 Get My Bookings (Technician)

Technician only — view all bookings assigned to this technician.

**Request:**
```
GET {{base_url}}/api/technician/bookings
Authorization: Bearer {{access_token}}    (must be TECHNICIAN role)
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "status": "REQUESTED",
      "service": { "title": "Pipe Repair" },
      "customer": { "name": "John Customer" },
      "scheduleDate": "2026-07-15T10:00:00.000Z"
    }
  ]
}
```

---

#### 5.6 Update Booking Status (Technician)

Technician only — accept, decline, start, or complete a booking.

**Valid Status Transitions:**
| Current Status | → Can Change To                          |
|----------------|------------------------------------------|
| REQUESTED      | ACCEPTED, DECLINED, CANCELLED            |
| ACCEPTED       | PAID (via payment), CANCELLED            |
| PAID           | IN_PROGRESS, CANCELLED                   |
| IN_PROGRESS    | COMPLETED                                |

**Request:**
```
PATCH {{base_url}}/api/technician/bookings/REPLACE_WITH_BOOKING_ID
Authorization: Bearer {{access_token}}    (must be TECHNICIAN role)
Content-Type: application/json

{
  "status": "ACCEPTED"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Booking status updated successfully",
  "data": {
    "id": "uuid",
    "status": "ACCEPTED",
    "service": { "title": "Pipe Repair" },
    "customer": { "name": "John Customer" }
  }
}
```

> **Error (400):** `{ "message": "Cannot transition from REQUESTED to COMPLETED" }` if status transition is invalid.

---

### Flow 6: Bookings (Bookings folder)

Customer booking management.

---

#### 6.1 Create Booking

Customer only — books a service.

**Request:**
```
POST {{base_url}}/api/bookings
Authorization: Bearer {{access_token}}    (must be CUSTOMER role)
Content-Type: application/json

{
  "serviceId": "REPLACE_WITH_SERVICE_ID",
  "scheduleDate": "2026-07-15T10:00:00Z"
}
```

**Response (201 Created):**
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
    "scheduleDate": "2026-07-15T10:00:00.000Z",
    "service": { "title": "Pipe Repair" },
    "customer": { "name": "John Customer" },
    "technician": { "name": "Mike Technician" }
  }
}
```

> **Note:** `technicianId` is auto-assigned from the service. `scheduleDate` is optional.

---

#### 6.2 Get My Bookings

Shows bookings based on role:
- **Customer** → sees own bookings (where customerId = userId)
- **Technician** → sees assigned bookings
- **Admin** → sees ALL bookings

**Request:**
```
GET {{base_url}}/api/bookings
Authorization: Bearer {{access_token}}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "status": "REQUESTED",
      "service": { ... },
      "customer": { ... },
      "technician": { ... },
      "payment": null,
      "review": null
    }
  ]
}
```

---

#### 6.3 Cancel Booking

Customer only — cancels their own booking.

**Cancellable statuses:** REQUESTED, ACCEPTED, PAID

**Request:**
```
PATCH {{base_url}}/api/bookings/REPLACE_WITH_BOOKING_ID/cancel
Authorization: Bearer {{access_token}}    (must be CUSTOMER role)
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": { "id": "uuid", "status": "CANCELLED" }
}
```

> **Error (400):** `{ "message": "Cannot cancel booking at current status" }` if booking is IN_PROGRESS or COMPLETED.

---

### Flow 7: Payments (Payments folder)

Stripe payment integration. Booking must be **ACCEPTED** before payment.

---

#### 7.1 Create Payment Intent

Customer only — creates a Stripe PaymentIntent for an accepted booking.

**Request:**
```
POST {{base_url}}/api/payments/create
Authorization: Bearer {{access_token}}    (must be CUSTOMER role)
Content-Type: application/json

{
  "bookingId": "REPLACE_WITH_ACCEPTED_BOOKING_ID"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment intent created successfully",
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "payment": {
      "id": "uuid",
      "bookingId": "uuid",
      "amount": 80,
      "status": "PENDING",
      "transactionId": "pi_xxx"
    }
  }
}
```

> **Requirements:** Booking must be ACCEPTED. Must not already be paid. Price is converted to cents for Stripe ($80 → 8000 cents).

---

#### 7.2 Confirm Payment

Customer only — confirms payment after Stripe completes on frontend.

**Request:**
```
POST {{base_url}}/api/payments/confirm
Authorization: Bearer {{access_token}}    (must be CUSTOMER role)
Content-Type: application/json

{
  "paymentIntentId": "REPLACE_WITH_PAYMENT_INTENT_ID"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment confirmed successfully",
  "data": { "id": "uuid", "status": "COMPLETED", "amount": 80 }
}
```

> **This also updates the booking status to PAID.**

---

#### 7.3 Get Payment History

Customer sees own payments. Admin sees all.

**Request:**
```
GET {{base_url}}/api/payments
Authorization: Bearer {{access_token}}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "amount": 80,
      "status": "COMPLETED",
      "booking": { "service": { "title": "Pipe Repair" } }
    }
  ]
}
```

---

### Flow 8: Reviews (Reviews folder)

Customers can review completed bookings.

---

#### 8.1 Create Review

Customer only — one review per booking, only after COMPLETED.

**Request:**
```
POST {{base_url}}/api/reviews
Authorization: Bearer {{access_token}}    (must be CUSTOMER role)
Content-Type: application/json

{
  "bookingId": "REPLACE_WITH_COMPLETED_BOOKING_ID",
  "rating": 5,
  "comment": "Excellent service!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Review created successfully",
  "data": {
    "id": "uuid",
    "rating": 5,
    "comment": "Excellent service!",
    "booking": { ... },
    "customer": { "name": "John Customer" },
    "technician": { "name": "Mike Technician" }
  }
}
```

> **Validation:** rating (required, 1-5), comment (optional). Booking must be COMPLETED and owned by the customer.

---

### Flow 9: Admin (Admin folder)

Platform administration — requires ADMIN role.

---

#### 9.1 Get All Users

Admin only — lists all users (password excluded).

**Request:**
```
GET {{base_url}}/api/admin/users
Authorization: Bearer {{access_token}}    (must be ADMIN role)
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "John Customer", "email": "customer@example.com", "role": "CUSTOMER", "isBanned": false, "createdAt": "..." },
    { "id": "uuid", "name": "Admin", "email": "admin@fixitnow.com", "role": "ADMIN", "isBanned": false, "createdAt": "..." }
  ]
}
```

---

#### 9.2 Ban Unban User

Admin only — cannot ban another admin.

**Request:**
```
PATCH {{base_url}}/api/admin/users/REPLACE_WITH_USER_ID
Authorization: Bearer {{access_token}}    (must be ADMIN role)
Content-Type: application/json

{
  "isBanned": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User banned successfully",
  "data": { "id": "uuid", "name": "John Customer", "isBanned": true }
}
```

> **Error (400):** `{ "message": "Cannot ban an admin" }`

---

#### 9.3 Get All Bookings

Admin only — sees every booking with all relations.

**Request:**
```
GET {{base_url}}/api/admin/bookings
Authorization: Bearer {{access_token}}    (must be ADMIN role)
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "status": "REQUESTED",
      "customer": { ... },
      "technician": { ... },
      "service": { ... },
      "payment": { ... },
      "review": { ... }
    }
  ]
}
```

---

#### 9.4 Get All Categories

Admin only — alternative category listing.

**Request:**
```
GET {{base_url}}/api/admin/categories
Authorization: Bearer {{access_token}}    (must be ADMIN role)
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [ { "id": "uuid", "name": "Plumbing", "services": [...] } ]
}
```

---

#### 9.5 Create Category

Admin only — alternative category creation.

**Request:**
```
POST {{base_url}}/api/admin/categories
Authorization: Bearer {{access_token}}    (must be ADMIN role)
Content-Type: application/json

{
  "name": "Cleaning",
  "description": "Home cleaning services"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Category created successfully",
  "data": { "id": "uuid", "name": "Cleaning", "description": "Home cleaning services" }
}
```

---

## 🔗 Complete API Endpoint Reference

| Method | Endpoint                             | Auth                 | Description                         |
|--------|--------------------------------------|----------------------|-------------------------------------|
| POST   | `/api/auth/register`                 | None                 | Register user (CUSTOMER/TECHNICIAN) |
| POST   | `/api/auth/login`                    | None                 | Login, returns JWT                  |
| GET    | `/api/auth/me`                       | All roles            | Get current user profile            |
| POST   | `/api/users/register`                | None                 | Alternative registration            |
| GET    | `/api/users/me`                      | All roles            | Get profile (user module)           |
| PUT    | `/api/users/my-profile`              | All roles            | Update name/email                   |
| GET    | `/api/categories`                    | None                 | List all categories                 |
| GET    | `/api/categories/:id`                | None                 | Get category by ID                  |
| POST   | `/api/categories`                    | ADMIN                | Create category                     |
| PUT    | `/api/categories/:id`                | ADMIN                | Update category                     |
| DELETE | `/api/categories/:id`                | ADMIN                | Delete category                     |
| GET    | `/api/services`                      | None                 | List services (filterable)          |
| GET    | `/api/services/:id`                  | None                 | Get service by ID                   |
| POST   | `/api/services`                      | TECHNICIAN, ADMIN    | Create service                      |
| PUT    | `/api/services/:id`                  | TECHNICIAN, ADMIN    | Update service                      |
| DELETE | `/api/services/:id`                  | TECHNICIAN, ADMIN    | Delete service                      |
| GET    | `/api/technicians`                   | None                 | List all technicians                |
| GET    | `/api/technicians/:id`               | None                 | Get technician with reviews         |
| PUT    | `/api/technician/profile`            | TECHNICIAN           | Update bio/experience               |
| PUT    | `/api/technician/availability`       | TECHNICIAN           | Set availability slots              |
| GET    | `/api/technician/bookings`           | TECHNICIAN           | View technician bookings            |
| PATCH  | `/api/technician/bookings/:id`       | TECHNICIAN           | Accept/decline/complete booking     |
| POST   | `/api/bookings`                      | CUSTOMER             | Create booking                      |
| GET    | `/api/bookings`                      | CUSTOMER, TECH, ADMIN| List bookings (role-based)          |
| PATCH  | `/api/bookings/:id/cancel`           | CUSTOMER             | Cancel booking                      |
| POST   | `/api/payments/create`               | CUSTOMER             | Create Stripe payment intent        |
| POST   | `/api/payments/confirm`              | CUSTOMER             | Confirm payment                     |
| GET    | `/api/payments`                      | CUSTOMER, ADMIN      | Payment history                     |
| POST   | `/api/reviews`                       | CUSTOMER             | Create review (after completion)    |
| GET    | `/api/admin/users`                   | ADMIN                | List all users                      |
| PATCH  | `/api/admin/users/:id`               | ADMIN                | Ban/unban user                      |
| GET    | `/api/admin/bookings`                | ADMIN                | List all bookings                   |
| GET    | `/api/admin/categories`              | ADMIN                | List all categories                 |
| POST   | `/api/admin/categories`              | ADMIN                | Create category                     |

---

## 📊 Complete Testing Flow (Recommended Order)

To test all features end-to-end, follow this order:

```
Step 1:  Admin Login → Login as admin@fixitnow.com / admin123
Step 2:  Create Categories → Create "Plumbing", "Cleaning", "Electrical"
Step 3:  Register Technician → Register tech@example.com
Step 4:  Technician Login → Login as tech@example.com
Step 5:  Create Service → Create "Pipe Repair" under Plumbing
Step 6:  Update Profile → Add bio and experience years
Step 7:  Update Availability → Set weekly schedule
Step 8:  Register Customer → Register customer@example.com
Step 9:  Customer Login → Login as customer@example.com
Step 10: Create Booking → Book the "Pipe Repair" service
Step 11: Technician accepts → Login as tech, ACCEPT the booking
Step 12: Create Payment → Customer creates Stripe payment
Step 13: Complete Job → Technician marks IN_PROGRESS → COMPLETED
Step 14: Review → Customer creates a review
Step 15: Admin checks → View all users, bookings, categories
```

---

## ⚠️ Error Response Format

All errors follow this consistent structure:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "errorDetails": {
    "stack": "Error stack trace..."
  }
}
```

| Status Code | Meaning                      |
|-------------|------------------------------|
| 400         | Bad request / Validation     |
| 401         | Unauthorized (not logged in) |
| 403         | Forbidden (wrong role/banned)|
| 404         | Resource not found           |
| 409         | Conflict (duplicate)         |
| 500         | Internal server error        |

---

## 📁 Project Structure

```
src/
├── server.ts                       # Entry point
├── app.ts                          # Express setup
├── config/index.ts                 # Environment config
├── lib/prisma.ts                   # Prisma client
├── errors/AppError.ts              # Custom error
├── utils/
│   ├── catchAsync.ts               # Error wrapper
│   ├── sendResponse.ts             # Response helper
│   ├── jwt.ts                      # JWT utils
│   └── stripe.ts                   # Stripe singleton
├── middlewares/
│   ├── auth.ts                     # JWT auth + roles
│   ├── notFound.ts                 # 404 handler
│   ├── globalErrorHandler.ts       # Error handler
│   └── validateRequest.ts          # Input validation
├── routes/index.ts                 # Route registry
└── modules/
    ├── auth/                       # Authentication
    ├── user/                       # User management
    ├── category/                   # Categories
    ├── service/                    # Services
    ├── technician/                 # Technicians
    ├── booking/                    # Bookings
    ├── payment/                    # Stripe payments
    ├── review/                     # Reviews
    └── admin/                      # Admin panel
```
