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
exports.logout = exports.verifyOTP = exports.sendOtp = void 0;
const OtpService = __importStar(require("./otp.service"));
const UserService = __importStar(require("../user/user.service"));
const TokenService = __importStar(require("./token.sevice"));
const http_errors_1 = __importDefault(require("http-errors"));
const utils_1 = require("../../utils");
const sendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            const err = new http_errors_1.default.BadRequest("Email is required");
            return next(err);
        }
        if (!(0, utils_1.isValidEmail)(email)) {
            const err = new http_errors_1.default.BadRequest("Invalid email format");
            return next(err);
        }
        //create otp
        const otp = OtpService.generateOTP();
        //hash otp
        const ttl = 1000 * 60 * 2;
        const expires = Date.now() + ttl;
        const data = `${email}.${otp}.${expires}`;
        const hashedOTP = OtpService.hashOTP(data);
        //send otp to user email
        try {
            await OtpService.sendOTPtoEmail(email, otp);
        }
        catch (error) {
            const err = new http_errors_1.default.InternalServerError("Error sending otp to email");
            return next(err);
        }
        //respond to the client
        res.json({
            hash: `${hashedOTP}.${expires}`,
            email, msg: "OTP sent to email successfully!!"
        });
    }
    catch (error) {
        next(error);
    }
};
exports.sendOtp = sendOtp;
const verifyOTP = async (req, res, next) => {
    const { email, otp, hash } = req.body;
    if (!email || !otp || !hash) {
        const err = new http_errors_1.default.BadRequest("All fields are required");
        return next(err);
    }
    //otp verification
    const [hashedOTP, expires] = hash.split(".");
    if (Date.now() > +expires) {
        const err = new http_errors_1.default.Gone("OTP expired");
        return next(err);
    }
    const data = `${email}.${otp}.${expires}`;
    const isValid = OtpService.verifyOTP(hashedOTP, data);
    if (!isValid) {
        const err = new http_errors_1.default.Unauthorized("Invalid otp");
        return next(err);
    }
    //find or create new user
    let user;
    try {
        user = await UserService.getUserByEmail(email);
        if (!user) {
            user = await UserService.createUser({
                email,
                name: "New User"
            });
        }
    }
    catch (error) {
        return next(error);
    }
    //generate token
    const { accessToken, refreshToken } = TokenService.generateToken({ _id: user._id, email: user.email });
    //store refresh token in DB 
    await TokenService.storeRefreshToken(user._id, refreshToken);
    //sending token in cookies
    res.cookie('accessToken', accessToken, {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    });
    res.cookie('refreshToken', refreshToken, {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    });
    res.json({ auth: true, user });
};
exports.verifyOTP = verifyOTP;
const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        //delete refresh token from db
        await TokenService.deleteRefreshToken(refreshToken);
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({ msg: "Logged out successfully" }).status(200);
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
