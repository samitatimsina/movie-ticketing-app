"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.verifyOTP = exports.sendOtp = exports.login = exports.signup = void 0;
const OtpService = __importStar(require("./otp.service"));
const UserService = __importStar(require("../user/user.service"));
const TokenService = __importStar(require("./token.sevice"));
const http_errors_1 = __importDefault(require("http-errors"));
const utils_1 = require("../../utils");
const auth_service_1 = require("./auth.service");
const user_model_1 = require("../user/user.model");
const signup = async (req, res) => {
    try {
        const result = await (0, auth_service_1.signupUser)(req.body);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await (0, auth_service_1.loginUser)(email, password);
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: result.user,
            // ✅ IMPORTANT: frontend will store this
            accessToken: result.token,
        });
    }
    catch (err) {
        res.status(401).json({
            success: false,
            message: err.message,
        });
    }
};
exports.login = login;
const sendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return next(new http_errors_1.default.BadRequest("Email is required"));
        }
        if (!(0, utils_1.isValidEmail)(email)) {
            return next(new http_errors_1.default.BadRequest("Invalid email format"));
        }
        const otp = OtpService.generateOTP();
        const ttl = 1000 * 60 * 2;
        const expires = Date.now() + ttl;
        const data = `${email}.${otp}.${expires}`;
        const hashedOTP = OtpService.hashOTP(data);
        await OtpService.sendOTPtoEmail(email, otp);
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            hash: `${hashedOTP}.${expires}`,
            email,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.sendOtp = sendOtp;
const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp, hash } = req.body;
        if (!email || !otp || !hash) {
            return next(new http_errors_1.default.BadRequest("All fields are required"));
        }
        const [hashedOTP, expires] = hash.split(".");
        if (Date.now() > Number(expires)) {
            return next(new http_errors_1.default.Gone("OTP expired"));
        }
        const data = `${email}.${otp}.${expires}`;
        const isValid = OtpService.verifyOTP(hashedOTP, data);
        if (!isValid) {
            return next(new http_errors_1.default.Unauthorized("Invalid OTP"));
        }
        let user = await UserService.getUserByEmail(email);
        if (!user) {
            user = await UserService.createUser({
                email,
                name: "New User",
            });
        }
        const updatedUser = await user_model_1.UserModel.findByIdAndUpdate(user._id, { activateUser: true }, { new: true });
        // ✅ Generate tokens
        const { accessToken, refreshToken } = TokenService.generateToken({
            _id: String(user._id),
            email: user.email,
        });
        await TokenService.storeRefreshToken(String(user._id), refreshToken);
        // ❌ REMOVE COOKIES COMPLETELY
        res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            user: updatedUser,
            // ✅ send tokens to frontend
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyOTP = verifyOTP;
const logout = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            await TokenService.deleteRefreshToken(token);
        }
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
