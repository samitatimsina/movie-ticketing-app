import { Request, Response, RequestHandler } from "express";
import { BookingModel } from "./booking.model";
import { markPaymentSuccess } from "./booking.service";
import { sendTicketEmail } from "../../services/email.service";
import { UserModel } from "../user/user.model";

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

    const existingBooking = await BookingModel.findOne({
      show: showId,
      seats: { $in: seats },
      paymentStatus: "completed",
    });

    if (existingBooking) {
      res.status(400).json({
        success: false,
        message: "One or more seats already booked",
      });
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

// VERIFY PAYMENT (FIXED)
export const verifyPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { bookingId } = req.params;

    // 1. update booking
const booking = await BookingModel.findByIdAndUpdate(
  bookingId,
  {
    paymentStatus: "completed",
  },
  { new: true }
).populate({
  path: "show",
  populate: [
    { path: "movie" },
    { path: "theater" },
  ],
});
    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });
      return;
    }
    console.log("Booking created successfully:", booking);

    // 2. get user
    const user = await UserModel.findById(booking.user);

    // 3. send email
    if (user?.email && booking?.show) {
  const show: any = booking.show;

  await sendTicketEmail({
    to: user.email,
    movie: show.movie?.title,
    // theater?: show.theater?.name,
    seats: booking.seats,
    showTime: show.startTime,
    bookingId: booking._id.toString(),
  });
}

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
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