import { Router, Request, Response } from "express";
import { BookingModel } from "../modules/booking/booking.model";

const router = Router();

router.get("/:bookingId", (req: Request, res: Response) => {
  const { bookingId } = req.params;

  const html = `
  <html>
    <body style="font-family:Arial;text-align:center;padding-top:50px">
      <h2>Mock Payment Page</h2>

      <form method="POST" action="/api/v1/payment/verify/${bookingId}">
        <input type="text" placeholder="Card Number" required /><br/><br/>
        <input type="text" placeholder="Name on Card" required /><br/><br/>
        <input type="text" placeholder="Expiry Date" required /><br/><br/>
        <input type="text" placeholder="CVV" required /><br/><br/>

        <button type="submit" style="padding:10px 20px;background:green;color:white;">
          Pay Now
        </button>
      </form>
    </body>
  </html>
  `;

  res.send(html);
});

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

    res.redirect("http://localhost:5173/booking-history");
  } catch (err) {
    console.error(err);
    res.status(500).send("Payment failed");
  }
});

export default router;