import { Server } from "socket.io";
import { registerSocketHandlers } from "./socketHandlers";
import { socketAuthMiddleware } from "./socketAuth";

export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log("CONNECTED:", socket.id);

    /**
     * ONLY attach handler layer
     * ALL logic (rooms + locks + sync) lives there
     */
    registerSocketHandlers(socket, io);

    /**
     * Optional: restore room after refresh
     * (only works if you persist showId in socket.data or token)
     */
    const lastShowId = socket.data?.showId;

    if (lastShowId) {
      socket.join(lastShowId);

      console.log("🔄 RESTORED ROOM:", {
        socketId: socket.id,
        roomId: lastShowId,
      });
    }
  });

  return io;
};