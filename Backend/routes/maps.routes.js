const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { query } = require("express-validator");
const mapController = require("../controllers/map.controller");
const mapService = require("../services/maps.services");

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
router.get(
  "/nearby-captains",
  query("lat").isFloat().withMessage("Latitude required"),
  query("lng").isFloat().withMessage("Longitude required"),
  query("radius").optional().isFloat(),
  async (req, res) => {
    const { lat, lng, radius = 1000 } = req.query;
    try {
      const captains = await mapService.getCaptainsInTheRadius(
        parseFloat(lat),
        parseFloat(lng),
        parseFloat(radius)
      );
      res.json(captains);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch captains", error: err.message });
    }
  }
);

module.exports = router;
