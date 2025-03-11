const express = require("express");
const { authUser } = require("../middleware/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");
const { User } = require("../models/user");

const requestsRouter = express.Router();

requestsRouter.post(
  "/request/send/:status/:toUserId",
  authUser,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type " + status);
      }

      // check if toUserId is valid
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("User not found");
      }

      //check if toUserId is sending request to fromUserId
      if (toUserId === fromUserId) {
        throw new Error("You cannot send request to yourself");
      }

      // check if the user is already connected
      const isAlreadyConnected = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { toUserId, fromUserId },
        ],
      });

      if (isAlreadyConnected) {
        throw new Error("You both are already connected");
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message:
          status === "interested"
            ? `${req.user.firstName} your connection request sent successfully`
            : status === "ignored"
            ? `${req.user.firstName}your connection request was ignored`
            : "Invalid status",
        data,
      });
    } catch (err) {
      res.status(400).send(`Error sending connection request: ${err.message}`);
    }
  }
);

module.exports = requestsRouter;
