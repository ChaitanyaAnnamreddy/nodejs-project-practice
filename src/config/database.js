const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://chaitanya:BI4VRZUuBJqCcIwf@nodejs-practice.ylvda.mongodb.net/DevTinder"
  );
};

module.exports = connectDB;
