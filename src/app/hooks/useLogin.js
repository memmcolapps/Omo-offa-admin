"use client";
import { useState } from "react";

import useFetchAPI from "./useFetch";

const useLogin = () => {
  const fetchAPI = useFetchAPI();
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
      if (!responseData.success || !responseData.token) {
        throw new Error(responseData.error || "Login failed");
      }

      return responseData;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};

export default useLogin;
