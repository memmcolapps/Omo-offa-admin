"use client";
import useFetchAPI from "./useFetch";
import { useState } from "react";
import { toast } from "react-toastify";

const useGetUsers = () => {
  const fetchAPI = useFetchAPI();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   *
   * @param {*} status
   * @param {*} token
   */

  const getUsers = async (status, token, page, limit) => {
    try {
      setLoading(true);
      const response = await fetchAPI(
        `api/v1/user/all-users-flag?status=${status}&page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  return { getUsers, data, loading };
};

export default useGetUsers;
