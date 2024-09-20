import express from "express";
import cors from "cors";
import { connectDB } from "./model/connection";
import userRouter from "./routes/userRouter";
import { PORT } from "./config";
import adminRouter from "./routes/adminRouter";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

connectDB();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", userRouter);
app.use("/admin", adminRouter);

io.on("connection", (socket) => {
  console.log("A User Connected:", socket.id);

  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
