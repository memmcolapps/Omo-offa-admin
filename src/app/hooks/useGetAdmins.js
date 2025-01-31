"use client";
import useFetchAPI from "./useFetch";
import { useState } from "react";
import { toast } from "react-toastify";

const useGetAdmins = () => {
  const fetchAPI = useFetchAPI();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   *
   * @param {*} token
   */

  const getAdmins = async (token) => {
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
  };

  return { getAdmins, data, loading };
};

export default useGetAdmins;
