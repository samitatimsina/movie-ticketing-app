"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
// import { config } from "./config/config";
const db_1 = __importDefault(require("./config/db"));
const show_routes_1 = __importDefault(require("./modules/show/show.routes"));
const auth_route_1 = __importDefault(require("./modules/auth/auth.route"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const socketHandlers_1 = require("./socket/socketHandlers");
const booking_route_1 = __importDefault(require("./modules/booking/booking.route"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const socketAuth_1 = require("./socket/socketAuth");
const startServer = async () => {
    const port = process.env.PORT || 9000;
    // Connect to database
    await (0, db_1.default)();
    // Create HTTP server
    const httpServer = (0, http_1.createServer)(app_1.default);
    // Setup Socket.IO
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "https://movie-ticketing-app.vercel.app/",
            methods: ["GET", "POST"],
            credentials: false,
        },
        transports: ["polling", "websocket"],
    });
    io.use(socketAuth_1.socketAuthMiddleware);
    // Use centralized socket handlers
    io.on("connection", (socket) => {
        console.log("TOKEN:", socket.handshake.auth?.token);
        console.log("🔌 Socket connected:", socket.id);
        (0, socketHandlers_1.registerSocketHandlers)(socket, io);
        console.log("🔥 registerSocketHandlers called");
        socket.onAny((event, ...args) => {
            console.log("EVENT:", event, args);
        });
    });
    // Routes
    app_1.default.use("/api/v1/shows", show_routes_1.default);
    app_1.default.use("/api/v1/auth", auth_route_1.default);
    app_1.default.use("/api/v1/booking", booking_route_1.default);
    app_1.default.use("/api/v1/payment", payment_routes_1.default);
    // Start server
    httpServer.listen(port, () => {
        console.log(`🚀 Listening on port: ${port}`);
    });
};
startServer();
