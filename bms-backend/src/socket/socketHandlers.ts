import { Socket, Server } from "socket.io";

/**
 * Seat lock structure:
 * showId -> (seatId -> { userId, expiresAt })
 */
const seatLocks = new Map<
  string,
  Map<string, { userId: string; expiresAt: number }>
>();

const LOCK_DURATION = 5 * 60 * 1000; // 5 minutes

export const registerSocketHandlers = (socket: Socket, io: Server) => {
  const user = socket.data.user; // ✅ from auth middleware

  if (!user) {
    console.log("❌ Unauthorized socket connection");
    socket.disconnect();
    return;
  }

  /**
   * JOIN SHOW ROOM
   */
  socket.on("join-show", ({ showId }: { showId: string }) => {
    if (!showId) return;

    socket.join(showId);
    socket.data.showId = showId;

    console.log(`✅ User ${user._id} joined show ${showId}`);

    const showLocks = seatLocks.get(showId) || new Map();
    const now = Date.now();

    const activeLockedSeats: string[] = [];

    // cleanup expired locks
    for (const [seatId, lock] of showLocks.entries()) {
      if (lock.expiresAt > now) {
        activeLockedSeats.push(seatId);
      } else {
        showLocks.delete(seatId);
      }
    }

    seatLocks.set(showId, showLocks);

    socket.emit("locked-seats-initials", {
      seatIds: activeLockedSeats,
    });
  });

  /**
   * LOCK SEATS (SECURE)
   */
  socket.on(
    "lock-seats",
    ({ showId, seatIds }: { showId: string; seatIds: string[] }) => {
      if (!showId || !seatIds?.length) return;

      const userId = user._id;

      let showLocks = seatLocks.get(showId);
      if (!showLocks) {
        showLocks = new Map();
        seatLocks.set(showId, showLocks);
      }

      const now = Date.now();
      const unavailableSeats: string[] = [];

      // check conflicts
      for (const seatId of seatIds) {
        const lock = showLocks.get(seatId);

        if (lock && lock.expiresAt > now) {
          unavailableSeats.push(seatId);
        }
      }

      if (unavailableSeats.length > 0) {
        socket.emit("seat-locked-failed", {
          showId,
          requested: seatIds,
          alreadyLocked: unavailableSeats,
        });
        return;
      }

      // lock seats
      for (const seatId of seatIds) {
        showLocks.set(seatId, {
          userId,
          expiresAt: now + LOCK_DURATION,
        });
      }

      io.to(showId).emit("seat-locked", {
        showId,
        seatIds,
        userId,
      });

      console.log(`🔒 User ${userId} locked seats:`, seatIds);
    }
  );

  /**
   * UNLOCK SEATS (ONLY OWNER CAN UNLOCK)
   */
  socket.on(
    "unlock-seats",
    ({ showId, seatIds }: { showId: string; seatIds: string[] }) => {
      if (!showId || !seatIds?.length) return;

      const userId = user._id;

      const showLocks = seatLocks.get(showId);
      if (!showLocks) return;

      const unlockedSeats: string[] = [];

      for (const seatId of seatIds) {
        const lock = showLocks.get(seatId);

        if (lock && lock.userId === userId) {
          showLocks.delete(seatId);
          unlockedSeats.push(seatId);
        }
      }

      if (unlockedSeats.length > 0) {
        io.to(showId).emit("seat-unlocked", {
          showId,
          seatIds: unlockedSeats,
          userId,
        });

        console.log(`🔓 User ${userId} unlocked seats:`, unlockedSeats);
      }
    }
  );

  /**
   * DISCONNECT HANDLING
   */
  socket.on("disconnect", () => {
    const showId = socket.data.showId;
    const userId = user._id;

    console.log(`❌ User disconnected: ${userId} (${socket.id})`);

    if (!showId) return;

    const showLocks = seatLocks.get(showId);
    if (!showLocks) return;

    const seatsToUnlock: string[] = [];

    for (const [seatId, lock] of showLocks.entries()) {
      if (lock.userId === userId) {
        seatsToUnlock.push(seatId);
        showLocks.delete(seatId);
      }
    }

    if (seatsToUnlock.length > 0) {
      io.to(showId).emit("seat-unlocked", {
        showId,
        seatIds: seatsToUnlock,
        userId,
      });

      console.log(
        `♻️ Auto-unlocked seats for user ${userId}:`,
        seatsToUnlock
      );
    }
  });
};