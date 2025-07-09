import React, { createContext, useState, useEffect } from 'react'

export const UserDataContext = createContext()

export const UserDataProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (
      user &&
      (typeof user !== "object" || !user._id || typeof user._id !== "string")
    ) {
      setUser(null);
      localStorage.removeItem("user");
      console.error("Corrupted user found in context/localStorage, clearing.");
    }
  }, [user]);

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  )
}