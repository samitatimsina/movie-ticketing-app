import { io } from "socket.io-client";

export const socket = io("http://localhost:9000", {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
  auth: {
    token:document.cookie
  }
});

export default socket;