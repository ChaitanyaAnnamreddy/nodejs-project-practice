const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Virat",
    lastName: "Kohli",
    email: "virat@gmail.com",
    password: "virat@123",
    age: 38,
    gender: "male",
  };

  const user = new User(userObj); // creating a new user with userObj or creating a new instance of the User model

  try {
    await user.save(); // saving the user to the database
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error adding user:", err.message);
  }
});

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
