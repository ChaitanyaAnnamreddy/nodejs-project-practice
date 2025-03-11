const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const authUser = async (req, res, next) => {
  try {
    // read the token from the req.cookies
    const cookie = req.cookies;
    const { token } = cookie;

    if (!token) {
      throw new Error("Invalid token");
    }
    // validate the token
    const decoded = await jwt.verify(token, "DevTinder@123");
    // find the user based on the userId from the token
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error("User not found");
    }
    // attach the user to the request
    req.user = user;
    // proceed to the next middleware
    next();
  } catch (err) {
    res.status(400).send(`Error authenticating user: ${err.message}`);
  }
};

module.exports = { authUser };
