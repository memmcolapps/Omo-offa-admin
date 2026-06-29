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
import { isCompleteAdmin } from "../utils/adminAccess";
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
        const parsedAdmin = JSON.parse(cachedAdmin);
        if (isCompleteAdmin(parsedAdmin)) {
          setUser(parsedAdmin);
          setStatus("authenticated");
        } else {
          localStorage.removeItem("admin");
        }
      } catch {
        localStorage.removeItem("admin");
      }
    }

    getLoggedInAdmin(token)
      .then((response) => {
        if (!isCompleteAdmin(response?.admin)) {
          throw new Error("Admin account is missing permission data");
        }
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
