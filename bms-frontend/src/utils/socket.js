import { io } from "socket.io-client";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
console.log(
  "TOKEN:",
  localStorage.getItem("accessToken")
);
export const socket = io(`${BASE_URL}`, {
  autoConnect: false,
  transports: ["websocket"],
  auth: {
    token: localStorage.getItem("accessToken")
  }
});

export default socket;