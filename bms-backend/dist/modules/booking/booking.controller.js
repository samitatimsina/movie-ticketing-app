"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proceedToEsewa = exports.getUserBookings = exports.verifyPayment = exports.createBooking = void 0;
const booking_model_1 = require("./booking.model");
const show_model_1 = __importDefault(require("../show/show.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const socketHandlers_1 = require("../../socket/socketHandlers"); // adjust path if needed
const createBooking = async (req, res) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { showId, seats, totalAmount } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            await session.abortTransaction();
            session.endSession();
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        if (!seats || seats.length === 0) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({ message: "No seats selected" });
            return;
        }
        const seatIds = seats.map((s) => s.id);
        // ===============================
        // SOCKET LOCK VALIDATION (IMPORTANT)
        // ===============================
        const showLocks = socketHandlers_1.seatLocks.get(showId);
        if (showLocks) {
            const now = Date.now();
            const lockedByOthers = [];
            for (const seatId of seatIds) {
                const lock = showLocks.get(seatId);
                if (lock && lock.expiresAt > now && lock.userId !== userId) {
                    lockedByOthers.push(seatId);
                }
            }
            if (lockedByOthers.length > 0) {
                await session.abortTransaction();
                session.endSession();
                res.status(409).json({
                    success: false,
                    message: "Some seats are currently locked by another user",
                    seats: lockedByOthers,
                });
                return;
            }
        }
        // 🔥 STRONG CHECK (pending + completed both blocked)
        const activeBooking = await booking_model_1.BookingModel.findOne({
            show: showId,
            paymentStatus: { $in: ["pending", "completed"] },
            "seats.id": { $in: seatIds },
        }).session(session);
        if (activeBooking) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({
                success: false,
                message: "Seats already reserved",
            });
            return;
        }
        const show = await show_model_1.default.findById(showId)
            .populate("movie")
            .populate("theater");
        if (!show) {
            await session.abortTransaction();
            session.endSession();
            res.status(404).json({
                success: false,
                message: "Show not found",
            });
            return;
        }
        // 🔥 CREATE BOOKING (inside transaction)
        const [booking] = await booking_model_1.BookingModel.create([
            {
                user: userId,
                movie: show.movie._id,
                theater: show.theater._id,
                show: showId,
                seats: seatIds,
                totalAmount,
                bookingStatus: "pending",
                paymentStatus: "pending",
                bookingId: `BOOK-${Date.now()}`,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            },
        ], { session });
        await session.commitTransaction();
        session.endSession();
        res.json({
            success: true,
            bookingId: booking._id,
            totalAmount: booking.totalAmount,
        });
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(500).json({ success: false });
    }
};
exports.createBooking = createBooking;
// ================================
// VERIFY PAYMENT (MOCK)
// ================================
const verifyPayment = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await booking_model_1.BookingModel.findById(bookingId);
        if (!booking) {
            res.status(404).json({ message: "Booking not found" });
            return;
        }
        if (booking.paymentStatus === "completed") {
            res.json({ success: true, message: "Already verified" });
            return;
        }
        booking.paymentStatus = "completed";
        booking.bookingStatus = "confirmed";
        await booking.save();
        res.json({
            success: true,
            message: "Mock payment verified successfully",
            bookingId: booking._id,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Payment verification failed" });
    }
};
exports.verifyPayment = verifyPayment;
// ================================
// GET USER BOOKINGS
// ================================
const getUserBookings = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const bookings = await booking_model_1.BookingModel.find({ user: userId }).populate({
            path: "show",
            populate: [{ path: "movie" }, { path: "theater" }],
        });
        const formatted = bookings.map((b) => ({
            _id: b._id,
            movie: b.show?.movie,
            theater: b.show?.theater,
            seats: b.seats,
            quantity: b.seats?.length || 0,
            ticket: b.totalAmount,
            totalAmount: b.totalAmount,
            bookingTime: b.createdAt,
            datetime: b.show?.startTime,
            paymentStatus: b.paymentStatus,
            bookingStatus: b.bookingStatus,
        }));
        res.json(formatted);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
};
exports.getUserBookings = getUserBookings;
// ================================
// MOCK ESEWA REDIRECT
// ================================
const proceedToEsewa = async (req, res) => {
    const { bookingId, totalAmount } = req.body;
    if (!bookingId || !totalAmount) {
        res.status(400).json({ message: "Missing data" });
        return;
    }
    const mockUrl = `http://localhost:5173/payment/mock?bookingId=${bookingId}&amount=${totalAmount}`;
    res.json({
        success: true,
        redirectUrl: mockUrl,
    });
};
exports.proceedToEsewa = proceedToEsewa;
