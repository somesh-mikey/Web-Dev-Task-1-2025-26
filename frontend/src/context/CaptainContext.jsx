import { createContext, useState, useContext } from "react";

export const CaptainDataContext = createContext(null);

export const CaptainContext = ({ children }) => {
  const [captain, setCaptain] = useState(null);

  const loginCaptain = (captainData) => {
    setCaptain(captainData);
  };

  const logoutCaptain = () => {
    setCaptain(null);
  };

  return (
    <CaptainDataContext.Provider
      value={{ captain, loginCaptain, logoutCaptain, setCaptain }}
    >
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainContext;
