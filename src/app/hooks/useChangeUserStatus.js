"use client";
import useFetchAPI from "./useFetch";
import { useState } from "react";
import { toast } from "react-toastify";

const useChangeUserStatus = () => {
  const fetchAPI = useFetchAPI();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  /**
   *
   * @param {*} userId
   * @param {*} status
   * @param {*} token
   */

  const changeStatus = async (userId, status, token) => {
    try {
      setLoading(true);
      const response = await fetchAPI("api/v1/admin/change-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, status }),
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

  return { changeStatus, data, loading };
};

export default useChangeUserStatus;
