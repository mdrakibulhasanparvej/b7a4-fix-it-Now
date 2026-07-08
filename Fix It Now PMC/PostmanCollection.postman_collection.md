# FixItNow 🔧

**Your Trusted Home Service Platform** — Backend API

---

## 🚀 Live API

- **Base URL:** `http://localhost:5050`
- **Admin Credentials:**
  - Email: `admin@fixitnow.com`
  - Password: `admin123`

---

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (for payment)

---

## 🛠️ Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT secrets, and Stripe keys

# 3. Generate Prisma client
npm run prisma:generate

# 4. Run database migrations
npm run prisma:migrate

# 5. Seed admin user
npm run prisma:seed

# 6. Start development server
npm run dev
```

---

## 📬 Postman Collection

### Import the Collection

1. Open Postman
2. Click **Import** → **Raw text**
3. Copy and paste the JSON below
4. Click **Import**

### Collection Variables

After importing, set these variables:

| Variable | Initial Value |
|----------|---------------|
| `base_url` | `http://localhost:5050` |
| `access_token` | *(leave empty — set automatically on login)* |

### How to Use

1. **Register** — Create a customer, technician, or admin account
2. **Login** — Use the Login request to authenticate (token auto-sets via script)
3. **Explore** — All other endpoints are ready to use with the bearer token

---

### 📦 Postman Collection JSON

```json
{
  "info": {
    "name": "FixItNow API",
    "description": "Home Services Marketplace API - Customers can book technicians, make payments, and leave reviews.",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    { "key": "base_url", "value": "http://localhost:5050" },
    { "key": "access_token", "value": "" }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register Customer",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Customer\",\n  \"email\": \"customer@example.com\",\n  \"password\": \"123456\",\n  \"role\": \"CUSTOMER\"\n}"
            },
            "url": { "raw": "{{base_url}}/api/auth/register", "host": ["{{base_url}}"], "path": ["api", "auth", "register"] }
          }
        },
        {
          "name": "Register Technician",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Mike Technician\",\n  \"email\": \"tech@example.com\",\n  \"password\": \"123456\",\n  \"role\": \"TECHNICIAN\"\n}"
            },
            "url": { "raw": "{{base_url}}/api/auth/register", "host": ["{{base_url}}"], "path": ["api", "auth", "register"] }
          }
        },
        {
          "name": "Login",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.json().success) {",
                  "  pm.collectionVariables.set('access_token', pm.response.json().data.accessToken);",
                  "}"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"customer@example.com\",\n  \"password\": \"123456\"\n}"
            },
            "url": { "raw": "{{base_url}}/api/auth/login", "host": ["{{base_url}}"], "path": ["api", "auth", "login"] }
          }
        },
        {
          "name": "Get My Profile",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{access_token}}" }],
            "url": { "raw": "{{base_url}}/api/auth/me", "host": ["{{base_url}}"], "path": ["api", "auth", "me"] }
          }
        }
      ]
    },
    {
      "name": "Categories",
      "item": [
        {
          "name": "Get All Categories",
          "request": {
            "method": "GET",
            "url": { "raw": "{{base_url}}/api/categories", "host": ["{{base_url}}"], "path": ["api", "categories"] }
          }
        },
        {
          "name": "Create Category (Admin)",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{access_token}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Plumbing\",\n  \"description\": \"Pipe repair and installation\"\n}"
            },
            "url": { "raw": "{{base_url}}/api/categories", "host": ["{{base_url}}"], "path": ["api", "categories"] }
          }
        }
      ]
    },
    {
      "name": "Services",
      "item": [
        {
          "name": "Get All Services",
          "request": {
            "method": "GET",
            "url": { "raw": "{{base_url}}/api/services?search=paint&minPrice=50&maxPrice=200", "host": ["{{base_url}}"], "path": ["api", "services"] }
          }
        },
        {
          "name": "Create Service (Technician)",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{access_token}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Pipe Repair\",\n  \"description\": \"Fix leaking pipes\",\n  \"price\": 80,\n  \"categoryId\": \"REPLACE_WITH_CATEGORY_ID\"\n}"
            },
            "url": { "raw": "{{base_url}}/api/services", "host": ["{{base_url}}"], "path": ["api", "services"] }
          }
        }
      ]
    },
    {
      "name": "Technicians",
      "item": [
        {
          "name": "Get All Technicians",
          "request": {
            "method": "GET",
            "url": { "raw": "{{base_url}}/api/technicians", "host": ["{{base_url}}"], "path": ["api", "technicians"] }
          }
        },
        {
          "name": "Get Technician by ID",
          "request": {
            "method": "GET",
            "url": { "raw": "{{base_url}}/api/technicians/REPLACE_WITH_TECH_ID", "host": ["{{base_url}}"], "path": ["api", "technicians", "REPLACE_WITH_TECH_ID"] }
          }
        },
        {
          "name": "Update Profile (Technician)",
          "request": {
            "method": "PUT",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{access_token}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"bio\": \"Expert plumber with 10 years experience\",\n  \"experienceYears\": 10\n}"
            },
            "url": { "raw": "{{base_url}}/api/technician/profile", "host": ["{{base_url}}"], "path": ["api", "technician", "profile"] }
          }
        },
        {
          "name": "Update Availability (Technician)",
          "request": {
            "method": "PUT",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{access_token}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"availability\": [\n    {\"day\": \"Monday\", \"slots\": [\"09:00-12:00\", \"14:00-17:00\"]},\n    {\"day\": \"Wednesday\", \"slots\": [\"10:00-16:00\"]}\n  ]\n}"
            },
            "url": { "raw": "{{base_url}}/api/technician/availability", "host": ["{{base_url}}"], "path": ["api", "technician", "availability"] }
          }
        },
        {
          "name": "Get My Bookings (Technician)",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{access_token}}" }],
            "url": { "raw": "{{base_url}}/api/technician/bookings", "host": ["{{base_url}}"], "path": ["api", "technician", "bookings"] }
          }
        },
        {
          "name": "Update Booking Status (Technician)",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{access_token}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"ACCEPTED\"\n}"
            },
            "url": { "raw": "{{base_url}}/api/technician/bookings/REPLACE_WITH_BOOKING_ID", "host": ["{{base_url}}"], "path": ["api", "technician", "bookings", "REPLACE_WITH_BOOKING_ID"] }
          }
        }
      ]
    },
    {
      "name": "Bookings",
      "item": [
        {
          "name": "Create Booking (Customer)",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{access_token}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"serviceId\": \"REPLACE_WITH_SERVICE_ID\",\n  \"scheduleDate\": \"2026-07-15T10:00:00Z\"\n}"
            },
            "url": { "raw": "{{base_url}}/api/bookings", "host": ["{{base_url}}"], "path": ["api", "bookings"] }
          }
        },
        {
          "name": "Get My Bookings",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{access_token}}" }],
            "url": { "raw": "{{base_url}}/api/bookings", "host": ["{{base_url}}"], "path": ["api", "bookings"] }
          }
        },
        {
          "name": "Cancel Booking (Customer)",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{access_token}}" }
            ],
            "url": { "raw": "{{base_url}}/api/bookings/REPLACE_WITH_BOOKING_ID/cancel", "host": ["{{base_url}}"], "path": ["api", "bookings", "REPLACE_WITH_BOOKING_ID", "cancel"] }
          }
        }
      ]
    },
    {
      "name": "Payments",
      "item": [
        {
          "name": "Create Payment Intent (Customer)",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{access_token}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"bookingId\": \"REPLACE_WITH_ACCEPTED_BOOKING_ID\"\n}"
            },
            "url": { "raw": "{{base_url}}/api/payments/create", "host": ["{{base_url}}"], "path": ["api", "payments", "create"] }
          }
        },
        {
          "name": "Get Payment History",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{access_token}}" }],
            "url": { "raw": "{{base_url}}/api/payments", "host": ["{{base_url}}"], "path": ["api", "payments"] }
          }
        }
      ]
    },
    {
      "name": "Reviews",
      "item": [
        {
          "name": "Create Review (Customer)",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{access_token}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"bookingId\": \"REPLACE_WITH_COMPLETED_BOOKING_ID\",\n  \"rating\": 5,\n  \"comment\": \"Excellent service!\"\n}"
            },
            "url": { "raw": "{{base_url}}/api/reviews", "host": ["{{base_url}}"], "path": ["api", "reviews"] }
          }
        }
      ]
    },
    {
      "name": "Admin",
      "item": [
        {
          "name": "Get All Users",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{access_token}}" }],
            "url": { "raw": "{{base_url}}/api/admin/users", "host": ["{{base_url}}"], "path": ["api", "admin", "users"] }
          }
        },
        {
          "name": "Ban/Unban User",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{access_token}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"isBanned\": true\n}"
            },
            "url": { "raw": "{{base_url}}/api/admin/users/REPLACE_WITH_USER_ID", "host": ["{{base_url}}"], "path": ["api", "admin", "users", "REPLACE_WITH_USER_ID"] }
          }
        },
        {
          "name": "Get All Bookings",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{access_token}}" }],
            "url": { "raw": "{{base_url}}/api/admin/bookings", "host": ["{{base_url}}"], "path": ["api", "admin", "bookings"] }
          }
        },
        {
          "name": "Create Category (Admin)",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{access_token}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Cleaning\",\n  \"description\": \"Home cleaning services\"\n}"
            },
            "url": { "raw": "{{base_url}}/api/admin/categories", "host": ["{{base_url}}"], "path": ["api", "admin", "categories"] }
          }
        }
      ]
    }
  ]
}
```

---

## 🔗 All Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register user (role: CUSTOMER/TECHNICIAN) |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user profile |
| GET | `/api/categories` | No | List all categories |
| GET | `/api/categories/:id` | No | Get category by ID |
| POST | `/api/categories` | Admin | Create category |
| GET | `/api/services` | No | List services (filter: categoryId, minPrice, maxPrice, search) |
| GET | `/api/services/:id` | No | Get service details |
| POST | `/api/services` | Technician/Admin | Create service |
| GET | `/api/technicians` | No | List all technicians |
| GET | `/api/technicians/:id` | No | Get technician profile with reviews |
| PUT | `/api/technician/profile` | Technician | Update profile |
| PUT | `/api/technician/availability` | Technician | Set availability slots |
| GET | `/api/technician/bookings` | Technician | View my bookings |
| PATCH | `/api/technician/bookings/:id` | Technician | Accept/decline/complete |
| POST | `/api/bookings` | Customer | Create booking |
| GET | `/api/bookings` | Customer/Tech/Admin | List bookings (role-based) |
| GET | `/api/bookings/:id` | Customer/Tech/Admin | Get booking details |
| PATCH | `/api/bookings/:id/cancel` | Customer | Cancel booking |
| POST | `/api/payments/create` | Customer | Create Stripe payment intent |
| POST | `/api/payments/confirm` | Customer | Confirm payment |
| GET | `/api/payments` | Customer/Admin | Payment history |
| POST | `/api/reviews` | Customer | Create review (after completion) |
| GET | `/api/admin/users` | Admin | List all users |
| PATCH | `/api/admin/users/:id` | Admin | Ban/unban user |
| GET | `/api/admin/bookings` | Admin | List all bookings |
| GET | `/api/admin/categories` | Admin | List all categories |
| POST | `/api/admin/categories` | Admin | Create category |

---

## 📁 Project Structure

```
src/
├── server.ts                         # Entry point
├── app.ts                            # Express app setup
├── config/index.ts                   # Config loader
├── lib/prisma.ts                     # Prisma client singleton
├── errors/AppError.ts                # Custom error class
├── utils/
│   ├── catchAsync.ts                 # Async error wrapper
│   ├── sendResponse.ts               # Response helper
│   ├── jwt.ts                        # JWT utilities
│   └── stripe.ts                     # Stripe client
├── middlewares/
│   ├── auth.ts                       # JWT auth + role check
│   ├── notFound.ts                   # 404 handler
│   ├── globalErrorHandler.ts         # Error handler
│   └── validateRequest.ts            # Input validation
├── routes/index.ts                   # Route registry
└── modules/
    ├── auth/                         # Authentication
    ├── user/                         # User management
    ├── category/                     # Service categories
    ├── service/                      # Services
    ├── technician/                   # Technician management
    ├── booking/                      # Bookings
    ├── payment/                      # Payments (Stripe)
    ├── review/                       # Reviews
    └── admin/                        # Admin management
```

---

## 📄 License

This project is part of the Apollo Level 2 Web Development curriculum.
