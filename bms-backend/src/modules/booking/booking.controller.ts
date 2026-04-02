import { Request, Response, RequestHandler } from "express";
import { BookingModel } from "./booking.model";

// CREATE
export const createBooking: RequestHandler = async (req, res) => {
  try {
    console.log("Booking request body:", req.body);
    const { showId, seats, totalAmount } = req.body;

    // @ts-ignore
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!seats || seats.length === 0) {
      res.status(400).json({ message: "No seats selected" });
      return;
    }

    const booking = await BookingModel.create({
      user: userId,
      show: showId,
      seats,
      totalAmount,
    });

    res.json({
      success: true,
      bookingId: booking._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

// VERIFY
export const verifyPayment: RequestHandler = async (req, res) => {
  try {
    const { bookingId } = req.params;

    await BookingModel.findByIdAndUpdate(bookingId, {
      paymentStatus: "completed",
      status: "paid",
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

// GET BOOKINGS
export const getUserBookings: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    const bookings = await BookingModel.find({
      user: userId,
      paymentStatus: "completed",
    })
      .populate({
        path: "show",
        populate: [{ path: "movie" }, { path: "theater" }],
      })
      .sort({ createdAt: -1 });

    const formatted = bookings.map((b: any) => ({
      _id: b._id,
      movie: b.show?.movie,
      theater: b.show?.theater,
      seats: b.seats,
      quantity: b.seats.length,
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

  const esewaURL = "https://esewa.com.np/epay/main";

  const params = {
    amt: totalAmount,
    psc: 0,
    pdc: 0,
    tAmt: totalAmount,
    pid: bookingId,
    scd: "YOUR_MERCHANT_CODE",
    su: `http://localhost:5173/payment/success?bookingId=${bookingId}`,
    fu: `http://localhost:5173/payment/fail?bookingId=${bookingId}`,
  };

  const queryString = Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  res.redirect(`${esewaURL}?${queryString}`);
};