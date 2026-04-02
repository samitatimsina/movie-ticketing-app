import { io } from "socket.io-client";

// Make sure this matches your backend port
export const socket = io("http://localhost:9000", {
  transports: ["websocket", "polling"]
});