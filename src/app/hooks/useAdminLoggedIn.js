"use client";
import { useState, useCallback } from "react";

import useFetchAPI from "./useFetch";

const useGetLoggedInAdmin = () => {
  const fetchAPI = useFetchAPI();
  const [loading, setLoading] = useState(true);

  /**
   *
   * @param {*} token
   */

  const getLoggedInAdmin = useCallback(
    async (token) => {
      try {
        setLoading(true);
        const response = await fetchAPI(`api/v1/admin/get-logged-in-admin`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = await response.json();
        return responseData;
      } finally {
        setLoading(false);
      }
    },
    [fetchAPI]
  );

  return { getLoggedInAdmin, loading };
};

export default useGetLoggedInAdmin;
