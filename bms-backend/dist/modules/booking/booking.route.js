"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("./booking.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
/**
 * CREATE BOOKING
 */
router.post("/create", auth_1.verifyUser, booking_controller_1.createBooking);
/**
 * PAYMENT INITIATION
 */
router.post("/esewa", auth_1.verifyUser, booking_controller_1.proceedToEsewa);
/**
 * PAYMENT VERIFY
 */
router.post("/verify/:bookingId", auth_1.verifyUser, booking_controller_1.verifyPayment);
/**
 * USER BOOKING HISTORY
 */
router.get("/user", auth_1.verifyUser, booking_controller_1.getUserBookings);
/**
 * FALLBACK PAGES (OK to keep public)
 */
router.get("/payment/success", (req, res) => {
    const bookingId = req.query.bookingId;
    res.send(`<h1>Payment Successful!</h1><p>${bookingId}</p>`);
});
router.get("/payment/fail", (req, res) => {
    const bookingId = req.query.bookingId;
    res.send(`<h1>Payment Failed!</h1><p>${bookingId}</p>`);
});
exports.default = router;
