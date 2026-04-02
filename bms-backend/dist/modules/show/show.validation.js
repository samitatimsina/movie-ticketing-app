"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSeatStatusSchema = exports.GetShowsQuerySchema = exports.ShowSchema = exports.SeatSchema = void 0;
const zod_1 = require("zod");
//seat schema
exports.SeatSchema = zod_1.z.object({
    row: zod_1.z.string().min(1, "Row is required"),
    seatNumber: zod_1.z.number().min(1, "Seat number is required & must be atleast 1"),
    status: zod_1.z.enum(["AVAILABLE", "BOOKED", "BLOCKED"]).default("AVAILABLE"),
});
//create show schema
exports.ShowSchema = zod_1.z.object({
    movieId: zod_1.z.string().min(1, "Movie Id is required"),
    theaterId: zod_1.z.string().min(1, "Theater Id is required"),
    screen: zod_1.z.string().min(1, "Screen is required"),
    showDate: zod_1.z.coerce.date(),
    showTime: zod_1.z.string().min(1, "Show time is required"),
    price: zod_1.z.number().min(1, "Price must be greater than 0"),
    location: zod_1.z.string().min(1, "location is required"),
    seats: zod_1.z.array(exports.SeatSchema).nonempty("Seats must be generated"),
});
exports.GetShowsQuerySchema = zod_1.z.object({
    movieId: zod_1.z.string().min(1),
    location: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    date: zod_1.z.string().min(1),
});
//Update Seat Status Validation
exports.UpdateSeatStatusSchema = zod_1.z.object({
    row: zod_1.z.string().min(1, "Row is required"),
    seatNumber: zod_1.z.coerce.number().min(1),
    status: zod_1.z.enum(["AVAILABLE", "BOOKED", "BLOCKED"]),
});
