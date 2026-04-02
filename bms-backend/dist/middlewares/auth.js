"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: "Unauthorized: No token provided"
            });
            return;
        }
        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || "your_secret_key"; // put a strong secret in .env
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded; // attach user info to request
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
        return;
    }
};
exports.verifyUser = verifyUser;
