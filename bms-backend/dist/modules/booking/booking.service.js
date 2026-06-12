"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markPaymentSuccess = void 0;
const booking_model_1 = require("./booking.model");
const markPaymentSuccess = async (bookingId) => {
    return await booking_model_1.BookingModel.findByIdAndUpdate(bookingId, {
        paymentStatus: "completed",
        status: "paid",
    }, { new: true }).populate({
        path: "show",
        populate: [{ path: "movie" }, { path: "theater" }],
    });
};
exports.markPaymentSuccess = markPaymentSuccess;
