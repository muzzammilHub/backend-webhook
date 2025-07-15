import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
}));

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// POST API to receive webhook data and emit to frontend
app.post("/api/webhook", (req, res) => {
  const message = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  console.log("Received Webhook Data:", message);

  // Emit to all connected clients
  io.emit("webhook-alert", message);

  res.status(200).json({ success: true });
});

// Start server
httpServer.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
