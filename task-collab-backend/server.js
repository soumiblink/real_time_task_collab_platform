require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const boardRoutes = require("./routes/boards");
const listRoutes = require("./routes/lists");
const taskRoutes = require("./routes/tasks");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/tasks", taskRoutes);

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinBoard", (boardId) => {
    socket.join(boardId);
  });
});

server.listen(process.env.PORT, () =>
  console.log("Server running on port", process.env.PORT)
);
