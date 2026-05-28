import mongoose from "mongoose";
import dayjs from "dayjs";

import { config } from "../config/config";

import { BookingModel } from "../modules/booking/booking.model";
import { UserModel } from "../modules/user/user.model";
import ShowModel from "../modules/show/show.model";

const bookingStatuses = ["pending", "paid"];
const paymentStatuses = ["pending", "completed"];

const generateRandomSeats = () => {
  const rows = ["A", "B", "C", "D", "E"];
  const count = Math.floor(Math.random() * 3) + 1;

  const seats: string[] = [];

  for (let i = 0; i < count; i++) {
    const row = rows[Math.floor(Math.random() * rows.length)];
    const num = Math.floor(Math.random() * 10) + 1;

    seats.push(`${row}${num}`);
  }

  return [...new Set(seats)];
};

export const seedBookings = async () => {
  const users = await UserModel.find();
  const shows = await ShowModel.find();

  if (!users.length) {
    console.log("❌ No users found.");
    return;
  }

  if (!shows.length) {
    console.log("❌ No shows found.");
    return;
  }

  console.log(`👤 Users found: ${users.length}`);
  console.log(`🎬 Shows found: ${shows.length}`);

  for (const user of users) {
    const randomShows = shows
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    for (const show of randomShows) {
      const seats = generateRandomSeats();

      // calculate total using REGULAR price
      const seatPrice =
        show.priceMap?.REGULAR || 150;

      const totalAmount = seats.length * seatPrice;

      const alreadyExists = await BookingModel.findOne({
        user: user._id,
        show: show._id,
      });

      if (alreadyExists) continue;

      const isPaid = Math.random() > 0.3;

      const booking = new BookingModel({
        user: user._id,
        show: show._id,

        seats,

        totalAmount,

        ticket: totalAmount,
        fee: 20,

        paymentMethod: "Esewa",

        status: isPaid ? "paid" : "pending",

        paymentStatus: isPaid
          ? "completed"
          : "pending",

        createdAt: dayjs()
          .subtract(
            Math.floor(Math.random() * 10),
            "day"
          )
          .toDate(),
      });

      await booking.save();

      console.log(
        `🎟️ Booking created for ${user.email}`
      );
    }
  }

  console.log("✅ Booking seeding completed.");
};

mongoose
  .connect(config.databaseUrl as string)
  .then(async () => {
    console.log("✅ DB connected");

    // optional cleanup
    await BookingModel.deleteMany({});
    console.log("🧹 Old bookings deleted");

    await seedBookings();

    await mongoose.disconnect();

    console.log("✅ Done");
  })
  .catch((err) => {
    console.log(err);
  });