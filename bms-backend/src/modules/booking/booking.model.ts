import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    show: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },

    seats: [{ type: String, required: true }],

    totalAmount: { type: Number, required: true },

    // extra fields for frontend
    ticket: { type: Number, default: 0 },
    fee: { type: Number, default: 0 },
    paymentMethod: { type: String, default: "Esewa" },

    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const BookingModel = mongoose.model("Booking", bookingSchema);