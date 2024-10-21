"use client";
import useFetchAPI from "./useFetch";
import { useState } from "react";
import { toast } from "react-toastify";

const useGetDashboard = () => {
  const fetchAPI = useFetchAPI();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   *
   * @param {*} token
   */

  const getDashboard = async (token) => {
    try {
      setLoading(true);
      const response = await fetchAPI(`api/v1/admin/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();
      console.log(responseData);

      setData(responseData);
    } catch (error) {
      const networkError = error.message || "Network error";
      toast.error(networkError);
      console.error("Network Error:", networkError);
    } finally {
      setLoading(false);
    }
  };

  return { getDashboard, data, loading };
};

export default useGetDashboard;
