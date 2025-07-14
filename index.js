import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cors({
  origin: "*",
}));

const httpServer = createServer(app); // Attach express app to HTTP server

const io = new Server(httpServer, {
  // socket.io options (if any)
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Add POST API
app.post("/api/webhook", (req, res) => {

  const message = req.body;
    console.log(req.body)
  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  // Optionally emit message to all connected clients via Socket.IO
  io.emit("webhook-alert", message);
  res.status(200).json({ success: true, message  });
});

// Start server
httpServer.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
