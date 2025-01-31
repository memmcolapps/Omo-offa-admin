"use client";
import useFetchAPI from "./useFetch";
import { useState } from "react";
import { toast } from "react-toastify";

const useLogin = () => {
  const fetchAPI = useFetchAPI();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetchAPI("api/v1/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();

      setData(responseData);
    } catch (error) {
      const networkError = error.message || "Network error";
      toast.error(networkError);
      console.error("Network Error:", networkError);
    } finally {
      setLoading(false);
    }
  };

  return { login, data, loading };
};

export default useLogin;
