import { Types } from "mongoose";

export interface ISeat {
  row: string;
  seatNumber: number;
  status: "AVAILABLE" | "BOOKED" | "BLOCKED";
}

export interface IShow {
  movie: Types.ObjectId;
  theater: Types.ObjectId;
  location: string;
  format: string;
  audioType: string;
  showDate: Date;      // ✅ add this
  startTime: Date;     // ✅ add this
  endTime: Date;       // optional
  priceMap: Record<string, number>;
  seatLayout: {
    row: string;
    seats: ISeat[];
  }[];
  state?: string;
  createdAt?: Date;
  updatedAt?: Date;
}