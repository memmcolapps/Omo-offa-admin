"use client";
import useFetchAPI from "./useFetch";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const useGetLogs = () => {
  const fetchAPI = useFetchAPI();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   *
   * @param {*} token
   */

  const getLogs = useCallback(async (token, page, limit) => {
    try {
      setLoading(true);
      const response = await fetchAPI(
        `api/v1/admin/logs?page=${page}&limit=${limit}`,
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
  }, []);

  return { getLogs, data, loading };
};

export default useGetLogs;
