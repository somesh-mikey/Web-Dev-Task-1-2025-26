const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.services');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');


module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });

        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        if (!pickupCoordinates) {
            return res.status(400).json({ message: "Could not geocode pickup address" });
        }
        const captainsInRadius = await mapService.getCaptainsInTheRadius(
            pickupCoordinates.lat,
            pickupCoordinates.lng,
            1000000 // 5 km radius
        );

        ride.otp = ""

        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user').select('+otp');

        captainsInRadius.map(captain => {
            sendMessageToSocketId(captain.socketID, {
                event: 'new-ride',
                data: rideWithUser
            })
        });

        res.status(201).json(ride); // <-- Only send response once, after all logic
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }

};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        // Fetch ride with OTP for the user
        const rideWithOtp = await rideModel.findOne({ _id: rideId })
            .populate('user')
            .populate('captain')
            .select('+otp');

        if (rideWithOtp && rideWithOtp.user && rideWithOtp.user.socketID) {
            sendMessageToSocketId(rideWithOtp.user.socketID, {
                event: 'otp-assigned',
                data: rideWithOtp
            });
        }

        console.log("[BACKEND] ride object in confirmRide:", ride);
        console.log("[BACKEND] ride.user:", ride.user);
        console.log("[BACKEND] About to send ride-confirmed to user socketID:", ride.user && ride.user.socketID, "rideId:", ride._id);

        sendMessageToSocketId(ride.user && ride.user.socketID, {
            event: 'ride-confirmed',
            data: ride
        });
        console.log("[BACKEND] ride-confirmed event sent (if socketID was valid)");

        return res.status(200).json(rideWithOtp);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;
    console.log("[START RIDE] Request received:", { rideId, otp, captain: req.captain?._id });

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });
        console.log("[START RIDE] Service completed successfully");

        // Fetch the ride with updated status and populated data
        const updatedRide = await rideModel.findOne({ _id: rideId })
            .populate('user')
            .populate('captain')
            .select('+otp');

        console.log("Updated ride:", updatedRide);
        console.log("[START RIDE] About to emit ride-started event");

        sendMessageToSocketId(updatedRide.user.socketID, {
            event: 'ride-started',
            data: updatedRide
        })

        // Also emit to captain
        sendMessageToSocketId(updatedRide.captain.socketID, {
            event: 'ride-started',
            data: updatedRide
        });

        console.log("[START RIDE] Events emitted, sending response");
        return res.status(200).json(updatedRide);
    } catch (err) {
        console.error("[START RIDE] Error:", err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketID, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } 
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;
}