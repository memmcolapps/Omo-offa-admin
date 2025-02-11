"use client";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import useFetchAPI from "./useFetch";

/**
 * Custom hook for fetching admin logs with pagination and filtering
 * @returns {Object} Hook methods and state
 */
const useGetLogs = () => {
  const fetchAPI = useFetchAPI();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetches admin logs with pagination and optional filtering
   * @param {string} token - Authentication token
   * @param {number} page - Current page number
   * @param {number} limit - Items per page
   * @param {string} [filter] - Optional search filter
   */
  const getLogs = useCallback(async (token, page, limit, filter = "") => {
    if (!token) {
      setError(new Error("Authentication token is required"));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filter && { filter }),
      });

      const response = await fetchAPI(`api/v1/admin/logs?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (!responseData || typeof responseData !== "object") {
        throw new Error("Invalid response format");
      }

      setData(responseData);
    } catch (error) {
      const errorMessage =
        error.message || "An error occurred while fetching logs";
      setError(error);
      toast.error(errorMessage);
      console.error("Log Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, []); 

  return {
    getLogs,
    data,
    loading,
    error,
    // Helper method to clear error state if needed
    clearError: useCallback(() => setError(null), []),
  };
};

export default useGetLogs;
