// seed/showSeeder.ts
import mongoose from "mongoose";
import dayjs from "dayjs";
import { MovieModel } from "../modules/movie/movie.model";
import { TheaterModel } from "../modules/theater/theater.model";
import  ShowModel  from "../modules/show/show.model";
import { config } from "../config/config";
import { generateSeatLayout } from "../utils/index"

import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const generatePriceMap = () => ({
  PREMIUM: 500,
  EXECUTIVE: 250,
  REGULAR: 150,
});

const formats = ["2D", "3D", "IMAX"];

// 🎞️ Realistic time slots
const fixedTimeSlots = [
  { start: "09:00 AM", end: "11:30 AM" },
  { start: "12:30 PM", end: "03:00 PM" },
  { start: "04:00 PM", end: "06:30 PM" },
  { start: "07:30 PM", end: "10:00 PM" },
];

const toDateWithTime = (baseDate: Date, timeStr: string) => {
  const parsedTime = dayjs(timeStr, "hh:mm A"); // must use customParseFormat
  return dayjs(baseDate)
    .hour(parsedTime.hour())
    .minute(parsedTime.minute())
    .second(0)
    .toDate();
};
export const seedShow = async () => {

  const movies = await MovieModel.find();
  if (!movies.length) {
    console.log("❌ No movies found. Seed movies first.");
    return;
  }
  console.log("Movies found:", movies.length);

  const theatres = await TheaterModel.find();
  if (!theatres.length) {
    console.log("❌ No theatres found.");
    return;
  }
  console.log("Theatres found:", theatres.length);

  const today = dayjs().startOf("day");

  for (const movie of movies) {
    for (const theatre of theatres) {
      for (let d = 0; d < 2; d++) {

        const showDate = today.add(d, "day");
        const formattedDate = showDate.format("YYYY-MM-DD");

        const numShows = Math.floor(Math.random() * 3) + 2;
        const selectedSlots = fixedTimeSlots.slice(0, numShows);
        for (const slot of selectedSlots) {

          const startTime = toDateWithTime(showDate.toDate(), slot.start);
          const endTime = toDateWithTime(showDate.toDate(), slot.end);

          // ✅ Prevent duplicates
          const exists = await ShowModel.findOne({
            movie: movie._id,
            theater: theatre._id,
            startTime
          });

          if (exists) continue;

          const newShow = new ShowModel({
            movie: movie._id,
            theater: theatre._id,
            location: theatre.city.toLowerCase(),
            format: formats[Math.floor(Math.random() * formats.length)],
            audioType: "Dolby 7.1",
            startTime,
            endTime,
            showDate: showDate.toDate(),
            priceMap: generatePriceMap(),
            seatLayout: generateSeatLayout(),
          });

          await newShow.save();

          console.log(
            `🎬 Show created for ${movie.title} at ${theatre.name} on ${formattedDate} (${slot.start})`
          );
        }
      }
    }
  }

  console.log("✅ Show seeding completed.");
};

mongoose
  .connect(config.databaseUrl as string)
  .then(async () => {
    console.log("DB connected");

    await ShowModel.deleteMany({});
    console.log("🧹 Existing shows deleted.");

    await seedShow(); // 🔥 THIS WAS MISSING

    await mongoose.disconnect();
    console.log("✅ Done");
  })
  .catch((err) => console.log(err));