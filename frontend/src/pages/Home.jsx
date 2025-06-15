import React, { use, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmedRide from "../components/ConfirmedRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingforDriver from "../components/WaitingforDriver";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setpanelOpen] = useState(false);
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

  const submitHandler = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted");
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
  return (
    <div className="h-screen relative overflow-header">
      <img
        className="w-16 absolute left-5 top-5 z-20"
        src="/images/Logo1.png"
        alt="Logo"
      />
      <div className="h-screen w-screen absolute top-0 left-0 z-0">
        {/*image for temporary use*/}
        <img
          className="h-full w-full object-cover"
          src="/images/Map.png"
          alt="Map"
        />
      </div>
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full z-10">
        <div className="h-[30%] p-6 bg-white/90 relative">
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
          <form onSubmit={submitHandler} className="mt-4">
            <div className="line absolute h-16 w-1 top-[45%] left-10 bg-gray-900 rounded-bl-full"></div>
            <input
              onClick={() => setpanelOpen(true)}
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="bg-[#eee] px-8 py-2 rounded-md w-full text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-4"
              type="text"
              placeholder="Add a pickup location"
            />
            <input
              onClick={() => setpanelOpen(true)}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-[#eee] px-8 py-2 rounded-md w-full text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-4"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
        </div>
        <div ref={panelRef} className=" bg-white h-0">
          <LocationSearchPanel
            panelOpen={panelOpen}
            setpanelOpen={setpanelOpen}
            vehiclePanel={vehiclePanel}
            setvehiclePanel={setvehiclePanel}
          ></LocationSearchPanel>
        </div>
      </div>
      <div
        ref={vechiclePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white p-3 px-3 py-10 pt-14"
      >
        <VehiclePanel
          setConfirmedRidePanel={setConfirmedRidePanel}
          setvehiclePanel={setvehiclePanel}
        ></VehiclePanel>
      </div>
      <div
        ref={confirmedRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white p-3 px-3 py-10 pt-14"
      >
        <ConfirmedRide
          setConfirmedRidePanel={setConfirmedRidePanel}
          setvehiclePanel={setvehiclePanel}
          setVehicleFound={setVehicleFound}
        ></ConfirmedRide>
      </div>
      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white p-3 px-3 py-10 pt-14"
      >
        <LookingForDriver setVehicleFound={setVehicleFound}></LookingForDriver>
      </div>
      <div
        ref={WaitingForDriverRef}
        className="fixed w-full z-10 bottom-0 bg-white p-3 px-3 py-10 pt-14"
      >
        <WaitingforDriver
          waitingForDriver={waitingForDriver}
        ></WaitingforDriver>
      </div>
    </div>
  );
};

export default Home;
