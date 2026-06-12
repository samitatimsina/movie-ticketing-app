import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import router from "./routes";
import { globalErrorHandler } from "./middlewares/error.middleware";
import paymentRouter from "./routes/payment.routes";

dotenv.config();

const app = express();

// ✅ CORS (keep this for frontend communication)
const allowedOrigins = [
  "http://localhost:5173",
  "https://movie-ticketing-app.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

// ✅ body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// All routes
app.use("/api/v1", router);
app.use("/api/v1/payment", paymentRouter);

// Home route
app.get("/", (_, res) => {
  res.json({
    message: "Welcome to Movietickets API",
  });
});

// ❌ REMOVE cookie test route (no longer needed)
// app.get("/test-cookie", ...);

// Global error handler
app.use(globalErrorHandler);

export default app;