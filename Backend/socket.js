const { Server } = require("socket.io");
const userModel = require("./models/user.model"); // <-- fixed path
const captinModel = require("./models/captain.model");

let io;
const socketIdMap = new Map();

/**
 * Initializes the Socket.IO server.
 * @param {http.Server} server - The HTTP server instance.
 */
function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173", // Vite default
        "http://localhost:3000", // React default (if you use it)
        "https://35f7ghpf-5173.inc1.devtunnels.ms", // your tunnel
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join", async (data) => {
      const { userId, role } = data;
      console.log('[BACKEND] join event received:', { userId, role, socketId: socket.id });
      if (role == "user") {
        const result = await userModel.findByIdAndUpdate(userId, { socketID: socket.id });
        console.log("[SOCKET] userModel.findByIdAndUpdate result:", result);
        const updatedUser = await userModel.findById(userId);
        console.log("[SOCKET] userModel after update:", updatedUser);
        console.log(`User ${userId} joined with socketID ${socket.id}`);
      } else if (role == "captain") {
        const result = await captinModel.findByIdAndUpdate(userId, { socketID: socket.id });
        console.log("[SOCKET] captinModel.findByIdAndUpdate result:", result);
        const updatedCaptain = await captinModel.findById(userId);
        console.log("[SOCKET] captainModel after update:", updatedCaptain);
        console.log(`Captain connected: ${userId} -> ${socket.id}`);
      }
    });

    // Listen for a user registering their userId
    socket.on("register", (userId) => {
      socketIdMap.set(userId, socket.id);
      console.log(`User registered: ${userId} -> ${socket.id}`);
    });

    socket.on("update-location", async (data) => {
      const { userId, userType, location } = data;
      console.log("Received update-location event:", data);
      if (userType === "captain") {
        try {
          await captinModel.findByIdAndUpdate(userId, {
            location: {
              lat: location.lat,
              lng: location.lng,
            },
          });
          const updatedCaptain = await captinModel.findById(userId);
          console.log(`[SOCKET] Captain location after update:`, updatedCaptain.location);
          console.log(`Updated location for captain ${userId}:`, location);
        } catch (error) {
          console.error(
            `Error updating location for captain ${userId}:`, error
          );
        }
      } else if (userType === "user") {
        try {
          await userModel.findByIdAndUpdate(userId, {
            location: {
              lat: location.lat,
              lng: location.lng,
            },
          });
          const updatedUser = await userModel.findById(userId);
          console.log(`[SOCKET] User location after update:`, updatedUser.location);
          console.log(`Updated location for user ${userId}:`, location);
        } catch (error) {
          console.error(`Error updating location for user ${userId}:`, error);
        }
      }
    });

    // socket.on("captain-accepted", async (data) => {
    //   const { rideId, captainId } = data;
    //   console.log("[SOCKET] captain-accepted event received:", data);
    //   try {
    //     // Fetch the ride with OTP, user, and captain (with vehicle)
    //     const rideModel = require("./models/ride.model");
    //     const ride = await rideModel.findOne({ _id: rideId })
    //       .populate('user')
    //       .populate('captain') // <-- ensure captain is populated
    //       .select('+otp');
    //     console.log('[SOCKET] ride sent to user:', JSON.stringify(ride, null, 2));
    //     if (ride && ride.user && ride.user.socketID) {
    //       console.log("[SOCKET] Emitting otp-assigned to user socketID:", ride.user.socketID);
    //       sendMessageToSocketId(ride.user.socketID, {
    //         event: 'otp-assigned',
    //         data: ride
    //       });
    //     }
    //   } catch (err) {
    //     console.error("[SOCKET] Error handling captain-accepted:", err);
    //   }
    // });

    socket.on("disconnect", () => {
      // Remove disconnected socket from map
      for (const [userId, id] of socketIdMap.entries()) {
        if (id === socket.id) {
          socketIdMap.delete(userId);
          console.log(`User disconnected: ${userId} (${socket.id})`);
          break;
        }
      }
      console.log(`[SOCKET] Socket disconnected: ${socket.id}`);
    });
  });
}

// const sendMessageToSocketId = (socketId, messageObject) => {
//   console.log(`Sending message to ${socketId}`, messageObject);

//   if (io) {
//     io.to(socketId).emit(messageObject.event, messageObject.data);
//   }
// };

/**
 * Sends a message to a specific socket ID.
 * @param {string} socketId - The socket ID to send the message to.
 * @param {string} event - The event name.
 * @param {any} data - The data to send.
 */
const sendMessageToSocketId = (socketId, messageObject) => {
  console.log(`Sending message to ${socketId}`, messageObject);

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io is not initialized.");
  }
};

module.exports = { initializeSocket, sendMessageToSocketId };