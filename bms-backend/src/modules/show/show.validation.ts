import { z } from "zod";

//seat schema
export const SeatSchema = z.object({
    row:z.string().min(1,"Row is required"),
    seatNumber: z.number().min(1,"Seat number is required & must be atleast 1"),
    status: z.enum(["AVAILABLE","BOOKED", "BLOCKED"]).default("AVAILABLE"),
});

//create show schema
export const ShowSchema = z.object({
    movieId: z.string().min(1,"Movie Id is required"),
    theaterId: z.string().min(1,"Theater Id is required"),
    screen: z.string().min(1,"Screen is required"),

    showDate: z.coerce.date(),
    showTime: z.string().min(1,"Show time is required"),

    price: z.number().min(1,"Price must be greater than 0"),
    location: z.string().min(1,"location is required"),
    seats: z.array(SeatSchema).nonempty("Seats must be generated"),
});

export type ShowInput = z.infer<typeof ShowSchema>;

export const GetShowsQuerySchema = z.object({
  movieId: z.string().min(1),
  location: z.string().optional(),
  state: z.string().optional(),
  date: z.string().min(1),
});
   //Update Seat Status Validation

export const UpdateSeatStatusSchema = z.object({
  row: z.string().min(1, "Row is required"),
  seatNumber: z.coerce.number().min(1),
  status: z.enum(["AVAILABLE", "BOOKED", "BLOCKED"]),
});
