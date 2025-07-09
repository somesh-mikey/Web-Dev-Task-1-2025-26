const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/create",
  authMiddleware.authUser,
  body("pickup")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Pickup location is required"),
  body("destination")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Destination location is required"),
  body("vehicleType")
    .isString()
    .isIn(["car", "motorcycle", "three-wheeler"])
    .withMessage("Vehicle type must be one of: car, motorcycle, three-wheeler"),
  rideController.createRide
);
router.get(
  "/get-fare",
  authMiddleware.authUser,

  query("pickup")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Pickup location is required"),
  query("destination")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Destination location is required"),
  rideController.getFare
);

router.post(
  "/confirm",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Valid ride ID is required"),
  body("captainId").isMongoId().withMessage("Valid captain ID is required"),
  body("otp").isString().isLength({ min: 4, max: 4 }).withMessage("Valid 4-digit OTP is required"),
  rideController.confirmRide
);

router.get("/start-ride", authMiddleware.authCaptain,
  query("rideId").isMongoId().withMessage("Valid ride ID is required"),
  query("otp").isString().isLength({ min: 4, max: 4 }).withMessage("Valid 4-digit OTP is required"),
  rideController.startRide
);

module.exports = router;
