const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  console.log(req.body);
  const { fullname, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ email });
  if (isUserAlreadyExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  // Destructure firstname and lastname from fullname object
  const { firstname, lastname } = fullname;

  // Call hashPassword as a static method
  const hashedPassword = await userModel.hashPassword(password);
  const user = await userService.createUser({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });

  const token = await user.generateAuthToken();
  res.status(201).json({ token, user });
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = await user.generateAuthToken();

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ token, user });
};

module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json({ user: req.user });
};

module.exports.logoutUser = async (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    await userService.blacklistToken(token);
    res.clearCookie("token"); // Clear the token cookie if applicable
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to log out", error: error.message });
  }
};

module.exports.signup = async (req, res) => {
  try {
    const { email, password, fullname } = req.body;
    if (!fullname || !fullname.firstname || !fullname.lastname) {
      return res.status(400).json({ message: "Full name is required" });
    }
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await userModel.hashPassword(password);

    // Use the service to create the user, enforcing correct structure
    const newUser = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


