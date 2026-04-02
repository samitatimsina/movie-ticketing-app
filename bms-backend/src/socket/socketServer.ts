import { Server } from "socket.io";
import { registerSocketHandlers } from "./socketHandlers";

export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // adjust in production
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 New socket connected: ${socket.id}`);

    registerSocketHandlers(socket, io);
  });

  return io;
};