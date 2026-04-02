"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("./booking.controller");
const user_controller_1 = require("../user/user.controller");
const router = (0, express_1.Router)();
// CREATE
router.post("/create", user_controller_1.verifyUser, booking_controller_1.createBooking);
// VERIFY
router.post("/verify/:bookingId", booking_controller_1.verifyPayment);
// GET BOOKINGS (🔥 IMPORTANT)
router.get("/user", user_controller_1.verifyUser, booking_controller_1.getUserBookings);
// ESEWA
router.post("/pay/esewa", booking_controller_1.proceedToEsewa);
// fallback pages
router.get("/payment/success", (req, res) => {
    const bookingId = req.query.bookingId;
    res.send(`<h1>Payment Successful!</h1><p>${bookingId}</p>`);
});
router.get("/payment/fail", (req, res) => {
    const bookingId = req.query.bookingId;
    res.send(`<h1>Payment Failed!</h1><p>${bookingId}</p>`);
});
exports.default = router;
