"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const socketHandlers_1 = require("./socketHandlers");
const initSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*", // adjust in production
        },
    });
    io.on("connection", (socket) => {
        console.log(`🔌 New socket connected: ${socket.id}`);
        (0, socketHandlers_1.registerSocketHandlers)(socket, io);
    });
    return io;
};
exports.initSocket = initSocket;
