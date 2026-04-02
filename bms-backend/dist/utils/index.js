"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = exports.generateSeatLayout = exports.groupShowsByTheatreAndMovie = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const groupShowsByTheatreAndMovie = (shows) => {
    const grouped = {};
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
            _id: show._id.toString(), // ✅ _id exists
            date: (0, dayjs_1.default)(show.showDate).format("YYYY-MM-DD"), // ✅ use showDate
            startTime: (0, dayjs_1.default)(show.startTime).format("hh:mm A"), // ✅ format Date to string
            format: show.format ?? "",
            audioType: show.audioType ?? "",
        });
    });
    return Object.values(grouped);
};
exports.groupShowsByTheatreAndMovie = groupShowsByTheatreAndMovie;
const generateSeatLayout = () => {
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
exports.generateSeatLayout = generateSeatLayout;
// EMAIL VALIDATION UTILITY
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
