import { Server } from "socket.io";
import { registerSocketHandlers } from "./socketHandlers";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  // SOCKET AUTH
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("No token"));
      }

      const user = jwt.verify(token, config.accessTokenSecret);

      socket.data.user = user;

      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("🔌 Connected:", socket.id);

    registerSocketHandlers(socket, io);
  });

  return io;
};