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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.updateUserProfile = exports.activateUser = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const UserService = __importStar(require("./user.service"));
const user_model_1 = require("./user.model");
/* ---------------- CREATE USER ---------------- */
const createUser = async (req, res, next) => {
    try {
        const user = await UserService.createUser(req.body);
        res.status(201).json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
};
exports.createUser = createUser;
/* ---------------- GET ALL USERS ---------------- */
const getAllUsers = async (req, res, next) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;
/* ---------------- GET USER BY ID ---------------- */
const getUserById = async (req, res, next) => {
    try {
        const user = await UserService.getUserById(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserById = getUserById;
/* ---------------- ACTIVATE USER ---------------- */
const activateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const updatedUser = await user_model_1.UserModel.findByIdAndUpdate(userId, { activateUser: true }, { new: true });
        if (!updatedUser) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({ success: true, data: updatedUser });
    }
    catch (error) {
        next(error);
    }
};
exports.activateUser = activateUser;
/* ---------------- UPDATE PROFILE (LOGGED USER) ---------------- */
const updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user?._id; // ✅ consistent
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const updatedUser = await user_model_1.UserModel.findByIdAndUpdate(userId, { $set: req.body }, { new: true, runValidators: true });
        if (!updatedUser) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({ success: true, data: updatedUser });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserProfile = updateUserProfile;
/* ---------------- GET PROFILE ---------------- */
const getUserProfile = async (req, res, next) => {
    try {
        const userId = req.user?._id; // ✅ FIXED (was req.user?.id)
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const user = await user_model_1.UserModel.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        if (!user.activateUser) {
            res.status(403).json({ message: "User not activated" });
            return;
        }
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserProfile = getUserProfile;
