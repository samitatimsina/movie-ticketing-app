import { Server } from "socket.io";
import { registerSocketHandlers } from "./socketHandlers";

export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods:["GET","POST"]
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 New socket connected: ${socket.id}`);

    registerSocketHandlers(socket, io);
  });

  return io;
};