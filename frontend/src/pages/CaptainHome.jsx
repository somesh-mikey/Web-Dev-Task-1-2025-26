import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import Map from "../components/Map";

const CaptainHome = () => {
  const [showRidePopUp, setShowRidePopUp] = useState(true);
  const [showConfirmRidePopUp, setShowConfirmRidePopUp] = useState(false);

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);

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
            to="/home"
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
            setShowRidePopUp={setShowRidePopUp}
            setShowConfirmRidePopUp={setShowConfirmRidePopUp}
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
            setShowConfirmRidePopUp={setShowConfirmRidePopUp}
            setShowRidePopUp={setShowRidePopUp}
          />
        )}
      </div>
    </div>
  );
};

export default CaptainHome;
