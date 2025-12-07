import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // localStorage.clear();

  const [userData, setUserdata] = useState(null);

  useEffect(() => {
    setLocalStorage();
    const { employees,admin} = getLocalStorage();
    setUserdata(employees);
  }, []);

  return (
    <div>
      <AuthContext.Provider value={[userData,setUserdata]}>{children}</AuthContext.Provider>
    </div>
  );
};

export default AuthProvider;
