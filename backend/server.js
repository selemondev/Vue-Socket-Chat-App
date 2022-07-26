const express = require('express');
const dotenv = require("dotenv").config();
const colors = require("colors");
const cors = require('cors');
const connectDB = require("./config/db");
const { errorMiddleware } = require("./middleware/errorMiddleware");
const authRoute = require("./routes/authRoutes");
const messageRoute = require("./routes/messageRoutes");
const PORT = process.env.PORT || 5000;
const socket = require("socket.io")
const app = express();
connectDB();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute)
app.use(errorMiddleware);
const server = app.listen(PORT, () => {
    console.log(`Server is listening on Port ${PORT}`)
});

const io = socket(server, {
    cors: {
        origin: "http://127.0.0.1:5173",
        credentials: true,
    }
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.emit("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.emit("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-received", data.text)
        }
    });
});
