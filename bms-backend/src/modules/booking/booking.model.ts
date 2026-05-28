

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },

    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },

    seats: [String],

    totalAmount: Number,

    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "paid",
    },

    bookingId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BookingModel = mongoose.model(
  "Booking",
  bookingSchema
);