import React from "react";

const LocationSearchPanel = ({
  suggestions = [],
  onSuggestionClick,
  panelOpen,
  setpanelOpen,
  setvehiclePanel,
}) => {
  return (
    <div>
      {suggestions.length === 0 && (
        <div className="text-gray-400 p-4">No suggestions found.</div>
      )}
      {suggestions.map((elem, idx) => (
        <div
          key={idx}
          onClick={() => {
            onSuggestionClick(elem.name);
            // setvehiclePanel(true);
            // setpanelOpen(false);
          }}
          className="flex gap-4 border-2 p-3 border-gray-100 active:border-black rounded-xl items-center my-2 justify-start"
        >
          <h2 className="bg-[#eee] h-8 w-12 flex items-center justify-center rounded-full">
            <i className="ri-map-pin-fill"></i>
          </h2>
          <h4 className="font-medium">{elem.name}</h4>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
