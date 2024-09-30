import express from "express";
import cors from "cors";
import { connectDB } from "./model/connection";
import userRouter from "./routes/userRouter";
import adminRouter from "./routes/adminRouter";
import counsellorRouter from "./routes/counsellorRouter";
import { PORT } from "./config";
import http from "http";
import { Server } from "socket.io";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swaggerConfig"; // Import your Swagger config

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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/counsellor", counsellorRouter);

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

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFuamlybyBTYW5vIiwidXNlcklkIjoiVVNFUkI2elZjVXNDRjA3MDQiLCJlbWFpbCI6Im1zYW5vNDE4OUBnbWFpbC5jb20iLCJyb2xlSWQiOiJST0xFdXZzQk1Zb3BCMDIiLCJyb2xlTmFtZSI6IlN1cHBvcnRBZG1pbiIsImdvb2dsZVRva2VuIjoieWEyOS5hMEFjTTYxMnp3eXdUa3A4Mnd0WlBYOWtFUWp4NTlnNVlBVnJYQnBlTG1EMW5oTlFZQUhuWDBQVDhwOGZPRkVJdW5XM3FzYlg4NzhoakxuLWtNeFgtWWF3Y0VqVmJLeVhXdGpPVlZuOEFyVFdYREl5OS1rejV4MlQwVTl5Yl9RRHRNNUx3SlQ4clFkTlN2UWtmOU9IeGhfSmMtRkRDMVc2T3pGVzhhQ2dZS0FjRVNBUkFTRlFIR1gyTWlhd3RxdGV1VzZSemhSVjk1dC1VM0RBMDE3MCIsInN0YXR1cyI6InRydWUiLCJpYXQiOjE3Mjc3MDA4OTMsImV4cCI6MTcyNzc4NzI5M30.vZ5DJq2SdURa-KirwXnUrrZyf5B48jNMkHPwYDblvR4