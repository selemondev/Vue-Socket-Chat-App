const express = require('express');
const dotenv = require("dotenv").config();
const colors = require("colors");
const cors = require('cors');
const connectDB = require("./config/db");
const { errorMiddleware } = require("./middleware/errorMiddleware");
const authRoute = require("./routes/authRoutes");
const messageRoute = require("./routes/messageRoute");
const chatRoute = require("./routes/chatRoute");
const PORT = process.env.PORT || 5000;
const app = express();
connectDB();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoute);
app.use("/api/messages", messageRoute);
app.use(errorMiddleware);
app.listen(PORT, () => {
console.log(`Server is listening on Port ${PORT}`);
});