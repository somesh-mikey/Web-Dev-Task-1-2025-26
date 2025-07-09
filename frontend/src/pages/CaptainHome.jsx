import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import Map from "../components/Map";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";
import useGeolocation from "../hooks/useGeolocation"; // Import your geolocation hook
import axios from "axios";

const CaptainHome = () => {
  const navigate = useNavigate();
  const [showRidePopUp, setShowRidePopUp] = useState(false);
  const [showConfirmRidePopUp, setShowConfirmRidePopUp] = useState(false);

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const [ride, setRide] = useState(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);
  const location = useGeolocation(); // Get current location

  useEffect(() => {
    if (!captain) return;
    console.log("Emitting join event:", { userId: captain._id, role: "captain" });
    socket.emit("join", {
      userId: captain._id,
      role: "captain",
    });
  }, [socket, captain]);

  useEffect(() => {
    if (location && location.latitude && location.longitude) {
      console.log("Captain location update:", {
        userId: captain._id,
        location: {
          lat: location.latitude,
          lng: location.longitude,
        },
      });

      socket.emit("update-location", {
        userId: captain._id,
        userType: "captain",
        location: {
          lat: location.latitude,
          lng: location.longitude,
        },
      });
    }
  }, [socket, captain, location]);

  useEffect(() => {
    socket.on("new-ride", (data) => {
      console.log("Received new-ride:", data);
      setRide(data);
      setShowRidePopUp(true);
    });
    return () => socket.off("new-ride");
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("ride-started", (data) => {
      console.log("Ride started:", data);
      navigate("/captain-riding", { state: { ride: data } });
    });
    return () => socket.off("ride-started");
  }, [socket, navigate]);

  async function confirmRide(ride) {
    // This function is called when captain clicks "Accept" in RidePopUp
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/rides/confirm`,
        {
          rideId: ride._id,
          captainId: captain._id,
          otp: ride.otp // If you have a separate OTP input, use that value instead
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setShowRidePopUp(false);
      setShowConfirmRidePopUp(true);
    } catch (error) {
      console.error("Error confirming ride:", error);
    }
  }

  async function confirmRideWithOTP(ride, otp) {
    try {
      console.log("First confirming ride, then starting it:", { rideId: ride._id, otp });

      // Step 1: Confirm the ride (change status to accepted)
      const confirmResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/rides/confirm`,
        {
          rideId: ride._id,
          captainId: captain._id,
          otp: otp
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      console.log("Confirm ride response:", confirmResponse.data);

      console.log("About to make start-ride request...");
      // Step 2: Start the ride (change status to ongoing)
      try {
        const startRideUrl = `${import.meta.env.VITE_BACKEND_URL}/rides/start-ride`;
        console.log("Making start-ride request to:", startRideUrl);
        console.log("With params:", { rideId: ride._id, otp: otp });
        console.log("With headers:", { Authorization: `Bearer ${localStorage.getItem("token")}` });
        const startResponse = await axios.get(
          startRideUrl,
          {
            params: {
              rideId: ride._id,
              otp: otp
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            timeout: 10000 // 10 second timeout
          }
        );
        console.log("Start ride response:", startResponse.data);
      } catch (startError) {
        console.error("Error in start-ride request:", startError);
        console.error("Start error response:", startError.response);
        console.error("Start error message:", startError.message);
        console.error("Start error code:", startError.code);
        throw startError;
      }
      setShowRidePopUp(false);
      setShowConfirmRidePopUp(false);
      return startResponse.data;
    } catch (error) {
      console.error("Error in confirmRideWithOTP:", error);
      throw error;
    }
  }



  useGSAP(
    function () {
      if (showRidePopUp) {
        gsap.to(ridePopupPanelRef.current, {
          translateY: "0%",
          duration: 0.3,
          ease: "power2.inOut",
        });
      } else {
        gsap.to(ridePopupPanelRef.current, {
          translateY: "100%",
          duration: 0.3,
          ease: "power2.inOut",
        });
      }
    },
    [showRidePopUp]
  );

  useGSAP(
    function () {
      if (showConfirmRidePopUp) {
        gsap.to(confirmRidePopupPanelRef.current, {
          translateY: "0%",
          duration: 0.3,
          ease: "power2.inOut",
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          translateY: "100%",
          duration: 0.3,
          ease: "power2.inOut",
        });
      }
    },
    [showConfirmRidePopUp]
  );

  return (
    <div className="relative h-screen w-screen">
      {/* Map as background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Map />
      </div>
      {/* Overlays and panels */}
      <div className="relative z-10 h-full w-full pointer-events-none">
        <div className="fixed p-6 top-0 flex items-center justify-between w-screen pointer-events-auto">
          <img className="w-16" src="images/Logo1.png" alt="" />
          <Link
            to="/login"
            className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
          >
            <i className="text-lg font-medium ri-logout-box-r-line"></i>
          </Link>
        </div>
        <div className="h-3/5"></div>
        <div className="h-2/5 p-6 pointer-events-auto">
          <CaptainDetails />
        </div>
      </div>
      <div
        ref={ridePopupPanelRef}
        className="fixed h-full w-full z-20 bottom-0 translate-y-full bg-white p-3 px-3 py-10 pt-14"
      >
        {showRidePopUp && (
          <RidePopUp
            ride={ride}
            setShowRidePopUp={setShowRidePopUp}
            setShowConfirmRidePopUp={setShowConfirmRidePopUp}
            confirmRide={confirmRide}
          />
        )}
      </div>
      {/* ConfirmRidePopUp */}
      <div
        ref={confirmRidePopupPanelRef}
        className="fixed h-full w-full z-20 bottom-0 translate-y-full bg-white p-3 px-3 py-10 pt-14"
      >
        {showConfirmRidePopUp && (
          <ConfirmRidePopUp
            ride={ride}
            setShowConfirmRidePopUp={setShowConfirmRidePopUp}
            setShowRidePopUp={setShowRidePopUp}
            confirmRideWithOTP={confirmRideWithOTP}
          />
        )}
      </div>
    </div>
  );
};

export default CaptainHome;
