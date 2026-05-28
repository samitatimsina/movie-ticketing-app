import { Router, Request, Response } from "express";
import {
  createBooking,
  proceedToEsewa,
  verifyPayment,
  getUserBookings,
} from "./booking.controller";

import { verifyUser } from "../../middlewares/auth";

const router = Router();

/**
 * CREATE BOOKING
 */
router.post("/create", verifyUser, createBooking);

/**
 * PAYMENT INITIATION
 */
router.post("/esewa", verifyUser, proceedToEsewa);

/**
 * PAYMENT VERIFY
 */
router.post("/verify/:bookingId", verifyUser, verifyPayment);

/**
 * USER BOOKING HISTORY
 */
router.get("/user", verifyUser, getUserBookings);

/**
 * FALLBACK PAGES (OK to keep public)
 */
router.get("/payment/success", (req: Request, res: Response) => {
  const bookingId = req.query.bookingId as string;
  res.send(`<h1>Payment Successful!</h1><p>${bookingId}</p>`);
});

router.get("/payment/fail", (req: Request, res: Response) => {
  const bookingId = req.query.bookingId as string;
  res.send(`<h1>Payment Failed!</h1><p>${bookingId}</p>`);
});

export default router;