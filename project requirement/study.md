# FixItNow - Complete Codebase Study Guide / সম্পূর্ণ কোডবেস স্টাডি গাইড

> **Language**: Each section has explanations in English 🇬🇧 and Bengali 🇧🇩
> **ভাষা**: প্রতিটি অংশ ইংরেজি 🇬🇧 এবং বাংলা 🇧🇩 তে ব্যাখ্যা করা হয়েছে

---

## Table of Contents / সূচিপত্র

1. [Project Overview / প্রকল্প ওভারভিউ](#1-project-overview)
2. [Configuration Files / কনফিগারেশন ফাইল](#2-configuration-files)
3. [Database Schema / ডাটাবেস স্কিমা](#3-database-schema)
4. [Entry Points / এন্ট্রি পয়েন্ট](#4-entry-points)
5. [Utilities / ইউটিলিটি](#5-utilities)
6. [Custom Error / কাস্টম এরর](#6-custom-error)
7. [Middlewares / মিডলওয়্যার](#7-middlewares)
8. [Route Index / রুট ইনডেক্স](#8-route-index)
9. [Auth Module / অথ মডিউল](#9-auth-module)
10. [Category Module / ক্যাটাগরি মডিউল](#10-category-module)
11. [Service Module / সার্ভিস মডিউল](#11-service-module)
12. [Technician Module / টেকনিশিয়ান মডিউল](#12-technician-module)
13. [Booking Module / বুকিং মডিউল](#13-booking-module)
14. [Payment Module / পেমেন্ট মডিউল](#14-payment-module)
15. [Review Module / রিভিউ মডিউল](#15-review-module)
16. [Admin Module / অ্যাডমিন মডিউল](#16-admin-module)
17. [Seed Script / সিড স্ক্রিপ্ট](#17-seed-script)
18. [Swagger / সোয়াগার](#18-swagger)

---

## 1. Project Overview / প্রকল্প ওভারভিউ

FixItNow is a **backend API** for a home services marketplace. Think of it like an Uber for home repairs — customers find technicians, book them, pay online, and leave reviews.

FixItNow একটি **ব্যাকএন্ড API** যা হোম সার্ভিস মার্কেটপ্লেসের জন্য। এটি একটি উবারের মতো কিন্তু বাড়ির মেরামতের জন্য — গ্রাহকরা টেকনিশিয়ান খুঁজে পান, বুক করেন, অনলাইনে পেমেন্ট করেন এবং রিভিউ দেন।

### Three User Roles / তিন ধরনের ইউজার রোল

| Role / ভূমিকা | What they can do / যা করতে পারে |
|---------------|-------------------------------|
| **CUSTOMER** | Browse services, book technicians, pay, review |
| **TECHNICIAN** | Create profile, set availability, manage bookings |
| **ADMIN** | Manage users, categories, view all bookings |

### Tech Stack / টেক স্ট্যাক

| Technology | Purpose / উদ্দেশ্য |
|------------|-------------------|
| **Node.js + Express 5** | Server framework |
| **TypeScript** | Type safety |
| **PostgreSQL + Prisma** | Database + ORM |
| **JWT** | Authentication |
| **Stripe** | Payment processing |
| **Zod** | Input validation |
| **Swagger** | API documentation |

---

## 2. Configuration Files / কনফিগারেশন ফাইল

### `package.json`

```json
{
  "type": "module",
  "main": "dist/src/server.js",
  "scripts": {
    "build": "tsc",
    "start": "tsx src/server.ts",
    "dev": "tsx watch src/server.ts",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "tsx prisma/seed.ts",
    "prisma:studio": "prisma studio"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "express": "^5.2.1",
    "@prisma/client": "^7.8.0",
    "bcrypt": "^6.0.0",
    "jsonwebtoken": "^9.0.3",
    "stripe": "^22.3.0",
    "zod": "^4.4.3",
    "swagger-jsdoc": "^6.3.0",
    "swagger-ui-express": "^5.0.1",
    "tsx": "^4.19.0"
  }
}
```

**Line by line explanation / লাইন ধরে ব্যাখ্যা:**

| Line | English | বাংলা |
|------|---------|-------|
| `"type": "module"` | Tells Node.js to use ES Modules (import/export) instead of CommonJS (require) | Node.js কে ES Modules ব্যবহার করতে বলে, CommonJS না |
| `"main": "dist/src/server.js"` | Points to the compiled entry file | কম্পাইল করা এন্ট্রি ফাইল নির্দেশ করে |
| `"build": "tsc"` | Compiles TypeScript to JavaScript | TypeScript কে JavaScript এ কম্পাইল করে |
| `"start": "tsx src/server.ts"` | Runs server directly with tsx (TypeScript executor) | tsx দিয়ে সরাসরি সার্ভার চালায় |
| `"dev": "tsx watch src/server.ts"` | Runs server in watch mode (auto-restart on changes) | ওয়াচ মোডে সার্ভার চালায় (ফাইল পরিবর্তনে অটো-রিস্টার্ট) |
| `"prisma:seed": "tsx prisma/seed.ts"` | Seeds database with initial data (admin user) | ডাটাবেসে প্রাথমিক ডাটা দেয় (অ্যাডমিন ইউজার) |

**Dependencies explained / ডিপেন্ডেন্সি ব্যাখ্যা:**

| Package | Purpose (English) | উদ্দেশ্য (বাংলা) |
|---------|-------------------|-------------------|
| express | Web framework for routing & middleware | রাউটিং ও মিডলওয়্যারের জন্য ওয়েব ফ্রেমওয়ার্ক |
| @prisma/client | Database ORM client | ডাটাবেস ORM ক্লায়েন্ট |
| bcrypt | Password hashing | পাসওয়ার্ড হ্যাশ করা |
| jsonwebtoken | JWT token creation/verification | JWT টোকেন তৈরি/ভেরিফিকেশন |
| stripe | Payment processing API | পেমেন্ট প্রসেসিং API |
| zod | Schema validation | স্কিমা ভ্যালিডেশন |
| tsx | TypeScript execution for Node.js | Node.js এ TypeScript চালানোর জন্য |

---

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*", "generated/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

| Option | English | বাংলা |
|--------|---------|-------|
| `target: "ES2022"` | Compile to modern JavaScript (ES2022) | আধুনিক JavaScript এ কম্পাইল করবে |
| `module: "ESNext"` | Keep ES module syntax in output | আউটপুটে ES module সিনট্যাক্স রাখবে |
| `moduleResolution: "bundler"` | Import resolution like bundlers (no .js needed) | বান্ডলারের মত import রেজলভ করে (.js লাগে না) |
| `strict: true` | Enable all strict type checks | সব strict type check চালু করে |
| `esModuleInterop: true` | Allows default imports from CommonJS modules | CommonJS মডিউল থেকে default import অনুমতি দেয় |
| `rootDir: "."` | Project root is current directory | প্রজেক্ট রুট হলো বর্তমান ডিরেক্টরি |
| `outDir: "./dist"` | Compiled files go to `dist/` folder | কম্পাইল করা ফাইল `dist/` ফোল্ডারে যায় |
| `include: ["src/**/*", "generated/**/*"]` | Compile both source and generated Prisma files | সোর্স এবং জেনারেটেড Prisma ফাইল দুটোই কম্পাইল করে |

---

### `prisma.config.ts`

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

| Line | English | বাংলা |
|------|---------|-------|
| `import "dotenv/config"` | Load environment variables from `.env` file | `.env` ফাইল থেকে এনভায়রনমেন্ট ভেরিয়েবল লোড করে |
| `defineConfig({...})` | Prisma configuration object | Prisma কনফিগারেশন অবজেক্ট |
| `schema: "prisma/schema.prisma"` | Location of Prisma schema file | Prisma schema ফাইলের লোকেশন |
| `migrations.path` | Where migration files are stored | মাইগ্রেশন ফাইল যেখানে রাখা হয় |
| `seed: "tsx prisma/seed.ts"` | Command to seed database | ডাটাবেস সিড করার কমান্ড |
| `url: env("DATABASE_URL")` | Read database URL from environment | এনভায়রনমেন্ট থেকে DATABASE_URL পড়ে |

---

## 3. Database Schema / ডাটাবেস স্কিমা

### `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum Role {
  CUSTOMER
  TECHNICIAN
  ADMIN
}

enum BookingStatus {
  REQUESTED
  ACCEPTED
  DECLINED
  PAID
  IN_PROGRESS
  COMPLETED
}
```

**Enums explained / এনাম ব্যাখ্যা:**

| Enum | English | বাংলা |
|------|---------|-------|
| `Role` | Three user roles: CUSTOMER, TECHNICIAN, ADMIN | তিন ধরনের ইউজার রোল |
| `BookingStatus` | Booking lifecycle statuses | বুকিং এর লাইফসাইকেল স্ট্যাটাস |

**BookingStatus flow / বুকিং স্ট্যাটাস ফ্লো:**
```
REQUESTED → ACCEPTED → PAID → IN_PROGRESS → COMPLETED
     ↘ DECLINED
```

---

#### User Model

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(CUSTOMER)
  isBanned  Boolean  @default(false)
  createdAt DateTime @default(now())

  technicianProfile   TechnicianProfile?
  services            Service[]
  customerBookings    Booking[]     @relation("CustomerBookings")
  technicianBookings  Booking[]     @relation("TechnicianBookings")
  reviewsAsCustomer   Review[]      @relation("ReviewCustomer")
  reviewsAsTechnician Review[]      @relation("ReviewTechnician")
  payments            Payment[]
}
```

| Field | English | বাংলা |
|-------|---------|-------|
| `@id @default(uuid())` | Auto-generates a unique UUID for each user | প্রতিটি ইউজারের জন্য ইউনিক UUID অটো-জেনারেট করে |
| `email @unique` | Email must be unique in the database | ইমেইল ডাটাবেসে ইউনিক হতে হবে |
| `role @default(CUSTOMER)` | Default role is CUSTOMER | ডিফল্ট রোল হলো CUSTOMER |
| `isBanned @default(false)` | Users are not banned by default | ইউজাররা ডিফল্টভাবে ব্যান করা না |
| `technicianProfile?` | Optional one-to-one relation with TechnicianProfile | TechnicianProfile এর সাথে অপশনাল ওয়ান-টু-ওয়ান রিলেশন |
| `services` | One-to-many: a technician can have many services | ওয়ান-টু-ম্যানি: একজন টেকনিশিয়ানের অনেকগুলি সার্ভিস থাকতে পারে |

---

#### TechnicianProfile Model

```prisma
model TechnicianProfile {
  id              String @id @default(uuid())
  userId          String @unique
  bio             String?
  experienceYears Int?
  availability    Json?

  user User @relation(fields: [userId], references: [id])
}
```

| Field | English | বাংলা |
|-------|---------|-------|
| `userId @unique` | Links to User, must be unique | User এর সাথে লিংক, ইউনিক হতে হবে |
| `bio?` | Optional biography text | অপশনাল বায়োগ্রাফি টেক্সট |
| `experienceYears?` | Optional years of experience | অপশনাল বছরের অভিজ্ঞতা |
| `availability Json?` | Stores availability slots as JSON (e.g. `[{"day":"Monday","slots":["09:00-12:00"]}]`) | JSON আকারে সময়ের স্লট রাখে |
| `@relation(fields: [userId], references: [id])` | Foreign key to User table | User টেবিলের ফরেন কী |

---

#### Category Model

```prisma
model Category {
  id          String @id @default(uuid())
  name        String @unique
  description String?

  services Service[]
}
```

| Field | English | বাংলা |
|-------|---------|-------|
| `name @unique` | Category name must be unique (e.g. "Plumbing") | ক্যাটাগরি নাম ইউনিক হতে হবে |
| `services` | One-to-many: a category has many services | ওয়ান-টু-ম্যানি: একটি ক্যাটাগরিতে অনেক সার্ভিস |

---

#### Service Model

```prisma
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
```

| Field | English | বাংলা |
|-------|---------|-------|
| `price Float` | Service price (e.g. 80.50) | সার্ভিসের মূল্য |
| `categoryId` | Foreign key to Category | Category এর ফরেন কী |
| `technicianId` | Foreign key to User (who is the technician) | User এর ফরেন কী (যিনি টেকনিশিয়ান) |

---

#### Booking Model

```prisma
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
```

| Field | English | বাংলা |
|-------|---------|-------|
| `status @default(REQUESTED)` | Starts as REQUESTED when created | তৈরি হলে REQUESTED থাকে |
| `scheduleDate?` | Optional scheduled appointment date/time | অপশনাল অ্যাপয়েন্টমেন্ট তারিখ/সময় |
| `payment?` | Optional one-to-one with Payment | Payment এর সাথে অপশনাল ওয়ান-টু-ওয়ান |
| `review?` | Optional one-to-one with Review | Review এর সাথে অপশনাল ওয়ান-টু-ওয়ান |

---

#### Payment Model

```prisma
model Payment {
  id            String   @id @default(uuid())
  bookingId     String   @unique
  amount        Float
  provider      String   @default("Stripe")
  transactionId String?
  status        String   @default("PENDING")
  userId        String

  booking Booking @relation(fields: [bookingId], references: [id])
  user    User    @relation(fields: [userId], references: [id])
}
```

| Field | English | বাংলা |
|-------|---------|-------|
| `bookingId @unique` | One booking can have only one payment | একটি বুকিং শুধুমাত্র একটি পেমেন্ট থাকতে পারে |
| `provider @default("Stripe")` | Payment provider (Stripe) | পেমেন্ট প্রোভাইডার |
| `transactionId?` | Stripe payment intent ID | Stripe পেমেন্ট ইন্টেন্ট আইডি |
| `status @default("PENDING")` | PENDING → COMPLETED | পেন্ডিং → কমপ্লিটেড |

---

#### Review Model

```prisma
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

| Field | English | বাংলা |
|-------|---------|-------|
| `bookingId @unique` | Only one review per booking | প্রতি বুকিং এ শুধুমাত্র একটি রিভিউ |
| `rating Int` | Rating 1-5 | রেটিং ১-৫ |

---

## 4. Entry Points / এন্ট্রি পয়েন্ট

### `src/server.ts`

```ts
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5060;

app.listen(port, () => {
  console.log(`FixItNow server running on port ${port}`);
});
```

| Line | English | বাংলা |
|------|---------|-------|
| `import app from "./app"` | Import the Express app from app.ts | app.ts থেকে Express app ইম্পোর্ট |
| `dotenv.config()` | Load `.env` file variables into `process.env` | `.env` ফাইল থেকে ভেরিয়েবল `process.env` এ লোড |
| `const port = process.env.PORT \|\| 5060` | Use PORT from .env or default 5060 | .env থেকে PORT বা ডিফল্ট 5060 ব্যবহার |
| `app.listen(port, ...)` | Start server and listen on the port | সার্ভার স্টার্ট করে পোর্টে লিসেন |

**English**: This is the entry point. It loads environment variables, creates the port number, and starts the Express server.

**বাংলা**: এটি এন্ট্রি পয়েন্ট। এটি এনভায়রনমেন্ট ভেরিয়েবল লোড করে, পোর্ট নাম্বার তৈরি করে এবং Express সার্ভার চালু করে।

---

### `src/app.ts`

```ts
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import router from "./routes/index";
import { swaggerSpec } from "./swagger";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { requestLogger } from "./middlewares/requestLogger";
import * as paymentController from "./modules/payment/payment.controller";

const app = express();

app.use(cors());
app.use(requestLogger);

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentController.webhook
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "FixItNow API is running",
    docs: "/api-docs",
    health: "/health",
    endpoints: { /* ... */ },
  });
});

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
```

| Line | English | বাংলা |
|------|---------|-------|
| `import express from "express"` | Import Express framework | Express ফ্রেমওয়ার্ক ইম্পোর্ট |
| `import cors from "cors"` | Import CORS middleware (allows cross-origin requests) | CORS মিডলওয়্যার ইম্পোর্ট (ক্রস-অরিজিন রিকোয়েস্ট অনুমতি দেয়) |
| `import swaggerUi from "swagger-ui-express"` | Import Swagger UI for API docs | API ডক্সের জন্য Swagger UI ইম্পোর্ট |
| `const app = express()` | Create Express application instance | Express অ্যাপ্লিকেশন ইনস্ট্যান্স তৈরি |
| `app.use(cors())` | Enable CORS for all routes | সব রুটের জন্য CORS চালু |
| `app.use(requestLogger)` | Log every request (method, URL, timestamp) | প্রতিটি রিকোয়েস্ট লগ করে (মেথড, URL, টাইমস্ট্যাম্প) |
| `express.raw({ type: "application/json" })` | Raw body parser for Stripe webhook (needs raw body for signature verification) | Stripe webhook এর জন্য raw body পার্সার (সিগনেচার ভেরিফিকেশনের জন্য raw body দরকার) |
| `app.use(express.json())` | Parse JSON request bodies | JSON রিকোয়েস্ট বডি পার্স করে |
| `app.get("/", ...)` | Root route — shows API info in browser | রুট রুট — ব্রাউজারে API তথ্য দেখায় |
| `app.get("/health", ...)` | Health check endpoint | হেলথ চেক এন্ডপয়েন্ট |
| `app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))` | Serve Swagger documentation at /api-docs | /api-docs এ Swagger ডকুমেন্টেশন সার্ভ করে |
| `app.use("/api", router)` | Mount all API routes under /api | সব API রুট /api এর আন্ডারে মাউন্ট করে |
| `app.use(notFound)` | 404 handler — catches unmatched routes | 404 হ্যান্ডলার — অম্যাচড রুট ক্যাচ করে |
| `app.use(globalErrorHandler)` | Global error handler — catches all errors | গ্লোবাল এরর হ্যান্ডলার — সব এরর ক্যাচ করে |

**Order matters in Express! / Express এ অর্ডার গুরুত্বপূর্ণ:**

1. CORS + Logger (before any request handling)
2. Stripe webhook route (before JSON parser — needs raw body)
3. JSON parser (for all other routes)
4. Root + Health routes
5. Swagger UI
6. All API routes (`/api`)
7. 404 handler (if no route matched)
8. Error handler (if any error occurred)

---

## 5. Utilities / ইউটিলিটি

### `src/utils/catchAsync.ts`

```ts
import { Request, Response, NextFunction } from "express";

export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
```

**English**: This is a wrapper function for async route handlers. In Express, if an async function throws an error, it won't be caught automatically — Express needs the error to be passed to `next()`. `catchAsync` wraps every async handler so if it throws, the error is caught and forwarded to the global error handler via `next(err)`.

**বাংলা**: এটি async রুট হ্যান্ডলারদের জন্য একটি র‍্যাপার ফাংশন। Express এ, যদি একটি async ফাংশন এরর থ্রো করে, সেটি অটোমেটিক্যালি ক্যাচ হয় না — Express কে `next()` এর মাধ্যমে এরর পাঠাতে হয়। `catchAsync` প্রতিটি async হ্যান্ডলারকে র‍্যাপ করে যাতে এরর থ্রো করলে সেটি ক্যাচ হয়ে `next(err)` এর মাধ্যমে গ্লোবাল এরর হ্যান্ডলারে যায়।

**Pattern / প্যাটার্ন**: Every controller function is wrapped like:
```ts
export const getAll = catchAsync(async (req, res) => { ... });
```

---

### `src/utils/sendResponse.ts`

```ts
import { Response } from "express";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
```

| Part | English | বাংলা |
|------|---------|-------|
| `<T>` | Generic type — works with any data type | জেনেরিক টাইপ — যেকোন ডাটা টাইপের সাথে কাজ করে |
| `statusCode` | HTTP status code (200, 201, etc.) | HTTP স্ট্যাটাস কোড |
| `message` | Human-readable message | মানুষের পড়ার উপযোগী মেসেজ |
| `data` | The actual response data | প্রকৃত রেসপন্স ডাটা |
| `res.status(code).json(...)` | Set status and send JSON response | স্ট্যাটাস সেট করে JSON রেসপন্স পাঠায় |

**Response format / রেসপন্স ফরম্যাট:**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [ ... ]
}
```

This ensures **consistent response format** across all endpoints.

এটি সব এন্ডপয়েন্টে **অভিন্ন রেসপন্স ফরম্যাট** নিশ্চিত করে।

---

### `src/utils/prismaClient.ts`

```ts
import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export default prisma;
```

| Line | English | বাংলা |
|------|---------|-------|
| `dotenv.config()` | Load .env file BEFORE importing Prisma (needs DATABASE_URL) | Prisma ইম্পোর্টের আগে .env লোড করে (DATABASE_URL দরকার) |
| `PrismaClient` | The Prisma ORM client to query database | Prisma ORM ক্লায়েন্ট যা ডাটাবেসে কোয়েরি করে |
| `PrismaPg` | PostgreSQL adapter for Prisma | Prisma এর জন্য PostgreSQL অ্যাডাপ্টার |
| `process.env.DATABASE_URL!` | `!` tells TypeScript "trust me, this is not undefined" | `!` টাইপস্ক্রিপ্টকে বলে "বিশ্বাস কর, এটি undefined না" |
| `export default prisma` | Export single instance (singleton pattern) — one connection reused everywhere | একক instance এক্সপোর্ট (সিঙ্গেলটন প্যাটার্ন) — এক কানেকশন সব জায়গায় ব্যবহার হয় |

**English**: This creates a single Prisma client instance. The `!` after `process.env.DATABASE_URL` is TypeScript's "non-null assertion" — we know it exists because .env has it. Using a single instance (singleton pattern) is important for connection pooling.

**বাংলা**: এটি একটি একক Prisma client instance তৈরি করে। `process.env.DATABASE_URL` এর পরে `!` হল TypeScript এর "non-null assertion" — আমরা জানি এটি আছে কারণ .env এ এটি আছে। একক instance ব্যবহার (সিঙ্গেলটন প্যাটার্ন) কানেকশন পুলিং এর জন্য গুরুত্বপূর্ণ।

---

### `src/utils/stripe.ts`

```ts
import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";

export const stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
```

**English**: Creates a Stripe client instance using the secret key from .env. This is used in the payment module to create payment intents, confirm payments, and handle webhooks.

**বাংলা**: .env থেকে সিক্রেট কী ব্যবহার করে একটি Stripe ক্লায়েন্ট instance তৈরি করে। এটি পেমেন্ট মডিউলে পেমেন্ট ইন্টেন্ট তৈরি, পেমেন্ট কনফার্ম এবং ওয়েবহুক হ্যান্ডল করতে ব্যবহৃত হয়।

---

## 6. Custom Error / কাস্টম এরর

### `src/errors/AppError.ts`

```ts
export class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
```

| Part | English | বাংলা |
|------|---------|-------|
| `class AppError extends Error` | Custom error class that extends built-in Error | বিল্ট-ইন Error ক্লাসকে এক্সটেন্ড করে কাস্টম এরর ক্লাস |
| `public statusCode: number` | HTTP status code (e.g., 404, 401, 403, 400) | HTTP স্ট্যাটাস কোড |
| `super(message)` | Call parent Error constructor with message | মেসেজ সহ প্যারেন্ট Error কনস্ট্রাক্টর কল করে |
| `Error.captureStackTrace(this, this.constructor)` | Captures stack trace for debugging | ডিবাগিং এর জন্য স্ট্যাক ট্রেস ক্যাপচার করে |

**Usage example / ব্যবহারের উদাহরণ:**
```ts
throw new AppError(404, "User not found");
throw new AppError(401, "Invalid credentials");
throw new AppError(403, "You do not have permission");
```

**English**: This custom error class lets us throw errors with HTTP status codes. The global error handler catches these and sends the appropriate HTTP response.

**বাংলা**: এই কাস্টম এরর ক্লাস আমাদের HTTP স্ট্যাটাস কোড সহ এরর থ্রো করতে দেয়। গ্লোবাল এরর হ্যান্ডলার এগুলো ক্যাচ করে উপযুক্ত HTTP রেসপন্স পাঠায়।

---

## 7. Middlewares / মিডলওয়্যার

### `src/middlewares/auth.ts`

```ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { catchAsync } from "../utils/catchAsync";
import prisma from "../utils/prismaClient";

interface JwtPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
```

**English**: This middleware handles authentication and authorization. It:
1. Extracts JWT token from `Authorization: Bearer <token>` header
2. Verifies the token using `JWT_SECRET`
3. Checks if the user exists and is not banned
4. Checks if the user's role is allowed for this route
5. Attaches `req.user` with `{ userId, role }` for downstream use

The `declare global` block adds a `user` property to Express's `Request` type so TypeScript knows about it.

**বাংলা**: এই মিডলওয়্যার অথেনটিকেশন এবং অথরাইজেশন হ্যান্ডল করে। এটি:
1. `Authorization: Bearer <token>` হেডার থেকে JWT টোকেন বের করে
2. `JWT_SECRET` ব্যবহার করে টোকেন ভেরিফাই করে
3. ইউজার আছে কিনা এবং ব্যান করা নেই কিনা চেক করে
4. ইউজারের রোল এই রুটের জন্য অনুমোদিত কিনা চেক করে
5. `req.user` এ `{ userId, role }` অ্যাটাচ করে পরবর্তী ব্যবহারের জন্য

**Key code logic / মূল কোড লজিক:**

```ts
export const auth = (...allowedRoles: string[]) => {
  return catchAsync(async (req, res, next) => {
    // 1. Extract token from "Bearer xxx"
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : undefined;
    if (!token) throw new AppError(401, "You are not authorized");

    // 2. Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // 3. Check user exists & not banned
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) throw new AppError(401, "User not found");
    if (user.isBanned) throw new AppError(403, "Your account has been banned");

    // 4. Check role permission
    if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
      throw new AppError(403, "You do not have permission");
    }

    // 5. Attach user to request
    req.user = decoded;
    next();
  });
};
```

**Role check examples / রোল চেকের উদাহরণ:**
```ts
auth("ADMIN")                    // Only admin
auth("CUSTOMER")                 // Only customer
auth("CUSTOMER", "TECHNICIAN")   // Both customer and technician
auth()                           // Any authenticated user (any role)
```

---

### `src/middlewares/globalErrorHandler.ts`

```ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { ZodError } from "zod";

export const globalErrorHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorDetails: unknown = {};

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = { stack: err.stack };
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation error";
    errorDetails = err.issues;  // Zod gives detailed issue array
  } else if (err instanceof Error) {
    message = err.message;
    errorDetails = { stack: err.stack };
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};
```

| Error Type | Status | Example |
|-----------|--------|---------|
| `AppError` | Custom status (404, 401, etc.) | `AppError(404, "Not found")` |
| `ZodError` | 400 | Invalid input from validation |
| Generic `Error` | 500 | Unexpected errors |

**Response format / রেসপন্স ফরম্যাট:**
```json
{
  "success": false,
  "message": "Validation error",
  "errorDetails": [
    { "code": "invalid_type", "message": "Expected string, received undefined", "path": ["body", "name"] }
  ]
}
```

**English**: Every error in the app passes through this middleware. It checks the error type and formats a consistent error response.

**বাংলা**: অ্যাপের প্রতিটি এরর এই মিডলওয়্যারের মাধ্যমে যায়। এটি এরর টাইপ চেক করে এবং একটি কনসিস্টেন্ট এরর রেসপন্স ফরম্যাট করে।

---

### `src/middlewares/notFound.ts`

```ts
import { Request, Response } from "express";

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    errorDetails: {},
  });
};
```

**English**: If a request reaches this middleware, it means no route matched. It returns a 404 with a standard format. This is placed AFTER all routes in `app.ts`.

**বাংলা**: যদি একটি রিকোয়েস্ট এই মিডলওয়্যারে পৌঁছায়, তার মানে কোনো রুট ম্যাচ করেনি। এটি স্ট্যান্ডার্ড ফরম্যাটে 404 রিটার্ন করে। এটি `app.ts` এ সব রুটের **পরে** বসানো হয়।

---

### `src/middlewares/requestLogger.ts`

```ts
import { Request, Response, NextFunction } from "express";

export const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
```

**English**: Logs every HTTP request with timestamp, method, and URL. For example:
`[2026-07-06T19:57:11.441Z] GET /api/services`

**বাংলা**: প্রতিটি HTTP রিকোয়েস্ট টাইমস্ট্যাম্প, মেথড এবং URL সহ লগ করে। উদাহরণ:
`[2026-07-06T19:57:11.441Z] GET /api/services`

---

### `src/middlewares/validateRequest.ts`

```ts
import { Request, Response, NextFunction } from "express";

export const validateRequest = (schema: any) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        cookies: req.cookies,
      });
      req.body = parsed.body as typeof req.body;
      next();
    } catch (err) {
      next(err);
    }
  };
};
```

| Line | English | বাংলা |
|------|---------|-------|
| `schema: any` | Any Zod schema (we don't need strict typing here) | যেকোন Zod স্কিমা |
| `schema.parseAsync({ body, query, cookies })` | Validates all inputs against the schema | সব ইনপুট স্কিমা অনুযায়ী ভ্যালিডেট করে |
| `req.body = parsed.body` | Replaces body with validated (and possibly transformed) data | বডি ভ্যালিডেটেড (এবং সম্ভবত ট্রান্সফর্মড) ডাটা দিয়ে রিপ্লেস করে |
| `catch (err) { next(err) }` | Passes Zod errors to global error handler | Zod এরর গ্লোবাল এরর হ্যান্ডলারে পাঠায় |

**English**: This middleware wraps any route that needs input validation. The Zod schema defines what the input should look like. If validation fails, Zod throws an error that the global handler formats nicely.

**বাংলা**: এই মিডলওয়্যার যেকোন রুটকে র‍্যাপ করে যাতে ইনপুট ভ্যালিডেশন দরকার। Zod স্কিমা defines করে ইনপুট কেমন হওয়া উচিত। ভ্যালিডেশন ফেল করলে Zod এরর থ্রো করে যা গ্লোবাল হ্যান্ডলার সুন্দরভাবে ফরম্যাট করে।

---

## 8. Route Index / রুট ইনডেক্স

### `src/routes/index.ts`

```ts
import { Router } from "express";

const router = Router();

const moduleRoutes = [
  { path: "/auth", route: authRoutes },
  { path: "/categories", route: categoryRoutes },
  { path: "/services", route: serviceRoutes },
  { path: "/bookings", route: bookingRoutes },
  { path: "/technician/bookings", route: technicianBookingRoutes },
  { path: "/payments", route: paymentRoutes },
  { path: "/technicians", route: technicianRoutes },
  { path: "/technician/profile", route: technicianProfileRoutes },
  { path: "/technician/availability", route: technicianAvailabilityRoutes },
  { path: "/reviews", route: reviewRoutes },
  { path: "/admin", route: adminRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
```

**English**: This is the central route registry. All module routes are collected here and mounted under their respective paths. The `forEach` loop does `router.use("/auth", authRoutes)`, `router.use("/categories", categoryRoutes)`, etc.

The final URL paths become:
- `GET /api/auth/register`
- `GET /api/categories`
- `POST /api/bookings`
- etc.

**বাংলা**: এটি কেন্দ্রীয় রুট রেজিস্ট্রি। সব মডিউল রুট এখানে সংগ্রহ করা হয় এবং তাদের নিজ নিজ পাথের অধীনে মাউন্ট করা হয়। `forEach` লুপটি `router.use("/auth", authRoutes)`, `router.use("/categories", categoryRoutes)` ইত্যাদি করে।

**Complete API table / সম্পূর্ণ API টেবিল:**

| Method | Path | Auth | Module |
|--------|------|------|--------|
| POST | /api/auth/register | No | Auth |
| POST | /api/auth/login | No | Auth |
| GET | /api/auth/me | Yes | Auth |
| GET | /api/categories | No | Category |
| POST | /api/categories | Admin | Category |
| GET | /api/services | No | Service |
| POST | /api/services | Admin/Tech | Service |
| GET | /api/technicians | No | Technician |
| GET | /api/bookings | Customer/Tech | Booking |
| POST | /api/bookings | Customer | Booking |
| PATCH | /api/technician/bookings/:id | Technician | Booking |
| POST | /api/payments/create | Customer | Payment |
| GET | /api/payments | Customer | Payment |
| POST | /api/reviews | Customer | Review |
| GET | /api/admin/users | Admin | Admin |
| GET | /api/admin/bookings | Admin | Admin |

---

## 9. Auth Module / অথ মডিউল

### `src/modules/auth/auth.validation.ts`

```ts
import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["CUSTOMER", "TECHNICIAN"]).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
  }),
});
```

**English**: Zod schemas that define what a valid registration or login request looks like. `z.string().email()` validates email format. `z.enum([...])` restricts role to CUSTOMER or TECHNICIAN. `optional()` makes role not required.

**বাংলা**: Zod স্কিমা যা defines করে একটি বৈধ রেজিস্ট্রেশন বা লগইন রিকোয়েস্ট কেমন হবে। `z.string().email()` ইমেইল ফরম্যাট ভ্যালিডেট করে। `z.enum([...])` রোলকে CUSTOMER বা TECHNICIAN এ সীমাবদ্ধ করে। `optional()` রোলকে আবশ্যক না করে।

---

### `src/modules/auth/auth.service.ts`

```ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../utils/prismaClient";
import { AppError } from "../../errors/AppError";
```

**English**: The service layer contains the business logic. Let's look at each function:

**বাংলা**: সার্ভিস লেয়ারে বিজনেস লজিক থাকে। চলুন প্রতিটি ফাংশন দেখি:

---

#### `registerUser`

```ts
export const registerUser = async (data) => {
  // 1. Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new AppError(409, "Email already exists");

  // 2. Hash password (10 salt rounds)
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 3. Create user in database
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: (data.role as any) || "CUSTOMER",
    },
  });

  // 4. If technician, auto-create their profile
  if (user.role === "TECHNICIAN") {
    await prisma.technicianProfile.create({ data: { userId: user.id } });
  }

  // 5. Generate JWT token (expires in 7 days)
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { token, user: { id, name, email, role } };
};
```

| Step | English | বাংলা |
|------|---------|-------|
| 1 | Check if email is already taken | ইমেইল আগে নেওয়া হয়েছে কিনা চেক |
| 2 | Hash password with bcrypt (salt rounds = 10) | bcrypt দিয়ে পাসওয়ার্ড হ্যাশ (সল্ট রাউন্ড = 10) |
| 3 | Save user to database | ইউজার ডাটাবেসে সেভ |
| 4 | Auto-create TechnicianProfile if role is TECHNICIAN | রোল TECHNICIAN হলে অটো-প্রোফাইল তৈরি |
| 5 | Create JWT with userId and role, expires in 7 days | userId এবং role সহ JWT তৈরি, 7 দিনে মেয়াদ শেষ |

**Why hash password? / কেন পাসওয়ার্ড হ্যাশ করি?**
Never store plain-text passwords! `bcrypt.hash` converts "password123" into a scrambled string like `$2b$10$...`. Even if hackers steal the database, they can't know the original password.

কখনো প্লেইন-টেক্সট পাসওয়ার্ড সংরক্ষণ করবেন না! `bcrypt.hash` "password123" কে স্ক্র্যাম্বলড স্ট্রিং যেমন `$2b$10$...` এ রূপান্তর করে। হ্যাকাররা ডাটাবেস চুরি করলেও আসল পাসওয়ার্ড জানতে পারবে না।

---

#### `loginUser`

```ts
export const loginUser = async (data) => {
  // 1. Find user by email
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new AppError(401, "Invalid credentials");

  // 2. Check if banned
  if (user.isBanned) throw new AppError(403, "Your account has been banned");

  // 3. Compare password with hash
  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) throw new AppError(401, "Invalid credentials");

  // 4. Generate JWT
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { token, user: { id, name, email, role } };
};
```

| Step | English | বাংলা |
|------|---------|-------|
| 1 | Find user by email | ইমেইল দিয়ে ইউজার খুঁজে |
| 2 | Check if account is banned | অ্যাকাউন্ট ব্যান করা আছে কিনা চেক |
| 3 | Compare password with stored hash | পাসওয়ার্ড সংরক্ষিত হ্যাশের সাথে তুলনা |
| 4 | Return JWT token | JWT টোকেন রিটার্ন |

**Why same message for "user not found" and "wrong password"?**
It's a security practice. If we say "Email not found", hackers can find which emails are registered. Always say "Invalid credentials".

**কেন "user not found" এবং "wrong password" এর জন্য একই মেসেজ?**
এটি একটি নিরাপত্তা অভ্যাস। যদি আমরা বলি "Email not found", হ্যাকাররা জানতে পারে কোন ইমেইল রেজিস্টার্ড। সবসময় "Invalid credentials" বলুন।

---

#### `getMe`

```ts
export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { technicianProfile: true },
  });
  if (!user) throw new AppError(404, "User not found");
  return user;
};
```

**English**: Fetches the authenticated user's full profile. `include: { technicianProfile: true }` loads the related technician profile if it exists.

**বাংলা**: অথেনটিকেটেড ইউজারের সম্পূর্ণ প্রোফাইল আনে। `include: { technicianProfile: true }` সম্পর্কিত টেকনিশিয়ান প্রোফাইল থাকলে তা লোড করে।

---

### `src/modules/auth/auth.controller.ts`

```ts
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import * as authService from "./auth.service";

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);
  sendResponse(res, 201, "User registered successfully", result);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  sendResponse(res, 200, "Login successful", result);
});

export const me = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.userId);
  sendResponse(res, 200, "User fetched successfully", user);
});
```

**English**: Controllers are thin layers — they receive the HTTP request, call the service function, and send the response. No business logic here. `catchAsync` wraps every function for error handling. `req.user!.userId` uses `!` because the auth middleware guarantees `req.user` exists.

**বাংলা**: কন্ট্রোলাররা পাতলা লেয়ার — তারা HTTP রিকোয়েস্ট পায়, সার্ভিস ফাংশন কল করে এবং রেসপন্স পাঠায়। এখানে কোন বিজনেস লজিক নেই। `catchAsync` প্রতিটি ফাংশনকে এরর হ্যান্ডলিং এর জন্য র‍্যাপ করে। `req.user!.userId` এ `!` ব্যবহার করা হয়েছে কারণ auth মিডলওয়্যার গ্যারান্টি দেয় `req.user` আছে।

---

### `src/modules/auth/auth.routes.ts`

```ts
import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { registerSchema, loginSchema } from "./auth.validation";
import * as authController from "./auth.controller";

const router = Router();

router.post("/register", validateRequest(registerSchema), authController.register);
router.post("/login", validateRequest(loginSchema), authController.login);
router.get("/me", auth("CUSTOMER", "TECHNICIAN", "ADMIN"), authController.me);

export const authRoutes = router;
```

| Route | Middleware | Controller |
|-------|------------|------------|
| `POST /register` | `validateRequest(registerSchema)` | `authController.register` |
| `POST /login` | `validateRequest(loginSchema)` | `authController.login` |
| `GET /me` | `auth("CUSTOMER", "TECHNICIAN", "ADMIN")` | `authController.me` |

**English**: Routes connect HTTP methods + paths to middleware chains + controllers. The `@openapi` comments (shown above each route in the full file) generate Swagger documentation automatically.

**বাংলা**: রুটগুলি HTTP মেথড + পাথকে মিডলওয়্যার চেইন + কন্ট্রোলারের সাথে সংযুক্ত করে। `@openapi` কমেন্টগুলি (পূর্ণ ফাইলে প্রতিটি রুটের উপরে দেখানো) অটোমেটিক্যালি Swagger ডকুমেন্টেশন জেনারেট করে।

---

## 10. Category Module / ক্যাটাগরি মডিউল

### `src/modules/category/category.validation.ts`

```ts
export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
  }),
});
```

**English**: Create requires a name (required). Update makes both fields optional since you can update just the name OR just the description.

**বাংলা**: ক্রিয়েটের জন্য নাম আবশ্যক। আপডেটে উভয় ফিল্ড অপশনাল কারণ আপনি শুধু নাম বা শুধু বিবরণ আপডেট করতে পারেন।

---

### `src/modules/category/category.service.ts`

```ts
import prisma from "../../utils/prismaClient";
import { AppError } from "../../errors/AppError";

export const getAllCategories = async () => {
  return prisma.category.findMany({ include: { services: true } });
};
```

**English**: `findMany` gets all categories. `include: { services: true }` loads related services for each category.

**বাংলা**: `findMany` সব ক্যাটাগরি আনে। `include: { services: true }` প্রতিটি ক্যাটাগরির জন্য সম্পর্কিত সার্ভিস লোড করে।

```ts
export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { services: true },
  });
  if (!category) throw new AppError(404, "Category not found");
  return category;
};
```

**English**: `findUnique` finds by ID. Throws 404 if not found. Every single "get by ID" function follows this exact pattern.

**বাংলা**: `findUnique` আইডি দিয়ে খুঁজে। না পেলে 404 থ্রো করে। প্রতিটি "get by ID" ফাংশন এই একই প্যাটার্ন অনুসরণ করে।

```ts
export const createCategory = async (data) => {
  const existing = await prisma.category.findUnique({ where: { name: data.name } });
  if (existing) throw new AppError(409, "Category already exists");
  return prisma.category.create({ data });
};
```

**English**: Before creating, check if a category with the same name exists (409 Conflict). `name` has `@unique` in the schema too as a safety net.

**বাংলা**: তৈরি করার আগে, একই নামের ক্যাটাগরি আছে কিনা চেক (409 Conflict)। নিরাপত্তার জন্য স্কিমায় `name` এর `@unique`ও আছে।

```ts
export const updateCategory = async (id, data) => {
  await getCategoryById(id);  // Reuse! Checks existence
  return prisma.category.update({ where: { id }, data });
};

export const deleteCategory = async (id) => {
  await getCategoryById(id);  // Reuse! Checks existence
  return prisma.category.delete({ where: { id } });
};
```

**English**: The `getCategoryById` function is reused here — it both validates existence AND returns the data. This is DRY (Don't Repeat Yourself) principle.

**বাংলা**: `getCategoryById` ফাংশন এখানে পুনরায় ব্যবহার করা হয়েছে — এটি অস্তিত্ব যাচাইও করে এবং ডাটাও রিটার্ন করে। এটি DRY (Don't Repeat Yourself) নীতি।

---

### `src/modules/category/category.controller.ts`

```ts
export const getAll = catchAsync(async (_req, res) => {
  const categories = await categoryService.getAllCategories();
  sendResponse(res, 200, "Categories fetched successfully", categories);
});

export const getById = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  sendResponse(res, 200, "Category fetched successfully", category);
});

export const create = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  sendResponse(res, 201, "Category created successfully", category);
});

export const update = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  sendResponse(res, 200, "Category updated successfully", category);
});

export const remove = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  sendResponse(res, 200, "Category deleted successfully", null);  // data is null
});
```

**English**: Standard CRUD controller. Notice `remove` sends `null` as data since there's nothing to return after deletion. `_req` (with underscore) means "I know I'm not using this parameter."

**বাংলা**: স্ট্যান্ডার্ড CRUD কন্ট্রোলার। লক্ষ্য করুন `remove` ডাটা হিসেবে `null` পাঠায় কারণ ডিলিট করার পর ফেরত দেওয়ার কিছু নেই। `_req` (আন্ডারস্কোর সহ) মানে "আমি জানি আমি এই প্যারামিটার ব্যবহার করছি না।"

---

## 11. Service Module / সার্ভিস মডিউল

### `src/modules/service/service.service.ts`

```ts
export const getAllServices = async (filters) => {
  const where: any = {};

  if (filters.categoryId) where.categoryId = filters.categoryId;

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.service.findMany({
    where,
    include: { category: true, technician: true },
  });
};
```

**English**: Dynamic filtering — builds a `where` object based on which filters are provided. `gte` = greater than or equal, `lte` = less than or equal. `mode: "insensitive"` makes search case-insensitive. `OR` matches either title OR description.

Example query: `GET /api/services?categoryId=abc&minPrice=50&search=paint`

**বাংলা**: ডায়নামিক ফিল্টারিং — কোন ফিল্টার দেওয়া হয়েছে তার উপর ভিত্তি করে `where` অবজেক্ট তৈরি করে। `gte` = বড় বা সমান, `lte` = ছোট বা সমান। `mode: "insensitive"` সার্চকে কেস-ইনসেনসিটিভ করে। `OR` টাইটেল বা বিবরণ যেকোনোটিতে ম্যাচ করে।

---

### `src/modules/service/service.controller.ts`

```ts
export const getAll = catchAsync(async (req, res) => {
  const { categoryId, minPrice, maxPrice, search } = req.query;
  const services = await serviceService.getAllServices({
    categoryId: categoryId as string | undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    search: search as string | undefined,
  });
  sendResponse(res, 200, "Services fetched successfully", services);
});
```

**English**: Query parameters come as strings from the URL. `Number(minPrice)` converts "50" to 50. `as string | undefined` is TypeScript type casting since `req.query` values are `string | string[] | undefined`.

**বাংলা**: কুয়েরি প্যারামিটারগুলি URL থেকে স্ট্রিং হিসেবে আসে। `Number(minPrice)` "50" কে 50 এ রূপান্তর করে। `as string | undefined` টাইপস্ক্রিপ্ট টাইপ কাস্টিং কারণ `req.query` ভ্যালুগুলি `string | string[] | undefined` হয়।

```ts
export const create = catchAsync(async (req, res) => {
  const service = await serviceService.createService({
    ...req.body,                          // Spread: title, description, price, categoryId
    technicianId: req.user!.userId,       // Add technician ID from JWT
  });
  sendResponse(res, 201, "Service created successfully", service);
});
```

**English**: When creating a service, the `technicianId` comes from the authenticated user's JWT token, not from the request body. This prevents a user from creating a service under someone else's name.

**বাংলা**: সার্ভিস তৈরি করার সময়, `technicianId` JWT টোকেন থেকে আসে, রিকোয়েস্ট বডি থেকে নয়। এটি প্রতিরোধ করে যে একজন ইউজার অন্য কারো নামে সার্ভিস তৈরি করতে পারবে না।

---

## 12. Technician Module / টেকনিশিয়ান মডিউল

### `src/modules/technician/technician.service.ts`

```ts
export const updateProfile = async (userId, data) => {
  // 1. Verify user exists and is a TECHNICIAN
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { technicianProfile: true },
  });
  if (!user || user.role !== "TECHNICIAN") {
    throw new AppError(403, "Only technicians can update their profile");
  }

  // 2. Upsert: Create if doesn't exist, Update if exists
  const profile = await prisma.technicianProfile.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
    include: { user: true },
  });

  return profile;
};
```

**English**: `upsert` = **UP**date + in**SERT**. If a profile exists, update it. If not, create one. This is useful because the profile is auto-created empty during registration, but we use upsert as a safety measure.

**বাংলা**: `upsert` = আপডেট + ইনসার্ট। যদি প্রোফাইল থাকে, আপডেট করে। না থাকলে, নতুন তৈরি করে। এটি উপকারী কারণ রেজিস্ট্রেশনের সময় প্রোফাইল খালি তৈরি হয়, কিন্তু আমরা নিরাপত্তার জন্য upsert ব্যবহার করি।

```ts
export const updateAvailability = async (userId, availability) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "TECHNICIAN") {
    throw new AppError(403, "Only technicians can set availability");
  }

  const profile = await prisma.technicianProfile.upsert({
    where: { userId },
    update: { availability },
    create: { userId, availability },
  });

  return profile;
};
```

**English**: Availability is stored as JSON in the `availability` field. The JSON structure is flexible — it could be anything the frontend sends. This gives developers freedom.

**বাংলা**: অ্যাভেইলেবিলিটি `availability` ফিল্ডে JSON আকারে সংরক্ষিত হয়। JSON গঠন নমনীয় — এটি ফ্রন্টএন্ড যা পাঠায় তা হতে পারে। এটি ডেভেলপারদের স্বাধীনতা দেয়।

Example availability JSON / উদাহরণ:
```json
{
  "availability": [
    { "day": "Monday", "slots": ["09:00-12:00", "14:00-17:00"] },
    { "day": "Wednesday", "slots": ["10:00-16:00"] }
  ]
}
```

---

### `src/modules/technician/technician.routes.ts`

```ts
const router = Router();
const profileRouter = Router();
const availabilityRouter = Router();

router.get("/", technicianController.getAll);                    // GET /api/technicians
router.get("/:id", technicianController.getById);                // GET /api/technicians/:id
profileRouter.put("/", auth("TECHNICIAN"), ...);                 // PUT /api/technician/profile
availabilityRouter.put("/", auth("TECHNICIAN"), ...);            // PUT /api/technician/availability

export const technicianRoutes = router;
export const technicianProfileRoutes = profileRouter;
export const technicianAvailabilityRoutes = availabilityRouter;
```

**English**: Notice the use of separate routers for different path prefixes. In the route index:
- `/technicians` uses `technicianRoutes` → `GET /technicians`, `GET /technicians/:id`
- `/technician/profile` uses `technicianProfileRoutes` → `PUT /technician/profile`
- `/technician/availability` uses `technicianAvailabilityRoutes` → `PUT /technician/availability`

**বাংলা**: লক্ষ্য করুন বিভিন্ন পাথ প্রিফিক্সের জন্য আলাদা রাউটার ব্যবহার করা হয়েছে। রুট ইনডেক্সে:
- `/technicians` → `GET /technicians`, `GET /technicians/:id`
- `/technician/profile` → `PUT /technician/profile`
- `/technician/availability` → `PUT /technician/availability`

---

## 13. Booking Module / বুকিং মডিউল

### `src/modules/booking/booking.service.ts`

#### `createBooking`

```ts
export const createBooking = async (data) => {
  // 1. Get the service to find its technician
  const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
  if (!service) throw new AppError(404, "Service not found");

  // 2. Create booking with technician from the service
  const booking = await prisma.booking.create({
    data: {
      customerId: data.customerId,
      serviceId: data.serviceId,
      technicianId: service.technicianId,  // Automatically assign the technician
      scheduleDate: data.scheduleDate ? new Date(data.scheduleDate) : null,
    },
    include: { service: true, customer: true, technician: true },
  });

  return booking;
};
```

**English**: When a customer books, the `technicianId` comes from the service itself — not from the customer's request. This prevents customers from choosing any technician. The scheduleDate is converted from string to Date object.

**বাংলা**: যখন একজন গ্রাহক বুক করেন, `technicianId` সার্ভিস থেকেই আসে — গ্রাহকের রিকোয়েস্ট থেকে নয়। এটি গ্রাহকদের যেকোনো টেকনিশিয়ান বেছে নিতে বাধা দেয়। scheduleDate স্ট্রিং থেকে Date অবজেক্টে রূপান্তরিত হয়।

---

#### `getMyBookings`

```ts
export const getMyBookings = async (userId, role) => {
  const where =
    role === "CUSTOMER"
      ? { customerId: userId }
      : role === "TECHNICIAN"
        ? { technicianId: userId }
        : {};  // Admin sees all

  return prisma.booking.findMany({
    where,
    include: { service: true, customer: true, technician: true, payment: true, review: true },
    orderBy: { id: "desc" },
  });
};
```

**English**: Role-based filtering. Customers see bookings where they're the customer. Technicians see bookings where they're the technician. Admins see all (empty `where`). `orderBy: { id: "desc" }` shows newest first.

**বাংলা**: রোল-ভিত্তিক ফিল্টারিং। গ্রাহকরা দেখে যেখানে তারা গ্রাহক। টেকনিশিয়ানরা দেখে যেখানে তারা টেকনিশিয়ান। অ্যাডমিনরা সব দেখে (খালি `where`)। `orderBy: { id: "desc" }` নতুনগুলি আগে দেখায়।

---

#### `getBookingById`

```ts
export const getBookingById = async (bookingId, userId, role) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true, customer: true, technician: true, payment: true, review: true },
  });
  if (!booking) throw new AppError(404, "Booking not found");

  // Role-based access control
  if (role === "CUSTOMER" && booking.customerId !== userId) {
    throw new AppError(403, "You can only view your own bookings");
  }
  if (role === "TECHNICIAN" && booking.technicianId !== userId) {
    throw new AppError(403, "You can only view your own bookings");
  }

  return booking;
};
```

**English**: This shows authorization at the data level — even with a valid JWT, you can only view your own bookings. Admins can view any booking (no check for ADMIN role).

**বাংলা**: এটি ডাটা লেভেলে অথরাইজেশন দেখায় — বৈধ JWT থাকলেও, আপনি শুধু আপনার নিজের বুকিং দেখতে পারেন। অ্যাডমিনরা যেকোনো বুকিং দেখতে পারে (ADMIN রোলের জন্য কোনো চেক নেই)।

---

#### `updateBookingStatus`

```ts
export const updateBookingStatus = async (bookingId, technicianId, status) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new AppError(404, "Booking not found");
  if (booking.technicianId !== technicianId) {
    throw new AppError(403, "This booking does not belong to you");
  }

  // Status transition validation
  if (status === "COMPLETED" && booking.status !== "IN_PROGRESS") {
    throw new AppError(400, "Booking must be in-progress before it can be completed");
  }
  if (status === "IN_PROGRESS" && booking.status !== "PAID") {
    throw new AppError(400, "Booking must be paid before it can be in-progress");
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
    include: { service: true, customer: true },
  });

  return updated;
};
```

**English**: Status flow enforcement. You can't jump from ACCEPTED directly to COMPLETED — you must go through PAID → IN_PROGRESS → COMPLETED. Only the assigned technician can update the status.

**বাংলা**: স্ট্যাটাস ফ্লো এনফোর্সমেন্ট। আপনি সরাসরি ACCEPTED থেকে COMPLETED এ যেতে পারেন না — আপনাকে PAID → IN_PROGRESS → COMPLETED দিয়ে যেতে হবে। শুধুমাত্র নির্ধারিত টেকনিশিয়ান স্ট্যাটাস আপডেট করতে পারে।

**Valid transitions / বৈধ পরিবর্তন:**

```
REQUESTED  →  ACCEPTED
REQUESTED  →  DECLINED
PAID       →  IN_PROGRESS
IN_PROGRESS → COMPLETED
```

---

## 14. Payment Module / পেমেন্ট মডিউল

### `src/modules/payment/payment.service.ts`

#### `createPaymentIntent`

```ts
export const createPaymentIntent = async (customerId, bookingId) => {
  // 1. Validate booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true },
  });
  if (!booking) throw new AppError(404, "Booking not found");
  if (booking.customerId !== customerId) throw new AppError(403, "Not your booking");
  if (booking.status !== "ACCEPTED") throw new AppError(400, "Booking must be accepted first");

  // 2. Check not already paid
  const existingPayment = await prisma.payment.findUnique({ where: { bookingId } });
  if (existingPayment?.status === "COMPLETED") throw new AppError(400, "Already paid");

  // 3. Convert price to cents (Stripe uses cents)
  const amountInCents = Math.round(booking.service.price * 100);

  // 4. Create Stripe PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    metadata: { bookingId },  // Store bookingId for webhook
  });

  // 5. Save to database (upsert in case previous attempt failed)
  const payment = await prisma.payment.upsert({
    where: { bookingId },
    update: { amount: booking.service.price, transactionId: paymentIntent.id, status: "PENDING" },
    create: { bookingId, amount: booking.service.price, transactionId: paymentIntent.id, status: "PENDING", userId: customerId },
  });

  return { clientSecret: paymentIntent.client_secret, payment };
};
```

| Step | English | বাংলা |
|------|---------|-------|
| 1 | Validate booking exists, belongs to customer, is ACCEPTED | বুকিং আছে, গ্রাহকের, এবং ACCEPTED কিনা যাচাই |
| 2 | Prevent double payment | দ্বৈত পেমেন্ট প্রতিরোধ |
| 3 | Convert $80 to 8000 cents | $80 কে 8000 সেন্টে রূপান্তর |
| 4 | Create Stripe PaymentIntent | Stripe PaymentIntent তৈরি |
| 5 | Save payment record to database | পেমেন্ট রেকর্ড ডাটাবেসে সেভ |

**Why cents? / কেন সেন্ট?**
Stripe doesn't accept fractional amounts like 80.50 — it wants 8050 (cents). We multiply by 100 and round.

Stripe ভগ্নাংশ পরিমাণ যেমন 80.50 গ্রহণ করে না — এটি 8050 (সেন্ট) চায়। আমরা 100 দিয়ে গুণ করি এবং রাউন্ড করি।

---

#### `confirmPayment`

```ts
export const confirmPayment = async (paymentIntentId) => {
  // 1. Verify with Stripe
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (paymentIntent.status !== "succeeded") {
    throw new AppError(400, "Payment has not succeeded");
  }

  const bookingId = paymentIntent.metadata.bookingId;
  if (!bookingId) throw new AppError(400, "No booking linked");

  // 2. Update payment to COMPLETED
  await prisma.payment.update({
    where: { bookingId },
    data: { status: "COMPLETED", transactionId: paymentIntent.id },
  });

  // 3. Update booking to PAID
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "PAID" },
  });

  return payment;
};
```

**English**: Two-step update. First marks the payment as COMPLETED, then marks the booking as PAID. Both updates are needed — the payment tracks money, the booking tracks the service lifecycle.

**বাংলা**: দুই-পদক্ষেপ আপডেট। প্রথমে পেমেন্ট COMPLETED হয়, তারপর বুকিং PAID হয়। দুটি আপডেটই প্রয়োজন — পেমেন্ট টাকা ট্র্যাক করে, বুকিং সার্ভিস লাইফসাইকেল ট্র্যাক করে।

---

#### `handleStripeWebhook`

```ts
export const handleStripeWebhook = async (body, sig) => {
  // 1. Verify the webhook signature (security!)
  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  // 2. Handle successful payment
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as any;
    await confirmPayment(paymentIntent.id);
  }

  return { received: true };
};
```

**English**: Webhooks are Stripe calling OUR server when something happens. The signature verification (`constructEvent`) ensures the request actually came from Stripe, not a hacker pretending to be Stripe.

**বাংলা**: ওয়েবহুক হল Stripe আমাদের সার্ভারকে কল করছে যখন কিছু ঘটে। সিগনেচার ভেরিফিকেশন (`constructEvent`) নিশ্চিত করে যে রিকোয়েস্টটি আসলেই Stripe থেকে এসেছে, কোন হ্যাকার Stripe সেজে নয়।

---

## 15. Review Module / রিভিউ মডিউল

### `src/modules/review/review.service.ts`

```ts
export const createReview = async (data) => {
  // 1. Find the booking
  const booking = await prisma.booking.findUnique({ where: { id: data.bookingId } });
  if (!booking) throw new AppError(404, "Booking not found");

  // 2. Only the customer who made the booking can review
  if (booking.customerId !== data.customerId) {
    throw new AppError(403, "This booking does not belong to you");
  }

  // 3. Only completed bookings can be reviewed
  if (booking.status !== "COMPLETED") {
    throw new AppError(400, "You can only review completed bookings");
  }

  // 4. One review per booking
  const existing = await prisma.review.findUnique({ where: { bookingId: data.bookingId } });
  if (existing) throw new AppError(409, "You have already reviewed this booking");

  // 5. Create review (technicianId comes from the booking)
  const review = await prisma.review.create({
    data: {
      bookingId: data.bookingId,
      customerId: data.customerId,
      technicianId: booking.technicianId,
      rating: data.rating,
      comment: data.comment,
    },
    include: { booking: true, customer: true, technician: true },
  });

  return review;
};
```

| Check | Reason (English) | কারণ (বাংলা) |
|-------|-------------------|--------------|
| Booking exists | Can't review a non-existent booking | নেই এমন বুকিং রিভিউ করা যাবে না |
| Owns booking | Can't review someone else's booking | অন্যের বুকিং রিভিউ করা যাবে না |
| Booking COMPLETED | Can't review before job is done | কাজ শেষ হওয়ার আগে রিভিউ দেওয়া যাবে না |
| No existing review | One review per booking | প্রতি বুকিং এ একটি মাত্র রিভিউ |

---

## 16. Admin Module / অ্যাডমিন মডিউল

### `src/modules/admin/admin.service.ts`

```ts
export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true, name: true, email: true, role: true, isBanned: true, createdAt: true,
      // NOTE: password is NOT selected! Security!
    },
    orderBy: { createdAt: "desc" },
  });
};
```

**English**: `select` explicitly chooses which fields to return. Notice `password` is NOT in the select — even admins should never see passwords.

**বাংলা**: `select` স্পষ্টভাবে কোন ফিল্ড রিটার্ন করতে হবে তা বেছে নেয়। লক্ষ্য করুন `password` সিলেক্টে নেই — এমনকি অ্যাডমিনদেরও পাসওয়ার্ড দেখা উচিত নয়।

```ts
export const updateUserBanStatus = async (userId, isBanned) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, "User not found");
  if (user.role === "ADMIN") throw new AppError(400, "Cannot ban an admin");  // Protection!

  return prisma.user.update({
    where: { id: userId },
    data: { isBanned },
    select: { id: true, name: true, email: true, role: true, isBanned: true },
  });
};
```

**English**: Admins cannot ban other admins! This prevents accidental or malicious removal of admin access.

**বাংলা**: অ্যাডমিনরা অন্য অ্যাডমিনকে ব্যান করতে পারে না! এটি দুর্ঘটনাজনিত বা দূষিতভাবে অ্যাডমিন অ্যাক্সেস সরানো প্রতিরোধ করে।

```ts
export const getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      service: true, customer: true, technician: true, payment: true, review: true,
    },
    orderBy: { id: "desc" },
  });
};
```

**English**: Admin sees everything — all bookings with all related data.

**বাংলা**: অ্যাডমিন সব দেখে — সব সম্পর্কিত ডাটা সহ সব বুকিং।

---

## 17. Seed Script / সিড স্ক্রিপ্ট

### `prisma/seed.ts`

```ts
import { PrismaClient, Role } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@fixitnow.com" },
    update: {},                              // Don't change if exists
    create: {
      name: "Admin",
      email: "admin@fixitnow.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log("Admin user seeded:", admin.email);
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

**English**: The seed script runs when you do `npm run prisma:seed`. It creates the admin user with email `admin@fixitnow.com` and password `admin123`. `upsert` means if the admin already exists, don't create another one.

**বাংলা**: সিড স্ক্রিপ্ট চলে যখন আপনি `npm run prisma:seed` করেন। এটি `admin@fixitnow.com` ইমেইল এবং `admin123` পাসওয়ার্ড দিয়ে অ্যাডমিন ইউজার তৈরি করে। `upsert` মানে যদি অ্যাডমিন আগে থেকে থাকে, তাহলে আরেকটি তৈরি করবে না।

---

## 18. Swagger / সোয়াগার

### `src/swagger.ts`

```ts
import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FixItNow API",
      version: "1.0.0",
      description: "Home Services Booking API...",
    },
    servers: [{ url: "/api" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/app/modules/**/*.routes.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
```

**English**: Swagger auto-generates API documentation from the `@openapi` JSDoc comments in the route files. The `apis` pattern tells it where to find these comments. The `securitySchemes` defines JWT Bearer auth so the "Authorize" button appears in Swagger UI.

**বাংলা**: Swagger রুট ফাইলগুলির `@openapi` JSDoc কমেন্ট থেকে অটোমেটিক্যালি API ডকুমেন্টেশন জেনারেট করে। `apis` প্যাটার্ন বলে যে এই কমেন্টগুলি কোথায় খুঁজবে। `securitySchemes` JWT Bearer অথ সংজ্ঞায়িত করে যাতে Swagger UI তে "Authorize" বাটন দেখা যায়।

---

## Architecture Summary / আর্কিটেকচার সারাংশ

### Design Pattern: MVC-like / MVC-এর মতো ডিজাইন প্যাটার্ন

```
Route (router)  →  Middleware (validation, auth)  →  Controller  →  Service  →  Database (Prisma)
    |                         |                          |              |
   Defines URL               Validates/Protects        Handles       Business logic
   and HTTP method            before reaching           request/       + DB queries
                              the controller            response
```

### Data Flow Example: Create a Booking

```
1. Customer sends POST /api/bookings with { serviceId }
2. Route matches → auth("CUSTOMER") middleware runs
   → Extracts JWT from header
   → Verifies token → checks user is not banned
   → Attaches { userId, role: "CUSTOMER" } to req.user
3. validateRequest(createBookingSchema) middleware runs
   → Validates body has serviceId
4. bookingController.create runs
   → Calls bookingService.createBooking({ customerId, serviceId })
5. bookingService.createBooking runs
   → Finds the service → gets technicianId
   → Creates booking in database
   → Returns booking data
6. Controller sends 201 response with booking data
```

### File Organization Principle / ফাইল সংগঠনের নীতি

```
src/modules/<module-name>/
├── <module-name>.service.ts     →  Business logic + DB queries
├── <module-name>.controller.ts  →  Request/response handling
├── <module-name>.routes.ts      →  Route definitions + middleware chains
└── <module-name>.validation.ts  →  Zod input validation schemas
```

Each module is **self-contained** — it has its own routes, controller, service, and validation. This makes the code easy to navigate and maintain.

প্রতিটি মডিউল **স্বয়ংসম্পূর্ণ** — এর নিজস্ব রুট, কন্ট্রোলার, সার্ভিস এবং ভ্যালিডেশন আছে। এটি কোড নেভিগেট এবং রক্ষণাবেক্ষণ সহজ করে তোলে.

---

## Key Takeaways / মূল শিক্ষা

| Concept | English | বাংলা |
|---------|---------|-------|
| **ES Modules** | `import`/`export` instead of `require`/`module.exports` | `require`/`module.exports` এর পরিবর্তে `import`/`export` |
| **Middleware** | Functions that run before route handler | ফাংশন যা রুট হ্যান্ডলারের আগে চলে |
| **JWT** | JSON Web Token for stateless authentication | স্টেটলেস অথেনটিকেশনের জন্য JSON Web Token |
| **bcrypt** | Password hashing library | পাসওয়ার্ড হ্যাশিং লাইব্রেরি |
| **Zod** | Runtime validation library | রানটাইম ভ্যালিডেশন লাইব্রেরি |
| **Prisma** | Type-safe database ORM | টাইপ-সেফ ডাটাবেস ORM |
| **Stripe** | Payment processing API | পেমেন্ট প্রসেসিং API |
| **catchAsync** | Wrapper that catches async errors | async এরর ক্যাচ করার র‍্যাপার |
| **sendResponse** | Standardized success response | স্ট্যান্ডার্ডাইজড সাকসেস রেসপন্স |
| **AppError** | Custom error with HTTP status code | HTTP স্ট্যাটাস কোড সহ কাস্টম এরর |
| **upsert** | Update + Insert (create or update) | আপডেট + ইনসার্ট (তৈরি বা আপডেট) |

---

*Happy coding! শিখতে থাকুন! 🚀*
