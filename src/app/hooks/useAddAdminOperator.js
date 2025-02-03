"use client";
import { useState } from "react";
import { toast } from "react-toastify";

import useFetchAPI from "./useFetch";

const useAddAdminOperator = () => {
  const fetchAPI = useFetchAPI();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   *
   * @param {*} token
   * @param {*} data
   */

  const addAdminOperator = async (token, data) => {
    try {
      setLoading(true);
      const response = await fetchAPI(`api/v1/admin/add-operator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
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

  return { addAdminOperator, data, loading };
};

export default useAddAdminOperator;
