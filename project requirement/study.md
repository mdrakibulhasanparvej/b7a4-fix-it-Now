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
10. [User Module / ইউজার মডিউল](#10-user-module)
11. [Category Module / ক্যাটাগরি মডিউল](#11-category-module)
12. [Service Module / সার্ভিস মডিউল](#12-service-module)
13. [Technician Module / টেকনিশিয়ান মডিউল](#13-technician-module)
14. [Booking Module / বুকিং মডিউল](#14-booking-module)
15. [Payment Module / পেমেন্ট মডিউল](#15-payment-module)
16. [Review Module / রিভিউ মডিউল](#16-review-module)
17. [Admin Module / অ্যাডমিন মডিউল](#17-admin-module)
18. [Seed Script / সিড স্ক্রিপ্ট](#18-seed-script)

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
| **PostgreSQL + Prisma 7** | Database + ORM |
| **JWT** | Authentication (access + refresh tokens) |
| **Stripe** | Payment processing |
| **Custom Validation** | Input validation (rule-based, not Zod) |
| **bcryptjs** | Password hashing |
| **http-status** | HTTP status code constants |

---

## 2. Configuration Files / কনফিগারেশন ফাইল

### `package.json`

```json
{
  "type": "module",
  "main": "server.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "tsx watch src/server.ts",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "tsx prisma/seed.ts",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/adapter-pg": "^7.8.0",
    "@prisma/client": "^7.8.0",
    "bcryptjs": "^3.0.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "http-status": "^2.1.0",
    "jsonwebtoken": "^9.0.3",
    "pg": "^8.22.0",
    "stripe": "^22.3.0"
  }
}
```

**Key differences from common patterns / সাধারণ প্যাটার্ন থেকে পার্থক্য:**

| Aspect | English | বাংলা |
|--------|---------|-------|
| No Zod | Validation uses custom rule-based middleware instead of Zod | ভ্যালিডেশন Zod এর পরিবর্তে কাস্টম রুল-বেসড মিডলওয়্যার ব্যবহার করে |
| No Swagger | API docs are not auto-generated | API ডক্স অটো-জেনারেট হয় না |
| bcryptjs | Uses bcryptjs instead of bcrypt (pure JS, no native deps) | bcrypt এর পরিবর্তে bcryptjs ব্যবহার (পিওর JS, নেটিভ ডিপস নেই) |
| cookie-parser | Parses cookies for token-based auth | টোকেন-ভিত্তিক অথের জন্য কুকি পার্স করে |
| http-status | Provides named constants like `httpStatus.OK` instead of raw numbers | raw নাম্বারের পরিবর্তে `httpStatus.OK` এর মত নামযুক্ত কনস্ট্যান্ট দেয় |

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
| `moduleResolution: "bundler"` | Import resolution like bundlers | বান্ডলারের মত import রেজলভ করে |
| `strict: true` | Enable all strict type checks | সব strict type check চালু করে |
| `esModuleInterop: true` | Allows default imports from CommonJS modules | CommonJS মডিউল থেকে default import অনুমতি দেয় |
| `declaration: true` | Generate `.d.ts` type declaration files | `.d.ts` টাইপ ডিক্লারেশন ফাইল জেনারেট করে |
| `sourceMap: true` | Generate `.js.map` files for debugging | ডিবাগিং এর জন্য `.js.map` ফাইল জেনারেট করে |

---

### `src/config/index.ts`

```ts
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT || 5050,
  database_url: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
  jwt_access_expiration: process.env.JWT_ACCESS_EXPIRATION!,
  jwt_refresh_expiration: process.env.JWT_REFRESH_EXPIRATION!,
};
```

| Field | English | বাংলা |
|-------|---------|-------|
| `port` | Server port (default 5050) | সার্ভার পোর্ট (ডিফল্ট 5050) |
| `app_url` | Frontend URL for CORS | CORS এর জন্য ফ্রন্টএন্ড URL |
| `bcrypt_salt_rounds` | Salt rounds for password hashing | পাসওয়ার্ড হ্যাশিং এর জন্য সল্ট রাউন্ড |
| `jwt_access_secret` | Secret for signing access tokens (short-lived, ~1d) | অ্যাক্সেস টোকেন সাইন করার সিক্রেট (স্বল্পমেয়াদী, ~1d) |
| `jwt_refresh_secret` | Secret for signing refresh tokens (long-lived, ~30d) | রিফ্রেশ টোকেন সাইন করার সিক্রেট (দীর্ঘমেয়াদী, ~30d) |

**English**: The config module loads `.env` variables at startup. It serves as a central place so other files don't scatter `process.env` calls everywhere. The `!` (non-null assertion) tells TypeScript "this will exist at runtime."

**বাংলা**: কনফিগ মডিউল স্টার্টআপে `.env` ভেরিয়েবল লোড করে। এটি একটি কেন্দ্রীয় জায়গা যাতে অন্যান্য ফাইল সর্বত্র `process.env` কল না ছড়ায়। `!` (নন-নাল অ্যাসারশন) টাইপস্ক্রিপ্টকে বলে "রানটাইমে এটি থাকবে।"

---

## 3. Database Schema / ডাটাবেস স্কিমা

### Schema Organization / স্কিমা অর্গানাইজেশন

The Prisma schema is split into separate files under `prisma/schema/` and combined via the main `schema.prisma` file:

Prisma স্কিমা `prisma/schema/` এর অধীনে আলাদা ফাইলে বিভক্ত এবং প্রধান `schema.prisma` ফাইলের মাধ্যমে একত্রিত:

```prisma
// prisma/schema/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../../generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

```prisma
// prisma/schema/emums.prisma
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
  CANCELLED
}
```

**BookingStatus flow / বুকিং স্ট্যাটাস ফ্লো:**
```
REQUESTED → ACCEPTED → PAID → IN_PROGRESS → COMPLETED
     ↘ DECLINED                      ↑ (customer can cancel)
     ↘ CANCELLED ← any of REQUESTED, ACCEPTED, PAID
```

**English**: `CANCELLED` is an addition to the typical flow. Customers can cancel at REQUESTED, ACCEPTED, or PAID status (before work starts). Once IN_PROGRESS, cancellation is not allowed.

**বাংলা**: সাধারণ ফ্লোতে `CANCELLED` একটি সংযোজন। গ্রাহকরা REQUESTED, ACCEPTED, বা PAID স্ট্যাটাসে বাতিল করতে পারেন (কাজ শুরুর আগে)। IN_PROGRESS হলে বাতিল করা যাবে না।

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
| `@id @default(uuid())` | Auto-generates a unique UUID | ইউনিক UUID অটো-জেনারেট করে |
| `email @unique` | Email must be unique | ইমেইল ইউনিক হতে হবে |
| `role @default(CUSTOMER)` | Default role is CUSTOMER | ডিফল্ট রোল হলো CUSTOMER |
| `isBanned @default(false)` | Users are not banned by default | ডিফল্টভাবে ব্যান না |

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
| `bio?` | Optional biography | অপশনাল বায়োগ্রাফি |
| `experienceYears?` | Optional years of experience | অপশনাল বছরের অভিজ্ঞতা |
| `availability Json?` | Availability slots as JSON array | JSON অ্যারে আকারে সময়ের স্লট |

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
| `bookingId @unique` | One payment per booking | প্রতি বুকিং এ একটি পেমেন্ট |
| `provider @default("Stripe")` | Only Stripe supported | শুধুমাত্র Stripe সাপোর্টেড |
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

---

## 4. Entry Points / এন্ট্রি পয়েন্ট

### `src/server.ts`

```ts
import app from "./app";
import { prisma } from "./lib/prisma";
import config from "./config/index";

const PORT = config.port;

async function main() {
  try {
    await prisma.$connect();
    console.log(`Connected to the database successfully.`);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
```

| Line | English | বাংলা |
|------|---------|-------|
| `prisma.$connect()` | Connect to database before starting server | সার্ভার শুরুর আগে ডাটাবেসে কানেক্ট |
| `config.port` | Read port from config (env or default 5050) | কনফিগ থেকে পোর্ট পড়ে (env বা ডিফল্ট 5050) |
| `catch (error)` | If DB connection fails, log error and exit | DB কানেকশন ব্যর্থ হলে, এরর লগ করে এক্সিট |

**English**: Unlike the typical pattern, this server first connects to the database, then starts listening. If DB is down, the server doesn't start — this prevents runtime errors.

**বাংলা**: সাধারণ প্যাটার্নের থেকে ভিন্ন, এই সার্ভার প্রথমে ডাটাবেসে কানেক্ট হয়, তারপর লিসেন শুরু করে। DB ডাউন থাকলে সার্ভার স্টার্ট হয় না — এটি রানটাইম এরর প্রতিরোধ করে।

---

### `src/app.ts`

```ts
import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import config from "./config";
import cors from "cors";
import router from "./routes/index";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { paymentController } from "./modules/payment/payment.controller";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
  }),
);

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentController.webhook,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use("/api", router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
```

| Line | English | বাংলা |
|------|---------|-------|
| `cookieParser()` | Parses cookies from requests (needed for token auth) | রিকোয়েস্ট থেকে কুকি পার্স করে (টোকেন অথের জন্য প্রয়োজন) |
| `express.urlencoded({ extended: true })` | Parses URL-encoded form data | URL-এনকোডেড ফর্ম ডাটা পার্স করে |
| `cors({ origin: config.app_url })` | Restricts CORS to frontend URL only | CORS শুধুমাত্র ফ্রন্টএন্ড URL এ সীমাবদ্ধ |
| `express.raw({ type: "application/json" })` | Raw body for Stripe webhook (needs raw body for signature verification) | Stripe webhook এর জন্য raw body (সিগনেচার ভেরিফিকেশনের জন্য raw body দরকার) |

**Order of middleware / মিডলওয়্যারের অর্ডার:**

1. CORS
2. Stripe webhook (before JSON parser — needs raw body)
3. JSON parser + URL-encoded parser + Cookie parser
4. Root route
5. All API routes (`/api`)
6. 404 handler (notFound)
7. Error handler (globalErrorHandler)

**English**: Notice there is no Swagger, no health check endpoint, and no request logger. This is a minimal Express setup. The Stripe webhook must come BEFORE `express.json()` because it needs the raw body for signature verification.

**বাংলা**: লক্ষ্য করুন কোন Swagger, হেলথ চেক এন্ডপয়েন্ট, বা রিকোয়েস্ট লগার নেই। এটি একটি মিনিমাল Express সেটআপ। Stripe webhook অবশ্যই `express.json()` এর **আগে** আসতে হবে কারণ সিগনেচার ভেরিফিকেশনের জন্য raw body দরকার।

---

## 5. Utilities / ইউটিলিটি

### `src/utils/catchAsync.ts`

```ts
import { NextFunction, Request, RequestHandler, Response } from "express";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
```

**English**: Wraps async route handlers so thrown errors are caught and forwarded to Express error handler. Uses a `try/catch` block internally.

**বাংলা**: async রুট হ্যান্ডলারদের র‍্যাপ করে যাতে থ্রো করা এরর ক্যাচ হয়ে Express এরর হ্যান্ডলারে ফরওয়ার্ড হয়। ভিতরে `try/catch` ব্লক ব্যবহার করে।

**Pattern / প্যাটার্ন**:
```ts
export const getAll = catchAsync(async (req, res) => { ... });
```

---

### `src/utils/sendResponse.ts`

```ts
import { Response } from "express";

type TMeta = {
  page: number;
  limit: number;
  total: number;
};

type TResponseData<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: TMeta;
};

export const sendResponse = <T>(res: Response, data: TResponseData<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
};
```

**English**: Takes a **single object** parameter with `success`, `statusCode`, `message`, `data`, and optional `meta`. This is different from the common pattern where these are separate arguments. The `meta` field supports pagination.

**বাংলা**: একটি **একক অবজেক্ট** প্যারামিটার নেয় যাতে `success`, `statusCode`, `message`, `data`, এবং অপশনাল `meta` থাকে। এটি সাধারণ প্যাটার্ন থেকে ভিন্ন যেখানে এগুলো আলাদা আর্গুমেন্ট হয়। `meta` ফিল্ড পেজিনেশন সাপোর্ট করে।

**Response format / রেসপন্স ফরম্যাট:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users fetched successfully",
  "data": [ ... ],
  "meta": { "page": 1, "limit": 10, "total": 50 }
}
```

---

### `src/utils/jwt.ts`

```ts
import jwt, { JwtPayload } from "jsonwebtoken";

const createToken = (payload: JwtPayload, secret: string, expiresIn: string | number) => {
  const token = jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
  return token;
};

const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret) as JwtPayload;
    return { success: true, data: verifiedToken };
  } catch (error: any) {
    console.error("Token verification failed:", error);
    return { success: false, message: error.message || "Token verification failed" };
  }
};

export const jwtUtils = { createToken, verifyToken };
```

| Function | English | বাংলা |
|----------|---------|-------|
| `createToken` | Signs a JWT with payload, secret, and expiration | পেলোড, সিক্রেট এবং এক্সপায়ারেশন সহ JWT সাইন করে |
| `verifyToken` | Verifies JWT, returns `{ success, data }` or `{ success, message }` | JWT ভেরিফাই করে, `{ success, data }` বা `{ success, message }` রিটার্ন করে |

**English**: Unlike the common pattern where `jwt.verify` throws on failure, this wraps it in try/catch and returns a consistent response object. The caller checks `verifiedToken.success` instead of using try/catch.

**বাংলা**: সাধারণ প্যাটার্নের থেকে ভিন্ন যেখানে `jwt.verify` ব্যর্থ হলে থ্রো করে, এটি try/catch এ র‍্যাপ করে এবং একটি কনসিস্টেন্ট রেসপন্স অবজেক্ট রিটার্ন করে। কলার try/catch ব্যবহার না করে `verifiedToken.success` চেক করে।

---

### `src/lib/prisma.ts`

```ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
```

| Line | English | বাংলা |
|------|---------|-------|
| `import "dotenv/config"` | Load .env BEFORE importing Prisma | Prisma ইম্পোর্টের আগে .env লোড করে |
| `PrismaPg` | PostgreSQL adapter for Prisma | Prisma এর জন্য PostgreSQL অ্যাডাপ্টার |
| `if (!connectionString)` | Early error if DATABASE_URL missing | DATABASE_URL না থাকলে আগেই এরর |
| `export { prisma }` | Named export (not default) used everywhere | named export (ডিফল্ট না) যা সর্বত্র ব্যবহার হয় |

**English**: This creates a single Prisma client instance. The `!` (non-null assertion) is NOT used here — instead there's an explicit check. Named export `{ prisma }` is used instead of `export default`.

**বাংলা**: এটি একটি একক Prisma client instance তৈরি করে। এখানে `!` (নন-নাল অ্যাসারশন) ব্যবহার করা হয়নি — বরং একটি স্পষ্ট চেক আছে। `export default` এর পরিবর্তে named export `{ prisma }` ব্যবহার করা হয়।

---

### `src/utils/stripe.ts`

```ts
import "dotenv/config";
import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not configured in environment variables");
    }
    stripeInstance = new Stripe(key);
  }
  return stripeInstance;
}
```

**English**: Uses the **singleton pattern** with a lazy-initialized `getStripe()` function. The Stripe instance is created only on first use, not at import time. This is different from the common pattern of `new Stripe(key)` at module level.

**বাংলা**: **সিঙ্গেলটন প্যাটার্ন** ব্যবহার করে lazy-initialized `getStripe()` ফাংশনের মাধ্যমে। Stripe instance শুধুমাত্র প্রথম ব্যবহারে তৈরি হয়, ইম্পোর্ট টাইমে নয়। এটি মডিউল লেভেলে `new Stripe(key)` করার সাধারণ প্যাটার্ন থেকে ভিন্ন।

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
| `class AppError extends Error` | Custom error class extending built-in Error | বিল্ট-ইন Error ক্লাসকে এক্সটেন্ড করে কাস্টম এরর |
| `public statusCode: number` | HTTP status code | HTTP স্ট্যাটাস কোড |
| `Error.captureStackTrace` | Captures stack trace for debugging | ডিবাগিং এর জন্য স্ট্যাক ট্রেস ক্যাপচার |

**Usage / ব্যবহার:**
```ts
throw new AppError(httpStatus.NOT_FOUND, "User not found");
throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
throw new AppError(httpStatus.FORBIDDEN, "You do not have permission");
```

**English**: Uses `httpStatus` constants instead of raw numbers (404, 401, 403).

**বাংলা**: raw নাম্বার (404, 401, 403) এর পরিবর্তে `httpStatus` কনস্ট্যান্ট ব্যবহার করে।

---

## 7. Middlewares / মিডলওয়্যার

### `src/middlewares/auth.ts`

```ts
import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import { AppError } from "../errors/AppError";
import httpStatus from "http-status";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not logged in");
    }

    const verifiedToken = jwtUtils.verifyToken(token, process.env.JWT_ACCESS_SECRET!);

    if (!verifiedToken.success) {
      throw new AppError(httpStatus.UNAUTHORIZED, verifiedToken.message);
    }

    const { id, name, email, role } = verifiedToken.data as { id: string; name: string; email: string; role: Role };

    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to access this resource");
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
    }

    if (user.isBanned) {
      throw new AppError(httpStatus.FORBIDDEN, "Your account has been banned");
    }

    req.user = { id, name, email, role };

    next();
  });
};
```

**Key differences from common pattern / সাধারণ প্যাটার্ন থেকে মূল পার্থক্য:**

| Aspect | This Code | Common Pattern |
|--------|-----------|---------------|
| Token source | Cookie FIRST, then `Authorization` header | Usually only `Authorization` header |
| `req.user` | `{ id, name, email, role }` | Usually `{ userId, role }` |
| JWT verify | `jwtUtils.verifyToken()` custom wrapper | `jwt.verify()` directly |
| Role check | Uses `Role` enum from Prisma | Usually string array |

**Token priority / টোকেন অগ্রাধিকার:**
1. `req.cookies.accessToken` (highest priority)
2. `Authorization: Bearer <token>` header
3. `Authorization: <token>` header (without Bearer)

---

### `src/middlewares/validateRequest.ts`

```ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import httpStatus from "http-status";

export type ValidationRule = {
  field: string;
  required?: boolean;
  type?: "string" | "number" | "boolean" | "email" | "array" | "object";
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  enum?: string[];
  message?: string;
};

export const validateRequest = (rules: ValidationRule[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const errors: { field: string; message: string }[] = [];

    for (const rule of rules) {
      const value = req.body[rule.field];

      if (rule.required && (value === undefined || value === null || value === "")) {
        errors.push({ field: rule.field, message: rule.message || `${rule.field} is required` });
        continue;
      }

      if (value === undefined || value === null) continue;

      if (rule.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push({ field: rule.field, message: rule.message || `Invalid email format` });
        }
      }

      if (rule.type === "string" && typeof value === "string") {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push({ field: rule.field, message: rule.message || `${rule.field} must be at least ${rule.minLength} characters` });
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push({ field: rule.field, message: rule.message || `${rule.field} must be at most ${rule.maxLength} characters` });
        }
      }

      if (rule.type === "number") { /* validates min/max */ }

      if (rule.enum && !rule.enum.includes(value)) {
        errors.push({ field: rule.field, message: rule.message || `${rule.field} must be one of: ${rule.enum.join(", ")}` });
      }
    }

    if (errors.length > 0) {
      return next(new AppError(httpStatus.BAD_REQUEST, errors[0].message));
    }

    next();
  };
};
```

| Aspect | English | বাংলা |
|--------|---------|-------|
| Rule-based | Uses `ValidationRule[]` instead of Zod schema | Zod স্কিমার পরিবর্তে `ValidationRule[]` ব্যবহার করে |
| First error | Only returns the **first** validation error | শুধুমাত্র **প্রথম** ভ্যালিডেশন এরর রিটার্ন করে |
| No async | Synchronous validation (no `.parseAsync()`) | সিনক্রোনাস ভ্যালিডেশন (কোন `.parseAsync()` নেই) |

**Example validation rules / ভ্যালিডেশন রুলের উদাহরণ:**
```ts
const loginRules: ValidationRule[] = [
  { field: "email", required: true, type: "email", message: "Valid email is required" },
  { field: "password", required: true, type: "string", message: "Password is required" },
];
```

---

### `src/middlewares/globalErrorHandler.ts`

```ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import httpStatus from "http-status";

export const globalErrorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let errorDetails: unknown = {};

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = { stack: err.stack };
  } else if (err instanceof Error) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = err.message;
    errorDetails = { stack: err.stack };
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorDetails,
  });
};
```

| Error Type | Status | Example |
|-----------|--------|---------|
| `AppError` | Custom status (404, 401, etc.) | `AppError(404, "Not found")` |
| Generic `Error` | 500 | Unexpected errors |

**Note**: This handler does NOT have a special case for Zod errors (since Zod is not used). All errors are either `AppError` or generic `Error`.

**বাংলা**: এই হ্যান্ডলারে Zod এরর এর জন্য আলাদা কেস নেই (যেহেতু Zod ব্যবহার করা হয় না)। সব এরর হয় `AppError` বা জেনেরিক `Error`।

---

### `src/middlewares/notFound.ts`

```ts
import { Request, Response } from "express";
import httpStatus from "http-status";

export const notFound = (_req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    statusCode: httpStatus.NOT_FOUND,
    message: "Route not found",
    errorDetails: {},
  });
};
```

---

## 8. Route Index / রুট ইনডেক্স

### `src/routes/index.ts`

```ts
import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { userRouter } from "../modules/user/user.route";
import { categoryRoutes } from "../modules/category/category.route";
import { serviceRoutes } from "../modules/service/service.route";
import {
  technicianRoutes,
  technicianProfileRoutes,
  technicianAvailabilityRoutes,
  technicianBookingRoutes,
} from "../modules/technician/technician.route";
import { bookingRoutes } from "../modules/booking/booking.route";
import { paymentRoutes } from "../modules/payment/payment.route";
import { reviewRoutes } from "../modules/review/review.route";
import { adminRoutes } from "../modules/admin/admin.route";

const router = Router();

const moduleRoutes = [
  { path: "/auth", route: authRoutes },
  { path: "/users", route: userRouter },
  { path: "/categories", route: categoryRoutes },
  { path: "/services", route: serviceRoutes },
  { path: "/technicians", route: technicianRoutes },
  { path: "/technician/profile", route: technicianProfileRoutes },
  { path: "/technician/availability", route: technicianAvailabilityRoutes },
  { path: "/technician/bookings", route: technicianBookingRoutes },
  { path: "/bookings", route: bookingRoutes },
  { path: "/payments", route: paymentRoutes },
  { path: "/reviews", route: reviewRoutes },
  { path: "/admin", route: adminRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
```

**Complete API table / সম্পূর্ণ API টেবিল:**

| Method | Path | Auth | Module |
|--------|------|------|--------|
| POST | /api/auth/register | No | Auth |
| POST | /api/auth/login | No | Auth |
| GET | /api/auth/me | CUSTOMER, TECHNICIAN, ADMIN | Auth |
| POST | /api/users/register | No | User |
| GET | /api/users/me | CUSTOMER, TECHNICIAN, ADMIN | User |
| PUT | /api/users/my-profile | CUSTOMER, TECHNICIAN, ADMIN | User |
| GET | /api/categories | No | Category |
| GET | /api/categories/:id | No | Category |
| POST | /api/categories | ADMIN | Category |
| PUT | /api/categories/:id | ADMIN | Category |
| DELETE | /api/categories/:id | ADMIN | Category |
| GET | /api/services | No | Service |
| GET | /api/services/:id | No | Service |
| POST | /api/services | TECHNICIAN, ADMIN | Service |
| PUT | /api/services/:id | TECHNICIAN, ADMIN | Service |
| DELETE | /api/services/:id | TECHNICIAN, ADMIN | Service |
| GET | /api/technicians | No | Technician |
| GET | /api/technicians/:id | No | Technician |
| PUT | /api/technician/profile | TECHNICIAN | Technician |
| PUT | /api/technician/availability | TECHNICIAN | Technician |
| GET | /api/technician/bookings | TECHNICIAN | Technician |
| PATCH | /api/technician/bookings/:id | TECHNICIAN | Technician |
| POST | /api/bookings | CUSTOMER | Booking |
| GET | /api/bookings | CUSTOMER, TECHNICIAN, ADMIN | Booking |
| GET | /api/bookings/:id | CUSTOMER, TECHNICIAN, ADMIN | Booking |
| PATCH | /api/bookings/:id/cancel | CUSTOMER | Booking |
| POST | /api/payments/create | CUSTOMER | Payment |
| POST | /api/payments/confirm | CUSTOMER | Payment |
| POST | /api/payments/webhook | No (Stripe) | Payment |
| GET | /api/payments | CUSTOMER, ADMIN | Payment |
| GET | /api/payments/:id | CUSTOMER | Payment |
| POST | /api/reviews | CUSTOMER | Review |
| GET | /api/admin/users | ADMIN | Admin |
| PATCH | /api/admin/users/:id | ADMIN | Admin |
| GET | /api/admin/bookings | ADMIN | Admin |
| GET | /api/admin/categories | ADMIN | Admin |
| POST | /api/admin/categories | ADMIN | Admin |

---

## 9. Auth Module / অথ মডিউল

### Architecture / আর্কিটেকচার

The Auth module uses:
- **Validation**: Custom `ValidationRule[]` (not Zod)
- **Auth middleware**: Checks both cookies and Bearer header for tokens
- **JWT**: Separate access token (short-lived) and refresh token (long-lived)
- **Cookies**: Tokens are also set as httpOnly cookies in the login response

### `src/modules/auth/auth.route.ts`

```ts
const registerRules: ValidationRule[] = [
  { field: "name", required: true, type: "string", minLength: 1, message: "Name is required" },
  { field: "email", required: true, type: "email", message: "Valid email is required" },
  { field: "password", required: true, type: "string", minLength: 6, message: "Password must be at least 6 characters" },
  { field: "role", enum: ["CUSTOMER", "TECHNICIAN"] },
];

const loginRules: ValidationRule[] = [
  { field: "email", required: true, type: "email", message: "Valid email is required" },
  { field: "password", required: true, type: "string", message: "Password is required" },
];

router.post("/register", validateRequest(registerRules), authController.registerUser);
router.post("/login", validateRequest(loginRules), authController.loginUser);
router.get("/me", auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN), authController.getMe);
```

| Route | Validation | Auth | Controller |
|-------|-----------|------|------------|
| POST /register | name, email, password, role (optional) | No | registerUser |
| POST /login | email, password | No | loginUser |
| GET /me | None | All roles | getMe |

---

### `src/modules/auth/auth.interface.ts`

```ts
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: "CUSTOMER" | "TECHNICIAN";
}
```

---

### `src/modules/auth/auth.service.ts`

```ts
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { LoginPayload, RegisterPayload } from "./auth.interface";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const loginUser = async (payload: LoginPayload) => {
  const { email, password } = payload;

  // 1. Find user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");

  // 2. Check if banned
  if (user.isBanned) throw new AppError(httpStatus.FORBIDDEN, "Your account has been banned");

  // 3. Compare password
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");

  // 4. Generate JWT payload
  const jwtPayload = { id: user.id, name: user.name, email: user.email, role: user.role };

  // 5. Create access token (short-lived) + refresh token (long-lived)
  const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret!, config.jwt_access_expiration || "1d");
  const refreshToken = jwtUtils.createToken(jwtPayload, config.jwt_refresh_secret!, config.jwt_refresh_expiration || "30d");

  return { accessToken, refreshToken };
};
```

**Key features / মূল বৈশিষ্ট্য:**

| Feature | English | বাংলা |
|---------|---------|-------|
| Dual tokens | Returns both accessToken (1d) and refreshToken (30d) | accessToken (1d) এবং refreshToken (30d) উভয়ই রিটার্ন করে |
| JWT payload | Contains `{ id, name, email, role }` — not just `{ userId, role }` | শুধু `{ userId, role }` না — `{ id, name, email, role }` থাকে |
| bcryptjs | Uses `bcryptjs` library (pure JS) | `bcryptjs` লাইব্রেরি ব্যবহার (পিওর JS) |
| Config-driven salt | Salt rounds from `config.bcrypt_salt_rounds` | `config.bcrypt_salt_rounds` থেকে সল্ট রাউন্ড |

**Register flow / রেজিস্টার ফ্লো:**

```ts
const registerUser = async (payload: RegisterPayload) => {
  // 1. Check existing email
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError(httpStatus.CONFLICT, "Email already exists");

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

  // 3. Create user (omit password from return)
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: role || "CUSTOMER" },
    omit: { password: true },
  });

  return user;
};
```

**English**: Unlike the common pattern, `registerUser` does NOT auto-create a `TechnicianProfile` for TECHNICIAN role users. It also does NOT return a JWT after registration — it only returns the user object.

**বাংলা**: সাধারণ প্যাটার্নের থেকে ভিন্ন, `registerUser` TECHNICIAN রোলের ইউজারদের জন্য অটো-`TechnicianProfile` তৈরি করে না। এটি রেজিস্ট্রেশনের পর JWT রিটার্ন করে না — শুধুমাত্র ইউজার অবজেক্ট রিটার্ন করে।

**`getMe`:**

```ts
const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true },
  });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  return user;
};
```

**English**: Uses `omit: { password: true }` instead of `select` to exclude password. This is simpler — you get all fields EXCEPT password.

**বাংলা**: পাসওয়ার্ড বাদ দেওয়ার জন্য `select` এর পরিবর্তে `omit: { password: true }` ব্যবহার করে। এটি সহজ — পাসওয়ার্ড ছাড়া সব ফিল্ড পায়।

---

### `src/modules/auth/auth.controller.ts`

```ts
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await authService.loginUser(req.body);

  res.cookie("accessToken", accessToken, { httpOnly: true, secure: false, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000 });

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "User logged in successfully", data: { accessToken, refreshToken } });
});
```

**English**: The login controller sets both tokens as **httpOnly cookies** AND returns them in the response body. `httpOnly: true` prevents JavaScript from accessing the cookie (XSS protection). `secure: false` allows HTTP for development.

**বাংলা**: লগইন কন্ট্রোলার উভয় টোকেন **httpOnly কুকি** হিসেবে সেট করে এবং রেসপন্স বডিতেও রিটার্ন করে। `httpOnly: true` JavaScript কে কুকিতে অ্যাক্সেস করতে বাধা দেয় (XSS প্রোটেকশন)। `secure: false` ডেভেলপমেন্টের জন্য HTTP অনুমতি দেয়।

---

## 10. User Module / ইউজার মডিউল

### `src/modules/user/user.route.ts`

```ts
router.post("/register", userController.registerUser);
router.get("/me", auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN), userController.getMyProfile);
router.put("/my-profile", auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN), userController.updateMyProfile);
```

**English**: The User module provides additional user management routes that complement the Auth module. `/users/register` is an alternative registration endpoint. `/users/me` and `/users/my-profile` let any authenticated user view and update their profile.

**বাংলা**: ইউজার মডিউল অতিরিক্ত ইউজার ম্যানেজমেন্ট রুট সরবরাহ করে যা Auth মডিউলকে পরিপূরক করে। `/users/register` একটি বিকল্প রেজিস্ট্রেশন এন্ডপয়েন্ট। `/users/me` এবং `/users/my-profile` যেকোন অথেনটিকেটেড ইউজারকে তাদের প্রোফাইল দেখতে এবং আপডেট করতে দেয়।

### `src/modules/user/user.service.ts`

```ts
const updateMyProfileInDB = async (userId: string, payload: any) => {
  const { name, email } = payload;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { name, email },
    omit: { password: true },
  });

  return updatedUser;
};
```

**English**: Only `name` and `email` can be updated. Password changes would need a separate endpoint with current password verification.

**বাংলা**: শুধুমাত্র `name` এবং `email` আপডেট করা যেতে পারে। পাসওয়ার্ড পরিবর্তনের জন্য বর্তমান পাসওয়ার্ড যাচাই সহ আলাদা এন্ডপয়েন্ট প্রয়োজন হবে।

---

## 11. Category Module / ক্যাটাগরি মডিউল

### `src/modules/category/category.route.ts`

```ts
router.get("/", categoryController.getAll);              // Public
router.get("/:id", categoryController.getById);           // Public
router.post("/", auth(Role.ADMIN), validateRequest(...), categoryController.create);   // Admin
router.put("/:id", auth(Role.ADMIN), categoryController.update);        // Admin
router.delete("/:id", auth(Role.ADMIN), categoryController.remove);     // Admin
```

**English**: Full CRUD. Read operations are public, write operations require ADMIN role. Category names must be unique.

**বাংলা**: সম্পূর্ণ CRUD। রিড অপারেশন পাবলিক, রাইট অপারেশনের জন্য ADMIN রোল প্রয়োজন। ক্যাটাগরির নাম ইউনিক হতে হবে。

### `src/modules/category/category.validation.ts`

```ts
export const createCategoryRules: ValidationRule[] = [
  { field: "name", required: true, type: "string", minLength: 1, message: "Category name is required" },
  { field: "description", type: "string" },
];
```

### `src/modules/category/category.service.ts`

```ts
const getAllCategories = async () => {
  return prisma.category.findMany({
    include: { services: true },
    orderBy: { name: "asc" },
  });
};
```

**Note**: Categories are ordered alphabetically (`orderBy: { name: "asc" }`).

---

## 12. Service Module / সার্ভিস মডিউল

### `src/modules/service/service.route.ts`

```ts
router.get("/", serviceController.getAll);                              // Public
router.get("/:id", serviceController.getById);                          // Public
router.post("/", auth(Role.TECHNICIAN, Role.ADMIN), validateRequest(...), serviceController.create);
router.put("/:id", auth(Role.TECHNICIAN, Role.ADMIN), serviceController.update);
router.delete("/:id", auth(Role.TECHNICIAN, Role.ADMIN), serviceController.remove);
```

**English**: Both TECHNICIAN and ADMIN can create/update/delete services. When a technician creates a service, `technicianId` comes from the JWT token (`req.user!.id`), not the request body.

**বাংলা**: TECHNICIAN এবং ADMIN উভয়ই সার্ভিস তৈরি/আপডেট/ডিলিট করতে পারে। যখন একজন টেকনিশিয়ান সার্ভিস তৈরি করেন, `technicianId` JWT টোকেন থেকে আসে (`req.user!.id`), রিকোয়েস্ট বডি থেকে নয়।

### Service Filtering / সার্ভিস ফিল্টারিং

```ts
const getAllServices = async (filters) => {
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

  return prisma.service.findMany({ where, include: { category: true, technician: { omit: { password: true } } }, orderBy: { id: "desc" } });
};
```

Example: `GET /api/services?categoryId=abc&minPrice=50&search=paint`

**Ownership check for update/delete / আপডেট/ডিলিটের জন্য মালিকানা চেক:**

```ts
const updateService = async (id, technicianId, data) => {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  if (service.technicianId !== technicianId) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only update your own services");
  }
  // ... update
};
```

---

## 13. Technician Module / টেকনিশিয়ান মডিউল

### Four Routers / চারটি রাউটার

The technician module exports **4 separate routers** that are mounted at different paths:

| Router | Mount Path | Purpose |
|--------|-----------|---------|
| `technicianRoutes` | `/technicians` | Public: list all technicians, get by ID |
| `technicianProfileRoutes` | `/technician/profile` | Auth: update profile |
| `technicianAvailabilityRoutes` | `/technician/availability` | Auth: update availability |
| `technicianBookingRoutes` | `/technician/bookings` | Auth: view/manage bookings |

### `src/modules/technician/technician.service.ts`

**`getAllTechnicians` — Only shows non-banned technicians:**

```ts
const getAllTechnicians = async () => {
  return prisma.user.findMany({
    where: { role: "TECHNICIAN", isBanned: false },
    omit: { password: true },
    include: { technicianProfile: true, services: true },
  });
};
```

**`getTechnicianById` — Includes reviews:**

```ts
const getTechnicianById = async (id: string) => {
  const technician = await prisma.user.findFirst({
    where: { id, role: "TECHNICIAN" },
    omit: { password: true },
    include: {
      technicianProfile: true,
      services: { include: { category: true } },
      reviewsAsTechnician: { include: { customer: { omit: { password: true } } } },
    },
  });
  // ...
};
```

**`updateBookingStatus` — Valid status transitions:**

```ts
const validTransitions: Record<string, string[]> = {
  REQUESTED: ["ACCEPTED", "DECLINED", "CANCELLED"],
  ACCEPTED: ["PAID", "CANCELLED"],
  PAID: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
  DECLINED: [],
  CANCELLED: [],
};
```

**English**: The `validTransitions` object explicitly defines which status → status transitions are allowed. Any transition not in the list is rejected. `CANCELLED` can be reached from REQUESTED, ACCEPTED, or PAID.

**বাংলা**: `validTransitions` অবজেক্ট স্পষ্টভাবে সংজ্ঞায়িত করে কোন স্ট্যাটাস → স্ট্যাটাস ট্রানজিশন অনুমোদিত। তালিকায় না থাকা যেকোনো ট্রানজিশন প্রত্যাখ্যান করা হয়। `CANCELLED` এ REQUESTED, ACCEPTED, বা PAID থেকে যাওয়া যায়।

---

## 14. Booking Module / বুকিং মডিউল

### `src/modules/booking/booking.route.ts`

```ts
router.post("/", auth(Role.CUSTOMER), validateRequest(createBookingRules), bookingController.create);
router.get("/", auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN), bookingController.getAll);
router.get("/:id", auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN), bookingController.getById);
router.patch("/:id/cancel", auth(Role.CUSTOMER), bookingController.cancel);
```

**Unique feature: Cancel endpoint / বিশেষ বৈশিষ্ট্য: ক্যান্সেল এন্ডপয়েন্ট**

`PATCH /api/bookings/:id/cancel` — Only CUSTOMER can cancel their own booking, and only if status is REQUESTED, ACCEPTED, or PAID.

### `src/modules/booking/booking.service.ts`

**`getMyBookings` — Role-based filtering:**

```ts
const getMyBookings = async (userId: string, role: string) => {
  const where =
    role === "CUSTOMER" ? { customerId: userId }
    : role === "TECHNICIAN" ? { technicianId: userId }
    : {};  // Admin sees all

  return prisma.booking.findMany({
    where,
    include: { service: true, customer: { omit: { password: true } }, technician: { omit: { password: true } }, payment: true, review: true },
    orderBy: { id: "desc" },
  });
};
```

---

## 15. Payment Module / পেমেন্ট মডিউল

### `src/modules/payment/payment.route.ts`

```ts
router.post("/create", auth(Role.CUSTOMER), paymentController.create);
router.post("/confirm", auth(Role.CUSTOMER), paymentController.confirm);
router.get("/", auth(Role.CUSTOMER, Role.ADMIN), paymentController.getAll);
router.get("/:id", auth(Role.CUSTOMER), paymentController.getById);
// Webhook is mounted in app.ts (raw body needed)
```

### Payment Flow / পেমেন্ট ফ্লো

```
1. CUSTOMER: POST /payments/create → { bookingId }
   → Returns { clientSecret, payment }
2. Frontend uses clientSecret to complete payment in Stripe Elements
3. Stripe sends webhook → POST /payments/webhook (raw body)
   OR CUSTOMER: POST /payments/confirm → { paymentIntentId }
```

### `src/modules/payment/payment.service.ts`

**`createPaymentIntent`:**

```ts
const createPaymentIntent = async (customerId, bookingId) => {
  // 1. Validate: booking exists, belongs to customer, status is ACCEPTED
  // 2. Check not already paid (COMPLETED)
  // 3. Convert price to cents (Math.round(price * 100))
  // 4. Create Stripe PaymentIntent
  const paymentIntent = await getStripe().paymentIntents.create({
    amount: amountInCents,     // e.g. 8050 for $80.50
    currency: "usd",
    metadata: { bookingId },   // Store bookingId for webhook
  });
  // 5. Upsert payment record in DB
  // 6. Return { clientSecret, payment }
};
```

**`confirmPayment`:**

```ts
const confirmPayment = async (paymentIntentId) => {
  // 1. Verify with Stripe (retrieve payment intent)
  // 2. Update payment status → COMPLETED
  // 3. Update booking status → PAID
  return payment;
};
```

**`handleStripeWebhook`:**

```ts
const handleStripeWebhook = async (body, sig) => {
  // 1. Verify webhook signature using STRIPE_WEBHOOK_SECRET
  const event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  // 2. If event.type === "payment_intent.succeeded", call confirmPayment
  return { received: true };
};
```

---

## 16. Review Module / রিভিউ মডিউল

### `src/modules/review/review.route.ts`

```ts
router.post("/", auth(Role.CUSTOMER), validateRequest(createReviewRules), reviewController.create);
```

### `src/modules/review/review.validation.ts`

```ts
export const createReviewRules: ValidationRule[] = [
  { field: "bookingId", required: true, type: "string", message: "Booking ID is required" },
  { field: "rating", required: true, type: "number", min: 1, max: 5, message: "Rating must be between 1 and 5" },
  { field: "comment", type: "string" },
];
```

### Validation Checks / ভ্যালিডেশন চেক

| Check | Reason | কারণ |
|-------|--------|------|
| Booking exists | Can't review non-existent booking | নেই এমন বুকিং রিভিউ করা যাবে না |
| Owns booking | Can't review someone else's | অন্যের বুকিং রিভিউ করা যাবে না |
| Booking COMPLETED | Can't review before job done | কাজ শেষ হওয়ার আগে রিভিউ দেওয়া যাবে না |
| No existing review | One review per booking | প্রতি বুকিং এ একটি মাত্র রিভিউ |
| Rating 1-5 | Validates rating range | রেটিং এর রেঞ্জ ভ্যালিডেট করে |

---

## 17. Admin Module / অ্যাডমিন মডিউল

### `src/modules/admin/admin.route.ts`

```ts
router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserBanStatus);
router.get("/bookings", auth(Role.ADMIN), adminController.getAllBookings);
router.get("/categories", auth(Role.ADMIN), adminController.getAllCategories);
router.post("/categories", auth(Role.ADMIN), adminController.createCategory);
```

### `src/modules/admin/admin.service.ts`

**`getAllUsers` — Excludes password via `select`:**

```ts
const getAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, isBanned: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
};
```

**`updateUserBanStatus` — Cannot ban other admins:**

```ts
const updateUserBanStatus = async (userId, isBanned) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  if (user.role === "ADMIN") throw new AppError(httpStatus.BAD_REQUEST, "Cannot ban an admin");
  // ... update user
};
```

**`getAllCategories` — Admin-only category management:**

```ts
const getAllCategories = async () => {
  return prisma.category.findMany({
    include: { services: true },
    orderBy: { name: "asc" },
  });
};
```

**English**: The admin module also includes category management endpoints (`GET /admin/categories` and `POST /admin/categories`), duplicating some functionality from the Category module. This gives two ways to manage categories — through admin endpoints or public endpoints.

**বাংলা**: অ্যাডমিন মডিউলে ক্যাটাগরি ম্যানেজমেন্ট এন্ডপয়েন্টও রয়েছে (`GET /admin/categories` এবং `POST /admin/categories`), যা ক্যাটাগরি মডিউলের কিছু কার্যকারিতা ডুপ্লিকেট করে। এটি ক্যাটাগরি ম্যানেজ করার দুটি উপায় দেয় — অ্যাডমিন এন্ডপয়েন্ট বা পাবলিক এন্ডপয়েন্টের মাধ্যমে।

---

## 18. Seed Script / সিড স্ক্রিপ্ট

### `prisma/seed.ts`

```ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@fixitnow.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@fixitnow.com",
      password: hashedPassword,
      role: "ADMIN",
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

| Detail | Value |
|--------|-------|
| **Admin email** | `admin@fixitnow.com` |
| **Admin password** | `admin123` |
| **Run command** | `npm run prisma:seed` or `tsx prisma/seed.ts` |
| **Hash algorithm** | bcryptjs with 10 salt rounds |

**English**: Uses `upsert` so running seed multiple times won't create duplicate admin. The seed script creates its own PrismaClient (not using the one from `src/lib/prisma.ts`) because it's a standalone script.

**বাংলা**: `upsert` ব্যবহার করে যাতে একাধিকবার সিড চালালেও ডুপ্লিকেট অ্যাডমিন তৈরি না হয়। সিড স্ক্রিপ্ট তার নিজস্ব PrismaClient তৈরি করে (`src/lib/prisma.ts` থেকে ব্যবহার না করে) কারণ এটি একটি স্বতন্ত্র স্ক্রিপ্ট।

---

## Architecture Summary / আর্কিটেকচার সারাংশ

### Design Pattern: Module-based MVC / মডিউল-ভিত্তিক MVC

```
Route (router)  →  Middleware (validation, auth)  →  Controller  →  Service  →  Database (Prisma)
     |                         |                          |              |
    Defines URL               Validates/Protects        Handles       Business logic
    and HTTP method            before reaching           request/       + DB queries
                               the controller            response
```

### Complete Data Flow: Create a Booking

```
1. CUSTOMER sends POST /api/bookings with { serviceId }
2. Route matches → auth(Role.CUSTOMER) middleware runs
   → Checks req.cookies.accessToken OR Authorization header
   → Verifies JWT → checks user exists & not banned
   → Attaches { id, name, email, role } to req.user
3. validateRequest(createBookingRules) middleware runs
   → Validates body has serviceId
4. bookingController.create runs
   → Calls bookingService.createBooking({ customerId: req.user.id, serviceId, scheduleDate })
5. bookingService.createBooking runs
   → Finds the service → gets technicianId from service
   → Creates booking in database with status REQUESTED
   → Returns booking with service, customer, technician data
6. Controller sends 201 response with booking data
```

### File Organization / ফাইল সংগঠন

```
src/modules/<module-name>/
├── <module-name>.service.ts     →  Business logic + DB queries
├── <module-name>.controller.ts  →  Request/response handling
├── <module-name>.routes.ts      →  Route definitions + middleware chains
├── <module-name>.validation.ts  →  ValidationRule arrays (instead of Zod)
└── <module-name>.interface.ts   →  TypeScript interfaces (optional)
```

### Key Differences From Common Patterns / সাধারণ প্যাটার্ন থেকে মূল পার্থক্য

| Aspect | This Project | Common Pattern |
|--------|-------------|---------------|
| **Validation** | Custom `ValidationRule[]` middleware | Zod (`z.object`) |
| **`sendResponse`** | Single object param `({ success, statusCode, message, data })` | Multiple params `(res, code, msg, data)` |
| **Auth token source** | Cookie FIRST, then Bearer header | Usually only Bearer header |
| **`req.user`** | `{ id, name, email, role }` | Usually `{ userId, role }` |
| **Password omission** | `omit: { password: true }` (Prisma 7 feature) | `select: { ...all fields except password }` |
| **Stripe client** | Singleton via `getStripe()` function | Direct `new Stripe(key)` at module level |
| **Status codes** | `httpStatus.OK`, `httpStatus.NOT_FOUND`, etc. | Raw numbers (200, 404, etc.) |
| **Error handling** | Only `AppError` and generic `Error` | Often includes Zod error handling |
| **Controller exports** | Named object `export const xController = { ... }` | Multiple named function exports |
| **Auto-create tech profile** | NOT done on registration | Usually auto-created on TECHNICIAN registration |

---

## Key Takeaways / মূল শিক্ষা

| Concept | English | বাংলা |
|---------|---------|-------|
| **ES Modules** | `import`/`export` instead of `require` | `require` এর পরিবর্তে `import`/`export` |
| **Module pattern** | Each module is self-contained with .routes, .controller, .service, .validation | প্রতিটি মডিউল স্বয়ংসম্পূর্ণ |
| **Custom validation** | Rule-based validation instead of Zod | Zod এর পরিবর্তে রুল-বেসড ভ্যালিডেশন |
| **JWT dual tokens** | Access token (1d) + Refresh token (30d) | অ্যাক্সেস টোকেন (1d) + রিফ্রেশ টোকেন (30d) |
| **Cookie auth** | Tokens stored in httpOnly cookies and Bearer header | httpOnly কুকি এবং Bearer হেডারে টোকেন |
| **Prisma 7 omit** | `omit: { password: true }` to exclude fields | ফিল্ড বাদ দিতে `omit: { password: true }` |
| **Status transitions** | Explicit `validTransitions` object for booking flow | বুকিং ফ্লোর জন্য স্পষ্ট `validTransitions` অবজেক্ট |
| **Stripe webhook** | Raw body parser before JSON parser | JSON parser এর আগে raw body পার্সার |
| **catchAsync** | try/catch wrapper for async handlers | async হ্যান্ডলারের জন্য try/catch র‍্যাপার |
| **AppError** | Custom error with httpStatus codes | httpStatus কোড সহ কাস্টম এরর |
| **Singleton pattern** | Single Prisma + Stripe instances | একক Prisma + Stripe instance |

---

*Happy coding! শিখতে থাকুন! 🚀*
