import { Router, Request, Response } from "express";
import {
  createBooking,
  proceedToEsewa,
  verifyPayment,
  getUserBookings,
} from "./booking.controller";
import { verifyUser } from "../user/user.controller";
const router = Router();

// CREATE
router.post("/create",verifyUser, createBooking);

// VERIFY
router.post("/verify/:bookingId", verifyPayment);

// GET BOOKINGS (🔥 IMPORTANT)
router.get("/user",verifyUser, getUserBookings);

// ESEWA
router.post("/pay/esewa", proceedToEsewa);

// fallback pages
router.get("/payment/success", (req: Request, res: Response) => {
  const bookingId = req.query.bookingId as string;
  res.send(`<h1>Payment Successful!</h1><p>${bookingId}</p>`);
});

router.get("/payment/fail", (req: Request, res: Response) => {
  const bookingId = req.query.bookingId as string;
  res.send(`<h1>Payment Failed!</h1><p>${bookingId}</p>`);
});

export default router;