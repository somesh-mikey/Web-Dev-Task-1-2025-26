import React from "react";

const ConfirmedRide = (props) => {
  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => props.setvehiclePanel(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h2 className="text-2xl font-semibold">Confirm your Ride</h2>

      <div className="flex gap-2 justify-between flex-col items-center">
        <img className="h-20" src="images/Car.png" alt="Car" />
      </div>
      <div className="w-full mt-5">
        <div className="flex items-center gap-2 p-3 border-b-2">
          <i className="ri-map-pin-user-fill"></i>
          <div>
            <h3 className="text-lg font-medium">562/11-A</h3>
            <p className="text-sm -mt-1 text-gray-600">
              Kankariya Talab, Ahmedabad
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 border-b-2">
          <i className="ri-map-pin-2-fill"></i>
          <div>
            <h3 className="text-lg font-medium">562/11-A</h3>
            <p className="text-sm -mt-1 text-gray-600">
              Kankariya Talab, Ahmedabad
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3">
          <i className="ri-currency-line"></i>
          <div>
            <h3 className="text-lg font-medium">₹193.20</h3>
            <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          props.setVehicleFound(true);
          props.setConfirmedRidePanel(false);
        }}
        className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg"
      >
        Confirm
      </button>
    </div>
  );
};

export default ConfirmedRide;
