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
