import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes";
import { globalErrorHandler } from "./middlewares/error.middleware";
import paymentRouter from "./routes/payment.routes";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//All routes
app.use("/api/v1",router);
app.use("/api/v1/payment", paymentRouter);


// Global error handler (MUST be after all routes)
app.use(globalErrorHandler);

app.get("/", (_, res) => {
  res.json({
    message: "Welcome to Movietickets API",
  });
});
app.get("/test-cookie", (req, res) => {
  console.log("RAW HEADER COOKIE:", req.headers.cookie);
  console.log("PARSED COOKIE:", req.cookies);

  res.json({ cookies: req.cookies });
});

export default app;
