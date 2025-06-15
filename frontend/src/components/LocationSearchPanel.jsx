import React from "react";

const LocationSearchPanel = (props) => {
  // sample array for location
  const locations = [
    "24B, Near Kapoor's Cafe, Shreyians Coding School, Bhopal",
    "25A, Opposite City Mall, Bhopal",
    "26C, Next to Central Park, Bhopal",
    "27D, Behind Tech Park, Bhopal",
    "28E, Near Lake View Hotel, Bhopal",
    "29F, Close to Railway Station, Bhopal",
  ];
  return (
    <div>
      {/*this is just a sample data*/}
      {locations.map(function (elem, idx) {
        return (
          <div
            key={idx}
            onClick={() => {
              props.setvehiclePanel(true);
              props.setpanelOpen(false);
            }}
            className="flex gap-4 border-2 p-3 border-gray-100 active:border-black rounded-xl items-center my-2 justify-start"
          >
            <h2 className="bg-[#eee] h-8 w-12 flex items-center justify-center rounded-full">
              <i className="ri-map-pin-fill"></i>
            </h2>
            <h4 className="font-medium">{elem}</h4>
          </div>
        );
      })}
    </div>
  );
};

export default LocationSearchPanel;
