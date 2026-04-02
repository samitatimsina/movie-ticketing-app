"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookingSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    show: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Show", required: true },
    seats: [{ type: String, required: true }],
    totalAmount: { type: Number, required: true },
    // extra fields for frontend
    ticket: { type: Number, default: 0 },
    fee: { type: Number, default: 0 },
    paymentMethod: { type: String, default: "Esewa" },
    status: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
}, { timestamps: true });
exports.BookingModel = mongoose_1.default.model("Booking", bookingSchema);
