import app from "./app";
import { config } from "./config/config";
import connectDB from "./config/db";
import showRoutes from "./modules/show/show.routes";
import authRoutes from "./modules/auth/auth.route";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./socket/socketHandlers";
import bookingRoutes from "./modules/booking/booking.route";

const startServer = async () => {
  const port = config.port;

  // Connect to database
  await connectDB();

  // Create HTTP server
  const httpServer = createServer(app);

  // Setup Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Use centralized socket handlers
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    registerSocketHandlers(socket, io);
  });

  // Routes
  app.use("/api/v1/shows", showRoutes);
  app.use("/api/v1/auth",authRoutes);
  app.use("/api/v1/booking", bookingRoutes);

  // Start server
  httpServer.listen(port, () => {
    console.log(`🚀 Listening on port: ${port}`);
  });
};

startServer();