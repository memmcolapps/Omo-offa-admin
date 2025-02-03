"use client";
import { useState } from "react";
import { toast } from "react-toastify";

import useFetchAPI from "./useFetch";

const useGetLoggedInAdmin = () => {
  const fetchAPI = useFetchAPI();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   *
   * @param {*} token
   */

  const getLoggedInAdmin = async (token) => {
    try {
      setLoading(true);
      const response = await fetchAPI(`api/v1/admin/get-logged-in-admin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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

  return { getLoggedInAdmin, data, loading };
};

export default useGetLoggedInAdmin;
