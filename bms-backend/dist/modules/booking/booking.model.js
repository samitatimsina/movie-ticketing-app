"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookingSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    movie: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
    },
    show: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Show",
        required: true,
    },
    theater: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Theater",
        required: true,
    },
    seats: [
        {
            row: String,
            number: Number,
            type: String,
            price: Number,
            id: String,
        }
    ],
    totalAmount: Number,
    bookingStatus: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    bookingId: {
        type: String,
        unique: true,
    },
}, {
    timestamps: true,
});
exports.BookingModel = mongoose_1.default.model("Booking", bookingSchema);
