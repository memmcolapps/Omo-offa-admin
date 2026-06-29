// app/context/UserContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import useGetLoggedInAdmin from "../hooks/useAdminLoggedIn";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { getLoggedInAdmin } = useGetLoggedInAdmin();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("unauthenticated");
      router.replace("/");
      return;
    }

    const cachedAdmin = localStorage.getItem("admin");
    if (cachedAdmin) {
      try {
        setUser(JSON.parse(cachedAdmin));
        setStatus("authenticated");
      } catch {
        localStorage.removeItem("admin");
      }
    }

    getLoggedInAdmin(token)
      .then((response) => {
        if (!response?.admin) throw new Error("Admin account not found");
        setUser(response.admin);
        localStorage.setItem("admin", JSON.stringify(response.admin));
        setStatus("authenticated");
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        setUser(null);
        setStatus("unauthenticated");
        router.replace("/");
      });
  }, [getLoggedInAdmin, router]);

  const contextValue = useMemo(
    () => ({
      user,
      status,
      loading: status === "checking",
    }),
    [user, status]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
