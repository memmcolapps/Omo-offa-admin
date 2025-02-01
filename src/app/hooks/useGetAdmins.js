"use client";
import { useState, useCallback } from "react";
import useFetchAPI from "./useFetch";
import { toast } from "react-toastify";

const useGetAdmins = () => {
  const fetchAPI = useFetchAPI();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * Fetch admins using the provided token.
   */
  const getAdmins = useCallback(async (token) => {
    try {
      setLoading(true);
      const response = await fetchAPI(`api/v1/admin/get-operators`, {
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
  }, []); // Now fetchAPI is stable, so getAdmins remains stable as well

  return { getAdmins, data, loading };
};

export default useGetAdmins;
