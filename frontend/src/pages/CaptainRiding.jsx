import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import FinishRide from "../components/FinishRide";
// If you use GSAP and useGSAP, make sure to import them
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Map from "../components/Map"; // Import the Map component

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const [showRidePopUp, setShowRidePopUp] = useState(false); // Added missing state
  const finishRidePanelRef = useRef(null);

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          translateY: "0%",
          duration: 0.3,
          ease: "power2.inOut",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          translateY: "100%",
          duration: 0.3,
          ease: "power2.inOut",
        });
      }
    },
    [finishRidePanel]
  );
  return (
    <div className="h-screen relative">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <img className="w-16" src="images/Logo1.png" alt="" />
        <Link
          to="/captain-home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className="h-4/5">
        <Map />
      </div>
      <div
        className="h-1/5 p-6 items-center justify-between relative bg-yellow-400"
        onClick={() => setFinishRidePanel(true)}
      >
        <h5
          className="p-1 text-center w-[95%] absolute top-0"
          onClick={() => window.history.back()}
        >
          {" "}
          <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
        </h5>
        <h4 className="text-xl font-semibold">4 KM away</h4>
        <button
          className="mt-5 bg-green-600 text-white font-semibold p-3 px-10 rounded-lg"
          onClick={() => setShowRidePopUp(true)}
        >
          Complete Ride
        </button>
      </div>
      <div
        ref={finishRidePanelRef}
        className="fixed h-full w-full z-10 bottom-0 translate-y-full bg-white p-3 px-3 py-10 pt-14"
      >
        {showRidePopUp && (
          <FinishRide setFinishRidePanel={setFinishRidePanel} />
        )}
      </div>
    </div>
  );
};

export default CaptainRiding;
