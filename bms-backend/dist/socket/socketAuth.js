"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const socketAuthMiddleware = (socket, next) => {
    try {
        console.log("SOCKET AUTH TOKEN:", socket.handshake.auth?.token);
        const token = socket.handshake.auth?.token;
        if (!token) {
            console.log("NO TOKEN");
            return next(new Error("No token found"));
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.accessTokenSecret);
        console.log("TOKEN VERIFIED");
        socket.data.user = decoded;
        next();
    }
    catch (err) {
        console.log("AUTH ERROR:", err);
        return next(new Error("Socket auth failed"));
    }
};
exports.socketAuthMiddleware = socketAuthMiddleware;
