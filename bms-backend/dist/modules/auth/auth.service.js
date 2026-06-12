"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.signupUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../user/user.model");
const config_1 = require("../../config/config");
const signupUser = async (payload) => {
    const { name, email, password } = payload;
    const existingUser = await user_model_1.UserModel.findOne({ email: payload.email });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await user_model_1.UserModel.create({
        name: name,
        email: email,
        password: hashedPassword,
        role: "user",
        activateUser: true,
    });
    return user;
};
exports.signupUser = signupUser;
const loginUser = async (email, password) => {
    const user = await user_model_1.UserModel.findOne({ email }).select("+password");
    if (!user) {
        throw new Error("User not found");
    }
    if (!user.password) {
        throw new Error("Password login not enabled for this user");
    }
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    if (!user.activateUser) {
        throw new Error("User not activated");
    }
    const token = jsonwebtoken_1.default.sign({
        id: user._id,
        email: user.email,
        role: user.role,
    }, config_1.config.accessTokenSecret, {
        expiresIn: "1d",
    });
    console.log("SECRET:", config_1.config.accessTokenSecret);
    return {
        token,
        user,
    };
};
exports.loginUser = loginUser;
