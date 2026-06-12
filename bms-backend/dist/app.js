"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// ✅ CORS (keep this for frontend communication)
const allowedOrigins = [
    "http://localhost:5173",
    "https://movie-ticketing-app.vercel.app"
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
// ✅ body parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// All routes
app.use("/api/v1", routes_1.default);
app.use("/api/v1/payment", payment_routes_1.default);
// Home route
app.get("/", (_, res) => {
    res.json({
        message: "Welcome to Movietickets API",
    });
});
// ❌ REMOVE cookie test route (no longer needed)
// app.get("/test-cookie", ...);
// Global error handler
app.use(error_middleware_1.globalErrorHandler);
exports.default = app;
