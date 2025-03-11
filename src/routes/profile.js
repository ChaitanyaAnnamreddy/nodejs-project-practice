const express = require("express");
const { authUser } = require("../middleware/auth");

const profileRouter = express.Router();

profileRouter.get("/profile/view", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send(`Error retrieving user: ${err.message}`);
  }
});

profileRouter.patch("/profile/edit", authUser, async (req, res) => {
  try {
    const user = req.user;
    const { firstName, lastName, photoURL, age, about, skills } = req.body;
    if (firstName) {
      user.firstName = firstName;
    }
    if (lastName) {
      user.lastName = lastName;
    }
    if (photoURL) {
      user.photoURL = photoURL;
    }
    if (age) {
      user.age = age;
    }
    if (about) {
      user.about = about;
    }
    if (skills) {
      user.skills = skills;
    }

    await user.save();
    res.send("Profile updated successfully");
  } catch (err) {
    res.status(400).send(`Error updating profile: ${err.message}`);
  }
});

module.exports = profileRouter;
