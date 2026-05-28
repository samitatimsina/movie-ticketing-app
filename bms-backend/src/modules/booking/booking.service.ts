import { BookingModel } from "./booking.model";

export const markPaymentSuccess = async (bookingId: string) => {
  return await BookingModel.findByIdAndUpdate(
    bookingId,
    {
      paymentStatus: "completed",
      status: "paid",
    },
    { new: true }
  ).populate({
    path: "show",
    populate: [{ path: "movie" }, { path: "theater" }],
  });
};