"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedBookings = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dayjs_1 = __importDefault(require("dayjs"));
const config_1 = require("../config/config");
const booking_model_1 = require("../modules/booking/booking.model");
const user_model_1 = require("../modules/user/user.model");
const show_model_1 = __importDefault(require("../modules/show/show.model"));
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
const seedBookings = async () => {
    const users = await user_model_1.UserModel.find();
    const shows = await show_model_1.default.find();
    if (!users.length || !shows.length)
        return;
    console.log(`👤 Users: ${users.length}`);
    console.log(`🎬 Shows: ${shows.length}`);
    for (const user of users) {
        const randomShows = shows
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        for (const show of randomShows) {
            const seats = generateRandomSeats();
            const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);
            const alreadyExists = await booking_model_1.BookingModel.findOne({
                user: user._id,
                show: show._id,
            });
            if (alreadyExists)
                continue;
            const isPaid = Math.random() > 0.3;
            const booking = new booking_model_1.BookingModel({
                user: user._id,
                movie: show.movie,
                show: show._id,
                theater: show.theater,
                seats,
                totalAmount,
                bookingStatus: isPaid ? "confirmed" : "pending",
                paymentStatus: isPaid ? "completed" : "pending",
                expiresAt: (0, dayjs_1.default)()
                    .add(15, "minute")
                    .toDate(),
            });
            await booking.save();
            console.log(`🎟️ Booking created for ${user.email}`);
        }
    }
    console.log("✅ Booking seeding completed.");
};
exports.seedBookings = seedBookings;
mongoose_1.default
    .connect(config_1.config.databaseUrl)
    .then(async () => {
    console.log("✅ DB connected");
    await booking_model_1.BookingModel.deleteMany({});
    console.log("🧹 Old bookings deleted");
    await (0, exports.seedBookings)();
    await mongoose_1.default.disconnect();
    console.log("✅ Done");
})
    .catch((err) => console.log(err));
