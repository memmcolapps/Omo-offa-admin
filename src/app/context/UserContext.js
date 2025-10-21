// app/context/UserContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

import useGetLoggedInAdmin from "../hooks/useAdminLoggedIn";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { getLoggedInAdmin, data, loading } = useGetLoggedInAdmin();
  const router = useRouter();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run once on mount
    if (hasInitialized.current) return;

    const token = localStorage.getItem("token");
    if (token) {
      hasInitialized.current = true;
      getLoggedInAdmin(token);
    } else {
      router.push("/");
    }
  }, []); // Empty dependency array to run only once

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user: data?.admin || null,
      loading: loading || false,
    }),
    [data?.admin, loading]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
