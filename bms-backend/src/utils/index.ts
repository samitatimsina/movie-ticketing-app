import { IShow } from "../modules/show/show.interface";
import { Types } from "mongoose";
import dayjs from "dayjs";
import { IMovie } from "../modules/movie/movie.interface";
import { IThreater } from "../modules/theater/theater.interface";

export type GroupedShow = {
  movie: Types.ObjectId | IMovie;
  theater: {
    theaterDetails: Types.ObjectId | IThreater;
    shows: Array<{
      _id: string;
      date: string;
      startTime: string;
      format: string;
      audioType: string;
    }>;
  };
};

export const groupShowsByTheatreAndMovie = (shows: (IShow & { _id: Types.ObjectId })[]): GroupedShow[] => {
  const grouped: Record<string, GroupedShow> = {};

  shows.forEach((show) => {
    const movieId = show.movie._id;
    const theatreId = show.theater._id;
    const key = `${movieId}_${theatreId}`;

    if (!grouped[key]) {
      grouped[key] = {
        movie: show.movie,
        theater: {
          theaterDetails: show.theater,
          shows: [],
        },
      };
    }

    grouped[key].theater.shows.push({
      _id: show._id.toString(),                                 // ✅ _id exists
      date: dayjs(show.showDate).format("YYYY-MM-DD"),          // ✅ use showDate
      startTime: dayjs(show.startTime).format("hh:mm A"),       // ✅ format Date to string
      format: show.format ?? "",
      audioType: show.audioType ?? "",
    });
  });

  return Object.values(grouped);
};

export type SeatStatus = "available" | "booked" | "blocked";
export type SeatType = "regular" | "vip";

export type Seat = {
  _id?: Types.ObjectId;
  row: string;
  number: number;
  seatId?: string;
  type: SeatType;
  status: SeatStatus;
};

export const generateSeatLayout = () => {
  return [
    {
      row: "E",
      type: "PREMIUM",
      price: 500,
      seats: Array.from({ length: 10 }, (_, i) => ({
        number: i + 1,
        status: "AVAILABLE",
      })),
    },
    {
      row: "D",
      type: "EXECUTIVE",
      price: 250,
      seats: Array.from({ length: 10 }, (_, i) => ({
        number: i + 1,
        status: "AVAILABLE",
      })),
    },
    {
      row: "C",
      type: "EXECUTIVE",
      price: 250,
      seats: Array.from({ length: 10 }, (_, i) => ({
        number: i + 1,
        status: "AVAILABLE",
      })),
    },
    {
      row: "B",
      type: "REGULAR",
      price: 150,
      seats: Array.from({ length: 10 }, (_, i) => ({
        number: i + 1,
        status: "AVAILABLE",
      })),
    },
    {
      row: "A",
      type: "REGULAR",
      price: 150,
      seats: Array.from({ length: 10 }, (_, i) => ({
        number: i + 1,
        status: "AVAILABLE",
      })),
    },
  ];
};

// EMAIL VALIDATION UTILITY

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};