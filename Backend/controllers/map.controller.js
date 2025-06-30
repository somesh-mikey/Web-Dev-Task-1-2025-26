const mapService = require("../services/maps.services");
const { validationResult } = require("express-validator");

module.exports.getCoordinate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ message: "Address is required" });
  }
  try {
    const coordinates = await mapService.getAddressCoordinate(address);
    if (!coordinates) {
      return res
        .status(404)
        .json({ message: "Coordinates not found for the given address" });
    }
    res.status(200).json(coordinates);
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports.getDistanceTime = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { origin, destination } = req.query;
    if (!origin || !destination) {
      return res.status(400).json({
        message: "Origin and destination addresses are required",
      });
    }
    const distanceTime = await mapService.getDistanceTime(origin, destination);
    if (!distanceTime) {
      return res.status(404).json({
        message: "Distance and time not found for the given addresses",
      });
    }
    res.status(200).json(distanceTime);
  } catch (err) {
    console.error("Error fetching distance and time:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { input } = req.query;
    const suggestions = await mapService.getAutoCompleteSuggestions(input);
    if (!suggestions || suggestions.length === 0) {
      return res.status(404).json({ message: "No suggestions found" });
    }
    res.status(200).json(suggestions);
  } catch (error) {
    console.error("Error fetching suggestions:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
