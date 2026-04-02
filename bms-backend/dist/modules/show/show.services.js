"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSeatStatus = exports.getShowById = exports.getShowsByMovieDateLocation = exports.generateFallbackShows = exports.createShow = void 0;
const utils_1 = require("../../utils");
const show_model_1 = __importDefault(require("./show.model"));
const mongoose_1 = require("mongoose");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const mongoose_2 = __importDefault(require("mongoose"));
const show_model_2 = __importDefault(require("./show.model"));
dayjs_1.default.extend(utc_1.default);
// CREATE SHOW 
const createShow = async (data) => {
    const seatLayout = (0, utils_1.generateSeatLayout)();
    const showToCreate = { ...data, seatLayout };
    return await show_model_1.default.create(showToCreate);
};
exports.createShow = createShow;
// FALLBACK GENERATOR 
const generateFallbackShows = (movie, date, location) => {
    const baseDate = (0, dayjs_1.default)(date).toDate();
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
    const shows = [];
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
exports.generateFallbackShows = generateFallbackShows;
//  GET SHOWS
const getShowsByMovieDateLocation = async (movieId, date, location) => {
    const query = {
        movie: new mongoose_1.Types.ObjectId(movieId),
    };
    //DATE FILTER
    if (date) {
        const start = dayjs_1.default.utc(date).startOf("day").toDate();
        const end = dayjs_1.default.utc(date).endOf("day").toDate();
        query.startTime = {
            $gte: start,
            $lte: end,
        };
    }
    // LOCATION FILTER (case-insensitive)
    if (location) {
        query.location = { $regex: new RegExp(`^${location}$`, "i") };
    }
    const shows = await show_model_1.default.find(query).populate("movie theater");
    console.log("Mongo query:", JSON.stringify(query));
    console.log("Found shows:", shows.length);
    //FALLBACK
    if (!shows || shows.length === 0) {
        console.log("⚠️ No shows found → generating fallback shows");
        const movieDoc = await show_model_1.default.db
            .model("Movie")
            .findById(movieId);
        return (0, exports.generateFallbackShows)(movieDoc, date, location);
    }
    return shows;
};
exports.getShowsByMovieDateLocation = getShowsByMovieDateLocation;
// GET SHOW BY ID 
const getShowById = async (showId) => {
    // ✅ ADD THIS CHECK HERE
    if (!mongoose_2.default.Types.ObjectId.isValid(showId)) {
        return null; // or throw error if you prefer
    }
    return await show_model_2.default.findById(showId)
        .populate("movie")
        .populate("theater");
};
exports.getShowById = getShowById;
// UPDATE SEAT
const updateSeatStatus = async (showid, row, seatNumber, status) => {
    return await show_model_1.default.updateOne({ _id: new mongoose_1.Types.ObjectId(showid), "seatLayout.row": row }, {
        $set: {
            "seatLayout.$.seats.$[elem].status": status,
        },
    }, {
        arrayFilters: [{ "elem.number": seatNumber }],
    });
};
exports.updateSeatStatus = updateSeatStatus;
