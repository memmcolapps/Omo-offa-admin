"use client";
import useFetchAPI from "./useFetch";
import { useCallback, useState } from "react";
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

  const getUsers = useCallback(
    async (status, token, page, limit, search = "") => {
      try {
        setLoading(true);
        const query = new URLSearchParams({
          status,
          page: String(page),
          limit: String(limit),
        });
        if (search.trim()) query.set("search", search.trim());

        const response = await fetchAPI(
          `api/v1/user/all-users-flag?${query.toString()}`,
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
    },
    [fetchAPI]
  );

  return { getUsers, data, loading };
};

export default useGetUsers;
