// app/context/UserContext.js
import React, { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

import useGetLoggedInAdmin from "../hooks/useAdminLoggedIn";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { getLoggedInAdmin, data, loading } = useGetLoggedInAdmin();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getLoggedInAdmin(token);
    } else {
      router.push("/");
    }
  }, [router]);

  return (
    <UserContext.Provider value={{ user: data.admin, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
