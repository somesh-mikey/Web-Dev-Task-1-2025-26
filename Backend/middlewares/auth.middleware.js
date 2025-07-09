const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklistToken.model");
const captainModel = require("../models/captain.model");

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log('[AUTH] No token provided');
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isBlacklisted = await blacklistTokenModel.findOne({ token });
  if (isBlacklisted) {
    console.log('[AUTH] Token is blacklisted');
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[AUTH] Decoded token:', decoded);
    const user = await userModel.findById(decoded._id).select("-password");
    console.log('[AUTH] User lookup result:', user);
    if (!user) {
      console.log('[AUTH] No user found for decoded _id');
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    return next();
  } catch (error) {
    console.log('[AUTH] JWT verification error:', error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports.authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isBlacklisted = await blacklistTokenModel.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel
      .findById(decoded._id)
      .select("-password");
    if (!captain) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.captain = captain;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
