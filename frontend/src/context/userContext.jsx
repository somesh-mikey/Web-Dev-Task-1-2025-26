import React, { createContext } from "react";
import { useState } from "react";

export const UserDataContext = createContext();

const userContext = ({ children }) => {
  const [User, setUser] = useState({
    email: "",
    fullname: {
      firstName: "",
      lastName: "",
    },
  });

  return (
    <div>
      <UserDataContext.Provider value={{ User }}>
        {children}
      </UserDataContext.Provider>
    </div>
  );
};

export default userContext;
