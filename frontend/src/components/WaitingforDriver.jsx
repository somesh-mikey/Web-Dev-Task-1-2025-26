import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

const WaitingforDriver = (props) => {
  const { socket } = useSocket();
  const [otp, setOtp] = useState(props.ride?.otp || null);

  useEffect(() => {
    if (!socket) return;
    const handleOtpAssigned = (ride) => {
      if (ride && ride.otp) {
        setOtp(ride.otp);
      }
    };
    socket.on("otp-assigned", handleOtpAssigned);
    return () => {
      socket.off("otp-assigned", handleOtpAssigned);
    };
  }, [socket]);

  // Extract driver/captain and vehicle details from captain object
  const captain = props.ride?.captain;
  const driverName = captain?.fullname?.firstname && captain?.fullname?.lastname
    ? `${captain.fullname.firstname} ${captain.fullname.lastname}`
    : captain?.fullname?.firstname || "";
  const vehicle = captain?.vehicle || {};
  const plateNumber = vehicle.plate || "";
  const carColor = vehicle.color || "";
  const vehicleType = vehicle.vehicleType || props.ride?.vehicle?.vehicleType || "";

  return (
    <div>
      <div>
        <h5
          className="p-1 text-center w-[93%] absolute top-0"
          onClick={() => props.WaitingforDriver(false)}
        >
          <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
        </h5>
        {otp && (
          <div className="my-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded shadow">
            <h3 className="text-lg font-bold text-yellow-800 mb-2 flex items-center gap-2">
              <i className="ri-key-fill"></i> Your OTP
            </h3>
            <div className="text-2xl font-mono font-bold text-yellow-900 tracking-widest mb-2">{otp}</div>
            <p className="text-yellow-700">Share this OTP with your driver to start the ride.</p>
          </div>
        )}
        {/* Driver and Vehicle Details Card */}
        <div className="my-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded shadow">
          <h3 className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
            <i className="ri-user-2-fill"></i> Your Driver
          </h3>
          <div className="flex items-center gap-4">
            <img className="h-12 w-12 rounded-full border-2 border-blue-300 object-cover" src="images/Driver.png" alt="Driver" />
            <div>
              <div className="font-semibold text-lg text-blue-900">{driverName}</div>
              <div className="text-sm text-gray-700 flex items-center gap-1 mt-1">
                <i className="ri-car-fill"></i>
                <span className="font-medium">{carColor}</span>
                <span className="mx-1">|</span>
                <span className="font-mono">{plateNumber}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{vehicleType}</div>
            </div>
          </div>
        </div>
        {/* Trip Details */}
        <div className="w-full mt-5">
          <div className="flex items-center gap-2 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup Location</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.pickup}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 border-b-2">
            <i className="ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.destination}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{props.ride?.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingforDriver;
