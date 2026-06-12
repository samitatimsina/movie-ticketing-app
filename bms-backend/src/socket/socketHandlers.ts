import { Server, Socket } from "socket.io";
import { BookingModel } from "../modules/booking/booking.model";

type SeatLock = {
  userId: string;
  expiresAt: number;
};

const seatLocks = new Map<string, Map<string, SeatLock>>();
const LOCK_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * GLOBAL cleanup interval (IMPORTANT: not per socket)
 */
const startCleanup = (io: Server) => {
  setInterval(() => {
    const now = Date.now();

    for (const [showId, showLocks] of seatLocks.entries()) {
      const expired: string[] = [];

      for (const [seatId, lock] of showLocks.entries()) {
        if (lock.expiresAt <= now) {
          showLocks.delete(seatId);
          expired.push(seatId);
        }
      }

      if (expired.length) {
        io.to(showId).emit("seat-unlocked", {
          showId,
          seatIds: expired,
        });

        console.log("⏰ AUTO EXPIRED:", expired);
      }

      if (showLocks.size === 0) {
        seatLocks.delete(showId);
      }
    }
  }, 30000);
};

let cleanupStarted = false;

export const registerSocketHandlers = (socket: Socket, io: Server) => {
  if (!cleanupStarted) {
    startCleanup(io);
    cleanupStarted = true;
  }

  const user = socket.data.user;

  if (!user) {
    socket.disconnect();
    return;
  }

  const userId = String(user.id || user._id);
  console.log("✅ Authenticated User:", userId);

  /**
   * JOIN SHOW
   */
  socket.on("join-show", async ({ showId }) => {
    console.log("JOIN SHOW RECEIVED", showId);
    if (!showId) return;

    const roomId = String(showId);
    console.log("ROOM JOIN:", roomId);

    // leave previous room if exists
    if (socket.data.showId && socket.data.showId !== roomId) {
      socket.leave(socket.data.showId);
    }

    socket.join(roomId);
    socket.data.showId = roomId;

    console.log(`🎬 User ${userId} joined show ${roomId}`);

    let showLocks = seatLocks.get(roomId);
    if (!showLocks) {
      showLocks = new Map();
      seatLocks.set(roomId, showLocks);
    }

    const now = Date.now();
    const activeLocks: string[] = [];

    for (const [seatId, lock] of showLocks.entries()) {
      if (lock.expiresAt <= now) {
        showLocks.delete(seatId);
      } else {
        activeLocks.push(seatId);
      }
    }

    const completedBookings = await BookingModel.find({
      show: roomId,
      paymentStatus: "completed",
    }).select("seats");

    const bookedSeatIds = completedBookings.flatMap((b: any) =>
      (b.seats || []).map((s: any) => s.id)
    );

    socket.emit("seat-sync", {
      showId: roomId,
      lockedSeats: activeLocks,
      bookedSeats: bookedSeatIds,
    });
  });

  /**
   * LOCK SEATS
   */
  socket.on(
    "lock-seats",
    async({ showId, seatIds }: { showId: string; seatIds: string[] }) => {
      console.log("🔥 LOCK REQUEST RECEIVED:", showId, seatIds, userId);
      if (!showId || !seatIds?.length) return;

      const roomId = String(showId);
      const completedBookings = await BookingModel.find({
  show: roomId,
  paymentStatus: "completed",
}).select("seats");

const bookedSeatIds = completedBookings.flatMap((b: any) =>
  (b.seats || []).map((s: any) => s.id || s)
);

const alreadyBooked = seatIds.filter((id) =>
  bookedSeatIds.includes(id)
);

if (alreadyBooked.length) {
  socket.emit("seat-lock-failed", {
    showId: roomId,
    alreadyLocked: alreadyBooked,
  });
  return;
}

    const showLocks = seatLocks.get(roomId) || new Map();
    seatLocks.set(roomId, showLocks);

      const now = Date.now();
      const alreadyLocked: string[] = [];
      const allowedSeats: string[] = [];

      for (const seatId of seatIds) {
        const lock = showLocks.get(seatId);

        if (lock && lock.expiresAt > now && lock.userId !== userId) {
          alreadyLocked.push(seatId);
        } else {
          allowedSeats.push(seatId);
        }
      }

      if (alreadyLocked.length) {
        socket.emit("seat-lock-failed", {
          showId: roomId,
          alreadyLocked,
        });
        return;
      }

      for (const seatId of allowedSeats) {
        showLocks.set(seatId, {
          userId,
          expiresAt: now + LOCK_DURATION,
        });
      }

      io.to(roomId).emit("seat-locked", {
        showId: roomId,
        seatIds: allowedSeats,
        userId,
        expiresAt: now + LOCK_DURATION,
      });
      console.log("ROOM EMIT:", roomId);
    }
  );

  /**
   * UNLOCK SEATS
   */
  socket.on(
    "unlock-seats",
    ({ showId, seatIds }: { showId: string; seatIds: string[] }) => {
      if (!showId || !seatIds?.length) return;

      const roomId = String(showId);
      const showLocks = seatLocks.get(roomId);
      if (!showLocks) return;

      const unlocked: string[] = [];

      for (const seatId of seatIds) {
        const lock = showLocks.get(seatId);

        if (lock?.userId === userId) {
          showLocks.delete(seatId);
          unlocked.push(seatId);
        }
      }

      if (unlocked.length) {
        io.to(roomId).emit("seat-unlocked", {
          showId: roomId,
          seatIds: unlocked,
          userId,
        });
      }
    }
  );

  /**
   * BOOKING CONFIRMED
   */
  socket.on("booking-confirmed", ({ showId, seatIds }) => {
    const roomId = String(showId);

    const showLocks = seatLocks.get(roomId);
    if (showLocks) {
      for (const seatId of seatIds || []) {
        showLocks.delete(seatId);
      }
    }

    io.to(roomId).emit("booking-completed", {
      showId: roomId,
      seatIds,
    });
  });

  /**
   * DISCONNECT
   */
  socket.on("disconnect", () => {
    console.log("❌ DISCONNECTED:", userId);
  });
};

export {seatLocks};