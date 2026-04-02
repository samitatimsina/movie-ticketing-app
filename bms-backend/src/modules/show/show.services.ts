import { generateSeatLayout } from "../../utils";
import ShowModel  from "./show.model";
import { Types } from "mongoose";
import { ShowInput } from "./show.validation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import mongoose from "mongoose";
import Show  from "./show.model";
dayjs.extend(utc);

// CREATE SHOW 
export const createShow = async (data: ShowInput) => {
  const seatLayout = generateSeatLayout();
  const showToCreate = { ...data, seatLayout };
  return await ShowModel.create(showToCreate);
};

// FALLBACK GENERATOR 
export const generateFallbackShows = (
  movie: any,
  date: string,
  location: string
) => {
  const baseDate = dayjs(date).toDate();

  // Multiple theatres per city
  const theatres = [
    {
      name: `QFX ${location}`,
      price: 300,
    },
    {
      name: `Big Movies ${location}`,
      price: 250,
    },
  ];

  // Show timings
  const times = [10, 14, 18];

  const shows: any[] = [];

  theatres.forEach((theatre, tIndex) => {
    times.forEach((hour, sIndex) => {
      const showTime = new Date(baseDate);
      showTime.setHours(hour, 0, 0, 0);

      shows.push({
        _id: `generated-${tIndex}-${sIndex}`,
        movie: movie,
        theatre: { name: theatre.name },
        location,
        startTime: showTime,
        format: "2D",

        // PRICE DIFFERENCE
        price: theatre.price + sIndex * 20, 
        // e.g. morning cheaper, evening expensive
      });
    });
  });

  return shows;
};

//  GET SHOWS
export const getShowsByMovieDateLocation = async (
  movieId: string,
  date: string,
  location: string
) => {
  const query: any = {
    movie: new Types.ObjectId(movieId),
  };

  //DATE FILTER
  if (date) {
    const start = dayjs.utc(date).startOf("day").toDate();
    const end = dayjs.utc(date).endOf("day").toDate();

    query.startTime = {
      $gte: start,
      $lte: end,
    };
  }

  // LOCATION FILTER (case-insensitive)
  if (location) {
    query.location = { $regex: new RegExp(`^${location}$`, "i") };
  }

  const shows = await ShowModel.find(query).populate("movie theater");

  console.log("Mongo query:", JSON.stringify(query));
  console.log("Found shows:", shows.length);

  //FALLBACK
  if (!shows || shows.length === 0) {
    console.log("⚠️ No shows found → generating fallback shows");
    const movieDoc = await ShowModel.db
    .model("Movie")
    .findById(movieId);

      return generateFallbackShows(movieDoc, date, location);  }

      return shows;
};

// GET SHOW BY ID 
export const getShowById = async (showId: string) => {
  // ✅ ADD THIS CHECK HERE
  if (!mongoose.Types.ObjectId.isValid(showId)) {
    return null; // or throw error if you prefer
  }

  return await Show.findById(showId)
    .populate("movie")
    .populate("theater");
};

// UPDATE SEAT
export const updateSeatStatus = async (
  showid: string,
  row: string,
  seatNumber: number,
  status: "AVAILABLE" | "BOOKED" | "BLOCKED"
) => {
  return await ShowModel.updateOne(
    { _id: new Types.ObjectId(showid), "seatLayout.row": row },
    {
      $set: {
        "seatLayout.$.seats.$[elem].status": status,
      },
    },
    {
      arrayFilters: [{ "elem.number": seatNumber }],
    }
  );
};