import { Request, Response, RequestHandler } from "express";
import { BookingModel } from "./booking.model";
import { markPaymentSuccess } from "./booking.service";
import { sendTicketEmail } from "../../services/email.service";
import { UserModel } from "../user/user.model";
import Show from "../show/show.model";
import axios from "axios";
// CREATE BOOKING
export const createBooking: RequestHandler = async (req, res) => {
  try {
    console.log("Booking request body:", req.body);

    const { showId, seats, totalAmount } = req.body;
    // @ts-ignore
    const userId = req.user?.id;
    console.log("USER ID:", userId);

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!seats || seats.length === 0) {
      res.status(400).json({ message: "No seats selected" });
      return;
    }
    const seatIds = seats.map((s: any) => s.id);

const existingBooking = await BookingModel.findOne({
  show: showId,
  paymentStatus: "completed",
  "seats.id": { $in: seatIds },
});

    if (existingBooking) {
      res.status(400).json({
        success: false,
        message: "One or more seats already booked",
      });
      return;
    }

    const show = await Show.findById(showId)
  .populate("movie")
  .populate("theater");

if (!show) {
  res.status(404).json({
    success: false,
    message: "Show not found",
  });
  return;
}


const booking = await BookingModel.create({
  user: userId,
  movie: show.movie._id,
  theater: show.theater._id,
  show: showId,
  seats: seatIds,
  totalAmount,

  bookingStatus: "pending",
  paymentStatus: "pending",

  bookingId: `BOOK-${Date.now()}`,

  expiresAt: new Date(Date.now() + 5 * 60 * 1000),
});
console.log("SEATS TYPE:", typeof seats);
console.log("IS ARRAY:", Array.isArray(seats));
console.log("SEATS:", seats);

    res.json({
      success: true,
      bookingId: booking._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

// VERIFY PAYMENT (FIXED)
export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;

    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    if (booking.paymentStatus === "completed") {
      res.json({ success: true, message: "Already verified" });
      return;
    }

    // MOCK PAYMENT SUCCESS
    booking.paymentStatus = "completed";
    booking.bookingStatus = "confirmed";

    await booking.save();

    res.json({
      success: true,
      message: "Mock payment verified successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

// GET BOOKINGS
export const getUserBookings: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;

    const bookings = await BookingModel.find({
  user: userId,
    }).populate({
      path: "show",
      populate: [{ path: "movie" }, { path: "theater" }],
    });
    if (!userId) {
   res.status(401).json({ message: "Unauthorized" });
   return;
}

    const formatted = bookings.map((b: any) => ({
      _id: b._id,
      movie: b.show?.movie,
      theater: b.show?.theater,
      seats: b.seats,
      quantity: b.seats?.length || 0,
      ticket: b.totalAmount,
      fee: 0,
      total: b.totalAmount,
      bookingTime: b.createdAt,
      paymentMethod: "Esewa",
      datetime: b.show?.startTime,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// ESEWA
export const proceedToEsewa: RequestHandler = async (req, res) => {
  const { bookingId, totalAmount } = req.body;

  if (!bookingId || !totalAmount) {
    res.status(400).json({ message: "Missing data" });
    return;
  }

  // simulate "payment gateway redirect"
  const mockUrl = `http://localhost:5173/payment/mock?bookingId=${bookingId}&amount=${totalAmount}`;

  res.json({
    success: true,
    redirectUrl: mockUrl,
    message: "Redirecting to mock payment gateway",
  });
};