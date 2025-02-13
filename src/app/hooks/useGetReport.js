"use client";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import useFetchAPI from "./useFetch";

const useGetReport = () => {
  const fetchAPI = useFetchAPI();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  /**
   *
   * @param {*} token
   * @param {*} id
   */

  const getReport = useCallback(async (token, reportType) => {
    try {
      setLoading(true);
      const response = await fetchAPI(`api/v1/admin/report-summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reportType }),
      });

      const responseData = await response.json();

      setData(responseData);
    } catch (error) {
      const networkError = error.message || "Network error";
      toast.error(networkError);
    } finally {
      setLoading(false);
    }
  }, []);

  return { getReport, data, loading };
};

export default useGetReport;
