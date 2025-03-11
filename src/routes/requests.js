const express = require("express");
const { authUser } = require("../middleware/auth");
const { User } = require("../models/user");

const requestsRouter = express.Router();

requestsRouter.post("/sendConnectionRequest", authUser, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.body.toUserId;

    const user = await User.findByIdAndUpdate(
      { _id: toUserId },
      { $push: { connections: fromUserId } },
      { new: true }
    );
    res.send(user.firstName + " Connection request sent");
  } catch (err) {
    res.status(400).send(`Error sending connection request: ${err.message}`);
  }
});

module.exports = requestsRouter;
