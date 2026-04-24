import { createContext, useEffect, useState } from "react";
import { connectSocket } from "../socket/socket";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  //  LOAD USER FROM LOCALSTORAGE ON APP START
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  //  SOCKET
  useEffect(() => {
    if (user?._id) {
      connectSocket(user);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};