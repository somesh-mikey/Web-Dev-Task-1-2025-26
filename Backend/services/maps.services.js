const axios = require("axios");
const captainModel = require("../models/captain.model");
const { query } = require("express-validator");
const mapService = require("../services/maps.services");

/**
 * Get coordinates (latitude and longitude) for a given address using OpenStreetMap Nominatim API.
 * @param {string} address
 * @returns {Promise<{lat: number, lng: number} | null>}
 */
module.exports.getAddressCoordinate = async (address) => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: address,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "Uber-Video-App/1.0 (someshdasbb07@gmail.com)",
        },
      }
    );

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return {
        lat: parseFloat(lat),
        lng: parseFloat(lon),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    return null;
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }
  console.log("Origin:", origin, "Destination:", destination); // Add this line

  const getCoords = async (address) => {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: address,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "Uber-Video-App/1.0 (someshdasbb07@gmail.com)",
        },
        timeout: 15000, // Increase to 15 seconds
      }
    );
    if (response.data && response.data.length > 0) {
      return [
        parseFloat(response.data[0].lon),
        parseFloat(response.data[0].lat),
      ]; // [lng, lat]
    }
    throw new Error(`Could not geocode address: ${address}`);
  };

  try {
    // Run geocoding in parallel
    const [originCoords, destinationCoords] = await Promise.all([
      getCoords(origin),
      getCoords(destination),
    ]);

    const ORS_API_KEY = process.env.ROUTING_API_KEY;
    if (!ORS_API_KEY) {
      throw new Error("OpenRouteService API key is missing");
    }

    const orsResponse = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      {
        coordinates: [originCoords, destinationCoords],
      },
      {
        headers: {
          Authorization: process.env.ROUTING_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 20000, // Increase to 20 seconds
      }
    );

    const summary = orsResponse.data.routes[0].summary;
    return {
      distance: summary.distance, // meters
      duration: summary.duration, // seconds
    };
  } catch (err) {
    console.error(
      "Error fetching distance and time:",
      err.message,
      err.response?.data
    );
    throw new Error("Distance and time not found for the given addresses");
  }
};
module.exports.getDistanceTimeByAddress = async (req, res, next) => {
  if (!input) {
    throw new Error("Query is required");
  }

  const apiKey = process.env.ROUTING_API_KEY;
  const url = `https://api.openrouteservice.org/v2/geocode/search?text=${encodeURIComponent(
    input
  )}&api_key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.features && response.data.features.length > 0) {
      const suggestions = response.data.features.map((feature) => ({
        name: feature.properties.label,
        coordinates: feature.geometry.coordinates, // [lng, lat]
      }));
      res.status(200).json(suggestions);
    } else {
      res.status(404).json({ message: "No suggestions found" });
    }
  } catch (error) {
    console.error("Error fetching suggestions:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("Input is required");
  }

  const apiKey = process.env.ROUTING_API_KEY;
  const url = `https://api.openrouteservice.org/geocode/autocomplete?api_key=${apiKey}&text=${encodeURIComponent(
    input
  )}`;

  try {
    const response = await axios.get(url);
    if (response.data.features && response.data.features.length > 0) {
      return response.data.features.map((feature) => ({
        name: feature.properties.label,
        coordinates: feature.geometry.coordinates, // [lng, lat]
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching suggestions:", error.message);
    throw new Error("Failed to fetch suggestions");
  }
};

module.exports.getCaptainsInTheRadius = async (lat, lng, radius) => {
  const latDelta = radius / 111.32; // radius in kilometers
  const lngDelta = radius / (111.32 * Math.cos((lat * Math.PI) / 180));

  const query = {
    "location.lat": { $gte: lat - latDelta, $lte: lat + latDelta },
    "location.lng": { $gte: lng - lngDelta, $lte: lng + lngDelta },
  };
  console.log("Captain search query:", query);

  const captains = await captainModel.find(query);
  console.log("Captains found:", captains);

  return captains;
};
