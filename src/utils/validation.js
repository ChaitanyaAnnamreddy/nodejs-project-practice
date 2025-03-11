const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First and last name are required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is invalid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "photoURL",
    "age",
    "about",
    "skills",
  ];

  for (const field of Object.keys(req.body)) {
    if (!allowedEditFields.includes(field)) {
      return `Editing "${field}" is not allowed`;
    }
  }

  if ("age" in req.body && isNaN(req.body.age)) {
    return "Age must be a valid number";
  }

  if ("skills" in req.body && !Array.isArray(req.body.skills)) {
    return "Skills must be an array";
  }

  return null; // ✅ No errors
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
