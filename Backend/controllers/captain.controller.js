const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const BlacklistTokenModel = require("../models/blacklistToken.model");
const { validationResult } = require("express-validator");

module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  console.log(req.body);
  const { fullname, email, password, vehicle } = req.body;

  const isCaptainAlreadyExists = await captainModel.findOne({ email });
  if (isCaptainAlreadyExists) {
    return res.status(409).json({ message: "Captain already exists" });
  }

  const hashedPassword = await captainModel.hashPassword(password);
  const captain = await captainService.createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
  });

  const token = await captain.generateAuthToken();
  res.status(201).json({ token, captain });
};

module.exports.loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  const captain = await captainModel.findOne({ email }).select("+password");
  if (!captain) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordMatch = await captain.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = await captain.generateAuthToken();
  res.status(200).json({ token, captain });
};

module.exports.getCaptainProfile = async (req, res, next) => {
  const captain = await captainModel
    .findById(req.captain._id)
    .select("-password");
  if (!captain) {
    return res.status(404).json({ message: "Captain not found" });
  }
  res.status(200).json({ captain });
};

module.exports.logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  await captainModel.findByIdAndUpdate(req.captain._id, { token: null });
  await captainModel.blacklistToken(token);
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
