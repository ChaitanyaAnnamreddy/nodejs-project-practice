const express = require("express");
const { authUser } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");

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
    const validationError = validateEditProfileData(req);
    if (validationError) {
      throw new Error(validationError);
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();
    res.json({
      status: "success",
      message: `${loggedInUser.firstName}'s profile has been updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send(`Error updating profile: ${err.message}`);
  }
});

profileRouter.patch("/profile/password", authUser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current and new passwords are required" });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        error: "New password cannot be the same as the current password",
      });
    }

    const loggedInUser = req.user;

    // Verify the current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      loggedInUser.password
    );
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 is the salt rounds
    loggedInUser.password = hashedPassword;

    // Save the updated user
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your password has been updated successfully 🎉`,
    });
  } catch (err) {
    console.error("Password update error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = profileRouter;
