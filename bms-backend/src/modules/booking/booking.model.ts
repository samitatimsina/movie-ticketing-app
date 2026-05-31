

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

    seats: [
  {
    row: String,
    number: Number,
    type: String,
    price: Number,
    id: String,
  }
],

    totalAmount: Number,

    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending","completed", "failed"],
      default: "pending",
    },
    expiresAt: {
  type: Date,
  required: true,
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