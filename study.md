# FixItNow - Complete Codebase Study Guide / সম্পূর্ণ কোডবেস স্টাডি গাইড

> **Language**: Each section has explanations in English 🇬🇧 and Bengali 🇧🇩
> **ভাষা**: প্রতিটি অংশ ইংরেজি 🇬🇧 এবং বাংলা 🇧🇩 তে ব্যাখ্যা করা হয়েছে

---

## Table of Contents / সূচিপত্র

1. [Configuration & Entry / কনফিগারেশন ও এন্ট্রি](#1-configuration--entry)
2. [Custom Error / কাস্টম এরর](#2-custom-error)
3. [Utilities / ইউটিলিটি](#3-utilities)
4. [Middlewares / মিডলওয়্যার](#4-middlewares)
5. [Routes Index / রুট ইনডেক্স](#5-routes-index)
6. [Auth Module / অথ মডিউল](#6-auth-module)
7. [User Module / ইউজার মডিউল](#7-user-module)
8. [Category Module / ক্যাটাগরি মডিউল](#8-category-module)
9. [Service Module / সার্ভিস মডিউল](#9-service-module)
10. [Technician Module / টেকনিশিয়ান মডিউল](#10-technician-module)
11. [Booking Module / বুকিং মডিউল](#11-booking-module)
12. [Payment Module / পেমেন্ট মডিউল](#12-payment-module)
13. [Review Module / রিভিউ মডিউল](#13-review-module)
14. [Admin Module / অ্যাডমিন মডিউল](#14-admin-module)
15. [Seed Script / সিড স্ক্রিপ্ট](#15-seed-script)

---

## 1. Configuration & Entry / কনফিগারেশন ও এন্ট্রি

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
| 1 | Import the Express app instance from `./app` | `./app` থেকে Express অ্যাপ ইনস্ট্যান্স ইম্পোর্ট করে |
| 2 | Import the Prisma client from the lib folder | lib ফোল্ডার থেকে Prisma ক্লায়েন্ট ইম্পোর্ট করে |
| 3 | Import configuration object (port, secrets, etc.) | কনফিগারেশন অবজেক্ট ইম্পোর্ট করে (পোর্ট, সিক্রেট ইত্যাদি) |
| 5 | Set the port number from config | কনফিগ থেকে পোর্ট নম্বর সেট করে |
| 7 | Declare an async function called `main` | `main` নামে একটি async ফাংশন ডিক্লেয়ার করে |
| 8 | Try block to catch any startup errors | স্টার্টআপ এরর ক্যাচ করার জন্য try ব্লক |
| 9 | Connect to the PostgreSQL database via Prisma | Prisma এর মাধ্যমে PostgreSQL ডাটাবেসে কানেক্ট করে |
| 10 | Log success message after database connection | ডাটাবেস কানেকশনের পর সাফল্যের বার্তা লগ করে |
| 11 | Start the Express server on the specified port | নির্দিষ্ট পোর্টে Express সার্ভার শুরু করে |
| 12 | Log a message when the server is running | সার্ভার চালু হলে একটি বার্তা লগ করে |
| 14 | Catch block for handling startup errors | স্টার্টআপ এরর হ্যান্ডল করার জন্য ক্যাচ ব্লক |
| 15 | Log the error to the console | কনসোলে এরর লগ করে |
| 16 | Disconnect from the database gracefully | ডাটাবেস থেকে সঠিকভাবে ডিসকানেক্ট করে |
| 17 | Exit the process with failure code (1) | প্রসেস ব্যর্থ কোড (1) দিয়ে বন্ধ করে |
| 19 | Closing brace for the `main` function | `main` ফাংশনের সমাপ্তি |
| 21 | Call the `main` function to start everything | সবকিছু শুরু করতে `main` ফাংশন কল করে |

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
| 1 | Import cookie-parser middleware for parsing cookies | কুকি পার্স করার জন্য cookie-parser মিডলওয়্যার ইম্পোর্ট |
| 2 | Import express and its TypeScript types | express এবং এর TypeScript টাইপ ইম্পোর্ট |
| 3 | Import configuration object | কনফিগারেশন অবজেক্ট ইম্পোর্ট |
| 4 | Import CORS middleware for cross-origin requests | ক্রস-অরিজিন রিকোয়েস্টের জন্য CORS মিডলওয়্যার ইম্পোর্ট |
| 5 | Import the main router that combines all module routes | সব মডিউল রুট একত্রিত করে এমন প্রধান রাউটার ইম্পোর্ট |
| 6 | Import the global error handler middleware | গ্লোবাল এরর হ্যান্ডলার মিডলওয়্যার ইম্পোর্ট |
| 7 | Import the 404 not-found handler | 404 নট-ফাউন্ড হ্যান্ডলার ইম্পোর্ট |
| 8 | Import the payment controller for the webhook route | ওয়েবহুক রুটের জন্য পেমেন্ট কন্ট্রোলার ইম্পোর্ট |
| 10 | Create the Express application instance | Express অ্যাপ্লিকেশন ইনস্ট্যান্স তৈরি |
| 12-16 | Enable CORS with the app's URL from config | কনফিগ থেকে অ্যাপের URL দিয়ে CORS চালু করে |
| 18-22 | Define the Stripe webhook route BEFORE body parsers (needs raw body) | Stripe ওয়েবহুক রুট বডি পার্সারের আগে সংজ্ঞায়িত (raw body প্রয়োজন) |
| 24 | Parse incoming JSON request bodies | আগত JSON রিকোয়েস্ট বডি পার্স করে |
| 25 | Parse URL-encoded form data | URL-encoded ফর্ম ডাটা পার্স করে |
| 26 | Parse cookies from incoming requests | আগত রিকোয়েস্ট থেকে কুকি পার্স করে |
| 28-30 | Root route that sends a "Hello, World!" response | রুট রুট যা "Hello, World!" রেসপন্স পাঠায় |
| 32 | Mount all API routes under the `/api` prefix | সব API রুট `/api` প্রিফিক্সের অধীনে মাউন্ট করে |
| 34 | Use the 404 handler for unmatched routes | অম্যাচড রুটের জন্য 404 হ্যান্ডলার ব্যবহার করে |
| 35 | Use the global error handler for all errors | সব এররের জন্য গ্লোবাল এরর হ্যান্ডলার ব্যবহার করে |
| 37 | Export the app instance for use in server.ts | server.ts এ ব্যবহারের জন্য অ্যাপ ইনস্ট্যান্স এক্সপোর্ট |

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

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import dotenv to load environment variables | এনভায়রনমেন্ট ভেরিয়েবল লোড করতে dotenv ইম্পোর্ট |
| 2 | Import Node.js path module for file paths | ফাইল পাথের জন্য Node.js path মডিউল ইম্পোর্ট |
| 4 | Load the `.env` file from the project root directory | প্রজেক্ট রুট ডিরেক্টরি থেকে `.env` ফাইল লোড করে |
| 6 | Export a configuration object with all environment values | সব এনভায়রনমেন্ট ভ্যালু সহ একটি কনফিগারেশন অবজেক্ট এক্সপোর্ট |
| 7 | Server port, defaults to 5050 if not set | সার্ভার পোর্ট, সেট না থাকলে 5050 ডিফল্ট |
| 8 | PostgreSQL database connection URL | PostgreSQL ডাটাবেস কানেকশন URL |
| 9 | Frontend application URL for CORS | CORS এর জন্য ফ্রন্টএন্ড অ্যাপ্লিকেশন URL |
| 10 | Number of salt rounds for bcrypt password hashing | bcrypt পাসওয়ার্ড হ্যাশিং এর জন্য সল্ট রাউন্ডের সংখ্যা |
| 11 | Secret key for signing JWT access tokens | JWT অ্যাক্সেস টোকেন সই করার জন্য সিক্রেট কী |
| 12 | Secret key for signing JWT refresh tokens | JWT রিফ্রেশ টোকেন সই করার জন্য সিক্রেট কী |
| 13 | Expiration duration for access tokens (e.g. "1d", "15m") | অ্যাক্সেস টোকেনের মেয়াদ শেষ হওয়ার সময় |
| 14 | Expiration duration for refresh tokens (e.g. "30d") | রিফ্রেশ টোকেনের মেয়াদ শেষ হওয়ার সময় |

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
| 1 | Load environment variables at the module level | মডিউল লেভেলে এনভায়রনমেন্ট ভেরিয়েবল লোড করে |
| 2 | Import the Prisma PostgreSQL adapter (for connection pooling) | Prisma PostgreSQL অ্যাডাপ্টার ইম্পোর্ট (কানেকশন পুলিং এর জন্য) |
| 3 | Import the generated Prisma client from the generated folder | জেনারেটেড ফোল্ডার থেকে জেনারেটেড Prisma ক্লায়েন্ট ইম্পোর্ট |
| 5 | Read the database connection string from environment | এনভায়রনমেন্ট থেকে ডাটাবেস কানেকশন স্ট্রিং পড়ে |
| 7-9 | Throw an error if DATABASE_URL is not set | DATABASE_URL সেট না থাকলে এরর থ্রো করে |
| 11 | Create a Prisma PostgreSQL adapter with the connection string | কানেকশন স্ট্রিং দিয়ে Prisma PostgreSQL অ্যাডাপ্টার তৈরি |
| 12 | Create the Prisma client with the adapter for database operations | অ্যাডাপ্টার সহ Prisma ক্লায়েন্ট তৈরি করে ডাটাবেস অপারেশনের জন্য |
| 14 | Export the prisma instance for use across the app | অ্যাপ জুড়ে ব্যবহারের জন্য prisma ইনস্ট্যান্স এক্সপোর্ট |

---

### `prisma.config.ts`

```ts
// This file was generated by Prisma, and assumes you have installed the following:
// npm install --save-dev prisma dotenv
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Comment noting this is auto-generated by Prisma setup | মন্তব্য: এটি Prisma সেটআপ দ্বারা অটো-জেনারেটেড |
| 2 | Comment listing required dev dependencies | মন্তব্য: প্রয়োজনীয় ডেভ ডিপেন্ডেন্সি তালিকা |
| 3 | Load environment variables from .env file | .env ফাইল থেকে এনভায়রনমেন্ট ভেরিয়েবল লোড করে |
| 4 | Import the defineConfig helper from the prisma/config module | prisma/config মডিউল থেকে defineConfig হেল্পার ইম্পোর্ট |
| 6 | Export a Prisma configuration object by calling defineConfig | defineConfig কল করে Prisma কনফিগারেশন অবজেক্ট এক্সপোর্ট |
| 7 | Specify the location of Prisma schema files | Prisma schema ফাইলের অবস্থান নির্দেশ করে |
| 8-10 | Configuration for database migrations directory | ডাটাবেস মাইগ্রেশন ডিরেক্টরির কনফিগারেশন |
| 11-13 | Configuration for the database datasource with URL from env | এনভ থেকে URL সহ ডাটাবেস ডেটাসোর্সের কনফিগারেশন |

---

## 2. Custom Error / কাস্টম এরর

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

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Define and export a custom error class that extends the built-in Error class | বিল্ট-ইন Error ক্লাসকে এক্সটেন্ড করে একটি কাস্টম এরর ক্লাস ডিফাইন ও এক্সপোর্ট |
| 2 | Declare a public property `statusCode` to store HTTP status code | HTTP স্ট্যাটাস কোড সংরক্ষণের জন্য public property `statusCode` ডিক্লেয়ার |
| 4 | Constructor that takes statusCode, message, and an optional stack trace | statusCode, message এবং অপশনাল স্ট্যাক ট্রেস নেয় এমন কনস্ট্রাক্টর |
| 5 | Call the parent Error class constructor with the message | মেসেজ সহ প্যারেন্ট Error ক্লাসের কনস্ট্রাক্টর কল করে |
| 6 | Set the statusCode property on the instance | ইনস্ট্যান্সে statusCode প্রপার্টি সেট করে |
| 7 | Check if a custom stack trace was provided | কাস্টম স্ট্যাক ট্রেস দেওয়া হয়েছে কিনা চেক করে |
| 8 | If provided, set the stack to the custom stack | দিলে, স্ট্যাকটি কাস্টম স্ট্যাক দিয়ে সেট করে |
| 9 | Else branch - no custom stack provided | অন্যথায় - কাস্টম স্ট্যাক দেওয়া হয়নি |
| 10 | Capture the current stack trace automatically for debugging | ডিবাগিংয়ের জন্য স্বয়ংক্রিয়ভাবে বর্তমান স্ট্যাক ট্রেস ক্যাপচার করে |
| 11-12 | Closing braces | সমাপ্তি ব্রেস |

---

## 3. Utilities / ইউটিলিটি

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

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import Express request, response, next function, and request handler types | Express রিকোয়েস্ট, রেসপন্স, নেক্সট ফাংশন এবং রিকোয়েস্ট হ্যান্ডলার টাইপ ইম্পোর্ট |
| 3 | Export a function named `catchAsync` that takes a RequestHandler `fn` | `fn` নামক RequestHandler নেয় এমন `catchAsync` ফাংশন এক্সপোর্ট |
| 4 | Return a new async function that receives req, res, and next | একটি নতুন async ফাংশন রিটার্ন করে যা req, res এবং next গ্রহণ করে |
| 5 | Try block to execute the original handler | মূল হ্যান্ডলার চালানোর জন্য try ব্লক |
| 6 | Await the original handler function with all arguments | সব আর্গুমেন্ট সহ মূল হ্যান্ডলার ফাংশন await করে |
| 7 | Catch any error thrown by the async handler | async হ্যান্ডলার দ্বারা নিক্ষিপ্ত যেকোনো এরর ক্যাচ করে |
| 8 | Forward the error to Express's error handling via next() | next() এর মাধ্যমে Express এর এরর হ্যান্ডলিংয়ে এরর ফরওয়ার্ড করে |
| 9-11 | Closing braces | সমাপ্তি ব্রেস |

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

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import the Express Response type | Express Response টাইপ ইম্পোর্ট |
| 3-7 | Define a TMeta type for pagination metadata (page, limit, total) | পেজিনেশন মেটাডাটার জন্য TMeta টাইপ সংজ্ঞায়িত (পৃষ্ঠা, সীমা, মোট) |
| 9-15 | Define a generic TResponseData type with success, statusCode, message, optional data, and optional meta | সাকসেস, স্ট্যাটাসকোড, মেসেজ, অপশনাল ডাটা ও অপশনাল মেটা সহ জেনেরিক TResponseData টাইপ সংজ্ঞায়িত |
| 17 | Export a generic sendResponse function that takes the Response object and response data | রেসপন্স অবজেক্ট এবং রেসপন্স ডাটা নেয় এমন জেনেরিক sendResponse ফাংশন এক্সপোর্ট |
| 18 | Set the HTTP status code and send JSON response | HTTP স্ট্যাটাস কোড সেট করে JSON রেসপন্স পাঠায় |
| 19-24 | Include success, statusCode, message, data, and meta in the JSON body | JSON বডিতে success, statusCode, message, data এবং meta অন্তর্ভুক্ত করে |

---

### `src/utils/jwt.ts`

```ts
import jwt, { JwtPayload } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string | number,
) => {
  const token = jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
  return token;
};

const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret) as JwtPayload;
    return {
      success: true,
      data: verifiedToken,
    };
  } catch (error: any) {
    console.error("Token verification failed:", error);
    return {
      success: false,
      message: error.message || "Token verification failed",
    };
  }
};

export const jwtUtils = {
  createToken,
  verifyToken,
};
```

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import jsonwebtoken library and its JwtPayload type | jsonwebtoken লাইব্রেরি এবং এর JwtPayload টাইপ ইম্পোর্ট |
| 3-7 | Define a function `createToken` that takes payload, secret, and expiration | পেলোড, সিক্রেট এবং মেয়াদ উত্তীর্ণের সময় নেয় এমন `createToken` ফাংশন সংজ্ঞায়িত |
| 8 | Sign a JWT with the payload, secret, and expiration option | পেলোড, সিক্রেট এবং মেয়াদ উত্তীর্ণ অপশন সহ JWT সই করে |
| 9 | Return the generated token string | উৎপন্ন টোকেন স্ট্রিং রিটার্ন করে |
| 12 | Define a function `verifyToken` that takes a token and secret | টোকেন এবং সিক্রেট নেয় এমন `verifyToken` ফাংশন সংজ্ঞায়িত |
| 13 | Try block to attempt verification | ভেরিফিকেশন চেষ্টা করার জন্য try ব্লক |
| 14 | Verify the token with the secret and cast the result as JwtPayload | সিক্রেট দিয়ে টোকেন ভেরিফাই করে এবং ফলাফলকে JwtPayload হিসেবে টাইপ কাস্ট করে |
| 15-17 | Return success true along with the decoded data | সাফল্য true এবং ডিকোডেড ডাটা সহ রিটার্ন করে |
| 19 | Catch block if verification fails | ভেরিফিকেশন ব্যর্থ হলে ক্যাচ ব্লক |
| 20 | Log the verification error to the console | কনসোলে ভেরিফিকেশন এরর লগ করে |
| 21-24 | Return success false with an error message | সাফল্য false এবং এরর মেসেজ সহ রিটার্ন করে |
| 28-31 | Export an object containing both functions for easy import | সহজ ইম্পোর্টের জন্য উভয় ফাংশন ধারণকারী একটি অবজেক্ট এক্সপোর্ট |

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
      throw new Error(
        "STRIPE_SECRET_KEY is not configured in environment variables",
      );
    }
    stripeInstance = new Stripe(key);
  }
  return stripeInstance;
}
```

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Load environment variables when this module is imported | এই মডিউল ইম্পোর্ট হলে এনভায়রনমেন্ট ভেরিয়েবল লোড করে |
| 2 | Import the Stripe library for payment processing | পেমেন্ট প্রসেসিংয়ের জন্য Stripe লাইব্রেরি ইম্পোর্ট |
| 4 | Declare a module-level variable to hold the Stripe instance (initially null) | Stripe ইনস্ট্যান্স রাখার জন্য মডিউল-লেভেল ভেরিয়েবল ডিক্লেয়ার (প্রাথমিকভাবে null) |
| 6 | Export a function `getStripe` that returns a Stripe instance | Stripe ইনস্ট্যান্স রিটার্ন করে এমন `getStripe` ফাংশন এক্সপোর্ট |
| 7 | Check if stripeInstance has not been initialized yet | stripeInstance এখনও আরম্ভ হয়নি কিনা চেক করে |
| 8 | Read the Stripe secret key from environment variables | এনভায়রনমেন্ট ভেরিয়েবল থেকে Stripe সিক্রেট কী পড়ে |
| 9-12 | Throw an error if the key is not configured | কী কনফিগার না থাকলে একটি এরর থ্রো করে |
| 14 | Create a new Stripe instance with the secret key | সিক্রেট কী দিয়ে একটি নতুন Stripe ইনস্ট্যান্স তৈরি |
| 16 | Return the Stripe instance (either newly created or cached) | Stripe ইনস্ট্যান্স রিটার্ন করে (নতুন তৈরি বা ক্যাশ করা) |

---

## 4. Middlewares / মিডলওয়্যার

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

    const verifiedToken = jwtUtils.verifyToken(
      token,
      process.env.JWT_ACCESS_SECRET!,
    );

    if (!verifiedToken.success) {
      throw new AppError(httpStatus.UNAUTHORIZED, verifiedToken.message);
    }

    const { id, name, email, role } = verifiedToken.data as {
      id: string;
      name: string;
      email: string;
      role: Role;
    };

    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You do not have permission to access this resource",
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
    }

    if (user.isBanned) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Your account has been banned",
      );
    }

    req.user = {
      id,
      name,
      email,
      role,
    };

    next();
  });
};
```


| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import Express types for Request, Response, and NextFunction | Express টাইপ Request, Response এবং NextFunction ইম্পোর্ট |
| 2 | Import the Role enum from generated Prisma enums | জেনারেটেড Prisma এনাম থেকে Role এনাম ইম্পোর্ট |
| 3 | Import the Prisma client for database queries | ডাটাবেস কোয়েরির জন্য Prisma ক্লায়েন্ট ইম্পোর্ট |
| 4 | Import catchAsync wrapper for error handling | এরর হ্যান্ডলিংয়ের জন্য catchAsync র্যাপার ইম্পোর্ট |
| 5 | Import JWT utility functions | JWT ইউটিলিটি ফাংশন ইম্পোর্ট |
| 6 | Import custom AppError class | কাস্টম AppError ক্লাস ইম্পোর্ট |
| 7 | Import http-status library for HTTP status codes | HTTP স্ট্যাটাস কোডের জন্য http-status লাইব্রেরি ইম্পোর্ট |
| 9-20 | Extend Express Request interface globally to add an optional `user` property | Express Request ইন্টারফেস গ্লোবালভাবে এক্সটেন্ড করে অপশনাল `user` প্রপার্টি যোগ করে |
| 22 | Export the `auth` middleware function that accepts required roles | প্রয়োজনীয় রোল গ্রহণ করে এমন `auth` মিডলওয়্যার ফাংশন এক্সপোর্ট |
| 23 | Return a catchAsync-wrapped async middleware function | catchAsync-র্যাপড async মিডলওয়্যার ফাংশন রিটার্ন করে |
| 24-28 | Extract token from cookies first, then Authorization header, with Bearer scheme support | কুকি থেকে প্রথমে, তারপর Authorization হেডার থেকে Bearer স্কিমা সহ টোকেন বের করে |
| 30-32 | Throw 401 error if no token is found | কোনো টোকেন না পাওয়া গেলে 401 এরর থ্রো করে |
| 34-37 | Verify the JWT token using the access secret | অ্যাক্সেস সিক্রেট ব্যবহার করে JWT টোকেন ভেরিফাই করে |
| 39-41 | Throw 401 error if token verification failed | টোকেন ভেরিফিকেশন ব্যর্থ হলে 401 এরর থ্রো করে |
| 43-48 | Destructure id, name, email, and role from the decoded token | ডিকোডেড টোকেন থেকে id, name, email এবং role ডিস্ট্রাকচার করে |
| 50-55 | Check if the user's role is in the allowed roles list; throw 403 if not | ইউজারের রোল অনুমোদিত রোল তালিকায় আছে কিনা চেক করে; না থাকলে 403 থ্রো করে |
| 57-59 | Find the user in the database by ID | আইডি দ্বারা ডাটাবেসে ইউজার খুঁজে |
| 61-63 | Throw 401 error if user no longer exists | ইউজার আর না থাকলে 401 এরর থ্রো করে |
| 65-70 | Throw 403 error if the user account is banned | ইউজার অ্যাকাউন্ট ব্যান করা থাকলে 403 এরর থ্রো করে |
| 72-77 | Attach user info (id, name, email, role) to the request object | রিকোয়েস্ট অবজেক্টে ইউজার তথ্য (id, name, email, role) অ্যাটাচ করে |
| 79 | Call next() to pass control to the next middleware/route handler | পরবর্তী মিডলওয়্যার/রুট হ্যান্ডলারে নিয়ন্ত্রণ পাঠাতে next() কল করে |

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

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import Express Request and Response types | Express Request এবং Response টাইপ ইম্পোর্ট |
| 2 | Import http-status for HTTP status constants | HTTP স্ট্যাটাস কনস্ট্যান্টের জন্য http-status ইম্পোর্ট |
| 4 | Export a middleware function that handles 404 routes | 404 রুট হ্যান্ডল করে এমন একটি মিডলওয়্যার ফাংশন এক্সপোর্ট |
| 5 | Set HTTP status to 404 and return a JSON response | HTTP স্ট্যাটাস 404 সেট করে একটি JSON রেসপন্স রিটার্ন করে |
| 6-9 | Send a consistent error response with success false, status code, message, and empty error details | সাফল্য false, স্ট্যাটাস কোড, বার্তা এবং খালি এরর বিশদ সহ একটি সামঞ্জস্যপূর্ণ এরর রেসপন্স পাঠায় |

---

### `src/middlewares/globalErrorHandler.ts`

```ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import httpStatus from "http-status";

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
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

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import Express types | Express টাইপ ইম্পোর্ট |
| 2 | Import the custom AppError class | কাস্টম AppError ক্লাস ইম্পোর্ট |
| 3 | Import http-status library | http-status লাইব্রেরি ইম্পোর্ট |
| 5-10 | Export the global error handler middleware with err, req, res, next parameters | err, req, res, next প্যারামিটার সহ গ্লোবাল এরর হ্যান্ডলার মিডলওয়্যার এক্সপোর্ট |
| 11 | Default status code to 500 (Internal Server Error) | ডিফল্ট স্ট্যাটাস কোড 500 (অভ্যন্তরীণ সার্ভার ত্রুটি) |
| 12 | Default error message | ডিফল্ট এরর বার্তা |
| 13 | Initialize error details as empty object | এরর বিশদ খালি অবজেক্ট হিসেবে আরম্ভ |
| 15-18 | If the error is an AppError, use its statusCode, message, and stack | এরর যদি AppError হয়, তার statusCode, message এবং stack ব্যবহার করে |
| 19-23 | If the error is a generic Error, use 500 status with its message and stack | এরর যদি জেনেরিক Error হয়, তার message এবং stack সহ 500 স্ট্যাটাস ব্যবহার করে |
| 25-30 | Send a JSON response with the error details | এরর বিশদ সহ একটি JSON রেসপন্স পাঠায় |

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
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} is required`,
        });
        continue;
      }

      if (value === undefined || value === null) continue;

      if (rule.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push({
            field: rule.field,
            message: rule.message || `Invalid email format`,
          });
        }
      }

      if (rule.type === "string" && typeof value === "string") {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push({
            field: rule.field,
            message: rule.message || `${rule.field} must be at least ${rule.minLength} characters`,
          });
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push({
            field: rule.field,
            message: rule.message || `${rule.field} must be at most ${rule.maxLength} characters`,
          });
        }
      }

      if (rule.type === "number") {
        const num = Number(value);
        if (isNaN(num)) {
          errors.push({
            field: rule.field,
            message: rule.message || `${rule.field} must be a number`,
          });
        } else {
          if (rule.min !== undefined && num < rule.min) {
            errors.push({
              field: rule.field,
              message: rule.message || `${rule.field} must be at least ${rule.min}`,
            });
          }
          if (rule.max !== undefined && num > rule.max) {
            errors.push({
              field: rule.field,
              message: rule.message || `${rule.field} must be at most ${rule.max}`,
            });
          }
        }
      }

      if (rule.enum && !rule.enum.includes(value)) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} must be one of: ${rule.enum.join(", ")}`,
        });
      }
    }

    if (errors.length > 0) {
      return next(new AppError(httpStatus.BAD_REQUEST, errors[0].message));
    }

    next();
  };
};
```

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import Express types | Express টাইপ ইম্পোর্ট |
| 2 | Import AppError for throwing validation errors | ভ্যালিডেশন এরর থ্রো করার জন্য AppError ইম্পোর্ট |
| 3 | Import http-status for status codes | স্ট্যাটাস কোডের জন্য http-status ইম্পোর্ট |
| 5-16 | Export a ValidationRule type defining the structure of each validation rule | প্রতিটি ভ্যালিডেশন নিয়মের গঠন সংজ্ঞায়িত করে ValidationRule টাইপ এক্সপোর্ট |
| 18 | Export the validateRequest middleware function that takes an array of rules | নিয়মের অ্যারে নেয় এমন validateRequest মিডলওয়্যার ফাংশন এক্সপোর্ট |
| 19 | Return the actual middleware function | প্রকৃত মিডলওয়্যার ফাংশন রিটার্ন করে |
| 20 | Initialize an empty array to collect validation errors | ভ্যালিডেশন এরর সংগ্রহের জন্য একটি খালি অ্যারে আরম্ভ |
| 22 | Loop through each validation rule | প্রতিটি ভ্যালিডেশন নিয়মের মাধ্যমে লুপ |
| 23 | Get the value for the specified field from the request body | রিকোয়েস্ট বডি থেকে নির্দিষ্ট ফিল্ডের মান নেয় |
| 25-30 | If field is required and value is empty, push an error and skip remaining checks for this field | ফিল্ড প্রয়োজনীয় এবং মান খালি হলে, একটি এরর যোগ করে এবং এই ফিল্ডের বাকি চেক এড়িয়ে যায় |
| 32 | If value is undefined or null, skip validation for this field | মান undefined বা null হলে, এই ফিল্ডের জন্য ভ্যালিডেশন এড়িয়ে যায় |
| 34-42 | If type is "email", test against email regex; push error if invalid | টাইপ "email" হলে, ইমেইল রেজেক্স দিয়ে পরীক্ষা করে; অবৈধ হলে এরর যোগ করে |
| 44-57 | If type is "string", check minLength and maxLength constraints | টাইপ "string" হলে, minLength এবং maxLength সীমাবদ্ধতা পরীক্ষা করে |
| 59-81 | If type is "number", parse value to number and check min/max constraints | টাইপ "number" হলে, মানকে নম্বরে পার্স করে এবং min/max সীমাবদ্ধতা পরীক্ষা করে |
| 83-87 | If rule has an enum array, check if the value is in the allowed list | নিয়মে enum অ্যারে থাকলে, মান অনুমোদিত তালিকায় আছে কিনা পরীক্ষা করে |
| 90-92 | If any errors were collected, throw an AppError with the first error message | কোনো এরর সংগ্রহ করা থাকলে, প্রথম এরর বার্তা সহ AppError থ্রো করে |
| 94 | If no errors, call next() to proceed | কোনো এরর না থাকলে, এগিয়ে যেতে next() কল করে |

---

## 5. Routes Index / রুট ইনডেক্স

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

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import Router from Express | Express থেকে Router ইম্পোর্ট |
| 2-15 | Import all module route objects from their respective route files | সব মডিউলের রুট অবজেক্ট তাদের নিজ নিজ রুট ফাইল থেকে ইম্পোর্ট |
| 17 | Create a new Express Router instance | একটি নতুন Express Router ইনস্ট্যান্স তৈরি |
| 19-33 | Define an array of path-route mappings for every module | প্রতিটি মডিউলের জন্য পাথ-রুট ম্যাপিংয়ের একটি অ্যারে সংজ্ঞায়িত |
| 34 | Loop through the array and mount each route under its path | অ্যারে দিয়ে লুপ করে এবং প্রতিটি রুটকে তার পাথের অধীনে মাউন্ট করে |
| 36 | Export the main router to be used in app.ts | app.ts এ ব্যবহারের জন্য প্রধান রাউটার এক্সপোর্ট |

---

## 6. Auth Module / অথ মডিউল

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

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Define and export the LoginPayload interface with email and password | ইমেইল এবং পাসওয়ার্ড সহ LoginPayload ইন্টারফেস ডিফাইন ও এক্সপোর্ট |
| 2-3 | email and password fields (both required strings) | ইমেইল এবং পাসওয়ার্ড ফিল্ড (উভয়ই প্রয়োজনীয় স্ট্রিং) |
| 6 | Define and export the RegisterPayload interface | RegisterPayload ইন্টারফেস ডিফাইন ও এক্সপোর্ট |
| 7-9 | Required fields: name, email, password | প্রয়োজনীয় ফিল্ড: নাম, ইমেইল, পাসওয়ার্ড |
| 10 | Optional role field restricted to "CUSTOMER" or "TECHNICIAN" | অপশনাল রোল ফিল্ড যা "CUSTOMER" বা "TECHNICIAN" এর মধ্যে সীমাবদ্ধ |

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

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  if (user.isBanned) {
    throw new AppError(httpStatus.FORBIDDEN, "Your account has been banned");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret!,
    config.jwt_access_expiration || "1d",
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret!,
    config.jwt_refresh_expiration || "30d",
  );

  return { accessToken, refreshToken };
};

const registerUser = async (payload: RegisterPayload) => {
  const { name, email, password, role } = payload;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "CUSTOMER",
    },
    omit: { password: true },
  });

  return user;
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

export const authService = {
  loginUser,
  registerUser,
  getMe,
};
```

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import bcryptjs for password hashing and comparison | পাসওয়ার্ড হ্যাশিং এবং তুলনার জন্য bcryptjs ইম্পোর্ট |
| 2 | Import Prisma client for database queries | ডাটাবেস কোয়েরির জন্য Prisma ক্লায়েন্ট ইম্পোর্ট |
| 3 | Import the LoginPayload and RegisterPayload types | LoginPayload এবং RegisterPayload টাইপ ইম্পোর্ট |
| 4 | Import config for environment variables | এনভায়রনমেন্ট ভেরিয়েবলের জন্য কনফিগ ইম্পোর্ট |
| 5 | Import JWT utility functions for token creation | টোকেন তৈরির জন্য JWT ইউটিলিটি ফাংশন ইম্পোর্ট |
| 6 | Import custom AppError | কাস্টম AppError ইম্পোর্ট |
| 7 | Import http-status for HTTP status code constants | HTTP স্ট্যাটাস কোড কনস্ট্যান্টের জন্য http-status ইম্পোর্ট |
| 9 | Define loginUser async function that takes a LoginPayload | LoginPayload নেয় এমন loginUser async ফাংশন সংজ্ঞায়িত |
| 10 | Destructure email and password from the payload | পেলোড থেকে ইমেইল এবং পাসওয়ার্ড ডিস্ট্রাকচার |
| 12-14 | Find the user in the database by email | ইমেইল দ্বারা ডাটাবেসে ইউজার খুঁজে |
| 16-18 | Throw 401 error if user is not found | ইউজার না পাওয়া গেলে 401 এরর থ্রো করে |
| 20-22 | Throw 403 error if the user account is banned | ইউজার অ্যাকাউন্ট ব্যান করা থাকলে 403 এরর থ্রো করে |
| 24 | Compare the provided password with the stored hash using bcrypt | bcrypt ব্যবহার করে প্রদত্ত পাসওয়ার্ড সংরক্ষিত হ্যাশের সাথে তুলনা করে |
| 25-27 | Throw 401 error if passwords don't match | পাসওয়ার্ড মিল না হলে 401 এরর থ্রো করে |
| 29-34 | Prepare the JWT payload with user id, name, email, and role | ইউজার আইডি, নাম, ইমেইল এবং রোল সহ JWT পেলোড প্রস্তুত করে |
| 36-40 | Create an access token using the JWT utility | JWT ইউটিলিটি ব্যবহার করে একটি অ্যাক্সেস টোকেন তৈরি |
| 42-46 | Create a refresh token using the JWT utility | JWT ইউটিলিটি ব্যবহার করে একটি রিফ্রেশ টোকেন তৈরি |
| 48 | Return both tokens as an object | উভয় টোকেন অবজেক্ট হিসেবে রিটার্ন করে |
| 51 | Define registerUser async function that takes a RegisterPayload | RegisterPayload নেয় এমন registerUser async ফাংশন সংজ্ঞায়িত |
| 52 | Destructure name, email, password, and role from the payload | পেলোড থেকে নাম, ইমেইল, পাসওয়ার্ড এবং রোল ডিস্ট্রাকচার |
| 54 | Check if a user with this email already exists | এই ইমেইল দিয়ে ইউজার আগে থেকে আছে কিনা চেক |
| 55-57 | Throw 409 Conflict error if email is taken | ইমেইল নেওয়া থাকলে 409 Conflict এরর থ্রো করে |
| 59-62 | Hash the password using bcrypt with configured salt rounds | কনফিগার করা সল্ট রাউন্ড দিয়ে bcrypt ব্যবহার করে পাসওয়ার্ড হ্যাশ |
| 64-71 | Create the user in the database and omit password from the returned object | ডাটাবেসে ইউজার তৈরি এবং ফেরত অবজেক্ট থেকে পাসওয়ার্ড বাদ দেয় |
| 74 | Return the created user | তৈরি ইউজার রিটার্ন |
| 77 | Define getMe async function that takes a userId | userId নেয় এমন getMe async ফাংশন সংজ্ঞায়িত |
| 78-81 | Find the user by ID, omitting the password | আইডি দ্বারা ইউজার খুঁজে, পাসওয়ার্ড বাদ দিয়ে |
| 82-84 | Throw 404 error if user is not found | ইউজার না পাওয়া গেলে 404 এরর থ্রো করে |
| 85 | Return the user data | ইউজার ডাটা রিটার্ন |
| 88-92 | Export an object with all auth service functions | সব অথ সার্ভিস ফাংশন সহ একটি অবজেক্ট এক্সপোর্ট |

---

### `src/modules/auth/auth.controller.ts`

```ts
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await authService.loginUser(
    req.body,
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: { accessToken, refreshToken },
  });
});

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: { user },
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User fetched successfully",
    data: user,
  });
});

export const authController = {
  loginUser,
  registerUser,
  getMe,
};
```

END OF PART 2

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import Express Request and Response types | Express Request এবং Response টাইপ ইম্পোর্ট |
| 2 | Import catchAsync wrapper | catchAsync র্যাপার ইম্পোর্ট |
| 3 | Import authService for business logic | বিজনেস লজিকের জন্য authService ইম্পোর্ট |
| 4 | Import sendResponse utility | sendResponse ইউটিলিটি ইম্পোর্ট |
| 5 | Import http-status | http-status ইম্পোর্ট |
| 7 | Define loginUser controller wrapped with catchAsync | catchAsync দিয়ে র্যাপ করা loginUser কন্ট্রোলার সংজ্ঞায়িত |
| 8-10 | Call authService.loginUser with request body and destructure tokens | req.body দিয়ে authService.loginUser কল করে এবং টোকেন ডিস্ট্রাকচার |
| 12-17 | Set accessToken as an HTTP-only cookie (1 day expiry) | accessToken কে HTTP-only কুকি হিসেবে সেট করে (1 দিন মেয়াদ) |
| 18-23 | Set refreshToken as an HTTP-only cookie (7 day expiry) | refreshToken কে HTTP-only কুকি হিসেবে সেট করে (7 দিন মেয়াদ) |
| 25-30 | Send success response with the tokens | টোকেন সহ সাফল্যের রেসপন্স পাঠায় |
| 33 | Define registerUser controller | registerUser কন্ট্রোলার সংজ্ঞায়িত |
| 34 | Call authService.registerUser with request body | req.body দিয়ে authService.registerUser কল করে |
| 36-41 | Send 201 Created response with the new user data | নতুন ইউজার ডাটা সহ 201 Created রেসপন্স পাঠায় |
| 44 | Define getMe controller (requires auth middleware) | getMe কন্ট্রোলার সংজ্ঞায়িত (auth মিডলওয়্যার প্রয়োজন) |
| 45 | Call authService.getMe with the authenticated user's ID | অথেনটিকেটেড ইউজারের আইডি দিয়ে authService.getMe কল করে |
| 47-52 | Send success response with user data | ইউজার ডাটা সহ সাফল্যের রেসপন্স পাঠায় |
| 55-59 | Export an object with all auth controller functions | সব অথ কন্ট্রোলার ফাংশন সহ একটি অবজেক্ট এক্সপোর্ট |

---

### `src/modules/auth/auth.route.ts`

```ts
import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import type { ValidationRule } from "../../middlewares/validateRequest";

const router = Router();

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

export const authRoutes = router;
```

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import Router from Express | Express থেকে Router ইম্পোর্ট |
| 2 | Import auth controller functions | অথ কন্ট্রোলার ফাংশন ইম্পোর্ট |
| 3 | Import auth middleware for protected routes | সুরক্ষিত রুটের জন্য auth মিডলওয়্যার ইম্পোর্ট |
| 4 | Import Role enum from generated Prisma | জেনারেটেড Prisma থেকে Role এনাম ইম্পোর্ট |
| 5 | Import validateRequest middleware | validateRequest মিডলওয়্যার ইম্পোর্ট |
| 6 | Import ValidationRule type for type safety | টাইপ সেফটির জন্য ValidationRule টাইপ ইম্পোর্ট |
| 8 | Create a new Router instance | নতুন Router ইনস্ট্যান্স তৈরি |
| 10-15 | Define validation rules for registration (name, email, password, optional role) | রেজিস্ট্রেশনের জন্য ভ্যালিডেশন নিয়ম সংজ্ঞায়িত (নাম, ইমেইল, পাসওয়ার্ড, অপশনাল রোল) |
| 17-20 | Define validation rules for login (email, password) | লগইনের জন্য ভ্যালিডেশন নিয়ম সংজ্ঞায়িত (ইমেইল, পাসওয়ার্ড) |
| 22 | POST /register route with validation middleware | ভ্যালিডেশন মিডলওয়্যার সহ POST /register রুট |
| 23 | POST /login route with validation middleware | ভ্যালিডেশন মিডলওয়্যার সহ POST /login রুট |
| 24 | GET /me route with auth middleware (all 3 roles allowed) | auth মিডলওয়্যার সহ GET /me রুট (সব ৩টি রোল অনুমোদিত) |
| 26 | Export the router as authRoutes | রাউটারটিকে authRoutes হিসেবে এক্সপোর্ট |

---

## 7. User Module / ইউজার মডিউল

### `src/modules/user/user.interface.ts`

```ts
export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}
```

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Define and export RegisterUserPayload interface | RegisterUserPayload ইন্টারফেস ডিফাইন ও এক্সপোর্ট |
| 2-4 | Required fields: name, email, password | প্রয়োজনীয় ফিল্ড: নাম, ইমেইল, পাসওয়ার্ড |
| 5 | Optional role field (string) | অপশনাল রোল ফিল্ড (স্ট্রিং) |

---

### `src/modules/user/user.service.ts`

```ts
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, role } = payload;

  if (!name || !email || !password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Name, email, and password are required");
  }

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "CUSTOMER",
    },
  });

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: createdUser.id },
    omit: {
      password: true,
    },
  });

  return user;
};

const getMyProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: {
      password: true,
    },
  });
  return user;
};

const updateMyProfileInDB = async (userId: string, payload: any) => {
  const { name, email } = payload;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
    },
    omit: {
      password: true,
    },
  });

  return updatedUser;
};

export const userService = {
  registerUserIntoDB,
  getMyProfileFromDB,
  updateMyProfileInDB,
};
```

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import bcryptjs for password hashing | পাসওয়ার্ড হ্যাশিংয়ের জন্য bcryptjs ইম্পোর্ট |
| 2 | Import Prisma client | Prisma ক্লায়েন্ট ইম্পোর্ট |
| 3 | Import config for environment variables | এনভায়রনমেন্ট ভেরিয়েবলের জন্য কনফিগ ইম্পোর্ট |
| 4 | Import RegisterUserPayload interface | RegisterUserPayload ইন্টারফেস ইম্পোর্ট |
| 5 | Import AppError | AppError ইম্পোর্ট |
| 6 | Import http-status | http-status ইম্পোর্ট |
| 8 | Define registerUserIntoDB function | registerUserIntoDB ফাংশন সংজ্ঞায়িত |
| 9 | Destructure name, email, password, role from payload | পেলোড থেকে নাম, ইমেইল, পাসওয়ার্ড, রোল ডিস্ট্রাকচার |
| 11-13 | Validate that required fields are provided | প্রয়োজনীয় ফিল্ড দেওয়া আছে কিনা যাচাই |
| 15-17 | Check if user already exists by email | ইমেইল দিয়ে ইউজার আগে আছে কিনা চেক |
| 19-21 | Throw 409 Conflict if user exists | ইউজার থাকলে 409 Conflict থ্রো |
| 23-26 | Hash the password | পাসওয়ার্ড হ্যাশ |
| 28-34 | Create user in database | ডাটাবেসে ইউজার তৈরি |
| 37-42 | Fetch the created user by ID omitting password | পাসওয়ার্ড বাদ দিয়ে আইডি দিয়ে তৈরি ইউজার আনয়ন |
| 44 | Return the user (without password) | ইউজার রিটার্ন (পাসওয়ার্ড ছাড়া) |
| 47 | Define getMyProfileFromDB function | getMyProfileFromDB ফাংশন সংজ্ঞায়িত |
| 48-53 | Find user by ID or throw error, omitting password | আইডি দিয়ে ইউজার খুঁজে বা এরর থ্রো, পাসওয়ার্ড বাদ দিয়ে |
| 55 | Return the user profile | ইউজার প্রোফাইল রিটার্ন |
| 58 | Define updateMyProfileInDB function | updateMyProfileInDB ফাংশন সংজ্ঞায়িত |
| 59 | Destructure name and email from payload | পেলোড থেকে নাম এবং ইমেইল ডিস্ট্রাকচার |
| 61-69 | Update the user in database by ID, omitting password | আইডি দিয়ে ডাটাবেসে ইউজার আপডেট, পাসওয়ার্ড বাদ দিয়ে |
| 71 | Return the updated user | আপডেটেড ইউজার রিটার্ন |
| 74-78 | Export userService object with all functions | সব ফাংশন সহ userService অবজেক্ট এক্সপোর্ট |

---

### `src/modules/user/user.controller.ts`

```ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const user = await userService.registerUserIntoDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: {
      user,
    },
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const profile = await userService.getMyProfileFromDB(req.user!.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My profile retrieved successfully",
    data: {
      profile,
    },
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const payload = req.body;
  const updatedUser = await userService.updateMyProfileInDB(userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile updated successfully",
    data: {
      user: updatedUser,
    },
  });
});

export const userController = {
  registerUser,
  getMyProfile,
  updateMyProfile,
};
```

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import Express types | Express টাইপ ইম্পোর্ট |
| 2 | Import http-status | http-status ইম্পোর্ট |
| 3 | Import userService | userService ইম্পোর্ট |
| 4 | Import catchAsync wrapper | catchAsync র্যাপার ইম্পোর্ট |
| 5 | Import sendResponse utility | sendResponse ইউটিলিটি ইম্পোর্ট |
| 7 | Define registerUser controller | registerUser কন্ট্রোলার সংজ্ঞায়িত |
| 8-10 | Get payload from body and call service | বডি থেকে পেলোড নিয়ে সার্ভিস কল |
| 12-19 | Send 201 response with user data | ইউজার ডাটা সহ 201 রেসপন্স পাঠায় |
| 22 | Define getMyProfile controller | getMyProfile কন্ট্রোলার সংজ্ঞায়িত |
| 23 | Call service with authenticated user's ID | অথেনটিকেটেড ইউজারের আইডি দিয়ে সার্ভিস কল |
| 25-32 | Send 200 response with profile | প্রোফাইল সহ 200 রেসপন্স পাঠায় |
| 35 | Define updateMyProfile controller | updateMyProfile কন্ট্রোলার সংজ্ঞায়িত |
| 36-38 | Get user ID from auth and payload from body, call service | অথ থেকে ইউজার আইডি এবং বডি থেকে পেলোড নিয়ে সার্ভিস কল |
| 40-47 | Send 200 response with updated user | আপডেটেড ইউজার সহ 200 রেসপন্স পাঠায় |
| 50-54 | Export userController object | userController অবজেক্ট এক্সপোর্ট |

---

### `src/modules/user/user.route.ts`

```ts
import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", userController.registerUser);

router.get(
  "/me",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  userController.getMyProfile,
);

router.put(
  "/my-profile",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  userController.updateMyProfile,
);

export const userRouter = router;
```

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import Router | Router ইম্পোর্ট |
| 2 | Import user controller | ইউজার কন্ট্রোলার ইম্পোর্ট |
| 3 | Import auth middleware | auth মিডলওয়্যার ইম্পোর্ট |
| 4 | Import Role enum | Role এনাম ইম্পোর্ট |
| 6 | Create Router instance | Router ইনস্ট্যান্স তৈরি |
| 8 | POST /register route (no auth required) | POST /register রুট (কোনো অথ প্রয়োজন নেই) |
| 10-14 | GET /me route with auth middleware (all roles) | auth মিডলওয়্যার সহ GET /me রুট (সব রোল) |
| 16-20 | PUT /my-profile route with auth middleware (all roles) | auth মিডলওয়্যার সহ PUT /my-profile রুট (সব রোল) |
| 22 | Export router as userRouter | রাউটারকে userRouter হিসেবে এক্সপোর্ট |

---

## 8. Category Module / ক্যাটাগরি মডিউল

### `src/modules/category/category.validation.ts`

```ts
import type { ValidationRule } from "../../middlewares/validateRequest";

export const createCategoryRules: ValidationRule[] = [
  {
    field: "name",
    required: true,
    type: "string",
    minLength: 1,
    message: "Category name is required",
  },
  {
    field: "description",
    type: "string",
  },
];
```

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import ValidationRule type from validateRequest middleware | validateRequest মিডলওয়্যার থেকে ValidationRule টাইপ ইম্পোর্ট |
| 3 | Define and export createCategoryRules array | createCategoryRules অ্যারে ডিফাইন ও এক্সপোর্ট |
| 4-10 | Validation rule for name field: required, string, min 1 char | নাম ফিল্ডের জন্য ভ্যালিডেশন নিয়ম: প্রয়োজনীয়, স্ট্রিং, সর্বনিম্ন ১ অক্ষর |
| 11-15 | Validation rule for description: optional string field | বিবরণের জন্য ভ্যালিডেশন নিয়ম: অপশনাল স্ট্রিং ফিল্ড |

---

### `src/modules/category/category.service.ts`

```ts
import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const getAllCategories = async () => {
  return prisma.category.findMany({
    include: { services: true },
    orderBy: { name: "asc" },
  });
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { services: true },
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  return category;
};

const createCategory = async (data: { name: string; description?: string }) => {
  const existing = await prisma.category.findUnique({
    where: { name: data.name },
  });
  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "Category already exists");
  }
  return prisma.category.create({ data });
};

const updateCategory = async (id: string, data: { name?: string; description?: string }) => {
  await getCategoryById(id);
  return prisma.category.update({ where: { id }, data });
};

const deleteCategory = async (id: string) => {
  await getCategoryById(id);
  return prisma.category.delete({ where: { id } });
};

export const categoryService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
```

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import Prisma client | Prisma ক্লায়েন্ট ইম্পোর্ট |
| 2 | Import AppError | AppError ইম্পোর্ট |
| 3 | Import http-status | http-status ইম্পোর্ট |
| 5 | Define getAllCategories function | getAllCategories ফাংশন সংজ্ঞায়িত |
| 6-9 | Find all categories with their services, ordered by name ascending | তাদের সার্ভিস সহ সব ক্যাটাগরি খুঁজে, নামের ক্রমে সাজানো |
| 12 | Define getCategoryById function that takes an ID | আইডি নেয় এমন getCategoryById ফাংশন সংজ্ঞায়িত |
| 13-16 | Find a unique category by ID with its services | আইডি দিয়ে তার সার্ভিস সহ একটি ক্যাটাগরি খুঁজে |
| 17-19 | Throw 404 if category not found | ক্যাটাগরি না পাওয়া গেলে 404 থ্রো |
| 20 | Return the category | ক্যাটাগরি রিটার্ন |
| 23 | Define createCategory function | createCategory ফাংশন সংজ্ঞায়িত |
| 24-26 | Check if category with same name already exists | একই নামের ক্যাটাগরি আগে আছে কিনা চেক |
| 27-29 | Throw 409 Conflict if exists | থাকলে 409 Conflict থ্রো |
| 30 | Create and return the new category | নতুন ক্যাটাগরি তৈরি ও রিটার্ন |
| 33 | Define updateCategory function | updateCategory ফাংশন সংজ্ঞায়িত |
| 34 | Call getCategoryById to verify existence | অস্তিত্ব যাচাই করতে getCategoryById কল |
| 35 | Update and return the category | ক্যাটাগরি আপডেট ও রিটার্ন |
| 38 | Define deleteCategory function | deleteCategory ফাংশন সংজ্ঞায়িত |
| 39 | Call getCategoryById to verify existence | অস্তিত্ব যাচাই করতে getCategoryById কল |
| 40 | Delete and return the category | ক্যাটাগরি ডিলিট ও রিটার্ন |
| 43-49 | Export categoryService object | categoryService অবজেক্ট এক্সপোর্ট |

---

### `src/modules/category/category.controller.ts`

```ts
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryService } from "./category.service";
import httpStatus from "http-status";

const getAll = catchAsync(async (_req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories fetched successfully",
    data: categories,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.getCategoryById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category fetched successfully",
    data: category,
  });
});

const create = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Category created successfully",
    data: category,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category updated successfully",
    data: category,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category deleted successfully",
    data: null,
  });
});

export const categoryController = {
  getAll,
  getById,
  create,
  update,
  remove,
};
```

| Line | English | বাংলা |
|------|---------|-------|
| 1-5 | Import required dependencies | প্রয়োজনীয় ডিপেন্ডেন্সি ইম্পোর্ট |
| 7 | Define getAll controller (uses _req since params not needed) | getAll কন্ট্রোলার সংজ্ঞায়িত (_req ব্যবহার কারণ প্যারামিটার দরকার নেই) |
| 8 | Call service to get all categories | সব ক্যাটাগরি পেতে সার্ভিস কল |
| 9-14 | Send 200 response with categories | ক্যাটাগরি সহ 200 রেসপন্স পাঠায় |
| 17 | Define getById controller | getById কন্ট্রোলার সংজ্ঞায়িত |
| 18 | Call service with ID from URL params | URL প্যারাম থেকে আইডি দিয়ে সার্ভিস কল |
| 19-24 | Send 200 response with single category | একক ক্যাটাগরি সহ 200 রেসপন্স পাঠায় |
| 27 | Define create controller | create কন্ট্রোলার সংজ্ঞায়িত |
| 28 | Call service with request body | রিকোয়েস্ট বডি দিয়ে সার্ভিস কল |
| 29-34 | Send 201 response with new category | নতুন ক্যাটাগরি সহ 201 রেসপন্স পাঠায় |
| 37 | Define update controller | update কন্ট্রোলার সংজ্ঞায়িত |
| 38 | Call service with ID from params and data from body | প্যারাম থেকে আইডি এবং বডি থেকে ডাটা দিয়ে সার্ভিস কল |
| 39-44 | Send 200 response with updated category | আপডেটেড ক্যাটাগরি সহ 200 রেসপন্স পাঠায় |
| 47 | Define remove controller | remove কন্ট্রোলার সংজ্ঞায়িত |
| 48 | Call delete service with ID from params | প্যারাম থেকে আইডি দিয়ে ডিলিট সার্ভিস কল |
| 49-54 | Send 200 response with null data (nothing to return after delete) | null ডাটা সহ 200 রেসপন্স পাঠায় (ডিলিটের পর কিছু নেই) |
| 57-63 | Export categoryController object | categoryController অবজেক্ট এক্সপোর্ট |

---

### `src/modules/category/category.route.ts`

```ts
import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCategoryRules } from "./category.validation";

const router = Router();

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);
router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(createCategoryRules),
  categoryController.create,
);
router.put(
  "/:id",
  auth(Role.ADMIN),
  categoryController.update,
);
router.delete(
  "/:id",
  auth(Role.ADMIN),
  categoryController.remove,
);

export const categoryRoutes = router;
```

| Line | English | বাংলা |
|------|---------|-------|
| 1-6 | Import required dependencies | প্রয়োজনীয় ডিপেন্ডেন্সি ইম্পোর্ট |
| 8 | Create Router instance | Router ইনস্ট্যান্স তৈরি |
| 10 | GET / - public, list all categories | GET / - পাবলিক, সব ক্যাটাগরি তালিকা |
| 11 | GET /:id - public, get single category by ID | GET /:id - পাবলিক, আইডি দিয়ে একক ক্যাটাগরি |
| 12-17 | POST / - admin only, with validation | POST / - শুধু অ্যাডমিন, ভ্যালিডেশন সহ |
| 18-22 | PUT /:id - admin only, update category | PUT /:id - শুধু অ্যাডমিন, ক্যাটাগরি আপডেট |
| 23-27 | DELETE /:id - admin only, delete category | DELETE /:id - শুধু অ্যাডমিন, ক্যাটাগরি ডিলিট |
| 29 | Export router as categoryRoutes | রাউটারকে categoryRoutes হিসেবে এক্সপোর্ট |

---

## 9. Service Module / সার্ভিস মডিউল

### `src/modules/service/service.validation.ts`

```ts
import type { ValidationRule } from "../../middlewares/validateRequest";

export const createServiceRules: ValidationRule[] = [
  {
    field: "title",
    required: true,
    type: "string",
    minLength: 1,
    message: "Service title is required",
  },
  {
    field: "price",
    required: true,
    type: "number",
    min: 0,
    message: "Price must be a positive number",
  },
  {
    field: "categoryId",
    required: true,
    type: "string",
    message: "Category ID is required",
  },
];
```

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import ValidationRule type | ValidationRule টাইপ ইম্পোর্ট |
| 3 | Define and export createServiceRules array | createServiceRules অ্যারে ডিফাইন ও এক্সপোর্ট |
| 4-10 | Title must be a non-empty required string | টাইটেল একটি অ-খালি প্রয়োজনীয় স্ট্রিং হতে হবে |
| 11-17 | Price must be a required number, minimum 0 | মূল্য একটি প্রয়োজনীয় সংখ্যা হতে হবে, সর্বনিম্ন 0 |
| 18-24 | Category ID must be a required string | ক্যাটাগরি আইডি একটি প্রয়োজনীয় স্ট্রিং হতে হবে |

---

### `src/modules/service/service.service.ts`

```ts
import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const getAllServices = async (filters: {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}) => {
  const where: any = {};

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

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
    include: {
      category: true,
      technician: {
        omit: { password: true },
      },
    },
    orderBy: { id: "desc" },
  });
};

const getServiceById = async (id: string) => {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      category: true,
      technician: {
        omit: { password: true },
      },
    },
  });
  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }
  return service;
};

const createService = async (data: {
  title: string;
  description?: string;
  price: number;
  categoryId: string;
  technicianId: string;
}) => {
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  return prisma.service.create({
    data,
    include: {
      category: true,
      technician: {
        omit: { password: true },
      },
    },
  });
};

const updateService = async (
  id: string,
  technicianId: string,
  data: { title?: string; description?: string; price?: number },
) => {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }
  if (service.technicianId !== technicianId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only update your own services",
    );
  }

  return prisma.service.update({
    where: { id },
    data,
    include: {
      category: true,
      technician: {
        omit: { password: true },
      },
    },
  });
};

const deleteService = async (id: string, technicianId: string) => {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }
  if (service.technicianId !== technicianId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only delete your own services",
    );
  }

  return prisma.service.delete({ where: { id } });
};

export const serviceService = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
```

END OF PART 3

| Line | English | বাংলা |
|------|---------|-------|
| 1-3 | Import dependencies | ডিপেন্ডেন্সি ইম্পোর্ট |
| 5 | Define getAllServices with optional filter parameters | অপশনাল ফিল্টার প্যারামিটার সহ getAllServices সংজ্ঞায়িত |
| 6-10 | Filter type: categoryId, minPrice, maxPrice, search | ফিল্টার টাইপ: ক্যাটাগরি আইডি, ন্যূনতম মূল্য, সর্বোচ্চ মূল্য, সার্চ |
| 11 | Create an empty where object (Prisma query filter) | একটি খালি where অবজেক্ট তৈরি (Prisma কোয়েরি ফিল্টার) |
| 13-15 | If categoryId filter is provided, add it to where | categoryId ফিল্টার দিলে, where তে যোগ করে |
| 17-21 | If price range filters are provided, build price query with gte/lte | মূল্য পরিসীমা ফিল্টার দিলে, gte/lte সহ মূল্য কোয়েরি তৈরি |
| 23-28 | If search term is provided, create OR condition for title and description (case-insensitive) | সার্চ টার্ম দিলে, টাইটেল এবং বিবরণের জন্য OR কন্ডিশন তৈরি (কেস-ইনসেনসিটিভ) |
| 30-39 | Query services with the built where filter, include category and technician, order by newest first | তৈরি where ফিল্টার সহ সার্ভিস কোয়েরি, ক্যাটাগরি ও টেকনিশিয়ান অন্তর্ভুক্ত, নতুন আগে সাজানো |
| 42 | Define getServiceById | getServiceById সংজ্ঞায়িত |
| 43-51 | Find unique service by ID with category and technician | আইডি দিয়ে ক্যাটাগরি ও টেকনিশিয়ান সহ ইউনিক সার্ভিস খুঁজে |
| 52-54 | Throw 404 if service not found | সার্ভিস না পাওয়া গেলে 404 থ্রো |
| 55 | Return the service | সার্ভিস রিটার্ন |
| 58 | Define createService with data parameter | ডাটা প্যারামিটার সহ createService সংজ্ঞায়িত |
| 59-63 | Data structure: title, description, price, categoryId, technicianId | ডাটা কাঠামো: টাইটেল, বিবরণ, মূল্য, ক্যাটাগরি আইডি, টেকনিশিয়ান আইডি |
| 65-67 | Verify that the referenced category exists | রেফারেন্স করা ক্যাটাগরি আছে কিনা যাচাই |
| 68-70 | Throw 404 if category not found | ক্যাটাগরি না পেলে 404 থ্রো |
| 72-80 | Create the service with all data and return with relations | সব ডাটা সহ সার্ভিস তৈরি এবং সম্পর্কসহ রিটার্ন |
| 83 | Define updateService with id, technicianId, and data | id, technicianId এবং data সহ updateService সংজ্ঞায়িত |
| 88 | Find the existing service | বিদ্যমান সার্ভিস খুঁজে |
| 89-91 | Throw 404 if not found | না পেলে 404 থ্রো |
| 92-97 | Ensure only the owner technician can update the service | শুধুমাত্র মালিক টেকনিশিয়ান সার্ভিস আপডেট করতে পারে তা নিশ্চিত করে |
| 99-108 | Update the service and return with relations | সার্ভিস আপডেট এবং সম্পর্কসহ রিটার্ন |
| 111 | Define deleteService with id and technicianId | id এবং technicianId সহ deleteService সংজ্ঞায়িত |
| 112 | Find the existing service | বিদ্যমান সার্ভিস খুঁজে |
| 113-115 | Throw 404 if not found | না পেলে 404 থ্রো |
| 116-121 | Ensure only the owner technician can delete | শুধুমাত্র মালিক টেকনিশিয়ান ডিলিট করতে পারে তা নিশ্চিত |
| 123 | Delete the service by ID | আইডি দিয়ে সার্ভিস ডিলিট |
| 126-132 | Export serviceService object | serviceService অবজেক্ট এক্সপোর্ট |

---

### `src/modules/service/service.controller.ts`

```ts
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { serviceService } from "./service.service";
import httpStatus from "http-status";

const getAll = catchAsync(async (req: Request, res: Response) => {
  const { categoryId, minPrice, maxPrice, search } = req.query;
  const services = await serviceService.getAllServices({
    categoryId: categoryId as string | undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    search: search as string | undefined,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Services fetched successfully",
    data: services,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const service = await serviceService.getServiceById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service fetched successfully",
    data: service,
  });
});

const create = catchAsync(async (req: Request, res: Response) => {
  const service = await serviceService.createService({
    ...req.body,
    technicianId: req.user!.id,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Service created successfully",
    data: service,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const service = await serviceService.updateService(
    req.params.id,
    req.user!.id,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service updated successfully",
    data: service,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  await serviceService.deleteService(req.params.id, req.user!.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service deleted successfully",
    data: null,
  });
});

export const serviceController = {
  getAll,
  getById,
  create,
  update,
  remove,
};
```

| Line | English | বাংলা |
|------|---------|-------|
| 1-5 | Import dependencies | ডিপেন্ডেন্সি ইম্পোর্ট |
| 7 | Define getAll controller | getAll কন্ট্রোলার সংজ্ঞায়িত |
| 8 | Extract query parameters from URL | URL থেকে কোয়েরি প্যারামিটার বের করে |
| 9-14 | Call service with parsed filter values; convert price strings to numbers | পার্সড ফিল্টার ভ্যালু দিয়ে সার্ভিস কল; মূল্য স্ট্রিংকে নম্বরে রূপান্তর |
| 15-20 | Send 200 response with services | সার্ভিস সহ 200 রেসপন্স পাঠায় |
| 23 | Define getById controller | getById কন্ট্রোলার সংজ্ঞায়িত |
| 27 | Define create controller | create কন্ট্রোলার সংজ্ঞায়িত |
| 28-31 | Spread request body and add technicianId from authenticated user | রিকোয়েস্ট বডি স্প্রেড করে এবং অথেনটিকেটেড ইউজার থেকে technicianId যোগ করে |
| 37 | Define update controller | update কন্ট্রোলার সংজ্ঞায়িত |
| 38-41 | Pass params.id, user.id, and body to service | params.id, user.id এবং body সার্ভিসে পাঠায় |
| 47 | Define remove controller | remove কন্ট্রোলার সংজ্ঞায়িত |
| 48 | Call delete service with id and authenticated user id | id এবং অথেনটিকেটেড ইউজার আইডি দিয়ে ডিলিট সার্ভিস কল |
| 55-60 | Export serviceController object | serviceController অবজেক্ট এক্সপোর্ট |

---

### `src/modules/service/service.route.ts`

```ts
import { Router } from "express";
import { serviceController } from "./service.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { createServiceRules } from "./service.validation";

const router = Router();

router.get("/", serviceController.getAll);
router.get("/:id", serviceController.getById);
router.post(
  "/",
  auth(Role.TECHNICIAN, Role.ADMIN),
  validateRequest(createServiceRules),
  serviceController.create,
);
router.put(
  "/:id",
  auth(Role.TECHNICIAN, Role.ADMIN),
  serviceController.update,
);
router.delete(
  "/:id",
  auth(Role.TECHNICIAN, Role.ADMIN),
  serviceController.remove,
);

export const serviceRoutes = router;
```

| Line | English | বাংলা |
|------|---------|-------|
| 1-6 | Import dependencies | ডিপেন্ডেন্সি ইম্পোর্ট |
| 8 | Create Router instance | Router ইনস্ট্যান্স তৈরি |
| 10-11 | GET routes - public, no auth needed | GET রুট - পাবলিক, অথ লাগে না |
| 12-17 | POST - requires TECHNICIAN or ADMIN role with validation | POST - TECHNICIAN বা ADMIN রোল প্রয়োজন, ভ্যালিডেশন সহ |
| 18-22 | PUT - requires TECHNICIAN or ADMIN role | PUT - TECHNICIAN বা ADMIN রোল প্রয়োজন |
| 23-27 | DELETE - requires TECHNICIAN or ADMIN role | DELETE - TECHNICIAN বা ADMIN রোল প্রয়োজন |
| 29 | Export router as serviceRoutes | রাউটারকে serviceRoutes হিসেবে এক্সপোর্ট |

---

## 10. Technician Module / টেকনিশিয়ান মডিউল

### `src/modules/technician/technician.validation.ts`

```ts
import type { ValidationRule } from "../../middlewares/validateRequest";

export const updateProfileRules: ValidationRule[] = [
  {
    field: "bio",
    type: "string",
  },
  {
    field: "experienceYears",
    type: "number",
    min: 0,
  },
];

export const availabilityRules: ValidationRule[] = [
  {
    field: "availability",
    required: true,
    type: "array",
    message: "Availability is required",
  },
];
```

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import ValidationRule type | ValidationRule টাইপ ইম্পোর্ট |
| 3 | Define updateProfileRules: bio (optional string), experienceYears (optional number, min 0) | updateProfileRules: bio (অপশনাল স্ট্রিং), experienceYears (অপশনাল সংখ্যা, ন্যূনতম 0) |
| 15 | Define availabilityRules: availability field, required, must be array | availabilityRules: availability ফিল্ড, প্রয়োজনীয়, অ্যারে হতে হবে |

---

### `src/modules/technician/technician.service.ts`

```ts
import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const getAllTechnicians = async () => {
  return prisma.user.findMany({
    where: { role: "TECHNICIAN", isBanned: false },
    omit: { password: true },
    include: {
      technicianProfile: true,
      services: true,
    },
  });
};

const getTechnicianById = async (id: string) => {
  const technician = await prisma.user.findFirst({
    where: { id, role: "TECHNICIAN" },
    omit: { password: true },
    include: {
      technicianProfile: true,
      services: {
        include: { category: true },
      },
      reviewsAsTechnician: {
        include: {
          customer: {
            omit: { password: true },
          },
        },
      },
    },
  });

  if (!technician) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician not found");
  }

  return technician;
};

const updateProfile = async (
  userId: string,
  data: { bio?: string; experienceYears?: number },
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { technicianProfile: true },
  });

  if (!user || user.role !== "TECHNICIAN") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only technicians can update their profile",
    );
  }

  const profile = await prisma.technicianProfile.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
    include: { user: { omit: { password: true } } },
  });

  return profile;
};

const updateAvailability = async (userId: string, availability: any) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.role !== "TECHNICIAN") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only technicians can set availability",
    );
  }

  const profile = await prisma.technicianProfile.upsert({
    where: { userId },
    update: { availability },
    create: { userId, availability },
    include: { user: { omit: { password: true } } },
  });

  return profile;
};

const getMyBookings = async (technicianId: string) => {
  return prisma.booking.findMany({
    where: { technicianId },
    include: {
      service: true,
      customer: {
        omit: { password: true },
      },
      payment: true,
      review: true,
    },
    orderBy: { id: "desc" },
  });
};

const updateBookingStatus = async (
  bookingId: string,
  technicianId: string,
  status: string,
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.technicianId !== technicianId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "This booking does not belong to you",
    );
  }

  const validTransitions: Record<string, string[]> = {
    REQUESTED: ["ACCEPTED", "DECLINED", "CANCELLED"],
    ACCEPTED: ["PAID", "CANCELLED"],
    PAID: ["IN_PROGRESS", "CANCELLED"],
    IN_PROGRESS: ["COMPLETED"],
    COMPLETED: [],
    DECLINED: [],
    CANCELLED: [],
  };

  const allowed = validTransitions[booking.status] || [];

  if (!allowed.includes(status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot transition from ${booking.status} to ${status}`,
    );
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: status as any },
    include: {
      service: true,
      customer: { omit: { password: true } },
      payment: true,
    },
  });
};

export const technicianService = {
  getAllTechnicians,
  getTechnicianById,
  updateProfile,
  updateAvailability,
  getMyBookings,
  updateBookingStatus,
};
```

END OF PART 4

| Line | English | বাংলা |
|------|---------|-------|
| 1-3 | Import dependencies | ডিপেন্ডেন্সি ইম্পোর্ট |
| 5 | Define getAllTechnicians | getAllTechnicians সংজ্ঞায়িত |
| 6-13 | Find all users where role is TECHNICIAN and not banned, include profile and services | রোল TECHNICIAN এবং ব্যান না এমন সব ইউজার খুঁজে, প্রোফাইল ও সার্ভিস সহ |
| 16 | Define getTechnicianById | getTechnicianById সংজ্ঞায়িত |
| 17-33 | Find a technician by ID with full details: profile, services with category, reviews with customer | আইডি দিয়ে সম্পূর্ণ বিবরণ সহ টেকনিশিয়ান খুঁজে: প্রোফাইল, ক্যাটাগরি সহ সার্ভিস, গ্রাহক সহ রিভিউ |
| 35-37 | Throw 404 if not found | না পেলে 404 থ্রো |
| 39 | Return the technician | টেকনিশিয়ান রিটার্ন |
| 42 | Define updateProfile with userId and data | userId এবং data সহ updateProfile সংজ্ঞায়িত |
| 43-49 | Check user exists and has role TECHNICIAN | ইউজার আছে এবং রোল TECHNICIAN কিনা চেক |
| 51-56 | Throw 403 if not a technician | টেকনিশিয়ান না হলে 403 থ্রো |
| 58-63 | Upsert the technician profile (create if not exists, update if exists) | টেকনিশিয়ান প্রোফাইল আপসার্ট (না থাকলে তৈরি, থাকলে আপডেট) |
| 65 | Return the profile | প্রোফাইল রিটার্ন |
| 68 | Define updateAvailability | updateAvailability সংজ্ঞায়িত |
| 70 | Find the user by ID | আইডি দিয়ে ইউজার খুঁজে |
| 72-77 | Verify user is a TECHNICIAN, throw 403 otherwise | ইউজার টেকনিশিয়ান কিনা যাচাই, না হলে 403 থ্রো |
| 79-84 | Upsert profile with new availability data | নতুন অ্যাভেইলেবিলিটি ডাটা সহ প্রোফাইল আপসার্ট |
| 86 | Return the profile | প্রোফাইল রিটার্ন |
| 89 | Define getMyBookings by technician ID | টেকনিশিয়ান আইডি দিয়ে getMyBookings সংজ্ঞায়িত |
| 90-100 | Find all bookings for this technician with service, customer, payment, review | এই টেকনিশিয়ানের সব বুকিং সার্ভিস, গ্রাহক, পেমেন্ট, রিভিউ সহ খুঁজে |
| 103 | Define updateBookingStatus with bookingId, technicianId, status | bookingId, technicianId, status সহ updateBookingStatus সংজ্ঞায়িত |
| 108-110 | Find the booking by ID | আইডি দিয়ে বুকিং খুঁজে |
| 112-114 | Throw 404 if not found | না পেলে 404 থ্রো |
| 116-121 | Ensure only the assigned technician can update | শুধুমাত্র নির্ধারিত টেকনিশিয়ান আপডেট করতে পারে তা নিশ্চিত |
| 123-131 | Define valid status transitions map | বৈধ স্ট্যাটাস ট্রানজিশন ম্যাপ সংজ্ঞায়িত |
| 133 | Get allowed transitions for current status | বর্তমান স্ট্যাটাসের জন্য অনুমোদিত ট্রানজিশন |
| 135-140 | Throw 400 if the requested transition is not allowed | অনুরোধ করা ট্রানজিশন অনুমোদিত না হলে 400 থ্রো |
| 142-150 | Update the booking status and return with relations | বুকিং স্ট্যাটাস আপডেট এবং সম্পর্কসহ রিটার্ন |
| 153-160 | Export technicianService object | technicianService অবজেক্ট এক্সপোর্ট |

---

### `src/modules/technician/technician.controller.ts`

```ts
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { technicianService } from "./technician.service";
import httpStatus from "http-status";

const getAll = catchAsync(async (_req: Request, res: Response) => {
  const technicians = await technicianService.getAllTechnicians();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technicians fetched successfully",
    data: technicians,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const technician = await technicianService.getTechnicianById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technician fetched successfully",
    data: technician,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const profile = await technicianService.updateProfile(
    req.user!.id,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: profile,
  });
});

const updateAvailability = catchAsync(async (req: Request, res: Response) => {
  const profile = await technicianService.updateAvailability(
    req.user!.id,
    req.body.availability,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Availability updated successfully",
    data: profile,
  });
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const bookings = await technicianService.getMyBookings(req.user!.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings fetched successfully",
    data: bookings,
  });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const booking = await technicianService.updateBookingStatus(
    req.params.id,
    req.user!.id,
    req.body.status,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking status updated successfully",
    data: booking,
  });
});

export const technicianController = {
  getAll,
  getById,
  updateProfile,
  updateAvailability,
  getMyBookings,
  updateBookingStatus,
};
```

| Line | English | বাংলা |
|------|---------|-------|
| 1-5 | Import dependencies | ডিপেন্ডেন্সি ইম্পোর্ট |
| 7 | Define getAll controller (public) | getAll কন্ট্রোলার সংজ্ঞায়িত (পাবলিক) |
| 13 | Define getById controller (public) | getById কন্ট্রোলার সংজ্ঞায়িত (পাবলিক) |
| 20 | Define updateProfile controller (authenticated technician) | updateProfile কন্ট্রোলার সংজ্ঞায়িত (অথেনটিকেটেড টেকনিশিয়ান) |
| 21-23 | Call service with user ID and body data | ইউজার আইডি এবং বডি ডাটা দিয়ে সার্ভিস কল |
| 29 | Define updateAvailability controller | updateAvailability কন্ট্রোলার সংজ্ঞায়িত |
| 30-33 | Call service with user ID and availability from body | ইউজার আইডি এবং বডি থেকে অ্যাভেইলেবিলিটি দিয়ে সার্ভিস কল |
| 38 | Define getMyBookings controller | getMyBookings কন্ট্রোলার সংজ্ঞায়িত |
| 44 | Define updateBookingStatus controller | updateBookingStatus কন্ট্রোলার সংজ্ঞায়িত |
| 45-48 | Call service with booking ID, user ID, and new status | বুকিং আইডি, ইউজার আইডি এবং নতুন স্ট্যাটাস দিয়ে সার্ভিস কল |
| 54-60 | Export technicianController object | technicianController অবজেক্ট এক্সপোর্ট |

---

### `src/modules/technician/technician.route.ts`

```ts
import { Router } from "express";
import { technicianController } from "./technician.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateProfileRules, availabilityRules } from "./technician.validation";

const router = Router();
const profileRouter = Router();
const availabilityRouter = Router();
const bookingRouter = Router();

router.get("/", technicianController.getAll);
router.get("/:id", technicianController.getById);

profileRouter.put(
  "/",
  auth(Role.TECHNICIAN),
  validateRequest(updateProfileRules),
  technicianController.updateProfile,
);

availabilityRouter.put(
  "/",
  auth(Role.TECHNICIAN),
  validateRequest(availabilityRules),
  technicianController.updateAvailability,
);

bookingRouter.get(
  "/",
  auth(Role.TECHNICIAN),
  technicianController.getMyBookings,
);

bookingRouter.patch(
  "/:id",
  auth(Role.TECHNICIAN),
  technicianController.updateBookingStatus,
);

export const technicianRoutes = router;
export const technicianProfileRoutes = profileRouter;
export const technicianAvailabilityRoutes = availabilityRouter;
export const technicianBookingRoutes = bookingRouter;
```

| Line | English | বাংলা |
|------|---------|-------|
| 1-6 | Import dependencies | ডিপেন্ডেন্সি ইম্পোর্ট |
| 8-11 | Create four separate routers for different path prefixes | চারটি আলাদা রাউটার বিভিন্ন পাথ প্রিফিক্সের জন্য |
| 13-14 | Public routes on main router: GET all, GET by ID | মূল রাউটারে পাবলিক রুট: GET সব, GET আইডি দিয়ে |
| 16-21 | Profile routes on profileRouter: PUT with TECHNICIAN auth | profileRouter এ প্রোফাইল রুট: TECHNICIAN অথ সহ PUT |
| 23-28 | Availability routes on availabilityRouter: PUT with TECHNICIAN auth | availabilityRouter এ অ্যাভেইলেবিলিটি রুট: TECHNICIAN অথ সহ PUT |
| 30-34 | Bookings list on bookingRouter: GET with TECHNICIAN auth | bookingRouter এ বুকিং তালিকা: TECHNICIAN অথ সহ GET |
| 36-40 | Booking status update on bookingRouter: PATCH with TECHNICIAN auth | bookingRouter এ বুকিং স্ট্যাটাস আপডেট: TECHNICIAN অথ সহ PATCH |
| 42-45 | Export all four routers separately | চারটি রাউটার আলাদাভাবে এক্সপোর্ট |

---

## 11. Booking Module / বুকিং মডিউল

### `src/modules/booking/booking.validation.ts`

```ts
import type { ValidationRule } from "../../middlewares/validateRequest";

export const createBookingRules: ValidationRule[] = [
  {
    field: "serviceId",
    required: true,
    type: "string",
    message: "Service ID is required",
  },
];
```

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import ValidationRule type | ValidationRule টাইপ ইম্পোর্ট |
| 3 | Define createBookingRules: only serviceId is required | createBookingRules: শুধু serviceId প্রয়োজনীয় |

---

### `src/modules/booking/booking.service.ts`

```ts
import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const createBooking = async (data: {
  customerId: string;
  serviceId: string;
  scheduleDate?: string;
}) => {
  const service = await prisma.service.findUnique({
    where: { id: data.serviceId },
  });

  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }

  const booking = await prisma.booking.create({
    data: {
      customerId: data.customerId,
      serviceId: data.serviceId,
      technicianId: service.technicianId,
      scheduleDate: data.scheduleDate ? new Date(data.scheduleDate) : null,
    },
    include: {
      service: true,
      customer: { omit: { password: true } },
      technician: { omit: { password: true } },
    },
  });

  return booking;
};

const getMyBookings = async (userId: string, role: string) => {
  const where =
    role === "CUSTOMER"
      ? { customerId: userId }
      : role === "TECHNICIAN"
        ? { technicianId: userId }
        : {};

  return prisma.booking.findMany({
    where,
    include: {
      service: true,
      customer: { omit: { password: true } },
      technician: { omit: { password: true } },
      payment: true,
      review: true,
    },
    orderBy: { id: "desc" },
  });
};

const getBookingById = async (
  bookingId: string,
  userId: string,
  role: string,
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      service: true,
      customer: { omit: { password: true } },
      technician: { omit: { password: true } },
      payment: true,
      review: true,
    },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (role === "CUSTOMER" && booking.customerId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only view your own bookings",
    );
  }

  if (role === "TECHNICIAN" && booking.technicianId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only view your own bookings",
    );
  }

  return booking;
};

const cancelBooking = async (bookingId: string, customerId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only cancel your own bookings",
    );
  }

  const cancellableStatuses = ["REQUESTED", "ACCEPTED", "PAID"];

  if (!cancellableStatuses.includes(booking.status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot cancel booking at current status",
    );
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
    include: {
      service: true,
      customer: { omit: { password: true } },
      technician: { omit: { password: true } },
    },
  });
};

export const bookingService = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
```

| Line | English | বাংলা |
|------|---------|-------|
| 1-3 | Import dependencies | ডিপেন্ডেন্সি ইম্পোর্ট |
| 5 | Define createBooking with customerId, serviceId, optional scheduleDate | customerId, serviceId, অপশনাল scheduleDate সহ createBooking সংজ্ঞায়িত |
| 10-12 | Find the service being booked | যে সার্ভিস বুক করা হচ্ছে তা খুঁজে |
| 14-16 | Throw 404 if service doesn't exist | সার্ভিস না থাকলে 404 থ্রো |
| 18 | Create the booking | বুকিং তৈরি |
| 19-26 | Set customerId, serviceId, technicianId from the service, scheduleDate as Date or null | customerId, serviceId, সার্ভিস থেকে technicianId, scheduleDate Date বা null হিসেবে সেট |
| 27-31 | Include service, customer, and technician in response | রেসপন্সে সার্ভিস, গ্রাহক ও টেকনিশিয়ান অন্তর্ভুক্ত |
| 33 | Return the created booking | তৈরি বুকিং রিটার্ন |
| 36 | Define getMyBookings with userId and role | userId এবং role সহ getMyBookings সংজ্ঞায়িত |
| 37-41 | Role-based filtering: customers see their bookings, technicians see theirs, admins see all | রোল-ভিত্তিক ফিল্টারিং: গ্রাহকরা তাদের বুকিং দেখে, টেকনিশিয়ানরা তাদের দেখে, অ্যাডমিনরা সব দেখে |
| 43-53 | Query with filters, include all related data, order by newest | ফিল্টার সহ কোয়েরি, সব সম্পর্কিত ডাটা সহ, নতুন আগে সাজানো |
| 56 | Define getBookingById with bookingId, userId, role | bookingId, userId, role সহ getBookingById সংজ্ঞায়িত |
| 61-70 | Find booking by ID with all related data | আইডি দিয়ে সব সম্পর্কিত ডাটা সহ বুকিং খুঁজে |
| 72-74 | Throw 404 if not found | না পেলে 404 থ্রো |
| 76-81 | Customers can only view their own bookings | গ্রাহকরা শুধু নিজেদের বুকিং দেখতে পারে |
| 83-88 | Technicians can only view their own bookings | টেকনিশিয়ানরা শুধু নিজেদের বুকিং দেখতে পারে |
| 90 | Return the booking | বুকিং রিটার্ন |
| 93 | Define cancelBooking with bookingId and customerId | bookingId এবং customerId সহ cancelBooking সংজ্ঞায়িত |
| 94-96 | Find the booking | বুকিং খুঁজে |
| 98-100 | Throw 404 if not found | না পেলে 404 থ্রো |
| 102-107 | Only the customer who owns the booking can cancel | শুধুমাত্র যে গ্রাহক বুকিংটির মালিক সে বাতিল করতে পারে |
| 109 | Define which statuses allow cancellation | কোন স্ট্যাটাসে বাতিল করা যায় তা নির্ধারণ |
| 111-116 | Throw 400 if booking can't be cancelled at current status | বর্তমান স্ট্যাটাসে বুকিং বাতিল করা না গেলে 400 থ্রো |
| 118-127 | Update booking status to CANCELLED and return with relations | বুকিং স্ট্যাটাস CANCELLED এ আপডেট এবং সম্পর্কসহ রিটার্ন |
| 130-134 | Export bookingService object | bookingService অবজেক্ট এক্সপোর্ট |

---

### `src/modules/booking/booking.controller.ts`

```ts
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.service";
import httpStatus from "http-status";

const create = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.createBooking({
    customerId: req.user!.id,
    serviceId: req.body.serviceId,
    scheduleDate: req.body.scheduleDate,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Booking created successfully",
    data: booking,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const bookings = await bookingService.getMyBookings(
    req.user!.id,
    req.user!.role,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings fetched successfully",
    data: bookings,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.getBookingById(
    req.params.id,
    req.user!.id,
    req.user!.role,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking fetched successfully",
    data: booking,
  });
});

const cancel = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.cancelBooking(
    req.params.id,
    req.user!.id,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking cancelled successfully",
    data: booking,
  });
});

export const bookingController = {
  create,
  getAll,
  getById,
  cancel,
};
```

| Line | English | বাংলা |
|------|---------|-------|
| 1-5 | Import dependencies | ডিপেন্ডেন্সি ইম্পোর্ট |
| 7 | Define create controller | create কন্ট্রোলার সংজ্ঞায়িত |
| 8-12 | Call service with customer ID from auth, serviceId and scheduleDate from body | অথ থেকে গ্রাহক আইডি, বডি থেকে serviceId এবং scheduleDate দিয়ে সার্ভিস কল |
| 20 | Define getAll controller | getAll কন্ট্রোলার সংজ্ঞায়িত |
| 21-24 | Call service with user ID and role from auth | অথ থেকে ইউজার আইডি এবং রোল দিয়ে সার্ভিস কল |
| 30 | Define getById controller | getById কন্ট্রোলার সংজ্ঞায়িত |
| 31-35 | Call service with booking ID from params, id and role from auth | প্যারাম থেকে বুকিং আইডি, অথ থেকে আইডি এবং রোল দিয়ে সার্ভিস কল |
| 40 | Define cancel controller | cancel কন্ট্রোলার সংজ্ঞায়িত |
| 41-44 | Call cancel service with booking ID from params and user ID from auth | প্যারাম থেকে বুকিং আইডি এবং অথ থেকে ইউজার আইডি দিয়ে ক্যান্সেল সার্ভিস কল |
| 50-55 | Export bookingController object | bookingController অবজেক্ট এক্সপোর্ট |

---

### `src/modules/booking/booking.route.ts`

```ts
import { Router } from "express";
import { bookingController } from "./booking.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingRules } from "./booking.validation";

const router = Router();

router.post(
  "/",
  auth(Role.CUSTOMER),
  validateRequest(createBookingRules),
  bookingController.create,
);

router.get(
  "/",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  bookingController.getAll,
);

router.get(
  "/:id",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  bookingController.getById,
);

router.patch(
  "/:id/cancel",
  auth(Role.CUSTOMER),
  bookingController.cancel,
);

export const bookingRoutes = router;
```

| Line | English | বাংলা |
|------|---------|-------|
| 1-6 | Import dependencies | ডিপেন্ডেন্সি ইম্পোর্ট |
| 8 | Create Router instance | Router ইনস্ট্যান্স তৈরি |
| 10-15 | POST / - only CUSTOMER can create, with validation | POST / - শুধু CUSTOMER তৈরি করতে পারে, ভ্যালিডেশন সহ |
| 17-21 | GET / - CUSTOMER, TECHNICIAN, or ADMIN can list | GET / - CUSTOMER, TECHNICIAN বা ADMIN তালিকা দেখতে পারে |
| 23-27 | GET /:id - same roles, get single booking | GET /:id - একই রোল, একক বুকিং দেখা |
| 29-33 | PATCH /:id/cancel - only CUSTOMER can cancel | PATCH /:id/cancel - শুধু CUSTOMER বাতিল করতে পারে |
| 35 | Export router as bookingRoutes | রাউটারকে bookingRoutes হিসেবে এক্সপোর্ট |

---

## 12. Payment Module / পেমেন্ট মডিউল

### `src/modules/payment/payment.service.ts`

```ts
import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { getStripe } from "../../utils/stripe";
import httpStatus from "http-status";

const createPaymentIntent = async (customerId: string, bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new AppError(httpStatus.FORBIDDEN, "Not your booking");
  }

  if (booking.status !== "ACCEPTED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Booking must be accepted before payment",
    );
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { bookingId },
  });

  if (existingPayment?.status === "COMPLETED") {
    throw new AppError(httpStatus.BAD_REQUEST, "Already paid");
  }

  const amountInCents = Math.round(booking.service.price * 100);

  const paymentIntent = await getStripe().paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    metadata: { bookingId },
  });

  const payment = await prisma.payment.upsert({
    where: { bookingId },
    update: {
      amount: booking.service.price,
      transactionId: paymentIntent.id,
      status: "PENDING",
    },
    create: {
      bookingId,
      amount: booking.service.price,
      transactionId: paymentIntent.id,
      status: "PENDING",
      userId: customerId,
    },
  });

  return { clientSecret: paymentIntent.client_secret, payment };
};

const confirmPayment = async (paymentIntentId: string) => {
  const paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== "succeeded") {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment has not succeeded");
  }

  const bookingId = paymentIntent.metadata.bookingId;
  if (!bookingId) {
    throw new AppError(httpStatus.BAD_REQUEST, "No booking linked");
  }

  const payment = await prisma.payment.update({
    where: { bookingId },
    data: { status: "COMPLETED", transactionId: paymentIntent.id },
  });

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "PAID" },
  });

  return payment;
};

const getMyPayments = async (userId: string) => {
  return prisma.payment.findMany({
    where: { userId },
    include: {
      booking: {
        include: { service: true },
      },
    },
    orderBy: { id: "desc" },
  });
};

const getPaymentById = async (paymentId: string, userId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      booking: {
        include: { service: true },
      },
    },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  if (payment.userId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "Not your payment");
  }

  return payment;
};

const handleStripeWebhook = async (body: Buffer, sig: string) => {
  const event = getStripe().webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as any;
    await confirmPayment(paymentIntent.id);
  }

  return { received: true };
};

export const paymentService = {
  createPaymentIntent,
  confirmPayment,
  getMyPayments,
  getPaymentById,
  handleStripeWebhook,
};
```

END OF PART 5

| Line | English | বাংলা |
|------|---------|-------|
| 1-4 | Import dependencies | ডিপেন্ডেন্সি ইম্পোর্ট |
| 6 | Define createPaymentIntent with customerId and bookingId | customerId এবং bookingId সহ createPaymentIntent সংজ্ঞায়িত |
| 7-10 | Find booking with its service details | সার্ভিস বিবরণ সহ বুকিং খুঁজে |
| 12-14 | Throw 404 if booking not found | বুকিং না পেলে 404 থ্রো |
| 16-18 | Verify the booking belongs to this customer | বুকিংটি এই গ্রাহকের কিনা যাচাই |
| 20-25 | Verify booking status is ACCEPTED (must be accepted before payment) | বুকিং স্ট্যাটাস ACCEPTED কিনা যাচাই (পেমেন্টের আগে গ্রহণ করতে হবে) |
| 27-29 | Check if a payment record already exists | পেমেন্ট রেকর্ড আগে আছে কিনা চেক |
| 31-33 | If already completed, throw error | ইতিমধ্যে কমপ্লিট হলে এরর থ্রো |
| 35 | Convert price to cents (Stripe uses cents, e.g. $10 = 1000 cents) | মূল্যকে সেন্টে রূপান্তর (Stripe সেন্ট ব্যবহার করে) |
| 37-41 | Create a Stripe PaymentIntent with amount, currency, and bookingId in metadata | Stripe PaymentIntent তৈরি করে amount, currency এবং মেটাডাটায় bookingId সহ |
| 43-57 | Upsert payment record in database (create or update if exists) | ডাটাবেসে পেমেন্ট রেকর্ড আপসার্ট (না থাকলে তৈরি, থাকলে আপডেট) |
| 59 | Return the client secret (for frontend to complete payment) and payment record | ক্লায়েন্ট সিক্রেট (ফ্রন্টএন্ড পেমেন্ট সম্পূর্ণ করার জন্য) এবং পেমেন্ট রেকর্ড রিটার্ন |
| 62 | Define confirmPayment with paymentIntentId | paymentIntentId সহ confirmPayment সংজ্ঞায়িত |
| 63 | Retrieve the payment intent from Stripe to verify status | Stripe থেকে পেমেন্ট ইন্টেন্ট রিট্রিভ করে স্ট্যাটাস যাচাই |
| 65-67 | Throw error if payment hasn't succeeded | পেমেন্ট সফল না হলে এরর থ্রো |
| 69-72 | Get bookingId from metadata and validate | মেটাডাটা থেকে bookingId নিয়ে বৈধতা যাচাই |
| 74-77 | Update payment record to COMPLETED | পেমেন্ট রেকর্ড COMPLETED এ আপডেট |
| 79-82 | Update booking status to PAID | বুকিং স্ট্যাটাস PAID এ আপডেট |
| 84 | Return the payment record | পেমেন্ট রেকর্ড রিটার্ন |
| 87 | Define getMyPayments for a user | ইউজারের getMyPayments সংজ্ঞায়িত |
| 88-96 | Find all payments for this user with booking and service details | এই ইউজারের সব পেমেন্ট বুকিং ও সার্ভিস বিবরণ সহ খুঁজে |
| 99 | Define getPaymentById with paymentId and userId | paymentId এবং userId সহ getPaymentById সংজ্ঞায়িত |
| 100-106 | Find payment by ID with booking and service | আইডি দিয়ে বুকিং ও সার্ভিস সহ পেমেন্ট খুঁজে |
| 108-110 | Throw 404 if not found | না পেলে 404 থ্রো |
| 112-115 | Ensure user can only view their own payments | ইউজার শুধু নিজের পেমেন্ট দেখতে পারে তা নিশ্চিত |
| 117 | Return the payment | পেমেন্ট রিটার্ন |
| 120 | Define handleStripeWebhook with raw body and stripe signature | raw body এবং stripe সিগনেচার সহ handleStripeWebhook সংজ্ঞায়িত |
| 121-125 | Verify webhook signature using Stripe's constructEvent | Stripe এর constructEvent ব্যবহার করে ওয়েবহুক সিগনেচার যাচাই |
| 127-130 | If payment_intent.succeeded event, call confirmPayment | payment_intent.succeeded ইভেন্ট হলে, confirmPayment কল |
| 132 | Return acknowledgment | স্বীকৃতি রিটার্ন |
| 135-141 | Export paymentService object | paymentService অবজেক্ট এক্সপোর্ট |

---

### `src/modules/payment/payment.controller.ts`

```ts
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";
import httpStatus from "http-status";

const create = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.createPaymentIntent(
    req.user!.id,
    req.body.bookingId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment intent created successfully",
    data: result,
  });
});

const confirm = catchAsync(async (req: Request, res: Response) => {
  const payment = await paymentService.confirmPayment(
    req.body.paymentIntentId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment confirmed successfully",
    data: payment,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const payments = await paymentService.getMyPayments(req.user!.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payments fetched successfully",
    data: payments,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const payment = await paymentService.getPaymentById(
    req.params.id,
    req.user!.id,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment fetched successfully",
    data: payment,
  });
});

const webhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const result = await paymentService.handleStripeWebhook(req.body, sig);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Webhook received",
    data: result,
  });
});

export const paymentController = {
  create,
  confirm,
  getAll,
  getById,
  webhook,
};
```

| Line | English | বাংলা |
|------|---------|-------|
| 1-5 | Import dependencies | ডিপেন্ডেন্সি ইম্পোর্ট |
| 7 | Define create controller (creates payment intent) | create কন্ট্রোলার সংজ্ঞায়িত (পেমেন্ট ইন্টেন্ট তৈরি করে) |
| 8-11 | Call service with user ID and booking ID from body | ইউজার আইডি এবং বডি থেকে বুকিং আইডি দিয়ে সার্ভিস কল |
| 17 | Define confirm controller (confirms payment after Stripe charge) | confirm কন্ট্রোলার সংজ্ঞায়িত (Stripe চার্জের পর পেমেন্ট নিশ্চিত করে) |
| 18-20 | Call service with paymentIntentId from body | বডি থেকে paymentIntentId দিয়ে সার্ভিস কল |
| 26 | Define getAll controller (lists user's payments) | getAll কন্ট্রোলার সংজ্ঞায়িত (ইউজারের পেমেন্ট তালিকা) |
| 32 | Define getById controller | getById কন্ট্রোলার সংজ্ঞায়িত |
| 38 | Define webhook controller (handles Stripe webhook events) | webhook কন্ট্রোলার সংজ্ঞায়িত (Stripe ওয়েবহুক ইভেন্ট হ্যান্ডল করে) |
| 39 | Get the Stripe signature from request headers | রিকোয়েস্ট হেডার থেকে Stripe সিগনেচার নেয় |
| 40 | Call service with raw body and signature | raw body এবং সিগনেচার দিয়ে সার্ভিস কল |
| 47 | Send response acknowledging webhook received | ওয়েবহুক প্রাপ্তির স্বীকৃতি রেসপন্স পাঠায় |
| 50-56 | Export paymentController object | paymentController অবজেক্ট এক্সপোর্ট |

---

### `src/modules/payment/payment.route.ts`

```ts
import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/create", auth(Role.CUSTOMER), paymentController.create);
router.post("/confirm", auth(Role.CUSTOMER), paymentController.confirm);
router.get("/", auth(Role.CUSTOMER, Role.ADMIN), paymentController.getAll);
router.get("/:id", auth(Role.CUSTOMER), paymentController.getById);

export const paymentRoutes = router;
```

| Line | English | বাংলা |
|------|---------|-------|
| 1-4 | Import dependencies | ডিপেন্ডেন্সি ইম্পোর্ট |
| 6 | Create Router instance | Router ইনস্ট্যান্স তৈরি |
| 8 | POST /create - only CUSTOMER can initiate payment | POST /create - শুধু CUSTOMER পেমেন্ট শুরু করতে পারে |
| 9 | POST /confirm - only CUSTOMER can confirm payment | POST /confirm - শুধু CUSTOMER পেমেন্ট নিশ্চিত করতে পারে |
| 10 | GET / - CUSTOMER or ADMIN can view payments list | GET / - CUSTOMER বা ADMIN পেমেন্ট তালিকা দেখতে পারে |
| 11 | GET /:id - only CUSTOMER can view a specific payment | GET /:id - শুধু CUSTOMER নির্দিষ্ট পেমেন্ট দেখতে পারে |
| 13 | Export router as paymentRoutes | রাউটারকে paymentRoutes হিসেবে এক্সপোর্ট |

---

## 13. Review Module / রিভিউ মডিউল

### `src/modules/review/review.validation.ts`

```ts
import type { ValidationRule } from "../../middlewares/validateRequest";

export const createReviewRules: ValidationRule[] = [
  {
    field: "bookingId",
    required: true,
    type: "string",
    message: "Booking ID is required",
  },
  {
    field: "rating",
    required: true,
    type: "number",
    min: 1,
    max: 5,
    message: "Rating must be between 1 and 5",
  },
  {
    field: "comment",
    type: "string",
  },
];
```

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Import ValidationRule type | ValidationRule টাইপ ইম্পোর্ট |
| 3 | Define createReviewRules array | createReviewRules অ্যারে সংজ্ঞায়িত |
| 4-9 | Booking ID is required and must be a string | বুকিং আইডি প্রয়োজনীয় এবং স্ট্রিং হতে হবে |
| 10-16 | Rating is required, must be a number between 1 and 5 | রেটিং প্রয়োজনীয়, ১ থেকে ৫ এর মধ্যে একটি সংখ্যা হতে হবে |
| 17-20 | Comment is optional and must be a string | মন্তব্য অপশনাল এবং স্ট্রিং হতে হবে |

---

### `src/modules/review/review.service.ts`

```ts
import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const createReview = async (data: {
  bookingId: string;
  customerId: string;
  rating: number;
  comment?: string;
}) => {
  const booking = await prisma.booking.findUnique({
    where: { id: data.bookingId },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.customerId !== data.customerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "This booking does not belong to you",
    );
  }

  if (booking.status !== "COMPLETED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can only review completed bookings",
    );
  }

  const existing = await prisma.review.findUnique({
    where: { bookingId: data.bookingId },
  });

  if (existing) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You have already reviewed this booking",
    );
  }

  const review = await prisma.review.create({
    data: {
      bookingId: data.bookingId,
      customerId: data.customerId,
      technicianId: booking.technicianId,
      rating: data.rating,
      comment: data.comment,
    },
    include: {
      booking: true,
      customer: { omit: { password: true } },
      technician: { omit: { password: true } },
    },
  });

  return review;
};

export const reviewService = {
  createReview,
};
```

| Line | English | বাংলা |
|------|---------|-------|
| 1-3 | Import dependencies | ডিপেন্ডেন্সি ইম্পোর্ট |
| 5 | Define createReview with bookingId, customerId, rating, optional comment | bookingId, customerId, rating, অপশনাল comment সহ createReview সংজ্ঞায়িত |
| 11-13 | Find the booking being reviewed | যে বুকিং রিভিউ করা হচ্ছে তা খুঁজে |
| 15-17 | Throw 404 if booking not found | বুকিং না পেলে 404 থ্রো |
| 19-24 | Ensure only the customer who made the booking can review | শুধুমাত্র যে গ্রাহক বুকিং করেছেন তিনি রিভিউ দিতে পারেন তা নিশ্চিত |
| 26-31 | Ensure only completed bookings can be reviewed | শুধুমাত্র সম্পন্ন বুকিং রিভিউ করা যাবে তা নিশ্চিত |
| 33-35 | Check if a review already exists for this booking | এই বুকিংয়ের জন্য আগে রিভিউ আছে কিনা চেক |
| 37-42 | Throw 409 Conflict if already reviewed | আগে রিভিউ দেওয়া থাকলে 409 Conflict থ্রো |
| 44-56 | Create the review with technicianId from the booking itself | বুকিং থেকে technicianId সহ রিভিউ তৈরি |
| 57-59 | Include booking, customer, and technician in response | রেসপন্সে বুকিং, গ্রাহক ও টেকনিশিয়ান অন্তর্ভুক্ত |
| 61 | Return the created review | তৈরি রিভিউ রিটার্ন |
| 63-65 | Export reviewService object | reviewService অবজেক্ট এক্সপোর্ট |

---

### `src/modules/review/review.controller.ts`

```ts
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";
import httpStatus from "http-status";

const create = catchAsync(async (req: Request, res: Response) => {
  const review = await reviewService.createReview({
    bookingId: req.body.bookingId,
    customerId: req.user!.id,
    rating: req.body.rating,
    comment: req.body.comment,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: review,
  });
});

export const reviewController = {
  create,
};
```

| Line | English | বাংলা |
|------|---------|-------|
| 1-5 | Import dependencies | ডিপেন্ডেন্সি ইম্পোর্ট |
| 7 | Define create controller | create কন্ট্রোলার সংজ্ঞায়িত |
| 8-13 | Call service with bookingId and comment from body, customerId from auth, rating from body | বডি থেকে bookingId এবং comment, অথ থেকে customerId, বডি থেকে rating দিয়ে সার্ভিস কল |
| 14-19 | Send 201 response with the created review | তৈরি রিভিউ সহ 201 রেসপন্স পাঠায় |
| 22-24 | Export reviewController object | reviewController অবজেক্ট এক্সপোর্ট |

---

### `src/modules/review/review.route.ts`

```ts
import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { createReviewRules } from "./review.validation";

const router = Router();

router.post(
  "/",
  auth(Role.CUSTOMER),
  validateRequest(createReviewRules),
  reviewController.create,
);

export const reviewRoutes = router;
```

| Line | English | বাংলা |
|------|---------|-------|
| 1-6 | Import dependencies | ডিপেন্ডেন্সি ইম্পোর্ট |
| 8 | Create Router instance | Router ইনস্ট্যান্স তৈরি |
| 10-15 | POST / - only CUSTOMER can create reviews, with validation | POST / - শুধু CUSTOMER রিভিউ তৈরি করতে পারে, ভ্যালিডেশন সহ |
| 17 | Export router as reviewRoutes | রাউটারকে reviewRoutes হিসেবে এক্সপোর্ট |

---

## 14. Admin Module / অ্যাডমিন মডিউল

### `src/modules/admin/admin.service.ts`

```ts
import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateUserBanStatus = async (userId: string, isBanned: boolean) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.role === "ADMIN") {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot ban an admin");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { isBanned },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
    },
  });
};

const getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      service: true,
      customer: { omit: { password: true } },
      technician: { omit: { password: true } },
      payment: true,
      review: true,
    },
    orderBy: { id: "desc" },
  });
};

const getAllCategories = async () => {
  return prisma.category.findMany({
    include: { services: true },
    orderBy: { name: "asc" },
  });
};

const createCategory = async (data: { name: string; description?: string }) => {
  const existing = await prisma.category.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "Category already exists");
  }

  return prisma.category.create({ data });
};

export const adminService = {
  getAllUsers,
  updateUserBanStatus,
  getAllBookings,
  getAllCategories,
  createCategory,
};
```

| Line | English | বাংলা |
|------|---------|-------|
| 1-3 | Import dependencies | ডিপেন্ডেন্সি ইম্পোর্ট |
| 5 | Define getAllUsers function | getAllUsers ফাংশন সংজ্ঞায়িত |
| 6-16 | Find all users selecting only safe fields (no password!), ordered by newest | শুধু নিরাপদ ফিল্ড নির্বাচন করে সব ইউজার খুঁজে (পাসওয়ার্ড নেই!), নতুন আগে সাজানো |
| 19 | Define updateUserBanStatus with userId and isBanned boolean | userId এবং isBanned বুলিয়ান সহ updateUserBanStatus সংজ্ঞায়িত |
| 20 | Find the user by ID | আইডি দিয়ে ইউজার খুঁজে |
| 22-24 | Throw 404 if user not found | ইউজার না পেলে 404 থ্রো |
| 26-28 | Prevent banning another admin (safety measure) | অন্য অ্যাডমিনকে ব্যান করা প্রতিরোধ (নিরাপত্তা ব্যবস্থা) |
| 30-40 | Update user's ban status and return safe fields | ইউজারের ব্যান স্ট্যাটাস আপডেট এবং নিরাপদ ফিল্ড রিটার্ন |
| 43 | Define getAllBookings function | getAllBookings ফাংশন সংজ্ঞায়িত |
| 44-53 | Find all bookings with full related data, newest first | সম্পূর্ণ সম্পর্কিত ডাটা সহ সব বুকিং খুঁজে, নতুন আগে |
| 56 | Define getAllCategories function | getAllCategories ফাংশন সংজ্ঞায়িত |
| 57-61 | Find all categories with services, alphabetically ordered | সার্ভিস সহ সব ক্যাটাগরি খুঁজে, বর্ণানুক্রমিক |
| 64 | Define createCategory function | createCategory ফাংশন সংজ্ঞায়িত |
| 65-67 | Check if category name already exists | ক্যাটাগরি নাম আগে আছে কিনা চেক |
| 69-71 | Throw 409 Conflict if exists | থাকলে 409 Conflict থ্রো |
| 73 | Create and return new category | নতুন ক্যাটাগরি তৈরি ও রিটার্ন |
| 76-82 | Export adminService object | adminService অবজেক্ট এক্সপোর্ট |

---

### `src/modules/admin/admin.controller.ts`

```ts
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";
import httpStatus from "http-status";

const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await adminService.getAllUsers();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users fetched successfully",
    data: users,
  });
});

const updateUserBanStatus = catchAsync(async (req: Request, res: Response) => {
  const user = await adminService.updateUserBanStatus(
    req.params.id,
    req.body.isBanned,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `User ${user.isBanned ? "banned" : "unbanned"} successfully`,
    data: user,
  });
});

const getAllBookings = catchAsync(async (_req: Request, res: Response) => {
  const bookings = await adminService.getAllBookings();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings fetched successfully",
    data: bookings,
  });
});

const getAllCategories = catchAsync(async (_req: Request, res: Response) => {
  const categories = await adminService.getAllCategories();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories fetched successfully",
    data: categories,
  });
});

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await adminService.createCategory(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Category created successfully",
    data: category,
  });
});

export const adminController = {
  getAllUsers,
  updateUserBanStatus,
  getAllBookings,
  getAllCategories,
  createCategory,
};
```

| Line | English | বাংলা |
|------|---------|-------|
| 1-5 | Import dependencies | ডিপেন্ডেন্সি ইম্পোর্ট |
| 7 | Define getAllUsers controller | getAllUsers কন্ট্রোলার সংজ্ঞায়িত |
| 8 | Call service to get all users | সব ইউজার পেতে সার্ভিস কল |
| 14 | Define updateUserBanStatus controller | updateUserBanStatus কন্ট্রোলার সংজ্ঞায়িত |
| 15-17 | Call service with user ID from params and isBanned from body | প্যারাম থেকে ইউজার আইডি এবং বডি থেকে isBanned দিয়ে সার্ভিস কল |
| 18-23 | Send response with dynamic message based on ban status | ব্যান স্ট্যাটাসের উপর ভিত্তি করে ডায়নামিক মেসেজ সহ রেসপন্স পাঠায় |
| 26 | Define getAllBookings controller | getAllBookings কন্ট্রোলার সংজ্ঞায়িত |
| 33 | Define getAllCategories controller | getAllCategories কন্ট্রোলার সংজ্ঞায়িত |
| 40 | Define createCategory controller | createCategory কন্ট্রোলার সংজ্ঞায়িত |
| 41 | Call service with request body | রিকোয়েস্ট বডি দিয়ে সার্ভিস কল |
| 42-47 | Send 201 response with new category | নতুন ক্যাটাগরি সহ 201 রেসপন্স পাঠায় |
| 50-56 | Export adminController object | adminController অবজেক্ট এক্সপোর্ট |

---

### `src/modules/admin/admin.route.ts`

```ts
import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserBanStatus);
router.get("/bookings", auth(Role.ADMIN), adminController.getAllBookings);
router.get("/categories", auth(Role.ADMIN), adminController.getAllCategories);
router.post("/categories", auth(Role.ADMIN), adminController.createCategory);

export const adminRoutes = router;
```

| Line | English | বাংলা |
|------|---------|-------|
| 1-4 | Import dependencies | ডিপেন্ডেন্সি ইম্পোর্ট |
| 6 | Create Router instance | Router ইনস্ট্যান্স তৈরি |
| 8 | GET /users - only ADMIN can list all users | GET /users - শুধু ADMIN সব ইউজার তালিকা দেখতে পারে |
| 9 | PATCH /users/:id - only ADMIN can ban/unban users | PATCH /users/:id - শুধু ADMIN ইউজার ব্যান/আনব্যান করতে পারে |
| 10 | GET /bookings - only ADMIN can view all bookings | GET /bookings - শুধু ADMIN সব বুকিং দেখতে পারে |
| 11 | GET /categories - only ADMIN can view all categories (admin route) | GET /categories - শুধু ADMIN সব ক্যাটাগরি দেখতে পারে (অ্যাডমিন রুট) |
| 12 | POST /categories - only ADMIN can create categories | POST /categories - শুধু ADMIN ক্যাটাগরি তৈরি করতে পারে |
| 14 | Export router as adminRoutes | রাউটারকে adminRoutes হিসেবে এক্সপোর্ট |

---

## 15. Seed Script / সিড স্ক্রিপ্ট

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

| Line | English | বাংলা |
|------|---------|-------|
| 1 | Load environment variables at the top | উপরে এনভায়রনমেন্ট ভেরিয়েবল লোড করে |
| 2 | Import the Prisma PostgreSQL adapter | Prisma PostgreSQL অ্যাডাপ্টার ইম্পোর্ট |
| 3 | Import the generated Prisma client | জেনারেটেড Prisma ক্লায়েন্ট ইম্পোর্ট |
| 4 | Import bcryptjs for password hashing | পাসওয়ার্ড হ্যাশিংয়ের জন্য bcryptjs ইম্পোর্ট |
| 6 | Get database connection string from environment (with non-null assertion) | এনভায়রনমেন্ট থেকে ডাটাবেস কানেকশন স্ট্রিং (নন-নাল অ্যাসার্শন সহ) |
| 7 | Create PostgreSQL adapter | PostgreSQL অ্যাডাপ্টার তৈরি |
| 8 | Create Prisma client with the adapter | অ্যাডাপ্টার সহ Prisma ক্লায়েন্ট তৈরি |
| 10 | Define the main seed function | প্রধান সিড ফাংশন সংজ্ঞায়িত |
| 11 | Hash the default admin password "admin123" with 10 salt rounds | ডিফল্ট অ্যাডমিন পাসওয়ার্ড "admin123" 10 সল্ট রাউন্ড দিয়ে হ্যাশ |
| 13 | Upsert admin user (create if not exists, update nothing if exists) | অ্যাডমিন ইউজার আপসার্ট (না থাকলে তৈরি, থাকলে কিছু আপডেট না) |
| 14 | Look up admin by unique email | ইউনিক ইমেইল দিয়ে অ্যাডমিন খোঁজে |
| 15 | Empty update object - don't modify existing admin | খালি আপডেট অবজেক্ট - বিদ্যমান অ্যাডমিন পরিবর্তন করবে না |
| 16-21 | Create the admin user with name, email, hashed password, and ADMIN role | নাম, ইমেইল, হ্যাশ করা পাসওয়ার্ড এবং ADMIN রোল দিয়ে অ্যাডমিন ইউজার তৈরি |
| 24 | Log the email of the seeded admin | সিড করা অ্যাডমিনের ইমেইল লগ করে |
| 27 | Call main function and disconnect Prisma on success | main ফাংশন কল করে এবং সফল হলে Prisma ডিসকানেক্ট করে |
| 28-32 | Catch any error, log it, disconnect Prisma, and exit with failure code | যেকোনো এরর ক্যাচ করে, লগ করে, Prisma ডিসকানেক্ট করে এবং ব্যর্থ কোড দিয়ে বেরিয়ে যায় |

---

## Architecture Summary / আর্কিটেকচার সারাংশ

### Design Pattern: Modular MVC-like / মডুলার MVC-এর মতো ডিজাইন প্যাটার্ন

```
Route (router)  ->  Middleware (validation, auth)  ->  Controller  ->  Service  ->  Database (Prisma)
    |                         |                          |              |
   Defines URL               Validates/Protects        Handles       Business logic
   and HTTP method            before reaching           request/       + DB queries
                              the controller            response
```

### Request Flow Example: Create a Booking

```
1. Customer sends POST /api/bookings with { serviceId }
2. Route matches -> auth("CUSTOMER") middleware runs
   -> Extracts JWT from cookie or Authorization header
   -> Verifies token -> checks user exists and is not banned
   -> Attaches { id, name, email, role } to req.user
3. validateRequest(createBookingRules) middleware runs
   -> Validates body has serviceId (required)
4. bookingController.create runs
   -> Calls bookingService.createBooking({ customerId, serviceId, scheduleDate })
5. bookingService.createBooking runs
   -> Finds the service -> gets technicianId from service
   -> Creates booking in database with customerId, serviceId, technicianId
   -> Returns booking with related data
6. Controller sends 201 response with booking data
```

### Module Organization / মডিউল সংগঠন

```
src/modules/<module-name>/
  - <module-name>.validation.ts  ->  Input validation rules
  - <module-name>.service.ts     ->  Business logic + DB queries
  - <module-name>.controller.ts  ->  Request/response handling
  - <module-name>.route.ts       ->  Route definitions + middleware
```

Each module is **self-contained** — it has its own validation, service, controller, and routes. This makes the code easier to navigate and maintain.

প্রতিটি মডিউল **স্বয়ংসম্পূর্ণ** — এর নিজস্ব ভ্যালিডেশন, সার্ভিস, কন্ট্রোলার এবং রুট রয়েছে। এটি কোড নেভিগেট এবং রক্ষণাবেক্ষণ সহজ করে তোলে।

---

## Key Takeaways / মূল শিক্ষা

| Concept | English | বাংলা |
|---------|---------|-------|
| **ES Modules** | `import`/`export` instead of `require` | `require` এর পরিবর্তে `import`/`export` |
| **Middleware** | Functions that run before route handler | ফাংশন যা রুট হ্যান্ডলারের আগে চলে |
| **JWT** | JSON Web Token for stateless authentication | স্টেটলেস অথেনটিকেশনের জন্য JSON Web Token |
| **bcryptjs** | Password hashing library | পাসওয়ার্ড হ্যাশিং লাইব্রেরি |
| **Prisma** | Type-safe database ORM | টাইপ-সেফ ডাটাবেস ORM |
| **Stripe** | Payment processing API | পেমেন্ট প্রসেসিং API |
| **catchAsync** | Wrapper that catches async errors | async এরর ক্যাচ করার র্যাপার |
| **sendResponse** | Standardized success response | স্ট্যান্ডার্ডাইজড সাকসেস রেসপন্স |
| **AppError** | Custom error with HTTP status code | HTTP স্ট্যাটাস কোড সহ কাস্টম এরর |
| **upsert** | Update + Insert (create or update) | আপডেট + ইনসার্ট (তৈরি বা আপডেট) |
| **validateRequest** | Custom validation middleware | কাস্টম ভ্যালিডেশন মিডলওয়্যার |
| **jwtUtils** | Token creation and verification utility | টোকেন তৈরি ও ভেরিফিকেশন ইউটিলিটি |
| **Singleton** | Single Prisma/Stripe instance reused across app | একক Prisma/Stripe ইনস্ট্যান্স অ্যাপ জুড়ে পুনরায় ব্যবহৃত |

---

*Happy coding! শিখতে থাকুন!*
