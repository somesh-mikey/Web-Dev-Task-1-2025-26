import React from "react";

const RidePopUp = (props) => {
  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => props.setRidePopupPanel(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">New Ride for You</h3>
      <div className="flex items-center justify-between p-3 mt-4 bg-yellow-400 rounded-lg">
        <div className="flex items-center gap-3">
          <img
            className="h-12 rounded-full object-cover w-10"
            src="images/Woman.jpg"
            alt=""
          />
          <h2 className="text-xl font-medium">Seong Hu</h2>
        </div>
        <h5 className="text-lg font-semibold">2.2 Km</h5>
      </div>
      <div className="flex gap-2 justify-between flex-col items-center">
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
        <div className="flex w-full items-center justify-between">
          <button
            onClick={() => {
              props.setShowRidePopUp(false);
            }}
            className="mt-1 bg-gray-300 text-white-700 font-semibold p-2 px-10 rounded-lg"
          >
            Ignore
          </button>
          <button
            onClick={() => {
              props.setShowRidePopUp(false);
              props.setShowConfirmRidePopUp(true);
            }}
            className="mt-5 bg-green-600 text-white font-semibold p-3 px-10 rounded-lg"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default RidePopUp;
