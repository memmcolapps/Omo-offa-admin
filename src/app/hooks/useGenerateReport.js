"use client";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import useFetchAPI from "./useFetch";

/**
 * Hook for generating reports with proper error handling and loading states
 * @returns {Object} Object containing generateReport function, data, loading and error states
 */
const useGenerateReport = () => {
  const fetchAPI = useFetchAPI();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = useCallback(
    async (token, requestData) => {
      if (!token) {
        const error = new Error("Authentication token is required");
        setError(error);
        throw error;
      }

      try {
        setLoading(true);
        setError(null);
        setData(null);

        const response = await fetchAPI("api/v1/admin/generate-report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        // Validate response structure
        if (!responseData || typeof responseData.success !== "boolean") {
          throw new Error("Invalid response format from server");
        }

        if (responseData.success) {
          setData(responseData.report); // Fallback to full response if .data isn't present
          toast.success("Report generated successfully");
          return responseData.report;
        } else {
          const errorMessage =
            responseData.message || "Failed to generate report";
          throw new Error(errorMessage);
        }
      } catch (error) {
        const errorMessage = error.message || "Failed to generate report";
        setError(error);
        toast.error(errorMessage);
        throw error; // Re-throw to allow component-level handling
      } finally {
        setLoading(false);
      }
    },
    [fetchAPI]
  );

  const resetState = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    generateReport,
    data,
    loading,
    error,
    resetState,
  };
};

export default useGenerateReport;
