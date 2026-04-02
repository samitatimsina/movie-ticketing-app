"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config/config");
const db_1 = __importDefault(require("./config/db"));
const show_routes_1 = __importDefault(require("./modules/show/show.routes"));
const auth_route_1 = __importDefault(require("./modules/auth/auth.route"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const socketHandlers_1 = require("./socket/socketHandlers");
const booking_route_1 = __importDefault(require("./modules/booking/booking.route"));
const startServer = async () => {
    const port = config_1.config.port;
    // Connect to database
    await (0, db_1.default)();
    // Create HTTP server
    const httpServer = (0, http_1.createServer)(app_1.default);
    // Setup Socket.IO
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    // Use centralized socket handlers
    io.on("connection", (socket) => {
        console.log("🔌 Socket connected:", socket.id);
        (0, socketHandlers_1.registerSocketHandlers)(socket, io);
    });
    // Routes
    app_1.default.use("/api/v1/shows", show_routes_1.default);
    app_1.default.use("/api/v1/auth", auth_route_1.default);
    app_1.default.use("/api/v1/booking", booking_route_1.default);
    // Start server
    httpServer.listen(port, () => {
        console.log(`🚀 Listening on port: ${port}`);
    });
};
startServer();
