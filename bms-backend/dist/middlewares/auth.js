"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const verifyUser = (req, res, next) => {
    try {
        // ✅ Get token from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];
        console.log("Authorization Header:", authHeader);
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided",
            });
            return;
        }
        console.log("config.accessTokenSecret:", config_1.config.accessTokenSecret);
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.accessTokenSecret);
        console.log("DECODED:", decoded);
        // attach user to request
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log("JWT ERROR:", error);
        res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid token",
        });
        return;
    }
};
exports.verifyUser = verifyUser;
