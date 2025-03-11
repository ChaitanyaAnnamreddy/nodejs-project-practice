const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");

const app = express();

app.use(cookieParser()); // This middleware parses the cookies from the request - when the user logs in we will be able to read the cookie
app.use(express.json()); // This middleware parses incoming requests with JSON payloads for all the routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);

connectDB()
  .then(() => {
    console.log("MongoDB database connected");
    const PORT = 7777;
    app.listen(PORT, () => {
      console.log(`Server is successfully listening on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

module.exports = app;
