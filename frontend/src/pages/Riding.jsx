import React from "react";
import { Link, useLocation } from "react-router-dom";
import Map from "../components/Map";

const Riding = () => {
  const location = useLocation();
  const ride = location.state?.ride;

  return (
    <div className="h-screen">
      <Link
        to="/home"
        className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full"
      >
        <i className="text-lg font-medium" class="ri-home-5-line"></i>
      </Link>
      <div className="h-1/2">
        <Map />
      </div>
      <div className="h-1/2 p-4">
        <div className="flex items-center justify-between">
          <img className="h-12" src="images/Car.png" alt="" />
          <div className="text-right">
            <h2 className="text-lg font-medium">{ride?.captain?.fullname?.firstname} {ride?.captain?.fullname?.lastname}</h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">{ride?.captain?.vehicle?.plate}</h4>
            <p className="text-sm text-gray-600">{ride?.captain?.vehicle?.vehicleType}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 border-b-2">
          <i className="ri-map-pin-2-fill"></i>
          <div>
            <h3 className="text-lg font-medium">{ride?.pickup}</h3>
            <p className="text-sm -mt-1 text-gray-600">
              {ride?.destination}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3">
          <i className="ri-currency-line"></i>
          <div>
            <h3 className="text-lg font-medium">₹{ride?.fare}</h3>
            <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
          </div>
        </div>
        <button className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg">
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
