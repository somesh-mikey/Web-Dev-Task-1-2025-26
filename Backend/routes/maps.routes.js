const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { query } = require("express-validator");
const mapController = require("../controllers/map.controller");

router.get(
  "/coordinate",
  query("address")
    .isString()
    .isLength({ min: 3 })
    .notEmpty()
    .withMessage("Address is required"),
  authMiddleware.authUser, // or authMiddleware.authCaptain if for captains
  mapController.getCoordinate
);
router.get(
  "/get-distance-time",
  query("origin")
    .isString()
    .isLength({ min: 3 })
    .notEmpty()
    .withMessage("Origin address is required"),
  query("destination")
    .isString()
    .isLength({ min: 3 })
    .notEmpty()
    .withMessage("Destination address is required"),
  authMiddleware.authUser, // or authMiddleware.authCaptain if for captains
  mapController.getDistanceTime
);
router.get(
  "/get-suggestions",
  query("input")
    .isString()
    .isLength({ min: 3 })
    .notEmpty()
    .withMessage("Input is required"),
  authMiddleware.authUser, // or authMiddleware.authCaptain if for captains
  mapController.getAutoCompleteSuggestions
);

module.exports = router;
