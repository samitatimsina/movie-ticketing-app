import mongoose from "mongoose";
import dayjs from "dayjs";
import { config } from "../config/config";

import { BookingModel } from "../modules/booking/booking.model";
import { UserModel } from "../modules/user/user.model";
import ShowModel from "../modules/show/show.model";

const generateRandomSeats = () => {
  const rows = ["A", "B", "C", "D", "E"];
  const count = Math.floor(Math.random() * 3) + 1;

  const seats = [];

  for (let i = 0; i < count; i++) {
    const row = rows[Math.floor(Math.random() * rows.length)];
    const number = Math.floor(Math.random() * 10) + 1;

    seats.push({
      row,
      number,
      type: "REGULAR",
      price: 150,
      id: `${row}${number}`,
    });
  }

  return seats;
};

export const seedBookings = async () => {
  const users = await UserModel.find();
  const shows = await ShowModel.find();

  if (!users.length || !shows.length) return;

  console.log(`👤 Users: ${users.length}`);
  console.log(`🎬 Shows: ${shows.length}`);

  for (const user of users) {
    const randomShows = shows
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    for (const show of randomShows) {
      const seats = generateRandomSeats();

      const totalAmount = seats.reduce(
        (sum, seat) => sum + seat.price,
        0
      );

      const alreadyExists = await BookingModel.findOne({
        user: user._id,
        show: show._id,
      });

      if (alreadyExists) continue;

      const isPaid = Math.random() > 0.3;

      const booking = new BookingModel({
        user: user._id,
        movie: show.movie,
        show: show._id,
        theater: show.theater,

        seats,

        totalAmount,

        bookingStatus: isPaid ? "confirmed" : "pending",
        paymentStatus: isPaid ? "completed" : "pending",

        expiresAt: dayjs()
          .add(15, "minute")
          .toDate(),
      });

      await booking.save();

      console.log(`🎟️ Booking created for ${user.email}`);
    }
  }

  console.log("✅ Booking seeding completed.");
};

mongoose
  .connect(config.databaseUrl as string)
  .then(async () => {
    console.log("✅ DB connected");

    await BookingModel.deleteMany({});
    console.log("🧹 Old bookings deleted");

    await seedBookings();

    await mongoose.disconnect();

    console.log("✅ Done");
  })
  .catch((err) => console.log(err));