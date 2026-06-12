import { Router, Request, Response } from "express";
import { BookingModel } from "../modules/booking/booking.model";

const router = Router();

router.post("/verify/:bookingId", async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;

    const booking = await BookingModel.findById(bookingId);

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
  } catch (err) {
    console.error(err);
    res.status(500).send("Payment failed");
  }
});

export default router;