const rideModel = require("../models/ride.model");
const mapService = require("../services/maps.services");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return { hours, minutes };
}

function formatDistance(meters) {
  const kilometres = Math.floor(meters / 1000);
  const remainingMetres = Math.round(meters % 1000);
  return { kilometres, metres: remainingMetres };
}

async function getFare(pickup, destination, vehicleType) {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required to calculate fare");
  }
  const distanceTime = await mapService.getDistanceTime(pickup, destination);
  const { distance, duration } = distanceTime;

  const baseFares = {
    car: 50,
    motorcycle: 30,
    "three-wheeler": 40,
  };
  const perKmRates = {
    car: 15,
    motorcycle: 8,
    "three-wheeler": 10,
  };
  const perMinRates = {
    car: 2,
    motorcycle: 1,
    "three-wheeler": 1.5,
  };

  if (!baseFares[vehicleType]) {
    throw new Error("Invalid vehicle type");
  }

  const fare =
    baseFares[vehicleType] +
    perKmRates[vehicleType] * (distance / 1000) +
    perMinRates[vehicleType] * (duration / 60);

  return Math.round(fare);
}

function getOTP(num) {
  if (num <= 0) throw new Error("Number of digits must be positive");
  const max = Math.pow(10, num);
  const otpNum = crypto.randomInt(0, max);
  const otp = otpNum.toString().padStart(num, "0");
  return otp;
}

module.exports.createRide = async ({
  user,
  pickup,
  destination,
  vehicleType,
}) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("User, pickup, destination and vehicle type are required");
  }
  const distanceTime = await mapService.getDistanceTime(pickup, destination);
  const fare = await getFare(pickup, destination, vehicleType);

  // Format duration and distance
  const formattedDuration = formatDuration(distanceTime.duration);
  const formattedDistance = formatDistance(distanceTime.distance);

  const ride = new rideModel({
    user,
    pickup,
    destination,
    otp: getOTP(4), // Generate a 6-digit OTP
    vehicleType,
    fare,
    distance: distanceTime.distance,
    duration: distanceTime.duration,
  });

  // Add formatted fields to the returned object
  return {
    ...ride.toObject(),
    formattedDuration,
    formattedDistance,
  };
};
