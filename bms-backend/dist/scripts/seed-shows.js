"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedShow = void 0;
// seed/showSeeder.ts
const mongoose_1 = __importDefault(require("mongoose"));
const dayjs_1 = __importDefault(require("dayjs"));
const movie_model_1 = require("../modules/movie/movie.model");
const theater_model_1 = require("../modules/theater/theater.model");
const show_model_1 = __importDefault(require("../modules/show/show.model"));
const config_1 = require("../config/config");
const index_1 = require("../utils/index");
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
dayjs_1.default.extend(customParseFormat_1.default);
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
const toDateWithTime = (baseDate, timeStr) => {
    const parsedTime = (0, dayjs_1.default)(timeStr, "hh:mm A"); // must use customParseFormat
    return (0, dayjs_1.default)(baseDate)
        .hour(parsedTime.hour())
        .minute(parsedTime.minute())
        .second(0)
        .toDate();
};
const seedShow = async () => {
    const movies = await movie_model_1.MovieModel.find();
    if (!movies.length) {
        console.log("❌ No movies found. Seed movies first.");
        return;
    }
    console.log("Movies found:", movies.length);
    const theatres = await theater_model_1.TheaterModel.find();
    if (!theatres.length) {
        console.log("❌ No theatres found.");
        return;
    }
    console.log("Theatres found:", theatres.length);
    const today = (0, dayjs_1.default)().startOf("day");
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
                    const exists = await show_model_1.default.findOne({
                        movie: movie._id,
                        theater: theatre._id,
                        startTime
                    });
                    if (exists)
                        continue;
                    const newShow = new show_model_1.default({
                        movie: movie._id,
                        theater: theatre._id,
                        location: theatre.city.toLowerCase(),
                        format: formats[Math.floor(Math.random() * formats.length)],
                        audioType: "Dolby 7.1",
                        startTime,
                        endTime,
                        showDate: showDate.toDate(),
                        priceMap: generatePriceMap(),
                        seatLayout: (0, index_1.generateSeatLayout)(),
                    });
                    await newShow.save();
                    console.log(`🎬 Show created for ${movie.title} at ${theatre.name} on ${formattedDate} (${slot.start})`);
                }
            }
        }
    }
    console.log("✅ Show seeding completed.");
};
exports.seedShow = seedShow;
mongoose_1.default
    .connect(config_1.config.databaseUrl)
    .then(async () => {
    console.log("DB connected");
    await show_model_1.default.deleteMany({});
    console.log("🧹 Existing shows deleted.");
    await (0, exports.seedShow)(); // 🔥 THIS WAS MISSING
    await mongoose_1.default.disconnect();
    console.log("✅ Done");
})
    .catch((err) => console.log(err));
