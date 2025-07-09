import React from "react";

const VehiclePanel = (props) => {
  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => props.setvehiclePanel(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h2 className="text-2xl font-semibold">Choose a vehicle</h2>
      <div
        onClick={() => {
          props.setConfirmedRidePanel(true);
          props.setVehicle("car");
        }}
        className="flex border-2 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between"
      >
        <img className="h-15 " src="/images/Car.png" alt="" />
        <div className="w-1/2 px-3">
          <h4 className="font-medium text-sm">
            UberGo{" "}
            <span>
              <i className="ri-user-3-fill">4</i>
            </span>
          </h4>
          <h5 className="font-medium text-lg">2 mins away</h5>
          <p className="font-normal text-xs text-gray-600">
            Affordable, compact rides
          </p>
        </div>
        <h2 className="text-xl font-semibold">
          {props.fare.car !== undefined ? `₹${props.fare.car}` : "—"}
        </h2>
      </div>
      <div
        onClick={() => {
          props.setConfirmedRidePanel(true);
          props.setVehicle("motorcycle");
        }}
        className="flex border-2 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between"
      >
        <img className="h-12 px-3" src="/images/Bike_cropped.png" alt="" />
        <div className="w-1/2">
          <h4 className="font-medium text-sm px--10">
            Moto{" "}
            <span>
              <i className="ri-user-3-fill">1</i>
            </span>
          </h4>
          <h5 className="font-medium text-lg">3 mins away</h5>
          <p className="font-normal text-xs text-gray-600">
            Affordable, motorcycle rides
          </p>
        </div>
        <h2 className="text-xl font-semibold">
          {props.fare.moto !== undefined ? `₹${props.fare.moto}` : "—"}
        </h2>
      </div>
      <div
        onClick={() => {
          props.setConfirmedRidePanel(true);
          props.setVehicle("three-wheeler");
        }}
        className="flex border-2 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between"
      >
        <img className="h-11  px-3" src="/images/Auto.png" alt="" />
        <div className="w-1/2 px-3">
          <h4 className="font-medium text-sm">
            UberAuto{" "}
            <span>
              <i className="ri-user-3-fill">3</i>
            </span>
          </h4>
          <h5 className="font-medium text-lg">4 mins away</h5>
          <p className="font-normal text-xs text-gray-600">
            Affordable, Auto rides
          </p>
        </div>
        <h2 className="text-xl font-semibold">
          {props.fare.auto !== undefined ? `₹${props.fare.auto}` : "—"}
        </h2>
      </div>
    </div>
  );
};

export default VehiclePanel;
