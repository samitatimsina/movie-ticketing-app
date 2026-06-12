import { io } from "socket.io-client";
console.log(
  "TOKEN:",
  localStorage.getItem("accessToken")
);
export const socket = io("http://localhost:9000", {
  autoConnect: false,
  transports: ["websocket"],
  auth: {
    token: localStorage.getItem("accessToken")
  }
});

export default socket;