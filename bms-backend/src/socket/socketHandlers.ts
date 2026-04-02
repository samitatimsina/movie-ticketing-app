import { Socket, Server } from "socket.io";

/**
 * In-memory seat lock storage
 * showId -> (seatId -> { userId, expiresAt })
 */
const seatLocks = new Map<
  string,
  Map<string, { userId: string; expiresAt: number }>
>();

const LOCK_DURATION = 5 * 60 * 1000; // 5 minutes

export const registerSocketHandlers = (socket: Socket, io: Server) => {
  /**
   * JOIN SHOW
   */
  socket.on("join-show", ({ showId }: { showId: string }) => {
    if (!showId) {
      console.log("❌ join-show missing showId");
      return;
    }

    socket.join(showId);
    socket.data.showId = showId;

    console.log(`✅ Socket ${socket.id} joined show ${showId}`);

    const showLocks = seatLocks.get(showId) || new Map();
    const now = Date.now();
    const activeLockedSeats: string[] = [];

    // Remove expired locks
    for (const [seatId, lock] of showLocks.entries()) {
      if (lock.expiresAt > now) {
        activeLockedSeats.push(seatId);
      } else {
        showLocks.delete(seatId);
      }
    }

    seatLocks.set(showId, showLocks);

    socket.emit("locked-seats-initials", { seatIds: activeLockedSeats });
  });

  /**
   * LOCK SEATS
   */
  socket.on("lock-seats", ({
    showId,
    seatIds,
    userId,
  }: { showId: string; seatIds: string[]; userId: string }) => {
    if (!seatIds?.length || !showId || !userId) return;

    let showLocks = seatLocks.get(showId);
    if (!showLocks) {
      showLocks = new Map();
      seatLocks.set(showId, showLocks);
    }

    const now = Date.now();
    const unavailableSeats: string[] = [];

    // Check if seats are already locked
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

    // Lock seats
    for (const seatId of seatIds) {
      showLocks.set(seatId, {
        userId,
        expiresAt: now + LOCK_DURATION,
      });
    }

    io.to(showId).emit("seat-locked", { showId, seatIds, userId });

    console.log(`✅ ${userId} locked seats:`, seatIds);
  });

  /**
   * UNLOCK SEATS
   */
  socket.on("unlock-seats", ({
    showId,
    seatIds,
    userId,
  }: { showId: string; seatIds: string[]; userId?: string }) => {
    if (!showId || !seatIds?.length) return;

    const showLocks = seatLocks.get(showId);
    if (!showLocks) return;

    for (const seatId of seatIds) {
      showLocks.delete(seatId);
    }

    io.to(showId).emit("seat-unlocked", { showId, seatIds, userId });

    console.log(`🔓 ${userId || "unknown"} unlocked seats:`, seatIds);
  });

  /**
   * DISCONNECT
   */
  socket.on("disconnect", () => {
    const showId = socket.data.showId;

if (!showId) {
  console.log(`❌ Socket ${socket.id} disconnected before joining any show`);
} else {
  console.log(`❌ Socket ${socket.id} disconnected from show ${showId}`);
}
    // Optional: release seats locked by this socket
    if (showId) {
      const showLocks = seatLocks.get(showId);
      if (showLocks) {
        const now = Date.now();
        const seatsToUnlock: string[] = [];

        for (const [seatId, lock] of showLocks.entries()) {
          // If this socket locked it, unlock it
          if (lock.expiresAt > now && lock.userId === socket.id) {
            seatsToUnlock.push(seatId);
            showLocks.delete(seatId);
          }
        }

        if (seatsToUnlock.length > 0) {
          io.to(showId).emit("seat-unlocked", { showId, seatIds: seatsToUnlock, userId: socket.id });
          console.log(`🔓 Auto-unlocked seats for disconnected socket ${socket.id}:`, seatsToUnlock);
        }
      }
    }
  });
};