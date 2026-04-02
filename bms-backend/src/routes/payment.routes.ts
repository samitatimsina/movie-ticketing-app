import { Router, Request, Response } from "express";

const router = Router();

// POST route for initiating payment
router.post("/pay/esewa", (req: Request, res: Response): void => {
  const { bookingId, totalAmount } = req.body as { bookingId: string; totalAmount: number };
  if (!bookingId || !totalAmount) {
    res.status(400).json({ message: "Booking ID and totalAmount are required" });
    return;
  }

  // Redirect to local test page instead of eSewa
  res.redirect(`http://localhost:5173/payment/test?bookingId=${bookingId}&amount=${totalAmount}`);
});

// GET route to show mock payment page (for testing only)
router.get("/payment/test", (req: Request, res: Response) => {
  const { bookingId, amount } = req.query;
  res.send(`
    <h1>Payment Test Page</h1>
    <p>Booking ID: ${bookingId}</p>
    <p>Amount: ${amount}</p>
    <a href="/">Go Back Home</a>
  `);
});

export default router;