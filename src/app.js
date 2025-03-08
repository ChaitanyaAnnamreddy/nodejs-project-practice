const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json()); // This middleware parses incoming requests with JSON payloads for all the routes

app.post("/signup", async (req, res) => {
  const user = new User(req.body); // we created a new user with req.body or we can say we created a new instance of the User model
  // whoever sends the post request to the /signup route, a new user instance is created
  // now we will save this user to the database
  try {
    await user.save(); // saving the user to the database, also we can say document is saved to the database
    res.send("User added successfully");
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send("Error: Email already exists");
    }
    res.status(400).send(`Error adding user: ${err.message}`);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send(`Error retrieving users: ${err.message}`);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send(`Error deleting user: ${err.message}`);
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const updates = req.body;

  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send(`Error updating user: ${err.message}`);
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
