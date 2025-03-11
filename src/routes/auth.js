const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

const authRouter = express.Router(); // we can use express.Router() instead of express because it has more features

authRouter.post("/signup", async (req, res) => {
  // app.post or authRouter.post both are same

  try {
    // validation of data
    validateSignUpData(req);
    // extract the data
    const { firstName, lastName, emailId, password } = req.body;

    // encrypt the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send("ERROR: Email already exists");
    }
    res.status(400).send(`ERROR: ${err.message}`);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body; //we get the data from the user
    const user = await User.findOne({ emailId }); // we are finding the user in the database
    if (!user) {
      return res.status(404).send("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password); // we are validating the password
    // if password is valid
    if (isPasswordValid) {
      // create a JWT token
      const token = await user.getJWT();
      // add the token to the cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // 8 hours
      });
      res.send("Login successful");
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send(`Error logging in: ${err.message}`);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .send("Logout successful");
  } catch (err) {
    res.status(400).send(`Error logging out: ${err.message}`);
  }
});

module.exports = authRouter;
