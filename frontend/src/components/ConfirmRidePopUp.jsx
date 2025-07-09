import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ConfirmRidePopUp = (props) => {
  const [OTP, setOTP] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formatDistance = (meters) => {
    const kilometres = Math.floor(meters / 1000);
    const remainingMetres = Math.round(meters % 1000);
    return kilometres > 0 ? `${kilometres}.${remainingMetres.toString().padStart(3, '0')} Km` : `${remainingMetres}m`;
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Confirm button clicked, OTP:", OTP, "ride:", props.ride);

    if (!OTP.trim()) {
      setError("Please enter the OTP");
      return;
    }

    // OTP validation will be done on the backend for security

    setIsLoading(true);
    try {
      // Call the confirmRide function with OTP validation
      const confirmedRide = await props.confirmRideWithOTP(props.ride, OTP);
      console.log("Called confirmRideWithOTP");

      // If successful, navigate to captain riding page with ride data
      navigate("/captain-riding", { state: { ride: confirmedRide } });
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors.map(err => err.msg).join(', ');
        setError(validationErrors);
      } else {
        setError("Failed to confirm ride. Please try again.");
      }
      console.error("Error confirming ride:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIgnore = () => {
    props.setShowConfirmRidePopUp(false);
    props.setShowRidePopUp(false);
  };

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0 cursor-pointer"
        onClick={handleIgnore}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">
        Confirm this Ride to Start
      </h3>
      <div className="flex items-center justify-between p-3 mt-4 bg-yellow-400 rounded-lg">
        <div className="flex items-center gap-3">
          <img
            className="h-12 rounded-full object-cover w-10"
            src="images/Woman.jpg"
            alt=""
          />
          <h2 className="text-xl font-medium">
            {props.ride?.user?.fullname?.firstname} {props.ride?.user?.fullname?.lastname}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">
          {formatDistance(props.ride?.distance)}
        </h5>
      </div>
      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-2 p-3 border-b-2">
            <i className="ri-map-pin-user-fill text-blue-500"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.pickup}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 border-b-2">
            <i className="ri-map-pin-2-fill text-red-500"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.destination}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 border-b-2">
            <i className="ri-time-line text-green-500"></i>
            <div>
              <h3 className="text-lg font-medium">Duration</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {formatDuration(props.ride?.duration)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3">
            <i className="ri-currency-line text-green-600"></i>
            <div>
              <h3 className="text-lg font-medium">₹{props.ride?.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Payment</p>
            </div>
          </div>
        </div>
        <div className="mt-6 w-full">
          <form onSubmit={handleConfirm}>
            <input
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
              type="text"
              maxLength="4"
              className="bg-[#eee] px-6 py-4 text-lg font-mono rounded-md w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-4"
              placeholder="Enter 4-digit OTP"
            />
            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-5 flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Confirming..." : "Confirm Ride"}
            </button>
            <button
              type="button"
              onClick={handleIgnore}
              disabled={isLoading}
              className="w-full mt-2 bg-red-600 text-white font-semibold p-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Ignore
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
