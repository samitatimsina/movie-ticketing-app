"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_model_1 = require("../modules/booking/booking.model");
const router = (0, express_1.Router)();
router.post("/verify/:bookingId", async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await booking_model_1.BookingModel.findById(bookingId);
        if (!booking) {
            res.status(404).send("Booking not found");
            return;
        }
        booking.paymentStatus = "completed";
        booking.bookingStatus = "confirmed";
        await booking.save();
        res.json({
            success: true,
            message: "Payment successful"
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Payment failed");
    }
});
exports.default = router;
