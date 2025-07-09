import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmedRide from "../components/ConfirmedRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingforDriver from "../components/WaitingforDriver";
import Map from "../components/Map";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";
import { useContext, useEffect } from "react";
import { UserDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, setUser } = useContext(UserDataContext);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setpanelOpen] = useState(false);
  const [activeField, setActiveField] = useState(""); // "pickup" or "destination"
  const [suggestions, setSuggestions] = useState([]);
  const vechiclePanelRef = useRef(null);
  const confirmedRidePanelRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const WaitingForDriverRef = useRef(null);
  const [vehiclePanel, setvehiclePanel] = useState(false);
  const [confirmedRidePanel, setConfirmedRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [firstName, setFirstName] = useState({});
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicle] = useState(""); // Changed here
  const [ride, setRide] = useState({});

  useEffect(() => {
    console.log('[FRONTEND] join effect check:', { socket, user, userId: user && user._id });
    if (!socket || !user || !user._id) return;
    console.log('[FRONTEND] Emitting join for user', user._id, 'with socket', socket.id);
    socket.emit("join", { userId: user._id, role: "user" });
  }, [socket, user]);

  useEffect(() => {
    if (!socket) return;
    socket.on("ride-confirmed", (data) => {
      console.log("Ride confirmed:", data);
      setVehicleFound(false);
      setWaitingForDriver(true);
      setRide(data);
    });

    return () => {
      socket.off("ride-confirmed");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("otp-assigned", (data) => {
      console.log("OTP assigned event received:", data);
      setRide(data);
      setWaitingForDriver(true);
    });
    return () => {
      socket.off("otp-assigned");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.onAny((event, ...args) => {
      console.log("[SOCKET EVENT]", event, args);
    });
  }, [socket]);

  // Fetch suggestions from backend
  const fetchSuggestions = async (input) => {
    if (!input || input.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:4000/maps/get-suggestions?input=${encodeURIComponent(
          input
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setSuggestions(res.data);
    } catch (err) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("ride-started", (data) => {
      console.log("Ride started:", data);
      setRide(data);
      setWaitingForDriver(false);
      navigate("/riding", { state: { ride: data } });
    });
    return () => socket.off("ride-started");
  }, [socket, navigate]);

  // Global event listener for ride-started (in case user is not on Home page)
  useEffect(() => {
    if (!socket) return;
    const handleRideStarted = (data) => {
      console.log("[GLOBAL] Ride started event received:", data);
      console.log("[GLOBAL] Current pathname:", window.location.pathname);
      if (window.location.pathname !== "/riding") {
        console.log("[GLOBAL] Navigating to /riding");
        navigate("/riding", { state: { ride: data } });
      }
    };

    socket.on("ride-started", handleRideStarted);
    return () => socket.off("ride-started", handleRideStarted);
  }, [socket, navigate]);

  // Handle input changes
  const handlePickupChange = (e) => {
    setPickup(e.target.value);
    setActiveField("pickup");
    setpanelOpen(true);
    fetchSuggestions(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
    setActiveField("destination");
    setpanelOpen(true);
    fetchSuggestions(e.target.value);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (activeField === "pickup") {
      setPickup(suggestion);
    } else if (activeField === "destination") {
      setDestination(suggestion);
    }
    setSuggestions([]);
    setpanelOpen(false);
  };

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "60%",
          padding: 24,
          duration: 0.1,
          ease: "power2.inOut",
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
          duration: 0.1,
          ease: "power2.inOut",
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0%",
          duration: 0.1,
          ease: "power2.inOut",
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
          duration: 0.1,
          ease: "power2.inOut",
        });
      }
    },
    [panelOpen]
  );
  useGSAP(
    function () {
      if (vehiclePanel) {
        gsap.to(vechiclePanelRef.current, {
          translateY: "0%",
          duration: 0.3,
          ease: "power2.inOut",
        });
      } else {
        gsap.to(vechiclePanelRef.current, {
          translateY: "100%",
          duration: 0.3,
          ease: "power2.inOut",
        });
      }
    },
    [vehiclePanel]
  );

  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          translateY: "0%",
          duration: 0.3,
          ease: "power2.inOut",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          translateY: "100%",
          duration: 0.3,
          ease: "power2.inOut",
        });
      }
    },
    [vehicleFound]
  );
  useGSAP(
    function () {
      if (confirmedRidePanel) {
        gsap.to(confirmedRidePanelRef.current, {
          translateY: "0%",
          duration: 0.3,
          ease: "power2.inOut",
        });
      } else {
        gsap.to(confirmedRidePanelRef.current, {
          translateY: "100%",
          duration: 0.3,
          ease: "power2.inOut",
        });
      }
    },
    [confirmedRidePanel]
  );
  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(WaitingForDriverRef.current, {
          translateY: "0%",
          duration: 0.3,
          ease: "power2.inOut",
        });
      } else {
        gsap.to(WaitingForDriverRef.current, {
          translateY: "100%",
          duration: 0.3,
          ease: "power2.inOut",
        });
      }
    },
    [waitingForDriver]
  );

  async function FindTrip() {
    setvehiclePanel(true);
    setpanelOpen(false);

    // Add this log to check the values
    console.log("pickup:", pickup, "destination:", destination);

    try {
      const token = localStorage.getItem("token");
      // Fetch all fares in a single request
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/rides/get-fare`, {
        params: { pickup, destination },
        headers: { Authorization: `Bearer ${token}` },
      });
      setFare(response.data); // response.data is { car: ..., moto: ..., auto: ... }
      console.log(response.data);
    } catch (err) {
      console.error(err);
      setFare({});
    }
  }
  async function createRide(vehicleType) {
    // Validation: ensure all fields are present and non-empty
    if (!pickup || !pickup.trim() || !destination || !destination.trim() || !vehicleType) {
      alert("Please enter valid pickup, destination, and select a vehicle type.");
      console.error("Invalid input:", { pickup, destination, vehicleType });
      return;
    }
    try {
      console.log("Creating ride with:", { pickup, destination, vehicleType });
      console.log("Token:", localStorage.getItem("token"));

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/rides/create`,
        {
          pickup,
          destination,
          vehicleType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Log ride details returned from backend
      console.log("Ride details:", response.data);
    } catch (err) {
      console.error("Error creating ride:", err.response?.data || err);
    }
  }

  return (
    <div className="h-screen relative overflow-header">
      <img
        className="w-16 absolute left-5 top-5 z-20"
        src="/images/Logo1.png"
        alt="Logo"
      />
      {/* Map as background */}
      <div className="h-screen w-screen absolute top-0 left-0 z-0">
        <Map />
      </div>
      {/* Panels and overlays above the map */}
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full z-10 pointer-events-none">
        <div className="h-[30%] p-6 bg-white/90 relative pointer-events-auto">
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setpanelOpen(false);
            }}
            className="absolute opacity-0 right-2 top-6 text-2xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-3xl font-semibold">Find a trip</h4>
          <form className="mt-4">
            <div className="line absolute h-16 w-1 top-[45%] left-10 bg-gray-900 rounded-bl-full"></div>
            <input
              onClick={() => {
                setpanelOpen(true);
                setActiveField("pickup");
                fetchSuggestions(pickup);
              }}
              value={pickup}
              onChange={handlePickupChange}
              className="bg-[#eee] px-8 py-2 rounded-md w-full text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-4"
              type="text"
              placeholder="Add a pickup location"
              autoComplete="off"
            />
            <input
              onClick={() => {
                setpanelOpen(true);
                setActiveField("destination");
                fetchSuggestions(destination);
              }}
              value={destination}
              onChange={handleDestinationChange}
              className="bg-[#eee] px-8 py-2 rounded-md w-full text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-4"
              type="text"
              placeholder="Enter your destination"
              autoComplete="off"
            />
          </form>
          <button
            onClick={FindTrip}
            className="bg-black text-white px-6 py-2 rounded-md mt-2 w-full font-semibold transition hover:bg-gray-900"
          >
            Find Trip
          </button>
        </div>
        <div ref={panelRef} className="bg-white h-0 pointer-events-auto">
          <LocationSearchPanel
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
            panelOpen={panelOpen}
            setpanelOpen={setpanelOpen}
            vehiclePanel={vehiclePanel}
            setvehiclePanel={setvehiclePanel}
          />
        </div>
      </div>
      <div
        ref={vechiclePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white p-3 px-3 py-10 pt-14 pointer-events-auto"
      >
        <VehiclePanel
          fare={fare}
          setConfirmedRidePanel={setConfirmedRidePanel}
          setvehiclePanel={setvehiclePanel}
          setVehicle={setVehicle} // <-- add this line
        />
      </div>
      <div
        ref={confirmedRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white p-3 px-3 py-10 pt-14 pointer-events-auto"
      >
        <ConfirmedRide
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          vehicleType={vehicleType}
          fare={fare} // ✅ Pass the whole object
          setConfirmedRidePanel={setConfirmedRidePanel}
          setvehiclePanel={setvehiclePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>
      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white p-3 px-3 py-10 pt-14 pointer-events-auto"
      >
        <LookingForDriver
          pickup={pickup}
          destination={destination}
          fare={fare[vehicleType]}
          vehicleType={vehicleType} // <-- Make sure this is passed!
          setVehicleFound={setVehicleFound}
        />
      </div>
      <div
        ref={WaitingForDriverRef}
        className="fixed w-full z-10 bottom-0 bg-white p-3 px-3 py-10 pt-14 pointer-events-auto"
      >
        <WaitingforDriver
          ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
          waitingForDriver={waitingForDriver}
        />
      </div>
    </div>
  );
};

export default Home;
