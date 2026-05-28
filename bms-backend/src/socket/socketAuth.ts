import jwt from "jsonwebtoken";
import { config } from "../config/config";

export const socketAuth = (socket: any, next: any) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("No token provided"));
    }

    const decoded = jwt.verify(token, config.accessTokenSecret);

    socket.data.user = decoded;

    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
};