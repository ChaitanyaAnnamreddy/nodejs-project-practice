const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
      trim: true,
      index: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Email is invalid",
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return validator.isStrongPassword(value);
        },
        message: (props) =>
          `${props.value} is not a strong password. A strong password must:  
  - Be at least 8 characters long  
  - Contain at least 1 lowercase letter  
  - Contain at least 1 uppercase letter  
  - Contain at least 1 number  
  - Contain at least 1 special character (!@#$%^&* etc.)`,
      },
    },
    age: {
      type: Number,

      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other"],
        message: `{VALUE} is not a valid gender!`,
      },
    },
    photoURL: {
      type: String,
      default:
        "https://www.arihantsugar.com/assets/upload/grid_img/672085056_image.png",
      validate: {
        validator: validator.isURL,
        message: "Invalid URL",
      },
    },
    about: {
      type: String,
      default: "Write about yourself",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ userId: user._id }, "DevTinder@123", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    user.password
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
