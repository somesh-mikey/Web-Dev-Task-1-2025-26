import React, { useState } from "react";

const vehicleImages = {
  car: "images/Car.png",
  motorcycle: "images/Bike.png",
  "three-wheeler": "images/Auto.png",
};

const ConfirmedRide = (props) => {
  const [passenger, setPassenger] = useState(null);

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          props.setConfirmedRidePanel(false); // Hide ConfirmedRide panel
          props.setvehiclePanel(false);       // Optionally hide vehicle panel too
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h2 className="text-2xl font-semibold">Confirm your Ride</h2>

      <div className="flex gap-2 justify-between flex-col items-center">
        <img
          className="h-20"
          src={vehicleImages[props.vehicleType] || "images/Car.png"}
          alt={props.vehicleType || "car"}
        />
      </div>
      <div className="w-full mt-5">
        <div className="flex items-center gap-2 p-3 border-b-2">
          <i className="ri-map-pin-user-fill"></i>
          <div>
            <h3 className="text-lg font-medium">Pickup Location</h3>
            <p className="text-sm -mt-1 text-gray-600">{props.pickup}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 border-b-2">
          <i className="ri-map-pin-2-fill"></i>
          <div>
            <h3 className="text-lg font-medium">Dropoff Location</h3>
            <p className="text-sm -mt-1 text-gray-600">{props.destination}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3">
          <i className="ri-currency-line"></i>
          <div>
            <h3 className="text-lg font-medium">
              ₹
              {props.fare &&
                props.vehicleType &&
                props.fare[props.vehicleType] !== undefined
                ? props.fare[props.vehicleType]
                : "Fare not available"}
            </h3>
            <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          props.setVehicleFound(true);
          props.setConfirmedRidePanel(false);
          props.createRide(props.vehicleType);
        }}
        className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg"
      >
        Confirm
      </button>
    </div>
  );
};

export default ConfirmedRide;
