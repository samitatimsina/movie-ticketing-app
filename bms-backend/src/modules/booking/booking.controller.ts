import { RequestHandler } from "express";
import { BookingModel } from "./booking.model";
import Show from "../show/show.model";
import mongoose from "mongoose";
import { seatLocks } from "../../socket/socketHandlers"; // adjust path if needed

export const createBooking: RequestHandler = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { showId, seats, totalAmount } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      await session.abortTransaction();
      session.endSession();
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!seats || seats.length === 0) {
      await session.abortTransaction();
      session.endSession();
      res.status(400).json({ message: "No seats selected" });
      return;
    }

    const seatIds = seats.map((s: any) => s.id);
    // ===============================
// SOCKET LOCK VALIDATION (IMPORTANT)
// ===============================
const showLocks = seatLocks.get(showId);

if (showLocks) {
  const now = Date.now();

  const lockedByOthers: string[] = [];

  for (const seatId of seatIds) {
    const lock = showLocks.get(seatId);

    if (lock && lock.expiresAt > now && lock.userId !== userId) {
      lockedByOthers.push(seatId);
    }
  }

  if (lockedByOthers.length > 0) {
    await session.abortTransaction();
    session.endSession();

     res.status(409).json({
      success: false,
      message: "Some seats are currently locked by another user",
      seats: lockedByOthers,
    });
    return;
  }
}

    // 🔥 STRONG CHECK (pending + completed both blocked)
    const activeBooking = await BookingModel.findOne({
      show: showId,
      paymentStatus: { $in: ["pending", "completed"] },
      "seats.id": { $in: seatIds },
    }).session(session);

    if (activeBooking) {
      await session.abortTransaction();
      session.endSession();

      res.status(400).json({
        success: false,
        message: "Seats already reserved",
      });
      return;
    }

    const show = await Show.findById(showId)
      .populate("movie")
      .populate("theater");

    if (!show) {
      await session.abortTransaction();
      session.endSession();

      res.status(404).json({
        success: false,
        message: "Show not found",
      });
      return;
    }

    // 🔥 CREATE BOOKING (inside transaction)
    const [booking] = await BookingModel.create(
      [
        {
          user: userId,
          movie: (show as any).movie._id,
          theater: (show as any).theater._id,
          show: showId,
          seats: seatIds,
          totalAmount,

          bookingStatus: "pending",
          paymentStatus: "pending",

          bookingId: `BOOK-${Date.now()}`,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      bookingId: booking._id,
      totalAmount: booking.totalAmount,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error(err);
    res.status(500).json({ success: false });
  }
};

// ================================
// VERIFY PAYMENT (MOCK)
// ================================
export const verifyPayment: RequestHandler = async (req, res) => {
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

    booking.paymentStatus = "completed";
    booking.bookingStatus = "confirmed";

    await booking.save();

    res.json({
      success: true,
      message: "Mock payment verified successfully",
      bookingId: booking._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

// ================================
// GET USER BOOKINGS
// ================================
export const getUserBookings: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const bookings = await BookingModel.find({ user: userId }).populate({
      path: "show",
      populate: [{ path: "movie" }, { path: "theater" }],
    });

    const formatted = bookings.map((b: any) => ({
      _id: b._id,
      movie: b.show?.movie,
      theater: b.show?.theater,
      seats: b.seats,
      quantity: b.seats?.length || 0,

      ticket: b.totalAmount,
      totalAmount: b.totalAmount,

      bookingTime: b.createdAt,
      datetime: b.show?.startTime,

      paymentStatus: b.paymentStatus,
      bookingStatus: b.bookingStatus,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// ================================
// MOCK ESEWA REDIRECT
// ================================
export const proceedToEsewa: RequestHandler = async (req, res) => {
  const { bookingId, totalAmount } = req.body;

  if (!bookingId || !totalAmount) {
    res.status(400).json({ message: "Missing data" });
    return;
  }

  const mockUrl = `http://localhost:5173/payment/mock?bookingId=${bookingId}&amount=${totalAmount}`;

  res.json({
    success: true,
    redirectUrl: mockUrl,
  });
};