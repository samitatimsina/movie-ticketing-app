import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { Socket } from "socket.io";

export const socketAuthMiddleware = (socket:Socket, next:any) => {
  try {
    console.log(
      "SOCKET AUTH TOKEN:",
      socket.handshake.auth?.token
    );

    const token = socket.handshake.auth?.token;

    if (!token) {
      console.log("NO TOKEN");
      return next(new Error("No token found"));
    }

    const decoded = jwt.verify(
      token,
      config.accessTokenSecret
    );

    console.log("TOKEN VERIFIED");

    socket.data.user = decoded;

    next();
  } catch (err) {
    console.log("AUTH ERROR:", err);
    return next(new Error("Socket auth failed"));
  }
};