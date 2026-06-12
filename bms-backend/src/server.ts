import app from "./app";
// import { config } from "./config/config";
import connectDB from "./config/db";
import showRoutes from "./modules/show/show.routes";
import authRoutes from "./modules/auth/auth.route";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./socket/socketHandlers";
import bookingRoutes from "./modules/booking/booking.route";
import paymentRoutes from "./routes/payment.routes";
import { socketAuthMiddleware } from "./socket/socketAuth";

const startServer = async () => {
 const port = process.env.PORT || 9000;

  // Connect to database
  await connectDB();

  // Create HTTP server
  const httpServer = createServer(app);

  // Setup Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "https://movie-ticketing-app.vercel.app/",
    methods: ["GET", "POST"],
    credentials: false,
  },
  transports: ["polling","websocket"],
});
io.use(socketAuthMiddleware);

  // Use centralized socket handlers
io.on("connection", (socket) => {
  console.log("TOKEN:", socket.handshake.auth?.token);
  console.log("🔌 Socket connected:", socket.id);

  registerSocketHandlers(socket, io);
  console.log("🔥 registerSocketHandlers called");

  socket.onAny((event, ...args) => {
    console.log("EVENT:", event, args);
  });
});

  // Routes
  app.use("/api/v1/shows", showRoutes);
  app.use("/api/v1/auth",authRoutes);
  app.use("/api/v1/booking", bookingRoutes);
  app.use("/api/v1/payment", paymentRoutes);

  // Start server
  httpServer.listen(port, () => {
    console.log(`🚀 Listening on port: ${port}`);
  });
};

startServer();

