import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { config } from "../config/config";

export const socketAuthMiddleware = (socket: Socket, next: any) => {
  try {
    const cookieHeader = socket.handshake.headers?.cookie;

    if (!cookieHeader) return next(new Error("No cookies found"));

    const cookies = cookie.parse(cookieHeader);

    const token = cookies.accessToken; // ✅ MUST match res.cookie name

    if (!token) return next(new Error("No token found"));

    const decoded = jwt.verify(token, config.accessTokenSecret);

    socket.data.user = decoded;

    next();
  } catch (err) {
    return next(new Error("Socket auth failed"));
  }
};